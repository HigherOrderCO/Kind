Litereum: a minimal decentralized computer
==========================================

In 2013, the first smart-contract blockchain, Ethereum, was proposed, extending
Bitcoin with a stateful scripting language that allowed arbitrary financial
transactions to be settled without third parties. Notably, Ethereum's built-in
virtual machine made it a general-purpose computer, even though most of the
protocol's complexity was not required to achieve Turing completeness. Litereum
is a massive simplification of this concept, trading features for raw
simplicity. Since it does not have a native token, it is not a cryptocurrency
itself, but currencies can be created as internal programs. In essence, Litereum
is a peer-to-peer Lambda Calculus interpreter, making it a minimal decentralized
computer, and a politically neutral smart-contract platform.

Introduction
------------

Litereum's design and implementation is, essentially, a massively distillation
of Ethereum, taking away all the complex features that are either historical
artifacts or optimizations, and keeping only the bare minimum required to
establish a decentralized computer and smart-contract platform. For comparison,
our reference Python full node requires about **3000 lines of code**, while the
standard Ethereum full node has <TODO>.

### Why keep it so simple?

Having a simpler implementation has two major benefits. 

#### 1. Litereum is secure

Since there is less code, the attack surface is narrower, making a full node
much easier to audit. Moreover, the internal scripting language is prone to
formal verification, further reinforcing security. This is only possible because
it is not based on stack machines, but on a simply-typed affine calculus that is
type-checked on-chain and has a clear cost model, preventing reentrancy attacks
(that would lead to invalid states, hindering formal verification) and spam
(which would be unavoidable in the usual lambda calculus, due to the
impossibility of measuring the cost of a beta-reduction).

#### 2. Litereum is apolitical

Ethereum's complexity makes it politically centralized in the hands of the few
developers that fully understand the protocol. While this is fine for most
common users, big companies and governments will avoid throwing large amounts of
money in networks that are strongly influenced by private entities. Litereum's
simplicity makes it viable for companies, and even individuals, to implement
their own full nodes, without trusting anyone else's code. This transparency
makes Litereum politically decentralized and, thus, a less risky choice for big
players looking to migrate their assets from fiduciary to cryptographic money.

### How is that possible?

Below are some of the major differences that make this possible:

#### 1. No native account system

Ethereum uses the Elliptic Curve Digital Signature Algorithm (ECDSA) for message
authentication as a hard-coded algorithm that is part of the protocol. As of
2021, it is still not possible to create Ethereum accounts that do not depend on
ECDSA signatures. Since ECDSA is vulnerable to quantum attackers, if a quantum
computer of reasonable scale is developed, most Ethereum accounts will have
their private keys exposed, which would be catastrophic to the network.

Litereum does not have a native account system or signature scheme. Instead,
users create accounts by simply deploying smart-contracts that they control
through their preferred authentication scheme. As such, users are free to use a
cheaper, but less secure, signature algorithm, like ECDSA, or an expensive, but
more secure, algorithm, like Lamport or WOTS. They can even set up multiple
signature options for the same account. Nothing is hard-coded.

#### 2. No native currencies, only functions

Ethereum has a native currency, Ether, that is used to pay miner fees. Litereum
not only has no "preferred currency", but it has no built-in currency at all: it
is a pure computation network. Of course, users can still create their own
tokens as contracts, but every internal currency is treated equally.

As a consequence, Litereum transactions do not have the "from", "to", "value",
"gasPrice" or "gasLimit" fields. Instead, a transaction is just a block of code
that is executed when mined in order to alter the blockchain state.
Ethereum-like transactions can be emulated by a suitable script. For example,
the following snippet:

    @Katarina({
      call miner = get_miner_identity()
      call Dog.send(42, miner)
      call Lit.send(42, miner)
      call Lit.send(1000, @Ahri)
      done
    }, "c803cb81...cb92880c") // signature here

Is a block of code signed by an user called @Katarina. Once mined, that snippet
would run in behalf of Katarina, paying 42 DOG and 42 LIT tokens as fees for the
block miner, and sending 1000 LIT tokens to @Ahri. In effect, this has the exact
same behavior as a classic Ethereum transaction.

