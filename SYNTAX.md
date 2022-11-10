All syntaxes
------------

This document lists all the high-level syntaxes available on the Kind language. Every syntax listed below is expanded (desugared) to either a primitive term, or to one of the functions available on the base library.

A Kind program consists of a collection of top-level function definitions, usually with a function called `Main` which acts as the entry point of the program. Here's an example of a program that reads a number `n` from user input and outputs the nth fibonacci number.

```
Main {
  do IO {
    ask inp = IO.prompt "Which fibonacci number to calculate? "
    let res = Parser.run Parser.u60_decimal inp
    match Either res {
      left  =>
        let n     = res.val
        let fib_n = Fib n
        IO.output ((U60.show fib_n) "")
      right =>
        IO.output "Input text is not a number"
    }
  }
}

Fib (n: U60) : U60 {
  Fib.go n 0 1
}

Fib.go (n: U60) (f1: U60) (f2: U60) : U60
Fib.go 0 f1 f2 = f1
Fib.go n f1 f2 = Fib.go (- n 1) f2 (+ f1 f2)
```

Not all programs are necessarily made to be run. Proofs for example may only exist to be type-checked, which already validates the thing they're proving.

For many more real code examples, check the Wikind repository.

Top-level definition
--------------------

```
Name (arg0: Type0) (arg1: Type1) : ReturnType
Name (Type0.ctr subarg0 subarg1) arg1      = rule0_body
Name arg0                        Type1.ctr = rule1_body

...
```

Kind programs and proofs are composed of a number of top-level definitions containing a `Name`, followed by a number of arguments, followed by a `:`, followed by a `ReturnType`, followed by a sequence of rewrite rules. For example:

```
MyName: String
MyName = "Victor"
```

Creates a top-level definition called `MyName`, of type `String` and value `"Victor"`. And:

```
GetFirst (fst: String) (snd: String): String
GetFirst fst snd = fst
```

Creates a top-level function called `GetFirst`, which receives two arguments, `fst` and `snd` of type `String`, and returns a `String`, which is the first argument.

Every rule must pattern match on each argument and they may match on a specific type constructor or match everything on a variable. For example, given the type:

```
Bool : Type
Bool.true : Bool
Bool.false : Bool
```

We could write the following function:

```
Bool.and (a: Bool) (b: Bool) : Bool
Bool.and Bool.true Bool.true = Bool.true
Bool.and x         y         = Bool.false
```

This defines a top-level function `Bool.and` with arguments `a` and `b`, and two rules. The first rule is selected only when `a` is `Bool.true` and `b` is `Bool.true`, and returns `Bool.true`. All other cases match with the second rule, where the variable `x` is bound to the value of the first argument and the variable `y` is bound to the value of the second argument. Both variables are unused and the second rule always return `Bool.false`.

A function with no rules behaves like a type constructor and is considered to be always correct by the type checker. In the example above, we defined one way to create a value of type `Type` called `Bool` and two ways of creating values of type `Bool` called `Bool.false` and `Bool.true`.

The name of the top-level definition also specifies the file where the definition is. For example `Physics.Verlet.step` must be either in `Physics/Verlet/step.kind2` or `Physics/Verlet/step/_.kind2`. All top-level definitions must start with a capital letter, while all variables must start with a lowercase letter.

An argument may be defined to be erased, meaning it will be removed on runtime, being used only for type checking, by adding a `-` in front of the argument. For example:

```
MyFun -(a: Type) (b: a) : ReturnType
```

This defines a function with an argument `a` that gets erased during runtime, and an argument `b` of type `a`. All arguments of type `Type` should be erased. Also, because Kind has dependent types, we can write an argument that depends on the value of another, like is the case with `b` in the example above.

An argument may also be defined to be implicit, meaning it's value will be inferred and we don't need to pass it explicitly when calling a function. An argument that is both erased and implicit is defined by writing it between `<>`. For example:

```
List.tail <a: Type> (xs: List a) : List a
```

Here `a` is an implicit and erased argument. When calling a function with an implicit argument, we can pass it explicitly like `List.tail Bool bool_list` or we can ommit it and let its value be implied from the context like `List.tail bool_list`.

We can write an argument that is implicit but not erased with `+<arg: ArgType>`, but the use cases for this construction are very uncommon.

When writing the patterns of a function's rule, we can ommit arguments that are erased. For example, we can define a rule for the `List.tail` function above in two equivalent ways:

