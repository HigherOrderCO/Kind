pub mod term;
pub mod syntax;
use term::*;
use std::string::*;

fn get_result<T>(name : Vec<u8>, result : Result<T, String>) -> T {
    match result {
        Ok(term) => term,
        Err(err) => {
            println!("[Error on `{}`]\n{}", String::from_utf8_lossy(&name), err);
            std::process::exit(0);
        }
    }
}

fn main() {
    let (val, defs) = get_result(b"main".to_vec(), syntax::term_from_string_slice("
        let the(P : Type, x : P) =>
            x

        data False : Type

        data True : Type
        | Unit : True

        let EFQ(P : Type, f : False) =>
            case f : P

        data Eq : (A : Type, x : A, y : A) -> Type
        | refl : (A : Type, x : A) -> Eq(A, x, x)

        data Bool : Type
        | true    : Bool
        | false   : Bool

        let not(b : Bool) =>
            case b
            | true  => Bool.false
            | false => Bool.true
            : Bool

        data Nat : Type
        | succ : (n : Nat) -> Nat
        | zero : Nat

        let induction
            ( P : (n : Nat) -> Type
            , s : (n : Nat, p : P(n)) -> P(Nat.succ(n))
            , z : P(Nat.zero)
            , n : Nat) =>
            case n
            | succ(pred) => s(pred, induction(P, s, z, pred))
            | zero       => z
            : P(self)

        let add(a : Nat, b : Nat) =>
            case a
            | succ(pred) => Nat.succ(add(pred, b))
            | zero       => b
            : Nat

        let two
            Nat.succ(Nat.succ(Nat.zero))

        let four
            Nat.succ(Nat.succ(Nat.succ(Nat.succ(Nat.zero))))

        let two_plus_two_is_four
            the(Eq(Nat, add(two, two), four),
                Eq.refl(Nat, four))

        two_plus_two_is_four
    "));
    println!("[Term]\n{}", syntax::term_to_string(&val, &mut Vec::new(), true));
    println!("");

    for (nam, def) in &defs {
        get_result(nam.to_vec(), syntax::infer_with_string_error(&def, &defs, false, true));
    }

    let mut typ : Term = get_result(b"main".to_vec(), syntax::infer_with_string_error(&val, &defs, false, true));
    reduce(&mut typ, &defs, true);
    println!("[Type]\n{}", syntax::term_to_string(&typ, &mut Vec::new(), true));
    println!("");

    let mut nor : Term = val.clone();
    reduce(&mut nor, &defs, true);
    println!("[Norm]\n{}", syntax::term_to_string(&nor, &mut Vec::new(), true));
}

/*
fn main() {
    let (val, defs) = get_result(syntax::term_from_string_slice("
        def c_Bool(P : Type, t : P, f : P) ->
            P

        def c_True(P : Type, t : P, f : P) =>
            t

        def c_False(P : Type, t : P, f : P) =>
            f

        def c_not(a : c_Bool) =>
            (P : Type, t : P, f : P) => a(P, f, t)

        data Bool : Type
        | true  : Bool
        | false : Bool

        def not(a : Bool) =>
            case a
            | true  => Bool.false
            | false => Bool.true
            : => Bool
        
        data Vec : (A : Type, len : Nat) -> Type
        | cons : (A : Type, len : Nat, x : A, xs : Vec(A, len)) -> Vec(A, Nat.succ(len))
        | nil  : (A : Type)                                     -> Vec(A, Nat.zero)

        def Foo(A : Type, len : Nat, vec : Vec(A, len)) =>
            case vec
            | cons(A, len, x, xs) => Vec.cons(A, Nat.succ(len), Vec.cons(A, len, x, xs))
            | nil                 => Vec.nil
            : (A, len)            => Vec(A, Nat.succ(Nat.succ(len)))

        def ind(P : (n : Nat) -> Type, S : (n : Nat, p : P(n)) -> P(Nat.succ(n)), Z : P(Nat.zero), n : Nat) =>
            case n
            | succ => S(n, ind(P, S, Z, n))
            | zero => Z
            : P(self)

        not
    "));
    println!("[Term]\n{}", syntax::term_to_string(&val, &mut Vec::new(), true));
    println!("");

    let mut typ : Term = get_result(syntax::infer_with_string_error(&val, &defs, false, true));
    reduce(&mut typ, &defs, true);
    println!("[Type]\n{}", syntax::term_to_string(&typ, &mut Vec::new(), true));
    println!("");

    let mut nor : Term = val.clone();
    reduce(&mut nor, &defs, true);
    println!("[Norm]\n{}", syntax::term_to_string(&nor, &mut Vec::new(), true));
}
*/
