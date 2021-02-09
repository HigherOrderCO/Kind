Theorem Proving
===============

Theorem proving is the main difference between Formality and traditional pure
functional languages like Haskell. Since proving theorems require certain
techniques that aren't common in these languages, this tutorial aims to fill
that gap, supplementing a reader that is familiar with basic functional
programming concepts (like recursion, pattern matching and algebraic datatypes)
with the required knowledge to start proving theorems right now.

Before starting, make sure to install Formality via Haskell or JavaScript
(example: `npm i -g formality-js`), clone this repository
(`https://github.com/moonad/formality`) and `cd` into the `formality/src`
directory (you **must** be there for now). You'll be editing the `Main.fm` file
only. Open it in your favorite editor and type `fmjs Main.fm` to type-check it.

The Equal type
--------------

To start proving theorems, first you must be aware of the `Equal` type:

```
type Equal <A: Type> (a: A) ~ (b: A) {
  refl ~ (b: a)
}
```

If that looks alien to you, don't worry. All you need to know is the following:
`Int` and `String` are simple types, `List(String)`, `Pair(Int, String)` are
polymorphic types (because you have types inside types), `Equal(Int,2,2)`,
`Equal(Bool,true,false)` and `Equal(Int,4,10)` are dependent types (because you
have values inside types). When you have a `x : Int`, that means `x` is a
number. When you have a `xs : List(Int)`, that means `xs` is a list of numbers.
When you have a `e : Equal(A,a,b)`, that means `e` is a **proof** that `a` and
`b` are equal. Equality proofs and lists are more similar than you think: both
are just regular datatypes that can be constructed and deconstructed.

The `Equal` type has only one constructor, `refl`, which has the following type:

```
Equal.refl : (A: Type) -> (x: A) -> Equal(A,x,x)
````

That means `refl` receives a type (`A`), and element `x` of type `A`, and
returns `Equal(A,x,x)`. As an example, the program below:

```
two_is_two: Equal(Nat, 2, 2)
  Equal.refl(Nat, 2)
```

Is a proof that `2 == 2`. Not that scary, right? Since `Equal` and `refl` are
common, there is a shortcut to write them. The program above is equivalent to:

```
two_is_two: 2 == 2
  refl
```

Make sure to replace the contents of `Main.fm` by the snipped above, and type
`fmjs Main.fm` to test it. You should see:

```
two_is_two: 2 == 2

All terms check.
```

Meaning that we indeed proved that 2 and 2 are equal. We can use `Equal.refl` to
prove an equality when both sides are equal, or when they reduce to the same
term. That means this also works:

```
two_is_two: (1 + 1) == 2 
  refl
```

Because `(1 + 1)` is a concrete value that computes to `2`. Now, of course,
proving that two concrete values are equal isn't that interesting. The real fun
starts when you start mixing letters; aka, variables; in these equations.
Theorem proving, in its most essential form, is all about techniques to
manipulate these equations until you get both sides to be identical. That's what
we're going to do through all this tutorial. Ready? Let's go!

---

Our first theorem: double negation
----------------------------------

We'll start proving a simple theorem: that, for any Boolean b, `not(not(b)) ==
b`. In other words, we'll prove that negating a boolean twice results on the
original boolean. To start this proof, we give the theorem a name, a type, and
a body (a goal):

```
double_negation(b: Bool): Bool.not(Bool.not(b)) == b
  ?a
```

We now run `fmjs Main.fm`. That will display:

```
Goal ?a:
With type: Bool.not(Bool.not(b)) == b
With ctxt:
- b: Bool
```

That just tells us that we must fill the body of `double_negation` with a proof
that `not(not(b)) == b`; nothing new here. Let's try using `Equal.refl`:

```
double_negation(b: Bool): Bool.not(Bool.not(b)) == b
  Equal.refl(Bool, b)
```

This will show a type error:

```
Type mismatch.
- Expected: Bool.not(Bool.not(b)) == b
- Detected: b == b
With context:
- b: Bool
```

That's because `Equal.refl(Bool, b)` proves that `b == b`, but we want a proof
that `Bool.not(Bool.not(b)) == b`. Yes, we, humans, know that
`Bool.not(Bool.not(b))` should always reduce to `b`, but the machine, Formality,
doesn't know that. Why? Let's see the definition of `Bool.not` (from `Bool.fm`):

```
Bool.not(b: Bool): Bool
  case b {
    true: false
    false: true
  }
```

When Formality sees `Bool.not(Bool.not(b))`, it reduces it to:

```
Bool.not(case b { true: false, false: true })
```

But now the inner case is **stuck**, trying to pattern-match on `b`. It can't
choose any branch, because it doesn't know what `b` is. It isn't `true`, it
isn't `false`. It is just a variable. That is the only reason Formality is not
able to tell that `Bool.not(Bool.not(b))` and `b` are the same. But we can help
it with a **case analysis**. That is, we can **pattern-match** on `b`:


```
double_negation(b: Bool): not(not(b)) == b
  case b {
    true: ?a
    false: ?b
  }
```

Check it with `fmjs Main.fm`:

```
Goal ?a:
With type: Bool.not(Bool.not(b)) == b
With ctxt:
- b: Bool

Goal ?b:
With type: Bool.not(Bool.not(b)) == b
With ctxt:
- b: Bool
```

Now, instead of one goal, we have two goals. But Formality is still demanding a
proof that `Bool.not(Bool.not(b)) == b` in both, so, that wasn't very helpful.
But consider the following: on the `true` case, we know that `b` is `true`,
because we just pattern-matched it. Similarly, on the `false` case, we know that
`b` is `false`. Wouldn't it be great if Formality noticed that, and relaxed its
demands by specializing `b` to its concrete value on each branch?  We can ask
Formality to do just that by adding a `!` after the case expression:

```
double_negation(b: Bool): Bool.not(Bool.not(b)) == b
  case b {
    true: ?a
    false: ?b
  }!
