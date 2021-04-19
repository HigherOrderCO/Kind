Beyond inductive datatypes: exploring Self types
================================================

[Kind](https://github.com/uwu-tech/kind) is a **proof**gramming language that
can be used to define inductive datatypes and prove mathematical theorems by
induction, just like other proof assistants like Coq, Agda, Idris, Lean. Unlike
these, though, Kind doesn't include a complex native inductive datatype system.
Instead, it extends type-theory with a very simple primitive, `Self`, which
empowers the core language just enough to allow inductive datatypes to be
encoded with native lambdas. But can it go beyond? In this post, I present some
creative ways to `Self` to implement "super inductive" datatypes that are simply
impossible in conventional proof assistants.

A quick recap of Self-Types in Kind
-----------------------------------

To get started, let's recap how Self-Types work in Kind. Let's start by defining
the `Nat` type, a simple recursive function, and an inductive proof:

```javascript
// A Natural Number is either zero, or the successor of another Natural Number
type Nat {
  zero
  succ(pred: Nat)
}

// A recursive function that removes all `succ` constructors
destroy(a: Nat): Nat
  case a {
    zero: Nat.zero
    succ: destroy(a.pred)
  }

// An inductive proof that destroying a natural number results in zero
destroy_theorem(a: Nat): destroy(a) == 0
  case a {
    zero: refl
    succ: destroy_theorem(a.pred)
  }!
```

This should be familiar to a reader used to traditional proof assistants. For
comparison, here is the same program in Agda:

```agda
data Nat : Set where
  zero : Nat
  succ : (pred : Nat) -> Nat

destroy : Nat -> Nat
destroy zero = zero
destroy (succ pred) = destroy pred

destroy-theorem : (a : Nat) -> destroy(a) == 0
destroy-theorem zero = refl
destroy-theorem (succ pred) = destroy-theorem pred
```

The algorithms are the same. Under the hoods, though, things are very different.
When you declare a datatype in Agda, it will add the constructors `zero` and
`succ` to the global scope. These constructors are atomic, they can't be broken
down into smaller pieces.

In `Kind`, something different happens: the `type` syntax is translated to
top-level definitions that represent the datatype using raw lambdas. Then, the
`case` expressions are translated to raw function applications. After this
"desugaring" process, the program above becomes: 

```javascript
// Natural numbers                            
Nat: Type
  self(P: Nat -> Type) ->
  (zero: P(Nat.zero)) ->
  (succ: (pred: Nat) -> P(Nat.succ(pred))) ->
  P(self)

// The zero constructor of Nat
Nat.zero: Nat
  (P, zero, succ) zero // same as: "λP. λzero. λsucc. zero"

// The succ constructor of Nat
Nat.succ(pred: Nat): Nat
  (P, zero, succ) succ(pred) // same as: "λP. λzero. λsucc. (succ pred)"

// A recursive function that removes all `succ` constructors
destroy(a: Nat): Nat
  a((a) Nat)(Nat.zero, (a.pred) destroy(a.pred))

// An inductive proof that destroying a natural number results in zero
destroy_theorem(a: Nat): destroy(a) == Nat.zero
  a((a) destroy(a) == Nat.zero, refl, (a.pred) destroy_theorem(a.pred))

// Syntax notes:
// - "self(x: A) -> B" is a self-forall (self-dependent function type)
// - "(f, x) f(f(x))" is a lambda (as in, "λf. λx. (f (f x))")
// - "." is just a name-valid character (so "foo.bar" is just a name)
// - You can omit these arrows, but I'm trying to make the syntax look conventional
```

In other words, after parsing, the first program is exactly equivalent to this
one. If you wanted to, you could completely ignore the `type` / `case` syntaxes
and just encode your datatypes / pattern-matches with lambdas / applications
directly. Doing so will make your programs more verbose, but will grant you
the power to do things that were otherwise impossible. Let's explore some of 
these possibilities now!

Possibility #0: smart constructors
----------------------------------

To motivate this example, let's port [Agda's `Int` type](https://github.com/agda/agda/blob/master/src/data/lib/prim/Agda/Builtin/Int.agda) to Kind:

```javascript
// Int.pos(n) represents +n
// Int.neg(n) represents -(n + 1)
type Int {
  pos(n: Nat)
  neg(n: Nat)
}
```

The idea is that an `Int` is either a positive `Nat` or a negative `Nat`. In
order to avoid having two zeros, the `neg` constructor starts as `-1`.
This works, but it results in complex, confusing arithmetic functions, as we
have to cautiously consider many cases of signs. For example, here is `negate`
and `add`, ported from `Agda`:


```javascript
Int.negate(a: Int): Int
  case a {
    pos: case a.nat {
      zero: Int.pos(Nat.zero)
      succ: Int.neg(a.nat.pred)
    }
    neg: Int.pos(Nat.succ(a.nat))
  }

Int.add(a: Int, b: Int): Int
  case a b {
    pos pos: Int.pos(Nat.add(a.nat, b.nat))
    neg neg: Int.neg(Nat.succ(Nat.add(a.nat, b.nat)))
    pos neg: if b.nat <? a.nat
      then Int.pos((a.nat - b.nat) - 1)
      else Int.neg(b.nat - a.nat)
    neg pos: Int.add(Int.pos(b.nat), Int.neg(a.nat))
  }
```

Disgusting, right? The odds I've inverted some sign or off-by-one error when
porting this code are great, and I don't want to prove it either.

An alternative would be to represent an `Int` as a pair of two `Nat`s, and the
integer is represented by the first natural number subtracting the second
natural number.

```javascript
// Int.val(a, b) represents `a - b`
type Int {
  new(pos: Nat, neg: Nat)
}
```

In this representation, algorithms become very simple. For example, we could
negate an `Int` by just swapping its components, and we could add two `Int`s by
adding each component:

```javascript
Int.neg(a: Int): Int
  case a {
    new: Int.new(a.neg, a.pos)
  }

Int.add(a: Int, b: Int): Int
  case a b {
    new new: Int.new(Nat.add(a.pos, b.pos), Nat.add(a.neg, b.neg))
  }
```

This is beautiful. But while this type is great for algorithms, it
breaks theorem proving. That's because there are multiple representations of the
same integer. For example, `3` can be written as `Int.new(3, 0)`, `Int.new(4,
1)`, `Int.new(5, 2)` and so on. This is bad. We could solve this issue by adding
an extra field enforcing that either `pos` or `neg` is `zero`:

```javascript
// Int.val(a, b) represents `a - b`
type Int {
  new(pos: Nat, neg: Nat, eq: Either(Equal(Nat,pos,0), Equal(Nat,neg,0))
}
```

This would be technically correct, but algorithms would become considerably
worse, as we'd need to prove that `eq` still holds every time we construct and
`Int`. This is terrible.  What if we could, instead, have an `Int.new` 
constructor that automatically "canonicalized itself", such that 
`Int.new(5, 2)` **reduced to** `Int.new(3, 0)`, making both equal 
**by definition**?

A friend of mine, Tesla Zhang, has some unpublished work, where he uses this
idea, which he calls "inductive types with conditions", to encode higher
inductive types (HITs) and the cubical path type. I'm a simpler person, so I just
call this "smart constructors". The concept is implemented in the Arend language 
with a nice syntax, and the idea was invented individually by me and the 
language authors.  

Kind doesn't have a nice syntax for smart constructors yet. But the surprising
fact is we can still encode them by "hacking" the Self encodings generated by
the parser! Let's start by asking Kind to display the self-encoding of `Int`
with `Kind Int --show`:

```javascript
Int: Type
  self(P: Int -> Type) ->
  (new: (pos:Nat) -> (neg:Nat) -> P(Int.new(pos,neg))) ->
  P(self)

Int.new(pos: Nat, neg: Nat): Int
  (P, new) new(pos, neg)
```

As you can see, the `Int.new` constructor isn't an atomic value, but instead, it
is just a regular definition. Does that mean we can add computations inside that
definition? Sure! And that is exactly what we are going to do:

```javascript
Int.new(pos: Nat, neg: Nat): Int
  (P, new)
  case pos {
    zero: new(Nat.zero, neg) // halts
    succ: case neg {
      zero: new(Nat.succ(pos.pred), Nat.zero) // halts
      succ: Int.new(pos.pred, neg.pred)(P, new) // recurses
    }!
  }: P(Int.new(pos, neg))
```

This new "smart constructor" does exactly what it should, decreasing both values
recursively until one of them is zero. It is as if we wrote this hypothetical
syntax:

```javascript
type Int {
  new(pos: Nat, neg: Nat) with {
    zero zero: new(zero, zero)             // halts
    zero succ: new(zero, succ(neg.pred))   // halts
    succ zero: new(succ(pos.pred), zero)   // halts
    succ succ: Int.new(pos.pred, neg.pred) // recurses
  }
}
```

And, yes: it just works! Different ways to represent the same number become
equal by definition. So, for example, we can prove that `Int.new(5, 2) ==
Int.new(3, 0)` with just `refl`:

```javascript
same: Int.new(5, 2) == Int.new(3, 0)
  refl
```

And the algorithms become as clean as you'd expect. Check them on the
[Kind/base/Int](https://github.com/uwu-tech/Kind/tree/master/base/Int)
directory!

This idea, I believe, can be generalized to represent quotient types; see Aaron
Stump's [Quotients by Idempotent Functions in
Cedille](https://homepage.cs.uiowa.edu/~cwjnkins/assets/MJS19_Quotients-Idempotent-Functions-Cedille.pdf).

Possibility #1: conditional constructors
----------------------------------------

In [this paper](https://arxiv.org/pdf/2103.15408.pdf), Tesla Zhang (again!)
proposes a different encoding of indexed datatypes. He starts by presenting the
usual definition of `Vector` in Agda:

```agda
data Vector (A : Type) : (len : Nat) -> Type where
  vnil  : Vector A zero
  vcons : (len : Nat) -> (head : A) -> (tail : Vector A len) -> Vect A (succ len)
```

And then proposes, instead, a definition that, adapted, looks like this:

```agda
data Vector (A : Type) (len : Nat) : Type
| A zero        => vnil
| A (succ pred) => vcons (head : A) (tail : Vect A pred)
```

What this is saying is that the very shape of a Vector depends on the value
of `len` (its length). A Vector with length `0` has only one constructor:
`vnil`. A Vector with length `succ(n)` has also only one constructor: `vcons`,
with a `head` and a `tail`. Tesla argues this is an easier way to implement
indexed datatypes since it doesn't require dealing with indices. For Kind, that
isn't relevant, as we already have inductive datatypes from `Self` (which, I
argue, is even easier to implement). But this encoding has another benefit: 
pattern-matching only demands the required cases. If you pattern-match a vector
with `len > 0`, you don't need to provide the `nil` case at all, which is very
convenient as you don't need to prove it is unreachable. Of course, if the `len`
is unknown, then you won't be able to pattern-match it at all until you 
pattern-match on the `len` itself.

How can we do it with `Self` types? Let's start defining the conventional
indexed `Vector` datatype, using the built-in syntax.

```javascript
type Vector (A: Type) ~ (len: Nat) {
  nil                                          ~ (len = Nat.zero)
  cons(len: Nat, head: A, tail: Vector(A,len)) ~ (len = Nat.succ(len))
}
```

This has the same information as Agda's definition, although with a slightly
different syntax. We can ask Kind to display its self-encoding by typing `kind
Vector --show` on the terminal. The result, adapted for readability, is:

```javascript
Vector(A: Type, len: Nat): Type
  self(P: Nat -> Vector(A,len) -> Type) ->
  (nil: P(0, nil(A))) ->
  (cons: (len: Nat) -> (head: A) -> (tail: Vector(A,len)) -> P(Nat.succ(len), cons(A,len,head,tail))) ->
  P(len, self)

nil(A: Type): Vector(A, Nat.zero)
  (P, nil, cons) nil

cons(A: Type, len: Nat, head: A, tail: Vector(A, len)): Vector(A, Nat.succ(len))
  (P, nil, cons) cons(len,head,tail)
```

This isn't very easy on the eye, but you don't need to understand how this
translation works. The only thing that matters is that `Vector` is, again, just
a regular definition, so we can "hack" it too by adding a computation inside:

```javascript
Vector(A: Type, len: Nat): Type
  case len {
    zero:
      self(P: (self: Vector(A,0)) Type) ->
      (nil: P(nil(A))) ->
      P(self)
    succ:
      self(P: (self: Vector(A,Nat.succ(len.pred))) Type) ->
      (cons: (head: A) -> (tail: Vector(A, len.pred)) -> P(cons(A,len.pred,head,tail))) ->
      P(self)
  }

nil(A: Type): Vector(A, 0)
  (self, nil) nil

cons(A: Type, len: Nat, head: A, tail: Vector(A, len)): Vector(A, Nat.succ(len))
  (self, cons) cons(head, tail)
```

Here, we pattern-match on `len` inside of the `Vector` definition, in order to
return two different types. When `len` zero, `Vector` becomes a datatype only
the `nil` constructor. When `len` is `succ(n)`, it becomes a datatype with only
the `cons` constructor. It is as if we wrote this hypothetical syntax:

```javascript
type Vector(A: Type, len: Nat) {
  case len {
    zero: nil
    succ: cons(head: A, tail: Vector(A, len.pred))
  }
}
```

Is that enough to implement Tesla's datatypes? Yes, and it behaves exactly as
expected! We can construct Vectors using `cons`:

```javascript
my_vec: Vector(Nat, 3)
  cons!!(100, cons!!(200, cons!!(300, nil!)))
```

And we can destruct using the `case` syntax, which will work since the
desugaring is the same:

```javascript
head(A: Type, len: Nat, vec: Vector(A, Nat.succ(len))): A
  case vec {
    cons: vec.head
  }
```

The `head` function magically type-checks with only the `cons` case, because
Kind knows that the `size` is not `0`. If the size of the vector was unknown:

```javascript
head(A: Type, len: Nat, vec: Vector(A, len)): Maybe(A)
  case vec {
    nil: ?a
    cons: ?b
  }: A
```

Kind would complain that it can't infer the type of `case`. We can't
pattern-match on `vec` on the body of `head` at all. But we can if we
pattern-match on `len` first and then specialize the type of `vec` with `with`:

```javascript
head(A: Type, len: Nat, vec: Vector(A, len)): Maybe(A)
  case len with vec {
    zero: case vec {
      nil: none
    }
    succ: case vec {
      cons: some(vec.head)
    }
  }!
```


Kind graciously demands only the `nil` case on the `zero` branch and only the
`cons` case on the `succ` branch!

To be honest, I'm surprised it works so well, given that I wasn't even
aware of this encoding when I implemented the language. In a future, I may
update Kind to incorporate Tesla's syntax for this kind of datatype, but the
fact you can already do that by manually tweaking the Self-encodings is
beautiful.

Possibility #2: higher inductive types
--------------------------------------

From ncatlab, *"Higher inductive types (HITs) are a generalization of inductive
types which allow the constructors to produce, not just points of the type being
defined, but also elements of its iterated identity types."* In simpler words,
it is as if a datatype could have constructors with types that aren't
necessarily the same as the type being defined, but, instead, equalities. For
example, we could define a type for "unordered pairs" as:

```agda
data UnordPair (A : Set) : Set where
  make : (a : A) -> (b : A) -> UnordPair A
  swap : make a b == make b a
```

This pair type has an extra constructor, `swap`, that enforces that `(a,b) ==
(b,a)`. Because of that, whenever we pattern-match on `UnordPair`, we must prove
that the result will not depend on the order of the arguments. As such, it is
impossible to, for example, write the function "first" for it; after all, there
is no such a thing as the first element of an unordered pair. But it is possible
to write the function "sum", because `a + b == b + a`, so the order doesn't
matter when adding both values.

Can we encode `UnordPair` with Self? Well yes, but actually no. Let's start by
encoding it without the `swap` constructor:

```javascript
UPair(A: Type): Type
  self(P: UPair(A) -> Type) ->
  (make: (a: A) -> (b: A) -> P(UPair.make(A, a,b))) ->
  P(self)

UPair.make(A: Type, a: A, b: A): UPair(A)
  (P, make) make(a, b)
```

This is just a regular pair. Now, let's try to hack it again and add the swap
constructor:

```javascript
UPair(A: Type): Type
  self(P: UPair(A) -> Type) ->
  (make: (a: A) -> (b: A) -> P(UPair.make(A, a,b))) ->
  (swap: (a: A) -> (b: A) -> Equal(_, make(a,b), make(b,a))) ->
  P(self)

UPair.make(A: Type, a: A, b: A): UPair(A)
  (P, make, swap) make(a, b)
```

As you can see, all we did is add a new constructor, `swap`, that returns an
`Equal(...)` instead of a `P(...)`. That constructor is supposed to, whenever we
pattern-match an `UPair`, demand a proof that the value returned by the `make`
branch doesn't depend on the order of `a` and `b`. Does that work? No! That's
because Kind doesn't have heterogeneous equality, and `make(a,b)` and
`make(b,a)` have different types (`P(UPair.make(A, a,b))` and
`P(UPair.make(A, b,a))`). We can make it work, though, if we create a
non-inductive version of UPair:

```javascript
UPair(A: Type): Type
  self(P: Type) ->
  (make: (a: A) -> (b: A) -> P) ->
  (swap: (a: A) -> (b: A) -> Equal(P, make(a,b), make(b,a))) ->
  P

UPair.make(A: Type, a: A, b: A): UPair(A)
  (P, make, swap) make(a, b)
```

This definition allows us to create unordered pairs, and we can pattern-match on
them, as long as the result doesn't depend on the order of the elements. For
example, we can return a constant:

```javascript
Test: Nat
  let upair = UPair.make!(1, 2)
  case upair {
    make: 4
    swap: refl
  }
```

And we can add both elements:

```javascript
Test: Nat
  let upair = UPair.make!(1, 2)
  case upair {
    make: upair.a + upair.b
    swap: Nat.add.comm(upair.a, upair.b)
  }
```

But we can't get the first element:

```javascript
Test: Nat
  let upair = UPair.make!(1, 2)
  case upair {
    make: upair.a
    swap: ?a
  }
```

As that would demand a proof that `1 == 2`.

While this kinda works, we can't prove the induction principle for `UPair`'s,
because we had to make the Self-encoding non-inductive due to the lack of
heterogeneous equality. Moreover, even if we could, we'd still not be able to
prove that `UPair.make!(a,b) == UPair.make!(b,a)` because the language lacks
`funext`. If we did have both heterogeneous equality and funext, though, then
we'd be able to encode higher inductive types as done in cubical languages. It
is an open problem to have these without huge structural changes on Kind's core
language. If you have any clue on how that could be done, please let me know! 


Possibility #3: intervals and paths
-----------------------------------

The main insight is that we can encode the Interval type and the Path type as
Self-encodings that refer to each other. The Interval type is like a boolean,
but with an extra constructor of type `i0 == i1` forcing that, in order to
eliminate an interval, both cases must be equal. The Path type proposes that
two values `a, b : A` are equal if there exists a function `t : I -> A` such
that `t(i0) = a` and `t(i1) = b`. In other words, it is the equivalent of:

```agda
data I : Set where
 i0 : I
 i1 : I
 ie : Path A i0 i1

data Path (A: I -> Set) : (A i0) -> (A i1) -> Set where
  abs : (t : (i: I) -> A i) -> Path A (t i0) (t i1)
```

Here is it:

```javascript
// The Interval type:
// Γ ⊢
// ------------
// Γ ⊢ I : Type

I: Type
  i(P: I -> Type) ->
  (i0: P(i0)) ->
  (i1: P(i1)) ->
  (ie: Path(P, i0, i1)) ->
  P(i)

// The i0 interval:
// Γ ⊢
// ----------
// Γ ⊢ i0 : I

i0: I
  (P, i0, i1, ie) i0

// The i1 interval:
// Γ ⊢
// ----------
// Γ ⊢ i1 : I

i1: I
  (P, i0, i1, ie) i1

// Interval equality:
// Γ ⊢
// -----------------
// Γ ⊢ ie : i0 == i1

ie: Path((i) I, i0, i1)
  (P, abs) abs((i) i)
  
// The Path type:
// Γ, i : Type ⊢ A(i) : Type
// Γ           ⊢ a    : A(i)
// Γ           ⊢ b    : A(i)
// -------------------------------
// Γ ⊢ Path(A, a, b) : Type

Path(A: I -> Type, a: A(i0), b: A(i1)) : Type
  path(P: (a: A(i0)) -> (b: A(i1)) -> Path(A, a, b) -> Type) ->
  (abs: (t: (i:I) -> A(i)) -> P(t(i0), t(i1), Path.abs(A, t))) ->
  P(a, b, path)

// Path abstraction:
// Γ ⊢ A            Γ, i : I ⊢ t : A
// ---------------------------------
// Γ ⊢ (i) t : Path(A, t(i0), t(i1))

Path.abs (A: I -> Type) (t: (i:I) -> A(i)): Path(A, t(i0), t(i1))
  (P, abs) abs(t)

// Path application:
// Γ ⊢ e : Path(A, a, b)
// Γ ⊢ i : I
// ---------------------
// Γ ⊢ e(i) : A 

app(A: I -> Type, a: A(i0), b: A(i1), e: Path(A, a, b), i: I): A(i)
  i(A, a, b, e)

// Path left:
// Γ ⊢ a : A
// Γ ⊢ b : B
// Γ ⊢ e : Path A a b
// --------------------------
// Γ ⊢ p0(a,b,e) : e(i0) == a

p0(A: Type, a: A, b: A, P: A -> Type, e: Path((i) A,a,b), p: P(app((i) A,a,b,e,i0))): P(a)
  e((x, y, e) P(app((i) A,x,y,e,i0)) -> P(x), (t) (p) p, p)

// Path right:
// Γ ⊢ A : Type
// Γ ⊢ a : A
// Γ ⊢ b : B
// Γ ⊢ e : Path A a b
// --------------------------
// Γ ⊢ p1(a,b,e) : e(i1) == b

p1(A: Type, a: A, b: A, P: A -> Type, e: Path((i) A,a,b), p: P(app((i) A,a,b,e,i1))): P(b)
  e((x, y, e) P(app((i) A,x,y,e,i1)) -> P(y), (t) (k) k, p)

// Path reflexivity:
// refl : ∀ {ℓ} {A : Set ℓ} {x : A} → Path A x x
// refl {x = x} = λ i → x

refl(A: Type, x: A): Path((i) A, x, x)
  (P, abs) abs((i) x)

// Path congruence:
// cong : ∀ {ℓ} {A : Set ℓ} {x y : A} {B : A → Set ℓ} (f : (a : A) → B a) (p : x ≡ y) → PathP (λ i → B (p i)) (f x) (f y)
// cong f p i = f (p i)

cong
  (A: Type) ->
  (B: A -> Type) ->
  (x: A) ->
  (y: A) ->
  (f: (a: A) -> B(a)) ->
  (p: Path((i) A, x, y)) ->
  : Path((i) B(app((i) A, x, y, p, i)), f(x), f(y))
  (P, abs) abs((i) f(app((i) A, x, y, p, i)))

// Path symmetry: (TODO: depends on `neg`)
// sym : ∀ {ℓ} {A : Set ℓ} {x y : A} → x ≡ y → y ≡ x
// sym p = λ i → p (~ i)

// Examples

type Bool {
  true
  false
}

// We can prove that `true = true` by using a constant
tt0: Path((i) Bool, Bool.true, Bool.true)
  Path.abs((i) Bool, (i) Bool.true)

// We can prove that `true = true` by pattern-matching
tt1: Path((i) Bool, Bool.true, Bool.true)
  Path.abs((i) Bool, (i)
    case i {
      i0: Bool.true
      i1: Bool.true
      ie: refl<Bool>(Bool.true)
    }

// We can't prove that `true = false`!

// The fact that the images of two equal elements are equal:
// Γ ⊢ a : A
// Γ ⊢ b : A
// Γ ⊢ f : A → B
// Γ ⊢ p : Path A a b
// -------------------------------------
// Γ ⊢ Path.abs((i) f (p i)) : Path B (f a) (f b)
img(A: Type, B: Type, a: A, b: A, f: A -> B, p: Path((i) A, a, b)): Path((i) B, f(a), f(b))
  Path.abs((i) B, (i) f(app((i) A,a,b,p,i)))

// Function extensionality:
// Note that this is eta-expanded as `(x) f(x) = (x) g(x)` because Formality
// doesn't eta-reduce for performance and code-simplicity reasons, but this
// could easily be added to the language to have `f = g`.
funext
  (A: Type) ->
  (B: A -> Type) ->
  (f: (x: A) -> B(x)) ->
  (g: (x: A) -> B(x)) ->
  (h: (x: A) -> Path((i) B(x), f(x), g(x))) ->
  : Path((i) (x: A) -> B(x), (x) f(x), (x) g(x))
  Path.abs((i) (x:A) -> B(x))((i) (x) app((i) B(x), f(x), g(x), h(x), i))
```

Sadly, while we can prove `funext` for this type, we can't prove `transp`, even
though it is true. Finding a simple way to extend Kind's core language to allow
`transp` to be proved internally is another open problem.
