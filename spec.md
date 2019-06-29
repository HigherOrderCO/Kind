# Elementary Affine Type Theory

Elementary Affine Type Theory (EA-TT) is the pure proof language behind [Formality](https://github.com/moonad/formality). This document is a draft of EA-TT's specification. Its goal is to provide all the information required to independently implement complying evaluators, compilers and type-checkers for it.

## Syntax

The syntax of EA-TT is:

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

## Erasure to EA-CORE

Computationally, EA-TT terms are erased to the [Elementary Affine Core](https://github.com/moonad/elementary-affine-core). The erasure `E(t)` of a EA-TT term to EA-CORE is defined as:

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

EA-TT has the same reduction rules as the Elementary Affine Core. They are:

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

Applicating a boxed term and duplicating a lambda are undefined, prevented by EA-TT's type system.

## Typing rules

EA-TT's typing rules are the following:

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


The first 5 rules are just the plain Calculus of Constructions. Notice that we have `Type : Type`, which should not introduce an inconsistency (see below). The next 3 rules enable implicit duplication, giving EA-TT the power to express Church iteration (i.e., bounded for-loops, recursion, etc.). The last 3 rules are Self-Types, allowing EA-TT to express inductive datatypes. Finally, we also allow mutually recursive definitions inside types and erased positions, which isn't shown here.

## Examples

(TODO)

## Consistency

EA-TT is based on the Elementary Affine Core (EA-CORE), which is a terminating untyped language. On EA-CORE, it is impossible to express never-ending terms such as `(λx. (x x) λx. (x x))` due to its reduction rules (i.e., independent of a type system). That means contradictions such as Russel's Paradox naturally can't be expressed. For that reason, we enable powerful type-level features such as mutual recursion and `Type : Type`, under the hypothesis that those won't cause an inconsistency. We're currently studying EA-TT to verify if that hypothesis actually holds. Obviously, only once that study is complete and EA-TT is properly formalized it can be considered a proper proof language.

## Relationship with Cedille

[Cedille-Core](https://github.com/maiavictor/cedille-core) is another small proof language, but after using it for a while, I got the impression it isn't ideal. First, it includes a few unusual primitives like `true == false -> Empty`, that aren't very elegant. It is also somewhat hard to write/read due certain degree of verbosity and redundancy. For example, declaring a new inductive datatype requires implementing 3 different types and explicitly proving reflexivity and induction for them, which isn't straightforward. One could amend the problem by using separate syntax sugars for inductive datatypes, but that raises the question: are the sugars part of the language? If not, then people downloading Cedille code in a browser, for example, would still get the desugared, verbose core, making it hard to read theorems. If yes, then the language's spec/size would increase considerably, defeating the purpose of the project. Finally, it isn't fully compatible with our efficient optimal reduction algorithm, so, using it would require changes anyway. For those reasons, I concluded it'd be worth to explore alternatives that'd better fit our goals.
