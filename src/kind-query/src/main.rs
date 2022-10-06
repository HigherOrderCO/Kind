use kind_span::SyntaxCtxIndex;

fn main() {
    let input = "($ (x => a b x) 3)";
    let mut peek = input.chars().peekable();
    let lexer = kind_parser::Lexer::new(input, &mut peek, SyntaxCtxIndex(0));
    let mut parser = kind_parser::state::Parser::new(lexer, SyntaxCtxIndex(0));
    match parser.parse_expr() {
        Ok(res) => println!("{}", res),
        Err(err) => println!("{:?}", err)
    }
}
