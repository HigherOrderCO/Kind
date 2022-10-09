use std::sync::mpsc::Sender;

use kind_span::Span;

use crate::errors::SyntaxError;

use self::{state::Lexer, tokens::Token};

pub mod comments;
pub mod literals;
pub mod state;
pub mod tokens;

fn is_whitespace(chr: char) -> bool {
    matches!(chr, ' ' | '\r' | '\t')
}

fn is_valid_id(chr: char) -> bool {
    chr.is_alphanumeric() || matches!(chr, '_' | '$' | '.')
}

fn is_valid_id_start(chr: char) -> bool {
    chr.is_alphabetic() || matches!(chr, '_')
}

impl<'a> Lexer<'a> {
    pub fn single_token(&mut self, token: Token, start: usize) -> (Token, Span) {
        self.next_char();
        (token, self.mk_span(start))
    }

    pub fn is_linebreak(&mut self) -> bool {
        self.accumulate_while(&is_whitespace);
        let count = self.accumulate_while(&|x| x == '\n').len();
        self.accumulate_while(&is_whitespace);
        count > 0
    }

    pub fn to_keyword(str: &str) -> Token {
        match str {
            "ask" => Token::Ask,
            "do" => Token::Do,
            "if" => Token::If,
            "else" => Token::Else,
            "match" => Token::Match,
            "let" => Token::Let,
            "open" => Token::Open,
            "return" => Token::Return,
            _ => Token::Id(str.to_string()),
        }
    }

    pub fn get_next_no_error(&mut self, vec: &Sender<Box<SyntaxError>>) -> (Token, Span) {
        loop {
            let (token, span) = self.lex_token();
            match token {
                Token::Error(x) => {
                    let _ = vec.send(x);
                    continue;
                }
                Token::Comment(false, _) => continue,
                Token::Comment(true, _) if !self.emit_comment => continue,
                _ => (),
            }
            return (token, span);
        }
    }

    pub fn lex_token(&mut self) -> (Token, Span) {
        let start = self.span();
        match self.peekable.peek() {
            None => (Token::Eof, self.mk_span(start)),
            Some(chr) => match chr {
                c if is_whitespace(*c) => {
                    self.accumulate_while(&is_whitespace);
                    self.lex_next()
                }
                '\n' => {
                    self.accumulate_while(&|x| x == '\n' || x == '\r');
                    self.lex_next()
                }
                c if c.is_ascii_digit() => self.lex_number(),
                c if is_valid_id_start(*c) => {
                    let str = self.accumulate_while(&is_valid_id);
                    (Lexer::to_keyword(str), self.mk_span(start))
                }
                '(' => self.single_token(Token::LPar, start),
                ')' => self.single_token(Token::RPar, start),
                '[' => self.single_token(Token::LBracket, start),
                ']' => self.single_token(Token::RBracket, start),
                '{' => self.single_token(Token::LBrace, start),
                '}' => self.single_token(Token::RBrace, start),
                '#' => {
                    self.next_char();
                    match self.peekable.peek() {
                        Some('#') => self.single_token(Token::HashHash, start),
                        _ => (Token::Hash, self.mk_span(start)),
                    }
                }
                '=' => {
                    self.next_char();
                    match self.peekable.peek() {
                        Some('>') => self.single_token(Token::FatArrow, start),
                        Some('=') => self.single_token(Token::EqEq, start),
                        _ => (Token::Eq, self.mk_span(start)),
                    }
                }
                '>' => {
                    self.next_char();
                    match self.peekable.peek() {
                        Some('>') => self.single_token(Token::GreaterGreater, start),
                        Some('=') => self.single_token(Token::GreaterEq, start),
                        _ => (Token::Greater, self.mk_span(start)),
                    }
                }
                '<' => {
                    self.next_char();
                    match self.peekable.peek() {
                        Some('<') => self.single_token(Token::LessLess, start),
                        Some('=') => self.single_token(Token::LessEq, start),
                        _ => (Token::Less, self.mk_span(start)),
                    }
                }
                '/' => {
                    self.next_char();
                    match self.peekable.peek() {
                        Some('/') => self.lex_comment(start),
                        Some('*') => self.lex_multiline_comment(start),
                        _ => (Token::Slash, self.mk_span(start)),
                    }
                }
                ':' => {
                    self.next_char();
                    match self.peekable.peek() {
                        Some(':') => self.single_token(Token::ColonColon, start),
                        _ => (Token::Colon, self.mk_span(start)),
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
                        _ => (Token::Minus, self.mk_span(start)),
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
                    (Token::Help(str.to_string()), self.mk_span(start))
                }
                '!' => {
                    self.next_char();
                    match self.peekable.peek() {
                        Some('=') => self.single_token(Token::BangEq, start),
                        _ => (Token::Bang, self.mk_span(start)),
                    }
                }
                &c => {
                    self.next_char();
                    (Token::Error(Box::new(SyntaxError::UnexpectedChar(c, self.mk_span(start)))), self.mk_span(start))
                }
            },
        }
    }
}
