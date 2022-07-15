use std::collections::HashMap;
use hvm::parser as parser;

#[derive(Clone, Debug)]
pub struct File {
  names: Vec<String>,
  entries: HashMap<String, Box<Entry>>
}

#[derive(Clone, Debug)]
pub struct Entry {
  name: String,
  args: Vec<Box<Argument>>,
  tipo: Box<Term>,
  rules: Vec<Box<Rule>>
}

#[derive(Clone, Debug)]
pub struct Argument {
  eras: bool,
  name: String,
  tipo: Box<Term>,
}

#[derive(Clone, Debug)]
pub struct Rule {
  name: String,
  pats: Vec<Box<Term>>,
  body: Box<Term>,
}

#[derive(Clone, Debug)]
pub enum Term {
  Typ,
  Var { name: String },
  All { name: String, tipo: Box<Term>, body: Box<Term> },
  Lam { name: String, body: Box<Term> },
  App { func: Box<Term>, argm: Box<Term> },
  Let { name: String, expr: Box<Term>, body: Box<Term> },
  Ann { expr: Box<Term>, tipo: Box<Term> },
  Ctr { name: String, args: Vec<Box<Term>> },
  Fun { name: String, args: Vec<Box<Term>> },
}

// Adjuster
// ========

pub fn adjust_file(file: &File) -> File {
  let mut names = Vec::new();
  let mut entries = HashMap::new(); 
  for name in &file.names {
    let entry = file.entries.get(name).unwrap();
    names.push(name.clone());
    entries.insert(name.clone(), Box::new(adjust_entry(file, &entry)));
  }
  return File { names, entries };
}

pub fn adjust_entry(file: &File, entry: &Entry) -> Entry {
  let name = entry.name.clone();
  let mut args = Vec::new();
  for arg in &entry.args {
    args.push(Box::new(adjust_argument(file, arg)));
  }
  let tipo = Box::new(adjust_term(file, &*entry.tipo));
  let mut rules = Vec::new();
  for rule in &entry.rules {
    rules.push(Box::new(adjust_rule(file, &*rule)));
  }
  return Entry { name, args, tipo, rules };
}

pub fn adjust_argument(file: &File, arg: &Argument) -> Argument {
  let eras = arg.eras;
  let name = arg.name.clone();
  let tipo = Box::new(adjust_term(file, &*arg.tipo));
  return Argument { eras, name, tipo };
}

pub fn adjust_rule(file: &File, rule: &Rule) -> Rule {
  let name = rule.name.clone();
  let mut pats = Vec::new();
  for pat in &rule.pats {
    pats.push(Box::new(adjust_term(file, &*pat)));
  }
  let body = Box::new(adjust_term(file, &*rule.body));
  return Rule { name, pats, body };
}

// TODO: check unbound variables
pub fn adjust_term(file: &File, term: &Term) -> Term {
  match *term {
    Term::Typ => {
      Term::Typ
    },
    Term::Var { ref name } => {
      Term::Var { name: name.clone() }
    },
    Term::Let { ref name, ref expr, ref body } => {
      let expr = Box::new(adjust_term(file, &*expr));
      let body = Box::new(adjust_term(file, &*body));
      Term::Let { name: name.clone(), expr, body }
    },
    Term::Ann { ref expr, ref tipo } => {
      let expr = Box::new(adjust_term(file, &*expr));
      let tipo = Box::new(adjust_term(file, &*tipo));
      Term::Ann { expr, tipo }
    },
    Term::All { ref name, ref tipo, ref body } => {
      let tipo = Box::new(adjust_term(file, &*tipo));
      let body = Box::new(adjust_term(file, &*body));
      Term::All { name: name.clone(), tipo, body }
    },
    Term::Lam { ref name, ref body } => {
      let body = Box::new(adjust_term(file, &*body));
      Term::Lam { name: name.clone(), body }
    },
    Term::App { ref func, ref argm } => {
      let func = Box::new(adjust_term(file, &*func));
      let argm = Box::new(adjust_term(file, &*argm));
      Term::App { func, argm }
    },
    Term::Ctr { ref name, ref args } => {
      if let Some(entry) = file.entries.get(name) {
        let mut new_args = Vec::new();
        for arg in args {
          new_args.push(Box::new(adjust_term(file, &*arg)));
        }
        if entry.rules.len() > 0 {
          Term::Fun { name: name.clone(), args: new_args }
        } else {
          Term::Ctr { name: name.clone(), args: new_args }
        }
      } else {
        panic!("Missing declaration for: '{}'.", name);
      }
    },
    Term::Fun { ref name, ref args } => {
      panic!("Internal error."); // shouldn't happen since we can't parse Fun{}
    },
  }
}

