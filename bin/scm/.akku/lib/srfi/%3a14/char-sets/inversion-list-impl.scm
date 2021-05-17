; Part of Scheme 48 1.9.  See file COPYING for notices and license.

; Authors: Mike Sperber
; Copyright (c) 2005-2006 by Basis Technology Corporation. 

; Inversion lists are representations for sets of integers,
; represented as sorted sets of ranges.

; This was taken from Chapter 13 of Richard Gillam: Unicode Demystified.
; Mike doesn't know what the original source is.

; This was written as support code for the implementation of SRFI 14,
; which is why there's so many exports here nobody really needs.

(define-record-type inversion-list :inversion-list 
  (make-inversion-list min max
		       range-vector)
  inversion-list?
  ;; minimum element, needed for complement & difference
  (min inversion-list-min)
  ;; maximum element, needed size
  ;; we pretty much assume consistency for union / intersection for MIN and MAX
  (max inversion-list-max)
  ;; consecutive elements are paired to form ranges of the form
  ;; [ (vector-ref v i) (vector-ref v (+ 1 i)) )
  ;; (except the last one, possibly)
  (range-vector inversion-list-range-vector))

(define-record-discloser :inversion-list
  (lambda (r)
    (list 'inversion-list
	  (inversion-list-min r) (inversion-list-max r)
	  (inversion-list-range-vector r))))

