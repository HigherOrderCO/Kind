use std::collections::VecDeque;

use diagnostics::{SyntaxDiagnostic, SyntaxDiagnosticKind};
use kind_diagnostic::Diagnostic;
use kind_lexer::tokens::{Token, TokenKind};
use kind_lexer::Lexer;
use kind_span::Span;
use kind_syntax::concrete::*;

use kind_syntax::lexemes;
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

    pub fn eat(&mut self, expect: TokenKind) -> Option<Token> {
        if self.is(expect) {
            Some(self.bump())
        } else {
            None
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

    pub fn parse_any_name(&mut self) -> Result<lexemes::Ident> {
        if let TokenKind::UpperId(str) | TokenKind::LowerId(str) = &self.get().data {
            let str = str.clone();
            let tkn = self.bump();
            let span = tkn.span.clone();
            Ok(lexemes::Ident(lexemes::Item {
                span,
                data: lexemes::Tokenized(tkn, str),
            }))
        } else {
            self.unexpected()
        }
    }

    /// Parses brackets around another parser defined in the argument `fun`
    pub(crate) fn parse_bracket<T>(
        &mut self,
        fun: &dyn Fn(&mut Self) -> Result<T>,
    ) -> Result<lexemes::Bracket<T>> {
        Ok(lexemes::Bracket(
            self.expect(TokenKind::LBracket)?,
            fun(self)?,
            self.expect(TokenKind::RBracket)?,
        ))
    }

    pub(crate) fn parse_brace<T>(
        &mut self,
        fun: fn(&mut Self) -> Result<T>,
    ) -> Result<lexemes::Brace<T>> {
        Ok(lexemes::Brace(
            self.expect(TokenKind::LBrace)?,
            fun(self)?,
            self.expect(TokenKind::RBrace)?,
        ))
    }

    /// Parses parenthesis around another parser defined in the argument `fun`.
    pub(crate) fn parse_paren<T>(
        &mut self,
        fun: fn(&mut Self) -> Result<T>,
    ) -> Result<lexemes::Paren<T>> {
        Ok(lexemes::Paren(
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

    pub fn parse_string(&mut self) -> Result<lexemes::Tokenized<String>> {
        if let TokenKind::Str(str) = &self.get().data {
            let str = str.clone();
            let tkn = self.bump();
            Ok(lexemes::Tokenized(tkn, str))
        } else {
            self.unexpected()
        }
    }

    pub fn parse_u60(&mut self) -> Result<lexemes::Tokenized<u64>> {
        if let TokenKind::Num60(n) = &self.get().data {
            let n = *n;
            let tkn = self.bump();
            Ok(lexemes::Tokenized(tkn, n))
        } else {
            self.unexpected()
        }
    }

    pub fn parse_attribute_style(&mut self) -> Result<AttributeStyle> {
        match &self.get().data {
            TokenKind::UpperId(_) | TokenKind::LowerId(_) => {
                let name = self.parse_any_name()?;
                let span = name.0.span.clone();
                Ok(lexemes::Item::new(
                    span,
                    AttributeStyleKind::Identifier(name),
                ))
            }
            TokenKind::Str(_) => {
                let token = self.parse_string()?;
                Ok(lexemes::Item::new(
                    token.span(),
                    AttributeStyleKind::String(token),
                ))
            }
            TokenKind::Num60(_) => {
                let token = self.parse_u60()?;
                Ok(lexemes::Item::new(
                    token.span(),
                    AttributeStyleKind::Number(token),
                ))
            }
            TokenKind::LBracket => {
                let bracket = self.parse_bracket(&|this| {
                    this.parse_separated_by_comma(|this| this.parse_attribute_style())
                })?;
                Ok(lexemes::Item::new(
                    bracket.span(),
                    AttributeStyleKind::List(bracket),
                ))
            }
            _ => self.unexpected(),
        }
    }

    pub fn parse_attribute(&mut self) -> Result<Attribute> {
        let hash = self.expect(TokenKind::Hash)?;
        let name = self.parse_any_name()?;

        let arguments = self.try_with(|this| {
            this.parse_bracket(&|this| {
                this.parse_separated_by_comma(|this| this.parse_attribute_style())
            })
        })?;

        let value = self.try_with(|this| {
            Ok(lexemes::Equal(
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

    pub fn parse_var(&mut self) -> Result<LocalExpr> {
        let name = self.parse_any_name()?;
        Ok(LocalExpr { name })
    }

    pub fn parse_type_binding(&mut self) -> Result<TypeBinding> {
        let name = self.parse_any_name()?;
        let colon = self.expect(TokenKind::Colon)?;
        let ty = self.parse_expr()?;
        Ok(TypeBinding {
            name,
            typ: lexemes::Colon(colon, Box::new(ty)),
        })
    }

    pub fn is_param(&mut self) -> bool {
        self.peek(0).is(TokenKind::LPar)
            && self.peek(1).is_lower_id()
            && self.peek(2).is(TokenKind::Colon)
    }

    pub fn parse_param(&mut self) -> Result<Param> {
        if self.is_param() {
            let paren = self.parse_paren(|this| this.parse_type_binding())?;
            Ok(Param::Named(paren))
        } else {
            let expr = Box::new(self.parse_expr()?);
            Ok(Param::Expr(expr))
        }
    }

    pub fn is_binding_rename(&mut self) -> bool {
        self.peek(0).is(TokenKind::LPar)
            && self.peek(1).is_lower_id()
            && self.peek(2).is(TokenKind::Eq)
    }

    pub fn parse_binding(&mut self) -> Result<Binding> {
        let tilde = self.eat(TokenKind::Tilde);

        let value = if self.is_binding_rename() {
            let rename = self.parse_paren(|this| {
                let name = this.parse_any_name()?;
                let eq = this.expect(TokenKind::Eq)?;
                let expr = this.parse_expr()?;
                Ok(Rename(name, lexemes::Equal(eq, Box::new(expr))))
            })?;

            NamedBinding::Named(rename)
        } else {
            NamedBinding::Expr(Box::new(self.parse_atom()?))
        };

        Ok(Binding { tilde, value })
    }

    pub fn parse_lower_id(&mut self) -> Result<lexemes::Ident> {
        if let TokenKind::LowerId(name) = &self.get().data {
            let name = name.clone();
            let tkn = self.bump();
            Ok(lexemes::Ident(lexemes::Item {
                span: tkn.span.clone(),
                data: lexemes::Tokenized(tkn, name),
            }))
        } else {
            // TODO: Improve this error message for upper cased identifiers.
            self.unexpected()
        }
    }

    pub fn parse_let(&mut self) -> Result<LetExpr> {
        let r#let = self.expect(TokenKind::Let)?;
        let name = self.parse_lower_id()?;
        let eq = self.expect(TokenKind::Eq)?;
        let val = self.parse_expr()?;
        let semi = self.eat(TokenKind::Semi);
        let next = self.parse_expr()?;

        Ok(LetExpr {
            r#let,
            name,
            value: lexemes::Equal(eq, Box::new(val)),
            semi,
            next: Box::new(next),
        })
    }

    pub fn parse_if(&mut self) -> Result<IfExpr> {
        let if_ = self.expect_keyword("if")?;
        let cond = self.parse_expr()?;
        let then = self.parse_brace(|this| this.parse_boxed_expr())?;
        let else_ = self.expect_keyword("else")?;
        let else_cond = self.parse_brace(|this| this.parse_boxed_expr())?;

        Ok(IfExpr {
            cond: lexemes::Tokenized(if_, Box::new(cond)),
            then,
            otherwise: lexemes::Tokenized(else_, else_cond),
        })
    }

    pub fn parse_pair<T>(&mut self, fun: fn(&mut Self) -> Result<T>) -> Result<PairNode<T>> {
        let sign = self.expect(TokenKind::Sign)?;
        let left = fun(self)?;
        let right = fun(self)?;
        Ok(PairNode {
            sign,
            left: Box::new(left),
            right: Box::new(right),
        })
    }

    pub fn parse_list<T>(&mut self, fun: fn(&mut Self) -> Result<T>) -> Result<ListNode<T>> {
        let bracket = self.parse_bracket(&|this| {
            let mut vec = ThinVec::default();

            if !this.get().is(TokenKind::RBracket) {
                vec.push(fun(this)?);
                let with_comma = this.get().is(TokenKind::Comma);
                while !this.get().is(TokenKind::RBracket) {
                    if with_comma {
                        this.expect(TokenKind::Comma)?;
                    }
                    vec.push(fun(this)?);
                }
            }

            Ok(vec)
        })?;

        Ok(ListNode { bracket })
    }

    pub fn parse_literal(&mut self) -> Result<Literal> {
        let tkn = self.bump();
        match &tkn.data {
            TokenKind::Num60(n60) => {
                let data = *n60;
                Ok(Literal::U60(lexemes::Tokenized(tkn, data)))
            }
            TokenKind::Float(float) => {
                let data = *float;
                Ok(Literal::F60(lexemes::Tokenized(tkn, data)))
            }
            TokenKind::Num120(n120) => {
                let data = *n120;
                Ok(Literal::U120(lexemes::Tokenized(tkn, data)))
            }
            TokenKind::Nat(nat) => {
                let data = nat.clone();
                Ok(Literal::Nat(lexemes::Tokenized(tkn, data)))
            }
            TokenKind::Str(str) => {
                let data = str.clone();
                Ok(Literal::String(lexemes::Tokenized(tkn, data)))
            }
            TokenKind::Char(char) => {
                let data = *char;
                Ok(Literal::Char(lexemes::Tokenized(tkn, data)))
            }
            _ => self.unexpected(),
        }
    }

    pub fn parse_atom_type(&mut self) -> Result<TypeExpr> {
        match &self.get().data {
            TokenKind::U => Ok(TypeExpr::Type(self.bump())),
            TokenKind::U60 => Ok(TypeExpr::TypeU60(self.bump())),
            TokenKind::U120 => Ok(TypeExpr::TypeU120(self.bump())),
            TokenKind::F60 => Ok(TypeExpr::TypeF60(self.bump())),
            TokenKind::Help(x) => {
                let data = x.clone();
                let tkn = self.bump();
                Ok(TypeExpr::Help(lexemes::Tokenized(tkn, data)))
            }
            _ => self.unexpected(),
        }
    }

    pub fn parse_atom_kind(&mut self) -> Result<ExprKind> {
        match &self.get().data {
            TokenKind::LowerId(_) => Ok(ExprKind::Local(Box::new(self.parse_var()?))),
            TokenKind::LPar => {
                let paren = self.parse_paren(|this| this.parse_expr())?;
                Ok(ExprKind::Paren(Box::new(paren)))
            }
            TokenKind::LBracket => {
                let list = self.parse_list(|this| this.parse_atom())?;
                Ok(ExprKind::List(Box::new(list)))
            }
            _ => Ok(ExprKind::Type(Box::new(self.parse_atom_type()?))),
        }
    }

    pub fn parse_atom(&mut self) -> Result<Expr> {
        let start = self.get().span.clone();
        let kind = self.parse_atom_kind()?;
        let end = self.prev_span.clone();
        Ok(lexemes::Item {
            data: kind,
            span: start.mix(&end),
        })
    }

    pub fn parse_expr(&mut self) -> Result<Expr> {
        todo!()
    }

    pub fn parse_boxed_expr(&mut self) -> Result<Box<Expr>> {
        Ok(Box::new(self.parse_expr()?))
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
