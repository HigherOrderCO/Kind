use std::cell::RefCell;
use std::ops::{Deref, DerefMut};
use std::rc::Rc;
use std::sync::Arc;

use intmap::Entry;
use refl::{refl, Id};

use kind_syntax::concrete;
use kind_syntax::core;

use crate::build::{Compiler, Telemetry};
use crate::loader::FileLoader;

#[derive(Clone, Debug, Hash)]
pub struct Source(pub Arc<String>);

#[derive(Default)]
pub struct Metadata(pub Vec<Storage>);

#[derive(Clone)]
pub enum Storage<A = Box<()>> {
    Source(Id<Source, A>, Source),
    Module(Id<Rc<concrete::Module>, A>, Rc<concrete::Module>),
    TopLevel(Id<Rc<concrete::TopLevel>, A>, Rc<concrete::TopLevel>),
    AbstractModule(Id<Rc<core::Module>, A>, Rc<core::Module>),
    AbstractTopLevel(Id<Rc<core::TopLevel>, A>, Rc<core::TopLevel>),
}

impl<A> Storage<A> {
    pub fn extract(self) -> A {
        match self {
            Storage::Source(refl, value) => refl.cast(value),
            Storage::Module(refl, value) => refl.cast(value),
            Storage::TopLevel(refl, value) => refl.cast(value),
            Storage::AbstractModule(refl, value) => refl.cast(value),
            Storage::AbstractTopLevel(refl, value) => refl.cast(value),
        }
    }
}

pub trait IntoStorage {
    fn into_storage(self) -> Storage;
}

impl IntoStorage for Source {
    fn into_storage(self) -> Storage {
        Storage::Source(existential(), self)
    }
}

impl Metadata {
    pub fn with<A: IntoStorage + Clone>(&mut self, value: A) -> A {
        self.push(value.clone().into_storage());
        value
    }
}

impl Deref for Metadata {
    type Target = Vec<Storage>;

    fn deref(&self) -> &Self::Target {
        &self.0
    }
}

impl DerefMut for Metadata {
    fn deref_mut(&mut self) -> &mut Self::Target {
        &mut self.0
    }
}

impl<F: FileLoader, T: Telemetry> Compiler<F, T> {
    pub fn get_metadata<A>(&mut self, hash: u64) -> Rc<RefCell<Option<Storage<A>>>>
    where
        A: std::hash::Hash,
        A: IntoStorage,
    {
        match self.tree.storage.entry(hash) {
            Entry::Occupied(entry) => unsafe { std::mem::transmute(entry.get().clone()) },
            Entry::Vacant(entry) => unsafe {
                std::mem::transmute(entry.insert(Rc::new(RefCell::new(None))).clone())
            },
        }
    }
}

fn existential<A, B>() -> Id<A, B> {
    unsafe { std::mem::transmute(refl::<A>()) }
}
