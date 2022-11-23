use checker::eval;
use errors::DriverError;
use fxhash::FxHashSet;
use kind_pass::{desugar, erasure, expand};
use kind_report::report::FileCache;
use kind_span::SyntaxCtxIndex;

use kind_tree::{backend, concrete, desugared};
use session::Session;
use std::path::PathBuf;

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

pub fn type_check_book(session: &mut Session, path: &PathBuf) -> Option<desugared::Book> {
    let concrete_book = to_book(session, path)?;
    let desugared_book = desugar::desugar_book(session.diagnostic_sender.clone(), &concrete_book)?;

    let all = desugared_book.entrs.iter().map(|x| x.0).cloned().collect();

    let succeeded = checker::type_check(&desugared_book, session.diagnostic_sender.clone(), all);

    if !succeeded {
        return None;
    }

    let erased = erasure::erase_book(
        desugared_book,
        session.diagnostic_sender.clone(),
        FxHashSet::from_iter(vec!["Main".to_string()]),
    )?;

    Some(erased)
}

pub fn to_book(session: &mut Session, path: &PathBuf) -> Option<concrete::Book> {
    let mut concrete_book = resolution::parse_and_store_book(session, path)?;

    expand::expand_book(session.diagnostic_sender.clone(), &mut concrete_book);

    let failed = resolution::check_unbound_top_level(session, &mut concrete_book);

    if failed {
        return None;
    }

    Some(concrete_book)
}

pub fn erase_book(
    session: &mut Session,
    path: &PathBuf,
    entrypoint: &[String],
) -> Option<desugared::Book> {
    let concrete_book = to_book(session, path)?;
    let desugared_book = desugar::desugar_book(session.diagnostic_sender.clone(), &concrete_book)?;
    erasure::erase_book(
        desugared_book,
        session.diagnostic_sender.clone(),
        FxHashSet::from_iter(entrypoint.to_owned()),
    )
}

pub fn desugar_book(session: &mut Session, path: &PathBuf) -> Option<desugared::Book> {
    let concrete_book = to_book(session, path)?;
    desugar::desugar_book(session.diagnostic_sender.clone(), &concrete_book)
}

pub fn check_erasure_book(session: &mut Session, path: &PathBuf) -> Option<desugared::Book> {
    let concrete_book = to_book(session, path)?;
    let desugared_book = desugar::desugar_book(session.diagnostic_sender.clone(), &concrete_book)?;
    erasure::erase_book(
        desugared_book.clone(),
        session.diagnostic_sender.clone(),
        FxHashSet::from_iter(vec!["Main".to_string()]),
    )?;
    Some(desugared_book)
}

pub fn compile_book_to_hvm(book: desugared::Book) -> backend::File {
    kind_target_hvm::compile_book(book)
}

pub fn check_main_entry(session: &mut Session, book: &desugared::Book) -> Option<()> {
    if !book.entrs.contains_key("Main") {
        session
            .diagnostic_sender
            .send(Box::new(DriverError::ThereIsntAMain))
            .unwrap();
        None
    } else {
        Some(())
    }
}

pub fn execute_file(file: &str) -> Result<String, String> {
    let res = eval(file, "Main", false)?;
    Ok(res.to_string())
}

pub fn eval_in_checker(book: &desugared::Book) -> Box<backend::Term> {
    checker::eval_api(book)
}

pub fn generate_checker(book: &desugared::Book) -> String {
    checker::gen_checker(book, book.names.keys().cloned().collect())
}
