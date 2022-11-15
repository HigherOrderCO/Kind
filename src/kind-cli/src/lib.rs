use std::path::PathBuf;
use std::time::Instant;
use std::{fmt, io};

use clap::{Parser, Subcommand};
use kind_driver::session::Session;
use kind_report::data::{Diagnostic, DiagnosticFrame, Log};
use kind_report::report::{FileCache, Report};
use kind_report::RenderConfig;

use kind_driver as driver;

#[derive(Parser, Debug)]
#[command(author, version, about, long_about = None)]
#[clap(propagate_version = true)]
pub struct Cli {
    /// Configuration file to change information about
    /// pretty printing or project root.
    #[arg(short, long, value_name = "FILE")]
    pub config: Option<PathBuf>,

    /// Turn on the debugging information generated
    /// by the compiler.
    #[arg(short, long)]
    pub debug: bool,

    /// Show warning messages
    #[arg(short, long)]
    pub warning: bool,

    /// Disable colors in error messages
    #[arg(short, long)]
    pub no_color: bool,

    /// Only ascii characters in error messages
    #[arg(short, long)]
    pub ascii: bool,

    #[command(subcommand)]
    pub command: Command,
}

#[derive(Subcommand, Debug)]
pub enum Command {
    /// Check a file
    #[clap(aliases = &["c"])]
    Check { file: String },

    /// Evaluates Main on Kind2
    #[clap(aliases = &["e"])]
    Eval { file: String },

    #[clap(aliases = &["k"])]
    ToKindCore { file: String },

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

pub fn compile_in_session<T>(
    render_config: RenderConfig,
    root: PathBuf,
    file: String,
    fun: &mut dyn FnMut(&mut Session) -> Option<T>,
) -> Option<T> {
    let (rx, tx) = std::sync::mpsc::channel();

    let mut session = Session::new(root, rx);

    eprintln!();

    render_to_stderr(
        &render_config,
        &session,
        &Log::Checking(format!("the file '{}'", file)),
    );

    let start = Instant::now();

    let res = fun(&mut session);

    let diagnostics = tx.try_iter().collect::<Vec<DiagnosticFrame>>();

    if diagnostics.is_empty() && res.is_some() {
        render_to_stderr(&render_config, &session, &Log::Checked(start.elapsed()));
        eprintln!();
        res
    } else {
        render_to_stderr(&render_config, &session, &Log::Failed(start.elapsed()));
        eprintln!();
        for diagnostic in diagnostics {
            let diagnostic: Diagnostic = (&diagnostic).into();
            render_to_stderr(&render_config, &session, &diagnostic)
        }
        None
    }
}

pub fn run_cli(config: Cli) {
    kind_report::check_if_colors_are_supported(config.no_color);

    let render_config = kind_report::check_if_utf8_is_supported(config.ascii, 2);
    let root = PathBuf::from(".");

    match config.command {
        Command::Check { file } => {
            compile_in_session(render_config, root, file.clone(), &mut |session| {
                driver::type_check_book(session, &PathBuf::from(file.clone()))
            });
        }
        Command::ToHVM { file } => {
            compile_in_session(render_config, root, file.clone(), &mut |session| {
                driver::compile_book_to_hvm(session, &PathBuf::from(file.clone()))
            })
            .map(|res| {
                println!("{}", res);
                res
            });
        }
        Command::Run { file } => {
            compile_in_session(render_config, root, file.clone(), &mut |session| {
                driver::compile_book_to_hvm(session, &PathBuf::from(file.clone()))
            })
            .map(|res| {
                println!("{}", driver::execute_file(&res));
                res
            });
        }
        Command::Eval { file } => {
            compile_in_session(render_config, root, file.clone(), &mut |session| {
                driver::erase_book(session, &PathBuf::from(file.clone()), &["Main".to_string()])
            })
            .map(|res| {
                println!("{}", driver::eval_in_checker(&res));
                res
            });
        }
        Command::Show { file } => {
            compile_in_session(render_config, root, file.clone(), &mut |session| {
                driver::to_book(session, &PathBuf::from(file.clone()))
            })
            .map(|res| {
                print!("{}", res);
                res
            });
        }
        Command::ToKindCore { file } => {
            compile_in_session(render_config, root, file.clone(), &mut |session| {
                driver::desugar_book(session, &PathBuf::from(file.clone()))
            })
            .map(|res| {
                print!("{}", res);
                res
            });
        }
        Command::GenChecker { file } => {
            compile_in_session(render_config, root, file.clone(), &mut |session| {
                driver::check_erasure_book(session, &PathBuf::from(file.clone()))
            })
            .map(|res| {
                print!("{}", driver::generate_checker(&res));
                res
            });
        }
        Command::ToKDL {
            file: _,
            namespace: _,
        } => todo!(),
        Command::Watch { file: _ } => todo!(),
        Command::Repl => todo!(),
    }
}
