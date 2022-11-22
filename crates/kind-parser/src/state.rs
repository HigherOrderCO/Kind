//! Describes the state of the parser.

use std::{collections::VecDeque, sync::mpsc::Sender};

use kind_report::data::Diagnostic;
use kind_span::Range;

use crate::{errors::SyntaxDiagnostic, lexer::tokens::Token, Lexer};

/// The parser state. it current have some parameters
/// that makes the behaviour change
/// - eaten: It counts how much tokens it has eaten
/// it's useful to all of the rules that use "try_local"
/// and similar functions
pub struct Parser<'a> {
    lexer: Lexer<'a>,
    /// We have to shift these things one position
    /// to the left so idk what i should use it here
    /// probably the movement will not affect it so much
    /// because it's a ring buffer.
    queue: VecDeque<(Token, Range)>,
    breaks: VecDeque<bool>,
    dignostic_channel: Sender<Box<dyn Diagnostic>>,
    /// It's useful when we have to try to parse something
    /// that fails in the first token. as the parser ignores some
    /// tokens, we cannot rely on the count provided by the
    /// lexer.
    eaten: u32,
    pub failed: bool,
}

impl<'a> Parser<'a> {
    pub fn new(mut lexer: Lexer<'a>, sender: Sender<Box<dyn Diagnostic>>) -> Parser<'a> {
        let mut queue = VecDeque::with_capacity(3);
        let mut breaks = VecDeque::with_capacity(3);
        for _ in 0..3 {
            breaks.push_back(lexer.is_linebreak());
            queue.push_back(lexer.get_next_no_error(sender.clone()));
        }
        Parser {
            lexer,
            queue,
            breaks,
            dignostic_channel: sender,
            eaten: 0,
            failed: false,
        }
    }

    pub fn advance(&mut self) -> (Token, Range) {
        let cur = self.queue.pop_front().unwrap();
        self.breaks.pop_front();
        self.breaks.push_back(self.lexer.is_linebreak());
        self.queue
            .push_back(self.lexer.get_next_no_error(self.dignostic_channel.clone()));
        self.eaten += 1;
        cur
    }

    pub fn is_linebreak(&self) -> bool {
        self.breaks[0]
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
    pub fn range(&self) -> Range {
        self.queue[0].1
    }

    #[inline]
    pub fn fail<T>(&mut self, expect: Vec<Token>) -> Result<T, SyntaxDiagnostic> {
        Err(SyntaxDiagnostic::UnexpectedToken(
            self.get().clone(),
            self.range(),
            expect,
        ))
    }

    pub fn send_dignostic(&mut self, diagnostic: SyntaxDiagnostic) {
        self.dignostic_channel.send(Box::new(diagnostic)).unwrap();
        self.failed = true;
    }

    pub fn eat_closing_keyword(
        &mut self,
        expect: Token,
        range: Range,
    ) -> Result<(), SyntaxDiagnostic> {
        if !self.check_and_eat(expect.clone()) {
            if self.get().is_eof() {
                Err(SyntaxDiagnostic::Unclosed(range))
            } else {
                self.fail(vec![expect])
            }
        } else {
            Ok(())
        }
    }

    pub fn eat_variant(&mut self, expect: Token) -> Result<(Token, Range), SyntaxDiagnostic> {
        if self.get().same_variant(&expect) {
            Ok(self.advance())
        } else {
            self.fail(vec![expect])
        }
    }

    pub fn eat_id(&mut self, expect: &str) -> Result<(Token, Range), SyntaxDiagnostic> {
        match self.get() {
            Token::LowerId(x) if x == expect => Ok(self.advance()),
            _ => self.fail(vec![Token::LowerId(expect.to_string())]),
        }
    }

    pub fn eat<T>(&mut self, expect: fn(&Token) -> Option<T>) -> Result<T, SyntaxDiagnostic> {
        match expect(self.get()) {
            None => self.fail(vec![]),
            Some(res) => {
                self.advance();
                Ok(res)
            }
        }
    }

    pub fn check_and_eat(&mut self, expect: Token) -> bool {
        if self.get().same_variant(&expect) {
            self.advance();
            true
        } else {
            false
        }
    }

    pub fn check_actual(&mut self, expect: Token) -> bool {
        self.get().same_variant(&expect)
    }

    pub fn check_actual_id(&self, expect: &str) -> bool {
        matches!(self.get(), Token::LowerId(x) if x == expect)
    }

    pub fn try_single<T>(
        &mut self,
        fun: &dyn Fn(&mut Parser<'a>) -> Result<T, SyntaxDiagnostic>,
    ) -> Result<Option<T>, SyntaxDiagnostic> {
        let current = self.eaten;
        match fun(self) {
            Err(_) if current == self.eaten => Ok(None),
            Err(err) => Err(err),
            Ok(res) => Ok(Some(res)),
        }
    }
}
