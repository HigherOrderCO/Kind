use crate::book::span::ByteOffset;

use hvm::parser;

pub fn is_ctr_head(head: char) -> bool {
    ('A'..='Z').contains(&head)
}

pub fn get_init_index(state: parser::State) -> parser::Answer<ByteOffset> {
    let (state, _) = parser::skip(state)?;
    Ok((state, ByteOffset(state.index as u32)))
}

pub fn get_last_index(state: parser::State) -> parser::Answer<ByteOffset> {
    Ok((state, ByteOffset(state.index as u32)))
}
