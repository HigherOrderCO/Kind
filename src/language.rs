use std::collections::HashMap;
use std::collections::HashSet;
use hvm::parser as parser;

#[derive(Clone, Debug)]
pub struct Book {
  pub names: Vec<String>,
  pub entrs: HashMap<String, Box<Entry>>,
  pub holes: u64,
}

#[derive(Clone, Debug)]
pub struct Entry {
  pub name: String,
  pub args: Vec<Box<Argument>>,
  pub tipo: Box<Term>,
  pub rules: Vec<Box<Rule>>
}

#[derive(Clone, Debug)]
pub struct Argument {
  pub hide: bool,
  pub eras: bool,
  pub name: String,
  pub tipo: Box<Term>,
}

#[derive(Clone, Debug)]
pub struct Rule {
  pub orig: u64,
  pub name: String,
  pub pats: Vec<Box<Term>>,
  pub body: Box<Term>,
}

#[derive(Copy, Clone, Debug)]
pub enum Oper {
  Add,
  Sub,
  Mul,
  Div,
  Mod,
  And,
  Or,
  Xor,
  Shl,
  Shr,
  Ltn,
  Lte,
  Eql,
  Gte,
  Gtn,
  Neq,
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
  Op2 { orig: u64, oper: Oper, val0: Box<Term>, val1: Box<Term> },
  Hol { orig: u64, numb: u64 },
}

// TODO: indexed types
#[derive(Clone, Debug)]
pub struct NewType {
  pub name: String,
  pub pars: Vec<Box<Argument>>,
  pub ctrs: Vec<Box<Constructor>>,
}

#[derive(Clone, Debug)]
pub struct Constructor {
  pub name: String,
  pub args: Vec<Box<Argument>>,
}

#[derive(Clone, Debug)]
pub struct Derived {
  pub path: String,
  pub entr: Entry,
}

// Adjuster
// ========

#[derive(Clone, Debug)]
pub struct AdjustError {
  pub orig: u64,
  pub kind: AdjustErrorKind,
}

#[derive(Clone, Debug)]
pub enum AdjustErrorKind {
  IncorrectArity,
  UnboundVariable,
  RepeatedVariable,
}

pub fn new_book() -> Book {
  Book {
    names: vec![],
    entrs: HashMap::new(),
    holes: 0,
  }
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
  // Adjust the type arguments, return type
  let mut vars = Vec::new();
  for arg in &entry.args {
    vars.push(arg.name.clone());
    args.push(Box::new(adjust_argument(book, arg, holes, &mut vars)?));
  }
  let tipo = Box::new(adjust_term(book, &*entry.tipo, true, holes, &mut vars)?);
  // Adjusts each rule
  let mut rules = Vec::new();
  for rule in &entry.rules {
    let mut vars = Vec::new();
    rules.push(Box::new(adjust_rule(book, &*rule, holes, &mut vars)?));
  }
  return Ok(Entry { name, args, tipo, rules });
}

pub fn adjust_argument(book: &Book, arg: &Argument, holes: &mut u64, vars: &mut Vec<String>) -> Result<Argument, AdjustError> {
  let hide = arg.hide;
  let eras = arg.eras;
  let name = arg.name.clone();
  let tipo = Box::new(adjust_term(book, &*arg.tipo, true, holes, vars)?);
  return Ok(Argument { hide, eras, name, tipo });
}

pub fn adjust_rule(book: &Book, rule: &Rule, holes: &mut u64, vars: &mut Vec<String>) -> Result<Rule, AdjustError> {
  let name = rule.name.clone();
  let orig = rule.orig;
  let arity = match book.entrs.get(&rule.name) {
    Some(entry) => {
      if rule.pats.len() != entry.args.len() {
        return Err(AdjustError { orig, kind: AdjustErrorKind::IncorrectArity });
      }
    }
    // shouldn't happen, because we only parse rules after the type annotation
    None => {
      panic!("Untyped rule.");
    }
  };
  let mut pats = Vec::new();
  for pat in &rule.pats {
    pats.push(Box::new(adjust_term(book, &*pat, false, holes, vars)?));
  }
  let body = Box::new(adjust_term(book, &*rule.body, true, holes, vars)?);
  return Ok(Rule { orig, name, pats, body });
}

