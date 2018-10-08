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

    // Application
    App {
        fun: Box<Term>,
        arg: Box<Term>
    },

    // Variable
    Var {
        idx: i32
    },

    // Reference
    Ref {
        nam: Vec<u8>
    },

    // Type of Types
    Set
}

use self::Term::{*};

type Vars = Vec<Vec<u8>>;
type Defs = HashMap<Vec<u8>, Term>;

// Skips spaces, newlines, etc.
pub fn skip_whites(code : &[u8]) -> &[u8] {
    let mut new_code : &[u8] = code;
    while new_code.len() > 0 && (new_code[0] == b' ' || new_code[0] == b'\n') {
        new_code = &new_code[1..];
    }
    new_code
}

// Parses a name, returns the remaining code and the name.
fn parse_name(code : &[u8]) -> (&[u8], &[u8]) {
    let mut i : usize = 0;
    while i < code.len() && !(code[i] == b' ' || code[i] == b'\n') {
        i += 1;
    }
    (&code[i..], &code[0..i])
}

// Parses a term, returning the remaining code and the term.
// Note: parsing currently panics on error. TODO: chill and return a Result.
pub fn parse_term<'a>(code : &'a [u8], vars : &mut Vars, defs : &mut Defs) -> (&'a [u8], Term) {
    let code = skip_whites(code);
    match code[0] {
        // Definition
        b'/' => {
            let (code, nam) = parse_name(&code[1..]);
            let (code, val) = parse_term(code, vars, defs);
            defs.insert(nam.to_vec(), val);
            let (code, bod) = parse_term(code, vars, defs);
            (code, bod)
        },
        // Forall
        b'@' => {
            let (code, nam) = parse_name(&code[1..]);
            vars.push(nam.to_vec());
            let (code, typ) = parse_term(code, vars, defs);
            let (code, bod) = parse_term(code, vars, defs);
            vars.pop();
            let nam = nam.to_vec();
            let typ = Box::new(typ);
            let bod = Box::new(bod);
            (code, All{nam,typ,bod})
        },
        // Lambda
        b'#' => {
            let (code, nam) = parse_name(&code[1..]);
            vars.push(nam.to_vec());
            let (code, typ) = parse_term(code, vars, defs);
            let (code, bod) = parse_term(code, vars, defs);
            vars.pop();
            let nam = nam.to_vec();
            let typ = Box::new(typ);
            let bod = Box::new(bod);
            (code, Lam{nam,typ,bod})
        },
        // Application
        b':' => {
            let (code, fun) = parse_term(&code[1..], vars, defs);
            let (code, arg) = parse_term(code, vars, defs);
            let fun = Box::new(fun);
            let arg = Box::new(arg);
            (code, App{fun,arg})
        },
        // Set
        b'*' => {
            (&code[1..], Set)
        },
        // Variable
        _ => {
            let (code, nam) = parse_name(code);
            let mut idx : Option<i32> = None;
            for i in (0..vars.len()).rev() {
                if vars[i] == nam {
                    idx = Some((vars.len() - i - 1) as i32);
                    break;
                }
            }
            (code, match idx {
                Some(idx) => Var{idx},
                None => Ref{nam: nam.to_vec()}
            })
        }
    }
}

// Converts a source-code to a λ-term.
pub fn from_bytes_slice<'a>(code : &'a [u8]) -> (Term, Defs) {
    let mut vars = Vec::new();
    let mut defs = HashMap::new();
    let (_code, term) = parse_term(code, &mut vars, &mut defs);
    (term, defs)
}

// Convenience
pub fn from_bytes(code : Vec<u8>) -> (Term, Defs) {
    from_bytes_slice(&code)
}

// Convenience
pub fn from_string_slice(code : &str) -> (Term, Defs) {
    from_bytes_slice(code.as_bytes())
}

// Convenience
pub fn from_string(code : String) -> (Term, Defs) {
    from_string_slice(&code)
}

