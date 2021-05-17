;;;; Implementation of list-queue SRFI
;;;;
;;;; Copyright (C) John Cowan (2015, 2016). All Rights Reserved.
;;;;
;;;; Permission is hereby granted, free of charge, to any person obtaining a copy of
;;;; this software and associated documentation files (the "Software"), to deal in
;;;; the Software without restriction, including without limitation the rights to
;;;; use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
;;;; of the Software, and to permit persons to whom the Software is furnished to do
;;;; so, subject to the following conditions:
;;;;
;;;; The above copyright notice and this permission notice shall be included in all
;;;; copies or substantial portions of the Software.
;;;;
;;;; THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
;;;; IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
;;;; FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
;;;; AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
;;;; LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
;;;; OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
;;;; SOFTWARE.

;;;; Later modified from the R7RS SRFI-117 reference implementation for
;;;; possible inclusion within the R6RS https://github.com/arcfide/chez-srfi.

;;; R7RS shims.  Comment these out on an R7RS system.
;;; [John Cowan] stole this code from Chibi Scheme, which is BSD-licensed.

(define (make-list n . o)
  (let ((default (if (pair? o) (car o))))
    (let lp ((n n) (res '()))
      (if (<= n 0) res (lp (- n 1) (cons default res))))))

(define (list-copy ls)
  (let lp ((ls ls) (res '()))
    (if (pair? ls)
        (lp (cdr ls) (cons (car ls) res))
        (append (reverse res) ls))))

(define (list-set! ls k x)
  (cond ((null? ls) (error "invalid list index"))
        ((zero? k) (set-car! ls x))
        (else (list-set! (cdr ls) (- k 1) x))))

;;; This definition is from Chibi's SRFI-1 implementation.

(define (last-pair ls) (if (null? (cdr ls)) ls (last-pair (cdr ls))))

;;; This definition of map! isn't fully SRFI-1 compliant, as it
;;; handles only unary functions.  You can use SRFI-1's definition
;;; if you want.

(define (map! f lis)
  (let lp ((lis lis))
    (if (pair? lis)
      (begin
        (set-car! lis (f (car lis)))
        (lp (cdr lis))))))

;;; The list-queue record
;;; The invariant is that either first is (the first pair of) a list
;;; and last is the last pair, or both of them are the empty list.

(define-record-type
  (<list-queue> raw-make-list-queue list-queue?)
  (fields
    (mutable first get-first set-first!)
    (mutable last get-last set-last!)))

;;; Constructors

(define make-list-queue
  (case-lambda
    ((list)
     (if (null? list)
       (raw-make-list-queue '() '())
       (raw-make-list-queue list (last-pair list))))
    ((list last)
     (raw-make-list-queue list last))))

(define (list-queue . objs)
  (make-list-queue objs))

(define (list-queue-copy list-queue)
  (make-list-queue (list-copy (get-first list-queue))))

;;; Predicates

(define (list-queue-empty? list-queue)
  (null? (get-first list-queue)))

;;; Accessors

(define (list-queue-front list-queue)
  (if (list-queue-empty? list-queue)
    (error "Empty list-queue")
    (car (get-first list-queue))))

(define (list-queue-back list-queue)
  (if (list-queue-empty? list-queue)
    (error "Empty list-queue")
    (car (get-last list-queue))))

;;; Mutators (which carefully maintain the invariant)

(define (list-queue-add-front! list-queue elem)
  (let ((new-first (cons elem (get-first list-queue))))
    (if (list-queue-empty? list-queue)
      (set-last! list-queue new-first))
    (set-first! list-queue new-first)))

(define (list-queue-add-back! list-queue elem)
  (let ((new-last (list elem)))
    (if (list-queue-empty? list-queue)
      (set-first! list-queue new-last)
      (set-cdr! (get-last list-queue) new-last))
    (set-last! list-queue new-last)))

(define (list-queue-remove-front! list-queue)
  (if (list-queue-empty? list-queue)
    (error "Empty list-queue"))
  (let* ((old-first (get-first list-queue))
         (elem (car old-first))
         (new-first (cdr old-first)))
    (if (null? new-first)
      (set-last! list-queue '()))
    (set-first! list-queue new-first)
    elem))

(define (list-queue-remove-back! list-queue)
  (if (list-queue-empty? list-queue)
    (error "Empty list-queue"))
  (let* ((old-last (get-last list-queue))
         (elem (car old-last))
         (new-last (penult-pair (get-first list-queue))))
    (if (null? new-last)
      (set-first! list-queue '())
      (set-cdr! new-last '()))
    (set-last! list-queue new-last)
    elem))

(define (list-queue-remove-all! list-queue)
   (let ((result (get-first list-queue)))
      (set-first! list-queue '())
      (set-last! list-queue '())
      result))

;; Return the next to last pair of lis, or nil if there is none

(define (penult-pair lis)
  (let lp ((lis lis))
    (cond
     ;((null? lis) (error "Empty list-queue"))
      ((null? (cdr lis)) '())
      ((null? (cddr lis)) lis)
      (else (lp (cdr lis))))))

;;; The whole list-queue

;; Because append does not copy its back argument, we cannot use it
(define (list-queue-append . list-queues)
  (list-queue-concatenate list-queues))

(define (list-queue-concatenate list-queues)
  (let ((result (list-queue)))
    (for-each
      (lambda (list-queue)
        (for-each (lambda (elem) (list-queue-add-back! result elem)) (get-first list-queue)))
      list-queues)
     result))

(define list-queue-append!
  (case-lambda
    (() (list-queue))
    ((queue) queue)
    (queues
      (for-each (lambda (queue) (list-queue-join! (car queues) queue))
                (cdr queues))
      (car queues))))

; Forcibly join two queues, destroying the second
(define (list-queue-join! queue1 queue2)
  (set-cdr! (get-last queue1) (get-first queue2)))

(define (list-queue-map proc list-queue)
  (make-list-queue (map proc (get-first list-queue))))

(define list-queue-unfold
  (case-lambda
    ((stop? mapper successor seed queue)
     (list-queue-unfold* stop? mapper successor seed queue))
    ((stop? mapper successor seed)
     (list-queue-unfold* stop? mapper successor seed (list-queue)))))

(define (list-queue-unfold* stop? mapper successor seed queue)
  (let loop ((seed seed))
    (if (not (stop? seed))
      (list-queue-add-front! (loop (successor seed)) (mapper seed)))
    queue))

(define list-queue-unfold-right
  (case-lambda
    ((stop? mapper successor seed queue)
     (list-queue-unfold-right* stop? mapper successor seed queue))
    ((stop? mapper successor seed)
     (list-queue-unfold-right* stop? mapper successor seed (list-queue)))))

(define (list-queue-unfold-right* stop? mapper successor seed queue)
  (let loop ((seed seed))
    (if (not (stop? seed))
      (list-queue-add-back! (loop (successor seed)) (mapper seed)))
    queue))

(define (list-queue-map! proc list-queue)
  (map! proc (get-first list-queue)))

(define (list-queue-for-each proc list-queue)
  (for-each proc (get-first list-queue)))

;;; Conversion

(define (list-queue-list list-queue)
  (get-first list-queue))

(define (list-queue-first-last list-queue)
  (values (get-first list-queue) (get-last list-queue)))

(define list-queue-set-list!
  (case-lambda
    ((list-queue first)
     (set-first! list-queue first)
     (if (null? first)
       (set-last! list-queue '())
       (set-last! list-queue (last-pair first))))
    ((list-queue first last)
     (set-first! list-queue first)
     (set-last! list-queue last))))
