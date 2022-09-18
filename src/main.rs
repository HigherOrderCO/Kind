pub mod log;

pub mod book;

pub mod parser;

pub mod lowering;

use crate::log::init_logger;

fn main() {
    init_logger("").unwrap();
}
