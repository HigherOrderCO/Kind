use std;
use std::collections::*;

#[derive(Clone, PartialEq, PartialOrd, Eq, Ord, Debug, Hash)]
pub enum Term {
    // Forall
    All {
        nam: Vec<u8>,
        typ: Box<Term>,
        bod: Box<Term>
    },
    // Lambda
    Lam {
        nam: Vec<u8>,
        typ: Box<Term>,
        bod: Box<Term>
    },
    // Variable
    Var {
        idx: i32
    },
    // Application
    App {
        fun: Box<Term>,
        arg: Box<Term>
    },
    // Inductive Data Type
    Idt {
        nam: Vec<u8>,
        typ: Box<Term>,
        ctr: Vec<(Vec<u8>, Box<Term>)>
    },
    // Constructor
    Ctr {
        nam: Vec<u8>,
        idt: Box<Term>
    },
    // Pattern-Matching
    Cas {
        val: Box<Term>,
        cas: Vec<(Vec<u8>, Vars, Box<Term>)>,
        ret: (Vars, Box<Term>)
    },
    // Reference
    Ref {
        nam: Vec<u8>
    },
    // Copy
    Cpy {
        nam: (Vec<u8>, Vec<u8>),
        val: Box<Term>,
        bod: Box<Term>
    },
    // Type of Types
    Set
}
use self::Term::{*};

pub type Vars = Vec<Vec<u8>>;
pub type Defs = HashMap<Vec<u8>, Term>;

#[derive(Clone, PartialEq, PartialOrd, Eq, Ord, Debug, Hash)]
pub enum TypeError {
    AppTypeMismatch {
        expect: Term,
        actual: Term,
        argval: Term,
        term: Term,
        vars: Vars
    },
    AppNotAll {
        funval: Term,
        funtyp: Term,
        term: Term,
        vars: Vars
    },
    ForallNotAType {
        typtyp: Term,
        bodtyp: Term,
        term: Term,
        vars: Vars
    },
    Unbound {
        name: Vec<u8>,
        vars: Vars
    },
    CtrNotIDT {
        actual: Term,
        term: Term,
        vars: Vars
    },
    CtrNotFound {
        name: Vec<u8>,
        term: Term,
        vars: Vars
    },
    MatchNotIDT {
        actual: Term,
        term: Term,
        vars: Vars
    },
    WrongMatchIndexCount {
        expect: usize,
        actual: usize,
        term: Term,
        vars: Vars
    },
    WrongMatchReturnArity {
        expect: usize,
        actual: usize,
        term: Term,
        vars: Vars
    },
    WrongMatchCaseCount {
        expect: usize,
        actual: usize,
        term: Term,
        vars: Vars
    },
    WrongCaseName {
        expect: Vec<u8>,
        actual: Vec<u8>,
        term: Term,
        vars: Vars
    },
    WrongCaseArity {
        expect: usize,
        actual: usize,
        name: Vec<u8>,
        term: Term,
        vars: Vars
    },
    WrongCaseType {
        expect: Term,
        actual: Term,
        name: Vec<u8>,
        term: Term,
        vars: Vars
    },
}
use self::TypeError::{*};

// Adds an unique name to a Vars vector, properly renaming if shadowed.
pub fn rename(nam : &Vec<u8>, vars : &Vars) -> Vec<u8> {
    let mut new_nam = nam.clone();
    if new_nam.len() > 0 {
        for var_nam in vars.iter() {
            if var_nam == nam {
                new_nam.extend_from_slice(b"'");
            }
        }
    }
    new_nam
}

