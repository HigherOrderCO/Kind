use kind_span::Span;

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
    UnfinishedString(Span),
    UnfinishedComment(Span),
    InvalidEscapeSequence(EncodeSequence, Span),
    InvalidNumberRepresentation(EncodeSequence, Span),
    UnexpectedChar(char, Span),
    UnexpectedToken(Token, Span, Vec<Token>),
}
