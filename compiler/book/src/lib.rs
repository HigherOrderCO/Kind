// The location of things inside the source code
pub mod span;

// Description of all the terms inside the language
pub mod term;

// Types of names.
pub mod name;

use crate::term::Term;
use crate::span::Span;
use crate::name::Qualified;

use std::collections::HashMap;
use std::fmt::{Display, Error, Formatter};

// A book is a collection of entries.
#[derive(Clone, Debug)]
pub struct Book {
  pub names: Vec<String>,
  pub entrs: HashMap<Qualified, Box<Entry>>,
  pub holes: u64,
}

// A entry describes a function that has
// rules and a type.
#[derive(Clone, Debug)]
pub struct Entry {
  pub name: Qualified,
  pub orig: Span,
  pub kdln: Option<String>,
  pub args: Vec<Box<Argument>>,
  pub tipo: Box<Term>,
  pub rules: Vec<Box<Rule>>
}

#[derive(Clone, Debug)]
pub struct Rule {
  pub orig: Span,
  pub name: Qualified,
  pub pats: Vec<Box<Term>>,
  pub body: Box<Term>,
}

#[derive(Clone, Debug)]
pub struct Argument {
  pub hide: bool,
  pub eras: bool,
  pub name: String,
  pub tipo: Box<Term>,
}

impl Entry {
    pub fn count_implicits(&self) -> (usize, usize) {
        let mut hiddens = 0;
        let mut eraseds = 0;
        for arg in &self.args {
          if arg.hide {
            hiddens = hiddens + 1;
          }
          if arg.eras {
            eraseds = eraseds + 1;
          }
        }
        (hiddens, eraseds)
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
            (false, true ) => ("+<", ">"),
            (true , false) => ("-(", ")"),
            (true , true ) => ("<", ">"),
        };
        write!(f, "{}{}: {}{}", open, self.name, &self.tipo, close)
    }
}

impl Display for Entry {
    fn fmt(&self, f: &mut Formatter<'_>) -> Result<(), Error> {
        if let Some(kdln) = &self.kdln {
            write!(f, "{} #{}", self.name, kdln)?
        } else {
            write!(f, "{}", self.name.clone())?
        };

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
          write!(f, "{}\n", self.entrs.get(&Qualified::from_str(name)).unwrap())?;
        }
        Ok(())
    }
}