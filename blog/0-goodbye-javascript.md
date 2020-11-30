Goodbye, JavaScript!
====================

Formality has now received its largest and most important update to date: its
entire implementation was rewritten in itself! That means its parser,
type-checker, interpreter, unifier and so on are now contained in a Formality
file, [Fm.fm](https://github.com/moonad/FormalityFM/blob/master/src/Fm.fm). That
file is then compiled to multiple back-ends, including
[JavaScript](https://github.com/moonad/FormalityFM/blob/master/bin/js/src/formality.js),
[Haskell](https://github.com/moonad/FormalityFM/blob/master/bin/hs/src/FormalityInternal.hs)
and, in a future, Scheme, Clojure and others. That means Formality programs can
run be imported inside virtually any language; and, of course, since Formality
is written itself, you can also import its type-checker as a library, anywhere.
Our reliance on JavaScript is finally over, and the jump in code quality is
unprecedented, as the whole language is formalized in a proof assistant: itself!

### Becoming a mature language

That marks the beginning of a new era for Formality: one where it stops being a
research project, towards becoming a language that is mature, stable, productive
and joyful to use. One that developers and mathematicians can use to write
types, algorithms, theorems and proofs. Compared to most alternatives,
Formality's type-checker is, by far, the fastest on the market, Formality's
compiled binaries are the most efficient, Formality's syntax is terser and more
modern. And it will only get better: since we're so confident on the quality of
our new codebase, we're able to add features, without fearing breaking old code,
or having to maintain even more JavaScript. This open doors for a flood of
future improvements that will make Formality evolve at unprecedented rates.

### Abandoning experimental ideas

Formality's vision also changed in some substantial ways. For a long time, we
focused aspects that were, at best, experimental. While that was important to
shape the language we have today, as we mature towards the goal of becoming
ready for the market, some ideas must be abandoned in favor of these that are
proven to work: that's evolution at its finest. Specifically, that means we no
longer consider minimalism or interaction nets as core aspects. The goal of
being portable is achieved by being bootstrapped and having a small core, but
the language is now meant to grow. Moreover, we now consider ourselves
computation agnostic: Formality isn't strict nor lazy, nor attached to any
particular evaluation method. Instead, we rely on multiple back-ends to evaluate
the programs we write on it.

### Formality's vision

Ultimately, Formality's vision is simple: we want it to leverage concepts of
type theory to create the ultimate programming language. One that unifies
programming and mathematics. One that is fast and minimal, but also joyful to
use, modern-looking and productive.  We want to use formal proofs and dependent
types not just as tools for security, but as a way to completely rethink the way
we write software, letting developers reach unforeseen levels of productivity
and code quality.

### A new way of writting software

(write about provit's development model)

(several concrete examples of how it'd work)


