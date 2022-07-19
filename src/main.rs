#![allow(dead_code)] 
#![allow(unused_variables)] 

mod language;
mod to_kdl;
mod to_hvm;

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
  /// Check a file
  #[clap(aliases = &["c"])]
  Check { file: String },

  /// Evaluates Main on Kind2
  #[clap(aliases = &["r"])]
  Eval { file: String },

  /// Runs Main on the HVM
  #[clap(aliases = &["r"])]
  Run { file: String },

  /// Generates a checker (.hvm) for a file
  #[clap(aliases = &["c"])]
  GenChecker { file: String },

  /// Stringifies a file
  #[clap(aliases = &["c"])]
  Show { file: String },

  /// Compiles a file to Kindelia (.kdl)
  #[clap(aliases = &["c"])]
  ToKDL { file: String },

  /// Compiles a file to HVM (.hvm)
  #[clap(aliases = &["c"])]
  ToHVM { file: String },
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
    Command::Eval { file: path } => {
      cmd_eval_main(&path)
    }

    Command::Run { file: path } => {
      cmd_run_main(&path)
    }

    Command::Check { file: path } => {
      cmd_check_all(&path)
    }

    Command::GenChecker { file: path } => {
      cmd_gen_checker(&path)
    }

    Command::Show { file: path } => {
      cmd_show(&path)
    }

    Command::ToKDL { file: path } => {
      cmd_to_kdl(&path)
    }

    Command::ToHVM { file: path } => {
      cmd_to_hvm(&path)
    }
  }
}

// Commands
// --------

// Checks all definitions of a Kind2 file
fn cmd_check_all(path: &str) -> Result<(), String> {
  let loaded = load_file(path)?;
  let result = run_with_hvm(&loaded.check_code, "API.check_all", true)?;
  std::fs::write(format!("{}.hvm", path.replace(".kind2",".check")), loaded.check_code.clone()).ok();
  print!("{}", inject_highlights(&loaded.kind2_code, &result.output));
  println!("Rewrites: {}", result.rewrites);
  Ok(())
}


// Evaluates Main on Kind2
fn cmd_eval_main(path: &str) -> Result<(), String> {
  let loaded = load_file(path)?;
  let result = run_with_hvm(&loaded.check_code, "API.eval_main", true)?;
  print!("{}", result.output);
  println!("Rewrites: {}", result.rewrites);
  Ok(())
}

// Runs Main on HVM
fn cmd_run_main(path: &str) -> Result<(), String> {
  let loaded = load_file(path)?;
  let result = to_hvm::to_hvm_book(&loaded.kind2_book);
  let result = run_with_hvm(&result, "Main", false)?;
  println!("{}", result.output);
  println!("Rewrites: {}", result.rewrites);
  Ok(())
}

// Generates the checker file (`file.kind2` -> `file.checker.hvm`)
fn cmd_gen_checker(path: &str) -> Result<(), String> {
  let loaded = load_file(path)?;
  let gen_path = format!("{}.hvm", path.replace(".kind2",".check"));
  println!("Generated '{}'.", gen_path);
  std::fs::write(gen_path, loaded.check_code.clone()).ok();
  Ok(())
}

// Stringifies a file
fn cmd_show(path: &str) -> Result<(), String> {
  let loaded = load_file(path)?;
  let result = show_book(&loaded.kind2_book);
  println!("{}", result);
  Ok(())
}

// Compiles a file to Kindelia (.kdl)
fn cmd_to_kdl(path: &str) -> Result<(), String> {
  let loaded = load_file(path)?;
  let result = to_kdl::to_kdl_book(&loaded.kind2_book);
  print!("{}", result);
  Ok(())
}

// Compiles a file to Kindelia (.kdl)
fn cmd_to_hvm(path: &str) -> Result<(), String> {
  let loaded = load_file(path)?;
  let result = to_hvm::to_hvm_book(&loaded.kind2_book);
  print!("{}", result);
  Ok(())
}

// Utils
// -----

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
    Err(err) => {
      let (init, last) = get_origin_range(err.orig);
      match err.kind {
        AdjustErrorKind::IncorrectArity => {
          return Err(format!("Incorrect arity.\n{}", highlight_error::highlight_error(init, last, &kind2_code)));
        }
        AdjustErrorKind::UnboundVariable => {
          return Err(format!("Unbound variable.\n{}", highlight_error::highlight_error(init, last, &kind2_code)));
        }
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
fn run_with_hvm(code: &str, main: &str, read_string: bool) -> Result<RunResult, String> {
  let mut rt = hvm::Runtime::from_code(code)?;
  let main = rt.alloc_code(main)?;
  rt.normalize(main);
  return Ok(RunResult {
    output: if read_string { readback_string(&rt, main) } else { rt.show(main) },
    rewrites: rt.get_rewrites(),
  });
}

// Converts a HVM string to a Rust string
pub fn readback_string(rt: &hvm::Runtime, host: u64) -> String {
  let str_cons = rt.get_id("String.cons");
  let str_nil  = rt.get_id("String.nil");
  let mut term = rt.ptr(host);
  let mut text = String::new();
  loop {
    if hvm::get_tag(term) == hvm::CTR {
      let fid = hvm::get_ext(term);
      if fid == str_cons {
        let head = rt.ptr(hvm::get_loc(term, 0));
        let tail = rt.ptr(hvm::get_loc(term, 1));
        if hvm::get_tag(head) == hvm::NUM {
          text.push(std::char::from_u32(hvm::get_num(head) as u32).unwrap_or('?'));
          term = tail;
          continue;
        }
      }
      if fid == str_nil {
        break;
      }
    }
    panic!("Invalid output: {} {}", hvm::get_tag(term), rt.show(host));
  }

  return text;
}
