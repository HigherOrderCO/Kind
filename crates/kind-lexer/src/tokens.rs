use num_bigint::BigUint;

/// A single lexeme of the Kind programming language.
pub enum Token {
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
    /// Documentation comment.
    Comment { is_doc: bool, data: String },

    /// End of file token
    EOF,

    /// Error token literal.
    Error,
}