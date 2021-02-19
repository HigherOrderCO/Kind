-- This is FormalityHS's command-line interface. It is a thin wrapper around
-- FormalityInternal.hs (internal file, generated from Formality) allowing the
-- user to access Formality features from the command line.

import System.Environment
import FormalityInternal
import Data.List
  
main :: IO ()
main = do
  args <- getArgs
  if null args then do
    putStrLn "# FormalityHS"
    putStrLn ""
    putStrLn "Usage:"
    putStrLn ""
    putStrLn "  fmhs <name> # type-checks a definition"
    putStrLn "  fmhs <file> # type-checks a file"
    putStrLn ""
    putStrLn "Examples:"
    putStrLn ""
    putStrLn "  # Check all types inside the file 'example.fm':"
    putStrLn "  fmhs example.fm"
    putStrLn ""
    putStrLn "  # Check only one definition named 'foo':"
    putStrLn "  fmhs foo"
    putStrLn ""
  else do
    let name = head args
    if ".fm" `isSuffixOf` name then do
      run (fm_checker_io_file name)
    else do
      run (fm_checker_io_one name)
