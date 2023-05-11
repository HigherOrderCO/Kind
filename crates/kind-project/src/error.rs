use std::error::Error;
use std::fmt;
use std::path::PathBuf;

#[derive(Debug)]
pub enum ProjectError {
    AlreadyInProject { root: PathBuf },
    NotInProject,
}

impl fmt::Display for ProjectError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Self::AlreadyInProject { root } => write!(
                f,
                "Already inside Kind project defined in {}",
                root.display()
            ),
            Self::NotInProject => write!(f, "Not inside Kind project"),
        }
    }
}

impl Error for ProjectError {}
