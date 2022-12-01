use fxhash::{FxHashSet, FxHashMap};

#[derive(Debug)]
pub struct Node<T> {
    pub children: FxHashSet<usize>,
    pub parents: FxHashSet<usize>,
    pub data: T,
    pub invalidated: bool,
    pub hash: u64,
    pub root: bool,
    pub failed: bool,
}

#[derive(Debug)]
pub struct Graph<T> {
    nodes: FxHashMap<usize, Node<T>>,
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

    pub fn disconnect(&mut self, child: usize, parent: usize) -> bool {
        if let Some(parent) = self.nodes.get_mut(&parent) {
            parent.children.remove(&child);
        }
        if let Some(child) = self.nodes.get_mut(&child) {
            child.parents.remove(&parent);
            child.parents.len() == 0
        } else {
            false
        }
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
