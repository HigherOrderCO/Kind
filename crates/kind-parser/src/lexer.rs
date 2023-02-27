use std::fmt::Debug;
use std::ops::Range;

use logos::Logos;
use num_bigint::BigUint;
use num_traits::Num;

#[derive(Debug)]
pub enum LexicalError {
    Err(Range<usize>),
    CommentNotClosed(),
}

#[derive(Debug, Clone, PartialEq, Logos)]
pub enum Token {
    #[token("(")]
    LPar,

    #[token(")")]
    RPar,

    #[token("[")]
    LBracket,

    #[token("]")]
    RBracket,

    #[token("{")]
    LBrace,

    #[token("}")]
    RBrace,

    #[token("=")]
    Eq,

    #[token(":")]
    Colon,

    #[token("\n")]
    #[token(";")]
    Semi,

    #[token("=>")]
    FatArrow,

    #[token("$")]
    Dollar,

    #[token(",")]
    Comma,

    #[token("->")]
    RightArrow,

    #[token("..")]
    DotDot,

    #[token(".")]
    Dot,

    #[token("~")]
    Tilde,

    #[token("::")]
    ColonColon,

    #[token("do")]
    Do,

    #[token("if")]
    If,

    #[token("else")]
    Else,

    #[token("match")]
    Match,

    #[token("let")]
    Let,

    #[token("type")]
    Type,

    #[token("Type")]
    U,

    #[token("U60")]
    U60,

    #[token("F60")]
    F60,

    #[token("record")]
    Record,

    #[token("constructor")]
    Constructor,

    #[token("use")]
    Use,

    #[token("as")]
    As,

    #[token("return")]
    Return,

    #[token("ask")]
    Ask,

    #[token("with")]
    With,

    #[regex("\\?[A-Za-z_]*", |lex| lex.slice()[1..].to_string())]
    Help(String),

    #[regex("[a-z_][a-zA-Z0-9_]*", |lex| lex.slice().to_string())]
    LowerId(String),

    #[regex("[A-Z][a-zA-Z0-9_]*", |lex| lex.slice().to_string())]
    UpperId(String),

    #[regex(r"'", |x| read_string(x, '\'');)]
    Char,

    #[regex(r#"""#, |x| read_string(x, '\"').slice().to_string())]
    Str(String),

    #[regex("[0-9][_0-9]*n", |lex| read_number::<BigUint>(lex, false, 10, 1))]
    #[regex("0[xX][0-9A-F][_0-9A-F]*n", |lex| read_number::<BigUint>(lex, true, 16, 1))]
    #[regex("0[bB][01][01_]*n", |lex| read_number::<BigUint>(lex, true, 2, 1))]
    #[regex("0[oO][0-7][0-7]*n", |lex| read_number::<BigUint>(lex, true, 8, 1))]
    Nat(BigUint),

    #[regex("[0-9][_0-9]*u120", |lex| read_number::<u128>(lex, false, 10, 4))]
    #[regex("0[xX][0-9A-F][_0-9A-F]*u120", |lex| read_number::<u128>(lex, true, 16, 4))]
    #[regex("0[bB][01][01_]*u120", |lex| read_number::<u128>(lex, true, 2, 4))]
    #[regex("0[oO][0-7][0-7_]*u120", |lex| read_number::<u128>(lex, true, 8, 4))]
    Num120(u128),

    #[regex("[0-9][_0-9]*", |lex| read_number::<u64>(lex, false, 10, 0))]
    #[regex("0[xX][0-9A-F][_0-9A-F]*", |lex| read_number::<u64>(lex, true, 16, 0))]
    #[regex("0[bB][01][01_]*", |lex| read_number::<u64>(lex, true, 2, 0))]
    #[regex("0[oO][0-7][0-7_]*", |lex| read_number::<u64>(lex, true, 8, 0))]
    Num60(u64),

    #[regex("[0-9]+\\.[0-9]*", |lex| lex.slice().parse::<f64>().unwrap())]
    #[regex("[0-9]+(\\.[0-9]*)?[eE][+-]?[0-9]+", |lex| lex.slice().parse::<f64>().unwrap())]
    Float(f64),

    #[token("+")]
    Plus,

    #[token("-")]
    Minus,

    #[token("/")]
    Slash,

    #[token("<<")]
    LessLess,

    #[token("*")]
    Star,

    #[token(">>")]
    GreaterGreater,

    #[token("%")]
    Percent,

    #[token("&")]
    Ampersand,

    #[token("|")]
    Bar,

