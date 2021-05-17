;;;;;; SRFI 43: Vector library                           -*- Scheme -*-
;;;
;;; $Id: vector-lib.scm,v 1.7 2009/03/29 09:46:03 sperber Exp $
;;;
;;; Taylor Campbell wrote this code; he places it in the public domain.
;;; Will Clinger [wdc] made some corrections, also in the public domain.

;;; --------------------
;;; Exported procedure index
;;;
;;; * Constructors
;;; make-vector vector
;;; vector-unfold                   vector-unfold-right
;;; vector-copy                     vector-reverse-copy
;;; vector-append                   vector-concatenate
;;;
;;; * Predicates
;;; vector?
;;; vector-empty?
;;; vector=
;;;
;;; * Selectors
;;; vector-ref
;;; vector-length
;;;
;;; * Iteration
;;; vector-fold                     vector-fold-right
;;; vector-map                      vector-map!
;;; vector-for-each
;;; vector-count
;;;
;;; * Searching
;;; vector-index                    vector-skip
;;; vector-index-right              vector-skip-right
;;; vector-binary-search
;;; vector-any                      vector-every
;;;
;;; * Mutators
;;; vector-set!
;;; vector-swap!
;;; vector-fill!
;;; vector-reverse!
;;; vector-copy!                    vector-reverse-copy!
;;; vector-reverse!
;;;
;;; * Conversion
;;; vector->list                    reverse-vector->list
;;; list->vector                    reverse-list->vector



;;; --------------------
;;; Commentary on efficiency of the code

