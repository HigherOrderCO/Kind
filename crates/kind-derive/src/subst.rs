use fxhash::FxHashMap;

use kind_span::Range;

use kind_tree::concrete::expr::{Binding, Case, CaseBinding, Destruct, Expr, ExprKind, SttmKind};
use kind_tree::concrete::pat::{Pat, PatIdent, PatKind};
use kind_tree::concrete::visitor::Visitor;
use kind_tree::symbol::{Ident, QualifiedIdent, Symbol};
use kind_tree::visit_vec;

pub struct Subst<'a> {
    pub context_vars: Vec<(Range, String)>,
    pub names: &'a FxHashMap<String, String>,
}

impl<'a> Visitor for Subst<'a> {
    fn visit_attr(&mut self, _: &mut kind_tree::concrete::Attribute) {}

    fn visit_ident(&mut self, ident: &mut Ident) {
        let name = ident.to_str();
        if self.context_vars.iter().all(|x| x.1 != name) {
            if let Some(res) = self.names.get(name) {
                ident.data = Symbol::new(res.clone())
            }
        }
    }

    fn visit_pat_ident(&mut self, ident: &mut PatIdent) {
        self.visit_ident(&mut ident.0)
    }

    fn visit_destruct(&mut self, destruct: &mut Destruct) {
        match destruct {
            Destruct::Destruct(range, ty, bindings, _) => {
                self.visit_qualified_ident(
                    &mut QualifiedIdent::add_segment(ty, "match").to_generated(),
                );
                self.visit_range(range);
                self.visit_qualified_ident(ty);
                for bind in bindings {
                    self.visit_case_binding(bind)
                }
            }
            Destruct::Ident(ident) => self.context_vars.push((ident.range, ident.to_string())),
        }
    }

    fn visit_sttm(&mut self, sttm: &mut kind_tree::concrete::expr::Sttm) {
        match &mut sttm.data {
            SttmKind::Ask(ident, val, next) => {
                self.visit_expr(val);
                let vars = self.context_vars.clone();
                self.visit_destruct(ident);
                self.visit_sttm(next);
                self.context_vars = vars;
            }
            SttmKind::Let(ident, val, next) => {
                self.visit_expr(val);
                let vars = self.context_vars.clone();
                self.visit_destruct(ident);
                self.visit_sttm(next);
                self.context_vars = vars;
            }
            SttmKind::Expr(expr, next) => {
                self.visit_expr(expr);
                self.visit_sttm(next);
            }
            SttmKind::Return(expr) => {
                self.visit_expr(expr);
            }
            SttmKind::RetExpr(expr) => {
                self.visit_expr(expr);
            }
        }
    }

