# Formality-Core

An optimal compilation target for functional programming languages. It is:

1. **Beta-optimal:** beta-reduction is [asymptotically faster](https://medium.com/@maiavictor/solving-the-mystery-behind-abstract-algorithms-magical-optimizations-144225164b07) than other functional languages.

2. **GC-free:** due to affine lambdas, memory is simply freed when values go out of scope.

3. **Parallel:** can efficiently target GPUs, FPGAs and other parallel architectures.

4. **Efficient:** interaction-net runtime with 128-bit nodes, unboxed 32-bit uints, no costly bookkeeping.

5. **Terminating:** computations are guaranteed to halt.

6. **Portable:** soon-to-be implemented in [FM-NET](../FM-Net), a portable, 400-LOC runtime.

This repository includes a reference implementation in [JavaScript](https://github.com/moonad/Formality-JavaScript/tree/master/FM-Core). We're working in specifications/formalizations, and low-level (LLVM/CUDA) backends.

## Example

An interesting example is map-reduce. Since Formality is evaluated with interaction nets, all you need to do to parallelize your program is to perform tree-like, branching recursion. Parallelism comes for free, as long as those branches are independent. Here, we sum all numbers from 0 to 65536 by creating a binary tree of depth 16 and folding over it:

```javascript
// Sums all numbers from 0 to 65536 (2**16) in parallel
// Uses `map_reduce` from http://tiny.cc/fmc_map_reduce
def main:
  let map = {i} i
  let red = {a b} |a + b|
  let sum = (map_reduce ~16 ##map ##red)
  ["Sum from 0 from 65536 is:", sum]
```

This example computes the nth number of the Fibonacci sequence. It uses compact λ-encoded nats to emulate loops.

```javascript
// Gets the nth number of the Fibonacci sequence
def fib: {n}
  let init = [0,1]
  let loop = {state}
    get [a,b] = state
    cpy b = b
    [b, |a + b|]
  let stop = {state}
    (snd state)
  (for n #init #loop #stop)
```

Here is a table showing how many graph rewrites it takes for it to compute `fib(n)`:

n | fib(n) % 2^32 | graph rewrites
--- | --- | ---
1000 | 1318412525 | 6116
2000 | 3779916130 | 12124
3000 | 628070097 | 18139
4000 | 45579869 | 24132
5000 | 2020817954 | 30133
6000 | 1434712737 | 36147
7000 | 1424409805 | 42147
8000 | 1154982114 | 48140

As you can see, `fib(n)` is linear, and needs exactly 6 graph rewrites per iteration of the loop. This JS implementation performs roughly `3m` rewrites/s. We expect this to increase a few orders of magnitude with compilers and hardware.

For more examples, check our [wiki](https://github.com/moonad/Formality/wiki).

## Usage

1. Install it with npm:

```
npm i -g formality-core
```

2. Type `fmc` to see a list of options and test in our example:

```
git clone https://github.com/moonad/formality.git
cd stdlib
fmc -s main
```

For a reference of the language features, check our [wiki](https://github.com/moonad/Formality/wiki).

## Implementations
- [JavaScript](https://github.com/moonad/Formality-JavaScript/tree/master/FM-Core)


## Theory

Formality-Core is based on the [Elementary Affine Core](../EA-Core), extended with numeric primitives and pairs. It is compiled to a lightweight interaction net system based on [Symmetric Interaction Combinators](https://pdfs.semanticscholar.org/1731/a6e49c6c2afda3e72256ba0afb34957377d3.pdf) for evaluation, as shown below:

<img src="https://github.com/moonad/Formality/blob/master/docs/images/inet-simulation.gif" width="600" height="451" />

To learn more about optimal evaluators and how they relate to traditional functional languages, check [this Reddit post](https://www.reddit.com/r/haskell/comments/bp55ua/new_tool_for_exploring_optimal_reductions/enr3d42/).
