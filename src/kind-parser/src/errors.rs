use kind_report::data::{Color, DiagnosticFrame, Marking, Severity};
use kind_span::Range;

use crate::lexer::tokens::Token;

#[derive(Debug, Clone)]
pub enum EncodeSequence {
    Hexa,
    Octal,
    Binary,
    Unicode,
}

#[derive(Debug, Clone)]
pub enum SyntaxError {
    UnfinishedString(Range),
    UnfinishedComment(Range),
    InvalidEscapeSequence(EncodeSequence, Range),
    InvalidNumberRepresentation(EncodeSequence, Range),
    UnexpectedChar(char, Range),
    UnexpectedToken(Token, Range, Vec<Token>),
    LowerCasedDefinition(String, Range),
}

fn encode_name(encode: EncodeSequence) -> &'static str {
    match encode {
        EncodeSequence::Hexa => "hexadecimal",
        EncodeSequence::Octal => "octal",
        EncodeSequence::Binary => "binary",
        EncodeSequence::Unicode => "unicode",
    }
}

impl From<Box<SyntaxError>> for DiagnosticFrame {
    fn from(err: Box<SyntaxError>) -> Self {
        match *err {
            SyntaxError::UnfinishedString(range) => DiagnosticFrame {
                code: 0,
                severity: Severity::Error,
                title: "Unfinished String".to_string(),
                subtitles: vec![],
                hints: vec!["You need to close the string with another quote, take a look at the beggining".to_string()],
                positions: vec![Marking {
                    position: range,
                    color: Color::Fst,
                    text: "The string starts in this position!".to_string(),
                }],
            },
            SyntaxError::LowerCasedDefinition(name, range) => DiagnosticFrame {
                code: 0,
                severity: Severity::Error,
                title: "The definition name must be capitalized.".to_string(),
                subtitles: vec![],
                hints: vec![{
                    let mut c = name.chars();
                    let fst = c.next().unwrap().to_uppercase();
                    format!("Change it to '{}{}'", fst, c.as_str())
                }],
                positions: vec![Marking {
                    position: range,
                    color: Color::Fst,
                    text: "Wrong case for this name".to_string(),
                }],
            },
            SyntaxError::UnfinishedComment(range) => DiagnosticFrame {
                code: 0,
                severity: Severity::Error,
                title: "Unfinished Comment".to_string(),
                subtitles: vec![],
                hints: vec!["You need to close the string with '*/', take a look at the beggining".to_string()],
                positions: vec![Marking {
                    position: range,
                    color: Color::Fst,
                    text: "The comment starts in this position!".to_string(),
                }],
            },
            SyntaxError::InvalidEscapeSequence(kind, range) => DiagnosticFrame {
                code: 0,
                severity: Severity::Error,
                title: format!("The {} character sequence is invalid!", encode_name(kind)),
                subtitles: vec![],
                hints: vec![],
                positions: vec![Marking {
                    position: range,
                    color: Color::Fst,
                    text: "Here!".to_string(),
                }],
            },
            SyntaxError::InvalidNumberRepresentation(repr, range) => DiagnosticFrame {
                code: 0,
                severity: Severity::Error,
                title: format!("The {} number sequence is invalid!", encode_name(repr)),
                subtitles: vec![],
                hints: vec![],
                positions: vec![Marking {
                    position: range,
                    color: Color::Fst,
                    text: "Here!".to_string(),
                }],
            },
            SyntaxError::UnexpectedChar(chr, range) => DiagnosticFrame {
                code: 0,
                severity: Severity::Error,
                title: format!("The char '{}' is invalid", chr),
                subtitles: vec![],
                hints: vec!["Try to remove it!".to_string()],
                positions: vec![Marking {
                    position: range,
                    color: Color::Fst,
                    text: "Here!".to_string(),
                }],
            },
            SyntaxError::UnexpectedToken(_token, range, _expect) => DiagnosticFrame {
                code: 0,
                severity: Severity::Error,
                title: "Unexpected token.".to_string(),
                subtitles: vec![],
                hints: vec![],
                positions: vec![Marking {
                    position: range,
                    color: Color::Fst,
                    text: "Here!".to_string(),
                }],
            },
        }
    }
}

impl From<&Box<SyntaxError>> for DiagnosticFrame {
    fn from(err: &Box<SyntaxError>) -> Self {
        (err.clone()).into()
    }
}
