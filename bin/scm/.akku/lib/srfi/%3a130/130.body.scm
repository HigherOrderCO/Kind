;;; Copyright (C) William D Clinger (2016).
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

;;; For convenient interoperation with SRFI 13,
;;; cursors ought to be the same as indexes.

;;; Some of the FIXME comments mark procedures that really ought
;;; to do more checking for "is an error" situations.

;; added for chez scheme support
(define string->vector
  (lambda (str)
    (let ([len (string-length str)])
      (let ([v (make-vector len)])
        (do ([i (fx- len 1) (fx- i 1)])
            ((fx=? i -1))
          (vector-set! v i (string-ref str i)))
        v))))

(define (string-cursor? x)
  (and (and (integer? x) (exact? x))
       (>= x 0)))

(define (string-cursor-start s) 0)
(define (string-cursor-end s) (string-length s))
(define (string-cursor-next s curs) (+ curs 1))                         ; FIXME
(define (string-cursor-prev s curs) (- curs 1))                         ; FIXME
(define (string-cursor-forward s curs n) (+ curs n))                    ; FIXME
(define (string-cursor-back s curs n) (- curs n))                       ; FIXME
(define (string-cursor=? curs1 curs2) (= curs1 curs2))
(define (string-cursor<? curs1 curs2) (< curs1 curs2))
(define (string-cursor>? curs1 curs2) (> curs1 curs2))
(define (string-cursor<=? curs1 curs2) (<= curs1 curs2))
(define (string-cursor>=? curs1 curs2) (>= curs1 curs2))
(define (string-cursor-diff s start end) (- end start))                 ; FIXME
(define (string-cursor->index s curs) curs)
(define (string-index->cursor s idx) idx)

(define string->list/cursors string->list)
(define string->vector/cursors string->vector)

(define string-ref/cursor string-ref)
(define substring/cursors substring)
(define string-copy/cursors string-copy)

;;; The SRFI 13 procedures return #f sometimes, so they can't be the same
;;; even if cursors are the same as indexes.
;;; Furthermore string-index-right and string-skip-right return the
;;; successor of the cursor for the character found.

(define string-index
  (case-lambda
   ((s pred)
    (string-index s pred 0 (string-length s)))
   ((s pred start)
    (string-index s pred start (string-length s)))
   ((s pred start end)
    (or (srfi-13:string-index s pred start end)
        end))))

(define string-index-right
  (case-lambda
   ((s pred)
    (string-index-right s pred 0 (string-length s)))
   ((s pred start)
    (string-index-right s pred start (string-length s)))
   ((s pred start end)
    (let ((i (srfi-13:string-index-right s pred start end)))
      (if i (+ i 1) start)))))

(define (string-skip s pred . rest)
  (apply string-index s (lambda (x) (not (pred x))) rest))

(define (string-skip-right s pred . rest)
  (apply string-index-right s (lambda (x) (not (pred x))) rest))

;;; FIXME: inefficient

(define string-contains-right
  (case-lambda
   ((s1 s2)
    (string-contains-right s1 s2 0 (string-length s1) 0 (string-length s2)))
   ((s1 s2 start1)
    (string-contains-right s1 s2
                           start1 (string-length s1) 0 (string-length s2)))
   ((s1 s2 start1 end1)
    (string-contains-right s1 s2 start1 end1 0 (string-length s2)))
   ((s1 s2 start1 end1 start2)
    (string-contains-right s1 s2 start1 end1 start2 (string-length s2)))
   ((s1 s2 start1 end1 start2 end2)
    (if (= start2 end2)
        end1
        (let loop ((i #f)
                   (j (string-contains s1 s2 start1 end1 start2 end2)))
          (if (and j (< j end1))
              (loop j (string-contains s1 s2 (+ j 1) end1 start2 end2))
              i))))))

(define string-for-each-cursor
  (case-lambda
   ((proc s)
    (string-for-each-cursor proc s 0 (string-length s)))
   ((proc s start)
    (string-for-each-cursor proc s start (string-length s)))
   ((proc s start end)
    (do ((i start (+ i 1)))
        ((>= i end))
      (proc i)))))

(define string-replicate
  (case-lambda
   ((s from to start end)
    (string-replicate (substring s start end) from to))
   ((s from to start)
    (string-replicate (substring s start (string-length s)) from to))
   ((s from to)
    (let* ((n (- to from))
           (len (string-length s)))
      (cond ((= n 0)
             "")
            ((or (< n 0)
                 (= len 0))
             (assertion-violation 'string-replicate
                                  "unexpected arguments"
                                  s from to))
            (else
             (let* ((from (mod from len)) ; make from non-negative
                    (to (+ from n)))
               (do ((replicates '() (cons s replicates))
                    (replicates-length 0 (+ replicates-length len)))
                   ((>= replicates-length to)
                    (substring (apply string-append replicates)
                               from to))))))))))

(define string-split
  (case-lambda
   ((s delimiter grammar limit start end)
    (string-split (substring s start end) delimiter grammar limit))
   ((s delimiter grammar limit start)
    (string-split (substring s start (string-length s))
                  delimiter grammar limit))
   ((s delimiter)
    (string-split s delimiter 'infix #f))
   ((s delimiter grammar)
    (string-split s delimiter grammar #f))
   ((s delimiter grammar limit)
    (define (complain)
      (assertion-violation 'string-split
                           "unexpected arguments"
                           s delimiter grammar limit))
    (let* ((limit (or limit (string-length s)))
           (splits
            (cond ((= 0 (string-length delimiter))
                   (string-split-into-characters s limit))
                  (else
                   (string-split-using-word s delimiter limit)))))
      (case grammar
       ((infix strict-infix)
        (if (= 0 (string-length s))
            (if (eq? grammar 'infix)
                '()
                (complain))
            splits))
       ((prefix)
        (if (and (pair? splits)
                 (= 0 (string-length (car splits))))
            (cdr splits)
            splits))
       ((suffix)
        (if (and (pair? splits)
                 (= 0 (string-length (car (last-pair splits)))))
            (reverse (cdr (reverse splits)))
            splits))
       (else
        (complain)))))))

(define (string-split-into-characters s limit)
  (let ((n (string-length s)))
    (cond ((> n (+ limit 1))
           (append (string-split-into-characters (substring s 0 limit) limit)
                   (substring s limit n)))
          (else
           (map string (string->list s))))))

;;; FIXME: inefficient

(define (string-split-using-word s sep limit)
  (cond ((= 0 limit)
         (list s))
        (else
         (let ((i (string-contains s sep)))
           (if i
               (cons (substring s 0 i)
                     (string-split-using-word
                      (substring s (+ i (string-length sep)) (string-length s))
                      sep
                      (- limit 1)))
               (list s))))))

(define (string-remove pred s . args)
  (apply string-filter
         (lambda (c) (not (pred c)))
         s
         args))

