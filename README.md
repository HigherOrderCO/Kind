# Formality

An efficient programming language featuring formal proofs.

## Features

- **Formal proofs:** Formality's type system allows it to [prove theorems](https://en.wikipedia.org/wiki/Curry%E2%80%93Howard_correspondence) about its own programs.

- **Optimality:** Formality performs beta-reduction (lambda substitution) [optimally](https://www.amazon.com/Implementation-Functional-Programming-Languages-Theoretical/dp/0521621127).

- **No garbage-collection:** Formality doesn't require a garbage collection, making it resource-efficient.

- **EVM-compatibility:** Formality can be compiled to the EVM to run [Ethereum](https://www.ethereum.org/) smart-contracts.

- **GPU-compatibility:** Formality can also compile to CUDA / OpenCL and run in thousands of cores, making it *very fast*.

- **Simplicity:** The entire implementation is ~2k LOC and aims to be kept simple.

## How?

*Theorem proving* is possible thanks to dependent functions and inductive datatypes, similarly to [Coq](https://coq.inria.fr/refman/language/cic.html), [Agda](https://github.com/agda/agda) and other proof assistants. To guarantee mathematical meaningfulness, Formality is compiled to [Cedille-core](https://github.com/maiavictor/cedille-core), a minimalist type theory which acts as a termination and consistency checker.

*Optimality*, no *garbage-collection*, *EVM* and *GPU* compatibility are all possible due to compilation to the [symmetric interaction calculus](https://github.com/MaiaVictor/symmetric-interaction-calculus), a lightweight computing model that combines good aspects of the Turing Machine and the Lambda Calculus. In order for this to work, Formality enforces some compile-time restrictions based on Elementary Affine Logic.

## Usage

```bash
# Installs formality and enters the `examples` dir
git clone https://github.com/maiavictor/formality
cd formality
cargo install
cd examples

# Evals `add(two, two)`. Output: `Nat.succ(Nat.succ(Nat.succ(Nat.succ(Nat.zero))))`
formality main.for -e four 

# Type-checks `add`. Output: `((a : Nat) -> ((b : Nat) -> Nat))`
formality main.for -t add

# Type checks `add-comm`. Output: `((n : Nat) -> ((m : Nat) -> Eq(Nat)(add(n)(m))(add(m)(n))))`
formality main.for -t add-comm
```

The last example verifies the proof that `a + b == b + a`.

## Example

Here are some random datatypes and functions to show the syntax, and a proof that `a + b == b + a`.

```haskell
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
data List : (A : Type) -> Type
| cons    : (A : Type, x : A, xs : List(A)) -> List(A)
| nil     : (A : Type)                      -> List(A)

-- Vectors, i.e., lists with statically known lengths
data Vect : (A : Type, n : Nat) -> Type
| cons    : (A : Type, n : Nat, x : A, xs : Vect(A, n)) -> Vect(A, Nat.succ(n))
| nil     : (A : Type)                                  -> Vect(A, Nat.zero)

-- Equality type: holds a proof that two values are identical
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
let pred(a : Nat) =>
    case a
    | succ(pred) => pred
    | zero       => Nat.zero
    : Nat

-- Double of a number: the keyword `fold` is used for recursion
let double(a : Nat) =>
    case a
    | succ(pred) => Nat.succ(Nat.succ(fold(pred)))
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
    | cons(A0, n0, x, xs) => xs
    | nil(A)              => Vect.nil(A)
    : (A, n) => Vect(A, pred(n))
    
-- The induction principle on natural numbers
-- can be obtained from total pattern-matching
-- This function gets somewhat bloated by type
-- sigs; could be improved with bidirectional?
let induction(n : Nat) =>
    case n
    | succ(pred) => 
        ( P : (n : Nat) -> Type
        , s : (n : Nat, p : P(n)) -> P(Nat.succ(n))
        , z : P(Nat.zero))
        => s(pred, fold(pred, P, s, z))
    | zero => 
        ( P : (n : Nat) -> Type
        , s : (n : Nat, p : P(n)) -> P(Nat.succ(n))
        , z : P(Nat.zero))
        => z
    : () =>
        ( P : (n : Nat) -> Type
        , s : (n : Nat, p : P(n)) -> P(Nat.succ(n))
        , z : P(Nat.zero))
        -> P(self)

-- The number 2
let two
  Nat.succ(Nat.succ(Nat.zero))

-- The number 4
let four
  add(two, two)

-- Proof that `2 + 2 == 4`
let two-plus-two-is-four
  the(Eq(Nat,add(two,two),four), Eq.refl(Nat,four))

-- Congruence of equality: a proof that `a == b` implies `f(a) == f(b)`
let cong
    ( A : Type
    , B : Type
    , a : A
    , b : A
    , e : Eq(A, a, b)) =>
    case e
    | refl(A, x) => (f : (x : A) -> B) => Eq.refl(B, f(x))
    : (A, a, b)  => (f : (x : A) -> B) -> Eq(B, f(a), f(b))

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
    , x : A
    , y : A
    , e : Eq(A, x, y)) =>
    case e
    | refl(A, x) => (P : (x : A) -> Type, px : P(x)) => px
    : (A, x, y)  => (P : (x : A) -> Type, px : P(x)) -> P(y)

-- Proof that `a + 0 == a`
let add-n-zero(n : Nat) =>
    case n
    | succ(a) => cong(Nat, Nat, add(a, Nat.zero), a, fold(a), Nat.succ)
    | zero    => Eq.refl(Nat, Nat.zero)
    : Eq(Nat, add(self, Nat.zero), self)

-- Proof that `a + (1 + b) == 1 + (a + b)`
let add-n-succ-m(n : Nat) =>
    case n
    | succ(n) => (m : Nat) => cong(Nat, Nat, add(n, Nat.succ(m)), Nat.succ(add(n,m)), fold(n,m), Nat.succ)
    | zero    => (m : Nat) => Eq.refl(Nat, Nat.succ(m))
    : ()      => (m : Nat) -> Eq(Nat, add(self, Nat.succ(m)), Nat.succ(add(self, m)))

-- Proof that `a + b = b + a`
let add-comm(n : Nat) =>
    case n
    | succ(n) => (m : Nat) =>
        subst(Nat, add(m,n), add(n,m), fold(m,n), (x : Nat) => Eq(Nat, Nat.succ(x), add(m, Nat.succ(n))),
        sym(Nat, add(m, Nat.succ(n)), Nat.succ(add(m, n)), add-n-succ-m(m, n)))
    | zero    => (m : Nat) => sym(Nat, add(m, Nat.zero), m, add-n-zero(m))
    : ()      => (m : Nat) -> Eq(Nat, add(self, m), add(m, self))
```

You can see it on the `examples` directory. Soon, I'll explain how to prove cooler things, and write a tutorial on how to make a "DAO" Smart Contract that is provably "unhackable", in the sense its internal balance always matches the sum of its users balances.

## Done

- Formality syntax (parser / stringifier)

- Formality type checker

- Formality interpreter

- Formality command-line interface

- [Symmetric Interaction Calculus (syntax, runtime)](https://github.com/maiavictor/symmetric-interaction-calculus)

- [Cedille-core](https://github.com/maiavictor/cedille-core)

- [GPU evaluator prototype](https://github.com/maiavictor/absal-rs/tree/parallel-test-3) and [concept](https://github.com/maiavictor/absal-ex)

* Sans bugs, incremental improvements, minor missing features, etc.

## To do

- Elementary Affine Logic checks

- Cedille compilation (port to Rust?)

- Coq compilation

- Symmetric Interaction Calculus compilation and decompilation

- EVM compilation

- Complete CUDA / OpenCL evaluator

- IPFS imports

- Uncurrying of pretty-printed normal forms

- Including dependencies when pretty-printing (so you can copypaste proofs)

- Tests

- Documentation

## Disclaimer

This is just a sneak peek. There are missing features and code certainly has bugs. Do not use it use on rocket engines.

See [this thread](https://www.reddit.com/r/haskell/comments/9ojicd/sneak_peek_of_formality_a_language_combining/) for more info.
