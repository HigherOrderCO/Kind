//! Collects all the unbound variables and
//! check if patterns are linear.
//!
//! It also gets all of the identifiers used
//! by sugars because it's useful to name resolution
//! phase.

use std::sync::mpsc::Sender;

use fxhash::FxHashMap;
use kind_report::data::DiagnosticFrame;
use kind_tree::concrete::expr::{Binding, Case, CaseBinding, Destruct};
use kind_tree::concrete::pat::PatIdent;
use kind_tree::concrete::{Module, Book, TopLevel};
use kind_tree::symbol::Ident;

use kind_tree::concrete::{
    expr::{Expr, ExprKind, SttmKind},
    pat::{Pat, PatKind},
    visitor::Visitor,
    Argument, Entry, Rule,
};
use kind_tree::{visit_opt, visit_vec};

use crate::errors::PassError;

pub struct UnboundCollector {
    pub errors: Sender<DiagnosticFrame>,
    pub context_vars: Vec<Ident>,
    pub unbound: FxHashMap<String, Vec<Ident>>,
}

impl UnboundCollector {
    pub fn new(diagnostic_sender: Sender<DiagnosticFrame>) -> UnboundCollector {
        Self {
            errors: diagnostic_sender,
            context_vars: Default::default(),
            unbound: Default::default(),
        }
    }
}

pub fn get_glossary_unbound(
    diagnostic_sender: Sender<DiagnosticFrame>,
    glossary: &mut Book,
) -> FxHashMap<String, Vec<Ident>> {
    let mut state = UnboundCollector::new(diagnostic_sender);
    state.visit_glossary(glossary);
    state.unbound
}

pub fn get_book_unbound(
    diagnostic_sender: Sender<DiagnosticFrame>,
    glossary: &mut Module,
) -> FxHashMap<String, Vec<Ident>> {
    let mut state = UnboundCollector::new(diagnostic_sender);
    state.visit_book(glossary);
    state.unbound
}

impl Visitor for UnboundCollector {
    fn visit_attr(&mut self, _: &mut kind_tree::concrete::Attribute) {}

    fn visit_ident(&mut self, ident: &mut Ident) {
        if self.context_vars.iter().all(|x| x.data != ident.data) && !ident.used_by_sugar {
            let entry = self.unbound.entry(ident.data.0.clone()).or_default();
            entry.push(ident.clone());
        }
    }

    fn visit_pat_ident(&mut self, ident: &mut PatIdent) {
        if let Some(fst) = self.context_vars.iter().find(|x| x.data == ident.0.data) {
            self.errors
                .send(PassError::RepeatedVariable(fst.range, ident.0.range).into())
                .unwrap()
        } else {
            self.context_vars.push(ident.0.clone())
        }
    }

    fn visit_argument(&mut self, argument: &mut Argument) {
        match &mut argument.typ {
            Some(res) => self.visit_expr(res),
            None => (),
        }
        self.context_vars.push(argument.name.clone());
    }

    fn visit_rule(&mut self, rule: &mut Rule) {
        let vars = self.context_vars.clone();
        for pat in &mut rule.pats {
            self.visit_pat(pat);
        }
        self.visit_expr(&mut rule.body);
        self.context_vars = vars;
    }

    fn visit_entry(&mut self, entry: &mut Entry) {
        let vars = self.context_vars.clone();

        for arg in &mut entry.args.0 {
            self.visit_argument(arg)
        }

        self.visit_expr(&mut entry.typ);
        self.context_vars = vars;

        for rule in &mut entry.rules {
            self.visit_rule(rule)
        }
    }

    fn visit_top_level(&mut self, toplevel: &mut TopLevel) {
        match toplevel {
            TopLevel::SumType(entr) => {
                self.context_vars.push(entr.name.clone());
                for cons in &entr.constructors {
                    let mut name_cons = cons.name.clone();
                    name_cons.data.0 = format!("{}.{}", name_cons.data.0, cons.name.data.0);
                    self.context_vars.push(name_cons);
                }

                let vars = self.context_vars.clone();

                visit_vec!(&mut entr.parameters.0, arg => self.visit_argument(arg));

                let inside_vars = self.context_vars.clone();

                visit_vec!(&mut entr.indices.0, arg => self.visit_argument(arg));

                visit_vec!(&mut entr.constructors, cons => {
                    self.context_vars = inside_vars.clone();
                    visit_vec!(&mut cons.args.0, arg => self.visit_argument(arg));
                    visit_opt!(&mut cons.typ, arg => self.visit_expr(arg));
                });

                self.context_vars = vars;
            }
            TopLevel::RecordType(entr) => {
                self.context_vars.push(entr.name.clone());

                let mut name_cons = entr.name.clone();
                name_cons.data.0 = format!("{}.{}", name_cons.data.0, entr.constructor.data.0);
                self.context_vars.push(name_cons);

                let inside_vars = self.context_vars.clone();

                visit_vec!(&mut entr.parameters.0, arg => self.visit_argument(arg));
                visit_vec!(&mut entr.fields, (_, _, typ) => {
                    self.visit_expr(typ);
                });

                self.context_vars = inside_vars;
            }
            TopLevel::Entry(entr) => {
                self.context_vars.push(entr.name.clone());
                self.visit_entry(entr)
            }
        }
    }

    fn visit_book(&mut self, book: &mut kind_tree::concrete::Module) {
        for entr in &mut book.entries {
            self.visit_top_level(entr)
        }
    }

