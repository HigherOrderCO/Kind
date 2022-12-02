//! Expand some attributes and derivations of each construction.
//! Currently it just derives `match` and `open` for sum type
//! and record types respectively.

use std::fmt::Display;
use std::sync::mpsc::Sender;

use fxhash::FxHashMap;
use kind_derive::getters::derive_getters;
use kind_derive::matching::derive_match;
use kind_derive::open::derive_open;
use kind_derive::setters::derive_setters;
use kind_report::data::Diagnostic;
use kind_span::Locatable;
use kind_span::Range;
use kind_tree::concrete::Entry;
use kind_tree::concrete::EntryMeta;
use kind_tree::concrete::Module;
use kind_tree::concrete::RecordDecl;
use kind_tree::concrete::SumTypeDecl;
use kind_tree::concrete::{Attribute, TopLevel};

use crate::errors::PassError;

/// Expands sum type and record definitions to a lot of
/// helper definitions like eliminators and replace qualified identifiers
/// by their module names.
pub mod uses;

type Derivations = FxHashMap<Derive, Range>;
type Channel = Sender<Box<dyn Diagnostic>>;

/// Tags for each one of the possible derivations.
#[derive(Debug, Hash, PartialEq, Eq)]
pub enum Derive {
    Match,
    Open,
    Getters,
    Setters,
}

impl Display for Derive {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Derive::Match => write!(f, "match"),
            Derive::Open => write!(f, "open"),
            Derive::Getters => write!(f, "getters"),
            Derive::Setters => write!(f, "setters"),
        }
    }
}

pub fn insert_or_report(channel: Channel, hashmap: &mut Derivations, key: Derive, range: Range) {
    if let Some(last_range) = hashmap.get(&key) {
        let err = Box::new(PassError::DuplicatedAttributeArgument(*last_range, range));
        channel.send(err).unwrap();
    } else {
        hashmap.insert(key, range);
    }
}

fn string_to_derive(name: &str) -> Option<Derive> {
    match name {
        "match" => Some(Derive::Match),
        "open" => Some(Derive::Open),
        "getters" => Some(Derive::Getters),
        "setters" => Some(Derive::Setters),
        _ => None,
    }
}

pub fn expand_derive(error_channel: Channel, attrs: &[Attribute]) -> Option<Derivations> {
    use kind_tree::concrete::AttributeStyle::*;

    let mut failed = false;
    let mut defs = FxHashMap::default();

    for attr in attrs {
        if attr.name.to_str() != "derive" {
            continue;
        }

        if let Some(attr) = &attr.value {
            let err = Box::new(PassError::AttributeDoesNotExpectEqual(attr.locate()));
            error_channel.send(err).unwrap();
            failed = true;
        }

        for arg in &attr.args {
            match arg {
                Ident(range, ident) if string_to_derive(ident.to_str()).is_some() => {
                    // Duplicates work but it's something negligible
                    let key = string_to_derive(ident.to_str()).unwrap();
                    insert_or_report(error_channel.clone(), &mut defs, key, *range)
                }
                other => {
                    let err = Box::new(PassError::InvalidAttributeArgument(other.locate()));
                    error_channel.send(err).unwrap();
                    failed = true;
                }
            }
        }
    }

    if failed {
        None
    } else {
        Some(defs)
    }
}

pub fn expand_sum_type(
    error_channel: Channel,
    entries: &mut FxHashMap<String, (Entry, EntryMeta)>,
    sum: &SumTypeDecl,
    derivations: Derivations,
) -> bool {
    let mut failed = false;

    for (key, val) in derivations {
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

    failed
}

pub fn expand_record_type(
    error_channel: Channel,
    entries: &mut FxHashMap<String, (Entry, EntryMeta)>,
    rec: &RecordDecl,
    derivations: Derivations,
) -> bool {
    let mut failed = false;

    for (key, val) in derivations {
        match key {
            Derive::Open => {
                let res = derive_open(rec.name.range, rec);
                let info = res.extract_book_info();
                entries.insert(res.name.to_string(), (res, info));
            }
            Derive::Getters => {
                for res in derive_getters(rec.name.range, rec) {
                    let info = res.extract_book_info();
                    entries.insert(res.name.to_string(), (res, info));
                }
            }
            Derive::Setters => {
                for res in derive_setters(rec.name.range, rec) {
                    let info = res.extract_book_info();
                    entries.insert(res.name.to_string(), (res, info));
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

    failed
}

pub fn expand_module(error_channel: Channel, module: &mut Module) -> bool {
    let mut failed = false;

    let mut entries = FxHashMap::default();

    for entry in &module.entries {
        match entry {
            TopLevel::SumType(sum) => {
                if let Some(derive) = expand_derive(error_channel.clone(), &sum.attrs) {
                    failed |= expand_sum_type(error_channel.clone(), &mut entries, sum, derive)
                } else {
                    failed = true;
                }
            }
            TopLevel::RecordType(rec) => {
                if let Some(derive) = expand_derive(error_channel.clone(), &rec.attrs) {
                    failed |= expand_record_type(error_channel.clone(), &mut entries, rec, derive)
                } else {
                    failed = true;
                }
            }
            TopLevel::Entry(_) => (),
        }
    }

    for (_, (tl, _)) in entries {
        module.entries.push(TopLevel::Entry(tl));
    }

    failed
}
