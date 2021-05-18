#!r6rs
(library (srfi srfi-117)
  (export
    make-list-queue list-queue list-queue-copy list-queue-unfold list-queue-unfold-right
    list-queue? list-queue-empty?
    list-queue-front list-queue-back list-queue-list list-queue-first-last
    list-queue-add-front! list-queue-add-back! list-queue-remove-front! list-queue-remove-back!
    list-queue-remove-all! list-queue-set-list!
    list-queue-append list-queue-append! list-queue-concatenate
    list-queue-map list-queue-map! list-queue-for-each)
  (import
    (only (srfi :23) error)
    (except (rnrs base) error)
    (rnrs control)
    (rnrs mutable-pairs)
    (rnrs records syntactic)
    (srfi private include))
  (include/resolve ("srfi" "%3a117") "list-queues-impl.scm"))
