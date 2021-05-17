;;
;; Reference implementation of SRFI 51
;;
;; Copyright (C) Joo ChurlSoo (2004). All Rights Reserved.
;;
;; Permission is hereby granted, free of charge, to any person obtaining a copy
;; of this software and associated documentation files (the "Software"), to
;; deal in the Software without restriction, including without limitation the
;; rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
;; sell copies of the Software, and to permit persons to whom the Software is
;; furnished to do so, subject to the following conditions:
;;
;; The above copyright notice and this permission notice shall be included in
;; all copies or substantial portions of the Software.
;;
;; THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
;; IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
;; FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
;; AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
;; LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
;; FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
;; IN THE SOFTWARE.
;;

(define (rest-values rest . default)
  (let* ((caller (if (or (null? default)
			 (boolean? (car default))
			 (integer? (car default))
			 (memq (car default) (list + -)))
		     '()
		     (if (string? rest) rest (list rest))))
	 (rest-list (if (null? caller) rest (car default)))
	 (rest-length (if (list? rest-list)
			  (length rest-list)
			  (if (string? caller)
			      (error caller rest-list 'rest-list
				     '(list? rest-list))
			      (apply error "bad rest list" rest-list 'rest-list
				     '(list? rest-list) caller))))
	 (default (if (null? caller) default (cdr default)))
	 (default-list (if (null? default) default (cdr default)))
	 (default-length (length default-list))
	 (number
	  (and (not (null? default))
	       (let ((option (car default)))
		 (or (and (integer? option)
			  (or (and (> rest-length (abs option))
				   (if (string? caller)
				       (error caller rest-list 'rest-list
					      `(<= (length rest-list)
						   ,(abs option)))
				       (apply error "too many arguments"
					      rest-list 'rest-list
					      `(<= (length rest-list)
						   ,(abs option))
					      caller)))
			      (and (> default-length (abs option))
				   (if (string? caller)
				       (error caller default-list
					      'default-list
					      `(<= (length default-list)
						   ,(abs option)))
				       (apply error "too many defaults"
					      default-list 'default-list
					      `(<= (length default-list)
						   ,(abs option))
					      caller)))
			      option))
		     (eq? option #t)
		     (and (not option) 'false)
		     (and (eq? option +) +)
		     (and (eq? option -) -)
		     (if (string? caller)
			 (error caller option 'option
				'(or (boolean? option)
				     (integer? option)
				     (memq option (list + -))))
			 (apply error "bad optional argument" option 'option
				'(or (boolean? option)
				     (integer? option)
				     (memq option (list + -)))
				caller)))))))
    (cond
     ((or (eq? #t number) (eq? 'false number))
      (and (not (every pair? default-list))
	   (if (string? caller)
	       (error caller default-list 'default-list
		      '(every pair? default-list))
	       (apply error "bad default list" default-list 'default-list
		      '(every pair? default-list) caller)))
      (let loop ((rest-list rest-list)
		 (default-list default-list)
		 (result '()))
	(if (null? default-list)
	    (if (null? rest-list)
		(apply values (reverse result))
		(if (eq? #t number)
		    (if (string? caller)
			(error caller rest-list 'rest-list '(null? rest-list))
			(apply error "bad argument" rest-list 'rest-list
			       '(null? rest-list) caller))
		    (apply values (append-reverse result rest-list))))
	    (if (null? rest-list)
		(apply values (append-reverse result (map car default-list)))
		(let ((default (car default-list)))
		  (let lp ((rest rest-list)
			   (head '()))
		    (if (null? rest)
			(loop (reverse head)
			      (cdr default-list)
			      (cons (car default) result))
			(if (list? default)
			    (if (member (car rest) default)
				(loop (append-reverse head (cdr rest))
				      (cdr default-list)
				      (cons (car rest) result))
				(lp (cdr rest) (cons (car rest) head)))
			    (if ((cdr default) (car rest))
				(loop (append-reverse head (cdr rest))
				      (cdr default-list)
				      (cons (car rest) result))
				(lp (cdr rest) (cons (car rest) head)))))))))))
     ((or (and (integer? number) (> number 0))
	  (eq? number +))
      (and (not (every pair? default-list))
	   (if (string? caller)
	       (error caller default-list 'default-list
		      '(every pair? default-list))
	       (apply error "bad default list" default-list 'default-list
		      '(every pair? default-list) caller)))
      (let loop ((rest rest-list)
		 (default default-list))
	(if (or (null? rest) (null? default))
	    (apply values
		   (if (> default-length rest-length)
		       (append rest-list
			       (map car (list-tail default-list rest-length)))
		       rest-list))
	    (let ((arg (car rest))
		  (par (car default)))
	      (if (list? par)
		  (if (member arg par)
		      (loop (cdr rest) (cdr default))
		      (if (string? caller)
			  (error caller arg 'arg `(member arg ,par))
			  (apply error "unmatched argument"
				 arg 'arg `(member arg ,par) caller)))
		  (if ((cdr par) arg)
		      (loop (cdr rest) (cdr default))
		      (if (string? caller)
			  (error caller arg 'arg `(,(cdr par) arg))
			  (apply error "incorrect argument"
				 arg 'arg `(,(cdr par) arg) caller))))))))
     (else
      (apply values (if (> default-length rest-length)
			(append rest-list (list-tail default-list rest-length))
			rest-list))))))

(define-syntax arg-and
  (syntax-rules()
    ((arg-and arg (a1 a2 ...) ...)
     (and (or (symbol? 'arg)
	      (error "bad syntax" 'arg '(symbol? 'arg)
		     '(arg-and arg (a1 a2 ...) ...)))
	  (or (a1 a2 ...)
	      (error "incorrect argument" arg 'arg '(a1 a2 ...)))
	  ...))
    ((arg-and caller arg (a1 a2 ...) ...)
     (and (or (symbol? 'arg)
	      (error "bad syntax" 'arg '(symbol? 'arg)
		     '(arg-and caller arg (a1 a2 ...) ...)))
	  (or (a1 a2 ...)
	      (if (string? caller)
		  (error caller arg 'arg '(a1 a2 ...))
		  (error "incorrect argument" arg 'arg '(a1 a2 ...) caller)))
	  ...))))

;; accessory macro for arg-ands
(define-syntax caller-arg-and
  (syntax-rules()
    ((caller-arg-and caller arg (a1 a2 ...) ...)
     (and (or (symbol? 'arg)
	      (error "bad syntax" 'arg '(symbol? 'arg)
		     '(caller-arg-and caller arg (a1 a2 ...) ...)))
	  (or (a1 a2 ...)
	      (if (string? caller)
		  (error caller arg 'arg '(a1 a2 ...))
		  (error "incorrect argument" arg 'arg '(a1 a2 ...) caller)))
	  ...))
    ((caller-arg-and null caller arg (a1 a2 ...) ...)
     (and (or (symbol? 'arg)
	      (error "bad syntax" 'arg '(symbol? 'arg)
		     '(caller-arg-and caller arg (a1 a2 ...) ...)))
	  (or (a1 a2 ...)
	      (if (string? caller)
		  (error caller arg 'arg '(a1 a2 ...))
		  (error "incorrect argument" arg 'arg '(a1 a2 ...) caller)))
	  ...))))

(define-syntax arg-ands
  (syntax-rules (common)
    ((arg-ands (a1 a2 ...) ...)
     (and (arg-and a1 a2 ...) ...))
    ((arg-ands common caller (a1 a2 ...) ...)
     (and (caller-arg-and caller a1 a2 ...) ...))))

(define-syntax arg-or
  (syntax-rules()
    ((arg-or arg (a1 a2 ...) ...)
     (or (and (not (symbol? 'arg))
	      (error "bad syntax" 'arg '(symbol? 'arg)
		     '(arg-or arg (a1 a2 ...) ...)))
	 (and (a1 a2 ...)
	      (error "incorrect argument" arg 'arg '(a1 a2 ...)))
	 ...))
    ((arg-or caller arg (a1 a2 ...) ...)
     (or (and (not (symbol? 'arg))
	      (error "bad syntax" 'arg '(symbol? 'arg)
		     '(arg-or caller arg (a1 a2 ...) ...)))
	 (and (a1 a2 ...)
	      (if (string? caller)
		  (error caller arg 'arg '(a1 a2 ...))
		  (error "incorrect argument" arg 'arg '(a1 a2 ...) caller)))
	 ...))))

;; accessory macro for arg-ors
(define-syntax caller-arg-or
  (syntax-rules()
    ((caller-arg-or caller arg (a1 a2 ...) ...)
     (or (and (not (symbol? 'arg))
	      (error "bad syntax" 'arg '(symbol? 'arg)
		     '(caller-arg-or caller arg (a1 a2 ...) ...)))
	 (and (a1 a2 ...)
	      (if (string? caller)
		  (error caller arg 'arg '(a1 a2 ...))
		  (error "incorrect argument" arg 'arg '(a1 a2 ...) caller)))
	 ...))
    ((caller-arg-or null caller arg (a1 a2 ...) ...)
     (or (and (not (symbol? 'arg))
	      (error "bad syntax" 'arg '(symbol? 'arg)
		     '(caller-arg-or caller arg (a1 a2 ...) ...)))
	 (and (a1 a2 ...)
	      (if (string? caller)
		  (error caller arg 'arg '(a1 a2 ...))
		  (error "incorrect argument" arg 'arg '(a1 a2 ...) caller)))
	 ...))))

(define-syntax arg-ors
  (syntax-rules (common)
    ((arg-ors (a1 a2 ...) ...)
     (or (arg-or a1 a2 ...) ...))
    ((arg-ors common caller (a1 a2 ...) ...)
     (or (caller-arg-or caller a1 a2 ...) ...))))

(define-syntax err-and
  (syntax-rules ()
    ((err-and err expression ...)
     (and (or expression
	      (if (string? err)
		  (error err 'expression)
		  (error "false expression" 'expression err)))
	  ...))))

(define-syntax err-ands
  (syntax-rules ()
    ((err-ands (err expression ...)  ...)
     (and (err-and err expression ...)
	  ...))))

(define-syntax err-or
  (syntax-rules ()
    ((err-or err expression ...)
     (or (and expression
	      (if (string? err)
		  (error err 'expression)
		  (error "true expression" 'expression err)))
	 ...))))

(define-syntax err-ors
  (syntax-rules ()
    ((err-ors (err expression ...) ...)
     (or (err-or err expression ...)
	 ...))))

