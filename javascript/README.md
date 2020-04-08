Formality-Core.js
=================

An implementation of the Formality-Core spec in JavaScript.

Install
-------

To install it, first install [npm](https://www.npmjs.com/get-npm), then run:

```
npm i -g formality-core
```

Usage
-----

Write a `.fmc` file with Formality-Core definitions and run:

```
fmc my_file.fmc
```

You can also use it as a library with:

```javascript
const fmc = require("formality-core");
```

Example
-------

Save the file below as `two_plus_two.fmc`:

```javascript
// The inductive Nat datatype, using Scott encoding with Self types:

// T Nat
// | zero
// | succ(pred: Nat)

Nat: Type
  self<P: Nat -> Type> ->
  (zero: P(zero)) ->
  (succ: (n: Nat) -> P(succ(n))) ->
  P(self)

zero: Nat
  <P> (zero) (succ) zero

succ: Nat -> Nat
  (pred) <P> (zero) (succ) succ(pred)

// Addition of Nats

add: Nat -> Nat -> Nat
  (n) (m)                          // add(n: Nat, m: Nat) : Nat
  n<() Nat>                        // case n
  | m;                             // | zero => m
  | (n.pred) succ(add(n.pred)(m)); // | succ => succ(k + m)

// Computes 2 plus 2

main: Nat
  let two = succ(succ(zero))
  add(two)(two)
```


Then run `fmc two_plus_two.fmc`. It will output:

```bash
Type-checking example.fmc:
Nat  : Type
zero : Nat
succ : Nat -> Nat
add  : Nat -> Nat -> Nat
main : Nat

All terms check.

Evaluating `main`:
(zero) => (succ) => succ((zero) => (succ) => succ((zero) => (succ) => succ((zero) => (succ) => succ((zero) => (succ) => zero))))
```
