Kind2
=====

Kind2 is a pure functional, lazy, non-garbage-collected, general-purpose,
dependently typed programming language focusing on performance and usability. It
features a blazingly fast type-checker that runs on the
[HVM](https://github.com/kindelia/hvm) via
[NbE](https://en.wikipedia.org/wiki/Normalisation_by_evaluation). It can also
compile programs to HVM and [Kindelia](https://github.com/kindelia/kindelia),
and can be used to prove and verify mathematical theorems.

Example
-------

Kind2 functions can be defined using an equational notation that is highly
inspired by Haskell, Idris and Agda:

```c
List.map <a: Type> <b: Type> (x: (List a)) (f: (x: a) b) : (List b)
List.map a b (Nil t)       f = (Nil b)
List.map a b (Cons t x xs) f = (Cons b (f x) (List.map xs f))
```

But they can also be defined in a conventional notation that is highly inspired
by Rust and TypeScript:

```c
// Note: syntax on development
// Prints the double of many numbers
Main : (IO (Result () String)) {
  ask limit = (IO.prompt "Enter limit:");
  for x in (List.range limit) {
    (IO.print "{} * 2 = {}" x (Nat.double x));
  }
  return (Ok ());
}
```

Mathematical proofs are present as well:

```c
// For every number `a` and `b`, `a + b == b + a`
Nat.commutes (a: Nat) (b: Nat) : (Nat.add a b) == (Nat.add b a)
Nat.commutes Zero     b = (Nat.comm.a b)
Nat.commutes (Succ a) b =
  let e0 = (Equal.apply @x(Succ x) (Nat.commutes a b))
  let e1 = (Equal.mirror (Nat.commutes.b b a))
  (Equal.chain e0 e1)
```

For more examples, check the [Wikind](https://github.com/kindelia/wikind).

Usage
-----

1. Install:

```
cargo install --path .
```

2. Check a Kind2 file:

```
kind2 check example.kind2
```

3. Eval the Main term:

```
kind2 eval example.kind2
```

4. Compile to HVM:

```
kind2 to-hvm example.kind2
```

5. Compile to Kindelia:

```
kind2 to-kdl example.kind2
```

Benchmarks
----------

### Type-Checker

TODO

### Runtime

TODO
