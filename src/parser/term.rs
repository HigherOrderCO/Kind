use crate::book::name::Ident;
use crate::book::span::{ByteOffset, Span};
use crate::book::term::{Operator, Term};
use crate::parser::utils::{get_init_index, get_last_index, is_ctr_head};

use hvm::parser;
use hvm::parser::{Answer, State};

use super::name::parse_path_str;

type TermPrefix = Box<dyn Fn(ByteOffset, Box<Term>) -> Box<Term>>;

type TermComplete = Box<dyn Fn(&str) -> Box<Term>>;

pub fn parse_num(state: State) -> Answer<Option<Box<Term>>> {
    parser::guard(
        Box::new(|state| {
            let (state, head) = parser::get_char(state)?;
            Ok((state, head.is_ascii_digit()))
        }),
        Box::new(|state| {
            let (state, init) = get_init_index(state)?;
            let (state, name) = parse_path_str(state)?;
            let (state, last) = get_last_index(state)?;
            let orig = Span::new_off(init, last);

            let parts = name.split("u120").collect::<Vec<_>>();
            if parts.len() == 2 && parts[1] == "" {
                if let Ok(num120) = parts[0].parse::<u128>() {
                    let term = Box::new(Term::Ctr {
                        orig,
                        name: Ident::new_path("U120", "new"),
                        args: vec![
                            Box::new(Term::Num { orig, numb: (num120 >> 60) as u64 }),
                            Box::new(Term::Num { orig, numb: (num120 & 0xFFFFFFFFFFFFFFF) as u64 })],
                    });
                    Ok((state, term))
                } else {
                    parser::expected("U120 number", name.len(), state)
                }
            } else {
                if let Ok(numb) = name.parse::<u64>() {
                    Ok((state, Box::new(Term::Num { orig, numb })))
                } else {
                    parser::expected("U60 number", name.len(), state)
                }    
            }
        }),
        state,
    )
}

pub fn parse_var(state: State) -> Answer<Option<Box<Term>>> {
    parser::guard(
        Box::new(|state| Ok((state, true))),
        Box::new(|state| {
            let (state, init) = get_init_index(state)?;
            let (state, name) = parse_path_str(state)?;
            let (state, last) = get_last_index(state)?;
            let orig = Span::new_off(init, last);
            Ok((state, Box::new(Term::Var { orig, name: Ident(name) })))
        }),
        state,
    )
}

pub fn parse_hol(state: State) -> Answer<Option<Box<Term>>> {
    parser::guard(
        parser::text_parser("_"),
        Box::new(|state| {
            let (state, init) = get_init_index(state)?;
            let (state, _) = parser::consume("_", state)?;
            let (state, last) = get_last_index(state)?;
            let orig = Span::new_off(init, last);
            Ok((state, Box::new(Term::Hol { orig, numb: 0 })))
        }),
        state,
    )
}

pub fn parse_hlp(state: State) -> Answer<Option<Box<Term>>> {
    return parser::guard(
        parser::text_parser("?"),
        Box::new(|state| {
            let (state, init) = get_init_index(state)?;
            let (state, _) = parser::consume("?", state)?;
            let (state, _) = parser::name_here(state)?;
            let (state, last) = get_last_index(state)?;
            let orig = Span::new_off(init, last);
            Ok((state, Box::new(Term::Hlp { orig })))
        }),
        state,
    );
}

pub fn parse_str(state: State) -> Answer<Option<Box<Term>>> {
    parser::guard(
        Box::new(|state| {
            let (state, head) = parser::get_char(state)?;
            Ok((state, head == '"' || head == '`'))
        }),
        Box::new(|state| {
            let (state, init) = get_init_index(state)?;
            let delim = parser::head(state).unwrap_or('\0');
            let state = parser::tail(state);
            let mut chars: Vec<char> = Vec::new();
            let mut state = state;

            loop {
                if let Some(next) = parser::head(state) {
                    if next == delim || next == '\0' {
                        state = parser::tail(state);
                        break;
                    } else {
                        chars.push(next);
                        state = parser::tail(state);
                    }
                }
            }

            let (state, last) = get_last_index(state)?;
            let orig = Span::new_off(init, last);
            let empty = Term::Ctr {
                orig,
                name: Ident::new_path("String", "nil"),
                args: Vec::new(),
            };

            let list = Box::new(chars.iter().rfold(empty, |t, h| Term::Ctr {
                orig,
                name: Ident::new_path("String", "cons"),
                args: vec![Box::new(Term::Num { orig, numb: *h as u64 }), Box::new(t)],
            }));

            Ok((state, list))
        }),
        state,
    )
}

