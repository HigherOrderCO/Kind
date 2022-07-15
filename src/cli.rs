pub use clap::{Parser, Subcommand};

#[derive(Parser)]
#[clap(author, version, about, long_about = None)]
#[clap(propagate_version = true)]
pub struct Cli {
  #[clap(subcommand)]
  pub command: Command,
}

#[derive(Subcommand)]
pub enum Command {
  /// Run a file interpreted
  #[clap(aliases = &["r"])]
  Run { file: String, params: Vec<String> },

  /// Check a file
  #[clap(aliases = &["c"])]
  Check { file: String, params: Vec<String> },
}
