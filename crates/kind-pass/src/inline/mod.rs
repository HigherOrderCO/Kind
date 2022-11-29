use fxhash::FxHashMap;
use kind_tree::untyped;

use crate::unbound::subst::subst_on_expr;

struct Inlinable {
    names: Vec<String>,
    body: Box<untyped::Expr>,
}
struct InlineState {
    funs: FxHashMap<String, Inlinable>,
}

fn inlinable(entry: &untyped::Entry) -> Option<Inlinable> {
    if entry.rules.len() == 1 {
        let mut names = Vec::new();
        for pat in &entry.rules[0].pats {
            match &pat.data {
                untyped::ExprKind::Var { name } => names.push(name.to_string()),
                _ => return None,
            }
        }
        // TODO: Check if is recursive
        Some(Inlinable {
            names,
            body: entry.rules[0].body.clone(),
        })
    } else {
        None
    }
}

pub fn inline_book(book: &mut untyped::Book) {
    let mut funs = FxHashMap::default();

    let mut to_remove = Vec::new();

    for entr in book.entrs.values() {
        if entr.attrs.inlined {
            if let Some(inlinable) = inlinable(entr) {
                funs.insert(entr.name.to_string(), inlinable);
                to_remove.push(entr.name.to_string());
            }
        }
    }

    for name in &to_remove {
        book.entrs.remove(name);
    }

    let mut state = InlineState { funs };

    for entr in &mut book.entrs {
        state.inline_entry(entr.1)
    }
}

impl InlineState {
    fn inline_entry(&mut self, entry: &mut untyped::Entry) {
        for rule in &mut entry.rules {
            self.inline_expr(&mut rule.body)
        }
    }

    fn inline_expr(&mut self, expr: &mut Box<untyped::Expr>) {
        use untyped::ExprKind::*;
        match &mut expr.data {
            Lambda { body, .. } => self.inline_expr(body),
            App { fun, args } => {
                self.inline_expr(fun);
                for arg in args {
                    self.inline_expr(arg);
                }
            }
            Fun { name, args } | Ctr { name, args } => {
                if let Some(inlinable) = self.funs.get(name.to_str()) {
                    let subst =
                        FxHashMap::from_iter(inlinable.names.iter().cloned().zip(args.clone()));
                    *expr = inlinable.body.clone();
                    subst_on_expr(expr, subst);
                } else {
                    for arg in args {
                        self.inline_expr(arg);
                    }
                }
            }
            Let { val, next, .. } => {
                self.inline_expr(val);
                self.inline_expr(next);
            }
            Binary { left, right, .. } => {
                self.inline_expr(left);
                self.inline_expr(right);
            }
            _ => (),
        }
    }
}