pub fn parse_grp(state: State) -> Answer<Option<Box<Term>>> {
    parser::guard(
        parser::text_parser("("),
        Box::new(|state| {
            let (state, _) = parser::consume("(", state)?;
            let (state, term) = parse_apps(state)?;
            let (state, _) = parser::consume(")", state)?;
            Ok((state, term))
        }),
        state,
    )
}

pub fn parse_apps(state: State) -> Answer<Box<Term>> {
    let (state, init) = get_init_index(state)?;
    let (mut state, mut term) = parse_term(state)?;
    loop {
        let loop_state = state;
        let (loop_state, _) = parser::skip_while(loop_state, Box::new(|x| *x == ' '))?;
        let head = parser::head(loop_state).unwrap_or(' ');
        let is_term_initializer // NOTE: this must cover all characters that can start a term
        =  ('a'..='z').contains(&head)
        || ('A'..='Z').contains(&head)
        || ('0'..='9').contains(&head)
        || ['(','[','"','\'','@','?','_','#'].contains(&head);
        if is_term_initializer {
            let (loop_state, argm) = parse_term(loop_state)?;
            let (loop_state, last) = get_last_index(loop_state)?;
            let orig = Span::new_off(init, last);
            term = Box::new(Term::App { orig, func: term, argm });
            state = loop_state;
        } else {
            state = loop_state;
            break;
        }
    }
    Ok((state, term))
}

pub fn parse_ann(state: State) -> Answer<Option<TermPrefix>> {
    return parser::guard(
        parser::text_parser("::"),
        Box::new(|state| {
            let (state, _) = parser::consume("::", state)?;
            let (state, tipo) = parse_apps(state)?;
            let (state, last) = get_last_index(state)?;
            Ok((
                state,
                Box::new(move |init, expr| {
                    let orig = Span::new_off(init, last);
                    let expr = expr;
                    let tipo = tipo.clone();
                    Box::new(Term::Ann { orig, expr, tipo })
                }),
            ))
        }),
        state,
    );
}

pub fn parse_term_prefix(state: State) -> Answer<Box<Term>> {
    // NOTE: all characters that can start a term must be listed on `parse_term_applys()`
    parser::grammar(
        "Term",
        &[
            Box::new(parse_all),  // `(name:`
            Box::new(parse_ctr),  // `(Name`
            Box::new(parse_op2),  // `(+`
            Box::new(parse_grp),  // `(`
            Box::new(parse_sig),  // `[name:`
            Box::new(parse_new),  // `$`
            Box::new(parse_lst),  // `[`
            Box::new(parse_str),  // `"`
            Box::new(parse_chr),  // `'`
            Box::new(parse_lam),  // `@`
            Box::new(parse_let),  // `let `
            Box::new(parse_if),   // `if `
            Box::new(parse_mat),  // `match `
            Box::new(parse_open), // `match `
            Box::new(parse_do),   // `do `
            Box::new(parse_hlp),  // `?`
            Box::new(parse_hol),  // `_`
            Box::new(parse_num),  // `01234` or `01234u120`
            Box::new(parse_var),  // x
            Box::new(|state| Ok((state, None))),
        ],
        state,
    )
}

pub fn parse_term_suffix(state: State) -> Answer<TermPrefix> {
    parser::grammar(
        "Term",
        &[
            Box::new(parse_arr), // `->`
            Box::new(parse_sub), // `# `
            Box::new(parse_ann), // `::`
            Box::new(|state| Ok((state, Some(Box::new(|_, term| term))))),
        ],
        state,
    )
}

pub fn parse_arr(state: State) -> Answer<Option<TermPrefix>> {
    return parser::guard(
        parser::text_parser("->"),
        Box::new(|state| {
            let (state, _) = parser::consume("->", state)?;
            let (state, body) = parse_apps(state)?;
            let (state, last) = get_last_index(state)?;
            Ok((
                state,
                Box::new(move |init, tipo| {
                    let orig = Span::new_off(init, last);
                    let name = "_".to_string();
                    let body = body.clone();
                    Box::new(Term::All {
                        orig,
                        name: Ident(name),
                        tipo,
                        body,
                    })
                }),
            ))
        }),
        state,
    );
}

