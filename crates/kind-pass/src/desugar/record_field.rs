use fxhash::FxHashMap;
use kind_span::Range;
use kind_tree::{
    concrete::{self, TopLevel},
    desugared::{self, Expr},
    symbol::{Ident, QualifiedIdent},
    telescope::Telescope,
};

use crate::{subst::subst_on_expr, diagnostic::PassDiagnostic};

use super::DesugarState;

impl<'a> DesugarState<'a> {
    pub fn specialize_on_field(
        &mut self,
        typ: Box<desugared::Expr>,
    ) -> Option<(
        QualifiedIdent,
        &Telescope<concrete::Argument>,
        Telescope<concrete::Argument>,
        Vec<Box<Expr>>,
    )> {
        match typ.data {
            desugared::ExprKind::Ctr { name, args } => {
                let Some(TopLevel::RecordType(record)) = self.old_book.entries.get(name.to_str()) else { return None };
                let entry_constructor = self.old_book.meta.get(
                    record
                        .name
                        .add_segment(record.constructor.to_str())
                        .to_str(),
                )?;
                Some((
                    name,
                    &record.parameters,
                    entry_constructor
                        .arguments
                        .clone()
                        .drop(record.parameters.len()),
                    args,
                ))
            }
            _ => None,
        }
    }

    pub fn desugar_record_field_sequence(
        &mut self,
        range: Range,
        res: &mut Vec<(QualifiedIdent, Ident)>,
        typ: Box<desugared::Expr>,
        fields: &[Ident],
    ) -> bool {
        if fields.is_empty() {
            return true;
        }

        if let Some((name, params, record_fields, args)) = self.specialize_on_field(typ.clone()) {
            if let Some(field) = record_fields
                .iter()
                .find(|x| x.name.to_str() == fields[0].to_str())
            {
                let key = field.name.clone();

                let pair = params
                    .iter()
                    .zip(args)
                    .map(|(k, v)| (k.name.to_string(), v))
                    .collect::<FxHashMap<_, _>>();

                let mut val = self.desugar_expr(
                    &field
                        .typ
                        .clone()
                        .unwrap_or_else(|| concrete::expr::Expr::typ(field.range)),
                );

                subst_on_expr(&mut val, pair);
                res.push((name, key));
                self.desugar_record_field_sequence(range, res, val, &fields[1..]);
                return true;
            } else {
                self.send_err(PassDiagnostic::CannotFindTheField(
                    fields[0].range,
                    fields[0].to_string()
                ));
            }
        } else {
            self.send_err(PassDiagnostic::CannotAccessType(
                fields[0].range,
                fields[0].to_string()
            ));
        }

        false
    }
}
