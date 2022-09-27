use crate::book::name::Ident;
use crate::book::term::{Operator, Term};
use crate::book::{Entry, Rule};
use crate::codegen::kdl::Book;

use std::collections::HashMap;
use std::collections::HashSet;

#[derive(Clone, Debug)]
pub enum CompTerm {
    Var {
        name: String,
    },
    Lam {
        name: String,
        body: Box<CompTerm>,
    },
    App {
        func: Box<CompTerm>,
        argm: Box<CompTerm>,
    },
    Dup {
        nam0: String,
        nam1: String,
        expr: Box<CompTerm>,
        body: Box<CompTerm>,
    },
    Let {
        name: String,
        expr: Box<CompTerm>,
        body: Box<CompTerm>,
    },
    Ctr {
        name: String,
        args: Vec<Box<CompTerm>>,
    },
    Fun {
        name: String,
        args: Vec<Box<CompTerm>>,
    },
    Num {
        numb: u128,
    },
    Op2 {
        oper: Operator,
        val0: Box<CompTerm>,
        val1: Box<CompTerm>,
    },
    Nil,
}

#[derive(Clone, Debug)]
pub struct CompRule {
    pub name: String,
    pub pats: Vec<Box<CompTerm>>,
    pub body: Box<CompTerm>,
}

#[derive(Clone, Debug)]
pub struct CompEntry {
    pub name: String,
    pub kdln: Option<String>,
    pub args: Vec<String>,
    pub rules: Vec<CompRule>,
    pub orig: bool,
}

#[derive(Clone, Debug)]
pub struct CompBook {
    pub names: Vec<String>,
    pub entrs: HashMap<String, CompEntry>,
}

pub fn compile_book(book: &Book) -> Result<CompBook, String> {
    let mut comp_book = CompBook {
        names: Vec::new(),
        entrs: HashMap::new(),
    };
    for name in &book.names {
        let entry = book.entrs.get(&Ident(name.clone())).unwrap();
        // Don't compile primitive U120 operations
        // TODO: If this compiler eventually gets used for other targets (like HVM), this will need to be separated.
        //       We could do passes of compiler features (like flattening, linearizing, etc) also separately.
        if u120_to_oper(&entry.name.0).is_some() {
            continue;
        }
        // Skip over useless entries
        // TODO: This doesn't cover all cases. We need something like `erase` but for a Book.
        //       Also maybe there are functions of type Type that should be compiled?
        if let Term::Typ { orig: _ } = &*entry.tipo {
            continue;
        }
        let entrs = compile_entry(book, entry)?;
        for entry in entrs {
            comp_book.names.push(entry.name.clone());
            comp_book.entrs.insert(entry.name.clone(), entry);
        }
    }
    Ok(comp_book)
}

