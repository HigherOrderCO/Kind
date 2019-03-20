# Formality

A general-purpose programming language for front-end apps, back-end services and smart-contracts. It is:

- **Fast:** no garbage-collection, [optimal beta-reduction](https://medium.com/@maiavictor/solving-the-mystery-behind-abstract-algorithms-magical-optimizations-144225164b07) and a massively parallel GPU compiler make it *insanely fast*.

- **Safe:** a type system capable of proving mathematical theorems about its own programs make it *really secure*.

- **Simple:** its entire implementation takes [<1k LOC](javascript/formality.js), making it a simple standard *you could implement yourself*.

**Theorem proving** is possible due to dependent types, like on other proof assistants. **Massively parallel evaluation** is possible due to [Symmetric Interaction Calculus](https://github.com/MaiaVictor/symmetric-interaction-calculus) (SIC), a new model of computation that combines the best aspects of the Turing Machine and the λ-Calculus. **No garbage-collection** is possible due to linearity: values are simply freed when they go out of scope. To use a variable twice, we just clone it: SIC's *lazy copying* makes that virtually free. With no ownership system needed, we have [Rust](https://www.rust-lang.org/en-US/)-like computational properties with a [Haskell](https://www.haskell.org/)-like high-level feel.


## Specification
<a name="specification"/>

Formality's specification is being written [here](spec.md).

## Examples
<a name="examples"/>

Illustrative examples are available on the [`examples`](examples) directory and on [formality-stdlib](https://github.com/moonad/formality-stdlib).

## Usage
<a name="usage"/>

To try the version without linearity checks:

```bash
# Installs formality
npm i -g formality

# Enters the example repository
git clone https://github.com/maiavictor/formality
cd formality/examples

# Checks the proof of Nat induction
formality Nat.induct

# Evaluates 2 + 1 (Scott-encoded)
formality '(Nat.add Nat.2 Nat.1)'

# Evaluates 2 + 1 (Church-encoded)
formality '(Cat.add Cat.2 Cat.1)'
```

## Notes

This repo is currently going through a major refactoring, as Formality will now be based on [ESCoC](https://github.com/maiavictor/escoc). This makes the language considerably simpler (from 3.5k to 500 LOC!) while being faster (in several senses), more powerful (capable of expressing countless different data encodings) and secure (easier to formalize, less bug-prone). It currently has two preliminary versions: one without linearity checks, non-terminating and inconsistent, [here](javascript), and one with linearity checks, terminating and possibly consistent, [here](javascript-consistent), both written in JavaScript. Examples and libraries are written on the former. The later is still being designed and can change considerably, because proving the consistency of a proof language while keeping it expressive is a hard task. Once that is done, the final version will be fully specified in a small document and formalized in Agda.


