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

1. LitSign: a minimal, quantum-resistant, hash-based signature scheme.

2. LitCons: a minimal, proof-of-work consensus algorithm.

3. LitCore: a minimal, well-typed linear calculus used for scripting. 

Litereum doesn't have a native currency. (...)

Roadmap
-------

2021. Publish the white-paper and reference implementations.

That's all: Litereum is final and won't require updates.

LitCore
-------

TODO

LitSign
------

LitCons uses a configuration of WOTS for message authentication. To be able to
sign messages, an user must first generate:

- A private key, that consists of 32 random 256-bit words.

- A public key, that consists of Keccak256^32(w), for each word in the private key.

- A public address, that consists of Keccak256(public_key).

Then, to sign a message, M, the user must (... TODO ...)

LitCons
-------

LitCons is a data-only blockchain. It could be described as "Bitcoin without the
coin". It is the consensus layer used by Litereum to order blocks (pages) in its
decentralized network, but it is fully independent from it. Like most components
of Litereum, LitCons's design is extremely minimal. 

A LitCons page is similar to a Bitcoin block, but it has only 4 fields: a
Keccak-256 hash pointing to the previous page, a 256-bit nonce (that can also be
used to store extra data), the miner's address, and a 1280-bytes body that can
store arbitrary data. In Kind, it is represented by the following type:

```
type Lit.Cons.Page {
  new(
    prev: U256            // previous page (32 bytes)
    user: U256            // miner address or identifier
    nonc: U256            // nonce + extra data (32 bytes)
    body: Vector<U256,40> // page contents (1280 bytes)
  )
}
```

Unlike Bitcoin blocks, a LitCons page doesn't hold a set of transactions.
Instead, it stores an arbitrary blob of 1280 bytes of data. The size was chosen
to allow a full block to fit in a small UDP packet, allowing for fast
propagation. There are no "block headers": a page stores all its data. There
aren't native tokens, nor transaction fees. The incentives to include Litereum
commands (transactions) in a page are determined by miners and users: fees can
be paid with any internal token.

Nakamoto Consensus [BITCOIN_WHITEPAPER] is used to publish, propagate and order
LitCons pages in a manner such that network participants agree to a single
canonical list of posts, except a single Keccak-256 is used to take the block
hash and (TODO: parameters here).







// TODO: comment programas grandes podem ser split em varias paginas
