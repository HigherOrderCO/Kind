// The location of things inside the source code
pub mod span;

// Description of all the terms inside the language
pub mod term;

// Types of names.
pub mod name;

// Types of names.
pub mod new_type;

use crate::book::name::Ident;
use crate::book::span::{FileOffset, Localized, Span};
use crate::book::term::Term;

use std::collections::HashMap;
use std::fmt::{Display, Error, Formatter};

#[derive(Clone, Debug)]
pub struct Attribute {
    pub name: Ident,
    pub value: Option<Ident>,
    pub orig: Span
}

// A book is a collection of entries.
#[derive(Clone, Debug, Default)]
pub struct Book {
    pub names: Vec<Ident>,
    pub entrs: HashMap<Ident, Box<Entry>>,
    pub holes: u64,
}

// A entry describes a function that has
// rules and a type.
#[derive(Clone, Debug)]
pub struct Entry {
    pub name: Ident,
    pub orig: Span,
    pub args: Vec<Box<Argument>>,
    pub tipo: Box<Term>,
    pub rules: Vec<Box<Rule>>,
    pub attrs: Vec<Attribute>
}

#[derive(Clone, Debug)]
pub struct Rule {
    pub orig: Span,
    pub name: Ident,
    pub pats: Vec<Box<Term>>,
    pub body: Box<Term>,
}

#[derive(Clone, Debug)]
pub struct Argument {
    pub hide: bool,
    pub orig: Span,
    pub eras: bool,
    pub name: Ident,
    pub tipo: Box<Term>,
}

impl Book {
    pub fn set_origin_file(&mut self, file: FileOffset) {
        for entr in self.entrs.values_mut() {
            entr.set_origin_file(file);
        }
    }
}

// Some constructors that are really useful.
impl Argument {
    pub fn new_hidden(name: Ident, tipo: Box<Term>) -> Argument {
        Argument {
            hide: true,
            orig: Span::Generated,
            eras: true,
            name,
            tipo
        }
    }

    pub fn new_accessible(name: Ident, tipo: Box<Term>) -> Argument {
        Argument {
            hide: false,
            orig: Span::Generated,
            eras: false,
            name,
            tipo
        }
    }

    pub fn new_erased(name: Ident, tipo: Box<Term>) -> Argument {
        Argument {
            hide: false,
            orig: Span::Generated,
            eras: true,
            name,
            tipo
        }
    }
}

impl Entry {
    pub fn count_implicits(&self) -> (usize, usize) {
        let mut hiddens = 0;
        let mut eraseds = 0;
        for arg in &self.args {
            if arg.hide {
                hiddens += 1;
            }
            if arg.eras {
                eraseds += 1;
            }
        }
        (hiddens, eraseds)
    }

    pub fn get_attribute(&self, name: &str) -> Option<Attribute> {
        for attr in &self.attrs {
            if attr.name.0 == name {
                return Some(attr.clone())
            }
        }
        None
    }

    pub fn new_type_signature(name: Ident, args: Vec<Box<Argument>>) -> Entry {
        Entry {
            name,
            orig: Span::Generated,
            args,
            tipo: Box::new(Term::Typ { orig: Span::Generated }),
            rules: Vec::new(),
            attrs: vec![]
        }
    }
}

impl Display for Rule {
    fn fmt(&self, f: &mut Formatter<'_>) -> Result<(), Error> {
        write!(f, "{}", self.name)?;
        for pat in &self.pats {
            write!(f, " {}", pat)?;
        }
        write!(f, " = {}", self.body)
    }
}

impl Display for Argument {
    fn fmt(&self, f: &mut Formatter<'_>) -> Result<(), Error> {
        let (open, close) = match (self.eras, self.hide) {
            (false, false) => ("(", ")"),
            (false, true) => ("+<", ">"),
            (true, false) => ("-(", ")"),
            (true, true) => ("<", ">"),
        };
        write!(f, "{}{}: {}{}", open, self.name, &self.tipo, close)
    }
}

impl Display for Entry {
    fn fmt(&self, f: &mut Formatter<'_>) -> Result<(), Error> {
        write!(f, "{}", self.name.clone())?;

        for arg in &self.args {
            write!(f, " {}", arg)?;
        }

        write!(f, " : {}", &self.tipo)?;

        for rule in &self.rules {
            write!(f, "\n{}", rule)?
        }

        Ok(())
    }
}

impl Display for Book {
    fn fmt(&self, f: &mut Formatter<'_>) -> Result<(), Error> {
        for name in &self.names {
            writeln!(f, "{}\n", self.entrs.get(&name).unwrap())?;
        }
        Ok(())
    }
}

impl Localized for Rule {
    fn get_origin(&self) -> Span {
        self.orig
    }

    fn set_origin_file(&mut self, file: FileOffset) {
        self.orig = self.orig.set_file(file);
        for pat in &mut self.pats {
            pat.set_origin_file(file);
        }
        self.body.set_origin_file(file);
    }
}

impl Localized for Entry {
    fn get_origin(&self) -> Span {
        self.orig
    }

    fn set_origin_file(&mut self, file: FileOffset) {
        self.orig = self.orig.set_file(file);
        for arg in &mut self.args {
            arg.set_origin_file(file);
        }
        for rule in &mut self.rules {
            rule.set_origin_file(file);
        }
        self.tipo.set_origin_file(file);
    }
}

impl Localized for Argument {
    fn get_origin(&self) -> Span {
        self.orig
    }

    fn set_origin_file(&mut self, file: FileOffset) {
        self.tipo.set_origin_file(file);
    }
}
