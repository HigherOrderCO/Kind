use std::path::PathBuf;

use crate::fetch::Is;
use kind_syntax::concrete;
use kind_syntax::core;
use thin_vec::ThinVec;

/// A query is a request for a rule.
pub enum Query<A> {
    SourceDirectories(Is<A, ThinVec<PathBuf>>, String), // File System
    Source(Is<A, String>, PathBuf),                     // Text
    Dependencies(Is<A, ThinVec<PathBuf>>, PathBuf),     // Dependencies
    TransitiveDependencies(Is<A, ThinVec<PathBuf>>, PathBuf), // Dependencies

    Module(Is<A, concrete::Module>, PathBuf),        // CST
    TopLevel(Is<A, concrete::TopLevel>, String),     // CST
    AbstractModule(Is<A, core::Module>, String),     // AST
    AbstractTopLevel(Is<A, core::TopLevel>, String), // AST
}

pub enum Fail {
    UnboundModule(String),
    UnboundTopLevel(String),
}

impl<A: std::hash::Hash> std::hash::Hash for Query<A> {
    fn hash<H: std::hash::Hasher>(&self, state: &mut H) {
        std::mem::discriminant(self).hash(state);
    }
}

impl<A: std::hash::Hash> Query<A> {
    pub fn rules(&self) -> Result<A, Fail> {
        match self {
            Query::Module(_, _) => todo!(),
            Query::TopLevel(_, _) => todo!(),
            Query::AbstractModule(_, _) => todo!(),
            Query::AbstractTopLevel(_, _) => todo!(),
            Query::SourceDirectories(_, _) => todo!(),
            Query::Source(_, _) => todo!(),
            Query::Dependencies(_, _) => todo!(),
            Query::TransitiveDependencies(_, _) => todo!(),
        }
    }
}
