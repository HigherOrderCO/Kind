use crate::book::name::Ident;
use crate::book::span::Span;
use crate::book::term::{Operator, Term};
use crate::book::{Argument, Book, Entry, Rule};

use std::fmt::Write;

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
            } else if quote {
                format!("(Kind.Term.set_origin {} {})", orig.encode(), name.clone())
            } else {
                format!("{}", name.clone()) // spaces to align with quoted version
            }
        }
        Term::All { orig, name, tipo, body } => {
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
            format!("(Kind.Term.lam {} {} λ{} {})", hide_orig(orig, lhs), name.encode(), name, to_checker_term(body, quote, lhs))
        }
        Term::App { orig, func, argm } => {
            format!(
                "({} {} {} {})",
                if quote { "Kind.Term.app" } else { "Kind.Term.eval_app" },
                hide_orig(orig, lhs),
                to_checker_term(func, quote, lhs),
                to_checker_term(argm, quote, lhs)
            )
        }
        Term::Let { orig, name, expr, body } => {
            format!(
                "({} {} {} {} λ{} {})",
                if quote { "Kind.Term.let" } else { "Kind.Term.eval_let" },
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
                if quote { "Kind.Term.ann" } else { "Kind.Term.eval_ann" },
                hide_orig(orig, lhs),
                to_checker_term(expr, quote, lhs),
                to_checker_term(tipo, quote, lhs)
            )
        }
        Term::Sub { orig, expr, name, indx, redx } => {
            format!(
                "({} {} {} {} {} {})",
                if quote { "Kind.Term.sub" } else { "Kind.Term.eval_sub" },
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
                format!("(Kind.Term.ct{} {}. {}{})", args.len(), name, hide_orig(orig, lhs), args_strs.join(""))
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
                    format!("(Kind.Term.fn{} {}. {}{})", args.len(), name, hide_orig(orig, lhs), args_strs.join(""))
                }
            } else {
                format!("(F${} {}{})", name, hide_orig(orig, lhs), args_strs.join(""))
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
        Term::Op2 { orig, oper, val0, val1 } => {
            format!(
                "({} {} {} {} {})",
                if quote { "Kind.Term.op2" } else { "Kind.Term.eval_op" },
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

fn to_checker_rule_chk(rule: &Rule, index: usize, vars: &mut u64, args: &mut Vec<String>) -> String {
    if index < rule.pats.len() {
        let (inp_patt_str, var_patt_str) = to_checker_patt_chk(&rule.pats[index], vars);
        args.push(var_patt_str);
        let head = inp_patt_str;
        let tail = to_checker_rule_chk(rule, index + 1, vars, args);
        format!("(Kind.Rule.lhs {} {})", head, tail)
    } else {
        format!(
            "(Kind.Rule.rhs (QT{} {}. 0{}))",
            index,
            rule.name,
            args.iter().map(|x| format!(" {}", x)).collect::<Vec<String>>().join("")
        )
    }
}

fn to_checker_patt_chk(patt: &Term, vars: &mut u64) -> (String, String) {
    // FIXME: remove redundancy
    match patt {
        Term::Var { orig, name } => {
            let inp = format!("(Kind.Term.var {} {} {})", orig.encode(), name.encode(), vars);
            let var = format!("(Kind.Term.var {} {} {})", orig.encode(), name.encode(), vars);
            *vars += 1;
            (inp, var)
        }
        Term::Ctr { orig, name, args } => {
            let mut inp_args_str = String::new();
            let mut var_args_str = String::new();
            for arg in args {
                let (inp_arg_str, var_arg_str) = to_checker_patt_chk(arg, vars);
                write!(inp_args_str, " {}", inp_arg_str).ok();
                write!(var_args_str, " {}", var_arg_str).ok();
            }
            if args.len() >= 15 {
                let inp_str = format!("(Kind.Term.ct{} {}. {} (Kind.Term.args{}{}))", args.len(), name, orig.encode(), args.len(), inp_args_str);
                let var_str = format!("(Kind.Term.ct{} {}. {} (Kind.Term.args{}{}))", args.len(), name, orig.encode(), args.len(), var_args_str);
                (inp_str, var_str)
            } else {
                let inp_str = format!("(Kind.Term.ct{} {}. {}{})", args.len(), name, orig.encode(), inp_args_str);
                let var_str = format!("(Kind.Term.ct{} {}. {}{})", args.len(), name, orig.encode(), var_args_str);
                (inp_str, var_str)
            }
        }
        Term::Num { orig, numb } => {
            let inp = format!("(Kind.Term.num {} {})", orig.encode(), numb);
            let var = format!("(Kind.Term.num {} {})", orig.encode(), numb);
            (inp, var)
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
        writeln!(
            text,
            "(Q${} orig{}) = (Kind.Term.fn{} {}. orig (Kind.Term.args{}{}))",
            name,
            vars.join(""),
            size,
            name,
            size,
            vars.join("")
        )
        .ok();
        writeln!(
            text,
            "(F${} orig{}) = (Kind.Term.fn{} {}. orig (Kind.Term.args{}{}))",
            name,
            vars.join(""),
            size,
            name,
            size,
            vars.join("")
        )
        .ok();
    } else {
        writeln!(text, "(Q${} orig{}) = (Kind.Term.fn{} {}. orig{})", name, vars.join(""), size, name, vars.join("")).ok();
        writeln!(text, "(F${} orig{}) = (Kind.Term.fn{} {}. orig{})", name, vars.join(""), size, name, vars.join("")).ok();
    }

    text
}

fn to_checker_type(args: &Vec<Box<Argument>>, tipo: &Term, index: usize) -> String {
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
    writeln!(text, "(Q${} orig{}) = {}", rule.name, pats.join(""), body_rhs).ok();
    if rule.name.0 == "HVM.log" {
        write!(text, "(F$HVM.log orig a r log ret) = (HVM.put (Kind.Term.show log) ret)").ok();
    } else {
        writeln!(text, "(F${} orig{}) = {}", rule.name, pats.join(""), rule_rhs).ok();
    }

    //for size in 0 .. 9 {
    //let mut vars = vec![];
    //for idx in 0 .. size {
    //vars.push(format!(" x{}", idx));
    //}
    //write!(result,"(QT{} name orig{}) = (Fn{} name orig{})\n", size, vars.join(""), size, vars.join(""));
    //write!(result,"(FN{} name orig{}) = (Fn{} name orig{})\n", size, vars.join(""), size, vars.join(""));
    //}

    text
}

pub fn to_checker_entry(entry: &Entry) -> String {
    let mut result = String::new();
    writeln!(result, "(NameOf {}.) = \"{}\"", entry.name, entry.name).ok();
    writeln!(result, "(HashOf {}.) = %{}", entry.name, entry.name).ok();
    writeln!(result, "(TypeOf {}.) = {}", entry.name, to_checker_type(&entry.args, &entry.tipo, 0)).ok();

    let base_vars = (0..entry.args.len()).map(|x| format!(" x{}", x)).collect::<Vec<String>>().join("");

    if entry.args.len() >= 15 {
        writeln!(
            result,
            "(Kind.Term.FN{} {}. orig (Kind.Term.args{}{})) = (F${} orig{})",
            entry.args.len(),
            entry.name,
            entry.args.len(),
            base_vars,
            entry.name,
            base_vars
        )
        .ok();
    } else {
        writeln!(
            result,
            "(Kind.Term.FN{} {}. orig{}) = (F${} orig{})",
            entry.args.len(),
            entry.name,
            base_vars,
            entry.name,
            base_vars
        )
        .ok();
    }

    writeln!(result, "(QT{} {}. orig{}) = (Q${} orig{})", entry.args.len(), entry.name, base_vars, entry.name, base_vars).ok();

    for rule in &entry.rules {
        write!(result, "{}", &to_checker_rule(rule)).ok();
    }
    if !entry.rules.is_empty() {
        write!(result, "{}", &to_checker_rule_end(&entry.name, entry.rules[0].pats.len() as u64,)).ok();
    }
    write!(result, "(RuleOf {}.) =", entry.name).ok();
    for rule in &entry.rules {
        write!(result, " (List.cons {}", to_checker_rule_chk(rule, 0, &mut 0, &mut vec![])).ok();
    }
    write!(result, " List.nil{}", ")".repeat(entry.rules.len())).ok();
    result
}

// Vendo oq da pra fazer pra
pub fn to_checker_book(book: &Book) -> String {
    let mut result = String::new();
    writeln!(result, "// NOTE: functions with names starting with 'F$' are evaluated differently by the").ok();
    writeln!(result, "// HVM, as a specific optimization targetting Kind2. See 'HOAS_OPT' on HVM's code.\n").ok();
    writeln!(result, "Functions =").ok();
    writeln!(result, "  let fns = List.nil").ok();
    for name in &book.names {
        let entry = book.entrs.get(&Ident(name.to_string())).unwrap();
        writeln!(result, "  let fns = (List.cons {}. fns)", entry.name).ok();
    }
    result.push_str("  fns\n\n");
    for name in &book.names {
        let entry = book.entrs.get(&Ident(name.to_string())).unwrap();
        write!(result, "\n// {}", name).ok();
        writeln!(result, "\n// {}", "-".repeat(name.len())).ok();
        writeln!(result).ok();
        write!(result, "{}", &to_checker_entry(entry)).ok();
        writeln!(result).ok();
    }
    write!(result, "HoleInit = {}", book.holes).ok();
    result
}