;;; This code is somewhat tuned for efficiency.  There are several
;;; internal routines that can be optimized greatly to greatly improve
;;; the performance of much of the library.  These internal procedures
;;; are already carefully tuned for performance, and lambda-lifted by
;;; hand.  Some other routines are lambda-lifted by hand, but only the
;;; loops are lambda-lifted, and only if some routine has two possible
;;; loops -- a fast path and an n-ary case --, whereas _all_ of the
;;; internal routines' loops are lambda-lifted so as to never cons a
;;; closure in their body (VECTOR-PARSE-START+END doesn't have a loop),
;;; even in Scheme systems that perform no loop optimization (which is
;;; most of them, unfortunately).
;;;
;;; Fast paths are provided for common cases in most of the loops in
;;; this library.
;;;
;;; All calls to primitive vector operations are protected by a prior
;;; type check; they can be safely converted to use unsafe equivalents
;;; of the operations, if available.  Ideally, the compiler should be
;;; able to determine this, but the state of Scheme compilers today is
;;; not a happy one.
;;;
;;; Efficiency of the actual algorithms is a rather mundane point to
;;; mention; vector operations are rarely beyond being straightforward.



;;; --------------------
;;; Utilities

;;; SRFI 8, too trivial to put in the dependencies list.
(define-syntax receive
  (syntax-rules ()
    ((receive ?formals ?producer ?body1 ?body2 ...)
     (call-with-values (lambda () ?producer)
       (lambda ?formals ?body1 ?body2 ...)))))

;;; Not the best LET*-OPTIONALS, but not the worst, either.  Use Olin's
;;; if it's available to you.
(define-syntax let*-optionals
  (syntax-rules ()
    ((let*-optionals (?x ...) ((?var ?default) ...) ?body1 ?body2 ...)
     (let ((args (?x ...)))
       (let*-optionals args ((?var ?default) ...) ?body1 ?body2 ...)))
    ((let*-optionals ?args ((?var ?default) ...) ?body1 ?body2 ...)
     (let*-optionals:aux ?args ?args ((?var ?default) ...)
       ?body1 ?body2 ...))))

(define-syntax let*-optionals:aux
  (syntax-rules ()
    ((aux ?orig-args-var ?args-var () ?body1 ?body2 ...)
     (if (null? ?args-var)
         (let () ?body1 ?body2 ...)
         (error "too many arguments" (length ?orig-args-var)
                ?orig-args-var)))
    ((aux ?orig-args-var ?args-var
         ((?var ?default) ?more ...)
       ?body1 ?body2 ...)
     (if (null? ?args-var)
         (let* ((?var ?default) ?more ...) ?body1 ?body2 ...)
         (let ((?var (car ?args-var))
               (new-args (cdr ?args-var)))
           (let*-optionals:aux ?orig-args-var new-args
               (?more ...)
             ?body1 ?body2 ...))))))

(define (nonneg-int? x)
  (and (integer? x)
       (not (negative? x))))

(define (between? x y z)
  (and (<  x y)
       (<= y z)))

(define (unspecified-value) (if #f #f))

;++ This should be implemented more efficiently.  It shouldn't cons a
;++ closure, and the cons cells used in the loops when using this could
;++ be reused.
(define (vectors-ref vectors i)
  (map (lambda (v) (vector-ref v i)) vectors))



;;; --------------------
;;; Error checking

;;; Error signalling (not checking) is done in a way that tries to be
;;; as helpful to the person who gets the debugging prompt as possible.
;;; That said, error _checking_ tries to be as unredundant as possible.

;;; I don't use any sort of general condition mechanism; I use simply
;;; SRFI 23's ERROR, even in cases where it might be better to use such
;;; a general condition mechanism.  Fix that when porting this to a
;;; Scheme implementation that has its own condition system.

;;; In argument checks, upon receiving an invalid argument, the checker
;;; procedure recursively calls itself, but in one of the arguments to
;;; itself is a call to ERROR; this mechanism is used in the hopes that
;;; the user may be thrown into a debugger prompt, proceed with another
;;; value, and let it be checked again.

;;; Type checking is pretty basic, but easily factored out and replaced
;;; with whatever your implementation's preferred type checking method
;;; is.  I doubt there will be many other methods of index checking,
;;; though the index checkers might be better implemented natively.

;;; (CHECK-TYPE <type-predicate?> <value> <callee>) -> value
;;;   Ensure that VALUE satisfies TYPE-PREDICATE?; if not, signal an
;;;   error stating that VALUE did not satisfy TYPE-PREDICATE?, showing
;;;   that this happened while calling CALLEE.  Return VALUE if no
;;;   error was signalled.
(define (check-type pred? value callee)
  (if (pred? value)
      value
      ;; Recur: when (or if) the user gets a debugger prompt, he can
      ;; proceed where the call to ERROR was with the correct value.
      (check-type pred?
                  (error "erroneous value"
                         (list pred? value)
                         `(while calling ,callee))
                  callee)))

;;; (CHECK-INDEX <vector> <index> <callee>) -> index
;;;   Ensure that INDEX is a valid index into VECTOR; if not, signal an
;;;   error stating that it is not and that this happened in a call to
;;;   CALLEE.  Return INDEX when it is valid.  (Note that this does NOT
;;;   check that VECTOR is indeed a vector.)
(define (check-index vec index callee)
  (let ((index (check-type integer? index callee)))
    (cond ((< index 0)
           (check-index vec
                        (error "vector index too low"
                               index
                               `(into vector ,vec)
                               `(while calling ,callee))
                        callee))
          ((>= index (vector-length vec))
           (check-index vec
                        (error "vector index too high"
                               index
                               `(into vector ,vec)
                               `(while calling ,callee))
                        callee))
          (else index))))

;;; (CHECK-INDICES <vector>
;;;                <start> <start-name>
;;;                <end> <end-name>
;;;                <caller>) -> [start end]
;;;   Ensure that START and END are valid bounds of a range within
;;;   VECTOR; if not, signal an error stating that they are not, with
;;;   the message being informative about what the argument names were
;;;   called -- by using START-NAME & END-NAME --, and that it occurred
;;;   while calling CALLEE.  Also ensure that VEC is in fact a vector.
;;;   Returns no useful value.
(define (check-indices vec start start-name end end-name callee)
  (let ((lose (lambda things
                (apply error "vector range out of bounds"
                       (append things
                               `(vector was ,vec)
                               `(,start-name was ,start)
                               `(,end-name was ,end)
                               `(while calling ,callee)))))
        (start (check-type integer? start callee))
        (end   (check-type integer? end   callee)))
    (cond ((> start end)
           ;; I'm not sure how well this will work.  The intent is that
           ;; the programmer tells the debugger to proceed with both a
           ;; new START & a new END by returning multiple values
           ;; somewhere.
           (receive (new-start new-end)
                    (lose `(,end-name < ,start-name))
             (check-indices vec
                            new-start start-name
                            new-end end-name
                            callee)))
          ((< start 0)
           (check-indices vec
                          (lose `(,start-name < 0))
                          start-name
                          end end-name
                          callee))
          ((>= start (vector-length vec))
           (check-indices vec
                          (lose `(,start-name > len)
                                `(len was ,(vector-length vec)))
                          start-name
                          end end-name
                          callee))
          ((> end (vector-length vec))
           (check-indices vec
                          start start-name
                          (lose `(,end-name > len)
                                `(len was ,(vector-length vec)))
                          end-name
                          callee))
          (else
           (values start end)))))



;;; --------------------
;;; Internal routines

;;; These should all be integrated, native, or otherwise optimized --
;;; they're used a _lot_ --.  All of the loops and LETs inside loops
;;; are lambda-lifted by hand, just so as not to cons closures in the
;;; loops.  (If your compiler can do better than that if they're not
;;; lambda-lifted, then lambda-drop (?) them.)

;;; (VECTOR-PARSE-START+END <vector> <arguments>
;;;                         <start-name> <end-name>
;;;                         <callee>)
;;;       -> [start end]
;;;   Return two values, composing a valid range within VECTOR, as
;;;   extracted from ARGUMENTS or defaulted from VECTOR -- 0 for START
;;;   and the length of VECTOR for END --; START-NAME and END-NAME are
;;;   purely for error checking.
(define (vector-parse-start+end vec args start-name end-name callee)
  (let ((len (vector-length vec)))
    (cond ((null? args)
           (values 0 len))
          ((null? (cdr args))
           (check-indices vec
                          (car args) start-name
                          len end-name
                          callee))
          ((null? (cddr args))
           (check-indices vec
                          (car  args) start-name
                          (cadr args) end-name
                          callee))
          (else
           (error "too many arguments"
                  `(extra args were ,(cddr args))
                  `(while calling ,callee))))))

(define-syntax let-vector-start+end
  (syntax-rules ()
    ((let-vector-start+end ?callee ?vec ?args (?start ?end)
       ?body1 ?body2 ...)
     (let ((?vec (check-type vector? ?vec ?callee)))
       (receive (?start ?end)
                (vector-parse-start+end ?vec ?args '?start '?end
                                        ?callee)
         ?body1 ?body2 ...)))))

;;; (%SMALLEST-LENGTH <vector-list> <default-length> <callee>)
;;;       -> exact, nonnegative integer
;;;   Compute the smallest length of VECTOR-LIST.  DEFAULT-LENGTH is
;;;   the length that is returned if VECTOR-LIST is empty.  Common use
;;;   of this is in n-ary vector routines:
;;;     (define (f vec . vectors)
;;;       (let ((vec (check-type vector? vec f)))
;;;         ...(%smallest-length vectors (vector-length vec) f)...))
;;;   %SMALLEST-LENGTH takes care of the type checking -- which is what
;;;   the CALLEE argument is for --; thus, the design is tuned for
;;;   avoiding redundant type checks.
(define %smallest-length
  (letrec ((loop (lambda (vector-list length callee)
                   (if (null? vector-list)
                       length
                       (loop (cdr vector-list)
                             (min (vector-length
                                   (check-type vector?
                                               (car vector-list)
                                               callee))
                                  length)
                             callee)))))
    loop))

;;; (%VECTOR-COPY! <target> <tstart> <source> <sstart> <send>)
;;;   Copy elements at locations SSTART to SEND from SOURCE to TARGET,
;;;   starting at TSTART in TARGET.
;;;
;;; Optimize this!  Probably with some combination of:
;;;   - Force it to be integrated.
;;;   - Let it use unsafe vector element dereferencing routines: bounds
;;;     checking already happens outside of it.  (Or use a compiler
;;;     that figures this out, but Olin Shivers' PhD thesis seems to
;;;     have been largely ignored in actual implementations...)
;;;   - Implement it natively as a VM primitive: the VM can undoubtedly
;;;     perform much faster than it can make Scheme perform, even with
;;;     bounds checking.
;;;   - Implement it in assembly: you _want_ the fine control that
;;;     assembly can give you for this.
;;; I already lambda-lift it by hand, but you should be able to make it
;;; even better than that.
(define %vector-copy!
  (letrec ((loop/l->r (lambda (target source send i j)
                        (cond ((< i send)
                               (vector-set! target j
                                            (vector-ref source i))
                               (loop/l->r target source send
                                          (+ i 1) (+ j 1))))))
           (loop/r->l (lambda (target source sstart i j)
                        (cond ((>= i sstart)
                               (vector-set! target j
                                            (vector-ref source i))
                               (loop/r->l target source sstart
                                          (- i 1) (- j 1)))))))
    (lambda (target tstart source sstart send)
      (if (> sstart tstart)             ; Make sure we don't copy over
                                        ;   ourselves.
          (loop/l->r target source send sstart tstart)
          (loop/r->l target source sstart (- send 1)
                     (+ -1 tstart send (- sstart)))))))

;;; (%VECTOR-REVERSE-COPY! <target> <tstart> <source> <sstart> <send>)
;;;   Copy elements from SSTART to SEND from SOURCE to TARGET, in the
;;;   reverse order.
(define %vector-reverse-copy!
  (letrec ((loop (lambda (target source sstart i j)
                   (cond ((>= i sstart)
                          (vector-set! target j (vector-ref source i))
                          (loop target source sstart
                                (- i 1)
                                (+ j 1)))))))
    (lambda (target tstart source sstart send)
      (loop target source sstart
            (- send 1)
            tstart))))

;;; (%VECTOR-REVERSE! <vector>)
(define %vector-reverse!
  (letrec ((loop (lambda (vec i j)
                   (cond ((<= i j)
                          (let ((v (vector-ref vec i)))
                            (vector-set! vec i (vector-ref vec j))
                            (vector-set! vec j v)
                            (loop vec (+ i 1) (- j 1))))))))
    (lambda (vec start end)
      (loop vec start (- end 1)))))

;;; (%VECTOR-FOLD1 <kons> <knil> <vector>) -> knil'
;;;     (KONS <index> <knil> <elt>) -> knil'
(define %vector-fold1
  (letrec ((loop (lambda (kons knil len vec i)
                   (if (= i len)
                       knil
                       (loop kons
                             (kons i knil (vector-ref vec i))
                             len vec (+ i 1))))))
    (lambda (kons knil len vec)
      (loop kons knil len vec 0))))

;;; (%VECTOR-FOLD2+ <kons> <knil> <vector> ...) -> knil'
;;;     (KONS <index> <knil> <elt> ...) -> knil'
(define %vector-fold2+
  (letrec ((loop (lambda (kons knil len vectors i)
                   (if (= i len)
                       knil
                       (loop kons
                             (apply kons i knil
                                    (vectors-ref vectors i))
                             len vectors (+ i 1))))))
    (lambda (kons knil len vectors)
      (loop kons knil len vectors 0))))

;;; (%VECTOR-MAP! <f> <target> <length> <vector>) -> target
;;;     (F <index> <elt>) -> elt'
(define %vector-map1!
  (letrec ((loop (lambda (f target vec i)
                   (if (zero? i)
                       target
                       (let ((j (- i 1)))
                         (vector-set! target j
                                      (f j (vector-ref vec j)))
                         (loop f target vec j))))))
    (lambda (f target vec len)
      (loop f target vec len))))

;;; (%VECTOR-MAP2+! <f> <target> <vectors> <len>) -> target
;;;     (F <index> <elt> ...) -> elt'
(define %vector-map2+!
  (letrec ((loop (lambda (f target vectors i)
                   (if (zero? i)
                       target
                       (let ((j (- i 1)))
                         (vector-set! target j
                           (apply f j (vectors-ref vectors j)))
                         (loop f target vectors j))))))
    (lambda (f target vectors len)
      (loop f target vectors len))))



;;;;;;;;;;;;;;;;;;;;;;;; ***** vector-lib ***** ;;;;;;;;;;;;;;;;;;;;;;;

;;; --------------------
;;; Constructors

;;; (MAKE-VECTOR <size> [<fill>]) -> vector
;;;   [R5RS] Create a vector of length LENGTH.  If FILL is present,
;;;   initialize each slot in the vector with it; if not, the vector's
;;;   initial contents are unspecified.
(define make-vector make-vector)

;;; (VECTOR <elt> ...) -> vector
;;;   [R5RS] Create a vector containing ELEMENT ..., in order.
(define vector vector)

;;; This ought to be able to be implemented much more efficiently -- if
;;; we have the number of arguments available to us, we can create the
;;; vector without using LENGTH to determine the number of elements it
;;; should have.
;(define (vector . elements) (list->vector elements))

;;; (VECTOR-UNFOLD <f> <length> <initial-seed> ...) -> vector
;;;     (F <index> <seed> ...) -> [elt seed' ...]
;;;   The fundamental vector constructor.  Creates a vector whose
;;;   length is LENGTH and iterates across each index K between 0 and
;;;   LENGTH, applying F at each iteration to the current index and the
;;;   current seeds to receive N+1 values: first, the element to put in
;;;   the Kth slot and then N new seeds for the next iteration.
(define vector-unfold
  (letrec ((tabulate!                   ; Special zero-seed case.
            (lambda (f vec i len)
              (cond ((< i len)
                     (vector-set! vec i (f i))
                     (tabulate! f vec (+ i 1) len)))))
           (unfold1!                    ; Fast path for one seed.
            (lambda (f vec i len seed)
              (if (< i len)
                  (receive (elt new-seed)
                           (f i seed)
                    (vector-set! vec i elt)
                    (unfold1! f vec (+ i 1) len new-seed)))))
           (unfold2+!                   ; Slower variant for N seeds.
            (lambda (f vec i len seeds)
              (if (< i len)
                  (receive (elt . new-seeds)
                           (apply f i seeds)
                    (vector-set! vec i elt)
                    (unfold2+! f vec (+ i 1) len new-seeds))))))
    (lambda (f len . initial-seeds)
      (let ((f   (check-type procedure?  f   vector-unfold))
            (len (check-type nonneg-int? len vector-unfold)))
        (let ((vec (make-vector len)))
          (cond ((null? initial-seeds)
                 (tabulate! f vec 0 len))
                ((null? (cdr initial-seeds))
                 (unfold1! f vec 0 len (car initial-seeds)))
                (else
                 (unfold2+! f vec 0 len initial-seeds)))
          vec)))))

;;; (VECTOR-UNFOLD-RIGHT <f> <length> <initial-seed> ...) -> vector
;;;     (F <seed> ...) -> [seed' ...]
;;;   Like VECTOR-UNFOLD, but it generates elements from LENGTH to 0
;;;   (still exclusive with  LENGTH and inclusive with 0), not 0 to
;;;   LENGTH as with VECTOR-UNFOLD.
(define vector-unfold-right
  (letrec ((tabulate!
            (lambda (f vec i)
              (cond ((>= i 0)
                     (vector-set! vec i (f i))
                     (tabulate! f vec (- i 1))))))
           (unfold1!
            (lambda (f vec i seed)
              (if (>= i 0)
                  (receive (elt new-seed)
                           (f i seed)
                    (vector-set! vec i elt)
                    (unfold1! f vec (- i 1) new-seed)))))
           (unfold2+!
            (lambda (f vec i seeds)
              (if (>= i 0)
                  (receive (elt . new-seeds)
                           (apply f i seeds)
                    (vector-set! vec i elt)
                    (unfold2+! f vec (- i 1) new-seeds))))))
    (lambda (f len . initial-seeds)
      (let ((f   (check-type procedure?  f   vector-unfold-right))
            (len (check-type nonneg-int? len vector-unfold-right)))
        (let ((vec (make-vector len))
              (i (- len 1)))
          (cond ((null? initial-seeds)
                 (tabulate! f vec i))
                ((null? (cdr initial-seeds))
                 (unfold1!  f vec i (car initial-seeds)))
                (else
                 (unfold2+! f vec i initial-seeds)))
          vec)))))

;;; (VECTOR-COPY <vector> [<start> <end> <fill>]) -> vector
;;;   Create a newly allocated vector containing the elements from the
;;;   range [START,END) in VECTOR.  START defaults to 0; END defaults
;;;   to the length of VECTOR.  END may be greater than the length of
;;;   VECTOR, in which case the vector is enlarged; if FILL is passed,
;;;   the new locations from which there is no respective element in
;;;   VECTOR are filled with FILL.
(define (vector-copy vec . args)
  (let ((vec (check-type vector? vec vector-copy)))
    ;; We can't use LET-VECTOR-START+END, because we have one more
    ;; argument, and we want finer control, too.
    ;;
    ;; Olin's implementation of LET*-OPTIONALS would prove useful here:
    ;; the built-in argument-checks-as-you-go-along produces almost
    ;; _exactly_ the same code as VECTOR-COPY:PARSE-ARGS.
    (receive (start end fill)
             (vector-copy:parse-args vec args)
      (let ((new-vector (make-vector (- end start) fill)))
        (%vector-copy! new-vector 0
                       vec        start
                       (if (> end (vector-length vec))
                           (vector-length vec)
                           end))
        new-vector))))

;;; Auxiliary for VECTOR-COPY.
;;; [wdc] Corrected to allow 0 <= start <= (vector-length vec).
(define (vector-copy:parse-args vec args)
  (define (parse-args start end n fill)
    (let ((start (check-type nonneg-int? start vector-copy))
          (end   (check-type nonneg-int? end vector-copy)))
      (cond ((and (<= 0 start end)
                  (<= start n))
             (values start end fill))
            (else
             (error "illegal arguments"
                    `(while calling ,vector-copy)
                    `(start was ,start)
                    `(end was ,end)
                    `(vector was ,vec))))))
  (let ((n (vector-length vec)))
    (cond ((null? args)
           (parse-args 0 n n (unspecified-value)))
          ((null? (cdr args))
           (parse-args (car args) n n (unspecified-value)))
          ((null? (cddr args))
           (parse-args (car args) (cadr args) n (unspecified-value)))
          ((null? (cdddr args))
           (parse-args (car args) (cadr args) n (caddr args)))
          (else
           (error "too many arguments"
                  vector-copy
                  (cdddr args))))))

;;; (VECTOR-REVERSE-COPY <vector> [<start> <end>]) -> vector
;;;   Create a newly allocated vector whose elements are the reversed
;;;   sequence of elements between START and END in VECTOR.  START's
;;;   default is 0; END's default is the length of VECTOR.
(define (vector-reverse-copy vec . maybe-start+end)
  (let-vector-start+end vector-reverse-copy vec maybe-start+end
                        (start end)
    (let ((new (make-vector (- end start))))
      (%vector-reverse-copy! new 0 vec start end)
      new)))

;;; (VECTOR-APPEND <vector> ...) -> vector
;;;   Append VECTOR ... into a newly allocated vector and return that
;;;   new vector.
(define (vector-append . vectors)
  (vector-concatenate:aux vectors vector-append))

;;; (VECTOR-CONCATENATE <vector-list>) -> vector
;;;   Concatenate the vectors in VECTOR-LIST.  This is equivalent to
;;;     (apply vector-append VECTOR-LIST)
;;;   but VECTOR-APPEND tends to be implemented in terms of
;;;   VECTOR-CONCATENATE, and some Schemes bork when the list to apply
;;;   a function to is too long.
;;;
;;; Actually, they're both implemented in terms of an internal routine.
(define (vector-concatenate vector-list)
  (vector-concatenate:aux vector-list vector-concatenate))

;;; Auxiliary for VECTOR-APPEND and VECTOR-CONCATENATE
(define vector-concatenate:aux
  (letrec ((compute-length
            (lambda (vectors len callee)
              (if (null? vectors)
                  len
                  (let ((vec (check-type vector? (car vectors)
                                         callee)))
                    (compute-length (cdr vectors)
                                    (+ (vector-length vec) len)
                                    callee)))))
           (concatenate!
            (lambda (vectors target to)
              (if (null? vectors)
                  target
                  (let* ((vec1 (car vectors))
                         (len (vector-length vec1)))
                    (%vector-copy! target to vec1 0 len)
                    (concatenate! (cdr vectors) target
                                  (+ to len)))))))
    (lambda (vectors callee)
      (cond ((null? vectors)            ;+++
             (make-vector 0))
            ((null? (cdr vectors))      ;+++
             ;; Blech, we still have to allocate a new one.
             (let* ((vec (check-type vector? (car vectors) callee))
                    (len (vector-length vec))
                    (new (make-vector len)))
               (%vector-copy! new 0 vec 0 len)
               new))
            (else
             (let ((new-vector
                    (make-vector (compute-length vectors 0 callee))))
               (concatenate! vectors new-vector 0)
               new-vector))))))



;;; --------------------
;;; Predicates

;;; (VECTOR? <value>) -> boolean
;;;   [R5RS] Return #T if VALUE is a vector and #F if not.
(define vector? vector?)

;;; (VECTOR-EMPTY? <vector>) -> boolean
;;;   Return #T if VECTOR has zero elements in it, i.e. VECTOR's length
;;;   is 0, and #F if not.
(define (vector-empty? vec)
  (let ((vec (check-type vector? vec vector-empty?)))
    (zero? (vector-length vec))))

;;; (VECTOR= <elt=?> <vector> ...) -> boolean
;;;     (ELT=? <value> <value>) -> boolean
;;;   Determine vector equality generalized across element comparators.
;;;   Vectors A and B are equal iff their lengths are the same and for
;;;   each respective elements E_a and E_b (element=? E_a E_b) returns
;;;   a true value.  ELT=? is always applied to two arguments.  Element
;;;   comparison must be consistent wtih EQ?; that is, if (eq? E_a E_b)
;;;   results in a true value, then (ELEMENT=? E_a E_b) must result in a
;;;   true value.  This may be exploited to avoid multiple unnecessary
;;;   element comparisons.  (This implementation does, but does not deal
;;;   with the situation that ELEMENT=? is EQ? to avoid more unnecessary
;;;   comparisons, but I believe this optimization is probably fairly
;;;   insignificant.)
;;;   
;;;   If the number of vector arguments is zero or one, then #T is
;;;   automatically returned.  If there are N vector arguments,
;;;   VECTOR_1 VECTOR_2 ... VECTOR_N, then VECTOR_1 & VECTOR_2 are
;;;   compared; if they are equal, the vectors VECTOR_2 ... VECTOR_N
;;;   are compared.  The precise order in which ELT=? is applied is not
;;;   specified.
(define (vector= elt=? . vectors)
  (let ((elt=? (check-type procedure? elt=? vector=)))
    (cond ((null? vectors)
           #t)
          ((null? (cdr vectors))
           (check-type vector? (car vectors) vector=)
           #t)
          (else
           (let loop ((vecs vectors))
             (let ((vec1 (check-type vector? (car vecs) vector=))
                   (vec2+ (cdr vecs)))
               (or (null? vec2+)
                   (and (binary-vector= elt=? vec1 (car vec2+))
                        (loop vec2+)))))))))
(define (binary-vector= elt=? vector-a vector-b)
  (or (eq? vector-a vector-b)           ;+++
      (let ((length-a (vector-length vector-a))
            (length-b (vector-length vector-b)))
        (letrec ((loop (lambda (i)
                         (or (= i length-a)
                             (and (< i length-b)
                                  (test (vector-ref vector-a i)
                                        (vector-ref vector-b i)
                                        i)))))
                 (test (lambda (elt-a elt-b i)
                         (and (or (eq? elt-a elt-b) ;+++
                                  (elt=? elt-a elt-b))
                              (loop (+ i 1))))))
          (and (= length-a length-b)
               (loop 0))))))



;;; --------------------
;;; Selectors

;;; (VECTOR-REF <vector> <index>) -> value
;;;   [R5RS] Return the value that the location in VECTOR at INDEX is
;;;   mapped to in the store.
(define vector-ref vector-ref)

;;; (VECTOR-LENGTH <vector>) -> exact, nonnegative integer
;;;   [R5RS] Return the length of VECTOR.
(define vector-length vector-length)



;;; --------------------
;;; Iteration

;;; (VECTOR-FOLD <kons> <initial-knil> <vector> ...) -> knil
;;;     (KONS <knil> <elt> ...) -> knil' ; N vectors -> N+1 args
;;;   The fundamental vector iterator.  KONS is iterated over each
;;;   index in all of the vectors in parallel, stopping at the end of
;;;   the shortest; KONS is applied to an argument list of (list I
;;;   STATE (vector-ref VEC I) ...), where STATE is the current state
;;;   value -- the state value begins with KNIL and becomes whatever
;;;   KONS returned at the respective iteration --, and I is the
;;;   current index in the iteration.  The iteration is strictly left-
;;;   to-right.
;;;     (vector-fold KONS KNIL (vector E_1 E_2 ... E_N))
;;;       <=>
;;;     (KONS (... (KONS (KONS KNIL E_1) E_2) ... E_N-1) E_N)
(define (vector-fold kons knil vec . vectors)
  (let ((kons (check-type procedure? kons vector-fold))
        (vec  (check-type vector?    vec  vector-fold)))
    (if (null? vectors)
        (%vector-fold1 kons knil (vector-length vec) vec)
        (%vector-fold2+ kons knil
                        (%smallest-length vectors
                                          (vector-length vec)
                                          vector-fold)
                        (cons vec vectors)))))

;;; (VECTOR-FOLD-RIGHT <kons> <initial-knil> <vector> ...) -> knil
;;;     (KONS <knil> <elt> ...) -> knil' ; N vectors => N+1 args
;;;   The fundamental vector recursor.  Iterates in parallel across
;;;   VECTOR ... right to left, applying KONS to the elements and the
;;;   current state value; the state value becomes what KONS returns
;;;   at each next iteration.  KNIL is the initial state value.
;;;     (vector-fold-right KONS KNIL (vector E_1 E_2 ... E_N))
;;;       <=>
;;;     (KONS (... (KONS (KONS KNIL E_N) E_N-1) ... E_2) E_1)
;;;
;;; Not implemented in terms of a more primitive operations that might
;;; called %VECTOR-FOLD-RIGHT due to the fact that it wouldn't be very
;;; useful elsewhere.
(define vector-fold-right
  (letrec ((loop1 (lambda (kons knil vec i)
                    (if (negative? i)
                        knil
                        (loop1 kons (kons i knil (vector-ref vec i))
                               vec
                               (- i 1)))))
           (loop2+ (lambda (kons knil vectors i)
                     (if (negative? i)
                         knil
                         (loop2+ kons
                                 (apply kons i knil
                                        (vectors-ref vectors i))
                                 vectors
                                 (- i 1))))))
    (lambda (kons knil vec . vectors)
      (let ((kons (check-type procedure? kons vector-fold-right))
            (vec  (check-type vector?    vec  vector-fold-right)))
        (if (null? vectors)
            (loop1  kons knil vec (- (vector-length vec) 1))
            (loop2+ kons knil (cons vec vectors)
                    (- (%smallest-length vectors
                                         (vector-length vec)
                                         vector-fold-right)
                       1)))))))

;;; (VECTOR-MAP <f> <vector> ...) -> vector
;;;     (F <elt> ...) -> value ; N vectors -> N args
;;;   Constructs a new vector of the shortest length of the vector
;;;   arguments.  Each element at index I of the new vector is mapped
;;;   from the old vectors by (F I (vector-ref VECTOR I) ...).  The
;;;   dynamic order of application of F is unspecified.
(define (vector-map f vec . vectors)
  (let ((f   (check-type procedure? f   vector-map))
        (vec (check-type vector?    vec vector-map)))
    (if (null? vectors)
        (let ((len (vector-length vec)))
          (%vector-map1! f (make-vector len) vec len))
        (let ((len (%smallest-length vectors
                                     (vector-length vec)
                                     vector-map)))
          (%vector-map2+! f (make-vector len) (cons vec vectors)
                          len)))))

;;; (VECTOR-MAP! <f> <vector> ...) -> unspecified
;;;     (F <elt> ...) -> element' ; N vectors -> N args
;;;   Similar to VECTOR-MAP, but rather than mapping the new elements
;;;   into a new vector, the new mapped elements are destructively
;;;   inserted into the first vector.  Again, the dynamic order of
;;;   application of F is unspecified, so it is dangerous for F to
;;;   manipulate the first VECTOR.
(define (vector-map! f vec . vectors)
  (let ((f   (check-type procedure? f   vector-map!))
        (vec (check-type vector?    vec vector-map!)))
    (if (null? vectors)
        (%vector-map1!  f vec vec (vector-length vec))
        (%vector-map2+! f vec (cons vec vectors)
                        (%smallest-length vectors
                                          (vector-length vec)
                                          vector-map!)))
    (unspecified-value)))

;;; (VECTOR-FOR-EACH <f> <vector> ...) -> unspecified
;;;     (F <elt> ...) ; N vectors -> N args
;;;   Simple vector iterator: applies F to each index in the range [0,
;;;   LENGTH), where LENGTH is the length of the smallest vector
;;;   argument passed, and the respective element at that index.  In
;;;   contrast with VECTOR-MAP, F is reliably applied to each
;;;   subsequent elements, starting at index 0 from left to right, in
;;;   the vectors.
(define vector-for-each
  (letrec ((for-each1
            (lambda (f vec i len)
              (cond ((< i len)
                     (f i (vector-ref vec i))
                     (for-each1 f vec (+ i 1) len)))))
           (for-each2+
            (lambda (f vecs i len)
              (cond ((< i len)
                     (apply f i (vectors-ref vecs i))
                     (for-each2+ f vecs (+ i 1) len))))))
    (lambda (f vec . vectors)
      (let ((f   (check-type procedure? f   vector-for-each))
            (vec (check-type vector?    vec vector-for-each)))
        (if (null? vectors)
            (for-each1 f vec 0 (vector-length vec))
            (for-each2+ f (cons vec vectors) 0
                        (%smallest-length vectors
                                          (vector-length vec)
                                          vector-for-each)))))))

;;; (VECTOR-COUNT <predicate?> <vector> ...)
;;;       -> exact, nonnegative integer
;;;     (PREDICATE? <index> <value> ...) ; N vectors -> N+1 args
;;;   PREDICATE? is applied element-wise to the elements of VECTOR ...,
;;;   and a count is tallied of the number of elements for which a
;;;   true value is produced by PREDICATE?.  This count is returned.
(define (vector-count pred? vec . vectors)
  (let ((pred? (check-type procedure? pred? vector-count))
        (vec   (check-type vector?    vec   vector-count)))
    (if (null? vectors)
        (%vector-fold1 (lambda (index count elt)
                         (if (pred? index elt)
                             (+ count 1)
                             count))
                       0
                       (vector-length vec)
                       vec)
        (%vector-fold2+ (lambda (index count . elts)
                          (if (apply pred? index elts)
                              (+ count 1)
                              count))
                        0
                        (%smallest-length vectors
                                          (vector-length vec)
                                          vector-count)
                        (cons vec vectors)))))



;;; --------------------
;;; Searching

;;; (VECTOR-INDEX <predicate?> <vector> ...)
;;;       -> exact, nonnegative integer or #F
;;;     (PREDICATE? <elt> ...) -> boolean ; N vectors -> N args
;;;   Search left-to-right across VECTOR ... in parallel, returning the
;;;   index of the first set of values VALUE ... such that (PREDICATE?
;;;   VALUE ...) returns a true value; if no such set of elements is
;;;   reached, return #F.
(define (vector-index pred? vec . vectors)
  (vector-index/skip pred? vec vectors vector-index))

;;; (VECTOR-SKIP <predicate?> <vector> ...)
;;;       -> exact, nonnegative integer or #F
;;;     (PREDICATE? <elt> ...) -> boolean ; N vectors -> N args
;;;   (vector-index (lambda elts (not (apply PREDICATE? elts)))
;;;                 VECTOR ...)
;;;   Like VECTOR-INDEX, but find the index of the first set of values
;;;   that do _not_ satisfy PREDICATE?.
(define (vector-skip pred? vec . vectors)
  (vector-index/skip (lambda elts (not (apply pred? elts)))
                     vec vectors
                     vector-skip))

;;; Auxiliary for VECTOR-INDEX & VECTOR-SKIP
(define vector-index/skip
  (letrec ((loop1  (lambda (pred? vec len i)
                     (cond ((= i len) #f)
                           ((pred? (vector-ref vec i)) i)
                           (else (loop1 pred? vec len (+ i 1))))))
           (loop2+ (lambda (pred? vectors len i)
                     (cond ((= i len) #f)
                           ((apply pred? (vectors-ref vectors i)) i)
                           (else (loop2+ pred? vectors len
                                         (+ i 1)))))))
    (lambda (pred? vec vectors callee)
      (let ((pred? (check-type procedure? pred? callee))
            (vec   (check-type vector?    vec   callee)))
        (if (null? vectors)
            (loop1 pred? vec (vector-length vec) 0)
            (loop2+ pred? (cons vec vectors)
                    (%smallest-length vectors
                                      (vector-length vec)
                                      callee)
                    0))))))

;;; (VECTOR-INDEX-RIGHT <predicate?> <vector> ...)
;;;       -> exact, nonnegative integer or #F
;;;     (PREDICATE? <elt> ...) -> boolean ; N vectors -> N args
;;;   Right-to-left variant of VECTOR-INDEX.
(define (vector-index-right pred? vec . vectors)
  (vector-index/skip-right pred? vec vectors vector-index-right))

;;; (VECTOR-SKIP-RIGHT <predicate?> <vector> ...)
;;;       -> exact, nonnegative integer or #F
;;;     (PREDICATE? <elt> ...) -> boolean ; N vectors -> N args
;;;   Right-to-left variant of VECTOR-SKIP.
(define (vector-skip-right pred? vec . vectors)
  (vector-index/skip-right (lambda elts (not (apply pred? elts)))
                           vec vectors
                           vector-index-right))

(define vector-index/skip-right
  (letrec ((loop1  (lambda (pred? vec i)
                     (cond ((negative? i) #f)
                           ((pred? (vector-ref vec i)) i)
                           (else (loop1 pred? vec (- i 1))))))
           (loop2+ (lambda (pred? vectors i)
                     (cond ((negative? i) #f)
                           ((apply pred? (vectors-ref vectors i)) i)
                           (else (loop2+ pred? vectors (- i 1)))))))
    (lambda (pred? vec vectors callee)
      (let ((pred? (check-type procedure? pred? callee))
            (vec   (check-type vector?    vec   callee)))
        (if (null? vectors)
            (loop1 pred? vec (- (vector-length vec) 1))
            (loop2+ pred? (cons vec vectors)
                    (- (%smallest-length vectors
                                         (vector-length vec)
                                         callee)
                       1)))))))

;;; (VECTOR-BINARY-SEARCH <vector> <value> <cmp> [<start> <end>])
;;;       -> exact, nonnegative integer or #F
;;;     (CMP <value1> <value2>) -> integer
;;;       positive -> VALUE1 > VALUE2
;;;       zero     -> VALUE1 = VALUE2
;;;       negative -> VALUE1 < VALUE2
;;;   Perform a binary search through VECTOR for VALUE, comparing each
;;;   element to VALUE with CMP.
(define (vector-binary-search vec value cmp . maybe-start+end)
  (let ((cmp (check-type procedure? cmp vector-binary-search)))
    (let-vector-start+end vector-binary-search vec maybe-start+end
                          (start end)
      (let loop ((start start) (end end) (j #f))
        (let ((i (quotient (+ start end) 2)))
          (if (or (= start end) (and j (= i j)))
              #f
              (let ((comparison
                     (check-type integer?
                                 (cmp (vector-ref vec i) value)
                                 `(,cmp for ,vector-binary-search))))
                (cond ((zero?     comparison) i)
                      ((positive? comparison) (loop start i i))
                      (else                   (loop i end i))))))))))

