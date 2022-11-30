use fxhash::{FxHashMap, FxHashSet};
use kind_span::Range;
use kind_tree::symbol::{Ident, QualifiedIdent};
use kind_tree::untyped::{self, Book, Entry, Expr, ExprKind, Rule};
use linked_hash_map::LinkedHashMap;

use crate::subst::subst;

fn must_split(rule: &Rule) -> bool {
    for pat in &rule.pats {
        if let ExprKind::Ctr { args, .. } = &pat.data {
            for arg in args {
                if matches!(arg.data, ExprKind::Ctr { .. } | ExprKind::Num { .. }) {
                    return true;
                }
            }
        }
    }
    false
}

fn matches_together(a: &Rule, b: &Rule) -> (bool, bool) {
    let mut same_shape = true;

    for (a_pat, b_pat) in a.pats.iter().zip(&b.pats) {
        match (&a_pat.data, &b_pat.data) {
            (ExprKind::Ctr { name: an, .. }, ExprKind::Ctr { name: bn, .. }) if an != bn => {
                return (false, false);
            }
            (ExprKind::Num { num: a_numb }, ExprKind::Num { num: b_numb }) if a_numb != b_numb => {
                return (false, false);
            }
            (ExprKind::Ctr { .. }, ExprKind::Num { .. }) => {
                return (false, false);
            }
            (ExprKind::Num { .. }, ExprKind::Ctr { .. }) => {
                return (false, false);
            }
            (ExprKind::Ctr { .. }, ExprKind::Var { .. }) => {
                same_shape = false;
            }
            (ExprKind::Num { .. }, ExprKind::Var { .. }) => {
                same_shape = false;
            }
            _ => {}
        }
    }

    (true, same_shape)
}

