use kind_span::Locatable;
use kind_tree::concrete::{Attribute, AttributeStyle};

use crate::errors::SyntaxError;
use crate::lexer::tokens::Token;
use crate::state::Parser;

impl<'a> Parser<'a> {
    pub fn parse_attr_args(&mut self) -> Result<Vec<AttributeStyle>, SyntaxError> {
        let mut attrs = Vec::new();

        let range = self.range();

        if self.check_and_eat(Token::LBracket) {
            while let Some(res) = self.try_single(&|fun| fun.parse_attr_style())? {
                attrs.push(res);
                if !self.check_and_eat(Token::Comma) {
                    break;
                }
            }

            self.eat_closing_keyword(Token::RBracket, range)?;
        }

        Ok(attrs)   
    }

    pub fn parse_attr_style(&mut self) -> Result<AttributeStyle, SyntaxError> {
        match self.get().clone() {
            Token::LowerId(_) | Token::UpperId(_, None) => {
                let range = self.range();
                let ident = self.parse_any_id()?;
                Ok(AttributeStyle::Ident(range, ident))
            }
            Token::Num60(num) => {
                let range = self.range();
                self.advance();
                Ok(AttributeStyle::Number(range, num))
            }
            Token::Str(str) => {
                let range = self.range();
                self.advance();
                Ok(AttributeStyle::String(range, str))
            }
            Token::LBracket => {
                let range = self.range();
                self.advance();

                let mut attrs = Vec::new();
                while let Some(res) = self.try_single(&|fun| fun.parse_attr_style())? {
                    attrs.push(res);
                    if !self.check_and_eat(Token::Comma) {
                        break;
                    }
                }

                let end = self.range();
                self.eat_closing_keyword(Token::RBracket, range)?;
                Ok(AttributeStyle::List(range.mix(end), attrs))
            }
            _ => self.fail(Vec::new()),
        }
    }

    pub fn parse_attr(&mut self) -> Result<Attribute, SyntaxError> {
        let start = self.range();
        self.eat_variant(Token::Hash)?;

        let name = self.parse_id()?;

        let args = self.parse_attr_args()?;

        let style = if self.check_and_eat(Token::Eq) {
            Some(self.parse_attr_style()?)
        } else {
            None
        };
        Ok(Attribute {
            range: start.mix(style.clone().map(|x| x.locate()).unwrap_or(name.range)),
            value: style,
            args,
            name,
        })
    }

    pub fn parse_attrs(&mut self) -> Result<Vec<Attribute>, SyntaxError> {
        let mut attrs = Vec::new();
        while let Some(res) = self.try_single(&|fun| fun.parse_attr())? {
            attrs.push(res);
        }
        Ok(attrs)
    }
}
