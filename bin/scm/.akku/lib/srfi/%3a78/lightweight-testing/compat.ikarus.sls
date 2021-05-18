#!r6rs
;; Copyright 2009 Derick Eddington.  My MIT-style license is in the file named
;; LICENSE from the original collection this file is distributed with.

(library (srfi :78 lightweight-testing compat)
  (export
    (rename (pretty-print check:write)))
  (import
    (only (ikarus) pretty-print))
)
