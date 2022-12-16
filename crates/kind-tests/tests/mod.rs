#![feature(result_flattening)]

use kind_driver::session::Session;
use kind_report::data::Diagnostic;
use kind_report::report::Report;
use kind_report::RenderConfig;

use std::fs::{self, File};
use std::io::Write;
use std::path::{Path, PathBuf};

use ntest::timeout;
use pretty_assertions::assert_eq;
use walkdir::{Error, WalkDir};

use kind_driver as driver;

fn golden_test(path: &Path, run: &dyn Fn(&Path) -> String) {
    let result = run(path);

    let golden_path = path.with_extension("golden");
    if let Ok(to_check) = fs::read_to_string(golden_path.clone()) {
        assert_eq!(result, to_check, "Testing file '{}'", path.display());
    } else {
        let mut file = File::create(golden_path).unwrap();
        file.write_all(result.as_bytes()).unwrap();
    }
}

fn test_kind2(path: &Path, run: fn(&PathBuf, &mut Session) -> Option<String>) -> Result<(), Error> {
    for entry in WalkDir::new(path).follow_links(true) {
        let entry = entry?;
        let path = entry.path();
        if path.is_file() && path.extension().map(|x| x == "kind2").unwrap_or(false) {
            golden_test(path, &|path| {
                let (rx, tx) = std::sync::mpsc::channel();
                let root = PathBuf::from("./suite/lib").canonicalize().unwrap();
                let mut session = Session::new(root, rx);

                let res = run(&PathBuf::from(path), &mut session);

                let diagnostics = tx.try_iter().collect::<Vec<Box<dyn Diagnostic>>>();
                let render = RenderConfig::ascii(2);

                kind_report::check_if_colors_are_supported(true);

                match res {
                    Some(res) if diagnostics.is_empty() => res,
                    _ => {
                        let mut res_string = String::new();

                        for diag in diagnostics {
                            diag.render(&session, &render, &mut res_string).unwrap();
                        }

                        res_string
                    }
                }
            });
        }
    }
    Ok(())
}

#[test]
#[timeout(30000)]
fn test_checker() -> Result<(), Error> {
    test_kind2(Path::new("./suite/checker"), |path, session| {
        let entrypoints = vec!["Main".to_string()];
        let check = driver::type_check_book(session, path, entrypoints, Some(1));
        check.map(|_| "Ok!".to_string()).ok()
    })?;
    Ok(())
}

#[test]
#[timeout(30000)]
fn test_checker_issues() -> Result<(), Error> {
    test_kind2(Path::new("./suite/issues/checker"), |path, session| {
        let entrypoints = vec!["Main".to_string()];
        let check = driver::type_check_book(session, path, entrypoints, Some(1));
        check.map(|_| "Ok!".to_string()).ok()
    })?;
    Ok(())
}

#[test]
#[timeout(15000)]
fn test_eval() -> Result<(), Error> {
    test_kind2(Path::new("./suite/eval"), |path, session| {
        let entrypoints = vec!["Main".to_string()];
        let check = driver::erase_book(session, path, entrypoints)
            .map(|file| driver::compile_book_to_hvm(file, false))
            .map(|file| driver::execute_file(&file.to_string(), Some(1)))
            .flatten();

        check.ok().map(|x| x.0)
    })?;
    Ok(())
}

#[test]
#[timeout(15000)]
fn test_eval_issues() -> Result<(), Error> {
    test_kind2(Path::new("./suite/issues/eval"), |path, session| {
        let entrypoints = vec!["Main".to_string()];
        let check = driver::erase_book(session, path, entrypoints)
            .map(|file| driver::compile_book_to_hvm(file, false))
            .map(|file| driver::execute_file(&file.to_string(), Some(1)))
            .flatten();

        check.ok().map(|x| x.0)
    })?;
    Ok(())
}

#[test]
#[timeout(15000)]
fn test_kdl() -> Result<(), Error> {
    test_kind2(Path::new("./suite/kdl"), |path, session| {
        let entrypoints = vec!["Main".to_string()];
        let check = driver::compile_book_to_kdl(path, session, "", entrypoints);
        check.ok().map(|x| x.to_string())
    })?;
    Ok(())
}

#[test]
#[timeout(15000)]
fn test_erasure() -> Result<(), Error> {
    test_kind2(Path::new("./suite/erasure"), |path, session| {
        let entrypoints = vec!["Main".to_string()];
        let check = driver::erase_book(session, path, entrypoints).map(|file| file.to_string());
        check.ok()
    })?;
    Ok(())
}
