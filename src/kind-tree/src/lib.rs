//! The concrete tree with all of the sugars. it's useful to
//! generate documentation or related without thinking about
//! the generated code.
#[macro_use]
pub mod concrete;

pub mod desugared;

/// Describes symbols (identifiers) on the language. It will
/// be really useful when we change the Symbol to take a number
/// instead of a string due to optimizations.
pub mod symbol;

/// Enum of binary operators.
#[derive(Copy, Clone, Debug)]
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