// Can become multiple entries after flatenning
pub fn compile_entry(book: &Book, entry: &Entry) -> Result<Vec<CompEntry>, String> {
    fn compile_rule(book: &Book, entry: &Entry, rule: &Rule) -> CompRule {
        let name = rule.name.0.clone();
        let mut pats = Vec::new();
        for (arg, pat) in entry.args.iter().zip(rule.pats.iter()) {
            if !arg.eras {
                let pat = erase(book, pat);
                // TODO: Check if the pattern has some invalid term (anything other than num, ctr or var)
                pats.push(pat);
            }
        }
        let body = erase(book, &rule.body);
        CompRule { name, pats, body }
    }

    fn make_u120_new() -> CompEntry {
        // U120.new hi lo = (+ (<< hi 60) (>> (<< lo 60) 60))
        CompEntry {
            name: "U120.new".to_string(),
            kdln: None,
            args: vec!["hi".to_string(), "lo".to_string()],
            rules: vec![CompRule {
                name: "U120.new".to_string(),
                pats: vec![Box::new(CompTerm::Var { name: "hi".to_string() }), Box::new(CompTerm::Var { name: "lo".to_string() })],
                body: Box::new(CompTerm::Op2 {
                    oper: Operator::Add,
                    val0: Box::new(CompTerm::Op2 {
                        oper: Operator::Shl,
                        val0: Box::new(CompTerm::Var { name: "hi".to_string() }),
                        val1: Box::new(CompTerm::Num { numb: 60 }),
                    }),
                    val1: Box::new(CompTerm::Op2 {
                        oper: Operator::Shr,
                        val0: Box::new(CompTerm::Op2 {
                            oper: Operator::Shl,
                            val0: Box::new(CompTerm::Var { name: "lo".to_string() }),
                            val1: Box::new(CompTerm::Num { numb: 60 }),
                        }),
                        val1: Box::new(CompTerm::Num { numb: 60 }),
                    }),
                }),
            }],
            orig: true,
        }
    }

    fn make_u120_low() -> CompEntry {
        // U120.low n = (>> (<< n 60) 60))
        CompEntry {
            name: "U120.low".to_string(),
            kdln: None,
            args: vec!["n".to_string()],
            rules: vec![CompRule {
                name: "U120.low".to_string(),
                pats: vec![Box::new(CompTerm::Var { name: "n".to_string() })],
                body: Box::new(CompTerm::Op2 {
                    oper: Operator::Shr,
                    val0: Box::new(CompTerm::Op2 {
                        oper: Operator::Shl,
                        val0: Box::new(CompTerm::Var { name: "n".to_string() }),
                        val1: Box::new(CompTerm::Num { numb: 60 }),
                    }),
                    val1: Box::new(CompTerm::Num { numb: 60 }),
                }),
            }],
            orig: true,
        }
    }

    fn make_u120_high() -> CompEntry {
        // U120.high n = (>> n 60)
        CompEntry {
            name: "U120.high".to_string(),
            kdln: None,
            args: vec!["n".to_string()],
            rules: vec![CompRule {
                name: "U120.high".to_string(),
                pats: vec![Box::new(CompTerm::Var { name: "n".to_string() })],
                body: Box::new(CompTerm::Op2 {
                    oper: Operator::Shr,
                    val0: Box::new(CompTerm::Var { name: "n".to_string() }),
                    val1: Box::new(CompTerm::Num { numb: 60 }),
                }),
            }],
            orig: true,
        }
    }

    match entry.name.0.as_str() {
        // Some U120 functions should have a special compilation
        "U120.new" => Ok(vec![make_u120_new()]),
        // U120.new becomes a special function that joins two numbers as if they were U60s
        // TODO: We could rewrite these both to not need this workaround, but it would become rather slow on normal HVM (~100 rewrites instead of 1)
        "U120.high" => Ok(vec![make_u120_high()]),
        // high and low are used for type compatibility with u60
        "U120.low" => Ok(vec![make_u120_low()]),
        _ => {
            let new_entry = CompEntry {
                name: entry.name.0.clone(),
                kdln: entry.kdln.clone(),
                args: entry.args.iter().filter(|x| !x.eras).map(|x| x.name.0.clone()).collect(),
                rules: entry.rules.iter().map(|rule| compile_rule(book, entry, rule)).collect(),
                orig: true,
            };
            // TODO: We probably need to handle U60 separately as well.
            //       Since they compile to U120, it wont overflow as expected and conversion to signed will fail.
            let new_entry = convert_u120_entry(new_entry)?;
            let mut new_entrs = flatten(new_entry);
            for entry in &mut new_entrs {
                for rule in &mut entry.rules {
                    linearize_rule(rule);
                }
            }
            Ok(new_entrs)
        }
    }
}

