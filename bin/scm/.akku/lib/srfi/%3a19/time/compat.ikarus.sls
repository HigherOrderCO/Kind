#!r6rs
;; Copyright 2010 Derick Eddington.  My MIT-style license is in the file named
;; LICENSE from the original collection this file is distributed with.

(library (srfi :19 time compat)
  (export
    time-resolution
    timezone-offset
    current-time
    cumulative-thread-time
    cumulative-process-time
    cumulative-gc-time
    time-nanosecond
    time-second)
  (import
    (rnrs base)
    (only (ikarus)
          current-time
          time-nanosecond
          time-second
          time-gmt-offset)
    (srfi :19 time not-implemented))

  ;; Ikarus uses gettimeofday() which gives microseconds,
  ;; so our resolution is 1000 nanoseconds
  (define time-resolution 1000)

  (define timezone-offset (time-gmt-offset (current-time)))
)
