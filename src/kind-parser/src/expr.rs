use kind_tree::expr::{Expr, ExprKind};
use kind_tree::symbol::{Ident, Symbol};

use crate::errors::SyntaxError;
use crate::lexer::tokens::Token;
use crate::state::Parser;

impl<'a> Parser<'a> {
    fn parse_lambda(&mut self, name: String) -> Result<Box<Expr>, SyntaxError> {
        // We are assuming that it came from parse_atom.
        // so we just remove the argument and "=>"
        let name_span = self.advance().1;
        self.advance();

        let expr = self.parse_expr()?;
        let end_range = expr.span;

        let ident = Ident::new(Symbol(name), self.ctx, name_span);

        Ok(Box::new(Expr {
            data: ExprKind::Lambda(ident, expr),
            span: name_span.mix(end_range),
        }))
    }

    fn parse_atom(&mut self) -> Result<Box<Expr>, SyntaxError> {
        todo!()
    }

    pub fn parse_expr(&mut self) -> Result<Box<Expr>, SyntaxError> {
        // Simply matching both on the current and the next one.
        // it's useful for a lot of tokens.
        match (self.get().clone(), self.peek()) {
            (Token::Id(name), Token::FatArrow) => self.parse_lambda(name),
            (Token::LPar, Token::Id(name)) => {
                let start = self.advance().1;
                let res = match self.peek() {
                    _ => todo!()
                };
                self.eat_variant(&Token::LPar)?;
                todo!()
            }
            (Token::LBracket, Token::Id(name)) => todo!(),
            (Token::LPar, Token::Id(name)) => todo!(),
            _ => todo!(),
        }
    }
}