Like Ethereum, the computational cost of a transaction is measured in gas, and
blocks have a size (space) and gas (time) limit. This keeps the cost of running
a full node, both in terms of computation and storage cost, predictable. Since
there is not a native currency, there is not a built-in gas-to-native-token
conversion either. Instead, a free market emerges, where users choose the exact
amount of fees they want to pay, and miners select transactions that fit in a
block, considering both space and computation costs, in a manner that maximizes
their individual profits.

#### 3. A simpler block structure

Ethereum block structure is complex due to both historical artifacts that are
often regarded as mistakes (such as logs), and to optimizations that, while
clever, are not used in practice and sometimes even obsolete (such as
patricia-merkle trees).

![ethereum_block_header.png](Ethereum block structure)

Litereum takes a minimalistic approach: blocks store just the previous block,
the nonce, the miner identity and a list of transactions (which are, themselves,
just blocks of code). Of course, that means that features like light clients
are not possible, but we argue that these are not used in practice: users either
run full nodes, or trust someone that does.

#### 4. A simple concensus algorithm

Ethereum aims to migrate to a complex Proof-of-Stake consensus algorithm. While
that choice will bring several benefits such as lower energy consumption and
faster finality times, it also makes the protocol, as a whole, considerably more
complex. Even Ethereum's current implementation of Proof-of-Work is complex due
to the adoption of Ethash and the GHOST.

Litereum's consensus algorithm is just Proof-of-Work, exactly as used on
Bitcoin, except slightly simpler since there are no native fees. Proof-of-Work
is straightforward to implement and, in fact, only a small fraction of
Litereum's code.

#### 5. It is slower

Finally, it must be stressed that Litereum is not designed to have a high layer
1 throughput. It has a very limited block size and computation budget. Thus, its
complexity is reduced, but at the cost of being less scalable than Ethereum on
its layer 1.

However, there are key differences that are a better fit for some scenarios.
For example, the deployment of contracts does not require signatures; These
contracts are smaller than their Ethereum counterparts for technical aspects
such as shorter serialization and global sharing of functions. Therefore,
deploying blocks and performing non-signed calls should be more scalable on
Litereum.

Regardless, we argue that layer 1 scalability is not the most important
end-goal. Most layer 2 optimizations that make Ethereum more scalable apply to
Litereum, so, a slower layer 1 will not detain long-term scalability.

Design
------

Litereum's design is split in two parts:

### 1. LitCore

The execution environment where users create and interact with tokens, contracts
and applications. It has a built-in scripting language based on the affine,
simply-typed, lambda calculus. Recursive functions, algebraic datatypes,
pattern-matching and 64-bit unsigned integers are the only computational
primitives. Stateful computation is possible because programs are allowed to
mutably rebind global definitions. Communication is possible because programs
can call each-other. That is, a message is just an external function call, and
the reply is just the returned value.

### 2. LitCons

The consensus algorithm. Nodes connect in a peer-to-peer network to create and
exchange blocks of pure data. LitCons is completely separate from LitCore, 
<TODO>

Implementation
--------------

### 1. LitCore

Types:

#### Bits

A string that can be either empty or any sequence of bits

#### World

The global state of LitCore. It is just a map from names to entries.

#### Entry

An entry on the global state. It can be either an User, a Type, or a Function.

#### User

An external user capable of running authenticated scripts. It has 2 fields:

- `name : Bits`: the name of the user

- `pkey : Bits`: the public key of the user

#### Type

An algebraic datatype. It has two fields:

- `name : Bits`: the name of the type

- `ctors : List<Constructor>`: a list of Constructors

#### Constructor

A Constructor has two fields:

- `name : Bits`: the name of the constructor

- `fields : List<Field>`: a list of Fields

#### Field

A Field has two fields:

- `name : Bits`: the name of the field 

- `type : List<Type>`: the type of the field

The type of a field can be the name of any type defined previously, or a
recursive occurrence of the type being defined.

#### Function

A global, affine, simply typed function that can be called by external users, or
by other functions. Functions are pure, except for one stateful operation that
can rebind other functions in the global state.

A function has 6 fields:

- `name`: the name of the function being defined

- `ownr`: a list of owners that can redefine this function

- `main`: a Term, representing the body of the function

- `iarg`: a list of argument names

