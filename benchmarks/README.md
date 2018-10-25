## Benchmarks

Some benchmarks comparing Formality to other languages. Current results:

test | JavaScript (V8) | Haskell (GHC) | Rust | Formality
--- | --- | --- | --- | --- 
MapInc | 819s | 29s | - | 0.3s
BinTrees | 4.8s | - | - | 28s

### 1. MapInc

This test initializes a list of `1000` lists of 32-bit bitstrings, all zeroes and increments each bitstring of the list by `1`, repeating that operation `2^20` times. The purpose of this test is to measure how good a programming language is at **fusing intermediate structures** (i.e., [deforestating](https://en.wikipedia.org/wiki/Deforestation_(computer_science))) at runtime. Since no other functional language performs runtime-fusion, this is a good example of optimality providing an *asymptotical* speedup. Run with:

```bash
ghc -O2 mapinc.hs -o mapinc; time ./mapinc; rm mapinc
time formality mapinc.for -f main
```

### 2. BinTrees

This tests initializes a perfect binary tree and recursivelly pattern-matches over the whole structure. The purpose of this is to measure the **raw allocation/pattern-matching** performance of a language. 

TODO: not written yet, but [this](https://github.com/MaiaVictor/symmetric-interaction-calculus-benchmarks) test can be executed with [SIC](https://github.com/maiavictor/symmetric-interaction-calculus). It shows Formality is about 5 to 10 times slower than Node.js in the worst case, using the Rust interpreter (which operates at 30m rewrites/s on my CPU). At the maximum speed reached in a GPU, 150m rewrites/s, it would actually be competitive with Node (!). There is still much work to be done on the raw efficiency side, though. 
