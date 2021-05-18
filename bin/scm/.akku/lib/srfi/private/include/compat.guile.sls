#!r6rs
(library (srfi private include compat)
  (export search-paths)
  (import (rnrs) (only (guile) %load-path))

(define (search-paths)
  %load-path))
