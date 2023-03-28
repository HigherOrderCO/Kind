use crate::fetch::Is;
use kind_syntax::concrete;

pub enum Query<A> {
    Find(Is<A, concrete::TopLevel>, String), // CST
}
