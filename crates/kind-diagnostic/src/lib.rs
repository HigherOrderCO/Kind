//! Description and creation of diagnostics that are useful to report
//! useful information about the compilation process to the user.
//! The main structure of this module is the [Diagnostic] that can be
//! built using a [DiagnosticBuilder].

use kind_span::{Span, SyntaxCtxIndex};

pub struct Diagnostic {
    pub code: u32,
    pub severity: Severity,
    pub title: String,
    pub subtitles: Vec<Subtitle>,
    pub hints: Vec<String>,
    pub positions: Vec<Marker>,
}

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

/// Marks a position to highlight the code in the diagnostic message.
#[derive(Debug, Clone)]
pub struct Marker {
    pub position: Span,
    pub context: SyntaxCtxIndex,
    pub color: Color,
    pub text: String,
    pub no_code: bool,
    pub main: bool,
}

/// Part of a phrase that can be customized to fit some styles.
#[derive(Debug, Clone)]
pub enum Word {
    Dimmed(String),
    White(String),
    Normal(String),
    Painted(Color, String),
}

/// A phrase that fits in the second setion of the error message.
#[derive(Debug, Clone)]
pub enum Subtitle {
    Normal(Color, String),
    Bold(Color, String),
    Phrase(Color, Vec<Word>),
    LineBreak,
}

/// Builds a diagnostic with some functions.
pub struct DiagnosticBuilder {
    code: u32,
    title: String,
    subtitles: Vec<Subtitle>,
    hints: Vec<String>,
    severity: Severity,
    markers: Vec<Marker>,
}

impl DiagnosticBuilder {
    pub fn new(severity: Severity, title: String, code: u32) -> DiagnosticBuilder {
        DiagnosticBuilder {
            code,
            title,
            subtitles: Default::default(),
            hints: Default::default(),
            severity,
            markers: Default::default(),
        }
    }

    pub fn error(code: u32, title: String) -> DiagnosticBuilder {
        Self::new(Severity::Error, title, code)
    }

    pub fn warning(code: u32, title: String) -> DiagnosticBuilder {
        Self::new(Severity::Warning, title, code)
    }

    pub fn information(code: u32, title: String) -> DiagnosticBuilder {
        Self::new(Severity::Info, title, code)
    }

    pub fn with_subtitle(mut self, subtitle: Subtitle) -> DiagnosticBuilder {
        self.subtitles.push(subtitle);
        self
    }

    pub fn with_hint(mut self, hint: String) -> DiagnosticBuilder {
        self.hints.push(hint);
        self
    }

    pub fn mark(mut self, marker: Marker) -> DiagnosticBuilder {
        self.markers.push(marker);
        self
    }

    pub fn build(self) -> Diagnostic {
        Diagnostic {
            code: self.code,
            severity: self.severity,
            title: self.title,
            subtitles: self.subtitles,
            hints: self.hints,
            positions: self.markers,
        }
    }
}

pub trait IntoDiagnostic {
    fn into_diagnostic(self) -> Diagnostic;
}

#[cfg(test)]
mod test {
    use super::*;

    #[test]
    pub fn test_api() {
        let res = DiagnosticBuilder::error(1, "Unexpected String".to_string())
            .with_subtitle(Subtitle::Bold(Color::For, "ata".to_string()))
            .with_hint("T".to_string())
            .build();

        assert!(res.code == 1, "res code is equal to one");
    }
}
