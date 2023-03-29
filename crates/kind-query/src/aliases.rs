use std::sync::Arc;
use specs::Component;
use specs::DenseVecStorage;

use kind_syntax::concrete;
use kind_syntax::core;

#[derive(Component, Clone)]
pub struct Source(pub Arc<String>);

#[derive(Component, Clone)]
pub struct ConcreteTopLevel(pub Arc<concrete::TopLevel>);

#[derive(Component, Clone)]
pub struct ConcreteModule(pub Arc<concrete::Module>);

#[derive(Component, Clone)]
pub struct AbstractModule(pub Arc<core::Module>);

#[derive(Component, Clone)]
pub struct AbstractTopLevel(pub Arc<core::TopLevel>);
