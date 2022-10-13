use kind_report::data::{Color, DiagnosticFrame, Marking, Severity};
use kind_tree::symbol::Ident;

/// Describes all of the possible errors inside each
/// of the passes inside this crate.
pub enum DriverError {
    UnboundVariable(Ident)
}

impl From<&DriverError> for DiagnosticFrame {
    fn from(err: &DriverError) -> Self {
        match err {
            DriverError::UnboundVariable(ident) => DiagnosticFrame {
                code: 0,
                severity: Severity::Error,
                title: "Cannot find the definition.".to_string(),
                subtitles: vec![],
                hints: vec!["Take a look at the rules for name searching at https://kind.kindelia.org/hints/name-search".to_string()],
                positions: vec![
                    Marking {
                        position: ident.range,
                        color: Color::Fst,
                        text: "Here!".to_string(),
                    },
                ],
            },
        }
    }
}
