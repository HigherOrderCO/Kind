//! This pass does a lot of things including:
//! - Setting an unique number for each of the holes
//! - Desugar of lets and matchs
//! - Untyped derivations for types and records
//! - Checking of hidden and erased arguments

use std::sync::mpsc::Sender;

use kind_report::data::DiagnosticFrame;
use kind_span::{Range, Span};
use kind_tree::{
    concrete::{self},
    desugared,
    symbol::Ident,
};

use crate::errors::PassError;

pub mod app;
pub mod attributes;
pub mod destruct;
pub mod expr;
pub mod top_level;

pub struct DesugarState<'a> {
    pub errors: Sender<DiagnosticFrame>,
    pub old_book: &'a concrete::Book,
    pub new_book: desugared::Book,
    pub name_count: u64,
    pub holes: u64,
    pub failed: bool,
}

pub fn desugar_book(
    errors: Sender<DiagnosticFrame>,
    book: &concrete::Book,
) -> Option<desugared::Book> {
    let mut state = DesugarState {
        errors,
        old_book: book,
        new_book: Default::default(),
        name_count: 0,
        holes: 0,
        failed: false,
    };
    state.desugar_book(book);
    if state.failed {
        None
    } else {
        Some(state.new_book)
    }
}

impl<'a> DesugarState<'a> {
    fn gen_hole(&mut self) -> u64 {
        self.holes += 1;
        self.holes - 1
    }

    fn gen_name(&mut self, range: Range) -> Ident {
        self.name_count += 1;
        Ident::new(format!("_x{}", self.name_count), range)
    }

    fn gen_hole_expr(&mut self) -> Box<desugared::Expr> {
        Box::new(desugared::Expr {
            data: desugared::ExprKind::Hole(self.gen_hole()),
            span: Span::Generated,
        })
    }

    fn send_err(&mut self, err: PassError) {
        self.errors.send(err.into()).unwrap();
        self.failed = true;
    }

    pub fn desugar_book(&mut self, book: &concrete::Book) {
        for top_level in book.entries.values() {
            self.desugar_top_level(top_level)
        }
    }
}
