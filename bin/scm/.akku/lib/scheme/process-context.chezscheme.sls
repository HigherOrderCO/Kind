;; -*- mode: scheme; coding: utf-8 -*-
;; SPDX-License-Identifier: CC0-1.0
#!r6rs

(library (scheme process-context)
  (export
    command-line emergency-exit (rename (r7rs-exit exit)) get-environment-variable
    get-environment-variables)
  (import
    (rnrs)
    (srfi :98 os-environment-variables)
    (akku-r7rs compat))

(define (translate-status status)
  (case status
    ((#t) 0)
    ((#f) 1)
    (else status)))

(define r7rs-exit
  (case-lambda
    (()
     (exit))
    ((status)
     (exit (translate-status status)))))

(define emergency-exit
  (case-lambda
    (()
     (native-emergency-exit))
    ((status)
     (native-emergency-exit (translate-status status))))))
