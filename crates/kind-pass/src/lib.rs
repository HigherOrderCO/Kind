//! A lot of transformations that we can apply into kind trees.
//! * [desugar][desugar] - That desugars the sugared tree into a version that does not contain a lot of constructions like match, inductive types etc.
//! * [erasure][erasure] - Erases all of the definitions that are marked as erased from the runtime.
//! * [expand][expand] - Expand some attributes and derivations of each construction.
//! * [unbound][unbound] - Collects all of the unbound definitions and check the linearity of them.

pub mod desugar;
pub mod erasure;
mod errors;
pub mod expand;
pub mod unbound;
