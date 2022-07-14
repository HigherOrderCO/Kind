Bench
=====

Benchmarks of Kind2 vs other proof assistants. These benchmarks measure the time
each assistant takes to verify a given file. Replicate as follows:

### Agda:

```
time agda -i src file.agda
```

### Kind2-i (interpreted HVM)

```
time kind2 check file.kind2
```

### Kind2-c (compiled HVM)

```
kind2 check file.kind2
hvm compile file.kind2.hvm
clang file.kind2.c -O3 -o check
time ./check
```

Results
=======

### slow_num

Computes `2 ^ 24`, using the Nat type, on the type level. 

```
language | time
-------- | --------
Agda     | 11.277 s
Kind2-i  |  2.350 s 
Kind2-c  |  0.925 s
```
