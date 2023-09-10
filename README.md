<div align="center">

![banner]

&nbsp;

[![crates.io][crates.io-badge]][crates.io]
[![discord.invite][discord.badge]][discord.invite]
![build.badge]

**Kind** is a **pure functional programming language** and **proof assistant**.

[Getting started](#getting-started) •
[Examples](#examples) •
[Installation](#installation)

&nbsp;

</div>

# Getting started

It is a complete rewrite of [Kind1](https://github.com/HigherOrderCO/Kind-Legacy), based on
[HVM](https://github.com/HigherOrderCO/HVM), a **lazy**, **non-garbage-collected** and **massively parallel** virtual
machine. In [our benchmarks](https://github.com/HigherOrderCO/Functional-Benchmarks), its type-checker outperforms every
alternative proof assistant by a far margin, and its programs can offer exponential speedups over Haskell's GHC. Kind2
unleashes the [inherent parallelism of the Lambda
Calculus](https://github.com/VictorTaelin/Interaction-Calculus) to become the ultimate programming language of
the next century.

<div align="center"><b>Welcome to the inevitable parallel, functional future of computers! </b></div>

## Examples

Pure functions are defined via equations, as in [Haskell](https://www.haskell.org/):

```javascript
// Applies a function to every element of a list
Map <a> <b> (list: List a) (f: a -> b) : List b
Map a b Nil              f             = Nil
Map a b (Cons head tail) f             = Cons (f head) (Map tail f)
```

Theorems can be proved inductively, as in [Agda](https://wiki.portal.chalmers.se/agda/pmwiki.php) and [Idris](https://www.idris-lang.org/):

```javascript
// Black Friday Theorem. Proof that, for every Nat n: n * 2 / 2 == n.
BlackFridayTheorem (n: Nat)     : Equal Nat (Nat.half (Nat.double n)) n
BlackFridayTheorem Nat.zero     = Equal.refl
BlackFridayTheorem (Nat.succ n) = Equal.apply (x => Nat.succ x) (BlackFridayTheorem n)
```

For more examples, check the [Kindex](https://github.com/HigherOrderCO/Kindex).

# Installation

First, install [Rust](https://www.rust-lang.org/tools/install) first, then enter:

```
cargo +nightly install kind2
```

Then, use any of the commands below:

Command    | Usage                     | Note
---------- | ------------------------- | --------------------------------------------------------------
Check      | `kind2 check  file.kind2` | Checks all definitions.
Eval       | `kind2 eval   file.kind2` | Runs using the type-checker's evaluator.
Run        | `kind2 run    file.kind2` | Runs using HVM's evaluator, on Rust-mode.
To-HVM     | `kind2 to-hvm file.kind2` | Generates a [.hvm](https://github.com/higherorderco/hvm) file. Can then be compiled to a rust crate using HVM.
To-KDL     | `kind2 to-kdl file.kind2` | Generates a [.kdl](https://github.com/higherorderco/kindelia) file. Can then be deployed to [Kindelia](https://github.com/higherorderco/kindelia).

The rust crate can be generated via HVM:

```
kind2 to-hvm file.kind2 > file.hvm
hvm compile file.hvm
```

---

- If you need support related to Kind, email [support.kind@kindelia.org](mailto:support.kind@higherorderco.com)

- For Feedbacks, email [kind@higherorderco.com](mailto:kind@higherorderco.com)

- To ask questions and join our community, check our [Discord Server](https://discord.gg/kindelia).


[banner]: ./img/banner.png

[crates.io-badge]: https://img.shields.io/crates/v/kind2?style=flat-square
[crates.io]: https://crates.io/crates/zoxide

[discord.badge]: https://img.shields.io/discord/912426566838013994?style=flat-square
[discord.invite]: https://discord.gg/kindelia

[build.badge]: https://img.shields.io/github/actions/workflow/status/kindelia/kind/ci.yml?style=flat-square
