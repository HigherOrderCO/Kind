#!r6rs
(library (srfi :152)
  (export 
    ;; Predicates
    string? string-null? string-every string-any

    ;; Constructors
    make-string string string-tabulate string-unfold string-unfold-right

    ;; Conversion
    string->vector string->list vector->string list->string reverse-list->string

    ;; Selection
    string-length string-ref substring string-copy string-take
    string-take-right string-drop string-drop-right string-pad string-pad-right
    string-trim string-trim-right string-trim-both

    ;; Replacement
    string-replace

    ;; Comparision
    string=? string-ci=? string<? string-ci<? string>? string-ci>? string<=?
    string-ci<=? string>=? string-ci>=?

    ;; Prefixes and suffixes
    string-prefix-length string-suffix-length string-prefix? string-suffix?

    ;; Searching
    string-index string-index-right string-skip string-skip-right
    string-contains string-contains-right string-take-while
    string-take-while-right string-drop-while string-drop-while-right
    string-break string-span

    ;; Concatenation
    string-append string-concatenate string-concatenate-reverse string-join

    ;; Fold and map and friends
    string-fold string-fold-right string-map string-for-each string-count
    string-filter string-remove

    ;; Replication and splitting
    string-replicate string-segment string-split

    ;; Input-output
    read-string write-string

    ;; Mutation
    string-set! string-fill! string-copy!)
  (import (srfi :152 strings)))
