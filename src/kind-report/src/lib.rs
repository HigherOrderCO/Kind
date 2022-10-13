/// Data structures
pub mod data;
/// Render
pub mod render;

#[derive(Debug)]
pub struct Chars {
    pub vbar: char,
    pub hbar: char,
    pub dbar: char,
    pub trline: char,
    pub bxline: char,
    pub brline: char,
    pub ylline: char,
}

impl Chars {
    pub fn unicode() -> &'static Chars {
        &Chars {
            vbar: '│',
            hbar: '─',
            dbar: '┆',
            trline: '└',
            bxline: '┬',
            brline: '┌',
            ylline: '├',
        }
    }
}

#[derive(Debug)]
pub struct RenderConfig<'a> {
    pub chars: &'a Chars,
    pub indent: usize,
}

impl<'a> RenderConfig<'a> {
    pub fn unicode(indent: usize) -> RenderConfig<'a> {
        RenderConfig { chars: Chars::unicode(), indent }
    }
}
