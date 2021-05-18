#!r6rs
(library (srfi :126 helpers helpers)
  (export make-weak-eq-hashtable-procedure weak-eq-hashtables-supported
          make-weak-eqv-hashtable-procedure weak-eqv-hashtables-supported
          make-weak-hashtable-procedure weak-hashtables-supported
          make-ephemeral-eq-hashtable-procedure ephemeral-eq-hashtables-supported
          make-ephemeral-eqv-hashtable-procedure
          ephemeral-eqv-hashtables-supported
          make-ephemeral-hashtable-procedure ephemeral-hashtables-supported
          hashtable-values hashtable-weakness
          hashtable-cell-support hashtable-cell hashtable-cell-key
          hashtable-cell-value set-hashtable-cell-value!
          get-environment-variable random-integer)
  (import (rnrs) (srfi :39)
          (only (srfi :27) random-integer)
          (only (srfi :98) get-environment-variable))
  
  (define (make-weak-eq-hashtable-procedure weakness)
    (error 'make-weak-eq-hashtable "weak eq hashtables not supported"))
  
  (define-syntax weak-eq-hashtables-supported
    (syntax-rules ()
      ((weak-eq-hashtables-supported) '())))
  
  (define (make-weak-eqv-hashtable-procedure weakness)
    (error 'make-weak-eqv-hashtable "weak eqv hashtables not supported"))
  
  (define-syntax weak-eqv-hashtables-supported
    (syntax-rules ()
      ((weak-eqv-hashtables-supported) '())))
  
  (define (make-weak-hashtable-procedure weakness)
    (error 'make-weak-hashtable "weak hashtables not supported"))
  
  (define-syntax weak-hashtables-supported
    (syntax-rules ()
      ((weak-hashtables-supported) '())))

  (define (make-ephemeral-eq-hashtable-procedure weakness)
    (error 'make-ephemeral-hashtable "ephemeral eq hashtables not supported"))
  
  (define-syntax ephemeral-eq-hashtables-supported
    (syntax-rules ()
      ((ephemeral-eq-hashtables-supported) '())))
  
  (define (make-ephemeral-eqv-hashtable-procedure weakness)
    (error 'make-ephemeral-hashtable "ephemeral eqv hashtables not supported"))
  
  (define-syntax ephemeral-eqv-hashtables-supported
    (syntax-rules ()
      ((ephemeral-eqv-hashtables-supported) '())))
  
  (define (make-ephemeral-hashtable-procedure weakness)
    (error 'make-ephemeral-hashtable "ephemeral hashtables not supported"))
  
  (define-syntax ephemeral-hashtables-supported
    (syntax-rules ()
      ((ephemeral-hashtables-supported) '())))
  
  (define (hashtable-values hashtable)
    (let-values (((keys values) (hashtable-entries hashtable)))
      values))

  (define (hashtable-weakness hashtable) #f)

  (define-syntax hashtable-cell-support
    (syntax-rules ()
      ((hashtable-cell-support) #f)))
  
  (define (hashtable-cell hashtable)
    (error 'hashtable-cell "hashtable cells not supported"))

  (define (hashtable-cell-key cell)
    (error 'hashtable-cell "hashtable cells not supported"))
  
  (define (hashtable-cell-value cell)
    (error 'hashtable-cell "hashtable cells not supported"))
  
  (define (set-hashtable-cell-value! cell value)
    (error 'hashtable-cell "hashtable cells not supported")))
