use super::CodeBlock;
use super::{Classic, Renderable, Res};
use crate::data::*;
use crate::report::code::{count_width, group_markers, LineGuide, Spaces};
use crate::report::code::Point;
use crate::RenderConfig;
use crate::report::group_marker_lines;

use pathdiff::diff_paths;
use std::fmt::Write;
use std::path::PathBuf;
use yansi::Paint;

fn colorize_code<T: Write + Sized>(
    markers: &mut [&(Point, Point, &Marker)],
    code_line: &str,
    modify: &dyn Fn(&str) -> String,
    fmt: &mut T,
) -> std::fmt::Result {
    markers.sort_by(|x, y| x.0.column.cmp(&y.0.column));
    let mut start = 0;

    for marker in markers {
        if start < marker.0.column {
            write!(fmt, "{}", modify(&code_line[start..marker.0.column]))?;
            start = marker.0.column;
        }

        let end = if marker.0.line == marker.1.line {
            marker.1.column
        } else {
            code_line.len()
        };

        if start < end {
            let colorizer = &marker.2.color.colorizer();
            write!(fmt, "{}", colorizer(&code_line[start..end]).bold())?;
            start = end;
        }
    }

    if start < code_line.len() {
        write!(fmt, "{}", modify(&code_line[start..code_line.len()]))?;
    }

    writeln!(fmt)?;
    Ok(())
}

fn mark_inlined<T: Write + Sized>(
    prefix: &str,
    code: &str,
    config: &RenderConfig,
    inline_markers: &mut [&(Point, Point, &Marker)],
    fmt: &mut T,
) -> std::fmt::Result {
    inline_markers.sort_by(|x, y| x.0.column.cmp(&y.0.column));
    let mut start = 0;

    write!(
        fmt,
        "{:>5} {} {}",
        "",
        paint_line(config.chars.vbar),
        prefix
    )?;

    for marker in inline_markers.iter_mut() {
        if start < marker.0.column {
            let Spaces { width, tabs } = count_width(&code[start..marker.0.column]);
            write!(fmt, "{:pad$}{}", "", "\t".repeat(tabs), pad = width)?;
            start = marker.0.column;
        }
        if start < marker.1.column {
            let Spaces { width, tabs } = count_width(&code[start..marker.1.column]);
            let colorizer = marker.2.color.colorizer();
            write!(fmt, "{}", colorizer(config.chars.bxline.to_string()))?;
            write!(
                fmt,
                "{}",
                colorizer(
                    config
                        .chars
                        .hbar
                        .to_string()
                        .repeat((width + tabs).saturating_sub(1))
                )
            )?;
            start = marker.1.column;
        }
    }
    writeln!(fmt)?;

    // Pretty print the marker
    for i in 0..inline_markers.len() {
        write!(
            fmt,
            "{:>5} {} {}",
            "",
            paint_line(config.chars.vbar),
            prefix
        )?;
        let mut start = 0;
        for j in 0..(inline_markers.len() - i) {
            let marker = inline_markers[j];
            if start < marker.0.column {
                let Spaces { width, tabs } = count_width(&code[start..marker.0.column]);
                write!(fmt, "{:pad$}{}", "", "\t".repeat(tabs), pad = width)?;
                start = marker.0.column;
            }
            if start < marker.1.column {
                let colorizer = marker.2.color.colorizer();
                if j == (inline_markers.len() - i).saturating_sub(1) {
                    write!(
                        fmt,
                        "{}",
                        colorizer(format!("{}{}", config.chars.trline, marker.2.text))
                    )?;
                } else {
                    write!(fmt, "{}", colorizer(config.chars.vbar.to_string()))?;
                }
                start += 1;
            }
        }
        writeln!(fmt)?;
    }
    Ok(())
}

fn paint_line<T>(data: T) -> Paint<T> {
    Paint::new(data).fg(yansi::Color::Cyan).dimmed()
}

impl Color {
    fn colorizer<T>(&self) -> &dyn Fn(T) -> Paint<T> {
        match self {
            Color::Fst => &|str| yansi::Paint::red(str).bold(),
            Color::Snd => &|str| yansi::Paint::blue(str).bold(),
            Color::Thr => &|str| yansi::Paint::green(str).bold(),
            Color::For => &|str| yansi::Paint::yellow(str).bold(),
            Color::Fft => &|str| yansi::Paint::cyan(str).bold(),
        }
    }

    fn colorize<T>(&self, data: T) -> Paint<T> {
        (self.colorizer())(data)
    }
}

impl Renderable<Classic> for Severity {
    fn render<U: Write, C: FileCache>(&self, fmt: &mut U, _: &C, _: &RenderConfig) -> Res {
        use Severity::*;

        let painted = match self {
            Error => Paint::new(" ERROR ").bg(yansi::Color::Red).bold(),
            Warning => Paint::new(" WARN ").bg(yansi::Color::Yellow).bold(),
            Info => Paint::new(" INFO ").bg(yansi::Color::Blue).bold(),
        };

        write!(fmt, " {} ", painted)
    }
}

