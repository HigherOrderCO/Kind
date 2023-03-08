//! The hand-written lexer for the Kind programming language. The main
//! structure is the [Cursor] that is the state of the lexer iterator.
//!
//! It's a reusable library that outputs [Token]s. Each token contain
//! enough information to recreate the entire program lexically.

use diagnostics::{LexerDiagnostic, LexerDiagnosticKind};
use num_traits::Num;
use std::ops::Range;
use thin_vec::{thin_vec, ThinVec};

use tokens::{
    Comment, EncodeSequence, Token,
    TokenKind::{self, *},
};

use kind_span::{Span, Spanned};

pub mod diagnostics;
pub mod lookahead;
pub mod tokens;

/// A small type synonym just to add a default error type as it is repeated
/// through the code.
type Result<T, U = LexerDiagnostic> = std::result::Result<T, U>;

/// An iterator over the characters of a text file, which generates tokens
/// through the [Cursor::lex()] function.
pub struct Cursor<'a> {
    // The input text being iterated over
    input: &'a str,

    // An iterator over the characters in the input text
    chars: std::iter::Peekable<std::str::Chars<'a>>,

    // The position of the cursor in the input text
    pos: Range<usize>,

    // Tracks whether a token was created after a sequence of line breaks
    is_after_linebreak: bool,

    // The accumulated comments before a token
    comments: ThinVec<Spanned<Comment>>,
}

/// Checks if a character is a valid identifier character (both upper and lower case).
fn is_valid_id(chr: char) -> bool {
    chr.is_ascii_alphanumeric() || matches!(chr, '_' | '$' | '.')
}

/// Checks if a character is a valid start of an upper case identifier.
fn is_valid_upper_start(chr: char) -> bool {
    chr.is_ascii_uppercase()
}

/// Checks if a character is a valid start of a lower case identifier.
fn is_valid_id_start(chr: char) -> bool {
    chr.is_ascii_alphanumeric() || matches!(chr, '_')
}

/// Checks if a character is a useless whitespace character.
fn is_useless(chr: char) -> bool {
    matches!(chr, ' ' | '\t' | '\r')
}

impl<'a> Cursor<'a> {
    /// Creates a new `Cursor` instance with the given input.
    pub fn new(input: &'a str) -> Self {
        Cursor {
            chars: input.chars().peekable(),
            input,
            pos: 0..0,
            comments: thin_vec![],
            is_after_linebreak: false,
        }
    }

    /// Peeks the next character without consuming it.
    fn peek(&mut self) -> char {
        self.chars.peek().cloned().unwrap_or('\0')
    }

    /// Checks if the cursor has reached the end of the input.
    fn is_eof(&mut self) -> bool {
        self.peek() == '\0'
    }

    /// Consumes the next character and updates the position of the cursor.
    fn bump(&mut self) -> char {
        let char = self.chars.next();

        if let Some(res) = char {
            self.pos.end += res.len_utf8();
            res
        } else {
            '\0'
        }
    }

    /// Consumes characters while the given condition is true and returns the accumulated string.
    fn eat_while(&mut self, fun: &dyn Fn(char) -> bool) -> &str {
        let start = self.pos.start;

        while !self.is_eof() && fun(self.peek()) {
            self.bump();
        }

        &self.input[start..self.pos.end]
    }

    /// Consumes a fixed amount of characters and returns the accumulated string.
    fn accumulate_fixed(&mut self, size: usize) -> Result<&str> {
        let start = self.pos.start;

        for _ in 0..size {
            if self.is_eof() {
                return Err(LexerDiagnosticKind::UnexpectedEof.with(self.span()));
            }
            self.bump();
        }

        Ok(&self.input[start..self.pos.end])
    }

    /// Returns the current span of the cursor.
    fn span(&self) -> Span {
        Span(self.pos.clone())
    }

    /// Returns the current span of the cursor and updates it to the given start.
    fn mk_span(&self, start: usize) -> Span {
        Span(start..self.pos.end)
    }

