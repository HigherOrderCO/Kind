//! This module describes an unsugared tree that
//! is used by the type checker and by the targets.

use std::fmt::{Display, Error, Formatter};

use fxhash::FxHashMap;
use kind_span::Range;
use linked_hash_map::LinkedHashMap;

pub use crate::Operator;

use crate::{
    symbol::{Ident, QualifiedIdent},
    Attributes, telescope::Telescope,
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
    Var { name: Ident },
    /// The dependent function space (e.g. (x : Int) -> y)
    All {
        param: Ident,
        typ: Box<Expr>,
        body: Box<Expr>,
        erased: bool,
    },
    /// A anonymous function that receives one argument
    Lambda {
        param: Ident,
        body: Box<Expr>,
        erased: bool,
    },
    /// Application of a expression to a spine of expressions
    App {
        fun: Box<Expr>,
        args: Vec<AppBinding>,
    },
    /// Application of a function
    Fun { name: QualifiedIdent, args: Spine },
    /// Application of a Construtor
    Ctr { name: QualifiedIdent, args: Spine },
    /// Declaration of a local variable
    Let {
        name: Ident,
        val: Box<Expr>,
        next: Box<Expr>,
    },
    /// Type ascription (x : y)
    Ann { expr: Box<Expr>, typ: Box<Expr> },
    /// Substitution
    Sub {
        name: Ident,
        indx: usize,
        redx: usize,
        expr: Box<Expr>,
    },
    /// Type Literal
    Typ,
    /// 60 bit integer type
    NumTypeU60,
    /// 60 bit floating point number type
    NumTypeF60,
    /// 60 bit integer
    NumU60 { numb: u64 },
    /// 60 bit floating point number
    NumF60 { numb: u64 },
    /// Very special constructor :)
    Str { val: String },
    /// Binary operation (e.g. 2 + 3)
    Binary {
        op: Operator,
        left: Box<Expr>,
        right: Box<Expr>,
    },
    /// A expression open to unification (e.g. _)
    Hole { num: u64 },
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
    pub range: Range,
}

impl Expr {
    pub fn var(name: Ident) -> Box<Expr> {
        Box::new(Expr {
            range: name.range,
            data: ExprKind::Var { name },
        })
    }

    pub fn all(
        range: Range,
        param: Ident,
        typ: Box<Expr>,
        body: Box<Expr>,
        erased: bool,
    ) -> Box<Expr> {
        Box::new(Expr {
            range,
            data: ExprKind::All {
                param,
                typ,
                body,
                erased,
            },
        })
    }

    pub fn sub(range: Range, name: Ident, indx: usize, redx: usize, expr: Box<Expr>) -> Box<Expr> {
        Box::new(Expr {
            range,
            data: ExprKind::Sub {
                name,
                indx,
                redx,
                expr,
            },
        })
    }

    pub fn lambda(range: Range, param: Ident, body: Box<Expr>, erased: bool) -> Box<Expr> {
        Box::new(Expr {
            range,
            data: ExprKind::Lambda {
                param,
                body,
                erased,
            },
        })
    }

