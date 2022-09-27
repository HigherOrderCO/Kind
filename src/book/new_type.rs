use crate::book::name::Ident;
use crate::book::{Argument, Entry};

#[derive(Clone, Debug)]
pub enum NewType {
    Sum(SumType),
}

#[derive(Clone, Debug)]
pub struct SumType {
    pub name: Ident,
    pub pars: Vec<Box<Argument>>,
    pub ctrs: Vec<Box<Constructor>>,
}

#[derive(Clone, Debug)]
pub struct Constructor {
    pub name: Ident,
    pub args: Vec<Box<Argument>>,
}

#[derive(Clone, Debug)]
pub struct Derived {
    pub path: Ident,
    pub entr: Entry,
}
