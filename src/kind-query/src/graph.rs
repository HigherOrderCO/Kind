use std::{collections::HashSet, sync::{Arc, Condvar, Mutex}};

use dashmap::DashMap;

#[derive(Default, Debug)]
pub struct Edge {
    pub children: HashSet<u64>,
    pub parents: HashSet<u64>,
    pub hash: u64,
    pub updated: bool,
    pub database: u8,
    pub computing: Mutex<()>
}

#[derive(Default, Clone, Debug)]
pub struct DepGraph {
    pub edges: Arc<DashMap<u64, Edge>>,
}

impl DepGraph {
    pub fn add(&mut self, parent: u64, child: u64, db: u8) {
        let edges = self.edges.clone();
        {
            let mut entry = edges.entry(parent).or_default();
            entry.children.insert(child);
            entry.database = db;
        }
        {
            let mut entry = edges.entry(child).or_default();
            entry.parents.insert(parent);
        }
    }

    pub fn add_single(&mut self, child: u64, db: u8) {
        let edges = self.edges.clone();
        let mut entry = edges.entry(child).or_default();
        entry.database = db;
    }

    pub fn updated(&self, node_id:u64) -> bool {
        if let Some(res) = self.edges.get(&node_id) {
            res.updated
        } else {
            false
        }
    }

    pub fn remove(&mut self, node_id: u64, dangling: bool) -> Vec<u64> {
        let mut to_delete = Vec::new();
        {
            let edges = self.edges.clone();
            let mut children = HashSet::new();
            let mut parents = HashSet::new();

            edges.entry(node_id).and_modify(|node| {
                children = node.children.clone();
                parents = node.parents.clone();
            });

            if dangling && parents.len() != 0 {
                return vec![];
            }

            for parent_id in parents {
                edges.entry(parent_id).and_modify(|parent| {
                    parent.updated = true;
                    parent.children.remove(&node_id);
                });
            }

            for child_id in children {
                edges.entry(child_id).and_modify(|child| {
                    child.parents.remove(&node_id);
                    if child.parents.len() == 0 {
                        to_delete.push(child_id);
                    }
                });
            }
            edges.remove(&node_id);
        }
        to_delete
    }

    pub fn set_hash(&mut self, node_id: u64, hash: u64) {
        let edges = self.edges.clone();
        edges.entry(node_id).and_modify(|node| {
            if node.hash != hash {
                node.hash = hash;
                node.updated = true;
            }
        });
    }
}
