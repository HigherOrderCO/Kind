Neutralis: the minimal secure decentralized computer
====================================================

In 2009, the first peer-to-peer electronic cash, Bitcoin, was proposed, but its
limitations resulted in the launch of several alternative currencies, each
solving specific issues. In 2013, the first generalized transaction ledger,
Ethereum, was proposed. By embedding computations in the network, it allowed
contracts and financial instruments to be enforced without third parties, but
its extensive development resulted in a protocol that is complex, ridden with
security faults [X][Y], and politically centralized, since developers have a
privileged position in the community.

Neutralis is an extremely distilled take on the same concept. Its design is
final and won't ever require updates, and the protocol is sufficiently simple
for an independent developer to understand and implement it in a few days of
work. These factors, together, remove the need for developer trust, and any
remaining centralization. Neutralis's execution language is a light calculus
that is prone to formal verification, greatly reducing the odds of software
errors and making it as secure as technically possible. Its signature algorithm
relies on hashes, making it resistant to quantum attacks. Proof of Work is used
as the consensus algorithm, since it is simple to implement and has stablished
security.

Since simplicity and security are prioritized over efficiency and scalability,
Neutralis, compared to alternatives, has lower throughput and higher
transaction costs. As such, it isn't suitable for applications that demand a
large number of transactions per second. On the other hands, for applications
where safety is more important than throughput, such as contracts of high
monetary value, Neutralis provides an ideal settlement environment that is
stable, previsible and secure. 

Design
------

1. Hash Function

2. Digital Signature

3. Consensus Algorithm

4. Execution Environment

5. Networking

Implementation
--------------


type Block {
  
}


1. Hash Function

The hash function used is


Type : Type1 : Type2
type Bad {
  new(f: Bad -> Bad)
  zero
}


λx. x
λf. λx. (f x)
[λf. λx. (f x x)]


(λx. (x x)) (λx. (x x))






(λx. λf. (f x x x x))(λf.f λf.f)

bookkeeping
