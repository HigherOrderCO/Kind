use kind_report::data::{Color, Diagnostic, DiagnosticFrame, Marker, Severity};
use kind_span::{Range, Span, SyntaxCtxIndex};
use kind_tree::symbol::Ident;

pub enum Sugar {
    DoNotation,
    List,
    Sigma,
    Pair,
    BoolIf,
    Match(String),
    Open(String),
}

/// Describes all of the possible errors inside each
/// of the passes inside this crate.
pub enum PassError {
    RepeatedVariable(Range, Range),
    IncorrectArity(Range, Vec<Range>, usize, usize),
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
    CannotUseIrrelevant(Option<Range>, Range, Option<Range>),
    CannotFindAlias(String, Range),
    NotATypeConstructor(Range, Range),
    ShouldBeAParameter(Span, Range),
    NoFieldCoverage(Range, Vec<String>),
    CannotPatternMatchOnErased(Range),
    UnboundVariable(Vec<Ident>, Vec<String>),

    AttributeDoesNotExpectEqual(Range),
    AttributeDoesNotExpectArgs(Range),
    InvalidAttributeArgument(Range),
    AttributeExpectsAValue(Range),
    DuplicatedAttributeArgument(Range, Range),
    CannotDerive(String, Range),
    AttributeDoesNotExists(Range),
}

// TODO: A way to build an error message with methods
impl Diagnostic for PassError {
    fn get_syntax_ctx(&self) -> Option<SyntaxCtxIndex> {
        match self {
            PassError::RepeatedVariable(range, _) => Some(range.ctx),
            PassError::IncorrectArity(range, _, _, _) => Some(range.ctx),
            PassError::DuplicatedNamed(range, _) => Some(range.ctx),
            PassError::LetDestructOnlyForRecord(range) => Some(range.ctx),
            PassError::LetDestructOnlyForSum(range) => Some(range.ctx),
            PassError::NoCoverage(range, _) => Some(range.ctx),
            PassError::CannotFindField(range, _, _) => Some(range.ctx),
            PassError::CannotFindConstructor(range, _, _) => Some(range.ctx),
            PassError::NeedToImplementMethods(range, _) => Some(range.ctx),
            PassError::RuleWithIncorrectArity(range, _, _, _) => Some(range.ctx),
            PassError::RulesWithInconsistentArity(range) => Some(range[0].0.ctx),
            PassError::SugarIsBadlyImplemented(range, _, _) => Some(range.ctx),
            PassError::CannotUseIrrelevant(_, range, _) => Some(range.ctx),
            PassError::CannotFindAlias(_, range) => Some(range.ctx),
            PassError::NotATypeConstructor(range, _) => Some(range.ctx),
            PassError::ShouldBeAParameter(_, range) => Some(range.ctx),
            PassError::NoFieldCoverage(range, _) => Some(range.ctx),
            PassError::CannotPatternMatchOnErased(range) => Some(range.ctx),
            PassError::UnboundVariable(ranges, _) => Some(ranges[0].range.ctx),
            PassError::AttributeDoesNotExpectEqual(range) => Some(range.ctx),
            PassError::AttributeDoesNotExpectArgs(range) => Some(range.ctx),
            PassError::InvalidAttributeArgument(range) => Some(range.ctx),
            PassError::AttributeExpectsAValue(range) => Some(range.ctx),
            PassError::DuplicatedAttributeArgument(range, _) => Some(range.ctx),
            PassError::CannotDerive(_, range) => Some(range.ctx),
            PassError::AttributeDoesNotExists(range) => Some(range.ctx),
        }
    }

