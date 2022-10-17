//! Transforms a single book into a glossary by
//! reading it and it's dependencies.

use std::fs;
use std::path::{Path, PathBuf};
use std::rc::Rc;

use kind_parser::{state::Parser, Lexer};
use kind_pass::unbound::UnboundCollector;
use kind_report::data::DiagnosticFrame;
use kind_span::SyntaxCtxIndex;
use kind_tree::concrete::Glossary;
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

fn ident_to_path(root: &Path, ident: &Ident, search_on_parent: bool) -> Result<PathBuf, DiagnosticFrame> {
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
        Ok(paths[0].clone())
    } else if paths.len() == 0 {
        Err(DriverError::UnboundVariable(ident.clone()).into())
    } else {
        Err(DriverError::MultiplePaths(ident.clone(), paths).into())
    }
}

fn parse_and_store_book_by_identifier<'a>(
    session: &mut Session,
    ident: &Ident,
    glossary: &'a mut Glossary,
) -> CompResult {
    if session.loaded_idents.contains_key(&ident.data.0) {
        return Ok(());
    }

    let path = match ident_to_path(&session.root, ident, true) {
        Ok(res) => res,
        Err(err) => {
            session
                .diagnostic_sender
                .send(err)
                .unwrap();
            return Err(CompileError);
        }
    };

    let _ = parse_and_store_book_by_path(session, &ident.data.0, &path, glossary)?;

    Ok(())
}

fn parse_and_store_book_by_path<'a>(
    session: &mut Session,
    ident: &str,
    path: &PathBuf,
    glossary: &'a mut Glossary,
) -> CompResult<Rc<Book>> {
    let input = fs::read_to_string(path).unwrap();

    let ctx_id = session.book_counter;

    let mut peekable = input.chars().peekable();

    let lexer = Lexer::new(&input, &mut peekable, SyntaxCtxIndex(ctx_id));
    let mut parser = Parser::new(lexer, session.diagnostic_sender.clone());
    let mut book = parser.parse_book();
    let rc = Rc::new(book.clone());

    session.add_book(
        ident.to_string(),
        Rc::new(path.to_path_buf()),
        Rc::new(input.clone()),
        rc.clone(),
    );

    let mut collector = UnboundCollector::new(session.diagnostic_sender.clone());
    collector.visit_book(&mut book);

    for (_, idents) in collector.unbound {
        let _ = parse_and_store_book_by_identifier(session, &idents[0], glossary);
    }

    Ok(rc)
}

pub fn parse_and_store_glossary<'a>(
    session: &mut Session,
    ident: &str,
    path: &PathBuf,
) -> Glossary {
    let mut glossary = Glossary::default();
    let _ = parse_and_store_book_by_path(session, ident, path, &mut glossary);
    glossary
}