// Parser
// ======

pub fn is_var_head(head: char) -> bool {
  ('a'..='z').contains(&head) || head == '_' || head == '$'
}

pub fn is_ctr_head(head: char) -> bool {
  ('A'..='Z').contains(&head)
}

pub fn parse_var_name(state: parser::State) -> parser::Answer<String> {
  let (state, name) = parser::name1(state)?;
  if !is_var_head(name.chars().nth(0).unwrap_or(' ')) {
    let state = parser::State { index: state.index - name.len(), code: state.code }; // TODO: improve?
    return parser::expected("lowercase name", name.len(), state);
  } else {
    return Ok((state, name));
  }
}

pub fn parse_ctr_name(state: parser::State) -> parser::Answer<String> {
  let (state, name) = parser::name1(state)?;
  if !is_ctr_head(name.chars().nth(0).unwrap_or(' ')) {
    let state = parser::State { index: state.index - name.len(), code: state.code }; // TODO: improve?
    return parser::expected("uppercase name", name.len(), state);
  } else {
    return Ok((state, name));
  }
}

pub fn parse_var(state: parser::State) -> parser::Answer<Option<Box<Term>>> {
  parser::guard(
    Box::new(|state| {
      let (state, head) = parser::get_char(state)?;
      Ok((state, is_var_head(head)))
    }),
    Box::new(|state| {
      let (state, name) = parse_var_name(state)?;
      Ok((state, Box::new(Term::Var { name })))
    }),
    state,
  )
}

pub fn parse_lam(state: parser::State) -> parser::Answer<Option<Box<Term>>> {
  parser::guard(
    parser::text_parser("@"),
    Box::new(move |state| {
      let (state, _)    = parser::consume("@", state)?;
      let (state, name) = parse_var_name(state)?;
      let (state, body) = parse_term(state)?;
      Ok((state, Box::new(Term::Lam { name, body })))
    }),
    state,
  )
}

pub fn parse_all(state: parser::State) -> parser::Answer<Option<Box<Term>>> {
  parser::guard(
    Box::new(|state| {
      let (state, all0) = parser::text("(", state)?;
      let (state, name) = parser::name(state)?;
      let (state, all1) = parser::text(":", state)?;
      Ok((state, all0 && all1 && name.len() > 0 && is_var_head(name.chars().nth(0).unwrap_or(' '))))
    }),
    Box::new(|state| {
      let (state, _)    = parser::consume("(", state)?;
      let (state, name) = parse_var_name(state)?;
      let (state, _)    = parser::consume(":", state)?;
      let (state, tipo) = parse_term(state)?;
      let (state, _)    = parser::consume(")", state)?;
      let (state, body) = parse_term(state)?;
      Ok((state, Box::new(Term::All { name, tipo, body })))
    }),
    state,
  )
}

pub fn parse_app(state: parser::State) -> parser::Answer<Option<Box<Term>>> {
  return parser::guard(
    parser::text_parser("("),
    Box::new(|state| {
      parser::list(
        parser::text_parser("("),
        parser::text_parser(""),
        parser::text_parser(")"),
        Box::new(parse_term),
        Box::new(|args| {
          if !args.is_empty() {
            args.into_iter().reduce(|a, b| Box::new(Term::App { func: a, argm: b })).unwrap()
          } else {
            Box::new(Term::Var { name: "?".to_string() })
          }
        }),
        state,
      )
    }),
    state,
  );
}

pub fn parse_let(state: parser::State) -> parser::Answer<Option<Box<Term>>> {
  return parser::guard(
    parser::text_parser("let "),
    Box::new(|state| {
      let (state, _)    = parser::consume("let ", state)?;
      let (state, name) = parse_var_name(state)?;
      let (state, _)    = parser::consume("=", state)?;
      let (state, expr) = parse_term(state)?;
      let (state, _)    = parser::text(";", state)?;
      let (state, body) = parse_term(state)?;
      Ok((state, Box::new(Term::Let { name, expr, body })))
    }),
    state,
  );
}

