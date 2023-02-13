use fxhash::FxHashMap;
use petgraph::{stable_graph::NodeIndex, Directed, Graph};
use std::hash::Hash;

#[derive(Default)]
pub struct DependencyTree<Name, Data> {
    loaded_modules: Vec<Data>,
    loaded_names: FxHashMap<Name, (NodeIndex, usize)>,
    graph: Graph<usize, (), Directed>,
}

impl<Name: Hash + PartialEq + Eq, Data> DependencyTree<Name, Data> {
    pub fn add(&mut self, name: Name, data: Data) -> NodeIndex {
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
