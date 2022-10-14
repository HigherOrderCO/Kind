pub mod errors;
pub mod session;

use core::fmt;
use std::collections::HashMap;
use std::path::{Path, PathBuf};
use std::rc::Rc;
use std::{fs, io};

use errors::DriverError;
use kind_parser::state::Parser;
use kind_parser::Lexer;
use kind_pass::unbound::UnboundCollector;
use kind_report::data::{Diagnostic, DiagnosticFrame};
use kind_report::render::FileCache;
use kind_span::SyntaxCtxIndex;
use kind_tree::concrete::visitor::Visitor;
use kind_tree::concrete::Book;
use kind_tree::symbol::Ident;
use session::Session;

#[derive(Debug)]
pub struct CompileError;

pub type CompResult<T = ()> = Result<T, CompileError>;

const EXT: &str = "kind2";

pub struct SessionCache<'a> {
    pub loaded_paths: &'a HashMap<PathBuf, usize>,
    pub loaded_files: &'a Vec<(PathBuf, String)>,
}

impl<'a> FileCache for Session<'a> {
    fn fetch(&self, ctx: SyntaxCtxIndex) -> Option<(Rc<PathBuf>, Rc<String>)> {
        Some((
            self.loaded_paths[ctx.0].clone(),
            self.loaded_sources[ctx.0].clone(),
        ))
    }
}

/// Helper structure to use stderr as fmt::Write
pub struct ToWriteFmt<T>(pub T);

impl<T> fmt::Write for ToWriteFmt<T>
where
    T: io::Write,
{
    fn write_str(&mut self, s: &str) -> fmt::Result {
        self.0.write_all(s.as_bytes()).map_err(|_| fmt::Error)
    }
}

pub fn render_error_to_stderr<T: Into<DiagnosticFrame>>(session: &Session, err: T) {
    Diagnostic::render(
        &Diagnostic { frame: err.into() },
        session,
        session.render_config,
        &mut ToWriteFmt(std::io::stderr()),
    )
    .unwrap();
}

pub fn search_neighbour_paths(raw_path: &Path) -> CompResult<PathBuf> {
    let mut canon_path = raw_path.to_path_buf();
    canon_path.set_extension(EXT);

    if canon_path.is_file() {
        return Ok(canon_path);
    }

    let mut deferred_path = raw_path.to_path_buf();
    deferred_path.push("_");
    deferred_path.set_extension(EXT);

    if deferred_path.is_file() {
        return Ok(deferred_path);
    }

    Err(CompileError)
}

pub fn ident_to_path(root: &Path, ident: &Ident, search_on_parent: bool) -> CompResult<PathBuf> {
    let segments = ident.data.0.split('.').collect::<Vec<&str>>();
    let mut raw_path = root.to_path_buf();
    raw_path.push(PathBuf::from(segments.join("/")));

    match search_neighbour_paths(&raw_path) {
        Err(_) if search_on_parent => {
            raw_path.pop();
            search_neighbour_paths(&raw_path)
        }
        other => other,
    }
}

pub fn parse_and_store_book_by_identifier(session: &mut Session, ident: &Ident) -> CompResult {
    if session.loaded_idents.contains_key(&ident.data.0) {
        return Ok(());
    }

    let path = ident_to_path(&session.root, ident, true).map_err(|err| {
        render_error_to_stderr(session, &DriverError::UnboundVariable(ident.clone()));
        err
    })?;

    let _ = parse_and_store_book_by_path(session, &ident.data.0, &path)?;

    Ok(())
}

pub fn throw_errors<'a, T: 'a>(session: &Session, errs: &'a [T]) -> CompResult
where
    DiagnosticFrame: From<&'a T>,
{
    if !errs.is_empty() {
        for err in errs {
            render_error_to_stderr(session, err);
        }
        Err(CompileError)
    } else {
        Ok(())
    }
}

pub fn parse_and_store_book_by_path(
    session: &mut Session,
    ident: &str,
    path: &PathBuf,
) -> CompResult<Rc<Book>> {
    let input = fs::read_to_string(path).unwrap();

    let ctx_id = session.book_counter;

    let mut peekable = input.chars().peekable();
    let mut syntax_errs = Vec::new();

    let lexer = Lexer::new(&input, &mut peekable, SyntaxCtxIndex(ctx_id));
    let mut parser = Parser::new(lexer, &mut syntax_errs);
    let mut book = parser.parse_book();
    let rc = Rc::new(book.clone());

    session.add_book(
        ident.to_string(),
        Rc::new(path.to_path_buf()),
        Rc::new(input.clone()),
        rc.clone(),
    );

    let _ = throw_errors(session, &syntax_errs);

    let mut collector = UnboundCollector::default();
    collector.visit_book(&mut book);

    let _ = throw_errors(session, &collector.errors);

    for (_, idents) in collector.unbound {
        let _ = parse_and_store_book_by_identifier(session, &idents[0]);
    }

    println!("\n{}", book);

    Ok(rc)
}
