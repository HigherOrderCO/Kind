use std::collections::HashMap;
use std::collections::HashSet;
use hvm::parser as parser;
use std::rc::Rc;
use std::ascii;

#[derive(Clone, Debug)]
pub struct Book {
  pub names: Vec<String>,
  pub entrs: HashMap<String, Box<Entry>>,
  pub holes: u64,
}

#[derive(Clone, Debug)]
pub struct Entry {
  pub name: String,
  pub kdln: Option<String>,
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
  Sub { orig: u64, name: String, indx: u64, redx: u64, expr: Box<Term> },
  Ctr { orig: u64, name: String, args: Vec<Box<Term>> },
  Fun { orig: u64, name: String, args: Vec<Box<Term>> },
  Hlp { orig: u64 },
  U60 { orig: u64 },
  Num { orig: u64, numb: u64 },
  Op2 { orig: u64, oper: Oper, val0: Box<Term>, val1: Box<Term> },
  Hol { orig: u64, numb: u64 },
  Mat { orig: u64, tipo: String, name: String, expr: Box<Term>, cses: Vec<(String,Box<Term>)>, moti: Box<Term> },
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
  UnboundVariable { name: String },
  RepeatedVariable,
  CantLoadType,
  NoCoverage,
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
  let mut types = HashMap::new();
  let mut holes = 0;
  for name in &book.names {
    let entry = book.entrs.get(name).unwrap();
    names.push(name.clone());
    entrs.insert(name.clone(), Box::new(adjust_entry(book, &entry, &mut holes, &mut types)?));
  }
  return Ok(Book { names, entrs, holes });
}

pub fn adjust_entry(book: &Book, entry: &Entry, holes: &mut u64, types: &mut HashMap<String, Rc<NewType>>) -> Result<Entry, AdjustError> {
  let name = entry.name.clone();
  let kdln = entry.kdln.clone();
  let mut args = Vec::new();
  // Adjust the type arguments, return type
  let mut vars = Vec::new();
  for arg in &entry.args {
    args.push(Box::new(adjust_argument(book, arg, holes, &mut vars, types)?));
    vars.push(arg.name.clone());
  }
  let tipo = Box::new(adjust_term(book, &*entry.tipo, true, &mut 0, holes, &mut vars, types)?);
  // Adjusts each rule
  let mut rules = Vec::new();
  for rule in &entry.rules {
    let mut vars = Vec::new();
    rules.push(Box::new(adjust_rule(book, &*rule, holes, &mut vars, types)?));
  }
  return Ok(Entry { name, kdln, args, tipo, rules });
}

pub fn adjust_argument(book: &Book, arg: &Argument, holes: &mut u64, vars: &mut Vec<String>, types: &mut HashMap<String, Rc<NewType>>) -> Result<Argument, AdjustError> {
  let hide = arg.hide;
  let eras = arg.eras;
  let name = arg.name.clone();
  let tipo = Box::new(adjust_term(book, &*arg.tipo, true, &mut 0, holes, vars, types)?);
  return Ok(Argument { hide, eras, name, tipo });
}

pub fn adjust_rule(book: &Book, rule: &Rule, holes: &mut u64, vars: &mut Vec<String>, types: &mut HashMap<String, Rc<NewType>>) -> Result<Rule, AdjustError> {
  let name = rule.name.clone();
  let orig = rule.orig;
  // shouldn't panic, because we only parse rules after the type annotation
  let entry = book.entrs.get(&rule.name).expect("Untyped rule.");
  let mut eras = 0;
  let mut pats = Vec::new();
  for pat in &rule.pats {
    if let Term::Hol {orig, numb} = &**pat {
      // On lhs, switch holes for vars
      // TODO: This duplicates of adjust_term because the lhs of a rule is not a term
      let name = format!("x{}_", eras);
      eras = eras + 1;
      let pat = Term::Var { orig: *orig, name };
      pats.push(Box::new(adjust_term(book, &pat, false, &mut eras, holes, vars, types)?));
    } else {
      pats.push(Box::new(adjust_term(book, pat, false, &mut eras, holes, vars, types)?));
    }
  }
  // Fill erased arguments
  let (_, eraseds) = count_implicits(entry);
  if rule.pats.len() == entry.args.len() - eraseds {
    pats.reverse();
    let mut aux_pats = Vec::new();
    for arg in &entry.args {
      if arg.eras {
        let name = format!("{}{}_", arg.name, eras);
        eras = eras + 1;
        let pat = Box::new(Term::Var { orig, name });
        aux_pats.push(Box::new(adjust_term(book, &*pat, false, &mut eras, holes, vars, types)?));
      } else {
        aux_pats.push(pats.pop().unwrap());
      }
    }
    pats = aux_pats;
  }
  if pats.len() != entry.args.len() {
    return Err(AdjustError { orig, kind: AdjustErrorKind::IncorrectArity });
  }
  let body = Box::new(adjust_term(book, &*rule.body, true, &mut eras, holes, vars, types)?);
  return Ok(Rule { orig, name, pats, body });
}

