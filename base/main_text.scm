; Use text data-structure instead of strings
(import (srfi :135))

; Short alias to vector-ref
(define get vector-ref)

; Converts a Kind word to a native integer
(define (word-to-u16 w)
  (define (word-to-u16-go i w x)
    (cond ((= 16 i) x)
      ((symbol=? 'Word.e (get w 0)) (word-to-u16-go (+ i 1) (vector 'Word.e) x))
      ((symbol=? 'Word.o (get w 0)) (word-to-u16-go (+ i 1) (get w 1) x))
      ((symbol=? 'Word.i (get w 0)) (word-to-u16-go (+ i 1) (get w 1) (fxior x (fxarithmetic-shift-left 1 i))))))
  (word-to-u16-go 0 w 0))

; Converts a native integer to a Kind word
(define (u16-to-word x)
  (define (u16-to-word-go i x w)
    (if (= 16 i) w (u16-to-word-go (+ i 1) x
      (if (= (fxand (fxarithmetic-shift-right x (- 15 i)) 1) 0)
        (vector 'Word.o w)
        (vector 'Word.i w)))))
  (u16-to-word-go 0 x (vector 'Word.e)))

; Joins a list of strings with an intercalated separator
(define (string_join sep strs fst)
  (if (null? strs) 
    ""
    (textual-append
      (if fst "" sep)
      (car strs)
      (string_join sep (cdr strs) #f))))

; Returns the last index that chr occurs in str, -1 otherwise
(define (last_index_of chr str idx)
  (if (= idx (text-length str))
    -1
    (let ((rest (last_index_of chr str (+ idx 1))))
      (if (char=? (text-ref str idx) chr)
        (max idx rest)
        rest))))

; Returns the first index that chr occurs in str, -1 otherwise
(define (first_index_of chr str idx)
  (if (= idx (textual-length str))
    -1
    (if (char=? (text-ref str idx) chr)
      idx
      (first_index_of chr str (+ idx 1)))))

; Splits a string using an identifier
(define (split_at_first chr str)
  (let ((split_idx (first_index_of chr str 0)))
    (if (= split_idx -1)
      str
      (cons
        (subtext str 0 split_idx)
        (subtext str (+ split_idx 1) (text-length str))))))

; Splits a string using an identifier
(define (split_at_last chr str)
  (let ((split_idx (last_index_of chr str 0)))
    (if (= split_idx -1)
      str
      (cons
        (subtext str 0 split_idx)
        (subtext str (+ split_idx 1) (text-length str))))))

; Converts a date to a string, in milliseconds
(define (time_to_string time)
  (string->text
    (number->string
      (+ (* (time-second time) 1000)
        (div (time-nanosecond time) 1000000)))))

; Prints a text with a newline
(define (print txt)
  (display txt)
  (display "
"))

; Gets a line from stdin
(define (get_line)
  (let ((port (current-input-port)))
    (get-line port)))

; Deletes a file
(define (del_file file)
  (delete-file file))

; Gets the contents of a file as a string
; If it doesn't exist, returns empty
(define (get_file file)
  (if (file-exists? file)
    (let ((port (open-input-file file)))
      (let ((text (get-string-all port)))
        (begin
          (close-input-port port)
          text)))
    ""))

; Sets the contents of a file
(define (set_file file text)
  (system (textual-append "mkdir -p " (car (split_at_last #\/ file))))
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
  (time_to_string (file-modification-time file)))

; Returns the current time
(define (get_time)
  (time_to_string (current-time)))

; Performs a single Kind IO action
(define (io_action name)
  (case name
    ("print" (lambda (x) (print (textual->string x))))
    ("put_string" (lambda (x) (display (textual->string x))))
    ("get_line" (lambda (x) (get_line)))
    ("del_file" (lambda (x) (del_file x)))
    ("get_file" (lambda (x) (get_file x)))
    ("set_file" (lambda (x) (let ((file_text (split_at_first #\= x))) (set_file (car file_text) (cdr file_text)))))
    ("get_dir" (lambda (x) (get_dir x)))
    ("get_file_mtime" (lambda (x) (get_file_mtime x)))
    ("get_time" (lambda (x) (get_time)))))

; Runs a Kind IO program
(define (run_io io)
  (case (get io 0)
    ('IO.end (get io 0))
    ('IO.ask (let (
      (io_query (get io 1))
      (io_param (get io 2))
      (io_then (get io 3)))
      (run_io (io_then ((io_action io_query) io_param)))))))

(define Bool-inst (lambda (x) ((x #t) #f)))
(define Bool-elim (lambda (x) (let ((self0 x)) (case self0 (#t (let () (lambda (c0) (lambda (c1) c0)))) (#f (let () (lambda (c0) (lambda (c1) c1))))))))
(define Nat-inst (lambda (x) ((x 0) (lambda (x0) (+ x0 1)))))
(define Nat-elim (lambda (x) (let ((self0 x)) (case (= self0 0) (#t (let () (lambda (c0) (lambda (c1) c0)))) (#f (let ((f0 (- self0 1))) (lambda (c0) (lambda (c1) (c1 f0)))))))))
(define U16-inst (lambda (x) (x (lambda (x0) (word-to-u16 x0)))))
(define U16-elim (lambda (x) (let ((self0 x)) (case #t (#t (let ((f0 (u16-to-word self0))) (lambda (c0) (c0 f0))))))))
(define String-inst (lambda (x) ((x (string->text "")) (lambda (x0) (lambda (x1) (textual-append (make-text 1 (integer->char x0)) x1))))))
(define String-elim (lambda (x) (let ((self0 x)) (case (= (text-length self0) 0) (#t (let () (lambda (c0) (lambda (c1) c0)))) (#f (let ((f0 (char->integer (text-ref self0 0)))(f1 (let ((_str_ self0)) (subtext _str_ 1 (text-length _str_))))) (lambda (c0) (lambda (c1) ((c1 f0) f1)))))))))
(define ($Test.main) (let ((thisfst$0 (textual->text "aaa"))) (let ((thissnd$1 (textual->text "aaa"))) (let ((ok$2 '())) '()))))
(define Test.main ($Test.main))
(run_io Test.main)