```

Here, `!` stands for "please, be less demanding and specialize b to its concrete
values on each case". By running `fmjs Main.fm`, we now see:

```
Goal ?a:
With type: Bool.not(Bool.not(Bool.true)) == Bool.true
With ctxt:
- b: Bool

Goal ?b:
With type: Bool.not(Bool.not(Bool.false)) == Bool.false
With ctxt:
- b: Bool
```

Formality now demands a proof that `not(not(true)) == true` on the first case,
and a proof that `not(not(false)) == false` on the second one. That's great,
because the variable `b` is gone and the `case b` inside `not` is now "unstuck"
and ready to compute.  To see that this is true, Formality allows us to inspect
and reduce a goal by writing `-` after it:

```
double_negation(b: Bool): Bool.not(Bool.not(b)) == b
  case b {
    true: ?a-
    false: ?b-
  }!
```

Running `fmjs Main.fm`, we see:

```
Goal ?a:
With type: Bool.not-10(Bool.not-22(Bool.true-30)) == Bool.true-3
With ctxt:
- b: Bool

Goal ?b:
With type: Bool.not-10(Bool.not-22(Bool.false-30)) == Bool.false-3
With ctxt:
- b: Bool
```

Notice how a `-N` was added after each reducible expression. That's a label. We
can ask Formality to reduce any of these by writting that label after the goal.
Let's reduce the inner `not` (the one labelled `-22`) on each branch:

```
double_negation(b: Bool): Bool.not(Bool.not(b)) == b
  case b {
    true: ?a-22
    false: ?b-22
  }!
```

Running `fmjs Main.fm`, we see:

```
Goal ?a:
With type: Bool.not(Bool.false) == Bool.true
With ctxt:
- b: Bool

Goal ?b:
With type: Bool.not(Bool.true) == Bool.false
With ctxt:
- b: Bool
```

Notice how the inner `Bool.not` was reduced, going from, on the `?a` branch,
`not(not(true)) == true` to `not(false) == true`. We can repeat the step above
to reduce the last `not`:

```
double_negation(b: Bool): Bool.not(Bool.not(b)) == b
  case b {
    true: ?a-22-10
    false: ?b-22-10
  }!
```

Running `fmjs Main.fm`:

```
Goal ?a:
With type: Bool.true == Bool.true
With ctxt:
- b: Bool

Goal ?b:
With type: Bool.false == Bool.false
With ctxt:
- b: Bool
```

That means Formality wants us to prove that `true == true` and `false == false`
on each branch respectively. That is easy: since both sides are equal, we can
just use `refl`:

```
double_negation(b: Bool): Bool.not(Bool.not(b)) == b
  case b {
    true: refl
    false: refl
  }!
```

By running `fmjs Main.fm`, we see:

```
double_negation: (b:Bool) Bool.not(Bool.not(b)) == b

All terms check.
```

That means our first proof is complete, and `not(not(b)) == b` is indeed true.
Good job!

Note that you could have written `refl` on its full form (for example,
`Equal.refl(Bool, Bool.true)`) instead of just `refl`. Note also that this last
step of reducing the goal with `-` is optional. If you knew that `not(not(true))
== true` would reduce to `true == true`, you could have just written `refl`
directly. Learning to use `-` can be very handy when you have goals too complex
to reduce in your head, so keep it in your toolbelt!

An easy theorem: `and(true, b) == b`
------------------------------------

Let's now prove that `and(true, b) == b`. That's true because, if `b` is `true`,
then the equation becomes `and(true,true) == true`, which reduces to `true ==
true`, which holds. And, if `b` is `false`, the equation becomes
`and(true,false) == false`, which reduces to `false == false`, which holds.
Let's prove it. As always, we start by writting a name, a type and a body:

```
and_true_b(b: Bool): Bool.and(true, b) == b
  ?a
```

By running `fmjs main.fm`, we see:

```
Goal ?a:
With type: Bool.and(Bool.true,b) == b
With ctxt:
- b: Bool
```

Notice that there is a variable `b` on the left side of the equation. That means
that we must pattern-match, because it is stuck... or is it? Let's recall the
definition of `Bool.and` (from `Bool.fm`):

```
Bool.and(a: Bool, b: Bool): Bool
  case a {
    true: b,
    false: false,
  }
```

Notice that this function only pattern-matches on `a`, not on `b`. That means
`Bool.and(true,b)` is **not** stuck, and immediately reduces to `b`. We can
convince ourselves of that by reducing `Bool.and`. First, add a `-` to the
goal:

```
and_true_b(b: Bool): Bool.and(true, b) == b
  ?a-
```

Run it with `fmjs Main.fm`:

```
Goal ?a:
With type: Bool.and-18(Bool.true-26,b) == b
With ctxt:
- b: Bool
```

Apply the `Bool.and` labelled with `18`:

```
and_true_b(b: Bool): Bool.and(true, b) == b
  ?a-18
```

Check with `fmjs Main.fm`:

```
Goal ?a:
With type: b == b
With ctxt:
- b: Bool
```

Since both sides are equal, we can complete this proof with `refl`:

```
and_true_b(b: Bool): Bool.and(true, b) == b
  refl
```

Check with `fmjs Main.fm`:

```
and_true_b: (b:Bool) Bool.and(Bool.true,b) == b

All terms check.
```

And done! Notice how we didn't need to use `case` on this proof. The lesson is:
having variables inside an expression doesn't mean it is stuck, it depends on
the definition of the used functions. As a rule of thumb, when proving a
theorem, don't just pattern-match every variable you see on the goal. Always use
`-` to test if your goal can be simplified as is. Only if it can't you should
pattern-match to specialize a variable to its concrete values.

A hard theorem: `and(b, true) == b`
-----------------------------------

Let's now prove `and(b, true) == b`:

```
and_b_true(b: Bool): Bool.and(b, true) == b
  ?a
```

That is almost identical to the last theorem we proved (`and(true, b) == b`), so
it should be just `refl` too, right? Wrong! Let's see what happens if we try to
reduce `Bool.and`. To do so, first, write `-` after the goal:

```
and_b_true(b: Bool): Bool.and(b, true) == b
  ?a-