    fn visit_glossary(&mut self, glossary: &mut Book) {
        self.context_vars = glossary.names.values().cloned().collect();
        for entr in glossary.entries.values_mut() {
            self.visit_top_level(entr)
        }
    }

    fn visit_destruct(&mut self, destruct: &mut Destruct) {
        match destruct {
            Destruct::Destruct(range, ty, bindings, _) => {
                self.visit_ident(&mut Ident::new_by_sugar(&format!("{}.open", ty), *range));
                self.visit_range(range);
                self.visit_ident(ty);
                for bind in bindings {
                    self.visit_case_binding(bind)
                }
            }
            Destruct::Ident(ident) => self.context_vars.push(ident.clone()),
        }
    }

    fn visit_sttm(&mut self, sttm: &mut kind_tree::concrete::expr::Sttm) {
        match &mut sttm.data {
            SttmKind::Ask(ident, val, next) => {
                self.visit_expr(val);
                let vars = self.context_vars.clone();
                self.visit_destruct(ident);
                self.context_vars = vars;
                self.visit_sttm(next);
            }
            SttmKind::Let(ident, val, next) => {
                self.visit_expr(val);
                let vars = self.context_vars.clone();
                self.visit_destruct(ident);
                self.context_vars = vars;
                self.visit_sttm(next);
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
                self.visit_ident(t);
                for pat in ls {
                    self.visit_pat(pat)
                }
            }
        }
    }

    fn visit_case_binding(&mut self, case_binding: &mut CaseBinding) {
        match case_binding {
            CaseBinding::Field(pat) => self.visit_pat_ident(pat),
            CaseBinding::Renamed(_, pat) => self.visit_pat_ident(pat),
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
        self.visit_expr(&mut matcher.scrutinizer);
        for case in &mut matcher.cases {
            // TODO: Better error for not found constructors like this one.
            // let mut name = case.constructor.clone();
            // name.data.0 = format!("{}.{}", matcher.typ.data.0.clone(), name.data.0);
            // self.visit_ident(&mut name);

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
            ExprKind::Var(ident) => self.visit_ident(ident),
            ExprKind::Constr(ident) => {
                if !self.context_vars.iter().any(|x| x.data == ident.data) {
                    let entry = self.unbound.entry(ident.data.0.clone()).or_default();
                    entry.push(ident.clone());
                }
            }
            ExprKind::All(None, typ, body) => {
                self.visit_expr(typ);
                self.visit_expr(body);
            }
            ExprKind::All(Some(ident), typ, body) => {
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
            ExprKind::App(head, spine) => {
                self.visit_expr(head);
                visit_vec!(spine.iter_mut(), arg => self.visit_binding(arg));
            }
            ExprKind::Ann(val, ty) => {
                self.visit_expr(val);
                self.visit_expr(ty);
            }
            ExprKind::Lit(lit) => self.visit_literal(lit),
            ExprKind::Binary(_, l, r) => {
                self.visit_expr(l);
                self.visit_expr(r);
            }
            ExprKind::Let(ident, val, body) => {
                self.visit_expr(val);
                let vars = self.context_vars.clone();
                self.visit_destruct(ident);
                self.visit_expr(body);
                self.context_vars = vars;
            }
            ExprKind::Sigma(None, typ, body) => {
                self.visit_ident(&mut Ident::new_by_sugar("Sigma", expr.range));
                self.visit_expr(typ);
                self.visit_expr(body);
            }
            ExprKind::Sigma(Some(ident), typ, body) => {
                self.visit_ident(&mut Ident::new_by_sugar("Sigma", expr.range));
                self.visit_expr(typ);
                self.context_vars.push(ident.clone());
                self.visit_expr(body);
                self.context_vars.pop();
            }
            ExprKind::Match(matcher) => {
                self.visit_ident(&mut Ident::new_by_sugar(
                    &format!("{}.match", matcher.typ.to_str()),
                    expr.range,
                ));
                self.visit_match(matcher)
            }
            ExprKind::Subst(subst) => {
                self.visit_ident(&mut subst.name);

                if let Some(pos) = self
                    .context_vars
                    .iter()
                    .position(|x| x.to_str() == subst.name.to_str())
                {
                    subst.indx = pos;
                }

                self.visit_expr(&mut subst.expr)
            }
            ExprKind::Hole => {}
            ExprKind::Do(typ, sttm) => {
                self.visit_ident(&mut Ident::new_by_sugar(
                    &format!("{}.pure", typ),
                    expr.range,
                ));
                self.visit_ident(&mut Ident::new_by_sugar(
                    &format!("{}.bind", typ),
                    expr.range,
                ));
                self.visit_sttm(sttm)
            }
            ExprKind::If(cond, if_, else_) => {
                self.visit_ident(&mut Ident::new_by_sugar("Bool.if", expr.range));
                self.visit_expr(cond);
                self.visit_expr(if_);
                self.visit_expr(else_);
            }
            ExprKind::Pair(l, r) => {
                self.visit_ident(&mut Ident::new_by_sugar("Pair.new", expr.range));
                self.visit_expr(l);
                self.visit_expr(r);
            }
            ExprKind::List(spine) => {
                self.visit_ident(&mut Ident::new_by_sugar("List.nil", expr.range));
                self.visit_ident(&mut Ident::new_by_sugar("List.cons", expr.range));
                visit_vec!(spine.iter_mut(), arg => self.visit_expr(arg));
            }
        }
    }
}
