// >> THIS FILE IS A PROTOTYPE <<
// This was built in a hurry to have some benchmarks for Devcon 4. It is not in a great shape.
// Currently only lambdas, applications and non-polymorphic datatypes are supported. It supports
// recursive definitions, even though those aren't typeable in Formality.

extern crate sic;

use term::*;
use term::Vars;
use term::Defs;
use term::Term::*;
use term::Context;

fn enclose_term(term: &Term, vars: &Vars) -> Term{
    let mut new_term = term.clone();
    for i in (0..vars.len()).rev(){
        let nam = vars[i].clone();
        let typ = Box::new(Set); // no need to extract correct types as they are thrown out
        new_term = Lam{nam, typ, bod: Box::new(new_term)};
    }
    new_term
}

pub fn term_to_lambda(term : &Term, defs : &Defs, scope : &mut Vec<Vec<u8>>, name_count : &mut u32, copy_count : &mut u32) -> sic::term::Term {
    pub fn gen_name(name_count : &mut u32) -> Vec<u8> {
        *name_count += 1;
        sic::term::new_name(*name_count)
    }
    pub fn build(term : &Term, rec : &mut (Vec<u8>, Vec<u8>), defs : &Defs, scope : &mut Vec<Vec<u8>>, name_count : &mut u32, copy_count : &mut u32) -> sic::term::Term {
        match term {
            All{nam: _, typ: _, bod: _} => {
                // TODO: implement properly
                sic::term::Term::Set
            },
            Lam{nam: _, typ: _, bod} => {
                let nam = gen_name(name_count);
                scope.push(nam.clone());
                let bod = Box::new(build(bod, rec, defs, scope, name_count, copy_count));
                scope.pop();
                sic::term::Term::Lam{nam, bod}
            },
            Var{idx} => {
                sic::term::Term::Var{nam: scope[scope.len() - (*idx as usize) - 1].clone()}
            },
            App{fun, arg} => {
                let fun = Box::new(build(fun, rec, defs, scope, name_count, copy_count));
                let arg = Box::new(build(arg, rec, defs, scope, name_count, copy_count));
                sic::term::Term::App{fun, arg}
            },
            Idt{nam: _, arg: _, par: _, typ: _, ctr: _} => {
                // TODO: implement properly
                sic::term::Term::Set
            },
            New{idt: _, ctr, bod} => {
                let mut nams = Vec::new();

                for _ in 0..ctr.len() {
                    let nam = gen_name(name_count);
                    scope.push(nam.clone());
                    nams.push(nam);
                }

                let mut res = build(bod, rec, defs, scope, name_count, copy_count);

                for _ in 0..ctr.len() {
                    scope.pop();
                }

                for i in (0..ctr.len()).rev() {
                    res = sic::term::Term::Lam{nam: nams[i].clone(), bod: Box::new(res)};
                }

                res
            },
            Cas{val, cas, ret: _} => {
                let len: usize = scope.len();

                let fold_a = gen_name(name_count);
                scope.push(fold_a.clone());
                let fold_b = gen_name(name_count);
                scope.push(fold_b.clone());
                let mut val = val.clone();
                shift(&mut val, 2, 0); // shifts to avoid fold_a and fold_b

                let mut term: Term = Var{ idx: 0 };
                for (_cas_nam, cas_args, cas_bod) in cas{
                    let mut bod = enclose_term(&cas_bod, cas_args);
                    shift(&mut bod, 1, 0); // shifts the fold variable so it doesn't get caught
                    term = App{ fun:Box::new(term), arg: Box::new(bod) };
                }
                term = Lam{ nam: vec![], typ: Box::new(Set), bod: Box::new(term) }; //names and types do not matter
                shift(&mut term, 1, 1); // shifts to avoid fold_a

                let sic_let = build(&term, rec, defs, scope, name_count, copy_count);
                let sic_app = sic::term::Term::App{
                    fun: Box::new(sic::term::Term::Var{nam: fold_a.clone()}),
                    arg: Box::new(build(&val, rec, defs, scope, name_count, copy_count))
                };

                *copy_count += 1;
                let res = sic::term::Term::Let{
                    tag: *copy_count+10,
                    fst: fold_a,
                    snd: fold_b,
                    val: Box::new(sic_let),
                    nxt: Box::new(sic_app)
                };
                scope.drain(len..len+2);
                res
            },

            Cpy{nam: _, val, bod} => {
                let val = Box::new(build(val, rec, defs, scope, name_count, copy_count));

                let nam_a = gen_name(name_count);
                scope.push(nam_a.clone());

                let nam_b = gen_name(name_count);
                scope.push(nam_b.clone());

                let bod = Box::new(build(bod, rec, defs, scope, name_count, copy_count));

                scope.pop();

                scope.pop();

                *copy_count += 1;

                let tag = *copy_count + 10;
                let fst = nam_a;
                let snd = nam_b;
                let val = val;
                let nxt = bod;
                sic::term::Term::Let{tag, fst, snd, val, nxt}
            },
            Ref{nam} => {
                if *nam == rec.0 {
                    let nam = rec.1.clone();
                    rec.1 = b"".to_vec();
                    sic::term::Term::Var{nam}
                } else {
                    match defs.get(nam) {
                        Some(term) => {
                            *copy_count += 1;

                            let mut nam_a = nam.clone();
                            nam_a.extend_from_slice(b"$a$");
                            nam_a.append(&mut copy_count.to_string().into_bytes());

                            let mut nam_b = nam.clone();
                            nam_b.extend_from_slice(b"$b$");
                            nam_b.append(&mut copy_count.to_string().into_bytes());

                            let mut rec = (nam.to_vec(), nam_b.clone());
                            let tag = *copy_count + 10;
                            let fst = nam_a.clone();
                            let snd = nam_b.clone();
                            let ter = build(&term, &mut rec, defs, scope, name_count, copy_count);
                            if rec.1 == b"" {
                                let val = Box::new(ter);
                                let nxt = Box::new(sic::term::Term::Var{nam: nam_a});
                                sic::term::Term::Let{tag, fst, snd, val, nxt}
                            } else {
                                ter
                            }
                        },
                        None => panic!("Undefined variable.")
                    }
                }
            },
            Set => {
                panic!("Not implemented.")
            }
        }
    }
    build(term, &mut (b"".to_vec(), b"".to_vec()), defs, scope, name_count, copy_count)
}

