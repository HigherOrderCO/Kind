use std::sync::{Arc, RwLock};

use crate::core::graph::{DepGraph, Edge};

pub trait Session: Clone {
    fn delete_from_cache(&self, node_id: u64, db_idx: u8);

    fn dependency_graph(&self) -> DepGraph;

    fn get_parent(&self) -> Option<u64>;

    fn set_parent(&mut self, hash: u64);

    fn delete(&self, node_id: u64) {
        let graph = self.dependency_graph();
        let edge = graph.edges.get(&node_id).map(|arc| arc.read().unwrap().database);
        if let Some(db_idx) = edge {
            let other_ones = graph.remove(node_id, false);
            self.delete_from_cache(node_id, db_idx);
            for other in other_ones {
                self.delete(other);
            }
        }
    }

    fn create_edge(&self, child_hash: u64, db_idx: u8) -> Arc<RwLock<Edge>> {
        let mut graph = self.dependency_graph();
        if let Some(parent) = self.get_parent() {
            graph.add(parent, child_hash, db_idx)
        } else {
            graph.add_single(child_hash, db_idx)
        }
    }

    fn get_or_create_node(&self, child_hash: u64, db_idx: u8) -> Arc<RwLock<Edge>> {
        let graph = self.dependency_graph();
        let res = graph.edges.get(&child_hash);
        if let Some(edge) = res {
            edge.clone()
        } else {
            graph.add_single(child_hash, db_idx)
        }
    }

    fn run_query_memoized<T: Clone>(&self, child_hash: u64, db: std::sync::Arc<dashmap::DashMap<u64, T>>, db_idx: u8, fun: impl FnOnce(&Self) -> T) -> (T, bool) {
        let graph = self.dependency_graph();

        self.create_edge(child_hash, db_idx);

        if let Some(res) = db.get(&child_hash).map(|x| x.clone()) {
            if !graph.updated(child_hash) {
                return (res.clone(), true);
            }
        }

        let mut ctx = self.clone();
        ctx.set_parent(child_hash);
        let res = fun(&ctx);
        db.insert(child_hash, res.clone());

        (res, false)
    }

    fn run_query_flat<T>(&self, child_hash: u64, fun: impl FnOnce(&Self) -> T) -> T
    where
        T: Clone,
    {
        // TODO: DbIDX sohudl be NONE           \/
        let edge = self.create_edge(child_hash, 255);
        let children = self.dependency_graph().remove_direct_child(child_hash);

        let mut ctx = self.clone();
        ctx.set_parent(child_hash);
        let res = fun(&ctx);

        let new_children = edge.read().unwrap().children.clone();

        let diff = children.difference(&new_children);

        for diff_hash in diff {
            self.delete(*diff_hash);
        }

        res
    }
}
