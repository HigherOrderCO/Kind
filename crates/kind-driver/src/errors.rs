//! Errors created by the driver. All of them
//! are related with paths and unbounded variables.

use std::{path::PathBuf, fmt::Display, error::Error};

use kind_report::data::{Color, Diagnostic, DiagnosticFrame, Marker, Severity, Subtitle, Word};
use kind_tree::symbol::{Ident, QualifiedIdent};

#[derive(Debug)]
pub struct GenericDriverError;

impl Display for GenericDriverError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "driver pass error")
    }
}

impl Error for GenericDriverError { }

/// Describes all of the possible errors inside each
/// of the passes inside this crate.
pub(crate) enum DriverError {
    CannotFindFile(String),
    UnboundVariable(Vec<Ident>, Vec<String>),
    MultiplePaths(QualifiedIdent, Vec<PathBuf>),
    DefinedMultipleTimes(QualifiedIdent, QualifiedIdent),
    ThereIsntAMain,
}

impl Diagnostic for DriverError {
    fn get_syntax_ctx(&self) -> Option<kind_span::SyntaxCtxIndex> {
        match self {
            DriverError::CannotFindFile(_) => None,
            DriverError::ThereIsntAMain => None,
            DriverError::UnboundVariable(v, _) => Some(v[0].range.ctx),
            DriverError::MultiplePaths(id, _) => Some(id.range.ctx),
            DriverError::DefinedMultipleTimes(fst, _) => Some(fst.range.ctx),
        }
    }

    fn to_diagnostic_frame(&self) -> DiagnosticFrame {
        match self {
            DriverError::UnboundVariable(idents, suggestions) => DiagnosticFrame {
                code: 100,
                severity: Severity::Error,
                title: format!("Cannot find the definition '{}'.", idents[0].to_str()),
                subtitles: vec![],
                hints: vec![if !suggestions.is_empty() {
                    format!(
                        "Maybe you're looking for {}",
                        suggestions.iter().map(|x| format!("'{}'", x)).collect::<Vec<String>>().join(", ")
                    )
                } else {
                    "Take a look at the rules for name searching at https://github.com/Kindelia/Kind2/blob/master/guide/naming.md".to_string()
                }],
                positions: idents
                    .iter()
                    .map(|ident| Marker {
                        position: ident.range,
                        color: Color::Fst,
                        text: "Here!".to_string(),
                        no_code: false,
                        main: true,
                    })
                    .collect(),
            },
            DriverError::MultiplePaths(ident, paths) => DiagnosticFrame {
                code: 101,
                severity: Severity::Error,
                title: "Ambiguous definition location for the same name".to_string(),
                subtitles: paths
                    .iter()
                    .map(|path| Subtitle::Phrase(Color::Fst, vec![Word::White(path.display().to_string())]))
                    .collect(),
                hints: vec!["Take a look at the rules for name searching at https://github.com/Kindelia/Kind2/blob/master/guide/naming.md".to_string()],
                positions: vec![Marker {
                    position: ident.range,
                    color: Color::Fst,
                    text: "Here!".to_string(),
                    no_code: false,
                    main: true,
                }],
            },
            DriverError::DefinedMultipleTimes(fst, snd) => DiagnosticFrame {
                code: 102,
                severity: Severity::Error,
                title: "Defined multiple times for the same name".to_string(),
                subtitles: vec![],
                hints: vec!["Rename one of the definitions or remove and look at how names work in Kind at https://github.com/Kindelia/Kind2/blob/master/guide/naming.md".to_string()],
                positions: vec![
                    Marker {
                        position: fst.range,
                        color: Color::Fst,
                        text: "The first ocorrence".to_string(),
                        no_code: false,
                        main: true,
                    },
                    Marker {
                        position: snd.range,
                        color: Color::Snd,
                        text: "Second occorrence here!".to_string(),
                        no_code: false,
                        main: false,
                    },
                ],
            },
            DriverError::CannotFindFile(file) => DiagnosticFrame {
                code: 103,
                severity: Severity::Error,
                title: format!("Cannot find file '{}'", file),
                subtitles: vec![],
                hints: vec![],
                positions: vec![],
            },

            DriverError::ThereIsntAMain => DiagnosticFrame {
                code: 103,
                severity: Severity::Error,
                title: "Cannot find 'Main' function to run the file.".to_string(),
                subtitles: vec![],
                hints: vec![],
                positions: vec![],
            },
        }
    }
}
