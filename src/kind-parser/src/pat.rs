use kind_tree::concrete::pat::{Pat, PatKind};

use crate::errors::SyntaxError;
use crate::lexer::tokens::Token;
use crate::macros::eat_single;
use crate::state::Parser;

impl<'a> Parser<'a> {
    pub fn is_pat_cons(&self) -> bool {
        self.get().same_variant(Token::LPar) && self.peek(1).is_id()
    }

    pub fn parse_pat_constructor(&mut self) -> Result<Box<Pat>, SyntaxError> {
        let start = self.span();
        self.bump(); // '('
        let name = self.parse_id()?;
        let mut pats = Vec::new();
        while let Some(res) = self.try_single(&|s| s.parse_pat())? {
            pats.push(res)
        }
        let end = self.eat_variant(Token::RPar)?.1;
        Ok(Box::new(Pat {
            span: start.mix(end),
            data: PatKind::App(name, pats),
        }))
    }

    pub fn parse_pat_num(&mut self) -> Result<Box<Pat>, SyntaxError> {
        let start = self.span();
        let num = eat_single!(self, Token::Num(n) => *n)?;
        Ok(Box::new(Pat {
            span: start,
            data: PatKind::Num(num),
        }))
    }

    pub fn parse_pat_str(&mut self) -> Result<Box<Pat>, SyntaxError> {
        let start = self.span();
        let string = eat_single!(self, Token::Str(str) => str.clone())?;
        Ok(Box::new(Pat {
            span: start,
            data: PatKind::Str(string),
        }))
    }

    pub fn parse_pat_group(&mut self) -> Result<Box<Pat>, SyntaxError> {
        let start = self.span();
        self.bump(); // '('
        let mut pat = self.parse_pat()?;
        let end = self.eat_variant(Token::RPar)?.1;
        pat.span = start.mix(end);
        Ok(pat)
    }

    pub fn parse_pat_var(&mut self) -> Result<Box<Pat>, SyntaxError> {
        let id = self.parse_id()?;
        Ok(Box::new(Pat {
            span: id.span,
            data: PatKind::Var(id),
        }))
    }

    fn parse_pat_list(&mut self) -> Result<Box<Pat>, SyntaxError> {
        let span = self.span();
        self.bump(); // '['
        let mut vec = Vec::new();

        if self.check_actual(Token::RBracket) {
            let span = self.advance().1.mix(span);
            return Ok(Box::new(Pat { span, data: PatKind::List(vec) }));
        }

        vec.push(*self.parse_pat()?);
        let mut initialized = false;
        let mut with_comma = false;
        loop {
            let ate_comma = self.eat_keyword(Token::Comma);
            if !initialized {
                initialized = true;
                with_comma = ate_comma;
            }
            if with_comma {
                self.eat_keyword(Token::Comma);
            }

            match self.try_single(&|x| x.parse_pat())? {
                Some(res) => vec.push(*res),
                None => break,
            }
        }

        let span = self.eat_variant(Token::RBracket)?.1.mix(span);

        Ok(Box::new(Pat { span, data: PatKind::List(vec) }))
    }

    pub fn parse_pat(&mut self) -> Result<Box<Pat>, SyntaxError> {
        if self.is_pat_cons() {
            self.parse_pat_constructor()
        } else if self.get().is_str() {
            self.parse_pat_str()
        } else if self.get().is_num() {
            self.parse_pat_num()
        } else if self.check_actual(Token::LPar) {
            self.parse_pat_group()
        } else if self.get().is_id() {
            self.parse_pat_var()
        } else if self.check_actual(Token::LBrace) {
            self.parse_pat_list()
        } else {
            self.fail(vec![])
        }
    }
}
