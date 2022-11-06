//! Describes identifiers and symbols inside the language.

use std::fmt::Display;

use kind_span::{Range, SyntaxCtxIndex};

/// Stores the name of a variable or constructor.
/// It's simply a string because in the future i plan
/// to store all the names and only reference them with
/// a u64.
#[derive(Clone, PartialEq, Eq, Hash, Debug)]
pub struct Symbol(String);

/// Identifier inside a syntax context.
#[derive(Clone, Debug, Hash, PartialEq, Eq)]
pub struct Ident {
    pub data: Symbol,
    pub range: Range,
}

/// Qualified Identifiers always refer to top level
/// constructions.
#[derive(Clone, Debug, Hash, PartialEq, Eq)]
pub struct QualifiedIdent {
    pub root: Symbol,
    pub aux: Option<Symbol>,
    pub range: Range,

    /// Flag that is useful to avoid unbound errors while
    /// trying to collect names created by each of the sintatic
    /// sugars.
    pub used_by_sugar: bool,
}

impl QualifiedIdent {
    pub fn new(root: Symbol, aux: Option<Symbol>, range: Range) -> QualifiedIdent {
        QualifiedIdent {
            root,
            aux,
            range,
            used_by_sugar: false,
        }
    }

    /// Avoid this function. It transforms a QualifiedIdent into a Ident
    pub fn to_ident(&self) -> Ident {
        Ident {
            data: Symbol(self.to_string()),
            range: self.range,
        }
    }

    pub fn new_static(root: String, aux: Option<String>, range: Range) -> QualifiedIdent {
        QualifiedIdent {
            root: Symbol(root),
            aux: aux.map(Symbol),
            range,
            used_by_sugar: false,
        }
    }

    pub fn add_segment(&self, extension: &str) -> QualifiedIdent {
        let aux = match self.aux.clone() {
            Some(res) => Symbol(format!("{}.{}", res.0, extension)),
            None => Symbol(extension.to_string()),
        };
        QualifiedIdent {
            root: self.root.clone(),
            aux: Some(aux),
            range: self.range.clone(),
            used_by_sugar: self.used_by_sugar,
        }
    }
}

impl Ident {
    pub fn new(data: String, range: Range) -> Ident {
        Ident {
            data: Symbol(data),
            range,
        }
    }

    pub fn new_static(data: &str, range: Range) -> Ident {
        Ident {
            data: Symbol(data.to_string()),
            range,
        }
    }

    pub fn new_by_sugar(data: &str, range: Range) -> Ident {
        Ident {
            data: Symbol(data.to_string()),
            range,
        }
    }

    pub fn with_name(&self, f: fn(String) -> String) -> Ident {
        let mut new = self.clone();
        new.data = Symbol(f(new.data.0));
        new
    }

    pub fn to_str(&self) -> &str {
        &self.data.0
    }

    pub fn decode(num: u64) -> String {
        let mut num = num;
        let mut name = String::new();
        while num > 0 {
            let chr = (num % 64) as u8;
            let chr = match chr {
                0 => '.',
                1..=10 => (chr - 1 + b'0') as char,
                11..=36 => (chr - 11 + b'A') as char,
                37..=62 => (chr - 37 + b'a') as char,
                63 => '_',
                64.. => panic!("impossible character value"),
            };
            name.push(chr);
            num /= 64;
        }
        name.chars().rev().collect()
    }

    pub fn encode(&self) -> u64 {
        fn char_to_u64(chr: char) -> u64 {
            match chr {
                '.' => 0,
                '0'..='9' => 1 + chr as u64 - '0' as u64,
                'A'..='Z' => 11 + chr as u64 - 'A' as u64,
                'a'..='z' => 37 + chr as u64 - 'a' as u64,
                '_' => 63,
                _ => panic!("Invalid name character."),
            }
        }

        let mut num: u64 = 0;

        for (i, chr) in self.to_str().chars().enumerate() {
            if i < 10 {
                num = (num << 6) + char_to_u64(chr);
            }
        }

        num
    }

    /// Changes the syntax context of the range and of the ident
    pub fn set_ctx(&self, ctx: SyntaxCtxIndex) -> Ident {
        let range = self.range;
        range.set_ctx(ctx);
        Ident {
            data: self.data.clone(),
            range,
        }
    }

    pub fn add_segment(&self, name: &str) -> Ident {
        Ident {
            data: Symbol(format!("{}.{}", self.data.0, name)),
            range: self.range,
        }
    }

    pub fn generate(data: &str) -> Ident {
        Ident {
            data: Symbol(data.to_string()),
            range: Range::ghost_range(),
        }
    }
}

impl Display for Symbol {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}", self.0)
    }
}

impl Display for Ident {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}", self.data)
    }
}

impl Display for QualifiedIdent {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        if let Some(aux) = &self.aux {
            write!(f, "{}/{}", self.root, aux)
        } else {
            write!(f, "{}", self.root)
        }
    }
}
