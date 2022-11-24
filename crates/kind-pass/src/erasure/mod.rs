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
use kind_tree::{
    desugared::{self, Book, Entry, Expr, ExprKind, Rule},
    symbol::QualifiedIdent,
};

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
) -> Option<Book> {
    let mut state = ErasureState {
        errs,
        book: &book,
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

    pub fn err_irrelevant(
        &mut self,
        declared_val: Option<Range>,
        used: Range,
        declared_ty: Option<Range>,
    ) {
        self.errs
            .send(Box::new(PassError::CannotUseIrrelevant(
                declared_val,
                used,
                declared_ty,
            )))
            .unwrap();
        self.failed = true;
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
    ) -> Vec<Box<Expr>> {
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
                    (Some(arg.span), Relevance::Irrelevant)
                } else {
                    on.clone()
                };
                (self.erase_pat(relev, elem), arg.erased)
            })
            .filter(|res| !res.1)
            .map(|res| res.0)
            .collect()
    }

    pub fn erase_pat(&mut self, on: (Option<Range>, Relevance), pat: &Expr) -> Box<Expr> {
        use kind_tree::desugared::ExprKind::*;

        match &pat.data {
            Num(_) | Str(_) => Box::new(pat.clone()),
            Var(name) => {
                self.ctx.insert(name.to_string(), (name.range, on));
                Box::new(pat.clone())
            }
            Fun(name, spine) | Ctr(name, spine) if on.1 == Relevance::Irrelevant => {
                let range = pat.span.to_range().unwrap_or_else(|| name.range.clone());
                self.errs
                    .send(Box::new(PassError::CannotPatternMatchOnErased(range)))
                    .unwrap();
                self.failed = true;
                self.erase_pat_spine(on, &name, spine);
                desugared::Expr::err(range)
            }
            Fun(name, spine) => {
                let spine = self.erase_pat_spine(on, &name, spine);
                Box::new(Expr {
                    span: pat.span.clone(),
                    data: ExprKind::Fun(name.clone(), spine),
                })
            }
            Ctr(name, spine) => {
                let spine = self.erase_pat_spine(on, &name, spine);
                Box::new(Expr {
                    span: pat.span.clone(),
                    data: ExprKind::Ctr(name.clone(), spine),
                })
            }
            res => panic!("Internal Error: Not a pattern {:?}", res),
        }
    }

    pub fn erase_expr(&mut self, on: &(Option<Range>, Relevance), expr: &Expr) -> Box<Expr> {
        use kind_tree::desugared::ExprKind::*;

        match &expr.data {
            Num(_) | Str(_) => Box::new(expr.clone()),
            Typ | NumType(_) | Err | Hole(_) | Hlp(_) => {
                let span = expr.span.to_range().unwrap();
                if !self.unify(span, *on, (None, Relevance::Irrelevant), false) {
                    self.err_irrelevant(None, span, None)
                }
                Box::new(expr.clone())
            }
            Var(name) => {
                let relev = self.ctx.get(name.to_str()).unwrap();
                let declared_ty = (relev.1).0;
                let declared_val = relev.0;
                if !self.unify(name.range, *on, relev.1, false) {
                    self.err_irrelevant(Some(declared_val), name.range, declared_ty)
                }
                Box::new(expr.clone())
            }
            All(name, typ, body, _erased) => {
                let span = expr.span.to_range().unwrap_or_else(|| name.range.clone());
                if !self.unify(span, *on, (None, Relevance::Irrelevant), false) {
                    self.err_irrelevant(None, span, None)
                }

                let ctx = self.ctx.clone();

                // Relevant inside the context that is it's being used?
                self.ctx.insert(name.to_string(), (name.range, *on));

                self.erase_expr(&(on.0, Relevance::Irrelevant), typ);
                self.erase_expr(&(on.0, Relevance::Irrelevant), body);
                self.ctx = ctx;

                Box::new(expr.clone())
            }
            Lambda(name, body, erased) => {
                let ctx = self.ctx.clone();
                if *erased {
                    self.ctx.insert(
                        name.to_string(),
                        (name.range, (None, Relevance::Irrelevant)),
                    );

                    let span = expr.span.to_range().unwrap_or_else(|| name.range.clone());
                    if !self.unify(span, *on, (None, Relevance::Irrelevant), false) {
                        self.err_irrelevant(None, span, None)
                    }
                } else {
                    self.ctx.insert(name.to_string(), (name.range, *on));
                }
                let body = self.erase_expr(on, body);
                self.ctx = ctx;

                if *erased {
                    body
                } else {
                    Box::new(Expr {
                        span: expr.span,
                        data: ExprKind::Lambda(name.clone(), body, *erased),
                    })
                }
            }
            Let(name, val, body) => {
                let ctx = self.ctx.clone();
                self.ctx.insert(name.to_string(), (name.range, *on));

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
                let spine = spine
                    .iter()
                    .map(|x| {
                        let on = if x.erased {
                            let span = expr.span.to_range().unwrap();
                            if !self.unify(span, *on, (None, Relevance::Irrelevant), false) {
                                self.err_irrelevant(None, span, None)
                            }
                            (x.data.span.to_range(), Relevance::Irrelevant)
                        } else {
                            on.clone()
                        };
                        desugared::AppBinding {
                            data: self.erase_expr(&on, &x.data),
                            erased: x.erased,
                        }
                    })
                    .filter(|x| !x.erased)
                    .collect();
                Box::new(Expr {
                    span: expr.span,
                    data: ExprKind::App(head, spine),
                })
            }
            Fun(head, spine) => {
                let args = self.book.entrs.get(head.to_str()).unwrap().args.iter();

                let fun = match self.names.get(head.to_str()) {
                    Some(res) => *res,
                    None => self.new_hole(head.range, head.to_string()),
                };

                if !self.unify(head.range, *on, fun, true) {
                    self.err_irrelevant(None, head.range, None)
                }

                let spine = spine
                    .iter()
                    .zip(args)
                    .map(|(expr, arg)| {
                        if arg.erased {
                            (
                                self.erase_expr(&(Some(arg.span), Relevance::Irrelevant), expr),
                                arg,
                            )
                        } else {
                            (self.erase_expr(on, expr), arg)
                        }
                    })
                    .filter(|(_, arg)| !arg.erased);

                Box::new(Expr {
                    span: expr.span,
                    data: ExprKind::Fun(head.clone(), spine.map(|(expr, _)| expr).collect()),
                })
            }
            Ctr(head, spine) => {
                let args = self.book.entrs.get(head.to_str()).unwrap().args.iter();

                let fun = match self.names.get(&head.to_string()) {
                    Some(res) => *res,
                    None => self.new_hole(head.range, head.to_string()),
                };

                if !self.unify(head.range, *on, fun, true) {
                    self.err_irrelevant(None, head.range, None)
                }

                let spine = spine
                    .iter()
                    .zip(args)
                    .map(|(expr, arg)| {
                        if arg.erased {
                            (
                                self.erase_expr(&(Some(arg.span), Relevance::Irrelevant), expr),
                                arg,
                            )
                        } else {
                            (self.erase_expr(on, expr), arg)
                        }
                    })
                    .filter(|(_, arg)| !arg.erased);

                Box::new(Expr {
                    span: expr.span,
                    data: ExprKind::Ctr(head.clone(), spine.map(|(expr, _)| expr).collect()),
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

        Rule {
            name: rule.name.clone(),
            pats: new_pats,
            body,
            span: rule.span,
        }
    }

    pub fn erase_entry(&mut self, entry: &Entry) -> Box<Entry> {
        let place = if let Some(res) = self.names.get(entry.name.to_str()) {
            *res
        } else {
            self.new_hole(entry.name.range, entry.name.to_string())
        };

        let args: Vec<(Range, bool)> = entry.args.iter().map(|x| (x.span, x.erased)).collect();
        let rules = entry
            .rules
            .iter()
            .map(|rule| self.erase_rule(&place, args.clone(), rule))
            .collect::<Vec<Rule>>();
        Box::new(Entry {
            name: entry.name.clone(),
            args: entry.args.clone(),
            typ: entry.typ.clone(),
            rules,
            attrs: entry.attrs.clone(),
            span: entry.span,
        })
    }
}
