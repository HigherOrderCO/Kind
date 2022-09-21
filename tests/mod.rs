use std::{fs::{self, File}, path::{Path}, io::Write};
use walkdir::{WalkDir, Error};
use pretty_assertions::{assert_eq};

use kind2::driver::{self, config::Config};
use kind2::codegen;

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

fn compile_kdl(config: &Config, path: &str) -> Result<String, String> {
    let loaded = driver::loader::load(&config, path)?;
    let comp_book = codegen::kdl::compile_book(&loaded.book)?;
    let kdl_names = codegen::kdl::get_kdl_names(&comp_book)?;
    let result = codegen::kdl::to_kdl_book(&loaded.book, &kdl_names, &comp_book)?;
    Ok(result)
}

#[test]
fn test_checker() -> Result<(), Error> {
    test_kind2(Path::new("./tests/suite/checker"), | path | {
        let config = Config {
            no_high_line: true,
            color_output: false,
            kind2_path: ".".to_string()
        };
        let result = driver::loader::load(&config, path.to_str().unwrap());
        let result = result.and_then(| x | driver::run_with_hvm(&driver::gen_checker(&x.book), "Kind.API.check_all", true));
        result.map_or_else(|d| d, |e| e.output)
    })?;
    Ok(())
}

#[test]
fn test_to_hvm() -> Result<(), Error> {
    test_kind2(Path::new("./tests/suite/to_hvm"), | path | {
        let config = Config {
            no_high_line: true,
            color_output: false,
            kind2_path: ".".to_string()
        };
        let result = driver::loader::load(&config, path.to_str().unwrap());
        let result = result.map(|loaded| codegen::hvm::to_hvm_book(&loaded.book));
        result.map_or_else(|d| d, |e| e)
    })?;
    Ok(())
}

#[test]
fn test_to_kdl() -> Result<(), Error> {
    test_kind2(Path::new("./tests/suite/to_kdl"), | path | {
        let config = Config {
            no_high_line: true,
            color_output: false,
            kind2_path: ".".to_string()
        };

        let result = compile_kdl(&config, path.to_str().unwrap());
        result.map_or_else(|d| d, |e| e)
    })?;
    Ok(())
}

#[test]
fn test_run_hvm() -> Result<(), Error> {
    test_kind2(Path::new("./tests/suite/eval"), | path | {
        let config = Config {
            no_high_line: true,
            color_output: false,
            kind2_path: ".".to_string()
        };
        let result = driver::loader::load(&config, path.to_str().unwrap());
        let result = result.and_then(| x | driver::run_with_hvm(&driver::gen_checker(&x.book), "Kind.API.eval_main", true));
        result.map_or_else(|d| d, |e| e.output)
    })?;
    Ok(())
}