use kind_lexer::tokens::Token;
use kind_span::Span;

pub type Hash = Token;
pub type Minus = Token;
pub type Plus = Token;
pub type Semi = Token;
pub type RightArrow = Token;
pub type Tilde = Token;
pub type FatArrow = Token;
pub type ColonColon = Token;
pub type Let = Token;
pub type Type = Token;
pub type Help = Token;
pub type With = Token;
pub type Ask = Token;
pub type Return = Token;
pub type Sign = Token;
pub type Specialize = Token;
pub type Into = Token;
pub type In = Token;
pub type Match = Token;
pub type Open = Token;
pub type Do = Token;
pub type Dot = Token;

pub enum Either<A, B> {
    Left(A),
    Right(B),
}

// Compounds
#[derive(Debug)]
pub struct Paren<T>(pub Token, pub T, pub Token);

#[derive(Debug)]
pub struct Bracket<T>(pub Token, pub T, pub Token);

#[derive(Debug)]
pub struct Brace<T>(pub Token, pub T, pub Token);

#[derive(Debug)]
pub struct AngleBracket<T>(pub Token, pub T, pub Token);

#[derive(Debug)]
pub struct Equal<T>(pub Token, pub T);

#[derive(Debug)]
pub struct Colon<T>(pub Token, pub T);

#[derive(Debug)]
pub struct Tokenized<T>(pub Token, pub T);

// Concrete syntax tree

#[derive(Debug)]
pub struct Ident(pub Item<Tokenized<String>>);

#[derive(Debug)]
pub struct QualifiedIdent(pub Item<Tokenized<String>>);

/// A localized data structure, it's useful to keep track of source code
/// location.
#[derive(Debug)]
pub struct Item<T> {
    pub data: T,
    pub span: Span,
}

impl<T> Paren<T> {
    pub fn span(&self) -> Span {
        self.0.span.mix(&self.2.span)
    }
}

impl<T> Bracket<T> {
    pub fn span(&self) -> Span {
        self.0.span.mix(&self.2.span)
    }
}

impl<T> Brace<T> {
    pub fn span(&self) -> Span {
        self.0.span.mix(&self.2.span)
    }
}

impl<T> Tokenized<T> {
    pub fn span(&self) -> Span {
        self.0.span.clone()
    }
}

impl<T> From<Tokenized<T>> for Item<T> {
    fn from(val: Tokenized<T>) -> Self {
        Item::new(val.span(), val.1)
    }
}

impl<T> Item<T> {
    pub fn new(span: Span, data: T) -> Item<T> {
        Item { data, span }
    }

    pub fn map<U>(self, fun: fn(T) -> U) -> Item<U> {
        Item {
            data: fun(self.data),
            span: self.span,
        }
    }
}