;;; (VECTOR-ANY <pred?> <vector> ...) -> value
;;;   Apply PRED? to each parallel element in each VECTOR ...; if PRED?
;;;   should ever return a true value, immediately stop and return that
;;;   value; otherwise, when the shortest vector runs out, return #F.
;;;   The iteration and order of application of PRED? across elements
;;;   is of the vectors is strictly left-to-right.
(define vector-any
  (letrec ((loop1 (lambda (pred? vec i len len-1)
                    (and (not (= i len))
                         (if (= i len-1)
                             (pred? (vector-ref vec i))
                             (or (pred? (vector-ref vec i))
                                 (loop1 pred? vec (+ i 1)
                                        len len-1))))))
           (loop2+ (lambda (pred? vectors i len len-1)
                     (and (not (= i len))
                          (if (= i len-1)
                              (apply pred? (vectors-ref vectors i))
                              (or (apply pred? (vectors-ref vectors i))
                                  (loop2+ pred? vectors (+ i 1)
                                         len len-1)))))))
    (lambda (pred? vec . vectors)
      (let ((pred? (check-type procedure? pred? vector-any))
            (vec   (check-type vector?    vec   vector-any)))
        (if (null? vectors)
            (let ((len (vector-length vec)))
              (loop1 pred? vec 0 len (- len 1)))
            (let ((len (%smallest-length vectors
                                         (vector-length vec)
                                         vector-any)))
              (loop2+ pred? (cons vec vectors) 0 len (- len 1))))))))

