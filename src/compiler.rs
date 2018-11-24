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
                // Checks if this pattern match folds.
                let mut folds = false;
                for (_, cas_typ, cas_bod) in cas {
                    folds = folds || uses(cas_bod, cas_typ.len() as i32) > 0;
                }

                // Allocates names for fold variables.
                let fold_a = if folds { gen_name(name_count) } else { Vec::new() };
                let fold_b = if folds { gen_name(name_count) } else { Vec::new() };

                // Builds the matching function body on SIC. For example:
                // - This:    (case v | A  (x,  y) =>  P(x, fold(y))  | B => Q)
                // - Becomes:      (v (λx. λy. λF.    (P x  (F   y))) (λF.   Q))
                // Note that, if folds, each case includes a local fold argument `F`.

                // Inits the matching function body as just the matched variable.
                let var = gen_name(name_count);
                let mut fun_bod = sic::term::Term::Var{nam: var.clone()};

                // Then, for each case of the pattern match...
                for (_cas_nam, cas_args, cas_bod) in cas {
                    // Generates names for the local fold and each field, and extends the scope.
                    let mut nams = Vec::new();
                    let fold_nam = gen_name(name_count);
                    scope.push(fold_nam.clone());
                    for _ in 0..cas_args.len() {
                        let field_nam = gen_name(name_count);
                        scope.push(field_nam.clone());
                        nams.push(field_nam);
                    }
                    if folds { nams.push(fold_nam.clone()); }

                    // Builds the case body on SIC.
                    let cas_bod = build(cas_bod, rec, defs, scope, name_count, copy_count);

                    // Narrows the scope back.
                    scope.pop();
                    for _ in 0..cas_args.len() {
                        scope.pop();
                    }

                    // Builds the case function on SIC by closing the body with generated names.
                    let mut cas_fun = cas_bod;
                    for i in 0..nams.len() {
                        cas_fun = sic::term::Term::Lam{nam: nams[nams.len() - i - 1].clone(), bod: Box::new(cas_fun)}
                    }

                    // Extends the matching function body by applying it to this new case function.
                    fun_bod = sic::term::Term::App{fun: Box::new(fun_bod), arg: Box::new(cas_fun)};
                }

                // Builds the matching function on SIC. It takes the matching function body and
                // closes over the matched variable, turning the body into a lambda. Then, if it
                // folds, it turns it recursive by applying it to a copy o itself.
                let fun = if folds {
                    sic::term::Term::Let{
                        tag: *copy_count + 10,
                        fst: fold_a.clone(),
                        snd: fold_b.clone(),
                        val: Box::new(sic::term::Term::Lam{
                            nam: var,
                            bod: Box::new(sic::term::Term::App{
                                fun: Box::new(fun_bod),
                                arg: Box::new(sic::term::Term::Var{nam: fold_a})
                            })
                        }),
                        nxt: Box::new(sic::term::Term::Var{nam: fold_b.clone()})
                    }
                } else {
                    sic::term::Term::Lam{
                        nam: var,
                        bod: Box::new(fun_bod)
                    }
                };

                // Builds the matched value on SIC.
                let val = build(val, rec, defs, scope, name_count, copy_count);

                // The result is an application of the folding function to the matched value.
                let res = sic::term::Term::App{
                    fun: Box::new(fun),
                    arg: Box::new(val)
                };

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
            _ => panic!("Not implemented. {}", term)
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
    let mut net = sic::term::to_net(&lambda);
    let stats = sic::net::reduce(&mut net);
    let lambda_nf = sic::term::from_net(&net);
    (stats, lambda_nf)
}