// Builds a var name from an index (0="a", 1="b", 26="aa"...).
pub fn var_name(idx : i32) -> Vec<u8> {
    let mut name = Vec::new();
    let mut idx  = idx;
    if idx < 0 {
        idx = -idx;
        name.push(45);
    }
    if idx == 0 {
        name.push(63);
    }
    while idx > 0 {
        idx = idx - 1;
        name.push((97 + idx % 26) as u8);
        idx = idx / 26;
    }
    return name;
}

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

// Converts a λ-term back to a source-code.
pub fn to_bytes(term : &Term, vars : &mut Vars) -> Vec<u8> {
    fn build(code : &mut Vec<u8>, term : &Term, vars : &mut Vars) {
        match term {
            &App{ref fun, ref arg} => {
                code.extend_from_slice(b":");
                build(code, &fun, vars);
                code.extend_from_slice(b" ");
                build(code, &arg, vars);
            },
            &Lam{ref nam, ref typ, ref bod} => {
                let nam = rename(nam, vars);
                code.extend_from_slice(b"#");
                code.append(&mut nam.clone());
                code.extend_from_slice(b" ");
                vars.push(nam.to_vec());
                build(code, &typ, vars);
                code.extend_from_slice(b" ");
                build(code, &bod, vars);
                vars.pop();
            },
            &All{ref nam, ref typ, ref bod} => {
                let nam = rename(nam, vars);
                code.extend_from_slice(b"@");
                code.append(&mut nam.clone());
                code.extend_from_slice(b" ");
                vars.push(nam.to_vec());
                build(code, &typ, vars);
                code.extend_from_slice(b" ");
                build(code, &bod, vars);
                vars.pop();
            },
            &Var{idx} => {
                let nam = &vars[vars.len() - idx as usize - 1];
                code.append(&mut nam.clone());
            },
            &Ref{ref nam} => {
                code.append(&mut nam.clone());
            },
            &Set => {
                code.extend_from_slice(b"*");
            }
        }
    }
    let mut code = Vec::new();
    build(&mut code, term, vars);
    return code;
}

// Convenience.
pub fn to_string(term : &Term, vars : &mut Vars) -> String {
    let bytes = to_bytes(term, vars);
    match String::from_utf8(bytes) {
        Ok(s) => s,
        Err(_) => String::from("Stringified code not a valid UTF8 string. This is a ironically a Formality bug.")
    }
}

// Display trait.
impl std::fmt::Display for Term {
    fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
        write!(f, "{}", String::from_utf8_lossy(&to_bytes(&self, &mut Vec::new())))
    }
}

// Increases the index of all free variables of a term, assuming `cut` enclosing lambdas, by `inc`.
pub fn shift(term : &mut Term, inc : i32, cut : i32) {
    match term {
        &mut App{ref mut fun, ref mut arg} => {
            shift(fun, inc, cut);
            shift(arg, inc, cut);
        },
        &mut Lam{nam: ref mut _nam, ref mut typ, ref mut bod} => {
            shift(typ, inc, cut+1);
            shift(bod, inc, cut+1);
        },
        &mut All{nam: ref mut _nam, ref mut typ, ref mut bod} => {
            shift(typ, inc, cut+1);
            shift(bod, inc, cut+1);
        },
        &mut Var{ref mut idx} => {
            *idx = if *idx < cut { *idx } else { *idx + inc };
        },
        &mut Ref{nam: _} => {},
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
        _ => {}
    };
    // Because couldn't modify Var inside its own case
    match new_term {
        Some(new_term) => *term = new_term,
        None => {}
    };
}

// Atomic reduction rule.
pub fn reduce_step(term : &mut Term, defs : &Defs) -> bool {
    let tmp_term : Term = std::mem::replace(term, Set);
    let new_term : Term;
    let mut changed = false;
    match tmp_term {
        App{fun, arg} => {
            match *fun {
                Lam{nam: _, typ: _, mut bod} => {
                    subs(&mut bod, &arg, 0);
                    changed = true;
                    new_term = *bod;
                },
                t => new_term = App{fun: Box::new(t), arg}
            }
        },
        Ref{nam} => {
            match defs.get(&nam) {
                Some(val) => {
                    changed = true;
                    new_term = val.clone();
                },
                None => new_term = Ref{nam}
            }
        },
        t => new_term = t
    }
    std::mem::replace(term, new_term);
    return changed;
}

