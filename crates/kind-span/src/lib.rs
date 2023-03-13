/// Data structures to express locality in source code.
use std::fmt::{Debug, Display};
use std::hash::Hash;
use std::ops::Range;

/// A useful structure to be modified in the future in order to make things like
/// a Symbol interner.
pub struct Symbol(String);

impl Symbol {
    pub fn intern(str: String) -> Symbol {
        Symbol(str)
    }
}

impl Display for Symbol {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}", self.0)
    }
}

pub type Spanned<T> = (T, Span);

/// A index key to a source code.
#[derive(Clone, Copy, PartialEq, Eq, Hash, Debug)]
pub struct SyntaxCtxIndex(pub usize);

/// A location between two byte positions inside a string.
#[derive(Clone)]
pub struct Span(pub Range<usize>);

impl Span {
    pub fn mix(&self, other: &Span) -> Span {
        Span(self.0.start..other.0.end)
    }
}

impl Debug for Span {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{:?}", self.0)
    }
}

#[derive(Hash, PartialEq, Eq)]
pub enum NodeIdSegment {
    Symbol(u32),
    Index(u32),
}

impl From<Symbol> for NodeIdSegment {
    #[inline]
    fn from(value: Symbol) -> Self {
        NodeIdSegment::Symbol(fxhash::hash32(&value.0))
    }
}

/// A node identifier is a sequence of node identifier segments so each
/// identifier can form a tree like structure that is easier
pub struct NodeId {
    data: Vec<NodeIdSegment>,
    hash: u64,
}

impl PartialEq for NodeId {
    fn eq(&self, other: &Self) -> bool {
        self.hash == other.hash
    }
}

impl Eq for NodeId {
    fn assert_receiver_is_total_eq(&self) {}
}

impl Hash for NodeId {
    fn hash<H: std::hash::Hasher>(&self, state: &mut H) {
        self.hash.hash(state);
    }
}

impl NodeId {
    pub fn new(data: Vec<NodeIdSegment>) -> Self {
        NodeId {
            hash: fxhash::hash64(&data),
            data,
        }
    }

    pub fn segments(&self) -> &[NodeIdSegment] {
        &self.data
    }
}
