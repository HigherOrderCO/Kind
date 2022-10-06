use std::collections::HashMap;
use std::fmt::{Display, Error, Formatter};

use expr::Expr;
use kind_span::{Span, SyntaxCtxIndex};
use symbol::Ident;
use visitor::Visitor;

pub mod expr;
pub mod symbol;
pub mod visitor;

/// A value of a attribute
#[derive(Clone, Debug)]
pub enum AttributeStyle {
    Ident(Ident),
    String(String),
    Number(Span, u64),
}

/// A attribute is a kind of declaration
/// that usually is on the top of a declaration
/// and can be attached to a function declaration
/// it express some compiler properties
#[derive(Clone, Debug)]
pub struct Attribute {
    pub name: Ident,
    pub value: Option<AttributeStyle>,
    pub span: Span,
}

/// An argument is a 'binding' of a name to a type
/// it has some other options like
/// eras: that express the erasure of this type when
/// compiled.
/// hide: that express a implicit argument (that will
/// be discovered through unification).
#[derive(Clone, Debug)]
pub struct Argument {
    pub hidden: bool,
    pub erased: bool,
    pub name: Ident,
    pub tipo: Box<Expr>,
    pub span: Span,
}

/// A rule is a equation that in the left-hand-side
/// contains a list of patterns @pats@ and on the
/// right hand side a value.
#[derive(Clone, Debug)]
pub struct Rule {
    pub name: Ident,
    pub pats: Vec<Box<Expr>>,
    pub body: Box<Expr>,
    pub span: Span,
}

/// An entry describes a function that is typed
/// and has rules. The type of the function
/// consists of the arguments @args@ and the
/// return type @tipo@.
#[derive(Clone, Debug)]
pub struct Entry {
    pub name: Ident,
    pub docs: Option<String>,
    pub args: Vec<Box<Argument>>,
    pub tipo: Box<Expr>,
    pub rules: Vec<Box<Rule>>,
    pub attrs: Vec<Attribute>,
    pub span: Span,
}

// A book is a collection of entries.
#[derive(Clone, Debug, Default)]
pub struct Book {
    pub names: Vec<Ident>,
    pub entrs: HashMap<String, Box<Entry>>,
    pub holes: u64,
}

// Display

impl Display for Book {
    fn fmt(&self, f: &mut Formatter<'_>) -> Result<(), Error> {
        for name in &self.names {
            writeln!(f, "{}\n", self.entrs.get(&name.data.0).unwrap())?;
        }
        Ok(())
    }
}

impl Display for Argument {
    fn fmt(&self, f: &mut Formatter<'_>) -> Result<(), Error> {
        let (open, close) = match (self.erased, self.hidden) {
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

impl Display for Rule {
    fn fmt(&self, f: &mut Formatter<'_>) -> Result<(), Error> {
        write!(f, "{}", self.name)?;
        for pat in &self.pats {
            write!(f, " {}", pat)?;
        }
        write!(f, " = {}", self.body)
    }
}
