First class modules with self types
===================================

Sometimes, heterogeneous data types are desirable, even in a strongly typed
language. For example, first-class modules could be represented as maps from
strings to functions. The problem is, the type of these functions may vary:

```
IntLib.add(a: Int, b: Int): Int
  a + b

IntLib.neg(a: Int): Int
  0 - a

IntLib: Module
  {
    "add": Dynamic.new!(IntLib.add) // Int -> Int -> Int
    "neg": Dynamic.new!(IntLib.neg) // Int -> Int
  }

five: Int
  Module.value_of(IntLib, "a")(+2, +3)
```

So how can we represent the `Module` type? Neither `Map<Int -> Int -> Int>` nor
`Map<Int -> Int>` would work, since `add` and `neg` have different types.
Creating a sum type with every possible type of function wouldn't be viable,
either. There is no escape: sometimes we just need a way to talk about dynamic
values, even though we're in a statically typed language.

## The Dynamic type in Agda

In a dependently typed language, one way to have this is to implement a
`Dynamic` type, which is a pair of `type, value`:

```
data Dynamic : Set where
  new : (T : Set) -> (value : T) -> Dynamic
```

This type kind of carries the type of a value together with the value itself.
This, in turn, allows us to create collections of types that vary. For example,
we may store ints and strings in the same `List Dynamic`:

```
elems : List Dynamic
elems = [new Int 3, new String "foo"]
```

We can also make functions to extract the type and the value of a `Dynamic`:

```
typeOf : Dynamic -> Set
typeOf (new T value) = T

valueOf : (dyn : Dynamic) -> typeOf dyn
valueOf (new T value) = value
```

And we can use `valueOf` to recover a typed value from a "static dynamic":

```
dyn : Dynamic
dyn = new Int 7

num : Int
num = valueOf dyn
```

Of course, we can only turn a `Dynamic` into a well-typed value if it has a
statically known type. Otherwise, it becomes useless, since we won't be able to
do anything with it (after all, `Int` functions work on `Int` arguments, not `Dynamic`
arguments, for example). But for first-class modules, `Dynamic` is very handy,
since we're always able to cast module functions to their actual types.

## The Dynamic type in Kind, with Self types

If we blindly translate the program above to Kind, this is what we get:

```
type Dynamic {
  new<T: Type>(value: T)
}

Dynamic.type_of(dyn: Dynamic): Type
  case dyn {
    new: dyn.T
  }

Dynamic.value_of(dyn: Dynamic): Dynamic.type_of(dyn)
  case dyn {
    new: dyn.value
  }

dyn: Dynamic
  Dynamic.new<Nat>(7)

num: Nat
  case dyn {
    new: dyn.value
  }
```

Unlike Agda (which does a lot under the hoods), Kind is a more raw language,
that desugars the syntax above to a very simple core calculus. Because of that,
this program, as is, doesn't type check, since Kind isn't able to tell that the
`T` field of `dyn` is equal to `Nat`, even though that's the case, since `dyn`
is a static value. To solve this, we must get our hands dirty and hack the self
types directly. First, we use `kind <term> --show` to recover the Self encoding
for the `Dynamic` type, and its constructor:

```
$ kind Dynamic --show
Dynamic.Self<P:(:Dynamic) Type> (new:<T:Type> (value:T) P(Dynamic.new(T,value))) P(Dynamic.Self)

$ kind Dynamic.new --show
(T) (value) (P) (new) new(T,value)
```

Then, we replace the `type Dynamic { ... }` syntax sugar by the terms above:

```
Dynamic: Type
  self<P: Dynamic -> Type>
  (new: <T: Type> (value: T) P(Dynamic.new(T, value)))
  P(self)

Dynamic.new<T: Type>(value: T): Dynamic
  (P, new) new(T,value)
```

I must stress that this program is identical to the previous one, we've just
written the Self encoding directly instead of letting the `type Dynamic { ... }`
syntax desugar to it. Now, we hack it by making one small change: we replace
`value : T` in the `new` constructor by `value : type_of(self)`. That's because
`T` is the first field of `self`, so both are equivalent:

```
Dynamic: Type
  self<P: Dynamic -> Type>
  (new: <T: Type> (value: Dynamic.type_of(self)) P(Dynamic.new(Dynamic.type_of(self), value)))
  P(self)

Dynamic.new<T: Type>(value: T): Dynamic
  (P, new) new(T,value)
```

This should work in any language with self types. Since not every reader is
familiar with Kind's syntax, here is the same code in an Agda-like syntax:

```
Dynamic : Set
Dynamic =
  ∀ self (P : Dynamic -> Set) ->
  ∀ (new : (T : Type) -> (value : typeOf self) -> P (new (typeOf self) value)) ->
  P self

new : (T : Set) -> (value : T) -> Dynamic
new T value = \ P new -> new T value
```

With this small change, we're now able to extract values of static dynamics just
like in Agda. In other words, the following program type-checks just fine:

```
dyn: Dynamic
  Dynamic.new<Nat>(7)

dyn: Nat
  case dyn {
    new: dyn.value
  }
```

With this, we're able to represent first-class modules in Kind. The `Dynamic`
and `Module` modules are already on base. Kind users can already use first-class
modules in their codes, and the first snippet in this post works as is!

As a last thought, I wonder if, in a future, we should desugar the `type` 
syntax in a way that does this automatically. I see no reason not to, but
it would increase the complexity of the desugarer considerably.
