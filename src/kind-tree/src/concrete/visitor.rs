use kind_span::{Span, SyntaxCtxIndex};

use crate::concrete::expr::*;
use crate::symbol::*;

use super::{
    expr,
    pat::{Pat, PatKind},
    Argument, Attribute, Book, Entry, Rule,
};

/// A visitor trait following the visitor pattern
/// because it's easier to walk the entire tree
/// just by some nodes without writing some functions
/// to walk through everything (yeah i really hate
/// OOP patterns but this time it's really useful.)
///
/// All of these functions are implemented so we can easily
/// change these default implementations.

pub trait Visitor: Sized {
    fn visit_span(&mut self, x: &mut Span) {
        walk_span(self, x);
    }

    fn visit_syntax_ctx(&mut self, synt: &mut SyntaxCtxIndex) {
        walk_syntax_ctx(self, synt);
    }

    fn visit_operator(&mut self, op: &mut expr::Operator) {
        walk_operator(self, op);
    }

    fn visit_literal(&mut self, lit: &mut Literal) {
        walk_literal(self, lit);
    }

    fn visit_ident(&mut self, ident: &mut Ident) {
        walk_ident(self, ident);
    }

    fn visit_open(&mut self, open: &mut Open) {
        walk_open(self, open);
    }

    fn visit_match(&mut self, matcher: &mut Match) {
        walk_match(self, matcher);
    }

    fn visit_argument(&mut self, argument: &mut Argument) {
        walk_argument(self, argument);
    }

    fn visit_entry(&mut self, entry: &mut Entry) {
        walk_entry(self, entry);
    }

    fn visit_attr(&mut self, attr: &mut Attribute) {
        walk_attr(self, attr);
    }

    fn visit_pat(&mut self, pat: &mut Pat) {
        walk_pat(self, pat);
    }

    fn visit_rule(&mut self, rule: &mut Rule) {
        walk_rule(self, rule);
    }

    fn visit_book(&mut self, book: &mut Book) {
        walk_book(self, book);
    }

    fn visit_substitution(&mut self, subst: &mut Substitution) {
        walk_substitution(self, subst);
    }

    fn visit_sttm(&mut self, sttm: &mut Sttm) {
        walk_sttm(self, sttm);
    }

    fn visit_expr(&mut self, expr: &mut Expr) {
        walk_expr(self, expr);
    }
}

fn walk_span<T: Visitor>(_: &mut T, _: &mut Span) {}

fn walk_syntax_ctx<T: Visitor>(_: &mut T, _: &mut SyntaxCtxIndex) {}

fn walk_operator<T: Visitor>(_: &mut T, _: &mut expr::Operator) {}

fn walk_literal<T: Visitor>(_: &mut T, _: &mut Literal) {}

fn walk_ident<T: Visitor>(ctx: &mut T, ident: &mut Ident) {
    ctx.visit_span(&mut ident.span);
    ctx.visit_syntax_ctx(&mut ident.ctx);
}

fn walk_open<T: Visitor>(ctx: &mut T, open: &mut Open) {
    ctx.visit_expr(&mut open.body);
    match &mut open.expr {
        Some(expr) => ctx.visit_expr(expr),
        None => (),
    }
    ctx.visit_ident(&mut open.tipo);
    ctx.visit_ident(&mut open.name);
}

fn walk_match<T: Visitor>(ctx: &mut T, matcher: &mut Match) {
    match &mut matcher.expr {
        Some(expr) => ctx.visit_expr(expr),
        None => (),
    }
    match &mut matcher.motive {
        Some(expr) => ctx.visit_expr(expr),
        None => (),
    }
    ctx.visit_ident(&mut matcher.tipo);
    ctx.visit_ident(&mut matcher.name);
    for (name, body) in &mut matcher.cases {
        ctx.visit_expr(body);
        ctx.visit_ident(name);
    }
}

fn walk_argument<T: Visitor>(ctx: &mut T, argument: &mut Argument) {
    ctx.visit_ident(&mut argument.name);
    match &mut argument.tipo {
        Some(tipo) => ctx.visit_expr(tipo),
        None => (),
    }
    ctx.visit_span(&mut argument.span);
}

fn walk_entry<T: Visitor>(ctx: &mut T, entry: &mut Entry) {
    ctx.visit_ident(&mut entry.name);
    for arg in &mut entry.args {
        ctx.visit_argument(arg)
    }
    ctx.visit_expr(&mut entry.tipo);
    for rule in &mut entry.rules {
        ctx.visit_rule(rule)
    }
    for attr in &mut entry.attrs {
        ctx.visit_attr(attr);
    }
    ctx.visit_span(&mut entry.span);
}

fn walk_attr<T: Visitor>(ctx: &mut T, attr: &mut Attribute) {
    ctx.visit_ident(&mut attr.name);
    ctx.visit_span(&mut attr.span);
    // TODO: Visit inner side of the attribute
}

