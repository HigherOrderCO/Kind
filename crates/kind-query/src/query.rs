use std::path::PathBuf;

use refl::Id;
use thin_vec::ThinVec;

use kind_syntax::concrete;
use kind_syntax::core;

/// A query is a request for a rule.
#[derive(Debug, Clone, PartialEq, Eq, PartialOrd, Ord, Hash)]
pub enum Query<A> {
    SourceDirectories(Id<ThinVec<PathBuf>, A>, String), // File System
    Source(Id<String, A>, PathBuf),                     // Text
    Dependencies(Id<ThinVec<PathBuf>, A>, PathBuf),     // Dependencies
    TransitiveDependencies(Id<ThinVec<PathBuf>, A>, PathBuf), // Dependencies

    Module(Id<concrete::Module, A>, PathBuf),        // CST
    TopLevel(Id<concrete::TopLevel, A>, String),     // CST
    AbstractModule(Id<core::Module, A>, String),     // AST
    AbstractTopLevel(Id<core::TopLevel, A>, String), // AST
}

pub enum Fail {
    UnboundModule(String),
    UnboundTopLevel(String),
}

impl<A: std::hash::Hash> Query<A> {
    pub fn rules(&self) -> Result<A, Fail> {
        match self {
            Query::Module(_, _) => todo!(),
            Query::TopLevel(_, _) => todo!(),
            Query::AbstractModule(_, _) => todo!(),
            Query::AbstractTopLevel(_, _) => todo!(),
            Query::SourceDirectories(_, _) => todo!(),
            Query::Source(refl, path) => {
                let content = std::fs::read_to_string(path)
                    .map_err(|_| Fail::UnboundModule(path.to_string_lossy().to_string()))?;

                Ok(refl.cast(content))
            }
            Query::Dependencies(_, _) => todo!(),
            Query::TransitiveDependencies(_, _) => todo!(),
        }
    }
}
