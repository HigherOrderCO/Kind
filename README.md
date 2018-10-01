## Formality

An efficient programming language and proof assistant.

Like Agda, Idris and Coq, Formality has a powerful type system capable of expressing and proving arbitrary theorems about its programs. Like Rust, C and C++, it is very lightweight and doesn't require a garbage collection. Unlike both, its runtime is massively parallel, being the first general-purpose programming language aiming the GPU. This allows it to be used for cases that are simply not viable in other proof assistants, such as smart contracts and computer graphics.

### How?

What makes most functional programming languages slow is the fact functions are, simply, too slow. Since a function can copy and enclosure variables indiscriminately, runtimes for functional languages tend to be bloated with heavy machinery for computing beta-reduction. Formality is a modification of the Calculus of Inductive Constructions, which is the foundation of the proof assistant Coq, with Elementary-Affine Logic concepts. This puts a strict discipline on how and when variables can be duplicated, which, in turn, allows Formality programs to be compiled to the [Abstract Calculus](https://github.com/maiavictor/abstract-calculus), a massivelly parallel, non-garbage-collected and optimal model of computation.

### Benchmarks

(TODO)

### Examples

Formality is, similarly to other proof assistants, basically combination of inductive datatypes, representing data, and functions, representing computations. Here is an example of addition in the planned syntax:

```haskell
data Nat : Type
| succ(x : Nat) : Nat
| zero          : Nat

def double(a : Nat)
  match a : Nat to Nat
  | succ(pred) => succ(succ(double(pred)))
  | zero => zero

data Fin : Nat -> Type
| zer(n : Nat)            : Fin (suc n)
| suc(n : Nat, i : Fin n) : Fin (suc n)
```

This syntax isn't implemented yet, but an improvised syntax can already be used to test programs, as can be seen on src/Main.rs.

### Implementation status

The implementation is in a very early stage. It hasn't been reviewed by experts, doesn't include a termination checker (and, thus, is still inconsistent), doesn't include EAL-checks. There are no tests and it certainly has bugs. 

### TODO

- Parser/formatter for the syntax above

- Termination checker

- Stratified duplications (currently only linear functions allowed)

- Compilation to the EVM

- CUDA runtime for the Abstract Calculus

- Benchmarks