- `ityp`: a list of argument types

- `otyp`: the output type of the function

#### Command

A top-level command that alters the global state. Commands are grouped in pages.
Tracing a parallel to conventional blockchains, a command is like a transaction,
and a page is like a block. The main difference is that commands do not need to
be signed. There are 4 variants of commands:

##### 1. `new_type(type)`

Defines a new Type on the global state.

If the type's name already exists, then this command fails.

##### 2. `new_func(func)`

Defines a new Function on the global state.

If the function's name already exists, then this command fails.

If the function's body is ill-typed with a type context initialized with the
function's argument list, then this command fails. The function body
is ill-typed if it does not pass the type-check procedure, with a type context
initialized with each variable on the function's argument list.

If the function's body is invalid, then this command fails. The function body is
invalid if it does not pass the validate procedure.

##### 3. `new_user(user)`

Defines a new User on the global state.

If the user's name already exists, then this command fails.

##### 4. `with_user(user, signature, term)`

Executes an expression in behalf of an external user.

If the signature is invalid, the command is executed anonymously, with the
username being set as the empty bitstring.

If the expression's body is ill-typed, then this command fails. The function body
is ill-typed if it does not pass the type-check procedure with an empty context.

If the expression's body is invalid, then this command fails. The expression
body is invalid if it does not pass the validate procedure.

#### Term

A Litereum term is an expression that performs a computation and returns a
value. There are 5 variants:

##### 1. `var(name)`

Represents a variable bound by a global function, or by a pattern-matching
clause. When a function is called, or a pattern-match takes place, the bound
variable will be substituted by its called, or matched, value. Variables must be
affine, which means the same bound variable can only be used at most once, and
must be unique, which means the same name cannot be bound to two different
variables, globally.

##### 2. `create(type, form, vals)`

Instantiates a constructor of an algebraic datatype. It has 3 fields:

- `type : Bits`: the name of the type to be created.

- `ctor : Nat`: the index of the constructor to be created.

- `vals : List<Term>`: the values of the fields to be created.

A create variant is well-typed if:

1. The `type` exists on the global state

2. The `ctor` index is smaller than number of constructors in `type`

3. For each index `0 < i < length(vals)`, the value `vals[i]` is well-typed, and
   its type matches the type stored on `fields[i]`, where `fields` is the list
   of fields stored on the constructor of number `ctor` in the selected type

The create variant does not compute. It is irreducible.

##### 3. `match`

Performs a pattern-match. It has 4 fields:

- `type : Bits`: the name of the type of the matched value.

- `name : Bits`: a name for the matched value.

- `expr : Term`: the matched value.

- `cses : List<Case>`: a list of cases.

The `match` variant is well-typed if: 

<TODO>

The `match` variant computes if the matched constructor, `expr`, is of the
`create` variant. In this case, the expression reduces to the selected case,
`cses[ctor]`, where `ctor` is the index stored on `expr`, with each variable
bound by the selected case is substituted by the respective field of the matched
constructor. <TODO: improve this paragraph>

##### 4. `call`

Calls an external function, returning a value. It has 4 fields:

- `name : Bits`: the name of the returned value.

- `func : Bits`: the name of the function to be called.

- `args : List<Term>`: the list of arguments.

- `cont : Term`: the body of the call.

The `call` variant is well-typed if: <TODO>

The `call` variant computes: <TODO>

##### 5. `bind`

Binds a global definition, possibly mutating an existing value. It has 3 fields:

- `name : Bits`: the name of the definition to be altered.

- `main : Bits`: the value to be bound.

- `cont : Term`: the body of the bind.

The `bind` variant is well-typed if: <TODO>

The `bind` variant computes: <TODO>

#### Case

A case in a pattern-match. It has 2 fields:

- `flds : List<Bits>`: a list of field names

- `body : Term`: the term returned by that case

### 2. LitCons

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

Unlike Bitcoin blocks, a LitCons page does not hold a set of transactions.
Instead, it stores an arbitrary blob of 1280 bytes of data. The size was chosen
to allow a full block to fit in a small UDP packet, allowing for fast
propagation. There are no "block headers": a page stores all its data. There
are not native tokens, nor transaction fees. The incentives to include Litereum
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