// Increases the index of all free variables of a term, assuming `cut` enclosing lambdas, by `inc`.
pub fn shift(term : &mut Term, inc : i32, cut : i32) {
    match term {
        &mut App{ref mut fun, ref mut arg} => {
            shift(fun, inc, cut);
            shift(arg, inc, cut);
        },
        &mut Lam{nam: _, ref mut typ, ref mut bod} => {
            shift(typ, inc, cut + 1);
            shift(bod, inc, cut + 1);
        },
        &mut All{nam: _, ref mut typ, ref mut bod} => {
            shift(typ, inc, cut + 1);
            shift(bod, inc, cut + 1);
        },
        &mut Var{ref mut idx} => {
            *idx = if *idx < cut { *idx } else { *idx + inc };
        },
        &mut Ref{nam: _} => {},
        &mut Idt{nam: _, ref mut typ, ref mut ctr} => {
            shift(typ, inc, cut);
            for (_,ctr_typ) in ctr {
                shift(ctr_typ, inc, cut+1);
            }
        },
        &mut Ctr{nam: _, ref mut idt} => {
            shift(idt, inc, cut);
        },
        &mut Cas{ref mut val, ref mut ret, ref mut cas} => {
            shift(val, inc, cut);
            shift(&mut ret.1, inc, cut + 1 + ret.0.len() as i32);
            for (_, cas_arg, cas_bod) in cas {
                shift(cas_bod, inc, cut + 1 + cas_arg.len() as i32);
            }
        },
        &mut Cpy{nam: _, ref mut val, ref mut bod} => {
            shift(val, inc, cut);
            shift(bod, inc, cut + 2);
        },
        &mut Set => {}
    }
}

// Substitutes the variable at given depth in term by value.
pub fn subs(term : &mut Term, value : &Term, dph : i32) {
    let mut new_term : Option<Term> = None;
    match term {
        &mut App{ref mut fun, ref mut arg} => {
            subs(fun, value, dph);
            subs(arg, value, dph);
        },
        &mut Lam{nam: ref mut _nam, ref mut typ, ref mut bod} => {
            subs(typ, value, dph+1);
            subs(bod, value, dph+1);
        },
        &mut All{nam: ref mut _nam, ref mut typ, ref mut bod} => {
            subs(typ, value, dph+1);
            subs(bod, value, dph+1);
        },
        &mut Var{idx} => {
            if dph == idx {
                let mut val = value.clone();
                shift(&mut val, dph as i32, 0);
                new_term = Some(val);
            } else if dph < idx {
                new_term = Some(Var{idx: idx - 1})
            }
        },
        &mut Ref{nam: _} => {},
        &mut Idt{nam: ref mut _nam, ref mut typ, ref mut ctr} => {
            subs(typ, value, dph);
            for (_,ctr_typ) in ctr {
                subs(ctr_typ, value, dph+1);
            }
        },
        &mut Ctr{nam: _, ref mut idt} => {
            subs(idt, value, dph);
        },
        &mut Cas{ref mut val, ref mut ret, ref mut cas} => {
            subs(val, value, dph);
            subs(&mut ret.1, value, dph + 1 + ret.0.len() as i32);
            for (_, cas_arg, cas_bod) in cas {
                subs(cas_bod, value, dph + 1 + cas_arg.len() as i32);
            }
        },
        &mut Cpy{nam: _, ref mut val, ref mut bod} => {
            subs(val, value, dph);
            subs(bod, value, dph + 2);
        },
        _ => {}
    };
    // Because couldn't modify Var inside its own case
    match new_term {
        Some(new_term) => *term = new_term,
        None => {}
    };
}

// Extracts the function and a list of arguments from a curried f(x, y, z) expression.
pub fn get_fun_args(term : &Term) -> (&Term, Vec<&Term>) {
    let mut term : &Term = term;
    let mut args : Vec<&Term> = Vec::new();
    loop {
        match term {
            App{ref fun, ref arg} => {
                args.push(arg);
                term = fun;
            },
            _ => break
        }
    }
    args.reverse();
    (term, args)
}

// Extracts the names, types and body from a curried `(x : A) => (y : B) => c` expression.
pub fn get_nams_typs_bod(term : &Term) -> (Vec<&Vec<u8>>, Vec<&Term>, &Term) {
    let mut term : &Term = term;
    let mut nams : Vec<&Vec<u8>> = Vec::new();
    let mut typs : Vec<&Term> = Vec::new();
    loop {
        match term {
            Lam{ref nam, ref typ, ref bod} => {
                nams.push(nam);
                typs.push(typ);
                term = bod;
            },
            All{ref nam, ref typ, ref bod} => {
                nams.push(nam);
                typs.push(typ);
                term = bod;
            },
            _ => break
        }
    }
    (nams, typs, term)
}

