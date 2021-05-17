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
  (import (rename (chezscheme)
                  (getenv get-environment-variable)))

  (define (make-weak-eq-hashtable-procedure weakness)
    (if (eq? weakness 'weak-key)
        make-weak-eq-hashtable
        (error 'make-weak-eq-hashtable "weakness not supported"
               weakness)))
    
  (define-syntax weak-eq-hashtables-supported
    (syntax-rules ()
      ((weak-eq-hashtables-supported) '(weak-key))))

  (define (make-weak-eqv-hashtable-procedure weakness)
    (if (eq? weakness 'weak-key)
        make-weak-eqv-hashtable
        (error 'make-weak-eqv-hashtable "weakness not supported"
               weakness)))
  
  (define-syntax weak-eqv-hashtables-supported
    (syntax-rules ()
      ((weak-eqv-hashtables-supported) '(weak-key))))
  
  (define (make-weak-hashtable-procedure weakness)
    (error 'make-weak-hashtable "weak hashtables not supported"))
  
  (define-syntax weak-hashtables-supported
    (syntax-rules ()
      ((weak-hashtables-supported) '())))

  (meta-cond
   ((let-values (((major minor sub-minor) (scheme-version-number)))
      (or (> major 9)
          (and (= major 9) (>= minor 5))))
    ;; has ephemeral eq- and eqv-hashtables
    
    (define (make-ephemeral-eq-hashtable-procedure weakness)
      (if (eq? weakness 'ephemeral-key)
          make-ephemeron-eq-hashtable
          (error 'make-ephemeral-eq-hashtable "weakness not supported"
                 weakness)))
    
    (define-syntax ephemeral-eq-hashtables-supported
      (syntax-rules ()
        ((ephemeral-eq-hashtables-supported) '(ephemeral-key))))
    
    (define (make-ephemeral-eqv-hashtable-procedure weakness)
      (if (eq? weakness 'ephemeral-key)
          make-ephemeron-eqv-hashtable
          (error 'make-ephemeral-eqv-hashtable "weakness not supported"
                 weakness)))
    
    (define-syntax ephemeral-eqv-hashtables-supported
      (syntax-rules ()
        ((ephemeral-eqv-hashtables-supported) '(ephemeral-key))))
    
    (define (make-ephemeral-hashtable-procedure weakness)
      (error 'make-ephemeral-hashtable  "weakness not supported" weakness))
    
    (define-syntax ephemeral-hashtables-supported
      (syntax-rules ()
        ((ephemeral-hashtables-supported) '(ephemeral-key))))
    
    (define (hashtable-weakness hashtable)
      (cond ((hashtable-weak? hashtable) 'weak-key)
            ((hashtable-ephemeron? hashtable) 'ephemeral-key)
            (else #f))))
   
   (else                                ; no ephemeral hashtables
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
    
    (define (hashtable-weakness hashtable)
      (cond ((hashtable-weak? hashtable) 'weak-key)
            (else #f)))))

  ;; Support for hashtable cells

  (define-syntax hashtable-cell-support
    (syntax-rules ()
      ((hashtable-cell-support) #t)))
  
  (define hashtable-cell-key car)
  (define hashtable-cell-value cdr)
  (define set-hashtable-cell-value! set-cdr!)

  (define (random-integer seed)
    (fxmod (fxxor (random seed)
                  (fx* 3 (fxdiv (random (time-nanosecond (current-time)))
                                4)))
           seed)))