pub fn parse_ann(state: parser::State) -> parser::Answer<Option<Box<Term>>> {
  return parser::guard(
    parser::text_parser("{"),
    Box::new(|state| {
      let (state, _)    = parser::consume("{", state)?;
      let (state, expr) = parse_term(state)?;
      let (state, _)    = parser::text(":", state)?;
      let (state, tipo) = parse_term(state)?;
      let (state, _)    = parser::consume("}", state)?;
      Ok((state, Box::new(Term::Ann { expr, tipo })))
    }),
    state,
  );
}

pub fn parse_ctr(state: parser::State) -> parser::Answer<Option<Box<Term>>> {
  parser::guard(
    Box::new(|state| {
      let (state, _)    = parser::text("(", state)?;
      let (state, head) = parser::get_char(state)?;
      Ok((state, is_ctr_head(head)))
    }),
    Box::new(|state| {
      let (state, open) = parser::text("(", state)?;
      let (state, name) = parse_ctr_name(state)?;
      if name == "Type" {
        Ok((state, Box::new(Term::Typ)))
      } else {
        let (state, args) = if open {
          parser::until(parser::text_parser(")"), Box::new(parse_term), state)?
        } else {
          (state, Vec::new())
        };
        Ok((state, Box::new(Term::Ctr { name, args })))
      }
    }),
    state,
  )
}

pub fn parse_hlp(state: parser::State) -> parser::Answer<Option<Box<Term>>> {
  return parser::guard(
    parser::text_parser("?"),
    Box::new(|state| {
      let (state, _)    = parser::consume("?", state)?;
      let (state, name) = parser::name_here(state)?;
      Ok((state, Box::new(Term::Typ))) // TODO: Help constructor
    }),
    state,
  );
}

pub fn parse_term(state: parser::State) -> parser::Answer<Box<Term>> {
  parser::grammar(
    "Term",
    &[
      Box::new(parse_all), // `(name:`
      Box::new(parse_ctr), // `(Name`
      Box::new(parse_app), // `(`
      Box::new(parse_lam), // `@`
      Box::new(parse_let), // `let `
      Box::new(parse_ann), // `{`
      Box::new(parse_hlp), // `?`
      Box::new(parse_var), // 
      Box::new(|state| Ok((state, None))),
    ],
    state,
  )
}

pub fn parse_entry(state: parser::State) -> parser::Answer<Box<Entry>> {
  let (state, name) = parse_ctr_name(state)?;
  let (state, args) = parser::until(Box::new(|state| {
    let (state, end_0) = parser::dry(Box::new(|state| parser::text(":", state)), state)?;
    let (state, end_1) = parser::dry(Box::new(|state| parser::text("{", state)), state)?;
    return Ok((state, end_0 || end_1));
  }), Box::new(parse_argument), state)?;
  let (state, next) = parser::peek_char(state)?;
  let (state, tipo) = if next == ':' {
    let (state, anno) = parser::consume(":", state)?;
    parse_term(state)?
  } else {
    (state, Box::new(Term::Typ)) // TODO: return a hole
  };
  let (state, head) = parser::peek_char(state)?;
  if head == '{' {
    let (state, _)    = parser::consume("{", state)?;
    let (state, body) = parse_term(state)?;
    let (state, _)    = parser::consume("}", state)?;
    let mut pats = vec![];
    for arg in &args {
      pats.push(Box::new(Term::Var { name: arg.name.clone() }));
    }
    let rules = vec![Box::new(Rule { name: name.clone(), pats, body })];
    return Ok((state, Box::new(Entry { name, args, tipo, rules })));
  } else {
    let mut rules = Vec::new();
    let rule_prefix = &format!("{} ", name); 
    let mut state = state;
    loop {
      let loop_state = state;
      let (loop_state, cont) = parser::text(&rule_prefix, loop_state)?;
      if cont {
        let (loop_state, rule) = parse_rule(loop_state, name.clone())?;
        rules.push(rule);
        state = loop_state;
      } else {
        state = loop_state;
        break;
      }
    }
    return Ok((state, Box::new(Entry { name, args, tipo, rules })));
  }
}

pub fn parse_rule(state: parser::State, name: String) -> parser::Answer<Box<Rule>> {
  let (state, pats) = parser::until(parser::text_parser("="), Box::new(parse_term), state)?;
  let (state, body) = parse_term(state)?;
  return Ok((state, Box::new(Rule { name, pats, body })));
}

