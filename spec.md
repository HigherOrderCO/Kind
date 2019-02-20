## Moonad: a Peer-to-Peer Operating System

**Abstract.** A purely peer-to-peer implementation of an operating system should allow autonomous internet applications to operate perpetually with no downtime. Building on top of Ethereum, we present the design of a minimal, decentralized operating system, on which users can download, use, modify and distribute online applications without any remaining centralization point. Our low-level machine language, Nasic, is capable of reducing high-order programs optimally and in massively parallel architectures, making it future-ready. Our high-level language, Formality, exploits Curry-Howard's isomorphism to verify security claims offline, laying unprecedentedly secure foundations for a global software ecossystem to be built upon. A distributed file system is used for data storage, and a Byzantine fault tolerant blockchain is used as a source of transactions, for online applications. The entire system is built to be as small as possible: a 2,000 lines of code reference implementation is provided. We also detail how to implement it independently, removing the need to trust our own code.

## 1. Nasic: a massively parallel, low-level machine language

### Motivation

Operating systems often make a distinction between high and low-level languages. This enables a separation of concerns: while high-level languages focus on usability and user-friendliness, their low-level counterparts focus on speed and efficiency, often resembling the underlying computer architecture, which is usually be modelled by Turing machines. While that model has worked well for the last few decades, it hit a bottleneck as the speed of sequential CPUs stagnated. Meanwhile, the computing power of GPUs, FPGAs, ASICs and other parallel architectures keeps growing exponentially, but, sadly, modern programming languages can't make use of those advancements. Functional programming languages, whic are based on alternative model, the lambda calculus, were sold as a solution, but never fulfilled its promisses due to the inherent complexity of beta-reduction. 

In 1997, a very simple graph-rewrite system with only 3 symbols and 6 rules has been shown to be a universal model of computation [1]. This system, interaction combinators, is remarkable for having the best properties of Turing machines and the lambda calculus. Like the former, it can be evaluated as a series of atomic, local operations with a clear physical implementation. Like the later, it is inherently parallel, but in a more robust manner, admitting desirable computational properties such as strong confluence, optimal sharing, zero-cost garbage-collection and so on. For those reasons, we use a slightly modified version of symmetric interaction combinators, Nasic, as our lowest-level machine language. This allows our applications to target a computing model that is ready for the upcoming future of massively parallel architectures.

### Specification

While conventional low-level languages describe they programs as a series of statements in an assembly-like language, Nasic programs are simply graphs of a specific format, on which every node has exactly 3 outgoing edges, and is annotated with a symbolic label (e.g., a 32-bit int).

(image)

Any fully connected arrangement of those nodes forms a valid Nasic program. For example, those are valid Nasic programs:

(image)

The position of edges is important. For example, those graphs, while isomorphic, denote two different programs:

(image)

For that reason, the ports from which edges come must be named. The port at the top of the triangle is the `main` port. The one nearest to it in counter-clockwise direction is the `aux1` port. The other one is the `aux2` port.

(image)

Moreover, there are 2 computation rules:

(image)

Those rewrite rules dictate that, whenever a sub-graph matches the left side of a rule, it must be replaced by its right side. For example, the graph below:

(image)

Is rewritten as:

(image)

Because (...). Rewritteable nodes are called redexes, or active pairs. 

This completes Nasic's specification.

### Explanation

As unintuitive as it may seem, this simple graph-rewrite system is extremelly powerful, because it captures the two fundamental rules of computation: annihilation and commutation. The first rule covers a wide array of computational phenomena such as communication, functions, datatypes, pattern-matching and garbage-collection. The second rule covers memory allocation, copying and repetitive behaviors such as loops and recursion. We will explain how it works through a set of examples:

(...)

## 2. Formality: a minimal programming and proof language

### Motivation

While it has been known for almost a century that mathematics and programming are, actually, the same thing - an observation known as the Curry-Howard correspondence - they're still regarded and practiced as separate subjects. This is harmful for both sides. In one side, mathematicians have the power of rigor: there is nothing more undeniably correct than a mathematical proof. Yet, ironically, those proofs are often written, checked and reviewed by humans in an extremelly error-prone process. On the other side, programmers have the power of automation: there is nothing more capable of performing a huge set of tasks without making a single mistake than a computer program. Yet, ironically, most of those programs are written in an unrigorous, bug-ridden fashion. Formality lies in the intersection between both fields: it is a programming language, on which developers are capable of implementing everyday algorithms and data structures, but it is also a proof language, on which mathematicians are capable of proposing and proving theorems. 

Formality aims to be as simple as technically possible: our reference implementation takes about 500 lines of code. This doesn't make it less powerful: due to its inductive lambda encodings, Formality is capable of expressing every datatype included in a traditional proof language. This extreme expressivity also makes it very efficient, since it is capable of being compiled to all sorts of Nasic graphs. As a consequence, it isn't terminating: users must pick a specific termination checker if they worry about mathematical consistency. Different termination checkers should forbid and allow different programming styles. Users not interested by mathematical consistency can simply dispense it, though, getting to work with a very high-level, massively parallel functional programming language.

### Specification

Formality can be described in a single sentence: extended-scope, Church-style Calculus of Constructions with global recursive definitions and optional computational irrelevance annotations. To elaborate what this means, let's start by defining its initial syntax:

```haskell
name ::=
  (any character in the set "a-z", "A-Z", "_", ".", "~") 

term ::=
    Type               -- type of types            
  | [name] term        -- unannotated function
  | [name : term] term -- annotated function
  | {name : term] term -- function type
  | (term term)        -- function application
  | name               -- variable
```

(... reduction rules ...)

(... typing rules ...)


### Explanation

## References

[1] https://pdfs.semanticscholar.org/6cfe/09aa6e5da6ce98077b7a048cb1badd78cc76.pdf
