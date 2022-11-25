//! Erases everything that is not relevant to the output.
//! It's a simpler version of what I want to do in order
//! to finish a stable version of the compiler.

// FIX: Need to make a "constraint map" in order to check
// if a irrelevant thing is relevant in relation to the
// function that we are trying to check the irrelevance.

// Not the best algorithm... it should not be trusted for
// dead code elimination.

// TODO: Cannot pattern match on erased

use std::sync::mpsc::Sender;

use fxhash::{FxHashMap, FxHashSet};

use kind_report::data::Diagnostic;
use kind_span::Range;
use kind_tree::desugared::{Book, Entry, Expr, Rule};
use kind_tree::symbol::QualifiedIdent;
use kind_tree::{untyped, Number};

use crate::errors::PassError;

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum Relevance {
    Irrelevant,
    Relevant,
    Hole(usize),
}
pub struct ErasureState<'a> {
    errs: Sender<Box<dyn Diagnostic>>,
    book: &'a Book,

    ctx: im::HashMap<String, (Range, (Option<Range>, Relevance))>,

    names: FxHashMap<String, (Option<Range>, Relevance)>,
    holes: Vec<Option<Relevance>>,
    failed: bool,
}

pub fn erase_book(
    book: Book,
    errs: Sender<Box<dyn Diagnostic>>,
    entrypoint: FxHashSet<String>,
) -> Option<untyped::Book> {
    let mut state = ErasureState {
        errs,
        book: &book,
        ctx: Default::default(),
        names: Default::default(),
        holes: Default::default(),
        failed: false,
    };

    let mut new_book = untyped::Book {
        holes: book.holes,
        ..Default::default()
    };

    let mut entries = FxHashMap::default();

    for name in entrypoint {
        let count = state.holes.len();
        state
            .names
            .insert(name.to_string(), (None, Relevance::Hole(count)));
        state.holes.push(Some(Relevance::Relevant));
    }

    for (name, v) in &book.entrs {
        entries.insert(name, state.erase_entry(v));
    }

    if state.failed {
        return None;
    }

    for (name, (_, relev)) in &state.names {
        if let Some(Relevance::Relevant) = state.normalize(*relev) {
            if let Some(res) = entries.remove(name) {
                new_book
                    .names
                    .insert(name.to_string(), new_book.entrs.len());
                new_book.entrs.insert(name.to_string(), res);
            }
        }
    }

    Some(new_book)
}

impl<'a> ErasureState<'a> {
    pub fn new_hole(&mut self, range: Range, name: String) -> (Option<Range>, Relevance) {
        let count = self.holes.len();
        let local_relevance = (Some(range), Relevance::Hole(count));
        self.names.insert(name, local_relevance);
        self.holes.push(None);
        local_relevance
    }

    pub fn send_err(&mut self, err: Box<PassError>) {
        self.errs.send(err).unwrap();
        self.failed = true;
    }
    pub fn err_irrelevant(
        &mut self,
        declared_val: Option<Range>,
        used: Range,
        declared_ty: Option<Range>,
    ) {
        self.send_err(Box::new(PassError::CannotUseIrrelevant(
            declared_val,
            used,
            declared_ty,
        )));
    }

    pub fn get_normal(&self, hole: usize, visited: &mut FxHashSet<usize>) -> Option<Relevance> {
        match self.holes[hole] {
            Some(Relevance::Hole(r)) if !visited.contains(&hole) => {
                visited.insert(hole);
                self.get_normal(r, visited)
            }
            other => other,
        }
    }

    pub fn normalize(&self, hole: Relevance) -> Option<Relevance> {
        match hole {
            Relevance::Hole(hole) => self.get_normal(hole, &mut Default::default()),
            other => Some(other),
        }
    }

