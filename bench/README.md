Bench
=====

Benchmarks of Kind2 vs other proof assistants. These benchmarks measure the time
each assistant takes to verify a given file. Replicate as follows:

### Agda

```
time agda -i src file.agda
```

### Idris2

```
time idris2 --check file.idr
```

### Kind2

```
time kind2 check file.kind2
```

### Kind2-C

```
kind2 check file.kind2
hvm compile file.kind2.hvm
clang file.kind2.c -O3 -o check
time ./check
```

Results
=======

### nat_exp

Computes `3 ^ 8`, using the Nat type, on the type level.

```
language | time
-------- | --------
Kind2-C  |   0.17 s
Kind2    |   0.58 s
Agda     |  15.55 s
Idris2   |  67.40 s
```
