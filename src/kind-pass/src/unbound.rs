use std::collections::HashMap;

use kind_tree::concrete::pat::PatIdent;
use kind_tree::concrete::visitor::walk_book;
use kind_tree::symbol::Ident;

use kind_tree::concrete::{
    expr::{Expr, ExprKind, SttmKind},
    pat::{Pat, PatKind},
    visitor::Visitor,
    Argument, Entry, Rule,
};

use crate::errors::PassError;

#[derive(Default)]
pub struct UnboundCollector {
    pub is_on_pat: bool,
    pub errors: Vec<PassError>,
    pub context_vars: Vec<Ident>,
    pub unbound: HashMap<String, Vec<Ident>>,
}

impl Visitor for UnboundCollector {
    fn visit_ident(&mut self, ident: &mut Ident) {
        if !self.context_vars.iter().any(|x| x.data == ident.data) {
            let entry = self.unbound.entry(ident.data.0.clone()).or_default();
            entry.push(ident.clone());
        }
    }

    fn visit_pat_ident(&mut self, ident: &mut PatIdent) {
        if let Some(fst) = self.context_vars.iter().find(|x| x.data == ident.0.data) {
            self.errors.push(PassError::RepeatedVariable(fst.range, ident.0.range))
        }
    }

    fn visit_argument(&mut self, argument: &mut Argument) {
        self.context_vars.push(argument.name.clone());
        match &mut argument.tipo {
            Some(res) => self.visit_expr(res),
            None => (),
        }
    }

    fn visit_rule(&mut self, rule: &mut Rule) {
        let vars = self.context_vars.clone();
        self.is_on_pat = true;
        for pat in &mut rule.pats {
            self.visit_pat(pat);
        }
        self.is_on_pat = false;
        self.visit_expr(&mut rule.body);
        self.context_vars = vars;
    }

    fn visit_entry(&mut self, entry: &mut Entry) {
        let vars = self.context_vars.clone();
        for arg in &mut entry.args {
            self.visit_argument(arg)
        }

        self.visit_expr(&mut entry.tipo);
        self.context_vars = vars;

        for rule in &mut entry.rules {
            self.visit_rule(rule)
        }
    }

    fn visit_book(&mut self, book: &mut kind_tree::concrete::Book) {
        self.context_vars = book.names.clone();
        walk_book(self, book);
    }

    fn visit_sttm(&mut self, sttm: &mut kind_tree::concrete::expr::Sttm) {
        match &mut sttm.data {
            SttmKind::Ask(Some(ident), val, next) => {
                self.context_vars.push(ident.clone());
                self.visit_expr(val);
                self.visit_sttm(next);
            }
            SttmKind::Let(ident, val, next) => {
                self.context_vars.push(ident.clone());
                self.visit_expr(val);
                self.visit_sttm(next);
            }
            SttmKind::Open(_, _, _, _) => {
                todo!()
            }
            SttmKind::Ask(None, val, next) => {
                self.visit_expr(val);
                self.visit_sttm(next);
            }
            SttmKind::Expr(expr, next) => {
                self.visit_expr(expr);
                self.visit_sttm(next);
            }
            SttmKind::Return(expr) => {
                self.visit_expr(expr);
            }
        }
    }

    fn visit_pat(&mut self, pat: &mut Pat) {
        match &mut pat.data {
            PatKind::Var(ident) => self.visit_pat_ident(ident),
            PatKind::Str(_) => (),
            PatKind::Num(_) => (),
            PatKind::Hole => (),
            PatKind::List(ls) => {
                for pat in ls {
                    self.visit_pat(pat)
                }
            }
            PatKind::Pair(fst, snd) => {
                self.visit_pat(fst);
                self.visit_pat(snd);
            }
            PatKind::App(t, ls) => {
                self.is_on_pat = false;
                self.visit_ident(t);
                self.is_on_pat = true;
                for pat in ls {
                    self.visit_pat(pat)
                }
            }
        }
    }

    fn visit_expr(&mut self, expr: &mut Expr) {
        match &mut expr.data {
            ExprKind::Var(ident) => self.visit_ident(ident),
            ExprKind::Data(ident) => {
                if !self.context_vars.iter().any(|x| x.data == ident.data) {
                    let entry = self.unbound.entry(ident.data.0.clone()).or_default();
                    entry.push(ident.clone());
                }
            }
            ExprKind::All(None, typ, body) => {
                self.visit_expr(typ);
                self.visit_expr(body);
            }
            ExprKind::Pair(fst, snd) => {
                self.visit_expr(fst);
                self.visit_expr(snd);
            }
            ExprKind::All(Some(ident), typ, body) => {
                self.visit_expr(typ);
                self.context_vars.push(ident.clone());
                self.visit_expr(body);
                self.context_vars.pop();
            }
            ExprKind::Sigma(Some(ident), typ, body) => {
                self.visit_expr(typ);
                self.context_vars.push(ident.clone());
                self.visit_expr(body);
                self.context_vars.pop();
            }
            ExprKind::Lambda(ident, binder, body) => {
                match binder {
                    Some(x) => self.visit_expr(x),
                    None => (),
                }
                self.context_vars.push(ident.clone());
                self.visit_expr(body);
                self.context_vars.pop();
            }
            ExprKind::Sigma(None, typ, body) => {
                self.visit_expr(typ);
                self.visit_expr(body);
            }
            ExprKind::If(cond, if_, else_) => {
                self.visit_expr(cond);
                self.visit_expr(if_);
                self.visit_expr(else_);
            }
            ExprKind::Do(ident, sttm) => {
                self.visit_ident(ident);
                self.visit_sttm(sttm)
            }
            ExprKind::App(expr, spine) => {
                self.visit_expr(expr);
                for arg in spine {
                    self.visit_expr(arg);
                }
            }
            ExprKind::List(spine) => {
                for arg in spine {
                    self.visit_expr(arg);
                }
            }
            ExprKind::Let(ident, val, body) => {
                self.context_vars.push(ident.clone());
                self.visit_expr(val);
                self.context_vars.pop();
                self.visit_expr(body);
            }
            ExprKind::Ann(val, ty) => {
                self.visit_expr(val);
                self.visit_expr(ty);
            }
            ExprKind::Lit(lit) => {
                self.visit_literal(lit);
            }
            ExprKind::Binary(op, a, b) => {
                self.visit_operator(op);
                self.visit_expr(a);
                self.visit_expr(b);
            }
            ExprKind::Subst(_subst) => todo!(),
            ExprKind::Match(_matcher) => todo!(),
            ExprKind::Open(_open) => todo!(),
            ExprKind::Help(_) => {}
            ExprKind::Hole => {}
        }
    }
}
