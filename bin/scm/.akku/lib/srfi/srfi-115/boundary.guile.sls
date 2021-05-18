;; Character sets for Unicode boundaries, TR29.
;; This code is written by Alex Shinn and placed in the
;; Public Domain.  All warranties are disclaimed.

;;> Char-sets used for
;;> \hyperlink["http://unicode.org/reports/tr29/"]{TR29} word
;;> boundaries.

;; Converted from lib/chibi/char-set/boundary.sld to R6RS by Göran Weinholt.

#!r6rs
(library (srfi srfi-115 boundary)
  (export char-set:regional-indicator
          char-set:extend-or-spacing-mark
          char-set:hangul-l
          char-set:hangul-v
          char-set:hangul-t
          char-set:hangul-lv
          char-set:hangul-lvt)
  (import (rnrs)
          (srfi :14 char-sets)
          (srfi private include))
  (define (immutable-char-set cs) cs)
  ;; generated with:
  ;; tools/extract-unicode-props.scm --derived GraphemeBreakProperty.txt
  ;;   Control extend-or-spacing-mark=Extend,SpacingMark Regional_Indicator
  ;;   hangul-l=:L hangul-v=:V hangul-t=:T hangul-lv=:LV hangul-lvt=:LVT
  (include/resolve ("srfi" "%3a115" "regexp") "boundary-impl.scm"))
