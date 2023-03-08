//! Describes the concrete AST with all of the sugars. It's useful
//! to pretty printing and resugarization from the type checker.
//! It stores some tokens inside the tree in order to make it easier
//! to reconstruct the entire program.

use kind_span::Span;
use thin_vec::ThinVec;

use kind_lexer::tokens::Token;

/// A localized data structure, it's useful to keep track of source code
/// location.
pub struct Item<T> {
    pub data: T,
    pub span: Span,
}

// Lexemes
pub type Colon = Token;
pub type Hash = Token;

// Compounds

pub struct Parenthesis<T>(Token, T, Token);
pub struct Bracket<T>(Token, T, Token);
pub struct Equal<T>(Token, T);

pub struct Tokenized<T>(Token, T);

// Concrete syntax tree
pub type Name = Tokenized<String>;

pub enum AttributeStyleKind {
    String(Tokenized<String>),
    Number(Tokenized<u64>),
    Identifier(Item<Name>),
    List(Parenthesis<ThinVec<AttributeStyle>>),
}

/// The "argument" part of the attribute. It can be used both in
/// the value after an equal or in the arguments e.g
///
/// ```kind
/// #name = "Vaundy"
/// #derive[match]
/// ```
///
pub type AttributeStyle = Item<AttributeStyleKind>;

pub struct AttributeKind {
    pub hash: Hash,
    pub name: Item<Name>,
    pub value: Option<Equal<AttributeStyle>>,
    pub arguments: Option<Bracket<ThinVec<AttributeStyle>>>,
}

/// An attribute is a special compiler flag.
pub type Attribute = Item<AttributeKind>;
