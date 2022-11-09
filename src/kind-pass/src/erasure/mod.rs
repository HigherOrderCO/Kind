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
use kind_tree::desugared::{Book, Entry, Expr, ExprKind, Rule};

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
            if let Some(res) = entries.get(name) {
                new_book.entrs.insert(name.to_string(), res.clone());
            }
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
            .send(PassError::CannotUseIrrelevant(declared_val, used, declared_ty).into())
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

    pub fn unify_hole(
        &mut self,
        range: Range,
        hole: (Option<Range>, usize),
        right: (Option<Range>, Relevance),
        visited: &mut FxHashSet<usize>,
        inverted: bool,
        relevance_unify: bool,
    ) -> bool {
        match (self.holes[hole.1], right.1) {
            (Some(Relevance::Hole(n)), t) => {
                visited.insert(n);
                if visited.contains(&n) {
                    self.holes[hole.1] = Some(t);
                    true
                } else {
                    self.unify_hole(
                        range,
                        (hole.0, n),
                        right,
                        visited,
                        inverted,
                        relevance_unify,
                    )
                }
            }
            (_, Relevance::Relevant) => true,
            (Some(l), _) => {
                if inverted {
                    self.unify_loop(range, right, (hole.0, l), visited, relevance_unify)
                } else {
                    self.unify_loop(range, (hole.0, l), right, visited, relevance_unify)
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
        relevance_unify: bool,
    ) -> bool {
        match (left.1, right.1) {
            (_, Relevance::Hole(hole)) => {
                self.unify_hole(range, (right.0, hole), left, visited, true, relevance_unify)
            }
            (Relevance::Hole(hole), _) => self.unify_hole(
                range,
                (left.0, hole),
                right,
                visited,
                false,
                relevance_unify,
            ),

            (Relevance::Irrelevant, Relevance::Irrelevant)
            | (Relevance::Irrelevant, Relevance::Relevant)
            | (Relevance::Relevant, Relevance::Relevant) => true,

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

    pub fn erase_pat(&mut self, on: (Option<Range>, Relevance), pat: &Expr) {
        use kind_tree::desugared::ExprKind::*;

        match &pat.data {
            Num(_) | Str(_) => (),
            Var(name) => {
                self.ctx.insert(name.to_string(), (name.range, on));
            }
            Fun(name, spine) | Ctr(name, spine) => {
                let fun = match self.names.get(&name.to_string()) {
                    Some(res) => *res,
                    None => self.new_hole(name.range, name.to_string()),
                };

                if !self.unify(name.range, on, fun, true) {
                    self.err_irrelevant(None, name.range, None)
                }

                let entry = self.book.entrs.get(name.to_string().as_str()).unwrap();
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
            res => panic!("Internal Error: Not a pattern {:?}", res),
        }
    }

    pub fn erase_expr(&mut self, on: &(Option<Range>, Relevance), expr: &Expr) -> Box<Expr> {
        use kind_tree::desugared::ExprKind::*;

        match &expr.data {
            Typ | U60 | Num(_) | Str(_) | Err => Box::new(expr.clone()),
            Hole(_) | Hlp(_) => match &expr.span {
                kind_span::Span::Generated => Box::new(expr.clone()),
                kind_span::Span::Locatable(span) => {
                    if !self.unify(*span, *on, (None, Relevance::Irrelevant), false) {
                        self.err_irrelevant(None, *span, None)
                    }
                    Box::new(expr.clone())
                }
            },
            Var(name) => {
                let relev = self.ctx.get(&name.to_string()).unwrap();
                let declared_ty = (relev.1).0;
                let declared_val = relev.0;
                if !self.unify(name.range, *on, relev.1, false) {
                    self.err_irrelevant(Some(declared_val), name.range, declared_ty)
                }
                Box::new(expr.clone())
            }
            All(name, typ, body) => {
                let ctx = self.ctx.clone();

                // Relevant inside the context that is it's being used?
                self.ctx.insert(name.to_string(), (name.range, *on));

                self.erase_expr(&(on.0, Relevance::Irrelevant), typ);
                self.erase_expr(&(on.0, Relevance::Irrelevant), body);
                self.ctx = ctx;

                Box::new(expr.clone())
            }
            Lambda(name, body) => {
                let ctx = self.ctx.clone();
                self.ctx.insert(name.to_string(), (name.range, *on));
                let body = self.erase_expr(on, body);
                self.ctx = ctx;

                Box::new(Expr {
                    span: expr.span,
                    data: ExprKind::Lambda(name.clone(), body),
                })
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
                let spine = spine.iter().map(|x| self.erase_expr(on, x)).collect();
                Box::new(Expr {
                    span: expr.span,
                    data: ExprKind::App(head, spine),
                })
            }
            Fun(head, spine) => {
                let args = self
                    .book
                    .entrs
                    .get(head.to_string().as_str())
                    .unwrap()
                    .args
                    .iter();

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
                        (
                            self.erase_expr(
                                &(Some(arg.span), erasure_to_relevance(arg.erased)),
                                expr,
                            ),
                            arg,
                        )
                    })
                    .filter(|(_, arg)| !arg.erased);

                Box::new(Expr {
                    span: expr.span,
                    data: ExprKind::Fun(head.clone(), spine.map(|(expr, _)| expr).collect()),
                })
            }
            Ctr(head, spine) => {
                let args = self
                    .book
                    .entrs
                    .get(head.to_string().as_str())
                    .unwrap()
                    .args
                    .iter();

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
                        (
                            self.erase_expr(
                                &(Some(arg.span), erasure_to_relevance(arg.erased)),
                                expr,
                            ),
                            arg,
                        )
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
            *res
        } else {
            self.new_hole(entry.name.range, entry.name.to_string())
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