```
List.tail <a: Type> (xs: List a) : List a
List.tail a (List.nil  t)      = List.nil
List.tail a (List.cons t x xs) = xs
```
or
```
List.tail <a: Type> (xs: List a) : List a
List.tail  List.nil        = List.nil
List.tail (List.cons x xs) = xs
```

When type-checking, the ommited variables will be filled with an actual variable, but it won't be available for use inside the rule's body. Also, as the example above shows, we can ommit erased variables both in a root position of the pattern as well as inside of a constructor.

When pattern matching in a rule, if we don't use one of the bound variables, we can write it simply as `_` and avoid having to give it a name. Internally, this variable is given a name that is not accessible inside of the rule body. In the `List.tail` example, the `x` variable is not used in the second rule, so we could write it as `List.tail (List.cons _ xs) = xs` to make explicit that we don't care about this value.

It is also possible to ommit any of the type annotations in a function definition. Any variables that don't have a explicit type have their types infered during type checking. Combining everything together, we could write the `List.tail` example as:

```
List.tail <a> (xs: List a) : List a
List.tail List.nil = List.nil
List.tail (List.cons _ xs) = xs
```

This is how this function is defined in the Wikind repository, which contains a wide collection of Kind definitions.

For functions that have only one rule that doesn't do any pattern matching at all on the arguments, there is a concise syntax to define them:

```
Hello (name: String) : IO U60 {
  IO.output (String.concat "Hello, " name)
}
```

This is equivalent to the following:

```
Hello (name: String) : IO U60
Hello name = IO.output (String.concat "Hello, " name)
```

Top-level function definition is the only syntax that isn't an expression, which means they can't appear anywhere in the program and, instead, must appear at the "global scope" of a file.

Lambda
------

```
x => body
```

A lambda represents an inline function. It is written as a variable name, followed by `=>`, followed by a term. Currently, there are no mukti-argument lambdas in Kind, they must be written like `a => b => c => body`.

Usually, the type of a lambda argument is infered, but we may optionally anotate its type to help the type-checker. For example:

The type inference of the lambda `x => x` will likely fail since there isn't enough information here to know what exactly `x` is. We can write this expression as `(x: SomeType) => x` to avoid needing to infer this type.


Application
-----------

```
(func argm)
```

A function application is written in lisp style, `(f x)`. If you want to apply a bigger expression to an argument, you can wrap `()` around it. For example: `((x => body) argm)` would apply the `x => body` function to `argm`.

In Kind2, lambdas are essentially different to functions, for some important optimizations reasons. There is no automatic currying of functions and we must always call a function with either all its explicit arguments or with all explicit and all implicit arguments. A 3-argument function `f3`, for example, is called with `(f3 a0 a1 a2)`. If we want to curry the last argument of this function, it must be done explicitly with `(a2 => (f3 a0 a1 a2))`.

For lambdas, although they are not multi-argument, we can call multiple lambdas in a row like we would a multi argument function. For example:

Consider a variable holding a lambda `let lmb = a0 => a1 => a2 => a3 => (f4 a0 a1 a2 a3)`. We could call it with `(((lmb x) y) z)`, but for conciseness, we can ommit the parens and call it simply with `(lmb x y z)`. Note that, unlike was the case for functions, we don't need to resolve every single lambda at once.

When writing a sequence of nested function applications, the first layer of parenthesis can be ommited (except for binary operators on native numbers). For example, the following function definitions are equivalent:

```
List.flatten <a> (xs: (List (List a))) : (List a)
List.flatten (List.nil)              = (List.nil)
List.flatten (List.cons head tail)   = (List.concat head (List.flatten tail))
```

```
List.flatten <a> (xs: List (List a)) : List a
List.flatten List.nil              = List.nil
List.flatten (List.cons head tail) = List.concat head (List.flatten tail)

```

One thing to be careful of, is with function types. `List a -> List a` is interpreted as `(List (a -> (List a)))` which may cause errors when not being careful, so it's best to use parenthesis in this case, like so `(List a) -> (List a)`.

Let
---

```
let x = value
body
```

Let expressions define local values. They allow an expression to be reused multiple times, and computed only once at runtime. For example:

```
let x = (Heavy 1000000)
x + x
```

Will only evaluate `(Heavy 1000000)` once. Since `let` is just an expression, you can chain it any way you like. A `;` can be used for clarity to separate the value and the body, and `()` can be used to wrap an inline `let` expression, but neither are mandatory. 

```
let a = 1
let b = (let x = 2; x)
let c = 3
(+ a (+ b c))
```

