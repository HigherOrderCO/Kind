use fxhash::FxHashMap;
use kind_span::{Locatable, Range};
use kind_tree::concrete::pat::PatIdent;
use kind_tree::concrete::{expr, CaseBinding, Destruct, TopLevel};
use kind_tree::desugared;
use kind_tree::symbol::{Ident, Symbol};

use crate::errors::PassError;

use super::DesugarState;

impl<'a> DesugarState<'a> {
    pub(crate) fn order_case_arguments(
        &mut self,
        type_info: (&Range, &Ident),
        fields: &[(String, bool)],
        cases: &[CaseBinding],
        jump_rest: bool,
    ) -> Vec<Option<(Range, PatIdent)>> {
        let mut ordered_fields = vec![None; fields.len()];
        let mut names = FxHashMap::default();

        for (i, field) in fields.iter().enumerate() {
            names.insert(fields[i].clone().0, (i, field.clone().1));
        }

        for arg in cases {
            let (name, alias) = match arg {
                CaseBinding::Field(name) => (name.0.clone(), name.clone()),
                CaseBinding::Renamed(name, alias) => (name.clone(), alias.clone()),
            };

            if let Some((idx, _)) = names.get(&name.data.0) {
                if let Some((range, _)) = ordered_fields[*idx] {
                    self.send_err(PassError::DuplicatedNamed(range, name.range));
                } else {
                    ordered_fields[*idx] = Some((name.locate(), alias.clone()))
                }
            } else {
                self.send_err(PassError::CannotFindField(
                    name.range,
                    *type_info.0,
                    type_info.1.data.0.clone(),
                ))
            }
        }

        let names: Vec<String> = names
            .iter()
            .filter(|(_, (idx, hidden))| ordered_fields[*idx].is_none() && !hidden)
            .map(|(name, _)| name.clone())
            .collect();

        if !jump_rest && !names.is_empty() {
            self.send_err(PassError::NoCoverage(type_info.1.locate(), names))
        }

        ordered_fields
    }

    pub(crate) fn desugar_destruct(
        &mut self,
        binding: &expr::Destruct,
        val: Box<desugared::Expr>,
        next: &dyn Fn(&mut Self) -> Box<desugared::Expr>,
        on_ident: &dyn Fn(&mut Self, &Ident) -> Box<desugared::Expr>,
    ) -> Box<desugared::Expr> {
        match binding {
            Destruct::Destruct(destruct_range, tipo, case, jump_rest) => {
                let entry = self.old_glossary.get_entry_garanteed(&tipo.data.0);

                let record = if let TopLevel::RecordType(record) = entry {
                    record
                } else {
                    self.send_err(PassError::LetDestructOnlyForRecord(tipo.range));
                    return desugared::Expr::err(tipo.range);
                };

                let ordered_fields = self.order_case_arguments(
                    (&tipo.range, tipo),
                    &record
                        .fields
                        .iter()
                        .map(|x| (x.0.data.0.clone(), false))
                        .collect::<Vec<(String, bool)>>(),
                    case,
                    *jump_rest,
                );

                let mut arguments = Vec::new();

                for arg in ordered_fields {
                    if let Some((_, name)) = arg {
                        arguments.push(name.0)
                    } else {
                        // TODO: Generate name
                        arguments.push(Ident::new(Symbol(self.gen_name(tipo.range).to_string()), tipo.range))
                    }
                }

                let open_id = tipo.add_segment("open");

                let spine = vec![
                    val,
                    desugared::Expr::unfold_lambda(*destruct_range, &arguments, next(self)),
                ];

                self.mk_desugared_fun(*destruct_range, open_id, spine)
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
            binding,
            res_val,
            &|this| this.desugar_expr(next),
            &|this, name| {
                desugared::Expr::let_(
                    range,
                    name.clone(),
                    this.desugar_expr(val),
                    this.desugar_expr(next),
                )
            },
        )
    }

    pub(crate) fn desugar_match(&mut self, range: Range, match_: &expr::Match) -> Box<desugared::Expr> {
        let entry = self.old_glossary.get_entry_garanteed(match_.tipo.to_str());

        let sum = if let TopLevel::SumType(sum) = entry {
            sum
        } else {
            self.send_err(PassError::LetDestructOnlyForSum(match_.tipo.range));
            return desugared::Expr::err(match_.tipo.range);
        };

        let mut cases_args = Vec::new();
        let mut positions = FxHashMap::default();

        for case in &sum.constructors {
            positions.insert(case.name.to_str(), cases_args.len());
            cases_args.push(None)
        }

        for case in &match_.cases {
            let index = match positions.get(case.constructor.to_str()) {
                Some(pos) => *pos,
                None => {
                    self.send_err(PassError::CannotFindConstructor(
                        case.constructor.range,
                        match_.tipo.range,
                        match_.tipo.to_str().clone(),
                    ));
                    continue;
                }
            };

            if let Some((range, _, _)) = cases_args[index] {
                self.send_err(PassError::DuplicatedNamed(range, case.constructor.range));
            } else {
                let sum_c = &sum.constructors[index];
                let ordered = self.order_case_arguments(
                    (&case.constructor.range, &case.constructor),
                    &sum_c
                        .args
                        .0
                        .iter()
                        .map(|x| (x.name.to_str().clone(), x.hidden))
                        .collect::<Vec<(String, bool)>>(),
                    &case.bindings,
                    case.ignore_rest,
                );

                let mut arguments = Vec::new();

                for arg in ordered {
                    if let Some((_, name)) = arg {
                        arguments.push(name.0)
                    } else {
                        // TODO: Generate name
                        arguments.push(Ident::new(Symbol(self.gen_name(match_.tipo.range).to_string()), match_.tipo.range))
                    }
                }
                cases_args[index] = Some((case.constructor.range, arguments, &case.value));
            }
        }

        let mut unbound = Vec::new();
        let mut lambdas = Vec::new();

        for (i, case_arg) in cases_args.iter().enumerate() {
            let case = &sum.constructors[i];
            if let Some((range, arguments, val)) = &case_arg {
                println!(
                    "Args: {:?}",
                    arguments
                        .iter()
                        .map(|x| x.to_str())
                        .collect::<Vec<&String>>()
                );
                lambdas.push(desugared::Expr::unfold_lambda(
                    *range,
                    arguments,
                    self.desugar_expr(val),
                ))
            } else {
                unbound.push(case.name.to_str().clone())
            }
        }

        if !unbound.is_empty() {
            self.send_err(PassError::NoCoverage(range, unbound))
        }

        let match_id = match_.tipo.add_segment("match");

        let motive = if let Some(res) = &match_.motive {
            self.desugar_expr(res)
        } else {
            let mut idx: Vec<Ident> = sum.indices.0.iter().map(|x| x.name.clone()).collect();
            idx.push(Ident::generate("_val"));
            idx.iter().rfold(self.gen_hole_expr(), |expr, l| {
                desugared::Expr::lambda(l.range, l.clone(), expr)
            })
        };

        let prefix = [self.desugar_expr(&match_.scrutinizer), motive];

        self.mk_desugared_fun(
            match_.tipo.range,
            match_id,
            [prefix.as_slice(), lambdas.as_slice()].concat(),
        )
    }
}