// Splits an entry with rules with nested cases into multiple entries with flattened rules.
pub fn flatten(entry: CompEntry) -> Vec<CompEntry> {
    fn post_inc(n: &mut u64) -> u64 {
        let old_n = *n;
        *n += 1;
        old_n
    }

    fn must_split(rule: &CompRule) -> bool {
        for pat in &rule.pats {
            if let CompTerm::Ctr { args, .. } = &**pat {
                for arg in args {
                    if matches!(&**arg, CompTerm::Ctr { .. } | CompTerm::Num { .. }) {
                        return true;
                    }
                }
            }
        }
        false
    }

    // return true on the first if both rules always match together
    fn matches_together(a: &CompRule, b: &CompRule) -> (bool, bool) {
        let mut same_shape = true;
        for (a_pat, b_pat) in a.pats.iter().zip(&b.pats) {
            match (&**a_pat, &**b_pat) {
                (CompTerm::Ctr { name: a_name, .. }, CompTerm::Ctr { name: b_name, .. }) => {
                    if a_name != b_name {
                        return (false, false);
                    }
                }
                (CompTerm::Num { numb: a_numb }, CompTerm::Num { numb: b_numb }) => {
                    if a_numb != b_numb {
                        return (false, false);
                    }
                }
                (CompTerm::Ctr { .. }, CompTerm::Num { .. }) => {
                    return (false, false);
                }
                (CompTerm::Num { .. }, CompTerm::Ctr { .. }) => {
                    return (false, false);
                }
                (CompTerm::Ctr { .. }, CompTerm::Var { .. }) => {
                    same_shape = false;
                }
                (CompTerm::Num { .. }, CompTerm::Var { .. }) => {
                    same_shape = false;
                }
                _ => {}
            }
        }
        (true, same_shape)
    }

    fn split_rule(rule: &CompRule, entry: &CompEntry, i: usize, name_count: &mut u64, skip: &mut HashSet<usize>) -> (CompRule, Vec<CompEntry>) {
        // Each rule that must be split creates a new entry that inspects one layer of Ctrs
        // The old rule is rewritten to be flat and call the new entry
        let n = post_inc(name_count);
        let new_entry_name = format!("{}{}_", entry.name, n);
        let new_entry_kdln = entry.kdln.clone().map(|kdln| format!("{}{}_", kdln, n));
        let mut new_entry_rules: Vec<CompRule> = Vec::new();
        // Rewrite the old rule to be flat and point to the new entry
        let mut old_rule_pats: Vec<Box<CompTerm>> = Vec::new();
        let mut old_rule_body_args: Vec<Box<CompTerm>> = Vec::new();
        let mut var_count = 0;
        for pat in &rule.pats {
            match &**pat {
                CompTerm::Ctr { name: pat_name, args: pat_args } => {
                    let mut new_pat_args = Vec::new();
                    for field in pat_args {
                        let arg = match &**field {
                            CompTerm::Ctr { .. } | CompTerm::Num { .. } => {
                                let name = format!(".{}", post_inc(&mut var_count));
                                Box::new(CompTerm::Var { name })
                            }
                            CompTerm::Var { .. } => field.clone(),
                            _ => {
                                panic!("?");
                            }
                        };
                        new_pat_args.push(arg.clone());
                        old_rule_body_args.push(arg);
                    }
                    old_rule_pats.push(Box::new(CompTerm::Ctr {
                        name: pat_name.clone(),
                        args: new_pat_args,
                    }));
                }
                CompTerm::Var { name } => {
                    old_rule_pats.push(Box::new(*pat.clone()));
                    old_rule_body_args.push(Box::new(CompTerm::Var { name: name.clone() }));
                }
                // TODO: It'd be better to check for Num and handle other (invalid) options
                _ => {}
            }
        }
        let old_rule_body = Box::new(CompTerm::Fun {
            name: new_entry_name.clone(),
            args: old_rule_body_args,
        });
        let old_rule = CompRule {
            name: entry.name.clone(),
            pats: old_rule_pats,
            body: old_rule_body,
        };
        //(Foo Tic (Bar a b) (Haz c d)) = A
        //(Foo Tic x         y)         = B
        //---------------------------------
        //(Foo Tic (Bar a b) (Haz c d)) = B[x <- (Bar a b), y <- (Haz c d)]
        //
        //(Foo.0 a b c d) = ...

        // Check the rules to see if there's any that will be covered by the new entry, including the rule itself.
        // Skips previously checked rules to avoid duplication.
        // For each unique matching rule, creates a new flattening rule for the entry.
        // Ex: (Fun (Ctr1 (Ctr2))) and (Fun (Ctr1 (Ctr3))) will both flatten to (Fun (Ctr1 .0)) and can be merged
        for (j, other) in entry.rules.iter().enumerate().skip(i) {
            let (compatible, same_shape) = matches_together(rule, other);
            if compatible {
                // (Foo a     (B x P) (C y0 y1)) = F
                // (Foo (A k) (B x Q) y        ) = G
                // -----------------------------
                // (Foo a (B x u) (C y0 y1)) = (Foo.0 a x u y0 y1)
                //   (Foo.0 a     x P y0 y1) = F
                //   (Foo.0 (A k) x Q f0 f1) = G [y <- (C f0 f1)] // f0 and f1 are fresh

                // Skip identical rules
                if same_shape {
                    skip.insert(j);
                }
                let mut new_rule_pats = Vec::new();
                let mut new_rule_body = other.body.clone();
                for (rule_pat, other_pat) in rule.pats.iter().zip(&other.pats) {
                    match (&**rule_pat, &**other_pat) {
                        (CompTerm::Ctr { .. }, CompTerm::Ctr { args: other_pat_args, .. }) => {
                            // Bring the arguments of a constructor outside
                            new_rule_pats.extend(other_pat_args.clone());
                        }
                        (
                            CompTerm::Ctr {
                                name: rule_pat_name,
                                args: rule_pat_args,
                            },
                            CompTerm::Var { name: other_pat_name },
                        ) => {
                            let mut new_ctr_args = vec![];
                            for _ in 0..rule_pat_args.len() {
                                let new_arg = CompTerm::Var {
                                    name: format!(".{}", post_inc(&mut var_count)),
                                };
                                new_ctr_args.push(Box::new(new_arg.clone()));
                                new_rule_pats.push(Box::new(new_arg));
                            }
                            let new_ctr = CompTerm::Ctr {
                                name: rule_pat_name.clone(),
                                args: new_ctr_args,
                            };
                            subst(&mut new_rule_body, other_pat_name, &new_ctr);
                        }
                        (CompTerm::Var { .. }, _) => {
                            new_rule_pats.push(other_pat.clone());
                        }
                        (CompTerm::Num { numb: rule_pat_numb }, CompTerm::Num { numb: other_pat_numb }) => {
                            if rule_pat_numb == other_pat_numb {
                                new_rule_pats.push(Box::new(*other_pat.clone()));
                            } else {
                                panic!("Internal error. Please report.");
                                // not possible since it matches
                            }
                        }
                        (CompTerm::Num { .. }, CompTerm::Var { name: other_pat_name }) => {
                            subst(&mut new_rule_body, other_pat_name, rule_pat);
                        }
                        _ => {
                            panic!("Internal error. Please report."); // not possible since it matches
                        }
                    }
                }
                let new_rule = CompRule {
                    name: new_entry_name.clone(),
                    pats: new_rule_pats,
                    body: new_rule_body,
                };
                new_entry_rules.push(new_rule);
            }
        }
        assert!(!new_entry_rules.is_empty()); // There's at least one rule, since rules always match with themselves
        let new_entry_args = (0..new_entry_rules[0].pats.len()).map(|n| format!("x{}", n)).collect();
        let new_entry = CompEntry {
            name: new_entry_name,
            kdln: new_entry_kdln,
            args: new_entry_args,
            rules: new_entry_rules,
            orig: false,
        };
        let new_split_entries = flatten(new_entry);
        (old_rule, new_split_entries)
    }

    let mut name_count = 0;

    let mut skip: HashSet<usize> = HashSet::new();
    let mut new_entries: Vec<CompEntry> = Vec::new();
    let mut old_entry_rules: Vec<CompRule> = Vec::new();
    let old_entry_args: Vec<String> = entry.args.clone();
    for i in 0..entry.rules.len() {
        if !skip.contains(&i) {
            let rule = &entry.rules[i];
            if must_split(rule) {
                let (old_rule, split_entries) = split_rule(rule, &entry, i, &mut name_count, &mut skip);
                old_entry_rules.push(old_rule);
                new_entries.extend(split_entries);
            } else {
                old_entry_rules.push(entry.rules[i].clone());
            }
        }
    }
    let old_entry = CompEntry {
        name: entry.name,
        kdln: entry.kdln,
        args: old_entry_args,
        rules: old_entry_rules,
        orig: entry.orig,
    };
    new_entries.push(old_entry);
    new_entries
}

