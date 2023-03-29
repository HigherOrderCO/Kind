use intmap::IntMap;
use petgraph::{stable_graph::NodeIndex, Directed, Graph};
use specs::{Entity, World};

#[derive(Default)]
pub struct DependencyTree {
    pub world: World,
    pub cache: IntMap<Entity>,
    pub graph: Graph<usize, (), Directed>,
}

impl DependencyTree {
    pub fn connect(&mut self, parent: NodeIndex, child: NodeIndex) {
        self.graph.add_edge(parent, child, ());
    }
}