pub fn parse_sub(state: State) -> Answer<Option<TermPrefix>> {
    return parser::guard(
        parser::text_parser("##"),
        Box::new(|state| {
            let (state, _) = parser::consume("##", state)?;
            let (state, name) = parser::name1(state)?;
            let (state, _) = parser::consume("/", state)?;
            let (state, redx) = parser::name1(state)?;
            if let Ok(redx) = redx.parse::<u64>() {
                let (state, last) = get_last_index(state)?;
                Ok((
                    state,
                    Box::new(move |init, expr| {
                        let orig = Span::new_off(init, last);
                        let name = name.clone();
                        let indx = 0;
                        let expr = expr;
                        Box::new(Term::Sub {
                            orig,
                            name: Ident(name),
                            indx,
                            redx,
                            expr,
                        })
                    }),
                ))
            } else {
                parser::expected("number", name.len(), state)
            }
        }),
        state,
    );
}

pub fn parse_let_st(state: State) -> Answer<Option<TermComplete>> {
    return parser::guard(
        parser::text_parser("let "),
        Box::new(|state| {
            let (state, init) = get_init_index(state)?;
            let (state, _) = parser::consume("let ", state)?;
            let (state, name) = parser::name1(state)?;
            let (state, _) = parser::consume("=", state)?;
            let (state, expr) = parse_apps(state)?;
            let (state, _) = parser::text(";", state)?;
            let (state, body) = parse_term_st(state)?;
            let (state, last) = get_last_index(state)?;
            let orig = Span::new_off(init, last);
            Ok((
                state,
                Box::new(move |monad| {
                    Box::new(Term::Let {
                        orig,
                        name: Ident(name.clone()),
                        expr: expr.clone(),
                        body: body(monad),
                    })
                }),
            ))
        }),
        state,
    );
}

pub fn parse_return_st(state: State) -> Answer<Option<TermComplete>> {
    return parser::guard(
        parser::text_parser("return "),
        Box::new(move |state| {
            let (state, init) = get_init_index(state)?;
            let (state, _) = parser::consume("return ", state)?;
            let (state, term) = parse_apps(state)?;
            let (state, last) = get_last_index(state)?;
            let orig = Span::new_off(init, last);
            Ok((
                state,
                Box::new(move |monad| {
                    Box::new(Term::Ctr {
                        orig,
                        name: Ident::new_path(monad, "pure"),
                        args: vec![term.clone()],
                    })
                }),
            ))
        }),
        state,
    );
}

pub fn parse_ask_named_st(state: State) -> Answer<Option<TermComplete>> {
    parser::guard(
        Box::new(|state| {
            let (state, all0) = parser::text("ask ", state)?;
            let (state, name) = parser::name(state)?;
            let (state, all1) = parser::text("=", state)?;
            Ok((state, all0 && !name.is_empty() && all1))
        }),
        Box::new(move |state| {
            let (state, init) = get_init_index(state)?;
            let (state, _) = parser::consume("ask", state)?;
            let (state, name) = parser::name(state)?;
            let (state, _) = parser::consume("=", state)?;
            let (state, acti) = parse_apps(state)?;
            let (state, body) = parse_term_st(state)?;
            let (state, last) = get_last_index(state)?;
            let orig = Span::new_off(init, last);
            Ok((
                state,
                Box::new(move |monad| {
                    Box::new(Term::Ctr {
                        orig,
                        name: Ident::new_path(monad, "bind"),
                        args: vec![
                            acti.clone(),
                            Box::new(Term::Lam {
                                orig,
                                name: Ident(name.clone()),
                                body: body(monad),
                            }),
                        ],
                    })
                }),
            ))
        }),
        state,
    )
}

