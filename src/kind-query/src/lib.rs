//! This module is a generalization of the driver
//! module. It is useful both for LSPs, Watch, Repl
//! and many other things.

mod graph;
mod names;
mod errors;

use std::path::PathBuf;

use fxhash::FxHashMap;
use graph::Graph;

use kind_report::data::Diagnostic;
use kind_tree::concrete;

pub struct Resource<T> {
    path: PathBuf,
    hash: usize,

    concrete_tree: concrete::Module,

    /// Useful for LSP URIs
    ext_info: T,
}

#[derive(Default)]
pub struct Session<T> {
    graph: Graph<usize>,
    paths: FxHashMap<String, usize>,
    resources: FxHashMap<usize, Resource<T>>,
}

impl<T> Session<T> {
    pub fn check(&mut self, path: PathBuf) {
        
    }
}
