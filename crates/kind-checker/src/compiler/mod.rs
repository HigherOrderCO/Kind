//! This module compiles all of the code to a format
//! that can run on the HVM and inside the checker.hvm
//! file.

use self::tags::EvalTag;
use self::tags::{operator_to_constructor, TermTag};

use hvm::syntax::Term;
use kind_span::Range;
use kind_tree::desugared::{self, Book, Expr};
use kind_tree::symbol::{Ident, QualifiedIdent};

use hvm::{syntax as lang, u60};

mod tags;

macro_rules! vec_preppend {
    ($($f:expr),*; $e:expr) => {
        vec![[$($f),*].as_slice(), $e.as_slice()].concat()
    };
}

/// Transforms the TermTag into EvalTag if it's quoted.
fn eval_ctr(quote: bool, head: TermTag) -> String {
    if quote {
        head.to_string()
    } else {
        match head {
            TermTag::Binary => EvalTag::Op.to_string(),
            TermTag::Let => EvalTag::Let.to_string(),
            TermTag::Ann => EvalTag::Ann.to_string(),
            TermTag::Sub => EvalTag::Sub.to_string(),
            TermTag::App => EvalTag::App.to_string(),
            other => other.to_string(),
        }
    }
}

// Helpers

/// Just lifts the spine into an `args` constructor that is useful
/// to avoid the arity limit of the type checker.
fn lift_spine(spine: Vec<Box<Term>>) -> Vec<Box<Term>> {
    if spine.len() > 16 {
        let mut start = spine[..2].to_vec();
        start.push(Box::new(Term::Ctr {
            name: format!("Kind.Term.args{}", spine.len() - 2),
            args: spine[2..].to_vec(),
        }));
        start
    } else {
        spine
    }
}

fn mk_lifted_ctr(head: String, spine: Vec<Box<Term>>) -> Box<Term> {
    let args = lift_spine(spine);
    Box::new(Term::Ctr { name: head, args })
}

fn mk_ctr(name: String, args: Vec<Box<Term>>) -> Box<Term> {
    Box::new(lang::Term::Ctr { name, args })
}

fn mk_var(ident: &str) -> Box<Term> {
    Box::new(Term::Var {
        name: ident.to_string(),
    })
}

fn mk_u60(numb: u64) -> Box<Term> {
    Box::new(Term::U6O {
        numb: u60::new(numb),
    })
}

fn mk_single_ctr(head: String) -> Box<Term> {
    Box::new(Term::Ctr {
        name: head,
        args: vec![],
    })
}

fn mk_ctr_name(ident: &QualifiedIdent) -> Box<Term> {
    // Adds an empty segment (so it just appends a dot in the end)
    mk_single_ctr(format!("{}.", ident))
}

fn mk_ctr_name_from_str(ident: &str) -> Box<Term> {
    // Adds an empty segment (so it just appends a dot in the end)
    mk_single_ctr(format!("{}.", ident))
}

fn range_to_num(range: Range) -> Box<Term> {
    Box::new(Term::U6O {
        numb: u60::new(range.encode().0),
    })
}

fn set_origin(ident: &Ident) -> Box<Term> {
    mk_lifted_ctr(
        "Kind.Term.set_origin".to_owned(),
        vec![range_to_num(ident.range), mk_var(ident.to_str())],
    )
}

fn lam(name: &Ident, body: Box<Term>) -> Box<Term> {
    Box::new(Term::Lam {
        name: name.to_string(),
        body,
    })
}

fn desugar_str(input: &str, range: Range) -> Box<desugared::Expr> {
    let nil = QualifiedIdent::new_static("String.nil", None, range);
    let cons = QualifiedIdent::new_static("String.cons", None, range);
    input
        .chars()
        .rfold(desugared::Expr::ctr(range, nil, vec![]), |right, chr| {
            desugared::Expr::ctr(
                range,
                cons.clone(),
                vec![desugared::Expr::num_u60(range, chr as u64), right],
            )
        })
}

fn codegen_str(input: &str) -> Box<Term> {
    input.chars().rfold(
        Box::new(Term::Ctr {
            name: "String.nil".to_string(),
            args: vec![],
        }),
        |right, chr| {
            Box::new(Term::Ctr {
                name: "String.cons".to_string(),
                args: vec![mk_u60(chr as u64), right],
            })
        },
    )
}

