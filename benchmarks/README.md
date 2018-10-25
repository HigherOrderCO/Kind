## Benchmarks

Some benchmarks comparing Formality to other languages. Current results:

Benchmark | Formality | JavaScript V8 (identical) | JavaScript V8 (native) | Haskell GHC (identical) | Haskell GHC (native)
--- | --- | --- | --- | --- | ---
MapInc | 0.29s | 819s | 93.2s | 29.4s | 23.4s
Alloc | 15.0s | 11.2s | - | 0.41s | -

Tested in a 3.3 GHz Intel Core i7, 16 GB LPDDR3.

### Philosophy

1. Benchmarks should cover simple, common programs that are expected to happen a lot in practice.

2. "Identical" implementations should be exactly the same as the Formality one, up to the most minimal details.

    *(That way we can identify cases where Formality performs well/poorly relative to other compilers.)*

3. "Native" implementations should "feel natural" on the implemented language.
 
    *(That way we can test if speedups still hold compared to idiomatic code in other languages.)*

4. Caution should be taken to make sure the compiler shouldn't be pre-running programs.

5. Benchmarks are notoriously hard and misleading. We should do our best to make meaningful comparisons!

6. Once Formality is more mature, we should aim for more standard benchmarks such as the [Benchmark Game](https://benchmarksgame-team.pages.debian.net/benchmarksgame/).

## Benchmark #1: MapInc

Applies `.map(x => x + 1)` `2^20` times to a small list of `100` zeros. The purpose of this is to measure how the programming language deals with highly functional code such as using `.map` extensively. Run with:

```bash
time formality mapinc.for -f main

ghc -O2 mapinc_identical.hs -o mapinc_identical; time ./mapinc_identical
ghc -O2 mapinc_native.hs -o mapinc_native; time ./mapinc_native

time node mapinc_identical.js # requires recuding the size of n
time node mapinc_native.js
```

## Benchmark #2: Alloc

This tests allocates a very huge list and then iterates over it to count its length. The purpose of this is to measure the raw allocation performance of a language.

## Benchmark #3: PatternMatch

## Comments

Formality is still interpreted and there is much work to do before it reaches the raw performance of mature languages. Despite that, due to asymptotical beta-reduction optimality, it beats them in some interesting cases where it benefits from runtime fusion; the more you abuse high order functions, maps, folds etc., the more likely that is. Similarly, if your code is close to the metal, using the cache efficiently, unboxed structures, etc., Formality will fall far behind. Those benchmarks aim to measure those extremes and give us directions on how to improve Formality to catch up with mature compilers.

## Note

Formality doesn't feature native number types yet. As such, the goal of those benchmarks is to test, mainly, memory allocation / cleanup, and how well it optimizes functional idioms (algebraic datatypes, pattern-matching, recursion, etc.).
