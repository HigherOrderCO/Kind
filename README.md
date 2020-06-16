![](https://raw.githubusercontent.com/moonad/Assets/master/images/formality-banner-white.png)

An lightweight proof-gramming language. It aims to be:

- **Fast:** no garbage-collection, optimal beta-reduction, massively parallel compilers.

- **Secure:** a powerful type system capable of proving mathematical theorems.

- **Portable:** the entire language desugars to a 500 lines core type-theory.

Explore our ecossystem at [moonad.org](http://moonad.org) and come hang out with us [on Telegram](https://t.me/formality_lang).

Table of contents
=================

- [Motivation](#motivation)
- [Examples](#examples)
- [Installation](#installation)
- [Commands](#commands)
- [Introduction](#introduction)
- [Principles](#principles)
- [Booleans](#booleans)

Motivation
==========

> Knowing mathematics and programming might one day be one... fills you with determination.

Formality is the first programming language that features *theorem proving* and
is simultaneously user-friendly, efficient and portable. Proof languages often
have complex syntaxes that make them inaccessible to non-experts. Formality
promotes a simple, clean syntax that feels familiar to common developers. Proof
languages also tend to focus more on type-checking than on actually running
programs. Formality prioritizes evaluation from the beginning, providing solid
compilers to common targets such as JavaScript, Haskell and the EVM, and
researching novel compilation techniques that may provide practical benefits, as
well as asymptotical speedups over existing ones; check [this
article](https://medium.com/@maiavictor/solving-the-mystery-behind-abstract-algorithms-magical-optimizations-144225164b07)
for an example. Finally, proof languages tend to be complex and big, which makes
unportable and hard to audit. Formality compiles entirely to a [500
lines-of-code core type-theory](https://github.com/moonad/Formality/blob/master/javascript/FormalityCore.js),
making it extremely portable and easily auditable.

> "In the Truth Mines though, the tags weren't just references; they included
> complete statements of the particular definitions, axioms, or theorems the
> objects represented. The Mines were self-contained: every mathematical result
> that fleshers and their descendants had ever proven was on display in its
> entirety. The library's exegesis was helpful - but the truths themselves were
> all there."
>
> *Diaspora*, Greg Egan

Examples
========

- Adding all numbers of a list:

    ```haskell
    List.sum(xs: List(Nat)) : Nat
      case xs:
      | Nat.zero;
      | Nat.add(xs.head, List.sum(xs.tail));
    ```

- A proof that negating a bool twice returns the same bool:

    ```haskell
    Bool.double_negation_theorem(b: Bool): Equal(_, Bool.not(Bool.not(b)), b)
      case b
      | Equal.to<_, Bool.true>;
      | Equal.to<_, Bool.false>;
      : Equal(_, Bool.not(Bool.not(b.self)), b.self);
    ```

- Extracting the first element of a list statically checked to be non-empty:

    ```haskell
    List.head<A: Type>(xs: List(A), not_empty: List.not_empty<A>(xs)) : A
      case xs:
      with is_empty : List.not_empty<A>(xs.self) = not_empty;
      | Empty.absurd(is_empty, A);
      | xs.head;
    ```

TODO: include examples of Python-looking Formality for non-FP people.

TODO: link the upcoming "Why proof languages matter?" Moonad post.


Installation
============

1. Install [npm](https://www.npmjs.com/get-npm) in your system.

2. Install the language with `npm i -g formality-lang`.

3. Clone the Moonad libraries: `git clone http://github.com/moonad/moonad`.

4. Enter the directory with `cd moonad`.

5. Type `fm`.

This will type-check every `.fm` file on the `moonad` directory For more
information and commands, check the [documentation](DOCUMENTATION.md).

Commands
========

The commands below load all `.fm` files in the current directory.

- `fm`: type-checks all top-level definitions.

- `fm name`: evaluates a term.

- `fmjs name`: compiles a term to JavaScript.

- `fmio name`: compiles a term to JavaScript and runs.

- `fmx name`: compiles a term to [interaction nets](https://medium.com/@maiavictor/solving-the-mystery-behind-abstract-algorithms-magical-optimizations-144225164b07) and runs.

- `fm2fmc`: compiles all terms to Formality-Core.

The commands below load all `.fmc` files in the current directory.

- `fmc`: type-checks all top-level definitions.

Introduction
============

This is the "Hello, World!" in Formality:

```javascript
main: SimpleIO(Unit)
  SimpleIO.print("Hello, world!")
```

To run it, save this file `main.fm` and type `fmio main`. This will download
some dependencies, compile it to JavaScript and run, printing `Hello, world` to
the console. Here, [`SimpleIO.print`](http://moonad.org/p/0x0000000000000040) is
just a definition on [moonad.org](http://moonad.org). In Formality, there is no
such a thing as packages. Instead, once a definition is posted on Moonad, it is
globally available for all other users. That's because, by philosophy, Formality
is a very small language that is extended by its own users every time some code
is posted on Moonad.

You can also type-check that file by running `fm main`, and you can compile it
to JavaScript, run `fmjs main`. The generated code is highly optimized and uses
native structures whenever possible.

For a bigger example, run this with `fmio main`:

```javascript
main: SimpleIO(Unit)
  do SimpleIO {
    var name = SimpleIO.query("What is your name?");
    SimpleIO.print(String.concat("Welcome, ", name));
  }
```

Since Formality is a pure functional language, it has no built-in notion of
side-effects (like printing), but we can still **describe** then: that's what
the `SimpleIO` type does, using monads. But what are monads? Simple, monads are
just... things that you must not worry about for now. Let's focus on the
fundamental principles of the language first!

Principles
==========

Formality programs are just a series of top-level definitions: datatype
declarations and functions (or proofs). As such, programming in Formality almost
always consists of the following activity:

1. Specify the data formats that are used in your problem.

2. Program functions that transform those data formats.

3. Propose and prove theorems about those.

Of the steps above, 1 and 2 are very familiar to most developers, but 3 is not.
If you're not familiar with dependent types and theorem proving, we suggest you
to check our [theorem proving tutorial](THEOREM_PROVING_TUTORIAL.md) before
proceeding.

Formality Basics
================

The Bool Type
-------------

The first type we're going to write is the boolean. It is a type with by two
values: `true` and `false`. In Formality, we declare it as:

```c
T Bool
| true;
| false;
```

`T` is a keyword to define a new type. `Bool` is the name of the type, and
`true` and `false` are its two values, or **constructors**. This statement adds
`Bool.true : Bool` (Bool.true of type Bool), `Bool.false : Bool` (Bool.false of
type Bool) and `Bool : Type` (Bool of type Type). The `.` here is just part of
the names.

A Bool function
---------------

The simplest boolean function is the negation, i.e., one that converts `true` to
`false` and `false` to `true`. We can implement it by case analysis:

```c
Bool.not(b: Bool): Bool  // Bool.not receives "b of type Bool" and returns "Bool"
  case b:                // Inspect the value of b...
  | false => Bool.false; // If it is true, return false.
  | true  => Bool.true;  // If it is false, return true.
```

In Formality, it isn't necessary to write the name of each case. This function
could be written shortly as:

```c
Bool.not(b: Bool): Bool
  case b:
  | Bool.false;
  | Bool.true;
```

Since case-analysis on `Bool` is universally known as `if`, this also works:

```c
Bool.not(b: Bool): Bool
  if b then
    Bool.false
  else
    Bool.true
```

Both are equivalent.

### Testing

There are two ways to test a program. We can use `SimpleIO` to print values:

```c
Docs.bool_test_0: SimpleIO(Unit)
  SimpleIO.print(Bool.show(Bool.not(Bool.true)))
```

Run with `fmcio Docs.bool_test_0`. This requires us to be able to stringify
those values (here, `Bool.show` is defined on `Bool.fm`). An alternative would
be to just print the values directly, without `SimpleIO`:

```c
Docs.bool_test_1: Bool
  Bool.not(Bool.true)
```

Type `fm Docs.bool_test_0`. This will output `(true) (false) false`, which is
the internal lambda-encoded representation of `Bool.false` (more on that later).
A last alternative would be to type `fmcio Docs.bool_test_1`. Since the program
isn't of type `SimpleIO`, it will output the compiled JavaScript representation of
`Bool.false`. In this case, just `false`, but could be a JS object or function.

A Bool theorem
--------------

Let's first prove that `true == true`. Like on the example on the last section,
it is just a function call. Here, it is called `Equal.to`:

```c
Docs.true_is_true: Equal(Bool, Bool.true, Bool.true)
  Equal.to<Bool, Bool.true>
```

Here, `Equal.to : (A : Type) -> (x : A) -> Equal(A, x, x)`. It returns, for any
type `A`, for any value `x : A`, a proof that `x == x`. To make sure this is
correct, type `fm`. This will make Formality type-check all definitions on the
current directory and let you know if there is any error.

Let's now prove that `not(not(a)) == a`. Since this involes an expression, we
need a function:

```c
Docs.not_not_is_b(b: Bool): Equal(Bool, Bool.not(Bool.not(b)), b)
  Equal.to<Bool, b>
```

Sadly, this alone doesn't work. Here is the error outputted by `fm`:

```c
Found type... Equal(Bool)(b)(b)
Instead of... Equal(Bool)(Bool.not(Bool.not(b)))(b)
With context:
- b : Bool
On line 20:
    16| Docs.true_is_true: Equal(Bool, Bool.true, Bool.true)
    17|   Equal.to<Bool, Bool.true>
    18|
    19| Docs.not_not_is_b(b: Bool): Equal(Bool, Bool.not(Bool.not(b)), b)
    20|   Equal.to<Bool, Bool.true>
    21|
    22| //Docs.bool_show: IO(Unit)
    23|   //IO.print(Bool.show(Bool.true))
```

That's because `Bool.not(Bool.not(b))` is **not** identical to `b`. To make it
work, we need a case analysis:

```c
Docs.not_not_is_b(b: Bool): Equal(Bool, Bool.not(Bool.not(b)), b)
  case b:
  | Equal.to<Bool, Bool.true>;
  | Equal.to<Bool, Bool.false>;
  : Equal(Bool, Bool.not(Bool.not(b.self)), b.self);
```

The last line tells Formality the type returned by the case expression, with one
quirk: we use `b.self` to tell Formality to **specialize** that type using the
concrete value of `b` inside each branch. On the first branch, `b = Bool.true`,
so `Equal(Bool, Bool.not(Bool.not(b.self)), b.self)` is specialized to
`Equal(Bool, Bool.not(Bool.not(Bool.true)), Bool.true)`, which reduces to
`Equal(Bool, Bool.true, Bool.true)`. This allow us to write
`Equal.to<Bool, Bool.true>` identical, we can use `Equal.to`. The same
reasoning goes for the last branch. Once all branches are correctly filled,
Formality **generalizes** `b.self` to the matched value `b`, causing the whole
`case` expression to have type `Equal(Bool, Bool.not(Bool.not(b)), b)`. This
completes our first proof!

The Nat Type
------------

The second type we're going to write is that of natural numbers, i.e.,
non-negative integers. It can be written like this:

```c
T Nat
| zero;
| succ(pred: Nat);
```

In other words, a `Nat` is either `zero`, or the successor of another `Nat`. For
example, `2` is the successor of the successor of `zero`, and can be written as
`Nat.succ(Nat.succ(Nat.zero))`. With the `Nat` type, we're able to uniquely
represent any non-negative integer.

A Nat function
--------------

Let's write the addition on `Nat`:

```c
Nat.add(n: Nat, m: Nat): Nat
  case n:
  | m;
  | Nat.succ(Nat.add(n.pred, m));
```

Notice that Formality's `case` expression allows us to access the fields
contained inside the matched values inside their respective cases, with a
`value.field` name. That is why we can write `n.pred` inside the second case. It
is not a field accessor: `n.pred` is the actual name of the variable.

The way `add` works is by recursing on the first argument, adding 1 to the result
on each recursive call. It can be better explained by an example:

```
add(succ(succ(succ(zero))), succ(succ(zero)))   // add(3, 2)
= succ(add(succ(succ(zero)), succ(succ(zero)))) // 1 + add(2, 2)
= succ(succ(add(succ(zero), succ(succ(zero))))) // 1 + 1 + add(1, 2)
= succ(succ(succ(add(zero, succ(succ(zero)))))) // 1 + 1 + 1 + add(0, 2)
= succ(succ(succ(succ(succ(zero)))))            // 1 + 1 + 1 + 2
```

Since `Nat` is a common type, we can write it with numeric literals, which are
desugared to `Nat.succ(Nat.succ(...Nat.zero))`. Let's test it by adding
`123456789 + 987654321`:

```c
Docs.nat_test: Nat
  Nat.add(123456789, 987654321)
```

Running `fmcio Docs.nat_test` outputs `1111111110n`. That's because Formality
compiles `Nat` to JavaScript `BigInt`, which is a very fast implementation of
integers.

A Nat theorem
-------------

Let's now prove two theorems: `add(0, a) == a` and `add(a, 0) == a`. The first
one is easy:

```c
Docs.0_plus_a_is_a(a: Nat): Equal(Nat, Nat.add(0, a), a)
  Equal.to<Nat, a>
```

That's because, due to the way `Nat.add` was written, `Nat.add(0, a)` reduces to
`a`. This allow us to use `Equal.to` directly. The second theorem is harder,
though. If we try to prove it like the first, we get the following error:

```c
Found type... Equal(Nat)(a)(a)
Instead of... Equal(Nat)(Nat.add(a)(Nat.zero))(a)
With context:
- a : Nat
On line 32:
    28| Docs.0_plus_a_is_a(a: Nat): Equal(Nat, Nat.add(0, a), a)
    29|   Equal.to<Nat, a>
    30|
    31| Docs.a_plus_0_is_a(a: Nat): Equal(Nat, Nat.add(a, 0), a)
    32|   Equal.to<Nat, a>
    33|
    34| //Docs.bool_show: SimpleIO(Unit)
    35|   //SimpleIO.print(Bool.show(Bool.true))
```

That's because `Nat.add` matches on the first argument, which, here, is a
variable, so it gets stuck, not unlike `not(not(b)) == b`. For that reason, we
must proceed by case analysis:

```c
Docs.a_plus_0_is_a(a: Nat): Equal(Nat, Nat.add(a, 0), a)
  case a:
  | Equal.to<Nat, Nat.zero>;
  | let ind = Docs.a_plus_0_is_a(a.pred)
    let app = Equal.apply<Nat, Nat, Nat.add(a.pred, Nat.zero), a.pred, Nat.succ, ind>
    app;
  : Equal(Nat, Nat.add(a.self, 0), a.self);
```

... to be continued ...
