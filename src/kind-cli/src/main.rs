use clap::Parser;
use kind_cli::{run_cli, Cli};

pub fn main() {
    run_cli(Cli::parse())
}