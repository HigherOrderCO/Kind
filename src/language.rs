use std::collections::HashMap;
use hvm::parser as parser;

#[derive(Clone, Debug)]
pub struct Book {
  names: Vec<String>,
  entrs: HashMap<String, Box<Entry>>,
  holes: u64,
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
  hide: bool,
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
  Typ { orig: u64 },
  Var { orig: u64, name: String },
  All { orig: u64, name: String, tipo: Box<Term>, body: Box<Term> },
  Lam { orig: u64, name: String, body: Box<Term> },
  App { orig: u64, func: Box<Term>, argm: Box<Term> },
  Let { orig: u64, name: String, expr: Box<Term>, body: Box<Term> },
  Ann { orig: u64, expr: Box<Term>, tipo: Box<Term> },
  Ctr { orig: u64, name: String, args: Vec<Box<Term>> },
  Fun { orig: u64, name: String, args: Vec<Box<Term>> },
  Hlp { orig: u64 },
  U60 { orig: u64 },
  Num { orig: u64, numb: u64 },
  Op2 { orig: u64, val0: Box<Term>, val1: Box<Term> },
  Hol { orig: u64, numb: u64 },
}

// Adjuster
// ========

#[derive(Clone, Debug)]
pub enum AdjustError {
  IncorrectArity { orig: u64, term: Box<Term> }
}

pub fn adjust_book(book: &Book) -> Result<Book, AdjustError> {
  let mut names = Vec::new();
  let mut entrs = HashMap::new(); 
  let mut holes = 0;
  for name in &book.names {
    let entry = book.entrs.get(name).unwrap();
    names.push(name.clone());
    entrs.insert(name.clone(), Box::new(adjust_entry(book, &entry, &mut holes)?));
  }
  return Ok(Book { names, entrs, holes });
}

pub fn adjust_entry(book: &Book, entry: &Entry, holes: &mut u64) -> Result<Entry, AdjustError> {
  let name = entry.name.clone();
  let mut args = Vec::new();
  for arg in &entry.args {
    args.push(Box::new(adjust_argument(book, arg, holes)?));
  }
  let tipo = Box::new(adjust_term(book, &*entry.tipo, holes)?);
  let mut rules = Vec::new();
  for rule in &entry.rules {
    rules.push(Box::new(adjust_rule(book, &*rule, holes)?));
  }
  return Ok(Entry { name, args, tipo, rules });
}

pub fn adjust_argument(book: &Book, arg: &Argument, holes: &mut u64) -> Result<Argument, AdjustError> {
  let hide = arg.hide;
  let eras = arg.eras;
  let name = arg.name.clone();
  let tipo = Box::new(adjust_term(book, &*arg.tipo, holes)?);
  return Ok(Argument { hide, eras, name, tipo });
}

pub fn adjust_rule(book: &Book, rule: &Rule, holes: &mut u64) -> Result<Rule, AdjustError> {
  let name = rule.name.clone();
  let mut pats = Vec::new();
  for pat in &rule.pats {
    pats.push(Box::new(adjust_term(book, &*pat, holes)?));
  }
  let body = Box::new(adjust_term(book, &*rule.body, holes)?);
  return Ok(Rule { name, pats, body });
}

