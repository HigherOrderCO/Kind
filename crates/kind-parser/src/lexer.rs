//! Lexer module for the Kind2 language.

use kind_span::{Span, Spanned, Symbol, SyntaxCtxIndex};
use std::{iter::Peekable, str::Chars};

use crate::{
    diagnostic::{EncodeSequence, SyntaxDiagnostic, SyntaxDiagnosticKind},
    tokens::Token,
};

fn is_whitespace(chr: char) -> bool {
    matches!(chr, ' ' | '\r' | '\t')
}

fn is_valid_id(chr: char) -> bool {
    chr.is_ascii_alphanumeric() || matches!(chr, '_' | '$')
}

fn is_valid_upper_start(chr: char) -> bool {
    chr.is_ascii_uppercase()
}

fn is_valid_id_start(chr: char) -> bool {
    chr.is_ascii_alphanumeric() || matches!(chr, '_')
}

pub struct Lexer<'a> {
    pub input: &'a str,
    pub peekable: Peekable<Chars<'a>>,
    pub pos: usize,
    pub ctx: SyntaxCtxIndex,
    pub comment_depth: u16,
}

impl<'a> Lexer<'a> {
    pub fn new(input: &'a str, ctx: SyntaxCtxIndex) -> Lexer<'a> {
        Lexer {
            input,
            pos: 0,
            ctx,
            peekable: input.chars().peekable(),
            comment_depth: 0,
        }
    }

    /// Advances a single character.
    pub fn next_char(&mut self) -> Option<char> {
        match self.peekable.next() {
            Some(chr) if !self.input.is_empty() => {
                self.pos += chr.len_utf8();
                Some(chr)
            }
            _ => None,
        }
    }

    /// Advances in the source code until the condition is false.
    pub fn accumulate_while(&mut self, condition: &dyn Fn(char) -> bool) -> &str {
        let mut end = self.pos;
        while let Some(&x) = self.peekable.peek() {
            if !condition(x) {
                break;
            }
            end += x.len_utf8();
            self.peekable.next();
        }
        let str = &self.input[self.pos..end];
        self.pos = end;
        str
    }

    /// Advances chars based on how much we want to advance.
    pub fn next_chars(&mut self, size: usize) -> Option<&str> {
        for _ in 0..size {
            if let Some(&x) = self.peekable.peek() {
                println!("Added2");
                self.pos += x.len_utf8();
                self.peekable.next();
            } else {
                return None;
            }
        }
        let str = &self.input[self.pos..self.pos+size];
        Some(str)
    }

    pub fn single_token(&mut self, token: Token, start: usize) -> Spanned<Token> {
        self.next_char();
        (token, start..self.pos)
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
            _ => Token::LowerId(Symbol::intern(data)),
        }
    }

    /// Lex a sequence of digits of the base @base@ with
    /// maximum length of @size@ and turns it into a char.
    fn lex_char_encoded(
        &mut self,
        start: usize,
        size: usize,
        base: u32,
        err: EncodeSequence,
    ) -> Result<char, SyntaxDiagnostic> {
        let string = self.next_chars(size);
        let to_chr = string.and_then(|x| u32::from_str_radix(x, base).ok());
        if let Some(chr) = to_chr.and_then(char::from_u32) {
            return Ok(chr);
        }
        Err(SyntaxDiagnostic {
            span: start..self.pos,
            data: SyntaxDiagnosticKind::InvalidEscapeSequence(err),
        })
    }