    pub fn unify_loop(
        &mut self,
        range: Range,
        left: (Option<Range>, Relevance),
        right: (Option<Range>, Relevance),
        visited: &mut FxHashSet<usize>,
        relevance_unify: bool,
    ) -> bool {
        match (left.1, right.1) {
            (Relevance::Hole(hole), t) => match (self.holes[hole], t) {
                (Some(res), _) if !visited.contains(&hole) => {
                    visited.insert(hole);
                    self.unify_loop(range, (left.0, res), right, visited, relevance_unify)
                }

                // TODO: It should unify iff we want functions that are considered
                // "erased" in the sense that we can just remove them from the runtime and it'll
                // be fine.
                (None, Relevance::Irrelevant) => {
                    self.holes[hole] = Some(Relevance::Irrelevant);
                    true
                }

                (None, Relevance::Hole(n)) => {
                    self.holes[hole] = Some(Relevance::Hole(n));
                    true
                }

                (_, _) => true,
            },
            (Relevance::Relevant, Relevance::Hole(hole)) => match self.holes[hole] {
                Some(res) if !visited.contains(&hole) => {
                    visited.insert(hole);
                    self.unify_loop(range, left, (right.0, res), visited, relevance_unify)
                }
                _ => {
                    self.holes[hole] = Some(Relevance::Relevant);
                    true
                }
            },
            (Relevance::Irrelevant, Relevance::Hole(_))
            | (Relevance::Relevant, Relevance::Relevant)
            | (Relevance::Irrelevant, Relevance::Irrelevant)
            | (Relevance::Irrelevant, Relevance::Relevant) => true,
            (Relevance::Relevant, Relevance::Irrelevant) => false,
        }
    }

    pub fn unify(
        &mut self,
        range: Range,
        left: (Option<Range>, Relevance),
        right: (Option<Range>, Relevance),
        relevance_unify: bool,
    ) -> bool {
        self.unify_loop(range, left, right, &mut Default::default(), relevance_unify)
    }

    pub fn erase_pat_spine(
        &mut self,
        on: (Option<Range>, Relevance),
        name: &QualifiedIdent,
        spine: &Vec<Box<Expr>>,
    ) -> Vec<Box<untyped::Expr>> {
        let fun = match self.names.get(name.to_str()) {
            Some(res) => *res,
            None => self.new_hole(name.range, name.to_string()),
        };

        if !self.unify(name.range, on, fun, true) {
            self.err_irrelevant(None, name.range, None)
        }

        let entry = self.book.entrs.get(name.to_str()).unwrap();
        let erased = entry.args.iter();

        spine
            .iter()
            .zip(erased)
            .map(|(elem, arg)| {
                let relev = if arg.erased {
                    (Some(arg.range), Relevance::Irrelevant)
                } else {
                    on.clone()
                };
                (self.erase_pat(relev, elem), arg.erased)
            })
            .filter(|res| !res.1)
            .map(|res| res.0)
            .collect()
    }

    pub fn erase_pat(&mut self, on: (Option<Range>, Relevance), pat: &Expr) -> Box<untyped::Expr> {
        use kind_tree::desugared::ExprKind::*;

        match &pat.data {
            Num {
                num: Number::U60(n),
            } => untyped::Expr::num60(pat.range, *n),
            Num {
                num: Number::U120(n),
            } => untyped::Expr::num120(pat.range, *n),
            Var { name } => {
                self.ctx.insert(name.to_string(), (name.range, on));
                untyped::Expr::var(name.clone())
            }
            Fun { name, args } | Ctr { name, args } if on.1 == Relevance::Irrelevant => {
                let range = pat.range.clone();
                self.errs
                    .send(Box::new(PassError::CannotPatternMatchOnErased(range)))
                    .unwrap();
                self.failed = true;
                self.erase_pat_spine(on, &name, args);
                untyped::Expr::err(range)
            }
            Fun { name, args } => {
                let args = self.erase_pat_spine(on, &name, args);
                untyped::Expr::fun(pat.range.clone(), name.clone(), args)
            }
            Ctr { name, args } => {
                let args = self.erase_pat_spine(on, &name, args);
                untyped::Expr::ctr(pat.range.clone(), name.clone(), args)
            }
            res => panic!("Internal Error: Not a pattern {:?}", res),
        }
    }