// TODO: check unbound variables
// TODO: prevent defining the same name twice
pub fn adjust_term(book: &Book, term: &Term, holes: &mut u64) -> Result<Term, AdjustError> {
  match *term {
    Term::Typ { orig } => {
      Ok(Term::Typ { orig })
    },
    Term::Var { ref orig, ref name } => {
      let orig = *orig;
      Ok(Term::Var { orig, name: name.clone() })
    },
    Term::Let { ref orig, ref name, ref expr, ref body } => {
      let orig = *orig;
      let expr = Box::new(adjust_term(book, &*expr, holes)?);
      let body = Box::new(adjust_term(book, &*body, holes)?);
      Ok(Term::Let { orig, name: name.clone(), expr, body })
    },
    Term::Ann { ref orig, ref expr, ref tipo } => {
      let orig = *orig;
      let expr = Box::new(adjust_term(book, &*expr, holes)?);
      let tipo = Box::new(adjust_term(book, &*tipo, holes)?);
      Ok(Term::Ann { orig, expr, tipo })
    },
    Term::All { ref orig, ref name, ref tipo, ref body } => {
      let orig = *orig;
      let tipo = Box::new(adjust_term(book, &*tipo, holes)?);
      let body = Box::new(adjust_term(book, &*body, holes)?);
      Ok(Term::All { orig, name: name.clone(), tipo, body })
    },
    Term::Lam { ref orig, ref name, ref body } => {
      let orig = *orig;
      let body = Box::new(adjust_term(book, &*body, holes)?);
      Ok(Term::Lam { orig, name: name.clone(), body })
    },
    Term::App { ref orig, ref func, ref argm } => {
      let orig = *orig;
      let func = Box::new(adjust_term(book, &*func, holes)?);
      let argm = Box::new(adjust_term(book, &*argm, holes)?);
      Ok(Term::App { orig, func, argm })
    },
    Term::Ctr { ref orig, ref name, ref args } => {
      let orig = *orig;
      if let Some(entry) = book.entrs.get(name) {
        let mut new_args = Vec::new();
        for arg in args {
          new_args.push(Box::new(adjust_term(book, &*arg, holes)?));
        }
        // Count implicit arguments
        let mut implicits = 0;
        for arg in &entry.args {
          if arg.hide {
            implicits = implicits + 1;
          }
        }
        // Fill implicit arguments
        if args.len() == entry.args.len() - implicits {
          new_args.reverse();
          let mut aux_args = Vec::new();
          for arg in &entry.args {
            if arg.hide {
              let numb = *holes;
              *holes = *holes + 1;
              aux_args.push(Box::new(Term::Hol { orig, numb }));
            } else {
              aux_args.push(new_args.pop().unwrap());
            }
          }
          new_args = aux_args;
        }
        if new_args.len() != entry.args.len()  {
          Err(AdjustError::IncorrectArity { orig, term: Box::new(term.clone()) })
        } else if entry.rules.len() > 0 {
          Ok(Term::Fun { orig, name: name.clone(), args: new_args })
        } else {
          Ok(Term::Ctr { orig, name: name.clone(), args: new_args })
        }
      } else {
        println!("Missing declaration for: '{}'.", name);
        std::process::exit(0);
      }
    },
    Term::Fun { ref orig, ref name, ref args } => {
      panic!("Internal error."); // shouldn't happen since we can't parse Fun{}
    },
    Term::Hol { ref orig, numb: _ } => {
      let orig = *orig;
      let numb = *holes;
      *holes = *holes + 1;
      Ok(Term::Hol { orig, numb })
    },
    Term::Hlp { ref orig } => {
      let orig = *orig;
      Ok(Term::Hlp { orig })
    },
    Term::U60 { ref orig } => {
      let orig = *orig;
      Ok(Term::U60 { orig })
    },
    Term::Num { ref orig, ref numb } => {
      let orig = *orig;
      let numb = *numb;
      Ok(Term::Num { orig, numb })
    },
    Term::Op2 { ref orig, ref val0, ref val1 } => {
      let orig = *orig;
      let val0 = Box::new(adjust_term(book, &*val0, holes)?);
      let val1 = Box::new(adjust_term(book, &*val1, holes)?);
      Ok(Term::Op2 { orig, val0, val1 })
    },
  }
}

// Parser
// ======

pub fn origin(init: usize, last: usize) -> u64 {
  ((init as u64) & 0xFFFFFF) | (((last as u64) & 0xFFFFFF) << 24)
}

pub fn get_origin_range(origin: u64) -> (usize, usize) {
  ((origin & 0xFFFFFF) as usize, ((origin >> 24) & 0xFFFFFF) as usize)
}

pub fn get_init_index(state: parser::State) -> parser::Answer<usize> {
  let (state, _) = parser::skip(state)?;
  Ok((state, state.index))
}

pub fn get_last_index(state: parser::State) -> parser::Answer<usize> {
  Ok((state, state.index))
}

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
      let (state, init) = get_init_index(state)?;
      let (state, name) = parse_var_name(state)?;
      let (state, last) = get_last_index(state)?;
      let orig          = origin(init, last);
      Ok((state, Box::new(Term::Var { orig, name })))
    }),
    state,
  )
}


