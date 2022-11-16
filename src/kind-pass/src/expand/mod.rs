//! Expand some attributes and derivations of each construction.
//! Currently it just derives `match` and `open` for sum type
//! and record types respectively.

use std::sync::mpsc::Sender;

use fxhash::FxHashMap;
use kind_derive::matching::derive_match;
use kind_derive::open::derive_open;
use kind_report::data::Diagnostic;
use kind_tree::concrete::{Book, TopLevel};
/// Expands sum type and record definitions to a lot of
/// helper definitions like eliminators and replace qualified identifiers
/// by their module names.
pub mod uses;

pub fn expand_book(error_channel: Sender<Box<dyn Diagnostic>>, book: &mut Book) {
    let mut entries = FxHashMap::default();
    for entry in book.entries.values() {
        match entry {
            TopLevel::SumType(sum) => {
                let res = derive_match(sum.name.range, sum);
                let info = res.extract_book_info();
                entries.insert(res.name.to_string(), (res, info));
            }
            TopLevel::RecordType(rec) => {
                let res = derive_open(rec.name.range, rec);
                let info = res.extract_book_info();
                entries.insert(res.name.to_string(), (res, info));
            }
            TopLevel::Entry(_) => (),
        }
    }
    for (name, (tl, count)) in entries {
        book.count.insert(name.clone(), count);
        book.names.insert(name.clone().to_string(), tl.name.clone());
        book.entries.insert(name.clone(), TopLevel::Entry(tl));
    }
}
