//! Collects all the unbound variables,
//! check if patterns are linear and check
//! if the name belongs to the current module.
//!
//! It also gets all of the identifiers used
//! by sugars because it's useful to name resolution
//! phase.

use std::sync::mpsc::Sender;

use fxhash::{FxHashMap, FxHashSet};
use kind_report::data::Diagnostic;
use kind_span::Range;

use kind_tree::concrete::expr::{Binding, CaseBinding, Destruct, Expr, ExprKind, SttmKind};
use kind_tree::concrete::pat::{Pat, PatIdent, PatKind};
use kind_tree::concrete::visitor::Visitor;
use kind_tree::concrete::{Argument, Book, Entry, Module, Rule, TopLevel};
use kind_tree::symbol::{Ident, QualifiedIdent};
use kind_tree::{visit_opt, visit_vec};

use crate::diagnostic::PassDiagnostic;

pub mod subst;

pub struct UnboundCollector {
    pub errors: Sender<Box<dyn Diagnostic>>,

    // Utils for keeping variables tracking and report duplicated ones.
    pub context_vars: Vec<(Range, String)>,

    // Keep track of top level definitions.
    pub top_level_defs: FxHashMap<String, Range>,
    pub unbound_top_level: FxHashMap<String, FxHashSet<QualifiedIdent>>,

    pub record_defs: FxHashMap<String, Vec<String>>,
    pub type_defs: FxHashMap<String, FxHashMap<String, Vec<String>>>,

    pub unbound: FxHashMap<String, Vec<Ident>>,
    pub emit_errs: bool,
}

impl UnboundCollector {
    pub fn new(
        diagnostic_sender: Sender<Box<dyn Diagnostic>>,
        emit_errs: bool,
    ) -> UnboundCollector {
        Self {
            errors: diagnostic_sender,
            context_vars: Default::default(),
            top_level_defs: Default::default(),
            unbound_top_level: Default::default(),
            unbound: Default::default(),
            record_defs: Default::default(),
            type_defs: Default::default(),
            emit_errs,
        }
    }
}

/// Collects all of the unbound variables in a module.
///
/// Invariant: All qualified ident should be expanded.
pub fn collect_module_info(
    diagnostic_sender: Sender<Box<dyn Diagnostic>>,
    module: &mut Module,
    emit_errs: bool,
) -> UnboundCollector {
    let mut state = UnboundCollector::new(diagnostic_sender.clone(), emit_errs);
    state.visit_module(module);

    for idents in state.unbound.values() {
        diagnostic_sender
            .send(Box::new(PassDiagnostic::UnboundVariable(
                idents.to_vec(),
                vec![],
            )))
            .unwrap();
    }

    state
}

/// Collects all of the unbound variables in a book.
///
/// Invariant: All qualified ident should be expanded.
pub fn get_book_unbound(
    diagnostic_sender: Sender<Box<dyn Diagnostic>>,
    book: &mut Book,
    emit_errs: bool,
) -> (
    FxHashMap<String, Vec<Ident>>,
    FxHashMap<String, FxHashSet<QualifiedIdent>>,
) {
    let mut state = UnboundCollector::new(diagnostic_sender, emit_errs);
    state.visit_book(book);
    (state.unbound, state.unbound_top_level)
}

impl UnboundCollector {
    fn visit_top_level_names(&mut self, toplevel: &mut TopLevel) {
        match toplevel {
            TopLevel::SumType(sum) => {
                debug_assert!(sum.name.get_aux().is_none());
                self.top_level_defs
                    .insert(sum.name.get_root(), sum.name.range);

                let res = sum.constructors.iter().map(|x| {
                    (
                        x.name.to_string(),
                        x.args.map(|x| x.name.to_string()).to_vec(),
                    )
                });
                self.type_defs.insert(sum.name.to_string(), res.collect());

                for cons in &sum.constructors {
                    let name_cons = sum.name.add_segment(cons.name.to_str());
                    debug_assert!(name_cons.get_aux().is_none());
                    self.top_level_defs
                        .insert(name_cons.get_root(), name_cons.range);
                }
            }
            TopLevel::RecordType(rec) => {
                let name_cons = rec.name.add_segment(rec.constructor.to_str());

                debug_assert!(rec.name.get_aux().is_none());
                debug_assert!(name_cons.get_aux().is_none());

                self.record_defs.insert(
                    rec.name.to_string(),
                    rec.fields.iter().map(|x| x.0.to_string()).collect(),
                );
                let constructor = rec.get_constructor();

                let cons = (
                    constructor.name.to_string(),
                    constructor.args.map(|x| x.name.to_string()).to_vec(),
                );
                self.type_defs
                    .insert(rec.name.to_string(), FxHashMap::from_iter([cons]));

                self.top_level_defs
                    .insert(rec.name.get_root(), rec.name.range);

                self.top_level_defs
                    .insert(name_cons.get_root(), name_cons.range);
            }
            TopLevel::Entry(entry) => {
                debug_assert!(entry.name.get_aux().is_none());
                self.top_level_defs
                    .insert(entry.name.get_root(), entry.name.range);
            }
        }
    }
}

impl Visitor for UnboundCollector {
    fn visit_attr(&mut self, _: &mut kind_tree::concrete::Attribute) {}

    fn visit_ident(&mut self, ident: &mut Ident) {
        let name = ident.to_str();
        if self.context_vars.iter().all(|x| x.1 != name) {
            let entry = self
                .unbound
                .entry(name.to_string())
                .or_insert_with(Vec::new);
            entry.push(ident.clone());
        }
    }

    fn visit_qualified_ident(&mut self, ident: &mut QualifiedIdent) {
        debug_assert!(ident.get_aux().is_none());
        if !self.top_level_defs.contains_key(&ident.get_root()) {
            let entry = self.unbound_top_level.entry(ident.get_root()).or_default();
            entry.insert(ident.clone());
        }
    }

    fn visit_pat_ident(&mut self, ident: &mut PatIdent) {
        let name = ident.0.to_str();
        if let Some(fst) = self.context_vars.iter().find(|x| x.1 == name) {
            if self.emit_errs {
                self.errors
                    .send(Box::new(PassDiagnostic::RepeatedVariable(
                        fst.0,
                        ident.0.range,
                    )))
                    .unwrap()
            }
        } else {
            self.context_vars.push((ident.0.range, name.to_string()))
        }
    }

    fn visit_argument(&mut self, argument: &mut Argument) {
        match &mut argument.typ {
            Some(res) => self.visit_expr(res),
            None => (),
        }

        let res = self
            .context_vars
            .iter()
            .find(|x| x.1 == argument.name.to_str());

        if let Some(fst) = res {
            if self.emit_errs {
                self.errors
                    .send(Box::new(PassDiagnostic::RepeatedVariable(
                        fst.0,
                        argument.name.range,
                    )))
                    .unwrap()
            }
        } else {
            self.context_vars
                .push((argument.name.range, argument.name.to_string()))
        }

        self.context_vars
            .push((argument.name.range, argument.name.to_string()));
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

        for arg in entry.args.iter_mut() {
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
                let mut repeated_names = FxHashMap::<String, Range>::default();
                let mut failed = false;

                for cons in &entr.constructors {
                    match repeated_names.get(&cons.name.to_string()) {
                        None => {
                            repeated_names.insert(cons.name.to_string(), cons.name.range);
                        },
                        Some(_) => {
                            failed = true;
                        }
                    }
                }

                if failed {
                    return;
                }

                let vars = self.context_vars.clone();

                visit_vec!(entr.parameters.iter_mut(), arg => self.visit_argument(arg));

                let inside_vars = self.context_vars.clone();

                visit_vec!(entr.indices.iter_mut(), arg => self.visit_argument(arg));

                visit_vec!(entr.constructors.iter_mut(), cons => {
                    self.context_vars = inside_vars.clone();
                    visit_vec!(cons.args.iter_mut(), arg => self.visit_argument(arg));
                    visit_opt!(&mut cons.typ, arg => self.visit_expr(arg));
                });

                self.context_vars = vars;
            }
            TopLevel::RecordType(entr) => {
                let inside_vars = self.context_vars.clone();
                visit_vec!(entr.parameters.iter_mut(), arg => self.visit_argument(arg));

                visit_vec!(entr.fields.iter_mut(), (name, _, typ) => {
                    self.visit_expr(typ);
                    self.context_vars.push((name.range, name.to_string()))
                });

                self.context_vars = inside_vars;
            }
            TopLevel::Entry(entr) => self.visit_entry(entr),
        }
    }

    fn visit_module(&mut self, book: &mut kind_tree::concrete::Module) {
        for entr in &mut book.entries {
            self.visit_top_level_names(entr);
        }
        for entr in &mut book.entries {
            self.visit_top_level(entr)
        }
    }

    fn visit_book(&mut self, book: &mut Book) {
        for entr in book.entries.values_mut() {
            self.visit_top_level_names(entr);
        }
        for entr in book.entries.values_mut() {
            self.visit_top_level(entr)
        }
    }

    fn visit_destruct(&mut self, destruct: &mut Destruct) {
        match destruct {
            Destruct::Destruct(range, ty, bindings, _) => {
                self.visit_qualified_ident(
                    &mut QualifiedIdent::add_segment(ty, "open").to_generated(),
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

    fn visit_case_binding(&mut self, case_binding: &mut CaseBinding) {
        match case_binding {
            CaseBinding::Field(ident) | CaseBinding::Renamed(_, ident) => {
                self.context_vars.push((ident.range, ident.to_string()))
            }
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
            PatKind::Str(_) => {
                let string = &mut QualifiedIdent::new_static("String", None, pat.range);
                self.visit_qualified_ident(&mut string.add_segment("cons").to_generated());
                self.visit_qualified_ident(&mut string.add_segment("nil").to_generated());
            }
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

    fn visit_match(&mut self, matcher: &mut kind_tree::concrete::expr::Match) {
        self.visit_qualified_ident(&mut matcher.typ);

        for name in &mut matcher.with_vars {
            self.visit_ident(&mut name.0);
            if let Some(res) = &mut name.1 {
                self.visit_expr(res)
            }
        }

        if let Some(opt) = &mut matcher.value {
            self.visit_expr(opt);
            self.context_vars
                .push((matcher.scrutinee.range, matcher.scrutinee.to_string()))
        } else {
            self.visit_ident(&mut matcher.scrutinee);
        }

        for case in &mut matcher.cases {
            let vars = self.context_vars.clone();
            let mut bound = FxHashSet::default();

            for binding in &mut case.bindings {
                match binding {
                    CaseBinding::Field(ident) | CaseBinding::Renamed(ident, _) => {
                        bound.insert(ident.to_string());
                    }
                }

                match binding {
                    CaseBinding::Field(ident) | CaseBinding::Renamed(_, ident) => {
                        self.context_vars.push((ident.range, ident.to_string()));
                    }
                }
            }

            let typ_meta = self.type_defs.get(matcher.typ.to_str());

            if let Some(fields) = typ_meta.and_then(|x| x.get(case.constructor.to_str())) {
                for field in fields {
                    if !bound.contains(field) {
                        let ident = format!("{}.{}", matcher.scrutinee.to_str(), field);
                        self.context_vars.push((case.constructor.range, ident));
                    }
                }
            }

            self.visit_expr(&mut case.value);
            self.context_vars = vars;
        }

        match &mut matcher.motive {
            Some(x) => self.visit_expr(x),
            None => (),
        }

        if matcher.value.is_some() {
            self.context_vars.pop();
        }
    }

    fn visit_binding(&mut self, binding: &mut Binding) {
        match binding {
            Binding::Positional(e) => self.visit_expr(e),
            Binding::Named(_, _, e) => self.visit_expr(e),
        }
    }

    fn visit_literal(&mut self, range: Range, lit: &mut kind_tree::concrete::Literal) {
        use kind_tree::concrete::Literal::*;

        match lit {
            String(_) => {
                let string = &mut QualifiedIdent::new_static("String", None, range);
                self.visit_qualified_ident(&mut string.add_segment("cons").to_generated());
                self.visit_qualified_ident(&mut string.add_segment("nil").to_generated());
            }
            _ => (),
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
                self.visit_qualified_ident(
                    &mut QualifiedIdent::new_static("Sigma", None, expr.range).to_generated(),
                );
                self.visit_expr(fst);
                self.visit_expr(snd);
            }
            ExprKind::Sigma {
                param: Some(ident),
                fst,
                snd,
            } => {
                self.visit_qualified_ident(
                    &mut QualifiedIdent::new_static("Sigma", None, expr.range).to_generated(),
                );
                self.visit_expr(fst);
                self.context_vars.push((ident.range, ident.to_string()));
                self.visit_expr(snd);
                self.context_vars.pop();
            }
            ExprKind::Match(matcher) => {
                self.visit_qualified_ident(&mut matcher.typ.add_segment("match").to_generated());
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
                let typ = QualifiedIdent::new_static("Bool", None, expr.range);
                self.visit_qualified_ident(&mut typ.add_segment("if").to_generated());
                self.visit_expr(cond);
                self.visit_expr(then_);
                self.visit_expr(else_);
            }
            ExprKind::Pair { fst, snd } => {
                let typ = QualifiedIdent::new_static("Pair", None, expr.range);
                self.visit_qualified_ident(&mut typ.add_segment("new").to_generated());
                self.visit_expr(fst);
                self.visit_expr(snd);
            }
            ExprKind::List { args } => {
                let mut typ = QualifiedIdent::new_static("List", None, expr.range);

                self.visit_qualified_ident(&mut typ);
                self.visit_qualified_ident(&mut typ.add_segment("nil").to_generated());
                self.visit_qualified_ident(&mut typ.add_segment("cons").to_generated());

                visit_vec!(args.iter_mut(), arg => self.visit_expr(arg));
            }
            ExprKind::Open {
                type_name,
                var_name,
                motive,
                next,
            } => {
                self.visit_qualified_ident(type_name);

                if let Some(motive) = motive {
                    self.visit_expr(motive)
                }

                if let Some(fields) = self.record_defs.get(type_name.to_str()) {
                    for field in fields {
                        self.context_vars
                            .push((var_name.range, format!("{}.{}", var_name, field)))
                    }
                }

                self.visit_expr(next);

                if let Some(fields) = self.record_defs.get(type_name.to_str()) {
                    for _ in fields {
                        self.context_vars.pop();
                    }
                }
            }
        }
    }
}
