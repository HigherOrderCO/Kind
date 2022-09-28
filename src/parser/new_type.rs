use crate::book::name::Ident;
use crate::book::new_type::{Constructor, NewType, SumType, ProdType};
use crate::parser::*;

pub fn parse_sum_type(state: parser::State) -> parser::Answer<Option<Box<NewType>>> {
    parser::guard(
        parser::text_parser("type "),
        Box::new(|state| {
            let (state, _) = parser::consume("type", state)?;
            let (state, name) = parser::name1(state)?;
            let (state, pars) = parser::until(parser::text_parser("{"), Box::new(parse_argument), state)?;
            let mut ctrs = vec![];
            let mut state = state;
            loop {
                let state_i = state;
                let (state_i, ctr_name) = parser::name(state_i)?;
                if ctr_name.is_empty() {
                    break;
                }
                let mut ctr_args = vec![];
                let mut state_i = state_i;
                loop {
                    let state_j = state_i;
                    let (state_j, head) = parser::peek_char(state_j)?;
                    if head != '(' {
                        break;
                    }
                    let (state_j, ctr_arg) = parse_argument(state_j)?;
                    ctr_args.push(ctr_arg);
                    state_i = state_j;
                }
                ctrs.push(Box::new(Constructor {
                    name: Ident(ctr_name),
                    args: ctr_args,
                }));
                state = state_i;
            }
            Ok((state, Box::new(NewType::Sum(SumType { name: Ident(name), pars, ctrs }))))
        }),
        state,
    )
}

pub fn parse_prod_type(state: parser::State) -> parser::Answer<Option<Box<NewType>>> {
    parser::guard(
        parser::text_parser("record "),
        Box::new(|state| {
            let (state, _) = parser::consume("record", state)?;
            let (state, name) = parser::name1(state)?;
            let (state, pars) = parser::until(parser::text_parser("{"), Box::new(parse_argument), state)?;
            let mut state = state;
            let mut fields = Vec::new();

            loop {
                let state_i = state;
                let (state_i, init) = get_init_index(state_i)?;
                let (state_i, ctr_name) = parser::name(state_i)?;
                let (state_i, _) = parser::consume(":", state_i)?;
                let (state_i, tipo) = parse_apps(state_i)?;
                let (state_i, last) = get_last_index(state_i)?;
                let orig = Span::new_off(init, last);
                fields.push(Box::new(Argument {
                    hide: false,
                    eras: false,
                    orig,
                    name: Ident(ctr_name),
                    tipo,
                }));

                let (state_i, head) = parser::peek_char(state_i)?;
                state = state_i;

                if head == '}' {
                    break;
                }
            }

            Ok((state, Box::new(NewType::Prod(ProdType {
                name: Ident(name),
                pars,
                fields
            }))))
        }),
        state,
    )
}

pub fn parse_newtype(state: parser::State) -> parser::Answer<Box<NewType>> {
    parser::grammar(
        "Newtype",
        &[
            Box::new(parse_sum_type), // `type `
            Box::new(parse_prod_type), // `record `
            Box::new(|state| Ok((state, None))),
        ],
        state,
    )
}

pub fn read_newtype(code: &str) -> Result<Box<NewType>, String> {
    parser::read(Box::new(parse_newtype), code)
}
