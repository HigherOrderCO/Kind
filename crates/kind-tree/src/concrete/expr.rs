//! This module describes a abstract syntax tree
//! that is almost like a concrete tree. It helps when it
//! we have to statically analyse the tree in order to generate
//! better error messages.

use super::pat::PatIdent;
use crate::symbol::{Ident, QualifiedIdent};
use crate::Operator;

use kind_span::{Locatable, Range};
use std::fmt::{Display, Error, Formatter};

/// A binding express the positional or named argument of
/// a constructor or function.
#[derive(Clone, Debug, Hash, PartialEq, Eq)]
pub enum Binding {
    Positional(Box<Expr>),
    Named(Range, Ident, Box<Expr>),
}

/// Vector of bindings
pub type Spine = Vec<Binding>;

/// A binding that is used inside applications.
#[derive(Clone, Debug, Hash, PartialEq, Eq)]
pub struct AppBinding {
    pub data: Box<Expr>,
    pub erased: bool,
}

impl AppBinding {
    pub fn explicit(data: Box<Expr>) -> AppBinding {
        AppBinding {
            data,
            erased: false,
        }
    }
}

/// A case binding is a field or a rename of some field
/// inside a match expression.
#[derive(Clone, Debug, Hash, PartialEq, Eq)]
pub enum CaseBinding {
    Field(Ident),
    Renamed(Ident, Ident),
}

/// A match case with a constructor that will match the
/// strutinizer, bindings to the names of each arguments and 
/// a right-hand side value. The ignore_rest flag useful to just 
/// fill all of the case bindings that are not used with a default name.
#[derive(Clone, Debug, Hash, PartialEq, Eq)]
pub struct Case {
    pub constructor: Ident,
    pub bindings: Vec<CaseBinding>,
    pub value: Box<Expr>,
    pub ignore_rest: Option<Range>,
}

/// A match block that will be desugared
/// into an eliminator of a datatype.
#[derive(Clone, Debug, Hash, PartialEq, Eq)]
pub struct Match {
    pub typ: QualifiedIdent,
    pub scrutinizer: Box<Expr>,
    pub cases: Vec<Case>,
    pub motive: Option<Box<Expr>>,
}

/// Substitution
#[derive(Clone, Debug, Hash, PartialEq, Eq)]
pub struct Substitution {
    pub name: Ident,
    pub redx: usize,
    pub indx: usize,
    pub expr: Box<Expr>,
}

#[derive(Clone, Debug, Hash, PartialEq, Eq)]
pub enum Literal {
    /// The universe of types (e.g. Type)
    Type,
    /// The help operator that prints the context
    /// and the goal (e.g. ?)
    Help(Ident),
    /// The type of 60 bits numberss (e.g. 2 : U60)
    NumType(crate::NumType),
    // Char literal
    Char(char),
    /// A number literal of 60 bits (e.g 32132)
    Number(crate::Number),
    // A String literal
    String(String),
}

/// A destruct of a single constructor. It's a flat destruct
/// and just translates into a eliminator for records.
#[derive(Clone, Debug, Hash, PartialEq, Eq)]
pub enum Destruct {
    Destruct(Range, QualifiedIdent, Vec<CaseBinding>, Option<Range>),
    Ident(Ident),
}

#[derive(Clone, Debug, Hash, PartialEq, Eq)]
pub enum SttmKind {
    Expr(Box<Expr>, Box<Sttm>),
    Ask(Destruct, Box<Expr>, Box<Sttm>),
    Let(Destruct, Box<Expr>, Box<Sttm>),
    Return(Box<Expr>),
    RetExpr(Box<Expr>),
}

/// Structure of the insides of the `do` notation. It
/// describes the idea of `sequence` inside a monad
/// each monadic action contains a `next` element that is
/// desugared into a 'monadic bind'.
#[derive(Clone, Debug, Hash, PartialEq, Eq)]
pub struct Sttm {
    pub data: SttmKind,
    pub range: Range,
}

