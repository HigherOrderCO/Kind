use std::hash::Hash;

use fxhash::FxHashMap;
use petgraph::{stable_graph::NodeIndex, Directed, Graph};

use kind_syntax::concrete;
use kind_syntax::core;

#[derive(Default)]
pub struct DependencyTree<K> {
    loaded_modules: Vec<Storage>,
    loaded_names: FxHashMap<K, (NodeIndex, usize)>,
    graph: Graph<usize, (), Directed>,
}

#[derive(Default)]
pub struct Storage {
    pub module: Option<concrete::Module>,
    pub top_level: Option<concrete::TopLevel>,
    pub abstract_module: Option<core::Module>,
    pub abstract_top_level: Option<core::TopLevel>,
}

impl<K: Hash + PartialEq + Eq> DependencyTree<K> {
    pub fn add(&mut self, name: K, data: Storage) -> NodeIndex {
        let place = self.loaded_modules.len();
        let id = self.graph.add_node(place);

        self.loaded_modules.push(data);
        self.loaded_names.insert(name, (id, place));

        id
    }

    pub fn connect(&mut self, parent: NodeIndex, child: NodeIndex) {
        self.graph.add_edge(parent, child, ());
    }
}
