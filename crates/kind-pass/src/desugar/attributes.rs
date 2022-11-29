use kind_span::Locatable;
use kind_tree::concrete::{self, Attribute, AttributeStyle};
use kind_tree::Attributes;

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
            self.send_err(PassError::AttributeExpectsAValue(attr.range))
        };
    }

    pub fn desugar_attributes(&mut self, attrs: &[concrete::Attribute]) -> Attributes {
        let mut attributes: Attributes = Default::default();

        for attr in attrs {
            match attr.name.to_str() {
                // The derive attribute is treated by the expand
                // pass so here we just ignore it.
                "derive" => (),
                "inline" => {
                    self.args_should_be_empty(attr);
                    self.attr_without_value(attr);
                    attributes.inlined = true;
                }
                "kdl_run" => {
                    self.args_should_be_empty(attr);
                    self.attr_without_value(attr);
                    attributes.kdl_run = true;
                }
                "kdl_erase" => {
                    self.args_should_be_empty(attr);
                    self.attr_without_value(attr);
                    attributes.kdl_erase = true;
                }
                "kdl_name" => {
                    self.args_should_be_empty(attr);
                    match &attr.value {
                        Some(AttributeStyle::Ident(_, ident)) => {
                            attributes.kdl_name = Some(ident.clone());
                        }
                        Some(_) => self.attr_invalid_argument(attr),
                        None => self.attr_expects_a_value(attr),
                    }
                }
                "kdl_state" => {
                    self.args_should_be_empty(attr);
                    match &attr.value {
                        Some(AttributeStyle::Ident(_, ident)) => {
                            attributes.kdl_state = Some(ident.clone());
                        }
                        Some(_) => self.attr_invalid_argument(attr),
                        None => self.attr_expects_a_value(attr),
                    }
                }
                "trace" => {
                    self.args_should_be_empty(attr);
                    match &attr.value {
                        Some(AttributeStyle::Ident(_, id)) if id.to_string() == "true" => {
                            attributes.trace = Some(true);
                        }
                        Some(AttributeStyle::Ident(_, id)) if id.to_string() == "false" => {
                            attributes.trace = Some(false);
                        }
                        Some(other) => {
                            self.send_err(PassError::InvalidAttributeArgument(other.locate()))
                        }
                        None => {
                            attributes.trace = Some(false);
                        }
                    }
                }
                _ => self.send_err(PassError::AttributeDoesNotExists(attr.range)),
            }
        }

        attributes
    }
}
