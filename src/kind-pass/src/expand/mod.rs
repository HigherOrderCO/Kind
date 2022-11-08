/// Expands sum type and record definitions to a lot of
/// helper definitions like eliminators and replace qualified identifiers
/// by their module names.

use std::{collections::HashMap};
use kind_derive::matching::derive_match;
use kind_tree::{concrete::{Book, TopLevel}};

pub mod uses;

pub fn expand_book(book: &mut Book) {
    let mut entries = HashMap::new();
    for entry in book.entries.values_mut() {
        match entry {
            TopLevel::SumType(sum) => {
                let res = derive_match(sum.name.range, sum);
                entries.insert(res.name.to_string(), res);
            }
            TopLevel::RecordType(_) => (),
            TopLevel::Entry(_) => (),
        }
    }
    for (name, tl) in entries {
        book.count.insert(name.clone(), tl.extract_book_info());
        book.names.insert(name.clone().to_string(), tl.name.clone());
        book.entries.insert(name.clone(), TopLevel::Entry(tl));
    }
}
