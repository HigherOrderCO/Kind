use crate::language::*;
use std::collections::HashMap;

#[derive(Debug)]
pub struct TypeFamily {
  pub type_name: String,
  pub type_constructor: Box<Entry>,
  pub constructors: HashMap<String, Box<Entry>>
}

pub struct DefinitionMap {
  pub type_families: HashMap<String, TypeFamily>,
  pub entries: HashMap<String, Box<Entry>>
}

pub fn get_type_constructor(term: &Term) -> Option<String> {
  match term {
    Term::Ctr { name, .. } => Some(name.clone()),
    Term::App { func, .. } => get_type_constructor(func),
    Term::All { body, .. } => get_type_constructor(body),
    _ => None
  }
}

pub fn is_type_constructor(term: &Term) -> bool {
  match term {
    Term::All { body, .. } => is_type_constructor(body),
    Term::Typ {..} => true,
    _ => false
  }
}

// Tries to find all the obvious constructors of a type
// and all of the rules into a single structure that is
// called `DefinitionMap`. It's useful to the coverage
// checking.
pub fn build_definition_map(book: &Book) -> DefinitionMap {

  let mut definition_map = DefinitionMap {
    type_families: HashMap::new(),
    entries: HashMap::new()
  };

  // We are creating this structures just to make the coverage
  // map cleaner and because data construtors and type constructors
  // appear at random orders.
  let mut type_constructors: HashMap<String, Box<Entry>> = HashMap::new();
  let mut data_constructors: HashMap<String, HashMap<String, Box<Entry>>> = HashMap::new();

  for (_, entry) in &book.entrs {
    if entry.rules.len() == 0 {
      if let Some(constr) = get_type_constructor(&entry.tipo) {
        if entry.is_axiom {
        continue;
        }
        if let Some(cons) = data_constructors.get_mut(&constr) {
          cons.insert(entry.name.clone(), entry.clone());
        } else {
          data_constructors.insert(constr, HashMap::from([(entry.name.clone(), entry.clone())]));
        }
      } else if is_type_constructor(&entry.tipo) {
        type_constructors.insert(entry.name.clone(), entry.clone());
      }
    } else {
      definition_map.entries.insert(entry.name.clone(), entry.clone());
    }
  }

  for (type_name, data_family) in &data_constructors {
    if let Some(type_cons) = type_constructors.get(type_name) {
      definition_map.type_families.insert(type_name.clone(), TypeFamily {
        type_name: type_name.clone(),
        type_constructor: type_cons.clone(),
        constructors: data_family.clone()
      });
    };
  };

  for (type_name, type_cons) in type_constructors {
    if let None = definition_map.type_families.get(&type_name) {
      definition_map.type_families.insert(type_name.clone(), TypeFamily {
        type_name: type_name.clone(),
        type_constructor: type_cons.clone(),
        constructors: HashMap::new()
      });
    }
  }

  return definition_map
}


fn compile_rhs(rule: &Rule, index: usize, vars: &mut u64, args: &mut Vec<String>) -> String {
  if index < rule.pats.len() {
    let (inp_patt_str, var_patt_str) = to_checker_patt_chk(&rule.pats[index], vars);
    args.push(var_patt_str);
    let head = inp_patt_str;
    let tail = compile_rhs(rule, index + 1, vars, args);
    return format!("(Kind.Rule.lhs {} {})", head, tail);
  } else {
    return format!("(Kind.Rule.rhs Unbound)");
  }
}

pub fn to_checker_term_creator(args: &Vec<Box<Argument>>, tipo: &Term, index: usize) -> String {
  if index < args.len() {
    let arg = &args[index];
    format!("(Kind.Coverage.Creator.cons {} λ{} {})",
      to_checker_term(&arg.tipo, true, false), arg.name,
      to_checker_term_creator(args, tipo, index + 1))
  } else {
    format!("(Kind.Coverage.Creator.end {})", to_checker_term(tipo, true, false))
  }
}


// This function compiles the coverage map into the structures
// that we need inside the coverage.hvm
// Lets take the function "max" as an example.
// @
// Nat : Type
//  Nat.z             : Nat
//  Nat.s (pred: Nat) : Nat
//
// Nat.max (n: Nat) (m: Nat): Nat
// Nat.max Nat.z     j         = j
// Nat.max i         Nat.z     = i
// Nat.max (Nat.s i) (Nat.s j) = Nat.s (Nat.max i j)
// @
//
// The type family definition will be compiled to a HVM version
// that shows each constructor and the type of the type constructor.
// e.g.
//
// @
// (Kind.TypeFamily.Name Nat.) = "Nat"
// (Kind.TypeFamily.Type Nat.) = (Kind.Term.typ 167772166)
// (Kind.TypeFamily.Constructors Nat.) =
//    let const = List.nil
//    let const = List.cons (Kind.Constructor.new Nat.z.) const
//    let const = List.cons (Kind.Constructor.new Nat.s.) const
//    const
//
// (Kind.Constructor.Name Nat.z.) = "Nat.z"
// (Kind.Constructor.Type Nat.z.) = "Nat.z"
//
// (Kind.Constructor.Name Nat.s.) = "Nat.s"
// (Kind.Constructor.Type Nat.s.) = (Kind.Term.all 0 13855336 (Kind.Term.ct0 Nat. 721420328) λpred (Kind.Term.ct0 Nat. 822083630))
// @
//
// And the definition will be compiled to a simple definition of
// a split tree of the patterns.

pub fn compile_definition_map(definitions: DefinitionMap) -> String {
  let mut result = String::new();

  result.push_str("\n// Type Families\n\n");

  for (name, type_family) in &definitions.type_families {
    result.push_str(&format!("(Kind.Axiom.name_of {}.) = \"{}\"\n", name, name));
    result.push_str(&format!("(Kind.Axiom.type_of {}.) = {}\n", name, to_checker_type(&type_family.type_constructor.args, &type_family.type_constructor.tipo, 0)));
    result.push_str(&format!("(Kind.Axiom.constructors_of {}.) =\n  let const = List.nil\n", name));
    for (data_name, data_cons) in &type_family.constructors {
      let compiled_ty = to_checker_type(&data_cons.args, &data_cons.tipo, 0);
      result.push_str(&format!("  let const = (List.cons ({}.) const)\n", data_name));
    }
    result.push_str("  const\n\n");
    for (data_name, data_cons) in &type_family.constructors {
      let constructor = Term::Ctr { orig:0, name: data_name.to_string(), args: data_cons.args.iter().map(|x| Box::new(Term::Var { name: x.name.clone(), orig: 0 })).collect() };
      result.push_str(&format!("(Kind.Axiom.creator_of {}.) = {}\n\n", data_name, to_checker_term_creator(&data_cons.args, &constructor, 0)));
    }
  }

  for (name, entry) in &definitions.entries {
    result.push_str(&format!("(Kind.Axiom.should_check {}.) = Bool.true\n", name));
  }

  result.push_str("(Kind.Axiom.should_check x) = Bool.false\n");

  result
}