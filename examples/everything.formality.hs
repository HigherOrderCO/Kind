-- General Formality examples
-- 
-- To type-check a term: `formality -t term_name everything.formality.hs`
-- To evaluate a term:   `formality -e term_name everything.formality.hs`
-- To evaluate on SIC:   `formality -s -f term_name everything.formality.hs`
-- 
-- Examples:
--
-- The command: `formality -s -f ten everything.formality.hs`
-- ... outputs: Bool{false}
-- ...          Total rewrites  : 4
-- ...          Loop iterations : 19
-- ... which means applying `not(Bool.true)` on SIC took 4 graph rewrites
-- 
-- The command: `formality -t add-comm everything.formality.hs` 
-- ... outputs: ((n : Nat) -> ((m : Nat) -> Eq<Nat>(add(n)(m))(add(m)(n))))
-- ... which means `add-comm` is a proof that `∀ n m . n + m == m + n`

-- Empty, the type with no constructors
data Empty : Type

-- Unit, the type with one constructor
data Unit : Type
| void : Unit

-- Bool, the type with two constructors
data Bool : Type
| true  : Bool
| false : Bool

-- Natural numbers
data Nat : Type
| succ : (n : Nat) -> Nat
| zero : Nat

-- Simple pairs
data Pair<A : Type, B : Type> : Type
| new : (x : A, y : B) -> Pair

-- Polymorphic lists
data List<A : Type> : Type
| cons : (x : A, xs : List) -> List
| nil  : List

-- Vectors, i.e., lists with statically known lengths
data Vect<A : Type> : (n : Nat) -> Type
| cons : (n : Nat, x : A, xs : Vect(n)) -> Vect(Nat.succ(n))
| nil  : Vect(Nat.zero)

-- Equality type: holds a proof that two values are identical
data Eq<A : Type> : (x : A, y : A) -> Type
| refl : (x : A) -> Eq(x, x)

-- Polymorphic identity function for a type P
let the(P : Type, x : P) =>
    x

-- Some bools
let true  Bool.true
let false Bool.false

-- Some nats
let n0 Nat.zero
let n1 Nat.succ(n0)
let n2 Nat.succ(n1)
let n3 Nat.succ(n2)
let n4 Nat.succ(n3)
let n5 Nat.succ(n4)

-- Arbitrary example of lazy copying
let two-twos
  copy n2 as a, b in
  Pair<Nat, Nat>.new(a, b)

-- Boolean negation
let not(b : Bool) =>
    case b  -> Bool
    | true  => Bool.false
    | false => Bool.true

-- Applies not to true
let not_true not(Bool{true})
    
-- Predecessor of a natural number
let pred(a : Nat) =>
    case a       -> Nat
    | succ(pred) => pred
    | zero       => Nat.zero

-- Double of a number: the keyword `fold` is used for recursion
let double(a : Nat) =>
    case a       -> Nat
    | succ(pred) => Nat.succ(Nat.succ(fold(pred)))
    | zero       => Nat.zero

-- Addition of natural numbers
let add(a : Nat, b : Nat) =>
    (case a       -> () => (a : Nat) -> Nat
    | succ(pred)  => () => (b : Nat) => Nat.succ(fold(pred, b))
    | zero        => () => (b : Nat) => b)(b)

-- First element of a pair
let fst(A : Type, B : Type, pair : Pair<A, B>) =>
    case pair   -> A
    | new(x, y) => x

-- Second element of a pair
let snd(A : Type, B : Type, pair : Pair<A, B>) =>
    case pair   -> B
    | new(x, y) => y

-- Principle of explosion: from falsehood, everything follows
let EFQ(P : Type, f : Empty) =>
    case f -> P

-- Returns the first element of a non-empty vector
let head(A : Type, n : Nat, vect : Vect<A>(Nat.succ(n))) =>
    case vect        -> (n) => (case n -> Type | succ(m) => A | zero => Unit)
    | cons(n, x, xs) => x
    | nil            => Unit.void

-- Returns a vector without its first element
let tail(A : Type, n : Nat, vect : Vect<A>(Nat.succ(n))) =>
    case vect        -> (n) => Vect<A>(pred(n))
    | cons(n, x, xs) => xs
    | nil            => Vect<A>.nil

-- The induction principle on natural numbers can be obtained from total pattern-matching.
-- This function gets somewhat bloated by type sigs; could be improved with bidirectional?
let induction(n : Nat) =>
    case n       -> () => (P : (n : Nat) -> Type , s : (n : Nat, p : P(n)) -> P(Nat.succ(n)) , z : P(Nat.zero)) -> P(self)
    | succ(pred) => () => (P : (n : Nat) -> Type , s : (n : Nat, p : P(n)) -> P(Nat.succ(n)) , z : P(Nat.zero)) => s(pred, fold(pred, P, s, z))
    | zero       => () => (P : (n : Nat) -> Type , s : (n : Nat, p : P(n)) -> P(Nat.succ(n)) , z : P(Nat.zero)) => z

-- Congruence of equality: a proof that `a == b` implies `f(a) == f(b)`
let cong(A : Type, B : Type, a : A, b : A, e : Eq<A>(a, b)) =>
    case e    -> (a, b) => (f : (x : A) -> B) -> Eq<B>(f(a), f(b))
    | refl(x) => (f : (x : A) -> B) => Eq<B>.refl(f(x))

-- Symmetry of equality: a proof that `a == b` implies `b == a`
let sym(A : Type, a : A, b : A, e : Eq<A>(a, b)) =>
    case e    -> (a, b) => Eq<A>(b, a)
    | refl(x) => Eq<A>.refl(x)

-- Substitution of equality: if `a == b`, then `a` can be replaced by `b` in a proof `P`
let subst(A : Type, x : A, y : A, e : Eq<A>(x, y)) =>
    case e    -> (x, y) => (P : (x : A) -> Type, px : P(x)) -> P(y)
    | refl(x) => (P : (x : A) -> Type, px : P(x)) => px

-- Proof that `a + 0 == a`
let add-n-zero(n : Nat) =>
    case n    -> Eq<Nat>(add(self, Nat.zero), self)
    | succ(a) => cong(Nat, Nat, add(a, Nat.zero), a, fold(a), (x : Nat) => Nat.succ(x))
    | zero    => Eq<Nat>.refl(Nat.zero)

-- Proof that `a + (1 + b) == 1 + (a + b)`
let add-n-succ-m(n : Nat) =>
    case n    -> () => (m : Nat) -> Eq<Nat>(add(self, Nat.succ(m)), Nat.succ(add(self, m)))
    | succ(n) => (m : Nat) => cong(Nat, Nat, add(n, Nat.succ(m)), Nat.succ(add(n,m)), fold(n,m), (x : Nat) => Nat.succ(x))
    | zero    => (m : Nat) => Eq<Nat>.refl(Nat.succ(m))

-- Proof that `a + b = b + a`
let add-comm(n : Nat) =>
    case n    -> () => (m : Nat) -> Eq<Nat>(add(self, m), add(m, self))
    | succ(n) => (m : Nat) => subst(Nat, add(m,n), add(n,m), fold(m,n), (x : Nat) => Eq<Nat>(Nat.succ(x), add(m, Nat.succ(n))), sym(Nat, add(m, Nat.succ(n)), Nat.succ(add(m, n)), add-n-succ-m(m, n)))
    | zero    => (m : Nat) => sym(Nat, add(m, Nat.zero), m, add-n-zero(m))
