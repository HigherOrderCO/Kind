//! Crate to parse the kind2 grammar.
mod errors;
mod expr;
mod lexer;
mod macros;
mod pat;
mod state;
mod top_level;

use std::sync::mpsc::Sender;

use kind_report::data::Diagnostic;
use kind_span::SyntaxCtxIndex;
use kind_tree::concrete::Module;
use lexer::state::*;
use state::Parser;

pub fn parse_book(errs: Sender<Box<dyn Diagnostic>>, ctx_id: usize, input: &str) -> (Module, bool) {
    let peekable = input.chars().peekable();
    let lexer = Lexer::new(input, peekable, SyntaxCtxIndex::new(ctx_id));
    let mut parser = Parser::new(lexer, errs);
    (parser.parse_module(), parser.failed)
}
