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
(`git clone https://github.com/moonad/moonad`) directory, since it includes all
the examples of this documentation on the `Docs.fm` file. This is the "Hello,
World!" in Formality:

```javascript
Docs.hello: IO(Unit)
  IO.print("Hello, world!")
```

To run it, type `fmcio Docs.hello`. A more interactive example is:

```javascript
Docs.welcome: IO(Unit)
  do IO {
    var name = IO.query("What is your name?");
    IO.print(String.concat("Welcome, ", name));
  }
```

Since Formality is a pure functional language, it has no built-in notion of
side-effects (like printing), but we can still **describe** then: that's what
the `IO` type does, using monads. But what are monads? Simple, monads are
just... things that you must not worry about for now. It is tempting to teach
monads, but we must focus on foundamental principles of the language first.

Principles
==========

Formality programs are just a series of top-level definitions: datatype
declarations and functions (or proofs). As such, programming in Formality almost
always consists of the following activity:

1. Specify the data formats that are used in your problem.

2. Program functions that transform those data formats.

3. Propose and prove theorems about those.

We will focus on this workflow through this documentation.

From TypeScript to Theorem Proving in 15 minutes
================================================

Of the steps above, 1 and 2 are very familiar to most developers, but 3 is not.
Because of that, it deserves a separate explanation before we proceed. In this
section, I'll provide a brief overview of what dependent types and theorem
proving are in 15 minutes, assuming you're already familiar with a simpler type
system like TypeScript's. If you're comfortable with those concepts, you can
skip to the next section.

## What are types?

In most languages, types can be used to restrict the "domain" of a function. For
example, in JavaScript, we can write:

```c
function div(a, b) {
  return a / b;
}
```

But, without types, there is no guarantee `div` will be called with a `Number`.
If someone accidentally called it with a `String`, things could go very wrong:
`div("one", 2)` is `NaN`. We could prevent it with a **runtime check**:

```c
function div(a, b) {
  if (typeof a !== "number" || typeof b !== "number") {
    throw "Invalid input type.";
  }
  return a / b;
}
```

But, while this prevents the program from reaching a corrupt/undefined state,
there will still be an error at runtime. The program will still crash. The
solution to this, you know well. With `TypeScript`, we can write:

```c
function div(a : Number, b : Number) : Number {
  return a / b;
}
```

This prevents `div` from ever being called with a `String`. If you do, this will
be reported as a compile-time error. Great! That's how types help us.

## What are dependent types?

Even with types, `div(0,0)` is still `NaN`. This is still a corrupt state. What
if we wanted to also prevent it? That's where conventional type systems fall
apart. In TypeScript, you need a **runtime check** to ensure `b != 0`:

```c
function div(a : Number, b : Number) : Number {
  if (b === 0) {
    throw "Division by 0.";
  }
  return a / b;
}
```

We once again prevented the program from being in a corrupt/undefined state, but
it can still crash. In a way, this is as if `TypeScript`'s type system is
"incomplete" in some way. Dependent types "complete" a type system by allowing
us to write this:

```c
function div(a : Number, b : Number & b != 0) : Number {
  return a / b;
}
```

Here, the type of `b` has an extra condition. It must be a `Number` that is not
0. In other words, in the same way we can't call `div` with a `String`, we can't
also call it with a `Number` that is `0`; `div(2,0)` becomes a compile-time
error. Since the type of an input can **depend on values**, we call it a
**dependent type**. Great, right?

But how is that even possible? What if `b` isn't a number, but an expression?
For example:

```c
function foo(a : Number, b : Number) : Number {
  return div(a, abs(b) + 1);
};
```

How can Formality know that `abs(b) + 1` isn't `0`? Intuitivelly, we know it is
true: the absolute of a number plus one can't be `0`. But how is the compiler
supposed to know? That's where theorem proving shines.

## What is theorem proving?

Once types can be expressions that include values and variables, we must have a
way to symbolically manipulate those expressions to be able to "unlock" function
calls. We can accomplish that via theorem proving. For example:

```c
function abs_plus_1_isnt_0(b : Number) : abs(b)+1 != 0 {
  ...
}
```

Here, `inc_abs_is_positive` doesn't return a `Number` nor anything concrete. It
returns a "proof" that `abs(b)+1 != 0`. We can then use that proof to "unlock"
the call of `div` on `foo`:

```c
function foo(a : Number, b : Number) : Number {
  return div(a, abs(b) + 1 ...valid-because... abs_plus_1_isnt_zero(b)); 
};
```

The `abs(b)+1 != 0` is a type like `Number` or `Bool`, but instead of its
value being `7` or `true`, it is a "proof" that the `abs(b)+1 != 0`. That proof
is a first-class value like any other: it can be passed to functions, stored in
arrays and so on. But what does it look like? How do we prove a theorem?

## What a proof looks like?

