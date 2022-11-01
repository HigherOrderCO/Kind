use kind_span::{EncodedSpan, Range};
use kind_tree::backend::Term;
use kind_tree::symbol::Ident;
use kind_tree::{desugared, Operator};

use crate::errors::TypeError;
use desugared::Expr;

macro_rules! match_opt {
    ($expr:expr, $pat:pat => $end:expr) => {
        match $expr {
            $pat => Ok($end),
            _ => Err("uur list".to_string()),
        }
    };
}

#[derive(Debug)]
pub struct Context(pub Vec<(String, Box<Expr>, Vec<Box<Expr>>)>);

#[derive(Debug)]
enum Report {
    Succeded,
    Failed(Vec<TypeError>),
}

fn parse_orig(term: &Term) -> Result<Range, String> {
    match_opt!(term, Term::Num { numb } => EncodedSpan(*numb).to_range())
}

fn parse_num(term: &Term) -> Result<u64, String> {
    match_opt!(term, Term::Num { numb } => *numb)
}

fn parse_op(term: &Term) -> Result<Operator, String> {
    match term {
        Term::Ctr { name, args } => match name.as_str() {
            "Kind.Operator.add" => Ok(Operator::Add),
            "Kind.Operator.sub" => Ok(Operator::Sub),
            "Kind.Operator.mul" => Ok(Operator::Mul),
            "Kind.Operator.div" => Ok(Operator::Div),
            "Kind.Operator.mod" => Ok(Operator::Mod),
            "Kind.Operator.and" => Ok(Operator::And),
            "Kind.Operator.or" => Ok(Operator::Or),
            "Kind.Operator.xor" => Ok(Operator::Xor),
            "Kind.Operator.shl" => Ok(Operator::Shl),
            "Kind.Operator.shr" => Ok(Operator::Shr),
            "Kind.Operator.ltn" => Ok(Operator::Ltn),
            "Kind.Operator.lte" => Ok(Operator::Lte),
            "Kind.Operator.eql" => Ok(Operator::Eql),
            "Kind.Operator.gte" => Ok(Operator::Gte),
            "Kind.Operator.gtn" => Ok(Operator::Gtn),
            "Kind.Operator.neq" => Ok(Operator::Neq),
            _ => Err("Cannot recognized operator".to_string()),
        },
        _ => Err("Error parsing operator".to_string()),
    }
}

fn parse_name(term: &Term) -> Result<String, String> {
    match_opt!(*term, Term::Num { numb } => Ident::decode(numb))
}

fn parse_expr(term: &Term) -> Result<Box<desugared::Expr>, String> {
    match term {
        Term::Ctr { name, args } => match name.as_str() {
            "Kind.Term.typ" => Ok(Expr::typ(parse_orig(&args[0])?)),
            "Kind.Term.var" => Ok(Expr::var(Ident::new(
                parse_name(&args[1])?,
                parse_orig(&args[0])?,
            ))),
            "Kind.Term.hol" => Ok(Expr::hole(parse_orig(&args[0])?, parse_num(&args[1])?)),
            "Kind.Term.all" => Ok(Expr::all(
                parse_orig(&args[0])?,
                Ident::generate(&parse_name(&args[1])?),
                parse_expr(&args[2])?,
                parse_expr(&args[3])?,
            )),
            "Kind.Term.lam" => Ok(Expr::lambda(
                parse_orig(&args[0])?,
                Ident::generate(&parse_name(&args[1])?),
                parse_expr(&args[2])?,
            )),
            "Kind.Term.let" => Ok(Expr::let_(
                parse_orig(&args[0])?,
                Ident::generate(&parse_name(&args[1])?),
                parse_expr(&args[2])?,
                parse_expr(&args[3])?,
            )),
            "Kind.Term.ann" => Ok(Expr::ann(
                parse_orig(&args[0])?,
                parse_expr(&args[1])?,
                parse_expr(&args[2])?,
            )),
            "Kind.Term.sub" => Ok(Expr::sub(
                parse_orig(&args[0])?,
                Ident::generate(&parse_name(&args[1])?),
                parse_num(&args[2])? as usize,
                parse_num(&args[3])? as usize,
                parse_expr(&args[4])?,
            )),
            "Kind.Term.app" => Ok(Expr::app(
                parse_orig(&args[0])?,
                parse_expr(&args[1])?,
                vec![parse_expr(&args[2])?],
            )),
            "Kind.Term.ct15" | "Kind.Term.ct16" => {
                let args = match_opt!(*args[1].clone(), Term::Ctr { name: _, args } => args)?;
                Ok(Expr::ctr(
                    parse_orig(&args[0])?,
                    Ident::generate(&parse_name(&args[1])?),
                    args[1..].iter().flat_map(|x| parse_expr(x)).collect(),
                ))
            }
            "Kind.Term.fn15" | "Kind.Term.fn16" => {
                let args = match_opt!(*args[1].clone(), Term::Ctr { name: _, args } => args)?;
                Ok(Expr::fun(
                    parse_orig(&args[0])?,
                    Ident::generate(&parse_name(&args[1])?),
                    args[1..].iter().flat_map(|x| parse_expr(x)).collect(),
                ))
            }
            x if x.starts_with("Kind.Term.ct") => Ok(Expr::ctr(
                parse_orig(&args[0])?,
                Ident::generate(&parse_name(&args[1])?),
                args[1..].iter().flat_map(|x| parse_expr(x)).collect(),
            )),
            x if x.starts_with("Kind.Term.fn") => Ok(Expr::fun(
                parse_orig(&args[0])?,
                Ident::generate(&parse_name(&args[1])?),
                args[1..].iter().flat_map(|x| parse_expr(x)).collect(),
            )),
            "Kind.Term.hlp" => Ok(Expr::hlp(parse_orig(&args[0])?, Ident::generate("?"))),
            "Kind.Term.u60" => Ok(Expr::u60(parse_orig(&args[0])?)),
            "Kind.Term.num" => Ok(Expr::num(parse_orig(&args[0])?, parse_num(&args[1])?)),
            "Kind.Term.op2" => Ok(Expr::binary(
                parse_orig(&args[0])?,
                parse_op(&args[1])?,
                parse_expr(&args[2])?,
                parse_expr(&args[3])?,
            )),
            _ => Err("ur dumb".to_string()),
        },
        r => Err(format!("{:?}", r)),
    }
}

