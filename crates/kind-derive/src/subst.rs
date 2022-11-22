use fxhash::FxHashMap;
use kind_tree::{
    concrete::{expr::Expr, visitor::Visitor},
    symbol::Symbol,
};

pub struct Subst<'a> {
    pub names: &'a FxHashMap<String, String>,
}

impl<'a> Visitor for Subst<'a> {
    fn visit_ident(&mut self, ident: &mut kind_tree::symbol::Ident) {
        if let Some(res) = self.names.get(ident.to_str()) {
            ident.data = Symbol::new(res.clone());
        }
    }
}

pub fn substitute_in_expr(expr: &mut Expr, names: &FxHashMap<String, String>) {
    let mut session = Subst { names };
    session.visit_expr(expr)
}
