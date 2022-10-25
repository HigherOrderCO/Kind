use std::collections::HashMap;

use kind_derive::matching::derive_match;
use kind_tree::concrete::{Book, TopLevel};

pub fn expand_glossary(glossary: &mut Book) {
    let mut entries = HashMap::new();
    for entry in glossary.entries.values_mut() {
        match entry {
            TopLevel::SumType(sum) => {
                let res = derive_match(sum.name.range, sum);
                entries.insert(res.name.to_string(), res);
            },
            TopLevel::RecordType(_) => (),
            TopLevel::Entry(_) => (),
        }
    }
    for (name, tl) in entries {
        glossary.count.insert(name.clone(), tl.extract_glossary_info());
        glossary.names.insert(name.clone().to_string(), tl.name.clone());
        glossary.entries.insert(name.clone(), TopLevel::Entry(tl));
    }
}