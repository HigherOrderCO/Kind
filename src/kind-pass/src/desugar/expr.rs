use kind_span::{Locatable, Range};
use kind_tree::concrete::{self, expr, Literal};
use kind_tree::desugared;
use kind_tree::symbol::{Ident, Symbol};

use crate::errors::{PassError, Sugar};

use super::DesugarState;

impl<'a> DesugarState<'a> {
    pub fn desugar_literal(
        &mut self,
        range: Range,
        literal: &expr::Literal,
    ) -> Box<desugared::Expr> {
        match literal {
            Literal::Type => desugared::Expr::typ(range),
            Literal::Help(name) => desugared::Expr::hlp(range, name.clone()),
            Literal::U60 => desugared::Expr::u60(range),
            Literal::Number(num) => desugared::Expr::num(range, *num),
            Literal::String(string) => desugared::Expr::str(range, string.to_owned()),
            Literal::Char(_) => todo!(),
        }
    }

    pub fn desugar_sub(&mut self, range: Range, sub: &expr::Substitution) -> Box<desugared::Expr> {
        desugared::Expr::sub(
            range,
            sub.name.clone(),
            sub.indx,
            sub.redx,
            self.desugar_expr(&sub.expr),
        )
    }

    pub fn desugar_sttm(
        &mut self,
        bind_ident: &Ident,
        pure_ident: &Ident,
        sttm: &expr::Sttm,
    ) -> Box<desugared::Expr> {
        // Creates a bind constructor
        let bind = |this: &mut Self,
                    range: Range,
                    name: Ident,
                    expr: Box<desugared::Expr>,
                    next: Box<desugared::Expr>|
         -> Box<desugared::Expr> {
            this.mk_desugared_fun(
                range,
                bind_ident.clone(),
                vec![expr, desugared::Expr::lambda(range, name, next)],
            )
        };

        match &sttm.data {
            concrete::SttmKind::Expr(expr, next) => {
                let res_expr = self.desugar_expr(expr);
                let res_sttm = self.desugar_sttm(bind_ident, pure_ident, next);
                bind(self, sttm.range, Ident::generate("~"), res_expr, res_sttm)
            }
            concrete::SttmKind::Ask(concrete::Destruct::Destruct(a, b, c, d), val, next) => {
                let res_val = self.desugar_expr(val);
                let res_destruct = self.desugar_destruct(
                    &concrete::Destruct::Destruct(*a, b.to_owned(), c.to_owned(), *d),
                    desugared::Expr::var(Ident::generate("$")),
                    &|this| this.desugar_sttm(bind_ident, pure_ident, next),
                    &|_, _| unreachable!(),
                );

                bind(
                    self,
                    sttm.range,
                    Ident::generate("$"),
                    res_val,
                    res_destruct,
                )
            }
            concrete::SttmKind::Ask(concrete::Destruct::Ident(name), val, next) => {
                let res_expr = self.desugar_expr(val);
                let res_sttm = self.desugar_sttm(bind_ident, pure_ident, next);
                bind(self, sttm.range, name.clone(), res_expr, res_sttm)
            }
            concrete::SttmKind::Let(destruct, val, next) => {
                let res_val = self.desugar_expr(&val.clone());
                self.desugar_destruct(
                    destruct,
                    res_val,
                    &|this| this.desugar_sttm(bind_ident, pure_ident, next),
                    &|this, ident| {
                        desugared::Expr::let_(
                            destruct.locate(),
                            ident.clone(),
                            this.desugar_expr(val),
                            this.desugar_sttm(bind_ident, pure_ident, next),
                        )
                    },
                )
            }
            concrete::SttmKind::Return(expr) => {
                let res_expr = self.desugar_expr(expr);
                self.mk_desugared_fun(expr.locate(), pure_ident.clone(), vec![res_expr])
            }
            concrete::SttmKind::RetExpr(expr) => self.desugar_expr(expr),
        }
    }

    pub fn desugar_do(
        &mut self,
        range: Range,
        typ: &Ident,
        sttm: &expr::Sttm,
    ) -> Box<desugared::Expr> {
        let bind_ident = typ.add_segment("bind");
        let pure_ident = typ.add_segment("pure");

        let bind = self.old_glossary.entries.get(bind_ident.to_string());
        let pure = self.old_glossary.entries.get(pure_ident.to_string());

        if bind.is_none() || pure.is_none() {
            self.send_err(PassError::NeedToImplementMethods(range, Sugar::DoNotation));
            return desugared::Expr::err(range);
        }

        self.desugar_sttm(&bind_ident, &pure_ident, sttm)
    }

