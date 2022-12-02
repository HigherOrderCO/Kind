use kind_tree::concrete::{Attribute, Constructor, RecordDecl, SumTypeDecl};
use kind_tree::symbol::Ident;
use kind_tree::telescope::Telescope;

use crate::errors::SyntaxDiagnostic;
use crate::lexer::tokens::Token;
use crate::state::Parser;

impl<'a> Parser<'a> {
    pub fn parse_constructor(&mut self) -> Result<Constructor, SyntaxDiagnostic> {
        let attrs = self.parse_attrs()?;
        let docs = self.parse_docs()?;
        let name = self.parse_any_id()?;
        let args = self.parse_arguments()?;

        let typ = if self.check_and_eat(Token::Colon) {
            Some(self.parse_expr(false)?)
        } else {
            None
        };

        self.check_and_eat(Token::Semi);

        Ok(Constructor {
            name,
            attrs,
            docs,
            args: Telescope::new(args),
            typ,
        })
    }

    pub fn parse_sum_type_def(
        &mut self,
        docs: Vec<String>,
        attrs: Vec<Attribute>,
    ) -> Result<SumTypeDecl, SyntaxDiagnostic> {
        self.eat_id("type")?;

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
            parameters: Telescope::new(parameters),
            indices: Telescope::new(indices),
            constructors,
            attrs,
        })
    }

    pub fn parse_record_def(
        &mut self,
        docs: Vec<String>,
        attrs: Vec<Attribute>,
    ) -> Result<RecordDecl, SyntaxDiagnostic> {
        self.eat_id("record")?;

        let name = self.parse_upper_id()?;

        let parameters = self.parse_arguments()?;

        let range = self.range();

        self.eat_variant(Token::LBrace)?;

        let cons_attrs = self.parse_attrs()?;

        let constructor = if self.check_actual_id("constructor") {
            self.eat_id("constructor")?;
            let res = self.parse_id()?;
            self.check_and_eat(Token::Comma);
            res
        } else {
            Ident::new("new".to_string(), name.range)
        };

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
            parameters: Telescope::new(parameters),
            fields,
            attrs,
            cons_attrs,
        })
    }
}
