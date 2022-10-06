use kind_span::Span;

use crate::expr::{ExprKind, Literal, Match, Open, Sttm, SttmKind, Substitution};
use crate::symbol::*;
use crate::*;

/// A visitor trait following the visitor pattern
/// because it's easier to walk the entire tree
/// just by some nodes without writing some functions
/// to walk through everything (yeah i really hate
/// OOP patterns but this time it's really useful.)
///
/// All of these functions are implemented so we can easily
/// change these default implementations.
pub trait Visitor {
    fn visit_span(&mut self, _: &mut Span) {}

    fn visit_syntax_ctx(&mut self, _: &mut SyntaxCtxIndex) {}

    fn visit_operator(&mut self, _: &mut expr::Operator) {}

    fn visit_literal(&mut self, _: &mut Literal) {}

    fn visit_ident(&mut self, ident: &mut Ident) {
        self.visit_span(&mut ident.span);
        self.visit_syntax_ctx(&mut ident.ctx);
    }

    fn visit_open(&mut self, open: &mut Open) {
        self.visit_expr(&mut open.body);
        match &mut open.expr {
            Some(expr) => self.visit_expr(expr),
            None => (),
        }
        self.visit_ident(&mut open.tipo);
        self.visit_ident(&mut open.name);
    }

    fn visit_match(&mut self, matcher: &mut Match) {
        match &mut matcher.expr {
            Some(expr) => self.visit_expr(expr),
            None => (),
        }
        match &mut matcher.motive {
            Some(expr) => self.visit_expr(expr),
            None => (),
        }
        self.visit_ident(&mut matcher.tipo);
        self.visit_ident(&mut matcher.name);
        for (name, body) in &mut matcher.cases {
            self.visit_expr(body);
            self.visit_ident(name);
        }
    }

    fn visit_argument(&mut self, argument: &mut Argument) {
        self.visit_ident(&mut argument.name);
        self.visit_expr(&mut argument.tipo);
        self.visit_span(&mut argument.span);
    }

    fn visit_entry(&mut self, entry: &mut Entry) {
        self.visit_ident(&mut entry.name);
        for arg in &mut entry.args {
            self.visit_argument(arg)
        }
        self.visit_expr(&mut entry.tipo);
        for rule in &mut entry.rules {
            self.visit_rule(rule)
        }
        for attr in &mut entry.attrs {
            self.visit_attr(attr);
        }
        self.visit_span(&mut entry.span);
    }

    fn visit_attr(&mut self, attr: &mut Attribute) {
        self.visit_ident(&mut attr.name);
        self.visit_span(&mut attr.span);
        // TODO: Visit inner side of the attribute
    }

    fn visit_rule(&mut self, rule: &mut Rule) {
        self.visit_ident(&mut rule.name);
        for pat in &mut rule.pats {
            self.visit_expr(pat);
        }
        self.visit_expr(&mut rule.body);
        self.visit_span(&mut rule.span);
    }

    fn visit_book(&mut self, book: &mut Book) {
        for entr in book.entrs.values_mut() {
            self.visit_entry(entr);
        }
    }

    fn visit_substitution(&mut self, subst: &mut Substitution) {
        self.visit_expr(&mut subst.expr);
        self.visit_ident(&mut subst.name);
    }

    fn visit_sttm(&mut self, sttm: &mut Sttm) {
        self.visit_span(&mut sttm.span);
        match &mut sttm.data {
            SttmKind::Ask(Some(ident), val, next) => {
                self.visit_ident(ident);
                self.visit_expr(val);
                self.visit_sttm(next);
            }
            SttmKind::Let(ident, val, next) => {
                self.visit_ident(ident);
                self.visit_expr(val);
                self.visit_sttm(next);
            }
            SttmKind::Open(tipo, ident, val, next) => {
                self.visit_ident(tipo);
                self.visit_ident(ident);
                match val {
                    Some(val) => self.visit_expr(val),
                    None => (),
                }
                self.visit_sttm(next);
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

    fn visit_expr(&mut self, expr: &mut Expr) {
        self.visit_span(&mut expr.span);
        match &mut expr.data {
            ExprKind::Var(ident) => self.visit_ident(ident),
            ExprKind::All(None, typ, body) => {
                self.visit_expr(typ);
                self.visit_expr(body);
            }
            ExprKind::Pair(fst, snd) => {
                self.visit_expr(fst);
                self.visit_expr(snd);
            }
            ExprKind::All(Some(ident), typ, body) => {
                self.visit_ident(ident);
                self.visit_expr(typ);
                self.visit_expr(body);
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
            ExprKind::Sigma(Some(ident), typ, body) => {
                self.visit_ident(ident);
                self.visit_expr(typ);
                self.visit_expr(body);
            }
            ExprKind::Do(sttm) => self.visit_sttm(sttm),
            ExprKind::Lambda(ident, body) => {
                self.visit_ident(ident);
                self.visit_expr(body);
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
                self.visit_ident(ident);
                self.visit_expr(val);
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
            ExprKind::Hole(_) => {}
            ExprKind::Subst(subst) => self.visit_substitution(subst),
            ExprKind::Match(matcher) => self.visit_match(matcher),
            ExprKind::Open(open) => self.visit_open(open),
        }
    }
}
