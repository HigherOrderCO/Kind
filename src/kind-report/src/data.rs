use std::time::Duration;

use kind_span::{Range, SyntaxCtxIndex};

#[derive(Debug, Clone)]
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

pub enum Log {
    Checking(String),
    Checked(Duration),
    Failed(Duration),
}

pub trait Diagnostic {
    fn get_syntax_ctx(&self) -> Option<SyntaxCtxIndex>;
    fn to_diagnostic_frame(&self) -> DiagnosticFrame;
}
