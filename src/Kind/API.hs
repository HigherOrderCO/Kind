-- Type.hs:
-- //./Type.hs//

module Kind.API where

import Control.Exception (try)
import Control.Monad (forM, forM_, foldM)
import Data.List (stripPrefix, isSuffixOf, nub)
import Highlight (highlightError)
import Kind.Check
import Kind.CompileJS
import Kind.Env
import Kind.Parse
import Kind.Reduce
import Kind.Show
import Kind.Type
import Kind.Util
import System.Console.ANSI
import System.Directory (canonicalizePath, getCurrentDirectory, doesDirectoryExist, doesFileExist, getDirectoryContents)
import System.Environment (getArgs)
import System.Exit (exitWith, ExitCode(ExitSuccess, ExitFailure))
import System.FilePath (takeDirectory, (</>), takeFileName, dropExtension, isExtensionOf)
import System.IO (readFile)
import qualified Data.IntMap.Strict as IM
import qualified Data.Map.Strict as M
import qualified Data.Set as S

import Debug.Trace

type FileCtx = (Book, M.Map FilePath [String], M.Map FilePath [String])
type Command = String -> FileCtx -> String -> String -> IO (Either String ())

-- main :: IO ()
-- main = ctest

main :: IO ()
main = do
  args     <- getArgs
  currPath <- getCurrentDirectory
  bookPath <- findBookDir currPath
  case bookPath of
    Nothing -> do
      putStrLn "Error: No 'book' directory found in the path."
      exitWith (ExitFailure 1)
    Just bookPath -> do
      result <- case args of
        -- ["check"]      -> runWithAll bookPath apiCheckAll
        ["run", arg]   -> runWithOne bookPath arg apiNormal
        ["check"]      -> runWithAll bookPath apiCheck
        ["check", arg] -> runWithOne bookPath arg apiCheck
        ["to-js", arg] -> runWithOne bookPath arg apiToJS
        ["show", arg]  -> runWithOne bookPath arg apiShow
        ["deps", arg]  -> runWithOne bookPath arg apiDeps
        ["rdeps", arg] -> runWithOne bookPath arg apiRDeps
        _              -> printHelp
      case result of
        Left err -> do
          putStrLn err
          exitWith (ExitFailure 1)
        Right _ -> do
          exitWith ExitSuccess

printHelp :: IO (Either String ())
printHelp = do
  putStrLn "Kind usage:"
  putStrLn "  kind check             # Checks all .kind files in the current directory and subdirectories"
  putStrLn "  kind check <name|path> # Type-checks all definitions in the specified file"
  putStrLn "  kind run   <name|path> # Normalizes the specified definition"
  putStrLn "  kind show  <name|path> # Stringifies the specified definition"
  putStrLn "  kind to-js <name|path> # Compiles the specified definition to JavaScript"
  putStrLn "  kind deps  <name|path> # Shows immediate dependencies of the specified definition"
  putStrLn "  kind rdeps <name|path> # Shows all dependencies of the specified definition recursively"
  putStrLn "  kind help              # Shows this help message"
  return $ Right ()

-- API Commands
-- ------------

-- Normalizes the target definition
apiNormal :: Command
apiNormal bookPath (book, _, _) defName defPath =
  case M.lookup "main" book of
    Just term -> do
      result <- showInfo book IM.empty (Print term 0)
      putStrLn result
      return $ Right ()
    Nothing -> do
      return $ Left $ "Error: Definition '" ++ defName ++ "' not found."

-- Checks all definitions in the target file
apiCheck :: Command
apiCheck bookPath (book, defs, _) defName defPath = do
  case M.lookup defPath defs of
    Just fileDefNames -> do
      results <- forM fileDefNames $ \fileDefName -> do
        case M.lookup fileDefName book of
          Just term -> do
            case envRun (doCheck term) book of
              Done state chkTerm -> do
                apiPrintLogs state
                apiPrintWarn chkTerm state
                putStrLn $ "\x1b[32m✓ " ++ fileDefName ++ "\x1b[0m"
                return $ Right ()
              Fail state -> do
                apiPrintLogs state
                apiPrintWarn term state
                putStrLn $ "\x1b[31m✗ " ++ fileDefName ++ "\x1b[0m"
                return $ Left $ "Error."
          Nothing -> return $ Left $ "Definition not found: " ++ fileDefName
      putStrLn ""
      return $ sequence_ results
    Nothing -> do
      return $ Left $ "No definitions found in file: " ++ defPath

