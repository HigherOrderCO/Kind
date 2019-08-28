# Formality-Core Tutorial

This tutorial aims to teach how to be effective developing Formality-Core code, assuming experience in functional programming languages, in special Haskell. Formality-Core is a minimal language based on elementary affine logic, making it compatible with optimal reductions. It can be seen as the GHC Core to the upcoming Formality language. Its minimalism, the lack of a type system, and its unusual boxed duplication system, makes it a very bare-bones language that isn't easy to work with directly, demanding that the programmer learns some delicate techniques to be productive.

## 1. Core features

Before proceeding, you should have Formality-Core installed, and be familiar with its core features and syntax. If you're not yet, please read the entire [`Language`](https://github.com/moonad/Formality/wiki/Installation) section of the wiki. 

## 2. Algebraic Datatypes

Algebraic Datatypes (ADTs) are the building bricks of functional programming languages like Haskell, where all programs are just functions operating on ADTs. Programming in Formality-Core isn't foundamentally different, just somewhat harder, since it demands you to 1. encode datatypes manually (with "Scott-Encodings"), 2. emulate the type system in your head. Once you're used to it, though, Formality-Core can and should be used as a low-levelish Haskell. As such, the best way to learn it is by learning how to translate Haskell code. 

Note: if you're familiar with Scott-Encodings, feel free to skip to the next section.

### 2.a. Booleans and simple pattern-matching

Let's start with a simple type: boolans. In Haskell, they can be defined with the following declaration:

```haskell
{-# LANGUAGE NoImplicitPrelude #-}

data Bool
  = True
  | False
```

This puts 2 constructors, `True` and `False` in scope. In Formality-Core, there is no `data` syntax. Instead, you must define each constructor explicitly with "Scott-Encodings":

```javascript
def True: {True False}
  True

def False: {True False}
  False
```

Here, `True` is a function of two arguments that returns the first, and `False` is a function of two arguments that returns the last. Why it is that way will be clear later. For now, let's attempt to translate a simple function, `not`:

```haskell
not :: Bool -> Bool
not True  = False
not False = True
```

The first thing we must do is get rid of Haskell's equational notation (which Formality-Core doesn't have) in favor of lambdas and case-ofs, like this:

```haskell
not :: Bool -> Bool
not = \ a -> case a of {
  True  -> False;
  False -> True;
}
```

For the sake of clarity, it is also recommended that each case is given a name with a `let`, as follows:

```haskell
not :: Bool -> Bool
not = \ a ->
  let case_True  = False in
  let case_False = True in
  (case a of { True -> case_True; False -> case_True })
```

Once a Haskell program is in this shape, translating it to Formality-Core is straigthforward: we just have to adjust the syntax, and convert the `case_of_` expression to an application of the matched value (`a`) to each case (`case_True`, `case_False`).

```javascript
def not: {a}
  let case_True  = False
  let case_False = True
  (a case_True case_False)
```

Run the program below with `fmc main`.

```javascript
def True: {True False}
  True

def False: {True False}
  False

def not: {a}
  let case_True  = False
  let case_False = True
  (a case_True case_False)

def main: 
  let bool = (not True)

  // Prints the value of Bool
  let case_True  = "I'm true!"
  let case_False = "I'm false!"
  (bool case_True case_False)
```

As an exercise, implement `bool_to_nat`, which returns `1` or `0`.

### 2.b. Nested matching (avoiding duplications in branches)

Let's now translate the following `and` function:

```haskell
-- Exhaustive patterns for the sake of demonstration
and :: Bool -> Bool -> Bool
and True  True  = True
and False True  = False
and True  False = False
and False False = False
```

The first step is to get rid of the equational notation in favor of lambdas and cases:

```haskell
and :: Bool -> Bool -> Bool
and = \ a b -> case a of {
  True -> case b of {
    True  -> True;
    False -> False;
  };
  False -> case b of {
    True  -> False;
    False -> False;
  };
}
```

Then, as a matter of convention, we write the case names with `let`s:

```haskell
and :: Bool -> Bool -> Bool
and = \ a b -> 
  let case_a_True = 
                     let case_b_True  = True  in
                     let case_b_False = False in
                     (case b of { True -> case_b_True; False -> case_b_False }) in
  let case_a_False =
                     let case_b_True  = False in
                     let case_b_False = False in
                     (case b of { True -> case_b_True; False -> case_b_False }) in
  (case a of { True -> case_a_True; False -> case_a_False })
```

And then, we convert the syntax to Formality-Core:

```javascript
def and: {a b}
  let case_a_True = 
    let case_b_True  = True
    let case_b_False = False
    (b case_b_True case_b_False)
  let case_a_False =
    let case_b_True  = False
    let case_b_False = False
    (b case_b_True case_b_False)
  (a case_a_True case_a_False)
```

This should be done, but `fmc` complains about this program:

```
Lambda variable `b` used more than once in:
{b} (a (b True False) (b False False))
```

