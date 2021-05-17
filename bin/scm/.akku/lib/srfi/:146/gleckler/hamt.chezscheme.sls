#!r6rs
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
(library (srfi :146 gleckler hamt)
  (export fragment->mask
	  hamt->list
	  hamt-fetch
	  hamt-null
	  hamt-null?
	  hamt/count
	  hamt/empty?
	  hamt/for-each
	  hamt/immutable
	  hamt/mutable
	  hamt/mutable?
	  hamt/payload?
	  hamt/put
	  hamt/put!
	  hamt/replace
	  hamt/replace!
	  hash-array-mapped-trie?
	  make-hamt

	  ;; These are only needed by tests:
	  collision?
	  hamt-bucket-size
	  hamt-hash-size
	  hamt/root
	  leaf-stride
	  narrow/array
	  narrow/leaves
	  narrow?
	  next-set-bit
	  wide/array
	  wide/children
	  wide?)
  (import (except (rnrs) define-record-type assert assoc)
          (only (chezscheme) remainder)
          (srfi :9)
	  (only (srfi :1) find-tail assoc)
	  (srfi :16)
	  (only (srfi :143) fx-width)
	  (srfi :151)
	  (srfi :146 gleckler hamt-misc)
	  (srfi :146 gleckler vector-edit))

;;; Naming conventions:

  ;;    =: procedure that compares keys
  ;;    c: bit string representing the non-leaf children present
  ;;       immediately below a sparse node
  ;;    d: datum, or `hamt-null' to represent absence or deletion
  ;;   dp: procedure that takes an existing datum and returns the datum
  ;;       that should replace it.  Either may be `hamt-null'.  When
  ;;       there is no payload, `hamt-null' is passed.
  ;;    h: hash
  ;;   hp: procedure that computes hash
  ;;    k: key that maps to a particular datum
  ;;    l: bit string representing the leaves present below a sparse node
  ;;    n: node (of type `collision', `narrow', or `wide')

;;; Background

  ;; See these papers:

  ;; - Ideal Hash Trees, Phil Bagwell, 2000,
  ;;   <https://infoscience.epfl.ch/record/64398/files/idealhashtrees.pdf>

  ;; - Optimizing Hash-Array Mapped Tries for Fast and Lean Immutable
  ;;   JVM Collections, Steinforder & Vinju, 2015,
  ;;   <http://michael.steindorfer.name/publications/oopsla15.pdf>

  ;; Also, see Clojure's persistent hash maps, which support both
  ;; mutable ("transient") and persistent modes.

;;; Design

  ;; According to Phil Bagwell's paper, "Occasionally an entire 32 bit
  ;; hash may be consumed and a new one must be computed to
  ;; differentiate the two keys."  Later, he says "The hash function was
  ;; tailored to give a 32 bit hash.  The algorithm requires that the
  ;; hash can be extended to an arbitrary number of bits.  This was
  ;; accomplished by rehashing the key combined with an integer
  ;; representing the trie level, zero being the root.  Hence if two
  ;; keys do give the same initial hash then the rehash has a
  ;; probability of 1 in 2^32 of a further collision."  However, I
  ;; implement collision lists instead because they will be rarely used
  ;; when hash functions are good, but work well when they're not, as in
  ;; the case of MIT Scheme's `string-hash'.

  (define (error* msg . args)
    (error 'hamt msg args))

  (define hamt-hash-slice-size 5)
  (define hamt-hash-size
    (let ((word-size fx-width))
      (- word-size
         (remainder word-size hamt-hash-slice-size))))
  (define hamt-hash-modulus (expt 2 hamt-hash-size))
  (define hamt-bucket-size (expt 2 hamt-hash-slice-size))
  (define hamt-null (cons 'hamt 'null))

  (define-record-type hash-array-mapped-trie
    (%make-hamt = count hash mutable? payload? root)
    hash-array-mapped-trie?
    (=        hamt/=)
    (count    hamt/count set-hamt/count!)
    (hash     hamt/hash)
    (mutable? hamt/mutable?)
    (payload? hamt/payload?)
    (root     hamt/root  set-hamt/root!))

  (define (make-hamt = hash payload?)
    (%make-hamt = 0 hash #f payload? (make-empty-narrow)))

  (define-record-type collision
    (make-collision entries hash)
    collision?
    (entries collision/entries)
    (hash  collision/hash))

  (define-record-type narrow
    (make-narrow array children leaves)
    narrow?
    (array    narrow/array)
    (children narrow/children)
    (leaves   narrow/leaves))

  (define-record-type wide
    (make-wide array children leaves)
    wide?
    (array    wide/array)
    (children wide/children set-wide/children!)
    (leaves   wide/leaves   set-wide/leaves!))

  (define (hamt/empty? hamt)
    (zero? (hamt/count hamt)))

  (define (hamt/immutable-inner hamt replace)
    "Return a HAMT equivalent to `hamt', but that is immutable.  Even if
`hamt' is mutable, no change to it will affect the returned HAMT.  If
`hamt' has payloads, replace each datum in a wide node with what
`replace' returns when passed the key and corresponding datum.  This
is useful for converting HAMT sets stored as values in a HAMT map back
to immutable ones when the containing map is made immutable.  (Only
data in wide nodes will have been modified since the change to mutable
happened.)"
    (if (hamt/mutable? hamt)
        (let ((payload? (hamt/payload? hamt)))
	  (%make-hamt (hamt/= hamt)
		      (hamt/count hamt)
		      (hamt/hash hamt)
		      #f
		      payload?
		      (->immutable (hamt/root hamt) payload? replace)))
        hamt))

  (define hamt/immutable
    (case-lambda
      ((hamt) (hamt/immutable-inner hamt (lambda (k d) d)))
      ((hamt replace) (hamt/immutable-inner hamt replace))))

  (define (hamt/mutable hamt)
    (if (hamt/mutable? hamt)
        hamt
        (%make-hamt (hamt/= hamt)
		    (hamt/count hamt)
		    (hamt/hash hamt)
		    #t
		    (hamt/payload? hamt)
		    (hamt/root hamt))))

  (define (hamt/replace hamt key dp)
    (assert (not (hamt/mutable? hamt)))
    (let*-values (((payload?) (hamt/payload? hamt))
		  ((root) (hamt/root hamt))
		  ((==) (hamt/= hamt))
		  ((hp) (hamt/hash hamt))
		  ((hash) (hash-bits hp key))
		  ((change node) (modify-pure hamt root 0 dp hash key)))
      (if (eq? node root)
	  hamt
	  (let ((count (+ (hamt/count hamt) change)))
	    (%make-hamt == count hp #f payload? node)))))

  (define (hamt/put hamt key datum)
    (hamt/replace hamt key (lambda (x) datum)))

  (define (hamt/replace! hamt key dp)
    (assert (hamt/mutable? hamt))
    (let*-values (((root) (hamt/root hamt))
		  ((hp) (hamt/hash hamt))
		  ((hash) (hash-bits hp key))
		  ((change node) (mutate hamt root 0 dp hash key)))
      (unless (zero? change)
        (set-hamt/count! hamt (+ (hamt/count hamt) change)))
      (unless (eq? node root)
        (set-hamt/root! hamt node))
      hamt))

  (define (hamt/put! hamt key datum)
    (hamt/replace! hamt key (lambda (x) datum)))

  (define (make-empty-narrow)
    (make-narrow (vector) 0 0))

  (define (hamt-null? n)
    (eq? n hamt-null))

  (define (collision-single-leaf? n)
    (let ((elements (collision/entries n)))
      (and (not (null? elements))
	   (null? (cdr elements)))))

  (define (narrow-single-leaf? n)
    (and (zero? (narrow/children n))
         (= 1 (bit-count (narrow/leaves n)))))

  (define (wide-single-leaf? n)
    (and (zero? (wide/children n))
         (= 1 (bit-count (wide/leaves n)))))

  (define (hash-bits hp key)
    (remainder (hp key) hamt-hash-modulus))

  (define (next-set-bit i start end)
    (let ((index (first-set-bit (bit-field i start end))))
      (and (not (= index -1))
	   (+ index start))))

  (define (narrow->wide n payload?)
    (let* ((c (narrow/children n))
	   (l (narrow/leaves n))
	   (stride (leaf-stride payload?))
	   (a-in (narrow/array n))
	   (a-out (make-vector (* stride hamt-bucket-size))))
      (let next-leaf ((start 0) (count 0))
        (let ((i (next-set-bit l start hamt-bucket-size)))
	  (when i
	    (let ((j (* stride i)))
	      (vector-set! a-out j (vector-ref a-in count))
	      (when payload?
	        (vector-set! a-out (+ j 1) (vector-ref a-in (+ count 1)))))
	    (next-leaf (+ i 1) (+ stride count)))))
      (let next-child ((start 0) (offset (* stride (bit-count l))))
        (let ((i (next-set-bit c start hamt-bucket-size)))
	  (when i
	    (vector-set! a-out (* stride i) (vector-ref a-in offset))
	    (next-child (+ i 1) (+ offset 1)))))
      (make-wide a-out c l)))

  (define (->immutable n payload? replace)
    "Convert `n' and its descendants into `collision' or `narrow' nodes.
Stop at the first `collision' node or `narrow' node on each path.  If
`payload?' is true, then expect data, not just keys, and replace each
datum in a wide node with what `replace' returns when passed the key
and corresponding datum."
    (cond ((collision? n) n)
	  ((narrow? n) n)
	  ((wide? n)
	   (let* ((c (wide/children n))
		  (l (wide/leaves n))
		  (stride (leaf-stride payload?))
		  (l-count (bit-count l))
		  (a-in (wide/array n))
		  (a-out (make-vector
			  (+ (* stride l-count) (bit-count c)))))
	     (let next-leaf ((start 0) (count 0))
	       (let ((i (next-set-bit l
				      start
				      hamt-bucket-size)))
	         (when i
		   (let* ((j (* stride i))
			  (key (vector-ref a-in j)))
		     (vector-set! a-out count key)
		     (when payload?
		       (vector-set! a-out
				    (+ count 1)
				    (replace
				     key
				     (vector-ref a-in (+ j 1))))))
		   (next-leaf (+ i 1) (+ stride count)))))
	     (let next-child ((start 0) (offset (* stride l-count)))
	       (let ((i (next-set-bit c
				      start
				      hamt-bucket-size)))
	         (when i
		   (vector-set! a-out
			        offset
			        (->immutable (vector-ref a-in (* stride i))
					     payload?
					     replace))
		   (next-child (+ i 1) (+ offset 1)))))
	     (make-narrow a-out c l)))
	  (else (error* "Unexpected type of node."))))

  (define (hash-fragment shift hash)
    (bit-field hash shift (+ shift hamt-hash-slice-size)))

  (define (fragment->mask fragment)
    (- (expt 2 fragment) 1))

  (define (mutate hamt n shift dp h k)
    (cond ((collision? n) (modify-collision hamt n shift dp h k))
	  ((narrow? n)
	   (modify-wide hamt
		        (narrow->wide n (hamt/payload? hamt))
		        shift
		        dp
		        h
		        k))
	  ((wide? n) (modify-wide hamt n shift dp h k))
	  (else (error* "Unknown HAMT node type." n))))

  (define (modify-wide hamt n shift dp h k)
    (let ((fragment (hash-fragment shift h)))
      (cond ((bit-set? fragment (wide/children n))
	     (modify-wide-child hamt n shift dp h k))
	    ((bit-set? fragment (wide/leaves n))
	     (modify-wide-leaf hamt n shift dp h k))
	    (else
	     (let ((d (dp hamt-null)))
	       (if (hamt-null? d)
		   (values 0 n)
		   (modify-wide-new hamt n shift d h k)))))))

  (define (modify-wide-child hamt n shift dp h k)
    (let*-values (((fragment) (hash-fragment shift h))
		  ((array) (wide/array n))
		  ((payload?) (hamt/payload? hamt))
		  ((stride) (leaf-stride payload?))
		  ((i) (* stride fragment))
		  ((child) (vector-ref array i))
		  ((change new-child)
		   (mutate hamt
			   child
			   (+ shift hamt-hash-slice-size)
			   dp
			   h
			   k)))
      (define (coalesce key datum)
        (vector-set! array i key)
        (when payload?
	  (vector-set! array (+ i 1) datum))
        (set-wide/children! n (copy-bit fragment (wide/children n) #f))
        (set-wide/leaves! n (copy-bit fragment (wide/leaves n) #t))
        (values change n))
      (define (replace)
        (vector-set! array i new-child)
        (values change n))
      (cond ((eq? new-child child) (values change n))
	    ((hamt-null? new-child)
	     (error* "Child cannot become null." n))
	    ((collision? new-child)
	     (if (collision-single-leaf? new-child)
	         (let ((a (car (collision/entries new-child))))
		   (if payload?
		       (coalesce (car a) (cdr a))
		       (coalesce a #f)))
	         (replace)))
	    ((wide? new-child)
	     (if (wide-single-leaf? new-child)
	         (let ((a (wide/array new-child))
		       (j (* stride (next-set-bit (wide/leaves new-child)
						  0
						  hamt-bucket-size))))
		   (coalesce (vector-ref a j)
			     (and payload? (vector-ref a (+ j 1)))))
	         (replace)))
	    ((narrow? new-child)
	     (replace))
	    (else (error* "Unexpected type of child node.")))))

  (define (modify-wide-leaf hamt n shift dp h k)
    (let* ((fragment (hash-fragment shift h))
	   (array (wide/array n))
	   (payload? (hamt/payload? hamt))
	   (stride (leaf-stride payload?))
	   (i (* stride fragment))
	   (key (vector-ref array i)))
      (if ((hamt/= hamt) k key)
	  (let* ((existing (if payload? (vector-ref array (+ i 1)) hamt-null))
	         (d (dp existing)))
	    (cond ((hamt-null? d)
		   (vector-set! array i #f)
		   (when payload? (vector-set! array (+ i 1) #f))
		   (set-wide/leaves! n (copy-bit fragment (wide/leaves n) #f))
		   (values -1 n))
		  (else
		   (when payload? (vector-set! array (+ i 1) d))
		   (values 0 n))))
	  (let ((d (dp hamt-null)))
	    (if (hamt-null? d)
	        (values 0 n)
	        (add-wide-leaf-key hamt n shift d h k))))))

  (define (add-wide-leaf-key hamt n shift d h k)
    (define payload? (hamt/payload? hamt))
    (define make-entry
      (if payload? cons (lambda (k d) k)))
    (let* ((fragment (hash-fragment shift h))
	   (array (wide/array n))
	   (stride (leaf-stride payload?))
	   (i (* stride fragment))
	   (key (vector-ref array i))
	   (hash (hash-bits (hamt/hash hamt) key))
	   (datum (and payload? (vector-ref array (+ i 1)))))
      (vector-set! array
		   i
		   (if (= h hash)
		       (make-collision (list (make-entry k d)
					     (make-entry key datum))
				       h)
		       (make-narrow-with-two-keys
		        payload?
		        (+ shift hamt-hash-slice-size)
		        h
		        k
		        d
		        hash
		        key
		        datum)))
      (when payload?
        (vector-set! array (+ i 1) #f))
      (set-wide/children! n (copy-bit fragment (wide/children n) #t))
      (set-wide/leaves! n (copy-bit fragment (wide/leaves n) #f))
      (values 1 n)))

  (define (modify-wide-new hamt n shift d h k)
    (let* ((fragment (hash-fragment shift h))
	   (array (wide/array n))
	   (payload? (hamt/payload? hamt))
	   (stride (leaf-stride payload?))
	   (i (* stride fragment)))
      (vector-set! array i k)
      (when payload?
        (vector-set! array (+ i 1) d))
      (set-wide/leaves! n (copy-bit fragment (wide/leaves n) #t))
      (values 1 n)))

  (define (make-narrow-with-two-keys payload? shift h1 k1 d1 h2 k2 d2)
    (define (two-leaves f1 k1 d1 f2 k2 d2)
      (make-narrow
       (if payload?
	   (vector k1 d1 k2 d2)
	   (vector k1 k2))
       0
       (copy-bit f2 (copy-bit f1 0 #t) #t)))
    (assert (not (= h1 h2)))
    (let ((f1 (hash-fragment shift h1))
	  (f2 (hash-fragment shift h2)))
      (cond ((= f1 f2)
	     (make-narrow
	      (vector (make-narrow-with-two-keys payload?
					         (+ shift hamt-hash-slice-size)
					         h1
					         k1
					         d1
					         h2
					         k2
					         d2))
	      (copy-bit f1 0 #t)
	      0))
	    ((< f1 f2)
	     (two-leaves f1 k1 d1 f2 k2 d2))
	    (else
	     (two-leaves f2 k2 d2 f1 k1 d1)))))

  (define (modify-pure hamt n shift dp h k)
    (cond ((collision? n) (modify-collision hamt n shift dp h k))
	  ((narrow? n) (modify-narrow hamt n shift dp h k))
	  ((wide? n) (error* "Should have been converted to narrow before here."))
	  (else (error* "Unknown HAMT node type." n))))

  (define (lower-collision hamt n shift dp h k)
    "If we try to add a key to a collision but it has a different hash
than the collision's elements, add it to a narrow above the collision
instead.  Add as many levels of child-only narrows as needed to reach
the point where the hash fragments differ.  This is guaranteed to
happen at some level because we're only called when the full hashes
differ."
    (let ((collision-hash (collision/hash n))
	  (d (dp hamt-null)))
      (if (hamt-null? d)
	  (values 0 n)
	  (values
	   1
	   (let descend ((shift shift))
	     (let ((collision-fragment (hash-fragment shift collision-hash))
		   (leaf-fragment (hash-fragment shift h)))
	       (if (= collision-fragment leaf-fragment)
		   (let ((child (descend (+ shift hamt-hash-slice-size))))
		     (make-narrow
		      (vector child)
		      (copy-bit collision-fragment 0 #t)
		      0))
		   (make-narrow
		    (if (hamt/payload? hamt)
		        (vector k d n)
		        (vector k n))
		    (copy-bit collision-fragment 0 #t)
		    (copy-bit leaf-fragment 0 #t)))))))))

  (define (modify-collision hamt n shift dp h k)
    (if (= h (collision/hash n))
        (let ((payload? (hamt/payload? hamt)))
	  (let next ((entries (collision/entries n))
		     (checked '()))
	    (if (null? entries)
	        (let ((d (dp hamt-null)))
		  (if (hamt-null? d)
		      (values 0 n)
		      (values 1
			      (make-collision (if payload?
						  (cons (cons k d) checked)
						  (cons k checked))
					      h))))
	        (let* ((entry (car entries))
		       (key (if payload? (car entry) entry)))
		  (if ((hamt/= hamt) k key)
		      (let* ((existing (if payload? (cdr entry) hamt-null))
			     (d (dp existing))
			     (delete? (hamt-null? d))
			     (others (append checked (cdr entries))))
		        (values
		         (if delete? -1 0)
		         (make-collision (cond (delete? others)
					       (payload? (cons (cons k d) others))
					       (else (cons k others)))
				         h)))
		      (next (cdr entries)
			    (cons (car entries) checked)))))))
        (lower-collision hamt n shift dp h k)))

  ;; If we're storing "payloads," i.e. a datum to go with each key, we
  ;; must reserve two spots for each key in each vector.  Otherwise, we
  ;; need only one.
  (define (leaf-stride payload?)
    (if payload? 2 1))

  (define (narrow-child-index l c mask payload?)
    (+ (* (leaf-stride payload?) (bit-count l))
       (bit-count (bitwise-and c mask))))

  (define (narrow-leaf-index l mask payload?)
    (* (leaf-stride payload?) (bit-count (bitwise-and l mask))))

  (define (modify-narrow hamt n shift dp h k)
    (let ((fragment (hash-fragment shift h)))
      (cond ((bit-set? fragment (narrow/children n))
	     (modify-narrow-child hamt n shift dp h k))
	    ((bit-set? fragment (narrow/leaves n))
	     (modify-narrow-leaf hamt n shift dp h k))
	    (else
	     (let ((d (dp hamt-null)))
	       (if (hamt-null? d)
		   (values 0 n)
		   (modify-narrow-new hamt n shift d h k)))))))

  (define (modify-narrow-child hamt n shift dp h k)
    (let*-values (((fragment) (hash-fragment shift h))
		  ((mask) (fragment->mask fragment))
		  ((c) (narrow/children n))
		  ((l) (narrow/leaves n))
		  ((array) (narrow/array n))
		  ((payload?) (hamt/payload? hamt))
		  ((child-index)
		   (narrow-child-index l c mask payload?))
		  ((child) (vector-ref array child-index))
		  ((change new-child)
		   (modify-pure hamt
			        child
			        (+ shift hamt-hash-slice-size)
			        dp
			        h
			        k)))
      (define (coalesce key datum)
        (let ((leaf-index (narrow-leaf-index l mask payload?)))
	  (values change
		  (make-narrow (if payload?
				   (vector-edit array
					        (add leaf-index key)
					        (add leaf-index datum)
					        (drop child-index 1))
				   (vector-edit array
					        (add leaf-index key)
					        (drop child-index 1)))
			       (copy-bit fragment c #f)
			       (copy-bit fragment l #t)))))
      (define (replace)
        (values change
	        (make-narrow (vector-replace-one array child-index new-child)
			     c
			     l)))
      (cond ((eq? new-child child) (values 0 n))
	    ((hamt-null? new-child)
	     (error* "Child cannot become null." n))
	    ((collision? new-child)
	     (if (collision-single-leaf? new-child)
	         (let ((a (car (collision/entries new-child))))
		   (if payload?
		       (coalesce (car a) (cdr a))
		       (coalesce a #f)))
	         (replace)))
	    ((narrow? new-child)
	     (if (narrow-single-leaf? new-child)
	         (let ((a (narrow/array new-child)))
		   (coalesce (vector-ref a 0)
			     (and payload? (vector-ref a 1))))
	         (replace)))
	    ((wide? new-child)
	     (error* "New child should be collision or narrow."))
	    (else (error* "Unexpected type of child node.")))))

  (define (modify-narrow-leaf hamt n shift dp h k)
    (let* ((fragment (hash-fragment shift h))
	   (mask (fragment->mask fragment))
	   (c (narrow/children n))
	   (l (narrow/leaves n))
	   (array (narrow/array n))
	   (payload? (hamt/payload? hamt))
	   (stride (leaf-stride payload?))
	   (leaf-index (narrow-leaf-index l mask payload?))
	   (key (vector-ref array leaf-index)))
      (if ((hamt/= hamt) k key)
	  (let* ((existing (if payload?
			       (vector-ref array (+ leaf-index 1))
			       hamt-null))
	         (d (dp existing)))
	    (cond ((hamt-null? d)
		   (values -1
			   (make-narrow (vector-without array
						        leaf-index
						        (+ leaf-index stride))
				        c
				        (copy-bit fragment l #f))))
		  (payload?
		   (values
		    0
		    (make-narrow (vector-replace-one array (+ leaf-index 1) d)
			         c
			         l)))
		  (else (values 0 n))))
	  (let ((d (dp hamt-null)))
	    (if (hamt-null? d)
	        (values 0 n)
	        (add-narrow-leaf-key hamt n shift d h k))))))

  (define (add-narrow-leaf-key hamt n shift d h k)
    (define payload? (hamt/payload? hamt))
    (define make-entry
      (if payload? cons (lambda (k d) k)))
    (let* ((fragment (hash-fragment shift h))
	   (mask (fragment->mask fragment))
	   (c (narrow/children n))
	   (l (narrow/leaves n))
	   (array (narrow/array n))
	   (payload? (hamt/payload? hamt))
	   (stride (leaf-stride payload?))
	   (leaf-index (narrow-leaf-index l mask payload?))
	   (key (vector-ref array leaf-index))
	   (child-index (narrow-child-index l c mask payload?))
	   (hash (hash-bits (hamt/hash hamt) key))
	   (datum (and payload? (vector-ref array (+ leaf-index 1)))))
      (values 1
	      (make-narrow (if (= h hash)
			       (vector-edit
			        array
			        (drop leaf-index stride)
			        (add child-index
				     (make-collision (list (make-entry k d)
							   (make-entry key datum))
						     h)))
			       (vector-edit
			        array
			        (drop leaf-index stride)
			        (add child-index
				     (make-narrow-with-two-keys
				      payload?
				      (+ shift hamt-hash-slice-size)
				      h
				      k
				      d
				      hash
				      key
				      datum))))
			   (copy-bit fragment c #t)
			   (copy-bit fragment l #f)))))

  (define (modify-narrow-new hamt n shift d h k)
    (let* ((fragment (hash-fragment shift h))
	   (mask (fragment->mask fragment))
	   (c (narrow/children n))
	   (l (narrow/leaves n))
	   (array (narrow/array n))
	   (payload? (hamt/payload? hamt))
	   (leaf-index (narrow-leaf-index l mask payload?))
	   (delete? (hamt-null? d)))
      (values 1
	      (make-narrow (if payload?
			       (vector-edit array
					    (add leaf-index k)
					    (add leaf-index d))
			       (vector-edit array
					    (add leaf-index k)))
			   c
			   (copy-bit fragment l #t)))))

  (define (hamt-fetch hamt key)
    "Fetch datum from `hamt' at `key'.  Return `hamt-null' if the key is
not present.  If `hamt' stores no payloads, return the symbol
`present' if the key is present."
    (let ((h (hash-bits (hamt/hash hamt) key))
	  (payload? (hamt/payload? hamt)))
      (let descend ((n (hamt/root hamt))
		    (shift 0))
        (cond ((collision? n)
	       (let ((entries (collision/entries n))
		     (key= (hamt/= hamt)))
	         (if payload?
		     (cond ((assoc key entries key=) => cdr)
			   (else hamt-null))
		     (if (find-tail (lambda (e) (key= key e)) entries)
		         'present
		         hamt-null))))
	      ((narrow? n)
	       (let ((array (narrow/array n))
		     (c (narrow/children n))
		     (l (narrow/leaves n))
		     (fragment (hash-fragment shift h)))
	         (cond ((bit-set? fragment c)
		        (let* ((mask (fragment->mask fragment))
			       (child-index (narrow-child-index
					     l
					     c
					     mask
					     (hamt/payload? hamt))))
			  (descend (vector-ref array child-index)
				   (+ shift hamt-hash-slice-size))))
		       ((bit-set? fragment l)
		        (let* ((mask (fragment->mask fragment))
			       (leaf-index
			        (narrow-leaf-index l mask (hamt/payload? hamt)))
			       (k (vector-ref array leaf-index)))
			  (if ((hamt/= hamt) k key)
			      (if payload?
				  (vector-ref array (+ leaf-index 1))
				  'present)
			      hamt-null)))
		       (else hamt-null))))
	      ((wide? n)
	       (let ((array (wide/array n))
		     (stride (leaf-stride (hamt/payload? hamt)))
		     (c (wide/children n))
		     (l (wide/leaves n))
		     (i (hash-fragment shift h)))
	         (cond ((bit-set? i c)
		        (descend (vector-ref array (* stride i))
			         (+ shift hamt-hash-slice-size)))
		       ((bit-set? i l)
		        (let* ((j (* stride i))
			       (k (vector-ref array j)))
			  (if ((hamt/= hamt) k key)
			      (if payload?
				  (vector-ref array (+ j 1))
				  'present)
			      hamt-null)))
		       (else hamt-null))))
	      (else (error* "Unexpected type of child node."))))))

  (define (collision/for-each procedure node payload?)
    (if payload?
        (do-list (e (collision/entries node))
	         (procedure (car e) (cdr e)))
        (do-list (e (collision/entries node))
	         (procedure e #f))))

  (define (narrow/for-each procedure node payload?)
    (let ((array (narrow/array node))
	  (stride (leaf-stride payload?))
	  (c (narrow/children node))
	  (l (narrow/leaves node)))
      (let next-leaf ((count 0)
		      (start 0))
        (let ((i (next-set-bit l start hamt-bucket-size)))
	  (if i
	      (let* ((j (* stride count))
		     (k (vector-ref array j))
		     (d (and payload? (vector-ref array (+ j 1)))))
	        (procedure k d)
	        (next-leaf (+ count 1) (+ i 1)))
	      (let next-child ((start 0)
			       (offset (* stride count)))
	        (let ((i (next-set-bit c start hamt-bucket-size)))
		  (when i
		    (let ((child (vector-ref array offset)))
		      (hamt-node/for-each child payload? procedure)
		      (next-child (+ i 1) (+ offset 1)))))))))))

  (define (wide/for-each procedure node payload?)
    (let ((array (wide/array node))
	  (stride (leaf-stride payload?))
	  (c (wide/children node))
	  (l (wide/leaves node)))
      (do ((i 0 (+ i 1)))
	  ((= i hamt-bucket-size))
        (let ((j (* stride i)))
	  (cond ((bit-set? i l)
	         (let ((k (vector-ref array j))
		       (d (and payload? (vector-ref array (+ j 1)))))
		   (procedure k d)))
	        ((bit-set? i c)
	         (let ((child (vector-ref array j)))
		   (hamt-node/for-each child payload? procedure))))))))

  (define (hamt-node/for-each node payload? procedure)
    (cond ((collision? node) (collision/for-each procedure node payload?))
	  ((narrow? node) (narrow/for-each procedure node payload?))
	  ((wide? node) (wide/for-each procedure node payload?))
	  (else (error* "Invalid type of node." node))))

  (define (hamt/for-each procedure hamt)
    (hamt-node/for-each (hamt/root hamt)
		        (hamt/payload? hamt)
		        procedure))

  (define (hamt->list hamt procedure)
    (let ((accumulator '()))
      (hamt/for-each (lambda (k v)
		       (set! accumulator
			     (cons (procedure k v)
				   accumulator)))
		     hamt)
      accumulator))

;;; Debugging

  (define (assert-collision-valid node hp payload?)
    "Do sanity checks on a collision.  Return the list of all keys
present."
    (let ((entries (collision/entries node))
	  (hash (collision/hash node))
	  (extract (if payload? car (lambda (x) x))))
      (do-list (a entries)
               (assert (= hash (hash-bits hp (extract a)))))
      (if payload?
	  (map car entries)
	  entries)))

  (define (assert-narrow-valid node hp payload? shift)
    "Do sanity checks on a narrow and all its children.  Return the list
of all keys present."
    (let ((array (narrow/array node))
	  (stride (leaf-stride payload?))
	  (c (narrow/children node))
	  (l (narrow/leaves node)))
      (assert (zero? (bitwise-and c l)))
      (let next-leaf ((count 0)
		      (i 0)
		      (keys '()))
        (if (< i hamt-bucket-size)
	    (cond ((bit-set? i l)
		   (let ((k (vector-ref array (* stride count))))
		     (assert (= i (hash-fragment shift (hash-bits hp k))))
		     (next-leaf (+ count 1) (+ i 1) (cons k keys))))
		  (else (next-leaf count (+ i 1) keys)))
	    (let next-child ((i 0)
			     (key-groups (list keys))
			     (offset (* stride count)))
	      (if (= i hamt-bucket-size)
		  (apply append key-groups)
		  (cond ((bit-set? i c)
		         (let* ((child (vector-ref array offset))
			        (child-keys (assert-hamt-node-valid
					     child
					     hp
					     payload?
					     (+ shift hamt-hash-slice-size))))
			   (do-list (k child-keys)
			            (assert (= i
				               (hash-fragment shift (hash-bits hp k)))))
			   (next-child (+ i 1)
				       (cons child-keys key-groups)
				       (+ offset 1))))
		        (else (next-child (+ i 1) key-groups offset)))))))))

  (define (assert-wide-valid node hp payload? shift)
    "Do sanity checks on a wide and all its children.  Return the list
of all keys present."
    (let ((array (wide/array node))
	  (stride (leaf-stride payload?))
	  (c (wide/children node))
	  (l (wide/leaves node)))
      (assert (zero? (bitwise-and c l)))
      (let next-fragment ((i 0)
			  (key-groups '()))
        (if (= i hamt-bucket-size)
	    (apply append key-groups)
	    (let ((j (* stride i)))
	      (cond ((bit-set? i l)
		     (let ((k (vector-ref array j)))
		       (assert (= i (hash-fragment shift (hash-bits hp k))))
		       (next-fragment (+ i 1) (cons (list k) key-groups))))
		    ((bit-set? i c)
		     (let* ((child (vector-ref array j))
			    (child-keys (assert-hamt-node-valid
				         child
				         hp
				         payload?
				         (+ shift hamt-hash-slice-size))))
		       (do-list (k child-keys)
		                (assert (= i
				           (hash-fragment shift (hash-bits hp k)))))
		       (next-fragment (+ i 1)
				      (cons child-keys key-groups))))
		    (else
		     (assert (not (vector-ref array j)))
		     (when payload?
		       (assert (not (vector-ref array (+ j 1)))))
		     (next-fragment (+ i 1) key-groups))))))))

  (define (assert-hamt-node-valid node hp payload? shift)
    "Do sanity checks on a HAMT node and all its children.  Return the
list of all keys present."
    (cond ((collision? node) (assert-collision-valid node hp payload?))
	  ((narrow? node) (assert-narrow-valid node hp payload? shift))
	  ((wide? node) (assert-wide-valid node hp payload? shift))
	  (else (error* "Invalid type of node." node))))

  (define (assert-hamt-valid hamt)
    "Do sanity checks on `hamt'."
    (let ((hp (hamt/hash hamt)))
      (assert (procedure? (hamt/= hamt)))
      (assert (procedure? hp))
      (assert (memq (hamt/mutable? hamt) '(#t #f)))
      (let* ((payload? (hamt/payload? hamt))
	     (keys (assert-hamt-node-valid (hamt/root hamt) hp payload? 0)))
        (assert (= (hamt/count hamt) (length keys)))))))
