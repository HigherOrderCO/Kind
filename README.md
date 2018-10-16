## Formality

An efficient programming language featuring formal proofs.

Like Agda, Idris and Coq, Formality has a powerful type system capable of expressing and proving arbitrary theorems about its programs. Like Rust, C and C++, it is very lightweight and doesn't require a garbage collection. Unlike both, its runtime is massively parallel, being the first general-purpose programming language aiming the GPU. This allows it to be used for cases that are simply not viable in other proof assistants, such as smart contracts and computer graphics.

### How?

Formality is merely a syntax for expressing inductive types (data) and dependent functions (computation). It is compilled to [Cedille-Core](https://github.com/maiavictor/cedille-core), which acts as a minimalist termination / consistency checker for it, allowing us to prove mathematical theorems about its programs. It is, then, compiled to the [Abstract Calculus](https://github.com/maiavictor/abstract-calculus), a massivelly parallel, non-garbage-collected and optimal model of computation. This lightweight runtime allows it to be used both for front-end applications and back-end smart-contracts. 

### Example

```haskell
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
```

### Benchmarks

(TODO)

### Syntax

(TODO)
