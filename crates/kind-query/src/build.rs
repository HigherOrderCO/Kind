use crate::dependency::DependencyTree;
use crate::loader::FileLoader;

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

pub struct Compiler<F: FileLoader, T: Telemetry> {
    pub config: Options,
    pub tree: DependencyTree<String>,
    pub loader: F,
    pub telemetry: T,
}

impl Telemetry for () {
    fn compiling(&mut self, _str: String) {}
}
