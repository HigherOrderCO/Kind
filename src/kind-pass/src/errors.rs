use kind_report::data::{DiagnosticFrame, Severity, Marking, Color};
use kind_span::Range;

/// Describes all of the possible errors inside each
/// of the passes inside this crate.
pub enum PassError {
    RepeatedVariable(Range, Range)
}

impl From<&PassError> for DiagnosticFrame {
    fn from(err: &PassError) -> Self {
        match *err {
            PassError::RepeatedVariable(first_decl, last_decl) => DiagnosticFrame {
                code: 0,
                severity: Severity::Error,
                title: "Repeated variable".to_string(),
                subtitles: vec![],
                hints: vec!["Rename one of the variables".to_string()],
                positions: vec![Marking {
                    position: last_decl,
                    color: Color::Fst,
                    text: "Second occurence".to_string(),
                },
                Marking {
                    position: first_decl,
                    color: Color::Snd,
                    text: "First occurence".to_string(),
                }],
            }
        }
    }
}
