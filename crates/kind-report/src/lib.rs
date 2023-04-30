use report::Mode;
use yansi::Paint;

/// Data structures
pub mod data;

/// Render
pub mod report;

#[derive(Debug)]
pub struct Chars {
    pub vbar: char,
    pub hbar: char,
    pub dbar: char,
    pub trline: char,
    pub bxline: char,
    pub brline: char,
    pub ylline: char,
    pub bullet: char,
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
            bullet: '•',
        }
    }

    pub fn ascii() -> &'static Chars {
        &Chars {
            vbar: '|',
            hbar: '-',
            dbar: ':',
            trline: '\\',
            bxline: 'v',
            brline: '/',
            ylline: '-',
            bullet: '*',
        }
    }
}

#[derive(Debug)]
pub struct RenderConfig<'a> {
    pub chars: &'a Chars,
    pub indent: usize,
    pub hide_vals: bool,
    pub mode: Mode,
    pub not_align: bool,
}

impl<'a> RenderConfig<'a> {
    pub fn unicode(indent: usize, hide_vals: bool) -> RenderConfig<'a> {
        RenderConfig {
            chars: Chars::unicode(),
            indent,
            hide_vals,
            mode: Mode::Classic,
            not_align: false,
        }
    }

    pub fn ascii(indent: usize, hide_vals: bool) -> RenderConfig<'a> {
        RenderConfig {
            chars: Chars::ascii(),
            indent,
            hide_vals,
            mode: Mode::Classic,
            not_align: false,
        }
    }

    pub fn compact(indent: usize) -> RenderConfig<'a> {
        RenderConfig {
            chars: Chars::ascii(),
            indent,
            hide_vals: true,
            mode: Mode::Compact,
            not_align: true,
        }
    }
}

pub fn check_if_colors_are_supported(disable: bool) {
    if disable || (cfg!(windows) && !Paint::enable_windows_ascii()) {
        Paint::disable();
    }
}

pub fn check_if_utf8_is_supported<'a>(disable: bool, indent: usize, hide_vals: bool, mode: Mode) -> RenderConfig<'a> {
    match mode {
        Mode::Classic => {
            if disable || (cfg!(windows) && !Paint::enable_windows_ascii()) {
                RenderConfig::ascii(indent, hide_vals)
            } else {
                RenderConfig::unicode(indent, hide_vals)
            }
        },
        Mode::Compact => RenderConfig::compact(0),
    }
}
