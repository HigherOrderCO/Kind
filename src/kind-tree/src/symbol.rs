use std::fmt::Display;

use kind_span::{Range, SyntaxCtxIndex};

/// Stores the name of a variable or constructor.
/// It's simply a string because in the future i plan
/// to store all the names and only reference them with
/// a u64.
#[derive(Clone, PartialEq, Eq, Hash, Debug)]
pub struct Symbol(pub String);

/// Identifier inside a syntax context.
#[derive(Clone, Debug, Hash)]
pub struct Ident {
    pub data: Symbol,
    pub ctx: SyntaxCtxIndex,
    pub range: Range,
}

impl Ident {
    pub fn new(data: Symbol, ctx: SyntaxCtxIndex, range: Range) -> Ident {
        Ident { data, ctx, range }
    }

    pub fn to_string(&self) -> &String {
        &self.data.0
    }

    /// Changes the syntax context of the range and of the ident
    pub fn set_ctx(&self, ctx: SyntaxCtxIndex) -> Ident {
        let range = self.range;
        range.set_ctx(ctx);
        Ident {
            data: self.data.clone(),
            ctx,
            range,
        }
    }

    pub fn add_segment(&self, name: &str) -> Ident {
        Ident {
            data: Symbol(format!("{}.{}", self.data.0, name)),
            ctx: self.ctx,
            range: self.range,
        }
    }

    pub fn generate(data: &str) -> Ident {
        Ident {
            data: Symbol(data.to_string()),
            ctx: SyntaxCtxIndex(0),
            range: Range::ghost_range(),
        }
    }

    // TODO: Not sure if error messages will be that good with
    // sintetized idents like that. I think I should make another ident type for
    // not completed constructors.
    pub fn add_base_ident(&self, base: &str) -> Ident {
        Ident {
            data: Symbol(format!("{}.{}", base, self.data.0)),
            ctx: self.ctx,
            range: self.range,
        }
    }
}

impl Display for Ident {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}", self.data.0)
    }
}
