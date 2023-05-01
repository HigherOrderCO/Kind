use kind2;
use clap::Parser;

pub fn main() {
    match kind2::run_cli(kind2::Cli::parse()) {
        Ok(_) => std::process::exit(0),
        Err(_) => std::process::exit(1),
    }
}
