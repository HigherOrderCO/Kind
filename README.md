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
| void : Unit

-- Bool, the type with two constructors
data Bool : Type
| true  : Bool
| false : Bool

-- Some bools
let true  Bool.true
let false Bool.false

-- Natural numbers
data Nat : Type
| succ : (n : Nat) -> Nat
| zero : Nat

-- Some nats
let 0 Nat.zero
let 1 Nat.succ(0)
let 2 Nat.succ(1)
let 3 Nat.succ(2)
let 4 Nat.succ(3)

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

-- Boolean negation
let not(b : Bool) =>
    case b  -> Bool
    | true  => Bool.false
    | false => Bool.true
    
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

-- The number 2
let two
  Nat.succ(Nat.succ(Nat.zero))

-- The number 4
let four
  add(two, two)

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

-- Arbitrary example
let main
  let twice(n : Nat) =>
    copy n as a, b
    in Pair<Nat, Nat>.new(a, b)
  twice(2)
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

Formality is still at an experimental stage. There are missing features and code certainly has bugs. Do not use it use on rocket engines.

See [this thread](https://www.reddit.com/r/haskell/comments/9ojicd/sneak_peek_of_formality_a_language_combining/) for more info.
