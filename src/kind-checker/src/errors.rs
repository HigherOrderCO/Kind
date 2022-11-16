//! Errors created by the type checker.

use kind_report::data::{Color, Diagnostic, DiagnosticFrame, Marker, Severity, Subtitle, Word};
use kind_span::Range;
use kind_tree::desugared::Expr;

use crate::report::Context;

#[derive(Debug)]
pub(crate) enum TypeError {
    UnboundVariable(Context, Range),
    CantInferHole(Context, Range),
    CantInferLambda(Context, Range),
    InvalidCall(Context, Range),
    ImpossibleCase(Context, Range, Box<Expr>, Box<Expr>),
    Inspection(Context, Range, Box<Expr>),
    TooManyArguments(Context, Range),
    TypeMismatch(Context, Range, Box<Expr>, Box<Expr>),
}

fn context_to_subtitles(ctx: &Context, subtitles: &mut Vec<Subtitle>) {
    subtitles.push(Subtitle::LineBreak);

    if !ctx.0.is_empty() {
        subtitles.push(Subtitle::Phrase(
            Color::Snd,
            vec![Word::White("Context:".to_string())],
        ));
    }

    let biggest = ctx
        .0
        .iter()
        .max_by_key(|p| p.0.len())
        .map(|x| x.0.len())
        .unwrap_or(0);

    for (name, typ, vals) in &ctx.0 {
        subtitles.push(Subtitle::Phrase(
            Color::Snd,
            vec![
                Word::Dimmed(" ".to_string()),
                Word::White(format!("{:<width$} :", name, width = biggest)),
                Word::Painted(Color::Snd, typ.to_string()),
            ],
        ));
        for val in vals {
            subtitles.push(Subtitle::Phrase(
                Color::Snd,
                vec![
                    Word::Dimmed(" ".to_string()),
                    Word::Dimmed(format!("{:<width$} =", name, width = biggest)),
                    Word::Dimmed(val.to_string()),
                ],
            ))
        }
    }
}

impl Diagnostic for TypeError {
    fn to_diagnostic_frame(&self) -> DiagnosticFrame {
        match self {
            TypeError::TypeMismatch(ctx, range, detected, expected) => {
                let mut subtitles = vec![
                    Subtitle::Phrase(
                        Color::Fst,
                        vec![
                            Word::White("Expected :".to_string()),
                            Word::Painted(Color::Fst, detected.to_string()),
                        ],
                    ),
                    Subtitle::Phrase(
                        Color::Snd,
                        vec![
                            Word::White("Got      :".to_string()),
                            Word::Painted(Color::Snd, expected.to_string()),
                        ],
                    ),
                ];
                context_to_subtitles(ctx, &mut subtitles);
                DiagnosticFrame {
                    code: 101,
                    severity: Severity::Error,
                    title: "Type mismatch".to_string(),
                    subtitles,
                    hints: vec![],
                    positions: vec![Marker {
                        position: *range,
                        color: Color::Fst,
                        text: "Here!".to_string(),
                        no_code: false,
                        main: true,
                    }],
                }
            }
            TypeError::Inspection(ctx, range, expected) => {
                let mut subtitles = vec![Subtitle::Phrase(
                    Color::Snd,
                    vec![
                        Word::White("Expected:".to_string()),
                        Word::Painted(Color::Snd, expected.to_string()),
                    ],
                )];

                context_to_subtitles(ctx, &mut subtitles);

                DiagnosticFrame {
                    code: 101,
                    severity: Severity::Info,
                    title: "Inspection.".to_string(),
                    subtitles,
                    hints: vec![],
                    positions: vec![Marker {
                        position: *range,
                        color: Color::Snd,
                        text: "Here!".to_string(),
                        no_code: false,
                        main: true,
                    }],
                }
            }
            TypeError::ImpossibleCase(_, range, detected, expected) => DiagnosticFrame {
                code: 101,
                severity: Severity::Error,
                title: "Impossible case.".to_string(),
                subtitles: vec![
                    Subtitle::Phrase(
                        Color::Fst,
                        vec![
                            Word::White("Expected :".to_string()),
                            Word::Painted(Color::Fst, detected.to_string()),
                        ],
                    ),
                    Subtitle::Phrase(
                        Color::Snd,
                        vec![
                            Word::White("Got      :".to_string()),
                            Word::Painted(Color::Snd, expected.to_string()),
                        ],
                    ),
                ],
                hints: vec![],
                positions: vec![Marker {
                    position: *range,
                    color: Color::Fst,
                    text: "Here!".to_string(),
                    no_code: false,
                    main: true,
                }],
            },
            TypeError::CantInferHole(_, range) => DiagnosticFrame {
                code: 101,
                severity: Severity::Error,
                title: "Can't infer hole.".to_string(),
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
            TypeError::InvalidCall(_, range) => DiagnosticFrame {
                code: 101,
                severity: Severity::Error,
                title: "Cannot call this".to_string(),
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
            TypeError::CantInferLambda(_, range) => DiagnosticFrame {
                code: 101,
                severity: Severity::Error,
                title: "Can't infer lambda.".to_string(),
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
            TypeError::TooManyArguments(_, range) => DiagnosticFrame {
                code: 101,
                severity: Severity::Error,
                title: "Too many arguments".to_string(),
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
            TypeError::UnboundVariable(_, range) => DiagnosticFrame {
                code: 101,
                severity: Severity::Error,
                title: "Unbound variable.".to_string(),
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
