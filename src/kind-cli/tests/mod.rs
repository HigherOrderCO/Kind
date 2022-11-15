use kind_driver::session::Session;
use kind_report::data::{Diagnostic, DiagnosticFrame};
use kind_report::report::Report;
use kind_report::RenderConfig;

use std::fs::{self, File};
use std::io::Write;
use std::path::{Path, PathBuf};

use ntest::timeout;
use pretty_assertions::assert_eq;
use walkdir::{Error, WalkDir};

use kind_driver as driver;

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
        let (rx, tx) = std::sync::mpsc::channel();
        let root = PathBuf::from(".");
        let mut session = Session::new(root, rx);

        let check = driver::type_check_book(&mut session, &PathBuf::from(path));

        let diagnostics = tx.try_iter().collect::<Vec<DiagnosticFrame>>();
        let render = RenderConfig::ascii(2);

        kind_report::check_if_colors_are_supported(true);

        match check {
            Some(_) if diagnostics.is_empty() => "Ok!".to_string(),
            _ => {
                let mut res_string = String::new();

                for diagnostic in diagnostics {
                    let diag = Into::<Diagnostic>::into(&diagnostic);
                    diag.render(&mut session, &render, &mut res_string).unwrap();
                }

                res_string
            }
        }
    })?;
    Ok(())
}

#[test]
#[timeout(15000)]
fn test_eval() -> Result<(), Error> {
    test_kind2(Path::new("./tests/suite/eval"), |path| {
        let (rx, tx) = std::sync::mpsc::channel();
        let root = PathBuf::from(".");
        let mut session = Session::new(root, rx);

        let check = driver::compile_book_to_hvm(&mut session, &PathBuf::from(path));

        let diagnostics = tx.try_iter().collect::<Vec<DiagnosticFrame>>();
        let render = RenderConfig::ascii(2);

        kind_report::check_if_colors_are_supported(true);

        match check {
            Some(file) if diagnostics.is_empty() => {
                driver::execute_file(&file).to_string()
            },
            _ => {
                let mut res_string = String::new();

                for diagnostic in diagnostics {
                    let diag = Into::<Diagnostic>::into(&diagnostic);
                    diag.render(&mut session, &render, &mut res_string).unwrap();
                }

                res_string
            }
        }
    })?;
    Ok(())
}
