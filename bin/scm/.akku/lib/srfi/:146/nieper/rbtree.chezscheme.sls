#!r6rs
;; Copyright (C) Marc Nieper-Wißkirchen (2016).  All Rights Reserved.

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
;; NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
;; BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
;; ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
;; CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
;; SOFTWARE.

(library (srfi :146 nieper rbtree)
  (export make-tree tree-search tree-for-each tree-fold tree-fold/reverse tree-generator
	  tree-key-predecessor tree-key-successor
	  tree-map tree-catenate tree-split)
  (import (rnrs)
          (only (chezscheme) call/1cc)
	  (srfi :2)
	  (srfi :8)
	  (srfi :158)
	  (srfi :128))

  ;; Concrete data types

  (define (make-item key value) (vector key value))
  (define (item-key item) (vector-ref item 0))
  (define (item-value item) (vector-ref item 1))

  (define (node color left item right) (vector color left item right))
  (define (color node) (vector-ref node 0))
  (define (left node) (vector-ref node 1))
  (define (item node) (vector-ref node 2))
  (define (right node) (vector-ref node 3))
  (define (key node) (item-key (item node)))
  (define (value node) (item-value (item node)))
  (define (red left item right) (node 'red left item right))
  (define black
    (case-lambda
      (() (black #f #f #f))
      ((left item right) (node 'black left item right))))
  (define white
    (case-lambda
      (() (white #f #f #f))
      ((left item right) (node 'white left item right))))
  (define (red? node) (eq? (color node) 'red))
  (define (black? node) (eq? (color node) 'black))
  (define (white? node) (eq? (color node) 'white))

;;; Tree matcher macros

  (define-syntax tree-match
    (syntax-rules ()
      ((tree-match tree (pattern . expression*) ...)
       (compile-patterns (expression* ...) tree () (pattern ...)))))

  (define-syntax compile-patterns
    (syntax-rules ()
      ((compile-patterns (expression* ...) tree (clauses ...) ())
       (call/1cc
        (lambda (return)
	  (or (and-let* clauses
	        (call-with-values
		    (lambda () . expression*)
		  return))
	      ...
	      (error "tree does not match any pattern" tree)))))

      ((compile-patterns e tree clauses* (pattern . pattern*))
       (compile-pattern tree pattern
		        (add-pattern e tree clauses* pattern*)))))

  (define-syntax add-pattern
    (syntax-rules ()
      ((add-pattern e tree (clauses ...) pattern* new-clauses)
       (compile-patterns e tree (clauses ... new-clauses) pattern*))))

  (define-syntax compile-pattern
    (syntax-rules (_1 and red? black? white? ? node red black white)

      ((compile-pattern tree (red? x) (k ...))
       (k ... (((red? tree)) (x tree))))

      ((compile-pattern tree (black? x) (k ...))
       (k ... (((black? tree)) (x tree))))

      ((compile-pattern tree (white? x) (k ...))
       (k ... (((white? tree)) (x tree))))

      ((compile-pattern tree (black) (k ...))
       (k ... (((black? tree)) ((not (item tree))))))

      ((compile-pattern tree (white) (k ...))
       (k ... (((white? tree)) ((not (item tree))))))

      ((compile-pattern tree (and pt ...) k*)
       (compile-subpatterns () ((t pt) ...)
			    (compile-and-pattern tree t k*)))

      ((compile-pattern tree (node pc pa px pb) k*)
       (compile-subpatterns () ((c pc) (a pa) (x px) (b pb))
			    (compile-node-pattern tree c a x b k*)))

      ((compile-pattern tree (red pa px pb) k*)
       (compile-subpatterns () ((a pa) (x px) (b pb))
			    (compile-color-pattern red? tree a x b k*)))

      ((compile-pattern tree (black pa px pb) k*)
       (compile-subpatterns () ((a pa) (x px) (b pb))
			    (compile-color-pattern black? tree a x b k*)))

      ((compile-pattern tree (white pa px pb) k*)
       (compile-subpatterns () ((a pa) (x px) (b pb))
			    (compile-color-pattern white? tree a x b k*)))

      ((compile-pattern tree _1 (k ...))
       (k ... ()))

      ((compile-pattern tree x (k ...))
       (k ... ((x tree))))))

  (define-syntax compile-and-pattern
    (syntax-rules ()
      ((compile-and-pattern tree t (k ...) clauses)
       (k ... ((t tree) . clauses)))))

  (define-syntax compile-node-pattern
    (syntax-rules ()
      ((compile-node-pattern tree c a x b (k ...) clauses)
       (k ... (((item tree))
	       (c (color tree))
	       (a (left tree))
	       (x (item tree))
	       (b (right tree)) . clauses)))))

  (define-syntax compile-color-pattern
    (syntax-rules ()
      ((compile-color-pattern pred? tree a x b (k ...) clauses)
       (k ... (((item tree))
	       ((pred? tree))
	       (a (left tree))
	       (x (item tree))
	       (b (right tree)) . clauses)))))

  (define-syntax compile-subpatterns
    (syntax-rules ()

      ((compile-subpatterns clauses () (k ...))
       (k ... clauses))

      ((compile-subpatterns clauses ((tree pattern) . rest) k*)
       (compile-pattern tree pattern (add-subpattern clauses rest k*)))))

  (define-syntax add-subpattern
    (syntax-rules ()
      ((add-subpattern (clause ...) rest k* clauses)
       (compile-subpatterns (clause ... . clauses) rest k*))))

;;; Tree recolouring procedures

  (define (blacken tree)
    (tree-match tree
      ((red a x b)
       (black a x b))
      (t t)))

  (define (redden tree)
    (tree-match tree
      ((black (black? a) x (black? b))
       (red a x b))
      (t t)))

  (define (white->black tree)
    (tree-match tree
      ((white)
       (black))
      ((white a x b)
       (black a x b))))

;;; Exported identifiers

  (define (make-tree) (black))

  (define (tree-fold proc seed tree)
    (let loop ((acc seed) (tree tree))
      (tree-match tree
        ((black)
         acc)
        ((node _ a x b)
         (let*
	     ((acc (loop acc a))
	      (acc (proc (item-key x) (item-value x) acc))
	      (acc (loop acc b)))
	   acc)))))

  (define (tree-fold/reverse proc seed tree)
    (let loop ((acc seed) (tree tree))
      (tree-match tree
        ((black)
         acc)
        ((node _ a x b)
         (let*
	     ((acc (loop acc b))
	      (acc (proc (item-key x) (item-value x) acc))
	      (acc (loop acc a)))
	   acc)))))

  (define (tree-for-each proc tree)
    (tree-fold (lambda (key value acc)
	         (proc key value))
	       #f tree))

  (define (tree-generator tree)
    (make-coroutine-generator
     (lambda (yield)
       (tree-for-each (lambda item (yield item)) tree))))

  (define (identity obj) obj)

  (define (tree-search comparator tree obj failure success)
    (receive (tree ret op)
        (let search ((tree (redden tree)))
	  (tree-match tree
	    ((black)
	     (failure
	      ;; insert
	      (lambda (new-key new-value ret)
	        (values (red (black) (make-item new-key new-value) (black))
		        ret
		        balance))
	      ;; ignore
	      (lambda (ret)
	        (values (black) ret identity))))

	    ((and t (node c a x b))
	     (let ((key (item-key x)))
	       (comparator-if<=> comparator obj key

	                         (receive (a ret op) (search a)
		                   (values (op (node c a x b)) ret op))

	                         (success
		                  key
		                  (item-value x)
		                  ;; update
		                  (lambda (new-key new-value ret)
		                    (values (node c a (make-item new-key new-value) b)
			                    ret
			                    identity))
		                  ;; remove
		                  (lambda (ret)
		                    (values
		                     (tree-match t
		                       ((red (black) x (black))
		                        (black))
		                       ((black (red a x b) _ (black))
		                        (black a x b))
		                       ((black (black) _ (black))
		                        (white))
		                       (_
		                        (receive (x b) (min+delete b)
			                  (rotate (node c a x b)))))
		                     ret
		                     rotate)))

	                         (receive (b ret op) (search b)
		                   (values (op (node c a x b)) ret op)))))))

      (values (blacken tree) ret)))

  (define (tree-key-successor comparator tree obj failure)
    (let loop ((return failure) (tree tree))
      (tree-match tree
        ((black)
         (return))
        ((node _ a x b)
         (let ((key (item-key x)))
	   (comparator-if<=> comparator key obj
			     (loop return b)
			     (loop return b)
			     (loop (lambda () key) a)))))))

  (define (tree-key-predecessor comparator tree obj failure)
    (let loop ((return failure) (tree tree))
      (tree-match tree
        ((black)
         (return))
        ((node _ a x b)
         (let ((key (item-key x)))
	   (comparator-if<=> comparator key obj
			     (loop (lambda () key) b)
			     (loop return a)
			     (loop return a)))))))

  (define (tree-map proc tree)
    (let loop ((tree tree))
      (tree-match tree
        ((black)
         (black))
        ((node c a x b)
         (receive (key value)
	     (proc (item-key x) (item-value x))
	   (node c (loop a) (make-item key value) (loop b)))))))


  (define (tree-catenate tree1 pivot-key pivot-value tree2)
    (let ((pivot (make-item pivot-key pivot-value))
	  (height1 (black-height tree1))
	  (height2 (black-height tree2)))
      (cond
       ((= height1 height2)
        (black tree1 pivot tree2))
       ((< height1 height2)
        (blacken
         (let loop ((tree tree2) (depth (- height2 height1)))
	   (if (zero? depth)
	       (balance (red tree1 pivot tree))
	       (balance
	        (node (color tree) (loop (left tree) (- depth 1)) (item tree) (right tree)))))))
       (else
        (blacken
         (let loop ((tree tree1) (depth (- height1 height2)))
	   (if (zero? depth)
	       (balance (red tree pivot tree2))
	       (balance
	        (node (color tree) (left tree) (item tree) (loop (right tree) (- depth 1)))))))))))

  (define (tree-split comparator tree obj)
    (let loop ((tree1 (black))
	       (tree2 (black))
	       (pivot1 #f)
	       (pivot2 #f)
	       (tree tree))
      (tree-match tree
        ((black)
         (let ((tree1 (catenate-left tree1 pivot1 (black)))
	       (tree2 (catenate-right (black) pivot2 tree2)))
	   (values tree1 tree1 (black) tree2 tree2)))
        ((node _ a x b)
         (comparator-if<=> comparator obj (item-key x)
			   (loop tree1
			         (catenate-right (blacken b) pivot2 tree2)
			         pivot1
			         x
			         (blacken a))
			   (let* ((tree1 (catenate-left tree1 pivot1 (blacken a)))
				  (tree1+ (catenate-left tree1 x (black)))
				  (tree2 (catenate-right (blacken b) pivot2 tree2))
				  (tree2+ (catenate-right (black) x tree2)))
			     (values tree1
				     tree1+
				     (black (black) x (black))
				     tree2+
				     tree2))
			   (loop (catenate-left tree1 pivot1 (blacken a))
			         tree2
			         x
			         pivot2
			         (blacken b)))))))

  (define (catenate-left tree1 item tree2)
    (if item
        (tree-catenate tree1 (item-key item) (item-value item) tree2)
        tree2))

  (define (catenate-right tree1 item tree2)
    (if item
        (tree-catenate tree1 (item-key item) (item-value item) tree2)
        tree1))

  (define (black-height tree)
    (let loop ((tree tree))
      (tree-match tree
        ((black)
         0)
        ((node red a x b)
         (loop b))
        ((node black a x b)
         (+ 1 (loop b))))))

  (define (left-tree tree depth)
    (let loop ((parent #f) (tree tree) (depth depth))
      (if (zero? depth)
	  (values parent tree)
	  (loop tree (left tree) (- depth 1)))))

  (define (right-tree tree depth)
    (let loop ((parent #f) (tree tree) (depth depth))
      (if (zero? depth)
	  (values parent tree)
	  (loop tree (right tree) (- depth 1)))))

;;; Helper procedures for deleting and balancing

  (define (min+delete tree)
    (tree-match tree
      ((red (black) x (black))
       (values x (black)))
      ((black (black) x (black))
       (values x (white)))
      ((black (black) x (red a y b))
       (values x (black a y b)))
      ((node c a x b)
       (receive (v a) (min+delete a)
         (values v (rotate (node c a x b)))))))

  (define (balance tree)
    (tree-match tree
      ((black (red (red a x b) y c) z d)
       (red (black a x b) y (black c z d)))
      ((black (red a x (red b y c)) z d)
       (red (black a x b) y (black c z d)))
      ((black a x (red (red b y c) z d))
       (red (black a x b) y (black c z d)))
      ((black a x (red b y (red c z d)))
       (red (black a x b) y (black c z d)))
      ((white (red a x (red b y c)) z d)
       (black (black a x b) y (black c z d)))
      ((white a x (red (red b y c) z d))
       (black (black a x b) y (black c z d)))
      (t t)))

  (define (rotate tree)
    (tree-match tree
      ((red (white? a+x+b) y (black c z d))
       (balance (black (red (white->black a+x+b) y c) z d)))
      ((red (black a x b) y (white? c+z+d))
       (balance (black a x (red b y (white->black c+z+d)))))
      ((black (white? a+x+b) y (black c z d))
       (balance (white (red (white->black a+x+b) y c) z d)))
      ((black (black a x b) y (white? c+z+d))
       (balance (white a x (red b y (white->black c+z+d)))))
      ((black (white? a+w+b) x (red (black c y d) z e))
       (black (balance (black (red (white->black a+w+b) x c) y d)) z e))
      ((black (red a w (black b x c)) y (white? d+z+e))
       (black a w (balance (black b x (red c y (white->black d+z+e))))))
      (t t))))

;; Local Variables:
;; eval: (put 'tree-match 'scheme-indent-function 1)
;; End:
