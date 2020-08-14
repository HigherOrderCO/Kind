![](https://raw.githubusercontent.com/moonad/Assets/master/images/formality-banner-white.png)

An lightweight proof-gramming language. It aims to be:

- **Fast:** no garbage-collection, optimal beta-reduction, massively parallel compilers.

- **Secure:** a powerful type system capable of proving mathematical theorems.

- **Portable:** the entire language desugars to a 500 lines core type-theory.

Explore our ecosystem at [moonad.org] and come hang out with us [on Telegram](https://t.me/formality_lang).

Table of contents
=================

- [Table of contents](#table-of-contents)
- [Motivation](#motivation)
- [Examples](#examples)
- [Installation](#installation)
- [Commands](#commands)
- [Introduction](#introduction)
    - [📦 Dependencies](#-dependencies)
    - [✔️ Type Checking](#️-type-checking)
    - [📜 Compile to Javascript](#-compile-to-javascript)
    - [🚀 Run](#-run)
    - [💡 Datatypes, Functions, and Proofs](#-datatypes-functions-and-proofs)
- [Learning More](#learning-more)
- [Roadmap](#roadmap)
- [Contributing](#contributing)

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
multiplication algorithm](http://github.com/MaiaVictor/optimul) for example.
Finally, proof languages tend to be complex and big, which makes
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

![inets](https://raw.githubusercontent.com/moonad/Assets/master/images/inet-simulation.gif)

Examples
========

- List functions:

    ```c
    // Polymorphic List
    T List<A: Type>
    | nil;
    | cons(head: A, tail: List(A));

    // Mapping over a List
    map<A: Type, B: Type>(fn: A -> B, list: List(A)): List(B)
      case list:
      | nil  => [];
      | cons => cons<B>(fn(list.head), map<A,B>(fn, list.tail));

    // Safe head (using a `not_empty` proof)
    head<A: Type>(list: List(A), not_empty: list != []) : A
      case list:
      with nope : list.self != [] = not_empty;
      | nil  => Empty.absurd<A>(not_empty(_));
      | cons => list.head;
    ```

- The Black Friday Theorem ("50% off of the double is the same"):

    ```c
    // A natural number (non-negative integer)
    T Nat
    | zero;
    | succ(pred: Nat);

    // Double of a natural number
    double(n: Nat): Nat
      case n:
      | zero;
      | succ(succ(double(n.pred)));

    // Half of a natural number
    half(n: Nat): Nat
      case n:
      | zero;
      | case n.pred:
        | zero;
        | succ(half(n.pred.pred));;

    // Black Friday Theorem: 50% off of double is the same
    bft(n: Nat): half(double(n)) == n
      case n:
      | Equal.to<_,zero>;
      | Equal.apply<_,_,_,_,Nat.succ>(bft(n.pred));
      : half(double(n.self)) == n.self;
    ```

- Handy syntax-sugars like `if` and `for`:

    ```c
    summation(lim: Nat): Nat
      let sum = 0
      for i = 0 .. lim with sum:
        Nat.add(sum, i)

    show_age(age: U32): String
      if U32.gte(age, 12u) then
        "kid"
      else if U32.gte(age, 18u) then
        "teen"
      else
        "adult"
    ```

TODO: include examples of Python-looking Formality for non-FP people.

TODO: link the upcoming "Why proof languages matter?" Moonad post.


Installation
============

1. Install [npm](https://www.npmjs.com/get-npm) in your system.

2. Install the language with `npm i -g formality-lang`.

Commands
========

The commands below operate on `.fm` files in the current directory.

- `fm`: type-checks all top-level definitions.

- `fm term`: type-checks and evaluates a term.

- `fm file.fm`: type-checks a file.

- `fmjs term`: compiles a term to JavaScript.

- `fmio term`: compiles a term to JavaScript and runs.

- `fmopt term`: runs a term [β-optimally](https://medium.com/@maiavictor/solving-the-mystery-behind-abstract-algorithms-magical-optimizations-144225164b07).

- `fm2fmc`: compiles all terms to Formality-Core.

The commands below load all `.fmc` files in the current directory.

- `fmc`: type-checks all top-level definitions.

Introduction
============

Let's write "Hello, World!" in Formality!

First, create a new file somewhere called `Hello.fm` and add this text
to it:

```javascript
Hello.world: IO(Unit)
  IO.print("Hello, world!")
```

The first expression `Hello.world` defines a function called `world` in the
`Hello` namespace (by default, all definitions must be namespaced with the same
name as the file they're found in, except if your file is named `global.fm`).
The type of this expression is `IO(Unit)` (more about that later in the
[tutorial](TUTORIAL.md)).

Let's try running our little program. On a command line, enter:

```
fmio Hello.world
```

This will download the necessary dependencies, type check the new definitions,
compile everything to Javascript, and run, printing `Hello, world` in the
console. Let's look at each of these steps in a little more detail:

### 📦 Dependencies

Formality will discover it doesn't have definitions for `IO(Unit)`
and `IO.print`, and will download them from [moonad.org].
Formality doesn't have a notion of packages or a central package
repository; instead, users can post definitions to Moonad, making
them globally available for all other users, essentially extending the 
language itself. This is Formality's philosophy on pretty much everything:
keep the language as small and diamond-perfect as possible, but make it 
easy to extend and share.

### ✔️ Type Checking

With all the definitions in place, Formality will make sure
every definition fulfills its type. This process is *much* more powerful
in Formality than in traditional languages: as in proof assistants like
Coq and Agda, types can express deep properties about your programs, and
Formality will make sure they hold (more about this later in the section on
[theorem Proving](./THEOREM_PROVING_TUTORIAL.md)).

### 📜 Compile to Javascript

Formality programs compile to fast, tiny Javascript modules. The output is
quite clean too! Check it out yourself by running:

  ```
  fm2js Hello.world
  ```
Javascript is currently the default runtime for Formality, and the one we recommend
for learning the language. But, as mentioned, Haskell and EVM runtimes exist. In
fact, writing a new runtime in your favorite language is simple and a nice weekend project - 
check out our tutorial on the subject [TODO - this tutorial is a work in progress; in the
meantime, everything you'd need to implement is in [this file](https://github.com/moonad/Formality/blob/master/javascript/FormalityCore.js)]!

### 🚀 Run

The `fm` command will execute the compiled Javascript, printing `Hello, world.`
to the console.

For a more interactive example, we could add the following function to our
`Hello.fm` file:

```javascript
Hello.greet: IO(Unit)
  do IO {
    var name = IO.prompt("What is your name?");
    IO.print(String.concat("Welcome, ", name));
  }
```

Try running our new `greet` function at the command line:

```
fmio Hello.greet
```

Reading and printing to the console raises an important issue: Formality is
a language without side-effects - as in languages like Haskell and Elm, all
functions are completely pure (i.e, cannot read or write mutable state). Rather
than issuing side-effects directly, the standard library defines datatypes that
_describe_ the effects, which are then interpreted by the runtime. This is described
at length in [IO section of the tutorial][TODO write IO section].

### 💡 Datatypes, Functions, and Proofs

Formality is a general purpose language, capable of everything from web apps to
3D games to advanced mathematical proofs.  But all Formality programs share a
common structure that comes down to three parts:

1. Specify the datatypes that describe your problem.

2. Write functions that transform those datatypes.

3. Propose and prove theorems about your datatypes and functions.

While the first two are commonplace for programmers and the last is usually
relegated to mathematicians, Formality enables all three in the same simple
language, making it a powerful *lingua franca* for the exchange of ideas in
math, computer science, and software engineering.

Learning More
=============

New to the notion of proving theorems with programs? Check out [our
tutorial](TUTORIAL.md) - you'll be proving theorems to the moon and back in no
time (throw a little of that moon ore our way, eh?).

Since the documentation is still being developed, a great way to get a feel of
how the language works is by just looking the files
[here](https://github.com/moonad/Moonad/tree/master/lib). It contains every
Formality function available on Moonad!

Do you dream in Pi types and eat monoids for breakfast? You'll probably want to
see the [specification](FMC_SPECIFICATION.md) (it's incomplete and slightly
dated, but still covers a lot of ground).

Questions? Queries? Quagmires? Conundrums? Perhaps we've covered it in the
[FAQ](./FAQ.md).  If not, hop on [on Telegram](https://t.me/formality_lang) and
we'll see if we can't get to the bottom of it.

Roadmap
=======

TODO - write roadmap section.

Contributing
============

Are you as excited about democratizing efficient proofs as we are? Come help us build
the thing! 

- [Moonad.org] is wide open for contributions. Port your favorite library to
  Formality and integrate it directly into the language by publishing to Moonad. Or
  deploy a cool app that uses Moonad's IO infrastructure. Soon we'll have toolchain in
  place for you to publish in an automated way, but for now, you can do so by making a
  PR to the [Moonad lib](https://github.com/moonad/Moonad/tree/master/lib).
- The documentation needs helps. One of the best ways you can help us improve it is just ask
  questions and give feedback on [on Telegram](https://t.me/formality_lang)! Bonus points if
  you mention @d4hines so we can make sure it gets compiled into the FAQ.
- Finally, there are lots of fascinating problems to solve in the language itself. We need 
  all the help we can get for the items in the roadmap - or, if we've missed the thing you
  want most, send us a PR or let us know [on Telegram](https://t.me/formality_lang). Formality
  is a vast and rich frontier: who knows what dependently-typed glories await the intrepid?

> “To every man, in his acquaintance with a new art, there comes a moment when that which before
> was meaningless first lifts, as it were, one corner of the curtain that hides its mystery,
> and reveals, in a burst of delight which later and fuller understanding can hardly ever equal,
> one glimpse of the indefinite possibilities within.”
>
> *Out of the Silent Planet*, C.S. Lewis

[moonad.org]: http://moonad.org
