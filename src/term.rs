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
        idt: Box<Term>,
        val: Box<Term>,
        ret: Box<Term>,
        cas: Vec<(Vec<u8>, Box<Term>)>
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
        // Application
        b':' => {
            let (code, fun) = parse_term(&code[1..], vars, defs);
            let (code, arg) = parse_term(code, vars, defs);
            let fun = Box::new(fun);
            let arg = Box::new(arg);
            (code, App{fun,arg})
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
        // Inductive Data Type
        b'$' => {
            let (code, nam) = parse_name(&code[1..]);
            let (code, typ) = parse_term(code, vars, defs);
            let nam = nam.to_vec();
            let typ = Box::new(typ);
            let code = skip_whites(code);
            let mut new_code = code;
            let mut ctr : Vec<(Vec<u8>, Box<Term>)> = Vec::new();
            vars.push(nam.to_vec());
            while new_code.len() > 0 && new_code[0] == b'|' {
                let code = &new_code[1..];
                let (code, ctr_nam) = parse_name(code);
                let (code, ctr_typ) = parse_term(code, vars, defs);
                let code = skip_whites(code);
                let ctr_nam = ctr_nam.to_vec();
                let ctr_typ = Box::new(ctr_typ);
                ctr.push((ctr_nam, ctr_typ));
                new_code = code;
            };
            vars.pop();
            (new_code, Idt{nam, typ, ctr})
        },
        // Constructor
        b'.' => {
            let (code, nam) = parse_name(&code[1..]);
            let (code, idt) = parse_term(code, vars, defs);
            let nam = nam.to_vec();
            let idt = Box::new(idt);
            (code, Ctr{nam,idt})
        },
        // Pattern-Matching
        b'~' => {
            let (code, idt) = parse_term(&code[1..], vars, defs);
            let (code, val) = parse_term(code, vars, defs);
            let (code, ret) = parse_term(code, vars, defs);
            let val = Box::new(val);
            let idt = Box::new(idt);
            let ret = Box::new(ret);
            let code = skip_whites(code);
            let mut new_code = code;
            let mut cas : Vec<(Vec<u8>, Box<Term>)> = Vec::new();
            while new_code.len() > 0 && new_code[0] == b'|' {
                let code = &new_code[1..];
                let (code, cas_nam) = parse_name(code);
                let (code, cas_fun) = parse_term(code, vars, defs);
                let cas_nam = cas_nam.to_vec();
                let cas_fun = Box::new(cas_fun);
                cas.push((cas_nam, cas_fun));
                new_code = skip_whites(code);
            }
            (new_code, Cas{idt,val,ret,cas})
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
                let idx = vars.len() - idx as usize - 1;
                let quo = b"X".to_vec();
                let nam = if idx < vars.len() { &vars[idx] } else { &quo };
                code.append(&mut nam.clone());
            },
            &Ref{ref nam} => {
                code.append(&mut nam.clone());
            },
            &Idt{ref nam, typ: _, ctr: _} => {
                let nam = rename(nam, vars);
                //code.extend_from_slice(b"$");
                code.append(&mut nam.clone());
                //code.extend_from_slice(b" ");
                //vars.push(nam.to_vec());
                //build(code, &typ, vars);
                //for (nam,typ) in ctr {
                    //code.extend_from_slice(b" ");
                    //code.extend_from_slice(b"|");
                    //code.append(&mut nam.clone());
                    //code.extend_from_slice(b" ");
                    //build(code, &typ, vars);
                //}
                //vars.pop();
            },
            &Ctr{ref nam, ref idt} => {
                code.extend_from_slice(b".");
                code.append(&mut nam.clone());
                code.extend_from_slice(b" ");
                build(code, &idt, vars);
            },
            &Cas{ref idt, ref val, ref ret, ref cas} => {
                code.extend_from_slice(b"~");
                build(code, &idt, vars);
                code.extend_from_slice(b" ");
                build(code, &val, vars);
                code.extend_from_slice(b" ");
                build(code, &ret, vars);
                for (nam,fun) in cas {
                    code.extend_from_slice(b" ");
                    code.extend_from_slice(b"|");
                    code.append(&mut nam.clone());
                    code.extend_from_slice(b" ");
                    build(code, &fun, vars);
                }
            },
            //&Let{ref nam, ref val, ref bod} => {
                //code.extend_from_slice(b"=");
                //code.append(&mut nam.clone());
                //code.extend_from_slice(b" ");
                //build(code, &val);
                //code.extend_from_slice(b" ");
                //build(code, &bod);
            //},
            //&Bxv{ref val} => {
                //code.extend_from_slice(b"|");
                //build(code, &val);
            //},
            //&Bxt{ref val} => {
                //code.extend_from_slice(b"!");
                //build(code, &val);
            //},
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
        &mut Idt{nam: ref mut _nam, ref mut typ, ref mut ctr} => {
            shift(typ, inc, cut);
            for (_,ctr_typ) in ctr {
                shift(ctr_typ, inc, cut+1);
            }
        },
        &mut Ctr{nam: ref mut _nam, ref mut idt} => {
            shift(idt, inc, cut);
        },
        &mut Cas{ref mut idt, ref mut val, ref mut ret, ref mut cas} => {
            shift(idt, inc, cut);
            shift(val, inc, cut);
            shift(ret, inc, cut);
            for (_,cas_fun) in cas {
                shift(cas_fun, inc, cut);
            }
        },
        //&mut Let{nam: ref mut _nam, ref mut val, ref mut bod} => {
            //shift(val, d, c);
            //shift(bod, d, c);
        //},
        //&mut Bxv{ref mut val} => {
            //shift(val, d, c);
        //},
        //&mut Bxt{ref mut val} => {
            //shift(val, d, c);
        //},
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
        &mut Cas{ref mut idt, ref mut val, ref mut ret, ref mut cas} => {
            subs(idt, value, dph);
            subs(val, value, dph);
            subs(ret, value, dph);
            for (_,cas_fun) in cas {
                subs(cas_fun, value, dph);
            }
        },
        _ => {}
    };
    // Because couldn't modify Var inside its own case
    match new_term {
        Some(new_term) => *term = new_term,
        None => {}
    };
}

