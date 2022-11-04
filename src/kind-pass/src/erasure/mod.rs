//! Erases everything that is not relevant to the output.
//! It's a simpler version of what I want to do in order
//! to finish a stable version of the compiler.

// FIX: Need to make a "constraint map" in order to check
// if a irrelevant thing is relevant in relation to the
// function that we are trying to check the irrelevance.

// Not the best algorithm... it should not be trusted for
// dead code elimination.

use std::sync::mpsc::Sender;

use fxhash::{FxHashMap, FxHashSet};

use kind_report::data::DiagnosticFrame;

use kind_span::Range;
use kind_tree::{
    desugared::{Book, Entry, Expr, ExprKind, Rule},
    symbol::Ident,
};

use crate::errors::PassError;

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum Relevance {
    Irrelevant,
    Relevant,
    Hole(usize),
}
pub struct ErasureState<'a> {
    errs: Sender<DiagnosticFrame>,
    book: &'a Book,

    ctx: im::HashMap<String, (Range, (Option<Range>, Relevance))>,

    names: FxHashMap<String, (Option<Range>, Relevance)>,
    holes: Vec<Option<Relevance>>,
    failed: bool,
}

pub fn erase_book(
    book: &Book,
    errs: Sender<DiagnosticFrame>,
    entrypoint: FxHashSet<String>,
) -> Option<Book> {
    let mut state = ErasureState {
        errs,
        book,
        ctx: Default::default(),
        names: Default::default(),
        holes: Default::default(),
        failed: false,
    };

    let mut new_book = Book {
        holes: book.holes,
        ..Default::default()
    };

    let mut entries = FxHashMap::default();

    for name in entrypoint {
        let count = state.holes.len();
        let ty = (None, Relevance::Hole(count));
        state.names.insert(name.to_string(), ty.clone());
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
            new_book.entrs.insert(name.clone(), entries.get(name).unwrap().clone());
        }
    }

    Some(new_book)
}

pub fn erasure_to_relevance(erased: bool) -> Relevance {
    if erased {
        Relevance::Irrelevant
    } else {
        Relevance::Relevant
    }
}

impl<'a> ErasureState<'a> {
    pub fn new_hole(&mut self, name: Ident) -> (Option<Range>, Relevance) {
        let count = self.holes.len();
        let ty = (Some(name.range.clone()), Relevance::Hole(count));
        self.names.insert(name.to_string(), ty.clone());
        self.holes.push(None);
        ty
    }

    pub fn err_irrelevant(&mut self, declared_val: Option<Range>, used: Range, declared_ty: Option<Range>) {
        self.errs
            .send(
                PassError::CannotUseIrrelevant(declared_val, used, declared_ty)
                    .into(),
            )
            .unwrap();
        self.failed = true;
    }

    pub fn get_normal(&self, hole: usize, visited: &mut FxHashSet<usize>) -> Option<Relevance> {
        match self.holes[hole] {
            Some(Relevance::Hole(r)) if !visited.contains(&hole) => {
                visited.insert(hole);
                self.get_normal(r, visited)
            }
            other => other
        }
    }

    pub fn normalize(&self, hole: Relevance) -> Option<Relevance> {
        match hole {
            Relevance::Hole(hole) => self.get_normal(hole, &mut Default::default()),
            other => Some(other)
        }
    }

    pub fn unify_hole(
        &mut self,
        range: Range,
        hole: (Option<Range>, usize),
        right: (Option<Range>, Relevance),
        visited: &mut FxHashSet<usize>,
        inverted: bool,
    ) -> bool {
        match (self.holes[hole.1], right.1) {
            (_, Relevance::Relevant) => true,
            (Some(Relevance::Hole(n)), t) => {
                visited.insert(n);
                if visited.contains(&n) {
                    self.holes[hole.1] = Some(t);
                    true
                } else {
                    self.unify_hole(range, (hole.0, n), right, visited, inverted)
                }
            }
            (Some(l), _) => {
                if inverted {
                    self.unify_loop(range, right, (hole.0, l), visited)
                } else {
                    self.unify_loop(range, (hole.0, l), right, visited)
                }
            }
            (None, r) => {
                self.holes[hole.1] = Some(r);
                true
            }
        }
    }

