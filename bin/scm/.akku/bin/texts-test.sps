#!/usr/bin/env scheme-script
;; Copied by Akku from "./srfi-135/texts-test.sps" !#
#!r6rs
(import
  (scheme base)
  (scheme write)
  (scheme char)
  (srfi :135))
(define (writeln . xs) (for-each display xs) (newline))
(define (fail token . more)
  (newline)
  (writeln "Error: test failed: " token)
  (display " ")
  (write current-test)
  (newline)
  #f)
(define current-test #f)
(define-syntax OR
  (syntax-rules ()
    [(_ expr1 expr ...)
     (begin (set! current-test 'expr1) (or expr1 expr ...))]))
(define (as-text . args)
  (textual-concatenate
    (map (lambda (x)
           (cond
             [(text? x) x]
             [(string? x) (string->text x)]
             [(char? x) (text x)]
             [else (error "as-text: illegal argument" x)]))
         args)))
(define (result=? str txt)
  (and (text? txt) (textual=? str txt)))
(cond-expand
  ((or sagittarius chibi full-unicode-strings full-unicode)
    (define ABC
      (as-text (list->string (map integer->char '(945 946 947)))))
    (define ABCDEF
      (as-text
        (list->string
          (map integer->char '(192 98 199 100 201 102)))))
    (define DEFABC
      (as-text
        (list->string
          (map integer->char '(100 201 102 192 98 199)))))
    (define eszett (integer->char 223))
    (define fuss (text #\F #\u eszett))
    (define chaos0
      (as-text
        (list->string (map integer->char '(926 913 927 931)))))
    (define chaos1
      (as-text
        (list->string (map integer->char '(958 945 959 962)))))
    (define chaos2
      (as-text
        (list->string (map integer->char '(958 945 959 963)))))
    (define beyondBMP
      (as-text
        (list->string
          (map integer->char
               '(97 192 959 119873 119059 119056 122))))))
  (else
    (define ABC (as-text "abc"))
    (define ABCDEF (as-text "ABCdef"))
    (define DEFABC (as-text "defabc"))))
(or (text? (text)) (fail 'text?))
(or (not (text? (string))) (fail 'text?))
(or (not (text? #\a)) (fail 'text?))
(or (textual? (text)) (fail 'textual?))
(or (textual? (string)) (fail 'textual?))
(or (not (textual? #\a)) (fail 'textual?))
(or (textual-null? (text)) (fail 'textual-null?))
(or (not (textual-null? ABC)) (fail 'textual-null?))
(or (eqv?
      #t
      (textual-every (lambda (c) (if (char? c) c #f)) (text)))
    (fail 'textual-every))
(or (eqv?
      #\c
      (textual-every
        (lambda (c) (if (char? c) c #f))
        (as-text "abc")))
    (fail 'textual-every))
(or (eqv?
      #f
      (textual-every
        (lambda (c) (if (char>? c #\b) c #f))
        (as-text "abc")))
    (fail 'textual-every))
(or (eqv?
      #\c
      (textual-every
        (lambda (c) (if (char>? c #\b) c #f))
        (as-text "abc")
        2))
    (fail 'textual-every))
(or (eqv?
      #t
      (textual-every
        (lambda (c) (if (char>? c #\b) c #f))
        (as-text "abc")
        1
        1))
    (fail 'textual-every))
(or (eqv?
      #f
      (textual-any (lambda (c) (if (char? c) c #f)) (text)))
    (fail 'textual-any))
(or (eqv?
      #\a
      (textual-any
        (lambda (c) (if (char? c) c #f))
        (as-text "abc")))
    (fail 'textual-any))
(or (eqv?
      #\c
      (textual-any
        (lambda (c) (if (char>? c #\b) c #f))
        (as-text "abc")))
    (fail 'textual-any))
(or (eqv?
      #\c
      (textual-any
        (lambda (c) (if (char>? c #\b) c #f))
        (as-text "abc")
        2))
    (fail 'textual-any))
(or (eqv?
      #f
      (textual-any
        (lambda (c) (if (char>? c #\b) c #f))
        (as-text "abc")
        0
        2))
    (fail 'textual-any))
(or (eqv?
      #t
      (textual-every (lambda (c) (if (char? c) c #f)) ""))
    (fail 'textual-every))
(or (eqv?
      #\c
      (textual-every (lambda (c) (if (char? c) c #f)) "abc"))
    (fail 'textual-every))
(or (eqv?
      #f
      (textual-every (lambda (c) (if (char>? c #\b) c #f)) "abc"))
    (fail 'textual-every))
(or (eqv?
      #\c
      (textual-every
        (lambda (c) (if (char>? c #\b) c #f))
        "abc"
        2))
    (fail 'textual-every))
(or (eqv?
      #t
      (textual-every
        (lambda (c) (if (char>? c #\b) c #f))
        "abc"
        1
        1))
    (fail 'textual-every))
(or (eqv?
      #f
      (textual-any (lambda (c) (if (char? c) c #f)) ""))
    (fail 'textual-any))
(or (eqv?
      #\a
      (textual-any (lambda (c) (if (char? c) c #f)) "abc"))
    (fail 'textual-any))
(or (eqv?
      #\c
      (textual-any (lambda (c) (if (char>? c #\b) c #f)) "abc"))
    (fail 'textual-any))
(or (eqv?
      #\c
      (textual-any (lambda (c) (if (char>? c #\b) c #f)) "abc" 2))
    (fail 'textual-any))
(or (eqv?
      #f
      (textual-any
        (lambda (c) (if (char>? c #\b) c #f))
        "abc"
        0
        2))
    (fail 'textual-any))
(or (result=?
      ""
      (text-tabulate
        (lambda (i) (integer->char (+ i (char->integer #\a))))
        0))
    (fail 'text-tabulate))
(or (result=?
      "abc"
      (text-tabulate
        (lambda (i) (integer->char (+ i (char->integer #\a))))
        3))
    (fail 'text-tabulate))
(or (result=?
      "abc"
      (let ([p (open-input-string "abc")])
        (text-unfold
          eof-object?
          values
          (lambda (x) (read-char p))
          (read-char p))))
    (fail 'text-unfold))
(or (result=? "" (text-unfold null? car cdr '()))
    (fail 'text-unfold))
(or (result=?
      "abc"
      (text-unfold null? car cdr (string->list "abc")))
    (fail 'text-unfold))
(or (result=?
      "def"
      (text-unfold null? car cdr '() (string->text "def")))
    (fail 'text-unfold))
(or (result=?
      "defabcG"
      (text-unfold null? car cdr (string->list "abc")
        (string->text "def")
        (lambda (x) (if (null? x) (text #\G) ""))))
    (fail 'text-unfold))
(or (result=? "" (text-unfold-right null? car cdr '()))
    (fail 'text-unfold-right))
(or (result=?
      "cba"
      (text-unfold-right null? car cdr (string->list "abc")))
    (fail 'text-unfold-right))
(or (result=?
      "def"
      (text-unfold-right null? car cdr '() (string->text "def")))
    (fail 'text-unfold-right))
(or (result=?
      "Gcbadef"
      (text-unfold-right null? car cdr (string->list "abc") (string->text "def")
        (lambda (x) (if (null? x) (text #\G) ""))))
    (fail 'text-unfold-right))
(or (result=? "def" (text-unfold null? car cdr '() "def"))
    (fail 'text-unfold))
(or (result=?
      "defabcG"
      (text-unfold null? car cdr (string->list "abc") "def"
        (lambda (x) (if (null? x) "G" ""))))
    (fail 'text-unfold))
(or (result=?
      "dabcG"
      (text-unfold null? car cdr (string->list "abc") #\d
        (lambda (x) (if (null? x) "G" ""))))
    (fail 'text-unfold))
(or (result=?
      (string-append "%=" (make-string 200 #\*) "A B C D E F G H I J K L M "
        "N O P Q R S T U V W X Y Z "
        (make-string
          (* 200 (- (char->integer #\a) (char->integer #\Z) 1))
          #\*)
        "abcdefghijklmnopqrstuvwxyz" " ")
      (text-unfold (lambda (n) (char>? (integer->char n) #\z))
        (lambda (n)
          (let ([c (integer->char n)])
            (cond
              [(char<=? #\a c #\z) c]
              [(char<=? #\A c #\Z) (text c #\space)]
              [else (make-string 200 #\*)])))
        (lambda (n) (+ n 1)) (char->integer #\@) "%="
        (lambda (n) #\space)))
    (fail 'text-unfold))
(or (result=?
      "def"
      (text-unfold-right null? car cdr '() "def"))
    (fail 'text-unfold-right))
(or (result=?
      "Gcbadef"
      (text-unfold-right null? car cdr (string->list "abc") "def"
        (lambda (x) (if (null? x) "G" ""))))
    (fail 'text-unfold-right))
(or (result=?
      "Gcbad"
      (text-unfold-right null? car cdr (string->list "abc") #\d
        (lambda (x) (if (null? x) "G" ""))))
    (fail 'text-unfold-right))
(or (result=?
      (string-append " "
        (list->string
          (reverse (string->list "abcdefghijklmnopqrstuvwxyz")))
        (make-string
          (* 200 (- (char->integer #\a) (char->integer #\Z) 1))
          #\*)
        "Z Y X W V U T S R Q P O N " "M L K J I H G F E D C B A "
        (make-string 200 #\*) "%=")
      (text-unfold-right (lambda (n) (char>? (integer->char n) #\z))
        (lambda (n)
          (let ([c (integer->char n)])
            (cond
              [(char<=? #\a c #\z) c]
              [(char<=? #\A c #\Z) (text c #\space)]
              [else (make-string 200 #\*)])))
        (lambda (n) (+ n 1)) (char->integer #\@) "%="
        (lambda (n) #\space)))
    (fail 'text-unfold-right))
(or (result=?
      " The English alphabet: abcdefghijklmnopqrstuvwxyz "
      (text-unfold-right (lambda (n) (< n (char->integer #\A)))
        (lambda (n) (char-downcase (integer->char n)))
        (lambda (n) (- n 1)) (char->integer #\Z) #\space
        (lambda (n) " The English alphabet: ")))
    (fail 'text-unfold-right))
(or (let ([txt (textual->text "str")])
      (and (text? txt) (textual=? txt "str")))
    (fail 'textual->text))
(or (let ([txt (textual->text (text #\s #\t #\r))])
      (and (text? txt) (textual=? txt "str")))
    (fail 'textual->text))
(or (string=? "" (textual->string (text)))
    (fail 'textual->string))
(or (string=? "" (textual->string (text) 0))
    (fail 'textual->string))
(or (string=? "" (textual->string (text) 0 0))
    (fail 'textual->string))
(or (string=? "abc" (textual->string (text #\a #\b #\c)))
    (fail 'textual->string))
(or (string=? "" (textual->string (text #\a #\b #\c) 3))
    (fail 'textual->string))
(or (string=? "bc" (textual->string (text #\a #\b #\c) 1 3))
    (fail 'textual->string))
(or (string=? "" (textual->string ""))
    (fail 'textual->string))
(or (string=? "" (textual->string "" 0))
    (fail 'textual->string))
(or (string=? "" (textual->string "" 0 0))
    (fail 'textual->string))
(or (string=? "abc" (textual->string "abc"))
    (fail 'textual->string))
(or (string=? "" (textual->string "abc" 3))
    (fail 'textual->string))
(or (string=? "bc" (textual->string "abc" 1 3))
    (fail 'textual->string))
(or (equal? '#() (textual->vector (text)))
    (fail 'textual->vector))
(or (equal? '#() (textual->vector (text) 0))
    (fail 'textual->vector))
(or (equal? '#() (textual->vector (text) 0 0))
    (fail 'textual->vector))
(or (equal?
      '#(#\a #\b #\c)
      (textual->vector (text #\a #\b #\c)))
    (fail 'textual->vector))
(or (equal? '#() (textual->vector (text #\a #\b #\c) 3))
    (fail 'textual->vector))
(or (equal?
      '#(#\b #\c)
      (textual->vector (text #\a #\b #\c) 1 3))
    (fail 'textual->vector))
(or (equal? '#() (textual->vector ""))
    (fail 'textual->vector))
(or (equal? '#() (textual->vector "" 0))
    (fail 'textual->vector))
(or (equal? '#() (textual->vector "" 0 0))
    (fail 'textual->vector))
(or (equal? '#(#\a #\b #\c) (textual->vector "abc"))
    (fail 'textual->vector))
(or (equal? '#() (textual->vector "abc" 3))
    (fail 'textual->vector))
(or (equal? '#(#\b #\c) (textual->vector "abc" 1 3))
    (fail 'textual->vector))
(or (equal? '() (textual->list (text)))
    (fail 'textual->list))
(or (equal? '() (textual->list (text) 0))
    (fail 'textual->list))
(or (equal? '() (textual->list (text) 0 0))
    (fail 'textual->list))
(or (equal?
      '(#\a #\b #\c)
      (textual->list (text #\a #\b #\c)))
    (fail 'textual->list))
(or (equal? '() (textual->list (text #\a #\b #\c) 3))
    (fail 'textual->list))
(or (equal?
      '(#\b #\c)
      (textual->list (text #\a #\b #\c) 1 3))
    (fail 'textual->list))
(or (equal? '() (textual->list "")) (fail 'textual->list))
(or (equal? '() (textual->list "" 0)) (fail 'textual->list))
(or (equal? '() (textual->list "" 0 0))
    (fail 'textual->list))
(or (equal? '(#\a #\b #\c) (textual->list "abc"))
    (fail 'textual->list))
(or (equal? '() (textual->list "abc" 3))
    (fail 'textual->list))
(or (equal? '(#\b #\c) (textual->list "abc" 1 3))
    (fail 'textual->list))
(or (result=? "" (string->text "")) (fail 'string->text))
(or (result=? "" (string->text "" 0)) (fail 'string->text))
(or (result=? "" (string->text "" 0 0))
    (fail 'string->text))
(or (result=? "abc" (string->text "abc"))
    (fail 'string->text))
(or (result=? "bc" (string->text "abc" 1))
    (fail 'string->text))
(or (result=? "" (string->text "abc" 3))
    (fail 'string->text))
(or (result=? "b" (string->text "abc" 1 2))
    (fail 'string->text))
(or (result=? "bc" (string->text "abc" 1 3))
    (fail 'string->text))
(or (result=? "" (vector->text '#())) (fail 'vector->text))
(or (result=? "" (vector->text '#() 0))
    (fail 'vector->text))
(or (result=? "" (vector->text '#() 0 0))
    (fail 'vector->text))
(or (result=? "abc" (vector->text '#(#\a #\b #\c)))
    (fail 'vector->text))
(or (result=? "bc" (vector->text '#(#\a #\b #\c) 1))
    (fail 'vector->text))
(or (result=? "" (vector->text '#(#\a #\b #\c) 3))
    (fail 'vector->text))
(or (result=? "b" (vector->text '#(#\a #\b #\c) 1 2))
    (fail 'vector->text))
(or (result=? "bc" (vector->text '#(#\a #\b #\c) 1 3))
    (fail 'vector->text))
(or (result=? "" (list->text '())) (fail 'list->text))
(or (result=? "" (list->text '() 0)) (fail 'list->text))
(or (result=? "" (list->text '() 0 0)) (fail 'list->text))
(or (result=? "abc" (list->text '(#\a #\b #\c)))
    (fail 'list->text))
(or (result=? "bc" (list->text '(#\a #\b #\c) 1))
    (fail 'list->text))
(or (result=? "" (list->text '(#\a #\b #\c) 3))
    (fail 'list->text))
(or (result=? "b" (list->text '(#\a #\b #\c) 1 2))
    (fail 'list->text))
(or (result=? "bc" (list->text '(#\a #\b #\c) 1 3))
    (fail 'list->text))
(or (result=? "" (reverse-list->text '()))
    (fail 'reverse-list->text))
(or (result=? "cba" (reverse-list->text '(#\a #\b #\c)))
    (fail 'reverse-list->text))
(or (equal? '#vu8(97 98 99) (textual->utf8 (as-text "abc")))
    (fail 'textual->utf8))
(or (equal? '#vu8(97 98 99) (textual->utf8 "abc"))
    (fail 'textual->utf8))
(or (equal?
      '#vu8(97 98 99 121 121 121 122 122 122)
      (textual->utf8 (as-text "xxxabcyyyzzz") 3))
    (fail 'textual->utf8))
(or (equal?
      '#vu8(97 98 99 121 121 121 122 122 122)
      (textual->utf8 "xxxabcyyyzzz" 3))
    (fail 'textual->utf8))
(or (equal?
      '#vu8(97 98 99)
      (textual->utf8 (as-text "xxxabcyyyzzz") 3 6))
    (fail 'textual->utf8))
(or (equal?
      '#vu8(97 98 99)
      (textual->utf8 "xxxabcyyyzzz" 3 6))
    (fail 'textual->utf8))
(define assumed-endianness
  (let ([bom (textual->utf16 (as-text ""))])
    (or (eqv? (bytevector-length bom) 2) (fail 'textual->utf16))
    (if (= (bytevector-u8-ref bom 0) 254) 'big 'little)))
(or (equal?
      (if (eq? assumed-endianness 'big)
          '#vu8(254 255 0 97 0 98 0 99)
          '#vu8(255 254 97 0 98 0 99 0))
      (textual->utf16 (as-text "abc")))
    (fail 'textual->utf16))
(or (equal?
      (if (eq? assumed-endianness 'big)
          '#vu8(254 255 0 97 0 98 0 99)
          '#vu8(255 254 97 0 98 0 99 0))
      (textual->utf16 "abc"))
    (fail 'textual->utf16))
(or (equal?
      (if (eq? assumed-endianness 'big)
          '#vu8(254 255 0 97 0 98 0 99 0 121 0 121 0 121 0 122 0 122 0
                122)
          '#vu8(255 254 97 0 98 0 99 0 121 0 121 0 121 0 122 0 122 0
                122 0))
      (textual->utf16 (as-text "xxxabcyyyzzz") 3))
    (fail 'textual->utf16))
(or (equal?
      (if (eq? assumed-endianness 'big)
          '#vu8(254 255 0 97 0 98 0 99 0 121 0 121 0 121 0 122 0 122 0
                122)
          '#vu8(255 254 97 0 98 0 99 0 121 0 121 0 121 0 122 0 122 0
                122 0))
      (textual->utf16 "xxxabcyyyzzz" 3))
    (fail 'textual->utf16))
(or (equal?
      (if (eq? assumed-endianness 'big)
          '#vu8(254 255 0 97 0 98 0 99)
          '#vu8(255 254 97 0 98 0 99 0))
      (textual->utf16 (as-text "xxxabcyyyzzz") 3 6))
    (fail 'textual->utf16))
(or (equal?
      (if (eq? assumed-endianness 'big)
          '#vu8(254 255 0 97 0 98 0 99)
          '#vu8(255 254 97 0 98 0 99 0))
      (textual->utf16 "xxxabcyyyzzz" 3 6))
    (fail 'textual->utf16))
(or (equal?
      '#vu8(0 97 0 98 0 99)
      (textual->utf16be (as-text "abc")))
    (fail 'textual->utf16be))
(or (equal? '#vu8(0 97 0 98 0 99) (textual->utf16be "abc"))
    (fail 'textual->utf16be))
(or (equal?
      '#vu8(0 97 0 98 0 99 0 121 0 121 0 121 0 122 0 122 0 122)
      (textual->utf16be (as-text "xxxabcyyyzzz") 3))
    (fail 'textual->utf16be))
(or (equal?
      '#vu8(0 97 0 98 0 99 0 121 0 121 0 121 0 122 0 122 0 122)
      (textual->utf16be "xxxabcyyyzzz" 3))
    (fail 'textual->utf16be))
(or (equal?
      '#vu8(0 97 0 98 0 99)
      (textual->utf16be (as-text "xxxabcyyyzzz") 3 6))
    (fail 'textual->utf16be))
(or (equal?
      '#vu8(0 97 0 98 0 99)
      (textual->utf16be "xxxabcyyyzzz" 3 6))
    (fail 'textual->utf16be))
(or (equal?
      '#vu8(97 0 98 0 99 0)
      (textual->utf16le (as-text "abc")))
    (fail 'textual->utf16le))
(or (equal? '#vu8(97 0 98 0 99 0) (textual->utf16le "abc"))
    (fail 'textual->utf16le))
(or (equal?
      '#vu8(97 0 98 0 99 0 121 0 121 0 121 0 122 0 122 0 122 0)
      (textual->utf16le (as-text "xxxabcyyyzzz") 3))
    (fail 'textual->utf16le))
(or (equal?
      '#vu8(97 0 98 0 99 0 121 0 121 0 121 0 122 0 122 0 122 0)
      (textual->utf16le "xxxabcyyyzzz" 3))
    (fail 'textual->utf16le))
(or (equal?
      '#vu8(97 0 98 0 99 0)
      (textual->utf16le (as-text "xxxabcyyyzzz") 3 6))
    (fail 'textual->utf16le))
(or (equal?
      '#vu8(97 0 98 0 99 0)
      (textual->utf16le "xxxabcyyyzzz" 3 6))
    (fail 'textual->utf16le))
(or (result=? "abc" (utf8->text '#vu8(97 98 99)))
    (fail 'textual->utf8))
(or (result=?
      "abcyyyzzz"
      (utf8->text
        '#vu8(0 1 2 97 98 99 121 121 121 122 122 122)
        3))
    (fail 'textual->utf8))
(or (result=?
      "abc"
      (utf8->text '#vu8(41 42 43 97 98 99 100 101 102) 3 6))
    (fail 'textual->utf8))
(or (result=?
      "abc"
      (utf16->text '#vu8(254 255 0 97 0 98 0 99)))
    (fail 'textual->utf16))
(or (result=?
      "abc"
      (utf16->text '#vu8(255 254 97 0 98 0 99 0)))
    (fail 'textual->utf16))
(or (result=? "abc" (utf16->text (textual->utf16 "abc") 2))
    (fail 'textual->utf16))
(or (result=?
      "bcdef"
      (utf16->text (textual->utf16 "abcdef") 4))
    (fail 'textual->utf16))
(or (result=?
      "bcd"
      (utf16->text (textual->utf16 "abcdef") 4 10))
    (fail 'textual->utf16))
(or (result=? "abc" (utf16be->text '#vu8(0 97 0 98 0 99)))
    (fail 'textual->utf16be))
(or (result=?
      "bc"
      (utf16be->text (textual->utf16be "abc") 2))
    (fail 'textual->utf16be))
(or (result=?
      "bcd"
      (utf16be->text (textual->utf16be "abcdef") 2 8))
    (fail 'textual->utf16be))
(or (result=? "abc" (utf16le->text '#vu8(97 0 98 0 99 0)))
    (fail 'textual->utf16le))
(or (result=?
      "bc"
      (utf16le->text (textual->utf16le "abc") 2))
    (fail 'textual->utf16le))
(or (result=?
      "bcd"
      (utf16le->text (textual->utf16le "abcdef") 2 8))
    (fail 'textual->utf16le))
(cond-expand
  ((or sagittarius chibi full-unicode-strings)
    (or (equal?
          '#vu8(97 195 128 206 191 240 157 145 129 240 157 132 147 240
                157 132 144 122)
          (textual->utf8 beyondBMP))
        (fail 'textual->utf8))
    (let ([bv (textual->utf16 beyondBMP)])
      (or (equal?
            bv
            '#vu8(254 255 0 97 0 192 3 191 216 53 220 65 216 52 221 19
                  216 52 221 16 0 122))
          (equal?
            bv
            '#vu8(255 254 97 0 192 0 191 3 53 216 65 220 52 216 19 221
                  52 216 16 221 122 0))
          (fail 'textual->utf16)))
    (or (equal?
          '#vu8(0 97 0 192 3 191 216 53 220 65 216 52 221 19 216 52
                221 16 0 122)
          (textual->utf16be beyondBMP))
        (fail 'textual->utf8))
    (or (equal?
          '#vu8(97 0 192 0 191 3 53 216 65 220 52 216 19 221 52 216 16
                221 122 0)
          (textual->utf16le beyondBMP))
        (fail 'textual->utf8))
    (or (textual=?
          beyondBMP
          (utf8->text
            '#vu8(97 195 128 206 191 240 157 145 129 240 157 132 147 240
                  157 132 144 122)))
        (fail 'utf8->text))
    (or (textual=?
          beyondBMP
          (utf16->text (textual->utf16 beyondBMP)))
        (fail 'utf16->text))
    (or (textual=?
          beyondBMP
          (utf16->text (textual->utf16 beyondBMP) 2))
        (fail 'utf16->text))
    (or (textual=?
          beyondBMP
          (utf16be->text (textual->utf16be beyondBMP)))
        (fail 'utf16be->text))
    (or (textual=?
          beyondBMP
          (utf16le->text (textual->utf16le beyondBMP)))
        (fail 'utf16le->text))
    (or (result=?
          (string-append (string (integer->char 65279)) "abc")
          (utf16be->text '#vu8(254 255 0 97 0 98 0 99)))
        (fail 'utf16be->text))
    (or (result=?
          (string-append (string (integer->char 65279)) "abc")
          (utf16le->text '#vu8(255 254 97 0 98 0 99 0)))
        (fail 'utf16le->text)))
  (else))
(or (= 0 (text-length (text))) (fail 'text-length))
(or (= 6 (text-length ABCDEF)) (fail 'text-length))
(or (= 1234 (text-length (make-text 1234 (text-ref ABC 0))))
    (fail 'text-length))
(or (char=? #\a (text-ref (text #\a #\b #\c) 0))
    (fail 'text-ref))
(or (char=? #\c (text-ref (text #\a #\b #\c) 2))
    (fail 'text-ref))
(or (char=?
      (string-ref (textual->string ABCDEF) 3)
      (text-ref ABCDEF 3))
    (fail 'text-ref))
(or (= 0 (textual-length (text))) (fail 'textual-length))
(or (= 6 (textual-length ABCDEF)) (fail 'textual-length))
(or (= 1234
       (textual-length (make-text 1234 (text-ref ABC 0))))
    (fail 'textual-length))
(or (char=? #\a (textual-ref (text #\a #\b #\c) 0))
    (fail 'textual-ref))
(or (char=? #\c (textual-ref (text #\a #\b #\c) 2))
    (fail 'textual-ref))
(or (char=?
      (string-ref (textual->string ABCDEF) 3)
      (textual-ref ABCDEF 3))
    (fail 'textual-ref))
(or (result=? "" (subtext (text) 0 0)) (fail 'subtext))
(or (result=? "" (subtext (string->text "abcdef") 0 0))
    (fail 'subtext))
(or (result=? "" (subtext (string->text "abcdef") 4 4))
    (fail 'subtext))
(or (result=? "" (subtext (string->text "abcdef") 6 6))
    (fail 'subtext))
(or (result=? "abcd" (subtext (string->text "abcdef") 0 4))
    (fail 'subtext))
(or (result=? "cde" (subtext (string->text "abcdef") 2 5))
    (fail 'subtext))
(or (result=? "cdef" (subtext (string->text "abcdef") 2 6))
    (fail 'subtext))
(or (result=?
      "abcdef"
      (subtext (string->text "abcdef") 0 6))
    (fail 'subtext))
(or (result=? "" (subtextual (text) 0 0))
    (fail 'subtextual))
(or (result=? "" (subtextual (string->text "abcdef") 0 0))
    (fail 'subtextual))
(or (result=? "" (subtextual (string->text "abcdef") 4 4))
    (fail 'subtextual))
(or (result=? "" (subtextual (string->text "abcdef") 6 6))
    (fail 'subtextual))
(or (result=?
      "abcd"
      (subtextual (string->text "abcdef") 0 4))
    (fail 'subtextual))
(or (result=?
      "cde"
      (subtextual (string->text "abcdef") 2 5))
    (fail 'subtextual))
(or (result=?
      "cdef"
      (subtextual (string->text "abcdef") 2 6))
    (fail 'subtextual))
(or (result=?
      "abcdef"
      (subtextual (string->text "abcdef") 0 6))
    (fail 'subtextual))
(or (result=? "" (subtextual "" 0 0)) (fail 'subtextual))
(or (result=? "" (subtextual "abcdef" 0 0))
    (fail 'subtextual))
(or (result=? "" (subtextual "abcdef" 4 4))
    (fail 'subtextual))
(or (result=? "" (subtextual "abcdef" 6 6))
    (fail 'subtextual))
(or (result=? "abcd" (subtextual "abcdef" 0 4))
    (fail 'subtextual))
(or (result=? "cde" (subtextual "abcdef" 2 5))
    (fail 'subtextual))
(or (result=? "cdef" (subtextual "abcdef" 2 6))
    (fail 'subtextual))
(or (result=? "abcdef" (subtextual "abcdef" 0 6))
    (fail 'subtextual))
(or (result=? "" (textual-copy (text)))
    (fail 'textual-copy))
(or (let* ([txt (string->text "abcdef")]
           [copy (textual-copy txt)])
      (and (result=? "abcdef" copy) (not (eqv? txt copy))))
    (fail 'textual-copy))
(or (result=? "" (textual-copy "")) (fail 'textual-copy))
(or (result=? "abcdef" (textual-copy "abcdef"))
    (fail 'textual-copy))
(or (result=? "" (textual-copy (text) 0))
    (fail 'textual-copy))
(or (result=?
      "abcdef"
      (textual-copy (string->text "abcdef") 0))
    (fail 'textual-copy))
(or (result=? "ef" (textual-copy (string->text "abcdef") 4))
    (fail 'textual-copy))
(or (result=? "" (textual-copy (string->text "abcdef") 6))
    (fail 'textual-copy))
(or (result=? "" (textual-copy "" 0)) (fail 'textual-copy))
(or (result=? "abcdef" (textual-copy "abcdef" 0))
    (fail 'textual-copy))
(or (result=? "ef" (textual-copy "abcdef" 4))
    (fail 'textual-copy))
(or (result=? "" (textual-copy "abcdef" 6))
    (fail 'textual-copy))
(or (result=? "" (textual-copy (text) 0 0))
    (fail 'textual-copy))
(or (result=? "" (textual-copy (string->text "abcdef") 0 0))
    (fail 'textual-copy))
(or (result=? "" (textual-copy (string->text "abcdef") 4 4))
    (fail 'textual-copy))
(or (result=? "" (textual-copy (string->text "abcdef") 6 6))
    (fail 'textual-copy))
(or (result=?
      "abcd"
      (textual-copy (string->text "abcdef") 0 4))
    (fail 'textual-copy))
(or (result=?
      "cde"
      (textual-copy (string->text "abcdef") 2 5))
    (fail 'textual-copy))
(or (result=?
      "cdef"
      (textual-copy (string->text "abcdef") 2 6))
    (fail 'textual-copy))
(or (result=?
      "abcdef"
      (textual-copy (string->text "abcdef") 0 6))
    (fail 'textual-copy))
(or (result=? "" (textual-copy "" 0 0))
    (fail 'textual-copy))
(or (result=? "" (textual-copy "abcdef" 0 0))
    (fail 'textual-copy))
(or (result=? "" (textual-copy "abcdef" 4 4))
    (fail 'textual-copy))
(or (result=? "" (textual-copy "abcdef" 6 6))
    (fail 'textual-copy))
(or (result=? "abcd" (textual-copy "abcdef" 0 4))
    (fail 'textual-copy))
(or (result=? "cde" (textual-copy "abcdef" 2 5))
    (fail 'textual-copy))
(or (result=? "cdef" (textual-copy "abcdef" 2 6))
    (fail 'textual-copy))
(or (result=? "abcdef" (textual-copy "abcdef" 0 6))
    (fail 'textual-copy))
(or (result=? "" (textual-take (text) 0))
    (fail 'textual-take))
(or (result=? "" (textual-take (string->text "abcdef") 0))
    (fail 'textual-take))
(or (result=? "ab" (textual-take (string->text "abcdef") 2))
    (fail 'textual-take))
(or (result=? "" (textual-drop (string->text "") 0))
    (fail 'textual-drop))
(or (result=?
      "abcdef"
      (textual-drop (string->text "abcdef") 0))
    (fail 'textual-drop))
(or (result=?
      "cdef"
      (textual-drop (string->text "abcdef") 2))
    (fail 'textual-drop))
(or (result=? "" (textual-take-right (text) 0))
    (fail 'textual-take-right))
(or (result=?
      ""
      (textual-take-right (string->text "abcdef") 0))
    (fail 'textual-take-right))
(or (result=?
      "ef"
      (textual-take-right (string->text "abcdef") 2))
    (fail 'textual-take-right))
(or (result=? "" (textual-drop-right (text) 0))
    (fail 'textual-drop-right))
(or (result=?
      "abcdef"
      (textual-drop-right (string->text "abcdef") 0))
    (fail 'textual-drop-right))
(or (result=?
      "abcd"
      (textual-drop-right (string->text "abcdef") 2))
    (fail 'textual-drop-right))
(or (result=? "" (textual-take "" 0)) (fail 'textual-take))
(or (result=? "" (textual-take "abcdef" 0))
    (fail 'textual-take))
(or (result=? "ab" (textual-take "abcdef" 2))
    (fail 'textual-take))
(or (result=? "" (textual-drop "" 0)) (fail 'textual-drop))
(or (result=? "abcdef" (textual-drop "abcdef" 0))
    (fail 'textual-drop))
(or (result=? "cdef" (textual-drop "abcdef" 2))
    (fail 'textual-drop))
(or (result=? "" (textual-take-right "" 0))
    (fail 'textual-take-right))
(or (result=? "" (textual-take-right "abcdef" 0))
    (fail 'textual-take-right))
(or (result=? "ef" (textual-take-right "abcdef" 2))
    (fail 'textual-take-right))
(or (result=? "" (textual-drop-right "" 0))
    (fail 'textual-drop-right))
(or (result=? "abcdef" (textual-drop-right "abcdef" 0))
    (fail 'textual-drop-right))
(or (result=? "abcd" (textual-drop-right "abcdef" 2))
    (fail 'textual-drop-right))
(or (result=? "" (textual-pad (string->text "") 0))
    (fail 'textual-pad))
(or (result=? "     " (textual-pad (string->text "") 5))
    (fail 'textual-pad))
(or (result=? "  325" (textual-pad (string->text "325") 5))
    (fail 'textual-pad))
(or (result=?
      "71325"
      (textual-pad (string->text "71325") 5))
    (fail 'textual-pad))
(or (result=?
      "71325"
      (textual-pad (string->text "8871325") 5))
    (fail 'textual-pad))
(or (result=? "" (textual-pad (string->text "") 0 #\*))
    (fail 'textual-pad))
(or (result=? "*****" (textual-pad (string->text "") 5 #\*))
    (fail 'textual-pad))
(or (result=?
      "**325"
      (textual-pad (string->text "325") 5 #\*))
    (fail 'textual-pad))
(or (result=?
      "71325"
      (textual-pad (string->text "71325") 5 #\*))
    (fail 'textual-pad))
(or (result=?
      "71325"
      (textual-pad (string->text "8871325") 5 #\*))
    (fail 'textual-pad))
(or (result=? "" (textual-pad (string->text "") 0 #\* 0))
    (fail 'textual-pad))
(or (result=?
      "*****"
      (textual-pad (string->text "") 5 #\* 0))
    (fail 'textual-pad))
(or (result=?
      "**325"
      (textual-pad (string->text "325") 5 #\* 0))
    (fail 'textual-pad))
(or (result=?
      "71325"
      (textual-pad (string->text "71325") 5 #\* 0))
    (fail 'textual-pad))
(or (result=?
      "71325"
      (textual-pad (string->text "8871325") 5 #\* 0))
    (fail 'textual-pad))
(or (result=?
      "***25"
      (textual-pad (string->text "325") 5 #\* 1))
    (fail 'textual-pad))
(or (result=?
      "*1325"
      (textual-pad (string->text "71325") 5 #\* 1))
    (fail 'textual-pad))
(or (result=?
      "71325"
      (textual-pad (string->text "8871325") 5 #\* 1))
    (fail 'textual-pad))
(or (result=? "" (textual-pad (string->text "") 0 #\* 0 0))
    (fail 'textual-pad))
(or (result=?
      "*****"
      (textual-pad (string->text "") 5 #\* 0 0))
    (fail 'textual-pad))
(or (result=?
      "**325"
      (textual-pad (string->text "325") 5 #\* 0 3))
    (fail 'textual-pad))
(or (result=?
      "**713"
      (textual-pad (string->text "71325") 5 #\* 0 3))
    (fail 'textual-pad))
(or (result=?
      "**887"
      (textual-pad (string->text "8871325") 5 #\* 0 3))
    (fail 'textual-pad))
(or (result=?
      "***25"
      (textual-pad (string->text "325") 5 #\* 1 3))
    (fail 'textual-pad))
(or (result=?
      "**132"
      (textual-pad (string->text "71325") 5 #\* 1 4))
    (fail 'textual-pad))
(or (result=?
      "*8713"
      (textual-pad (string->text "8871325") 5 #\* 1 5))
    (fail 'textual-pad))
(or (result=? "" (textual-pad-right (string->text "") 0))
    (fail 'textual-pad-right))
(or (result=?
      "     "
      (textual-pad-right (string->text "") 5))
    (fail 'textual-pad-right))
(or (result=?
      "325  "
      (textual-pad-right (string->text "325") 5))
    (fail 'textual-pad-right))
(or (result=?
      "71325"
      (textual-pad-right (string->text "71325") 5))
    (fail 'textual-pad-right))
(or (result=?
      "88713"
      (textual-pad-right (string->text "8871325") 5))
    (fail 'textual-pad-right))
(or (result=?
      ""
      (textual-pad-right (string->text "") 0 #\*))
    (fail 'textual-pad-right))
(or (result=?
      "*****"
      (textual-pad-right (string->text "") 5 #\*))
    (fail 'textual-pad-right))
(or (result=?
      "325**"
      (textual-pad-right (string->text "325") 5 #\*))
    (fail 'textual-pad-right))
(or (result=?
      "71325"
      (textual-pad-right (string->text "71325") 5 #\*))
    (fail 'textual-pad-right))
(or (result=?
      "88713"
      (textual-pad-right (string->text "8871325") 5 #\*))
    (fail 'textual-pad-right))
(or (result=?
      ""
      (textual-pad-right (string->text "") 0 #\* 0))
    (fail 'textual-pad-right))
(or (result=?
      "*****"
      (textual-pad-right (string->text "") 5 #\* 0))
    (fail 'textual-pad-right))
(or (result=?
      "325**"
      (textual-pad-right (string->text "325") 5 #\* 0))
    (fail 'textual-pad-right))
(or (result=?
      "71325"
      (textual-pad-right (string->text "71325") 5 #\* 0))
    (fail 'textual-pad-right))
(or (result=?
      "88713"
      (textual-pad-right (string->text "8871325") 5 #\* 0))
    (fail 'textual-pad-right))
(or (result=?
      "25***"
      (textual-pad-right (string->text "325") 5 #\* 1))
    (fail 'textual-pad-right))
(or (result=?
      "1325*"
      (textual-pad-right (string->text "71325") 5 #\* 1))
    (fail 'textual-pad-right))
(or (result=?
      "87132"
      (textual-pad-right (string->text "8871325") 5 #\* 1))
    (fail 'textual-pad-right))
(or (result=?
      ""
      (textual-pad-right (string->text "") 0 #\* 0 0))
    (fail 'textual-pad-right))
(or (result=?
      "*****"
      (textual-pad-right (string->text "") 5 #\* 0 0))
    (fail 'textual-pad-right))
(or (result=?
      "325**"
      (textual-pad-right (string->text "325") 5 #\* 0 3))
    (fail 'textual-pad-right))
(or (result=?
      "713**"
      (textual-pad-right (string->text "71325") 5 #\* 0 3))
    (fail 'textual-pad-right))
(or (result=?
      "887**"
      (textual-pad-right (string->text "8871325") 5 #\* 0 3))
    (fail 'textual-pad-right))
(or (result=?
      "25***"
      (textual-pad-right (string->text "325") 5 #\* 1 3))
    (fail 'textual-pad-right))
(or (result=?
      "132**"
      (textual-pad-right (string->text "71325") 5 #\* 1 4))
    (fail 'textual-pad-right))
(or (result=?
      "8713*"
      (textual-pad-right (string->text "8871325") 5 #\* 1 5))
    (fail 'textual-pad-right))
(or (result=? "" (textual-pad "" 0)) (fail 'textual-pad))
(or (result=? "     " (textual-pad "" 5))
    (fail 'textual-pad))
(or (result=? "  325" (textual-pad "325" 5))
    (fail 'textual-pad))
(or (result=? "71325" (textual-pad "71325" 5))
    (fail 'textual-pad))
(or (result=? "71325" (textual-pad "8871325" 5))
    (fail 'textual-pad))
(or (result=? "" (textual-pad "" 0 #\*))
    (fail 'textual-pad))
(or (result=? "*****" (textual-pad "" 5 #\*))
    (fail 'textual-pad))
(or (result=? "**325" (textual-pad "325" 5 #\*))
    (fail 'textual-pad))
(or (result=? "71325" (textual-pad "71325" 5 #\*))
    (fail 'textual-pad))
(or (result=? "71325" (textual-pad "8871325" 5 #\*))
    (fail 'textual-pad))
(or (result=? "" (textual-pad "" 0 #\* 0))
    (fail 'textual-pad))
(or (result=? "*****" (textual-pad "" 5 #\* 0))
    (fail 'textual-pad))
(or (result=? "**325" (textual-pad "325" 5 #\* 0))
    (fail 'textual-pad))
(or (result=? "71325" (textual-pad "71325" 5 #\* 0))
    (fail 'textual-pad))
(or (result=? "71325" (textual-pad "8871325" 5 #\* 0))
    (fail 'textual-pad))
(or (result=? "***25" (textual-pad "325" 5 #\* 1))
    (fail 'textual-pad))
(or (result=? "*1325" (textual-pad "71325" 5 #\* 1))
    (fail 'textual-pad))
(or (result=? "71325" (textual-pad "8871325" 5 #\* 1))
    (fail 'textual-pad))
(or (result=? "" (textual-pad "" 0 #\* 0 0))
    (fail 'textual-pad))
(or (result=? "*****" (textual-pad "" 5 #\* 0 0))
    (fail 'textual-pad))
(or (result=? "**325" (textual-pad "325" 5 #\* 0 3))
    (fail 'textual-pad))
(or (result=? "**713" (textual-pad "71325" 5 #\* 0 3))
    (fail 'textual-pad))
(or (result=? "**887" (textual-pad "8871325" 5 #\* 0 3))
    (fail 'textual-pad))
(or (result=? "***25" (textual-pad "325" 5 #\* 1 3))
    (fail 'textual-pad))
(or (result=? "**132" (textual-pad "71325" 5 #\* 1 4))
    (fail 'textual-pad))
(or (result=? "*8713" (textual-pad "8871325" 5 #\* 1 5))
    (fail 'textual-pad))
(or (result=? "" (textual-pad-right "" 0))
    (fail 'textual-pad-right))
(or (result=? "     " (textual-pad-right "" 5))
    (fail 'textual-pad-right))
(or (result=? "325  " (textual-pad-right "325" 5))
    (fail 'textual-pad-right))
(or (result=? "71325" (textual-pad-right "71325" 5))
    (fail 'textual-pad-right))
(or (result=? "88713" (textual-pad-right "8871325" 5))
    (fail 'textual-pad-right))
(or (result=? "" (textual-pad-right "" 0 #\*))
    (fail 'textual-pad-right))
(or (result=? "*****" (textual-pad-right "" 5 #\*))
    (fail 'textual-pad-right))
(or (result=? "325**" (textual-pad-right "325" 5 #\*))
    (fail 'textual-pad-right))
(or (result=? "71325" (textual-pad-right "71325" 5 #\*))
    (fail 'textual-pad-right))
(or (result=? "88713" (textual-pad-right "8871325" 5 #\*))
    (fail 'textual-pad-right))
(or (result=? "" (textual-pad-right "" 0 #\* 0))
    (fail 'textual-pad-right))
(or (result=? "*****" (textual-pad-right "" 5 #\* 0))
    (fail 'textual-pad-right))
(or (result=? "325**" (textual-pad-right "325" 5 #\* 0))
    (fail 'textual-pad-right))
(or (result=? "71325" (textual-pad-right "71325" 5 #\* 0))
    (fail 'textual-pad-right))
(or (result=? "88713" (textual-pad-right "8871325" 5 #\* 0))
    (fail 'textual-pad-right))
(or (result=? "25***" (textual-pad-right "325" 5 #\* 1))
    (fail 'textual-pad-right))
(or (result=? "1325*" (textual-pad-right "71325" 5 #\* 1))
    (fail 'textual-pad-right))
(or (result=? "87132" (textual-pad-right "8871325" 5 #\* 1))
    (fail 'textual-pad-right))
(or (result=? "" (textual-pad-right "" 0 #\* 0 0))
    (fail 'textual-pad-right))
(or (result=? "*****" (textual-pad-right "" 5 #\* 0 0))
    (fail 'textual-pad-right))
(or (result=? "325**" (textual-pad-right "325" 5 #\* 0 3))
    (fail 'textual-pad-right))
(or (result=? "713**" (textual-pad-right "71325" 5 #\* 0 3))
    (fail 'textual-pad-right))
(or (result=?
      "887**"
      (textual-pad-right "8871325" 5 #\* 0 3))
    (fail 'textual-pad-right))
(or (result=? "25***" (textual-pad-right "325" 5 #\* 1 3))
    (fail 'textual-pad-right))
(or (result=? "132**" (textual-pad-right "71325" 5 #\* 1 4))
    (fail 'textual-pad-right))
(or (result=?
      "8713*"
      (textual-pad-right "8871325" 5 #\* 1 5))
    (fail 'textual-pad-right))
(or (result=? "" (textual-trim (string->text "")))
    (fail 'textual-trim))
(or (result=?
      "a  b  c  "
      (textual-trim (string->text "  a  b  c  ")))
    (fail 'textual-trim))
(or (result=?
      ""
      (textual-trim (string->text "") char-whitespace?))
    (fail 'textual-trim))
(or (result=?
      "a  b  c  "
      (textual-trim
        (string->text "  a  b  c  ")
        char-whitespace?))
    (fail 'textual-trim))
(or (result=?
      ""
      (textual-trim (string->text "  a  b  c  ") char?))
    (fail 'textual-trim))
(or (result=?
      ""
      (textual-trim (string->text "") char-whitespace? 0))
    (fail 'textual-trim))
(or (result=?
      "a  b  c  "
      (textual-trim
        (string->text "  a  b  c  ")
        char-whitespace?
        0))
    (fail 'textual-trim))
(or (result=?
      ""
      (textual-trim (string->text "  a  b  c  ") char? 0))
    (fail 'textual-trim))
(or (result=?
      "b  c  "
      (textual-trim
        (string->text "  a  b  c  ")
        char-whitespace?
        3))
    (fail 'textual-trim))
(or (result=?
      ""
      (textual-trim (string->text "  a  b  c  ") char? 3))
    (fail 'textual-trim))
(or (result=?
      ""
      (textual-trim (string->text "  a  b  c  ") char? 0 11))
    (fail 'textual-trim))
(or (result=?
      "b  c  "
      (textual-trim
        (string->text "  a  b  c  ")
        char-whitespace?
        3
        11))
    (fail 'textual-trim))
(or (result=?
      ""
      (textual-trim (string->text "  a  b  c  ") char? 3 11))
    (fail 'textual-trim))
(or (result=?
      ""
      (textual-trim (string->text "  a  b  c  ") char? 0 8))
    (fail 'textual-trim))
(or (result=?
      "b  "
      (textual-trim
        (string->text "  a  b  c  ")
        char-whitespace?
        3
        8))
    (fail 'textual-trim))
(or (result=?
      ""
      (textual-trim (string->text "  a  b  c  ") char? 3 8))
    (fail 'textual-trim))
(or (result=? "" (textual-trim-right (string->text "")))
    (fail 'textual-trim-right))
(or (result=?
      "  a  b  c"
      (textual-trim-right (string->text "  a  b  c  ")))
    (fail 'textual-trim-right))
(or (result=?
      ""
      (textual-trim-right (string->text "") char-whitespace?))
    (fail 'textual-trim-right))
(or (result=?
      "  a  b  c"
      (textual-trim-right
        (string->text "  a  b  c  ")
        char-whitespace?))
    (fail 'textual-trim-right))
(or (result=?
      ""
      (textual-trim-right (string->text "  a  b  c  ") char?))
    (fail 'textual-trim-right))
(or (result=?
      ""
      (textual-trim-right (string->text "") char-whitespace? 0))
    (fail 'textual-trim-right))
(or (result=?
      "  a  b  c"
      (textual-trim-right
        (string->text "  a  b  c  ")
        char-whitespace?
        0))
    (fail 'textual-trim-right))
(or (result=?
      ""
      (textual-trim-right (string->text "  a  b  c  ") char? 0))
    (fail 'textual-trim-right))
(or (result=?
      "  b  c"
      (textual-trim-right
        (string->text "  a  b  c  ")
        char-whitespace?
        3))
    (fail 'textual-trim-right))
(or (result=?
      ""
      (textual-trim-right (string->text "  a  b  c  ") char? 3))
    (fail 'textual-trim-right))
(or (result=?
      ""
      (textual-trim-right
        (string->text "  a  b  c  ")
        char?
        0
        11))
    (fail 'textual-trim-right))
(or (result=?
      "  b  c"
      (textual-trim-right
        (string->text "  a  b  c  ")
        char-whitespace?
        3
        11))
    (fail 'textual-trim-right))
(or (result=?
      ""
      (textual-trim-right
        (string->text "  a  b  c  ")
        char?
        3
        11))
    (fail 'textual-trim-right))
(or (result=?
      ""
      (textual-trim-right (string->text "  a  b  c  ") char? 0 8))
    (fail 'textual-trim-right))
(or (result=?
      "  b"
      (textual-trim-right
        (string->text "  a  b  c  ")
        char-whitespace?
        3
        8))
    (fail 'textual-trim-right))
(or (result=?
      ""
      (textual-trim-right (string->text "  a  b  c  ") char? 3 8))
    (fail 'textual-trim-right))
(or (result=? "" (textual-trim-both (string->text "")))
    (fail 'textual-trim-both))
(or (result=?
      "a  b  c"
      (textual-trim-both (string->text "  a  b  c  ")))
    (fail 'textual-trim-both))
(or (result=?
      ""
      (textual-trim-both (string->text "") char-whitespace?))
    (fail 'textual-trim-both))
(or (result=?
      "a  b  c"
      (textual-trim-both
        (string->text "  a  b  c  ")
        char-whitespace?))
    (fail 'textual-trim-both))
(or (result=?
      ""
      (textual-trim-both (string->text "  a  b  c  ") char?))
    (fail 'textual-trim-both))
(or (result=?
      ""
      (textual-trim-both (string->text "") char-whitespace? 0))
    (fail 'textual-trim-both))
(or (result=?
      "a  b  c"
      (textual-trim-both
        (string->text "  a  b  c  ")
        char-whitespace?
        0))
    (fail 'textual-trim-both))
(or (result=?
      ""
      (textual-trim-both (string->text "  a  b  c  ") char? 0))
    (fail 'textual-trim-both))
(or (result=?
      "b  c"
      (textual-trim-both
        (string->text "  a  b  c  ")
        char-whitespace?
        3))
    (fail 'textual-trim-both))
(or (result=?
      ""
      (textual-trim-both (string->text "  a  b  c  ") char? 3))
    (fail 'textual-trim-both))
(or (result=?
      ""
      (textual-trim-both (string->text "  a  b  c  ") char? 0 11))
    (fail 'textual-trim-both))
(or (result=?
      "b  c"
      (textual-trim-both
        (string->text "  a  b  c  ")
        char-whitespace?
        3
        11))
    (fail 'textual-trim-both))
(or (result=?
      ""
      (textual-trim-both (string->text "  a  b  c  ") char? 3 11))
    (fail 'textual-trim-both))
(or (result=?
      ""
      (textual-trim-both (string->text "  a  b  c  ") char? 0 8))
    (fail 'textual-trim-both))
(or (result=?
      "b"
      (textual-trim-both
        (string->text "  a  b  c  ")
        char-whitespace?
        3
        8))
    (fail 'textual-trim-both))
(or (result=?
      ""
      (textual-trim-both (string->text "  a  b  c  ") char? 3 8))
    (fail 'textual-trim-both))
(or (result=? "" (textual-trim "")) (fail 'textual-trim))
(or (result=? "a  b  c  " (textual-trim "  a  b  c  "))
    (fail 'textual-trim))
(or (result=? "" (textual-trim "" char-whitespace?))
    (fail 'textual-trim))
(or (result=?
      "a  b  c  "
      (textual-trim "  a  b  c  " char-whitespace?))
    (fail 'textual-trim))
(or (result=? "" (textual-trim "  a  b  c  " char?))
    (fail 'textual-trim))
(or (result=? "" (textual-trim "" char-whitespace? 0))
    (fail 'textual-trim))
(or (result=?
      "a  b  c  "
      (textual-trim "  a  b  c  " char-whitespace? 0))
    (fail 'textual-trim))
(or (result=? "" (textual-trim "  a  b  c  " char? 0))
    (fail 'textual-trim))
(or (result=?
      "b  c  "
      (textual-trim "  a  b  c  " char-whitespace? 3))
    (fail 'textual-trim))
(or (result=? "" (textual-trim "  a  b  c  " char? 3))
    (fail 'textual-trim))
(or (result=? "" (textual-trim "  a  b  c  " char? 0 11))
    (fail 'textual-trim))
(or (result=?
      "b  c  "
      (textual-trim "  a  b  c  " char-whitespace? 3 11))
    (fail 'textual-trim))
(or (result=? "" (textual-trim "  a  b  c  " char? 3 11))
    (fail 'textual-trim))
(or (result=? "" (textual-trim "  a  b  c  " char? 0 8))
    (fail 'textual-trim))
(or (result=?
      "b  "
      (textual-trim "  a  b  c  " char-whitespace? 3 8))
    (fail 'textual-trim))
(or (result=? "" (textual-trim "  a  b  c  " char? 3 8))
    (fail 'textual-trim))
(or (result=? "" (textual-trim-right ""))
    (fail 'textual-trim-right))
(or (result=?
      "  a  b  c"
      (textual-trim-right "  a  b  c  "))
    (fail 'textual-trim-right))
(or (result=? "" (textual-trim-right "" char-whitespace?))
    (fail 'textual-trim-right))
(or (result=?
      "  a  b  c"
      (textual-trim-right "  a  b  c  " char-whitespace?))
    (fail 'textual-trim-right))
(or (result=? "" (textual-trim-right "  a  b  c  " char?))
    (fail 'textual-trim-right))
(or (result=? "" (textual-trim-right "" char-whitespace? 0))
    (fail 'textual-trim-right))
(or (result=?
      "  a  b  c"
      (textual-trim-right "  a  b  c  " char-whitespace? 0))
    (fail 'textual-trim-right))
(or (result=? "" (textual-trim-right "  a  b  c  " char? 0))
    (fail 'textual-trim-right))
(or (result=?
      "  b  c"
      (textual-trim-right "  a  b  c  " char-whitespace? 3))
    (fail 'textual-trim-right))
(or (result=? "" (textual-trim-right "  a  b  c  " char? 3))
    (fail 'textual-trim-right))
(or (result=?
      ""
      (textual-trim-right "  a  b  c  " char? 0 11))
    (fail 'textual-trim-right))
(or (result=?
      "  b  c"
      (textual-trim-right "  a  b  c  " char-whitespace? 3 11))
    (fail 'textual-trim-right))
(or (result=?
      ""
      (textual-trim-right "  a  b  c  " char? 3 11))
    (fail 'textual-trim-right))
(or (result=?
      ""
      (textual-trim-right "  a  b  c  " char? 0 8))
    (fail 'textual-trim-right))
(or (result=?
      "  b"
      (textual-trim-right "  a  b  c  " char-whitespace? 3 8))
    (fail 'textual-trim-right))
(or (result=?
      ""
      (textual-trim-right "  a  b  c  " char? 3 8))
    (fail 'textual-trim-right))
(or (result=? "" (textual-trim-both ""))
    (fail 'textual-trim-both))
(or (result=? "a  b  c" (textual-trim-both "  a  b  c  "))
    (fail 'textual-trim-both))
(or (result=? "" (textual-trim-both "" char-whitespace?))
    (fail 'textual-trim-both))
(or (result=?
      "a  b  c"
      (textual-trim-both "  a  b  c  " char-whitespace?))
    (fail 'textual-trim-both))
(or (result=? "" (textual-trim-both "  a  b  c  " char?))
    (fail 'textual-trim-both))
(or (result=? "" (textual-trim-both "" char-whitespace? 0))
    (fail 'textual-trim-both))
(or (result=?
      "a  b  c"
      (textual-trim-both "  a  b  c  " char-whitespace? 0))
    (fail 'textual-trim-both))
(or (result=? "" (textual-trim-both "  a  b  c  " char? 0))
    (fail 'textual-trim-both))
(or (result=?
      "b  c"
      (textual-trim-both "  a  b  c  " char-whitespace? 3))
    (fail 'textual-trim-both))
(or (result=? "" (textual-trim-both "  a  b  c  " char? 3))
    (fail 'textual-trim-both))
(or (result=?
      ""
      (textual-trim-both "  a  b  c  " char? 0 11))
    (fail 'textual-trim-both))
(or (result=?
      "b  c"
      (textual-trim-both "  a  b  c  " char-whitespace? 3 11))
    (fail 'textual-trim-both))
(or (result=?
      ""
      (textual-trim-both "  a  b  c  " char? 3 11))
    (fail 'textual-trim-both))
(or (result=?
      ""
      (textual-trim-both "  a  b  c  " char? 0 8))
    (fail 'textual-trim-both))
(or (result=?
      "b"
      (textual-trim-both "  a  b  c  " char-whitespace? 3 8))
    (fail 'textual-trim-both))
(or (result=?
      ""
      (textual-trim-both "  a  b  c  " char? 3 8))
    (fail 'textual-trim-both))
(or (result=?
      "It's lots of fun to code it up in Scheme."
      (textual-replace
        (as-text "It's easy to code it up in Scheme.")
        (as-text "lots of fun")
        5
        9))
    (fail 'textual-replace))
(or (result=?
      "The miserable perl programmer endured daily ridicule."
      (textual-replace "The TCL programmer endured daily ridicule."
        (as-text "another miserable perl drone") 4 7 8 22))
    (fail 'textual-replace))
(or (result=?
      "It's really easy to code it up in Scheme."
      (textual-replace
        (as-text "It's easy to code it up in Scheme.")
        "really "
        5
        5))
    (fail 'textual-replace))
(or (result=?
      "Runs in O(1) time."
      (textual-replace "Runs in O(n) time." (text #\1) 10 11))
    (fail 'textual-replace))
(or (equal?
      #t
      (textual=? (as-text "Strasse") (as-text "Strasse")))
    (fail 'textual=?))
(or (equal?
      #t
      (textual=? "Strasse" (as-text "Strasse") "Strasse"))
    (fail 'textual=?))
(or (equal? #f (textual<? (as-text "z") (as-text "z")))
    (fail 'textual<?))
(or (equal? #t (textual<? (as-text "z") "zz"))
    (fail 'textual<?))
(or (equal? #f (textual<? (as-text "z") (as-text "Z")))
    (fail 'textual<?))
(or (equal? #t (textual<=? (as-text "z") "zz"))
    (fail 'textual<=?))
(or (equal? #f (textual<=? "z" "Z")) (fail 'textual<=?))
(or (equal? #t (textual<=? "z" (as-text "z")))
    (fail 'textual<=?))
(or (equal? #f (textual<? "z" (as-text "z")))
    (fail 'textual<?))
(or (equal? #f (textual>? (as-text "z") "zz"))
    (fail 'textual>?))
(or (equal? #t (textual>? "z" (as-text "Z")))
    (fail 'textual>?))
(or (equal? #f (textual>=? (as-text "z") "zz"))
    (fail 'textual>=?))
(or (equal? #t (textual>=? "z" "Z")) (fail 'textual>=?))
(or (equal? #t (textual>=? (as-text "z") (as-text "z")))
    (fail 'textual>=?))
(let* ([w "a"] [x "abc"] [y "def"] [z (text #\a #\b #\c)])
  (or (equal? (textual=? x y z) #f) (fail 'textual=?))
  (or (equal? (textual=? x x z) #t) (fail 'textual=?))
  (or (equal? (textual=? w x y) #f) (fail 'textual=?))
  (or (equal? (textual=? y x w) #f) (fail 'textual=?))
  (or (equal? (textual<? x y z) #f) (fail 'textual<?))
  (or (equal? (textual<? x x z) #f) (fail 'textual<?))
  (or (equal? (textual<? w x y) #t) (fail 'textual<?))
  (or (equal? (textual<? y x w) #f) (fail 'textual<?))
  (or (equal? (textual>? x y z) #f) (fail 'textual>?))
  (or (equal? (textual>? x x z) #f) (fail 'textual>?))
  (or (equal? (textual>? w x y) #f) (fail 'textual>?))
  (or (equal? (textual>? y x w) #t) (fail 'textual>?))
  (or (equal? (textual<=? x y z) #f) (fail 'textual<=?))
  (or (equal? (textual<=? x x z) #t) (fail 'textual<=?))
  (or (equal? (textual<=? w x y) #t) (fail 'textual<=?))
  (or (equal? (textual<=? y x w) #f) (fail 'textual<=?))
  (or (equal? (textual>=? x y z) #f) (fail 'textual>=?))
  (or (equal? (textual>=? x x z) #t) (fail 'textual>=?))
  (or (equal? (textual>=? w x y) #f) (fail 'textual>=?))
  (or (equal? (textual>=? y x w) #t) (fail 'textual>=?))
  (or (equal? (textual=? x x) #t) (fail 'textual=?))
  (or (equal? (textual=? w x) #f) (fail 'textual=?))
  (or (equal? (textual=? y x) #f) (fail 'textual=?))
  (or (equal? (textual<? x x) #f) (fail 'textual<?))
  (or (equal? (textual<? w x) #t) (fail 'textual<?))
  (or (equal? (textual<? y x) #f) (fail 'textual<?))
  (or (equal? (textual>? x x) #f) (fail 'textual>?))
  (or (equal? (textual>? w x) #f) (fail 'textual>?))
  (or (equal? (textual>? y x) #t) (fail 'textual>?))
  (or (equal? (textual<=? x x) #t) (fail 'textual<=?))
  (or (equal? (textual<=? w x) #t) (fail 'textual<=?))
  (or (equal? (textual<=? y x) #f) (fail 'textual<=?))
  (or (equal? (textual>=? x x) #t) (fail 'textual>=?))
  (or (equal? (textual>=? w x) #f) (fail 'textual>=?))
  (or (equal? (textual>=? y x) #t) (fail 'textual>=?)))
(or (equal? #t (textual-ci<? "a" "Z")) (fail 'textual-ci<?))
(or (equal? #t (textual-ci<? "A" "z")) (fail 'textual-ci<?))
(or (equal? #f (textual-ci<? "Z" "a")) (fail 'textual-ci<?))
(or (equal? #f (textual-ci<? "z" "A")) (fail 'textual-ci<?))
(or (equal? #f (textual-ci<? "z" "Z")) (fail 'textual-ci<?))
(or (equal? #f (textual-ci<? "Z" "z")) (fail 'textual-ci<?))
(or (equal? #f (textual-ci>? "a" "Z")) (fail 'textual-ci>?))
(or (equal? #f (textual-ci>? "A" "z")) (fail 'textual-ci>?))
(or (equal? #t (textual-ci>? "Z" "a")) (fail 'textual-ci>?))
(or (equal? #t (textual-ci>? "z" "A")) (fail 'textual-ci>?))
(or (equal? #f (textual-ci>? "z" "Z")) (fail 'textual-ci>?))
(or (equal? #f (textual-ci>? "Z" "z")) (fail 'textual-ci>?))
(or (equal? #t (textual-ci=? "z" "Z")) (fail 'textual-ci=?))
(or (equal? #f (textual-ci=? "z" "a")) (fail 'textual-ci=?))
(or (equal? #t (textual-ci<=? "a" "Z"))
    (fail 'textual-ci<=?))
(or (equal? #t (textual-ci<=? "A" "z"))
    (fail 'textual-ci<=?))
(or (equal? #f (textual-ci<=? "Z" "a"))
    (fail 'textual-ci<=?))
(or (equal? #f (textual-ci<=? "z" "A"))
    (fail 'textual-ci<=?))
(or (equal? #t (textual-ci<=? "z" "Z"))
    (fail 'textual-ci<=?))
(or (equal? #t (textual-ci<=? "Z" "z"))
    (fail 'textual-ci<=?))
(or (equal? #f (textual-ci>=? "a" "Z"))
    (fail 'textual-ci>=?))
(or (equal? #f (textual-ci>=? "A" "z"))
    (fail 'textual-ci>=?))
(or (equal? #t (textual-ci>=? "Z" "a"))
    (fail 'textual-ci>=?))
(or (equal? #t (textual-ci>=? "z" "A"))
    (fail 'textual-ci>=?))
(or (equal? #t (textual-ci>=? "z" "Z"))
    (fail 'textual-ci>=?))
(or (equal? #t (textual-ci>=? "Z" "z"))
    (fail 'textual-ci>=?))
(cond-expand
  (full-unicode-strings
   (or (equal? #f (textual=? ABCDEF DEFABC)) (fail 'textual=?))
   (or (equal? #f (textual=? DEFABC ABCDEF)) (fail 'textual=?))
   (or (equal? #t (textual=? DEFABC DEFABC)) (fail 'textual=?))
   (or (equal? #f (textual<? ABCDEF DEFABC)) (fail 'textual=?))
   (or (equal? #t (textual<? DEFABC ABCDEF)) (fail 'textual=?))
   (or (equal? #f (textual<? DEFABC DEFABC)) (fail 'textual=?))
   (or (equal? #t (textual>? ABCDEF DEFABC)) (fail 'textual=?))
   (or (equal? #f (textual>? DEFABC ABCDEF)) (fail 'textual=?))
   (or (equal? #f (textual>? DEFABC DEFABC)) (fail 'textual=?))
   (or (equal? #f (textual<=? ABCDEF DEFABC))
       (fail 'textual=?))
   (or (equal? #t (textual<=? DEFABC ABCDEF))
       (fail 'textual=?))
   (or (equal? #t (textual<=? DEFABC DEFABC))
       (fail 'textual=?))
   (or (equal? #t (textual>=? ABCDEF DEFABC))
       (fail 'textual=?))
   (or (equal? #f (textual>=? DEFABC ABCDEF))
       (fail 'textual=?))
   (or (equal? #t (textual>=? DEFABC DEFABC))
       (fail 'textual=?))
   (or (equal? #f (textual=? "Fuss" fuss))
       (fail 'textual=?:unicode))
   (or (equal? #f (textual=? "Fuss" "Fuss" fuss))
       (fail 'textual=?:unicode))
   (or (equal? #f (textual=? "Fuss" fuss "Fuss"))
       (fail 'textual=?:unicode))
   (or (equal? #f (textual=? fuss "Fuss" "Fuss"))
       (fail 'textual=?:unicode))
   (or (equal? #t (textual<? "z" (as-text eszett)))
       (fail 'textual<?:unicode))
   (or (equal? #f (textual<? (as-text eszett) "z"))
       (fail 'textual<?:unicode))
   (or (equal? #t (textual<=? "z" (as-text eszett)))
       (fail 'textual<=?:unicode))
   (or (equal? #f (textual<=? (as-text eszett) "z"))
       (fail 'textual<=?:unicode))
   (or (equal? #f (textual>? "z" (as-text eszett)))
       (fail 'textual>?:unicode))
   (or (equal? #t (textual>? (as-text eszett) "z"))
       (fail 'textual>?:unicode))
   (or (equal? #f (textual>=? "z" (as-text eszett)))
       (fail 'textual>=?:unicode))
   (or (equal? #t (textual>=? (as-text eszett) "z"))
       (fail 'textual>=?:unicode))
   (or (textual-ci=? fuss "Fuss") (fail 'textual-ci=?:unicode))
   (or (textual-ci=? fuss "FUSS") (fail 'textual-ci=?:unicode))
   (or (textual-ci=? chaos0 chaos1 chaos2)
       (fail 'textual-ci=?:chaos)))
  (else))
(or (= 0 (textual-prefix-length ABC ABCDEF))
    (fail 'textual-prefix-length))
(or (= 0 (textual-prefix-length ABCDEF ABC))
    (fail 'textual-prefix-length))
(or (= 0 (textual-prefix-length ABCDEF DEFABC))
    (fail 'textual-prefix-length))
(or (= 6 (textual-prefix-length DEFABC DEFABC))
    (fail 'textual-prefix-length))
(or (= 6
       (textual-prefix-length (textual->string DEFABC) DEFABC))
    (fail 'textual-prefix-length))
(or (= 6
       (textual-prefix-length DEFABC (textual->string DEFABC)))
    (fail 'textual-prefix-length))
(or (= 6
       (textual-prefix-length
         (textual->string DEFABC)
         (textual->string DEFABC)))
    (fail 'textual-prefix-length))
(or (= 0 (textual-prefix-length (as-text "") (as-text "")))
    (fail 'textual-prefix-length))
(or (= 0
       (textual-prefix-length (as-text "") (as-text "aabbccddee")))
    (fail 'textual-prefix-length))
(or (= 0
       (textual-prefix-length (as-text "aisle") (as-text "")))
    (fail 'textual-prefix-length))
(or (= 0
       (textual-prefix-length (as-text "") (as-text "aabbccddee")))
    (fail 'textual-prefix-length))
(or (= 1
       (textual-prefix-length
         (as-text "aisle")
         (as-text "aabbccddee")))
    (fail 'textual-prefix-length))
(or (= 0
       (textual-prefix-length
         (as-text "bail")
         (as-text "aabbccddee")))
    (fail 'textual-prefix-length))
(or (= 4
       (textual-prefix-length
         (as-text "prefix")
         (as-text "preface")))
    (fail 'textual-prefix-length))
(or (= 0
       (textual-prefix-length (as-text "") (as-text "") 0))
    (fail 'textual-prefix-length))
(or (= 0
       (textual-prefix-length
         (as-text "")
         (as-text "aabbccddee")
         0))
    (fail 'textual-prefix-length))
(or (= 0
       (textual-prefix-length (as-text "aisle") (as-text "") 0))
    (fail 'textual-prefix-length))
(or (= 1
       (textual-prefix-length
         (as-text "aisle")
         (as-text "aabbccddee")
         0))
    (fail 'textual-prefix-length))
(or (= 0
       (textual-prefix-length
         (as-text "bail")
         (as-text "aabbccddee")
         0))
    (fail 'textual-prefix-length))
(or (= 4
       (textual-prefix-length
         (as-text "prefix")
         (as-text "preface")
         0))
    (fail 'textual-prefix-length))
(or (= 0
       (textual-prefix-length (as-text "aisle") (as-text "") 1))
    (fail 'textual-prefix-length))
(or (= 0
       (textual-prefix-length
         (as-text "aisle")
         (as-text "aabbccddee")
         1))
    (fail 'textual-prefix-length))
(or (= 1
       (textual-prefix-length
         (as-text "bail")
         (as-text "aabbccddee")
         1))
    (fail 'textual-prefix-length))
(or (= 0
       (textual-prefix-length
         (as-text "prefix")
         (as-text "preface")
         1))
    (fail 'textual-prefix-length))
(or (= 0
       (textual-prefix-length (as-text "") (as-text "") 0 0))
    (fail 'textual-prefix-length))
(or (= 0
       (textual-prefix-length
         (as-text "")
         (as-text "aabbccddee")
         0
         0))
    (fail 'textual-prefix-length))
(or (= 0
       (textual-prefix-length (as-text "aisle") (as-text "") 0 4))
    (fail 'textual-prefix-length))
(or (= 1
       (textual-prefix-length
         (as-text "aisle")
         (as-text "aabbccddee")
         0
         4))
    (fail 'textual-prefix-length))
(or (= 0
       (textual-prefix-length
         (as-text "bail")
         (as-text "aabbccddee")
         0
         1))
    (fail 'textual-prefix-length))
(or (= 0
       (textual-prefix-length (as-text "aisle") (as-text "") 1 4))
    (fail 'textual-prefix-length))
(or (= 0
       (textual-prefix-length
         (as-text "aisle")
         (as-text "aabbccddee")
         1
         4))
    (fail 'textual-prefix-length))
(or (= 1
       (textual-prefix-length
         (as-text "bail")
         (as-text "aabbccddee")
         1
         4))
    (fail 'textual-prefix-length))
(or (= 0
       (textual-prefix-length
         (as-text "prefix")
         (as-text "preface")
         1
         5))
    (fail 'textual-prefix-length))
(or (= 0
       (textual-prefix-length (as-text "") (as-text "") 0 0 0))
    (fail 'textual-prefix-length))
(or (= 0
       (textual-prefix-length (as-text "") (as-text "aabbccddee") 0
         0 0))
    (fail 'textual-prefix-length))
(or (= 0
       (textual-prefix-length (as-text "aisle") (as-text "") 0 4
         0))
    (fail 'textual-prefix-length))
(or (= 0
       (textual-prefix-length (as-text "aisle")
         (as-text "aabbccddee") 0 4 2))
    (fail 'textual-prefix-length))
(or (= 1
       (textual-prefix-length (as-text "bail")
         (as-text "aabbccddee") 0 1 2))
    (fail 'textual-prefix-length))
(or (= 0
       (textual-prefix-length (as-text "prefix")
         (as-text "preface") 0 5 1))
    (fail 'textual-prefix-length))
(or (= 0
       (textual-prefix-length (as-text "aisle") (as-text "") 1 4
         0))
    (fail 'textual-prefix-length))
(or (= 0
       (textual-prefix-length (as-text "aisle")
         (as-text "aabbccddee") 1 4 3))
    (fail 'textual-prefix-length))
(or (= 0
       (textual-prefix-length (as-text "bail")
         (as-text "aabbccddee") 1 4 3))
    (fail 'textual-prefix-length))
(or (= 3
       (textual-prefix-length (as-text "prefix")
         (as-text "preface") 1 5 1))
    (fail 'textual-prefix-length))
(or (= 0
       (textual-prefix-length (as-text "") (as-text "") 0 0 0 0))
    (fail 'textual-prefix-length))
(or (= 0
       (textual-prefix-length (as-text "") (as-text "aabbccddee") 0
         0 0 0))
    (fail 'textual-prefix-length))
(or (= 0
       (textual-prefix-length (as-text "aisle") (as-text "") 0 4 0
         0))
    (fail 'textual-prefix-length))
(or (= 0
       (textual-prefix-length (as-text "aisle") "aabbccddee" 0 4 2
         10))
    (fail 'textual-prefix-length))
(or (= 1
       (textual-prefix-length (as-text "bail")
         (as-text "aabbccddee") 0 1 2 10))
    (fail 'textual-prefix-length))
(or (= 0
       (textual-prefix-length (as-text "prefix")
         (as-text "preface") 0 5 1 6))
    (fail 'textual-prefix-length))
(or (= 0
       (textual-prefix-length (as-text "aisle") (as-text "") 1 4 0
         0))
    (fail 'textual-prefix-length))
(or (= 0
       (textual-prefix-length (as-text "aisle")
         (as-text "aabbccddee") 1 4 3 3))
    (fail 'textual-prefix-length))
(or (= 0
       (textual-prefix-length (as-text "bail")
         (as-text "aabbccddee") 1 4 3 6))
    (fail 'textual-prefix-length))
(or (= 3
       (textual-prefix-length (as-text "prefix")
         (as-text "preface") 1 5 1 7))
    (fail 'textual-prefix-length))
(or (= 0 (textual-suffix-length ABC ABCDEF))
    (fail 'textual-suffix-length))
(or (= 0 (textual-suffix-length ABCDEF ABC))
    (fail 'textual-suffix-length))
(or (= 0 (textual-suffix-length ABCDEF DEFABC))
    (fail 'textual-suffix-length))
(or (= 6 (textual-suffix-length DEFABC DEFABC))
    (fail 'textual-suffix-length))
(or (= 6
       (textual-suffix-length (textual->string DEFABC) DEFABC))
    (fail 'textual-suffix-length))
(or (= 6
       (textual-suffix-length DEFABC (textual->string DEFABC)))
    (fail 'textual-suffix-length))
(or (= 6
       (textual-suffix-length
         (textual->string DEFABC)
         (textual->string DEFABC)))
    (fail 'textual-suffix-length))
(or (= 0 (textual-suffix-length (as-text "") (as-text "")))
    (fail 'textual-suffix-length))
(or (= 0
       (textual-suffix-length (as-text "") (as-text "aabbccddee")))
    (fail 'textual-suffix-length))
(or (= 0
       (textual-suffix-length (as-text "aisle") (as-text "")))
    (fail 'textual-suffix-length))
(or (= 0
       (textual-suffix-length (as-text "") (as-text "aabbccddee")))
    (fail 'textual-suffix-length))
(or (= 1
       (textual-suffix-length
         (as-text "aisle")
         (as-text "aabbccddee")))
    (fail 'textual-suffix-length))
(or (= 0
       (textual-suffix-length
         (as-text "bail")
         (as-text "aabbccddee")))
    (fail 'textual-suffix-length))
(or (= 3
       (textual-suffix-length
         (as-text "place")
         (as-text "preface")))
    (fail 'textual-suffix-length))
(or (= 0
       (textual-suffix-length (as-text "") (as-text "") 0))
    (fail 'textual-suffix-length))
(or (= 0
       (textual-suffix-length
         (as-text "")
         (as-text "aabbccddee")
         0))
    (fail 'textual-suffix-length))
(or (= 0
       (textual-suffix-length (as-text "aisle") (as-text "") 0))
    (fail 'textual-suffix-length))
(or (= 1
       (textual-suffix-length
         (as-text "aisle")
         (as-text "aabbccddee")
         0))
    (fail 'textual-suffix-length))
(or (= 0
       (textual-suffix-length
         (as-text "bail")
         (as-text "aabbccddee")
         0))
    (fail 'textual-suffix-length))
(or (= 3
       (textual-suffix-length
         (as-text "place")
         (as-text "preface")
         0))
    (fail 'textual-suffix-length))
(or (= 0
       (textual-suffix-length (as-text "aisle") (as-text "") 1))
    (fail 'textual-suffix-length))
(or (= 1
       (textual-suffix-length
         (as-text "aisle")
         (as-text "aabbccddee")
         1))
    (fail 'textual-suffix-length))
(or (= 0
       (textual-suffix-length
         (as-text "bail")
         (as-text "aabbccddee")
         1))
    (fail 'textual-suffix-length))
(or (= 3
       (textual-suffix-length
         (as-text "place")
         (as-text "preface")
         1))
    (fail 'textual-suffix-length))
(or (= 0
       (textual-suffix-length (as-text "") (as-text "") 0 0))
    (fail 'textual-suffix-length))
(or (= 0
       (textual-suffix-length
         (as-text "")
         (as-text "aabbccddee")
         0
         0))
    (fail 'textual-suffix-length))
(or (= 0
       (textual-suffix-length (as-text "aisle") (as-text "") 0 4))
    (fail 'textual-suffix-length))
(or (= 0
       (textual-suffix-length
         (as-text "aisle")
         (as-text "aabbccddee")
         0
         4))
    (fail 'textual-suffix-length))
(or (= 0
       (textual-suffix-length
         (as-text "bail")
         (as-text "aabbccddee")
         0
         1))
    (fail 'textual-suffix-length))
(or (= 0
       (textual-suffix-length (as-text "aisle") (as-text "") 1 4))
    (fail 'textual-suffix-length))
(or (= 0
       (textual-suffix-length
         (as-text "aisle")
         (as-text "aabbccddee")
         1
         4))
    (fail 'textual-suffix-length))
(or (= 1
       (textual-suffix-length
         (as-text "aisle")
         (as-text "aabbccddee")
         1
         5))
    (fail 'textual-suffix-length))
(or (= 0
       (textual-suffix-length
         (as-text "bail")
         (as-text "aabbccddee")
         1
         4))
    (fail 'textual-suffix-length))
(or (= 3
       (textual-suffix-length
         (as-text "place")
         (as-text "preface")
         1
         5))
    (fail 'textual-suffix-length))
(or (= 0
       (textual-suffix-length (as-text "") (as-text "") 0 0 0))
    (fail 'textual-suffix-length))
(or (= 0
       (textual-suffix-length (as-text "") (as-text "aabbccddee") 0
         0 0))
    (fail 'textual-suffix-length))
(or (= 0
       (textual-suffix-length (as-text "aisle") (as-text "") 0 4
         0))
    (fail 'textual-suffix-length))
(or (= 0
       (textual-suffix-length (as-text "aisle")
         (as-text "aabbccddee") 0 4 2))
    (fail 'textual-suffix-length))
(or (= 0
       (textual-suffix-length (as-text "bail")
         (as-text "aabbccddee") 0 1 2))
    (fail 'textual-suffix-length))
(or (= 3
       (textual-suffix-length (as-text "place") (as-text "preface")
         0 5 1))
    (fail 'textual-suffix-length))
(or (= 0
       (textual-suffix-length (as-text "aisle") (as-text "") 1 4
         0))
    (fail 'textual-suffix-length))
(or (= 0
       (textual-suffix-length (as-text "aisle")
         (as-text "aabbccddee") 1 4 3))
    (fail 'textual-suffix-length))
(or (= 0
       (textual-suffix-length (as-text "bail")
         (as-text "aabbccddee") 1 4 3))
    (fail 'textual-suffix-length))
(or (= 3
       (textual-suffix-length (as-text "place") (as-text "preface")
         1 5 1))
    (fail 'textual-suffix-length))
(or (= 0
       (textual-suffix-length (as-text "") (as-text "") 0 0 0 0))
    (fail 'textual-suffix-length))
(or (= 0
       (textual-suffix-length (as-text "") (as-text "aabbccddee") 0
         0 0 0))
    (fail 'textual-suffix-length))
(or (= 0
       (textual-suffix-length (as-text "aisle") (as-text "") 0 4 0
         0))
    (fail 'textual-suffix-length))
(or (= 1
       (textual-suffix-length "aisle" (as-text "aabbccddee") 0 5 2
         10))
    (fail 'textual-suffix-length))
(or (= 1
       (textual-suffix-length (as-text "bail")
         (as-text "aabbccddee") 0 1 2 4))
    (fail 'textual-suffix-length))
(or (= 0
       (textual-suffix-length (as-text "place") (as-text "preface")
         0 5 1 6))
    (fail 'textual-suffix-length))
(or (= 2
       (textual-suffix-length (as-text "place") (as-text "preface")
         0 4 1 6))
    (fail 'textual-suffix-length))
(or (= 0
       (textual-suffix-length (as-text "aisle") (as-text "") 1 4 0
         0))
    (fail 'textual-suffix-length))
(or (= 0
       (textual-suffix-length (as-text "aisle")
         (as-text "aabbccddee") 1 4 3 3))
    (fail 'textual-suffix-length))
(or (= 0
       (textual-suffix-length (as-text "bail")
         (as-text "aabbccddee") 1 4 3 6))
    (fail 'textual-suffix-length))
(or (= 3
       (textual-suffix-length (as-text "place") (as-text "preface")
         1 5 1 7))
    (fail 'textual-suffix-length))
(or (eq? #f (textual-prefix? ABC ABCDEF))
    (fail 'textual-prefix?))
(or (eq? #f (textual-prefix? ABCDEF ABC))
    (fail 'textual-prefix?))
(or (eq? #f (textual-prefix? ABCDEF DEFABC))
    (fail 'textual-prefix?))
(or (eq? #t (textual-prefix? DEFABC DEFABC))
    (fail 'textual-prefix?))
(or (eq? #t
         (textual-prefix? (textual->string DEFABC) DEFABC))
    (fail 'textual-prefix?))
(or (eq? #t
         (textual-prefix? DEFABC (textual->string DEFABC)))
    (fail 'textual-prefix?))
(or (eq? #t
         (textual-prefix?
           (textual->string DEFABC)
           (textual->string DEFABC)))
    (fail 'textual-prefix?))
(or (eq? #t (textual-prefix? (as-text "") (as-text "")))
    (fail 'textual-prefix?))
(or (eq? #t (textual-prefix? (as-text "") (as-text "abc")))
    (fail 'textual-prefix?))
(or (eq? #t (textual-prefix? (as-text "a") (as-text "abc")))
    (fail 'textual-prefix?))
(or (eq? #f (textual-prefix? (as-text "c") (as-text "abc")))
    (fail 'textual-prefix?))
(or (eq? #t
         (textual-prefix? (as-text "ab") (as-text "abc")))
    (fail 'textual-prefix?))
(or (eq? #f
         (textual-prefix? (as-text "ac") (as-text "abc")))
    (fail 'textual-prefix?))
(or (eq? #t
         (textual-prefix? (as-text "abc") (as-text "abc")))
    (fail 'textual-prefix?))
(or (eq? #f (textual-suffix? ABC ABCDEF))
    (fail 'textual-suffix?))
(or (eq? #f (textual-suffix? ABCDEF ABC))
    (fail 'textual-suffix?))
(or (eq? #f (textual-suffix? ABCDEF DEFABC))
    (fail 'textual-suffix?))
(or (eq? #t (textual-suffix? DEFABC DEFABC))
    (fail 'textual-suffix?))
(or (eq? #t
         (textual-suffix? (textual->string DEFABC) DEFABC))
    (fail 'textual-suffix?))
(or (eq? #t
         (textual-suffix? DEFABC (textual->string DEFABC)))
    (fail 'textual-suffix?))
(or (eq? #t (textual-suffix? (as-text "") (as-text "")))
    (fail 'textual-suffix?))
(or (eq? #t (textual-suffix? (as-text "") (as-text "abc")))
    (fail 'textual-suffix?))
(or (eq? #f (textual-suffix? (as-text "a") (as-text "abc")))
    (fail 'textual-suffix?))
(or (eq? #t (textual-suffix? (as-text "c") (as-text "abc")))
    (fail 'textual-suffix?))
(or (eq? #f
         (textual-suffix? (as-text "ac") (as-text "abc")))
    (fail 'textual-suffix?))
(or (eq? #t
         (textual-suffix? (as-text "bc") (as-text "abc")))
    (fail 'textual-suffix?))
(or (eq? #t
         (textual-suffix? (as-text "abc") (as-text "abc")))
    (fail 'textual-suffix?))
(or (eq? #t (textual-prefix? (as-text "") (as-text "") 0))
    (fail 'textual-prefix?))
(or (eq? #t
         (textual-prefix? (as-text "") (as-text "abc") 0))
    (fail 'textual-prefix?))
(or (eq? #t
         (textual-prefix? (as-text "a") (as-text "abc") 0))
    (fail 'textual-prefix?))
(or (eq? #f
         (textual-prefix? (as-text "c") (as-text "abc") 0))
    (fail 'textual-prefix?))
(or (eq? #t
         (textual-prefix? (as-text "ab") (as-text "abc") 0))
    (fail 'textual-prefix?))
(or (eq? #f
         (textual-prefix? (as-text "ac") (as-text "abc") 0))
    (fail 'textual-prefix?))
(or (eq? #t
         (textual-prefix? (as-text "abc") (as-text "abc") 0))
    (fail 'textual-prefix?))
(or (eq? #t (textual-suffix? (as-text "") (as-text "") 0))
    (fail 'textual-suffix?))
(or (eq? #t
         (textual-suffix? (as-text "") (as-text "abc") 0))
    (fail 'textual-suffix?))
(or (eq? #f
         (textual-suffix? (as-text "a") (as-text "abc") 0))
    (fail 'textual-suffix?))
(or (eq? #t
         (textual-suffix? (as-text "c") (as-text "abc") 0))
    (fail 'textual-suffix?))
(or (eq? #f
         (textual-suffix? (as-text "ac") (as-text "abc") 0))
    (fail 'textual-suffix?))
(or (eq? #t
         (textual-suffix? (as-text "bc") (as-text "abc") 0))
    (fail 'textual-suffix?))
(or (eq? #t
         (textual-suffix? (as-text "abc") (as-text "abc") 0))
    (fail 'textual-suffix?))
(or (eq? #t
         (textual-prefix? (as-text "ab") (as-text "abc") 2))
    (fail 'textual-prefix?))
(or (eq? #t
         (textual-prefix? (as-text "ac") (as-text "abc") 2))
    (fail 'textual-prefix?))
(or (eq? #f
         (textual-prefix? (as-text "abc") (as-text "abc") 2))
    (fail 'textual-prefix?))
(or (eq? #t
         (textual-suffix? (as-text "ac") (as-text "abc") 2))
    (fail 'textual-suffix?))
(or (eq? #t
         (textual-suffix? (as-text "bc") (as-text "abc") 2))
    (fail 'textual-suffix?))
(or (eq? #t
         (textual-suffix? (as-text "abc") (as-text "abc") 2))
    (fail 'textual-suffix?))
(or (eq? #t (textual-prefix? (as-text "") (as-text "") 0 0))
    (fail 'textual-prefix?))
(or (eq? #t
         (textual-prefix? (as-text "") (as-text "abc") 0 0))
    (fail 'textual-prefix?))
(or (eq? #t
         (textual-prefix? (as-text "a") (as-text "abc") 0 0))
    (fail 'textual-prefix?))
(or (eq? #f
         (textual-prefix? (as-text "c") (as-text "abc") 0 1))
    (fail 'textual-prefix?))
(or (eq? #t
         (textual-prefix? (as-text "ab") (as-text "abc") 0 1))
    (fail 'textual-prefix?))
(or (eq? #t
         (textual-prefix? (as-text "ab") (as-text "abc") 0 2))
    (fail 'textual-prefix?))
(or (eq? #f
         (textual-prefix? (as-text "ac") (as-text "abc") 0 2))
    (fail 'textual-prefix?))
(or (eq? #t
         (textual-prefix? (as-text "abc") (as-text "abc") 0 3))
    (fail 'textual-prefix?))
(or (eq? #t (textual-suffix? (as-text "") (as-text "") 0 0))
    (fail 'textual-suffix?))
(or (eq? #t
         (textual-suffix? (as-text "") (as-text "abc") 0 0))
    (fail 'textual-suffix?))
(or (eq? #f
         (textual-suffix? (as-text "a") (as-text "abc") 0 1))
    (fail 'textual-suffix?))
(or (eq? #t
         (textual-suffix? (as-text "c") (as-text "abc") 0 1))
    (fail 'textual-suffix?))
(or (eq? #t
         (textual-suffix? (as-text "ac") (as-text "abc") 1 2))
    (fail 'textual-suffix?))
(or (eq? #f
         (textual-suffix? (as-text "ac") (as-text "abc") 0 2))
    (fail 'textual-suffix?))
(or (eq? #t
         (textual-suffix? (as-text "bc") (as-text "abc") 0 2))
    (fail 'textual-suffix?))
(or (eq? #t
         (textual-suffix? (as-text "abc") (as-text "abc") 0 3))
    (fail 'textual-suffix?))
(or (eq? #t
         (textual-prefix? (as-text "ab") (as-text "abc") 2 2))
    (fail 'textual-prefix?))
(or (eq? #t
         (textual-prefix? (as-text "ac") (as-text "abc") 2 2))
    (fail 'textual-prefix?))
(or (eq? #f
         (textual-prefix? (as-text "abc") (as-text "abc") 2 3))
    (fail 'textual-prefix?))
(or (eq? #t
         (textual-suffix? (as-text "ac") (as-text "abc") 2 2))
    (fail 'textual-suffix?))
(or (eq? #t
         (textual-suffix? (as-text "bc") (as-text "abc") 2 2))
    (fail 'textual-suffix?))
(or (eq? #t
         (textual-suffix? (as-text "abc") (as-text "abc") 2 3))
    (fail 'textual-suffix?))
(or (eq? #t
         (textual-prefix? (as-text "") (as-text "") 0 0 0))
    (fail 'textual-prefix?))
(or (eq? #t
         (textual-prefix? (as-text "") (as-text "abc") 0 0 0))
    (fail 'textual-prefix?))
(or (eq? #t
         (textual-prefix? (as-text "a") (as-text "abc") 0 0 0))
    (fail 'textual-prefix?))
(or (eq? #f
         (textual-prefix? (as-text "c") (as-text "abc") 0 1 0))
    (fail 'textual-prefix?))
(or (eq? #t
         (textual-prefix? (as-text "ab") (as-text "abc") 0 1 0))
    (fail 'textual-prefix?))
(or (eq? #t
         (textual-prefix? (as-text "ab") (as-text "abc") 0 2 0))
    (fail 'textual-prefix?))
(or (eq? #f
         (textual-prefix? (as-text "ac") (as-text "abc") 0 2 0))
    (fail 'textual-prefix?))
(or (eq? #t
         (textual-prefix? (as-text "abc") (as-text "abc") 0 3 0))
    (fail 'textual-prefix?))
(or (eq? #t
         (textual-suffix? (as-text "") (as-text "") 0 0 0))
    (fail 'textual-suffix?))
(or (eq? #t
         (textual-suffix? (as-text "") (as-text "abc") 0 0 0))
    (fail 'textual-suffix?))
(or (eq? #f
         (textual-suffix? (as-text "a") (as-text "abc") 0 1 0))
    (fail 'textual-suffix?))
(or (eq? #t
         (textual-suffix? (as-text "c") (as-text "abc") 0 1 0))
    (fail 'textual-suffix?))
(or (eq? #t
         (textual-suffix? (as-text "ac") (as-text "abc") 1 2 0))
    (fail 'textual-suffix?))
(or (eq? #f
         (textual-suffix? (as-text "ac") (as-text "abc") 0 2 0))
    (fail 'textual-suffix?))
(or (eq? #t
         (textual-suffix? (as-text "bc") (as-text "abc") 0 2 0))
    (fail 'textual-suffix?))
(or (eq? #t
         (textual-suffix? (as-text "abc") (as-text "abc") 0 3 0))
    (fail 'textual-suffix?))
(or (eq? #t
         (textual-prefix? (as-text "ab") (as-text "abc") 2 2 0))
    (fail 'textual-prefix?))
(or (eq? #t
         (textual-prefix? (as-text "ac") (as-text "abc") 2 2 0))
    (fail 'textual-prefix?))
(or (eq? #f
         (textual-prefix? (as-text "abc") (as-text "abc") 2 3 0))
    (fail 'textual-prefix?))
(or (eq? #t
         (textual-suffix? (as-text "ac") (as-text "abc") 2 2 0))
    (fail 'textual-suffix?))
(or (eq? #t
         (textual-suffix? (as-text "bc") (as-text "abc") 2 2 0))
    (fail 'textual-suffix?))
(or (eq? #t
         (textual-suffix? (as-text "abc") (as-text "abc") 2 3 0))
    (fail 'textual-suffix?))
(or (eq? #t
         (textual-prefix? (as-text "") (as-text "abc") 0 0 1))
    (fail 'textual-prefix?))
(or (eq? #t
         (textual-prefix? (as-text "a") (as-text "abc") 0 0 1))
    (fail 'textual-prefix?))
(or (eq? #t
         (textual-prefix? (as-text "c") (as-text "abc") 0 1 2))
    (fail 'textual-prefix?))
(or (eq? #f
         (textual-prefix? (as-text "ab") (as-text "abc") 0 1 2))
    (fail 'textual-prefix?))
(or (eq? #f
         (textual-prefix? (as-text "ab") (as-text "abc") 0 2 1))
    (fail 'textual-prefix?))
(or (eq? #f
         (textual-prefix? (as-text "ac") (as-text "abc") 0 2 1))
    (fail 'textual-prefix?))
(or (eq? #f
         (textual-prefix? (as-text "abc") (as-text "abc") 0 3 1))
    (fail 'textual-prefix?))
(or (eq? #f
         (textual-suffix? (as-text "a") (as-text "abc") 0 1 2))
    (fail 'textual-suffix?))
(or (eq? #t
         (textual-suffix? (as-text "c") (as-text "abc") 0 1 1))
    (fail 'textual-suffix?))
(or (eq? #t
         (textual-suffix? (as-text "ac") (as-text "abc") 1 2 2))
    (fail 'textual-suffix?))
(or (eq? #t
         (textual-suffix? (as-text "bc") (as-text "abc") 0 2 1))
    (fail 'textual-suffix?))
(or (eq? #f
         (textual-suffix? (as-text "bc") (as-text "abc") 0 2 2))
    (fail 'textual-suffix?))
(or (eq? #t
         (textual-prefix? (as-text "") (as-text "") 0 0 0 0))
    (fail 'textual-prefix?))
(or (eq? #t
         (textual-prefix? (as-text "") (as-text "abc") 0 0 0 3))
    (fail 'textual-prefix?))
(or (eq? #t
         (textual-prefix? (as-text "a") (as-text "abc") 0 0 0 3))
    (fail 'textual-prefix?))
(or (eq? #f
         (textual-prefix? (as-text "c") (as-text "abc") 0 1 0 3))
    (fail 'textual-prefix?))
(or (eq? #t
         (textual-prefix? (as-text "ab") (as-text "abc") 0 1 0 3))
    (fail 'textual-prefix?))
(or (eq? #t
         (textual-prefix? (as-text "ab") (as-text "abc") 0 2 0 3))
    (fail 'textual-prefix?))
(or (eq? #f
         (textual-prefix? (as-text "ac") (as-text "abc") 0 2 0 3))
    (fail 'textual-prefix?))
(or (eq? #t
         (textual-prefix? (as-text "abc") (as-text "abc") 0 3 0 3))
    (fail 'textual-prefix?))
(or (eq? #t
         (textual-suffix? (as-text "") (as-text "abc") 0 0 0 3))
    (fail 'textual-suffix?))
(or (eq? #f
         (textual-suffix? (as-text "a") (as-text "abc") 0 1 0 3))
    (fail 'textual-suffix?))
(or (eq? #t
         (textual-suffix? (as-text "c") (as-text "abc") 0 1 0 3))
    (fail 'textual-suffix?))
(or (eq? #t
         (textual-suffix? (as-text "ac") (as-text "abc") 1 2 0 3))
    (fail 'textual-suffix?))
(or (eq? #f
         (textual-suffix? (as-text "ac") (as-text "abc") 0 2 0 3))
    (fail 'textual-suffix?))
(or (eq? #t
         (textual-suffix? (as-text "bc") (as-text "abc") 0 2 0 3))
    (fail 'textual-suffix?))
(or (eq? #t
         (textual-suffix? (as-text "abc") (as-text "abc") 0 3 0 3))
    (fail 'textual-suffix?))
(or (eq? #t
         (textual-prefix? (as-text "ab") (as-text "abc") 2 2 0 3))
    (fail 'textual-prefix?))
(or (eq? #t
         (textual-prefix? (as-text "ac") (as-text "abc") 2 2 0 3))
    (fail 'textual-prefix?))
(or (eq? #f
         (textual-prefix? (as-text "abc") (as-text "abc") 2 3 0 3))
    (fail 'textual-prefix?))
(or (eq? #t
         (textual-suffix? (as-text "ac") (as-text "abc") 2 2 0 3))
    (fail 'textual-suffix?))
(or (eq? #t
         (textual-suffix? (as-text "bc") (as-text "abc") 2 2 0 3))
    (fail 'textual-suffix?))
(or (eq? #t
         (textual-suffix? (as-text "abc") (as-text "abc") 2 3 0 3))
    (fail 'textual-suffix?))
(or (eq? #t
         (textual-prefix? (as-text "") (as-text "abc") 0 0 1 3))
    (fail 'textual-prefix?))
(or (eq? #t
         (textual-prefix? (as-text "a") (as-text "abc") 0 0 1 3))
    (fail 'textual-prefix?))
(or (eq? #t
         (textual-prefix? (as-text "c") (as-text "abc") 0 1 2 3))
    (fail 'textual-prefix?))
(or (eq? #f
         (textual-prefix? (as-text "ab") (as-text "abc") 0 1 2 3))
    (fail 'textual-prefix?))
(or (eq? #f
         (textual-prefix? (as-text "ab") (as-text "abc") 0 2 1 3))
    (fail 'textual-prefix?))
(or (eq? #f
         (textual-prefix? (as-text "ac") (as-text "abc") 0 2 1 3))
    (fail 'textual-prefix?))
(or (eq? #f
         (textual-prefix? (as-text "abc") (as-text "abc") 0 3 1 3))
    (fail 'textual-prefix?))
(or (eq? #f
         (textual-suffix? (as-text "a") (as-text "abc") 0 1 2 3))
    (fail 'textual-suffix?))
(or (eq? #t
         (textual-suffix? (as-text "c") (as-text "abc") 0 1 1 3))
    (fail 'textual-suffix?))
(or (eq? #t
         (textual-suffix? (as-text "ac") (as-text "abc") 1 2 2 3))
    (fail 'textual-suffix?))
(or (eq? #t
         (textual-suffix? (as-text "bc") (as-text "abc") 0 2 1 3))
    (fail 'textual-suffix?))
(or (eq? #f
         (textual-suffix? (as-text "bc") (as-text "abc") 0 2 2 3))
    (fail 'textual-suffix?))
(or (eq? #t
         (textual-prefix? (as-text "") (as-text "abc") 0 0 0 2))
    (fail 'textual-prefix?))
(or (eq? #t
         (textual-prefix? (as-text "a") (as-text "abc") 0 0 0 2))
    (fail 'textual-prefix?))
(or (eq? #f
         (textual-prefix? (as-text "c") (as-text "abc") 0 1 0 2))
    (fail 'textual-prefix?))
(or (eq? #t
         (textual-prefix? (as-text "ab") (as-text "abc") 0 1 0 2))
    (fail 'textual-prefix?))
(or (eq? #f
         (textual-prefix? (as-text "abc") (as-text "abc") 0 3 0 2))
    (fail 'textual-prefix?))
(or (eq? #t
         (textual-suffix? (as-text "") (as-text "abc") 0 0 0 2))
    (fail 'textual-suffix?))
(or (eq? #f
         (textual-suffix? (as-text "c") (as-text "abc") 0 1 0 2))
    (fail 'textual-suffix?))
(or (eq? #f
         (textual-suffix? (as-text "ac") (as-text "abc") 1 2 0 2))
    (fail 'textual-suffix?))
(or (eqv? #f (textual-index (as-text "") char?))
    (fail 'textual-index))
(or (eqv? 0 (textual-index (as-text "abcdef") char?))
    (fail 'textual-index))
(or (eqv?
      4
      (textual-index
        (as-text "abcdef")
        (lambda (c) (char>? c #\d))))
    (fail 'textual-index))
(or (eqv?
      #f
      (textual-index (as-text "abcdef") char-whitespace?))
    (fail 'textual-index))
(or (eqv? #f (textual-index-right (as-text "") char?))
    (fail 'textual-index-right))
(or (eqv? 5 (textual-index-right (as-text "abcdef") char?))
    (fail 'textual-index-right))
(or (eqv?
      5
      (textual-index-right
        (as-text "abcdef")
        (lambda (c) (char>? c #\d))))
    (fail 'textual-index-right))
(or (eqv?
      #f
      (textual-index-right (as-text "abcdef") char-whitespace?))
    (fail 'textual-index-right))
(or (eqv? #f (textual-skip (as-text "") string?))
    (fail 'textual-skip))
(or (eqv? 0 (textual-skip (as-text "abcdef") string?))
    (fail 'textual-skip))
(or (eqv?
      4
      (textual-skip
        (as-text "abcdef")
        (lambda (c) (char<=? c #\d))))
    (fail 'textual-skip))
(or (eqv? #f (textual-skip (as-text "abcdef") char?))
    (fail 'textual-skip))
(or (eqv? #f (textual-skip-right (as-text "") string?))
    (fail 'textual-skip-right))
(or (eqv? 5 (textual-skip-right (as-text "abcdef") string?))
    (fail 'textual-skip-right))
(or (eqv?
      5
      (textual-skip-right
        (as-text "abcdef")
        (lambda (c) (char<=? c #\d))))
    (fail 'textual-skip-right))
(or (eqv? #f (textual-skip-right (as-text "abcdef") char?))
    (fail 'textual-skip-right))
(or (eqv? 2 (textual-index "abcdef" char? 2))
    (fail 'textual-index))
(or (eqv?
      4
      (textual-index "abcdef" (lambda (c) (char>? c #\d)) 2))
    (fail 'textual-index))
(or (eqv? #f (textual-index "abcdef" char-whitespace? 2))
    (fail 'textual-index))
(or (eqv? 5 (textual-index-right "abcdef" char? 2))
    (fail 'textual-index-right))
(or (eqv?
      5
      (textual-index-right
        "abcdef"
        (lambda (c) (char>? c #\d))
        2))
    (fail 'textual-index-right))
(or (eqv?
      #f
      (textual-index-right "abcdef" char-whitespace? 2))
    (fail 'textual-index-right))
(or (eqv? 2 (textual-skip "abcdef" string? 2))
    (fail 'textual-skip))
(or (eqv?
      4
      (textual-skip "abcdef" (lambda (c) (char<=? c #\d)) 2))
    (fail 'textual-skip))
(or (eqv? #f (textual-skip "abcdef" char? 2))
    (fail 'textual-skip))
(or (eqv? 5 (textual-skip-right "abcdef" string? 2))
    (fail 'textual-skip-right))
(or (eqv?
      5
      (textual-skip-right
        "abcdef"
        (lambda (c) (char<=? c #\d))
        2))
    (fail 'textual-skip-right))
(or (eqv? #f (textual-skip-right "abcdef" char? 2))
    (fail 'textual-skip-right))
(or (eqv? 2 (textual-index (as-text "abcdef") char? 2 5))
    (fail 'textual-index))
(or (eqv?
      4
      (textual-index
        (as-text "abcdef")
        (lambda (c) (char>? c #\d))
        2
        5))
    (fail 'textual-index))
(or (eqv?
      #f
      (textual-index (as-text "abcdef") char-whitespace? 2 5))
    (fail 'textual-index))
(or (eqv?
      4
      (textual-index-right (as-text "abcdef") char? 2 5))
    (fail 'textual-index-right))
(or (eqv?
      4
      (textual-index-right
        (as-text "abcdef")
        (lambda (c) (char>? c #\d))
        2
        5))
    (fail 'textual-index-right))
(or (eqv?
      #f
      (textual-index-right
        (as-text "abcdef")
        char-whitespace?
        2
        5))
    (fail 'textual-index-right))
(or (eqv? 2 (textual-skip (as-text "abcdef") string? 2 5))
    (fail 'textual-skip))
(or (eqv?
      4
      (textual-skip
        (as-text "abcdef")
        (lambda (c) (char<=? c #\d))
        2
        5))
    (fail 'textual-skip))
(or (eqv? #f (textual-skip (as-text "abcdef") char? 2 5))
    (fail 'textual-skip))
(or (eqv?
      4
      (textual-skip-right (as-text "abcdef") string? 2 5))
    (fail 'textual-skip-right))
(or (eqv?
      4
      (textual-skip-right
        (as-text "abcdef")
        (lambda (c) (char<=? c #\d))
        2
        5))
    (fail 'textual-skip-right))
(or (eqv?
      #f
      (textual-skip-right (as-text "abcdef") char? 2 5))
    (fail 'textual-skip-right))
(or (eqv? 0 (textual-contains (as-text "") (as-text "")))
    (fail 'textual-contains))
(or (eqv?
      0
      (textual-contains (as-text "abcdeffffoo") (as-text "")))
    (fail 'textual-contains))
(or (eqv?
      0
      (textual-contains (as-text "abcdeffffoo") (as-text "a")))
    (fail 'textual-contains))
(or (eqv?
      5
      (textual-contains (as-text "abcdeffffoo") (as-text "ff")))
    (fail 'textual-contains))
(or (eqv?
      4
      (textual-contains (as-text "abcdeffffoo") (as-text "eff")))
    (fail 'textual-contains))
(or (eqv?
      8
      (textual-contains (as-text "abcdeffffoo") (as-text "foo")))
    (fail 'textual-contains))
(or (eqv?
      #f
      (textual-contains
        (as-text "abcdeffffoo")
        (as-text "efffoo")))
    (fail 'textual-contains))
(or (eqv?
      0
      (textual-contains-right (as-text "") (as-text "")))
    (fail 'textual-contains-right))
(or (eqv?
      11
      (textual-contains-right
        (as-text "abcdeffffoo")
        (as-text "")))
    (fail 'textual-contains-right))
(or (eqv?
      0
      (textual-contains-right
        (as-text "abcdeffffoo")
        (as-text "a")))
    (fail 'textual-contains-right))
(or (eqv?
      7
      (textual-contains-right
        (as-text "abcdeffffoo")
        (as-text "ff")))
    (fail 'textual-contains-right))
(or (eqv?
      4
      (textual-contains-right
        (as-text "abcdeffffoo")
        (as-text "eff")))
    (fail 'textual-contains-right))
(or (eqv?
      8
      (textual-contains-right
        (as-text "abcdeffffoo")
        (as-text "foo")))
    (fail 'textual-contains-right))
(or (eqv?
      #f
      (textual-contains-right
        (as-text "abcdeffffoo")
        (as-text "efffoo")))
    (fail 'textual-contains-right))
(or (eqv? 0 (textual-contains "" "" 0))
    (fail 'textual-contains))
(or (eqv? 2 (textual-contains "abcdeffffoo" "" 2))
    (fail 'textual-contains))
(or (eqv? #f (textual-contains "abcdeffffoo" "a" 2))
    (fail 'textual-contains))
(or (eqv? 5 (textual-contains "abcdeffffoo" "ff" 2))
    (fail 'textual-contains))
(or (eqv? 4 (textual-contains "abcdeffffoo" "eff" 2))
    (fail 'textual-contains))
(or (eqv? 8 (textual-contains "abcdeffffoo" "foo" 2))
    (fail 'textual-contains))
(or (eqv? #f (textual-contains "abcdeffffoo" "efffoo" 2))
    (fail 'textual-contains))
(or (eqv? 0 (textual-contains-right "" "" 0))
    (fail 'textual-contains-right))
(or (eqv? 11 (textual-contains-right "abcdeffffoo" "" 2))
    (fail 'textual-contains-right))
(or (eqv? #f (textual-contains-right "abcdeffffoo" "a" 2))
    (fail 'textual-contains-right))
(or (eqv? 7 (textual-contains-right "abcdeffffoo" "ff" 2))
    (fail 'textual-contains-right))
(or (eqv? 4 (textual-contains-right "abcdeffffoo" "eff" 2))
    (fail 'textual-contains-right))
(or (eqv? 8 (textual-contains-right "abcdeffffoo" "foo" 2))
    (fail 'textual-contains-right))
(or (eqv?
      #f
      (textual-contains-right "abcdeffffoo" "efffoo" 2))
    (fail 'textual-contains-right))
(or (eqv?
      0
      (textual-contains (as-text "") (as-text "") 0 0))
    (fail 'textual-contains))
(or (eqv?
      2
      (textual-contains
        (as-text "abcdeffffoo")
        (as-text "")
        2
        10))
    (fail 'textual-contains))
(or (eqv?
      #f
      (textual-contains
        (as-text "abcdeffffoo")
        (as-text "a")
        2
        10))
    (fail 'textual-contains))
(or (eqv?
      5
      (textual-contains
        (as-text "abcdeffffoo")
        (as-text "ff")
        2
        10))
    (fail 'textual-contains))
(or (eqv?
      4
      (textual-contains
        (as-text "abcdeffffoo")
        (as-text "eff")
        2
        10))
    (fail 'textual-contains))
(or (eqv?
      #f
      (textual-contains
        (as-text "abcdeffffoo")
        (as-text "foo")
        2
        10))
    (fail 'textual-contains))
(or (eqv?
      #f
      (textual-contains
        (as-text "abcdeffffoo")
        (as-text "efffoo")
        2
        10))
    (fail 'textual-contains))
(or (eqv?
      0
      (textual-contains-right (as-text "") (as-text "") 0 0))
    (fail 'textual-contains-right))
(or (eqv?
      10
      (textual-contains-right
        (as-text "abcdeffffoo")
        (as-text "")
        2
        10))
    (fail 'textual-contains-right))
(or (eqv?
      #f
      (textual-contains-right
        (as-text "abcdeffffoo")
        (as-text "a")
        2
        10))
    (fail 'textual-contains-right))
(or (eqv?
      7
      (textual-contains-right
        (as-text "abcdeffffoo")
        (as-text "ff")
        2
        10))
    (fail 'textual-contains-right))
(or (eqv?
      4
      (textual-contains-right
        (as-text "abcdeffffoo")
        (as-text "eff")
        2
        10))
    (fail 'textual-contains-right))
(or (eqv?
      #f
      (textual-contains-right (as-text "abcdeffffoo") "foo" 2 10))
    (fail 'textual-contains-right))
(or (eqv?
      #f
      (textual-contains-right
        "abcdeffffoo"
        (as-text "efffoo")
        2
        10))
    (fail 'textual-contains-right))
(or (eqv? 0 (textual-contains "" "" 0 0 0))
    (fail 'textual-contains))
(or (eqv? 2 (textual-contains "abcdeffffoo" "" 2 10 0))
    (fail 'textual-contains))
(or (eqv? 2 (textual-contains "abcdeffffoo" "a" 2 10 1))
    (fail 'textual-contains))
(or (eqv? 5 (textual-contains "abcdeffffoo" "ff" 2 10 1))
    (fail 'textual-contains))
(or (eqv? 5 (textual-contains "abcdeffffoo" "eff" 2 10 1))
    (fail 'textual-contains))
(or (eqv? #f (textual-contains "abcdeffffoo" "foo" 2 10 1))
    (fail 'textual-contains))
(or (eqv?
      #f
      (textual-contains "abcdeffffoo" "efffoo" 2 10 1))
    (fail 'textual-contains))
(or (eqv? 0 (textual-contains-right "" "" 0 0 0))
    (fail 'textual-contains-right))
(or (eqv?
      10
      (textual-contains-right "abcdeffffoo" "" 2 10 0))
    (fail 'textual-contains-right))
(or (eqv?
      10
      (textual-contains-right "abcdeffffoo" "a" 2 10 1))
    (fail 'textual-contains-right))
(or (eqv?
      8
      (textual-contains-right "abcdeffffoo" "ff" 2 10 1))
    (fail 'textual-contains-right))
(or (eqv?
      7
      (textual-contains-right "abcdeffffoo" "eff" 2 10 1))
    (fail 'textual-contains-right))
(or (eqv?
      #f
      (textual-contains-right "abcdeffffoo" "foo" 2 10 1))
    (fail 'textual-contains-right))
(or (eqv?
      #f
      (textual-contains-right "abcdeffffoo" "efffoo" 2 10 1))
    (fail 'textual-contains-right))
(or (eqv? 0 (textual-contains "" "" 0 0 0 0))
    (fail 'textual-contains))
(or (eqv? 2 (textual-contains "abcdeffffoo" "" 2 10 0 0))
    (fail 'textual-contains))
(or (eqv? 2 (textual-contains "abcdeffffoo" "a" 2 10 1 1))
    (fail 'textual-contains))
(or (eqv? 5 (textual-contains "abcdeffffoo" "ff" 2 10 1 2))
    (fail 'textual-contains))
(or (eqv? 5 (textual-contains "abcdeffffoo" "eff" 2 10 1 2))
    (fail 'textual-contains))
(or (eqv? 9 (textual-contains "abcdeffffoo" "foo" 2 10 1 2))
    (fail 'textual-contains))
(or (eqv?
      4
      (textual-contains "abcdeffffoo" "efffoo" 2 10 0 2))
    (fail 'textual-contains))
(or (eqv? 0 (textual-contains-right "" "" 0 0 0 0))
    (fail 'textual-contains-right))
(or (eqv?
      10
      (textual-contains-right "abcdeffffoo" "" 2 10 0 0))
    (fail 'textual-contains-right))
(or (eqv?
      10
      (textual-contains-right "abcdeffffoo" "a" 2 10 1 1))
    (fail 'textual-contains-right))
(or (eqv?
      8
      (textual-contains-right "abcdeffffoo" "ff" 2 10 1 2))
    (fail 'textual-contains-right))
(or (eqv?
      8
      (textual-contains-right "abcdeffffoo" "eff" 2 10 1 2))
    (fail 'textual-contains-right))
(or (eqv?
      9
      (textual-contains-right "abcdeffffoo" "foo" 2 10 1 2))
    (fail 'textual-contains-right))
(or (eqv?
      7
      (textual-contains-right "abcdeffffoo" "efffoo" 2 10 1 3))
    (fail 'textual-contains-right))
(or (result=?
      "1234STRIKES"
      (textual-upcase (as-text "1234Strikes")))
    (fail 'textual-upcase))
(or (result=?
      "1234STRIKES"
      (textual-upcase (as-text "1234strikes")))
    (fail 'textual-upcase))
(or (result=?
      "1234STRIKES"
      (textual-upcase (as-text "1234STRIKES")))
    (fail 'textual-upcase))
(or (result=?
      "1234strikes"
      (textual-downcase (as-text "1234Strikes")))
    (fail 'textual-downcase))
(or (result=?
      "1234strikes"
      (textual-downcase (as-text "1234strikes")))
    (fail 'textual-downcase))
(or (result=?
      "1234strikes"
      (textual-downcase (as-text "1234STRIKES")))
    (fail 'textual-downcase))
(or (result=?
      "1234strikes"
      (textual-foldcase (as-text "1234Strikes")))
    (fail 'textual-foldcase))
(or (result=?
      "1234strikes"
      (textual-foldcase (as-text "1234strikes")))
    (fail 'textual-foldcase))
(or (result=?
      "1234strikes"
      (textual-foldcase (as-text "1234STRIKES")))
    (fail 'textual-foldcase))
(or (result=?
      "And With Three Strikes You Are Out"
      (textual-titlecase
        (as-text "and with THREE STRIKES you are oUT")))
    (fail 'textual-titlecase))
(or (result=? "" (textual-append)) (fail 'textual-append))
(or (result=?
      "abcdef"
      (textual-append (as-text "") (as-text "a") (as-text "bcd")
        "" "ef" "" ""))
    (fail 'textual-append))
(or (result=? "" (textual-concatenate '()))
    (fail 'textual-concatenate))
(or (result=?
      "abcdef"
      (textual-concatenate
        (map string->text '("" "a" "bcd" "" "ef" "" ""))))
    (fail 'textual-concatenate))
(let* ([alphabet "abcdefghijklmnopqrstuvwxyz"]
       [str1 alphabet]
       [str10 (apply
                string-append
                (vector->list (make-vector 10 str1)))]
       [str100 (apply
                 string-append
                 (vector->list (make-vector 10 str10)))]
       [str100-500 (substring str100 100 500)]
       [str600-999 (substring str100 600 999)]
       [alph1 (textual-copy alphabet)]
       [alph10 (textual-concatenate
                 (vector->list (make-vector 10 alph1)))]
       [alph100 (textual-concatenate
                  (vector->list (make-vector 10 alph10)))]
       [t100-500 (subtext alph100 100 500)]
       [t600-999 (subtext alph100 600 999)])
  (or (result=? str10 alph10) (fail 'textual-concatenate))
  (or (result=? str100 alph100) (fail 'textual-concatenate))
  (or (result=? str100-500 t100-500)
      (fail 'textual-concatenate))
  (or (result=? str600-999 t600-999)
      (fail 'textual-concatenate))
  (or (result=?
        (string-append str1 str600-999)
        (textual-concatenate (list alph1 t600-999)))
      (fail 'textual-concatenate))
  (or (result=?
        (string-append str1 str600-999)
        (textual-concatenate (list alph1 (textual-copy t600-999))))
      (fail 'textual-concatenate))
  (or (result=?
        (string-append str600-999 str1)
        (textual-concatenate (list t600-999 alph1)))
      (fail 'textual-concatenate))
  (or (result=?
        (string-append str600-999 str1)
        (textual-concatenate (list (textual-copy t600-999) alph1)))
      (fail 'textual-concatenate)))
(or (result=? "" (textual-concatenate-reverse '()))
    (fail 'textual-concatenate-reverse))
(or (result=?
      "efbcda"
      (textual-concatenate-reverse
        (map string->text '("" "a" "bcd" "" "ef" "" ""))))
    (fail 'textual-concatenate-reverse))
(or (result=?
      "huh?"
      (textual-concatenate-reverse '() "huh?"))
    (fail 'textual-concatenate-reverse))
(or (result=?
      "efbcdaxy"
      (textual-concatenate-reverse
        '("" "a" "bcd" "" "ef" "" "")
        "xy"))
    (fail 'textual-concatenate-reverse))
(or (result=?
      "huh"
      (textual-concatenate-reverse '() "huh?" 3))
    (fail 'textual-concatenate-reverse))
(or (result=?
      "efbcdax"
      (textual-concatenate-reverse
        '("" "a" "bcd" "" "ef" "" "")
        "x"
        1))
    (fail 'textual-concatenate-reverse))
(or (result=? "" (textual-join '())) (fail 'textual-join))
(or (result=?
      " ab cd  e f "
      (textual-join
        (map string->text '("" "ab" "cd" "" "e" "f" ""))))
    (fail 'textual-join))
(or (result=? "" (textual-join '() ""))
    (fail 'textual-join))
(or (result=?
      "abcdef"
      (textual-join '("" "ab" "cd" "" "e" "f" "") ""))
    (fail 'textual-join))
(or (result=? "" (textual-join '() "xyz"))
    (fail 'textual-join))
(or (result=?
      "xyzabxyzcdxyzxyzexyzfxyz"
      (textual-join '("" "ab" "cd" "" "e" "f" "") "xyz"))
    (fail 'textual-join))
(or (result=? "" (textual-join '() "" 'infix))
    (fail 'textual-join))
(or (result=?
      "abcdef"
      (textual-join '("" "ab" "cd" "" "e" "f" "") "" 'infix))
    (fail 'textual-join))
(or (result=? "" (textual-join '() "xyz" 'infix))
    (fail 'textual-join))
(or (result=?
      "xyzabxyzcdxyzxyzexyzfxyz"
      (textual-join
        '("" "ab" "cd" "" "e" "f" "")
        (as-text "xyz")
        'infix))
    (fail 'textual-join))
(or (equal?
      'horror
      (guard (exn [#t 'horror])
        (textual-join '() "" 'strict-infix)))
    (fail 'textual-join))
(or (result=?
      "abcdef"
      (textual-join
        '("" "ab" "cd" "" "e" "f" "")
        ""
        'strict-infix))
    (fail 'textual-join))
(or (equal?
      'wham
      (guard (exn [else 'wham])
        (textual-join '() "xyz" 'strict-infix)))
    (fail 'textual-join))
(or (result=?
      "xyzabxyzcdxyzxyzexyzfxyz"
      (textual-join
        '("" "ab" "cd" "" "e" "f" "")
        "xyz"
        'strict-infix))
    (fail 'textual-join))
(or (result=? "" (textual-join '() "" 'suffix))
    (fail 'textual-join))
(or (result=?
      "abcdef"
      (textual-join '("" "ab" "cd" "" "e" "f" "") "" 'suffix))
    (fail 'textual-join))
(or (result=? "" (textual-join '() "xyz" 'suffix))
    (fail 'textual-join))
(or (result=?
      "xyzabxyzcdxyzxyzexyzfxyzxyz"
      (textual-join '("" "ab" "cd" "" "e" "f" "") "xyz" 'suffix))
    (fail 'textual-join))
(or (result=? "" (textual-join '() "" 'prefix))
    (fail 'textual-join))
(or (result=?
      "abcdef"
      (textual-join '("" "ab" "cd" "" "e" "f" "") "" 'prefix))
    (fail 'textual-join))
(or (result=? "" (textual-join '() "xyz" 'prefix))
    (fail 'textual-join))
(or (result=?
      "xyzxyzabxyzcdxyzxyzexyzfxyz"
      (textual-join '("" "ab" "cd" "" "e" "f" "") "xyz" 'prefix))
    (fail 'textual-join))
(or (= 8
       (textual-fold
         (lambda (c count)
           (if (char-whitespace? c) (+ count 1) count))
         0
         (as-text " ...a couple of spaces in this one... ")))
    (fail 'textual-fold))
(or (= 7
       (textual-fold
         (lambda (c count)
           (if (char-whitespace? c) (+ count 1) count))
         0
         " ...a couple of spaces in this one... "
         1))
    (fail 'textual-fold))
(or (= 6
       (textual-fold
         (lambda (c count)
           (if (char-whitespace? c) (+ count 1) count))
         0 " ...a couple of spaces in this one... " 1 32))
    (fail 'textual-fold))
(or (equal?
      (string->list "abcdef")
      (textual-fold-right cons '() "abcdef"))
    (fail 'textual-fold-right))
(or (equal?
      (string->list "def")
      (textual-fold-right cons '() (as-text "abcdef") 3))
    (fail 'textual-fold-right))
(or (equal?
      (string->list "cde")
      (textual-fold-right cons '() (as-text "abcdef") 2 5))
    (fail 'textual-fold-right))
(or (string=?
      "aabraacaadaabraa"
      (let* ([s (as-text "abracadabra")]
             [ans-len (textual-fold
                        (lambda (c sum) (+ sum (if (char=? c #\a) 2 1)))
                        0
                        s)]
             [ans (make-string ans-len)])
        (textual-fold
          (lambda (c i)
            (let ([i (if (char=? c #\a)
                         (begin (string-set! ans i #\a) (+ i 1))
                         i)])
              (string-set! ans i c)
              (+ i 1)))
          0
          s)
        ans))
    (fail 'textual-fold))
(or (result=? "abc" (textual-map string (as-text "abc")))
    (fail 'textual-map))
(or (result=? "ABC" (textual-map char-upcase "abc"))
    (fail 'textual-map))
(or (result=?
      "Hear-here!"
      (textual-map
        (lambda (c0 c1 c2)
          (case c0
            [(#\1) c1]
            [(#\2) (string c2)]
            [(#\-) (text #\- c1)]))
        (string->text "1222-1111-2222")
        (string->text "Hi There!")
        (string->text "Dear John")))
    (fail 'textual-map))
(or (string=?
      "abc"
      (let ([q (open-output-string)])
        (textual-for-each
          (lambda (c) (write-char c q))
          (as-text "abc"))
        (get-output-string q)))
    (fail 'textual-for-each))
(or (equal?
      '("cfi" "beh" "adg")
      (let ([x '()])
        (textual-for-each
          (lambda (c1 c2 c3) (set! x (cons (string c1 c2 c3) x)))
          "abc"
          (as-text "defxyz")
          (as-text "ghijklmnopqrstuvwxyz"))
        x))
    (fail 'textual-for-each))
(or (result=?
      "abc"
      (textual-map-index
        (lambda (i) (integer->char (+ i (char->integer #\a))))
        "xyz"))
    (fail 'textual-map-index))
(or (result=?
      "def"
      (textual-map-index
        (lambda (i) (integer->char (+ i (char->integer #\a))))
        "xyz***"
        3))
    (fail 'textual-map-index))
(or (result=?
      "cde"
      (textual-map-index
        (lambda (i) (integer->char (+ i (char->integer #\a))))
        "......"
        2
        5))
    (fail 'textual-map-index))
(or (equal?
      '(101 100 99 98 97)
      (let ([s (as-text "abcde")] [v '()])
        (textual-for-each-index
          (lambda (i)
            (set! v (cons (char->integer (textual-ref s i)) v)))
          s)
        v))
    (fail 'textual-for-each-index))
(or (equal?
      '(101 100 99)
      (let ([s (as-text "abcde")] [v '()])
        (textual-for-each-index
          (lambda (i)
            (set! v (cons (char->integer (textual-ref s i)) v)))
          s
          2)
        v))
    (fail 'textual-for-each-index))
(or (equal?
      '(99 98)
      (let ([s (as-text "abcde")] [v '()])
        (textual-for-each-index
          (lambda (i)
            (set! v (cons (char->integer (textual-ref s i)) v)))
          s
          1
          3)
        v))
    (fail 'textual-for-each-index))
(or (= 6 (textual-count "abcdef" char?))
    (fail 'textual-count))
(or (= 4
       (textual-count
         "counting  whitespace, again "
         char-whitespace?
         5))
    (fail 'textual-count))
(or (= 3
       (textual-count
         "abcdefwxyz"
         (lambda (c) (odd? (char->integer c)))
         2
         8))
    (fail 'textual-count))
(or (result=?
      "aiueaaaoi"
      (textual-filter
        (lambda (c) (memv c (textual->list "aeiou")))
        (as-text "What is number, that man may know it?")))
    (fail 'textual-filter))
(or (result=?
      "And wmn, tht sh my knw nmbr?"
      (textual-remove
        (lambda (c) (memv c (textual->list "aeiou")))
        "And woman, that she may know number?"))
    (fail 'textual-remove))
(or (result=?
      "iueaaaoi"
      (textual-filter
        (lambda (c) (memv c (textual->list "aeiou")))
        (as-text "What is number, that man may know it?")
        4))
    (fail 'textual-filter))
(or (result=?
      "mn, tht sh my knw nmbr?"
      (textual-remove
        (lambda (c) (memv c (textual->list "aeiou")))
        "And woman, that she may know number?"
        6))
    (fail 'textual-remove))
(or (result=?
      "aaao"
      (textual-filter
        (lambda (c) (memv c (textual->list "aeiou")))
        (as-text "What is number, that man may know it?")
        16
        32))
    (fail 'textual-filter))
(or (result=?
      "And woman, that sh may know"
      (textual-remove
        (lambda (c) (memv c (textual->list "eiu")))
        "And woman, that she may know number?"
        0
        28))
    (fail 'textual-remove))
(or (result=?
      "cdefabcdefabcd"
      (textual-replicate "abcdef" -4 10))
    (fail 'textual-replicate))
(or (result=?
      "bcdefbcdefbcd"
      (textual-replicate "abcdef" 90 103 1))
    (fail 'textual-replicate))
(or (result=?
      "ecdecdecde"
      (textual-replicate "abcdef" -13 -3 2 5))
    (fail 'textual-replicate))
(or (equal? '() (map textual->string (textual-split "" "")))
    (fail 'textual-split))
(or (equal?
      '("a" "b" "c")
      (map textual->string (textual-split "abc" "")))
    (fail 'textual-split))
(or (equal?
      '("too" "" "much" "" "data")
      (map textual->string (textual-split "too  much  data" " ")))
    (fail 'textual-split))
(or (equal?
      '("" "there" "ya" "go" "")
      (map textual->string
           (textual-split "***there***ya***go***" "***")))
    (fail 'textual-split))
(or (equal?
      '()
      (map textual->string (textual-split "" "" 'infix)))
    (fail 'textual-split))
(or (equal?
      '("a" "b" "c")
      (map textual->string (textual-split "abc" "" 'infix)))
    (fail 'textual-split))
(or (equal?
      '("too" "" "much" "" "data")
      (map textual->string
           (textual-split "too  much  data" " " 'infix)))
    (fail 'textual-split))
(or (equal?
      '("" "there" "ya" "go" "")
      (map textual->string
           (textual-split "***there***ya***go***" "***" 'infix)))
    (fail 'textual-split))
(or (equal?
      'error
      (guard (exn [else 'error])
        (map textual->string (textual-split "" "" 'strict-infix))))
    (fail 'textual-split))
(or (equal?
      '("a" "b" "c")
      (map textual->string
           (textual-split "abc" "" 'strict-infix)))
    (fail 'textual-split))
(or (equal?
      '("too" "" "much" "" "data")
      (map textual->string
           (textual-split "too  much  data" " " 'strict-infix)))
    (fail 'textual-split))
(or (equal?
      '("" "there" "ya" "go" "")
      (map textual->string
           (textual-split
             "***there***ya***go***"
             "***"
             'strict-infix)))
    (fail 'textual-split))
(or (equal?
      '()
      (map textual->string (textual-split "" "" 'prefix)))
    (fail 'textual-split))
(or (equal?
      '("a" "b" "c")
      (map textual->string (textual-split "abc" "" 'prefix)))
    (fail 'textual-split))
(or (equal?
      '("too" "" "much" "" "data")
      (map textual->string
           (textual-split "too  much  data" " " 'prefix)))
    (fail 'textual-split))
(or (equal?
      '("there" "ya" "go" "")
      (map textual->string
           (textual-split "***there***ya***go***" "***" 'prefix)))
    (fail 'textual-split))
(or (equal?
      '()
      (map textual->string (textual-split "" "" 'suffix)))
    (fail 'textual-split))
(or (equal?
      '("a" "b" "c")
      (map textual->string (textual-split "abc" "" 'suffix)))
    (fail 'textual-split))
(or (equal?
      '("too" "" "much" "" "data")
      (map textual->string
           (textual-split "too  much  data" " " 'suffix)))
    (fail 'textual-split))
(or (equal?
      '("" "there" "ya" "go")
      (map textual->string
           (textual-split "***there***ya***go***" "***" 'suffix)))
    (fail 'textual-split))
(or (equal?
      '()
      (map textual->string (textual-split "" "" 'infix #f)))
    (fail 'textual-split))
(or (equal?
      '("a" "b" "c")
      (map textual->string (textual-split "abc" "" 'infix #f)))
    (fail 'textual-split))
(or (equal?
      '("too" "" "much" "" "data")
      (map textual->string
           (textual-split "too  much  data" " " 'infix #f)))
    (fail 'textual-split))
(or (equal?
      '("" "there" "ya" "go" "")
      (map textual->string
           (textual-split "***there***ya***go***" "***" 'infix #f)))
    (fail 'textual-split))
(or (equal?
      'error
      (guard (exn [else 'error])
        (map textual->string
             (textual-split "" "" 'strict-infix #f))))
    (fail 'textual-split))
(or (equal?
      '("a" "b" "c")
      (map textual->string
           (textual-split "abc" "" 'strict-infix #f)))
    (fail 'textual-split))
(or (equal?
      '("too" "" "much" "" "data")
      (map textual->string
           (textual-split "too  much  data" " " 'strict-infix #f)))
    (fail 'textual-split))
(or (equal?
      '("" "there" "ya" "go" "")
      (map textual->string
           (textual-split
             "***there***ya***go***"
             "***"
             'strict-infix
             #f)))
    (fail 'textual-split))
(or (equal?
      '()
      (map textual->string (textual-split "" "" 'prefix #f)))
    (fail 'textual-split))
(or (equal?
      '("a" "b" "c")
      (map textual->string (textual-split "abc" "" 'prefix #f)))
    (fail 'textual-split))
(or (equal?
      '("too" "" "much" "" "data")
      (map textual->string
           (textual-split "too  much  data" " " 'prefix #f)))
    (fail 'textual-split))
(or (equal?
      '("there" "ya" "go" "")
      (map textual->string
           (textual-split "***there***ya***go***" "***" 'prefix #f)))
    (fail 'textual-split))
(or (equal?
      '()
      (map textual->string (textual-split "" "" 'suffix #f)))
    (fail 'textual-split))
(or (equal?
      '("a" "b" "c")
      (map textual->string (textual-split "abc" "" 'suffix #f)))
    (fail 'textual-split))
(or (equal?
      '("too" "" "much" "" "data")
      (map textual->string
           (textual-split "too  much  data" " " 'suffix #f)))
    (fail 'textual-split))
(or (equal?
      '("" "there" "ya" "go")
      (map textual->string
           (textual-split "***there***ya***go***" "***" 'suffix #f)))
    (fail 'textual-split))
(or (equal?
      'error
      (guard (exn [else 'error])
        (map textual->string
             (textual-split "" "" 'strict-infix 3))))
    (fail 'textual-split))
(or (equal?
      '("a" "b" "c")
      (map textual->string
           (textual-split "abc" "" 'strict-infix 3)))
    (fail 'textual-split))
(or (equal?
      '("too" "" "much" " data")
      (map textual->string
           (textual-split "too  much  data" " " 'strict-infix 3)))
    (fail 'textual-split))
(or (equal?
      '("" "there" "ya" "go***")
      (map textual->string
           (textual-split
             "***there***ya***go***"
             "***"
             'strict-infix
             3)))
    (fail 'textual-split))
(or (equal?
      '()
      (map textual->string (textual-split "" "" 'prefix 3)))
    (fail 'textual-split))
(or (equal?
      '("a" "b" "c")
      (map textual->string (textual-split "abc" "" 'prefix 3)))
    (fail 'textual-split))
(or (equal?
      '("too" "" "much" " data")
      (map textual->string
           (textual-split "too  much  data" " " 'prefix 3)))
    (fail 'textual-split))
(or (equal?
      '("there" "ya" "go***")
      (map textual->string
           (textual-split "***there***ya***go***" "***" 'prefix 3)))
    (fail 'textual-split))
(or (equal?
      '()
      (map textual->string (textual-split "" "" 'suffix 3)))
    (fail 'textual-split))
(or (equal?
      '("a" "b" "c")
      (map textual->string (textual-split "abc" "" 'suffix 3)))
    (fail 'textual-split))
(or (equal?
      '("too" "" "much" " data")
      (map textual->string
           (textual-split "too  much  data" " " 'suffix 3)))
    (fail 'textual-split))
(or (equal?
      '("" "there" "ya" "go***")
      (map textual->string
           (textual-split "***there***ya***go***" "***" 'suffix 3)))
    (fail 'textual-split))
(or (equal?
      'error
      (guard (exn [else 'error])
        (map textual->string
             (textual-split "" "" 'strict-infix 3 0))))
    (fail 'textual-split))
(or (equal?
      '("b" "c")
      (map textual->string
           (textual-split "abc" "" 'strict-infix 3 1)))
    (fail 'textual-split))
(or (equal?
      '("oo" "" "much" " data")
      (map textual->string
           (textual-split "too  much  data" " " 'strict-infix 3 1)))
    (fail 'textual-split))
(or (equal?
      '("**there" "ya" "go" "")
      (map textual->string
           (textual-split "***there***ya***go***" "***" 'strict-infix 3
             1)))
    (fail 'textual-split))
(or (equal?
      '()
      (map textual->string (textual-split "" "" 'prefix 3 0)))
    (fail 'textual-split))
(or (equal?
      '("b" "c")
      (map textual->string (textual-split "abc" "" 'prefix 3 1)))
    (fail 'textual-split))
(or (equal?
      '("oo" "" "much" " data")
      (map textual->string
           (textual-split "too  much  data" " " 'prefix 3 1)))
    (fail 'textual-split))
(or (equal?
      '("**there" "ya" "go" "")
      (map textual->string
           (textual-split "***there***ya***go***" "***" 'prefix 3 1)))
    (fail 'textual-split))
(or (equal?
      '()
      (map textual->string (textual-split "" "" 'suffix 3 0)))
    (fail 'textual-split))
(or (equal?
      '("b" "c")
      (map textual->string (textual-split "abc" "" 'suffix 3 1)))
    (fail 'textual-split))
(or (equal?
      '("oo" "" "much" " data")
      (map textual->string
           (textual-split "too  much  data" " " 'suffix 3 1)))
    (fail 'textual-split))
(or (equal?
      '("**there" "ya" "go")
      (map textual->string
           (textual-split "***there***ya***go***" "***" 'suffix 3 1)))
    (fail 'textual-split))
(or (equal?
      'error
      (guard (exn [else 'error])
        (map textual->string
             (textual-split "" "" 'strict-infix 3 0 0))))
    (fail 'textual-split))
(or (equal?
      '("b")
      (map textual->string
           (textual-split "abc" "" 'strict-infix 3 1 2)))
    (fail 'textual-split))
(or (equal?
      '("oo" "" "much" " ")
      (map textual->string
           (textual-split "too  much  data" " " 'strict-infix 3 1 11)))
    (fail 'textual-split))
(or (equal?
      '()
      (map textual->string (textual-split "" "" 'prefix 3 0 0)))
    (fail 'textual-split))
(or (equal?
      '("b")
      (map textual->string
           (textual-split "abc" "" 'prefix 3 1 2)))
    (fail 'textual-split))
(or (equal?
      '("oo" "" "much" " ")
      (map textual->string
           (textual-split "too  much  data" " " 'prefix 3 1 11)))
    (fail 'textual-split))
(or (equal?
      '()
      (map textual->string (textual-split "" "" 'suffix 3 0 0)))
    (fail 'textual-split))
(or (equal?
      '("b")
      (map textual->string
           (textual-split "abc" "" 'suffix 3 1 2)))
    (fail 'textual-split))
(or (equal?
      '("oo" "" "much" " ")
      (map textual->string
           (textual-split "too  much  data" " " 'suffix 3 1 11)))
    (fail 'textual-split))
(writeln "Done.")
