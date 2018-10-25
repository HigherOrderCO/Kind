use term::*;
use term::Vars;
use term::Defs;
use term::Term::*;
use term::TypeError::*;

use std;
use std::string::*;
use std::str::*;
use std::collections::*;

// Cursor focusing a location of a parsing code.
pub struct Cursor {
    index  : usize,
    line   : usize,
    column : usize
}

// Advances the cursor 1 character forward.
pub fn advance_char(cursor : &mut Cursor, n : usize) {
    cursor.index += n;
    cursor.column += n;
}

// Advances the cursor 1 line down.
pub fn advance_line(cursor : &mut Cursor) {
    cursor.index += 1;
    cursor.line += 1;
    cursor.column = 0;
}

// Returns true if a valid name character.
pub fn is_name_char(chr : u8) -> bool {
    chr >= b'a' && chr <= b'z' ||
    chr >= b'A' && chr <= b'Z' ||
    chr >= b'0' && chr <= b'9' ||
    chr == b'_' ||
    chr == b'-' ||
    chr == b'\''
}

// Skips spaces, newlines, etc.
pub fn skip_whites(cursor : &mut Cursor, code : &[u8]) {
    while cursor.index < code.len() {
        if code[cursor.index] == b'\n' {
            advance_line(cursor);
        } else if code[cursor.index] == b' ' {
            advance_char(cursor, 1);
        } else if match_exact(cursor, code, b"{-") {
            while cursor.index < code.len() - 1 && !match_exact(cursor, code, b"-}") {
                advance_char(cursor, 1);
            }
            advance_char(cursor, 2);
        } else if match_exact(cursor, code, b"--") {
            while cursor.index < code.len() && !match_exact(cursor, code, b"\n") {
                advance_char(cursor, 1);
            }
            advance_line(cursor);
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
    if name.len() == 0 {
        Err(format!("Syntax error (at line {}, col {}): expected a name, found `{}`.",
            cursor.line,
            cursor.column,
            if cursor.index < code.len() {
                String::from_utf8_lossy(&[code[cursor.index]]).to_string()
            } else {
                "EOF".to_string()
            }))
    } else {
        Ok(name)
    }
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
    
// Parses a term and returns it, or an error message.
pub fn parse_term
    ( cursor : &mut Cursor
    , code   : &[u8]
    , vars   : &mut Vars
    , defs   : &mut Defs)
    -> Result<Term, String> {

    prepare_to_parse(cursor, code)?;

    let parsed : Term;
    let appliable : bool;

    // Parenthesis
    if match_exact(cursor, code, b"((") || match_exact(cursor, code, b"(case ") || match_exact(cursor, code, b"(data ") {
        advance_char(cursor, 1);
        parsed = parse_term(cursor, code, vars, defs)?;
        appliable = true;
        parse_one_of(cursor, code, &[b")"])?;

    // Abstraction
    } else if match_exact(cursor, code, b"(") {
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
        let mut abs = parse_term(cursor, code, vars, defs)?;

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
        if match_exact(cursor, code, b")") {
            parsed = idt;
        } else {
            parsed = parse_term(cursor, code, vars, defs)?;
        }
        appliable = false;

    // Pattern-matching
    } else if match_exact(cursor, code, b"case") {
        // case Name(a, b) value : (a, b) => MOT | ctor (f0, f1) CASE_BOD
        advance_char(cursor, 4);

        // Matched value
        let val = parse_term(cursor, code, vars, defs)?;
        skip_whites(cursor, code);

        // Case expressions
        let mut cas : Vec<(Vec<u8>, Vars, Box<Term>)> = Vec::new();
        while cursor.index < code.len() && match_exact(cursor, code, b"|") {
            advance_char(cursor, 1);

            // Case name
            let cas_nam = parse_name(cursor, code)?;

            // Fold arg
            vars.push(b"fold".to_vec());

            // Case args
            let mut cas_arg = Vec::new();
            prepare_to_parse(cursor, code)?;
            if match_exact(cursor, code, b"(") {
                advance_char(cursor, 1);
                while !match_exact(cursor, code, b")") {
                    let arg = parse_name(cursor, code)?;
                    vars.push(arg.clone());
                    cas_arg.push(arg);
                    prepare_to_parse(cursor, code)?;
                    if code[cursor.index] == b',' {
                        advance_char(cursor, 1);
                        prepare_to_parse(cursor, code)?;
                    }
                }
                advance_char(cursor, 1);
            }

            // Case arrow
            parse_one_of(cursor, code, &[b"=>"])?;

            // Case body
            let cas_bod = parse_term(cursor, code, vars, defs)?;
            let cas_bod = Box::new(cas_bod);

            // Finish
            for _ in 0..cas_arg.len() {
                vars.pop();
            }
            vars.pop();
            cas.push((cas_nam, cas_arg, cas_bod));
            skip_whites(cursor, code);
        }

        // Return type
        parse_one_of(cursor, code, &[b":"])?;
        vars.push(b"self".to_vec());
        let mut ret_arg = Vec::new();
        prepare_to_parse(cursor, code)?;
        if match_exact(cursor, code, b"(") {
            advance_char(cursor, 1);
            while !match_exact(cursor, code, b")") {
                let arg = parse_name(cursor, code)?;
                vars.push(arg.clone());
                ret_arg.push(arg);
                prepare_to_parse(cursor, code)?;
                if code[cursor.index] == b',' {
                    advance_char(cursor, 1);
                    prepare_to_parse(cursor, code)?;
                }
            }
            advance_char(cursor, 1);
            parse_one_of(cursor, code, &[b"=>"])?;
        }
        let ret_bod = parse_term(cursor, code, vars, defs)?;
        for _ in 0..ret_arg.len() {
            vars.pop();
        }
        vars.pop();

        // Finish
        let val = Box::new(val);
        let ret = (ret_arg, Box::new(ret_bod));
        parsed = Cas{val, cas, ret};
        appliable = false;

    } else if match_exact(cursor, code, b"copy") {
        advance_char(cursor, 4);
        let val = parse_term(cursor, code, vars, defs)?;
        parse_one_of(cursor, code, &[b"as"])?;
        let nam_a = parse_name(cursor, code)?;
        vars.push(nam_a.clone());
        parse_one_of(cursor, code, &[b","])?;
        let nam_b = parse_name(cursor, code)?;
        vars.push(nam_b.clone());
        let nam = (nam_a, nam_b);
        parse_one_of(cursor, code, &[b"in"])?;
        let bod = parse_term(cursor, code, vars, defs)?;
        vars.pop();
        vars.pop();
        let val = Box::new(val);
        let bod = Box::new(bod);
        parsed = Cpy{nam, val, bod};
        appliable = false;

    // Definition
    } else if match_exact(cursor, code, b"let") {
        advance_char(cursor, 3);
        let nam = parse_name(cursor, code)?;
        let val = parse_term(cursor, code, vars, defs)?;
        defs.insert(nam.to_vec(), val);
        let bod = parse_term(cursor, code, vars, defs)?;
        parsed = bod;
        appliable = false;

    // Variable
    } else {
        let nam = parse_name(cursor, code)?;
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
    if appliable {
        let mut app = parsed;
        while match_exact(cursor, code, b"(") {
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
            // Calls term on arguments
            for i in 0..args.len() {
                let fun = Box::new(app);
                let arg = Box::new(args[i].clone());
                app = App{fun, arg}
            }
        }
        Ok(app)
    } else {
        Ok(parsed)
    }
}

// Converts an ASCII source-code to a Formality term.
pub fn term_from_ascii_slice<'a>(code : &'a [u8]) -> Result<(Term, Defs), String> {
    let mut cursor = Cursor{index: 0, line: 0, column: 0};
    let mut vars = Vec::new();
    let mut defs = HashMap::new();
    let term = parse_term(&mut cursor, code, &mut vars, &mut defs)?;
    Ok((term, defs))
}

// Convenience
pub fn term_from_ascii(code : Vec<u8>) -> Result<(Term, Defs), String> {
    term_from_ascii_slice(&code)
}

// Convenience
pub fn term_from_string_slice(code : &str) -> Result<(Term, Defs), String> {
    term_from_ascii_slice(code.as_bytes())
}

// Convenience
pub fn term_from_string(code : String) -> Result<(Term, Defs), String> {
    term_from_string_slice(&code)
}

// Converts a Formality term back to an ASCII source-code.
pub fn term_to_ascii(term : &Term, vars : &mut Vars, short : bool) -> Vec<u8> {
    fn build(code : &mut Vec<u8>, term : &Term, vars : &mut Vars, short : bool) {
        match term {
            &App{ref fun, ref arg} => {
                build(code, &fun, vars, short);
                code.extend_from_slice(b"(");
                build(code, &arg, vars, short);
                code.extend_from_slice(b")");
            },
            &Lam{ref nam, ref typ, ref bod} => {
                let nam = rename(nam, vars);
                code.extend_from_slice(b"((");
                code.append(&mut nam.clone());
                code.extend_from_slice(b" : ");
                vars.push(nam.to_vec());
                build(code, &typ, vars, short);
                code.extend_from_slice(b") => ");
                build(code, &bod, vars, short);
                code.extend_from_slice(b")");
                vars.pop();
            },
            &All{ref nam, ref typ, ref bod} => {
                let nam = rename(nam, vars);
                code.extend_from_slice(b"((");
                code.append(&mut nam.clone());
                code.extend_from_slice(b" : ");
                vars.push(nam.to_vec());
                build(code, &typ, vars, short);
                code.extend_from_slice(b") -> ");
                build(code, &bod, vars, short);
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
                if short {
                    code.append(&mut nam.clone());
                } else {
                    code.extend_from_slice(b"(data ");
                    code.append(&mut nam.clone());
                    code.extend_from_slice(b" : ");
                    vars.push(nam.to_vec());
                    build(code, &typ, vars, short);
                    for (nam,typ) in ctr {
                        code.extend_from_slice(b" ");
                        code.extend_from_slice(b"| ");
                        code.append(&mut nam.clone());
                        code.extend_from_slice(b" : ");
                        build(code, &typ, vars, short);
                    }
                    vars.pop();
                    code.extend_from_slice(b")");
                }
            },
            &Ctr{ref nam, ref idt} => {
                build(code, &idt, vars, short);
                code.extend_from_slice(b".");
                code.append(&mut nam.clone());
            },
            &Cas{ref val, ref cas, ref ret} => {
                code.extend_from_slice(b"(case ");
                build(code, &val, vars, short);
                for (nam, arg, bod) in cas {
                    code.extend_from_slice(b" ");
                    code.extend_from_slice(b"| ");
                    code.append(&mut nam.clone());
                    vars.push(b"fold".to_vec());
                    code.extend_from_slice(b"(");
                    for i in 0..arg.len() {
                        let mut arg_nam = rename(&arg[i], vars);
                        code.append(&mut arg_nam.clone());
                        vars.push(arg_nam.to_vec());
                        if i < arg.len() - 1 {
                            code.extend_from_slice(b",");
                        }
                    }
                    code.extend_from_slice(b")");
                    code.extend_from_slice(b" => ");
                    build(code, &bod, vars, short);
                    for _ in 0..arg.len() {
                        vars.pop();
                    }
                    vars.pop();
                }
                code.extend_from_slice(b" : ");
                vars.push(b"self".to_vec());
                code.extend_from_slice(b"(");
                for i in 0..ret.0.len() {
                    let mut ret_arg_nam = rename(&ret.0[i], vars);
                    code.append(&mut ret_arg_nam.clone());
                    vars.push(ret_arg_nam.to_vec());
                    if i < ret.0.len() - 1 {
                        code.extend_from_slice(b",");
                    }
                }
                code.extend_from_slice(b") => ");
                build(code, &ret.1, vars, short);
                code.extend_from_slice(b")");
                for _ in 0..ret.0.len() {
                    vars.pop();
                }
                vars.pop();
            },
            &Cpy{ref nam, ref val, ref bod} => {
                code.extend_from_slice(b"copy ");
                build(code, &val, vars, short);
                code.extend_from_slice(b" as ");
                code.append(&mut nam.0.clone());
                vars.push(nam.0.to_vec());
                code.extend_from_slice(b", ");
                code.append(&mut nam.1.clone());
                vars.push(nam.1.to_vec());
                code.extend_from_slice(b" in ");
                build(code, &bod, vars, short);
                vars.pop();
                vars.pop();
            },
            &Set => {
                code.extend_from_slice(b"Type");
            }
        }
    }
    let mut code = Vec::new();
    build(&mut code, term, vars, short);
    return code;
}

pub fn ascii_to_string(ascii : Vec<u8>) -> String {
    match String::from_utf8(ascii) {
        Ok(s) => s,
        Err(_) => String::from("Stringified code not a valid UTF8 string. This is a ironically a Formality bug.")
    }
}

// Convenience.
pub fn term_to_string(term : &Term, vars : &mut Vars, short : bool) -> String {
    ascii_to_string(term_to_ascii(term, vars, short))
}

// Converts a type error into a readable ASCII error message.
pub fn type_error_to_ascii(type_error : &TypeError, short : bool) -> Vec<u8> {
    let mut message = Vec::new();
    match type_error {
        AppTypeMismatch{ref expect, ref actual, ref argval, ref term, ref vars} => {
            message.extend_from_slice(b"Type mismatch.\n");
            message.extend_from_slice(b"- This term  : ");
            message.append(&mut term_to_ascii(argval, &mut vars.clone(), short));
            message.extend_from_slice(b"\n");
            message.extend_from_slice(b"- Has type   : ");
            message.append(&mut term_to_ascii(expect, &mut vars.clone(), short));
            message.extend_from_slice(b"\n");
            message.extend_from_slice(b"- Instead of : ");
            message.append(&mut term_to_ascii(actual, &mut vars.clone(), short));
            message.extend_from_slice(b"\n");
            message.extend_from_slice(b"- On call    : ");
            message.append(&mut term_to_ascii(term, &mut vars.clone(), short));
            message.extend_from_slice(b"\n");
        },
        AppNotAll{ref funval, ref funtyp, ref term, ref vars} => {
            message.extend_from_slice(b"Not a function.\n");
            message.extend_from_slice(b"- This term : ");
            message.append(&mut term_to_ascii(funval, &mut vars.clone(), short));
            message.extend_from_slice(b"\n");
            message.extend_from_slice(b"- Has type  : ");
            message.append(&mut term_to_ascii(funtyp, &mut vars.clone(), short));
            message.extend_from_slice(b"\n");
            message.extend_from_slice(b"- On call   : ");
            message.append(&mut term_to_ascii(term, &mut vars.clone(), short));
            message.extend_from_slice(b"\n");
            message.extend_from_slice(b"* It should have a function type (i.e., `(a : A) -> B`) instead.\n");
        },
        ForallNotAType{ref typtyp, ref bodtyp, ref term, ref vars} => {
            message.extend_from_slice(b"Invalid arrow.\n");
            message.extend_from_slice(b"- Left type  : ");
            message.append(&mut term_to_ascii(typtyp, &mut vars.clone(), short));
            message.extend_from_slice(b"\n");
            message.extend_from_slice(b"- Right type : ");
            message.append(&mut term_to_ascii(bodtyp, &mut vars.clone(), short));
            message.extend_from_slice(b"\n");
            message.extend_from_slice(b"- On forall : ");
            message.append(&mut term_to_ascii(term, &mut vars.clone(), short));
            message.extend_from_slice(b"\n");
            message.extend_from_slice(b"* To create an arrow, you need both sides to have type `Type`.\n");
        },
        Unbound{ref name, ref vars} => {
            message.extend_from_slice(b"Undefined variable: `");
            message.append(&mut name.clone());
            message.extend_from_slice(b"`.\n");
            message.extend_from_slice(b"- Vars in scope: ");
            for i in 0..vars.len() {
                let mut var : Vec<u8> = vars[i].clone();
                message.extend_from_slice(b"`");
                message.append(&mut var);
                message.extend_from_slice(b"`");
                if i < vars.len() - 1 {
                    message.extend_from_slice(b", ");
                }
            }
            message.extend_from_slice(b".");
        },
        CtrNotIDT{ref actual, ref term, ref vars} => {
            message.extend_from_slice(b"Not a datatype.");
            message.extend_from_slice(b"- Expected : (a datatype).\n");
            message.extend_from_slice(b"- Found    : "); 
            message.append(&mut term_to_ascii(actual, &mut vars.clone(), short));
            message.extend_from_slice(b"\n");
            message.extend_from_slice(b"- On term  : ");
            message.append(&mut term_to_ascii(term, &mut vars.clone(), short));
            message.extend_from_slice(b"\n");
            message.extend_from_slice(b"* You attempted to access a constructor of something that isn't a datatype.");
        },
        CtrNotFound{ref name, ref term, ref vars} => {
            message.extend_from_slice(b"Constructor not found.\n");
            message.extend_from_slice(b"- Constructor name : ");
            message.append(&mut name.clone());
            message.extend_from_slice(b"\n");
            message.extend_from_slice(b"- On term : ");
            message.append(&mut term_to_ascii(term, &mut vars.clone(), short));
            message.extend_from_slice(b"\n");
            message.extend_from_slice(b"* That isn't a constructor of the corresponding datatype.\n");
        },
        MatchNotIDT{ref actual, ref term, ref vars} => {
            message.extend_from_slice(b"Not a datatype.");
            message.extend_from_slice(b"- Expected : (a datatype).\n");
            message.extend_from_slice(b"- Found    : "); 
            message.append(&mut term_to_ascii(actual, &mut vars.clone(), short));
            message.extend_from_slice(b"\n");
            message.extend_from_slice(b"- On match : ");
            message.append(&mut term_to_ascii(term, &mut vars.clone(), short));
            message.extend_from_slice(b"\n");
            message.extend_from_slice(b"* You attempted to pattern match a value that isn't member of a datatype.");
        },
        WrongMatchIndexCount{ref expect, ref actual, ref term, ref vars} => {
            message.extend_from_slice(b"Incorrect match index count.");
            message.extend_from_slice(b"- Expected : ");
            message.append(&mut expect.to_string().into_bytes());
            message.extend_from_slice(b"\n");
            message.extend_from_slice(b"- Found    : ");
            message.append(&mut actual.to_string().into_bytes());
            message.extend_from_slice(b"\n");
            message.extend_from_slice(b"- On match : ");
            message.append(&mut term_to_ascii(term, &mut vars.clone(), short));
            message.extend_from_slice(b"\n");
            message.extend_from_slice(b"* The matched value isn't a concrete datatype.\n");
        },
        WrongMatchReturnArity{ref expect, ref actual, ref term, ref vars} => {
            message.extend_from_slice(b"Incorrect match return arity.\n");
            message.extend_from_slice(b"- Expected : ");
            message.append(&mut expect.to_string().into_bytes());
            message.extend_from_slice(b"\n");
            message.extend_from_slice(b"- Found    : ");
            message.append(&mut actual.to_string().into_bytes());
            message.extend_from_slice(b"\n");
            message.extend_from_slice(b"- On match : ");
            message.append(&mut term_to_ascii(term, &mut vars.clone(), short));
            message.extend_from_slice(b"\n");
            message.extend_from_slice(b"* The specified return type of pattern match has the wrong number of arguments.\n");
        },
        WrongMatchCaseCount{ref expect, ref actual, ref term, ref vars} => {
            message.extend_from_slice(b"Incorrect case count.\n");
            message.extend_from_slice(b"- Expected : ");
            message.append(&mut expect.to_string().into_bytes());
            message.extend_from_slice(b"\n");
            message.extend_from_slice(b"- Found    : ");
            message.append(&mut actual.to_string().into_bytes());
            message.extend_from_slice(b"\n");
            message.extend_from_slice(b"- On match : ");
            message.append(&mut term_to_ascii(term, &mut vars.clone(), short));
            message.extend_from_slice(b"\n");
            message.extend_from_slice(b"* The number of cases should be equal to the number of constructors.\n");
        },
        WrongCaseName{ref expect, ref actual, ref term, ref vars} => {
            message.extend_from_slice(b"Incorrect case name.\n");
            message.extend_from_slice(b"- Expected : ");
            message.append(&mut expect.clone());
            message.extend_from_slice(b"\n");
            message.extend_from_slice(b"- Found    : ");
            message.append(&mut actual.clone());
            message.extend_from_slice(b"\n");
            message.extend_from_slice(b"- On match : ");
            message.append(&mut term_to_ascii(term, &mut vars.clone(), short));
            message.extend_from_slice(b"\n");
        },
        WrongCaseArity{ref expect, ref actual, ref name, ref term, ref vars} => {
            message.extend_from_slice(b"Incorrect case arity.\n");
            message.extend_from_slice(b"- Expected : ");
            message.append(&mut expect.to_string().into_bytes());
            message.extend_from_slice(b"\n");
            message.extend_from_slice(b"- Found    : ");
            message.append(&mut actual.to_string().into_bytes());
            message.extend_from_slice(b"\n");
            message.extend_from_slice(b"- On match : ");
            message.append(&mut term_to_ascii(term, &mut vars.clone(), short));
            message.extend_from_slice(b"\n");
            message.extend_from_slice(b"* The case `");
            message.append(&mut name.clone());
            message.extend_from_slice(b"` of this match has the incorrect number of fields.");
        },
        WrongCaseType{ref expect, ref actual, ref name, ref term, ref vars} => {
            message.extend_from_slice(b"Incorrect case type.\n");
            message.extend_from_slice(b"- Expected : ");
            message.append(&mut term_to_ascii(expect, &mut vars.clone(), short));
            message.extend_from_slice(b"\n");
            message.extend_from_slice(b"- Found    : ");
            message.append(&mut term_to_ascii(actual, &mut vars.clone(), short));
            message.extend_from_slice(b"\n");
            message.extend_from_slice(b"- On match : ");
            message.append(&mut term_to_ascii(term, &mut vars.clone(), short));
            message.extend_from_slice(b"\n");
            message.extend_from_slice(b"* The case `");
            message.append(&mut name.clone());
            message.extend_from_slice(b"` of this match has the incorrect type.");
        }
    }
    return message;
}

// Convenience.
pub fn type_error_to_string(type_error : &TypeError, short : bool) -> String {
    ascii_to_string(type_error_to_ascii(type_error, short))
}

pub fn infer_with_string_error(term : &Term, defs : &Defs, checked : bool, short : bool) -> Result<Term, String> {
    match infer(term, defs, checked) {
        Ok(term) => Ok(term),
        Err(err) => Err(type_error_to_string(&err, short))
    }
}

// Display trait for Terms.
impl std::fmt::Display for Term {
    fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
        write!(f, "{}", String::from_utf8_lossy(&term_to_ascii(&self, &mut Vec::new(), true)))
    }
}
