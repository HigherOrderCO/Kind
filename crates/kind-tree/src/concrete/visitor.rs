//! Specifies a visitor trait following the visitor pattern
//! because it's easier to walk the entire tree
//! just by some nodes without writing some functions
//! to walk through everything (yeah i really hate
//! OOP patterns but this time it's really useful.)
//!
//! All of these functions are implemented so we can easily
//! change these default implementations.
//! use kind_span::{Range, SyntaxCtxIndex};

use crate::symbol::*;
use crate::{concrete::expr::*, concrete::Book};

use super::pat::{Pat, PatIdent, PatKind};
use super::TopLevel;
use super::{Argument, Attribute, AttributeStyle, Constructor, Entry, Module, Rule};

#[macro_export]
macro_rules! visit_vec {
    ($args:expr, $pat:pat => $fun:expr) => {
        for $pat in $args {
            $fun
        }
    };
}

#[macro_export]
macro_rules! visit_opt {
    ($args:expr, $pat:pat => $fun:expr) => {
        match $args {
            Some($pat) => $fun,
            None => (),
        }
    };
}

use kind_span::{Range, SyntaxCtxIndex};

pub(crate) use visit_opt;
pub(crate) use visit_vec;

pub trait Visitor: Sized {
    fn visit_range(&mut self, x: &mut Range) {
        walk_range(self, x);
    }

    fn visit_attr_style(&mut self, attr: &mut AttributeStyle) {
        walk_attr_style(self, attr);
    }

    fn visit_attr(&mut self, attr: &mut Attribute) {
        walk_attr(self, attr);
    }

    fn visit_syntax_ctx(&mut self, synt: &mut SyntaxCtxIndex) {
        walk_syntax_ctx(self, synt);
    }

    fn visit_literal(&mut self, range: Range, lit: &mut Literal) {
        walk_literal(self, range, lit);
    }

    fn visit_pat_ident(&mut self, ident: &mut PatIdent) {
        walk_pat_ident(self, ident);
    }

    fn visit_qualified_ident(&mut self, ident: &mut QualifiedIdent) {
        walk_qualified_ident(self, ident);
    }

    fn visit_ident(&mut self, ident: &mut Ident) {
        walk_ident(self, ident);
    }

    fn visit_app_binding(&mut self, ident: &mut AppBinding) {
        walk_app_binding(self, ident);
    }

    fn visit_destruct(&mut self, ident: &mut Destruct) {
        walk_destruct(self, ident);
    }

    fn visit_match(&mut self, matcher: &mut Match) {
        walk_match(self, matcher);
    }

    fn visit_constructor(&mut self, construtor: &mut Constructor) {
        walk_constructor(self, construtor);
    }

    fn visit_argument(&mut self, argument: &mut Argument) {
        walk_argument(self, argument);
    }

    fn visit_book(&mut self, book: &mut Book) {
        walk_book(self, book)
    }

    fn visit_entry(&mut self, entry: &mut Entry) {
        walk_entry(self, entry);
    }

    fn visit_pat(&mut self, pat: &mut Pat) {
        walk_pat(self, pat);
    }

    fn visit_binding(&mut self, binding: &mut Binding) {
        walk_binding(self, binding);
    }

    fn visit_top_level(&mut self, toplevel: &mut TopLevel) {
        walk_top_level(self, toplevel)
    }

    fn visit_rule(&mut self, rule: &mut Rule) {
        walk_rule(self, rule);
    }

    fn visit_module(&mut self, module: &mut Module) {
        walk_module(self, module);
    }

    fn visit_substitution(&mut self, subst: &mut Substitution) {
        walk_substitution(self, subst);
    }

    fn visit_case_binding(&mut self, case_binding: &mut CaseBinding) {
        walk_case_binding(self, case_binding);
    }

    fn visit_case(&mut self, case: &mut Case) {
        walk_case(self, case);
    }