// Substitute all instances of a variable in a term with another term
pub fn subst(term: &mut CompTerm, sub_name: &str, value: &CompTerm) {
    match term {
        CompTerm::Var { name } => {
            if sub_name == name {
                *term = value.clone();
            }
        }
        CompTerm::Dup { nam0, nam1, expr, body } => {
            subst(&mut *expr, sub_name, value);
            if nam0 != sub_name && nam1 != sub_name {
                subst(&mut *body, sub_name, value);
            }
        }
        CompTerm::Let { name, expr, body } => {
            subst(&mut *expr, sub_name, value);
            if name != sub_name {
                subst(&mut *body, sub_name, value);
            }
        }
        CompTerm::Lam { name, body } => {
            if name != sub_name {
                subst(&mut *body, sub_name, value);
            }
        }
        CompTerm::App { func, argm } => {
            subst(&mut *func, sub_name, value);
            subst(&mut *argm, sub_name, value);
        }
        CompTerm::Ctr { args, .. } => {
            for arg in args {
                subst(&mut *arg, sub_name, value);
            }
        }
        CompTerm::Fun { args, .. } => {
            for arg in args {
                subst(&mut *arg, sub_name, value);
            }
        }
        CompTerm::Num { .. } => {}
        CompTerm::Op2 { val0, val1, .. } => {
            subst(&mut *val0, sub_name, value);
            subst(&mut *val1, sub_name, value);
        }
        CompTerm::Nil => {}
    }
}

