#!r6rs
(library (srfi :35)
  (export make-condition-type condition-type? make-condition condition?
          condition-has-type? condition-ref make-compound-condition
          extract-condition define-condition-type condition &condition &serious
          &error)
  (import (srfi :35 conditions)))
