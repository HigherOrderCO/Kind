;;; Copyright (C) John Cowan (2015). All Rights Reserved.
;;; 
;;; Permission is hereby granted, free of charge, to any person
;;; obtaining a copy of this software and associated documentation
;;; files (the "Software"), to deal in the Software without
;;; restriction, including without limitation the rights to use,
;;; copy, modify, merge, publish, distribute, sublicense, and/or
;;; sell copies of the Software, and to permit persons to whom the
;;; Software is furnished to do so, subject to the following
;;; conditions:
;;; 
;;; The above copyright notice and this permission notice shall be
;;; included in all copies or substantial portions of the Software.
;;; 
;;; THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
;;; EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
;;; OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
;;; NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
;;; HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
;;; WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
;;; FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
;;; OTHER DEALINGS IN THE SOFTWARE. 

;;;; Main part of the SRFI 114 reference implementation

;;; "There are two ways of constructing a software design: One way is to
;;; make it so simple that there are obviously no deficiencies, and the
;;; other way is to make it so complicated that there are no *obvious*
;;; deficiencies." --Tony Hoare

;;; Syntax (because syntax must be defined before it is used, contra Dr. Hardcase)

;; Arithmetic if
(define-syntax comparator-if<=>
  (syntax-rules ()
    ((if<=> a b less equal greater)
     (comparator-if<=> (make-default-comparator) a b less equal greater))
    ((comparator-if<=> comparator a b less equal greater)
     (cond
       ((=? comparator a b) equal)
       ((<? comparator a b) less)
       (else greater)))))

;; Upper bound of hash functions is 2^25-1
(define-syntax hash-bound
  (syntax-rules ()
    ((hash-bound) 33554432)))

(define %salt% (make-parameter 16064047))

(define-syntax hash-salt
   (syntax-rules ()
     ((hash-salt) (%salt%))))

(define-syntax with-hash-salt
  (syntax-rules ()
    ((with-hash-salt new-salt hash-func obj)
     (parameterize ((%salt% new-salt)) (hash-func obj)))))

;;; Definition of comparator records with accessors and basic comparator

(define-record-type comparator
  (make-raw-comparator type-test equality ordering hash ordering? hash?)
  comparator?
  (type-test comparator-type-test-predicate)
  (equality comparator-equality-predicate)
  (ordering comparator-ordering-predicate)
  (hash comparator-hash-function)
  (ordering? comparator-ordered?)
  (hash? comparator-hashable?))

