use crate::book::name::Ident;
use crate::book::span::Span;
use crate::book::term::{Operator, Term};
use crate::book::{Argument, Book, Entry, Rule};

pub fn to_checker_oper(oper: &Operator) -> String {
    match oper {
        Operator::Add => "Kind.Operator.add".to_string(),
        Operator::Sub => "Kind.Operator.sub".to_string(),
        Operator::Mul => "Kind.Operator.mul".to_string(),
        Operator::Div => "Kind.Operator.div".to_string(),
        Operator::Mod => "Kind.Operator.mod".to_string(),
        Operator::And => "Kind.Operator.and".to_string(),
        Operator::Or => "Kind.Operator.or".to_string(),
        Operator::Xor => "Kind.Operator.xor".to_string(),
        Operator::Shl => "Kind.Operator.shl".to_string(),
        Operator::Shr => "Kind.Operator.shr".to_string(),
        Operator::Ltn => "Kind.Operator.ltn".to_string(),
        Operator::Lte => "Kind.Operator.lte".to_string(),
        Operator::Eql => "Kind.Operator.eql".to_string(),
        Operator::Gte => "Kind.Operator.gte".to_string(),
        Operator::Gtn => "Kind.Operator.gtn".to_string(),
        Operator::Neq => "Kind.Operator.neq".to_string(),
    }
}

fn hide_orig(orig: &Span, lhs: bool) -> String {
    if lhs {
        "orig".to_string()
    } else {
        format!("{}", orig.encode())
    }
}

