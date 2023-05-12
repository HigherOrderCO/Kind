mod git;

pub use git::GitFetcher;
use kind_driver::session::Session;

use std::error::Error;
use std::fmt;
use std::path::{Path, PathBuf};

use kind_tree::concrete::Module;
use kind_tree::symbol::QualifiedIdent;

pub trait Fetcher<'a> {
    // TODO: These should return a FetchError instead
    fn new(
        session: &'a Session,
        src_path: PathBuf,
        store_path: PathBuf,
        remote_url: String,
        version: String,
    ) -> anyhow::Result<Box<Self>>;

    /// Copies the requested files from the remote to the local
    fn fetch_files(&self, files: &[&Path]) -> anyhow::Result<()>;

    /// Copies the file containing the top level to the local and return the parsed Module.
    fn fetch_top_level(&self, ident: &QualifiedIdent) -> anyhow::Result<Module>;
}

#[derive(Debug)]
pub enum FetchError {
    IdentNotFound(String),
    RemoteNotFound(String),
    VersionNotFound(String),
    InvalidStore(PathBuf),
}

impl fmt::Display for FetchError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match self {
            FetchError::IdentNotFound(ident) => {
                write!(f, "Top level '{}' was not found on remote", ident)
            }
            FetchError::RemoteNotFound(remote) => write!(f, "Remote '{}' not found", remote),
            FetchError::VersionNotFound(version) => write!(f, "Version '{}' not found", version),
            FetchError::InvalidStore(store) => {
                write!(f, "'{}' is not a valid store path", store.display())
            }
        }
    }
}

impl Error for FetchError {}
