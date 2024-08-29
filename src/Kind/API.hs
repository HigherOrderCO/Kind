module Kind.API where

import Control.Monad (forM_, foldM)
import Data.List (stripPrefix)
import Kind.Check
import Kind.Env
import Kind.Parse
import Kind.Reduce
import Kind.Show
import Kind.Type
import Kind.Compile
import System.Directory (getCurrentDirectory, doesDirectoryExist, doesFileExist)
import System.Environment (getArgs)
import System.Exit (exitFailure)
import System.FilePath (takeDirectory, (</>), takeFileName, dropExtension, isExtensionOf)
import qualified Data.IntMap.Strict as IM
import qualified Data.Map.Strict as M
import qualified Data.Set as S

-- API
-- ---

-- Finds the directory named "book"
findBookDir :: FilePath -> IO (Maybe FilePath)
findBookDir dir = do
  let bookDir = dir </> "book"
  isBook <- doesDirectoryExist bookDir
  if isBook
    then return $ Just bookDir
    else if takeDirectory dir == dir
      then return Nothing
      else findBookDir (takeDirectory dir)

-- Extracts the definition name from a file path or name
extractName :: FilePath -> String -> String
extractName basePath = dropBasePath . dropExtension where
  dropExtension path
    | "kind" `isExtensionOf` path = System.FilePath.dropExtension path
    | otherwise = path
  dropBasePath path = maybe path id (stripPrefix basePath path)

-- Resolves an input to a definition name
resolveName :: FilePath -> String -> String
resolveName = extractName

-- Loads a file and its dependencies into the book
apiLoad :: FilePath -> Book -> String -> IO Book
apiLoad basePath book name
  | M.member name book = return book
  | otherwise = do
      let file = basePath </> name ++ ".kind"
      fileExists <- doesFileExist file
      if fileExists
        then do
          content <- readFile file
          book0 <- doParseBook file content
          let book1 = M.union book0 book
          let deps  = getDeps (M.findWithDefault Set name book0)
          foldM (apiLoad basePath) book1 deps
        else return $ M.insert name (Ref name) book  -- Handle unbound definitions

-- Normalizes a term
apiNormal :: Book -> String -> IO ()
apiNormal book name = case M.lookup name book of
  Just term -> do
    result <- infoShow book IM.empty (Print (normal book IM.empty 2 term 0) 0)
    putStrLn result
  Nothing -> putStrLn $ "Error: Definition '" ++ name ++ "' not found."

-- Type-checks a term
apiCheck :: Book -> String -> IO ()
apiCheck book name = case M.lookup name book of
  Just term -> do
    case envRun (doCheck term) book of
      Done state value -> apiPrintLogs state >> putStrLn "Done."
      Fail state       -> apiPrintLogs state >> putStrLn "Fail."
  Nothing -> putStrLn $ "Error: Definition '" ++ name ++ "' not found."

-- Shows a term
apiShow :: Book -> String -> IO ()
apiShow book name = case M.lookup name book of
  Just term -> putStrLn $ termShow term
  Nothing -> putStrLn $ "Error: Definition '" ++ name ++ "' not found."

-- Compiles the whole book to JS
apiToJS :: Book -> String -> IO ()
apiToJS book name = do
  let jsCode = compileJS book
  putStrLn jsCode

-- Prints logs from the type-checker
apiPrintLogs :: State -> IO ()
apiPrintLogs (State book fill susp logs) =
  forM_ logs $ \log -> do
    result <- infoShow book fill log
    putStrLn result

-- Gets dependencies of a term
getDeps :: Term -> [String]
getDeps term = case term of
  Ref nam       -> [nam]
  All _ inp out -> getDeps inp ++ getDeps (out Set)
  Lam _ bod     -> getDeps (bod Set)
  App fun arg   -> getDeps fun ++ getDeps arg
  Ann _ val typ -> getDeps val ++ getDeps typ
  Slf _ typ bod -> getDeps typ ++ getDeps (bod Set)
  Ins val       -> getDeps val
  Dat scp cts   -> concatMap getDeps scp ++ concatMap getDepsCtr cts
  Con _ arg     -> concatMap getDeps arg
  Mat cse       -> concatMap (getDeps . snd) cse
  Let _ val bod -> getDeps val ++ getDeps (bod Set)
  Use _ val bod -> getDeps val ++ getDeps (bod Set)
  Op2 _ fst snd -> getDeps fst ++ getDeps snd
  Swi zer suc   -> getDeps zer ++ getDeps suc
  Src _ val     -> getDeps val
  _             -> []

-- Gets dependencies of a constructor
getDepsCtr :: Ctr -> [String]
getDepsCtr (Ctr _ fields ret) = concatMap (getDeps . snd) fields ++ getDeps ret

-- Gets all dependencies (direct and indirect) of a term
getAllDeps :: Book -> String -> S.Set String
getAllDeps book name = go S.empty [name] where
  go visited [] = visited
  go visited (x:xs)
    | x `S.member` visited = go visited xs
    | otherwise = case M.lookup x book of
        Just term -> go (S.insert x visited) (getDeps term ++ xs)
        Nothing   -> go (S.insert x visited) xs

-- Main
-- ----

main :: IO ()
main = do
  args <- getArgs
  currentDir <- getCurrentDirectory
  maybeBasePath <- findBookDir currentDir
  case maybeBasePath of
    Nothing -> putStrLn "Error: No 'book' directory found in the path."
    Just basePath -> do
      case args of
        ["check", input] -> runCommand basePath apiCheck input
        ["run", input]   -> runCommand basePath apiNormal input
        ["show", input]  -> runCommand basePath apiShow input
        ["to-js", input] -> runCommand basePath apiToJS input
        ["deps", input]  -> runDeps basePath input
        ["help"]         -> printHelp
        []               -> printHelp
        _                -> printHelp

runCommand :: FilePath -> (Book -> String -> IO ()) -> String -> IO ()
runCommand basePath cmd input = do
  let name = resolveName basePath input
  book <- apiLoad basePath M.empty name
  cmd book name

runDeps :: FilePath -> String -> IO ()
runDeps basePath input = do
  let name = resolveName basePath input
  book <- apiLoad basePath M.empty name
  let deps = S.toList $ getAllDeps book name
  forM_ deps $ \dep -> putStrLn dep

printHelp :: IO ()
printHelp = do
  putStrLn "Kind usage:"
  putStrLn "  kind check <name|path> # Type-checks the specified definition"
  putStrLn "  kind run   <name|path> # Normalizes the specified definition"
  putStrLn "  kind show  <name|path> # Stringifies the specified definition"
  putStrLn "  kind to-js <name|path> # Compiles the specified definition to JavaScript"
  putStrLn "  kind deps  <name|path> # Shows dependencies of the specified definition"
  putStrLn "  kind help              # Shows this help message"
