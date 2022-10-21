pub mod errors;
pub mod expr;
pub mod macros;
pub mod pat;
pub mod state;
pub mod top_level;

pub mod lexer;
use std::sync::mpsc::Sender;

use kind_report::data::DiagnosticFrame;
use kind_span::SyntaxCtxIndex;
use kind_tree::concrete::Book;
pub use lexer::state::*;
use state::Parser;

pub fn parse_book(errs: Sender<DiagnosticFrame>, ctx_id: usize, input: &str) -> Book {
    let mut peekable = input.chars().peekable();
    let lexer = Lexer::new(input, &mut peekable, SyntaxCtxIndex(ctx_id));
    let mut parser = Parser::new(lexer, errs);
    parser.parse_book()
}
