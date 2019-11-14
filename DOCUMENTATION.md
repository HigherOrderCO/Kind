Table of contents
=================

- [Motivation](#motivation)
- [Installation](#installation)
- [Introduction](#introduction)
- [Primitives](#core-features)
    - [Let](#let)
    - [Number](#number)
    - [Pair](#pair)
    - [Lambda](#lambda)
    - [Box](#box)
    - [Self](#self)
    - [Annotation](#annotation)
    - [Hole](#hole)
    - [Log](#log)
    - [Import](#import)
- [Datatypes](#datatypes)
    - [Basics](#basics)
    - [Fields](#fields)
    - [Move](#move)
    - [Recursion](#recursion)
    - [Polymorphism](#polymorphism)
    - [Motive](#motive)
    - [Indices](#indies)
    - [Encoding](#encoding)
- [Advanced](#advanced)
    - [Stratification](#stratification)
    - [Proofs](#proofs)


Motivation
==========

> Knowing mathematics and programming might one day be one... it fills you with determination.

Formality exists to fill a hole in the current market: there aren't many
languages featuring *theorem proving* that are simple, user-friendly and
efficient. To accomplish that goal, we rely on several design philosophies:

An accessible syntax
--------------------

Proof languages often have complex syntaxes that make them needlessly
inaccessible, as if the subject wasn’t hard enough already. Coq, for example,
uses 3 different languages with different rules and an overall heavy syntax.
Agda is clean and beautiful, but relies heavily on unicode and agda-mode,
making it essentially unusable outside of EMACs, which is arguably a “hardcore”
editor. Formality aims to keep a simple, familiar syntax that is much closer to
common languages like Python and JavaScript. A regular TypeScript developer
should, for example, be able to read our
[Functor](https://github.com/moonad/Formality-Base/blob/master/Control.Functor.fm)
formalization without extensive training. While we may not be quite there,
we’re making fast progress towards that goal.

Fast and portable "by design"
-----------------------------

 Some languages are inherently slow, by design. JavaScript, for example, is
 slower than C: all things equal, its mandatory garbage collector will be an
 unavoidable disadvantage. Formality is meant to be as fast as theoretically
 possible. For example, it has affine lambdas, allowing it to be
 garbage-collection-free. It has a strongly confluent interaction-net runtime,
 allowing it to be evaluated in massively parallel architectures. It doesn’t
 require De Bruijn bookkeeping, making it the fastest “closure chunker” around. It
 is lazy, it has a clear cost model for blockchains, it has a minuscule ([448
 LOC](https://github.com/moonad/Formality/blob/master/src/fm-net.js)) runtime
 that can easily be ported to multiple platforms. Right now, Formality’s
 compiler isn’t as mature as the ones found in decades-old languages, but it
 has endless room for improvements since the language is fast “by design”.

An elegant underlying Type Theory
---------------------------------

Formality's unique approach to termination is conjectured to allow it to have
elegant, powerful type-level features that would be otherwise impossible
without causing logical inconsistencies. For example, instead of built-in
datatypes, we rely on [Self
Types](https://www.semanticscholar.org/paper/Self-Types-for-Dependently-Typed-Lambda-Encodings-Fu-Stump/652f673e13b889e0fd7adbd480c2fdf290621f66),
which allows us to implement inductive families with native lambdas. As history
tells, having elegant foundations often pays back. We've not only managed to
port several proofs from other assistants, but found techniques to [emulate
Coq's structural
recursion](https://github.com/moonad/Formality-Base/commit/b777d806c6fa37f2ce306fbe87b3ed267152b90c),
to perform large eliminations, and even a hypothetical encoding of [higher
inductive
types](https://github.com/moonad/Formality-Base/blob/master/Example.HigherInductiveType.fm);
and we've barely begun exploring the system.

An optimal high-order evaluator
-------------------------------

Formality's substitution algorithm is **asymptotically faster** than Haskell's,
Clojure's, JavaScript's and other closure implementations. This makes it
extremely fast at evaluating high-order programs, combining a Haskell-like
high-level feel with a Rust-like low-level performance curve. For example,
Haskell's stream fusion, a hard-coded, important optimization, happens
naturally, [at
runtime](https://medium.com/@maiavictor/solving-the-mystery-behind-abstract-algorithms-magical-optimizations-144225164b07),
on Formality. This also allows us to explore new ways to develop algorithms,
such as this "impossibly efficient" [exp-mod
implementation](https://medium.com/@maiavictor/calling-a-function-a-googol-times-53933c072e3a).
Who knows if this may lead to new breakthroughs in complexity theory?

![](https://github.com/moonad/formality/raw/master/archive/images/inet-simulation.gif)

Installation
============

Right now, Formality can only be installed through npm. Install npm following
[this guide](https://www.npmjs.com/get-npm). Then, go to the command-line and
type:

```
$ npm i -g formality-lang
```

Using [`node2nix`](https://github.com/svanderburg/node2nix#installation), we
can also install Formality using the Nix package manager:

```
$ git clone git@github.com:moonad/Formality.git
$ cd Formality
$ nix-channel --add https://nixos.org/channels/nixpkgs-unstable unstable
$ nix-env -f '<unstable>' -iA nodePackages.node2nix
$ node2nix --nodejs-12
$ sed -i 's/nixpkgs/unstable/g' default.nix
$ nix-env -f default.nix -iA package
```

This should be all you need. In order to test if it worked, type `fm` on the
terminal. If you see Formality's command-line options, then it has been
successfully installed in your system. If you have any problem during this
process, please [open an issue](https://github.com/moonad/Formality/issues).


Introduction
============

This is the "Hello, World!" in Formality:

```haskell
import Base@0

main : Output
  print("Hello, world!")
```

A Formality file is just a list of imports followed by a series of top-level
definitions. Here, we have one top-level definition, `main`, with type
`Output`, and body `print("Hello, world")`. Save this file as `hello.fm`.

To run it, type `fm hello/main`. This will evaluate `main` using an interpreter
in debug mode and output `"Hello, world!"`. You can also use `fm -o hello/main`
to evaluate it with the interaction-net runtime. This will be faster, but
you'll lose information like variable names and logs.

To type-check it, type `fm -t hello/main`. This will check if the program's
type is correct and print `Output ✔`. If the type is incorrect, it will print
an error message instead. For example, if you change `"Hello, world!"` to `7`,
it will print:

```haskell
Type mismatch.
- Found type... Number
- Instead of... String
- When checking 7
- On line 4, col 9, file hello.fm:
  1| import Base@0
  2|
  3| main : Output
  4|   print(7)
  5|
```

Because `7` is a `Number`, but the `print` function expects a `String`. Since
Formality is a proof language, types can be seen as theorems and well-typed
terms can be seen a proof. So, for example, this is a proof that `2 == 2`:

```haskell
import Base@0

two_is_two : Equal(Number, 2, 2)
  refl(~Number, ~2)
```

Running it with `fm -t file/two_is_two` will output `Equal(Number, 2, 2) ✔`,
which means Formality is convinced that two is equal to two. Of course, that is
obvious, but it could be something much more important such as
`OnlyOwnerCanWithdrawal(owner, contract) ✔`. How proofs can be used to make
your programs safer will be explored later. Let's now go through all of
Formality's primitives. Don't worry: since it is designed to be a very simple
language, there aren't many!

Primitives
==========

Let
---

Allows you to give local names to terms.

```haskell
import Base@0

main : Output
  let hello = "Hello, world!"
  print(hello)
```

`let` expressions can be infinitely nested.

```haskell
import Base@0

main : Output
  let output =
    let hello = "Hello, world!"
    print(hello)
  output
```

`let` has no computational effect, it simply performs a parse-time substitution.

Number
------

A native number, encoded as a 64-bit value. It can be written in decimal, hexadecimal or binary:

```haskell
number_0 : Number
  1900

number_1 : Number
  0x76C

number_2 : Number
  0b11101101100

number_3 : Number
  12.3456

```

The numeric operations are:

name | syntax | javascript equivalent
--- | --- | ---
addition | `x .+. y` | `x + y`
subtraction | `x .-. y` | `x - y`
multiplication | `x .*. y` | `x * y`
division | `x ./. y` | `x / y`
modulus | `x .%. y` | `x % y`
exponentiation | `x .**. y` | `x ** y`
bitwise-and | `x .&. y` | `x & y`
bitwise-or | `x .|. y` | `x | y`
bitwise-xor | `x .^. y` | `x ^ y`
bitwise-not | `.~.(y)` | `~y`
bitwise-right-shift | `x .>>>. y` | `x >>> y`
bitwise-left-shift | `x .<<. y` | `x << y`
greater-than | `x .>. y` | `x > y ? 1 : 0`
less-than | `x .<. y` | `x < y ? 1 : 0`
equals | `x .==. y` | `x === y ? 1 : 0`

There is no operator precedence: parenthesis are always placed on the right.
That means `3 .*. 10 .+. 1` is parsed as `3 .*. (10 .+. 1)`. If you want the
multiplication to occur first, you must be explicit:

```haskell
main : Number
  (3 .*. 10) .+. 1
```

There is also `if`, which allows branching with a `Number` condition.

syntax | description
--- | ---
`if n: a else: b` | If `n .==. 0`, evaluates to `b`, else, evaluates to `a`

Usage is straightforward:

```haskell
import Base@0

main : Output
  let age = 30

  if age .<. 18:
    print("Boring teenager.")
  else:
    print("Respect your elders!")
```

Pair
----

Native pairs store two elements of possibly different types.

syntax | description
--- | ---
`[x : A, B(x)]` | The type of a pair
`[a, b]` | Creates a pair with elements `a` and `b`
`fst(p)` | Extracts the first element of a pair
`snd(p)` | Extracts the second element of a pair
`get [a, b] = p ...` | Extracts both elements of a pair

Creating:

```haskell
main : [:Number, Number]
  [1, 2]
```

Extracting the first element:

```haskell
main : Number
  let pair = [1, 2]
  fst(pair)
```

Extracting both elements:

```haskell
main : Number
  let pair  = [1, 2]
  get [a,b] = pair
  a .+. b
```

Nesting to the left:

```haskell
import Base@0

main : [:[:Number, Number], String]
  [[1, 2], "Hello World!"]
```

Nesting to the right:

```javascript
main : Number
  let triple  = [1, 2, 3] // same as [1, [2, 3]]
  get [x,y,z] = triple
  x .+. y .+. z
```
Erased (first element):

```javascript
main : [~: Number, Number]
  [~1, 2] // the number "1" is erased from runtime
```

Erased (second element):

```javascript
main : [: Number ~ Number]
  [1 ~ 2] // the number "2" is erased from runtime
```

Note that the first element of a pair can be named, allowing the type of the
second element can depend on the value of the first. Example: 

```javascript
main : [x : Number, (if x: Number else: Bool)]
  [0, true] // if you change 0 to 1, the second element must be a Number.
```

Lambda
------

syntax | description
--- | ---
`{x : A, y : B, z : C, ...} -> D` | Function type with args `x : A`, `y : B`, `z : C`, returning `D`
`{x, y, z, ...} body` | A function that receives the arguments `x`, `y`, `z` and returns `body`
`f(x, y, z, ...)` | Applies the function `f` to the arguments `x`, `y`, `z` (curried)

Formality functions are curried anonymous expressions, like Haskell's lambdas.
There are no multi-argument lambdas. `(x, y, z, ...) => body` is the same as
`(x) => (y) => (z) => ... body`, which works like JS's `x => y => z => ...
body` and Haskell's `\ x y z ... -> body`.

Function calls use `f(x, y, z)` syntax, which is the same as `f(x)(y)(z)...`.
The type of a function is written as `A -> B -> C -> D`, like on Haskell, but
it can also be written with names, as `(x : A, y : B, z : C ...) -> D`.

You can define a top-level function as below:

```haskell
adder : Number -> Number -> Number
  (x, y) => x .+. y

main : Number
  adder(40, 2)
```

You can also include the variable names before the `:`:

```haskell
adder(x : Number, y : Number) : Number
  x .+. y

main : Number
  adder(40, 2)
```

Functions can be inlined:

```haskell
call(f : Number -> Number, x : Number) : Number
  f(x)

main : Number
  call((x) => x .+. 1, 0)
```

If Formality can't infer the type of `x`, you can add it after the name:

```haskell
main : Number
  ((x : Number) => x .+. 1)(0)
```

Or after the function, with an explicit annotation (`::`):

```haskell
main : Number
  (((x) => x .+. 1) :: Number -> Number)(0)
```

Types are optional. This won't type-check, but you can still run it:

```haskell
main
  ((x, y) => x .+. y)(40, 2)
```

Lambdas and applications can be erased with a `~`, which causes them to vanish
from the compiled output. This is useful, for example, to write polymorphic
functions without extra runtime costs. For example, on the code below, `foo` is
compiled to `(x) => x`, and `main` is compiled to `foo(42)`. The first argument
disappears from the runtime.

```haskell
foo(~T : Type, x : T) : T
  x

main : Number
  foo(~Number, 42)
```


Formality functions are **affine**, which means you can't use a variable more
than once. For example, the program below isn't allowed, because `x` is used
twice:

```haskell
import Base@0

foo(x : Bool) : Bool
  or(x, x)

main : Bool
  foo(true)
```

Multiple ways to circumvent this limitation will be explained through this
documentation.

Box
---

Formality includes primives for performing explicit, deep copies of terms, as long as they're "boxed".

syntax | description
--- | ---
`#t` | Puts term `t` inside a box
`!T` | The type of a boxed term
`dup x = t; u` | Unboxes `t` and copies it as `x` inside `u`
`$t` | Unboxes `t`

To keep Formality compatible with our fast functional runtime, boxes are
limited by the "stratification condition". It enforces that the number of `#`s
surrounding a term must never change during reduction. As such, boxes aren't
very useful for copying data, but are useful to implement user-defined control
structures like bounded loops and recursion. This all will be explained in more
details later on.

Self
----

Formality also has [Self
Types](http://homepage.divms.uiowa.edu/~astump/papers/fu-stump-rta-tlca-14.pdf),
which allow us to implement inductive datatypes with λ-encodings:

syntax | description
--- | ---
`${self} T(self)` | `T` is a type that can access its own value
`new(~T) t` | Constructs an instance of a `T` with value `t`
`(%t)` | Consumes a self-type `t`, giving its type access to its value

Self Types allow a type to access *its own value*. For example, suppose that
you wanted to create a pair of identical numbers. It could be done as:

```haskell
SameNumbers : Type
  ${self}
  [ x : Number
  , y : Number
  , Equal(Number, fst(use(self)), fst(snd(use(self))))]

same_numbers_0 : SameNumbers 
  new(~SameNumbers) [0, 0, refl(~Number, ~0)]
```

Here, on the `SameNums` type, we have access to `self`, which is the pair being
typed. So, whenever you instantiate it, you must provide a proof that its first
and second elements are equal. Of course, in this case, this effect could be
achieved with dependent pairs, but what is interesting is that it allows us to
do us to encode inductive datatypes with lambdas, as will be explained later.

Annotation
----------

You can also explicitly annotate the type of a term:

syntax | description
--- | ---
`term :: Type` | Annotates `term` with type `Type`

This is useful when the type-checker can't infer the type of an expression.

```haskell
main : Number
  (((x, y) => x .+. y) :: Number -> Number -> Number)(40, 2)
```

It is also important for dependent pairs:

```haskell
dependent_pair
   [1, 2] :: [x : Number, if x: Number else: Bool]
```

This gives the `[1, 2]` pair the type `[x : Number, if x: Number else: Bool]`,
which is more refined than the `[: Number, Number]` type that would be inferred
otherwise.

Nontermination
--------------

Formality has first-class nontermination, which disables the termination
checker in delimited sections of your programs.

syntax | description
------ | ---------------------------------------
-A     | `A` is a nonterminating term of type `A`
%t     | Converts `t` to an nonterminating term
+t     | Converts `t` to a terminating term

Nonterminating terms can have unrestricted recursion, as well as ignore the
limitations imposed by affine lambdas and stratified duplications. So, for
example, while the `List(Number)` type represents a finite list of words, the
`-List(Number)` type can be infinite:

```javascript
ones : -List(Number)
  cons(~Number, 1, ones)
```

Note that nonterminating terms can't be compiled to interaction nets, and can't
be interpreted as mathematical proofs. That's because nontermination can be
used to create paradoxes, allowing you to inhabit a type with a loop:

```haskell
  main : -Empty
    main
```

A powerful aspect of Formality is that you can still prove theorems about
nonterminating programs, as long as the proofs themselves are terminating. This
idea was first explored in ["A dependently typed language with
nontermination"](https://www.cis.upenn.edu/~sweirich/papers/sjoberg-thesis.pdf).
Nonterminating terms are also very useful when you have a function argument
that will only be used inside a type such as the `Nat` index of a Vector, and
they also play an important role in the implementation of inductive datatypes
with self-types.

Hole
----

Formality also features holes, which are very useful for development and
debugging. A hole can be used to fill a part of your program that you don't
want to implement yet. It can be written anywhere as `?name`, with the name
being optional. If you give it a name, it will cause Formality to print the
type expected on the hole location, its context (scope variables), and possibly
a value, if Formality can fill it for you. For example, the program below:

```haskell
import Base@0

main(x : Bool) : Bool
  or(true, ?a)
```

Will output:

```haskell
Found hole: 'a'.
- With goal... Bool
- With context:
- x : Bool

(x : Bool) -> Bool ✔
```

This tells you that, on the location of the hole, you should have a `Bool`.
Note that this is only automatic if Formality can infer the expected type of
the hole's location. Otherwise, you must give it an explicit annotation, as in
`?hole :: MyType`.

## Log

Another handy feature is `log(x)`. When running a program, it will print the
normal form of `x`, similarly to haskell's `console.log` and haskell's `print`,
but for anything (not only strings). When type-checking a program, it tells you
the normal-form and the type of `x`. This is useful when you want to know what
type an expression would have inside certain context. For example:

```haskell
import Base@0

main(f : Bool -> Nat) : Nat
  log(f(true))
  ?a
```

Type-checking the program above will cause Formality to output:

```haskell
[LOG]
Term: f(true)
Type: Nat

Found hole: 'a'.
- With goal... Nat
- With context:
- f : (:Bool) -> Nat
```

This tells you that, inside the body of `main`, the type of `f(true)` is `Nat`.
Since it coincides with the goal, you can complete the program above with it:

```haskell
import Base@0

main : {f : Bool -> Nat} -> Nat
  f(true)
```

Compile-time logs are extremelly useful for development. We highly recommend
you to use them as much as possible!

Import
------

The `import` statement can be used to include local files. For example, save an
`Answers.fm` file in the same directory as `hello.fm`, with the following
contents:

```haskell
import Base@0

everything : String
  "42"
```

Then save a `test.fm` file as:

```haskell
import Base@0
import Answers

main : Output
  print(everything)
```

And run it with `fm test/main`. You should see `42`.

If multiple imports have conflicting names, you can disambiguate with
`File/name`, or with a qualified import, using `as`:


```haskell
import Base@0
import Answers as A

main : Output
  print(A/everything)
```

Formality also has a file-based package manager. You can use it to share files
with other people. A file can be saved globally with `fm -s file`. This will
give it a unique name with a version, such as `file@7`. Once given a unique
name, the file contents will never change, so `file@7` will always refer to
that exact file. As soon as it is saved globally, you can import it from any
other computer. For example, remove `Answers.fm` and change `hello.fm` to:

```haskell
import Base@0
import Answers@0

main : Output
  print(everything)
```

This will load `Answers@0.fm` inside the `fm_modules` directory and load it.
Any import ending with `@N` refers to a unique, immutable, permanent global
file. That prevents the infamous "dependency hell", and is useful for many
applications.

Right now, global imports are uploaded to our servers, but, in the future,
they'll upload files to decentralized storage such as IPFS/Swarm, and give it a
unique name using Ethereum's naming system.

Datatypes
=========

Formality includes a powerful datatype system. A new datatype can be defined
with the `T` syntax, which is similar to Haskell's `data`. It creates global
definitions for the type and its constructors. To pattern-match against a value
of a datatype, you must use a `case` expression.

Basics
------

Datatypes can be defined and used as follows:

```haskell
import Base@0

T Suit
| clubs
| diamonds
| hearts
| spades

print_suit(suit : Suit) : Output
  case suit
  | clubs    => print("First rule: you do not talk about Fight Club.")
  | diamonds => print("Queen shines more than diamond.")
  | hearts   => print("You always had mine.")
  | spades   => print("The only card I need is the Ace of Spades! \m/")
  : Output

main : Output
  print_suit(spades)
```

The program above creates a datatype, `Suit`, with 4 possible values. In
Formality, we call those values **constructors**. It then pattern-matches a
suit and outputs a different sentence depending on it. Notice that the `case`
expression requires you to annotate the returned type: that's called the
**motive**, and is very useful when theorem proving.

Fields
------

Datatype constructors can have fields, allowing them to store values:

```haskell
import Base@0

T Person
| person(age : Number, name : String)

get_name(p : Person) : String
  case p
  | person => p.name
  : String

main : Output
  let john = person(26, "John")
  print(get_name(john))
```

As you can see, fields can be accessed inside `case` expressions. Notice that
`p.name` is not a field accessor, but just a single variable: the `.` is part
of its name. When Formality doesn't know the name of the matched value, you
must must explicitly name it using the `as` keyword:

```haskell
main(p : Person) : Number
  case person(26, "John") as john
  | person => john.age
  : Number
```

Move
----

Since Formality functions are affine, you can't use an argument more than once.
So, for example, the function below isn't allowed:

```haskell
import Base@0

main(a : Bool, b : Bool) : Bool
  case a
  | true  => b
  | false => not(b)
  : Bool
```

But, since we used `b` in two different branches, we don't need to copy it:
we can instead tell Formality to move it to each branch with a `+`:

```haskell
import Base@0

main(a : Bool, b : Bool) : Bool
  case a
  + b : Bool
  | true  => b
  | false => not(b)
  : Bool
```

Under the hoods, this just adds an extra lambda on each branch:

```haskell
import Base@0

main(a : Bool, b : Bool) : Bool
  (case a
  | true  => (b) => b
  | false => (b) => not(b)
  : Bool -> Bool)(b)
```

Recursion
---------

Fields can refer to the datatype being defined:

```haskell
T Nat
| zero
| succ(pred : Nat)
```

This creates a recursive datatype. Since `Nat` is so common, there is a
syntax-sugar for it, `3n`, which expands to `succ(succ(succ(zero)))`.

Mutual recursion is allowed:

```haskell
T Foo
| foo(bar : Foo)

T Bar
| bar(foo : Bar)
```

Recursive functions can be written as usual:

```haskell
mul2(n : Nat) : Nat
  case n
  | zero => zero
  | succ => succ(succ(mul2(n.pred)))
  : Nat
```

With one caveat: recursive occurrences must be applied to structurally smaller
values, in order to prevent nontermination. Right now, though, while
Formality's termination checker can prevent loops such as `λx.(x x) λx.(x x)`
from being constructed (for example, through Russel's paradox), it still
can't prevent loops from recursive calls. This feature is to be developed
soon. Until then, type-checking recursive functions will raise a warning,
signaling that Formality is unsure if your program halts. If you can't wait,
you can use inductive datatypes such as `INat` from Base instead.

Note: while you can use recursive calls as much as you want, it is wise to
treat them as normal variables and use `move` to pass them to branches. This
can be a major optimization in some cases.

Polymorphism
------------

Polymorphism allows us to create multiple instances of the same datatype with
different contained types.

```haskell
import Base@0

T Pair<A, B>
| pair(x : A, y : B)

main : Number
  let a = pair(~Bool, ~Number, true, 7)

  case a
  | pair => a.y
  : Number
```

The `<A, B>` syntax after the datatype declares two polymorphic Type variables,
`A` and `B`, allowing us to create pairs with different contained types without
having to write multiple `Pair` definitions. 

Each polymorphic variable adds an implicit, erased argument to each
constructor, so, instead of `pair(true, 7)`, you need to write `pair(~Bool,
~Number, true, 7)`. In the future, this verbosity will be prevented with implicit
arguments.

One of the most popular polymorphic types is the linked `List`:

```haskell
T List<A>
| nil
| cons(head : A, tail : List(A))

main : List(Number)
  cons(~Number, 1,
  cons(~Number, 2,
  cons(~Number, 3,
    nil(~Number))))
```

Since it is so popular, there is a built-in syntax-sugar for it:

```haskell
main : List(Number)
  <Number>[1, 2, 3]
```

Indices
-------

Indices are like polymorphic variables, except that, rather than constant
types, they are **computed values** that can depend on each constructor's
arguments. That gives us a lot of type-level power and is one of the reasons
Formality is a great proof language. For example:

```haskell
T IsEven (x : Number)
| make_even(half : Number) : IsEven(half .*. 2)
```

This datatype has one index, `x`, of type `Number`. Its constructor, `is_even`,
has one field, `half : Number`. When you write `make_even(3)`, the number `3`
is multiplied by two and moved to the type-level, resulting in a value of type
`IsEven(6)`. This makes it impossible to create a value of type `IsEven(5)`,
because you'd need a `x` such that `x .*. 2` is `5`, but that's impossible.
To visualize this, see the code below:

```haskell
even_0 : IsEven(0)
  make_even(0)

even_2 : IsEven(2)
  make_even(1)

even_4 : IsEven(4)
  make_even(2)

even_6 : IsEven(6)
  make_even(3)
```

This allows us, for example, to create a `div2` function that can only receive
even values:

```haskell
div2(x : Number, ~x_is_even : IsEven(x)) : Number
  x ./. 2

main : Number
  div2(10, ~make_even(5))
```

You can't call `div2` on odd values because you can't construct an `IsEven` for them.

Another example is the Vector, which is a `List` with a statically known length:

```haskell
T Vector<A> (len : -Nat)
| vnil                                                : Vector(A, zero)
| vcons(~len : -Nat, head : A, tail : Vector(A, len)) : Vector(A, succ(len))
```

Every time you add an element to a Vector, the length on its type increases:

```haskell
main : Vector(String, 3n)
   vcons(~String, ~2n, "ichi",
   vcons(~String, ~1n, "ni",
   vcons(~String, ~0n, "san",
   vnil(~String))))
```

This has many applications such as creating a type-safe `vhead` function that
can't be called on non-empty vectors.

As the last example, this defines a list with all elements being true:

```haskell
import Base@0

T AllTrue (xs : List(Bool))
| at_nil                                      : AllTrue(nil(~Bool))
| al_cons (xs : List(Bool), tt : AllTrue(xs)) : AllTrue(cons(~Bool, true, xs))
```

It says that the empty list is a list of trues (`at_nil`) and that appending
true to a list of trues is still a list of trues (`at_cons`). You can make all
sorts of specifications using indexed datatypes, making them extremely
powerful.

Motive
------

In Formality, the type returned by a case expression can depend on the matched
value by using it on the motive. For example:

```haskell
import Base@0

CaseType(x : Bool) : Type
  case x
  | true  => Number
  | false => String
  : Type

main : Number
  case true as x
  | true  => 42
  | false => "hello"
  : CaseType(x)
```

The way this works is that, in order to check if a `case` expression is
well-typed, Formality first specializes the return type for the specific value
of each branch. For example, on the `true` case, `CaseType(true)` returns
`Number`, so we can write `42`. On the `false` case, `CaseType(false)` returns
`String`, so we can write `"hello"`. Finally, the whole expression returns
`CaseType(x)`, which, in this case, is `Number`, because `x` is `true`.

In other words, this means that, if we prove a theorem for every specific
possible value of `x`, then this theorem holds for `x` itself. This mechanism
is the heart of theorem proving, and understanding it well is essential to
develop mathematical proofs in Formality. Let's go through some examples.

#### Example: proving equalities

Formality's base libraries include a type for equality proofs called `Equal`.
For example, `Equal(Num, 2, 2)` is the statement that `2` is equal `2`. It is
not a proof: you can write `Equal(Num, 2, 3)`, which is the statement that `2`
is equal to `3`.  To prove an equality, you can use `refl(~A, ~x)`, which, for
any `x : A`, proves `Equal(A, x, x)`. In other words, `refl` is a proof that
every value is equal to itself. As such, we can prove that `true` is equal to
`true` like this:

```haskell
true_is_true : Equal(Bool, true, true)
  refl(~Bool, ~true)
```

Now, suppose you want to prove that, for any boolean `b`, `not(not(b))` is
equal to `b`. This can be stated as such:

```haskell
import Base@0

not_not_is_same(b : Bool) : Equal(Bool, not(not(b)), b)
  ?a
```

But here you can't use `refl(~Bool, ~b)`, because it'd be `Equal(Bool, b, b)`
instead of `Equal(Bool, not(not(b)), b)`. The problem is that the function call
is stuck on a variable, `b`, causing both sides to be different. That's when
dependent motives help: if you pattern-match on `b`, Formality will specialize
the equation for both specific values of `b`, that is, `true` and `false`:

```haskell
import Base@0

not_not_is_same(b : Bool) : Equal(Bool, not(not(b)), b)
  case b
  | true  => ?a
  | false => ?b
  : Equal(Bool, not(not(b)), b)
```

So, on the `true` case, it asks you to prove `Equal(Bool, not(not(true)),
true)`, because `b` was specialized to true on that branch. Since
`not(not(true))` reduces to `true`, you only need to prove `Equal(Bool, true,
true)`, which can be done with `refl`. The same holds for the `false` case.
Once you prove the theorem for both possible cases of `b`, then Formality
returns the motive generalized for `b` itself:

```haskell
import Base@0

not_not_is_same(b : Bool) : Equal(Bool, not(not(b)), b)
  case b
  | true  => refl(~Bool, ~true)
  | false => refl(~Bool, ~false)
  : Equal(Bool, not(not(b)), b)
```

This proof wouldn't be possible without using `b` on the motive.

#### Example: proving absurds

Another interesting example comes from the `Empty` datatype:

```haskell
T Empty
```

This code isn't incomplete, the datatype has zero constructors. This means it
is impossible to construct a term `t` with type `Empty`, but we can still
accept it as a function argument. So, what happens if we pattern match against
it?

```haskell
import Base@0

wtf(e : Empty) : ?
  case e : ?
```

Simple: we can replace `?` with anything, and the program will check. That's
because, technically, we proved all the cases, so the case expression just
returns the motive directly, allowing us to write anything on it! That can be
used to derive any theorem given a value of type Empty:

```haskell
import Base@0

one_is_two(e : Empty) : Equal(Number, 1, 2)
  case e : Equal(Number, 1, 2)
```

In other words, if we managed to call `one_is_two`, we'd have a proof that `1`
is equal to `2`. Of course, we can't call it, because there is no way to
construct a value of type `Empty`. Interestingly, the opposite holds too: given
a proof that `1` is equal to `2`, we can make an element of type `Empty`. Can
you prove this?

#### Example: avoiding unreachable branches

Notice the program below:

```haskell
import Base@0

main : Number
  case true
  | true  => 10
  | false => ?
  : Number
```

Here, we're matching against `true`, so we know the `false` case is
unreachable, but we still need to fill it with some number. With motives, we
can avoid that. The idea is that we will send, to each branch, a proof that
`Equal(Bool, x, true)`. On the `true` branch, it will be specialized to
`Equal(Bool, true, true)`, which is useless... but, on the `false` branch, it
will be specialized to `Equal(Bool, false, true)`. Since this is wrong, we can
use it to derive `Empty`. Once we have `Empty`, we can fill the branch with
`absurd`, a function from the Base library with allows us to prove any type if
we have `Empty`.

```haskell
import Base@0

main : Number
  case true as x
  + refl(~Bool, ~true) as e : Equal(Bool, x, true)
  | true  => 10
  | false => absurd(false_isnt_true(e), ~Number)
  : Number
```

(Remember that `+` is a shorthand for adding an extra variable to the motive.)

Of course, in this example we could just have written any number, but, in some
cases, such as on the `nil` branch of a `head` function, we simply don't have
a value to insert. In those cases, finding a way to construct `Empty` on that
branch is equivalent to saying it is unreachable. As such, `absurd` can be used
to "skip" it.

Encoding
--------

Interestingly, none of the features above are part of Formality's type theory.
Instead, they are lightweight syntax-sugars that elaborate to plain-old
lambdas. To be specific, a datatype is encoded as is own inductive hypothesis,
with "Self Types". For example, the `Bool` datatype desugars to:

```haskell
Bool : Type
  ${self}
  ( ~P    : {x : Bool} -> Type
  , true  : P(true)
  , false : P(false)
  ) -> P(self)

true : Bool
  new(~Bool) (~P, true, false) => true

false : Bool
  new(~Bool) (~P, true, false) => false

case_of(b : Bool, ~P : Bool -> Type, t : P(true), f : P(false)) : P(b)
  (use(b))(~P, t, f)
```

Here, `${self} ...`, `new(~T) val` and `use(b)` are the type, introduction, and
elimination of Self Types, respectively. You can see how any datatype is
encoded under the hoods by asking `fm` to evaluate its type, as in, `fm
Data.Bool@0/Bool -W` (inside the `fm_modules` directory). The `-W` flag asks
Formality to not evaluate fully since `Bool` is recursive. While you probably
won't need to deal with self-encodings yourself, knowing how they work is
valuable, since it allows you to express types not covered by the built-in
syntax.

Advanced
========

Stratification
--------------

Formality's lambdas are affine. This makes it a very efficient functional
language, compatible with optimal sharing, parallel evaluators and so on. But
this limits is power. To enable controlled duplication, Formality introduces
boxes and `dup`, which performs a deep copy of a value, as long as you respect
the stratification condition.

#### The Stratification Condition

Without restriction, `dup` would allow for nontermination. For example, this:

```haskell
main
  let f = (x) =>
    dup x = x
    x(#x)
  f(#f)
```

Would loop forever, which should never happen in a terminating language. To
prevent it, Formality enforces the following invariant:

> The level of a term can never change during the program evaluation.

Where the level of a term is the number of boxes "wrapping" it. Here are a few
examples:

```haskell
["a", #"b", "c", #["d", #"e"], ##"f"]
```

- The string `"a"` isn't wrapped by any box. It is on `level 0`.

- The string `"b"` is wrapped by one box. It is on `level 1`.

- The string `"c"` isn't wrapped by any box. It is on `level 0`.

- The string `"d"` is wrapped by one box. It is on `level 1`.

- The string `"e"` is wrapped by two boxes (one indirect). It is on `level 2`. 

- The string `"f"` is wrapped by two boxes. It is on `level 2`. 

The type of the program above is:

```haskell
[:String, :!String, :String, :![:String, !String], !!String]
```

#### Examples

Stratification is imposed globally, forbidding certain programs. For example:

```haskell
box(x : Word) : !Word 
  # x
```

This isn't allowed because, otherwise, we would be able to increase the level
of a word. Similarly, this:

```haskell
main : [:Word, Word]
  dup x = #42
  [x, x]
```

Isn't allowed too, because `42` would jump from `level 1` to `level 0` during
runtime. But this:

```haskell
main : ![:Word, Word]
  dup x = #42
  # [x, x]
```

Is fine, because `42` remains on `level 1` after being copied. And this:

```haskell
main : [:!Word, !Word]
  dup x = #42
  [#x, #x]
```

Is fine too, for the same reason.

Note that, while stratification prevents non-terminating terms arising from the
use of `dup`, it doesn't prevent non-terminating recursive calls. Well-founded
recursion is still a work in progress, and recursive programes raise a warning.

Proofs
======

Types in Formality can be used to express mathematical theorems. This allows us
to statically prove invariants about our programs, making them unflawless. In a
way, proofs can be seen as a generalization of tests. With tests, we can assert
that specific expressions have the values we expect. For example, consider the
program below:

```javascript
// Recursively doubles a number
function mul2(n) {
  if (n <= 0) {
    return 0;
  } else {
    return 2 + mul2(n - 1.01);
  }
}

// Tests
it("Works for 10", () => {
  console.assert(mul2(10) === 20);
})


it("Works for 44", () => {
  console.assert(mul2(44) === 88);
});

it("Works for 17", () => {
  console.assert(mul2(17) === 34);
});

it("Works for 12", () => {
  console.assert(mul2(12) === 24);
});

it("Works for 20", () => {
  console.assert(mul2(20) === 40);
});
```

It allows us to test our implementatio of `mul2` by checking if the invariant
that `n * 2` is equal to `n + n` holds for specific values of `n`. The problem
with this approach is that it only gives us partial confidence. No matter how
many tests we write, there could be still some input which causes our function
to misbehave. In this example, `mul2(200)` returns `398`, which is different
from `200 + 200`. The the implementation is incorrect, despite all tests
passing!


With formal proofs, we can write tests too:

```haskell
import Base@0

mul2(n : Number) : Number
  if n .<. 0 .|. n .==. 0:
    0
  else:
    2 .+. mul2(n .-. 1.01)

it_works_for_10 : Equal(Number, mul2(10), 20)
  refl(~Number, ~20)

it_works_for_44 : Equal(Number, mul2(44), 88)
  refl(~Number, ~88)

it_works_for_17 : Equal(Number, mul2(17), 34)
  refl(~Number, ~34)

it_works_for_12 : Equal(Number, mul2(12), 24)
  refl(~Number, ~24)

it_works_for_20 : Equal(Number, mul2(20), 40)
  refl(~Number, ~40)
```

Here, we're using `Equal` to make assert that `mul2(10)` is equal to `20` and
so on. Since those are true by reduction, we can complete the proofs with
`refl`. This essentially implements a type-level test suite. But with proofs,
we can go further: we can prove that a general property holds for every
possible input, not just a few. To explain, let's first re-implement `mul2` for
`Nat`, which allows us to write a `case` with a `motive`, an essential proof
technique:

```haskell
import Base@0

mul2(n : Nat) : Nat
  case n
  | zero => zero
  | succ => succ(succ(mul2(n.pred)))
  : Nat
```

Let's start by adding a few tests just to be sure:

```haskell
it_works_for_0 : Equal(Nat, mul2(0n), 0n)
  refl(~Nat, ~0n)

it_works_for_1 : Equal(Nat, mul2(1n), 2n)
  refl(~Nat, ~2n)

it_works_for_2 : Equal(Nat, mul2(2n), 4n)
  refl(~Nat, ~4n)
```

Since those pass, we can now try to prove the more general statement that the
double of any `n` is equal to `x .+. x`. We start by writing the type of our
invariant:

```haskell
it_works_for_add(n : Nat) : Equal(Nat, mul2(n), add(n, n))
  ?a
```

As you can see, this is just like a test, except that it includes a variable,
`n`, which can be any `Nat`. As such, it will only "pass" if we manage to
convince Formality that `Equal(Nat, mul2(n), add(n, n))` holds for every `n`,
not just a few. To do it, we can start by type-checking the program above and
seeing what Formality has to say:

```haskell
Found hole: 'a'.
- With goal... Equal(Nat, mul2(n), add(n, n))
- With context:
- n : Nat

(n : Nat) -> Equal(Nat, mul2(n), add(n, n)) ✔
```

This is telling us that our theorem is correct as long as we can replace the
hole `?a` with a proof that `Equal(Nat, mul2(n), add(n, n))`. In other words,
Formality is asking us to to prove what we claimed to be true. Let's try to do
it with a `refl`:

```haskell
it_works_for_add(n : Nat) : Equal(Nat, mul2(n), add(n, n))
  refl(~Nat, ~mul2(n))
```

This time, it doesn't work, and we get the following error:

```haskell
Type mismatch.
- Found type... Equal(Nat, mul2(n), mul2(n))
- Instead of... Equal(Nat, mul2(n), add(n, n))
- When checking refl(~Nat, ~mul2(n))
```

That's because `refl(~Nat, ~mul2(n))` is a proof that `Equal(Nat, mul2(n),
mul2(n))`, but not that `Equal(Nat, mul2(n), add(n, n))`. The problem is that,
unlike on the previous tests, the equation now has a variable, `n`, which
causes both sides to get "stuck", so they don't become equal by mere reduction.
We need to "unstuck" the equation by inspecting the value of `n` with a case
expression.

```haskell
it_works_for_add(n : Nat) : Equal(Nat, mul2(n), add(n, n))
  case n
  | zero => ?a
  | succ => ?b
  : Equal(Nat, mul2(n), add(n, n))
```

Let's type-check it again:

```haskell
Found hole: 'a'.
- With goal... Equal(Nat, mul2(zero), add(zero, zero))
- With context:
- n : Nat

Found hole: 'b'.
- With goal... Equal(Nat, mul2(succ(n.pred)), add(succ(n.pred), succ(n.pred)))
- With context:
- n      : Nat
- n.pred : Nat

(n : Nat) -> Equal(Nat, mul2(n), add(n, n)) ✔
```

Notice that, now, we have two holes, one for each possible value of `n` (`zero`
or `succ(n.pred)`). The first hole is now asking a proof that `Equal(Nat,
mul2(zero), add(zero, zero))`.  See how it was specialized to the value of `n`
on the branch?  That's very important, because now both sides evaluate to
`zero`.  This allows us to prove that case with a `refl`!

```haskell
it_works_for_add(n : Nat) : Equal(Nat, mul2(n), add(n, n))
  case n
  | zero => refl(~Nat, ~zero)
  | succ => ?b
  : Equal(Nat, mul2(n), add(n, n))
```

Now, we only have one hole:

```haskell
Found hole: 'b'.
- With goal... Equal(Nat, mul2(succ(n.pred)), add(succ(n.pred), succ(n.pred)))
- With context:
- n      : Nat
- n.pred : Nat
```

This demands a proof that `Equal(Nat, mul2(succ(n.pred)), add(succ(n.pred),
succ(n.pred)))`. Due to the way `mul2` and `add` are defined, this reduces to
`Equal(Nat, succ(succ(mul2(n.pred))), succ(succ(add(n.pred, succ(n.pred)))))`,
so that's what we need to prove. This looks... complex. But, since we're in a
recursive branch, there is a cool thing we can do: call the function
recursively to the predecessor of `n`. That's the mathematical equivalent of
applying the inductive hypothesis, and it is almost always the key to proving
theorems about recursive datatypes like `Nat`. Let's do that and `log` it to
see what we get:

```haskell
it_works_for_add(n : Nat) : Equal(Nat, mul2(n), add(n, n))
  case n
  | zero => refl(~Nat, ~zero)
  | succ =>
    let ind_hyp = it_works_for_add(n.pred)
    log(ind_hyp)
    ?a
  : Equal(Nat, mul2(n), add(n, n))
```

This outputs:

```haskell
[LOG]
Term: it_works_for_add(n.pred)
Type: Equal(Nat, mul2(n.pred), add(n.pred, n.pred))
```

In other words, we gained "for free" a proof, `ind_hyp`, that `Equal(Nat,
mul2(n.pred), add(n.pred, n.pred))`! Now, remember that our goal is `Equal(Nat,
succ(succ(mul2(n.pred))), succ(succ(add(n.pred, succ(n.pred)))))`. Take a
moment to observe that, to turn `ind_hyp` into our goal, all we need to do is
add `succ(succ(...))` to both sides of the equation. This can be done with the
`cong` function from the Base library. That function accepts an equality and a
function, and applies the function to both sides of the equality. Like this:

```haskell
it_works_for_add(n : Nat) : Equal(Nat, mul2(n), add(n, n))
  case n
  | zero => refl(~Nat, ~zero)
  | succ =>
    let ind_hyp = it_works_for_add(n.pred)
    let add_two = (x : Nat) => succ(succ(x))
    let new_hyp = cong(~Nat, ~Nat, ~mul2(n.pred), ~add(n.pred, n.pred), ~add_two, ind_hyp)
    log(new_hyp)
    ?a
  : Equal(Nat, mul2(n), add(n, n))
```

Note that `cong` is a little bit verbose since it needs you to provide both
sides of the equality you want to alter. Don't let this scare you, though, you
can literally just copy-paste from the goal. In the future, Formality will be
able to fill those bureaucratic bits for you. Let's log `new_hyp` to see what
we have now:

```haskell
[LOG]
Term: cong(~Nat, ~Nat, ~mul2(n.pred), ~add(n.pred, n.pred), ~(x : Nat) => succ(succ(x)), it_works_for_add(n.pred))
Type: Equal(Nat, succ(succ(mul2(n.pred))), succ(succ(add(n.pred, n.pred))))
```

As you can see, `new_hyp` has the same type as our goal As such, we can
complete this branch with it:

```haskell
it_works_for_add(n : Nat) : Equal(Nat, mul2(n), add(n, n))
  case n
  | zero => refl(~Nat, ~zero)
  | succ =>
    let ind_hyp = it_works_for_add(n.pred)
    let add_two = (x : Nat) => succ(succ(x))
    let new_hyp = cong(~Nat, ~Nat, ~mul2(n.pred), ~add(n.pred, n.pred), ~add_two, ind_hyp)
    new_hyp
  : Equal(Nat, mul2(n), add(n, n))
```

And done! Since we've proven our theorem for both possible values of `n`
(`zero` or `succ(n.pred)`), then we've proven it for every `n`. And that's how
most proofs are done. Proving an equation is often just a game of "opening"
variables with `case` expressions so that the sides gets unstuck until we're
able to finish the proof with a `refl`, or with an inductive hypothesis.

The cool thing is, since our program passes the type-checker now, that means
we've proven that `2 * n` is equal to `n + n` for all `n`. This is an extreme
validation that our implementation of `mul2` is correct: it is as if we've
written infinite tests, one for each `n`. Not only that, but the fact that
`mul2` and `add` match perfectly despite being very different functions
reinforces the correctness of them both, mutually.

An interesting point to note is that proofs are often much longer than
theorems. In this example, the theorem had just one line, but the proof had 8.
Proofs are laborious to write and require a set of advanced programming skills.
But, once they're done, they're undeniably correct. This is extremely
valuable. For example, think of a huge smart-contract: its code could be big
and complex, but, as long as its developers publish proofs of a few essential
properties, users can trust it won't go wrong. In a way, proofs can be seen as
trustless correctness assets, in the sense, you can use them to convince people
that your code is correct without needing them to trust you.
