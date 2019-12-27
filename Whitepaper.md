# Formality: a simple, efficient proof language

Formality is a simple proof, efficient language featuring
inductive mathematical reasoning. It features a lightweight,
clean syntax and is designed to be fast, including
non-garbage collected, parallel runtimes, and portable,
being easily compilable to new targets.

Core
===

Formality's Core is an Abstract Syntax Tree (AST) including
a very small set of primitive features such as functions,
native numbers, type annotations, self-types and recursion.
Its grammar is defined as:

```
term ::=
  -- Lambdas
  (name : term) -> term -- lambda type (dependent product)
  (name : term) => term -- lambda term
  term(term)            -- lambda application

  -- Numbers
  Number                 -- number type
  numb                   -- number term
  if term
    then term
    else term            -- number branching
  term .op. term         -- number operation

  -- Self-Types
  ${name} term           -- self type
  new(term) term         -- self term
  use(term)              -- self elimination

  -- Language
  name                   -- variable
  term :: term           -- annotation
  ?name                  -- hole
  log(term)              -- log
  Type                   -- universe

file ::=
  name term : term; file -- top-level definition
  \eof                   -- end-of-file

name ::=
  <any alphanumeric string>

numb ::=
  <any numeric string>

.op. ::=
  .+.
  .-.
  .*.
  ./.
  .%.
  .**.
  .&.
  .|.
  .^.
  .~.
  .>>>.
  .<<.
  .>.
  .<.
  .==.
```

Syntax
======

Formality's textual syntax extends the grammar above with a
set of syntax-sugars; that is, notations that allow an user
to represent large, common programs tersely.

Telescope
---------

The telescope notation is an abbreviation for curried
lambda values, types and applications. 

- Lambda type:
    - from `(x : A, y : B, z : C) -> D`
    - to `(x : A) -> (y : B) -> (z : C) -> D`

- Lambda value:
    - from `(x : A, y : B, z : C) => D`
    - to `(x : A) => (y : B) => (z : C) => D`

- Lambda application:
    - from `f(x, y, z)`
    - to `f(x)(y)(z)`

Let
---

The `let` notation performs a parse-time substitution.

- Let
    - from `let x = t; u`
    - to `u[x <- t]`


Char
----

A char literal is transformed into its codepoint.

- Char
    - from `'a'`
    - to `97`

Nat
---

A number ending with `n` is transformed into a natural
number. It expects `succ` to be the successor function and
`zero` to be the smallest number.

- Nat
    - from `3n`
    - to `succ(succ(succ(zero)))`

INat
----

A number ending with `N` is transformed into an `INat`. It
expects `isucc` to be the successor function, `izero` to be
the smallest number, and `imul2` to be the doubling
function.

- INat
    - from `3N`
    - to `isucc(imul2(isucc(izero)))`

Pair
----

The pair notation is an abbreviation for pair types, values
and eliminations. It expects `Pair` to be the pair type and
`pair` to be its constructor.

- Pair type:
    - from `#{A, B, C}`
    - to `Pair(A, Pair(B, C))`

- Pair value:
    - from `#[A, B, C]`
    - to `pair(__ A, pair(__ B, C))`

- Pair getter:
    - from `get [x,y,z] = p; t`
    - to `p(_ (x,yz) => zy(_ (y,z) => t))`

List
----

The list notation is an abbreviation for list values. It
expects `cons` to be the list concatenation and `nil` to be
the empty list.

- List value:
    - from `[1, 2, 3]`
    - to `cons(_ 1, cons(_ 2, cons(_ 3, nil(_))))`

Map
---

The map notation is an abbreviation for lists of pairs.

- Map value:
    - from `{a:1, b:2}`
    - to `cons(_ pair(__a,1), cons(_ pair(__b,2), nil(_)))`

Block
-----

The block-notation allows one to perform generic binding
operations without needing cascading lambdas. It is similar
to Haskell's do-notation and can be seen as a generic
version of JavaScript's async.

- Block:
    - from
        ```
        do {
          var x = call0(a,b);
          var y = call1(c,d);
          call2(e,f);
          return 7
        }
        ```
    - to
        ```
        bind(__ call0, a, b, (x) =>
        bind(__ call1, c, d, (y) =>
        bind(__ call2, e, f, (_) =>
        return(_ 7))))
        ```

Evaluation
==========

TODO: write evaluation rules

Type-System
===========

TODO: finish and document properly.

```
-- Lambdas

Γ |- A : Type    Γ, x : A |- B : Type
------------------------------------- lambda type
Γ |- (x : A) -> B : Type

Γ |- A : Type    Γ, x : A |- t : B
---------------------------------- lambda term
Γ |- (x : A) => t : (x : A) -> B

Γ |- f : (x : A) -> B    Γ |- a : A
----------------------------------- lambda application
Γ |- f(a) : B[x <- a]

-- Self-Types

Γ, s : ${x} A |- A : Type
----------------------- self type
Γ |- ${x} A : Type

Γ, |- t : A[x <- t]    Γ |- ${x} A : Type
----------------------------------------- self term
Γ |- new(${x} A) t : ${x} A

Γ |- t : ${x} A
----------------------- self elimination
Γ |- use(t) : A[x <- t]

-- Language

(x : T) ∈ Γ
----------- variable
Γ |- x : T

Ø
---------------- type-in-type
Γ |- Type : Type
```