pub fn parse_ask_anon_st(state: State) -> Answer<Option<TermComplete>> {
    parser::guard(
        parser::text_parser("ask "),
        Box::new(move |state| {
            let (state, init) = get_init_index(state)?;
            let (state, _) = parser::consume("ask", state)?;
            let (state, acti) = parse_apps(state)?;
            let (state, body) = parse_term_st(state)?;
            let (state, last) = get_last_index(state)?;
            let name = "_".to_string();
            let orig = Span::new_off(init, last);
            Ok((
                state,
                Box::new(move |monad| {
                    Box::new(Term::Ctr {
                        orig,
                        name: Ident::new_path(monad, "bind"),
                        args: vec![
                            acti.clone(),
                            Box::new(Term::Lam {
                                orig,
                                name: Ident(name.clone()),
                                body: body(monad),
                            }),
                        ],
                    })
                }),
            ))
        }),
        state,
    )
}

pub fn parse_term_st(state: State) -> Answer<TermComplete> {
    parser::grammar(
        "Statement",
        &[
            Box::new(parse_return_st),
            Box::new(parse_ask_named_st),
            Box::new(parse_ask_anon_st),
            Box::new(parse_let_st),
            Box::new(|state| {
                let (state, term) = parse_apps(state)?;
                Ok((state, Some(Box::new(move |_| term.clone()))))
            }),
        ],
        state,
    )
}

pub fn parse_term(state: State) -> Answer<Box<Term>> {
    let (state, init) = get_init_index(state)?;
    let (state, prefix) = parse_term_prefix(state)?;
    let (state, suffix) = parse_term_suffix(state)?;
    Ok((state, suffix(init, prefix)))
}

pub fn parse_do(state: State) -> Answer<Option<Box<Term>>> {
    parser::guard(
        parser::text_parser("do "),
        Box::new(|state| {
            let (state, _) = parser::text("do", state)?;
            let (state, name) = parse_path_str(state)?;
            let (state, _) = parser::text("{", state)?;
            let (state, term) = parse_term_st(state)?;
            let (state, _) = parser::text("}", state)?;
            Ok((state, term(&name)))
        }),
        state,
    )
}

pub fn parse_mat(state: State) -> Answer<Option<Box<Term>>> {
    return parser::guard(
        parser::text_parser("match "),
        Box::new(|state| {
            let (state, init) = get_init_index(state)?;
            let (state, _) = parser::consume("match ", state)?;
            let (state, tipo) = parse_path_str(state)?;
            let (state, nm_i) = get_init_index(state)?;
            let (state, name) = parser::name1(state)?;
            let (state, next) = parser::peek_char(state)?;
            let (state, expr) = if next == '=' {
                let (state, _) = parser::consume("=", state)?;
                let (state, expr) = parse_apps(state)?;
                (state, expr)
            } else {
                let (state, nm_j) = get_last_index(state)?;
                (
                    state,
                    Box::new(Term::Var {
                        orig: Span::new_off(nm_i, nm_j),
                        name: Ident(name.clone()),
                    }),
                )
            };
            let (state, _) = parser::consume("{", state)?;
            let (state, cses) = parser::until(
                parser::text_parser("}"),
                Box::new(|state| {
                    let (state, name) = parser::name1(state)?;
                    let (state, _) = parser::consume("=>", state)?;
                    let (state, body) = parse_apps(state)?;
                    let (state, _) = parser::text(";", state)?;
                    Ok((state, (Ident(name), body)))
                }),
                state,
            )?;
            let (state, next) = peek_char_local(state)?;
            let (state, moti) = if next == ':' {
                let (state, _) = parser::consume(":", state)?;
                let (state, moti) = parse_apps(state)?;
                (state, moti)
            } else {
                (state, Box::new(Term::Hol { orig: Span::generated(), numb: 0 }))
            };
            let (state, last) = get_last_index(state)?;
            let orig = Span::new_off(init, last);
            Ok((
                state,
                Box::new(Term::Mat {
                    orig,
                    tipo: Ident(tipo),
                    name: Ident(name),
                    expr,
                    cses,
                    moti,
                }),
            ))
        }),
        state,
    );
}

