;; -*- mode: scheme; coding: utf-8 -*-
;; SPDX-License-Identifier: CC0-1.0
#!r6rs

(library (akku-r7rs compat)
  (export
    features
    input-port-open?
    output-port-open?
    char-ready?
    (rename (char-ready? u8-ready?))
    interaction-environment
    eval                                ;allows define
    (rename (primitive-_exit native-emergency-exit))
    define-values)
  (import
    (guile)
    (only (rnrs) native-endianness))

(define (features)
  (append
   %cond-expand-features
   (case (native-endianness)
     ((big) '(big-endian))
     ((little) '(little-endian))
     (else '()))
   '(r6rs
     syntax-case
     r7rs exact-closed ieee-float full-unicode ratios)))

(define (input-port-open? port)
  (and (not (port-closed? port)) (input-port? port)))

(define (output-port-open? port)
  (and (not (port-closed? port)) (output-port? port))))
