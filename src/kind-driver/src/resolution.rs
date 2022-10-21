//! Transforms a single book into a glossary by
//! reading it and it's dependencies. In the end
//! it returns a desugared glossary of all of the
//! depedencies.

use std::collections::HashSet;
use std::fs;
use std::path::{Path, PathBuf};
use std::rc::Rc;

use kind_pass::desugar;
use kind_pass::unbound::{self};
use kind_report::data::DiagnosticFrame;
use kind_span::Range;
use kind_tree::concrete::Glossary;
use kind_tree::concrete::TopLevel;
use kind_tree::{concrete::Book, symbol::Ident};
use strsim::jaro;

use crate::{errors::DriverError, session::Session};

use kind_checker::{type_check};

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
    ident: &Ident,
    search_on_parent: bool,
) -> Result<Option<PathBuf>, DiagnosticFrame> {
    let segments = ident.to_str().split('.').collect::<Vec<&str>>();
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

fn try_to_insert_new_name<'a>(session: &'a Session, ident: Ident, glossary: &'a mut Glossary) {
    if let Some(first_occorence) = glossary.names.get(ident.to_str()) {
        session
            .diagnostic_sender
            .send(DriverError::DefinedMultipleTimes(first_occorence.clone(), ident).into())
            .unwrap();
    } else {
        glossary.names.insert(ident.to_str().clone(), ident);
    }
}

fn book_to_glossary<'a>(
    session: &'a Session,
    book: Rc<Book>,
    glossary: &'a mut Glossary,
) -> HashSet<String> {
    let mut public_names = HashSet::new();

    for entry in &book.entries {
        match &entry {
            TopLevel::SumType(sum) => {
                public_names.insert(sum.name.to_str().clone());
                try_to_insert_new_name(session, sum.name.clone(), glossary);
                glossary
                    .count
                    .insert(sum.name.to_str().clone(), sum.extract_glossary_info());

                glossary
                    .entries
                    .insert(sum.name.to_str().clone(), entry.clone());

                for cons in &sum.constructors {
                    let cons_ident = cons.name.add_base_ident(sum.name.to_str());
                    public_names.insert(cons_ident.to_str().clone());
                    glossary
                        .count
                        .insert(cons_ident.to_str().clone(), cons.extract_glossary_info(sum));
                    try_to_insert_new_name(session, cons_ident, glossary);
                }
            }
            TopLevel::RecordType(rec) => {
                public_names.insert(rec.name.to_str().clone());
                glossary
                    .count
                    .insert(rec.name.to_str().clone(), rec.extract_glossary_info());
                try_to_insert_new_name(session, rec.name.clone(), glossary);

                glossary
                    .entries
                    .insert(rec.name.to_str().clone(), entry.clone());

                let cons_ident = rec.constructor.add_base_ident(rec.name.to_str());
                public_names.insert(cons_ident.to_str().clone());
                glossary.count.insert(
                    cons_ident.to_str().clone(),
                    rec.extract_glossary_info_of_constructor(),
                );
                try_to_insert_new_name(session, cons_ident, glossary);
            }
            TopLevel::Entry(entr) => {
                try_to_insert_new_name(session, entr.name.clone(), glossary);
                public_names.insert(entr.name.to_str().clone());
                glossary
                    .count
                    .insert(entr.name.to_str().clone(), entr.extract_glossary_info());
                glossary
                    .entries
                    .insert(entr.name.to_str().clone(), entry.clone());
            }
        }
    }

    public_names
}

fn parse_and_store_book_by_identifier<'a>(
    session: &mut Session,
    ident: &Ident,
    glossary: &'a mut Glossary,
) {
    if session.loaded_idents.contains_key(ident.to_str()) {
        return;
    }

    match ident_to_path(&session.root, ident, true) {
        Ok(None) => (),
        Ok(Some(path)) => parse_and_store_book_by_path(session, ident, &path, glossary),
        Err(err) => session.diagnostic_sender.send(err).unwrap(),
    }
}

fn parse_and_store_book_by_path<'a>(
    session: &mut Session,
    ident: &Ident,
    path: &PathBuf,
    glossary: &'a mut Glossary,
) {
    let input = fs::read_to_string(path).unwrap();
    let ctx_id = session.book_counter;

    let mut book = kind_parser::parse_book(session.diagnostic_sender.clone(), ctx_id, &input);
    let rc = Rc::new(book.clone());

    session.add_book(
        ident.to_str().clone(),
        Rc::new(path.to_path_buf()),
        Rc::new(input),
        rc.clone(),
    );

    let unbound = unbound::get_book_unbound(session.diagnostic_sender.clone(), &mut book);

    for idents in unbound.values() {
        parse_and_store_book_by_identifier(session, &idents[0], glossary);
    }

    book_to_glossary(session, rc, glossary);
}

pub fn parse_and_store_glossary(
    session: &mut Session,
    ident: &str,
    path: &PathBuf,
) -> Option<Glossary> {
    let mut glossary = Glossary::default();

    parse_and_store_book_by_path(
        session,
        &Ident::new_static(ident, Range::ghost_range()),
        path,
        &mut glossary,
    );

    let unbounds = unbound::get_glossary_unbound(session.diagnostic_sender.clone(), &mut glossary);

    for idents in unbounds.values() {
        // Collects all of the similar names using jaro distance.
        let similar_names = glossary
            .names
            .keys()
            .filter(|x| jaro(x, idents[0].to_str()).abs() > 0.8)
            .cloned()
            .collect();
        session
            .diagnostic_sender
            .send(DriverError::UnboundVariable(idents.clone(), similar_names).into())
            .unwrap();
    }

    if !unbounds.is_empty() {
        None
    } else {
        Some(glossary)
    }
}

pub fn type_check_glossary(session: &mut Session, ident: &str, path: &PathBuf) -> Option<()> {
    let concrete_glossary = parse_and_store_glossary(session, ident, path)?;
    let desugared_glossary =
        desugar::desugar_glossary(session.diagnostic_sender.clone(), &concrete_glossary);
    type_check(&desugared_glossary);
    todo!()
}
