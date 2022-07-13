#![allow(dead_code)] 
#![allow(unused_variables)] 

// imports hashmap
use std::collections::HashMap;

//  type Bool {
//    {True}
//    {False}
//  }
//
//  type List <T: Type> {
//    {Nil}
//    {Cons T (List <T>)}
//  }
//    
//  type Equal <T: Type> (a: T) ~ (b: T) {
//    {Refl} ~ (b = a)
//  }
//
//  Add (a: Nat) (b: Nat) : Nat {
//    {Zero}   b => b
//    {Succ a} b => {Succ (Add a b)}
//  }
//
//  Add (a: Nat) (b: Nat) : Nat =
//    match a {
//      {Zero}   => b
//      {Succ a} => {Succ (Add a b)}
//    }
//
//   Map <A: Type> <B: Type> (f: A -> B) (xs: List A) : List B {
//     A B f {Cons x xs} => {Cons (f x) (map A B f xs)}
//     A B f {Nil}       => {Nil}
//   }
//
//   Main : (List Nat) =
//     let x = 50
//     let y = 60
//     if (== x y) {
//       (print "hi")
//     } else {
//       (print "bye")
//     }
//
//   alice : Person =
//     {Person
//       age: 40
//       name: "Alice"
//       items: ["Foo", "Bar", "Tic", "Tac"]
//     }
//   
//   {Cons x xs}
//   {Cons head: x tail: xs }

use hvm::parser as parser;

#[derive(Clone, Debug)]
pub enum Term {
  Typ,
  Var { name: String },
  Let { name: String, expr: Box<Term>, body: Box<Term> },
  App { func: Box<Term>, argm: Box<Term> },
  Lam { name: String, body: Box<Term> },
  All { name: String, tipo: Box<Term>, body: Box<Term> },
  Ctr { name: String, args: Vec<Box<Term>> },
  Fun { name: String, args: Vec<Box<Term>> },
}

#[derive(Clone, Debug)]
pub struct Argument {
  eras: bool,
  name: String,
  tipo: Box<Term>,
}

#[derive(Clone, Debug)]
pub struct Rule {
  pats: Vec<Box<Term>>,
  body: Box<Term>,
}

#[derive(Clone, Debug)]
pub struct Entry {
  name: String,
  args: Vec<Box<Argument>>,
  tipo: Box<Term>,
  rules: Vec<Box<Rule>>
}

#[derive(Clone, Debug)]
pub struct File {
  entries: HashMap<String, Box<Entry>>
}

pub fn parse_var(state: parser::State) -> parser::Answer<Option<Box<Term>>> {
  parser::guard(
    Box::new(|state| {
      let (state, head) = parser::get_char(state)?;
      Ok((state, ('a'..='z').contains(&head) || head == '_' || head == '$'))
    }),
    Box::new(|state| {
      let (state, name) = parser::name(state)?;
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
      let (state, name) = parser::name(state)?;
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
      Ok((state, all0 && all1 && name.len() > 0))
    }),
    Box::new(|state| {
      let (state, _)    = parser::consume("(", state)?;
      let (state, name) = parser::name(state)?;
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
      let (state, name) = parser::name1(state)?;
      let (state, _)    = parser::consume("=", state)?;
      let (state, expr) = parse_term(state)?;
      let (state, _)    = parser::text(";", state)?;
      let (state, body) = parse_term(state)?;
      Ok((state, Box::new(Term::Let { name, expr, body })))
    }),
    state,
  );
}

pub fn parse_ctr(state: parser::State) -> parser::Answer<Option<Box<Term>>> {
  parser::guard(
    Box::new(|state| {
      let (state, _)    = parser::text("{", state)?;
      let (state, head) = parser::get_char(state)?;
      Ok((state, ('A'..='Z').contains(&head)))
    }),
    Box::new(|state| {
      let (state, open) = parser::text("{", state)?;
      let (state, name) = parser::name1(state)?;
      if name == "Type" {
        Ok((state, Box::new(Term::Typ)))
      } else {
        let (state, args) = if open {
          parser::until(parser::text_parser("}"), Box::new(parse_term), state)?
        } else {
          (state, Vec::new())
        };
        Ok((state, Box::new(Term::Ctr { name, args })))
      }
    }),
    state,
  )
}

pub fn parse_fun(state: parser::State) -> parser::Answer<Option<Box<Term>>> {
  parser::guard(
    Box::new(|state| {
      let (state, _)    = parser::text("(", state)?;
      let (state, head) = parser::get_char(state)?;
      Ok((state, ('A'..='Z').contains(&head)))
    }),
    Box::new(|state| {
      let (state, open) = parser::text("(", state)?;
      let (state, name) = parser::name1(state)?;
      let (state, args) = if open {
        parser::until(parser::text_parser(")"), Box::new(parse_term), state)?
      } else {
        (state, Vec::new())
      };
      Ok((state, Box::new(Term::Fun { name, args })))
    }),
    state,
  )
}

