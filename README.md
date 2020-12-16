Formality
=========

A modern programming language featuring formal proofs. Now written in itself!

Why formal proofs?
------------------

When most people hear about formal proofs, they naturally think about
mathematics and security, or, "boring stuff". While it is true that formal
proofs can be used to formalize theorems and verify software correctness,
Formality's approach is different: we focus on using proofs as a tool to
**enhance developer productivity**.

There is little doubt left that adding types to untyped languages greatly
increases productivity, specially when the codebase grows past a certain point:
just see the surge of TypeScript. Formal proofs are, in a way, an evolution of
the simple types used in common languages.

We believe that proofs are superpowers waiting to be explored, and the proper
usage of them can enhance the productivity of a developer in a disruptive
manner: think of Haskell's Hackage on steroids. Formality was designed to
explore and enable that side of formal proofs, and we'll be publishing more
about that soon.

Why Formality?
--------------

There are some interesting proof languages, or proof assistants, as they're often
called, in the market. [Agda], [Coq], [Lean], [Idris], to name a few. But these (perhaps with exception of Idris, which we love!)
aren't aligned with the vision highlighted above, in some key aspects:

### Auditability

Formality is entirely compiled to a small [trusted core] that has
700 lines of code. This is 1 to 2 orders of magnitude smaller than existing
alternatives. Because of that, auditing Formality is much easier, decreasing the
need for trust and solving the "who verifies that the verifier" problem.

### Portability

Being compiled to such a small core also allows Formality to be easily compiled
to multiple targets, making it very portable. For example, out
[Formality-to-Haskell] compiler was developed in an evening
and has less than 1000 lines of code. This allows Formality to be used as a a
lazy, pure functional language that is compiled directly by Haskell's GHC.

### Performance

Formality has a long-term approach to performance: make the language fast in
theory, then build great compilers for each specific target. Our [JavaScript
compiler], for example, is tuned to generate small, fast JS, allowing Formality
to be used for web development. Other targets may have different optimizations,
and we're constantly researching new ways of evaluating functional programs; see
our post about interaction nets and optimal reduction ([Absal]).

[trusted core]: https://github.com/moonad/formcorejs

[Formality-to-Haskell]: https://github.com/moonad/FormCoreJS/blob/master/FmcToHs.js

[formality.js]: https://github.com/moonad/FormalityFM/blob/master/bin/js/src/formality.js

[Agda]: https://github.com/agda/agda

[Idris]: https://github.com/idris-lang/Idris-dev

[Coq]: https://github.com/coq/coq

[Lean]: https://github.com/leanprover/lean

[Absal]: https://medium.com/@maiavictor/solving-the-mystery-behind-abstract-algorithms-magical-optimizations-144225164b07

[JavaScript compiler]:https://github.com/moonad/FormCoreJS/blob/master/FmcToJs.js

### Market Readiness

For a programming language to be used in real-world applications, it must
satisfy certain minimal requirements. It must have a great package manager, a
good editor, friendly error messages, a fast compiler and a clear, non-cryptic
syntax that everyone can use and understand. All of these are non-goals for some
of the existing alternatives, but are high priorities for Formality.

Usage
-----

1. Install

    Using the JavaScript release (`fmjs`):

    ```bash
    npm i -g formality-js
    ```

    Using the Haskell release (uses `fmhs` instead of `fmjs`):

    ```bash
    git clone https://github.com/moonad/formality
    cd formality/bin/hs
    cabal build
    cabal install
    ```

2. Clone the base libraries

    ```bash
    git clone https://github.com/moonad/formality
    cd formality/src
    ```

3. Edit, check and run

    Edit `Main.fm` on `formality/src` to add your code:

    ```c
    Main: IO(Unit)
      do IO {
        IO.print("Hello, world!")
      }
    ```

    Type-check to see errors and goals:

    ```bash
    fmjs Main.fm
    ```

    Run to see results:

    ```bash
    fmjs Main --run
    ```

    Since Formality doesn't have a module system yet, you must be at
    `formality/src` to use the base types (lists, strings, etc.). In this early
    phase, we'd like all the development to be contained in that directory. Feel
    encouraged to send your programs and proofs as a PR!

Quick Introduction
------------------

### A simple, clear, and unsurprising syntax

> If you can't explain it simply, you don't understand it well enough.

Why make it hard? Formality aims to frame advanced concepts in ways that
everyone can understand. For example, if you ask a Haskeller to sum a list of
positive ints (Nats), they might write:

```c
sum(list: List(Nat)): Nat
  case list {
    nil  : 0
    cons : list.head + sum(list.tail)
  }

Main: IO(Unit)
  do IO {
    IO.print("Sum is: " | Nat.show(sum([1, 2, 3])))
  }
```

Or, if they are enlightened enough:

```c
sum(list: List(Nat)): Nat
  List.fold<_>(list)<_>(0, Nat.add)

Main: IO(Unit)
  do IO {
    IO.print("Sum is: " | Nat.show(sum([1, 2, 3])))
  }
```

