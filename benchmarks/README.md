## Benchmarks

Some benchmarks comparing Formality to other languages. There are still only a few tests, a lot more will be added over the next months. Current results, tested in a 3.3 GHz Intel Core i7, 16 GB LPDDR3:

Benchmark | Formality | Haskell GHC (identical) | Haskell GHC (native) | JavaScript V8 (identical) | JavaScript V8 (native) 
--- | --- | --- | --- | --- | ---
RuntimeFusion | 0.29s| 29.4s | 23.4s | 819s | 9.09s 
PatternMatch | 66.4s| 5.21s | 2.87s | 13.2s | 0.84s 

To understand why Formality performs so well in "very high-level code", check [this Medium post](https://medium.com/@maiavictor/solving-the-mystery-behind-abstract-algorithms-magical-optimizations-144225164b07).

### Philosophy

1. Benchmarks should cover simple, common programs that are expected to happen a lot in practice.

2. "Identical" implementations should be exactly the same as the Formality one, up to the most minimal details.

    *(That way we can identify cases where Formality performs well/poorly relative to other compilers.)*

3. "Native" implementations should "feel natural" on the implemented language.
 
    *(That way we can test if speedups still hold compared to idiomatic code in other languages.)*

4. Caution should be taken to make sure the compiler shouldn't be pre-running programs.

5. Benchmarks are notoriously hard and misleading. We should do our best to make meaningful comparisons!

6. Once Formality is more mature, we should aim for more standard benchmarks such as the [Benchmark Game](https://benchmarksgame-team.pages.debian.net/benchmarksgame/).

## Benchmark #1: RuntimeFusion

Applies `.map(x => x + 1)` `2^20` times to a small list of `100` zeros. The purpose of this is to measure how the programming language deals with highly functional code such as using `.map` extensively; specifically, if it is capable of performing [runtime fusion](https://en.wikipedia.org/wiki/Deforestation_(computer_science)). Equivalent to:

```javascript
var list = [];
for (var i = 0; i < 100; ++i) {
  list.push(0);
}

for (var i = 0; i < Math.pow(2, 20); ++i) {
  list = list.map(x => x + 1);
}

console.log(JSON.stringify(list));
```

Run with:

```bash
time formality runtimefusion.for -f main

ghc -O2 runtimefusion_identical.hs -o runtimefusion_identical; time ./runtimefusion_identical
ghc -O2 runtimefusion_native.hs -o runtimefusion_native; time ./runtimefusion_native

time node runtimefusion_identical.js # requires recuding the size of n
time node runtimefusion_native.js
```

## Benchmark #2: PatternMatch

This tests repeatedly flips the bits of a string of 32 bits, `2^20` times, using algebraic datatypes. Caution is made so that no optimization takes place; i.e., all those pattern matches are actually performed, forcing all languages to do roughly the same actual work. The purpose of this is to measure the raw allocation and matching performance. Equivalent to:

```javascript
const O = (bs) => ({ctor: "O", tail: bs});
const I = (bs) => ({ctor: "I", tail: bs});
const Z = {ctor: "Z"};

const flip = bits => {
  switch (bits.ctor) {
    case "O": return I(flip(bits.tail));
    case "I": return O(flip(bits.tail));
    case "Z": return Z;
  }
}

var bits = O(O(O(O(O(O(O(O(O(O(O(O(O(O(O(O(O(O(O(O(O(O(O(O(O(O(O(O(O(O(O(O(Z))))))))))))))))))))))))))))))));
for (var i = 0; i < Math.pow(2, 20); ++i) {
  bits = flip(bits);
}

console.log(JSON.stringify(bits));
```

Run with:

```bash
time formality patternmatch.for -f main

ghc -O2 patternmatch_identical.hs -o patternmatch_identical; time ./patternmatch_identical
ghc -O2 patternmatch_native.hs -o patternmatch_native; time ./patternmatch_native

time node patternmatch_identical.js
time node patternmatch_native.js
```

## Benchmark #3: ???

Ideas are welcome!

## Comments

Formality is still interpreted and there is much work to do before it reaches the raw performance of mature languages. Despite that, due to asymptotical beta-reduction optimality, it beats them in some interesting cases such as when it benefits from runtime fusion; the more you abuse high order functions, maps, folds etc., the more likely that is. Similarly, if your code is close to the metal, using the cache efficiently, unboxed structures, etc., Formality will fall far behind. Those benchmarks aim to measure those extremes and give us directions on how to improve Formality to catch up with mature compilers.

## Note

Formality doesn't feature native number types yet. As such, the goal of those benchmarks is to test, mainly, memory allocation / cleanup, and how well it optimizes functional idioms (algebraic datatypes, pattern-matching, recursion, etc.).
