//! This module is a generalization of the driver
//! module. It is useful both for LSPs, Watch, Repl
//! and many other things.

use std::path::PathBuf;

use fxhash::FxHashMap;
use graph::Graph;
mod graph;

use kind_report::data::Diagnostic;
use kind_tree::concrete;

pub struct Resource<T> {
    path: PathBuf,

    concrete_tree: concrete::Module,
    /// Accumulated diagnostics while
    diagnostics: Vec<Box<dyn Diagnostic>>,
    /// Useful for LSP URIs
    ext: T,
}

#[derive(Default)]
pub struct Session<T> {
    /// Stores
    graph: Graph<usize>,
    /// Useful for removing and adding resources
    resources: FxHashMap<usize, Resource<T>>,
}

impl<T> Session<T> {
    pub fn check() {}
}
