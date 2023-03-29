use crate::fetch::Is;
use kind_syntax::concrete;
use kind_syntax::core;

/// A query is a request for a rule.
pub enum Query<A> {
    Module(Is<A, concrete::Module>, String),         // CST
    TopLevel(Is<A, concrete::TopLevel>, String),     // CST
    AbstractModule(Is<A, core::Module>, String),     // AST
    AbstractTopLevel(Is<A, core::TopLevel>, String), // AST
}

impl<A: std::hash::Hash> std::hash::Hash for Query<A> {
    fn hash<H: std::hash::Hasher>(&self, state: &mut H) {
        std::mem::discriminant(self).hash(state);
    }
}

impl<A: std::hash::Hash> Query<A> {
    pub fn rules(&self) -> Result<A, String> {
        match self {
            Query::Module(_, _) => todo!(),
            Query::TopLevel(_, _) => todo!(),
            Query::AbstractModule(_, _) => todo!(),
            Query::AbstractTopLevel(_, _) => todo!(),
        }
    }
}