// TODO: prevent defining the same name twice
pub fn adjust_term(book: &Book, term: &Term, rhs: bool, holes: &mut u64, vars: &mut Vec<String>) -> Result<Term, AdjustError> {
  match *term {
    Term::Typ { orig } => {
      Ok(Term::Typ { orig })
    },
    Term::Var { ref orig, ref name } => {
      let orig = *orig;
      if rhs && vars.iter().find(|&x| x == name).is_none() {
        return Err(AdjustError { orig, kind: AdjustErrorKind::UnboundVariable });
      } else if !rhs && vars.iter().find(|&x| x == name).is_some() {
        return Err(AdjustError { orig, kind: AdjustErrorKind::RepeatedVariable });
      } else {
        vars.push(name.clone());
      }
      Ok(Term::Var { orig, name: name.clone() })
    },
    Term::Let { ref orig, ref name, ref expr, ref body } => {
      let orig = *orig;
      let expr = Box::new(adjust_term(book, &*expr, rhs, holes, vars)?);
      vars.push(name.clone());
      let body = Box::new(adjust_term(book, &*body, rhs, holes, vars)?);
      vars.pop();
      Ok(Term::Let { orig, name: name.clone(), expr, body })
    },
    Term::Ann { ref orig, ref expr, ref tipo } => {
      let orig = *orig;
      let expr = Box::new(adjust_term(book, &*expr, rhs, holes, vars)?);
      let tipo = Box::new(adjust_term(book, &*tipo, rhs, holes, vars)?);
      Ok(Term::Ann { orig, expr, tipo })
    },
    Term::All { ref orig, ref name, ref tipo, ref body } => {
      let orig = *orig;
      let tipo = Box::new(adjust_term(book, &*tipo, rhs, holes, vars)?);
      vars.push(name.clone());
      let body = Box::new(adjust_term(book, &*body, rhs, holes, vars)?);
      vars.pop();
      Ok(Term::All { orig, name: name.clone(), tipo, body })
    },
    Term::Lam { ref orig, ref name, ref body } => {
      let orig = *orig;
      vars.push(name.clone());
      let body = Box::new(adjust_term(book, &*body, rhs, holes, vars)?);
      vars.pop();
      Ok(Term::Lam { orig, name: name.clone(), body })
    },
    Term::App { ref orig, ref func, ref argm } => {
      let orig = *orig;
      let func = Box::new(adjust_term(book, &*func, rhs, holes, vars)?);
      let argm = Box::new(adjust_term(book, &*argm, rhs, holes, vars)?);
      Ok(Term::App { orig, func, argm })
    },
    Term::Ctr { ref orig, ref name, ref args } => {
      let orig = *orig;
      if let Some(entry) = book.entrs.get(name) {
        let mut new_args = Vec::new();
        for arg in args {
          new_args.push(Box::new(adjust_term(book, &*arg, rhs, holes, vars)?));
        }
        // Count implicit arguments
        let mut implicits = 0;
        for arg in &entry.args {
          if arg.hide {
            implicits = implicits + 1;
          }
        }
        // Fill implicit arguments
        if rhs && args.len() == entry.args.len() - implicits {
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
          Err(AdjustError { orig, kind: AdjustErrorKind::IncorrectArity })
        } else if entry.rules.len() > 0 {
          Ok(Term::Fun { orig, name: name.clone(), args: new_args })
        } else {
          Ok(Term::Ctr { orig, name: name.clone(), args: new_args })
        }
      } else {
        return Err(AdjustError { orig, kind: AdjustErrorKind::UnboundVariable });
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
    Term::Op2 { ref orig, ref oper, ref val0, ref val1 } => {
      let orig = *orig;
      let oper = *oper;
      let val0 = Box::new(adjust_term(book, &*val0, rhs, holes, vars)?);
      let val1 = Box::new(adjust_term(book, &*val1, rhs, holes, vars)?);
      Ok(Term::Op2 { orig, oper, val0, val1 })
    },
  }
}

// Find unbound variables
// ======================

pub fn book_get_unbounds(book: &Book) -> HashSet<String> {
  let mut names = Vec::new();
  let mut unbound = HashSet::new(); 
  for name in &book.names {
    let entry = book.entrs.get(name).unwrap();
    names.push(name.clone());
    entry_get_unbounds(book, &entry, &mut unbound);
  }
  return unbound;
}

pub fn entry_get_unbounds(book: &Book, entry: &Entry, unbound: &mut HashSet<String>) {
  let name = entry.name.clone();
  let mut vars = Vec::new();
  for arg in &entry.args {
    vars.push(arg.name.clone());
    argument_get_unbounds(book, arg, &mut vars, unbound);
  }
  term_get_unbounds(book, &*entry.tipo, true, &mut vars, unbound);
  for rule in &entry.rules {
    rule_get_unbounds(book, &*rule, &mut Vec::new(), unbound);
  }
}

pub fn argument_get_unbounds(book: &Book, arg: &Argument, vars: &mut Vec<String>, unbound: &mut HashSet<String>) {
  term_get_unbounds(book, &*arg.tipo, false, vars, unbound);
}

pub fn rule_get_unbounds(book: &Book, rule: &Rule, vars: &mut Vec<String>, unbound: &mut HashSet<String>) {
  for pat in &rule.pats {
    term_get_unbounds(book, &*pat, false, vars, unbound);
  }
  term_get_unbounds(book, &*rule.body, true, vars, unbound);
}

pub fn term_get_unbounds(book: &Book, term: &Term, rhs: bool, vars: &mut Vec<String>, unbound: &mut HashSet<String>) {
  match term {
    Term::Typ { .. } => {},
    Term::Var { ref name, .. } => {
      if rhs && vars.iter().find(|&x| x == name).is_none() {
        unbound.insert(name.clone());
      }
    },
    Term::Let { ref name, ref expr, ref body, .. } => {
      term_get_unbounds(book, &*expr, rhs, vars, unbound);
      vars.push(name.clone());
      term_get_unbounds(book, &*body, rhs, vars, unbound);
      vars.pop();
    },
    Term::Ann { ref expr, ref tipo, .. } => {
      term_get_unbounds(book, &*expr, rhs, vars, unbound);
      term_get_unbounds(book, &*tipo, rhs, vars, unbound);
    },
    Term::All { ref name, ref tipo, ref body, .. } => {
      term_get_unbounds(book, &*tipo, rhs, vars, unbound);
      vars.push(name.clone());
      term_get_unbounds(book, &*body, rhs, vars, unbound);
      vars.pop();
    },
    Term::Lam { ref name, ref body, .. } => {
      vars.push(name.clone());
      term_get_unbounds(book, &*body, rhs, vars, unbound);
      vars.pop();
    },
    Term::App { ref func, ref argm, .. } => {
      term_get_unbounds(book, &*func, rhs, vars, unbound);
      term_get_unbounds(book, &*argm, rhs, vars, unbound);
    },
    Term::Ctr { ref name, ref args, .. } => {
      unbound.insert(name.clone());
      for arg in args {
        term_get_unbounds(book, &*arg, rhs, vars, unbound);
      }
    },
    Term::Fun { ref name, ref args, .. } => {
      unbound.insert(name.clone());
      for arg in args {
        term_get_unbounds(book, &*arg, rhs, vars, unbound);
      }
    },
    Term::Op2 { ref val0, ref val1, .. } => {
      term_get_unbounds(book, &*val0, rhs, vars, unbound);
      term_get_unbounds(book, &*val1, rhs, vars, unbound);
    },
    Term::Hlp { .. } => {},
    Term::U60 { .. } => {},
    Term::Num { .. } => {},
    Term::Hol { .. } => {},
  }
}

// File Origin Injection
// =====================


pub fn book_set_origin_file(book: &mut Book, file: usize) {
  for entr in book.entrs.values_mut() {
    entry_set_origin_file(entr, file);
  }
}

pub fn entry_set_origin_file(entry: &mut Entry, file: usize) {
  for arg in &mut entry.args {
    term_set_origin_file(&mut *arg.tipo, file);
  }
  term_set_origin_file(&mut entry.tipo, file);
  for rule in &mut entry.rules {
    rule_set_origin_file(rule, file);
  }
}

pub fn rule_set_origin_file(rule: &mut Rule, file: usize) {
  for pat in &mut rule.pats {
    term_set_origin_file(pat, file);
  }
  term_set_origin_file(&mut rule.body, file);
}

pub fn term_set_origin_file(term: &mut Term, file: usize) {
  match term {
    Term::Typ { ref mut orig } => {
      *orig = set_origin_file(*orig, file);
    }
    Term::Var { ref mut orig, .. } => {
      *orig = set_origin_file(*orig, file);
    },
    Term::All { ref mut orig, ref mut name, ref mut tipo, ref mut body, .. } => {
      *orig = set_origin_file(*orig, file);
      term_set_origin_file(tipo, file);
      term_set_origin_file(body, file);
    },
    Term::Lam { ref mut orig, ref mut name, ref mut body, .. } => {
      *orig = set_origin_file(*orig, file);
      term_set_origin_file(body, file);
    },
    Term::App { ref mut orig, ref mut func, ref mut argm, .. } => {
      *orig = set_origin_file(*orig, file);
      term_set_origin_file(func, file);
      term_set_origin_file(argm, file);
    },
    Term::Let { ref mut orig, ref mut name, ref mut expr, ref mut body, .. } => {
      *orig = set_origin_file(*orig, file);
      term_set_origin_file(expr, file);
      term_set_origin_file(body, file);
    },
    Term::Ann { ref mut orig, ref mut expr, ref mut tipo } => {
      *orig = set_origin_file(*orig, file);
      term_set_origin_file(expr, file);
      term_set_origin_file(tipo, file);
    },
    Term::Ctr { ref mut orig, ref mut args, .. } => {
      *orig = set_origin_file(*orig, file);
      for arg in args {
        term_set_origin_file(&mut *arg, file);
      }
    },
    Term::Fun { ref mut orig, ref mut args, .. } => {
      *orig = set_origin_file(*orig, file);
      for arg in args {
        term_set_origin_file(&mut *arg, file);
      }
    },
    Term::Hlp { ref mut orig } => {
      *orig = set_origin_file(*orig, file);
    }
    Term::U60 { ref mut orig } => {
      *orig = set_origin_file(*orig, file);
    }
    Term::Num { ref mut orig, .. } => {
      *orig = set_origin_file(*orig, file);
    }
    Term::Op2 { ref mut orig, ref mut val0, ref mut val1, .. } => {
      *orig = set_origin_file(*orig, file);
      term_set_origin_file(val0, file);
      term_set_origin_file(val1, file);
    },
    Term::Hol { ref mut orig, .. } => {
      *orig = set_origin_file(*orig, file);
    }
  }
}

// Parser
// ======

pub fn origin(file: usize, init: usize, last: usize) -> u64 {
  ((file as u64) << 48) | ((init as u64) & 0xFFFFFF) | (((last as u64) & 0xFFFFFF) << 24)
}

pub fn set_origin_file(origin: u64, file: usize) -> u64 {
  (origin & 0xFFFFFFFFFFFF) | (((file as u64) & 0xFFF) << 48)
}

pub fn get_origin_range(origin: u64) -> (usize, usize, usize) {
  let file = (origin >> 48) as usize;
  let init = (origin & 0xFFFFFF) as usize;
  let last = ((origin >> 24) & 0xFFFFFF) as usize;
  (file, init, last)
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
      let orig          = origin(0, init, last);
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
      let orig          = origin(0, init, last);
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
      let orig          = origin(0, init, last);
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
      let orig          = origin(0, init, last);
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
                orig: origin(0, *app_init_index, *argm_last_index),
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

// TODO: can we avoid this duplicated logic by using macros or high-order functions?

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
      let orig          = origin(0, init, last);
      Ok((state, Box::new(Term::Let { orig, name, expr, body })))
    }),
    state);
}

