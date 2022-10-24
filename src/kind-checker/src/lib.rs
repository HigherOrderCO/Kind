pub mod compiler;

use hvm::Term;
use kind_tree::desugared::Glossary;

const CHECKER_HVM: &str = include_str!("checker.hvm");

#[derive(Debug)]
enum Report {
    Succeded,
    Failed
}

fn parse_report(term: Box<Term>) -> Report {
    todo!()
}


pub fn type_check(glossary: &Glossary) {
    let base_check_code = compiler::codegen_glossary(glossary);
    let mut check_code = CHECKER_HVM.to_string();
    check_code.push_str(&base_check_code.to_string());

    println!("\n\n{}\n\n", base_check_code);
    let mut runtime = hvm::Runtime::from_code(&check_code).unwrap();
    let main = runtime.alloc_code("Kind.API.check_all").unwrap();
    runtime.run_io(main);
    runtime.normalize(main);
    let s = runtime.readback(main);


    println!("{}", s);

}