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
};

use crate::errors::PassError;

pub mod expr;
pub mod top_level;
pub mod destruct;
pub mod app;

pub struct DesugarState<'a> {
    pub errors: Sender<DiagnosticFrame>,
    pub old_glossary: &'a concrete::Glossary,
    pub new_glossary: desugared::Glossary,
    pub holes: u64,
}

impl<'a> DesugarState<'a> {
    pub fn new(
        errors: Sender<DiagnosticFrame>,
        glossary: &'a concrete::Glossary,
    ) -> DesugarState<'a> {
        DesugarState {
            errors,
            old_glossary: glossary,
            new_glossary: Default::default(),
            holes: 0,
        }
    }
}

impl<'a> DesugarState<'a> {
    pub fn gen_hole(&mut self) -> u64 {
        self.holes += 1;
        self.holes - 1
    }

    pub fn gen_hole_expr(&mut self) -> Box<desugared::Expr> {
        Box::new(desugared::Expr {
            data: desugared::ExprKind::Hole(self.gen_hole()),
            span: Span::Generated,
        })
    }

    pub fn send_err(&self, err: PassError) {
        self.errors.send(err.into()).unwrap()
    }

    pub fn desugar_glossary(&mut self, glossary: &concrete::Glossary) {
        for top_level in glossary.entries.values() {
            self.desugar_top_level(top_level)
        }
    }
}
