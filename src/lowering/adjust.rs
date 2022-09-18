use crate::book::name::{Ident, Qualified};
use crate::book::new_type::NewType;
use crate::book::span::{Localized, Span};
use crate::book::term::Term;
use crate::book::Book;

use crate::parser::new_type::read_newtype;

use std::collections::HashMap;
use std::rc::Rc;

#[derive(Clone, Debug)]
pub struct AdjustError {
    pub orig: Span,
    pub kind: AdjustErrorKind,
}

#[derive(Clone, Debug)]
pub enum AdjustErrorKind {
    IncorrectArity,
    UnboundVariable { name: String },
    RepeatedVariable,
    CantLoadType,
    NoCoverage,
}

// The state that adjusts uses and update a term, book, rule or entry.
pub struct AdjustState<'a> {
    // The book that we are adjusting now.
    book: &'a Book,
    // If we are in the right hand side of a rule.
    rhs: bool,
    // TODO:
    eras: u64,
    // How much holes we created
    holes: u64,
    // All the vars that are bound in the context.
    vars: Vec<Ident>,
    // Definitions of types that are useful to the
    // "match" expression.
    types: HashMap<Qualified, Rc<NewType>>,
}

trait Adjust {
    fn adjust<'a>(&self, state: &mut AdjustState<'a>) -> Result<Self, AdjustError>
    where
        Self: Sized;

    fn adjust_with_book<'a>(&self, book: &'a Book) -> Result<Self, AdjustError>
    where
        Self: Sized,
    {
        self.adjust(&mut AdjustState {
            book,
            rhs: false,
            eras: 0,
            holes: 0,
            vars: Vec::new(),
            types: HashMap::new(),
        })
    }
}

// TODO: Remove this from the adjust layer. I think that we need to move it
// to the driver.
fn load_newtype(name: &Qualified) -> Result<Box<NewType>, String> {
    let path = format!("{}/_.type", name.to_string().replace(".", "/"));
    let newcode = match std::fs::read_to_string(&path) {
        Err(_) => {
            return Err(format!("File not found: '{}'.", path));
        }
        Ok(code) => code,
    };
    let newtype = match read_newtype(&newcode) {
        Err(err) => {
            return Err(format!("\x1b[1m[{}]\x1b[0m\n{}", path, err));
        }
        Ok(book) => book,
    };
    return Ok(newtype);
}

pub fn load_newtype_cached(
    cache: &mut HashMap<Qualified, Rc<NewType>>,
    name: &Qualified,
) -> Result<Rc<NewType>, String> {
    if !cache.contains_key(name) {
        let newtype = Rc::new(*load_newtype(name)?);
        cache.insert(name.clone(), newtype);
    }
    return Ok(cache.get(name).unwrap().clone());
}

