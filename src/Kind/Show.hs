module Kind.Show where

import Prelude hiding (EQ, LT, GT)

import Kind.Type
import Kind.Reduce

import System.IO (readFile)
import System.Directory (canonicalizePath)
import Control.Exception (try)

import qualified Data.Map.Strict as M
import qualified Data.IntMap.Strict as IM

import Highlight (highlightError)

import System.Console.ANSI

-- Stringification
-- ---------------

termShower :: Bool -> Term -> Int -> String
termShower small term dep = case term of
  All nam inp bod ->
    let nam' = nam
        inp' = termShower small inp dep
        bod' = termShower small (bod (Var nam dep)) (dep + 1)
    in concat ["∀(" , nam' , ": " , inp' , ") " , bod']
  Lam nam bod ->
    let nam' = nam
        bod' = termShower small (bod (Var nam dep)) (dep + 1)
    in concat ["λ" , nam' , " " , bod']
  App fun arg ->
    let (fun', args) = unwrapApp fun [arg]
        fun'' = termShower small fun' dep
        args' = unwords (map (\x -> termShower small x dep) args)
    in concat ["(" , fun'' , " " , args' , ")"]
  Ann chk val typ ->
    if small
      then termShower small val dep
      else let val' = termShower small val dep
               typ' = termShower small typ dep
           in concat ["{" , val' , ": " , typ' , "}"]
  Slf nam typ bod ->
    termShower small typ dep
  Ins val ->
    let val' = termShower small val dep
    in concat ["~" , val']
  Dat scp cts ->
    let scp' = unwords (map (\x -> termShower small x dep) scp)
        cts' = unwords (map (\(Ctr nm fs rt) ->
          "#" ++ nm ++ "{" ++
          unwords (map (\(fn, ft) -> fn ++ ":" ++ termShower small ft dep) fs) ++
          "} : " ++ termShower small rt dep) cts)
    in concat ["#[", scp', "]{ ", cts', " }"]
  Con nam arg ->
    let arg' = unwords (map (\x -> termShower small x dep) arg)
    in concat ["#", nam, "{", arg', "}"]
  Mat cse ->
    let cse' = unwords (map (\(cnm, cbod) -> "#" ++ cnm ++ ": " ++ termShower small cbod dep) cse)
    in concat ["λ{ ", cse', " }"]
  Ref nam -> nam
  Let nam val bod ->
    let nam' = nam
        val' = termShower small val dep
        bod' = termShower small (bod (Var nam dep)) (dep + 1)
    in concat ["let " , nam' , " = " , val' , "; " , bod']
  Use nam val bod ->
    let nam' = nam
        val' = termShower small val dep
        bod' = termShower small (bod (Var nam dep)) (dep + 1)
    in concat ["use " , nam' , " = " , val' , "; " , bod']
  Set -> "*"
  U32 -> "U32"
  Num val ->
    let val' = show val
    in concat [val']
  Op2 opr fst snd ->
    let opr' = operShow opr
        fst' = termShower small fst dep
        snd' = termShower small snd dep
    in concat ["(" , opr' , " " , fst' , " " , snd' , ")"]
  Swi nam x z s p ->
    let nam' = nam
        x'   = termShower small x dep
        z'   = termShower small z dep
        s'   = termShower small (s (Var (nam ++ "-1") dep)) (dep + 1)
        p'   = termShower small (p (Var nam dep)) dep
    in concat ["switch " , nam' , " = " , x' , " { 0: " , z' , " _: " , s' , " }: " , p']
  Txt txt -> concat ["\"" , txt , "\""]
  Nat val -> show val
  Hol nam ctx -> concat ["?" , nam]
  Met uid spn -> concat ["(_", strSpn (reverse spn) dep, ")"]
  Var nam idx -> nam
  Src src val -> if small
    then termShower small val dep
    else concat ["!", termShower small val dep]

unwrapApp :: Term -> [Term] -> (Term, [Term])
unwrapApp (App fun arg) args = unwrapApp fun (arg:args)
unwrapApp term          args = (term, args)

termShow :: Term -> String
termShow term = termShower True term 0

strSpn :: [Term] -> Int -> String
strSpn []       dep = ""
strSpn (x : xs) dep = concat [" ", termShower True x dep, strSpn xs dep]

operShow :: Oper -> String
operShow ADD = "+"
operShow SUB = "-"
operShow MUL = "*"
operShow DIV = "/"
operShow MOD = "%"
operShow EQ  = "=="
operShow NE  = "!="
operShow LT  = "<"
operShow GT  = ">"
operShow LTE = "<="
operShow GTE = ">="
operShow AND = "&"
operShow OR  = "|"
operShow XOR = "^"
operShow LSH = "<<"
operShow RSH = ">>"

contextShow :: Book -> Fill -> [Term] -> Int -> String
contextShow book fill ctx dep = unlines $ map (\term -> "- " ++ contextShowAnn book fill term dep) (reverse ctx)

contextShowAnn :: Book -> Fill -> Term -> Int -> String
contextShowAnn book fill (Ann chk val typ) dep = concat [termShower True val dep, " : ", termShower True typ dep]
contextShowAnn book fill (Src _ val)       dep = contextShowAnn book fill val dep
contextShowAnn book fill term              dep = termShower True term dep

infoShow :: Book -> Fill -> Info -> IO String
infoShow book fill info = case info of
  Found nam typ ctx dep ->
    let nam' = concat ["?", nam]
        typ' = termShower True typ dep
        ctx' = contextShow book fill ctx dep
    in return $ concat ["\x1b[1mGOAL\x1b[0m ", nam', " : ", typ', "\n", ctx']
  Error src exp det bad dep -> do
    let exp' = concat ["- expected: \x1b[32m", termShower True exp dep, "\x1b[0m"]
        det' = concat ["- detected: \x1b[31m", termShower True det dep, "\x1b[0m"]
        bad' = concat ["- bad_term: \x1b[2m", termShower True bad dep, "\x1b[0m"]
    (file, text) <- case src of
      Just (Cod (Loc fileName iniLine iniCol) (Loc _ endLine endCol)) -> do
        canonPath <- resolveToAbsolutePath fileName
        content   <- readSourceFile canonPath
        let highlighted = highlightError (iniLine, iniCol) (endLine, endCol) content
        return (canonPath, highlighted)
      Nothing -> return ("unknown_file", "Could not read source file.")
    let src' = concat ["\x1b[4m", file, "\x1b[0m\n", text]
    return $ concat ["\x1b[1mERROR:\x1b[0m\n", exp', "\n", det', "\n", bad', "\n", src']
  Solve nam val dep ->
    return $ concat ["SOLVE: _", show nam, " = ", termShower True val dep]
  Vague nam ->
    return $ concat ["VAGUE: _", nam]
  Print val dep ->
    return $ termShower True val dep

readSourceFile :: FilePath -> IO String
readSourceFile file = do
  result <- try (readFile file) :: IO (Either IOError String)
  case result of
    Right content -> return content
    Left _ -> do
      result2 <- try (readFile (file ++ "/_.kind2")) :: IO (Either IOError String)
      return $ either (const "Could not read source file.") id result2

resolveToAbsolutePath :: FilePath -> IO FilePath
resolveToAbsolutePath relativePath = do
    absPath <- canonicalizePath relativePath
    return absPath