    pub fn identity_lambda(ident: Ident) -> Box<Expr> {
        Box::new(Expr {
            range: ident.range,
            data: ExprKind::Lambda {
                param: ident.clone(),
                body: Self::var(ident),
                erased: false,
            },
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


    pub fn unfold_all(irrelev: &[bool], idents: &[(Ident, Box<Expr>)], body: Box<Expr>) -> Box<Expr> {
        idents
            .iter()
            .rev()
            .zip(irrelev)
            .fold(body, |body, ((ident, typ), irrelev)| {
                Expr::all(ident.range, ident.clone(), typ.clone(), body, *irrelev)
            })
    }

    pub fn app(range: Range, fun: Box<Expr>, args: Vec<AppBinding>) -> Box<Expr> {
        Box::new(Expr {
            range,
            data: ExprKind::App { fun, args },
        })
    }

    pub fn fun(range: Range, name: QualifiedIdent, args: Vec<Box<Expr>>) -> Box<Expr> {
        Box::new(Expr {
            range,
            data: ExprKind::Fun { name, args },
        })
    }

    pub fn ctr(range: Range, name: QualifiedIdent, args: Vec<Box<Expr>>) -> Box<Expr> {
        Box::new(Expr {
            range,
            data: ExprKind::Ctr { name, args },
        })
    }

    pub fn let_(range: Range, name: Ident, val: Box<Expr>, next: Box<Expr>) -> Box<Expr> {
        Box::new(Expr {
            range,
            data: ExprKind::Let { name, val, next },
        })
    }

    pub fn ann(range: Range, expr: Box<Expr>, typ: Box<Expr>) -> Box<Expr> {
        Box::new(Expr {
            range,
            data: ExprKind::Ann { expr, typ },
        })
    }

    pub fn typ(range: Range) -> Box<Expr> {
        Box::new(Expr {
            range,
            data: ExprKind::Typ,
        })
    }

    pub fn type_u60(range: Range) -> Box<Expr> {
        Box::new(Expr {
            range,
            data: ExprKind::NumTypeU60,
        })
    }

    pub fn type_f60(range: Range) -> Box<Expr> {
        Box::new(Expr {
            range,
            data: ExprKind::NumTypeF60,
        })
    }

    pub fn num_u60(range: Range, numb: u64) -> Box<Expr> {
        Box::new(Expr {
            range,
            data: ExprKind::NumU60 { numb },
        })
    }

    pub fn num_u120(range: Range, numb: u128) -> Box<Expr> {
        let name = QualifiedIdent::new_static("U120.new", None, range);
        let lo = Expr::num_u60(range, (numb & 0xFFFFFFFFFFFFFFF) as u64);
        let hi = Expr::num_u60(range, (numb >> 60) as u64);
        Box::new(Expr {
            range,
            data: ExprKind::Ctr {
                name,
                args: vec![hi, lo],
            },
        })
    }

    pub fn num_f60(range: Range, numb: u64) -> Box<Expr> {
        Box::new(Expr {
            range,
            data: ExprKind::NumF60 { numb },
        })
    }

    pub fn binary(range: Range, op: Operator, left: Box<Expr>, right: Box<Expr>) -> Box<Expr> {
        Box::new(Expr {
            range,
            data: ExprKind::Binary { op, left, right },
        })
    }

    pub fn hole(range: Range, num: u64) -> Box<Expr> {
        Box::new(Expr {
            range,
            data: ExprKind::Hole { num },
        })
    }

    pub fn str(range: Range, val: String) -> Box<Expr> {
        Box::new(Expr {
            range,
            data: ExprKind::Str { val },
        })
    }

    pub fn hlp(range: Range, hlp: Ident) -> Box<Expr> {
        Box::new(Expr {
            range,
            data: ExprKind::Hlp(hlp),
        })
    }

    pub fn err(range: Range) -> Box<Expr> {
        Box::new(Expr {
            data: ExprKind::Err,
            range,
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
    pub range: Range,
}

/// A rule is a equation that in the left-hand-side
/// contains a list of patterns @pats@ and on the
/// right hand side a value.
#[derive(Clone, Debug)]
pub struct Rule {
    pub name: QualifiedIdent,
    pub pats: Vec<Box<Expr>>,
    pub body: Box<Expr>,
    pub range: Range,
}

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
    pub attrs: Attributes,
    pub range: Range,
}

/// Type family information
#[derive(Clone, Debug)]
pub struct Family {
    pub name: QualifiedIdent,
    pub parameters: Telescope<Argument>,
    pub constructors: Vec<QualifiedIdent>
}

/// A book is a collection of desugared entries.
#[derive(Clone, Debug, Default)]
pub struct Book {
    pub entrs: LinkedHashMap<String, Box<Entry>>,
    pub names: FxHashMap<String, usize>,
    pub families: FxHashMap<String, Family>,
    pub holes: u64,
}

impl Expr {
    pub fn new_var(name: Ident) -> Expr {
        Expr {
            range: name.range,
            data: ExprKind::Var { name },
        }
    }

    pub fn traverse_pi_types(&self) -> String {
        match &self.data {
            ExprKind::All {
                param,
                typ,
                body,
                erased,
            } => {
                let tilde = if *erased { "~" } else { "" };
                if param.to_string().starts_with('_') {
                    format!("{}{} -> {}", tilde, typ, body.traverse_pi_types())
                } else {
                    let body = body.traverse_pi_types();
                    format!("{}({} : {}) -> {}", tilde, param, typ, body)
                }
            }
            _ => format!("{}", self),
        }
    }
}

impl Display for AppBinding {
    fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
        if self.erased {
            write!(f, "~({})", self.data)
        } else {
            write!(f, "{}", self.data)
        }
    }
}

pub fn try_desugar_to_nat(name: &QualifiedIdent, spine: &[Box<Expr>], acc: u128) -> Option<u128> {
    match name.to_str() {
        "Nat.zero" if spine.len() == 0 => {
            Some(acc)
        }
        "Nat.succ" if spine.len() == 1 => {
            match &spine[0].data {
                ExprKind::Ctr { name, args } => try_desugar_to_nat(name, args, acc + 1),
                _ => None
            }
        }
        _ => None
    }
}

impl Display for Expr {
    fn fmt(&self, f: &mut Formatter<'_>) -> Result<(), Error> {
        use ExprKind::*;
        match &self.data {
            Typ => write!(f, "Type"),
            NumTypeU60 => write!(f, "U60"),
            NumTypeF60 => write!(f, "F60"),
            Str { val } => write!(f, "\"{}\"", val),
            NumU60 { numb } => write!(f, "{}", numb),
            NumF60 { numb: _ } => todo!(),
            All { .. } => write!(f, "({})", self.traverse_pi_types()),
            Var { name } => write!(f, "{}", name),
            Lambda {
                param,
                body,
                erased: false,
            } => write!(f, "({} => {})", param, body),
            Lambda {
                param,
                body,
                erased: true,
            } => write!(f, "(~{} => {})", param, body),
            Sub {
                name, redx, expr, ..
            } => write!(f, "(## {}/{} {})", name, redx, expr),
            App { fun, args } => write!(
                f,
                "({}{})",
                fun,
                args.iter().map(|x| format!(" {}", x)).collect::<String>()
            ),
            Fun { name, args } | Ctr { name, args } => {
                if let Some(res) = try_desugar_to_nat(name, args, 0) {
                    write!(f, "{res}n")
                } else {
                    if args.is_empty() {
                        write!(f, "{}", name)
                    } else {
                        write!(
                            f,
                            "({}{})",
                            name,
                            args.iter().map(|x| format!(" {}", x)).collect::<String>()
                        )
                    }
                }
            }
            Let { name, val, next } => write!(f, "(let {} = {}; {})", name, val, next),
            Ann { expr, typ } => write!(f, "({} :: {})", expr, typ),
            Binary { op, left, right } => write!(f, "({} {} {})", op, left, right),
            Hole { .. } => write!(f, "_"),
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
            range: self.range,
        }
    }

    pub fn from_field(name: &Ident, typ: Box<Expr>, range: Range) -> Argument {
        Argument {
            hidden: false,
            erased: false,
            name: name.clone(),
            typ,
            range,
        }
    }
}
