//! Renders error messages.

// The code is not so good ..
// pretty printers are always a disaster to write. expect
// that in the future i can rewrite it in a better way.

use std::fmt::{Display, Write};
use std::path::{Path, PathBuf};

use std::str;

use fxhash::{FxHashMap, FxHashSet};
use kind_span::{Pos, SyntaxCtxIndex};
use unicode_width::UnicodeWidthStr;
use yansi::Paint;

use crate::{data::*, RenderConfig};

type SortedMarkers = FxHashMap<SyntaxCtxIndex, Vec<Marker>>;

#[derive(Debug, Clone)]
struct Point {
    pub line: usize,
    pub column: usize,
}

pub trait FileCache {
    fn fetch(&self, ctx: SyntaxCtxIndex) -> Option<(PathBuf, &String)>;
}

impl Display for Point {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}:{}", self.line + 1, self.column + 1)
    }
}

fn group_markers(markers: &[Marker]) -> SortedMarkers {
    let mut file_group = SortedMarkers::default();
    for marker in markers {
        let group = file_group
            .entry(marker.position.ctx)
            .or_insert_with(Vec::new);
        group.push(marker.clone())
    }
    for group in file_group.values_mut() {
        group.sort_by(|x, y| x.position.start.cmp(&y.position.end));
    }
    file_group
}

fn get_code_line_guide(code: &str) -> Vec<usize> {
    let mut guide = Vec::new();
    let mut size = 0;
    for chr in code.chars() {
        size += chr.len_utf8();
        if chr == '\n' {
            guide.push(size);
        }
    }
    guide.push(code.len());
    guide
}

fn find_in_line_guide(pos: Pos, guide: &Vec<usize>) -> Point {
    for i in 0..guide.len() {
        if guide[i] > pos.index as usize {
            return Point {
                line: i,
                column: pos.index as usize - (if i == 0 { 0 } else { guide[i - 1] }),
            };
        }
    }
    let line = guide.len() - 1;
    Point {
        line,
        column: pos.index as usize - (if line == 0 { 0 } else { guide[line - 1] }),
    }
}

// Get color
fn get_colorizer<T>(color: &Color) -> &dyn Fn(T) -> Paint<T> {
    match color {
        Color::Fst => &|str| yansi::Paint::red(str).bold(),
        Color::Snd => &|str| yansi::Paint::blue(str).bold(),
        Color::Thr => &|str| yansi::Paint::green(str).bold(),
        Color::For => &|str| yansi::Paint::yellow(str).bold(),
        Color::Fft => &|str| yansi::Paint::cyan(str).bold(),
    }
}

// TODO: Remove common indentation.
// TODO: Prioritize inline marcations.
fn colorize_code<'a, T: Write + Sized>(
    markers: &mut [&(Point, Point, &Marker)],
    code_line: &'a str,
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
            let colorizer = get_colorizer(&marker.2.color);
            write!(fmt, "{}", colorizer(&code_line[start..end]).bold())?;
            start = end;
        }
    }

    if start < code_line.len() {
        write!(fmt, "{}", &code_line[start..code_line.len()])?;
    }
    writeln!(fmt)?;
    Ok(())
}

