#!r6rs
;; Copyright 2009 Derick Eddington.  My MIT-style license is in the file named
;; LICENSE from the original collection this file is distributed with.

(library (srfi :25 multi-dimensional-arrays)
  (export
    array?
    make-array
    shape
    array
    array-rank
    array-start
    array-end
    array-ref
    array-set!
    share-array)
  (import
    (srfi :25 multi-dimensional-arrays all))
)
