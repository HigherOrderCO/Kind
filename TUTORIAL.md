# A First Look at Formality

Table of contents
=================
- [A First Look at Formality](#a-first-look-at-formality)
- [Table of contents](#table-of-contents)
- [🔟 The Bool Type](#-the-bool-type)
- [➡️ A Bool function](#️-a-bool-function)
- [📖 A Bool theorem](#-a-bool-theorem)
- [✨ A More Interesting Bool Theorem](#-a-more-interesting-bool-theorem)
- [☕ The Nat Type](#-the-nat-type)
- [A Nat function](#a-nat-function)
- [A Nat theorem](#a-nat-theorem)

🔟 The Bool Type
=================

Before we can solve the world's problems, we need some datatypes that describe them.
The Booleans are a good starting place. Make a new file called `Bool.fm` and copy this
into it:

```c
T Bool
| Bool.true;
| Bool.false;
```

`T` is a keyword to define a new type. `Bool` is the name of the type, and
`Bool.true` and `false` are its two values, or _constructors_.

Try type-checking our new definition:
```
fm Bool
```
You'll see the following output, indicating the type of each new term:
```
Type-checking:
Bool: Type
Bool.true: Bool
Bool.false: Bool

All terms check.

Reducing 'Bool':
self_Bool<P: (self: Bool) -> Type> -> (Bool.true: P((Bool.true) (Bool.false) Bool.true)) -> (Bool.false: P((Bool.true) (Bool.false) Bool.false)) -> P(self_Bool)
```
(You can ignore `self_Bool` for now - we'll cover it later.)

➡️ A Bool function
===================
> Every interesting program involves some kind of case-analysis.
>
> Gerald Sussman

Now that we have some data to work with, let's write a function that can 
manipulate it. The simplest boolean function is negation, i.e., a function
that converts `Bool.true` to
`Bool.false` and `Bool.false` to `Bool.true`. Add the following to `Bool.fm`:

```c
Bool.not(b: Bool): Bool  // Bool.not receives "b of type Bool" and returns "Bool"
  case b:                // Inspect the value of b...
  | Bool.true => Bool.false; // If it is true, return false.
  | Bool.false  => Bool.true;  // If it is false, return true.
```

A few things of note about case analysis:
- Currently, unlike most functional languages, Formality doesn't support
  full pattern matching and instead uses the orders of the constructors in
  the declaration as the order of the cases (notice for example that `Bool.true`
  is first in the case analysis, just as it is when we declared it). Full
  support for pattern matching is on the roadmap.
- As a consequence of the above, everything between the `|` and `=>` is a 
  just a comment.

As a matter of syntax-sugar, you can also use the `if` keyword:
```c
Bool.not(b: Bool): Bool
  if b then
    Bool.false
  else
    Bool.true
```
The `if` keyword works on any two-valued type, using the first constructor
as the "true" case and the second as the "false" case.

📖 A Bool theorem
==============

> Who has despised the day of small beginnings?
>
> Zechariah 4:10

Let's write our first proof in Formality! We'll start small: a proof that
`Bool.true` is equal to `Bool.true`. To do this, we need to invoke a deep
magic that lies at the heart of Formality: types are logical propositions,
and programs are their proofs. If that doesn't make sense yet, don't worry -
for now, the important bit is that we prove things in Formality by writing
normal datatypes and functions (just like everything else!).

Here's the code:
```
Bool.true_is_true: Equal(Bool, Bool.true, Bool.true)
  Equal.to<Bool, Bool.true>
```

Here, `Equal.to` is a constructor for the `Equal` datatype that accepts
a type and a value of that type and returns a proof that the value is equal
to itself. Try type checking the term:

```
fm Bool.true_is_true
```

For comparison, try passing `Bool.false` to `Equal.to` instead:

```c
Bool.true_is_true: Equal(Bool, Bool.true, Bool.true)
  Equal.to<Bool, Bool.false>
```
You'll get the following error:

```c
Found 1 type error(s):

Inside Bool.true_is_true:
Found type... Equal(Bool,Bool.false,Bool.false)
Instead of... Equal(Bool,Bool.true,Bool.true)
On line 24:
    20| Bool.not_false_is_true : The(Bool, Bool.true)
    21|   The.value<Bool>(Bool.not(Bool.false))
    22|
    23| Bool.true_is_true: Equal(Bool, Bool.true, Bool.true)
    24|   Equal.to<Bool, Bool.false>
```

Coming from a traditional statically typed language, all this might seem
magical, but `Equal` isn't a primitive: it's just a normal datatype similar
to our `Bool` type, except that it accepts parameters, and the type of
`Equal` *depends on its arguments* (hence, Formality is called
a dependently typed language).

Go ahead and fix our `Bool.true_is_true` theorem so it type-checks again.

✨ A More Interesting Bool Theorem
===========================================

> The reference of 'evening star' would be the same as that of 'morning star',
> but not the sense.
> 
> "On Sense and Reference", Gottlob Frege

Let's try proving a more interesting fact about Booleans, namely, that negation
is it's own inverse, i.e, for any Boolean `b`, `not(not(b)) == b`. 

An initial attempt might look something like this. Try type-checking it with `fm`.
```c
Bool.not_not_is_b(b: Bool): Equal(Bool, Bool.not(Bool.not(b)), b)
  Equal.to<Bool, b>
```

Hmm. Something didn't quite work. Here's the output:
```c
Found type... Equal(Bool)(b)(b)
Instead of... Equal(Bool)(Bool.not(Bool.not(b)))(b)
With context:
- b : Bool
On line 20:
    ...
    19| Bool.not_not_is_b(b: Bool): Equal(Bool, Bool.not(Bool.not(b)), b)
    20|   Equal.to<Bool, Bool.true>
    ...
```

What Formality is astutely observing is that `Bool.not(Bool.not(b))` is not
equal to b _in the sense of identical with_ `b`, just like "evening star" and
"morning star" are two unequal phrases both referring to Venus. Formality will
only consider two things equal when they evaluate to exactly the same terms
(this may seem pedantic, but it is called _Formality_ after all).

Formality requires more evidence before admitting our assertion. As usual,
this comes down to case analysis - we'll prove the statement holds for
each possible value of the Bool `b`:
```c
Bool.not_not_is_b(b: Bool): Equal(Bool, Bool.not(Bool.not(b)), b)
  case b:
  | Bool.true => Equal.to<Bool, Bool.true>;
  | Bool.false => Equal.to<Bool, Bool.false>;
  : Equal(Bool, Bool.not(Bool.not(b.self)), b.self);
```

This case analysis is very similar to the one in `Bool.not`: on each of the
two branches, the Bool `b` gets "broken apart" into a more
concrete value - `Bool.true` or `Bool.false`. From there, it's easy to prove
that `Bool.true` equals `Bool.true` and `Bool.false` equals `Bool.false`.

The extra stuff at the end requires some explanation. Up to now, we've let
Formality *infer* the result type of a `case` expression. But for complex things
(like proofs), Formality sometimes needs help in the form of an *annotation*. The
annotation at the end of a case analysis is called the *motive*.
Remember, our goal is to prove `Equal(Bool, Bool.not(Bool.not(b)), b)`. So with
our annotation, we tell Formality "Hey, this case expression has the type
`Equal(Bool, Bool.not(Bool.not(b.self)), b.self)`, got it?"

What about the `b.self`'s? `b.self` is a variable name (Formality allows `.`'s in
variable names), but you can think of it as the `self` field of the Bool `b`.
What's the `self` field? That gets deeper into Formality's type
system than we can go at this juncture. For now, just keep in mind that when you do a
case analysis on a value, you can access that value's `self` field for its respective type.

What can you do with the `self` field? If you permit some hand-waving, the `self` field
lets you *specialize* a variable any time you do case analysis on it.
So, in the example above, both values of `b.self` are specialized to `Bool.true` in the
first branch, and, as we noted, proving `Bool.true == Bool.true` is easy.

To illustrate the importance of `b.self`, let's try omitting them and 
just using `b`:
```
Bool.not_not_is_b(b: Bool): Equal(Bool, Bool.not(Bool.not(b)), b)
  case b:
  | Bool.true => Equal.to<Bool, Bool.true>;
  | Bool.false => Equal.to<Bool, Bool.false>;
  : Equal(Bool, Bool.not(Bool.not(b)), b);
```

Type-checking with `fm` will produce the following error.
```c
Found 1 type error(s):

Inside Bool.not_not_is_b:
Found type... Equal(Bool,Bool.true,Bool.true)
Instead of... Equal(Bool,Bool.not(Bool.not(b)),b)
With context:
- b : Bool
On line 19:
    15|   | false  => Bool.true;  // If it is false, return true.
    16|
    17| Bool.not_not_is_b(b: Bool): Equal(Bool, Bool.not(Bool.not(b)), b)
    18|   case b:
    19|   | Bool.true => Equal.to<Bool, Bool.true>;
    20|   | Bool.false => Equal.to<Bool, Bool.false>;
    21|   : Equal(Bool, Bool.not(Bool.not(b)), b);
```

Now let's try replacing just one `b` with `b.self`
```
Bool.not_not_is_b(b: Bool): Equal(Bool, Bool.not(Bool.not(b)), b)
  case b:
  ...
  : Equal(Bool, Bool.not(Bool.not(b.self)), b);
```

We still get an error, the same as the last one save one difference:
```
Found 1 type error(s):

Inside Bool.not_not_is_b:
Found type... Equal(Bool,Bool.true,Bool.true)
Instead of... Equal(Bool,Bool.not(Bool.not(Bool.true)),b)
```

You can see that where we replaced `b` with `b.self` in the motive,
`b` was replaced with `Bool.true` in the `Bool.true` branch of the
case analysis. And that's the idea of the `self` field: it lets you
swap variables for the values under consideration in case analysis.
Learning when and when not to do this is a bit of an art, but you'll
quickly get the hang of it with practice and feedback from the type
checker.

Phew! That was a lot! But believe it or not, we've covered a big
chunk of Formality's feature set. Give yourself and a pat on the
back, grab a coffee (or tea, let's be fair), and meet us back
here when you're ready for the natural numbers!

☕ The Nat Type
============

**⚠️Warning: The rest of this tutorial is under construction
and might not type check immediately!⚠️** 

The second type we're going to write is that of natural numbers, i.e.,
non-negative integers. It can be written like this:

```c
T Nat
| zero;
| succ(pred: Nat);
```

In other words, a `Nat` is either `zero`, or the successor of another `Nat`. For
example, `2` is the successor of the successor of `zero`, and can be written as
`Nat.succ(Nat.succ(Nat.zero))`. With the `Nat` type, we're able to uniquely
represent any non-negative integer.

A Nat function
==============

Let's write the addition on `Nat`:

```c
Nat.add(n: Nat, m: Nat): Nat
  case n:
  | m;
  | Nat.succ(Nat.add(n.pred, m));
```

Notice that Formality's `case` expression allows us to access the fields
contained inside the matched values inside their respective cases, with a
`value.field` name. That is why we can write `n.pred` inside the second case. It
is not a field accessor: `n.pred` is the actual name of the variable.

The way `add` works is by recursing on the first argument, adding 1 to the result
on each recursive call. It can be better explained by an example:

```
add(succ(succ(succ(zero))), succ(succ(zero)))   // add(3, 2)
= succ(add(succ(succ(zero)), succ(succ(zero)))) // 1 + add(2, 2)
= succ(succ(add(succ(zero), succ(succ(zero))))) // 1 + 1 + add(1, 2)
= succ(succ(succ(add(zero, succ(succ(zero)))))) // 1 + 1 + 1 + add(0, 2)
= succ(succ(succ(succ(succ(zero)))))            // 1 + 1 + 1 + 2
```

Since `Nat` is a common type, we can write it with numeric literals, which are
desugared to `Nat.succ(Nat.succ(...Nat.zero))`. Let's test it by adding
`123456789 + 987654321`:

```c
Docs.nat_test: Nat
  Nat.add(123456789, 987654321)
```

Running `fmcio Docs.nat_test` outputs `1111111110n`. That's because Formality
compiles `Nat` to JavaScript `BigInt`, which is a very fast implementation of
integers.

A Nat theorem
=============

Let's now prove two theorems: `add(0, a) == a` and `add(a, 0) == a`. The first
one is easy:

```c
Docs.0_plus_a_is_a(a: Nat): Equal(Nat, Nat.add(0, a), a)
  Equal.to<Nat, a>
```

That's because, due to the way `Nat.add` was written, `Nat.add(0, a)` reduces to
`a`. This allow us to use `Equal.to` directly. The second theorem is harder,
though. If we try to prove it like the first, we get the following error:

```c
Found type... Equal(Nat)(a)(a)
Instead of... Equal(Nat)(Nat.add(a)(Nat.zero))(a)
With context:
- a : Nat
On line 32:
    28| Docs.0_plus_a_is_a(a: Nat): Equal(Nat, Nat.add(0, a), a)
    29|   Equal.to<Nat, a>
    30|
    31| Docs.a_plus_0_is_a(a: Nat): Equal(Nat, Nat.add(a, 0), a)
    32|   Equal.to<Nat, a>
    33|
    34| //Docs.bool_show: IO(Unit)
    35|   //IO.print(Bool.show(Bool.true))
```

That's because `Nat.add` matches on the first argument, which, here, is a
variable, so it gets stuck, not unlike `not(not(b)) == b`. For that reason, we
must proceed by case analysis:

```c
Docs.a_plus_0_is_a(a: Nat): Equal(Nat, Nat.add(a, 0), a)
  case a:
  | Equal.to<Nat, Nat.zero>;
  | let ind = Docs.a_plus_0_is_a(a.pred)
    let app = Equal.apply<Nat, Nat, Nat.add(a.pred, Nat.zero), a.pred, Nat.succ, ind>
    app;
  : Equal(Nat, Nat.add(a.self, 0), a.self);
```

... to be continued ...
