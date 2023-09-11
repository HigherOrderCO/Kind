use clap::{Parser, Subcommand};
use kind_project::error::ProjectError;
use kind_project::{init_project, ProjectConfig, PROJECT_CONFIG_FILE_NAME};
use std::path::{Path, PathBuf};

#[derive(Parser, Debug)]
struct CliArgs {
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

    #[command(subcommand)]
    pub command: Command,
}

// TODO: Think of a better way to interface the 2 applciations

#[derive(Subcommand, Debug)]
enum Command {
    #[clap(aliases = &["i"])]
    Init { name: String },

    /// Checks the application
    #[clap(aliases = &["c"])]
    Check {
        #[arg(short, long)]
        coverage: bool,
    },

    /// Evaluates the application on Kind2
    #[clap(aliases = &["er"])]
    Eval,

    #[clap(aliases = &["k"])]
    ToKindCore,

    #[clap(aliases = &["e"])]
    Erase,

    /// Runs the application on the HVM
    #[clap(aliases = &["r"])]
    Run,

    /// Generates a checker (.hvm) for a file
    #[clap(aliases = &["gc"])]
    GenChecker {
        #[arg(short, long)]
        coverage: bool,
    },

    /// Stringifies Main and all its dependencies
    #[clap(aliases = &["s"])]
    Show,

    /// Compiles the application to Kindelia (.kdl)
    #[clap(aliases = &["kdl"])]
    ToKDL {
        /// If given, a namespace that goes before each compiled name. Can be at most 10 charaters long.
        #[clap(long, aliases = &["ns"])]
        namespace: Option<String>,
    },

    /// Compiles the application to HVM (.hvm)
    #[clap(aliases = &["hvm"])]
    ToHVM,
}

fn run_cli(args: CliArgs) -> anyhow::Result<()> {
    let root = kind_project::search_project_config_file()?;
    match &args.command {
        Command::Init { name } => {
            if let Some(root) = root {
                Err(ProjectError::AlreadyInProject { root }.into())
            } else {
                init_project(PathBuf::from("."), name.clone())
            }
        }
        Command::Erase => {
            // if let Some(root) = root {
            //     let cfg_path = root.join(Path::new(PROJECT_CONFIG_FILE_NAME));
            //     let cfg_data = String::from_utf8(std::fs::read(cfg_path)?)?;
            //     let project_cfg: ProjectConfig = toml::from_str(&cfg_data)?;
            //     let src_root = root.join(Path::new(&project_cfg.name));
            //     let kind_cli = args.as_kind_cli(src_root)?;
            //     kind2::run_cli(kind_cli)
            // } else {
            //     Err(ProjectError::NotInProject.into())
            // }
            todo!()
        }
        Command::Check { coverage } => {
            todo!()
        }
        Command::Eval => {
            todo!()
        }
        Command::ToKindCore => {
            todo!()
        }
        Command::Run => {
            todo!()
        }
        Command::GenChecker { coverage } => {
            todo!()
        }
        Command::Show => {
            todo!()
        }
        Command::ToKDL { namespace } => {
            todo!()
        }
        Command::ToHVM => {
            todo!()
        }
    }
}

pub fn main() {
    let args = CliArgs::parse();
    match run_cli(args) {
        Ok(()) => std::process::exit(0),
        Err(_) => std::process::exit(1),
    }
}
