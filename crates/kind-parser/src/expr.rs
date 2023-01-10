use kind_span::{Locatable, Range};
use kind_tree::concrete::expr::{*};
use kind_tree::symbol::{Ident, QualifiedIdent};
use kind_tree::Operator;

use crate::diagnostic::SyntaxDiagnostic;
use crate::lexer::tokens::Token;
use crate::macros::eat_single;
use crate::state::Parser;

impl<'a> Parser<'a> {
    // We always look through the parenthesis in the
    // matching with is_operator
    fn is_operator(&self) -> bool {
        matches!(
            self.peek(1),
            Token::Plus
                | Token::Minus
                | Token::Star
                | Token::Slash
                | Token::Percent
                | Token::Ampersand
                | Token::Bar
                | Token::Hat
                | Token::GreaterGreater
                | Token::LessLess
                | Token::Less
                | Token::LessEq
                | Token::EqEq
                | Token::GreaterEq
                | Token::Greater
                | Token::BangEq
        )
    }

    fn eat_operator(&mut self) -> Result<Operator, SyntaxDiagnostic> {
        self.eat(|token| match token {
            Token::Plus => Some(Operator::Add),
            Token::Minus => Some(Operator::Sub),
            Token::Star => Some(Operator::Mul),
            Token::Slash => Some(Operator::Div),
            Token::Percent => Some(Operator::Mod),
            Token::Ampersand => Some(Operator::And),
            Token::Bar => Some(Operator::Or),
            Token::Hat => Some(Operator::Xor),
            Token::GreaterGreater => Some(Operator::Shr),
            Token::LessLess => Some(Operator::Shl),
            Token::Less => Some(Operator::Ltn),
            Token::LessEq => Some(Operator::Lte),
            Token::EqEq => Some(Operator::Eql),
            Token::GreaterEq => Some(Operator::Gte),
            Token::Greater => Some(Operator::Gtn),
            Token::BangEq => Some(Operator::Neq),
            _ => None,
        })
    }

    fn ignore_docs(&mut self) {
        let start = self.range();
        let mut last = self.range();
        let mut unused = false;
        while let Token::Comment(_, _) = &self.get() {
            last = self.range();
            self.advance();
            unused = true;
        }
        if unused {
            self.send_dignostic(SyntaxDiagnostic::UnusedDocString(start.mix(last)))
        }
    }

    fn is_pi_type(&self) -> bool {
        self.get().same_variant(&Token::LPar)
            && self.peek(1).is_lower_id()
            && self.peek(2).same_variant(&Token::Colon)
    }

    fn is_named_parameter(&self) -> bool {
        self.get().same_variant(&Token::LPar)
            && self.peek(1).is_lower_id()
            && self.peek(2).same_variant(&Token::Eq)
    }

    fn is_lambda(&self) -> bool {
        self.get().is_lower_id() && self.peek(1).same_variant(&Token::FatArrow)
    }

    fn is_sigma_type(&self) -> bool {
        self.get().same_variant(&Token::LBracket)
            && self.peek(1).is_lower_id()
            && self.peek(2).same_variant(&Token::Colon)
    }

    fn parse_substitution(&mut self) -> Result<Box<Expr>, SyntaxDiagnostic> {
        let start = self.range();
        self.advance(); // 'specialize'
        let name = self.parse_id()?;
        self.eat_id("into")?;
        self.eat_variant(Token::Hash)?;
        let redx = self.parse_num_lit()?;
        self.eat_id("in")?;
        let expr = self.parse_expr(false)?;
        let range = start.mix(expr.range);
        Ok(Box::new(Expr {
            data: ExprKind::Subst(Substitution {
                name,
                redx,
                indx: 0,
                expr,
            }),
            range,
        }))
    }

    pub fn parse_id(&mut self) -> Result<Ident, SyntaxDiagnostic> {
        let range = self.range();
        let id = eat_single!(self, Token::LowerId(x) => x.clone())?;
        let ident = Ident::new_static(&id, range);
        Ok(ident)
    }

