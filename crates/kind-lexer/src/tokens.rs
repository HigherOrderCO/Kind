//! Lexemes for the kind programming language.

use kind_span::{Span, Spanned};
use num_bigint::BigUint;
use thin_vec::ThinVec;

/// The encode of a sequence of characters.
#[derive(Debug)]
pub enum EncodeSequence {
    Binary,
    Octal,
    Decimal,
    Hexa,
    Unicode,
}

/// A single lexeme of the Kind programming language.
#[derive(Debug, PartialEq, Clone)]
pub enum TokenKind {
    /// "("
    LPar,
    /// ")"
    RPar,
    /// "["
    LBracket,
    /// "]"
    RBracket,
    /// "{"
    LBrace,
    /// "}"
    RBrace,
    /// "="
    Eq,
    /// ":"
    Colon,
    /// ";"
    Semi,
    /// "=>"
    FatArrow,
    /// "$"
    Dollar,
    /// ","
    Comma,
    /// "->"
    RightArrow,
    /// ".."
    DotDot,
    /// "."
    Dot,
    /// "~"
    Tilde,
    /// "::"
    ColonColon,
    /// "Type"
    U,
    /// "U60"
    U60,
    /// "F60"
    U120,
    /// "U120"
    F60,
    /// Lower cased identifier that starts with question mark
    Help(String),
    /// Lower cased identifier
    LowerId(String),
    /// Upper cased identifier
    UpperId(String),
    /// Character literal
    Char(char),
    /// String Literal
    Str(String),
    /// Natural number literal
    Nat(BigUint),
    /// U120 Number literal
    Num120(u128),
    /// U60 Number literal
    Num60(u64),
    /// Float literal
    Float(f64),
    /// "+"
    Plus,
    /// "-"
    Minus,
    /// "/"
    Slash,
    /// "<<"
    LessLess,
    /// "*"
    Star,
    /// ">>"
    GreaterGreater,
    /// "%"
    Percent,
    /// "&"
    Ampersand,
    /// "|"
    Bar,
    /// "^"
    Hat,
    /// "<"
    Less,
    /// "<="
    LessEq,
    /// "=="
    EqEq,
    /// ">="
    GreaterEq,
    /// ">"
    Greater,
    /// "!="
    BangEq,
    /// "!"
    Bang,
    /// "+="
    PlusEq,
    /// "@="
    AtEq,
    /// "##"
    HashHash,
    /// "#"
    Hash,
    /// End of file token
    EOF,
    /// Error token literal.
    Error,
}

/// WARNING: Can't compare TokenKind properly because of the f64.
/// NaNs sometimes cause the equality to fail.
impl Eq for TokenKind { }

/// A comment token that can be attached to any other token.
#[derive(Debug, Clone)]
pub struct Comment {
    pub is_doc: bool,
    pub text: String,
}

/// A single lexeme of the Kind programming language.
#[derive(Debug, Clone)]
pub struct Token {
    pub comments: ThinVec<Spanned<Comment>>,
    pub data: TokenKind,
    pub span: Span,
    pub after_newline: bool,
}

impl Token {
    pub fn is_lower_id(&self) -> bool {
        matches!(self.data, TokenKind::LowerId(_))
    }

    pub fn is_upper_id(&self) -> bool {
        matches!(self.data, TokenKind::UpperId(_))
    }

    pub fn is_id(&self) -> bool {
        self.is_lower_id() || self.is_upper_id()
    }

    pub fn is_str(&self) -> bool {
        matches!(self.data, TokenKind::Str(_))
    }

    pub fn is_help(&self) -> bool {
        matches!(self.data, TokenKind::Help(_))
    }

    pub fn is_char(&self) -> bool {
        matches!(self.data, TokenKind::Char(_))
    }

    pub fn is_nat(&self) -> bool {
        matches!(self.data, TokenKind::Nat(_))
    }

    pub fn is_num60(&self) -> bool {
        matches!(self.data, TokenKind::Num60(_))
    }

    pub fn is_num120(&self) -> bool {
        matches!(self.data, TokenKind::Num120(_))
    }

    pub fn is_float(&self) -> bool {
        matches!(self.data, TokenKind::Float(_))
    }

    pub fn is_identifier(&self, str: &str) -> bool {
        matches!(&self.data, TokenKind::UpperId(x) if x == str)
    }

    pub fn is(&self, tkn: TokenKind) -> bool {
        self.data == tkn
    }
}