#[derive(Clone, Debug, Hash, PartialEq, Eq)]
pub enum ExprKind {
    /// Name of a variable
    Var { name: Ident },
    /// Name of a function/constructor
    Constr { name: QualifiedIdent, args: Spine },
    /// The dependent function space (e.g. (x : Int) -> y)
    All {
        param: Option<Ident>,
        typ: Box<Expr>,
        body: Box<Expr>,
        erased: bool,
    },
    /// The dependent product space (e.g. [x : Int] -> y)
    Sigma {
        param: Option<Ident>,
        fst: Box<Expr>,
        snd: Box<Expr>,
    },
    /// A anonymous function that receives one argument
    Lambda {
        param: Ident,
        typ: Option<Box<Expr>>,
        body: Box<Expr>,
        erased: bool,
    },
    /// Application of a expression to a spine of expressions
    App {
        fun: Box<Expr>,
        args: Vec<AppBinding>,
    },
    /// Declaration of a local variable
    Let {
        name: Destruct,
        val: Box<Expr>,
        next: Box<Expr>,
    },
    /// Type ascription (x : y)
    Ann { val: Box<Expr>, typ: Box<Expr> },
    /// Literal
    Lit { lit: Literal },
    /// Binary operation (e.g. 2 + 3)
    Binary {
        op: Operator,
        fst: Box<Expr>,
        snd: Box<Expr>,
    },
    /// A expression open to unification (e.g. _)
    Hole,
    /// Do notation
    Do {
        typ: QualifiedIdent,
        sttm: Box<Sttm>,
    },
    /// If else statement
    If {
        cond: Box<Expr>,
        then_: Box<Expr>,
        else_: Box<Expr>,
    },
    /// If else statement
    Pair { fst: Box<Expr>, snd: Box<Expr> },
    /// Array
    List { args: Vec<Expr> },
    /// Substituion
    Subst(Substitution),
    /// A match block that will be translated
    /// into an eliminator of a datatype.
    Match(Box<Match>),
}

/// Describes a single expression inside Kind2.
#[derive(Clone, Debug, Hash, PartialEq, Eq)]
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
            ExprKind::All {
                param,
                typ,
                body,
                erased,
            } => {
                let tilde = if *erased { "~" } else { "" };
                match param {
                    None => format!("{}{} -> {}", tilde, typ, body.traverse_pi_types()),
                    Some(binder) => format!(
                        "{}({} : {}) -> {}",
                        tilde,
                        binder,
                        typ,
                        body.traverse_pi_types()
                    ),
                }
            }
            ExprKind::Sigma { param, fst, snd } => match param {
                None => format!("{} -> {}", fst, snd.traverse_pi_types()),
                Some(binder) => format!("[{} : {}] -> {}", binder, fst, snd.traverse_pi_types()),
            },
            _ => format!("{}", self),
        }
    }
}

impl Locatable for Binding {
    fn locate(&self) -> kind_span::Range {
        match self {
            Binding::Positional(e) => e.locate(),
            Binding::Named(s, _, _) => *s,
        }
    }
}

impl Locatable for Expr {
    fn locate(&self) -> Range {
        self.range
    }
}

impl Locatable for Sttm {
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
            Destruct::Destruct(range, _, _, _) => *range,
            Destruct::Ident(i) => i.locate(),
        }
    }
}

impl Display for Literal {
    fn fmt(&self, f: &mut Formatter<'_>) -> Result<(), Error> {
        match self {
            Literal::Help(s) => write!(f, "?{}", s),
            Literal::Type => write!(f, "Type"),
            Literal::NumType(crate::NumType::U60) => write!(f, "U60"),
            Literal::NumType(crate::NumType::U120) => write!(f, "U120"),
            Literal::Char(c) => write!(f, "'{}'", c),
            Literal::Number(crate::Number::U60(numb)) => write!(f, "{}", numb),
            Literal::Number(crate::Number::U120(numb)) => write!(f, "{}u120", numb),
            Literal::String(str) => {
                write!(f, "{:?}", str)
            }
        }
    }
}

