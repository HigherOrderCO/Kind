use kind_span::{Span, SyntaxCtxIndex};

use crate::{lexer::tokens::Token, Lexer, errors::SyntaxError};

/// The parser state. it current have some parameters
/// that makes the behaviour change
/// - eaten: It counts how much tokens it has eaten
/// it's useful to all of the rules that use "try_local"
/// and similar functions
pub struct Parser<'a> {
    pub lexer: Lexer<'a>,
    // We have to shift these things one position
    // to the left so idk what i should use it here
    // probably the movement will not affect it so much.
    pub queue: [(Token, Span); 3],
    pub breaks: [bool; 3],
    pub errs: Vec<Box<SyntaxError>>,
    pub eaten: u32,
    pub ctx: SyntaxCtxIndex
}

impl<'a> Parser<'a> {
    pub fn new(mut lexer: Lexer<'a>, ctx: SyntaxCtxIndex) -> Parser<'a> {
        let mut errs = Vec::new();
        let mut queue = [(Token::Eof, Span::Generated), (Token::Eof, Span::Generated), (Token::Eof, Span::Generated)];
        let mut breaks = [false, false, false];
        for i in 0..3 {
            breaks[i] = lexer.is_linebreak();
            queue[i] = lexer.get_next_no_error(&mut errs);
        }
        Parser { lexer, queue, breaks, errs, eaten: 0, ctx }
    }

    pub fn advance(&mut self) -> (Token, Span) {
        let cur = self.queue[0].clone();
        for i in 0..2 {
            self.breaks[i] = self.breaks[i+1];
            self.queue[i] = self.queue[i+1].clone();
        }
        self.breaks[2] = self.lexer.is_linebreak();
        self.queue[2] = self.lexer.get_next_no_error(&mut self.errs);
        self.eaten += 1;
        cur
    }

    #[inline]
    pub fn bump(&mut self) {
        self.advance();
    }

    #[inline]
    pub fn fail<T>(&mut self, expect: Option<Token>) -> Result<T, SyntaxError> {
        Err(SyntaxError::UnexpectedToken(self.queue[0].0.clone(), self.queue[0].1, expect))
    }

    pub fn eat_variant(&mut self, expect: Token) -> Result<(Token, Span), SyntaxError> {
        if self.queue[0].0.same_variant(expect.clone()) {
            Ok(self.advance())
        } else {
            self.fail(Some(expect))
        }
    }

    pub fn eat<T>(&mut self, expect: fn(&Token) -> Option<T>) -> Result<T, SyntaxError> {
        match expect(&self.queue[0].0) {
            None => self.fail(None),
            Some(res) => {
                self.advance();
                Ok(res)
            }
        }
    }

    pub fn eat_keyword(&mut self, expect: Token) -> bool {
        if self.queue[0].0.same_variant(expect) {
            self.advance();
            true
        } else {
            false
        }
    }

    pub fn check_actual(&mut self, expect: Token) -> bool {
        if self.queue[0].0.same_variant(expect) {
            true
        } else {
            false
        }
    }

    #[inline]
    pub fn get(&self) -> &Token {
        &self.queue[0].0
    }

    #[inline]
    pub fn peek(&self, lookhead: usize) -> &Token {
        &self.queue[lookhead].0
    }

    #[inline]
    pub fn span(&self) -> Span {
        self.queue[0].1
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
