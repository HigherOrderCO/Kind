use specs::{Builder, System, World, WorldExt};

use crate::dependency::DependencyTree;

pub enum Target {
    HVM,
    KDL,
}

pub struct Options {
    pub target: Option<Target>,
}

pub trait Telemetry {
    fn compiling(&mut self, str: String);
}

pub struct Compiler<T: Telemetry> {
    pub config: Options,
    pub tree: DependencyTree,
    pub telemetry: T,
}

impl<'a, T: Telemetry> System<'a> for Compiler<T> {
    type SystemData = ();

    fn run(&mut self, data: Self::SystemData) {
    }
}
