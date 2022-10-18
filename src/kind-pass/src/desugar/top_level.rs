use kind_span::Span;
use kind_tree::concrete::{self, Argument};
use kind_tree::desugared;

use crate::errors::PassError;

use super::DesugarState;

/// States if a given expression is a type constructor
/// of the inductive type family definition only sintatically.
/// TODO: It does not work wit HIT (We will probably have to change it in the future).
/// NOTE: Does not work with Pi types.
pub fn is_data_constructor_of(expr: concrete::expr::Expr, type_name: &str) -> bool {
    match expr.data {
        concrete::ExprKind::Var(name) => name.data.0 == type_name,
        concrete::ExprKind::App(head, _) => {
            if let concrete::expr::Expr {
                data: concrete::ExprKind::Var(name),
                ..
            } = *head
            {
                name.data.0 == type_name
            } else {
                false
            }
        }
        _ => false,
    }
}

impl<'a> DesugarState<'a> {
    pub fn desugar_argument(&mut self, argument: &concrete::Argument) -> desugared::Argument {
        let tipo = match &argument.tipo {
            None => Box::new(desugared::Expr {
                data: desugared::ExprKind::Typ,
                span: Span::Locatable(argument.range),
            }),
            Some(ty) => self.desugar_expr(ty),
        };

        desugared::Argument {
            hidden: argument.hidden,
            erased: argument.erased,
            name: argument.name.clone(),
            tipo,
            span: Span::Locatable(argument.range),
        }
    }

    pub fn desugar_sum_type(&mut self, sum_type: &concrete::SumTypeDecl) {
        let params = sum_type.parameters.clone();
        let indices = sum_type.indices.clone();

        let desugared_params = params.map(|arg| self.desugar_argument(arg));
        let desugared_indices = indices.map(|arg| self.desugar_argument(arg));

        let type_constructor = desugared::Entry {
            name: sum_type.name.clone(),
            args: desugared_params.extend(&desugared_indices).0.clone(),
            tipo: Box::new(desugared::Expr::generate_expr(desugared::ExprKind::Typ)),
            rules: Vec::new(),
            span: Span::Locatable(sum_type.name.range),
        };

        self.new_glossary
            .entrs
            .insert(sum_type.name.data.0.clone(), Box::new(type_constructor));
        self.new_glossary.names.push(sum_type.name.clone());

        let irrelevant_params: Vec<desugared::Argument> =
            desugared_params.map(|x| x.to_irrelevant()).0;

        let irelevant_indices: Vec<desugared::Argument> = indices
            .map(|arg| self.desugar_argument(arg).to_irrelevant())
            .0;

        for cons in &sum_type.constructors {
            let cons_ident = cons.name.add_base_ident(&sum_type.name.data.0);

            let pre_indices = if cons.tipo.is_none() {
                irelevant_indices.as_slice()
            } else {
                &[]
            };

            let tipo = match cons.tipo.clone() {
                Some(expr) => self.desugar_expr(&expr),
                None => {
                    let args = [irrelevant_params.as_slice(), pre_indices]
                        .concat()
                        .iter()
                        .map(|x| {
                            Box::new(desugared::Expr {
                                data: desugared::ExprKind::Var(x.name.clone()),
                                span: Span::Generated,
                            })
                        })
                        .collect::<Vec<Box<desugared::Expr>>>();

                    Box::new(desugared::Expr {
                        data: desugared::ExprKind::App(
                            Box::new(desugared::Expr {
                                data: desugared::ExprKind::Var(sum_type.name.clone()),
                                span: Span::Generated,
                            }),
                            args,
                        ),
                        span: Span::Generated,
                    })
                }
            };

            let data_constructor = desugared::Entry {
                name: cons_ident.clone(),
                args: [
                    irrelevant_params.as_slice(),
                    pre_indices,
                    cons.args.map(|arg| self.desugar_argument(arg)).0.as_slice(),
                ]
                .concat(),
                tipo,
                rules: Vec::new(),
                span: Span::Locatable(sum_type.name.range),
            };

            self.new_glossary
                .entrs
                .insert(cons_ident.data.0.clone(), Box::new(data_constructor));

            self.new_glossary.names.push(cons_ident);
        }
    }

