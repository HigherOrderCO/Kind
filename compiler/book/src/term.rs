// Module that describes terms and operators
// of the language

use crate::name::{Ident, Qualified};
use crate::span::Span;

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
  Ctr { orig: Span, name: Qualified, args: Vec<Box<Term>> },
  Fun { orig: Span, name: Qualified, args: Vec<Box<Term>> },
  Hlp { orig: Span },
  U60 { orig: Span },
  Num { orig: Span, numb: u64 },
  Op2 { orig: Span, oper: Operator, val0: Box<Term>, val1: Box<Term> },
  Hol { orig: Span, numb: u64 },
  Mat { orig: Span, tipo: Qualified, name: Ident, expr: Box<Term>, cses: Vec<(Ident,Box<Term>)>, moti: Box<Term> },
}

impl Term {
    pub fn interpret_as_string(&self) -> Option<String> {
        let mut text = String::new();
        let mut term = self;

        let string_nil = Qualified::from_str("String.nil");
        let string_cons = Qualified::from_str("String.cons");

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
                } else if *name == string_nil && args.len() == 0 {
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
            Add => write!(f, "*"),
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
                Typ { orig: _ } =>
					write!(f, "Type"),
                Hlp { orig: _ } =>
					write!(f, "?"),
                U60 { orig: _ } =>
					write!(f, "U60"),
                Hol { orig: _, .. } =>
					write!(f, "_"),
                Var { orig: _, name } =>
					write!(f, "{}", name),
                Num { orig: _, numb } =>
					write!(f, "{}", numb),
                Lam { orig: _, name, body } =>
					write!(f, "({} => {})", name, body),
				Ann { orig: _, expr, tipo } =>
					write!(f, "({} :: {})", expr, tipo),
                Op2 { orig: _, oper, val0, val1 } =>
					write!(f, "({} {} {})", oper, val0, val1),
				All { orig: _, name, tipo, body } =>
					write!(f, "(({}: {}) {})", name, tipo, body),
				Let { orig: _, name, expr, body } =>
					write!(f, "(let {} = {}; {})", name, expr, body),
				Sub { orig: _, name, indx: _, redx, expr } =>
					write!(f, "({} ## {}/{})", expr, name, redx),
				Ctr { orig: _, name, args } =>
					write!(f, "({}{})", name, args.iter().map(|x| format!(" {}", x)).collect::<String>()),
				Fun { orig: _, name, args } =>
					write!(f, "({}{})", name, args.iter().map(|x| format!(" {}", x)).collect::<String>()),
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
				Mat { .. } => panic!("Internal Error: Cannot display a Term::Mat because it's removed after adjust.")
            }
        }
    }
}