    pub fn parse_any_id(&mut self) -> Result<Ident, SyntaxDiagnostic> {
        let range = self.range();

        let id = self.eat(|x| match x {
            Token::LowerId(x) | Token::UpperId(x, None) => Some(x.clone()),
            Token::Num60(name) => Some(name.to_string()),
            _ => None,
        })?;

        let ident = Ident::new_static(&id, range);
        Ok(ident)
    }

    pub fn parse_upper_id(&mut self) -> Result<QualifiedIdent, SyntaxDiagnostic> {
        let range = self.range();
        let (start, end) =
            eat_single!(self, Token::UpperId(start, end) => (start.clone(), end.clone()))?;
        let ident = QualifiedIdent::new_static(start.as_str(), end, range);
        Ok(ident)
    }

    fn parse_lambda(&mut self, erased: bool) -> Result<Box<Expr>, SyntaxDiagnostic> {
        let name_span = self.range();

        let param = self.parse_id()?;
        self.advance(); // '=>'

        let body = self.parse_expr(false)?;
        let end_range = body.range;

        Ok(Box::new(Expr {
            data: ExprKind::Lambda {
                param,
                typ: None,
                body,
                erased,
            },
            range: name_span.mix(end_range),
        }))
    }

    fn parse_pi_or_lambda(&mut self, erased: bool) -> Result<Box<Expr>, SyntaxDiagnostic> {
        let range = self.range();
        self.advance(); // '('
        let param = self.parse_id()?;
        self.advance(); // ':'
        let typ = self.parse_expr(false)?;

        let par_range = self.range();
        self.eat_closing_keyword(Token::RPar, range)?;

        if self.check_and_eat(Token::FatArrow) {
            let body = self.parse_expr(false)?;
            Ok(Box::new(Expr {
                range: range.mix(body.range),
                data: ExprKind::Lambda {
                    param,
                    typ: Some(typ),
                    body,
                    erased,
                },
            }))
        } else if self.check_and_eat(Token::RightArrow) {
            let body = self.parse_expr(false)?;
            Ok(Box::new(Expr {
                range: range.mix(body.range),
                data: ExprKind::All {
                    param: Some(param),
                    typ,
                    body,
                    erased,
                },
            }))
        } else {
            Ok(Box::new(Expr {
                range: range.mix(typ.range),
                data: ExprKind::Ann {
                    val: Box::new(Expr {
                        range: range.mix(par_range),
                        data: ExprKind::Var { name: param },
                    }),
                    typ,
                },
            }))
        }
    }

    fn parse_sigma_type(&mut self) -> Result<Box<Expr>, SyntaxDiagnostic> {
        let range = self.range();
        self.advance(); // '['
        let ident = self.parse_id()?;
        self.advance(); // ':'
        let fst = self.parse_expr(false)?;

        self.eat_closing_keyword(Token::RBracket, range)?;

        self.eat_variant(Token::RightArrow)?;

        let snd = self.parse_expr(false)?;

        Ok(Box::new(Expr {
            range: range.mix(snd.locate()),
            data: ExprKind::Sigma {
                param: Some(ident),
                fst,
                snd,
            },
        }))
    }

    fn parse_var(&mut self) -> Result<Box<Expr>, SyntaxDiagnostic> {
        let name = self.parse_id()?;
        Ok(Box::new(Expr {
            range: name.range,
            data: ExprKind::Var { name },
        }))
    }

    fn parse_single_upper(&mut self) -> Result<Box<Expr>, SyntaxDiagnostic> {
        let id = self.parse_upper_id()?;
        let data = match id.to_string().as_str() {
            "Type" => ExprKind::Lit { lit: Literal::Type },
            "U60" => ExprKind::Lit {
                lit: Literal::NumTypeU60,
            },
            "F60" => ExprKind::Lit {
                lit: Literal::NumTypeF60,
            },
            _ => ExprKind::Constr {
                name: id.clone(),
                args: vec![],
            },
        };
        Ok(Box::new(Expr {
            range: id.range,
            data,
        }))
    }

