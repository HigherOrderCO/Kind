//! Lexes some types of literals. It's a isolated
//! module because it requires a lot of code to
//! parse some specific things like escaped characters
//! inside of strings.

use kind_span::Range;

use crate::errors::{EncodeSequence, SyntaxError};
use crate::lexer::tokens::Token;
use crate::Lexer;

impl<'a> Lexer<'a> {
    /// Lex a sequence of digits of the base @base@ with
    /// maximum length of @size@ and turns it into a char.
    fn lex_char_encoded(
        &mut self,
        start: usize,
        size: usize,
        base: u32,
        err: EncodeSequence,
    ) -> Result<char, SyntaxError> {
        let string = self.next_chars(size);
        let to_chr = string.and_then(|x| u32::from_str_radix(x, base).ok());
        if let Some(chr) = to_chr.and_then(char::from_u32) {
            return Ok(chr);
        }
        Err(SyntaxError::InvalidEscapeSequence(
            err,
            self.mk_range(start),
        ))
    }

    /// Turns a escaped char into a normal char.
    fn lex_escaped_char(&mut self, start: usize) -> Result<char, SyntaxError> {
        match self.peekable.peek() {
            None => Err(SyntaxError::UnfinishedString(
                self.mk_one_column_range(start),
            )),
            Some(&x) => {
                self.next_char();
                match x {
                    '\'' => Ok('\''),
                    '\"' => Ok('\"'),
                    'n' => Ok('\n'),
                    'r' => Ok('\r'),
                    't' => Ok('\t'),
                    '0' => Ok('\0'),
                    '\\' => Ok('\\'),
                    'x' => self.lex_char_encoded(start, 2, 16, EncodeSequence::Hexa),
                    'u' => self.lex_char_encoded(start, 4, 16, EncodeSequence::Unicode),
                    other => Ok(other),
                }
            }
        }
    }

    /// Lex a base-10 digit.
    fn lex_digit(&mut self, start: usize) -> (Token, Range) {
        let num = self.accumulate_while(&|x| x.is_ascii_digit());
        (
            Token::Num(num.parse::<u64>().unwrap()),
            self.mk_range(start),
        )
    }

    /// Lexes a number of base @base@ removing the first
    /// character that indicates the encoding
    fn lex_base(&mut self, start: usize, base: u32, err: EncodeSequence) -> (Token, Range) {
        self.next_char();
        let num = self.accumulate_while(&|x| x.is_digit(base));
        if let Ok(res) = u64::from_str_radix(num, base) {
            (Token::Num(res), self.mk_range(start))
        } else {
            (
                Token::Error(Box::new(SyntaxError::InvalidNumberRepresentation(
                    err,
                    self.mk_range(start),
                ))),
                self.mk_range(start),
            )
        }
    }

    /// Lex numbers with decimal, hexadecimal, binary or octal.
    pub fn lex_number(&mut self) -> (Token, Range) {
        let start = self.span();
        match self.peekable.peek() {
            None => (Token::Eof, self.mk_range(start)),
            Some('0') => {
                self.next_char();
                match self.peekable.peek() {
                    Some('x') => self.lex_base(start, 16, EncodeSequence::Hexa),
                    Some('o') => self.lex_base(start, 8, EncodeSequence::Octal),
                    Some('b') => self.lex_base(start, 2, EncodeSequence::Binary),
                    Some('0'..='9') => self.lex_digit(start),
                    Some(_) => (Token::Num(0), self.mk_range(start)),
                    None => (Token::Num(0), self.mk_range(start)),
                }
            }
            Some('0'..='9') => self.lex_digit(start),
            Some(_) => (Token::Num(0), self.mk_range(start)),
        }
    }

    /// Lexes a string that starts with '"' and ends with the
    /// same char. each string item can contain a escaped char
    /// and if the esaped char is not well-formed then it will
    /// acummulate the error until the end of the string.
    /// TODO: Accumulate multiple encoding errors?
    pub fn lex_string(&mut self) -> (Token, Range) {
        let start = self.span();

        self.next_char();

        let mut string = String::new();
        let mut error: Option<(Token, Range)> = None;

        while let Some(&x) = self.peekable.peek() {
            let chr_start = self.span();
            match x {
                '\"' => break,
                '\\' => {
                    self.next_char();
                    match self.lex_escaped_char(chr_start) {
                        Ok(x) => string.push(x),
                        Err(t) => {
                            self.accumulate_while(&|x| x != '"');
                            error = Some((Token::Error(Box::new(t)), self.mk_range(start)));
                        }
                    }
                    continue;
                }
                x => string.push(x),
            }
            self.next_char();
        }

        match (self.next_char(), error) {
            (_, Some(err)) => err,
            (Some('"'), _) => (Token::Str(string), self.mk_range(start)),
            _ => (
                Token::Error(Box::new(SyntaxError::UnfinishedString(
                    self.mk_one_column_range(start),
                ))),
                self.mk_range(start),
            ),
        }
    }
}
