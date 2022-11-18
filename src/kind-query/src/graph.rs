use fxhash::{FxHashSet, FxHashMap};

#[derive(Debug)]
pub struct Node<T> {
    pub data: T,
    pub invalidated: bool,
    pub hash: u64,
    pub children: FxHashSet<usize>,
    pub parents: FxHashSet<usize>,
    pub root: bool,
    pub failed: bool,
}

#[derive(Debug)]
pub struct Graph<T> {
    // Using a hashmap to make it easier to add or remove node.s
    pub nodes: FxHashMap<usize, Node<T>>,
    count: usize,
}

impl<T> Default for Graph<T> {
    fn default() -> Self {
        Self { nodes: Default::default(), count: Default::default() }
    }
}

impl<T> Graph<T> {
    pub fn get(&self, id: &usize) -> Option<&Node<T>> {
        self.nodes.get(id)
    }

    pub fn get_mut(&mut self, id: &usize) -> Option<&mut Node<T>> {
        self.nodes.get_mut(id)
    }

    pub fn add(&mut self, data: T, hash: u64, root: bool) {
        self.nodes.insert(
            self.count,
            Node {
                data,
                invalidated: false,
                children: FxHashSet::default(),
                parents: FxHashSet::default(),
                hash,
                failed: false,
                root
            },
        );
        self.count += 1;
    }

    pub fn connect(&mut self, parent: usize, child: usize) {
        if let Some(parent) = self.nodes.get_mut(&parent) {
            parent.children.insert(child);
        }
        if let Some(child) = self.nodes.get_mut(&child) {
            child.parents.insert(parent);
        }
    }

    fn remove_recursive(&mut self, node_idx: usize, to_delete: &mut FxHashSet<usize>) {
        if let Some(node) = self.nodes.remove(&node_idx) {
            let children = node.children.clone();
            let parents = node.parents.clone();

            for child_idx in children {
                if let Some(child) = self.nodes.get_mut(&child_idx) {
                    child.parents.remove(&node_idx);
                    if child.parents.is_empty() && !child.root {
                        to_delete.insert(child_idx);
                        self.remove_recursive(child_idx, to_delete)
                    }
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

    pub fn remove(&mut self, node_idx: usize) -> FxHashSet<usize> {
        let mut fx = Default::default();
        self.remove_recursive(node_idx, &mut fx);
        fx
    }

    pub fn flood_invalidation(&mut self, node: usize) {
        if let Some(node) = self.nodes.get_mut(&node) {
            if !node.invalidated {
                node.invalidated = true;
                for parent in node.parents.clone() {
                    self.flood_invalidation(parent)
                }
            }
        }
    }
}