(define (make-empty-inversion-list min max)
  (make-inversion-list min max '#()))

(define (inversion-list-member? n i-list)
  (let ((ranges (inversion-list-range-vector i-list)))
    (let loop ((low 0)
	       (high (vector-length ranges)))
      (if (< low high)
	  (let ((mid (quotient (+ low high) 2)))
	    (if (>= n (vector-ref ranges mid))
		(loop (+ 1 mid) high)
		(loop low mid)))
	  (odd? high)))))

(define (inversion-list-complement i-list)
  (let* ((ranges (inversion-list-range-vector i-list))
	 (min (inversion-list-min i-list))
	 (max (inversion-list-max i-list))
	 (size (vector-length ranges)))
    (make-inversion-list
     min max
     (cond
      ((zero? size)
       (vector min))
      ((not (= min (vector-ref ranges 0)))
       (if (and (even? size)
		(= max (vector-ref ranges (- size 1))))
	   (let ((result (make-vector size)))
	     (vector-set! result 0 min)
	     (vector-copy! ranges 0 result 1 (- size 1))
	     result)
	   (let ((result (make-vector (+ 1 size))))
	     (vector-set! result 0 min)
	     (vector-copy! ranges 0 result 1 size)
	     result)))
      ((and (even? size)
	    (= max (vector-ref ranges (- size 1))))
       (let ((result (make-vector (- size 2))))
	 (vector-copy! ranges 1 result 0 (- size 2))
	 result))
      (else
       (let ((result (make-vector (- size 1))))
	 (vector-copy! ranges 1 result 0 (- size 1))
	 result))))))

(define (make-inversion-list-union/intersection
	 proc-thunk ; for CALL-ERROR
	 write-increment-count write-decrement-count
	 process-first? decrement-count?
	 middle-increment
	 copy-extra-count)

  (lambda (i-list-1 i-list-2)
    (if (or (not (= (inversion-list-min i-list-1)
		    (inversion-list-min i-list-2)))
	    (not (= (inversion-list-max i-list-1)
		    (inversion-list-max i-list-2))))
	(assertion-violation 'make-inversion-list-union/intersection
			     "min/max mismatch" (proc-thunk) i-list-1 i-list-2))
    (let ((ranges-1 (inversion-list-range-vector i-list-1))
	  (ranges-2 (inversion-list-range-vector i-list-2))
	  (min (inversion-list-min i-list-1))
	  (max (inversion-list-max i-list-1)))

      (let ((size-1 (vector-length ranges-1))
	    (size-2 (vector-length ranges-2)))
	(let ((temp (make-vector (+ size-1 size-2))))

	  (let loop ((index-1 0) (index-2 0)
		     (count 0)
		     (index-result 0))

	    (if (and (< index-1 size-1)
		     (< index-2 size-2))
		(let ((el-1 (vector-ref ranges-1 index-1))
		      (el-2 (vector-ref ranges-2 index-2)))
		  (call-with-values
		      (lambda ()
			(if (or (< el-1 el-2)
				(and (= el-1 el-2)
				     (process-first? index-1)))
			    (values index-1 el-1 (+ 1 index-1) index-2)
			    (values index-2 el-2 index-1 (+ 1 index-2))))
		    (lambda (index el index-1 index-2)
		      (if (even? index)
			  (if (= write-increment-count count)
			      (begin
				(vector-set! temp index-result el)
				(loop index-1 index-2 (+ 1 count) (+ 1 index-result)))
			      (loop index-1 index-2 (+ 1 count) index-result))
			  (if (= write-decrement-count count)
			      (begin
				(vector-set! temp index-result el)
				(loop index-1 index-2 (- count 1) (+ 1 index-result)))
			      (loop index-1 index-2 (- count 1) index-result))))))
		(let* ((count
			(if (or (and (not (= index-1  size-1))
				     (decrement-count? index-1))
				(and (not (= index-2 size-2))
				     (decrement-count? index-2)))
			    (+ count middle-increment)
			    count))
		       (result-size
			(if (= copy-extra-count count)
			    (+ index-result
			       (- size-1 index-1)
			       (- size-2 index-2))
			    index-result))
		       (result (make-vector result-size)))
		  (vector-copy! temp 0 result 0 index-result)
		  (if (= copy-extra-count count)
		      (begin
			(vector-copy! ranges-1 index-1 result index-result
				      (- size-1 index-1))
			(vector-copy! ranges-2 index-2 result index-result
				      (- size-2 index-2))))
		  (make-inversion-list min max result)))))))))

; for associative procedures only
(define (binary->n-ary proc/2)
  (lambda (arg-1 . args)
    (if (and (pair? args)
	     (null? (cdr args)))
	(proc/2 arg-1 (car args))
	(let loop ((args args)
		   (result arg-1))
	  (if (null? args)
	      result
	      (loop (cdr args) (proc/2 result (car args))))))))

(define inversion-list-union
  (binary->n-ary
   (make-inversion-list-union/intersection (lambda () inversion-list-union)
					   0 1 even? odd? -1 0)))
   

(define inversion-list-intersection
  (binary->n-ary
   (make-inversion-list-union/intersection (lambda () inversion-list-intersection)
					   1 2 odd? even? +1 2)))

(define inversion-list-difference
  (binary->n-ary
   (lambda (i-list-1 i-list-2)
     (inversion-list-intersection i-list-1
				  (inversion-list-complement i-list-2)))))

(define (number->inversion-list min max n)
  (if (or (< n min)
	  (>= n max))
      (assertion-violation 'number->inversion-list "invalid number"
			   min max n))
  (make-inversion-list min max
		       (if (= n (- max 1))
			   (vector n)
			   (vector n (+ n 1)))))

(define (numbers->inversion-list min max . numbers)
  (cond
   ((null? numbers) (make-empty-inversion-list min max))
   ((null? (cdr numbers)) (number->inversion-list min max (car numbers)))
   (else
    (let loop ((numbers (cdr numbers))
	       (i-list (number->inversion-list min max (car numbers))))
      (if (null? numbers)
	  i-list
	  (loop (cdr numbers)
		(inversion-list-union
		 i-list
		 (number->inversion-list min max (car numbers)))))))))

(define (range->inversion-list min max left right)
  (if (or (> min max)
	  (> left right)
	  (< left min)
	  (> right max))
      (assertion-violation 'range->inversion-list "invalid range"
			   min max left right))
  (make-inversion-list min max
		       (if (= right max)
			   (vector left)
			   (vector left right))))

(define (ranges->inversion-list min max . ranges)
  (let loop ((ranges ranges)
	     (result (make-empty-inversion-list min max)))
    (if (null? ranges)
	result
	(let ((range-pair (car ranges)))
	  (let ((left (car range-pair))
		(right (cdr range-pair)))
	    (if (not (and (number? left)
			  (number? right)))
		(assertion-violation 'ranges->inversion-list "invalid range"
				     min max (cons left right)))
	    (loop (cdr ranges)
		  (inversion-list-union result
					(range->inversion-list min max left right))))))))

(define (inversion-list-adjoin i-list . numbers)
  (inversion-list-union i-list
			(apply
			 numbers->inversion-list
			 (inversion-list-min i-list)
			 (inversion-list-max i-list)
			 numbers)))

(define (inversion-list-remove i-list . numbers)
  (inversion-list-difference i-list
			     (apply
			      numbers->inversion-list
			      (inversion-list-min i-list)
			      (inversion-list-max i-list)
			      numbers)))

(define (inversion-list-size i-list)
  (let* ((ranges (inversion-list-range-vector i-list))
	 (size (vector-length ranges)))
    (let loop ((index 0)
	       (count 0))
      (cond
       ((>= index size) count)
       ((= (+ 1 index) size)
	(+ count (- (inversion-list-max i-list)
		    (vector-ref ranges index))))
       (else
	(loop (+ 2 index)
	      (+ count
		 (- (vector-ref ranges (+ 1 index))
		    (vector-ref ranges index)))))))))

(define (inversion-list=? i-list-1 i-list-2)
  (and (= (inversion-list-min i-list-1)
	  (inversion-list-min i-list-2))
       (= (inversion-list-max i-list-1)
	  (inversion-list-max i-list-2))
       (equal? (inversion-list-range-vector i-list-1)
	       (inversion-list-range-vector i-list-2))))

(define (inversion-list-copy i-list)
  (make-inversion-list (inversion-list-min i-list)
		       (inversion-list-max i-list)
		       (vector-copy (inversion-list-range-vector i-list))))

; Iterate over the elements until DONE? (applied to the accumulator)
; returns #t
(define (inversion-list-fold/done? kons knil done? i-list)
  (let* ((ranges (inversion-list-range-vector i-list))
	 (size (vector-length ranges)))
    (let loop ((v knil)
	       (i 0))
      (if (>= i size)
	  v
	  (let ((left (vector-ref ranges i))
		(right (if (< i (- size 1))
			   (vector-ref ranges (+ 1 i))
			   (inversion-list-max i-list))))
	    (let inner-loop ((v v) (n left))
	      (if (>= n right)
		  (loop v (+ 2 i))
		  (let ((v (kons n v)))
		    (if (done? v)
			v
			(inner-loop v (+ 1 n)))))))))))

; It never ends with Olin

(define-record-type inversion-list-cursor :inversion-list-cursor
  (make-inversion-list-cursor index number)
  inversion-list-cursor?
  ;; index into the range vector (always even), #f if we're at the end
  (index inversion-list-cursor-index)
  ;; number within that index
  (number inversion-list-cursor-number))

(define (inversion-list-cursor i-list)
  (let ((ranges (inversion-list-range-vector i-list)))
    (if (zero? (vector-length ranges))
	(make-inversion-list-cursor #f #f)
	(make-inversion-list-cursor 0 (vector-ref ranges 0)))))

(define (inversion-list-cursor-at-end? cursor)
  (not (inversion-list-cursor-index cursor)))

(define (inversion-list-cursor-next i-list cursor)
  (let ((index (inversion-list-cursor-index cursor))
	(number (inversion-list-cursor-number cursor)))
    (let* ((ranges (inversion-list-range-vector i-list))
	   (size (vector-length ranges))
	   (right (if (>= (+ index 1) size)
		      (inversion-list-max i-list)
		      (vector-ref ranges (+ index 1)))))
      (cond
       ((< number (- right 1))
	(make-inversion-list-cursor index (+ 1 number)))
       ((< (+ index 2) size)
	(make-inversion-list-cursor (+ index 2)
				    (vector-ref ranges (+ index 2))))
       (else
	(make-inversion-list-cursor #f #f))))))

(define (inversion-list-cursor-ref cursor)
  (inversion-list-cursor-number cursor))

; Uses the same method as Olin's reference implementation for SRFI 14.

(define (inversion-list-hash i-list bound)
  (let ((mask (let loop ((i #x10000)) ; skip first 16 iterations
		(if (>= i bound)
		    (- i 1)
		    (loop (+ i i))))))
    (let* ((range-vector (inversion-list-range-vector i-list))
	   (size (vector-length range-vector)))
      (let loop ((i 0) (ans 0))
	(if (>= i size)
	    (modulo ans bound)
	    (loop (+ 1 i)
		  (bitwise-and mask
			       (+ (* 37 ans)
				  (vector-ref range-vector i)))))))))

;; Utilities

(define (vector-copy! source source-start dest dest-start count)
  (let loop ((i 0))
    (if (< i count)
	(begin
	  (vector-set! dest (+ dest-start i)
		       (vector-ref source (+ source-start i)))
	  (loop (+ 1 i))))))

(define (vector-copy v)
  (let* ((size (vector-length v))
	 (copy (make-vector size)))
    (vector-copy! v 0 copy 0 size)
    copy))


