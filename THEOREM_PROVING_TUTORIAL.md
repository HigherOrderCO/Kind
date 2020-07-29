From TypeScript to Theorem Proving in 15 minutes
================================================

## What are types?

In most languages, types can be used to restrict the "domain" of a function. For
example, in JavaScript, we can write:

```c
function div(a, b) {
  return a / b;
}
```

But, without types, there is no guarantee `div` will be called with a `Number`.
If someone accidentally called it with a `String`, things could go very wrong:
`div("one", 2)` is `NaN`. We could prevent it with a **runtime check**:

```c
function div(a, b) {
  if (typeof a !== "number" || typeof b !== "number") {
    throw "Invalid input type.";
  }
  return a / b;
}
```

But, while this prevents the program from reaching a corrupt/undefined state,
there will still be an error at runtime. The program will still crash. The
solution to this, you know well. With `TypeScript`, we can write:

```c
function div(a : Number, b : Number) : Number {
  return a / b;
}
```

This prevents `div` from ever being called with a `String`. If you do, this will
be reported as a compile-time error. Great! That's how types help us.

## What are dependent types?

Even with types, `div(0,0)` is still `NaN`. This is still a corrupt state. What
if we wanted to also prevent it? That's where conventional type systems fall
apart. In TypeScript, you need a **runtime check** to ensure `b != 0`:

```c
function div(a : Number, b : Number) : Number {
  if (b === 0) {
    throw "Division by 0.";
  }
  return a / b;
}
```

We once again prevented the program from being in a corrupt/undefined state, but
it can still crash. In a way, this is as if `TypeScript`'s type system is
"incomplete" in some way. Dependent types "complete" a type system by allowing
us to write this:

```c
function div(a : Number, b : Number & b != 0) : Number {
  return a / b;
}
```

Here, the type of `b` has an extra condition. It must be a `Number` that is not
0. In other words, in the same way we can't call `div` with a `String`, we can't
also call it with a `Number` that is `0`; `div(2,0)` becomes a compile-time
error. Since the type of an input can **depend on values**, we call it a
**dependent type**. Great, right?

But how is that even possible? What if `b` isn't a number, but an expression?
For example:

```c
function foo(a : Number, b : Number) : Number {
  return div(a, abs(b) + 1);
};
```

How can Formality know that `abs(b) + 1` isn't `0`? Intuitively, we know it is
true: the absolute of a number plus one can't be `0`. But how is the compiler
supposed to know? That's where theorem proving shines.

## What is theorem proving?

Once types can be expressions that include values and variables, we must have a
way to symbolically manipulate those expressions to be able to "unlock" function
calls. We can accomplish that via theorem proving. For example:

```c
function abs_plus_1_isnt_0(b : Number) : abs(b)+1 != 0 {
  ...
}
```

Here, `inc_abs_is_positive` doesn't return a `Number` nor anything concrete. It
returns a "proof" that `abs(b)+1 != 0`. We can then use that proof to "unlock"
the call of `div` on `foo`:

```c
function foo(a : Number, b : Number) : Number {
  return div(a, abs(b) + 1 ...valid-because... abs_plus_1_isnt_zero(b)); 
};
```

The `abs(b)+1 != 0` is a type like `Number` or `Bool`, but instead of its
value being `7` or `true`, it is a "proof" that the `abs(b)+1 != 0`. That proof
is a first-class value like any other: it can be passed to functions, stored in
arrays and so on. But what does it look like? How do we prove a theorem?

## What a proof looks like?

Surprisingly, proofs aren't much different from a functional program: it is just
a bunch of case analysis and recursion ("induction"). That's because of an
amazing discovery that mathematical proofs and functional programs ["are the
same thing"](https://en.wikipedia.org/wiki/Curry%E2%80%93Howard_correspondence).

Let me give you a concrete example. In `TypeScript`, we can make a `List(A)`
type (for polymorphic lists), and a `singleton : A -> List(A)` function (that
returns a list with one `A`). We can write this:

```typescript
const my_list : List(Number) = singleton(7); // same as [7]
```

This is correct because `7 : Number` and `singleton` specializes to `singleton :
Number -> List(Number)`, thus `singleton(7) : List(Number)`.  In other words, if
someone asks you "what a `List(Number)` looks like", then `singleton(7)` is a
valid answer. Right?

Now suppose we could also make an `Equal(A, a, b)` type (for equality proofs)
and an `same : (a: A) -> Equal(A, a, a)` function (that returns a proof that any
value is equal to itself). We could then write this:

```typescript
const my_equality : Equal(Number, 7, 7) = same(7);
```

This would be correct because `7 : Number` and `same` specializes to
`same : (a: Number) -> Equal(A, a, a)`, thus `same(7) : Equal(Number, 7, 7)`.
Does this make sense? In other words, if someone asks you "what a `Equal(Number,
7, 7)` looks like", then `same(7)` is a valid answer. In this case, a proof of
an equality is just a function call. That is all!

But `7` is a concrete value. What if we wanted to prove something about an
**expression** such as `not(not(a)) == a` for any `Bool`? Since now there is a
variable, we need a function:

```typescript
function my_equality(a : Bool) : Equal(Bool, not(not(a)), a) {
  return same(a);
};
```

But this doesn't work, because `my_equality` is returning a `Equal(Bool, a, a)`,
not an `Equal(Bool, not(not(a)), a)` (take a moment to see why!). Those are
different types. What we can do, though, is inspect the possible values of `a`:

```typescript
function my_equality(b : Bool) : Equal(Bool, not(not(a)), a) {
  switch a {
    case true:
      return same(true);
    case false:
      return same(false);
  }
};
```

This works because, inside the `true` branch, the language knows that `a ==
true` and, thus, demands that we return `Equal(Bool, not(not(true)), true)`
(instead of `Equal(Bool, not(not(a)), a)`). Since `not(not(true))` **reduces
to true**, it then demands a `Equal(Bool, true, true)`, which is just
`same(true)`. In other words, the shape of the proof of `not(not(a)) == a` is:

```typescript
switch (a) {
  case true:
    return same(true);
  case false:
    return same(false);
};
```

Since `not(not(a)) == a` is an expression, its proof is also an expression: one
that inspects `a` to make sure that the equation holds for all its possible
values. We can then use that proof to unlock certain functions calls. For
example, suppose we had a function like this:

```typescript
// Can only be called with two identical inputs
function foo(a : Bool, b : Bool & Equal(Bool, a, b)) : Bool {
  ...
};
```

I.e., `foo` can only be called with two identical booleans. To call it, we need
a proof that its first two inputs are equal. Here are some ways to do it:

```typescript
// Works because `same(true)` proves that `true == true`.
const my_bool : Bool = foo(true, true & same(true));

// Works because `same(false)` proves that `false == false`.
const my_bool : Bool = foo(false, false & same(false));

function bar(x : Bool) : Bool {
  // Works because `my_equality(b)` proves that `not(not(b)) == b`.
  const my_bool : Bool = foo(not(not(x)), x & my_equality(b));
};
```

In other words, if the first two arguments are identical concrete values, we can
call `foo` using `same`. If they are expressions, we can call `foo` by proving
(possibly by case analysis and induction) that those expressions are identical.
And that's it: with those two ingredients we're able to set up the type system
in a way that allows us to restrict the domain of a function arbitrarily without
ever needing a runtime check. In a way, formal proofs are like the "Turing
completeness" of type systems.
