use kind_tree::{concrete, desugared};

use super::DesugarState;

impl<'a> DesugarState<'a> {
    pub fn desugar_attributes(&self, _attr: &[concrete::Attribute]) -> Vec<desugared::Attribute> {
        Vec::new()
    }
}