pub fn parse_let_st(state: parser::State) -> parser::Answer<Option<Box<dyn Fn(&str) -> Box<Term>>>> {
  return parser::guard(
    parser::text_parser("let "),
    Box::new(|state| {
      let (state, init) = get_init_index(state)?;
      let (state, _)    = parser::consume("let ", state)?;
      let (state, name) = parse_var_name(state)?;
      let (state, _)    = parser::consume("=", state)?;
      let (state, expr) = parse_term(state)?;
      let (state, _)    = parser::text(";", state)?;
      let (state, body) = parse_term_st(state)?;
      let (state, last) = get_last_index(state)?;
      let orig          = origin(0, init, last);
      Ok((state, Box::new(move |monad| {
        Box::new(Term::Let {
          orig,
          name: name.clone(),
          expr: expr.clone(),
          body: body(monad),
        })
      })))
    }),
    state);
}

pub fn parse_if(state: parser::State) -> parser::Answer<Option<Box<Term>>> {
  return parser::guard(
    parser::text_parser("if "),
    Box::new(|state| {
      let (state, init) = get_init_index(state)?;
      let (state, _)    = parser::consume("if ", state)?;
      let (state, cond) = parse_term(state)?;
      let (state, _)    = parser::consume("{", state)?;
      let (state, if_t) = parse_term(state)?;
      let (state, _)    = parser::text("}", state)?;
      let (state, _)    = parser::text("else", state)?;
      let (state, _)    = parser::text("{", state)?;
      let (state, if_f) = parse_term(state)?;
      let (state, _)    = parser::text("}", state)?;
      let (state, last) = get_last_index(state)?;
      let orig = origin(0, init, last);
      let moti = Box::new(Term::Hol { orig, numb: 0 });
      Ok((state, Box::new(Term::Ctr {
        orig,
        name: "Bool.if".to_string(),
        args: vec![moti, cond, if_t, if_f],
      })))
    }),
    state);
}

