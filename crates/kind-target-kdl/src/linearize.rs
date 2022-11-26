// This modules makes all variable usages linear and with a unique name. That has the following effect:
// - All variables are renamed to have a global unique name.
// - All variables are linearized.
//   - If they're used more than once, dups are inserted.
//   - If they're used once, nothing changes.
//   - If they're never used, their name is changed to "*"
// Example:
//   - sanitizing: `(Foo a b) = (+ a a)`
//   - results in: `(Foo x0 *) = dup x0.0 x0.1 = x0; (+ x0.0 x0.1)`
// The algorithm was copied from the hvm

use crate::File;
use fxhash::FxHashMap;
use kindelia_lang::ast::{Func, Name, Rule, Statement, Term};
use linked_hash_map::LinkedHashMap;

pub struct LinearizeCtx {
    uses: FxHashMap<Name, u64>,
    name_table: LinkedHashMap<Name, Name>,
    name_count: u64,
}

impl LinearizeCtx {
    fn create_name(&mut self) -> Name {
        let name = Name::from_str(&format!("x{}", self.name_count)).unwrap();
        self.name_count += 1;
        name
    }

    fn new() -> Self {
        LinearizeCtx {
            uses: Default::default(),
            name_table: Default::default(),
            name_count: 0,
        }
    }

    // Pass through the lhs of the function generating new names
    // for every variable found in the style described before with
    // the fresh function. Also checks if rule's left side is valid.
    fn create_param_names(&mut self, rule: &Rule) {
        if let Term::Ctr { name: _, args } = &rule.lhs {
            for arg in args {
                match arg {
                    Term::Var { name } => {
                        let new_name = self.create_name();
                        self.name_table.insert(name.clone(), new_name);
                    }
                    Term::Ctr { name: _, args } => {
                        for arg in args {
                            if let Term::Var { name } = arg {
                                let new_name = self.create_name();
                                self.name_table.insert(name.clone(), new_name);
                            } else {
                                unreachable!(); // We expect a flat rule
                            }
                        }
                    }
                    Term::Num { .. } => (),
                    _ => unreachable!(), // Invalid lhs param
                }
            }
        } else {
            unreachable!(); // Invalid lhs Term
        }
    }
}

pub fn linearize_file(file: File) -> File {
    let mut runs = Vec::new();
    for stmt in file.runs {
        if let Statement::Run { expr, sign: _ } = stmt {
            let expr = linearize_term_independent(&expr);
            let stmt = Statement::Run {
                expr: *expr,
                sign: None,
            };
            runs.push(stmt);
        } else {
            unreachable!();
        }
    }
    let mut funs: LinkedHashMap<_, _> = Default::default();
    for (kind_name, stmt) in file.funs {
        if let Statement::Fun {
            name,
            args,
            func,
            init,
            sign: _,
        } = stmt
        {
            let init = init.map(|x| *linearize_term_independent(&x));
            let mut rules: Vec<_> = Default::default();
            for rule in func.rules {
                let rule = linearize_rule(rule);
                rules.push(rule);
            }
            let func = Func { rules };
            let stmt = Statement::Fun {
                name,
                args,
                func,
                init,
                sign: None,
            };
            funs.insert(kind_name, stmt);
        } else {
            unreachable!();
        }
    }
    let ctrs = file.ctrs;
    File { ctrs, funs, runs }
}

pub fn linearize_rule(rule: Rule) -> Rule {
    let mut ctx = LinearizeCtx::new();
    ctx.create_param_names(&rule);
    let mut rhs = linearize_term(&mut ctx, &rule.rhs, false);
    let lhs = linearize_term(&mut ctx, &rule.lhs, true);
    let vals: Vec<Name> = ctx.name_table.values().map(Name::clone).collect();
    for val in vals {
        let expr = Box::new(Term::Var { name: val.clone() });
        rhs = dup_var(&mut ctx, &val, expr, rhs);
    }
    Rule {
        lhs: *lhs,
        rhs: *rhs,
    }
}