pub fn parse_argument(state: parser::State) -> parser::Answer<Box<Argument>> {
  let (state, _)    = parser::consume("(", state)?;
  let (state, name) = parse_var_name(state)?;
  let (state, _)    = parser::consume(":", state)?;
  let (state, tipo) = parse_term(state)?;
  let (state, _)    = parser::consume(")", state)?;
  return Ok((state, Box::new(Argument { eras: false, name, tipo })));
}

pub fn parse_file(state: parser::State) -> parser::Answer<Box<File>> {
  let (state, entry_vec) = parser::until(Box::new(parser::done), Box::new(parse_entry), state)?;
  let mut names = Vec::new();
  let mut entries = HashMap::new();
  for entry in entry_vec {
    names.push(entry.name.clone());
    entries.insert(entry.name.clone(), entry);
  }
  return Ok((state, Box::new(File { names, entries })));
}

pub fn show_term(term: &Term) -> String {
  match term {
    Term::Typ => {
      format!("Type")
    }
    Term::Var { name } => {
      format!("{}", name)
    }
    Term::Lam { name, body } => {
      let body = show_term(body);
      format!("@{}({})", name, body)
    }
    Term::App { func, argm } => {
      let mut args = vec![argm];
      let mut expr = func;
      while let Term::App { func, argm } = &**expr {
        args.push(argm);
        expr = func;
      }
      args.reverse();
      format!("({} {})", show_term(expr), args.iter().map(|x| show_term(x)).collect::<Vec<String>>().join(" "))
    }
    Term::All { name, tipo, body } => {
      let body = show_term(body);
      format!("({}: {}) {}", name, show_term(tipo), body)
    }
    Term::Let { name, expr, body } => {
      let expr = show_term(expr);
      let body = show_term(body);
      format!("let {} = {}; {}", name, expr, body)
    }
    Term::Ann { expr, tipo } => {
      let expr = show_term(expr);
      let tipo = show_term(tipo);
      format!("{{{} : {}}}", expr, tipo)
    }
    Term::Ctr { name, args } => {
      format!("({}{})", name, args.iter().map(|x| format!(" {}",show_term(x))).collect::<String>())
    }
    Term::Fun { name, args } => {
      format!("({}{})", name, args.iter().map(|x| format!(" {}",show_term(x))).collect::<String>())
    }
  }
}

pub fn show_rule(rule: &Rule) -> String {
  let name = &rule.name;
  let mut pats = vec![];
  for pat in &rule.pats {
    pats.push(show_term(pat));
  }
  let body = show_term(&rule.body);
  format!("{} {} => {}", name, pats.join(" "), body)
}

pub fn show_entry(entry: &Entry) -> String {
  let name = &entry.name;
  let mut args = vec![];
  for arg in &entry.args {
    args.push(format!(" ({}: {})", arg.name, show_term(&arg.tipo)));
  }
  if entry.rules.len() == 0 {
    format!("{}{} : {}", name, args.join(""), show_term(&entry.tipo))
  } else {
    let mut rules = vec![];
    for rule in &entry.rules {
      rules.push(format!("\n  {}", show_rule(rule)));
    }
    format!("{}{} : {} {{{}\n}}", name, args.join(""), show_term(&entry.tipo), rules.join(""))
  }
}

pub fn show_file(file: &File) -> String {
  let mut lines = vec![];
  for name in &file.names {
    lines.push(show_entry(file.entries.get(name).unwrap()));
  }
  lines.join("\n")
}

pub fn read_term(code: &str) -> Result<Box<Term>, String> {
  parser::read(Box::new(parse_term), code)
}

pub fn read_file(code: &str) -> Result<Box<File>, String> {
  parser::read(Box::new(parse_file), code)
}

// Compiler
// ========

//pub enum Term {
  //Typ,
  //Var { name: String },
  //Let { name: String, expr: Box<Term>, body: Box<Term> },
  //App { func: Box<Term>, argm: Box<Term> },
  //Lam { name: String, body: Box<Term> },
  //All { name: String, tipo: Box<Term>, body: Box<Term> },
  //Ctr { name: String, args: Vec<Box<Term>> },
  //Fun { name: String, args: Vec<Box<Term>> },
