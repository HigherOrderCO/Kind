pub mod book;
pub mod checker;
pub mod driver;
pub mod lowering;
pub mod parser;
pub mod codegen;

use std::env;

use crate::driver::*;
use crate::driver::config::Config;

use clap::{Parser, Subcommand};

#[derive(Parser)]
#[clap(author, version, about, long_about = None)]
#[clap(propagate_version = true)]
pub struct Cli {
    #[clap(subcommand)]
    pub command: Command,

    #[clap(aliases=&["nhl"], long, value_parser, default_value_t = false)]
    pub no_high_line: bool,

    #[clap(aliases=&["co"], long, value_parser, default_value_t = true)]
    pub color_output: bool
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


    let config = Config {
        no_high_line: cli_matches.no_high_line,
        color_output: cli_matches.color_output,
        kind2_path: env::var_os("KIND2_PATH").map(|x| x.into_string().unwrap()).unwrap_or("".to_string())
    };

    match cli_matches.command {
        Command::Eval { file: path } => cmd_eval_main(&config, &path),
        Command::Run { file: path } => cmd_run_main(&config, &path),
        Command::Check { file: path } => cmd_check_all(&config, &path),
        Command::Derive { file: path } => cmd_derive(&config, &path),
        Command::GenChecker { file: path } => cmd_gen_checker(&config, &path),
        Command::Show { file: path } => cmd_show(&config, &path),
        Command::ToKDL { file: path } => cmd_to_kdl(&config, &path),
        Command::ToHVM { file: path } => cmd_to_hvm(&config, &path),
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