pub fn parse_open(state: State) -> Answer<Option<Box<Term>>> {
    return parser::guard(
        parser::text_parser("open "),
        Box::new(|state| {
            let (state, init) = get_init_index(state)?;
            let (state, _) = parser::consume("open ", state)?;
            let (state, tipo) = parse_path_str(state)?;
            let (state, nm_i) = get_init_index(state)?;
            let (state, name) = parser::name1(state)?;
            let (state, next) = parser::peek_char(state)?;
            let (state, expr) = if next == '=' {
                let (state, _) = parser::consume("=", state)?;
                let (state, expr) = parse_apps(state)?;
                (state, expr)
            } else {
                let (state, nm_j) = get_last_index(state)?;
                (
                    state,
                    Box::new(Term::Var {
                        orig: Span::new_off(nm_i, nm_j),
                        name: Ident(name.clone()),
                    }),
                )
            };
            let (state, next) = peek_char_local(state)?;
            let (state, moti) = if next == ':' {
                let (state, _) = parser::consume(":", state)?;
                let (state, moti) = parse_apps(state)?;
                (state, moti)
            } else {
                (state, Box::new(Term::Hol { orig: Span::generated(), numb: 0 }))
            };
            let (state, last) = get_last_index(state)?;
            let orig = Span::new_off(init, last);
            let (state, body) = parse_apps(state)?;
            Ok((
                state,
                Box::new(Term::Open {
                    orig,
                    tipo: Ident(tipo),
                    name: Ident(name),
                    expr,
                    moti,
                    body,
                }),
            ))
        }),
        state,
    );
}

pub fn peek_char_local(state: State) -> Answer<char> {
    let (state, _) = parser::skip_while(state, Box::new(|x| *x == ' '))?;
    if let Some(got) = parser::head(state) {
        Ok((state, got))
    } else {
        Ok((state, '\0'))
    }
}

pub fn parse_all(state: State) -> Answer<Option<Box<Term>>> {
    parser::guard(
        Box::new(|state| {
            let (state, all0) = parser::text("(", state)?;
            let (state, name) = parser::name(state)?;
            let (state, all1) = parser::text(":", state)?;
            Ok((state, all0 && all1 && !name.is_empty()))
            //Ok((state, all0 && all1 && name.len() > 0 && is_var_head(name.chars().nth(0).unwrap_or(' '))))
        }),
        Box::new(|state| {
            let (state, init) = get_init_index(state)?;
            let (state, _) = parser::consume("(", state)?;
            let (state, name) = parser::name1(state)?;
            let (state, _) = parser::consume(":", state)?;
            let (state, tipo) = parse_apps(state)?;
            let (state, _) = parser::consume(")", state)?;
            let (state, isfn) = parser::text("=>", state)?;
            if isfn {
                let (state, body) = parse_apps(state)?;
                let (state, last) = get_last_index(state)?;
                let orig = Span::new_off(init, last);
                Ok((
                    state,
                    Box::new(Term::Ann {
                        orig,
                        expr: Box::new(Term::Lam {
                            orig,
                            name: Ident(name.clone()),
                            body,
                        }),
                        tipo: Box::new(Term::All {
                            orig,
                            name: Ident(name),
                            tipo,
                            body: Box::new(Term::Hol { orig, numb: 0 }),
                        }),
                    }),
                ))
            } else {
                let (state, _) = parser::text("->", state)?;
                let (state, body) = parse_apps(state)?;
                let (state, last) = get_last_index(state)?;
                let orig = Span::new_off(init, last);
                Ok((
                    state,
                    Box::new(Term::All {
                        orig,
                        name: Ident(name),
                        tipo,
                        body,
                    }),
                ))
            }
        }),
        state,
    )
}

pub fn parse_if(state: State) -> Answer<Option<Box<Term>>> {
    return parser::guard(
        parser::text_parser("if "),
        Box::new(|state| {
            let (state, init) = get_init_index(state)?;
            let (state, _) = parser::consume("if ", state)?;
            let (state, cond) = parse_apps(state)?;
            let (state, _) = parser::consume("{", state)?;
            let (state, if_t) = parse_apps(state)?;
            let (state, _) = parser::text("}", state)?;
            let (state, _) = parser::text("else", state)?;
            let (state, _) = parser::consume("{", state)?;
            let (state, if_f) = parse_apps(state)?;
            let (state, _) = parser::text("}", state)?;
            let (state, last) = get_last_index(state)?;
            let orig = Span::new_off(init, last);
            let moti = Box::new(Term::Hol { orig, numb: 0 });
            Ok((
                state,
                Box::new(Term::Ctr {
                    orig,
                    name: Ident::new_path("Bool", "if"),
                    args: vec![moti, cond, if_t, if_f],
                }),
            ))
        }),
        state,
    );
}