fn codegen_all_expr(
    lhs_rule: bool,
    lhs: bool,
    num: &mut usize,
    quote: bool,
    expr: &Expr,
) -> Box<Term> {
    use kind_tree::desugared::ExprKind::*;
    match &expr.data {
        Typ => mk_lifted_ctr(
            eval_ctr(quote, TermTag::Typ),
            vec![range_to_num(expr.range)],
        ),
        NumTypeU60 => mk_lifted_ctr(
            eval_ctr(quote, TermTag::U60),
            vec![range_to_num(expr.range)],
        ),
        NumTypeF60 => todo!(),
        Var { name } => {
            if quote && !lhs {
                set_origin(name)
            } else if lhs_rule {
                *num += 1;
                mk_lifted_ctr(
                    eval_ctr(quote, TermTag::Var),
                    vec![
                        range_to_num(expr.range),
                        mk_u60(name.encode()),
                        mk_u60((*num - 1) as u64),
                    ],
                )
            } else {
                mk_var(name.to_str())
            }
        }
        All {
            param,
            typ,
            body,
            erased: _,
        } => mk_lifted_ctr(
            eval_ctr(quote, TermTag::All),
            vec![
                range_to_num(expr.range),
                mk_u60(param.encode()),
                codegen_all_expr(lhs_rule, lhs, num, quote, typ),
                lam(param, codegen_all_expr(lhs_rule, lhs, num, quote, body)),
            ],
        ),
        Lambda {
            param,
            body,
            erased: _,
        } => mk_lifted_ctr(
            eval_ctr(quote, TermTag::Lambda),
            vec![
                range_to_num(expr.range),
                mk_u60(param.encode()),
                lam(param, codegen_all_expr(lhs_rule, lhs, num, quote, body)),
            ],
        ),
        App { fun, args } => args.iter().fold(
            codegen_all_expr(lhs_rule, lhs, num, quote, fun),
            |left, right| {
                mk_lifted_ctr(
                    eval_ctr(quote, TermTag::App),
                    vec![
                        range_to_num(expr.range),
                        left,
                        codegen_all_expr(lhs_rule, lhs, num, quote, &right.data),
                    ],
                )
            },
        ),
        Ctr { name, args } => mk_lifted_ctr(
            eval_ctr(quote, TermTag::Ctr(args.len())),
            vec_preppend![
                mk_ctr_name(name),
                if lhs { mk_var("orig") } else { range_to_num(expr.range) };
                args.iter().cloned().map(|x| codegen_all_expr(lhs_rule, lhs, num, quote, &x)).collect::<Vec<Box<Term>>>()
            ],
        ),
        Fun { name, args } => {
            let new_spine: Vec<Box<Term>> = args
                .iter()
                .cloned()
                .map(|x| codegen_all_expr(lhs_rule, lhs, num, quote, &x))
                .collect();
            if quote {
                mk_lifted_ctr(
                    eval_ctr(quote, TermTag::Fun(new_spine.len())),
                    vec_preppend![
                        mk_ctr_name(name),
                        range_to_num(expr.range);
                        new_spine
                    ],
                )
            } else {
                mk_ctr(
                    TermTag::HoasF(name.to_string()).to_string(),
                    vec_preppend![
                        range_to_num(expr.range);
                        new_spine
                    ],
                )
            }
        }
        Let { name, val, next } => mk_ctr(
            eval_ctr(quote, TermTag::Let),
            vec![
                range_to_num(expr.range),
                mk_u60(name.encode()),
                codegen_all_expr(lhs_rule, lhs, num, quote, val),
                lam(name, codegen_all_expr(lhs_rule, lhs, num, quote, next)),
            ],
        ),
        Ann { expr, typ } => mk_ctr(
            eval_ctr(quote, TermTag::Ann),
            vec![
                range_to_num(expr.range),
                codegen_all_expr(lhs_rule, lhs, num, quote, expr),
                codegen_all_expr(lhs_rule, lhs, num, quote, typ),
            ],
        ),
        Sub {
            name,
            indx,
            redx,
            expr,
        } => mk_ctr(
            eval_ctr(quote, TermTag::Sub),
            vec![
                range_to_num(expr.range),
                mk_u60(name.encode()),
                mk_u60(*indx as u64),
                mk_u60(*redx as u64),
                codegen_all_expr(lhs_rule, lhs, num, quote, expr),
            ],
        ),
        NumU60 { numb } => mk_lifted_ctr(
            eval_ctr(quote, TermTag::NUMU60),
            vec![range_to_num(expr.range), mk_u60(*numb)],
        ),
        NumF60 { numb: _ } => todo!(),
        Binary { op, left, right } => mk_lifted_ctr(
            eval_ctr(quote, TermTag::Binary),
            vec![
                range_to_num(expr.range),
                mk_single_ctr(operator_to_constructor(*op).to_owned()),
                codegen_all_expr(lhs_rule, lhs, num, quote, left),
                codegen_all_expr(lhs_rule, lhs, num, quote, right),
            ],
        ),
        Hole { num } => mk_lifted_ctr(
            eval_ctr(quote, TermTag::Hole),
            vec![range_to_num(expr.range), mk_u60(*num)],
        ),
        Str { val } => codegen_all_expr(lhs_rule, lhs, num, quote, &desugar_str(val, expr.range)),
        Hlp(_) => mk_lifted_ctr(
            eval_ctr(quote, TermTag::Hlp),
            vec![range_to_num(expr.range)],
        ),
        Err => panic!("Internal Error: Was not expecting an ERR node inside the HVM checker"),
    }
}

