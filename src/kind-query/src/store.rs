use std::sync::Arc;

use crate::graph::DepGraph;

pub trait Session : Clone {
    fn delete_from_cache(&self, node_id: u64, db_idx: u8);

    fn dependency_graph(&self) -> DepGraph;

    fn get_parent(&self) -> Option<u64>;

    fn set_parent(&mut self, hash: u64);

    fn delete(&self, node_id: u64) {
        let edge = {self.dependency_graph().edges.get(&node_id).map(|x| x.database)};
        if let Some(db_idx) = edge {
            let other_ones = self.dependency_graph().remove(node_id, false);
            self.delete_from_cache(node_id, db_idx);
            for other in other_ones {
                self.delete(other);
            }
        }
    }

    fn run_query<T: Clone>(&self, child_hash: u64, db: std::sync::Arc<dashmap::DashMap<u64,T >>, db_idx: u8, fun: impl FnOnce(&Self) -> T) -> T {
        let mut graph = self.dependency_graph();
        if let Some(parent) = self.get_parent() {
            graph.add(
                parent,
                child_hash,
                db_idx
            );
        } else {
            graph.add_single(
                child_hash,
                db_idx
            );
        }
        let m = {
            let res = graph.edges.get(&child_hash).unwrap();
            res.computing.lock().unwrap()
        };
        let result = db.get(&child_hash).map(|x| x.clone());
        if let Some(res) = result {
            if graph.updated(child_hash) {
                let mut ctx = self.clone();
                ctx.set_parent(child_hash);
                let res = fun(&ctx);
                db.insert(child_hash, res.clone());
                res
            } else {
                res.clone()
            }
        } else {
            let mut ctx = self.clone();
            ctx.set_parent(child_hash);
            let res = fun(&ctx);
            db.insert(child_hash, res.clone());
            res
        }
    }

}