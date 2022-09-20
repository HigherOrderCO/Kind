#[derive(Clone, PartialEq, Eq, Copy, Debug)]
pub struct ByteOffset(pub u32);

#[derive(Clone, PartialEq, Eq, Copy, Debug)]
pub struct FileOffset(pub u32);

#[derive(Clone, PartialEq, Eq, Copy, Debug)]
pub struct SpanData {
    pub start: ByteOffset,
    pub end: ByteOffset,
    pub file: FileOffset,
}

#[derive(Clone, PartialEq, Eq, Copy, Debug)]
pub enum Span {
    Generated,
    Localized(SpanData),
}

impl Span {
    #[inline]
    pub fn new(start: ByteOffset, end: ByteOffset, file: FileOffset) -> Span {
        Span::Localized(SpanData { start, end, file })
    }

    #[inline]
    pub fn new_off(start: ByteOffset, end: ByteOffset) -> Span {
        Span::Localized(SpanData { start, end, file: FileOffset(0) })
    }

    pub fn set_file(&self, new_file: FileOffset) -> Span {
        match self {
            Span::Generated => Span::Generated,
            Span::Localized(SpanData { start, end, .. }) => Span::Localized(SpanData {
                start: *start,
                end: *end,
                file: new_file,
            }),
        }
    }

    #[inline]
    pub fn generated() -> Span {
        Span::Generated
    }

    pub fn encode(&self) -> u64 {
        match self {
            Span::Generated => 0,
            Span::Localized(data) => ((data.file.0 as u64) << 48) | ((data.start.0 as u64) & 0xFFFFFF) | (((data.end.0 as u64) & 0xFFFFFF) << 24),
        }
    }
}

pub trait Localized {
    fn get_origin(&self) -> Span;
    fn set_origin_file(&mut self, file: FileOffset);
}