;; Public constructor
(define (make-comparator type-test equality ordering hash)
  (make-raw-comparator
    (if (eq? type-test #t) (lambda (x) #t) type-test)
    (if (eq? equality #t) (lambda (x y) (eqv? (ordering x y) 0)) equality)
    (if ordering ordering (lambda (x y) (error #f "ordering not supported")))
    (if hash hash (lambda (x y) (error #f "hashing not supported")))
    (if ordering #t #f)
    (if hash #t #f)))

;;; Invokers

;; Invoke the test type
(define (comparator-test-type comparator obj)
  ((comparator-type-test-predicate comparator) obj))

;; Invoke the test type and throw an error if it fails
(define (comparator-check-type comparator obj)
  (if (comparator-test-type comparator obj)
    #t
    (error #f "comparator type check failed" comparator obj)))

;; Invoke the hash function
(define (comparator-hash comparator obj)
  ((comparator-hash-function comparator) obj))

;;; Comparison predicates

;; Binary versions for internal use

(define (binary=? comparator a b)
  ((comparator-equality-predicate comparator) a b))

(define (binary<? comparator a b)
  ((comparator-ordering-predicate comparator) a b))

(define (binary>? comparator a b)
  (binary<? comparator b a))

(define (binary<=? comparator a b)
  (not (binary>? comparator a b)))

(define (binary>=? comparator a b)
  (not (binary<? comparator a b)))

;; General versions for export

(define (=? comparator a b . objs)
  (let loop ((a a) (b b) (objs objs))
    (and (binary=? comparator a b)
	 (if (null? objs) #t (loop b (car objs) (cdr objs))))))

(define (<? comparator a b . objs)
  (let loop ((a a) (b b) (objs objs))
    (and (binary<? comparator a b)
	 (if (null? objs) #t (loop b (car objs) (cdr objs))))))

(define (>? comparator a b . objs)
  (let loop ((a a) (b b) (objs objs))
    (and (binary>? comparator a b)
	 (if (null? objs) #t (loop b (car objs) (cdr objs))))))

(define (<=? comparator a b . objs)
  (let loop ((a a) (b b) (objs objs))
    (and (binary<=? comparator a b)
	 (if (null? objs) #t (loop b (car objs) (cdr objs))))))

(define (>=? comparator a b . objs)
  (let loop ((a a) (b b) (objs objs))
    (and (binary>=? comparator a b)
	 (if (null? objs) #t (loop b (car objs) (cdr objs))))))


;;; Simple ordering and hash functions

(define (boolean<? a b)
  ;; #f < #t but not otherwise
  (and (not a) b))


(define (boolean-hash obj)
  (if obj (%salt%) 0))

(define (char-hash obj)
  (modulo (* (%salt%) (char->integer obj)) (hash-bound)))

(define (char-ci-hash obj)
  (modulo (* (%salt%) (char->integer (char-foldcase obj))) (hash-bound)))

(define (number-hash obj)
  (cond
    ((nan? obj) (%salt%))
    ((and (infinite? obj) (positive? obj)) (* 2 (%salt%)))
    ((infinite? obj) (* (%salt%) 3))
    ((real? obj) (abs (exact (round obj))))
    (else (+ (number-hash (real-part obj)) (number-hash (imag-part obj))))))

;; Lexicographic ordering of complex numbers
(define (complex<? a b)
  (if (= (real-part a) (real-part b))
    (< (imag-part a) (imag-part b))
    (< (real-part a) (real-part b))))

;; already defined in (rnrs hashtables)
#;(define (string-ci-hash obj)
    (string-hash (string-foldcase obj)))

(define (symbol<? a b) (string<? (symbol->string a) (symbol->string b)))

;; already defined in (rnrs hashtables)
#;(define (symbol-hash obj)
  (string-hash (symbol->string obj)))

;;; Wrapped equality predicates
;;; These comparators don't have ordering functions.

(define (make-eq-comparator)
  (make-comparator #t eq? #f default-hash))

(define (make-eqv-comparator)
  (make-comparator #t eqv? #f default-hash))

(define (make-equal-comparator)
  (make-comparator #t equal? #f default-hash))

;;; Sequence ordering and hash functions
;; The hash functions are based on djb2, but
;; modulo 2^25 instead of 2^32 in hopes of sticking to fixnums.

(define (make-hasher)
  (let ((result (%salt%)))
    (case-lambda
     (() result)
     ((n) (set! result (+ (modulo (* result 33) (hash-bound)) n))
          result))))

;;; Pair comparator
(define (make-pair-comparator car-comparator cdr-comparator)
   (make-comparator
     (make-pair-type-test car-comparator cdr-comparator)
     (make-pair=? car-comparator cdr-comparator)
     (make-pair<? car-comparator cdr-comparator)
     (make-pair-hash car-comparator cdr-comparator)))

(define (make-pair-type-test car-comparator cdr-comparator)
  (lambda (obj)
    (and (pair? obj)
         (comparator-test-type car-comparator (car obj))
         (comparator-test-type cdr-comparator (cdr obj)))))

(define (make-pair=? car-comparator cdr-comparator)
   (lambda (a b)
     (and ((comparator-equality-predicate car-comparator) (car a) (car b))
          ((comparator-equality-predicate cdr-comparator) (cdr a) (cdr b)))))

(define (make-pair<? car-comparator cdr-comparator)
   (lambda (a b)
      (if (=? car-comparator (car a) (car b))
        (<? cdr-comparator (cdr a) (cdr b))
        (<? car-comparator (car a) (car b)))))

(define (make-pair-hash car-comparator cdr-comparator)
   (lambda (obj)
     (let ((acc (make-hasher)))
       (acc (comparator-hash car-comparator (car obj)))
       (acc (comparator-hash cdr-comparator (cdr obj)))
       (acc))))

;;; List comparator

;; Cheap test for listness
(define (norp? obj) (or (null? obj) (pair? obj)))

(define (make-list-comparator element-comparator type-test empty? head tail)
   (make-comparator
     (make-list-type-test element-comparator type-test empty? head tail)
     (make-list=? element-comparator type-test empty? head tail)
     (make-list<? element-comparator type-test empty? head tail)
     (make-list-hash element-comparator type-test empty? head tail)))


(define (make-list-type-test element-comparator type-test empty? head tail)
  (lambda (obj)
    (and
      (type-test obj)
      (let ((elem-type-test (comparator-type-test-predicate element-comparator)))
        (let loop ((obj obj))
          (cond
            ((empty? obj) #t)
            ((not (elem-type-test (head obj))) #f)
            (else (loop (tail obj)))))))))

(define (make-list=? element-comparator type-test empty? head tail)
  (lambda (a b)
    (let ((elem=? (comparator-equality-predicate element-comparator)))
      (let loop ((a a) (b b))
        (cond
          ((and (empty? a) (empty? b) #t))
          ((empty? a) #f)
          ((empty? b) #f)
          ((elem=? (head a) (head b)) (loop (tail a) (tail b)))
          (else #f))))))

(define (make-list<? element-comparator type-test empty? head tail)
  (lambda (a b)
    (let ((elem=? (comparator-equality-predicate element-comparator))
          (elem<? (comparator-ordering-predicate element-comparator)))
      (let loop ((a a) (b b))
        (cond
          ((and (empty? a) (empty? b) #f))
          ((empty? a) #t)
          ((empty? b) #f)
          ((elem=? (head a) (head b)) (loop (tail a) (tail b)))
          ((elem<? (head a) (head b)) #t)
          (else #f))))))

(define (make-list-hash element-comparator type-test empty? head tail)
  (lambda (obj)
    (let ((elem-hash (comparator-hash-function element-comparator))
          (acc (make-hasher)))
      (let loop ((obj obj))
        (cond
          ((empty? obj) (acc))
          (else (acc (elem-hash (head obj))) (loop (tail obj))))))))


;;; Vector comparator

(define (make-vector-comparator element-comparator type-test length ref)
     (make-comparator
       (make-vector-type-test element-comparator type-test length ref)
       (make-vector=? element-comparator type-test length ref)
       (make-vector<? element-comparator type-test length ref)
       (make-vector-hash element-comparator type-test length ref)))

(define (make-vector-type-test element-comparator type-test length ref)
  (lambda (obj)
    (and
      (type-test obj)
      (let ((elem-type-test (comparator-type-test-predicate element-comparator))
            (len (length obj)))
        (let loop ((n 0))
          (cond
            ((= n len) #t)
            ((not (elem-type-test (ref obj n))) #f)
            (else (loop (+ n 1)))))))))

(define (make-vector=? element-comparator type-test length ref)
   (lambda (a b)
     (and
       (= (length a) (length b))
       (let ((elem=? (comparator-equality-predicate element-comparator))
             (len (length b)))
         (let loop ((n 0))
           (cond
             ((= n len) #t)
             ((elem=? (ref a n) (ref b n)) (loop (+ n 1)))
             (else #f)))))))

(define (make-vector<? element-comparator type-test length ref)
   (lambda (a b)
     (cond
       ((< (length a) (length b)) #t)
       ((> (length a) (length b)) #f)
        (else
         (let ((elem=? (comparator-equality-predicate element-comparator))
             (elem<? (comparator-ordering-predicate element-comparator))
             (len (length a)))
         (let loop ((n 0))
           (cond
             ((= n len) #f)
             ((elem=? (ref a n) (ref b n)) (loop (+ n 1)))
             ((elem<? (ref a n) (ref b n)) #t)
             (else #f))))))))

(define (make-vector-hash element-comparator type-test length ref)
  (lambda (obj)
    (let ((elem-hash (comparator-hash-function element-comparator))
          (acc (make-hasher))
          (len (length obj)))
      (let loop ((n 0))
        (cond
          ((= n len) (acc))
          (else (acc (elem-hash (ref obj n))) (loop (+ n 1))))))))

;; already defined in (rnrs hashtables)
#;(define (string-hash obj)
  (let ((acc (make-hasher))
        (len (string-length obj)))
    (let loop ((n 0))
      (cond
        ((= n len) (acc))
        (else (acc (char->integer (string-ref obj n))) (loop (+ n 1)))))))

