#!r6rs
;; Copyright 2010 Derick Eddington.  My MIT-style license is in the file named
;; LICENSE from the original collection this file is distributed with.

(library (srfi :1 lists)
  (export
    ;;; Exported:
    xcons #;tree-copy make-list list-tabulate list-copy
    proper-list? circular-list? dotted-list? not-pair? null-list? list=
    circular-list length+
    iota
    first second third fourth fifth sixth seventh eighth ninth tenth
    car+cdr
    take       drop
    take-right drop-right
    take!      drop-right!
    split-at   split-at!
    last last-pair
    zip unzip1 unzip2 unzip3 unzip4 unzip5
    count
    append! append-reverse append-reverse! concatenate concatenate!
    unfold       fold       pair-fold       reduce
    unfold-right            pair-fold-right reduce-right
    append-map append-map! map! pair-for-each filter-map map-in-order
    filter! partition! remove!
    find-tail any every list-index
    take-while drop-while take-while!
    span break span! break!
    delete delete!
    alist-cons alist-copy
    delete-duplicates delete-duplicates!
    alist-delete alist-delete!
    reverse!
    lset<= lset= lset-adjoin
    lset-union  lset-intersection  lset-difference  lset-xor
    lset-diff+intersection
    lset-union! lset-intersection! lset-difference! lset-xor!
    lset-diff+intersection!
    ;; re-exported:
    append assq assv caaaar caaadr caaar caadar caaddr
    caadr caar cadaar cadadr cadar caddar cadddr caddr cadr
    car cdaaar cdaadr cdaar cdadar cdaddr cdadr cdar cddaar
    cddadr cddar cdddar cddddr cdddr cddr cdr cons cons*
    length list list-ref memq memv null? pair?
    reverse set-car! set-cdr!
    ;; different than R6RS:
    assoc filter find fold-right for-each map member partition remove)
  (import
    (rename (except (rnrs) find filter fold-right map partition remove)
            (assoc r6rs:assoc)
            (for-each r6rs:for-each)
            (member r6rs:member))
    (rnrs mutable-pairs)
    (srfi :8 receive)
    (srfi :23 error tricks)
    (for (srfi private vanish) expand)
    (srfi private check-arg)
    (srfi private include))

  (let-syntax ((define (vanish-define define (cons*))))
    (SRFI-23-error->R6RS "(library (srfi :1 lists))"
     (include/resolve ("srfi" "%3a1") "srfi-1-reference.scm")))
)
