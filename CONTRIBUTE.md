# Contributing

Want to contribute? Here are some things we need. If
you want to work in any of these, [contact us](http://t.me/formality_lang) for
instructions!

## Funding

We're self-funded. More funds = more devs = more cool features. 

If you'd like to help with donations, grants or funding, obviously let us know (:

## Improve base

The best way to start contributing (and to get familiar with the codebase) is to
just add files to `base`. Kind's
[base](https://github.com/uwu-tech/Kind/tree/master/base) is in a constant state
of evolution. It has several functions that aren't well documented. Some
functions may have inconsistent names here and there. Some obvious functions may
be missing. Many data structures are missing. Find anything you can improve,
work on it and submit a PR. We'll be very happy to review it!

As an example, all the proofs on
[Nat/Add](https://github.com/uwu-tech/Kind/tree/master/base/Nat/add) were added
by Eloi (thanks!). That kind of contribution is always welcome!

## Improve the Numeric libraries

There are many missing numeric types on `Kind/base`, such as `I128`. The
existing types, such as `U32`, may also have missing functions here and there.
Additions are welcome!

## Implement missing Word algorithms

While Kind optimizes operations such as `I32.add` to native operations in its
back-ends, these operations still need to be implemented in pure Kind, for
theorem proving purposes. Since implementing these operations for every numeric
type would be repetitive, most of these are implemented on the `Word` type,
which represent N-bit values (for example, `I32` is a thin wrapper around
`Word<32>`, so `I32.add` just calls `Word.add<32>`). While many operations are
implemented, many are still missing. For example, all these operations are
TODOs:

```
Word.int.add
Word.int.mul
Word.int.sub
Word.int.mod
Word.int.div
Word.int.pow
Word.int.eql
Word.int.ltn
Word.int.lte
Word.int.eql
Word.int.gte
Word.int.gtn
Word.float.add
Word.float.mul
Word.float.sub
Word.float.mod
Word.float.div
Word.float.pow
Word.float.eql
Word.float.ltn
Word.float.lte
Word.float.eql
Word.float.gte
Word.float.gtn
```

Adding these would be great.

## Add another back-end

Are you a full-time JavaScript developer that doesn't like JavScript?  You can
just use Kind as your main language, compile it to JS with `kind Your.Term --js`
and import it with `require("Your.Term")`. Imagine being able to do that for
every language? Currently, Kind targets Scheme and JavaScript. We'd like more
backends, as many as possible. Adding a new back-end is somewhat simple: just
add its syntax on
[base/Kind/Comp/Target](https://github.com/uwu-tech/Kind/tree/master/base/Kind/Comp/Target)!

## Add a rich geometry library

We have some very primtive 3D vector operations, but not much else. For game
development purposes, it would be amazing to have a rich library of geometric
primitives, including matrices, quaternions, collisions, space partitioning
structures and so on. Adding these is always welcome!

## Add a WebGL renderer

Right now, the [DOM](https://github.com/uwu-tech/Kind/blob/master/base/DOM.kind)
type allows rendering text, HTML nodes and pixelated canvas. It would be amazing
to have a render mode that integrated with WebGL. If you'd like to work on that,
contact us for more instructions!

## Create apps

Sounds silly, but just creating apps using the `App` type would be amazing. Any
app added to `base/App` will show up on [http://uwu.tech/](http://uwu.tech).
Sadly, we don't have a tutorial on how apps work, but it should be learnable
from looking the examples.

## Get rid of FormCoreJS

Right now, the JavaScript compiler on
[JavaScript.kind](https://github.com/uwu-tech/Kind/tree/master/base/Kind/Comp/Target)
is lackluster, compared to the one in
[FmcToJs.js](https://github.com/moonad/FormCoreJS/blob/master/FmcToJs.js). That
is why, when compiling to JS, instead of using the compiler written in Kind, we
compile to `FormCore`, and then use `FmcToJs.js`. Because of that, the Scheme
back-end will produce much worse JS code than the Node.js back-end, among other
issues. It would be nice to improve `JavaScript.kind` to make it as efficient as
`FmcToJs.js`, allowing us to get rid of the JavaScript dependency.

## Improve the pair syntax

There are many missing syntaxes. For example, we don't have a syntax for
quadruples, triples, only pairs. We also can't destruct triples, quadruples. We
also can't destruct pairs in function arguments, in loops. For example:

```
let {x,y,z} = my_vector

List.map(({x,y}) x + y, list)

let sum = for {x,y} in positions: x + y + sum
```

None of the syntaxes above is available yet. Deep and nested pairs aren't
available either. There are many syntaxes that aren't available or could be
improved. Working on that with us is always welcome (but please, ask before!)

## Improve the usage of the get/set syntaxes

The get/set syntaxes can't be chained. For example,

```
let list = list[2] <- 100
```

sets the element of index 2 on `list` to `100`. But

```
let list = list[2][2] <- 100
```

doesn't work as expected. It must be written as:

```
let list = list[2] <- (list[2][2] <- 100)
```

The same is the case for maps (`map{"x"} <- 2`) and records (`record@x <- 2`).
Adding these syntaxes would be nice.

Moreover, the following syntax would be nice to have:

```
let list[2] <- 100
```

This would be equivalent to:

```
let list = list[2] <- 100
```

## Improve the usability of map keys

Right now, when using maps, you need to explicitly convert your keys to strings.
For example:

```
map{U256.show(1234)} <- "entry"
```

It would be nice if we either improved maps to have polymorphic keys, or
improved the parser to automatically add these conversions, in the same way that
operators (like `+`) are polymoprhic.

## Remove the need for parenthesis on forall's syntax

The "forall" syntax requires a parenthesis sometimes. For example:

```
foo: Type
  ((A: Type) -> A)
```

This shouldn't be the case and needs investigation.

## Add more generics

Right now, we can derive `serializer, deserializer, stringifier, parser` for types.
For example:

```
type MyType {
  foo
  bar
} deriving (stringifier, parser)
```

Derives `MyType.stringifier`, `MyType.parser`. It would be nice to also allow
deriving other functions such as `show, read, equal, larget_than, greater_than,
serialize, deserialize`. Most of these are trivial. For example, `show` is just
a wrapper that could use `stringifier`, and `serialize` is just a wrapped that
could use `serializer`. Regardless, these are TODOs. Adding these would be
great.

## Add implicits

One of the main sources of verbosity in Kind is the lack of implicit arguments.
That is partly improved by holes and `!`. For example, `Pair.new` can be written
as `Pair.new<Nat,Nat>(1,2)`, or `Pair.new<_,_>(1,2)`, or `Pair.new!!(1,2)`. It
would be better to write just `Pair.new(1,2)`. It is not clear how to add implicit
arguments to Kind without making some undesirable compromises, but it would be
a great improvement.

## Re-add optimal evaluators

Past versions of Kind/Formality had an option to compile programs to optimal
λ-calculus evaluators, which allowed us to explore these, using the language
syntax. Sadly, this isn't available anymore. Re-adding would be amazing. In
order to do that, the shortest path would be to port the code in [this
repository](https://github.com/MaiaVictor/abstract-algorithm) to Kind.

## Implement an EVM compiler

Implement a compiler from the low-order, linear λ-calculus to the EVM. Doing so
is completely viable and will result in efficient smart-contracts. Once we have
this, plus linear types, Kind will be able to be used as a smart-contract
language. Contact us for more instructions.

## Add linear types

Adding linear types would allow us to separate the linear from the non-linear
subset of the language. That would bring several benefits.

1. **Mutable structures.** Right now, `base/Buffer8` is considered unsafe,
   because it is optimized to use mutable buffers under the hoods, on the JS
   back-end. That means that, if you use it non-linearly, your program may
   behave incorrectly. With linear types, we could apply the optimization only
   when `Buffer8` is linear. Similarly, we could optimize arrays and maps to use
   mutable datatypes when suitable.

2. **EVM compilation.** While we have managed to reduce the cost of
   [beta-reduction](https://medium.com/@maiavictor/compiling-formality-to-the-evm-99aec75677dd)
   to miraculous 200 gas, even that is still too much for the very expensive
   environment of the Ethereum blockchain. Because of that, our best bet to
   compile to EVM, right now, is to compile the linear, low-order subset of
   Kind. That sounds lackluster, but it is actually pretty sufficient. That
   means we'd be able to write smart-contracts using Kind's syntax. As long as
   you don't do certain things (like using `List.map` or duplicating arguments),
   it will work fine, it will be inexpensive, and it will compile to efficient
   Ethereum contracts. But, for that, we need linearity.

2. **Compile to optimal λ-calculus evaluators.** We have done a lot of
   experimentation with [optimal
   λ-evaluators](https://medium.com/@maiavictor/solving-the-mystery-behind-abstract-algorithms-magical-optimizations-144225164b07)
   in the past, but isn't currently available. Adding linear types would allow
   us to compile it soundly to optimal evaluators in a sound manner.

3. **Consistency/Termination checkers.** Adding linear types will make the job
   of making a consistency checker easier. Check the section below.

Adding linearity checker to the compiler isn't a PhD-level task, but it requires
some experience with functional programming, a lot of patience and knowledge
about our type checker. Contact us if you are interested!

## Add a consistency checker

Compared to other proof languages, kind takes an inverted approach. Instead of
consistency being default and expressivity being opt-in, here, expressivity is
default and consistency is a planned opt-in. That means you're allowed to write
programs with no restrictions, just like most traditional languages like Haskell
or JavaScript, as long as they're total and well-typed. But that means programs
that do not halt, and logical paradoxes, are also expressive.

Regardless, there are several terminating, consistent subsets of Kind, each
admiting different kinds of programs. For example, with structural recursion,
we're allowed to have Agda-like proofs, but no `Type:Type`. Under elementary
affine logic, we're allowed to have `Type:Type`, but not certain forms of nested
loops. Adding checkers for different consistent subsets would be a nice feature.

For the end user, this could be presented as an icon when type-checking. For
example:

```
$ kind Nat.add

Nat.add: (n:Nat) (m:Nat) Nat ✓ ⊤

All terms check.
```

With `✓` standing for "well-typed" and `⊤` standing for "terminating".

## Research how to add HoTT features

While we have some interesting insights on the matter (check [this blog
post](https://github.com/uwu-tech/Kind/blob/master/blog/1-beyond-inductive-datatypes.md)),
Kind isn't capable of expressing the most important HoTT features. We could add
these inspired on Cubical Type Theory, but this would increase the size of
Kind's core by a few multipliers, which we don't want to. In special, the
`transp` function seems to account for most of that complexity. Investigating
how to add HoTT features without blowing up the core size is an interesting line
of research.

## Extend CONTRIBUTE.md

I'm currently adding items as I remember, so this list isn't complete right now.
If you have any improvement in mind, feel free to add here too!
