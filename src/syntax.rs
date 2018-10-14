// (a : A, b : B...) -> c (a : A, b : B...) => c
// f(x, y, z)
// ((a : A, b : B) -> a + b)
// ((a : A, b : B) -> c)(1, 2)
// data Name(a : A, b : B) | ctor TYP
// case Name(a, b) value : (a, b) => MOT | ctor (f0, f1) CASE_BOD
// def name val
//def hyp(x : Int, y : Int)
    //add(mul(x, x), mul(y, y))

use term::*;
use term::Vars;
use term::Defs;
use term::Term::*;

use std::string::*;
use std::str::*;
use std::collections::*;

pub struct Cursor {
    index  : usize,
    line   : usize,
    column : usize
}

pub fn is_name_char(chr : u8) -> bool {
    chr >= b'a' && chr <= b'z' ||
    chr >= b'A' && chr <= b'Z' ||
    chr >= b'0' && chr <= b'9' ||
    chr == b'_'
}

pub fn is_space<'a>(chr : u8) -> bool {
    chr == b' ' || chr == b'\n' || chr == b'\t'
}

pub fn advance_char(cursor : &mut Cursor, n : usize) {
    cursor.index += n;
    cursor.column += n;
}

pub fn advance_line(cursor : &mut Cursor) {
    cursor.index += 1;
    cursor.line += 1;
    cursor.column = 0;
}

// Skips spaces, newlines, etc.
pub fn skip_whites(cursor : &mut Cursor, code : &[u8]) {
    while cursor.index < code.len() {
        if code[cursor.index] == b'\n' {
            advance_line(cursor);
        } else if code[cursor.index] == b' ' {
            advance_char(cursor, 1);
        } else {
            break;
        }
    }
}

// Should not be EOF.
fn parse_not_eof(cursor : &mut Cursor, code : &[u8]) -> Result<(), String> {
    if cursor.index >= code.len() {
        Err(format!("Unexpected end of file."))
    } else {
        Ok(())
    }
}

// Prepare to parse something by skipping whites and checking if not EOF.
fn prepare_to_parse(cursor : &mut Cursor, code : &[u8]) -> Result<(), String> {
    skip_whites(cursor, code);
    parse_not_eof(cursor, code)?;
    Ok(())
}

// Parses name.
fn parse_name(cursor : &mut Cursor, code : &[u8]) -> Result<Vec<u8>, String> {
    prepare_to_parse(cursor, code)?;
    let mut name = Vec::new();
    while cursor.index < code.len() && is_name_char(code[cursor.index]) {
        name.push(code[cursor.index]);
        advance_char(cursor, 1);
    }
    return Ok(name);
}

// Checks if certain string is at a position.
fn match_exact(cursor : &mut Cursor, code : &[u8], string : &[u8]) -> bool {
    cursor.index + string.len() <= code.len() &&
    code[cursor.index .. cursor.index + string.len()] == *string
}

// Parses one of N possible strings, return its index or an error.
fn parse_one_of(cursor : &mut Cursor, code : &[u8], strings : &[&[u8]]) -> Result<usize, String> {
    prepare_to_parse(cursor, code)?;

    // Attempts to match one of strings, return matched index.
    for i in 0..strings.len() {
        if match_exact(cursor, code, strings[i]) {
            advance_char(cursor, strings[i].len());
            return Ok(i);
        }
    }

    // Otherwise, builds and return error message.
    let mut error = String::new();
    error.push_str(&format!("Syntax error (at line {}, col {}): ", cursor.line, cursor.column));
    if strings.len() > 1 {
        error.push_str("expected one of: ");
    } else {
        error.push_str("expected: ");
    }
    for i in 0..strings.len() {
        error.push_str("'");
        unsafe { error.push_str(from_utf8_unchecked(strings[i])); }
        error.push_str("'");
        if i < strings.len() {
            error.push_str(", ");
        }
    }
    error.push_str("; found '");
    error.push(code[cursor.index] as char);
    error.push_str("'.");
    Err(error)
}

