use std::collections::HashMap;
use std::path::PathBuf;
use std::sync::{Arc, RwLock};

use kind_report::{Chars, RenderConfig};

pub struct SessionData {
    pub loaded_paths: RwLock<HashMap<PathBuf, usize>>,
    pub loaded_files: RwLock<Vec<(PathBuf, String)>>,
    pub render_config: RenderConfig<'static>,
    pub root: PathBuf,
}

impl SessionData {
    pub fn add_file(&self, path: PathBuf, code: String) -> usize {
        let mut files = self.loaded_files.write().unwrap();
        let mut paths = self.loaded_paths.write().unwrap();
        paths.insert(path.clone(), files.len());
        files.push((path, code));
        files.len() - 1
    }

    pub fn new(root: PathBuf) -> SessionData {
        SessionData {
            loaded_paths: RwLock::new(HashMap::new()),
            loaded_files: RwLock::new(Vec::new()),
            render_config: RenderConfig {
                indent: 2,
                chars: Chars::unicode(),
            },
            root,
        }
    }
}

pub type Session = Arc<SessionData>;
