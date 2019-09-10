# Elementary Affine Core (EA-CORE)

An efficient calculus, similar to the λ-calculus, but based on Elementary Affine Logic, with two desirable features:

1. It is terminating without types.

2. It is compatible with efficient optimal reductions (without costly book-keeping).

This, in turn, allows us to compile EAC to an efficient, non garbage-collected, parallel runtime, [EA-Net](./EA-Net). It is similar to [FM-Core](./FM-Core) but without native numbers, making it easier to formalize.  

[Check its specification](https://github.com/moonad/Formality-JavaScript/tree/master/src/theory/EA-Core).

## Usage

Right now, this repository includes a small, dependency-free JS implementation, including parser, interpreter and optimal (NASIC) reducer. Using it from the terminal is simple:

```
npm i -g elementary-affine-calculus
eac term_name # in a directory with .eac files
```

You can also import it and use as a library.
