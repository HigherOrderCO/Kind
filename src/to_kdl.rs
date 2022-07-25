// TODO: linearize variables, adding dups
// TODO: U120?

use crate::language::{*};

pub fn to_kdl_term(book: &Book, term: &Term) -> String {
  match term {
    Term::Typ { .. } => {
      format!("Type")
    }
    Term::Var { orig: _, name } => {
      format!("{}", name)
    }
    Term::Lam { orig: _, name, body } => {
      let body = to_kdl_term(book, body);
      format!("@{} {}", name, body)
    }
    Term::App { orig: _, func, argm } => {
      let mut args = vec![argm];
      let mut expr = func;
      while let Term::App { orig: _, func, argm } = &**expr {
        args.push(argm);
        expr = func;
      }
      args.reverse();
      format!("({} {})", to_kdl_term(book, expr), args.iter().map(|x| to_kdl_term(book, x)).collect::<Vec<String>>().join(" "))
    }
    Term::All { orig: _, name, tipo, body } => {
      let body = to_kdl_term(book, body);
      format!("#0")
    }
    Term::Let { orig: _, name, expr, body } => {
      let expr = to_kdl_term(book, expr);
      let body = to_kdl_term(book, body);
      format!("let {} = {}; {}", name, expr, body)
    }
    Term::Ann { orig: _, expr, tipo: _ } => {
      let expr = to_kdl_term(book, expr);
      format!("{}", expr)
    }
    Term::Ctr { orig: _, name, args } => {
      let entr = book.entrs.get(name).unwrap();
      let args = args.iter().enumerate().filter(|(i,x)| !entr.args[*i].eras).map(|x| &**x.1).collect::<Vec<&Term>>();
      format!("({}{})", name, args.iter().map(|x| format!(" {}", to_kdl_term(book, x))).collect::<String>())
    }
    Term::Fun { orig: _, name, args } => {
      let entr = book.entrs.get(name).unwrap();
      let args = args.iter().enumerate().filter(|(i,x)| !entr.args[*i].eras).map(|x| &**x.1).collect::<Vec<&Term>>();
      format!("({}{})", name, args.iter().map(|x| format!(" {}", to_kdl_term(book, x))).collect::<String>())
    }
    Term::Hlp { orig: _ } => {
      format!("#0")
    }
    Term::U60 { orig: _ } => {
      format!("#0")
    }
    Term::Num { orig: _, numb } => {
      format!("#{}", numb)
    }
    Term::Op2 { orig: _, oper, val0, val1 } => {
      let val0 = to_kdl_term(book, val0);
      let val1 = to_kdl_term(book, val1);
      format!("({} {} {})", show_oper(&oper), val0, val1)
    }
    Term::Hol { orig: _, numb } => {
      format!("_")
    }
    Term::Mat { .. } => {
      panic!("Internal error."); // removed after adjust()
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
  let mut pats = vec![];
  for (arg,pat) in entry.args.iter().zip(rule.pats.iter()) {
    if !arg.eras {
      pats.push(" ".to_string());
      pats.push(to_kdl_term(book, pat));
    }
  }
  let body = to_kdl_term(book, &rule.body);
  format!("({}{}) = {}", name, pats.join(""), body)
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
