;;;; Persistent Hash Map

;;; Copyright MMXV-MMXVII Arthur A. Gleckler.  All rights reserved.

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
#!r6rs
(library (srfi srfi-146 hamt-map)
  (export make-phm phm?
	  phm->alist
	  phm/add-alist phm/add-alist!
	  phm/contains?
	  phm/count
	  phm/empty?
	  phm/for-each
	  phm/get
	  phm/immutable
	  phm/keys
	  phm/mutable phm/mutable?
	  phm/put
	  phm/put!
	  phm/remove phm/remove!
	  phm/replace phm/replace!

	  ;; This is only needed by tests:
	  phm/data)
  (import (except (rnrs) assert)
	  (only (srfi :1) fold)
	  (srfi :16)
	  (srfi :146 gleckler hamt)
	  (srfi :146 gleckler hamt-misc))


;;; Public protocol (API)

  ;; (phm? datum)

  ;;   Return true iff `datum' is a persistent hash map.

  ;; (make-phm hash = [alist])

  ;;   Return a new immutable persistent hash map that uses the `hash'
  ;;   procedure to hash its keys and `=' to compare them.  If `alist'
  ;;   is supplied, include all its keys and data in the result.  Later
  ;;   occurrences of the same key override earlier ones.

  ;; (phm/count phm)

  ;;   Return the number of elements in `phm'.

  ;; (phm/empty? phm)

  ;;   Return true iff `phm' is empty.

  ;; (phm/immutable phm)
  ;; (phm/immutable phm replace)

  ;;   Return a PHM equivalent to `phm', but that is immutable.  Even if
  ;;   `phm' is mutable, no change to it will affect the returned one.
  ;;   If `replace' is supplied, replace the datum associated with each
  ;;   key whose value has been modified since the PHM was made mutable
  ;;   with the result of calling `replace' on that key and datum.  This
  ;;   is useful for converting PHSs (sets) stored as values in a PHM
  ;;   back into immutable ones when the containing PHM is made
  ;;   immutable.

  ;; (phm/mutable phm)

  ;;   Return a PHM equivalent to `phm', but that is mutable.  If `phm'
  ;;   was immutable, no change to the returned PHM will affect `phm'.

  ;; (phm/mutable? phm)

  ;;   Return true iff `phm' is mutable.

  ;; (phm/put phm key datum)

  ;;   Return a PHM equivalent to `phm' except that `datum' is at `key'.

  ;; (phm/put! phm key datum)

  ;;   Return a PHM equivalent to `phm' except that `datum' is at `key'.
  ;;   Modify `phm', which must be mutable, in the process.

  ;; (phm/replace phm key replace)

  ;;   Return a PHM equivalent to `phm' except that whatever value is at
  ;;   `key' has been replaced by `(replace datum)', or `(replace
  ;;   hamt-null)' if there was no value there already.  If `replace'
  ;;   returns `hamt-null', the value is removed.

  ;; (phm/replace! phm key replace)

  ;;   Return a PHM equivalent to `phm' except that whatever value is at
  ;;   `key' has been replaced by `(replace datum)', or `(replace
  ;;   hamt-null)' if there was no value there already.  If `replace'
  ;;   returns `hamt-null', the value is removed.  Modify `phm', which
  ;;   must be mutable, in the process.

  ;; (phm/get phm key [default])

  ;;   Return the datum stored at `key' in `phm'.  If none is present,
  ;;   return `default' if it was supplied, or #f if it was not.

  ;; (phm/contains? phm key)

  ;;   Return true iff `phm' has a datum at `key'.

  ;; (phm/remove phm key)

  ;;   Return a PHM equivalent to `phm' except that there is no datum at
  ;;   `key'.

  ;; (phm/remove! phm key)

  ;;   Return a PHM equivalent to `phm' except that there is no datum at
  ;;   `key'.  Modify `phm', which must be mutable, in the process.

  ;; (phm/add-alist phm alist)

  ;;   Return a PHM equivalent to `phm' except that, for every pair in
  ;;   `alist', the datum in its cdr is stored in the new PHM at the key
  ;;   in its car.  Later occurrences of the same key override earlier
  ;;   ones.

  ;; (phm/add-alist! phm alist)

  ;;   Return a PHM equivalent to `phm' except that, for every pair in
  ;;   `alist', the datum in its cdr is stored in the new PHM at the key
  ;;   in its car.  Later occurrences of the same key override earlier
  ;;   ones.  Modify `phm', which must be mutable, in the process.

  ;; (phm->alist phm)

  ;;   Return an alist mapping the keys in `phm' to their values.

  ;; (phm/keys phm)

  ;;   Return a list of the keys in `phm'.

  ;; (phm/for-each procedure phm)

  ;;   Run `procedure' on each key and datum in `phm'.

