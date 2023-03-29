use std::cell::RefCell;
use std::hash::Hash;
use std::rc::Rc;

use fxhash::FxHashMap;
use intmap::IntMap;
use petgraph::{stable_graph::NodeIndex, Directed, Graph};

use crate::metadata::Storage;

#[derive(Default)]
pub struct DependencyTree<K> {
    pub storage: IntMap<Rc<RefCell<Option<Storage>>>>,
    pub names: FxHashMap<K, (NodeIndex, usize)>,
    pub graph: Graph<usize, (), Directed>,
}

impl<K: Hash + PartialEq + Eq> DependencyTree<K> {
    pub fn connect(&mut self, parent: NodeIndex, child: NodeIndex) {
        self.graph.add_edge(parent, child, ());
    }
}