;;; (VECTOR-EVERY <pred?> <vector> ...) -> value
;;;   Apply PRED? to each parallel value in each VECTOR ...; if PRED?
;;;   should ever return #F, immediately stop and return #F; otherwise,
;;;   if PRED? should return a true value for each element, stopping at
;;;   the end of the shortest vector, return the last value that PRED?
;;;   returned.  In the case that there is an empty vector, return #T.
;;;   The iteration and order of application of PRED? across elements
;;;   is of the vectors is strictly left-to-right.
(define vector-every
  (letrec ((loop1 (lambda (pred? vec i len len-1)
                    (or (= i len)
                        (if (= i len-1)
                            (pred? (vector-ref vec i))
                            (and (pred? (vector-ref vec i))
                                 (loop1 pred? vec (+ i 1)
                                        len len-1))))))
           (loop2+ (lambda (pred? vectors i len len-1)
                     (or (= i len)
                         (if (= i len-1)
                             (apply pred? (vectors-ref vectors i))
                             (and (apply pred? (vectors-ref vectors i))
                                  (loop2+ pred? vectors (+ i 1)
                                          len len-1)))))))
    (lambda (pred? vec . vectors)
      (let ((pred? (check-type procedure? pred? vector-every))
            (vec   (check-type vector?    vec   vector-every)))
        (if (null? vectors)
            (let ((len (vector-length vec)))
              (loop1 pred? vec 0 len (- len 1)))
            (let ((len (%smallest-length vectors
                                         (vector-length vec)
                                         vector-every)))
              (loop2+ pred? (cons vec vectors) 0 len (- len 1))))))))



;;; --------------------
;;; Mutators

;;; (VECTOR-SET! <vector> <index> <value>) -> unspecified
;;;   [R5RS] Assign the location at INDEX in VECTOR to VALUE.
(define vector-set! vector-set!)

;;; (VECTOR-SWAP! <vector> <index1> <index2>) -> unspecified
;;;   Swap the values in the locations at INDEX1 and INDEX2.
(define (vector-swap! vec i j)
  (let ((vec (check-type vector? vec vector-swap!)))
    (let ((i (check-index vec i vector-swap!))
          (j (check-index vec j vector-swap!)))
      (let ((x (vector-ref vec i)))
        (vector-set! vec i (vector-ref vec j))
        (vector-set! vec j x)))))

;;; (VECTOR-FILL! <vector> <value> [<start> <end>]) -> unspecified
;;;   [R5RS+] Fill the locations in VECTOR between START, whose default
;;;   is 0, and END, whose default is the length of VECTOR, with VALUE.
;;;
;;; This one can probably be made really fast natively.
(define vector-fill!
  (let ((%vector-fill! vector-fill!))   ; Take the native one, under
                                        ;   the assumption that it's
                                        ;   faster, so we can use it if
                                        ;   there are no optional
                                        ;   arguments.
    (lambda (vec value . maybe-start+end)
      (if (null? maybe-start+end)
          (%vector-fill! vec value)     ;+++
          (let-vector-start+end vector-fill! vec maybe-start+end
                                (start end)
            (do ((i start (+ i 1)))
                ((= i end))
              (vector-set! vec i value)))))))

