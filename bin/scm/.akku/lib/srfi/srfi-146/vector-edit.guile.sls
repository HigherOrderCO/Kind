;;;; `vector-edit'

;;; Copyright MMIV-MMXV Arthur A. Gleckler.  All rights reserved.

;; Permission is hereby granted, free of charge, to any person
;; obtaining a copy of this software and associated documentation
;; files (the "Software"), to deal in the Software without
;; restriction, including without limitation the rights to use, copy,
;; modify, merge, publish, distribute, sublicense, and/or sell copies
;; of the Software, and to permit persons to whom the Software is
;; furnished to do so, subject to the following conditions:

;; The above copyright notice and this permission notice shall be
;; included in all copies or substantial portions of the Software.

;; THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
;; EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
;; MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
;; NONINFRINGEMENT.  IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
;; HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
;; WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
;; OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
;; DEALINGS IN THE SOFTWARE.

;;; `vector-edit' adds and/or removes elements from a vector
;;; non-destructively, i.e. by returning a new vector.  It maps
;;; offsets in the original vector to offsets in the new vector so
;;; that the caller doesn't have to perform these error-prone
;;; calculations itself.
#!r6rs
(library (srfi srfi-146 vector-edit)
  (export vector-edit vector-replace-one vector-without)
  (import (rnrs)
          (only (srfi :43) vector-copy! vector-copy))


  (define (vector-without v start end)
    "Return a copy of vector `v' without the elements with indices [start, end)."
    (let* ((size (vector-length v))
	   (gap-size (- end start))
	   (new-size (- size gap-size))
	   (result (make-vector new-size)))
      (vector-copy! result 0 v 0 start)
      (vector-copy! result start v end size)
      result))

  (define (vector-replace-one v i e)
    "Return a copy of vector `v' with the `i'th element replaced by `e'."
    (let ((result (vector-copy v)))
      (vector-set! result i e)
      result))

  (define-syntax vector-edit-total-skew
    (syntax-rules (add drop)
      ((_ s) s)
      ((_ s (add i e) . rest)
       (vector-edit-total-skew (+ s 1) . rest))
      ((_ s (drop i c) . rest)
       (vector-edit-total-skew (- s c) . rest))))

  (define-syntax vector-edit-code
    (syntax-rules (add drop)
      ((_ v r o s)
       (let ((index (vector-length v)))
         (vector-copy! r (+ o s) v o index)
         r))
      ((_ v r o s (add i e) . rest)
       (let ((index i))
         (vector-copy! r (+ o s) v o index)
         (vector-set! r (+ s index) e)
         (let ((skew (+ s 1)))
	   (vector-edit-code v r index skew . rest))))
      ((_ v r o s (drop i c) . rest)
       (let ((index i))
         (vector-copy! r (+ o s) v o index)
         (let* ((dropped c)
	        (offset (+ index dropped))
	        (skew (- s dropped)))
	   (vector-edit-code v r offset skew . rest))))))

  ;; <> Optimize this by allowing one to supply more than one value in
  ;; `add' sub-expressions so that adjacent values can be inserted
  ;; without extra computation.

  ;; Given a vector `v' and a set of `(add i e)' and `(drop i c)' forms,
  ;; return a new vector that is the result of applying insertions to
  ;; and deletions from `v'.  Interpret each `i' as an index into `v',
  ;; each `e' as an element to be inserted into the resulting vector at
  ;; the index corresponding to `i', and each `c' as a count of elements
  ;; of `v' to be dropped starting at index `i'.  The `i' values in the
  ;; `add' and `drop' forms must never decrease from left to right.
  ;; This is useful for doing insertions and deletions without
  ;; constructing an intermediate vector.
  (define-syntax vector-edit
    (syntax-rules ()
      ((_ v . rest)
       (let ((result (make-vector (+ (vector-length v)
				     (vector-edit-total-skew 0 . rest)))))
         (vector-edit-code v result 0 0 . rest))))))
