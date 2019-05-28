# Elementary Affine Core (EA-CORE)

An efficient calculus, similar to the λ-calculus, but based on Elementary Affine Logic, with two desirable features:

1. It is terminating without types (and in elementary time).

2. It is compatible most efficient optimal reductions (without costly book-keeping).

This, in turn, allows us to compile EAC to an efficient, non garbage-collected, parallel runtime, [EA-NET](https://github.com/moonad/elementary-affine-net). It is similar to [FM-CORE](https://github.com/moonad/formality-core.git) but without native numbers, making it easier to formalize. [Specification.](spec.md)

## Usage

Right now, this repository includes a small, dependency-free JS implementation, including parser, interpreter and optimal (NASIC) reducer. Using it from the terminal is simple:

```
npm i -g elementary-affine-calculus
eac term_name # in a directory with .eac files
```

You can also import it and use as a library.
