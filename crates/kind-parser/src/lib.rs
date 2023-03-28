use std::collections::VecDeque;

use diagnostics::{SyntaxDiagnostic, SyntaxDiagnosticKind};
use thin_vec::ThinVec;

use kind_diagnostic::Diagnostic;
use kind_lexer::tokens::{Token, TokenKind};
use kind_lexer::Lexer;
use kind_span::Span;
use kind_syntax::concrete::*;
use kind_syntax::lexemes::*;

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

    pub(crate) fn span(&mut self) -> Span {
        self.get().span.clone()
    }

    pub(crate) fn last_span(&mut self) -> Span {
        self.prev_span.clone()
    }

    /// Checks if the next token is the expected one and returns the consumed token.
    pub(crate) fn expect(&mut self, expect: TokenKind) -> Result<Token> {
        if self.is(expect) {
            Ok(self.bump())
        } else {
            self.unexpected()
        }
    }

    pub(crate) fn expect_match<U>(&mut self, expect: fn(&Token) -> Option<U>) -> Result<U> {
        if let Some(token) = expect(self.get()) {
            self.bump();
            Ok(token)
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

    pub fn parse_any_name(&mut self) -> Result<Ident> {
        if let TokenKind::UpperId(str) | TokenKind::LowerId(str) = &self.get().data {
            let str = str.clone();
            let tkn = self.bump();
            let span = tkn.span.clone();
            Ok(Ident(Item {
                span,
                data: Tokenized(tkn, str),
            }))
        } else {
            self.unexpected()
        }
    }

    /// Parses brackets around another parser defined in the argument `fun`
    pub(crate) fn parse_bracket<T>(
        &mut self,
        fun: &dyn Fn(&mut Self) -> Result<T>,
    ) -> Result<Bracket<T>> {
        Ok(Bracket(
            self.expect(TokenKind::LBracket)?,
            fun(self)?,
            self.expect(TokenKind::RBracket)?,
        ))
    }

    pub(crate) fn parse_brace<T>(&mut self, fun: fn(&mut Self) -> Result<T>) -> Result<Brace<T>> {
        Ok(Brace(
            self.expect(TokenKind::LBrace)?,
            fun(self)?,
            self.expect(TokenKind::RBrace)?,
        ))
    }

    /// Parses parenthesis around another parser defined in the argument `fun`.
    pub(crate) fn parse_paren<T>(&mut self, fun: fn(&mut Self) -> Result<T>) -> Result<Paren<T>> {
        Ok(Paren(
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

    pub fn parse_item<T>(&mut self, fun: fn(&mut Self) -> Result<T>) -> Result<Item<T>> {
        let start = self.span();
        let data = fun(self)?;
        let end = self.last_span();
        let span = start.mix(&end);
        Ok(Item { data, span })
    }

    pub fn parse_string(&mut self) -> Result<Tokenized<String>> {
        if let TokenKind::Str(str) = &self.get().data {
            let str = str.clone();
            let tkn = self.bump();
            Ok(Tokenized(tkn, str))
        } else {
            self.unexpected()
        }
    }

    pub fn parse_u60(&mut self) -> Result<Tokenized<u64>> {
        if let TokenKind::Num60(n) = &self.get().data {
            let n = *n;
            let tkn = self.bump();
            Ok(Tokenized(tkn, n))
        } else {
            self.unexpected()
        }
    }

    pub fn parse_attribute_style(&mut self) -> Result<AttributeStyle> {
        match &self.get().data {
            TokenKind::UpperId(_) | TokenKind::LowerId(_) => {
                let name = self.parse_any_name()?;
                let span = name.0.span.clone();
                Ok(Item::new(span, AttributeStyleKind::Identifier(name)))
            }
            TokenKind::Str(_) => {
                let token = self.parse_string()?;
                Ok(Item::new(token.span(), AttributeStyleKind::String(token)))
            }
            TokenKind::Num60(_) => {
                let token = self.parse_u60()?;
                Ok(Item::new(token.span(), AttributeStyleKind::Number(token)))
            }
            TokenKind::LBracket => {
                let bracket = self.parse_bracket(&|this| {
                    this.parse_separated_by_comma(Parser::parse_attribute_style)
                })?;
                Ok(Item::new(bracket.span(), AttributeStyleKind::List(bracket)))
            }
            _ => self.unexpected(),
        }
    }

    pub fn parse_attribute(&mut self) -> Result<Attribute> {
        let hash = self.expect(TokenKind::Hash)?;
        let name = self.parse_any_name()?;

        let arguments = self.try_with(|this| {
            this.parse_bracket(&|this| this.parse_separated_by_comma(Self::parse_attribute_style))
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

    pub fn parse_var(&mut self) -> Result<LocalExpr> {
        let name = self.parse_any_name()?;
        Ok(LocalExpr { name })
    }

    pub fn parse_type_binding(&mut self) -> Result<TypeBinding> {
        let name = self.parse_any_name()?;
        let colon = self.expect(TokenKind::Colon)?;
        let ty = self.parse_boxed_expr()?;
        Ok(TypeBinding {
            name,
            typ: Colon(colon, ty),
        })
    }

    pub fn is_param(&mut self) -> bool {
        self.peek(0).is(TokenKind::LPar)
            && self.peek(1).is_lower_id()
            && self.peek(2).is(TokenKind::Colon)
    }

    pub fn parse_param(&mut self) -> Result<Param> {
        if self.is_param() {
            let paren = self.parse_paren(Self::parse_type_binding)?;
            Ok(Param::Named(paren))
        } else {
            let expr = self.parse_boxed_expr()?;
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
                let expr = this.parse_boxed_expr()?;
                Ok(Rename(name, Equal(eq, expr)))
            })?;

            NamedBinding::Named(rename)
        } else {
            NamedBinding::Expr(Box::new(self.parse_atom()?))
        };

        Ok(Binding { tilde, value })
    }

    pub fn parse_lower_id(&mut self) -> Result<Ident> {
        if let TokenKind::LowerId(name) = &self.get().data {
            let name = name.clone();
            let tkn = self.bump();
            Ok(Ident(Item {
                span: tkn.span.clone(),
                data: Tokenized(tkn, name),
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
        let value = self.parse_boxed_expr()?;
        let r#semi = self.eat(TokenKind::Semi);
        let next = self.parse_boxed_expr()?;

        Ok(LetExpr {
            r#let,
            name,
            value: Equal(eq, value),
            r#semi,
            next,
        })
    }

    pub fn parse_if(&mut self) -> Result<IfExpr> {
        let r#if = self.expect_keyword("if")?;
        let cond = self.parse_boxed_expr()?;
        let then = self.parse_brace(Self::parse_boxed_expr)?;
        let otherwise = self.expect_keyword("else")?;
        let otherwise_cond = self.parse_brace(Self::parse_boxed_expr)?;

        Ok(IfExpr {
            cond: Tokenized(r#if, cond),
            then,
            otherwise: Tokenized(otherwise, otherwise_cond),
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
                Ok(Literal::U60(Tokenized(tkn, data)))
            }
            TokenKind::Float(float) => {
                let data = *float;
                Ok(Literal::F60(Tokenized(tkn, data)))
            }
            TokenKind::Num120(n120) => {
                let data = *n120;
                Ok(Literal::U120(Tokenized(tkn, data)))
            }
            TokenKind::Nat(nat) => {
                let data = nat.clone();
                Ok(Literal::Nat(Tokenized(tkn, data)))
            }
            TokenKind::Str(str) => {
                let data = str.clone();
                Ok(Literal::String(Tokenized(tkn, data)))
            }
            TokenKind::Char(char) => {
                let data = *char;
                Ok(Literal::Char(Tokenized(tkn, data)))
            }
            _ => self.unexpected(),
        }
    }

    pub fn parse_help(&mut self) -> Result<TypeExpr> {
        let data = self.expect_match(|x| match &x.data {
            TokenKind::Help(x) => Some(x.clone()),
            _ => None,
        })?;

        Ok(TypeExpr::Help(Tokenized(self.bump(), data)))
    }

    pub fn parse_atom_type(&mut self) -> Result<TypeExpr> {
        match &self.get().data {
            TokenKind::U => Ok(TypeExpr::Type(self.bump())),
            TokenKind::U60 => Ok(TypeExpr::TypeU60(self.bump())),
            TokenKind::U120 => Ok(TypeExpr::TypeU120(self.bump())),
            TokenKind::F60 => Ok(TypeExpr::TypeF60(self.bump())),
            TokenKind::Help(_) => self.parse_help(),
            _ => self.unexpected(),
        }
    }

    pub fn parse_atom_kind(&mut self) -> Result<ExprKind> {
        use ExprKind::*;

        match &self.get().data {
            TokenKind::LPar => self
                .parse_paren(Self::parse_expr)
                .map(|x| Paren(Box::new(x))),
            TokenKind::LBracket => self.parse_list(Self::parse_atom).map(|x| List(Box::new(x))),
            TokenKind::LowerId(_) => self.parse_var().map(|x| Local(Box::new(x))),
            _ => Ok(Type(Box::new(self.parse_atom_type()?))),
        }
    }

    pub fn parse_atom(&mut self) -> Result<Expr> {
        self.parse_item(Self::parse_atom_kind)
    }

    pub fn parse_expr_kind(&mut self) -> Result<ExprKind> {
        todo!()
    }

    pub fn parse_expr(&mut self) -> Result<Expr> {
        self.parse_item(Self::parse_expr_kind)
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
