use kind_span::{Locatable, Range};
use kind_tree::concrete::{self, expr, Literal, TopLevel};
use kind_tree::desugared::{self};
use kind_tree::symbol::{Ident, QualifiedIdent};

use crate::diagnostic::{PassDiagnostic, Sugar};

use super::DesugarState;

impl<'a> DesugarState<'a> {
    pub fn check_implementation(&mut self, name: &str, range: Range, sugar: Sugar) -> bool {
        if !self.old_book.names.contains_key(&name.to_string()) {
            self.send_err(PassDiagnostic::NeedToImplementMethods(range, sugar));
            false
        } else {
            true
        }
    }

    pub(crate) fn desugar_literal(
        &mut self,
        range: Range,
        literal: &expr::Literal,
    ) -> Box<desugared::Expr> {
        match literal {
            Literal::String(string) => {
                if !self.check_implementation("String.cons", range, Sugar::String)
                    || !self.check_implementation("String.nil", range, Sugar::String)
                {
                    return desugared::Expr::err(range);
                }
                desugared::Expr::str(range, string.clone())
            }
            Literal::Type => desugared::Expr::typ(range),
            Literal::Help(name) => desugared::Expr::hlp(range, name.clone()),
            Literal::NumTypeU60 => desugared::Expr::type_u60(range),
            Literal::NumTypeF60 => desugared::Expr::type_f60(range),
            Literal::NumU60(num) => desugared::Expr::num_u60(range, *num),
            Literal::Nat(num) => {
                let list_ident = QualifiedIdent::new_static("Nat", None, range);
                let cons_ident = list_ident.add_segment("succ");
                let nil_ident = list_ident.add_segment("zero");

                let mut res = self.mk_desugared_ctr(range, nil_ident, Vec::new(), false);

                for _ in 0..*num {
                    res = self.mk_desugared_ctr(range, cons_ident.clone(), vec![res], false)
                }

                res
            }
            Literal::NumU120(num) => {
                if !self.check_implementation("U120.new", range, Sugar::U120) {
                    return desugared::Expr::err(range);
                }
                desugared::Expr::num_u120(range, *num)
            }
            Literal::NumF60(num) => desugared::Expr::num_f60(range, *num),
            Literal::Char(cht) => desugared::Expr::num_u60(range, *cht as u64),
        }
    }

    pub(crate) fn desugar_sub(
        &mut self,
        range: Range,
        sub: &expr::Substitution,
    ) -> Box<desugared::Expr> {
        desugared::Expr::sub(
            range,
            sub.name.clone(),
            sub.indx,
            sub.redx,
            self.desugar_expr(&sub.expr),
        )
    }

    pub(crate) fn desugar_seq(
        &mut self,
        range: Range,
        sub: &expr::SeqRecord,
    ) -> Box<desugared::Expr> {
        todo!()
    }

    pub(crate) fn desugar_sttm(
        &mut self,
        bind_ident: &QualifiedIdent,
        pure_ident: &QualifiedIdent,
        sttm: &expr::Sttm,
    ) -> Box<desugared::Expr> {
        type Exp = Box<desugared::Expr>;

        // Creates a bind constructor
        let bind = |this: &mut Self, range: Range, name: Ident, expr: Exp, next: Exp| -> Exp {
            this.mk_desugared_fun(
                range,
                bind_ident.clone(),
                vec![expr, desugared::Expr::lambda(range, name, next, false)],
                false,
            )
        };

        match &sttm.data {
            concrete::SttmKind::Expr(expr, next) => {
                let res_expr = self.desugar_expr(expr);
                let res_sttm = self.desugar_sttm(bind_ident, pure_ident, next);
                let name = self.gen_name(sttm.range);
                bind(self, sttm.range, name, res_expr, res_sttm)
            }
            concrete::SttmKind::Ask(concrete::Destruct::Destruct(a, b, c, d), val, next) => {
                let res_val = self.desugar_expr(val);

                let name = self.gen_name(sttm.range);

                let res_destruct = self.desugar_destruct(
                    next.range,
                    &concrete::Destruct::Destruct(*a, b.to_owned(), c.to_owned(), *d),
                    desugared::Expr::var(name.clone()),
                    &|this| this.desugar_sttm(bind_ident, pure_ident, next),
                    &|_, _| unreachable!(),
                );

                bind(self, sttm.range, name, res_val, res_destruct)
            }
            concrete::SttmKind::Ask(concrete::Destruct::Ident(name), val, next) => {
                let res_expr = self.desugar_expr(val);
                let res_sttm = self.desugar_sttm(bind_ident, pure_ident, next);
                bind(self, sttm.range, name.clone(), res_expr, res_sttm)
            }
            concrete::SttmKind::Let(destruct, val, next) => {
                let res_val = self.desugar_expr(&val.clone());
                self.desugar_destruct(
                    next.range,
                    destruct,
                    res_val.clone(),
                    &|this| this.desugar_sttm(bind_ident, pure_ident, next),
                    &|this, ident| {
                        desugared::Expr::let_(
                            destruct.locate(),
                            ident.clone(),
                            res_val.clone(),
                            this.desugar_sttm(bind_ident, pure_ident, next),
                        )
                    },
                )
            }
            concrete::SttmKind::Return(expr) => {
                let res_expr = self.desugar_expr(expr);
                self.mk_desugared_fun(expr.locate(), pure_ident.clone(), vec![res_expr], false)
            }
            concrete::SttmKind::RetExpr(expr) => self.desugar_expr(expr),
        }
    }

