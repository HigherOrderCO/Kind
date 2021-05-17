;; Copyright © 2019 Göran Weinholt
;; SPDX-License-Identifier: MIT
#!r6rs

(library (srfi private platform-features)
  (export
    expand-time-features
    run-time-features)
  (import
    (rnrs base)
    (rnrs lists)
    (loko))

  (define (expand-time-features)
    '(loko syntax-case))

  (define (run-time-features)
    (let ((mt (machine-type)))
      (append (case (vector-ref mt 0)
                ((amd64) '(x86-64))
                (else '()))
              (case (vector-ref mt 1)
                ((linux) '(linux posix))
                (else '()))))))