impl Display for Destruct {
    fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
        match self {
            Destruct::Destruct(_range, i, bindings, ignore) => {
                write!(f, "{}", i)?;
                for binding in bindings {
                    write!(f, " {}", binding)?;
                }
                if ignore.is_some() {
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
            SttmKind::Ask(name, block, next) => {
                write!(f, "ask {} = {};\n {}", name, block, next)
            }
            SttmKind::Let(name, block, next) => {
                write!(f, "let {} = {};\n {}", name, block, next)
            }
            SttmKind::Expr(expr, next) => {
                write!(f, "{};\n{}", expr, next)
            }
            SttmKind::Return(ret) => {
                writeln!(f, "return {}", ret)
            }
            SttmKind::RetExpr(ret) => {
                writeln!(f, "{}", ret)
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
            CaseBinding::Field(n) => write!(f, "{}", n),
            CaseBinding::Renamed(m, n) => write!(f, "({} = {})", m, n),
        }
    }
}

impl Display for Case {
    fn fmt(&self, f: &mut Formatter<'_>) -> Result<(), Error> {
        write!(f, "{}", self.constructor)?;
        for bind in &self.bindings {
            write!(f, " {}", bind)?
        }
        if self.ignore_rest.is_some() {
            write!(f, " ..")?;
        }
        write!(f, " => {}", self.value)
    }
}

impl Display for Match {
    fn fmt(&self, f: &mut Formatter<'_>) -> Result<(), Error> {
        write!(f, "match {} {}", self.typ, self.scrutinizer)?;

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

impl Display for AppBinding {
    fn fmt(&self, f: &mut Formatter<'_>) -> Result<(), Error> {
        if self.erased {
            write!(f, "-({})", self.data)
        } else {
            write!(f, "{}", self.data)
        }
    }
}

impl Display for Expr {
    fn fmt(&self, f: &mut Formatter<'_>) -> Result<(), Error> {
        use ExprKind::*;
        match &self.data {
            Do { typ, sttm } => write!(f, "(do {} {{{}}})", typ, sttm),
            All { .. } => write!(f, "({})", self.traverse_pi_types()),
            Sigma { .. } => write!(f, "({})", self.traverse_pi_types()),
            Lit { lit } => write!(f, "{}", lit),
            Var { name } => write!(f, "{}", name),
            Constr { name, args } => write!(
                f,
                "({}{})",
                name,
                args.iter().map(|x| format!(" {}", x)).collect::<String>()
            ),
            Lambda {
                param,
                typ: None,
                body,
                erased: false,
            } => write!(f, "({} => {})", param, body),
            Lambda {
                param,
                typ: Some(typ),
                body,
                erased: false,
            } => {
                write!(f, "(({} : {}) => {})", param, typ, body)
            }
            Lambda {
                param,
                typ: None,
                body,
                erased: true,
            } => write!(f, "(-({}) => {})", param, body),
            Lambda {
                param,
                typ: Some(typ),
                body,
                erased: true,
            } => {
                write!(f, "({{{} : {}}} => {})", param, typ, body)
            }
            Pair { fst, snd } => write!(f, "($ {} {})", fst, snd),
            App { fun, args } => write!(
                f,
                "({}{})",
                fun,
                args.iter().map(|x| format!(" {}", x)).collect::<String>()
            ),
            Let { name, val, next } => write!(f, "(let {} = {}; {})", name, val, next),
            If { cond, then_, else_ } => {
                write!(f, "(if {} {{{}}} else {{{}}})", cond, then_, else_)
            }
            List { args } => write!(
                f,
                "[{}]",
                args.iter()
                    .map(|x| format!("{}", x))
                    .collect::<Vec<String>>()
                    .join(" ")
            ),
            Ann { val: name, typ } => write!(f, "({} :: {})", name, typ),
            Binary { op, fst, snd } => write!(f, "({} {} {})", op, fst, snd),
            Match(matcher) => write!(f, "({})", matcher),
            Subst(subst) => write!(f, "({})", subst),
            Hole => write!(f, "_"),
        }
    }
}
