//! Erases everything that is not relevant to the output.

use std::collections::VecDeque;

use fxhash::FxHashMap;
use kind_tree::{desugared::{self, Book, Entry}, symbol::Ident};

#[derive(Clone, Copy, PartialEq, Eq)]
pub enum Status {
    Relevant,
    Irrelevant,
}

pub struct ErasureState<'a> {
    relevant_top_level: FxHashMap<String, Ident>,
    local_ctx: im::HashMap<String, (Ident, Status)>,
    book: &'a mut Book,
    queue: VecDeque<Ident>
}

impl<'a> ErasureState<'a> {

    pub fn erase_expr(&mut self, on_pat: bool, mode: Status, expr: &mut desugared::Expr) {
        use desugared::ExprKind::*;
        match &mut expr.data {
            Var(name) => {
                if on_pat {
                    self.local_ctx.insert(name.to_string(), (name.clone(), mode));
                } else {
                    let (ident, relevance) = self.local_ctx.get(&name.to_string()).unwrap();
                    if *relevance == Status::Relevant && mode == Status::Irrelevant {
                        panic!("Using relevant thing lol")
                    }
                }
            }
            Lambda(binder, body) => {
                let scope = self.local_ctx.clone();
                self.local_ctx.insert(binder.to_string(), (binder.clone(), mode));
                self.erase_expr(on_pat, mode, body);
                self.local_ctx = scope
            },
            App(left, right) => {
                self.erase_expr(on_pat, mode, left);
                for arg in right {
                    self.erase_expr(on_pat, mode,arg);
                }
            }
            Fun(entr, right) => {
                if mode == Status::Relevant {
                    self.queue.push_back(entr.clone());
                }
                for arg in right {
                    self.erase_expr(on_pat, mode, arg);
                }
            }
            Ctr(_, _) => todo!(),
            Let(_, _, _) => todo!(),
            Ann(_, _) => todo!(),
            Sub(_, _, _, _) => todo!(),
            Typ => todo!(),
            U60 => todo!(),
            Num(_) => todo!(),
            Str(_) => todo!(),
            Binary(_, _, _) => todo!(),
            Hole(_) => todo!(),
            Hlp(_) => todo!(),
            All(_, _, _) => todo!(),
            Err => todo!(),
        }
    }

    pub fn erase_entry(&mut self, entry: &mut desugared::Entry) {
        if self.relevant_top_level.contains_key(entry.name.to_str()) {
            return
        }

        self.set_relevant(&entry.name);

        let ctx = self.local_ctx.clone();

        // The entry type is irrelevant by default so we dont need to check it.
        let erasures = entry.args.iter().map(|x| x.erased).collect::<Vec<bool>>();

        for rule in entry.rules.iter_mut() {
            let mut new_pats = rule.pats.clone();
            for i in 0..rule.pats.len() {
                if !erasures[i] {
                    self.erase_expr(true, Status::Irrelevant, &mut rule.pats[i]);
                    new_pats.push(rule.pats[i].clone())
                }
            }

        }

        todo!()
    }

    fn set_relevant(&mut self, ident: &Ident) {
        self.relevant_top_level
                .insert(ident.to_string(), ident.to_owned());
    }

    pub fn erase_book(&mut self, book: &mut desugared::Book, entry_points: Vec<String>) {
        for name in entry_points {
            let entry = book.entrs.get(&name).unwrap();
            self.set_relevant(&entry.name);
        }
    }
}