pub fn parse_op2(state: parser::State) -> parser::Answer<Option<Box<Term>>> {
  fn is_op_char(chr: char) -> bool {
    matches!(chr, '+' | '-' | '*' | '/' | '%' | '&' | '|' | '^' | '<' | '>' | '=' | '!')
  }
  fn parse_oper(state: parser::State) -> parser::Answer<Oper> {
    fn op<'a>(symbol: &'static str, oper: Oper) -> parser::Parser<'a, Option<Oper>> {
      Box::new(move |state| {
        let (state, done) = parser::text(symbol, state)?;
        Ok((state, if done { Some(oper) } else { None }))
      })
    }
    parser::grammar("Oper", &[
      op("+"  , Oper::Add),
      op("-"  , Oper::Sub),
      op("*"  , Oper::Mul),
      op("/"  , Oper::Div),
      op("%"  , Oper::Mod),
      op("&"  , Oper::And),
      op("|"  , Oper::Or ),
      op("^"  , Oper::Xor),
      op("<<" , Oper::Shl),
      op(">>" , Oper::Shr),
      op("<"  , Oper::Ltn),
      op("<=" , Oper::Lte),
      op("==" , Oper::Eql),
      op(">=" , Oper::Gte),
      op(">"  , Oper::Gtn),
      op("!=" , Oper::Neq),
    ], state)
  }
  parser::guard(
    Box::new(|state| {
      let (state, open) = parser::text("(", state)?;
      let (state, head) = parser::get_char(state)?;
      Ok((state, open && is_op_char(head)))
    }),
    Box::new(|state| {
      let (state, init) = get_init_index(state)?;
      let (state, open) = parser::consume("(", state)?;
      let (state, oper) = parse_oper(state)?;
      let (state, val0) = parse_term(state)?;
      let (state, val1) = parse_term(state)?;
      let (state, open) = parser::consume(")", state)?;
      let (state, last) = get_last_index(state)?;
      let orig          = origin(0, init, last);
      Ok((state, Box::new(Term::Op2 { orig, oper, val0, val1 })))
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
        let orig          = origin(0, init, last);
        Ok((state, Box::new(Term::Typ { orig })))
      } else if name == "U60" {
        let (state, last) = get_last_index(state)?;
        let orig          = origin(0, init, last);
        Ok((state, Box::new(Term::U60 { orig })))
      } else {
        let (state, args) = if open {
          parser::until(parser::text_parser(")"), Box::new(parse_term), state)?
        } else {
          (state, Vec::new())
        };
        let (state, last) = get_last_index(state)?;
        let orig          = origin(0, init, last);
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
      let orig          = origin(0, init, last);
      Ok((state, Box::new(Term::Hol { orig, numb: 0 })))
    }),
    state,
  )
}

pub fn parse_hlp(state: parser::State) -> parser::Answer<Option<Box<Term>>> {
  return parser::guard(
    parser::text_parser("?"),
    Box::new(|state| {
      let (state, init) = get_init_index(state)?;
      let (state, _)    = parser::consume("?", state)?;
      let (state, name) = parser::name_here(state)?;
      let (state, last) = get_last_index(state)?;
      let orig          = origin(0, init, last);
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
        let orig = origin(0, init, last);
        let name = "_".to_string();
        let tipo = tipo.clone();
        let body = body.clone();
        Box::new(Term::All { orig, name, tipo, body })
      })))
    }),
    state,
  );
}

pub fn parse_ann(state: parser::State) -> parser::Answer<Option<Box<dyn Fn(usize, Box<Term>) -> Box<Term>>>> {
  return parser::guard(
    parser::text_parser("::"),
    Box::new(|state| {
      let (state, _)    = parser::consume("::", state)?;
      let (state, tipo) = parse_term(state)?;
      let (state, last) = get_last_index(state)?;
      Ok((state, Box::new(move |init, expr| {
        let orig = origin(0, init, last);
        let expr = expr.clone();
        let tipo = tipo.clone();
        Box::new(Term::Ann { orig, expr, tipo })
      })))
    }),
    state);
}

