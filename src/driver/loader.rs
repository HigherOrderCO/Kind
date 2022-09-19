use crate::book::name::Ident;
use crate::book::span::SpanData;
use crate::book::span::{FileOffset, Span};
use crate::book::Book;
use crate::lowering::adjust::AdjustErrorKind;
use crate::parser::read_book;

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
            book: Book::new(),
        }
    }
}

pub fn load_entry(name: &str, load: &mut Load) -> Result<(), String> {
    if !load.book.entrs.contains_key(&Ident(name.to_string())) {
        let path: String;
        if name.ends_with(".kind2") {
            path = name.to_string();
        } else {
            let inside_path = format!("{}/_.kind2", &name.replace(".", "/")); // path ending with 'Name/_.kind'
            let normal_path = format!("{}.kind2", &name.replace(".", "/")); // path ending with 'Name.kind'
            if std::path::Path::new(&inside_path).is_file() {
                if std::path::Path::new(&normal_path).is_file() {
                    return Err(format!("The following files can't exist simultaneously:\n- {}\n- {}\nPlease delete one and try again.", inside_path, normal_path));
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
                return Err(format!("\x1b[1m[{}]\x1b[0m\n{}", path, err));
            }
            Ok(book) => book,
        };

        new_book.set_origin_file(FileOffset(load.file.len() as u32));

        load.file.push(File {
            path: path.clone(),
            code: newcode,
        });
        for name in &new_book.names {
            load.book.names.push(name.clone());
            load.book.entrs.insert(
                Ident(name.clone()),
                new_book
                    .entrs
                    .get(&Ident(name.to_string()))
                    .unwrap()
                    .clone(),
            );
        }

        for unbound in &new_book.get_unbounds() {
            load_entry(&unbound.0, load)?;
        }
    }
    return Ok(());
}

pub fn load(name: &str) -> Result<Load, String> {

    let mut load = Load::new_empty();

    if !std::path::Path::new(name).is_file() {
        return Err(format!("File not found: '{}'", name));
    }

    load_entry(name, &mut load)?;

    match load.book.adjust() {
        Ok(book) => {
            load.book = book;
        }
        Err(err) => {
            let high_line = if let Span::Localized(SpanData { file, start, end }) = err.orig {
                highlight_error::highlight_error(
                    start.0 as usize,
                    end.0 as usize,
                    &load.file[file.0 as usize].code,
                )
            } else {
                "".to_string()
            };
            return match err.kind {
                AdjustErrorKind::IncorrectArity => Err(format!("Incorrect arity.\n{}", high_line)),
                AdjustErrorKind::UnboundVariable { name } => {
                    Err(format!("Unbound variable '{}'.\n{}", name, high_line))
                }
                AdjustErrorKind::RepeatedVariable => {
                    Err(format!("Repeated variable.\n{}", high_line))
                }
                AdjustErrorKind::CantLoadType => Err(format!("Can't load type.\n{}", high_line)),
                AdjustErrorKind::NoCoverage => {
                    Err(format!("Incomplete constructor coverage.\n{}", high_line))
                }
            };
        }
    };

    return Ok(load);
}