    pub fn erase_expr(
        &mut self,
        on: &(Option<Range>, Relevance),
        expr: &Expr,
    ) -> Box<untyped::Expr> {
        use kind_tree::desugared::ExprKind::*;

        match &expr.data {
            Typ | NumType { .. } | Err | Hole { .. } | Hlp(_) => {
                if !self.unify(expr.range, *on, (None, Relevance::Irrelevant), false) {
                    self.err_irrelevant(None, expr.range, None)
                }
                // Used as sentinel value because all of these constructions
                // should not end in the generated tree.
                untyped::Expr::err(expr.range)
            }
            Num {
                num: Number::U60(n),
            } => untyped::Expr::num60(expr.range, *n),
            Num {
                num: Number::U120(n),
            } => untyped::Expr::num120(expr.range, *n),
            Str { val } => untyped::Expr::str(expr.range, val.clone()),
            Var { name } => {
                let relev = self.ctx.get(name.to_str()).unwrap();
                let declared_ty = (relev.1).0;
                let declared_val = relev.0;
                if !self.unify(name.range, *on, relev.1, false) {
                    self.err_irrelevant(Some(declared_val), name.range, declared_ty)
                }
                untyped::Expr::var(name.clone())
            }
            All {
                param, typ, body, ..
            } => {
                if !self.unify(expr.range, *on, (None, Relevance::Irrelevant), false) {
                    self.err_irrelevant(None, expr.range, None)
                }

                let ctx = self.ctx.clone();

                // Relevant inside the context that is it's being used?
                self.ctx.insert(param.to_string(), (param.range, *on));

                self.erase_expr(&(on.0, Relevance::Irrelevant), typ);
                self.erase_expr(&(on.0, Relevance::Irrelevant), body);
                self.ctx = ctx;

                // Used as sentinel value because "All" should not end in a tree.
                untyped::Expr::err(expr.range)
            }
            Lambda {
                param,
                body,
                erased,
            } => {
                let ctx = self.ctx.clone();

                if *erased {
                    self.ctx.insert(
                        param.to_string(),
                        (param.range, (None, Relevance::Irrelevant)),
                    );
                } else {
                    self.ctx.insert(param.to_string(), (param.range, *on));
                }

                let body = self.erase_expr(on, body);
                self.ctx = ctx;

                if *erased {
                    body
                } else {
                    untyped::Expr::lambda(expr.range, param.clone(), body, *erased)
                }
            }
            Let { name, val, next } => {
                let ctx = self.ctx.clone();
                self.ctx.insert(name.to_string(), (name.range, *on));

                let val = self.erase_expr(on, val);
                let next = self.erase_expr(on, next);

                self.ctx = ctx;

                untyped::Expr::let_(expr.range, name.clone(), val, next)
            }
            App { fun, args } => {
                let head = self.erase_expr(on, fun);
                let spine = args
                    .iter()
                    .map(|x| {
                        let on = if x.erased {
                            let span = expr.range;
                            if !self.unify(span, *on, (None, Relevance::Irrelevant), false) {
                                self.err_irrelevant(None, span, None)
                            }
                            (Some(x.data.range), Relevance::Irrelevant)
                        } else {
                            on.clone()
                        };
                        (x.erased, self.erase_expr(&on, &x.data))
                    })
                    .filter(|x| !x.0)
                    .map(|x| x.1)
                    .collect();

                untyped::Expr::app(expr.range, head, spine)
            }
            Fun { name, args } => {
                let spine = self.book.entrs.get(name.to_str()).unwrap().args.iter();

                let fun = match self.names.get(name.to_str()) {
                    Some(res) => *res,
                    None => self.new_hole(name.range, name.to_string()),
                };

                if !self.unify(name.range, *on, fun, true) {
                    self.err_irrelevant(None, name.range, None)
                }

                let spine = args
                    .iter()
                    .zip(spine)
                    .map(|(expr, arg)| {
                        if arg.erased {
                            (
                                self.erase_expr(&(Some(arg.range), Relevance::Irrelevant), expr),
                                arg,
                            )
                        } else {
                            (self.erase_expr(on, expr), arg)
                        }
                    })
                    .filter(|(_, arg)| !arg.erased);

                untyped::Expr::fun(
                    expr.range,
                    name.clone(),
                    spine.map(|(expr, _)| expr).collect(),
                )
            }
            Ctr { name, args } => {
                let spine = self.book.entrs.get(name.to_str()).unwrap().args.iter();

                let fun = match self.names.get(&name.to_string()) {
                    Some(res) => *res,
                    None => self.new_hole(name.range, name.to_string()),
                };

                if !self.unify(name.range, *on, fun, true) {
                    self.err_irrelevant(None, name.range, None)
                }

                let spine = args
                    .iter()
                    .zip(spine)
                    .map(|(expr, arg)| {
                        if arg.erased {
                            (
                                self.erase_expr(&(Some(arg.range), Relevance::Irrelevant), expr),
                                arg,
                            )
                        } else {
                            (self.erase_expr(on, expr), arg)
                        }
                    })
                    .filter(|(_, arg)| !arg.erased);

                untyped::Expr::ctr(
                    expr.range,
                    name.clone(),
                    spine.map(|(expr, _)| expr).collect(),
                )
            }
            Ann { expr, typ } => {
                let res = self.erase_expr(on, expr);
                self.erase_expr(&(None, Relevance::Irrelevant), typ);
                res
            }
            Sub { expr, .. } => self.erase_expr(on, expr),
            Binary { op, left, right } => untyped::Expr::binary(
                expr.range,
                *op,
                self.erase_expr(on, left),
                self.erase_expr(on, right),
            ),
        }
    }

