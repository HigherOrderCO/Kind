Litereum: the minimal decentralized computer
============================================

In 2013, the first decentralized computer, Ethereum, was proposed, extending
Bitcoin with a stateful scripting language that allowed arbitrary transactions
to be settled without third parties. Due to its experimental nature, Ethereum
grew increasingly complex, leading to security issues and an asymmetry of power
between developers and users. Litereum is a massive simplification of the
concept, which trades scalability and cutting-edge features for sheer simplicity
and code quality. Designed to be final and never require updates, Litereum
eliminates the core developer class, giving birth to a minimal decentralized
computer that is inherently secure and truly apolitical.

Design
------

Litereum's design is a combination of 3 main components:

1. LitCons: a minimal, proof of work consensus algorithm.

2. LitSign: a minimal, quantum-resistant, hash-based signature scheme.

3. LitCore: a minimal, statically typed linear calculus used for scripting. 

Litereum doesn't have a native currency: it is a purely computational network.
Of course, users can implement their own currencies as smart-contracts, and
miners can be incentivized with any of these internal tokens. The design of each
of these components will be specified below.

LitCore
-------


LitCore is the underlying computation model of the network. It can be described
as a minimal functional language featuring linear functions, algebraic
datatypes, pattern-matching and a mutable global state. This language is split
in two parts: terms and commands.

Unlike most blockchain platforms, Litereum isn't a crypto-currency. Instead, it
is a pure computation network. One can see it as a global Haskell REPL. Instead
of blocks, Litereum has `Page`s, which is like a file in a programming language.
Instead of transactions, Litereum has `Command`s, which are like statements in a
programming language. And instead of stack-based opcodes, Litereum has `Term`s,
which are like pure expressions that compute and return values.

### Page (block)

A Litereum Page is just a list of commands. It is equivalent to a block in a
crypto-currency, but, instead of storing transactions, it stores a list of
commands. When a page is mined, these commands will execute in order, each one
altering the network state.

### Command (transaction)

Instead of monetary transactions, a Litereum page (block) has a list of
commands. A command executes a single action that alters the blockchain state in
a specific way. Unlike transactions in other networks, commands don't require a
monetary transfer ("amount/to"), a fee ("gasPrice", "gasLimit", etc.), and not
even a signature (they can be anonymous). This is efficient, as it allows
certain transactions to avoid lengthly signatures: for example, there is no need
for a signature to create a new type, or a new function (contract). Users can
still emulate conventional transactions by making a signed command that pays
money and fees in specific tokens. There are 4 variants of commands:

1. `new_type`

The `new_type` command performs a global type declaration, defining a new
algebraic datatype that will then be available to be used in functions and other
commands. It has one argument: the type to be created.

A Litereum Type specifies a simply-typed, linear, possibly recursive algebraic
datatype. It has a name, and a number of forms. A Form represents a single
constructor of an algebraic datatype. It has a name, and a number of fields. A
field represents a value stored inside a constructor. It has a name and a type
(represented by its name). In code:

```
record Lit.Core.Type {
  name: String
  forms: List<Lit.Core.Type.Form>
}

record Lit.Core.Type.Form {
  name: String
  fields: List<Lit.Core.Type.Field>
}

record Lit.Core.Type.Field {
  name: String
  type: String
}
```

2. `new_func`

The `new_func` command creates a new global function that is then available to
be used in other functions or inside blocks. It has one argument: the function
to be created.  

A Litereum `Func` is a record with 6 fields: a `name`, ... <TODO>

3. `new_user`

<TODO: creates a new user>

4. `ext_exec`

<TODO: performs an inline call, possibly signed>

### Term

A Litereum term is an expression that performs a computation and returns a
value. There are 5 variants:

1. `create`

Represents the instantiation, or allocation, of an algebraic datatype
constructor. The `create` variant receives 3 arguments:

- `type : String`: stores the name of the type to be created.

- `form : Nat`: stores the index of the form, or variant, to be created.

- <TODO>

2. `match`

<TODO>

3. `call`

<TODO>

4. `bind`

<TODO>

5. `var`

<TODO>

LitSign
-------

