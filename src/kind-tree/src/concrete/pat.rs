use std::fmt::{Display, Error, Formatter};

use kind_span::Span;

use crate::symbol::Ident;

#[derive(Clone, Debug)]
pub enum PatKind {
    /// Name of a variable
    Var(Ident),
    // Application of a constructor
    App(Ident, Vec<Box<Pat>>),
    // Hole
    Num(u64),
    // Pair
    Pair(Box<Pat>, Box<Pat>),
    // List
    List(Vec<Pat>),
    // Str
    Str(String),
    Hole,
}

#[derive(Clone, Debug)]
pub struct Pat {
    pub data: PatKind,
    pub span: Span,
}

impl Display for Pat {
    fn fmt(&self, f: &mut Formatter<'_>) -> Result<(), Error> {
        use PatKind::*;
        match &self.data {
            Var(name) => write!(f, "{}", name),
            App(head, spine) => write!(f, "({}{})", head, spine.iter().map(|x| format!(" {}", x)).collect::<String>()),
            List(vec) => write!(f, "[{}]", vec.iter().map(|x| format!("{}", x)).collect::<Vec<String>>().join(" ")),
            Str(str) => write!(f, "\"{}\"", str),
            Num(num) => write!(f, "{}", num),
            Pair(fst, snd) => write!(f, "({}, {})", fst, snd),
            Hole => write!(f, "_"),
        }
    }
}
