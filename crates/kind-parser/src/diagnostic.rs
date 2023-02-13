//! All of the sintatic erros both from the
//! lexer and the parser.

use std::fmt::Display;

use kind_diagnostic::{Diagnostic, IntoDiagnostic};
use kind_span::{Span, Symbol};

use crate::tokens::Token;

#[derive(Debug, Clone)]
pub enum EncodeSequence {
    Hexa,
    Decimal,
    Octal,
    Binary,
    Unicode,
}

impl Display for EncodeSequence {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            EncodeSequence::Hexa => write!(f, "hexa"),
            EncodeSequence::Decimal => write!(f, "decimal"),
            EncodeSequence::Octal => write!(f, "octal"),
            EncodeSequence::Binary => write!(f, "binary"),
            EncodeSequence::Unicode => write!(f, "unicode"),
        }
    }
}

pub enum SyntaxDiagnosticKind {
    UnfinishedString,
    UnfinishedChar,
    UnfinishedComment,
    InvalidEscapeSequence(EncodeSequence),
    InvalidNumberRepresentation(EncodeSequence),
    UnexpectedChar(char),
    UnexpectedToken(Token, Vec<Token>),
    LowerCasedDefinition(Symbol),
    NotAClauseOfDef(Span),
    Unclosed,
    IgnoreRestShouldBeOnTheEnd,
    MatchScrutineeShouldBeAName,
    UnusedDocString,
    CannotUseUse,
    ImportsCannotHaveAlias,
    InvalidNumberType(String),
}

pub struct SyntaxDiagnostic {
    pub span: Span,
    pub data: SyntaxDiagnosticKind,
}

impl IntoDiagnostic for SyntaxDiagnostic {
    fn into_diagnostic(self) -> Diagnostic {
        todo!()
    }
}
