use kind_report::data::{Color, Diagnostic, DiagnosticFrame, Marker, Severity};
use kind_span::Range;

pub(crate) enum DeriveError {
    CannotUseNamedVariable(Range),
}

impl Diagnostic for DeriveError {
    fn get_syntax_ctx(&self) -> Option<kind_span::SyntaxCtxIndex> {
        match self {
            DeriveError::CannotUseNamedVariable(range) => Some(range.ctx),
        }
    }

    fn to_diagnostic_frame(&self) -> DiagnosticFrame {
        match self {
            DeriveError::CannotUseNamedVariable(range) => DiagnosticFrame {
                code: 103,
                severity: Severity::Error,
                title: "Cannot use named variable on match derivations".to_string(),
                subtitles: vec![],
                hints: vec![],
                positions: vec![Marker {
                    position: *range,
                    color: Color::Fst,
                    text: "Here!".to_string(),
                    no_code: false,
                    main: true,
                }],
            },
        }
    }
}
