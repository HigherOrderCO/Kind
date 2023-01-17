<div align="center">

![banner]

---

&nbsp;

[![crates.io][crates.io-badge]][crates.io]
[![discord.invite][discord.badge]][discord.invite]
![build.badge]

**Kind** is a **pure functional programming language** and **proof assistant**.

[Getting started](#getting-started) •
[Examples](#examples) •
[Installation](#installation)

</div>

# Getting started

It is a complete rewrite of [Kind1](https://github.com/kindelia/kind-legacy), based on
[HVM](https://github.com/kindelia/hvm), a **lazy**, **non-garbage-collected** and **massively parallel** virtual
machine. In [our benchmarks](https://github.com/kindelia/functional-benchmarks), its type-checker outperforms every
alternative proof assistant by a far margin, and its programs can offer exponential speedups over Haskell's GHC. Kind2
unleashes the [inherent parallelism of the Lambda
Calculus](https://github.com/VictorTaelin/Symmetric-Interaction-Calculus) to become the ultimate programming language of
the next century.

<div align="center"><b>Welcome to the inevitable parallel, functional future of computers! </b></div>

## Examples

Pure functions are defined via equations, as in [Haskell](https://www.haskell.org/):

```javascript
// Applies a function to every element of a list
map <a> <b> (list: List a) (f: a -> b) : List b
map a b Nil              f = Nil
map a b (Cons head tail) f = Cons (f head) (map tail f)
```

Theorems can be proved inductively, as in [Agda](https://wiki.portal.chalmers.se/agda/pmwiki.php) and [Idris](https://www.idris-lang.org/):

```javascript
// Black Friday Theorem. Proof that, for every Nat n: n * 2 / 2 == n.
black_friday_theorem (n: Nat) : Equal Nat (Nat.half (Nat.double n)) n
black_friday_theorem Nat.zero     = Equal.refl
black_friday_theorem (Nat.succ n) = Equal.apply (x => Nat.succ x) (black_friday_theorem n)
```

For more examples, check the [Wikind](https://github.com/kindelia/wikind).

# Installation

First, install [Rust](https://www.rust-lang.org/tools/install) first, then enter:

```
cargo install kind2
```

Then, use any of the commands below:

Command    | Usage                     | Note
---------- | ------------------------- | --------------------------------------------------------------
Check      | `kind2 check  file.kind2` | Checks all definitions.
Eval       | `kind2 eval   file.kind2` | Runs using the type-checker's evaluator.
Run        | `kind2 run    file.kind2` | Runs using HVM's evaluator, on Rust-mode.
To-HVM     | `kind2 to-hvm file.kind2` | Generates a [.hvm](https://github.com/kindelia/hvm) file. Can then be compiled to a rust crate using HVM.
To-KDL     | `kind2 to-kdl file.kind2` | Generates a [.kdl](https://github.com/kindelia/kindelia) file. Can then be deployed to [Kindelia](https://github.com/kindelia/kindelia).

The rust crate can be generated via HVM:

```
kind2 to-hvm file.kind2 > file.hvm
hvm compile file.hvm
```

---

- If you need support related to Kind, email [support.kind@kindelia.org](mailto:support.kind@kindelia.org)

- For Feedbacks, email [kind@kindelia.org](mailto:kind@kindelia.org)

- To ask questions and join our community, check our [Discord Server](https://discord.gg/kindelia).


[banner]: ./img/banner.png

[crates.io-badge]: https://img.shields.io/crates/v/kind2?style=flat-square
[crates.io]: https://crates.io/crates/zoxide

[discord.badge]: https://img.shields.io/discord/912426566838013994?style=flat-square
[discord.invite]: https://discord.gg/kindelia

[build.badge]: https://img.shields.io/github/actions/workflow/status/kindelia/kind/ci.yml?style=flat-square