impl<'a> Renderable<Classic> for Header<'a> {
    fn render<U: Write, C: FileCache>(&self, fmt: &mut U, cache: &C, config: &RenderConfig) -> Res {
        Renderable::<Classic>::render(self.severity, fmt, cache, config)?;
        fmt.write_str(&Paint::new(&self.title).bold().to_string())?;
        fmt.write_char('\n')
    }
}

impl Renderable<Classic> for Subtitle {
    fn render<U: Write, C: FileCache>(&self, fmt: &mut U, cache: &C, config: &RenderConfig) -> Res {
        match self {
            Subtitle::Normal(color, phr) | Subtitle::Field(color, phr) => {
                let bullet = color.colorize(config.chars.bullet);
                writeln!(fmt, "{:>5} {} {}", "", bullet, Paint::new(phr))
            }
            Subtitle::Bold(color, phr) => {
                let bullet = color.colorize(config.chars.bullet);
                writeln!(fmt, "{:>5} {} {}", "", bullet, Paint::new(phr).bold())
            }
            Subtitle::Phrase(color, words) => {
                let bullet = color.colorize(config.chars.bullet);
                write!(fmt, "{:>5} {} ", "", bullet)?;
                Renderable::<Classic>::render(words, fmt, cache, config)?;
                writeln!(fmt)
            }
            Subtitle::LineBreak => {
                writeln!(fmt)
            }
        }
    }
}

impl<'a> Renderable<Classic> for Word {
    fn render<U: Write, C: FileCache>(&self, fmt: &mut U, _: &C, _: &RenderConfig) -> Res {
        match self {
            Word::Normal(str) => write!(fmt, "{} ", Paint::new(str)),
            Word::Dimmed(str) => write!(fmt, "{} ", Paint::new(str).dimmed()),
            Word::White(str) => write!(fmt, "{} ", Paint::new(str).bold()),
            Word::Painted(color, str) => write!(fmt, "{} ", color.colorize(str)),
        }
    }
}

impl<'a> Renderable<Classic> for Subtitles<'a> {
    fn render<U: Write, C: FileCache>(&self, fmt: &mut U, cache: &C, config: &RenderConfig) -> Res {
        if !self.0.is_empty() {
            writeln!(fmt)?;
        }

        Renderable::<Classic>::render(self.0, fmt, cache, config)
    }
}

impl<'a> Renderable<Classic> for CodeBlock<'a> {
    fn render<U: Write, C: FileCache>(&self, fmt: &mut U, _: &C, config: &RenderConfig) -> Res {
        let guide = LineGuide::get(self.code);
        let point = guide.find(self.markers.0[0].position.start);

        let chars = config.chars;

        // Header of the code block

        let bars = chars.hbar.to_string().repeat(2);
        let file = self.path.to_str().unwrap();
        let header = format!("{:>5} {}{}[{}:{}]", "", chars.brline, bars, file, point);

        writeln!(fmt, "{}", paint_line(header))?;

        if self.markers.0.iter().all(|x| x.no_code) {
            return Ok(());
        }

        writeln!(fmt, "{:>5} {}", "", paint_line(chars.vbar))?;

        let (lines_set, mut by_line, multi_line) = group_marker_lines(&guide, self.markers);

        let code_lines: Vec<&'a str> = self.code.lines().collect();

        let mut lines: Vec<usize> = lines_set
            .into_iter()
            .filter(|x| *x < code_lines.len())
            .collect();

        lines.sort();

        for i in 0..lines.len() {
            let line = lines[i];
            let mut prefix = "   ".to_string();
            let mut empty_vec = Vec::new();
            let row = by_line.get_mut(&line).unwrap_or(&mut empty_vec);

            let mut inline_markers: Vec<&(Point, Point, &Marker)> =
                row.iter().filter(|x| x.0.line == x.1.line).collect();

            let mut current = None;

            for marker in &multi_line {
                if marker.0.line == line {
                    writeln!(
                        fmt,
                        "{:>5} {}  {} ",
                        "",
                        paint_line(config.chars.vbar),
                        marker.2.color.colorize(config.chars.brline)
                    )?;
                }
                if line >= marker.0.line && line <= marker.1.line {
                    prefix = format!(" {} ", marker.2.color.colorize(config.chars.vbar));
                    current = Some(marker);
                    break;
                }
            }

            write!(
                fmt,
                "{:>5} {} {}",
                line + 1,
                paint_line(config.chars.vbar),
                prefix,
            )?;

            let modify: Box<dyn Fn(&str) -> String> = if let Some(marker) = current {
                prefix = format!(" {} ", marker.2.color.colorize(config.chars.vbar));
                Box::new(|str: &str| marker.2.color.colorize(str).to_string())
            } else {
                Box::new(|str: &str| str.to_string())
            };

            if !inline_markers.is_empty() {
                colorize_code(&mut inline_markers, code_lines[line], &modify, fmt)?;
                mark_inlined(&prefix, code_lines[line], config, &mut inline_markers, fmt)?;
                if by_line.contains_key(&(line + 1)) {
                    writeln!(
                        fmt,
                        "{:>5} {} {} ",
                        "",
                        paint_line(config.chars.dbar),
                        prefix
                    )?;
                }
            } else {
                writeln!(fmt, "{}", modify(code_lines[line]))?;
            }

            if let Some(marker) = current {
                if marker.1.line == line {
                    let col = marker.2.color.colorizer();
                    writeln!(
                        fmt,
                        "{:>5} {} {} ",
                        "",
                        paint_line(config.chars.dbar),
                        prefix
                    )?;
                    writeln!(
                        fmt,
                        "{:>5} {} {} ",
                        "",
                        paint_line(config.chars.dbar),
                        col(format!(" {} {}", config.chars.trline, marker.2.text))
                    )?;
                    prefix = "   ".to_string();
                }
            }

            if i < lines.len() - 1 && lines[i + 1] - line > 1 {
                writeln!(
                    fmt,
                    "{:>5} {} {} ",
                    "",
                    paint_line(config.chars.dbar),
                    prefix
                )?;
            }
        }

        Ok(())
    }
}