The reason is that `b` is used twice, but Formality-Core lambdas are affine and only allow variables to be used once. We could fix this by duplicating `b`. But think about it: do we actually need to copy `b` here? If `a` is `True`, `b` will be used once. If `a` is `False`, `b` will be used once. In both cases, be is used only once, so, why do we need a copy. This is a very common situation: we want to use the same variable in two branches without copying it. Fortunatelly, there is a simple technique to avoid that copy: for each variable that you want to "copy" in many branches, introduce a lambda on each branch, then apply the whole matching expression to each "copied" variable. Like this:

```javascript
def and: {a b}
  let case_a_True = {b}
    let case_b_True  = True
    let case_b_False = False
    (b case_b_True case_b_False)
  let case_a_False = {b}
    let case_b_True  = False
    let case_b_False = False
    (b case_b_True case_b_False)
  (a case_a_True case_a_False b)
```

Now this program works and we didn't have to copy `b`! This technique is one of the confusing aspects of Formality-Core, but it isn't complex. Since Formality-Core is so restrict about copying, being comfortable with it absolutely essential to being productive on the language. Here is another example:

```javascript
let swap    = 0 // Change to 1 to swap
let big_arr = [1, 2, 3, 4, 5, 6, 7, 8]
let big_str = "I'm a big string with a lot of stuff!"
(if |swap|
  then: {big_arr big_str} [big_str, big_arr]
  else: {big_arr big_str} [big_arr, big_str]
  big_arr big_str)
```

This snippet creates an array and a string and then makes a pair of both with either the string first or the array first, depending on the value of `swap`. Despite using `big_str` and `big_arr` in both branches, those values were never copied thanks to the technique above.

Run the program below with `fmc main`.

```javascript
def True: {True False}
  True

def False: {True False}
  False

def and: {a b}
  let case_a_True = {b}
    let case_b_True  = True
    let case_b_False = False
    (b case_b_True case_b_False)
  let case_a_False = {b}
    let case_b_True  = False
    let case_b_False = False
    (b case_b_True case_b_False)
  (a case_a_True case_a_False b)

def main: 
  let bool = (and True False)

  // Prints the value of Bool
  let case_True  = "I'm true!"
  let case_False = "I'm false!"
  (bool case_True case_False)
```

As an exercise, implement `or`.

### 2.c. Pairs

In Haskell, pairs can be defined as:

```haskell
{-# LANGUAGE NoImplicitPrelude #-}

data Pair a b
  = NewPair a b
```

This puts 1 constructor, `NewPair`, in scope. This is the corresponding Formality-Core definitions:

```javascript
def NewPair: {a b} {NewPair}
  (NewPair a b)
```

Notice that those are mostly similar to `True` and `False`, except now there are two fields, `{a b}`, involved. Let's write the first accessor function in the Formality-ready form:

```haskell
fst :: Pair a b -> a
fst = \ pair -> 
  let case_NewPair = \ a b -> a in
  case pair of { NewPair a b -> case_NewPair a b }
```

Notice that, here, each field of the datatype became a lambda on the `case_NewPair` expression. This is the Formality translation:

```haskell
def fst: {pair}
  let case_NewPair = {a b} a
  (pair case_NewPair)
```

Run the program below with `fmc main`.

```javascript
def NewPair: {a b} {NewPair}
  (NewPair a b)

def get_first: {pair}
  let case_NewPair = {a b} a
  (pair case_NewPair)

def main: 
  let pair = (NewPair 1 2)

  // Prints the first element of `pair`
  (get_first pair)
```

As an exercise, implement `pair_swap`.

### 2.d. Non-recursive datatypes

Here are 2 more Haskell datatypes:

```haskell
data Maybe a
  = Nothing
  | Just a

data Either a b
  = Left a
  | Right b
```


This puts 4 constructors, `Nothing`, `Just`, `Left`, `Right` in scope. Those are the corresponding Formality-Core definitions:

```javascript
def Nothing: {Nothing Just}
  Nothing

def Just: {a} {Nothing Just}
  (Just a)

def Left: {a} {Left Right}
  (Left a)

def Right: {b} {Left Right}
  (Right b)
```

From this, you should be able to grasp the general pattern:

```javascript
def Ctor_0: {ctor_0_field_0 ctor_0_field_1 ...} {Ctor_0 Ctor_1 ...}
  (Ctor_0 ctor_0_field_0 ctor_0_field_1 ...)

def Ctor_1: {ctor_1_field_0 ctor_1_field_1 ...} {Ctor_0 Ctor_1 ...}
  (Ctor_1 ctor_1_field_0 ctor_1_field_1 ...)

...
```

Let's now implement a `from_just :: Maybe a -> Either String a` function that either extracts the value of a `Maybe`, or returns an error:

```
def from_just: {error_msg maybe_val}
  let case_nothing = (Left error_msg)
  let case_just    = {val} (Right val)
  (maybe_val case_nothing case_just)
```

