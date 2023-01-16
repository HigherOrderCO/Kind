//! Module to derive mutters for record types

use kind_span::Range;

use kind_tree::concrete::expr::Expr;
use kind_tree::concrete::pat::{Pat, PatIdent};
use kind_tree::concrete::*;
use kind_tree::concrete::{self};
use kind_tree::symbol::{Ident};
use kind_tree::telescope::Telescope;

pub fn derive_mutters(range: Range, rec: &RecordDecl) -> Vec<concrete::Entry> {
    let mut types = Telescope::default();

    for arg in rec.parameters.iter() {
        types.push(arg.to_implicit())
    }

    // The type

    let all_args = rec.parameters.clone();

    let res_motive_ty = Expr::cons(
        rec.name.clone(),
        all_args
            .iter()
            .cloned()
            .map(|x| Binding::Positional(Expr::var(x.name)))
            .collect(),
        range
    );

    // Sccrutinzies

    types.push(Argument {
        hidden: false,
        erased: false,
        name: Ident::generate("scrutinee"),
        typ: Some(res_motive_ty.clone()),
        range,
    });

    // Motive with indices

    let mut pats: Vec<Box<Pat>> = Vec::new();

    let fields_spine: Vec<_> = rec
        .fields
        .iter()
        .map(|(name, _, typ)| (name.clone(), typ.clone()))
        .collect();

    let params_spine: Vec<_> = rec
        .parameters
        .iter()
        .map(|arg| {
            (
                arg.name.clone(),
                arg.typ.clone().unwrap_or_else(|| Expr::typ(arg.range.clone())),
            )
        })
        .collect();

    let spine = [params_spine.as_slice(), fields_spine.as_slice()].concat();

    pats.push(Box::new(Pat {
        data: concrete::pat::PatKind::App(
            rec.name.add_segment(rec.constructor.to_str()),
            spine
                .iter()
                .cloned()
                .map(|(name, _)| Pat::var(name))
                .collect(),
        ),
        range,
    }));

    let mut entries = vec![];

    let mut cons_name = rec.name.add_segment(rec.constructor.to_str());

    cons_name.range = rec.constructor.range;

    for (i, (arg, cons_typ)) in fields_spine.iter().enumerate() {
        let mut types = types.clone();

        let place = rec.parameters.len() + i;

        types.push(Argument {
            hidden: false,
            erased: false,
            name: Ident::generate("mut"),
            typ: Some(Expr::all(Ident::generate("_"), cons_typ.clone(), cons_typ.clone(), false, range)),
            range,
        });

        let new_var = Ident::generate("_fn");

        let mut pats = pats.clone();

        pats.push(Box::new(Pat {
            data: concrete::pat::PatKind::Var(PatIdent(new_var.clone())),
            range,
        }));

        let mut args: Vec<_> = spine
            .iter()
            .cloned()
            .map(|x| Binding::Positional(Expr::var(x.0)))
            .collect();

        args[place] = Binding::Positional(Expr::app(Expr::var(new_var), vec![args[place].to_app_binding()], range));

        let body = Box::new(Expr {
            data: ExprKind::Constr {
                name: cons_name.clone(),
                args,
            },
            range,
        });

        let mut name = rec.name.add_segment(arg.to_str()).add_segment("mut");

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
            typ: res_motive_ty.clone(),
            rules,
            range: rec.constructor.range,
            attrs: Vec::new(),
            generated_by: Some(rec.name.to_string().clone()),
        };

        entries.push(entry)
    }

    entries
}