    pub fn unify_loop(
        &mut self,
        range: Range,
        left: (Option<Range>, Relevance),
        right: (Option<Range>, Relevance),
        visited: &mut FxHashSet<usize>,
    ) -> bool {
        match (left.1, right.1) {
            (_, Relevance::Hole(hole)) => {
                self.unify_hole(range, (right.0, hole), left, visited, true)
            }
            (Relevance::Hole(hole), _) => {
                self.unify_hole(range, (left.0, hole), right, visited, false)
            }

            (Relevance::Irrelevant, Relevance::Irrelevant)
            | (Relevance::Irrelevant, Relevance::Relevant)
            | (Relevance::Relevant, Relevance::Relevant) => true,

            (Relevance::Relevant, Relevance::Irrelevant) => {
                false
            }
        }
    }

    pub fn unify(
        &mut self,
        range: Range,
        left: (Option<Range>, Relevance),
        right: (Option<Range>, Relevance),
    ) -> bool {
        self.unify_loop(range, left, right, &mut Default::default())
    }

    pub fn erase_pat(&mut self, on: (Option<Range>, Relevance), pat: &Expr) {
        use kind_tree::desugared::ExprKind::*;

        match &pat.data {
            Num(_) | Str(_) => (),
            Var(name) => {
                self.ctx.insert(name.to_string(), (name.range, on));
            }
            Fun(name, spine) | Ctr(name, spine) => {
                let fun = match self.names.get(&name.to_string()) {
                    Some(res) => res.clone(),
                    None => self.new_hole(name.clone()),
                };

                if !self.unify(name.range, on, fun) {
                    self.err_irrelevant(None, name.range, None)
                }

                let entry = self.book.entrs.get(name.to_str()).unwrap();
                let erased = entry.args.iter();

                let irrelevances = erased.map(|arg| {
                    if on.1 == Relevance::Irrelevant {
                        on
                    } else if arg.erased {
                        (Some(arg.span), Relevance::Irrelevant)
                    } else {
                        (Some(arg.span), Relevance::Relevant)
                    }
                });

                spine
                    .iter()
                    .zip(irrelevances)
                    .for_each(|(arg, relev)| self.erase_pat(relev, arg));
            }
            _ => panic!("Internal Error: Not a pattern"),
        }
    }

