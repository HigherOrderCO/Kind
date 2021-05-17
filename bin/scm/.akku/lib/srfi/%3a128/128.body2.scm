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

;;; The default comparator

;;; Standard comparators and their functions

;; The unknown-object comparator, used as a fallback to everything else
;; Everything compares exactly the same and hashes to 0
(define unknown-object-comparator
  (make-comparator
    (lambda (obj) #t)
    (lambda (a b) #t)
    (lambda (a b) #f)
    (lambda (obj) 0)))

;; Next index for added comparator

(define first-comparator-index 9)
(define *next-comparator-index* 9)
(define *registered-comparators* (list unknown-object-comparator))

;; Register a new comparator for use by the default comparator.
(define (comparator-register-default! comparator)
  (set! *registered-comparators* (cons comparator *registered-comparators*))
  (set! *next-comparator-index* (+ *next-comparator-index* 1)))

;; Return ordinal for object types: null sorts before pairs, which sort
;; before booleans, etc.  Implementations can extend this.
;; People who call comparator-register-default! effectively do extend it.
(define (object-type obj)
  (cond
    ((null? obj) 0)
    ((pair? obj) 1)
    ((boolean? obj) 2)
    ((char? obj) 3)
    ((string? obj) 4)
    ((symbol? obj) 5)
    ((number? obj) 6)
    ((vector? obj) 7)
    ((bytevector? obj) 8)
    ; Add more here if you want: be sure to update comparator-index variables
    (else (registered-index obj))))

;; Return the index for the registered type of obj.
(define (registered-index obj)
  (let loop ((i 0) (registry *registered-comparators*))
    (cond
      ((null? registry) (+ first-comparator-index i))
      ((comparator-test-type (car registry) obj) (+ first-comparator-index i))
      (else (loop (+ i 1) (cdr registry))))))

;; Given an index, retrieve a registered conductor.
;; Index must be >= first-comparator-index.
(define (registered-comparator i)
  (list-ref *registered-comparators* (- i first-comparator-index)))

(define (dispatch-equality type a b)
  (case type
    ((0) #t) ; All empty lists are equal
    ((1) ((make-pair=? (make-default-comparator) (make-default-comparator)) a b))
    ((2) (boolean=? a b))
    ((3) (char=? a b))
    ((4) (string=? a b))
    ((5) (symbol=? a b))
    ((6) (= a b))
    ((7) ((make-vector=? (make-default-comparator)
                         vector? vector-length vector-ref) a b))
    ((8) ((make-vector=? (make-comparator exact-integer? = < default-hash)
                         bytevector? bytevector-length bytevector-u8-ref) a b))
    ; Add more here
    (else (binary=? (registered-comparator type) a b))))

(define (dispatch-ordering type a b)
  (case type
    ((0) 0) ; All empty lists are equal
    ((1) ((make-pair<? (make-default-comparator) (make-default-comparator)) a b))
    ((2) (boolean<? a b))
    ((3) (char<? a b))
    ((4) (string<? a b))
    ((5) (symbol<? a b))
    ((6) (complex<? a b))
    ((7) ((make-vector<? (make-default-comparator) vector? vector-length vector-ref) a b))
    ((8) ((make-vector<? (make-comparator exact-integer? = < default-hash)
			 bytevector? bytevector-length bytevector-u8-ref) a b))
    ; Add more here
    (else (binary<? (registered-comparator type) a b))))

;;; The author of SRFI 128 has suggested a post-finalization note
;;; saying the first and third bullet items stating "must" requirements
;;; for default-hash may be weakened.  That allows a much faster hash
;;; function to be used for lists and vectors.

(define (default-hash obj)
  (case (object-type obj)
    ((0 1 7) ; empty list, pair, or vector
     ((make-hasher) (equal-hash obj)))
    ((2) (boolean-hash obj))
    ((3) (char-hash obj))
    ((4) (string-hash obj))
    ((5) (symbol-hash obj))
    ((6) (number-hash obj))
    ((8) ((make-vector-hash (make-default-comparator)
                             bytevector? bytevector-length bytevector-u8-ref) obj))
    ; Add more here
    (else (comparator-hash (registered-comparator (object-type obj)) obj))))
  
(define (default-ordering a b)
  (let ((a-type (object-type a))
        (b-type (object-type b)))
    (cond
      ((< a-type b-type) #t)
      ((> a-type b-type) #f)
      (else (dispatch-ordering a-type a b)))))

(define (default-equality a b)
  (let ((a-type (object-type a))
        (b-type (object-type b)))
    (if (= a-type b-type) (dispatch-equality a-type a b) #f)))

(define (make-default-comparator)
  (make-comparator
    (lambda (obj) #t)
    default-equality
    default-ordering
    default-hash))

