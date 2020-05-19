![](https://raw.githubusercontent.com/moonad/Assets/master/images/formality-banner-white.png)

An lightweight proof-gramming language. It aims to be:

- **Fast:** no garbage-collection, optimal beta-reduction, massively parallel compilers.

- **Secure:** a powerful type system capable of proving mathematical theorems.

- **Portable:** the entire language desugars to a 500 lines core type-theory.

Check the [official documentation](DOCUMENTATION.md), browse our [libraries](https://github.com/moonad/moonad) and come hang out with us [on Telegram](https://t.me/formality_lang).

## Examples

- Adding all numbers of a list:

    ```haskell
    List.sum(xs: List(Nat)) : Nat
      case xs:
      | Nat.zero;
      | (head, tail) Nat.add(head, List.sum(tail));
    ```

- A proof that negating a bool twice returns the same bool:

    ```haskell
    Bool.double_negation_theorem(b: Bool): Equal(_, Bool.not(Bool.not(b)), b)
      case b
      : (b) Equal(_, Bool.not(Bool.not(b)), b);
      | Equal.to<_, Bool.true>;
      | Equal.to<_, Bool.false>;
    ```

- Extracting the first element of a list statically checked to be non-empty:

    ```haskell
    List.safe_head(A: Type, xs: List(A), not_empty: List.not_empty<A>(xs)) : A
      case xs : (xs) (e: List.not_empty<A>(xs)) -> A;
      | (ne) Empty.absurd(ne, A);
      | (x, xs, ne) x;
      | not_empty;
    ```

TODO: include examples of Python-looking Formality for non-FP people.

TODO: link the upcoming "Why proof languages matter?" Moonad post.

## Usage

1. Install [npm](https://www.npmjs.com/get-npm) in your system.

2. Install the language with `npm i -g formality-lang`.

3. Clone the Moonad libraries: `http://github.com/moonad/moonad`.

4. Enter the directory with `cd moonad`.

5. Type `fm`.

This will type-check every `.fm` file on the `moonad` directory. For more info
and commands, check the [docs](DOCUMENTATION.md).

---

![Interaction-Net compilation](https://raw.githubusercontent.com/moonad/Assets/master/images/inet-simulation.gif)
