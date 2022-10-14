use std::{iter::Peekable, str::Chars};

use kind_span::{Pos, Range, SyntaxCtxIndex};

use crate::lexer::tokens::Token;

/// The lexer state.
pub struct Lexer<'a> {
    pub input: &'a str,
    pub peekable: &'a mut Peekable<Chars<'a>>,
    pub pos: usize,
    pub ctx: SyntaxCtxIndex,

    // Modes
    pub comment_depth: u16,
}

impl<'a> Lexer<'a> {
    pub fn new(
        input: &'a str,
        peekable: &'a mut Peekable<Chars<'a>>,
        ctx: SyntaxCtxIndex,
    ) -> Lexer<'a> {
        Lexer {
            input,
            pos: 0,
            ctx,
            peekable,
            comment_depth: 0,
        }
    }

    pub fn span(&self) -> usize {
        self.pos
    }

    pub fn mk_range(&self, start: usize) -> Range {
        Range::new(
            Pos {
                index: start as u32,
            },
            Pos {
                index: self.pos as u32,
            },
            self.ctx,
        )
    }

    pub fn mk_one_column_range(&self, start: usize) -> Range {
        Range::new(
            Pos {
                index: start as u32,
            },
            Pos {
                index: (start + 1) as u32,
            },
            self.ctx,
        )
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
    pub fn lex_next(&mut self) -> (Token, Range) {
        self.lex_token()
    }
}
