# Formality

The goal of this work is to design a proof language, that is:

1. Very small, in the sense it can be implemented in, say, `< 1000 LOC` in a common programming language;

2. Optimal, in the sense it can be evaluated fastly by the [optimal algorithm](https://medium.com/@maiavictor/solving-the-mystery-behind-abstract-algorithms-magical-optimizations-144225164b07) without oracles.

Those two features allow it to be a small specification that people can easily implement independently; lightweight and portable, so it can be implemented as a lib in many other languages; extremelly efficient, being able to run optimally in massively parallel architectures. This document is a informal specification of its current design.

## Syntax

The syntax of Formality is:

```javascript
var ::=
  <any alphanumeric string>

term ::=
  -- Language
  var                -- VAR: a variable
  Type               -- TYP: the type of types
  . var term         -- DEF: a recursive definition
  let var term       -- LET: a non-recursive definition

  -- Functions
  {var : term} term  -- ALL: dependent function type
  [var : term] term  -- LAM: dependent function value
  (term term)        -- APP: dependent function application

  -- Functions (erased)
  {-var : term} term -- ALL: dependent function type (erased)
  [-var : term] term -- LAM: dependent function value (erased)
  (term -term)       -- APP: dependent function application (erased)

  -- Duplications
  !var term          -- BOX: boxed type
  #term term         -- PUT: boxed value
  [var = term] term  -- DUP: boxed duplication

  -- Self
  $var term         -- SLF: self type
  @term term        -- NEW: self value
  ~term             -- USE: self instantiation
```

Plus the stratification condition, which dictates that:

1. Variables bound by lambdas can only be used at most once.

2. There must be exactly 0 boxes between a variable bound by a lambda and its occurrence.

3. There must be exactly 1 box between a variable bound by a duplication and its occurrence.

4. Recursion can only be used in computationally irrelevant positions (typed and erased terms).

## Erasure to EAC

Computationally, Formality terms are erased to the [Elementary Affine Calculus](https://github.com/moonad/elementary-affine-calculus). The erasure `E(t)` of a Formality term to EAC is defined as:

```javascript
E(Type)      = [x] x
E(var)       = var
E(x : a = b) = E(b)
E({x : a} b) = [x] x
E([x : a] b) = [x] E(b)
E((f x))     = (E(f) E(x))
E(!a)        = [x] x
E(#a)        = # !E(a)
E([x = a] b) = [x = E(a)] E(b)
E($x a)      = [x] x
E(@a b)      = E(b)
E(~a)        = E(a)
```

## Reduction rules

Formality has the same reduction rules as the Elementary Affine Calculus. They are:

1. Application of a lambda

        ([x]a b) ~> [b/x]a

    A function `[x]a` applied to an argument `b` evaluates to the body `a` of that function with the occurrence of its variable `x` replaced by the argument `a`.

2. Duplication of a boxed term

        [x = |a] b ~> [a/x]b

    The duplication `[x = |a] b` of a boxed term `|a` evaluates to the body `b` of the duplication with all occurrences of its variable `x` replaced by the unboxed term `a`.

3. Application of a duplication
        
        ([x = a] b c) ~> [x = a] (b c)

    The application of a duplication simply lifts the duplication outwards.

4. Duplication of a duplication

        [x = [y = a] b] c ~> [y = a] [x = b] c

    The duplication of a duplication simply lifts the inner duplication outwards.

Applicating a boxed term and duplicating a lambda are undefined, prevented by Formality's type system.

## Typing rules

Formality's typing rules are the following:

```javascript
----------- TYP
Type : Type

(var, type) in ctx
------------------ VAR
ctx |- var : type

ctx |- A : Type    ctx, x : A |- B : Type
----------------------------------------- ALL
ctx |- {x : A} B : Type

ctx, x : A |- f : B    ctx |- {a : A} B : Type
---------------------------------------------- LAM
ctx |- [x : A] f : {x : A} B

ctx |- f : {x : A} B    ctx |- a : A
------------------------------------ APP
ctx |- (f a) : [a/x]B

ctx |- A : Type
---------------- BOX
ctx |- !A : Type

ctx |- a : A
-------------- PUT
ctx |- #a : !A

ctx |- a : !A   ctx, x : A |- b : B
----------------------------------- DUP
ctx |- [x = a] b : [a/x]B

ctx, x : A |- A : Type
---------------------- SLF
ctx |- $x A : Type

ctx |- a : [a/x]A
---------------------- NEW
ctx |- @ $x A a : $x A

ctx |- a : $x A
------------------ USE
ctx |- ~a : [a/x]A
```


The first 5 rules are just the plain Calculus of Constructions. Notice that we have `Type : Type`, which should not introduce an inconsistency (see below). The next 3 rules enable implicit duplication, giving Formality the power to express Church iteration (i.e., bounded for-loops, recursion, etc.). The last 3 rules are Self-Types, allowing Formality to express inductive datatypes. Finally, we also allow mutually recursive definitions inside types and erased positions, which isn't shown here.

## Examples

(TODO)

## Consistency

Formality is based on the Elementary Affine Calculus (EAC), which is a terminating untyped language. On EAC, it is impossible to express never-ending terms such as `(λx. (x x) λx. (x x))` due to its reduction rules (i.e., independent of a type system). That means contradictions such as Russel's Paradox naturally can't be expressed. For that reason, we enable powerful type-level features such as mutual recursion and `Type : Type`, under the hypothesis that those won't cause an inconsistency. We're currently studying Formality to verify if that hypothesis actually holds. Obviously, only once that study is complete and Formality is properly formalized it can be considered a proper proof language.

## Relationship with Cedille

[Cedille-Core](https://github.com/maiavictor/cedille-core) is another small proof language, but it has certain characteristics that were a problem for our use case. Defining an inductive datatype in Cedille requires defining 3 different types and explicitly proving reflexivity and induction for them. This process is moderately redundant and verbose, making it hard to write/read Cedille-Core code. One could amend the problem by using separate syntax sugars for inductive datatypes, but, that raises the question: are the sugars part of the language? If not, then people downloading Cedille code in a browser, for example, would still get the desugared, verbose core, making it hard to read theorems. If yes, then the language's spec/size would increase considerably, defeating the purpose of the project.

Moreover, Cedille can't express Scott-encodings, which are the most efficient way to perform constant-time pattern-matching on interaction combinators. It can express other structures with `O(1)` pattern-matching, but they're extremelly complex and have a significant runtime overhead. I'm also not sure if it is possible to implement its induction proofs under EAL. Moreover, it requires heterogeneous equality primitives that are somewhat arbitrary, increase the language's complexity and force it to follow a Curry style. Finally, large eliminations aren't possible yet.

Those problems motivated the creation of Formality. On it, defining inductive datatypes is simple, direct and non-redundant; induction is always the trivial identity; proving `1 != 0` doesn't require extra axioms; Scott-encodings and large eliminations are expressive. The main question is: could a language based on those principles be consistent and, thus, suitable for mathematical reasoning?
