use std::path::{Path, PathBuf};

use crate::book::name::Ident;
use crate::book::new_type::{Constructor, Derived, SumType};
use crate::book::span::Span;
use crate::book::term::Term;
use crate::book::{Argument, Entry, Rule};

pub fn derive_sum_type(path: &str, tipo: &SumType) -> Derived {
    let root = Path::new(path).join(tipo.name.to_path());
    let path = root.join("_.kind2");
    let mut args = vec![];
    for par in &tipo.pars {
        args.push(Box::new(Argument {
            hide: false,
            orig: Span::Generated,
            eras: false,
            name: par.name.clone(),
            tipo: par.tipo.clone(),
        }));
    }
    let entr = Entry::new_type_signature(tipo.name.clone(), args);
    Derived {
        path,
        entr,
    }
}

fn args_to_vars(vec: &[Box<Argument>]) -> Vec<Box<Term>> {
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

pub fn derive_ctr(tipo: &SumType, index: usize) -> Derived {
    if let Some(ctr) = tipo.ctrs.get(index) {
        let path = format!("{}/{}.kind2", tipo.name.to_path(), ctr.name);
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
            orig: Span::Generated,
            name: tipo.name.clone(),
            args: tipo
                .pars
                .iter()
                .map(|x| {
                    Box::new(Term::Var {
                        orig: Span::Generated,
                        name: x.name.clone(),
                    })
                })
                .collect(),
        });
        let rules = vec![];
        let entr = Entry {
            name: Ident(name),
            orig: Span::Generated,
            kdln,
            args,
            tipo,
            rules,
            attrs: vec![]
        };
        Derived { path: Path::new(&path).to_owned(), entr }
    } else {
        panic!("Constructor out of bounds.");
    }
}

pub fn derive_match(ntyp: &SumType) -> Derived {
    let path = format!("{}/match.kind2", ntyp.name.0.replace('.', "/"));

    fn gen_type_ctr(ntyp: &SumType) -> Box<Term> {
        Box::new(Term::Ctr {
            orig: Span::Generated,
            name: ntyp.name.clone(),
            args: args_to_vars(&ntyp.pars),
        })
    }

    fn gen_ctr_value(ntyp: &SumType, ctr: &Constructor, _: usize, suffix: &str) -> Box<Term> {
        let mut ctr_value_args = vec![];

        for par in &ntyp.pars {
            ctr_value_args.push(Box::new(Term::new_var(Ident(format!("{}{}", par.name, suffix)))));
        }

        for fld in &ctr.args {
            ctr_value_args.push(Box::new(Term::new_var(Ident(format!("{}{}", fld.name, suffix)))));
        }

        Box::new(Term::Ctr {
            orig: Span::Generated,
            name: Ident::new_path(&ntyp.name.0, &ctr.name.0),
            args: ctr_value_args,
        })
    }

    // List.match
    let name = Ident::new_path(&ntyp.name.0, "match");
    let kdln = None;

    let mut args = vec![];

    //  <t: Type>
    for par in &ntyp.pars {
        args.push(Box::new(Argument::new_hidden(par.name.clone(), par.tipo.clone())));
    }

    // (x: (List t))
    args.push(Box::new(Argument::new_accessible(Ident("x".to_string()), gen_type_ctr(ntyp))));

    let motive_type = Box::new(Term::All {
        orig: Span::Generated,
        name: Ident("x".to_string()),
        tipo: gen_type_ctr(ntyp),
        body: Box::new(Term::Typ { orig: Span::Generated }),
    });

    // -(p: (List t) -> Type)
    args.push(Box::new(Argument::new_erased(Ident("p".to_string()), motive_type)));

    // (nil: (p (List.nil t)))
    // (cons: (head t) (tail: (List t)) (p (List.cons t head tail)))
    for ctr in &ntyp.ctrs {
        fn ctr_case_type(ntyp: &SumType, ctr: &Constructor, index: usize) -> Box<Term> {
            if index < ctr.args.len() {
                // for nil  = ...
                // for cons = (head: t) (tail: (List t))
                let arg = ctr.args.get(index).unwrap();
                Box::new(Term::All {
                    orig: Span::Generated,
                    name: arg.name.clone(),
                    tipo: arg.tipo.clone(),
                    body: ctr_case_type(ntyp, ctr, index + 1),
                })
            } else {
                // for nil  = (p (List.nil t))
                // for cons = (p (List.cons t head tail))
                Box::new(Term::App {
                    orig: Span::Generated,
                    func: Box::new(Term::Var {
                        orig: Span::Generated,
                        name: Ident("p".to_string()),
                    }),
                    argm: gen_ctr_value(ntyp, ctr, index, ""),
                })
            }
        }
        args.push(Box::new(Argument {
            eras: false,
            orig: Span::Generated,
            hide: false,
            name: ctr.name.clone(),
            tipo: ctr_case_type(ntyp, ctr, 0),
        }));
    }

    // : (p x)
    let tipo = Box::new(Term::App {
        orig: Span::Generated,
        func: Box::new(Term::Var {
            orig: Span::Generated,
            name: Ident("p".to_string()),
        }),
        argm: Box::new(Term::Var {
            orig: Span::Generated,
            name: Ident("x".to_string()),
        }),
    });

    // List.match t (List.nil t)            p nil cons = nil
    // List.match t (List.cons t head tail) p nil cons = (cons head tail)
    let mut rules = vec![];

    for idx in 0..ntyp.ctrs.len() {
        let ctr = &ntyp.ctrs[idx];
        let orig = Span::Generated;
        let name = format!("{}.match", ntyp.name);
        let mut pats = vec![];
        for par in &ntyp.pars {
            pats.push(Box::new(Term::Var {
                orig: Span::Generated,
                name: par.name.clone(),
            }));
        }
        pats.push(gen_ctr_value(ntyp, ctr, idx, "_"));
        pats.push(Box::new(Term::Var {
            orig: Span::Generated,
            name: Ident("p".to_string()),
        }));
        for ctr in &ntyp.ctrs {
            pats.push(Box::new(Term::Var {
                orig: Span::Generated,
                name: ctr.name.clone(),
            }));
        }
        let mut body_args = vec![];
        for arg in &ctr.args {
            body_args.push(Box::new(Term::Var {
                orig: Span::Generated,
                name: Ident(format!("{}_", arg.name)),
            }));
        }
        let body = Box::new(Term::Ctr {
            orig: Span::Generated,
            name: ctr.name.clone(),
            args: body_args,
        });
        rules.push(Box::new(Rule {
            orig,
            name: Ident(name),
            pats,
            body,
        }));
    }

    let entr = Entry {
        name,
        orig: Span::Generated,
        kdln,
        args,
        tipo,
        rules,
        attrs: vec![]
    };
    Derived { path: PathBuf::from(path), entr }
}