pub fn parse_lst(state: parser::State) -> parser::Answer<Option<Box<Term>>> {
  parser::guard(
    Box::new(|state| {
      let (state, head) = parser::get_char(state)?;
      Ok((state, head == '['))
    }),
    Box::new(|state| {
      let (state, init)  = get_init_index(state)?;
      let (state, _head) = parser::text("[", state)?;
      let state = state;
      let (state, elems) = parser::until(
        Box::new(|x| parser::text("]", x)),
        Box::new(|x| {
          let (state, term) = parse_term(x)?;
          let (state, _) = parser::maybe(Box::new(|x| parser::text(",", x)), state)?;
          Ok((state, term))
        }),
        state,
      )?;
      let (state, last) = get_last_index(state)?;
      let orig          = origin(0, init, last);
      let empty = Term::Ctr { orig, name: "List.nil".to_string(), args: Vec::new() };
      let list = Box::new(elems.iter().rfold(empty, |t, h| Term::Ctr {
        orig,
        name: "List.cons".to_string(),
        args: vec![h.clone(), Box::new(t)],
      }));
      Ok((state, list))
    }),
    state,
  )
}

// do List {
//   ask x = Action
//   ask Action
//   if x {
//    ...
//   } else {
//    ...
//   }
//   for x in list {
//    ...
//   }
//   return Action;
// }
// ------------------
// List.bind(Action, @x
// List.bind(Action, @~
// List.done(Action)))
pub fn parse_do(state: parser::State) -> parser::Answer<Option<Box<Term>>> {
  parser::guard(
    parser::text_parser("do "),
    Box::new(|state| {
      let (state, init) = get_init_index(state)?;
      let (state, _)    = parser::text("do", state)?;
      let (state, name) = parser::name1(state)?;
      let (state, _)    = parser::text("{", state)?;
      let (state, term) = parse_term_st(state)?;
      let (state, _)    = parser::text("}", state)?;
      let (state, last) = get_last_index(state)?;
      let orig = origin(0, init, last);
      Ok((state, term(&name)))
    }),
    state,
  )
}

//Box<dyn Fn(State<'a>) -> Answer<'a, A>>

// FIXME: can we avoid cloning "monad" repeatedly here?
pub fn parse_term_st(state: parser::State) -> parser::Answer<Box<dyn Fn(&str) -> Box<Term>>> {
  parser::grammar("Statement", &[
    Box::new(parse_return_st),
    Box::new(parse_ask_named_st),
    Box::new(parse_ask_anon_st),
    Box::new(parse_let_st),
    Box::new(|state| Ok((state, None)))
  ], state)
}

pub fn parse_return_st(state: parser::State) -> parser::Answer<Option<Box<dyn Fn(&str) -> Box<Term>>>> {
  return parser::guard(
    parser::text_parser("return "),
    Box::new(move |state| {
      let (state, init) = get_init_index(state)?;
      let (state, _)    = parser::consume("return ", state)?;
      let (state, term) = parse_term(state)?;
      let (state, last) = get_last_index(state)?;
      let orig          = origin(0, init, last);
      return Ok((state, Box::new(move |monad| Box::new(Term::Ctr {
        orig: orig,
        name: format!("{}.pure", monad),
        args: vec![term.clone()],
      }))));
    }),
    state);
}

pub fn parse_ask_named_st(state: parser::State) -> parser::Answer<Option<Box<dyn Fn(&str) -> Box<Term>>>> {
  return parser::guard(
    Box::new(|state| {
      let (state, all0) = parser::text("ask ", state)?;
      let (state, name) = parser::name(state)?;
      let (state, all1) = parser::text("=", state)?;
      Ok((state, all0 && name.len() > 0 && all1))
    }),
    Box::new(move |state| {
      let (state, init) = get_init_index(state)?;
      let (state, _)    = parser::consume("ask", state)?;
      let (state, name) = parser::name(state)?;
      let (state, _)    = parser::consume("=", state)?;
      let (state, acti) = parse_term(state)?;
      let (state, body) = parse_term_st(state)?;
      let (state, last) = get_last_index(state)?;
      let orig          = origin(0, init, last);
      return Ok((state, Box::new(move |monad| Box::new(Term::Ctr {
        orig: orig,
        name: format!("{}.bind", monad),
        args: vec![
          acti.clone(),
          Box::new(Term::Lam {
            orig,
            name: name.clone(),
            body: body(monad),
          })
        ],
      }))));
    }),
    state);
}

pub fn parse_ask_anon_st(state: parser::State) -> parser::Answer<Option<Box<dyn Fn(&str) -> Box<Term>>>> {
  return parser::guard(
    parser::text_parser("ask "),
    Box::new(move |state| {
      let (state, init) = get_init_index(state)?;
      let (state, _)    = parser::consume("ask", state)?;
      let (state, acti) = parse_term(state)?;
      let (state, body) = parse_term_st(state)?;
      let (state, last) = get_last_index(state)?;
      let name          = "_".to_string();
      let orig          = origin(0, init, last);
      return Ok((state, Box::new(move |monad| {
        Box::new(Term::Ctr {
          orig: orig,
          name: format!("{}.bind", monad),
          args: vec![
            acti.clone(),
            Box::new(Term::Lam {
              orig,
              name: name.clone(),
              body: body(monad),
            })
          ],
        })
      })));
    }),
    state);
}

