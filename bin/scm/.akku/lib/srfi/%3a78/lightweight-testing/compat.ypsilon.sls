#!r6rs
;; Copyright 2009 Derick Eddington.  My MIT-style license is in the file named
;; LICENSE from the original collection this file is distributed with.

(library (srfi :78 lightweight-testing compat)
  (export
    check:write)
  (import
    (rnrs)
    (only (core) pretty-print))

  (define check:write
    (case-lambda
      ((x) (check:write x (current-output-port)))
      ((x p)
       (pretty-print x p)
       (newline p))))
)
