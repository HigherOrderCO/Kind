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

-- API
-- ---

-- Finds the directory named "book" or "monobook"
findBookDir :: FilePath -> IO (Maybe FilePath)
findBookDir dir = do
  let kindBookDir = dir </> "kindbook"
  let monoBookDir = dir </> "monobook"
  isKindBook <- doesDirectoryExist kindBookDir
  isMonoBook <- doesDirectoryExist monoBookDir
  if isKindBook
    then return $ Just kindBookDir
    else if isMonoBook
      then return $ Just monoBookDir
      else if takeDirectory dir == dir
        then return Nothing
        else findBookDir (takeDirectory dir)

-- Extracts the definition name from a file path or name
extractName :: FilePath -> String -> String
extractName basePath = dropBasePath . dropExtension where
  dropExtension path
    | isExtensionOf "kind" path = System.FilePath.dropExtension path
    | otherwise                 = path
  dropBasePath path = maybe path id (stripPrefix (basePath++"/") path)

-- New apiLoad function that returns the book, a map of file paths to top-level definitions, and a map of dependencies
apiLoad :: FilePath -> Book -> String -> IO (Book, M.Map FilePath [String], M.Map FilePath [String])
apiLoad basePath book name = do
  if M.member name book
    then do
      return (book, M.empty, M.empty)
    else do
      let dirPath = basePath </> name
      isDir <- doesDirectoryExist dirPath
      if isDir
        then loadFile (dirPath </> takeFileName name ++ ".kind")
        else loadFile (basePath </> name ++ ".kind")
  where
    loadFile filePath = do
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
          foldDeps book1 defs' deps' deps filePath
    foldDeps book defs deps [] _ = do
      return (book, defs, deps)
    foldDeps book defs deps (dep:rest) originalFile = do
      (book', defs', deps') <- apiLoad basePath book dep
      foldDeps book' (M.union defs defs') (M.union deps deps') rest originalFile

-- Normalizes a term
apiNormal :: Book -> String -> IO (Either String ())
apiNormal book name = case M.lookup "main" book of
  Just term -> do
    result <- infoShow book IM.empty (Print (normal book IM.empty 2 term 0) 0)
    putStrLn result
    return $ Right ()
  Nothing -> return $ Left $ "Error: Definition 'main' not found."

-- Type-checks all terms in a file
apiCheckFile :: Book -> M.Map FilePath [String] -> FilePath -> IO (Either String ())
apiCheckFile book defs path = do
  let termsToCheck = case M.lookup path defs of
        Just names -> [(name, term) | name <- names, Just term <- [M.lookup name book]]
        Nothing    -> []
  results <- forM termsToCheck $ \(name, term) -> do
    case envRun (doCheck term) book of
      Done state value -> do
        apiPrintLogs state
        apiPrintWarn term state
        putStrLn $ "\x1b[32m✓ " ++ name ++ "\x1b[0m"
        return $ Right ()
      Fail state -> do
        apiPrintLogs state
        apiPrintWarn term state
        putStrLn $ "\x1b[31m✗ " ++ name ++ "\x1b[0m"
        return $ Left $ "Error."
  putStrLn ""
  return $ sequence_ results

apiCheckAll :: FilePath -> IO (Either String ())
apiCheckAll basePath = do
  files <- findKindFiles basePath
  (book, defs, _) <- foldM (\(b, d, p) f -> do
    (b', d', p') <- apiLoad basePath b (extractName basePath f)
    return (b', M.union d d', M.union p p')
    ) (M.empty, M.empty, M.empty) files
  results <- forM (M.toList defs) $ \(_, names) -> do
    forM names $ \name -> do
      case M.lookup name book of
        Just term -> case envRun (doCheck term) book of
          Done _ _ -> do
            putStrLn $ "\x1b[32m✓ " ++ name ++ "\x1b[0m"
            return $ Right ()
          Fail _ -> do
            putStrLn $ "\x1b[31m✗ " ++ name ++ "\x1b[0m"
            return $ Left $ "Error."
        Nothing -> return $ Left $ "Definition not found: " ++ name
  return $ sequence_ (concat results)
  where
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

-- Shows a term
apiShow :: Book -> String -> IO (Either String ())
apiShow book name = case M.lookup name book of
  Just term -> do
    putStrLn $ termShow term
    return $ Right ()
  Nothing -> return $ Left $ "Error: Definition '" ++ name ++ "' not found."

-- Compiles the whole book to JS
apiToJS :: Book -> String -> IO (Either String ())
apiToJS book name = do
  let jsCode = compileJS book
  putStrLn jsCode
  return $ Right ()

-- Prints logs from the type-checker
apiPrintLogs :: State -> IO ()
apiPrintLogs (State book fill susp logs) = do
  forM_ logs $ \log -> do
    result <- infoShow book fill log
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
  Dat scp cts t -> concatMap getDeps scp ++ concatMap getDepsCtr cts ++ getDeps t
  Con _ arg     -> concatMap (getDeps . snd) arg
  Mat cse       -> concatMap (getDeps . snd) cse
  Let _ val bod -> getDeps val ++ getDeps (bod Set)
  Use _ val bod -> getDeps val ++ getDeps (bod Set)
  Op2 _ fst snd -> getDeps fst ++ getDeps snd
  Swi zer suc   -> getDeps zer ++ getDeps suc
  Src _ val     -> getDeps val
  Hol _ args    -> concatMap getDeps args
  Met _ args    -> concatMap getDeps args
  Log msg nxt   -> getDeps msg ++ getDeps nxt
  Var _ _       -> []
  Set           -> []
  U32           -> []
  F64           -> []
  Num _         -> []
  FNum _        -> []
  Txt _         -> []
  Lst elems     -> concatMap getDeps elems
  Nat _         -> []


-- Gets dependencies of a constructor
getDepsCtr :: Ctr -> [String]
getDepsCtr (Ctr _ tele) = getDepsTele tele

-- Gets dependencies of a telescope
getDepsTele :: Tele -> [String]
getDepsTele (TRet term) = getDeps term
getDepsTele (TExt _ typ bod) = getDeps typ ++ getDepsTele (bod Set)

-- Gets all dependencies (direct and indirect) of a term
getAllDeps :: Book -> String -> S.Set String
getAllDeps book name = go S.empty [name] where
  go visited [] = visited
  go visited (x:xs)
    | S.member x visited = go visited xs
    | otherwise = case M.lookup x book of
        Just term -> go (S.insert x visited) (getDeps term ++ xs)
        Nothing   -> go (S.insert x visited) xs

-- Stringification of results
infoShow :: Book -> Fill -> Info -> IO String
infoShow book fill info = case info of
  Found nam typ ctx dep ->
    let nam' = concat ["?", nam]
        typ' = termShower True (normal book fill 0 typ dep) dep
        ctx' = contextShow book fill ctx dep
    in return $ concat ["\x1b[1mGOAL\x1b[0m ", nam', " : ", typ', "\n", ctx']
  Error src exp det bad dep -> do
    let exp' = concat ["- expected : \x1b[32m", termShower True (normal book fill 0 exp dep) dep, "\x1b[0m"]
        det' = concat ["- detected : \x1b[31m", termShower True (normal book fill 0 det dep) dep, "\x1b[0m"]
        bad' = concat ["- origin   : \x1b[2m", termShower True (normal book fill 0 bad dep) dep, "\x1b[0m"]
    (file, text) <- case src of
      Just (Cod (Loc fileName iniLine iniCol) (Loc _ endLine endCol)) -> do
        canonPath <- resolveToAbsolutePath fileName
        content   <- readSourceFile canonPath
        let highlighted = highlightError (iniLine, iniCol) (endLine, endCol) content
        -- FIXME: remove this cropping when the parse locations are fixed to exclude suffix trivia
        return (canonPath, unlines $ take 8 $ lines highlighted)
      Nothing -> return ("unknown_file", "Could not read source file.\n")
    let src' = concat ["\x1b[4m", file, "\x1b[0m\n", text]
    return $ concat ["\x1b[1mERROR:\x1b[0m\n", exp', "\n", det', "\n", bad', "\n", src']
  Solve nam val dep ->
    return $ concat ["SOLVE: _", show nam, " = ", termShower True val dep]
  Vague nam ->
    return $ concat ["VAGUE: _", nam]
  Print val dep ->
    return $ termShower True val dep

contextShow :: Book -> Fill -> [Term] -> Int -> String
contextShow book fill ctx dep = unlines $ map (\term -> "- " ++ contextShowAnn book fill term dep) ctx

contextShowAnn :: Book -> Fill -> Term -> Int -> String
contextShowAnn book fill (Ann chk val typ) dep = concat [termShower True (normal book fill 0 val dep) dep, " : ", termShower True (normal book fill 0 typ dep) dep]
contextShowAnn book fill (Src _ val)       dep = contextShowAnn book fill val dep
contextShowAnn book fill term              dep = termShower True (normal book fill 0 term dep) dep

readSourceFile :: FilePath -> IO String
readSourceFile file = do
  result <- try (readFile file) :: IO (Either IOError String)
  case result of
    Right content -> return content
    Left _ -> do
      result2 <- try (readFile (file ++ "/_.kind2")) :: IO (Either IOError String)
      return $ either (const "Could not read source file.\n") id result2

resolveToAbsolutePath :: FilePath -> IO FilePath
resolveToAbsolutePath relativePath = do
    absPath <- canonicalizePath relativePath
    return absPath


-- Main
-- ----

main :: IO ()
main = do
  args <- getArgs
  currentDir <- getCurrentDirectory
  maybeBasePath <- findBookDir currentDir
  case maybeBasePath of
    Nothing -> do
      putStrLn "Error: No 'book' directory found in the path."
      exitWith (ExitFailure 1)
    Just basePath -> do
      result <- case args of
        ["check"]        -> apiCheckAll basePath
        ["check", input] -> runCheckCommand basePath input
        ["run", input]   -> runCommand basePath apiNormal input
        ["show", input]  -> runCommand basePath apiShow input
        ["to-js", input] -> runCommand basePath apiToJS input
        ["deps", input]  -> runDeps basePath input
        ["rdeps", input] -> runRDeps basePath input
        ["help"]         -> printHelp
        []               -> printHelp
        _                -> printHelp
      case result of
        Left err -> do
          putStrLn err
          exitWith (ExitFailure 1)
        Right _ -> exitWith ExitSuccess

runCommand :: FilePath -> (Book -> String -> IO (Either String ())) -> String -> IO (Either String ())
runCommand basePath cmd input = do
  let name = extractName basePath input
  (book, _, _) <- apiLoad basePath M.empty name
  cmd book name

runCheckCommand :: FilePath -> String -> IO (Either String ())
runCheckCommand basePath input = do
  let name = extractName basePath input
  let filePath = basePath </> name ++ ".kind"
  (book, defs, _) <- apiLoad basePath M.empty name
  apiCheckFile book defs filePath

runDeps :: FilePath -> String -> IO (Either String ())
runDeps basePath input = do
  let name = extractName basePath input
  (book, _, _) <- apiLoad basePath M.empty name
  case M.lookup name book of
    Just term -> do
      forM_ (filter (/= name) $ nub $ getDeps term) $ \dep -> putStrLn dep
      return $ Right ()
    Nothing -> return $ Left $ "Error: Definition '" ++ name ++ "' not found."

runRDeps :: FilePath -> String -> IO (Either String ())
runRDeps basePath input = do
  let name = extractName basePath input
  (book, _, _) <- apiLoad basePath M.empty name
  let deps = S.toList $ S.delete name $ getAllDeps book name
  forM_ deps $ \dep -> putStrLn dep
  return $ Right ()

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
