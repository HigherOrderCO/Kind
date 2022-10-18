use kind_tree::concrete::{Attribute, Constructor, RecordDecl, SumTypeDecl, Telescope};

use crate::errors::SyntaxError;
use crate::lexer::tokens::Token;
use crate::state::Parser;

impl<'a> Parser<'a> {
    pub fn parse_constructor(&mut self) -> Result<Constructor, SyntaxError> {
        let docs = self.parse_docs()?;
        let name = self.parse_id()?;
        let args = self.parse_arguments()?;

        let typ = if self.check_and_eat(Token::Colon) {
            Some(self.parse_expr(false)?)
        } else {
            None
        };

        Ok(Constructor {
            name,
            docs,
            args: Telescope(args),
            tipo: typ,
        })
    }

    pub fn parse_sum_type_def(
        &mut self,
        docs: Vec<String>,
        attrs: Vec<Attribute>,
    ) -> Result<SumTypeDecl, SyntaxError> {
        self.eat_variant(Token::Type)?;
        let name = self.parse_upper_id()?;

        let parameters = self.parse_arguments()?;

        let indices = if self.check_and_eat(Token::Tilde) {
            self.parse_arguments()?
        } else {
            Vec::new()
        };

        let range = self.range();
        self.eat_variant(Token::LBrace)?;

        let mut constructors = vec![];

        while !self.get().same_variant(&Token::RBrace) && !self.get().same_variant(&Token::Eof) {
            constructors.push(self.parse_constructor()?);
        }

        self.eat_closing_keyword(Token::RBrace, range)?;

        Ok(SumTypeDecl {
            name,
            docs,
            parameters: Telescope(parameters),
            indices: Telescope(indices),
            constructors,
            attrs,
        })
    }

    pub fn parse_record_def(
        &mut self,
        docs: Vec<String>,
        attrs: Vec<Attribute>,
    ) -> Result<RecordDecl, SyntaxError> {
        self.eat_variant(Token::Record)?;
        let name = self.parse_upper_id()?;

        let parameters = self.parse_arguments()?;

        let range = self.range();

        self.eat_variant(Token::LBrace)?;
        self.eat_variant(Token::Constructor)?;

        let constructor = self.parse_id()?;

        self.check_and_eat(Token::Comma);

        let mut fields = vec![];

        while !self.get().same_variant(&Token::RBrace) && !self.get().same_variant(&Token::Eof) {
            let docs = self.parse_docs()?;
            let name = self.parse_id()?;
            self.eat_variant(Token::Colon)?;
            let typ = self.parse_expr(false)?;
            fields.push((name, docs, typ))
        }

        self.eat_closing_keyword(Token::RBrace, range)?;

        Ok(RecordDecl {
            name,
            docs,
            constructor,
            parameters: Telescope(parameters),
            fields,
            attrs,
        })
    }
}
