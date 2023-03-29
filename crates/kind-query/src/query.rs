use std::borrow::Cow;
use std::path::PathBuf;
use std::sync::Arc;

use refl::Id;
use specs::ReadStorage;
use specs::{Builder, WorldExt};
use thin_vec::ThinVec;

use crate::aliases::{AbstractModule, AbstractTopLevel, ConcreteModule, ConcreteTopLevel, Source};
use crate::build::{Compiler, Telemetry};

/// A query is a request for a rule.
#[derive(Debug, Clone, PartialEq, Eq, PartialOrd, Ord, Hash)]
pub enum Query<A> {
    SourceDirectories(Id<ThinVec<PathBuf>, A>, String), // File System
    Source(Id<Source, A>, PathBuf),                     // Text
    Dependencies(Id<ThinVec<PathBuf>, A>, PathBuf),     // Dependencies
    TransitiveDependencies(Id<ThinVec<PathBuf>, A>, PathBuf), // Dependencies

    Module(Id<ConcreteModule, A>, PathBuf),            // CST
    TopLevel(Id<ConcreteTopLevel, A>, String),         // CST
    AbstractModule(Id<AbstractModule, A>, String),     // AST
    AbstractTopLevel(Id<AbstractTopLevel, A>, String), // AST
}

pub enum Fail {
    UnboundModule(String),
    UnboundTopLevel(String),
}

impl<A: Clone + std::hash::Hash + specs::Component> Query<A> {
    pub fn run_query<T>(&self, compiler: &mut Compiler<T>) -> Result<A, Fail>
    where
        T: Telemetry,
    {
        if let Some(entity) = compiler.tree.cache.get(fxhash::hash64(&self)) {
            let storage = compiler.tree.world.read_storage::<A>();
            let value = storage.get(*entity).unwrap();

            return Ok(value.clone());
        }
        let mut entity = compiler.tree.world.create_entity();

        let value = match self {
            Query::Module(_, _) => todo!(),
            Query::TopLevel(_, _) => todo!(),
            Query::AbstractModule(_, _) => todo!(),
            Query::AbstractTopLevel(_, _) => todo!(),
            Query::SourceDirectories(_, _) => todo!(),
            Query::Source(refl, path) => {
                let content = std::fs::read_to_string(path)
                    .map_err(|_| Fail::UnboundModule(path.to_string_lossy().to_string()))?;

                let source = Source(Arc::new(content));
                entity = entity.with(source.clone());
                refl.cast(source)
            }
            Query::Dependencies(_, _) => todo!(),
            Query::TransitiveDependencies(_, _) => todo!(),
        };

        compiler.tree.cache.insert(fxhash::hash64(&self), entity.build());

        Ok(value)
    }
}
