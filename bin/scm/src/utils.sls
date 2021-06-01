#!chezscheme
(library (utils) (export suffix? prefix? run-all run_io run_kind print-lines)
  (import (chezscheme)
          (kstring))

(define suffix?
  (lambda (str suff)
    (let ((suff_length (string-length suff))
          (str_length (string-length str)))
      (if (<= suff_length str_length)
        (string=?
          (substring str (- str_length suff_length) str_length)
          suff)
        #f))))

(define prefix?
  (lambda (str pref)
    (let ((pref_length (string-length pref))
          (str_length (string-length str)))
      (if (<= pref_length str_length)
        (string=?
          (substring str 0 pref_length)
          pref)
        #f))))

; Returns the last index that chr occurs in str, -1 otherwise
(define (last_index_of chr kstr idx)
  (let ((str (kstring->string kstr)))
    (if (= idx (kstring-length str))
      -1
      (let ((rest (last_index_of chr str (+ idx 1))))
        (if (char=? (string-ref str idx) chr)
          (max idx rest)
          rest)))))

; Returns the first index that chr occurs in str, -1 otherwise
(define (first_index_of chr kstr idx)
  (let ((str (kstring->string kstr)))
    (if (= idx (string-length str))
      -1
      (if (char=? (string-ref str idx) chr)
        idx
        (first_index_of chr str (+ idx 1))))))

; Splits a string using an identifier
(define (split_at_first chr kstr)
  (let ((str (kstring->string kstr)))
    (let ((split_idx (first_index_of chr str 0)))
      (if (= split_idx -1)
        str
        (cons
          (substring str 0 split_idx)
          (substring str (+ split_idx 1) (string-length str)))))))

; Splits a string using an identifier
(define (split_at_last chr kstr)
  (let ((str (kstring->string kstr)))
    (let ((split_idx (last_index_of chr str 0)))
      (if (= split_idx -1)
        str
        (cons
          (substring str 0 split_idx)
          (substring str (+ split_idx 1) (string-length str)))))))

; Converts a date to a string, in milliseconds
(define (time_to_string time)
  (number->string
    (+ (* (time-second time) 1000)
      (div (time-nanosecond time) 1000000))))

; Prints a text with a newline
(define (print txt)
  (display (kstring->string txt))
  (display "
"))

; Gets a line from stdin
(define (get_line)
  (let ((port (current-input-port)))
    (get-line port)))

; Deletes a file
(define (del_file file)
  (delete-file (kstring->string file)))

; Gets the contents of a file as a string
; If it doesn't exist, returns empty
(define (get_file ifile)
  (let ((file (kstring->string ifile)))
    (if (file-exists? file)
      (let ((port (open-input-file file)))
        (let ((text (get-string-all port)))
          (begin
            (close-input-port port)
            text)))
      "")))

; Sets the contents of a file
(define (set_file file text)
  (system (string-append "mkdir -p " (car (split_at_last #\/ file))))
  (if (file-exists? file) (delete-file file))
  (let ((port (open-output-file file)))
    (begin
      (display text port)
      (close-output-port port))))

; Returns a list of files in a directory
(define (get_dir path)
  (directory-list path)) 

; Returns the time a file was modified. TODO: test on Windows/Linux
(define (get_file_mtime file)
  (time_to_string (file-modification-time (kstring->string file))))

; Returns the current time
(define (get_time)
  (time_to_string (current-time)))

; Performs a single Kind IO action
(define (io_action iname)
  (let ((name (kstring->string iname)))
  (case name
    ("print" (lambda (x) (print x)))
    ("put_string" (lambda (x) (display x)))
    ("get_line" (lambda (x) (get_line)))
    ("del_file" (lambda (x) (del_file x)))
    ("get_file" (lambda (x) (get_file x)))
    ("set_file" (lambda (x) (let ((file_text (split_at_first #\= (kstring->string x)))) (set_file (car file_text) (cdr file_text)))))
    ("get_dir" (lambda (x) (get_dir x)))
    ("get_file_mtime" (lambda (x) (get_file_mtime x)))
    ("get_time" (lambda (x) (get_time)))
    ("request" (lambda (x) ""))
    (else (display (string-append "IO action not found: " name))))))

; Runs a Kind IO program
(define (run_io io)
  (case (vector-ref io 0)
    ('IO.end (vector-ref io 1))
    ('IO.ask (let (
      (io_query (vector-ref io 1))
      (io_param (vector-ref io 2))
      (io_then (vector-ref io 3)))
      (run_io (io_then ((io_action io_query) io_param)))))))

(define (run_kind term)
  (if
    (and
      (vector? term)
      (or
        (eq? (vector-ref term 0) 'IO.ask)
        (eq? (vector-ref term 0) 'IO.end)))
    (run_io term)
    (print term)))

(define (print-lines args)
  (unless (null? args)
    (display (car args))
    (newline)
    (print-lines (cdr args))))

(define run-all
    (lambda (p)
      (let ((code (get-datum p)))
        (unless (eq? code #!eof)
          (compile code)
          (run-all p))))))

; from https://github.com/gwatt/chez-exe/blob/master/utils.ss#L44
;(define-syntax param-args
;  (lambda (x)
;    (syntax-case x ()
;      [(_ arg-list-expr cases ...)
;       #`(let loop ([args arg-list-expr])
;           (if (null? args)
;               '()
;               (case (car args)
;                 #,@(map (lambda (c)
;                           (syntax-case c ()
;                             [(#t case-expr func) #'(case-expr (func #t) (loop (cdr args)))]
;                             [(#f case-expr func) #'(case-expr (func) (loop (cdr args)))]
;                             [(case-expr func)
;                              #'(case-expr
;                                  (if (null? (cdr args))
;                                      (errorf 'param-args "Missing required argument for ~a" 'case-expr))
;                                  (func (cadr args))
;                                  (loop (cddr args)))]))
;                      #'(cases ...))
;                   [else args])))])))
