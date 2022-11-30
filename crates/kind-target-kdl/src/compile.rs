use std::{fmt::Display, sync::mpsc::Sender};

use fxhash::FxHashMap;
use kind_report::data::Diagnostic;
use kind_tree::{symbol::QualifiedIdent, untyped, Number};
use linked_hash_map::LinkedHashMap;
use tiny_keccak::Hasher;

pub use kindelia_lang::ast as kdl;

use crate::errors::KdlError;

pub const KDL_NAME_LEN: usize = 12;
const U60_MAX: kdl::U120 = kdl::U120(0xFFFFFFFFFFFFFFF);

#[derive(Debug)]
pub struct File {
    pub ctrs: LinkedHashMap<String, kdl::Statement>,
    pub funs: LinkedHashMap<String, kdl::Statement>,
    pub runs: Vec<kdl::Statement>,
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
                ctrs: Default::default(),
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
    for item in &mut encoded {
        *item = encode_base64_u8((num & 0x3f) as u8);
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
    let name = *ctx.kdl_names.get(rule.name.to_str()).unwrap();
    let mut args = Vec::new();
    for pat in &rule.pats {
        let arg = compile_expr(ctx, pat);
        args.push(arg);
    }
    let lhs = kdl::Term::ctr(name, args);
    let rhs = compile_expr(ctx, &rule.body);

    kdl::Rule { lhs, rhs }
}

pub fn err_term() -> kindelia_lang::ast::Term {
    kindelia_lang::ast::Term::Num {
        numb: kindelia_lang::ast::U120::new(99999).unwrap(),
    }
}

pub fn compile_expr(ctx: &mut CompileCtx, expr: &untyped::Expr) -> kindelia_lang::ast::Term {
    use crate::untyped::ExprKind as From;
    use kdl::Term as To;
    match &expr.data {
        From::App { fun, args } => {
            let mut expr = compile_expr(ctx, fun);
            for binding in args {
                let body = compile_expr(ctx, binding);
                expr = To::App {
                    func: Box::new(expr),
                    argm: Box::new(body),
                };
            }
            expr
        }
        From::Binary { op, left, right } => {
            use kind_tree::Operator as Op;
            let oper = compile_oper(op);
            match op {
                // These operations occupy more bits on overflow
                // So we truncate them
                Op::Add | Op::Sub | Op::Mul => {
                    let val0 = Box::new(compile_expr(ctx, left));
                    let val1 = Box::new(compile_expr(ctx, right));
                    let expr = Box::new(To::Op2 { oper, val0, val1 });
                    let trunc = Box::new(To::Num { numb: U60_MAX });
                    To::Op2 {
                        oper: kdl::Oper::And,
                        val0: expr,
                        val1: trunc,
                    }
                }
                // These operations need to wrap around every 60 bits
                // Eg: (<< n 60) = n
                Op::Shl | Op::Shr => {
                    let val0 = Box::new(compile_expr(ctx, left));
                    let right = Box::new(compile_expr(ctx, right));
                    let sixty = Box::new(To::Num {
                        numb: kdl::U120(60),
                    });
                    let val1 = Box::new(To::Op2 {
                        oper: kdl::Oper::Mod,
                        val0: right,
                        val1: sixty,
                    });
                    To::Op2 { oper, val0, val1 }
                }
                // Other operations don't overflow
                // Div, Mod, And, Or, Xor, Eql, Neq, Gtn, Gte, Ltn, Lte
                _ => {
                    let val0 = Box::new(compile_expr(ctx, left));
                    let val1 = Box::new(compile_expr(ctx, right));
                    To::Op2 { oper, val0, val1 }
                }
            }
        }
        From::Ctr { name, args } => {
            match name.to_str() {
                // Special compilation for some numeric functions
                // They have no rules because they're compilation defined,
                // so they've been initially interpreted as Ctr

                // Add with no boundary check is just a normal add
                "U60.add_unsafe" => To::Op2 {
                    oper: kdl::Oper::Add,
                    val0: Box::new(compile_expr(ctx, &args[0])),
                    val1: Box::new(compile_expr(ctx, &args[1])),
                },
                // U60s are already stored in 120 bits
                "U60.to_u120" => compile_expr(ctx, &args[0]),

                // Truncate to 60 bits
                "U120.to_u60" => To::Op2 {
                    oper: kdl::Oper::And,
                    val0: Box::new(compile_expr(ctx, &args[0])),
                    val1: Box::new(To::Num { numb: U60_MAX }),
                },
                // Compilation for U120 numeric operations
                "U120.add" => To::Op2 {
                    oper: kdl::Oper::Add,
                    val0: Box::new(compile_expr(ctx, &args[0])),
                    val1: Box::new(compile_expr(ctx, &args[1])),
                },
                "U120.sub" => To::Op2 {
                    oper: kdl::Oper::Add,
                    val0: Box::new(compile_expr(ctx, &args[0])),
                    val1: Box::new(compile_expr(ctx, &args[1])),
                },
                "U120.mul" => To::Op2 {
                    oper: kdl::Oper::Mul,
                    val0: Box::new(compile_expr(ctx, &args[0])),
                    val1: Box::new(compile_expr(ctx, &args[1])),
                },
                "U120.div" => To::Op2 {
                    oper: kdl::Oper::Div,
                    val0: Box::new(compile_expr(ctx, &args[0])),
                    val1: Box::new(compile_expr(ctx, &args[1])),
                },
                "U120.mod" => To::Op2 {
                    oper: kdl::Oper::Mod,
                    val0: Box::new(compile_expr(ctx, &args[0])),
                    val1: Box::new(compile_expr(ctx, &args[1])),
                },
                "U120.num_equal" => To::Op2 {
                    oper: kdl::Oper::Eql,
                    val0: Box::new(compile_expr(ctx, &args[0])),
                    val1: Box::new(compile_expr(ctx, &args[1])),
                },
                "U120.num_not_equal" => To::Op2 {
                    oper: kdl::Oper::Neq,
                    val0: Box::new(compile_expr(ctx, &args[0])),
                    val1: Box::new(compile_expr(ctx, &args[1])),
                },
                "U120.shift_left" => To::Op2 {
                    oper: kdl::Oper::Shl,
                    val0: Box::new(compile_expr(ctx, &args[0])),
                    val1: Box::new(compile_expr(ctx, &args[1])),
                },
                "U120.shift_right" => To::Op2 {
                    oper: kdl::Oper::Shr,
                    val0: Box::new(compile_expr(ctx, &args[0])),
                    val1: Box::new(compile_expr(ctx, &args[1])),
                },
                "U120.num_less_than" => To::Op2 {
                    oper: kdl::Oper::Ltn,
                    val0: Box::new(compile_expr(ctx, &args[0])),
                    val1: Box::new(compile_expr(ctx, &args[1])),
                },
                "U120.num_less_equal" => To::Op2 {
                    oper: kdl::Oper::Lte,
                    val0: Box::new(compile_expr(ctx, &args[0])),
                    val1: Box::new(compile_expr(ctx, &args[1])),
                },
                "U120.num_greater_than" => To::Op2 {
                    oper: kdl::Oper::Gtn,
                    val0: Box::new(compile_expr(ctx, &args[0])),
                    val1: Box::new(compile_expr(ctx, &args[1])),
                },
                "U120.num_greater_equal" => To::Op2 {
                    oper: kdl::Oper::Gte,
                    val0: Box::new(compile_expr(ctx, &args[0])),
                    val1: Box::new(compile_expr(ctx, &args[1])),
                },
                "U120.bitwise_and" => To::Op2 {
                    oper: kdl::Oper::And,
                    val0: Box::new(compile_expr(ctx, &args[0])),
                    val1: Box::new(compile_expr(ctx, &args[1])),
                },
                "U120.bitwise_or" => To::Op2 {
                    oper: kdl::Oper::Or,
                    val0: Box::new(compile_expr(ctx, &args[0])),
                    val1: Box::new(compile_expr(ctx, &args[1])),
                },
                "U120.bitwise_xor" => To::Op2 {
                    oper: kdl::Oper::Xor,
                    val0: Box::new(compile_expr(ctx, &args[0])),
                    val1: Box::new(compile_expr(ctx, &args[1])),
                },

                // All other constructors have a normal compilation
                _ => {
                    let name = *ctx.kdl_names.get(name.to_str()).unwrap();
                    let args = args.iter().map(|x| compile_expr(ctx, x)).collect();
                    To::Ctr { name, args }
                }
            }
        }
        From::Fun { name, args } => {
            let name = *ctx.kdl_names.get(name.to_str()).unwrap();
            let args = args.iter().map(|x| compile_expr(ctx, x)).collect();
            To::Fun { name, args }
        }
        From::Lambda {
            param,
            body,
            erased: _,
        } => {
            let name = kdl::Name::from_str(param.to_str());
            if let Ok(name) = name {
                let body = Box::new(compile_expr(ctx, body));
                To::Lam { name, body }
            } else {
                ctx.send_err(Box::new(KdlError::InvalidVarName(param.range)));
                err_term()
            }
        }
        From::Let { name, val, next } => {
            let res_name = kdl::Name::from_str(name.to_str());
            if let Ok(name) = res_name {
                let expr = Box::new(compile_expr(ctx, val));
                let func = Box::new(To::Lam { name, body: expr });
                let argm = Box::new(compile_expr(ctx, next));
                To::App { func, argm }
            } else {
                ctx.send_err(Box::new(KdlError::InvalidVarName(name.range)));
                err_term()
            }
        }
        From::Num {
            num: Number::U60(numb),
        } => To::Num {
            numb: kdl::U120(*numb as u128),
        },
        From::Num {
            num: Number::U120(numb),
        } => To::Num {
            numb: kdl::U120(*numb),
        },
        From::Var { name } => {
            let res_name = kdl::Name::from_str(name.to_str());
            if let Ok(name) = res_name {
                To::Var { name }
            } else {
                ctx.send_err(Box::new(KdlError::InvalidVarName(name.range)));
                err_term()
            }
        }
        From::Str { val } => {
            let nil = kdl::Term::Ctr {
                name: *ctx.kdl_names.get("String.nil").unwrap(),
                args: vec![],
            };

            let cons_name = *ctx.kdl_names.get("String.cons").unwrap();

            let cons = |numb: u128, next| kdl::Term::Ctr {
                name: cons_name,
                args: vec![
                    kdl::Term::Num {
                        numb: kdl::U120::new(numb).unwrap(),
                    },
                    next,
                ],
            };

            val.chars().rfold(nil, |rest, chr| cons(chr as u128, rest))
        }
        From::Err => unreachable!("Should not have errors inside generation"),
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

        if entry.rules.is_empty() {
            // Functions with no rules become Ctr
            let sttm = kdl::Statement::Ctr {
                name,
                args,
                sign: None,
            };
            ctx.file.ctrs.insert(entry.name.to_string(), sttm);
        } else {
            // Functions with rules become Fun
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
        for ctr in &self.ctrs {
            writeln!(f, "{}", ctr.1)?;
        }

        if !self.ctrs.is_empty() && !self.funs.is_empty() {
            writeln!(f)?;
        }

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
    use kdl::Oper as To;
    use kind_tree::Operator as From;
    match oper {
        From::Add => To::Add,
        From::Sub => To::Sub,
        From::Mul => To::Mul,
        From::Div => To::Div,
        From::Mod => To::Mod,
        From::Shl => To::Shl,
        From::Shr => To::Shr,
        From::Eql => To::Eql,
        From::Neq => To::Neq,
        From::Ltn => To::Ltn,
        From::Lte => To::Lte,
        From::Gte => To::Gte,
        From::Gtn => To::Gtn,
        From::And => To::And,
        From::Xor => To::Xor,
        From::Or => To::Or,
    }
}
