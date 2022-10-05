use kind_span::{Span, SyntaxCtxIndex};

use crate::{lexer::tokens::Token, Lexer, errors::SyntaxError};

/// The parser state. it current have some parameters
/// that makes the behaviour change
/// - eaten: It counts how much tokens it has eaten
/// it's useful to all of the rules that use "try_local"
/// and similar functions
pub struct Parser<'a> {
    pub lexer: Lexer<'a>,
    pub current: (Token, Span),
    pub next: (Token, Span),
    pub errs: Vec<Box<SyntaxError>>,
    pub eaten: u32,
    pub ctx: SyntaxCtxIndex
}

impl<'a> Parser<'a> {
    pub fn new(mut lexer: Lexer<'a>, ctx: SyntaxCtxIndex) -> Parser<'a> {
        let mut errs = Vec::new();
        let current = lexer.get_next_no_error(&mut errs);
        let next = lexer.get_next_no_error(&mut errs);
        Parser { lexer, next, current, errs, eaten: 0, ctx }
    }

    pub fn advance(&mut self) -> (Token, Span) {
        let cur = self.current.clone();
        self.current = self.next.clone();
        self.next = self.lexer.get_next_no_error(&mut self.errs);
        self.eaten += 1;
        cur
    }

    #[inline]
    pub fn fail<T>(&mut self, expect: Option<Token>) -> Result<T, SyntaxError> {
        Err(SyntaxError::UnexpectedToken(self.current.0.clone(), self.current.1, expect))
    }

    pub fn eat_variant(&mut self, expect: &Token) -> Result<(Token, Span), SyntaxError> {
        if self.current.0.same_variant(expect) {
            Ok(self.advance())
        } else {
            self.fail(Some(expect.clone()))
        }
    }

    pub fn eat<T>(&mut self, expect: fn(&Token) -> Option<T>) -> Result<T, SyntaxError> {
        match expect(&self.current.0) {
            None => self.fail(None),
            Some(res) => Ok(res)
        }
    }

    #[inline]
    pub fn get(&mut self) -> &Token {
        &self.current.0
    }

    #[inline]
    pub fn peek(&mut self) -> &Token {
        &self.next.0
    }

    #[inline]
    pub fn span(&mut self) -> &Span {
        &self.current.1
    }

    pub fn try_single<T>(&mut self, fun: fn(&mut Parser<'a>) -> Result<T, SyntaxError>) -> Result<Option<T>, SyntaxError> {
        let current = self.eaten;
        match fun(self) {
            Err(_) if current == self.eaten => Ok(None),
            Err(err) => Err(err),
            Ok(res) => Ok(Some(res)),
        }
    }

}
