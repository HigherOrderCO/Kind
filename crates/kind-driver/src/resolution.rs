//! Module for finding the required files and their dependencies,
//! loading them into a `concrete::Book`.

use core::fmt;
use fxhash::FxHashSet;
use kind_pass::expand::expand_module;
use kind_pass::expand::uses::expand_uses;
use std::error::Error;
use std::fs;
use std::path::{Path, PathBuf};
use std::rc::Rc;
use strsim::jaro;

use kind_pass::unbound::{self, UnboundCollector};
use kind_report::data::Diagnostic;
use kind_tree::concrete::visitor::Visitor;
use kind_tree::concrete::{Book, Module, TopLevel};
use kind_tree::symbol::{Ident, QualifiedIdent};

use crate::{diagnostic::DriverDiagnostic, session::Session};

/// The extension of kind2 files.
const EXT: &str = "kind2";
const DIR_FILE: &str = "_.kind2";
/// Whether names can be searched on the parent level files.
/// Eg: Searching for Data.Bool.True only on Data/Bool/True.kind or also on Data/Bool.kind
const SEARCH_IDENT_ON_PARENT: bool = true;

#[derive(Debug)]
pub struct ResolutionError;

impl fmt::Display for ResolutionError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "resolution error")
    }
}

impl Error for ResolutionError {}

/// Loads the module at `path` and all its dependencies into a new `concrete::Book`.
/// Returns the constructed `Book`.
///
/// On failure, sends any intermediate error diagnostics through `Session`
/// and returns a `ResolutionError`.
pub fn new_book_from_entry_file(session: &mut Session, entry: &PathBuf) -> anyhow::Result<Book> {
    let mut book = Book::default();
    if load_file_to_book(session, entry, &mut book, true) {
        Err(ResolutionError.into())
    } else {
        Ok(book)
    }
}

pub fn update_book_with_entry_file(
    session: &mut Session,
    book: &mut Book,
    entry: &PathBuf,
) -> anyhow::Result<()> {
    if load_file_to_book(session, entry, book, true) {
        Err(ResolutionError.into())
    } else {
        Ok(())
    }
}

/// Returns a list of all unbound top levels required in a file.
///
/// Returns `None` if it fails to read the file.
pub fn get_unbound_top_levels_in_file(session: &mut Session, path: &Path) -> Option<Vec<String>> {
    let tx = session.diagnostic_sender.clone();

    let input = read_file(session, path)?;

    let (mut module, _) = kind_parser::parse_book(tx.clone(), 0, &input);

    expand_uses(&mut module, tx.clone());
    expand_module(tx.clone(), &mut module);

    let mut state = UnboundCollector::new(tx.clone(), false);
    state.visit_module(&mut module);

    Some(state.unbound_top_level.keys().cloned().collect())
}

/// Checks for unbound variables and top levels in a book.
/// If any are found, returns `ResolutionError` and sends
/// diagnostics to `session`.
pub fn check_unbounds(session: &mut Session, book: &mut Book) -> anyhow::Result<()> {
    let mut failed = false;

    let (unbound_names, unbound_tops) =
        unbound::get_book_unbound(session.diagnostic_sender.clone(), book, true);

    for unbound in unbound_tops.values() {
        let res: Vec<Ident> = unbound
            .iter()
            .filter(|x| !x.generated)
            .map(|x| x.to_ident())
            .collect();

        if !res.is_empty() {
            send_unbound_variable_err(session, book, &res);
            failed = true;
        }
    }

    for unbound in unbound_names.values() {
        send_unbound_variable_err(session, book, unbound);
        failed = true;
    }

    if failed {
        Err(ResolutionError.into())
    } else {
        Ok(())
    }
}