pub fn to_checker_term(term: &Term, quote: bool, lhs: bool) -> String {
    match term {
        Term::Typ { orig } => {
            format!("(Kind.Term.typ {})", hide_orig(orig, lhs))
        }
        Term::Var { orig, name } => {
            if lhs {
                format!("{}", name)
            } else {
                if quote {
                    format!("(Kind.Term.set_origin {} {})", orig.encode(), name.clone())
                } else {
                    format!("{}", name.clone()) // spaces to align with quoted version
                }
            }
        }
        Term::All {
            orig,
            name,
            tipo,
            body,
        } => {
            format!(
                "(Kind.Term.all {} {} {} λ{} {})",
                hide_orig(orig, lhs),
                name.encode(),
                to_checker_term(tipo, quote, lhs),
                name,
                to_checker_term(body, quote, lhs)
            )
        }
        Term::Lam { orig, name, body } => {
            format!(
                "(Kind.Term.lam {} {} λ{} {})",
                hide_orig(orig, lhs),
                name.encode(),
                name,
                to_checker_term(body, quote, lhs)
            )
        }
        Term::App { orig, func, argm } => {
            format!(
                "({} {} {} {})",
                if quote {
                    "Kind.Term.app"
                } else {
                    "Kind.Term.eval_app"
                },
                hide_orig(orig, lhs),
                to_checker_term(func, quote, lhs),
                to_checker_term(argm, quote, lhs)
            )
        }
        Term::Let {
            orig,
            name,
            expr,
            body,
        } => {
            format!(
                "({} {} {} {} λ{} {})",
                if quote {
                    "Kind.Term.let"
                } else {
                    "Kind.Term.eval_let"
                },
                hide_orig(orig, lhs),
                name.encode(),
                to_checker_term(expr, quote, lhs),
                name,
                to_checker_term(body, quote, lhs)
            )
        }
        Term::Ann { orig, expr, tipo } => {
            format!(
                "({} {} {} {})",
                if quote {
                    "Kind.Term.ann"
                } else {
                    "Kind.Term.eval_ann"
                },
                hide_orig(orig, lhs),
                to_checker_term(expr, quote, lhs),
                to_checker_term(tipo, quote, lhs)
            )
        }
        Term::Sub {
            orig,
            expr,
            name,
            indx,
            redx,
        } => {
            format!(
                "({} {} {} {} {} {})",
                if quote {
                    "Kind.Term.sub"
                } else {
                    "Kind.Term.eval_sub"
                },
                hide_orig(orig, lhs),
                name.encode(),
                indx,
                redx,
                to_checker_term(expr, quote, lhs)
            )
        }
        Term::Ctr { orig, name, args } => {
            let mut args_strs: Vec<String> = Vec::new();
            for arg in args {
                args_strs.push(format!(" {}", to_checker_term(arg, quote, lhs)));
            }
            if args.len() >= 15 {
                format!(
                    "(Kind.Term.ct{} {}. {} (Kind.Term.args{}{}))",
                    args.len(),
                    name,
                    hide_orig(orig, lhs),
                    args.len(),
                    args_strs.join("")
                )
            } else {
                format!(
                    "(Kind.Term.ct{} {}. {}{})",
                    args.len(),
                    name,
                    hide_orig(orig, lhs),
                    args_strs.join("")
                )
            }
        }
        Term::Fun { orig, name, args } => {
            let mut args_strs: Vec<String> = Vec::new();
            for arg in args {
                args_strs.push(format!(" {}", to_checker_term(arg, quote, lhs)));
            }
            if quote {
                if args.len() >= 15 {
                    format!(
                        "(Kind.Term.fn{} {}. {}(Kind.Term.args{} {}))",
                        args.len(),
                        name,
                        hide_orig(orig, lhs),
                        args.len(),
                        args_strs.join("")
                    )
                } else {
                    format!(
                        "(Kind.Term.fn{} {}. {}{})",
                        args.len(),
                        name,
                        hide_orig(orig, lhs),
                        args_strs.join("")
                    )
                }
            } else {
                format!(
                    "(F${} {}{})",
                    name,
                    hide_orig(orig, lhs),
                    args_strs.join("")
                )
            }
        }
        Term::Hlp { orig } => {
            format!("(Kind.Term.hlp {})", hide_orig(orig, lhs))
        }
        Term::U60 { orig } => {
            format!("(Kind.Term.u60 {})", hide_orig(orig, lhs))
        }
        Term::Num { orig, numb } => {
            format!("(Kind.Term.num {} {})", hide_orig(orig, lhs), numb)
        }
        Term::Op2 {
            orig,
            oper,
            val0,
            val1,
        } => {
            format!(
                "({} {} {} {} {})",
                if quote {
                    "Kind.Term.op2"
                } else {
                    "Kind.Term.eval_op"
                },
                hide_orig(orig, lhs),
                to_checker_oper(oper),
                to_checker_term(val0, quote, lhs),
                to_checker_term(val1, quote, lhs)
            )
        }
        Term::Hol { orig, numb } => {
            format!("(Kind.Term.hol {} {})", orig.encode(), numb)
        }
        Term::Mat { .. } => {
            panic!("Internal error: Mat cannot be compiled to a checker because it should be removed in the adjust phase!");
        }
    }
}

fn to_checker_rule_chk(
    rule: &Rule,
    index: usize,
    vars: &mut u64,
    args: &mut Vec<String>,
) -> String {
    if index < rule.pats.len() {
        let (inp_patt_str, var_patt_str) = to_checker_patt_chk(&rule.pats[index], vars);
        args.push(var_patt_str);
        let head = inp_patt_str;
        let tail = to_checker_rule_chk(rule, index + 1, vars, args);
        return format!("(Kind.Rule.lhs {} {})", head, tail);
    } else {
        return format!(
            "(Kind.Rule.rhs (QT{} {}. 0{}))",
            index,
            rule.name,
            args.iter()
                .map(|x| format!(" {}", x))
                .collect::<Vec<String>>()
                .join("")
        );
    }
}

