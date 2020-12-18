## Optimize Formality's type-checker

Currently, Formality's type-checker takes about 9 seconds to type-check itself
(`Fm.fm`) in a 2020 Macbook Pro 13". There are several possible optimizations.
Some ideas:

## Optimize `Fm.Term.equal` and `Fm.Term.serialize`

Find ways to make `Fm.Term.equal` faster. Also, measure how many times it is
called, and attempt to minimize it. It the heart of the type-checker and its
bottleneck, so, any time we avoid calling it is saved time. `Fm.Term.serialize`
is also called inside it, and is quite inefficient since it must convert terms
to bit-strings.

## Cache synth with hash-based imports

One way to decrease the `Fm.Term.equal` call count is to cache the type-checker.
Every time you type-check a term, Formality must re-fill all its holes (the
synth step), which takes a lot of time. If we can save the generated `FormCore`
term with all the holes filled, and retrieve it, it will greatly decrease the
amount of work needed to type-check a file. In order for that to work, we must
hash Formality terms, and use hash-addressed references (`Fm.Term.ref`).

## Use a faster Map structure

Maps are used everywhere in Formality, but they're not very fast, since they
require converting keys to `Bits`. We have a partial implementation of generic
comparison-based maps `GMap.fm`. Replacing the current `Map` by it may improve
the performance of the type-checker. In a future, we could replace it by a
linear map that performs in-place mutations, which would be even faster. We
should also create a JS-like syntax for maps (`{a:1, b:2}`). 
