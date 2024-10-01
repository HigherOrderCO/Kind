---
title: Reduce
description: 'Module responsible for reduction and normalization of terms in Kind'
---

# Reduce

This module implements the functionalities for reduction and normalization of terms in the Kind language.

## Main Functions

### reduce

```haskell
reduce :: Book -> Fill -> Int -> Term -> Term
```

Evaluates a term to its weak normal form. The `lv` parameter defines when to expand references:
- 0 = never
- 1 = in redexes

### normal

```haskell
normal :: Book -> Fill -> Int -> Term -> Int -> Term
```

Evaluates a term to its complete normal form.

### bind

```haskell
bind :: Term -> [(String,Term)] -> Term
```

Binds quoted variables to bound HOAS variables.

### genMetas

```haskell
genMetas :: Term -> Term
```

Generates metavariables for a term.

### subst

```haskell
subst :: Int -> Term -> Term -> Term
```

Substitutes a Bruijn level variable with a new value in a term.

## Data Structures

The module uses the following main structures:

- `Term`: Represents terms in the Kind language
- `Book`: Map of definitions
- `Fill`: Map of fillings for metavariables

## Implementation Details

- The `reduce` function implements the lazy reduction strategy, evaluating only when necessary.
- `normal` performs a complete normalization, including subterms.
- `bind` is used to bind variables in lambda abstractions and universal quantifiers.
- `genMetas` is used to generate unique metavariables in a term.
- `subst` implements variable substitution, respecting the term structure.

This module is fundamental for the type system and evaluation of the Kind language, providing the basic reduction and normalization operations necessary for term processing.
