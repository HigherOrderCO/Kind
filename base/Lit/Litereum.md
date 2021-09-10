Litereum: the simplest decentralized computer
=============================================

In 2013, the first decentralized computer, Ethereum, was proposed, extending
Bitcoin with a stateful scripting language that allowed arbitrary transactions
to be settled without third parties. Due to its experimental nature, Ethereum
grew incresingly complex, leading to security issues and an unbalance of power
between developers and users. Litereum is a massive simplification and
polishment of the concept, which trades scalability and cutting-edge features
for simplicity and code quality. It is highly inspired by type theory, and
designed to never require updates, eliminating the developer class, and
resulting in a minimal, secure and politically neutral decentralized computer.

Design
------

Litereum's design is a combination of 3 components:

1. LitSign: a minimal, hash-based signature scheme that can't be broken by quantum
   computers. It is an adaptation of WOTS signatures.

2. LitCons: a minimal, proof-of-work consensus algorithm for peer-to-peer
   transactions. It is a simplification of Nakamoto Consensus.

3. LitCore: a minimal, statically-typed language prone to formal
   verification. It is a stateful calculus based on datatypes and recursion.

Litereum doesn't have a native currency. Instead, it is a truly pure and neutral
decentralized computer.

Roadmap
-------

2021. Publish the white-paper and reference implementations.

That's all: Litereum is final and won't require updates.

LitSign
------

TODO

LitCons
-------

LitCons is a data-only blockchain. It could be described as "Bitcoin without the
coin". It is the consensus layer used by Litereum to order blocks (pages) in its
decentralized network, but it is fully independent from it. Like most components
of Litereum, LitCons's design is extremely minimal. 

A LitCons page is similar to a Bitcoin block header, but it has only 3 fields: a
256-bit nonce (that can also be used to store extra data), a Keccak-256 hash
pointing to the previous page, and a 1280-bytes body that can store arbitrary
data. It is not a header. The page is complete by itself. In Kind, it is
represented by the following type:

```
type Lit.Cons.Page {
  new(
    body: Vector<U256,40> // block contents (1280 bytes)
    work: U256            // nonce + extra data (32 bytes)
    prev: U256            // previous block (32 bytes)
  )
}
```

LitCore
-------

TODO







// TODO: comment programas grandes podem ser split em varias paginas
