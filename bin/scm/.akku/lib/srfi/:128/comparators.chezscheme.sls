#!r6rs
(library (srfi :128 comparators)
  (export comparator? comparator-ordered? comparator-hashable? make-comparator
          make-pair-comparator make-list-comparator make-vector-comparator
          make-eq-comparator make-eqv-comparator make-equal-comparator
          boolean-hash char-hash char-ci-hash string-hash string-ci-hash
          symbol-hash number-hash make-default-comparator default-hash
          comparator-register-default! comparator-type-test-predicate
          comparator-equality-predicate comparator-ordering-predicate
          comparator-hash-function comparator-test-type comparator-check-type
          comparator-hash hash-bound hash-salt =? <? >? <=? >=?
          comparator-if<=>)
  (import (except (rnrs) define-record-type)
          (srfi :99)
          (srfi :39)
          (only (rnrs r5rs) modulo)
          (srfi private include))
  (define (exact-integer? x) (and (integer? x) (exact? x)))
  (include/resolve ("srfi" "%3a128") "128.body1.scm")
  (include/resolve ("srfi" "%3a128") "128.body2.scm"))

