## Formality

An efficient programming language featuring formal proofs.

Like Agda, Idris and Coq, Formality has a powerful type system capable of expressing and proving arbitrary theorems about its programs. Like Rust, C and C++, it is very lightweight and doesn't require a garbage collection. Unlike both, its runtime is massively parallel, being the first general-purpose programming language aiming the GPU. This allows it to be used for cases that are simply not viable in other proof assistants, such as smart contracts and computer graphics.

### How?

Formality is merely a syntax for expressing inductive types (data) and dependent functions (computation). It is compilled to [Cedille-Core](https://github.com/maiavictor/cedille-core), which acts as a minimalist termination / consistency checker for it, allowing us to prove mathematical theorems about its programs. It is, then, compiled to the [Abstract Calculus](https://github.com/maiavictor/abstract-calculus), a massivelly parallel, non-garbage-collected and optimal model of computation. This lightweight runtime allows it to be used both for front-end applications and back-end smart-contracts. 

### Benchmarks

(TODO)

### Syntax

[Here.](https://gist.github.com/MaiaVictor/b9fcf40f5b21a8cf399e48978bd167d1)
