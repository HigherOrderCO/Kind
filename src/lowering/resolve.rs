use std::collections::HashMap;

use crate::book::term::Term;
use crate::book::name::Ident;
use crate::book::span::Span;
use crate::book::{Rule, Entry, Book};

use super::adjust::AdjustError;

pub trait Resolve {
    fn resolve(&mut self, current: &str, map: &HashMap<String, String>) -> Result<(), AdjustError>;
}

pub fn find_alias(orig: Span, path: &str, map: &HashMap<String, String>) -> Result<String, AdjustError> {
    if let Some(path) = map.get(path) {
        Ok(path.clone())
    } else {
        Err(AdjustError {
            orig,
            kind: super::adjust::AdjustErrorKind::CannotFindAlias { name: path.to_string() },
        })
    }
}

impl Ident {
    fn resolve(&mut self, current: &str, orig: Span, map: &HashMap<String, String>) -> Result<(), AdjustError> {
        if self.is_ctr() {
            let mut iter = self.0.split("/");
            let path = iter.next().unwrap();
            match (path, iter.next()) {
                ("", Some(id)) => {
                    *self = if current == "" {
                        Ident(id.to_string())
                    } else {
                        Ident(format!("{}.{}", current, id).to_string())
                    };
                }
                (path, Some("")) => {
                    let alias = find_alias(orig, path, map)?;
                    *self = Ident(alias);
                }
                (path, Some(id)) => {
                    let alias = find_alias(orig, path, map)?;
                    *self = Ident(format!("{}.{}", alias, id).to_string());
                }
                _ => ()
            }
        }
        Ok(())
    }
}

// Todo: Put a better orig inside each ident
impl Resolve for Term {
    fn resolve(&mut self, current: &str, map: &HashMap<String, String>) -> Result<(), AdjustError> {
        match self {
            Term::Num { .. } => Ok(()),
            Term::Hol { .. } => Ok(()),
            Term::Hlp { .. } => Ok(()),
            Term::U60 { .. } => Ok(()),
            Term::Typ { .. } => Ok(()),
            Term::Var { name, orig } => name.resolve(current, *orig, map),
            Term::Let { expr, body,.. } => {
                body.resolve(current, map)?;
                expr.resolve(current, map)
            },
            Term::Ann { expr, tipo, .. } => {
                expr.resolve(current, map)?;
                tipo.resolve(current, map)
            },
            Term::Sub { expr, .. } => {
                // TODO: Not sure.
                expr.resolve(current, map)
            },
            Term::All { tipo, body, .. } => {
                body.resolve(current, map)?;
                tipo.resolve(current, map)
            },
            Term::Lam { body, .. } => {
                body.resolve(current, map)
            },
            Term::App { func, argm, .. } => {
                func.resolve(current, map)?;
                argm.resolve(current, map)
            },
            Term::Ctr { args, name, orig, .. } => {
                name.resolve(current, *orig, map)?;
                for arg in args {
                    arg.resolve(current, map)?;
                }
                Ok(())
            },
            Term::Fun { args, name, orig, .. } => {
                name.resolve(current, *orig, map)?;
                for arg in args {
                    arg.resolve(current, map)?;
                }
                Ok(())
            },
            Term::Op2 { val0, val1, .. } => {
                val0.resolve(current, map)?;
                val1.resolve(current, map)
            },
            Term::Mat {
                tipo,
                expr,
                cses,
                moti,
                orig,
                ..
            } => {
                tipo.resolve(current, *orig, map)?;
                moti.resolve(current, map)?;
                expr.resolve(current, map)?;
                for (_, arg) in cses {
                    arg.resolve(current, map)?;
                }
                Ok(())
            },
            Term::Open {
                tipo,
                expr,
                body,
                moti,
                orig,
                ..
            } => {
                tipo.resolve(current, *orig, map)?;
                moti.resolve(current, map)?;
                body.resolve(current, map)?;
                expr.resolve(current, map)
            },
        }
    }
}

impl Resolve for Rule {
    fn resolve(&mut self, current: &str, map: &HashMap<String, String>) -> Result<(), AdjustError> {
        self.body.resolve(current, map)?;
        self.name.resolve(current, self.orig, map)?;
        for pat in self.pats.as_mut_slice() {
            pat.resolve(current, map)?;
        }
        Ok(())
    }
}

impl Resolve for Entry {
    fn resolve(&mut self, current: &str, map: &HashMap<String, String>) -> Result<(), AdjustError> {
        self.tipo.resolve(current, map)?;
        self.name.resolve(current, self.orig, map)?;
        for rule in self.rules.as_mut_slice() {
            rule.resolve(current, map)?;
        }
        Ok(())
    }
}

impl Resolve for Book {
    fn resolve(&mut self, current: &str, map: &HashMap<String, String>) -> Result<(), AdjustError> {
        let mut new_entrs = HashMap::new();
        let mut new_names = Vec::new();
        for (name, entr) in self.entrs.iter_mut() {
                entr.resolve(current, map)?;
                let mut new_name = name.clone();
                new_name.resolve(current, entr.orig, map)?;
                new_entrs.insert(new_name.clone(), entr.clone());
        }
        // Just to change the order of each name.
        for name in &self.names {
            let mut new_name = name.clone();
            new_name.resolve(current, Span::Generated, map)?;
            new_names.push(new_name);
        }
        self.entrs = new_entrs;
        self.names = new_names;
        Ok(())
    }
}