    pub fn desugar_sigma(
        &mut self,
        range: Range,
        name: &Option<Ident>,
        typ: &expr::Expr,
        body: &expr::Expr,
    ) -> Box<desugared::Expr> {
        let sigma = Ident::new(Symbol("Sigma".to_string()), range);

        let entry = self.old_glossary.entries.get(sigma.to_string());
        if entry.is_none() {
            self.send_err(PassError::NeedToImplementMethods(range, Sugar::Sigma));
            return desugared::Expr::err(range);
        }

        let name = match name {
            Some(ident) => ident.clone(),
            None => Ident::generate("_"),
        };

        let spine = vec![
            self.desugar_expr(typ),
            desugared::Expr::lambda(range, name, self.desugar_expr(body)),
        ];

        self.mk_desugared_ctr(range, sigma, spine)
    }

    pub fn desugar_list(&mut self, range: Range, expr: &[expr::Expr]) -> Box<desugared::Expr> {
        let cons_ident = Ident::new(Symbol("List.cons".to_string()), range);
        let nil_ident = Ident::new(Symbol("List.nil".to_string()), range);
        let list_ident = Ident::new(Symbol("List".to_string()), range);

        let list = self.old_glossary.entries.get(list_ident.to_string());
        let nil = self.old_glossary.entries.get(cons_ident.to_string());
        let cons = self.old_glossary.entries.get(nil_ident.to_string());

        if list.is_none() || nil.is_none() || cons.is_none() {
            self.send_err(PassError::NeedToImplementMethods(range, Sugar::List));
            return desugared::Expr::err(range);
        }

        expr.iter().rfold(
            self.mk_desugared_ctr(range, nil_ident, Vec::new()),
            |res, elem| {
                let spine = vec![self.desugar_expr(elem), res];
                self.mk_desugared_ctr(range, cons_ident.clone(), spine)
            },
        )
    }

    pub fn desugar_if(
        &mut self,
        range: Range,
        cond: &expr::Expr,
        if_: &expr::Expr,
        else_: &expr::Expr,
    ) -> Box<desugared::Expr> {
        let bool_ident = Ident::new(Symbol("Bool.if".to_string()), range);

        let bool_if = self.old_glossary.entries.get(bool_ident.to_string());

        if bool_if.is_none() {
            self.send_err(PassError::NeedToImplementMethods(range, Sugar::BoolIf));
            return desugared::Expr::err(range);
        }

        let spine = vec![
            self.desugar_expr(cond),
            self.desugar_expr(if_),
            self.desugar_expr(else_),
        ];

        self.mk_desugared_fun(range, bool_ident, spine)
    }

    pub fn desugar_pair(
        &mut self,
        range: Range,
        fst: &expr::Expr,
        snd: &expr::Expr,
    ) -> Box<desugared::Expr> {
        let sigma_new = Ident::new(Symbol("Sigma.new".to_string()), range);

        let entry = self.old_glossary.entries.get(sigma_new.to_string());
        if entry.is_none() {
            self.send_err(PassError::NeedToImplementMethods(range, Sugar::Pair));
            return desugared::Expr::err(range);
        }

        let spine = vec![self.desugar_expr(fst), self.desugar_expr(snd)];

        self.mk_desugared_ctr(range, sigma_new, spine)
    }

    pub fn desugar_expr(&mut self, expr: &expr::Expr) -> Box<desugared::Expr> {
        use expr::ExprKind::*;
        match &expr.data {
            Constr(_) => self.desugar_app(expr.range, expr, &[]),
            All(ident, typ, body) => desugared::Expr::all(
                expr.range,
                ident.clone(),
                self.desugar_expr(typ),
                self.desugar_expr(body),
            ),
            Binary(op, left, right) => desugared::Expr::binary(
                expr.range,
                *op,
                self.desugar_expr(left),
                self.desugar_expr(right),
            ),
            Lambda(ident, _typ, body) => {
                desugared::Expr::lambda(expr.range, ident.clone(), self.desugar_expr(body))
            }
            Ann(val, typ) => {
                desugared::Expr::ann(expr.range, self.desugar_expr(val), self.desugar_expr(typ))
            }
            Var(ident) => desugared::Expr::var(ident.clone()),
            Hole => desugared::Expr::hole(expr.range, self.gen_hole()),
            App(head, spine) => self.desugar_app(expr.range, head, spine),
            Lit(literal) => self.desugar_literal(expr.range, literal),
            Match(matcher) => self.desugar_match(expr.range, matcher),
            Let(destruct, val, next) => self.desugar_let(expr.range, destruct, val, next),
            Subst(sub) => self.desugar_sub(expr.range, sub),
            Do(typ, sttm) => self.desugar_do(expr.range, typ, sttm),
            Sigma(name, typ, body) => self.desugar_sigma(expr.range, name, typ, body),
            List(ls) => self.desugar_list(expr.range, ls),
            If(cond, if_, else_) => self.desugar_if(expr.range, cond, if_, else_),
            Pair(fst, snd) => self.desugar_pair(expr.range, fst, snd),
        }
    }
}
