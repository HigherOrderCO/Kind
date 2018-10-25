## Benchmarks

Some benchmarks comparing Formality to other languages. Current results:

test | JavaScript (V8) | Haskell (GHC) | Formality
--- | --- | --- | --- 
MapInc | 819s | 29s | 0.3s
BinTrees | 4.8s | 0.41s | 28s

### Philosophy

1. Tested programs should **identical**, up to the most minimal details.

    It'd be meaningless to compare how well compilers behave if we used different inputs! If a language performs bad in a benchmark because the tested program isn't "idiomatic" in that language, then a **new** benchmark should be designed with a representation where it performs better.
 
2. Benchmarks should cover common idioms that happen in practice.

    Computer Benchmark Game cases are welcome, but, IMO, not enough alone, because they don't cover a lot of important features, such as the ability of a language to optimize with high-level, functional code.

3. The compiler shouldn't be pre-running programs.

    In the case of Formality, that is obviously the case as the compilation time is included in its numbers. Other languages may need some caution.

### Benchmark #1: MapInc

This test initializes a list of `1000` lists of 32-bit bitstrings, all zeroes and increments each bitstring of the list by `1`, repeating that operation `2^20` times. The purpose of this test is to measure how good a programming language is at creating algebraic data structures, processing them recursively, and, in particular, eliminating intermediate structures at runtime. Since no other functional language performs runtime-fusion, this is a good example of optimality providing an asymptotical speedup. Run with:

```bash
ghc -O2 mapinc.hs -o mapinc; time ./mapinc; rm mapinc
time formality mapinc.for -f main
node mapinc.js --stack-size=1000000 # requires recuding the size of n
```

### Benchmark #2: BinTrees

This tests initializes a perfect binary tree and recursivelly pattern-matches over the whole structure. The purpose of this is to measure the **raw allocation/pattern-matching** performance of a language. Since Formality isn't optimized for raw performance, this is a good example of how far it is from catching up to more mature compilers.

TODO: not here yet, but [this](https://github.com/MaiaVictor/symmetric-interaction-calculus-benchmarks) test can be executed with [SIC](https://github.com/maiavictor/symmetric-interaction-calculus).
