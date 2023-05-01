//! All of the sintatic erros both from the
//! lexer and the parser.

use kind_report::{data::{Color, Diagnostic, DiagnosticFrame, Marker, Severity}, RenderConfig};
use kind_span::{Range, SyntaxCtxIndex};

use crate::lexer::tokens::Token;

#[derive(Debug, Clone)]
pub enum EncodeSequence {
    Hexa,
    Decimal,
    Octal,
    Binary,
    Unicode,
}

#[derive(Debug, Clone)]
pub enum SyntaxDiagnostic {
    UnfinishedString(Range),
    UnfinishedChar(Range),
    UnfinishedComment(Range),
    InvalidEscapeSequence(EncodeSequence, Range),
    InvalidNumberRepresentation(EncodeSequence, Range),
    UnexpectedChar(char, Range),
    UnexpectedToken(Token, Range, Vec<Token>),
    LowerCasedDefinition(String, Range),
    NotAClauseOfDef(Range, Range),
    Unclosed(Range),
    IgnoreRestShouldBeOnTheEnd(Range),
    MatchScrutineeShouldBeAName(Range),
    UnusedDocString(Range),
    CannotUseUse(Range),
    ImportsCannotHaveAlias(Range),
    InvalidNumberType(String, Range),
}

fn encode_name(encode: EncodeSequence) -> &'static str {
    match encode {
        EncodeSequence::Hexa => "hexadecimal",
        EncodeSequence::Decimal => "decimal",
        EncodeSequence::Octal => "octal",
        EncodeSequence::Binary => "binary",
        EncodeSequence::Unicode => "unicode",
    }
}

impl Diagnostic for SyntaxDiagnostic {
    fn get_syntax_ctx(&self) -> Option<SyntaxCtxIndex> {
        match self {
            SyntaxDiagnostic::UnfinishedString(range) => Some(range.ctx),
            SyntaxDiagnostic::UnfinishedChar(range) => Some(range.ctx),
            SyntaxDiagnostic::UnfinishedComment(range) => Some(range.ctx),
            SyntaxDiagnostic::InvalidEscapeSequence(_, range) => Some(range.ctx),
            SyntaxDiagnostic::InvalidNumberRepresentation(_, range) => Some(range.ctx),
            SyntaxDiagnostic::UnexpectedChar(_, range) => Some(range.ctx),
            SyntaxDiagnostic::UnexpectedToken(_, range, _) => Some(range.ctx),
            SyntaxDiagnostic::LowerCasedDefinition(_, range) => Some(range.ctx),
            SyntaxDiagnostic::NotAClauseOfDef(range, _) => Some(range.ctx),
            SyntaxDiagnostic::Unclosed(range) => Some(range.ctx),
            SyntaxDiagnostic::IgnoreRestShouldBeOnTheEnd(range) => Some(range.ctx),
            SyntaxDiagnostic::UnusedDocString(range) => Some(range.ctx),
            SyntaxDiagnostic::CannotUseUse(range) => Some(range.ctx),
            SyntaxDiagnostic::ImportsCannotHaveAlias(range) => Some(range.ctx),
            SyntaxDiagnostic::InvalidNumberType(_, range) => Some(range.ctx),
            SyntaxDiagnostic::MatchScrutineeShouldBeAName(range) => Some(range.ctx),
        }
    }

