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

### Kind 1.0.47

- Optimize float literals

### Kind 1.0.48

- Float literal bugfix

### Kind 1.0.49

- Inference on numeric literals and binary operators. Check `SYNTAX.md`.