    pub(crate) fn desugar_do(
        &mut self,
        range: Range,
        typ: &QualifiedIdent,
        sttm: &expr::Sttm,
    ) -> Box<desugared::Expr> {
        let bind_ident = typ.add_segment("bind");
        let pure_ident = typ.add_segment("pure");

        let bind = self.old_book.names.get(bind_ident.to_str());
        let pure = self.old_book.names.get(pure_ident.to_str());

        if bind.is_none() || pure.is_none() {
            self.send_err(PassDiagnostic::NeedToImplementMethods(
                range,
                Sugar::DoNotation,
            ));
            return desugared::Expr::err(range);
        }

        self.desugar_sttm(&bind_ident, &pure_ident, sttm)
    }

    pub(crate) fn desugar_sigma(
        &mut self,
        range: Range,
        name: &Option<Ident>,
        typ: &expr::Expr,
        body: &expr::Expr,
    ) -> Box<desugared::Expr> {
        let sigma = QualifiedIdent::new_static("Sigma", None, range);

        if !self.check_implementation(sigma.to_str(), range, Sugar::Sigma) {
            return desugared::Expr::err(range);
        }

        let name = match name {
            Some(ident) => ident.clone(),
            None => Ident::generate("_var"),
        };

        let spine = vec![
            self.desugar_expr(typ),
            desugared::Expr::lambda(range, name, self.desugar_expr(body), true),
        ];

        self.mk_desugared_ctr(range, sigma, spine, false)
    }

    pub(crate) fn desugar_list(
        &mut self,
        range: Range,
        expr: &[expr::Expr],
    ) -> Box<desugared::Expr> {
        let list_ident = QualifiedIdent::new_static("List", None, range);
        let cons_ident = list_ident.add_segment("cons");
        let nil_ident = list_ident.add_segment("nil");

        let list = self.old_book.names.get(list_ident.to_str());
        let nil = self.old_book.names.get(cons_ident.to_str());
        let cons = self.old_book.names.get(nil_ident.to_str());

        if list.is_none() || nil.is_none() || cons.is_none() {
            self.send_err(PassDiagnostic::NeedToImplementMethods(range, Sugar::List));
            return desugared::Expr::err(range);
        }

        expr.iter().rfold(
            self.mk_desugared_ctr(range, nil_ident, Vec::new(), false),
            |res, elem| {
                let spine = vec![self.desugar_expr(elem), res];
                self.mk_desugared_ctr(range, cons_ident.clone(), spine, false)
            },
        )
    }

    pub(crate) fn desugar_if(
        &mut self,
        range: Range,
        cond: &expr::Expr,
        if_: &expr::Expr,
        else_: &expr::Expr,
    ) -> Box<desugared::Expr> {
        let boolean = QualifiedIdent::new_static("Bool", None, range);
        let bool_if_ident = boolean.add_segment("if");

        let bool_if = self.old_book.names.get(bool_if_ident.to_str());

        if bool_if.is_none() {
            self.send_err(PassDiagnostic::NeedToImplementMethods(range, Sugar::BoolIf));
            return desugared::Expr::err(range);
        }

        let spine = vec![
            self.desugar_expr(cond),
            self.desugar_expr(if_),
            self.desugar_expr(else_),
        ];

        self.mk_desugared_fun(range, bool_if_ident, spine, false)
    }

