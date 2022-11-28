use fxhash::FxHashMap;
use kind_tree::untyped::*;

pub struct Subst {
    vars: FxHashMap<String, Box<Expr>>,
    ctx: im::HashSet<String>
}

pub fn subst_on_expr(expr: &mut Box<Expr>, vars: FxHashMap<String, Box<Expr>>) {
    let mut state = Subst {
        vars,
        ctx: Default::default(),
    };

    state.subst_expr(expr)
}

impl Subst {
    pub fn subst_entry(&mut self, entry: &mut Entry) {
        let backup = self.ctx.clone();

        self.ctx = backup;

        for rule in &mut entry.rules {
            self.subst_rule(rule);
        }

    }

    pub fn subst_rule(&mut self, rule: &mut Rule) {
        let backup = self.ctx.clone();
        
        for pat in &mut rule.pats {
            self.subst_expr(pat)
        }

        self.subst_expr(&mut rule.body);

        self.ctx = backup;
    }

    pub fn subst_pat(&mut self, expr: &mut Box<Expr>) {
        use ExprKind::*;

        match &mut expr.data {
            Var { name } => {
                self.ctx.insert(name.to_string());
            }
            Fun { name: _, args } | Ctr { name: _, args } => {
                for arg in args {
                    self.subst_pat(arg);
                }
            }
            _ => ()
        }
    }

    pub fn subst_expr(&mut self, expr: &mut Box<Expr>) {
        use ExprKind::*;

        match &mut expr.data {
            Var { name } => {
                if self.ctx.contains(name.to_str()) {
                    return;
                }
                if let Some(res) = self.vars.get(name.to_str()) {
                    *expr = res.clone().clone();
                }
            },
            Lambda { param, body, .. } => {
                let backup = self.ctx.clone();
                self.ctx.insert(param.to_string());
                self.subst_expr(body);
                self.ctx = backup;
            }
            App { fun, args } => {
                self.subst_expr(fun);
                for arg in args {
                    self.subst_expr(arg);
                }
            }
            Fun { name: _, args } | Ctr { name: _, args } => {
                for arg in args {
                    self.subst_expr(arg);
                }
            }
            Let { name, val, next } => {
                let backup = self.ctx.clone();
                self.ctx.insert(name.to_string());
                self.subst_expr(val);
                self.subst_expr(next);
                self.ctx = backup;
            }
            Binary { left, right, .. } => {
                self.subst_expr(left);
                self.subst_expr(right);
            }
            _ => ()
        }
    }
}