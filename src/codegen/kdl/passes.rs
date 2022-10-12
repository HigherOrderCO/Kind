use std::collections::{HashMap, HashSet};

use crate::book::{
    Book,
    Entry,
    name::Ident,
    Rule,
    term::Operator,
    term::Term
};
use crate::codegen::kdl::book::{CompBook, CompEntry, CompRule, CompTerm};

// Removes proof-irrelevant parts of functions
pub fn erase_terms(book: &Book) -> Result<CompBook, String> {
    // True if the compiled term is a valid rule pattern.
    // Rule patterns must be normalized terms with only Ctrs, Nums and Vars (no Lams, Dups or Lets)
    pub fn is_valid_pattern(pat: &CompTerm) -> Result<(), &CompTerm> {
        let mut check_stack: Vec<&CompTerm> = vec![pat];
        while !check_stack.is_empty() {
            let term = check_stack.pop().unwrap();
            match term {
                CompTerm::Ctr { args, .. } => {
                    for arg in args {
                        check_stack.push(arg);
                    }
                },
                CompTerm::Var { .. } => (),
                CompTerm::Num { .. } => (),
                CompTerm::Lam { .. } => { return Err(term) }
                CompTerm::App { .. } => { return Err(term) }
                CompTerm::Dup { .. } => { return Err(term) }
                CompTerm::Let { .. } => { return Err(term) }
                CompTerm::Fun { .. } => { return Err(term) }
                CompTerm::Op2 { .. } => { return Err(term) }
                CompTerm::Nil { .. } => { return Err(term) }
            };
        }
        Ok(())
    }

    fn erase_term(book: &Book, term: &Term) -> Box<CompTerm> {
        match term {
            Term::Typ { .. } => Box::new(CompTerm::Nil),
            Term::Var { name, .. } => {
                let name = name.clone();
                Box::new(CompTerm::Var { name })
            }
            Term::Lam { name, body, .. } => {
                let name = name.clone();
                let body = erase_term(book, body);
                Box::new(CompTerm::Lam { name, body })
            }
            Term::App { func, argm, .. } => {
                let func = erase_term(book, func);
                let argm = erase_term(book, argm);
                Box::new(CompTerm::App { func, argm })
            }
            Term::All {
                orig: _,
                name: _,
                tipo: _,
                body: _,
            } => Box::new(CompTerm::Nil),
            Term::Let { name, expr, body, .. } => {
                let name = name.clone();
                let expr = erase_term(book, expr);
                let body = erase_term(book, body);
                Box::new(CompTerm::Let { name, expr, body })
            }
            Term::Ann { expr, .. } => erase_term(book, expr),
            Term::Sub { expr, .. } => erase_term(book, expr),
            Term::Ctr { name, args: term_args, .. } => {
                let name = name.clone();
                let entr = book.entrs.get(&name).unwrap();
                let mut args = vec![];
                for (idx, arg) in term_args.iter().enumerate() {
                    if !entr.args[idx].eras {
                        args.push(erase_term(book, arg));
                    }
                }
                Box::new(CompTerm::Ctr { name, args })
            }
            Term::Fun { name, args: term_args, .. } => {
                let name = name.clone();
                let entr = book.entrs.get(&name).unwrap();
                let mut args = vec![];
                for (idx, arg) in term_args.iter().enumerate() {
                    if !entr.args[idx].eras {
                        args.push(erase_term(book, arg));
                    }
                }
                Box::new(CompTerm::Fun { name, args })
            }
            Term::Hlp { .. } => Box::new(CompTerm::Nil),
            Term::U60 { .. } => Box::new(CompTerm::Nil),
            Term::Num { numb, .. } => {
                let numb = *numb as u128;
                Box::new(CompTerm::Num { numb })
            }
            Term::Op2 { oper, val0, val1, .. } => {
                let oper = *oper;
                let val0 = erase_term(book, val0);
                let val1 = erase_term(book, val1);
                Box::new(CompTerm::Op2 { oper, val0, val1 })
            }
            Term::Hol { .. } => Box::new(CompTerm::Nil),
            Term::Mat { .. } => Box::new(CompTerm::Nil),
            Term::Open { .. } => Box::new(CompTerm::Nil),
        }
    }

    fn erase_rule(book: &Book, entry: &Entry, rule: &Rule) -> Result<CompRule, String> {
        let name = rule.name.clone();
        let mut pats = Vec::new();
        let mut errs = Vec::new();
        for (arg, pat) in entry.args.iter().zip(rule.pats.iter()) {
            if !arg.eras {
                let pat = erase_term(book, pat);
                if let Err(err_term) = is_valid_pattern(&*pat) {
                    // TODO: Add Display trait for compterms
                    // TODO: Tell the user exactly why this term is incorrect
                    let err = format!("Found invalid term \"{:?}\" in rule pattern matching for entry \"{}\".", err_term, entry.name);
                    errs.push(err);
                } else {
                    pats.push(pat);
                }
            }
        }
        if errs.is_empty() {
            let body = erase_term(book, &rule.body);
            Ok(CompRule { name, pats, body })
        } else {
            Err(errs.join("\n"))
        }
    }

    fn erase_entry(book: &Book, entry: &Entry) -> Result<CompEntry, String> {
        let name = entry.name.clone();
        let args = entry.args.iter().filter(|x| !x.eras).map(|x| x.name.clone()).collect();
        let mut rules = Vec::new();
        let mut errs = Vec::new();
        for rule in &entry.rules {
            match erase_rule(book, entry, rule) {
                Ok(rule) => rules.push(rule),
                Err(err) => errs.push(err),
            }
        }
        if errs.is_empty() {
            let attrs = entry.attrs.clone();
            let entry = CompEntry { name, args, rules, attrs, orig: true };
            Ok(entry)
        } else {
            Err(errs.join("\n"))
        }
    }

    let mut names = Vec::new();
    let mut entrs = HashMap::new();
    let mut errs = Vec::new();
    for name in &book.names {
        let entry = book.entrs.get(&name).unwrap();
        names.push(name.clone());
        match erase_entry(book, entry) {
            Ok(entry) => { entrs.insert(name.clone(), entry); }
            Err(err) => { errs.push(err); }
        }
    }
    if errs.is_empty() {
        Ok(CompBook { names, entrs })
    } else {
        Err(errs.join("\n"))
    }
}

