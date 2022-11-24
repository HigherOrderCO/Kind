use fxhash::FxHashMap;
use kind_tree::desugared as kind;
pub use kindelia_lang::ast as kdl;
use linked_hash_map::LinkedHashMap;

pub struct File {
    funs: LinkedHashMap<String, kdl::Statement>,
    runs: Vec<kdl::Statement>,
}

pub struct CompileCtx<'a> {
    file: File,
    kdl_names: FxHashMap<String, kdl::Name>,
    kdl_states: Vec<String>,
    book: &'a kind::Book,
}

pub fn compile_book(book: &kind::Book) -> File {
    let mut ctx = CompileCtx {
        file: File {
            funs: Default::default(),
            runs: Default::default(),
        },
        kdl_names: Default::default(),
        kdl_states: Default::default(),
        book,
    };
    for (_name, entry) in &book.entrs {
        compile_entry(&mut ctx, entry);
    }
    ctx.file
}

pub fn compile_entry(ctx: &mut CompileCtx, entry: &kind::Entry) {
    let is_erased = entry
        .attrs
        .iter()
        .find(|x| matches!(x, kind::Attribute::KdlErase))
        .is_some();
    if is_erased {
        // Don't compile
        return;
    }
    let is_run = entry
        .attrs
        .iter()
        .find(|x| matches!(x, kind::Attribute::KdlRun))
        .is_some();
    if is_run {
        // Compile as Run
        if entry.args.len() != 0 {
            todo!(); // run has args
        } else if entry.rules.len() != 1 {
            todo!(); // run doesn't have exactly 1 rule
        } else {
            let expr = compile_expr(ctx, &entry.rules[0].body);
            let statement = kdl::Statement::Run { expr, sign: None };
            ctx.file.runs.push(statement);
        }
    } else {
        // Shared between Ctr and Fun
        let name = ctx.kdl_names.get(&entry.name.to_string()).unwrap().clone();
        let mut args = Vec::new();
        for arg in &entry.args {
            let name = arg.name.to_str();
            if let Ok(name) = kdl::Name::from_str(name) {
                args.push(name);
            } else {
                todo!(); // arg name not valid kdl name
            }
        }
        if entry.rules.len() == 0 {
            // Compile as Ctr
            let stmt = kdl::Statement::Ctr {
                name,
                args,
                sign: None,
            };
            ctx.file.funs.insert(entry.name.to_string(), stmt);
        } else {
            // Compile as Fun
            let mut rules = Vec::new();
            for rule in &entry.rules {
                rules.push(compile_rule(ctx, rule));
            }
            let func = kdl::Func { rules };
            let attr = entry
                .attrs
                .iter()
                .find(|x| matches!(x, kind::Attribute::KdlState(_)));
            let init = if let Some(kind::Attribute::KdlState(init_name)) = attr {
                let init_entry = ctx.book.entrs.get(init_name.to_str());
                if let Some(init_entry) = init_entry {
                    // Has some initial state
                    if init_entry.args.len() != 0 {
                        todo!(); // state has args
                    } else if init_entry.rules.len() != 1 {
                        todo!(); // state doesn't have exactly 1 rule
                    } else {
                        ctx.kdl_states.push(init_name.to_string());
                        let init = compile_expr(ctx, &init_entry.rules[0].body);
                        Some(init)
                    }
                } else {
                    todo!(); // Init state not defined
                }
            } else {
                todo!(); // Has no initial state
            };
            let stmt = kdl::Statement::Fun {
                name,
                args,
                func,
                init,
                sign: None,
            };
            ctx.file.funs.insert(entry.name.to_string(), stmt);
        }
    }
}

