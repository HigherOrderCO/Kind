#![allow(dead_code)] 
#![allow(unused_variables)] 

mod language;
mod to_kdl;
mod to_hvm;

use language::{*};
use std::collections::HashMap;
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

  /// Derives .kind2 files from a .type file
  #[clap(aliases = &["c"])]
  Derive { file: String },

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

    Command::Derive { file: path } => {
      cmd_derive(&path)
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
  let loaded = load(path)?;
  let result = run_with_hvm(&gen_checker(&loaded.book), "Kind.API.check_all", true)?;
  print!("{}", inject_highlights(&loaded.file, &result.output));
  println!("Rewrites: {}", result.rewrites);
  Ok(())
}


// Evaluates Main on Kind2
fn cmd_eval_main(path: &str) -> Result<(), String> {
  let loaded = load(path)?;
  if loaded.book.entrs.contains_key("Main") {
    let result = run_with_hvm(&gen_checker(&loaded.book), "Kind.API.eval_main", true)?;
    print!("{}", result.output);
    println!("Rewrites: {}", result.rewrites);
    Ok(())
  } else {
    Err("Main not found.".to_string())
  }
}

// Runs Main on HVM
fn cmd_run_main(path: &str) -> Result<(), String> {
  let loaded = load(path)?;
  if loaded.book.entrs.contains_key("Main") {
    let result = to_hvm::to_hvm_book(&loaded.book);
    let result = run_with_hvm(&result, "Main", false)?;
    println!("{}", result.output);
    println!("Rewrites: {}", result.rewrites);
    Ok(())
  } else {
    Err("Main not found.".to_string())
  }
}

// Generates the checker file (`file.kind2` -> `file.checker.hvm`)
fn cmd_gen_checker(path: &str) -> Result<(), String> {
  let loaded = load(path)?;
  let gen_path = format!("{}.hvm", path.replace(".kind2",".check"));
  println!("Generated '{}'.", gen_path);
  std::fs::write(gen_path, gen_checker(&loaded.book)).ok();
  Ok(())
}

// Stringifies a file
fn cmd_show(path: &str) -> Result<(), String> {
  let loaded = load(path)?;
  let result = show_book(&loaded.book);
  println!("{}", result);
  Ok(())
}

// Compiles a file to Kindelia (.kdl)
fn cmd_to_kdl(path: &str) -> Result<(), String> {
  let loaded    = load(path)?;
  let comp_book = language::compile_book(&loaded.book)?;
  let kdl_names = to_kdl::get_kdl_names(&comp_book)?;
  let result    = to_kdl::to_kdl_book(&loaded.book, &kdl_names, &comp_book)?;
  print!("{}", result);
  Ok(())
}

// Compiles a file to Kindelia (.kdl)
fn cmd_to_hvm(path: &str) -> Result<(), String> {
  let loaded = load(path)?;
  let result = to_hvm::to_hvm_book(&loaded.book);
  print!("{}", result);
  Ok(())
}

// Derives generic functions
fn cmd_derive(path: &str) -> Result<(), String> {
  let newcode = match std::fs::read_to_string(&path) {
    Err(err) => { return Err(format!("File not found: '{}'.", path)); }
    Ok(code) => { code }
  };
  let newtype = match read_newtype(&newcode) {
    Err(err) => { return Err(format!("\x1b[1m[{}]\x1b[0m\n{}", path, err)); }
    Ok(book) => { book }
  };
  fn save_derived(path: &str, derived: &Derived) {
    let dir = std::path::Path::new(&derived.path);
    let txt = show_entry(&derived.entr);
    let txt = format!("// Automatically derived from {}\n{}", path, txt);
    println!("\x1b[4m\x1b[1mDerived '{}':\x1b[0m", derived.path);
    println!("{}\n", txt);
    std::fs::create_dir_all(dir.parent().unwrap()).unwrap();
    std::fs::write(dir, txt).ok();
  }
  save_derived(path, &derive_type(&newtype));
  for i in 0 .. newtype.ctrs.len() {
    save_derived(path, &derive_ctr(&newtype, i));
  }
  save_derived(path, &derive_match(&newtype));
  return Ok(());
}

// Utils
// -----

pub struct RunResult {
  output: String,
  rewrites: u64,
}