    fn to_diagnostic_frame(&self, _: &RenderConfig) -> DiagnosticFrame {
        match self {
            SyntaxDiagnostic::UnfinishedString(range) => DiagnosticFrame {
                code: 1,
                severity: Severity::Error,
                title: "Unfinished String".to_string(),
                subtitles: vec![],
                hints: vec!["You need to close the string with another quote, take a look at the beggining".to_string()],
                positions: vec![Marker {
                    position: *range,
                    color: Color::Fst,
                    text: "The string starts in this position!".to_string(),
                    no_code: false,
                    main: true,
                }],
            },
            SyntaxDiagnostic::IgnoreRestShouldBeOnTheEnd(range) => DiagnosticFrame {
                code: 2,
                severity: Severity::Error,
                title: "Invalid position of the '..' operator".to_string(),
                subtitles: vec![],
                hints: vec!["Put it on the end of the clause or remove it.".to_string()],
                positions: vec![Marker {
                    position: *range,
                    color: Color::Fst,
                    text: "It should not be in the middle of this!".to_string(),
                    no_code: false,
                    main: true,
                }],
            },
            SyntaxDiagnostic::UnusedDocString(range) => DiagnosticFrame {
                code: 3,
                severity: Severity::Warning,
                title: "This entire documentation comment is in a invalid position".to_string(),
                subtitles: vec![],
                hints: vec!["Take a look at the rules for doc comments at https://github.com/Kindelia/Kind2/blob/master/guide/doc_strings.md".to_string()],
                positions: vec![Marker {
                    position: *range,
                    color: Color::For,
                    text: "Remove the entire comment or transform it in a simple comment with '//'".to_string(),
                    no_code: false,
                    main: true,
                }],
            },
            SyntaxDiagnostic::UnfinishedChar(range) => DiagnosticFrame {
                code: 4,
                severity: Severity::Error,
                title: "Unfinished Char".to_string(),
                subtitles: vec![],
                hints: vec!["You need to close the character with another quote, take a look at the beginning".to_string()],
                positions: vec![Marker {
                    position: *range,
                    color: Color::Fst,
                    text: "The char starts in this position!".to_string(),
                    no_code: false,
                    main: true,
                }],
            },
            SyntaxDiagnostic::LowerCasedDefinition(name, range) => DiagnosticFrame {
                code: 5,
                severity: Severity::Error,
                title: "The definition name must be capitalized.".to_string(),
                subtitles: vec![],
                hints: vec![{
                    let mut c = name.chars();
                    let fst = c.next().unwrap().to_uppercase();
                    format!("Change it to '{}{}'", fst, c.as_str())
                }],
                positions: vec![Marker {
                    position: *range,
                    color: Color::Fst,
                    text: "Wrong case for this name".to_string(),
                    no_code: false,
                    main: true,
                }],
            },
            SyntaxDiagnostic::NotAClauseOfDef(fst, snd) => DiagnosticFrame {
                code: 6,
                severity: Severity::Error,
                title: "Unexpected capitalized name that does not refer to the definition".to_string(),
                subtitles: vec![],
                hints: vec!["If you indend to make another clause, just replace the name in red.".to_string()],
                positions: vec![
                    Marker {
                        position: *snd,
                        color: Color::Fst,
                        text: "This is the unexpected token".to_string(),
                        no_code: false,
                        main: true,
                    },
                    Marker {
                        position: *fst,
                        color: Color::Snd,
                        text: "This is the definition. All clauses should use the same name.".to_string(),
                        no_code: false,
                        main: false,
                    },
                ],
            },
            SyntaxDiagnostic::UnfinishedComment(range) => DiagnosticFrame {
                code: 7,
                severity: Severity::Error,
                title: "Unfinished Comment".to_string(),
                subtitles: vec![],
                hints: vec!["You need to close the string with '*/', take a look at the beggining".to_string()],
                positions: vec![Marker {
                    position: *range,
                    color: Color::Fst,
                    text: "The comment starts in this position!".to_string(),
                    no_code: false,
                    main: true,
                }],
            },
            SyntaxDiagnostic::InvalidEscapeSequence(kind, range) => DiagnosticFrame {
                code: 8,
                severity: Severity::Error,
                title: format!("The {} character sequence is invalid!", encode_name(kind.clone())),
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
            SyntaxDiagnostic::InvalidNumberRepresentation(repr, range) => DiagnosticFrame {
                code: 9,
                severity: Severity::Error,
                title: format!("The {} number sequence is invalid!", encode_name(repr.clone())),
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
            SyntaxDiagnostic::UnexpectedChar(chr, range) => DiagnosticFrame {
                code: 10,
                severity: Severity::Error,
                title: format!("The char '{}' is invalid", chr),
                subtitles: vec![],
                hints: vec!["Try to remove it!".to_string()],
                positions: vec![Marker {
                    position: *range,
                    color: Color::Fst,
                    text: "Here!".to_string(),
                    no_code: false,
                    main: true,
                }],
            },
            SyntaxDiagnostic::UnexpectedToken(Token::Eof, range, _expect) => DiagnosticFrame {
                code: 11,
                severity: Severity::Error,
                title: "Unexpected end of file.".to_string(),
                subtitles: vec![],
                hints: vec![],
                positions: vec![Marker {
                    position: *range,
                    color: Color::Fst,
                    text: "Here!".to_string(),
                    no_code: true,
                    main: true,
                }],
            },
            SyntaxDiagnostic::UnexpectedToken(Token::Comment(_, _), range, _expect) => DiagnosticFrame {
                code: 12,
                severity: Severity::Error,
                title: "Unexpected documentation comment.".to_string(),
                subtitles: vec![],
                hints: vec!["Remove this documentation comment or place it in a correct place.".to_string()],
                positions: vec![Marker {
                    position: *range,
                    color: Color::Fst,
                    text: "Here!".to_string(),
                    no_code: false,
                    main: true,
                }],
            },
            SyntaxDiagnostic::UnexpectedToken(token, range, _expect) => DiagnosticFrame {
                code: 13,
                severity: Severity::Error,
                title: format!("Unexpected token '{}'.", token),
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
            SyntaxDiagnostic::Unclosed(range) => DiagnosticFrame {
                code: 14,
                severity: Severity::Error,
                title: "Unclosed parenthesis.".to_string(),
                subtitles: vec![],
                hints: vec![],
                positions: vec![Marker {
                    position: *range,
                    color: Color::Fst,
                    text: "Starts here! try to add another one".to_string(),
                    no_code: false,
                    main: true,
                }],
            },
            SyntaxDiagnostic::CannotUseUse(range) => DiagnosticFrame {
                code: 15,
                severity: Severity::Error,
                title: "Can only use the 'use' statement in the beggining of the file".to_string(),
                subtitles: vec![],
                hints: vec![],
                positions: vec![Marker {
                    position: *range,
                    color: Color::Fst,
                    text: "Move it to the beggining".to_string(),
                    no_code: false,
                    main: true,
                }],
            },
            SyntaxDiagnostic::ImportsCannotHaveAlias(range) => DiagnosticFrame {
                code: 16,
                severity: Severity::Error,
                title: "The upper cased name cannot have an alias".to_string(),
                subtitles: vec![],
                hints: vec![],
                positions: vec![Marker {
                    position: *range,
                    color: Color::Fst,
                    text: "Use the entire name here!".to_string(),
                    no_code: false,
                    main: true,
                }],
            },
            SyntaxDiagnostic::InvalidNumberType(type_, range) => DiagnosticFrame {
                code: 17,
                severity: Severity::Error,
                title: format!("The {} number type is invalid", type_),
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
            SyntaxDiagnostic::MatchScrutineeShouldBeAName(range) => DiagnosticFrame {
                code: 18,
                severity: Severity::Error,
                title: "Match scrutinee should be a identifier!".to_string(),
                subtitles: vec![],
                hints: vec!["Use the '=' inside the scrutinee! More details on <website>".to_string()],
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
        use SyntaxDiagnostic::*;
        match self {
            UnfinishedString(_)
            | UnfinishedChar(_)
            | UnfinishedComment(_)
            | InvalidEscapeSequence(_, _)
            | InvalidNumberRepresentation(_, _)
            | UnexpectedChar(_, _)
            | UnexpectedToken(_, _, _)
            | LowerCasedDefinition(_, _)
            | NotAClauseOfDef(_, _)
            | Unclosed(_)
            | IgnoreRestShouldBeOnTheEnd(_)
            | MatchScrutineeShouldBeAName(_)
            | CannotUseUse(_)
            | ImportsCannotHaveAlias(_)
            | InvalidNumberType(_, _) => Severity::Error,
            | UnusedDocString(_) => Severity::Warning,
        }
    }
}

impl From<Box<SyntaxDiagnostic>> for DiagnosticFrame {
    fn from(err: Box<SyntaxDiagnostic>) -> Self {
        (err).into()
    }
}
