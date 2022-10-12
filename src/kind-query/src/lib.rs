pub mod query;
pub mod core;

use std::{rc::Rc};


use kind_tree::{concrete, desugared};

#[kind_macros::make_provider]
pub trait Query {
    #[memoize]
    fn parse_book(&self, code: String) -> Rc<concrete::Book>;

    #[memoize]
    fn desugarize_book(&self, book: concrete::Book) -> Rc<desugared::Book>;

}
