/// Expands sum type and record definitions to a lot of
/// helper definitions like eliminators and replace qualified identifiers
/// by their module names.

use std::sync::mpsc::Sender;
use fxhash::FxHashMap;
use kind_report::data::DiagnosticFrame;
use kind_tree::concrete::{visitor::Visitor, Module};

use crate::errors::PassError;

pub struct Expand {
    pub names: FxHashMap<String, String>,
    pub errors: Sender<DiagnosticFrame>,
    pub failed: bool
}

impl Visitor for Expand {
    fn visit_qualified_ident(&mut self, ident: &mut kind_tree::symbol::QualifiedIdent) {
        if ident.aux.is_none() {
            return;
        }
        let alias = match self.names.get(&ident.root.to_string()) {
            Some(path) => path,
            None => {
                self.errors.send(PassError::CannotFindAlias(ident.root.to_string(), ident.range).into()).unwrap();
                self.failed = true;
                return;
            }
        };
        match &ident.aux {
            Some(post) => {
                ident.change_root(format!("{}.{}", alias, post));
                ident.aux = None;
            }
            None => ident.change_root(alias.clone()),
        }
    }
}

pub fn expand_uses(module: &mut Module, errors: Sender<DiagnosticFrame>) -> bool {
    let mut session = Expand {
        names: module.uses.clone(),
        errors,
        failed: false
    };
    for entry in module.entries.iter_mut() {
        session.visit_top_level(entry)
    }
    session.failed
}
