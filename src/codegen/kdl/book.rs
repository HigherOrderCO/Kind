use crate::book::name::Ident;
use crate::book::term::Operator;
use crate::book::Attribute;

use std::collections::HashMap;

#[derive(Clone, Debug)]
pub enum CompTerm {
    Var {
        name: Ident,
    },
    Lam {
        name: Ident,
        body: Box<CompTerm>,
    },
    App {
        func: Box<CompTerm>,
        argm: Box<CompTerm>,
    },
    Dup {
        nam0: Ident,
        nam1: Ident,
        expr: Box<CompTerm>,
        body: Box<CompTerm>,
    },
    Let {
        name: Ident,
        expr: Box<CompTerm>,
        body: Box<CompTerm>,
    },
    Ctr {
        name: Ident,
        args: Vec<Box<CompTerm>>,
    },
    Fun {
        name: Ident,
        args: Vec<Box<CompTerm>>,
    },
    Num {
        numb: u128,
    },
    Op2 {
        oper: Operator,
        val0: Box<CompTerm>,
        val1: Box<CompTerm>,
    },
    Nil,
}

#[derive(Clone, Debug)]
pub struct CompRule {
    pub name: Ident,
    pub pats: Vec<Box<CompTerm>>,
    pub body: Box<CompTerm>,
}

#[derive(Clone, Debug)]
pub struct CompEntry {
    pub name: Ident,
    pub args: Vec<Ident>,
    pub rules: Vec<CompRule>,
    pub attrs: Vec<Attribute>,
    pub orig: bool,
}

#[derive(Clone, Debug)]
pub struct CompBook {
    pub names: Vec<Ident>,
    pub entrs: HashMap<Ident, CompEntry>,
}

impl CompEntry {
    pub fn get_attribute(&self, name: &str) -> Option<Attribute> {
        for attr in &self.attrs {
            if attr.name.0 == name {
                return Some(attr.clone());
            }
        }
        None
    }
}
