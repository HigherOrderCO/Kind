// TODO: linearize variables, adding dups
// TODO: U120?

use crate::language::{*};
use std::collections::{HashSet, HashMap};
use rand::Rng;

pub const KDL_NAME_LEN: usize = 12;

pub fn to_kdl_term(kdl_names: &HashMap<String, String>, term: &Comp) -> Result<String, String> {
  let term = match term {
    Comp::Var { name } => {
      format!("{}", name)
    }
    Comp::Lam { name, body } => {
      let body = to_kdl_term(kdl_names, body)?;
      format!("@{} {}", name, body)
    }
    Comp::App { func, argm } => {
      let func = to_kdl_term(kdl_names, func)?;
      let argm = to_kdl_term(kdl_names, argm)?;
      format!("({} {})", func, argm)
    }
    Comp::Dup { nam0, nam1, expr, body } => {
      let expr = to_kdl_term(kdl_names, expr)?;
      let body = to_kdl_term(kdl_names, body)?;
      format!("dup {} {} = {}; {}", nam0, nam1, expr, body)
    }
    Comp::Let { name, expr, body } => {
      let expr = to_kdl_term(kdl_names, expr)?;
      let body = to_kdl_term(kdl_names, body)?;
      format!("let {} = {}; {}", name, expr, body)
    }
    Comp::Ctr { name, args } => {
      let kdl_name = kdl_names.get(name).unwrap();
      let args = args.iter().map(|x| to_kdl_term(kdl_names, x)).collect::<Result<Vec<String>, String>>()?;
      let args = args.iter().map(|x| format!(" {}", x)).collect::<String>();
      format!("{{{}{}}}", kdl_name, args)
    }
    Comp::Fun { name, args } => {
      let kdl_name = kdl_names.get(name).unwrap();
      let args = args.iter().map(|x| to_kdl_term(kdl_names, x)).collect::<Result<Vec<String>, String>>()?;
      let args = args.iter().map(|x| format!(" {}", x)).collect::<String>();
      format!("{{{}{}}}", kdl_name, args)
    }
    Comp::Num { numb } => {
      format!("#{}", numb)
    }
    Comp::Op2 { oper, val0, val1 } => {
      let oper = show_oper(&oper);
      let val0 = to_kdl_term(kdl_names, val0)?;
      let val1 = to_kdl_term(kdl_names, val1)?;
      format!("({} {} {})", oper, val0, val1)
    }
    Comp::Nil => {
      return Err("Found invalid Nil term".to_string());
    }
  };
  Ok(term)
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

pub fn to_kdl_rule(book: &Book, kdl_names: &HashMap<String, String>, rule: &Rule) -> Result<String, String> {
  let name = &rule.name;
  let kdl_name = kdl_names.get(name).unwrap();
  let entry = book.entrs.get(name).unwrap();
  let mut pats = vec![]; // stringified pattern args
  let mut vars = HashSet::new(); // rule pattern vars
  for (arg, pat) in entry.args.iter().zip(rule.pats.iter()) {
    if !arg.eras {
      let comp_pat = erase(book, pat);
      let pat = match to_kdl_term(kdl_names, &comp_pat) {
        Ok(term) => term,
        Err(_)   => {
          let pats = rule.pats.iter().map(|pat| format!(" {}", show_term(pat))).collect::<String>();
          let err  = format!("Found invalid term in pattern \"{}\" of rule \"{}{}\"", show_term(&*pat), name, pats);
          return Err(err);
        },
      };
      pats.push(" ".to_string());
      pats.push(pat);
      collect_lhs_vars(&comp_pat, &mut vars);
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
  let body = match to_kdl_term(kdl_names, &body) {
    Ok(body) => body,
    Err(_)   => {
      let pats = rule.pats.iter().map(|pat| format!(" {}", show_term(pat))).collect::<String>();
      let err  = format!("Found invalid term in body of rule \"{}{}\"", name, pats);
      return Err(err);
    },
  };
  let rule = format!("({}{}) = {}", kdl_name, pats.join(""), body);
  Ok(rule)
}

pub fn to_kdl_entry(book: &Book, kdl_names: &HashMap<String, String>, entry: &Entry) -> Result<String, String> {
  let kdl_name  = kdl_names.get(&entry.name).unwrap();
  let kind_name = format!("{} #{}", entry.name, kdl_name);
  let mut args_typed = vec![];
  let mut args_names = vec![];
  for arg in &entry.args {
    args_typed.push(format!(" {}({}: {})", if arg.eras { "-" } else { "" }, arg.name, show_term(&arg.tipo)));
    if !arg.eras {
      args_names.push(format!(" {}", arg.name));
    }
  }
  // Entries with no rules become constructors
  let entry = if entry.rules.is_empty() {
    let cmnt = format!("// {}{} : {}\n", kind_name, args_typed.join(""), show_term(&entry.tipo));
    let ctr  = format!("ctr {{{}{}}}\n\n", kdl_name, args_names.join(""));
    cmnt + &ctr
  // Entries with rules become functions
  } else {
    let mut rules = vec![];
    for rule in &entry.rules {
      rules.push(format!("\n  {}", to_kdl_rule(book, kdl_names, rule)?));
    }
    let cmnt = format!("// {}{} : {}\n", kind_name, args_typed.join(""), show_term(&entry.tipo));
    let func = format!("fun ({}{}) {{{}\n}}\n\n", kdl_name, args_names.join(""), rules.join(""));
    cmnt + &func
  };
  Ok(entry)
}

pub fn to_kdl_book(book: &Book, kdl_names: &HashMap<String, String>) -> Result<String, String> {
  let mut lines = vec![];
  for name in &book.names {
    let entry = book.entrs.get(name).unwrap();
    // Skip over useless entries
    // TODO: This doesn't cover all cases. We need something like `erase` but for a Book.
    //       Also maybe there are functions of type Type that should be compiled?
    if let Term::Typ {orig: _} = &*entry.tipo {
      continue;
    } else {
      lines.push(to_kdl_entry(book, kdl_names, entry)?);
    }
  }
  Ok(lines.join(""))
}

// Utils
// -----

// Returns a map of kind names to kindelia names
// Returns an err if any of the names can't be converted
pub fn get_kdl_names(book: &Book) -> Result<HashMap<String, String>, String> {
  fn get_kdl_name(entry: &Entry) -> Result<String, String> {
    let kind_name = &entry.name;
    // If the entry uses a kindelia name, use it
    if let Some(kdln) = &entry.kdln {
      // If the name has no ., put one at the start to make it part of the root namespace
      if kdln.len() > KDL_NAME_LEN {
        let err = format!("Kindelia name \"{}\" for \"{}\" has more than {} characters.", kdln, kind_name, KDL_NAME_LEN - 1);
        return Err(err);
      }
      Ok(kdln.clone())
    // Otherwise, try to fit the normal kind name in the max allowed len
    } else {
      let (ns, fun) = kind_name.rsplit_once('.').unwrap_or(("", kind_name));
      let  ns       = if !ns.is_empty() { format!("{}.", ns) } else { ns.to_string() };
      if ns.len() > KDL_NAME_LEN - 1 {
        let err = format!("Namespace for \"{}\" has more than {} characters.", kind_name, KDL_NAME_LEN - 1);
        return Err(err);
      }
      let max_fn_name = KDL_NAME_LEN - ns.len();
      // If the name doesn't fit, truncate and insert some random characters at the end
      let fun = if fun.len() > max_fn_name {
        let n_rnd_chrs = usize::min(3, max_fn_name);
        let fun_cut    = fun[..max_fn_name - n_rnd_chrs].to_string();
        let mut rng    = rand::thread_rng();
        let rnd_chrs   = (0..n_rnd_chrs)
                          .map(|_| rng.gen_range(0..63))
                          .map(|n| encode_base64(n))
                          .collect::<String>();
        format!("{}{}",fun_cut, rnd_chrs)
      } else {
        fun.to_string()
      };
      Ok(format!("{}{}", ns, fun))
    }
  }
  let mut kdl_names = HashMap::new();
  for name in &book.names {
    let kdln = get_kdl_name(book.entrs.get(name).unwrap())?;
    kdl_names.insert(name.clone(), kdln);
  }
  Ok(kdl_names)
}

pub fn encode_base64(num: u8) -> char {
  match num {
    0  ..= 9  => (num      + b'0') as char,
    10 ..= 35 => (num - 10 + b'A') as char,
    36 ..= 61 => (num - 36 + b'a') as char,
    62 ..     => '_',
  }
}

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