fn codegen_expr(quote: bool, expr: &Expr) -> Box<Term> {
    codegen_all_expr(false, false, &mut 0, quote, expr)
}

fn codegen_pattern(args: &mut usize, quote: bool, expr: &Expr) -> Box<Term> {
    codegen_all_expr(false, true, args, quote, expr)
}

fn codegen_type(args: &[desugared::Argument], typ: &desugared::Expr) -> Box<lang::Term> {
    if !args.is_empty() {
        let arg = &args[0];
        mk_lifted_ctr(
            eval_ctr(true, TermTag::All),
            vec![
                range_to_num(arg.range),
                mk_u60(arg.name.encode()),
                codegen_expr(true, &arg.typ),
                lam(&arg.name, codegen_type(&args[1..], typ)),
            ],
        )
    } else {
        codegen_expr(true, typ)
    }
}

fn codegen_vec<T>(exprs: T) -> Box<Term>
where
    T: Iterator<Item = Box<Term>>,
{
    exprs.fold(mk_ctr("List.nil".to_string(), vec![]), |left, right| {
        mk_ctr("List.cons".to_string(), vec![right, left])
    })
}

fn codegen_rule_end(file: &mut lang::File, rule: &desugared::Rule) {
    let base_vars = (0..rule.pats.len())
        .map(|x| mk_var(&format!("x{}", x)))
        .collect::<Vec<Box<lang::Term>>>();

    file.rules.push(lang::Rule {
        lhs: mk_ctr(
            TermTag::HoasQ(rule.name.to_string()).to_string(),
            vec_preppend![
                mk_var("orig");
                base_vars
            ],
        ),
        rhs: mk_lifted_ctr(
            eval_ctr(false, TermTag::Fun(base_vars.len())),
            vec_preppend![
                mk_ctr_name(&rule.name),
                mk_var("orig");
                base_vars
            ],
        ),
    });

    file.rules.push(lang::Rule {
        lhs: mk_ctr(
            TermTag::HoasF(rule.name.to_string()).to_string(),
            vec_preppend![
                mk_var("orig");
                base_vars
            ],
        ),
        rhs: mk_lifted_ctr(
            eval_ctr(false, TermTag::Fun(base_vars.len())),
            vec_preppend![
                mk_ctr_name(&rule.name),
                mk_var("orig");
                base_vars
            ],
        ),
    });
}

fn codegen_rule(file: &mut lang::File, rule: &desugared::Rule) {
    let mut count = 0;

    let lhs_args = rule
        .pats
        .iter()
        .map(|x| codegen_pattern(&mut count, false, x))
        .collect::<Vec<Box<Term>>>();

    file.rules.push(lang::Rule {
        lhs: mk_ctr(
            TermTag::HoasQ(rule.name.to_string()).to_string(),
            vec_preppend![
                mk_var("orig");
                lhs_args
            ],
        ),
        rhs: codegen_expr(true, &rule.body),
    });

    if rule.name.to_string().as_str() == "HVM.log" {
        file.rules.push(lang::Rule {
            lhs: mk_ctr(
                TermTag::HoasF(rule.name.to_string()).to_string(),
                vec![
                    mk_var("orig"),
                    mk_var("a"),
                    mk_var("r"),
                    mk_var("log"),
                    mk_var("ret"),
                ],
            ),
            rhs: mk_ctr(
                "HVM.put".to_owned(),
                vec![
                    mk_ctr("Kind.Term.show".to_owned(), vec![mk_var("log")]),
                    mk_var("ret"),
                ],
            ),
        });
    } else {
        file.rules.push(lang::Rule {
            lhs: mk_ctr(
                TermTag::HoasF(rule.name.to_string()).to_string(),
                vec_preppend![
                    mk_var("orig");
                    lhs_args
                ],
            ),
            rhs: codegen_expr(false, &rule.body),
        });
    }
}

