;; -*- mode: scheme; coding: utf-8 -*-
;; SPDX-License-Identifier: CC0-1.0
#!r6rs

(library (akku-r7rs compat)
  (export
    features
    input-port-open?
    output-port-open?
    char-ready?
    (rename (input-port-ready? u8-ready?))
    interaction-environment
    eval                                ;allows define
    native-emergency-exit
    define-values)
  (import
    (chezscheme))

(define (features)
  (let ((mt (symbol->string (machine-type))))
    (append
     (if (char=? (string-ref mt 0) #\t)
         '(threads)
         '())
     (case (machine-type)
       ((ti3le i3le) '(i386 posix gnu-linux))
       ((ti3nt i3nt) '(i386 windows))
       ((ti3fb i3fb) '(i386 posix bsd freebsd))
       ((ti3ob i3ob) '(i386 posix bsd openbsd))
       ((ti3osx i3osx) '(i386 posix bsd darwin))
       ((ti3s2 i3s2) '(i386 posix unix solaris))
       ((ti3nb i3nb) '(i386 posix bsd netbsd))
       ((ti3qnx i3qnx) '(i386 posix qnx))
       ((ta6le a6le) '(x86-64 posix gnu-linux))
       ((ta6osx a6osx) '(x86-64 posix bsd darwin))
       ((ta6ob a6ob) '(x86-64 posix bsd openbsd))
       ((ta6s2 a6s2) '(x86-64 posix bsd solaris))
       ((ta6fb a6fb) '(x86-64 posix bsd freebsd))
       ((ta6nb a6nb) '(x86-64 posix bsd netbsd))
       ((ta6nt a6nt) '(x86-64 windows))
       ((tarm32le arm32le) '(arm posix gnu-linux))
       ((tppc32le ppc32le) '(ppc posix gnu-linux))
       (else '()))
     (case (native-endianness)
       ((big) '(big-endian))
       ((little) '(little-endian))
       (else '()))
     '(chezscheme
       syntax-case r6rs
       r7rs exact-closed exact-complex ieee-float full-unicode ratios))))

(define (input-port-open? port)
  (and (not (port-closed? port)) (input-port? port)))

(define (output-port-open? port)
  (and (not (port-closed? port)) (output-port? port)))

(define native-emergency-exit
  (let ((c-exit (foreign-procedure "(cs)c_exit" (integer-32) void)))
    (case-lambda
      (()
       (c-exit 0))
      ((status)
       (c-exit status))))))
