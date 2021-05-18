#!r6rs
;;; FILE       "intermediate-format-strings.sls"
;;; IMPLEMENTS SRFI-48: Intermediary format strings
;;;            http://srfi.schemers.org/srfi-48/srfi-48.html
;;; AUTHOR     Ken Dickey
;;; UPDATED    Syntax updated for R6RS February 2008 by Ken Dickey
;;; LANGUAGE   R6RS

;; Small changes by Derick Eddington to the beginning of `format'.

;;;Copyright (C) Kenneth A Dickey (2003). All Rights Reserved.
;;;
;;;Permission is hereby granted, free of charge, to any person
;;;obtaining a copy of this software and associated documentation
;;;files (the "Software"), to deal in the Software without
;;;restriction, including without limitation the rights to use,
;;;copy, modify, merge, publish, distribute, sublicense, and/or
;;;sell copies of the Software, and to permit persons to whom
;;;the Software is furnished to do so, subject to the following
;;;conditions:
;;;
;;;The above copyright notice and this permission notice shall
;;;be included in all copies or substantial portions of the Software.
;;;
;;;THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
;;;EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
;;;OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
;;;NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
;;;HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
;;;WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
;;;FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
;;;OTHER DEALINGS IN THE SOFTWARE.

; The implementation below requires SRFI-6 (Basic string ports), 
; and SRFI-38 (External Representation for Data With Shared Structure). 
 
(library (srfi :48 intermediate-format-strings)
  (export 
    format)
  (import
    (rnrs)
    (srfi :48 intermediate-format-strings compat)
    (srfi :6  basic-string-ports)
    (srfi :38 with-shared-structure))
  
  (define ascii-tab #\tab)
    
  (define (format arg0 . arg*)
    
    (define (problem msg . irts)
      (apply assertion-violation 'format msg irts))
    
    (define (_format port format-string args return-value)      

      (define (string-index str c)
        (let ( [len (string-length str)] )
          (let loop ( [i 0] )
            (cond ((= i len) #f)
                  ((eqv? c (string-ref str i)) i)
                  (else (loop (+ i 1)))))))
      
      (define (string-grow str len char)
        (let ( [off (- len (string-length str))] )
          (if (positive? off)
            (string-append (make-string off char) str)
            str)))
      
(define (compose-with-digits digits pre-str frac-str exp-str)
        (let ( [frac-len (string-length frac-str)] )
;;@@DEBUG
;;(format #t "~%@@(compose-with-digits digits=~s pre-str=~s frac-str=~s exp-str=~s ) ~%" digits pre-str frac-str exp-str)
          (cond	
            [(< frac-len digits) ;; grow frac part, pad with zeros
             (string-append pre-str "."
                            frac-str (make-string (- digits frac-len) #\0)
                            exp-str)
             ]
            [(= frac-len digits) ;; frac-part is exactly the right size
             (string-append pre-str "."
                            frac-str
                            exp-str)
             ]
            [else ;; must round to shrink frac-part
             (let* ( [first-part (substring frac-str 0 digits)]
                     [last-part  (substring frac-str digits frac-len)]
                     ;; NB: Scheme uses "Round to Even Rule" for .5
                     [rounded-frac
		     ;; NB: exact is r6; r5 is inexact->exact
                      (exact (round (string->number
                                        (string-append first-part "." last-part))))
                      ]
		     [rounded-frac-str (number->string rounded-frac)]
                     [rounded-frac-len (string-length rounded-frac-str)]
                     [carry? (and (not (zero? rounded-frac))
                                  (> rounded-frac-len digits))
                      ]
                     [new-frac
                      (let ( (pre-frac
                              (if carry? ;; trim leading "1"
                                  (substring rounded-frac-str 1 (min rounded-frac-len digits))
                                  (substring rounded-frac-str 0 (min rounded-frac-len digits))) ;; may be zero length
                              )
                           )
                        (if (< (string-length pre-frac) digits)
                            (string-grow pre-frac digits #\0)
                            pre-frac))
                      ]
                    )
;;@@DEBUG
;;(format #t "@@ first-part=~s last-part=~s rounded-frac=~s carry?=~s ~%" first-part last-part rounded-frac carry?)
               (string-append
                (if carry? (number->string (+ 1 (string->number pre-str))) pre-str)
                "."
                new-frac
                exp-str))]
            ) ) )
      
      
      (define (format-fixed number-or-string width digits) ; returns a string
;;@@DEBUG
;;(format #t "~%(format-fixed number-or-string=~s width=~s digits=~s)~%" number-or-string width digits)

        (cond
          [(string? number-or-string)
           (string-grow number-or-string width #\space)
           ]
          [(number? number-or-string)
           (let* ( [num (real-part number-or-string)]
                   [real (if digits (+ 0.0 num) num)]
                   [imag (imag-part number-or-string)]
                 )
             (cond
               [(not (zero? imag))
                (string-grow
                 (string-append (format-fixed real 0 digits)
                                (if (negative? imag) "" "+")
                                (format-fixed imag 0 digits)
                                "i")
                 width
                 #\space)
                ]
               [digits
                (let* ( [num-str   (number->string (if (rational? real)
                                                       (+ 0.0 real)
                                                       real))]
                        [dot-index (string-index  num-str #\.)]
                        [exp-index (string-index  num-str #\e)]
                        [length    (string-length num-str)]
                        [pre-string
                         (cond
                           ((and exp-index (not dot-index))
                            (substring num-str 0 exp-index)
                            )
                           (dot-index
                            (substring num-str 0 dot-index)
                            )
                           (else
                            num-str))
                         ]
                        [exp-string
                         (if exp-index (substring num-str exp-index length) "")
                         ]
                        [frac-string
                         (let ( (dot-idx (if dot-index dot-index -1)) )
                           (if exp-index
                               (substring num-str (+ dot-idx 1) exp-index)
                               (substring num-str (+ dot-idx 1) length)))
                         ]
                        )
                  (string-grow
                   (if dot-index
                     (compose-with-digits digits
                                          pre-string
                                          frac-string
                                          exp-string)
                     (string-append pre-string exp-string))
                   width
                   #\space)
                  )]
               [else ;; no digits
                (string-grow (number->string real) width #\space)])
             )]
          [else
           (error 'format "~F requires a number or a string" number-or-string)])
        )
      

      (define documentation-string
        "(format [<port>] <format-string> [<arg>...]) -- <port> is #t, #f or an output-port
OPTION  [MNEMONIC]      DESCRIPTION     -- Implementation Assumes ASCII Text Encoding
~H      [Help]          output this text
~A      [Any]           (display arg) for humans
~S      [Slashified]    (write arg) for parsers
~W      [WriteCircular] like ~s but outputs circular and recursive data structures
~~      [tilde]         output a tilde
~T      [Tab]           output a tab character
~%      [Newline]       output a newline character
~&      [Freshline]     output a newline character if the previous output was not a newline
~D      [Decimal]       the arg is a number which is output in decimal radix
~X      [heXadecimal]   the arg is a number which is output in hexdecimal radix
~O      [Octal]         the arg is a number which is output in octal radix
~B      [Binary]        the arg is a number which is output in binary radix
~w,dF   [Fixed]         the arg is a string or number which has width w and d digits after the decimal
~C      [Character]     charater arg is output by write-char
~_      [Space]         a single space character is output
~Y      [Yuppify]       the list arg is pretty-printed to the output
~?      [Indirection]   recursive format: next 2 args are format-string and list of arguments
~K      [Indirection]   same as ~?
"
        )
      
      (define (require-an-arg args)
        (when (null? args)
          (problem "too few arguments"))
        )
      
      (define (format-help p format-strg arglist)
        
        (letrec (
                 [length-of-format-string (string-length format-strg)]
                 
                 [anychar-dispatch       
                  (lambda (pos arglist last-was-newline) 
                    (if (>= pos length-of-format-string) 
                      arglist ; return unused args 
                      (let ( [char (string-ref format-strg pos)] ) 
                        (cond            
                          [(eqv? char #\~)   
                           (tilde-dispatch (+ pos 1) arglist last-was-newline)]
                          [else                   
                           (write-char char p)     
                           (anychar-dispatch (+ pos 1) arglist #f)        
                           ])             
                        )))     
                  ] ; end anychar-dispatch
                 
                 [has-newline?
                  (lambda (whatever last-was-newline)
                    (or (eqv? whatever #\newline)
                        (and (string? whatever)
                             (let ( [len (string-length whatever)] )
                               (if (zero? len)
                                 last-was-newline
                                 (eqv? #\newline (string-ref whatever (- len 1)))))))
                    )] ; end has-newline?
                 
                 [tilde-dispatch          
                  (lambda (pos arglist last-was-newline)     
                    (cond           
                      ((>= pos length-of-format-string)   
                       (write-char #\~ p) ; tilde at end of string is just output
                       arglist ; return unused args
                       )     
                      (else      
                       (case (char-upcase (string-ref format-strg pos)) 
                         ((#\A)       ; Any -- for humans
                          (require-an-arg arglist)
                          (let ( [whatever (car arglist)] )
                            (display whatever p)
                            (anychar-dispatch (+ pos 1) 
                                              (cdr arglist) 
                                              (has-newline? whatever last-was-newline))
                            ))
                         ((#\S)       ; Slashified -- for parsers
                          (require-an-arg arglist)
                          (let ( [whatever (car arglist)] )
                            (write whatever p)     
                            (anychar-dispatch (+ pos 1) 
                                              (cdr arglist) 
                                              (has-newline? whatever last-was-newline)) 
                            ))
                         ((#\W)
                          (require-an-arg arglist)
                          (let ( [whatever (car arglist)] )
                            (write-with-shared-structure whatever p)  ;; srfi-38
                            (anychar-dispatch (+ pos 1) 
                                              (cdr arglist) 
                                              (has-newline? whatever last-was-newline))
                            ))                           
                         ((#\D)       ; Decimal
                          (require-an-arg arglist)
                          (display (number->string (car arglist) 10) p)  
                          (anychar-dispatch (+ pos 1) (cdr arglist) #f)  
                          )            
                         ((#\X)       ; HeXadecimal
                          (require-an-arg arglist)
                          (display (number->string (car arglist) 16) p)
                          (anychar-dispatch (+ pos 1) (cdr arglist) #f)  
                          )             
                         ((#\O)       ; Octal
                          (require-an-arg arglist)
                          (display (number->string (car arglist)  8) p) 
                          (anychar-dispatch (+ pos 1) (cdr arglist) #f) 
                          )       
                         ((#\B)       ; Binary
                          (require-an-arg arglist)
                          (display (number->string (car arglist)  2) p)
                          (anychar-dispatch (+ pos 1) (cdr arglist) #f) 
                          )           
                         ((#\C)       ; Character
                          (require-an-arg arglist)
                          (write-char (car arglist) p) 
                          (anychar-dispatch (+ pos 1)
                                            (cdr arglist)
                                            (eqv? (car arglist) #\newline))  
                          )          
                         ((#\~)       ; Tilde  
                          (write-char #\~ p)   
                          (anychar-dispatch (+ pos 1) arglist #f) 
                          )            
                         ((#\%)       ; Newline   
                          (newline p) 
                          (anychar-dispatch (+ pos 1) arglist #t) 
                          )
                         ((#\&)      ; Freshline
                          (if (not last-was-newline) ;; (unless last-was-newline ..
                            (newline p))
                          (anychar-dispatch (+ pos 1) arglist #t)
                          )
                         ((#\_)       ; Space 
                          (write-char #\space p)   
                          (anychar-dispatch (+ pos 1) arglist #f)
                          )             
                         ((#\T)       ; Tab -- IMPLEMENTATION DEPENDENT ENCODING    
                          (write-char ascii-tab p)          
                          (anychar-dispatch (+ pos 1) arglist #f)     
                          )             
                         ((#\Y)       ; Pretty-print
                          (pretty-print (car arglist) p)
                          (anychar-dispatch (+ pos 1) (cdr arglist) #f)
                          )              
                         ((#\F)
                          (require-an-arg arglist)
                          (display (format-fixed (car arglist) 0 #f) p)
                          (anychar-dispatch (+ pos 1) (cdr arglist) #f)
                          )
                         ((#\0 #\1 #\2 #\3 #\4 #\5 #\6 #\7 #\8 #\9)
                          ;; gather "~w[,d]F" w and d digits
                          (let loop ( [index (+ pos 1)]
                                      [w-digits (list (string-ref format-strg pos))]
                                      [d-digits '()]
                                      [in-width? #t]
                                      )
                            (if (>= index length-of-format-string)
                              (problem "improper numeric format directive" format-strg)
                              (let ( [next-char (string-ref format-strg index)] )
                                (cond
                                  [(char-numeric? next-char)
                                   (if in-width?
                                     (loop (+ index 1)
                                           (cons next-char w-digits)
                                           d-digits
                                           in-width?)
                                     (loop (+ index 1)
                                           w-digits
                                           (cons next-char d-digits)
                                           in-width?))
                                   ]
                                  [(char=? (char-upcase next-char) #\F)
                                   (let ( [width
                                           (string->number
                                            (list->string
                                             (reverse w-digits)))
                                           ]
                                          [digits
                                           (if (zero? (length d-digits))
                                             #f
                                             (string->number
                                              (list->string (reverse d-digits))))]
                                          )
                                     (display
                                      (format-fixed (car arglist) width digits)
                                      p)
                                     (anychar-dispatch (+ index 1) (cdr arglist) #f))
                                   ]
                                  [(char=? next-char #\,)
                                   (if in-width?
                                     (loop (+ index 1)
                                           w-digits
                                           d-digits
                                           #f)
                                     (problem "too many commas in directive" format-strg))
                                   ]
                                  [else
                                   (problem "~w,dF directive ill-formed" format-strg)])))
                            ))
                         ((#\? #\K)       ; indirection -- take next arg as format string
                          (cond           ;  and following arg as list of format args
                            ((< (length arglist) 2)
                             (problem "less arguments than specified for ~?" arglist)
                             )
                            ((not (string? (car arglist)))
                             (problem "~? requires a string" (car arglist))
                             )
                            (else
                             (format-help p (car arglist) (cadr arglist))
                             (anychar-dispatch (+ pos 1) (cddr arglist) #f)
                             )))
                         ((#\H)      ; Help
                          (display documentation-string p)
                          (anychar-dispatch (+ pos 1) arglist #t)
                          )
                         (else                
                          (problem "unknown tilde escape" (string-ref format-strg pos)))
                         )))
                    )] ; end tilde-dispatch   
                 ) ; end letrec            
          
          ; format-help body
          (anychar-dispatch 0 arglist #f) 
          )) ; end format-help    
      
      ; _format body
      (let ( [unused-args (format-help port format-string args)] )
        (if (not (null? unused-args))
          (problem "unused arguments" unused-args)
          (return-value port))))
    
    ; format body
    (if (string? arg0)
      (_format (open-output-string) arg0 arg* get-output-string)
      (if (null? arg*)
        (problem "too few arguments" (list arg0))
        (let ([port (cond [(eq? arg0 #f) (open-output-string)]
                          [(eq? arg0 #t) (current-output-port)]
                          [(output-port? arg0) arg0]
                          [else (problem "bad output-port argument" arg0)])]
              [arg1 (car arg*)])
          (if (string? arg1)
            (_format port arg1 (cdr arg*) (if arg0 (lambda (ignore) (values)) get-output-string))
            (problem "not a string" arg1)))))) 
)
