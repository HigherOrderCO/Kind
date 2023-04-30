use fxhash::FxHashMap;
use kind_span::{Pos, SyntaxCtxIndex};
use std::{collections::hash_map::Iter, fmt::Display};
use unicode_width::UnicodeWidthStr;

use crate::data::Marker;

/// The line guide is useful to locate some positions inside the source
/// code by using the index instead of line and column information.
pub struct LineGuide(Vec<usize>);

pub struct FileMarkers(pub Vec<Marker>);

/// This structure contains all markers sorted by lines and column for each
/// one of the files.
pub struct SortedMarkers(FxHashMap<SyntaxCtxIndex, FileMarkers>);

impl SortedMarkers {
    pub fn is_empty(&self) -> bool {
        self.0.is_empty()
    }

    pub fn iter(&self) -> Iter<SyntaxCtxIndex, FileMarkers> {
        self.0.iter()
    }
}

#[derive(Clone, Copy)]
pub struct Point {
    pub line: usize,
    pub column: usize,
}

impl Display for Point {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}:{}", self.line + 1, self.column + 1)
    }
}

pub struct Spaces {
    pub width: usize,
    pub tabs: usize,
}

impl LineGuide {
    pub fn get(code: &str) -> LineGuide {
        let mut guide = Vec::new();
        let mut size = 0;
        for chr in code.chars() {
            size += chr.len_utf8();
            if chr == '\n' {
                guide.push(size);
            }
        }
        guide.push(code.len());
        LineGuide(guide)
    }

    pub fn find(&self, pos: Pos) -> Point {
        for i in 0..self.0.len() {
            if self.0[i] > pos.index as usize {
                return Point {
                    line: i,
                    column: pos.index as usize - (if i == 0 { 0 } else { self.0[i - 1] }),
                };
            }
        }
        let line = self.0.len() - 1;
        Point {
            line,
            column: pos.index as usize - (if line == 0 { 0 } else { self.0[line - 1] }),
        }
    }

    pub fn len(&self) -> usize {
        self.0.len()
    }
}

pub fn count_width(str: &str) -> Spaces {
    Spaces {
        width: UnicodeWidthStr::width(str),
        tabs: str.chars().filter(|x| *x == '\t').count(),
    }
}

pub fn group_markers(markers: &[Marker]) -> SortedMarkers {
    let mut file_group = FxHashMap::default();

    for marker in markers {
        let group = file_group
            .entry(marker.position.ctx)
            .or_insert_with(Vec::new);
        group.push(marker.clone())
    }

    for group in file_group.values_mut() {
        group.sort_by(|x, y| x.position.start.cmp(&y.position.end));
    }

    SortedMarkers(
        file_group
            .into_iter()
            .map(|(x, y)| (x, FileMarkers(y)))
            .collect(),
    )
}