    fn visit_sttm(&mut self, sttm: &mut Sttm) {
        walk_sttm(self, sttm);
    }

    fn visit_expr(&mut self, expr: &mut Expr) {
        walk_expr(self, expr);
    }
}

pub fn walk_range<T: Visitor>(_: &mut T, _: &mut Range) {}

pub fn walk_syntax_ctx<T: Visitor>(_: &mut T, _: &mut SyntaxCtxIndex) {}

pub fn walk_literal<T: Visitor>( _: &mut T, _: Range, _: &mut Literal) {}

pub fn walk_constructor<T: Visitor>(ctx: &mut T, cons: &mut Constructor) {
    ctx.visit_ident(&mut cons.name);
    visit_vec!(cons.args.get_vec(), arg => ctx.visit_argument(arg));
    visit_opt!(&mut cons.typ, arg => ctx.visit_expr(arg))
}

pub fn walk_book<T: Visitor>(ctx: &mut T, book: &mut Book) {
    visit_vec!(&mut book.entries, (_, arg) => ctx.visit_top_level(arg));
}

pub fn walk_pat_ident<T: Visitor>(ctx: &mut T, ident: &mut PatIdent) {
    ctx.visit_range(&mut ident.0.range);
}

pub fn walk_ident<T: Visitor>(ctx: &mut T, ident: &mut Ident) {
    ctx.visit_range(&mut ident.range);
}

pub fn walk_qualified_ident<T: Visitor>(ctx: &mut T, ident: &mut QualifiedIdent) {
    ctx.visit_range(&mut ident.range);
}

pub fn walk_destruct<T: Visitor>(ctx: &mut T, destruct: &mut Destruct) {
    match destruct {
        Destruct::Destruct(range, i, e, _) => {
            ctx.visit_qualified_ident(i);
            ctx.visit_range(range);
            visit_vec!(e, e => ctx.visit_case_binding(e))
        }
        Destruct::Ident(i) => ctx.visit_ident(i),
    }
}

pub fn walk_binding<T: Visitor>(ctx: &mut T, binding: &mut Binding) {
    match binding {
        Binding::Positional(e) => ctx.visit_expr(e),
        Binding::Named(span, ident, e) => {
            ctx.visit_range(span);
            ctx.visit_ident(ident);
            ctx.visit_expr(e);
        }
    }
}

pub fn walk_app_binding<T: Visitor>(ctx: &mut T, binding: &mut AppBinding) {
    ctx.visit_expr(&mut binding.data)
}

pub fn walk_case_binding<T: Visitor>(ctx: &mut T, binding: &mut CaseBinding) {
    match binding {
        CaseBinding::Field(ident) => ctx.visit_ident(ident),
        CaseBinding::Renamed(ident, rename) => {
            ctx.visit_ident(ident);
            ctx.visit_ident(rename);
        }
    }
}

pub fn walk_case<T: Visitor>(ctx: &mut T, case: &mut Case) {
    ctx.visit_ident(&mut case.constructor);
    for binding in &mut case.bindings {
        ctx.visit_case_binding(binding);
    }
    ctx.visit_expr(&mut case.value)
}

pub fn walk_match<T: Visitor>(ctx: &mut T, matcher: &mut Match) {
    ctx.visit_qualified_ident(&mut matcher.typ);

    ctx.visit_ident(&mut matcher.scrutinee);

    if let Some(opt) = &mut matcher.value {
        ctx.visit_expr(opt);
    }

    for name in &mut matcher.with_vars {
        ctx.visit_ident(name)
    }

    match &mut matcher.motive {
        Some(expr) => ctx.visit_expr(expr),
        None => (),
    }

    for case in &mut matcher.cases {
        ctx.visit_case(case)
    }
}

pub fn walk_argument<T: Visitor>(ctx: &mut T, argument: &mut Argument) {
    ctx.visit_ident(&mut argument.name);
    match &mut argument.typ {
        Some(typ) => ctx.visit_expr(typ),
        None => (),
    }
    ctx.visit_range(&mut argument.range);
}

