;;; The sort package -- general sort & merge procedures
;;;
;;; Copyright (c) 1998 by Olin Shivers.
;;; You may do as you please with this code, as long as you do not delete this
;;; notice or hold me responsible for any outcome related to its use.
;;; Olin Shivers 10/98.

;;; This file just defines the general sort API in terms of some
;;; algorithm-specific calls.

(define (list-sort < l)			; Sort lists by converting to
  (let ((v (list->vector l)))		; a vector and sorting that.
    (vector-heap-sort! < v)
    (vector->list v)))

(define list-sort! list-merge-sort!)

(define list-stable-sort  list-merge-sort)
(define list-stable-sort! list-merge-sort!)

(define vector-sort  vector-quick-sort)
(define vector-sort! vector-quick-sort!)

(define vector-stable-sort  vector-merge-sort)
(define vector-stable-sort! vector-merge-sort!)

