use std::path::{Path, PathBuf};

use crate::lowering::adjust::{AdjustErrorKind, AdjustError};
use crate::lowering::attributes::check_attributes;
use crate::lowering::resolve::Resolve;
use crate::parser::read_book;
use crate::book::name::Ident;
use crate::book::span::{FileOffset, Span, SpanData};
use crate::book::Book;

use super::config::Config;

#[derive(Debug, Clone)]
pub struct File {
    pub path: String,
    pub code: String,
}

pub struct Load {
    pub file: Vec<File>,
    pub book: Book,
}

impl Load {
    pub fn new_empty() -> Load {
        Load {
            file: Vec::new(),
            book: Book::default(),
        }
    }
}

pub fn render_error(config: &Config, files: &[File], err: AdjustError) -> String {
    let high_line = match err.orig {
        Span::Localized(SpanData { file, start, end }) if !config.no_high_line => format!(
            "On '{}'\n{}",
            files[file.0 as usize].path,
            highlight_error::highlight_error(start.0 as usize, end.0 as usize, &files[file.0 as usize].code)
        ),
        _ if !config.no_high_line => "Cannot find the source of the error.".to_string(),
        _ => "".to_string(),
    };
    return match err.kind {
        AdjustErrorKind::IncorrectArity => format!("Incorrect arity.\n{}", high_line),
        AdjustErrorKind::UnboundVariable { name } => format!("Unbound variable '{}'.\n{}", name, high_line),
        AdjustErrorKind::RepeatedVariable => format!("Repeated variable.\n{}", high_line),
        AdjustErrorKind::CantLoadType => format!("Can't load type.\n{}", high_line),
        AdjustErrorKind::NoCoverage => format!("Incomplete constructor coverage.\n{}", high_line),
        AdjustErrorKind::UseOpenInstead => format!("You should use `open` instead of `match` on record types.\n{}", high_line),
        AdjustErrorKind::UseMatchInstead => format!("You should use `match` instead of `open` on sum types.\n{}", high_line),
        AdjustErrorKind::CannotFindAlias { name } => format!("Cannot find alias '{}' try to add an 'use' statement.\n{}", name,high_line),
        AdjustErrorKind::InvalidAttribute { name } => format!("You cannot use the attribute '{}'.\n{}", name, high_line),
        AdjustErrorKind::AttributeWithoutArgs { name } => format!("You should not put arguments on the attribute '{}'.\n{}", name, high_line),
        AdjustErrorKind::AttributeMissingArg { name } => format!("Attribute '{}' needs to be given a value.\n{}", name, high_line),
        AdjustErrorKind::WrongTargetAttribute { name, target } => format!("The attribute '{}' only works in the target '{}'.\n{}", name, target, high_line),
        AdjustErrorKind::NotInlineable { fn_name, attr_name } => format!("Function '{}' must have exactly one rule with only variable patterns to be '{}'.\n{}", fn_name, attr_name, high_line),
        AdjustErrorKind::FunctionHasArgs { fn_name, attr_name } => format!("Function '{}' must not have any arguments to be '{}'.\n{}", fn_name, attr_name, high_line),
        AdjustErrorKind::FunctionNotFound { name } => format!("Function '{}' was not found.\n{}", name, high_line),
        AdjustErrorKind::HasKdlAttrs { name } => format!("Function '{}' must not have any kdl attributes.\n{}", name, high_line),
    };
}

pub fn to_current_namespace(config: &Config, path: &PathBuf) -> String {
    let base = Path::new(&config.kind2_path);
    let mut cur = path.clone();
    cur.set_extension("");
    let cur_path = cur.strip_prefix(base);
    cur_path.map(| x | {
        let mut arr = x.into_iter().map(|x| x.to_str().unwrap()).collect::<Vec<&str>>();
        arr.pop();
        arr.join(".")
    }).unwrap_or("".to_string())
}

pub fn load_entry(config: &Config, name: &str, load: &mut Load) -> Result<(), String> {
    if !load.book.entrs.contains_key(&Ident(name.to_string())) {
        let path: PathBuf;
        let base = Path::new(&config.kind2_path);
        if name.ends_with(".kind2") {
            path = PathBuf::from(&name.to_string());
        } else {
            let mut normal_path = base.join(&name.replace('.', "/"));
            let inside_path = normal_path.clone().join("_.kind2"); // path ending with 'Name/_.kind'
            normal_path.set_extension("kind2");

            if inside_path.is_file() {
                if normal_path.is_file() {
                    return Err(format!(
                        "The following files can't exist simultaneously:\n- {}\n- {}\nPlease delete one and try again.",
                        inside_path.display(),
                        normal_path.display()
                    ));
                }
                path = inside_path;
            } else {
                path = normal_path;
            }
        };

        let newcode = match std::fs::read_to_string(&path) {
            Err(_) => {
                return Ok(());
            }
            Ok(code) => code,
        };

        let (mut new_book, uses) = match read_book(&newcode) {
            Err(err) => {
                return Err(format!("\x1b[1m[{}]\x1b[0m\n{}", path.display(), err));
            }
            Ok(book) => book,
        };

        let file = File {
            path: path.to_str().unwrap().into(),
            code: newcode,
        };

        let cur_mod = to_current_namespace(config, &path.clone());
        new_book.resolve(&cur_mod, &uses).map_err(|err| render_error(config, &vec![file.clone()], err))?;
        new_book.set_origin_file(FileOffset(load.file.len() as u32));

        load.file.push(file);
        for name in &new_book.names {
            load.book.names.push(name.clone());
            load.book.entrs.insert(name.clone(), new_book.entrs.get(&name).unwrap().clone());
        }

        for unbound in &new_book.get_unbounds(config) {
            load_entry(config, &unbound.0, load)?;
        }
    }
    Ok(())
}

pub fn load(config: &Config, name: &str) -> Result<Load, String> {
    let mut load = Load::new_empty();

    if !std::path::Path::new(name).is_file() {
        return Err(format!("File not found: '{}'", name));
    }

    load_entry(config, name, &mut load)?;

    let res = check_attributes(config, &load.book).and_then(|_| load.book.adjust(config));

    match res {
        Ok(book) => {
            load.book = book;
            Ok(load)
        }
        Err(err) => Err(render_error(config, &load.file, err))
    }
}