pub fn walk_entry<T: Visitor>(ctx: &mut T, entry: &mut Entry) {
    ctx.visit_qualified_ident(&mut entry.name);
    for arg in entry.args.iter_mut() {
        ctx.visit_argument(arg)
    }
    ctx.visit_expr(&mut entry.typ);
    for rule in &mut entry.rules {
        ctx.visit_rule(rule)
    }
    for attr in &mut entry.attrs {
        ctx.visit_attr(attr);
    }
    ctx.visit_range(&mut entry.range);
}

pub fn walk_attr<T: Visitor>(ctx: &mut T, attr: &mut Attribute) {
    ctx.visit_ident(&mut attr.name);
    ctx.visit_range(&mut attr.range);
    visit_opt!(&mut attr.value, x => ctx.visit_attr_style(x))
}

pub fn walk_attr_style<T: Visitor>(ctx: &mut T, attr: &mut AttributeStyle) {
    match attr {
        AttributeStyle::Ident(r, _) => {
            ctx.visit_range(r);
        }
        AttributeStyle::String(r, _) => {
            ctx.visit_range(r);
        }
        AttributeStyle::Number(r, _) => {
            ctx.visit_range(r);
        }
        AttributeStyle::List(r, l) => {
            ctx.visit_range(r);
            visit_vec!(l.iter_mut(), attr => ctx.visit_attr_style(attr))
        }
    }
}

pub fn walk_pat<T: Visitor>(ctx: &mut T, pat: &mut Pat) {
    ctx.visit_range(&mut pat.range);
    match &mut pat.data {
        PatKind::Var(ident) => ctx.visit_pat_ident(ident),
        PatKind::Str(_) => (),
        PatKind::U60(_) => (),
        PatKind::U120(_) => (),
        PatKind::F60(_) => (),
        PatKind::Char(_) => (),
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
            ctx.visit_qualified_ident(t);
            for pat in ls {
                ctx.visit_pat(pat)
            }
        }
    }
}

pub fn walk_rule<T: Visitor>(ctx: &mut T, rule: &mut Rule) {
    ctx.visit_qualified_ident(&mut rule.name);
    for pat in &mut rule.pats {
        ctx.visit_pat(pat);
    }
    ctx.visit_expr(&mut rule.body);
    ctx.visit_range(&mut rule.range);
}

pub fn walk_top_level<T: Visitor>(ctx: &mut T, toplevel: &mut TopLevel) {
    match toplevel {
        super::TopLevel::SumType(sum) => {
            ctx.visit_qualified_ident(&mut sum.name);
            visit_vec!(&mut sum.attrs, arg => ctx.visit_attr(arg));
            visit_vec!(sum.parameters.get_vec(), arg => ctx.visit_argument(arg));
            visit_vec!(sum.indices.get_vec(), arg => ctx.visit_argument(arg));
            visit_vec!(&mut sum.constructors, arg => ctx.visit_constructor(arg));
        }
        super::TopLevel::RecordType(rec) => {
            ctx.visit_qualified_ident(&mut rec.name);
            visit_vec!(&mut rec.attrs, arg => ctx.visit_attr(arg));
            visit_vec!(rec.parameters.get_vec(), arg => ctx.visit_argument(arg));
            visit_vec!(&mut rec.fields, (name, _docs, typ) => {
                ctx.visit_ident(name);
                ctx.visit_expr(typ);
            });
        }
        super::TopLevel::Entry(entry) => {
            ctx.visit_entry(entry);
        }
    }
}

pub fn walk_module<T: Visitor>(ctx: &mut T, module: &mut Module) {
    for toplevel in &mut module.entries {
        walk_top_level(ctx, toplevel)
    }
}