A `let` expression introduces a new variable in the context. That variable will appear in error messages and is **not** considered equal to the expression it assigns (for theorem proving and type-aliasing purposes).

Since a `let` is a normal expression like all others, it may be used anywhere an expression is expected. This can be useful for example, for defining very complex return types for proofs. For example, the following type can be made more readable by adding some `let` expressions:

#### TODO: Find an example. I know we have one somewhere either on Wikind or on Kind1's base.

#### TODO: Write a warning about dups


Forall (dependent function type)
-------------------------------------

```
(name: type) -> body
```

Forall, or Pi, or dependent function type, is the type of a function. 

```
Nat.add (n: Nat) (m: Nat) : Nat
```
`Nat.add` is a function which takes two `Nat`s and returns its sum. It has type `(n: Nat) -> (m: Nat) -> Nat`.

```
Bool.double_negation (b: Bool) : Equal Bool (Bool.not (Bool.not b)) b
```
`Bool.double_negation` is a proof that for all `Bool`, its double negation is equal to itself. It has type `(b: Bool) -> (Equal Bool (Bool.not (Bool.not b)) b)`.

Since Kind functions are dependently typed, you can give a name to the input variable, and use it in the body of the dependent type. For example:

```
(n: Nat) -> Vector Bool n
```

Is the type of a function that receives a `n: Nat` and returns a `Vector` of `n` `Bool`s.

If you're not using dependent types, you can omit the names, parenthesis and colon, and write just:

```
Nat -> Nat
```

Which is a function that receives a `Nat` and returns a `Nat`. This is converted into `(_: Nat) -> Nat`, which is a way of not giving a name to a variable.

While the arrow `->` is actually optional when defining a named forall (ie: `(x: a) -> (f x)` is equivalent to `(x: a) (f x)`), it is usually recommended for clarity.


Annotation
----------

```
x :: A
```

An inline type annotation. Has no runtime effect, but can be useful to help the
type-checker when it can't infer a type. For example:

```
let fn = (x => x + x) :: Nat -> Nat
fn 4
```

The code above uses an inline annotation to annotate the type of the `x => x + x`
function named `fn`. 


If, then, else
--------------

```
if b { t } else { f }
```

The syntax above is equivalent to a ternary operator. It evaluates the bool `b` and returns `t` if it is true, `f` otherwise. It expands to the function application `Bool.if b t f`.

Type Derivation
---------------

#### TODO: Explain the syntax for the `kind2 derive` command


Match (pattern matching)
-----------------------

```
match ExprType name = expression {
  ctr0 => body0
  ctr1 => body1
  ...
  ctrN => bodyN
}: motive
```

The `match` syntax is a convenient way of branching on each constructor of a type, and accessing their inner values without having to write an auxiliary function. By using the motive, it can also be very helpful with proving theorems. A simple example is:

```
let x = Bool.true
match Bool x {
  true  => "x is true"
  false => "x is false"
}
```

When a matched constructor has fields, you can access it on the respective
branch as `name.field`. For example, when matching a `List`, we gain access to
its head and tail as `list.head` and `list.tail`:

```
List.sum (list: List Nat) : Nat {
  match List list {
    nil  => Nat.zero
    cons => Nat.add list.head (List.sum list.tail)
  }
}
```

This syntax can be useful in many cases, but here this function would be better expressed as:

```
List.sum (list: List Nat) : Nat
List.sum  List.nil             = Nat.zero
List.sum (List.cons head tail) = Nat.add head (List.sum tail)
```

Instead of using a `let` expression like in the `Bool` case above, we can give the matched expression a name inside the `match` expression itself:

```
match List xs = [1 2 3] {
  nil  => Nat.zero
  cons => xs.head
}
```

You may also provide a return type, called motive. Since Kind has dependent
types, the motive has access to the value of the matched variable, allowing you
to return a different type on each branch. For example:

```
match Bool x = Bool.true {
  true  => "i'm a string"
  false => 42
}: if x { String } else { U60 }
```

Here, Kind evaluated `if x then String else Nat` with each possible value of `x` (in this case, `true` or `false`) to determine the return type of each branch.
Notice that the `true` case and the `false` case return different types. This
is very useful for theorem proving. For example:

```
DoubleNegation (b: Bool) : Equal Bool (Bool.not (Bool.not b)) b {
  match Bool b {
    true  => ?a
    false => ?b
  }
}
```

