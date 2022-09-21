use std::path::{Path, PathBuf};

use crate::book::name::Ident;
use crate::book::span::{FileOffset, Span, SpanData};
use crate::book::Book;

use crate::lowering::adjust::AdjustErrorKind;
use crate::parser::read_book;

use super::config::Config;

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

pub fn load_entry(config: &Config, name: &str, load: &mut Load) -> Result<(), String> {
    if !load.book.entrs.contains_key(&Ident(name.to_string())) {
        let path: PathBuf;
        if name.ends_with(".kind2") {
            path = PathBuf::from(&name.to_string());
        } else {
            let root = Path::new(&config.kind2_path).join(&name.replace('.', "/"));
            let inside_path = root.clone().join("_.kind2"); // path ending with 'Name/_.kind'
            let mut normal_path = root.clone(); // path ending with 'Name.kind'
            normal_path.set_extension("kind2");

            if inside_path.is_file() {
                if normal_path.is_file() {
                    return Err(format!(
                        "The following files can't exist simultaneously:\n- {}\n- {}\nPlease delete one and try again.",
                        inside_path.display(), normal_path.display()
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

        let mut new_book = match read_book(&newcode) {
            Err(err) => {
                return Err(format!("\x1b[1m[{}]\x1b[0m\n{}", path.display(), err));
            }
            Ok(book) => book,
        };

        new_book.set_origin_file(FileOffset(load.file.len() as u32));

        load.file.push(File { path: path.to_str().unwrap().into(), code: newcode });
        for name in &new_book.names {
            load.book.names.push(name.clone());
            load.book.entrs.insert(Ident(name.clone()), new_book.entrs.get(&Ident(name.to_string())).unwrap().clone());
        }

        for unbound in &new_book.get_unbounds() {
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

    match load.book.adjust() {
        Ok(book) => {
            load.book = book;
        }
        Err(err) => {
            let high_line =
                match err.orig {
                    Span::Localized(SpanData { file, start, end }) if !config.no_high_line =>
                        highlight_error::highlight_error(start.0 as usize, end.0 as usize, &load.file[file.0 as usize].code),
                    _ =>  "".to_string()
                };
            return match err.kind {
                AdjustErrorKind::IncorrectArity => Err(format!("Incorrect arity.\n{}", high_line)),
                AdjustErrorKind::UnboundVariable { name } => Err(format!("Unbound variable '{}'.\n{}", name, high_line)),
                AdjustErrorKind::RepeatedVariable => Err(format!("Repeated variable.\n{}", high_line)),
                AdjustErrorKind::CantLoadType => Err(format!("Can't load type.\n{}", high_line)),
                AdjustErrorKind::NoCoverage => Err(format!("Incomplete constructor coverage.\n{}", high_line)),
            };
        }
    };

    Ok(load)
}