```

Check with `fmjs Main.fm`:

```
Goal ?a:
With type: Bool.and-18(b,Bool.true-14) == b
With ctxt:
- b: Bool
```

Reduce the `Bool.and` labelled with `18`:

```
and_b_true(b: Bool): Bool.and(b, true) == b
  ?a-18
```

Check with `fmjs Main.fm`:

```
Goal ?a:
With type: b((a) Bool,Bool.true,Bool.false) == b
With ctxt:
- b: Bool
```

What? Unlike the previous theorem, reducing `Bool.and` didn't turn our type into
`b == b` immediately. Instead, it became `b(...) == b`. That's because
`Bool.and` is defined to pattern-match on the first argument, which, now, is the
variable `b`, instead of the concrete boolean `true`. That causes the left side
to be stuck trying to apply `b` to these things. To get it unstuck, we must use
a case on `b`:

```
and_b_true(b: Bool): Bool.and(b, true) == b
  case b {
    true: ?a
    false: ?b
  }!
```

Check with `fmjs Main.fm`:

```
Goal ?a:
With type: Bool.and(Bool.true,Bool.true) == Bool.true
With ctxt:
- b: Bool

Goal ?b:
With type: Bool.and(Bool.false,Bool.true) == Bool.false
With ctxt:
- b: Bool
```

Now we could have used `-` to reduce `Bool.and` on both goals to convince
ourselves that they reduce to `true == true` and `false == false` respectively.
Since I already know that, I'll just write `refl` on both cases:

```
and_b_true(b: Bool): Bool.and(b, true) == b
  case b {
    true: refl
    false: refl
  }!
```

That completes our third proof. The lesson is: again, use `-` to see how your
goal reduces, use case to specialize stuck variables, and use `refl` when you
manage to get two sides equal. With this simple procedure and enough patience,
you can prove any equality theorem.

A hard theorem made easy: `b == and(b,true)`
--------------------------------------------

Let's now prove that `b == and(b,true)`:

```
right_and_b_true(b: Bool): b == Bool.and(b, true)
  ?a
```

Since we have a variable `b`, and not a concrete value, as the first argument of
`and(b,true)`, and, since `and` pattern-matches on its first argument, then we
must need a pattern-match on this proof. Right? Kinda. Indeed we could do that:

```
right_and_b_true(b: Bool): b == Bool.and(b, true)
  case b {
    true: refl
    false: refl
  }!
```

And that would complete our proof. But in this case, since we have just proven
`and(b,true) == b`, which is the same thing just flipped,that means we can reuse
the former proof to prove `right_and_b_true`:


```
and_b_true(b: Bool): Bool.and(b, true) == b
  case b {
    true: refl
    false: refl
  }!

right_and_b_true(b: Bool): b == Bool.and(b, true)
  mirror(and_b_true(b))
```

Here, `mirror : (A: Type) -> (a: A) -> (b: B) -> Equal(A,a,b) -> Equal(A,b,a)`
is a standard function that flips the two arguments of an equality. That is, it
turns `a == b` into `b == a`. The lesson here is that not always we will prove
equalities with `refl` directly. If we did that, every proof would be huge!
Instead, we can use former proofs inside later proofs, simplifying their code.
This is a functional programming language, after all. Modularism, function reuse
and clean code apply to proofs too!

Exercises
---------

As an exercise, prove the following theorems:

```
and_false_b(b: Bool): Bool.and(false, b) == false
  ?a

and_b_false(b: Bool): Bool.and(b, false) == false
  ?a

or_true_b(b: Bool): Bool.or(true, b) == true
  ?a

or_b_true(b: Bool): Bool.or(b, true) == true
  ?a

or_false_b(b: Bool): Bool.or(false, b) == b
  ?a

or_b_false(b: Bool): Bool.or(b, false) == b
  ?a

eql_b_b(b: Bool): Bool.eql(b, b) == true
  ?a

demorgan_0(a: Bool, b: Bool): Bool.not(Bool.and(a,b)) == Bool.or(Bool.not(a),Bool.not(b))
  ?a

demorgan_1(a: Bool, b: Bool): Bool.not(Bool.or(a,b)) == Bool.and(Bool.not(a),Bool.not(b))
  ?a
```

---

An inductive proof: `half(double(n)) == n`
------------------------------------------

Let's now prove the simplest "inductive" theorem on natural numbers: that the
half of the double of a natural number is itself. As usual, we begin by writting
a name, a type and a body:

```
half_double_theorem(n: Nat): Nat.half(Nat.double(n)) == n
  ?a
```

Check with `fmjs Main.fm`:

```
Goal ?a:
With type: Nat.half(Nat.double(n)) == n
With ctxt:
- n: Nat
```

Here, we could try using `-` to reduce `Nat.double` and check if it simplifies.
Let's recall the definition of `Nat.double` and `Nat.half`:

```
Nat.double(n: Nat): Nat
  case n {
    zero: Nat.zero,
    succ: Nat.succ(Nat.succ(Nat.double(n.pred))),
  }

Nat.half(n: Nat): Nat
  case n {
    zero: Nat.zero,
    succ: case n.pred {
      zero: Nat.zero,
      succ: Nat.succ(Nat.half(n.pred.pred))
    }
  }
```

Since `half` uses `case` on `n`, it gets stuck, so we use `case` on `n` in our
proof to unstuck it:

```
half_double_theorem(n: Nat): Nat.half(Nat.double(n)) == n
  case n {
    zero: ?a
    succ: ?b
  }!
```

Run with `fmjs Main.fm`:

```
Goal ?a:
With type: Nat.half(Nat.double(0)) == 0
With ctxt:
- n: Nat