// Replaces line ranges `{{123:456}}` on `target` by slices of `file_code`
fn inject_highlights(file: &Vec<File>, target: &str) -> String {
  let mut code = String::new();
  let mut cout = target;
  // Replaces file ids by names
  loop {
    let mut injected = false;
    if let (Some(init_file_index), Some(last_file_index)) = (cout.find("{{#F"), cout.find("F#}}")) {
      let file_text = &cout[init_file_index + 4 .. last_file_index];
      let file_numb = file_text.parse::<u64>().unwrap() as usize;
      code.push_str(&cout[0 .. init_file_index]);
      code.push_str(&file[file_numb].path);
      cout = &cout[last_file_index + 4 ..];
      injected = true;
    }
    if let (Some(init_range_index), Some(last_range_index)) = (cout.find("{{#R"), cout.find("R#}}")) {
      let range_text = &cout[init_range_index + 4 .. last_range_index];
      let range_text = range_text.split(":").map(|x| x.parse::<u64>().unwrap()).collect::<Vec<u64>>();
      let range_file = range_text[0] as usize;
      let range_init = range_text[1] as usize;
      let range_last = range_text[2] as usize;
      code.push_str(&cout[0 .. init_range_index]);
      code.push_str(&highlight_error::highlight_error(range_init, range_last, &file[range_file].code));
      cout = &cout[last_range_index + 4 ..];
      injected = true;
    }
    if !injected {
      break;
    }
  }
  code.push_str(cout);
  return code;
}

// Given an HVM source, runs an expression
fn run_with_hvm(code: &str, main: &str, read_string: bool) -> Result<RunResult, String> {
  let mut rt = hvm::Runtime::from_code(code)?;
  let main = rt.alloc_code(main)?;
  rt.run_io(main);
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
  let mut term = rt.at(host);
  let mut text = String::new();
  loop {
    if hvm::get_tag(term) == hvm::CTR {
      let fid = hvm::get_ext(term);
      if fid == str_cons {
        let head = rt.at(hvm::get_loc(term, 0));
        let tail = rt.at(hvm::get_loc(term, 1));
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

// Generates a .hvm checker for a Book
fn gen_checker(book: &Book) -> String {
  // Compile the Kind2 file to HVM checker
  let base_check_code = to_checker_book(&book);
  let mut check_code = CHECKER_HVM.to_string();
  check_code.push_str(&base_check_code);
  return check_code;
}

// Loader
// ======

pub struct File {
  path: String,
  code: String,
}

pub struct Load {
  file: Vec<File>,
  book: Book,
}

pub fn load(name: &str) -> Result<Load, String> {
  let mut load = Load {
    file: Vec::new(),
    book: Book {
      names: vec![],
      entrs: HashMap::new(),
      holes: 0,
    }
  };

  if !std::path::Path::new(name).is_file() {
    return Err(format!("File not found: '{}'", name));
  }

  load_entry(name, &mut load)?;

  // Adjusts the Kind2 book
  match adjust_book(&load.book) {
    Ok(book) => {
      load.book = book;
    }
    Err(err) => {
      let (file, init, last) = get_origin_range(err.orig);
      let high_line = highlight_error::highlight_error(init, last, &load.file[file].code);
      return match err.kind {
        AdjustErrorKind::IncorrectArity           => Err(format!("Incorrect arity.\n{}", high_line)),
        AdjustErrorKind::UnboundVariable { name } => Err(format!("Unbound variable '{}'.\n{}", name, high_line)),
        AdjustErrorKind::RepeatedVariable         => Err(format!("Repeated variable.\n{}", high_line)),
        AdjustErrorKind::CantLoadType             => Err(format!("Can't load type.\n{}", high_line)),
        AdjustErrorKind::NoCoverage               => Err(format!("Incomplete constructor coverage.\n{}", high_line)),
      };
    }
  };

  return Ok(load);
}

pub fn load_entry(name: &str, load: &mut Load) -> Result<(), String> {
  if !load.book.entrs.contains_key(name) {

    let path : String;
    if name.ends_with(".kind2") {
      path = name.to_string();
    } else {
      let inside_path = format!("{}/_.kind2", &name.replace(".","/")); // path ending with 'Name/_.kind'
      let normal_path = format!("{}.kind2", &name.replace(".","/")); // path ending with 'Name.kind'
      if std::path::Path::new(&inside_path).is_file() {
        if std::path::Path::new(&normal_path).is_file() {
          return Err(format!("The following files can't exist simultaneously:\n- {}\n- {}\nPlease delete one and try again.", inside_path, normal_path));
        }
        path = inside_path;
      } else {
        path = normal_path;
      }
    };

    let newcode = match std::fs::read_to_string(&path) {
      Err(err) => { return Ok(()); }
      Ok(code) => { code }
    };

    let mut new_book = match read_book(&newcode) {
      Err(err) => { return Err(format!("\x1b[1m[{}]\x1b[0m\n{}", path, err)); }
      Ok(book) => { book }
    };
    book_set_origin_file(&mut new_book, load.file.len());

    load.file.push(File { path: path.clone(), code: newcode });
    for name in &new_book.names {
      load.book.names.push(name.clone());
      load.book.entrs.insert(name.clone(), new_book.entrs.get(name).unwrap().clone());
    }

    for unbound in book_get_unbounds(&new_book) {
      load_entry(&unbound, load)?;
    }

  }

  return Ok(());
}