impl Adjust for Term {
    fn adjust<'a>(&self, state: &mut AdjustState<'a>) -> Result<Self, AdjustError> {
        match *self {
            Term::Typ { orig } => Ok(Term::Typ { orig }),
            Term::Var { ref orig, ref name } => {
                let orig = *orig;
                if state.rhs && state.vars.iter().find(|&x| x == name).is_none() {
                    return Err(AdjustError {
                        orig,
                        kind: AdjustErrorKind::UnboundVariable {
                            name: name.to_string(),
                        },
                    });
                } else if !state.rhs && state.vars.iter().find(|&x| x == name).is_some() {
                    return Err(AdjustError {
                        orig,
                        kind: AdjustErrorKind::RepeatedVariable,
                    });
                } else if !state.rhs {
                    state.vars.push(name.clone());
                }
                Ok(Term::Var {
                    orig,
                    name: name.clone(),
                })
            }
            Term::Let {
                ref orig,
                ref name,
                ref expr,
                ref body,
            } => {
                let orig = *orig;
                let expr = Box::new(expr.adjust(state)?);
                state.vars.push(name.clone());
                let body = Box::new(body.adjust(state)?);
                state.vars.pop();
                Ok(Term::Let {
                    orig,
                    name: name.clone(),
                    expr,
                    body,
                })
            }
            Term::Ann {
                ref orig,
                ref expr,
                ref tipo,
            } => {
                let orig = *orig;
                let expr = Box::new(expr.adjust(state)?);
                let tipo = Box::new(tipo.adjust(state)?);
                Ok(Term::Ann { orig, expr, tipo })
            }
            Term::Sub {
                ref orig,
                ref name,
                indx: _,
                ref redx,
                ref expr,
            } => {
                let orig = *orig;
                let expr = Box::new(expr.adjust(state)?);
                match state.vars.iter().position(|x| x == name) {
                    None => {
                        return Err(AdjustError {
                            orig,
                            kind: AdjustErrorKind::UnboundVariable {
                                name: name.to_string(),
                            },
                        });
                    }
                    Some(indx) => {
                        let name = name.clone();
                        let indx = indx as u64;
                        let redx = *redx;
                        Ok(Term::Sub {
                            orig,
                            name,
                            indx,
                            redx,
                            expr,
                        })
                    }
                }
            }
            Term::All {
                ref orig,
                ref name,
                ref tipo,
                ref body,
            } => {
                let orig = *orig;
                let tipo = Box::new(tipo.adjust(state)?);
                state.vars.push(name.clone());
                let body = Box::new(body.adjust(state)?);
                state.vars.pop();
                Ok(Term::All {
                    orig,
                    name: name.clone(),
                    tipo,
                    body,
                })
            }
            Term::Lam {
                ref orig,
                ref name,
                ref body,
            } => {
                let orig = *orig;
                state.vars.push(name.clone());
                let body = Box::new(body.adjust(state)?);
                state.vars.pop();
                Ok(Term::Lam {
                    orig,
                    name: name.clone(),
                    body,
                })
            }
            Term::App {
                ref orig,
                ref func,
                ref argm,
            } => {
                let orig = *orig;
                let func = Box::new(func.adjust(state)?);
                let argm = Box::new(argm.adjust(state)?);
                Ok(Term::App { orig, func, argm })
            }
            Term::Ctr {
                ref orig,
                ref name,
                ref args,
            } => {
                let orig = *orig;
                if let Some(entry) = state.book.entrs.get(name) {
                    let mut new_args = Vec::new();
                    for arg in args {
                        // On lhs, switch holes for vars
                        if let (false, Term::Hol { orig, numb: _ }) = (state.rhs, &**arg) {
                            let name = format!("x{}_", state.eras);
                            state.eras = state.eras + 1;
                            let arg = Box::new(Term::Var {
                                orig: *orig,
                                name: Ident(name),
                            });
                            new_args.push(Box::new(arg.adjust(state)?));
                        } else {
                            new_args.push(Box::new(arg.adjust(state)?));
                        }
                    }
                    let (hiddens, eraseds) = entry.count_implicits();
                    // Fill implicit arguments (on rhs)
                    if state.rhs && args.len() == entry.args.len() - hiddens {
                        new_args.reverse();
                        let mut aux_args = Vec::new();
                        for arg in &entry.args {
                            if arg.hide {
                                let numb = state.holes;
                                state.holes = state.holes + 1;
                                aux_args.push(Box::new(Term::Hol { orig, numb }));
                            } else {
                                aux_args.push(new_args.pop().unwrap());
                            }
                        }
                        new_args = aux_args;
                    }
                    // Fill erased arguments (on lhs)
                    if !state.rhs && args.len() == entry.args.len() - eraseds {
                        new_args.reverse();
                        let mut aux_args = Vec::new();
                        for arg in &entry.args {
                            if arg.eras {
                                let name = format!("{}{}_", arg.name, state.eras);
                                state.eras = state.eras + 1;
                                let arg = Term::Var {
                                    orig: orig,
                                    name: Ident(name),
                                };
                                aux_args.push(Box::new(arg.adjust(state)?));
                            } else {
                                aux_args.push(new_args.pop().unwrap());
                            }
                        }
                        new_args = aux_args;
                    }
                    if new_args.len() != entry.args.len() {
                        Err(AdjustError {
                            orig,
                            kind: AdjustErrorKind::IncorrectArity,
                        })
                    } else if entry.rules.len() > 0 {
                        Ok(Term::Fun {
                            orig,
                            name: name.clone(),
                            args: new_args,
                        })
                    } else {
                        Ok(Term::Ctr {
                            orig,
                            name: name.clone(),
                            args: new_args,
                        })
                    }
                } else {
                    return Err(AdjustError {
                        orig,
                        kind: AdjustErrorKind::UnboundVariable {
                            name: name.to_string(),
                        },
                    });
                }
            }
            Term::Fun { .. } => {
                panic!("Internal error."); // shouldn't happen since we can't parse Fun{}
            }
            Term::Hol { ref orig, numb: _ } => {
                let orig = *orig;
                let numb = state.holes;
                state.holes = state.holes + 1;
                Ok(Term::Hol { orig, numb })
            }
            Term::Hlp { ref orig } => {
                let orig = *orig;
                Ok(Term::Hlp { orig })
            }
            Term::U60 { ref orig } => {
                let orig = *orig;
                Ok(Term::U60 { orig })
            }
            Term::Num { ref orig, ref numb } => {
                let orig = *orig;
                let numb = *numb;
                Ok(Term::Num { orig, numb })
            }
            Term::Op2 {
                ref orig,
                ref oper,
                ref val0,
                ref val1,
            } => {
                let orig = *orig;
                let oper = *oper;
                let val0 = Box::new(val0.adjust(state)?);
                let val1 = Box::new(val1.adjust(state)?);
                Ok(Term::Op2 {
                    orig,
                    oper,
                    val0,
                    val1,
                })
            }
            Term::Mat {
                ref orig,
                ref name,
                ref tipo,
                ref expr,
                ref cses,
                ref moti,
            } => {
                let orig = *orig;
                if let Ok(newtype) = load_newtype_cached(&mut state.types, tipo) {
                    let mut args = vec![];
                    args.push(expr.clone());
                    args.push(Box::new(Term::Lam {
                        orig: moti.get_origin(),
                        name: name.clone(),
                        body: moti.clone(),
                    }));

                    if newtype.ctrs.len() != cses.len() {
                        return Err(AdjustError {
                            orig,
                            kind: AdjustErrorKind::NoCoverage,
                        });
                    }

                    for ctr in &newtype.ctrs {
                        if let Some(cse) = cses.iter().find(|x| x.0 == ctr.name) {
                            let mut case_term = cse.1.clone();
                            for arg in ctr.args.iter().rev() {
                                case_term = Box::new(Term::Lam {
                                    orig: case_term.get_origin(),
                                    name: Ident(format!("{}.{}", name, arg.name)),
                                    body: case_term,
                                });
                            }
                            args.push(case_term);
                        } else {
                            return Err(AdjustError {
                                orig,
                                kind: AdjustErrorKind::NoCoverage,
                            });
                        }
                    }

                    let result = Term::Ctr { orig, name: Qualified::new_raw(&tipo.to_string(), "match"), args };

                    result.adjust(state)
                } else {
                    Err(AdjustError { orig, kind: AdjustErrorKind::CantLoadType })
                }
            }
        }
    }
}
