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
            Literal::Help(s) => desugared::Expr::hlp(range, s.clone()),
            Literal::U60 => desugared::Expr::u60(range),
            Literal::Number(s) => desugared::Expr::num(range, *s),
            Literal::Char(_) => todo!(),
            Literal::String(_) => todo!(),
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

        let bind = |range: Range, name: Ident, expr: Box<desugared::Expr>, next: Box<desugared::Expr>| -> Box<desugared::Expr> {
            desugared::Expr::fun(
                range,
                bind_ident.clone(),
                vec![expr, desugared::Expr::lambda(range, name, next)],
            )
        };

        // TODO: Better generation of identifiers (to remove "_")
        match &sttm.data {
            concrete::SttmKind::Expr(expr, next) => {
                bind(
                    sttm.range.clone(),
                    Ident::generate("_"),
                    self.desugar_expr(expr),
                    self.desugar_sttm(bind_ident, pure_ident, next),
                )
            },
            concrete::SttmKind::Ask(concrete::Destruct::Destruct(a, b, c, d), val, next) => {
                bind(
                    sttm.range.clone(),
                    Ident::generate("$"),
                    self.desugar_expr(val),
                    self.desugar_destruct(&concrete::Destruct::Destruct(*a, b.to_owned(), c.to_owned(), *d), desugared::Expr::var(Ident::generate("$")), &|this| this.desugar_sttm(bind_ident, pure_ident, next), &|_, _| {
                        unreachable!()
                    })
                )
            }
            concrete::SttmKind::Ask(concrete::Destruct::Ident(name), val, next) => {
                bind(
                    sttm.range.clone(),
                    name.clone(),
                    self.desugar_expr(val),
                    self.desugar_sttm(bind_ident, pure_ident, next)
                )
            }
            concrete::SttmKind::Let(destruct, val, next) => {
                let res_val = self.desugar_expr(&val.clone());
                self.desugar_destruct(destruct, res_val, &|this| this.desugar_sttm(bind_ident, pure_ident, next), &|this, ident| {
                    desugared::Expr::let_(
                        destruct.locate(),
                        ident.clone(),
                        this.desugar_expr(val),
                        this.desugar_sttm(bind_ident, pure_ident, next),
                    )
                })
            }
            concrete::SttmKind::Return(expr) => desugared::Expr::fun(
                expr.locate(),
                pure_ident.clone(),
                vec![self.desugar_expr(expr)],
            ),
            concrete::SttmKind::RetExpr(expr) => self.desugar_expr(expr)
        }
    }

    pub fn desugar_do(
        &mut self,
        range: Range,
        typ: &Ident,
        sttm: &expr::Sttm,
    ) -> Box<desugared::Expr> {
        let type_def = self.old_glossary.get_entry_garanteed(typ.to_string());

        if type_def.is_definition() {
            todo!()
        }

        let bind_ident = typ.add_segment("bind");
        let pure_ident = typ.add_segment("pure");

        let bind = self.old_glossary.entries.get(bind_ident.to_string());
        let pure = self.old_glossary.entries.get(pure_ident.to_string());

        if bind.is_none() || pure.is_none() {
            self.send_err(PassError::NeedToImplementMethods(
                range,
                Sugar::DoNotation,
            ));
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
        let sigma = Ident::new(Symbol("Sigma".to_string()), range.ctx.clone(), range.clone());
        let entry = self.old_glossary.entries.get(sigma.to_string());
        if entry.is_none() {
            self.send_err(PassError::NeedToImplementMethods(
                range,
                Sugar::DoNotation,
            ));
        }

        let name = match name {
            Some(ident) => ident.clone(),
            None => Ident::generate("_"),
        };

        desugared::Expr::ctr(range, sigma, vec![
            self.desugar_expr(typ),
            desugared::Expr::lambda(range, name, self.desugar_expr(body))
        ])
    }

    pub fn desugar_list(&mut self, range: Range, expr: &[expr::Expr]) -> Box<desugared::Expr> {
        let cons_ident = Ident::new(Symbol("List.cons".to_string()), range.ctx.clone(), range.clone());
        let nil_ident = Ident::new(Symbol("List.nil".to_string()), range.ctx.clone(), range.clone());
        let list_ident = Ident::new(Symbol("List".to_string()), range.ctx.clone(), range.clone());

        let list = self.old_glossary.entries.get(list_ident.to_string());
        let nil = self.old_glossary.entries.get(cons_ident.to_string());
        let cons = self.old_glossary.entries.get(nil_ident.to_string());


        if list.is_none() || nil.is_none() || cons.is_none() {
            self.send_err(PassError::NeedToImplementMethods(
                range,
                Sugar::List,
            ));
        }
    
        expr.iter().rfold(desugared::Expr::ctr(range, nil_ident, Vec::new()), |res, elem| {
            desugared::Expr::ctr(range, cons_ident.clone(), vec![self.desugar_expr(elem), res])
        })
    }

    pub fn desugar_if(
        &mut self,
        _cond: &expr::Expr,
        _if_: &expr::Expr,
        _else_: &expr::Expr,
    ) -> Box<desugared::Expr> {
        todo!()
    }

    pub fn desugar_pair(&mut self, _fst: &expr::Expr, _snd: &expr::Expr) -> Box<desugared::Expr> {
        todo!()
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
            Sigma(name, typ, expr) => self.desugar_sigma(expr.range, name, typ, expr),
            List(ls) => self.desugar_list(expr.range, ls),
            If(cond, if_, else_) => self.desugar_if(cond, if_, else_),
            Pair(fst, snd) => self.desugar_pair(fst, snd),
        }
    }
}
