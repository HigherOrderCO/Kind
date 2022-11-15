use kind_tree::concrete::pat::{Pat, PatIdent, PatKind};

use crate::errors::SyntaxError;
use crate::lexer::tokens::Token;
use crate::macros::eat_single;
use crate::state::Parser;

impl<'a> Parser<'a> {
    pub fn is_pat_cons(&self) -> bool {
        self.get().same_variant(&Token::LPar) && self.peek(1).is_upper_id()
    }

    pub fn parse_pat_constructor(&mut self) -> Result<Box<Pat>, SyntaxError> {
        let start = self.range();
        self.advance(); // '('
        let name = self.parse_upper_id()?;
        let mut pats = Vec::new();
        while let Some(res) = self.try_single(&|s| s.parse_pat())? {
            pats.push(res)
        }
        let end = self.eat_variant(Token::RPar)?.1;
        Ok(Box::new(Pat {
            range: start.mix(end),
            data: PatKind::App(name, pats),
        }))
    }

    pub fn parse_pat_num60(&mut self) -> Result<Box<Pat>, SyntaxError> {
        let start = self.range();
        let num = eat_single!(self, Token::Num60(n) => *n)?;
        Ok(Box::new(Pat {
            range: start,
            data: PatKind::Num(kind_tree::Number::U60(num)),
        }))
    }

    pub fn parse_pat_num120(&mut self) -> Result<Box<Pat>, SyntaxError> {
        let start = self.range();
        let num = eat_single!(self, Token::Num120(n) => *n)?;
        Ok(Box::new(Pat {
            range: start,
            data: PatKind::Num(kind_tree::Number::U120(num)),
        }))
    }

    pub fn parse_pat_str(&mut self) -> Result<Box<Pat>, SyntaxError> {
        let start = self.range();
        let string = eat_single!(self, Token::Str(str) => str.clone())?;
        Ok(Box::new(Pat {
            range: start,
            data: PatKind::Str(string),
        }))
    }

    pub fn parse_pat_group(&mut self) -> Result<Box<Pat>, SyntaxError> {
        let start = self.range();
        self.advance(); // '('
        let mut pat = self.parse_pat()?;
        let end = self.eat_variant(Token::RPar)?.1;
        pat.range = start.mix(end);
        Ok(pat)
    }

    pub fn parse_pat_var(&mut self) -> Result<Box<Pat>, SyntaxError> {
        let id = self.parse_id()?;
        Ok(Box::new(Pat {
            range: id.range,
            data: PatKind::Var(PatIdent(id)),
        }))
    }

    pub fn parse_pat_single_cons(&mut self) -> Result<Box<Pat>, SyntaxError> {
        let id = self.parse_upper_id()?;
        Ok(Box::new(Pat {
            range: id.range,
            data: PatKind::App(id, vec![]),
        }))
    }

    pub fn parse_pat_hole(&mut self) -> Result<Box<Pat>, SyntaxError> {
        let range = self.range();
        self.eat_variant(Token::Hole)?;
        Ok(Box::new(Pat {
            range,
            data: PatKind::Hole,
        }))
    }

    fn parse_pat_list(&mut self) -> Result<Box<Pat>, SyntaxError> {
        let range = self.range();
        self.advance(); // '['
        let mut vec = Vec::new();

        if self.check_actual(Token::RBracket) {
            let range = self.advance().1.mix(range);
            return Ok(Box::new(Pat {
                range,
                data: PatKind::List(vec),
            }));
        }

        vec.push(*self.parse_pat()?);
        let mut initialized = false;
        let mut with_comma = false;
        loop {
            let ate_comma = self.check_and_eat(Token::Comma);
            if !initialized {
                initialized = true;
                with_comma = ate_comma;
            }
            if with_comma {
                self.check_and_eat(Token::Comma);
            }

            match self.try_single(&|x| x.parse_pat())? {
                Some(res) => vec.push(*res),
                None => break,
            }
        }

        let range = self.eat_variant(Token::RBracket)?.1.mix(range);

        Ok(Box::new(Pat {
            range,
            data: PatKind::List(vec),
        }))
    }

    pub fn parse_pat(&mut self) -> Result<Box<Pat>, SyntaxError> {
        if self.is_pat_cons() {
            self.parse_pat_constructor()
        } else if self.get().is_str() {
            self.parse_pat_str()
        } else if self.get().is_num60() {
            self.parse_pat_num60()
        } else if self.get().is_num120() {
            self.parse_pat_num120()
        } else if self.check_actual(Token::LPar) {
            self.parse_pat_group()
        } else if self.get().is_lower_id() {
            self.parse_pat_var()
        } else if self.get().is_upper_id() {
            self.parse_pat_single_cons()
        } else if self.check_actual(Token::LBrace) {
            self.parse_pat_list()
        } else if self.check_actual(Token::Hole) {
            self.parse_pat_hole()
        } else {
            self.fail(vec![])
        }
    }
}
