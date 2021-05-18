;;; args-fold.scm - a program argument processor
;;;
;;; Copyright (c) 2002 Anthony Carrico
;;;
;;; All rights reserved.
;;;
;;; Redistribution and use in source and binary forms, with or without
;;; modification, are permitted provided that the following conditions
;;; are met:
;;; 1. Redistributions of source code must retain the above copyright
;;;    notice, this list of conditions and the following disclaimer.
;;; 2. Redistributions in binary form must reproduce the above copyright
;;;    notice, this list of conditions and the following disclaimer in the
;;;    documentation and/or other materials provided with the distribution.
;;; 3. The name of the authors may not be used to endorse or promote products
;;;    derived from this software without specific prior written permission.
;;;
;;; THIS SOFTWARE IS PROVIDED BY THE AUTHORS ``AS IS'' AND ANY EXPRESS OR
;;; IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
;;; OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
;;; IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY DIRECT, INDIRECT,
;;; INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT
;;; NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
;;; DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
;;; THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
;;; (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
;;; THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

;;; NOTE: This implementation uses the following SRFIs:
;;;   "SRFI 9: Defining Record Types"
;;;   "SRFI 11: Syntax for receiving multiple values"
;;;
;;; NOTE: The scsh-utils and Chicken implementations use regular
;;; expressions. These might be easier to read and understand.

#|
(define option #f)
(define option-names #f)
(define option-required-arg? #f)
(define option-optional-arg? #f)
(define option-processor #f)
(define option? #f)

(let ()
  (define-record-type option-type
    ($option names required-arg? optional-arg? processor)
    $option?
    (names $option-names)
    (required-arg? $option-required-arg?)
    (optional-arg? $option-optional-arg?)
    (processor $option-processor))
  (set! option $option)
  (set! option-names $option-names)
  (set! option-required-arg? $option-required-arg?)
  (set! option-optional-arg? $option-optional-arg?)
  (set! option-processor $option-processor)
  (set! option? $option?))
|#

(define args-fold
  (lambda (args
           options
           unrecognized-option-proc
           operand-proc
           . seeds)
    (letrec
        ((find
          (lambda (l ?)
            (cond ((null? l) #f)
                  ((? (car l)) (car l))
                  (else (find (cdr l) ?)))))
         (find-option
          ;; ISSUE: This is a brute force search. Could use a table.
          (lambda (name)
            (find
             options
             (lambda (option)
               (find
                (option-names option)
                (lambda (test-name)
                  (equal? name test-name)))))))
         (scan-short-options
          (lambda (index shorts args seeds)
            (if (= index (string-length shorts))
                (scan-args args seeds)
                (let* ((name (string-ref shorts index))
                       (option (or (find-option name)
                                   (option (list name)
                                           #f
                                           #f
                                           unrecognized-option-proc))))
                  (cond ((and (< (+ index 1) (string-length shorts))
                              (or (option-required-arg? option)
                                  (option-optional-arg? option)))
                         (let-values
                             ((seeds (apply (option-processor option)
                                            option
                                            name
                                            (substring
                                             shorts
                                             (+ index 1)
                                             (string-length shorts))
                                            seeds)))
                           (scan-args args seeds)))
                        ((and (option-required-arg? option)
                              (pair? args))
                         (let-values
                             ((seeds (apply (option-processor option)
                                            option
                                            name
                                            (car args)
                                            seeds)))
                           (scan-args (cdr args) seeds)))
                        (else
                         (let-values
                             ((seeds (apply (option-processor option)
                                            option
                                            name
                                            #f
                                            seeds)))
                           (scan-short-options
                            (+ index 1)
                            shorts
                            args
                            seeds))))))))
         (scan-operands
          (lambda (operands seeds)
            (if (null? operands)
                (apply values seeds)
                (let-values ((seeds (apply operand-proc
                                           (car operands)
                                           seeds)))
                  (scan-operands (cdr operands) seeds)))))
         (scan-args
          (lambda (args seeds)
            (if (null? args)
                (apply values seeds)
                (let ((arg (car args))
                      (args (cdr args)))
                  ;; NOTE: This string matching code would be simpler
                  ;; using a regular expression matcher.
                  (cond
                   (;; (rx bos "--" eos)
                    (string=? "--" arg)
                    ;; End option scanning:
                    (scan-operands args seeds))
                   (;;(rx bos
                    ;;    "--"
                    ;;    (submatch (+ (~ "=")))
                    ;;    "="
                    ;;    (submatch (* any)))
                    (and (> (string-length arg) 4)
                         (char=? #\- (string-ref arg 0))
                         (char=? #\- (string-ref arg 1))
                         (not (char=? #\= (string-ref arg 2)))
                         (let loop ((index 3))
                           (cond ((= index (string-length arg))
                                  #f)
                                 ((char=? #\= (string-ref arg index))
                                  index)
                                 (else
                                  (loop (+ 1 index))))))
                    ;; Found long option with arg:
                    => (lambda (=-index)
                         (let*-values
                             (((name)
                               (substring arg 2 =-index))
                              ((option-arg)
                               (substring arg
                                          (+ =-index 1)
                                          (string-length arg)))
                              ((option)
                               (or (find-option name)
                                   (option (list name)
                                           #t
                                           #f
                                           unrecognized-option-proc)))
                              (seeds
                               (apply (option-processor option)
                                      option
                                      name
                                      option-arg
                                      seeds)))
                           (scan-args args seeds))))
                   (;;(rx bos "--" (submatch (+ any)))
                    (and (> (string-length arg) 3)
                         (char=? #\- (string-ref arg 0))
                         (char=? #\- (string-ref arg 1)))
                    ;; Found long option:
                    (let* ((name (substring arg 2 (string-length arg)))
                           (option (or (find-option name)
                                       (option
                                        (list name)
                                        #f
                                        #f
                                        unrecognized-option-proc))))
                      (if (and (option-required-arg? option)
                               (pair? args))
                          (let-values
                              ((seeds (apply (option-processor option)
                                             option
                                             name
                                             (car args)
                                             seeds)))
                            (scan-args (cdr args) seeds))
                          (let-values
                              ((seeds (apply (option-processor option)
                                             option
                                             name
                                             #f
                                             seeds)))
                            (scan-args args seeds)))))
                   (;; (rx bos "-" (submatch (+ any)))
                    (and (> (string-length arg) 1)
                         (char=? #\- (string-ref arg 0)))
                    ;; Found short options
                    (let ((shorts (substring arg 1 (string-length arg))))
                      (scan-short-options 0 shorts args seeds)))
                   (else
                    (let-values ((seeds (apply operand-proc arg seeds)))
                      (scan-args args seeds)))))))))
      (scan-args args seeds))))
