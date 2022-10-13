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
    UnfinishedChar(Range),
    UnfinishedComment(Range),
    InvalidEscapeSequence(EncodeSequence, Range),
    InvalidNumberRepresentation(EncodeSequence, Range),
    UnexpectedChar(char, Range),
    UnexpectedToken(Token, Range, Vec<Token>),
    LowerCasedDefinition(String, Range),
    NotAClauseOfDef(Range, Range),
    Unclosed(Range)
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
                    no_code: false,
                }],
            },
            SyntaxError::UnfinishedChar(range) => DiagnosticFrame {
                code: 0,
                severity: Severity::Error,
                title: "Unfinished Char".to_string(),
                subtitles: vec![],
                hints: vec!["You need to close the character with another quote, take a look at the beginning".to_string()],
                positions: vec![Marking {
                    position: range,
                    color: Color::Fst,
                    text: "The char starts in this position!".to_string(),
                    no_code: false,
                }],
            },
            SyntaxError::LowerCasedDefinition(name, range) => DiagnosticFrame {
                code: 1,
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
                    no_code: false,
                }],
            },
            SyntaxError::NotAClauseOfDef(fst, snd) => DiagnosticFrame {
                code: 2,
                severity: Severity::Error,
                title: "Unexpected Upper id that does not refer to the definition".to_string(),
                subtitles: vec![],
                hints: vec!["If you indend to make another clause, use the same name.".to_string()],
                positions: vec![Marking {
                    position: snd,
                    color: Color::Fst,
                    text: "This is the unexpected token".to_string(),
                    no_code: false,
                },Marking {
                    position: fst,
                    color: Color::Snd,
                    text: "This is the definition. All clauses should use the same name.".to_string(),
                    no_code: false,
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
                    no_code: false,
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
                    no_code: false,
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
                    no_code: false,
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
                    no_code: false,
                }],
            },
            SyntaxError::UnexpectedToken(Token::Eof, range, _expect) => DiagnosticFrame {
                code: 0,
                severity: Severity::Error,
                title: format!("Unexpected end of file."),
                subtitles: vec![],
                hints: vec![],
                positions: vec![Marking {
                    position: range,
                    color: Color::Fst,
                    text: "Here!".to_string(),
                    no_code: true,
                }],
            },
            SyntaxError::UnexpectedToken(token, range, _expect) => DiagnosticFrame {
                code: 0,
                severity: Severity::Error,
                title: format!("Unexpected token {:?}.", token),
                subtitles: vec![],
                hints: vec![],
                positions: vec![Marking {
                    position: range,
                    color: Color::Fst,
                    text: "Here!".to_string(),
                    no_code: false,
                }],
            },
            SyntaxError::Unclosed(range) => DiagnosticFrame {
                code: 0,
                severity: Severity::Error,
                title: "Unclosed parenthesis.".to_string(),
                subtitles: vec![],
                hints: vec![],
                positions: vec![Marking {
                    position: range,
                    color: Color::Fst,
                    text: "Starts here! try to add another one".to_string(),
                    no_code: false,
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
