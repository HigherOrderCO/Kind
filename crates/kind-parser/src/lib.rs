use std::collections::VecDeque;

use diagnostics::{SyntaxDiagnostic, SyntaxDiagnosticKind};
use kind_diagnostic::Diagnostic;
use kind_lexer::tokens::{Token, TokenKind};
use kind_lexer::Lexer;
use kind_span::Span;
use kind_syntax::concrete::*;

use thin_vec::ThinVec;

mod diagnostics;

type Result<T, U = SyntaxDiagnostic> = std::result::Result<T, U>;

pub struct Parser<'a> {
    lexer: Lexer<'a>,

    /// Token queue
    queue: VecDeque<Token>,

    /// The previous span
    prev_span: Span,

    /// The diagnostics vector.
    errs: Vec<Diagnostic>,

    /// The number of tokens that have been used.
    eaten: usize,
}

impl<'a> Parser<'a> {
    pub fn new(lexer: Lexer<'a>) -> Self {
        let mut parser = Self {
            lexer,
            errs: Default::default(),
            queue: VecDeque::with_capacity(3),
            prev_span: Span(0..0),
            eaten: 0,
        };

        // Adds the initial three tokens to the queue.
        for _ in 0..3 {
            parser.add_token();
        }

        parser
    }

    pub(crate) fn try_with<T>(&mut self, fun: fn(&mut Self) -> Result<T>) -> Result<Option<T>> {
        let eaten = self.eaten;
        let result = fun(self);

        match result {
            Err(_) if self.eaten == eaten => Ok(None),
            Ok(value) => Ok(Some(value)),
            Err(err) => Err(err),
        }
    }

    /// Adds tokens to the queue and add errors to the error list if present.
    pub(crate) fn add_token(&mut self) -> &Token {
        match self.lexer.lex() {
            Ok(tkn) => {
                self.eaten += 1;
                self.queue.push_back(tkn);
                &self.queue[0]
            }
            Err(err) => {
                self.report(err);
                self.add_token()
            }
        }
    }

    /// Reports an diagnostic to the diagnostic accumulator.
    pub(crate) fn report<T: Into<Diagnostic>>(&mut self, err: T) {
        self.errs.push(err.into())
    }

    /// Removes one token and adds another one to the token queue.
    pub(crate) fn bump(&mut self) -> Token {
        let fst = self.queue.pop_front().unwrap();
        self.add_token();

        self.prev_span = fst.span.clone();

        fst
    }

    /// Peeks a token from the token queue.
    pub(crate) fn peek(&mut self, index: usize) -> &Token {
        self.queue.get(index).unwrap()
    }

    /// Peeks the first token from the token queue.
    pub(crate) fn get(&mut self) -> &Token {
        self.queue.get(0).unwrap()
    }

    /// Checks if the next token is the expected one.
    pub(crate) fn is(&mut self, token: TokenKind) -> bool {
        self.queue.get(0).unwrap().is(token)
    }

    /// Removes a token and report an "unexpected token" error diagnostic.
    pub(crate) fn unexpected<T>(&mut self) -> Result<T> {
        let tkn = self.get().clone();
        let span = tkn.span.clone();
        Err(SyntaxDiagnosticKind::UnexpectedToken(tkn).with(span))
    }

    /// Checks if the next token is the expected one and returns the consumed token.
    pub fn expect(&mut self, expect: TokenKind) -> Result<Token> {
        if self.is(expect) {
            Ok(self.bump())
        } else {
            self.unexpected()
        }
    }

    /// Checks if the next token is the expected identifier and returns the consumed token.
    pub fn expect_keyword(&mut self, str: &str) -> Result<Token> {
        if self.get().is_identifier(str) {
            Ok(self.bump())
        } else {
            self.unexpected()
        }
    }

    pub fn parse_any_name(&mut self) -> Result<Item<Ident>> {
        if let TokenKind::UpperId(str) | TokenKind::LowerId(str) = &self.get().data {
            let str = str.clone();
            let tkn = self.bump();
            Ok(Item {
                span: tkn.span.clone(),
                data: Ident(Item {
                    span: tkn.span.clone(),
                    data: Tokenized(tkn, str),
                }),
            })
        } else {
            self.unexpected()
        }
    }

    /// Parses brackets around another parser defined in the argument `fun`
    pub(crate) fn parse_bracket<T>(
        &mut self,
        fun: fn(&mut Self) -> Result<T>,
    ) -> Result<Bracket<T>> {
        Ok(Bracket(
            self.expect(TokenKind::LBracket)?,
            fun(self)?,
            self.expect(TokenKind::RBracket)?,
        ))
    }

    /// Parses parenthesis around another parser defined in the argument `fun`.
    pub(crate) fn parse_paren<T>(
        &mut self,
        fun: fn(&mut Self) -> Result<T>,
    ) -> Result<Parenthesis<T>> {
        Ok(Parenthesis(
            self.expect(TokenKind::LPar)?,
            fun(self)?,
            self.expect(TokenKind::RPar)?,
        ))
    }

    /// Parses a list of items separated by commas.
    pub(crate) fn parse_separated_by_comma<T>(
        &mut self,
        fun: fn(&mut Self) -> Result<T>,
    ) -> Result<ThinVec<T>> {
        let mut vec = ThinVec::new();
        loop {
            vec.push(fun(self)?);
            if self.is(TokenKind::Comma) {
                self.bump();
            } else {
                break;
            }
        }
        Ok(vec)
    }

    pub fn parse_attribute_style(&mut self) -> Result<AttributeStyle> {
        match &self.get().data {
            TokenKind::UpperId(_) | TokenKind::LowerId(_) => {
                let name = self.parse_any_name()?;
                Ok(Item {
                    span: name.span.clone(),
                    data: AttributeStyleKind::Identifier(name),
                })
            }
            TokenKind::Str(str) => {
                let str = str.clone();
                let tkn = self.bump();
                Ok(Item {
                    span: tkn.span.clone(),
                    data: AttributeStyleKind::String(Tokenized(tkn, str)),
                })
            }
            TokenKind::Num60(n) => {
                let n = *n;
                let tkn = self.bump();
                Ok(Item {
                    span: tkn.span.clone(),
                    data: AttributeStyleKind::Number(Tokenized(tkn, n)),
                })
            }
            TokenKind::LBracket => {
                let bracket = self.parse_bracket(|this| {
                    this.parse_separated_by_comma(|this| this.parse_attribute_style())
                })?;

                Ok(Item {
                    span: bracket.0.span.mix(&bracket.2.span),
                    data: AttributeStyleKind::List(bracket),
                })
            }
            _ => self.unexpected(),
        }
    }

    pub fn parse_attribute(&mut self) -> Result<Attribute> {
        let hash = self.expect(TokenKind::Hash)?;
        let name = self.parse_any_name()?;

        let arguments = self.try_with(|this| {
            this.parse_bracket(|this| {
                this.parse_separated_by_comma(|this| this.parse_attribute_style())
            })
        })?;

        let value = self.try_with(|this| {
            Ok(Equal(
                this.expect(TokenKind::Eq)?,
                this.parse_attribute_style()?,
            ))
        })?;

        Ok(Attribute {
            span: hash.span.mix(&self.prev_span),
            data: AttributeKind {
                hash,
                name,
                value,
                arguments,
            },
        })
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_parser() {
        let mut parser = Parser::new(Lexer::new("#foo\n//ata\n[a, b] = c"));

        println!("{:#?}", parser.parse_attribute());
    }
}
