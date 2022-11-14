//! Module to derive a dependent
//! eliminator out of a sum type declaration.

use kind_span::Range;

use kind_tree::concrete::expr::Expr;
use kind_tree::concrete::pat::{Pat, PatIdent};
use kind_tree::concrete::*;
use kind_tree::concrete::{self};
use kind_tree::symbol::{Ident, QualifiedIdent};

/// Derives an eliminator from a sum type declaration.
pub fn derive_match(range: Range, sum: &SumTypeDecl) -> concrete::Entry {
    let mk_var = |name: Ident| -> Box<Expr> { Box::new(Expr { data: ExprKind::Var(name), range }) };

    let mk_cons = |name: QualifiedIdent, spine: Vec<Binding>| -> Box<Expr> {
        Box::new(Expr {
            data: ExprKind::Constr(name, spine),
            range,
        })
    };

    let mk_app = |left: Box<Expr>, right: Vec<AppBinding>, range: Range| -> Box<Expr> {
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
    let res_motive_ty = mk_cons(sum.name.clone(), all_args.iter().cloned().map(|x| Binding::Positional(mk_var(x.name))).collect());

    let parameter_names: Vec<AppBinding> = sum.parameters.iter().map(|x| AppBinding::explicit(mk_var(x.name.clone()))).collect();

    let indice_names: Vec<AppBinding> = sum.indices.iter().map(|x| AppBinding::explicit(mk_var(x.name.clone()))).collect();

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

    let motive_type = sum
        .parameters
        .extend(&sum.indices)
        .iter()
        .rfold(mk_pi(Ident::new_static("_val", range), res_motive_ty, mk_typ()), |out, arg| {
            mk_pi(arg.name.clone(), arg.typ.clone().unwrap_or_else(mk_typ), out)
        });

    types.push(Argument {
        hidden: false,
        erased: true,
        name: motive_ident.clone(),
        typ: Some(motive_type),
        range,
    });

    let params = sum.parameters.map(|x| Binding::Positional(mk_var(x.name.clone())));
    let indices = sum.indices.map(|x| Binding::Positional(mk_var(x.name.clone())));

    // Constructors type
    for cons in &sum.constructors {
        let vars: Vec<Binding> = cons.args.iter().map(|x| Binding::Positional(mk_var(x.name.clone()))).collect();

        let cons_inst = mk_cons(
            sum.name.add_segment(cons.name.to_str()),
            [params.as_slice(), if cons.typ.is_none() { indices.as_slice() } else { &[] }, vars.as_slice()].concat(),
        );

        let mut indices_of_cons = match cons.typ.clone().map(|x| x.data) {
            Some(ExprKind::Constr(_, spine)) => spine
                .iter()
                .map(|x| match x {
                    Binding::Positional(expr) => AppBinding::explicit(expr.clone()),
                    Binding::Named(_, _, _) => todo!("Incomplete feature: Need to reorder"),
                })
                .collect(),
            _ => [parameter_names.as_slice(), indice_names.as_slice()].concat(),
        };

        indices_of_cons.push(AppBinding::explicit(cons_inst));

        let cons_tipo = mk_app(mk_var(motive_ident.clone()), indices_of_cons, range);

        let args = if cons.typ.is_some() {
            cons.args.clone()
        } else {
            sum.indices.extend(&cons.args)
        };

        let cons_type = args
            .iter()
            .rfold(cons_tipo, |out, arg| mk_pi(arg.name.clone(), arg.typ.clone().unwrap_or_else(mk_typ), out));

        types.push(Argument {
            hidden: false,
            erased: false,
            name: Ident::new_static(&format!("_{}", cons.name.to_string()), range),
            typ: Some(cons_type),
            range,
        });
    }

    let mut res: Vec<AppBinding> = [parameter_names.as_slice(), indice_names.as_slice()].concat();
    res.push(AppBinding::explicit(mk_var(Ident::generate("scrutinizer"))));
    let ret_ty = mk_app(mk_var(motive_ident), res, range);

    let mut rules = Vec::new();

    for cons in &sum.constructors {
        let cons_ident = sum.name.add_segment(cons.name.to_str());
        let mut pats: Vec<Box<Pat>> = Vec::new();

        let irrelev: Vec<bool>;
        let spine_params: Vec<Ident>;
        let spine: Vec<Ident>;

        if cons.typ.is_none() {
            irrelev = sum.indices.extend(&cons.args).map(|x| x.erased).to_vec();
            spine_params = sum
                .parameters
                .extend(&sum.indices)
                .extend(&cons.args)
                .map(|x| x.name.with_name(|f| format!("{}_", f)))
                .to_vec();
            spine = sum.indices.extend(&cons.args).map(|x| x.name.with_name(|f| format!("{}_", f))).to_vec();
        } else {
            irrelev = cons.args.map(|x| x.erased).to_vec();
            spine_params = sum.parameters.extend(&cons.args).map(|x| x.name.with_name(|f| format!("{}_", f))).to_vec();
            spine = cons.args.map(|x| x.name.with_name(|f| format!("{}_", f))).to_vec();
        }

        pats.push(Box::new(Pat {
            data: concrete::pat::PatKind::App(
                cons_ident.clone(),
                spine_params
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
                .zip(irrelev)
                .map(|(arg, erased)| AppBinding {
                    data: mk_var(arg.clone()),
                    erased,
                })
                .collect(),
            cons.name.range,
        );

        let rule = Box::new(Rule {
            name: name.clone(),
            pats,
            body,
            range: cons.name.range,
        });

        rules.push(rule)
    }
    // Rules

    let entry = Entry {
        name,
        docs: Vec::new(),
        args: types,
        typ: ret_ty,
        rules,
        range,
        attrs: Vec::new(),
    };

    entry
}