//Parses a term, returning the remaining code and the term.
//Note: parsing currently panics on error. TODO: chill and return a Result.
pub fn parse_term
    ( cursor : &mut Cursor
    , code   : &[u8]
    , vars   : &mut Vars
    , defs   : &mut Defs)
    -> Result<Term, String> {

    //println!("parsing term");

    prepare_to_parse(cursor, code)?;

    //println!("ready: {}", String::from_utf8_lossy(&code[cursor.index..]));

    let parsed : Term;
    let appliable : bool;

    // Parenthesis
    if match_exact(cursor, code, b"((") || match_exact(cursor, code, b"(data ") {
        //println!("parens");
        advance_char(cursor, 1);
        parsed = parse_term(cursor, code, vars, defs)?;
        appliable = true;
        parse_one_of(cursor, code, &[b")"])?;

    // Abstraction
    } else if match_exact(cursor, code, b"(") {
        //println!("abstraction");
        advance_char(cursor, 1);
        prepare_to_parse(cursor, code)?;

        // Parses each argument
        let mut args : Vec<(Vec<u8>, Term)> = Vec::new();
        while code[cursor.index] != b')' {
            let var = parse_name(cursor, code)?;
            vars.push(var.clone());
            prepare_to_parse(cursor, code)?;
            parse_one_of(cursor, code, &[b":"])?;
            //panic!("im done");
            let typ = parse_term(cursor, code, vars, defs)?;
            args.push((var, typ));
            prepare_to_parse(cursor, code)?;
            if code[cursor.index] == b',' {
                advance_char(cursor, 1);
                prepare_to_parse(cursor, code)?;
            }
        }
        advance_char(cursor, 1);

        // Parses body
        prepare_to_parse(cursor, code)?;
        let kind = parse_one_of(cursor, code, &[b"-", b"="])?;
        parse_one_of(cursor, code, &[b">"])?;
        //println!("aqui");
        let mut abs = parse_term(cursor, code, vars, defs)?;

        //println!("aqui");

        // Builds resulting lambda / forall
        for i in (0..args.len()).rev() {
            let nam = args[i].0.to_vec();
            let typ = Box::new(args[i].1.clone());
            let bod = Box::new(abs);
            abs = match kind {
                0 => All{nam, typ, bod},
                1 => Lam{nam, typ, bod},
                _ => panic!("Should not happen.")
            };
            vars.pop();
        }
        parsed = abs;
        appliable = false;

    // Set
    } else if match_exact(cursor, code, b"Type") {
        //println!("Type");
        advance_char(cursor, 4);
        parsed = Set;
        appliable = false;

    // Inductive datatype
    } else if match_exact(cursor, code, b"data") {
        advance_char(cursor, 4);
        let nam = parse_name(cursor, code)?;
        prepare_to_parse(cursor, code)?;
        parse_one_of(cursor, code, &[b":"])?;
        prepare_to_parse(cursor, code)?;
        //println!("hmm {}", String::from_utf8_lossy(&nam));
        let typ = parse_term(cursor, code, vars, defs)?;
        skip_whites(cursor, code);
        let mut ctr : Vec<(Vec<u8>, Box<Term>)> = Vec::new();
        vars.push(nam.to_vec());
        while cursor.index < code.len() && match_exact(cursor, code, b"|") {
            advance_char(cursor, 1);
            let ctr_nam = parse_name(cursor, code)?;
            parse_one_of(cursor, code, &[b":"])?;
            let ctr_typ = parse_term(cursor, code, vars, defs)?;
            let ctr_typ = Box::new(ctr_typ);
            ctr.push((ctr_nam, ctr_typ));
            skip_whites(cursor, code);
        }
        vars.pop();
        let typ = Box::new(typ);
        let def = nam.to_vec();
        let idt = Idt{nam, typ, ctr};
        defs.insert(def, idt.clone());
        skip_whites(cursor, code);
        //println!("hmm");
        if match_exact(cursor, code, b")") {
            //println!("a");
            parsed = idt;
        } else {
            //println!("b");
            parsed = parse_term(cursor, code, vars, defs)?;
        }
        appliable = false;

    // Pattern-matching
    } else if match_exact(cursor, code, b"match") {
        // case Name(a, b) value : (a, b) => MOT | ctor (f0, f1) CASE_BOD
        advance_char(cursor, 5);
        let idt = parse_term(cursor, code, vars, defs)?;
        let val = parse_term(cursor, code, vars, defs)?;
        parse_one_of(cursor, code, &[b":"])?;
        let ret = parse_term(cursor, code, vars, defs)?;
        skip_whites(cursor, code);
        let mut cas : Vec<(Vec<u8>, Box<Term>)> = Vec::new();
        while cursor.index < code.len() && match_exact(cursor, code, b"|") {
            advance_char(cursor, 1);
            let cas_nam = parse_name(cursor, code)?;
            let cas_fun = parse_term(cursor, code, vars, defs)?;
            let cas_fun = Box::new(cas_fun);
            cas.push((cas_nam, cas_fun));
            skip_whites(cursor, code);
        }
        let idt = Box::new(idt);
        let val = Box::new(val);
        let ret = Box::new(ret);
        parsed = Cas{idt, val, ret, cas};
        appliable = false;

    // Definition
    } else if match_exact(cursor, code, b"def") {
        advance_char(cursor, 3);
        let nam = parse_name(cursor, code)?;
        let val = parse_term(cursor, code, vars, defs)?;
        defs.insert(nam.to_vec(), val);
        let bod = parse_term(cursor, code, vars, defs)?;
        parsed = bod;
        appliable = false;

    // Variable
    } else {
        //println!("var");
        let nam = parse_name(cursor, code)?;
        //println!("var: {}", String::from_utf8_lossy(&nam));
        let mut idx : Option<usize> = None;
        for i in (0..vars.len()).rev() {
            if vars[i] == nam {
                idx = Some(vars.len() - i - 1);
                break;
            }
        }
        parsed = match idx {
            Some(idx) => Var{idx: idx as i32},
            None      => Ref{nam: nam.to_vec()}
        };
        appliable = true;
    };

    // Constructor
    let parsed = if appliable && match_exact(cursor, code, b".") {
        advance_char(cursor, 1);
        let nam = parse_name(cursor, code)?;
        let idt = Box::new(parsed);
        Ctr{nam,idt}
    } else {
        parsed
    };

    // Application
    if appliable && match_exact(cursor, code, b"(") {
        advance_char(cursor, 1);
        // Parses arguments
        let mut args : Vec<Term> = Vec::new();
        while !match_exact(cursor, code, b")") {
            let arg = parse_term(cursor, code, vars, defs)?;
            args.push(arg);
            prepare_to_parse(cursor, code)?;
            if code[cursor.index] == b',' {
                advance_char(cursor, 1);
                prepare_to_parse(cursor, code)?;
            }
        }
        advance_char(cursor, 1);
        // Creates arguments object
        let mut app = parsed;
        for i in (0..args.len()).rev() {
            let fun = Box::new(app);
            let arg = Box::new(args[i].clone());
            app = App{fun, arg}
        }
        Ok(app)

    } else {
        Ok(parsed)
    }
}

