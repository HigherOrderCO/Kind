pub mod resolve;
pub mod adjust;
pub mod load;
pub mod attributes;

use crate::book::name::Ident;
use crate::book::new_type::{NewType, SumType, ProdType};
use crate::book::term::Term;
use crate::book::{Argument, Book, Entry, Rule};
use crate::driver::config::Config;
use crate::lowering::load::load_newtype_cached;

use std::collections::{HashMap, HashSet};
use std::rc::Rc;

// The state that adjusts uses and update a term, book, rule or entry.
pub struct UnboundState<'a> {
    // All the vars that are bound in the context.
    vars: Vec<Ident>,
    // TODO: Describe
    unbound: HashSet<Ident>,
    // Definitions of types that are useful to the
    // "match" expression.
    types: HashMap<Ident, Rc<NewType>>,

    config: &'a Config,
}

impl<'a> UnboundState<'a> {
    pub fn new(types: HashMap<Ident, Rc<NewType>>, config: &'a Config) -> UnboundState<'a> {
        UnboundState {
            vars: Vec::new(),
            unbound: HashSet::new(),
            types,
            config,
        }
    }
}

pub trait Unbound {
    fn fill_unbound(&self, rhs: bool, state: &mut UnboundState);

    fn get_unbounds(&self, types: HashMap<Ident, Rc<NewType>>, config: &Config) -> HashSet<Ident> {
        let mut state = UnboundState::new(types, config);
        self.fill_unbound(false, &mut state);
        state.unbound
    }
}

impl Unbound for Term {
    fn fill_unbound<'a>(&self, rhs: bool, state: &mut UnboundState) {
        match self {
            Term::Typ { .. } => {}
            Term::Var { ref name, .. } => {
                // Is constructor name
                if ('A'..='Z').contains(&name.0.chars().next().unwrap_or(' ')) {
                    state.unbound.insert(name.clone());
                // Is unbound variable
                } else if !state.vars.iter().any(|x| x == name) {
                    if rhs {
                        state.unbound.insert(name.clone());
                    } else {
                        state.vars.push(name.clone());
                    }
                }
            }
            Term::Let { ref name, ref expr, ref body, .. } => {
                expr.fill_unbound(rhs, state);
                state.vars.push(name.clone());
                body.fill_unbound(rhs, state);
                state.vars.pop();
            }
            Term::Ann { ref expr, ref tipo, .. } => {
                expr.fill_unbound(rhs, state);
                tipo.fill_unbound(rhs, state);
            }
            Term::Sub { name: _, ref expr, .. } => {
                expr.fill_unbound(rhs, state);
            }
            Term::All { ref name, ref tipo, ref body, .. } => {
                tipo.fill_unbound(rhs, state);
                state.vars.push(name.clone());
                body.fill_unbound(rhs, state);
                state.vars.pop();
            }
            Term::Lam { ref name, ref body, .. } => {
                state.vars.push(name.clone());
                body.fill_unbound(rhs, state);
                state.vars.pop();
            }
            Term::App { ref func, ref argm, .. } => {
                func.fill_unbound(rhs, state);
                argm.fill_unbound(rhs, state);
            }
            // not reached normally
            Term::Ctr { ref name, ref args, .. } => {
                state.unbound.insert(Ident(name.to_string()));
                for arg in args {
                    arg.fill_unbound(rhs, state);
                }
            }
            // not reached normally
            Term::Fun { ref name, ref args, .. } => {
                state.unbound.insert(Ident(name.to_string()));
                for arg in args {
                    arg.fill_unbound(rhs, state);
                }
            }
            Term::Op2 { ref val0, ref val1, .. } => {
                val0.fill_unbound(rhs, state);
                val1.fill_unbound(rhs, state);
            }
            Term::Hlp { .. } => {}
            Term::U60 { .. } => {}
            Term::Num { .. } => {}
            Term::Hol { .. } => {}
            Term::Mat {
                ref tipo,
                ref name,
                ref expr,
                ref cses,
                ref moti,
                ..
            } => {
                //println!("finding unbounds of match {} {}", tipo, name);
                if let Ok(newtype) = load_newtype_cached(state.config, &mut state.types, tipo) {
                    state.unbound.insert(Ident(format!("{}.match", tipo.clone())));
                    // Expr
                    expr.fill_unbound(rhs, state);
                    // Motive
                    state.vars.push(name.clone());
                    moti.fill_unbound(rhs, state);
                    state.vars.pop();
                    // Cases
                    if let NewType::Sum(SumType { name: _, ctrs, pars: _ }) = &*newtype {
                        for ctr in ctrs {
                            if let Some(cse) = cses.iter().find(|x| x.0 == ctr.name) {
                                for arg in ctr.args.iter().rev() {
                                    state.vars.push(arg.name.clone());
                                }
                                cse.1.fill_unbound(rhs, state);
                                for _ in ctr.args.iter().rev() {
                                    state.vars.pop();
                                }
                            }
                        }
                    }
                }
            },
            Term::Open { orig: _, tipo, name, expr, moti, body } => {
                if let Ok(newtype) = load_newtype_cached(state.config, &mut state.types, tipo) {
                    state.unbound.insert(Ident(format!("{}.match", tipo.clone())));
                    expr.fill_unbound(rhs, state);
                    state.vars.push(name.clone());
                    moti.fill_unbound(rhs, state);
                    state.vars.pop();
                    if let NewType::Prod(ProdType { name: _, fields, .. }) = &*newtype {
                        for arg in fields.iter().rev() {
                            state.vars.push(arg.name.clone());
                        }
                        body.fill_unbound(rhs, state);
                        for _ in fields.iter().rev() {
                            state.vars.pop();
                        }
                    }
                }
            }
        }
    }
}

impl Unbound for Rule {
    fn fill_unbound<'a>(&self, _rhs: bool, state: &mut UnboundState) {
        for pat in &self.pats {
            pat.fill_unbound(false, state);
        }
        self.body.fill_unbound(true, state);
    }
}

impl Unbound for Entry {
    fn fill_unbound<'a>(&self, _rhs: bool, state: &mut UnboundState) {
        state.vars = Vec::new();

        for arg in &self.args {
            arg.fill_unbound(true, state);
            state.vars.push(arg.name.clone());
        }

        self.tipo.fill_unbound(true, state);

        for rule in &self.rules {
            state.vars = Vec::new();
            rule.fill_unbound(true, state);
        }
    }
}

impl Unbound for Argument {
    fn fill_unbound<'a>(&self, _rhs: bool, state: &mut UnboundState) {
        self.tipo.fill_unbound(true, state);
    }
}

impl Book {
    pub fn get_unbounds(&self, config: &Config) -> HashSet<Ident> {
        let mut state = UnboundState::new(HashMap::new(), config);
        for name in &self.names {
            let entry = self.entrs.get(&name).unwrap();
            entry.fill_unbound(false, &mut state);
        }
        state.unbound
    }
}
