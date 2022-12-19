//! Module to derive a "open" function for records.

use kind_span::Range;

use kind_tree::concrete::expr::Expr;
use kind_tree::concrete::pat::{Pat, PatIdent};
use kind_tree::concrete::*;
use kind_tree::concrete::{self};
use kind_tree::symbol::{Ident, QualifiedIdent};
use kind_tree::telescope::Telescope;

pub fn derive_getters(range: Range, rec: &RecordDecl) -> Vec<concrete::Entry> {
    let mk_var = |name: Ident| -> Box<Expr> {
        Box::new(Expr {
            data: ExprKind::Var { name },
            range,
        })
    };

    let mk_cons = |name: QualifiedIdent, args: Vec<Binding>| -> Box<Expr> {
        Box::new(Expr {
            data: ExprKind::Constr { name, args },
            range,
        })
    };

    let mut types = Telescope::default();

    for arg in rec.parameters.iter() {
        types.push(arg.to_implicit())
    }

    // The type

    let all_args = rec.parameters.clone();

    let res_motive_ty = mk_cons(
        rec.name.clone(),
        all_args
            .iter()
            .cloned()
            .map(|x| Binding::Positional(mk_var(x.name)))
            .collect(),
    );

    // Sccrutinzies

    types.push(Argument {
        hidden: false,
        erased: false,
        name: Ident::generate("scrutinee"),
        typ: Some(res_motive_ty),
        range,
    });

    // Motive with indices

    let mut pats: Vec<Box<Pat>> = Vec::new();

    let spine: Vec<_> = rec
        .fields
        .iter()
        .map(|(name, _, ty)| (name, ty))
        .collect();

    pats.push(Box::new(Pat {
        data: concrete::pat::PatKind::App(
            rec.name.add_segment(rec.constructor.to_str()),
            spine
                .iter()
                .cloned()
                .map(|x| {
                    Box::new(Pat {
                        data: concrete::pat::PatKind::Var(PatIdent(x.0.clone().with_name(|f| format!("{}_", f)))),
                        range,
                    })
                })
                .collect(),
        ),
        range,
    }));

    let mut entries = vec![];

    for (arg, typ) in spine {
        let body = mk_var(arg.with_name(|f| format!("{}_", f)).clone());
    
        let mut name = rec
            .name
            .add_segment(arg.to_str())
            .add_segment("get");

        name.range = rec.constructor.range;


        let rules = vec![Box::new(Rule {
            name: name.clone(),
            pats: pats.clone(),
            body,
            range: rec.constructor.range,
        })];
    
        let entry = Entry {
            name: name.clone(),
            docs: Vec::new(),
            args: types.clone(),
            typ: typ.clone(),
            rules,
            range: rec.constructor.range,
            attrs: Vec::new(),
            generated_by: Some(rec.name.to_string().clone()),
        };
    
        entries.push(entry)
    }

    entries
}
