# Formality

A general-purpose proof-gramming language for front-end apps, back-end services and smart-contracts. It is:

- **Fast:** no garbage-collection, [optimal beta-reduction](https://medium.com/@maiavictor/solving-the-mystery-behind-abstract-algorithms-magical-optimizations-144225164b07) and a massively parallel GPU compiler make it *insanely fast*.

- **Safe:** a type system capable of proving mathematical theorems about its own programs make it *really secure*.

- **Simple:** its entire implementation takes [<1k LOC](javascript/formality.js), making it a simple standard *you could implement yourself*.

[Specification](spec.md) ~ [Examples](main.js)

## Usage
<a name="usage"/>

Formality is currently implemented as a small, dependency-free JavaScript library. It will futurely be implemented in other languages, and formalized in Agda/Coq. To use the current implementation:

```bash
# Installs formality
npm i -g formality

# Enters the repository
git clone https://github.com/maiavictor/formality
cd formality

# Checks and evaluates main
formality main
```

You can also use it as a library from your own JS code.
