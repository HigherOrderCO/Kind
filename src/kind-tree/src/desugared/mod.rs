//! This module describes an unsugared tree that
//! is used by the type checker and by the targets.

use std::fmt::{Display, Error, Formatter};

use fxhash::FxHashMap;
use kind_span::{Range, Span};
use linked_hash_map::LinkedHashMap;

use crate::{
    symbol::{Ident, QualifiedIdent},
    Operator,
};

/// Just a vector of expressions. It is called spine because
/// it is usually in a form like (a b c d e) that can be interpret
/// as ((((a b) c) d) e) that looks like a spine.
pub type Spine = Vec<Box<Expr>>;

#[derive(Clone, Debug, Hash, PartialEq, Eq)]
pub struct AppBinding {
    pub data: Box<Expr>,
    pub erased: bool,
}

#[derive(Clone, Debug, Hash, PartialEq, Eq)]
pub enum ExprKind {
    /// Name of a variable
    Var(Ident),
    /// The dependent function space (e.g. (x : Int) -> y)
    All(Ident, Box<Expr>, Box<Expr>),
    /// A anonymous function that receives one argument
    Lambda(Ident, Box<Expr>, bool),
    /// Application of a expression to a spine of expressions
    App(Box<Expr>, Vec<AppBinding>),
    /// Application of a function
    Fun(QualifiedIdent, Spine),
    /// Application of a Construtor
    Ctr(QualifiedIdent, Spine),
    /// Declaration of a local variable
    Let(Ident, Box<Expr>, Box<Expr>),
    /// Type ascription (x : y)
    Ann(Box<Expr>, Box<Expr>),
    /// Substitution
    Sub(Ident, usize, usize, Box<Expr>),
    /// Type Literal
    Typ,
    /// Primitive numeric types
    NumType(crate::NumType),
    /// Primitive numeric values
    Num(crate::Number),
    /// Very special constructor :)
    Str(String),
    /// Binary operation (e.g. 2 + 3)
    Binary(Operator, Box<Expr>, Box<Expr>),
    /// A expression open to unification (e.g. _)
    Hole(u64),
    /// Help
    Hlp(Ident),
    /// Error node (It's useful as a sentinel value
    /// to be able to continue compilation even with
    /// parts of the tree with problems)
    Err,
}

#[derive(Clone, Debug, Hash, PartialEq, Eq)]
pub struct Expr {
    pub data: ExprKind,
    pub span: Span,
}

impl Expr {
    pub fn generate_expr(data: ExprKind) -> Box<Expr> {
        Box::new(Expr {
            data,
            span: Span::Generated,
        })
    }

    pub fn var(ident: Ident) -> Box<Expr> {
        Box::new(Expr {
            span: Span::Locatable(ident.range),
            data: ExprKind::Var(ident),
        })
    }

    pub fn all(range: Range, ident: Ident, typ: Box<Expr>, body: Box<Expr>) -> Box<Expr> {
        Box::new(Expr {
            span: Span::Locatable(range),
            data: ExprKind::All(ident, typ, body),
        })
    }

    pub fn sub(range: Range, ident: Ident, idx: usize, rdx: usize, body: Box<Expr>) -> Box<Expr> {
        Box::new(Expr {
            span: Span::Locatable(range),
            data: ExprKind::Sub(ident, idx, rdx, body),
        })
    }

    pub fn lambda(range: Range, ident: Ident, body: Box<Expr>, erased: bool) -> Box<Expr> {
        Box::new(Expr {
            span: Span::Locatable(range),
            data: ExprKind::Lambda(ident, body, erased),
        })
    }

    pub fn identity_lambda(ident: Ident) -> Box<Expr> {
        Box::new(Expr {
            span: Span::Generated,
            data: ExprKind::Lambda(ident.clone(), Self::var(ident), false),
        })
    }

    pub fn unfold_lambda(irrelev: &[bool], idents: &[Ident], body: Box<Expr>) -> Box<Expr> {
        idents
            .iter()
            .rev()
            .zip(irrelev)
            .fold(body, |body, (ident, irrelev)| {
                Expr::lambda(ident.range, ident.clone(), body, *irrelev)
            })
    }