    /// Creates a token from the given token kind and the accumulated comments.
    fn make_token(&mut self, token: TokenKind) -> Result<Token> {
        let mut comments = thin_vec![];
        std::mem::swap(&mut comments, &mut self.comments);
        Ok(Token {
            comments,
            data: token,
            span: self.span(),
            after_newline: self.is_after_linebreak,
        })
    }

    /// Creates a token and jumps one character forward.
    fn make_token_next(&mut self, token: TokenKind) -> Result<Token> {
        self.bump();
        self.make_token(token)
    }

    /// Lexes a documentation mark
    fn lex_doc_mark(&mut self) -> bool {
        let is_doc = self.peek() == '!';

        if is_doc {
            self.bump();
        }

        is_doc
    }

    /// Tokenizes a single line comment in the format:
    ///
    /// ```bnf
    /// comment ::= "//" [^'\n']* '\n'
    /// ```
    ///
    fn lex_comment(&mut self) -> Spanned<Comment> {
        self.bump();

        let is_doc = self.lex_doc_mark();
        let data = self.eat_while(&|c| c != '\n' && c != '\0');

        let comment = Comment {
            is_doc,
            text: data.to_string(),
        };

        (comment, self.span())
    }

    /// Tokenizes a multi-line comment in the format:
    ///
    /// ```bnf
    /// block_part        ::= (any ~ ('*/' | '/*'))+ | block_comment
    /// multiline_comment ::= '/*' block_part* '*/'
    /// ```
    ///
    pub fn lex_multiline_comment(&mut self) -> Result<Spanned<Comment>> {
        let mut depth = 1;

        let is_doc = self.lex_doc_mark();
        let start = self.pos.end;

        while !self.is_eof() && depth > 0 {
            match (self.bump(), self.peek()) {
                ('*', '/') => {
                    self.bump();
                    depth -= 1;
                }
                ('/', '*') => {
                    self.bump();
                    depth += 1
                }
                _ => (),
            }
        }

        if depth > 0 {
            return Err(LexerDiagnosticKind::UnfinishedComment.with(self.span()));
        }

        let comment = Comment {
            is_doc,
            text: self.input[start..self.pos.end - 2].to_string(),
        };

        Ok((comment, self.mk_span(start)))
    }

    /// Tokenizes a single character with a given base and returns the corresponding character.'
    fn lex_char_encoded(&mut self, size: usize, base: u32, err: EncodeSequence) -> Result<char> {
        let start = self.pos.end;

        let string = self.accumulate_fixed(size)?;
        let to_chr = u32::from_str_radix(string, base).ok();

        if let Some(chr) = to_chr.and_then(char::from_u32) {
            return Ok(chr);
        }

        Err(LexerDiagnosticKind::InvalidEscapeSequence(err).with(self.mk_span(start)))
    }

    /// Tokenizes a single escaped character.
    fn lex_escaped_char(&mut self) -> Result<char> {
        match self.bump() {
            '\0' => Err(LexerDiagnosticKind::UnfinishedString.with(self.span())),
            '\'' => Ok('\''),
            '\"' => Ok('\"'),
            'n' => Ok('\n'),
            'r' => Ok('\r'),
            't' => Ok('\t'),
            '0' => Ok('\0'),
            '\\' => Ok('\\'),
            'x' => self.lex_char_encoded(2, 16, EncodeSequence::Hexa),
            'u' => self.lex_char_encoded(4, 16, EncodeSequence::Unicode),
            other => Ok(other),
        }
    }

    /// Parses a number literal with a certain base.
    fn lex_num<T: Num>(
        &mut self,
        span: Span,
        text: &str,
        base: u32,
        fun: fn(T) -> TokenKind,
    ) -> Result<Token> {
        if let Ok(res) = Num::from_str_radix(text, base) {
            let mut tkn = self.make_token(fun(res))?;
            tkn.span = span;
            Ok(tkn)
        } else {
            Err(LexerDiagnosticKind::InvalidNumberRepresentation.with(span))
        }
    }