pub fn compile_rule(ctx: &mut CompileCtx, rule: &kind::Rule) -> kdl::Rule {
    let name = ctx.kdl_names.get(rule.name.to_str()).unwrap().clone();
    let mut args = Vec::new();
    for pat in &rule.pats {
        let arg = compile_expr(ctx, pat);
        args.push(arg);
    }
    let lhs = kdl::Term::fun(name, args);
    let rhs = compile_expr(ctx, &rule.body);
    let rule = kdl::Rule { lhs, rhs };
    rule
}

pub fn compile_expr(ctx: &mut CompileCtx, expr: &kind::Expr) -> kdl::Term {
    use kdl::Term as T;
    use kind::ExprKind as E;
    match &expr.data {
        E::App(head, spine) => {
            let mut expr = compile_expr(ctx, head);
            for binding in spine {
                let body = compile_expr(ctx, &binding.data);
                expr = T::App {
                    func: Box::new(expr),
                    argm: Box::new(body),
                };
            }
            expr
        }
        E::Binary(op, x0, x1) => {
            // TODO: Special compilation for U60 ops
            let oper = compile_oper(op);
            let val0 = Box::new(compile_expr(ctx, x0));
            let val1 = Box::new(compile_expr(ctx, x1));
            T::Op2 { oper, val0, val1 }
        }
        E::Ctr(name, spine) => {
            let name = ctx.kdl_names.get(name.to_str()).unwrap().clone();
            let mut args = Vec::new();
            for arg in spine {
                args.push(compile_expr(ctx, &arg));
            }
            T::Ctr { name, args }
        }
        E::Fun(name, spine) => {
            // TODO: Special compilation for U60 and U120 ops
            let name = ctx.kdl_names.get(name.to_str()).unwrap().clone();
            let mut args = Vec::new();
            for arg in spine {
                args.push(compile_expr(ctx, &arg));
            }
            T::Fun { name, args }
        }
        E::Lambda(name, body, _) => {
            let name = kdl::Name::from_str(name.to_str());
            if let Ok(name) = name {
                let body = Box::new(compile_expr(ctx, &body));
                T::Lam { name, body }
            } else {
                todo!(); // var name not valid
            }
        }
        E::Let(name, expr, body) => {
            let name = kdl::Name::from_str(name.to_str());
            if let Ok(name) = name {
                let expr = Box::new(compile_expr(ctx, &expr));
                let func = Box::new(T::Lam { name, body: expr });
                let argm = Box::new(compile_expr(ctx, body));
                T::App { func, argm }
            } else {
                todo!(); // var name not valid
            }
        }
        E::Num(kind::Number::U60(numb)) => T::Num {
            numb: kdl::U120(*numb as u128),
        },
        E::Num(kind::Number::U120(numb)) => T::Num {
            numb: kdl::U120(*numb),
        },
        E::Var(name) => {
            let name = kdl::Name::from_str(name.to_str());
            if let Ok(name) = name {
                T::Var { name }
            } else {
                todo!(); // var name not valid
            }
        }
        E::All(..) => unreachable!(),
        E::Ann(..) => unreachable!(),
        E::Hlp(..) => unreachable!(),
        E::Hole(..) => unreachable!(),
        E::NumType(..) => unreachable!(),
        E::Str(..) => unreachable!(),
        E::Sub(..) => unreachable!(),
        E::Typ => unreachable!(),
        E::Err => unreachable!(),
    }
}

fn compile_oper(oper: &kind::Operator) -> kdl::Oper {
    use kdl::Oper as T;
    use kind::Operator as F;
    match oper {
        F::Add => T::Add,
        F::Sub => T::Sub,
        F::Mul => T::Mul,
        F::Div => T::Div,
        F::Mod => T::Mod,
        F::Shl => T::Shl,
        F::Shr => T::Shr,
        F::Eql => T::Eql,
        F::Neq => T::Neq,
        F::Ltn => T::Ltn,
        F::Lte => T::Lte,
        F::Gte => T::Gte,
        F::Gtn => T::Gtn,
        F::And => T::And,
        F::Xor => T::Xor,
        F::Or => T::Or,
    }
}
