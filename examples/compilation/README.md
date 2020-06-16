## Formality JS Compiler

Since Formality is nothing but a type system for the lambda calculus, we could
compile it to JavaScript by merely translating lambdas to functions, but this
would be too slow. As such, Formality's compiler does a "datatype analysis" that
identifies when λ-terms correspond to certain datatypes and compiles those to
efficient representations. Specifically:

1. If it is a "known type" from [moonad.org](moonad.org), convert to a native type.

- Moonad's `String` becomes a JavaScript `String`.

- Moonad's `U16`, `U32`, `U64` and `F64` become a JavaScript `Number`.

- Moonad's `U64` and `Nat` becomes a JavaScript `BigNumber`.

- Moonad's `SimpleIO(Unit)` becomes a side-effective JavaScript procedure.

2. If it is a "known function", convert to a native function.

- For example, `Nat.add` becomes `+`, `Nat.mul` becomes `*`, etc.

3. If it is a self-encoded datatype, convert to a JavaScript object.

- For example, a `List` becomes `{_:"List.cons", head: _, tail: _}`.

4. Otherwise, just compile to a function, using a loop when tail-recursive.

Types and erased lambdas/applications are completely removed from the runtime.

## Testing

To compile the `main.fm` file on this directory to JavaScript, type:

```
fmcjs main >> main.js
```

Then run it with:

```
node main.js
```

You may also beautify it for better visualization with [`js-beautify`](https://github.com/beautify-web/js-beautify):

```
js-beautify main.js >> tmp.js; mv tmp.js main.js
```

This file builds a list with 4 million BigNumbers and sums them. This takes
about `1s` on my macbook. For a comparison, this equivalent JS code:

```javascript

// Builds a linked-list with 4m BigNumbers
var list = null;
var numb = 0n;
for (var i = 0; i < 2000 * 2000; ++i) {
  list = [numb, list]; // cons numb list
  numb += 1n;
};

// Sums them all
var sum = 0n;
while (list !== null) {
  sum += list[0];
  list = list[1];
};

// Prints
console.log(sum);
```

Also runs in `1s`, exactly the same time as Formality's compiled output, showing
it succesfully removed all the heavy lambda encodings.

## Examples

For example, the following definition:

```c
T Nat
| zero; 
| succ(pred: Nat);

Nat.add(n: Nat, m: Nat): Nat
  case n:
  | zero    => m;
  | succ(n) => Nat.succ(Nat.add(n)(m));
```

Is compiled to:


```javascript
var Nat$zero = 0n;
var Nat$succ = (pred => 1n + pred);
var Nat$add  = n => m => (n + m);
```

Because Formality recognizes the `Nat` type and the native `add` function. For
functions it doesn't recognize, it just converts to recursive calls. For
example, the function below:

```c
Nat.double(n: Nat): Nat
  case n:
  | zero    => Nat.zero;
  | succ(n) => Nat.succ(Nat.succ(Nat.double(n)));
```

Is compiled to:

```javascript
var Nat$double = (n$1 => (() => {
    var self = n$1;
    switch (self === 0n ? 'zero' : 'succ') {
        case 'zero':
            return 0n;
        case 'succ':
            var $4 = (self - 1n);
            return Nat$succ(Nat$succ(Nat$double($4)));
    }
})());
```

For types it doesn't recognize specifically, but can still identify as being a
λ-encoded datatype, Formality compiles to a native JavaScript object, which is
then compiled to native C objects by JIT runtimes. For example,

```c
T List (A: Type)
| nil;
| cons(x: A, xs: List(A));
```

Is compiled to:

```javascript
var List$nil = ({
  _: 'List.nil'
});

var List$cons = x => xs => ({
  _: 'List.cons',
  'x': x,
  'xs': xs
});
```

Since the only form of repetition in Formality is recursion, and due to
JavaScript's small stack limit, computing over big lists would result in stack
overflows. To amend the issue, Formality can compile tail-recursive functions to
loops. For example,

```c
List.range.tco(lim: Nat, xs: List(Nat)): List(Nat)
  case lim:
  | zero    => xs;
  | succ(n) => List.range.tco(n, List.cons<>(n, xs));
```

Is compiled to:

```javascript
var List$range$tco = lim$1 => xs$2 => {
    var List$range$tco = lim$1 => xs$2 => ({
        ctr: 'TCO',
        arg: [lim$1, xs$2]
    });
    while (true) {
        var R = (() => {
            var self = lim$1;
            switch (self === 0n ? 'zero' : 'succ') {
                case 'zero':
                    return xs$2;
                case 'succ':
                    var $3 = (self - 1n);
                    return List$range$tco($3)(List$cons($3)(xs$2));
            }
        })();
        if (R.ctr === 'TCO')[lim$1, xs$2] = R.arg;
        else return R;
    }
};
```

Right now, Formality is not able to do TCO analysis, so you must add a `.tco` to
the end of the function's name to toggle it (and make sure it is indeed tail
recursive). This will soon be added to the language. In a future, Formality will
also be able to prevent stack overflows by building its own stack on each
function call. Right now, it merely delegates recursion to JavaScript.
