use std::path::{PathBuf, Path};

use kind_report::data::Diagnostic;
use kind_tree::symbol::QualifiedIdent;

use crate::errors::DriverError;

const EXT: &str = "kind2";

/// Tries to accumulate on a buffer all of the
/// paths that exists (so we can just throw an
/// error about ambiguous resolution to the user)
pub(crate) fn accumulate_neighbour_paths(
    ident: &QualifiedIdent,
    raw_path: &Path,
) -> Result<Option<PathBuf>, Box<dyn Diagnostic>> {
    let mut canon_path = raw_path.to_path_buf();
    let mut dir_file_path = raw_path.to_path_buf();
    let dir_path = raw_path.to_path_buf();

    canon_path.set_extension(EXT);
    dir_file_path.push("_");
    dir_file_path.set_extension(EXT);

    if canon_path.exists() && dir_path.exists() && canon_path.is_file() && dir_path.is_dir() {
        Err(Box::new(DriverError::MultiplePaths(
            ident.clone(),
            vec![canon_path, dir_path],
        )))
    } else if canon_path.is_file() {
        Ok(Some(canon_path))
    } else if dir_file_path.is_file() {
        Ok(Some(dir_file_path))
    } else {
        Ok(None)
    }
}