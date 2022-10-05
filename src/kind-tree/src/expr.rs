/// This module describes a CONCRETE SYNTAX TREE
/// without parenthesis. It helps when it comes to
/// a static analysis of the tree with the syntax sugars
/// and it makes it easier to split phases.

use crate::symbol::Ident;
use kind_span::Span;
use std::fmt::{Display, Error, Formatter};

/// Enum of binary operators.
#[derive(Copy, Clone, Debug)]
pub enum Operator {
    Add,
    Sub,
    Mul,
    Div,
    Mod,
    And,
    Or,
    Xor,
    Shl,
    Shr,
    Ltn,
    Lte,
    Eql,
    Gte,
    Gtn,
    Neq,
}

pub type Spine = Vec<Box<Expr>>;

/// A match block that will be translated
/// into an eliminator of a datatype.
#[derive(Clone, Debug)]
pub struct Match {
    pub tipo: Ident,
    pub name: Ident,
    pub expr: Box<Expr>,
    pub cases: Vec<(Ident, Box<Expr>)>,
    pub motive: Box<Expr>,
}

/// A open statement that will be trnaslated
/// into the eliminator of a record datatype.
#[derive(Clone, Debug)]
pub struct Open {
    pub tipo: Ident,
    pub name: Ident,
    pub expr: Box<Expr>,
    pub body: Box<Expr>,
    pub motive: Box<Expr>,
}

/// Substitution
#[derive(Clone, Debug)]
pub struct Substution {
    pub name: Ident,
    pub redx: u64,
    pub indx: u64,
    pub expr: Box<Expr>,
}

#[derive(Clone, Debug)]
pub enum Literal {
    /// The universe of types (e.g. Type)
    Type,
    /// The help operator that prints the context
    /// and the goal (e.g. ?)
    Help,
    /// The type of 60 bits numberss (e.g. 2 : U60)
    U60,
    /// A number literal of 60 bits (e.g 32132)
    Number(u64),
    // A String literal
    String(String),
}

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
    /// Declaration of a local variable
    Let(Ident, Box<Expr>, Box<Expr>),
    /// Type ascription (x : y)
    Ann(Box<Expr>, Box<Expr>),
    /// Literal
    Lit(Literal),
    /// Binary operation (e.g. 2 + 3)
    Binary(Operator, Box<Expr>, Box<Expr>),
    /// A expression open to unification (e.g. _)
    Hole(u64),
    /// Substituion
    Subst(Substution),
    /// A match block that will be translated
    /// into an eliminator of a datatype.
    Match(Match),
    /// A open statement that will be trnaslated
    /// into the eliminator of a record datatype.
    Open(Open),
}

#[derive(Clone, Debug)]
pub struct Expr {
    pub data: ExprKind,
    pub span: Span,
}

impl Display for Operator {
    fn fmt(&self, f: &mut Formatter<'_>) -> Result<(), Error> {
        use Operator::*;

        match self {
            Add => write!(f, "+"),
            Sub => write!(f, "-"),
            Mul => write!(f, "*"),
            Div => write!(f, "/"),
            Mod => write!(f, "%"),
            And => write!(f, "&"),
            Or => write!(f, "|"),
            Xor => write!(f, "^"),
            Shl => write!(f, "<<"),
            Shr => write!(f, ">>"),
            Ltn => write!(f, "<"),
            Lte => write!(f, "<="),
            Eql => write!(f, "=="),
            Gte => write!(f, ">="),
            Gtn => write!(f, ">"),
            Neq => write!(f, "!="),
        }
    }
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
            ExprKind::All(binder, typ, body) => match binder {
                None => format!("{} -> {}", typ, body.traverse_pi_types()),
                Some(binder) => format!("({} : {}) -> {}", binder, typ, body.traverse_pi_types()),
            },
            _ => format!("{}", self),
        }
    }
}

impl Display for Literal {
    fn fmt(&self, f: &mut Formatter<'_>) -> Result<(), Error> {
        match self {
            Literal::Help => write!(f, "?"),
            Literal::Type => write!(f, "Type"),
            Literal::U60 => write!(f, "U60"),
            Literal::Number(numb) => write!(f, "{}", numb),
            Literal::String(str) => write!(f, "\"{}\"", str),
        }
    }
}

impl Display for Expr {
    fn fmt(&self, f: &mut Formatter<'_>) -> Result<(), Error> {
        use ExprKind::*;
        match &self.data {
            All(_, _, _) => write!(f, "({}", self.traverse_pi_types()),
            Lit(lit) => write!(f, "{}", lit),
            Var(name) => write!(f, "{}", name),
            Lambda(binder, body) => write!(f, "({} => {})", binder, body),
            App(head, spine) => write!(f, "({}{})", head, spine.iter().map(|x| format!(" {}", x)).collect::<String>()),
            Let(name, expr, body) => write!(f, "(let {} = {}; {})", name, expr, body),
            Ann(expr, typ) => write!(f, "({} : {})", expr, typ),
            Binary(op, expr, typ) => write!(f, "({} {} {})", op, expr, typ),
            Subst(Substution { name, redx, expr, .. }) => write!(f, "({} ## {}/{})", expr, name, redx),
            Hole(_) => todo!(),
            Match(_) => todo!(),
            Open(_) => todo!(),
        }
    }
}
