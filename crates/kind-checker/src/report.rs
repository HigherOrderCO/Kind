//! Transforms a answer from the type checker in
//! a Expr of the kind-tree package.

use kind_span::{EncodedRange, Range};
use kind_tree::backend::Term;
use kind_tree::symbol::{Ident, QualifiedIdent};
use kind_tree::{desugared, Operator};

use crate::errors::TypeError;
use desugared::Expr;

type Entry = (String, Box<Expr>, Vec<Box<Expr>>);

#[derive(Debug)]
pub struct Context(pub Vec<Entry>);

macro_rules! match_opt {
    ($expr:expr, $pat:pat => $end:expr) => {{
        match $expr {
            $pat => Ok($end),
            _ => Err("Error while matching opt".to_string()),
        }
    }};
}

fn parse_orig(term: &Term) -> Result<Range, String> {
    match_opt!(term, Term::U6O { numb } => EncodedRange(*numb).to_range())
}

fn parse_num(term: &Term) -> Result<u64, String> {
    match_opt!(term, Term::U6O { numb } => *numb)
}

fn parse_op(term: &Term) -> Result<Operator, String> {
    match term {
        Term::Ctr { name, args: _ } => match name.as_str() {
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
    match term {
        Term::U6O { numb } => Ok(Ident::decode(*numb)),
        Term::Ctr { name, args: _ } => Ok(name.to_string()),
        _ => Err("Error while matching ident".to_string()),
    }
}

fn parse_qualified(term: &Term) -> Result<QualifiedIdent, String> {
    match term {
        Term::U6O { numb } => Ok(QualifiedIdent::new_static(
            &Ident::decode(*numb),
            None,
            Range::ghost_range(),
        )),
        Term::Ctr { name, args: _ } => Ok(QualifiedIdent::new_static(
            &name[..name.len() - 1],
            None,
            Range::ghost_range(),
        )),
        _ => Err("Error while matching qualified".to_string()),
    }
}

fn parse_expr(term: &Term) -> Result<Box<desugared::Expr>, String> {
    parse_all_expr(Default::default(), term)
}

fn parse_all_expr(
    names: im::HashMap<String, String>,
    term: &Term,
) -> Result<Box<desugared::Expr>, String> {
    match term {
        Term::Ctr { name, args } => match name.as_str() {
            "Kind.Quoted.all" => Ok(Expr::all(
                parse_orig(&args[0])?,
                Ident::generate(&parse_name(&args[1])?),
                parse_all_expr(names.clone(), &args[2])?,
                parse_all_expr(names, &args[3])?,
                false, // TODO: Fix
            )),
            "Kind.Quoted.lam" => Ok(Expr::lambda(
                parse_orig(&args[0])?,
                Ident::generate(&parse_name(&args[1])?),
                parse_all_expr(names, &args[2])?,
                false, // TODO: Fix
            )),
            "Kind.Quoted.let" => Ok(Expr::let_(
                parse_orig(&args[0])?,
                Ident::generate(&parse_name(&args[1])?),
                parse_all_expr(names.clone(), &args[2])?,
                parse_all_expr(names, &args[3])?,
            )),
            "Kind.Quoted.typ" => Ok(Expr::typ(parse_orig(&args[0])?)),
            "Kind.Quoted.var" => Ok(Expr::var(Ident::new(
                parse_name(&args[1])?,
                parse_orig(&args[0])?,
            ))),
            "Kind.Quoted.hol" => Ok(Expr::hole(parse_orig(&args[0])?, parse_num(&args[1])?)),
            "Kind.Quoted.ann" => Ok(Expr::ann(
                parse_orig(&args[0])?,
                parse_all_expr(names.clone(), &args[1])?,
                parse_all_expr(names, &args[2])?,
            )),
            "Kind.Quoted.sub" => Ok(Expr::sub(
                parse_orig(&args[0])?,
                Ident::generate(&parse_name(&args[1])?),
                parse_num(&args[2])? as usize,
                parse_num(&args[3])? as usize,
                parse_all_expr(names, &args[4])?,
            )),
            "Kind.Quoted.app" => Ok(Expr::app(
                parse_orig(&args[0])?,
                parse_all_expr(names.clone(), &args[1])?,
                vec![desugared::AppBinding {
                    data: parse_all_expr(names, &args[2])?,
                    erased: false,
                }],
            )),
            "Kind.Quoted.ctr" => {
                let name = parse_qualified(&args[0])?;
                let orig = parse_orig(&args[1])?;
                let mut res = Vec::new();
                for arg in parse_list(&args[2])? {
                    res.push(parse_all_expr(names.clone(), &arg)?);
                }
                Ok(Expr::ctr(orig, name, res))
            }
            "Kind.Quoted.fun" => Ok(Expr::fun(
                parse_orig(&args[1])?,
                parse_qualified(&args[0])?,
                {
                    let mut res = Vec::new();
                    for arg in parse_list(&args[2])? {
                        res.push(parse_all_expr(names.clone(), &arg)?);
                    }
                    res
                },
            )),
            "Kind.Quoted.hlp" => Ok(Expr::hlp(parse_orig(&args[0])?, Ident::generate("?"))),
            "Kind.Quoted.u60" => Ok(Expr::type_u60(parse_orig(&args[0])?)),
            // TODO: Change quoting to support floats
            "Kind.Quoted.num" => Ok(Expr::num_u60(parse_orig(&args[0])?, parse_num(&args[1])?)),
            "Kind.Quoted.op2" => Ok(Expr::binary(
                parse_orig(&args[0])?,
                parse_op(&args[1])?,
                parse_all_expr(names.clone(), &args[2])?,
                parse_all_expr(names, &args[3])?,
            )),
            tag => Err(format!(
                "Unexpected tag on transforming quoted term {:?}",
                tag
            )),
        },
        _ => Err("Unexpected term on transforming quoted term".to_string()),
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
                    return Err(format!("Unexpected constructor on list '{:?}'", name));
                }
            }
            _ => return Err("Unexpected value on list".to_string()),
        }
    }
    Ok(vec)
}