    fn parse_data(&mut self, multiline: bool) -> Result<Box<Expr>, SyntaxDiagnostic> {
        let id = self.parse_upper_id()?;
        let mut range = id.range;
        let data = match id.to_string().as_str() {
            "Type" => ExprKind::Lit { lit: Literal::Type },
            "U60" => ExprKind::Lit {
                lit: Literal::NumTypeU60,
            },
            "F60" => ExprKind::Lit {
                lit: Literal::NumTypeF60,
            },
            _ => {
                let (range_end, spine) = self.parse_call_tail(id.range, multiline)?;
                range = range.mix(range_end);
                ExprKind::Constr {
                    name: id,
                    args: spine,
                }
            }
        };
        Ok(Box::new(Expr { range, data }))
    }

    fn parse_num60(&mut self, num: u64) -> Result<Box<Expr>, SyntaxDiagnostic> {
        let range = self.range();
        self.advance();
        Ok(Box::new(Expr {
            range,
            data: ExprKind::Lit {
                lit: Literal::NumU60(num),
            },
        }))
    }

    fn parse_nat(&mut self, num: u128) -> Result<Box<Expr>, SyntaxDiagnostic> {
        let range = self.range();
        self.advance();
        Ok(Box::new(Expr {
            range,
            data: ExprKind::Lit {
                lit: Literal::Nat(num),
            },
        }))
    }

    fn parse_num120(&mut self, num: u128) -> Result<Box<Expr>, SyntaxDiagnostic> {
        let range = self.range();
        self.advance();
        Ok(Box::new(Expr {
            range,
            data: ExprKind::Lit {
                lit: Literal::NumU120(num),
            },
        }))
    }

    fn parse_char(&mut self, chr: char) -> Result<Box<Expr>, SyntaxDiagnostic> {
        let range = self.range();
        self.advance();
        Ok(Box::new(Expr {
            range,
            data: ExprKind::Lit {
                lit: Literal::Char(chr),
            },
        }))
    }

    fn parse_binary_op(&mut self) -> Result<Box<Expr>, SyntaxDiagnostic> {
        let range = self.range();
        self.advance(); // '('
        let op = self.eat_operator()?;
        let fst = self.parse_atom()?;
        let snd = self.parse_atom()?;
        let end = self.range();

        self.eat_closing_keyword(Token::RPar, range)?;

        Ok(Box::new(Expr {
            range: range.mix(end),
            data: ExprKind::Binary { op, fst, snd },
        }))
    }