pub fn walk_substitution<T: Visitor>(ctx: &mut T, subst: &mut Substitution) {
    ctx.visit_expr(&mut subst.expr);
    ctx.visit_ident(&mut subst.name);
}

pub fn walk_sttm<T: Visitor>(ctx: &mut T, sttm: &mut Sttm) {
    ctx.visit_range(&mut sttm.range);
    match &mut sttm.data {
        SttmKind::Ask(ident, val, next) => {
            ctx.visit_destruct(ident);
            ctx.visit_expr(val);
            ctx.visit_sttm(next);
        }
        SttmKind::Let(destrut, val, next) => {
            ctx.visit_destruct(destrut);
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
        SttmKind::RetExpr(expr) => {
            ctx.visit_expr(expr);
        }
    }
}

pub fn walk_expr<T: Visitor>(ctx: &mut T, expr: &mut Expr) {
    ctx.visit_range(&mut expr.range);
    match &mut expr.data {
        ExprKind::Var { name } => ctx.visit_ident(name),
        ExprKind::Constr { name, args } => {
            ctx.visit_qualified_ident(name);
            for arg in args {
                ctx.visit_binding(arg);
            }
        }
        ExprKind::Pair { fst, snd } => {
            ctx.visit_expr(fst);
            ctx.visit_expr(snd);
        }
        ExprKind::All {
            param: None,
            typ,
            body,
            ..
        } => {
            ctx.visit_expr(typ);
            ctx.visit_expr(body);
        }
        ExprKind::All {
            param: Some(ident),
            typ,
            body,
            ..
        } => {
            ctx.visit_ident(ident);
            ctx.visit_expr(typ);
            ctx.visit_expr(body);
        }
        ExprKind::Sigma {
            param: None,
            fst,
            snd,
        } => {
            ctx.visit_expr(fst);
            ctx.visit_expr(snd);
        }
        ExprKind::If { cond, then_, else_ } => {
            ctx.visit_expr(cond);
            ctx.visit_expr(then_);
            ctx.visit_expr(else_);
        }
        ExprKind::Sigma {
            param: Some(ident),
            fst,
            snd,
        } => {
            ctx.visit_ident(ident);
            ctx.visit_expr(fst);
            ctx.visit_expr(snd);
        }
        ExprKind::Do { typ, sttm } => {
            ctx.visit_qualified_ident(typ);
            ctx.visit_sttm(sttm)
        }
        ExprKind::Lambda {
            param, typ, body, ..
        } => {
            ctx.visit_ident(param);
            match typ {
                Some(x) => ctx.visit_expr(x),
                None => (),
            }
            ctx.visit_expr(body);
        }
        ExprKind::App { fun, args } => {
            ctx.visit_expr(fun);
            for arg in args {
                ctx.visit_app_binding(arg);
            }
        }
        ExprKind::List { args } => {
            for arg in args {
                ctx.visit_expr(arg);
            }
        }
        ExprKind::Let { name, val, next } => {
            ctx.visit_destruct(name);
            ctx.visit_expr(val);
            ctx.visit_expr(next);
        }
        ExprKind::Ann { val, typ } => {
            ctx.visit_expr(val);
            ctx.visit_expr(typ);
        }
        ExprKind::Lit { lit } => {
            ctx.visit_literal(expr.range, lit);
        }
        ExprKind::Binary { op: _, fst, snd } => {
            ctx.visit_expr(fst);
            ctx.visit_expr(snd);
        }
        ExprKind::Open { type_name, var_name, motive, next } => {
            ctx.visit_qualified_ident(type_name);
            ctx.visit_ident(var_name);
            ctx.visit_expr(next);
            if let Some(res) = motive {
                ctx.visit_expr(res);
            }
        },
        ExprKind::Hole => {}
        ExprKind::Subst(subst) => ctx.visit_substitution(subst),
        ExprKind::Match(matcher) => ctx.visit_match(matcher),
    }
}
