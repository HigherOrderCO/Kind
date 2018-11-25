use term::*;
use term::Term::*;

// Builds a binary-compressed, Church-encoded natural number (for fast repeated application).
// For example, the number #15 is encoded as:
// (P : Type, f : (x : P) -> P) => 
//     copy f                        as f1_f, f1_k
//     copy f1_k                     as f1_a, f1_b
//     copy (x : P) => f1_a(f1_b(x)) as f2_f, f2_k
//     copy f2_k                     as f2_a, f2_b
//     copy (x : P) => f4_a(f2_b(x)) as f4_f, f4_k
//     copy f4_k                     as f4_a, f4_b
//     copy (x : P) => f4_a(f4_b(x)) as f8_f, f8_k
//     copy f8_k                     as f8_a, f8_b
//     (x : P) => f1_f(f2_f(f4_f(f8_f(x))))
pub fn build_church_nat(nat : i32) -> Term {
    fn build(nam : &mut u32, i : i32, n : i32, nat : i32) -> Term {
        if n <= nat {
            Cpy{
                nam: if i % 2 == 0 {
                    (format!("f{}_f", n).into_bytes(), format!("f{}_k", n).into_bytes())
                } else {
                    (format!("f{}_a", n).into_bytes(), format!("f{}_b", n).into_bytes())
                },
                val: Box::new(if i == 0 || i % 2 == 1 {
                    Var{idx: 0}
                } else {
                    Lam{
                        nam: b"x".to_vec(),
                        typ: Box::new(Var{idx: i * 2 + 1}),
                        bod: Box::new(App{
                            fun: Box::new(Var{idx: 2}),
                            arg: Box::new(App{
                                fun: Box::new(Var{idx: 1}),
                                arg: Box::new(Var{idx: 0})
                            })
                        })
                    }
                }),
                bod: Box::new(build(nam, i + 1, if i % 2 == 1 { n * 2 } else { n }, nat))
            }
        } else {
            let mut bod = Var{idx: 0};
            for j in 0..(i+1)/2 {
                if (nat >> ((i+1)/2 - j - 1)) % 2 == 1 {
                    bod = App{
                        fun: Box::new(Var{idx: 4 * (j + 1)}),
                        arg: Box::new(bod)
                    }
                }
            }
            Lam{
                nam: b"x".to_vec(),
                typ: Box::new(Var{idx: i * 2 + 1}),
                bod: Box::new(bod)
            }
        }
    }
    Lam{
        nam: b"P".to_vec(),
        typ: Box::new(Set),
        bod: Box::new(Lam{
            nam: b"f".to_vec(),
            typ: Box::new(All{
                nam: b"x".to_vec(),
                typ: Box::new(Var{idx: 0}),
                bod: Box::new(Var{idx: 1})
            }),
            bod: Box::new(build(&mut 0, 0, 1, nat))
        })
    }
}

// Builds a datatype's constructor function given its name.
pub fn build_idt_ctr(idt : &Term, nam : Vec<u8>) -> Term {
    let (_, idt_ctr) = apply_idt_args(&idt);
    let mut idx = 0;
    for i in 0..idt_ctr.len() {
        if idt_ctr[i].0 == nam {
            idx = i;
        }
    }
    let (nams, typs, _) = get_nams_typs_bod(&idt_ctr[idx].1);
    let mut res = Var{idx: (idt_ctr.len() - idx - 1) as i32};
    for i in 0..typs.len() {
        res = App{
            fun: Box::new(res),
            arg: Box::new(Var{idx: (idt_ctr.len() + typs.len() - i - 1) as i32})
        };
    }
    res = New{
        idt: Box::new(shifted(&idt, typs.len() as i32, 0)),
        ctr: idt_ctr.iter().map(|c| c.0.clone()).collect(),
        bod: Box::new(res)
    };
    for i in (0..typs.len()).rev() {
        res = Lam{
            nam: nams[i].clone(),
            typ: Box::new(typs[i].clone()),
            bod: Box::new(res)
        };
    }
    res
}
