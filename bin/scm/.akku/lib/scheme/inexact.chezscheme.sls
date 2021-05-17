;; -*- mode: scheme; coding: utf-8 -*-
;; SPDX-License-Identifier: CC0-1.0
#!r6rs

(library (scheme inexact)
  (export
    acos asin atan cos exp finite? infinite? log nan? sin sqrt tan)
  (import
    (except (rnrs) finite? infinite? nan?)
    (prefix (rnrs) r6:))

(define (finite? z)
  (if (complex? z)
      (and (r6:finite? (real-part z))
           (r6:finite? (imag-part z)))
      (r6:finite? z)))

(define (infinite? z)
  (if (complex? z)
      (or (r6:infinite? (real-part z))
          (r6:infinite? (imag-part z)))
      (r6:infinite? z)))

(define (nan? z)
  (if (complex? z)
      (or (r6:nan? (real-part z))
          (r6:nan? (imag-part z)))
      (r6:nan? z))))