Goal ?b:
With type: Nat.half(Nat.double(Nat.succ(n.pred))) == Nat.succ(n.pred)
With ctxt:
- n: Nat
- n.pred: Nat
```

On the `zero` case, we must prove that `half(double(0)) == 0`. This reduces to
`0 == 0` (you can use `-` to verify that), so we just write `refl`:

```
half_double_theorem(n: Nat): Nat.half(Nat.double(n)) == n
  case n {
    zero: refl
    succ: ?b
  }!
```

Check with `fmjs Main.fm`:

```
Goal ?b:
With type: Nat.half(Nat.double(Nat.succ(n.pred))) == Nat.succ(n.pred)
With ctxt:
- n: Nat
- n.pred: Nat
```

Since there is just one goal left, that means the first case is correct. Now,
for the `succ` case, remember that the successor of a number can be written as
`1 + pred`, where `pred` is the predecessor of `n`. As such, Formality demands
us to prove that `half(double(succ(pred))) == succ(pred)`. Let's try to simplify
the left side of that equation. Write a `-` after the goal:

```
half_double_theorem(n: Nat): Nat.half(Nat.double(n)) == n
  case n {
    zero: refl
    succ: ?b-
  }!
```

Check with `fmjs Main.fm`:

```
Goal ?b:
With type: Nat.half-10(Nat.double-22(Nat.succ-46(n.pred))) == Nat.succ-5(n.pred)
With ctxt:
- n: Nat
- n.pred: Nat
```

Reduce the call to `Nat.double` (label `22`):

```
half_double_theorem(n: Nat): Nat.half(Nat.double(n)) == n
  case n {
    zero: refl
    succ: ?b-22-
  }!
```

Check with `fmjs Main.fm`:

```
Goal ?b:
With type: Nat.half-10(Nat.succ-22(Nat.succ-46(Nat.double-94(n.pred)))) == Nat.succ-5(n.pred)
With ctxt:
- n: Nat
- n.pred: Nat
```

Reduce the call to `Nat.half` (label `10`):

```
half_double_theorem(n: Nat): Nat.half(Nat.double(n)) == n
  case n {
    zero: refl
    succ: ?b-22-10
  }!
```

Check with `fmjs Main.fm`:

```
Goal ?b:
With type: Nat.succ(Nat.half(Nat.double(n.pred))) == Nat.succ(n.pred)
With ctxt:
- n: Nat
- n.pred: Nat
```

It seems like not much has changed, but we managed to get the `Nat.succ` out of
the `half(double(...))` expression. But now `double` is stuck on a variable
again: `n.pred`. Remember `.` is just part of the name, `n.pred` is the
predecessor of `n`. We could pattern-match on `n.pred` to unstuck it:


```
half_double_theorem(n: Nat): Nat.half(Nat.double(n)) == n
  case n {
    zero: refl
    succ: case n.pred {
      zero: ?a
      succ: ?b
    }!
  }!
```

Check with `fmjs Main.fm`:

```
Goal ?a:
With type: Nat.half(Nat.double(1)) == 1
With ctxt:
- n: Nat
- n.pred: Nat

Goal ?b:
With type: Nat.half(Nat.double(Nat.succ(Nat.succ(n.pred.pred)))) == Nat.succ(Nat.succ(n.pred.pred))
With ctxt:
- n: Nat
- n.pred: Nat
- n.pred.pred: Nat
```

The first goal now demands a proof that `half(double(1)) == 1`. Both sides are
now concrete and variable-free, so it reduces to `1 == 1`, which can be
completed with `refl`:


```
half_double_theorem(n: Nat): Nat.half(Nat.double(n)) == n
  case n {
    zero: refl
    succ: case n.pred {
      zero: refl
      succ: ?b
    }!
  }!
```

Great, we now proved the theorem for `n = 0` and `n = 1`! But now the second
goal now became:

```
Goal ?b:
With type: Nat.half(Nat.double(Nat.succ(Nat.succ(n.pred.pred)))) == Nat.succ(Nat.succ(n.pred.pred))
With ctxt:
- n: Nat
- n.pred: Nat
- n.pred.pred: Nat
```

This is similar to the situation we had before. With enough patience, we could
"lift" the `Nat.succ` out of the `half(double(...))` expression:

```
Goal ?b:
With type: Nat.succ(Nat.succ(Nat.half(Nat.double(n.pred.pred)))) == Nat.succ(Nat.succ(n.pred.pred))
With ctxt:
- n: Nat
- n.pred: Nat
- n.pred.pred: Nat
```

But now `Nat.double` is succ on `n.pred.pred`. We can use `case` on it too:

```
half_double_theorem(n: Nat): Nat.half(Nat.double(n)) == n
  case n {
    zero: refl
    succ: case n.pred {
      zero: refl
      succ: case n.pred.pred {
        zero: ?a
        succ: ?b
      }!
    }!
  }!
```

Check with `fmjs Main.fm`:

```
Goal ?a:
With type: Nat.half(Nat.double(2)) == 2
With ctxt:
- n: Nat
- n.pred: Nat
- n.pred.pred: Nat

Goal ?b:
With type: Nat.half(Nat.double(Nat.succ(Nat.succ(Nat.succ(n.pred.pred.pred))))) == Nat.succ(Nat.succ(Nat.succ(n.pred.pred.pred)))
With ctxt:
- n: Nat
- n.pred: Nat
- n.pred.pred: Nat
- n.pred.pred.pred: Nat
```

Once again, the first goal is now concrete and we can fill with `refl`:

```
half_double_theorem(n: Nat): Nat.half(Nat.double(n)) == n
  case n {
    zero: refl
    succ: case n.pred {
      zero: refl
      succ: case n.pred.pred {
        zero: refl
        succ: ?b
      }!
    }!
  }!
```

That means we have proven our theorem for `n=0`, `n=1` and `n=2`. But the last
case is even larger. We could go on forever and forever, but we would never
finish this proof because there are infinitely many natural numbers. So, we must
take a step back where the loop began. Remember we had the following proof:

```
half_double_theorem(n: Nat): Nat.half(Nat.double(n)) == n
  case n {
    zero: refl
    succ: ?b-22-10
  }!
