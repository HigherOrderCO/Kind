//! This crate describes two types of abstract syntax trees.
//! one for sugared trees (that are useful to create documentation),
//! to format and to locate "phisically" all of the nodes so we can
//! generate a lot of error messages. The other one that is desugured
//! is useful to interface with HVM and KDL.

/// The concrete AST.
#[macro_use]
pub mod concrete;

/// The desugared AST.
pub mod desugared;

/// The untyped AST.
pub mod untyped;

/// Describes symbols (identifiers) on the language. It will
/// be really useful when we change the Symbol to take a number
/// instead of a string due to optimizations.
pub mod symbol;

pub use hvm::syntax as backend;
use symbol::Ident;

/// Attributes describes some compiler specific aspects
/// like inlining and derivations.
#[derive(Clone, Debug, Default)]
pub struct Attributes {
    pub inlined: bool,
    pub kdl_run: bool,
    pub kdl_erase: bool,
    pub kdl_name: Option<Ident>,
    pub kdl_state: Option<Ident>,
    pub trace: Option<bool>, // Some is enabled and some(true) is enabled with arguments
    pub keep: bool
}

/// Enum of binary operators.
#[derive(Copy, Clone, Debug, Hash, PartialEq, Eq)]
pub enum Operator {
    Add,
    Sub,
    Mul,
    Div,
    Mod,
    And,
    Or,
    Xor,
    Shl,
    Shr,
    Ltn,
    Lte,
    Eql,
    Gte,
    Gtn,
    Neq,
}