    pub fn app(range: Range, ident: Box<Expr>, spine: Vec<AppBinding>) -> Box<Expr> {
        Box::new(Expr {
            span: Span::Locatable(range),
            data: ExprKind::App(ident, spine),
        })
    }

    pub fn fun(range: Range, head: QualifiedIdent, spine: Vec<Box<Expr>>) -> Box<Expr> {
        Box::new(Expr {
            span: Span::Locatable(range),
            data: ExprKind::Fun(head, spine),
        })
    }

    pub fn ctr(range: Range, head: QualifiedIdent, spine: Vec<Box<Expr>>) -> Box<Expr> {
        Box::new(Expr {
            span: Span::Locatable(range),
            data: ExprKind::Ctr(head, spine),
        })
    }

    pub fn let_(range: Range, ident: Ident, val: Box<Expr>, body: Box<Expr>) -> Box<Expr> {
        Box::new(Expr {
            span: Span::Locatable(range),
            data: ExprKind::Let(ident, val, body),
        })
    }

    pub fn ann(range: Range, val: Box<Expr>, typ: Box<Expr>) -> Box<Expr> {
        Box::new(Expr {
            span: Span::Locatable(range),
            data: ExprKind::Ann(val, typ),
        })
    }

    pub fn typ(range: Range) -> Box<Expr> {
        Box::new(Expr {
            span: Span::Locatable(range),
            data: ExprKind::Typ,
        })
    }

    pub fn u60(range: Range) -> Box<Expr> {
        Box::new(Expr {
            span: Span::Locatable(range),
            data: ExprKind::NumType(crate::NumType::U60),
        })
    }

    pub fn u120(range: Range) -> Box<Expr> {
        Box::new(Expr {
            span: Span::Locatable(range),
            data: ExprKind::NumType(crate::NumType::U120),
        })
    }

    pub fn num60(range: Range, num: u64) -> Box<Expr> {
        Box::new(Expr {
            span: Span::Locatable(range),
            data: ExprKind::Num(crate::Number::U60(num)),
        })
    }

    pub fn num120(range: Range, num: u128) -> Box<Expr> {
        Box::new(Expr {
            span: Span::Locatable(range),
            data: ExprKind::Num(crate::Number::U120(num)),
        })
    }

    pub fn binary(range: Range, op: Operator, left: Box<Expr>, right: Box<Expr>) -> Box<Expr> {
        Box::new(Expr {
            span: Span::Locatable(range),
            data: ExprKind::Binary(op, left, right),
        })
    }

    pub fn hole(range: Range, num: u64) -> Box<Expr> {
        Box::new(Expr {
            span: Span::Locatable(range),
            data: ExprKind::Hole(num),
        })
    }

    pub fn str(range: Range, str: String) -> Box<Expr> {
        Box::new(Expr {
            span: Span::Locatable(range),
            data: ExprKind::Str(str),
        })
    }

    pub fn hlp(range: Range, hlp: Ident) -> Box<Expr> {
        Box::new(Expr {
            span: Span::Locatable(range),
            data: ExprKind::Hlp(hlp),
        })
    }

    pub fn err(range: Range) -> Box<Expr> {
        Box::new(Expr {
            data: ExprKind::Err,
            span: Span::Locatable(range),
        })
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
    pub typ: Box<Expr>,
    pub span: Range,
}

/// A rule is a equation that in the left-hand-side
/// contains a list of patterns @pats@ and on the
/// right hand side a value.
#[derive(Clone, Debug)]
pub struct Rule {
    pub name: QualifiedIdent,
    pub pats: Vec<Box<Expr>>,
    pub body: Box<Expr>,
    pub span: Span,
}

/// Attributes describes some compiler specific aspects
/// like inlining and derivations.
#[derive(Clone, Debug)]
pub enum Attribute {}

/// An entry describes a function that is typed
/// and has rules. The type of the function
/// consists of the arguments @args@ and the
/// return type @typ@.
#[derive(Clone, Debug)]
pub struct Entry {
    pub name: QualifiedIdent,
    pub args: Vec<Argument>,
    pub typ: Box<Expr>,
    pub rules: Vec<Rule>,
    pub attrs: Vec<Attribute>,
    pub span: Span,
}

/// A book is a collection of desugared entries.
#[derive(Clone, Debug, Default)]
pub struct Book {
    pub entrs: LinkedHashMap<String, Box<Entry>>,
    pub names: FxHashMap<String, usize>,
    pub holes: u64,
}

impl Expr {
    pub fn new_var(name: Ident) -> Expr {
        Expr {
            span: Span::Generated,
            data: ExprKind::Var(name),
        }
    }

