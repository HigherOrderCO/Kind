use kind_report::data::{Color, Diagnostic, DiagnosticFrame, Marker, Severity};
use kind_span::Range;

pub enum KdlDiagnostic {
    InvalidVarName(Range),
    ShouldNotHaveArguments(Range),
    ShouldHaveOnlyOneRule(Range),
    NoInitEntry(Range),
    FloatUsed(Range),
}

impl Diagnostic for KdlDiagnostic {
    fn get_syntax_ctx(&self) -> Option<kind_span::SyntaxCtxIndex> {
        match self {
            KdlDiagnostic::InvalidVarName(range) => Some(range.ctx),
            KdlDiagnostic::ShouldNotHaveArguments(range) => Some(range.ctx),
            KdlDiagnostic::ShouldHaveOnlyOneRule(range) => Some(range.ctx),
            KdlDiagnostic::NoInitEntry(range) => Some(range.ctx),
            KdlDiagnostic::FloatUsed(range) => Some(range.ctx),
        }
    }

    fn to_diagnostic_frame(&self) -> kind_report::data::DiagnosticFrame {
        match self {
            KdlDiagnostic::InvalidVarName(range) => DiagnosticFrame {
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
            KdlDiagnostic::ShouldNotHaveArguments(range) => DiagnosticFrame {
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
            KdlDiagnostic::ShouldHaveOnlyOneRule(range) => DiagnosticFrame {
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
            KdlDiagnostic::NoInitEntry(range) => DiagnosticFrame {
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
            KdlDiagnostic::FloatUsed(range) => DiagnosticFrame {
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

    fn get_severity(&self) -> Severity {
        use KdlDiagnostic::*;
        match self {
            InvalidVarName(_)
            | ShouldNotHaveArguments(_)
            | ShouldHaveOnlyOneRule(_)
            | NoInitEntry(_)
            | FloatUsed(_) => Severity::Error
        }
    }
}
