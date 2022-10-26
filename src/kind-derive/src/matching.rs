///! Module to derive a dependent
/// eliminator out of a sum type declaration.
use kind_span::Range;

use kind_tree::concrete::expr::Expr;
use kind_tree::concrete::pat::{Pat, PatIdent};
use kind_tree::concrete::*;
use kind_tree::concrete::{self};
use kind_tree::symbol::Ident;

/// Derives an eliminator from a sum type declaration.
pub fn derive_match(range: Range, sum: &SumTypeDecl) -> concrete::Entry {
    let mk_var = |name: Ident| -> Box<Expr> {
        Box::new(Expr {
            data: ExprKind::Var(name),
            range,
        })
    };

    let mk_cons = |name: Ident| -> Box<Expr> {
        Box::new(Expr {
            data: ExprKind::Constr(name),
            range,
        })
    };

    let mk_app = |left: Box<Expr>, right: Vec<Binding>| -> Box<Expr> {
        Box::new(Expr {
            data: ExprKind::App(left, right),
            range,
        })
    };

    let mk_pi = |name: Ident, left: Box<Expr>, right: Box<Expr>| -> Box<Expr> {
        Box::new(Expr {
            data: ExprKind::All(Some(name), left, right),
            range,
        })
    };

    let mk_typ = || -> Box<Expr> {
        Box::new(Expr {
            data: ExprKind::Lit(Literal::Type),
            range,
        })
    };

    let name = sum.name.add_segment("match");

    let mut types = Telescope::default();

    for arg in sum.parameters.iter() {
        types.push(arg.to_implicit())
    }

    for arg in sum.indices.iter() {
        types.push(arg.to_implicit())
    }

    // The type

    let all_args = sum.parameters.extend(&sum.indices);
    let res_motive_ty = mk_app(
        mk_cons(sum.name.clone()),
        all_args
            .iter()
            .cloned()
            .map(|x| Binding::Positional(mk_var(x.name)))
            .collect(),
    );

    let indice_names: Vec<Binding> = sum
        .indices
        .iter()
        .map(|x| Binding::Positional(mk_var(x.name.clone())))
        .collect();

    // Sccrutinzies

    types.push(Argument {
        hidden: false,
        erased: false,
        name: Ident::generate("scrutinizer"),
        typ: Some(res_motive_ty.clone()),
        range,
    });

    // Motive with indices

    let motive_ident = Ident::new_static("motive", range);

    let motive_type = sum.indices.iter().rfold(
        mk_pi(Ident::new_static("_val", range), res_motive_ty, mk_typ()),
        |out, arg| mk_pi(arg.name.clone(), arg.typ.clone().unwrap_or(mk_typ()), out),
    );

    types.push(Argument {
        hidden: false,
        erased: true,
        name: motive_ident.clone(),
        typ: Some(motive_type),
        range,
    });

    // Constructors type
    for cons in &sum.constructors {
        let vars = cons
            .args
            .iter()
            .map(|x| Binding::Positional(mk_var(x.name.clone())))
            .collect();

        let cons_inst = mk_app(mk_cons(sum.name.add_segment(cons.name.to_str())), vars);

        let mut indices_of_cons = match cons.typ.clone().map(|x| x.data) {
            Some(ExprKind::App(_, spine)) => spine[sum.parameters.len()..].to_vec(),
            _ => indice_names.clone(),
        };

        indices_of_cons.push(Binding::Positional(cons_inst));
        let cons_tipo = mk_app(mk_var(motive_ident.clone()), indices_of_cons);

        let cons_type = cons.args.iter().rfold(cons_tipo, |out, arg| {
            mk_pi(arg.name.clone(), arg.typ.clone().unwrap_or(mk_typ()), out)
        });

        types.push(Argument {
            hidden: false,
            erased: false,
            name: Ident::new_static("_", range),
            typ: Some(cons_type),
            range,
        });
    }

    let mut res: Vec<Binding> = indice_names;
    res.push(Binding::Positional(mk_var(Ident::generate("scrutinizer"))));
    let ret_ty = mk_app(mk_var(motive_ident), res);

    let mut rules = Vec::new();

    for cons in &sum.constructors {
        let cons_ident = sum.name.add_segment(cons.name.to_str());
        let mut pats: Vec<Box<Pat>> = Vec::new();

        let spine: Vec<Ident> = cons
            .args
            .iter()
            .map(|x| x.name.with_name(|f| format!("{}_", f)))
            .collect();

        pats.push(Box::new(Pat {
            data: concrete::pat::PatKind::App(
                cons_ident.clone(),
                spine
                    .iter()
                    .cloned()
                    .map(|x| {
                        Box::new(Pat {
                            data: concrete::pat::PatKind::Var(PatIdent(x)),
                            range,
                        })
                    })
                    .collect(),
            ),
            range,
        }));

        pats.push(Box::new(Pat {
            data: concrete::pat::PatKind::Var(PatIdent(Ident::generate("motive"))),
            range,
        }));

        for cons2 in &sum.constructors {
            pats.push(Box::new(Pat {
                data: concrete::pat::PatKind::Var(PatIdent(cons2.name.clone())),
                range,
            }));
        }

        let body = mk_app(
            mk_var(cons.name.clone()),
            spine
                .iter()
                .map(|arg| Binding::Positional(mk_var(arg.clone())))
                .collect(),
        );

        rules.push(Box::new(Rule {
            name: name.clone(),
            pats,
            body,
            range,
        }))
    }
    // Rules

    Entry {
        name,
        docs: Vec::new(),
        args: types,
        typ: ret_ty,
        rules,
        range,
        attrs: Vec::new(),
    }
}
