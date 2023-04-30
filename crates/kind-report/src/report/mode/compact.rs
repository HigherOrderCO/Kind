use std::{fmt::Write, path::PathBuf};

use pathdiff::diff_paths;

use crate::data::*;
use crate::{report::*, RenderConfig};

use super::{CodeBlock, Compact, Renderable, Res};

fn colorize_code<T: Write + Sized>(
    markers: &mut [&(Point, Point, &Marker)],
    code_line: &str,
    fmt: &mut T,
) -> std::fmt::Result {
    markers.sort_by(|x, y| x.0.column.cmp(&y.0.column));
    let mut start = 0;

    for marker in markers {
        if start < marker.0.column {
            write!(fmt, "{}", &code_line[start..marker.0.column])?;
            start = marker.0.column;
        }

        let end = if marker.0.line == marker.1.line {
            marker.1.column
        } else {
            code_line.len()
        };

        if start < end {
            write!(fmt, "{{{{{}}}}}", &code_line[start..end])?;
            start = end;
        }
    }

    if start < code_line.len() {
        write!(fmt, "{}}}}}", &code_line[start..code_line.len()])?;
    }

    writeln!(fmt)?;
    Ok(())
}

impl<'a> Renderable<Compact> for Word {
    fn render<U: Write, C: FileCache>(&self, fmt: &mut U, _: &C, _: &RenderConfig) -> Res {
        match self {
            Word::Normal(str) => write!(fmt, "{} ", str),
            Word::Dimmed(str) => write!(fmt, "{} ", str),
            Word::White(str) => write!(fmt, "{} ", str),
            Word::Painted(_, str) => write!(fmt, "{} ", str),
        }
    }
}

impl Renderable<Compact> for Subtitle {
    fn render<U: Write, C: FileCache>(&self, fmt: &mut U, cache: &C, config: &RenderConfig) -> Res {
        match self {
            Subtitle::Field(_, phr) => writeln!(fmt, "{}", phr.to_lowercase()),
            Subtitle::Normal(_, phr) => writeln!(fmt, "- {}", phr),
            Subtitle::Bold(_, phr) => writeln!(fmt, "- {}", phr),
            Subtitle::Phrase(_, words) => {
                write!(fmt, "- ")?;
                Renderable::<Compact>::render(words, fmt, cache, config)?;
                writeln!(fmt)
            }
            Subtitle::LineBreak => Ok(()),
        }
    }
}

impl<'a> Renderable<Compact> for Subtitles<'a> {
    fn render<U: Write, C: FileCache>(&self, fmt: &mut U, cache: &C, config: &RenderConfig) -> Res {
        if !self.0.is_empty() {
            writeln!(fmt)?;
        }

        Renderable::<Compact>::render(self.0, fmt, cache, config)
    }
}

impl Renderable<Compact> for Severity {
    fn render<U: Write, C: FileCache>(&self, fmt: &mut U, _: &C, _: &RenderConfig) -> Res {
        use Severity::*;

        let painted = match self {
            Error => "error:",
            Warning => "warn:",
            Info => "info:",
        };

        write!(fmt, " {} ", painted)
    }
}

impl<'a> Renderable<Compact> for Header<'a> {
    fn render<U: Write, C: FileCache>(&self, fmt: &mut U, _: &C, _: &RenderConfig) -> Res {
        fmt.write_str(&self.title.to_lowercase())
    }
}

impl<'a> Renderable<Compact> for CodeBlock<'a> {
    fn render<U: Write, C: FileCache>(&self, fmt: &mut U, _: &C, _8778: &RenderConfig) -> Res {
        writeln!(fmt, "location")?;
        let guide = LineGuide::get(self.code);

        let (lines_set, mut by_line, _) = group_marker_lines(&guide, self.markers);

        let code_lines: Vec<&'a str> = self.code.lines().collect();

        let mut lines: Vec<usize> = lines_set
            .into_iter()
            .filter(|x| *x < code_lines.len())
            .collect();

        lines.sort();

        for line in lines {
            let mut empty_vec = Vec::new();
            let row = by_line.get_mut(&line).unwrap_or(&mut empty_vec);

            let mut inline_markers: Vec<&(Point, Point, &Marker)> =
                row.iter().filter(|x| x.0.line == x.1.line).collect();

            if !inline_markers.is_empty() {
                colorize_code(&mut inline_markers, code_lines[line], fmt)?;
            } else {
                writeln!(fmt, "{}", code_lines[line])?;
            }
        }

        Ok(())
    }
}

impl<'a> Renderable<Compact> for Markers<'a> {
    fn render<U: Write, C: FileCache>(&self, fmt: &mut U, cache: &C, config: &RenderConfig) -> Res {
        let groups = group_markers(&self.0);
        let current = PathBuf::from(".").canonicalize().unwrap();

        for (ctx, markers) in groups.iter() {
            let (file, code) = cache.fetch(*ctx).unwrap();
            let path = diff_paths(&file.clone(), current.clone()).unwrap_or(file);

            let block = CodeBlock {
                code,
                path: &path,
                markers,
            };

            Renderable::<Compact>::render(&block, fmt, cache, config)?;
        }

        Ok(())
    }
}

impl Renderable<Compact> for DiagnosticFrame {
    fn render<U: std::fmt::Write, C: crate::data::FileCache>(
        &self,
        fmt: &mut U,
        cache: &C,
        config: &crate::RenderConfig,
    ) -> super::Res {
        Renderable::<Compact>::render(&self.header(), fmt, cache, config)?;
        Renderable::<Compact>::render(&self.subtitles(), fmt, cache, config)?;
        Renderable::<Compact>::render(&self.markers(), fmt, cache, config)?;

        Ok(())
    }
}

impl Renderable<Compact> for Log {
    fn render<U: Write, C: FileCache>(&self, fmt: &mut U, _: &C, _: &RenderConfig) -> Res {
        match self {
            Log::Compiled(_) => writeln!(fmt, "compiled"),
            Log::Checked(_) => writeln!(fmt, "checked"),
            _ => Ok(()),
        }
    }
}
