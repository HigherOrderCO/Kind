#!r6rs
(library (srfi srfi-113)

  (export
   set set-unfold
   set? set-contains? set-empty? set-disjoint?
   set-member set-element-comparator
   set-adjoin set-adjoin! set-replace set-replace!
   set-delete set-delete! set-delete-all set-delete-all! set-search!
   set-size set-find set-count set-any? set-every?
   set-map set-for-each set-fold
   set-filter set-remove set-remove set-partition
   set-filter! set-remove! set-partition!
   set-copy set->list list->set list->set!
   set=? set<? set>? set<=? set>=?
   set-union set-intersection set-difference set-xor
   set-union! set-intersection! set-difference! set-xor!
   set-comparator

   bag bag-unfold
   bag? bag-contains? bag-empty? bag-disjoint?
   bag-member bag-element-comparator
   bag-adjoin bag-adjoin! bag-replace bag-replace!
   bag-delete bag-delete! bag-delete-all bag-delete-all! bag-search!
   bag-size bag-find bag-count bag-any? bag-every?
   bag-map bag-for-each bag-fold
   bag-filter bag-remove bag-partition
   bag-filter! bag-remove! bag-partition!
   bag-copy bag->list list->bag list->bag!
   bag=? bag<? bag>? bag<=? bag>=?
   bag-union bag-intersection bag-difference bag-xor
   bag-union! bag-intersection! bag-difference! bag-xor!
   bag-comparator
   bag-sum bag-sum! bag-product bag-product!
   bag-unique-size bag-element-count bag-for-each-unique bag-fold-unique
   bag-increment! bag-decrement! bag->set set->bag set->bag!
   bag->alist alist->bag)

  (import (except (rnrs) define-record-type)
          (only (rnrs r5rs) modulo)
          (srfi :9)
          (srfi :128 comparators)
          (srfi :125 hashtables))

  (begin

    ;;;; Implementation of general sets and bags for SRFI 113

;;; A "sob" object is the representation of both sets and bags.
;;; This allows each set-* and bag-* procedure to be implemented
;;; using the same code, without having to deal in ugly indirections
;;; over the field accessors.  There are three fields, "sob-multi?",
;;; "sob-hash-table", and "sob-comparator."

;;; The value of "sob-multi?" is #t for bags and #f for sets.
;;; "Sob-hash-table" maps the elements of the sob to the number of times
;;; the element appears, which is always 1 for a set, any positive value
;;; for a bag.  "Sob-comparator" is the comparator for the elements of
;;; the set.

;;; Note that sob-* procedures do not do type checking or (typically) the
;;; copying required for supporting pure functional update.  These things
;;; are done by the set-* and bag-* procedures, which are externally
;;; exposed (but trivial and mostly uncommented below).


;;; Shim to convert from SRFI 69 to the future "intermediate hash tables"
;;; SRFI.  Unfortunately, hash-table-fold is incompatible between the two
;;; and so is not usable.

    ;; This will be just "make-hash-table" in future.

    (define (make-hash-table/comparator comparator)
      (make-hash-table comparator))

    ;; These two procedures adjust for the mismatch between the hash functions
    ;; of SRFI 114, which return a potentially unbounded non-negative integer,
    ;; and the hash functions of SRFI 69, which expect to be able to pass
    ;; a second argument which is an upper bound.

    (define (modulizer hash-function)
      (case-lambda
        ((obj) (hash-function obj))
        ((obj limit) (modulo (hash-function obj) limit))))

;;; Record definition and core typing/checking procedures

    (define-record-type sob
      (raw-make-sob hash-table comparator multi?)
      sob?
      (hash-table sob-hash-table)
      (comparator sob-comparator)
      (multi? sob-multi?))

    (define (set? obj) (and (sob? obj) (not (sob-multi? obj))))

    (define (bag? obj) (and (sob? obj) (sob-multi? obj)))

    (define (check-set obj) (if (not (set? obj)) (error "not a set" obj)))

    (define (check-bag obj) (if (not (bag? obj)) (error "not a bag" obj)))

    ;; These procedures verify that not only are their arguments all sets
    ;; or all bags as the case may be, but also share the same comparator.

    (define (check-all-sets list)
      (for-each (lambda (obj) (check-set obj)) list)
      (sob-check-comparators list))

    (define (check-all-bags list)
      (for-each (lambda (obj) (check-bag obj)) list)
      (sob-check-comparators list))

    (define (sob-check-comparators list)
      (if (not (null? list))
          (for-each
           (lambda (sob)
             (check-same-comparator (car list) sob))
           (cdr list))))

    ;; This procedure is used directly when there are exactly two arguments.

    (define (check-same-comparator a b)
      (if (not (eq? (sob-comparator a) (sob-comparator b)))
          (error "different comparators" a b)))

    ;; This procedure defends against inserting an element
    ;; into a sob that violates its constructor, since
    ;; typical hash-table implementations don't check for us.

    (define (check-element sob element)
      (comparator-check-type (sob-comparator sob) element))

;;; Constructors

    ;; Construct an arbitrary empty sob out of nothing.

    (define (make-sob comparator multi?)
      (raw-make-sob (make-hash-table/comparator comparator) comparator multi?))

    ;; Copy a sob, sharing the constructor.

    (define (sob-copy sob)
      (raw-make-sob (hash-table-copy (sob-hash-table sob) #t)
                    (sob-comparator sob)
                    (sob-multi? sob)))

    (define (set-copy set)
      (check-set set)
      (sob-copy set))

    (define (bag-copy bag)
      (check-bag bag)
      (sob-copy bag))

    ;; Construct an empty sob that shares the constructor of an existing sob.

    (define (sob-empty-copy sob)
      (make-sob (sob-comparator sob) (sob-multi? sob)))

    ;; Construct a set or a bag and insert elements into it.  These are the
    ;; simplest external constructors.

    (define (set comparator . elements)
      (let ((result (make-sob comparator #f)))
        (for-each (lambda (x) (sob-increment! result x 1)) elements)
        result))

    (define (bag comparator . elements)
      (let ((result (make-sob comparator #t)))
        (for-each (lambda (x) (sob-increment! result x 1)) elements)
        result))

    ;; The fundamental (as opposed to simplest) constructor: unfold the
    ;; results of iterating a function as a set.  In line with SRFI 1,
    ;; we provide an opportunity to map the sequence of seeds through a
    ;; mapper function.

    (define (sob-unfold stop? mapper successor seed comparator multi?)
      (let ((result (make-sob comparator multi?)))
        (let loop ((seed seed))
          (if (stop? seed)
              result
              (begin
                (sob-increment! result (mapper seed) 1)
                (loop (successor seed)))))))

    (define (set-unfold continue? mapper successor seed comparator)
      (sob-unfold continue? mapper successor seed comparator #f))

    (define (bag-unfold continue? mapper successor seed comparator)
      (sob-unfold continue? mapper successor seed comparator #t))

;;; Predicates

    ;; Just a wrapper of hash-table-contains?.

    (define (sob-contains? sob member)
      (hash-table-contains? (sob-hash-table sob) member))

    (define (set-contains? set member)
      (check-set set)
      (sob-contains? set member))

    (define (bag-contains? bag member)
      (check-bag bag)
      (sob-contains? bag member))

    ;; A sob is empty if its size is 0.

    (define (sob-empty? sob)
      (= 0 (hash-table-size (sob-hash-table sob))))

    (define (set-empty? set)
      (check-set set)
      (sob-empty? set))

    (define (bag-empty? bag)
      (check-bag bag)
      (sob-empty? bag))

    ;; Two sobs are disjoint if, when looping through one, we can't find
    ;; any of its elements in the other.  We have to try both ways:
    ;; sob-half-disjoint checks just one direction for simplicity.

    (define (sob-half-disjoint? a b)
      (let ((ha (sob-hash-table a))
            (hb (sob-hash-table b)))
        (call/cc
         (lambda (return)
           (hash-table-for-each
            (lambda (key val) (if (hash-table-contains? hb key) (return #f)))
            ha)
           #t))))

    (define (set-disjoint? a b)
      (check-set a)
      (check-set b)
      (check-same-comparator a b)
      (and (sob-half-disjoint? a b) (sob-half-disjoint? b a)))

    (define (bag-disjoint? a b)
      (check-bag a)
      (check-bag b)
      (check-same-comparator a b)
      (and (sob-half-disjoint? a b) (sob-half-disjoint? b a)))

    ;; Accessors

    ;; If two objects are indistinguishable by the comparator's
    ;; equality procedure, only one of them will be represented in the sob.
    ;; This procedure lets us find out which one it is; it will return
    ;; the value stored in the sob that is equal to the element.
    ;; Note that we have to search the whole hash table item by item.
    ;; The default is returned if there is no such element.

    (define (sob-member sob element default)
      (define (same? a b) (=? (sob-comparator sob) a b))
      (call/cc
       (lambda (return)
         (hash-table-for-each
          (lambda (key val) (if (same? key element) (return key)))
          (sob-hash-table sob))
         default)))

    (define (set-member set element default)
      (check-set set)
      (sob-member set element default))

    (define (bag-member bag element default)
      (check-bag bag)
      (sob-member bag element default))

    ;; Retrieve the comparator.

    (define (set-element-comparator set)
      (check-set set)
      (sob-comparator set))

    (define (bag-element-comparator bag)
      (check-bag bag)
      (sob-comparator bag))


    ;; Updaters (pure functional and linear update)

    ;; The primitive operation for adding an element to a sob.
    ;; There are a few cases where we bypass this for efficiency.

    (define (sob-increment! sob element count)
      (check-element sob element)
      (hash-table-update!/default
       (sob-hash-table sob)
       element
       (if (sob-multi? sob)
           (lambda (value) (+ value count))
           (lambda (value) 1))
       0))

    ;; The primitive operation for removing an element from a sob.  Note this
    ;; procedure is incomplete: it allows the count of an element to drop below 1.
    ;; Therefore, whenever it is used it is necessary to call sob-cleanup!
    ;; to fix things up.  This is done because it is unsafe to remove an
    ;; object from a hash table while iterating through it.

    (define (sob-decrement! sob element count)
      (hash-table-update!/default
       (sob-hash-table sob)
       element
       (lambda (value) (- value count))
       0))

    ;; This is the cleanup procedure, which happens in two passes: it
    ;; iterates through the sob, deciding which elements to remove (those
    ;; with non-positive counts), and collecting them in a list.  When the
    ;; iteration is done, it is safe to remove the elements using the list,
    ;; because we are no longer iterating over the hash table.  It returns
    ;; its argument, because it is often tail-called at the end of some
    ;; procedure that wants to return the clean sob.

    (define (sob-cleanup! sob)
      (let ((ht (sob-hash-table sob)))
        (for-each (lambda (key) (hash-table-delete! ht key))
                  (nonpositive-keys ht))
        sob))

    (define (nonpositive-keys ht)
      (let ((result '()))
        (hash-table-for-each
         (lambda (key value)
           (when (<= value 0)
             (set! result (cons key result))))
         ht)
        result))

    ;; We expose these for bags but not sets.

    (define (bag-increment! bag element count)
      (check-bag bag)
      (sob-increment! bag element count)
      bag)

    (define (bag-decrement! bag element count)
      (check-bag bag)
      (sob-decrement! bag element count)
      (sob-cleanup! bag)
      bag)

    ;; The primitive operation to add elements from a list.  We expose
    ;; this two ways: with a list argument and with multiple arguments.

    (define (sob-adjoin-all! sob elements)
      (for-each
       (lambda (elem)
         (sob-increment! sob elem 1))
       elements))

    (define (set-adjoin! set . elements)
      (check-set set)
      (sob-adjoin-all! set elements)
      set)

    (define (bag-adjoin! bag . elements)
      (check-bag bag)
      (sob-adjoin-all! bag elements)
      bag)


    ;; These versions copy the set or bag before adjoining.

    (define (set-adjoin set . elements)
      (check-set set)
      (let ((result (sob-copy set)))
        (sob-adjoin-all! result elements)
        result))

    (define (bag-adjoin bag . elements)
      (check-bag bag)
      (let ((result (sob-copy bag)))
        (sob-adjoin-all! result elements)
        result))

    ;; Given an element which resides in a set, this makes sure that the
    ;; specified element is represented by the form given.  Thus if a
    ;; sob contains 2 and the equality predicate is =, then calling
    ;; (sob-replace! sob 2.0) will replace the 2 with 2.0.  Does nothing
    ;; if there is no such element in the sob.

    (define (sob-replace! sob element)
      (let* ((comparator (sob-comparator sob))
             (= (comparator-equality-predicate comparator))
             (ht (sob-hash-table sob)))
        (comparator-check-type comparator element)
        (call/cc
         (lambda (return)
           (hash-table-for-each
            (lambda (key value)
              (when (= key element)
                (hash-table-delete! ht key)
                (hash-table-set! ht element value)
                (return sob)))
            ht)
           sob))))

    (define (set-replace! set element)
      (check-set set)
      (sob-replace! set element)
      set)

    (define (bag-replace! bag element)
      (check-bag bag)
      (sob-replace! bag element)
      bag)

    ;; Non-destructive versions that copy the set first.  Yes, a little
    ;; bit inefficient because it copies the element to be replaced before
    ;; actually replacing it.

    (define (set-replace set element)
      (check-set set)
      (let ((result (sob-copy set)))
        (sob-replace! result element)
        result))

    (define (bag-replace bag element)
      (check-bag bag)
      (let ((result (sob-copy bag)))
        (sob-replace! result element)
        result))

    ;; The primitive operation to delete elemnets from a list.
    ;; Like sob-adjoin-all!, this is exposed two ways.  It calls
    ;; sob-cleanup! itself, so its callers don't need to (though it is safe
    ;; to do so.)

    (define (sob-delete-all! sob elements)
      (for-each (lambda (element) (sob-decrement! sob element 1)) elements)
      (sob-cleanup! sob)
      sob)

    (define (set-delete! set . elements)
      (check-set set)
      (sob-delete-all! set elements))

    (define (bag-delete! bag . elements)
      (check-bag bag)
      (sob-delete-all! bag elements))

    (define (set-delete-all! set elements)
      (check-set set)
      (sob-delete-all! set elements))

    (define (bag-delete-all! bag elements)
      (check-bag bag)
      (sob-delete-all! bag elements))

    ;; Non-destructive version copy first; this is inefficient.

    (define (set-delete set . elements)
      (check-set set)
      (sob-delete-all! (sob-copy set) elements))

    (define (bag-delete bag . elements)
      (check-bag bag)
      (sob-delete-all! (sob-copy bag) elements))

    (define (set-delete-all set elements)
      (check-set set)
      (sob-delete-all! (sob-copy set) elements))

    (define (bag-delete-all bag elements)
      (check-bag bag)
      (sob-delete-all! (sob-copy bag) elements))

    ;; Flag used by sob-search! to represent a missing object.

    (define missing (string-copy "missing"))

    ;; Searches and then dispatches to user-defined procedures on failure
    ;; and success, which in turn should reinvoke a procedure to take some
    ;; action on the set (insert, ignore, replace, or remove).

    (define (sob-search! sob element failure success)
      (define (insert obj)
        (sob-increment! sob element 1)
        (values sob obj))
      (define (ignore obj)
        (values sob obj))
      (define (update new-elem obj)
        (sob-decrement! sob element 1)
        (sob-increment! sob new-elem 1)
        (values (sob-cleanup! sob) obj))
      (define (remove obj)
        (sob-decrement! sob element 1)
        (values (sob-cleanup! sob) obj))
      (let ((true-element (sob-member sob element missing)))
        (if (eq? true-element missing)
            (failure insert ignore)
            (success true-element update remove))))

    (define (set-search! set element failure success)
      (check-set set)
      (sob-search! set element failure success))

    (define (bag-search! bag element failure success)
      (check-bag bag)
      (sob-search! bag element failure success))

    ;; Return the size of a sob.  If it's a set, we can just use the
    ;; number of associations in the hash table, but if it's a bag, we
    ;; have to add up the counts.

    (define (sob-size sob)
      (if (sob-multi? sob)
          (let ((result 0))
            (hash-table-for-each
             (lambda (elem count) (set! result (+ count result)))
             (sob-hash-table sob))
            result)
          (hash-table-size (sob-hash-table sob))))

    (define (set-size set)
      (check-set set)
      (sob-size set))

    (define (bag-size bag)
      (check-bag bag)
      (sob-size bag))

    ;; Search a sob to find something that matches a predicate.  You don't
    ;; know which element you will get, so this is not as useful as finding
    ;; an element in a list or other ordered container.  If it's not there,
    ;; call the failure thunk.

    (define (sob-find pred sob failure)
      (call/cc
       (lambda (return)
         (hash-table-for-each
          (lambda (key value)
            (if (pred key) (return key)))
          (sob-hash-table sob))
         (failure))))

    (define (set-find pred set failure)
      (check-set set)
      (sob-find pred set failure))

    (define (bag-find pred bag failure)
      (check-bag bag)
      (sob-find pred bag failure))

    ;; Count the number of elements in the sob that satisfy the predicate.
    ;; This is a special case of folding.

    (define (sob-count pred sob)
      (sob-fold
       (lambda (elem total) (if (pred elem) (+ total 1) total))
       0
       sob))

    (define (set-count pred set)
      (check-set set)
      (sob-count pred set))

    (define (bag-count pred bag)
      (check-bag bag)
      (sob-count pred bag))

    ;; Check if any of the elements in a sob satisfy a predicate.  Breaks out
    ;; early (with call/cc) if a success is found.

    (define (sob-any? pred sob)
      (call/cc
       (lambda (return)
         (hash-table-for-each
          (lambda (elem value) (if (pred elem) (return #t)))
          (sob-hash-table sob))
         #f)))

    (define (set-any? pred set)
      (check-set set)
      (sob-any? pred set))

    (define (bag-any? pred bag)
      (check-bag bag)
      (sob-any? pred bag))

    ;; Analogous to set-any?.  Breaks out early if a failure is found.

    (define (sob-every? pred sob)
      (call/cc
       (lambda (return)
         (hash-table-for-each
          (lambda (elem value) (if (not (pred elem)) (return #f)))
          (sob-hash-table sob))
         #t)))

    (define (set-every? pred set)
      (check-set set)
      (sob-every? pred set))

    (define (bag-every? pred bag)
      (check-bag bag)
      (sob-every? pred bag))


;;; Mapping and folding

    ;; A utility for iterating a command n times.  This is used by sob-for-each
    ;; to execute a procedure over the repeated elements in a bag.  Because
    ;; of the representation of sets, it works for them too.

    (define (do-n-times cmd n)
      (let loop ((n n))
        (when (> n 0)
          (cmd)
          (loop (- n 1)))))

    ;; Basic iterator over a sob.

    (define (sob-for-each proc sob)
      (hash-table-for-each
       (lambda (key value) (do-n-times (lambda () (proc key)) value))
       (sob-hash-table sob)))

    (define (set-for-each proc set)
      (check-set set)
      (sob-for-each proc set))

    (define (bag-for-each proc bag)
      (check-bag bag)
      (sob-for-each proc bag))

    ;; Fundamental mapping operator.  We map over the associations directly,
    ;; because each instance of an element in a bag will be treated identically
    ;; anyway; we insert them all at once with sob-increment!.

    (define (sob-map comparator proc sob)
      (let ((result (make-sob comparator (sob-multi? sob))))
        (hash-table-for-each
         (lambda (key value) (sob-increment! result (proc key) value))
         (sob-hash-table sob))
        result))

    (define (set-map comparator proc set)
      (check-set set)
      (sob-map comparator proc set))

    (define (bag-map comparator proc bag)
      (check-bag bag)
      (sob-map comparator proc bag))

    ;; The fundamental deconstructor.  Note that there are no left vs. right
    ;; folds because there is no order.  Each element in a bag is fed into
    ;; the fold separately.

    (define (sob-fold proc nil sob)
      (let ((result nil))
        (sob-for-each
         (lambda (elem) (set! result (proc elem result)))
         sob)
        result))

    (define (set-fold proc nil set)
      (check-set set)
      (sob-fold proc nil set))

    (define (bag-fold proc nil bag)
      (check-bag bag)
      (sob-fold proc nil bag))

    ;; Process every element and copy the ones that satisfy the predicate.
    ;; Identical elements are processed all at once.  This is used for both
    ;; filter and remove.

    (define (sob-filter pred sob)
      (let ((result (sob-empty-copy sob)))
        (hash-table-for-each
         (lambda (key value)
           (if (pred key) (sob-increment! result key value)))
         (sob-hash-table sob))
        result))

    (define (set-filter pred set)
      (check-set set)
      (sob-filter pred set))

    (define (bag-filter pred bag)
      (check-bag bag)
      (sob-filter pred bag))

    (define (set-remove pred set)
      (check-set set)
      (sob-filter (lambda (x) (not (pred x))) set))

    (define (bag-remove pred bag)
      (check-bag bag)
      (sob-filter (lambda (x) (not (pred x))) bag))

    ;; Process each element and remove those that don't satisfy the filter.
    ;; This does its own cleanup, and is used for both filter! and remove!.

    (define (sob-filter! pred sob)
      (hash-table-for-each
       (lambda (key value)
         (if (not (pred key)) (sob-decrement! sob key value)))
       (sob-hash-table sob))
      (sob-cleanup! sob))

    (define (set-filter! pred set)
      (check-set set)
      (sob-filter! pred set))

    (define (bag-filter! pred bag)
      (check-bag bag)
      (sob-filter! pred bag))

    (define (set-remove! pred set)
      (check-set set)
      (sob-filter! (lambda (x) (not (pred x))) set))

    (define (bag-remove! pred bag)
      (check-bag bag)
      (sob-filter! (lambda (x) (not (pred x))) bag))

    ;; Create two sobs and copy the elements that satisfy the predicate into
    ;; one of them, all others into the other.  This is more efficient than
    ;; filtering and removing separately.

    (define (sob-partition pred sob)
      (let ((res1 (sob-empty-copy sob))
            (res2 (sob-empty-copy sob)))
        (hash-table-for-each
         (lambda (key value)
           (if (pred key)
               (sob-increment! res1 key value)
               (sob-increment! res2 key value)))
         (sob-hash-table sob))
        (values res1 res2)))

    (define (set-partition pred set)
      (check-set set)
      (sob-partition pred set))

    (define (bag-partition pred bag)
      (check-bag bag)
      (sob-partition pred bag))

    ;; Create a sob and iterate through the given sob.  Anything that satisfies
    ;; the predicate is left alone; anything that doesn't is removed from the
    ;; given sob and added to the new sob.

    (define (sob-partition! pred sob)
      (let ((result (sob-empty-copy sob)))
        (hash-table-for-each
         (lambda (key value)
           (if (not (pred key))
               (begin
                 (sob-decrement! sob key value)
                 (sob-increment! result key value))))
         (sob-hash-table sob))
        (values (sob-cleanup! sob) result)))

    (define (set-partition! pred set)
      (check-set set)
      (sob-partition! pred set))

    (define (bag-partition! pred bag)
      (check-bag bag)
      (sob-partition! pred bag))


;;; Copying and conversion

;;; Convert a sob to a list; a special case of sob-fold.

    (define (sob->list sob)
      (sob-fold (lambda (elem list) (cons elem list)) '() sob))

    (define (set->list set)
      (check-set set)
      (sob->list set))

    (define (bag->list bag)
      (check-bag bag)
      (sob->list bag))

    ;; Convert a list to a sob.  Probably could be done using unfold, but
    ;; since sobs are mutable anyway, it's just as easy to add the elements
    ;; by side effect.

    (define (list->sob! sob list)
      (for-each (lambda (elem) (sob-increment! sob elem 1)) list)
      sob)

    (define (list->set comparator list)
      (list->sob! (make-sob comparator #f) list))

    (define (list->bag comparator list)
      (list->sob! (make-sob comparator #t) list))

    (define (list->set! set list)
      (check-set set)
      (list->sob! set list))

    (define (list->bag! bag list)
      (check-bag bag)
      (list->sob! bag list))


;;; Subsets

    ;; All of these procedures follow the same pattern.  The
    ;; sob<op>? procedures are case-lambdas that reduce the multi-argument
    ;; case to the two-argument case.  As usual, the set<op>? and
    ;; bag<op>? procedures are trivial layers over the sob<op>? procedure.
    ;; The dyadic-sob<op>? procedures are where it gets interesting, so see
    ;; the comments on them.

    (define sob=?
      (case-lambda
        ((sob) #t)
        ((sob1 sob2) (dyadic-sob=? sob1 sob2))
        ((sob1 sob2 . sobs)
         (and (dyadic-sob=? sob1 sob2)
              (apply sob=? sob2 sobs)))))

    (define (set=? . sets)
      (check-all-sets sets)
      (apply sob=? sets))

    (define (bag=? . bags)
      (check-all-bags bags)
      (apply sob=? bags))

    ;; First we check that there are the same number of entries in the
    ;; hashtables of the two sobs; if that's not true, they can't be equal.
    ;; Then we check that for each key, the values are the same (where
    ;; being absent counts as a value of 0).  If any values aren't equal,
    ;; again they can't be equal.

    (define (dyadic-sob=? sob1 sob2)
      (call/cc
       (lambda (return)
         (let ((ht1 (sob-hash-table sob1))
               (ht2 (sob-hash-table sob2)))
           (if (not (= (hash-table-size ht1) (hash-table-size ht2)))
               (return #f))
           (hash-table-for-each
            (lambda (key value)
              (if (not (= value (hash-table-ref/default ht2 key 0)))
                  (return #f)))
            ht1))
         #t)))

    (define sob<=?
      (case-lambda
        ((sob) #t)
        ((sob1 sob2) (dyadic-sob<=? sob1 sob2))
        ((sob1 sob2 . sobs)
         (and (dyadic-sob<=? sob1 sob2)
              (apply sob<=? sob2 sobs)))))

    (define (set<=? . sets)
      (check-all-sets sets)
      (apply sob<=? sets))

    (define (bag<=? . bags)
      (check-all-bags bags)
      (apply sob<=? bags))

    ;; This is analogous to dyadic-sob=?, except that we have to check
    ;; both sobs to make sure each value is <= in order to be sure
    ;; that we've traversed all the elements in either sob.

    (define (dyadic-sob<=? sob1 sob2)
      (call/cc
       (lambda (return)
         (let ((ht1 (sob-hash-table sob1))
               (ht2 (sob-hash-table sob2)))
           (if (not (<= (hash-table-size ht1) (hash-table-size ht2)))
               (return #f))
           (hash-table-for-each
            (lambda (key value)
              (if (not (<= value (hash-table-ref/default ht2 key 0)))
                  (return #f)))
            ht1))
         #t)))

    (define sob<?
      (case-lambda
        ((sob) #t)
        ((sob1 sob2) (dyadic-sob<? sob1 sob2))
        ((sob1 sob2 . sobs)
         (and (dyadic-sob<? sob1 sob2)
              (apply sob<? sob2 sobs)))))

    (define (set<? . sets)
      (check-all-sets sets)
      (apply sob<? sets))

    (define (bag<? . bags)
      (check-all-bags bags)
      (apply sob<? bags))

    ;; Strict subset test is a bit more involved.  At least one entry in ht1
    ;; needs to have smaller value than the entry in ht2.
    (define (dyadic-sob<? sob1 sob2)
      (call/cc
       (lambda (return)
         (let ((ht1 (sob-hash-table sob1))
               (ht2 (sob-hash-table sob2)))
           (let ((smaller-count
                  (cond
                   ((< (hash-table-size ht1) (hash-table-size ht2)) 1)
                   ((= (hash-table-size ht1) (hash-table-size ht2)) 0)
                   (else (return #f)))))
             (hash-table-for-each
              (lambda (key value)
                (let ((value2 (hash-table-ref/default ht2 key 0)))
                  (if (not (<= value value2))
                      (return #f)
                      (if (< value value2)
                          (set! smaller-count (+ smaller-count 1))))))
              ht1)
             (positive? smaller-count))))))

    (define sob>?
      (case-lambda
        ((sob) #t)
        ((sob1 sob2) (dyadic-sob>? sob1 sob2))
        ((sob1 sob2 . sobs)
         (and (dyadic-sob>? sob1 sob2)
              (apply sob>? sob2 sobs)))))

    (define (set>? . sets)
      (check-all-sets sets)
      (apply sob>? sets))

    (define (bag>? . bags)
      (check-all-bags bags)
      (apply sob>? bags))

    ;; > is the inverse of <.  Again, this is only true dyadically.

    (define (dyadic-sob>? sob1 sob2)
      (dyadic-sob<? sob2 sob1))

    (define sob>=?
      (case-lambda
        ((sob) #t)
        ((sob1 sob2) (dyadic-sob>=? sob1 sob2))
        ((sob1 sob2 . sobs)
         (and (dyadic-sob>=? sob1 sob2)
              (apply sob>=? sob2 sobs)))))

    (define (set>=? . sets)
      (check-all-sets sets)
      (apply sob>=? sets))

    (define (bag>=? . bags)
      (check-all-bags bags)
      (apply sob>=? bags))

    ;; <= is the inverse of >=.  Again, this is only true dyadically.

    (define (dyadic-sob>=? sob1 sob2)
      (dyadic-sob<=? sob2 sob1))


;;; Set theory operations

    ;; A trivial helper function which upper-bounds n by one if multi? is false.

    (define (max-one n multi?)
      (if multi? n (if (> n 1) 1 n)))

    ;; The logic of union, intersection, difference, and sum is the same: the
    ;; sob-* and sob-*! procedures do the reduction to the dyadic-sob-*!
    ;; procedures.  The difference is that the sob-* procedures allocate
    ;; an empty copy of the first sob to accumulate the results in, whereas
    ;; the sob-*!  procedures work directly in the first sob.

    ;; Note that there is no set-sum, as it is the same as set-union.

    (define (sob-union sob1 . sobs)
      (if (null? sobs)
          sob1
          (let ((result (sob-empty-copy sob1)))
            (dyadic-sob-union! result sob1 (car sobs))
            (for-each
             (lambda (sob) (dyadic-sob-union! result result sob))
             (cdr sobs))
            result)))

    ;; For union, we take the max of the counts of each element found
    ;; in either sob and put that in the result.  On the pass through
    ;; sob2, we know that the intersection is already accounted for,
    ;; so we just copy over things that aren't in sob1.

    (define (dyadic-sob-union! result sob1 sob2)
      (let ((sob1-ht (sob-hash-table sob1))
            (sob2-ht (sob-hash-table sob2))
            (result-ht (sob-hash-table result)))
        (hash-table-for-each
         (lambda (key value1)
           (let ((value2 (hash-table-ref/default sob2-ht key 0)))
             (hash-table-set! result-ht key (max value1 value2))))
         sob1-ht)
        (hash-table-for-each
         (lambda (key value2)
           (let ((value1 (hash-table-ref/default sob1-ht key 0)))
             (if (= value1 0)
                 (hash-table-set! result-ht key value2))))
         sob2-ht)))

    (define (set-union . sets)
      (check-all-sets sets)
      (apply sob-union sets))

    (define (bag-union . bags)
      (check-all-bags bags)
      (apply sob-union bags))

    (define (sob-union! sob1 . sobs)
      (for-each
       (lambda (sob) (dyadic-sob-union! sob1 sob1 sob))
       sobs)
      sob1)

    (define (set-union! . sets)
      (check-all-sets sets)
      (apply sob-union! sets))

    (define (bag-union! . bags)
      (check-all-bags bags)
      (apply sob-union! bags))

    (define (sob-intersection sob1 . sobs)
      (if (null? sobs)
          sob1
          (let ((result (sob-empty-copy sob1)))
            (dyadic-sob-intersection! result sob1 (car sobs))
            (for-each
             (lambda (sob) (dyadic-sob-intersection! result result sob))
             (cdr sobs))
            (sob-cleanup! result))))

    ;; For intersection, we compute the min of the counts of each element.
    ;; We only have to scan sob1.  We clean up the result when we are
    ;; done, in case it is the same as sob1.

    (define (dyadic-sob-intersection! result sob1 sob2)
      (let ((sob1-ht (sob-hash-table sob1))
            (sob2-ht (sob-hash-table sob2))
            (result-ht (sob-hash-table result)))
        (hash-table-for-each
         (lambda (key value1)
           (let ((value2 (hash-table-ref/default sob2-ht key 0)))
             (hash-table-set! result-ht key (min value1 value2))))
         sob1-ht)))

    (define (set-intersection . sets)
      (check-all-sets sets)
      (apply sob-intersection sets))

    (define (bag-intersection . bags)
      (check-all-bags bags)
      (apply sob-intersection bags))

    (define (sob-intersection! sob1 . sobs)
      (for-each
       (lambda (sob) (dyadic-sob-intersection! sob1 sob1 sob))
       sobs)
      (sob-cleanup! sob1))

    (define (set-intersection! . sets)
      (check-all-sets sets)
      (apply sob-intersection! sets))

    (define (bag-intersection! . bags)
      (check-all-bags bags)
      (apply sob-intersection! bags))

    (define (sob-difference sob1 . sobs)
      (if (null? sobs)
          sob1
          (let ((result (sob-empty-copy sob1)))
            (dyadic-sob-difference! result sob1 (car sobs))
            (for-each
             (lambda (sob) (dyadic-sob-difference! result result sob))
             (cdr sobs))
            (sob-cleanup! result))))

    ;; For difference, we use (big surprise) the numeric difference, bounded
    ;; by zero.  We only need to scan sob1, but we clean up the result in
    ;; case it is the same as sob1.

    (define (dyadic-sob-difference! result sob1 sob2)
      (let ((sob1-ht (sob-hash-table sob1))
            (sob2-ht (sob-hash-table sob2))
            (result-ht (sob-hash-table result)))
        (hash-table-for-each
         (lambda (key value1)
           (let ((value2 (hash-table-ref/default sob2-ht key 0)))
             (hash-table-set! result-ht key (- value1 value2))))
         sob1-ht)))

    (define (set-difference . sets)
      (check-all-sets sets)
      (apply sob-difference sets))

    (define (bag-difference . bags)
      (check-all-bags bags)
      (apply sob-difference bags))

    (define (sob-difference! sob1 . sobs)
      (for-each
       (lambda (sob) (dyadic-sob-difference! sob1 sob1 sob))
       sobs)
      (sob-cleanup! sob1))

    (define (set-difference! . sets)
      (check-all-sets sets)
      (apply sob-difference! sets))

    (define (bag-difference! . bags)
      (check-all-bags bags)
      (apply sob-difference! bags))

    (define (sob-sum sob1 . sobs)
      (if (null? sobs)
          sob1
          (let ((result (sob-empty-copy sob1)))
            (dyadic-sob-sum! result sob1 (car sobs))
            (for-each
             (lambda (sob) (dyadic-sob-sum! result result sob))
             (cdr sobs))
            result)))

    ;; Sum is just like union, except that we take the sum rather than the max.

    (define (dyadic-sob-sum! result sob1 sob2)
      (let ((sob1-ht (sob-hash-table sob1))
            (sob2-ht (sob-hash-table sob2))
            (result-ht (sob-hash-table result)))
        (hash-table-for-each
         (lambda (key value1)
           (let ((value2 (hash-table-ref/default sob2-ht key 0)))
             (hash-table-set! result-ht key (+ value1 value2))))
         sob1-ht)
        (hash-table-for-each
         (lambda (key value2)
           (let ((value1 (hash-table-ref/default sob1-ht key 0)))
             (if (= value1 0)
                 (hash-table-set! result-ht key value2))))
         sob2-ht)))


    ;; Sum is defined for bags only; for sets, it is the same as union.

    (define (bag-sum . bags)
      (check-all-bags bags)
      (apply sob-sum bags))

    (define (sob-sum! sob1 . sobs)
      (for-each
       (lambda (sob) (dyadic-sob-sum! sob1 sob1 sob))
       sobs)
      sob1)

    (define (bag-sum! . bags)
      (check-all-bags bags)
      (apply sob-sum! bags))

    ;; For xor exactly two arguments are required, so the above structures are
    ;; not necessary.  This version accepts a result sob and computes the
    ;; absolute difference between the counts in the first sob and the
    ;; corresponding counts in the second.

    ;; We start by copying the entries in the second sob but not the first
    ;; into the first.  Then we scan the first sob, computing the absolute
    ;; difference of the values and writing them back into the first sob.
    ;; It's essential to scan the second sob first, as we are not going to
    ;; damage it in the process.  (Hat tip: Sam Tobin-Hochstadt.)

    (define (sob-xor! result sob1 sob2)
      (let ((sob1-ht (sob-hash-table sob1))
            (sob2-ht (sob-hash-table sob2))
            (result-ht (sob-hash-table result)))
        (hash-table-for-each
         (lambda (key value2)
           (let ((value1 (hash-table-ref/default sob1-ht key 0)))
             (if (= value1 0)
                 (hash-table-set! result-ht key value2))))
         sob2-ht)
        (hash-table-for-each
         (lambda (key value1)
           (let ((value2 (hash-table-ref/default sob2-ht key 0)))
             (hash-table-set! result-ht key (abs (- value1 value2)))))
         sob1-ht)
        (sob-cleanup! result)))

    (define (set-xor set1 set2)
      (check-set set1)
      (check-set set2)
      (check-same-comparator set1 set2)
      (sob-xor! (sob-empty-copy set1) set1 set2))

    (define (bag-xor bag1 bag2)
      (check-bag bag1)
      (check-bag bag2)
      (check-same-comparator bag1 bag2)
      (sob-xor! (sob-empty-copy bag1) bag1 bag2))

    (define (set-xor! set1 set2)
      (check-set set1)
      (check-set set2)
      (check-same-comparator set1 set2)
      (sob-xor! set1 set1 set2))

    (define (bag-xor! bag1 bag2)
      (check-bag bag1)
      (check-bag bag2)
      (check-same-comparator bag1 bag2)
      (sob-xor! bag1 bag1 bag2))


;;; A few bag-specific procedures

    (define (sob-product! n result sob)
      (let ((rht (sob-hash-table result)))
        (hash-table-for-each
         (lambda (elem count) (hash-table-set! rht elem (* count n)))
         (sob-hash-table sob))
        result))

    (define (valid-n n)
      (and (integer? n) (exact? n) (positive? n)))

    (define (bag-product n bag)
      (check-bag bag)
      (valid-n n)
      (sob-product! n (sob-empty-copy bag) bag))

    (define (bag-product! n bag)
      (check-bag bag)
      (valid-n n)
      (sob-product! n bag bag))

    (define (bag-unique-size bag)
      (check-bag bag)
      (hash-table-size (sob-hash-table bag)))

    (define (bag-element-count bag elem)
      (check-bag bag)
      (hash-table-ref/default (sob-hash-table bag) elem 0))

    (define (bag-for-each-unique proc bag)
      (check-bag bag)
      (hash-table-for-each
       (lambda (key value) (proc key value))
       (sob-hash-table bag)))

    (define (bag-fold-unique proc nil bag)
      (check-bag bag)
      (let ((result nil))
        (hash-table-for-each
         (lambda (elem count) (set! result (proc elem count result)))
         (sob-hash-table bag))
        result))

    (define (bag->set bag)
      (check-bag bag)
      (let ((result (make-sob (sob-comparator bag) #f)))
        (hash-table-for-each
         (lambda (key value) (sob-increment! result key value))
         (sob-hash-table bag))
        result))

    (define (set->bag set)
      (check-set set)
      (let ((result (make-sob (sob-comparator set) #t)))
        (hash-table-for-each
         (lambda (key value) (sob-increment! result key value))
         (sob-hash-table set))
        result))

    (define (set->bag! bag set)
      (check-bag bag)
      (check-set set)
      (check-same-comparator set bag)
      (hash-table-for-each
       (lambda (key value) (sob-increment! bag key value))
       (sob-hash-table set))
      bag)

    (define (bag->alist bag)
      (check-bag bag)
      (bag-fold-unique
       (lambda (elem count list) (cons (cons elem count) list))
       '()
       bag))

    (define (alist->bag comparator alist)
      (let* ((result (bag comparator))
             (ht (sob-hash-table result)))
        (for-each
         (lambda (assoc)
           (let ((element (car assoc)))
             (if (not (hash-table-contains? ht element))
                 (sob-increment! result element (cdr assoc)))))
         alist)
        result))

;;; Comparators

    ;; Hash over sobs
    (define (sob-hash sob)
      (let* ((ht (sob-hash-table sob))
             (hash (comparator-hash-function (sob-comparator sob))))
        (sob-fold
         (lambda (element result) (+ (hash element) result))
         5381
         sob)))

    ;; Set and bag comparator

    (define set-comparator (make-comparator set? set=? #f sob-hash))

    (define bag-comparator (make-comparator bag? bag=? #f sob-hash))


;;; Set/bag printer (for debugging)

    (define (sob-print sob port)
      (display (if (sob-multi? sob) "&bag[" "&set[") port)
      (sob-for-each
       (lambda (elem) (display " " port) (write elem port))
       sob)
      (display " ]" port))

    ;;; Register above comparators for use by default-comparator
    (comparator-register-default! set-comparator)
    (comparator-register-default! bag-comparator)

    ))
