#![allow(dead_code)] 
#![allow(unused_variables)] 

mod language;

use language::{*};
use clap::{Parser, Subcommand};

const CHECKER_HVM: &str = include_str!("checker.hvm");

#[derive(Parser)]
#[clap(author, version, about, long_about = None)]
#[clap(propagate_version = true)]
pub struct Cli {
  #[clap(subcommand)]
  pub command: Command,
}

#[derive(Subcommand)]
pub enum Command {
  /// Run a file interpreted
  #[clap(aliases = &["r"])]
  Run { file: String, params: Vec<String> },

  /// Check a file
  #[clap(aliases = &["c"])]
  Check { file: String, params: Vec<String> },

  /// Generates a .hvm checker for a .kind2 file
  #[clap(aliases = &["c"])]
  GenChecker { file: String, params: Vec<String> },
}

fn main() {
  match run_cli() {
    Ok(..) => {}
    Err(err) => {
      eprintln!("{}", err);
    }
  };
}

fn run_cli() -> Result<(), String> {
  let cli_matches = Cli::parse();

  match cli_matches.command {
    Command::Run { file: path, params } => {
      run_main(&path)
    }

    Command::Check { file: path, params } => {
      check_all(&path)
    }

    Command::GenChecker { file: path, params } => {
      gen_checker(&path)
    }
  }
}

// Checks all definitions of a Kind2 file
fn check_all(path: &str) -> Result<(), String> {
  let loaded = load_file(path)?;
  let result = run_with_hvm(&loaded.check_code, "API.check_all")?;
  std::fs::write(format!("{}.hvm", path.replace(".kind2",".check")), loaded.check_code.clone()).ok();
  print!("{}", inject_highlights(&loaded.kind2_code, &result.output));
  println!("Rewrites: {}", result.rewrites);
  Ok(())
}

// Runs the Main function of a Kind2 file
fn run_main(path: &str) -> Result<(), String> {
  let loaded = load_file(path)?;
  let result = run_with_hvm(&loaded.check_code, "API.run_main")?;
  print!("{}", result.output);
  println!("Rewrites: {}", result.rewrites);
  Ok(())
}

// Generates the checker file (`file.kind2` -> `file.checker.hvm`)
fn gen_checker(path: &str) -> Result<(), String> {
  let loaded = load_file(path)?;
  std::fs::write(format!("{}.hvm", path.replace(".kind2",".check")), loaded.check_code.clone()).ok();
  Ok(())
}

pub struct LoadedFile {
  kind2_code: String, // user-defined file.kind2 code
  kind2_book: Book,   // object with all the parsed definitions
  check_code: String, // HVM code that type-checks this file
}

pub struct RunResult {
  output: String,
  rewrites: u64,
}

pub fn load_file(path: &str) -> Result<LoadedFile, String> {
  // Reads definitions from Kind2 file
  let kind2_code = match std::fs::read_to_string(path) {
    Ok(code) => code,
    Err(msg) => {
      return Err(format!("File not found: {}", path));
    },
  };

  // Prints errors if parsing failed
  let kind2_book = match read_book(&kind2_code) {
    Ok(kind2_book) => kind2_book,
    Err(msg) => {
      return Err(format!("{}", msg));
    }
  };

  // Adjusts the Kind2 book
  let kind2_book = match adjust_book(&kind2_book) {
    Ok(kind2_book) => kind2_book,
    Err(err) => match err {
      AdjustError::IncorrectArity { orig, term } => {
        let (init, last) = get_origin_range(orig);
        return Err(format!("Incorrect arity.\n{}", highlight_error::highlight_error(init, last, &kind2_code)));
      }
    }
  };

  // Compile the Kind2 file to HVM checker
  let base_check_code = compile_book(&kind2_book);
  let mut check_code = (&CHECKER_HVM[0 .. CHECKER_HVM.find("////INJECT////").unwrap()]).to_string(); 
  check_code.push_str(&base_check_code);

  return Ok(LoadedFile {
    kind2_code,
    kind2_book,
    check_code,
  });
}

// Replaces line ranges `{{123:456}}` on `target` by slices of `file_code`
fn inject_highlights(file_code: &str, target: &str) -> String {
  let mut code = String::new();
  let mut cout = target;
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

// Given an HVM source, runs an expression
fn run_with_hvm(code: &str, main: &str) -> Result<RunResult, String> {
  let mut rt = hvm::Runtime::from_code(code)?;
  let main = rt.alloc_code(main)?;
  rt.normalize(main);
  return Ok(RunResult {
    output: readback_string(&rt, main),
    rewrites: rt.get_rewrites(),
  });
}