// Performs a single parallel reduction step.
// This is done in order to ensure normalizable terms halt.
pub fn weak_global_reduce_step(term : &mut Term, defs : &Defs) -> bool {
    if reduce_step(term, defs) {
        return true;
    } else {
        match term {
            All{nam:_, typ: _, bod: _} => false,
            Lam{nam:_, typ: _, bod: _} => false,
            App{ref mut fun, arg: _} => weak_global_reduce_step(fun, defs),
            _ => false
        }
    }
}

// Reduces a term to weak head normal form.
pub fn weak_reduce(term : &mut Term, defs : &Defs) -> bool {
    let mut changed = false;
    while weak_global_reduce_step(term, defs) {
        changed = true;
    }
    changed
}

// Performs a single parallel reduction step.
// This is done in order to ensure normalizable terms halt.
pub fn global_reduce_step(term : &mut Term, defs : &Defs) -> bool {
    let mut maybe_redex = false;
    let changed_below = match term {
        All{nam:_, ref mut typ, ref mut bod} => {
            global_reduce_step(typ, defs) ||
            global_reduce_step(bod, defs)
        },
        Lam{nam:_, ref mut typ, ref mut bod} => {
            global_reduce_step(typ, defs) ||
            global_reduce_step(bod, defs)
        },
        App{ref mut fun, ref mut arg} => {
            maybe_redex = true;
            global_reduce_step(fun, defs) ||
            global_reduce_step(arg, defs)
        },
        _ => false
    };
    changed_below || maybe_redex && reduce_step(term, defs)
}

// Reduces a term to normal form.
pub fn reduce(term : &mut Term, defs : &Defs) {
    let mut changed = true;
    let mut count = 0;
    while changed && count < 64 {
        count += 1;
        changed = global_reduce_step(term, defs);
    }
}

// Equality test.
pub fn equals(a : &Term, b : &Term, defs : &Defs) -> bool {
    match (a,b) {
        (&App{fun: ref a_fun, arg: ref a_arg}, &App{fun: ref b_fun, arg: ref b_arg}) => {
            equals(a_fun, b_fun, defs) && equals(a_arg, b_arg, defs)
        },
        (&Lam{nam: _, typ: ref a_typ, bod: ref a_bod}, &Lam{nam: _, typ: ref b_typ, bod: ref b_bod}) => {
            equals(a_typ, b_typ, defs) && equals(a_bod, b_bod, defs)
        },
        (&All{nam: _, typ: ref a_typ, bod: ref a_bod}, &All{nam: _, typ: ref b_typ, bod: ref b_bod}) => {
            equals(a_typ, b_typ, defs) && equals(a_bod, b_bod, defs)
        },
        (&Var{idx: ref a_idx}, &Var{idx: ref b_idx}) => {
            a_idx == b_idx
        },
        (&Ref{nam: ref a_nam}, &Ref{nam: ref b_nam}) => {
            a_nam == b_nam
        },
        (Set, Set) => true,
        (a, b) => {
            let mut new_a = a.clone();
            //println!("not eq {} ... {}", a, b);
            //let wk = weak_reduce(&mut new_a, defs);
            //println!("wk: {} ... to {}", wk, new_a);
            if weak_reduce(&mut new_a, defs) {
                //println!("uhmm {} --- {}", new_a, b);
                let eq = equals(&new_a, b, defs);
                //println!("uh");
                //println!("is eq? {}", eq);
                eq
            } else {
                let mut new_b = b.clone();
                if weak_reduce(&mut new_b, defs) {
                    equals(a, &new_b, defs)
                } else {
                    println!("- {:?}\n- {:?}", a, b);
                    false
                }
            }
        }
    }
}

// A Context is a vector of (name, value) assignments.
type Context<'a> = Vec<Box<Term>>;

// Extends a context.
fn extend_context<'a>(val : Box<Term>, ctx : &'a mut Context<'a>) -> &'a mut Context<'a> {
    for i in 0..ctx.len() {
        shift(&mut ctx[i], 1, 0);
    }
    ctx.push(val);
    ctx
}

