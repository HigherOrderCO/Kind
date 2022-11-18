use core::fmt;
use std::{io, path::PathBuf, collections::HashMap};

use kind_query::{SessionHandler, Storage, Session};
use kind_report::{report::{FileCache, Report}, RenderConfig, data::Diagnostic};

struct ToWriteFmt<T>(pub T);

impl<T> fmt::Write for ToWriteFmt<T>
where
    T: io::Write,
{
    fn write_str(&mut self, s: &str) -> fmt::Result {
        self.0.write_all(s.as_bytes()).map_err(|_| fmt::Error)
    }
}

pub fn render_to_stderr<T, E>(render_config: &RenderConfig, session: &T, err: &E)
where
    T: FileCache,
    E: Report,
{
    Report::render(
        err,
        session,
        render_config,
        &mut ToWriteFmt(std::io::stderr()),
    )
    .unwrap();
}

pub struct WatchServer<'a> {
    config: RenderConfig<'static>,
    mapper: &'a mut HashMap<PathBuf, usize>,
    inverse: &'a mut HashMap<usize, PathBuf>,
}

impl<'a> SessionHandler for WatchServer<'a> {
    fn on_errors(&mut self, storage: &Storage, _uri: usize, errs: Vec<Box<dyn Diagnostic>>) {
        for err in errs {
            render_to_stderr(&self.config, storage, &err)
        }
    }

    fn on_add_file(&mut self, file: PathBuf, id: usize) {
        println!("File added {:?} ~ {:?}", file.clone(), id);
        self.mapper.insert(file.clone(), id);
        self.inverse.insert(id, file);
    }

    fn on_rem_file(&mut self, id: usize) {
        println!("File remove {:?}", id);
        if let Some(res) = self.inverse.remove(&id) {
            self.mapper.remove(&res);
        }
    }

    fn get_id_by_path(&mut self, path: &PathBuf) -> Option<usize> {
        self.mapper.get(path).cloned()
    }
}

pub fn watch_session(root: PathBuf, path: PathBuf, config: RenderConfig<'static>) {

    let mut mapper = Default::default();
    let mut inverse = Default::default();

    let mut handler = WatchServer { config, mapper: &mut mapper, inverse: &mut inverse };
    let mut storage = Storage::default();
    let mut session = Session::new(&mut handler, &mut storage, root);

    let main = session.init_project(path);

    session.check_module(main);

    let id = session.get_id_by_path(&PathBuf::from("./D.kind2")).unwrap();
    
    session.remove_node(id);

    for (place, node) in &session.storage.graph.nodes {
        println!("{} = {:?}", place, node)
    }

    session.check_module(main);

}