pub fn parse_let(state: State) -> Answer<Option<Box<Term>>> {
    return parser::guard(
        parser::text_parser("let "),
        Box::new(|state| {
            let (state, init) = get_init_index(state)?;
            let (state, _) = parser::consume("let ", state)?;
            let (state, name) = parser::name1(state)?;
            let (state, _) = parser::consume("=", state)?;
            let (state, expr) = parse_apps(state)?;
            let (state, _) = parser::text(";", state)?;
            let (state, body) = parse_apps(state)?;
            let (state, last) = get_last_index(state)?;
            let orig = Span::new_off(init, last);
            Ok((
                state,
                Box::new(Term::Let {
                    orig,
                    name: Ident(name),
                    expr,
                    body,
                }),
            ))
        }),
        state,
    );
}

pub fn parse_lam(state: State) -> Answer<Option<Box<Term>>> {
    parser::guard(
        Box::new(|state| {
            let (state, name) = parser::name(state)?;
            let (state, arro) = parser::text("=>", state)?;
            Ok((state, !name.is_empty() && arro))
            //Ok((state, all0 && all1 && name.len() > 0 && is_var_head(name.chars().nth(0).unwrap_or(' '))))
        }),
        Box::new(move |state| {
            let (state, init) = get_init_index(state)?;
            let (state, name) = parser::name1(state)?;
            let (state, _) = parser::consume("=>", state)?;
            let (state, body) = parse_apps(state)?;
            let (state, last) = get_last_index(state)?;
            let orig = Span::new_off(init, last);
            Ok((state, Box::new(Term::Lam { orig, name: Ident(name), body })))
        }),
        state,
    )
}

pub fn parse_lst(state: State) -> Answer<Option<Box<Term>>> {
    parser::guard(
        Box::new(|state| {
            let (state, head) = parser::get_char(state)?;
            Ok((state, head == '['))
        }),
        Box::new(|state| {
            let (state, init) = get_init_index(state)?;
            let (state, _head) = parser::text("[", state)?;
            let state = state;
            let (state, elems) = parser::until(
                Box::new(|x| parser::text("]", x)),
                Box::new(|x| {
                    let (state, term) = parse_term(x)?;
                    let (state, _) = parser::maybe(Box::new(|x| parser::text(",", x)), state)?;
                    Ok((state, term))
                }),
                state,
            )?;
            let (state, last) = get_last_index(state)?;
            let orig = Span::new_off(init, last);
            let empty = Term::Ctr {
                orig,
                name: Ident::new_path("List", "nil"),
                args: Vec::new(),
            };
            let list = Box::new(elems.iter().rfold(empty, |t, h| Term::Ctr {
                orig,
                name: Ident::new_path("List", "cons"),
                args: vec![h.clone(), Box::new(t)],
            }));
            Ok((state, list))
        }),
        state,
    )
}

pub fn parse_new(state: State) -> Answer<Option<Box<Term>>> {
    parser::guard(
        parser::text_parser("$"),
        Box::new(move |state| {
            let (state, init) = get_init_index(state)?;
            let (state, _) = parser::consume("$", state)?;
            let (state, val0) = parse_term(state)?;
            let (state, val1) = parse_term(state)?;
            let (state, last) = get_last_index(state)?;
            let orig = Span::new_off(init, last);
            Ok((
                state,
                Box::new(Term::Ctr {
                    orig,
                    name: Ident::new_path("Sigma", "new"),
                    args: vec![Box::new(Term::Hol { orig, numb: 0 }), Box::new(Term::Hol { orig, numb: 0 }), val0, val1],
                }),
            ))
        }),
        state,
    )
}

pub fn parse_ctr(state: State) -> Answer<Option<Box<Term>>> {
    parser::guard(
        Box::new(|state| {
            let (state, open) = parser::text("(", state)?;
            let (state, head) = parser::get_char(state)?;
            //let (state, next) = parser::peek_char(state)?;
            Ok((state, open && is_ctr_head(head)))
        }),
        Box::new(|state| {
            let (state, init) = get_init_index(state)?;
            let (state, open) = parser::text("(", state)?;
            let (state, name) = parse_path_str(state)?;
            let (state, args) = if open {
                parser::until(parser::text_parser(")"), Box::new(parse_term), state)?
            } else {
                (state, Vec::new())
            };
            let (state, last) = get_last_index(state)?;
            let orig = Span::new_off(init, last);
            Ok((state, Box::new(Term::Ctr { orig, name: Ident(name), args })))
        }),
        state,
    )
}

