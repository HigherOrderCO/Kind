//! A type checker for the kind2 language. It has some utilities
//! to [compile kind2 code][compiler] into a version that the checker
//! can understand and [transform the answer back][report] into a
//! version that the Rust side can manipulate.

pub mod compiler;
mod errors;
pub mod report;

use std::sync::mpsc::Sender;

use hvm::derive::pre_compute_file;
use hvm::{runtime::runtime, syntax::Term};
use kind_report::data::Diagnostic;
use kind_tree::desugared::Book;
use report::parse_report;

pre_compute_file!(PRECOMPILED_TYPE_CHECKER, "checker.hvm");

/// Generates the checker in a string format that can be
/// parsed by HVM.
pub fn gen_checker(book: &Book, functions_to_check: Vec<String>) -> String {
    let file = compiler::codegen_book(book, functions_to_check);
    file.to_string()
}

/// Type checks a dessugared book. It spawns an HVM instance in order
/// to run a compiled version of the book
pub fn type_check(
    book: &Book,
    tx: Sender<Box<dyn Diagnostic>>,
    functions_to_check: Vec<String>,
) -> bool {
    let file = compiler::codegen_book(book, functions_to_check);
    let book = language::rulebook::gen_rulebook(&file, PRECOMPILED_TYPE_CHECKER);

    let mut prog = runtime::Program::new(PRECOMPILED_TYPE_CHECKER);
    prog.add_book(&book);

    let heap = runtime::new_heap(runtime::default_heap_size(), runtime::default_heap_tids());
    let tids = runtime::new_tids(runtime::default_heap_tids());

    // Allocates the main term
    runtime::link(
        &heap,
        0,
        runtime::Fun(*book.name_to_id.get("Main").unwrap(), 0),
    );
    let host = 0;

    // Normalizes it
    runtime::normalize(&heap, &prog, &tids, host, false);

    // Reads it back to a string
    let term = language::readback::as_term(&heap, &prog, host);

    // Frees used memory
    runtime::collect(&heap, &prog.arit, tids[0], runtime::load_ptr(&heap, host));
    runtime::free(&heap, 0, 0, 1);

    let errs = parse_report(&term).expect(&format!(
        "Internal Error: Cannot parse the report message from the type checker: {}",
        term
    ));
    let succeeded = errs.is_empty();

    for err in errs {
        tx.send(Box::new(err)).unwrap()
    }

    succeeded
}

/// Runs the type checker but instead of running the check all function
/// we run the "eval_main" that runs the generated version that both HVM and
/// and the checker can understand.
pub fn eval_api(book: &Book) -> Box<Term> {
    let file = compiler::codegen_book(book, Vec::new());
    let book = language::rulebook::gen_rulebook(&file, PRECOMPILED_TYPE_CHECKER);

    let mut prog = runtime::Program::new(PRECOMPILED_TYPE_CHECKER);
    prog.add_book(&book);

    let heap = runtime::new_heap(runtime::default_heap_size(), runtime::default_heap_tids());
    let tids = runtime::new_tids(runtime::default_heap_tids());

    // Allocates the main term
    runtime::link(
        &heap,
        0,
        runtime::Fun(*book.name_to_id.get("Kind.API.eval_main").unwrap(), 0),
    );
    let host = 0;

    // Normalizes it
    runtime::normalize(&heap, &prog, &tids, host, false);

    // Reads it back to a string
    let term = language::readback::as_term(&heap, &prog, host);

    // Frees used memory
    runtime::collect(&heap, &prog.arit, tids[0], runtime::load_ptr(&heap, host));
    runtime::free(&heap, 0, 0, 1);

    term
}
