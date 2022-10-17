use kind_span::Locatable;
use kind_tree::concrete::expr::*;
use kind_tree::concrete::pat::PatIdent;
use kind_tree::symbol::{Ident, Symbol};

use crate::errors::SyntaxError;
use crate::lexer::tokens::Token;
use crate::macros::eat_single;
use crate::state::Parser;

impl<'a> Parser<'a> {
    // We always look through the parenthesis in the
    // matching with is_operator
    pub fn is_operator(&self) -> bool {
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

    pub fn eat_operator(&mut self) -> Result<Operator, SyntaxError> {
        self.eat(|token| match token {
            Token::Plus => Some(Operator::Add),
            Token::Minus => Some(Operator::Sub),
            Token::Star => Some(Operator::Mul),
            Token::Slash => Some(Operator::Div),
            Token::Percent => Some(Operator::Mod),
            Token::Ampersand => Some(Operator::Add),
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

    pub fn ignore_docs(&mut self) {
        let start = self.range();
        let mut last = self.range();
        let mut unused = false;
        while let Token::Comment(_, _) = &self.get() {
            last = self.range();
            self.advance();
            unused = true;
        }
        if unused {
            self.errs
                .send(SyntaxError::UnusedDocString(start.mix(last)).into())
                .unwrap()
        }
    }

    pub fn is_pi_type(&self) -> bool {
        self.get().same_variant(&Token::LPar)
            && self.peek(1).is_lower_id()
            && self.peek(2).same_variant(&Token::Colon)
    }

    pub fn is_named(&self) -> bool {
        self.get().same_variant(&Token::LPar)
            && self.peek(1).is_lower_id()
            && self.peek(2).same_variant(&Token::Eq)
    }

    pub fn is_lambda(&self) -> bool {
        self.get().is_lower_id() && self.peek(1).same_variant(&Token::FatArrow)
    }

    pub fn is_sigma_type(&self) -> bool {
        self.get().same_variant(&Token::LBracket)
            && self.peek(1).is_lower_id()
            && self.peek(2).same_variant(&Token::Colon)
    }

    pub fn is_substitution(&self) -> bool {
        self.get().same_variant(&Token::HashHash)
    }

    pub fn parse_substitution(&mut self) -> Result<Box<Expr>, SyntaxError> {
        let start = self.range();
        self.advance(); // '##'
        let name = self.parse_id()?;
        self.eat_variant(Token::Slash)?;
        let redx = self.parse_num_lit()?;
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

    pub fn parse_id(&mut self) -> Result<Ident, SyntaxError> {
        let range = self.range();
        let id = eat_single!(self, Token::LowerId(x) => x.clone())?;
        let ident = Ident::new(Symbol(id), self.lexer.ctx, range);
        Ok(ident)
    }

    pub fn parse_upper_id(&mut self) -> Result<Ident, SyntaxError> {
        let range = self.range();
        let id = eat_single!(self, Token::UpperId(x) => x.clone())?;
        let ident = Ident::new(Symbol(id), self.lexer.ctx, range);
        Ok(ident)
    }

    fn parse_lambda(&mut self) -> Result<Box<Expr>, SyntaxError> {
        let name_span = self.range();

        let ident = self.parse_id()?;
        self.advance(); // '=>'

        let expr = self.parse_expr(false)?;
        let end_range = expr.range;

        Ok(Box::new(Expr {
            data: ExprKind::Lambda(ident, None, expr),
            range: name_span.mix(end_range),
        }))
    }

    fn parse_pi_or_lambda(&mut self) -> Result<Box<Expr>, SyntaxError> {
        let range = self.range();
        self.advance(); // '('
        let ident = self.parse_id()?;
        self.advance(); // ':'
        let typ = self.parse_expr(false)?;

        self.eat_closing_keyword(Token::RPar, range)?;

        if self.check_and_eat(Token::FatArrow) {
            let body = self.parse_expr(false)?;
            Ok(Box::new(Expr {
                range: range.mix(body.range),
                data: ExprKind::Lambda(ident, Some(typ), body),
            }))
        } else {
            self.check_and_eat(Token::RightArrow);
            let body = self.parse_expr(false)?;
            Ok(Box::new(Expr {
                range: range.mix(body.range),
                data: ExprKind::All(Some(ident), typ, body),
            }))
        }
    }

    fn parse_sigma_type(&mut self) -> Result<Box<Expr>, SyntaxError> {
        let range = self.range();
        self.advance(); // '['
        let ident = self.parse_id()?;
        self.advance(); // ':'
        let typ = self.parse_expr(false)?;

        self.eat_closing_keyword(Token::RPar, range)?;

        let end = self.eat_variant(Token::RightArrow)?.1;

        let body = self.parse_expr(false)?;

        Ok(Box::new(Expr {
            range: range.mix(end),
            data: ExprKind::Sigma(Some(ident), typ, body),
        }))
    }

    fn parse_var(&mut self) -> Result<Box<Expr>, SyntaxError> {
        let id = self.parse_id()?;
        Ok(Box::new(Expr {
            range: id.range,
            data: ExprKind::Var(id),
        }))
    }

    fn parse_data(&mut self) -> Result<Box<Expr>, SyntaxError> {
        let id = self.parse_upper_id()?;
        let data = match id.data.0.as_str() {
            "Type" => ExprKind::Lit(Literal::Type),
            "U60" => ExprKind::Lit(Literal::U60),
            _ => ExprKind::Constr(id.clone()),
        };
        Ok(Box::new(Expr {
            range: id.range,
            data,
        }))
    }

    fn parse_num(&mut self, num: u64) -> Result<Box<Expr>, SyntaxError> {
        let range = self.range();
        self.advance();
        Ok(Box::new(Expr {
            range,
            data: ExprKind::Lit(Literal::Number(num)),
        }))
    }

    fn parse_char(&mut self, chr: char) -> Result<Box<Expr>, SyntaxError> {
        let range = self.range();
        self.advance();
        Ok(Box::new(Expr {
            range,
            data: ExprKind::Lit(Literal::Char(chr)),
        }))
    }

    fn parse_num_lit(&mut self) -> Result<u64, SyntaxError> {
        eat_single!(self, Token::Num(x) => *x)
    }

    fn parse_binary_op(&mut self) -> Result<Box<Expr>, SyntaxError> {
        let range = self.range();
        self.advance(); // '('
        let op = self.eat_operator()?;
        let fst = self.parse_atom()?;
        let snd = self.parse_atom()?;
        let end = self.range();

        self.eat_closing_keyword(Token::RPar, range)?;

        Ok(Box::new(Expr {
            range: range.mix(end),
            data: ExprKind::Binary(op, fst, snd),
        }))
    }

    fn parse_array(&mut self) -> Result<Box<Expr>, SyntaxError> {
        let range = self.range();
        self.advance(); // '['
        let mut vec = Vec::new();

        if self.check_actual(Token::RBracket) {
            let range = self.advance().1.mix(range);
            return Ok(Box::new(Expr {
                range,
                data: ExprKind::List(vec),
            }));
        }

        vec.push(*self.parse_expr(false)?);
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
                    Some(res) => vec.push(*res),
                    None => break,
                }
            } else {
                // TODO: Error when someone tries to use a comma after not using it.
                match self.try_single(&|x| x.parse_atom())? {
                    Some(res) => vec.push(*res),
                    None => break,
                }
            }
        }

        let range = self.eat_variant(Token::RBracket)?.1.mix(range);

        Ok(Box::new(Expr {
            range,
            data: ExprKind::List(vec),
        }))
    }

    fn parse_paren(&mut self) -> Result<Box<Expr>, SyntaxError> {
        if self.is_operator() {
            self.parse_binary_op()
        } else {
            let range = self.range();
            self.advance(); // '('
            let mut expr = self.parse_expr(true)?;
            if self.get().same_variant(&Token::ColonColon) {
                self.advance(); // '::'
                let typ = self.parse_expr(false)?;
                let range = range.mix(self.range());

                self.eat_closing_keyword(Token::RPar, range)?;

                Ok(Box::new(Expr {
                    data: ExprKind::Ann(expr, typ),
                    range,
                }))
            } else {
                let end = self.range();
                self.eat_closing_keyword(Token::RPar, range)?;
                expr.range = range.mix(end);
                Ok(expr)
            }
        }
    }

    pub fn parse_help(&mut self, str: String) -> Result<Box<Expr>, SyntaxError> {
        let range = self.range();
        self.advance();
        Ok(Box::new(Expr {
            range,
            data: ExprKind::Help(Ident {
                data: Symbol(str),
                ctx: self.lexer.ctx,
                range,
            }),
        }))
    }

    pub fn parse_str(&mut self, str: String) -> Result<Box<Expr>, SyntaxError> {
        let range = self.range();
        self.advance();
        Ok(Box::new(Expr {
            range,
            data: ExprKind::Lit(Literal::String(str)),
        }))
    }

    pub fn parse_atom(&mut self) -> Result<Box<Expr>, SyntaxError> {
        self.ignore_docs();
        match self.get().clone() {
            Token::LowerId(_) => self.parse_var(),
            Token::UpperId(_) => self.parse_data(),
            Token::Num(num) => self.parse_num(num),
            Token::Char(chr) => self.parse_char(chr),
            Token::Str(str) => self.parse_str(str),
            Token::Float(_, _) => todo!(),
            Token::Help(str) => self.parse_help(str),
            Token::LBracket => self.parse_array(),
            Token::LPar => self.parse_paren(),
            _ => self.fail(vec![Token::LowerId("".to_string())]),
        }
    }

    fn parse_binding(&mut self) -> Result<Binding, SyntaxError> {
        self.ignore_docs();
        if self.is_named() {
            let start = self.range();
            self.advance(); // '('
            let name = self.parse_id()?;
            self.advance(); // '='
            let expr = self.parse_expr(true)?;
            let end = self.range();
            self.eat_closing_keyword(Token::RPar, start)?;
            Ok(Binding::Named(end.mix(start), name, expr))
        } else {
            Ok(Binding::Positional(self.parse_atom()?))
        }
    }

    fn parse_call(&mut self, multiline: bool) -> Result<Box<Expr>, SyntaxError> {
        let head = self.parse_atom()?;
        let start = head.range;
        let mut spine = Vec::new();
        let mut end = head.range;
        while (!self.is_linebreak() || multiline) && !self.get().same_variant(&Token::Eof) {
            let res = self.try_single(&|parser| parser.parse_binding())?;
            match res {
                Some(atom) => {
                    end = atom.locate();
                    spine.push(atom)
                }
                None => break,
            }
        }
        if spine.is_empty() {
            Ok(head)
        } else {
            Ok(Box::new(Expr {
                data: ExprKind::App(head, spine),
                range: start.mix(end),
            }))
        }
    }

    fn parse_arrow(&mut self, multiline: bool) -> Result<Box<Expr>, SyntaxError> {
        let mut head = self.parse_call(multiline)?;
        while self.check_and_eat(Token::RightArrow) {
            let next = self.parse_expr(false)?;
            let range = head.range.mix(next.range);
            head = Box::new(Expr {
                data: ExprKind::All(None, head, next),
                range,
            });
        }
        if self.check_and_eat(Token::ColonColon) {
            let expr = self.parse_expr(false)?;
            Ok(Box::new(Expr {
                range: head.range.mix(expr.range),
                data: ExprKind::Ann(head, expr),
            }))
        } else {
            Ok(head)
        }
    }

    pub fn parse_ask(&mut self) -> Result<Box<Sttm>, SyntaxError> {
        let start = self.range();
        self.advance(); // 'ask'
                     // Parses the name for Ask that is optional
        let name = if self.peek(1).same_variant(&Token::Eq) {
            let name = self.parse_id()?;
            self.advance(); // '='
            Some(name)
        } else {
            None
        };

        let expr = self.parse_expr(false)?;
        self.check_and_eat(Token::Semi);
        let next = self.parse_sttm()?;
        let end = expr.range;
        Ok(Box::new(Sttm {
            data: SttmKind::Ask(name, expr, next),
            range: start.mix(end),
        }))
    }

    pub fn parse_destruct(&mut self) -> Result<Destruct, SyntaxError> {
        if self.get().is_upper_id() {
            let upper = self.parse_upper_id()?;
            let (bindings, ignore_rest) = self.parse_pat_destruct_bindings()?;
            Ok(Destruct::Destruct(upper, bindings, ignore_rest))
        } else {
            let name = self.parse_id()?;
            Ok(Destruct::Ident(name))
        }
    }

    pub fn parse_monadic_let(&mut self) -> Result<Box<Sttm>, SyntaxError> {
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

    pub fn parse_return(&mut self) -> Result<Box<Sttm>, SyntaxError> {
        let start = self.range();
        self.advance(); // 'return'
        let expr = self.parse_expr(false)?;
        let end = expr.range;
        Ok(Box::new(Sttm {
            data: SttmKind::Return(expr),
            range: start.mix(end),
        }))
    }

    pub fn parse_sttm(&mut self) -> Result<Box<Sttm>, SyntaxError> {
        let start = self.range();
        if self.check_actual(Token::Ask) {
            self.parse_ask()
        } else if self.check_actual(Token::Return) {
            self.parse_return()
        } else if self.check_actual(Token::Let) {
            self.parse_monadic_let()
        } else {
            let expr = self.parse_expr(false)?;
            if self.get().same_variant(&Token::RBrace) {
                let end = expr.range;
                Ok(Box::new(Sttm {
                    data: SttmKind::Return(expr),
                    range: start.mix(end),
                }))
            } else {
                let next = self.parse_sttm()?;
                let end = next.range;
                Ok(Box::new(Sttm {
                    data: SttmKind::Expr(expr, next),
                    range: start.mix(end),
                }))
            }
        }
    }

    pub fn parse_do(&mut self) -> Result<Box<Expr>, SyntaxError> {
        let start = self.range();
        self.advance(); // 'do'
        let typ = self.parse_id()?;
        self.eat_variant(Token::LBrace)?;
        let sttm = self.parse_sttm()?;
        let end = self.eat_variant(Token::RBrace)?.1;
        Ok(Box::new(Expr {
            data: ExprKind::Do(typ, sttm),
            range: start.mix(end),
        }))
    }

    pub fn parse_pat_destruct_bindings(&mut self) -> Result<(Vec<CaseBinding>, bool), SyntaxError> {
        let mut ignore_rest_range = None;
        let mut bindings = Vec::new();
        loop {
            match self.get() {
                Token::LowerId(_) => {
                    let name = self.parse_id()?;
                    bindings.push(CaseBinding::Field(PatIdent(name)));
                }
                Token::LPar => {
                    let start = self.range();
                    self.advance();
                    let name = self.parse_id()?;
                    self.eat_variant(Token::Eq)?;
                    let renamed = self.parse_id()?;
                    self.eat_closing_keyword(Token::RPar, start)?;
                    bindings.push(CaseBinding::Renamed(name, PatIdent(renamed)));
                }
                Token::DotDot => {
                    ignore_rest_range = Some(self.range());
                    self.advance();
                    continue;
                }
                _ => break,
            }
            if let Some(range) = ignore_rest_range {
                return Err(SyntaxError::IgnoreRestShouldBeOnTheEnd(range));
            }
        }
        Ok((bindings, ignore_rest_range.is_some()))
    }

    pub fn parse_match(&mut self) -> Result<Box<Expr>, SyntaxError> {
        let start = self.range();
        self.advance(); // 'match'

        let tipo = self.parse_upper_id()?;
        let scrutinizer = self.parse_expr(false)?;

        self.eat_variant(Token::LBrace)?;

        let mut cases = Vec::new();

        while !self.get().same_variant(&Token::RBrace) {
            let constructor = self.parse_id()?;

            self.eat_variant(Token::FatArrow)?;
            let value = self.parse_expr(false)?;

            let (bindings, ignore_rest) = self.parse_pat_destruct_bindings()?;

            cases.push(Case {
                constructor: constructor,
                bindings,
                value,
                ignore_rest,
            })
        }

        let mut end = self.eat_variant(Token::RBrace)?.1;

        let motive = if self.check_and_eat(Token::Colon) {
            let expr = self.parse_expr(false)?;
            end = expr.range;
            Some(self.parse_expr(false)?)
        } else {
            None
        };

        let match_ = Box::new(Match {
            tipo,
            scrutinizer,
            cases,
            motive,
        });

        Ok(Box::new(Expr {
            data: ExprKind::Match(match_),
            range: start.mix(end),
        }))
    }

    pub fn parse_let(&mut self) -> Result<Box<Expr>, SyntaxError> {
        let start = self.range();
        self.advance(); // 'let'
        let name = self.parse_destruct()?;
        self.eat_variant(Token::Eq)?;
        let expr = self.parse_expr(false)?;
        self.check_and_eat(Token::Semi);
        let next = self.parse_expr(false)?;
        let end = next.range;
        Ok(Box::new(Expr {
            data: ExprKind::Let(name, expr, next),
            range: start.mix(end),
        }))
    }

    fn parse_sigma_pair(&mut self) -> Result<Box<Expr>, SyntaxError> {
        let start = self.range();
        self.advance(); // '$'
        let fst = self.parse_atom()?;
        let snd = self.parse_atom()?;
        let end = snd.range;
        Ok(Box::new(Expr {
            data: ExprKind::Pair(fst, snd),
            range: start.mix(end),
        }))
    }

    fn parse_if(&mut self) -> Result<Box<Expr>, SyntaxError> {
        let start = self.range();
        self.advance(); // 'if'
        let cond = self.parse_expr(false)?;
        self.eat_variant(Token::LBrace)?;
        let if_ = self.parse_expr(false)?;
        self.eat_variant(Token::RBrace)?;
        self.eat_variant(Token::Else)?;
        self.eat_variant(Token::LBrace)?;
        let els_ = self.parse_expr(false)?;
        let end = self.eat_variant(Token::RBrace)?.1;
        let range = start.mix(end);
        Ok(Box::new(Expr {
            data: ExprKind::If(cond, if_, els_),
            range,
        }))
    }

    /// The infinite hell of else ifs. But it's the most readable way
    /// to check if the queue of tokens match a pattern as we need
    /// some looakhead tokens.
    pub fn parse_expr(&mut self, multiline: bool) -> Result<Box<Expr>, SyntaxError> {
        self.ignore_docs();
        if self.check_actual(Token::Do) {
            self.parse_do()
        } else if self.check_actual(Token::Match) {
            self.parse_match()
        } else if self.check_actual(Token::Let) {
            self.parse_let()
        } else if self.check_actual(Token::If) {
            self.parse_if()
        } else if self.check_actual(Token::Dollar) {
            self.parse_sigma_pair()
        } else if self.is_lambda() {
            self.parse_lambda()
        } else if self.is_pi_type() {
            self.parse_pi_or_lambda()
        } else if self.is_sigma_type() {
            self.parse_sigma_type()
        } else if self.is_substitution() {
            self.parse_substitution()
        } else {
            self.parse_arrow(multiline)
        }
    }
}
