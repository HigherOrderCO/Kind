use std::path::{Path, PathBuf};

use crate::book::{Entry, new_type::{ProdType, Derived, SumType, Constructor}, Argument, name::Ident, term::Term, span::Span, Rule};

use super::derive_match;


fn args_to_vars(vec: &Vec<Box<Argument>>) -> Vec<Box<Term>> {
  vec
    .iter()
    .map(|x| {
        Box::new(Term::Var {
            orig: Span::Generated,
            name: x.name.clone(),
        })
    })
    .collect()
}

pub fn derive_prod_type(path: &str, tipo: &ProdType) -> Derived {
  let root = Path::new(path).join(tipo.name.to_path());
  let path = root.join("_.kind2");
  let name = tipo.name.clone();

  Derived {
    path,
    entr: Entry::new_type_signature(name, tipo.pars.clone())
  }
}

pub fn derive_prod_constructor(prod: &ProdType) -> Derived {
  let name = Ident::new_path(&prod.name.0, "new");
  let path = format!("{}/new.kind2", prod.name.0.replace('.', "/"));
  let mut args = prod.pars.clone();

  for field in &prod.fields {
    args.push(field.clone())
  }

  let tipo = Box::new(Term::Ctr {
    orig: Span::Generated,
    name: prod.name.clone(),
    args: args_to_vars(&prod.pars)
  });

  Derived {
    path: PathBuf::from(path),
    entr: Entry {
      name,
      orig: Span::Generated,
      kdln: None,
      args: args.clone(),
      tipo,
      rules: vec![],
      attrs: vec![]
    }
  }
}

pub fn derive_getters(prod: &ProdType) -> Vec<Derived> {
  let mut args = prod.pars.clone();

  let name_lower = prod.name.0.split('.').collect::<Vec<&str>>().pop().unwrap().to_lowercase();

  let tipo = Box::new(Term::Ctr {
    orig: Span::Generated,
    name: prod.name.clone(),
    args: args_to_vars(&prod.pars)
  });

  args.push(Box::new(Argument::new_accessible(Ident(name_lower), tipo)));

  let mut derived = Vec::new();

  for field in &prod.fields {
    let name = Ident::new_path(&prod.name.0, &format!("get.{}", &field.name.0));
    let path = format!("{}/get/{}.kind2", prod.name.0.replace('.', "/"), &field.name.0);

    let pat = Box::new(Term::Ctr {
      orig: Span::Generated,
      name: Ident::new_path(&prod.name.0, "new"),
      args: args_to_vars(&prod.fields)
    });

    let body = Box::new(Term::Var {
      orig: Span::Generated,
      name: field.name.clone(),
    });

    derived.push(Derived {
      path: PathBuf::from(path),
      entr: Entry {
        name: name.clone(),
        orig: Span::Generated,
        kdln: None,
        args: args.clone(),
        tipo: field.tipo.clone(),
        rules: vec![Box::new(Rule { orig: Span::Generated, name, pats: vec![pat], body })],
        attrs: vec![]
      }
    })
  }

  derived
}

pub fn derive_setters(prod: &ProdType) -> Vec<Derived> {
  let mut args = prod.pars.clone();

  let tipo = Box::new(Term::Ctr {
    orig: Span::Generated,
    name: prod.name.clone(),
    args: args_to_vars(&prod.pars)
  });

  let name_lower = prod.name.0.split('.').collect::<Vec<&str>>().pop().unwrap().to_lowercase();

  args.push(Box::new(Argument {
    hide: false,
    orig: Span::Generated,
    name: Ident(name_lower),
    eras: false,
    tipo: tipo.clone()
  }));

  let mut derived = Vec::new();

  for i in 0..prod.fields.len() {
    let field = &prod.fields[i];
    let name = Ident::new_path(&prod.name.0, &format!("set.{}", &field.name.0));
    let path = format!("{}/set/{}.kind2", prod.name.0.replace('.', "/"), &field.name.0);
    let new_name = Ident(format!("new_{}", field.name.clone()));

    let mut args = args.clone();
    args.push(Box::new(Argument { hide: false, orig: Span::Generated, eras: false, name: new_name.clone(), tipo: field.tipo.clone()}));

    let pat = Box::new(Term::Ctr {
      orig: Span::Generated,
      name: Ident::new_path(&prod.name.0, "new"),
      args: args_to_vars(&prod.fields)
    });

    let new_pat = Box::new(Term::Var { orig: Span::Generated, name: new_name });

    let mut new_args = args_to_vars(&prod.fields);
    new_args[i] = new_pat.clone();

    let body = Box::new(Term::Ctr {
      orig: Span::Generated,
      name: Ident::new_path(&prod.name.0, "new"),
      args: new_args
    });

    derived.push(Derived {
      path: PathBuf::from(path),
      entr: Entry {
        name: name.clone(),
        orig: Span::Generated,
        kdln: None,
        args: args.clone(),
        tipo: tipo.clone(),
        rules: vec![Box::new(Rule { orig: Span::Generated, name, pats: vec![pat, new_pat], body })],
        attrs: vec![]
      }
    })
  }

  derived
}

pub fn derive_prod_match(prod: &ProdType) -> Derived {

  // We just use the same generator as the sum type.
  let sum_type = SumType {
    name: prod.name.clone(),
    pars: prod.pars.clone(),
    ctrs: vec![Box::new(Constructor {
      name: Ident("new".to_string()),
      args: prod.fields.clone()
    })],
  };

  derive_match(&sum_type)
}