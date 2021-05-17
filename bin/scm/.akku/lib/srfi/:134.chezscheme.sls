#!r6rs
(library (srfi :134)
  (export ideque ideque-tabulate ideque-unfold ideque-unfold-right
          ideque? ideque-empty? ideque= ideque-any ideque-every

          ideque-front ideque-add-front ideque-remove-front
          ideque-back  ideque-add-back  ideque-remove-back

          ideque-ref
          ideque-take ideque-take-right ideque-drop ideque-drop-right
          ideque-split-at

          ideque-length ideque-append ideque-reverse
          ideque-count ideque-zip

          ideque-map ideque-filter-map
          ideque-for-each ideque-for-each-right
          ideque-fold ideque-fold-right
          ideque-append-map

          ideque-filter ideque-remove ideque-partition

          ideque-find ideque-find-right
          ideque-take-while ideque-take-while-right
          ideque-drop-while ideque-drop-while-right
          ideque-span ideque-break

          list->ideque ideque->list
          generator->ideque ideque->generator
          )
  (import (srfi :134 ideques)))
