#!r6rs
;; Copyright 2009 Derick Eddington.  My MIT-style license is in the file named
;; LICENSE from the original collection this file is distributed with.

(library (srfi :48 intermediate-format-strings compat)
  (export
    pretty-print)
  (import
    (only (ikarus) pretty-print))
)
