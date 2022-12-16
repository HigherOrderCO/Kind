//! Module to derive a dependent
//! eliminator out of a sum type declaration.

use fxhash::FxHashMap;
use kind_report::data::Diagnostic;
use kind_span::Range;

use kind_tree::concrete::expr::Expr;
use kind_tree::concrete::pat::{Pat, PatIdent, PatKind};
use kind_tree::concrete::*;
use kind_tree::concrete::{self};
use kind_tree::symbol::Ident;
use kind_tree::telescope::Telescope;

use crate::errors::DeriveError;
use crate::subst::substitute_in_expr;

type Errs = Vec<Box<dyn Diagnostic>>;

pub fn to_app_binding(errs: &mut Errs, binding: &Binding) -> AppBinding {
    match binding {
        Binding::Positional(expr) => AppBinding {
            erased: false,
            data: expr.clone(),
        },
        Binding::Named(_, name, expr) => {
            errs.push(Box::new(DeriveError::CannotUseNamedVariable(name.range)));
            AppBinding::explicit(expr.clone())
        }
    }
}

/// Derives an eliminator from a sum type declaration.
pub fn derive_match(range: Range, sum: &SumTypeDecl) -> (concrete::Entry, Errs) {
    let mut errs: Errs = Vec::new();

    let new_entry_name = sum.name.add_segment("match");

    let all_arguments = sum.parameters.extend(&sum.indices);

    // Parameters and indices

    let mut types = all_arguments.map(|x| x.to_implicit());

    let all_bindings = all_arguments
        .iter()
        .cloned()
        .map(|x| Binding::Positional(Expr::var(x.name)))
        .collect();

    let current_return_type = Expr::cons(sum.name.clone(), all_bindings, range);

    types.push(Argument {
        hidden: false,
        erased: false,
        name: Ident::generate("scrutineer"),
        typ: Some(current_return_type.clone()),
        range,
    });

    // Motive

    let motive_ident = Ident::new_static("motive", range);

    let motive_return = Expr::all(
        Ident::new_static("val_", range),
        current_return_type,
        Expr::typ(range),
        false,
        range,
    );

    let motive_type = sum.indices.iter().rfold(motive_return, |out, arg| {
        let typ = arg.typ.clone().unwrap_or_else(|| Expr::typ(range));
        Expr::all(arg.name.clone(), typ, out, false, range)
    });

    types.push(Argument {
        hidden: false,
        erased: true,
        name: motive_ident.clone(),
        typ: Some(motive_type),
        range,
    });

    // Constructors

    let indice_names: Vec<AppBinding> = sum
        .indices
        .iter()
        .map(|x| AppBinding::explicit(Expr::var(x.name.clone())))
        .collect();

    // Parameter binding telescope

    let params = sum
        .parameters
        .map(|x| Binding::Positional(Expr::var(x.name.clone())));

    let indices = sum
        .indices
        .map(|x| Binding::Positional(Expr::var(x.name.clone())));

    // Types

    for cons in &sum.constructors {
        // Constructor arguments bindings
        let vars = cons
            .args
            .map(|x| Binding::Positional(Expr::var(x.name.clone())));

        let constructor_name = sum.name.add_segment(cons.name.to_str());

        let default = &Telescope::default();
        let indices = &indices;

        let partial_indices = if cons.typ.is_none() { indices } else { default };

        let args = params.extend(partial_indices).extend(&vars);

        let instantation_of_the_cons = Expr::cons(constructor_name.clone(), args.to_vec(), range);

        let mut cons_indices = if let Some(res) = &cons.typ {
            if let ExprKind::Constr { args, .. } = &res.data {
                let mut new_args = Vec::with_capacity(args.len());
                for arg in &args[sum.parameters.len()..] {
                    new_args.push(match arg {
                        Binding::Positional(expr) => AppBinding::explicit(expr.clone()),
                        Binding::Named(range, _, expr) => {
                            errs.push(Box::new(DeriveError::CannotUseNamedVariable(*range)));
                            AppBinding::explicit(expr.clone())
                        }
                    });
                }
                new_args
            } else if let ExprKind::All { .. } = &res.data {
                errs.push(Box::new(DeriveError::CannotUseAll(res.range)));
                [indice_names.as_slice()].concat()
            } else {
                errs.push(Box::new(DeriveError::InvalidReturnType(res.range)));
                [indice_names.as_slice()].concat()
            }
        } else {
            [indice_names.as_slice()].concat()
        };

        cons_indices.push(AppBinding::explicit(instantation_of_the_cons));

        let cons_tipo = Expr::app(Expr::var(motive_ident.clone()), cons_indices, range);

        let args = if cons.typ.is_some() {
            cons.args.clone()
        } else {
            sum.indices.extend(&cons.args)
        };

        let cons_type = args.iter().rfold(cons_tipo, |out, arg| {
            Expr::all(
                arg.name.clone(),
                arg.typ.clone().unwrap_or_else(|| Expr::typ(range)),
                out,
                arg.erased,
                range,
            )
        });

        types.push(Argument::new_explicit(
            Ident::new_static(&format!("{}_", cons.name), range),
            cons_type,
            range,
        ));
    }

    let make_incomplete_entry = || {
        let typ = Box::new(Expr {
            data: ExprKind::Hole,
            range,
        });

        Entry {
            name: new_entry_name.clone(),
            docs: Vec::new(),
            args: types.clone(),
            typ,
            rules: vec![],
            range,
            attrs: Vec::new(),
            generated_by: Some(sum.name.to_string()),
        }
    };

    if !errs.is_empty() {
        return (make_incomplete_entry(), errs);
    }

    let scrutineer_ident = Expr::var(Ident::generate("scrutineer"));

    let mut return_args = indice_names.clone();
    return_args.push(AppBinding::explicit(scrutineer_ident));

    let return_type = Expr::app(Expr::var(motive_ident.clone()), return_args, range);

    // Rules

    let mut rules = Vec::new();

    for cons in &sum.constructors {
        let constructor_name = sum.name.add_segment(cons.name.to_str());

        let params = sum.parameters.map(|x| x.name.add_underscore());

        let mut indices_and_args: Telescope<AppBinding>;

        let args = if let Some(res) = &cons.typ {
            if let ExprKind::Constr { args, .. } = &res.data {
                indices_and_args =
                    Telescope::new(args.clone()).map(|x| to_app_binding(&mut errs, x));

                let mut indices = indices_and_args.to_vec()[sum.parameters.len()..].to_vec();

                let renames = FxHashMap::from_iter(
                    sum.parameters
                        .extend(&cons.args)
                        .map(|x| (x.name.to_string(), format!("{}_", x.name)))
                        .iter()
                        .cloned(),
                );

                for indice in &mut indices {
                    substitute_in_expr(&mut indice.data, &renames)
                }

                indices_and_args = Telescope::new(indices);

                cons.args.clone()
            } else {
                unreachable!(
                    "Internal Error: I guess you're using something that is not a constructor!"
                )
            }
        } else {
            indices_and_args = sum.indices.map(|x| AppBinding::from_ident(x.name.clone()));
            sum.indices.extend(&cons.args)
        };

        let irrelevances = args.map(|x| x.erased).to_vec();
        let spine = args.map(|x| x.name.add_underscore());

        let params_and_spine = params.extend(&spine);
        let mut pats = Vec::new();

        pats.push(Box::new(Pat {
            data: PatKind::App(
                constructor_name.clone(),
                params_and_spine
                    .iter()
                    .cloned()
                    .map(|x| {
                        Box::new(Pat {
                            data: PatKind::Var(PatIdent(x)),
                            range,
                        })
                    })
                    .collect(),
            ),
            range,
        }));

        pats.push(Box::new(Pat {
            data: PatKind::Var(PatIdent(Ident::generate("motive"))),
            range,
        }));

        for cons in &sum.constructors {
            pats.push(Box::new(Pat {
                data: PatKind::Var(PatIdent(cons.name.clone())),
                range,
            }));
        }

        let mut args = indices_and_args.clone();

        args.push(AppBinding::explicit(Expr::cons(
            constructor_name.clone(),
            params_and_spine
                .map(|x| Binding::Positional(Expr::var(x.clone())))
                .to_vec(),
            range,
        )));

        let body_typ = Expr::app(Expr::var(motive_ident.clone()), args.to_vec(), range);

        let body_val = Expr::app(
            Expr::var(cons.name.clone()),
            spine
                .iter()
                .zip(irrelevances)
                .map(|(arg, erased)| AppBinding {
                    data: Expr::var(arg.clone()),
                    erased,
                })
                .collect(),
            cons.name.range,
        );

        let body = Box::new(Expr {
            data: ExprKind::Ann {
                val: body_val,
                typ: body_typ,
            },
            range,
        });

        let rule = Box::new(Rule {
            name: new_entry_name.clone(),
            pats,
            body,
            range: cons.name.range,
        });

        rules.push(rule)
    }

    let entry = Entry {
        name: new_entry_name,
        docs: Vec::new(),
        args: types,
        typ: return_type,
        rules,
        range,
        attrs: Vec::new(),
        generated_by: Some(sum.name.to_string().clone()),
    };

    (entry, errs)
}
