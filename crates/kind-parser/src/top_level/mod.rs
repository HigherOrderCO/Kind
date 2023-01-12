use fxhash::FxHashMap;
use kind_tree::concrete::expr::Expr;
use kind_tree::concrete::pat::{Pat, PatIdent, PatKind};

use kind_tree::concrete::*;
use kind_tree::symbol::QualifiedIdent;
use kind_tree::telescope::Telescope;

use crate::diagnostic::SyntaxDiagnostic;
use crate::lexer::tokens::Token;
use crate::state::Parser;

pub mod attributes;
pub mod type_decl;

fn is_hidden_arg(token: &Token) -> bool {
    matches!(token, Token::Greater)
}

impl<'a> Parser<'a> {
    fn is_top_level_entry_continuation(&self) -> bool {
        self.peek(1).same_variant(&Token::Colon)         // ':'
            || self.peek(1).same_variant(&Token::LPar)   // '('
            || self.peek(1).same_variant(&Token::LBrace) // '{'
            || self.peek(1).same_variant(&Token::Less)   // '<'
            || self.peek(1).same_variant(&Token::Minus)  // '-'
            || self.peek(1).same_variant(&Token::Plus) // '+'
    }

    fn is_top_level_entry(&self) -> bool {
        self.get().is_upper_id() && self.is_top_level_entry_continuation()
    }

    fn is_safe_level_start(&self) -> bool {
        self.check_actual_id("type")
            || self.check_actual_id("record")
            || self.get().same_variant(&Token::Hash)
            || self.get().is_doc()
    }

    fn complement_binding_op(&self) -> Option<Token> {
        match self.get() {
            Token::LPar => Some(Token::RPar),
            Token::Less => Some(Token::Greater),
            _ => None,
        }
    }

    fn parse_argument(&mut self) -> Result<Argument, SyntaxDiagnostic> {
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

    fn parse_rule(&mut self, name: String) -> Result<Box<Rule>, SyntaxDiagnostic> {
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

    fn parse_arguments(&mut self) -> Result<Vec<Argument>, SyntaxDiagnostic> {
        let mut args = Vec::new();
        while let Some(res) = self.try_single(&|fun| fun.parse_argument())? {
            args.push(res);
        }
        Ok(args)
    }

    fn parse_docs(&mut self) -> Result<Vec<String>, SyntaxDiagnostic> {
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
    ) -> Result<Entry, SyntaxDiagnostic> {
        let start = self.range();

        if self.get().is_lower_id() && self.is_top_level_entry_continuation() {
            let ident = self.parse_id()?;
            return Err(SyntaxDiagnostic::LowerCasedDefinition(
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

        if !self.get().same_variant(&Token::Colon) && !self.get().same_variant(&Token::LBrace) {
            return self.fail(vec![])?;
        }

        let typ = if self.check_and_eat(Token::Colon) {
            self.parse_expr(false)?
        } else {
            Box::new(Expr {
                data: ExprKind::Hole,
                range: start,
            })
        };

        if self.check_actual(Token::LBrace) {
            let start = self.range();

            self.eat_variant(Token::LBrace)?;

            let body = self.parse_expr(true)?;

            let end = self.range();
            self.eat_closing_keyword(Token::RBrace, start)?;

            let mut rules = vec![Box::new(Rule {
                name: ident.clone(),
                pats: args
                    .iter()
                    .map(|x| {
                        Box::new(Pat {
                            range: x.range,
                            data: PatKind::Var(PatIdent(x.name.clone())),
                        })
                    })
                    .collect(),
                body,
                range: end,
            })];
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
                return Err(SyntaxDiagnostic::NotAClauseOfDef(ident.range, self.range()));
            }

            Ok(Entry {
                name: ident,
                docs,
                args: Telescope::new(args),
                typ,
                rules,
                attrs,
                range: start.mix(end),
                generated_by: None,
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
                return Err(SyntaxDiagnostic::NotAClauseOfDef(ident.range, self.range()));
            }

            Ok(Entry {
                name: ident,
                docs,
                args: Telescope::new(args),
                typ,
                rules,
                attrs,
                range: start.mix(end),
                generated_by: None,
            })
        }
    }

    fn parse_top_level(&mut self) -> Result<TopLevel, SyntaxDiagnostic> {
        let docs = self.parse_docs()?;
        let attrs = self.parse_attrs()?;

        if self.check_actual_id("type") {
            Ok(TopLevel::SumType(self.parse_sum_type_def(docs, attrs)?))
        } else if self.check_actual_id("record") {
            Ok(TopLevel::RecordType(self.parse_record_def(docs, attrs)?))
        } else if self.is_top_level_entry_continuation() {
            Ok(TopLevel::Entry(self.parse_entry(docs, attrs)?))
        } else if self.check_actual_id("use") {
            Err(SyntaxDiagnostic::CannotUseUse(self.range()))
        } else {
            self.fail(vec![])
        }
    }

    fn parse_use(&mut self) -> Result<(String, String), SyntaxDiagnostic> {
        self.eat_id("use")?;
        let origin = self.parse_upper_id()?;
        self.eat_id("as")?;
        let alias = self.parse_upper_id()?;

        if origin.get_aux().is_some() {
            Err(SyntaxDiagnostic::ImportsCannotHaveAlias(origin.range))
        } else if alias.get_aux().is_some() {
            Err(SyntaxDiagnostic::ImportsCannotHaveAlias(alias.range))
        } else {
            Ok((origin.to_string(), alias.to_string()))
        }
    }

    pub fn parse_module(&mut self) -> Module {
        let mut entries: Vec<TopLevel> = Vec::new();
        let mut uses: FxHashMap<String, String> = Default::default();

        while self.check_actual_id("use") {
            match self.parse_use() {
                Ok((origin, alias)) => {
                    uses.insert(alias, origin);
                }
                Err(err) => {
                    self.send_dignostic(err);
                    break;
                }
            }
        }

        while !self.get().same_variant(&Token::Eof) {
            match self.parse_top_level() {
                Ok(entry) => entries.push(entry),
                Err(err) => {
                    self.advance();
                    self.send_dignostic(err);
                    while (!self.is_safe_level_start() || !self.is_linebreak())
                        && !self.get().same_variant(&Token::Eof)
                    {
                        self.advance();
                    }
                }
            }
        }

        if let Err(err) = self.eat_variant(Token::Eof) {
            self.send_dignostic(err);
        }

        Module { entries, uses }
    }
}
