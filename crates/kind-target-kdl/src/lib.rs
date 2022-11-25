use std::sync::mpsc::Sender;

use flatten::flatten;
use kind_report::data::Diagnostic;
use kind_tree::{untyped};

pub use compile::File;

mod compile;
mod flatten;
mod subst;
mod errors;

pub fn compile_book(book: untyped::Book, sender: Sender<Box<dyn Diagnostic>>, namespace: &str) -> Option<compile::File> {
    let flattened = flatten(book);
    compile::compile_book(&flattened, sender, namespace)
}