// Reduces an expression if it is a redex, returns true if was.
pub fn redex(term : &mut Term, defs : &Defs, deref : bool) -> bool {
    let mut changed = false;
    let tmp_term = std::mem::replace(term, Set);
    let new_term : Term = match tmp_term {
        App{mut fun, mut arg} => {
            let tmp_fun : Term = *fun;
            match tmp_fun {
                Lam{nam: _, typ: _, mut bod} => {
                    subs(&mut bod, &arg, 0);
                    changed = true;
                    *bod
                },
                t => {
                    App{fun: Box::new(t), arg}
                }
            }
        },
        Cas{mut val, mut ret, mut cas} => {
            let (ctr, args) = get_fun_args(&val);
            match ctr {
                Ctr{nam, idt: _} => {
                    changed = true;
                    // Creates the folding function
                    let mut new_ret = ret.clone();
                    let mut new_cas = cas.clone();
                    shift(&mut new_ret.1, 1, 1 + new_ret.0.len() as i32);
                    for (_, ref mut new_cas_arg, ref mut new_cas_bod) in &mut new_cas {
                        shift(new_cas_bod, 1, 1 + new_cas_arg.len() as i32);
                    }
                    let mut fold_fun = Lam{
                        nam: b"X".to_vec(),
                        typ: Box::new(Set),
                        bod: Box::new(Cas{
                            val: Box::new(Var{idx: 0}),
                            ret: new_ret,
                            cas: new_cas
                        })
                    };
                    // Finds matching constructor and substitutes
                    let mut bod : Term = Set;
                    for i in 0..cas.len() {
                        let cas_nam = &cas[i].0;
                        let cas_bod = &cas[i].2;
                        if cas_nam == nam {
                            bod = *cas_bod.clone();
                        }
                    }
                    subs(&mut bod, &fold_fun, args.len() as i32);
                    for i in 0..args.len() {
                        subs(&mut bod, &args[i], (args.len() - i - 1) as i32);
                    }

                    bod
                },
                _ => {
                    Cas{val: val.clone(), ret, cas} // TODO: how to avoid this clone?
                }
            }
        },
        Cpy{nam: _, mut val, mut bod} => {
            subs(&mut bod, &val, 0);
            subs(&mut bod, &val, 0);
            changed = true;
            *bod
        },
        Ref{nam} => {
            if deref {
                match defs.get(&nam) {
                    Some(val) => {
                        changed = true;
                        val.clone()
                    },
                    None => {
                        panic!(format!("Unbound variable: {}.", String::from_utf8_lossy(&nam)))
                    }
                }
            } else {
                Ref{nam}
            }
        },
        t => t
    };
    std::mem::replace(term, new_term);
    changed
}

// Performs a global parallel reduction step.
pub fn global_reduce_step(term : &mut Term, defs : &Defs, deref : bool) -> bool {
    let changed_below = match term {
        App{ref mut fun, ref mut arg} => {
            let fun = global_reduce_step(fun, defs, deref);
            let arg = global_reduce_step(arg, defs, deref);
            fun || arg
        },
        Lam{nam: _, ref mut typ, ref mut bod} => {
            let typ = global_reduce_step(typ, defs, deref);
            let bod = global_reduce_step(bod, defs, deref);
            typ || bod
        },
        All{nam: _, ref mut typ, ref mut bod} => {
            let typ = global_reduce_step(typ, defs, deref);
            let bod = global_reduce_step(bod, defs, deref);
            typ || bod
        },
        Idt{nam: _, ref mut typ, ref mut ctr} => {
            let mut changed_ctr = false;
            for i in 0..ctr.len() {
                changed_ctr = changed_ctr || global_reduce_step(&mut ctr[i].1, defs, deref);
            }
            let typ = global_reduce_step(typ, defs, deref);
            changed_ctr || typ
        },
        Ctr{nam: _, ref mut idt} => {
            global_reduce_step(idt, defs, deref)
        },
        Cas{ref mut val, ref mut ret, ref mut cas} => {
            let mut changed_cas = false;
            for i in 0..cas.len() {
                let cas_ret = &mut cas[i].2;
                changed_cas = changed_cas || global_reduce_step(cas_ret, defs, deref);
            }
            let val = global_reduce_step(val, defs, deref);
            let ret = global_reduce_step(&mut ret.1, defs, deref);
            changed_cas || val || ret
        },
        Cpy{nam: _, ref mut val, ref mut bod} => {
            global_reduce_step(val, defs, deref) ||
            global_reduce_step(bod, defs, deref)
        },
        _ => false
    };
    let changed_self = redex(term, defs, deref);
    changed_below || changed_self
}

