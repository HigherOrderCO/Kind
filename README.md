# Kind

A minimal, efficient and practical proof and programming language. Under the hoods, it is basically Haskell, except purer and with dependent types. That means it can handle mathematical theorems just like Coq, Idris, Lean and Agda. On the surface, it aims to be more practical and looks more like TypeScript. Compared to other proof assistants, Kind has:

1. The smallest core. Check this [700-LOC](https://github.com/moonad/FormCoreJS/blob/master/FormCore.js) reference implementation. It has the whole type system!

2. Novel type-level features. Check [this article](https://github.com/uwu-tech/Kind/blob/master/blog/1-beyond-inductive-datatypes.md) on super-inductive datatypes.

3. An accessible syntax that makes it less scary. Check [SYNTAX.md](https://github.com/uwu-tech/Kind/blob/master/SYNTAX.md).

4. A complete bootstrap: the language is implemented in itself. Check it [here](https://github.com/uwu-tech/Kind/tree/master/base/Kind).

5. Efficient real-world compilers. Check [http://uwu.tech/](http://uwu.tech) for a list of apps. (WIP)

Usage
-----
![npm](https://img.shields.io/npm/v/kind-lang)  [![telegram](https://img.shields.io/badge/chat-on%20telegram-blue)](https://t.me/formality_lang)

0. Choose a release. We'll use JavaScript here but ChezScheme is also [available](/INSTALL.md).

1. Install Kind using `npm`:

```bash
npm i -g kind-lang
```

2. Save the file below as `Main.kind`:

```
Main: IO(Unit)
  IO {
    IO.print("Hello, world!")
  }
```

3. Type-check it:

```
kind Main
```

4. Run it:

```
kind Main --run
```

5. Have fun!

Things you can do with Kind:
----------------------------

### Compile programs and modules to several targets.

Kind has an universal compiler that targets several back-ends. Just find what you need on Kind, and compile it with `kind Main --lang`. For example, to generate a QuickSort function in JavaScript, just type `kind List.quicksort --js`. You may never write code in any other language! Available targets: `--js`, `--scm`. Several more will be available this month.

### Create live applications.

Kind has an interconnected back-end that allows you to create rich, interactive applications without ever touching databases, TCP packets or messing with apis. Just add a file to `base/App` and it will be available on [http://uwu.tech/](http://uwu.tech). You can fork entire applications - not just the front-end, but all of it, back-end, database, and networking - in seconds.

### Prove theorems.

No, theorems are not scary things mathematicians do. For programmers, they're more like unit tests, except they can involve symbols, allowing you to cover infinitely many test cases. If you like unit tests, you'll love theorems. To learn more, check [THEOREMS.md](THEOREMS.md).

### Deploy Smart-Contracts.

(TODO) *Ethereum: we're coming for you.*

Examples
--------

### Some programs

```javascript
// A 'Hello, world!"
Main: IO(Unit)
  IO {
    IO.print("Hello, world!")
  }
```

```javascript
// Quicksort (using recursion)
quicksort(list: List<Nat>): List<Nat>
  case list {
    nil:
      []
    cons:
      fst = list.head
      min = filter!((x) x <? list.head, list.tail)
      max = filter!((x) x >? list.head, list.tail)
      quicksort(min) ++ [fst] ++ quicksort(max)
  }
```

```javascript
// List iteration (using folds)
some_text: String
  List.foldl!!("",
    (str, result) 
      str = String.to_upper(str)
      str = String.reverse(str)
      result | str,
    ["cba","fed","ihg"])
```

```javascript
// List iteration (using fors)
some_text: String
  result = ""
  for str in ["cba","fed","ihg"] with result:
    str = String.to_upper(str)
    str = String.reverse(str)
    result | str
  result
```

```c
// Map, Maybe, String and Nat sugars
sugars: Nat
  key  = "toe"
  map  = {"tic": 1, "tac": 2, key: 3} // Map.from_list!([{"tic",1}, ...])
  map  = map{"tic"} <- 100            // Map.set!("tic", 100, map)
  map  = map{"tac"} <- 200            // Map.set!("tac", 200, map)
  map  = map{ key } <- 300            // Map.set!(key, 300, map)
  val0 = map{"tic"} <> 0              // Maybe.default!(Map.get!("tic",map), 0)
  val1 = map{"tac"} <> 0              // Maybe.default!(Map.get!("tac",map), 0)
  val2 = map{ key } <> 0              // Maybe.default!(Map.get!(key, map), 0)
  val0 + val1 + val2                  // Nat.add(val0, Nat.add(val1, val2))
```

```c
// List monadic block: returns [{1,4},{1,5},{1,6},{2,4},...,{3,6}]
my_list: List<Pair<Nat,Nat>>
  List {
    get x = [1, 2, 3]
    get y = [4, 5, 6]
    return {x, y}
  }
```

Check many List algorithms on [base/List](https://github.com/uwu-tech/Kind/tree/master/base/List)!

### Some types

```javascript
// A boolean
type Bool {
  true
  false
}
```

```javascript
// A natural number
type Nat {
  zero
  succ(pred: Nat)
}
```

```javascript
// A polymorphic list
type List <A: Type> {
  nil
  cons(head: A, tail: List<A>)
}
```

```javascript
// A polymorphic pair
type Pair <A: Type, B: Type> {
  new(fst: A, snd: B)
}
```

```javascript
// A polymorphic dependent pair
type Sigma <A: Type, B: A -> Type> {
  new(fst: A, snd: B(fst))
}
```

```javascript
// A polymorphic list with a statically known size
type Vector <A: Type> ~ (size: Nat) {
  nil                                              ~ (size = 0) 
  cons(size: Nat, head: Nat, tail: Vector<A,size>) ~ (size = 1 + size)
}
```

```javascript
// A bounded natural number
type Fin ~ <lim: Nat> {
  zero<N: Nat>               ~ (lim = Nat.succ(N))
  succ<N: Nat>(pred: Fin<N>) ~ (lim = Nat.succ(N))
}
```

```javascript
// The type used in equality proofs
type Equal <A: Type, a: A> ~ (b: A) {
  refl ~ (b = a)
}
```

```javascript
// A burrito
type Monad <M: Type -> Type> {
  new(
    bind: <A: Type, B: Type> M<A> -> (A -> M<B>) -> M<B>
    pure: <A: Type> A -> M<A>
  )
}
```

```javascript
// Some game entity
type Entity {
  player(
    name: String
    pos: V3
    health: Nat
    items: List<Item>
    sprite: Image
  )
  wall(
    hitbox: Pair<V3, V3>
    collision: Entity -> Entity
    sprite: Image
  )
}
```

Check all core types on [base](https://github.com/uwu-tech/Kind/tree/master/base)!

### Some proofs

```javascript
// Proof that `a == a + 0`
Nat.add.zero(a: Nat): a == Nat.add(a, 0)
  case a {
    zero: refl
    succ: apply(Nat.succ, Nat.add.zero(a.pred))
  }!
  ```

```javascript
// Proof that `1 + (a + b) == a + (1 + b)`
Nat.add.succ(a: Nat, b: Nat): Nat.succ(a + b) == (a + Nat.succ(b))
  case a {
    zero: refl
    succ: apply(Nat.succ, Nat.add.succ(a.pred, b))
  }!
  ```

```javascript
// Proof that addition is commutative
Nat.add.comm(a: Nat, b: Nat): (a + b) == (b + a)
  case a {
    zero:
      Nat.add.zero(b)
    succ: 
      p0 = Nat.add.succ(b, a.pred)
      p1 = Nat.add.comm(b, a.pred)
      p0 :: rewrite X in Nat.succ(X) == _ with p1
  }!
```

Check some Nat proofs on [base/Nat/add](https://github.com/uwu-tech/Kind/tree/master/base/Nat/add)!

### A web app

```javascript
// Render function
App.Hello.draw: App.Draw<App.Hello.State>
  (state)
  <div style={"border": "1px solid black"}>
    <div style={"font-weight": "bold"}>"Hello, world!"</div>
    <div>"Clicks: " | Nat.show(state@local)</div>
    <div>"Visits: " | Nat.show(state@global)</div>
  </div>

// Event handler
App.Hello.when: App.When<App.Hello.State>
  (event, state)
  case event {
    init: IO {
      App.watch!(App.room_zero)
      App.new_post!(App.room_zero, App.empty_post)
    }
    mouse_down: IO {
      App.set_local!(state@local + 1)
    }
  } default App.pass!
```

Source: [base/App/Hello.kind](https://github.com/uwu-tech/Kind/blob/master/base/App/Hello.kind)

Live: [http://uwu.tech/App.Hello](http://uwu.tech/App.Hello)
