//! This pass transforms a sugared tree into a simpler tree.
//!
//! It does a lot of things like:
//! * Setting an unique number for each of the holes
//! * Desugar of lets and matchs
//! * Untyped derivations for types and records
//! * Checking of hidden and erased arguments

use std::sync::mpsc::Sender;

use kind_report::data::Diagnostic;
use kind_span::Range;
use kind_tree::{
    concrete::{self},
    desugared,
    symbol::Ident,
};

use crate::diagnostic::{PassDiagnostic, GenericPassError};

pub mod app;
pub mod attributes;
pub mod destruct;
pub mod expr;
pub mod top_level;
pub mod record_field;

pub struct DesugarState<'a> {
    pub errors: Sender<Box<dyn Diagnostic>>,
    pub old_book: &'a concrete::Book,
    pub new_book: desugared::Book,
    pub name_count: u64,
    pub failed: bool,
}

pub fn desugar_book(
    errors: Sender<Box<dyn Diagnostic>>,
    book: &concrete::Book,
) -> anyhow::Result<desugared::Book> {
    let mut state = DesugarState {
        errors,
        old_book: book,
        new_book: Default::default(),
        name_count: 0,
        failed: false,
    };
    state.desugar_book(book);
    if state.failed {
        Err(GenericPassError.into())
    } else {
        Ok(state.new_book)
    }
}

impl<'a> DesugarState<'a> {
    fn gen_hole(&mut self) -> u64 {
        self.new_book.holes += 1;
        self.new_book.holes - 1
    }

    fn gen_name(&mut self, range: Range) -> Ident {
        self.name_count += 1;
        Ident::new(format!("x_{}", self.name_count), range)
    }

    fn gen_hole_expr(&mut self, range: Range) -> Box<desugared::Expr> {
        desugared::Expr::hole(range, self.gen_hole())
    }

    fn send_err(&mut self, err: PassDiagnostic) {
        self.errors.send(Box::new(err)).unwrap();
        self.failed = true;
    }

    pub fn desugar_book(&mut self, book: &concrete::Book) {
        for top_level in book.entries.values() {
            self.desugar_top_level(top_level)
        }
    }
}