// Performs a global parallel weak reduction step.
pub fn weak_global_reduce_step(term : &mut Term, defs : &Defs, deref : bool) -> bool {
    let changed_below = match term {
        App{ref mut fun, arg: _} => {
            weak_global_reduce_step(fun, defs, deref)
        },
        Cas{ref mut val, ret: _, cas: _} => {
            weak_global_reduce_step(val, defs, deref)
        },
        _ => false
    };
    let changed_self = redex(term, defs, deref);
    changed_below || changed_self
}

// Reduces a term to weak head normal form.
pub fn weak_reduce(term : &mut Term, defs : &Defs, deref : bool) -> bool {
    let mut changed = false;
    while weak_global_reduce_step(term, defs, deref) {
        changed = true;
    }
    changed
}

// Reduces a term to normal form.
pub fn reduce(term : &mut Term, defs : &Defs, deref : bool) -> bool {
    let mut changed = false;
    loop {
        // Reduces as much as possible without ref expansions
        while global_reduce_step(term, defs, false) {
            changed = true;
        }
        // Reduces once with ref expansion
        if deref && global_reduce_step(term, defs, true) {
            changed = true;
        // If nothing changed, halt
        } else {
            break;
        }
    }
    changed
}

// Performs an equality test.
pub fn equals(a : &Term, b : &Term) -> bool {
    // Check if the heads are equal.
    match (a, b) {
        (&App{fun: ref a_fun, arg: ref a_arg},
         &App{fun: ref b_fun, arg: ref b_arg}) => {
            equals(a_fun, b_fun) &&
            equals(a_arg, b_arg)
        },
        (&Lam{nam: _, typ: ref a_typ, bod: ref a_bod},
         &Lam{nam: _, typ: ref b_typ, bod: ref b_bod}) => {
            equals(a_typ, b_typ) &&
            equals(a_bod, b_bod)
        },
        (&All{nam: _, typ: ref a_typ, bod: ref a_bod},
         &All{nam: _, typ: ref b_typ, bod: ref b_bod}) => {
            equals(a_typ, b_typ) &&
            equals(a_bod, b_bod)
        },
        (&Var{idx: ref a_idx},
         &Var{idx: ref b_idx}) => {
            a_idx == b_idx
        },
        (&Ref{nam: ref a_nam},
         &Ref{nam: ref b_nam}) => {
            a_nam == b_nam
         },
        (&Idt{nam: _, typ: ref a_typ, ctr: ref a_ctr},
         &Idt{nam: _, typ: ref b_typ, ctr: ref b_ctr}) => {
            let mut eql_ctr = true;
            if a_ctr.len() != b_ctr.len() {
                return false;
            }
            for i in 0..a_ctr.len() {
                let (a_ctr_nam, a_ctr_typ) = a_ctr[i].clone();
                let (b_ctr_nam, b_ctr_typ) = b_ctr[i].clone();
                eql_ctr =
                    eql_ctr &&
                    a_ctr_nam == b_ctr_nam &&
                    equals(&a_ctr_typ, &b_ctr_typ);
            }
            equals(a_typ, b_typ) && eql_ctr
        },
        (&Ctr{nam: ref a_nam, idt: ref a_idt},
         &Ctr{nam: ref b_nam, idt: ref b_idt}) => {
            a_nam == b_nam && equals(a_idt, b_idt)
        },
        (&Cas{val: ref a_val, ret: ref a_ret, cas: ref a_cas},
         &Cas{val: ref b_val, ret: ref b_ret, cas: ref b_cas}) => {
            let mut eql_cas = true;
            for i in 0..a_cas.len() {
                let (_, _, ref a_cas_bod) = a_cas[i];
                let (_, _, ref b_cas_bod) = b_cas[i];
                eql_cas = eql_cas && equals(&a_cas_bod, &b_cas_bod);
            }
            eql_cas &&
            equals(a_val, b_val) &&
            equals(&a_ret.1, &b_ret.1)
        },
        (&Cpy{nam: _, val: ref a_val, bod: ref a_bod},
         &Cpy{nam: _, val: ref b_val, bod: ref b_bod}) => {
            equals(a_val, b_val) &&
            equals(a_bod, b_bod)
        },
        (Set, Set) => true,
        _ => false
    }
}

