//! Transforms a single book into a book by
//! reading it and it's dependencies. In the end
//! it returns a desugared book of all of the
//! depedencies.

use kind_pass::erasure::{self};
use kind_tree::desugared;
use std::collections::HashSet;
use std::fs;
use std::path::{Path, PathBuf};
use std::rc::Rc;
use strsim::jaro;

use kind_pass::unbound::{self};
use kind_pass::{desugar, expand};
use kind_report::data::DiagnosticFrame;
use kind_tree::concrete::{Book, Module, TopLevel};
use kind_tree::symbol::{Ident, QualifiedIdent};

use crate::{errors::DriverError, session::Session};

/// The extension of kind2 files.
const EXT: &str = "kind2";

/// Tries to accumulate on a buffer all of the
/// paths that exists (so we can just throw an
/// error about ambiguous resolution to the user)
fn accumulate_neighbour_paths(raw_path: &Path, other: &mut Vec<PathBuf>) {
    let mut canon_path = raw_path.to_path_buf();
    canon_path.set_extension(EXT);

    if canon_path.is_file() {
        other.push(canon_path);
    }

    let mut deferred_path = raw_path.to_path_buf();
    deferred_path.push("_");
    deferred_path.set_extension(EXT);

    if deferred_path.is_file() {
        other.push(deferred_path);
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

    let mut paths = Vec::new();
    accumulate_neighbour_paths(&raw_path, &mut paths);

    // TODO: Check if impacts too much while trying to search
    if search_on_parent {
        raw_path.pop();
        accumulate_neighbour_paths(&raw_path, &mut paths);
    }

    if paths.is_empty() {
        Ok(None)
    } else if paths.len() == 1 {
        Ok(Some(paths[0].clone()))
    } else {
        Err(DriverError::MultiplePaths(ident.clone(), paths).into())
    }
}

fn try_to_insert_new_name<'a>(session: &'a Session, ident: QualifiedIdent, book: &'a mut Book) {
    if let Some(first_occorence) = book.names.get(ident.to_string().as_str()) {
        session
            .diagnostic_sender
            .send(DriverError::DefinedMultipleTimes(first_occorence.clone(), ident).into())
            .unwrap();
    } else {
        book.names.insert(ident.to_string(), ident);
    }
}

fn module_to_book<'a>(
    session: &'a Session,
    module: &Module,
    book: &'a mut Book,
) -> HashSet<String> {
    let mut public_names = HashSet::new();

    for entry in &module.entries {
        match &entry {
            TopLevel::SumType(sum) => {
                public_names.insert(sum.name.to_string());
                try_to_insert_new_name(session, sum.name.clone(), book);
                book.count
                    .insert(sum.name.to_string(), sum.extract_book_info());

                book.entries.insert(sum.name.to_string(), entry.clone());

                for cons in &sum.constructors {
                    let cons_ident = sum.name.add_segment(cons.name.to_str());
                    public_names.insert(cons_ident.to_string());
                    book.count
                        .insert(cons_ident.to_string(), cons.extract_book_info(sum));
                    try_to_insert_new_name(session, cons_ident, book);
                }
            }
            TopLevel::RecordType(rec) => {
                public_names.insert(rec.name.to_string());
                book.count
                    .insert(rec.name.to_string(), rec.extract_book_info());
                try_to_insert_new_name(session, rec.name.clone(), book);

                book.entries.insert(rec.name.to_string(), entry.clone());

                let cons_ident = rec.name.add_segment(rec.constructor.to_str());
                public_names.insert(cons_ident.to_string());
                book.count.insert(
                    cons_ident.to_string(),
                    rec.extract_book_info_of_constructor(),
                );
                try_to_insert_new_name(session, cons_ident, book);
            }
            TopLevel::Entry(entr) => {
                try_to_insert_new_name(session, entr.name.clone(), book);
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
    if session.loaded_paths_map.contains_key(path) {
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

    session.add_path(Rc::new(path.to_path_buf()), input.clone());

    let (mut module, mut failed) =
        kind_parser::parse_book(session.diagnostic_sender.clone(), ctx_id, &input);

    let (_, unbound_top_level) =
        unbound::get_module_unbound(session.diagnostic_sender.clone(), &mut module);

    for idents in unbound_top_level.values() {
        failed |= parse_and_store_book_by_identifier(session, &idents[0], book);
    }

    module_to_book(session, &module, book);

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

    let mut failed = parse_and_store_book_by_path(session, path, &mut book);

    let (unbounds, unbounded_top) = unbound::get_book_unbound(session.diagnostic_sender.clone(), &mut book);

    for idents in unbounds.values() {
        unbound_variable(session, &book, idents);
        failed = true;
    }

    for idents in unbounded_top.values() {
        if !book.entries.contains_key(&idents[0].to_string()) {
            let vec = idents.iter().map(|x| x.to_ident()).collect::<Vec<Ident>>();
            unbound_variable(session, &book, vec.as_slice());
            failed = true;
        }
    }

    if !unbounds.is_empty() || failed {
        None
    } else {
        Some(book)
    }
}

pub fn type_check_book(session: &mut Session, path: &PathBuf) -> Option<desugared::Book> {
    let mut concrete_book = parse_and_store_book(session, path)?;

    expand::expand_book(&mut concrete_book);

    let desugared_book = desugar::desugar_book(session.diagnostic_sender.clone(), &concrete_book)?;

    let succeeded = kind_checker::type_check(&desugared_book, session.diagnostic_sender.clone());

    if !succeeded {
        return None;
    }

    let erased = erasure::erase_book(
        &desugared_book,
        session.diagnostic_sender.clone(),
        HashSet::from_iter(vec!["Main".to_string()]),
    )?;

    Some(erased)
}

pub fn compile_book(session: &mut Session, path: &PathBuf) -> Option<()> {
    let book = type_check_book(session, path);
    match book {
        None => None,
        Some(book) => {
            println!("{}", kind_target_hvm::compile_book(book));
            Some(())
        }
    }
}
