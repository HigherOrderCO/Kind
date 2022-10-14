use std::{
    collections::HashSet,
    sync::{Arc, RwLock},
};

use dashmap::DashMap;

#[derive(Default, Debug)]
pub struct Edge {
    pub children: HashSet<u64>,
    pub parents: HashSet<u64>,
    pub updated: bool,
    pub database: u8,
}

#[derive(Default, Clone, Debug)]
pub struct DepGraph {
    pub edges: Arc<DashMap<u64, Arc<RwLock<Edge>>>>,
}

impl DepGraph {
    pub fn add(&mut self, parent: u64, child: u64, db: u8) -> Arc<RwLock<Edge>> {
        let edges = self.edges.clone();
        // I'm not sure on how DashMap drops the Shard guard
        // so it forces some drop I think.
        {
            if parent != child {
                let entry_arc = edges.entry(parent).or_default();
                let mut entry = entry_arc.write().unwrap();
                entry.children.insert(child);
                entry.database = db;
            }
        }
        {
            let entry_arc = edges.entry(child).or_default();
            let mut entry = entry_arc.write().unwrap();
            if parent != child {
                entry.parents.insert(parent);
            }
            entry_arc.clone()
        }
    }

    pub fn add_single(&self, child: u64, db: u8) -> Arc<RwLock<Edge>> {
        let edges = self.edges.clone();
        let entry_c = edges.entry(child).or_default();
        let mut entry = entry_c.write().unwrap();
        entry.database = db;
        entry_c.clone()
    }

    pub fn updated(&self, node_id: u64) -> bool {
        if let Some(res) = self.edges.get(&node_id) {
            let entry = res.read().unwrap();
            entry.updated
        } else {
            false
        }
    }

    pub fn remove_direct_child(&self, node_id: u64) -> HashSet<u64> {
        let edges = self.edges.clone();
        let mut children = HashSet::new();
        edges.entry(node_id).and_modify(|node| {
            let mut node = node.write().unwrap();
            children = node.children.clone();
            node.children = HashSet::new();
        });
        for child_id in &children {
            edges.entry(*child_id).and_modify(|child| {
                let mut child = child.write().unwrap();
                child.parents.remove(&node_id);
            });
        }
        children
    }

    pub fn remove(&self, node_id: u64, dangling: bool) -> Vec<u64> {
        let mut to_delete = Vec::new();
        {
            let edges = self.edges.clone();
            let mut children = HashSet::new();
            let mut parents = HashSet::new();

            edges.entry(node_id).and_modify(|node| {
                let node = node.read().unwrap();
                children = node.children.clone();
                parents = node.parents.clone();
            });

            if dangling && !parents.is_empty() {
                return vec![];
            }

            for parent_id in parents {
                edges.entry(parent_id).and_modify(|parent| {
                    let mut parent = parent.write().unwrap();
                    parent.updated = true;
                    parent.children.remove(&node_id);
                });
            }

            for child_id in children {
                edges.entry(child_id).and_modify(|child| {
                    let mut child = child.write().unwrap();
                    child.parents.remove(&node_id);
                    if child.parents.is_empty() {
                        to_delete.push(child_id);
                    }
                });
            }
            edges.remove(&node_id);
        }
        to_delete
    }
}
