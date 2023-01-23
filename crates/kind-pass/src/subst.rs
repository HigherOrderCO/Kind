use fxhash::FxHashMap;
use kind_tree::desugared::*;

pub fn subst_on_expr(expr: &mut Expr, substs: FxHashMap<String, Box<Expr>>) {
    subst(Default::default(), expr, &substs)
}

fn subst(bindings: im_rc::HashSet<String>, expr: &mut Expr, substs: &FxHashMap<String, Box<Expr>>) {
    use ExprKind::*;

    match &mut expr.data {
        Var { name } => {
            if !bindings.contains(name.to_str()) {
                if let Some(res) = substs.get(name.to_str()) {
                    *expr = *res.clone();
                }
            }
        },
        All { param, typ, body, .. } => {
            subst(bindings.clone(), typ, substs);
            let mut on_body = bindings.clone();
            on_body.insert(param.to_string());
            subst(on_body.clone(), body, substs);
        },
        Lambda { param, body, .. } => {
            let mut on_body = bindings.clone();
            on_body.insert(param.to_string());
            subst(on_body.clone(), body, substs);
        },
        App { fun, args } => {
            subst(bindings.clone(), fun, substs);
            for arg in args.iter_mut() {
                subst(bindings.clone(), &mut arg.data, substs);
            }
        },
        Fun { name: _, args } | Ctr { name: _, args } => {
            for arg in args.iter_mut() {
                subst(bindings.clone(), arg, substs);
            }
        },
        Let { name, val, next } => {
            subst(bindings.clone(), val, substs);
            let mut on_body = bindings.clone();
            on_body.insert(name.to_string());
            subst(on_body.clone(), next, substs);
        },
        Ann { expr, typ } => {
            subst(bindings.clone(), expr, substs);
            subst(bindings.clone(), typ, substs);
        },
        Sub { expr, .. } => {
            subst(bindings.clone(), expr, substs);
        },
        Binary { left, right, .. } => {
            subst(bindings.clone(), left, substs);
            subst(bindings.clone(), right, substs);
        },
        _ => ()
    }
}

