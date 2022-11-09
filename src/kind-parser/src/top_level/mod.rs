use fxhash::FxHashMap;
use kind_tree::concrete::expr::Expr;
use kind_tree::concrete::pat::{PatIdent, Pat, PatKind};
/// Parses all of the top level structures
/// like Book, Entry, Rule and Argument.
use kind_tree::concrete::{Argument, Attribute, Entry, Module, Rule, Telescope, TopLevel, ExprKind};
use kind_tree::symbol::QualifiedIdent;

use crate::errors::SyntaxError;
use crate::lexer::tokens::Token;
use crate::state::Parser;

pub mod attributes;
pub mod type_decl;

fn is_hidden_arg(token: &Token) -> bool {
    matches!(token, Token::Greater)
}

impl<'a> Parser<'a> {
    pub fn is_top_level_entry_continuation(&self) -> bool {
        self.peek(1).same_variant(&Token::Colon) // ':'
            || self.peek(1).same_variant(&Token::LPar) // '('
            || self.peek(1).same_variant(&Token::LBrace) // '{'
            || self.peek(1).same_variant(&Token::Less) // '<'
            || self.peek(1).same_variant(&Token::Minus)  // '-'
            || self.peek(1).same_variant(&Token::Plus) // '+'
    }

    pub fn is_top_level_entry(&self) -> bool {
        self.get().is_upper_id() && self.is_top_level_entry_continuation()
    }

    pub fn is_top_level_start(&self) -> bool {
        self.is_top_level_entry()
            || self.get().same_variant(&Token::Type)
            || self.get().same_variant(&Token::Record)
            || self.get().same_variant(&Token::Hash)
            || self.get().is_doc()
    }

    pub fn complement_binding_op(&self) -> Option<Token> {
        match self.get() {
            Token::LPar => Some(Token::RPar),
            Token::Less => Some(Token::Greater),
            _ => None,
        }
    }

    pub fn parse_argument(&mut self) -> Result<Argument, SyntaxError> {
        let start = self.range();

        let erased = self.check_and_eat(Token::Minus);
        let keep = self.check_and_eat(Token::Plus);

        let complement = self.complement_binding_op();
        match &complement {
            Some(_) => Ok(self.advance()),
            None => self.fail(vec![Token::Plus, Token::Minus, Token::LPar, Token::Less]), // TODO: Add multiple
        }?;

        let hidden = is_hidden_arg(complement.as_ref().unwrap());
        let name = self.parse_id()?;

        let typ = if self.check_and_eat(Token::Colon) {
            Some(self.parse_expr(false)?)
        } else {
            None
        };

        let erased = if hidden { !keep } else { erased };

        let res = self.eat_variant(complement.unwrap())?.1;
        let range = start.mix(res);
        Ok(Argument {
            hidden,
            erased,
            name,
            typ,
            range,
        })
    }

    pub fn parse_rule(&mut self, name: String) -> Result<Box<Rule>, SyntaxError> {
        let start = self.range();
        let ident;
        if let Token::UpperId(name_id, ext) = self.get() {
            let qual = QualifiedIdent::new_static(name_id.as_str(), ext.clone(), start);
            if qual.to_string() == name {
                ident = self.parse_upper_id()?;
            } else {
                return self.fail(vec![]);
            }
        } else {
            return self.fail(vec![]);
        }
        let mut pats = Vec::new();
        while !self.get().same_variant(&Token::Eq) && !self.get().same_variant(&Token::Eof) {
            pats.push(self.parse_pat()?);
        }
        self.eat_variant(Token::Eq)?;
        let body = self.parse_expr(false)?;
        let end = start.mix(body.range);
        Ok(Box::new(Rule {
            name: ident,
            pats,
            body,
            range: end,
        }))
    }

    pub fn parse_arguments(&mut self) -> Result<Vec<Argument>, SyntaxError> {
        let mut args = Vec::new();
        while let Some(res) = self.try_single(&|fun| fun.parse_argument())? {
            args.push(res);
        }
        Ok(args)
    }

    pub fn parse_docs(&mut self) -> Result<Vec<String>, SyntaxError> {
        let mut docs = Vec::new();
        while let Token::Comment(_, str) = &self.get() {
            docs.push(str.clone());
            self.advance();
        }
        Ok(docs)
    }