    /// Tokenizes a number that starts with a zero digit.
    fn lex_num_and_type_with_base(&mut self, num_start: usize, base: u32) -> Result<Token> {
        self.reset();

        let num = self.eat_while(&|x| x.is_digit(base) || x == '_');
        let num = if num.is_empty() { "0" } else { num };
        let num = num.to_string().replace('_', "");

        let span = self.mk_span(num_start);

        match self.bump() {
            'n' | 'N' => self.lex_num(span, &num, base, Nat),
            'U' | 'u' => {
                self.reset();
                let type_ = self.eat_while(&|x| x.is_ascii_digit());
                match type_ {
                    "60" => self.lex_num(span, &num, base, Num60),
                    "120" => self.lex_num(span, &num, base, Num120),
                    _ => Err(LexerDiagnosticKind::InvalidNumberType.with(span)),
                }
            }
            _ => self.lex_num(span, &num, base, Num60),
        }
    }

    /// Tokenizes a number that starts with a zero digit.
    fn lex_encoded_number(&mut self) -> Result<Token> {
        let start = self.pos.end;
        match self.bump() {
            'x' | 'X' => self.lex_num_and_type_with_base(start, 16),
            'o' | 'O' => self.lex_num_and_type_with_base(start, 8),
            'b' | 'B' => self.lex_num_and_type_with_base(start, 2),
            _ => self.lex_num_and_type_with_base(start, 10),
        }
    }

    /// Lex numbers with decimal, hexadecimal, binary or octal.
    fn lex_number(&mut self) -> Result<Token> {
        let start = self.pos.end;
        match self.bump() {
            '\0' => self.make_token(EOF),
            '0' => self.lex_encoded_number(),
            _ => self.lex_num_and_type_with_base(start, 10),
        }
    }

    /// Lexes a character literal.
    fn lex_char(&mut self) -> Result<Token> {
        let start = self.pos.end;

        let result = match self.bump() {
            '\0' => Err(LexerDiagnosticKind::UnfinishedChar.with(self.mk_span(start))),
            '\\' => self.lex_escaped_char(),
            x => Ok(x),
        }?;

        match self.bump() {
            '\'' => self.make_token(Char(result)),
            _ => Err(LexerDiagnosticKind::UnfinishedChar.with(self.mk_span(start))),
        }
    }

    /// Lexes a string that starts with '"' and ends with the
    /// same char. each string item can contain a escaped char
    /// and if the esaped char is not well-formed then it will
    /// acummulate the error until the end of the string.
    /// TODO: Accumulate multiple encoding errors?
    fn lex_string(&mut self) -> Result<Token> {
        let start = self.pos.end;

        let mut string = String::new();

        while !self.is_eof() {
            match self.bump() {
                '\"' => return self.make_token(Str(string)),
                '\\' => match self.lex_escaped_char() {
                    Ok(x) => string.push(x),
                    Err(t) => {
                        self.eat_while(&|x| x != '"');
                        return Err(t);
                    }
                },
                x => string.push(x),
            }
        }

        Err(LexerDiagnosticKind::UnfinishedString.with(self.mk_span(start)))
    }

    /// Removes all the line breaks from the input before a token.
    fn lex_linebreak(&mut self) -> bool {
        self.reset();

        self.eat_while(&is_useless);
        let count = self.eat_while(&|x| x == '\n');

        !count.is_empty()
    }

    /// Sets the start position of the token to the end position.
    fn reset(&mut self) {
        self.pos.start = self.pos.end;
    }

    pub fn strip_shebang(&mut self) {
        if self.input.len() < 2 {
            return;
        }

        let mut lex = self.input.chars();

        if lex.next().unwrap() == '#' && lex.next().unwrap() == '!' {
            self.eat_while(&|x| x != '\n' && x != '\0');
        }
    }

