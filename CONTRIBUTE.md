# Contributing

Want to contribute? Here are some things we need, but aren't currently doing. If
you want to work in any of these, contact us for instructions!

I'm currently adding items as I remember, so this list isn't complete right now.
Help me think in more things to add!

## Improve base:

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

## Create apps:

Sounds silly, but just creating apps using the `App` type would be amazing. Any
app added to `base/App` will show up on [http://uwu.tech/](http://uwu.tech).
Sadly, we don't have a tutorial on how apps work, but it should be learnable
from looking the examples.

## Add another back-end:

Are you a full-time JavaScript developer that doesn't like JavScript?  You can
just use Kind as your main language, compile it to JS with `kind Your.Term --js`
and import it with `require("Your.Term")`. Imagine being able to do that for
every language? Currently, Kind targets Scheme and JavaScript. We'd like more
backends, as many as possible. Adding a new back-end is somewhat simple: just
add its syntax on
[base/Kind/Comp/Target](https://github.com/uwu-tech/Kind/tree/master/base/Kind/Comp/Target)!

## Get rid of FormCoreJS:

Right now, the JavaScript compiler on
[JavaScript.kind](https://github.com/uwu-tech/Kind/tree/master/base/Kind/Comp/Target)
is lackluster, compared to the one in
[FmcToJs.js](https://github.com/moonad/FormCoreJS/blob/master/FmcToJs.js). That
is why, when compiling to JS, instead of using the compiler written in Kind, we
compile to `FormCore`, and then use `FmcToJs.js`. Because of that, the Scheme
back-end will produce much worse JS code than the Node.js back-end, among other
issues. It would be nice to improve `JavaScript.kind` to make it as efficient as
`FmcToJs.js`, allowing us to get rid of the JavaScript dependency.

## Improve the pair syntax:

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

## Remove the need for parenthesis on forall's syntax

The "forall" syntax requires a parenthesis sometimes. For example:

```
foo: Type
  ((A: Type) -> A)
```

This shouldn't be the case and needs investigation.

## Re-add optimal evaluators:

Past versions of Kind/Formality had an option to compile programs to optimal
λ-calculus evaluators, which allowed us to explore these, using the language
syntax. Sadly, this isn't available anymore. Re-adding would be amazing. In
order to do that, the shortest path would be to port the code in [this
repository](https://github.com/MaiaVictor/abstract-algorithm) to Kind.

## Implement an EVM compiler:

Implement a compiler from the low-order, linear λ-calculus to the EVM. Doing so
is completely viable and will result in efficient smart-contracts. Once we have
this, plus linear types, Kind will be able to be used as a smart-contract
language. Contact us for more instructions.

## Add linear types:

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

Adding linearity checker to the compiler isn't a PhD-level task, but it requires
some experience with functional programming, a lot of patience and knowledge
about our type checker. Contact us if you are interested!
