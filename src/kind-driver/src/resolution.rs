//! Transforms a single book into a book by
//! reading it and it's dependencies. In the end
//! it returns a desugared book of all of the
//! depedencies.

use kind_pass::expand::uses::expand_uses;
use std::collections::HashSet;
use std::fs;
use std::path::{Path, PathBuf};
use std::rc::Rc;
use strsim::jaro;

use kind_pass::unbound::{self};
use kind_report::data::DiagnosticFrame;
use kind_tree::concrete::{Book, Module, TopLevel};
use kind_tree::symbol::{Ident, QualifiedIdent};

use crate::{errors::DriverError, session::Session};

/// The extension of kind2 files.
const EXT: &str = "kind2";

/// Tries to accumulate on a buffer all of the
/// paths that exists (so we can just throw an
/// error about ambiguous resolution to the user)
fn accumulate_neighbour_paths(
    ident: &QualifiedIdent,
    raw_path: &Path,
) -> Result<Option<PathBuf>, DiagnosticFrame> {
    let mut canon_path = raw_path.to_path_buf();
    let mut dir_file_path = raw_path.to_path_buf();
    let dir_path = raw_path.to_path_buf();

    canon_path.set_extension(EXT);
    dir_file_path.push("_");
    dir_file_path.set_extension(EXT);

    if canon_path.exists() && dir_path.exists() && canon_path.is_file() && dir_path.is_dir() {
        Err(DriverError::MultiplePaths(ident.clone(), vec![canon_path, dir_path]).into())
    } else if canon_path.is_file() {
        Ok(Some(canon_path))
    } else if dir_file_path.is_file() {
        Ok(Some(dir_file_path))
    } else {
        Ok(None)
    }
}

/// Gets an identifier and tries to get all of the
/// paths that it can refer into a single path. If
/// multiple paths are found then we just throw an
/// error about ambiguous paths.
fn ident_to_path(
    root: &Path,
    ident: &QualifiedIdent,
    search_on_parent: bool,
) -> Result<Option<PathBuf>, DiagnosticFrame> {
    let name = ident.root.to_string();
    let segments = name.as_str().split('.').collect::<Vec<&str>>();
    let mut raw_path = root.to_path_buf();
    raw_path.push(PathBuf::from(segments.join("/")));

    match accumulate_neighbour_paths(&ident, &raw_path) {
        Ok(None) if search_on_parent => {
            raw_path.pop();
            accumulate_neighbour_paths(&ident, &raw_path)
        }
        rest => rest,
    }
}

fn try_to_insert_new_name<'a>(
    failed: &mut bool,
    session: &'a Session,
    ident: QualifiedIdent,
    book: &'a mut Book,
) -> bool {
    if let Some(first_occorence) = book.names.get(ident.to_string().as_str()) {
        session
            .diagnostic_sender
            .send(DriverError::DefinedMultipleTimes(first_occorence.clone(), ident).into())
            .unwrap();
        *failed = true;
        false
    } else {
        book.names.insert(ident.to_string(), ident);
        true
    }
}

fn module_to_book<'a>(
    failed: &mut bool,
    session: &'a Session,
    module: &Module,
    book: &'a mut Book,
) -> HashSet<String> {
    let mut public_names = HashSet::new();

    for entry in &module.entries {
        match &entry {
            TopLevel::SumType(sum) => {
                public_names.insert(sum.name.to_string());
                if try_to_insert_new_name(failed, session, sum.name.clone(), book) {
                    book.count
                        .insert(sum.name.to_string(), sum.extract_book_info());
                    book.entries.insert(sum.name.to_string(), entry.clone());
                }

                for cons in &sum.constructors {
                    let mut cons_ident = sum.name.add_segment(cons.name.to_str());
                    cons_ident.range = cons.name.range.clone();
                    if try_to_insert_new_name(failed, session, cons_ident.clone(), book) {
                        public_names.insert(cons_ident.to_string());
                        book.count
                            .insert(cons_ident.to_string(), cons.extract_book_info(sum));
                    }
                }
            }
            TopLevel::RecordType(rec) => {
                public_names.insert(rec.name.to_string());
                book.count
                    .insert(rec.name.to_string(), rec.extract_book_info());
                try_to_insert_new_name(failed, session, rec.name.clone(), book);

                book.entries.insert(rec.name.to_string(), entry.clone());

                let cons_ident = rec.name.add_segment(rec.constructor.to_str());
                public_names.insert(cons_ident.to_string());
                book.count.insert(
                    cons_ident.to_string(),
                    rec.extract_book_info_of_constructor(),
                );
                try_to_insert_new_name(failed, session, cons_ident, book);
            }
            TopLevel::Entry(entr) => {
                try_to_insert_new_name(failed, session, entr.name.clone(), book);
                public_names.insert(entr.name.to_string());
                book.count
                    .insert(entr.name.to_string(), entr.extract_book_info());
                book.entries.insert(entr.name.to_string(), entry.clone());
            }
        }
    }

    public_names
}