pub fn parse_term(state: parser::State) -> parser::Answer<Box<Term>> {
  parser::grammar(
    "Term",
    &[
      Box::new(parse_let), // `let `
      Box::new(parse_all), // `(name:`
      Box::new(parse_ctr), // `{Name`
      Box::new(parse_fun), // `(Name`
      Box::new(parse_app), // `(`
      Box::new(parse_lam), // `@`
      Box::new(parse_var), // 
      Box::new(|state| Ok((state, None))),
    ],
    state,
  )
}

pub fn parse_entry(state: parser::State) -> parser::Answer<Box<Entry>> {
  let (state, name) = parser::name1(state)?;
  let (state, args) = parser::until(parser::text_parser(":"), Box::new(parse_argument), state)?;
  let (state, tipo) = parse_term(state)?;
  let (state, head) = parser::get_char(state)?;
  if head == '=' {
    let (state, body) = parse_term(state)?;
    let rules = vec![Box::new(Rule { pats: vec![], body })];
    return Ok((state, Box::new(Entry { name, args, tipo, rules })));
  } else if head == '{' {
    let (state, rules) = parser::until(parser::text_parser("}"), Box::new(parse_rule), state)?;
    return Ok((state, Box::new(Entry { name, args, tipo, rules })));
  } else {
    parser::expected("'=' or '{'", 1, state)
  }
}

pub fn parse_rule(state: parser::State) -> parser::Answer<Box<Rule>> {
  let (state, pats) = parser::until(parser::text_parser("=>"), Box::new(parse_term), state)?;
  let (state, body) = parse_term(state)?;
  return Ok((state, Box::new(Rule { pats, body })));
}

pub fn parse_argument(state: parser::State) -> parser::Answer<Box<Argument>> {
  let (state, _)    = parser::consume("(", state)?;
  let (state, name) = parser::name1(state)?;
  let (state, _)    = parser::consume(":", state)?;
  let (state, tipo) = parse_term(state)?;
  let (state, _)    = parser::consume(")", state)?;
  return Ok((state, Box::new(Argument { eras: false, name, tipo })));
}

pub fn parse_file(state: parser::State) -> parser::Answer<Box<File>> {
  let (state, entry_vec) = parser::until(Box::new(parser::done), Box::new(parse_entry), state)?;
  let mut entries = HashMap::new();
  for entry in entry_vec {
    entries.insert(entry.name.clone(), entry);
  }
  return Ok((state, Box::new(File { entries })));
}

pub fn show_term(term: &Term) -> String {
  match term {
    Term::Typ => {
      format!("Type")
    }
    Term::Var { name } => {
      format!("{}", name)
    }
    Term::Let { name, expr, body } => {
      let expr = show_term(expr);
      let body = show_term(body);
      format!("let {} = {}; {}", name, expr, body)
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
    Term::Ctr { name, args } => {
      format!("{{{}{}}}", name, args.iter().map(|x| format!(" {}",show_term(x))).collect::<String>())
    }
    Term::Fun { name, args } => {
      format!("({}{})", name, args.iter().map(|x| format!(" {}",show_term(x))).collect::<String>())
    }
  }
}

pub fn show_rule(rule: &Rule) -> String {
  let mut pats = vec![];
  for pat in &rule.pats {
    pats.push(show_term(pat));
  }
  let body = show_term(&rule.body);
  format!("{} => {}", pats.join(" "), body)
}

pub fn show_entry(entry: &Entry) -> String {
  let name = &entry.name;
  let mut args = vec![];
  for arg in &entry.args {
    args.push(format!(" ({}: {})", arg.name, show_term(&arg.tipo)));
  }
  let mut rules = vec![];
  for rule in &entry.rules {
    rules.push(format!("\n {}", show_rule(rule)));
  }
  format!("{}{} : {} {{{}\n}}", name, args.join(""), show_term(&entry.tipo), rules.join(""))
}

pub fn show_file(file: &File) -> String {
  let mut entries = vec![];
  for entry in file.entries.values() {
    entries.push(show_entry(entry));
  }
  entries.join("\n")
}

pub fn read_term(code: &str) -> Result<Box<Term>, String> {
  parser::read(Box::new(parse_term), code)
}

pub fn read_file(code: &str) -> Result<Box<File>, String> {
  parser::read(Box::new(parse_file), code)
}

fn main() -> Result<(), String> {

  //let term = read_term("{Foo @x(x) {Tic} {Tac}}")?;
  //println!("Parsed: {}", show_term(&*term));

  let file = read_file("
    Bool : Type {}
      True  : Bool {}
      False : Bool {}

    Add (a: Nat) (b: Nat) : Nat {
      {Zero}   b => b
      {Succ a} b => {Succ (Add a b)}
    }

    Not (a: Bool) : Bool {
      {True}  => {False}
      {False} => {True}
    }

    Map (a: Type) (b: Type) (f: (x: a) a) (xs: (List a)) : (List b) {
      a b f {Cons x xs} => {Cons (f x) (Map a b f xs)}
      a b f Nil         => {Nil}
    }
  ")?;

  println!("parsed:\n\n{}", show_file(&file));

  return Ok(());
}





//Map (a: {Type}) (b: {Type}) (f: (x: a) a) (xs: ({List} a)) : ({List} b) {
 //a b f {Cons x xs} => {Cons (f x) ({Map} a b f xs)}
 //a b f {Nil}       => {Nil}
//}














