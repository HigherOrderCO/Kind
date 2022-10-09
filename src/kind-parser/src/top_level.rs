/// Parses all of the top level structures
/// like Book, Entry, Rule and Argument.
use std::collections::HashMap;

use kind_tree::concrete::{Argument, Book, Entry, Rule};

use crate::errors::SyntaxError;
use crate::lexer::tokens::Token;
use crate::state::Parser;

fn is_hidden_arg(token: &Token) -> bool {
    matches!(token, Token::Greater)
}

impl<'a> Parser<'a> {
    pub fn complement_binding_op(&self) -> Option<Token> {
        match self.get() {
            Token::LPar => Some(Token::RPar),
            Token::Less => Some(Token::Greater),
            _ => None,
        }
    }

    pub fn parse_argument(&mut self) -> Result<Box<Argument>, SyntaxError> {
        let start = self.span();

        let erased = self.eat_keyword(Token::Minus);
        let keep = self.eat_keyword(Token::Plus);

        let complement = self.complement_binding_op();
        match &complement {
            Some(_) => Ok(self.advance()),
            None => self.fail(vec![Token::Plus, Token::Minus, Token::LPar, Token::Less]), // TODO: Add multiple
        }?;

        let hidden = is_hidden_arg(complement.as_ref().unwrap());
        let name = self.parse_id()?;

        let tipo = if self.eat_keyword(Token::Colon) { Some(self.parse_expr(false)?) } else { None };
        let erased = if hidden { !keep } else { erased };

        let res = self.eat_variant(complement.unwrap())?.1;
        let span = res.mix(start);
        Ok(Box::new(Argument { hidden, erased, name, tipo, span }))
    }

    pub fn parse_rule(&mut self, name: String) -> Result<Box<Rule>, SyntaxError> {
        let start = self.span();
        let ident;
        if let Token::Id(name_id) = self.get() {
            if *name_id == name {
                ident = self.parse_id()?;
            } else {
                return self.fail(vec![Token::Id(name)]);
            }
        } else {
            return self.fail(vec![Token::Id(name)]);
        }
        let mut pats = Vec::new();
        while !self.get().same_variant(Token::Eq) && !self.get().same_variant(Token::Eof) {
            pats.push(self.parse_pat()?);
        }
        self.eat_variant(Token::Eq)?;
        let body = self.parse_expr(false)?;
        let end = start.mix(body.span);
        Ok(Box::new(Rule {
            name: ident,
            pats,
            body,
            span: end,
        }))
    }

    pub fn parse_entry(&mut self) -> Result<Box<Entry>, SyntaxError> {
        let start = self.span();
        let ident = self.parse_id()?;
        let docs = None;
        let mut args = Vec::new();
        loop {
            if let Token::Colon | Token::Eof = self.get() {
                break;
            }
            args.push(self.parse_argument()?);
        }
        self.eat_variant(Token::Colon)?;
        let tipo = self.parse_expr(false)?;
        let mut rules = Vec::new();
        loop {
            let res = self.try_single(&|parser| parser.parse_rule(ident.data.0.clone()))?;
            match res {
                Some(res) => rules.push(res),
                None => break,
            }
        }
        let end = rules.last().as_ref().map(|x| x.span).unwrap_or(tipo.span);
        Ok(Box::new(Entry {
            name: ident,
            docs,
            args,
            tipo,
            rules,
            attrs: Vec::new(),
            span: start.mix(end),
        }))
    }

    pub fn parse_book(&mut self) -> Result<Book, SyntaxError> {
        let mut entrs = HashMap::new();
        let mut names = Vec::new();
        loop {
            if let Token::Eof = self.get() {
                break;
            }
            let entry = self.parse_entry()?;
            if entrs.get(&entry.name.data.0).is_none() {
                names.push(entry.name.clone());
                entrs.insert(entry.name.data.0.clone(), entry);
            }
        }
        self.eat_variant(Token::Eof)?;
        Ok(Book { names, entrs })
    }
}