//}
pub fn compile_term(term: &Term, quote: bool) -> String { 
  match term {
    Term::Typ => {
      format!("Typ")
    }
    Term::Var { name } => {
      name.clone()
    }
    Term::All { name, tipo, body } => {
      format!("(All {} {} λ{} {})", name_to_u64(name), compile_term(tipo, quote), name, compile_term(body, quote))
    }
    Term::Lam { name, body } => {
      format!("(Lam {} λ{} {})", name_to_u64(name), name, compile_term(body, quote))
    }
    Term::App { func, argm } => {
      format!("({} {} {})", if quote { "App" } else { "Apply" }, compile_term(func, quote), compile_term(argm, quote))
    }
    Term::Let { name, expr, body } => {
      format!("({} {} {} λ{} {})", if quote { "Let" } else { "Lets" }, name_to_u64(name), compile_term(expr, quote), name, compile_term(body, quote))
    }
    Term::Ann { expr, tipo } => {
      format!("({} {} {})", if quote { "Ann" } else { "Annotate" }, compile_term(expr, quote), compile_term(tipo, quote))
    }
    Term::Ctr { name, args } => {
      let mut args_strs : Vec<String> = Vec::new();
      for arg in args {
        args_strs.push(format!(" {}", compile_term(arg, quote)));
      }
      format!("(Ct{} {}.{})", args.len(), name, args_strs.join(""))
    }
    Term::Fun { name, args } => {
      let mut args_strs : Vec<String> = Vec::new();
      for arg in args {
        args_strs.push(format!(" {}", compile_term(arg, quote)));
      }
      format!("({}{} {}.{})", if quote { "NewFn" } else { "Rule_" }, args.len(), name, args_strs.join(""))
    }
  }
}

pub fn compile_entry(entry: &Entry) -> String {
  fn compile_type(args: &Vec<Box<Argument>>, tipo: &Box<Term>, index: usize) -> String {
    if index < args.len() {
      let arg = &args[index];
      format!("(All {} {} λ{} {})", name_to_u64(&arg.name), compile_term(&arg.tipo, false), arg.name, compile_type(args, tipo, index + 1))
    } else {
      compile_term(tipo, false)
    }
  }

  fn compile_rule(rule: &Rule) -> String {
    let mut pats = vec![];
    for pat in &rule.pats {
      pats.push(format!(" {}", compile_term(pat, false)));
    }
    let mut vars = vec![];
    for idx in 0 .. pats.len() {
      vars.push(format!(" x{}", idx));
    }
    let body_rhs = compile_term(&rule.body, true);
    let rule_rhs = compile_term(&rule.body, false);
    let mut text = String::new();
    //text.push_str(&format!("    (Rule{} {}.{}) = {}\n", rule.pats.len(), rule.name, pats.join(""), body));
    text.push_str(&format!("    (Body_{} {}.{}) = {}\n", rule.pats.len(), rule.name, pats.join(""), body_rhs));
    //text.push_str(&format!("    (Body_{} {}.{}) = (NewFn{} {}.{})\n", rule.pats.len(), rule.name, vars.join(""), rule.pats.len(), rule.name, vars.join("")));
    text.push_str(&format!("    (Rule_{} {}.{}) = {}\n", rule.pats.len(), rule.name, pats.join(""), rule_rhs));
    return text;
  }

  fn compile_rule_chk(rule: &Rule, index: usize, vars: &mut u64, args: &mut Vec<String>) -> String {
    if index < rule.pats.len() {
      let (inp_patt_str, var_patt_str) = compile_patt_chk(&rule.pats[index], vars);
      args.push(var_patt_str);
      let head = inp_patt_str;
      let tail = compile_rule_chk(rule, index + 1, vars, args);
      return format!("(LHS {} {})", head, tail);
    } else {
      return format!("(RHS (Body_{} {}.{}))", index, rule.name, args.iter().map(|x| format!(" {}", x)).collect::<Vec<String>>().join(""));
    }
  }

  fn compile_patt_chk(patt: &Term, vars: &mut u64) -> (String, String) {
    // FIXME: remove redundancy
    match patt {
      Term::Var { name } => {
        let inp = format!("(Var {} {})", name_to_u64(name), vars);
        let var = format!("(Var {} {})", name_to_u64(name), vars);
        *vars += 1;
        return (inp, var);
      }
      Term::Ctr { name, args } => {
        let mut inp_args_str = String::new();
        let mut var_args_str = String::new();
        for arg in args {
          let (inp_arg_str, var_arg_str) = compile_patt_chk(arg, vars);
          inp_args_str.push_str(&format!(" {}", inp_arg_str));
          var_args_str.push_str(&format!(" {}", var_arg_str));
        }
        let inp_str = format!("(Ct{} {}.{})", args.len(), name, inp_args_str);
        let var_str = format!("(Ct{} {}.{})", args.len(), name, var_args_str);
        return (inp_str, var_str);
      }
      _ => {
        panic!("Invalid left-hand side pattern: {}", show_term(patt));
      }
    }
  }

  let mut result = String::new();
  result.push_str(&format!("    (NameOf {}.) = \"{}\"\n", entry.name, entry.name));
  result.push_str(&format!("    (HashOf {}.) = %{}\n", entry.name, entry.name));
  result.push_str(&format!("    (TypeOf {}.) = {}\n", entry.name, compile_type(&entry.args, &entry.tipo, 0)));
  for rule in &entry.rules {
    result.push_str(&compile_rule(&rule));
  }
  result.push_str(&format!("    (Verify {}.) =\n", entry.name));
  for rule in &entry.rules {
    result.push_str(&format!("      (Cons {}\n", compile_rule_chk(&rule, 0, &mut 0, &mut vec![]))); 
  }
  result.push_str(&format!("      Nil{}\n", ")".repeat(entry.rules.len())));
  return result;
}

