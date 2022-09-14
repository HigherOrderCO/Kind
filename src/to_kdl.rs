use crate::language::{*};
use std::collections::HashMap;
use rand::Rng;

pub const KDL_NAME_LEN: usize = 12;


pub fn to_kdl_term(kdl_names: &HashMap<String, String>, term: &CompTerm) -> Result<String, String> {
  let term = match term {
    CompTerm::Var { name } => {
      format!("{}", name)
    }
    CompTerm::Lam { name, body } => {
      let body = to_kdl_term(kdl_names, body)?;
      format!("@{} {}", name, body)
    }
    CompTerm::App { func, argm } => {
      let func = to_kdl_term(kdl_names, func)?;
      let argm = to_kdl_term(kdl_names, argm)?;
      format!("({} {})", func, argm)
    }
    CompTerm::Dup { nam0, nam1, expr, body } => {
      let expr = to_kdl_term(kdl_names, expr)?;
      let body = to_kdl_term(kdl_names, body)?;
      format!("dup {} {} = {}; {}", nam0, nam1, expr, body)
    }
    CompTerm::Let { name, expr, body } => {
      let expr = to_kdl_term(kdl_names, expr)?;
      let body = to_kdl_term(kdl_names, body)?;
      format!("let {} = {}; {}", name, expr, body)
    }
    CompTerm::Ctr { name, args } => {
      let kdl_name = kdl_names.get(name).expect(&format!("{}", name));
      let args = args.iter().map(|x| to_kdl_term(kdl_names, x)).collect::<Result<Vec<String>, String>>()?;
      let args = args.iter().map(|x| format!(" {}", x)).collect::<String>();
      format!("{{{}{}}}", kdl_name, args)
    }
    CompTerm::Fun { name, args } => {
      let kdl_name = kdl_names.get(name).expect(&format!("{}", name));
      let args = args.iter().map(|x| to_kdl_term(kdl_names, x)).collect::<Result<Vec<String>, String>>()?;
      let args = args.iter().map(|x| format!(" {}", x)).collect::<String>();
      format!("({}{})", kdl_name, args)
    }
    CompTerm::Num { numb } => {
      format!("#{}", numb)
    }
    CompTerm::Op2 { oper, val0, val1 } => {
      let oper = show_oper(&oper);
      let val0 = to_kdl_term(kdl_names, val0)?;
      let val1 = to_kdl_term(kdl_names, val1)?;
      format!("({} {} {})", oper, val0, val1)
    }
    CompTerm::Nil => {
      return Err("Found nil term in compiled term while converting to kindelia".to_string());
    }
  };
  Ok(term)
}

pub fn to_kdl_rule(book: &Book, kdl_names: &HashMap<String, String>, rule: &CompRule) -> Result<String, String> {
  let name = &rule.name;
  let kdl_name = kdl_names.get(name).unwrap();
  let mut pats = vec![]; // stringified pattern args
  for pat in rule.pats.iter() {
    let pat = to_kdl_term(kdl_names, &pat)?;
    pats.push(" ".to_string());
    pats.push(pat);
  }
  let body = to_kdl_term(kdl_names, &rule.body)?;
  let rule = format!("({}{}) = {}", kdl_name, pats.join(""), body);
  Ok(rule)
}