fn parse_and_store_book_by_identifier<'a>(
    session: &mut Session,
    ident: &QualifiedIdent,
    book: &'a mut Book,
) -> bool {
    if book.entries.contains_key(ident.to_string().as_str()) {
        return false;
    }

    match ident_to_path(&session.root, ident, true) {
        Ok(Some(path)) => parse_and_store_book_by_path(session, &path, book),
        Ok(None) => false,
        Err(err) => {
            session.diagnostic_sender.send(err).unwrap();
            true
        }
    }
}

fn parse_and_store_book_by_path<'a>(
    session: &mut Session,
    path: &PathBuf,
    book: &'a mut Book,
) -> bool {
    if !path.exists() {
        session
            .diagnostic_sender
            .send(DriverError::CannotFindFile(path.to_str().unwrap().to_string()).into())
            .unwrap();
        return true;
    }

    if session
        .loaded_paths_map
        .contains_key(&fs::canonicalize(path).unwrap())
    {
        return false;
    }

    let input = match fs::read_to_string(path) {
        Ok(res) => res,
        Err(_) => {
            session
                .diagnostic_sender
                .send(DriverError::CannotFindFile(path.to_str().unwrap().to_string()).into())
                .unwrap();
            return true;
        }
    };

    let ctx_id = session.book_counter;
    session.add_path(Rc::new(fs::canonicalize(path).unwrap()), input.clone());

    let (mut module, mut failed) =
        kind_parser::parse_book(session.diagnostic_sender.clone(), ctx_id, &input);

    let (unbound_vars, unbound_top_level) =
        unbound::get_module_unbound(session.diagnostic_sender.clone(), &mut module, false);

    for idents in unbound_vars.values() {
        unbound_variable(session, book, idents);
        failed = true;
    }

    for idents in unbound_top_level.values() {
        failed |= parse_and_store_book_by_identifier(session, &idents.iter().nth(0).unwrap(), book);
    }

    expand_uses(&mut module, session.diagnostic_sender.clone());

    module_to_book(&mut failed, session, &module, book);

    failed
}

fn unbound_variable(session: &mut Session, book: &Book, idents: &[Ident]) {
    let similar_names = book
        .names
        .keys()
        .filter(|x| jaro(x, idents[0].to_string().as_str()).abs() > 0.8)
        .cloned()
        .collect();
    session
        .diagnostic_sender
        .send(DriverError::UnboundVariable(idents.to_vec(), similar_names).into())
        .unwrap();
}

pub fn parse_and_store_book(session: &mut Session, path: &PathBuf) -> Option<Book> {
    let mut book = Book::default();
    if parse_and_store_book_by_path(session, path, &mut book) {
        None
    } else {
        Some(book)
    }
}

pub fn check_unbound_top_level(session: &mut Session, book: &mut Book) -> bool {
    let mut failed = false;

    let (_, unbound_tops) =
        unbound::get_book_unbound(session.diagnostic_sender.clone(), book, true);

    for (_, unbound) in unbound_tops {
        let res: Vec<Ident> = unbound.iter().map(|x| x.to_ident()).collect();
        if !res.is_empty() {
            unbound_variable(session, &book, &res);
            failed = true;
        }
    }

    failed
}
