//! Transforms a answer from the type checker in
//! a Expr of the kind-tree package.

use kind_span::{EncodedRange, Range};
use kind_tree::symbol::{Ident, QualifiedIdent};
use kind_tree::{desugared, Operator};

use hvm::Term;

use crate::diagnostic::TypeDiagnostic;
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
            "Apps.Kind.Operator.add" => Ok(Operator::Add),
            "Apps.Kind.Operator.sub" => Ok(Operator::Sub),
            "Apps.Kind.Operator.mul" => Ok(Operator::Mul),
            "Apps.Kind.Operator.div" => Ok(Operator::Div),
            "Apps.Kind.Operator.mod" => Ok(Operator::Mod),
            "Apps.Kind.Operator.and" => Ok(Operator::And),
            "Apps.Kind.Operator.or" => Ok(Operator::Or),
            "Apps.Kind.Operator.xor" => Ok(Operator::Xor),
            "Apps.Kind.Operator.shl" => Ok(Operator::Shl),
            "Apps.Kind.Operator.shr" => Ok(Operator::Shr),
            "Apps.Kind.Operator.ltn" => Ok(Operator::Ltn),
            "Apps.Kind.Operator.lte" => Ok(Operator::Lte),
            "Apps.Kind.Operator.eql" => Ok(Operator::Eql),
            "Apps.Kind.Operator.gte" => Ok(Operator::Gte),
            "Apps.Kind.Operator.gtn" => Ok(Operator::Gtn),
            "Apps.Kind.Operator.neq" => Ok(Operator::Neq),
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
    names: im_rc::HashMap<String, String>,
    term: &Term,
) -> Result<Box<desugared::Expr>, String> {
    match term {
        Term::Ctr { name, args } => match name.as_str() {
            "Apps.Kind.Term.Quoted.all" => Ok(Expr::all(
                parse_orig(&args[0])?,
                Ident::generate(&parse_name(&args[1])?),
                parse_all_expr(names.clone(), &args[2])?,
                parse_all_expr(names, &args[3])?,
                false, // TODO: Fix
            )),
            "Apps.Kind.Term.Quoted.lam" => Ok(Expr::lambda(
                parse_orig(&args[0])?,
                Ident::generate(&parse_name(&args[1])?),
                parse_all_expr(names, &args[2])?,
                false, // TODO: Fix
            )),
            "Apps.Kind.Term.Quoted.let" => Ok(Expr::let_(
                parse_orig(&args[0])?,
                Ident::generate(&parse_name(&args[1])?),
                parse_all_expr(names.clone(), &args[2])?,
                parse_all_expr(names, &args[3])?,
            )),
            "Apps.Kind.Term.Quoted.typ" => Ok(Expr::typ(parse_orig(&args[0])?)),
            "Apps.Kind.Term.Quoted.var" => Ok(Expr::var(Ident::new(
                parse_name(&args[1])?,
                parse_orig(&args[0])?,
            ))),
            "Apps.Kind.Term.Quoted.hol" => Ok(Expr::hole(parse_orig(&args[0])?, parse_num(&args[1])?)),
            "Apps.Kind.Term.Quoted.ann" => Ok(Expr::ann(
                parse_orig(&args[0])?,
                parse_all_expr(names.clone(), &args[1])?,
                parse_all_expr(names, &args[2])?,
            )),
            "Apps.Kind.Term.Quoted.sub" => Ok(Expr::sub(
                parse_orig(&args[0])?,
                Ident::generate(&parse_name(&args[1])?),
                parse_num(&args[2])? as usize,
                parse_num(&args[3])? as usize,
                parse_all_expr(names, &args[4])?,
            )),
            "Apps.Kind.Term.Quoted.app" => Ok(Expr::app(
                parse_orig(&args[0])?,
                parse_all_expr(names.clone(), &args[1])?,
                vec![desugared::AppBinding {
                    data: parse_all_expr(names, &args[2])?,
                    erased: false,
                }],
            )),
            "Apps.Kind.Term.Quoted.ctr" => {
                let name = parse_qualified(&args[0])?;
                let orig = parse_orig(&args[1])?;
                let mut res = Vec::new();
                for arg in parse_list(&args[2])? {
                    res.push(parse_all_expr(names.clone(), &arg)?);
                }
                Ok(Expr::ctr(orig, name, res))
            }
            "Apps.Kind.Term.Quoted.fun" => Ok(Expr::fun(
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
            "Apps.Kind.Term.Quoted.hlp" => Ok(Expr::hlp(parse_orig(&args[0])?, Ident::generate("?"))),
            "Apps.Kind.Term.Quoted.u60" => Ok(Expr::type_u60(parse_orig(&args[0])?)),
            "Apps.Kind.Term.Quoted.num" => Ok(Expr::num_u60(parse_orig(&args[0])?, parse_num(&args[1])?)),
            // TODO: Change quoting to support floats
            "Apps.Kind.Term.Quoted.op2" => Ok(Expr::binary(
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
                if name == "Data.List.nil" {
                    break;
                } else if name == "Data.List.cons" {
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
        Term::Ctr { name, args } if name == "Data.Pair.new" => {
            let fst = parse_name(&args[0])?;
            match &*args[1] {
                Term::Ctr { name, args } if name == "Data.Pair.new" => {
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

fn parse_type_error(expr: &Term) -> Result<TypeDiagnostic, String> {
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
                "Apps.Kind.Error.Quoted.uncovered_pattern" => Ok(TypeDiagnostic::UncoveredPattern(ctx, orig, {
                    let args = parse_list(&args[2])?;
                    let mut new_args = Vec::with_capacity(args.len());
                    for arg in &args {
                        new_args.push(parse_all_expr(im_rc::HashMap::new(), arg)?);
                    }
                    new_args
                })),
                "Apps.Kind.Error.Quoted.unbound_variable" => Ok(TypeDiagnostic::UnboundVariable(ctx, orig)),
                "Apps.Kind.Error.Quoted.cant_infer_hole" => Ok(TypeDiagnostic::CantInferHole(ctx, orig)),
                "Apps.Kind.Error.Quoted.cant_infer_lambda" => Ok(TypeDiagnostic::CantInferLambda(ctx, orig)),
                "Apps.Kind.Error.Quoted.invalid_call" => Ok(TypeDiagnostic::InvalidCall(ctx, orig)),
                "Apps.Kind.Error.Quoted.impossible_case" => Ok(TypeDiagnostic::ImpossibleCase(
                    ctx,
                    orig,
                    parse_all_expr(im_rc::HashMap::new(), &args[2])?,
                    parse_all_expr(im_rc::HashMap::new(), &args[3])?,
                )),
                "Apps.Kind.Error.Quoted.inspection" => Ok(TypeDiagnostic::Inspection(
                    ctx,
                    orig,
                    parse_all_expr(im_rc::HashMap::new(), &args[2])?,
                )),
                "Apps.Kind.Error.Quoted.too_many_arguments" => {
                    Ok(TypeDiagnostic::TooManyArguments(ctx, orig))
                }
                "Apps.Kind.Error.Quoted.type_mismatch" => Ok(TypeDiagnostic::TypeMismatch(
                    ctx,
                    orig,
                    parse_all_expr(im_rc::HashMap::new(), &args[2])?,
                    parse_all_expr(im_rc::HashMap::new(), &args[3])?,
                )),
                _ => Err("Unexpected tag on quoted value".to_string()),
            }
        }
        _ => Err("Unexpected value on quoted value".to_string()),
    }
}

pub(crate) fn parse_report(expr: &Term) -> Result<Vec<TypeDiagnostic>, String> {
    let args = parse_list(expr)?;
    let mut errs = Vec::new();

    for arg in args {
        errs.push(parse_type_error(&arg)?);
    }

    Ok(errs)
}
