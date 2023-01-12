//! The entry point for the parsing. it parses all of the
//! trivial tokens like ponctuations or identifiers. Some
//! other construtions like [comments] and [literals] are
//! stored in other modules for better mantenaiblity.
//!
//! [comments]: crate::lexer::literals
//! [literals]: crate::lexer::literals

use std::sync::mpsc::Sender;

use kind_report::data::Diagnostic;
use kind_span::Range;

use crate::diagnostic::SyntaxDiagnostic;

use self::{state::Lexer, tokens::Token};

pub mod comments;
pub mod literals;
pub mod state;
pub mod tokens;

fn is_whitespace(chr: char) -> bool {
    matches!(chr, ' ' | '\r' | '\t')
}

fn is_valid_id(chr: char) -> bool {
    chr.is_ascii_alphanumeric() || matches!(chr, '_' | '$' | '.')
}

fn is_valid_upper_start(chr: char) -> bool {
    chr.is_ascii_uppercase()
}

fn is_valid_id_start(chr: char) -> bool {
    chr.is_ascii_alphanumeric() || matches!(chr, '_')
}

impl<'a> Lexer<'a> {
    pub fn single_token(&mut self, token: Token, start: usize) -> (Token, Range) {
        self.next_char();
        (token, self.mk_range(start))
    }

    pub fn is_linebreak(&mut self) -> bool {
        self.accumulate_while(&is_whitespace);
        let count = self.accumulate_while(&|x| x == '\n').len();
        self.accumulate_while(&is_whitespace);
        count > 0
    }

    pub fn to_keyword(data: &str) -> Token {
        match data {
            "return" => Token::Return,
            "ask" => Token::Ask,
            "with" => Token::With,
            _ => Token::LowerId(data.to_string()),
        }
    }

    pub fn get_next_no_error(&mut self, vec: Sender<Box<dyn Diagnostic>>) -> (bool, Token, Range) {
        loop {
            let is_break = self.is_linebreak();
            let (token, span) = self.lex_token();
            match token {
                Token::Error(x) => {
                    vec.send(x).unwrap();
                    continue;
                }
                Token::Comment(false, _) => continue,
                _ => (),
            }
            return (is_break, token, span);
        }
    }

