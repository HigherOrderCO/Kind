use std::fmt::{Display, Error, Formatter};

use crate::symbol::Ident;
use expr::Expr;
use kind_span::{Locatable, Range};

use self::pat::Pat;

pub mod expr;
pub mod pat;
pub mod visitor;

/// A value of a attribute
#[derive(Clone, Debug)]
pub enum AttributeStyle {
    Ident(Range, Ident),
    String(Range, String),
    Number(Range, u64),
    List(Range, Vec<AttributeStyle>),
}

/// A attribute is a kind of declaration
/// that usually is on the top of a declaration
/// and can be attached to a function declaration
/// it express some compiler properties
#[derive(Clone, Debug)]
pub struct Attribute {
    pub name: Ident,
    pub value: Option<AttributeStyle>,
    pub range: Range,
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
    pub tipo: Option<Box<Expr>>,
    pub range: Range,
}

/// A rule is a equation that in the left-hand-side
/// contains a list of patterns @pats@ and on the
/// right hand side a value.
#[derive(Clone, Debug)]
pub struct Rule {
    pub name: Ident,
    pub pats: Vec<Box<Pat>>,
    pub body: Box<Expr>,
    pub range: Range,
}

/// An entry describes a function that is typed
/// and has rules. The type of the function
/// consists of the arguments @args@ and the
/// return type @tipo@.
#[derive(Clone, Debug)]
pub struct Entry {
    pub name: Ident,
    pub docs: Vec<String>,
    pub args: Vec<Argument>,
    pub tipo: Box<Expr>,
    pub rules: Vec<Box<Rule>>,
    pub range: Range,
    pub attrs: Vec<Attribute>,
}

/// Type declaration that can be either a record or a sum type

#[derive(Clone, Debug)]
pub struct Constructor {
    pub name: Ident,
    pub docs: Vec<String>,
    pub args: Vec<Argument>,
    pub typ: Option<Box<Expr>>,
}

#[derive(Clone, Debug)]
pub struct SumTypeDecl {
    pub name: Ident,
    pub docs: Vec<String>,
    pub parameters: Vec<Argument>,
    pub indices: Vec<Argument>,
    pub constructors: Vec<Constructor>,
    pub attrs: Vec<Attribute>,
}

#[derive(Clone, Debug)]
pub struct RecordDecl {
    pub name: Ident,
    pub docs: Vec<String>,
    pub constructor: Ident,
    pub parameters: Vec<Argument>,
    pub indices: Vec<Argument>,
    pub fields: Vec<(Ident, Vec<String>, Box<Expr>)>,
    pub attrs: Vec<Attribute>,
}

#[derive(Clone, Debug)]
pub enum TopLevel {
    SumType(SumTypeDecl),
    RecordType(RecordDecl),
    Entry(Entry),
}

// A book is a collection of entries.
#[derive(Clone, Debug, Default)]
pub struct Book {
    pub entries: Vec<TopLevel>,
}

// Display

impl Display for Constructor {
    fn fmt(&self, f: &mut Formatter<'_>) -> Result<(), Error> {
        for doc in &self.docs {
            writeln!(f, "  /// {}", doc)?;
        }
        write!(f, "{}", self.name)?;
        for arg in &self.args {
            write!(f, " {}", arg)?;
        }
        if let Some(res) = &self.typ {
            write!(f, " : {}", res)?;
        }
        Ok(())
    }
}

impl Display for Book {
    fn fmt(&self, f: &mut Formatter<'_>) -> Result<(), Error> {
        for entr in &self.entries {
            match entr {
                TopLevel::SumType(sum) => {
                    for doc in &sum.docs {
                        writeln!(f, "/// {}", doc)?;
                    }
                    for attr in &sum.attrs {
                        writeln!(f, "{}", attr)?;
                    }
                    write!(f, "type {}", sum.name)?;
                    for arg in &sum.parameters {
                        write!(f, " {}", arg)?;
                    }
                    if sum.indices.len() > 0 {
                        write!(f, " ~")?;
                    }
                    for arg in &sum.indices {
                        write!(f, " {}", arg)?;
                    }
                    writeln!(f, " {{")?;
                    for cons in &sum.constructors {
                        writeln!(f, "  {},", cons)?;
                    }
                    writeln!(f, "}}\n")?;
                }
                TopLevel::RecordType(rec) => {
                    for doc in &rec.docs {
                        writeln!(f, "/// {}", doc)?;
                    }
                    for attr in &rec.attrs {
                        writeln!(f, "{}", attr)?;
                    }
                    write!(f, "record {}", rec.name)?;
                    for arg in &rec.parameters {
                        write!(f, " {}", arg)?;
                    }
                    if rec.indices.len() > 0 {
                        write!(f, " ~")?;
                    }
                    for arg in &rec.indices {
                        write!(f, " {}", arg)?;
                    }
                    writeln!(f, " {{")?;
                    for (name, docs, cons) in &rec.fields {
                        for doc in docs {
                            writeln!(f, "  /// {}", doc)?;
                        }
                        writeln!(f, "  {}: {}, ", name, cons)?;
                    }
                    writeln!(f, "}}\n")?;
                }
                TopLevel::Entry(entr) => writeln!(f, "{}\n", entr)?,
            }
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
        match &self.tipo {
            Some(tipo) => write!(f, "{}{}: {}{}", open, self.name, tipo, close),
            None => write!(f, "{}{}{}", open, self.name, close),
        }
    }
}

impl Display for Entry {
    fn fmt(&self, f: &mut Formatter<'_>) -> Result<(), Error> {
        for doc in &self.docs {
            writeln!(f, "/// {}", doc)?;
        }

        for attr in &self.attrs {
            writeln!(f, "{}", attr)?;
        }

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

impl Display for AttributeStyle {
    fn fmt(&self, f: &mut Formatter<'_>) -> Result<(), Error> {
        match self {
            AttributeStyle::Ident(_, i) => write!(f, "{}", i),
            AttributeStyle::String(_, s) => write!(f, "{:?}", s),
            AttributeStyle::Number(_, n) => write!(f, "{}", n),
            AttributeStyle::List(_, l) => write!(
                f,
                "[{}]",
                l.iter()
                    .map(|x| format!("{}", x))
                    .collect::<Vec<String>>()
                    .join(", ")
            ),
        }
    }
}

impl Display for Attribute {
    fn fmt(&self, f: &mut Formatter<'_>) -> Result<(), Error> {
        write!(f, "#{}", self.name)?;
        if let Some(res) = &self.value {
            write!(f, " = {}", res)?;
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

impl Locatable for AttributeStyle {
    fn locate(&self) -> Range {
        match self {
            AttributeStyle::Ident(r, _) => r.clone(),
            AttributeStyle::String(r, _) => r.clone(),
            AttributeStyle::Number(r, _) => r.clone(),
            AttributeStyle::List(r, _) => r.clone(),
        }
    }
}