pub fn to_kdl_entry(book: &Book, kdl_names: &HashMap<String, String>, entry: &CompEntry) -> Result<String, String> {
  let entry = match entry.name.as_str() {
    // Main is compiled to a run block
    // TODO: Maybe we should have run blocks come from a specific type of function instead
    // TODO: run statements should always come last in the block
    "Main" => format!("run {{\n  {}\n}}\n\n", to_kdl_term(kdl_names, &*entry.rules[0].body)?),

    _ => {
      let kdl_name   = kdl_names.get(&entry.name).unwrap();
      let args_names = entry.args.iter().map(|arg| format!(" {}", arg)).collect::<String>();
      // If this entry existed in the original kind code, add some annotations as comments
      let kind_entry = book.entrs.get(&entry.name);
      let is_knd_ent = matches!(kind_entry, Some(_));
      let cmnt       = if is_knd_ent {
        let kind_entry = kind_entry.unwrap();
        let args_typed = kind_entry.args.iter().map(|arg|
          format!(" {}({}: {})", if arg.eras { "-" } else { "" }, arg.name, show_term(&arg.tipo))
        ).collect::<String>();
        let kind_name  = format!("{} #{}", entry.name, kdl_name);
        format!("// {}{} : {}\n", kind_name, args_typed, show_term(&kind_entry.tipo))
      } else {
        String::new()
      };
      // Entries with no rules become constructors
      // Entries with rules become functions
      let fun = if entry.rules.is_empty() {
        format!("ctr {{{}{}}}\n\n", kdl_name, args_names)
      } else {
        let mut rules = vec![];
        for rule in &entry.rules {
          rules.push(format!("\n  {}", to_kdl_rule(book, kdl_names, rule)?));
        }
        format!("fun ({}{}) {{{}\n}}\n\n", kdl_name, args_names, rules.join(""))
      };
      cmnt + &fun
    }
  };
  Ok(entry)
}

pub fn to_kdl_book(book: &Book, kdl_names: &HashMap<String, String>, comp_book: &CompBook) -> Result<String, String> {
  let mut lines = vec![];
  for name in &comp_book.names {
    let entry = comp_book.entrs.get(name).unwrap();
    lines.push(to_kdl_entry(book, kdl_names, entry)?);
  }
  Ok(lines.join(""))
}

// Utils
// -----

// Returns a map of kind names to kindelia names
// Returns an err if any of the names can't be converted
pub fn get_kdl_names(book: &CompBook) -> Result<HashMap<String, String>, String> {
  // Fits a name to the max size allowed by kindelia.
  // If the name is too large, truncates and replaces the last characters by random chars.
  // Fails if the namespace is too large.
  fn rand_shorten(name: &String) -> Result<String, String> {
    let (ns, fun) = name.rsplit_once('.').unwrap_or(("", name));
    let  ns       = if !ns.is_empty() { format!("{}.", ns) } else { ns.to_string() };
    if ns.len() > KDL_NAME_LEN - 1 {
      let err = format!("Namespace for \"{}\" has more than {} characters.", name, KDL_NAME_LEN - 1);
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
      format!("{}{}", fun_cut, rnd_chrs)
    } else {
      fun.to_string()
    };
    Ok(format!("{}{}", ns, fun))
  }

  fn get_kdl_name(entry: &CompEntry) -> Result<String, String> {
    let kind_name = &entry.name;
    let kdln = match &entry.kdln {
      Some(kdln) => {
        // If the entry uses a kindelia name, use it
        if !kdln.chars().next().unwrap().is_uppercase() {
          let err = format!("Kindelia name \"{}\" doesn't start with an uppercase letter.", kdln);
          return Err(err);
        }
        if entry.orig {
          if kdln.len() > KDL_NAME_LEN {
            let err = format!("Kindelia name \"{}\" for \"{}\" has more than {} characters.", kdln, kind_name, KDL_NAME_LEN - 1);
            return Err(err);
          }
          kdln.clone()
        } else {
          // For entries created by the flattener, we shorten even the kindelia name
          // TODO: Since these rules can come first,
          //       if the kdln is too large the err will happen in the generated function,
          //       potentially confusing the user.
          rand_shorten(kdln)?
        }
      },
      // Otherwise, try to fit the normal kind name
      None => rand_shorten(kind_name)?,
    };
    Ok(kdln)
  }

  fn encode_base64(num: u8) -> char {
    match num {
      0  ..= 9  => (num      + b'0') as char,
      10 ..= 35 => (num - 10 + b'A') as char,
      36 ..= 61 => (num - 36 + b'a') as char,
      62 ..     => '_',
    }
  }

  let mut kdl_names = HashMap::new();
  for name in &book.names {
    let kdln = get_kdl_name(book.entrs.get(name).unwrap())?;
    kdl_names.insert(name.clone(), kdln);
  }
  Ok(kdl_names)
}