    fn lex_token(&mut self) -> (Token, Range) {
        let start = self.span();
        match self.peekable.peek() {
            None => (Token::Eof, self.mk_range(start)),
            Some(chr) => match chr {
                c if is_whitespace(*c) => {
                    self.accumulate_while(&is_whitespace);
                    self.lex_next()
                }
                '\n' => {
                    self.accumulate_while(&|x| x == '\n' || x == '\r');
                    self.lex_next()
                }
                '.' => {
                    self.next_char();
                    match self.peekable.peek() {
                        Some('.') => self.single_token(Token::DotDot, start),
                        _ => (Token::Dot, self.mk_range(start)),
                    }
                }
                c if c.is_ascii_digit() => self.lex_number(),
                c if is_valid_upper_start(*c) => {
                    let first_part = self.accumulate_while(&is_valid_id).to_string();
                    let peek = self.peekable.peek().cloned();
                    let auxiliar_part = match peek {
                        Some('/') => {
                            self.next_char();
                            let aux = self.accumulate_while(&is_valid_id);
                            Some(aux.to_string())
                        }
                        _ => None,
                    };
                    (
                        Token::UpperId(first_part, auxiliar_part),
                        self.mk_range(start),
                    )
                }
                '_' => {
                    self.accumulate_while(&is_valid_id);
                    (Token::Hole, self.mk_range(start))
                }
                c if is_valid_id_start(*c) => {
                    let str = self.accumulate_while(&is_valid_id);
                    (Lexer::to_keyword(str), self.mk_range(start))
                }
                '(' => self.single_token(Token::LPar, start),
                ')' => self.single_token(Token::RPar, start),
                '[' => self.single_token(Token::LBracket, start),
                ']' => self.single_token(Token::RBracket, start),
                '~' => self.single_token(Token::Tilde, start),
                '{' => self.single_token(Token::LBrace, start),
                '}' => self.single_token(Token::RBrace, start),
                '#' => {
                    self.next_char();
                    match self.peekable.peek() {
                        Some('#') => self.single_token(Token::HashHash, start),
                        _ => (Token::Hash, self.mk_range(start)),
                    }
                }
                '=' => {
                    self.next_char();
                    match self.peekable.peek() {
                        Some('>') => self.single_token(Token::FatArrow, start),
                        Some('=') => self.single_token(Token::EqEq, start),
                        _ => (Token::Eq, self.mk_range(start)),
                    }
                }
                '>' => {
                    self.next_char();
                    match self.peekable.peek() {
                        Some('>') => self.single_token(Token::GreaterGreater, start),
                        Some('=') => self.single_token(Token::GreaterEq, start),
                        _ => (Token::Greater, self.mk_range(start)),
                    }
                }
                '<' => {
                    self.next_char();
                    match self.peekable.peek() {
                        Some('<') => self.single_token(Token::LessLess, start),
                        Some('=') => self.single_token(Token::LessEq, start),
                        _ => (Token::Less, self.mk_range(start)),
                    }
                }
                '/' => {
                    self.next_char();
                    match self.peekable.peek() {
                        Some('/') => self.lex_comment(start),
                        Some('*') => self.lex_multiline_comment(start),
                        _ => (Token::Slash, self.mk_range(start)),
                    }
                }
                ':' => {
                    self.next_char();
                    match self.peekable.peek() {
                        Some(':') => self.single_token(Token::ColonColon, start),
                        _ => (Token::Colon, self.mk_range(start)),
                    }
                }
                ';' => self.single_token(Token::Semi, start),
                '$' => self.single_token(Token::Dollar, start),
                ',' => self.single_token(Token::Comma, start),
                '+' => self.single_token(Token::Plus, start),
                '-' => {
                    self.next_char();
                    match self.peekable.peek() {
                        Some('>') => self.single_token(Token::RightArrow, start),
                        _ => (Token::Minus, self.mk_range(start)),
                    }
                }
                '*' => self.single_token(Token::Star, start),
                '%' => self.single_token(Token::Percent, start),
                '&' => self.single_token(Token::Ampersand, start),
                '|' => self.single_token(Token::Bar, start),
                '^' => self.single_token(Token::Hat, start),
                '"' => self.lex_string(),
                '?' => {
                    self.next_char();
                    let str = self.accumulate_while(&is_valid_id);
                    (Token::Help(str.to_string()), self.mk_range(start))
                }
                '\'' => {
                    let start = self.span();
                    self.next_char();
                    let chr = match self.lex_char() {
                        Ok(res) => res,
                        Err(err) => return (Token::Error(err.into()), self.mk_range(start)),
                    };
                    match self.peekable.peek() {
                        Some('\'') => self.single_token(Token::Char(chr), start),
                        Some(c) => (
                            Token::Error(Box::new(SyntaxDiagnostic::UnexpectedChar(
                                *c,
                                self.mk_range(start),
                            ))),
                            self.mk_range(start),
                        ),
                        None => (
                            Token::Error(Box::new(SyntaxDiagnostic::UnfinishedChar(
                                self.mk_range(start),
                            ))),
                            self.mk_range(start),
                        ),
                    }
                }
                '!' => {
                    self.next_char();
                    match self.peekable.peek() {
                        Some('=') => self.single_token(Token::BangEq, start),
                        _ => (Token::Bang, self.mk_range(start)),
                    }
                }
                &c => {
                    self.next_char();
                    (
                        Token::Error(Box::new(SyntaxDiagnostic::UnexpectedChar(
                            c,
                            self.mk_range(start),
                        ))),
                        self.mk_range(start),
                    )
                }
            },
        }
    }
}
