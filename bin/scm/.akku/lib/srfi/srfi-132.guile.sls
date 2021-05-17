#!r6rs
(library (srfi srfi-132)
  (export
    list-sorted? vector-sorted? list-merge vector-merge list-sort vector-sort
    list-stable-sort vector-stable-sort list-merge! vector-merge! list-sort!
    vector-sort! list-stable-sort! vector-stable-sort!
    list-delete-neighbor-dups vector-delete-neighbor-dups
    list-delete-neighbor-dups! vector-delete-neighbor-dups! vector-find-median
    vector-find-median!)
  (import (except (rnrs) list-sort vector-sort vector-sort!)
          (rnrs mutable-pairs)
          (rename (only (srfi :133 vectors) vector-copy! vector-copy)
                  (vector-copy! r7rs-vector-copy!)
                  (vector-copy r7rs-vector-copy))
          (only (rnrs r5rs) quotient)
          (srfi private include))
  (include/resolve ("srfi" "%3a132") "delndups.scm")
  (include/resolve ("srfi" "%3a132") "lmsort.scm")
  (include/resolve ("srfi" "%3a132") "sortp.scm")
  (include/resolve ("srfi" "%3a132") "vector-util.scm")
  (include/resolve ("srfi" "%3a132") "vhsort.scm")
  (include/resolve ("srfi" "%3a132") "visort.scm")
  (include/resolve ("srfi" "%3a132") "vmsort.scm")
  (include/resolve ("srfi" "%3a132") "vqsort2.scm")
  (include/resolve ("srfi" "%3a132") "median.scm")
  (include/resolve ("srfi" "%3a132") "sort.scm")  ; must be last
)
