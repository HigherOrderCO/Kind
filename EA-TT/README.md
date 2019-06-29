# Elementary Affine Type Theory (EA-TT)

A simple, efficient proof language, and the underlying type-theory behind [Formality](https://github.com/moonad/formality).

## How it works?

EA-TT "downgrades" the Calculus of Constructions with affine lambdas, and then extends it with elementary duplications, [Self-Types](http://homepage.divms.uiowa.edu/~astump/papers/fu-stump-rta-tlca-14.pdf), type-level recursion and type-in-type. Thanks to its underlying logic, EA-TT is terminating regardless of types, allowing it to have powerful type-level features. This gives us a minimal, consistent proof language capable of inductive reasoning through λ-encodings, in contrast to other theories such as CoIC, which include a complex native datatype system.

Check the [spec](spec.md), [examples](main.eatt), and [this post](https://medium.com/@maiavictor/introduction-to-formality-part-1-7ae5b02422ec), where we port some Agda proofs to EA-TT!

## Usage

Elementary Affine Type Theory is currently implemented as a small, dependency-free JavaScript library. It will futurely be implemented in other languages, and formalized in Agda/Coq. To use the current implementation:

```bash
# Installs elementary-affine-type-theory
npm i -g elementary-affine-type-theory

# Enters the repository
git clone https://github.com/moonad/elementary-affine-type-theory
cd elementary-affine-type-theory

# Checks and evaluates main
eatt main
```

You can also use it as a library from your own JS code.

## Example

This implements inductive natural numbers as well as the induction principle.

```javascript
// The type of an inductive Nat refers to its constructors
. Nat
: Type
= $self
  {-P : {:Nat} Type}
  {s  : ! {-n : Nat} {h : (P n)} (P (succ n))}
  {z  : ! (P zero)}
  ! (P self)

// Successor of an inductive Nat
. succ
: {n : Nat} Nat
= [n]
  @Nat [-P] [s] [z]
  [succ = s]
  [zero = z]
  [pred = (~n -P |succ |zero)]
  | (succ -n pred)

// Zero of an inductive Nat
. zero
: Nat
= @Nat [-P] [s] [z]
  [succ = s]
  [zero = z]
  | zero

// Its induction hypopthesis is a simple use (`~`) of the self axiom
. induction
: {-P : {:Nat} Type}
  {s  : ! {n : Nat} {x : (P n)} (P (succ n))}
  {z  : ! (P zero)}
  {n  : Nat}
  ! (P n)
= [-P] [s] [z] [n]
  [succ = s]
  [zero = z]
  (~n -P |succ |zero)
```


To understand how it works, [check our blog post](https://medium.com/@maiavictor/introduction-to-formality-part-1-7ae5b02422ec)!
