use std::collections::HashMap;

use fxhash::FxHashSet;

struct Node<T> {
    data: T,
    invalidated: bool,
    children: FxHashSet<usize>,
    parents: FxHashSet<usize>,
}

#[derive(Default)]
pub struct Graph<T> {
    // Using a hashmap to make it easier to add or remove node.s
    nodes: HashMap<usize, Node<T>>,
    count: usize,
}

impl<T> Graph<T> {
    pub fn add(&mut self, data: T, parent: usize) {
        self.nodes.insert(
            self.count,
            Node {
                data,
                invalidated: false,
                children: FxHashSet::default(),
                parents: FxHashSet::from_iter(vec![parent]),
            },
        );
        self.count += 1;
    }

    pub fn remove(&mut self, node_idx: usize) {
        if let Some(node) = self.nodes.get(&node_idx) {
            let children = node.children.clone();
            let parents = node.parents.clone();

            for child in children {
                if let Some(child) = self.nodes.get_mut(&child) {
                    child.parents.remove(&node_idx);
                }
            }

            for parent in parents {
                if let Some(parent) = self.nodes.get_mut(&parent) {
                    parent.children.remove(&node_idx);
                }
                self.flood_invalidation(parent);
            }
        }
    }

    fn flood_invalidation(&mut self, node: usize) {
        if let Some(node) = self.nodes.get_mut(&node) {
            if node.invalidated {
                node.invalidated = true;
                for parent in node.parents.clone() {
                    self.flood_invalidation(parent)
                }
            }
        }
    }
}
