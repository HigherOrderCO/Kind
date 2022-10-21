//! Describes a compilation session. It's not the finished
//! model because I want to change it to a query based compiler
//! later.

use std::collections::HashSet;
use std::path::PathBuf;
use std::rc::Rc;
use std::sync::mpsc::Sender;

use fxhash::FxHashMap;
use kind_report::data::DiagnosticFrame;
use kind_tree::concrete::Book;

#[derive(Debug, Clone)]
pub struct Session {
    pub loaded_idents: FxHashMap<String, usize>,
    pub loaded_paths: Vec<Rc<PathBuf>>,
    pub loaded_sources: Vec<Rc<String>>,
    pub public_names: FxHashMap<PathBuf, HashSet<String>>,
    pub parsed_books: Vec<Rc<Book>>,

    pub diagnostic_sender: Sender<DiagnosticFrame>,
    pub root: PathBuf,

    pub book_counter: usize,
}

impl Session {
    pub fn new(root: PathBuf, sender: Sender<DiagnosticFrame>) -> Session {
        Session {
            loaded_idents: FxHashMap::default(),
            loaded_paths: Vec::new(),
            loaded_sources: Vec::new(),
            parsed_books: Vec::new(),
            public_names: FxHashMap::default(),
            root,
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