// Removes proof-irrelevant parts of the term
pub fn erase(book: &Book, term: &Term) -> Box<CompTerm> {
    match term {
        Term::Typ { .. } => Box::new(CompTerm::Nil),
        Term::Var { orig: _, name } => {
            let name = name.0.clone();
            Box::new(CompTerm::Var { name })
        }
        Term::Lam { orig: _, name, body } => {
            let name = name.0.clone();
            let body = erase(book, body);
            Box::new(CompTerm::Lam { name, body })
        }
        Term::App { orig: _, func, argm } => {
            let func = erase(book, func);
            let argm = erase(book, argm);
            Box::new(CompTerm::App { func, argm })
        }
        Term::All {
            orig: _,
            name: _,
            tipo: _,
            body: _,
        } => Box::new(CompTerm::Nil),
        Term::Let { orig: _, name, expr, body } => {
            let name = name.0.clone();
            let expr = erase(book, expr);
            let body = erase(book, body);
            Box::new(CompTerm::Let { name, expr, body })
        }
        Term::Ann { orig: _, expr, tipo: _ } => erase(book, expr),
        Term::Sub {
            orig: _,
            expr,
            name: _,
            indx: _,
            redx: _,
        } => erase(book, expr),
        Term::Ctr { orig: _, name, args: term_args } => {
            let name = name.0.clone();
            let entr = book.entrs.get(&Ident(name.clone())).unwrap();
            let mut args = vec![];
            for (idx, arg) in term_args.iter().enumerate() {
                if !entr.args[idx].eras {
                    args.push(erase(book, arg));
                }
            }
            Box::new(CompTerm::Ctr { name, args })
        }
        Term::Fun { orig: _, name, args: term_args } => {
            let name = name.0.clone();
            let entr = book.entrs.get(&Ident(name.clone())).unwrap();
            let mut args = vec![];
            for (idx, arg) in term_args.iter().enumerate() {
                if !entr.args[idx].eras {
                    args.push(erase(book, arg));
                }
            }
            Box::new(CompTerm::Fun { name, args })
        }
        Term::Hlp { orig: _ } => Box::new(CompTerm::Nil),
        Term::U60 { orig: _ } => Box::new(CompTerm::Nil),
        Term::Num { orig: _, numb } => {
            let numb = *numb as u128;
            Box::new(CompTerm::Num { numb })
        }
        Term::Op2 { orig: _, oper, val0, val1 } => {
            let oper = *oper;
            let val0 = erase(book, val0);
            let val1 = erase(book, val1);
            Box::new(CompTerm::Op2 { oper, val0, val1 })
        }
        Term::Hol { orig: _, numb: _ } => Box::new(CompTerm::Nil),
        Term::Mat { .. } => Box::new(CompTerm::Nil),
    }
}

