use std::fs;
use std::path::{Path, PathBuf};

use kind_driver::session::Session;
use kind_tree::concrete::Module;
use kind_tree::symbol::QualifiedIdent;

use super::Fetcher;

/// A git-based downloader.
/// Creates a connection and downloads repo on creation.
/// Uses a single shared repo for all instances of kind-project,
/// so we lock it during use so that we don't have any conflicts.
pub struct GitFetcher<'a> {
    session: &'a Session,
    src_path: PathBuf,
    store_path: PathBuf,
    remote_url: String,
    remote_name: String,
    version: String,
    repo: git2::Repository,
}

impl GitFetcher<'_> {
    fn fetch(&mut self) -> anyhow::Result<()> {
        // Get/Add remote
        let mut remote = match self.repo.find_remote(&self.remote_name) {
            Ok(remote) => remote,
            // TODO: Check that this is only repo not found
            Err(_) => {
                // Remote was not found, add it to the config
                self.repo.remote(&self.remote_name, &self.remote_url)?
            }
        };

        // Fetch branches and tags
        let mut fetch_opts = git2::FetchOptions::new();
        fetch_opts.prune(git2::FetchPrune::On);
        remote.fetch::<String>(
            &[
                format!("+refs/heads/*:refs/remotes/{}/*", self.remote_name),
                format!("+refs/tags/*:refs/rtags/{}/*", self.remote_name),
            ],
            Some(&mut fetch_opts),
            None,
        )?;
        Ok(())
    }

    fn checkout(&mut self) -> anyhow::Result<()> {
        let refname = format!("/refs/rtags/{}/{}", self.remote_name, self.version);
        self.repo.set_head(&refname)?;
        let mut checkout_opts = git2::build::CheckoutBuilder::new();
        checkout_opts.force();
        self.repo.checkout_head(Some(&mut checkout_opts))?;
        Ok(())
    }
}

impl<'a> Fetcher<'a> for GitFetcher<'a> {
    fn new(
        session: &'a Session,
        src_path: PathBuf,
        store_path: PathBuf,
        remote_url: String,
        version: String,
    ) -> anyhow::Result<Box<Self>> {
        // TODO: Add some kind of lock before using the repo

        let repo = open_repo(&store_path)?;
        let mut dl = Self {
            session,
            src_path,
            store_path,
            remote_name: get_remote_name(&remote_url),
            remote_url,
            version,
            repo,
        };

        // Fetch and Checkout the requested remote/version
        // TODO: Implement an actual async downloader with progress report
        // TODO: Use shallow/sparse cloning, downloading files only when needed
        dl.fetch()?;
        dl.checkout()?;

        Ok(dl.into())
    }

    fn fetch_files(&self, files: &[&Path]) -> anyhow::Result<()> {
        for file in files {
            let src = self.store_path.join(file);
            let dst = self.src_path.join(file);
            fs::copy(src, dst)?;
        }
        Ok(())
    }

    fn fetch_top_level(&self, ident: &QualifiedIdent) -> anyhow::Result<Module> {
        todo!()
    }
}

impl Drop for GitFetcher<'_> {
    fn drop(&mut self) {
        // Release the git repo at the end of the lifetime
        // TODO: release a lock here
    }
}

fn get_remote_name(remote_url: &str) -> String {
    hex::encode(remote_url)
}

fn open_repo(store_path: &Path) -> anyhow::Result<git2::Repository> {
    let repo = match git2::Repository::open(store_path) {
        Ok(repo) => repo,
        Err(_) => git2::Repository::init(store_path)?,
    };
    Ok(repo)
}