/// Returns the path to the file that contains a given identifier,
/// or `None` if no available options were found.
///
/// In case more than one path is available,
/// return a `Diagnostic` indicating that.
fn ident_to_path(
    root: &Path,
    ident: &QualifiedIdent,
) -> Result<Option<PathBuf>, Box<dyn Diagnostic>> {
    // Data/Bool/True
    let relative_path = PathBuf::from(ident.to_str().replace('.', "/"));
    // root/Data/Bool/True
    let base_path = root.join(relative_path);

    // root/Data/Bool/True.kind2
    let file = base_path.with_extension(EXT);
    // root/Data/Bool/True/_.kind2
    let dir = base_path.join(DIR_FILE);
    let search_options = if SEARCH_IDENT_ON_PARENT {
        // root/Data/Bool.kind2
        let par_file = base_path.parent().unwrap().with_extension(EXT);
        // root/Data/Bool/_.kind2
        let par_dir = base_path.parent().unwrap().join(DIR_FILE);
        vec![file, dir, par_file, par_dir]
    } else {
        vec![file, dir]
    };
    // All the found paths that could contain the definition of this Identifier
    let available_paths: Vec<_> = search_options.into_iter().filter(|p| p.is_file()).collect();

    match available_paths.len() {
        0 => Ok(None),
        1 => Ok(Some(available_paths.into_iter().next().unwrap())),
        _ => Err(Box::new(DriverDiagnostic::MultiplePaths(
            ident.clone(),
            available_paths,
        ))),
    }
}

/// Tries to add `ident` to the list of names in `book`.
///
/// Fails in case `ident` was already present in `book`,
/// returning `false` and sending a `Diagnostic` to `session`.
fn try_to_insert_new_name<'a>(
    session: &'a Session,
    ident: QualifiedIdent,
    book: &'a mut Book,
) -> bool {
    if let Some(first_occorence) = book.names.get(ident.to_string().as_str()) {
        let err = Box::new(DriverDiagnostic::DefinedMultipleTimes(
            first_occorence.clone(),
            ident,
        ));

        session.diagnostic_sender.send(err).unwrap();
        false
    } else {
        book.names.insert(ident.to_string(), ident);
        true
    }
}

/// Add `module` to the preexisting `book`.
///
/// Returns a set of all public names defined in the module
/// and whether the operation failed.
///
/// Sends diagnostics of any errors to `session`.
fn module_to_book<'a>(
    session: &'a Session,
    module: Module,
    book: &'a mut Book,
) -> (FxHashSet<String>, bool) {
    let mut failed = false;
    let mut public_names = FxHashSet::default();

    for entry in module.entries {
        match entry {
            TopLevel::SumType(sum) => {
                let name = sum.name.to_string();

                public_names.insert(name.clone());

                for cons in &sum.constructors {
                    let mut cons_ident = sum.name.add_segment(cons.name.to_str());
                    cons_ident.range = cons.name.range;
                    if try_to_insert_new_name(session, cons_ident.clone(), book) {
                        let cons_name = cons_ident.to_string();
                        public_names.insert(cons_name.clone());
                        book.meta.insert(cons_name, cons.extract_book_info(&sum));
                    } else {
                        failed = true;
                    }
                }

                if try_to_insert_new_name(session, sum.name.clone(), book) {
                    book.meta.insert(name.clone(), sum.extract_book_info());
                    book.entries.insert(name, TopLevel::SumType(sum));
                } else {
                    failed = true;
                }
            }
            TopLevel::RecordType(rec) => {
                let name = rec.name.to_string();
                public_names.insert(name.clone());
                book.meta.insert(name.clone(), rec.extract_book_info());

                failed |= !try_to_insert_new_name(session, rec.name.clone(), book);

                let cons_ident = rec.name.add_segment(rec.constructor.to_str());
                public_names.insert(cons_ident.to_string());
                book.meta.insert(
                    cons_ident.to_string(),
                    rec.extract_book_info_of_constructor(),
                );

                failed |= !try_to_insert_new_name(session, cons_ident, book);

                book.entries.insert(name.clone(), TopLevel::RecordType(rec));
            }
            TopLevel::Entry(entr) => {
                let name = entr.name.to_string();

                failed |= !try_to_insert_new_name(session, entr.name.clone(), book);
                public_names.insert(name.clone());
                book.meta.insert(name.clone(), entr.extract_book_info());
                book.entries.insert(name, TopLevel::Entry(entr));
            }
        }
    }

    (public_names, failed)
}

