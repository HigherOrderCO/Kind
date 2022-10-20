use std::collections::HashMap;

use kind_span::{Locatable, Range, Span};
use kind_tree::concrete::expr::Expr;

use kind_tree::concrete::{Binding, ExprKind};
use kind_tree::desugared;
use kind_tree::symbol::Ident;

use crate::errors::PassError;

use super::DesugarState;

impl<'a> DesugarState<'a> {
    pub fn make_desugared_spine(
        &mut self,
        range: Range,
        head: Ident,
        spine: Vec<Box<desugared::Expr>>,
    ) -> Option<Vec<Box<desugared::Expr>>> {
        let entry = self.old_glossary.get_count_garanteed(&head.data.0);

        let mut arguments = Vec::new();

        let (hidden, _erased) = entry.arguments.count_implicits();

        if spine.len() == entry.arguments.len() - hidden {
            let mut spine_iter = spine.iter();
            for arg in &entry.arguments.0 {
                if arg.hidden {
                    arguments.push(self.gen_hole_expr())
                } else {
                    arguments.push(spine_iter.next().unwrap().to_owned())
                }
            }
        } else if spine.len() != entry.arguments.len() {
            // The expected size is the one provided by the desugar.
            self.send_err(PassError::SugarIsBadlyImplemented(
                entry.range,
                range,
                spine.len(),
            ));
        }

        Some(arguments)
    }

    pub fn mk_desugared_ctr(
        &mut self,
        range: Range,
        head: Ident,
        spine: Vec<Box<desugared::Expr>>,
    ) -> Box<desugared::Expr> {
        match self.make_desugared_spine(range, head.clone(), spine) {
            Some(spine) => desugared::Expr::ctr(range, head, spine),
            None => desugared::Expr::err(range),
        }
    }

    pub fn mk_desugared_fun(
        &mut self,
        range: Range,
        head: Ident,
        spine: Vec<Box<desugared::Expr>>,
    ) -> Box<desugared::Expr> {
        match self.make_desugared_spine(range, head.clone(), spine) {
            Some(spine) => desugared::Expr::fun(range, head, spine),
            None => desugared::Expr::err(range),
        }
    }

    pub fn desugar_app(
        &mut self,
        range: Range,
        head: &Expr,
        spine: &[Binding],
    ) -> Box<desugared::Expr> {
        match &head.data {
            ExprKind::Constr(entry_name) => {
                let entry = self.old_glossary.get_count_garanteed(&entry_name.data.0);

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
                            arguments[i] = Some((Range::ghost_range(), self.gen_hole_expr()))
                        }
                    }
                } else if entry.arguments.len() != spine.len() {
                    self.send_err(PassError::IncorrectArity(
                        head.locate(),
                        entry.arguments.len(),
                        hidden,
                    ));
                    return desugared::Expr::err(range);
                }

                for i in 0..entry.arguments.len() {
                    positions.insert(entry.arguments[i].name.data.0.clone(), i);
                }

                for arg in spine {
                    match arg {
                        Binding::Positional(_) => (),
                        Binding::Named(r, name, v) => {
                            let pos = match positions.get(&name.data.0) {
                                Some(pos) => *pos,
                                None => {
                                    self.send_err(PassError::CannotFindField(
                                        name.range,
                                        entry_name.range,
                                        entry_name.data.0.clone(),
                                    ));
                                    continue;
                                }
                            };

                            if let Some((range, _)) = arguments[pos] {
                                self.send_err(PassError::DuplicatedNamed(range, *r));
                            } else {
                                arguments[pos] = Some((*r, self.desugar_expr(v)))
                            }
                        }
                    }
                }

                for arg in spine {
                    match arg {
                        Binding::Positional(v) => {
                            for i in 0..entry.arguments.len() {
                                let arg_decl = &entry.arguments[i];
                                if (fill_hidden && arg_decl.hidden) || arguments[i].is_some() {
                                    continue;
                                }
                                arguments[i] = Some((v.range, self.desugar_expr(v)));
                                break;
                            }
                        }
                        Binding::Named(_, _, _) => (),
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
                        desugared::ExprKind::Ctr(entry_name.clone(), new_spine)
                    } else {
                        desugared::ExprKind::Fun(entry_name.clone(), new_spine)
                    },
                    span: Span::Locatable(range),
                })
            }
            _ => {
                let mut new_spine = Vec::new();
                let new_head = self.desugar_expr(head);
                for arg in spine {
                    match arg {
                        Binding::Positional(v) => new_spine.push(self.desugar_expr(v)),
                        Binding::Named(r, _, v) => {
                            self.send_err(PassError::CannotUseNamed(head.range, *r));
                            new_spine.push(self.desugar_expr(v))
                        }
                    }
                }
                desugared::Expr::app(range, new_head, new_spine)
            }
        }
    }
}
