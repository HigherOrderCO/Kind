use std::{sync::mpsc::Sender, fmt::Display, error::Error};

use flatten::flatten;
use kind_report::data::Diagnostic;
use kind_tree::untyped;

pub use compile::File;

mod compile;
mod diagnostic;
mod flatten;
mod linearize;
mod subst;

#[derive(Debug)]
pub struct GenericCompilationToHVMError;

impl Display for GenericCompilationToHVMError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "generic compilation to hvm error")
    }
}

impl Error for GenericCompilationToHVMError { }

pub fn compile_book(
    book: untyped::Book,
    sender: Sender<Box<dyn Diagnostic>>,
    namespace: &str,
) -> Result<compile::File, GenericCompilationToHVMError> {
    // TODO: Remove kdl_states (maybe check if they're ever called?)
    // TODO: Convert to some sort of Kindelia.Contract
    let flattened = flatten(book);

    let file = compile::compile_book(&flattened, sender, namespace)?;

    let file = linearize::linearize_file(file);
    Ok(file)
}
