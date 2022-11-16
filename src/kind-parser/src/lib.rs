//! Crate to parse the kind2 grammar.
pub mod errors;
pub mod expr;
pub mod macros;
pub mod pat;
pub mod state;
pub mod top_level;

pub mod lexer;
use std::sync::mpsc::Sender;

use kind_report::data::Diagnostic;
use kind_span::SyntaxCtxIndex;
use kind_tree::concrete::Module;
pub use lexer::state::*;
use state::Parser;

pub fn parse_book(errs: Sender<Box<dyn Diagnostic>>, ctx_id: usize, input: &str) -> (Module, bool) {
    let peekable = input.chars().peekable();
    let lexer = Lexer::new(input, peekable, SyntaxCtxIndex::new(ctx_id));
    let mut parser = Parser::new(lexer, errs);
    (parser.parse_module(), parser.failed)
}
