#![feature(panic_info_message)]

use std::path::PathBuf;
use std::{fmt, io};

use clap::{Parser, Subcommand};
use kind_driver::session::Session;

use kind_report::data::{FileCache, Log};
use kind_report::RenderConfig;
use std::panic;

use kind_driver as driver;

use kind_report::report::{Classic, Mode, Report};

pub type CO = Classic;

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

    /// How much concurrency in HVM
    #[arg(long)]
    pub tids: Option<usize>,

    /// Prints all of the functions and their evaluation
    #[arg(short, long)]
    pub trace: bool,

    /// Only ascii characters in error messages
    #[arg(short, long)]
    pub ascii: bool,

    /// Compact error messages
    #[arg(long)]
    pub compact: bool,

    /// Show values in error messages
    #[arg(long)]
    pub hide_vals: bool,

    /// Show only the first error message
    #[arg(long)]
    pub hide_deps: bool,

    #[arg(long)]
    pub get_deps: bool,

    /// Entrypoint of the file that makes the erasure checker
    /// not remove the entry.
    #[arg(short, long)]
    entrypoint: Option<String>,

    #[arg(short, long, value_name = "FILE")]
    pub root: Option<PathBuf>,

    #[command(subcommand)]
    pub command: Command,
}

#[derive(Subcommand, Debug)]
pub enum Command {
    /// Check a file
    #[clap(aliases = &["c"])]
    Check {
        #[arg(short, long)]
        coverage: bool,

        file: String,
    },

    /// Evaluates Main on Kind2
    #[clap(aliases = &["er"])]
    Eval { file: String },

    #[clap(aliases = &["k"])]
    ToKindCore { file: String },

    #[clap(aliases = &["e"])]
    Erase { file: String },

    /// Runs Main on the HVM
    #[clap(aliases = &["r"])]
    Run { file: String },

    /// Generates a checker (.hvm) for a file
    #[clap(aliases = &["gc"])]
    GenChecker {
        #[arg(short, long)]
        coverage: bool,

        file: String,
    },

    /// Stringifies a file
    #[clap(aliases = &["s"])]
    Show { file: String },

