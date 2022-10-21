
use kind_report::data::{Color, DiagnosticFrame, Marking, Severity};
use kind_span::Range;

pub enum Sugar {
    DoNotation,
    List,
    Sigma,
    Pair,
    BoolIf,
}

/// Describes all of the possible errors inside each
/// of the passes inside this crate.
pub enum PassError {
    RepeatedVariable(Range, Range),
    CannotUseNamed(Range, Range),
    IncorrectArity(Range, usize, usize),
    DuplicatedNamed(Range, Range),
    LetDestructOnlyForRecord(Range),
    LetDestructOnlyForSum(Range),
    NoCoverage(Range, Vec<String>),
    CannotFindField(Range, Range, String),
    CannotFindConstructor(Range, Range, String),
    NeedToImplementMethods(Range, Sugar),
    RuleWithIncorrectArity(Range, usize, usize, usize),
    RulesWithInconsistentArity(Vec<(Range, usize)>),
    SugarIsBadlyImplemented(Range, Range, usize),
}

// TODO: A way to build an error message with methods
impl From<PassError> for DiagnosticFrame {
    fn from(err: PassError) -> Self {
        match err {
            PassError::LetDestructOnlyForRecord(place) => DiagnosticFrame {
                code: 200,
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
            PassError::RulesWithInconsistentArity(arities) => DiagnosticFrame {
                code: 201,
                severity: Severity::Error,
                title: "All of the rules of a entry should have the same number of patterns.".to_string(),
                subtitles: vec![],
                hints: vec![],
                positions: arities.iter().map(|(range, size)| {
                    Marking {
                        position: *range,
                        color: Color::Fst,
                        text: format!("This rule contains {} patterns", size),
                        no_code: false,
                    }
                }).collect(),
            },
            PassError::RuleWithIncorrectArity(place, _got, expected, hidden) => DiagnosticFrame {
                code: 203,
                severity: Severity::Error,
                title: "This rule is with the incorrect arity.".to_string(),
                subtitles: vec![],
                hints: vec![
                    if expected == 0 {
                        "This rule expects no arguments".to_string()
                    } else if hidden == 0 {
                        format!("This rule expects {} arguments", expected)
                    } else {
                        format!("This rule expects {} arguments or {} (without hidden ones)", expected, expected - hidden)
                    }
                ],
                positions: vec![Marking {
                    position: place,
                    color: Color::Fst,
                    text: "Here!".to_string(),
                    no_code: false,
                }],
            },
            PassError::NeedToImplementMethods(expr_place, sugar) => DiagnosticFrame {
                code: 204,
                severity: Severity::Error,
                title: "Required functions are not implemented for this type.".to_string(),
                subtitles: vec![],
                hints: vec![
                    match sugar {
                        Sugar::DoNotation => "You must implement 'bind' and 'pure' for this type in order to use the do notation.".to_string(),
                        Sugar::List => "You must implement 'List', 'List.cons' and 'List.nil' for this type in order to use the list notation.".to_string(),
                        Sugar::Sigma => "You must implement 'Sigma' in order to use the sigma notation.".to_string(),
                        Sugar::Pair => "You must implement 'Sigma' and 'Sigma.new' in order to use the sigma notation.".to_string(),
                        Sugar::BoolIf => "You must implement 'Bool.if' in order to use the if notation.".to_string(),
                    }
                ],
                positions: vec![Marking {
                    position: expr_place,
                    color: Color::Fst,
                    text: "Here!".to_string(),
                    no_code: false,
                }],
            },
            PassError::LetDestructOnlyForSum(place) => DiagnosticFrame {
                code: 206,
                severity: Severity::Error,
                title: "Can only use match on sum types.".to_string(),
                subtitles: vec![],
                hints: vec![],
                positions: vec![Marking {
                    position: place,
                    color: Color::Fst,
                    text: "Here!".to_string(),
                    no_code: false,
                }],
            },
            PassError::CannotFindField(place, def_name, ty) => DiagnosticFrame {
                code: 207,
                severity: Severity::Error,
                title: format!("Cannot find this field in the definition '{}'.", ty),
                subtitles: vec![],
                hints: vec![],
                positions: vec![Marking {
                    position: place,
                    color: Color::Fst,
                    text: "Here!".to_string(),
                    no_code: false,
                },Marking {
                    position: def_name,
                    color: Color::Snd,
                    text: "This is the definition name".to_string(),
                    no_code: false,
                }],
            },
            PassError::CannotFindConstructor(place, def_name, ty) => DiagnosticFrame {
                code: 208,
                severity: Severity::Error,
                title: format!("Cannot find this constructor in the type definition '{}'.", ty),
                subtitles: vec![],
                hints: vec![],
                positions: vec![Marking {
                    position: place,
                    color: Color::Fst,
                    text: "Here!".to_string(),
                    no_code: false,
                },Marking {
                    position: def_name,
                    color: Color::Snd,
                    text: "This is the definition name".to_string(),
                    no_code: false,
                }],
            },
            PassError::NoCoverage(place, other) => DiagnosticFrame {
                code: 209,
                severity: Severity::Error,
                title: "The match is not covering all of the possibilities!".to_string(),
                subtitles: vec![],
                hints: vec![format!("Need a case for {}", other.iter().map(|x| format!("'{}'", x)).collect::<Vec<String>>().join(", "))],
                positions: vec![Marking {
                    position: place,
                    color: Color::Fst,
                    text: "This is the incomplete case".to_string(),
                    no_code: false,
                }],
            },
            PassError::IncorrectArity(head_range, expected, hidden) => DiagnosticFrame {
                code: 210,
                severity: Severity::Error,
                title: "Incorrect arity".to_string(),
                subtitles: vec![],
                hints: vec![
                    if expected == 0 {
                        "This function expects no arguments".to_string()
                    } else if hidden == 0 {
                        format!("This function expects {} arguments", expected)
                    } else {
                        format!("This function expects {} arguments or {} (without hidden ones)", expected, expected - hidden)
                    }
                ],
                positions: vec![Marking {
                    position: head_range,
                    color: Color::Fst,
                    text: "This function requires a fixed number of arguments".to_string(),
                    no_code: false,
                }],
            },
            PassError::SugarIsBadlyImplemented(head_range, place_range, expected) => DiagnosticFrame {
                code: 211,
                severity: Severity::Error,
                title: "Incorrect arity in the sugar definition".to_string(),
                subtitles: vec![],
                hints: vec![format!(
                    "Take a look at how sugar functions should be implemented at https://kind2.kindelia.com/hints/sugars."
                )],
                positions: vec![Marking {
                    position: head_range,
                    color: Color::Fst,
                    text:
                        if expected == 0 {
                            "This rule expects no arguments".to_string()
                        } else {
                            format!("This rule expects {} explicit arguments", expected)
                        }
                    ,
                    no_code: false,
                },Marking {
                    position: place_range,
                    color: Color::Snd,
                    text: "This is what triggers the sugar".to_string(),
                    no_code: false,
                }],
            },
            PassError::DuplicatedNamed(first_decl, last_decl) => DiagnosticFrame {
                code: 212,
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
                code: 213,
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
                code: 214,
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
