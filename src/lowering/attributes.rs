use crate::book::{span::Span, Attribute, Book, Entry};
use crate::driver::config::{Config, Target};

use super::adjust::{AdjustError, AdjustErrorKind};

// Helper functions.

pub fn adjust_err<T>(orig: Span, kind: AdjustErrorKind) -> Result<T, AdjustError> {
    Err(AdjustError { orig, kind })
}

pub fn without_args(attr: &Attribute) -> Result<(), AdjustError> {
    match &attr.value {
        Some(_) => adjust_err(attr.orig, AdjustErrorKind::AttributeWithoutArgs { name: attr.name.0.clone() }),
        None => Ok(()),
    }
}

pub fn only_target(config: &Config, attr: &Attribute, target: Target) -> Result<(), AdjustError> {
    if config.target == target || config.target == Target::All {
        Ok(())
    } else {
        adjust_err(attr.orig, AdjustErrorKind::AttributeWithoutArgs { name: attr.name.0.clone() })
    }
}

// Main functions

// Attributes are just for compiler magic so
// they have no specification so we should check then.
pub fn check_attribute(config: &Config, attr: &Attribute) -> Result<(), AdjustError> {
    match attr.name.0.as_str() {
        "kdl_erase" => without_args(attr),
        "kdl_run" => {
            without_args(attr)?;
            only_target(config, attr, Target::Kdl)
        }
        _ => adjust_err(attr.orig, AdjustErrorKind::InvalidAttribute { name: attr.name.0.clone() }),
    }
}

// Just checks all the attributes before they're expanded
// in the other parts of the code.
pub fn check_entry_attributes(config: &Config, entry: &Entry) -> Result<(), AdjustError> {
    for attr in &entry.attrs {
        check_attribute(config, attr)?
    }
    Ok(())
}

pub fn check_attributes(config: &Config, book: &Book) -> Result<(), AdjustError> {
    for entry in book.entrs.values() {
        check_entry_attributes(config, entry)?;
    }
    Ok(())
}
