# Frequently Asked Questions
(or, asked at least once anyway 😃)

Not satisfied by the answer? Don't see your question? Swing by
[Telegram](https://t.me/formality_lang) and we'd be happy to help.

## Table of Contents

Questions are in no particular order, but are loosely grouped
by category.

- [Frequently Asked Questions](#frequently-asked-questions)
  - [Table of Contents](#table-of-contents)
  - [Formality Features](#formality-features)
    - [Indexed Data Types, or "What's that funny '~'"?](#indexed-data-types-or-whats-that-funny-)
    - [Does Formality compile to native datatypes by name or definition?](#does-formality-compile-to-native-datatypes-by-name-or-definition)
    - [How do I implement interfaces/typeclasses/traits?](#how-do-i-implement-interfacestypeclassestraits)
    - [Is Formality Consistent?](#is-formality-consistent)
    - [Can I have axioms?](#can-i-have-axioms)
    - [What are the different parts of Formality?](#what-are-the-different-parts-of-formality)
    - [What's the difference between Formality-Core and EA-TT?](#whats-the-difference-between-formality-core-and-ea-tt)
    - [Does Formality use the Optimal Calculus (Ultimate Calculus), or does it use INets?](#does-formality-use-the-optimal-calculus-ultimate-calculus-or-does-it-use-inets)
  - [Formality Concepts](#formality-concepts)
    - [What's the difference between Bool.true and truth?](#whats-the-difference-between-booltrue-and-truth)
    - [What is Unit? What is Empty? What does this have to do with truth and falsity?](#what-is-unit-what-is-empty-what-does-this-have-to-do-with-truth-and-falsity)
    - [If Formality doesn't have side-effects, how do I do IO?](#if-formality-doesnt-have-side-effects-how-do-i-do-io)
  - [Moonad](#moonad)
    - [Have you heard of Unison's hash-based imports?](#have-you-heard-of-unisons-hash-based-imports)

## Formality Features
### Indexed Data Types, or "What's that funny '~'"?
The `~` operator allows you to index a datatype. For example, 
consider the definition of Vector, a List with a statically
known length:
```
T Vec <A: Type>                 ~ (len: Nat)
| nil                           ~ (zero);
| cons(n:Nat, x:A, xs:Vec(A,n)) ~ (succ(n));
```

For comparison, in Agda the definition would be:

```agda
data Vec (A : Set) : (len : Nat) -> Set where
  nil : Vec A zero
  cons : (n : Nat) -> (x : A) -> (xs : Vec A n) -> Vec A (succ n)
```
A few differences: in Agda, you separate parameters and indices with a : . In Formality, you write parameters inside <> and indices after the ~ . In Agda, you need -> Set on the first line. In Formality, no. In Agda, you write the fields with (a : A) -> (b : B) -> ... . In Formality, you write with (a: A, b: B) . In Agda, you need to write the return type of each constructor. In Formality, we omit the return type. Problem is, that only works for non-indexed datatypes; for indexed datatypes, you *need* to write the indices. So, to do that while also omitting the return type, we use ~ to configure the index on each case.

### Does Formality compile to native datatypes by name or definition?

The Javascript backend for Formality automatically compiles `Bool`'s
`String`'s, `Nat`'s, etc. to native Javascript booleans, strings, BigIntegers, etc.
This produces large performance gains over lambda-encoded data structures.
Formality uses the name of the type to do this - i.e, `Nat` will always be compiled
to BigIntegers, but an identical definition with a different name won't.

### How do I implement interfaces/typeclasses/traits?

A good example to emulate is [Moonad's definition for monad](https://github.com/moonad/Moonad/blob/master/lib/Monad.fm). The basic idea is to define a seperate type that
takes in a type as an erased argument, and whose type constructor takes in the methods
defined on that "typeclass/trait". Then you can define "methods" on the "typeclass"
that just call the implementation supplied by the user.

(note: this will change if and when Formality has functional extensionality)

### Is Formality Consistent?

No, and that's by design. Here's a snippet from a recent conversation on it:

> ...I concluded making core consistent was a software engineering mistake, since it forces everyone into a specific termination discipline, and different people might want to work on different terminating subsets. For example you might have structural recursion and be Coq/Agda-like. Or you might have elementary duplications and be interaction-net friendly. Or you may just be writing web apps and not care about termination.

### Can I have axioms?

Definitely! It's as easy as recursion:

```
axiom: A
    axiom
```

This obviously wouldn't pass the termination checker, is still valid Formality code.

### What are the different parts of Formality?
- Formality-Lang
- Formality-Core
- The termination checker (to be implemented)
- A backend (Javascript, Haskell, EVM, etc.)
- Moonad

### What's the difference between Formality-Core and EA-TT?
- FormalityCore is a superset of EA-TT.
- FormalityCore with boxes is EA-TT. This subset has affinity and termination, and compiles to the super-fast inets.

### Does Formality use the Optimal Calculus (Ultimate Calculus), or does it use INets?

## Formality Concepts

### What's the difference between Bool.true and truth?

This is subtle, but near to the heart of Formality and worth mulling over:
check out Victor Maia's [gist on the subject](https://gist.github.com/MaiaVictor/6f0ad6665bcefc6cd2997538e7c6c185).


### What is Unit? What is Empty? What does this have to do with truth and falsity?
Check out the previous question! 

### If Formality doesn't have side-effects, how do I do IO?

Monadic effects (todo - explain).

## Moonad

### Have you heard of Unison's hash-based imports?

Yes! It's an interesting tradeoff, and we've considered them, along with several other
strategies. Moonad's treatment of imports is still in the works - if you have
an opinion, come share it on Telegram.

