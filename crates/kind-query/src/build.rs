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

pub trait Loader<FileIO> {}

pub struct Compiler<Telemetry, Loader> {
    pub config: Options,
    pub loader: Loader,
    pub telemetry: Telemetry,
}
