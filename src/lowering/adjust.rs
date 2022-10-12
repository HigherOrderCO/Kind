use crate::book::name::Ident;
use crate::book::new_type::NewType;
use crate::book::span::{Localized, Span};
use crate::book::term::Term;
use crate::book::{Argument, Book, Entry, Rule};
use crate::driver::config::{Config, Target};
use crate::lowering::load::load_newtype_cached;

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
    CannotFindAlias { name: String },
    InvalidAttribute { name: String },
    AttributeWithoutArgs { name: String },
    AttributeMissingArg { name: String },
    WrongTargetAttribute { name: String, target: Target },
    NeedsRules { fn_name: String, attr_name: String },
    FunctionHasArgs { fn_name: String, attr_name: String },
    FunctionNotFound { name: String },
    HasKdlAttrs { name: String },
    UseOpenInstead,
    UseMatchInstead,
    RepeatedVariable,
    CantLoadType,
    NoCoverage,
}

// The state that adjusts uses and update a term, book, rule or entry.
pub struct AdjustState<'a> {
    // The book that we are adjusting now.
    book: &'a Book,

    // TODO:
    eras: u64,

    // How much holes we created
    holes: u64,

    // All the vars that are bound in the context.
    vars: Vec<Ident>,
    // Definitions of types that are useful to the
    // "match" expression.
    types: HashMap<Ident, Rc<NewType>>,

    // Configuration provided by the user. It's useful
    // to load paths correctly.
    config: &'a Config,
}

impl<'a> AdjustState<'a> {
    pub fn new(book: &'a Book, config: &'a Config) -> AdjustState<'a> {
        AdjustState {
            book,
            eras: 0,
            holes: 0,
            vars: Vec::new(),
            types: HashMap::new(),
            config,
        }
    }
}

pub trait Adjust {
    fn adjust<'a>(&self, rhs: bool, state: &mut AdjustState<'a>) -> Result<Self, AdjustError>
    where
        Self: Sized;

    fn adjust_with_book(&self, book: &Book, config: &Config) -> Result<Self, AdjustError>
    where
        Self: Sized,
    {
        self.adjust(
            false,
            &mut AdjustState {
                book,
                eras: 0,
                holes: 0,
                vars: Vec::new(),
                types: HashMap::new(),
                config,
            },
        )
    }
}

fn convert_apps_to_ctr(term: &Term) -> Option<Term> {
    let mut term = term;
    let ctr_name;
    let mut ctr_orig = term.get_origin();
    let mut ctr_args = vec![];
    loop {
        match term {
            Term::App { ref orig, ref func, ref argm } => {
                ctr_args.push(argm);
                if ctr_orig == Span::Generated {
                    ctr_orig = *orig;
                }
                term = func;
            }
            Term::Var { ref name, .. } => {
                if !name.0.chars().next().unwrap_or(' ').is_uppercase() {
                    return None;
                } else {
                    ctr_name = name.clone();
                    break;
                }
            }
            _ => {
                return None;
            }
        }
    }
    if ctr_name.to_string() == "Type" {
        Some(Term::Typ { orig: ctr_orig })
    } else if ctr_name.0 == "U60" {
        Some(Term::U60 { orig: ctr_orig })
    } else {
        Some(Term::Ctr {
            orig: ctr_orig,
            name: ctr_name,
            args: ctr_args.iter().rev().map(|x| (*x).clone()).collect(),
        })
    }
}

