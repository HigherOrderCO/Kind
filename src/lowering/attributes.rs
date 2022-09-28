use crate::book::{Entry, Attribute, span::Span, Book};

use super::adjust::{AdjustError, AdjustErrorKind};

pub fn adjust_err<T>(orig: Span, kind: AdjustErrorKind) -> Result<T, AdjustError> {
  Err(AdjustError {
    orig,
    kind,
  })
}

// Attributes are just for compiler magic so
// they have no specification so we should check then.
pub fn check_attribute(attr: &Attribute) -> Result<(), AdjustError> {
  match attr.name.0.as_str() {
    "erase_kdl" => {
      match &attr.value {
        Some(_) => adjust_err(attr.orig, AdjustErrorKind::AttributeWithoutArgs { name: attr.name.0.clone() }),
        None => Ok(())
      }
    }
    _ => adjust_err(attr.orig, AdjustErrorKind::InvalidAttribute { name: attr.name.0.clone() })
  }
}

// Just checks all the attributes before they're expanded
// in the other parts of the code.
pub fn check_entry_attributes(entry: &Entry) -> Result<(), AdjustError> {
  for attr in &entry.attrs {
    check_attribute(attr)?
  }
  Ok(())
}

pub fn check_attributes(book: &Book) -> Result<(), AdjustError> {
  for entry in book.entrs.values() {
    check_entry_attributes(entry)?;
  }
  Ok(())
}