By this point, you should be able to understand this. The general pattern for matching is:

```
let case_Ctor_0 = {ctor_0_field_0 ctor_0_field_1 ...} result_on_case_Ctor0
let case_Ctor_1 = {ctor_1_field_0 ctor_1_field_1 ...} result_on_case_Ctor1
...
```

Run the program below with `fmc main`.

```javascript
def Nothing: {Nothing Just}
  Nothing

def Just: {a} {Nothing Just}
  (Just a)

def Left: {a} {Left Right}
  (Left a)

def Right: {b} {Left Right}
  (Right b)

def from_just: {error_msg maybe_val}
  let case_nothing = (Left error_msg)
  let case_just    = {val} (Right val)
  (maybe_val case_nothing case_just)

def main:
  let maybe_a = Nothing
  let maybe_b = (Just 3)
  (from_just "I'm not a number." maybe_a)
```

As an exercise, implement `to_maybe :: Either a b -> Maybe b`.

### 2.e Copying non-recursive datatypes

Remember that Formality-Core functions can only use its bound variable once. Because of that, it is hard to make duplicates of a value. For example, this isn't possible:

```javascript
// square : Nat -> Nat
def square: {n}
  |n * n|
```

Here, we learned how to avoid this problem when the copy is needed in a different branch, but what if we really need the value twice, like on the case above? Fortunatelly, as explained on the [wiki](https://github.com/moonad/Formality/wiki/Dups-and-Boxes), Formality-Core includes an explicit duplication system that allows us to write this:

```javascript
// square : !Nat -> !Nat
def square: {n}
  dup n = n
  # |n * n|
```

But this kind of definition has an important limitation: it can only affect a number in a layer below it! In general, a term on layer `N` can't read any information from a term on layer `N+1`. Because of that, you **often want all data of your program to live in a single layer and avoid boxes as much as possible**. But then, how do we copy values? On the `square` case, what you want to do is to use the `cpy` primitive, which allows you to copy a number as many times as you want:

```javascript
// square : Nat -> Nat
def square: {n}
  cpy n = n
  |n * n|
```

For user-defined algebraic datatype, you must write an explicit `copy` function, which performs a pattern-match and explicitly returns copies of the same value. For example:

```javascript
def copy_bool: {b}
  let case_true  = [True, True]
  let case_false = [False, False]
  (b case_true case_false)

def main:
  let bool = True
  get [bool_cpy_0, bool_cpy_1] = (copy_bool bool)
  ...
```

This is an annoying complication that could and should be automated on the Formality language. When dealing with Formality-Core, writing explicit copy functions is one of the programmer's job. As an exercise, write a `copy_bool_pair` function that copies a pair of bools (i.e., `(copy_bool_pair [True, False]) == [[True,False], [True,False]]`).

### 2.f. Recursive datatypes

In Haskell, natural numbers and linked lists can be defined as:

```haskell
{-# LANGUAGE NoImplicitPrelude #-}

data Nat
  = Succ Nat
  | Zero

data List a
  = Cons a (List a)
  | Nil
```

This puts 4 constructors, `Succ`, `Zero`, `Cons`, `Nil` in scope. Those are the corresponding Formality-Core definitions:

```javascript
def Succ: {n} {Succ Zero}
  (Succ n)

def Zero: {Succ Zero}
  Zero

def Cons: {x xs} {Cons Nil}
  (Cons x xs)

def Nil: {Cons Nil}
  Nil
```

There is no surprise here: the definitions are identical to non-recursive datatypes. What changes, though, is that we can't use those datatypes as expected. This, for example, won't work:

```javascript
def length: {list}
  let case_cons = {x xs} (Succ (length xs))
  let case_nil  = Nil
  (list case_cons case_nil)
```

The problem is that, being a terminating language, recursion isn't allowed. Recursive datatypes without recursive functions are of limited use. What now?

That's when boxes become useful. Remember that I told you to avoid using boxes to copy data? That's because the real use of boxes is to capture loops, folds and recursion through the so called "Church-Encodings". This is best explained through examples. To recursive over a list of length up to 4, this is how you do it:

```javascript
def Cons: {x xs} {Cons Nil}
  (Cons x xs)

def Nil: {Cons Nil}
  Nil

def rec4: {succ zero}
  dup succ = succ
  dup zero = zero
  # (succ (succ (succ (succ zero))))

def length:
  let fold_succ = {rec list}
    let case_cons = {x xs} |1 + (go xs)|
    let case_nil  = 0
    (list case_cons case_nil)
  let fold_zero = 0
  dup length = (rec4 #fold_succ #fold_zero)
  # {list}
    (length list)

def main:
  dup length = length
  # let list = (Cons 7 (Cons 7 Nil))
    ["Length of the list is:", (length list)]
```

Let's take a moment to understand what is going on here, because this is very important and unusual. 















