; 54-BIT INTEGER IMPLEMENTATION OF THE "MRG32K3A"-GENERATOR
; =========================================================
;
; Sebastian.Egner@philips.com, Mar-2002.
;
; This file is an implementation of Pierre L'Ecuyer's MRG32k3a
; pseudo random number generator. Please refer to 'mrg32k3a.scm'
; for more information.
;
; compliance:
;   Scheme R5RS with integers covering at least {-2^53..2^53-1}.
;
; history of this file:
;   SE, 18-Mar-2002: initial version
;   SE, 22-Mar-2002: comments adjusted, range added
;   SE, 25-Mar-2002: pack/unpack just return their argument

; the actual generator

(define (mrg32k3a-random-m1 state)
  (let ((x11 (vector-ref state 0))
	(x12 (vector-ref state 1))
	(x13 (vector-ref state 2))
	(x21 (vector-ref state 3))
	(x22 (vector-ref state 4))
	(x23 (vector-ref state 5)))
    (let ((x10 (modulo (- (* 1403580 x12) (* 810728 x13)) 4294967087))
	  (x20 (modulo (- (* 527612 x21) (* 1370589 x23)) 4294944443)))
      (vector-set! state 0 x10)
      (vector-set! state 1 x11)
      (vector-set! state 2 x12)
      (vector-set! state 3 x20)
      (vector-set! state 4 x21)
      (vector-set! state 5 x22)
      (modulo (- x10 x20) 4294967087))))

; interface to the generic parts of the generator

(define (mrg32k3a-pack-state unpacked-state)
  unpacked-state)

(define (mrg32k3a-unpack-state state)
  state)

(define (mrg32k3a-random-range) ; m1
  4294967087)

(define (mrg32k3a-random-integer state range) ; rejection method
  (let* ((q (quotient 4294967087 range))
	 (qn (* q range)))
    (do ((x (mrg32k3a-random-m1 state) (mrg32k3a-random-m1 state)))
	((< x qn) (quotient x q)))))

(define (mrg32k3a-random-real state) ; normalization is 1/(m1+1)
  (* 0.0000000002328306549295728 (+ 1.0 (mrg32k3a-random-m1 state))))