But, while recursion and folds are nice, this is fine too:

```c
sum(list: List(Nat)): Nat
  let sum = 0
  for x in list:
    sum = x + sum
  sum
```

The code above isn't impure, Formality translates loops to pure folds. It is
just written in a way that is more familiar to some. Proof languages are already
hard enough, so why make syntax yet another obstacle?

*(You can test the examples above by editing `Main.fm`, and typing `fmjs Main.fm`
and `fmjs Main --run` on the `Formality/src` directory.)*

### Powerful types

Let's now see how to write structures with increasingly complex types. Below is
the simple list, a "variant type" with two constructors, one for the `empty`
list, and one to `push` a positive number (`Nat`) to another list:

```c
// NatList is a linked list of Nats
type NatList {
  empty
  push(head: Nat, tail: NatList)
}
```

As usual, we can make it **more generic** with polymorphic types:

```c
// List is a linked list of A's (for any type A)
type List (A: Type) {
  empty
  push(head: A, tail: List(A))
}
```

But we can make it **more specific** with indexed types:

```c
// Vector is a linked list of Nats with a statically known size
type Vector ~ (len: Nat) {
  empty                                        ~ (len: 0) 
  push(len: Nat, head: Nat, tail: Vector(len)) ~ (len: 1 + len)
}
```

The type above isn't of a *fixed length* list, but of one that has a length that
is *statically known*. The difference is that we can still grow and shrink it,
but we can't, for example, get the `head` of an empty list. For example:

```c
Main: IO(Unit)
  def list = [1,2,3]
  def vect = Vector.from_list<Nat>(list)
  def head = Vector.head<Nat,_>(vect)
  do IO {
    IO.print("First is: " | Nat.show(head))
  }
```

Works fine, but, if you change the list to be empty, it will result in a type
error! This is in contrast to Haskell, where `head []` results in a runtime
crash. **Formality programs can't crash. Ever!**

*(You can also check the program above by editing `Main.fm`.)*

### Theorem proving

Proof languages go beyond checking lengths though. Everything you can think of
can be statically verified by the type system. With subset types, written as 
`{x: A} -> B(x)`, you can restrict a type arbitrarily. For example, here we use
subsets to represent even numbers:

```c
// An "EvenNat" is a Nat `x`, such that `(x % 2) == 0`
EvenNat: Type
  {x: Nat} (x % 2) == 0

six_as_even: EvenNat
  6 ~ refl
```

This program only type-checks because `6` is even: try changing it to `7` and it
will be a type error! But what about `~ refl`? This is a **proof** that `6` is
indeed even. Since `6` is a compile-time constant, it is very easy for Formality
to verify that it is even (it just needs to run `6 % 2`), so we write `refl`,
which stands for "reflexive", or "just reduce it". 

But what if it was an expression instead? For example, what if we wanted to
write a function that receives a Nat `x`, and returns `x*2` as an EvenNat? It
makes sense because the double of every number is even. But if we just write:

```c
double_as_even(n: Nat): EvenNat
  (2 * n) ~ refl
```

Formality will complain:

```
Type mismatch.
- Expected: Nat.mod(Nat.double(n),2) == 0
- Detected: 0 == 0
```

That's because Formality doesn't know that `(n*2)%2 == 0` is necessarily true
for every `n`. We need to convince the type-checker by proving it. Proofs are
like functions, we just create a separate function that, given a `n: Nat`,
returns a proof that `((n*2)%2)==0`. That proof will be done by case analysis
and induction, but we won't get into details on how it works; for now, suffice
to say it is just pattern-matching and recursion. Here is it:

```c
EvenNat: Type
  {x: Nat} (x % 2) == 0

six_as_even: EvenNat
  6 ~ refl

double_as_even(n: Nat): EvenNat
  (2 * n) ~ double_is_even(n)

double_is_even(n: Nat): ((2 * n) % 2) == 0
  case n {
    zero: refl
    succ: double_is_even(n.pred)
  }!
```

To sum up, `EvenNat` is the type of `Nat`s that are even. `six_as_even` is just
the number `6`, viewed as an `EvenNat`; since Formality can verify that 6 is
even, we write `~ refl` on it. `double_as_even` is a function that, for any
`Nat` `n`, returns `n*2` as an `EvenNat`. Formality can't verify that `n*2` is
always even by itself, so, to convince it, we write a separate proof called
`double_is_even(n)`.

For a quick tutorial on how to prove theorems in Formality, check
[THEOREMS.md](THEOREMS.md).


More information
----------------

For a list of available syntaxes, check [SYNTAX.md](SYNTAX.md).

For a tutorial about theorem proving, check [THEOREMS.md](THEOREMS.md).

If you're brave, browse the [base libraries](https://github.com/moonad/Formality/tree/master/src).

Join our [Telegram chat room](https://t.me/formality_lang)! 
