#!r6rs
(library (srfi :133)
  (export
    ;; Constructors 
    vector-unfold vector-unfold-right vector-reverse-copy 
    vector-concatenate vector-append-subvectors
    ;; Predicates 
    vector-empty? vector=
    ;; Iteration 
    vector-fold vector-fold-right vector-map!
    vector-count vector-cumulate
    ;; Searching 
    vector-index vector-index-right vector-skip vector-skip-right 
    vector-binary-search vector-any vector-every vector-partition
    ;; Mutators 
    vector-swap! vector-reverse! 
    vector-reverse-copy! vector-unfold! vector-unfold-right!
    ;; Conversion 
    reverse-vector->list reverse-list->vector)
  (import (srfi :133 vectors)))
