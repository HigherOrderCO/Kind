//! This module describes an unsugared and untyped tree
//! that is a IR

use std::fmt::{Display, Error, Formatter};

use fxhash::FxHashMap;
use kind_span::Range;
use linked_hash_map::LinkedHashMap;

use crate::{
    symbol::{Ident, QualifiedIdent},
    Attributes,
};
pub use crate::{NumType, Number, Operator};

/// Just a vector of expressions. It is called spine because
/// it is usually in a form like (a b c d e) that can be interpret
/// as ((((a b) c) d) e) that looks like a spine.
pub type Spine = Vec<Box<Expr>>;

#[derive(Clone, Debug, Hash, PartialEq, Eq)]
pub enum ExprKind {
    /// Name of a variable
    Var {
        name: Ident,
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
        args: Vec<Box<Expr>>,
    },
    /// Application of a function
    Fun {
        name: QualifiedIdent,
        args: Spine,
    },
    /// Application of a Construtor
    Ctr {
        name: QualifiedIdent,
        args: Spine,
    },
    /// Declaration of a local variable
    Let {
        name: Ident,
        val: Box<Expr>,
        next: Box<Expr>,
    },
    /// Primitive numeric values
    Num {
        num: crate::Number,
    },
    /// Very special constructor :)
    Str {
        val: String,
    },
    /// Binary operation (e.g. 2 + 3)
    Binary {
        op: Operator,
        left: Box<Expr>,
        right: Box<Expr>,
    },

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

    pub fn str(range: Range, val: String) -> Box<Expr> {
        Box::new(Expr {
            range,
            data: ExprKind::Str { val },
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

    pub fn fun(range: Range, name: QualifiedIdent, args: Vec<Box<Expr>>) -> Box<Expr> {
        Box::new(Expr {
            range: range.into(),
            data: ExprKind::Fun { name, args },
        })
    }

    pub fn app(range: Range, fun: Box<Expr>, args: Vec<Box<Expr>>) -> Box<Expr> {
        Box::new(Expr {
            range: range.into(),
            data: ExprKind::App { fun, args },
        })
    }

    pub fn ctr(range: Range, name: QualifiedIdent, args: Vec<Box<Expr>>) -> Box<Expr> {
        Box::new(Expr {
            range: range.into(),
            data: ExprKind::Ctr { name, args },
        })
    }

    pub fn let_(range: Range, name: Ident, val: Box<Expr>, next: Box<Expr>) -> Box<Expr> {
        Box::new(Expr {
            range,
            data: ExprKind::Let { name, val, next },
        })
    }

    pub fn num60(range: Range, num: u64) -> Box<Expr> {
        Box::new(Expr {
            range,
            data: ExprKind::Num {
                num: crate::Number::U60(num),
            },
        })
    }

    pub fn num120(range: Range, num: u128) -> Box<Expr> {
        Box::new(Expr {
            range,
            data: ExprKind::Num {
                num: crate::Number::U120(num),
            },
        })
    }

    pub fn binary(range: Range, op: Operator, left: Box<Expr>, right: Box<Expr>) -> Box<Expr> {
        Box::new(Expr {
            range,
            data: ExprKind::Binary { op, left, right },
        })
    }

    pub fn err(range: Range) -> Box<Expr> {
        Box::new(Expr {
            range,
            data: ExprKind::Err,
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
    pub args: Vec<(String, Range, bool)>,
    pub rules: Vec<Rule>,
    pub attrs: Attributes,
    pub range: Range,
}

/// A book is a collection of desugared entries.
#[derive(Clone, Debug, Default)]
pub struct Book {
    pub entrs: LinkedHashMap<String, Box<Entry>>,
    pub names: FxHashMap<String, usize>,
}

impl Expr {
    pub fn new_var(name: Ident) -> Expr {
        Expr {
            range: name.range,
            data: ExprKind::Var { name },
        }
    }
}

impl Display for Expr {
    fn fmt(&self, f: &mut Formatter<'_>) -> Result<(), Error> {
        use ExprKind::*;
        match &self.data {
            Err => write!(f, "ERR"),
            Str { val } => write!(f, "\"{}\"", val),
            Num {
                num: crate::Number::U60(n),
            } => write!(f, "{}", n),
            Num {
                num: crate::Number::U120(n),
            } => write!(f, "{}u120", n),
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
            App { fun, args } => write!(
                f,
                "({}{})",
                fun,
                args.iter().map(|x| format!(" {}", x)).collect::<String>()
            ),
            Fun { name, args } | Ctr { name, args } => {
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
            Let { name, val, next } => write!(f, "(let {} = {}; {})", name, val, next),
            Binary { op, left, right } => write!(f, "({} {} {})", op, left, right),
        }
    }
}

impl Display for Book {
    fn fmt(&self, f: &mut Formatter<'_>) -> Result<(), Error> {
        for entr in self.entrs.values() {
            if !entr.rules.is_empty() {
                writeln!(f, "{}", entr)?;
            } else {
                writeln!(f, "ctr {}", entr.name)?;
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
        write!(f, "{}{}: {}{}", open, self.name, self.typ, close)
    }
}

impl Display for Entry {
    fn fmt(&self, f: &mut Formatter<'_>) -> Result<(), Error> {
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
