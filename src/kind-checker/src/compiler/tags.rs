use core::fmt;

use kind_tree::Operator;

/// Tags for each one of the terms inside
/// HVM. It's useful to split the code between
/// the representation and the actual name of each
/// node.
#[derive(Debug)]
pub enum TermTag {
    Var,
    All,
    Lambda,
    App,
    Fun(usize),
    Ctr(usize),
    Let,
    Ann,
    Sub,
    Typ,
    U60,
    Num,
    Binary,
    Hole,
    Hlp,

    // HOAS Tags
    HoasF(String),
    HoasQ(String),
}

/// Some of the tags can be directly translated
/// to a function that evaluates them so it's the name
/// of each function.
pub enum EvalTag {
    Op,
    App,
    Let,
    Ann,
    Sub,
}

impl fmt::Display for TermTag {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            TermTag::Var => write!(f, "Kind.Term.var"),
            TermTag::All => write!(f, "Kind.Term.all"),
            TermTag::Lambda => write!(f, "Kind.Term.lam"),
            TermTag::App => write!(f, "Kind.Term.app"),
            TermTag::Fun(n) => write!(f, "Kind.Term.fn{}", n),
            TermTag::Ctr(n) => write!(f, "Kind.Term.ct{}", n),
            TermTag::Let => write!(f, "Kind.Term.let"),
            TermTag::Ann => write!(f, "Kind.Term.ann"),
            TermTag::Sub => write!(f, "Kind.Term.sub"),
            TermTag::Typ => write!(f, "Kind.Term.typ"),
            TermTag::U60 => write!(f, "Kind.Term.u60"),
            TermTag::Num => write!(f, "Kind.Term.num"),
            TermTag::Binary => write!(f, "Kind.Term.op2"),
            TermTag::Hole => write!(f, "Kind.Term.hol"),
            TermTag::Hlp => write!(f, "Kind.Term.hlp"),
            TermTag::HoasF(name) => write!(f, "F${}", name),
            TermTag::HoasQ(name) => write!(f, "Q${}", name),
        }
    }
}

impl fmt::Display for EvalTag {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            EvalTag::Op => write!(f, "Kind.Term.eval_op"),
            EvalTag::App => write!(f, "Kind.Term.eval_app"),
            EvalTag::Let => write!(f, "Kind.Term.eval_let"),
            EvalTag::Ann => write!(f, "Kind.Term.eval_ann"),
            EvalTag::Sub => write!(f, "Kind.Term.eval_sub"),
        }
    }
}

/// Translates the operator to the tag that is used internally
/// by the checker.
pub fn operator_to_constructor<'a>(operator: Operator) -> &'a str {
    match operator {
        Operator::Add => "Kind.Operator.add",
        Operator::Sub => "Kind.Operator.sub",
        Operator::Mul => "Kind.Operator.mul",
        Operator::Div => "Kind.Operator.div",
        Operator::Mod => "Kind.Operator.mod",
        Operator::And => "Kind.Operator.and",
        Operator::Xor => "Kind.Operator.xor",
        Operator::Shl => "Kind.Operator.shl",
        Operator::Shr => "Kind.Operator.shr",
        Operator::Ltn => "Kind.Operator.ltn",
        Operator::Lte => "Kind.Operator.lte",
        Operator::Eql => "Kind.Operator.eql",
        Operator::Gte => "Kind.Operator.gte",
        Operator::Gtn => "Kind.Operator.gtn",
        Operator::Neq => "Kind.Operator.neq",
        Operator::Or => "Kind.Operator.or",
    }
}