;;; (VECTOR-COPY! <target> <tstart> <source> [<sstart> <send>])
;;;       -> unspecified
;;;   Copy the values in the locations in [SSTART,SEND) from SOURCE to
;;;   to TARGET, starting at TSTART in TARGET.
;;; [wdc] Corrected to allow 0 <= sstart <= send <= (vector-length source).
(define (vector-copy! target tstart source . maybe-sstart+send)
  (define (doit! sstart send source-length)
    (let ((tstart (check-type nonneg-int? tstart vector-copy!))
          (sstart (check-type nonneg-int? sstart vector-copy!))
          (send   (check-type nonneg-int? send vector-copy!)))
      (cond ((and (<= 0 sstart send source-length)
                  (<= (+ tstart (- send sstart)) (vector-length target)))
             (%vector-copy! target tstart source sstart send))
            (else
             (error "illegal arguments"
                    `(while calling ,vector-copy!)
                    `(target was ,target)
                    `(target-length was ,(vector-length target))
                    `(tstart was ,tstart)
                    `(source was ,source)
                    `(source-length was ,source-length)
                    `(sstart was ,sstart)
                    `(send   was ,send))))))
  (let ((n (vector-length source)))
    (cond ((null? maybe-sstart+send)
           (doit! 0 n n))
          ((null? (cdr maybe-sstart+send))
           (doit! (car maybe-sstart+send) n n))
          ((null? (cddr maybe-sstart+send))
           (doit! (car maybe-sstart+send) (cadr maybe-sstart+send) n))
          (else
           (error "too many arguments"
                  vector-copy!
                  (cddr maybe-sstart+send))))))

