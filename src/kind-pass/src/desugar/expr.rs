use std::collections::HashMap;

use kind_span::{Locatable, Range, Span};
use kind_tree::{concrete, desugared, symbol::Ident};

use crate::errors::PassError;

use super::DesugarState;

impl<'a> DesugarState<'a> {
    pub fn desugar_app(
        &mut self,
        range: Range,
        head: &concrete::expr::Expr,
        spine: &[concrete::Binding],
    ) -> Box<desugared::Expr> {
        match &head.data {
            concrete::ExprKind::Constr(name) => {
                let entry = self
                    .old_glossary
                    .count
                    .get(&name.data.0)
                    .expect("Cannot find definition");

                let mut positions = HashMap::new();
                let mut arguments = vec![None; entry.arguments.0.len()];

                let (hidden, _erased) = entry.arguments.count_implicits();

                // Check if we should just fill all the implicits
                let fill_hidden = spine.len() == entry.arguments.len() - hidden;

                if fill_hidden {
                    for i in 0..entry.arguments.len() {
                        if entry.arguments[i].hidden {
                            // It's not expected that positional arguments require the range so
                            // it's the reason why we are using a terrible "ghost range"
                            arguments[i] = Some((
                                Range::ghost_range(),
                                Box::new(desugared::Expr {
                                    data: desugared::ExprKind::Hole(self.gen_hole()),
                                    span: Span::Generated,
                                }),
                            ))
                        }
                }
                } else if entry.arguments.len() != spine.len() {
                    self.errors
                        .send(
                            PassError::IncorrectArity(head.locate(), entry.arguments.len(), hidden)
                                .into(),
                        )
                        .unwrap();

                    return Box::new(desugared::Expr {
                        data: desugared::ExprKind::Err,
                        span: Span::Locatable(range),
                    });
                }

                for i in 0..entry.arguments.len() {
                    positions.insert(entry.arguments[i].name.data.0.clone(), i);
                }

                for arg in spine {
                    match arg {
                        concrete::Binding::Positional(_) => (),
                        concrete::Binding::Named(r, name, v) => {
                            let pos = *positions
                                .get(&name.data.0)
                                .expect("Cannot find variable wtf");
                            if let Some((range, _)) = arguments[pos] {
                                self.errors
                                    .send(PassError::DuplicatedNamed(range, *r).into())
                                    .unwrap();
                            } else {
                                arguments[pos] = Some((*r, self.desugar_expr(v)))
                            }
                        }
                    }
                }

                for arg in spine {
                    match arg {
                        concrete::Binding::Positional(v) => {
                            for i in 0..entry.arguments.len() {
                                let arg_decl = &entry.arguments[i];
                                if (fill_hidden && arg_decl.hidden) || arguments[i].is_some() {
                                    continue;
                                }
                                arguments[i] = Some((v.range, self.desugar_expr(v)));
                                break;
                            }
                        }
                        concrete::Binding::Named(_, _, _) => (),
                    }
                }

                if arguments.iter().any(|x| x.is_none()) {
                    return Box::new(desugared::Expr {
                        data: desugared::ExprKind::Err,
                        span: Span::Locatable(range),
                    });
                }

                let new_spine = arguments.iter().map(|x| x.clone().unwrap().1).collect();

                Box::new(desugared::Expr {
                    data: if entry.is_ctr {
                        desugared::ExprKind::Ctr(name.clone(), new_spine)
                    } else {
                        desugared::ExprKind::Fun(name.clone(), new_spine)
                    },
                    span: Span::Locatable(range),
                })
            }
            _ => {
                let mut new_spine = Vec::new();
                let new_head = self.desugar_expr(head);
                for arg in spine {
                    match arg {
                        concrete::Binding::Positional(v) => new_spine.push(self.desugar_expr(v)),
                        concrete::Binding::Named(r, _, v) => {
                            self.errors
                                .send(PassError::CannotUseNamed(head.range, *r).into())
                                .unwrap();
                            new_spine.push(self.desugar_expr(v))
                        }
                    }
                }
                Box::new(desugared::Expr {
                    data: desugared::ExprKind::App(new_head, new_spine),
                    span: Span::Locatable(range),
                })
            }
        }
    }

    pub fn desugar_literal(
        &mut self,
        range: Range,
        literal: &concrete::expr::Literal,
    ) -> Box<desugared::Expr> {
        match literal {
            concrete::Literal::Type => Box::new(desugared::Expr {
                data: desugared::ExprKind::Typ,
                span: Span::Locatable(range),
            }),
            concrete::Literal::Help(s) => Box::new(desugared::Expr {
                data: desugared::ExprKind::Hlp(s.clone()),
                span: Span::Locatable(range),
            }),
            concrete::Literal::U60 => Box::new(desugared::Expr {
                data: desugared::ExprKind::U60,
                span: Span::Locatable(range),
            }),
            concrete::Literal::Number(s) => Box::new(desugared::Expr {
                data: desugared::ExprKind::Num(*s),
                span: Span::Locatable(range),
            }),
            concrete::Literal::Char(_) => todo!(),
            concrete::Literal::String(_) => todo!(),
        }
    }

