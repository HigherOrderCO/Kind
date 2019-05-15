# Formality-Core

An lightweight untyped functional programming language. It is:

1. Compatible with efficient optimal reductions (no bookkeeping/oracle needed).

2. Garbage-collection-free (space is freed when values go out of scope).

3. Massively parallel (can be evaluated in GPUs, FGPAs and similar).

4. Efficient (only 128 bits per lambda/pair node, fully unboxed 32-bit ints).

5. Strongly normalizing: reductions are guaranteed to terminate in elementary time.

It features affine lambdas, elementary duplication ("cloning"), 32-bit numeric primitives and pairs.

## Usage

1. Install it with npm:

```
npm i -g formality-core
```

2. Type `fmc` to see a list of options and test in our example:

```
git clone https://github.com/formality-core
cd formality-core
fmc -s main
```

## Syntax and Documentation

To be developed. Check our example file, [main.fmc](main.fmc).

## Theory

Formality-Core is based on the [Elementary Affine Calculus](https://github.com/moonad/elementary-affine-calculus), extended with numeric primitives and pairs. It is compiled to a lightweight interaction net system based on [Symmetric Interaction Combinators](https://pdfs.semanticscholar.org/1731/a6e49c6c2afda3e72256ba0afb34957377d3.pdf) for optimal parallel evaluation, as shown below:

![animation](https://github.com/moonad/Nasic-Render/raw/master/nasic-render.gif)
