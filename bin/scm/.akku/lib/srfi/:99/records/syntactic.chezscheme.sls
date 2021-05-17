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

(library (srfi :99 records syntactic)

  (export define-record-type)

  (import (for (rnrs base) run expand)
          (for (rnrs lists) run expand)
          (for (rnrs syntax-case) run expand)
          (srfi :99 records procedural))

  (define-syntax define-record-type
    (syntax-rules ()
     ((_ (type-name parent) constructor-spec predicate-spec . field-specs)
      (define-record-type-helper0
       type-name parent constructor-spec predicate-spec . field-specs))
     ((_ type-name constructor-spec predicate-spec . field-specs)
      (define-record-type-helper0
       type-name #f constructor-spec predicate-spec . field-specs))))

  (define-syntax define-record-type-helper0
    (lambda (x)

      ; Given syntax objects, passes them to helper macro.

      (define (construct-record-type-definitions
               tname fields parent cspec pred afields mfields)
        (let ()

          (define (frob x)
            (cond ((identifier? x)
                   x)
                  ((pair? x)
                   (cons (frob (car x)) (frob (cdr x))))
                  ((vector? x)
                   (vector-map frob x))
                  ((symbol? x)
                   (datum->syntax tname x))
                  (else
                   x)))

          #`(#,(frob #'define-record-type-helper)
             #,(frob tname)
             #,(frob fields)
             #,(frob parent)
             #,(frob cspec)
             #,(frob pred)
             #,(frob afields)
             #,(frob mfields))))

      ; Given a syntax object that represents a non-empty list,
      ; returns the syntax object for its first element.

      (define (syntax-car x)
        (syntax-case x ()
         ((x0 x1 ...)
          #'x0)))

      ; Given a syntax object that represents a non-empty list,
      ; returns the syntax object obtained by omitting the first
      ; element of that list.

      (define (syntax-cdr x)
        (syntax-case x ()
         ((x0 x1 ...)
          #'(x1 ...))))

      ; Given a syntax object that represents a non-empty list,
      ; returns the corresponding list of syntax objects.

      (define (syntax->list x)
        (syntax-case x ()
         (()
          '())
         ((x0 . x1)
          (cons #'x0 (syntax->list #'x1)))))

      (define (complain)
        (syntax-violation 'define-record-type "illegal syntax" x))

      ; tname and pname are always identifiers here.

      (syntax-case x ()
       ((_ tname pname constructor-spec predicate-spec . field-specs)
        (let* ((type-name (syntax->datum #'tname))
               (cspec (syntax->datum #'constructor-spec))
               (pspec (syntax->datum #'predicate-spec))
               (fspecs (syntax->datum #'field-specs))
               (type-name-string
                (begin (if (not (symbol? type-name))
                           (complain))
                       (symbol->string type-name)))
               (constructor-name
                (cond ((eq? cspec #f)
                       #'constructor-spec)
                      ((eq? cspec #t)
                       (datum->syntax
                        #'tname
                        (string->symbol
                         (string-append "make-" type-name-string))))
                      ((symbol? cspec)
                       #'constructor-spec)
                      ((and (pair? cspec) (symbol? (car cspec)))
                       (syntax-car #'constructor-spec))
                      (else (complain))))
               (constructor-args
                (cond ((pair? cspec)
                       (if (not (for-all symbol? cspec))
                           (complain)
                           (list->vector
                            (syntax->list (syntax-cdr #'constructor-spec)))))
                      (else #f)))
               (new-constructor-spec
                (if constructor-args
                    (list constructor-name constructor-args)
                    constructor-name))
               (predicate-name
                (cond ((eq? pspec #f)
                       #'predicate-spec)
                      ((eq? pspec #t)
                       (datum->syntax
                        #'tname
                        (string->symbol
                         (string-append type-name-string "?"))))
                      ((symbol? pspec)
                       #'predicate-spec)
                      (else (complain))))
               (field-specs
                (map (lambda (fspec field-spec)
                       (cond ((symbol? fspec)
                              (list 'immutable
                                    fspec
                                    (string->symbol
                                     (string-append
                                      type-name-string
                                      "-"
                                      (symbol->string fspec)))))
                             ((not (pair? fspec))
                              (complain))
                             ((not (list? fspec))
                              (complain))
                             ((not (for-all symbol? fspec))
                              (complain))
                             ((null? (cdr fspec))
                              (list 'mutable
                                    (car fspec)
                                    (string->symbol
                                     (string-append
                                      type-name-string
                                      "-"
                                      (symbol->string (car fspec))))
                                    (string->symbol
                                     (string-append
                                      type-name-string
                                      "-"
                                      (symbol->string (car fspec))
                                      "-set!"))))
                             ((null? (cddr fspec))
                              (list 'immutable
                                    (car fspec)
                                    (syntax-car (syntax-cdr field-spec))))
                             ((null? (cdddr fspec))
                              (list 'mutable
                                    (car fspec)
                                    (syntax-car (syntax-cdr field-spec))
                                    (syntax-car (syntax-cdr
                                                 (syntax-cdr field-spec)))))
                             (else (complain))))
                     fspecs
                     (syntax->list #'field-specs)))
  
               (fields (list->vector (map cadr field-specs)))
  
               (accessor-fields
                (map (lambda (x) (list (caddr x) (cadr x)))
                     (filter (lambda (x) (>= (length x) 3))
                             field-specs)))
  
               (mutator-fields
                (map (lambda (x) (list (cadddr x) (cadr x)))
                     (filter (lambda (x) (= (length x) 4))
                             field-specs))))
  
          (construct-record-type-definitions
           #'tname
           fields
           #'pname
           new-constructor-spec
           predicate-name
           accessor-fields
           mutator-fields))))))
  
  (define-syntax define-record-type-helper
    (syntax-rules ()
  
     ((_ type-name fields parent #f predicate
         ((accessor field) ...) ((mutator mutable-field) ...))
      (define-record-type-helper
       type-name fields parent ignored predicate
       ((accessor field) ...) ((mutator mutable-field) ...)))
  
     ((_ type-name fields parent constructor #f
         ((accessor field) ...) ((mutator mutable-field) ...))
      (define-record-type-helper
       type-name fields parent constructor ignored
       ((accessor field) ...) ((mutator mutable-field) ...)))
  
     ((_ type-name fields parent (constructor args) predicate
         ((accessor field) ...) ((mutator mutable-field) ...))
      (begin (define type-name (make-rtd 'type-name 'fields parent))
             (define constructor (rtd-constructor type-name 'args))
             (define predicate (rtd-predicate type-name))
             (define accessor (rtd-accessor type-name 'field))
             ...
             (define mutator (rtd-mutator type-name 'mutable-field))
             ...))
  
     ((_ type-name fields parent constructor predicate
         ((accessor field) ...) ((mutator mutable-field) ...))
      (begin (define type-name (make-rtd 'type-name 'fields parent))
             (define constructor (rtd-constructor type-name))
             (define predicate (rtd-predicate type-name))
             (define accessor (rtd-accessor type-name 'field))
             ...
             (define mutator (rtd-mutator type-name 'mutable-field))
             ...))))

  ) ; srfi :99 records syntactic
