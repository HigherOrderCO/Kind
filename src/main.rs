#![allow(dead_code)] 
#![allow(unused_variables)] 

mod cli;
mod language;

use cli::{Cli, Parser, Command};
use language::{*};
use hvm::parser as parser;

const CHECKER_HVM: &str = include_str!("checker.hvm");

fn main() {
  match run_cli() {
    Ok(..) => {}
    Err(err) => {
      eprintln!("{}", err);
    }
  };
}

// ------------------------------------------------------------
// ------------------------------------------------------------
// ------------------------------------------------------------

fn run_cli() -> Result<(), String> {
  let cli_matches = Cli::parse();

  match cli_matches.command {
    Command::Run { file: path, params } => {
      kind2(&path, "Api.run_main")
    }

    Command::Check { file: path, params } => {
      kind2(&path, "Api.check_all")
    }
  }
}

fn kind2(path: &str, main_function: &str) -> Result<(), String> {
  let file = match std::fs::read_to_string(path) {
    Ok(code) => read_file(&code),
    Err(msg) => {
      println!("File not found: {}", path);
      return Ok(());
    },
  };

  // Prints errors if parsing failed
  let file = match file {
    Ok(file) => file,
    Err(msg) => {
      println!("{}", msg);
      return Ok(());
    }
  };

  // Adjusts the file
  let file = adjust_file(&file);

  //for (name, entry) in &file.entries {
    //println!("[{}]\n{}\n", name, show_entry(entry));
  //}

  let code = compile_file(&file);
  let mut checker = (&CHECKER_HVM[0 .. CHECKER_HVM.find("////INJECT////").unwrap()]).to_string(); 
  checker.push_str(&code);

  // Writes the checker file.kind2.hvm
  std::fs::write(format!("{}.hvm", path), checker.clone()).ok();

  // Runs with the interpreter 
  let mut rt = hvm::Runtime::from_code(&checker)?;
  let main = rt.alloc_code(main_function)?;
  rt.normalize(main);
  println!("{}", readback_string(&rt, main)); // TODO: optimize by deserializing term into text directly

  // Display stats
  println!("Rewrites: {}", rt.get_rewrites());

  Ok(())
}

fn debug_print_parser_state(txt: &str, state: &parser::State) {
  println!("{} ||{}", txt, &state.code[state.index..state.index+32].replace("\n"," || "));
}

fn gen_debug_file() {
  let file = match read_file(&DEBUG_CODE) {
    Ok(file) => file,
    Err(msg) => {
      println!("{}", msg);
      return;
    }
  };
  let code = compile_file(&file);
  let mut checker = (&CHECKER_HVM[0 .. CHECKER_HVM.find("////INJECT////").unwrap()]).to_string(); 
  checker.push_str(&code);
  std::fs::write("debug.hvm", checker.clone()).ok(); // writes checker to the checker.hvm file
}

const DEBUG_CODE: &str = "
Bool : Type
True : Bool
False : Bool

Nat : Type
Zero : Nat
Succ (pred: Nat) : Nat

List (a: Type) : Type
Nil  (a: Type) : (List a)
Cons (a: Type) (x: a) (xs: (List a)) : (List a)

Not (a: Bool) : Bool
Not True  = False
";
