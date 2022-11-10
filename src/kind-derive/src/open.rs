///! Module to derive a "open" function for records.
use kind_span::Range;

use kind_tree::concrete::expr::Expr;
use kind_tree::concrete::pat::{Pat, PatIdent};
use kind_tree::concrete::*;
use kind_tree::concrete::{self};
use kind_tree::symbol::{Ident, QualifiedIdent};

pub fn derive_open(range: Range, sum: &RecordDecl) -> concrete::Entry {
    let mk_var = |name: Ident| -> Box<Expr> {
        Box::new(Expr {
            data: ExprKind::Var(name),
            range,
        })
    };

    let mk_cons = |name: QualifiedIdent, spine: Vec<Binding>| -> Box<Expr> {
        Box::new(Expr {
            data: ExprKind::Constr(name, spine),
            range,
        })
    };

    let mk_app = |left: Box<Expr>, right: Vec<AppBinding>| -> Box<Expr> {
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

    let name = sum.name.add_segment("open");

    let mut types = Telescope::default();

    for arg in sum.parameters.iter() {
        types.push(arg.to_implicit())
    }

    // The type

    let all_args = sum.parameters.clone();
    let res_motive_ty = mk_cons(
        sum.name.clone(),
        all_args
            .iter()
            .cloned()
            .map(|x| Binding::Positional(mk_var(x.name)))
            .collect(),
    );

    types.push(Argument {
        hidden: true,
        erased: true,
        name: Ident::generate("_res"),
        typ: None,
        range,
    });

    let cons_tipo = mk_var(Ident::generate("_res"));

    let cons_type = sum.fields.iter().rfold(cons_tipo, |out, (name, _, typ)| {
        mk_pi(name.clone(), typ.clone(), out)
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

    let ret_ty = mk_var(Ident::generate("_res"));

    let mut pats: Vec<Box<Pat>> = Vec::new();

    let spine: Vec<Ident> = sum
        .fields
        .iter()
        .map(|(name, _, _)| name.with_name(|f| format!("{}_", f)))
        .collect();

    pats.push(Box::new(Pat {
        data: concrete::pat::PatKind::App(
            sum.name.add_segment(sum.constructor.to_str()),
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
            .map(|arg| AppBinding { data: mk_var(arg.clone()), erased: false })
            .collect(),
    );

    let rules = vec![Box::new(Rule {
        name: name.clone(),
        pats,
        body,
        range,
    })];

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
