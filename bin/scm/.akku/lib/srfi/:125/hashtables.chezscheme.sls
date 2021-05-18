#!r6rs
(library (srfi :125 hashtables)
  (export
    make-hash-table hash-table hash-table-unfold alist->hash-table

    hash-table? hash-table-contains? hash-table-empty? hash-table=?
    hash-table-mutable?

    hash-table-ref hash-table-ref/default

    hash-table-set! hash-table-delete! hash-table-intern! hash-table-update!
    hash-table-update!/default hash-table-pop! hash-table-clear!

    hash-table-size hash-table-keys hash-table-values hash-table-entries
    hash-table-find hash-table-count

    hash-table-map hash-table-for-each hash-table-map! hash-table-map->list
    hash-table-fold hash-table-prune!

    hash-table-copy hash-table-empty-copy hash-table->alist

    hash-table-union! hash-table-intersection! hash-table-difference!
    hash-table-xor!

   ;; The following procedures are deprecated by SRFI 125:

   deprecated:hash
   deprecated:string-hash
   deprecated:string-ci-hash
   deprecated:hash-by-identity
   deprecated:hash-table-equivalence-function
   deprecated:hash-table-hash-function
   deprecated:hash-table-exists?
   deprecated:hash-table-walk
   deprecated:hash-table-merge!)

  (import (except (rnrs)
                  make-hashtable hashtable-clear! hashtable-copy
                  hashtable-ref hashtable-update! make-eq-hashtable
                  make-eqv-hashtable)
          (srfi private include)
          (rename (srfi :126)
                  (hashtable? hash-table?)
                  (hashtable-contains? hash-table-contains?)
                  (hashtable-empty? hash-table-empty?)
                  (hashtable-intern! hash-table-intern!)
                  (hashtable-clear! hash-table-clear!)
                  (hashtable-copy hash-table-copy)
                  (hashtable-size hash-table-size)
                  (hashtable-pop! hash-table-pop!)
                  (hashtable-merge! hash-table-merge!)
                  (hashtable-hash-function hash-table-hash-function)
                  (hashtable-equivalence-function hash-table-equivalence-function))
          (except (srfi :128) hash-salt string-hash string-ci-hash symbol-hash))

  (include/resolve ("srfi" "%3a125") "125.body.scm"))