fn paint_line<T>(data: T) -> Paint<T> {
    Paint::new(data).fg(yansi::Color::Cyan).dimmed()
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
            let pad = UnicodeWidthStr::width(&code[start..marker.0.column]);
            write!(fmt, "{:pad$}", "", pad = pad)?;
            start = marker.0.column;
        }
        if start < marker.1.column {
            let pad = UnicodeWidthStr::width(&code[start..marker.1.column]);
            let colorizer = get_colorizer(&marker.2.color);
            write!(fmt, "{}", colorizer(config.chars.bxline.to_string()))?;
            write!(
                fmt,
                "{}",
                colorizer(config.chars.hbar.to_string().repeat(pad.saturating_sub(1)))
            )?;
            start = marker.1.column;
        }
    }
    writeln!(fmt)?;
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
                let pad = UnicodeWidthStr::width(&code[start..marker.0.column]);
                write!(fmt, "{:pad$}", "", pad = pad)?;
                start = marker.0.column;
            }
            if start < marker.1.column {
                let colorizer = get_colorizer(&marker.2.color);
                if j == (inline_markers.len() - i).saturating_sub(1) {
                    write!(
                        fmt,
                        "{}",
                        colorizer(format!("{} {}", config.chars.trline, marker.2.text))
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

fn write_code_block<'a, T: Write + Sized>(
    file_name: &Path,
    config: &RenderConfig,
    markers: &[Marker],
    group_code: &'a str,
    fmt: &mut T,
) -> std::fmt::Result {
    let guide = get_code_line_guide(group_code);

    let point = find_in_line_guide(markers[0].position.start, &guide);

    let no_code = markers.iter().all(|x| x.no_code);

    let header = format!(
        "{:>5} {}{}[{}:{}]",
        "",
        if no_code {
            config.chars.hbar
        } else {
            config.chars.brline
        },
        config.chars.hbar.to_string().repeat(2),
        file_name.to_str().unwrap(),
        point
    );

    writeln!(fmt, "{}", paint_line(header))?;

    if no_code {
        return Ok(());
    }

    writeln!(fmt, "{:>5} {}", "", paint_line(config.chars.vbar))?;

    let mut lines_set = FxHashSet::default();

    let mut markers_by_line: FxHashMap<usize, Vec<(Point, Point, &Marker)>> = FxHashMap::default();

    let mut multi_line_markers: Vec<(Point, Point, &Marker)> = Vec::new();

    for marker in markers {
        let start = find_in_line_guide(marker.position.start, &guide);
        let end = find_in_line_guide(marker.position.end, &guide);

        if let Some(row) = markers_by_line.get_mut(&start.line) {
            row.push((start.clone(), end.clone(), marker))
        } else {
            markers_by_line.insert(start.line, vec![(start.clone(), end.clone(), marker)]);
        }

        if end.line != start.line {
            multi_line_markers.push((start.clone(), end.clone(), marker));
        } else if marker.main {
            // Just to make errors a little bit better
            let start = start.line.saturating_sub(1);
            let end = if start + 2 >= guide.len() {
                guide.len() - 1
            } else {
                start + 2
            };
            for i in start..=end {
                lines_set.insert(i);
            }
        }

        if end.line - start.line <= 3 {
            for i in start.line..=end.line {
                lines_set.insert(i);
            }
        } else {
            lines_set.insert(start.line);
            lines_set.insert(end.line);
        }
    }

    let code_lines: Vec<&'a str> = group_code.lines().collect();
    let mut lines = lines_set
        .iter()
        .filter(|x| **x < code_lines.len())
        .collect::<Vec<&usize>>();
    lines.sort();

    for i in 0..lines.len() {
        let line = lines[i];
        let mut prefix = "   ".to_string();
        let mut empty_vec = Vec::new();
        let row = markers_by_line.get_mut(line).unwrap_or(&mut empty_vec);
        let mut inline_markers: Vec<&(Point, Point, &Marker)> =
            row.iter().filter(|x| x.0.line == x.1.line).collect();
        let mut current = None;

        for marker in &multi_line_markers {
            if marker.0.line == *line {
                writeln!(
                    fmt,
                    "{:>5} {}  {} ",
                    "",
                    paint_line(config.chars.vbar),
                    get_colorizer(&marker.2.color)(config.chars.brline)
                )?;
            }
            if *line >= marker.0.line && *line <= marker.1.line {
                prefix = format!(" {} ", get_colorizer(&marker.2.color)(config.chars.vbar));
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

        if let Some(marker) = current {
            prefix = format!(" {} ", get_colorizer(&marker.2.color)(config.chars.vbar));
        }

        if !inline_markers.is_empty() {
            colorize_code(&mut inline_markers, code_lines[*line], fmt)?;
            mark_inlined(&prefix, code_lines[*line], config, &mut inline_markers, fmt)?;
            if markers_by_line.contains_key(&(line + 1)) {
                writeln!(
                    fmt,
                    "{:>5} {} {} ",
                    "",
                    paint_line(config.chars.dbar),
                    prefix
                )?;
            }
        } else {
            writeln!(fmt, "{}", code_lines[*line])?;
        }

        if let Some(marker) = current {
            if marker.1.line == *line {
                let col = get_colorizer(&marker.2.color);
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

fn render_tag<T: Write + Sized>(severity: &Severity, fmt: &mut T) -> std::fmt::Result {
    write!(
        fmt,
        " {} ",
        match severity {
            Severity::Error => Paint::new(" ERROR ").bg(yansi::Color::Red).bold(),
            Severity::Warning => Paint::new(" WARN ").bg(yansi::Color::Yellow).bold(),
            Severity::Info => Paint::new(" INFO ").bg(yansi::Color::Blue).bold(),
        }
    )
}

pub trait Report {
    fn render<T: Write + Sized, C: FileCache>(
        &self,
        cache: &C,
        config: &RenderConfig,
        fmt: &mut T,
    ) -> std::fmt::Result;
}

impl Report for Box<dyn Diagnostic> {
    fn render<T: Write + Sized, C: FileCache>(
        &self,
        cache: &C,
        config: &RenderConfig,
        fmt: &mut T,
    ) -> std::fmt::Result {
        write!(fmt, " ")?;

        let frame = self.to_diagnostic_frame();

        render_tag(&frame.severity, fmt)?;
        writeln!(fmt, "{}", Paint::new(&frame.title).bold())?;

        if !frame.subtitles.is_empty() {
            writeln!(fmt)?;
        }

        for subtitle in &frame.subtitles {
            match subtitle {
                Subtitle::Normal(color, phr) => {
                    let colorizer = get_colorizer(color);
                    writeln!(
                        fmt,
                        "{:>5} {} {}",
                        "",
                        colorizer(config.chars.bullet),
                        Paint::new(phr)
                    )?;
                }
                Subtitle::Bold(color, phr) => {
                    let colorizer = get_colorizer(color);
                    writeln!(
                        fmt,
                        "{:>5} {} {}",
                        "",
                        colorizer(config.chars.bullet),
                        Paint::new(phr).bold()
                    )?;
                }
                Subtitle::Phrase(color, words) => {
                    let colorizer = get_colorizer(color);
                    write!(fmt, "{:>5} {} ", "", colorizer(config.chars.bullet))?;
                    for word in words {
                        match word {
                            Word::Normal(str) => write!(fmt, "{} ", Paint::new(str))?,
                            Word::Dimmed(str) => write!(fmt, "{} ", Paint::new(str).dimmed())?,
                            Word::White(str) => write!(fmt, "{} ", Paint::new(str).bold())?,
                            Word::Painted(color, str) => {
                                let colorizer = get_colorizer(color);
                                write!(fmt, "{} ", colorizer(str))?
                            }
                        }
                    }
                    writeln!(fmt)?;
                }
                Subtitle::LineBreak => {
                    writeln!(fmt)?;
                }
            }
        }

        let groups = group_markers(&frame.positions);
        let is_empty = groups.is_empty();

        for (ctx, group) in groups {
            writeln!(fmt)?;
            let (file, code) = cache.fetch(ctx).unwrap();
            let diff =file.clone();
            write_code_block(&diff, config, &group, code, fmt)?;
        }

        if !is_empty {
            writeln!(fmt)?;
        }

        for hint in &frame.hints {
            writeln!(
                fmt,
                "{:>5} {} {}",
                "",
                Paint::new("Hint:").fg(yansi::Color::Cyan).bold(),
                Paint::new(hint).fg(yansi::Color::Cyan)
            )?;
        }

        writeln!(fmt)?;

        Ok(())
    }
}

impl Report for Log {
    fn render<T: Write + Sized, C: FileCache>(
        &self,
        _cache: &C,
        _config: &RenderConfig,
        fmt: &mut T,
    ) -> std::fmt::Result {
        match self {
            Log::Checking(file) => {
                writeln!(
                    fmt,
                    "  {} {}",
                    Paint::new(" CHECKING ").bg(yansi::Color::Green).bold(),
                    file
                )
            }
            Log::Checked(duration) => {
                writeln!(
                    fmt,
                    "   {} took {}s",
                    Paint::new(" CHECKED ").bg(yansi::Color::Green).bold(),
                    duration.as_secs()
                )
            }
            Log::Failed(duration) => {
                writeln!(
                    fmt,
                    "    {} took {}s",
                    Paint::new(" FAILED ").bg(yansi::Color::Red).bold(),
                    duration.as_secs()
                )
            }
        }
    }
}