```

And the following goal (check with `fmjs Main.fm`):

```
Goal ?b:
With type: Nat.succ(Nat.half(Nat.double(n.pred))) == Nat.succ(n.pred)
With ctxt:
- n: Nat
- n.pred: Nat
```

Since we were stuck on `n.pred`, we used `case` on it. But this resulted in an
endless chain of `case`s. Let's instead try something different: instead of
pattern-matching on `n.pred`, let's use `half_double_theorem` **recursively** on
it:

```
half_double_theorem(n: Nat): Nat.half(Nat.double(n)) == n
  case n {
    zero: refl
    succ:
      let ind = half_double_theorem(n.pred)
      ?b-22-10
  }!
```

Check with `fmjs Main.fm`:

```
Goal ?b:
With type: Nat.succ(Nat.half(Nat.double(n.pred))) == Nat.succ(n.pred)
With ctxt:
- n: Nat
- n.pred: Nat
- rec: Nat.half(Nat.double(n.pred)) == n.pred
```

Our goal didn't change, but now we have a new variable, `ind` in our context. We
gained it "for free" by calling `half_double_theorem` recursively on its
predecessor. Since `half_double_theorem` returns `half(double(n)) == n` for any
`n`, and since we applied it to `n.pred`, then `ind` has type
`half(double(n.pred)) == n.pred`. That's the **inductive hypothesis**. Take a
moment to realize that this type is almost the same as our goal: the only
difference is that the goal has an extra `Nat.succ` on each side. We can apply a
function to both sides of an equality using `apply(f,e)`.

```
half_double_theorem(n: Nat): Nat.half(Nat.double(n)) == n
  case n {
    zero: refl
    succ:
      let ind = half_double_theorem(n.pred)
      let app = apply(Nat.succ, ind)
      ?b-22-10
  }!
```

Check with `fmjs Main.fm`:

```
Goal ?b:
With type: Nat.succ(Nat.half(Nat.double(n.pred))) == Nat.succ(n.pred)
With ctxt:
- n: Nat
- n.pred: Nat
- ind: Nat.half(Nat.double(n.pred)) == n.pred
- app: Nat.succ(Nat.half(Nat.double(n.pred))) == Nat.succ(n.pred)
```

The type of `app` is exactly the type of our goal, so we can complete the proof
with it:

```
half_double_theorem(n: Nat): Nat.half(Nat.double(n)) == n
  case n {
    zero: refl
    succ:
      let ind = half_double_theorem(n.pred)
      let app = apply(Nat.succ, ind)
      app
  }!
```

Check with `fmjs Main.fm`:

```
half_double_theorem: (n:Nat) Nat.half(Nat.double(n)) == n

All terms check.
```

Great! This one was really hard, wasn't it? That's because the concept of
induction is hard to grasp, yet, induction is nothing but a fancy name for
recursion when used inside a proof. The lesson here is that there is that there
is a new way to "unstuck" a variable in a goal. Instead of pattern-matching on
it (with case), we can apply the function recursively to it. This will give us
"for free" a term of type `a == b` that is closer to the goal. Then, by
manipulating that equation (with `mirror` and `apply`, for example), we can
prove our goal.

A non-inductive proof: `(0 + n) == n`
--------------------------------------

Let's now prove that `0 + n == n` for any `n`. We start as usual:

```
add_0_n(n: Nat): (0 + n) == n
  ?a
```

Check with `fmjs Main.fm`:

```
Goal ?a:
With type: Nat.add(0,n) == n
With ctxt:
- n: Nat
```

Formality asks us to prove `Nat.add(0,n) == n`. It would be tempting to
pattern-match on `n`. But let's recall the definition of `Nat.add` (from
`Nat.fm`):

```
Nat.add(n: Nat, m: Nat): Nat
  case n {
    zero: m,
    succ: Nat.succ(Nat.add(n.pred, m)),
  }
```

Since it pattern-matches on the first argument, and since the first argument of
`0 + n` is concrete, then the goal reduces immediately to `n == n`. You can
verify that by using the `-` feature. As such, this proof is trivial: 

```
add_0_n(n: Nat): (0 + n) == n
  refl
```

Check with `fmjs Main.fm`:

```
add_0_n: (n:Nat) Nat.add(0,n) == n

All terms check.
```

Done!

An inductive proof: (n + 0) == n
--------------------------------

Let's now prove `(n + 0) == n`:

```
add_n_0(n: Nat): (n + 0) == n
  ?a
```

Check with `fmjs Main.fm`:

```
Goal ?a:
With type: Nat.add(n,0) == n
With ctxt:
- n: Nat
```

In this case, the first argument of `Nat.add` is a variable, `n`, instead of a
concrete value like `0`. It will get stuck. As usual, we unstuck it by using
`case`:

```
add_n_0(n: Nat): (n + 0) == n
  case n {
    zero: ?a
    succ: ?b
  }!
```

Check with `fmjs Main.fm`:

```
Goal ?a:
With type: Nat.add(0,0) == 0
With ctxt:
- n: Nat

Goal ?b:
With type: Nat.add(Nat.succ(n.pred),0) == Nat.succ(n.pred)
With ctxt:
- n: Nat
- n.pred: Nat
```

We can reduce `Nat.add` on the goal `?a` using `-`:


```
add_n_0(n: Nat): (n + 0) == n
  case n {
    zero: ?a-18
    succ: ?b
  }!
```

Check with `fmjs Main.fm`:

```
Goal ?a:
With type: 0 == 0
With ctxt:
- n: Nat

Goal ?b:
With type: Nat.add(Nat.succ(n.pred),0) == Nat.succ(n.pred)
With ctxt:
- n: Nat
- n.pred: Nat
```

Since both sides of the `?a` goal are equal, we complete it with `refl`:

```
add_n_0(n: Nat): (n + 0) == n
  case n {
    zero: refl
    succ: ?b
  }!