fn codegen_entry_rules(
    count: &mut usize,
    index: usize,
    args: &mut Vec<Box<Term>>,
    entry: &desugared::Rule,
    pats: &[Box<desugared::Expr>],
) -> Box<Term> {
    if pats.is_empty() {
        mk_ctr(
            "Kind.Rule.rhs".to_owned(),
            vec![mk_ctr(
                format!("QT{}", index),
                vec_preppend![
                    mk_ctr_name(&entry.name),
                    range_to_num(entry.range);
                    args
                ],
            )],
        )
    } else {
        let pat = &pats[0];
        let expr = codegen_all_expr(true, false, count, false, pat);
        args.push(expr.clone());
        mk_ctr(
            "Kind.Rule.lhs".to_owned(),
            vec![
                expr,
                codegen_entry_rules(count, index + 1, args, entry, &pats[1..]),
            ],
        )
    }
}

fn codegen_entry(file: &mut lang::File, entry: &desugared::Entry) {
    file.rules.push(lang::Rule {
        lhs: mk_ctr("NameOf".to_owned(), vec![mk_ctr_name(&entry.name)]),
        rhs: codegen_str(entry.name.to_string().as_str()),
    });

    file.rules.push(lang::Rule {
        lhs: mk_ctr("HashOf".to_owned(), vec![mk_ctr_name(&entry.name)]),
        rhs: mk_u60(fxhash::hash64(entry.name.to_string().as_str())),
    });

    file.rules.push(lang::Rule {
        lhs: mk_ctr("TypeOf".to_owned(), vec![mk_ctr_name(&entry.name)]),
        rhs: codegen_type(&entry.args, &entry.typ),
    });

    let base_vars = (0..entry.args.len())
        .map(|x| mk_var(&format!("x{}", x)))
        .collect::<Vec<Box<lang::Term>>>();

    file.rules.push(lang::Rule {
        lhs: mk_lifted_ctr(
            format!("Kind.Term.FN{}", entry.args.len()),
            vec_preppend![
                mk_ctr_name(&entry.name),
                mk_var("orig");
                base_vars
            ],
        ),
        rhs: mk_ctr(
            TermTag::HoasF(entry.name.to_string()).to_string(),
            vec_preppend![
                mk_var("orig");
                base_vars
            ],
        ),
    });

    file.rules.push(lang::Rule {
        lhs: mk_ctr(
            format!("QT{}", entry.args.len()),
            vec_preppend![
                mk_ctr_name(&entry.name),
                mk_var("orig");
                base_vars
            ],
        ),
        rhs: mk_ctr(
            TermTag::HoasQ(entry.name.to_string()).to_string(),
            vec_preppend![
                mk_var("orig");
                base_vars
            ],
        ),
    });

    for rule in &entry.rules {
        codegen_rule(file, rule);
    }

    if !entry.rules.is_empty() {
        codegen_rule_end(file, &entry.rules[0])
    }

    let rules = entry
        .rules
        .iter()
        .map(|rule| codegen_entry_rules(&mut 0, 0, &mut Vec::new(), rule, &rule.pats));

    file.rules.push(lang::Rule {
        lhs: mk_ctr("RuleOf".to_owned(), vec![mk_ctr_name(&entry.name)]),
        rhs: codegen_vec(rules),
    });
}

/// Compiles a book into an format that is executed by the
/// type checker in HVM.
pub fn codegen_book(book: &Book, functions_to_check: Vec<String>) -> lang::File {
    let mut file = lang::File {
        rules: vec![],
        smaps: vec![],
    };

    let functions_entry = lang::Rule {
        lhs: mk_ctr("Functions".to_owned(), vec![]),
        rhs: codegen_vec(functions_to_check.iter().map(|x| mk_ctr_name_from_str(x))),
    };

    for entry in book.entrs.values() {
        codegen_entry(&mut file, entry)
    }

    file.rules.push(functions_entry);

    file.rules.push(lang::Rule {
        lhs: mk_ctr("HoleInit".to_owned(), vec![]),
        rhs: mk_u60(book.holes),
    });

    for rule in &file.rules {
        match &*rule.lhs {
            Term::Ctr { name, args } => {
                file.smaps.push((name.clone(), vec![false; args.len()]));
            }
            _ => todo!(),
        }
    }

    file
}
