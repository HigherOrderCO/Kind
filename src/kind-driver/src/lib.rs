use core::fmt;
use std::{
    io,
    path::PathBuf,
    rc::Rc,
    sync::{mpsc::Sender, Mutex, Arc},
    time::Duration,
};

use dashmap::{mapref::entry, DashMap};
use errors::DriverError;
use kind_pass::unbound;
use kind_report::{
    data::{Diagnostic, DiagnosticFrame},
    render::FileCache,
    RenderConfig,
};
use kind_span::SyntaxCtxIndex;
use kind_tree::{concrete::{self}, symbol::Ident};
use notify_debouncer_mini::{
    new_debouncer,
    notify::{RecommendedWatcher, RecursiveMode},
    DebounceEventResult, Debouncer,
};

pub mod errors;
pub mod resolution;
pub mod session;

extern crate salsa_2022 as salsa;

/// Helper structure to use stderr as fmt::Write
struct ToWriteFmt<T>(pub T);

impl<T> fmt::Write for ToWriteFmt<T>
where
    T: io::Write,
{
    fn write_str(&mut self, s: &str) -> fmt::Result {
        self.0.write_all(s.as_bytes()).map_err(|_| fmt::Error)
    }
}

pub fn render_error_to_stderr(
    render_config: &RenderConfig,
    session: &Database,
    err: &DiagnosticFrame,
) {
    Diagnostic::render(
        &Diagnostic { frame: err },
        session,
        render_config,
        &mut ToWriteFmt(std::io::stderr()),
    )
    .unwrap();
}

impl FileCache for Database {
    fn fetch(&self, ctx: SyntaxCtxIndex) -> Option<(PathBuf, &String)> {
        let path = self.count.get(&ctx.0)?;
        let code = self.files.get(&*path.clone())?;
        Some((path.clone(), code.1.text(self)))
    }
}

#[salsa::jar(db = Db)]
pub struct Jar(ProgramSource, Module, parse_file, Diagnostics);

pub trait Db: salsa::DbWithJar<Jar> {
    fn input_path(&self, cur: PathBuf) -> Option<ProgramSource>;
    fn input(&self, cur: Ident, next: Vec<Ident>) -> Option<ProgramSource>;
}

impl salsa::Database for Database {}

#[salsa::db(crate::Jar)]
pub struct Database {
    pub storage: salsa::Storage<Self>,
    pub files: DashMap<PathBuf, (Ident, ProgramSource)>,
    pub count: DashMap<usize, PathBuf>,
    pub file_watcher: Mutex<Debouncer<RecommendedWatcher>>,
}

impl Database {
    pub fn new(tx: Sender<DebounceEventResult>) -> Self {
        let storage = Default::default();
        Self {
            storage,
            files: DashMap::new(),
            count: DashMap::new(),
            file_watcher: Mutex::new(new_debouncer(Duration::from_millis(10), None, tx).unwrap()),
        }
    }
}

impl Db for Database {
    fn input_path(&self, cur: PathBuf) -> Option<ProgramSource> {
        let path = match cur.canonicalize().ok() {
            Some(res) => Some(res),
            None => {
                Diagnostics::push(self, DriverError::UnboundVariable(vec![], vec![]).into());
                None
            }
        }?;
        Some(match self.files.entry(path.clone()) {
            entry::Entry::Occupied(entry) => entry.get().1,
            entry::Entry::Vacant(entry) => {
                let watcher = &mut *self.file_watcher.lock().unwrap();
                watcher
                    .watcher()
                    .watch(&path, RecursiveMode::NonRecursive)
                    .unwrap();
                let contents = std::fs::read_to_string(&path).ok()?;
                self.count.insert(self.count.len(), path.clone());
                entry.insert((Ident::generate("Main"), ProgramSource::new(self, path, SyntaxCtxIndex(self.count.len() - 1), contents))).1
            }
        })
    }

    fn input(&self, cur: Ident, next: Vec<Ident>) -> Option<ProgramSource> {
        let ident = cur.clone();
        let segments = ident.to_str().split('.').collect::<Vec<&str>>();
        let mut raw_path = PathBuf::from(segments.join("/")).to_path_buf();
        raw_path.set_extension("kind2");


        let path = match raw_path.canonicalize().ok() {
            Some(res) => Some(res),
            None => {
                Diagnostics::push(self, DriverError::UnboundVariable(next, vec![]).into());
                None
            }
        }?;

        Some(match self.files.entry(path.clone()) {
            entry::Entry::Occupied(entry) => entry.get().1,
            entry::Entry::Vacant(entry) => {
                let watcher = &mut *self.file_watcher.lock().unwrap();
                watcher
                    .watcher()
                    .watch(&path, RecursiveMode::NonRecursive)
                    .unwrap();
                let contents = std::fs::read_to_string(&path).ok()?;
                self.count.insert(self.count.len(), path.clone());
                entry.insert((cur, ProgramSource::new(self, path, SyntaxCtxIndex(self.count.len() - 1), contents))).1
            }
        })
    }
}

#[salsa::input]
pub struct ProgramSource {
    pub path: PathBuf,

    pub ctx: SyntaxCtxIndex,

    #[return_ref]
    pub text: String,
}

#[salsa::tracked]
pub struct Module {
    module: concrete::Module,
}

#[salsa::accumulator]
pub struct Diagnostics(DiagnosticFrame);

#[salsa::tracked]
pub fn parse_file(db: &dyn crate::Db, file: ProgramSource) -> Module {
    let (rx, tx) = std::sync::mpsc::channel();
    let mut module = kind_parser::parse_book(rx.clone(), file.ctx(db).0, &file.text(db));

    println!("Parsing it again! {:?}", file.path(db));

    let unbound = unbound::get_module_unbound(rx, &mut module);

    for (_, idents) in unbound {
        match db.input(idents[0].clone(), idents) {
            Some(res) => { parse_file(db, res); },
            None => ()
        };
        
    }

    for err in tx.try_iter() {
        Diagnostics::push(db, err);
    }

    Module::new(db, module)
}
