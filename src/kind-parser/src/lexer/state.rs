use std::{iter::Peekable, str::Chars};

use kind_span::{Pos, Range, Span, SyntaxCtxIndex};

use crate::{errors::SyntaxError, lexer::tokens::Token};

/// The lexer state.
pub struct Lexer<'a> {
    pub input: &'a str,
    pub peekable: &'a mut Peekable<Chars<'a>>,
    pub pos: usize,
    pub ctx: SyntaxCtxIndex,

    // Modes
    pub semis: u16,
    pub comment_depth: u16,
    pub errs: Vec<Box<SyntaxError>>,
    pub emit_comment: bool,
}

impl<'a> Lexer<'a> {
    pub fn new(input: &'a str, peekable: &'a mut Peekable<Chars<'a>>, ctx: SyntaxCtxIndex) -> Lexer<'a> {
        Lexer {
            input,
            pos: 0,
            ctx,
            peekable,
            semis: 0,
            comment_depth: 0,
            errs: Vec::new(),
            emit_comment: false,
        }
    }

    pub fn mk_span(&self, start: usize) -> Span {
        Span::new(Range::new(Pos(start as u32), Pos(self.pos as u32), self.ctx))
    }

    pub fn next_char(&mut self) -> Option<char> {
        match self.peekable.next() {
            Some(chr) if !self.input.is_empty() => {
                self.input = &self.input[chr.len_utf8()..];
                self.pos += chr.len_utf8();
                Some(chr)
            }
            _ => None,
        }
    }

    pub fn accumulate_while(&mut self, condition: &dyn Fn(char) -> bool) -> &str {
        let mut size = 0;
        while let Some(&x) = self.peekable.peek() {
            if !condition(x) {
                break;
            }
            size += x.len_utf8();
            self.peekable.next();
        }
        self.pos += size;
        let str = &self.input[..size];
        self.input = &self.input[size..];
        str
    }

    pub fn next_chars(&mut self, size: usize) -> Option<&str> {
        let start = self.pos;
        for _ in 0..size {
            if let Some(&x) = self.peekable.peek() {
                self.pos += x.len_utf8();
                self.peekable.next();
            } else {
                return None;
            }
        }
        let len = self.pos - start;
        let str = &self.input[..len];
        self.input = &self.input[len..];
        Some(str)
    }

    #[inline]
    /// Useful as entrypoint
    pub fn lex_next(&mut self) -> (Token, Span) {
        self.lex_token()
    }
}
