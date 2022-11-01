use std::{path::PathBuf};

use clap::{Parser, Subcommand};
use kind_driver::{resolution::type_check_book, session::Session, render_error_to_stderr};
use kind_report::{data::{DiagnosticFrame}, RenderConfig};

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
    let _config = Cli::parse();

    let render_config = RenderConfig::unicode(2);
    let (rx, tx) = std::sync::mpsc::channel();

    let mut session = Session::new(PathBuf::from("."), rx);

    type_check_book(&mut session, &PathBuf::from("./teste.kind2"));

    let diagnostics = tx.try_iter().collect::<Vec<DiagnosticFrame>>();

    if diagnostics.is_empty() {
        println!("Ok!");
    } else {
        for diagnostic in diagnostics {
            render_error_to_stderr(&render_config, &session, &diagnostic)
        }
    }
}
