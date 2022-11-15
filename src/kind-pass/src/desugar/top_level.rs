use kind_span::{Range, Span};
use kind_tree::concrete::{self, Telescope};
use kind_tree::desugared::{self, ExprKind};
use kind_tree::symbol::QualifiedIdent;

use crate::errors::{PassError, Sugar};

use super::DesugarState;

/// States if a given expression is a type constructor
/// of the inductive type family definition only sintatically.
/// TODO: It does not work wit HIT (We will probably have to change it in the future).
/// NOTE: Does not work with Pi types.
pub fn is_data_constructor_of(expr: concrete::expr::Expr, type_name: &str) -> bool {
    match expr.data {
        concrete::ExprKind::Var(name) => name.to_string().as_str() == type_name,
        concrete::ExprKind::App(head, _) => {
            if let concrete::expr::Expr {
                data: concrete::ExprKind::Var(name),
                ..
            } = *head
            {
                name.to_string().as_str() == type_name
            } else {
                false
            }
        }
        _ => false,
    }
}

impl<'a> DesugarState<'a> {
    pub fn desugar_argument(&mut self, argument: &concrete::Argument) -> desugared::Argument {
        let typ = match &argument.typ {
            None => desugared::Expr::typ(argument.range),
            Some(ty) => self.desugar_expr(ty),
        };

        desugared::Argument {
            hidden: argument.hidden,
            erased: argument.erased,
            name: argument.name.clone(),
            typ,
            span: argument.range,
        }
    }

    pub fn desugar_sum_type(&mut self, sum_type: &concrete::SumTypeDecl) {
        let params = sum_type.parameters.clone();
        let indices = sum_type.indices.clone();

        let desugared_params = params.map(|arg| self.desugar_argument(arg));
        let desugared_indices = indices.map(|arg| self.desugar_argument(arg));

        let type_constructor = desugared::Entry {
            name: sum_type.name.clone(),
            args: desugared_params.extend(&desugared_indices).to_vec(),
            typ: desugared::Expr::generate_expr(desugared::ExprKind::Typ),
            rules: Vec::new(),
            span: Span::Locatable(sum_type.name.range),
            attrs: self.desugar_attributes(&sum_type.attrs),
        };

        self.new_book
            .entrs
            .insert(sum_type.name.to_string(), Box::new(type_constructor));

        let irrelevant_params: Vec<desugared::Argument> =
            desugared_params.map(|x| x.to_irrelevant()).to_vec();

        let irelevant_indices: Vec<desugared::Argument> = indices
            .map(|arg| self.desugar_argument(arg).to_irrelevant())
            .to_vec();

        for cons in &sum_type.constructors {
            let cons_ident = sum_type.name.add_segment(cons.name.to_str());

            let pre_indices = if cons.typ.is_none() {
                irelevant_indices.as_slice()
            } else {
                &[]
            };

            let typ = match cons.typ.clone() {
                Some(expr) => {
                    let res = self.desugar_expr(&expr);
                    match &res.data {
                        ExprKind::Ctr(name, spine)
                            if name.to_string() == sum_type.name.to_string() =>
                        {
                            for (i, parameter) in sum_type.parameters.iter().enumerate() {
                                match &spine[i].data {
                                    ExprKind::Var(name)
                                        if name.to_string() == parameter.name.to_string() => {}
                                    _ => {
                                        self.send_err(PassError::ShouldBeAParameter(
                                            spine[i].span,
                                            parameter.range,
                                        ));
                                    }
                                }
                            }
                        }
                        _ => self.send_err(PassError::NotATypeConstructor(
                            expr.range,
                            sum_type.name.range,
                        )),
                    }
                    res
                }
                None => {
                    let args = [irrelevant_params.as_slice(), pre_indices]
                        .concat()
                        .iter()
                        .map(|x| desugared::Expr::var(x.name.clone()))
                        .collect::<Vec<Box<desugared::Expr>>>();

                    desugared::Expr::ctr(cons.name.range, sum_type.name.clone(), args)
                }
            };

            let data_constructor = desugared::Entry {
                name: cons_ident.clone(),
                args: [
                    irrelevant_params.as_slice(),
                    pre_indices,
                    cons.args.map(|arg| self.desugar_argument(arg)).as_slice(),
                ]
                .concat(),
                typ,
                rules: Vec::new(),
                attrs: Vec::new(),
                span: Span::Locatable(cons.name.range),
            };

            self.new_book
                .entrs
                .insert(cons_ident.to_string(), Box::new(data_constructor));
        }
    }

