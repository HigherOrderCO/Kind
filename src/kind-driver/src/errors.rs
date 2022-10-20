use std::path::PathBuf;

use kind_report::data::{Color, DiagnosticFrame, Marking, Severity, Subtitle, Word};
use kind_tree::symbol::Ident;

/// Describes all of the possible errors inside each
/// of the passes inside this crate.
pub enum DriverError {
    UnboundVariable(Ident, Vec<String>),
    MultiplePaths(Ident, Vec<PathBuf>),
    DefinedMultipleTimes(Ident, Ident),
}

impl From<DriverError> for DiagnosticFrame {
    fn from(err: DriverError) -> Self {
        match err {
            DriverError::UnboundVariable(ident, suggestions) => DiagnosticFrame {
                code: 0,
                severity: Severity::Error,
                title: format!("Cannot find the definition '{}'.", ident.data.0),
                subtitles: vec![],
                hints: vec![
                    if !suggestions.is_empty() {
                        format!("Maybe you're looking for {}", suggestions.iter().map(|x| format!("'{}'", x)).collect::<Vec<String>>().join(", "))
                    } else {
                        "Take a look at the rules for name searching at https://kind.kindelia.org/hints/name-search".to_string()
                    }
                ],
                positions: vec![Marking {
                    position: ident.range,
                    color: Color::Fst,
                    text: "Here!".to_string(),
                    no_code: false,
                }],
            },
            DriverError::MultiplePaths(ident, paths) => DiagnosticFrame {
                code: 1,
                severity: Severity::Error,
                title: "Multiple definitions for the same name".to_string(),
                subtitles: paths.iter().map(|path|
                    Subtitle::Phrase(Color::Fst, vec![Word::White(path.display().to_string())])).collect(),
                hints: vec![
                    "Take a look at the rules for name searching at https://kind.kindelia.org/hints/name-search".to_string(),
                ],
                positions: vec![Marking {
                    position: ident.range,
                    color: Color::Fst,
                    text: "Here!".to_string(),
                    no_code: false,
                }],
            },
            DriverError::DefinedMultipleTimes(fst, snd) => DiagnosticFrame {
                code: 1,
                severity: Severity::Error,
                title: "Multiple paths for the same name".to_string(),
                subtitles: vec![],
                hints: vec![
                    "Rename one of the definitions or remove and look at how names work in Kind at https://kind.kindelia.org/hints/names".to_string()
                ],
                positions: vec![Marking {
                    position: fst.range,
                    color: Color::Fst,
                    text: "The first ocorrence".to_string(),
                    no_code: false,
                },Marking {
                    position: snd.range,
                    color: Color::Snd,
                    text: "Second occorrence here!".to_string(),
                    no_code: false,
                }],
            },
        }
    }
}
