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

pub fn term_to_lambda(term : &Term, defs : &Defs, scope : &mut Vec<Vec<u8>>, name_count : &mut u32, copy_count : &mut u32) -> sic::term::Term {
    pub fn make_id(name_count : &mut u32) -> sic::term::Term {
        *name_count += 1;
        let nam = sic::term::new_name(*name_count);
        let bod = Box::new(sic::term::Term::Var{nam: nam.clone()});
        sic::term::Term::Lam{nam, bod}
    }
    pub fn gen_name(name_count : &mut u32) -> Vec<u8> {
        *name_count += 1;
        sic::term::new_name(*name_count)
    }
    pub fn build(term : &Term, rec : &mut (Vec<u8>, Vec<u8>), defs : &Defs, scope : &mut Vec<Vec<u8>>, name_count : &mut u32, copy_count : &mut u32) -> sic::term::Term {
        match term {
            All{nam: _, typ: _, bod: _} => {
                // TODO: implement properly
                make_id(name_count)
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
            Idt{nam: _, typ: _, ctr: _} => {
                // TODO: implement properly
                make_id(name_count)
            },
            Ctr{nam, idt} => {
                let mut tmp_idt : Term = *idt.clone();
                weak_reduce(&mut tmp_idt, defs, true);
                match tmp_idt {
                    Idt{nam: _, typ: _, ctr} => {
                        let len = ctr.len() as u32;
                        let mut idx = 0;
                        let mut fds = 0;
                        for i in 0..len {
                            if ctr[i as usize].0 == *nam {
                                idx = i;
                                fds = get_nams_typs_bod(&ctr[i as usize].1).0.len() as u32;
                            }
                        }
                        *name_count += 1;
                        let mut res = sic::term::Term::Var{nam: sic::term::new_name((*name_count + fds + idx) as u32)};
                        for i in 0..fds {
                            let fun = Box::new(res);
                            let arg = Box::new(sic::term::Term::Var{nam: sic::term::new_name(*name_count + i)});
                            res = sic::term::Term::App{fun, arg};
                        }
                        for i in 0..(len + fds) {
                            let nam = sic::term::new_name(*name_count + (len + fds - i - 1));
                            let bod = Box::new(res);
                            res = sic::term::Term::Lam{nam, bod}
                        }
                        *name_count += ctr.len() as u32 + fds;
                        res
                    },
                    _ => panic!("Not implemented.")
                }
            },
            Cas{val: _, cas: _, ret: _} => {
                panic!("Not implemented.")
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

                let tag = *copy_count + 2;
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
                            let tag = *copy_count + 2;
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
                        let typ = *ctx[i].clone();
                        return (val, typ);
                    }
                }
                panic!("Not implemented.");
            },
            _ => panic!("Not implemented.")
        }
    }
    match term {
        sic::term::Term::Lam{nam: term_nam, bod: term_bod} => {
            let mut new_typ = typ.clone();
            weak_reduce(&mut new_typ, defs, true);
            match new_typ {
                All{nam, typ, bod} => {
                    extend_context(typ.clone(), ctx);
                    vars.push(term_nam.clone());
                    let nam = nam.to_vec();
                    let typ = typ.clone();
                    let bod = Box::new(term_from_lambda(term_bod, &bod, defs, vars, ctx));
                    narrow_context(ctx);
                    vars.pop();
                    Lam{nam, typ, bod}
                },
                Idt{nam: _, typ: _, ctr} => {
                    let mut val : &sic::term::Term = term;
                    let mut cid : usize = 0;
                    let mut nams : Vec<Vec<u8>> = Vec::new();
                    let mut args : Vec<sic::term::Term> = Vec::new();
                    loop {
                        val = match val {
                            sic::term::Term::Lam{ref nam, ref bod} => {
                                nams.push(nam.to_vec());
                                bod
                            },
                            sic::term::Term::App{ref fun, ref arg} => {
                                args.push(*arg.clone());
                                fun
                            },
                            sic::term::Term::Var{ref nam} => {
                                for i in 0..nams.len() {
                                    if nams[i] == *nam {
                                        cid = i;
                                    }
                                }
                                &sic::term::Term::Set
                            },
                            _ => break
                        }
                    }
                    let (ref ctr_nam, ref ctr_typ) = ctr[cid];
                    let mut new_ctr_typ = ctr_typ.clone();
                    subs(&mut new_ctr_typ, &typ, 0);
                    let (_, arg_typs, _) = get_nams_typs_bod(&new_ctr_typ);
                    let mut res = Ctr{nam: ctr_nam.to_vec(), idt: Box::new(typ.clone())};
                    for i in (0..args.len()).rev() {
                        let fun = Box::new(res.clone());
                        let arg = Box::new(term_from_lambda(&args[i], &arg_typs[args.len() - i - 1], defs, vars, ctx));
                        res = App{fun, arg}
                    }
                    res
                },
                t => panic!("Not implemented. {}", t)
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
    let lambda_nf = sic::extra::lambda_term_from_net(&net); // TODO: correctly read-back lets (i.e., use sic::term::from_net)
    let term_nf = term_from_lambda(&lambda_nf, &term_type, defs, &mut Vec::new(), &mut Vec::new());
    (stats, term_nf)
}
