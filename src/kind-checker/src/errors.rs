//! Errors created by the type checker.

use std::path::PathBuf;

use kind_report::data::{DiagnosticFrame};
use kind_span::Span;
use kind_tree::{symbol::Ident, desugared::Expr};

use crate::report::Context;

#[derive(Debug)]
pub(crate) enum TypeError {
    UnboundVariable(Context, Span),
    CantInferHole(Context, Span),
    CantInferLambda(Context, Span),
    InvalidCall(Context, Span),
    ImpossibleCase(Context, Span, Box<Expr>, Box<Expr>),
    Inspection(Context, Span, Box<Expr>),
    TooManyArguments(Context, Span),
    TypeMismatch(Context, Span, Box<Expr>, Box<Expr>),
}

impl From<TypeError> for DiagnosticFrame {
    fn from(err: TypeError) -> Self {
        match err {
            _ => todo!()
        }
    }
}
