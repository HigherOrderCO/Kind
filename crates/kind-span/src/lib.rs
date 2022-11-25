/// Position in a syntax context.
#[derive(Clone, Copy, PartialEq, Eq, Hash, PartialOrd, Ord, Debug)]
pub struct Pos {
    pub index: u32,
}

/// A syntax context index.
#[derive(Clone, Copy, PartialEq, Eq, Hash, PartialOrd, Ord, Debug)]
pub struct SyntaxCtxIndex(pub usize);

impl SyntaxCtxIndex {
    pub fn new(size: usize) -> SyntaxCtxIndex {
        SyntaxCtxIndex(size)
    }
}

/// A span in the encoded format that is required by
/// kind2.
#[derive(Clone, Copy, PartialEq, Eq, Hash, PartialOrd, Ord, Debug)]
pub struct EncodedRange(pub u64);

/// Describes a position in a source code (syntax context). It's useful
/// to generate error messages.
#[derive(Clone, Debug, Copy, Hash, PartialEq, Eq)]
pub struct Range {
    pub start: Pos,
    pub end: Pos,
    pub ctx: SyntaxCtxIndex,
}

pub trait Locatable {
    fn locate(&self) -> Range;
}

impl Range {
    #[inline]
    pub fn new(start: Pos, end: Pos, ctx: SyntaxCtxIndex) -> Range {
        Range { start, end, ctx }
    }

    pub fn ghost_range() -> Range {
        Range::new(Pos { index: 0 }, Pos { index: 0 }, SyntaxCtxIndex(0))
    }

    /// Joins two ranges. It keeps the syntax context
    /// of the first one.
    #[inline]
    pub fn mix(&self, next: Range) -> Range {
        Range {
            start: self.start,
            end: next.end,
            ctx: self.ctx,
        }
    }

    /// Sets the context of the range,
    #[inline]
    pub fn set_ctx(&self, ctx: SyntaxCtxIndex) -> Range {
        Range {
            start: self.start,
            end: self.end,
            ctx,
        }
    }

    #[inline]
    pub fn encode(&self) -> EncodedRange {
        EncodedRange(
            ((self.ctx.0 as u64) << 48)
                | ((self.start.index as u64) & 0xFFFFFF)
                | (((self.end.index as u64) & 0xFFFFFF) << 24),
        )
    }
}

impl EncodedRange {
    /// Transforms a encoded span back into a range.
    pub fn to_range(&self) -> Range {
        Range {
            ctx: SyntaxCtxIndex((self.0 >> 48) as usize),
            start: Pos {
                index: (self.0 & 0xFFFFFF) as u32,
            },
            end: Pos {
                index: ((self.0 >> 24) & 0xFFFFFF) as u32,
            },
        }
    }
}