// Counts usages of a name in an erased term
pub fn count_uses(term: &CompTerm, count_name: &str) -> usize {
    match term {
        CompTerm::Var { name } => {
            if name == count_name {
                1
            } else {
                0
            }
        }
        CompTerm::Lam { name, body } => {
            if name == count_name {
                0
            } else {
                count_uses(body, count_name)
            }
        }
        CompTerm::App { func, argm } => count_uses(func, count_name) + count_uses(argm, count_name),
        CompTerm::Dup { nam0, nam1, expr, body } => {
            let expr_count = count_uses(expr, count_name);
            let body_count = if nam0 == count_name || nam1 == count_name { 0 } else { count_uses(body, count_name) };
            expr_count + body_count
        }
        CompTerm::Let { name, expr, body } => {
            let expr_count = count_uses(expr, count_name);
            let body_count = if name == count_name { 0 } else { count_uses(body, count_name) };
            expr_count + body_count
        }
        CompTerm::Ctr { name: _, args } => {
            let mut sum = 0;
            for arg in args {
                sum += count_uses(arg, count_name);
            }
            sum
        }
        CompTerm::Fun { name: _, args } => {
            let mut sum = 0;
            for arg in args {
                sum += count_uses(arg, count_name);
            }
            sum
        }
        CompTerm::Op2 { oper: _, val0, val1 } => count_uses(val0, count_name) + count_uses(val1, count_name),
        CompTerm::Num { .. } => 0,
        CompTerm::Nil => 0,
    }
}

// Renames a target variable using the fresh names in a vector
pub fn rename_clones(term: &mut CompTerm, target: &str, names: &mut Vec<String>) {
    match term {
        CompTerm::Var { name } => {
            if name == target {
                *name = names.pop().unwrap();
            }
        }
        CompTerm::Lam { name, body } => {
            if name != target {
                rename_clones(body, target, names);
            }
        }
        CompTerm::App { func, argm } => {
            rename_clones(func, target, names);
            rename_clones(argm, target, names);
        }
        CompTerm::Dup { nam0, nam1, expr, body } => {
            rename_clones(expr, target, names);
            if nam0 != target && nam1 != target {
                rename_clones(body, target, names);
            }
        }
        CompTerm::Let { name, expr, body } => {
            rename_clones(expr, target, names);
            if name != target {
                rename_clones(body, target, names);
            }
        }
        CompTerm::Ctr { name: _, args } => {
            for arg in args {
                rename_clones(arg, target, names);
            }
        }
        CompTerm::Fun { name: _, args } => {
            for arg in args {
                rename_clones(arg, target, names);
            }
        }
        CompTerm::Op2 { oper: _, val0, val1 } => {
            rename_clones(val0, target, names);
            rename_clones(val1, target, names);
        }
        CompTerm::Num { .. } => {}
        CompTerm::Nil => {}
    }
}

