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
    eval
    native-emergency-exit
    define-values)
  (import
    (rnrs)
    (rnrs eval)                         ;does not allow define
    (srfi private define-values))

(define (features)
  (append
   (case (native-endianness)
     ((big) '(big-endian))
     ((little) '(little-endian))
     (else '()))
   '(syntax-case r6rs
     r7rs exact-closed exact-complex ieee-float full-unicode ratios)))

(define (todo who)
  (error who "(akku-r7rs compat) is not implemented for this Scheme"))

(define (char-ready? port) (todo 'char-ready?))

(define (u8-ready? port) (todo 'u8-ready?))

(define (interaction-environment) (todo 'interaction-environment))

(define (input-port-open? port) (todo 'input-port-open?))

(define (output-port-open? port) (todo 'output-port-open?))

(define native-emergency-exit exit))