-- Compiles the whole book to JS
apiToJS :: Command
apiToJS bookPath (book, _, _) _ _ = do
  putStrLn $ compileJS book
  return $ Right ()

-- Shows a definition
apiShow :: Command
apiShow bookPath (book, _, _) defName _ = 
  case M.lookup defName book of
    Just term -> do
      putStrLn $ showTerm term
      return $ Right ()
    Nothing -> do
      return $ Left $ "Error: Definition '" ++ defName ++ "' not found."

-- Shows immediate dependencies of a definition
apiDeps :: Command
apiDeps bookPath (book, _, _) defName _ = 
  case M.lookup defName book of
    Just term -> do
      forM_ (filter (/= defName) $ nub $ getDeps term) $ \dep -> putStrLn dep
      return $ Right ()
    Nothing -> do
      return $ Left $ "Error: Definition '" ++ defName ++ "' not found."

-- Shows all dependencies of a definition recursively
apiRDeps :: Command
apiRDeps bookPath (book, _, _) defName _ = do
  let deps = S.toList $ S.delete defName $ getAllDeps book defName
  forM_ deps $ \dep -> putStrLn dep
  return $ Right ()

-- API Runners
-- -----------

-- Runs a command on a single file
runWithOne :: FilePath -> String -> Command -> IO (Either String ())
runWithOne bookPath arg action = do
  let defName = getDefName bookPath arg
  let defPath = getDefPath bookPath defName
  apiCtx <- loadName bookPath M.empty defName
  action bookPath apiCtx defName defPath

-- Runs a command on all files
runWithAll :: FilePath -> Command -> IO (Either String ())
runWithAll bookPath action = do
  files <- findKindFiles bookPath
  results <- forM files $ \file -> do
    runWithOne bookPath file action
  return $ sequence_ results

-- Loader
-- ------

-- Loads a name and all its dependencies recursively
loadName :: FilePath -> Book -> String -> IO FileCtx
loadName bookPath book name = do
  if M.member name book
    then do
      return (book, M.empty, M.empty)
    else do
      let dirPath = bookPath </> name
      isDir <- doesDirectoryExist dirPath
      if isDir
        then loadFile bookPath book (dirPath </> takeFileName name ++ ".kind")
        else loadFile bookPath book (bookPath </> name ++ ".kind")

-- Loads a file and all its dependencies recursivelly
loadFile :: FilePath -> Book -> FilePath -> IO FileCtx
loadFile bookPath book filePath = do
  fileExists <- doesFileExist filePath
  if not fileExists
    then do
      return (book, M.empty, M.empty)
    else do
      code  <- readFile filePath
      book0 <- doParseBook filePath code
      let book1 = M.union book book0
      let defs  = M.keys book0
      let deps  = concatMap (getDeps . snd) (M.toList book0)
      let defs' = M.singleton filePath defs
      let deps' = M.singleton filePath deps
      foldM (\ (depBook, depDefs, depDeps) dep -> do
          (depBook', depDefs', depDeps') <- loadName bookPath depBook dep
          return ( depBook' , M.union depDefs depDefs' , M.union depDeps depDeps')
        ) (book1, defs', deps') deps

-- Utils
-- -----

-- Finds the directory named "monobook"
findBookDir :: FilePath -> IO (Maybe FilePath)
findBookDir dir = do
  let kindBookDir = dir </> "kindbook"
  foundKindBook <- doesDirectoryExist kindBookDir
  if foundKindBook
    then return $ Just kindBookDir
    else if takeDirectory dir == dir
      then return Nothing
      else findBookDir (takeDirectory dir)

-- Finds all Kind files in this directory tree
findKindFiles :: FilePath -> IO [FilePath]
findKindFiles dir = do
  contents <- getDirectoryContents dir
  let properNames = filter (`notElem` [".", ".."]) contents
  paths <- forM properNames $ \name -> do
    let path = dir </> name
    isDirectory <- doesDirectoryExist path
    if isDirectory
      then findKindFiles path
      else return [path | ".kind" `isSuffixOf` path]
  return (concat paths)

-- Loads a file into a string
readSource :: FilePath -> IO String
readSource file = do
  result <- try (readFile file) :: IO (Either IOError String)
  case result of
    Right x -> return x
    Left er -> return $ "Could not read source file: " ++ file

-- Extracts the definition name from a file path or name
getDefName :: FilePath -> String -> String
getDefName bookPath = dropBookPath . dropExtension where
  dropExtension path
    | isExtensionOf "kind" path = System.FilePath.dropExtension path
    | otherwise                 = path
  dropBookPath path = maybe path id (stripPrefix (bookPath++"/") path)

-- Gets the full path for a definition
getDefPath :: FilePath -> String -> FilePath
getDefPath bookPath name = bookPath </> name ++ ".kind"

-- Stringification
-- ---------------

showInfo :: Book -> Fill -> Info -> IO String
showInfo book fill info = case info of
  Found nam typ ctx dep ->
    let nam' = concat ["?", nam]
        typ' = showTermGo True (normal book fill 0 typ dep) dep
        ctx' = showContext book fill ctx dep
    in return $ concat ["\x1b[1mGOAL\x1b[0m ", nam', " : ", typ', "\n", ctx']
  Error src exp det bad dep -> do
    let exp' = concat ["- expected : \x1b[32m", showTermGo True (normal book fill 0 exp dep) dep, "\x1b[0m"]
        det' = concat ["- detected : \x1b[31m", showTermGo True (normal book fill 0 det dep) dep, "\x1b[0m"]
        bad' = concat ["- origin   : \x1b[2m", showTermGo True (normal book fill 0 bad dep) dep, "\x1b[0m"]
    (file, text) <- case src of
      Just (Cod (Loc fileName iniLine iniCol) (Loc _ endLine endCol)) -> do
        canonPath <- canonicalizePath fileName
        content   <- readSource canonPath
        let highlighted = highlightError (iniLine, iniCol) (endLine, endCol) content
        return (canonPath, unlines $ take 8 $ lines highlighted)
      Nothing -> return ("unknown_file", "Could not read source file.\n")
    let src' = concat ["\x1b[4m", file, "\x1b[0m\n", text]
    return $ concat ["\x1b[1mERROR:\x1b[0m\n", exp', "\n", det', "\n", bad', "\n", src']
  Solve nam val dep ->
    return $ concat ["SOLVE: _", show nam, " = ", showTermGo True val dep]
  Vague nam ->
    return $ concat ["VAGUE: _", nam]
  Print val dep ->
    return $ showTermGo True (normal book fill 2 val dep) dep

showContext :: Book -> Fill -> [Term] -> Int -> String
showContext book fill ctx dep = unlines $ map (\term -> "- " ++ showContextAnn book fill term dep) ctx

showContextAnn :: Book -> Fill -> Term -> Int -> String
showContextAnn book fill (Ann chk val typ) dep = concat [showTermGo True (normal book fill 0 val dep) dep, " : ", showTermGo True (normal book fill 0 typ dep) dep]
showContextAnn book fill (Src _ val)       dep = showContextAnn book fill val dep
showContextAnn book fill term              dep = showTermGo True (normal book fill 0 term dep) dep

-- Prints logs from the type-checker
apiPrintLogs :: State -> IO ()
apiPrintLogs (State book fill susp logs) = do
  forM_ logs $ \log -> do
    result <- showInfo book fill log
    putStr result

-- Prints a warning if there are unsolved metas
apiPrintWarn :: Term -> State -> IO ()
apiPrintWarn term (State _ fill _ _) = do
  let metaCount = countMetas term
  let fillCount = IM.size fill
  if (metaCount > fillCount) then do
    putStrLn $ "WARNING: " ++ show (metaCount - fillCount) ++ " unsolved metas."
  else
    return ()
