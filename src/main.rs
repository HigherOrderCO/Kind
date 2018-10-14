pub mod term;
pub mod syntax;
use term::*;

fn main() -> Result<(), std::string::String> {
    let (term, defs) = syntax::from_string_slice("
        data False : Type

        data True : Type
        | unit : True

        data Bool : Type
        | true  : Bool
        | false : Bool

        data Nat : Type
        | succ : (x : Nat) -> Nat
        | zero : Nat

        data IsTrue : Type
        | Yep : IsTrue(Bool.true)

        def isZero(n : Nat) =>
            match Nat n : Bool
            | succ(n : Nat) => Bool.true
            | zero()        => Bool.false

        def natInduction
            ( P : (n : Nat) -> Type
            , S : (n : Nat, i : P(n)) -> P(Nat.succ(n))
            , Z : P(zero)
            , n : Nat) =>
            match Nat n : (n : Nat) -> P(n)
            | succ(n : Nat) => S(n, natInduction(P, S, Z, n))
            | zero()        => Z

        natInduction
    ")?;
        //(P : Type, S : ((x : P) -> P), Z : P) -> S(P)
    println!("term: {}", syntax::to_string(&term, &mut Vec::new()));
    //println!("Result: {}", term);
    return Ok(());

/*
    println!("term {}", to_string(&term, &mut Vec::new()));

    for (nam,val) in defs.iter() {
        match infer(&val, &defs, false) {
            Ok(_) => {},
            Err(err) => println!("When checking `{}`:\n- {}\n", String::from_utf8_lossy(nam), err)
        }
    }

    let mut ty : Term = infer(&term, &defs, true).unwrap();
    reduce(&mut ty, &defs, true);
    println!("type {}", to_string(&ty, &mut Vec::new()));

    let mut nf = term.clone();
    weak_reduce(&mut nf, &defs, true);
    reduce(&mut nf, &defs, false);
    println!("norm {}", to_string(&nf, &mut Vec::new()));


*/

    Ok(())
}