fn parse_list(term: &Term) -> Result<Vec<Box<Term>>, String> {
    let mut vec = Vec::new();
    let mut cur = term;
    loop {
        match cur {
            Term::Ctr { name, args } => {
                if name == "List.nil" {
                    break;
                } else if name == "List.cons" {
                    vec.push(args[0].clone());
                    cur = &args[1];
                } else {
                    return Err("Not cons".to_string());
                }
            }
            _ => return Err("Not ctr".to_string()),
        }
    }
    Ok(vec)
}

pub fn parse_entry(term: &[Box<Term>]) -> Result<(String, Box<Expr>, Vec<Box<Expr>>), String> {
    let name = match_opt!(*term[0], Term::Num { numb } => numb)?;
    let typ = parse_expr(&term[1])?;
    let vals = parse_list(&term[2])?;
    Ok((Ident::decode(name), typ, vals.iter().flat_map(|x| parse_expr(x)).collect()))
}

fn parse_context(term: &Term) -> Result<Context, String> {
    let mut vec = Vec::new();
    let mut cur = term;
    loop {
        match cur {
            Term::Ctr { name, args } => {
                if name == "Kind.Context.empty" {
                    break;
                } else if name == "Kind.Context.entry" {
                    vec.push(parse_entry(args)?);
                    cur = &args[3];
                } else {
                    return Err(format!("Cararioa idio {}", name));
                }
            }
            _ => return Err("Not empty".to_string()),
        }
    }
    Ok(Context(vec))
}

fn parse_type_error(expr: &Term) -> Result<TypeError, String> {
    match expr {
        Term::Ctr { name, args } => {
            let ctx = parse_context(&args[0])?;
            let orig = match_opt!(*args[1], Term::Num { numb } => EncodedSpan(numb).to_span())?;
            match name.as_str() {
                "Kind.Error.unbound_variable" => Ok(TypeError::UnboundVariable(ctx, orig)),
                "Kind.Error.cant_infer_hole" => Ok(TypeError::CantInferHole(ctx, orig)),
                "Kind.Error.cant_infer_lambda" => Ok(TypeError::CantInferLambda(ctx, orig)),
                "Kind.Error.invalid_call" => Ok(TypeError::InvalidCall(ctx, orig)),
                "Kind.Error.impossible_case" => Ok(TypeError::ImpossibleCase(
                    ctx,
                    orig,
                    parse_expr(&args[2])?,
                    parse_expr(&args[3])?,
                )),
                "Kind.Error.inspection" => Ok(TypeError::Inspection(ctx, orig, parse_expr(&args[2])?)),
                "Kind.Error.too_many_arguments" => Ok(TypeError::TooManyArguments(ctx, orig)),
                "Kind.Error.type_mismatch" => Ok(TypeError::TypeMismatch(
                    ctx,
                    orig,
                    parse_expr(&args[2])?,
                    parse_expr(&args[3])?,
                )),
                _ => Err("kek".to_string()),
            }
        }
        _ => Err("ululu".to_string()),
    }
}

pub(crate) fn parse_report(expr: &Term) -> Result<Vec<TypeError>, String> {
    let args = parse_list(expr)?;
    let mut errs = Vec::new();
    for arg in args {
        errs.push(parse_type_error(&arg)?);
    }
    Ok(errs)
}
