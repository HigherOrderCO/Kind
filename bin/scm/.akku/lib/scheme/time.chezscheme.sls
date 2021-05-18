;; -*- mode: scheme; coding: utf-8 -*-
;; SPDX-License-Identifier: CC0-1.0
#!r6rs

(library (scheme time)
  (export
    current-jiffy current-second jiffies-per-second)
  (import
    (rnrs)
    (srfi :19 time))

(define scale 1000000000)

(define (jiffies-per-second)
  scale)

(define (current-jiffy)
  (let ((t (current-time time-monotonic)))
    (+ (* scale (time-second t))
       (time-nanosecond t))))

(define (current-second)
  (let ((t (current-time time-tai)))
    (+ (time-second t)
       (/ (time-nanosecond t) 1e9)))))