```

Check with `fmjs Main.fm`:

```
Goal ?b:
With type: Nat.add(Nat.succ(n.pred),0) == Nat.succ(n.pred)
With ctxt:
- n: Nat
- n.pred: Nat
```

On the left side of the goal `?b`, we have `add(succ(n.pred),0)`. From the
definition of `Nat.add`, we know that this is equivalent to
`succ(add(n.pred,0))`, so we use `-` to reduce `add` and simplify the goal:

```
add_n_0(n: Nat): (n + 0) == n
  case n {
    zero: refl
    succ: ?b-18
  }!
```

Check with `fmjs Main.fm`:

```
Goal ?b:
With type: Nat.succ(Nat.add(n.pred,0)) == Nat.succ(n.pred)
With ctxt:
- n: Nat
- n.pred: Nat
```

Now `add` has a variable, `n.pred`, on its first argument, so it is stuck.
Instead of using `case` on `n.pred` - which will lead to an infinite cascade of
cases - we use the inductive hypothesis. That is, we apply `add_n_0` recursively
to `n.pred`:

```
add_n_0(n: Nat): (n + 0) == n
  case n {
    zero: refl
    succ:
      let ind = add_n_0(n.pred)
      ?b-18
  }!
```

Check with `fmjs Main.fm`:

```
Goal ?b:
With type: Nat.succ(Nat.add(n.pred,0)) == Nat.succ(n.pred)
With ctxt:
- n: Nat
- n.pred: Nat
- ind: Nat.add(n.pred,0) == n.pred
```

Thanks to the inductive hypothesis, we gained `ind: add(n.pred,0) == n.pred` for
free. The type of `ind` is almost equal to our goal, except that it is missing a
`Nat.succ` on both sides. We add it using `apply`:

```
add_n_0(n: Nat): (n + 0) == n
  case n {
    zero: refl
    succ:
      let ind = add_n_0(n.pred)
      let app = apply(Nat.succ, ind)
      ?b-18
  }!
```

Check with `fmjs Main.fm`:

```
Goal ?b:
With type: Nat.succ(Nat.add(n.pred,0)) == Nat.succ(n.pred)
With ctxt:
- n: Nat
- n.pred: Nat
- ind: Nat.add(n.pred,0) == n.pred
- app: Nat.succ(Nat.add(n.pred,0)) == Nat.succ(n.pred)
```

The type of `app` is now the same as our goal, so we complete the proof with it:

```
add_n_0(n: Nat): (n + 0) == n
  case n {
    zero: refl
    succ:
      let ind = add_n_0(n.pred)
      let app = apply(Nat.succ, ind)
      app
  }!
```

Check with `fmjs Main.fm`:

```
add_n_0: (n:Nat) Nat.add(n,0) == n

All terms check.
```

Done! As you can see, proofs about natural numbers often follow this same
structure. On the zero case, write `refl`. On the succ case, use the inductive
hypothesis on `n.pred` and manipulate `ind` to reach the `goal`. Of course, it
varies depending on what you're trying to prove, but often that's the way.

Exercises
---------

As an exercise, prove the following theorems:

```
lte_0_n(n: Nat): Nat.lte(0, n) == true
  ?a

gte_n_0(n: Nat): Nat.gte(n, 0) == true
  ?b

eql_n_n(n: Nat): Nat.eql(n, n) == true
  ?c

is_even_double_n(n: Nat): Nat.is_even(Nat.double(n)) == true
  ?d

gte_succ_n_0(n: Nat): Nat.gte(Nat.succ(n), 0) == true
  ?e

gte_succ_n_n(n: Nat): Nat.gte(Nat.succ(n), n) == true
  ?f
```

Here, `Nat.lte(a,b)` stands for `a <= b` and `Nat.gte(a,b)` stands for `a >= b`
for natural numbers `a`, `b`. Check their definitions on `Nat.fm`.

Proving an inequality: `1 != 0`
===============================

In Formality, to prove that a theorem is true, we construct an element of the
corresponding type. But how do we prove that something is **not** true? To do
it, we must show that constructing an element of that type is impossible. The
easiest way to do it is by contradiction: we first assume that the theorem holds
and, based on that assumption, construct an element of the Empty type. Since the
Empty type can't be constructed, then our theorem can't be true. But what is the
Empty type? 

Remember the Boolean type has 2 elements:

```
type Bool {
  true
  false
}
```

Similarly, the Unit type has 1 element:

```
type Unit {
  unit
}
```

And a Suit type has 4 elements:

```
type Suit {
  hearts
  spades
  clubs
  diamonds
}
```

If we can create a type with 1, 2 and 4 elements, can we create a type with 0
elements? Sure, that's the Empty type:

```
type Empty {
}
```

But what is the point of a type with zero elements? It is useless, right? Wrong!
In fact it is one of the most useful types, because of how `case` expressions
work, and the *princible of explosion*. In order for a `case` expression to be
considered well-typed in Formality, you must provide a proof that it holds on
each case. For example, recall the double negation theorem:

```
double_negation(b: Bool): Bool.not(Bool.not(b)) == b
  case b {
    true: refl
    false: refl
  }!
```

Here, Formality demanded us a proof of `not(not(true)) == true` on the true
case, and a proof of `not(not(false)) == false` on the false case. Since we
provided a proof for each case of `b`, the `case` expression returned a proof of
`not(not(b)) == b`. That is, from a proof of each specific case (`true` /
`false`) we generated a proof of the general case (a variable `b : Bool`). But
what happens if we use `case` on a variable `e` of type `Empty`?

```
xablau(e: Empty): 1 == 0
  case e {
  }!
```

Here, Formality will demand us to prove that `1 == 0` holds for each possible
value of `e`. But `e` has no case, so, technically, we satisfied Formality's
demand by doing nothing. Formality then returns a proof that `1 == 0` holds for
every possible value of `e`. So, did we just prove that `1 == 0`? No! Because
`xablau` is a function that demands an element of the type `Empty`. But the
`Empty` type has no elements, so we can never call `xablau`!

That's the principle of explosion: from an absurd, we can derive any other
absurd. That's why `Empty` is so useful. If we can derive `Empty` from
a theorem, then that theorem is definitely false. For example, let's prove 
that `1 == 0` is not true. We write a function:

```
one_neq_zero(e: 1 == 0): Empty
  ?a