    pub fn desugar_let(
        &mut self,
        range: Range,
        binding: &concrete::expr::Destruct,
        val: &concrete::expr::Expr,
        next: &concrete::expr::Expr,
    ) -> Box<desugared::Expr> {
        match binding {
            concrete::Destruct::Destruct(tipo, case, jump_rest) => {
                let entry = self.old_glossary.entries.get(&tipo.data.0).expect(&format!("Not resolved typed lol {:?}", &tipo.data.0));
                if !entry.is_record() {
                    self.errors
                    .send(PassError::LetDestructOnlyForRecord(tipo.range).into())
                    .unwrap();
                    return Box::new(desugared::Expr {
                        data: desugared::ExprKind::Err,
                        span: Span::Locatable(range),
                    });
                }

                todo!()
            },
            concrete::Destruct::Ident(name) => {
                Box::new(desugared::Expr {
                    data: desugared::ExprKind::Let(name.clone(), self.desugar_expr(val), self.desugar_expr(next)),
                    span: Span::Locatable(range),
                })
            },
        }
    }

    pub fn desugar_match(&mut self, _match: &concrete::expr::Match) -> Box<desugared::Expr> {
        todo!()
    }

    pub fn desugar_sub(&mut self, _sub: &concrete::expr::Substitution) -> Box<desugared::Expr> {
        todo!()
    }

    pub fn desugar_do(&mut self, _typ: &Ident, _sttm: &concrete::expr::Sttm) -> Box<desugared::Expr> {
        todo!()
    }

    pub fn desugar_sigma(&mut self, _name: &Option<Ident>, _typ: &concrete::expr::Expr, _body: &concrete::expr::Expr) -> Box<desugared::Expr> {
        todo!()
    }

    pub fn desugar_list(&mut self, _expr: &[concrete::expr::Expr]) -> Box<desugared::Expr> {
        todo!()
    }

    pub fn desugar_if(&mut self, _cond: &concrete::expr::Expr, _if_: &concrete::expr::Expr, _else_: &concrete::expr::Expr) -> Box<desugared::Expr> {
        todo!()
    }

    pub fn desugar_pair(&mut self, _fst: &concrete::expr::Expr, _snd: &concrete::expr::Expr) -> Box<desugared::Expr> {
        todo!()
    }

    pub fn desugar_expr(&mut self, expr: &concrete::expr::Expr) -> Box<desugared::Expr> {
        use concrete::expr::ExprKind::*;
        match &expr.data {
            App(head, spine) => self.desugar_app(expr.range, head, spine),
            Lit(literal) => self.desugar_literal(expr.range, literal),
            Var(ident) => Box::new(desugared::Expr {
                data: desugared::ExprKind::Var(ident.clone()),
                span: Span::Locatable(expr.range),
            }),
            Constr(ident) => Box::new(desugared::Expr {
                data: desugared::ExprKind::Var(ident.clone()),
                span: Span::Locatable(expr.range),
            }),
            Hole => Box::new(desugared::Expr {
                data: desugared::ExprKind::Hole(self.gen_hole()),
                span: Span::Locatable(expr.range),
            }),
            All(ident, typ, body) => Box::new(desugared::Expr {
                data: desugared::ExprKind::All(
                    ident.clone(),
                    self.desugar_expr(typ),
                    self.desugar_expr(body),
                ),
                span: Span::Locatable(expr.range),
            }),
            Lambda(ident, _typ, body) => Box::new(desugared::Expr {
                data: desugared::ExprKind::Lambda(ident.clone(), self.desugar_expr(body)),
                span: Span::Locatable(expr.range),
            }),
            Ann(val, typ) => Box::new(desugared::Expr {
                data: desugared::ExprKind::Ann(self.desugar_expr(val), self.desugar_expr(typ)),
                span: Span::Locatable(expr.range),
            }),
            Binary(op, left, right) => Box::new(desugared::Expr {
                data: desugared::ExprKind::Binary(
                    *op,
                    self.desugar_expr(left),
                    self.desugar_expr(right),
                ),
                span: Span::Locatable(expr.range),
            }),
            Match(matcher) => self.desugar_match(matcher),
            Let(destruct, val, next) => self.desugar_let(expr.range, destruct, val, next),
            Subst(sub) => self.desugar_sub(sub),
            Do(typ, sttm) => self.desugar_do(typ, sttm),
            Sigma(name, typ, expr) => self.desugar_sigma(name, typ, expr),
            List(ls) => self.desugar_list(ls),
            If(cond, if_, else_) => self.desugar_if(cond, if_, else_),
            Pair(fst, snd) => self.desugar_pair(fst, snd),
        }
    }
}