pub fn parse_num(state: parser::State) -> parser::Answer<Option<Box<Term>>> {
  parser::guard(
    parser::text_parser("#"),
    Box::new(|state| {
      let (state, init) = get_init_index(state)?;
      let (state, _)    = parser::consume("#", state)?;
      let (state, name) = parser::name1(state)?;
      let (state, last) = get_last_index(state)?;
      let orig          = origin(init, last);
      if let Ok(numb) = name.parse::<u64>() {
        Ok((state, Box::new(Term::Num { orig, numb })))
      } else {
        return parser::expected("number literal", name.len(), state);
      }
    }),
    state,
  )
}

pub fn parse_lam(state: parser::State) -> parser::Answer<Option<Box<Term>>> {
  parser::guard(
    parser::text_parser("@"),
    Box::new(move |state| {
      let (state, init) = get_init_index(state)?;
      let (state, _)    = parser::consume("@", state)?;
      let (state, name) = parse_var_name(state)?;
      let (state, body) = parse_term(state)?;
      let (state, last) = get_last_index(state)?;
      let orig          = origin(init, last);
      Ok((state, Box::new(Term::Lam { orig, name, body })))
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
      let (state, init) = get_init_index(state)?;
      let (state, _)    = parser::consume("(", state)?;
      let (state, name) = parse_var_name(state)?;
      let (state, _)    = parser::consume(":", state)?;
      let (state, tipo) = parse_term(state)?;
      let (state, _)    = parser::consume(")", state)?;
      let (state, body) = parse_term(state)?;
      let (state, last) = get_last_index(state)?;
      let orig          = origin(init, last);
      Ok((state, Box::new(Term::All { orig, name, tipo, body })))
    }),
    state,
  )
}