```

Which stands for "if 1 == 0, then we can construct an element of the Empty
type". Which can be read as "1 == 0 is a false theorem".

Check with `fmjs Main.fm`:

```
Goal ?a:
With type: Empty
With ctxt:
- e: 1 == 0
```

That means that, to prove that "1 == 0" is indeed false, our goal is to construct 
an element of the `Empty` type, based on the assumption that `1 == 0` (named `e`).

To do it, you must understand two other things. First, that we can have
expressions on types. For example:

```
two: if true then Nat else String
  2
```

This is a perfectly valid Formality definition. Notice how we used an expression
(`if`) inside the type of `two`. This is completely allowed. If you replaced `if
true` by `if false`, the program above wouldn't type-check anymore (try it!). We
can also write inline type annotations in Formality with `::`, so, for example:

```
let two = 2 :: if true then Nat else String
```

Is also valid.

Second, we can rewrite `a` by `b` inside a type if we have a proof that `a ==
b`. For example, suppose we had the following context:

```
eq: n == 2
xs: Vector(Nat, n)
```

That is, we have a vector `xs` of `n` natural numbers, and a proof `eq` that `n
== 2`. We can use `rewrite` and `eq` to cast `xs` to type `Vector(Nat, 2)`:

```
let ys = xs :: rewrite x in Vector(Nat, x) with eq
```

This would give us the following context:

```
eq: n == 2
xs: Vector(Nat, n)
ys: Vector(Nat, 2)
```

Take a moment to make sure the above makes sense to you. If you want to, you may
check the definition of `rewrite` on the `Equal.fm` file (although that may be a
little bit too indimidating for now!).

With these two insights in mind (that we have expressions inside types, and that
we can rewrite equal values inside types), we can prove that `one_neq_zero` by
using a very clever trick. Ready? Here it is:

```
one_neq_zero(e: 1 == 0): Empty
  let a = 42 :: if Nat.eql(1,1) then Nat else Empty
  let b = a  :: rewrite x in (if Nat.eql(1,x) then Nat else Empty) with e
  b
```

Now take a breath, and let me explain what is going on.

First, we created a local variable, `a`, of type `if Nat.eql(1,1) then Nat else
Empty`. Since `Nat.eql(1,1)` is true, then `a` must have type `Nat`. So, we just
write `42`, but any number would work. 

Second, we used the fact that `1 == 0` to replace the second `1` on the type of
`42`, from `1` to `0`. That means that `b` will have type `if Nat.eql(1,0) then
Nat else Empty`. But `Nat.eql(1,0)` is `false`, so, `b` has type `Empty`. Which
is what we were trying to construct!

In other words, we managed to create an element of type `Empty` by assuming that
`1 == 0`, plus a clever use of `rewrite` to "trick" Formality. Since the `Empty`
type has no elements, that means that, by contradiction, `1` is different of
`0`. In other words, whenever we have a proof in the following shape:

```
a_neq_b(e: a == b): Empty
  proof_by_contradiction
```

Then we know, for sure, that `a` and `b` are different. Since this is so common,
you can also write it as `a != b`:

```
a_neq_b: a != b
  (e) proof_by_contradiction
```

Here, `a != b` is a synonym of `Not(a == b)`, which is a synonym of `(e: a == b)
-> Empty`, which is why we write a lambda `(e)` on the body of `a_neq_b`.

Uff! That was a lot of information. Let's prove another inequality, but this
time being a little bit more straightforward.

Proving another inequality: `3 != 2`
-----------------------------------

Let's now prove that `3 != 2`. As usual, start with the name, type and body:

```
three_neq_two: 3 != 2
  ?a
```

Check it with `fmjs Main.fm`:

```
Goal ?a:
With type: Not(3 == 2)
```

As expected, Formality just tells us we must prove `Not(3 == 2)`, which is the
same as `(e: 3 == 2) -> Empty`. Since that is a function, we create a lambda:

```
three_neq_two: 3 != 2
  (e) ?a
```

Check it with `fmjs Main.fm.fm`:

```
Goal ?a:
With type: Empty
With ctxt:
- e: 3 == 2
```

Now Formality is demanding that we derive an element of type `Empty` given a
value of type `3 == 2`. We could proceed by using the rewrite trick above, but,
let's be honest, it is confusing and doing it every time would be annoying.
Instead, we will use the following function, exported by `Bool.fm`:

```
Bool.true_neq_false: true != false
```

Which, remember, is equivalent to:

```
Bool.true_neq_false: (e: true == false) -> Empty
```

So, here is the plan: since we have `e : 3 == 2`, and a function that, given
`true == false` returns `Empty` (which is our goal), then we'll just manipulate
`e` to transform its type from `3 == 2` to `true == false`, and then we'll send
it to `Bool.true_neq_false`, resulting in `Empty` (our goal). Let's use
`Nat.pred` to subtract 1 from both sides:

```
three_neq_two: 3 != 2
  (e)
  let e0 = apply(Nat.pred, e)
  ?a
```

Check with `fmjs Main.fm`:

```
Goal ?a:
With type: Empty
With ctxt:
- e: 3 == 2
- e0: 2 == 1
```

Now we have `e0: 2 == 1`. Let's do it again:

```
three_neq_two: 3 != 2
  (e)
  let e0 = apply(Nat.pred, e)
  let e1 = apply(Nat.pred, e0)
  ?a
```

Check with `fmjs Main.fm`:

```
Goal ?a:
With type: Empty
With ctxt:
- e: 3 == 2
- e0: 2 == 1
- e1: 1 == 0
```

Now we have `e1 : 1 == 0`. Let's now apply `Nat.is_zero` to both sides:

```
three_neq_two: 3 != 2
  (e)
  let e0 = apply(Nat.pred, e)
  let e1 = apply(Nat.pred, e0)
  let e2 = apply(Nat.is_zero, e1)
  ?a
