use std::ops::Range;

/// A location between two byte positions
pub type Span = Range<usize>;

/// A data structure that has a position
pub struct Spanned<T> {
    data: T,
    span: Span
}
