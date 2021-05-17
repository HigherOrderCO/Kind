(define make-eq-hashtable
  (case-lambda
    (() (rnrs:make-eq-hashtable))
    ((capacity)
     (if capacity
         (rnrs:make-eq-hashtable capacity)
         (rnrs:make-eq-hashtable)))
    ((capacity weakness)
     (if weakness
       (cond
        ((memq weakness (weak-eq-hashtables-supported))
         (if capacity
             ((make-weak-eq-hashtable-procedure weakness) capacity)
             ((make-weak-eq-hashtable-procedure weakness))))
        ((memq weakness (ephemeral-eq-hashtables-supported))
         (if capacity
             ((make-ephemeral-eq-hashtable-procedure weakness) capacity)
             ((make-ephemeral-eq-hashtable-procedure weakness))))
        (else (error 'make-eq-hashtable "weakness not supported" weakness)))
       (if capacity
           (rnrs:make-eq-hashtable capacity)
           (rnrs:make-eq-hashtable))))))

(define make-eqv-hashtable
  (case-lambda
    (() (rnrs:make-eqv-hashtable))
    ((capacity)
     (if capacity
         (rnrs:make-eqv-hashtable capacity)
         (rnrs:make-eqv-hashtable)))
    ((capacity weakness)
     (if weakness
         (cond
          ((memq weakness (weak-eqv-hashtables-supported))
           (if capacity
               ((make-weak-eqv-hashtable-procedure weakness) capacity)
               ((make-weak-eqv-hashtable-procedure weakness))))
          ((memq weakness (ephemeral-eqv-hashtables-supported))
           (if capacity
               ((make-ephemeral-eqv-hashtable-procedure weakness) capacity)
               ((make-ephemeral-eqv-hashtable-procedure weakness))))
          (else (error 'make-eqv-hashtable "weakness not supported" weakness)))
         (if capacity
             (rnrs:make-eqv-hashtable capacity)
             (rnrs:make-eqv-hashtable))))))

(define make-hashtable
  (case-lambda
    ((hash equiv)
     (if hash
         (rnrs:make-hashtable (if (pair? hash) (car hash) hash) equiv)
         (cond
          ((eq? equiv eq?) (make-eq-hashtable))
          ((eq? equiv eqv?) (make-eqv-hashtable))
          (else (error 'make-hashtable
                       "hash procedure cannot be #f except with eq? or eqv?"
                       hash equiv)))))
    ((hash equiv capacity)
     (if hash
         (if capacity
             (rnrs:make-hashtable (if (pair? hash) (car hash) hash) equiv
                                  capacity)
             (rnrs:make-hashtable (if (pair? hash) (car hash) hash) equiv))
         (cond
          ((eq? equiv eq?) (make-eq-hashtable capacity))
          ((eq? equiv eqv?) (make-eqv-hashtable capacity))
          (else (error 'make-hashtable
                       "hash procedure cannot be #f except with eq? or eqv?"
                       hash equiv)))))
    ((hash equiv capacity weakness)
     (if hash
         (let ((hash (if (pair? hash) (car hash) hash))) ;; why? - read spec
           (if weakness
               (cond
                ((memq weakness (weak-hashtables-supported))
                 (if capacity
                     ((make-weak-hashtable-procedure weakness) hash equiv
                                                               capacity)
                     ((make-weak-hashtable-procedure weakness) hash equiv)))
                ((memq weakness (ephemeral-hashtables-supported))
                 (if capacity
                     ((make-ephemeral-hashtable-procedure weakness) hash equiv
                                                                    capacity)
                     ((make-ephemeral-hashtable-procedure weakness) hash equiv)))
                (else (error 'make-hashtable "weakness not supported" weakness)))
               (if capacity
                   (rnrs:make-hashtable hash equiv capacity)
                   (rnrs:make-hashtable hash equiv))))
         (cond                          ; hash function not provided
          ((eq? equiv eq?)
           (make-eq-hashtable capacity weakness))
          ((eq? equiv eqv?)
           (make-eqv-hashtable capacity weakness))
          (else (error 'make-hashtable
                       "hash procedure cannot be #f except with eq? or eqv?"
                       hash equiv)))))))

(define (alist->eq-hashtable . args)
  (apply alist->hashtable #f eq? args))

(define (alist->eqv-hashtable . args)
  (apply alist->hashtable #f eqv? args))

(define alist->hashtable
  (case-lambda
    ((hash equiv alist)
     (alist->hashtable hash equiv #f #f alist))
    ((hash equiv capacity alist)
     (alist->hashtable hash equiv capacity #f alist))
    ((hash equiv capacity weakness alist)
     (let ((hashtable (make-hashtable hash equiv capacity weakness)))
       (for-each (lambda (entry)
                   (hashtable-set! hashtable (car entry) (cdr entry)))
                 (reverse alist))
       hashtable))))

(define-enumeration weakness
  (weak-key
   weak-value
   weak-key-and-value
   ephemeral-key
   ephemeral-value
   ephemeral-key-and-value)
  weakness-set)

#;(define hashtable? rnrs:hashtable?)

#;(define hashtable-size rnrs:hashtable-size)

(define nil (cons #f #f))
(define (nil? obj) (eq? obj nil))

(define hashtable-ref
  (case-lambda
    ((hashtable key)
     (let ((value (rnrs:hashtable-ref hashtable key nil)))
       (if (nil? value)
           (error "No such key in hashtable." hashtable key)
           value)))
    ((hashtable key default)
     (rnrs:hashtable-ref hashtable key default))))

#;(define hashtable-set! rnrs:hashtable-set!)

#;(define hashtable-delete! rnrs:hashtable-delete!)

#;(define hashtable-contains? rnrs:hashtable-contains?)

(define (hashtable-lookup hashtable key)
  (let ((value (rnrs:hashtable-ref hashtable key nil)))
    (if (nil? value)
        (values #f #f)
        (values value #t))))

(define hashtable-update!
  (case-lambda
    ((hashtable key proc)
     (rnrs:hashtable-update! hashtable key
                             (lambda (value)
                               (if (nil? value)
                                   (error "No such key in hashtable."
                                          hashtable key)
                                   (proc value)))
                             nil))
    ((hashtable key proc default)
     (rnrs:hashtable-update! hashtable key proc default))))

(define (hashtable-intern! hashtable key default-proc)
  (if (hashtable-cell-support)
      (let ((cell (hashtable-cell hashtable key nil)))
        (if (nil? (hashtable-cell-value cell))
            (let ((value (default-proc)))
              (set-hashtable-cell-value! cell value)
              value)
            (hashtable-cell-value cell)))
      (let ((value (rnrs:hashtable-ref hashtable key nil)))
        (if (nil? value)
            (let ((value (default-proc)))
              (hashtable-set! hashtable key value)
              value)
            value))))

(define hashtable-copy
  (case-lambda
    ((hashtable) (hashtable-copy hashtable #f #f))
    ((hashtable mutable) (hashtable-copy hashtable mutable #f))
    ((hashtable mutable weakness)
     (when weakness
       (error 'hashtable-copy "No weak or ephemeral tables supported."))
     (rnrs:hashtable-copy hashtable mutable))))

(define hashtable-clear!
  (case-lambda
    ((hashtable) (rnrs:hashtable-clear! hashtable))
    ((hashtable capacity)
     (if capacity
         (cond-expand
          (ikarus (rnrs:hashtable-clear! hashtable))
          (else (rnrs:hashtable-clear! hashtable capacity)))
         (rnrs:hashtable-clear! hashtable)))))

(define hashtable-empty-copy
  (case-lambda
    ((hashtable) (hashtable-empty-copy hashtable #f))
    ((hashtable capacity)
     (make-hashtable (hashtable-hash-function hashtable)
                     (hashtable-equivalence-function hashtable)
                     (if (eq? #t capacity)
                         (hashtable-size hashtable)
                         capacity)
                     (hashtable-weakness hashtable)))))

#;(define hashtable-keys rnrs:hashtable-keys)

;;; Defined in helpers.sls

;; (define (hashtable-values hashtable)
;;     (let-values (((keys values) (hashtable-entries hashtable)))
;;       values))

#;(define hashtable-entries rnrs:hashtable-entries)

(define (hashtable-key-list hashtable)
  (hashtable-map->lset hashtable (lambda (key value) key)))

(define (hashtable-value-list hashtable)
  (hashtable-map->lset hashtable (lambda (key value) value)))

(define (hashtable-entry-lists hashtable)
  (let ((keys '())
        (vals '()))
    (hashtable-walk hashtable
      (lambda (key val)
        (set! keys (cons key keys))
        (set! vals (cons val vals))))
    (values keys vals)))

;;; XXX The procedures hashtable-walk, hashtable-update-all!, hashtable-prune!,
;;; and hashtable-sum should be implemented more efficiently at the platform
;;; level.  In particular, they should not allocate intermediate vectors or
;;; lists to hold the keys or values that are being operated on.

(define (hashtable-walk hashtable proc)
  (let-values (((keys values) (hashtable-entries hashtable)))
    (vector-for-each proc keys values)))

(define (hashtable-update-all! hashtable proc)
  (let-values (((keys values) (hashtable-entries hashtable)))
    (vector-for-each (lambda (key value)
                       (hashtable-set! hashtable key (proc key value)))
                     keys values)))

(define (hashtable-prune! hashtable proc)
  (let-values (((keys values) (hashtable-entries hashtable)))
    (vector-for-each (lambda (key value)
                       (when (proc key value)
                         (hashtable-delete! hashtable key)))
                     keys values)))

(define (hashtable-merge! hashtable-dest hashtable-source)
  (let-values (((keys values) (hashtable-entries hashtable-source)))
    (vector-for-each (lambda (key value)
                       (hashtable-set! hashtable-dest key value))
                     keys values))
  hashtable-dest)

(define (hashtable-sum hashtable init proc)
  (let-values (((keys vals) (hashtable-entries hashtable)))
    (let ((size (vector-length keys)))
      (let loop ((i 0) (result init))
        (if (fx>=? i size)
            result
            (loop (fx+ i 1) (proc (vector-ref keys i)
                                  (vector-ref vals i)
                                  result)))))))

(define (hashtable-map->lset hashtable proc)
  (let-values (((keys vals) (hashtable-entries hashtable)))
    (let ((size (vector-length keys)))
      (let loop ((i 0) (accumulator '()))
        (if (fx>=? i size)
            accumulator
            (loop (fx+ i 1) (cons (proc (vector-ref keys i) (vector-ref vals i))
                                  accumulator)))))))

;;; XXX If available, let-escape-continuation might be more efficient than
;;; call/cc here.
(define (hashtable-find hashtable proc)
  (call/cc
   (lambda (return)
     (hashtable-walk hashtable
       (lambda (key value)
         (when (proc key value)
           (return key value #t))))
     (return #f #f #f))))

(define (hashtable-empty? hashtable)
  (fxzero? (hashtable-size hashtable)))

;;; XXX A platform-level implementation could avoid allocating the constant true
;;; function and the lookup for the key in the delete operation.
(define (hashtable-pop! hashtable)
  (if (hashtable-empty? hashtable)
      (error "Cannot pop from empty hashtable." hashtable)
      (let-values (((key value found?)
                    (hashtable-find hashtable (lambda (k v) #t))))
        (hashtable-delete! hashtable key)
        (values key value))))

(define hashtable-inc!
  (case-lambda
    ((hashtable key) (hashtable-inc! hashtable key 1))
    ((hashtable key number)
     (hashtable-update! hashtable key (lambda (v) (+ v number)) 0))))

(define hashtable-dec!
  (case-lambda
    ((hashtable key) (hashtable-dec! hashtable key 1))
    ((hashtable key number)
     (hashtable-update! hashtable key (lambda (v) (- v number)) 0))))

#;(define hashtable-equivalence-function rnrs:hashtable-equivalence-function)

#;(define hashtable-hash-function rnrs-hashtable-hash-function)

;;; Defined in helpers.sls
#;(define (hashtable-weakness hashtable) #f)

#;(define hashtable-mutable? rnrs-hashtable-mutable?)

(define *hash-salt*
  (let ((seed (get-environment-variable "SRFI_126_HASH_SEED")))
    (if (or (not seed) (string=? seed ""))
        (random-integer (greatest-fixnum))
        (mod (string-hash seed) (greatest-fixnum)))))

(define (hash-salt) *hash-salt*)

#;(define equal-hash rnrs-equal-hash)

#;(define string-hash rnrs-string-hash)

#;(define string-ci-hash rnrs-string-ci-hash)

#;(define symbol-hash rnrs-symbol-hash)

;; Local Variables:
;; eval: (put 'hashtable-walk 'scheme-indent-function 1)
;; eval: (put 'hashtable-update-all! 'scheme-indent-function 1)
;; eval: (put 'hashtable-prune! 'scheme-indent-function 1)
;; eval: (put 'hashtable-sum 'scheme-indent-function 2)
;; eval: (put 'hashtable-map->lset 'scheme-indent-function 1)
;; eval: (put 'hashtable-find 'scheme-indent-function 1)
;; End:
