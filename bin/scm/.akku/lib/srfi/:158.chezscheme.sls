#!r6rs
(library (srfi :158)
  (export
    ;; Generator constructors
    generator circular-generator make-iota-generator make-range-generator
    make-coroutine-generator list->generator vector->generator
    reverse-vector->generator string->generator bytevector->generator
    make-for-each-generator make-unfold-generator 
    
    ;; Generator operations
    gcons* gappend gflatten ggroup gmerge gmap gcombine gfilter gremove
    gstate-filter gtake gdrop gtake-while gdrop-while gdelete
    gdelete-neighbor-dups gindex gselect

    ;; Consuming generated values
    generator->list generator->reverse-list generator->vector
    generator->vector! generator->string generator-fold generator-for-each
    generator-map->list generator-find generator-count generator-any
    generator-every generator-unfold 

    ;; accumulator constructors
    make-accumulator count-accumulator list-accumulator
    reverse-list-accumulator vector-accumulator reverse-vector-accumulator
    vector-accumulator! string-accumulator bytevector-accumulator
    bytevector-accumulator! sum-accumulator product-accumulator)
  (import (srfi :158 generators-and-accumulators)))