    fn to_diagnostic_frame(&self) -> DiagnosticFrame {
        match self {
            PassError::UnboundVariable(idents, suggestions) => DiagnosticFrame {
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
                    "Take a look at the rules for name searching at https://kind.kindelia.org/hints/name-search".to_string()
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
            PassError::CannotUseIrrelevant(var_decl, place, declarated_place) => {
                let mut positions = vec![Marker {
                    position: *place,
                    color: Color::Fst,
                    text: "It's in relevant position!".to_string(),
                    no_code: false,
                    main: true,
                }];

                if let Some(range) = declarated_place {
                    positions.push(Marker {
                        position: *range,
                        color: Color::Snd,
                        text: "Declared here as erased (or implicit without '+')".to_string(),
                        no_code: false,
                        main: false,
                    })
                }

                if let Some(range) = var_decl {
                    positions.push(Marker {
                        position: *range,
                        color: Color::Thr,
                        text: "This variable corresponds to the erased argument".to_string(),
                        no_code: false,
                        main: false,
                    });
                }

                DiagnosticFrame {
                    code: 200,
                    severity: Severity::Error,
                    title: "This irrelevant parameter should not be used in a relevant position.".to_string(),
                    subtitles: vec![],
                    hints: vec![],
                    positions,
                }
            }
            PassError::LetDestructOnlyForRecord(place) => DiagnosticFrame {
                code: 200,
                severity: Severity::Error,
                title: "Can only destruct record types.".to_string(),
                subtitles: vec![],
                hints: vec![],
                positions: vec![Marker {
                    position: *place,
                    color: Color::Fst,
                    text: "Here!".to_string(),
                    no_code: false,
                    main: true,
                }],
            },
            PassError::CannotPatternMatchOnErased(place) => DiagnosticFrame {
                code: 223,
                severity: Severity::Error,
                title: "Cannot pattern match on erased arguments.".to_string(),
                subtitles: vec![],
                hints: vec![],
                positions: vec![Marker {
                    position: *place,
                    color: Color::Fst,
                    text: "Here!".to_string(),
                    no_code: false,
                    main: true,
                }],
            },
            PassError::RulesWithInconsistentArity(arities) => DiagnosticFrame {
                code: 201,
                severity: Severity::Error,
                title: "All of the rules of a entry should have the same number of patterns.".to_string(),
                subtitles: vec![],
                hints: vec!["Check if you're trying to use a function that manipulats erased variables.".to_string()],
                positions: arities
                    .iter()
                    .map(|(range, size)| Marker {
                        position: *range,
                        color: Color::Fst,
                        text: format!("This rule contains {} patterns", size),
                        no_code: false,
                        main: true,
                    })
                    .collect(),
            },
            PassError::RuleWithIncorrectArity(place, _got, expected, hidden) => DiagnosticFrame {
                code: 203,
                severity: Severity::Error,
                title: "This rule is with the incorrect arity.".to_string(),
                subtitles: vec![],
                hints: vec![if *expected == 0 {
                    "This rule expects no arguments".to_string()
                } else if *hidden == 0 {
                    format!("This rule expects {} arguments", expected)
                } else {
                    format!("This rule expects {} arguments or {} (without hidden ones)", expected, expected - hidden)
                }],
                positions: vec![Marker {
                    position: *place,
                    color: Color::Fst,
                    text: "Here!".to_string(),
                    no_code: false,
                    main: true,
                }],
            },
            PassError::NeedToImplementMethods(expr_place, sugar) => DiagnosticFrame {
                code: 204,
                severity: Severity::Error,
                title: "Required functions are not implemented for this type.".to_string(),
                subtitles: vec![],
                hints: vec![match sugar {
                    Sugar::DoNotation => "You must implement 'bind' and 'pure' for this type in order to use the do notation.".to_string(),
                    Sugar::List => "You must implement 'List', 'List.cons' and 'List.nil' for this type in order to use the list notation.".to_string(),
                    Sugar::Sigma => "You must implement 'Sigma' in order to use the sigma notation.".to_string(),
                    Sugar::Pair => "You must implement 'Sigma' and 'Sigma.new' in order to use the sigma notation.".to_string(),
                    Sugar::BoolIf => "You must implement 'Bool.if' in order to use the if notation.".to_string(),
                    Sugar::Match(name) => format!("You must implement '{}.match' in order to use the match notation (or derive match with #derive[match]).", name),
                    Sugar::Open(name) => format!("You must implement '{}.open' in order to use the open notation (or derive open with #derive[open]).", name),
                }],
                positions: vec![Marker {
                    position: *expr_place,
                    color: Color::Fst,
                    text: "You cannot use this expression!".to_string(),
                    no_code: false,
                    main: true,
                }],
            },
            PassError::LetDestructOnlyForSum(place) => DiagnosticFrame {
                code: 206,
                severity: Severity::Error,
                title: "Can only use match on sum types.".to_string(),
                subtitles: vec![],
                hints: vec![],
                positions: vec![Marker {
                    position: *place,
                    color: Color::Fst,
                    text: "Here!".to_string(),
                    no_code: false,
                    main: true,
                }],
            },
            PassError::CannotFindField(place, def_name, ty) => DiagnosticFrame {
                code: 207,
                severity: Severity::Error,
                title: format!("Cannot find this field in the definition '{}'.", ty),
                subtitles: vec![],
                hints: vec![],
                positions: vec![
                    Marker {
                        position: *place,
                        color: Color::Fst,
                        text: "Here!".to_string(),
                        no_code: false,
                        main: true,
                    },
                    Marker {
                        position: *def_name,
                        color: Color::Snd,
                        text: "This is the definition name".to_string(),
                        no_code: false,
                        main: false,
                    },
                ],
            },
            PassError::CannotFindConstructor(place, def_name, ty) => DiagnosticFrame {
                code: 208,
                severity: Severity::Error,
                title: format!("Cannot find this constructor in the type definition '{}'.", ty),
                subtitles: vec![],
                hints: vec![],
                positions: vec![
                    Marker {
                        position: *place,
                        color: Color::Fst,
                        text: "Here!".to_string(),
                        no_code: false,
                        main: true,
                    },
                    Marker {
                        position: *def_name,
                        color: Color::Snd,
                        text: "This is the definition name".to_string(),
                        no_code: false,
                        main: false,
                    },
                ],
            },
            PassError::NoCoverage(place, other) => DiagnosticFrame {
                code: 209,
                severity: Severity::Error,
                title: "The match is not covering all of the possibilities!".to_string(),
                subtitles: vec![],
                hints: vec![format!("Need a case for {}", other.iter().map(|x| format!("'{}'", x)).collect::<Vec<String>>().join(", "))],
                positions: vec![Marker {
                    position: *place,
                    color: Color::Fst,
                    text: "This is the incomplete case".to_string(),
                    no_code: false,
                    main: true,
                }],
            },
            PassError::IncorrectArity(head_range, got, expected, hidden) => {
                let positions = vec![Marker {
                    position: *head_range,
                    color: Color::Fst,
                    text: "This function requires a fixed number of arguments".to_string(),
                    no_code: false,
                    main: true,
                }];

                DiagnosticFrame {
                    code: 210,
                    severity: Severity::Error,
                    title: "Incorrect arity.".to_string(),
                    subtitles: vec![],
                    hints: vec![if *expected == 0 {
                        format!("This function expects no arguments but got {}", got.len())
                    } else if *hidden == 0 {
                        format!("This function expects {} arguments but got {}", expected, got.len())
                    } else {
                        format!(
                            "This function expects {} arguments or {} (without hidden ones) but got {}.",
                            expected,
                            expected - hidden,
                            got.len()
                        )
                    }],
                    positions,
                }
            }
            PassError::SugarIsBadlyImplemented(head_range, place_range, expected) => DiagnosticFrame {
                code: 211,
                severity: Severity::Error,
                title: "Incorrect arity in the sugar definition".to_string(),
                subtitles: vec![],
                hints: vec![format!(
                    "Take a look at how sugar functions should be implemented at https://kind2.kindelia.com/hints/sugars."
                )],
                positions: vec![
                    Marker {
                        position: *head_range,
                        color: Color::Fst,
                        text: if *expected == 0 {
                            "This rule expects no arguments".to_string()
                        } else {
                            format!("This rule expects {} explicit arguments", expected)
                        },
                        no_code: false,
                        main: true,
                    },
                    Marker {
                        position: *place_range,
                        color: Color::Snd,
                        text: "This is what triggers the sugar".to_string(),
                        no_code: false,
                        main: false,
                    },
                ],
            },
            PassError::DuplicatedNamed(first_decl, last_decl) => DiagnosticFrame {
                code: 212,
                severity: Severity::Error,
                title: "Repeated named variable".to_string(),
                subtitles: vec![],
                hints: vec![],
                positions: vec![
                    Marker {
                        position: *last_decl,
                        color: Color::Fst,
                        text: "Second occurence".to_string(),
                        no_code: false,
                        main: true,
                    },
                    Marker {
                        position: *first_decl,
                        color: Color::Snd,
                        text: "First occurence".to_string(),
                        no_code: false,
                        main: false,
                    },
                ],
            },
            PassError::RepeatedVariable(first_decl, last_decl) => DiagnosticFrame {
                code: 214,
                severity: Severity::Error,
                title: "Repeated name".to_string(),
                subtitles: vec![],
                hints: vec!["Rename one of the occurences".to_string()],
                positions: vec![
                    Marker {
                        position: *last_decl,
                        color: Color::Fst,
                        text: "Second occurence".to_string(),
                        no_code: false,
                        main: true,
                    },
                    Marker {
                        position: *first_decl,
                        color: Color::Snd,
                        text: "First occurence".to_string(),
                        no_code: false,
                        main: false,
                    },
                ],
            },
            PassError::CannotFindAlias(name, range) => DiagnosticFrame {
                code: 214,
                severity: Severity::Error,
                title: "Cannot find alias".to_string(),
                subtitles: vec![],
                hints: vec![],
                positions: vec![Marker {
                    position: *range,
                    color: Color::Fst,
                    text: format!("Cannot find alias for '{}'", name),
                    no_code: false,
                    main: true,
                }],
            },
            PassError::ShouldBeAParameter(error_range, declaration_range) => {
                let mut positions = vec![];

                match error_range {
                    Span::Generated => (),
                    Span::Locatable(error_range) => positions.push(Marker {
                        position: *error_range,
                        color: Color::Fst,
                        text: "This expression is not the parameter".to_string(),
                        no_code: false,
                        main: true,
                    }),
                }

                positions.push(Marker {
                    position:* declaration_range,
                    color: Color::Snd,
                    text: "This is the parameter that should be used".to_string(),
                    no_code: false,
                    main: false,
                });

                DiagnosticFrame {
                    code: 214,
                    severity: Severity::Error,
                    title: "The expression is not the parameter declared in the type constructor".to_string(),
                    subtitles: vec![],
                    hints: vec![],
                    positions,
                }
            }
            PassError::NotATypeConstructor(error_range, declaration_range) => DiagnosticFrame {
                code: 214,
                severity: Severity::Error,
                title: "This is not the type that is being declared.".to_string(),
                subtitles: vec![],
                hints: vec![],
                positions: vec![
                    Marker {
                        position: *error_range,
                        color: Color::Fst,
                        text: "This is not the type that is being declared".to_string(),
                        no_code: false,
                        main: true,
                    },
                    Marker {
                        position: *declaration_range,
                        color: Color::Snd,
                        text: "This is the type that should be used instead".to_string(),
                        no_code: false,
                        main: false,
                    },
                ],
            },
            PassError::NoFieldCoverage(place, other) => DiagnosticFrame {
                code: 209,
                severity: Severity::Error,
                title: "The case is not covering all the values inside of it!".to_string(),
                subtitles: vec![],
                hints: vec![format!(
                    "Need variables for {}",
                    other.iter().map(|x| format!("'{}'", x)).collect::<Vec<String>>().join(", ")
                )],
                positions: vec![Marker {
                    position: *place,
                    color: Color::Fst,
                    text: "This is the incomplete case".to_string(),
                    no_code: false,
                    main: true,
                }],
            },
            PassError::AttributeDoesNotExpectEqual(place) => DiagnosticFrame {
                code: 209,
                severity: Severity::Error,
                title: "This attribute does not support values!".to_string(),
                subtitles: vec![],
                hints: vec![],
                positions: vec![Marker {
                    position: *place,
                    color: Color::Fst,
                    text: "Try to remove everything after the equal".to_string(),
                    no_code: false,
                    main: true,
                }],
            },
            PassError::AttributeDoesNotExpectArgs(place) => DiagnosticFrame {
                code: 209,
                severity: Severity::Error,
                title: "This attribute does not expect arguments".to_string(),
                subtitles: vec![],
                hints: vec![],
                positions: vec![Marker {
                    position: *place,
                    color: Color::Fst,
                    text: "Try to remove all of the arguments".to_string(),
                    no_code: false,
                    main: true,
                }],
            },
            PassError::InvalidAttributeArgument(place) => DiagnosticFrame {
                code: 209,
                severity: Severity::Error,
                title: "Invalid attribute argument".to_string(),
                subtitles: vec![],
                hints: vec![],
                positions: vec![Marker {
                    position: *place,
                    color: Color::Fst,
                    text: "Remove it or replace".to_string(),
                    no_code: false,
                    main: true,
                }],
            },
            PassError::CannotDerive(name, place) => DiagnosticFrame {
                code: 209,
                severity: Severity::Error,
                title: format!("Cannot derive '{}' for this definition", name),
                subtitles: vec![],
                hints: vec![],
                positions: vec![Marker {
                    position: *place,
                    color: Color::Fst,
                    text: "Here!".to_string(),
                    no_code: false,
                    main: true,
                }],
            },

            PassError::AttributeExpectsAValue(place) => DiagnosticFrame {
                code: 209,
                severity: Severity::Error,
                title: format!("This attribute expects a value"),
                subtitles: vec![],
                hints: vec![],
                positions: vec![Marker {
                    position: *place,
                    color: Color::Fst,
                    text: "Here!".to_string(),
                    no_code: false,
                    main: true,
                }],
            },
            PassError::AttributeDoesNotExists(place) => DiagnosticFrame {
                code: 209,
                severity: Severity::Error,
                title: format!("This attribute does not exists"),
                subtitles: vec![],
                hints: vec![],
                positions: vec![Marker {
                    position: *place,
                    color: Color::Fst,
                    text: "Here!".to_string(),
                    no_code: false,
                    main: true,
                }],
            },
            PassError::DuplicatedAttributeArgument(first, sec) => DiagnosticFrame {
                code: 209,
                severity: Severity::Warning,
                title: "Duplicated attribute argument".to_string(),
                subtitles: vec![],
                hints: vec![],
                positions: vec![Marker {
                    position: *sec,
                    color: Color::For,
                    text: "Second declaration".to_string(),
                    no_code: false,
                    main: true,
                },Marker {
                    position: *first,
                    color: Color::For,
                    text: "First declaration!".to_string(),
                    no_code: false,
                    main: true,
                }],
            },
        }
    }
}