;;; (VECTOR-REVERSE-COPY! <target> <tstart> <source> [<sstart> <send>])
;;; [wdc] Corrected to allow 0 <= sstart <= send <= (vector-length source).
(define (vector-reverse-copy! target tstart source . maybe-sstart+send)
  (define (doit! sstart send source-length)
    (let ((tstart (check-type nonneg-int? tstart vector-reverse-copy!))
          (sstart (check-type nonneg-int? sstart vector-reverse-copy!))
          (send   (check-type nonneg-int? send vector-reverse-copy!)))
      (cond ((and (eq? target source)
                  (or (between? sstart tstart send)
                      (between? tstart sstart
                                (+ tstart (- send sstart)))))
               (error "vector range for self-copying overlaps"
                      vector-reverse-copy!
                      `(vector was ,target)
                      `(tstart was ,tstart)
                      `(sstart was ,sstart)
                      `(send   was ,send)))
            ((and (<= 0 sstart send source-length)
                  (<= (+ tstart (- send sstart)) (vector-length target)))
             (%vector-reverse-copy! target tstart source sstart send))
            (else
             (error "illegal arguments"
                    `(while calling ,vector-reverse-copy!)
                    `(target was ,target)
                    `(target-length was ,(vector-length target))
                    `(tstart was ,tstart)
                    `(source was ,source)
                    `(source-length was ,source-length)
                    `(sstart was ,sstart)
                    `(send   was ,send))))))
  (let ((n (vector-length source)))
    (cond ((null? maybe-sstart+send)
           (doit! 0 n n))
          ((null? (cdr maybe-sstart+send))
           (doit! (car maybe-sstart+send) n n))
          ((null? (cddr maybe-sstart+send))
           (doit! (car maybe-sstart+send) (cadr maybe-sstart+send) n))
          (else
           (error "too many arguments"
                  vector-reverse-copy!
                  (cddr maybe-sstart+send))))))

