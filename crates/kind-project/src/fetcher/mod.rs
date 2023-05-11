mod git;

use std::error::Error;
use std::fmt;
use std::path::{PathBuf, Path};

pub use git::GitFetcher;

pub trait Fetcher {
    // TODO: These should return a FetchError instead
    fn new(
        src_path: PathBuf,
        store_path: PathBuf,
        remote_url: String,
        version: String,
    ) -> anyhow::Result<Box<Self>>;

    fn fetch_files(&self, files: &[&Path]) -> anyhow::Result<()>;
}

#[derive(Debug)]
pub enum FetchError {
    RemoteNotFound(String),
    VersionNotFound(String),
    InvalidStore(PathBuf),
}

impl fmt::Display for FetchError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match self {
            FetchError::RemoteNotFound(remote) => write!(f, "Remote '{}' not found", remote),
            FetchError::VersionNotFound(version) => write!(f, "Version '{}' not found", version),
            FetchError::InvalidStore(store) => write!(f, "'{}' is not a valid store path", store.display()),
        }
    }
}

impl Error for FetchError {}
