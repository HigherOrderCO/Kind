;;;; Implementation of SRFI 129 titlecase functions

;; Returns #t if argument is a titlecase character, #f if not
(define (char-title-case? ch)
  (let* ((codepoint (char->integer ch))
         (result (assq codepoint titlecase-chars)))
    (if result #t #f)))

;; Returns the single-character titlecase mapping of argument
(define (char-titlecase ch)
  (let* ((codepoint (char->integer ch))
        (result (assq codepoint title-single-map)))
    (if result
      (integer->char (cadr result))
      (char-upcase ch))))

;; Returns #t if a character is caseless, otherwise #f
(define (char-caseless? ch)
  (not (or (char-lower-case? ch) (char-upper-case? ch) (char-title-case? ch))))

;; Push a list onto another list in reverse order
(define (reverse-push new old)
  (if (null? new)
    old
    (reverse-push (cdr new) (cons (car new) old))))

;; Returns the string titlecase mapping of argument
(define (string-titlecase str)
  (let loop ((n 0) (result '()))
    (if (= n (string-length str))
       (apply string (map integer->char (reverse result)))
       (let* ((ch (string-ref str n)) (codepoint (char->integer ch)))
         (if (or (= n 0) (char-caseless? (string-ref str (- n 1))))
           ; ch must be titlecased
           (let ((multi-title (assq codepoint title-multiple-map)))
             (if multi-title
               ; ch has multiple- or single-character titlecase mapping
               (loop (+ n 1) (reverse-push (cdr multi-title) result))
               ; ch has single-character uppercase mapping
               (loop (+ n 1) (reverse-push (list (char->integer (char-upcase ch))) result))))
           ; ch must be lowercased
           (let ((multi-downcase (assq codepoint lower-multiple-map)))
             (if multi-downcase
               ; ch has multiple-character lowercase mapping
               (loop (+ n 1) (reverse-push (cdr multi-downcase) result))
               ; ch has single-character lowercase mapping
               (loop (+ n 1) (reverse-push (list (char->integer (char-downcase ch))) result)))))))))

