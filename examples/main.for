-- Empty, the type with no constructors
data Empty : Type

-- Unit, the type with one constructor
data Unit : Type
| void : Unit

-- Bool, the type with two constructors
data Bool : Type
| true  : Bool
| false : Bool

-- Some bools
let true  Bool{true}
let false Bool{false}

-- Natural numbers
data Nat : Type
| succ : (n : Nat) -> Nat
| zero : Nat

-- Some nats
let 0 Nat{zero}
let 1 Nat{succ(0)}
let 2 Nat{succ(1)}
let 3 Nat{succ(2)}
let 4 Nat{succ(3)}

-- Simple pairs
data Pair<A : Type, B : Type> : Type
| new : (x : A, y : B) -> Pair

-- Polymorphic lists
data List<A : Type> : Type
| cons : (x : A, xs : List) -> List
| nil  : List

-- Vectors, i.e., lists with statically known lengths
data Vect<A : Type> : (n : Nat) -> Type
| cons : (n : Nat, x : A, xs : Vect(n)) -> Vect(Nat{succ(n)})
| nil  : Vect(Nat{zero})

-- Equality type: holds a proof that two values are identical
data Eq<A : Type> : (x : A, y : A) -> Type
| refl : (x : A) -> Eq(x, x)

-- Polymorphic identity function for a type P
let the(P : Type, x : P) =>
    x

-- Boolean negation
let not(b : Bool) =>
    case b
    | true  => Bool{false}
    | false => Bool{true}
    : Bool
    
-- Predecessor of a natural number
let pred(a : Nat) =>
    case a
    | succ(pred) => pred
    | zero       => Nat{zero}
    : Nat

-- Double of a number: the keyword `fold` is used for recursion
let double(a : Nat) =>
    case a
    | succ(pred) => Nat{succ(Nat{succ(fold(pred))})}
    | zero       => Nat{zero}
    : Nat

-- Addition of natural numbers
let add(a : Nat, b : Nat) =>
    (case a
    | succ(pred) => (b : Nat) => Nat{succ(fold(pred, b))}
    | zero       => (b : Nat) => b
    : () => (a : Nat) -> Nat)(b)

-- First element of a pair
let fst(A : Type, B : Type, pair : Pair<A, B>) =>
    case pair
    | new(x, y) => x
    : A

-- Second element of a pair
let snd(A : Type, B : Type, pair : Pair<A, B>) =>
    case pair
    | new(x, y) => y
    : B

-- Principle of explosion: from falsehood, everything follows
let EFQ(P : Type, f : Empty) =>
    case f : P

-- Returns the first element of a vector which is *statically*
-- asserted to be non-empty, preventing runtime errors.
let head(A : Type, n : Nat, vect : Vect<A>(Nat{succ(n)})) =>
    case vect
    | cons(n, x, xs) => x
    | nil            => Unit{void}
    : (n) => case n
        | succ(m) => A
        | zero    => Unit
        : Type

-- Returns a vector without its first element
let tail(A : Type, n : Nat, vect : Vect<A>(Nat{succ(n)})) =>
    case vect
    | cons(n, x, xs) => xs
    | nil            => Vect<A>{nil}
    : (n)            => Vect<A>(pred(n))

-- The induction principle on natural numbers
-- can be obtained from total pattern-matching
-- This function gets somewhat bloated by type
-- sigs; could be improved with bidirectional?
let induction(n : Nat) =>
    case n
    | succ(pred) => 
        ( P : (n : Nat) -> Type
        , s : (n : Nat, p : P(n)) -> P(Nat{succ(n)})
        , z : P(Nat{zero}))
        => s(pred, fold(pred, P, s, z))
    | zero => 
        ( P : (n : Nat) -> Type
        , s : (n : Nat, p : P(n)) -> P(Nat{succ(n)})
        , z : P(Nat{zero}))
        => z
    : () =>
        ( P : (n : Nat) -> Type
        , s : (n : Nat, p : P(n)) -> P(Nat{succ(n)})
        , z : P(Nat{zero}))
        -> P(self)

-- The number 2
let two
  Nat{succ(Nat{succ(Nat{zero})})}

-- The number 4
let four
  add(two, two)

let vect
  Vect<Nat>{cons(0, 0, Vect<Nat>{nil})}

let two-plus-two-is-four
  the(Eq<Nat>(add(two,two),four), Eq<Nat>{refl(four)})

-- Congruence of equality: a proof that `a == b` implies `f(a) == f(b)`
let cong
    ( A : Type
    , B : Type
    , a : A
    , b : A
    , e : Eq<A>(a, b)) =>
    case e
    | refl(x) => (f : (x : A) -> B) => Eq<B>{refl(f(x))}
    : (a, b)  => (f : (x : A) -> B) -> Eq<B>(f(a), f(b))

-- Symmetry of equality: a proof that `a == b` implies `b == a`
let sym
    ( A : Type
    , a : A
    , b : A
    , e : Eq<A>(a, b)) =>
    case e
    | refl(x) => Eq<A>{refl(x)}
    : (a, b)  => Eq<A>(b, a)

-- Substitution of equality: if `a == b`, then `a` can be replaced by `b` in a proof `P`
let subst
    ( A : Type
    , x : A
    , y : A
    , e : Eq<A>(x, y)) =>
    case e
    | refl(x) => (P : (x : A) -> Type, px : P(x)) => px
    : (x, y)  => (P : (x : A) -> Type, px : P(x)) -> P(y)

-- Proof that `a + 0 == a`
let add-n-zero(n : Nat) =>
    case n
    | succ(a) => cong(Nat, Nat, add(a, Nat{zero}), a, fold(a), (x : Nat) => Nat{succ(x)})
    | zero    => Eq<Nat>{refl(Nat{zero})}
    : Eq<Nat>(add(self, Nat{zero}), self)

-- Proof that `a + (1 + b) == 1 + (a + b)`
let add-n-succ-m(n : Nat) =>
    case n
    | succ(n) => (m : Nat) => cong(Nat, Nat, add(n, Nat{succ(m)}), Nat{succ(add(n,m))}, fold(n,m), (x : Nat) => Nat{succ(x)})
    | zero    => (m : Nat) => Eq<Nat>{refl(Nat{succ(m)})}
    : ()      => (m : Nat) -> Eq<Nat>(add(self, Nat{succ(m)}), Nat{succ(add(self, m))})

-- Proof that `a + b = b + a`
let add-comm(n : Nat) =>
    case n
    | succ(n) => (m : Nat) =>
        subst(Nat, add(m,n), add(n,m), fold(m,n), (x : Nat) => Eq<Nat>(Nat{succ(x)}, add(m, Nat{succ(n)})),
        sym(Nat, add(m, Nat{succ(n)}), Nat{succ(add(m, n))}, add-n-succ-m(m, n)))
    | zero    => (m : Nat) => sym(Nat, add(m, Nat{zero}), m, add-n-zero(m))
    : ()      => (m : Nat) -> Eq<Nat>(add(self, m), add(m, self))

-- Random test
let main
  let twice(n : Nat) => 
    copy n as a, b
    in Pair<Nat, Nat>{new(a, b)}
  twice(2)
