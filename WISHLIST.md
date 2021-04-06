### `open!`

Allow it to change the goal just like `case x { ... }!`.

### alias syntax

```
alias T = Tic.Tac.Toe
```

Would allow you to use `T/x` instead of `Tic.Tac.Toe.x`.

---

### Port the CLI (`Kind/bin/js/src/main.js`) to Kind.

---

### Port the compiler (`FormCoreJS/src/FmcToJS.js`) to Kind.

---

### Implement a Scheme compiler.

---

### Revive the Haskell compiler.

---

### Improve the JavaScript compiler

Convert programs to CPS to avoid stack overflows.

---

### Improve the Numeric libraries

8a. Add missing types to `Kind/base`:
  
    ```
    U128
    I8
    I16
    I32
    I64
    I128
    I256
    F8
    F16
    F32
    F128
    F256
    ```

8b. Implement missing algorithms on Word:

    `Word.int.add`
    `Word.int.mul`
    `Word.int.sub`
    `Word.int.mod`
    `Word.int.div`
    `Word.int.pow`
    `Word.int.eql`
    `Word.int.ltn`
    `Word.int.lte`
    `Word.int.eql`
    `Word.int.gte`
    `Word.int.gtn`
    `Word.float.add`
    `Word.float.mul`
    `Word.float.sub`
    `Word.float.mod`
    `Word.float.div`
    `Word.float.pow`
    `Word.float.eql`
    `Word.float.ltn`
    `Word.float.lte`
    `Word.float.eql`
    `Word.float.gte`
    `Word.float.gtn`

8c. Update the compilers to optimize these operations appropriately. 

---

### Implement a rich Geometry library

Add types such as: `Vector2D`, `Vector3D`, `Quaternion`, `Matrix`. Add
operations like dot and cross products, rotations, collision detections and so
on.

---

### Implement App.Render.doc

Create a React-inspired VirtualDOM type on `App.Render`. Then make the site
render it (on `Kind/web/src/AppPlay.js`). This will allow us to create websites
with Kind.

---

### Implement a markdown renderer using App.Render.doc

---

### Implement App.Render.wgl

Like App.Render.doc, but this render mode would be based on WebGL and allow rich
3D applications. 

---

### Improve or rethink IO

Right now, we have a simple `IO` type based on string communications between the
pure language and the host environment, and primitives like `print`, `get_file`,
`get_line`. This isn't very well-thought. Should we add more primitives or go
for another design?

---

### Create a landing page for kind

We don't have one. We need one. It should be made as an `App`, using
`App.Render.doc`. It may also includ things like hyperlinked syntax highlighters
for Kind and a REPL or Try mode for the language.

---

### alias


---

### Improve `Map` 

It should use GMap instead of BitsMap

---

### Show line number on error message

Instead of `Inside 'Test.kind'`, should be `Inside line X of 'Test.kind'`.

