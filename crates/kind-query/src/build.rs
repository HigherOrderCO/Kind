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
    pub tree: DependencyTree<String>,
    pub telemetry: T,
}

impl Telemetry for () {
    fn compiling(&mut self, _str: String) {}
}
