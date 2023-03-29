use std::path::PathBuf;
use std::sync::Arc;

pub trait FileLoader {
    fn load_file(&self, path: PathBuf) -> Option<Arc<String>>;
}

#[derive(Default)]
pub struct FsFileLoader;

impl FileLoader for FsFileLoader {
    fn load_file(&self, path: PathBuf) -> Option<Arc<String>> {
        let contents = std::fs::read_to_string(path).ok()?;

        Some(Arc::new(contents))
    }
}
