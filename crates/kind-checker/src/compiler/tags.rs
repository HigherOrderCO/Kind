///! This module describes tags for internal use
/// during compilation

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
    NUMU60,
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
            TermTag::Var => write!(f, "Apps.Kind.Term.var"),
            TermTag::All => write!(f, "Apps.Kind.Term.all"),
            TermTag::Lambda => write!(f, "Apps.Kind.Term.lam"),
            TermTag::App => write!(f, "Apps.Kind.Term.app"),
            TermTag::Fun(n) => write!(f, "Apps.Kind.Term.fn{}", n),
            TermTag::Ctr(n) => write!(f, "Apps.Kind.Term.ct{}", n),
            TermTag::Let => write!(f, "Apps.Kind.Term.let"),
            TermTag::Ann => write!(f, "Apps.Kind.Term.ann"),
            TermTag::Sub => write!(f, "Apps.Kind.Term.sub"),
            TermTag::Typ => write!(f, "Apps.Kind.Term.typ"),
            TermTag::U60 => write!(f, "Apps.Kind.Term.U60"),
            TermTag::NUMU60 => write!(f, "Apps.Kind.Term.u60"),
            TermTag::Binary => write!(f, "Apps.Kind.Term.op2"),
            TermTag::Hole => write!(f, "Apps.Kind.Term.hol"),
            TermTag::Hlp => write!(f, "Apps.Kind.Term.hlp"),
            TermTag::HoasF(name) => write!(f, "F${}", name),
            TermTag::HoasQ(name) => write!(f, "Q${}", name),
        }
    }
}

impl fmt::Display for EvalTag {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            EvalTag::Op => write!(f, "Apps.Kind.Term.eval_op"),
            EvalTag::App => write!(f, "Apps.Kind.Term.eval_app"),
            EvalTag::Let => write!(f, "Apps.Kind.Term.eval_let"),
            EvalTag::Ann => write!(f, "Apps.Kind.Term.eval_ann"),
            EvalTag::Sub => write!(f, "Apps.Kind.Term.eval_sub"),
        }
    }
}

/// Translates the operator to the tag that is used internally
/// by the checker.
pub fn operator_to_constructor<'a>(operator: Operator) -> &'a str {
    match operator {
        Operator::Add => "Apps.Kind.Operator.add",
        Operator::Sub => "Apps.Kind.Operator.sub",
        Operator::Mul => "Apps.Kind.Operator.mul",
        Operator::Div => "Apps.Kind.Operator.div",
        Operator::Mod => "Apps.Kind.Operator.mod",
        Operator::And => "Apps.Kind.Operator.and",
        Operator::Xor => "Apps.Kind.Operator.xor",
        Operator::Shl => "Apps.Kind.Operator.shl",
        Operator::Shr => "Apps.Kind.Operator.shr",
        Operator::Ltn => "Apps.Kind.Operator.ltn",
        Operator::Lte => "Apps.Kind.Operator.lte",
        Operator::Eql => "Apps.Kind.Operator.eql",
        Operator::Gte => "Apps.Kind.Operator.gte",
        Operator::Gtn => "Apps.Kind.Operator.gtn",
        Operator::Neq => "Apps.Kind.Operator.neq",
        Operator::Or => "Apps.Kind.Operator.or",
    }
}
