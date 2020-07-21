# A First Look at Formality

### 🔟 The Bool Type

Before we can solve the world's problems, we need some datatypes that describe them.
The Booleans are a good starting place. Make a new file called `Bool.fm` and copy this
into it:

```c
T Bool
| Bool.true;
| Bool.false;
```

`T` is a keyword to define a new type. `Bool` is the name of the type, and
`true` and `false` are its two values, or _constructors_.

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

### ➡️ A Bool function
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

### A Bool theorem

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

```
Bool.true_is_true: Equal(Bool, Bool.true, Bool.true)
  Equal.to<Bool, Bool.false>
```
You'll get the following error:

```
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

Notice that we've encoded facts about _data values_ into the _types_
of functions. This is power of dependent types, and we'll be taking that
power to its limit. Go ahead and change it back so things type check correctly.

### ✨ A Slightly More Interesting Bool Theorem
> The reference of 'evening star' would be the same as that of 'morning star',
> but not the sense.
> 
> Gottlob Frege, On Sense and Reference

Let's try proving a more interesting fact about Booleans, namely, that negation
is it's own inverse: for any boolean `b`, `not(not(b)) == b`. 

Copy the definition below and try type checking it with the `fm` command:
```c
Bool.not_not_is_b(b: Bool): Equal(Bool, Bool.not(Bool.not(b)), b)
  Equal.to<Bool, b>
```

Hmm. Obviously, something didn't quite work:
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
"morning star" two unequal phrases both referring to Venus (this may seem
pedantic, but it is called _Formality_ after all).

Formality requires more evidence before admitting our assertion. As usual,
this comes down to case analysis:
```c
Bool.not_not_is_b(b: Bool): Equal(Bool, Bool.not(Bool.not(b)), b)
  case b:
  | Bool.true => Equal.to<Bool, Bool.true>;
  | Bool.false => Equal.to<Bool, Bool.false>;
  : Equal(Bool, Bool.not(Bool.not(b.self)), b.self);
```
.....................TODO fix al this...............

Case analysis "breaks apart" a generic `Bool` type into a more specific
`Bool.true` type (in the first branch) or `Bool.false` type (in second).
With the type specialized on each branch, 

The last line tells Formality the type returned by the case expression, with one
quirk: we use `b.self` to tell Formality to **specialize** that type using the
concrete value of `b` inside each branch. On the first branch, `b = Bool.true`,
so `Equal(Bool, Bool.not(Bool.not(b.self)), b.self)` is specialized to
`Equal(Bool, Bool.not(Bool.not(Bool.true)), Bool.true)`, which reduces to
`Equal(Bool, Bool.true, Bool.true)`. This allow us to write
`Equal.to<Bool, Bool.true>` identical, we can use `Equal.to`. The same
reasoning goes for the last branch. Once all branches are correctly filled,
Formality **generalizes** `b.self` to the matched value `b`, causing the whole
`case` expression to have type `Equal(Bool, Bool.not(Bool.not(b)), b)`. This
completes our first proof!
.......

The Nat Type
------------

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
--------------

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
-------------

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
