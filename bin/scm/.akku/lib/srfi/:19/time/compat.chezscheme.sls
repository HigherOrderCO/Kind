#!r6rs
;;; Copyright (c) 2012 Aaron W. Hsu <arcfide@sacrideo.us>
;;; 
;;; Permission to use, copy, modify, and distribute this software for
;;; any purpose with or without fee is hereby granted, provided that the
;;; above copyright notice and this permission notice appear in all
;;; copies.
;;; 
;;; THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL
;;; WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED
;;; WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE
;;; AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL
;;; DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA
;;; OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER
;;; TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
;;; PERFORMANCE OF THIS SOFTWARE.

(library (srfi :19 time compat)
  (export time-resolution
          timezone-offset
          current-time
          cumulative-thread-time
          (rename (cpu-time cumulative-process-time))
          cumulative-gc-time
          time-nanosecond
          time-second)
  (import (chezscheme))

(define time-resolution 1)

(define (cumulative-thread-time . args)
  (assertion-violation 'cumulative-thread-time "not implemented"))

(define (cumulative-gc-time) (sstats-gc-cpu (statistics)))

(define timezone-offset (date-zone-offset (time-utc->date (current-time))))

)
