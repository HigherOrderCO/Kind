;;; The SRFI-32 sort package -- quick sort			-*- Scheme -*-
;;; Copyright (c) 2002 by Olin Shivers.
;;; This code is open-source; see the end of the file for porting and
;;; more copyright information.
;;; Olin Shivers 2002/7.

;;; (quick-sort  < v [start end]) -> vector
;;; (quick-sort! < v [start end]) -> unspecific
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; The algorithm is a standard quicksort, but the partition loop is fancier,
;;; arranging the vector into a left part that is <, a middle region that is
;;; =, and a right part that is > the pivot. Here's how it is done:
;;;   The partition loop divides the range being partitioned into five 
;;;   subranges:
;;;       =======<<<<<<<<<?????????>>>>>>>=======
;;;   where = marks a value that is equal the pivot, < marks a value that
;;;   is less than the pivot, ? marks a value that hasn't been scanned, and
;;;   > marks a value that is greater than the pivot. Let's consider the 
;;;   left-to-right scan. If it checks a ? value that is <, it keeps scanning.
;;;   If the ? value is >, we stop the scan -- we are ready to start the
;;;   right-to-left scan and then do a swap. But if the rightward scan checks 
;;;   a ? value that is =, we swap it *down* to the end of the initial chunk
;;;   of ====='s -- we exchange it with the leftmost < value -- and then
;;;   continue our rightward scan. The leftwards scan works in a similar 
;;;   fashion, scanning past > elements, stopping on a < element, and swapping
;;;   up = elements. When we are done, we have a picture like this
;;;       ========<<<<<<<<<<<<>>>>>>>>>>=========
;;;   Then swap the = elements up into the middle of the vector to get
;;;   this:
;;;       <<<<<<<<<<<<=================>>>>>>>>>>
;;;   Then recurse on the <'s and >'s. Work out all the tricky little
;;;   boundary cases, and you're done.
;;;
;;; Other tricks:
;;; - This quicksort also makes some effort to pick the pivot well -- it uses
;;;   the median of three elements as the partition pivot, so pathological n^2
;;;   run time is much rarer (but not eliminated completely). If you really
;;;   wanted to get fancy, you could use a random number generator to choose
;;;   pivots. The key to this trick is that you only need to pick one random
;;;   number for each *level* of recursion -- i.e. you only need (lg n) random
;;;   numbers. 
;;; - After the partition, we *recurse* on the smaller of the two pending
;;;   regions, then *tail-recurse* (iterate) on the larger one. This guarantees
;;;   we use no more than lg(n) stack frames, worst case.
;;; - There are two ways to finish off the sort.
;;;   A Recurse down to regions of size 10, then sort each such region using
;;;     insertion sort.
;;;   B Recurse down to regions of size 10, then sort *the entire vector*
;;;     using insertion sort.
;;;   We do A. Each choice has a cost. Choice A has more overhead to invoke
;;;   all the separate insertion sorts -- choice B only calls insertion sort
;;;   once. But choice B will call the comparison function *more times* --
;;;   it will unnecessarily compare elt 9 of one segment to elt 0 of the
;;;   following segment. The overhead of choice A is linear in the length
;;;   of the vector, but *otherwise independent of the algorithm's parameters*.
;;;   I.e., it's a *fixed*, *small* constant factor. The cost of the extra 
;;;   comparisons made by choice B, however, is dependent on an externality: 
;;;   the comparison function passed in by the client. This can be made 
;;;   arbitrarily bad -- that is, the constant factor *isn't* fixed by the
;;;   sort algorithm; instead, it's determined by the comparison function.
;;;   If your comparison function is very, very slow, you want to eliminate
;;;   every single one that you can. Choice A limits the potential badness, 
;;;   so that is what we do.

(define (vector-quick-sort! < v . maybe-start+end)
  (call-with-values
      (lambda () (vector-start+end v maybe-start+end))
    (lambda (start end)
      (%quick-sort! < v start end))))

(define (vector-quick-sort < v . maybe-start+end)
  (call-with-values
      (lambda () (vector-start+end v maybe-start+end))
    (lambda (start end)
      (let ((ans (make-vector (- end start))))
	(vector-portion-copy! ans v start end)
	(%quick-sort! < ans 0 (- end start))
	ans))))

