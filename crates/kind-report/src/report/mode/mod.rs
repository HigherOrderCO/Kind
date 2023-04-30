use std::{fmt::Write, path::Path};

use crate::{data::FileCache, RenderConfig};

use super::code::FileMarkers;

pub mod classic;

// Just a type synonym to make it easier to read.
pub type Res = std::fmt::Result;

// -----------------------------------------------------------------
// Some abstract data types based on Haskell. These types are useful
// for setting some modes on the report.
// -----------------------------------------------------------------

/// Classical mode is the default mode for the report. It's made to
/// be easy to read and understand.
pub enum Classic {}

/// Compact mode is made to be more compact and easy to parse by some
/// LLM.
pub enum Compact {}

// Utilities

/// Utility for easier renders
pub(crate) struct CodeBlock<'a> {
    pub code: &'a str,
    pub path: &'a Path,
    pub markers: &'a FileMarkers
}

/// A type class for renderable error reports and messages. It's useful
/// to change easily things without problems.
pub trait Renderable<T> {
    fn render<U: Write, C: FileCache>(&self, fmt: &mut U, cache: &C, config: &RenderConfig) -> Res;
}

impl<'a, T, E> Renderable<T> for Vec<E> where E : Renderable<T> {
    fn render<U: Write, C: FileCache>(&self, fmt: &mut U, cache: &C, config: &RenderConfig) -> Res {
        for elem in self {
            elem.render(fmt, cache, config)?;
        }
        Ok(())
    }
}
