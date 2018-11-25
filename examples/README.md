# Examples

This directory contains many Formality examples. Note that Formality files end with `.formality.hs` to allow Github and editors use Haskell's syntax highlighting.

### everything

Exposes all features of Formality. Includes many datatypes such as `Empty`, `Bool`, `Nat` and `Vect`, simple computations such as `double`, lazy copying, and simple proofs such as `∀ n m . n + m == m + n`.

### faster_than_ghc

Simple examples that show how we're sometimes able to make high-level Formality programs much faster than GHC by exploiting optimality and runtime fusion. Note that this is not always possible. In the worst case, Formality's "raw pattern-matching performance" is still about 20x behind GHC (but improving).
