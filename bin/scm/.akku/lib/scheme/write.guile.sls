;; -*- mode: scheme; coding: utf-8 -*-
;; SPDX-License-Identifier: CC0-1.0
#!r6rs

;; TODO: Get a writer that outputs with R7RS syntax.

(library (scheme write)
  (export
    display write
    (rename (write-with-shared-structure write-shared))
    (rename (write write-simple)))      ;TODO: not correct
  (import
    (rnrs)
    (srfi :38 with-shared-structure)))
