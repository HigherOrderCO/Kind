pub mod new_type;
pub mod term;
pub mod utils;
pub mod name;

use crate::book::name::Ident;
use crate::book::span::{ByteOffset, Span};
use crate::book::term::Term;
use crate::book::{Argument, Attribute, Book, Entry, Rule};
use crate::parser::term::{parse_apps, parse_term};
use crate::parser::utils::{get_init_index, get_last_index};

use hvm::parser;
use std::collections::HashMap;

use self::name::parse_path_str;

pub fn parse_use<'a>(state: parser::State<'a>, map: &mut HashMap<String, String>) -> Result<parser::State<'a>, String> {
    let (state, val) = parser::name1(state)?;
    let (state, _) = parser::consume("as", state)?;
    let (state, name) = parser::name1(state)?;
    map.insert(name, val);
    Ok(state)
}

pub fn parse_uses<'a>(state: parser::State<'a>, map: &mut HashMap<String, String>) ->  Result<parser::State<'a>, String> {
    let mut vec = Vec::new();
    let mut state = state;
    loop {
        let (state_i, attr) = parser::text("use ", state)?;
        if attr {
            let state_i = parse_use(state_i, map)?;
            vec.push(attr);
            state = state_i;
        } else {
            return Ok(state);
        }
    }
}

pub fn parse_rule(state: parser::State, name: String, init: ByteOffset) -> parser::Answer<Box<Rule>> {
    let (state, pats) = parser::until(parser::text_parser("="), Box::new(parse_term), state)?;
    let (state, last) = get_last_index(state)?;
    let orig = Span::new_off(init, last);
    let (state, body) = parse_apps(state)?;
    Ok((
        state,
        Box::new(Rule {
            orig,
            name: Ident(name),
            pats,
            body,
        }),
    ))
}

pub fn parse_attr(state: parser::State) -> parser::Answer<Attribute> {
    let (state, init) = get_init_index(state)?;
    let (state, name) = parser::name1(state)?;
    let (state, has_value) = parser::text("=", state)?;
    let (state, value) = if has_value {
        let (state, name) = parser::name1(state)?;
        (state, Some(Ident(name)))
    } else {
        (state, None)
    };
    let (state, last) = get_last_index(state)?;
    let orig = Span::new_off(init, last);
    Ok((state, Attribute { name: Ident(name), value, orig }))
}

pub fn parse_attrs(state: parser::State) -> parser::Answer<Vec<Attribute>> {
    let mut vec = Vec::new();
    let mut state = state;
    loop {
        let (state_i, attr) = parser::text("#", state)?;
        if attr {
            let (state_i, attr) = parse_attr(state_i)?;
            vec.push(attr);
            state = state_i;
        } else {
            return Ok((state, vec));
        }
    }
}

pub fn parse_entry(state: parser::State) -> parser::Answer<Box<Entry>> {
    let (state, attrs) = parse_attrs(state)?;
    let (state, init) = get_init_index(state)?;
    let (state, name) = parse_path_str(state)?;
    let (state, last) = get_last_index(state)?;
    let name_orig = Span::new_off(init, last);

    let (state, args) = parser::until(
        Box::new(|state| {
            let (state, end_0) = parser::dry(Box::new(|state| parser::text(":", state)), state)?;
            let (state, end_1) = parser::dry(Box::new(|state| parser::text("{", state)), state)?;
            Ok((state, end_0 || end_1))
        }),
        Box::new(parse_argument),
        state,
    )?;

    let (state, next) = parser::peek_char(state)?;
    let (state, tipo) = if next == ':' {
        let (state, _) = parser::consume(":", state)?;
        parse_apps(state)?
    } else {
        (
            state,
            Box::new(Term::Hol {
                orig: Span::Generated,
                numb: u64::MAX,
            }),
        ) // TODO: set orig
    };
    let (state, head) = parser::peek_char(state)?;
    if head == '{' {
        let (state, _) = parser::consume("{", state)?;
        let (state, body) = parse_apps(state)?;
        let (state, _) = parser::consume("}", state)?;
        let mut pats = vec![];
        for arg in &args {
            pats.push(Box::new(Term::Var {
                orig: arg.orig,
                name: arg.name.clone(),
            }));
            // TODO: set orig
        }
        let rules = vec![Box::new(Rule {
            orig: name_orig,
            name: Ident(name.clone()),
            pats,
            body,
        })];
        Ok((
            state,
            Box::new(Entry {
                name: Ident(name),
                args,
                tipo,
                rules,
                orig: name_orig,
                attrs,
            }),
        ))
    } else {
        let mut rules = Vec::new();
        let rule_prefix = &format!("{} ", name);
        let mut state = state;
        loop {
            let (loop_state, init) = get_init_index(state)?;
            let (loop_state, cont) = parser::text(rule_prefix, loop_state)?;
            if cont {
                let (loop_state, rule) = parse_rule(loop_state, name.clone(), init)?;
                rules.push(rule);
                state = loop_state;
            } else {
                state = loop_state;
                break;
            }
        }
        let entry = Box::new(Entry {
            name: Ident(name),
            args,
            tipo,
            rules,
            orig: name_orig,
            attrs,
        });
        Ok((state, entry))
    }
}

pub fn parse_argument(state: parser::State) -> parser::Answer<Box<Argument>> {
    let (state, init) = get_init_index(state)?;
    let (state, eras) = parser::text("-", state)?;
    let (state, keep) = parser::text("+", state)?;
    let (state, next) = parser::peek_char(state)?;
    let (open, close) = if next == '(' { ("(", ")") } else { ("<", ">") };
    let (state, _) = parser::consume(open, state)?;
    let (state, name) = parser::name1(state)?;
    let (state, last) = get_last_index(state)?;
    let (state, anno) = parser::text(":", state)?;
    let (state, tipo) = if anno {
        parse_apps(state)?
    } else {
        (state, Box::new(Term::Typ { orig: Span::new_off(init, last) }))
    };
    let (state, _) = parser::consume(close, state)?;
    let hide = open == "<";
    let eras = if hide { !keep } else { eras };
    let (state, last) = get_last_index(state)?;
    let orig = Span::new_off(init, last);
    Ok((
        state,
        Box::new(Argument {
            hide,
            orig,
            eras,
            name: Ident(name),
            tipo,
        }),
    ))
}

pub fn parse_book(state: parser::State) -> parser::Answer<(Box<Book>, HashMap<String, String>)> {
    let mut map = HashMap::new();
    let state = parse_uses(state, &mut map)?;
    let (state, entry_vec) = parser::until(Box::new(parser::done), Box::new(parse_entry), state)?;
    let mut names = Vec::new();
    let mut entrs = HashMap::new();
    for entry in entry_vec {
        if !entrs.contains_key(&entry.name) {
            names.push(entry.name.clone());
            entrs.insert(entry.name.clone(), entry);
        } else {
            println!("\x1b[33mwarning\x1b[0m: ignored redefinition of '{}'.", entry.name);
        }
    }
    Ok((state, (Box::new(Book { holes: 0, names, entrs }), map)))
}

pub fn read_book(code: &str) -> Result<(Box<Book>, HashMap<String, String>), String> {
    parser::read(Box::new(parse_book), code)
}
