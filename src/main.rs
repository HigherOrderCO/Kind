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
        -- Empty, the type with no constructors
        data Empty : Type

        -- Unit, the type with one constructor
        data Unit : Type
        | void    : Unit

        -- Bool, the type with two constructors
        data Bool : Type
        | true    : Bool
        | false   : Bool

        -- Natural numbers
        data Nat : Type
        | succ   : (n : Nat) -> Nat
        | zero   : Nat

        -- Simple pairs
        data Pair : (A : Type) -> Type
        | new     : (A : Type, x : A, y : A) -> Pair(A)

        -- Polymorphic lists
        data List : (A : type) -> Type
        | cons    : (A : Type, x : A, xs : List(A)) -> List(A)
        | nil     : (A : Type)                      -> List(A)

        -- Vectors, i.e., lists with statically known lengths
        data Vect : (A : Type, n : Nat) -> Type
        | cons    : (A : Type, n : Nat, x : A, xs : Vect(A, n)) -> Vect(A, Nat.succ(n))
        | nil     : (A : Type)                                  -> Vect(A, Nat.zero)

        -- Equality type: hold a proof that two values are identical
        data Eq : (A : Type, x : A, y : A) -> Type
        | refl  : (A : Type, x : A) -> Eq(A, x, x)

        -- Polymorphic identity function for a type P
        let the(P : Type, x : P) =>
            x

        -- Boolean negation
        let not(b : Bool) =>
            case b
            | true  => Bool.false
            | false => Bool.true
            : Bool

        -- Predecessor of a natural number
        let pred (a : Nat) =>
            case a
            | succ(pred) => pred
            | zero       => Nat.zero
            : Nat

        -- Addition of natural numbers
        let add(a : Nat, b : Nat) =>
            (case a
            | succ(pred) => (b : Nat) => Nat.succ(fold(pred, b))
            | zero       => (b : Nat) => b
            : () => (a : Nat) -> Nat)(b)

        -- First element of a pair
        let fst(A : Type, pair : Pair(A)) =>
            case pair
            | new(A, x, y) => x
            : (A) => A

        -- Second element of a pair
        let snd(A : Type, pair : Pair(A)) =>
            case pair
            | new(A, x, y) => y
            : (A) => A

        -- Principle of explosion: from falsehood, everything follows
        let EFQ(P : Type, f : Empty) =>
            case f : P

        -- The induction principle on natural numbers
        -- can be obtained from total pattern-matching
        let induction
            ( P : (n : Nat) -> Type
            , s : (n : Nat, p : P(n)) -> P(Nat.succ(n))
            , z : P(Nat.zero)
            , n : Nat) =>
            case n
            | succ(pred) => s(pred, induction(P, s, z, pred))
            | zero       => z
            : P(self)

        -- Returns the first element of a vector which is *statically*
        -- asserted to be non-empty, preventing runtime errors.
        let head(A : Type, n : Nat, vect : Vect(A, Nat.succ(n))) =>
            case vect
            | cons(A, n, x, xs) => x
            | nil(A)            => Unit.void
            : (A, n) => case n
                | succ(m) => A
                | zero    => Unit
                : Type
            
        -- Returns a vector without its first element
        let tail(A : Type, n : Nat, vect : Vect(A, Nat.succ(n))) =>
            case vect
            | cons(A, n, x, xs) => xs
            | nil(A)            => Vect.nil(A)
            : (A, n) => Vect(A, pred(n))

        -- Congruence of equality: a proof that `a == b` implies `f(a) == f(b)`
        let cong
            ( A : Type
            , B : Type
            , f : (a : A) -> B
            , a : A
            , b : A
            , e : Eq(A, a, b)) =>
            (case e
            | refl(A, x) => (f : (x : A) -> B) => Eq.refl(B, f(x))
            : (A, a, b)  => (f : (x : A) -> B) -> Eq(B, f(a), f(b)))(f)

        -- Symmetry of equality: a proof that `a == b` implies `b == a`
        let sym
            ( A : Type
            , a : A
            , b : A
            , e : Eq(A, a, b)) =>
            case e
            | refl(A, x) => Eq.refl(A, x)
            : (A, a, b)  => Eq(A, b, a)

        -- Substitution of equality: if `a == b`, then `a` can be replaced by `b` in a proof `P`
        let subst
            ( A : Type
            , P : (x : A) -> Type
            , x : A
            , y : A
            , e : Eq(A, x, y)) =>
            (case e
            | refl(A1, x1) => (P : (x : A1) -> Type, px : P(x1)) => px
            : (A0, x0, y0) => (P : (x : A0) -> Type, px : P(x0)) -> P(y0))(P)

        -- Proof that `a + 0 == a`
        let add-n-zero(n : Nat) =>
            case n
            | succ(a) => cong(Nat, Nat, Nat.succ, add(a, Nat.zero), a, fold(a))
            | zero    => Eq.refl(Nat, Nat.zero)
            : Eq(Nat, add(self, Nat.zero), self)

        -- Proof that `a + (1 + b) == 1 + (a + b)`
        let add-n-succ-m(n : Nat) =>
            case n
            | succ(n) => (m : Nat) => cong(Nat, Nat, Nat.succ, add(n, Nat.succ(m)), Nat.succ(add(n,m)), fold(n,m))
            | zero    => (m : Nat) => Eq.refl(Nat, Nat.succ(m))
            : ()      => (m : Nat) -> Eq(Nat, add(self, Nat.succ(m)), Nat.succ(add(self, m)))

        -- Proof that `a + b = b + a`
        let add-comm(n : Nat) =>
            case n
            | succ(n) => (m : Nat) =>
                subst(Nat, (x : Nat) => Eq(Nat, Nat.succ(x), add(m, Nat.succ(n))), add(m,n), add(n,m), fold(m,n),
                sym(Nat, add(m, Nat.succ(n)), Nat.succ(add(m, n)),
                add-n-succ-m(m, n)))
            | zero    => (m : Nat) => sym(Nat, add(m, Nat.zero), m, add-n-zero(m))
            : ()      => (m : Nat) -> Eq(Nat, add(self, m), add(m, self))

        add-comm
    "));

    // Prints main term
    println!("[Term]\n{}", syntax::term_to_string(&val, &mut Vec::new(), true));
    println!("");

    // Type-checks all dependencies
    for (nam, def) in &defs {
        get_result(nam.to_vec(), syntax::infer_with_string_error(&def, &defs, false, true));
    }

    // Type-checks main term
    let typ : Term = get_result(b"main".to_vec(), syntax::infer_with_string_error(&val, &defs, false, true));
    println!("[Type]\n{}", syntax::term_to_string(&typ, &mut Vec::new(), true));
    println!("");

    // Normalizes and prints
    let mut nor : Term = val.clone();
    reduce(&mut nor, &defs, true);
    println!("[Norm]\n{}", syntax::term_to_string(&nor, &mut Vec::new(), true));

}
