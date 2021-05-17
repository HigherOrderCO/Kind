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

(library (srfi :146 hash)
  (export hashmap hashmap-unfold
	  hashmap? hashmap-contains? hashmap-empty? hashmap-disjoint?
	  hashmap-ref hashmap-ref/default hashmap-key-comparator
	  hashmap-adjoin hashmap-adjoin!
	  hashmap-set hashmap-set!
	  hashmap-replace hashmap-replace!
	  hashmap-delete hashmap-delete! hashmap-delete-all hashmap-delete-all!
	  hashmap-intern hashmap-intern!
	  hashmap-update hashmap-update! hashmap-update/default hashmap-update!/default
	  hashmap-pop hashmap-pop!
	  hashmap-search hashmap-search!
	  hashmap-size hashmap-find hashmap-count hashmap-any? hashmap-every?
	  hashmap-keys hashmap-values hashmap-entries
	  hashmap-map hashmap-map->list hashmap-for-each hashmap-fold
	  hashmap-filter hashmap-filter!
	  hashmap-remove hashmap-remove!
	  hashmap-partition hashmap-partition!
	  hashmap-copy hashmap->alist alist->hashmap alist->hashmap!
	  hashmap=? hashmap<? hashmap>? hashmap<=? hashmap>=?
	  hashmap-union hashmap-intersection hashmap-difference hashmap-xor
	  hashmap-union! hashmap-intersection! hashmap-difference! hashmap-xor!
	  make-hashmap-comparator
	  hashmap-comparator
	  comparator?)
  (import (except (rnrs)
                  define-record-type assoc filter find
                  fold-right for-each map member partition
                  remove)
	  (srfi :1)
	  (srfi :8)
	  (srfi :9)
	  (srfi :158)
	  (srfi :128)
	  (srfi :145)
	  (srfi :146 gleckler hamt-map))

  ;; Copyright (C) Marc Nieper-Wißkirchen (2018).  All Rights
  ;; Reserved.

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

  ;; Implementation layer

  (define (error* msg)
    (error 'mapping-hash msg))

  (define (tree-search comparator tree obj failure success)
    (let ((entry (phm/get tree obj)))
      (if entry
	  (success (car entry) (cdr entry)
		   (lambda (new-key new-datum ret)
		     (let ((tree (phm/remove tree obj)))
		       (values (phm/put tree new-key (cons new-key new-datum))
			       ret)))
		   (lambda (ret)
		     (values (phm/remove tree obj) ret)))
	  (failure (lambda (new-key new-datum ret)
		     (values (phm/put tree new-key (cons new-key new-datum))
			     ret))
		   (lambda (ret)
		     (values tree ret))))))

  (define (tree-fold proc seed tree)
    (phm/for-each (lambda (key entry)
		    (set! seed (proc (car entry) (cdr entry) seed)))
		  tree)
    seed)

  (define (tree-for-each proc tree)
    (phm/for-each (lambda (key entry)
		    (proc (car entry) (cdr entry)))
		  tree))

  (define (tree-generator tree)
    (make-coroutine-generator
     (lambda (yield)
       (tree-for-each (lambda item (yield item))
		      tree))))

  ;; New types

  (define-record-type <hashmap>
    (%make-hashmap comparator tree)
    hashmap?
    (comparator hashmap-key-comparator)
    (tree hashmap-tree))

  (define (make-empty-hashmap comparator)
    (assume (comparator? comparator))
    (%make-hashmap comparator
		   (make-phm (comparator-hash-function comparator)
			     (comparator-equality-predicate comparator))))

  ;; Exported procedures

  ;; Constructors

  (define (hashmap comparator . args)
    (assume (comparator? comparator))
    (hashmap-unfold null?
	            (lambda (args)
		      (values (car args)
			      (cadr args)))
	            cddr
	            args
	            comparator))

  (define (hashmap-unfold stop? mapper successor seed comparator)
    (assume (procedure? stop?))
    (assume (procedure? mapper))
    (assume (procedure? successor))
    (assume (comparator? comparator))
    (let loop ((hashmap (make-empty-hashmap comparator))
	       (seed seed))
      (if (stop? seed)
	  hashmap
	  (receive (key value)
	      (mapper seed)
	    (loop (hashmap-adjoin hashmap key value)
		  (successor seed))))))

  ;; Predicates

  (define (hashmap-empty? hashmap)
    (assume (hashmap? hashmap))
    (not (hashmap-any? (lambda (key value) #t) hashmap)))

  (define (hashmap-contains? hashmap key)
    (assume (hashmap? hashmap))
    (call/cc
     (lambda (return)
       (hashmap-search hashmap
		       key
		       (lambda (insert ignore)
		         (return #f))
		       (lambda (key value update remove)
		         (return #t))))))

  (define (hashmap-disjoint? hashmap1 hashmap2)
    (assume (hashmap? hashmap1))
    (assume (hashmap? hashmap2))
    (call/cc
     (lambda (return)
       (hashmap-for-each (lambda (key value)
		           (when (hashmap-contains? hashmap2 key)
		             (return #f)))
		         hashmap1)
       #t)))

  ;; Accessors

  (define hashmap-ref
    (case-lambda
      ((hashmap key)
       (assume (hashmap? hashmap))
       (hashmap-ref hashmap key (lambda ()
			          (error "hashmap-ref: key not in hashmap" key))))
      ((hashmap key failure)
       (assume (hashmap? hashmap))
       (assume (procedure? failure))
       (hashmap-ref hashmap key failure (lambda (value)
				          value)))
      ((hashmap key failure success)
       (assume (hashmap? hashmap))
       (assume (procedure? failure))
       (assume (procedure? success))
       ((call/cc
         (lambda (return-thunk)
	   (hashmap-search hashmap
			   key
			   (lambda (insert ignore)
			     (return-thunk failure))
			   (lambda (key value update remove)
			     (return-thunk (lambda () (success value)))))))))))

  (define (hashmap-ref/default hashmap key default)
    (assume (hashmap? hashmap))
    (hashmap-ref hashmap key (lambda () default)))

  ;; Updaters

  (define (hashmap-adjoin hashmap . args)
    (assume (hashmap? hashmap))
    (let loop ((args args)
	       (hashmap hashmap))
      (if (null? args)
	  hashmap
	  (receive (hashmap value)
	      (hashmap-intern hashmap (car args) (lambda () (cadr args)))
	    (loop (cddr args) hashmap)))))

  (define hashmap-adjoin! hashmap-adjoin)

  (define (hashmap-set hashmap . args)
    (assume (hashmap? hashmap))
    (let loop ((args args)
	       (hashmap hashmap))
      (if (null? args)
	  hashmap
	  (receive (hashmap)
	      (hashmap-update hashmap (car args) (lambda (value) (cadr args)) (lambda () #f))
	    (loop (cddr args)
		  hashmap)))))

  (define hashmap-set! hashmap-set)

  (define (hashmap-replace hashmap key value)
    (assume (hashmap? hashmap))
    (receive (hashmap obj)
        (hashmap-search hashmap
		        key
		        (lambda (insert ignore)
		          (ignore #f))
		        (lambda (old-key old-value update remove)
		          (update key value #f)))
      hashmap))

  (define hashmap-replace! hashmap-replace)

  (define (hashmap-delete hashmap . keys)
    (assume (hashmap? hashmap))
    (hashmap-delete-all hashmap keys))

  (define hashmap-delete! hashmap-delete)

  (define (hashmap-delete-all hashmap keys)
    (assume (hashmap? hashmap))
    (assume (list? keys))
    (fold (lambda (key hashmap)
	    (receive (hashmap obj)
	        (hashmap-search hashmap
			        key
			        (lambda (insert ignore)
			          (ignore #f))
			        (lambda (old-key old-value update remove)
			          (remove #f)))
	      hashmap))
	  hashmap keys))

  (define hashmap-delete-all! hashmap-delete-all)

  (define (hashmap-intern hashmap key failure)
    (assume (hashmap? hashmap))
    (assume (procedure? failure))
    (call/cc
     (lambda (return)
       (hashmap-search hashmap
		       key
		       (lambda (insert ignore)
		         (receive (value)
		             (failure)
		           (insert value value)))
		       (lambda (old-key old-value update remove)
		         (return hashmap old-value))))))

  (define hashmap-intern! hashmap-intern)

  (define hashmap-update
    (case-lambda
      ((hashmap key updater)
       (hashmap-update hashmap key updater (lambda ()
				             (error "hashmap-update: key not found in hashmap" key))))
      ((hashmap key updater failure)
       (hashmap-update hashmap key updater failure (lambda (value)
					             value)))
      ((hashmap key updater failure success)
       (assume (hashmap? hashmap))
       (assume (procedure? updater))
       (assume (procedure? failure))
       (assume (procedure? success))
       (receive (hashmap obj)
	   (hashmap-search hashmap
		           key
		           (lambda (insert ignore)
		             (insert (updater (failure)) #f))
		           (lambda (old-key old-value update remove)
		             (update key (updater (success old-value)) #f)))
         hashmap))))

  (define hashmap-update! hashmap-update)

  (define (hashmap-update/default hashmap key updater default)
    (hashmap-update hashmap key updater (lambda () default)))

  (define hashmap-update!/default hashmap-update/default)

  (define hashmap-pop
    (case-lambda
      ((hashmap)
       (hashmap-pop hashmap (lambda ()
			      (error* "hashmap-pop: hashmap has no association"))))
      ((hashmap failure)
       (assume (hashmap? hashmap))
       (assume (procedure? failure))
       ((call/cc
         (lambda (return-thunk)
	   (receive (key value)
	       (hashmap-find (lambda (key value) #t) hashmap (lambda () (return-thunk failure)))
	     (lambda ()
	       (values (hashmap-delete hashmap key) key value)))))))))

  (define hashmap-pop! hashmap-pop)

  (define (hashmap-search hashmap key failure success)
    (assume (hashmap? hashmap))
    (assume (procedure? failure))
    (assume (procedure? success))
    (call/cc
     (lambda (return)
       (let*-values
	   (((comparator)
	     (hashmap-key-comparator hashmap))
	    ((tree obj)
	     (tree-search comparator
			  (hashmap-tree hashmap)
			  key
			  (lambda (insert ignore)
			    (failure (lambda (value obj)
				       (insert key value obj))
				     (lambda (obj)
				       (return hashmap obj))))
			  success)))
         (values (%make-hashmap comparator tree)
	         obj)))))

  (define hashmap-search! hashmap-search)

  ;; The whole hashmap

  (define (hashmap-size hashmap)
    (assume (hashmap? hashmap))
    (hashmap-count (lambda (key value)
	             #t)
	           hashmap))

  (define (hashmap-find predicate hashmap failure)
    (assume (procedure? predicate))
    (assume (hashmap? hashmap))
    (assume (procedure? failure))
    (call/cc
     (lambda (return)
       (hashmap-for-each (lambda (key value)
		           (when (predicate key value)
		             (return key value)))
		         hashmap)
       (failure))))

  (define (hashmap-count predicate hashmap)
    (assume (procedure? predicate))
    (assume (hashmap? hashmap))
    (hashmap-fold (lambda (key value count)
	            (if (predicate key value)
		        (+ 1 count)
		        count))
	          0 hashmap))

  (define (hashmap-any? predicate hashmap)
    (assume (procedure? predicate))
    (assume (hashmap? hashmap))
    (call/cc
     (lambda (return)
       (hashmap-for-each (lambda (key value)
		           (when (predicate key value)
		             (return #t)))
		         hashmap)
       #f)))

  (define (hashmap-every? predicate hashmap)
    (assume (procedure? predicate))
    (assume (hashmap? hashmap))
    (not (hashmap-any? (lambda (key value)
		         (not (predicate key value)))
		       hashmap)))

  (define (hashmap-keys hashmap)
    (assume (hashmap? hashmap))
    (hashmap-fold (lambda (key value keys)
		    (cons key keys))
		  '() hashmap))

  (define (hashmap-values hashmap)
    (assume (hashmap? hashmap))
    (hashmap-fold (lambda (key value values)
		    (cons value values))
		  '() hashmap))

  (define (hashmap-entries hashmap)
    (assume (hashmap? hashmap))
    (values (hashmap-keys hashmap)
	    (hashmap-values hashmap)))

  ;; Hashmap and folding

  (define (hashmap-map proc comparator hashmap)
    (assume (procedure? proc))
    (assume (comparator? comparator))
    (assume (hashmap? hashmap))
    (hashmap-fold (lambda (key value hashmap)
	            (receive (key value)
		        (proc key value)
		      (hashmap-set hashmap key value)))
	          (make-empty-hashmap comparator)
	          hashmap))

  (define (hashmap-for-each proc hashmap)
    (assume (procedure? proc))
    (assume (hashmap? hashmap))
    (tree-for-each proc (hashmap-tree hashmap)))

  (define (hashmap-fold proc acc hashmap)
    (assume (procedure? proc))
    (assume (hashmap? hashmap))
    (tree-fold proc acc (hashmap-tree hashmap)))

  (define (hashmap-map->list proc hashmap)
    (assume (procedure? proc))
    (assume (hashmap? hashmap))
    (hashmap-fold (lambda (key value lst)
		    (cons (proc key value) lst))
		  '()
		  hashmap))

  (define (hashmap-filter predicate hashmap)
    (assume (procedure? predicate))
    (assume (hashmap? hashmap))
    (hashmap-fold (lambda (key value hashmap)
	            (if (predicate key value)
		        (hashmap-set hashmap key value)
		        hashmap))
	          (make-empty-hashmap (hashmap-key-comparator hashmap))
	          hashmap))

  (define hashmap-filter! hashmap-filter)

  (define (hashmap-remove predicate hashmap)
    (assume (procedure? predicate))
    (assume (hashmap? hashmap))
    (hashmap-filter (lambda (key value)
		      (not (predicate key value)))
	            hashmap))

  (define hashmap-remove! hashmap-remove)

  (define (hashmap-partition predicate hashmap)
    (assume (procedure? predicate))
    (assume (hashmap? hashmap))
    (values (hashmap-filter predicate hashmap)
	    (hashmap-remove predicate hashmap)))

  (define hashmap-partition! hashmap-partition)

  ;; Copying and conversion

  (define (hashmap-copy hashmap)
    (assume (hashmap? hashmap))
    hashmap)

  (define (hashmap->alist hashmap)
    (assume (hashmap? hashmap))
    (hashmap-fold (lambda (key value alist)
		    (cons (cons key value) alist))
		  '() hashmap))

  (define (alist->hashmap comparator alist)
    (assume (comparator? comparator))
    (assume (list? alist))
    (hashmap-unfold null?
	            (lambda (alist)
		      (let ((key (caar alist))
		            (value (cdar alist)))
		        (values key value)))
	            cdr
	            alist
	            comparator))

  (define (alist->hashmap! hashmap alist)
    (assume (hashmap? hashmap))
    (assume (list? alist))
    (fold (lambda (association hashmap)
	    (let ((key (car association))
		  (value (cdr association)))
	      (hashmap-set hashmap key value)))
	  hashmap
	  alist))

  ;; Subhashmaps

  (define hashmap=?
    (case-lambda
      ((comparator hashmap)
       (assume (hashmap? hashmap))
       #t)
      ((comparator hashmap1 hashmap2) (%hashmap=? comparator hashmap1 hashmap2))
      ((comparator hashmap1 hashmap2 . hashmaps)
       (and (%hashmap=? comparator hashmap1 hashmap2)
            (apply hashmap=? comparator hashmap2 hashmaps)))))
  (define (%hashmap=? comparator hashmap1 hashmap2)
    (and (eq? (hashmap-key-comparator hashmap1) (hashmap-key-comparator hashmap2))
         (%hashmap<=? comparator hashmap1 hashmap2)
         (%hashmap<=? comparator hashmap2 hashmap1)))

  (define hashmap<=?
    (case-lambda
      ((comparator hashmap)
       (assume (hashmap? hashmap))
       #t)
      ((comparator hashmap1 hashmap2)
       (assume (comparator? comparator))
       (assume (hashmap? hashmap1))
       (assume (hashmap? hashmap2))
       (%hashmap<=? comparator hashmap1 hashmap2))
      ((comparator hashmap1 hashmap2 . hashmaps)
       (assume (comparator? comparator))
       (assume (hashmap? hashmap1))
       (assume (hashmap? hashmap2))
       (and (%hashmap<=? comparator hashmap1 hashmap2)
            (apply hashmap<=? comparator hashmap2 hashmaps)))))

  (define (%hashmap<=? comparator hashmap1 hashmap2)
    (assume (comparator? comparator))
    (assume (hashmap? hashmap1))
    (assume (hashmap? hashmap2))
    (hashmap-every? (lambda (key value)
		      (hashmap-ref hashmap2 key
				   (lambda ()
				     #f)
				   (lambda (stored-value)
				     (=? comparator value stored-value))))
		    hashmap1))

  (define hashmap>?
    (case-lambda
      ((comparator hashmap)
       (assume (hashmap? hashmap))
       #t)
      ((comparator hashmap1 hashmap2)
       (assume (comparator? comparator))
       (assume (hashmap? hashmap1))
       (assume (hashmap? hashmap2))
       (%hashmap>? comparator hashmap1 hashmap2))
      ((comparator hashmap1 hashmap2 . hashmaps)
       (assume (comparator? comparator))
       (assume (hashmap? hashmap1))
       (assume (hashmap? hashmap2))
       (and (%hashmap>? comparator  hashmap1 hashmap2)
            (apply hashmap>? comparator hashmap2 hashmaps)))))

  (define (%hashmap>? comparator hashmap1 hashmap2)
    (assume (comparator? comparator))
    (assume (hashmap? hashmap1))
    (assume (hashmap? hashmap2))
    (not (%hashmap<=? comparator hashmap1 hashmap2)))

  (define hashmap<?
    (case-lambda
      ((comparator hashmap)
       (assume (hashmap? hashmap))
       #t)
      ((comparator hashmap1 hashmap2)
       (assume (comparator? comparator))
       (assume (hashmap? hashmap1))
       (assume (hashmap? hashmap2))
       (%hashmap<? comparator hashmap1 hashmap2))
      ((comparator hashmap1 hashmap2 . hashmaps)
       (assume (comparator? comparator))
       (assume (hashmap? hashmap1))
       (assume (hashmap? hashmap2))
       (and (%hashmap<? comparator  hashmap1 hashmap2)
            (apply hashmap<? comparator hashmap2 hashmaps)))))

  (define (%hashmap<? comparator hashmap1 hashmap2)
    (assume (comparator? comparator))
    (assume (hashmap? hashmap1))
    (assume (hashmap? hashmap2))
    (%hashmap>? comparator hashmap2 hashmap1))

  (define hashmap>=?
    (case-lambda
      ((comparator hashmap)
       (assume (hashmap? hashmap))
       #t)
      ((comparator hashmap1 hashmap2)
       (assume (comparator? comparator))
       (assume (hashmap? hashmap1))
       (assume (hashmap? hashmap2))
       (%hashmap>=? comparator hashmap1 hashmap2))
      ((comparator hashmap1 hashmap2 . hashmaps)
       (assume (comparator? comparator))
       (assume (hashmap? hashmap1))
       (assume (hashmap? hashmap2))
       (and (%hashmap>=? comparator hashmap1 hashmap2)
            (apply hashmap>=? comparator hashmap2 hashmaps)))))

  (define (%hashmap>=? comparator hashmap1 hashmap2)
    (assume (comparator? comparator))
    (assume (hashmap? hashmap1))
    (assume (hashmap? hashmap2))
    (not (%hashmap<? comparator hashmap1 hashmap2)))

  ;; Set theory operations

  (define (%hashmap-union hashmap1 hashmap2)
    (hashmap-fold (lambda (key2 value2 hashmap)
		    (receive (hashmap obj)
		        (hashmap-search hashmap
				        key2
				        (lambda (insert ignore)
					  (insert value2 #f))
				        (lambda (key1 value1 update remove)
					  (update key1 value1 #f)))
		      hashmap))
		  hashmap1 hashmap2))

  (define (%hashmap-intersection hashmap1 hashmap2)
    (hashmap-filter (lambda (key1 value1)
		      (hashmap-contains? hashmap2 key1))
	            hashmap1))

  (define (%hashmap-difference hashmap1 hashmap2)
    (hashmap-fold (lambda (key2 value2 hashmap)
	            (receive (hashmap obj)
		        (hashmap-search hashmap
			                key2
			                (lambda (insert ignore)
				          (ignore #f))
			                (lambda (key1 value1 update remove)
				          (remove #f)))
		      hashmap))
	          hashmap1 hashmap2))

  (define (%hashmap-xor hashmap1 hashmap2)
    (hashmap-fold (lambda (key2 value2 hashmap)
	            (receive (hashmap obj)
		        (hashmap-search hashmap
			                key2
			                (lambda (insert ignore)
				          (insert value2 #f))
			                (lambda (key1 value1 update remove)
				          (remove #f)))
		      hashmap))
	          hashmap1 hashmap2))

  (define hashmap-union
    (case-lambda
      ((hashmap)
       (assume (hashmap? hashmap))
       hashmap)
      ((hashmap1 hashmap2)
       (assume (hashmap? hashmap1))
       (assume (hashmap? hashmap2))
       (%hashmap-union hashmap1 hashmap2))
      ((hashmap1 hashmap2 . hashmaps)
       (assume (hashmap? hashmap1))
       (assume (hashmap? hashmap2))
       (apply hashmap-union (%hashmap-union hashmap1 hashmap2) hashmaps))))
  (define hashmap-union! hashmap-union)

  (define hashmap-intersection
    (case-lambda
      ((hashmap)
       (assume (hashmap? hashmap))
       hashmap)
      ((hashmap1 hashmap2)
       (assume (hashmap? hashmap1))
       (assume (hashmap? hashmap2))
       (%hashmap-intersection hashmap1 hashmap2))
      ((hashmap1 hashmap2 . hashmaps)
       (assume (hashmap? hashmap1))
       (assume (hashmap? hashmap2))
       (apply hashmap-intersection (%hashmap-intersection hashmap1 hashmap2) hashmaps))))
  (define hashmap-intersection! hashmap-intersection)

  (define hashmap-difference
    (case-lambda
      ((hashmap)
       (assume (hashmap? hashmap))
       hashmap)
      ((hashmap1 hashmap2)
       (assume (hashmap? hashmap1))
       (assume (hashmap? hashmap2))
       (%hashmap-difference hashmap1 hashmap2))
      ((hashmap1 hashmap2 . hashmaps)
       (assume (hashmap? hashmap1))
       (assume (hashmap? hashmap2))
       (apply hashmap-difference (%hashmap-difference hashmap1 hashmap2) hashmaps))))
  (define hashmap-difference! hashmap-difference)

  (define hashmap-xor
    (case-lambda
      ((hashmap)
       (assume (hashmap? hashmap))
       hashmap)
      ((hashmap1 hashmap2)
       (assume (hashmap? hashmap1))
       (assume (hashmap? hashmap2))
       (%hashmap-xor hashmap1 hashmap2))
      ((hashmap1 hashmap2 . hashmaps)
       (assume (hashmap? hashmap1))
       (assume (hashmap? hashmap2))
       (apply hashmap-xor (%hashmap-xor hashmap1 hashmap2) hashmaps))))
  (define hashmap-xor! hashmap-xor)

  ;; Comparators

  (define (hashmap-equality comparator)
    (assume (comparator? comparator))
    (lambda (hashmap1 hashmap2)
      (hashmap=? comparator hashmap1 hashmap2)))

  (define (hashmap-hash-function comparator)
    (assume (comparator? comparator))
    (lambda (hashmap)
      0 ;; TODO
      #;
      (default-hash (hashmap->alist hashmap))))

  (define (make-hashmap-comparator comparator)
    (make-comparator hashmap?
		     (hashmap-equality comparator)
		     #f
		     (hashmap-hash-function comparator)))

  (define hashmap-comparator (make-hashmap-comparator (make-default-comparator)))

  (comparator-register-default! hashmap-comparator))
