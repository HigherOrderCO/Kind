use std::sync::mpsc::Sender;

use fxhash::{FxHashMap, FxHashSet};
use kind_report::data::Diagnostic;
use kind_span::Range;

use kind_tree::desugared;
use kind_tree::symbol::QualifiedIdent;
use kind_tree::untyped::{self};
use kind_tree::Number;

use crate::errors::PassError;

#[derive(Copy, Clone, PartialEq, Eq, Hash, Debug)]
enum Relevance {
    Relevant,
    Irrelevant,
}

#[derive(Copy, Clone, PartialEq, Eq, Hash, Debug)]
enum Ambient {
    Unknown,
    Irrelevant,
    Relevant,
}

impl Ambient {
    pub fn as_relevance(&self) -> Relevance {
        match self {
            Ambient::Irrelevant => Relevance::Irrelevant,
            Ambient::Unknown | Ambient::Relevant => Relevance::Relevant,
        }
    }
}

pub struct Edge {
    name: String,
    relevance: FxHashMap<Relevance, Vec<Range>>,
    connections: FxHashMap<usize, Vec<(Range, Ambient)>>,
}

pub struct ErasureState<'a> {
    errs: Sender<Box<dyn Diagnostic>>,
    book: &'a desugared::Book,

    edges: Vec<Edge>,
    names: FxHashMap<String, (Range, usize)>,

    ctx: im_rc::HashMap<String, Relevance>,

    failed: bool,
}

pub fn erase_book(
    book: &desugared::Book,
    errs: Sender<Box<dyn Diagnostic>>,
    entrypoints: Vec<String>,
) -> Result<untyped::Book, ()> {
    let mut state = ErasureState {
        errs,
        book,
        edges: Default::default(),
        names: Default::default(),
        ctx: Default::default(),
        failed: Default::default(),
    };

    state.erase_book(book, entrypoints)
}

impl<'a> ErasureState<'a> {
    fn get_edge_or_create(&mut self, name: &QualifiedIdent) -> usize {
        if let Some(id) = self.names.get(&name.to_string()) {
            id.1
        } else {
            let id = self.edges.len();
            self.names.insert(name.to_string(), (name.range, id));
            self.edges.push(Edge {
                name: name.to_string(),
                relevance: Default::default(),
                connections: Default::default(),
            });
            id
        }
    }

    fn set_relevance(&mut self, id: usize, relevance: Relevance, on: Range) {
        let edge = self.edges.get_mut(id).unwrap();
        let entry = edge.relevance.entry(relevance).or_default();
        entry.push(on)
    }

    fn connect_with(&mut self, id: usize, name: &QualifiedIdent, ambient: Ambient) {
        let new_id = self.get_edge_or_create(name);
        let entry = self.edges[id].connections.entry(new_id).or_default();
        entry.push((name.range, ambient))
    }

    pub fn erase_book(
        &mut self,
        book: &'a desugared::Book,
        named_entrypoints: Vec<String>,
    ) -> Result<untyped::Book, ()> {
        let mut vals = FxHashMap::default();

        let mut entrypoints = Vec::new();

        for name in named_entrypoints {
            if let Some(entr) = book.entrs.get(&name) {
                let id = self.get_edge_or_create(&entr.name);
                self.set_relevance(id, Relevance::Relevant, entr.name.range);
                entrypoints.push(id);
            }
        }

        // Kdl specific things.
        for entr in book.entrs.values() {
            if let Some(name) = &entr.attrs.kdl_state {
                if book.entrs.contains_key(name.to_str()) {
                    let id = self.get_edge_or_create(&name.to_qualified_ident());
                    self.set_relevance(id, Relevance::Relevant, name.range);
                    entrypoints.push(id);
                }
            }

            if entr.attrs.kdl_run || entr.attrs.keep {
                let id = self.get_edge_or_create(&entr.name);
                self.set_relevance(id, Relevance::Relevant, entr.name.range);
                entrypoints.push(id);
            }
        }

        for entr in book.entrs.values() {
            vals.insert(entr.name.to_string(), self.erase_entry(entr));
        }

        let mut visited = FxHashSet::<usize>::default();

        let mut new_book = untyped::Book {
            entrs: Default::default(),
            names: Default::default(),
        };

        let mut queue = entrypoints
            .iter()
            .map(|x| (x, Ambient::Relevant))
            .collect::<Vec<_>>();

        while !queue.is_empty() {
            let (fst, relev) = queue.pop().unwrap();

            if visited.contains(fst) {
                continue;
            }

            visited.insert(*fst);

            let edge = &self.edges[*fst];

            if relev != Ambient::Irrelevant {
                if let Some(res) = edge.relevance.get(&Relevance::Irrelevant) {
                    self.errs
                        .send(Box::new(PassError::CannotUseIrrelevant(None, res[0], None)))
                        .unwrap();
                }
            }

            let entry = vals.remove(&edge.name).unwrap();

            new_book
                .names
                .insert(entry.name.to_str().to_string(), new_book.entrs.len());

            new_book
                .entrs
                .insert(entry.name.to_str().to_string(), entry);

            for (to, relevs) in &edge.connections {
                for (_, relev) in relevs.iter() {
                    match relev {
                        Ambient::Irrelevant => (),
                        Ambient::Unknown | Ambient::Relevant => {
                            if !visited.contains(to) {
                                queue.push((to, *relev));
                            }
                        }
                    }
                }
            }
        }

        if self.failed {
            Err(())
        } else {
            Ok(new_book)
        }
    }

    fn erase_entry(&mut self, entry: &'a desugared::Entry) -> Box<untyped::Entry> {
        let id = self.get_edge_or_create(&entry.name);

        let mut args = Vec::new();

        let backup = self.ctx.clone();

        for arg in &entry.args {
            self.erase_expr(Ambient::Irrelevant, id, &arg.typ);
            self.ctx.insert(arg.name.to_string(), Relevance::Irrelevant);
            if !arg.erased {
                args.push((arg.name.to_string(), arg.range, false))
            }
        }

        self.erase_expr(Ambient::Irrelevant, id, &entry.typ);

        self.ctx = backup;

        let mut rules = Vec::new();

        for rule in &entry.rules {
            rules.push(self.erase_rule(entry, id, rule));
        }

        Box::new(untyped::Entry {
            name: entry.name.clone(),
            args,
            rules,
            attrs: entry.attrs.clone(),
            range: entry.range,
        })
    }

    fn erase_rule(
        &mut self,
        entr: &desugared::Entry,
        edge: usize,
        rule: &'a desugared::Rule,
    ) -> untyped::Rule {
        let backup = self.ctx.clone();

        let has_relevance = self.edges[edge]
            .relevance
            .contains_key(&Relevance::Relevant);

        let relev = |hidden: bool| -> Ambient {
            if hidden {
                Ambient::Irrelevant
            } else if has_relevance {
                Ambient::Relevant
            } else {
                Ambient::Unknown
            }
        };

        let pats = rule
            .pats
            .iter()
            .zip(&entr.args)
            .map(|(pat, arg)| (self.erase_pat(relev(arg.erased), edge, pat), arg))
            .filter(|(_, arg)| !arg.erased)
            .map(|res| res.0)
            .collect::<Vec<_>>();

        let body = self.erase_expr(relev(false), edge, &rule.body);

        self.ctx = backup;

        untyped::Rule {
            name: entr.name.clone(),
            pats,
            body,
            range: rule.range,
        }
    }

    fn erase_pat(
        &mut self,
        relevance: Ambient,
        edge: usize,
        expr: &'a desugared::Expr,
    ) -> Box<untyped::Expr> {
        let relev = |hidden: bool| -> Ambient {
            if hidden {
                Ambient::Irrelevant
            } else {
                relevance
            }
        };

        use desugared::ExprKind::*;

        match &expr.data {
            Var { name } => {
                self.ctx.insert(
                    name.to_string(),
                    if relevance == Ambient::Irrelevant {
                        Relevance::Irrelevant
                    } else {
                        Relevance::Relevant
                    },
                );

                untyped::Expr::var(name.clone())
            }
            Hole { num: _ } => untyped::Expr::err(expr.range),
            Fun { name, args } => {
                self.connect_with(edge, name, relevance);

                // We cannot pattern match on functions in a relevant function.
                // it would change its behaviour.
                if relevance == Ambient::Irrelevant {
                    self.set_relevance(edge, Relevance::Irrelevant, expr.range)
                }

                let params = self.book.entrs.get(name.to_str()).unwrap();

                let args = args
                    .iter()
                    .zip(&params.args)
                    .map(|(arg, param)| (self.erase_pat(relev(param.erased), edge, arg), param))
                    .filter(|(_, param)| !param.erased)
                    .map(|x| x.0)
                    .collect::<Vec<_>>();

                untyped::Expr::fun(expr.range, name.clone(), args)
            }
            Ctr { name, args } => {
                self.connect_with(edge, name, relevance);

                // We cannot pattenr match on functions in a relevant function.
                // it would change its behaviour.
                if relevance == Ambient::Irrelevant {
                    self.set_relevance(edge, Relevance::Irrelevant, expr.range)
                }

                let params = self.book.entrs.get(name.to_str()).unwrap();

                let args = args
                    .iter()
                    .zip(&params.args)
                    .map(|(arg, param)| (self.erase_pat(relev(param.erased), edge, arg), param))
                    .filter(|(_, param)| !param.erased)
                    .map(|x| x.0)
                    .collect::<Vec<_>>();

                untyped::Expr::ctr(expr.range, name.clone(), args)
            }
            Num {
                num: Number::U60(num),
            } => untyped::Expr::num60(expr.range, *num),
            Num {
                num: Number::U120(num),
            } => untyped::Expr::num120(expr.range, *num),
            Str { val } => {
                let nil = QualifiedIdent::new_static("String.nil", None, expr.range);
                let cons = QualifiedIdent::new_static("String.cons", None, expr.range);

                self.connect_with(edge, &nil, relevance);
                self.connect_with(edge, &cons, relevance);

                untyped::Expr::str(expr.range, val.clone())
            }
            _ => todo!("Cannot be parsed {}", expr),
        }
    }

