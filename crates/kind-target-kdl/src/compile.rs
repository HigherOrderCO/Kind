use std::{fmt::Display, sync::mpsc::Sender};

use fxhash::FxHashMap;
use kind_report::data::Diagnostic;
use kind_tree::{symbol::QualifiedIdent, untyped, Number};
use linked_hash_map::LinkedHashMap;
use tiny_keccak::Hasher;

pub use kindelia_lang::ast as kdl;

use crate::errors::KdlError;

pub const KDL_NAME_LEN: usize = 12;

#[derive(Debug)]
pub struct File {
    funs: LinkedHashMap<String, kdl::Statement>,
    runs: Vec<kdl::Statement>,
}

pub struct CompileCtx<'a> {
    file: File,
    kdl_names: FxHashMap<String, kdl::Name>,
    kdl_states: Vec<String>,
    book: &'a untyped::Book,

    sender: Sender<Box<dyn Diagnostic>>,
    failed: bool,
}

impl<'a> CompileCtx<'a> {
    pub fn new(book: &'a untyped::Book, sender: Sender<Box<dyn Diagnostic>>) -> CompileCtx<'a> {
        CompileCtx {
            file: File {
                funs: Default::default(),
                runs: Default::default(),
            },
            kdl_names: Default::default(),
            kdl_states: Default::default(),
            book,
            sender,
            failed: false,
        }
    }

    pub fn send_err(&mut self, err: Box<dyn Diagnostic>) {
        self.sender.send(err).unwrap();
        self.failed = true;
    }
}

// Functions to generate a new name

fn encode_base64_u8(num: u8) -> char {
    match num {
        0..=9 => (num + b'0') as char,
        10..=35 => (num - 10 + b'A') as char,
        36..=61 => (num - 36 + b'a') as char,
        62.. => '_',
    }
}

fn u128_to_kdl_name(mut num: u128) -> String {
    let mut encoded = [0 as char; 12];
    for i in 0..12 {
        encoded[i] = encode_base64_u8((num & 0x3f) as u8);
        num >>= 6;
    }
    encoded.into_iter().collect()
}

fn keccak128(data: &[u8]) -> [u8; 16] {
    let mut hasher = tiny_keccak::Keccak::v256();
    let mut output = [0u8; 16];
    hasher.update(data);
    hasher.finalize(&mut output);
    output
}

fn name_shortener(name: &QualifiedIdent, namespace: &str) -> QualifiedIdent {
    let max_fn_name = KDL_NAME_LEN - namespace.len();

    if name.to_str().len() > max_fn_name {
        let name_hash = keccak128(name.to_str().as_bytes());
        let name_hash = u128::from_le_bytes(name_hash);
        let name_hash = u128_to_kdl_name(name_hash);
        QualifiedIdent::new_static(&name_hash[..max_fn_name], None, name.range)
    } else {
        name.clone()
    }
}

pub fn compile_book(
    book: &untyped::Book,
    sender: Sender<Box<dyn Diagnostic>>,
    namespace: &str,
) -> Option<File> {
    let mut ctx = CompileCtx::new(book, sender);

    for (name, entry) in &book.entrs {
        let new_name = entry
            .attrs
            .kdl_name
            .clone()
            .map(|x| x.to_string())
            .unwrap_or_else(|| name_shortener(&entry.name, namespace).to_string());

        if let Ok(new_name) = kdl::Name::from_str(&new_name) {
            ctx.kdl_names.insert(name.clone(), new_name);
        } else {
            ctx.send_err(Box::new(KdlError::InvalidVarName(entry.name.range)));
        }
    }

    for (_name, entry) in &book.entrs {
        compile_entry(&mut ctx, entry);
    }

    if ctx.failed {
        return None;
    }

    Some(ctx.file)
}

pub fn compile_rule(ctx: &mut CompileCtx, rule: &untyped::Rule) -> kindelia_lang::ast::Rule {
    let name = ctx.kdl_names.get(rule.name.to_str()).unwrap().clone();
    let mut args = Vec::new();
    for pat in &rule.pats {
        let arg = compile_expr(ctx, pat);
        args.push(arg);
    }
    let lhs = kdl::Term::fun(name, args);
    let rhs = compile_expr(ctx, &rule.body);
    let rule = kdl::Rule { lhs, rhs };
    rule
}

pub fn err_term() -> kindelia_lang::ast::Term {
    kindelia_lang::ast::Term::Num {
        numb: kindelia_lang::ast::U120::new(99999).unwrap(),
    }
}

pub fn compile_expr(ctx: &mut CompileCtx, expr: &untyped::Expr) -> kindelia_lang::ast::Term {
    use crate::untyped::ExprKind::*;
    use kdl::Term as T;
    match &expr.data {
        App { fun, args } => {
            let mut expr = compile_expr(ctx, fun);
            for binding in args {
                let body = compile_expr(ctx, &binding);
                expr = T::App {
                    func: Box::new(expr),
                    argm: Box::new(body),
                };
            }
            expr
        }
        Binary { op, left, right } => {
            // TODO: Special compilation for U60 ops
            let oper = compile_oper(op);
            let val0 = Box::new(compile_expr(ctx, left));
            let val1 = Box::new(compile_expr(ctx, right));
            T::Op2 { oper, val0, val1 }
        }
        Ctr { name, args } => {
            let name = ctx.kdl_names.get(name.to_str()).unwrap().clone();
            let mut new_args = Vec::new();
            for arg in args {
                new_args.push(compile_expr(ctx, &arg));
            }
            T::Ctr {
                name,
                args: new_args,
            }
        }
        Fun { name, args } => {
            // TODO: Special compilation for U60 and U120 ops
            let name = ctx.kdl_names.get(name.to_str()).unwrap().clone();
            let mut new_args = Vec::new();
            for arg in args {
                new_args.push(compile_expr(ctx, &arg));
            }
            T::Fun {
                name,
                args: new_args,
            }
        }
        Lambda {
            param,
            body,
            erased: _,
        } => {
            let name = kdl::Name::from_str(param.to_str());
            if let Ok(name) = name {
                let body = Box::new(compile_expr(ctx, &body));
                T::Lam { name, body }
            } else {
                ctx.send_err(Box::new(KdlError::InvalidVarName(param.range)));
                err_term()
            }
        }
        Let { name, val, next } => {
            let res_name = kdl::Name::from_str(name.to_str());
            if let Ok(name) = res_name {
                let expr = Box::new(compile_expr(ctx, &val));
                let func = Box::new(T::Lam { name, body: expr });
                let argm = Box::new(compile_expr(ctx, next));
                T::App { func, argm }
            } else {
                ctx.send_err(Box::new(KdlError::InvalidVarName(name.range)));
                err_term()
            }
        }
        Num {
            num: Number::U60(numb),
        } => T::Num {
            numb: kdl::U120(*numb as u128),
        },
        Num {
            num: Number::U120(numb),
        } => T::Num {
            numb: kdl::U120(*numb),
        },
        Var { name } => {
            let res_name = kdl::Name::from_str(name.to_str());
            if let Ok(name) = res_name {
                T::Var { name }
            } else {
                ctx.send_err(Box::new(KdlError::InvalidVarName(name.range)));
                err_term()
            }
        }
        Str { val } => {
            let nil = kdl::Term::Ctr {
                name: ctx.kdl_names.get("String.nil").unwrap().clone(),
                args: vec![],
            };

            let cons_name = ctx.kdl_names.get("String.cons").unwrap().clone();

            let cons = |numb: u128, next| kdl::Term::Ctr {
                name: cons_name.clone(),
                args: vec![
                    kdl::Term::Num {
                        numb: kdl::U120::new(numb).unwrap(),
                    },
                    next,
                ],
            };

            val.chars().rfold(nil, |rest, chr| cons(chr as u128, rest))
        }
        Err => unreachable!("Should not have errors inside generation"),
    }
}

pub fn compile_entry(ctx: &mut CompileCtx, entry: &untyped::Entry) {
    if entry.attrs.kdl_erase {
        return;
    }

    if entry.attrs.kdl_run {
        if !entry.args.is_empty() {
            ctx.send_err(Box::new(KdlError::ShouldNotHaveArguments(entry.range)));
        } else if entry.rules.len() != 1 {
            ctx.send_err(Box::new(KdlError::ShouldHaveOnlyOneRule(entry.range)));
        } else {
            let expr = compile_expr(ctx, &entry.rules[0].body);
            let statement = kdl::Statement::Run { expr, sign: None };
            ctx.file.runs.push(statement);
        }
    } else {
        let name = ctx.kdl_names.get(entry.name.to_str()).cloned().unwrap();

        let mut args = Vec::new();

        for (name, range, _strictness) in &entry.args {
            if let Ok(name) = kdl::Name::from_str(name) {
                args.push(name)
            } else {
                ctx.send_err(Box::new(KdlError::InvalidVarName(*range)));
            }
        }

        if entry.rules.len() == 0 {
            let sttm = kdl::Statement::Ctr {
                name,
                args,
                sign: None,
            };
            ctx.file.funs.insert(entry.name.to_string(), sttm);
        } else {
            let rules = entry
                .rules
                .iter()
                .map(|rule| compile_rule(ctx, rule))
                .collect::<Vec<_>>();
            let func = kdl::Func { rules };

            let init = if let Some(state_name) = &entry.attrs.kdl_state {
                let init_entry = ctx.book.entrs.get(state_name.to_str());
                if let Some(entry) = init_entry {
                    if !entry.args.is_empty() {
                        ctx.send_err(Box::new(KdlError::ShouldNotHaveArguments(entry.range)));
                        None
                    } else if entry.rules.len() != 1 {
                        ctx.send_err(Box::new(KdlError::ShouldHaveOnlyOneRule(entry.range)));
                        None
                    } else {
                        ctx.kdl_states.push(state_name.to_string());
                        Some(compile_expr(ctx, &entry.rules[0].body))
                    }
                } else {
                    ctx.send_err(Box::new(KdlError::NoInitEntry(state_name.range)));
                    None
                }
            } else {
                None
            };

            let sttm = kdl::Statement::Fun {
                name,
                args,
                func,
                init,
                sign: None,
            };
            ctx.file.funs.insert(entry.name.to_string(), sttm);
        }
    }
}

impl Display for File {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        for fun in &self.funs {
            writeln!(f, "{}", fun.1)?;
        }
        for run in &self.runs {
            writeln!(f, "{}", run)?;
        }
        Ok(())
    }
}

fn compile_oper(oper: &kind_tree::Operator) -> kdl::Oper {
    use kdl::Oper as T;
    use kind_tree::Operator as F;
    match oper {
        F::Add => T::Add,
        F::Sub => T::Sub,
        F::Mul => T::Mul,
        F::Div => T::Div,
        F::Mod => T::Mod,
        F::Shl => T::Shl,
        F::Shr => T::Shr,
        F::Eql => T::Eql,
        F::Neq => T::Neq,
        F::Ltn => T::Ltn,
        F::Lte => T::Lte,
        F::Gte => T::Gte,
        F::Gtn => T::Gtn,
        F::And => T::And,
        F::Xor => T::Xor,
        F::Or => T::Or,
    }
}
