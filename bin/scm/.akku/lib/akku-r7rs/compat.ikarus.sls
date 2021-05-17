;; -*- mode: scheme; coding: utf-8 -*-
;; SPDX-License-Identifier: CC0-1.0
#!r6rs

(library (akku-r7rs compat)
  (export
    features
    input-port-open?
    output-port-open?
    char-ready?
    u8-ready?
    interaction-environment
    eval                                ;allows define
    native-emergency-exit
    define-values)
  (import
    (ikarus)
    (srfi private define-values))

(define (features)
  (append
   (cond ((equal? (host-info) "x86_64-unknown-linux-gnu")
          '(x86-64 posix gnu-linux))
         ((equal? (host-info) "i386-unknown-linux-gnu")
          '(i386 posix gnu-linux))
         (else '()))
   (case (native-endianness)
     ((big) '(big-endian))
     ((little) '(little-endian))
     (else '()))
   '(ikarus
     syntax-case r6rs
     r7rs exact-closed exact-complex ieee-float full-unicode ratios)))

(define (char-ready? port)
  (error 'char-ready? "Not implemented in akku-r7rs" port))

(define (u8-ready? port)
  (error 'u8-ready? "Not implemented in akku-r7rs" port))

(define (input-port-open? port)
  (and (not (port-closed? port)) (input-port? port)))

(define (output-port-open? port)
  (and (not (port-closed? port)) (output-port? port)))

(define native-emergency-exit
  (case-lambda
    (()
     (foreign-call "ikrt_exit" 0))
    ((status)
     (foreign-call "ikrt_exit" status)))))
