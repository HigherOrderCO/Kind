use std::hash::Hash;

use fxhash::FxHashMap;
use intmap::IntMap;
use petgraph::{stable_graph::NodeIndex, Directed, Graph};

use crate::metadata::Metadata;

#[derive(Default)]
pub struct DependencyTree<K> {
    pub storage: IntMap<Metadata>,
    pub names: FxHashMap<K, (NodeIndex, usize)>,
    pub graph: Graph<usize, (), Directed>,
}

impl<K: Hash + PartialEq + Eq> DependencyTree<K> {
    pub fn connect(&mut self, parent: NodeIndex, child: NodeIndex) {
        self.graph.add_edge(parent, child, ());
    }
}
