//! Diagnostics for the lexer. These are used to report errors and
//! warnings to the user.

use kind_diagnostic::Diagnostic;
use kind_span::Span;

use crate::tokens::EncodeSequence;

#[derive(Debug)]
pub enum LexerDiagnosticKind {
    UnknownChar(char),
    UnfinishedComment,
    UnfinishedChar,
    UnfinishedString,
    UnexpectedEof,
    InvalidEscapeSequence(EncodeSequence),
    InvalidNumberRepresentation,
    InvalidNumberType,
}

#[derive(Debug)]
pub struct LexerDiagnostic {
    pub data: LexerDiagnosticKind,
    pub span: Span,
}

impl LexerDiagnosticKind {
    pub fn with(self, span: Span) -> LexerDiagnostic {
        LexerDiagnostic { data: self, span }
    }
}

impl From<LexerDiagnostic> for Diagnostic {
    fn from(val: LexerDiagnostic) -> Self {
        todo!()
    }
}
