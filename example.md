
# main.kindc

This file contains fundamental type and function definitions in Kind, a functional programming language with a dependent type system.

## Basic Types

### Bool

Defines the boolean type with two constructors:

```hs
Bool : * = #[]{
  #true{} : Bool
  #false{} : Bool
};
```

### Nat

Defines the natural numbers type with two constructors:

```hs
Nat : * = #[]{
  #zero{} : Nat
  #succ{ pred: Nat } : Nat
};
```

## Predicates and Equality

### IsTrue

A predicate that checks if a boolean is true:

```hs
IsTrue : ∀(b: Bool) * = λb #[b]{
  #indeed{} : (IsTrue #true{})
};
```

### Equal

Defines propositional equality between two values of the same type:

```hs
Equal : ∀(T: *) ∀(a: T) ∀(b: T) * = λT λa λb #[a b]{
  #refl{} : (Equal T a a)
};
```

## Functions

### rewrite

A function that allows rewriting an equality proof:

```hs
rewrite
: ∀(T: *)
  ∀(a: T)
  ∀(b: T)
  ∀(e: (Equal T a b))
  ∀(P: ∀(x: A) *)
  ∀(x: (P a))
  (P b)
= λT λa λb λ{
  #refl: λP λx x
};
```

## Entry Point

The program's entry point is defined as:

```hs
MAIN = rewrite;
```

This file serves as a foundation for fundamental definitions in Kind, including basic types, predicates, and equality manipulation functions.
