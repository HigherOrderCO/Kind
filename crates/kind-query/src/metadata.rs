use std::ops::{Deref, DerefMut};
use std::rc::Rc;

use kind_syntax::concrete;
use kind_syntax::core;

#[derive(Clone, Debug, Hash)]
pub struct Source(pub Rc<String>);

#[derive(Default)]
pub struct Metadata(pub Vec<Storage>);

pub enum Storage {
    Source(Source),
    Module(Rc<concrete::Module>),
    TopLevel(Rc<concrete::TopLevel>),
    AbstractModule(Rc<core::Module>),
    AbstractTopLevel(Rc<core::TopLevel>),
}

pub trait IntoStorage {
    fn into_storage(self) -> Storage;
}

impl IntoStorage for Source {
    fn into_storage(self) -> Storage {
        Storage::Source(self)
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
