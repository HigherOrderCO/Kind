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
#[derive(Clone, Debug, Hash)]
pub struct Ident {
    pub data: Symbol,
    pub range: Range,
    /// Flag that is useful to avoid unbound errors while
    /// trying to collect names created by each of the sintatic
    /// sugars.
    pub used_by_sugar: bool,
}

impl Ident {
    pub fn new(data: String, range: Range) -> Ident {
        Ident {
            data: Symbol(data),
            range,
            used_by_sugar: false,
        }
    }

    pub fn new_static(data: &str, range: Range) -> Ident {
        Ident {
            data: Symbol(data.to_string()),
            range,
            used_by_sugar: false,
        }
    }

    pub fn new_by_sugar(data: &str, range: Range) -> Ident {
        Ident {
            data: Symbol(data.to_string()),
            range,
            used_by_sugar: true,
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
            used_by_sugar: self.used_by_sugar,
        }
    }

    pub fn add_segment(&self, name: &str) -> Ident {
        Ident {
            data: Symbol(format!("{}.{}", self.data.0, name)),
            range: self.range,
            used_by_sugar: self.used_by_sugar,
        }
    }

    pub fn generate(data: &str) -> Ident {
        Ident {
            data: Symbol(data.to_string()),
            range: Range::ghost_range(),
            used_by_sugar: false,
        }
    }

    // TODO: Not sure if error messages will be that good with
    // sintetized idents like that. I think I should make another ident type for
    // not completed constructors.
    pub fn add_base_ident(&self, base: &str) -> Ident {
        Ident {
            data: Symbol(format!("{}.{}", base, self.data.0)),
            range: self.range,
            used_by_sugar: self.used_by_sugar,
        }
    }
}

impl Display for Ident {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}", self.data.0)
    }
}
