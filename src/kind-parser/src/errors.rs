use kind_report::data::DiagnosticFrame;
use kind_span::Range;

use crate::lexer::tokens::Token;

#[derive(Debug, Clone)]
pub enum EncodeSequence {
    Hexa,
    Octal,
    Binary,
    Unicode,
}

#[derive(Debug, Clone)]
pub enum SyntaxError {
    UnfinishedString(Range),
    UnfinishedComment(Range),
    InvalidEscapeSequence(EncodeSequence, Range),
    InvalidNumberRepresentation(EncodeSequence, Range),
    UnexpectedChar(char, Range),
    UnexpectedToken(Token, Range, Vec<Token>),
}

impl Into<DiagnosticFrame> for SyntaxError {
    fn into(self) -> DiagnosticFrame {
        todo!()
    }
}
