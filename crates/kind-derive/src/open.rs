//! Module to derive a "open" function for records.

use kind_span::Range;

use kind_tree::concrete::expr::Expr;
use kind_tree::concrete::pat::{Pat, PatIdent};
use kind_tree::concrete::*;
use kind_tree::concrete::{self};
use kind_tree::symbol::{Ident, QualifiedIdent};
use kind_tree::telescope::Telescope;

pub fn derive_open(range: Range, rec: &RecordDecl) -> concrete::Entry {
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

    let mk_app = |fun: Box<Expr>, args: Vec<AppBinding>| -> Box<Expr> {
        Box::new(Expr {
            data: ExprKind::App { fun, args },
            range,
        })
    };

    let mk_pi = |name: Ident, typ: Box<Expr>, body: Box<Expr>, erased: bool| -> Box<Expr> {
        Box::new(Expr {
            data: ExprKind::All {
                param: Some(name),
                typ,
                body,
                erased,
            },
            range,
        })
    };

    let mut name = rec
        .name
        .add_segment(rec.constructor.to_str())
        .add_segment("open");

    name.range = rec.constructor.range;

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

    types.push(Argument {
        hidden: true,
        erased: true,
        name: Ident::generate("res_"),
        typ: None,
        range,
    });

    let cons_tipo = mk_var(Ident::generate("res_"));

    let cons_type = rec.fields.iter().rfold(cons_tipo, |out, (name, _, typ)| {
        mk_pi(name.clone(), typ.clone(), out, false)
    });

    // Sccrutinzies

    types.push(Argument {
        hidden: false,
        erased: false,
        name: Ident::generate("scrutinizer"),
        typ: Some(res_motive_ty),
        range,
    });

    types.push(Argument {
        hidden: false,
        erased: false,
        name: Ident::generate("fun"),
        typ: Some(cons_type),
        range,
    });

    // Motive with indices

    let ret_ty = mk_var(Ident::generate("res_"));

    let mut pats: Vec<Box<Pat>> = Vec::new();

    let spine: Vec<Ident> = rec
        .fields
        .iter()
        .map(|(name, _, _)| name.with_name(|f| format!("{}_", f)))
        .collect();

    pats.push(Box::new(Pat {
        data: concrete::pat::PatKind::App(
            rec.name.add_segment(rec.constructor.to_str()),
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
        data: concrete::pat::PatKind::Var(PatIdent(Ident::generate("fun_"))),
        range,
    }));

    let body = mk_app(
        mk_var(Ident::generate("fun_")),
        spine
            .iter()
            .map(|arg| AppBinding {
                data: mk_var(arg.clone()),
                erased: false,
            })
            .collect(),
    );

    let rules = vec![Box::new(Rule {
        name: name.clone(),
        pats,
        body,
        range: rec.constructor.range,
    })];

    Entry {
        name,
        docs: Vec::new(),
        args: types,
        typ: ret_ty,
        rules,
        range: rec.constructor.range,
        attrs: Vec::new(),
        generated_by: Some(rec.name.to_string()),
    }
}