To prove this theorem, Kind demands you to provide a proof of
`not not b = b` on both cases. This isn't possible. But if you write a motive:

```
DoubleNegation (b: Bool) : Equal Bool (Bool.not (Bool.not b)) b {
  match Bool b {
    true  => ?a
    false => ?b
  }: Equal Bool (Bool.not (Bool.not b)) b
}
```

Then Kind demands a proof of `not not true = true` on the `?a` branch, and
a proof of `not not false = false` on the `?b` branch. Since these equalities
reduce to `true = true` and `false = false`, you can complete the proof with just `refl`.

#### TODO: Write a document explaining theorem-proving concepts using Kind


Inspection
----------

```
?name
```

We can ask the type-checker for what it infers that the type of an expression should be by using the inspection syntax, which is written as `?` and optionally followed by a name to help you find it. Goals are extremely useful when developing algorithms and proofs, as they allow you to keep a part of your program incomplete while you work on the rest. They also allow you to inspect the context and expected type on that part. For example, if you write:

```
Add (a: Nat) (b: Nat) : Nat
Add  Nat.zero         b = ?i0
Add (Nat.succ a.pred) b = ?i1
```

Kind will display:

```
Inspection.
- Goal: Nat
Context:
- b : Nat
On 'your_file.kind2':
  2 | Add  Nat.zero         b = ?i0

Inspection.
- Goal: Nat
Context:
- a.pred : Nat
- b      : Nat
On 'your_file.kind2':
  3 | Add (Nat.succ a.pred) b = ?i1
```

Notice how it shows the type it expects on each inspect (`Nat`), as well as the
context available there. Note also, how the context in the `Nat.succ` case also has the variable `a.pred`, that was bound in the rule with the value from inside the `Nat.succ` constructor.

Hole
----

```
_
```

A `hole` is written as a single underscore. It stands for "complete this for me".
Holes are extremely useful to let Kind fill the "obvious" parts of your
program for you. Without holes, Kind would be extremely more verbose. For
example, the list of lists `[[1 2] [3 4]]`, in its full form, would be:

```
(List.cons (List U60) (List.cons U60 1 (List.cons U60 2 (List.nil U60)))
(List.cons (List U60) (List.cons U60 3 (List.cons U60 4 (List.nil U60)))
(List.nil (List U60)))
```

With holes, you can write just:

```
(List.cons _ (List.cons _ 1 (List.cons _ 2 (List.nil _)))
(List.cons _ (List.cons _ 3 (List.cons _ 4 (List.nil _)))
(List.nil _))
```

Of course, since these arguments that we filled with holes are all implicit, we could simply not write them, like in:

```
(List.cons (List.cons 1 (List.cons 2 List.nil))
(List.cons (List.cons 3 (List.cons 4 List.nil))
List.nil)
```

But underneath the hood, what an implicit argument actually does is automatically put holes in these places.

Of course, in this particular example, we can just use the list notation directly:

```
[[1 2] [3 4]]
```

But in this list syntax, as well as in many others, the holes would also be put there automatically.

Kind's holes work by unifying immediate values only. That is, whenever
you'd have an error such as:

```
Expected: Bool
Detected: _
```

Kind will replace `_` by `Bool` and try again. That is all it does, which
means it does no complex unification. Turns out this covers all cases required
to keep Kind's syntax clean and free from bloated type annotations, even
things like equality rewrites and vectors, while also keeping the type-checker
fast. But if you want more advanced hole-filling features as seen in Agda or
Idris, Kind won't do that and you need explicit types.

Logging
-------

```
(HVM.log logged result)
```

The logging feature of the runtime implementation is exposed as a Kind function. It allows you to print a string at runtime without using the `IO` type. It is very useful for debugging and inspecting the execution of an algorithm. However, because it causes a hidden side-effect, ignoring the type system, it should be used carefully and not be present on finished programs. Note that the printing happens when this function is reduced during runtime, which may not happen at the trivially expected time, may change if Kind is being run on multithreaded mode and may also happen when executing the type-checker since it's implemented as a special Kind program.


Do notation
-----------

```
do MonadicType {
  statements
}
```

Do blocks, or the do-notation, is extremely useful to "flatten" cascades of
callbacks. In Kind, a `do` block requires the name of a monad and a series
of statements. Inside it, you may use `ask x = monad` to bind the result of a
monadic computation to the name `x`. You may also write `ask monad` directly to
execute a monadic computation and drop the result. You can also use local
`let`s, as you'd expect. It will then be converted to a series of applications
of `Monad.bind` and `Monad.pure`. For example,