pub fn parse_term_prefix(state: parser::State) -> parser::Answer<Box<Term>> {
  parser::grammar("Term", &[
    Box::new(parse_all), // `(name:`
    Box::new(parse_ctr), // `(Name`
    Box::new(parse_op2), // `(+`
    Box::new(parse_app), // `(`
    Box::new(parse_lst), // `[`
    Box::new(parse_lam), // `@`
    Box::new(parse_let), // `let `
    Box::new(parse_if),  // `if `
    Box::new(parse_do),  // `do `
    Box::new(parse_hlp), // `?`
    Box::new(parse_hol), // `_`
    Box::new(parse_num), // `#`
    Box::new(parse_var), // 
    Box::new(|state| Ok((state, None))),
  ], state)
}

pub fn parse_term_suffix(state: parser::State) -> parser::Answer<Box<dyn Fn(usize,Box<Term>) -> Box<Term>>> {
  parser::grammar("Term", &[
    Box::new(parse_arr), // `->`
    Box::new(parse_ann), // `::`
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
    (state, Box::new(Term::Hol { orig: 0, numb: u64::MAX })) // TODO: set orig
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
    let rules = vec![Box::new(Rule { orig: 0, name: name.clone(), pats, body })];
    return Ok((state, Box::new(Entry { name, args, tipo, rules })));
  } else {
    let mut rules = Vec::new();
    let rule_prefix = &format!("{} ", name); 
    let mut state = state;
    loop {
      let loop_state = state;
      let (loop_state, init) = get_init_index(state)?;
      let (loop_state, cont) = parser::text(&rule_prefix, loop_state)?;
      if cont {
        let (loop_state, rule) = parse_rule(loop_state, name.clone(), init)?;
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

pub fn parse_rule(state: parser::State, name: String, init: usize) -> parser::Answer<Box<Rule>> {
  let (state, pats) = parser::until(parser::text_parser("="), Box::new(parse_term), state)?;
  let (state, last) = get_last_index(state)?;
  let orig          = origin(0, init, last);
  let (state, body) = parse_term(state)?;
  return Ok((state, Box::new(Rule { orig, name, pats, body })));
}

pub fn parse_argument(state: parser::State) -> parser::Answer<Box<Argument>> {
  let (state, eras) = parser::text("-", state)?;
  let (state, keep) = parser::text("+", state)?;
  let (state, next) = parser::peek_char(state)?;
  let (open, close) = if next == '(' { ("(",")") } else { ("<",">") };
  let (state, _)    = parser::consume(open, state)?;
  let (state, name) = parse_var_name(state)?;
  let (state, anno) = parser::text(":", state)?;
  let (state, tipo) = if anno { parse_term(state)? } else { (state, Box::new(Term::Typ { orig: 0 })) };
  let (state, _)    = parser::consume(close, state)?;
  let hide          = open == "<";
  let eras          = if hide { !keep } else { eras };
  return Ok((state, Box::new(Argument { hide, eras, name, tipo })));
}

pub fn parse_book(state: parser::State) -> parser::Answer<Box<Book>> {
  let (state, entry_vec) = parser::until(Box::new(parser::done), Box::new(parse_entry), state)?;
  let mut names = Vec::new();
  let mut entrs = HashMap::new();
  for entry in entry_vec {
    if !entrs.contains_key(&entry.name) {
      names.push(entry.name.clone());
      entrs.insert(entry.name.clone(), entry);
    } else {
      println!("\x1b[33mwarning\x1b[0m: ignored redefinition of '{}'.", entry.name);
    }
  }
  return Ok((state, Box::new(Book { holes: 0, names, entrs })));
}

pub fn parse_new_type(state: parser::State) -> parser::Answer<Box<NewType>> {
  let (state, _)    = parser::consume("type", state)?;
  let (state, name) = parser::name1(state)?;
  let (state, pars) = parser::until(parser::text_parser("{"), Box::new(parse_argument), state)?;
  let mut ctrs = vec![];
  let mut state = state;
  loop {
    let state_i = state;
    let (state_i, ctr_name) = parser::name(state_i)?;
    if ctr_name.len() == 0 {
      break;
    }
    let mut ctr_args = vec![];
    let mut state_i = state_i;
    loop {
      let state_j = state_i;
      let (state_j, head) = parser::peek_char(state_j)?;
      if head != '(' {
        break;
      }
      let (state_j, ctr_arg) = parse_argument(state_j)?;
      ctr_args.push(ctr_arg);
      state_i = state_j;
    }
    ctrs.push(Box::new(Constructor { name: ctr_name, args: ctr_args }));
    state = state_i;
  }
  return Ok((state, Box::new(NewType { name, pars, ctrs })));
}

pub fn read_new_type(code: &str) -> Result<Box<NewType>, String> {
  parser::read(Box::new(parse_new_type), code)
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
    Term::Op2 { orig, oper, val0, val1 } => {
      // TODO: Add operator
      format!("({} {} {} {} {})", if quote { "Op2" } else { "OP2" }, hide(orig,lhs), compile_oper(oper), compile_term(val0, quote, lhs), compile_term(val1, quote, lhs))
    }
    Term::Hol { orig, numb } => {
      format!("(Hol {} {})", orig, numb)
    }
  }
}

pub fn compile_oper(oper: &Oper) -> String {
  match oper {
    Oper::Add => "ADD".to_string(),
    Oper::Sub => "SUB".to_string(),
    Oper::Mul => "MUL".to_string(),
    Oper::Div => "DIV".to_string(),
    Oper::Mod => "MOD".to_string(),
    Oper::And => "AND".to_string(),
    Oper::Or  => "OR" .to_string(),
    Oper::Xor => "XOR".to_string(),
    Oper::Shl => "SHL".to_string(),
    Oper::Shr => "SHR".to_string(),
    Oper::Ltn => "LTN".to_string(),
    Oper::Lte => "LTE".to_string(),
    Oper::Eql => "EQL".to_string(),
    Oper::Gte => "GTE".to_string(),
    Oper::Gtn => "GTN".to_string(),
    Oper::Neq => "NEQ".to_string(),
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
      Term::Num { orig, numb } => {
        let inp = format!("(Num {} {})", orig, numb);
        let var = format!("(Num {} {})", orig, numb);
        *vars += 1;
        return (inp, var);
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
    result.push_str(&format!(" (List.cons {}", compile_rule_chk(&rule, 0, &mut 0, &mut vec![]))); 
  }
  result.push_str(&format!(" List.nil{}", ")".repeat(entry.rules.len())));
  return result;
}

pub fn compile_book(book: &Book) -> String {
  let mut result = String::new();
  result.push_str(&format!("\nFunctions =\n"));
  result.push_str(&format!("  let fns = List.nil\n"));
  for name in &book.names {
    let entry = book.entrs.get(name).unwrap();
    result.push_str(&format!("  let fns = (List.cons {}. fns)\n", entry.    name));
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

// Stringification
// ===============

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
    Term::Op2 { orig: _, oper, val0, val1 } => {
      let oper = show_oper(oper);
      let val0 = show_term(val0);
      let val1 = show_term(val1);
      format!("({} {} {})", oper, val0, val1)
    }
    Term::Hol { orig: _, numb } => {
      format!("_")
    }
  }
}

pub fn show_oper(oper: &Oper) -> String {
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

pub fn show_rule(rule: &Rule) -> String {
  let name = &rule.name;
  let mut pats = vec![];
  for pat in &rule.pats {
    pats.push(" ".to_string());
    pats.push(show_term(pat));
  }
  let body = show_term(&rule.body);
  format!("{}{} = {}", name, pats.join(""), body)
}

pub fn show_entry(entry: &Entry) -> String {
  let name = &entry.name;
  let mut args = vec![];
  for arg in &entry.args {
    let (open, close) = match (arg.eras, arg.hide) {
      (false, false) => ("(", ")"),
      (false, true ) => ("-(", ")"),
      (true , false) => ("+<", ">"),
      (true , true ) => ("<", ">"),
    };
    args.push(format!(" {}{}: {}{}", open, arg.name, show_term(&arg.tipo), close));
  }
  if entry.rules.len() == 0 {
    format!("{}{} : {}", name, args.join(""), show_term(&entry.tipo))
  } else {
    let mut rules = vec![];
    for rule in &entry.rules {
      rules.push(format!("\n{}", show_rule(rule)));
    }
    format!("{}{} : {}{}\n", name, args.join(""), show_term(&entry.tipo), rules.join(""))
  }
}

pub fn show_book(book: &Book) -> String {
  let mut lines = vec![];
  for name in &book.names {
    lines.push(show_entry(book.entrs.get(name).unwrap()));
  }
  lines.join("\n\n")
}

// Utils
// =====

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

// Derivers
// ========

pub fn derive_type(tipo: &NewType) -> Derived {
  let path = format!("{}/_.kind2", tipo.name);
  let name = format!("{}", tipo.name);
  let mut args = vec![];
  for par in &tipo.pars {
    args.push(Box::new(Argument {
      hide: false,
      eras: false,
      name: par.name.clone(),
      tipo: par.tipo.clone(),
    }));
  }
  let tipo = Box::new(Term::Typ { orig: 0 });
  let rules = vec![];
  let entr = Entry { name, args, tipo, rules };
  return Derived { path, entr };
}

pub fn derive_ctr(tipo: &NewType, index: usize) -> Derived {
  if let Some(ctr) = tipo.ctrs.get(index) {
    let path = format!("{}/{}.kind2", tipo.name, ctr.name);
    let name = format!("{}.{}", tipo.name, ctr.name);
    let mut args = vec![];
    for arg in &tipo.pars {
      args.push(arg.clone());
    }
    for arg in &ctr.args {
      args.push(arg.clone());
    }
    let tipo = Box::new(Term::Ctr {
      orig: 0,
      name: tipo.name.clone(),
      args: tipo.pars.iter().map(|x| Box::new(Term::Var { orig: 0, name: x.name.clone() })).collect(),
    });
    let rules = vec![];
    let entr = Entry { name, args, tipo, rules };
    return Derived { path, entr };
  } else {
    panic!("Constructor out of bounds.");
  }
}

pub fn derive_match(ntyp: &NewType) -> Derived {
  // type List <t: Type> { nil cons (head: t) (tail: (List t)) }
  // -----------------------------------------------------------
  // List.match <t: Type> (x: (List t)) <p: (List t) -> Type> (nil: (p (List.nil t))) (cons: (head: t) (tail: (List t)) (p (List.cons t head tail))) : (p x)
  // List.match t (List.nil t)            p nil cons = nil
  // List.match t (List.cons t head tail) p nil cons = (cons head tail)

  let path = format!("{}/match.kind2", ntyp.name);

  fn gen_type_ctr(ntyp: &NewType) -> Box<Term> {
    Box::new(Term::Ctr {
      orig: 0,
      name: ntyp.name.clone(),
      args: ntyp.pars.iter().map(|x| Box::new(Term::Var { orig: 0, name: x.name.clone() })).collect(),
    })
  }

  fn gen_ctr_value(ntyp: &NewType, ctr: &Box<Constructor>, index: usize) -> Box<Term> {
    let mut ctr_value_args = vec![];
    for par in &ntyp.pars {
      ctr_value_args.push(Box::new(Term::Var { orig: 0, name: par.name.clone() }));
    }
    for fld in &ctr.args {
      ctr_value_args.push(Box::new(Term::Var { orig: 0, name: fld.name.clone() }));
    }
    let ctr_value = Box::new(Term::Ctr {
      orig: 0,
      name: format!("{}.{}", ntyp.name, ctr.name),
      args: ctr_value_args,
    });
    return ctr_value;
  }

  // List.match
  let name = format!("{}.match", ntyp.name);

  let mut args = vec![];

  //  <t: Type>
  for par in &ntyp.pars {
    args.push(Box::new(Argument {
      hide: true,
      eras: true,
      name: par.name.clone(),
      tipo: par.tipo.clone(),
    }));
  }

  // (x: (List t))
  args.push(Box::new(Argument {
    eras: false,
    hide: false,
    name: "x".to_string(),
    tipo: gen_type_ctr(ntyp),
  }));

  // <p: (List t) -> Type>
  args.push(Box::new(Argument {
    eras: true,
    hide: true,
    name: "p".to_string(),
    tipo: Box::new(Term::All {
      orig: 0,
      name: "x".to_string(),
      tipo: gen_type_ctr(ntyp),
      body: Box::new(Term::Typ { orig: 0 }),
    })
  }));

  // (nil: (p (List.nil t)))
  // (cons: (head t) (tail: (List t)) (p (List.cons t head tail)))
  for ctr in &ntyp.ctrs {
    fn ctr_case_type(ntyp: &NewType, ctr: &Box<Constructor>, index: usize) -> Box<Term> {
      if index < ctr.args.len() {
        // for nil  = ...
        // for cons = (head: t) (tail: (List t))
        let arg = ctr.args.get(index).unwrap();
        return Box::new(Term::All {
          orig: 0,
          name: arg.name.clone(),
          tipo: arg.tipo.clone(),
          body: ctr_case_type(ntyp, ctr, index + 1),
        });
      } else {
        // for nil  = (p (List.nil t))
        // for cons = (p (List.cons t head tail))
        return Box::new(Term::App {
          orig: 0,
          func: Box::new(Term::Var { orig: 0, name: "p".to_string() }),
          argm: gen_ctr_value(ntyp, ctr, index),
        });
      }
    }
    args.push(Box::new(Argument {
      eras: false,
      hide: false,
      name: ctr.name.clone(),
      tipo: ctr_case_type(ntyp, &ctr, 0),
    }));
  }

  // : (p x)
  let tipo = Box::new(Term::App {
    orig: 0,
    func: Box::new(Term::Var { orig: 0, name: "p".to_string() }),
    argm: Box::new(Term::Var { orig: 0, name: "x".to_string() }),
  });

  // List.match t (List.nil t)            p nil cons = nil
  // List.match t (List.cons t head tail) p nil cons = (cons head tail)
  let mut rules = vec![];

  for idx in 0 .. ntyp.ctrs.len() {
    let ctr  = &ntyp.ctrs[idx];
    let orig = 0;
    let name = format!("{}.match", ntyp.name);
    let mut pats = vec![];
    for par in &ntyp.pars {
      pats.push(Box::new(Term::Var { orig: 0, name: par.name.clone() }));
    }
    pats.push(gen_ctr_value(ntyp, &ctr, idx));
    pats.push(Box::new(Term::Var { orig: 0, name: "p".to_string() }));
    for ctr in &ntyp.ctrs {
      pats.push(Box::new(Term::Var { orig: 0, name: ctr.name.clone() }));
    }
    let mut body_args = vec![];
    for arg in &ctr.args {
      body_args.push(Box::new(Term::Var { orig: 0, name: arg.name.clone() }));
    }
    let body = Box::new(Term::Ctr {
      orig: 0,
      name: ctr.name.clone(),
      args: body_args,
    });
    rules.push(Box::new(Rule { orig, name, pats, body }));
  }

  let entr = Entry { name, args, tipo, rules };

  return Derived { path, entr };
}

//type List <t: Type> { nil cons (head: t) (tail: (List t)) }
//pub struct Type { name: String, pars: Vec<Argument>, ctrs: Vec<Constructor> }
//pub struct Constructor { name: String, args: Vec<Argument> }
//pub struct Entry { pub name: String, pub args: Vec<Box<Argument>>, pub tipo: Box<Term>, pub rules: Vec<Box<Rule>> }
//pub struct Argument { pub hide: bool, pub eras: bool, pub name: String, pub tipo: Box<Term> }
//pub struct Rule { pub orig: u64, pub name: String, pub pats: Vec<Box<Term>>, pub body: Box<Term> }
// List (t: Type) : Type
// List.nil (t: Type) : (List t)
// List.cons (t: Type) (head: t) (tail: (List t)) : (List t)
// List.match <t: Type> (x: (List t))
//   <p: (List t) -> Type>
//   (nil: (p (List.nil t)))
//   (cons: (head: t) (tail: (List t)) (p (List.cons t head tail)))
// : (p x)
// List.match t (List.nil t)            p nil cons = nil
// List.match t (List.cons t head tail) p nil cons = (cons head tail)
