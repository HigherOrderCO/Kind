use kind_tree::{
    backend::{File, Rule, Term},
    desugared,
};

pub fn compile_term(expr: &desugared::Expr) -> Box<Term> {
    use desugared::ExprKind::*;
    match &expr.data {
        Var(name) => Box::new(Term::Var {
            name: name.to_string(),
        }),
        Lambda(binder, body, _erased) => Box::new(Term::Lam {
            name: binder.to_string(),
            body: compile_term(body),
        }),
        App(head, spine) => spine.iter().fold(compile_term(head), |func, arg| {
            Box::new(Term::App {
                func,
                argm: compile_term(&arg.data),
            })
        }),
        Fun(head, spine) | Ctr(head, spine) => Box::new(Term::Ctr {
            name: head.to_string(),
            args: spine.iter().map(|x| compile_term(x)).collect(),
        }),
        Let(name, expr, body) => Box::new(Term::Let {
            name: name.to_string(),
            expr: compile_term(expr),
            body: compile_term(body),
        }),
        Ann(left, _) => compile_term(left),
        Sub(_, _, _, expr) => compile_term(expr),
        Num(kind_tree::Number::U60(numb)) => Box::new(Term::Num { numb: *numb }),
        Num(kind_tree::Number::U120(numb)) => {
            let hi = Box::new(Term::Num {
                numb: (numb >> 60) as u64,
            });
            let lo = Box::new(Term::Num {
                numb: (numb & 0xFFFFFFFFFFFFFFF) as u64,
            });
            Box::new(Term::Ctr {
                name: String::from("U120.new"),
                args: vec![hi, lo],
            })
        }
        Binary(op, l, r) => Box::new(Term::Ctr {
            name: op.to_string(),
            args: vec![compile_term(l), compile_term(r)],
        }),
        Hole(_) => unreachable!("Internal Error: 'Hole' cannot be a relevant term"),
        Typ => unreachable!("Internal Error: 'Typ' cannot be a relevant term"),
        NumType(typ) => unreachable!("Internal Error: '{:?}' cannot be a relevant term", typ),
        All(_, _, _) => unreachable!("Internal Error: 'All' cannot be a relevant term"),
        Str(_) => unreachable!("Internal Error: 'Str' cannot be a relevant term"),
        Hlp(_) => unreachable!("Internal Error: 'Hlp' cannot be a relevant term"),
        Err => unreachable!("Internal Error: 'Err' cannot be a relevant term"),
    }
}

pub fn compile_rule(rule: desugared::Rule) -> Rule {
    Rule {
        lhs: Box::new(Term::Ctr {
            name: rule.name.to_string(),
            args: rule.pats.iter().map(|x| compile_term(x)).collect(),
        }),
        rhs: compile_term(&rule.body),
    }
}

pub fn compile_entry(file: &mut File, entry: desugared::Entry) {
    for rule in entry.rules {
        file.rules.push(compile_rule(rule))
    }
}

pub fn compile_book(book: desugared::Book) -> File {
    let mut file = File {
        rules: Default::default(),
    };
    for (_, entry) in book.entrs {
        compile_entry(&mut file, *entry);
    }
    file
}
