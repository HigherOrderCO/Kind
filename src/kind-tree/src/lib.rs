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

/// Describes symbols (identifiers) on the language. It will
/// be really useful when we change the Symbol to take a number
/// instead of a string due to optimizations.
pub mod symbol;

pub use hvm::language as backend;

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

#[derive(Clone, Debug, Hash, PartialEq, Eq)]
pub enum Number {
    U60(u64),
    U120(u128),
    // TODO: F60
}

#[derive(Clone, Debug, Hash, PartialEq, Eq)]
pub enum NumType {
    U60,
    U120,
}