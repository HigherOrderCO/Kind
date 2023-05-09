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
    pub only_main: bool,
    pub show_immediate_deps: bool,
}

impl<'a> RenderConfig<'a> {
    pub fn unicode(indent: usize, hide_vals: bool, only_main: bool, show_immediate_deps: bool) -> RenderConfig<'a> {
        RenderConfig {
            chars: Chars::unicode(),
            indent,
            hide_vals,
            mode: Mode::Classic,
            not_align: false,
            only_main,
            show_immediate_deps
        }
    }

    pub fn ascii(indent: usize, hide_vals: bool, only_main: bool, show_immediate_deps: bool) -> RenderConfig<'a> {
        RenderConfig {
            chars: Chars::ascii(),
            indent,
            hide_vals,
            mode: Mode::Classic,
            not_align: false,
            only_main,
            show_immediate_deps
        }
    }

    pub fn compact(indent: usize, only_main: bool, show_immediate_deps: bool) -> RenderConfig<'a> {
        RenderConfig {
            chars: Chars::ascii(),
            indent,
            hide_vals: true,
            mode: Mode::Compact,
            not_align: true,
            only_main,
            show_immediate_deps
        }
    }
}

pub fn check_if_colors_are_supported(disable: bool) {
    if disable || (cfg!(windows) && !Paint::enable_windows_ascii()) {
        Paint::disable();
    }
}

pub fn check_if_utf8_is_supported<'a>(disable: bool, indent: usize, hide_vals: bool, mode: Mode, only_main: bool, show_immediate_deps: bool) -> RenderConfig<'a> {
    match mode {
        Mode::Classic => {
            if disable || (cfg!(windows) && !Paint::enable_windows_ascii()) {
                RenderConfig::ascii(indent, hide_vals, only_main, show_immediate_deps)
            } else {
                RenderConfig::unicode(indent, hide_vals, only_main, show_immediate_deps)
            }
        },
        Mode::Compact => RenderConfig::compact(0, only_main, show_immediate_deps),
    }
}