```
ask_user_age: IO U60
  do IO {
    ask name = IO.prompt "What is your name?"
    ask IO.output (String.concat "Welcome, " name)
    ask year = IO.prompt "When you were born?"
    let age = 2020 - (Maybe.default (U60.read_decimal year) 0)
    return Maybe.default (U60.read_decimal age) 0
  }
```

Is converted to:

```
IO.bind ((IO.prompt "What is your name?") (name =>
IO.bind ((IO.output (String.concat "Welcome, " name)) (_ =>
IO.bind ((IO.prompt "When you were born?") (year =>
let age = 2020 - (Maybe.default (U60.read_decimal year) 0)
IO.pure (Maybe.default (U60.read_decimal age) 0)
))))))
```

To be able to use the `do` syntax with a type, it must implement a function called `bind` which does the monadic bind operation and a function called `pure`, which should simply return the value encapsulated by the monad. Note that this syntax doesn't actually require your operation to be a monad, but you should not implement these functions in case your operation is not monadic. In the future we may change this to actually require a proof of the monad properties.


Numbers and operators
---------------------

Currently, Kind has one primitive number type, U60, the unsigned integers of length 60. When writing numbers in an expression like `583` and `34957`, they are interpreted as U60. These numbers are compiled into very efficient machine code and should be used whenever you need performant number operations.

There are also some primitive number operators that work on U60s, that are used like any other function, except the `()` are always needed. They are:

Operation      | Syntax
---------      | ------
Addition       | (+  a b)
Subtraction    | (-  a b)
Multiplication | (*  a b)
Division       | (/  a b)
Remainder      | (%  a b)
Shift left     | (<< a b)
Shift right    | (>> a b)
Bitwise and    | (&  a b)
Bitwise or     | (|  a b)
Bitwise xor    | (^  a b)
Greater than   | (>  a b)
Greater equal  | (>= a b)
Less than      | (<  a b)
Less equal     | (<= a b)
Equal          | (== a b)
Not equal      | (!= a b)

Note that all of these are of type `U60 -> U60 -> U60`, that is, they all return a number. For example, `(== 2 2)` returns `1` and `(<= 30 4)` returns `0`. If you need functions that return a boolean, check the Wikind repository for things like `U60.equal (a: U60) (b: U60) : Bool`.

#### TODO: Write about U120 compilation for kindelia

Char literal
------------

```
'a'
```

A character literal is an ascii character surrounded with `''`. Characters are currently implemented as U60 numbers, which makes them fast, but wastes a lot of space since only 8 bits are used at most.

String literal
--------------

```
"Hello"
```

A string literal is a sequence of ascii characters surrounded with `""`. Strings aren't primitives in Kind either. Instead, they are currently implemented as:

```
String : Type
String.nil : String
String.cons (head: Char) (tail: String) : String
```

String literals are expanded into a sequence of `String.cons`. For example, `"Hello"` is desugared to `String.cons 'H' (String.cons 'e' (String.cons 'l' (String.cons 'l' (String.cons 'o' String.nil))))`.

Sigma type
----------

```
[name: type] -> body
```

Sigma literals can be used to write sigma types or dependent pairs. They are
expanded to:

```
Sigma type (name => body)
```

With `Sigma` in Wikind defined as `Sigma (a: Type) (b: a -> Type) : Type
`.
In the same way that forall (aka Pi, aka the dependent function type) can be read as "forall", `Sigma`s can be read as "there exists". So, for example, the program below:

```
ThereIsEvenNat : [x: Nat] (Equal (Nat.mod x Nat.two) Nat.zero)
  $Nat.zero Equal.refl
```

Can be read as `there exists an (x: Nat) such that x mod 2 is equal to zero`. Sigmas can also be used to create subset types:

```
EvenNat: Type
  [x: Nat] (Equal (Nat.mod x Nat.two) Nat.zero)
```

New sigma
---------

```
$val_a val_b
```

`Sigma.new` literals can be used to create values for sigma types, or dependent pairs. They are
expanded to:

```
(Sigma.new _ _ val_a val_b)
```

With `Sigma.new` defined as `Sigma.new <a: Type> <b: a -> Type> (fst: a) (snd: b fst) : Sigma a b` in Wikind.

List literal
------------

```
[1, 2, 3]
```

The syntax above expands to:

```
(List.cons 1 (List.cons 2 (List.cons 3 List.nil)))
```

The `,` is optional.
