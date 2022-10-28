//! Erases everything that is not relevant to the output.
//! It's a simpler version of what I want to do in order
//! to finish a stable version of the compiler.

use crate::errors::PassError;
use std::sync::mpsc::Sender;

use fxhash::{FxHashMap, FxHashSet};

use kind_report::data::DiagnosticFrame;

use kind_span::Range;
use kind_tree::desugared::{Book, Entry, Expr, ExprKind, Rule};

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum Relevance {
    Irrelevant,
    Relevant,
}

pub struct ErasureState<'a> {
    errs: Sender<DiagnosticFrame>,
    book: &'a Book,
    ctx: im::HashMap<String, (Option<Range>, Range, Relevance)>,
    is_relevant: FxHashSet<String>,
}

pub fn erase_book(
    book: &Book,
    errs: Sender<DiagnosticFrame>,
    entrypoint: FxHashSet<String>,
) -> Book {
    let mut state = ErasureState {
        errs,
        book,
        ctx: Default::default(),
        is_relevant: entrypoint,
    };

    let mut new_book = Book {
        holes: book.holes,
        ..Default::default()
    };

    let mut entries = FxHashMap::default();

    for (name, v) in &book.entrs {
        entries.insert(name, state.erase_entry(v));
    }

    for name in state.is_relevant {
        if let Some(res) = entries.get(&name) {
            new_book.entrs.insert(name.clone(), res.to_owned());
        }
    }

    new_book
}

pub fn erase_to_relevance(erased: bool) -> Relevance {
    if erased {
        Relevance::Irrelevant
    } else {
        Relevance::Relevant
    }
}

impl<'a> ErasureState<'a> {
    pub fn erase_pat(&mut self, on: (Range, Relevance), pat: &Expr) {
        use kind_tree::desugared::ExprKind::*;

        match &pat.data {
            Var(name) => {
                self.ctx.insert(name.to_string(), (Some(name.range.clone()), on.0, on.1));
            }
            Num(_) | Str(_) => (),
            Fun(name, spine) | Ctr(name, spine) => {
                if on.1 == Relevance::Relevant {
                    self.is_relevant.insert(name.to_string());
                }

                let entry = self.book.entrs.get(name.to_str()).unwrap();
                let erased = entry.args.iter();

                let irrelevances = erased.map(|arg| {
                    if on.1 == Relevance::Irrelevant {
                        on
                    } else if arg.erased {
                        (arg.span, Relevance::Irrelevant)
                    } else {
                        (arg.span, Relevance::Relevant)
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

    pub fn erase_expr(&mut self, on: Relevance, expr: &Expr) -> Box<Expr> {
        use kind_tree::desugared::ExprKind::*;

        match &expr.data {
            Typ | U60 | Num(_) | Str(_) | Err => Box::new(expr.clone()),
            Hole(_) | Hlp(_) => {
                todo!()
            }
            Var(name) => {
                let relev = self.ctx.get(name.to_str()).unwrap();
                match (relev.2, on) {
                    (Relevance::Irrelevant, Relevance::Relevant) => {
                        self.errs
                            .send(PassError::CannotUseIrrelevant(relev.0, name.range, relev.1).into())
                            .unwrap();
                        Expr::err(name.range)
                    }
                    _ => Box::new(expr.clone()),
                }
            }
            All(name, typ, body) => {
                let ctx = self.ctx.clone();
    
                // Relevant inside the context that is it's being used?
                self.ctx
                    .insert(name.to_string(), (None, name.range, Relevance::Relevant));

                self.erase_expr(Relevance::Irrelevant, typ);
                self.erase_expr(Relevance::Irrelevant, body);
                self.ctx = ctx;

                Box::new(expr.clone())
            }
            Lambda(name, body) => {
                let ctx = self.ctx.clone();
                self.ctx
                    .insert(name.to_string(), (None, name.range, Relevance::Irrelevant));
                let body = self.erase_expr(on, body);
                self.ctx = ctx;

                Box::new(Expr {
                    span: expr.span,
                    data: ExprKind::Lambda(name.clone(), body),
                })
            }
            Let(name, val, body) => {
                let ctx = self.ctx.clone();
                self.ctx.insert(name.to_string(), (None, name.range, on));

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
                if on == Relevance::Relevant {
                    self.is_relevant.insert(head.to_string());
                }

                let args = self.book.entrs.get(head.to_str()).unwrap().args.iter();

                let spine = spine
                    .iter()
                    .zip(args)
                    .map(|(expr, arg)| self.erase_expr(erase_to_relevance(arg.erased), expr));

                Box::new(Expr {
                    span: expr.span,
                    data: ExprKind::Fun(head.clone(), spine.collect()),
                })
            }
            Ctr(head, spine) => {
                if on == Relevance::Relevant {
                    self.is_relevant.insert(head.to_string());
                }

                let args = self.book.entrs.get(head.to_str()).unwrap().args.iter();

                let spine = spine
                    .iter()
                    .zip(args)
                    .map(|(expr, arg)| self.erase_expr(erase_to_relevance(arg.erased), expr));

                Box::new(Expr {
                    span: expr.span,
                    data: ExprKind::Ctr(head.clone(), spine.collect()),
                })
            }
            Ann(relev, irrel) => {
                let res = self.erase_expr(on, relev);
                self.erase_expr(Relevance::Irrelevant, irrel);
                res
            }
            Sub(_, _, _, expr) => self.erase_expr(on, expr),
            Binary(op, left, right) => Box::new(Expr {
                span: expr.span,
                data: ExprKind::Binary(*op, self.erase_expr(on, left), self.erase_expr(on, right)),
            }),
        }
    }

    pub fn erase_rule(&mut self, args: Vec<(Range, bool)>, rule: &Rule) -> Rule {
        let ctx = self.ctx.clone();

        args.iter()
            .zip(rule.pats.iter())
            .for_each(|((range, erased), expr)| {
                self.erase_pat((range.clone(), erase_to_relevance(*erased)), expr)
            });

        let body = self.erase_expr(Relevance::Relevant, &rule.body);

        self.ctx = ctx;

        Rule {
            name: rule.name.clone(),
            pats: rule.pats.clone(),
            body,
            span: rule.span,
        }
    }

    pub fn erase_entry(&mut self, entry: &Entry) -> Box<Entry> {
        let args: Vec<(Range, bool)> = entry.args.iter().map(|x| (x.span, x.erased)).collect();
        let rules = entry
            .rules
            .iter()
            .map(|rule| self.erase_rule(args.clone(), rule));
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
