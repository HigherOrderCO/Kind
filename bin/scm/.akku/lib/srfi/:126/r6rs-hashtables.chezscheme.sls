#!r6rs
(library (srfi :126 r6rs-hashtables)
  (export make-eq-hashtable make-eqv-hashtable make-hashtable
          alist->eq-hashtable alist->eqv-hashtable alist->hashtable weakness
          hashtable? hashtable-size hashtable-ref hashtable-set!
          hashtable-delete! hashtable-contains? hashtable-lookup
          hashtable-update! hashtable-intern! hashtable-copy hashtable-clear!
          hashtable-empty-copy hashtable-keys hashtable-values
          hashtable-entries hashtable-key-list hashtable-value-list
          hashtable-entry-lists hashtable-walk hashtable-update-all!
          hashtable-prune! hashtable-merge! hashtable-sum hashtable-map->lset
          hashtable-find hashtable-empty? hashtable-pop! hashtable-inc!
          hashtable-dec! hashtable-equivalence-function hashtable-hash-function
          hashtable-weakness hashtable-mutable? hash-salt equal-hash
          string-hash string-ci-hash symbol-hash)
  (import (rename (rnrs)
                  (make-eq-hashtable rnrs:make-eq-hashtable)
                  (make-eqv-hashtable rnrs:make-eqv-hashtable)
                  (make-hashtable rnrs:make-hashtable)
                  (hashtable-ref rnrs:hashtable-ref)
                  (hashtable-update! rnrs:hashtable-update!)
                  (hashtable-copy rnrs:hashtable-copy)
                  (hashtable-clear! rnrs:hashtable-clear!))
          (srfi :0 cond-expand)
          (srfi :126 helpers helpers)
          (srfi private include))
  (include/resolve ("srfi" "%3a126") "126.body.scm"))
