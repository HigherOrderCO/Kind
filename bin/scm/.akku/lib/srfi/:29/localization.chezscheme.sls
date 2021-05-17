#!r6rs
(library (srfi :29 localization)
  (export current-language current-country current-locale-details
          declare-bundle! store-bundle store-bundle! load-bundle!
          localized-template)
  (import (rnrs) (srfi :6))

  (define (current-locale-details . args)
    (error 'current-locale-details
           "procedure not supplied by reference implementation"))

  (define-syntax store-bundle (identifier-syntax store-bundle!))

  ;; reference implementation taken from srfi :29 documenation

  ;; Copyright (C) Scott G. Miller (2002). All Rights Reserved.
  ;;
  ;; This document and translations of it may be copied and furnished to
  ;; others, and derivative works that comment on or otherwise explain it or
  ;; assist in its implementation may be prepared, copied, published and
  ;; distributed, in whole or in part, without restriction of any kind,
  ;; provided that the above copyright notice and this paragraph are included
  ;; on all such copies and derivative works. However, this document itself may
  ;; not be modified in any way, such as by removing the copyright notice or
  ;; references to the Scheme Request For Implementation process or editors,
  ;; except as needed for the purpose of developing SRFIs in which case the
  ;; procedures for copyrights defined in the SRFI process must be followed, or
  ;; as required to translate it into languages other than English.
  ;;
  ;; The limited permissions granted above are perpetual and will not be
  ;; revoked by the authors or their successors or assigns.
  ;; 
  ;; This document and the information contained herein is provided on an "AS
  ;; IS" basis and THE AUTHOR AND THE SRFI EDITORS DISCLAIM ALL WARRANTIES,
  ;; EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO ANY WARRANTY THAT THE USE
  ;; OF THE INFORMATION HEREIN WILL NOT INFRINGE ANY RIGHTS OR ANY IMPLIED
  ;; WARRANTIES OF MERCHANTABILITY OR FITNESS FOR A PARTICULAR PURPOSE.
  ;;

  ;; The association list in which bundles will be stored
  (define *localization-bundles* '())

  ;; The current-language and current-country functions provided
  ;; here must be rewritten for each Scheme system to default to the
  ;; actual locale of the session
  (define current-language
    (let ((current-language-value 'en))
      (lambda args
        (if (null? args)
            current-language-value
            (set! current-language-value (car args))))))

  (define current-country
    (let ((current-country-value 'us))
      (lambda args
        (if (null? args)
            current-country-value
            (set! current-country-value (car args))))))

  ;; The load-bundle! and store-bundle! both return #f in this
  ;; reference implementation.  A compliant implementation need
  ;; not rewrite these procedures.
  (define load-bundle!
    (lambda (bundle-specifier)
      #f))

  (define store-bundle!
    (lambda (bundle-specifier)
      #f))

  ;; Declare a bundle of templates with a given bundle specifier
  (define declare-bundle!
    (letrec ((remove-old-bundle
               (lambda (specifier bundle)
                 (cond ((null? bundle) '())
                       ((equal? (caar bundle) specifier)
                        (cdr bundle))
                       (else (cons (car bundle)
                                   (remove-old-bundle specifier
                                                      (cdr bundle))))))))
      (lambda (bundle-specifier bundle-assoc-list)
        (set! *localization-bundles*
              (cons (cons bundle-specifier bundle-assoc-list)
                    (remove-old-bundle bundle-specifier
                                       *localization-bundles*))))))

  ;;Retrieve a localized template given its package name and a template name
  (define localized-template
    (letrec ((rdc
               (lambda (ls)
                 (if (null? (cdr ls))
                     '()
                     (cons (car ls) (rdc (cdr ls))))))
             (find-bundle
               (lambda (specifier template-name)
                 (cond ((assoc specifier *localization-bundles*) =>
                                                                 (lambda (bundle) bundle))
                       ((null? specifier) #f)
                       (else (find-bundle (rdc specifier)
                                          template-name))))))
      (lambda (package-name template-name)
        (let loop ((specifier (cons package-name
                                    (list (current-language)
                                          (current-country)))))
          (and (not (null? specifier))
               (let ((bundle (find-bundle specifier template-name)))
                 (and bundle
                      (cond ((assq template-name bundle) => cdr)
                            ((null? (cdr specifier)) #f)
                            (else (loop (rdc specifier)))))))))))

  ;;An SRFI-28 and SRFI-29 compliant version of format.  It requires
  ;;SRFI-23 for error reporting.
  (define format
    (lambda (format-string . objects)
      (let ((buffer (open-output-string)))
        (let loop ((format-list (string->list format-string))
                   (objects objects)
                   (object-override #f))
          (cond ((null? format-list) (get-output-string buffer))
                ((char=? (car format-list) #\~)
                 (cond ((null? (cdr format-list))
                        (error 'format "Incomplete escape sequence"))
                       ((char-numeric? (cadr format-list))
                        (let posloop ((fl (cddr format-list))
                                      (pos (string->number
                                             (string (cadr format-list)))))
                          (cond ((null? fl)
                                 (error 'format "Incomplete escape sequence"))
                                ((and (eq? (car fl) '#\@)
                                      (null? (cdr fl)))
                                 (error 'format "Incomplete escape sequence"))
                                ((and (eq? (car fl) '#\@)
                                      (eq? (cadr fl) '#\*))
                                 (loop (cddr fl) objects (list-ref objects pos)))
                                (else
                                  (posloop (cdr fl)
                                           (+ (* 10 pos)
                                              (string->number
                                                (string (car fl)))))))))
                       (else
                         (case (cadr format-list)
                           ((#\a)
                            (cond (object-override
                                    (begin
                                      (display object-override buffer)
                                      (loop (cddr format-list) objects #f)))
                                  ((null? objects)
                                   (error 'format "No value for escape sequence"))
                                  (else
                                    (begin
                                      (display (car objects) buffer)
                                      (loop (cddr format-list)
                                            (cdr objects) #f)))))
                           ((#\s)
                            (cond (object-override
                                    (begin
                                      (display object-override buffer)
                                      (loop (cddr format-list) objects #f)))
                                  ((null? objects)
                                   (error 'format "No value for escape sequence"))
                                  (else
                                    (begin
                                      (write (car objects) buffer)
                                      (loop (cddr format-list)
                                            (cdr objects) #f)))))
                           ((#\%)
                            (if object-override
                                (error 'format "Escape sequence following positional override does not require a value"))
                            (display #\newline buffer)
                            (loop (cddr format-list) objects #f))
                           ((#\~)
                            (if object-override
                                (error 'format "Escape sequence following positional override does not require a value"))
                            (display #\~ buffer)
                            (loop (cddr format-list) objects #f))
                           (else
                             (error 'format "Unrecognized escape sequence"))))))
                (else (display (car format-list) buffer)
                      (loop (cdr format-list) objects #f)))))))
  )