    pub fn desugar_record_type(&mut self, rec_type: &concrete::RecordDecl) {
        let params = rec_type.parameters.clone();

        let desugared_params = params.map(|arg| self.desugar_argument(arg));

        let type_constructor = desugared::Entry {
            name: rec_type.name.clone(),
            args: desugared_params.0.clone(),
            tipo: Box::new(desugared::Expr::generate_expr(desugared::ExprKind::Typ)),
            rules: Vec::new(),
            span: Span::Locatable(rec_type.name.range),
        };

        self.new_glossary
            .entrs
            .insert(rec_type.name.data.0.clone(), Box::new(type_constructor));
        self.new_glossary.names.push(rec_type.name.clone());

        let irrelevant_params: Vec<desugared::Argument> =
            desugared_params.map(|x| x.to_irrelevant()).0;

        let args = [irrelevant_params.as_slice()]
            .concat()
            .iter()
            .map(|x| {
                Box::new(desugared::Expr {
                    data: desugared::ExprKind::Var(x.name.clone()),
                    span: Span::Generated,
                })
            })
            .collect::<Vec<Box<desugared::Expr>>>();

        let tipo = Box::new(desugared::Expr {
            data: desugared::ExprKind::App(
                Box::new(desugared::Expr {
                    data: desugared::ExprKind::Var(rec_type.name.clone()),
                    span: Span::Generated,
                }),
                args,
            ),
            span: Span::Generated,
        });

        let cons_ident = rec_type.constructor.add_base_ident(&rec_type.name.data.0);

        let data_constructor = desugared::Entry {
            name: cons_ident.clone(),
            args: [
                irrelevant_params.as_slice(),
                rec_type
                    .fields
                    .iter()
                    .map(|(ident, _docs, ty)| {
                        desugared::Argument::from_field(
                            ident,
                            self.desugar_expr(ty),
                            ident.range.mix(ty.range),
                        )
                    })
                    .collect::<Vec<desugared::Argument>>()
                    .as_slice(),
            ]
            .concat(),
            tipo,
            rules: Vec::new(),
            span: Span::Locatable(rec_type.constructor.range),
        };

        self.new_glossary
            .entrs
            .insert(cons_ident.data.0.clone(), Box::new(data_constructor));
    }

    pub fn desugar_pat(&mut self, pat: &concrete::pat::Pat) -> Box<desugared::Expr> {
        match &pat.data {
            concrete::pat::PatKind::App(head, spine) => {
                let entry = self
                    .old_glossary
                    .count
                    .get(&head.data.0)
                    .expect("Cannot find definition");

                if !entry.is_ctr {
                    todo!()
                }

                let (hidden, _erased) = entry.arguments.count_implicits();

                let fill_hidden = spine.len() == entry.arguments.len() - hidden;

                let mut new_spine = Vec::new();

                if fill_hidden {
                    let mut count = 0;
                    for i in 0..entry.arguments.len() {
                        if entry.arguments[i].hidden {
                            new_spine.push(Box::new(desugared::Expr {
                                data: desugared::ExprKind::Hole(self.gen_hole()),
                                span: Span::Generated,
                            }))
                        } else {
                            new_spine.push(self.desugar_pat(&spine[count]));
                            count += 1;
                        }
                    }
                } else if entry.arguments.len() != spine.len() {
                    self.errors
                        .send(
                            PassError::IncorrectArity(head.range, entry.arguments.len(), hidden)
                                .into(),
                        )
                        .unwrap();

                    return Box::new(desugared::Expr {
                        data: desugared::ExprKind::Err,
                        span: Span::Locatable(pat.range),
                    });
                } else {
                    for arg in spine {
                        new_spine.push(self.desugar_pat(arg));
                    }
                }
                Box::new(desugared::Expr {
                    data: desugared::ExprKind::Ctr(head.clone(), new_spine),
                    span: Span::Locatable(pat.range),
                })
            }
            concrete::pat::PatKind::Var(ident) => Box::new(desugared::Expr {
                data: desugared::ExprKind::Var(ident.0.clone()),
                span: Span::Locatable(pat.range),
            }),
            concrete::pat::PatKind::Num(n) => Box::new(desugared::Expr {
                data: desugared::ExprKind::Num(*n),
                span: Span::Locatable(pat.range),
            }),
            concrete::pat::PatKind::Hole => Box::new(desugared::Expr {
                data: desugared::ExprKind::Hole(self.gen_hole()),
                span: Span::Locatable(pat.range),
            }),
            concrete::pat::PatKind::Pair(_, _) => todo!(),
            concrete::pat::PatKind::List(_) => todo!(),
            concrete::pat::PatKind::Str(_) => todo!(),
        }
    }

    pub fn desugar_rule(&mut self, rule: &concrete::Rule) -> desugared::Rule {
        let pats = rule.pats.iter().map(|x| self.desugar_pat(x)).collect();
        desugared::Rule {
            name: rule.name.clone(),
            pats,
            body: self.desugar_expr(&rule.body),
            span: Span::Locatable(rule.range),
        }
    }

    pub fn desugar_entry(&mut self, entry: &concrete::Entry) {
        let rules = entry
            .rules
            .iter()
            .map(|x| self.desugar_rule(x))
            .collect::<Vec<desugared::Rule>>();

        let entry = desugared::Entry {
            name: entry.name.clone(),
            args: entry.args.map(|x| self.desugar_argument(x)).0,
            tipo: self.desugar_expr(&entry.tipo),
            rules,
            span: Span::Locatable(entry.range),
        };

        self.new_glossary.names.push(entry.name.clone());
        self.new_glossary
            .entrs
            .insert(entry.name.data.0.clone(), Box::new(entry));
    }

    pub fn desugar_top_level(&mut self, top_level: &concrete::TopLevel) {
        match top_level {
            concrete::TopLevel::SumType(sum) => self.desugar_sum_type(sum),
            concrete::TopLevel::RecordType(rec) => self.desugar_record_type(rec),
            concrete::TopLevel::Entry(entry) => self.desugar_entry(entry),
        }
    }
}
