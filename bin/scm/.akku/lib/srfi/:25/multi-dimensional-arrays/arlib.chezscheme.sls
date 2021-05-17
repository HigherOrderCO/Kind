#!r6rs
;; Copyright 2009 Derick Eddington.  My MIT-style license is in the file named
;; LICENSE from the original collection this file is distributed with.

(library (srfi :25 multi-dimensional-arrays arlib)
  (export
    array-shape
    array-length
    array-size
    array-equal?
    shape-for-each
    array-for-each-index
    tabulate-array
    tabulate-array!
    array-retabulate!
    array-map
    array-map!
    array->vector
    array->list
    share-array/prefix
    share-row
    share-column
    share-array/origin
    share-array/index!
    array-append
    transpose
    share-nths)
  (import
    (rnrs)
    (rnrs r5rs)
    (srfi :23 error tricks)
    (srfi :25 multi-dimensional-arrays all)
    (srfi private include))

  (SRFI-23-error->R6RS "(library (srfi :25 multi-dimensional-arrays arlib))"
   (include/resolve ("srfi" "%3a25") "arlib.scm"))
)
