use crate::build::{Compiler, Telemetry};
use crate::loader::FileLoader;
use crate::metadata::{IntoStorage, Source, Storage};
use crate::query::{Fail, Query};

impl<F: FileLoader, T: Telemetry> Compiler<F, T> {
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
                let content = self
                    .loader
                    .load_file(path.clone())
                    .ok_or(Fail::UnboundModule(path.to_string_lossy().to_string()))?;

                let source = Source(content);

                storage
                    .borrow_mut()
                    .replace(Storage::Source(refl, source.clone()));

                Ok(refl.cast(source))
            }
            Query::Dependencies(_, _) => todo!(),
            Query::TransitiveDependencies(_, _) => todo!(),
        }
    }
}

#[cfg(test)]
mod tests {
    use crate::build::{Compiler, Options, Target};
    use crate::loader::FsFileLoader;
    use crate::query::Query;

    #[test]
    fn it_works() {
        let mut compiler = Compiler {
            telemetry: (),
            loader: FsFileLoader::default(),
            tree: Default::default(),
            config: Options {
                target: Some(Target::HVM),
            },
        };

        compiler.query(Query::source("Cargo.toml".into())).unwrap();
        compiler.query(Query::source("Cargo.toml".into())).unwrap();
        compiler.query(Query::source("Cargo.toml".into())).unwrap();
    }
}