impl Renderable<Classic> for Log {
    fn render<U: Write, C: FileCache>(&self, fmt: &mut U, _: &C, _: &RenderConfig) -> Res {
        match self {
            Log::Checking(file) => {
                writeln!(
                    fmt,
                    "  {} {}",
                    Paint::new(" CHECKING ").bg(yansi::Color::Green).bold(),
                    file
                )
            }
            Log::Compiled(duration) => {
                writeln!(
                    fmt,
                    "  {} All relevant terms compiled. took {:.2}s",
                    Paint::new(" COMPILED ").bg(yansi::Color::Green).bold(),
                    duration.as_secs_f32()
                )
            }
            Log::Checked(duration) => {
                writeln!(
                    fmt,
                    "   {} All terms checked. took {:.2}s",
                    Paint::new(" CHECKED ").bg(yansi::Color::Green).bold(),
                    duration.as_secs_f32()
                )
            }
            Log::Failed(duration) => {
                writeln!(
                    fmt,
                    "    {} Took {}s",
                    Paint::new(" FAILED ").bg(yansi::Color::Red).bold(),
                    duration.as_secs()
                )
            }
            Log::Rewrites(u64) => {
                writeln!(
                    fmt,
                    "     {} Rewrites: {}",
                    Paint::new(" STATS ").bg(yansi::Color::Green).bold(),
                    u64
                )
            }
        }
    }
}

impl<'a> Renderable<Classic> for Markers<'a> {
    fn render<U: Write, C: FileCache>(&self, fmt: &mut U, cache: &C, config: &RenderConfig) -> Res {
        let groups = group_markers(&self.0);
        let is_empty = groups.is_empty();
        let current = PathBuf::from(".").canonicalize().unwrap();

        for (ctx, markers) in groups.iter() {
            writeln!(fmt)?;

            let (file, code) = cache.fetch(*ctx).unwrap();
            let path = diff_paths(&file.clone(), current.clone()).unwrap_or(file);

            let block = CodeBlock {
                code,
                path: &path,
                markers,
            };

            Renderable::<Classic>::render(&block, fmt, cache, config)?;
        }

        if !is_empty {
            writeln!(fmt)?;
        }

        Ok(())
    }
}

impl<'a> Renderable<Classic> for Hints<'a> {
    fn render<U: Write, C: FileCache>(&self, fmt: &mut U, _: &C, _: &RenderConfig) -> Res {
        for hint in self.0 {
            writeln!(
                fmt,
                "{:>5} {} {}",
                "",
                Paint::new("Hint:").fg(yansi::Color::Cyan).bold(),
                Paint::new(hint).fg(yansi::Color::Cyan)
            )?;
        }

        writeln!(fmt)
    }
}

impl Renderable<Classic> for DiagnosticFrame {
    fn render<U: Write, C: FileCache>(&self, fmt: &mut U, cache: &C, config: &RenderConfig) -> Res {
        write!(fmt, " ")?;

        Renderable::<Classic>::render(&self.header(), fmt, cache, config)?;
        Renderable::<Classic>::render(&self.subtitles(), fmt, cache, config)?;
        Renderable::<Classic>::render(&self.markers(), fmt, cache, config)?;
        Renderable::<Classic>::render(&self.hints(), fmt, cache, config)?;

        Ok(())
    }
}