pub fn erase_funs(book: Book) -> Result<Book, String> {
    let mut book = book;
    let mut names = Vec::new();
    let mut entrs = HashMap::new();
    for name in book.names {
        let entry = book.entrs.remove(&name).unwrap();
        if matches!(&*entry.tipo, Term::Typ { .. }) {
            continue;
        }
        entrs.insert(name.clone(), entry);
        names.push(name);
    }
    let book = Book { entrs, names, holes: book.holes };
    Ok(book)
}

// Splits an entry with rules with nested cases into multiple entries with flattened rules.
pub fn flatten(book: CompBook) -> Result<CompBook, String> {
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
        let new_entry_name = Ident(format!("{}{}_", entry.name, n));
        let mut new_entry_attrs = entry.attrs.clone();
        // If the old rule had a kdl name, create a new kdl name for the split entry
        for attr in &mut new_entry_attrs {
            if attr.name.0 == "kdl_name" {
                let old_kdln = attr.value.as_ref().unwrap();  // Checked before in adjust step
                let new_kdln = Ident(format!("{}{}_", old_kdln, n));
                attr.value = Some(new_kdln);
                break;
            }
        }
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
                                let name = Ident(format!(".{}", post_inc(&mut var_count)));
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
                    old_rule_pats.push(pat.clone());
                    old_rule_body_args.push(Box::new(CompTerm::Var { name: name.clone() }));
                }
                CompTerm::Num { .. } => {
                    old_rule_pats.push(pat.clone());
                }
                _ => {
                    panic!("Found invalid pattern \"{:?}\" while flattening entry \"{}\".", pat, entry.name);
                }
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
                                    name: Ident(format!(".{}", post_inc(&mut var_count))),
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
                        // Nums are like Ctr with no args, so nothing to bring out
                        (CompTerm::Num { .. }, CompTerm::Num { .. }) => (),
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
        let new_entry_args = (0..new_entry_rules[0].pats.len()).map(|n| Ident(format!("x{}", n))).collect();
        let new_entry = CompEntry {
            name: new_entry_name,
            args: new_entry_args,
            rules: new_entry_rules,
            attrs: new_entry_attrs,
            orig: false,
        };
        let new_split_entries = flatten_entry(new_entry);
        (old_rule, new_split_entries)
    }

    fn flatten_entry(entry: CompEntry) -> Vec<CompEntry> {
        let mut name_count = 0;
    
        let mut skip: HashSet<usize> = HashSet::new();
        let mut new_entries: Vec<CompEntry> = Vec::new();
        let mut old_entry_rules: Vec<CompRule> = Vec::new();
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
            args: entry.args,
            rules: old_entry_rules,
            orig: entry.orig,
            attrs: entry.attrs,
        };
        new_entries.push(old_entry);
        new_entries
    }

    let mut book = book;
    let mut names = Vec::new();
    let mut entrs = HashMap::new();
    for name in book.names {
        let entry = book.entrs.remove(&name).unwrap();
        for entry in flatten_entry(entry) {
            names.push(entry.name.clone());
            entrs.insert(entry.name.clone(), entry);
        }
    }
    let book = CompBook { names, entrs };
    Ok(book)
}