    fn erase_expr(
        &mut self,
        ambient: Ambient,
        edge: usize,
        expr: &'a desugared::Expr,
    ) -> Box<untyped::Expr> {
        use desugared::ExprKind::*;
        match &expr.data {
            All {
                param,
                typ,
                body,
                erased: _,
            } => {
                let backup = self.ctx.clone();
                self.ctx.insert(param.to_string(), Relevance::Irrelevant);

                if ambient != Ambient::Irrelevant {
                    self.set_relevance(edge, Relevance::Irrelevant, expr.range);
                }

                self.erase_expr(Ambient::Irrelevant, edge, typ);
                self.erase_expr(Ambient::Irrelevant, edge, body);

                self.ctx = backup;

                untyped::Expr::err(expr.range)
            }
            Lambda {
                param,
                body,
                erased,
            } => {
                let backup = self.ctx.clone();

                let relev = if ambient == Ambient::Irrelevant || *erased {
                    Relevance::Irrelevant
                } else {
                    Relevance::Relevant
                };

                self.ctx.insert(param.to_string(), relev);

                let body = self.erase_expr(ambient, edge, body);

                self.ctx = backup;

                untyped::Expr::lambda(expr.range, param.clone(), body, *erased)
            }
            Let { name, val, next } => {
                let backup = self.ctx.clone();

                self.ctx.insert(name.to_string(), ambient.as_relevance());

                let val = self.erase_expr(ambient, edge, val);
                let next = self.erase_expr(ambient, edge, next);

                self.ctx = backup;

                untyped::Expr::let_(expr.range, name.clone(), val, next)
            }
            Fun { name, args } => {
                self.connect_with(edge, name, ambient);

                let params = &self.book.entrs.get(name.to_str()).unwrap().args;

                let relev = |hidden| {
                    if hidden {
                        Ambient::Irrelevant
                    } else {
                        ambient
                    }
                };

                let args = params
                    .iter()
                    .zip(args)
                    .map(|(param, arg)| (param, self.erase_expr(relev(param.erased), edge, arg)))
                    .filter(|(param, _)| !param.erased)
                    .map(|res| res.1)
                    .collect::<Vec<_>>();

                untyped::Expr::fun(expr.range, name.clone(), args)
            }
            Ctr { name, args } => {
                self.connect_with(edge, name, ambient);

                let params = &self.book.entrs.get(name.to_str()).unwrap().args;

                let relev = |hidden| {
                    if hidden {
                        Ambient::Irrelevant
                    } else {
                        ambient
                    }
                };

                let args = params
                    .iter()
                    .zip(args)
                    .map(|(param, arg)| (param, self.erase_expr(relev(param.erased), edge, arg)))
                    .filter(|(param, _)| !param.erased)
                    .map(|res| res.1)
                    .collect::<Vec<_>>();

                untyped::Expr::ctr(expr.range, name.clone(), args)
            }
            Var { name } => {
                let var_rev = self
                    .ctx
                    .get(&name.to_string())
                    .unwrap();

                if *var_rev == Relevance::Irrelevant && ambient != Ambient::Irrelevant {
                    self.set_relevance(edge, Relevance::Irrelevant, name.range)
                }

                untyped::Expr::var(name.clone())
            }
            Ann { expr, typ } => {
                let expr = self.erase_expr(ambient, edge, expr);
                self.erase_expr(Ambient::Irrelevant, edge, typ);
                expr
            }
            Num {
                num: Number::U60(num),
            } => untyped::Expr::num60(expr.range, *num),
            Num {
                num: Number::U120(num),
            } => untyped::Expr::num120(expr.range, *num),
            Str { val } => {
                let nil = QualifiedIdent::new_static("String.nil", None, expr.range);
                let cons = QualifiedIdent::new_static("String.cons", None, expr.range);
                self.connect_with(edge, &nil, ambient);
                self.connect_with(edge, &cons, ambient);

                untyped::Expr::str(expr.range, val.clone())
            }
            App { fun, args } => {
                let fun = self.erase_expr(ambient, edge, fun);
                let mut spine = Vec::new();
                for arg in args {
                    spine.push(self.erase_expr(ambient, edge, &arg.data))
                }
                untyped::Expr::app(expr.range, fun, spine)
            }
            Sub { expr, .. } => self.erase_expr(ambient, edge, expr),
            Binary { op, left, right } => {
                let left = self.erase_expr(ambient, edge, left);
                let right = self.erase_expr(ambient, edge, right);
                untyped::Expr::binary(expr.range, *op, left, right)
            }
            Typ | NumType { typ: _ } | Hole { num: _ } | Hlp(_) | Err => {
                if ambient != Ambient::Irrelevant {
                    self.set_relevance(edge, Relevance::Irrelevant, expr.range);
                }
                untyped::Expr::err(expr.range)
            }
        }
    }
}
