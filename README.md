# Elementary Affine Type Theory (EA-TT)

A simple, efficient proof language.

## How it works?

EA-TT "downgrades" the Calculus of Constructions with affine lambdas, and then extends it with elementary duplications, [Self-Types](http://homepage.divms.uiowa.edu/~astump/papers/fu-stump-rta-tlca-14.pdf), type-level recursion and type-in-type. Thanks to its underlying logic, EA-TT is terminating regardless of types, allowing it to have powerful type-level features. This gives us a minimal, consistent proof language capable of inductive reasoning, in contrast to other theories such as CoIC, which include a complex native datatype system.

Check the [spec](spec.md), [examples](main.eatt), and [this post](https://medium.com/@maiavictor/introduction-to-formality-part-1-7ae5b02422ec), where we port some Agda proofs to EA-TT!

```javascript
. Vector [A : Type] [n : Nat]
: Type
= $self
  {-P : {n : Nat} {as : (Vector A n)} Type}
  {cons  : {-n : Nat} {a : A} {as : (Vector A n)} (P (succ n) (cons -A -n a as))}
  {nil  : (P zero (nil -A))}
  (P n self)

. cons [-A : Type] [-n : Nat]
: {a : A} {as : (Vector A n)} (Vector A (succ n))
= [a] [as]
  @(Vector A (succ n)) [-P] [cons] [nil]
  (cons -n a as)

. nil [-A : Type]
: (Vector A zero)
= @(Vector A zero) [-P] [cons] [nil]
  nil
```

EA-TT is the underlying type theory behind [Formality](https://github.com/moonad/formality).

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
