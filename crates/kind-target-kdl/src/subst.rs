use kind_tree::{symbol::Ident, untyped::Expr};

pub fn subst(term: &mut Expr, from: &Ident, to: &Expr) {
    use kind_tree::untyped::ExprKind::*;
    match &mut term.data {
        Var { name } if from.to_str() == name.to_str() => *term = to.clone(),

        App { fun, args } => {
            subst(fun, from, to);
            for arg in args {
                subst(arg, from, to);
            }
        }

        Fun { args, .. } | Ctr { args, .. } => {
            for arg in args {
                subst(arg, from, to);
            }
        }

        Let { name, val, next } => {
            subst(val, from, to);
            if name.to_str() != from.to_str() {
                subst(next, from, to);
            }
        }

        Binary { op: _, left, right } => {
            subst(left, from, to);
            subst(right, from, to);
        }

        Lambda { param, body, .. } if param.to_str() != from.to_str() => subst(body, from, to),

        U60 { .. } => (),
        F60 { .. } => (),
        Str { .. } => (),
        Var { .. } => (),
        Lambda { .. } => (),

        Err => unreachable!("Err should not be used inside the compiler"),
    }
}
