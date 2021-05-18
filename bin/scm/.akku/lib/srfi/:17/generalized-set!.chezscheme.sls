#!r6rs
;; SRFI-17 implementation for Chez Scheme
;;
;; Generalized getter and setter for built-in Chez Scheme types.
;; Uses Chez Scheme's define-proprety and syntactic environment to
;; provide generalized reference and set! syntax.  Relies on helpers
;; 
;; Copyright (c) 2018 - 2020 Andrew W. Keep

(library (srfi :17 generalized-set!)
  (export getter-with-setter set!
          car cdr
          caar cadr cdar cddr
          caaar caadr cadar caddr cdaar cdadr cddar cdddr
          caaaar caaadr caadar caaddr cadaar cadadr caddar cadddr
          cdaaar cdaadr cdadar cdaddr cddaar cddadr cdddar cddddr
          string-ref vector-ref
          bytevector-ieee-double-native-ref bytevector-ieee-double-ref
          bytevector-ieee-single-native-ref bytevector-ieee-single-ref
          bytevector-s16-native-ref bytevector-s16-ref bytevector-s24-ref
          bytevector-s32-native-ref bytevector-s32-ref bytevector-s40-ref
          bytevector-s48-ref bytevector-s56-ref bytevector-s64-native-ref
          bytevector-s64-ref bytevector-s8-ref bytevector-sint-ref
          bytevector-u16-native-ref bytevector-u16-ref bytevector-u24-ref
          bytevector-u32-native-ref bytevector-u32-ref bytevector-u40-ref
          bytevector-u48-ref bytevector-u56-ref bytevector-u64-native-ref
          bytevector-u64-ref bytevector-u8-ref bytevector-uint-ref
          foreign-ref fxvector-ref hashtable-ref eq-hashtable-ref
          symbol-hashtable-ref list-ref)
  (import (rename (chezscheme) (set! cs:set!)) (srfi :17 helpers))

  (define getter-with-setter-prop)

  (define-syntax getter-with-setter
    (syntax-rules ()
      [(_ getter setter)
       (define-property getter getter-with-setter-prop #'setter)]))

  (define-syntax getters-and-setters
    (syntax-rules ()
      [(_ [getter setter] ...)
       (begin (getter-with-setter getter setter) ...)]))

  (define-syntax set!
    (lambda (x)
      (syntax-case x ()
        [(_ (getter e0 e1 ...) v)
         (lambda (r)
           (with-syntax ([setter (r #'getter #'getter-with-setter-prop)])
             (if (datum setter)
                 #'(setter e0 e1 ... v)
                 (syntax-violation 'set! "no setter configured for getter" #'getter x))))]
        [(_ x v) (identifier? #'x) #'(cs:set! x v)])))

  (getters-and-setters
    [car                               set-car!]
    [cdr                               set-cdr!]
    [caar                              $set-caar!]
    [cadr                              $set-cadr!]
    [cdar                              $set-cdar!]
    [cddr                              $set-cddr!]
    [caaar                             $set-caaar!]
    [caadr                             $set-caadr!]
    [cadar                             $set-cadar!]
    [caddr                             $set-caddr!]
    [cdaar                             $set-cdaar!]
    [cdadr                             $set-cdadr!]
    [cddar                             $set-cddar!]
    [cdddr                             $set-cdddr!]
    [caaaar                            $set-caaaar!]
    [caaadr                            $set-caaadr!]
    [caadar                            $set-caadar!]
    [caaddr                            $set-caaddr!]
    [cadaar                            $set-cadaar!]
    [cadadr                            $set-cadadr!]
    [caddar                            $set-caddar!]
    [cadddr                            $set-cadddr!]
    [cdaaar                            $set-cdaaar!]
    [cdaadr                            $set-cdaadr!]
    [cdadar                            $set-cdadar!]
    [cdaddr                            $set-cdaddr!]
    [cddaar                            $set-cddaar!]
    [cddadr                            $set-cddadr!]
    [cdddar                            $set-cdddar!]
    [cddddr                            $set-cddddr!]
    [string-ref                        string-set!]
    [vector-ref                        vector-set!]
    [bytevector-ieee-double-native-ref bytevector-ieee-double-native-set!]
    [bytevector-ieee-double-ref        $bytevector-ieee-double-set!]
    [bytevector-ieee-single-native-ref bytevector-ieee-single-native-set!]
    [bytevector-ieee-single-ref        $bytevector-ieee-single-set!]
    [bytevector-s16-native-ref         bytevector-s16-native-set!]
    [bytevector-s16-ref                $bytevector-s16-set!]
    [bytevector-s24-ref                $bytevector-s24-set!]
    [bytevector-s32-native-ref         bytevector-s32-native-set!]
    [bytevector-s32-ref                $bytevector-s32-set!]
    [bytevector-s40-ref                $bytevector-s40-set!]
    [bytevector-s48-ref                $bytevector-s48-set!]
    [bytevector-s56-ref                $bytevector-s56-set!]
    [bytevector-s64-native-ref         bytevector-s64-native-set!]
    [bytevector-s64-ref                $bytevector-s64-set!]
    [bytevector-s8-ref                 bytevector-s8-set!]
    [bytevector-sint-ref               $bytevector-sint-set!]
    [bytevector-u16-native-ref         bytevector-u16-native-set!]
    [bytevector-u16-ref                $bytevector-u16-set!]
    [bytevector-u24-ref                $bytevector-u24-set!]
    [bytevector-u32-native-ref         bytevector-u32-native-set!]
    [bytevector-u32-ref                $bytevector-u32-set!]
    [bytevector-u40-ref                $bytevector-u40-set!]
    [bytevector-u48-ref                $bytevector-u48-set!]
    [bytevector-u56-ref                $bytevector-u56-set!]
    [bytevector-u64-native-ref         bytevector-u64-native-set!]
    [bytevector-u64-ref                $bytevector-u64-set!]
    [bytevector-u8-ref                 bytevector-u8-set!]
    [bytevector-uint-ref               $bytevector-uint-set!]
    [foreign-ref                       foreign-set!]
    [fxvector-ref                      fxvector-set!]
    [hashtable-ref                     $hashtable-set!]
    [eq-hashtable-ref                  $eq-hashtable-set!]
    [symbol-hashtable-ref              $symbol-hashtable-set!]
    [list-ref                          $list-set!]))
