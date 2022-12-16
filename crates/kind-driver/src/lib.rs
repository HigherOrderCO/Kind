use checker::eval;
use errors::{DriverError, GenericDriverError};
use kind_pass::{desugar, erasure, inline::inline_book};
use kind_report::report::FileCache;
use kind_span::SyntaxCtxIndex;

use kind_tree::{backend, concrete, desugared, untyped};
use resolution::ResolutionError;
use session::Session;
use std::{path::PathBuf};

use kind_checker as checker;

pub mod errors;
pub mod resolution;
pub mod session;

impl FileCache for Session {
    fn fetch(&self, ctx: SyntaxCtxIndex) -> Option<(PathBuf, &String)> {
        let path = self.loaded_paths[ctx.0].as_ref().to_owned();
        Some((path, &self.loaded_sources[ctx.0]))
    }
}

pub fn type_check_book(
    session: &mut Session,
    path: &PathBuf,
    entrypoints: Vec<String>,
    tids: Option<usize>,
) -> anyhow::Result<(untyped::Book, u64)> {
    let concrete_book = to_book(session, path)?;
    let desugared_book = desugar::desugar_book(session.diagnostic_sender.clone(), &concrete_book)?;

    let all = desugared_book.entrs.iter().map(|x| x.0).cloned().collect();

    let result = checker::type_check(
        &desugared_book,
        session.diagnostic_sender.clone(),
        all,
        tids,
    );

    if result.is_none() {
        return Err(ResolutionError.into());
    }

    let mut book = erasure::erase_book(
        &desugared_book,
        session.diagnostic_sender.clone(),
        entrypoints,
    )?;
    inline_book(&mut book);

    Ok((book, result.unwrap()))
}

pub fn to_book(session: &mut Session, path: &PathBuf) -> anyhow::Result<concrete::Book> {
    let mut concrete_book = resolution::parse_and_store_book(session, path)?;

    resolution::check_unbound_top_level(session, &mut concrete_book)?;

    Ok(concrete_book)
}

pub fn erase_book(
    session: &mut Session,
    path: &PathBuf,
    entrypoints: Vec<String>,
) -> anyhow::Result<untyped::Book> {
    let concrete_book = to_book(session, path)?;
    let desugared_book = desugar::desugar_book(session.diagnostic_sender.clone(), &concrete_book)?;

    let mut book = erasure::erase_book(
        &desugared_book,
        session.diagnostic_sender.clone(),
        entrypoints,
    )?;

    inline_book(&mut book);
    Ok(book)
}

pub fn desugar_book(session: &mut Session, path: &PathBuf) -> anyhow::Result<desugared::Book> {
    let concrete_book = to_book(session, path)?;
    desugar::desugar_book(session.diagnostic_sender.clone(), &concrete_book)
}

pub fn check_erasure_book(
    session: &mut Session,
    path: &PathBuf,
) -> anyhow::Result<desugared::Book> {
    let concrete_book = to_book(session, path)?;
    desugar::desugar_book(session.diagnostic_sender.clone(), &concrete_book)
}

pub fn compile_book_to_hvm(book: untyped::Book, trace: bool) -> backend::File {
    kind_target_hvm::compile_book(book, trace)
}

pub fn compile_book_to_kdl(
    path: &PathBuf,
    session: &mut Session,
    namespace: &str,
    entrypoints: Vec<String>,
) -> anyhow::Result<kind_target_kdl::File> {
    let concrete_book = to_book(session, path)?;
    let desugared_book = desugar::desugar_book(session.diagnostic_sender.clone(), &concrete_book)?;

    let mut book = erasure::erase_book(
        &desugared_book,
        session.diagnostic_sender.clone(),
        entrypoints,
    )?;

    inline_book(&mut book);

    let res = kind_target_kdl::compile_book(book, session.diagnostic_sender.clone(), namespace)?;

    Ok(res)
}

pub fn check_main_entry(session: &mut Session, book: &untyped::Book) -> anyhow::Result<()> {
    if !book.entrs.contains_key("Main") {
        let err = Box::new(DriverError::ThereIsntAMain);
        session.diagnostic_sender.send(err).unwrap();
        Err(ResolutionError.into())
    } else {
        Ok(())
    }
}

pub fn check_main_desugared_entry(
    session: &mut Session,
    book: &desugared::Book,
) -> anyhow::Result<()> {
    if !book.entrs.contains_key("Main") {
        let err = Box::new(DriverError::ThereIsntAMain);
        session.diagnostic_sender.send(err).unwrap();
        Err(ResolutionError.into())
    } else {
        Ok(())
    }
}

pub fn execute_file(file: &str, tids: Option<usize>) -> anyhow::Result<(String, u64)> {
    match eval(file, "Main", false, tids) {
        Ok((res, rewrites)) => {
            Ok((res.to_string(), rewrites))
        },
        Err(_) => anyhow::Result::Err(GenericDriverError.into()),
    }
}

pub fn eval_in_checker(book: &desugared::Book) -> (String, u64) {
    checker::eval_api(book)
}

pub fn generate_checker(book: &desugared::Book) -> String {
    checker::gen_checker(book, book.entrs.keys().cloned().collect())
}
