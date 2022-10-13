use std::fmt::Display;

use kind_span::{Range, SyntaxCtxIndex};

// Stores the name of a variable or constructor
#[derive(Clone, PartialEq, Eq, Hash, Debug)]
pub struct Symbol(pub String);

// Identifier inside a syntax context.
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
}

impl Display for Ident {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}", self.data.0)
    }
}
