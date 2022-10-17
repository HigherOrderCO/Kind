use std::collections::{HashMap, HashSet};
use std::path::PathBuf;
use std::rc::Rc;
use std::sync::mpsc::Sender;

use kind_report::data::DiagnosticFrame;
use kind_report::RenderConfig;
use kind_tree::concrete::Book;

#[derive(Debug, Clone)]
pub struct Session<'a> {
    pub loaded_idents: HashMap<String, usize>,
    pub loaded_paths: Vec<Rc<PathBuf>>,
    pub loaded_sources: Vec<Rc<String>>,
    pub public_names: HashMap<PathBuf, HashSet<String>>,
    pub parsed_books: Vec<Rc<Book>>,

    pub diagnostic_sender: Sender<DiagnosticFrame>,
    pub root: PathBuf,
    pub render_config: &'a RenderConfig<'a>,

    pub book_counter: usize,
}

impl<'a> Session<'a> {
    pub fn new(
        root: PathBuf,
        render_config: &'a RenderConfig<'a>,
        sender: Sender<DiagnosticFrame>,
    ) -> Session<'a> {
        Session {
            loaded_idents: HashMap::new(),
            loaded_paths: Vec::new(),
            loaded_sources: Vec::new(),
            parsed_books: Vec::new(),
            public_names: HashMap::new(),
            root,
            render_config,
            book_counter: 0,
            diagnostic_sender: sender,
        }
    }
    pub fn add_book(
        &mut self,
        ident: String,
        path: Rc<PathBuf>,
        code: Rc<String>,
        book: Rc<Book>,
    ) -> usize {
        let id = self.book_counter;
        self.book_counter += 1;
        self.loaded_idents.insert(ident, id);
        self.loaded_paths.push(path);
        self.loaded_sources.push(code);
        self.parsed_books.push(book);
        id
    }
}