/// Finds the file containing `ident` and loads it `book`.
/// Also loads all its dependencies recursively.
///
/// Returns `true` if any errors occur, sending diagnostics to `session`.
///
/// Returns `false` if there weren't any errors, even if the identifier
/// was already in book or no files were found to provide it or one of
/// its dependencies.
fn load_file_to_book_by_identifier(
    session: &mut Session,
    ident: &QualifiedIdent,
    book: &mut Book,
) -> bool {
    if book.entries.contains_key(ident.to_string().as_str()) {
        return false;
    }
    match ident_to_path(&session.root, ident) {
        Ok(Some(path)) => load_file_to_book(session, &path, book, false),
        Ok(None) => false,
        Err(err) => {
            session.diagnostic_sender.send(err).unwrap();
            true
        }
    }
}

/// Wrapper around `fs::read_to_string`
/// that consumes any errors and sends a `Diagnostic` to `session` instead.
fn read_file(session: &mut Session, path: &Path) -> Option<String> {
    match fs::read_to_string(path) {
        Ok(res) => Some(res),
        Err(_) => {
            session
                .diagnostic_sender
                .send(Box::new(DriverDiagnostic::CannotFindFile(
                    path.to_str().unwrap().to_string(),
                )))
                .unwrap();
            None
        }
    }
}

/// Parses the file given by `path`, adds the module to `book` and also
/// loads all its dependencies recursively. `immediate` indicates whether
/// this is running on the first recursion, and should be initially set
/// to `true`.
///
/// Returns `true` if any errors occur, sending diagnostics to `session`.
///
/// Returns `false` if there weren't any errors, even if the identifier
/// was already in book or no files were found to provide it or one of
/// its dependencies.
fn load_file_to_book(
    session: &mut Session,
    path: &PathBuf,
    book: &mut Book,
    immediate: bool,
) -> bool {
    if !path.exists() {
        let err = Box::new(DriverDiagnostic::CannotFindFile(
            path.to_str().unwrap().to_string(),
        ));

        session.diagnostic_sender.send(err).unwrap();
        return true;
    }

    let canon_path = &fs::canonicalize(path).unwrap();

    if session.loaded_paths_map.contains_key(canon_path) {
        return false;
    }

    let Some(input) = read_file(session, path) else { return true };

    let ctx_id = session.book_counter;
    session.add_path(Rc::new(fs::canonicalize(path).unwrap()), input.clone());

    let tx = session.diagnostic_sender.clone();

    let (mut module, mut failed) = kind_parser::parse_book(tx.clone(), ctx_id, &input);

    expand_uses(&mut module, tx.clone());
    expand_module(tx.clone(), &mut module);

    let mut state = UnboundCollector::new(tx.clone(), false);
    state.visit_module(&mut module);

    let (_, module_failed) = module_to_book(session, module, book);
    failed |= module_failed;

    for idents in state.unbound_top_level.values() {
        let fst = idents.iter().next().unwrap();

        if immediate && session.show_immediate_deps {
            println!("{}", fst);
        }

        if !book.names.contains_key(&fst.to_string()) {
            failed |= load_file_to_book_by_identifier(session, fst, book);
        }
    }

    failed
}

/// Sends an unbound variable error to `session`
/// relating the found unbound names to similar names that they could be a misspelling of.
fn send_unbound_variable_err(session: &mut Session, book: &Book, idents: &[Ident]) {
    let mut similar_names = book
        .names
        .keys()
        .map(|x| (jaro(x, idents[0].to_str()).abs(), x))
        .filter(|x| x.0 > 0.8)
        .collect::<Vec<_>>();

    similar_names.sort_by(|x, y| x.0.total_cmp(&y.0));

    let err = Box::new(DriverDiagnostic::UnboundVariable(
        idents.to_vec(),
        similar_names.iter().take(5).map(|x| x.1.clone()).collect(),
    ));

    session.diagnostic_sender.send(err).unwrap();
}
