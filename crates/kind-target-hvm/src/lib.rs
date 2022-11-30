use hvm::u60;

use kind_tree::{
    backend::{File, Rule, Term},
    untyped,
};

pub fn compile_book(book: untyped::Book, trace: bool) -> File {
    let mut file = File {
        rules: Default::default(),
        smaps: Default::default(),
    };
    for (_, entry) in book.entrs {
        compile_entry(&mut file, entry, trace);
    }
    file
}

pub fn compile_str(val: &str) -> Box<Term> {
    let nil = Box::new(Term::Ctr {
        name: String::from("String.nil"),
        args: vec![],
    });

    let cons = |numb, next| {
        Box::new(Term::Ctr {
            name: String::from("String.cons"),
            args: vec![Box::new(Term::U6O { numb }), next],
        })
    };

    val.chars().rfold(nil, |rest, chr| cons(chr as u64, rest))
}

pub fn compile_term(expr: &untyped::Expr) -> Box<Term> {
    use untyped::ExprKind::*;
    match &expr.data {
        Var { name } => Box::new(Term::Var {
            name: name.to_string(),
        }),
        Lambda { param, body, .. } => Box::new(Term::Lam {
            name: param.to_string(),
            body: compile_term(body),
        }),
        App { fun, args } => args.iter().fold(compile_term(fun), |func, arg| {
            Box::new(Term::App {
                func,
                argm: compile_term(arg),
            })
        }),
        Fun { name, args } | Ctr { name, args } => Box::new(Term::Ctr {
            name: name.to_string(),
            args: args.iter().map(|x| compile_term(x)).collect(),
        }),
        Let { name, val, next } => Box::new(Term::Let {
            name: name.to_string(),
            expr: compile_term(val),
            body: compile_term(next),
        }),
        U60 { numb } => Box::new(Term::U6O {
            numb: u60::new(*numb),
        }),
        F60 { numb: _ } => todo!(),
        Binary { op, left, right } => Box::new(Term::Ctr {
            name: op.to_string(),
            args: vec![compile_term(left), compile_term(right)],
        }),
        Str { val } => compile_str(val),
        Err => unreachable!("Internal Error: 'ERR' cannot be a relevant term"),
    }
}

fn compile_rule(name: String, rule: untyped::Rule) -> Rule {
    Rule {
        lhs: Box::new(Term::Ctr {
            name,
            args: rule.pats.iter().map(|x| compile_term(x)).collect(),
        }),
        rhs: compile_term(&rule.body),
    }
}

fn compile_entry(file: &mut File, entry: Box<untyped::Entry>, trace: bool) {
    if entry.attrs.trace.is_some() || trace {
        let _with_args = entry.attrs.trace.unwrap_or(false);

        let name_trace = format!("{}__trace", entry.name);
        for rule in entry.rules {
            file.rules.push(compile_rule(name_trace.clone(), rule))
        }

        let args = entry
            .args
            .iter()
            .enumerate()
            .map(|(i, x)| {
                Box::new(Term::Var {
                    name: format!("_{}{}", i, x.0.clone()),
                })
            })
            .collect::<Vec<_>>();

        file.rules.push(Rule {
            lhs: Box::new(Term::Ctr {
                name: entry.name.to_string(),
                args: args.clone(),
            }),
            rhs: Box::new(Term::Ctr {
                name: "HVM.log".to_string(),
                args: vec![
                    compile_str(entry.name.to_str()),
                    Box::new(Term::Ctr {
                        name: name_trace,
                        args,
                    }),
                ],
            }),
        })
    } else {
        let name = entry.name.to_string();
        for rule in entry.rules {
            file.rules.push(compile_rule(name.clone(), rule))
        }
    }
}
