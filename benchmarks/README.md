## Benchmarks

Some benchmarks comparing Formality to other languages. Current results:

Benchmark | Formality | JavaScript V8 (identical) | JavaScript V8 (native) | Haskell GHC (identical) | Haskell GHC (native)
--- | --- | --- | --- | --- | ---
MapInc | 0.29s | 819s | 93.2s | 29.4s | 23.4s
BinTrees | 28.3s | - | 4.82s | - | 0.41s

Tested in a 3.3 GHz Intel Core i7, 16 GB LPDDR3.

### Philosophy

1. Identical programs should be identical to the Formality implementation, up to the most minimal details.

2. Native programs should "feel natural" on the implemented language.
 
3. Benchmarks should cover common idioms that happen in practice.

4. The compiler shouldn't be pre-running programs.

### Benchmark #1: MapInc

This test initializes a list of `1000` lists of 32-bit bitstrings, all zeroes and increments each bitstring of the list by `1`, repeating that operation `2^20` times. The purpose of this test is to measure how good a programming language is at creating algebraic data structures, processing them recursively, and, in particular, eliminating intermediate structures at runtime. Since no other functional language performs runtime-fusion, this is a good example of optimality providing an asymptotical speedup. Run with:

```bash
time formality mapinc.for -f main

ghc -O2 mapinc_identical.hs -o mapinc_identical; time ./mapinc_identical
ghc -O2 mapinc_inative.hs -o mapinc_native; time ./mapinc_native

time node mapinc_identical.js # requires recuding the size of n
time node mapinc_native.js
```

### Benchmark #2: BinTrees

This tests initializes a perfect binary tree and recursivelly pattern-matches over the whole structure. The purpose of this is to measure the **raw allocation/pattern-matching** performance of a language. Since Formality isn't optimized for raw performance, this is a good example of how far it is from catching up to more mature compilers.

TODO: not here yet, but [this](https://github.com/MaiaVictor/symmetric-interaction-calculus-benchmarks) test can be executed with [SIC](https://github.com/maiavictor/symmetric-interaction-calculus).
