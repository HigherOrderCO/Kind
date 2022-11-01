use std::{path::PathBuf, process::exit};

use clap::{Parser, Subcommand};
use kind_driver::{resolution::type_check_book, session::Session, Database, Db, parse_file, Diagnostics, render_error_to_stderr};
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
    let mut db = Database::new(rx);

    let initial = db.input_path(PathBuf::from("./teste.kind2")).unwrap();

    loop {
        let res = kind_driver::parse_file(&db, initial);
        let diagnostics = parse_file::accumulated::<Diagnostics>(&db, initial);

        if diagnostics.is_empty() {
            println!("Ok!");
        } else {
            for diagnostic in diagnostics {
                render_error_to_stderr(&render_config, &db, &diagnostic)
            }
        }

        for event in tx.recv().unwrap().unwrap() {
            let path = event.path.clone();

            let file = match db.files.get(&path) {
                Some(file) => file.1,
                None => continue,
            };
            // `path` has changed, so read it and update the contents to match.
            // This creates a new revision and causes the incremental algorithm
            // to kick in, just like any other update to a salsa input.
            let contents = std::fs::read_to_string(path).map_err(|_| format!("Failed to read file {}", event.path.display())).unwrap();
            file.set_text(&mut db).to(contents);
            
        }
    }
}
