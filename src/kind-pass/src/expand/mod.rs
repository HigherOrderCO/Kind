//! Expand some attributes and derivations of each construction.
//! Currently it just derives `match` and `open` for sum type
//! and record types respectively.

use std::fmt::Display;
use std::sync::mpsc::Sender;

use fxhash::FxHashMap;
use kind_derive::matching::derive_match;
use kind_derive::open::derive_open;
use kind_report::data::Diagnostic;
use kind_span::Locatable;
use kind_span::Range;
use kind_tree::concrete::{Attribute, Book, TopLevel};

use crate::errors::PassError;
/// Expands sum type and record definitions to a lot of
/// helper definitions like eliminators and replace qualified identifiers
/// by their module names.
pub mod uses;

#[derive(Debug, Hash, PartialEq, Eq)]
pub enum Derive {
    Match,
    Open,
}

impl Display for Derive {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Derive::Match => write!(f, "match"),
            Derive::Open => write!(f, "open"),
        }
    }
}

pub fn insert_or_report(
    channel: Sender<Box<dyn Diagnostic>>,
    hashmap: &mut FxHashMap<Derive, Range>,
    key: Derive,
    range: Range,
) {
    match hashmap.get(&key) {
        Some(last_range) => {
            channel
                .send(Box::new(PassError::DuplicatedAttributeArgument(
                    last_range.clone(),
                    range,
                )))
                .unwrap();
        }
        None => {
            hashmap.insert(key, range);
        }
    }
}

fn string_to_derive(name: &str) -> Option<Derive> {
    match name {
        "match" => Some(Derive::Match),
        "open" => Some(Derive::Open),
        _ => None,
    }
}

pub fn expand_derive(
    error_channel: Sender<Box<dyn Diagnostic>>,
    attrs: &[Attribute],
) -> Option<FxHashMap<Derive, Range>> {
    let mut failed = false;
    let mut def = FxHashMap::default();

    for attr in attrs {
        if attr.name.to_str() != "derive" {
            continue;
        }

        if let Some(attr) = &attr.value {
            error_channel
                .send(Box::new(PassError::AttributeDoesNotExpectEqual(
                    attr.locate(),
                )))
                .unwrap();
            failed = true;
        }

        use kind_tree::concrete::AttributeStyle::*;
        for arg in &attr.args {
            match arg {
                Ident(range, ident) => match string_to_derive(ident.to_str()) {
                    Some(key) => {
                        insert_or_report(error_channel.clone(), &mut def, key, range.clone())
                    }
                    _ => {
                        error_channel
                            .send(Box::new(PassError::InvalidAttributeArgument(
                                ident.locate(),
                            )))
                            .unwrap();
                        failed = true;
                    }
                },
                other => {
                    error_channel
                        .send(Box::new(PassError::InvalidAttributeArgument(
                            other.locate(),
                        )))
                        .unwrap();
                    failed = true;
                }
            }
        }
    }

    if failed {
        None
    } else {
        Some(def)
    }
}

pub fn expand_book(error_channel: Sender<Box<dyn Diagnostic>>, book: &mut Book) -> bool {
    let mut failed = false;

    let mut entries = FxHashMap::default();

    for entry in book.entries.values() {
        match entry {
            TopLevel::SumType(sum) => {
                if let Some(derive) = expand_derive(error_channel.clone(), &sum.attrs) {
                    for (key, val) in derive {
                        match key {
                            Derive::Match => {
                                let (res, errs) = derive_match(sum.name.range, sum);
                                let info = res.extract_book_info();
                                entries.insert(res.name.to_string(), (res, info));
                                for err in errs {
                                    error_channel.send(err).unwrap();
                                    failed = true;
                                }
                            }
                            other => {
                                error_channel
                                    .send(Box::new(PassError::CannotDerive(other.to_string(), val)))
                                    .unwrap();
                                failed = true;
                            }
                        }
                    }
                } else {
                    failed = true;
                }
            }
            TopLevel::RecordType(rec) => {
                if let Some(derive) = expand_derive(error_channel.clone(), &rec.attrs) {
                    for (key, val) in derive {
                        match key {
                            Derive::Open => {
                                let res = derive_open(rec.name.range, rec);
                                let info = res.extract_book_info();
                                entries.insert(res.name.to_string(), (res, info));
                            }
                            other => {
                                error_channel
                                    .send(Box::new(PassError::CannotDerive(other.to_string(), val)))
                                    .unwrap();
                                failed = true;
                            }
                        }
                    }
                } else {
                    failed = true;
                }
            }
            TopLevel::Entry(_) => (),
        }
    }

    for (name, (tl, count)) in entries {
        book.count.insert(name.clone(), count);
        book.names.insert(name.clone().to_string(), tl.name.clone());
        book.entries.insert(name.clone(), TopLevel::Entry(tl));
    }

    failed
}
