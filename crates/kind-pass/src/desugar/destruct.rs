use fxhash::FxHashMap;
use kind_span::{Locatable, Range};
use kind_tree::concrete::{expr, CaseBinding, Destruct, TopLevel};
use kind_tree::desugared;
use kind_tree::symbol::Ident;

use crate::diagnostic::{PassDiagnostic, Sugar};

use super::DesugarState;

impl<'a> DesugarState<'a> {
    pub(crate) fn order_case_arguments(
        &mut self,
        type_info: (&Range, String),
        fields: &[(String, bool)],
        cases: &[CaseBinding],
        jump_rest: Option<Range>,
    ) -> Vec<(String, Option<(Range, Ident)>)> {
        let mut ordered_fields = fields
            .iter()
            .map(|x| (x.0.clone(), None))
            .collect::<Vec<_>>();
        let mut names = FxHashMap::default();

        for (i, field) in fields.iter().enumerate() {
            names.insert(fields[i].clone().0, (i, field.clone().1));
        }

        for arg in cases {
            let (name, alias) = match arg {
                CaseBinding::Field(name) => (name.clone(), name.clone()),
                CaseBinding::Renamed(name, alias) => (name.clone(), alias.clone()),
            };

            if let Some((idx, _)) = names.get(name.to_str()) {
                if let (_, Some((range, _))) = ordered_fields[*idx] {
                    self.send_err(PassDiagnostic::DuplicatedNamed(range, name.range));
                } else {
                    ordered_fields[*idx] = (name.to_string(), Some((name.locate(), alias.clone())))
                }
            } else {
                self.send_err(PassDiagnostic::CannotFindField(
                    name.range,
                    *type_info.0,
                    type_info.1.to_string(),
                ))
            }
        }

        let names: Vec<String> = names
            .iter()
            .filter(|(_, (idx, hidden))| ordered_fields[*idx].1.is_none() && !hidden)
            .map(|(name, _)| name.clone())
            .collect();

        if jump_rest.is_none() && !names.is_empty() {
            self.send_err(PassDiagnostic::NoFieldCoverage(*type_info.0, names))
        }

        ordered_fields
    }

    pub(crate) fn desugar_destruct(
        &mut self,
        range: Range,
        binding: &expr::Destruct,
        val: Box<desugared::Expr>,
        next: &dyn Fn(&mut Self) -> Box<desugared::Expr>,
        on_ident: &dyn Fn(&mut Self, &Ident) -> Box<desugared::Expr>,
    ) -> Box<desugared::Expr> {
        match binding {
            Destruct::Destruct(_, typ, case, jump_rest) => {
                let meta = self.old_book.meta.get(&typ.to_string()).unwrap();
                let open_id = typ.pop_last_segment().add_segment("match");

                let rec = meta
                    .is_record_cons_of
                    .clone()
                    .and_then(|name| self.old_book.entries.get(&name.to_string()));

                let record = if let Some(TopLevel::RecordType(record)) = rec {
                    record
                } else {
                    self.send_err(PassDiagnostic::LetDestructOnlyForRecord(typ.range));
                    return desugared::Expr::err(typ.range);
                };

                if self.old_book.meta.get(&open_id.to_string()).is_none() {
                    self.send_err(PassDiagnostic::NeedToImplementMethods(
                        binding.locate(),
                        Sugar::Match(typ.to_string()),
                    ));
                    return desugared::Expr::err(range);
                }

                let ordered_fields = self.order_case_arguments(
                    (&typ.range, typ.to_string()),
                    &record
                        .fields
                        .iter()
                        .map(|x| (x.0.to_string(), false))
                        .collect::<Vec<(String, bool)>>(),
                    case,
                    *jump_rest,
                );

                let mut arguments = Vec::new();

                for arg in ordered_fields {
                    if let (_, Some((_, name))) = arg {
                        arguments.push(name)
                    } else {
                        arguments.push(self.gen_name(jump_rest.unwrap_or(typ.range)))
                    }
                }

                let mut irrelev = meta.arguments.map(|x| x.erased).to_vec();
                irrelev = irrelev[record.parameters.len()..].to_vec();

                let motive = self.gen_hole_expr(range);

                let spine = vec![
                    val,
                    desugared::Expr::lambda(range, Ident::generate("self"), motive, false),
                    desugared::Expr::unfold_lambda(&irrelev, &arguments, next(self)),
                ];

                self.mk_desugared_fun(range, open_id, spine, false)
            }
            Destruct::Ident(name) => on_ident(self, name),
        }
    }

    pub(crate) fn desugar_let(
        &mut self,
        range: Range,
        binding: &expr::Destruct,
        val: &expr::Expr,
        next: &expr::Expr,
    ) -> Box<desugared::Expr> {
        let res_val = self.desugar_expr(val);
        self.desugar_destruct(
            next.range,
            binding,
            res_val.clone(),
            &|this| this.desugar_expr(next),
            &|this, name| {
                desugared::Expr::let_(
                    range,
                    name.clone(),
                    res_val.clone(),
                    this.desugar_expr(next),
                )
            },
        )
    }

