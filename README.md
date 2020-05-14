Formality-Core
==============

A lighweight proof language. [Whitepaper.](https://github.com/moonad/Formality-Core/blob/master/Whitepaper.md)

Installation
------------

Formality-Core has multiple reference implementations. Currently, the easiest to
install uses JavaScript. First, [install `npm`](https://www.npmjs.com/get-npm)
in your system. Then, on the command line, type: `npm -g formality-core`. If all
goes well, the language should be accessible via the `fm` command.

Using
-----

To use it, save a `.fm` file. For example, save the file below as `main.fm`:

```
main : <A: Type> -> A -> A
  <A> (x) x
```

And type `fm main`. This should output:

```
Type-checking main.fm:
main : <A: Type> -> A -> A

All terms check.

Evaluating `main`:
(x) x
```

You can also compile `.fm` files to JavaScript. First, run `fm` to generate a
`.fmc`. Then, run `fmcjs main`. You can also compile to Haskell with `fmchs`
main. You can run a script with `fmcio main`. In this case, `main` must have an
[IO](https://github.com/moonad/Moonad/blob/master/IO.fmc) type.

Contributing
------------

Since Formality-Core is so simple, it doesn't come with built-in functions you
would expect, and it doesn't have a standard library. But you're welcome to
clone the [`Moonad` repository](https://github.com/moonad/moonad), where we're
building several common data structures and algorithms, and contribute!