fn split_rule(
    rule: &Rule,
    entry: &Entry,
    i: usize,
    name_count: &mut u64,
    skip: &mut FxHashSet<usize>,
) -> (Rule, Vec<Entry>) {
    let num = *name_count;
    *name_count += 1;

    let new_entry_name = QualifiedIdent::new_static(
        &format!("{}{}_", entry.name.to_str(), num),
        None,
        entry.range,
    );
    let mut new_entry_attrs = entry.attrs.clone();

    new_entry_attrs.kdl_name = None;

    let mut new_entry_rules: Vec<Rule> = Vec::new();
    let mut old_rule_pats: Vec<Box<Expr>> = Vec::new();
    let mut old_rule_body_args: Vec<Box<Expr>> = Vec::new();

    let mut var_count = 0;

    for pat in &rule.pats {
        match &pat.data {
            ExprKind::Var { name } => {
                old_rule_pats.push(pat.clone());
                old_rule_body_args.push(Expr::var(name.clone()));
            }
            ExprKind::Num { .. } => {
                old_rule_pats.push(pat.clone());
            }
            ExprKind::Ctr { name, args } => {
                let mut new_pat_args = Vec::new();

                for field in args {
                    let arg = match &field.data {
                        ExprKind::Ctr { .. } | ExprKind::Num { .. } => {
                            let name = Ident::new(format!(".x{}", var_count), field.range);
                            var_count += 1;
                            Expr::var(name)
                        }
                        ExprKind::Var { .. } => field.clone(),
                        _ => panic!(
                            "Internal Error: Cannot use this kind of expression during flattening"
                        ),
                    };
                    new_pat_args.push(arg.clone());
                    old_rule_body_args.push(arg);
                }

                old_rule_pats.push(Expr::ctr(pat.range, name.clone(), new_pat_args));
            }
            _ => unreachable!("Internal Error: Invalid constructor while decoding pats"),
        }
    }

    let old_rule_body = Expr::fun(rule.range, new_entry_name.clone(), old_rule_body_args);

    let old_rule = Rule {
        name: entry.name.clone(),
        pats: old_rule_pats,
        body: old_rule_body,
        range: rule.range,
    };

    for (j, other) in entry.rules.iter().enumerate().skip(i) {
        let (compatible, same_shape) = matches_together(rule, other);
        if compatible {
            if same_shape {
                skip.insert(j);
            }
            let mut new_rule_pats = Vec::new();
            let mut new_rule_body = other.body.clone();
            for (rule_pat, other_pat) in rule.pats.iter().zip(&other.pats) {
                match (&rule_pat.data, &other_pat.data) {
                    (ExprKind::Ctr { .. }, ExprKind::Ctr { args: pat_args, .. }) => {
                        new_rule_pats.extend(pat_args.clone());
                    }
                    (ExprKind::Ctr { name, args }, ExprKind::Var { name: opat_name }) => {
                        let mut new_ctr_args = vec![];

                        for _ in 0..args.len() {
                            let new_arg =
                                Expr::var(Ident::new(format!(".x{}", var_count), rule_pat.range));

                            var_count += 1;

                            new_ctr_args.push(new_arg.clone());
                            new_rule_pats.push(new_arg);
                        }

                        let new_ctr = Expr::ctr(name.range, name.clone(), new_ctr_args);

                        subst(&mut new_rule_body, opat_name, &new_ctr);
                    }
                    (ExprKind::Var { .. }, _) => {
                        new_rule_pats.push(other_pat.clone());
                    }
                    (ExprKind::Num { .. }, ExprKind::Num { .. }) => (),
                    (ExprKind::Num { .. }, ExprKind::Var { name }) => {
                        subst(&mut new_rule_body, name, rule_pat);
                    }
                    _ => {
                        panic!("Internal error. Please report."); // not possible since it matches
                    }
                }
            }

            let new_rule = Rule {
                name: new_entry_name.clone(),
                pats: new_rule_pats,
                body: new_rule_body,
                range: new_entry_name.range,
            };
            new_entry_rules.push(new_rule);
        }
    }

    assert!(!new_entry_rules.is_empty());

    let new_entry_args = (0..new_entry_rules[0].pats.len())
        .map(|n| (format!("x{}", n), Range::ghost_range(), false))
        .collect();

    let new_entry = Entry {
        name: new_entry_name,
        args: new_entry_args,
        rules: new_entry_rules,
        attrs: new_entry_attrs,
        range: entry.range,
    };

    let new_split_entries = flatten_entry(&new_entry);
    (old_rule, new_split_entries)
}

fn flatten_entry(entry: &Entry) -> Vec<Entry> {
    let mut name_count = 0;

    let mut skip: FxHashSet<usize> = FxHashSet::default();
    let mut new_entries: Vec<Entry> = Vec::new();
    let mut old_entry_rules: Vec<Rule> = Vec::new();

    for i in 0..entry.rules.len() {
        if !skip.contains(&i) {
            let rule = &entry.rules[i];
            if must_split(rule) {
                let (old_rule, split_entries) =
                    split_rule(rule, entry, i, &mut name_count, &mut skip);
                old_entry_rules.push(old_rule);
                new_entries.extend(split_entries);
            } else {
                old_entry_rules.push(entry.rules[i].clone());
            }
        }
    }

    let old_entry = Entry {
        name: entry.name.clone(),
        args: entry.args.clone(),
        rules: old_entry_rules,
        range: entry.range,
        attrs: entry.attrs.clone(),
    };

    new_entries.push(old_entry);
    new_entries
}

pub fn flatten(book: untyped::Book) -> untyped::Book {
    let mut book = book;
    let mut names = FxHashMap::default();
    let mut entrs = LinkedHashMap::default();

    for name in book.names.keys() {
        let entry = book.entrs.remove(name).unwrap();
        for entry in flatten_entry(&entry) {
            names.insert(entry.name.to_string(), entrs.len());
            entrs.insert(entry.name.to_string(), Box::new(entry));
        }
    }

    Book { names, entrs }
}
