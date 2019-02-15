# Formality

A general-purpose programming language for front-end apps, back-end services and smart-contracts. It is:

- **Fast:** no garbage-collection, [optimal beta-reduction](https://medium.com/@maiavictor/solving-the-mystery-behind-abstract-algorithms-magical-optimizations-144225164b07) and a massively parallel GPU compiler make it *insanely fast*.

- **Safe:** a type system capable of proving mathematical theorems about its own programs make it *really secure*.

- **Simple:** its entire implementation takes [500 LOC](javascript/formality.js), making it a simple standard *you could implement yourself*.

**Theorem proving** is possible due to dependent types, like on other proof assistants. **Massively parallel evaluation** is possible due to [Symmetric Interaction Calculus](https://github.com/MaiaVictor/symmetric-interaction-calculus) (SIC), a new model of computation that combines the best aspects of the Turing Machine and the λ-Calculus. **No garbage-collection** is possible due to linearity: values are simply freed when they go out of scope. To use a variable twice, we just clone it: SIC's *lazy copying* makes that virtually free. With no ownership system needed, we have [Rust](https://www.rust-lang.org/en-US/)-like computational properties with a [Haskell](https://www.haskell.org/)-like high-level feel.

## NOTE

This repo is currently going through a major refactoring, as Formality will now be based on [ESCoC](https://github.com/maiavictor/escoc). This makes the language considerably simpler (from 3.5k to 500 LOC!) while being faster (in several senses), more powerful (capable of expressing countless different data encodings) and secure (as it naturally prevents several implementation bugs). The implementation is now in JavaScript, but soon Haskell, Rust and other languages implementations should be available, allowing it to be used as a library in multiple environments.

## Table of contents
<a name="table-of-contents"/>

   * [Usage](#usage)
   * [Examples](#examples)

## Usage
<a name="usage"/>

```bash
# clones repository
git clone https://github.com/maiavictor/formality
cd formality

# installs formality
cd javascript
npm i -g
cd ..

# uses it on the example file
formality main.formality
```

## Examples

(TODO)