;;; Implementation of public protocol (API)

  (define (phm? datum)
    (and (hash-array-mapped-trie? datum)
         (hamt/payload? datum)))

  (define (make-phm-inner hash = alist)
    (let ((phm (make-hamt = hash #t)))
      (if (null? alist)
	  phm
	  (let ((phm-1 (phm/mutable phm)))
	    (phm/add-alist! phm-1 alist)
	    (phm/immutable phm-1)))))

  (define make-phm
    (case-lambda
      ((hash =) (make-phm-inner hash = '()))
      ((hash = alist) (make-phm-inner hash = alist))))

  (define (phm/count phm)
    (assert (phm? phm))
    (hamt/count phm))

  (define (phm/empty? phm)
    (assert (phm? phm))
    (hamt/empty? phm))

  (define phm/immutable
    (case-lambda
      ((phm)
       (assert (phm? phm))
       (hamt/immutable phm))
      ((phm replace)
       (assert (phm? phm))
       (hamt/immutable phm replace))))

  (define (phm/mutable phm)
    (assert (phm? phm))
    (hamt/mutable phm))

  (define (phm/mutable? phm)
    (assert (phm? phm))
    (hamt/mutable? phm))

  (define (phm/put phm key datum)
    (assert (phm? phm))
    (hamt/put phm key datum))

  (define (phm/put! phm key datum)
    (assert (phm? phm))
    (hamt/put! phm key datum))

  (define (phm/replace phm key replace)
    (assert (phm? phm))
    (hamt/replace phm key replace))

  (define (phm/replace! phm key replace)
    (assert (phm? phm))
    (hamt/replace! phm key replace))

  (define (phm/get-inner phm key default)
    (assert (phm? phm))
    (let ((result (hamt-fetch phm key)))
      (if (hamt-null? result)
	  default
	  result)))

  (define phm/get
    (case-lambda
      ((phm key) (phm/get-inner phm key #f))
      ((phm key default) (phm/get-inner phm key default))))

  (define (phm/contains? phm key)
    (assert (phm? phm))
    (not (hamt-null? (hamt-fetch phm key))))

  (define (phm/remove phm key)
    (assert (phm? phm))
    (phm/put phm key hamt-null))

  (define (phm/remove! phm key)
    (assert (phm? phm))
    (assert (hamt/mutable? phm))
    (phm/put! phm key hamt-null))

  (define (phm/add-alist phm alist)
    (assert (phm? phm))
    (fold (lambda (a phm) (phm/put phm (car a) (cdr a))) phm alist))

  (define (phm/add-alist! phm alist)
    (assert (phm? phm))
    (do-list (a alist)
             (phm/put! phm (car a) (cdr a)))
    phm)

  (define (phm->alist phm)
    (assert (phm? phm))
    (hamt->list phm cons))

  (define (phm/data phm)
    (assert (phm? phm))
    (hamt->list phm (lambda (k d) d)))

  (define (phm/keys phm)
    (assert (phm? phm))
    (hamt->list phm (lambda (k d) k)))

  (define (phm/for-each procedure phm)
    (assert (phm? phm))
    (hamt/for-each procedure phm)))
