use crate::book::name::Ident;
use crate::book::new_type::{Constructor, Derived, NewType};
use crate::book::span::Span;
use crate::book::term::Term;
use crate::book::{Argument, Entry, Rule};
use crate::parser::*;

pub fn derive_type(tipo: &NewType) -> Derived {
    let path = format!("{}/_.kind2", tipo.name.0.replace('.', "/"));
    let name = format!("{}", tipo.name);
    let kdln = None;
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
    let tipo = Box::new(Term::Typ {
        orig: Span::Generated,
    });
    let rules = vec![];
    let entr = Entry {
        name: Ident(name),
        orig: Span::Generated,
        kdln,
        args,
        tipo,
        rules,
    };
    Derived {
        path: Ident(path),
        entr,
    }
}

pub fn derive_ctr(tipo: &NewType, index: usize) -> Derived {
    if let Some(ctr) = tipo.ctrs.get(index) {
        let path = format!("{}/{}.kind2", tipo.name.0.replace('.', "/"), ctr.name);
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
        };
        Derived {
            path: Ident(path),
            entr,
        }
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

    let path = format!("{}/match.kind2", ntyp.name.0.replace('.', "/"));

    fn gen_type_ctr(ntyp: &NewType) -> Box<Term> {
        Box::new(Term::Ctr {
            orig: Span::Generated,
            name: ntyp.name.clone(),
            args: ntyp
                .pars
                .iter()
                .map(|x| {
                    Box::new(Term::Var {
                        orig: Span::Generated,
                        name: x.name.clone(),
                    })
                })
                .collect(),
        })
    }

    fn gen_ctr_value(ntyp: &NewType, ctr: &Constructor, _: usize, suffix: &str) -> Box<Term> {
        let mut ctr_value_args = vec![];
        for par in &ntyp.pars {
            ctr_value_args.push(Box::new(Term::Var {
                orig: Span::Generated,
                name: Ident(format!("{}{}", par.name, suffix)),
            }));
        }
        for fld in &ctr.args {
            ctr_value_args.push(Box::new(Term::Var {
                orig: Span::Generated,
                name: Ident(format!("{}{}", fld.name, suffix)),
            }));
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
        args.push(Box::new(Argument {
            hide: true,
            orig: Span::Generated,
            eras: true,
            name: par.name.clone(),
            tipo: par.tipo.clone(),
        }));
    }

    // (x: (List t))
    args.push(Box::new(Argument {
        eras: false,
        orig: Span::Generated,
        hide: false,
        name: Ident("x".to_string()),
        tipo: gen_type_ctr(ntyp),
    }));

    // -(p: (List t) -> Type)
    args.push(Box::new(Argument {
        eras: true,
        orig: Span::Generated,
        hide: false,
        name: Ident("p".to_string()),
        tipo: Box::new(Term::All {
            orig: Span::Generated,
            name: Ident("x".to_string()),
            tipo: gen_type_ctr(ntyp),
            body: Box::new(Term::Typ {
                orig: Span::Generated,
            }),
        }),
    }));

    // (nil: (p (List.nil t)))
    // (cons: (head t) (tail: (List t)) (p (List.cons t head tail)))
    for ctr in &ntyp.ctrs {
        fn ctr_case_type(ntyp: &NewType, ctr: &Constructor, index: usize) -> Box<Term> {
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
    };

    Derived {
        path: Ident(path),
        entr,
    }
}

pub fn parse_newtype(state: parser::State) -> parser::Answer<Box<NewType>> {
    let (state, _) = parser::consume("type", state)?;
    let (state, name) = parser::name1(state)?;
    let (state, pars) = parser::until(parser::text_parser("{"), Box::new(parse_argument), state)?;
    let mut ctrs = vec![];
    let mut state = state;
    loop {
        let state_i = state;
        let (state_i, ctr_name) = parser::name(state_i)?;
        if ctr_name.is_empty() {
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
        ctrs.push(Box::new(Constructor {
            name: Ident(ctr_name),
            args: ctr_args,
        }));
        state = state_i;
    }
    Ok((
        state,
        Box::new(NewType {
            name: Ident(name),
            pars,
            ctrs,
        }),
    ))
}

pub fn read_newtype(code: &str) -> Result<Box<NewType>, String> {
    parser::read(Box::new(parse_newtype), code)
}