;;; (VECTOR-REVERSE! <vector> [<start> <end>]) -> unspecified
;;;   Destructively reverse the contents of the sequence of locations
;;;   in VECTOR between START, whose default is 0, and END, whose
;;;   default is the length of VECTOR.
(define (vector-reverse! vec . start+end)
  (let-vector-start+end vector-reverse! vec start+end
                        (start end)
    (%vector-reverse! vec start end)))



;;; --------------------
;;; Conversion

;;; (VECTOR->LIST <vector> [<start> <end>]) -> list
;;;   [R5RS+] Produce a list containing the elements in the locations
;;;   between START, whose default is 0, and END, whose default is the
;;;   length of VECTOR, from VECTOR.
(define vector->list
  (let ((%vector->list vector->list))
    (lambda (vec . maybe-start+end)
      (if (null? maybe-start+end)       ; Oughta use CASE-LAMBDA.
          (%vector->list vec)           ;+++
          (let-vector-start+end vector->list vec maybe-start+end
                                (start end)
            ;(unfold (lambda (i)        ; No SRFI 1.
            ;          (< i start))
            ;        (lambda (i) (vector-ref vec i))
            ;        (lambda (i) (- i 1))
            ;        (- end 1))
            (do ((i (- end 1) (- i 1))
                 (result '() (cons (vector-ref vec i) result)))
                ((< i start) result)))))))

;;; (REVERSE-VECTOR->LIST <vector> [<start> <end>]) -> list
;;;   Produce a list containing the elements in the locations between
;;;   START, whose default is 0, and END, whose default is the length
;;;   of VECTOR, from VECTOR, in reverse order.
(define (reverse-vector->list vec . maybe-start+end)
  (let-vector-start+end reverse-vector->list vec maybe-start+end
                        (start end)
    ;(unfold (lambda (i) (= i end))     ; No SRFI 1.
    ;        (lambda (i) (vector-ref vec i))
    ;        (lambda (i) (+ i 1))
    ;        start)
    (do ((i start (+ i 1))
         (result '() (cons (vector-ref vec i) result)))
        ((= i end) result))))

;;; (LIST->VECTOR <list> [<start> <end>]) -> vector
;;;   [R5RS+] Produce a vector containing the elements in LIST, which
;;;   must be a proper list, between START, whose default is 0, & END,
;;;   whose default is the length of LIST.  It is suggested that if the
;;;   length of LIST is known in advance, the START and END arguments
;;;   be passed, so that LIST->VECTOR need not call LENGTH to determine
;;;   the the length.
;;;
;;; This implementation diverges on circular lists, unless LENGTH fails
;;; and causes - to fail as well.  Given a LENGTH* that computes the
;;; length of a list's cycle, this wouldn't diverge, and would work
;;; great for circular lists.
(define list->vector
  (let ((%list->vector list->vector))
    (lambda (lst . maybe-start+end)
      ;; Checking the type of a proper list is expensive, so we do it
      ;; amortizedly, or let %LIST->VECTOR or LIST-TAIL do it.
      (if (null? maybe-start+end)       ; Oughta use CASE-LAMBDA.
          (%list->vector lst)           ;+++
          ;; We can't use LET-VECTOR-START+END, because we're using the
          ;; bounds of a _list_, not a vector.
          (let*-optionals maybe-start+end
              ((start 0)
               (end (length lst)))      ; Ugh -- LENGTH
            (let ((start (check-type nonneg-int? start list->vector))
                  (end   (check-type nonneg-int? end   list->vector)))
              ((lambda (f)
                 (vector-unfold f (- end start) (list-tail lst start)))
               (lambda (index l)
                 (cond ((null? l)
                        (error "list was too short"
                               `(list was ,lst)
                               `(attempted end was ,end)
                               `(while calling ,list->vector)))
                       ((pair? l)
                        (values (car l) (cdr l)))
                       (else
                        ;; Make this look as much like what CHECK-TYPE
                        ;; would report as possible.
                        (error "erroneous value"
                               ;; We want SRFI 1's PROPER-LIST?, but it
                               ;; would be a waste to link all of SRFI
                               ;; 1 to this module for only the single
                               ;; function PROPER-LIST?.
                               (list list? lst)
                               `(while calling
                                 ,list->vector))))))))))))

;;; (REVERSE-LIST->VECTOR <list> [<start> <end>]) -> vector
;;;   Produce a vector containing the elements in LIST, which must be a
;;;   proper list, between START, whose default is 0, and END, whose
;;;   default is the length of LIST, in reverse order.  It is suggested
;;;   that if the length of LIST is known in advance, the START and END
;;;   arguments be passed, so that REVERSE-LIST->VECTOR need not call
;;;   LENGTH to determine the the length.
;;;
;;; This also diverges on circular lists unless, again, LENGTH returns
;;; something that makes - bork.
(define (reverse-list->vector lst . maybe-start+end)
  (let*-optionals maybe-start+end
      ((start 0)
       (end (length lst)))              ; Ugh -- LENGTH
    (let ((start (check-type nonneg-int? start reverse-list->vector))
          (end   (check-type nonneg-int? end   reverse-list->vector)))
      ((lambda (f)
         (vector-unfold-right f (- end start) (list-tail lst start)))
       (lambda (index l)
         (cond ((null? l)
                (error "list too short"
                       `(list was ,lst)
                       `(attempted end was ,end)
                       `(while calling ,reverse-list->vector)))
               ((pair? l)
                (values (car l) (cdr l)))
               (else
                (error "erroneous value"
                       (list list? lst)
                       `(while calling ,reverse-list->vector)))))))))
