pub mod graph;
pub mod query;
pub mod session;
pub mod store;

use std::sync::Arc;

use kind_macros::make_provider;
use rayon::prelude::{IntoParallelRefIterator, ParallelIterator};
use crate::store::Session;

#[make_provider]
pub trait Teste {
    #[input_node]
    fn fib(&self, kek: u64) -> Box<u64>;
}

pub fn teste() {
    let provider = TesteProvider {
        fib: |db, c| {
            if c > 10 {
                println!("Computing {}", c);
                let t = (1..10).collect::<Vec<u64>>().par_iter().map(|x| *db.fib(c-x)).sum();
                println!("Finalized {}", c);
                Box::new(t)
            } else {
                Box::new(c)
            }
        },
    };
    let db = TesteDatabase::new(Arc::new(provider));
    println!("Res {}", db.fib(15));
    println!("Res {}", db.fib(2));
    println!("Res {}", db.fib(1));
    println!("Res {}", db.fib(0));
    db.delete(1);
    println!("Res {}", db.fib(2));
    println!("Res {}", db.fib(1));
    println!("Res {}", db.fib(0));
}
