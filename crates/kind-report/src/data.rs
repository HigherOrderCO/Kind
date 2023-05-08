use std::{time::Duration, path::PathBuf};

use kind_span::{Range, SyntaxCtxIndex};

use crate::RenderConfig;

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum Severity {
    Error,
    Warning,
    Info,
}

#[derive(Debug, Clone)]
pub enum Color {
    Fst,
    Snd,
    Thr,
    For,
    Fft,
}

#[derive(Debug, Clone)]
pub enum Word {
    Dimmed(String),
    White(String),
    Normal(String),
    Painted(Color, String),
}

#[derive(Debug, Clone)]
pub enum Subtitle {
    Field(Color, String),
    Normal(Color, String),
    Bold(Color, String),
    Phrase(Color, Vec<Word>),
    LineBreak,
}

#[derive(Debug, Clone)]
pub struct Marker {
    pub position: Range,
    pub color: Color,
    pub text: String,
    pub no_code: bool,
    pub main: bool,
}

#[derive(Debug, Clone)]
pub struct DiagnosticFrame {
    pub code: u32,
    pub severity: Severity,
    pub title: String,
    pub subtitles: Vec<Subtitle>,
    pub hints: Vec<String>,
    pub positions: Vec<Marker>,
}

pub struct Hints<'a>(pub &'a Vec<String>);

pub struct Subtitles<'a>(pub &'a Vec<Subtitle>);

pub struct Markers<'a>(pub &'a Vec<Marker>);

pub struct Header<'a> {
    pub severity: &'a Severity,
    pub title: &'a String
}

pub enum Log {
    Checking(String),
    Checked(Duration),
    Compiled(Duration),
    Rewrites(u64),
    Failed(Duration, u64, u64),
}

pub trait Diagnostic {
    fn get_syntax_ctx(&self) -> Option<SyntaxCtxIndex>;
    fn get_severity(&self) -> Severity;
    fn to_diagnostic_frame(&self, config: &RenderConfig) -> DiagnosticFrame;
}

pub trait FileCache {
    fn fetch(&self, ctx: SyntaxCtxIndex) -> Option<(PathBuf, &String)>;
}

impl DiagnosticFrame {
    pub fn subtitles(&self) -> Subtitles {
        Subtitles(&self.subtitles)
    }

    pub fn hints(&self) -> Hints {
        Hints(&self.hints)
    }

    pub fn header(&self) -> Header {
        Header {
            severity: &self.severity,
            title: &self.title
        }
    }

    pub fn markers(&self) -> Markers {
        Markers(&self.positions)
    }
}