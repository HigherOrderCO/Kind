use std::{path::PathBuf, process::exit};

use clap::{Parser, Subcommand};
use kind_driver::{session::Session, resolution::type_check_glossary};
use kind_report::{data::DiagnosticFrame, RenderConfig};

#[derive(Parser, Debug)]
#[command(author, version, about, long_about = None)]
#[clap(propagate_version = true)]
struct Cli {
    /// Configuration file to change information about
    /// pretty printing or project root.
    #[arg(short, long, value_name = "FILE")]
    config: Option<PathBuf>,

    /// Turn on the debugging information generated
    /// by the compiler.
    #[arg(short, long)]
    debug: bool,

    /// Show warning messages
    #[arg(short, long)]
    warning: bool,

    #[command(subcommand)]
    command: Command,
}

#[derive(Subcommand, Debug)]
enum Command {
    /// Check a file
    #[clap(aliases = &["c"])]
    Check { file: String },

    /// Evaluates Main on Kind2
    #[clap(aliases = &["e"])]
    Eval { file: String },

    /// Runs Main on the HVM
    #[clap(aliases = &["r"])]
    Run { file: String },

    /// Generates a checker (.hvm) for a file
    #[clap(aliases = &["gc"])]
    GenChecker { file: String },

    /// Stringifies a file
    #[clap(aliases = &["s"])]
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

    /// Watch for file changes and then
    /// check when some file change.
    #[clap(aliases = &["w"])]
    Watch { file: String },

    /// Read eval print loop
    #[clap(aliases = &["re"])]
    Repl,
}

fn main() {
    let config = Cli::parse();

    let render_config = RenderConfig::unicode(2);
    let (rx, tx) = std::sync::mpsc::channel();

    match config.command {
        Command::Check { file } => {
            let mut session = Session::new(PathBuf::from("."), rx);
            type_check_glossary(&mut session, &PathBuf::from(file));

            let errs = tx.try_iter().collect::<Vec<DiagnosticFrame>>();

            for err in &errs {
                kind_driver::render_error_to_stderr(&session, &render_config, err);
            }

            if !errs.is_empty() {
                eprintln!();
                exit(1);
            } else {
                exit(0);
            }
        },
        _ => todo!()
    }
}