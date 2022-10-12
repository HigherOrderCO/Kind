use crate::book::{span::Span, Attribute, Book, Entry, name::Ident};
use crate::driver::config::{Config, Target};

use super::adjust::{AdjustError, AdjustErrorKind};

// Helper functions.

pub fn adjust_err<T>(orig: Span, kind: AdjustErrorKind) -> Result<T, AdjustError> {
    Err(AdjustError { orig, kind })
}

// Checks that an attribute has no args
pub fn without_args(attr: &Attribute) -> Result<(), AdjustError> {
    match &attr.value {
        Some(_) => adjust_err(attr.orig, AdjustErrorKind::AttributeWithoutArgs { name: attr.name.0.clone() }),
        None => Ok(()),
    }
}

// Checks that an attribute has args
pub fn with_args(attr: &Attribute) -> Result<(), AdjustError> {
    match &attr.value {
        Some(_) => Ok(()),
        None => adjust_err(attr.orig, AdjustErrorKind::AttributeMissingArg { name: attr.name.0.clone() }),
    }
}

// Checks that the function is being processed in the correct target
pub fn only_target(config: &Config, attr: &Attribute, target: Target) -> Result<(), AdjustError> {
    if config.target == target || config.target == Target::All {
        Ok(())
    } else {
        let name = attr.name.0.clone();
        adjust_err(attr.orig, AdjustErrorKind::WrongTargetAttribute { name, target })
    }
}

// Checks that a function has no args
pub fn no_fn_args(entry: &Entry, attr: &Attribute) -> Result<(), AdjustError> {
    if let Some(arg) = entry.args.iter().filter(|x| !x.eras).next() {
        let fn_name = entry.name.0.clone();
        let attr_name = attr.name.0.clone();
        adjust_err(arg.orig, AdjustErrorKind::FunctionHasArgs { fn_name, attr_name })
    } else {
        Ok(())
    }
}

pub fn fn_exists<'a>(book: &'a Book, attr: &Attribute, entry_name: &Ident) -> Result<&'a Entry, AdjustError> {
    if let Some(entry) = book.entrs.get(entry_name) {
        Ok(entry)
    } else {
        let name = entry_name.0.clone();
        adjust_err(attr.orig, AdjustErrorKind::FunctionNotFound { name })
    }
} 

pub fn has_rules(entry: &Entry, attr: &Attribute) -> Result<(), AdjustError> {
    if !entry.rules.is_empty() {
        Ok(())
    } else {
        let fn_name = entry.name.0.clone();
        let attr_name = attr.name.0.clone();
        adjust_err(entry.orig, AdjustErrorKind::NeedsRules { fn_name, attr_name })
    }
}

pub fn no_kdl_attrs(entry: &Entry) -> Result<(), AdjustError> {
    let kdl_attrs = ["kdl_erase", "kdl_run", "kdl_name", "kdl_state"];
    for attr_name in kdl_attrs {
        if let Some(attr) = entry.get_attribute(attr_name) {
            let name = entry.name.0.clone();
            return adjust_err(attr.orig, AdjustErrorKind::HasKdlAttrs { name });
        }
    }
    Ok(())
}

// Main functions

// Attributes are just for compiler magic so
// they have no specification so we should check then.
pub fn check_attribute(config: &Config, book: &Book, attr: &Attribute) -> Result<(), AdjustError> {
    match attr.name.0.as_str() {
        "inline" => {
            without_args(attr)
        }
        "kdl_erase" => {
            without_args(attr)
        }
        "kdl_run" => {
            without_args(attr)?;
            only_target(config, attr, Target::Kdl)
        }
        "kdl_name" => {
            with_args(attr)
        }
        "kdl_state" => {
            with_args(attr)?;
            // TODO: The state function shouldnt be called anywhere
            // TODO: We need to put this function in the book even though its not called anywhere
            let state_fn = fn_exists(book, attr, attr.value.as_ref().unwrap())?;
            no_kdl_attrs(state_fn)?;
            no_fn_args(state_fn, attr)?;
            has_rules(state_fn, attr)
        }
        _ => {
            let name = attr.name.0.clone();
            let err = AdjustErrorKind::InvalidAttribute { name };
            adjust_err(attr.orig, err)
        }
    }
}

// Just checks all the attributes before they're expanded
// in the other parts of the code.
pub fn check_entry_attributes(config: &Config, book: &Book, entry: &Entry) -> Result<(), AdjustError> {
    for attr in &entry.attrs {
        check_attribute(config, book, attr)?
    }
    Ok(())
}

pub fn check_attributes(config: &Config, book: &Book) -> Result<(), AdjustError> {
    for entry in book.entrs.values() {
        check_entry_attributes(config, book, entry)?;
    }
    Ok(())
}