LitCons uses a configuration of WOTS for message authentication, based on the
Keccak256 function. To be able to sign messages, an user must first generate a
random 256-bit word as its seed. From this seed, the user can generate private
keys by concatenating and hashing `keccak(seed | n | i)` for each natural number
`i` up to `32` (exclusive), where `n` is the number of the private key. That is:

```
function private_key(seed, n):
  private_key = []
  for i from 0 to 32:
    private_key.push(keccak(seed | n | i))
  return private_key
```

A public key can then be generated by taking `keccak^256(w)`, for each word `w`
in the private key, concatenating these results, and taking its hash. That is:

```
function public_key(private_key):
  public_key = []
  for i from 0 to 32:
    hash = private_key[i]
    for j from 0 to 256:
      hash = keccak(hash)
    public_key.push(hash)
  return keccak(public_key)
```

The user must then broadcast his public key as his public identifier, and keep
his private key secret. To sign a message `M` the user must first generate a
256-bit summary of `M`. That summary consists of the last 30 bytes of the
Keccak of the message, prefixed with the sum of these bytes. That is:

```
function summary(message):
  hash    = keccak(message)[2..32]  # last 30 bytes of the hash
  byte_0  = sum(hash) / 256         # first byte of the checksum
  byte_1  = sum(hash) % 256         # second byte of the checksum
  summary = byte_0 | byte_1 | hash  # the 32-byte summary
  return summary
```

Then, for each natural number `i`, up to `32`, the signer must take
`256 - summary[i]` consecutive hashes of `private_key[i]`. The concatenation of
these 32 hashes is the 1024-bytes signature. That is:

```
function sign(private_key, summary):
  signature = []
  for i from 0 to 32:
    value = private_key[i]
    for i from 0 to 256 - summary[i]:
      value = keccak(value)
    signature.push(value)
  return signature
```

A public key can be recovered from a signature and a summary by, for each
natural number `i`, up to `32`, taking `summary[i]` consecutive hashes of
`signature[i]`. That is:

```
function recover(summary, signature):
  public_key = []
  for i from 0 to 32:
    hash = signature[i]
    for i from 0 to summary[i]:
      hash = keccak(hash)
    public_key.push(hash)
  return keccak(public_key)
```

To check if a signature is valid, the verifier must check if the public key
returned by `recover()` matches with the one published. That is:

```
function valid(message, signature, public_key):
  return recover(summary(message), signature) == public_key
```

This signature scheme has 120 bits of classical security, and 80 bits of
post-quantum security. It has a signature size of 1024 bytes, and requires an
average of 4096 hashes per signature and verification. This is an one-time
signature scheme, which means that, once a message is signed with a public key,
that public key must be thrown away, and a new one must be generated. In
Litereum, every time an user makes a transaction, they broadcasts the new
public key to the network.

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

Roadmap
-------

Litereum's roadmap has two phases.

2021-2022: Prelude

In this phase, which starts as soon as this paper is released, an initial
prototype of a full Litereum node will be released, including all 3 major
components, LitCons, LitSign and LitCore. The protocol will immediately start
operating in initial test mode, and may require eventual updates and adjustments
to polish it into its permanent form. During this phase, the network will have a
centralized sequencer, which will be responsible for, and only for, ordering the
transactions in chronological order. Everything else, including Proof of Work
(PoW) mining, will remain the same. When the network moves to the next phase, it
will inherit the transaction history and accumulated PoW.

2022-forever: Chronicle

In this phase, which starts when the network has been stable for enough time,
the centralized sequencer will be turned off, and nodes around the world will
validate transactions via Nakamoto consensus, and the protocol will be
considered final and should never require upgrades. This means that, from this
moment on, there will be no core developers with any amount of privileged
political power. Of course, due to the very nature of blockchains, anyone can
implement changes and propose a fork to the network, but we advise users to be
naturally critical and resistant to such improvement proposals, even if they
come from ourselves. If the codebase becomes large and complex enough, it will,
once again, concentrate the power in the hands of a few core developers, which
goes against the proposal.







// TODO: comment programas grandes podem ser split em varias paginas