    pub fn desugar_record_type(&mut self, rec_type: &concrete::RecordDecl) {
        let params = rec_type.parameters.clone();

        let desugared_params = params.map(|arg| self.desugar_argument(arg));

        let type_constructor = desugared::Entry {
            name: rec_type.name.clone(),
            args: desugared_params.clone().to_vec(),
            typ: desugared::Expr::generate_expr(desugared::ExprKind::Typ),
            rules: Vec::new(),
            span: Span::Locatable(rec_type.name.range),
            attrs: self.desugar_attributes(&rec_type.attrs),
        };

        self.new_book
            .entrs
            .insert(rec_type.name.to_string(), Box::new(type_constructor));

        let irrelevant_params = desugared_params.map(|x| x.to_irrelevant());

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

        let typ = Box::new(desugared::Expr {
            data: desugared::ExprKind::Ctr(rec_type.name.clone(), args),
            span: Span::Generated,
        });

        let cons_ident = rec_type.name.add_segment(rec_type.constructor.to_str());

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
            typ,
            rules: Vec::new(),
            span: Span::Locatable(rec_type.constructor.range),
            attrs: Vec::new(),
        };

        self.new_book
            .entrs
            .insert(cons_ident.to_string(), Box::new(data_constructor));
    }

    pub fn desugar_pair_pat(
        &mut self,
        range: Range,
        fst: &concrete::pat::Pat,
        snd: &concrete::pat::Pat,
    ) -> Box<desugared::Expr> {
        let sigma_new = QualifiedIdent::new_static("Sigma", Some("new".to_string()), range);

        let entry = self.old_book.entries.get(sigma_new.to_string().as_str());
        if entry.is_none() {
            self.send_err(PassError::NeedToImplementMethods(range, Sugar::Pair));
            return desugared::Expr::err(range);
        }

        let spine = vec![self.desugar_pat(fst), self.desugar_pat(snd)];

        self.mk_desugared_ctr(range, sigma_new, spine, true)
    }

    pub fn desugar_list_pat(
        &mut self,
        range: Range,
        expr: &[concrete::pat::Pat],
    ) -> Box<desugared::Expr> {
        let list_ident = QualifiedIdent::new_static("List", None, range);
        let cons_ident = list_ident.add_segment("cons");
        let nil_ident = list_ident.add_segment("nil");

        let list = self.old_book.entries.get(list_ident.to_string().as_str());
        let nil = self.old_book.entries.get(cons_ident.to_string().as_str());
        let cons = self.old_book.entries.get(nil_ident.to_string().as_str());

        if list.is_none() || nil.is_none() || cons.is_none() {
            self.send_err(PassError::NeedToImplementMethods(range, Sugar::List));
            return desugared::Expr::err(range);
        }

        expr.iter().rfold(
            self.mk_desugared_ctr(range, nil_ident, Vec::new(), true),
            |res, elem| {
                let spine = vec![self.desugar_pat(elem), res];
                self.mk_desugared_ctr(range, cons_ident.clone(), spine, true)
            },
        )
    }

    pub fn desugar_pat(&mut self, pat: &concrete::pat::Pat) -> Box<desugared::Expr> {
        use concrete::pat::PatKind;
        match &pat.data {
            PatKind::App(head, spine) => {
                // TODO: Fix lol
                let entry = self
                    .old_book
                    .count
                    .get(head.to_string().as_str())
                    .expect("Internal Error: Cannot find definition");

                if !entry.is_ctr {
                    // TODO: Check if only data constructors declared inside
                    // inductive types can be used in patterns.
                }

                let fill_hidden = spine.len() == entry.arguments.len() - entry.hiddens;

                let mut new_spine = Vec::new();

                if fill_hidden {
                    let mut count = 0;
                    for i in 0..entry.arguments.len() {
                        if entry.arguments[i].hidden {
                            let name = self.gen_name(entry.arguments[i].range);
                            new_spine.push(desugared::Expr::var(name))
                        } else {
                            new_spine.push(self.desugar_pat(&spine[count]));
                            count += 1;
                        }
                    }
                } else if entry.arguments.len() != spine.len() {
                    self.send_err(PassError::IncorrectArity(
                        head.range,
                        spine.iter().map(|x| x.range).collect(),
                        entry.arguments.len(),
                        entry.hiddens,
                    ));
                    return desugared::Expr::err(pat.range);
                } else {
                    for arg in spine {
                        new_spine.push(self.desugar_pat(arg));
                    }
                }
                desugared::Expr::ctr(pat.range, head.clone(), new_spine)
            }
            PatKind::Hole => {
                let name = self.gen_name(pat.range);
                desugared::Expr::var(name)
            }
            PatKind::Var(ident) => desugared::Expr::var(ident.0.clone()),
            // TODO: Add u120 pattern literals
            PatKind::Num(kind_tree::Number::U60(n)) => desugared::Expr::num60(pat.range, *n),
            PatKind::Num(kind_tree::Number::U120(n)) => desugared::Expr::num120(pat.range, *n),
            PatKind::Pair(fst, snd) => self.desugar_pair_pat(pat.range, fst, snd),
            PatKind::List(ls) => self.desugar_list_pat(pat.range, ls),
            PatKind::Str(string) => {
                desugared::Expr::str(pat.range, string.to_owned())
            }
        }
    }

    pub fn desugar_rule(
        &mut self,
        args: &Telescope<concrete::Argument>,
        rule: &concrete::Rule,
    ) -> desugared::Rule {
        let pats = rule
            .pats
            .iter()
            .map(|x| self.desugar_pat(x))
            .collect::<Vec<Box<desugared::Expr>>>();

        let (hidden, _) = args.count_implicits();

        if pats.len() == args.len() {
            desugared::Rule {
                name: rule.name.clone(),
                pats,
                body: self.desugar_expr(&rule.body),
                span: Span::Locatable(rule.range),
            }
        } else if pats.len() == args.len() - hidden {
            let mut res_pats = Vec::new();
            let mut pat_iter = pats.iter();
            for arg in args.iter() {
                if arg.hidden {
                    res_pats.push(desugared::Expr::var(self.gen_name(arg.range)))
                } else {
                    res_pats.push(pat_iter.next().unwrap().to_owned());
                }
            }
            desugared::Rule {
                name: rule.name.clone(),
                pats: res_pats,
                body: self.desugar_expr(&rule.body),
                span: Span::Locatable(rule.range),
            }
        } else {
            self.send_err(PassError::RuleWithIncorrectArity(
                rule.range,
                pats.len(),
                args.len(),
                hidden,
            ));
            // TODO: Probably we should just a sentinel rule?
            desugared::Rule {
                name: rule.name.clone(),
                pats,
                body: self.desugar_expr(&rule.body),
                span: Span::Locatable(rule.range),
            }
        }
    }

    pub fn desugar_entry(&mut self, entry: &concrete::Entry) {
        self.name_count = 0;

        let rules = entry
            .rules
            .iter()
            .map(|x| self.desugar_rule(&entry.args, x))
            .collect();

        let res_entry = desugared::Entry {
            name: entry.name.clone(),
            args: entry.args.map(|x| self.desugar_argument(x)).to_vec(),
            typ: self.desugar_expr(&entry.typ),
            span: entry.range.to_span(),
            attrs: self.desugar_attributes(&entry.attrs),
            rules,
        };

        let rule_numbers = entry
            .rules
            .iter()
            .map(|x| (x.range, x.pats.len()))
            .collect::<Vec<(Range, usize)>>();

        let diff = rule_numbers.iter().filter(|x| rule_numbers[0].1 != x.1);

        if !rule_numbers.is_empty() && diff.clone().count() >= 1 {
            self.send_err(PassError::RulesWithInconsistentArity(
                diff.cloned().collect(),
            ));
        }

        self.new_book
            .entrs
            .insert(res_entry.name.to_string(), Box::new(res_entry));
    }

    pub fn desugar_top_level(&mut self, top_level: &concrete::TopLevel) {
        match top_level {
            concrete::TopLevel::SumType(sum) => self.desugar_sum_type(sum),
            concrete::TopLevel::RecordType(rec) => self.desugar_record_type(rec),
            concrete::TopLevel::Entry(entry) => self.desugar_entry(entry),
        }
    }
}
