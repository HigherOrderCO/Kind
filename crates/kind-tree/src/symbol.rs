//! Describes identifiers and symbols inside the language.

use kind_span::{Range, SyntaxCtxIndex};
use std::fmt::Display;
use std::hash::Hash;

/// Stores the name of a variable or constructor.
/// It's simply a string because in the future i plan
/// to store all the names and only reference them with
/// a u64.
#[derive(Clone, Debug)]
pub struct Symbol {
    data: String,
    hash: u64,
}

impl Symbol {
    pub fn new(str: String) -> Symbol {
        Symbol {
            hash: fxhash::hash64(&str),
            data: str,
        }
    }
}

impl PartialEq for Symbol {
    fn eq(&self, other: &Self) -> bool {
        self.hash == other.hash
    }
}

impl Hash for Symbol {
    fn hash<H: std::hash::Hasher>(&self, state: &mut H) {
        state.write_u64(self.hash);
    }
}

impl Eq for Symbol {}

/// Identifier inside a syntax context.
#[derive(Clone, Debug, Hash, PartialEq, Eq)]
pub struct Ident {
    pub data: Symbol,
    pub range: Range,
    pub generated: bool,
}

/// Qualified Identifiers always refer to top level
/// constructions.
#[derive(Clone, Debug, Hash, PartialEq, Eq)]
pub struct QualifiedIdent {
    root: Symbol,
    aux: Option<Symbol>,

    pub range: Range,

    /// Flag that is useful to avoid unbound errors while
    /// trying to collect names created by each of the sintatic
    /// sugars.
    pub generated: bool,
}

impl QualifiedIdent {
    pub fn new(root: Symbol, aux: Option<Symbol>, range: Range) -> QualifiedIdent {
        QualifiedIdent {
            root,
            aux,
            range,
            generated: false,
        }
    }

    /// Most of the times a qualified ident will not have the `aux` field
    /// because it's removed at the `expand_uses` phase. It returns the root
    /// and avoid a copy of the string.
    #[inline]
    pub fn to_str(&self) -> &str {
        &self.root.data
    }

    #[inline]
    pub fn get_root(&self) -> String {
        self.root.data.clone()
    }

    #[inline]
    pub fn get_aux(&self) -> Option<Symbol> {
        self.aux.clone()
    }

    #[inline]
    pub fn reset_aux(&mut self) {
        self.aux = None
    }

    pub fn change_root(&mut self, str: String) {
        self.root = Symbol::new(str);
    }

    pub fn to_generated(&self) -> Self {
        let mut new = self.clone();
        new.generated = true;
        new
    }

    /// Avoid this function. It transforms a QualifiedIdent into a Ident
    pub fn to_ident(&self) -> Ident {
        Ident {
            data: Symbol::new(self.to_string()),
            range: self.range,
            generated: self.generated,
        }
    }

    pub fn new_static(root: &str, aux: Option<String>, range: Range) -> QualifiedIdent {
        QualifiedIdent {
            root: Symbol::new(root.to_string()),
            aux: aux.map(Symbol::new),
            range,
            generated: false,
        }
    }

    pub fn new_sugared(root: &str, extension: &str, range: Range) -> QualifiedIdent {
        QualifiedIdent {
            root: Symbol::new(format!("{}.{}", root, extension)),
            aux: None,
            range,
            generated: true,
        }
    }

    pub fn add_segment(&self, extension: &str) -> QualifiedIdent {
        QualifiedIdent {
            root: Symbol::new(format!("{}.{}", self.root.data, extension)),
            aux: self.aux.clone(),
            range: self.range,
            generated: self.generated,
        }
    }
}

impl Ident {
    pub fn new(data: String, range: Range) -> Ident {
        Ident {
            data: Symbol::new(data),
            range,
            generated: false,
        }
    }

    pub fn new_static(data: &str, range: Range) -> Ident {
        Ident {
            data: Symbol::new(data.to_string()),
            range,
            generated: false,
        }
    }

    pub fn new_by_sugar(data: &str, range: Range) -> Ident {
        Ident {
            data: Symbol::new(data.to_string()),
            range,
            generated: true,
        }
    }

    pub fn with_name(&self, f: fn(String) -> String) -> Ident {
        let mut new = self.clone();
        new.data = Symbol::new(f(new.data.data));
        new
    }

    pub fn add_underscore(&self) -> Ident {
        let mut new = self.clone();
        new.data = Symbol::new(format!("{}_", new.data.data));
        new
    }

    #[inline]
    pub fn to_str(&self) -> &str {
        &self.data.data
    }

    pub fn to_generated(&self) -> Self {
        let mut old = self.clone();
        old.generated = true;
        old
    }

    pub fn to_qualified_ident(&self) -> QualifiedIdent {
        QualifiedIdent {
            root: self.data.clone(),
            aux: None,
            range: self.range,
            generated: false,
        }
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
            generated: false,
        }
    }

    pub fn add_segment(&self, name: &str) -> Ident {
        Ident {
            data: Symbol::new(format!("{}.{}", self.data.data, name)),
            range: self.range,
            generated: false,
        }
    }

    pub fn generate(data: &str) -> Ident {
        Ident {
            data: Symbol::new(data.to_owned()),
            range: Range::ghost_range(),
            generated: true,
        }
    }
}

impl Display for Symbol {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}", self.data)
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