Surprisingly, proofs aren't much different from a functional program: it is just
a bunch of case analysis and recursion ("induction"). That's because of an
amazing discovery that mathematical proofs and functional programs ["are the
same thing"](https://en.wikipedia.org/wiki/Curry%E2%80%93Howard_correspondence).

Let me give you a concrete example. In `TypeScript`, we can make a `List(A)`
type (for polymorphic lists), and a `singleton : A -> List(A)` function (that
returns a list with one `A`). We can write this:

```typescript
const my_list : List(Number) = singleton(7); // same as [7]
```

This is correct because `7 : Number` and `singleton` specializes to `singleton :
Number -> List(Number)`, thus `singleton(7) : List(Number)`.  In other words, if
someone asks you "what a `List(Number)` looks like", then `singleton(7)` is a
valid answer. Right?

Now suppose we could also make an `Equal(A, a, b)` type (for equality proofs)
and an `same : (a: A) -> Equal(A, a, a)` function (that returns a proof that any
value is equal to itself). We could then write this:

```typescript
const my_equality : Equal(Number, 7, 7) = same(7);
```

This would be correct because `7 : Number` and `same` specializes to
`same : (a: Number) -> Equal(A, a, a)`, thus `same(7) : Equal(Number, 7, 7)`.
Does this make sense? In other words, if someone asks you "what a `Equal(Number,
7, 7)` looks like", then `same(7)` is a valid answer. In this case, a proof of
an equality is just a function call. That is all!

But `7` is a concrete value. What if we wanted to prove something about an
**expression** such as `not(not(a)) == a` for any `Bool`? Since now there is a
variable, we need a function:

```typescript
function my_equality(a : Bool) : Equal(Bool, not(not(a)), a) {
  return same(a);
};
```

But this doesn't work, because `my_equality` is returning a `Equal(Bool, a, a)`,
not an `Equal(Bool, not(not(a)), a)` (take a moment to see why!). Those are
different types. What we can do, though, is inspect the possible values of `a`:

```typescript
function my_equality(b : Bool) : Equal(Bool, not(not(a)), a) {
  switch a {
    case true:
      return same(true);
    case false:
      return same(false);
  }
};
```

This works because, inside the `true` branch, the language knows that `a ==
true` and, thus, demands that we return `Equal(Bool, not(not(true)), true)`
(instead of `Equal(Bool, not(not(a)), a)`). Since `not(not(true))` **reduces
to true**, it then demands a `Equal(Bool, true, true)`, which is just
`same(true)`. In other words, the shape of the proof of `not(not(a)) == a` is:

```typescript
switch (a) {
  case true:
    return same(true);
  case false:
    return same(false);
};
```

Since `not(not(a)) == a` is an expression, its proof is also an expression: one
that inspects `a` to make sure that the equation holds for all its possible
values. We can then use that proof to unlock certain functions calls. For
example, suppose we had a function like this:

```typescript
// Can only be called with two identical inputs
function foo(a : Bool, b : Bool & Equal(Bool, a, b)) : Bool {
  ...
};
```

I.e., `foo` can only be called with two identical booleans. To call it, we need
a proof that its first two inputs are equal. Here are some ways to do it:

```typescript
// Works because `same(true)` proves that `true == true`.
const my_bool : Bool = foo(true, true & same(true));

// Works because `same(false)` proves that `false == false`.
const my_bool : Bool = foo(false, false & same(false));

function bar(x : Bool) : Bool {
  // Works because `my_equality(b)` proves that `not(not(b)) == b`.
  const my_bool : Bool = foo(not(not(x)), x & my_equality(b));
};
```

In other words, if the first two arguments are identical concrete values, we can
call `foo` using `same`. If they are expressions, we can call `foo` by proving
(possibly by case analysis and induction) that those expressions are identical.
And that's it: with those two ingredients we're able to set up the type system
in a way that allows us to restrict the domain of a function arbitrarily without
ever needing a runtime check. In a way, formal proofs are like the "Turing
completeness" of type systems.

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

There are two ways to test a program. We can use `IO` to print values:

```c
Docs.bool_test_0: IO(Unit)
  IO.print(Bool.show(Bool.not(Bool.true)))
```

Run with `fmcio Docs.bool_test_0`. This requires us to be able to stringify
those values (here, `Bool.show` is defined on `Bool.fm`). An alternative would
be to just print the values directly, without `IO`:

```c
Docs.bool_test_1: Bool
  Bool.not(Bool.true)
```

Type `fm Docs.bool_test_0`. This will output `(true) (false) false`, which is
the internal lambda-encoded representation of `Bool.false` (more on that later).
A last alternative would be to type `fmcio Docs.bool_test_1`. Since the program
isn't of type `IO`, it will output the compiled JavaScript representation of
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
    34| //Docs.bool_show: IO(Unit)
    35|   //IO.print(Bool.show(Bool.true))
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