impl Adjust for Term {
    fn adjust<'a>(&self, rhs: bool, state: &mut AdjustState<'a>) -> Result<Self, AdjustError> {
        if let Some(new_term) = convert_apps_to_ctr(self) {
            return new_term.adjust(rhs, state);
        }

        match *self {
            Term::Typ { orig } => Ok(Term::Typ { orig }),
            Term::Var { ref orig, ref name } => {
                let orig = *orig;
                if rhs && !state.vars.iter().any(|x| x == name) {
                    return Err(AdjustError {
                        orig,
                        kind: AdjustErrorKind::UnboundVariable { name: name.to_string() },
                    });
                } else if !rhs && state.vars.iter().any(|x| x == name) {
                    return Err(AdjustError {
                        orig,
                        kind: AdjustErrorKind::RepeatedVariable,
                    });
                } else if !rhs {
                    state.vars.push(name.clone());
                }
                Ok(Term::Var { orig, name: name.clone() })
            }
            Term::Let {
                ref orig,
                ref name,
                ref expr,
                ref body,
            } => {
                let orig = *orig;
                let expr = Box::new(expr.adjust(rhs, state)?);
                state.vars.push(name.clone());
                let body = Box::new(body.adjust(rhs, state)?);
                state.vars.pop();
                Ok(Term::Let {
                    orig,
                    name: name.clone(),
                    expr,
                    body,
                })
            }
            Term::Ann { ref orig, ref expr, ref tipo } => {
                let orig = *orig;
                let expr = Box::new(expr.adjust(rhs, state)?);
                let tipo = Box::new(tipo.adjust(rhs, state)?);
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
                let expr = Box::new(expr.adjust(rhs, state)?);
                match state.vars.iter().position(|x| x == name) {
                    None => Err(AdjustError {
                        orig,
                        kind: AdjustErrorKind::UnboundVariable { name: name.to_string() },
                    }),
                    Some(indx) => {
                        let name = name.clone();
                        let indx = indx as u64;
                        let redx = *redx;
                        Ok(Term::Sub { orig, name, indx, redx, expr })
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
                let tipo = Box::new(tipo.adjust(rhs, state)?);
                state.vars.push(name.clone());
                let body = Box::new(body.adjust(rhs, state)?);
                state.vars.pop();
                Ok(Term::All {
                    orig,
                    name: name.clone(),
                    tipo,
                    body,
                })
            }
            Term::Lam { ref orig, ref name, ref body } => {
                let orig = *orig;
                state.vars.push(name.clone());
                let body = Box::new(body.adjust(rhs, state)?);
                state.vars.pop();
                Ok(Term::Lam { orig, name: name.clone(), body })
            }
            Term::App { ref orig, ref func, ref argm } => {
                let orig = *orig;
                let func = Box::new(func.adjust(rhs, state)?);
                let argm = Box::new(argm.adjust(rhs, state)?);
                Ok(Term::App { orig, func, argm })
            }
            Term::Ctr { ref orig, ref name, ref args } => {
                let orig = *orig;
                if let Some(entry) = state.book.entrs.get(name) {
                    let mut new_args = Vec::new();
                    for arg in args {
                        // On lhs, switch holes for vars
                        if let (false, Term::Hol { orig, numb: _ }) = (rhs, &**arg) {
                            let name = format!("x{}_", state.eras);
                            state.eras += 1;
                            let arg = Box::new(Term::Var { orig: *orig, name: Ident(name) });
                            new_args.push(Box::new(arg.adjust(rhs, state)?));
                        } else {
                            new_args.push(Box::new(arg.adjust(rhs, state)?));
                        }
                    }
                    let (hiddens, eraseds) = entry.count_implicits();
                    // Fill implicit arguments (on rhs)
                    if rhs && args.len() == entry.args.len() - hiddens {
                        new_args.reverse();
                        let mut aux_args = Vec::new();
                        for arg in &entry.args {
                            if arg.hide {
                                let numb = state.holes;
                                state.holes += 1;
                                aux_args.push(Box::new(Term::Hol { orig, numb }));
                            } else {
                                aux_args.push(new_args.pop().unwrap());
                            }
                        }
                        new_args = aux_args;
                    }
                    // Fill erased arguments (on lhs)
                    if !rhs && args.len() == entry.args.len() - eraseds {
                        new_args.reverse();
                        let mut aux_args = Vec::new();
                        for arg in &entry.args {
                            if arg.eras {
                                let name = format!("{}{}_", arg.name, state.eras);
                                state.eras += 1;
                                let arg = Term::Var { orig, name: Ident(name) };
                                aux_args.push(Box::new(arg.adjust(rhs, state)?));
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
                    } else if !entry.rules.is_empty() {
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
                    Err(AdjustError {
                        orig,
                        kind: AdjustErrorKind::UnboundVariable { name: name.to_string() },
                    })
                }
            }
            Term::Fun { .. } => {
                panic!("Internal error."); // shouldn't happen since we can't parse Fun{}
            }
            Term::Hol { ref orig, numb: _ } => {
                let orig = *orig;
                let numb = state.holes;
                state.holes += 1;
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
                let val0 = Box::new(val0.adjust(rhs, state)?);
                let val1 = Box::new(val1.adjust(rhs, state)?);
                Ok(Term::Op2 { orig, oper, val0, val1 })
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
                if let Ok(res) = load_newtype_cached(state.config, &mut state.types, tipo) {
                    match &*res {
                        NewType::Sum(newtype) => {
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

                            let result = Term::Ctr {
                                orig,
                                name: Ident::new_path(&tipo.to_string(), "match"),
                                args,
                            };

                            result.adjust(rhs, state)
                        }
                        _ => Err(AdjustError {
                            orig,
                            kind: AdjustErrorKind::UseOpenInstead,
                        }),
                    }
                } else {
                    Err(AdjustError {
                        orig,
                        kind: AdjustErrorKind::CantLoadType,
                    })
                }
            }
            Term::Open {
                ref orig,
                ref name,
                ref tipo,
                ref expr,
                ref body,
                ref moti,
            } => {
                let orig = *orig;
                if let Ok(res) = load_newtype_cached(state.config, &mut state.types, tipo) {
                    match &*res {
                        NewType::Prod(prod) => {
                            let mut args = vec![];
                            args.push(expr.clone());
                            args.push(Box::new(Term::Lam {
                                orig: moti.get_origin(),
                                name: name.clone(),
                                body: moti.clone(),
                            }));

                            let mut case_term = body.clone();
                            for arg in prod.fields.iter().rev() {
                                case_term = Box::new(Term::Lam {
                                    orig: case_term.get_origin(),
                                    name: Ident(format!("{}.{}", name, arg.name)),
                                    body: case_term,
                                });
                            }

                            args.push(case_term);

                            let result = Term::Ctr {
                                orig,
                                name: Ident::new_path(&tipo.to_string(), "match"),
                                args,
                            };

                            result.adjust(rhs, state)
                        }
                        _ => Err(AdjustError {
                            orig,
                            kind: AdjustErrorKind::UseMatchInstead,
                        }),
                    }
                } else {
                    Err(AdjustError {
                        orig,
                        kind: AdjustErrorKind::CantLoadType,
                    })
                }
            }
        }
    }
}

impl Adjust for Rule {
    fn adjust<'a>(&self, _rhs: bool, state: &mut AdjustState<'a>) -> Result<Self, AdjustError> {
        let name = self.name.clone();
        let orig = self.orig;

        // shouldn't panic, because we only parse rules after the type annotation
        let entry = state.book.entrs.get(&self.name).expect("Untyped rule.");
        let mut pats = Vec::new();

        for pat in &self.pats {
            if let Term::Hol { orig, numb: _ } = &**pat {
                // On lhs, switch holes for vars
                // TODO: This duplicates of adjust_term because the lhs of a rule is not a term
                let name = Ident(format!("x{}_", state.eras));
                state.eras += 1;
                let pat = Term::Var { orig: *orig, name };
                pats.push(Box::new(pat.adjust(false, state)?));
            } else {
                pats.push(Box::new(pat.adjust(false, state)?));
            }
        }
        // Fill erased arguments
        let (_, eraseds) = entry.count_implicits();
        if self.pats.len() == entry.args.len() - eraseds {
            pats.reverse();
            let mut aux_pats = Vec::new();
            for arg in &entry.args {
                if arg.eras {
                    let name = Ident(format!("{}{}_", arg.name, state.eras));
                    state.eras += 1;
                    let pat = Box::new(Term::Var { orig, name });
                    aux_pats.push(Box::new(pat.adjust(false, state)?));
                } else {
                    aux_pats.push(pats.pop().unwrap());
                }
            }
            pats = aux_pats;
        }
        if pats.len() != entry.args.len() {
            return Err(AdjustError {
                orig,
                kind: AdjustErrorKind::IncorrectArity,
            });
        }
        let body = Box::new(self.body.adjust(true, state)?);
        Ok(Rule { orig, name, pats, body })
    }
}

impl Adjust for Argument {
    fn adjust<'a>(&self, _rhs: bool, state: &mut AdjustState<'a>) -> Result<Self, AdjustError> {
        state.eras = 0;
        let tipo = Box::new(self.tipo.adjust(true, state)?);
        Ok(Argument {
            orig: self.orig,
            hide: self.hide,
            eras: self.eras,
            name: self.name.clone(),
            tipo,
        })
    }
}

impl Adjust for Entry {
    fn adjust<'a>(&self, rhs: bool, state: &mut AdjustState<'a>) -> Result<Self, AdjustError> {
        let name = self.name.clone();

        let mut args = Vec::new();

        state.vars = Vec::new();

        for arg in &self.args {
            args.push(Box::new(arg.adjust(rhs, state)?));
            state.vars.push(arg.name.clone());
        }

        state.eras = 0;
        let tipo = Box::new(self.tipo.adjust(true, state)?);

        let mut rules = Vec::new();

        for rule in &self.rules {
            state.vars = Vec::new();
            rules.push(Box::new(rule.adjust(rhs, state)?));
        }
        Ok(Entry {
            name,
            orig: self.orig,
            args,
            tipo,
            rules,
            attrs: self.attrs.clone(),
        })
    }
}

impl Book {
    pub fn adjust(&mut self, config: &Config) -> Result<Self, AdjustError> {
        let mut names = Vec::new();
        let mut entrs = HashMap::new();
        let mut state = AdjustState::new(self, config);

        for name in &self.names {
            let entry = self.entrs.get(&name).unwrap();
            names.push(name.clone());
            entrs.insert(name.clone(), Box::new(entry.adjust(false, &mut state)?));
        }

        Ok(Book { names, entrs, holes: state.holes })
    }
}