pub fn linearize_rule(rule: &mut CompRule) {
    // Returns left-hand side variables
    fn collect_lhs_vars<'a>(term: &'a mut CompTerm, vars: &mut HashMap<String, &'a mut CompTerm>) {
        match term {
            CompTerm::Var { name } => {
                vars.insert(name.clone(), term);
            }
            CompTerm::App { func, argm } => {
                collect_lhs_vars(func, vars);
                collect_lhs_vars(argm, vars);
            }
            CompTerm::Ctr { args, .. } => {
                for arg in args {
                    collect_lhs_vars(arg, vars);
                }
            }
            CompTerm::Num { .. } => {}
            _ => {
                panic!("Invalid left-hand side.");
            }
        }
    }

    // linearize_name (Foo x x x x) 'x' 0
    // ----------------------------------------------------------------
    // dup x0 x1 = x; dup x2 x3 = x0; dup x4 x5 = x1; (Foo x2 x3 x4 x5)
    // Returns the number of times the variable was used in the body.
    pub fn linearize_name(body: &mut CompTerm, name: &mut String, fresh: &mut u64) -> usize {
        fn fresh_name(fresh: &mut u64) -> String {
            let name = format!("_{}", fresh);
            *fresh += 1;
            name
        }
        let uses = count_uses(body, name);
        if uses > 1 {
            let mut names = vec![];
            for _ in 0..(uses - 1) * 2 {
                names.push(fresh_name(fresh));
            }
            //println!("-> uses is {}, names is {:?}", uses, names);
            let mut renames = vec![];
            for rename in names[names.len() - uses..].iter().rev() {
                renames.push(rename.clone());
            }
            rename_clones(body, name, &mut renames);
            for i in (0..uses - 1).rev() {
                let nam0 = names[i * 2].clone();
                let nam1 = names[i * 2 + 1].clone();
                let expr = Box::new(CompTerm::Var {
                    name: if i == 0 { name.to_string() } else { names[i - 1].clone() },
                });
                let new_body = CompTerm::Dup {
                    nam0,
                    nam1,
                    expr,
                    body: Box::new(CompTerm::Nil),
                };
                let old_body = std::mem::replace(body, new_body);
                if let CompTerm::Dup { ref mut body, .. } = body {
                    let _ = std::mem::replace(body, Box::new(old_body));
                }
            }
        } else if uses == 0 {
            *name = String::from("~")
        }
        uses
    }

    // Linearies an erased term, replacing cloned variables by dups
    pub fn linearize_term(term: &mut CompTerm, fresh: &mut u64) {
        //println!("Linearizing: {:?}", term);
        match term {
            CompTerm::Var { name: _ } => {}
            CompTerm::Lam { ref mut name, body } => {
                linearize_term(body, fresh);
                linearize_name(body, name, fresh);
            }
            CompTerm::App { func, argm } => {
                linearize_term(func, fresh);
                linearize_term(argm, fresh);
            }
            CompTerm::Let { ref mut name, expr, body } => {
                linearize_term(expr, fresh);
                linearize_term(body, fresh);
                linearize_name(body, name, fresh);
            }
            CompTerm::Ctr { name: _, args } => {
                for arg in args {
                    linearize_term(arg, fresh);
                }
            }
            CompTerm::Fun { name: _, args } => {
                for arg in args {
                    linearize_term(arg, fresh);
                }
            }
            CompTerm::Op2 { oper: _, val0, val1 } => {
                linearize_term(val0, fresh);
                linearize_term(val1, fresh);
            }
            CompTerm::Dup {
                ref mut nam0,
                ref mut nam1,
                expr,
                body,
                ..
            } => {
                // should be unreachable under normal usage, but I made it anyway
                linearize_term(expr, fresh);
                linearize_term(body, fresh);
                linearize_name(body, nam0, fresh);
                linearize_name(body, nam1, fresh);
            }
            CompTerm::Num { .. } => {}
            CompTerm::Nil => {}
        }
    }

    let mut vars = HashMap::new(); // rule pattern vars
    for pat in &mut rule.pats {
        collect_lhs_vars(&mut **pat, &mut vars);
    }
    let mut fresh = 0;
    for (mut name, var) in vars.drain() {
        // linearizes rule pattern vars
        // The &mut here doesn't do anything because we're dropping var immediately afterwards.
        // To linearize rule variables, we'll have to replace all LHS occurrences by ~ if the amount of uses is zero
        let uses = linearize_name(&mut rule.body, &mut name, &mut fresh);
        if uses == 0 {
            if let CompTerm::Var { name } = var {
                *name = String::from("~");
            }
        }
        // The reason why we don't simply pass a real mutable reference to our variable
        // (instead of a mutable reference of a clone)
        // to linearize_name is because since `var` is in `body`, we would
        // be borrowing `var` mutably twice, which is not allowed.

        // The reason why linearize_name takes in a mutable reference is
        // to replace unused vars by ~. This is useful, for example, in
        // lambdas. (@x0 #0 should be linearized to @~ #0)
    }
    linearize_term(&mut rule.body, &mut fresh); // linearizes internal bound vars
}

// Swaps u120 numbers and functions for primitive operations for kindelia compilation
pub fn convert_u120_entry(entry: CompEntry) -> Result<CompEntry, String> {
    let CompEntry { name, kdln, args, rules, orig } = entry;
    let mut new_rules = Vec::new();
    for CompRule { name, pats, body } in rules {
        let body = convert_u120_term(&body, true)?;
        let mut new_pats = Vec::new();
        for pat in pats {
            new_pats.push(convert_u120_term(&pat, false)?);
        }
        new_rules.push(CompRule { name, pats: new_pats, body });
    }
    Ok(CompEntry {
        name,
        kdln,
        args,
        rules: new_rules,
        orig,
    })
}

