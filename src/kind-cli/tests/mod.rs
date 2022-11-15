use kind_cli::{run_cli, Cli};

use ntest::timeout;
use pretty_assertions::assert_eq;
use std::fs::{self, File};
use std::io::Write;
use std::path::{Path, PathBuf};
use walkdir::{Error, WalkDir};

fn golden_test(path: &Path, run: fn(&Path) -> String) {
    let result = run(path);

    let golden_path = path.with_extension("golden");
    if let Ok(to_check) = fs::read_to_string(golden_path.clone()) {
        assert_eq!(result, to_check, "Testing file '{}'", path.display());
    } else {
        let mut file = File::create(golden_path).unwrap();
        file.write_all(result.as_bytes()).unwrap();
    }
}

fn test_kind2(path: &Path, run: fn(&Path) -> String) -> Result<(), Error> {
    for entry in WalkDir::new(path).follow_links(true) {
        let entry = entry?;
        let path = entry.path();
        if path.is_file() && path.extension().map(|x| x == "kind2").unwrap_or(false) {
            golden_test(path, run);
        }
    }
    Ok(())
}


#[test]
#[timeout(15000)]
fn test_checker() -> Result<(), Error> {
    test_kind2(Path::new("./tests/suite/checker"), |path| {
        let config = Cli {
            ascii: true,
            no_color: true,
            config: None,
            command: kind_cli::Command::Check { file: path.to_str().unwrap().to_string() },
            debug: false,
            warning: true,
        };

        // let (rx, tx) = std::sync::mpsc::channel();
        let root = PathBuf::from(".");
        run_cli(config);
        todo!()
    })?;
    Ok(())
}