    /// Turns a escaped char into a normal char.
    fn lex_escaped_char(&mut self, start: usize) -> Result<char, SyntaxDiagnostic> {
        match self.peekable.peek() {
            None => Err(SyntaxDiagnostic {
                span: start..self.pos,
                data: SyntaxDiagnosticKind::UnfinishedString,
            }),
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

    /// Lexes a number of base @base@, figuring out it's type
    /// Lexes 0 if not at a digit position
    fn lex_num_and_type_with_base(
        &mut self,
        num_start: usize,
        base: u32,
        err: EncodeSequence,
    ) -> Spanned<Token> {
        let num = self.accumulate_while(&|x| x.is_digit(base) || x == '_');
        let num = if num.is_empty() { "0" } else { num };
        let num = num.to_string();

        let type_start = self.pos;

        let make_num_err = |x: &Self| {
            (
                Token::Error(Box::new(SyntaxDiagnostic {
                    span: num_start..x.pos,
                    data: SyntaxDiagnosticKind::InvalidNumberRepresentation(err),
                })),
                num_start..x.pos,
            )
        };

        match self.peekable.peek() {
            Some('n' | 'N') => {
                self.next_char();
                if let Ok(res) = u128::from_str_radix(&num.replace('_', ""), base) {
                    (Token::Nat(res), num_start..self.pos)
                } else {
                    make_num_err(self)
                }
            }
            Some('U' | 'u') => {
                self.next_char();
                let type_ = self.accumulate_while(&|x| x.is_ascii_digit());
                match type_ {
                    "60" => {
                        if let Ok(res) = u64::from_str_radix(&num.replace('_', ""), base) {
                            (Token::Num60(res), type_start..self.pos)
                        } else {
                            make_num_err(self)
                        }
                    }
                    "120" => {
                        if let Ok(res) = u128::from_str_radix(&num.replace('_', ""), base) {
                            (Token::Num120(res), type_start..self.pos)
                        } else {
                            make_num_err(self)
                        }
                    }
                    _ => {
                        let symbol = format!("u{}", type_);
                        (
                            Token::Error(Box::new(SyntaxDiagnostic {
                                span: type_start..self.pos,
                                data: SyntaxDiagnosticKind::InvalidNumberType(symbol),
                            })),
                            type_start..self.pos,
                        )
                    }
                }
            }
            Some(_) | None => {
                if let Ok(res) = u64::from_str_radix(&num.replace('_', ""), base) {
                    (Token::Num60(res), num_start..self.pos)
                } else {
                    make_num_err(self)
                }
            }
        }
    }

    /// Lex numbers with decimal, hexadecimal, binary or octal.
    pub fn lex_number(&mut self) -> Spanned<Token> {
        let start = self.pos;
        match self.peekable.peek() {
            None => (Token::Eof, start..self.pos),
            Some('0') => {
                self.next_char();
                match self.peekable.peek() {
                    Some('x' | 'X') => {
                        self.next_char();
                        self.lex_num_and_type_with_base(start, 16, EncodeSequence::Hexa)
                    }
                    Some('o' | 'O') => {
                        self.next_char();
                        self.lex_num_and_type_with_base(start, 8, EncodeSequence::Octal)
                    }
                    Some('b' | 'B') => {
                        self.next_char();
                        self.lex_num_and_type_with_base(start, 2, EncodeSequence::Binary)
                    }
                    Some('0'..='9' | _) | None => {
                        self.lex_num_and_type_with_base(start, 10, EncodeSequence::Decimal)
                    }
                }
            }
            Some('0'..='9' | _) => {
                self.lex_num_and_type_with_base(start, 10, EncodeSequence::Decimal)
            }
        }
    }

    pub fn lex_char(&mut self) -> Result<char, SyntaxDiagnostic> {
        let start = self.pos;
        if let Some(&x) = self.peekable.peek() {
            let chr_start = self.pos;
            match x {
                '\\' => {
                    self.next_char();
                    match self.lex_escaped_char(chr_start) {
                        Ok(x) => Ok(x),
                        Err(t) => Err(t),
                    }
                }
                x => {
                    self.next_char();
                    Ok(x)
                }
            }
        } else {
            Err(SyntaxDiagnostic {
                span: start..self.pos,
                data: SyntaxDiagnosticKind::UnfinishedChar,
            })
        }
    }

    /// Lexes a string that starts with '"' and ends with the
    /// same char. each string item can contain a escaped char
    /// and if the esaped char is not well-formed then it will
    /// acummulate the error until the end of the string.
    /// TODO: Accumulate multiple encoding errors?
    pub fn lex_string(&mut self) -> Spanned<Token> {
        let start = self.pos;

        self.next_char();

        let mut string = String::new();
        let mut error: Option<Spanned<Token>> = None;

        while let Some(&x) = self.peekable.peek() {
            let chr_start = self.pos;
            match x {
                '\"' => break,
                '\\' => {
                    self.next_char();
                    match self.lex_escaped_char(chr_start) {
                        Ok(x) => string.push(x),
                        Err(t) => {
                            self.accumulate_while(&|x| x != '"');
                            error = Some((Token::Error(Box::new(t)), start..self.pos));
                        }
                    }
                    continue;
                }
                x => string.push(x),
            }
            // FIXME: Not sure if it causes a bug!
            self.next_char();
        }

        match (self.next_char(), error) {
            (_, Some(err)) => err,
            (Some('"'), _) => (Token::Str(Symbol::intern(&string)), start..self.pos),
            _ => (
                Token::Error(Box::new(SyntaxDiagnostic {
                    span: start..self.pos,
                    data: SyntaxDiagnosticKind::UnfinishedString,
                })),
                start..self.pos,
            ),
        }
    }

    /// Single line comments
    pub fn lex_comment(&mut self, start: usize) -> Spanned<Token> {
        self.next_char();

        let mut is_doc = false;
        if let Some('!') = self.peekable.peek() {
            self.next_char();
            is_doc = true;
        }

        let cmt = self.accumulate_while(&|x| x != '\n');
        (Token::Comment(is_doc, Symbol::intern(cmt)), start..self.pos)
    }

    /// Parses multi line comments with nested comments
    /// really useful
    pub fn lex_multiline_comment(&mut self, start: usize) -> Spanned<Token> {
        let mut size = 0;
        self.next_char();

        let mut next = |p: &mut Lexer<'a>, x: char| {
            size += x.len_utf8();
            p.peekable.next();
        };

        self.comment_depth += 1;

        while let Some(&x) = self.peekable.peek() {
            match x {
                '*' => {
                    next(self, x);
                    if let Some('/') = self.peekable.peek() {
                        self.comment_depth -= 1;
                        if self.comment_depth == 0 {
                            next(self, '/');
                            break;
                        }
                    }
                }
                '/' => {
                    next(self, x);
                    if let Some('*') = self.peekable.peek() {
                        self.comment_depth += 1;
                    }
                }
                _ => (),
            }
            next(self, x);
        }
        self.pos += size;
        if self.comment_depth != 0 {
            (
                Token::Error(Box::new(SyntaxDiagnostic {
                    span: start..self.pos,
                    data: SyntaxDiagnosticKind::UnfinishedComment,
                })),
                start..self.pos,
            )
        } else {
            let str = &self.input[..size - 2];
            self.input = &self.input[size..];
            (Token::Comment(false, Symbol::intern(str)), start..self.pos)
        }
    }

    pub fn lex_token(&mut self) -> Spanned<Token> {
        let start = self.pos;

        match self.peekable.peek() {
            None => (Token::Eof, start..self.pos),
            Some(chr) => match chr {
                c if is_whitespace(*c) => {
                    self.accumulate_while(&is_whitespace);
                    self.lex_token()
                }
                c if c.is_ascii_digit() => self.lex_number(),
                c if is_valid_upper_start(*c) => {
                    let str = self.accumulate_while(&is_valid_id);
                    (Token::UpperId(Symbol::intern(str)), start..self.pos)
                }
                c if is_valid_id_start(*c) => {
                    let str = self.accumulate_while(&is_valid_id);
                    (Lexer::to_keyword(str), start..self.pos)
                }
                '\n' => {
                    self.accumulate_while(&|x| x == '\n' || x == '\r');
                    self.lex_token()
                }
                '.' => {
                    self.next_char();
                    match self.peekable.peek() {
                        Some('.') => self.single_token(Token::DotDot, start),
                        _ => (Token::Dot, start..self.pos),
                    }
                }
                '(' => self.single_token(Token::LPar, start),
                ')' => self.single_token(Token::RPar, start),
                '[' => self.single_token(Token::LBracket, start),
                ']' => self.single_token(Token::RBracket, start),
                '~' => self.single_token(Token::Tilde, start),
                '{' => self.single_token(Token::LBrace, start),
                '}' => self.single_token(Token::RBrace, start),
                '*' => self.single_token(Token::Star, start),
                '%' => self.single_token(Token::Percent, start),
                '&' => self.single_token(Token::Ampersand, start),
                '|' => self.single_token(Token::Bar, start),
                '^' => self.single_token(Token::Hat, start),
                '#' => {
                    self.next_char();
                    match self.peekable.peek() {
                        Some('#') => self.single_token(Token::HashHash, start),
                        _ => (Token::Hash, start..self.pos),
                    }
                }
                '=' => {
                    self.next_char();
                    match self.peekable.peek() {
                        Some('>') => self.single_token(Token::FatArrow, start),
                        Some('=') => self.single_token(Token::EqEq, start),
                        _ => (Token::Eq, start..self.pos),
                    }
                }
                '>' => {
                    self.next_char();
                    match self.peekable.peek() {
                        Some('>') => self.single_token(Token::GreaterGreater, start),
                        Some('=') => self.single_token(Token::GreaterEq, start),
                        _ => (Token::Greater, start..self.pos),
                    }
                }
                '<' => {
                    self.next_char();
                    match self.peekable.peek() {
                        Some('<') => self.single_token(Token::LessLess, start),
                        Some('=') => self.single_token(Token::LessEq, start),
                        _ => (Token::Less, start..self.pos),
                    }
                }
                '/' => {
                    self.next_char();
                    match self.peekable.peek() {
                        Some('/') => self.lex_comment(start),
                        Some('*') => self.lex_multiline_comment(start),
                        _ => (Token::Slash, start..self.pos),
                    }
                }
                ':' => {
                    self.next_char();
                    match self.peekable.peek() {
                        Some(':') => self.single_token(Token::ColonColon, start),
                        _ => (Token::Colon, start..self.pos),
                    }
                }
                ';' => self.single_token(Token::Semi, start),
                '$' => self.single_token(Token::Dollar, start),
                ',' => self.single_token(Token::Comma, start),
                '+' => {
                    self.next_char();
                    match self.peekable.peek() {
                        Some('=') => self.single_token(Token::PlusEq, start),
                        _ => (Token::Plus, start..self.pos),
                    }
                }
                '@' => {
                    self.next_char();
                    match self.peekable.peek() {
                        Some('=') => self.single_token(Token::AtEq, start),
                        _ => (Token::At, start..self.pos),
                    }
                }
                '-' => {
                    self.next_char();
                    match self.peekable.peek() {
                        Some('>') => self.single_token(Token::RightArrow, start),
                        _ => (Token::Minus, start..self.pos),
                    }
                }
                '!' => {
                    self.next_char();
                    match self.peekable.peek() {
                        Some('=') => self.single_token(Token::BangEq, start),
                        _ => (Token::Bang, start..self.pos),
                    }
                }
                '?' => {
                    self.next_char();
                    let str = self.accumulate_while(&is_valid_id);
                    (Token::Help(Symbol::intern(str)), start..self.pos)
                }
                '"' => self.lex_string(),
                '\'' => {
                    let start = self.pos;
                    self.next_char();
                    let chr = match self.lex_char() {
                        Ok(res) => res,
                        Err(err) => return (Token::Error(err.into()), start..self.pos),
                    };
                    match self.peekable.peek() {
                        Some('\'') => self.single_token(Token::Char(chr), start),
                        Some(c) => (
                            Token::Error(Box::new(SyntaxDiagnostic {
                                data: SyntaxDiagnosticKind::UnexpectedChar(*c),
                                span: start..self.pos,
                            })),
                            start..self.pos,
                        ),
                        None => (
                            Token::Error(Box::new(SyntaxDiagnostic {
                                data: SyntaxDiagnosticKind::UnfinishedChar,
                                span: start..self.pos,
                            })),
                            start..self.pos,
                        ),
                    }
                }
                &c => {
                    self.next_char();
                    (
                        Token::Error(Box::new(SyntaxDiagnostic {
                            span: start..self.pos,
                            data: SyntaxDiagnosticKind::UnexpectedChar(c),
                        })),
                        start..self.pos,
                    )
                }
            },
        }
    }
}

pub struct LexerItem {
    pub token: Token,
    pub breaks_line: bool,
    pub span: Span,
}

impl<'a> Iterator for Lexer<'a> {
    type Item = LexerItem;