fn to_checker_patt_chk(patt: &Term, vars: &mut u64) -> (String, String) {
    // FIXME: remove redundancy
    match patt {
        Term::Var { orig, name } => {
            let inp = format!(
                "(Kind.Term.var {} {} {})",
                orig.encode(),
                name.encode(),
                vars
            );
            let var = format!(
                "(Kind.Term.var {} {} {})",
                orig.encode(),
                name.encode(),
                vars
            );
            *vars += 1;
            return (inp, var);
        }
        Term::Ctr { orig, name, args } => {
            let mut inp_args_str = String::new();
            let mut var_args_str = String::new();
            for arg in args {
                let (inp_arg_str, var_arg_str) = to_checker_patt_chk(arg, vars);
                inp_args_str.push_str(&format!(" {}", inp_arg_str));
                var_args_str.push_str(&format!(" {}", var_arg_str));
            }
            if args.len() >= 15 {
                let inp_str = format!(
                    "(Kind.Term.ct{} {}. {} (Kind.Term.args{}{}))",
                    args.len(),
                    name,
                    orig.encode(),
                    args.len(),
                    inp_args_str
                );
                let var_str = format!(
                    "(Kind.Term.ct{} {}. {} (Kind.Term.args{}{}))",
                    args.len(),
                    name,
                    orig.encode(),
                    args.len(),
                    var_args_str
                );
                return (inp_str, var_str);
            } else {
                let inp_str = format!(
                    "(Kind.Term.ct{} {}. {}{})",
                    args.len(),
                    name,
                    orig.encode(),
                    inp_args_str
                );
                let var_str = format!(
                    "(Kind.Term.ct{} {}. {}{})",
                    args.len(),
                    name,
                    orig.encode(),
                    var_args_str
                );
                return (inp_str, var_str);
            }
        }
        Term::Num { orig, numb } => {
            let inp = format!("(Kind.Term.num {} {})", orig.encode(), numb);
            let var = format!("(Kind.Term.num {} {})", orig.encode(), numb);
            return (inp, var);
        }
        _ => {
            // TODO: This should return a proper error instead of panicking
            panic!("Invalid left-hand side pattern: {}", patt);
        }
    }
}

fn to_checker_rule_end(name: &Ident, size: u64) -> String {
    let mut vars = vec![];
    for idx in 0..size {
        vars.push(format!(" x{}", idx));
    }
    let mut text = String::new();

    if size >= 15 {
        text.push_str(&format!(
            "(Q${} orig{}) = (Kind.Term.fn{} {}. orig (Kind.Term.args{}{}))\n",
            name,
            vars.join(""),
            size,
            name,
            size,
            vars.join("")
        ));
        text.push_str(&format!(
            "(F${} orig{}) = (Kind.Term.fn{} {}. orig (Kind.Term.args{}{}))\n",
            name,
            vars.join(""),
            size,
            name,
            size,
            vars.join("")
        ));
    } else {
        text.push_str(&format!(
            "(Q${} orig{}) = (Kind.Term.fn{} {}. orig{})\n",
            name,
            vars.join(""),
            size,
            name,
            vars.join("")
        ));
        text.push_str(&format!(
            "(F${} orig{}) = (Kind.Term.fn{} {}. orig{})\n",
            name,
            vars.join(""),
            size,
            name,
            vars.join("")
        ));
    }

    return text;
}

fn to_checker_type(args: &Vec<Box<Argument>>, tipo: &Box<Term>, index: usize) -> String {
    if index < args.len() {
        let arg = &args[index];
        format!(
            "(Kind.Term.all {} {} {} λ{} {})",
            0,
            arg.name.encode(),
            to_checker_term(&arg.tipo, true, false),
            arg.name,
            to_checker_type(args, tipo, index + 1)
        )
    } else {
        to_checker_term(tipo, true, false)
    }
}

