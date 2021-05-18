#!r6rs
;; Copyright (C) William D Clinger 2008. All Rights Reserved.
;;
;; Permission is hereby granted, free of charge, to any person obtaining a copy
;; of this software and associated documentation files (the "Software"), to deal
;; in the Software without restriction, including without limitation the rights
;; to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
;; copies of the Software, and to permit persons to whom the Software is
;; furnished to do so, subject to the following conditions:
;;
;; The above copyright notice and this permission notice shall be included in
;; all copies or substantial portions of the Software.
;;
;; THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
;; IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
;; FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. REMEMBER, THERE IS NO
;; SCHEME UNDERGROUND. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
;; LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
;; CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
;; SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

(library (srfi :99 records inspection)

  (export record? record-rtd
          rtd-name rtd-parent
          rtd-field-names rtd-all-field-names rtd-field-mutable?)

  (import (rnrs base)
          (rnrs lists)
          (rnrs records inspection)
          (srfi :99 records helper))

  ; The record? predicate is already defined by (rnrs records inspection).
  
  ; The record-rtd procedure is already defined by (rnrs records inspection).
  
  (define rtd-name record-type-name)
  
  (define rtd-parent record-type-parent)
  
  (define rtd-field-names record-type-field-names)
  
  (define (rtd-all-field-names rtd)
    (define (loop rtd othernames)
      (let ((parent (rtd-parent rtd))
            (names (append (vector->list
                            (rtd-field-names rtd))
                           othernames)))
        (if parent
            (loop parent names)
            (list->vector names))))
    (loop rtd '()))
  
  (define (rtd-field-mutable? rtd0 fieldname)
    (define (loop rtd)
      (if (rtd? rtd)
          (let* ((names (vector->list (rtd-field-names rtd)))
                 (probe (memq fieldname names)))
            (if probe
                (record-field-mutable? rtd (- (length names) (length probe)))
                (loop (rtd-parent rtd))))
          (assertion-violation 'rtd-field-mutable?
                               "illegal argument" rtd0 fieldname)))
    (loop rtd0))

  )
