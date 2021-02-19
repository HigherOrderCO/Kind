-- This is the main API of the Formality library. It is a thin wrapper around
-- FormalityInternal.hs (internal file, generated from Formality), re-exporting
-- some of its functions with proper type signatures and documentation.

module Formality where

import FormalityInternal

-- | 'report' type-checks a source file, returning a report of errors and goals
report :: String -> String
report = fm_checker_code
