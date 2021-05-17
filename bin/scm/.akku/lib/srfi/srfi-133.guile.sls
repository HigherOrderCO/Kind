#!r6rs
(library (srfi srfi-133)
  (export 
    ;;; * Constructors
    vector-unfold vector-unfold-right vector-copy vector-reverse-copy
    vector-append vector-concatenate vector-append-subvectors

    ;;; * Predicates
    vector-empty? vector=

    ;;; * Iteration
    vector-fold vector-fold-right vector-map vector-map! vector-for-each
    vector-count vector-cumulate

    ;;; * Searching
    vector-index vector-skip vector-index-right vector-skip-right
    vector-binary-search vector-any vector-every vector-partition

    ;;; * Mutators
    vector-swap! vector-fill! vector-reverse! vector-copy! vector-reverse-copy!
    vector-unfold! vector-unfold-right!

    ;;; * Conversion
    vector->list reverse-vector->list list->vector reverse-list->vector
    vector->string string->vector)
  (import (rename (rnrs)
                  (vector-fill! rnrs:vector-fill!)
                  (vector->list rnrs:vector->list)
                  (list->vector rnrs:list->vector))
          (rnrs mutable-strings)
          (srfi private include))
  (include/resolve ("srfi" "%3a133") "vectors-impl.scm"))
