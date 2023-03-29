use std::path::PathBuf;
use std::rc::Rc;

use refl::{refl, Id};
use thin_vec::ThinVec;

use kind_syntax::concrete;
use kind_syntax::core;

use crate::metadata::Source;

/// A query is a request for a rule.
#[derive(Debug, Clone, PartialEq, Eq, PartialOrd, Ord, Hash)]
pub enum Query<A> {
    SourceDirectories(Id<ThinVec<PathBuf>, A>, String), // File System
    Source(Id<Source, A>, PathBuf),                     // Text
    Dependencies(Id<ThinVec<PathBuf>, A>, PathBuf),     // Dependencies
    TransitiveDependencies(Id<ThinVec<PathBuf>, A>, PathBuf), // Dependencies

    Module(Id<Rc<concrete::Module>, A>, PathBuf), // CST
    TopLevel(Id<Rc<concrete::TopLevel>, A>, String), // CST
    AbstractModule(Id<Rc<core::Module>, A>, PathBuf), // AST
    AbstractTopLevel(Id<Rc<core::TopLevel>, A>, String), // AST
}

#[derive(Debug)]
pub enum Fail {
    UnboundModule(String),
    UnboundTopLevel(String),
}

impl Query<()> {
    pub fn source_directories(path: String) -> Query<ThinVec<PathBuf>> {
        Query::SourceDirectories(refl(), path)
    }

    pub fn source(path: PathBuf) -> Query<Source> {
        Query::Source(refl(), path)
    }

    pub fn dependencies(path: PathBuf) -> Query<ThinVec<PathBuf>> {
        Query::Dependencies(refl(), path)
    }

    pub fn transitive_dependencies(path: PathBuf) -> Query<ThinVec<PathBuf>> {
        Query::TransitiveDependencies(refl(), path)
    }

    pub fn module(path: PathBuf) -> Query<Rc<concrete::Module>> {
        Query::Module(refl(), path)
    }

    pub fn top_level(name: String) -> Query<Rc<concrete::TopLevel>> {
        Query::TopLevel(refl(), name)
    }

    pub fn abstract_module(path: PathBuf) -> Query<Rc<core::Module>> {
        Query::AbstractModule(refl(), path)
    }

    pub fn abstract_top_level(name: String) -> Query<Rc<core::TopLevel>> {
        Query::AbstractTopLevel(refl(), name)
    }
}
