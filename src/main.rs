pub mod book;
pub mod checker;
pub mod codegen;
pub mod derive;
pub mod driver;
pub mod lowering;
pub mod parser;

use std::env;

use crate::driver::config::{Config, Target};
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
    #[clap(aliases = &["e"])]
    Eval { file: String },

    /// Runs Main on the HVM
    #[clap(aliases = &["r"])]
    Run { file: String },

    /// Derives .kind2 files from a .type file
    #[clap(aliases = &["der"])]
    Derive { file: String },

    /// Generates a checker (.hvm) for a file
    #[clap(aliases = &["gc"])]
    GenChecker { file: String },

    /// Stringifies a file
    #[clap(aliases = &["show"])]
    Show { file: String },

    /// Compiles a file to Kindelia (.kdl)
    #[clap(aliases = &["kdl"])]
    ToKDL {
        file: String,
        /// If given, a namespace that goes before each compiled name. Can be at most 10 charaters long.
        #[clap(long, aliases = &["ns"])]
        namespace: Option<String>,
    },

    /// Compiles a file to HVM (.hvm)
    #[clap(aliases = &["hvm"])]
    ToHVM { file: String },
}

fn run_cli() -> Result<(), String> {
    let cli_matches = Cli::parse();

    let mut config = Config {
        no_high_line: false,
        color_output: true,
        kind2_path: env::var_os("KIND2_PATH").map(|x| x.into_string().unwrap()).unwrap_or_else(|| "".to_string()),
        target: Target::All
    };

    match cli_matches.command {
        Command::Eval { file: path } => cmd_eval_main(&config, &path),
        Command::Run { file: path } => cmd_run_main(&config, &path),
        Command::Check { file: path } => cmd_check_all(&config, &path),
        Command::Derive { file: path } => cmd_derive(&config, &path),
        Command::GenChecker { file: path } => cmd_gen_checker(&config, &path),
        Command::Show { file: path } => cmd_show(&config, &path),
        Command::ToKDL { file: path, namespace } => {
            config.target = Target::Kdl;
            cmd_to_kdl(&config, &path, &namespace)
        },
        Command::ToHVM { file: path } => {
            config.target = Target::Hvm;
            cmd_to_hvm(&config, &path)
        }
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