```

Check with `fmjs Main.fm`:

```
Goal ?a:
With type: Empty
With ctxt:
- e: 3 == 2
- e0: 2 == 1
- e1: 1 == 0
- e2: false == true
```

Let's now flip `e2` using `mirror`:

```
three_neq_two: 3 != 2
  (e)
  let e0 = apply(Nat.pred, e)
  let e1 = apply(Nat.pred, e0)
  let e2 = apply(Nat.is_zero, e1)
  let e3 = mirror(e2)
  ?a
```

Check with `fmjs Main.fm`:

```
Goal ?a:
With type: Empty
With ctxt:
- e: 3 == 2
- e0: 2 == 1
- e1: 1 == 0
- e2: false == true
- e3: true == false
```

Perfect, we now have `e3: true == false` in our context. Since
`Bool.true_neq_false` receives `true == false` and returns `Empty` (our goal),
we just apply it to `e3`:

```
three_neq_two: 3 != 2
  (e)
  let e0 = apply(Nat.pred, e)
  let e1 = apply(Nat.pred, e0)
  let e2 = apply(Nat.is_zero, e1)
  let e3 = mirror(e2)
  Bool.true_neq_false(e3)
```

Check with `fmjs Main.fm`:

```
three_neq_two: Not(3 == 2)

All terms check.
```

Perfect!

Proving an inequality with variables: not(b) != b
-------------------------------------------------

Let's now prove that `not(b) != b`. We start as usual:

```
not_a_neq_a(a: Bool): Bool.not(b) != b
  ?a
```

Check with `fmjs Main.fm`:

```
Goal ?a:
With type: Not(Bool.not(b) == b)
With ctxt:
- a: Bool
```

As expected, Formality demands that we prove `Not(not(b) == b)`, which is the
same as `(not(b) == b) -> Empty`. Since that is a function, we add a lambda:

```
not_a_neq_a(b: Bool): Bool.not(b) != b
  (e) ?a
```

Check with `fmjs Main.fm`:

```
Goal ?a:
With type: Empty
With ctxt:
- a: Bool
- e: Bool.not(b) == b
```

Now we must construct `Empty` from `e: not(b) == b`. Let's pattern-match on `b`:

```
not_a_neq_a(b: Bool): Bool.not(b) != b
  (e)
  case b {
    true: ?a
    false: ?b
  }!
```

Check with `fmjs Main.fm`:

```
Goal ?a:
With type: Empty
With ctxt:
- b: Bool
- e: Bool.not(b) == b

Goal ?b:
With type: Empty
With ctxt:
- b: Bool
- e: Bool.not(b) == b
```

This isn't helpful: we now have two branches with identical goals and contexts.
But notice that `b` is true on the first branch, and false on the second branch,
yet `e: Bool.not(b) == b` wasn't "updated" to reflect that fact. Can we update
it? Sure: just move the lambda to inside the case expression. This will allow
Formality to rewrite the type of `e` with the concrete values of `b` on each
branch:

```
not_a_neq_a(b: Bool): Bool.not(b) != b
  case b {
    true: (e) ?a
    false: (e) ?b
  }!
```

Check with `fmjs Main.fm`:

```
Goal ?a:
With type: Empty
With ctxt:
- b: Bool
- e: Bool.not(Bool.true) == Bool.true

Goal ?b:
With type: Empty
With ctxt:
- b: Bool
- e: Bool.not(Bool.false) == Bool.false
```

Great! now we have `e: false == true` in one branch, and `e: true == false` on
the other, and we must prove `Empty`. Now, remember that we can use
`Bool.true_neq_false` and `Bool.false_neq_true` to create `Empty` from `true ==
false` and `false == true` respectively. As such, we just apply these functions
to `e`:

```
not_a_neq_a(b: Bool): Bool.not(b) != b
  case b {
    true: (e) Bool.false_neq_true(e)
    false: (e) Bool.true_neq_false(e)
  }!
```

Check with `fmjs Main.fm`:

```
not_a_neq_a: (b:Bool) Not(Bool.not(b) == b)

All terms check.
```

Perfect! Notice that here we did something new: we used case of to specialize
the value of a variable on the context, not the goal, to reflect the concrete
value of `b` on each branch. Another way to do it is by using the `with`
notation:

```
not_a_neq_a(b: Bool): Bool.not(b) != b
  (e)
  case b
  with e : (Bool.not(b) == b) = e {
    true: Bool.false_neq_true(e)
    false: Bool.true_neq_false(e)
  }!
```

This "moves" `e: Bool.not(b) == b` to inside the pattern-match, specializing `b`
on its type. It has the same effect of moving the lambda inside. It may be more
or less verbose depending of what you're trying to prove.

Exercises
---------

Prove the following inequalities:

```
or_true_a_neq_false(a: Bool): Bool.or(true, a) != false
  ?a

or_a_true_neq_false(a: Bool): Bool.or(a, true) != false
  ?a

and_false_a_neq_true(a: Bool): Bool.and(false, a) != true
  ?a

and_a_false_neq_true(a: Bool): Bool.and(a, false) != true
  ?a
```

Boss fight
----------

These theorems are harder than the rest, but can be proven from the techniques
presented here:

```

add_succ_n_m(n: Nat, m: Nat): Nat.add(Nat.succ(n), m) == Nat.succ(Nat.add(n, m))
  ?a

add_n_succ_m(n: Nat, m: Nat): Nat.add(n, Nat.succ(m)) == Nat.succ(Nat.add(n, m))
  ?a

add_a_b(a: Nat, b: Nat): (a + b) == (b + a)
  ?a

succ_n_neq_n(n: Nat): Nat.succ(n) != n
  ?a
```

Hints:

- To prove `add_a_b`, use `add_0_n` and `add_n_succ_m`.

- To prove `succ_n_neq_n`, use `case` to specialize `e` (like on `not_a_neq_a`)
  and the inductive hypothesis.