    fn visit_pat(&mut self, pat: &mut Pat) {
        match &mut pat.data {
            PatKind::Var(ident) => self.visit_pat_ident(ident),
            PatKind::Str(_) => (),
            PatKind::U60(_) => (),
            PatKind::U120(_) => (),
            PatKind::F60(_) => (),
            PatKind::Char(_) => (),
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
                self.visit_qualified_ident(t);
                for pat in ls {
                    self.visit_pat(pat)
                }
            }
        }
    }

    fn visit_case_binding(&mut self, case_binding: &mut CaseBinding) {
        match case_binding {
            CaseBinding::Field(ident) | CaseBinding::Renamed(_, ident) => {
                self.context_vars.push((ident.range, ident.to_string()))
            }
        }
    }

    fn visit_case(&mut self, case: &mut Case) {
        let vars = self.context_vars.clone();
        for binding in &mut case.bindings {
            self.visit_case_binding(binding);
        }
        self.visit_expr(&mut case.value);
        self.context_vars = vars;
    }

    fn visit_match(&mut self, matcher: &mut kind_tree::concrete::expr::Match) {
        self.visit_ident(&mut matcher.scrutinee);

        if let Some(res) = &mut matcher.value {
            self.visit_expr(res);
        }

        for (name, expr) in &mut matcher.with_vars {
            self.visit_ident(name);
            self.context_vars.push((name.range, name.to_string()));
            if let Some(expr) = expr {
                self.visit_expr(expr);
            }
            self.context_vars.pop();
        }

        for case in &mut matcher.cases {
            self.visit_case(case);
        }
        match &mut matcher.motive {
            Some(x) => self.visit_expr(x),
            None => (),
        }
    }

    fn visit_binding(&mut self, binding: &mut Binding) {
        match binding {
            Binding::Positional(e) => self.visit_expr(e),
            Binding::Named(_, _, e) => self.visit_expr(e),
        }
    }

    fn visit_expr(&mut self, expr: &mut Expr) {
        match &mut expr.data {
            ExprKind::Var { name } => self.visit_ident(name),
            ExprKind::Constr { name, args } => {
                self.visit_qualified_ident(name);
                visit_vec!(args.iter_mut(), arg => self.visit_binding(arg));
            }
            ExprKind::All {
                param: None,
                typ,
                body,
                ..
            } => {
                self.visit_expr(typ);
                self.visit_expr(body);
            }
            ExprKind::All {
                param: Some(ident),
                typ,
                body,
                ..
            } => {
                self.visit_expr(typ);
                self.context_vars.push((ident.range, ident.to_string()));
                self.visit_expr(body);
                self.context_vars.pop();
            }
            ExprKind::Lambda {
                param, typ, body, ..
            } => {
                match typ {
                    Some(x) => self.visit_expr(x),
                    None => (),
                }
                self.context_vars.push((param.range, param.to_string()));
                self.visit_expr(body);
                self.context_vars.pop();
            }
            ExprKind::App { fun, args } => {
                self.visit_expr(fun);
                visit_vec!(args.iter_mut(), arg => self.visit_expr(&mut arg.data));
            }
            ExprKind::Ann { val, typ } => {
                self.visit_expr(val);
                self.visit_expr(typ);
            }
            ExprKind::Lit { lit } => self.visit_literal(expr.range, lit),
            ExprKind::Binary { op: _, fst, snd } => {
                self.visit_expr(fst);
                self.visit_expr(snd);
            }
            ExprKind::Let { name, val, next } => {
                self.visit_expr(val);
                let vars = self.context_vars.clone();
                self.visit_destruct(name);
                self.visit_expr(next);
                self.context_vars = vars;
            }
            ExprKind::Sigma {
                param: None,
                fst,
                snd,
            } => {
                self.visit_qualified_ident(&mut QualifiedIdent::new_static(
                    "Sigma", None, expr.range,
                ));
                self.visit_expr(fst);
                self.visit_expr(snd);
            }
            ExprKind::Sigma {
                param: Some(ident),
                fst,
                snd,
            } => {
                self.visit_qualified_ident(&mut QualifiedIdent::new_static(
                    "Sigma", None, expr.range,
                ));
                self.visit_expr(fst);
                self.context_vars.push((ident.range, ident.to_string()));
                self.visit_expr(snd);
                self.context_vars.pop();
            }
            ExprKind::Match(matcher) => {
                self.visit_qualified_ident(&mut matcher.typ.add_segment("match"));
                self.visit_match(matcher)
            }
            ExprKind::Subst(subst) => {
                self.visit_ident(&mut subst.name);

                if let Some(pos) = self
                    .context_vars
                    .iter()
                    .position(|x| x.1 == subst.name.to_string())
                {
                    subst.indx = pos;
                }

                self.visit_expr(&mut subst.expr)
            }
            ExprKind::Hole => {}
            ExprKind::Do { typ, sttm } => {
                self.visit_qualified_ident(&mut typ.add_segment("pure").to_generated());
                self.visit_qualified_ident(&mut typ.add_segment("bind").to_generated());
                self.visit_sttm(sttm)
            }
            ExprKind::If { cond, then_, else_ } => {
                self.visit_qualified_ident(&mut QualifiedIdent::new_sugared(
                    "Bool", "if", expr.range,
                ));
                self.visit_expr(cond);
                self.visit_expr(then_);
                self.visit_expr(else_);
            }
            ExprKind::Pair { fst, snd } => {
                self.visit_qualified_ident(&mut QualifiedIdent::new_sugared(
                    "Pair", "new", expr.range,
                ));
                self.visit_expr(fst);
                self.visit_expr(snd);
            }
            ExprKind::List { args } => {
                self.visit_qualified_ident(&mut QualifiedIdent::new_sugared(
                    "List", "nil", expr.range,
                ));
                self.visit_qualified_ident(&mut QualifiedIdent::new_sugared(
                    "List", "cons", expr.range,
                ));
                visit_vec!(args.iter_mut(), arg => self.visit_expr(arg));
            }
            ExprKind::Open {
                type_name,
                var_name,
                motive,
                next,
            } => {
                self.visit_qualified_ident(type_name);
                self.visit_ident(var_name);
                self.visit_expr(next);

                if let Some(motive) = motive {
                    self.visit_expr(motive);
                }
            }
        }
    }
}

pub fn substitute_in_expr(expr: &mut Expr, names: &FxHashMap<String, String>) {
    let mut session = Subst {
        context_vars: Default::default(),
        names,
    };
    session.visit_expr(expr)
}