pub fn linearize_rules(book: CompBook) -> Result<CompBook, String> {
    // Returns left-hand side variables
    fn collect_lhs_vars<'a>(term: &'a mut CompTerm, vars: &mut HashMap<Ident, &'a mut CompTerm>) {
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

    // Renames a target variable using the fresh names in a vector
    pub fn rename_clones(term: &mut CompTerm, target: &Ident, names: &mut Vec<Ident>) {
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
            CompTerm::Ctr { args, .. } => {
                for arg in args {
                    rename_clones(arg, target, names);
                }
            }
            CompTerm::Fun { args, .. } => {
                for arg in args {
                    rename_clones(arg, target, names);
                }
            }
            CompTerm::Op2 { val0, val1, .. } => {
                rename_clones(val0, target, names);
                rename_clones(val1, target, names);
            }
            CompTerm::Num { .. } => {}
            CompTerm::Nil => {}
        }
    }

    // Counts usages of a name in an erased term
    pub fn count_uses(term: &CompTerm, count_name: &Ident) -> usize {
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
            CompTerm::Ctr { args, .. } => {
                let mut sum = 0;
                for arg in args {
                    sum += count_uses(arg, count_name);
                }
                sum
            }
            CompTerm::Fun { args, .. } => {
                let mut sum = 0;
                for arg in args {
                    sum += count_uses(arg, count_name);
                }
                sum
            }
            CompTerm::Op2 { val0, val1, .. } => count_uses(val0, count_name) + count_uses(val1, count_name),
            CompTerm::Num { .. } => 0,
            CompTerm::Nil => 0,
        }
    }

    // linearize_name (Foo x x x x) 'x' 0
    // ----------------------------------------------------------------
    // dup x0 x1 = x; dup x2 x3 = x0; dup x4 x5 = x1; (Foo x2 x3 x4 x5)
    // Returns the number of times the variable was used in the body.
    pub fn linearize_name(body: &mut CompTerm, name: &mut Ident, fresh: &mut u64) -> usize {
        fn fresh_name(fresh: &mut u64) -> Ident {
            let name = format!("_{}", fresh);
            *fresh += 1;
            Ident(name)
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
                    name: if i == 0 { name.clone() } else { names[i - 1].clone() },
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
            *name = Ident::new("~");
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

    pub fn linearize_rule(rule: &mut CompRule) {
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
                    *name = Ident::new("~");
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

    let mut book = book;
    for name in &book.names {
        let entry = book.entrs.get_mut(name).unwrap();
        for rule in &mut entry.rules {
            linearize_rule(rule);
        }
    }
    Ok(book)
}

pub fn inline(book: CompBook) -> Result<CompBook, String> {
    fn replace_inlines(book: &CompBook, term: &CompTerm) -> Result<Box<CompTerm>, String> {
        let new_term = match term {
            CompTerm::Fun { name, args } => {
                // First we substitute nested inline applications
                // This expands the number of inline functions we can accept
                // This is also inefficient since we are going over the tree more times than needed
                let mut new_args = Vec::new();
                for arg in args {
                    new_args.push(replace_inlines(book, arg)?);
                }
                let fn_entry = book.entrs.get(name).unwrap();
                if fn_entry.get_attribute("inline").is_some() {
                    // Substitute an inlined function application directly by the rewrite on compilation
                    let new_term = subst_inline_term(fn_entry, &name, &new_args)?;
                    // The substituted term could still have nested inline functions, so continue recursing
                    replace_inlines(book, &*new_term)?
                } else {
                    // Non inlined functions are just copied like other terms
                    Box::new(CompTerm::Fun { name: name.clone(), args: new_args })
                }
            }
            CompTerm::Var { name } => Box::new(CompTerm::Var { name: name.clone() }),
            CompTerm::Lam { name, body } => Box::new(CompTerm::Lam {
                name: name.clone(),
                body: replace_inlines(book, body)?,
            }),
            CompTerm::App { func, argm } => Box::new(CompTerm::App {
                func: replace_inlines(book, func)?,
                argm: replace_inlines(book, argm)?,
            }),
            CompTerm::Dup { nam0, nam1, expr, body } => Box::new(CompTerm::Dup {
                nam0: nam0.clone(),
                nam1: nam1.clone(),
                expr: replace_inlines(book, expr)?,
                body: replace_inlines(book, body)?,
            }),
            CompTerm::Let { name, expr, body } => Box::new(CompTerm::Let {
                name: name.clone(),
                expr: replace_inlines(book, expr)?,
                body: replace_inlines(book, body)?,
            }),
            CompTerm::Ctr { name, args } => {
                let mut new_args = Vec::new();
                for arg in args {
                    new_args.push(replace_inlines(book, arg)?);
                }
                Box::new(CompTerm::Ctr {
                    name: name.clone(),
                    args: new_args,
                })
            }
            CompTerm::Num { numb } => Box::new(CompTerm::Num { numb: numb.clone() }),
            CompTerm::Op2 { oper, val0, val1 } => Box::new(CompTerm::Op2 {
                oper: oper.clone(),
                val0: replace_inlines(book, val0)?,
                val1: replace_inlines(book, val1)?,
            }),
            CompTerm::Nil => Box::new(CompTerm::Nil),
        };
        Ok(new_term)
    }

    fn subst_inline_term(entry: &CompEntry, name: &Ident, args: &[Box<CompTerm>]) -> Result<Box<CompTerm>, String> {
        let mut new_term = Box::new(CompTerm::Nil);  // ugly
        let mut found_match = false;
        for rule in &entry.rules {
            if fun_matches_rule(args, rule) {
                // Clone the rule body and for each variable in the pats, subst in the body
                // This is the new inlined term
                new_term = rule.body.clone();
                let mut subst_stack: Vec<(&Box<CompTerm>, &Box<CompTerm>)> =
                    args.iter().zip(rule.pats.iter()).collect();
                while !subst_stack.is_empty() {
                    let (arg, pat) = subst_stack.pop().unwrap();
                    match (&**arg, &**pat) {
                        (CompTerm::Ctr { args: arg_args, .. }, CompTerm::Ctr { args: pat_args, ..}) => {
                            let to_sub: Vec<(&Box<CompTerm>, &Box<CompTerm>)> =
                                arg_args.iter().zip(pat_args.iter()).collect();
                            subst_stack.extend(to_sub);
                        }
                        (arg, CompTerm::Var { name }) => {
                            subst(&mut *new_term, &name, arg);
                        }
                        _ => ()
                    }
                }
                found_match = true;
                break;
            }
        }
        if found_match {
            Ok(new_term)
        } else {
            let term = CompTerm::Fun { name: name.clone(), args: args.to_vec() };
            Err(format!("Unable to match term {:?} to any of the function's rules", term))
        }
    }

    // Inlining before flattening avoids some complexity
    // TODO: Could be much faster to start inlining from leaves to avoid repeating work on nested inlined functions
    // TODO: Currently breaks on cyclic recursion of inlined functions. We need to add a check for this.
    let mut names = Vec::new();
    let mut entrs = HashMap::new();
    for name in &book.names {
        let entry = book.entrs.get(name).unwrap();
        // Inlined functions can be removed from the book since they wont be called anywhere
        if entry.get_attribute("inline").is_some() {
            continue;
        }
        let mut rules = Vec::new();
        for rule in &entry.rules {
            let body = replace_inlines(&book, &*rule.body)?;
            let rule = CompRule { body, ..rule.clone() };
            rules.push(rule);
        }
        let entry = CompEntry { rules, ..entry.clone() };
        names.push(name.clone());
        entrs.insert(name.clone(), entry);
    }
    let book = CompBook { names, entrs };
    Ok(book)
}

pub fn remove_u120_opers(book: CompBook) -> Result<CompBook, String> {
    // opers and new/high/low
    fn make_u120_new(old_entry: &CompEntry) -> CompEntry {
        // U120.new hi lo = (+ (<< hi 60) (>> (<< lo 60) 60))
        CompEntry {
            name: Ident::new("U120.new"),
            args: vec![Ident::new("hi"), Ident::new("lo")],
            rules: vec![CompRule {
                name: Ident::new("U120.new"),
                pats: vec![
                    Box::new(CompTerm::Var { name: Ident::new("hi") }),
                    Box::new(CompTerm::Var { name: Ident::new("lo") })
                ],
                body: Box::new(CompTerm::Op2 {
                    oper: Operator::Add,
                    val0: Box::new(CompTerm::Op2 {
                        oper: Operator::Shl,
                        val0: Box::new(CompTerm::Var { name: Ident::new("hi") }),
                        val1: Box::new(CompTerm::Num { numb: 60 }),
                    }),
                    val1: Box::new(CompTerm::Op2 {
                        oper: Operator::Shr,
                        val0: Box::new(CompTerm::Op2 {
                            oper: Operator::Shl,
                            val0: Box::new(CompTerm::Var { name: Ident::new("lo") }),
                            val1: Box::new(CompTerm::Num { numb: 60 }),
                        }),
                        val1: Box::new(CompTerm::Num { numb: 60 }),
                    }),
                }),
            }],
            orig: true,
            attrs: old_entry.attrs.clone(),
        }
    }

    fn make_u120_low(old_entry: &CompEntry) -> CompEntry {
        // U120.low n = (>> (<< n 60) 60))
        CompEntry {
            name: Ident::new("U120.low"),
            args: vec![Ident::new("n")],
            rules: vec![CompRule {
                name: Ident::new("U120.low"),
                pats: vec![Box::new(CompTerm::Var { name: Ident::new("n") })],
                body: Box::new(CompTerm::Op2 {
                    oper: Operator::Shr,
                    val0: Box::new(CompTerm::Op2 {
                        oper: Operator::Shl,
                        val0: Box::new(CompTerm::Var { name: Ident::new("n") }),
                        val1: Box::new(CompTerm::Num { numb: 60 }),
                    }),
                    val1: Box::new(CompTerm::Num { numb: 60 }),
                }),
            }],
            orig: true,
            attrs: old_entry.attrs.clone(),
        }
    }

    fn make_u120_high(old_entry: &CompEntry) -> CompEntry {
        // U120.high n = (>> n 60)
        CompEntry {
            name: Ident::new("U120.high"),
            args: vec![Ident::new("n")],
            rules: vec![CompRule {
                name: Ident::new("U120.high"),
                pats: vec![Box::new(CompTerm::Var { name: Ident::new("n") })],
                body: Box::new(CompTerm::Op2 {
                    oper: Operator::Shr,
                    val0: Box::new(CompTerm::Var { name: Ident::new("n") }),
                    val1: Box::new(CompTerm::Num { numb: 60 }),
                }),
            }],
            orig: true,
            attrs: old_entry.attrs.clone(),
        }
    }

    // Remove functions that correspond to primitive u120 operators
    let mut book = book;
    let mut names = Vec::new();
    let mut entrs = HashMap::new();
    for name in book.names {
        if u120_to_oper(&name).is_some() {
            continue;
        }
        let entry = book.entrs.remove(&name).unwrap();
        entrs.insert(name.clone(), entry);
        names.push(name);
    }
    let mut book = CompBook { names, entrs };

    // These basic U120 functions need a special compilation for kdl
    // U120.new becomes a special function that joins two numbers as if they were U60s
    if let Some(entry) = book.entrs.get(&Ident::new("U120.new")) {
        book.entrs.insert(Ident::new("U120.new"), make_u120_new(entry));
    }
    // high and low are used for type compatibility with u60
    // TODO: We could rewrite these both to not need this workaround, but it would become rather slow on normal HVM (~100 rewrites instead of 1)
    if let Some(entry) = book.entrs.get(&Ident::new("U120.low")) {
        book.entrs.insert(Ident::new("U120.low"), make_u120_low(entry));
    }
    if let Some(entry) = book.entrs.get(&Ident::new("U120.high")) {
        book.entrs.insert(Ident::new("U120.high"), make_u120_high(entry));
    }

    Ok(book)
}

// TODO: We probably need to handle U60 separately as well.
//       Since they compile to U120, it wont overflow as expected and conversion to signed will fail.
pub fn convert_u120_uses(book: CompBook) -> Result<CompBook, String> {
    // Swaps u120 numbers and functions for primitive operations for kindelia compilation
    pub fn convert_u120_entry(entry: CompEntry) -> Result<CompEntry, String> {
        let mut new_rules = Vec::new();
        for CompRule { name, pats, body } in entry.rules {
            let body = convert_u120_term(&body, true)?;
            let mut new_pats = Vec::new();
            for pat in pats {
                new_pats.push(convert_u120_term(&pat, false)?);
            }
            new_rules.push(CompRule { name, pats: new_pats, body });
        }
        Ok(CompEntry { rules: new_rules, ..entry })
    }

    pub fn convert_u120_term(term: &CompTerm, rhs: bool) -> Result<Box<CompTerm>, String> {
        let term = Box::new(match term {
            // Swap U120.new by a number
            CompTerm::Ctr { name, args } => {
                if name.0 == "U120.new" {
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

    let mut book = book;
    let mut names = Vec::new();
    let mut entrs = HashMap::new();
    let mut errs = Vec::new();
    for name in book.names {
        let entry = book.entrs.remove(&name).unwrap();
        match convert_u120_entry(entry) {
            Ok(entry) => {
                entrs.insert(name.clone(), entry);
                names.push(name);
            }
            Err(err) => {
                errs.push(err);
            }
        }
    }
    if errs.is_empty() {
        let book = CompBook { entrs, names };
        Ok(book)
    } else {
        Err(errs.join(" "))
    }
}


// Utils
// -----

// Converts a U120 function name to the corresponding primitive operation
// None if the name is not of an operation
pub fn u120_to_oper(name: &Ident) -> Option<Operator> {
    match name.0.as_str() {
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

// Substitute all instances of a variable in a term with another term
pub fn subst(term: &mut CompTerm, sub_name: &Ident, value: &CompTerm) {
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

pub fn fun_matches_rule (args: &[Box<CompTerm>], rule: &CompRule) -> bool {
    for (arg, pat) in args.iter().zip(rule.pats.iter()) {
        let matches = term_matches_pattern(arg, pat);
        if !matches {
            return false;
        }
    }
    true
}

pub fn term_matches_pattern (term: &CompTerm, pat: &CompTerm) -> bool {
    let mut check_stack = vec![(term, pat)];
    while !check_stack.is_empty() {
        let (term, pat) = check_stack.pop().unwrap();
        match (term, pat) {
            // For Ctr, check that the args also match
            (CompTerm::Ctr { args: term_args, .. }, CompTerm::Ctr { args: pat_args, .. }) => {
                for (arg, pat) in term_args.iter().zip(pat_args.iter()) {
                    check_stack.push((arg, pat));
                }
            }
            // Nums need to be the same
            (CompTerm::Num { numb: term_numb }, CompTerm::Num { numb: pat_numb }) => {
                if term_numb != pat_numb {
                    return false
                }
            }
            // If the pattern is a variable we accept it if the term is weak head normal
            (CompTerm::Ctr { .. }, CompTerm::Var { .. }) => (),
            (CompTerm::Num { .. }, CompTerm::Var { .. }) => (),
            (CompTerm::Lam { .. }, CompTerm::Var { .. }) => (),
            // TODO: Unless we actually reduce the terms, we can only do a very simple 1-to-1 matching
            //       The only exception is with inlined functions, but we do them separately before.
            //       So, if we need to do some rewriting, we fail since we can't know the right rule
            _ => return false,
        }
    }
    true
}