// Narrows a context.
fn narrow_context<'a>(ctx : &'a mut Context<'a>) -> &'a mut Context<'a> {
    ctx.pop();
    for i in 0..ctx.len() {
        shift(&mut ctx[i], -1, 0);
    }
    ctx
}

// TODO: return Result
pub fn infer(term : &Term, defs : &Defs, checked : bool) -> Result<Term, std::string::String> {
    pub fn go<'a>(term : &Term, vars : &mut Vars, defs : &Defs, ctx : &mut Context, checked : bool) -> Result<Term, std::string::String> {
        match term {
            App{fun, arg} => {
                //let mut fun = fun.clone();
                //println!("-- {}", to_string(&fun, vars));
                //weak_reduce(&mut fun, &HashMap::new());
                //println!("-> {}", to_string(&fun, vars));
                let mut fun_t = go(&fun, vars, defs, ctx, checked)?;
                weak_reduce(&mut fun_t, defs);
                match fun_t {
                    All{nam: _f_nam, typ: f_typ, bod: f_bod} => {
                        if !checked {
                            //let mut f_typ = f_typ.clone();
                            //weak_reduce(&mut f_typ, defs);
                            let arg_t = go(arg, vars, defs, ctx, checked)?;
                            let mut new_f_typ = f_typ.clone();
                            subs(&mut new_f_typ, &arg, 0);
                            if !equals(&new_f_typ, &arg_t, defs) {
                                return Err(format!(
                                    "Type mismatch.\n- Expected : {}\n- Actual   : {}\n- On term: {}",
                                    to_string(&new_f_typ, vars),
                                    to_string(&arg_t, vars),
                                    to_string(&term, vars)))
                            }
                        }
                        let mut new_bod = f_bod.clone();
                        subs(&mut new_bod, &arg, 0);
                        //reduce(&mut new_bod, defs);
                        Ok(*new_bod)
                    },
                    _ => {
                        println!("-- norm {}", to_string(&fun, vars));
                        println!("-- type {}", to_string(&fun_t, vars));
                        Err(format!(
                            "Not a function.\n- Type: {}\n- On term: {}",
                            to_string(&fun_t, vars),
                            to_string(&term, vars)))
                    }
                }
            },
            Lam{nam, typ, bod} => {
                let nam = rename(&nam, vars);
                let mut typ_n = typ.clone();
                //reduce(&mut typ_n, defs);
                vars.push(nam.to_vec());
                extend_context(typ_n.clone(), ctx);
                let bod_t = Box::new(go(bod, vars, defs, ctx, checked)?);
                vars.pop();
                narrow_context(ctx);
                if !checked {
                    let nam = nam.clone();
                    let typ = typ.clone();
                    let bod = bod_t.clone();
                    go(&All{nam,typ,bod}, vars, defs, ctx, checked)?;
                }
                Ok(All{nam: nam.clone(), typ: typ_n, bod: bod_t})
            },
            All{nam, typ, bod} => {
                if !checked {
                    let nam = rename(&nam, vars);
                    let mut typ_n = typ.clone();
                    //reduce(&mut typ_n, defs);
                    vars.push(nam.to_vec());
                    extend_context(typ_n, ctx);
                    let typ_t = Box::new(go(typ, vars, defs, ctx, checked)?);
                    let bod_t = Box::new(go(bod, vars, defs, ctx, checked)?);
                    vars.pop();
                    narrow_context(ctx);
                    if !equals(&typ_t, &bod_t, defs) {
                        return Err("Forall not a type.".to_string());
                    }
                }
                Ok(Set)
            },
            Var{idx} => {
                Ok(*ctx[ctx.len() - (*idx as usize) - 1].clone())
            },
            Ref{nam} => {
                match defs.get(nam) {
                    Some(val) => {
                        infer(val, &defs, true)
                    },
                    None => Err(format!("Unbound variable {}.", String::from_utf8_lossy(nam)))
                }
            },
            Set => {
                Ok(Set)
            },
        }
    }
    go(term, &mut Vec::new(), defs, &mut Vec::new(), checked)
}
