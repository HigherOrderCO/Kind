// TODO: linearize variables, adding dups
// TODO: U120?

use crate::language::{*};
use std::collections::HashSet;

pub fn to_kdl_term(term: &Comp) -> String {
  match term {
    Comp::Var { name } => {
      format!("{}", name)
    }
    Comp::Lam { name, body } => {
      let body = to_kdl_term(body);
      format!("@{} {}", name, body)
    }
    Comp::App { func, argm } => {
      let func = to_kdl_term(func);
      let argm = to_kdl_term(argm);
      format!("({} {})", func, argm)
    }
    Comp::Dup { nam0, nam1, expr, body } => {
      let expr = to_kdl_term(expr);
      let body = to_kdl_term(body);
      format!("dup {} {} = {}; {}", nam0, nam1, expr, body)
    }
    Comp::Let { name, expr, body } => {
      let expr = to_kdl_term(expr);
      let body = to_kdl_term(body);
      format!("let {} = {}; {}", name, expr, body)
    }
    Comp::Ctr { name, args } => {
      format!("{{{}{}}}", name, args.iter().map(|x| format!(" {}", to_kdl_term(x))).collect::<String>())
    }
    Comp::Fun { name, args } => {
      format!("({}{})", name, args.iter().map(|x| format!(" {}", to_kdl_term(x))).collect::<String>())
    }
    Comp::Num { numb } => {
      format!("#{}", numb)
    }
    Comp::Op2 { oper, val0, val1 } => {
      let oper = show_oper(&oper);
      let val0 = to_kdl_term(val0);
      let val1 = to_kdl_term(val1);
      format!("({} {} {})", oper, val0, val1)
    }
    Comp::Nil => {
      format!("#0")
    }
  }
}

pub fn to_kdl_oper(oper: &Oper) -> String {
  match oper {
    Oper::Add => format!("+"),
    Oper::Sub => format!("-"),
    Oper::Mul => format!("*"),
    Oper::Div => format!("/"),
    Oper::Mod => format!("%"),
    Oper::And => format!("&"),
    Oper::Or  => format!("|"),
    Oper::Xor => format!("^"),
    Oper::Shl => format!("<<"),
    Oper::Shr => format!(">>"),
    Oper::Ltn => format!("<"),
    Oper::Lte => format!("<="),
    Oper::Eql => format!("=="),
    Oper::Gte => format!(">="),
    Oper::Gtn => format!(">"),
    Oper::Neq => format!("!="),
  }
}

pub fn to_kdl_rule(book: &Book, rule: &Rule) -> String {
  let name = &rule.name;
  let entry = book.entrs.get(name).unwrap();
  let mut pats = vec![]; // stringified pattern args
  let mut vars = HashSet::new(); // rule pattern vars
  for (arg, pat) in entry.args.iter().zip(rule.pats.iter()) {
    if !arg.eras {
      let pat = erase(book, pat);
      pats.push(" ".to_string());
      pats.push(to_kdl_term(&pat));
      collect_lhs_vars(&pat, &mut vars);
    }
  }
  let mut body = erase(book, &rule.body);
  let mut fresh = 0;
  for mut var in vars.drain() {
    let original_var = var.clone();
    let uses = linearize_name(&mut body, &mut var, &mut fresh); // linearizes rule pattern vars
    // The &mut here doesn't do anything because
    // we're dropping var immediately afterwards.
    // To linearize rule variables, we'll have to replace all LHS occurrences by ~
    // if the amount of uses is zero
    if uses == 0 {
      for name in pats.iter_mut() {
        if &*name == &original_var {
          *name = String::from("~");
        }
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
  linearize(&mut body, &mut fresh); // linearizes internal bound vars
  format!("({}{}) = {}", name, pats.join(""), to_kdl_term(&body))
}

pub fn to_kdl_entry(book: &Book, entry: &Entry) -> String {
  let name = &entry.name;
  let mut args_typed = vec![];
  let mut args_names = vec![];
  for arg in &entry.args {
    args_typed.push(format!(" {}({}: {})", if arg.eras { "-" } else { "" }, arg.name, show_term(&arg.tipo)));
    args_names.push(format!(" {}", arg.name));
  }
  if entry.rules.len() > 0 {
    let mut rules = vec![];
    for rule in &entry.rules {
      rules.push(format!("\n  {}", to_kdl_rule(book, rule)));
    }
    return format!("// {}{} : {}\nfun ({}{}) {{{}\n}}\n\n", name, args_typed.join(""), show_term(&entry.tipo), name, args_names.join(""), rules.join(""));
  }
  return "".to_string();
}

pub fn to_kdl_book(book: &Book) -> String {
  let mut lines = vec![];
  for name in &book.names {
    lines.push(to_kdl_entry(book, book.entrs.get(name).unwrap()));
  }
  lines.join("")
}

// Utils
// -----

// Returns left-hand side variables
pub fn collect_lhs_vars(term: &Comp, vars: &mut HashSet<String>) {
  match term {
    Comp::Var { name } => {
      vars.insert(name.clone());
    }
    Comp::App { func, argm } => {
      collect_lhs_vars(func, vars);
      collect_lhs_vars(argm, vars);
    }
    Comp::Ctr { args, .. } => {
      for arg in args {
        collect_lhs_vars(arg, vars);
      }
    }
    Comp::Num { .. } => {}
    _ => { panic!("Invalid left-hand side."); }
  }
}
