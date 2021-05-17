#!r6rs
(library (srfi :116 ilists)

  (export iq
          ipair ilist xipair ipair* make-ilist ilist-copy ilist-tabulate iiota
          ipair?
          proper-ilist? ilist? dotted-ilist? not-ipair? null-ilist? ilist=
          icar icdr ilist-ref
          ifirst isecond ithird ifourth ififth isixth iseventh ieighth ininth itenth
          icaar icadr icdar icddr
          icaaar icaadr icadar icaddr icdaar icdadr icddar icdddr
          icaaaar icaaadr icaadar icaaddr icadaar icadadr icaddar icadddr
          icdaaar icdaadr icdadar icdaddr icddaar icddadr icdddar icddddr
          icar+icdr itake idrop ilist-tail
          itake-right idrop-right isplit-at ilast last-ipair
          ilength iappend iconcatenate ireverse iappend-reverse
          izip iunzip1 iunzip2 iunzip3 iunzip4 iunzip5
          icount imap ifor-each ifold iunfold ipair-fold ireduce
          ifold-right iunfold-right ipair-fold-right ireduce-right
          iappend-map ipair-for-each ifilter-map imap-in-order
          ifilter ipartition iremove imember imemq imemv
          ifind ifind-tail iany ievery
          ilist-index itake-while idrop-while ispan ibreak
          idelete idelete-duplicates
          iassoc iassq iassv ialist-cons ialist-delete
          replace-icar replace-icdr
          pair->ipair ipair->pair list->ilist ilist->list
          tree->itree itree->tree gtree->itree gtree->tree
          iapply)

  (import (except (rnrs) define-record-type)
          (only (srfi :1) set-cdr! set-car!)
          (srfi :9))

  (define (error* msg . args)
    (error 'ilist msg args))

  ;;;; Enhancements and hooks in Olin's SRFI-1 code to make it work for ilists

;;; The basic ilist cell

  (define-record-type <ilist> (ipair icar icdr) ipair? (icar icar) (icdr icdr))

;;; SRFI 8 syntax for receiving multiple values

  (define-syntax receive
    (syntax-rules ()
      ((receive formals expression body ...)
       (call-with-values (lambda () expression)
         (lambda formals body ...)))))

;;; Syntax for quoting ilists

  (define-syntax iq
    (syntax-rules ()
      ((iq . tree) (gtree->itree 'tree))))

;;; Replacers

  (define (replace-icar old new)
    (ipair new (icdr old)))

  (define (replace-icdr old new)
    (ipair (icar old) new))

;;; Conversion between lists and ilists

  (define (pair->ipair pair)
    (ipair (car pair) (cdr pair)))

  (define (ipair->pair ipair)
    (cons (icar ipair) (icdr ipair)))

  (define (list->ilist list)
    (let lp ((list list))
      (if (pair? list)
          (ipair (car list) (lp (cdr list)))
          list)))

  (define (ilist . objs)
    (list->ilist objs))

  (define (ilist->list ilist)
    (let lp ((ilist ilist))
      (if (ipair? ilist)
          (cons (icar ilist) (lp (icdr ilist)))
          ilist)))

  (define (tree->itree obj)
    (if (pair? obj)
        (ipair (tree->itree (car obj)) (tree->itree (cdr obj)))
        obj))

  (define (itree->tree obj)
    (if (ipair? obj)
        (cons (itree->tree (icar obj)) (itree->tree (icdr obj)))
        obj))

  (define (gtree->itree obj)
    (cond
     ((pair? obj)
      (ipair (gtree->itree (car obj)) (gtree->itree (cdr obj))))
     ((ipair? obj)
      (ipair (gtree->itree (icar obj)) (gtree->itree (icdr obj))))
     (else
      obj)))

  (define (gtree->tree obj)
    (cond
     ((pair? obj)
      (cons (gtree->tree (car obj)) (gtree->tree (cdr obj))))
     ((ipair? obj)
      (cons (gtree->tree (icar obj)) (gtree->tree (icdr obj))))
     (else
      obj)))

  ;; Apply a function to (arguments and) an ilist
  ;; If ilists are built in, optimize this!
  ;; Need a few SRFI-1 routines

  (define (take! ls i)
    (if (<= i 0)
        '()
        (let ((tail (list-tail ls (- i 1))))
          (set-cdr! tail '())
          ls)))

  (define (drop-right! ls i)
    (take! ls (- (length ls) i)))

  (define (last ls) (if (null? (cdr ls)) (car ls) (last (cdr ls))))

  (define (iapply proc . ilists)
    (cond
     ((null? ilists)
      (apply proc '()))
     ((null? (cdr ilists))
      (apply proc (ilist->list (car ilists))))
     (else
      (let ((final (ilist->list (last ilists))))
        (apply proc (append (drop-right! ilists 1) final))))))

;;; Printer for debugging

  (define (write-ipair ipair port)
    (write (gtree->tree ipair) port))

;;; Stuff needed by Olin's code

  (define-syntax :optional
    (syntax-rules ()
      ((:optional rest default)
       (cond
        ((null? rest) default)
        ((null? (cdr rest)) (car rest))
        (else (error* "Too many arguments"))))))

;;; Analogues of R5RS list routines (not defined by Olin)

  (define (iassq x lis)
    (ifind (lambda (entry) (eq? x (icar entry))) lis))

  (define (iassv x lis)
    (ifind (lambda (entry) (eqv? x (icar entry))) lis))

  (define (ifor-each proc lis1 . lists)
    (check-arg procedure? proc ipair-for-each)
    (if (pair? lists)

        (let lp ((lists (cons lis1 lists)))
          (let ((tails (%cdrs lists)))
            (if (pair? tails)
                (begin (apply proc (map icar lists))
                       (lp tails)))))

        ;; Fast path.
        (let lp ((lis lis1))
          (if (not (null-ilist? lis))
              (let ((tail (icdr lis)))    ; Grab the icdr now,
                (proc (icar lis))                ; even though it's unnecessary
                (lp tail))))))

;;; SRFI-116 ilist-processing library 			-*- Scheme -*-
;;; Sample implementation
;;;
;;; Copyright (c) 1998, 1999 by Olin Shivers.
;;; Modifications Copyright (c) 2014 by John Cowan.
;;; You may do as you please with
;;; this code as long as you do not remove either copyright notice
;;; or hold us liable for its use.  Please send bug reports to
;;; <srfi-116@srfi.schemers.org>.

;;; This is a library of ilist- and ipair-processing functions. I wrote it after
;;; carefully considering the functions provided by the libraries found in
;;; R4RS/R5RS Scheme, MIT Scheme, Gambit, RScheme, MzScheme, slib, Common
;;; Lisp, Bigloo, guile, T, APL and the SML standard basis. It is a pretty
;;; rich toolkit, providing a superset of the functionality found in any of
;;; the various Schemes I considered.

;;; This implementation is intended as a portable reference implementation
;;; for SRFI-116. See the porting notes below for more information.

;;; Exported:
;;; xipair tree-copy make-ilist ilist-tabulate ipair* ilist-copy
;;; proper-ilist? circular-ilist? dotted-ilist? not-ipair? null-ilist? ilist=
;;; ilength+
;;; iiota
;;; ifirst isecond ithird ifourth ififth isixth iseventh ieighth ininth itenth
;;; icar+icdr
;;; itake       idrop
;;; itake-right idrop-right
;;; isplit-at
;;; ilast last-ipair
;;; izip iunzip1 iunzip2 iunzip3 iunzip4 iunzip5
;;; icount
;;; iappend-reverse iconcatenate
;;; iunfold       ifold       ipair-fold       ireduce
;;; iunfold-right ifold-right ipair-fold-right ireduce-right
;;; iappend-map ipair-for-each ifilter-map imap-in-order
;;; ifilter  ipartition  iremove
;;; ifind ifind-tail iany ievery ilist-index
;;; itake-while idrop-while
;;; ispan ibreak
;;; idelete
;;; ialist-cons alist-copy
;;; idelete-duplicates
;;; ialist-delete
;;; ipair ipair? null? icar icdr
;;; ilist ilength iappend ireverse icadr ... icddddr ilist-ref
;;; first second third fourth fifth sixth seventh eighth ninth tenth
;;; imemq imemv iassq iassv
;;;
;;;   ilist-tail (same as idrop)
;;;   ilist? (same as proper-ilist?)


;;; A note on recursion and iteration/reversal:
;;; Many iterative ilist-processing algorithms naturally compute the elements
;;; of the answer ilist in the wrong order (left-to-right or head-to-tail) from
;;; the order needed to pair them into the proper answer (right-to-left, or
;;; tail-then-head). One style or idiom of programming these algorithms, then,
;;; loops, consing up the elements in reverse order, then destructively
;;; reverses the ilist at the end of the loop. I do not do this. The natural
;;; and efficient way to code these algorithms is recursively. This trades off
;;; intermediate temporary ilist structure for intermediate temporary stack
;;; structure. In a stack-based system, this improves cache locality and
;;; lightens the load on the GC system. Don't stand on your head to iterate!
;;; Recurse, where natural. Multiple-value returns make this even more
;;; convenient, when the recursion/iteration has multiple state values.

;;; Porting:
;;; This is carefully tuned code; do not modify casually.
;;;   - It is careful to share storage when possible;
;;;
;;; That said, a port of this library to a specific Scheme system might wish
;;; to tune this code to exploit particulars of the implementation.
;;; The single most important compiler-specific optimisation you could make
;;; to this library would be to add rewrite rules or transforms to:
;;; - transform applications of n-ary procedures (e.g. ILIST=, IPAIR*, IIAPPEND,
;;;   ILSET-UNION) into multiple applications of a primitive two-argument
;;;   variant.
;;; - transform applications of the mapping functions (IMAP, IFOR-EACH, IFOLD,
;;;   IANY, IEVERY) into open-coded loops. The killer here is that these
;;;   functions are n-ary. Handling the general case is quite inefficient,
;;;   requiring many intermediate data structures to be allocated and
;;;   discarded.
;;; - transform applications of procedures that take optional arguments
;;;   into calls to variants that do not take optional arguments. This
;;;   eliminates unnecessary consing and parsing of the rest parameter.
;;;
;;; These transforms would provide BIG speedups. In particular, the n-ary
;;; mapping functions are particularly slow and pair-intensive, and are good
;;; candidates for tuning. I have coded fast paths for the single-ilist cases,
;;; but what you really want to do is exploit the fact that the compiler
;;; usually knows how many arguments are being passed to a particular
;;; application of these functions -- they are usually explicitly called, not
;;; passed around as higher-order values. If you can arrange to have your
;;; compiler produce custom code or custom linkages based on the number of
;;; arguments in the call, you can speed these functions up a *lot*. But this
;;; kind of compiler technology no longer exists in the Scheme world as far as
;;; I can see.
;;;
;;; This code does a fair amount of run-time argument checking. If your
;;; Scheme system has a sophisticated compiler that can eliminate redundant
;;; error checks, this is no problem. However, if not, these checks incur
;;; some performance overhead -- and, in a safe Scheme implementation, they
;;; are in some sense redundant: if we don't check to see that the PROC
;;; parameter is a procedure, we'll find out anyway three lines later when
;;; we try to call the value. It's pretty easy to rip all this argument
;;; checking code out if it's inappropriate for your implementation -- just
;;; nuke every call to CHECK-ARG.
;;;
;;; On the other hand, if you *do* have a sophisticated compiler that will
;;; actually perform soft-typing and eliminate redundant checks (Rice's systems
;;; being the only possible candidate of which I'm aware), leaving these checks
;;; in can *help*, since their presence can be elided in redundant cases,
;;; and in cases where they are needed, performing the checks early, at
;;; procedure entry, can "lift" a check out of a loop.
;;;
;;; Finally, I have only checked the properties that can portably be checked
;;; with R5RS Scheme -- and this is not complete. You may wish to alter
;;; the CHECK-ARG parameter checks to perform extra, implementation-specific
;;; checks, such as procedure arity for higher-order values.
;;;
;;; The code has only these non-R4RS dependencies:
;;;   A few calls to an ERROR procedure;
;;;   Uses of the R5RS multiple-value procedure VALUES and the m-v binding
;;;     RECEIVE macro (which isn't R5RS, but is a trivial macro).
;;;   Many calls to a parameter-checking procedure check-arg:

  (define (check-arg pred val caller)
    (let lp ((val val))
      (if (pred val) val (lp (error* "Bad argument" val pred caller)))))

;;;   A few uses of the LET-OPTIONAL and :OPTIONAL macros for parsing
;;;     optional arguments.
;;;
;;; Most of these procedures use the NULL-ILIST? test to trigger the
;;; base case in the inner loop or recursion. The NULL-ILIST? function
;;; is defined to be a careful one -- it raises an error if passed a
;;; non-nil, non-ipair value. The spec allows an implementation to use
;;; a less-careful implementation that simply defines NULL-ILIST? to
;;; be NOT-IPAIR?. This would speed up the inner loops of these procedures
;;; at the expense of having them silently accept dotted lists.

;;; A note on dotted lists:
;;; Many of the procedures in this library can be trivially redefined
;;; to handle dotted lists, just by changing the NULL-ILIST? base-case
;;; check to NOT-IPAIR?, meaning that any non-ipair value is taken to be
;;; an empty ilist. For most of these procedures, that's all that is
;;; required.
;;;
;;; However, we have to do a little more work for some procedures that
;;; *produce* ilists from other ilists.  Were we to extend these procedures to
;;; accept dotted ilists, we would have to define how they terminate the ilists
;;; produced as results when passed a dotted ilist.
;;;
;;; The argument *against* defining these procedures to work on dotted
;;; ilists is that dotted ilists are the rare, odd case, and that by
;;; arranging for the procedures to handle them, we lose error checking
;;; in the cases where a dotted ilist is passed by accident -- e.g., when
;;; the programmer swaps a two arguments to an ilist-processing function,
;;; one being a scalar and one being an ilist. For example,
;;;     (imember '(1 3 5 7 9) 7)
;;; This would quietly return #f if we extended IMEMBER to accept dotted
;;; lists.


;;; Constructors
;;;;;;;;;;;;;;;;

;;; Occasionally useful as a value to be passed to a ifold or other
;;; higher-order procedure.
  (define (xipair d a) (ipair a d))

;;;; Recursively copy every ipair.

;;; Make an ilist of length LEN.

  (define (make-ilist len . maybe-elt)
    (check-arg (lambda (n) (and (integer? n) (>= n 0))) len make-ilist)
    (let ((elt (cond ((null? maybe-elt) #f) ; Default value
                     ((null? (cdr maybe-elt)) (car maybe-elt))
                     (else (error* "Too many arguments to MAKE-ILIST"
                                  (ipair len maybe-elt))))))
      (do ((i len (- i 1))
           (ans '() (ipair elt ans)))
          ((<= i 0) ans))))


  ;; The ilist procedure is defined in ilists-base.scm.


;;; Make an ilist of ilength LEN. Elt i is (PROC i) for 0 <= i < LEN.

  (define (ilist-tabulate len proc)
    (check-arg (lambda (n) (and (integer? n) (>= n 0))) len ilist-tabulate)
    (check-arg procedure? proc ilist-tabulate)
    (do ((i (- len 1) (- i 1))
         (ans '() (ipair (proc i) ans)))
        ((< i 0) ans)))

;;; (ipair* a1 a2 ... an) = (ipair a1 (ipair a2 (ipair ... an)))
;;; (ipair* a1) = a1	(ipair* a1 a2 ...) = (ipair a1 (ipair* a2 ...))
;;;
;;; (ipair ifirst (iunfold not-ipair? icar icdr rest values))

  (define (ipair* ifirst . rest)
    (let recur ((x ifirst) (rest rest))
      (if (pair? rest)
          (ipair x (recur (car rest) (cdr rest)))
          x)))

;;; (iunfold not-ipair? icar icdr lis values)

  (define (ilist-copy lis)
    (let recur ((lis lis))
      (if (ipair? lis)
          (ipair (icar lis) (recur (icdr lis)))
          lis)))

;;; IIOTA count [start step]	(start start+step ... start+(count-1)*step)

  (define (iiota count . maybe-start+step)
    (check-arg integer? count iiota)
    (if (< count 0) (error* "Negative step count" iiota count))
    (let ((start (if (pair? maybe-start+step) (car maybe-start+step) 0))
          (step (if (and (pair? maybe-start+step)
                         (pair? (cdr maybe-start+step)))
                    (cadr maybe-start+step)
                    1)))
      (check-arg number? start iiota)
      (check-arg number? step iiota)
      (let loop ((n 0) (r '()))
        (if (= n count)
            (ireverse r)
            (loop (+ 1 n)
                  (ipair (+ start (* n step)) r))))))


;;; <proper-ilist> ::= ()			; Empty proper ilist
;;;		  |   (ipair <x> <proper-ilist>)	; Proper-ilist ipair
;;; Note that this definition rules out circular lists -- and this
;;; function is required to detect this case and return false.

  (define (ilist? x) (proper-ilist? x))
  (define (proper-ilist? x)
    (let lp ((x x) (lag x))
      (if (ipair? x)
          (let ((x (icdr x)))
            (if (ipair? x)
                (let ((x   (icdr x))
                      (lag (icdr lag)))
                  (and (not (eq? x lag)) (lp x lag)))
                (null? x)))
          (null? x))))


;;; A dotted ilist is a finite ilist (possibly of ilength 0) terminated
;;; by a non-nil value. Any non-ipair, non-nil value (e.g., "foo" or 5)
;;; is a dotted ilist of ilength 0.
;;;
;;; <dotted-ilist> ::= <non-nil,non-ipair>	; Empty dotted ilist
;;;               |   (ipair <x> <dotted-ilist>)	; Proper-ilist ipair

  (define (dotted-ilist? x)
    (let lp ((x x) (lag x))
      (if (ipair? x)
          (let ((x (icdr x)))
            (if (ipair? x)
                (let ((x   (icdr x))
                      (lag (icdr lag)))
                  (and (not (eq? x lag)) (lp x lag)))
                (not (null? x))))
          (not (null? x)))))

  (define (not-ipair? x) (not (ipair? x)))	; Inline me.

;;; This is a legal definition which is fast and sloppy:
;;;     (define null-ilist? not-ipair?)
;;; but we'll provide a more careful one:
  (define (null-ilist? l)
    (cond ((ipair? l) #f)
          ((null? l) #t)
          (else (error* "null-ilist?: argument out of domain" l))))


  (define (ilist= = . ilists)
    (or (null? ilists) ; special case

        (let lp1 ((ilist-a (car ilists)) (others (cdr ilists)))
          (or (null? others)
              (let ((ilist-b (car others))
                    (others (cdr others)))
                (if (eq? ilist-a ilist-b)	; EQ? => LIST=
                    (lp1 ilist-b others)
                    (let lp2 ((pair-a ilist-a) (pair-b ilist-b))
                      (if (null-ilist? pair-a)
                          (and (null-ilist? pair-b)
                               (lp1 ilist-b others))
                          (and (not (null-ilist? pair-b))
                               (= (icar pair-a) (icar pair-b))
                               (lp2 (icdr pair-a) (icdr pair-b)))))))))))



  (define (ilength x)			; ILENGTH may diverge or
    (let lp ((x x) (len 0))		; raise an error if X is
      (if (ipair? x)			; a circular ilist. This version
          (lp (icdr x) (+ len 1))		; diverges.
          len)))

  (define (izip ilist1 . more-lists) (apply imap ilist ilist1 more-lists))


;;; Selectors
;;;;;;;;;;;;;

  (define (icaar   x) (icar (icar x)))
  (define (icadr   x) (icar (icdr x)))
  (define (icdar   x) (icdr (icar x)))
  (define (icddr   x) (icdr (icdr x)))

  (define (icaaar  x) (icaar (icar x)))
  (define (icaadr  x) (icaar (icdr x)))
  (define (icadar  x) (icadr (icar x)))
  (define (icaddr  x) (icadr (icdr x)))
  (define (icdaar  x) (icdar (icar x)))
  (define (icdadr  x) (icdar (icdr x)))
  (define (icddar  x) (icddr (icar x)))
  (define (icdddr  x) (icddr (icdr x)))

  (define (icaaaar x) (icaaar (icar x)))
  (define (icaaadr x) (icaaar (icdr x)))
  (define (icaadar x) (icaadr (icar x)))
  (define (icaaddr x) (icaadr (icdr x)))
  (define (icadaar x) (icadar (icar x)))
  (define (icadadr x) (icadar (icdr x)))
  (define (icaddar x) (icaddr (icar x)))
  (define (icadddr x) (icaddr (icdr x)))
  (define (icdaaar x) (icdaar (icar x)))
  (define (icdaadr x) (icdaar (icdr x)))
  (define (icdadar x) (icdadr (icar x)))
  (define (icdaddr x) (icdadr (icdr x)))
  (define (icddaar x) (icddar (icar x)))
  (define (icddadr x) (icddar (icdr x)))
  (define (icdddar x) (icdddr (icar x)))
  (define (icddddr x) (icdddr (icdr x)))


  (define ifirst  icar)
  (define isecond icadr)
  (define ithird  icaddr)
  (define ifourth icadddr)
  (define (ififth   x) (icar    (icddddr x)))
  (define (isixth   x) (icadr   (icddddr x)))
  (define (iseventh x) (icaddr  (icddddr x)))
  (define (ieighth  x) (icadddr (icddddr x)))
  (define (ininth   x) (icar  (icddddr (icddddr x))))
  (define (itenth   x) (icadr (icddddr (icddddr x))))

  (define (icar+icdr ipair) (values (icar ipair) (icdr ipair)))

;;; itake & idrop

  (define (itake lis k)
    (check-arg integer? k itake)
    (let recur ((lis lis) (k k))
      (if (zero? k) '()
          (ipair (icar lis)
                 (recur (icdr lis) (- k 1))))))

  (define (ilist-tail lis k) (idrop lis k))
  (define (idrop lis k)
    (check-arg integer? k idrop)
    (let iter ((lis lis) (k k))
      (if (zero? k) lis (iter (icdr lis) (- k 1)))))

;;; ITAKE-RIGHT and IDROP-RIGHT work by getting two pointers into the ilist,
;;; off by K, then chasing down the ilist until the lead pointer falls off
;;; the end.

  (define (itake-right lis k)
    (check-arg integer? k itake-right)
    (let lp ((lag lis)  (lead (idrop lis k)))
      (if (ipair? lead)
          (lp (icdr lag) (icdr lead))
          lag)))

  (define (idrop-right lis k)
    (check-arg integer? k idrop-right)
    (let recur ((lag lis) (lead (idrop lis k)))
      (if (ipair? lead)
          (ipair (icar lag) (recur (icdr lag) (icdr lead)))
          '())))

;;; In this function, LEAD is actually K+1 ahead of LAG. This lets
;;; us stop LAG one step early, in time to smash its icdr to ().
  (define (ilist-ref lis i) (icar (idrop lis i)))	; R4RS

  (define (isplit-at x k)
    (check-arg integer? k isplit-at)
    (let recur ((lis x) (k k))
      (if (zero? k) (values '() lis)
          (receive (prefix suffix) (recur (icdr lis) (- k 1))
            (values (ipair (icar lis) prefix) suffix)))))

  (define (ilast lis) (icar (last-ipair lis)))

  (define (last-ipair lis)
    (check-arg ipair? lis last-ipair)
    (let lp ((lis lis))
      (let ((tail (icdr lis)))
        (if (ipair? tail) (lp tail) lis))))


;;; Unzippers -- 1 through 5
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

  (define (iunzip1 lis) (imap icar lis))

  (define (iunzip2 lis)
    (let recur ((lis lis))
      (if (null-ilist? lis) (values lis lis)	; Use NOT-IPAIR? to handle
          (let ((elt (icar lis)))			; dotted lists.
            (receive (a b) (recur (icdr lis))
              (values (ipair (icar  elt) a)
                      (ipair (icadr elt) b)))))))

  (define (iunzip3 lis)
    (let recur ((lis lis))
      (if (null-ilist? lis) (values lis lis lis)
          (let ((elt (icar lis)))
            (receive (a b c) (recur (icdr lis))
              (values (ipair (icar   elt) a)
                      (ipair (icadr  elt) b)
                      (ipair (icaddr elt) c)))))))

  (define (iunzip4 lis)
    (let recur ((lis lis))
      (if (null-ilist? lis) (values lis lis lis lis)
          (let ((elt (icar lis)))
            (receive (a b c d) (recur (icdr lis))
              (values (ipair (icar    elt) a)
                      (ipair (icadr   elt) b)
                      (ipair (icaddr  elt) c)
                      (ipair (icadddr elt) d)))))))

  (define (iunzip5 lis)
    (let recur ((lis lis))
      (if (null-ilist? lis) (values lis lis lis lis lis)
          (let ((elt (icar lis)))
            (receive (a b c d e) (recur (icdr lis))
              (values (ipair (icar     elt) a)
                      (ipair (icadr    elt) b)
                      (ipair (icaddr   elt) c)
                      (ipair (icadddr  elt) d)
                      (ipair (icar (icddddr  elt)) e)))))))


;;; iappend-reverse iconcatenate
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

  (define (iappend . lists)
    (if (pair? lists)
        (let recur ((list1 (car lists)) (lists (cdr lists)))
          (if (pair? lists)
              (let ((tail (recur (car lists) (cdr lists))))
                (ifold-right ipair tail list1)) ; Append LIST1 & TAIL.
              list1))
        '()))

  ;; (define (iappend-reverse rev-head tail) (ifold ipair tail rev-head))


;;; Hand-inline the IFOLD and PAIR-IFOLD ops for speed.

  (define (iappend-reverse rev-head tail)
    (let lp ((rev-head rev-head) (tail tail))
      (if (null-ilist? rev-head) tail
          (lp (icdr rev-head) (ipair (icar rev-head) tail)))))

  (define (iconcatenate  lists) (ireduce-right iappend  '() lists))

;;; Fold/imap internal utilities
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; These little internal utilities are used by the general
;;; ifold & mapper funs for the n-ary cases . It'd be nice if they got inlined.
;;; One the other hand, the n-ary cases are painfully inefficient as it is.
;;; An aggressive implementation should simply re-write these functions
;;; for raw efficiency; I have written them for as much clarity, portability,
;;; and simplicity as can be achieved.
;;;
;;; I use the dreaded call/cc to do local aborts. A good compiler could
;;; handle this with extreme efficiency. An implementation that provides
;;; a one-shot, non-persistent continuation grabber could help the compiler
;;; out by using that in place of the call/cc's in these routines.
;;;
;;; These functions have funky definitions that are precisely tuned to
;;; the needs of the ifold/imap procs -- for example, to minimize the number
;;; of times the argument lists need to be examined.

;;; Return (map icdr ilists).
;;; However, if any element of ILISTS is empty, just abort and return '().
  (define (%cdrs lists)
    (call-with-current-continuation
     (lambda (abort)
       (let recur ((lists lists))
         (if (pair? lists)
             (let ((lis (car lists)))
               (if (null? lis) (abort '())
                   (cons (icdr lis) (recur (cdr lists)))))
             '())))))

  (define (%cars+ lists last-elt)	; (append (map icar lists) (list last-elt))
    (let recur ((lists lists))
      (if (pair? lists)
          (cons (icar (car lists)) (recur (cdr lists)))
          (list last-elt))))

;;; LISTS is a (not very long) non-empty list of ilists.
;;; Return two lists: the icars & the icdrs of the ilists.
;;; However, if any of the ilists is empty, just abort and return [() ()].

  (define (%cars+cdrs ilists)
    (call-with-current-continuation
     (lambda (abort)
       (let recur ((ilists ilists))
         (if (pair? ilists)
             (let ((ilist (car ilists))
                   (other-ilists (cdr ilists)))
               (if (null? ilist) (abort '() '()) ; LIST is empty -- bail out
                   (let ((a (icar ilist))
                         (d (icdr ilist)))
                     (receive (icars icdrs) (recur other-ilists)
                       (values (cons a icars) (cons d icdrs))))))
             (values '() '()))))))

;;; Like %CARS+CDRS, but we pass in a final elt tacked onto the end of the
;;; cars ilist. What a hack.
  (define (%cars+cdrs+ ilists cars-final)
    (call-with-current-continuation
     (lambda (abort)
       (let recur ((ilists ilists))
         (if (pair? ilists)
             (let ((ilist (car ilists))
                   (other-ilists (cdr ilists)))
               (if (null? ilist) (abort '() '()) ; LIST is empty -- bail out
                   (receive (a d) (icar+icdr ilist)
                     (receive (cars cdrs) (recur other-ilists)
                       (values (cons a cars) (cons d cdrs))))))
             (values (list cars-final) '()))))))

;;; Like %CARS+CDRS, but blow up if any ilist is empty.
  (define (%cars+cdrs/no-test ilists)
    (let recur ((ilists ilists))
      (if (pair? ilists)
          (let ((ilist (car ilists))
                (other-ilists (cdr ilists)))
            (let ((a (icar ilist))
                  (d (icdr ilist)))
              (receive (cars cdrs) (recur other-ilists)
                (values (cons a cars) (cons d cdrs)))))
          (values '() '()))))


;;; icount
;;;;;;;;;
  (define (icount pred ilist1 . ilists)
    (check-arg procedure? pred icount)
    (if (pair? ilists)

        ;; N-ary case
        (let lp ((ilist1 ilist1) (ilists ilists) (i 0))
          (if (null-ilist? ilist1) i
              (receive (as ds) (%cars+cdrs ilists)
                (if (null? as) i
                    (lp (icdr ilist1) ds
                        (if (apply pred (icar ilist1) as) (+ i 1) i))))))

        ;; Fast path
        (let lp ((lis ilist1) (i 0))
          (if (null-ilist? lis) i
              (lp (icdr lis) (if (pred (icar lis)) (+ i 1) i))))))


;;; ifold/iunfold
;;;;;;;;;;;;;;;

  (define (iunfold-right p f g seed . maybe-tail)
    (check-arg procedure? p iunfold-right)
    (check-arg procedure? f iunfold-right)
    (check-arg procedure? g iunfold-right)
    (let lp ((seed seed) (ans (:optional maybe-tail '())))
      (if (p seed) ans
          (lp (g seed)
              (ipair (f seed) ans)))))


  (define (iunfold p f g seed . maybe-tail-gen)
    (check-arg procedure? p iunfold)
    (check-arg procedure? f iunfold)
    (check-arg procedure? g iunfold)
    (if (pair? maybe-tail-gen)

        (let ((tail-gen (car maybe-tail-gen)))
          (if (pair? (cdr maybe-tail-gen))
              (apply error* "Too many arguments" iunfold p f g seed maybe-tail-gen)

              (let recur ((seed seed))
                (if (p seed) (tail-gen seed)
                    (ipair (f seed) (recur (g seed)))))))

        (let recur ((seed seed))
          (if (p seed) '()
              (ipair (f seed) (recur (g seed)))))))


  (define (ifold kons knil ilis1 . ilists)
    (check-arg procedure? kons ifold)
    (if (pair? ilists)
        (let lp ((ilists (cons ilis1 ilists)) (ans knil))	; N-ary case
          (receive (cars+ans cdrs) (%cars+cdrs+ ilists ans)
            (if (null? cars+ans) ans ; Done.
                (lp cdrs (apply kons cars+ans)))))

        (let lp ((ilis ilis1) (ans knil))			; Fast path
          (if (null-ilist? ilis) ans
              (lp (icdr ilis) (kons (icar ilis) ans))))))


  (define (ifold-right kons knil ilis1 . ilists)
    (check-arg procedure? kons ifold-right)
    (if (pair? ilists)
        (let recur ((ilists (cons ilis1 ilists)))		; N-ary case
          (let ((cdrs (%cdrs ilists)))
            (if (null? cdrs) knil
                (apply kons (%cars+ ilists (recur cdrs))))))

        (let recur ((ilis ilis1))				; Fast path
          (if (null? ilis) knil
              (let ((head (icar ilis)))
                (kons head (recur (icdr ilis))))))))


  (define (ipair-fold-right f zero ilis1 . ilists)
    (check-arg procedure? f ipair-fold-right)
    (if (pair? ilists)
        (let recur ((ilists (cons ilis1 ilists)))		; N-ary case
          (let ((cdrs (%cdrs ilists)))
            (if (null? cdrs) zero
                (apply f (append ilists (list (recur cdrs)))))))

        (let recur ((ilis ilis1))				; Fast path
          (if (null-ilist? ilis) zero (f ilis (recur (icdr ilis)))))))

  (define (ipair-fold f zero ilis1 . ilists)
    (check-arg procedure? f ipair-fold)
    (if (pair? ilists)
        (let lp ((ilists (cons ilis1 ilists)) (ans zero))	; N-ary case
          (let ((tails (%cdrs ilists)))
            (if (null? tails) ans
                (lp tails (apply f (append ilists (list ans)))))))

        (let lp ((ilis ilis1) (ans zero))
          (if (null-ilist? ilis) ans
              (let ((tail (icdr ilis)))		; Grab the icdr now,
                (lp tail (f ilis ans)))))))	; in case F SET-CDR!s LIS.


;;; IREDUCE and IREDUCE-RIGHT only use RIDENTITY in the empty-ilist case.
;;; These cannot meaningfully be n-ary.

  (define (ireduce f ridentity ilis)
    (check-arg procedure? f ireduce)
    (if (null-ilist? ilis) ridentity
        (ifold f (icar ilis) (icdr ilis))))

  (define (ireduce-right f ridentity ilis)
    (check-arg procedure? f ireduce-right)
    (if (null-ilist? ilis) ridentity
        (let recur ((head (icar ilis)) (ilis (icdr ilis)))
          (if (ipair? ilis)
              (f head (recur (icar ilis) (icdr ilis)))
              head))))



;;; Mappers: iappend-map ipair-for-each ifilter-map imap-in-order
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

  (define (iappend-map f ilis1 . ilists)
    (really-iappend-map iappend-map  iappend  f ilis1 ilists))

  (define (really-iappend-map who appender f ilis1 ilists)
    (check-arg procedure? f who)
    (if (pair? ilists)
        (receive (cars cdrs) (%cars+cdrs (cons ilis1 ilists))
          (if (null? cars) '()
              (let recur ((cars cars) (cdrs cdrs))
                (let ((vals (apply f cars)))
                  (receive (cars2 cdrs2) (%cars+cdrs cdrs)
                    (if (null? cars2) vals
                        (appender vals (recur cars2 cdrs2))))))))

        ;; Fast path
        (if (null-ilist? ilis1) '()
            (let recur ((elt (icar ilis1)) (rest (icdr ilis1)))
              (let ((vals (f elt)))
                (if (null-ilist? rest) vals
                    (appender vals (recur (icar rest) (icdr rest)))))))))


  (define (ipair-for-each proc ilis1 . ilists)
    (check-arg procedure? proc ipair-for-each)
    (if (pair? ilists)

        (let lp ((ilists (cons ilis1 ilists)))
          (let ((itails (%cdrs ilists)))
            (if (pair? itails)
                (begin (apply proc ilists)
                       (lp itails)))))

        ;; Fast path.
        (let lp ((ilis ilis1))
          (if (not (null-ilist? ilis))
              (let ((tail (icdr ilis)))	; Grab the icdr now,
                (proc ilis)		; even though nothing can happen
                (lp tail))))))

;;; We stop when LIS1 runs out, not when any ilist runs out.
;;; Map F across L, and save up all the non-false results.
  (define (ifilter-map f ilis1 . ilists)
    (check-arg procedure? f ifilter-map)
    (if (pair? ilists)
        (let recur ((ilists (cons ilis1 ilists)))
          (receive (cars cdrs) (%cars+cdrs ilists)
            (if (pair? cars)
                (cond ((apply f cars) => (lambda (x) (ipair x (recur cdrs))))
                      (else (recur cdrs))) ; Tail call in this arm.
                '())))

        ;; Fast path.
        (let recur ((ilis ilis1))
          (if (null-ilist? ilis) ilis
              (let ((tail (recur (icdr ilis))))
                (cond ((f (icar ilis)) => (lambda (x) (ipair x tail)))
                      (else tail)))))))


;;; Map F across lists, guaranteeing to go left-to-right.

  (define (imap-in-order f lis1 . lists)
    (check-arg procedure? f imap-in-order)
    (if (pair? lists)
        (let recur ((lists (cons lis1 lists)))
          (receive (cars cdrs) (%cars+cdrs lists)
            (if (pair? cars)
                (let ((x (apply f cars)))		; Do head first,
                  (ipair x (recur cdrs)))		; then tail.
                '())))

        ;; Fast path.
        (let recur ((lis lis1))
          (if (null-ilist? lis) lis
              (let ((tail (icdr lis))
                    (x (f (icar lis))))		; Do head ifirst,
                (ipair x (recur tail)))))))	; then tail.


;;; We extend IMAP to handle arguments of unequal ilength.
  (define imap imap-in-order)


;;; ifilter, iremove, ipartition
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; IFILTER, IREMOVE, IPARTITION do not
;;; disorder the elements of their argument.

  ;; This IFILTER shares the longest tail of L that has no deleted elements.
  ;; If Scheme had multi-continuation calls, they could be made more efficient.

  (define (ifilter pred lis)			; Sleazing with EQ? makes this
    (check-arg procedure? pred ifilter)		; one faster.
    (let recur ((lis lis))
      (if (null-ilist? lis) lis			; Use NOT-IPAIR? to handle dotted lists.
          (let ((head (icar lis))
                (tail (icdr lis)))
            (if (pred head)
                (let ((new-tail (recur tail)))	; Replicate the RECUR call so
                  (if (eq? tail new-tail) lis
                      (ipair head new-tail)))
                (recur tail))))))			; this one can be a tail call.


;;; Another version that shares longest tail.
                                        ;(define (ifilter pred lis)
                                        ;  (receive (ans no-del?)
                                        ;      ;; (recur l) returns L with (pred x) values filtered.
                                        ;      ;; It also returns a flag NO-DEL? if the returned value
                                        ;      ;; is EQ? to L, i.e. if it didn't have to delete anything.
                                        ;      (let recur ((l l))
                                        ;	(if (null-ilist? l) (values l #t)
                                        ;	    (let ((x  (icar l))
                                        ;		  (tl (icdr l)))
                                        ;	      (if (pred x)
                                        ;		  (receive (ans no-del?) (recur tl)
                                        ;		    (if no-del?
                                        ;			(values l #t)
                                        ;			(values (ipair x ans) #f)))
                                        ;		  (receive (ans no-del?) (recur tl) ; Delete X.
                                        ;		    (values ans #f))))))
                                        ;    ans))



;;; Answers share common tail with LIS where possible;
;;; the technique is slightly subtle.

  (define (ipartition pred lis)
    (check-arg procedure? pred ipartition)
    (let recur ((lis lis))
      (if (null-ilist? lis) (values lis lis)	; Use NOT-IPAIR? to handle dotted lists.
          (let ((elt (icar lis))
                (tail (icdr lis)))
            (receive (in out) (recur tail)
              (if (pred elt)
                  (values (if (ipair? out) (ipair elt in) lis) out)
                  (values in (if (ipair? in) (ipair elt out) lis))))))))




;;; Inline us, please.
  (define (iremove  pred l) (ifilter  (lambda (x) (not (pred x))) l))



;;; Here's the taxonomy for the IDELETE/IASSOC/IMEMBER functions.
;;; (I don't actually think these are the world's most important
;;; functions -- the procedural IFILTER/IREMOVE/IFIND/IFIND-TAIL variants
;;; are far more general.)
;;;
;;; Function			Action
;;; ---------------------------------------------------------------------------
;;; iremove pred lis		Delete by general predicate
;;; idelete x lis [=]		Delete by element comparison
;;;
;;; ifind pred lis		Search by general predicate
;;; ifind-tail pred lis		Search by general predicate
;;; imember x lis [=]		Search by element comparison
;;;
;;; iassoc key lis [=]		Search alist by key comparison
;;; ialist-delete key alist [=]	Alist-idelete by key comparison

  (define (idelete x lis . maybe-=)
    (let ((= (:optional maybe-= equal?)))
      (ifilter (lambda (y) (not (= x y))) lis)))

;;; Extended from R4RS to take an optional comparison argument.
  (define (imember x lis . maybe-=)
    (let ((= (:optional maybe-= equal?)))
      (ifind-tail (lambda (y) (= x y)) lis)))

;;; The IMEMBER and then IFIND-TAIL call should definitely
;;; be inlined for IMEMQ & IMEMV.
  (define (imemq    x lis) (imember x lis eq?))
  (define (imemv    x lis) (imember x lis eqv?))


;;; right-duplicate deletion
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; idelete-duplicates
;;;
;;; Beware -- these are N^2 algorithms. To efficiently iremove duplicates
;;; in long lists, sort the ilist to bring duplicates together, then use a
;;; linear-time algorithm to kill the dups. Or use an algorithm based on
;;; element-marking. The former gives you O(n lg n), the latter is linear.

  (define (idelete-duplicates lis . maybe-=)
    (let ((elt= (:optional maybe-= equal?)))
      (check-arg procedure? elt= idelete-duplicates)
      (let recur ((lis lis))
        (if (null-ilist? lis) lis
            (let* ((x (icar lis))
                   (tail (icdr lis))
                   (new-tail (recur (idelete x tail elt=))))
              (if (eq? tail new-tail) lis (ipair x new-tail)))))))

;;; alist stuff
;;;;;;;;;;;;;;;

;;; Extended from R4RS to itake an optional comparison argument.
  (define (iassoc x lis . maybe-=)
    (let ((= (:optional maybe-= equal?)))
      (ifind (lambda (entry) (= x (icar entry))) lis)))

  (define (ialist-cons key datum alist) (ipair (ipair key datum) alist))

  (define (alist-copy alist)
    (imap (lambda (elt) (ipair (icar elt) (icdr elt)))
          alist))

  (define (ialist-delete key alist . maybe-=)
    (let ((= (:optional maybe-= equal?)))
      (ifilter (lambda (elt) (not (= key (icar elt)))) alist)))


;;; ifind ifind-tail itake-while idrop-while ispan ibreak iany ievery ilist-index
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

  (define (ifind pred ilist)
    (cond ((ifind-tail pred ilist) => icar)
          (else #f)))

  (define (ifind-tail pred ilist)
    (check-arg procedure? pred ifind-tail)
    (let lp ((ilist ilist))
      (and (not (null-ilist? ilist))
           (if (pred (icar ilist)) ilist
               (lp (icdr ilist))))))

  (define (itake-while pred lis)
    (check-arg procedure? pred itake-while)
    (let recur ((lis lis))
      (if (null-ilist? lis) '()
          (let ((x (icar lis)))
            (if (pred x)
                (ipair x (recur (icdr lis)))
                '())))))

  (define (idrop-while pred lis)
    (check-arg procedure? pred idrop-while)
    (let lp ((lis lis))
      (if (null-ilist? lis) '()
          (if (pred (icar lis))
              (lp (icdr lis))
              lis))))

  (define (ispan pred lis)
    (check-arg procedure? pred ispan)
    (let recur ((lis lis))
      (if (null-ilist? lis) (values '() '())
          (let ((x (icar lis)))
            (if (pred x)
                (receive (prefix suffix) (recur (icdr lis))
                  (values (ipair x prefix) suffix))
                (values '() lis))))))

  (define (ibreak  pred lis) (ispan  (lambda (x) (not (pred x))) lis))
  (define (ievery pred lis1 . lists)
    (check-arg procedure? pred ievery)
    (if (pair? lists)

        ;; N-ary case
        (receive (heads tails) (%cars+cdrs (ipair lis1 lists))
          (or (not (ipair? heads))
              (let lp ((heads heads) (tails tails))
                (receive (next-heads next-tails) (%cars+cdrs tails)
                  (if (ipair? next-heads)
                      (and (apply pred heads) (lp next-heads next-tails))
                      (apply pred heads)))))) ; Last PRED app is tail call.

        ;; Fast path
        (or (null-ilist? lis1)
            (let lp ((head (icar lis1))  (tail (icdr lis1)))
              (if (null-ilist? tail)
                  (pred head)	; Last PRED app is tail call.
                  (and (pred head) (lp (icar tail) (icdr tail))))))))

  (define (iany pred ilis1 . ilists)
    (check-arg procedure? pred iany)
    (if (pair? ilists)

        ;; N-ary case
        (receive (heads tails) (%cars+cdrs (cons ilis1 ilists))
          (and (pair? heads)
               (let lp ((heads heads) (tails tails))
                 (receive (next-heads next-tails) (%cars+cdrs tails)
                   (if (pair? next-heads)
                       (or (apply pred heads) (lp next-heads next-tails))
                       (apply pred heads)))))) ; Last PRED app is tail call.

        ;; Fast path
        (and (not (null-ilist? ilis1))
             (let lp ((head (icar ilis1)) (tail (icdr ilis1)))
               (if (null-ilist? tail)
                   (pred head)            ; Last PRED app is tail call.
                   (or (pred head) (lp (icar tail) (icdr tail))))))))

  (define (ilist-index pred lis1 . lists)
    (check-arg procedure? pred ilist-index)
    (if (pair? lists)

        ;; N-ary case
        (let lp ((lists (cons lis1 lists)) (n 0))
          (receive (heads tails) (%cars+cdrs lists)
            (and (pair? heads)
                 (if (apply pred heads) n
                     (lp tails (+ n 1))))))

        ;; Fast path
        (let lp ((lis lis1) (n 0))
          (and (not (null-ilist? lis))
               (if (pred (icar lis)) n (lp (icdr lis) (+ n 1)))))))

;;; Reverse
;;;;;;;;;;;

  (define (ireverse lis) (ifold ipair '() lis)))