;;; %QUICK-SORT is not exported.
;;; Preconditions:
;;;   V vector
;;;   START END fixnums
;;;   0 <= START, END <= (vector-length V)
;;; If these preconditions are ensured by the cover functions, you
;;; can safely change this code to use unsafe fixnum arithmetic and vector
;;; indexing ops, for *huge* speedup.
;;;
;;; We bail out to insertion sort for small ranges; feel free to tune the
;;; crossover -- it's just a random guess. If you don't have the insertion
;;; sort routine, just kill that branch of the IF and change the recursion
;;; test to (< 1 (- r l)) -- the code is set up to work that way.

(define (%quick-sort! elt< v start end)
  ;; Swap the N outer pairs of the range [l,r).
  (define (swap l r n)
    (if (> n 0)
	(let ((x   (vector-ref v l))
	      (r-1 (- r 1)))
	  (vector-set! v l   (vector-ref v r-1))
	  (vector-set! v r-1 x)
	  (swap (+ l 1) r-1 (- n 1)))))

  ;; Choose the median of V[l], V[r], and V[middle] for the pivot.
  (define (median v1 v2 v3)
    (call-with-values
	(lambda () (if (elt< v1 v2) (values v1 v2) (values v2 v1)))
      (lambda (little big)
	(if (elt< big v3)
	    big
	    (if (elt< little v3) v3 little)))))

  (let recur ((l start) (r end))	; Sort the range [l,r).
    (if (< 10 (- r l))	     ; Ten: the gospel according to Sedgewick.

	(let ((pivot (median (vector-ref v l)
			     (vector-ref v (quotient (+ l r) 2))
			     (vector-ref v (- r 1)))))

	  ;; Everything in these loops is driven by the invariants expressed
	  ;; in the little pictures & the corresponding l,i,j,k,m,r indices
	  ;; and the associated ranges.

	  ;; =======<<<<<<<<<?????????>>>>>>>=======
	  ;; l      i        j       k      m       r
	  ;; [l,i)  [i,j)      [j,k]    (k,m]  (m,r)
	  (letrec ((lscan (lambda (i j k m) ; left-to-right scan
			    (let lp ((i i) (j j))
			      (if (> j k)
				  (done i j m)
				  (let ((x (vector-ref v j)))
				    (cond ((elt< x pivot) (lp i (+ j 1)))

					  ((elt< pivot x) (rscan i j k m))

					  (else ; Equal
					   (if (< i j)
					       (begin (vector-set! v j (vector-ref v i))
						      (vector-set! v i x)))
					   (lp (+ i 1) (+ j 1)))))))))

		   ;; =======<<<<<<<<<>????????>>>>>>>=======
		   ;; l      i        j       k      m       r
		   ;; [l,i)  [i,j)    j (j,k]    (k,m]  (m,r)
		   (rscan (lambda (i j k m) ; right-to-left scan
			    (let lp ((k k) (m m))	
			      (if (<= k j)
				  (done i j m)
				  (let* ((x (vector-ref v k)))
				    (cond ((elt< pivot x) (lp (- k 1) m))

					  ((elt< x pivot) ; Swap j & k & lscan.
					   (vector-set! v k (vector-ref v j))
					   (vector-set! v j x)
					   (lscan i (+ j 1) (- k 1) m))

					  (else	; x=pivot
					   (if (< k m)
					       (begin (vector-set! v k (vector-ref v m))
						      (vector-set! v m x)))
					   (lp (- k 1) (- m 1)))))))))


		   ;; =======<<<<<<<<<<<<<>>>>>>>>>>>=======
		   ;; l      i            j         m       r
		   ;; [l,i)  [i,j)        [j,m]        (m,r)
		   (done (lambda (i j m)
			   (let ((num< (- j i))
				 (num> (+ 1 (- m j)))
				 (num=l (- i l))
				 (num=r (- (- r m) 1)))
			     (swap l j (min num< num=l)) ; Swap ='s into
			     (swap j r (min num> num=r)) ; the middle.
			     ;; Recur on the <'s and >'s. Recurring on the
			     ;; smaller range and iterating on the bigger 
			     ;; range ensures O(lg n) stack frames, worst case.
			     (cond ((<= num< num>)
				    (recur l          (+ l num<))
				    (recur (- r num>) r))
				   (else
				    (recur (- r num>) r)
				    (recur l          (+ l num<))))))))

	    (let ((r-1 (- r 1)))
	      (lscan l l r-1 r-1))))

	;; Small segment => punt to insert sort.
	;; Use the dangerous subprimitive.
	(%vector-insert-sort! elt< v l r))))


