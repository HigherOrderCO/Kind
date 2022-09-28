use std::path::{PathBuf};

use crate::book::name::Ident;
use crate::book::{Argument, Entry};

#[derive(Clone, Debug)]
pub enum NewType {
    Sum(SumType),
    Prod(ProdType)
}

#[derive(Clone, Debug)]
pub struct SumType {
    pub name: Ident,
    pub pars: Vec<Box<Argument>>,
    pub ctrs: Vec<Box<Constructor>>,
}

#[derive(Clone, Debug)]
pub struct ProdType {
    pub name: Ident,
    pub pars: Vec<Box<Argument>>,
    pub fields: Vec<Box<Argument>>,
}

#[derive(Clone, Debug)]
pub struct Constructor {
    pub name: Ident,
    pub args: Vec<Box<Argument>>,
}

#[derive(Clone, Debug)]
pub struct Derived {
    pub path: PathBuf,
    pub entr: Entry,
}
