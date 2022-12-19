//! Module to derive a "open" function for records.

use kind_span::Range;

use kind_tree::concrete::*;
use kind_tree::concrete::{self};
use kind_tree::telescope::Telescope;

use crate::matching::derive_match;

pub fn derive_open(range: Range, rec: &RecordDecl) -> concrete::Entry {
    let cons = Constructor {
        name: rec.constructor.clone(),
        docs: vec![],
        attrs: rec.cons_attrs.clone(),
        args: Telescope::new(rec.fields.clone()).map(|x| Argument::new_explicit(x.0.clone(), x.2.clone(), x.2.range)),
        typ: None,
    };

    let mut entry = derive_match(
        range,
        &SumTypeDecl {
            name: rec.name.clone(),
            docs: rec.docs.clone(),
            parameters: rec.parameters.clone(),
            indices: Telescope::default(),
            constructors: vec![cons],
            attrs: rec.attrs.clone(),
        },
    ).0;

    entry.name = rec
    .name
    .add_segment(rec.constructor.to_str())
    .add_segment("open");

    for rule in &mut entry.rules {
        rule.name = entry.name.clone();
    }

    entry
}