    /// Tokenizes a single token and returns it.
    pub fn lex(&mut self) -> Result<Token> {
        self.is_after_linebreak = self.lex_linebreak();

        self.reset();

        match self.bump() {
            '\0' => self.make_token(EOF),
            '"' => self.lex_string(),
            '\'' => self.lex_char(),
            '0' => self.lex_encoded_number(),
            '0'..='9' => self.lex_number(),
            '(' => self.make_token(LPar),
            ')' => self.make_token(RPar),
            '[' => self.make_token(LBracket),
            ']' => self.make_token(RBracket),
            '{' => self.make_token(LBrace),
            '}' => self.make_token(RBrace),
            ';' => self.make_token(Semi),
            '$' => self.make_token(Dollar),
            ',' => self.make_token(Comma),
            '~' => self.make_token(Tilde),
            '*' => self.make_token(Star),
            '%' => self.make_token(Percent),
            '&' => self.make_token(Ampersand),
            '|' => self.make_token(Bar),
            '^' => self.make_token(Hat),
            c if is_useless(c) => {
                self.eat_while(&is_useless);
                self.lex()
            }
            c if is_valid_upper_start(c) => {
                let id = self.eat_while(&is_valid_id).to_string();
                self.make_token(UpperId(id))
            }
            c if is_valid_id_start(c) => {
                let id = self.eat_while(&is_valid_id).to_string();
                self.make_token(LowerId(id))
            }
            '?' => {
                self.reset();
                let id = self.eat_while(&is_valid_id).to_string();
                self.make_token(Help(id))
            }
            '=' => match self.peek() {
                '>' => self.make_token_next(FatArrow),
                '=' => self.make_token_next(EqEq),
                _ => self.make_token(Eq),
            },
            ':' => match self.peek() {
                ':' => self.make_token_next(ColonColon),
                _ => self.make_token(Colon),
            },
            '-' => match self.peek() {
                '>' => self.make_token_next(RightArrow),
                _ => self.make_token(Minus),
            },
            '.' => match self.peek() {
                '.' => self.make_token_next(DotDot),
                _ => self.make_token(Dot),
            },
            '+' => match self.peek() {
                '=' => self.make_token_next(PlusEq),
                _ => self.make_token(Plus),
            },
            '<' => match self.peek() {
                '=' => self.make_token_next(LessEq),
                _ => self.make_token(Less),
            },
            '>' => match self.peek() {
                '=' => self.make_token_next(GreaterEq),
                _ => self.make_token(Greater),
            },
            '!' => match self.peek() {
                '=' => self.make_token_next(BangEq),
                _ => self.make_token(Bang),
            },
            '@' => match self.peek() {
                '=' => self.make_token_next(AtEq),
                _ => self.make_token(Error),
            },
            '#' => match self.peek() {
                '#' => self.make_token_next(HashHash),
                _ => self.make_token(Hash),
            },
            '/' => match self.peek() {
                '/' => {
                    let comments = self.lex_comment();
                    self.comments.push(comments);
                    self.lex()
                }
                '*' => {
                    self.bump();
                    let input = self.lex_multiline_comment()?;
                    self.comments.push(input);
                    self.lex()
                }
                _ => self.make_token(Slash),
            },
            c => {
                self.bump();
                Err(LexerDiagnosticKind::UnknownChar(c).with(self.span()))
            }
        }
    }
}

impl<'a> Iterator for Cursor<'a> {
    type Item = Result<Token>;

    fn next(&mut self) -> Option<Self::Item> {
        match self.lex() {
            Ok(Token { data: EOF, .. }) => None,
            err => Some(err),
        }
    }
}

#[cfg(test)]
mod tests {
    use crate::Cursor;

    #[test]
    pub fn test_lexer() {
        let mut cursor = Cursor::new("#!/bin/bash\n(\"adadhsa\")");
        cursor.strip_shebang();

        for n in cursor {
            println!("{:?}", n);
            assert!(n.is_ok());
        }
    }
}