pub fn linearize_term(ctx: &mut LinearizeCtx, term: &Term, lhs: bool) -> Box<Term> {
    let term = match term {
        Term::Var { name } => {
            if lhs {
                let mut name = ctx.name_table.get(name).unwrap_or(name).clone();
                rename_erased(ctx, &mut name);
                Term::Var { name }
            } else {
                // create a var with the name generated before
                // concatenated with '.{{times_used}}'
                if let Some(name) = ctx.name_table.get(name) {
                    let used = *ctx
                        .uses
                        .entry(name.clone())
                        .and_modify(|x| *x += 1)
                        .or_insert(1);
                    let name = Name::from_str(&format!("{}.{}", name, used - 1)).unwrap(); // TODO: Think if this errs or not
                    Term::Var { name }
                } else {
                    unreachable!(); // Is it? Unbound variable
                }
            }
        }
        Term::Dup {
            nam0,
            nam1,
            expr,
            body,
        } => {
            let new_nam0 = ctx.create_name();
            let new_nam1 = ctx.create_name();
            let expr = linearize_term(ctx, expr, lhs);
            let got_0 = ctx.name_table.remove(nam0);
            let got_1 = ctx.name_table.remove(nam0);
            ctx.name_table.insert(nam0.clone(), new_nam0.clone());
            ctx.name_table.insert(nam1.clone(), new_nam1.clone());
            let body = linearize_term(ctx, body, lhs);
            ctx.name_table.remove(nam0);
            if let Some(x) = got_0 {
                ctx.name_table.insert(nam0.clone(), x);
            }
            ctx.name_table.remove(nam1);
            if let Some(x) = got_1 {
                ctx.name_table.insert(nam1.clone(), x);
            }
            let nam0 = Name::from_str(&format!("{}{}", new_nam0, ".0")).unwrap();
            let nam1 = Name::from_str(&format!("{}{}", new_nam1, ".0")).unwrap();
            Term::Dup {
                nam0,
                nam1,
                expr,
                body,
            }
        }
        Term::Lam { name, body } => {
            let mut new_name = ctx.create_name();
            let got_name = ctx.name_table.remove(name);
            ctx.name_table.insert(name.clone(), new_name.clone());
            let body = linearize_term(ctx, body, lhs);
            ctx.name_table.remove(name);
            if let Some(x) = got_name {
                ctx.name_table.insert(name.clone(), x);
            }
            let expr = Box::new(Term::Var {
                name: new_name.clone(),
            });
            let body = dup_var(ctx, &new_name, expr, body);
            rename_erased(ctx, &mut new_name);
            Term::Lam {
                name: new_name,
                body,
            }
        }
        Term::App { func, argm } => {
            let func = linearize_term(ctx, func, lhs);
            let argm = linearize_term(ctx, argm, lhs);
            Term::App { func, argm }
        }
        Term::Ctr { name, args } => {
            let mut new_args = Vec::with_capacity(args.len());
            for arg in args {
                let arg = linearize_term(ctx, arg, lhs);
                new_args.push(*arg);
            }
            Term::Ctr {
                name: name.clone(),
                args: new_args,
            }
        }
        Term::Fun { name, args } => {
            let mut new_args = Vec::with_capacity(args.len());
            for arg in args {
                let arg = linearize_term(ctx, arg, lhs);
                new_args.push(*arg);
            }
            Term::Fun {
                name: name.clone(),
                args: new_args,
            }
        }
        Term::Num { numb } => Term::Num { numb: *numb },
        Term::Op2 { oper, val0, val1 } => {
            let val0 = linearize_term(ctx, val0, lhs);
            let val1 = linearize_term(ctx, val1, lhs);
            Term::Op2 {
                oper: *oper,
                val0,
                val1,
            }
        }
    };
    Box::new(term)
}

// Linearize a term that is not part of a rule, so it doesn't need a shared context
pub fn linearize_term_independent(term: &Term) -> Box<Term> {
    linearize_term(&mut LinearizeCtx::new(), term, false)
}

pub fn rename_erased(ctx: &LinearizeCtx, name: &mut Name) {
    if ctx.uses.get(name).copied() <= Some(0) {
        *name = Name::NONE;
    }
}

// Duplicates all variables that are used more than once.
// The process is done generating auxiliary variables and
// applying dup on them.
pub fn dup_var(ctx: &mut LinearizeCtx, name: &Name, expr: Box<Term>, body: Box<Term>) -> Box<Term> {
    if let Some(amount) = ctx.uses.get(name).copied() {
        match amount {
            // if not used nothing is done
            0 => body,
            // if used once just make a let (lambda then app)
            1 => {
                let name = Name::from_str(&format!("{}.0", name)).unwrap(); // TODO: handle err
                let func = Box::new(Term::Lam { name, body: expr });
                let term = Term::App { func, argm: body };
                Box::new(term)
            }
            // if used more than once, duplicate
            _ => {
                let dup_times = amount - 1;
                let aux_amount = amount - 2; // quantity of aux variables
                let mut vars = vec![];
                // generate name for duplicated variables
                for i in (aux_amount..(dup_times * 2)).rev() {
                    let i = i - aux_amount; // moved to 0,1,..
                    let key = Name::from_str(&format!("{}.{}", name, i)).unwrap();
                    vars.push(key);
                }
                // generate name for aux variables
                for i in (0..aux_amount).rev() {
                    let key = Name::from_str(&format!("c.{}", i)).unwrap();
                    vars.push(key);
                }
                // use aux variables to duplicate the variable
                let term = Term::Dup {
                    nam0: vars.pop().unwrap(),
                    nam1: vars.pop().unwrap(),
                    expr,
                    body: dup_var_go(1, dup_times, body, &mut vars),
                };
                Box::new(term)
            }
        }
    } else {
        body
    }
}

// Recursive aux function to duplicate one variable
// an amount of times
fn dup_var_go(idx: u64, dup_times: u64, body: Box<Term>, vars: &mut Vec<Name>) -> Box<Term> {
    if idx == dup_times {
        body
    } else {
        let nam0 = vars.pop().unwrap();
        let nam1 = vars.pop().unwrap();
        let var_name = Name::from_str(&format!("c.{}", idx - 1)).unwrap();
        let expr = Box::new(Term::Var { name: var_name });
        let dup = Term::Dup {
            nam0,
            nam1,
            expr,
            body: dup_var_go(idx + 1, dup_times, body, vars),
        };
        Box::new(dup)
    }
}
