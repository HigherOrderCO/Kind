use kind_tree::concrete::expr::*;
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

    pub fn is_pi_type(&self) -> bool {
        self.get().same_variant(Token::LPar) && self.peek(1).is_lower_id() && self.peek(2).same_variant(Token::Colon)
    }

    pub fn is_lambda(&self) -> bool {
        self.get().is_lower_id() && self.peek(1).same_variant(Token::FatArrow)
    }

    pub fn is_sigma_type(&self) -> bool {
        self.get().same_variant(Token::LBracket) && self.peek(1).is_lower_id() && self.peek(2).same_variant(Token::Colon)
    }

    pub fn is_substitution(&self) -> bool {
        self.get().same_variant(Token::HashHash)
    }

    pub fn parse_substitution(&mut self) -> Result<Box<Expr>, SyntaxError> {
        let start = self.range();
        self.bump(); // '##'
        let name = self.parse_id()?;
        self.eat_variant(Token::Slash)?;
        let redx = self.parse_num_lit()?;
        let expr = self.parse_expr(false)?;
        let range = start.mix(expr.range);
        Ok(Box::new(Expr {
            data: ExprKind::Subst(Substitution { name, redx, indx: 0, expr }),
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
        self.bump(); // '=>'

        let expr = self.parse_expr(false)?;
        let end_range = expr.range;

        Ok(Box::new(Expr {
            data: ExprKind::Lambda(ident, None, expr),
            range: name_span.mix(end_range),
        }))
    }

    fn parse_pi_or_lambda(&mut self) -> Result<Box<Expr>, SyntaxError> {
        let range = self.range();
        self.bump(); // '('
        let ident = self.parse_id()?;
        self.bump(); // ':'
        let typ = self.parse_expr(false)?;

        let _ = self.eat_variant(Token::RPar)?;

        if self.eat_keyword(Token::FatArrow) {
            let body = self.parse_expr(false)?;
            Ok(Box::new(Expr {
                range: range.mix(body.range),
                data: ExprKind::Lambda(ident, Some(typ), body),
            }))
        } else {
            self.eat_keyword(Token::RightArrow);
            let body = self.parse_expr(false)?;
            Ok(Box::new(Expr {
                range: range.mix(body.range),
                data: ExprKind::All(Some(ident), typ, body),
            }))
        }
    }

    fn parse_sigma_type(&mut self) -> Result<Box<Expr>, SyntaxError> {
        let range = self.range();
        self.bump(); // '['
        let ident = self.parse_id()?;
        self.bump(); // ':'
        let typ = self.parse_expr(false)?;

        self.eat_variant(Token::RPar)?;
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
        Ok(Box::new(Expr {
            range: id.range,
            data: ExprKind::Data(id),
        }))
    }

    fn parse_num(&mut self, num: u64) -> Result<Box<Expr>, SyntaxError> {
        let range = self.range();
        self.bump();
        Ok(Box::new(Expr {
            range,
            data: ExprKind::Lit(Literal::Number(num)),
        }))
    }

    fn parse_char(&mut self, chr: char) -> Result<Box<Expr>, SyntaxError> {
        let range = self.range();
        self.bump();
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
        self.bump(); // '('
        let op = self.eat_operator()?;
        let fst = self.parse_atom()?;
        let snd = self.parse_atom()?;
        let end = self.eat_variant(Token::RPar)?.1;
        Ok(Box::new(Expr {
            range: range.mix(end),
            data: ExprKind::Binary(op, fst, snd),
        }))
    }

    fn parse_array(&mut self) -> Result<Box<Expr>, SyntaxError> {
        let range = self.range();
        self.bump(); // '['
        let mut vec = Vec::new();

        if self.check_actual(Token::RBracket) {
            let range = self.advance().1.mix(range);
            return Ok(Box::new(Expr { range, data: ExprKind::List(vec) }));
        }

        vec.push(*self.parse_expr(false)?);
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

        Ok(Box::new(Expr { range, data: ExprKind::List(vec) }))
    }

    fn parse_paren(&mut self) -> Result<Box<Expr>, SyntaxError> {
        if self.is_operator() {
            self.parse_binary_op()
        } else {
            let range = self.range();
            self.bump(); // '('
            let mut expr = self.parse_expr(true)?;
            if self.get().same_variant(Token::ColonColon) {
                self.bump(); // '::'
                let typ = self.parse_expr(false)?;
                let range = range.mix(self.eat_variant(Token::RPar)?.1);
                Ok(Box::new(Expr {
                    data: ExprKind::Ann(expr, typ),
                    range,
                }))
            } else {
                let end = self.eat_variant(Token::RPar)?.1;
                expr.range = range.mix(end);
                Ok(expr)
            }
        }
    }

    pub fn parse_help(&mut self, str: String) -> Result<Box<Expr>, SyntaxError> {
        let range = self.range();
        self.bump();
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
        self.bump();
        Ok(Box::new(Expr {
            range,
            data: ExprKind::Lit(Literal::String(str)),
        }))
    }

    pub fn parse_atom(&mut self) -> Result<Box<Expr>, SyntaxError> {
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

    fn parse_call(&mut self, multiline: bool) -> Result<Box<Expr>, SyntaxError> {
        let head = self.parse_atom()?;
        let start = head.range;
        let mut spine = Vec::new();
        let mut end = head.range;
        while (!self.is_linebreak() || multiline) && !self.get().same_variant(Token::Eof) {
            let res = self.try_single(&|parser| parser.parse_atom())?;
            match res {
                Some(atom) => {
                    end = atom.range;
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
        while self.eat_keyword(Token::RightArrow) {
            let next = self.parse_expr(false)?;
            let range = head.range.mix(next.range);
            head = Box::new(Expr {
                data: ExprKind::All(None, head, next),
                range,
            });
        }
        if self.eat_keyword(Token::ColonColon) {
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
        self.bump(); // 'ask'
                     // Parses the name for Ask that is optional
        let name = if self.peek(1).same_variant(Token::Eq) {
            let name = self.parse_id()?;
            self.bump(); // '='
            Some(name)
        } else {
            None
        };

        let expr = self.parse_expr(false)?;
        self.eat_keyword(Token::Semi);
        let next = self.parse_sttm()?;
        let end = expr.range;
        Ok(Box::new(Sttm {
            data: SttmKind::Ask(name, expr, next),
            range: start.mix(end),
        }))
    }

    pub fn parse_monadic_let(&mut self) -> Result<Box<Sttm>, SyntaxError> {
        let start = self.range();
        self.bump(); // 'let'
        let name = self.parse_id()?;
        self.eat_variant(Token::Eq)?;
        let expr = self.parse_expr(false)?;
        self.eat_keyword(Token::Semi);
        let next = self.parse_sttm()?;
        let end = expr.range;
        Ok(Box::new(Sttm {
            data: SttmKind::Let(name, expr, next),
            range: start.mix(end),
        }))
    }

    pub fn parse_return(&mut self) -> Result<Box<Sttm>, SyntaxError> {
        let start = self.range();
        self.bump(); // 'return'
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
            if self.get().same_variant(Token::RBrace) {
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
        self.bump(); // 'do'
        let typ = self.parse_id()?;
        self.eat_variant(Token::LBrace)?;
        let sttm = self.parse_sttm()?;
        let end = self.eat_variant(Token::RBrace)?.1;
        Ok(Box::new(Expr {
            data: ExprKind::Do(typ, sttm),
            range: start.mix(end),
        }))
    }

    pub fn parse_match(&mut self) -> Result<Box<Expr>, SyntaxError> {
        let start = self.range();
        self.bump(); // 'match'
        let tipo = self.parse_id()?;
        let name = self.parse_id()?;

        let expr = if self.eat_keyword(Token::Eq) { Some(self.parse_expr(false)?) } else { None };

        self.eat_variant(Token::LBrace)?;

        let mut cases = Vec::new();
        while !self.get().same_variant(Token::RBrace) {
            let case = self.parse_id()?;
            self.eat_variant(Token::FatArrow)?;
            let expr = self.parse_expr(false)?;
            cases.push((case, expr))
        }

        let mut end = self.eat_variant(Token::RBrace)?.1;

        let motive = if self.eat_keyword(Token::Colon) {
            let expr = self.parse_expr(false)?;
            end = expr.range;
            Some(self.parse_expr(false)?)
        } else {
            None
        };

        let match_ = Box::new(Match { tipo, name, expr, cases, motive });

        Ok(Box::new(Expr {
            data: ExprKind::Match(match_),
            range: start.mix(end),
        }))
    }

    pub fn parse_open(&mut self) -> Result<Box<Expr>, SyntaxError> {
        let start = self.range();
        self.bump(); // 'open'
        let tipo = self.parse_id()?;
        let name = self.parse_id()?;

        let expr = if self.eat_keyword(Token::Eq) { Some(self.parse_expr(false)?) } else { None };

        let body = self.parse_expr(false)?;
        let end = body.range;

        let open = Box::new(Open { tipo, name, expr, body });

        Ok(Box::new(Expr {
            data: ExprKind::Open(open),
            range: start.mix(end),
        }))
    }

    pub fn parse_let(&mut self) -> Result<Box<Expr>, SyntaxError> {
        let start = self.range();
        self.bump(); // 'let'
        let name = self.parse_id()?;
        self.eat_variant(Token::Eq)?;
        let expr = self.parse_expr(false)?;
        self.eat_keyword(Token::Semi);
        let next = self.parse_expr(false)?;
        let end = next.range;
        Ok(Box::new(Expr {
            data: ExprKind::Let(name, expr, next),
            range: start.mix(end),
        }))
    }

    fn parse_sigma_pair(&mut self) -> Result<Box<Expr>, SyntaxError> {
        let start = self.range();
        self.bump(); // '$'
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
        self.bump(); // 'if'
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
        if self.check_actual(Token::Do) {
            self.parse_do()
        } else if self.check_actual(Token::Match) {
            self.parse_match()
        } else if self.check_actual(Token::Let) {
            self.parse_let()
        } else if self.check_actual(Token::Open) {
            self.parse_open()
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
