use kind_report::data::{Color, DiagnosticFrame, Marking, Severity};
use kind_span::Range;

/// Describes all of the possible errors inside each
/// of the passes inside this crate.
pub enum PassError {
    RepeatedVariable(Range, Range),
    CannotUseNamed(Range, Range),
    IncorrectArity(Range, usize, usize),
    DuplicatedNamed(Range, Range),
    LetDestructOnlyForRecord(Range),
    NoCoverage(Range, Vec<String>)
}

impl From<PassError> for DiagnosticFrame {
    fn from(err: PassError) -> Self {
        match err {
            PassError::LetDestructOnlyForRecord(place) => DiagnosticFrame {
                code: 0,
                severity: Severity::Error,
                title: "Can only destruct record types.".to_string(),
                subtitles: vec![],
                hints: vec![],
                positions: vec![Marking {
                    position: place,
                    color: Color::Fst,
                    text: "Here!".to_string(),
                    no_code: false,
                }],
            },
            PassError::NoCoverage(place, other) => DiagnosticFrame {
                code: 0,
                severity: Severity::Error,
                title: "The match is not covering all of the possibilities!".to_string(),
                subtitles: vec![],
                hints: vec![format!("Need a case for {}", other.join(", "))],
                positions: vec![Marking {
                    position: place,
                    color: Color::Fst,
                    text: "This function more cases!".to_string(),
                    no_code: false,
                }],
            },
            PassError::IncorrectArity(head_range, arguments, hiddens) => DiagnosticFrame {
                code: 0,
                severity: Severity::Error,
                title: "Incorrect arity".to_string(),
                subtitles: vec![],
                hints: vec![format!(
                    "Just complete the function to use {} (without hidden) or {} arguments",
                    arguments - hiddens,
                    arguments
                )],
                positions: vec![Marking {
                    position: head_range,
                    color: Color::Fst,
                    text: "This function requires a fixed number of arguments".to_string(),
                    no_code: false,
                }],
            },
            PassError::DuplicatedNamed(first_decl, last_decl) => DiagnosticFrame {
                code: 0,
                severity: Severity::Error,
                title: "Repeated named variable".to_string(),
                subtitles: vec![],
                hints: vec![],
                positions: vec![
                    Marking {
                        position: last_decl,
                        color: Color::Fst,
                        text: "Second occurence".to_string(),
                        no_code: false,
                    },
                    Marking {
                        position: first_decl,
                        color: Color::Snd,
                        text: "First occurence".to_string(),
                        no_code: false,
                    },
                ],
            },
            PassError::CannotUseNamed(fun_range, binding_range) => DiagnosticFrame {
                code: 0,
                severity: Severity::Error,
                title: "Cannot use named parameters in this type of function application"
                    .to_string(),
                subtitles: vec![],
                hints: vec![],
                positions: vec![
                    Marking {
                        position: fun_range,
                        color: Color::Fst,
                        text: "This is the head of the application".to_string(),
                        no_code: false,
                    },
                    Marking {
                        position: binding_range,
                        color: Color::Snd,
                        text: "This isn't allowed for this kind of application".to_string(),
                        no_code: false,
                    },
                ],
            },
            PassError::RepeatedVariable(first_decl, last_decl) => DiagnosticFrame {
                code: 0,
                severity: Severity::Error,
                title: "Repeated variable".to_string(),
                subtitles: vec![],
                hints: vec!["Rename one of the variables".to_string()],
                positions: vec![
                    Marking {
                        position: last_decl,
                        color: Color::Fst,
                        text: "Second occurence".to_string(),
                        no_code: false,
                    },
                    Marking {
                        position: first_decl,
                        color: Color::Snd,
                        text: "First occurence".to_string(),
                        no_code: false,
                    },
                ],
            },
        }
    }
}
