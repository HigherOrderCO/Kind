# Formality: a small, optimal proof language

The goal of this work is to design a proof language, that is:

1. Very small, in the sense it can be implemented in, say, `< 1000 LOC` in a common programming language;

2. Optimal, in the sense it can be evaluated fastly by the [optimal algorithm](https://medium.com/@maiavictor/solving-the-mystery-behind-abstract-algorithms-magical-optimizations-144225164b07) without oracles.

This is a **very informal**, initial specification of its current design. A proper formal specification will be developed once the language is more mature and key problems are solved.

## Why?

Those requirement are desirable for many reasons. First, we want Formality to be, rather than a single reference implementation, an open specification, like ES5 or R5RS, that people can easily implement themselves, removing the need to trust our own code. Second, we want it to be lightweight and portable, in the sense it can exist everywhere: on the desktop, on the browser, on the mobile, on your TV and even in a scientific calculator. Third, we want it to be compatible with the optimal reduction algorithm, which, we believe, is the key for a future where programs run natively in massively parallel architectures with unprecedented performances.

## Grammar

The current language is made up of the following grammar:

```javascript
term ::=
  -- Functions
  {var : term} term -- ALL: dependent function type
  [var : term] term -- LAM: a lambda
  (term term)       -- APP: an application

  -- Duplications
  !var term         -- BOX: a boxed type
  <var = term> term -- PUT: boxes a value
  [var = term] term -- DUP: duplicates a boxed value

  -- Other
  Type              -- TYP: the type of types
  var               -- VAR: a variable
  var : term = term -- LET: a recursive definition

```

With the following restrictions:

1. Lambda-bound variables can only occur at most once in computational positions.

2. There must be exactly 0 boxes wrapping the computational occurrence lambda-bound variable.

3. There must be exactly 1 box wrapping a duplicate 

Those restrictions allow Formality to erase to the EAL-Calculus, a language which has two roles:

1. It is compatible with the oracle-less optimal reduction algorithm, enabling fast parallel evaluation.

2. It is a terminating untyped language. This fact is expected to play a role in proving soundness.

## Erasure to EAL-Calculus

The erasure procedure is as follows:

```javascript
erase({x : a} b) = λx. x
erase([x : a] b) = λx. erase(b)
erase((f x))     = (erase(f) erase(x))
erase(!x a)      = λx. x
erase(<x : a> b) = !erase(b)
erase(Type)      = λx. x
erase(var)       = var
erase(x : a = b) = erase(b)
```

> TODO: formalize the syntax and reduction rules of EAL-Calculus.

> TODO: explain the n-ary interaction combinators, the Formality <-> EAL <-> IC (de)compilation algorithm, etc.

## Typing rules

The typing rules are as follows:

```javascript
----------- typ (type of types)
Type : Type

(var, type) in ctx
------------------ var (variable)
ctx |- var : type

ctx, x : A |- A : Type    ctx, x : A |- B : Type
------------------------------------------------ all (dependent function type)
ctx |- {x : A} B : Type

ctx, x : A |- f : B    ctx |- {a : A} B : Type
---------------------------------------------- lam (dependent function intro)
ctx |- [x : A] f : {x : A} B

ctx |- f : {x : A} B    ctx |- a : [a/x]A
----------------------------------------- app (dependent function elim)
ctx |- (f a) : [a/x]B

ctx, x : A |- A : Type
---------------------- box
ctx |- !x A : Type

ctx |- a : [a/x]A
----------------------- put
ctx |- <x : A> a : !x A

ctx |- a : !x A   ctx, x : A |- b : B
------------------------------------- dup
ctx |- [x = a] b : [a/x]B
```

The first 5 rules are similar to CoC, except variables bound by lambdas and alls are in scope on their types. This is what allows for inductive encodings. The `box`, `put` and `dup` rules enable explicit duplications in an otherwise affine language. Note that the type `!x A` of a boxed value, `<x : A> a` can access `a`. That allows the duplication `x` of a term `a` to remember that `x == a` (due to `dup`'s typing rule including `[a/x]B`).

> TODO: include computationally irrelevant all/lam/app. 

> TODO: include mutually recursive definitions.

## Computation rules

```javascript
1. Beta-reduction:

    ([x : A]f t) ~> [t/x]A

2. Duplication:

    [x = <x : A> a] b ~> [a/x]b

3. Lam-dup permutation:

    ([x = a] b c) ~> [x = a] (b c)

4. Dup-dup permutation:

    [x = [y = a] b] c ~> [y = a] [x = b] c
```

The first rule is the usual beta-reduction. Note that lambdas are affine, so `x` can occur at most once. The second rule is an explicit duplication. Note that it must consume a `put`. The third and forth rules are permutations needed to unlock reductions stuck by duplication constructors.

> TODO: include mutually recursive definitions.

## Examples

An inductive `Nat` type can easily be implemented:

```javascript
Nat
| A Scott-encoded natural number.
: {self : (Nat self)} Type
= [self]
  {-Prop : (Typ Nat)}
  {succ  : {pred : (Nat pred)} (Prop (Nat.succ pred))}
  {zero  : (Prop Nat.zero)}
  (Prop self)

Nat.zero
: (Nat Nat.zero)
= [-Prop] [succ] [zero] zero

Nat.succ
: {pred : (Nat pred)} (Nat (Nat.succ pred))
= [pred] [-Prop] [succ] [zero]
  (succ pred)

Nat.induct
: {self  : (Nat self)}
  {-Prop : {self : (Nat self)} Type}
  {succ  : {n : (Nat n)} {ih : (Prop n)} (Prop (Nat.succ n))}
  {zero  : (Prop Nat.zero)}
  (Prop self)
= [self] [-Prop] [succ] [zero]
  (self -Prop [n](succ n (Nat.induct n -Prop succ zero)) zero)
```

Note that `Nat` isn't a proper type, but a self-indexed types, i.e., `Nat : {self : (Nat self)} Type`. In order to use it, we must write programs that accept self-indexed types. For example, we can define a pair of self-indexed types as: 

```javascript
Pair
| A simple pair.
: {A : (Typ A)}
  {B : (Typ B)}
  (Typ (Pair A B))
= [A] [B] [self]
  {-Prop : (Typ (Pair A B))}
  {new   : {a : (A a)} {b : (B b)} (Prop (Pair.new -A -B a b))}
  (Prop self)

Pair.new
: {-A : (Typ A)}
  {-B : (Typ B)}
  {a  : (A a)}
  {b  : (B b)}
  (Pair A B (Pair.new -A -B a b))
= [-A] [-B] [a] [b] [-Prop] [new] (new a b)
```

Or the propositional equality for self-indexed types as:

```javascript
Eq
| Propositional equality.
: {-T   : (Typ T)}
  {a    : (T a)}
  {b    : (T b)}
  {self : (Eq -T a b self)}
  Type
= [-T] [a] [b] [self]
  {-Prop : {b : (T b)} {self : (Eq -T a b self)} Type}
  {refl  : (Prop a (Eq.refl -T -a))}
  (Prop b self)

Eq.refl
: {-T : (Typ T)}
  {-a : (T a)}
  (Eq -T a a (Eq.refl -T -a))
= [-T] [-a] [-Prop] [refl]
  refl
```

In fact, we can even have a type for functions between self-indexed types:

```javascript
All
| A function between self-referential types.
: {A : (Typ A)} {B : {x : (A x)} (Typ (B x))} (Typ (All A B))
= [A] [B] [self] {x : (A x)} (B x (self x))
```

As an example proof, this is the symmetry of equality:

```javascript
Eq.sym
: {-T : {self : (T self)} Type}
  {-a : (T a)}
  {-b : (T b)}
  {e  : (Eq -T a b e)}
  (Eq -T b a (Eq.sym -T -a -b e))
= [-T] [-a] [-b] [e]
  (e -[b] [self] (Eq -T b a (Eq.sym -T -a -b self))
    (Eq.refl -T -a))
```

Sadly, though, the `Nat.induct` definition above requires recursion, which could be problematic when formalizing Formality. An alternative, Parigot-encoded, inductive `Nat` can be represented as follows:

```javascript
Typ
: {T : (Typ T)} Type
= [T] {self : (T self)} Type

Nat
: (Typ Nat)
= [self]
  {-Prop : {self : (Nat self)} {fold : (Prop self fold)} Type}
  {succ  : !succ {-pred : (Nat pred)} {fold : (Prop pred fold)} (Prop (Nat.succ pred) (succ -pred fold))}
  {zero  : !zero (Prop Nat.zero zero)}
  !here (Prop self here)

Nat.succ
: {pred : (Nat pred)} (Nat (Nat.succ pred))
= [pred] [-Prop] [succ] [zero] [S = succ] [Z = zero]
  [F = (pred -Prop <succ>S <zero>Z)]
  <here : (Prop (Nat.succ pred) here)>
  (S -pred F)

Nat.zero
: (Nat Nat.zero)
= [-Prop] [succ] [zero] [S = succ] [Z = zero]
  <zero : (Prop Nat.zero zero)>
  Z

Nat.ind
: {-Prop : {self : (Nat self)} {fold : (Prop self fold)} Type}
  {succ : !succ {-pred : (Nat pred)} {fold : (Prop pred fold)} (Prop (Nat.succ pred) (succ -pred fold))}
  {zero : !zero (Prop Nat.zero zero)}
  {n : (Nat n)}
  !here (Prop n here)
= [-Prop : {self : (Nat self)} {fold : (Prop self fold)} Type]
  [succ  : !succ {-pred : (Nat pred)} {fold : (Prop pred fold)} (Prop (Nat.succ pred) (succ -pred fold))]
  [zero  : !zero (Prop Nat.zero zero)]
  [n     : (Nat n)]
  (n -Prop succ zero)
```

If the everything-is-a-self-indexed-type style becomes unfruitful, one can turn those into actual types as follows:

```javascript
ANat
: Type
= !self (Nat self)

ANat.zero
: ANat
= <self : (Nat self)>
  Nat.zero

ANat.succ
: {n : ANat} ANat
= [n] [N = n]
  <self : (Nat self)>
  (Nat.succ N)
```

## Problems and goals

The ideas presented above show different ways to represent inductive datatypes in a small proof language that is compatible with optimal reductions. Those ideas and building blocks aren't complete without a formalization. In order to be considered a real proof language, one needs to formalize it and prove its soundness. This will determine how its programs must be written. If, for example, it allows certain degrees of value-level recursion, then we'll be able to use Haskell-like datatypes and proofs like `Nat.induct`. If that's not possible, alternatives like the Parigot encodings may work. In any case, everything depends on such formalization, and not much can be done before it is complete. I plan to proceed as such:

1. Formalize the untyped affine λ-calculus in Agda, its reduction rules, and prove it terminates.

2. Extend it with explicit elementary duplications (elementary affine λ-calculus) and prove it still terminates.

3. Formalize Formality in Agda as a type system for the elementary affine λ-calculus and prove it is sound.

4. Show different ways to implement datatypes and their induction principles.

5. Formalize n-ary interaction combinators in Agda and its reduction rules.

6. Formalize the Formality <-> EAC <-> IC compiler, prove reduction soundness.

This is an effort that may take a lot of time as I learn most of the required techniques. The current design of Formality may change considerably through this process.
