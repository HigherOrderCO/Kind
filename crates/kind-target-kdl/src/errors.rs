use kind_report::data::{Color, Diagnostic, DiagnosticFrame, Marker, Severity};
use kind_span::Range;

pub enum KdlError {
    InvalidVarName(Range),
    ShouldNotHaveArguments(Range),
    ShouldHaveOnlyOneRule(Range),
    NoInitEntry(Range),
    FloatUsed(Range),
}

impl Diagnostic for KdlError {
    fn get_syntax_ctx(&self) -> Option<kind_span::SyntaxCtxIndex> {
        match self {
            KdlError::InvalidVarName(range) => Some(range.ctx),
            KdlError::ShouldNotHaveArguments(range) => Some(range.ctx),
            KdlError::ShouldHaveOnlyOneRule(range) => Some(range.ctx),
            KdlError::NoInitEntry(range) => Some(range.ctx),
            KdlError::FloatUsed(range) => Some(range.ctx),
        }
    }

    fn to_diagnostic_frame(&self) -> kind_report::data::DiagnosticFrame {
        match self {
            KdlError::InvalidVarName(range) => DiagnosticFrame {
                code: 600,
                severity: Severity::Error,
                title: "Invalid variable name for Kindelia.".to_string(),
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
            KdlError::ShouldNotHaveArguments(range) => DiagnosticFrame {
                code: 601,
                severity: Severity::Error,
                title: "This type of entry should not have arguments".to_string(),
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
            KdlError::ShouldHaveOnlyOneRule(range) => DiagnosticFrame {
                code: 603,
                severity: Severity::Error,
                title: "This entry should only have one rule.".to_string(),
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
            KdlError::NoInitEntry(range) => DiagnosticFrame {
                code: 604,
                severity: Severity::Error,
                title: "This entry must have a init entry".to_string(),
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
            KdlError::FloatUsed(range) => DiagnosticFrame {
                code: 605,
                severity: Severity::Error,
                title: "Found F60 in kindelia program".to_string(),
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
