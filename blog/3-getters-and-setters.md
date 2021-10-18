Getters and Setters in Kind
===========================

The verbosity of nested fields
------------------------------

One of the most annoying aspects of pure functional programming is getting,
setting and mutating deeply nested fields. In impure languages like JavaScript,
this was never a problem. For example, consider the following object:

```javascript
let obj = {
  name: "sample"
  data: {
    "a": [1.0, 2.0, 3.0, 4.0, 5.0, 6.0]
    "b": [7.0, 7.0, 7.0, 7.0, 7.0, 7.0]
  }
}
```

Altering a nested field is easy:

```javascript
obj.data["a"][0] = 42.0
```

In Haskell, the equivalent code is very verbose. Lenses greatly improve the
situation, but they 1. have considerable runtime cost, 2. require big external
libraries, 3. can be overkill, 4. are still not as succinct as JS.

To be fair, the JavaScript version, while terse, is problematic. Not only
because it mutates the original object, but because, if any of the keys don't
exist, the program will crash. To make that program safe, one must make
several checks that end up making the code verbose too:

```javascript
var data = obj.data
if ( obj.data !== undefined
  && obj.data["a"] !== undefined
  && obj.data["a"][0] !== undefined) {
  obj.data["a"][0] = 42.0
}
```

In [Kind](https://github.com/kind-lang/kind), the earlier versions of the 
language suffered from a similar problem. The equivalent object could be
defined as:

```javascript
type Object {
  new(
    name: String
    data: Map<List<F64>>
  )
}

obj: Object
  Object.new("sample", {
    "a": [1.0, 2.0, 3.0, 4.0, 5.0, 6.0] 
    "b": [7.0, 7.0, 7.0, 7.0, 7.0, 7.0] 
  })
```

And, like on most pure languages, altering nested fields was verbose:

```javascript
obj2: Object
  case obj {
    new: case Map.get!("a", obj.data) as got_list {
      none: obj
      some: case List.get!(0, got_list.value) as got_number {
        none: obj
        some: Object.new(obj.name, Map.set!("a", List.set!(0, 42.0, got_list.value), obj.data))
      }
    }
  }
```

Kind-Lang's obvious solution
----------------------------

Since the last version, Kind features a built-in getter and setter syntax that
makes these operations succinct:

```javascript
new_obj: Object
  obj@data{"a"}[0] <- 42.0
```

This small one-liner is equivalent to the huge case tree we had to write before.
It immutably alters the first number of `obj` to `42`. The way it works is
`x@field` focuses a field, `x{key}` focuses a Map entry, and `x[index]` focuses
a List element. These focusers can be chained to get deep fields:

```javascript
data: Map<List<F64>>
  obj@data

nums: Maybe<List<F64>>
  obj@data{"a"}

number: Maybe<F64>
  obj@data{"a"}[0]
```

And, to set, just append a `<- new_val`. This will overwrite the focused field,
immutably. You can also use `<~` to apply a function instead:

```javascript
new_obj: Object
  obj@data{"a"}[0] <~ F64.mul(2.0)
```

Note that, as expected, `Maybe` shows up only when needed, such as when getting
an element from a list or map. Finally, you can "mutate" an object in a JS-like
fashion by using a `let` expression together with an immutable setter:

```
let obj = obj@data{"a"}[0] <~ F64.mul(2.0)
```

This "mutation" is actually pure: the original `obj` wasn't changed, you just
made a new object with the same name. You can still access the old one by
writing `obj^`. This, in effect, does the same as a JS assignment operator:

```
obj.data["a"][0] *= 2.0
```

Except without mutability, without annoying checks, without runtime errors, with
strong types, and with the flexibility to use any function, instead of just `*`,
`+`, etc. To make it even more terse, the line above can be abbreviated as:

```
let obj@data{"a"}[0] <~ F64.mul(2.0)
```

And that's all! This desugars to an efficient, linear
[Form-Core](https://github.com/moonad/FormCoreJS) program that doesn't use heavy
lenses, and avoids re-getting nested fields. 

Conclusion
----------

In short, dealing with nested fields in JavaScript looks nice but is terrible;
in Haskell, it looks terrible and is; in Kind, it is a joyful experience that
makes you proud of your career choice.

I'm making this post because this is such a huge, needed quality-of-life
improvement that I believe every pure language should come with something
similar out-of-the-box, and I don't understand why they make it so hard. You
shouldn't need huge third party libs to do something that fundamental.

Finally, note this is *not* a built-in lens implementation. Lenses are
first-class objects. Instead, it is just a baseline syntax for immutably
setting, getting and modifying nested values in records, lists and maps. And
that completely changes how the language feels.
