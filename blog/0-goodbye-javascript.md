Goodbye, JavaScript!
====================

Formality has now received its largest and most important update to date: it is
now entirely implemented in itself! Its parser, type-checker, interpreter and so
on are all contained in a pure Formality file,
[Fm.fm](https://github.com/moonad/FormalityFM/blob/master/src/Fm.fm). That file
is then compiled to multiple back-ends, including
[JavaScript](https://github.com/moonad/FormalityFM/blob/master/bin/js/src/formality.js),
[Haskell](https://github.com/moonad/FormalityFM/blob/master/bin/hs/src/FormalityInternal.hs)
and, in a future, Scheme, Clojure and others. That means that:

1. Your Formality libraries can run be imported inside virtually any language.

2. Formality itself can be installed from virtually any package manager.

Our reliance on JavaScript is finally over, and the jump in code quality is
unprecedented, since the language is rewritten in a very strongly typed
language: itself! That marks the beginning of a new era for Formality, where it
moves from being a research project towards becoming a mature, stable and
productive language.

Installing Formality from `npm` or `cabal`
------------------------------------------

Usually, Formality is installed from `npm`, using `npm i -g formality-js`. This
installs a single JavaScript file
([formality.js](https://github.com/moonad/Formality/blob/master/bin/js/src/formality.js))
containing the whole language, and exposes it via the `fmjs` command. But now we
also offer a pure Haskell implementation, which can be installed as:

```
git clone https://github.com/moonad/formality
cd formality/bin/hs
cabal install
```

This will install the `fmhs` command in your machine, which is identical to
`fmjs`, except it is pure Haskell. To test it, you can `cd` into the
`formality/src` directory and type either `fmjs Main` or `fmhs Main`. Both
programs should output the same:

```
Main: IO(Unit)

All terms check.
```

That means problems like stack overflows when checking large type-level
computations won't happen. Plus, you get to use native Haskell HOAS on type
checking, which is considerably faster than JavaScript lambdas. Even better, you
can also use Formality as a lightweight library inside Haskell, allowing you to
type-check and run Formality programs inside your Haskell applications, if you
ever find a reason to do that.

Compiling Formality to Haskell
------------------------------

You can compile Formality functions directly to Haskell, and use them inside
your Haskell programs. For example, the
[`Example.fm`](https://github.com/moonad/Formality/blob/master/src/Example.fm)
file has the following definition:

```
Example.sum(n: Nat): Nat
  case n {
    zero: 0
    succ: n + Example.sum(n.pred)
  }
```

It computes the sum of all numbers from `0` to `n`. You can compile it to
Haskell as:

```
cd formality/src
fmjs Example.sum --hs --module Sum >> Sum.hs
```

You can then create a `Main.hs` file, import and use `Example.sum`:

```
import Sum

main :: IO ()
main = print (example_sum 100000000)
```

And then just compile/run as you would expect:

```
ghc Main.hs -o Main -O2
time ./Main
```

And it just works! 

```
[2 of 2] Compiling Main             ( Main.hs, Main.o )
Linking Main ...
5000000050000000

real	0m6.538s
user	0m4.897s
sys	0m1.044s
```

Since Formality compiles all its terms to λ-encodings, the entire language can
be easily embedded inside Haskell, although it does need `unsafeCoerce`. That's
because Formality's type-checker is foundamentally more expressive than Haskell,
so, some Formality programs can't be accepted by it. For example, it is
impossible to translate `foo(b: Bool): if b then Nat else String` to Haskell.
This is unavoidable and harmless (since these programs were already
type-checked), but it would still be desirable to decrease `unsafeCoerce` usage
in a future, if only to make GHC happier.

What about performance?
-----------------------

It is okay. As you can see, in the example above, the `example_sum` compiled
from Formality managed to add all `Integers` from `0` to `100m` in `6s`. If we
replaced it by one manually written:

```
example_sum :: Integer -> Integer
example_sum 0 = 0
example_sum n = n + example_sum (n - 1)

main :: IO ()
main = print (example_sum 100000000)
```

It would take exactly the same time (with `-O2`). That's because Formality
identifies λ-encoded types and compiles them to native structures, as follows:

Formality   | Haskell
----------- | -------
`Nat`       | `Integer`
`U8`        | `Word8`
`U16`       | `Word16`
`U32`       | `Word32`
`U64`       | `Word64`
`String`    | `String`
`datatypes` | `Tagged Accessors`
`functions` | `Lambdas`

By tagged accessors, I mean that, for example, a program like:

```
type FooBar {
  foo(a: String, b: String)
  bar(n: Nat, m: Nat)
}

ex0: FooBar
  FooBar.foo("hello", "world")

ex1: FooBar
  FooBar.bar(10, 20)
```

Will get compiled to something like:

```
foo = \a b -> (0, \foo bar -> foo a b)
bar = \n m -> (1, \foo bar -> bar a b)
ex0 = foo "hello" "world"
ex1 = bar 10 20
```

Notice how `foo` and `bar` constructors became tagged unions using the accessor
pattern. This is quite fast and, since this is a direct compilation (i.e., there
isn't a wrapper type nor an interpreter), it allows GHC to employ all its
optimizations to your Formality programs. Of course, speed will still not be
comparable to hand-written Haskell, but it will not be an issue in most common
uses. As we compile more Formality types to native Haskell structures, the gap
should get smaller. Benchmarks and comparisons would be sweet, so, if anyone is
wondering how to collaborate, that is a way!

Conclusion
----------

Formality is now less JavaScript and more Haskell than ever. Sorry for taking
too long for that move, I know how annoying it was for you that Formality relied
on JavaScript so much, but trust me when I say nobody was more annoyed by that
than myself. Now that Formality is written in a strongly typed language, itself,
it is finally free to grow and add more and more features, something that I was
always avoiding to do because no sane mind wants to maintain a 100k LOC proof
language written in JavaScript. Expect it to grow a lot in the near future!

Now, there is no excuse left. Visit our [formal proof
tutorial](https://github.com/moonad/Formality/blob/master/THEOREMS.md) and start
proving your own theorems, now! It is written for Haskellers, presenting theorem
proving concepts in a easy to follow format with key examples and exercises.
Also make sure to visit our [Telegram](https://t.me/formality_lang) chat room
where we answer your questions and post updates. See you there!

Annoying Disclaimers
--------------------

1. While the Formality is entirely implemented itself,i including its parser,
   type-checker, interpreter and so on, the FormalityCore->Haskell compiler, a
   [750 LOC file](https://github.com/moonad/FormCoreJS/blob/master/FmcToHs.js),
   is still JS only. That is why we had to use `fmjs` (and not `fmhs`) to
   compile Formality to Haskell. Implementing it in Formality should take a day
   or two, but I just didn't have time yet. Once I do, the `--hs` command will
   be added to `fmhs` too.

2. I'm still not decided on how a great module system for Formality should look
   like. Should I use IPFS like the language I presented on Ethereum's
   [Devcon](http://www.youtube.com/watch?v=69vkfHKyAGY&t=20m10s)? Should I do
   something more like Unison? I don't know yet, so, in order to avoid mistakes,
   Formality has no module system yet. That means that in order to use it, you
   **must** be on the `formality/src` directory, which is where all the base
   libraries (like `Nat`, `String`, `IO`) are. You can use the language without
   these, but most syntax sugars rely on them.