    pub(crate) fn desugar_match(
        &mut self,
        range: Range,
        matcher: &expr::Match,
    ) -> Box<desugared::Expr> {
        let entry = self.old_book.entries.get(&matcher.typ.to_string()).unwrap();

        let match_id = matcher.typ.add_segment("match");

        if self.old_book.entries.get(&match_id.to_string()).is_none() {
            self.send_err(PassDiagnostic::NeedToImplementMethods(
                range,
                Sugar::Match(matcher.typ.to_string()),
            ));
            return desugared::Expr::err(range);
        }

        let Some(constructors) = entry.get_constructors() else {
            self.send_err(PassDiagnostic::LetDestructOnlyForSum(matcher.typ.range));
            return desugared::Expr::err(matcher.typ.range);
        };

        let mut cases_args = Vec::new();
        let mut positions = FxHashMap::default();

        for case in constructors.iter() {
            positions.insert(case.name.to_str(), cases_args.len());
            cases_args.push(None)
        }

        for case in &matcher.cases {
            let index = match positions.get(case.constructor.to_str()) {
                Some(pos) => *pos,
                None => {
                    self.send_err(PassDiagnostic::CannotFindConstructor(
                        case.constructor.range,
                        matcher.typ.range,
                        matcher.typ.to_string(),
                    ));
                    continue;
                }
            };

            if let Some((range, _, _)) = cases_args[index] {
                self.send_err(PassDiagnostic::DuplicatedNamed(
                    range,
                    case.constructor.range,
                ));
            } else {
                let sum_constructor = &constructors[index];

                let ordered = self.order_case_arguments(
                    (&case.constructor.range, case.constructor.to_string()),
                    &sum_constructor
                        .args
                        .iter()
                        .map(|x| (x.name.to_string(), x.hidden))
                        .collect::<Vec<(String, bool)>>(),
                    &case.bindings,
                    Some(range),
                );

                let mut arguments = Vec::new();

                for arg in ordered {
                    if let Some((_, name)) = arg.1 {
                        arguments.push(name)
                    } else {
                        let mut id =
                            Ident::generate(&format!("{}.{}", matcher.scrutinee.to_str(), arg.0));
                        id.range = case.constructor.range;
                        arguments.push(id);
                    }
                }
                cases_args[index] = Some((case.constructor.range, arguments, &case.value));
            }
        }

        let mut unbound = Vec::new();
        let mut lambdas = Vec::new();

        let names = matcher
            .with_vars
            .iter()
            .map(|x| x.0.clone())
            .collect::<Vec<_>>();

        for (i, case_arg) in cases_args.iter().enumerate() {
            let case = &constructors[i];
            if let Some((_, arguments, val)) = &case_arg {
                let case: Vec<bool> = case.args.iter().map(|x| x.erased).rev().collect();

                let expr = self.desugar_expr(val);

                let irrelev = matcher.with_vars.iter().map(|_| false).collect::<Vec<_>>();
                let expr = desugared::Expr::unfold_lambda(&irrelev, &names, expr);

                let expr = desugared::Expr::unfold_lambda(&case, arguments, expr);

                lambdas.push(expr)
            } else {
                unbound.push(case.name.to_string())
            }
        }

        if !unbound.is_empty() {
            self.send_err(PassDiagnostic::NoCoverage(range, unbound));
            return desugared::Expr::err(range);
        }

        let motive = if let Some(res) = &matcher.motive {
            self.desugar_expr(res)
        } else {
            self.gen_hole_expr(matcher.typ.range)
        };

        let desugared_value = matcher.value.as_ref().map(|f| self.desugar_expr(f));

        let irrelev = matcher.with_vars.iter().map(|_| false).collect::<Vec<_>>();

        let binds = matcher
            .with_vars
            .iter()
            .map(|x| {
                (
                    x.0.clone(),
                    x.1.clone()
                        .map(|x| self.desugar_expr(&x))
                        .unwrap_or_else(|| self.gen_hole_expr(range)),
                )
            })
            .collect::<Vec<_>>();

        let motive = desugared::Expr::unfold_all(&irrelev, &binds, motive);

        let prefix = [
            desugared_value.unwrap_or_else(|| desugared::Expr::var(matcher.scrutinee.clone())),
            desugared::Expr::lambda(motive.range, matcher.scrutinee.clone(), motive, false),
        ];

        let call = self.mk_desugared_fun(
            range,
            match_id,
            [prefix.as_slice(), lambdas.as_slice()].concat(),
            false,
        );

        if !matcher.with_vars.is_empty() {
            desugared::Expr::app(
                range,
                call,
                matcher
                    .with_vars
                    .iter()
                    .map(|x| desugared::AppBinding {
                        data: desugared::Expr::var(x.0.clone()),
                        erased: false,
                    })
                    .collect(),
            )
        } else {
            call
        }
    }
}
