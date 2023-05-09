pub mod error;
pub mod fetcher;

use fxhash::FxHashSet;
use kind_driver::session::Session;
use kind_pass::unbound::get_book_unbound;
use kind_tree::{concrete::Book, symbol::QualifiedIdent};

use anyhow::{anyhow, Context};
use directories::ProjectDirs;
use fetcher::{Fetcher, GitFetcher};
use serde::{Deserialize, Serialize};
use std::path::{Path, PathBuf};

pub const PROJECT_CONFIG_FILE_NAME: &'static str = "kind.toml";
pub const MAIN_FILE_NAME: &'static str = "Main.kind2";
pub const MAIN_TEMPLATE: &'static str = "
Main : Unit
Main = Unit.new
";

#[derive(Deserialize, Serialize)]
pub struct ProjectConfig {
    pub name: String,
    pub remote_url: String,
    pub remote_version: String,
}

/// Searches for a project config file in the current directory and all parents.
/// Returns Ok(Some(path)) if the file was found, with the path to it.
/// Returns Ok(None) if the file was not found.
/// Returns Err(err) if an error occurred while reading the filesystem.
pub fn search_project_config_file() -> anyhow::Result<Option<PathBuf>> {
    let mut path = PathBuf::from(Path::new(".")).canonicalize()?;
    loop {
        // TODO: We shouldn't expect to have read access to all parent dirs
        let files = path.read_dir().with_context(|| {
            format!(
                "Failed to read dir {:?} while searching for project config",
                path.display()
            )
        })?;
        for file in files {
            let file = file.with_context(|| {
                format!(
                    "Failed to read file in dir {:?} while searching for project config",
                    path.display()
                )
            })?;
            if file.file_name() == PROJECT_CONFIG_FILE_NAME {
                return Ok(Some(file.path()));
            }
        }

        if let Some(parent) = path.parent() {
            path = parent.into();
        } else {
            return Ok(None);
        }
    }
}

pub fn init_project(root: PathBuf, name: String) -> anyhow::Result<()> {
    let config_path = root.join(PROJECT_CONFIG_FILE_NAME);
    // Ok to create a project in the current directory
    create_project_config_file(config_path, name.clone())?;
    create_src_dir(root, name)?;
    Ok(())
}

fn create_project_config_file(config_path: PathBuf, name: String) -> anyhow::Result<()> {
    let config = ProjectConfig {
        name,
        // TODO: these should have an option to parametrized
        // TODO: Need to decide on a good way of fetching files and searching versions
        remote_url: "https://github.com/HigherOrderCO/Wikind.git".into(),
        // TODO: By default should fetch the latest version
        // TODO: Decide on a versioning scheme
        remote_version: "".into(),
    };
    let toml_config = toml::to_string(&config).unwrap();
    std::fs::write(&config_path, toml_config).with_context(|| {
        format!(
            "Failed to write project config file {}",
            config_path.display()
        )
    })
}

fn create_src_dir(root: PathBuf, name: String) -> anyhow::Result<()> {
    let src_dir = root.join(Path::new(&name));
    // Create the src directory with the name of the project
    std::fs::create_dir(&src_dir)
        .with_context(|| format!("Failed to create src directory {}", src_dir.display()))?;
    // Create a template Main file inside it
    let main_path = src_dir.join(Path::new(MAIN_FILE_NAME));
    std::fs::write(main_path, MAIN_TEMPLATE)
        .with_context(|| format!("Failed to write Main file"))?;
    Ok(())
}

fn make_git_fetcher(config: &ProjectConfig) -> anyhow::Result<GitFetcher> {
    let src_path = PathBuf::from(format!("./{}", config.name)).canonicalize()?;
    let dirs =
        ProjectDirs::from("com", "HigherOrderCO", "Kind").ok_or(anyhow!("Failed to find HOME"))?;
    let store_path = dirs.data_dir();
    let remote_url = config.remote_url.clone();
    let version = config.remote_version.clone();
    let fetcher = *fetcher::GitFetcher::new(src_path, store_path.into(), remote_url, version)?;
    Ok(fetcher)
}

fn get_unbound_top_levels(
    session: &Session,
    fetcher: impl Fetcher,
    book: &mut Book,
) -> anyhow::Result<()> {
    let (_, unbound_tops) = get_book_unbound(session.diagnostic_sender.clone(), book, true);
    let unbound_tops: FxHashSet<QualifiedIdent> = unbound_tops
        .iter()
        .map(|(_, x)| x)
        .flatten()
        .cloned()
        .collect();
    let missing_files = get_files_from_top_levels(unbound_tops.iter());
    Ok(())
}

fn get_files_from_top_levels(tops: impl Iterator<QualifiedIdent>) -> FxHashSet<PathBuf> {
    todo!()
}
