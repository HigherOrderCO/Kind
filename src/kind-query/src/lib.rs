//! This module is a generalization of the driver
//! module. It is useful both for LSPs, Watch, Repl
//! and many other things.

mod errors;
mod graph;
mod names;

use std::fs;
use std::path::PathBuf;
use std::rc::Rc;
use std::sync::mpsc::Sender;

use errors::DriverError;
use fxhash::FxHashMap;
use fxhash::FxHashSet;
use graph::Graph;
use kind_pass::desugar;
use kind_pass::erasure;
use kind_pass::expand;
use kind_pass::unbound;
use kind_report::data::Diagnostic;
use kind_report::report::FileCache;
use kind_span::Range;
use kind_tree::concrete;
use kind_tree::concrete::Book;
use kind_tree::concrete::Module;
use kind_tree::concrete::TopLevel;
use kind_tree::symbol::QualifiedIdent;

pub enum Status {
    Module,
    Entry,
}

pub struct Resource {
    concrete_tree: concrete::Module,
    exposed_entries: FxHashSet<String>,
}

pub struct File {
    path: PathBuf,
    input: String,
    hash: u64,
}

pub enum Resolution<T> {
    Added(T),
    Reuse(T),
    Fail,
}

impl<T> Resolution<T> {
    pub fn is_fail(&self) -> bool {
        matches!(self, Resolution::Fail)
    }
}

#[derive(Default)]
pub struct Storage {
    pub graph: Graph<usize>,
    resources: FxHashMap<usize, Rc<Resource>>,
    files: FxHashMap<usize, File>,
    entries: FxHashMap<String, (Range, usize)>,
}

pub struct Session<'a> {
    pub storage: &'a mut Storage,
    handler: &'a mut dyn SessionHandler,

    root: PathBuf,
    count: usize,
}

impl FileCache for Storage {
    fn fetch(&self, ctx: kind_span::SyntaxCtxIndex) -> Option<(PathBuf, &String)> {
        let file = self.files.get(&ctx.0).unwrap();
        Some((file.path.clone(), &file.input))
    }
}

pub trait SessionHandler {
    fn on_add_file(&mut self, file: PathBuf, id: usize);

    fn on_rem_file(&mut self, id: usize);

    fn on_errors(&mut self, storage: &Storage, uri: usize, errs: Vec<Box<dyn Diagnostic>>);

    fn get_id_by_path(&mut self, path: &PathBuf) -> Option<usize>;
}

pub fn add_module_to_book(book: &mut Book, module: &Module) {
    for entry in &module.entries {
        match entry {
            TopLevel::SumType(sum) => {
                for cons in &sum.constructors {
                    let name = sum.name.add_segment(cons.name.to_str()).to_string();
                    book.count.insert(name, cons.extract_book_info(&sum));
                }

                let name = sum.name.to_string();
                book.count.insert(name.clone(), sum.extract_book_info());
                book.entries.insert(name, entry.clone());
            }
            TopLevel::RecordType(rec) => {
                let cons_ident = rec.name.add_segment(rec.constructor.to_str()).to_string();
                book.count
                    .insert(cons_ident, rec.extract_book_info_of_constructor());

                let name = rec.name.to_string();
                book.count.insert(name.clone(), rec.extract_book_info());
                book.entries.insert(name, entry.clone());
            }
            TopLevel::Entry(entr) => {
                let name = entr.name.to_string();
                book.count.insert(name.clone(), entr.extract_book_info());
                book.entries.insert(name, entry.clone());
            }
        }
    }
}