pub fn parse_app(state: parser::State) -> parser::Answer<Option<Box<Term>>> {
  return parser::guard(
    parser::text_parser("("),
    Box::new(|state| {
      let (state, init_index) = get_init_index(state)?;
      parser::list::<(usize, usize, Box<Term>),Box<Term>> (
        parser::text_parser("("),
        parser::text_parser(""),
        parser::text_parser(")"),
        Box::new(|state| {
          let (state, init) = get_init_index(state)?;
          let (state, term) = parse_term(state)?;
          let (state, last) = get_last_index(state)?;
          return Ok((state, (init, last, term)));
        }),
        Box::new(|args| {
          if !args.is_empty() {
            let (app_init_index, app_last_index, func) = &args[0];
            let mut term = func.clone();
            for i in 1 .. args.len() {
              let (argm_init_index, argm_last_index, argm) = &args[i];
              term = Box::new(Term::App {
                orig: origin(*app_init_index, *argm_last_index),
                func: term,
                argm: argm.clone(),
              });
            }
            return term;
          } else {
            // TODO: "()" could make an Unit?
            return Box::new(Term::Var {
              orig: 0,
              name: "?".to_string(),
            });
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
      let (state, init) = get_init_index(state)?;
      let (state, _)    = parser::consume("let ", state)?;
      let (state, name) = parse_var_name(state)?;
      let (state, _)    = parser::consume("=", state)?;
      let (state, expr) = parse_term(state)?;
      let (state, _)    = parser::text(";", state)?;
      let (state, body) = parse_term(state)?;
      let (state, last) = get_last_index(state)?;
      let orig          = origin(init, last);
      Ok((state, Box::new(Term::Let { orig, name, expr, body })))
    }),
    state,
  );
}

pub fn parse_ann(state: parser::State) -> parser::Answer<Option<Box<Term>>> {
  return parser::guard(
    parser::text_parser("{"),
    Box::new(|state| {
      let (state, init) = get_init_index(state)?;
      let (state, _)    = parser::consume("{", state)?;
      let (state, expr) = parse_term(state)?;
      let (state, _)    = parser::text("::", state)?;
      let (state, tipo) = parse_term(state)?;
      let (state, _)    = parser::consume("}", state)?;
      let (state, last) = get_last_index(state)?;
      let orig          = origin(init, last);
      Ok((state, Box::new(Term::Ann { orig, expr, tipo })))
    }),
    state,
  );
}

pub fn parse_op2(state: parser::State) -> parser::Answer<Option<Box<Term>>> {
  parser::guard(
    Box::new(|state| {
      let (state, isop) = parser::text("(+", state)?;
      Ok((state, isop))
    }),
    Box::new(|state| {
      let (state, init) = get_init_index(state)?;
      let (state, open) = parser::consume("(+", state)?; // TODO: parse other operators
      let (state, val0) = parse_term(state)?;
      let (state, val1) = parse_term(state)?;
      let (state, open) = parser::consume(")", state)?; // TODO: parse other operators
      let (state, last) = get_last_index(state)?;
      let orig          = origin(init, last);
      Ok((state, Box::new(Term::Op2 { orig, val0, val1 })))
    }),
    state,
  )
}

pub fn parse_ctr(state: parser::State) -> parser::Answer<Option<Box<Term>>> {
  parser::guard(
    Box::new(|state| {
      let (state, _)    = parser::text("(", state)?;
      let (state, head) = parser::get_char(state)?;
      Ok((state, is_ctr_head(head)))
    }),
    Box::new(|state| {
      let (state, init) = get_init_index(state)?;
      let (state, open) = parser::text("(", state)?;
      let (state, name) = parse_ctr_name(state)?;
      if name == "Type" {
        let (state, last) = get_last_index(state)?;
        let orig          = origin(init, last);
        Ok((state, Box::new(Term::Typ { orig })))
      } else if name == "U60" {
        let (state, last) = get_last_index(state)?;
        let orig          = origin(init, last);
        Ok((state, Box::new(Term::U60 { orig })))
      } else {
        let (state, args) = if open {
          parser::until(parser::text_parser(")"), Box::new(parse_term), state)?
        } else {
          (state, Vec::new())
        };
        let (state, last) = get_last_index(state)?;
        let orig          = origin(init, last);
        Ok((state, Box::new(Term::Ctr { orig, name, args })))
      }
    }),
    state,
  )
}

pub fn parse_hol(state: parser::State) -> parser::Answer<Option<Box<Term>>> {
  parser::guard(
    parser::text_parser("_"),
    Box::new(|state| {
      let (state, init) = get_init_index(state)?;
      let (state, _)    = parser::consume("_", state)?;
      let (state, last) = get_last_index(state)?;
      let orig          = origin(init, last);
      Ok((state, Box::new(Term::Hol { orig, numb: 0 })))
    }),
    state,
  )
}

//pub fn parse_hol(state: parser::State) -> parser::Answer<Option<Box<Term>>> {
  //parser::guard(
    //parser::text_parser("_"),
    //Box::new(|state| {
      //let (state, init) = get_init_index(state)?;
      //let (state, _)    = parser::consume("_", state)?;
      //let (state, last) = get_last_index(state)?;
      //let orig          = origin(init, last);
      //Ok((state, Box::new(Term::Hol { orig, numb: 0 })))
    //}),
    //state,
  //)
//}



pub fn parse_hlp(state: parser::State) -> parser::Answer<Option<Box<Term>>> {
  return parser::guard(
    parser::text_parser("?"),
    Box::new(|state| {
      let (state, init) = get_init_index(state)?;
      let (state, _)    = parser::consume("?", state)?;
      let (state, name) = parser::name_here(state)?;
      let (state, last) = get_last_index(state)?;
      let orig          = origin(init, last);
      Ok((state, Box::new(Term::Hlp { orig })))
    }),
    state,
  );
}

pub fn parse_arr(state: parser::State) -> parser::Answer<Option<Box<dyn Fn(usize, Box<Term>) -> Box<Term>>>> {
  return parser::guard(
    parser::text_parser("->"),
    Box::new(|state| {
      let (state, _)    = parser::consume("->", state)?;
      let (state, body) = parse_term(state)?;
      let (state, last) = get_last_index(state)?;
      Ok((state, Box::new(move |init, tipo| {
        let orig = origin(init, last);
        let name = "_".to_string();
        let tipo = tipo.clone();
        let body = body.clone();
        Box::new(Term::All { orig, name, tipo, body })
      })))
    }),
    state,
  );
}

pub fn parse_term_prefix(state: parser::State) -> parser::Answer<Box<Term>> {
  parser::grammar("Term", &[
    Box::new(parse_all), // `(name:`
    Box::new(parse_ctr), // `(Name`
    Box::new(parse_op2), // `(+`
    Box::new(parse_app), // `(`
    Box::new(parse_lam), // `@`
    Box::new(parse_let), // `let `
    Box::new(parse_ann), // `{x::`
    Box::new(parse_hlp), // `?`
    Box::new(parse_hol), // `_`
    Box::new(parse_num), // `#`
    Box::new(parse_var), // 
    Box::new(|state| Ok((state, None))),
  ], state)
}

pub fn parse_term_suffix(state: parser::State) -> parser::Answer<Box<dyn Fn(usize,Box<Term>) -> Box<Term>>> {
  parser::grammar("Term", &[
    Box::new(parse_arr),
    Box::new(|state| Ok((state, Some(Box::new(|init, term| term))))),
  ], state)
}

pub fn parse_term(state: parser::State) -> parser::Answer<Box<Term>> {
  let (state, init)   = get_init_index(state)?;
  let (state, prefix) = parse_term_prefix(state)?;
  let (state, suffix) = parse_term_suffix(state)?;
  return Ok((state, suffix(init, prefix)));
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
    (state, Box::new(Term::Typ { orig: 0 })) // TODO: return a hole, set orig
  };
  let (state, head) = parser::peek_char(state)?;
  if head == '{' {
    let (state, _)    = parser::consume("{", state)?;
    let (state, body) = parse_term(state)?;
    let (state, _)    = parser::consume("}", state)?;
    let mut pats = vec![];
    for arg in &args {
      pats.push(Box::new(Term::Var { orig: 0, name: arg.name.clone() })); // TODO: set orig
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
  let (state, next) = parser::peek_char(state)?;
  let (state, eras) = parser::text("-", state)?;
  let (open, close) = if next == '(' { ("(",")") } else { ("<",">") };
  let (state, _)    = parser::consume(open, state)?;
  let (state, name) = parse_var_name(state)?;
  let (state, anno) = parser::text(":", state)?;
  let (state, tipo) = if anno { parse_term(state)? } else { (state, Box::new(Term::Typ { orig: 0 })) };
  let (state, _)    = parser::consume(close, state)?;
  let hide          = open == "<";
  return Ok((state, Box::new(Argument { hide, eras, name, tipo })));
}

pub fn parse_book(state: parser::State) -> parser::Answer<Box<Book>> {
  let (state, entry_vec) = parser::until(Box::new(parser::done), Box::new(parse_entry), state)?;
  let mut names = Vec::new();
  let mut entrs = HashMap::new();
  for entry in entry_vec {
    names.push(entry.name.clone());
    entrs.insert(entry.name.clone(), entry);
  }
  return Ok((state, Box::new(Book { holes: 0, names, entrs })));
}

pub fn show_term(term: &Term) -> String {
  match term {
    Term::Typ { .. } => {
      format!("Type")
    }
    Term::Var { orig: _, name } => {
      format!("{}", name)
    }
    Term::Lam { orig: _, name, body } => {
      let body = show_term(body);
      format!("@{}({})", name, body)
    }
    Term::App { orig: _, func, argm } => {
      let mut args = vec![argm];
      let mut expr = func;
      while let Term::App { orig: _, func, argm } = &**expr {
        args.push(argm);
        expr = func;
      }
      args.reverse();
      format!("({} {})", show_term(expr), args.iter().map(|x| show_term(x)).collect::<Vec<String>>().join(" "))
    }
    Term::All { orig: _, name, tipo, body } => {
      let body = show_term(body);
      format!("({}: {}) {}", name, show_term(tipo), body)
    }
    Term::Let { orig: _, name, expr, body } => {
      let expr = show_term(expr);
      let body = show_term(body);
      format!("let {} = {}; {}", name, expr, body)
    }
    Term::Ann { orig: _, expr, tipo } => {
      let expr = show_term(expr);
      let tipo = show_term(tipo);
      format!("{{{} :: {}}}", expr, tipo)
    }
    Term::Ctr { orig: _, name, args } => {
      format!("({}{})", name, args.iter().map(|x| format!(" {}",show_term(x))).collect::<String>())
    }
    Term::Fun { orig: _, name, args } => {
      format!("({}{})", name, args.iter().map(|x| format!(" {}",show_term(x))).collect::<String>())
    }
    Term::Hlp { orig: _ } => {
      format!("?")
    }
    Term::U60 { orig: _ } => {
      format!("U60")
    }
    Term::Num { orig: _, numb } => {
      format!("{}", numb)
    }
    Term::Op2 { orig: _, val0, val1 } => {
      let val0 = show_term(val0);
      let val1 = show_term(val1);
      format!("(+ {} {})", val0, val1)
    }
    Term::Hol { orig: _, numb } => {
      format!("_")
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

pub fn show_book(book: &Book) -> String {
  let mut lines = vec![];
  for name in &book.names {
    lines.push(show_entry(book.entrs.get(name).unwrap()));
  }
  lines.join("\n")
}

pub fn read_term(code: &str) -> Result<Box<Term>, String> {
  parser::read(Box::new(parse_term), code)
}

pub fn read_book(code: &str) -> Result<Box<Book>, String> {
  parser::read(Box::new(parse_book), code)
}

// Compiler
// ========

pub fn compile_term(term: &Term, quote: bool, lhs: bool) -> String { 
  fn hide(orig: &u64, lhs: bool) -> String {
    if lhs {
      "orig".to_string()
    } else {
      format!("{}", orig)
    }
  }
  match term {
    Term::Typ { orig } => {
      format!("(Typ {})", hide(orig,lhs))
    }
    Term::Var { orig, name } => {
      if lhs {
        format!("{}", name)
      } else {
        if quote {
          format!("(SO {} {})", orig, name.clone())
        } else {
          format!("{}", name.clone()) // spaces to align with quoted version
        }
      }
    }
    Term::All { orig, name, tipo, body } => {
      format!("(All {} {} {} λ{} {})", hide(orig,lhs), name_to_u64(name), compile_term(tipo, quote, lhs), name, compile_term(body, quote, lhs))
    }
    Term::Lam { orig, name, body } => {
      format!("(Lam {} {} λ{} {})", hide(orig,lhs), name_to_u64(name), name, compile_term(body, quote, lhs))
    }
    Term::App { orig, func, argm } => {
      format!("({} {} {} {})", if quote { "App" } else { "APP" }, hide(orig,lhs), compile_term(func, quote, lhs), compile_term(argm, quote, lhs))
    }
    Term::Let { orig, name, expr, body } => {
      format!("({} {} {} {} λ{} {})", if quote { "Let" } else { "LET" }, hide(orig,lhs), name_to_u64(name), compile_term(expr, quote, lhs), name, compile_term(body, quote, lhs))
    }
    Term::Ann { orig, expr, tipo } => {
      format!("({} {} {} {})", if quote { "Ann" } else { "ANN" }, hide(orig,lhs), compile_term(expr, quote, lhs), compile_term(tipo, quote, lhs))
    }
    Term::Ctr { orig, name, args } => {
      let mut args_strs : Vec<String> = Vec::new();
      for arg in args {
        args_strs.push(format!(" {}", compile_term(arg, quote, lhs)));
      }
      format!("(Ct{} {}. {}{})", args.len(), name, hide(orig,lhs), args_strs.join(""))
    }
    Term::Fun { orig, name, args } => {
      let mut args_strs : Vec<String> = Vec::new();
      for arg in args {
        args_strs.push(format!(" {}", compile_term(arg, quote, lhs)));
      }
      format!("({}{} {}. {}{})", if quote { "Fn" } else { "FN" }, args.len(), name, hide(orig,lhs), args_strs.join(""))
    }
    Term::Hlp { orig } => {
      format!("(Hlp {})", hide(orig,lhs))
    }
    Term::U60 { orig } => {
      format!("(U60 {})", hide(orig,lhs))
    }
    Term::Num { orig, numb } => {
      format!("(Num {} {})", hide(orig,lhs), numb)
    }
    Term::Op2 { orig, val0, val1 } => {
      format!("({} {} {} {})", if quote { "Op2" } else { "OP2" }, hide(orig,lhs), compile_term(val0, quote, lhs), compile_term(val1, quote, lhs))
    }
    Term::Hol { orig, numb } => {
      format!("(Hol {} {})", orig, numb)
    }
  }
}

pub fn compile_entry(entry: &Entry) -> String {
  fn compile_type(args: &Vec<Box<Argument>>, tipo: &Box<Term>, index: usize) -> String {
    if index < args.len() {
      let arg = &args[index];
      format!("(All {} {} {} λ{} {})", 0, name_to_u64(&arg.name), compile_term(&arg.tipo, false, false), arg.name, compile_type(args, tipo, index + 1))
    } else {
      compile_term(tipo, false, false)
    }
  }

  fn compile_rule(rule: &Rule) -> String {
    let mut pats = vec![];
    for pat in &rule.pats {
      pats.push(format!(" {}", compile_term(pat, false, true)));
    }
    let body_rhs = compile_term(&rule.body, true, false);
    let rule_rhs = compile_term(&rule.body, false, false);
    let mut text = String::new();
    text.push_str(&format!("(QT{} {}. orig{}) = {}\n", rule.pats.len(), rule.name, pats.join(""), body_rhs));
    text.push_str(&format!("(FN{} {}. orig{}) = {}\n", rule.pats.len(), rule.name, pats.join(""), rule_rhs));
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
      return format!("(RHS (QT{} {}. 0{}))", index, rule.name, args.iter().map(|x| format!(" {}", x)).collect::<Vec<String>>().join(""));
    }
  }

  fn compile_patt_chk(patt: &Term, vars: &mut u64) -> (String, String) {
    // FIXME: remove redundancy
    match patt {
      Term::Var { orig, name } => {
        let inp = format!("(Var {} {} {})", orig, name_to_u64(name), vars);
        let var = format!("(Var {} {} {})", orig, name_to_u64(name), vars);
        *vars += 1;
        return (inp, var);
      }
      Term::Ctr { orig, name, args } => {
        let mut inp_args_str = String::new();
        let mut var_args_str = String::new();
        for arg in args {
          let (inp_arg_str, var_arg_str) = compile_patt_chk(arg, vars);
          inp_args_str.push_str(&format!(" {}", inp_arg_str));
          var_args_str.push_str(&format!(" {}", var_arg_str));
        }
        let inp_str = format!("(Ct{} {}. {}{})", args.len(), name, orig, inp_args_str);
        let var_str = format!("(Ct{} {}. {}{})", args.len(), name, orig, var_args_str);
        return (inp_str, var_str);
      }
      _ => {
        panic!("Invalid left-hand side pattern: {}", show_term(patt));
      }
    }
  }

  let mut result = String::new();
  result.push_str(&format!("(NameOf {}.) = \"{}\"\n", entry.name, entry.name));
  result.push_str(&format!("(HashOf {}.) = %{}\n", entry.name, entry.name));
  result.push_str(&format!("(TypeOf {}.) = {}\n", entry.name, compile_type(&entry.args, &entry.tipo, 0)));
  for rule in &entry.rules {
    result.push_str(&compile_rule(&rule));
  }
  result.push_str(&format!("(Verify {}.) =", entry.name));
  for rule in &entry.rules {
    result.push_str(&format!(" (Cons {}", compile_rule_chk(&rule, 0, &mut 0, &mut vec![]))); 
  }
  result.push_str(&format!(" Nil{}", ")".repeat(entry.rules.len())));
  return result;
}

pub fn compile_book(book: &Book) -> String {
  let mut result = String::new();
  result.push_str(&format!("\nFunctions =\n"));
  result.push_str(&format!("  let fns = Nil\n"));
  for name in &book.names {
    let entry = book.entrs.get(name).unwrap();
    result.push_str(&format!("  let fns = (Cons {}. fns)\n", entry.    name));
  }
  result.push_str(&format!("  fns\n\n"));
  for name in &book.names {
    let entry = book.entrs.get(name).unwrap();
    result.push_str(&format!("\n// {}", name));
    result.push_str(&format!("\n// {}\n", "-".repeat(name.len())));
    result.push_str(&format!("\n"));
    result.push_str(&compile_entry(&entry));
    result.push_str(&format!("\n"));
  }
  result.push_str(&format!("\n// Default Cases"));
  result.push_str(&format!("\n// -------------\n\n"));
  for size in 0 .. 9 {
    let mut vars = vec![];
    for idx in 0 .. size {
      vars.push(format!(" x{}", idx));
    }
    result.push_str(&format!("(QT{} name orig{}) = (Fn{} name orig{})\n", size, vars.join(""), size, vars.join("")));
    result.push_str(&format!("(FN{} name orig{}) = (Fn{} name orig{})\n", size, vars.join(""), size, vars.join("")));
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