pub fn term_from_lambda(term : &sic::term::Term, typ : &Term, defs : &Defs, vars : &mut Vars, ctx : &mut Context) -> Term {
    pub fn infer(term : &sic::term::Term, defs : &Defs, vars : &mut Vars, ctx : &mut Context) -> (Term, Term) {
        match term {
            sic::term::Term::Lam{nam: _, bod: _} => {
                panic!("Not implemented.")
            },
            sic::term::Term::App{fun, arg} => {
                let (fun_v, fun_t) = infer(fun, defs, vars, ctx);
                match fun_t {
                    All{nam: _, typ, bod} => {
                        let fun = Box::new(fun_v);
                        let arg = Box::new(term_from_lambda(arg, &typ, defs, vars, ctx));
                        let mut bod = bod.clone();
                        subs(&mut bod, &arg, 0);
                        (App{fun, arg}, *bod)
                    },
                    t => panic!("Not implemented. {}", t)
                }
            },
            sic::term::Term::Var{nam} => {
                for i in (0..vars.len()).rev() {
                    if *nam == vars[i] {
                        let val = Var{idx: (vars.len() - i - 1) as i32};
                        let typ = ctx[i].clone();
                        return (val, typ);
                    }
                }
                panic!("Not implemented.");
            },
            sic::term::Term::Set => {
                (Set, Set)
            },
            _ => panic!("Not implemented.")
        }
    }
    match term {
        sic::term::Term::Lam{nam: term_nam, bod: term_bod} => {
            let typ = weak_reduced(&typ, defs, true);
            match &typ {
                All{nam, typ, bod} => {
                    let nam = nam.to_vec();
                    let typ = typ.clone();
                    extend_context(&shifted(&typ,1,0), ctx);
                    vars.push(term_nam.clone());
                    let bod = Box::new(term_from_lambda(term_bod, &bod, defs, vars, ctx));
                    narrow_context(ctx);
                    vars.pop();
                    Lam{nam, typ, bod}
                },
                Idt{nam: _, arg: _, par: _, typ: _, ctr} => {
                    // Extends the context with IDT's constructor types
                    for i in 0..ctr.len() {
                        let ctr_typ = &apply_idt_args(&typ).1[i].1;
                        extend_context(&shifted(&ctr_typ, ctr.len() as i32, 0), ctx);
                    }

                    // Extracts the body of the Scott-encoded SIC term, appending var names
                    let mut bod = term;
                    for _ in 0..ctr.len() {
                        bod = match bod {
                            sic::term::Term::Lam{ref nam, ref bod} => {
                                vars.push(nam.clone());
                                bod
                            },
                            _ => panic!("Attempted to read wrongly shaped SIC term. This is probably a Formality bug.")
                        }
                    }

                    // Converts body of the Scott-encoded SIC term to Formality
                    let (res, _) = infer(bod, defs, vars, ctx);

                    // Narrows the context and clears var names
                    for _ in 0..ctr.len() {
                        vars.pop();
                        narrow_context(ctx);
                    }

                    // Completes the Formality instantiator term
                    New {
                        idt: Box::new(typ.clone()),
                        ctr: ctr.iter().map(|c| c.0.clone()).collect(),
                        bod: Box::new(res)
                    }
                },
                t => panic!("Not implemented. {} : {}", term, t)
            }
        },
        term => {
            infer(term, defs, vars, ctx).0
        }
    }
}

pub fn eval(term : &Term, defs : &Defs) -> (sic::net::Stats, Term) {
    let term_type = infer(&term, &defs, true).unwrap();
    let lambda = term_to_lambda(&term, &defs, &mut Vec::new(), &mut 0, &mut 0);
    let mut net = sic::term::to_net(&lambda);
    let stats = sic::net::reduce(&mut net);
    let lambda_nf = sic::term::from_net(&net); // TODO: correctly read-back lets (i.e., use sic::term::from_net)
    let term_nf = term_from_lambda(&lambda_nf, &term_type, defs, &mut Vec::new(), &mut Vec::new());
    (stats, term_nf)
}

pub fn partial_eval(term : &Term, defs : &Defs) -> (sic::net::Stats, sic::term::Term) {
    let lambda = term_to_lambda(&term, &defs, &mut Vec::new(), &mut 0, &mut 0);
    println!("The lambda term, not reduced, is:\n{}\nThe reduced term is:",lambda);
    let mut net = sic::term::to_net(&lambda);
    let stats = sic::net::reduce(&mut net);
    let lambda_nf = sic::term::from_net(&net);
    (stats, lambda_nf)
}
