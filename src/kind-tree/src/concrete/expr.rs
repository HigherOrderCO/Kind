/// This module describes a CONCRETE SYNTAX TREE
/// without parenthesis. It helps when it comes to
/// a static analysis of the tree with the syntax sugars
/// and it makes it easier to split phases.
use kind_span::{Locatable, Range};
use std::fmt::{Display, Error, Formatter};

use crate::symbol::Ident;

use super::pat::PatIdent;

/// Enum of binary operators.
#[derive(Copy, Clone, Debug)]
pub enum Operator {
    Add,
    Sub,
    Mul,
    Div,
    Mod,
    And,
    Or,
    Xor,
    Shl,
    Shr,
    Ltn,
    Lte,
    Eql,
    Gte,
    Gtn,
    Neq,
}

#[derive(Clone, Debug)]
pub enum Binding {
    Positional(Box<Expr>),
    Named(Range, Ident, Box<Expr>),
}

pub type Spine = Vec<Binding>;

#[derive(Clone, Debug)]
pub enum CaseBinding {
    Field(PatIdent),
    Renamed(Ident, PatIdent),
}

#[derive(Clone, Debug)]
pub struct Case {
    pub constructor: Ident,
    pub bindings: Vec<CaseBinding>,
    pub value: Box<Expr>,
    pub ignore_rest: bool,
}

/// A match block that will be translated
/// into an eliminator of a datatype.
#[derive(Clone, Debug)]
pub struct Match {
    pub tipo: Ident,
    pub scrutinizer: Box<Expr>,
    pub cases: Vec<Case>,
    pub motive: Option<Box<Expr>>,
}

/// Substitution
#[derive(Clone, Debug)]
pub struct Substitution {
    pub name: Ident,
    pub redx: u64,
    pub indx: u64,
    pub expr: Box<Expr>,
}

#[derive(Clone, Debug)]
pub enum Literal {
    /// The universe of types (e.g. Type)
    Type,
    /// The help operator that prints the context
    /// and the goal (e.g. ?)
    Help,
    /// The type of 60 bits numberss (e.g. 2 : U60)
    U60,
    // Char literal
    Char(char),
    /// A number literal of 60 bits (e.g 32132)
    Number(u64),
    // A String literal
    String(String),
}

#[derive(Clone, Debug)]
pub enum Destruct {
    Destruct(Ident, Vec<CaseBinding>, bool),
    Ident(Ident),
}

#[derive(Clone, Debug)]
pub enum SttmKind {
    Expr(Box<Expr>, Box<Sttm>),
    Ask(Option<Ident>, Box<Expr>, Box<Sttm>),
    Let(Destruct, Box<Expr>, Box<Sttm>),
    Return(Box<Expr>),
}

#[derive(Clone, Debug)]
pub struct Sttm {
    pub data: SttmKind,
    pub range: Range,
}

#[derive(Clone, Debug)]
pub enum ExprKind {
    /// Name of a variable
    Var(Ident),
    /// Name of a function/constructor
    Constr(Ident),
    /// The dependent function space (e.g. (x : Int) -> y)
    All(Option<Ident>, Box<Expr>, Box<Expr>),
    /// The dependent product space (e.g. [x : Int] -> y)
    Sigma(Option<Ident>, Box<Expr>, Box<Expr>),
    /// A anonymous function that receives one argument
    Lambda(Ident, Option<Box<Expr>>, Box<Expr>),
    /// Application of a expression to a spine of expressions
    App(Box<Expr>, Spine),
    /// Declaration of a local variable
    Let(Destruct, Box<Expr>, Box<Expr>),
    /// Type ascription (x : y)
    Ann(Box<Expr>, Box<Expr>),
    /// Literal
    Lit(Literal),
    /// Binary operation (e.g. 2 + 3)
    Binary(Operator, Box<Expr>, Box<Expr>),
    /// A expression open to unification (e.g. _)
    Hole,
    /// Substituion
    Subst(Substitution),
    /// A match block that will be translated
    /// into an eliminator of a datatype.
    Match(Box<Match>),
    /// Do notation
    Do(Ident, Box<Sttm>),
    /// If else statement
    If(Box<Expr>, Box<Expr>, Box<Expr>),
    /// If else statement
    Pair(Box<Expr>, Box<Expr>),
    /// Array
    List(Vec<Expr>),
    /// Help
    Help(Ident),
}

#[derive(Clone, Debug)]
pub struct Expr {
    pub data: ExprKind,
    pub range: Range,
}

impl Display for Operator {
    fn fmt(&self, f: &mut Formatter<'_>) -> Result<(), Error> {
        use Operator::*;

        match self {
            Add => write!(f, "+"),
            Sub => write!(f, "-"),
            Mul => write!(f, "*"),
            Div => write!(f, "/"),
            Mod => write!(f, "%"),
            And => write!(f, "&"),
            Or => write!(f, "|"),
            Xor => write!(f, "^"),
            Shl => write!(f, "<<"),
            Shr => write!(f, ">>"),
            Ltn => write!(f, "<"),
            Lte => write!(f, "<="),
            Eql => write!(f, "=="),
            Gte => write!(f, ">="),
            Gtn => write!(f, ">"),
            Neq => write!(f, "!="),
        }
    }
}

impl Expr {
    pub fn traverse_pi_types(&self) -> String {
        match &self.data {
            ExprKind::All(binder, typ, body) => match binder {
                None => format!("{} -> {}", typ, body.traverse_pi_types()),
                Some(binder) => format!("({} : {}) -> {}", binder, typ, body.traverse_pi_types()),
            },
            ExprKind::Sigma(binder, typ, body) => match binder {
                None => format!("{} -> {}", typ, body.traverse_pi_types()),
                Some(binder) => format!("[{} : {}] -> {}", binder, typ, body.traverse_pi_types()),
            },
            _ => format!("{}", self),
        }
    }
}

impl Locatable for Binding {
    fn locate(&self) -> kind_span::Range {
        match self {
            Binding::Positional(e) => e.locate(),
            Binding::Named(s, _, _) => s.clone(),
        }
    }
}

impl Locatable for Expr {
    fn locate(&self) -> Range {
        self.range
    }
}

impl Locatable for Ident {
    fn locate(&self) -> Range {
        self.range
    }
}

impl Locatable for PatIdent {
    fn locate(&self) -> Range {
        self.0.range
    }
}

impl Locatable for CaseBinding {
    fn locate(&self) -> Range {
        match self {
            CaseBinding::Field(i) => i.locate(),
            CaseBinding::Renamed(i, renamed) => i.locate().mix(renamed.locate()),
        }
    }
}

impl Locatable for Destruct {
    fn locate(&self) -> Range {
        match self {
            Destruct::Destruct(s, bindings, _) => s
                .locate()
                .mix(bindings.get(0).map(|x| x.locate()).unwrap_or(s.locate())),
            Destruct::Ident(i) => i.locate(),
        }
    }
}

impl Display for Literal {
    fn fmt(&self, f: &mut Formatter<'_>) -> Result<(), Error> {
        match self {
            Literal::Help => write!(f, "?"),
            Literal::Type => write!(f, "Type"),
            Literal::U60 => write!(f, "U60"),
            Literal::Char(c) => write!(f, "'{}'", c),
            Literal::Number(numb) => write!(f, "{}", numb),
            Literal::String(str) => write!(f, "\"{}\"", str),
        }
    }
}

impl Display for Destruct {
    fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
        match self {
            Destruct::Destruct(i, bindings, ignore) => {
                write!(f, "{}", i)?;
                for binding in bindings {
                    write!(f, " {}", binding)?;
                }
                if *ignore {
                    write!(f, " ..")?;
                }
                Ok(())
            }
            Destruct::Ident(ident) => write!(f, "{}", ident),
        }
    }
}

impl Display for SttmKind {
    fn fmt(&self, f: &mut Formatter<'_>) -> Result<(), Error> {
        match self {
            SttmKind::Ask(Some(name), block, next) => {
                write!(f, "ask {} = {}; {}", name, block, next)
            }
            SttmKind::Let(name, block, next) => {
                write!(f, "let {} = {}; {}", name, block, next)
            }
            SttmKind::Ask(None, block, next) => {
                write!(f, "ask {}; {}", block, next)
            }
            SttmKind::Expr(expr, next) => {
                write!(f, "{};{}", expr, next)
            }
            SttmKind::Return(ret) => {
                write!(f, "return {}", ret)
            }
        }
    }
}

impl Display for Sttm {
    fn fmt(&self, f: &mut Formatter<'_>) -> Result<(), Error> {
        write!(f, "{}", self.data)
    }
}

impl Display for CaseBinding {
    fn fmt(&self, f: &mut Formatter<'_>) -> Result<(), Error> {
        match self {
            CaseBinding::Field(n) => write!(f, "{}", n.0),
            CaseBinding::Renamed(m, n) => write!(f, "({} = {})", m, n.0),
        }
    }
}

impl Display for Case {
    fn fmt(&self, f: &mut Formatter<'_>) -> Result<(), Error> {
        write!(f, "{}", self.constructor)?;
        for bind in &self.bindings {
            write!(f, " {}", bind)?
        }
        if self.ignore_rest {
            write!(f, " ..")?;
        }
        write!(f, " => {}; ", self.value)
    }
}

impl Display for Match {
    fn fmt(&self, f: &mut Formatter<'_>) -> Result<(), Error> {
        write!(f, "match {} {}", self.tipo, self.scrutinizer)?;

        match &self.motive {
            None => Ok(()),
            Some(res) => write!(f, " : {}", res),
        }?;
        write!(f, " {{ ")?;

        for case in &self.cases {
            write!(f, "{}; ", case)?
        }
        write!(f, "}}")
    }
}

impl Display for Substitution {
    fn fmt(&self, f: &mut Formatter<'_>) -> Result<(), Error> {
        write!(f, "## {} / {} {}", self.name, self.redx, self.expr)
    }
}

impl Display for Binding {
    fn fmt(&self, f: &mut Formatter<'_>) -> Result<(), Error> {
        match self {
            Binding::Positional(e) => write!(f, "{}", e),
            Binding::Named(_, i, e) => write!(f, "({} : {})", i, e),
        }
    }
}

impl Display for Expr {
    fn fmt(&self, f: &mut Formatter<'_>) -> Result<(), Error> {
        use ExprKind::*;
        match &self.data {
            Do(id, sttms) => write!(f, "do {} ({})", id, sttms),
            All(_, _, _) => write!(f, "({})", self.traverse_pi_types()),
            Sigma(_, _, _) => write!(f, "({})", self.traverse_pi_types()),
            Lit(lit) => write!(f, "{}", lit),
            Var(name) => write!(f, "{}", name),
            Constr(name) => write!(f, "{}", name),
            Lambda(binder, None, body) => write!(f, "({} => {})", binder, body),
            Lambda(binder, Some(typ), body) => write!(f, "(({} : {}) => {})", binder, typ, body),
            Pair(fst, snd) => write!(f, "($ {} {})", fst, snd),
            App(head, spine) => write!(
                f,
                "({}{})",
                head,
                spine.iter().map(|x| format!(" {}", x)).collect::<String>()
            ),
            Let(name, expr, body) => write!(f, "(let {} = {}; {})", name, expr, body),
            If(cond, if_, else_) => write!(f, "(if {} {{{}}} else {{{}}})", cond, if_, else_),
            List(vec) => write!(
                f,
                "[{}]",
                vec.iter()
                    .map(|x| format!("{}", x))
                    .collect::<Vec<String>>()
                    .join(" ")
            ),
            Ann(expr, typ) => write!(f, "({} : {})", expr, typ),
            Binary(op, expr, typ) => write!(f, "({} {} {})", op, expr, typ),
            Hole => write!(f, "_"),
            Match(matcher) => write!(f, "({})", matcher),
            Subst(subst) => write!(f, "({})", subst),
            Help(name) => write!(f, "?{}", name),
        }
    }
}