    pub fn erase_rule(
        &mut self,
        place: &(Option<Range>, Relevance),
        args: Vec<(Range, bool)>,
        rule: &Rule,
    ) -> untyped::Rule {
        let ctx = self.ctx.clone();

        let new_pats: Vec<_> = args
            .iter()
            .zip(rule.pats.iter())
            .map(|((range, erased), expr)| {
                (
                    erased,
                    self.erase_pat(
                        (
                            Some(*range),
                            if *erased {
                                Relevance::Irrelevant
                            } else {
                                place.1.clone()
                            },
                        ),
                        expr,
                    ),
                )
            })
            .filter(|(erased, _)| !*erased)
            .map(|res| res.1)
            .collect();

        let body = self.erase_expr(place, &rule.body);

        self.ctx = ctx;

        untyped::Rule {
            name: rule.name.clone(),
            pats: new_pats,
            body,
            range: rule.range,
        }
    }

    pub fn erase_entry(&mut self, entry: &Entry) -> Box<untyped::Entry> {
        let place = if let Some(res) = self.names.get(entry.name.to_str()) {
            *res
        } else {
            self.new_hole(entry.name.range, entry.name.to_string())
        };

        let args: Vec<(Range, bool)> = entry.args.iter().map(|x| (x.range, x.erased)).collect();

        let rules = entry
            .rules
            .iter()
            .map(|rule| self.erase_rule(&place, args.clone(), rule))
            .collect::<Vec<untyped::Rule>>();

        Box::new(untyped::Entry {
            name: entry.name.clone(),
            args: entry.args.iter().filter(|x| !x.erased).map(|x| (x.name.to_string(), x.range, false)).collect(),
            rules,
            attrs: entry.attrs.clone(),
            range: entry.range,
        })
    }
}
