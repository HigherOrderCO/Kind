use crate::errors::SyntaxError;

#[derive(Debug, Clone)]
pub enum Token {
    LPar,       // (
    RPar,       // )
    LBracket,   // [
    RBracket,   // ]
    LBrace,     // {
    RBrace,     // }
    Eq,         // =
    Colon,      // :
    Semi,       // ;
    FatArrow,   // =>
    Dollar,     // $
    Comma,      // ,
    RightArrow, // ->
    ColonColon, // ::

    Help(String),
    Id(String),

    // Keywords
    Do,
    If,
    Else,
    Match,
    Ask,
    Return,
    Let,
    Open,

    // Literals
    Char(char),
    Str(String),
    Num(u64),
    Float(u64, u64),
    Hole,

    // TO Interpolation

    // Operators
    Plus,
    Minus,
    Star,
    Slash,
    Percent,
    Ampersand,
    Bar,
    Hat,
    GreaterGreater,
    LessLess,
    Less,
    LessEq,
    EqEq,
    GreaterEq,
    Greater,
    NotEq,

    HashHash,
    Hash,

    Comment(bool, String),

    Eof,

    // The error token that is useful to error recovery.
    Error(Box<SyntaxError>),
}

impl Token {
    pub fn same_variant(&self, b: Token) -> bool {
        std::mem::discriminant(self) == std::mem::discriminant(&b)
    }

    pub fn is_id(&self) -> bool {
        matches!(self, Token::Id(_))
    }
}