    #[token("^")]
    Hat,

    #[token("<")]
    Less,

    #[token("<=")]
    LessEq,

    #[token("==")]
    EqEq,

    #[token(">=")]
    GreaterEq,

    #[token(">")]
    Greater,

    #[token("!=")]
    BangEq,

    #[token("!")]
    Bang,

    #[token("+=")]
    PlusEq,

    #[token("@=")]
    AtEq,

    #[token("##")]
    HashHash,

    #[token("#")]
    Hash,

    // It shifts to another lexer.
    #[token("/*")]
    CommentStart,

    #[regex(r"//[^\n]*")]
    Comment,

    #[error]
    #[regex(r"[ \t\r\f]+", logos::skip)]
    Error,
}

#[derive(Debug, Clone, Logos, PartialEq, Eq)]
enum Comment {
    #[token("*/")]
    End,
    #[token("/*")]
    Start,
    #[error]
    Skip,
}

fn read_string<'b, 'a>(lex: &'b mut logos::Lexer<'a,Token>, end: char) -> &'b mut logos::Lexer<'a, Token> {
    let mut escaped = false;

    for char in lex.remainder().chars() {
        match (escaped, char) {
            (false, c) if c == end => return lex,
            (false, '\'') => escaped = true,
            (true, _) => escaped = false,
            (false, _) => (),
        }
        lex.bump(char.len_utf8());
    }

    lex
}

fn read_number<T: Num + Debug>(
    lex: &mut logos::Lexer<Token>,
    slice: bool,
    radix: u32,
    trim: usize,
) -> T {
    let iter = lex.slice().chars().filter(|c| *c != '_');

    let string: String = if slice {
        iter.skip(2).collect()
    } else {
        iter.collect()
    };

    let end = string.len() - trim;
    let res: Result<T, <T as Num>::FromStrRadixErr> = Num::from_str_radix(&string[..end], radix);

    // I cant use expect here 👍
    match res {
        Ok(res) => res,
        Err(_) => panic!("read number error '{}'", &string[..trim]),
    }
}

pub struct Lexer<'input>(pub logos::Lexer<'input, Token>);

impl<'input> Lexer<'input> {
    fn skip_comment(&mut self) -> Result<(), LexicalError> {
        let mut lex = self.0.to_owned().morph::<Comment>();
        let mut nest = 1;

        let result = loop {
            match lex.next() {
                Some(Comment::Start) => nest += 1,
                Some(Comment::End) => {
                    nest -= 1;
                    if nest == 0 {
                        break Ok(());
                    } else {
                        continue;
                    }
                }
                Some(Comment::Skip) => continue,
                None => break Err(LexicalError::CommentNotClosed()),
            }
        };

        self.0 = lex.morph::<Token>();
        result
    }
}

impl<'input> Iterator for Lexer<'input> {
    type Item = Result<(usize, Token, usize), LexicalError>;

    fn next(&mut self) -> Option<Self::Item> {
        let res = self.0.next()?;
        let span = self.0.span();

        match res {
            Token::CommentStart => match self.skip_comment() {
                Ok(_) => self.next(),
                Err(err) => Some(Err(err)),
            },
            Token::Error => Some(Result::Err(LexicalError::Err(self.0.span()))),
            other => Some(Result::Ok((span.start, other, span.end))),
        }
    }
}

#[cfg(test)]
mod tests {
    use crate::lexer::*;
    use logos::Logos;

    #[test]
    pub fn test_parser_pi() {
        let lexer = Lexer(crate::lexer::Token::lexer(
            "#kdl_name = List_takebck
             List.take_back <a> (n: Nat) (xs: List a) : List a {
                let ndrop = Nat.sub (List.length xs) n
                List.drop xs ndrop
             }",
        ));
        for tkn in lexer {
            if let Err(err) = tkn {
                panic!("oh no, error {:?}", err)
            }
        }
    }

    #[test]
    pub fn test_parser_lambda() {
        let lexer = Lexer(crate::lexer::Token::lexer("/*/*\n*/*/"));
        for tkn in lexer {
            if let Err(err) = tkn {
                panic!("oh no, error {:?}", err)
            }
        }
    }

    #[test]
    pub fn test_parser_number() {
        let lexer = Lexer(crate::lexer::Token::lexer("456 123n 0x321 123432 4556u120"));
        for tkn in lexer {
            match tkn {
                Ok(ok) => println!("{:?}", ok.1),
                Err(err) => panic!("oh no, error {:?}", err),
            }
        }
    }
}