fn walk_pat<T: Visitor>(ctx: &mut T, pat: &mut Pat) {
    ctx.visit_span(&mut pat.span);
    match &mut pat.data {
        PatKind::Var(ident) => ctx.visit_ident(ident),
        PatKind::Str(_) => (),
        PatKind::Num(_) => (),
        PatKind::Hole => (),
        PatKind::List(ls) => {
            for pat in ls {
                ctx.visit_pat(pat)
            }
        }
        PatKind::Pair(fst, snd) => {
            ctx.visit_pat(fst);
            ctx.visit_pat(snd);
        }
        PatKind::App(t, ls) => {
            ctx.visit_ident(t);
            for pat in ls {
                ctx.visit_pat(pat)
            }
        }
    }
}

fn walk_rule<T: Visitor>(ctx: &mut T, rule: &mut Rule) {
    ctx.visit_ident(&mut rule.name);
    for pat in &mut rule.pats {
        ctx.visit_pat(pat);
    }
    ctx.visit_expr(&mut rule.body);
    ctx.visit_span(&mut rule.span);
}

fn walk_book<T: Visitor>(ctx: &mut T, book: &mut Book) {
    for entr in book.entrs.values_mut() {
        ctx.visit_entry(entr);
    }
}

fn walk_substitution<T: Visitor>(ctx: &mut T, subst: &mut Substitution) {
    ctx.visit_expr(&mut subst.expr);
    ctx.visit_ident(&mut subst.name);
}

fn walk_sttm<T: Visitor>(ctx: &mut T, sttm: &mut Sttm) {
    ctx.visit_span(&mut sttm.span);
    match &mut sttm.data {
        SttmKind::Ask(Some(ident), val, next) => {
            ctx.visit_ident(ident);
            ctx.visit_expr(val);
            ctx.visit_sttm(next);
        }
        SttmKind::Let(ident, val, next) => {
            ctx.visit_ident(ident);
            ctx.visit_expr(val);
            ctx.visit_sttm(next);
        }
        SttmKind::Open(tipo, ident, val, next) => {
            ctx.visit_ident(tipo);
            ctx.visit_ident(ident);
            match val {
                Some(val) => ctx.visit_expr(val),
                None => (),
            }
            ctx.visit_sttm(next);
        }
        SttmKind::Ask(None, val, next) => {
            ctx.visit_expr(val);
            ctx.visit_sttm(next);
        }
        SttmKind::Expr(expr, next) => {
            ctx.visit_expr(expr);
            ctx.visit_sttm(next);
        }
        SttmKind::Return(expr) => {
            ctx.visit_expr(expr);
        }
    }
}

fn walk_expr<T: Visitor>(ctx: &mut T, expr: &mut Expr) {
    ctx.visit_span(&mut expr.span);
    match &mut expr.data {
        ExprKind::Var(ident) => ctx.visit_ident(ident),
        ExprKind::All(None, typ, body) => {
            ctx.visit_expr(typ);
            ctx.visit_expr(body);
        }
        ExprKind::Pair(fst, snd) => {
            ctx.visit_expr(fst);
            ctx.visit_expr(snd);
        }
        ExprKind::All(Some(ident), typ, body) => {
            ctx.visit_ident(ident);
            ctx.visit_expr(typ);
            ctx.visit_expr(body);
        }
        ExprKind::Sigma(None, typ, body) => {
            ctx.visit_expr(typ);
            ctx.visit_expr(body);
        }
        ExprKind::If(cond, if_, else_) => {
            ctx.visit_expr(cond);
            ctx.visit_expr(if_);
            ctx.visit_expr(else_);
        }
        ExprKind::Sigma(Some(ident), typ, body) => {
            ctx.visit_ident(ident);
            ctx.visit_expr(typ);
            ctx.visit_expr(body);
        }
        ExprKind::Do(ident, sttm) => {
            ctx.visit_ident(ident);
            ctx.visit_sttm(sttm)
        }
        ExprKind::Lambda(ident, binder, body) => {
            ctx.visit_ident(ident);
            match binder {
                Some(x) => ctx.visit_expr(x),
                None => (),
            }
            ctx.visit_expr(body);
        }
        ExprKind::App(expr, spine) => {
            ctx.visit_expr(expr);
            for arg in spine {
                ctx.visit_expr(arg);
            }
        }
        ExprKind::List(spine) => {
            for arg in spine {
                ctx.visit_expr(arg);
            }
        }
        ExprKind::Let(ident, val, body) => {
            ctx.visit_ident(ident);
            ctx.visit_expr(val);
            ctx.visit_expr(body);
        }
        ExprKind::Ann(val, ty) => {
            ctx.visit_expr(val);
            ctx.visit_expr(ty);
        }
        ExprKind::Lit(lit) => {
            ctx.visit_literal(lit);
        }
        ExprKind::Binary(op, a, b) => {
            ctx.visit_operator(op);
            ctx.visit_expr(a);
            ctx.visit_expr(b);
        }
        ExprKind::Help(id) => ctx.visit_ident(id),
        ExprKind::Hole => {}
        ExprKind::Subst(subst) => ctx.visit_substitution(subst),
        ExprKind::Match(matcher) => ctx.visit_match(matcher),
        ExprKind::Open(open) => ctx.visit_open(open),
    }
}