    pub fn parse_entry(
        &mut self,
        docs: Vec<String>,
        attrs: Vec<Attribute>,
    ) -> Result<Entry, SyntaxError> {
        let start = self.range();

        if self.get().is_lower_id() && self.is_top_level_entry_continuation() {
            let ident = self.parse_id()?;
            return Err(SyntaxError::LowerCasedDefinition(
                ident.to_string(),
                ident.range,
            ));
        }

        // Just to make errors more localized
        if !self.is_top_level_entry() {
            self.fail(vec![])?
        }

        let ident = self.parse_upper_id()?;

        let args = self.parse_arguments()?;

        self.eat_variant(Token::Colon)?;
        let typ = self.parse_expr(false)?;

        if self.check_actual(Token::LBrace) {
            let start = self.range();

            self.eat_variant(Token::LBrace)?;

            let body = self.parse_expr(true)?;

            let end = self.range();
            self.eat_closing_keyword(Token::RBrace, start)?;

            let mut rules = vec![
                Box::new(Rule {
                    name: ident.clone(),
                    pats: args.iter().map(|x| Box::new(Pat {
                        range: x.range,
                        data: PatKind::Var(PatIdent(x.name.clone())),
                    })).collect(),
                    body,
                    range: end,
                })
            ];
            loop {
                let res = self.try_single(&|parser| parser.parse_rule(ident.to_string()))?;
                match res {
                    Some(res) => rules.push(res),
                    None => break,
                }
            }
            let end = rules.last().as_ref().map(|x| x.range).unwrap_or(typ.range);

            // Better error message when you have change the name of the function
            if self.get().is_upper_id() && !self.is_top_level_entry_continuation() {
                return Err(SyntaxError::NotAClauseOfDef(ident.range.clone(), self.range()));
            }

            Ok(Entry {
                name: ident,
                docs,
                args: Telescope::new(args),
                typ,
                rules,
                attrs,
                range: start.mix(end),
            })
        } else {
            let mut rules = Vec::new();
            loop {
                let res = self.try_single(&|parser| parser.parse_rule(ident.to_string()))?;
                match res {
                    Some(res) => rules.push(res),
                    None => break,
                }
            }
            let end = rules.last().as_ref().map(|x| x.range).unwrap_or(typ.range);

            // Better error message when you have change the name of the function
            if self.get().is_upper_id() && !self.is_top_level_entry_continuation() {
                return Err(SyntaxError::NotAClauseOfDef(ident.range, self.range()));
            }

            Ok(Entry {
                name: ident,
                docs,
                args: Telescope::new(args),
                typ,
                rules,
                attrs,
                range: start.mix(end),
            })
        }
    }

    pub fn parse_top_level(&mut self) -> Result<TopLevel, SyntaxError> {
        let docs = self.parse_docs()?;
        let attrs = self.parse_attrs()?;

        if self.check_actual(Token::Type) {
            Ok(TopLevel::SumType(self.parse_sum_type_def(docs, attrs)?))
        } else if self.check_actual(Token::Record) {
            Ok(TopLevel::RecordType(self.parse_record_def(docs, attrs)?))
        } else if self.is_top_level_entry_continuation() {
            Ok(TopLevel::Entry(self.parse_entry(docs, attrs)?))
        } else if self.check_actual(Token::Use) {
            Err(SyntaxError::CannotUseUse(self.range()))
        } else {
            self.fail(vec![])
        }
    }

    pub fn parse_use(&mut self) -> Result<(String, String), SyntaxError> {
        self.eat_variant(Token::Use)?;
        let origin = self.parse_upper_id()?;
        self.eat_variant(Token::As)?;
        let alias = self.parse_upper_id()?;

        match (origin, alias) {
            (
                QualifiedIdent {
                    aux: Some(_),
                    range,
                    ..
                },
                _,
            )
            | (
                _,
                QualifiedIdent {
                    aux: Some(_),
                    range,
                    ..
                },
            ) => Err(SyntaxError::ImportsCannotHaveAlias(range)),
            (origin, alias) => Ok((origin.to_string(), alias.to_string())),
        }
    }

    pub fn parse_module(&mut self) -> Module {
        let mut entries: Vec<TopLevel> = Vec::new();
        let mut uses: FxHashMap<String, String> = Default::default();

        while self.get().same_variant(&Token::Use) {
            match self.parse_use() {
                Ok((origin, alias)) => {
                    uses.insert(alias, origin);
                }
                Err(err) => {
                    self.errs.send(err.into()).unwrap();
                    self.failed = true;
                    break;
                }
            }
        }

        while !self.get().same_variant(&Token::Eof) {
            match self.parse_top_level() {
                Ok(entry) => entries.push(entry),
                Err(err) => {
                    self.advance();
                    self.errs.send(err.into()).unwrap();
                    self.failed = true;
                    while !self.is_top_level_start() && !self.get().same_variant(&Token::Eof) {
                        self.advance();
                    }
                }
            }
        }

        let res = self.eat_variant(Token::Eof);

        match res {
            Ok(_) => (),
            Err(err) => {
                self.errs.send(err.into()).unwrap();
                self.failed = true;
            }
        }

        Module { entries, uses }
    }
}
