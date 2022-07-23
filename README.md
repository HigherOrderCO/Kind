Kind2
=====

Kind2 is a pure functional, lazy, non-garbage-collected, general-purpose,
dependently typed programming language focusing on performance and usability. It
features a blazingly fast type-checker based on **optimal
[normalization-by-evaluation](https://en.wikipedia.org/wiki/Normalisation_by_evaluation)**. It can also
compile programs to [HVM](https://github.com/kindelia/hvm) and [Kindelia](https://github.com/kindelia/kindelia),
and can be used to prove and verify mathematical theorems.

Examples
--------

Pure functions can be defined using an equational notation that resembles [Haskell](https://www.haskell.org/):

```idris
List.map <a: Type> <b: Type> (x: (List a)) (f: (x: a) b) : (List b)
List.map a b (Nil t)       f = (Nil b)
List.map a b (Cons t x xs) f = (Cons b (f x) (List.map xs f))
```

Mathematical theorems can be proved via inductive reasoning, as in [Idris](https://www.idris-lang.org/) and [Agda](https://wiki.portal.chalmers.se/agda/pmwiki.php):

```idris
Nat.commutes (a: Nat) (b: Nat) : (Nat.add a b) == (Nat.add b a)
Nat.commutes Zero     b = (Nat.comm.a b)
Nat.commutes (Succ a) b =
  let e0 = (Equal.apply @x(Succ x) (Nat.commutes a b))
  let e1 = (Equal.mirror (Nat.commutes.b b a))
  (Equal.chain e0 e1)
```

Normal programs can be written in a monadic syntax that is inspired by [Rust](https://www.rust-lang.org/) and [TypeScript](https://www.typescriptlang.org/):

```idris
Main : (IO (Result () String)) {
  ask limit = (IO.prompt "Enter limit:")
  for x in (List.range limit) {
    (IO.print "{} * 2 = {}" x (Nat.double x))
  }
  return (Ok ())
}
```

For more examples, check the [Wikind](https://github.com/kindelia/wikind).

Installation
------------

Install [Rust](https://www.rust-lang.org/tools/install) first, then enter:

```
cargo install kind2
```

Enter `kind2` on the terminal to make sure it worked.

Usage
-----

Command    | Usage                     | Note
---------- | ------------------------- | --------------------------------------------------------------
Check      | `kind2 check  file.kind2` | Checks all definitions.
Eval       | `kind2 eval   file.kind2` | Runs using the type-checker's evaluator.
Run        | `kind2 run    file.kind2` | Runs using HVM's evaluator, on Rust-mode.
To-HVM     | `kind2 to-hvm file.kind2` | Generates a [.hvm](https://github.com/kindelia/hvm) file. Can then be compiled to C.
To-KDL     | `kind2 to-kdl file.kind2` | Generates a [.kdl](https://github.com/kindelia/kindelia) file. Can then be deployed to Kindelia.

Benchmarks
----------

In preliminary [benchmarks](/bench), Kind2's type-checker has outperformed Agda, Idris by 90x to 900x, which is an expressive difference. That said, we only tested a few small programs, so there isn't enough data to draw a conclusion yet. We're working on a more extensive benchmark suite. 
