(library (kstring)
  (export make-string-view string-view? string-view-end
          string-view-start kstring-length kstring-head
          kstring-tail string-view-ref kstring?
          kstring->string kstring-append kstring-getter
          kstring_join)
  (import (chezscheme))
; string-view record type (fast way to get a tail)
(define-record string-view
  ((immutable data)  ; underlying string
   (immutable start) ; start position (inclusive)
   (immutable end))) ; end position (exclusive)

(define string-view-ref
  (lambda (x y)
    (string-ref (string-view-data x) (+ (string-view-start x) y))))

(define kstring-tail
  (lambda (x)
    (if (string-view? x)
      (make-string-view
        (string-view-data x)
        (+ (string-view-start x) 1)
        (string-view-end x))
      (make-string-view
        x
        1
        (string-length x)))))

(define kstring-head
  (lambda (x)
    (if (string-view? x)
      (string-ref (string-view-data x) (string-view-start x))
      (string-ref x 0))))

(define kstring-length
  (lambda (x)
    (if (string-view? x)
      (- (string-view-end x) (string-view-start x))
      (string-length x))))

(define kstring?
  (lambda (x)
    (or (string-view? x) (string? x))))

(define kstring->string
  (lambda (x)
    (if (string-view? x)
      (substring (string-view-data x) (string-view-start x) (string-view-end x))
      x)))

; TODO depending on x, we could safely append data at the end
(define kstring-append
  (lambda (x y)
    (string-append (kstring->string x) (kstring->string y))))

(define kstring-getter
  (lambda (x)
    (if (string-view? x)
      string-view-ref
      string-ref)))

; Joins a list of strings with an intercalated separator
(define (kstring_join sep strs fst)
  (if (null? strs) 
    ""
    (kstring-append
      (if fst "" sep)
      (car strs)
      (kstring_join sep (cdr strs) #f)))))
