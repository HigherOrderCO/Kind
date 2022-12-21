Kind2
=====

**Kind2** is a **functional programming language** and **proof assistant**.

It is a complete rewrite of [Kind1](https://github.com/kindelia/kind-legacy), based on
[HVM](https://github.com/kindelia/hvm), a **lazy**, **non-garbage-collected** and **massively parallel** virtual
machine. In [our benchmarks](https://github.com/kindelia/functional-benchmarks), its type-checker outperforms every
alternative proof assistant by a far margin, and its programs can offer exponential speedups over Haskell's GHC. Kind2
unleashes the [inherent parallelism of the Lambda
Calculus](https://github.com/VictorTaelin/Symmetric-Interaction-Calculus) to become the ultimate programming language of
the next century.

**Welcome to the inevitable parallel, functional future of computers!**

Examples
--------

Pure functions are defined via equations, as in [Haskell](https://www.haskell.org/):

```javascript
// Applies a function to every element of a list
map <a> <b> (list: List a) (f: a -> b) : List b
map a b Nil              f = Nil
map a b (Cons head tail) f = Cons (f head) (map tail f)
```

Side-effective programs are written via monads, resembling [Rust](https://www.rust-lang.org/) and [TypeScript](https://www.typescriptlang.org/):

```javascript
// Prints the double of every number up to a limit
Main : IO (Result () String) {
  ask limit = IO.prompt "Enter limit:"
  for x in (List.range limit) {
    IO.print "{} * 2 = {}" x (Nat.double x)
  }
  return Ok ()
}
```

Theorems can be proved inductivelly, as in [Agda](https://wiki.portal.chalmers.se/agda/pmwiki.php) and [Idris](https://www.idris-lang.org/):

```javascript
// Black Friday Theorem. Proof that, for every Nat n: n * 2 / 2 == n.
black_friday_theorem (n: Nat) : Equal Nat (Nat.half (Nat.double n)) n
black_friday_theorem Nat.zero     = Equal.refl
black_friday_theorem (Nat.succ n) = Equal.apply (x => Nat.succ x) (black_friday_theorem n)
```

For more examples, check the [Wikind](https://github.com/kindelia/wikind).

Usage
-----

First, install [Rust](https://www.rust-lang.org/tools/install) first, then enter:

```
cargo install kind2
```

### Warning:
New versions probably are not in `cargo`, so you can install the current version of kind2 by following these instructions:

1. Install Rust Nightly Toolchain
2. Clone the repository
3. `cargo install --path crates/kind-cli --force`

Then, use any of the commands below:

Command    | Usage                     | Note
---------- | ------------------------- | --------------------------------------------------------------
Check      | `kind2 check  file.kind2` | Checks all definitions.
Eval       | `kind2 eval   file.kind2` | Runs using the type-checker's evaluator.
Run        | `kind2 run    file.kind2` | Runs using HVM's evaluator, on Rust-mode.
To-HVM     | `kind2 to-hvm file.kind2` | Generates a [.hvm](https://github.com/kindelia/hvm) file. Can then be compiled to C.
To-KDL     | `kind2 to-kdl file.kind2` | Generates a [.kdl](https://github.com/kindelia/kindelia) file. Can then be deployed to [Kindelia](https://github.com/kindelia/kindelia).

Executables can be generated via HVM:

```
kind2 to-hvm file.kind2
hvm compile file.hvm
clang -O2 file.c -o file
./file
```


---

- If you need support related to Kind, email [supportkind@kindelia.org](mailto:supportkind@kindelia.org)

- For Feedbacks, email [kind@kindelia.org](mailto:kind@kindelia.org)

- To ask questions and join our community, check our [Discord Server](discord.gg/kindelia).