fn to_checker_rule(rule: &Rule) -> String {
    let mut pats = vec![];
    for pat in &rule.pats {
        pats.push(format!(" {}", to_checker_term(pat, false, true)));
    }
    let body_rhs = to_checker_term(&rule.body, true, false);
    let rule_rhs = to_checker_term(&rule.body, false, false);
    let mut text = String::new();
    text.push_str(&format!(
        "(Q${} orig{}) = {}\n",
        rule.name,
        pats.join(""),
        body_rhs
    ));
    if rule.name.0 == "HVM.log" {
        text.push_str(&format!(
            "(F$HVM.log orig a r log ret) = (HVM.put (Kind.Term.show log) ret)"
        ));
    } else {
        text.push_str(&format!(
            "(F${} orig{}) = {}\n",
            rule.name,
            pats.join(""),
            rule_rhs
        ));
    }

    //for size in 0 .. 9 {
    //let mut vars = vec![];
    //for idx in 0 .. size {
    //vars.push(format!(" x{}", idx));
    //}
    //result.push_str(&format!("(QT{} name orig{}) = (Fn{} name orig{})\n", size, vars.join(""), size, vars.join("")));
    //result.push_str(&format!("(FN{} name orig{}) = (Fn{} name orig{})\n", size, vars.join(""), size, vars.join("")));
    //}

    return text;
}

pub fn to_checker_entry(entry: &Entry) -> String {
    let mut result = String::new();
    result.push_str(&format!("(NameOf {}.) = \"{}\"\n", entry.name, entry.name));
    result.push_str(&format!("(HashOf {}.) = %{}\n", entry.name, entry.name));
    result.push_str(&format!(
        "(TypeOf {}.) = {}\n",
        entry.name,
        to_checker_type(&entry.args, &entry.tipo, 0)
    ));

    let base_vars = (0..entry.args.len())
        .map(|x| format!(" x{}", x))
        .collect::<Vec<String>>()
        .join("");

    if entry.args.len() >= 15 {
        result.push_str(&format!(
            "(Kind.Term.FN{} {}. orig (Kind.Term.args{}{})) = (F${} orig{})\n",
            entry.args.len(),
            entry.name,
            entry.args.len(),
            base_vars,
            entry.name,
            base_vars
        ));
    } else {
        result.push_str(&format!(
            "(Kind.Term.FN{} {}. orig{}) = (F${} orig{})\n",
            entry.args.len(),
            entry.name,
            base_vars,
            entry.name,
            base_vars
        ));
    }

    result.push_str(&format!(
        "(QT{} {}. orig{}) = (Q${} orig{})\n",
        entry.args.len(),
        entry.name,
        base_vars,
        entry.name,
        base_vars
    ));

    for rule in &entry.rules {
        result.push_str(&to_checker_rule(&rule));
    }
    if entry.rules.len() > 0 {
        result.push_str(&to_checker_rule_end(
            &entry.name,
            entry.rules[0].pats.len() as u64,
        ));
    }
    result.push_str(&format!("(RuleOf {}.) =", entry.name));
    for rule in &entry.rules {
        result.push_str(&format!(
            " (List.cons {}",
            to_checker_rule_chk(&rule, 0, &mut 0, &mut vec![])
        ));
    }
    result.push_str(&format!(" List.nil{}", ")".repeat(entry.rules.len())));
    return result;
}

pub fn to_checker_book(book: &Book) -> String {
    let mut result = String::new();
    result.push_str(&format!(
        "// NOTE: functions with names starting with 'F$' are evaluated differently by the\n"
    ));
    result.push_str(&format!(
        "// HVM, as a specific optimization targetting Kind2. See 'HOAS_OPT' on HVM's code.\n\n"
    ));
    result.push_str(&format!("Functions =\n"));
    result.push_str(&format!("  let fns = List.nil\n"));
    for name in &book.names {
        let entry = book.entrs.get(&Ident(name.to_string())).unwrap();
        result.push_str(&format!("  let fns = (List.cons {}. fns)\n", entry.name));
    }
    result.push_str(&format!("  fns\n\n"));
    for name in &book.names {
        let entry = book.entrs.get(&Ident(name.to_string())).unwrap();
        result.push_str(&format!("\n// {}", name));
        result.push_str(&format!("\n// {}\n", "-".repeat(name.len())));
        result.push_str(&format!("\n"));
        result.push_str(&to_checker_entry(&entry));
        result.push_str(&format!("\n"));
    }
    return result;
}
