//! Transforms a single book into a glossary by
//! reading it and it's dependencies.

use std::collections::HashSet;
use std::fs;
use std::path::{Path, PathBuf};
use std::rc::Rc;

use kind_parser::{state::Parser, Lexer};
use kind_pass::desugar::{desugar};
use kind_pass::unbound::{self, UnboundCollector};
use kind_report::data::DiagnosticFrame;
use kind_span::{Range, SyntaxCtxIndex};
use kind_tree::concrete::Glossary;
use kind_tree::concrete::TopLevel;
use kind_tree::{concrete::Book, symbol::Ident};

use crate::{errors::DriverError, session::Session};
use kind_tree::concrete::visitor::Visitor;

const EXT: &str = "kind2";

pub type CompResult<T = ()> = Result<T, CompileError>;

#[derive(Debug)]
pub struct CompileError;

pub fn accumulate_neighbour_paths(raw_path: &Path, other: &mut Vec<PathBuf>) {
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

fn ident_to_path(
    root: &Path,
    ident: &Ident,
    search_on_parent: bool,
) -> Result<Option<PathBuf>, DiagnosticFrame> {
    let segments = ident.data.0.split('.').collect::<Vec<&str>>();
    let mut raw_path = root.to_path_buf();
    raw_path.push(PathBuf::from(segments.join("/")));

    let mut paths = Vec::new();
    accumulate_neighbour_paths(&raw_path, &mut paths);

    // TODO: Check if impacts too much while trying to search
    if search_on_parent {
        raw_path.pop();
        accumulate_neighbour_paths(&raw_path, &mut paths);
    }

    if paths.len() == 1 {
        Ok(Some(paths[0].clone()))
    } else if paths.is_empty() {
        Ok(None)
    } else {
        Err(DriverError::MultiplePaths(ident.clone(), paths).into())
    }
}

fn try_to_insert_new_name<'a>(session: &'a Session, ident: Ident, glossary: &'a mut Glossary) {
    if let Some(first_occorence) = glossary.names.get(&ident.data.0) {
        session
            .diagnostic_sender
            .send(DriverError::DefinedMultipleTimes(first_occorence.clone(), ident).into())
            .unwrap();
    } else {
        glossary.names.insert(ident.data.0.clone(), ident);
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
                public_names.insert(sum.name.data.0.clone());
                try_to_insert_new_name(session, sum.name.clone(), glossary);
                glossary
                    .count
                    .insert(sum.name.data.0.clone(), sum.extract_glossary_info());

                glossary
                    .entries
                    .insert(sum.name.data.0.clone(), entry.clone());

                for cons in &sum.constructors {
                    let cons_ident = cons.name.add_base_ident(&sum.name.data.0);
                    public_names.insert(cons_ident.data.0.clone());
                    glossary
                        .count
                        .insert(cons_ident.data.0.clone(), cons.extract_glossary_info(sum));
                    try_to_insert_new_name(session, cons_ident, glossary);
                }
            }
            TopLevel::RecordType(rec) => {
                public_names.insert(rec.name.data.0.clone());
                glossary
                    .count
                    .insert(rec.name.data.0.clone(), rec.extract_glossary_info());
                try_to_insert_new_name(session, rec.name.clone(), glossary);

                glossary
                    .entries
                    .insert(rec.name.data.0.clone(), entry.clone());

                let cons_ident = rec.constructor.add_base_ident(&rec.name.data.0);
                public_names.insert(cons_ident.data.0.clone());
                glossary.count.insert(
                    cons_ident.data.0.clone(),
                    rec.extract_glossary_info_of_constructor(),
                );
                try_to_insert_new_name(session, cons_ident, glossary);
            }
            TopLevel::Entry(entr) => {
                try_to_insert_new_name(session, entr.name.clone(), glossary);
                public_names.insert(entr.name.data.0.clone());
                glossary
                    .count
                    .insert(entr.name.data.0.clone(), entr.extract_glossary_info());
                glossary
                    .entries
                    .insert(entr.name.data.0.clone(), entry.clone());
            }
        }
    }

    public_names
}

fn parse_and_store_book_by_identifier<'a>(
    session: &mut Session,
    ident: &Ident,
    glossary: &'a mut Glossary,
) -> CompResult {
    if session.loaded_idents.contains_key(&ident.data.0) {
        return Ok(());
    }

    match ident_to_path(&session.root, ident, true) {
        Ok(None) => Ok(()),
        Ok(Some(path)) => {
            parse_and_store_book_by_path(session, ident, &path, glossary, false).map(|_| ())
        }
        Err(err) => {
            session.diagnostic_sender.send(err).unwrap();
            Err(CompileError)
        }
    }
}

fn parse_and_store_book_by_path<'a>(
    session: &mut Session,
    ident: &Ident,
    path: &PathBuf,
    glossary: &'a mut Glossary,
    dont_search: bool,
) -> CompResult<Rc<Book>> {
    let input = fs::read_to_string(path).unwrap();

    let ctx_id = session.book_counter;

    let mut peekable = input.chars().peekable();

    let lexer = Lexer::new(&input, &mut peekable, SyntaxCtxIndex(ctx_id));
    let mut parser = Parser::new(lexer, session.diagnostic_sender.clone());
    let mut book = parser.parse_book();
    let rc = Rc::new(book.clone());

    session.add_book(
        ident.to_string().clone(),
        Rc::new(path.to_path_buf()),
        Rc::new(input.clone()),
        rc.clone(),
    );

    let mut collector = UnboundCollector::new(session.diagnostic_sender.clone());
    collector.visit_book(&mut book);

    for (_, idents) in collector.unbound {
        let _ = parse_and_store_book_by_identifier(session, &idents[0], glossary);
    }

    let names = book_to_glossary(session, rc.clone(), glossary);

    if !names.contains(&ident.data.0) && !dont_search {
        session
            .diagnostic_sender
            .send(DriverError::UnboundVariable(ident.clone()).into())
            .unwrap();
    }

    session.public_names.insert(path.clone(), names);

    Ok(rc)
}

pub fn parse_and_store_glossary(
    session: &mut Session,
    ident: &str,
    path: &PathBuf,
    dont_search_main: bool,
) {
    let mut glossary = Glossary::default();

    let _ = parse_and_store_book_by_path(
        session,
        &Ident::new_static(ident, Range::ghost_range()),
        path,
        &mut glossary,
        dont_search_main,
    );

    let unbounds = unbound::get_glossary_unbound(session.diagnostic_sender.clone(), &mut glossary);

    for (_, idents) in &unbounds {
        for ident in idents {
            session
                .diagnostic_sender
                .send(DriverError::UnboundVariable(ident.clone()).into())
                .unwrap();
        }
    }

    if !unbounds.is_empty() {
        return ;
    }

    let _glossary = desugar(session.diagnostic_sender.clone(), &glossary);

    
}