// TODO: prevent defining the same name twice
pub fn adjust_term(book: &Book, term: &Term, rhs: bool, eras: &mut u64, holes: &mut u64, vars: &mut Vec<String>, types: &mut HashMap<String, Rc<NewType>>) -> Result<Term, AdjustError> {

  fn convert_apps_to_ctr(term: &Term) -> Option<Term> {
    //println!("converting {} to ctr", show_term(term));
    let mut term = term;
    let ctr_name;
    let mut ctr_orig = get_term_origin(term);
    let mut ctr_args = vec![];
    loop {
      match term {
        Term::App { ref orig, ref func, ref argm } => {
          ctr_args.push(argm);
          if ctr_orig == 0 {
            ctr_orig = *orig;
          }
          term = func;
        },
        Term::Var { ref name, .. } => {
          if !name.chars().nth(0).unwrap_or(' ').is_uppercase() {
            return None;
          } else {
            ctr_name = name.clone();
            break;
          }
        },
        _ => {
          return None;
        }
      }
    }
    if ctr_name == "Type" {
      return Some(Term::Typ {
        orig: ctr_orig,
      });
    } else if ctr_name == "U60" {
      return Some(Term::U60 {
        orig: ctr_orig,
      });
    } else {
      return Some(Term::Ctr {
        orig: ctr_orig,
        name: ctr_name,
        args: ctr_args.iter().rev().map(|x| (*x).clone()).collect(),
      });
    }
  }

  if let Some(new_term) = convert_apps_to_ctr(term) {
    return adjust_term(book, &new_term, rhs, eras, holes, vars, types);
  }

  match *term {
    Term::Typ { orig } => {
      Ok(Term::Typ { orig })
    },
    Term::Var { ref orig, ref name } => {
      let orig = *orig;
      if rhs && vars.iter().find(|&x| x == name).is_none() {
        return Err(AdjustError { orig, kind: AdjustErrorKind::UnboundVariable { name: name.clone() } });
      } else if !rhs && vars.iter().find(|&x| x == name).is_some() {
        return Err(AdjustError { orig, kind: AdjustErrorKind::RepeatedVariable });
      } else if !rhs {
        vars.push(name.clone());
      }
      Ok(Term::Var { orig, name: name.clone() })
    },
    Term::Let { ref orig, ref name, ref expr, ref body } => {
      let orig = *orig;
      let expr = Box::new(adjust_term(book, &*expr, rhs, eras, holes, vars, types)?);
      vars.push(name.clone());
      let body = Box::new(adjust_term(book, &*body, rhs, eras, holes, vars, types)?);
      vars.pop();
      Ok(Term::Let { orig, name: name.clone(), expr, body })
    },
    Term::Ann { ref orig, ref expr, ref tipo } => {
      let orig = *orig;
      let expr = Box::new(adjust_term(book, &*expr, rhs, eras, holes, vars, types)?);
      let tipo = Box::new(adjust_term(book, &*tipo, rhs, eras, holes, vars, types)?);
      Ok(Term::Ann { orig, expr, tipo })
    },
    Term::Sub { ref orig, ref name, ref indx, ref redx, ref expr } => {
      let orig = *orig;
      let expr = Box::new(adjust_term(book, &*expr, rhs, eras, holes, vars, types)?);
      match vars.iter().position(|x| x == name) {
        None => {
          return Err(AdjustError { orig, kind: AdjustErrorKind::UnboundVariable { name: name.clone() } });
        }
        Some(indx) => {
          let name = name.clone();
          let indx = indx as u64;
          let redx = *redx;
          Ok(Term::Sub { orig, name, indx, redx, expr })
        }
      }
    },
    Term::All { ref orig, ref name, ref tipo, ref body } => {
      let orig = *orig;
      let tipo = Box::new(adjust_term(book, &*tipo, rhs, eras, holes, vars, types)?);
      vars.push(name.clone());
      let body = Box::new(adjust_term(book, &*body, rhs, eras, holes, vars, types)?);
      vars.pop();
      Ok(Term::All { orig, name: name.clone(), tipo, body })
    },
    Term::Lam { ref orig, ref name, ref body } => {
      let orig = *orig;
      vars.push(name.clone());
      let body = Box::new(adjust_term(book, &*body, rhs, eras, holes, vars, types)?);
      vars.pop();
      Ok(Term::Lam { orig, name: name.clone(), body })
    },
    Term::App { ref orig, ref func, ref argm } => {
      let orig = *orig;
      let func = Box::new(adjust_term(book, &*func, rhs, eras, holes, vars, types)?);
      let argm = Box::new(adjust_term(book, &*argm, rhs, eras, holes, vars, types)?);
      Ok(Term::App { orig, func, argm })
    },
    Term::Ctr { ref orig, ref name, ref args } => {
      let orig = *orig;
      if let Some(entry) = book.entrs.get(name) {
        let mut new_args = Vec::new();
        for arg in args {
          // On lhs, switch holes for vars
          if let (false, Term::Hol {orig, numb}) = (rhs, &**arg) {
            let name = format!("x{}_", eras);
            *eras = *eras + 1;
            let arg = Box::new(Term::Var { orig: *orig, name });
            new_args.push(Box::new(adjust_term(book, &*arg, rhs, eras, holes, vars, types)?));
          } else {
            new_args.push(Box::new(adjust_term(book, arg, rhs, eras, holes, vars, types)?));
          }
        }
        let (hiddens, eraseds) = count_implicits(entry);
        // Fill implicit arguments (on rhs)
        if rhs && args.len() == entry.args.len() - hiddens {
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
        // Fill erased arguments (on lhs)
        if !rhs && args.len() == entry.args.len() - eraseds {
          new_args.reverse();
          let mut aux_args = Vec::new();
          for arg in &entry.args {
            if arg.eras {
              let name = format!("{}{}_", arg.name, eras);
              *eras = *eras + 1;
              let arg = Term::Var { orig: orig, name };
              aux_args.push(Box::new(adjust_term(book, &arg, rhs, eras, holes, vars, types)?));
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
        return Err(AdjustError { orig, kind: AdjustErrorKind::UnboundVariable { name: name.clone() } });
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
      let val0 = Box::new(adjust_term(book, &*val0, rhs, eras, holes, vars, types)?);
      let val1 = Box::new(adjust_term(book, &*val1, rhs, eras, holes, vars, types)?);
      Ok(Term::Op2 { orig, oper, val0, val1 })
    },
    Term::Mat { ref orig, ref name, ref tipo, ref expr, ref cses, ref moti } => {
      // pub struct NewType { pub name: String, pub pars: Vec<Box<Argument>>, pub ctrs: Vec<Box<Constructor>>, }
      // pub struct Constructor { pub name: String, pub args: Vec<Box<Argument>>, }
      // pub struct Argument { pub hide: bool, pub eras: bool, pub name: String, pub tipo: Box<Term>, }
      // pub struct Derived { pub path: String, pub entr: Entry, }
      // Mat { orig: u64, tipo: String, name: String, expr: Box<Term>, cses: Vec<(String,Box<Term>)>, moti: Option<Box<Term>> },
      // match List xs { nil  => A cons => B } : R
      // type List <a: Type> { nil cons (head: a) (tail: (List a)) }
      // (List.match (@xs R) (A) (@xs.head @xs.tail B))
      let orig = *orig;
      if let Ok(newtype) = load_newtype_cached(types, tipo) {
        let mut args = vec![];

        // Builds expr
        args.push(expr.clone());

        // Builds Motive
        args.push(Box::new(Term::Lam {
          orig: get_term_origin(moti),
          name: name.clone(),
          body: moti.clone(),
        }));

        // Builds Cases
        if newtype.ctrs.len() != cses.len() {
          return Err(AdjustError { orig, kind: AdjustErrorKind::NoCoverage });
        }
        for ctr in &newtype.ctrs {
          if let Some(cse) = cses.iter().find(|x| x.0 == ctr.name) {
            let mut case_term = cse.1.clone();
            for arg in ctr.args.iter().rev() {
              case_term = Box::new(Term::Lam {
                orig: get_term_origin(&case_term),
                name: format!("{}.{}", name, arg.name),
                body: case_term,
              });
            }
            args.push(case_term);
          } else {
            return Err(AdjustError { orig, kind: AdjustErrorKind::NoCoverage });
          }
        }

        let result = Term::Ctr { orig, name: format!("{}.match", tipo), args };
        //println!("-- match desugar: {}", show_term(&result));
        return adjust_term(book, &result, rhs, eras, holes, vars, types);

      } else {
        return Err(AdjustError { orig, kind: AdjustErrorKind::CantLoadType });
      }
    },
  }
}

// Find unbound variables
// ======================

pub fn book_get_unbounds(book: &Book) -> HashSet<String> {
  let mut names = Vec::new();
  let mut types = HashMap::new();
  let mut unbound = HashSet::new();
  for name in &book.names {
    let entry = book.entrs.get(name).unwrap();
    names.push(name.clone());
    entry_get_unbounds(book, &entry, &mut unbound, &mut types);
  }
  return unbound;
}

pub fn entry_get_unbounds(book: &Book, entry: &Entry, unbound: &mut HashSet<String>, types: &mut HashMap<String, Rc<NewType>>) {
  let name = entry.name.clone();
  let mut vars = Vec::new();
  for arg in &entry.args {
    argument_get_unbounds(book, arg, &mut vars, unbound, types);
    vars.push(arg.name.clone());
  }
  term_get_unbounds(book, &*entry.tipo, true, &mut vars, unbound, types);
  for rule in &entry.rules {
    rule_get_unbounds(book, &*rule, &mut Vec::new(), unbound, types);
  }
}

pub fn argument_get_unbounds(book: &Book, arg: &Argument, vars: &mut Vec<String>, unbound: &mut HashSet<String>, types: &mut HashMap<String, Rc<NewType>>) {
  term_get_unbounds(book, &*arg.tipo, true, vars, unbound, types);
}

pub fn rule_get_unbounds(book: &Book, rule: &Rule, vars: &mut Vec<String>, unbound: &mut HashSet<String>, types: &mut HashMap<String, Rc<NewType>>) {
  for pat in &rule.pats {
    term_get_unbounds(book, &*pat, false, vars, unbound, types);
  }
  term_get_unbounds(book, &*rule.body, true, vars, unbound, types);
}

pub fn term_get_unbounds(book: &Book, term: &Term, rhs: bool, vars: &mut Vec<String>, unbound: &mut HashSet<String>, types: &mut HashMap<String, Rc<NewType>>) {
  match term {
    Term::Typ { .. } => {},
    Term::Var { ref name, .. } => {
      // Is constructor name
      if ('A'..='Z').contains(&name.chars().nth(0).unwrap_or(' ')) {
        unbound.insert(name.clone());
      // Is unbound variable
      } else if vars.iter().find(|&x| x == name).is_none() {
        if rhs {
          unbound.insert(name.clone());
        } else {
          vars.push(name.clone());
        }
      }
    },
    Term::Let { ref name, ref expr, ref body, .. } => {
      term_get_unbounds(book, &*expr, rhs, vars, unbound, types);
      vars.push(name.clone());
      term_get_unbounds(book, &*body, rhs, vars, unbound, types);
      vars.pop();
    },
    Term::Ann { ref expr, ref tipo, .. } => {
      term_get_unbounds(book, &*expr, rhs, vars, unbound, types);
      term_get_unbounds(book, &*tipo, rhs, vars, unbound, types);
    },
    Term::Sub { ref name, ref expr, .. } => {
      term_get_unbounds(book, &*expr, rhs, vars, unbound, types);
    },
    Term::All { ref name, ref tipo, ref body, .. } => {
      term_get_unbounds(book, &*tipo, rhs, vars, unbound, types);
      vars.push(name.clone());
      term_get_unbounds(book, &*body, rhs, vars, unbound, types);
      vars.pop();
    },
    Term::Lam { ref name, ref body, .. } => {
      vars.push(name.clone());
      term_get_unbounds(book, &*body, rhs, vars, unbound, types);
      vars.pop();
    },
    Term::App { ref func, ref argm, .. } => {
      term_get_unbounds(book, &*func, rhs, vars, unbound, types);
      term_get_unbounds(book, &*argm, rhs, vars, unbound, types);
    },
    // not reached normally
    Term::Ctr { ref name, ref args, .. } => {
      unbound.insert(name.clone());
      for arg in args {
        term_get_unbounds(book, &*arg, rhs, vars, unbound, types);
      }
    },
    // not reached normally
    Term::Fun { ref name, ref args, .. } => {
      unbound.insert(name.clone());
      for arg in args {
        term_get_unbounds(book, &*arg, rhs, vars, unbound, types);
      }
    },
    Term::Op2 { ref val0, ref val1, .. } => {
      term_get_unbounds(book, &*val0, rhs, vars, unbound, types);
      term_get_unbounds(book, &*val1, rhs, vars, unbound, types);
    },
    Term::Hlp { .. } => {},
    Term::U60 { .. } => {},
    Term::Num { .. } => {},
    Term::Hol { .. } => {},
    Term::Mat { ref tipo, ref name, ref expr, ref cses, ref moti, .. } => {
      //println!("finding unbounds of match {} {}", tipo, name);
      if let Ok(newtype) = load_newtype_cached(types, tipo) {
        unbound.insert(format!("{}.match", tipo.clone()));
        // Expr
        term_get_unbounds(book, &*expr, rhs, vars, unbound, types);
        // Motive
        vars.push(name.clone());
        term_get_unbounds(book, &*moti, rhs, vars, unbound, types);
        vars.pop();
        // Cases
        for ctr in &newtype.ctrs {
          if let Some(cse) = cses.iter().find(|x| x.0 == ctr.name) {
            for arg in ctr.args.iter().rev() {
              vars.push(arg.name.clone());
            }
            term_get_unbounds(book, &*cse.1, rhs, vars, unbound, types);
            for _ in ctr.args.iter().rev() {
              vars.pop();
            }
          }
        }
      }
    },
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
    Term::Sub { ref mut orig, ref mut expr, .. } => {
      *orig = set_origin_file(*orig, file);
      term_set_origin_file(expr, file);
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
    },
    Term::Mat { ref mut orig, ref mut expr, ref mut cses, ref mut moti, .. } => {
      *orig = set_origin_file(*orig, file);
      term_set_origin_file(expr, file);
      for cse in cses {
        term_set_origin_file(&mut *cse.1, file);
      }
      term_set_origin_file(moti, file);
    },
  }
}

pub fn get_term_origin(term: &Term) -> u64 {
  match term {
    Term::Typ { orig, .. } => *orig,
    Term::Var { orig, .. } => *orig,
    Term::All { orig, .. } => *orig,
    Term::Lam { orig, .. } => *orig,
    Term::App { orig, .. } => *orig,
    Term::Let { orig, .. } => *orig,
    Term::Ann { orig, .. } => *orig,
    Term::Sub { orig, .. } => *orig,
    Term::Ctr { orig, .. } => *orig,
    Term::Fun { orig, .. } => *orig,
    Term::Hlp { orig, .. } => *orig,
    Term::U60 { orig, .. } => *orig,
    Term::Num { orig, .. } => *orig,
    Term::Op2 { orig, .. } => *orig,
    Term::Hol { orig, .. } => *orig,
    Term::Mat { orig, .. } => *orig,
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

// Like parser::peek_char, but won't skip newlines and comments
pub fn peek_char_local(state: parser::State) -> parser::Answer<char> {
  let (state, _) = parser::skip_while(state, Box::new(|x| *x == ' '))?;
  if let Some(got) = parser::head(state) {
    return Ok((state, got));
  } else {
    return Ok((state, '\0'));
  }
}

//pub fn is_var_head(head: char) -> bool {
  //('a'..='z').contains(&head) || head == '_' || head == '$'
//}

pub fn is_ctr_head(head: char) -> bool {
  ('A'..='Z').contains(&head)
}

//pub fn parse_var_name(state: parser::State) -> parser::Answer<String> {
  //let (state, name) = parser::name1(state)?;
  //if !is_var_head(name.chars().nth(0).unwrap_or(' ')) {
    //let state = parser::State { index: state.index - name.len(), code: state.code }; // TODO: improve?
    //return parser::expected("lowercase name", name.len(), state);
  //} else {
    //return Ok((state, name));
  //}
//}

//pub fn parse_ctr_name(state: parser::State) -> parser::Answer<String> {
  //let (state, name) = parser::name1(state)?;
  //if !is_ctr_head(name.chars().nth(0).unwrap_or(' ')) {
    //let state = parser::State { index: state.index - name.len(), code: state.code }; // TODO: improve?
    //return parser::expected("uppercase name", name.len(), state);
  //} else {
    //return Ok((state, name));
  //}
//}

pub fn parse_var(state: parser::State) -> parser::Answer<Option<Box<Term>>> {
  parser::guard(
    Box::new(|state| {
      Ok((state, true))
      //let (state, head) = parser::get_char(state)?;
      //Ok((state, is_var_head(head)))
    }),
    Box::new(|state| {
      let (state, init) = get_init_index(state)?;
      let (state, name) = parser::name1(state)?;
      let (state, last) = get_last_index(state)?;
      let orig          = origin(0, init, last);
      if let Ok(numb) = name.parse::<u64>() {
        Ok((state, Box::new(Term::Num { orig, numb })))
      } else {
        Ok((state, Box::new(Term::Var { orig, name })))
      }
    }),
    state,
  )
}

//pub fn parse_num(state: parser::State) -> parser::Answer<Option<Box<Term>>> {
  //parser::guard(
    //parser::text_parser("#"),
    //Box::new(|state| {
      //let (state, init) = get_init_index(state)?;
      //let (state, _)    = parser::consume("#", state)?;
      //let (state, name) = parser::name1(state)?;
      //let (state, last) = get_last_index(state)?;
      //let orig          = origin(0, init, last);
      //if let Ok(numb) = name.parse::<u64>() {
        //Ok((state, Box::new(Term::Num { orig, numb })))
      //} else {
        //return parser::expected("number literal", name.len(), state);
      //}
    //}),
    //state,
  //)
//}

pub fn parse_lam(state: parser::State) -> parser::Answer<Option<Box<Term>>> {
  parser::guard(
    Box::new(|state| {
      let (state, name) = parser::name(state)?;
      let (state, arro) = parser::text("=>", state)?;
      Ok((state, name.len() > 0 && arro))
      //Ok((state, all0 && all1 && name.len() > 0 && is_var_head(name.chars().nth(0).unwrap_or(' '))))
    }),
    Box::new(move |state| {
      let (state, init) = get_init_index(state)?;
      let (state, name) = parser::name1(state)?;
      let (state, _)    = parser::consume("=>", state)?;
      let (state, body) = parse_apps(state)?;
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
      Ok((state, all0 && all1 && name.len() > 0))
      //Ok((state, all0 && all1 && name.len() > 0 && is_var_head(name.chars().nth(0).unwrap_or(' '))))
    }),
    Box::new(|state| {
      let (state, init) = get_init_index(state)?;
      let (state, _)    = parser::consume("(", state)?;
      let (state, name) = parser::name1(state)?;
      let (state, _)    = parser::consume(":", state)?;
      let (state, tipo) = parse_apps(state)?;
      let (state, _)    = parser::consume(")", state)?;
      let (state, isfn) = parser::text("=>", state)?;
      if isfn {
        let (state, body) = parse_apps(state)?;
        let (state, last) = get_last_index(state)?;
        let orig          = origin(0, init, last);
        Ok((state, Box::new(Term::Ann {
          orig,
          expr: Box::new(Term::Lam { orig, name: name.clone(), body }),
          tipo: Box::new(Term::All { orig, name: name.clone(), tipo, body: Box::new(Term::Hol { orig, numb: 0 }) }),
        })))
      } else {
        let (state, _)    = parser::text("->", state)?;
        let (state, body) = parse_apps(state)?;
        let (state, last) = get_last_index(state)?;
        let orig          = origin(0, init, last);
        Ok((state, Box::new(Term::All { orig, name, tipo, body })))
      }
    }),
    state,
  )
}

pub fn parse_sig(state: parser::State) -> parser::Answer<Option<Box<Term>>> {
  parser::guard(
    Box::new(|state| {
      let (state, all0) = parser::text("[", state)?;
      let (state, name) = parser::name(state)?;
      let (state, all1) = parser::text(":", state)?;
      Ok((state, all0 && all1 && name.len() > 0))
      //Ok((state, all0 && all1 && name.len() > 0 && is_var_head(name.chars().nth(0).unwrap_or(' '))))
    }),
    Box::new(|state| {
      let (state, init) = get_init_index(state)?;
      let (state, _)    = parser::consume("[", state)?;
      let (state, name) = parser::name1(state)?;
      let (state, _)    = parser::consume(":", state)?;
      let (state, tipo) = parse_apps(state)?;
      let (state, _)    = parser::consume("]", state)?;
      let (state, _)    = parser::text("->", state)?;
      let (state, body) = parse_apps(state)?;
      let (state, last) = get_last_index(state)?;
      let orig          = origin(0, init, last);
      Ok((state, Box::new(Term::Ctr {
        orig,
        name: "Sigma".to_string(),
        args: vec![
          tipo,
          Box::new(Term::Lam {
            orig,
            name,
            body,
          })
        ]
      })))
    }),
    state,
  )
}

pub fn parse_new(state: parser::State) -> parser::Answer<Option<Box<Term>>> {
  parser::guard(
    parser::text_parser("$"),
    Box::new(move |state| {
      let (state, init) = get_init_index(state)?;
      let (state, _)    = parser::consume("$", state)?;
      let (state, val0) = parse_term(state)?;
      let (state, val1) = parse_term(state)?;
      let (state, last) = get_last_index(state)?;
      let orig          = origin(0, init, last);
      Ok((state, Box::new(Term::Ctr {
        orig,
        name: "Sigma.new".to_string(),
        args: vec![
          Box::new(Term::Hol { orig, numb: 0 }),
          Box::new(Term::Hol { orig, numb: 0 }),
          val0,
          val1
        ]
      })))
    }),
    state,
  )
}


pub fn parse_grp(state: parser::State) -> parser::Answer<Option<Box<Term>>> {
  parser::guard(
    parser::text_parser("("),
    Box::new(|state| {
      let (state, init) = get_init_index(state)?;
      let (state, _)    = parser::consume("(", state)?;
      let (state, term) = parse_apps(state)?;
      let (state, _)    = parser::consume(")", state)?;
      let (state, last) = get_last_index(state)?;
      let orig          = origin(0, init, last);
      Ok((state, term))
    }),
    state,
  )
}

//pub fn parse_app(state: parser::State) -> parser::Answer<Option<Box<Term>>> {
  //return parser::guard(
    //parser::text_parser("("),
    //Box::new(|state| {
      //let (state, init_index) = get_init_index(state)?;
      //parser::list::<(usize, usize, Box<Term>),Box<Term>> (
        //parser::text_parser("("),
        //parser::text_parser(""),
        //parser::text_parser(")"),
        //Box::new(|state| {
          //let (state, init) = get_init_index(state)?;
          //let (state, term) = parse_term(state)?;
          //let (state, last) = get_last_index(state)?;
          //return Ok((state, (init, last, term)));
        //}),
        //Box::new(|args| {
          //if !args.is_empty() {
            //let (app_init_index, app_last_index, func) = &args[0];
            //let mut term = func.clone();
            //for i in 1 .. args.len() {
              //let (argm_init_index, argm_last_index, argm) = &args[i];
              //term = Box::new(Term::App {
                //orig: origin(0, *app_init_index, *argm_last_index),
                //func: term,
                //argm: argm.clone(),
              //});
            //}
            //return term;
          //} else {
            //// TODO: "()" could make an Unit?
            //return Box::new(Term::Var {
              //orig: 0,
              //name: "?".to_string(),
            //});
          //}
        //}),
        //state,
      //)
    //}),
    //state,
  //);
//}

// TODO: can we avoid this duplicated logic by using macros or high-order functions?

pub fn parse_let(state: parser::State) -> parser::Answer<Option<Box<Term>>> {
  return parser::guard(
    parser::text_parser("let "),
    Box::new(|state| {
      let (state, init) = get_init_index(state)?;
      let (state, _)    = parser::consume("let ", state)?;
      let (state, name) = parser::name1(state)?;
      let (state, _)    = parser::consume("=", state)?;
      let (state, expr) = parse_apps(state)?;
      let (state, _)    = parser::text(";", state)?;
      let (state, body) = parse_apps(state)?;
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
      let (state, name) = parser::name1(state)?;
      let (state, _)    = parser::consume("=", state)?;
      let (state, expr) = parse_apps(state)?;
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
      let (state, cond) = parse_apps(state)?;
      let (state, _)    = parser::consume("{", state)?;
      let (state, if_t) = parse_apps(state)?;
      let (state, _)    = parser::text("}", state)?;
      let (state, _)    = parser::text("else", state)?;
      let (state, _)    = parser::consume("{", state)?;
      let (state, if_f) = parse_apps(state)?;
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

//match List foo {
  //cons => ...
  //nil  => ...
//} : ...
pub fn parse_mat(state: parser::State) -> parser::Answer<Option<Box<Term>>> {
  return parser::guard(
    parser::text_parser("match "),
    Box::new(|state| {
      let (state, init) = get_init_index(state)?;
      let (state, _)    = parser::consume("match ", state)?;
      let (state, tipo) = parser::name1(state)?;
      let (state, nm_i) = get_init_index(state)?;
      let (state, name) = parser::name1(state)?;
      let (state, next) = parser::peek_char(state)?;
      let (state, expr) = if next == '=' {
        let (state, _)    = parser::consume("=", state)?;
        let (state, expr) = parse_apps(state)?;
        (state, expr)
      } else {
        let (state, nm_j) = get_last_index(state)?;
        (state, Box::new(Term::Var { orig: origin(0, nm_i, nm_j), name: name.clone() }))
      };
      let (state, _)    = parser::consume("{", state)?;
      let (state, cses) = parser::until(parser::text_parser("}"), Box::new(|state| {
        let (state, name) = parser::name1(state)?;
        let (state, _)    = parser::consume("=>", state)?;
        let (state, body) = parse_apps(state)?;
        let (state, _)    = parser::text(";", state)?;
        return Ok((state, (name, body)));
      }), state)?;
      let (state, next) = peek_char_local(state)?;
      let (state, moti) = if next == ':' {
        let (state, _)    = parser::consume(":", state)?;
        let (state, moti) = parse_apps(state)?;
        (state, moti)
      } else {
        (state, Box::new(Term::Hol { orig: 0, numb: 0 }))
      };
      let (state, last) = get_last_index(state)?;
      let orig = origin(0, init, last);
      return Ok((state, Box::new(Term::Mat { orig, tipo, name, expr, cses, moti })));
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
      op("<=" , Oper::Lte),
      op("<"  , Oper::Ltn),
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
      let (state, open) = parser::text("(", state)?;
      let (state, head) = parser::get_char(state)?;
      //let (state, next) = parser::peek_char(state)?;
      Ok((state, open && is_ctr_head(head)))
    }),
    Box::new(|state| {
      let (state, init) = get_init_index(state)?;
      let (state, open) = parser::text("(", state)?;
      let (state, name) = parser::name1(state)?;
      let (state, args) = if open {
        parser::until(parser::text_parser(")"), Box::new(parse_term), state)?
      } else {
        (state, Vec::new())
      };
      let (state, last) = get_last_index(state)?;
      let orig          = origin(0, init, last);
      Ok((state, Box::new(Term::Ctr { orig, name, args })))
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
      let (state, body) = parse_apps(state)?;
      let (state, last) = get_last_index(state)?;
      Ok((state, Box::new(move |init, tipo| {
        let orig = origin(0, init, last);
        let name = "_".to_string();
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
      let (state, tipo) = parse_apps(state)?;
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

pub fn parse_sub(state: parser::State) -> parser::Answer<Option<Box<dyn Fn(usize, Box<Term>) -> Box<Term>>>> {
  return parser::guard(
    parser::text_parser("##"),
    Box::new(|state| {
      let (state, _)    = parser::consume("##", state)?;
      let (state, name) = parser::name1(state)?;
      let (state, _)    = parser::consume("/", state)?;
      let (state, redx) = parser::name1(state)?;
      if let Ok(redx) = redx.parse::<u64>() {
        let (state, last) = get_last_index(state)?;
        Ok((state, Box::new(move |init, expr| {
          let orig = origin(0, init, last);
          let name = name.clone();
          let indx = 0;
          let expr = expr.clone();
          Box::new(Term::Sub { orig, name, indx, redx, expr })
        })))
      } else {
        parser::expected("number", name.len(), state)
      }
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

pub fn parse_chr(state: parser::State) -> parser::Answer<Option<Box<Term>>> {
  parser::guard(
    Box::new(|state| {
      let (state, head) = parser::get_char(state)?;
      Ok((state, head == '\''))
    }),
    Box::new(|state| {
      let (state, init) = get_init_index(state)?;
      let (state,    _) = parser::text("'", state)?;
      let (state, last) = get_last_index(state)?;
      let orig          = origin(0, init, last);
      if let Some(c) = parser::head(state) {
        let state = parser::tail(state);
        let (state, _) = parser::text("'", state)?;
        Ok((state, Box::new(Term::Num { orig, numb: c as u64 })))
      } else {
        parser::expected("character", 1, state)
      }
    }),
    state,
  )
}

pub fn parse_str(state: parser::State) -> parser::Answer<Option<Box<Term>>> {
  parser::guard(
    Box::new(|state| {
      let (state, head) = parser::get_char(state)?;
      Ok((state, head == '"' || head == '`'))
    }),
    Box::new(|state| {
      let (state, init) = get_init_index(state)?;
      let delim = parser::head(state).unwrap_or('\0');
      let state = parser::tail(state);
      let mut chars: Vec<char> = Vec::new();
      let mut state = state;
      loop {
        if let Some(next) = parser::head(state) {
          if next == delim || next == '\0' {
            state = parser::tail(state);
            break;
          } else {
            chars.push(next);
            state = parser::tail(state);
          }
        }
      }
      let (state, last) = get_last_index(state)?;
      let orig          = origin(0, init, last);
      let empty = Term::Ctr { orig, name: "String.nil".to_string(), args: Vec::new() };
      let list = Box::new(chars.iter().rfold(empty, |t, h| Term::Ctr {
        orig,
        name: "String.cons".to_string(),
        args: vec![Box::new(Term::Num { orig, numb: *h as u64 }), Box::new(t)],
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
    Box::new(|state| {
      let (state, term) = parse_term(state)?;
      Ok((state, Some(Box::new(move |monad| { term.clone() }))))
    })
  ], state)
}

pub fn parse_return_st(state: parser::State) -> parser::Answer<Option<Box<dyn Fn(&str) -> Box<Term>>>> {
  return parser::guard(
    parser::text_parser("return "),
    Box::new(move |state| {
      let (state, init) = get_init_index(state)?;
      let (state, _)    = parser::consume("return ", state)?;
      let (state, term) = parse_apps(state)?;
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
      let (state, acti) = parse_apps(state)?;
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
      let (state, acti) = parse_apps(state)?;
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
  // NOTE: all characters that can start a term must be listed on `parse_term_applys()`
  parser::grammar("Term", &[
    Box::new(parse_all), // `(name:`
    Box::new(parse_ctr), // `(Name`
    Box::new(parse_op2), // `(+`
    Box::new(parse_grp), // `(`
    //Box::new(parse_app), // `(`
    Box::new(parse_sig), // `[name:`
    Box::new(parse_new), // `$`
    Box::new(parse_lst), // `[`
    Box::new(parse_str), // `"`
    Box::new(parse_chr), // `'`
    Box::new(parse_lam), // `@`
    Box::new(parse_let), // `let `
    Box::new(parse_if),  // `if `
    Box::new(parse_mat), // `match `
    Box::new(parse_do),  // `do `
    Box::new(parse_hlp), // `?`
    Box::new(parse_hol), // `_`
    Box::new(parse_var), // 
    Box::new(|state| Ok((state, None))),
  ], state)
}

pub fn parse_term_suffix(state: parser::State) -> parser::Answer<Box<dyn Fn(usize,Box<Term>) -> Box<Term>>> {
  parser::grammar("Term", &[
    Box::new(parse_arr), // `->`
    Box::new(parse_sub), // `# `
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

pub fn parse_apps(state: parser::State) -> parser::Answer<Box<Term>> {
  let (state, init) = get_init_index(state)?;
  let (mut state, mut term) = parse_term(state)?;
  loop {
    //println!("aaaaaaaa {}", &state.code[state.index .. state.index + 16].replace("\n","X"));
    let loop_state = state;
    let (loop_state, _) = parser::skip_while(loop_state, Box::new(|x| *x == ' '))?;
    let head = parser::head(loop_state).unwrap_or(' ');
    let is_term_initializer // NOTE: this must cover all characters that can start a term
      =  ('a'..='z').contains(&head)
      || ('A'..='Z').contains(&head)
      || ('0'..='9').contains(&head)
      || ['(','[','"','\'','@','?','_','#'].contains(&head);
    if is_term_initializer {
      let (loop_state, argm) = parse_term(loop_state)?;
      let (loop_state, last) = get_last_index(loop_state)?;
      let orig = origin(0, init, last);
      term = Box::new(Term::App { orig, func: term, argm });
      state = loop_state;
    } else {
      state = loop_state;
      break;
    }
  }
  return Ok((state, term));
}

pub fn parse_entry(state: parser::State) -> parser::Answer<Box<Entry>> {
  let (state, name) = parser::name1(state)?;
  let (state, kdl)  = parser::text("#", state)?;
  let (state, kdln) = if kdl {
    let (state, name) = parser::name1(state)?;
    (state, Some(name))
  } else {
    (state, None)
  };
  let (state, args) = parser::until(Box::new(|state| {
    let (state, end_0) = parser::dry(Box::new(|state| parser::text(":", state)), state)?;
    let (state, end_1) = parser::dry(Box::new(|state| parser::text("{", state)), state)?;
    return Ok((state, end_0 || end_1));
  }), Box::new(parse_argument), state)?;
  let (state, next) = parser::peek_char(state)?;
  let (state, tipo) = if next == ':' {
    let (state, anno) = parser::consume(":", state)?;
    parse_apps(state)?
  } else {
    (state, Box::new(Term::Hol { orig: 0, numb: u64::MAX })) // TODO: set orig
  };
  let (state, head) = parser::peek_char(state)?;
  if head == '{' {
    let (state, _)    = parser::consume("{", state)?;
    let (state, body) = parse_apps(state)?;
    let (state, _)    = parser::consume("}", state)?;
    let mut pats = vec![];
    for arg in &args {
      pats.push(Box::new(Term::Var { orig: 0, name: arg.name.clone() })); // TODO: set orig
    }
    let rules = vec![Box::new(Rule { orig: 0, name: name.clone(), pats, body })];
    return Ok((state, Box::new(Entry { name, kdln, args, tipo, rules })));
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
    let entry = Box::new(Entry { name, kdln, args, tipo, rules });
    return Ok((state, entry));
  }
}

pub fn parse_rule(state: parser::State, name: String, init: usize) -> parser::Answer<Box<Rule>> {
  let (state, pats) = parser::until(parser::text_parser("="), Box::new(parse_term), state)?;
  let (state, last) = get_last_index(state)?;
  let orig          = origin(0, init, last);
  let (state, body) = parse_apps(state)?;
  return Ok((state, Box::new(Rule { orig, name, pats, body })));
}

pub fn parse_argument(state: parser::State) -> parser::Answer<Box<Argument>> {
  let (state, eras) = parser::text("-", state)?;
  let (state, keep) = parser::text("+", state)?;
  let (state, next) = parser::peek_char(state)?;
  let (open, close) = if next == '(' { ("(",")") } else { ("<",">") };
  let (state, _)    = parser::consume(open, state)?;
  let (state, name) = parser::name1(state)?;
  let (state, anno) = parser::text(":", state)?;
  let (state, tipo) = if anno { parse_apps(state)? } else { (state, Box::new(Term::Typ { orig: 0 })) };
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

pub fn parse_newtype(state: parser::State) -> parser::Answer<Box<NewType>> {
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

pub fn read_newtype(code: &str) -> Result<Box<NewType>, String> {
  parser::read(Box::new(parse_newtype), code)
}

pub fn read_term(code: &str) -> Result<Box<Term>, String> {
  parser::read(Box::new(parse_term), code)
}

pub fn read_book(code: &str) -> Result<Box<Book>, String> {
  parser::read(Box::new(parse_book), code)
}

fn load_newtype(name: &str) -> Result<Box<NewType>, String> {
  let path = format!("{}/_.type", name.replace(".","/"));
  let newcode = match std::fs::read_to_string(&path) {
    Err(err) => { return Err(format!("File not found: '{}'.", path)); }
    Ok(code) => { code }
  };
  let newtype = match read_newtype(&newcode) {
    Err(err) => { return Err(format!("\x1b[1m[{}]\x1b[0m\n{}", path, err)); }
    Ok(book) => { book }
  };
  return Ok(newtype);
}

pub fn load_newtype_cached(cache: &mut HashMap<String, Rc<NewType>>, name: &str) -> Result<Rc<NewType>, String> {
  if !cache.contains_key(name) {
    let newtype = Rc::new(*load_newtype(name)?);
    cache.insert(name.to_string(), newtype);
  }
  return Ok(cache.get(name).unwrap().clone());
}

// Type Checker Compiler
// =====================

pub fn to_checker_term(term: &Term, quote: bool, lhs: bool) -> String {
  fn hide(orig: &u64, lhs: bool) -> String {
    if lhs {
      "orig".to_string()
    } else {
      format!("{}", orig)
    }
  }
  match term {
    Term::Typ { orig } => {
      format!("(Kind.Term.typ {})", hide(orig,lhs))
    }
    Term::Var { orig, name } => {
      if lhs {
        format!("{}", name)
      } else {
        if quote {
          format!("(Kind.Term.set_origin {} {})", orig, name.clone())
        } else {
          format!("{}", name.clone()) // spaces to align with quoted version
        }
      }
    }
    Term::All { orig, name, tipo, body } => {
      format!("(Kind.Term.all {} {} {} λ{} {})", hide(orig,lhs), name_to_u64(name), to_checker_term(tipo, quote, lhs), name, to_checker_term(body, quote, lhs))
    }
    Term::Lam { orig, name, body } => {
      format!("(Kind.Term.lam {} {} λ{} {})", hide(orig,lhs), name_to_u64(name), name, to_checker_term(body, quote, lhs))
    }
    Term::App { orig, func, argm } => {
      format!("({} {} {} {})", if quote { "Kind.Term.app" } else { "Kind.Term.eval_app" }, hide(orig,lhs), to_checker_term(func, quote, lhs), to_checker_term(argm, quote, lhs))
    }
    Term::Let { orig, name, expr, body } => {
      format!("({} {} {} {} λ{} {})", if quote { "Kind.Term.let" } else { "Kind.Term.eval_let" }, hide(orig,lhs), name_to_u64(name), to_checker_term(expr, quote, lhs), name, to_checker_term(body, quote, lhs))
    }
    Term::Ann { orig, expr, tipo } => {
      format!("({} {} {} {})", if quote { "Kind.Term.ann" } else { "Kind.Term.eval_ann" }, hide(orig,lhs), to_checker_term(expr, quote, lhs), to_checker_term(tipo, quote, lhs))
    }
    Term::Sub { orig, expr, name, indx, redx } => {
      format!("({} {} {} {} {} {})", if quote { "Kind.Term.sub" } else { "Kind.Term.eval_sub" }, hide(orig,lhs), name_to_u64(name), indx, redx, to_checker_term(expr, quote, lhs))
    }
    Term::Ctr { orig, name, args } => {
      let mut args_strs : Vec<String> = Vec::new();
      for arg in args {
        args_strs.push(format!(" {}", to_checker_term(arg, quote, lhs)));
      }
      if args.len() >= 7 {
        format!("(Kind.Term.ct{} {}. {} (Kind.Term.args{}{}))", args.len(), name, hide(orig,lhs), args.len(), args_strs.join(""))
      } else {
        format!("(Kind.Term.ct{} {}. {}{})", args.len(), name, hide(orig,lhs), args_strs.join(""))
      }
    }
    Term::Fun { orig, name, args } => {
      let mut args_strs : Vec<String> = Vec::new();
      for arg in args {
        args_strs.push(format!(" {}", to_checker_term(arg, quote, lhs)));
      }
      if quote {
        if args.len() >= 7 {
          format!("(Kind.Term.fn{} {}. {}(Kind.Term.args{} {}))", args.len(), name, hide(orig,lhs), args.len(), args_strs.join(""))
        } else {
          format!("(Kind.Term.fn{} {}. {}{})", args.len(), name, hide(orig,lhs), args_strs.join(""))
        }
      } else {
        format!("(F${} {}{})", name, hide(orig,lhs), args_strs.join(""))
      }
    }
    Term::Hlp { orig } => {
      format!("(Kind.Term.hlp {})", hide(orig,lhs))
    }
    Term::U60 { orig } => {
      format!("(Kind.Term.u60 {})", hide(orig,lhs))
    }
    Term::Num { orig, numb } => {
      format!("(Kind.Term.num {} {})", hide(orig,lhs), numb)
    }
    Term::Op2 { orig, oper, val0, val1 } => {
      // TODO: Add operator
      format!("({} {} {} {} {})", if quote { "Kind.Term.op2" } else { "Kind.Term.eval_op" }, hide(orig,lhs), to_checker_oper(oper), to_checker_term(val0, quote, lhs), to_checker_term(val1, quote, lhs))
    }
    Term::Hol { orig, numb } => {
      format!("(Kind.Term.hol {} {})", orig, numb)
    }
    Term::Mat { .. } => {
      panic!("Internal error."); // removed after adjust()
    }
  }
}

pub fn to_checker_oper(oper: &Oper) -> String {
  match oper {
    Oper::Add => "Kind.Operator.add".to_string(),
    Oper::Sub => "Kind.Operator.sub".to_string(),
    Oper::Mul => "Kind.Operator.mul".to_string(),
    Oper::Div => "Kind.Operator.div".to_string(),
    Oper::Mod => "Kind.Operator.mod".to_string(),
    Oper::And => "Kind.Operator.and".to_string(),
    Oper::Or  => "Kind.Operator.or" .to_string(),
    Oper::Xor => "Kind.Operator.xor".to_string(),
    Oper::Shl => "Kind.Operator.shl".to_string(),
    Oper::Shr => "Kind.Operator.shr".to_string(),
    Oper::Ltn => "Kind.Operator.ltn".to_string(),
    Oper::Lte => "Kind.Operator.lte".to_string(),
    Oper::Eql => "Kind.Operator.eql".to_string(),
    Oper::Gte => "Kind.Operator.gte".to_string(),
    Oper::Gtn => "Kind.Operator.gtn".to_string(),
    Oper::Neq => "Kind.Operator.neq".to_string(),
  }
}

pub fn to_checker_entry(entry: &Entry) -> String {
  fn to_checker_type(args: &Vec<Box<Argument>>, tipo: &Box<Term>, index: usize) -> String {
    if index < args.len() {
      let arg = &args[index];
      format!("(Kind.Term.all {} {} {} λ{} {})", 0, name_to_u64(&arg.name), to_checker_term(&arg.tipo, true, false), arg.name, to_checker_type(args, tipo, index + 1))
    } else {
      to_checker_term(tipo, true, false)
    }
  }

  fn to_checker_rule_end(name: &str, size: u64) -> String {
    let mut vars = vec![];
    for idx in 0 .. size {
      vars.push(format!(" x{}", idx));
    }
    let mut text = String::new();

    if size >= 7 {
      text.push_str(&format!("(Q${} orig{}) = (Kind.Term.fn{} {}. orig (Kind.Term.args{}{}))\n", name, vars.join(""), size, name, size, vars.join("")));
      text.push_str(&format!("(F${} orig{}) = (Kind.Term.fn{} {}. orig (Kind.Term.args{}{}))\n", name, vars.join(""), size, name, size, vars.join("")));
    } else {
      text.push_str(&format!("(Q${} orig{}) = (Kind.Term.fn{} {}. orig{})\n", name, vars.join(""), size, name, vars.join("")));
      text.push_str(&format!("(F${} orig{}) = (Kind.Term.fn{} {}. orig{})\n", name, vars.join(""), size, name, vars.join("")));
    }

    return text;
  }

  fn to_checker_rule(rule: &Rule) -> String {
    let mut pats = vec![];
    for pat in &rule.pats {
      pats.push(format!(" {}", to_checker_term(pat, false, true)));
    }
    let body_rhs = to_checker_term(&rule.body, true, false);
    let rule_rhs = to_checker_term(&rule.body, false, false);
    let mut text = String::new();
    text.push_str(&format!("(Q${} orig{}) = {}\n", rule.name, pats.join(""), body_rhs));
    if rule.name == "HVM.log" {
      text.push_str(&format!("(F$HVM.log orig a r log ret) = (HVM.put (Kind.Term.show log) ret)"));
    } else {
      text.push_str(&format!("(F${} orig{}) = {}\n", rule.name, pats.join(""), rule_rhs));
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

  fn to_checker_rule_chk(rule: &Rule, index: usize, vars: &mut u64, args: &mut Vec<String>) -> String {
    if index < rule.pats.len() {
      let (inp_patt_str, var_patt_str) = to_checker_patt_chk(&rule.pats[index], vars);
      args.push(var_patt_str);
      let head = inp_patt_str;
      let tail = to_checker_rule_chk(rule, index + 1, vars, args);
      return format!("(Kind.Rule.lhs {} {})", head, tail);
    } else {
      return format!("(Kind.Rule.rhs (QT{} {}. 0{}))", index, rule.name, args.iter().map(|x| format!(" {}", x)).collect::<Vec<String>>().join(""));
    }
  }

  fn to_checker_patt_chk(patt: &Term, vars: &mut u64) -> (String, String) {
    // FIXME: remove redundancy
    match patt {
      Term::Var { orig, name } => {
        let inp = format!("(Kind.Term.var {} {} {})", orig, name_to_u64(name), vars);
        let var = format!("(Kind.Term.var {} {} {})", orig, name_to_u64(name), vars);
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
        if args.len() >= 7 {
          let inp_str = format!("(Kind.Term.ct{} {}. {} (Kind.Term.args{}{}))", args.len(), name, orig, args.len(), inp_args_str);
          let var_str = format!("(Kind.Term.ct{} {}. {} (Kind.Term.args{}{}))", args.len(), name, orig, args.len(), var_args_str);
          return (inp_str, var_str);
        } else {
          let inp_str = format!("(Kind.Term.ct{} {}. {}{})", args.len(), name, orig, inp_args_str);
          let var_str = format!("(Kind.Term.ct{} {}. {}{})", args.len(), name, orig, var_args_str);
          return (inp_str, var_str);
        }
      }
      Term::Num { orig, numb } => {
        let inp = format!("(Kind.Term.num {} {})", orig, numb);
        let var = format!("(Kind.Term.num {} {})", orig, numb);
        return (inp, var);
      }
      _ => {
        // TODO: This should return a proper error instead of panicking
        panic!("Invalid left-hand side pattern: {}", show_term(patt));
      }
    }
  }

  let mut result = String::new();
  result.push_str(&format!("(NameOf {}.) = \"{}\"\n", entry.name, entry.name));
  result.push_str(&format!("(HashOf {}.) = %{}\n", entry.name, entry.name));
  result.push_str(&format!("(TypeOf {}.) = {}\n", entry.name, to_checker_type(&entry.args, &entry.tipo, 0)));

  let base_vars = (0 .. entry.args.len()).map(|x| format!(" x{}", x)).collect::<Vec<String>>().join("");

  if entry.args.len() >= 7 {
    result.push_str(&format!("(Kind.Term.FN{} {}. orig (Kind.Term.args{}{})) = (F${} orig{})\n", entry.args.len(), entry.name, entry.args.len(), base_vars, entry.name, base_vars));
  } else {
    result.push_str(&format!("(Kind.Term.FN{} {}. orig{}) = (F${} orig{})\n", entry.args.len(), entry.name, base_vars, entry.name, base_vars));
  }
  
  result.push_str(&format!("(QT{} {}. orig{}) = (Q${} orig{})\n", entry.args.len(), entry.name, base_vars, entry.name, base_vars));
  
  for rule in &entry.rules {
    result.push_str(&to_checker_rule(&rule));
  }
  if entry.rules.len() > 0 {
    result.push_str(&to_checker_rule_end(&entry.name, entry.rules[0].pats.len() as u64));
  }
  result.push_str(&format!("(RuleOf {}.) =", entry.name));
  for rule in &entry.rules {
    result.push_str(&format!(" (List.cons {}", to_checker_rule_chk(&rule, 0, &mut 0, &mut vec![]))); 
  }
  result.push_str(&format!(" List.nil{}", ")".repeat(entry.rules.len())));
  return result;
}

pub fn to_checker_book(book: &Book) -> String {
  let mut result = String::new();
  result.push_str(&format!("// NOTE: functions with names starting with 'F$' are evaluated differently by the\n"));
  result.push_str(&format!("// HVM, as a specific optimization targetting Kind2. See 'HOAS_OPT' on HVM's code.\n\n"));
  result.push_str(&format!("Functions =\n"));
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
    result.push_str(&to_checker_entry(&entry));
    result.push_str(&format!("\n"));
  }
  //result.push_str(&format!("\n// Default Cases"));
  //result.push_str(&format!("\n// -------------\n\n"));
  //for size in 0 .. 9 {
    //let mut vars = vec![];
    //for idx in 0 .. size {
      //vars.push(format!(" x{}", idx));
    //}
    //result.push_str(&format!("(QT{} name orig{}) = (Fn{} name orig{})\n", size, vars.join(""), size, vars.join("")));
    //result.push_str(&format!("(FN{} name orig{}) = (Fn{} name orig{})\n", size, vars.join(""), size, vars.join("")));
  //}

  return result;
}

// Stringification
// ===============

pub fn interpret_as_string(term: &Term) -> Option<String> {
  let mut text = String::new();
  let mut term = term;
  loop {
    if let Term::Ctr { name, args, .. } = term {
      if name == "String.cons" && args.len() == 2 {
        if let Term::Num { numb, .. } = *args[0] {
          // TODO: In the future we will just have to push the str to the text
          // if the parser accepts escaped chars.
          if ascii::escape_default(numb as u8).count() > 1 {
            return None
          } else {
            text.push(char::from_u32(numb as u32).unwrap_or('\0'));
            term = &*args[1];
          }
        } else {
          return None;
        }
        continue;
      }
      if name == "String.nil" && args.len() == 0 {
        return Some(text);
      }
    }
    return None;
  }
}

pub fn show_term(term: &Term) -> String {
  if let Some(as_string) = interpret_as_string(term) {
    return format!("\"{}\"", as_string);
  }
  match term {
    Term::Typ { .. } => {
      format!("Type")
    }
    Term::Var { orig: _, name } => {
      format!("{}", name)
    }
    Term::Lam { orig: _, name, body } => {
      let body = show_term(body);
      format!("({} => {})", name, body)
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
      format!("({} :: {})", expr, tipo)
    }
    Term::Sub { orig: _, name, indx, redx, expr } => {
      let expr = show_term(expr);
      format!("{} ## {}/{}", expr, name, redx)
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
    Term::Mat { .. } => {
      panic!("Internal error."); // removed after adjust()
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
  let name = if let Some(kdln) = &entry.kdln {
    format!("{} #{}", entry.name, kdln)
  } else {
    entry.name.clone()
  };
  let mut args = vec![];
  for arg in &entry.args {
    let (open, close) = match (arg.eras, arg.hide) {
      (false, false) => ("(", ")"),
      (false, true ) => ("+<", ">"),
      (true , false) => ("-(", ")"),
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

/// Return the number of hidden and erased arguments in an entry
pub fn count_implicits(entry: &Entry) -> (usize, usize) {
  let mut hiddens = 0;
  let mut eraseds = 0;
  for arg in &entry.args {
    if arg.hide {
      hiddens = hiddens + 1;
    }
    if arg.eras {
      eraseds = eraseds + 1;
    }
  }
  (hiddens, eraseds)
}


// Kindelia Compiler
// =================

// Returns true if a ctor's argument is erased
#[derive(Clone, Debug)]
pub enum CompTerm {
  Var { name: String },
  Lam { name: String, body: Box<CompTerm> },
  App { func: Box<CompTerm>, argm: Box<CompTerm> },
  Dup { nam0: String, nam1: String, expr: Box<CompTerm>, body: Box<CompTerm> },
  Let { name: String, expr: Box<CompTerm>, body: Box<CompTerm> },
  Ctr { name: String, args: Vec<Box<CompTerm>> },
  Fun { name: String, args: Vec<Box<CompTerm>> },
  Num { numb: u128 },
  Op2 { oper: Oper, val0: Box<CompTerm>, val1: Box<CompTerm> },
  Nil
}

#[derive(Clone, Debug)]
pub struct CompRule {
  pub name: String,
  pub pats: Vec<Box<CompTerm>>,
  pub body: Box<CompTerm>,
}

#[derive(Clone, Debug)]
pub struct CompEntry {
  pub name : String,
  pub kdln : Option<String>,
  pub args : Vec<String>,
  pub rules: Vec<CompRule>,
  pub orig : bool,
}

#[derive(Clone, Debug)]
pub struct CompBook {
  pub names: Vec<String>,
  pub entrs: HashMap<String, CompEntry>,
}

pub fn compile_book(book: &Book) -> Result<CompBook, String> {
  let mut comp_book = CompBook { names: Vec::new(), entrs: HashMap::new() };
  for name in &book.names {
    let entry = book.entrs.get(name).unwrap();
    // Don't compile primitive U120 operations
    // TODO: If this compiler eventually gets used for other targets (like HVM), this will need to be separated.
    //       We could do passes of compiler features (like flattening, linearizing, etc) also separately.
    if u120_to_oper(&entry.name).is_some() {
      continue;
    }
    // Skip over useless entries
    // TODO: This doesn't cover all cases. We need something like `erase` but for a Book.
    //       Also maybe there are functions of type Type that should be compiled?
    else if let Term::Typ {orig: _} = &*entry.tipo {
      continue;
    } else {
      let entrs = match compile_entry(book, entry) {
        Ok(entrs) => { entrs },
        Err(err)  => {
          // TODO: U120 functions bring some functions that won't be used to the book. (eg: U60.mul.carrying for U120.mul)
          //       We should check if no other functions use them and remove them if needed.
          //       Or maybe not, since they'll all already be deployed to the chain.
          eprintln!("\x1b[33mwarning\x1b[0m: Failed to compile entry '{}', skipping.", entry.name);
          continue;
        }
      };
      for entry in entrs {
        comp_book.names.push(entry.name.clone());
        comp_book.entrs.insert(entry.name.clone(), entry);
      }
    }
  }
  Ok(comp_book)
}

// Can become multiple entries after flatenning
pub fn compile_entry(book: &Book, entry: &Entry) -> Result<Vec<CompEntry>, String> {
  fn compile_rule(book: &Book, entry: &Entry, rule: &Rule) -> CompRule {
    let name = rule.name.clone();
    let mut pats = Vec::new();
    for (arg, pat) in entry.args.iter().zip(rule.pats.iter()) {
      if !arg.eras {
        let pat = erase(book, pat);
        // TODO: Check if the pattern has some invalid term (anything other than num, ctr or var)
        pats.push(pat);
      }
    }
    let body = erase(book, &rule.body);
    CompRule {name, pats, body}
  }

  fn make_u120_new() -> CompEntry {
    // U120.new hi lo = (+ (<< hi 60) (>> (<< lo 60) 60))
    CompEntry {
      name: "U120.new".to_string(),
      kdln: None,
      args: vec!["hi".to_string(), "lo".to_string()],
      rules: vec![CompRule {
        name: "U120.new".to_string(),
        pats: vec![
          Box::new(CompTerm::Var { name: "hi".to_string() }),
          Box::new(CompTerm::Var { name: "lo".to_string() })
        ],
        body: Box::new(CompTerm::Op2 {
          oper: Oper::Add,
          val0: Box::new(CompTerm::Op2 {
            oper: Oper::Shl,
            val0: Box::new(CompTerm::Var { name: "hi".to_string() }),
            val1: Box::new(CompTerm::Num { numb: 60 }),
          }),
          val1: Box::new(CompTerm::Op2 {
            oper: Oper::Shr,
            val0: Box::new(CompTerm::Op2 {
              oper: Oper::Shl,
              val0: Box::new(CompTerm::Var { name: "lo".to_string() }),
              val1: Box::new(CompTerm::Num { numb: 60 }),
            }),
            val1: Box::new(CompTerm::Num { numb: 60 }),
          }),
        })
      }],
      orig: true,
    }
  }

  fn make_u120_low() -> CompEntry {
    // U120.low n = (>> (<< n 60) 60))
    CompEntry {
      name: "U120.low".to_string(),
      kdln: None,
      args: vec!["n".to_string()],
      rules: vec![CompRule {
        name: "U120.low".to_string(),
        pats: vec![
          Box::new(CompTerm::Var { name: "n".to_string() }),
        ],
        body: Box::new(CompTerm::Op2 {
          oper: Oper::Shr,
          val0: Box::new(CompTerm::Op2 {
            oper: Oper::Shl,
            val0: Box::new(CompTerm::Var { name: "n".to_string() }),
            val1: Box::new(CompTerm::Num { numb: 60 }),
          }),
          val1: Box::new(CompTerm::Num { numb: 60 }),
        }),
      }],
      orig: true,
    }
  }

  fn make_u120_high() -> CompEntry {
    // U120.high n = (>> n 60)
    CompEntry {
      name: "U120.high".to_string(),
      kdln: None,
      args: vec!["n".to_string()],
      rules: vec![CompRule {
        name: "U120.high".to_string(),
        pats: vec![
          Box::new(CompTerm::Var { name: "n".to_string() }),
        ],
        body: Box::new(CompTerm::Op2 {
          oper: Oper::Shr,
          val0: Box::new(CompTerm::Var { name: "n".to_string() }),
          val1: Box::new(CompTerm::Num { numb: 60 }),
        }),
      }],
      orig: true,
    }
  }

  match entry.name.as_str() {
    // Some U120 functions should have a special compilation
    "U120.new"  => Ok(vec![make_u120_new()]),
    "U120.high" => Ok(vec![make_u120_high()]),  // high and low are needed for type compatibility with u60
    "U120.low"  => Ok(vec![make_u120_low()]),
    _ => {
      let new_entry = CompEntry {
        name : entry.name.clone(),
        kdln : entry.kdln.clone(),
        args : entry.args.iter().filter(|x| !x.eras).map(|x| x.name.clone()).collect(),
        rules: entry.rules.iter().map(|rule| compile_rule(book, entry, rule)).collect(),
        orig : true,
      };
      // TODO: We probably need to handle U60 separately as well.
      //       Since they compile to U120, it wont overflow as expected and conversion to signed will fail.
      let new_entry = convert_u120_entry(new_entry)?;
      let mut new_entrs = flatten(new_entry);
      for entry in &mut new_entrs {
        for rule in &mut entry.rules {
          linearize_rule(rule);
        }
      }
      Ok(new_entrs)
    }
  }

}

// Splits an entry with rules with nested cases into multiple entries with flattened rules.
pub fn flatten(entry: CompEntry) -> Vec<CompEntry> {
  fn post_inc(n: &mut u64) -> u64 {
    let old_n = *n;
    *n += 1;
    old_n
  }

  fn must_split(rule: &CompRule) -> bool {
    for pat in &rule.pats {
      if let CompTerm::Ctr { args, .. } = &**pat {
        for arg in args {
          if matches!(&**arg, CompTerm::Ctr { .. } | CompTerm::Num { .. }) {
            return true;
          }
        }
      }
    }
    false
  }

  // return true on the first if both rules always match together
  fn matches_together(a: &CompRule, b: &CompRule) -> (bool, bool) {
    let mut same_shape = true;
    for (a_pat, b_pat) in a.pats.iter().zip(&b.pats) {
      match (&**a_pat, &**b_pat) {
        (CompTerm::Ctr { name: a_name, .. }, CompTerm::Ctr { name: b_name, .. }) => {
          if a_name != b_name {
            return (false, false);
          }
        },
        (CompTerm::Num { numb: a_numb }, CompTerm::Num { numb: b_numb }) => {
          if a_numb != b_numb {
            return (false, false);
          }
        },
        (CompTerm::Ctr { .. }, CompTerm::Num { .. }) => { return (false, false); },
        (CompTerm::Num { .. }, CompTerm::Ctr { .. }) => { return (false, false); },
        (CompTerm::Ctr { .. }, CompTerm::Var { .. }) => { same_shape = false; },
        (CompTerm::Num { .. }, CompTerm::Var { .. }) => { same_shape = false; },
        _ => {},
      }
    }
    (true, same_shape)
  }

  let mut name_count = 0;

  let mut skip           : HashSet<usize> = HashSet::new();
  let mut new_entries    : Vec<CompEntry> = Vec::new();
  let mut old_entry_rules: Vec<CompRule>  = Vec::new();
  let old_entry_args     : Vec<String>    = entry.args;
  for i in 0..entry.rules.len() {
    if !skip.contains(&i) {
      let rule = &entry.rules[i];
      if must_split(rule) {
        // Each rule that must be split creates a new entry that inspects one layer of Ctrs
        // The old rule is rewritten to be flat and call the new entry
        let n = post_inc(&mut name_count);
        let new_entry_name = format!("{}{}_", entry.name, n);
        let new_entry_kdln = entry.kdln.clone().and_then(|kdln| Some(format!("{}{}_", kdln, n)));
        let mut new_entry_rules: Vec<CompRule> = Vec::new();
        // Rewrite the old rule to be flat and point to the new entry
        let mut old_rule_pats     : Vec<Box<CompTerm>> = Vec::new();
        let mut old_rule_body_args: Vec<Box<CompTerm>> = Vec::new();
        let mut var_count = 0;
        for pat in &rule.pats {
          match &**pat {
            CompTerm::Ctr { name: pat_name, args: pat_args } => {
              let mut new_pat_args = Vec::new();
              for field in pat_args {
                match &**field {
                  CompTerm::Ctr { .. } => {
                    let var_name = format!(".{}", post_inc(&mut var_count));
                    new_pat_args.push(Box::new(CompTerm::Var { name: var_name.clone() }));
                    old_rule_body_args.push(Box::new(CompTerm::Var { name: var_name.clone() }));
                  }
                  CompTerm::Num { .. } => {
                    let var_name = format!(".{}", post_inc(&mut var_count));
                    new_pat_args.push(Box::new(CompTerm::Var { name: var_name.clone() }));
                    old_rule_body_args.push(Box::new(CompTerm::Var { name: var_name.clone() }));
                  }
                  CompTerm::Var { name } => {
                    new_pat_args.push(field.clone());
                    old_rule_body_args.push(field.clone());
                  }
                  _ => {
                    panic!("?");
                  }
                }
              }
              old_rule_pats.push(Box::new(CompTerm::Ctr { name: pat_name.clone(), args: new_pat_args }));
            }
            CompTerm::Var { name } => {
              old_rule_pats.push(Box::new(*pat.clone()));
              old_rule_body_args.push(Box::new(CompTerm::Var { name: name.clone() }));
            }
            // TODO: It'd be better to check for Num and panic on other (invalid) options
            _ => {}
          }
        }
        let old_rule_body = Box::new(CompTerm::Fun { name: new_entry_name.clone(), args: old_rule_body_args });
        let old_rule = CompRule {name: entry.name.clone(), pats: old_rule_pats, body: old_rule_body };
        old_entry_rules.push(old_rule);
        //(Foo Tic (Bar a b) (Haz c d)) = A
        //(Foo Tic x         y)         = B
        //---------------------------------
        //(Foo Tic (Bar a b) (Haz c d)) = B[x <- (Bar a b), y <- (Haz c d)]
        //
        //(Foo.0 a b c d) = ...

        // Check the rules to see if there's any that will be covered by the new entry, including the rule itself.
        // Skips previously checked rules to avoid duplication.
        // For each unique matching rule, creates a new flattening rule for the entry.
        // Ex: (Fun (Ctr1 (Ctr2))) and (Fun (Ctr1 (Ctr3))) will both flatten to (Fun (Ctr1 .0)) and can be merged
        for (j, other) in entry.rules.iter().enumerate().skip(i) {
          let (compatible, same_shape) = matches_together(&rule, &other);
          if compatible {
            // (Foo a     (B x P) (C y0 y1)) = F
            // (Foo (A k) (B x Q) y        ) = G
            // -----------------------------
            // (Foo a (B x u) (C y0 y1)) = (Foo.0 a x u y0 y1)
            //   (Foo.0 a     x P y0 y1) = F
            //   (Foo.0 (A k) x Q f0 f1) = G [y <- (C f0 f1)] // f0 and f1 are fresh

            // Skip identical rules
            if same_shape {
              skip.insert(j);
            }
            let mut new_rule_pats = Vec::new();
            let mut new_rule_body = other.body.clone();
            for (rule_pat, other_pat) in rule.pats.iter().zip(&other.pats) {
              match (&**rule_pat, &**other_pat) {
                (CompTerm::Ctr { name: _, args: _ }, CompTerm::Ctr { name: _, args: other_pat_args }) => {
                  for other_field in other_pat_args {
                    new_rule_pats.push(other_field.clone());
                  }
                },
                (CompTerm::Ctr { name: rule_pat_name, args: rule_pat_args }, CompTerm::Var { name: other_pat_name }) => {
                  let mut new_ctr_args = vec![];
                      for _ in 0 .. rule_pat_args.len() {
                        let new_arg = CompTerm::Var { name: format!(".{}", post_inc(&mut var_count)) };
                        new_ctr_args.push(Box::new(new_arg.clone()));
                        new_rule_pats.push(Box::new(new_arg));
                      }
                      let new_ctr = CompTerm::Ctr { name: rule_pat_name.clone(), args: new_ctr_args };
                      subst(&mut new_rule_body, other_pat_name, &new_ctr);
                },
                (CompTerm::Var { .. }, _) => {
                  new_rule_pats.push(other_pat.clone());
                },
                (CompTerm::Num { numb: rule_pat_numb }, CompTerm::Num { numb: other_pat_numb }) => {
                  if rule_pat_numb == other_pat_numb {
                    new_rule_pats.push(Box::new(*other_pat.clone()));
                  } else {
                    panic!("Internal error. Please report."); // not possible since it matches
                  }
                },
                (CompTerm::Num { numb: _ }, CompTerm::Var { name: other_pat_name }) => {
                  subst(&mut new_rule_body, other_pat_name, &rule_pat);
                },
                _ => {
                  panic!("Internal error. Please report."); // not possible since it matches
                },
              }
            }
            let new_rule = CompRule { name: new_entry_name.clone(), pats: new_rule_pats, body: new_rule_body };
            new_entry_rules.push(new_rule);
          }
        }
        assert!(new_entry_rules.len() > 0);  // There's at least one rule, since rules always match with themselves
        let new_entry_args = (0..new_entry_rules[0].pats.len()).map(|n| format!("x{}", n)).collect();
        let new_entry = CompEntry {
          name : new_entry_name,
          kdln : new_entry_kdln,
          args : new_entry_args,
          rules: new_entry_rules,
          orig : false
        };
        let new_split_entries = flatten(new_entry);
        new_entries.extend(new_split_entries);
      } else {
        old_entry_rules.push(entry.rules[i].clone());
      }
    }
  }
  let old_entry = CompEntry {
    name: entry.name,
    kdln: entry.kdln,
    args: old_entry_args,
    rules: old_entry_rules,
    orig: entry.orig
  };
  new_entries.push(old_entry);
  new_entries
}

// Substitute all instances of a variable in a term with another term
pub fn subst(term: &mut CompTerm, sub_name: &str, value: &CompTerm) {
  match term {
    CompTerm::Var { name } => {
      if sub_name == name {
        *term = value.clone();
      }
    }
    CompTerm::Dup { nam0, nam1, expr, body } => {
      subst(&mut *expr, sub_name, value);
      if nam0 != sub_name && nam1 != sub_name {
        subst(&mut *body, sub_name, value);
      }
    }
    CompTerm::Let { name, expr, body } => {
      subst(&mut *expr, sub_name, value);
      if name != sub_name {
        subst(&mut *body, sub_name, value);
      }
    }
    CompTerm::Lam { name, body } => {
      if name != sub_name {
        subst(&mut *body, sub_name, value);
      }
    }
    CompTerm::App { func, argm } => {
      subst(&mut *func, sub_name, value);
      subst(&mut *argm, sub_name, value);
    }
    CompTerm::Ctr { args, .. } => {
      for arg in args {
        subst(&mut *arg, sub_name, value);
      }
    }
    CompTerm::Fun { args, .. } => {
      for arg in args {
        subst(&mut *arg, sub_name, value);
      }
    }
    CompTerm::Num { .. } => {}
    CompTerm::Op2 { val0, val1, .. } => {
      subst(&mut *val0, sub_name, value);
      subst(&mut *val1, sub_name, value);
    }
    CompTerm::Nil => {}
  }
}

// Removes proof-irrelevant parts of the term
pub fn erase(book: &Book, term: &Term) -> Box<CompTerm> {
  match term {
    Term::Typ { .. } => {
      return Box::new(CompTerm::Nil);
    }
    Term::Var { orig: _, name } => {
      let name = name.clone();
      return Box::new(CompTerm::Var { name });
    }
    Term::Lam { orig: _, name, body } => {
      let name = name.clone();
      let body = erase(book, body);
      return Box::new(CompTerm::Lam { name, body });
    }
    Term::App { orig: _, func, argm } => {
      let func = erase(book, func);
      let argm = erase(book, argm);
      return Box::new(CompTerm::App { func, argm });
    }
    Term::All { orig: _, name, tipo, body } => {
      return Box::new(CompTerm::Nil);
    }
    Term::Let { orig: _, name, expr, body } => {
      let name = name.clone();
      let expr = erase(book, expr);
      let body = erase(book, body);
      return Box::new(CompTerm::Let { name, expr, body });
    }
    Term::Ann { orig: _, expr, tipo: _ } => {
      return erase(book, expr);
    }
    Term::Sub { orig: _, expr, name: _, indx: _, redx: _ } => {
      return erase(book, expr);
    }
    Term::Ctr { orig: _, name, args: term_args } => {
      let name = name.clone();
      let entr = book.entrs.get(&name).unwrap();
      let mut args = vec![];
      for (idx, arg) in term_args.iter().enumerate() {
        if !entr.args[idx].eras {
          args.push(erase(book, arg));
        }
      }
      return Box::new(CompTerm::Ctr { name, args });
    }
    Term::Fun { orig: _, name, args: term_args } => {
      let name = name.clone();
      let entr = book.entrs.get(&name).unwrap();
      let mut args = vec![];
      for (idx, arg) in term_args.iter().enumerate() {
        if !entr.args[idx].eras {
          args.push(erase(book, arg));
        }
      }
      return Box::new(CompTerm::Fun { name, args });
    }
    Term::Hlp { orig: _ } => {
      return Box::new(CompTerm::Nil);
    }
    Term::U60 { orig: _ } => {
      return Box::new(CompTerm::Nil);
    }
    Term::Num { orig: _, numb } => {
      let numb = *numb as u128;
      return Box::new(CompTerm::Num { numb });
    }
    Term::Op2 { orig: _, oper, val0, val1 } => {
      let oper = oper.clone();
      let val0 = erase(book, val0);
      let val1 = erase(book, val1);
      return Box::new(CompTerm::Op2 { oper, val0, val1 });
    }
    Term::Hol { orig: _, numb } => {
      return Box::new(CompTerm::Nil);
    }
    Term::Mat { .. } => {
      return Box::new(CompTerm::Nil);
    }
  }
}

// Counts usages of a name in an erased term
pub fn count_uses(term: &CompTerm, count_name: &str) -> usize {
  match term {
    CompTerm::Var { name } => {
      if name == count_name { 1 } else { 0 }
    }
    CompTerm::Lam { name, body } => {
      if name == count_name {
        0
      } else {
        count_uses(body, count_name)
      }
    }
    CompTerm::App { func, argm } => {
      count_uses( func, count_name) + count_uses(argm, count_name)
    }
    CompTerm::Dup { nam0, nam1, expr, body } => {
      count_uses(expr, count_name) + (if nam0 == count_name || nam1 == count_name { 0 } else { count_uses(body, count_name) })
    }
    CompTerm::Let { name, expr, body } => {
      count_uses(expr, count_name) + (if name == count_name { 0 } else { count_uses(body, count_name) })
    }
    CompTerm::Ctr { name, args } => {
      let mut sum = 0;
      for arg in args {
        sum += count_uses(arg, count_name);
      }
      return sum;
    }
    CompTerm::Fun { name, args } => {
      let mut sum = 0;
      for arg in args {
        sum += count_uses(arg, count_name);
      }
      return sum;
    }
    CompTerm::Op2 { oper: _, val0, val1 } => {
      count_uses(val0, count_name) + count_uses(val1, count_name)
    }
    CompTerm::Num { .. } => {
      0
    }
    CompTerm::Nil => {
      0
    }
  }
}

// Renames a target variable using the fresh names in a vector
pub fn rename_clones(term: &mut CompTerm, target: &str, names: &mut Vec<String>) {
  match term {
    CompTerm::Var { name } => {
      if name == target {
        *name = names.pop().unwrap();
      }
    }
    CompTerm::Lam { name, body } => {
      if name != target {
        rename_clones(body, target, names);
      }
    }
    CompTerm::App { func, argm } => {
      rename_clones(func, target, names);
      rename_clones(argm, target, names);
    }
    CompTerm::Dup { nam0, nam1, expr, body } => {
      rename_clones(expr, target, names);
      if nam0 != target && nam1 != target {
        rename_clones(body, target, names);
      }
    }
    CompTerm::Let { name, expr, body } => {
      rename_clones(expr, target, names);
      if name != target {
        rename_clones(body, target, names);
      }
    }
    CompTerm::Ctr { name, args } => {
      for arg in args {
        rename_clones(arg, target, names);
      }
    }
    CompTerm::Fun { name, args } => {
      for arg in args {
        rename_clones(arg, target, names);
      }
    }
    CompTerm::Op2 { oper: _, val0, val1 } => {
      rename_clones(val0, target, names);
      rename_clones(val1, target, names);
    }
    CompTerm::Num { .. } => {}
    CompTerm::Nil => {}
  }
}

pub fn linearize_rule(rule: &mut CompRule) {
  // Returns left-hand side variables
  fn collect_lhs_vars<'a>(term: &'a mut CompTerm, vars: &mut HashMap<String, &'a mut CompTerm>) {
    match term {
      CompTerm::Var { name } => {
        vars.insert(name.clone(), term);
      }
      CompTerm::App { func, argm } => {
        collect_lhs_vars(func, vars);
        collect_lhs_vars(argm, vars);
      }
      CompTerm::Ctr { args, .. } => {
        for arg in args {
          collect_lhs_vars(arg, vars);
        }
      }
      CompTerm::Num { .. } => {}
      _ => { panic!("Invalid left-hand side."); }
    }
  }

  // linearize_name (Foo x x x x) 'x' 0
  // ----------------------------------------------------------------
  // dup x0 x1 = x; dup x2 x3 = x0; dup x4 x5 = x1; (Foo x2 x3 x4 x5)
  // Returns the number of times the variable was used in the body.
  pub fn linearize_name(body: &mut CompTerm, name: &mut String, fresh: &mut u64) -> usize {
    fn fresh_name(fresh: &mut u64) -> String {
      let name = format!("_{}", fresh);
      *fresh += 1;
      return name;
    }
    let uses = count_uses(&body, name);
    if uses > 1 {
      let mut names = vec![];
      for _ in 0 .. (uses - 1) * 2 {
        names.push(fresh_name(fresh));
      }
      //println!("-> uses is {}, names is {:?}", uses, names);
      let mut renames = vec![];
      for rename in names[names.len() - uses ..].iter().rev() {
        renames.push(rename.clone());
      }
      rename_clones(body, name, &mut renames);
      for i in (0 .. uses - 1).rev() {
        let nam0 = names[i * 2 + 0].clone();
        let nam1 = names[i * 2 + 1].clone();
        let expr = Box::new(CompTerm::Var {
          name: if i == 0 {
            name.to_string()
          } else {
            names[i - 1].clone()
          }
        });
        let new_body = CompTerm::Dup { nam0, nam1, expr, body: Box::new(CompTerm::Nil) };
        let old_body = std::mem::replace(body, new_body);
        if let CompTerm::Dup { ref mut body, .. } = body {
          let _ = std::mem::replace(body, Box::new(old_body));
        }
      }
    } else if uses == 0 {
      *name = String::from("~")
    }
    return uses;
  }

  // Linearies an erased term, replacing cloned variables by dups
  pub fn linearize_term(term: &mut CompTerm, fresh: &mut u64) {
    //println!("Linearizing: {:?}", term);
    match term {
      CompTerm::Var { name } => {}
      CompTerm::Lam { ref mut name, body } => {
        linearize_term(body, fresh);
        linearize_name(body, name, fresh);
      }
      CompTerm::App { func, argm } => {
        linearize_term(func, fresh);
        linearize_term(argm, fresh);
      }
      CompTerm::Let { ref mut name, expr, body } => {
        linearize_term(expr, fresh);
        linearize_term(body, fresh);
        linearize_name(body, name, fresh);
      }
      CompTerm::Ctr { name, args } => {
        for arg in args {
          linearize_term(arg, fresh);
        }
      }
      CompTerm::Fun { name, args } => {
        for arg in args {
          linearize_term(arg, fresh);
        }
      }
      CompTerm::Op2 { oper: _, val0, val1 } => {
        linearize_term(val0, fresh);
        linearize_term(val1, fresh);
      }
      CompTerm::Dup { ref mut nam0, ref mut nam1, expr, body, .. } => {
        // should be unreachable under normal usage, but I made it anyway
        linearize_term(expr, fresh);
        linearize_term(body, fresh);
        linearize_name(body, nam0, fresh);
        linearize_name(body, nam1, fresh);
      }
      CompTerm::Num { .. } => {}
      CompTerm::Nil => {}
    }
  }

  let mut vars = HashMap::new();  // rule pattern vars
  for pat in &mut rule.pats {
    collect_lhs_vars(&mut **pat, &mut vars);
  }
  let mut fresh = 0;
  for (mut name, var) in vars.drain() {
    let uses = linearize_name(&mut rule.body, &mut name, &mut fresh); // linearizes rule pattern vars
    // The &mut here doesn't do anything because
    // we're dropping var immediately afterwards.
    // To linearize rule variables, we'll have to replace all LHS occurrences by ~
    // if the amount of uses is zero
    if uses == 0 {
      if let CompTerm::Var { name } = var {
        *name = String::from("~");
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
  linearize_term(&mut rule.body, &mut fresh); // linearizes internal bound vars
}

// Swaps u120 numbers and functions for primitive operations for kindelia compilation
pub fn convert_u120_entry(entry: CompEntry) -> Result<CompEntry, String> {
  let CompEntry {name, kdln, args, rules, orig } = entry;
  let mut new_rules = Vec::new();
  for CompRule { name, pats, body } in rules {
    let body = convert_u120_term(&body, true)?;
    let mut new_pats = Vec::new();
    for pat in pats {
      new_pats.push(convert_u120_term(&pat, false)?);
    }
    new_rules.push(CompRule { name, pats: new_pats, body });
  }
  Ok(CompEntry { name, kdln, args, rules: new_rules, orig })
}

pub fn convert_u120_term(term: &CompTerm, rhs: bool) -> Result<Box<CompTerm>, String> {
  let term = Box::new(match term { 
    // Swap U120.new by a number
    CompTerm::Ctr { name, args } => {
      if name == "U120.new" {
        if let (CompTerm::Num { numb: num1 }, CompTerm::Num { numb: num2 }) = (&*args[0], &*args[1]) {
          CompTerm::Num { numb: (num1 << 60) + num2 }
        } else if rhs {
          let args = args.iter().map(|x| convert_u120_term(x, rhs)).collect::<Result<Vec<Box<CompTerm>>, String>>()?;
          CompTerm::Fun { name: name.clone(), args }
        } else {
          let err = format!("Can't compile pattern match on U120 to kindelia");
          return Err(err);
        }
      } else {
        let args = args.iter().map(|x| convert_u120_term(x, rhs)).collect::<Result<Vec<Box<CompTerm>>, String>>()?;
        CompTerm::Ctr { name: name.clone(), args }
      }
    }
    // Swap U120 functions by primitive operations
    CompTerm::Fun { name, args } => {
      if let Some(oper) = u120_to_oper(name) {
        let val0 = convert_u120_term(&*args[0], rhs)?;
        let val1 = convert_u120_term(&*args[1], rhs)?;
        CompTerm::Op2 { oper, val0, val1 }
      } else {
        let args = args.iter().map(|x| convert_u120_term(x, rhs)).collect::<Result<Vec<Box<CompTerm>>, String>>()?;
        CompTerm::Fun { name: name.clone(), args }
      }
    }
    CompTerm::Var { name } => {
      term.clone()
    }
    CompTerm::Lam { name, body } => {
      let body = convert_u120_term(body, rhs)?;
      CompTerm::Lam { name: name.clone(), body }
    }
    CompTerm::App { func, argm } => {
      let func = convert_u120_term(func, rhs)?;
      let argm = convert_u120_term(argm, rhs)?;
      CompTerm::App { func, argm }
    }
    CompTerm::Dup { nam0, nam1, expr, body } => {
      let expr = convert_u120_term(expr, rhs)?;
      let body = convert_u120_term(body, rhs)?;
      CompTerm::Dup { nam0: nam0.clone(), nam1: nam1.clone(), expr, body }
    }
    CompTerm::Let { name, expr, body } => {
      let expr = convert_u120_term(expr, rhs)?;
      let body = convert_u120_term(body, rhs)?;
      CompTerm::Let { name: name.clone(), expr, body }
    }
    CompTerm::Num { numb } => {
      term.clone()
    }
    CompTerm::Op2 { oper, val0, val1 } => {
      let val0 = convert_u120_term(val0, rhs)?;
      let val1 = convert_u120_term(val1, rhs)?;
      CompTerm::Op2 { oper: oper.clone(), val0, val1 }
    }
    CompTerm::Nil => {
      return Err("Found nil term during compilation".to_string());
    }
  });
  Ok(term)
}

// Converts a U120 function name to the corresponding primitive operation
// None if the name is not of an operation
pub fn u120_to_oper(name: &String) -> Option<Oper> {
  match name.as_str() {
    "U120.add"               => Some(Oper::Add),
    "U120.sub"               => Some(Oper::Sub),
    "U120.mul"               => Some(Oper::Mul),
    "U120.div"               => Some(Oper::Div),
    "U120.mod"               => Some(Oper::Mod),
    "U120.bitwise_and"       => Some(Oper::And),
    "U120.bitwise_or"        => Some(Oper::Or ),
    "U120.bitwise_xor"       => Some(Oper::Xor),
    "U120.shift_left"        => Some(Oper::Shl),
    "U120.shift_right"       => Some(Oper::Shr),
    "U120.num_less_than"     => Some(Oper::Ltn),
    "U120.num_less_equal"    => Some(Oper::Lte),
    "U120.num_greater_than"  => Some(Oper::Gtn),
    "U120.num_greater_equal" => Some(Oper::Gte),
    "U120.num_equal"         => Some(Oper::Eql),
    "U120.num_not_equal"     => Some(Oper::Neq),
    _ => None
  }
}

// Derivers
// ========

pub fn derive_type(tipo: &NewType) -> Derived {
  let path = format!("{}/_.kind2", tipo.name.replace(".","/"));
  let name = format!("{}", tipo.name);
  let kdln = None;
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
  let entr = Entry { name, kdln, args, tipo, rules };
  return Derived { path, entr };
}

pub fn derive_ctr(tipo: &NewType, index: usize) -> Derived {
  if let Some(ctr) = tipo.ctrs.get(index) {
    let path = format!("{}/{}.kind2", tipo.name.replace(".","/"), ctr.name);
    let name = format!("{}.{}", tipo.name, ctr.name);
    let kdln = None;
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
    let entr  = Entry { name, kdln, args, tipo, rules };
    return Derived { path, entr };
  } else {
    panic!("Constructor out of bounds.");
  }
}

pub fn derive_match(ntyp: &NewType) -> Derived {
  // type List <t: Type> { nil cons (head: t) (tail: (List t)) }
  // -----------------------------------------------------------
  // List.match <t: Type> (x: (List t)) -(p: (List t) -> Type) (nil: (p (List.nil t))) (cons: (head: t) (tail: (List t)) (p (List.cons t head tail))) : (p x)
  // List.match t (List.nil t)            p nil cons = nil
  // List.match t (List.cons t head tail) p nil cons = (cons head tail)

  let path = format!("{}/match.kind2", ntyp.name.replace(".","/"));

  fn gen_type_ctr(ntyp: &NewType) -> Box<Term> {
    Box::new(Term::Ctr {
      orig: 0,
      name: ntyp.name.clone(),
      args: ntyp.pars.iter().map(|x| Box::new(Term::Var { orig: 0, name: x.name.clone() })).collect(),
    })
  }

  fn gen_ctr_value(ntyp: &NewType, ctr: &Box<Constructor>, index: usize, suffix: &str) -> Box<Term> {
    let mut ctr_value_args = vec![];
    for par in &ntyp.pars {
      ctr_value_args.push(Box::new(Term::Var { orig: 0, name: format!("{}{}", par.name, suffix) }));
    }
    for fld in &ctr.args {
      ctr_value_args.push(Box::new(Term::Var { orig: 0, name: format!("{}{}", fld.name, suffix) }));
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
  let kdln = None;

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

  // -(p: (List t) -> Type)
  args.push(Box::new(Argument {
    eras: true,
    hide: false,
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
          argm: gen_ctr_value(ntyp, ctr, index, ""),
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
    pats.push(gen_ctr_value(ntyp, &ctr, idx, "_"));
    pats.push(Box::new(Term::Var { orig: 0, name: "p".to_string() }));
    for ctr in &ntyp.ctrs {
      pats.push(Box::new(Term::Var { orig: 0, name: ctr.name.clone() }));
    }
    let mut body_args = vec![];
    for arg in &ctr.args {
      body_args.push(Box::new(Term::Var { orig: 0, name: format!("{}_", arg.name) }));
    }
    let body = Box::new(Term::Ctr {
      orig: 0,
      name: ctr.name.clone(),
      args: body_args,
    });
    rules.push(Box::new(Rule { orig, name, pats, body }));
  }

  let entr = Entry { name, kdln, args, tipo, rules };

  return Derived { path, entr };
}

//type List <t: Type> { nil cons (head: t) (tail: (List t)) }
//pub struct Type { name: String, pars: Vec<Argument>, ctrs: Vec<Constructor> }
//pub struct Constructor { name: String, args: Vec<Argument> }
//pub struct Entry { pub name: String, pub kdln: Option<String>, pub args: Vec<Box<Argument>>, pub tipo: Box<Term>, pub rules: Vec<Box<Rule>> }
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
