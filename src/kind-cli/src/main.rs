use std::path::PathBuf;
use std::time::Instant;
use std::{fmt, io};

use clap::{Parser, Subcommand};
use kind_driver::resolution::{type_check_book};
use kind_driver::{session::Session};
use kind_report::data::{Diagnostic, DiagnosticFrame, Log};
use kind_report::report::{FileCache, Report};
use kind_report::RenderConfig;

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

    /// Disable colors in error messages
    #[arg(short, long)]
    no_color: bool,

    /// Only ascii characters in error messages
    #[arg(short, long)]
    ascii: bool,

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

/// Helper structure to use stderr as fmt::Write
struct ToWriteFmt<T>(pub T);

impl<T> fmt::Write for ToWriteFmt<T>
where
    T: io::Write,
{
    fn write_str(&mut self, s: &str) -> fmt::Result {
        self.0.write_all(s.as_bytes()).map_err(|_| fmt::Error)
    }
}

pub fn render_to_stderr<T, E>(render_config: &RenderConfig, session: &T, err: &E)
where
    T: FileCache,
    E: Report,
{
    Report::render(
        err,
        session,
        render_config,
        &mut ToWriteFmt(std::io::stderr()),
    )
    .unwrap();
}

fn main() {
    let config = Cli::parse();

    kind_report::check_if_colors_are_supported(config.no_color);

    let render_config = kind_report::check_if_utf8_is_supported(config.no_color, 2);

    match config.command {
        Command::Check { file } => {
            let (rx, tx) = std::sync::mpsc::channel();

            let mut session = Session::new(PathBuf::from("."), rx);

            eprintln!();

            render_to_stderr(
                &render_config,
                &session,
                &Log::Checking(format!("the file '{}'", file)),
            );

            let start = Instant::now();

            type_check_book(&mut session, &PathBuf::from(file));

            let diagnostics = tx.try_iter().collect::<Vec<DiagnosticFrame>>();

            if diagnostics.is_empty() {
                render_to_stderr(&render_config, &session, &Log::Checked(start.elapsed()));
            } else {
                render_to_stderr(&render_config, &session, &Log::Failed(start.elapsed()));
                eprintln!();
                for diagnostic in diagnostics {
                    let diagnostic: Diagnostic = (&diagnostic).into();
                    render_to_stderr(&render_config, &session, &diagnostic)
                }
            }
            eprintln!();
        }
        Command::Eval { file } => todo!(),
        Command::Run { file } => todo!(),
        Command::GenChecker { file } => todo!(),
        Command::Show { file } => todo!(),
        Command::ToKDL { file, namespace } => todo!(),
        Command::ToHVM { file } => todo!(),
        Command::Watch { file } => todo!(),
        Command::Repl => todo!(),
    }
}
