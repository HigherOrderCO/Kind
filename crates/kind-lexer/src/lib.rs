//! The hand-written lexer for the Kind programming language.
//! The main structure is the [Lexer] that is the state of the
//! lexer iterator. It stores if it had a linebreak too.

mod tokens;

use std::{iter::Peekable, str::Chars, collections::VecDeque};

use kind_diagnostic::Diagnostic;
use kind_span::{Spanned, Span};
use tokens::Token;

pub enum Base {
    Binary,
    Octal,
    Decimal,
    Hexa
}

pub struct Lexer<'a> {
    input: &'a str,
    chars: Peekable<Chars<'a>>,
    queue: VecDeque<Spanned<Token>>,
    diagnostics: Vec<Diagnostic>,
    current_pos: usize,
    start_pos: usize,
}

impl<'a> Lexer<'a> {
    pub fn new(input: &'a str) -> Self {
        Lexer {
            chars: input.chars().peekable(),
            input,
            queue: Default::default(),
            diagnostics: Default::default(),
            current_pos: 0,
            start_pos: 0,
        }
    }

    fn peek_char(&mut self) -> Option<&char> {
        self.chars.peek()
    }

    fn next_char(&mut self) -> Option<char> {
        let char = self.chars.next()?;
        self.current_pos += char.len_utf8();
        Some(char)
    }

    fn accumulate_while(&mut self, fun: fn(char) -> bool) -> &str {
        let mut end = self.current_pos;

        while let Some(res) = self.chars.peek() {
            if !fun(*res) {
                break
            }
            self.chars.next();
            end += 1;
        }

        &self.input[self.current_pos..end]
    }

    fn make_token_next(&mut self, token: Token) -> Spanned<Token> {
        self.next_char();
        let range = self.start_pos..self.current_pos;
        (token, Span(range))
    }

    fn make_token(&mut self, token: Token) -> Spanned<Token> {
        self.next_char();
        let range = self.start_pos..self.current_pos;
        (token, Span(range))
    }

    fn lex(&mut self) -> Spanned<Token> {
        self.start_pos = self.current_pos;

        match self.peek_char() {
            None => self.make_token_next(Token::EOF),
            Some(char) => {
                match *char {
                    '(' => self.make_token_next(Token::LPar),
                    ')' => self.make_token_next(Token::RPar),
                    '[' => self.make_token_next(Token::LBracket),
                    ']' => self.make_token_next(Token::RBracket),
                    '{' => self.make_token_next(Token::LBrace),
                    '}' => self.make_token_next(Token::RBrace),
                    ';' => self.make_token_next(Token::Semi),
                    '=' => {
                        self.next_char();
                        match self.peek_char() {
                            Some('>') => self.make_token_next(Token::FatArrow),
                            Some('=') => self.make_token_next(Token::EqEq),
                            _ => self.make_token(Token::Eq)
                        }
                    },
                    ':' => {
                        self.next_char();
                        match self.peek_char() {
                            Some(':') => self.make_token_next(Token::ColonColon),
                            _ => self.make_token(Token::Colon)
                        }
                    },
                    '$' => self.make_token_next(Token::Dollar),
                    ',' => self.make_token_next(Token::Comma),
                    '-' => {
                        self.next_char();
                        match self.peek_char() {
                            Some('>') => self.make_token_next(Token::RightArrow),
                            _ => self.make_token(Token::Minus)
                        }
                    },
                    '.' => {
                        self.next_char();
                        match self.peek_char() {
                            Some('.') => self.make_token_next(Token::DotDot),
                            _ => self.make_token(Token::Dot)
                        }
                    },
                    '~' => self.make_token_next(Token::Tilde),
                    '"' => todo!(),
                    '\'' => todo!(),
                    '+' => {
                        self.next_char();
                        match self.peek_char() {
                            Some('=') => self.make_token_next(Token::PlusEq),
                            _ => self.make_token(Token::Plus)
                        }
                    },
                    '<' => {
                        self.next_char();
                        match self.peek_char() {
                            Some('=') => self.make_token_next(Token::LessEq),
                            _ => self.make_token(Token::Less)
                        }
                    },
                    '*' => self.make_token_next(Token::Star),
                    '>' => {
                        self.next_char();
                        match self.peek_char() {
                            Some('=') => self.make_token_next(Token::GreaterEq),
                            _ => self.make_token(Token::Greater)
                        }
                    },
                    '%' => self.make_token_next(Token::Percent),
                    '&' => self.make_token_next(Token::Ampersand),
                    '|' => self.make_token_next(Token::Bar),
                    '^' => self.make_token_next(Token::Hat),
                    '!' => {
                        self.next_char();
                        match self.peek_char() {
                            Some('=') => self.make_token_next(Token::BangEq),
                            _ => self.make_token(Token::Bang)
                        }
                    },
                    '@' => {
                        self.next_char();
                        match self.peek_char() {
                            Some('=') => self.make_token_next(Token::AtEq),
                            _ => self.make_token(Token::Error)
                        }
                    },
                    '#' => {
                        self.next_char();
                        match self.peek_char() {
                            Some('#') => self.make_token_next(Token::HashHash),
                            _ => self.make_token(Token::Hash)
                        }
                    },
                    '/' => self.make_token_next(Token::Slash),
                    '?' => todo!(),
                    _ => todo!(),
                }
            },
        }
    }
}