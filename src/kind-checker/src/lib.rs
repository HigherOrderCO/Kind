pub mod compiler;
pub mod errors;
pub mod report;


use std::sync::mpsc::Sender;

use kind_report::data::DiagnosticFrame;
use kind_tree::desugared::Book;


use crate::report::parse_report;

const CHECKER_HVM: &str = include_str!("checker.hvm");

/// Type checks a dessugared book. It spawns an HVM instance in order
/// to run a compiled version of the book
pub fn type_check(book: &Book, tx: Sender<DiagnosticFrame>) {
    let base_check_code = compiler::codegen_book(book);
    let mut check_code = CHECKER_HVM.to_string();
    check_code.push_str(&base_check_code.to_string());

    let mut runtime = hvm::Runtime::from_code(&check_code).unwrap();
    let main = runtime.alloc_code("Kind.API.check_all").unwrap();
    runtime.run_io(main);
    runtime.normalize(main);
    let term = runtime.readback(main);

    let errs = parse_report(&term).expect("Internal Error: Cannot parse the report message from the type checker");

    for err in errs {
        tx.send(err.into()).unwrap()
    }
}
