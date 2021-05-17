;; Copyright © 2019 Göran Weinholt
;; SPDX-License-Identifier: MIT
#!r6rs

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
    (rnrs)
    (except (loko system time) time-resolution)
    (prefix (only (loko system time) time-resolution)
            loko:))

  (define time-resolution (loko:time-resolution (current-time)))

  (define (cumulative-thread-time)
    (error 'cumulative-thread-time "not implemented"))

  (define (cumulative-gc-time)
    (error 'cumulative-gc-time "not implemented"))

  ;; Loko currently doesn't parse the timezone database
  (define timezone-offset 0))
