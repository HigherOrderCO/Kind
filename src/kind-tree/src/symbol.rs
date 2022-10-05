use std::fmt::Display;

use kind_span::{Span, SyntaxCtxIndex};

// Stores the name of a variable or constructor
#[derive(Clone, PartialEq, Eq, Hash, Debug)]
pub struct Symbol(pub String);

// Identifier inside a syntax context.
#[derive(Clone, Debug)]
pub struct Ident {
    pub data: Symbol,
    pub ctx: SyntaxCtxIndex,
    pub span: Span,
}

impl Ident {
    pub fn new(data: Symbol, ctx: SyntaxCtxIndex, span: Span) -> Ident {
        Ident { data, ctx, span }
    }

    pub fn new_path(data: &str, id: &str) -> Ident {
        Ident {
            data: Symbol(format!("{}.{}", data, id)),
            ctx: SyntaxCtxIndex(0),
            span: Span::Generated,
        }
    }

    /// Changes the syntax context of the span and of the ident
    pub fn set_ctx(&self, ctx: SyntaxCtxIndex) -> Ident {
        let mut span = self.span;
        span.set_ctx(ctx);
        Ident {
            data: self.data.clone(),
            ctx,
            span,
        }
    }
}

impl Display for Ident {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}", self.data.0)
    }
}
