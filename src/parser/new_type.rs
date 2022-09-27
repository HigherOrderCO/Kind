use crate::book::name::Ident;
use crate::book::new_type::{Constructor, NewType, SumType};
use crate::parser::*;

pub fn parse_newtype(state: parser::State) -> parser::Answer<Box<NewType>> {
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
}

pub fn read_newtype(code: &str) -> Result<Box<NewType>, String> {
    parser::read(Box::new(parse_newtype), code)
}
