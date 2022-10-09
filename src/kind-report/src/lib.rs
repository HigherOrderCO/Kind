/// Data structures
pub mod data;
/// Render
pub mod render;

pub struct Chars {
    pub vbar: char,
    pub hbar: char,
    pub dbar: char,
    pub trline: char,
    pub bxline: char,
    pub brline: char,
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
        }
    }
}

pub struct RenderConfig<'a> {
    pub chars: &'a Chars,
    pub indent: usize,
}