pub fn compile_file(file: &File) -> String {
  let mut result = String::new();
  result.push_str(&format!("\n  Functions =\n"));
  result.push_str(&format!("    let fns = Nil\n"));
  for name in &file.names {
    let entry = file.entries.get(name).unwrap();
    result.push_str(&format!("    let fns = (Cons {}. fns)\n", entry.    name));
  }
  result.push_str(&format!("    fns\n\n"));
  for name in &file.names {
    let entry = file.entries.get(name).unwrap();
    result.push_str(&format!("  // {}\n", name));
    result.push_str(&format!("  // {}\n", "-".repeat(name.len())));
    result.push_str(&format!("\n"));
    result.push_str(&compile_entry(&entry));
    result.push_str(&format!("\n"));
  }
  return result;
}

pub fn readback_string(rt: &hvm::Runtime, host: u64) -> String {
  let str_cons = rt.get_id("String.cons");
  let str_nil  = rt.get_id("String.nil");
  let mut term = rt.ptr(host);
  let mut text = String::new();
  loop {
    if hvm::get_tag(term) == hvm::CTR {
      let fid = hvm::get_ext(term);
      if fid == str_cons {
        let head = rt.ptr(hvm::get_loc(term, 0));
        let tail = rt.ptr(hvm::get_loc(term, 1));
        if hvm::get_tag(head) == hvm::NUM {
          text.push(std::char::from_u32(hvm::get_num(head) as u32).unwrap_or('?'));
          term = tail;
          continue;
        }
      }
      if fid == str_nil {
        break;
      }
    }
    panic!("Invalid output: {} {}", hvm::get_tag(term), rt.show(host));
  }
  return text;
}

// Name <-> Number

/// Converts a name to a number, using the following table:
pub fn name_to_u64(name: &str) -> u64 {
  let mut num: u64 = 0;
  for (i, chr) in name.chars().enumerate() {
    if i < 10 {
      num = (num << 6) + char_to_u64(chr);
    }
  }
  return num;
}

pub const fn char_to_u64(chr: char) -> u64 {
  match chr {
    '.'       =>  0,
    '0'..='9' =>  1 + chr as u64 - '0' as u64,
    'A'..='Z' => 11 + chr as u64 - 'A' as u64,
    'a'..='z' => 37 + chr as u64 - 'a' as u64,
    '_'       => 63,
    _         => panic!("Invalid name character."),
  }
}

/// Inverse of `name_to_u64`
pub fn u64_to_name(num: u64) -> String {
  let mut name = String::new();
  let mut num = num;
  while num > 0 {
    let chr = (num % 64) as u8;
    let chr =
        match chr {
            0         => '.',
            1  ..= 10 => (chr -  1 + b'0') as char,
            11 ..= 36 => (chr - 11 + b'A') as char,
            37 ..= 62 => (chr - 37 + b'a') as char,
            63        => '_',
            64 ..     => panic!("impossible character value")
        };
    name.push(chr);
    num = num / 64;
  }
  name.chars().rev().collect()
}
