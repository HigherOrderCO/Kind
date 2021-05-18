;; -*- mode: scheme; coding: utf-8 -*-
;; SPDX-License-Identifier: CC0-1.0
#!r6rs

;; TODO: Get a writer that outputs with R7RS syntax.

(library (scheme write)
  (export
    display write write-shared write-simple)
  (import
    (chezscheme))

(define write-shared
  (case-lambda
    ((obj)
     (write-shared obj (current-output-port)))
    ((obj port)
     (parameterize ([print-graph #t])
       (write obj port)))))

(define write-simple
  (case-lambda
    ((obj)
     (write-shared obj (current-output-port)))
    ((obj port)
     (parameterize ([print-graph #f])
       (write obj port))))))
