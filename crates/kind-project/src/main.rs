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
impl CliArgs {
    fn as_kind_cli(self, root: PathBuf) -> anyhow::Result<kind2::Cli> {
        let CliArgs {
            debug,
            warning,
            no_color,
            tids,
            trace,
            ascii,
            command,
            compact,
            hide_vals,
        } = self;
        let kind_cli = kind2::Cli {
            config: None,
            debug,
            warning,
            no_color,
            tids,
            trace,
            ascii,
            entrypoint: Some("Main".into()),
            command: command.as_kind_command(&root)?,
            root: Some(root),
            compact,
            hide_vals,
        };
        Ok(kind_cli)
    }
}

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

impl Command {
    fn as_kind_command(self, root: &Path) -> anyhow::Result<kind2::Command> {
        // TODO: handle non-utf8 paths properly
        let file: String = root
            .join(Path::new("Main.kind"))
            .to_str()
            .unwrap()
            .to_string();
        let kind_command = match self {
            Command::Init { .. } => unreachable!(),
            Command::Check { coverage } => kind2::Command::Check { coverage, file },
            Command::Eval => kind2::Command::Eval { file },
            Command::ToKindCore => kind2::Command::ToKindCore { file },
            Command::Erase => kind2::Command::Erase { file },
            Command::Run => kind2::Command::Run { file },
            Command::GenChecker { coverage } => kind2::Command::GenChecker { coverage, file },
            Command::Show => kind2::Command::Show { file },
            Command::ToKDL { namespace } => kind2::Command::ToKDL { file, namespace },
            Command::ToHVM => kind2::Command::ToHVM { file },
        };
        Ok(kind_command)
    }
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
        _ => {
            if let Some(root) = root {
                let cfg_path = root.join(Path::new(PROJECT_CONFIG_FILE_NAME));
                let cfg_data = String::from_utf8(std::fs::read(cfg_path)?)?;
                let project_cfg: ProjectConfig = toml::from_str(&cfg_data)?;
                let src_root = root.join(Path::new(&project_cfg.name));
                let kind_cli = args.as_kind_cli(src_root)?;
                kind2::run_cli(kind_cli)
            } else {
                Err(ProjectError::NotInProject.into())
            }
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
