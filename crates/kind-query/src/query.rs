use std::cell::RefCell;
use std::mem::transmute;
use std::path::PathBuf;
use std::rc::Rc;

use intmap::Entry;
use refl::Id;
use thin_vec::ThinVec;

use kind_syntax::concrete;
use kind_syntax::core;

use crate::build::{Compiler, Telemetry};
use crate::metadata::{IntoStorage, Source, Storage};

/// A query is a request for a rule.
#[derive(Debug, Clone, PartialEq, Eq, PartialOrd, Ord, Hash)]
pub enum Query<A> {
    SourceDirectories(Id<ThinVec<PathBuf>, A>, String), // File System
    Source(Id<Source, A>, PathBuf),                     // Text
    Dependencies(Id<ThinVec<PathBuf>, A>, PathBuf),     // Dependencies
    TransitiveDependencies(Id<ThinVec<PathBuf>, A>, PathBuf), // Dependencies

    Module(Id<Rc<concrete::Module>, A>, PathBuf), // CST
    TopLevel(Id<Rc<concrete::TopLevel>, A>, String), // CST
    AbstractModule(Id<Rc<core::Module>, A>, String), // AST
    AbstractTopLevel(Id<Rc<core::TopLevel>, A>, String), // AST
}

#[derive(Debug)]
pub enum Fail {
    UnboundModule(String),
    UnboundTopLevel(String),
}

impl<T: Telemetry> Compiler<T> {
    pub fn query<A>(&mut self, query: Query<A>) -> Result<A, Fail>
    where
        T: Telemetry,
        A: std::hash::Hash,
        A: Clone,
        A: IntoStorage,
    {
        let storage = self.get_metadata(fxhash::hash64(&query));
        if let Some(storage) = storage.borrow().as_ref() {
            return Ok(storage.clone().extract());
        }

        match query {
            Query::Module(_, _) => todo!(),
            Query::TopLevel(_, _) => todo!(),
            Query::AbstractModule(_, _) => todo!(),
            Query::AbstractTopLevel(_, _) => todo!(),
            Query::SourceDirectories(_, _) => todo!(),
            Query::Source(refl, ref path) => {
                let content = std::fs::read_to_string(path)
                    .map_err(|_| Fail::UnboundModule(path.to_string_lossy().to_string()))?;

                let source = Source(content.into());

                storage
                    .borrow_mut()
                    .replace(Storage::Source(refl, source.clone()));

                Ok(refl.cast(source))
            }
            Query::Dependencies(_, _) => todo!(),
            Query::TransitiveDependencies(_, _) => todo!(),
        }
    }

    fn get_metadata<A>(&mut self, hash: u64) -> &Rc<RefCell<Option<Storage<A>>>>
    where
        A: std::hash::Hash,
        A: IntoStorage,
    {
        match self.tree.storage.entry(hash) {
            Entry::Occupied(entry) => unsafe { transmute(entry.get()) },
            Entry::Vacant(entry) => unsafe { transmute(entry.insert(Rc::new(RefCell::new(None)))) },
        }
    }
}

#[cfg(test)]
mod tests {
    use refl::refl;

    use crate::build::{Options, Target};

    use super::*;

    #[test]
    fn it_works() {
        let mut compiler = Compiler {
            telemetry: (),
            tree: Default::default(),
            config: Options {
                target: Some(Target::HVM),
            },
        };

        compiler
            .query(Query::Source(refl(), PathBuf::from("Cargo.toml")))
            .unwrap();

        compiler
            .query(Query::Source(refl(), PathBuf::from("Cargo.toml")))
            .unwrap();

        compiler
            .query(Query::Source(refl(), PathBuf::from("Cargo.toml")))
            .unwrap();
    }
}
