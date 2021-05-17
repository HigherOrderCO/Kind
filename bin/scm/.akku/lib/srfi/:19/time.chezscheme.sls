#!r6rs
;; Copyright 2010 Derick Eddington.  My MIT-style license is in the file named
;; LICENSE from the original collection this file is distributed with.

(library (srfi :19 time)
  (export
    time-duration
    time-monotonic
    time-process
    time-tai
    time-thread
    time-utc
    current-date
    current-julian-day
    current-modified-julian-day
    current-time
    time-resolution
    make-time
    time?
    time-type
    time-nanosecond
    time-second
    set-time-type!
    set-time-nanosecond!
    set-time-second!
    copy-time
    time<=?
    time<?
    time=?
    time>=?
    time>?
    time-difference
    time-difference!
    add-duration
    add-duration!
    subtract-duration
    subtract-duration!
    make-date
    date?
    date-nanosecond
    date-second
    date-minute
    date-hour
    date-day
    date-month
    date-year
    date-zone-offset
    date-year-day
    date-week-day
    date-week-number
    date->julian-day
    date->modified-julian-day
    date->time-monotonic
    date->time-tai
    date->time-utc
    julian-day->date
    julian-day->time-monotonic
    julian-day->time-tai
    julian-day->time-utc
    modified-julian-day->date
    modified-julian-day->time-monotonic
    modified-julian-day->time-tai
    modified-julian-day->time-utc
    time-monotonic->date
    time-monotonic->julian-day
    time-monotonic->modified-julian-day
    time-monotonic->time-tai
    time-monotonic->time-tai!
    time-monotonic->time-utc
    time-monotonic->time-utc!
    time-tai->date
    time-tai->julian-day
    time-tai->modified-julian-day
    time-tai->time-monotonic
    time-tai->time-monotonic!
    time-tai->time-utc
    time-tai->time-utc!
    time-utc->date
    time-utc->julian-day
    time-utc->modified-julian-day
    time-utc->time-monotonic
    time-utc->time-monotonic!
    time-utc->time-tai
    time-utc->time-tai!
    date->string
    string->date)
  (import
    (rnrs)
    (rnrs r5rs)
    (rnrs mutable-strings)
    (prefix (srfi :19 time compat) host:)
    (srfi :6 basic-string-ports)
    (for (srfi private vanish) expand)
    (srfi private include))

  (define-syntax define-struct
    (lambda (stx)
      (define (id-append x . r)
        (datum->syntax x (string->symbol
                          (apply string-append
                                 (map (lambda (y)
                                        (if (identifier? y)
                                          (symbol->string (syntax->datum y))
                                          y))
                                      r)))))
      (syntax-case stx ()
        ((_ name (field ...) _)
         (with-syntax (((accessor ...)
                        (map (lambda (x) (id-append x #'name "-" x))
                             #'(field ...)))
                       ((mutator ...)
                        (map (lambda (x) (id-append x "set-" #'name "-" x "!"))
                             #'(field ...))))
           #'(define-record-type name
               (fields (mutable field accessor mutator) ...)))))))

  (define read-line get-line)

  (define (tm:time-error caller type value)
    (define (message x)
      (if (symbol? x)
        (list->string (map (lambda (c) (if (char=? #\- c) #\space c))
                           (string->list (symbol->string x))))
        (call-with-string-output-port (lambda (sop) (write x sop)))))
    (apply assertion-violation
           caller (message type) (if value (list value) '())))

  (define (my:time-helper current-time type proc)
    (let ((x (current-time)))
      (make-time type
                 (host:time-nanosecond x)
                 (proc (host:time-second x)))))

  (define (my:leap-second-helper s) (+ s (tm:leap-second-delta s)))

  (define (tm:current-time-utc)
    (my:time-helper host:current-time time-utc values))

  (define (tm:current-time-tai)
    (my:time-helper host:current-time time-tai my:leap-second-helper))

  (define (tm:current-time-monotonic)
    (my:time-helper host:current-time time-monotonic my:leap-second-helper))

  (define (tm:current-time-thread)
    (my:time-helper host:cumulative-thread-time time-thread values))

  (define (tm:current-time-process)
    (my:time-helper host:cumulative-process-time time-process values))

  (define (tm:current-time-gc)
    (my:time-helper host:cumulative-gc-time time-gc values))

  (define (time-resolution . clock-type) host:time-resolution)

  (define (tm:local-tz-offset) host:timezone-offset)

  (define eof (eof-object))

  (let-syntax ((define (vanish-define define (tm:time-error-types
                                              tm:time-error
                                              tm:get-time-of-day
                                              tm:current-time-utc
                                              tm:current-time-tai
                                              tm:current-time-ms-time
                                              tm:current-time-monotonic
                                              tm:current-time-thread
                                              tm:current-time-process
                                              tm:current-time-gc
                                              time-resolution
                                              set-date-nanosecond!
                                              set-date-second!
                                              set-date-minute!
                                              set-date-hour!
                                              set-date-day!
                                              set-date-month!
                                              set-date-year!
                                              set-date-zone-offset!
                                              tm:local-tz-offset))))
    (include/resolve ("srfi" "%3a19") "srfi-19.scm"))
)
