pub mod book;
pub mod checker;
pub mod codegen;
pub mod driver;
pub mod lowering;
pub mod parser;

use crate::driver::*;

use clap::{Parser, Subcommand};

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

fn run_cli() -> Result<(), String> {
    let cli_matches = Cli::parse();

    match cli_matches.command {
        Command::Eval { file: path } => cmd_eval_main(&path),
        Command::Run { file: path } => cmd_run_main(&path),
        Command::Check { file: path } => cmd_check_all(&path),
        Command::Derive { file: path } => cmd_derive(&path),
        Command::GenChecker { file: path } => cmd_gen_checker(&path),
        Command::Show { file: path } => cmd_show(&path),
        Command::ToKDL { file: _ } => todo!(),
        Command::ToHVM { file: path } => cmd_to_hvm(&path),
    }
}

fn main() {
    match run_cli() {
        Ok(..) => {}
        Err(err) => {
            eprintln!("{}", err);
        }
    };
}