    fn parse_list(&mut self) -> Result<Box<Expr>, SyntaxDiagnostic> {
        let range = self.range();
        self.advance(); // '['
        let mut args = Vec::new();

        if self.check_actual(Token::RBracket) {
            let range = self.advance().1.mix(range);
            return Ok(Box::new(Expr {
                range,
                data: ExprKind::List { args },
            }));
        }

        args.push(*self.parse_atom()?);
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
                match self.try_single(&|x| x.parse_expr(false))? {
                    Some(res) => args.push(*res),
                    None => break,
                }
            } else {
                // TODO: Error when someone tries to use a comma after not using it.
                match self.try_single(&|x| x.parse_atom())? {
                    Some(res) => args.push(*res),
                    None => break,
                }
            }
        }

        let end = self.eat_variant(Token::RBracket)?.1;
        let range = range.mix(end);

        Ok(Box::new(Expr {
            range,
            data: ExprKind::List { args },
        }))
    }

    fn parse_paren(&mut self) -> Result<Box<Expr>, SyntaxDiagnostic> {
        if self.is_operator() {
            self.parse_binary_op()
        } else {
            let range = self.range();
            self.advance(); // '('
            let mut expr = self.parse_expr(true)?;
            let end = self.range();
            self.eat_closing_keyword(Token::RPar, range)?;
            expr.range = range.mix(end);
            Ok(expr)
        }
    }

    fn parse_help(&mut self, str: String) -> Result<Box<Expr>, SyntaxDiagnostic> {
        let range = self.range();
        self.advance();
        Ok(Box::new(Expr {
            range,
            data: ExprKind::Lit {
                lit: Literal::Help(Ident::new(str, range)),
            },
        }))
    }

    fn parse_str(&mut self, str: String) -> Result<Box<Expr>, SyntaxDiagnostic> {
        let range = self.range();
        self.advance();
        Ok(Box::new(Expr {
            range,
            data: ExprKind::Lit {
                lit: Literal::String(str),
            },
        }))
    }

    fn parse_num_lit(&mut self) -> Result<usize, SyntaxDiagnostic> {
        self.ignore_docs();
        match self.get().clone() {
            Token::Num60(num) => {
                self.advance();
                Ok(num as usize)
            }
            _ => self.fail(vec![]),
        }
    }

    fn parse_atom(&mut self) -> Result<Box<Expr>, SyntaxDiagnostic> {
        self.ignore_docs();
        match self.get().clone() {
            Token::UpperId(_, _) => self.parse_single_upper(),
            Token::LowerId(_) => self.parse_var(),
            Token::Num60(num) => self.parse_num60(num),
            Token::Nat(num) => self.parse_nat(num),
            Token::Num120(num) => self.parse_num120(num),
            Token::Char(chr) => self.parse_char(chr),
            Token::Str(str) => self.parse_str(str),
            Token::Help(str) => self.parse_help(str),
            Token::LBracket => self.parse_list(),
            Token::LPar => self.parse_paren(),
            Token::Hole => self.parse_hole(),
            Token::Float(_, _) => todo!(),
            _ => self.fail(vec![Token::LowerId("".to_string())]),
        }
    }

    fn parse_binding(&mut self) -> Result<Binding, SyntaxDiagnostic> {
        self.ignore_docs();
        if self.is_named_parameter() {
            let start = self.range();
            self.advance(); // '('
            let name = self.parse_id()?;
            self.advance(); // '='
            let expr = self.parse_expr(true)?;
            let end = self.range();
            self.eat_closing_keyword(Token::RPar, start)?;
            Ok(Binding::Named(start.mix(end), name, expr))
        } else {
            Ok(Binding::Positional(self.parse_atom()?))
        }
    }
    
    fn parse_typed_ident(&mut self) -> Result<(Ident, Option<Box<Expr>>), SyntaxDiagnostic> {
        let start = self.range();
        if self.check_and_eat(Token::LPar) {
            let name = self.parse_id()?;
            self.eat_variant(Token::Colon)?;
            let atom = self.parse_expr(true)?;
            self.eat_closing_keyword(Token::RPar, start)?;
            Ok((name, Some(atom)))
        } else {
            let name = self.parse_id()?;
            Ok((name, None))
        }
    }

    fn parse_app_binding(&mut self) -> Result<AppBinding, SyntaxDiagnostic> {
        self.ignore_docs();
        let (erased, data) = if self.check_and_eat(Token::Tilde) {
            let start = self.range();
            self.eat_variant(Token::LPar)?;
            let atom = self.parse_expr(true)?;
            self.eat_closing_keyword(Token::RPar, start)?;
            (true, atom)
        } else {
            (false, self.parse_atom()?)
        };
        Ok(AppBinding { data, erased })
    }

    fn parse_call(&mut self, multiline: bool) -> Result<Box<Expr>, SyntaxDiagnostic> {
        if self.get().is_upper_id() {
            self.parse_data(multiline)
        } else {
            let fun = self.parse_atom()?;
            let start = fun.range;

            let mut args = Vec::new();
            let mut end = start;

            while (!self.is_linebreak() || multiline) && !self.get().same_variant(&Token::Eof) {
                if let Some(atom) = self.try_single(&|parser| parser.parse_app_binding())? {
                    end = atom.data.range;
                    args.push(atom)
                } else {
                    break;
                }
            }

            if args.is_empty() {
                Ok(fun)
            } else {
                Ok(Box::new(Expr {
                    data: ExprKind::App { fun, args },
                    range: start.mix(end),
                }))
            }
        }
    }

    fn parse_call_tail(
        &mut self,
        start: Range,
        multiline: bool,
    ) -> Result<(Range, Vec<Binding>), SyntaxDiagnostic> {
        let mut spine = Vec::new();
        let mut end = start;
        while (!self.is_linebreak() || multiline) && !self.get().same_variant(&Token::Eof) {
            if let Some(atom) = self.try_single(&|parser| parser.parse_binding())? {
                end = atom.locate();
                spine.push(atom)
            } else {
                break;
            }
        }
        Ok((end, spine))
    }

    fn parse_arrow(&mut self, multiline: bool) -> Result<Box<Expr>, SyntaxDiagnostic> {
        let mut expr = self.parse_call(multiline)?;

        while self.check_and_eat(Token::RightArrow) {
            let body = self.parse_expr(false)?;
            let range = expr.range.mix(body.range);
            expr = Box::new(Expr {
                data: ExprKind::All {
                    param: None,
                    typ: expr,
                    body,
                    erased: false,
                },
                range,
            });
        }

        Ok(expr)
    }

    fn parse_ann(&mut self, multiline: bool) -> Result<Box<Expr>, SyntaxDiagnostic> {
        let expr = self.parse_arrow(multiline)?;

        if self.check_and_eat(Token::ColonColon) {
            let typ = self.parse_arrow(multiline)?;
            let range = expr.range.mix(typ.range);
            Ok(Box::new(Expr {
                data: ExprKind::Ann { val: expr, typ },
                range,
            }))
        } else {
            Ok(expr)
        }
    }

    fn parse_ask(&mut self) -> Result<Box<Sttm>, SyntaxDiagnostic> {
        let start = self.range();
        self.advance(); // 'ask'
        let name = self.parse_destruct()?;
        self.eat_variant(Token::Eq)?;
        let expr = self.parse_expr(false)?;
        self.check_and_eat(Token::Semi);
        let next = self.parse_sttm()?;
        let end = expr.range;
        Ok(Box::new(Sttm {
            data: SttmKind::Ask(name, expr, next),
            range: start.mix(end),
        }))
    }

    fn parse_destruct(&mut self) -> Result<Destruct, SyntaxDiagnostic> {
        if self.get().is_upper_id() {
            let upper = self.parse_upper_id()?;
            let (range, bindings, ignore_rest) = self.parse_pat_destruct_bindings()?;
            Ok(Destruct::Destruct(
                upper.range.mix(range.unwrap_or(upper.range)),
                upper,
                bindings,
                ignore_rest,
            ))
        } else {
            let name = self.parse_id()?;
            Ok(Destruct::Ident(name))
        }
    }

    fn parse_open(&mut self) -> Result<Box<Expr>, SyntaxDiagnostic> {

        let start = self.range();
        self.advance(); // 'open'
        let type_name = self.parse_upper_id()?;
        let var_name = self.parse_id()?;
        let next = self.parse_expr(false)?;
        let end = next.range;

        let motive = self.try_single(&|this| {
            this.eat_variant(Token::Colon)?;
            this.parse_expr(false)
        })?;

        Ok(Box::new(Expr {
            data: ExprKind::Open { type_name, var_name, motive, next },
            range: start.mix(end),
        }))
    }

    fn parse_monadic_let(&mut self) -> Result<Box<Sttm>, SyntaxDiagnostic> {
        let start = self.range();
        self.advance(); // 'let'
        let destruct = self.parse_destruct()?;
        self.eat_variant(Token::Eq)?;
        let val = self.parse_expr(false)?;
        self.check_and_eat(Token::Semi);
        let next = self.parse_sttm()?;
        let end = destruct.locate();
        Ok(Box::new(Sttm {
            data: SttmKind::Let(destruct, val, next),
            range: start.mix(end),
        }))
    }

    fn parse_return(&mut self) -> Result<Box<Sttm>, SyntaxDiagnostic> {
        let start = self.range();
        self.advance(); // 'return'
        let expr = self.parse_expr(false)?;
        let end = expr.range;
        self.check_and_eat(Token::Semi);
        Ok(Box::new(Sttm {
            data: SttmKind::Return(expr),
            range: start.mix(end),
        }))
    }

    fn parse_sttm(&mut self) -> Result<Box<Sttm>, SyntaxDiagnostic> {
        let start = self.range();
        if self.check_actual(Token::Ask) {
            self.parse_ask()
        } else if self.check_actual(Token::Return) {
            self.parse_return()
        } else if self.check_actual_id("let") {
            self.parse_monadic_let()
        } else {
            let expr = self.parse_expr(false)?;
            if self.get().same_variant(&Token::RBrace) {
                let end = expr.range;
                Ok(Box::new(Sttm {
                    data: SttmKind::RetExpr(expr),
                    range: start.mix(end),
                }))
            } else {
                self.check_and_eat(Token::Semi);
                let next = self.parse_sttm()?;
                let end = next.range;
                Ok(Box::new(Sttm {
                    data: SttmKind::Expr(expr, next),
                    range: start.mix(end),
                }))
            }
        }
    }

    fn parse_do(&mut self) -> Result<Box<Expr>, SyntaxDiagnostic> {
        let start = self.range();
        self.advance(); // 'do'
        let typ = self.parse_upper_id()?;
        self.eat_variant(Token::LBrace)?;
        let sttm = self.parse_sttm()?;
        let end = self.eat_variant(Token::RBrace)?.1;
        Ok(Box::new(Expr {
            data: ExprKind::Do { typ, sttm },
            range: start.mix(end),
        }))
    }

    fn parse_pat_destruct_bindings(
        &mut self,
    ) -> Result<(Option<Range>, Vec<CaseBinding>, Option<Range>), SyntaxDiagnostic> {
        let mut ignore_rest_range = None;
        let mut bindings = Vec::new();
        let mut range = None;
        loop {
            match self.get() {
                Token::LowerId(_) => {
                    range = Some(self.range());
                    let name = self.parse_id()?;
                    bindings.push(CaseBinding::Field(name));
                }
                Token::LPar => {
                    let start = self.range();
                    self.advance();
                    let name = self.parse_id()?;
                    self.eat_variant(Token::Eq)?;
                    let renamed = self.parse_id()?;
                    range = Some(self.range());
                    self.eat_closing_keyword(Token::RPar, start)?;
                    bindings.push(CaseBinding::Renamed(name, renamed));
                }
                Token::DotDot => {
                    ignore_rest_range = Some(self.range());
                    range = Some(self.range());
                    self.advance();
                    continue;
                }
                _ => break,
            }
            if let Some(range) = ignore_rest_range {
                return Err(SyntaxDiagnostic::IgnoreRestShouldBeOnTheEnd(range));
            }
        }
        Ok((range, bindings, ignore_rest_range))
    }

    fn parse_match(&mut self) -> Result<Box<Expr>, SyntaxDiagnostic> {
        let start = self.range();
        self.advance(); // 'match'

        let typ = self.parse_upper_id()?;

        let expr_scrutinee = self.parse_expr(false)?;

        let scrutinee = match expr_scrutinee.data {
            ExprKind::Var { name } => {
                name
            },
            _ => return Err(SyntaxDiagnostic::MatchScrutineeShouldBeAName(expr_scrutinee.range))
        };

        let value = if self.check_and_eat(Token::Eq) {
            Some(self.parse_expr(false)?)
        } else {
            None
        };

        let mut with_vars = Vec::new();

        if self.check_and_eat(Token::With) {
            while let Some(name) = self.try_single(&|x| x.parse_typed_ident())? {
                with_vars.push(name)
            }
        };

        self.eat_variant(Token::LBrace)?;

        let mut cases = Vec::new();

        while !self.get().same_variant(&Token::RBrace) {
            let constructor = self.parse_any_id()?;
            let (_range, bindings, ignore_rest) = self.parse_pat_destruct_bindings()?;
            self.eat_variant(Token::FatArrow)?;
            let value = self.parse_expr(false)?;
            self.check_and_eat(Token::Semi);

            cases.push(Case {
                constructor,
                bindings,
                value,
                ignore_rest,
            })
        }

        let mut end = self.eat_variant(Token::RBrace)?.1;

        let motive = if self.check_and_eat(Token::Colon) {
            let expr = self.parse_expr(false)?;
            end = expr.range;
            Some(expr)
        } else {
            None
        };

        let match_ = Box::new(Match {
            typ,
            scrutinee,
            with_vars,
            value,
            cases,
            motive,
        });

        Ok(Box::new(Expr {
            data: ExprKind::Match(match_),
            range: start.mix(end),
        }))
    }

    fn parse_let(&mut self) -> Result<Box<Expr>, SyntaxDiagnostic> {
        let start = self.range();
        self.advance(); // 'let'
        let name = self.parse_destruct()?;
        self.eat_variant(Token::Eq)?;
        let val = self.parse_expr(false)?;
        self.check_and_eat(Token::Semi);
        let next = self.parse_expr(false)?;
        let end = next.range;
        Ok(Box::new(Expr {
            data: ExprKind::Let { name, val, next },
            range: start.mix(end),
        }))
    }

    fn parse_sigma_pair(&mut self) -> Result<Box<Expr>, SyntaxDiagnostic> {
        let start = self.range();
        self.advance(); // '$'
        let fst = self.parse_atom()?;
        let snd = self.parse_atom()?;
        let end = snd.range;
        Ok(Box::new(Expr {
            data: ExprKind::Pair { fst, snd },
            range: start.mix(end),
        }))
    }

    fn parse_hole(&mut self) -> Result<Box<Expr>, SyntaxDiagnostic> {
        let start = self.range();
        self.advance(); // '_'
        Ok(Box::new(Expr {
            data: ExprKind::Hole,
            range: start,
        }))
    }

    fn parse_if(&mut self) -> Result<Box<Expr>, SyntaxDiagnostic> {
        let start = self.range();
        self.advance(); // 'if'
        let cond = self.parse_expr(false)?;
        self.eat_variant(Token::LBrace)?;
        let then_ = self.parse_expr(false)?;
        self.eat_variant(Token::RBrace)?;
        self.eat_id("else")?;
        self.eat_variant(Token::LBrace)?;
        let else_ = self.parse_expr(false)?;
        let end = self.eat_variant(Token::RBrace)?.1;
        let range = start.mix(end);
        Ok(Box::new(Expr {
            data: ExprKind::If { cond, then_, else_ },
            range,
        }))
    }

    fn parse_erased(&mut self) -> Result<Box<Expr>, SyntaxDiagnostic> {
        self.advance(); // '~';
        if self.is_lambda() {
            self.parse_lambda(true)
        } else if self.is_pi_type() {
            self.parse_pi_or_lambda(true)
        } else {
            self.fail(vec![])
        }
    }

    /// The infinite hell of else ifs. But it's the most readable way
    /// to check if the queue of tokens match a pattern as we need
    /// some looakhead tokens.
    pub fn parse_expr(&mut self, multiline: bool) -> Result<Box<Expr>, SyntaxDiagnostic> {
        self.ignore_docs();
        if self.check_actual_id("do") {
            self.parse_do()
        } else if self.check_actual_id("match") {
            self.parse_match()
        } else if self.check_actual_id("let") {
            self.parse_let()
        } else if self.check_actual_id("if") {
            self.parse_if()
        } else if self.check_actual_id("open") {
            self.parse_open()
        } else if self.check_actual_id("specialize") {
            self.parse_substitution()
        } else if self.check_actual(Token::Dollar) {
            self.parse_sigma_pair()
        } else if self.is_lambda() {
            self.parse_lambda(false)
        } else if self.is_pi_type() {
            self.parse_pi_or_lambda(false)
        } else if self.is_sigma_type() {
            self.parse_sigma_type()
        } else if self.check_actual(Token::Tilde) {
            self.parse_erased()
        } else {
            self.parse_ann(multiline)
        }
    }
}
