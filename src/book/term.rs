use crate::book::name::Ident;
use crate::book::span::{FileOffset, Localized, Span};

use std::ascii;
use std::fmt::{Display, Error, Formatter};

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

#[derive(Clone, Debug)]
pub enum Term {
    Typ { orig: Span },
    Var { orig: Span, name: Ident },
    All { orig: Span, name: Ident, tipo: Box<Term>, body: Box<Term> },
    Lam { orig: Span, name: Ident, body: Box<Term> },
    App { orig: Span, func: Box<Term>, argm: Box<Term> },
    Let { orig: Span, name: Ident, expr: Box<Term>, body: Box<Term> },
    Ann { orig: Span, expr: Box<Term>, tipo: Box<Term> },
    Sub { orig: Span, name: Ident, indx: u64, redx: u64, expr: Box<Term> },
    Ctr { orig: Span, name: Ident, args: Vec<Box<Term>> },
    Fun { orig: Span, name: Ident, args: Vec<Box<Term>> },
    Hlp { orig: Span },
    U60 { orig: Span },
    Num { orig: Span, numb: u64 },
    Op2 { orig: Span, oper: Operator, val0: Box<Term>, val1: Box<Term> },
    Hol { orig: Span, numb: u64 },
    Mat { orig: Span, tipo: Ident, name: Ident, expr: Box<Term>, cses: Vec<(Ident, Box<Term>)>, moti: Box<Term> },
}

impl Term {
    pub fn interpret_as_string(&self) -> Option<String> {
        let mut text = String::new();
        let mut term = self;

        let string_nil = Ident::new_path("String", "nil");
        let string_cons = Ident::new_path("String", "cons");

        loop {
            if let Term::Ctr { name, args, .. } = term {
                if *name == string_cons && args.len() == 2 {
                    if let Term::Num { numb, .. } = *args[0] {
                        if ascii::escape_default(numb as u8).count() > 1 {
                            return None;
                        } else {
                            text.push(char::from_u32(numb as u32).unwrap_or('\0'));
                            term = &*args[1];
                            continue;
                        }
                    } else {
                        return None;
                    }
                } else if *name == string_nil && args.is_empty() {
                    return Some(text);
                }
            }
            return None;
        }
    }
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

impl Display for Term {
    fn fmt(&self, f: &mut Formatter<'_>) -> Result<(), Error> {
        if let Some(str) = self.interpret_as_string() {
            write!(f, "\"{}\"", str)
        } else {
            use Term::*;
            match self {
                Typ { orig: _ } => write!(f, "Type"),
                Hlp { orig: _ } => write!(f, "?"),
                U60 { orig: _ } => write!(f, "U60"),
                Hol { orig: _, .. } => write!(f, "_"),
                Var { orig: _, name } => write!(f, "{}", name),
                Num { orig: _, numb } => write!(f, "{}", numb),
                Lam { orig: _, name, body } => write!(f, "({} => {})", name, body),
                Ann { orig: _, expr, tipo } => write!(f, "({} :: {})", expr, tipo),
                Op2 { orig: _, oper, val0, val1 } => write!(f, "({} {} {})", oper, val0, val1),
                All { orig: _, name, tipo, body } => write!(f, "({}: {}) {}", name, tipo, body),
                Let { orig: _, name, expr, body } => write!(f, "(let {} = {}; {})", name, expr, body),
                Sub { name, redx, expr, .. } => write!(f, "({} ## {}/{})", expr, name, redx),
                Ctr { orig: _, name, args } => write!(f, "({}{})", name, args.iter().map(|x| format!(" {}", x)).collect::<String>()),
                Fun { orig: _, name, args } => write!(f, "({}{})", name, args.iter().map(|x| format!(" {}", x)).collect::<String>()),
                App { func, argm, .. } => {
                    let mut args = vec![argm];
                    let mut expr = func;
                    while let App { func, argm, .. } = &**expr {
                        args.push(argm);
                        expr = func;
                    }
                    args.reverse();
                    write!(f, "({} {})", expr, args.iter().map(|x| format!("{}", x)).collect::<Vec<String>>().join(" "))
                }
                Mat { .. } => panic!("Internal Error: Cannot display a Term::Mat because it's removed after adjust."),
            }
        }
    }
}

impl Localized for Term {
    fn get_origin(&self) -> Span {
        use Term::*;
        match self {
            Typ { orig } => *orig,
            Hlp { orig } => *orig,
            U60 { orig } => *orig,
            Hol { orig, .. } => *orig,
            Var { orig, .. } => *orig,
            Num { orig, .. } => *orig,
            Lam { orig, .. } => *orig,
            Ann { orig, .. } => *orig,
            Op2 { orig, .. } => *orig,
            All { orig, .. } => *orig,
            Let { orig, .. } => *orig,
            Sub { orig, .. } => *orig,
            Ctr { orig, .. } => *orig,
            Fun { orig, .. } => *orig,
            App { orig, .. } => *orig,
            Mat { orig, .. } => *orig,
        }
    }

    fn set_origin_file(&mut self, file: FileOffset) {
        use Term::*;
        match self {
            Typ { orig } => {
                *orig = orig.set_file(file);
            }
            Hlp { orig } => {
                *orig = orig.set_file(file);
            }
            U60 { orig } => {
                *orig = orig.set_file(file);
            }
            Hol { orig, .. } => {
                *orig = orig.set_file(file);
            }
            Var { orig, .. } => {
                *orig = orig.set_file(file);
            }
            Num { orig, .. } => {
                *orig = orig.set_file(file);
            }
            Lam { orig, body, .. } => {
                *orig = orig.set_file(file);
                body.set_origin_file(file);
            }
            Ann { orig, expr, tipo } => {
                *orig = orig.set_file(file);
                expr.set_origin_file(file);
                tipo.set_origin_file(file);
            }
            Op2 { orig, oper: _, val0, val1 } => {
                *orig = orig.set_file(file);
                val0.set_origin_file(file);
                val1.set_origin_file(file);
            }
            All { orig, name: _, tipo, body } => {
                *orig = orig.set_file(file);
                tipo.set_origin_file(file);
                body.set_origin_file(file);
            }
            Let { orig, name: _, expr, body } => {
                *orig = orig.set_file(file);
                expr.set_origin_file(file);
                body.set_origin_file(file);
            }
            Sub {
                orig,
                name: _,
                indx: _,
                redx: _,
                expr,
            } => {
                *orig = orig.set_file(file);
                expr.set_origin_file(file);
            }
            Ctr { orig, name: _, args } => {
                *orig = orig.set_file(file);
                for arg in args {
                    arg.set_origin_file(file);
                }
            }
            Fun { orig, name: _, args } => {
                *orig = orig.set_file(file);
                for arg in args {
                    arg.set_origin_file(file);
                }
            }
            App { orig, func, argm } => {
                *orig = orig.set_file(file);
                func.set_origin_file(file);
                argm.set_origin_file(file);
            }
            Mat { orig, expr, cses, moti, .. } => {
                *orig = orig.set_file(file);
                expr.set_origin_file(file);
                for cse in cses {
                    cse.1.set_origin_file(file);
                }
                moti.set_origin_file(file);
            }
        }
    }
}