    pub(crate) fn desugar_open(
        &mut self,
        range: Range,
        type_name: &QualifiedIdent,
        var_name: &Ident,
        motive: &Option<Box<expr::Expr>>,
        next: &expr::Expr,
    ) -> Box<desugared::Expr> {
        let rec = self.old_book.entries.get(type_name.to_str());

        let record = if let Some(TopLevel::RecordType(record)) = rec {
            record
        } else {
            self.send_err(PassDiagnostic::LetDestructOnlyForRecord(type_name.range));
            return desugared::Expr::err(type_name.range);
        };

        let open_id = type_name.add_segment("match");

        if self.old_book.meta.get(&open_id.to_string()).is_none() {
            self.send_err(PassDiagnostic::NeedToImplementMethods(
                range,
                Sugar::Match(type_name.to_string()),
            ));
            return desugared::Expr::err(range);
        }

        let field_names: Vec<_> = record
            .fields
            .iter()
            .map(|x| var_name.add_segment(x.0.to_str()))
            .collect();

        let irrelev = vec![false; field_names.len()];

        let motive = motive
            .as_ref()
            .map(|x| self.desugar_expr(x))
            .unwrap_or_else(|| self.gen_hole_expr(range));

        let spine = vec![
            desugared::Expr::var(var_name.clone()),
            desugared::Expr::lambda(range, var_name.clone(), motive, false),
            desugared::Expr::unfold_lambda(&irrelev, &field_names, self.desugar_expr(next)),
        ];

        self.mk_desugared_fun(range, open_id, spine, false)
    }

    pub(crate) fn desugar_pair(
        &mut self,
        range: Range,
        fst: &expr::Expr,
        snd: &expr::Expr,
    ) -> Box<desugared::Expr> {
        let sigma_new = QualifiedIdent::new_sugared("Sigma", "new", range);

        if !self.check_implementation(sigma_new.to_str(), range, Sugar::Pair) {
            return desugared::Expr::err(range);
        }

        let spine = vec![self.desugar_expr(fst), self.desugar_expr(snd)];

        self.mk_desugared_ctr(range, sigma_new, spine, false)
    }

    pub(crate) fn desugar_expr(&mut self, expr: &expr::Expr) -> Box<desugared::Expr> {
        use expr::ExprKind::*;
        match &expr.data {
            Constr { .. } | App { .. } => self.desugar_app(expr.range, expr),
            All {
                param,
                typ,
                body,
                erased,
            } => desugared::Expr::all(
                expr.range,
                param.clone().unwrap_or_else(|| self.gen_name(expr.range)),
                self.desugar_expr(typ),
                self.desugar_expr(body),
                *erased,
            ),
            Binary { op, fst, snd } => desugared::Expr::binary(
                expr.range,
                *op,
                self.desugar_expr(fst),
                self.desugar_expr(snd),
            ),
            Lambda {
                param,
                typ: None,
                body,
                erased,
            } => {
                desugared::Expr::lambda(expr.range, param.clone(), self.desugar_expr(body), *erased)
            }
            Lambda {
                param,
                typ: Some(typ),
                body,
                erased,
            } => desugared::Expr::ann(
                expr.range,
                desugared::Expr::lambda(
                    expr.range,
                    param.clone(),
                    self.desugar_expr(body),
                    *erased,
                ),
                desugared::Expr::all(
                    typ.range,
                    self.gen_name(expr.range),
                    self.desugar_expr(typ),
                    self.gen_hole_expr(typ.range),
                    *erased,
                ),
            ),
            Ann { val, typ } => {
                desugared::Expr::ann(expr.range, self.desugar_expr(val), self.desugar_expr(typ))
            }
            Var { name } => desugared::Expr::var(name.clone()),
            Hole => desugared::Expr::hole(expr.range, self.gen_hole()),
            Lit { lit } => self.desugar_literal(expr.range, lit),
            Let { name, val, next } => self.desugar_let(expr.range, name, val, next),
            Do { typ, sttm } => self.desugar_do(expr.range, typ, sttm),
            Sigma { param, fst, snd } => self.desugar_sigma(expr.range, param, fst, snd),
            List { args } => self.desugar_list(expr.range, args),
            If { cond, then_, else_ } => self.desugar_if(expr.range, cond, then_, else_),
            Pair { fst, snd } => self.desugar_pair(expr.range, fst, snd),
            Match(matcher) => self.desugar_match(expr.range, matcher),
            Subst(sub) => self.desugar_sub(expr.range, sub),
            Open {
                type_name,
                var_name,
                motive,
                next,
            } => self.desugar_open(expr.range, type_name, var_name, motive, &next),
            SeqRecord(sec) => self.desugar_seq(expr.range, sec),
        }
    }
}