    pub fn traverse_pi_types(&self) -> String {
        match &self.data {
            ExprKind::All(binder, typ, body) => {
                if binder.to_string().starts_with('_') {
                    format!("{} -> {}", typ, body.traverse_pi_types())
                } else {
                    format!("({} : {}) -> {}", binder, typ, body.traverse_pi_types())
                }
            }
            _ => format!("{}", self),
        }
    }
}

impl Display for AppBinding {
    fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
        if self.erased {
            write!(f, "-({})", self.data)
        } else {
            write!(f, "{}", self.data)
        }
    }
}

impl Display for Expr {
    fn fmt(&self, f: &mut Formatter<'_>) -> Result<(), Error> {
        use ExprKind::*;
        match &self.data {
            Typ => write!(f, "Type"),
            NumType(crate::NumType::U60) => write!(f, "U60"),
            NumType(crate::NumType::U120) => write!(f, "U120"),
            Str(n) => write!(f, "\"{}\"", n),
            Num(crate::Number::U60(n)) => write!(f, "{}", n),
            Num(crate::Number::U120(n)) => write!(f, "{}u120", n),
            All(_, _, _) => write!(f, "({})", self.traverse_pi_types()),
            Var(name) => write!(f, "{}", name),
            Lambda(binder, body, false) => write!(f, "({} => {})", binder, body),
            Lambda(binder, body, true) => write!(f, "({{{}}} => {})", binder, body),
            Sub(name, _, redx, expr) => write!(f, "(## {}/{} {})", name, redx, expr),
            App(head, spine) => write!(
                f,
                "({}{})",
                head,
                spine.iter().map(|x| format!(" {}", x)).collect::<String>()
            ),
            Fun(head, spine) | Ctr(head, spine) => {
                if spine.is_empty() {
                    write!(f, "{}", head)
                } else {
                    write!(
                        f,
                        "({}{})",
                        head,
                        spine.iter().map(|x| format!(" {}", x)).collect::<String>()
                    )
                }
            }
            Let(name, expr, body) => write!(f, "(let {} = {}; {})", name, expr, body),
            Ann(expr, typ) => write!(f, "({} : {})", expr, typ),
            Binary(op, expr, typ) => write!(f, "({} {} {})", op, expr, typ),
            Hole(_) => write!(f, "_"),
            Hlp(name) => write!(f, "?{}", name),
            Err => write!(f, "ERR"),
        }
    }
}

impl Display for Book {
    fn fmt(&self, f: &mut Formatter<'_>) -> Result<(), Error> {
        for entr in self.entrs.values() {
            writeln!(f, "{}\n", entr)?;
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
        write!(f, "{}{}: {}{}", open, self.name, self.typ, close)
    }
}

impl Display for Entry {
    fn fmt(&self, f: &mut Formatter<'_>) -> Result<(), Error> {
        write!(f, "{}", self.name.clone())?;

        for arg in &self.args {
            write!(f, " {}", arg)?;
        }

        write!(f, " : {}", &self.typ)?;

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
            typ: self.typ.clone(),
            span: self.span,
        }
    }

    pub fn from_field(name: &Ident, typ: Box<Expr>, range: Range) -> Argument {
        Argument {
            hidden: false,
            erased: false,
            name: name.clone(),
            typ,
            span: range,
        }
    }
}
