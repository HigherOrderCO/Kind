Formality
=========

Formality is a minimal programming language featuring theorem proving. Its
implementation is orders of magnitude smaller than proof assistants such as
Agda, Idris, HOL/Isabelle and Lean, but it is no less powerful: a rich system of
inductive datatypes is derived from a set of simple primitives. In this paper,
we will specify its syntax and semantics informally, and then formalize it in
itself. That will include a simple backtracking parser, a fast equirecursive
equality algorithm and an efficient and a high-order evaluator and bidirectional
type-checker. The result is a self-contained, sub 2000-LOC implementation of
Formality in Formality, which can be easily audited, independently implemented,
and used to reason and prove theorems about itself.

## Table of Contents

- [Formality](#formality)
  - [Table of Contents](#table-of-contents)
  - [0. Motivation](#0-motivation)
    - [0.0. Modern proof asistants are complex](#00-modern-proof-asistants-are-complex)
    - [0.1. A simpler alternative](#01-a-simpler-alternative)
    - [0.2. The cost of consistency](#02-the-cost-of-consistency)
    - [0.3. Formality's take on consistency](#03-formalitys-take-on-consistency)
    - [0.4. Efficiency is misunderstood](#04-efficiency-is-misunderstood)
    - [0.5. Enhancing programmers productivity](#05-enhancing-programmers-productivity)
  - [1. Specification](#1-specification)
    - [1.0. Terms](#10-terms)
    - [1.1. Syntax](#11-syntax)
    - [1.2. Evaluation](#12-evaluation)
    - [1.3. Equality](#13-equality)
    - [1.4. Types](#14-types)
  - [2. Formalization](#2-formalization)
    - [2.0. Terms](#20-terms)
    - [2.1. Syntax](#21-syntax)
    - [2.2. Evaluation](#22-evaluation)
    - [2.3. Equality](#23-equality)
    - [2.4. Types](#24-types)


## 0. Motivation

For a long time, mathematicians have wondered what is the minimal set of axioms
capable of serving as a foundation for all of mathematics. Gödel's
incompleteness theorems demonstrated that no such a thing exists: any axiomatic
system capable of modelling basic arithmetic is either inconsistent or limited,
in the sense it has true statements that can't be proven. This doesn't
invalidate the original intent of the question, though: one can still look for a
minimal set of axioms capable of serving as a **practical** foundation for
mathematics.

Similarly, software engineers have long struggled with the constant battle
against software bugs. (TODO: talk about software that can't go wrong; talk
about Ethereum; talk about efficiency; talk about productivity.)

### 0.0. Modern proof asistants are complex

Within the field of type theory, mathematical proofs and theorems are
represented by functional programs and their associated types. This is called
the Curry-Howard correspondence, and is the basis of modern proof assistants
such as Agda, Idris, Coq and HOL/Isabelle. Sadly, those are complex software
with monolithic implementations that are hard to audit and reason about. We're
interested in a simpler alternative: a fully-featured proof assistant that can
be turned into a small standard that is easy to analyze and implement
independently.

Under that perspective, one may be interested on the Calculus of Constructions
(CoC), a small type theory that easily fits 1000 lines of code in a modern
programming language. Sadly, that and similar languages aren't capable of
deriving mathematical induction, an important proof technique without which any
non-trivial theorem isn't provable. Moreover, it isn't capable of expressing
efficient (constant space and time) pattern-matching, without which functional
programming isn't viable. The usual solution to both problems is to supplement
CoC with a native datatype system, but this results in the complexity explosion
that is seen on the mentioned languages.

### 0.1. A simpler alternative

A simple, clever alternative was proposed by Aaron Stump. With just one
additional primitive, the "self type", coupled with mutually recursive
definitions, one can easily derive induction for lambda encodings, i.e., a way
to represent datatypes with native lambdas, subsuming the need for a separate
implementation. This also solves the efficiency problem, as we're able to
pattern-match in constant time with certain lambda encodings. The problem with
that solution is that providing a semantics and, thus, proving the consistency
of the resulting system becomes extremely hard.

Aaron Stump moved on from self types towards a very similar solution based on
dependent intersections. The idea is that, instead of relying on mutual
recursion, inductive datatypes can refer to themselves in simplified, erased
forms. This results in a comparably small language that is much easier to
provide a semantics for, which Aaron Stump called Cedille-Core. In exchange,
programming on it is hard. The simple task of defining a datatypes with
efficient pattern-matching and recursion becomes a complex task involving
non-trivial type-level manipulations and many intermediate proofs. While doable,
programming in Cedille-Core without a supplementary language to do all that work
for you is not practical.

### 0.2. The cost of consistency

Formality has a different take on consistency that comes from the realization
that consistency isn't hard, it is complex. The reason is that consistency
demands termination, which, due to the halting problem, simply can't be
implemented without either forbidding a program that is "important to someone",
or by making the language extremely more complex.

For example, there is a very easy way to make a proof language consistent:
disable recursion and non-affine lambdas. This would be sound even with
self-types, type-level recursion or other "dangerous" features such as Type in
Type. The proof is trivial: as long as types are preservation, consistency
follows from termination, which is clear since only thing you can do is create
datatypes and pattern-match on them a constant amount of times. But that
language would be utterly useless and nobody would want to use it.

To make it more attractive, one could extend it with more computing power, but
each attempt to do so would result in an increase in implementation complexity.
For example, we could add non-affine lambdas, but that would require an universe
of types (`Type0 : Type1 : Type2...`), in order to avoid Girard's paradox. We
could add recursion, but that would require complex checks for well-foundedness
and positivity in order to avoid loops. We could add corecursion and the
associated guards. At that point, we'd have an extremely complex core language,
and there would still be perfectly valid programs that aren't admissible, such
as high-order abstract syntax, which is extremely useful for interpreters.

In other words, consistency is complex because the natural state of languages is
to be inconsistent. Processes always finds a way to loop, and there are
infinitely many creative ways to express them. Since there is no general purpose
termination check to avoid all of them, the only way to build an expressive,
consistent proof assistant is by adding safe features, one by one, and proving
that nothing broke so far.  In other words, consistency is nothing but a
white-list of programming styles. That list carries a lot of information and,
thus, necessarily reflects on the complexity of the language implementation.
Cedille makes self types consistent by adding complexity (hiding it under
dependent intersections). Coq makes recursion consistent by adding complexity.

Not only that, consistency is not a property of a term, but rather of a set of
terms. For example, in Agda, one is able to implement a function that returns
two copies of its input (`λx -> pair x x`), but not a high-order evaluator the
λ-calculus (as in, HOAS, not PHOAS). But in an hypothetical language with
structural recursion and only affine lambdas, one could implement such HOAS
evaluator, but not the copying function. Both languages are consistent, so both
terms are admissible in a consistent language, but not together! In other words,
forcing a language to be consistent necessarily excludes certain proofs that
would be perfectly sensible in some context.

### 0.3. Formality's take on consistency

Because of the reasons above, Formality's take on consistency is to be
inconsistent by default, with opt-in consistency. As a programming language,
this allows it to feel very similar to Haskell. Algebraic datatypes,
pattern-matching, recursion, infinite lists, monads, lenses; every tool that a
Haskeller adores is available or easy to implement. Other than some added
boilerplate, writing a program in Formality should not be inherently harder than
doing so in Haskell, making it very flexible and powerful.

As a proof assistant, it can still be used to aid someone's theorem proving
tasks by automating type-checking. Then, if one is interested in making sure a
proof isn't paradoxical, then he/she simply uses a separate termination checker.
Ultimately, the result is the same, with the added benefit that one may combine
programs that wouldn't be allowed in traditional proof assistants into a proof
that turns out to be valid in some context. Not only that, we may pick different
termination checkers for different purposes: for example, by restricting
ourselves to Elementary Affine Logic, we're able to compile our programs to
optimal interaction net runtimes.

In practice, this is nothing more than a separation of concerns that allows
Formality's core to remain simple and powerful, while making theorem proving
more flexible. For all that, I consider mixing consistency and type checker an
engineering mistake that makes a language inherently worse, and that having both
separate is always desirable.

### 0.4. Efficiency is misunderstood

TODO

### 0.5. Enhancing programmers productivity

TODO

## 1. Specification

### 1.0. Terms

Formality programs are represented by terms, or expressions. A term can be one
of 8 possible variants:

- `Var`: represents a variable. It stores a number representing the location
  where it was bound, also known as its Bruijn level.

- `Ref`: represents a reference to a top-level definition. The `name` field
  stores the name of the definition.

- `Typ`: represents the type of a type. Formality doesn't feature multiple
  universes.

- `All`: represents a function type, also known as an universal
  quantification. The `self` field stores a name for the value typed.  The
  `name` field stores a name for its bound variable name. The `bind` field
  stores the type of its argument. The `body` field stores its return type. The
  `eras` field represents its computational relevance.

- `Lam`: represents an anonymous function, also known as a lambda.  The `name`
  field stores its bound variable name. The `body` field stores its returned
  expression. The `eras` field represents its computational relevance.

- `App`: represents a function application. The `func` field stores the function
  to be applied. The `argm` field stores the argument. The `eras` field
  represents its computational relevance.

- `Let`: represents a local assignment. The `name` field stores the name of the
  assigned value. The `expr` fields stores the assigned value. The `body` field
  stores the context on which `name` equals `expr`.

- `Ann`: variant represents an inline type annotation. The `expr` field
  represents the annotated expression. The `type` field represents its type.

Formality-Core programs are split in modules. A module is a sequence of
top-level definitions with an unique global name, a type and a value.

### 1.1. Syntax

Term variants can be represented by different syntaxes, as specified below:

```
TERM ::=
  NAME                     -- Var: a variable
  NAME                     -- Ref: a reference
  Type                     -- Typ: type of types
  TERM -> TERM             -- All: function type (simple)
  NAME(NAME: TERM) -> TERM -- All: function type
  NAME<NAME: TERM> -> TERM -- All: function type (erased)
  (NAME) TERM              -- Lam: function
  <NAME> TERM              -- Lam: function (erased)
  TERM(TERM)               -- App: application (inline)
  TERM | TERM;             -- App: application
  TERM<TERM>               -- App: application (erased)
  TERM :: TERM             -- Ann: annotation
  (TERM)                   -- parenthesis
```

Names are represented by a sequence of characters on the table below:

```
a b c d e f g h i j k l m
n o p q r s t u v w x y z
A B C D E F G H I J K L M
N O P Q R S T U V W X Y Z
0 1 2 3 4 5 6 7 8 9 . _
```

An example term is `fn(x: Bool) -> Bool`, which is a function type that calls
itself `fn`. It receives a `Bool`, locally called `x`, and returns another
`Bool`. Another example is `(x) x`, which is the identity function, i.e., one
that returns the same argument it receives. A last example is `f(x)`, which is
an application of the function `f` to the argument `x`. Notes:

- Consecutive spaces are ignored, but single spaces matter. For example,
  `(x) (x)` is a function, but `(x)(x)` is an application.

- Names can be omitted in function and function types: `(x: Bool) -> Bool`,
  `(:Bool) -> Bool` and `Bool -> Bool` all represent the same term.

- A line starting with `//` is considered a comment and is ignored.

- Anything inside a pair of `#` is considered a comment and is ignored.

Modules are represented by a sequence of `name: TERM TERM` assignments. An
example module is:

```javascript
// The polymorphic identity function
id: <A: Type> -> A -> A
  <A> (a) a

// The polymorphic constant function
const: <A: Type> -> <B : Type> -> A -> B -> B
  <A> <B> (a) (b) b

// Applies a function twice to an argument
twice: <A: Type> -> (A -> A) -> A -> A
  <A> (f) (x) f(f(x))

// The boolean type, Bool
Bool: Type
  bool<P: Bool -> Type> -> P(true) -> P(false) -> P(bool)

// The true Bool
true: Bool
  <P> (t) (f) t

// The false Bool
false: Bool
  <P> (t) (f) f

// The "induction principle" for booleans
bool : (b: Bool) -> <P: Bool -> Type> -> P(true) -> P(false) -> P(b)
  (b) <P> (t) (f)
  b<P>(t)(f)

// Boolean negation
not: Bool -> Bool
  (b)
  b<() Bool>
  | false;
  | true;
```

In this example, `id` is a top-level definition with the `<A: Type> -> A -> A`
type and the `<A> (a) a` value. In some implementations, we use JSON to
represent files and terms. For illustration, below is the internal
representation of the value of the `Bool` definition above:

```javascript
// bool<P: Bool -> Type> ->
{
  "ctor": "All",
  "eras": true,
  "self": "bool",
  "name": "P",
  "bind": {
    "ctor": "All",
    "eras": false,
    "self": "",
    "name": "",
    "bind": {"ctor": "Ref", "name": "Bool"},
    "body": {"ctor": "Typ"}
  },

  // P(true) ->
  "body": {
    "ctor": "All",
    "eras": false,
    "self": "",
    "name": "",
    "bind": {
      "ctor": "App",
      "eras": false,
      "func": {"ctor": "Var", "indx": 1},
      "argm": {"ctor": "Ref", "name": "true"}
    },

    // P(false) ->
    "body": {
      "ctor": "All",
      "eras": false,
      "self": "",
      "name": "",
      "bind": {
        "ctor": "App",
        "eras": false,
        "func": {"ctor": "Var", "indx": 3},
        "argm": {"ctor": "Ref", "name": "false"}
      },

      // P(bool)
      "body": {
        "ctor": "App",
        "eras": false,
        "func": {"ctor": "Var", "indx": 4},
        "argm": {"ctor": "Var", "indx": 5}
      }
    }
  }
}
```

### 1.2. Evaluation

Computationally, Formality-Core is just the lambda calculus. As such, its main
operation is the beta-reduction. It says that the evaluation of a function
application `((x) <body>)(<argm>)` is the function's `<body>`, with all
occurrences of `x` replaced by `<argm>`. This can be written down as:

```
((x) f)(a)
---------- beta-reduction
f[x <- a]
```

Before evaluating a term, erased lambdas `<x> t` are replaced by `t` and erased
applications `f<x>` are replaced by `f`. During evaluation, top-level
definitions, addressed by the `Ref` variant, are dereferenced as their
respective values. Beta-reductions and dereferences are applied repeatedly until
there is nothing else to do. For example, the `main` term below:

```javascript
main: Bool
  not(true)
```

Using the `Bool`, `not` and `true` defined previously, is evaluated as:

```
not(true)
((b) b(false)(true))(true) -- deref `not`
true(false)(true)          -- subst `b` by `true`
((t) (f) t)(false)(true)   -- deref `true`
((f) false)(true)          -- subst `t` by `false`
false                      -- subst `f` by `true`
(t) (f) f                  -- deref `false`
```

Substitution is a delicate operation due to name capture. For example, a naive
attempt of evaluating the `(x) ((a) (x) a)(x)` term would result in `(x) (x) x`,
which is incorrect, since the occurrence of `x` refers to the outer lambda, but,
after substitution, it accidentally refers to the inner lambda. This must be
somehow avoided.

Formality-Core doesn't define any evaluation order. It could be evaluated
strictly as in JavaScript and Python, lazily as in Haskell, or optimally through
interaction nets. The reference implementation uses high-order abstract syntax
(HOAS). That is, in the syntax tree, `Var` variants can be replaced by
host-language variables bound in the respective `Lam`, `All` or `Let`. For
example, term `(a) (b) b(a)` could be represented in a low-order format as:

```json
{
  "ctor": "Lam",
  "name": "a",
  "body": {
    "ctor": "Lam",
    "name": "b",
    "body": {
      "ctor": "App",
      "func": {"ctor": "Var", "indx": 0},
      "argm": {"ctor": "Var", "indx": 1}
    }
  }
}
```

Converted to a "high-order", it is represented instead as:

```javascript
{
  "ctor": "Lam",
  "body": a => {
    "ctor": "Lam",
    "body": b => {
      "ctor": "App",
      "func": b,
      "argm": a
    }
  }
}
```

The reference implementation uses high-order terms exclusively, including for
type-checking. This greatly improves performance as it delegates evaluation to
native functions of the host language, which are usually fast, and makes the
implementation simpler, as we don't need separate functions for variable
shifting, renaming and substitution.

### 1.3. Equality

TODO

### 1.4. Types

Type-systems prevent runtime errors by statically checking that certain
expectations hold. For example, if a function assumes an `Int` argument, calling
it with a `String` would be incorrect. Without types, that would result in a
(potentially disastrous) runtime error. With types, we can assert, at compile
time, that the function is never called with anything other than an `Int`.

In Formality, types and programs coexist in the same level, there isn't a
distinction between them. Types can can be stored in lists, returned from
functions and so on. This flexibility allows programmers to state and prove
arbitrarily complex invariants about the runtime behavior of their programs; it
is the reason it can be seen as a proof language.

For example, suppose you want to write a division function that can't go wrong.
A way to do it would be to validate the inputs:

```javascript
function safe_div(a, b) {
  // Prevents non-numeric dividends
  if (typeof a !== "number") {
    throw "Dividend is not a number.";
  };

  // Prevent non-numeric divisors
  if (typeof a !== "number") {
    throw "Divisor is not a number.";
  };

  // Prevents division by zero
  if (b === 0) {
    throw "Attempted to divide by zero.";
  };

  return a / b;
};
```

There are two problems with this approach:

1. The error only manifests at runtime.

2. It has added runtime costs.

Static type systems improve that. For example, in TypeScript, we can write:

```typescript
function safe_div(a: Number, b: Number): Number {
  // Prevents division by zero
  if (b === 0) {
    throw "Attempted to divide by zero.";
  };

  return a / b;
};
```

Since here `a` and `b` have the static `Number` type, we don't need to check
that at runtime. Moreover, calling `safe_div` with a `String` results in a nice
compile-time error. Problem is, we still need to check that `b` is larger than
`0`. Is it possible to perform that check at runtime too? Indeed, that's
precisely what dependent types do. In Formality-Core, we can write:

```
safe_div : (a: Number) -> (b: Number) -> NonZero(b) -> Number
  div(a)(b)
```

Here, `NonZero(a)` represents a symbolic proof that `b` isn't zero. In order to
call `safe_div`, the compiler would demand us to assert that this is true by,
for example, using `if b != 0` before calling `safe_div`. In another words, the
type-system is Turing complete, allowing all sorts of invariants to be
symbolically enforced at compile time. That's what makes it suitable as a proof
language.

Formality's type system is brief and can be described compactly as:

```
x : T ∈ ctx
------------ variable
ctx |- x : T

∅
------------------ type in type
ctx |- Type : Type

ctx                  |- A : Type
ctx, s : self, x : A |- B : Type
-------------------------------- function type
ctx |- s(x: A) -> B : Type

ctx, x : A |- t : B
---------------------------- function introduction
ctx |- (x) t : s(x: A) -> B

ctx |- x : A
ctx |- f : s(x: A) -> B
------------------------------- function elimination
ctx |- f(x) : B[s <- f][x <- a]

ctx        |- x : A
ctx, x : A |- y : B
------------------------- let expansion
ctx |- let x = t in y : B

x : A in defs
------------- dereference
ctx |- x : A
```

Or, in plain English:

- (TODO)

Those are, essentially, the standard typing rules for function types,
introduction and elimination, with one caveat: the type of a function may refer
to its typed value. This essential difference allows inductive reasoning through
λ-encodings, which is absent in similar languages such as the Calculus of
Constructions. For example, take the type of inductive natural numbers `Agda`:

```agda
data Nat : Set where
  zero : Nat
  succ : Nat -> Nat
```

Its dependent elimination can be implemented as:

```agda
elim : (nat : Nat) -> {P : Nat -> Set} -> P zero -> ((n : Nat) -> P (succ n)) -> P nat
elim zero     {P} z s = z
elim (succ n) {P} z s = s n
```

In Formality, we don't have a complex native datatype system. Instead, we
represent data with just lambdas, by exploiting their own elimination principle:

```javascript
Nat: Type
  nat<P: Nat -> Type> -> P(zero) -> ((n:Nat) -> P(succ(n))) -> P(nat)
```

In other words, we just took the type of Agda's `elim` and replaced the first
lambda (`(nat : Nat)`) by a name, (`nat`). The problem is that the type of
`elim` refers to the `zero` and `succ` constructors, which do not exist yet! To
solve that, we must define them simultaneously:

```javascript
zero: Nat
  <P> (z) (s) z

succ: Nat -> Nat
  (n) <P> (z) (s) s(n)
```

This is only possible due to mutual recursion on top-level definitions. Once we
have that, though, we can use Formality's `Nat` exactly the same as Agda's
`Nat`. For example, the induction principle can be derived by simple recursion:

```javascript
ind : (n : Nat) -> <P: Nat -> Type> -> P(zero) -> ((n : Nat) -> P(n) -> P(succ(n))) -> P(n)
  (n) <P> (z) (s)
  n<P>
  | z;
  | (n) s(n)(ind(x)<P>(z)(s));
```

The reason this works is that the type of our λ-encoded `Nat` refers to its own
value under the name `nat`, so, when we eliminate it (by function application),
`nat` is replaced by the applied function; in this case, `n`; resulting in a
return type of `P(n)`, which is what we needed. Compare this to Agda's `ind`:

```agda
ind : (n : Nat) -> {P : Nat -> Set} -> P zero -> ((n : Nat) -> P n -> P (succ n)) -> P n
ind zero     {P} z s = z
ind (succ n) {P} z s = s n (ind n {P} z s)
```

Of course, `Formality-Core`'s definition is not as terse, but, for a language
implemented in 1000 lines of code, that is pretty good. This simplicity is why
we chose to allow the type of a function to access its own value. Every
inductive datatype expressive in a traditional proof language can be written in
Formality in a similar fashion.

TODO

## 2. Formalization

### 2.0. Terms

A Formality-Core term is defined by the following inductive datatype:

[Core.fmc](https://github.com/moonad/Moonad/blob/master/Core.fmc)

As well as its 8 constructors:

[Core.var.fmc](https://github.com/moonad/Moonad/blob/master/Core.var.fmc)
[Core.ref.fmc](https://github.com/moonad/Moonad/blob/master/Core.ref.fmc)
[Core.typ.fmc](https://github.com/moonad/Moonad/blob/master/Core.typ.fmc)
[Core.all.fmc](https://github.com/moonad/Moonad/blob/master/Core.all.fmc)
[Core.lam.fmc](https://github.com/moonad/Moonad/blob/master/Core.lam.fmc)
[Core.app.fmc](https://github.com/moonad/Moonad/blob/master/Core.app.fmc)
[Core.let.fmc](https://github.com/moonad/Moonad/blob/master/Core.let.fmc)
[Core.ann.fmc](https://github.com/moonad/Moonad/blob/master/Core.ann.fmc)

TODO

### 2.1. Syntax

TODO

### 2.2. Evaluation

A Formality-Core term can be reduced to weak normal form as follows:

[Core.reduce.fmc](https://github.com/moonad/Moonad/blob/master/Core.reduce.fmc)

This function reduces as much as necessary until the top constructor is either
an `All`, a `Lam` or an `App` of a bound variable to something else. A term can
be fully normalized as follows:

[Core.normalize.fmc](https://github.com/moonad/Moonad/blob/master/Core.normalize.fmc)

TODO

### 2.3. Equality

TODO

### 2.4. Types

TODO
