use std::sync::mpsc::Sender;

use flatten::flatten;
use kind_report::data::Diagnostic;
use kind_tree::untyped;

pub use compile::File;

mod compile;
mod errors;
mod flatten;
mod linearize;
mod subst;

pub fn compile_book(
    book: untyped::Book,
    sender: Sender<Box<dyn Diagnostic>>,
    namespace: &str,
) -> Option<compile::File> {
    // TODO: Remove kdl_states (maybe check if they're ever called?)
    // TODO: Convert to some sort of Kindelia.Contract
    let flattened = flatten(book);

    let file = compile::compile_book(&flattened, sender, namespace)?;

    println!("{}", file);

    let file = linearize::linearize_file(file);
    Some(file)
}
