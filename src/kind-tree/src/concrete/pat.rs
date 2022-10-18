use std::fmt::{Display, Error, Formatter};

use kind_span::Range;

use crate::symbol::Ident;

// Really useful thin layer of ident.

#[derive(Clone, Debug, Hash)]
pub struct PatIdent(pub Ident);

#[derive(Clone, Debug, Hash)]
pub enum PatKind {
    /// Name of a variable
    Var(PatIdent),
    /// Application of a constructor
    App(Ident, Vec<Box<Pat>>),
    /// Hole
    Num(u64),
    /// Pair
    Pair(Box<Pat>, Box<Pat>),
    /// List
    List(Vec<Pat>),
    /// Str
    Str(String),
    /// Wildcard
    Hole,
}

#[derive(Clone, Debug, Hash)]
pub struct Pat {
    pub data: PatKind,
    pub range: Range,
}

impl Display for Pat {
    fn fmt(&self, f: &mut Formatter<'_>) -> Result<(), Error> {
        use PatKind::*;
        match &self.data {
            Var(name) => write!(f, "{}", name.0),
            App(head, spine) => write!(
                f,
                "({}{})",
                head,
                spine.iter().map(|x| format!(" {}", x)).collect::<String>()
            ),
            List(vec) => write!(
                f,
                "[{}]",
                vec.iter()
                    .map(|x| format!("{}", x))
                    .collect::<Vec<String>>()
                    .join(" ")
            ),
            Str(str) => write!(f, "\"{}\"", str),
            Num(num) => write!(f, "{}", num),
            Pair(fst, snd) => write!(f, "({}, {})", fst, snd),
            Hole => write!(f, "_"),
        }
    }
}
