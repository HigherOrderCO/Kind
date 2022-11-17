use kind_tree::{concrete::{self, Attribute, AttributeStyle}, desugared};

use crate::errors::PassError;

use super::DesugarState;

impl<'a> DesugarState<'a> {

    fn args_should_be_empty(&mut self, attr: &Attribute) {
        if !attr.args.is_empty() {
            self.send_err(PassError::AttributeDoesNotExpectArgs(attr.range))
        };
    }

    fn attr_without_value(&mut self, attr: &Attribute) {
        if attr.value.is_some() {
            self.send_err(PassError::AttributeDoesNotExpectEqual(attr.range))
        };
    }

    fn attr_invalid_argument(&mut self, attr: &Attribute) {
        if !attr.value.is_some() {
            self.send_err(PassError::InvalidAttributeArgument(attr.range))
        };
    }

    fn attr_expects_a_value(&mut self, attr: &Attribute) {
        if !attr.value.is_some() {
            self.send_err(PassError::InvalidAttributeArgument(attr.range))
        };
    }

    pub fn desugar_attributes(
        &mut self,
        attrs: &[concrete::Attribute],
    ) -> Vec<desugared::Attribute> {
        let mut vec = Vec::new();

        for attr in attrs {
            match attr.name.to_str() {
                // The derive attribute is treated by the expand
                // pass so here we just ignore it.
                "derive" => (),
                "inline" => {
                    self.args_should_be_empty(attr);
                    self.attr_without_value(attr);
                    vec.push(desugared::Attribute::Inline);
                }
                "kdl_run" => {
                    self.args_should_be_empty(attr);
                    self.attr_without_value(attr);
                    vec.push(desugared::Attribute::KdlRun);
                }
                "kdl_erase"  => {
                    self.args_should_be_empty(attr);
                    self.attr_without_value(attr);
                    vec.push(desugared::Attribute::KdlErase);
                }
                "kdl_name" => {
                    self.args_should_be_empty(attr);
                    match &attr.value {
                        Some(AttributeStyle::Ident(_, ident)) => {
                            vec.push(desugared::Attribute::KdlState(ident.clone()));
                        },
                        Some(_) => self.attr_invalid_argument(attr),
                        None => self.attr_expects_a_value(attr)
                    }
                },
                "kdl_state" => {
                    self.args_should_be_empty(attr);
                    match &attr.value {
                        Some(AttributeStyle::Ident(_, ident)) => {
                            vec.push(desugared::Attribute::KdlState(ident.clone()));
                        },
                        Some(_) => self.attr_invalid_argument(attr),
                        None => self.attr_expects_a_value(attr)
                    }
                },
                _ => self.send_err(PassError::AttributeDoesNotExists(attr.range))
            }
        }
        vec
    }
}
