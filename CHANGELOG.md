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

### Kind 1.0.51

- Inference on numeric literals and binary operators. Check `SYNTAX.md`.

- Many bugfixes

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



