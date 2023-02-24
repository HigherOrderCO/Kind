use std::ops::Range;

use logos::Logos;

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

    #[regex("\\?[A-Za-z_]*")]
    Help,

    #[regex("[a-z_][a-zA-Z0-9_]*")]
    LowerId,

    #[regex("[A-Z][a-zA-Z0-9_]*")]
    UpperId,

    #[regex(r"'", |x| read_string(x, '\''))]
    Char,

    #[regex(r#"""#, |x| read_string(x, '\"'))]
    Str,

    #[regex("[0-9][_0-9]*")]
    #[regex("0[xX][0-9A-F][_0-9A-F]*")]
    #[regex("0[bB][01][01_]*")]
    #[regex("0[oO][0-7][0-7_]*")]
    Num60,

    #[regex("[0-9][_0-9]*u120")]
    #[regex("0[xX][0-9A-F][_0-9A-F]*u120")]
    #[regex("0[bB][01][01]*u120")]
    #[regex("0[oO][0-7][0-7]*u120")]
    Num120,

    #[regex("[0-9][_0-9]n")]
    #[regex("0[xX][0-9A-F][_0-9A-F]n")]
    #[regex("0[bB][01][01_]n")]
    #[regex("0[oO][0-7][0-7]n")]
    Nat,

    #[regex("[0-9]+\\.[0-9]*")]
    #[regex("[0-9]+(\\.[0-9]*)?[eE][+-]?[0-9]+")]
    Float,

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

    /// It shifts to another lexer.
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

fn read_string(lex: &mut logos::Lexer<Token>, end: char) -> bool {
    let mut escaped = false;

    for char in lex.remainder().chars() {
        match (escaped, char) {
            (false, c) if c == end => {
                return true;
            }
            (false, '\'') => escaped = true,
            (true, _) => escaped = false,
            (false, _) => (),
        }
        lex.bump(char.len_utf8());
    }

    false
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
                        break Ok(())
                    } else {
                        continue
                    }
                }
                Some(Comment::Skip) => continue,
                None => break Err(LexicalError::CommentNotClosed())
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
            Token::CommentStart => {
                match self.skip_comment() {
                    Ok(_) => self.next(),
                    Err(err) => Some(Err(err))
                }
            }
            Token::Error => Some(Result::Err(LexicalError::Err(self.0.span()))),
            other => Some(Result::Ok((span.start, other, span.end))),
        }
    }
}

#[cfg(test)]
mod tests {
    use logos::Logos;
    use crate::lexer::*;

    #[test]
    pub fn test_parser_pi() {
        let lexer = Lexer(crate::lexer::Token::lexer(
            "#kdl_name = List_takebck
             List.take_back <a> (n: Nat) (xs: List a) : List a {
                let ndrop = Nat.sub (List.length xs) n
                List.drop xs ndrop
             }"
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
}