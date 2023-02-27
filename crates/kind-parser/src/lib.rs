#[macro_use]
extern crate lalrpop_util;

pub mod lexer;

lalrpop_mod!(pub parser);

#[cfg(test)]
mod tests {
    use crate::lexer::*;
    use logos::Logos;

    #[test]
    pub fn test_parser_pi() {
        let lexer = Lexer(crate::lexer::Token::lexer("(a: T, b: T) -> a.b.c"));
        // let parser = parser::ExprParser::new();
        // let res = parser.parse(lexer);
        // assert!(res.is_ok());
    }

    #[test]
    pub fn test_parser_lambda() {
        // let lexer = Lexer(crate::lexer::Token::lexer("(a: T, b: T) : T => a.b.c"));
        // let parser = parser::ExprParser::new();
        // let res = parser.parse(lexer);
        // assert!(res.is_ok());
    }
}