    /// Gets direct dependencies of a file
    #[clap(aliases = &["gd"])]
    GetDeps { file: String },

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
    E: Report + ?Sized,
{
    Report::render(
        err,
        &mut ToWriteFmt(std::io::stderr()),
        session,
        render_config,
    )
    .unwrap();
}

pub fn run_in_session<T>(
    render_config: &RenderConfig,
    root: PathBuf,
    file: String,
    compiled: bool,
    silent: bool,
    action: &mut dyn FnMut(&mut Session) -> anyhow::Result<T>,
) -> anyhow::Result<T> {
    let log =
        |session: &Session, report: &dyn Report| render_to_stderr(render_config, session, report);
    let sil = |_: &Session, _: &dyn Report| ();

    driver::run_in_session(
        render_config,
        root,
        file,
        compiled,
        action,
        if silent { &sil } else { &log },
    )
}

pub fn run_cli(config: Cli) -> anyhow::Result<()> {
    kind_report::check_if_colors_are_supported(config.no_color);

    let mode = if config.compact {
        Mode::Compact
    } else {
        Mode::Classic
    };

    let render_config = kind_report::check_if_utf8_is_supported(
        config.ascii,
        2,
        config.hide_vals,
        mode,
        config.hide_deps,
        config.get_deps,
    );

    let root = config.root.unwrap_or_else(|| PathBuf::from("."));

    let mut entrypoints = vec!["Main".to_string()];

    if let Some(res) = &config.entrypoint {
        entrypoints.push(res.clone())
    }

    match config.command {
        Command::Check { file, coverage } => {
            run_in_session(
                &render_config,
                root,
                file.clone(),
                false,
                false,
                &mut |session| {
                    let (_, rewrites) = driver::type_check_book(
                        session,
                        &PathBuf::from(file.clone()),
                        entrypoints.clone(),
                        config.tids,
                        coverage,
                    )?;

                    render_to_stderr(&render_config, session, &Log::Rewrites(rewrites));

                    Ok(())
                },
            )?;
        }
        Command::ToHVM { file } => {
            let result = run_in_session(
                &render_config,
                root,
                file.clone(),
                true,
                false,
                &mut |session| {
                    let book = driver::erase_book(
                        session,
                        &PathBuf::from(file.clone()),
                        entrypoints.clone(),
                    )?;
                    Ok(driver::compile_book_to_hvm(book, config.trace))
                },
            )?;

            println!("{}", result);
        }
        Command::Run { file } => {
            let res = run_in_session(
                &render_config,
                root,
                file.clone(),
                true,
                false,
                &mut |session| {
                    let path = PathBuf::from(file.clone());
                    let book = driver::erase_book(session, &path, entrypoints.clone())?;
                    driver::check_main_entry(session, &book)?;
                    let book = driver::compile_book_to_hvm(book, config.trace);
                    let (result, rewrites) = driver::execute_file(&book.to_string(), config.tids)?;

                    render_to_stderr(&render_config, session, &Log::Rewrites(rewrites));

                    Ok(result)
                },
            )?;
            println!("{}", res);
        }
        Command::Show { file } => {
            run_in_session(
                &render_config,
                root,
                file.clone(),
                true,
                false,
                &mut |session| driver::to_book(session, &PathBuf::from(file.clone())),
            )
            .map(|res| {
                print!("{}", res);
                res
            })?;
        }
        Command::ToKindCore { file } => {
            let res = run_in_session(
                &render_config,
                root,
                file.clone(),
                true,
                false,
                &mut |session| driver::desugar_book(session, &PathBuf::from(file.clone())),
            )?;
            print!("{}", res);
        }
        Command::Erase { file } => {
            let res = run_in_session(
                &render_config,
                root,
                file.clone(),
                true,
                false,
                &mut |session| {
                    driver::erase_book(session, &PathBuf::from(file.clone()), entrypoints.clone())
                },
            )?;
            print!("{}", res);
        }
        Command::GenChecker { file, coverage } => {
            let res = run_in_session(
                &render_config,
                root,
                file.clone(),
                true,
                false,
                &mut |session| driver::check_erasure_book(session, &PathBuf::from(file.clone())),
            )?;
            print!("{}", driver::generate_checker(&res, coverage));
        }
        Command::Eval { file } => {
            let res = run_in_session(
                &render_config,
                root,
                file.clone(),
                true,
                false,
                &mut |session| {
                    let book = driver::desugar_book(session, &PathBuf::from(file.clone()))?;
                    driver::check_main_desugared_entry(session, &book)?;
                    let (res, rewrites) = driver::eval_in_checker(&book);

                    render_to_stderr(&render_config, session, &Log::Rewrites(rewrites));

                    Ok(res)
                },
            )?;
            println!("{}", res);
        }
        Command::ToKDL { file, namespace } => {
            let res = run_in_session(
                &render_config,
                root,
                file.clone(),
                true,
                false,
                &mut |session| {
                    driver::compile_book_to_kdl(
                        &PathBuf::from(file.clone()),
                        session,
                        &namespace.clone().unwrap_or("".to_string()),
                        entrypoints.clone(),
                    )
                },
            )?;
            println!("{}", res);
        }
        Command::GetDeps { file } => {
            let res = run_in_session(
                &render_config,
                root,
                file.clone(),
                true,
                true,
                &mut |session| {
                    Ok(driver::get_unbound_top_levels_in_file(
                        session,
                        &PathBuf::from(file.clone()),
                    ))
                },
            )?;

            if let Some(res) = res {
                println!("{}", res.join(" "));
            }
        }
    }

    Ok(())
}

pub fn main() {
    panic::set_hook(Box::new(|e| {
        println!(
            "\n[Error]: internal compiler error '{:?}' at {}",
            e.message().unwrap(),
            e.location().unwrap()
        );
        println!("Please submit a full report about this error at: https://github.com/HigherOrderCO/Kind/issues/new");
        println!("It would help us a lot :)\n");
    }));

    match run_cli(Cli::parse()) {
        Ok(_) => std::process::exit(0),
        Err(_) => std::process::exit(1),
    }
}
