![](https://raw.githubusercontent.com/moonad/Assets/master/images/formality-banner-white.png)

An lightweight proof-gramming language. It aims to be:

- **Fast:** no garbage-collection, optimal beta-reduction, massively parallel compilers.

- **Secure:** a powerful type system capable of proving mathematical theorems.

- **Portable:** the entire language desugars to a 500 lines core type-theory.

Browse our [libraries](https://github.com/moonad/moonad) and come hang out with us [on Telegram](https://t.me/formality_lang).

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
programs.  Formality prioritizes evaluation from the beginning, providing solid
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
      | (head, tail) Nat.add(head, List.sum(tail));
    ```

- A proof that negating a bool twice returns the same bool:

    ```haskell
    Bool.double_negation_theorem(b: Bool): Equal(_, Bool.not(Bool.not(b)), b)
      case b
      : (b) Equal(_, Bool.not(Bool.not(b)), b);
      | Equal.to<_, Bool.true>;
      | Equal.to<_, Bool.false>;
    ```

- Extracting the first element of a list statically checked to be non-empty:

    ```haskell
    List.safe_head(A: Type, xs: List(A), not_empty: List.not_empty<A>(xs)) : A
      case xs : (xs) (e: List.not_empty<A>(xs)) -> A;
      | (ne) Empty.absurd(ne, A);
      | (x, xs, ne) x;
      | not_empty;
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

```javascript
Docs.hello: IO(Unit)
  IO.print("Hello, world!")
```

It is a definition with a name (`Docs.hello`), a type (`IO(Unit)`) and a body
(`IO.print("Hello, world!")`).  It is already available on `moonad/Docs.fm`. To
run it, type `fm` on the `moonad` directory. This will generate a bunch of files
in a `.fmc` directory.  Then type `fmcio Docs.hello`. You should see "Hello,
world!".

Since Formality is a pure functional language, it has no built-in notion of
side-effects (like printing), but we can still **describe** then. That's what
the `IO` type does: it allows side-effects to be stated purely and combined with
monads, usually inside `do` blocks:

```javascript
Docs.welcome: IO(Unit)
  do IO {
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

Formality programs are just a series of top-level definitions. Top level
definitions can be datatype declarations, which describe data formats,
functions, which describe how datatypes can be transformed, or proofs, which
state facts about our datatypes and functions. To be honest, datatypes and
proofs are themselves functions, but you don't need to worry about that for now.
What you must keep in mind is that programming in Formality boils down to the
following activity:

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

Basics
======

Declaring datatypes
-------------------

The first type we're going to write is the boolean. It is a type inhabited by
two values: `true` and `false`. In Formality, we declare it as:

```c
T Bool
| true;
| false;
```

Here, `T` is a keyword that means we'll start defining a new type. `Bool` is the
name of the type, and `| true;` and `| false;` are its two "constructors", or
values. This adds two values to the global scope, `Bool.true` and `Bool.false`,
both of type `Bool`.

Declaring functions
-------------------

Since Formality programs are all about datatypes and their transformations,
let's define a function that transforms a Bool into a string:

```c
// Converts to a string
Bool.show(b: Bool): String
  case b:
  | "Bool.true";
  | "Bool.false";
```

Here, `Bool.show` is a top-level function that receives an argument `b` of type
`Bool`, and returns a `String`. On its body, we use a `case` expression to
inspect the value of the input `b`, and return a different string based on it.
Note that, **in order for a case expression to be correct, all cases must have
the correct return type**. This, for example, this is wrong:

```c
// Converts to a string
Bool.show(b: Bool): String
  case b:
  | "Bool.true";
  | Bool.false;
```

Because the second branch doesn't return a `String`. Keep this fact in mind as
it is very important to understand an insight we'll present shortly! 

Inpecting values with `case` expression is one of the most important resources
on a Formality developer's toolbelt. It is like an `if` in traditional
languages, except that it can be used to branch on arbitrary datatypes. Under
the hoods, `case` desugars to just plain function application - but, again,
don't worry about that for now. We can test it running `fmcio Docs.bool_show`:

```c
Docs.bool_show: IO(Unit)
  IO.print(Bool.show(Bool.true))
```

Which outputs `Bool.true`. Let's define the boolean negation:

```c
// Boolean negation.
Bool.not(a: Bool): Bool
  case a:
  | Bool.false;
  | Bool.true;
```

We can test it running `fmcio Docs.bool_not`:

```c
Docs.bool_not: IO(Unit)
  IO.print(Bool.show(Bool.not(Bool.true)))
```

This will output `Bool.false`, which is the negation of `Bool.true`. When lines
start getting too long, we can use `let` to declare local variables:

```c
Docs.bool_not_let: IO(Unit)
  let a = Bool.true
  let b = Bool.not(a)
  IO.print(Bool.show(b))
```

Since using `case` on `Bool` is often called `if`, Formality provides a syntax
sugar that transforms `if a then b else c` into `case a: | b; | c`. In other
words, we can also write `Bool.not` like this:

```c
Bool.not(b: Bool): Bool
  if b then
    Bool.false
  else
    Bool.true
```

As an exercise, you may try defining `Bool.and` and `Bool.or`.

Unit and Empty
--------------

In the same way that `Bool` is a type inhabited by two values, `Unit` is a type
inhabited by one value. We can declare it as:

```c
T Unit
| new
```

This adds `Unit.new` of type `Unit` to the global scope. We can convert an Unit
to a string as:

```c
Unit.show(x: Unit): String
  case x
  | "Unit.new";
```

Note that this `case` expression is correct, because all branches (in this case,
only one) return a `String`. You can test it running `fmc Unit.show`:

```c
Docs.unit_show: IO(Unit)
  IO.print(Unit.show(Unit.new))
```

Of course, that datatype isn't very useful computationally, but it still exists.


One may ask: if there is a datatype with 2 values, and a datatype with 1 value,
then is there a datatype with 0 values? Yes! It is called `Empty`:

```c
T Empty
```

Unlike `Bool` and `Unit`, it doesn't add any value to the global scope, but the
`Empty` type still exists, even though there is no value of its type. Now, the
question is: can we, like with the other types, turn an `Empty` into a `String`
by using a `case` expression? Yes, we can, although the way it works may blow
your mind:

```c
Empty.show(e: Empty): String
  case e:
```

That's all. Yes, this is right. It is a case expression with no branches: after
all, the `Empty` type has no values. But how can this be correct? Well, remember
when we said that, in order for a `case` expression to be correct, all branches
must have the correct return type? Since there are no branches, then, all the 0
branches do return a String, even though there is no String at all! But what
happens if we actually print the result of `Empty.show`?  Nothing, because we
can't! For example:

```c
Docs.unit_show: IO(Unit)
  IO.print(Empty.show(?????))
```

There is no way to call this function, because it demands an element of the
Empty set, that doesn't exist. In other words, this function is the epitome of
absurdness: it receives an element of the empty set and return a string that
doesn't exist. Crazy, but not only this makes perfect logical sense, but it is
extremely useful, for reasons we'll explain in a moment.

Towards theorem proving
-----------------------

The constructs presented so far are familiar to functional developers.
Datatypes, functions, pattern-matching. What may be new to some, though, is
theorem proving, i.e., the ability to reason about complex runtime behaviors
statically using types. That is possible because Formality merges the "type
level" and the "value level" in one unified environment, allowing types to be
treated as "first-class" citizens of the language. We can store types in
containers, use types as inputs and return types from functions. So, for
example, remember polymorphism? I.e., generic functions that operate on
different types? Well, we can do that by using types as arguments:

```c
Docs.id(T: Type, x: T): T
  x
```

Here, `Docs.id` is a function that receives a type `T` and a value `x` of type
`T`, and returns itself. We can use it generically on multiple types:

```c
Docs.id_test_0: Bool
  Docs.id(Bool, Bool.true)

Docs.id_test_1: Unit
  Docs.id(Unit, Unit.new)

Docs.id_test_2: String
  Docs.id(String, "cat")
```


Of course, that's still common. But with a little creativity, things get
interesting. For example, nothing stops us from defining a function that
receives a `Bool` and returns a `Type`:

```c
Docs.string_or_unit(b: Bool): Type
  case b:
  | String;
  | Unit;
```

After all, why not? And we can use that function inside type annotations:

```c
docs.a_string: Docs.string_or_unit(Bool.true)
  "I'm a string!"

docs.an_unit: Docs.string_or_unit(Bool.false)
  Unit.new
```

This only works because `Docs.string_or_unit(Bool.true)` evaluates to `String`.
If we wrote `Bool.false` instead, it would be a type error. We're computing on
the type level! Or, rather... the type level **is** the value level, allowing us
to call function inside type annotations. Crazy, right? But it gets crazier.
Check this:

```c
Docs.crazy(b: Bool): Docs.string_or_unit(b)
  case b:
  | "I'm a string";
  | Unit.new;
  : Docs.string_or_unit(b.self);
```

This is a boolean function that returns a `String` only if its argument is true,
otherwise, it returns `Unit.new`. In other words, that function returns
different types depending on its input. To make this possible, we've made the
return type depend on `Docs.string_or_unit(b.self)`, where `b.self` is the value
of `b` on each branch. On the first branch, it demands
`Docs.string_or_unit(Bool.true)`, which is `String`. On the second branch, it
demands `Docs.string_or_unit(Bool.false)`, which `Unit`. Both branches have the
correct type, even if they're different!

Note that this is not the same as returning an `Either String Bool`, which is
how traditional functional languages like Haskell or OCaml return different
types. While `Either` may contain different types, it is just a wrapper which is
itself a single type. Here, we actually return different types, directly. This
is simply not possible in traditional functional languages!

The obvious question is: wouldn't that flexibility cause runtime errors? After
all, what happens if we try to print the result of `Docs.crazy`? Let's try.

```c
Docs.crazy_test_0: IO(Unit)
  IO.print(Docs.crazy(Bool.true))
```

This works fine and prints `"Bool.true"`, because `Docs.crazy(Bool.true)`
returns a string, as expected by `IO.print`. But what about this?

```c
Docs.crazy_test_1: IO(Unit)
  IO.print(Docs.crazy(Bool.false))
```

This raises a type error:

```
Found type... Docs.bool_to_type(Bool.false)
Instead of... String
```

Because `Docs.crazy(Bool.false)` returns a `Bool`, and we can't call `IO.print`
on booleans. In other words, despite returning different types, `Docs.crazy` is
not a dynamically typed function, and it can not result in runtime errors.
Instead, the returned type is statically computed based on the runtime value.
But what if we didn't know the value of `b`? For example:

```c
Docs.crazy_string(b: Bool): String
  Docs.crazy(b)
```

This function is supposed to return the string returned by `Docs.crazy(b)`. Of
course, it doesn't work; after all, `Docs.crazy(Bool.false)` does not return a
string! We could instead write it like this:

```c
Docs.crazy_string(b: Bool): String
  Docs.crazy(Bool.true)
```

Which would type-check, but wouldn't be quite right, after all, it returns a
string even if we call it with `Bool.false`. What we want to do is to only allow
`Docs.crazy_string` to be called with `Bool.true`. But how? As in, how do we
restrict the domain of a function to only accept certain values? You may want to
take a moment to thing about this problem. It can be solved with the information
available so far, although it requires a little bit of creativity.

...

Here is a hint: it involves `Unit` and `Empty`.

...

Got it? Gave up? Didn't even try? Ok, here is the answer:

```c
Bool.IsTrue(b: Bool): Type
  case b:
  | Unit;
  | Empty;

Docs.crazy_string(b: Bool, is_true: Bool.IsTrue(b)): String
  Docs.crazy(Bool.true)
```

First, we create a `Bool.IsTrue(b)` function that returns the type `Unit` if `b`
is true and the type `Empty` if `b` is false. Then, we add an extra argument to
`Docs.crazy_string` which calls `Bool.IsTrue` based on the value of the first
argument. This allow us to call it when the first argument is true:

```c
Docs.crazy_string_example_0: String
  Docs.crazy_string(Bool.true, Unit.new)
```

The reason this works is that the second argument will have type
`Bool.IsTrue(Bool.true)`, which is just `Unit`, so we can write `Unit.new`. But
if we try to call it when the second argument is false:

```c
Docs.crazy_string_example_1: String
  Docs.crazy_string(Bool.false, ????)
```

We get blocked, because it demands the second argument to be
`Bool.IsTrue(Bool.false)`, which is `Empty`, and we can't construct an element
of the `Empty` type. This is similar to how `Empty.show` is a function that
can't be called, except that, here, we exploit `Empty` to prevent
`Docs.crazy_string` from being called specifically when the first argument is
`Bool.false`. Makes sense?

Proving a theorem
-----------------

With that background, we're now able to prove a theorem!

... TODO ...

```c
Docs.true_theorem: Bool.IsTrue(Bool.true)
  Unit.new

Docs.self_equal_theorem(b: Bool): Bool.IsTrue(Bool.eql(b, b))
  case b:
  | Unit.new;
  | Unit.new;
  : Bool.IsTrue(Bool.eql(b.self, b.self));
```

---

![Interaction-Net compilation](https://raw.githubusercontent.com/moonad/Assets/master/images/inet-simulation.gif)
