Table of contents
=================

- [Motivation](#motivation)
- [Installation](#installation)
- [Commands](#commands)
- [Introduction](#introduction)
- [Principles](#principles)
- [Booleans](#booleans)

Motivation
==========

> Knowing mathematics and programming might one day be one... fills you with determination.

Formality exists to fill a hole in the current market: there aren't many
languages featuring *theorem proving* that are simple, user-friendly and
efficient. To accomplish that goal, we rely on several design philosophies:

An accessible syntax
--------------------

Proof languages often have complex syntaxes that make an already difficult
subject even more inaccessible. Coq, for example, uses 3 different languages
with completely different rules and tons of reserved words and special tokens.
Agda is clean and beautiful, but relies heavily on unicode and agda-mode, making
it essentially unusable outside of EMACs, which is arguably a “hardcore” editor.
Formality aims to keep a simple, familiar syntax that is much closer to common
languages like Python and JavaScript.  A regular TypeScript developer should,
for example, be able to read our [natural
number](https://github.com/moonad/Base.fm/blob/master/Nat.fm) formalization
without prior knowledge.

Fast and portable "by design"
-----------------------------

Some languages are inherently slow, by design. JavaScript, for example, is
slower than C: all things equal, its mandatory garbage collector will be an
unavoidable disadvantage. Formality is meant to be as fast as theoretically
possible. For example, it has affine lambdas, allowing it to be run without
garbage-collection. It has a strongly confluent interaction-net runtime,
allowing it to be evaluated in massively parallel architectures. It doesn’t
require De Bruijn bookkeeping, making it the fastest “closure chunker” around.
It is lazy, it has a clear cost model for blockchains, it has a small ([600
LOC](https://github.com/moonad/Formality/blob/master/src/fm-net.ts)) runtime
that can easily be ported to multiple platforms. Right now, Formality’s compiler
isn’t as mature as the ones found in decades-old languages, but it has lots of
room for improvement.

An elegant underlying Type Theory
---------------------------------

Formality's unique approach to termination is conjectured to allow it to have
elegant, powerful type-level features that would be otherwise impossible without
causing logical inconsistencies. For example, instead of a complex system of
built-in datatypes, we rely on [Self
Types](https://www.semanticscholar.org/paper/Self-Types-for-Dependently-Typed-Lambda-Encodings-Fu-Stump/652f673e13b889e0fd7adbd480c2fdf290621f66),
which allows us to implement inductive families with native lambdas. That makes
the core theory an order of magnitude simpler, allowing for a short standard and
encouraging independent implementations.

![fm](https://user-images.githubusercontent.com/144776/71642417-62686b80-2cb3-11ea-9bd1-37c1e829d05d.png)

An optimal high-order evaluator
-------------------------------

Formality's substitution algorithm is **asymptotically faster** than Haskell's,
Clojure's, JavaScript's and other closure implementations. This makes it
extremely fast at evaluating high-order programs, combining a Haskell-like
high-level feel with a Rust-like low-level performance curve. For example,
Haskell's stream fusion, a hard-coded, important optimization, happens
naturally, [at
runtime](https://medium.com/@maiavictor/solving-the-mystery-behind-abstract-algorithms-magical-optimizations-144225164b07),
on Formality. This also allows us to explore new ways to develop algorithms,
such as this "impossibly efficient" [exp-mod
implementation](https://medium.com/@maiavictor/calling-a-function-a-googol-times-53933c072e3a).
Who knows if this may lead to new breakthroughs in complexity theory?

![](https://raw.githubusercontent.com/moonad/Assets/master/images/inet-simulation.gif)

> "In the Truth Mines though, the tags weren't just references; they included
> complete statements of the particular definitions, axioms, or theorems the
> objects represented. The Mines were self-contained: every mathematical result
> that fleshers and their descendants had ever proven was on display in its
> entirety. The library's exegesis was helpful - but the truths themselves were
> all there."
>
> *Diaspora*, Greg Egan

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

- `fm`: type-checks all Formality (`.fm`) files on the current directory.

- `fm name`: type-checks and evaluates the Formality term `name`.

Formality (`fm`) is a high-level syntax that desugars to the real underlying
language, Formality-Core (`fmc`). As such, running `fm` generates several `.fmc`
files on the `.fmc/` directory. You can then run the following commands there:

- `fmc`: type-checks all Formality-Core (`.fmc`) files on the current directory.

- `fmc name`: type-checks and evaluates the Formality-Core term `name`.

- `fmcjs name`: compiles term `name` to a JavaScript (CommonJS) module.

- `fmchs name`: compiles term `name` to a Haskell module.

- `fmcio name`: evaluates term `name` of type `IO(Unit)`.

- `fmcx`: evaluates term `name` optimally, using interaction nets.

Introduction
============

To start, make sure to have Formality installed and to be inside the `moonad`
directory. That's because it includes many functions we'll be using on this
documentation. This is the "Hello, World!" in Formality:

```haskell
Docs.hello: IO(Unit)
  IO.print("Hello, world!")
```

It is already available on `moonad/Docs.fm`.  To run it, type `fm` on the
`moonad` directory. This will generate a bunch of files in a `.fmc` directory.
Then type `fmcio Docs.hello`. You should see "Hello, world!".

Since Formality is a pure functional language, it has no built-in notion of
side-effects (like printing), but we can still **describe** then. That's what
the IO type does: it allows side-effects to be stated purely and combined with
monads, usually inside `do` blocks:

```
Docs.welcome: IO(Unit)
  do IO.bind IO.end {
    var name = IO.query("What is your name?");
    IO.print(String.concat("Welcome, ", name));
    return Unit.new;
  }
```

But what are monads? Simple, monads are just... things that you must not worry
about for now. See, it is tempting to teach monads in the beginning of
functional programming materials, but we believe that is the wrong approach.
Instead, we must focus on the building blocks, the foundamental principles that
eventually lead to understanding what monads are. That's what we are going to
do. Forget about IO, printing and let's learn Formality from **principles**.

Principles
==========

Formality programs are just a series of types describing data formats, functions
describing data transformations and proofs of theorems about those data types
and functions. To be honest, datatypes and proofs are themselves functions, but
you don't need to worry about that for now. What you must keep in mind is that
programming in Formality boils down to the following activity:

1. Specify the data formats that are relevant to your problem.

2. Program functions that transform those data formats.

3. Optionally, define and prove theorems about those.

Trust me when I say there is nothing else to it. Mastering Formality is nothing
but learning how to better represent your data, how to better write your
functions, and how to prove harder theorems. This is a long journey full of
insightful moments that, technique by technique, slowly turn you into skilled,
resourceful programmer and mathematician. But the foundamental cycle remains the
same: specify your data, program your functions, prove your theorems. As such,
this document will present itself in the form of cycles that start simple and
become harder and harder as the reader progress. Let's get started!

Booleans
========

The first type we're going to write is the boolean. It is a type inhabited by
two values: `true` and `false`. In Formality, you define it as:

```
T Bool
| true;
| false;
```

Here, `T` is a keyword that means we'll start defining a new type. `Bool` is the
name of the type. And `| true;` and `| false;` are the two values of this type.

(to be continued...)