// Converts a source-code to a term.
pub fn from_bytes_slice<'a>(code : &'a [u8]) -> Result<(Term, Defs), String> {
    let mut cursor = Cursor{index: 0, line: 0, column: 0};
    let mut vars = Vec::new();
    let mut defs = HashMap::new();
    let term = parse_term(&mut cursor, code, &mut vars, &mut defs)?;
    Ok((term, defs))
}

// Convenience
pub fn from_bytes(code : Vec<u8>) -> Result<(Term, Defs), String> {
    from_bytes_slice(&code)
}

// Convenience
pub fn from_string_slice(code : &str) -> Result<(Term, Defs), String> {
    from_bytes_slice(code.as_bytes())
}

// Convenience
pub fn from_string(code : String) -> Result<(Term, Defs), String> {
    from_string_slice(&code)
}

// Converts a λ-term back to a source-code.
pub fn to_bytes(term : &Term, vars : &mut Vars) -> Vec<u8> {
    fn build(code : &mut Vec<u8>, term : &Term, vars : &mut Vars) {
        match term {
            &App{ref fun, ref arg} => {
                build(code, &fun, vars);
                code.extend_from_slice(b"(");
                build(code, &arg, vars);
                code.extend_from_slice(b")");
            },
            &Lam{ref nam, ref typ, ref bod} => {
                let nam = rename(nam, vars);
                code.extend_from_slice(b"((");
                code.append(&mut nam.clone());
                code.extend_from_slice(b" : ");
                vars.push(nam.to_vec());
                build(code, &typ, vars);
                code.extend_from_slice(b") => ");
                build(code, &bod, vars);
                code.extend_from_slice(b")");
                vars.pop();
            },
            &All{ref nam, ref typ, ref bod} => {
                let nam = rename(nam, vars);
                code.extend_from_slice(b"((");
                code.append(&mut nam.clone());
                code.extend_from_slice(b" : ");
                vars.push(nam.to_vec());
                build(code, &typ, vars);
                code.extend_from_slice(b") -> ");
                build(code, &bod, vars);
                vars.pop();
                code.extend_from_slice(b")");
            },
            &Var{idx} => {
                let new_idx = vars.len() - idx as usize - 1;
                let mut quo = b"X".to_vec();
                quo.append(&mut idx.to_string().into_bytes());
                let nam = if new_idx < vars.len() { &vars[new_idx] } else { &quo };
                code.append(&mut nam.clone());
            },
            &Ref{ref nam} => {
                code.append(&mut nam.clone());
            },
            &Idt{ref nam, ref typ, ref ctr} => {
                let nam = rename(nam, vars);
                code.extend_from_slice(b"data ");
                code.append(&mut nam.clone());
                code.extend_from_slice(b" : ");
                vars.push(nam.to_vec());
                build(code, &typ, vars);
                for (nam,typ) in ctr {
                    code.extend_from_slice(b" ");
                    code.extend_from_slice(b"|");
                    code.append(&mut nam.clone());
                    code.extend_from_slice(b" ");
                    build(code, &typ, vars);
                }
                vars.pop();
            },
            &Ctr{ref nam, ref idt} => {
                build(code, &idt, vars);
                code.extend_from_slice(b".");
                code.append(&mut nam.clone());
            },
            &Cas{ref idt, ref val, ref ret, ref cas} => {
                code.extend_from_slice(b"match ");
                build(code, &idt, vars);
                code.extend_from_slice(b" ");
                build(code, &val, vars);
                code.extend_from_slice(b" : ");
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
                code.extend_from_slice(b"Type");
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
