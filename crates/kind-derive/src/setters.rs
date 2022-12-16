//! Module to derive a "open" function for records.

use kind_span::Range;

use kind_tree::concrete::expr::Expr;
use kind_tree::concrete::pat::{Pat, PatIdent};
use kind_tree::concrete::*;
use kind_tree::concrete::{self};
use kind_tree::symbol::{Ident, QualifiedIdent};
use kind_tree::telescope::Telescope;

pub fn derive_setters(range: Range, rec: &RecordDecl) -> Vec<concrete::Entry> {
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

    let typ = |range: Range| -> Box<Expr> {
        Box::new(Expr {
            data: ExprKind::Lit { lit: Literal::Type },
            range,
        })
    };

    let mk_pat_var = |name: Ident| {
        Box::new(Pat {
            range: name.range,
            data: concrete::pat::PatKind::Var(PatIdent(name)),
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
        name: Ident::generate("scrutineer"),
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
                arg.typ.clone().unwrap_or_else(|| typ(arg.range.clone())),
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
                .map(|(name, _)| mk_pat_var(name))
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
            name: Ident::generate("set"),
            typ: Some(cons_typ.clone()),
            range,
        });

        let new_var = Ident::generate("_new_var");

        let mut pats = pats.clone();

        pats.push(Box::new(Pat {
            data: concrete::pat::PatKind::Var(PatIdent(new_var.clone())),
            range,
        }));

        let mut args: Vec<_> = spine
            .iter()
            .cloned()
            .map(|x| Binding::Positional(mk_var(x.0)))
            .collect();

        args[place] = Binding::Positional(mk_var(new_var));

        let body = Box::new(Expr {
            data: ExprKind::Constr {
                name: cons_name.clone(),
                args,
            },
            range,
        });

        let mut name = rec.name.add_segment(arg.to_str()).add_segment("set");

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
