use std::{
    collections::HashMap,
    fmt::{Display, Error, Formatter},
};

use kind_span::{Span, Range};

use crate::{symbol::Ident, Operator};

pub type Spine = Vec<Box<Expr>>;

#[derive(Clone, Debug)]
pub enum ExprKind {
    /// Name of a variable
    Var(Ident),
    /// The dependent function space (e.g. (x : Int) -> y)
    All(Option<Ident>, Box<Expr>, Box<Expr>),
    /// A anonymous function that receives one argument
    Lambda(Ident, Box<Expr>),
    /// Application of a expression to a spine of expressions
    App(Box<Expr>, Spine),
    /// Application of a function
    Fun(Ident, Spine),
    /// Application of a Construtor
    Ctr(Ident, Spine),
    /// Declaration of a local variable
    Let(Ident, Box<Expr>, Box<Expr>),
    /// Type ascription (x : y)
    Ann(Box<Expr>, Box<Expr>),
    /// Type Literal
    Typ,
    ///  U60 Type
    U60,
    /// Number literal
    Num(u64),
    /// Binary operation (e.g. 2 + 3)
    Binary(Operator, Box<Expr>, Box<Expr>),
    /// A expression open to unification (e.g. _)
    Hole(u64),
    /// Help
    Hlp(Ident),
    /// Error node
    Err,
}

#[derive(Clone, Debug)]
pub struct Expr {
    pub data: ExprKind,
    pub span: Span,
}

impl Expr {
    pub fn generate_expr(data: ExprKind) -> Expr {
        Expr {
            data,
            span: Span::Generated,
        }
    }
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
    pub args: Vec<Argument>,
    pub tipo: Box<Expr>,
    pub rules: Vec<Rule>,
    pub span: Span,
}

// A book is a collection of entries.
#[derive(Clone, Debug, Default)]
pub struct Glossary {
    pub names: Vec<Ident>,
    pub entrs: HashMap<String, Box<Entry>>,
    pub holes: u64,
}

// Display

impl Expr {
    pub fn new_var(name: Ident) -> Expr {
        Expr {
            span: Span::Generated,
            data: ExprKind::Var(name),
        }
    }

    pub fn traverse_pi_types(&self) -> String {
        match &self.data {
            ExprKind::All(binder, typ, body) => match binder {
                None => format!("{} -> {}", typ, body.traverse_pi_types()),
                Some(binder) => format!("({} : {}) -> {}", binder, typ, body.traverse_pi_types()),
            },
            _ => format!("{}", self),
        }
    }
}

impl Display for Expr {
    fn fmt(&self, f: &mut Formatter<'_>) -> Result<(), Error> {
        use ExprKind::*;
        match &self.data {
            Typ => write!(f, "Type"),
            U60 => write!(f, "U60"),
            Num(n) => write!(f, "{}", n),
            All(_, _, _) => write!(f, "({})", self.traverse_pi_types()),
            Var(name) => write!(f, "{}", name),
            Lambda(binder, body) => write!(f, "({} => {})", binder, body),
            App(head, spine) => write!(
                f,
                "({}{})",
                head,
                spine.iter().map(|x| format!(" {}", x)).collect::<String>()
            ),
            Fun(head, spine) | Ctr(head, spine) => write!(
                f,
                "({}{})",
                head,
                spine.iter().map(|x| format!(" {}", x)).collect::<String>()
            ),
            Let(name, expr, body) => write!(f, "(let {} = {}; {})", name, expr, body),
            Ann(expr, typ) => write!(f, "({} : {})", expr, typ),
            Binary(op, expr, typ) => write!(f, "({} {} {})", op, expr, typ),
            Hole(_) => write!(f, "_"),
            Hlp(name) => write!(f, "?{}", name),
            Err => write!(f, "ERR"),
        }
    }
}

impl Display for Glossary {
    fn fmt(&self, f: &mut Formatter<'_>) -> Result<(), Error> {
        for name in &self.names {
            writeln!(f, "{}\n", self.entrs.get(&name.data.0).expect(&name.data.0))?;
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
        write!(f, "{}{}: {}{}", open, self.name, self.tipo, close)
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

impl Argument {
    pub fn to_irrelevant(&self) -> Argument {
        Argument {
            hidden: true,
            erased: true,
            name: self.name.clone(),
            tipo: self.tipo.clone(),
            span: self.span,
        }
    }

    pub fn from_field(name: &Ident, tipo: Box<Expr>, range: Range) -> Argument {
        Argument {
            hidden: false,
            erased: false,
            name: name.clone(),
            tipo,
            span: Span::Locatable(range),
        }
    }
}