pub fn parse_chr(state: State) -> Answer<Option<Box<Term>>> {
    parser::guard(
        Box::new(|state| {
            let (state, head) = parser::get_char(state)?;
            Ok((state, head == '\''))
        }),
        Box::new(|state| {
            let (state, init) = get_init_index(state)?;
            let (state, _) = parser::text("'", state)?;
            let (state, last) = get_last_index(state)?;
            let orig = Span::new_off(init, last);
            if let Some(c) = parser::head(state) {
                let state = parser::tail(state);
                let (state, _) = parser::text("'", state)?;
                Ok((state, Box::new(Term::Num { orig, numb: c as u64 })))
            } else {
                parser::expected("character", 1, state)
            }
        }),
        state,
    )
}

pub fn parse_op2(state: State) -> Answer<Option<Box<Term>>> {
    fn is_op_char(chr: char) -> bool {
        matches!(chr, '+' | '-' | '*' | '/' | '%' | '&' | '|' | '^' | '<' | '>' | '=' | '!')
    }
    fn parse_oper(state: State) -> Answer<Operator> {
        fn op<'a>(symbol: &'static str, oper: Operator) -> parser::Parser<'a, Option<Operator>> {
            Box::new(move |state| {
                let (state, done) = parser::text(symbol, state)?;
                Ok((state, if done { Some(oper) } else { None }))
            })
        }
        parser::grammar(
            "Oper",
            &[
                op("+", Operator::Add),
                op("-", Operator::Sub),
                op("*", Operator::Mul),
                op("/", Operator::Div),
                op("%", Operator::Mod),
                op("&", Operator::And),
                op("|", Operator::Or),
                op("^", Operator::Xor),
                op("<<", Operator::Shl),
                op(">>", Operator::Shr),
                op("<=", Operator::Lte),
                op("<", Operator::Ltn),
                op("==", Operator::Eql),
                op(">=", Operator::Gte),
                op(">", Operator::Gtn),
                op("!=", Operator::Neq),
            ],
            state,
        )
    }
    parser::guard(
        Box::new(|state| {
            let (state, open) = parser::text("(", state)?;
            let (state, head) = parser::get_char(state)?;
            Ok((state, open && is_op_char(head)))
        }),
        Box::new(|state| {
            let (state, init) = get_init_index(state)?;
            let (state, _) = parser::consume("(", state)?;
            let (state, oper) = parse_oper(state)?;
            let (state, val0) = parse_term(state)?;
            let (state, val1) = parse_term(state)?;
            let (state, _) = parser::consume(")", state)?;
            let (state, last) = get_last_index(state)?;
            let orig = Span::new_off(init, last);
            Ok((state, Box::new(Term::Op2 { orig, oper, val0, val1 })))
        }),
        state,
    )
}

pub fn parse_sig(state: State) -> Answer<Option<Box<Term>>> {
    parser::guard(
        Box::new(|state| {
            let (state, all0) = parser::text("[", state)?;
            let (state, name) = parser::name(state)?;
            let (state, all1) = parser::text(":", state)?;
            Ok((state, all0 && all1 && !name.is_empty()))
            //Ok((state, all0 && all1 && name.len() > 0 && is_var_head(name.chars().nth(0).unwrap_or(' '))))
        }),
        Box::new(|state| {
            let (state, init) = get_init_index(state)?;
            let (state, _) = parser::consume("[", state)?;
            let (state, name) = parser::name1(state)?;
            let (state, _) = parser::consume(":", state)?;
            let (state, tipo) = parse_apps(state)?;
            let (state, _) = parser::consume("]", state)?;
            let (state, _) = parser::text("->", state)?;
            let (state, body) = parse_apps(state)?;
            let (state, last) = get_last_index(state)?;
            let orig = Span::new_off(init, last);
            Ok((
                state,
                Box::new(Term::Ctr {
                    orig,
                    name: Ident("Sigma".to_string()),
                    args: vec![tipo, Box::new(Term::Lam { orig, name: Ident(name), body })],
                }),
            ))
        }),
        state,
    )
}