/// Transforms a HVM quoted entry into a easy to manipulate structure.
pub fn transform_entry(term: &Term) -> Result<Entry, String> {
    match term {
        Term::Ctr { name, args } if name == "Pair.new" => {
            let fst = parse_name(&args[0])?;
            match &*args[1] {
                Term::Ctr { name, args } if name == "Pair.new" => {
                    let snd = parse_expr(&args[0])?;
                    let trd = parse_list(&args[1])?;
                    let trd = trd.iter().flat_map(|x| parse_expr(x)).collect();
                    Ok((fst, snd, trd))
                }
                _ => Err("Unexpected value on entry second pair".to_string()),
            }
        }
        _ => Err("Unexpected value on entry first pair".to_string()),
    }
}

fn parse_type_error(expr: &Term) -> Result<TypeError, String> {
    match expr {
        Term::Ctr { name, args } => {
            if args.len() < 2 {
                return Err("Invalid argument length for constructor".to_string());
            }
            let ls = parse_list(&args[0])?;
            let entries = ls.iter().flat_map(|x| transform_entry(x));
            let ctx = Context(entries.collect());
            let orig = match_opt!(*args[1], Term::U6O { numb } => EncodedRange(numb).to_range())?;
            match name.as_str() {
                "Kind.Error.Quoted.unbound_variable" => Ok(TypeError::UnboundVariable(ctx, orig)),
                "Kind.Error.Quoted.cant_infer_hole" => Ok(TypeError::CantInferHole(ctx, orig)),
                "Kind.Error.Quoted.cant_infer_lambda" => Ok(TypeError::CantInferLambda(ctx, orig)),
                "Kind.Error.Quoted.invalid_call" => Ok(TypeError::InvalidCall(ctx, orig)),
                "Kind.Error.Quoted.impossible_case" => Ok(TypeError::ImpossibleCase(
                    ctx,
                    orig,
                    parse_all_expr(im::HashMap::new(), &args[2])?,
                    parse_all_expr(im::HashMap::new(), &args[3])?,
                )),
                "Kind.Error.Quoted.inspection" => Ok(TypeError::Inspection(
                    ctx,
                    orig,
                    parse_all_expr(im::HashMap::new(), &args[2])?,
                )),
                "Kind.Error.Quoted.too_many_arguments" => {
                    Ok(TypeError::TooManyArguments(ctx, orig))
                }
                "Kind.Error.Quoted.type_mismatch" => Ok(TypeError::TypeMismatch(
                    ctx,
                    orig,
                    parse_all_expr(im::HashMap::new(), &args[2])?,
                    parse_all_expr(im::HashMap::new(), &args[3])?,
                )),
                _ => Err("Unexpected tag on quoted value".to_string()),
            }
        }
        _ => Err("Unexpected value on quoted value".to_string()),
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