// Performs an equality test after normalization.
pub fn equals_reduced(a : &Term, b : &Term, defs : &Defs) -> bool {
    let mut a_nf = a.clone();
    let mut b_nf = b.clone();
    reduce(&mut a_nf, defs, true);
    reduce(&mut b_nf, defs, true);
    equals(&a_nf, &b_nf)
}

// A Context is a vector of type assignments.
pub type Context<'a> = Vec<Box<Term>>;

// Extends a context.
pub fn extend_context<'a>(val : Box<Term>, ctx : &'a mut Context<'a>) -> &'a mut Context<'a> {
    for i in 0..ctx.len() {
        shift(&mut ctx[i], 1, 0);
    }
    ctx.push(val);
    ctx
}

// Narrows a context.
pub fn narrow_context<'a>(ctx : &'a mut Context<'a>) -> &'a mut Context<'a> {
    ctx.pop();
    for i in 0..ctx.len() {
        shift(&mut ctx[i], -1, 0);
    }
    ctx
}

// Infers the type
pub fn do_infer<'a>(term : &Term, vars : &mut Vars, defs : &Defs, ctx : &mut Context, checked : bool) -> Result<Term, TypeError> {
    match term {
        App{fun, arg} => {
            let mut fun_t = do_infer(fun, vars, defs, ctx, checked)?;
            weak_reduce(&mut fun_t, defs, true);
            match fun_t {
                All{nam: _f_nam, typ: f_typ, bod: f_bod} => {
                    let mut arg_n = arg.clone();
                    if !checked {
                        let arg_t = do_infer(arg, vars, defs, ctx, checked)?;
                        let mut new_typ = f_typ.clone();
                        subs(&mut new_typ, &arg_n, 0);
                        if !equals_reduced(&new_typ, &arg_t, defs) {
                            return Err(AppTypeMismatch{
                                expect: arg_t.clone(), 
                                actual: *new_typ.clone(),
                                argval: *arg.clone(),
                                term: term.clone(),
                                vars: vars.clone()
                            });
                        }
                    }
                    let mut new_bod = f_bod.clone();
                    subs(&mut new_bod, &arg_n, 0);
                    Ok(*new_bod)
                },
                _ => {
                    Err(AppNotAll{
                        funval: *fun.clone(),
                        funtyp: fun_t.clone(),
                        term: term.clone(),
                        vars: vars.clone()
                    })
                }
            }
        },
        Lam{nam, typ, bod} => {
            let nam = rename(&nam, vars);
            let mut typ_n = typ.clone();
            vars.push(nam.to_vec());
            extend_context(typ_n.clone(), ctx);
            let bod_t = Box::new(do_infer(bod, vars, defs, ctx, checked)?);
            vars.pop();
            narrow_context(ctx);
            if !checked {
                let nam = nam.clone();
                let typ = typ.clone();
                let bod = bod_t.clone();
                do_infer(&All{nam,typ,bod}, vars, defs, ctx, checked)?;
            }
            Ok(All{nam: nam.clone(), typ: typ_n, bod: bod_t})
        },
        All{nam, typ, bod} => {
            if !checked {
                let nam = rename(&nam, vars);
                let mut typ_n = typ.clone();
                vars.push(nam.to_vec());
                extend_context(typ_n, ctx);
                let typ_t = Box::new(do_infer(typ, vars, defs, ctx, checked)?);
                let bod_t = Box::new(do_infer(bod, vars, defs, ctx, checked)?);
                if !equals_reduced(&typ_t, &Set, defs) || !equals_reduced(&bod_t, &Set, defs) {
                    return Err(ForallNotAType{
                        typtyp: *typ_t.clone(),
                        bodtyp: *bod_t.clone(),
                        term: term.clone(),
                        vars: vars.clone()
                    });
                }
                vars.pop();
                narrow_context(ctx);
            }
            Ok(Set)
        },
        Var{idx} => {
            Ok(*ctx[ctx.len() - (*idx as usize) - 1].clone())
        },
        Ref{nam} => {
            match defs.get(nam) {
                Some(val) => infer(val, &defs, true),
                None => Err(Unbound{name: nam.clone(), vars: vars.clone()})
            }
        },
        Idt{nam: _, typ, ctr: _} => {
            // TODO: IDT isn't checked
            let mut typ_v = typ.clone();
            Ok(*typ_v)
        },
        Ctr{nam, idt} => {
            let mut tmp_idt : Term = *idt.clone();
            weak_reduce(&mut tmp_idt, defs, true);
            match tmp_idt {
                Idt{nam:_, typ: _, ref ctr} => {
                    for i in 0..ctr.len() {
                        let ctr_nam = &ctr[i].0;
                        let ctr_typ = &ctr[i].1;
                        if ctr_nam == nam {
                            let mut res_typ = ctr_typ.clone();
                            subs(&mut res_typ, &idt.clone(), 0);
                            return Ok(*res_typ);
                        }
                    }
                    return Err(CtrNotFound{
                        name: nam.clone(),
                        term: term.clone(),
                        vars: vars.clone()
                    });
                },
                _ => {
                    Err(CtrNotIDT{
                        actual: *idt.clone(),
                        term: term.clone(),
                        vars: vars.clone()
                    })
                }
            }
        },
        Cas{val, ret, cas} => {
            // Gets datatype and applied indices
            let val_typ = do_infer(val, vars, defs, ctx, checked)?;
            let mut idt_fxs = get_fun_args(&val_typ);
            let mut idt = idt_fxs.0.clone();
            let mut idx = idt_fxs.1;
            weak_reduce(&mut idt, defs, true);

            // Gets datatype type and constructors
            let (typ, ctr) = (match &idt {
                Idt{nam:_, typ, ctr} => Ok((typ.clone(), ctr.clone())),
                _ => Err(MatchNotIDT{
                    actual: idt.clone(),
                    term: term.clone(),
                    vars: vars.clone()
                })
            })?;

            // Builds the match return type
            let mut ret_typ : Term = *ret.1.clone();
            subs(&mut ret_typ, &val, idx.len() as i32);
            for i in 0..idx.len() {
                subs(&mut ret_typ, &idx[i], (idx.len() - i - 1) as i32);
            }

            // Creates the fold type
            let mut fold_typ : Term = All{
                nam: b"X".to_vec(),
                typ: Box::new(val_typ.clone()),
                bod: Box::new(ret_typ.clone())
            };

            if !checked {
                let (_, expect_idx_typ, _) = get_nams_typs_bod(&typ); 

                // Checks if number of indices match
                if idx.len() != expect_idx_typ.len() {
                    return Err(WrongMatchIndexCount{
                        expect: expect_idx_typ.len(),
                        actual: idx.len(),
                        term: term.clone(),
                        vars: vars.clone()
                    });
                }

                // Check if return type has expected arity
                if ret.0.len() != idx.len() {
                    return Err(WrongMatchReturnArity{
                        expect: idx.len(),
                        actual: ret.0.len(),
                        term: term.clone(),
                        vars: vars.clone()
                    });
                }

                // Checks if number of cases matches number of constructors
                if cas.len() != ctr.len() {
                    return Err(WrongMatchCaseCount{
                        expect: ctr.len(),
                        actual: cas.len(),
                        term: term.clone(),
                        vars: vars.clone()
                    });
                } 

                // For each case of the pattern match
                for i in 0..cas.len() {
                    // Get its name, variables, body and type
                    let cas_nam = &cas[i].0;
                    let cas_arg = &cas[i].1;
                    let cas_bod = &cas[i].2;
                    let cas_typ = &ctr[i].1;

                    // Checks if case name matches the constructor's name
                    if cas_nam != &ctr[i].0 {
                        return Err(WrongCaseName{
                            expect: ctr[i].0.clone(),
                            actual: cas_nam.clone(),
                            term: term.clone(),
                            vars: vars.clone()
                        });
                    }

                    // Gets argument types and body type
                    let (_, cas_arg_typ, cas_bod_typ) = get_nams_typs_bod(cas_typ);

                    // Gets the datatype indices
                    let (_, cas_idx) = get_fun_args(cas_bod_typ);

                    // Checks if case field count matches constructor field count
                    if cas_arg_typ.len() != cas_arg.len() {
                        return Err(WrongCaseArity{
                            expect: cas_arg_typ.len(),
                            actual: cas_arg.len(),
                            name: cas_nam.clone(),
                            term: term.clone(),
                            vars: vars.clone()
                        });
                    }

                    // Initializes the witness
                    let mut wit = Ctr{
                        nam: cas_nam.to_vec(),
                        idt: Box::new(idt.clone())
                    };

                    // Initializes the expected case return type
                    let mut expect_cas_ret_typ = ret.1.clone();

                    // Extends the context with the fold type
                    extend_context(Box::new(fold_typ.clone()), ctx);
                    vars.push(b"fold".to_vec());
                    shift(&mut expect_cas_ret_typ, 1, 1 + ret.0.len() as i32);

                    // For each field of this case
                    for j in 0..cas_arg.len() {
                        // Extends context with the field's type
                        let mut cas_arg_typ = cas_arg_typ[j].clone();
                        subs(&mut cas_arg_typ, &idt.clone(), j as i32 + 1);
                        extend_context(Box::new(cas_arg_typ.clone()), ctx);
                        vars.push(cas_arg[j].clone());

                        // Shifts the return type
                        shift(&mut expect_cas_ret_typ, 1, 1 + ret.0.len() as i32);

                        // Appends field variable to the witness
                        shift(&mut wit, 1, 0);
                        wit = App{
                            fun: Box::new(wit),
                            arg: Box::new(Var{idx: 0})
                        };
                    }

                    // Applies the witness to the expected case return type
                    subs(&mut expect_cas_ret_typ, &wit, cas_idx.len() as i32);

                    // Applies each index to the expected case return type
                    for i in 0..cas_idx.len() {
                        subs(&mut expect_cas_ret_typ, cas_idx[i], (cas_idx.len() - i - 1) as i32);
                    }

                    // Infers the actual case return type
                    let actual_cas_ret_typ = do_infer(cas_bod, vars, defs, ctx, checked)?;

                    // Checks if expected case return type matches actual case return type
                    if !equals_reduced(&expect_cas_ret_typ, &actual_cas_ret_typ, defs) {
                        return Err(WrongCaseType{
                            expect: *expect_cas_ret_typ.clone(),
                            actual: actual_cas_ret_typ.clone(),
                            name: cas_nam.clone(),
                            term: term.clone(),
                            vars: vars.clone()
                        });
                    }

                    // Cleans up fold var
                    narrow_context(ctx);
                    vars.pop();

                    // Cleans up constructor vars
                    for _ in 0..cas_arg.len() {
                        narrow_context(ctx);
                        vars.pop();
                    }
                }
            }

            Ok(ret_typ)
        },
        Cpy{nam, val, bod} => {
            let nam_0 = rename(&nam.0, vars);
            let nam_1 = rename(&nam.1, vars);
            let val_typ = do_infer(val, vars, defs, ctx, checked)?;

            extend_context(Box::new(val_typ.clone()), ctx);
            vars.push(nam_0.clone());

            extend_context(Box::new(val_typ.clone()), ctx);
            vars.push(nam_1.clone());

            let bod_typ = do_infer(bod, vars, defs, ctx, checked)?;

            narrow_context(ctx);
            vars.pop();

            narrow_context(ctx);
            vars.pop();

            Ok(bod_typ)
        },
        Set => {
            Ok(Set)
        },
    }
}

// Convenience
pub fn infer(term : &Term, defs : &Defs, checked : bool) -> Result<Term, TypeError> {
    do_infer(term, &mut Vec::new(), defs, &mut Vec::new(), checked)
}
