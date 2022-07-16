#![allow(dead_code)] 
#![allow(unused_variables)] 

mod cli;
mod language;

use cli::{Cli, Parser, Command};
use language::{*};
use hvm::parser as parser;

const CHECKER_HVM: &str = include_str!("checker.hvm");

fn main() {
  println!("{}", name_to_u64("_"));
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
      kind2(&path, "API.run_main")
    }

    Command::Check { file: path, params } => {
      kind2(&path, "API.check_all")
    }
  }
}

fn kind2(path: &str, main_function: &str) -> Result<(), String> {
  // Reads definitions from file
  let kind2_code = match std::fs::read_to_string(path) {
    Ok(code) => code,
    Err(msg) => {
      println!("File not found: {}", path);
      return Ok(());
    },
  };

  // Prints errors if parsing failed
  let file = match read_file(&kind2_code) {
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
  print!("{}", replace_ranges_by_code(&kind2_code, &readback_string(&rt, main)));


  // Display stats
  println!("Rewrites: {}", rt.get_rewrites());

  Ok(())
}

fn replace_ranges_by_code(file_code: &str, checker_output: &str) -> String {
  let mut code = String::new();
  let mut cout = checker_output;
  while let (Some(init_range_index), Some(last_range_index)) = (cout.find("{{#"), cout.find("#}}")) {
    let range_text = &cout[init_range_index + 3 .. last_range_index];
    let range_text = range_text.split(":").map(|x| x.parse::<u64>().unwrap()).collect::<Vec<u64>>();
    let range_init = range_text[0] as usize;
    let range_last = range_text[1] as usize;
    code.push_str(&cout[0 .. init_range_index]);
    code.push_str(&highlight_error::highlight_error(range_init, range_last, file_code));
    cout = &cout[last_range_index + 3 ..];
  }
  code.push_str(cout);
  return code;
}

// ------------------------------------------------------------
// ------------------------------------------------------------
// ------------------------------------------------------------

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
