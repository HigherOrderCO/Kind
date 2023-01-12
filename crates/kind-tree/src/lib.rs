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

/// Telescope (Iterated sigma type representation)
pub mod telescope;

/// Describes symbols (identifiers) on the language. It will
/// be really useful when we change the Symbol to take a number
/// instead of a string due to optimizations.
pub mod symbol;

use std::fmt::{Display, Error, Formatter};

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
    pub keep: bool,
    pub partial: bool,
    pub axiom: bool,
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

impl Display for Operator {
    fn fmt(&self, f: &mut Formatter<'_>) -> Result<(), Error> {
        use Operator::*;

        match self {
            Add => write!(f, "+"),
            Sub => write!(f, "-"),
            Mul => write!(f, "*"),
            Div => write!(f, "/"),
            Mod => write!(f, "%"),
            And => write!(f, "&"),
            Or => write!(f, "|"),
            Xor => write!(f, "^"),
            Shl => write!(f, "<<"),
            Shr => write!(f, ">>"),
            Ltn => write!(f, "<"),
            Lte => write!(f, "<="),
            Eql => write!(f, "=="),
            Gte => write!(f, ">="),
            Gtn => write!(f, ">"),
            Neq => write!(f, "!="),
        }
    }
}
