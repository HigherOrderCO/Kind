## Kind 1.0.112

- Replace syntax is like rewrite, but equality is reversed

    replace x with e in goal

    This replaces the right side of the equality by the left side in the goal
    This should be more robust since it doesn't need to use mirror and, thus,
    avoids some holes

## Kind 1.0.108

- Allow "for" to be on the left side of a list comprehension

    [for x in [0 to 10] where Nat.is_even(x): x * 2]

## Kind 1.0.104

- Implicit arguments are here!

    ```
    id<A: $Type>(x: A): A
      x

    explicit: Nat
      id<$Nat>(7)

    implicit: Nat
      id(7)
    ```

- Nullary function call can be used instead of `!`

    ```
    let a = Map.new!
    let b = Map.new()
    ```

    This is helpful, because implicit arguments only trigger on calls.

## Kind 1.0.101

- Mutter syntax and improvements on the getter/setter syntax.

  Now you can get/set deeply nested fields.  For example, `list[0][0]` works and
  returns a `Maybe`, and `list[0][0] <- 7` works as expected. Moreover, the `<=`
  syntax can now be used to apply a function to the focused field. Example:

  ```
  type Bar {
    new(map: Map<List<List<Nat>>>)
  }

  type Foo {
    new(bar: Bar)
  }

  Test: Maybe<Nat>
    // Creates a value
    let a = Foo.new(Bar.new({"list": [[1,2,3],[4,5,6],[7,8,9]]}))

    // Applies a function to a nested element
    let a = a@bar@map{"list"}[0][0] <= Nat.mul(10)

    // Gets a nested element
    a@bar@map{"list"}[0][0]
  ```

### Kind 1.0.91

- Forall now demands `->`

- Now you can assign types in lambda parameters as in

    ```
    Test: _
      (x: Nat, y) x + y
    ```

### Kind 1.0.85

- Optimize BBT.for

### Kind 1.0.81

- Add Scheme compilation options to CLI

### Kind 1.0.79

- Socket UDP primitives

    Check Example.udp.sender and Example.udp.receiver

### Kind 1.0.75

- New syntaxes
    
    - Use

        use x = obj
        rest

        // Equivalent to:

        let x = obj
        open x
        rest

    - Let abort
        
        let x = maybe abort k
        rest

        // Equivalent to:

        case maybe as x {
          none: k
          some: 
            let x = x.value
            rest
        }

        // Also works with 'use'

    - List comprehension

        [x * 10 for x in [1, 2, 3]]

        // Returns:

        [10, 20, 30]

    - Map for-in:

        for key:val in map with state:
          loop
        rest

        let state = for key:val in map:
          loop
        rest

    - Function composition:

        f . g

        // Equivalent to:

        Function.comp!!!(f, g)

### Kind 1.0.64

- Monadic block improvements

  - Now it accepts most outside notations (let, open, log, for, etc.)

  - When you use a "for" without a "with", it becomes a monadic loop:
    
      IO {
        for i from 0 to 10:
          IO.print(Nat.show(i))
        for i from 100 to 110:
          IO.print(Nat.show(i))
      }
      
### Kind 1.0.63

- Generic derivers: stringifier, parser, serializer, deserializer. Example:

    ```
    type MyType {
      foo(n: List<Nat>, s: String, m: MyType)
      bar
    } deriving (stringifier, parser, serializer, deserializer)

    Test: _
      IO {
        let val = MyType.foo([1,2,3], "Hello", MyType.bar)

        // Converts to string
        let str = Stringifier.run!(MyType.stringifier, val)
        IO.print("str: " | str)

        // Parses string to a value
        let val = Parser.run!(MyType.parser, str) <> MyType.bar

        // Serializes to bits
        let bts = Serializer.run!(MyType.serializer, val)
        IO.print("bts: " | Bits.show(bts))

        // Deserializes to a value
        let val = Deserializer.run!(MyType.deserializer, bts) <> MyType.bar

        // Converts to string again
        let str = Stringifier.run!(MyType.stringifier, val)
        IO.print("str: " | str)
      }
    ```
    
      
### Kind 1.0.51

- Inference on numeric literals and binary operators. Check `SYNTAX.md`.

- Many bugfixes
     
      
### Kind 1.0.46

- New syntax to create, get and set attributes of records

```
type Foo {
  new(x: Nat, y: Nat)
}

Test: _
  let foo = {1,2}       // same as `Foo.new(1,2)`
  let x   = foo@x       // same as `case foo { new: foo.x }`
  let bar = foo@y <- 80 // same as `case foo { new: Foo.new(80,foo.y) }`
  bar
```