// The expected type of a branch in a pattern-match.
pub fn case_type(fun : &Term, idt : &Term, mut ret : Term, mut slf : Term, dph : i32) -> Term {
    match fun {
        All{nam, ref typ, ref bod} => {
            let mut typ = typ.clone();
            subs(&mut typ, idt, dph+1);
            shift(&mut slf, 1, 0);
            shift(&mut ret, 1, 0);
            slf = App{fun: Box::new(slf), arg: Box::new(Var{idx: 0})};
            let bod = case_type(bod, idt, ret, slf, dph+1);
            let nam = nam.to_vec();
            let bod = Box::new(bod);
            All{nam, typ, bod}
        },
        _ => {
            let mut new_fun = fun.clone();
            subs(&mut new_fun, &ret, 0);
            let fun = Box::new(new_fun);
            let arg = Box::new(slf.clone());
            App{fun, arg}
        }
    }
}

// Reduces an expression if it is a redex, returns true if was.
pub fn redex(term : &mut Term, defs : &Defs, refs : bool) -> bool {
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
        Cas{mut idt, mut val, mut ret, mut cas} => {
            let tmp_val : Term = *val;
            match tmp_val {
                Ctr{nam, idt:_} => {
                    changed = true;
                    let mut fun : Term = Set;
                    for i in 0..cas.len() {
                        let case_nam = &cas[i].0;
                        let case_fun = &cas[i].1;
                        if *case_nam == nam {
                            fun = *case_fun.clone();
                        }
                    }
                    fun
                },
                t => {
                    Cas{idt, val: Box::new(t), ret, cas}
                }
            }
        },
        Ref{nam} => {
            if refs {
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
pub fn global_reduce_step(term : &mut Term, defs : &Defs, refs : bool) -> bool {
    let changed_below = match term {
        App{ref mut fun, ref mut arg} => {
            global_reduce_step(fun, defs, refs) ||
            global_reduce_step(arg, defs, refs)
        },
        Lam{nam: _, ref mut typ, ref mut bod} => {
            global_reduce_step(typ, defs, refs) ||
            global_reduce_step(bod, defs, refs)
        },
        All{nam: _, ref mut typ, ref mut bod} => {
            global_reduce_step(typ, defs, refs) ||
            global_reduce_step(bod, defs, refs)
        },
        Idt{nam: _, ref mut typ, ref mut ctr} => {
            let mut changed_ctr = false;
            for i in 0..ctr.len() {
                changed_ctr = changed_ctr || global_reduce_step(&mut ctr[i].1, defs, refs);
            }
            changed_ctr || global_reduce_step(typ, defs, refs)
        },
        Ctr{nam: _, ref mut idt} => {
            global_reduce_step(idt, defs, refs)
        },
        Cas{ref mut idt, ref mut val, ref mut ret, ref mut cas} => {
            let mut changed_cas = false;
            for i in 0..cas.len() {
                let cas_fun = &mut cas[i].1;
                changed_cas = changed_cas || global_reduce_step(cas_fun, defs, refs);
            }
            changed_cas ||
            global_reduce_step(idt, defs, refs) ||
            global_reduce_step(val, defs, refs) ||
            global_reduce_step(ret, defs, refs)
        },
        _ => false
    };
    let changed_self = redex(term, defs, refs);
    changed_below || changed_self
}

// Performs a global parallel weak reduction step.
pub fn weak_global_reduce_step(term : &mut Term, defs : &Defs, refs : bool) -> bool {
    let changed_below = match term {
        App{ref mut fun, arg: _} => {
            weak_global_reduce_step(fun, defs, refs)
        },
        Cas{idt: _, ref mut val, ret: _, cas: _} => {
            weak_global_reduce_step(val, defs, refs)
        },
        _ => false
    };
    let changed_self = redex(term, defs, refs);
    changed_below || changed_self
}

// Reduces a term to weak head normal form.
pub fn weak_reduce(term : &mut Term, defs : &Defs, refs : bool) -> bool {
    let mut changed = false;
    while weak_global_reduce_step(term, defs, refs) {
        changed = true;
    }
    changed
}

// Reduces a term to normal form.
pub fn reduce(term : &mut Term, defs : &Defs, refs : bool) -> bool {
    let mut changed = false;
    while global_reduce_step(term, defs, refs) {
        changed = true;
    }
    changed
}

// Performs an equality test. Mutable, because it may reduce redexes.
pub fn equals_mut(a : &mut Term, b : &mut Term, defs : &Defs) -> bool {
    // Reduces terms to weak head normal norm without dereferences.
    weak_reduce(a, defs, false);
    weak_reduce(b, defs, false);
    // If one is a Ref and the other not, dereference.
    match (&a, &b) {
        (&Ref{nam: _}, &Ref{nam: _}) => {},
        (&Ref{nam: _}, _)            => { weak_reduce(a, defs, true); },
        (_, &Ref{nam: _})            => { weak_reduce(b, defs, true); },
        _                            => {}
    };
    // Check if the heads are equal.
    match (a, b) {
        (&mut App{fun: ref mut a_fun, arg: ref mut a_arg},
         &mut App{fun: ref mut b_fun, arg: ref mut b_arg}) => {
            equals_mut(a_fun, b_fun, defs) &&
            equals_mut(a_arg, b_arg, defs)
        },
        (&mut Lam{nam: _, typ: ref mut a_typ, bod: ref mut a_bod},
         &mut Lam{nam: _, typ: ref mut b_typ, bod: ref mut b_bod}) => {
            equals_mut(a_typ, b_typ, defs) &&
            equals_mut(a_bod, b_bod, defs)
        },
        (&mut All{nam: _, typ: ref mut a_typ, bod: ref mut a_bod},
         &mut All{nam: _, typ: ref mut b_typ, bod: ref mut b_bod}) => {
            equals_mut(a_typ, b_typ, defs) &&
            equals_mut(a_bod, b_bod, defs)
        },
        (&mut Var{idx: ref mut a_idx},
         &mut Var{idx: ref mut b_idx}) => {
            a_idx == b_idx
        },
        (&mut Ref{nam: ref mut a_nam},
         &mut Ref{nam: ref mut b_nam}) => {
            a_nam == b_nam
        },
        (&mut Idt{nam: _, typ: ref mut a_typ, ctr: ref mut a_ctr},
         &mut Idt{nam: _, typ: ref mut b_typ, ctr: ref mut b_ctr}) => {
            let mut eql_ctr = true;
            if a_ctr.len() != b_ctr.len() {
                return false;
            }
            for i in 0..a_ctr.len() {
                let (mut a_ctr_nam, mut a_ctr_typ) = a_ctr[i].clone();
                let (mut b_ctr_nam, mut b_ctr_typ) = b_ctr[i].clone();
                eql_ctr =
                    eql_ctr &&
                    a_ctr_nam == b_ctr_nam &&
                    equals_mut(&mut a_ctr_typ, &mut b_ctr_typ, defs);
            }
            equals_mut(a_typ, b_typ, defs) && eql_ctr
        },
        (&mut Ctr{nam: ref mut a_nam, idt: ref mut a_idt},
         &mut Ctr{nam: ref mut b_nam, idt: ref mut b_idt}) => {
            a_nam == b_nam && equals_mut(a_idt, b_idt, defs)
        },
        (&mut Cas{idt: ref mut a_idt, val: ref mut a_val, ret: ref mut a_ret, cas: ref mut a_cas},
         &mut Cas{idt: ref mut b_idt, val: ref mut b_val, ret: ref mut b_ret, cas: ref mut b_cas}) => {
            let mut eql_cas = true;
            for i in 0..a_cas.len() {
                let (_, mut a_cas_fun) = a_cas[i].clone();
                let (_, mut b_cas_fun) = b_cas[i].clone();
                eql_cas = eql_cas && equals_mut(&mut a_cas_fun, &mut b_cas_fun, defs);
            }
            eql_cas &&
            equals_mut(a_idt, b_idt, defs) &&
            equals_mut(a_val, b_val, defs) &&
            equals_mut(a_ret, b_ret, defs)
        },
        (Set, Set) => true,
        _ => false
    }
}

// Equality test. Requires copying, as it may need to reduce redexes.
pub fn equals(a : &Term, b : &Term, defs : &Defs) -> bool {
    let mut a_mut = a.clone();
    let mut b_mut = b.clone();
    equals_mut(&mut a_mut, &mut b_mut, defs)
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
                let mut fun_t = go(fun, vars, defs, ctx, checked)?;
                weak_reduce(&mut fun_t, defs, true);
                match fun_t {
                    All{nam: _f_nam, typ: f_typ, bod: f_bod} => {
                        let mut arg_n = arg.clone();
                        if !checked {
                            let arg_t = go(arg, vars, defs, ctx, checked)?;
                            let mut new_typ = f_typ.clone();
                            subs(&mut new_typ, &arg_n, 0);
                            if !equals(&new_typ, &arg_t, defs) {
                                let mut new_typ_whnf = new_typ.clone();
                                reduce(&mut new_typ_whnf, defs, false);
                                return Err(format!(
                                    "Type mismatch.\n- Expected : {}\n- Actual   : {}\n- On term: {}",
                                    to_string(&new_typ_whnf, vars),
                                    to_string(&arg_t, vars),
                                    to_string(&term, vars)))
                            }
                        }
                        let mut new_bod = f_bod.clone();
                        subs(&mut new_bod, &arg_n, 0);
                        //reduce(&mut new_bod, defs);
                        Ok(*new_bod)
                    },
                    _ => {
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
                //println!("ueee {}", bod_t);
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
                //println!("all {} ... {} ... {}", String::from_utf8_lossy(&nam), typ, bod);
                if !checked {
                    let nam = rename(&nam, vars);
                    let mut typ_n = typ.clone();
                    //reduce(&mut typ_n, defs);
                    vars.push(nam.to_vec());
                    extend_context(typ_n, ctx);
                    let typ_t = Box::new(go(typ, vars, defs, ctx, checked)?);
                    let bod_t = Box::new(go(bod, vars, defs, ctx, checked)?);
                    vars.pop();
                    //println!("... {} ... {}", typ_t, bod_t);
                    narrow_context(ctx);
                    if !equals(&typ_t, &Set, defs) || !equals(&bod_t, &Set, defs) {
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
            Idt{nam: _, typ, ctr: _} => {
                let mut typ_v = typ.clone();
                //reduce(&mut typ_v, defs);
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
                        return Err(format!("Constructor not found: {}.", String::from_utf8_lossy(nam)))
                    },
                    _ => {
                        Err(format!("Not an IDT: {:?}", to_string(&idt, vars)))
                    }
                }
            },
            Cas{idt, val, ret, cas} => {
                let mut indices : Vec<Term> = Vec::new();
                let mut tmp_idt : Term = *idt.clone();
                weak_reduce(&mut tmp_idt, defs, true);
                loop {
                    match tmp_idt {
                        App{fun, arg} => {
                            indices.push(*arg.clone());
                            tmp_idt = *fun;
                        },
                        Idt{nam, typ: _, ctr} => {
                            if !checked {
                                if cas.len() != ctr.len() {
                                    return Err(format!(
                                        "Mismatched pattern-match. The type `{}` has {} constructors, but {} were provided.",
                                        String::from_utf8_lossy(&nam), ctr.len(), cas.len()));
                                } 
                                for i in 0..ctr.len() {
                                    let ctr_nam = &ctr[i].0;
                                    let ctr_typ = &ctr[i].1;
                                    let cas_nam = &cas[i].0;
                                    let cas_val = &cas[i].1;
                                    if ctr_nam != cas_nam {
                                        return Err(format!(
                                            "Mismatched pattern-match. The case {} has name `{}`, but type `{}` calls it `{}`.", i,
                                            String::from_utf8_lossy(cas_nam),
                                            String::from_utf8_lossy(&nam),
                                            String::from_utf8_lossy(ctr_nam)));
                                    }
                                    let mut ret = *ret.clone();
                                    let ctr_val = Ctr{nam: ctr_nam.to_vec(), idt: idt.clone()};
                                    let cas_typ = case_type(ctr_typ, idt, ret, ctr_val, 0);
                                    let cas_val_t = go(cas_val, vars, defs, ctx, checked)?;
                                    if !equals(&cas_val_t, &cas_typ, defs) {
                                        let mut cas_typ_whnf = cas_typ.clone();
                                        reduce(&mut cas_typ_whnf, defs, true);
                                        return Err(format!(
                                            "Type mismatch on `{}` case of pattern-match.\n- Expected : {}\n- Actual   : {}",
                                            String::from_utf8_lossy(ctr_nam),
                                            to_string(&cas_typ_whnf, vars),
                                            to_string(&cas_val_t, vars)));
                                    }
                                }
                            }
                            let mut res : Term = *ret.clone();
                            for i in (0..indices.len()).rev() {
                                let fun = Box::new(res);
                                let arg = Box::new(indices[i].clone());
                                res = App{fun, arg};
                            }
                            let fun = Box::new(res);
                            let arg = Box::new(*val.clone());
                            res = App{fun, arg};
                            //println!("res {}", res);
                            return Ok(res);
                        },
                        _ => {
                            return Err(format!("Pattern match type not a valid IDT."));
                        }
                    }
                }
            },
            Set => {
                Ok(Set)
            },
        }
    }
    go(term, &mut Vec::new(), defs, &mut Vec::new(), checked)
}