    fn next(&mut self) -> Option<Self::Item> {
        let line_break = self.is_linebreak();
        match self.lex_token() {
            (Token::Eof, _) => None,
            (token, span) => Some(LexerItem {
                token,
                breaks_line: line_break,
                span,
            }),
        }
    }
}

#[cfg(test)]
mod test {
    use super::*;

    #[test]
    pub fn test_simple() {
        let mut lexer = Lexer::new("
            SomeEntry : U60
            SomeEntry = (+ 1 2)
        ", SyntaxCtxIndex(0));

        assert!(matches!(lexer.next().map(|x| x.token), Some(Token::UpperId(_))));
        assert!(matches!(lexer.next().map(|x| x.token), Some(Token::Colon)));
        assert!(matches!(lexer.next().map(|x| x.token), Some(Token::UpperId(_))));
        assert!(matches!(lexer.next().map(|x| x.token), Some(Token::UpperId(_))));
        assert!(matches!(lexer.next().map(|x| x.token), Some(Token::Eq)));
        assert!(matches!(lexer.next().map(|x| x.token), Some(Token::LPar)));
        assert!(matches!(lexer.next().map(|x| x.token), Some(Token::Plus)));
        assert!(matches!(lexer.next().map(|x| x.token), Some(Token::Num60(_))));
        assert!(matches!(lexer.next().map(|x| x.token), Some(Token::Num60(_))));
        assert!(matches!(lexer.next().map(|x| x.token), Some(Token::RPar)));

    }
}