impl<'a> Session<'a> {
    pub fn new(
        handler: &'a mut dyn SessionHandler,
        storage: &'a mut Storage,
        root: PathBuf,
    ) -> Session<'a> {
        Session {
            storage,
            handler,
            root,
            count: 0,
        }
    }

    pub fn set_input(&mut self, module_id: usize, input: String) {
        if let Some(file) = self.storage.files.get_mut(&module_id) {
            self.storage.graph.flood_invalidation(module_id);

            file.hash = fxhash::hash64(&input);
            file.input = input;
        } else {
            todo!()
        }
    }

    pub fn remove_node(&mut self, module_id: usize) {
        self.storage.graph.remove(module_id);
        self.storage.files.remove(&module_id);
        if let Some(res) = self.storage.resources.remove(&module_id) {
            for entry in &res.exposed_entries {
                self.storage.entries.remove(entry);
            }
        };
        self.handler.on_rem_file(module_id)
    }

    fn register_module(&mut self, path: PathBuf, _module_name: String, input: String) -> usize {
        let module_id = self.count;
        self.count += 1;

        let file = File {
            path,
            hash: fxhash::hash64(&input),
            input,
        };

        self.storage.graph.add(module_id, 1, false);
        self.storage.files.insert(module_id, file);

        module_id
    }

    fn register_new_module(
        &mut self,
        errs: Sender<Box<dyn Diagnostic>>,
        module_name: &QualifiedIdent,
    ) -> Resolution<usize> {
        let name = module_name.to_string();
        let node = self.storage.entries.get(&name);
        if let Some((_, module_id)) = node {
            Resolution::Reuse(*module_id)
        } else {
            let path = match names::ident_to_path(&self.root, module_name) {
                Ok(Some(res)) => res,
                Ok(None) => {
                    errs.send(Box::new(DriverError::UnboundVariable(
                        vec![module_name.to_ident()],
                        vec![],
                    )))
                    .unwrap();
                    return Resolution::Fail;
                }
                Err(err) => {
                    errs.send(err).unwrap();
                    return Resolution::Fail;
                }
            };

            let input = fs::read_to_string(&path).unwrap();

            let id = self.register_module(path.clone(), name, input);

            self.handler.on_add_file(path, id);

            Resolution::Added(id)
        }
    }

    fn register_names(
        &mut self,
        errs: Sender<Box<dyn Diagnostic>>,
        names: FxHashMap<String, Range>,
        module_id: usize,
    ) -> bool {
        // Pre check to avoid the register of bad inputs.
        let mut failed = false;
        for (name, range) in &names {
            if let Some((first, _)) = self.storage.entries.get(name) {
                errs.send(Box::new(DriverError::DefinedMultipleTimes(
                    QualifiedIdent::new_static(name, None, first.clone()),
                    QualifiedIdent::new_static(name, None, range.clone()),
                )))
                .unwrap();
                failed = true;
            }
        }

        if !failed {
            for (name, range) in names {
                self.storage.entries.insert(name, (range, module_id));
            }
        }

        failed
    }

    fn collect_resources(&mut self, root: usize, modules: &mut FxHashMap<usize, Rc<Resource>>) {
        if !modules.contains_key(&root) {
            let resource = self.storage.resources.get(&root).unwrap().clone();
            modules.insert(root, resource);
            for child in &self.storage.graph.get(&root).unwrap().children.clone() {
                self.collect_resources(*child, modules);
            }
        }
    }

    pub fn get_id_by_path(&mut self, path: &PathBuf) -> Option<usize> {
        self.handler.get_id_by_path(path)
    }

    pub fn check_module(&mut self, module_id: usize) -> Option<()> {
        let mut added = Vec::new();

        let failed = self.compile_module(module_id, &mut added);

        if !failed {
            let mut resources = Default::default();
            self.collect_resources(module_id, &mut resources);

            let mut concrete_book = Book::default();
            for module in resources.values() {
                add_module_to_book(&mut concrete_book, &module.concrete_tree)
            }

            let (rx, tx) = std::sync::mpsc::channel();
            let desugared_book = desugar::desugar_book(rx.clone(), &concrete_book)?;

            let changed_functions = added
                .iter()
                .map(|x| {
                    resources
                        .get(x)
                        .unwrap()
                        .exposed_entries
                        .iter()
                        .cloned()
                        .collect::<Vec<_>>()
                })
                .flatten()
                .collect::<Vec<_>>();

            kind_checker::type_check(&desugared_book, rx.clone(), changed_functions);

            let entrypoints = FxHashSet::from_iter(["Main".to_string()]);

            erasure::erase_book(&desugared_book, rx.clone(), entrypoints)?;

            let errs = tx.try_iter().collect::<Vec<_>>();

            let mut groups = FxHashMap::default();

            for err in errs {
                if let Some(ctx) = err.get_syntax_ctx() {
                    let res: &mut Vec<_> = groups.entry(ctx).or_default();
                    res.push(err);
                }
            }

            for (ctx, errs) in groups {
                self.handler.on_errors(self.storage, ctx.0, errs)
            }
        }

        Some(())
    }

    pub fn init_project(&mut self, path: PathBuf) -> usize {
        let input = fs::read_to_string(&path).unwrap();
        self.register_module(path, "Main".to_string(), input)
    }

    fn compile_module(&mut self, module_id: usize, added: &mut Vec<usize>) -> bool {
        let file = self.storage.files.get(&module_id).unwrap();
        let hash = file.hash;

        if let Some(node) = self.storage.graph.get(&module_id) {
            if !node.invalidated && node.hash == file.hash {
                return false;
            }
        }

        let (rx, tx) = std::sync::mpsc::channel();

        // Parses the "module"
        let (mut module, mut failed) = kind_parser::parse_book(rx.clone(), module_id, &file.input);

        // Expand aliases
        failed |= expand::uses::expand_uses(&mut module, rx.clone());

        // Collects all of the unbound variables and top level
        // in order to recursively get all of the unbound files.
        let state = unbound::collect_module_info(rx.clone(), &mut module, false);

        let module_definitions = state.top_level_defs.clone();

        let last_names = if let Some(res) = self.storage.resources.get(&module_id) {
            res.exposed_entries.clone()
        } else {
            FxHashSet::default()
        };

        let mut diff = module_definitions.clone();

        for name in last_names {
            diff.remove(&name);
        }

        failed |= self.register_names(rx.clone(), diff, module_id);

        if !failed {
            let mut nodes = FxHashSet::default();

            for (_, idents) in state.unbound_top_level {
                let first = idents.iter().last().unwrap();
                let result = self.register_new_module(rx.clone(), &first);
                failed |= result.is_fail();
                failed |= match result {
                    Resolution::Reuse(id) => {
                        added.push(id);
                        nodes.insert(id);
                        self.compile_module(id, added)
                    }
                    Resolution::Added(id) => {
                        let file = self.storage.files.get(&id).unwrap();
                        added.push(id);
                        nodes.insert(id);
                        self.compile_module(id, added)
                    }
                    Resolution::Fail => true,
                };
            }

            let node = self.storage.graph.get_mut(&module_id).unwrap();
            node.hash = hash;
            node.failed = false;

            let removed = node
                .children
                .difference(&nodes)
                .cloned()
                .collect::<Vec<_>>();

            let added = nodes
                .difference(&node.children)
                .cloned()
                .collect::<Vec<_>>();

            node.children.extend(nodes);

            for id in added {
                self.storage.graph.connect(module_id, id)
            }

            for id in removed {
                self.remove_node(id)
            }
        }

        let errs = tx.try_iter().collect::<Vec<_>>();

        let node = self.storage.graph.get_mut(&module_id).unwrap();
        node.failed = failed;

        if errs.is_empty() {
            self.storage.resources.insert(
                module_id,
                Rc::new(Resource {
                    concrete_tree: module,
                    exposed_entries: FxHashSet::from_iter(module_definitions.keys().cloned()),
                }),
            );
        }

        self.handler.on_errors(self.storage, module_id, errs);

        failed
    }
}