pub fn convert_u120_term(term: &CompTerm, rhs: bool) -> Result<Box<CompTerm>, String> {
    let term = Box::new(match term {
        // Swap U120.new by a number
        CompTerm::Ctr { name, args } => {
            if name == "U120.new" {
                if let (CompTerm::Num { numb: num1 }, CompTerm::Num { numb: num2 }) = (&*args[0], &*args[1]) {
                    CompTerm::Num { numb: (num1 << 60) + num2 }
                } else if rhs {
                    let args = args.iter().map(|x| convert_u120_term(x, rhs)).collect::<Result<Vec<Box<CompTerm>>, String>>()?;
                    CompTerm::Fun { name: name.clone(), args }
                } else {
                    return Err("Can't compile pattern match on U120 to kindelia".to_string());
                }
            } else {
                let args = args.iter().map(|x| convert_u120_term(x, rhs)).collect::<Result<Vec<Box<CompTerm>>, String>>()?;
                CompTerm::Ctr { name: name.clone(), args }
            }
        }
        // Swap U120 functions by primitive operations
        CompTerm::Fun { name, args } => {
            if let Some(oper) = u120_to_oper(name) {
                let val0 = convert_u120_term(&*args[0], rhs)?;
                let val1 = convert_u120_term(&*args[1], rhs)?;
                CompTerm::Op2 { oper, val0, val1 }
            } else {
                let args = args.iter().map(|x| convert_u120_term(x, rhs)).collect::<Result<Vec<Box<CompTerm>>, String>>()?;
                CompTerm::Fun { name: name.clone(), args }
            }
        }
        CompTerm::Var { name: _ } => term.clone(),
        CompTerm::Lam { name, body } => {
            let body = convert_u120_term(body, rhs)?;
            CompTerm::Lam { name: name.clone(), body }
        }
        CompTerm::App { func, argm } => {
            let func = convert_u120_term(func, rhs)?;
            let argm = convert_u120_term(argm, rhs)?;
            CompTerm::App { func, argm }
        }
        CompTerm::Dup { nam0, nam1, expr, body } => {
            let expr = convert_u120_term(expr, rhs)?;
            let body = convert_u120_term(body, rhs)?;
            CompTerm::Dup {
                nam0: nam0.clone(),
                nam1: nam1.clone(),
                expr,
                body,
            }
        }
        CompTerm::Let { name, expr, body } => {
            let expr = convert_u120_term(expr, rhs)?;
            let body = convert_u120_term(body, rhs)?;
            CompTerm::Let { name: name.clone(), expr, body }
        }
        CompTerm::Num { numb: _ } => term.clone(),
        CompTerm::Op2 { oper, val0, val1 } => {
            let val0 = convert_u120_term(val0, rhs)?;
            let val1 = convert_u120_term(val1, rhs)?;
            CompTerm::Op2 { oper: *oper, val0, val1 }
        }
        CompTerm::Nil => {
            return Err("Found nil term during compilation".to_string());
        }
    });
    Ok(term)
}

// Converts a U120 function name to the corresponding primitive operation
// None if the name is not of an operation
pub fn u120_to_oper(name: &str) -> Option<Operator> {
    match name {
        "U120.add" => Some(Operator::Add),
        "U120.sub" => Some(Operator::Sub),
        "U120.mul" => Some(Operator::Mul),
        "U120.div" => Some(Operator::Div),
        "U120.mod" => Some(Operator::Mod),
        "U120.bitwise_and" => Some(Operator::And),
        "U120.bitwise_or" => Some(Operator::Or),
        "U120.bitwise_xor" => Some(Operator::Xor),
        "U120.shift_left" => Some(Operator::Shl),
        "U120.shift_right" => Some(Operator::Shr),
        "U120.num_less_than" => Some(Operator::Ltn),
        "U120.num_less_equal" => Some(Operator::Lte),
        "U120.num_greater_than" => Some(Operator::Gtn),
        "U120.num_greater_equal" => Some(Operator::Gte),
        "U120.num_equal" => Some(Operator::Eql),
        "U120.num_not_equal" => Some(Operator::Neq),
        _ => None,
    }
}
