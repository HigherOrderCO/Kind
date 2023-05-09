use std::{fmt::Write, path::Path};

use super::code::FileMarkers;
use crate::{
    data::{Diagnostic, DiagnosticFrame, FileCache, Log},
    RenderConfig,
};

pub mod classic;
pub mod compact;

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

/// The enum of all of the modes so we can choose
#[derive(Debug, Clone, Copy)]
pub enum Mode {
    Classic,
    Compact,
}

// Utilities

/// Utility for easier renders
pub(crate) struct CodeBlock<'a> {
    pub code: &'a str,
    pub path: &'a Path,
    pub markers: &'a FileMarkers,
}

/// A type class for renderable error reports and messages. It's useful
/// to change easily things without problems.
pub trait Renderable<T> {
    fn render(&self, fmt: &mut dyn Write, cache: &dyn FileCache, config: &RenderConfig) -> Res;
}

impl<'a, T, E> Renderable<T> for Vec<E>
where
    E: Renderable<T>,
{
    fn render(&self, fmt: &mut dyn Write, cache: &dyn FileCache, config: &RenderConfig) -> Res {
        for elem in self {
            elem.render(fmt, cache, config)?;
        }
        Ok(())
    }
}

impl<T> Renderable<T> for Box<dyn Diagnostic>
where
    DiagnosticFrame: Renderable<T>,
{
    fn render(&self, fmt: &mut dyn Write, cache: &dyn FileCache, config: &RenderConfig) -> Res {
        Renderable::<T>::render(&self.to_diagnostic_frame(config), fmt, cache, config)
    }
}

pub trait Report
where
    Self: Renderable<Classic> + Renderable<Compact>,
{
    fn render(&self, fmt: &mut dyn Write, cache: &dyn FileCache, config: &RenderConfig) -> Res {
        match config.mode {
            Mode::Classic => Renderable::<Classic>::render(self, fmt, cache, config),
            Mode::Compact => Renderable::<Compact>::render(self, fmt, cache, config),
        }
    }
}

impl Report for Box<dyn Diagnostic> {}
impl Report for Log {}
