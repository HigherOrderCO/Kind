module Kind.API where

import Kind.Types
import Kind.Environment
import Kind.Evaluation
import Kind.Checking
import Kind.Stringification
import Kind.Parsing

import qualified Data.Map.Strict as M
import qualified Data.IntMap.Strict as IM
import System.Environment (getArgs)
import System.Exit (exitFailure)

-- API
-- ---

-- Normalizes a term
apiNormal :: Book -> Term -> IO ()
apiNormal book term = putStrLn $ infoShow book IM.empty (Print (normal book IM.empty 2 term 0) 0)

-- Type-checks a term
apiCheck :: Book -> Term -> IO ()
apiCheck book term = case envRun (checkDef term) book of
  Done state value -> apiPrintLogs state
  Fail state       -> apiPrintLogs state

apiPrintLogs :: State -> IO ()
apiPrintLogs (State book fill susp (log : logs)) = do
  putStrLn $ infoShow book fill log
  apiPrintLogs (State book fill susp logs)
apiPrintLogs (State book fill susp []) = do
  return ()

-- Main
-- ----

book :: Book
book = M.fromList []

main :: IO ()
main = do
  args <- getArgs
  case args of
    ["check", file] -> do
      content <- readFile file
      let book = doParseBook content
      case M.lookup "MAIN" book of
        Just term -> apiCheck book (Ref "MAIN")
        Nothing -> putStrLn "Error: No 'main' definition found in the file."
    ["run", file] -> do
      content <- readFile file
      let book = doParseBook content
      case M.lookup "MAIN" book of
        Just term -> apiNormal book term
        Nothing -> putStrLn "Error: No 'main' definition found in the file."
    ["show", file] -> do
      content <- readFile file
      let book = doParseBook content
      case M.lookup "MAIN" book of
        Just term -> putStrLn $ termShow term 0
        Nothing -> putStrLn "Error: No 'main' definition found in the file."
    ["help"] -> printHelp
    [] -> printHelp
    _ -> do
      putStrLn "Invalid command. Use 'kindc help' for usage information."
      exitFailure

printHelp :: IO ()
printHelp = do
  putStrLn "Kind2 usage:"
  putStrLn "  kindc check file.kindc # Type-checks the main definition"
  putStrLn "  kindc run   file.kindc # Normalizes the main definition"
  putStrLn "  kindc show  file.kindc # Stringifies the main definition"
  putStrLn "  kindc help             # Shows this help message"
