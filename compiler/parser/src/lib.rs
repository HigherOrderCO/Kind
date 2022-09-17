use hvm::parser;
use std::collections::HashMap;

use kind2_book::name::{Ident, Qualified};
use kind2_book::span::{ByteOffset, Span};
use kind2_book::term::Term;
use kind2_book::{Argument, Book, Entry, Rule};

pub mod term;

use crate::term::*;

pub fn parse_rule(
    state: parser::State,
    name: String,
    init: ByteOffset,
) -> parser::Answer<Box<Rule>> {
    let (state, pats) = parser::until(parser::text_parser("="), Box::new(parse_term), state)?;
    let (state, last) = get_last_index(state)?;
    let orig = Span::new_off(init, last);
    let (state, body) = parse_apps(state)?;
    return Ok((
        state,
        Box::new(Rule {
            orig,
            name: Qualified::from_str(&name),
            pats,
            body,
        }),
    ));
}

pub fn parse_entry(state: parser::State) -> parser::Answer<Box<Entry>> {
    let (state, name) = parser::name1(state)?;
    let (state, kdl) = parser::text("#", state)?;
    let (state, kdln) = if kdl {
        let (state, name) = parser::name1(state)?;
        (state, Some(name))
    } else {
        (state, None)
    };

    let (state, args) = parser::until(
        Box::new(|state| {
            let (state, end_0) = parser::dry(Box::new(|state| parser::text(":", state)), state)?;
            let (state, end_1) = parser::dry(Box::new(|state| parser::text("{", state)), state)?;
            return Ok((state, end_0 || end_1));
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
                orig: Span::Generated,
                name: Ident(arg.name.clone()),
            })); // TODO: set orig
        }
        let rules = vec![Box::new(Rule {
            orig: Span::Generated,
            name: Qualified::from_str(&name.clone()),
            pats,
            body,
        })];
        return Ok((
            state,
            Box::new(Entry {
                name: Qualified::from_str(&name),
                kdln,
                args,
                tipo,
                rules,
                orig: Span::Generated,
            }),
        ));
    } else {
        let mut rules = Vec::new();
        let rule_prefix = &format!("{} ", name);
        let mut state = state;
        loop {
            let (loop_state, init) = get_init_index(state)?;
            let (loop_state, cont) = parser::text(&rule_prefix, loop_state)?;
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
            name: Qualified::from_str(&name),
            kdln,
            args,
            tipo,
            rules,
            orig: Span::Generated,
        });
        return Ok((state, entry));
    }
}

pub fn parse_argument(state: parser::State) -> parser::Answer<Box<Argument>> {
    let (state, eras) = parser::text("-", state)?;
    let (state, keep) = parser::text("+", state)?;
    let (state, next) = parser::peek_char(state)?;
    let (open, close) = if next == '(' { ("(", ")") } else { ("<", ">") };
    let (state, _) = parser::consume(open, state)?;
    let (state, name) = parser::name1(state)?;
    let (state, anno) = parser::text(":", state)?;
    let (state, tipo) = if anno {
        parse_apps(state)?
    } else {
        (
            state,
            Box::new(Term::Typ {
                orig: Span::Generated,
            }),
        )
    };
    let (state, _) = parser::consume(close, state)?;
    let hide = open == "<";
    let eras = if hide { !keep } else { eras };
    return Ok((
        state,
        Box::new(Argument {
            hide,
            eras,
            name,
            tipo,
        }),
    ));
}

pub fn parse_book(state: parser::State) -> parser::Answer<Box<Book>> {
    let (state, entry_vec) = parser::until(Box::new(parser::done), Box::new(parse_entry), state)?;
    let mut names = Vec::new();
    let mut entrs = HashMap::new();
    for entry in entry_vec {
        if !entrs.contains_key(&entry.name) {
            names.push(entry.name.to_string().clone());
            entrs.insert(entry.name.clone(), entry);
        } else {
            println!(
                "\x1b[33mwarning\x1b[0m: ignored redefinition of '{}'.",
                entry.name
            );
        }
    }
    return Ok((
        state,
        Box::new(Book {
            holes: 0,
            names,
            entrs,
        }),
    ));
}

pub fn read_book(code: &str) -> Result<Box<Book>, String> {
    parser::read(Box::new(parse_book), code)
}
