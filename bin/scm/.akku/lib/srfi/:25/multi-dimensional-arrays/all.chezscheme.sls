#!r6rs
;; Copyright 2009 Derick Eddington.  My MIT-style license is in the file named
;; LICENSE from the original collection this file is distributed with.

(library (srfi :25 multi-dimensional-arrays all)
  (export
    array:make
    array:array?
    array:vector
    array:index
    array:shape
    array-ref
    array-set!
    array:opt-args
    array:optimize
    array:optimize-empty
    array:coefficients
    array:vector-index
    array:shape-index
    array:empty-shape-index
    array:shape-vector-index
    array:actor-index
    array:0
    array:1
    array:2
    array:3
    array:n
    array:maker
    array:indexer/vector
    array:indexer/array
    array:applier-to-vector
    array:applier-to-actor
    array:applier-to-backing-vector
    array:index/vector
    array:index/array
    array:apply-to-vector
    array:apply-to-actor
    array?
    make-array
    array:make-array
    shape
    array
    array-rank
    array-start
    array-end
    share-array
    array:share/index!
    array:optimize/vector
    array:optimize/actor
    array:shape->vector
    array:size
    array:make-index
    array:good-shape?
    array:good-share?
    array:unchecked-share-depth?
    array:check-indices
    array:check-indices.o
    array:check-index-vector
    array:check-index-actor
    array:good-indices?
    array:good-indices.o?
    array:good-index-vector?
    array:good-index-actor?
    array:good-index?
    array:not-in
    array:list->string
    array:shape-vector->string
    array:thing->string
    array:index-ref
    array:index-set!
    array:index-length
    array:map->string
    array:map-column->string
    array:grok/arguments
    array:grok/index!)
  (import
    (rnrs)
    (rnrs mutable-pairs)
    (rnrs r5rs)
    (srfi :23 error tricks)
    (srfi private include))

  (define-record-type (array-type array:make array:array?)
    (fields (immutable vec array:vector)
            (immutable ind array:index)
            (immutable shp array:shape)))

  (SRFI-23-error->R6RS "(library (srfi :25 multi-dimensional-arrays))"
   (include/resolve ("srfi" "%3a25") "ix-ctor.scm")
   (include/resolve ("srfi" "%3a25") "op-ctor.scm")
   (include/resolve ("srfi" "%3a25") "array.scm"))
)
