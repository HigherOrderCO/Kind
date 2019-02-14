# Formality

A general-purpose programming language for front-end apps, back-end services and smart-contracts. It is:

- **Fast:** no garbage-collection, [optimal beta-reduction](https://medium.com/@maiavictor/solving-the-mystery-behind-abstract-algorithms-magical-optimizations-144225164b07) and a massively parallel GPU compiler make it *insanely fast*.

- **Safe:** a type system capable of proving mathematical theorems about its own programs make it *really secure*.

- **Simple:** its entire implementation is ~2k LOC, making it a simple standard *you could implement yourself*.

**Theorem proving** is possible due to dependent types, like on other proof assistants. **Massively parallel evaluation** is possible due to [Symmetric Interaction Calculus](https://github.com/MaiaVictor/symmetric-interaction-calculus) (SIC), a new model of computation that combines the best aspects of the Turing Machine and the λ-Calculus. **No garbage-collection** is possible due to linearity: values are simply freed when they go out of scope. To use a variable twice, we just clone it: SIC's *lazy copying* makes that virtually free. With no ownership system needed, we have [Rust](https://www.rust-lang.org/en-US/)-like computational properties with a [Haskell](https://www.haskell.org/)-like high-level feel.

## Table of contents
<a name="table-of-contents"/>

   * [Installation](#installation)
   * [Usage](#usage)
   * [Examples](#examples)
      * [Simple types](#simple-types)
      * [Recursive types](#recursive-types)
      * [Polymorphic types](#polymorphic-types)
      * [Dependent types](#dependent-types)
      * [Theorem proving](#theorem-proving)
      * [Optimal evaluation](#optimal-evaluation)
      * [More examples](#more-examples)
   * [Warning](#warning)

## Installation
<a name="installation"/>

To install Formality, first make sure you [installed Rust](https://doc.rust-lang.org/cargo/getting-started/installation.html):

```bash
curl -sSf https://static.rust-lang.org/rustup.sh | sh
```

Then install it by cloning the repository:

```bash
git clone https://github.com/maiavictor/formality
cd formality
cargo install
```

## Usage
<a name="usage"/>

Example usage:

```
git clone https://github.com/maiavictor/formality
cd examples

# Interpreter evaluation
formality everything.formality.hs -e not_true 

# SIC evaluation
formality everything.formality.hs -s -f not_true 

# Type-checking
formality everything.formality.hs -t add
formality everything.formality.hs -t add-comm
```

## Examples
<a name="examples"/>

Formality is a very simple language. Its programs are composed of just two building blocks: inductive datatypes, which represent data formats, and functions, which represent computations over those types of data. And that's all you need.

### Simple types
<a name="simple-types"/>

One of the simplest types, the boolean, can be declared as:

```haskell
data Bool : Type
| true    : Bool
| false   : Bool
```

And the negation function as:

```haskell
let not(b : Bool) =>
    case b  -> Bool
    | true  => Bool.false
    | false => Bool.true
```

Pattern-matching is used everytime we want to inspect the value of a datatype.

### Recursive types
<a name="recursive-types"/>

One of the simplest recursive types, the natural number, can be declared as:

```haskell
data Nat : Type
| succ   : (n : Nat) -> Nat
| zero   : Nat
```

And a function that doubles it can be written as:

```haskell
let double(a : Nat) =>
    case a       -> Nat
    | succ(pred) => Nat.succ(Nat.succ(fold(pred)))
    | zero       => Nat.zero
```

Since Formality is total, recursion is performed by using the `fold` keyword, which is available inside cases of a pattern-match. It allows us to recursivelly apply the same logic to structurally smaller values.

### Polymorphic types
<a name="polomorphic-types"/>

Types can be easily parameterized:

```haskell
data Pair<A : Type, B : Type> : Type
| new : (x : A, y : B) -> Pair
```

Declaring polymorphic functions is as simple as taking types as arguments:

```haskell
let fst(A : Type, B : Type, pair : Pair<A, B>) =>
    case pair   -> A
    | new(x, y) => x
```

That allows you to reuse the same implementation of a function for multiple concrete types, a powerful, ancient trick that certain "modern system languages" surprisingly couldn't get right.

### Dependent types
<a name="dependent-types"/>

Formality allows types to be parameterized not only by other static types, but by runtime values: we call those "indices". The classic `Vector` type, with a length that is symbolically known at compile time, can be declared as:

```haskell
data Vect<A : Type> : (n : Nat) -> Type
| cons : (n : Nat, x : A, xs : Vect(n)) -> Vect(Nat.succ(n))
| nil  : Vect(Nat.zero)
```

When pattern-matching on those, we can specify a return type that depends on indices:

```haskell
let tail(A : Type, n : Nat, vect : Vect<A>(Nat.succ(n))) =>
    case vect        -> (n) => Vect<A>(pred(n))
    | cons(n, x, xs) => xs
    | nil            => Vect<A>.nil
```

This allows us to write powerful type-safe functions, such as an indexing function over vectors that can't overflow. We can also use the `self` keyword to refer to the matched structure itself, allowing us to express mathematical induction (see examples).

### Theorem Proving
<a name="theorem-proving"/>

Those features allow Formality to express theorems as types. For example, mathematical equality can be defined as:

```haskell
data Eq<A : Type> : (x : A, y : A) -> Type
| refl : (x : A) -> Eq(x, x)
```

And the proof that `a == b` implies `b == a` is just:

```haskell
let sym(A : Type, a : A, b : A, e : Eq<A>(a, b)) =>
    case e    -> (a, b) => Eq<A>(b, a)
    | refl(x) => Eq<A>.refl(x)
```

With that much expressivity, Formality types can be seen as a "language of specifications". We can, for example, write "the type of sorted lists", "the type of prime numbers >10", or even "the type of smart contracts that can't be drained".

### Optimal Evaluation
<a name="optimal-evaluation"/>

The following Formality program:

```haskell
id(1000000000(List<Bool>, map(Bool, Bool, not), list))
```

Flips every bit in a list of 100 bits, a billion times. It prints the correct output in `0.03s`. You could increase that to beyound the number of stars in the universe, and it'd still output the correct result, instantly. No, your computer isn't doing that many operations: that's possible because Formality is compiled to [SIC](https://github.com/MaiaVictor/Symmetric-Interaction-Calculus), an optimal evaluator for functional programs. That allows it to exploit insane runtime optimizations that no other language can, making it often faster than decades-old compilers such as GHC.

### More examples
<a name="more-examples"/>

For more of those examples, please check the [`/examples`](https://github.com/MaiaVictor/Formality/tree/master/examples) directory.

## Warning
<a name="warning"/>

Formality is still at an experimental stage. There are missing features and code probably has bugs. Do not use it use on rocket engines. See [this thread](https://www.reddit.com/r/haskell/comments/9ojicd/sneak_peek_of_formality_a_language_combining/) for more info.