    pub fn erase_expr(&mut self, on: &(Option<Range>, Relevance), expr: &Expr) -> Box<Expr> {
        use kind_tree::desugared::ExprKind::*;

        match &expr.data {
            Typ | U60 | Num(_) | Str(_) | Err => Box::new(expr.clone()),
            Hole(_) | Hlp(_) => Box::new(expr.clone()),
            Var(name) => {
                let relev = self.ctx.get(&name.to_string()).unwrap();
                let declared_ty = (relev.1).0;
                let declared_val = relev.0;
                if !self.unify(name.range, on.clone(), relev.1) {
                    self.err_irrelevant(Some(declared_val), name.range, declared_ty)
                }
                Box::new(expr.clone())
            }
            All(name, typ, body) => {
                let ctx = self.ctx.clone();

                // Relevant inside the context that is it's being used?
                self.ctx.insert(name.to_string(), (name.range, on.clone()));

                self.erase_expr(&(on.0, Relevance::Irrelevant), typ);
                self.erase_expr(&(on.0, Relevance::Irrelevant), body);
                self.ctx = ctx;

                Box::new(expr.clone())
            }
            Lambda(name, body) => {
                let ctx = self.ctx.clone();
                self.ctx.insert(name.to_string(), (name.range, on.clone()));
                let body = self.erase_expr(on, body);
                self.ctx = ctx;

                Box::new(Expr {
                    span: expr.span,
                    data: ExprKind::Lambda(name.clone(), body),
                })
            }
            Let(name, val, body) => {
                let ctx = self.ctx.clone();
                self.ctx.insert(name.to_string(), (name.range, on.clone()));

                let val = self.erase_expr(on, val);
                let body = self.erase_expr(on, body);

                self.ctx = ctx;

                Box::new(Expr {
                    span: expr.span,
                    data: ExprKind::Let(name.clone(), val, body),
                })
            }
            App(head, spine) => {
                let head = self.erase_expr(on, head);
                let spine = spine.iter().map(|x| self.erase_expr(on, x)).collect();
                Box::new(Expr {
                    span: expr.span,
                    data: ExprKind::App(head, spine),
                })
            }
            Fun(head, spine) => {
                let args = self.book.entrs.get(head.to_str()).unwrap().args.iter();

                let fun = match self.names.get(&head.to_string()) {
                    Some(res) => res.clone(),
                    None => self.new_hole(head.clone()),
                };

                if !self.unify(head.range, on.clone(), fun) {
                    self.err_irrelevant(None, head.range, None)
                }

                let spine = spine.iter().zip(args).map(|(expr, arg)| {
                    self.erase_expr(&(Some(arg.span), erasure_to_relevance(arg.erased)), expr)
                });

                Box::new(Expr {
                    span: expr.span,
                    data: ExprKind::Fun(head.clone(), spine.collect()),
                })
            }
            Ctr(head, spine) => {
                let args = self.book.entrs.get(head.to_str()).unwrap().args.iter();

                let fun = match self.names.get(&head.to_string()) {
                    Some(res) => res.clone(),
                    None => self.new_hole(head.clone()),
                };

                if !self.unify(head.range, on.clone(), fun) {
                    self.err_irrelevant(None, head.range, None)
                }

                let spine = spine.iter().zip(args).map(|(expr, arg)| {
                    self.erase_expr(&(Some(arg.span), erasure_to_relevance(arg.erased)), expr)
                });

                Box::new(Expr {
                    span: expr.span,
                    data: ExprKind::Ctr(head.clone(), spine.collect()),
                })
            }
            Ann(relev, irrel) => {
                let res = self.erase_expr(on, relev);
                self.erase_expr(&(None, Relevance::Irrelevant), irrel);
                res
            }
            Sub(_, _, _, expr) => self.erase_expr(on, expr),
            Binary(op, left, right) => Box::new(Expr {
                span: expr.span,
                data: ExprKind::Binary(*op, self.erase_expr(on, left), self.erase_expr(on, right)),
            }),
        }
    }

    pub fn erase_rule(
        &mut self,
        place: &(Option<Range>, Relevance),
        args: Vec<(Range, bool)>,
        rule: &Rule,
    ) -> Rule {
        let ctx = self.ctx.clone();

        args.iter()
            .zip(rule.pats.iter())
            .for_each(|((range, erased), expr)| {
                self.erase_pat((Some(*range), erasure_to_relevance(*erased)), expr)
            });

        let body = self.erase_expr(place, &rule.body);

        self.ctx = ctx;

        let new_pats = args
            .iter()
            .zip(rule.pats.iter())
            .filter(|((_, erased), _)| !*erased)
            .map(|res| res.1)
            .cloned();

        Rule {
            name: rule.name.clone(),
            pats: new_pats.collect(),
            body,
            span: rule.span,
        }
    }

    pub fn erase_entry(&mut self, entry: &Entry) -> Box<Entry> {
        let place = if let Some(res) = self.names.get(&entry.name.to_string()) {
            res.clone()
        } else {
            self.new_hole(entry.name.clone())
        };

        let args: Vec<(Range, bool)> = entry.args.iter().map(|x| (x.span, x.erased)).collect();
        let rules = entry
            .rules
            .iter()
            .map(|rule| self.erase_rule(&place, args.clone(), rule));
        Box::new(Entry {
            name: entry.name.clone(),
            args: entry.args.clone(),
            typ: entry.typ.clone(),
            rules: rules.collect(),
            attrs: entry.attrs.clone(),
            span: entry.span,
        })
    }
}