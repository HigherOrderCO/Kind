use kind_report::data::{Color, Diagnostic, DiagnosticFrame, Marker, Severity};
use kind_span::Range;

pub(crate) enum DeriveDiagnostic {
    CannotUseNamedVariable(Range),
    CannotUseAll(Range),
    InvalidReturnType(Range),
}

impl Diagnostic for DeriveDiagnostic {
    fn get_syntax_ctx(&self) -> Option<kind_span::SyntaxCtxIndex> {
        match self {
            DeriveDiagnostic::CannotUseNamedVariable(range) => Some(range.ctx),
            DeriveDiagnostic::CannotUseAll(range) => Some(range.ctx),
            DeriveDiagnostic::InvalidReturnType(range) => Some(range.ctx),
        }
    }

    fn to_diagnostic_frame(&self, _: bool) -> DiagnosticFrame {
        match self {
            DeriveDiagnostic::CannotUseNamedVariable(range) => DiagnosticFrame {
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
            DeriveDiagnostic::CannotUseAll(range) => DiagnosticFrame {
                code: 103,
                severity: Severity::Error,
                title: "Data constructors cannot return function types.".to_string(),
                subtitles: vec![],
                hints: vec!["Change all of the function types sequence for explicit arguments like 'cons : x -> T' to 'cons (name: x) : T'".to_string()],
                positions: vec![Marker {
                    position: *range,
                    color: Color::Fst,
                    text: "Here!".to_string(),
                    no_code: false,
                    main: true,
                }],
            },
            DeriveDiagnostic::InvalidReturnType(range) => DiagnosticFrame {
                code: 103,
                severity: Severity::Error,
                title: "Data constructors cannot return this type".to_string(),
                subtitles: vec![],
                hints: vec!["Replace it with the type that is being declarated at the current block".to_string()],
                positions: vec![Marker {
                    position: *range,
                    color: Color::Fst,
                    text: "Here!".to_string(),
                    no_code: false,
                    main: true,
                }],
            }
        }
    }

    fn get_severity(&self) -> Severity {
        use DeriveDiagnostic::*;
        match self {
            CannotUseNamedVariable(_)
            | CannotUseAll(_)
            | InvalidReturnType(_) => Severity::Error,
        }
    }
}
