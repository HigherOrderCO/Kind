-- //./Type.hs//

module Kind.Show where

import Prelude hiding (EQ, LT, GT)

import Kind.Type
import Kind.Reduce

import Debug.Trace
import System.IO (readFile)
import System.Directory (canonicalizePath)
import Control.Exception (try)
import Data.Word

import Control.Applicative ((<|>))

import qualified Data.Map.Strict as M
import qualified Data.IntMap.Strict as IM

import Highlight (highlightError)

import System.Console.ANSI

-- Stringification
-- ---------------

termShower :: Bool -> Term -> Int -> String
termShower small term dep =
  case pretty term of
    Just str -> str
    Nothing  -> case term of
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
        let nam' = nam
            typ' = termShower small typ dep
            bod' = termShower small (bod (Var nam dep)) (dep + 1)
        in concat ["$(" , nam' , ": " , typ' , ") " , bod']
      Ins val ->
        let val' = termShower small val dep
        in concat ["~" , val']
      -- CHANGED: Updated Dat case to use new Ctr structure
      Dat scp cts typ ->
        let scp' = unwords (map (\x -> termShower small x dep) scp)
            cts' = unwords (map (\(Ctr nm tele) -> "#" ++ nm ++ " " ++ teleShower small tele dep) cts)
            typ' = termShower small typ dep
        in concat ["#[", scp', "]{ ", cts', " } : ", typ']
      Con nam arg ->
        let arg' = unwords (map showArg arg)
        in concat ["#", nam, "{", arg', "}"]
        where
          showArg (maybeField, term) = case maybeField of
            Just field -> field ++ ": " ++ termShower small term dep
            Nothing -> termShower small term dep
      Mat cse ->
        let cse' = unwords (map (\(cnm, cbod) -> "#" ++ cnm ++ ": " ++ termShower small cbod dep) cse)
        in concat ["λ{ ", cse', " }"]
      -- Ref nam -> concat ["@", nam]
      Ref nam -> concat [nam]
      Let nam val bod ->
        let nam' = nam
            val' = termShower small val dep
            bod' = termShower small (bod (Var nam dep)) (dep + 1)
        in concat ["let " , nam' , " = " , val' , " " , bod']
      Use nam val bod ->
        let nam' = nam
            val' = termShower small val dep
            bod' = termShower small (bod (Var nam dep)) (dep + 1)
        in concat ["use " , nam' , " = " , val' , " " , bod']
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
      Swi zero succ ->
        let zero' = termShower small zero dep
            succ' = termShower small succ dep
        in concat ["λ{ 0: ", zero', " _: ", succ', " }"]
      Txt txt -> concat ["\"" , txt , "\""]
      Lst lst -> concat ["[", unwords (map (\x -> termShower small x dep) lst), "]"]
      Nat val -> concat ["#", (show val)]
      Hol nam ctx -> concat ["?" , nam]
      -- Met uid spn -> concat ["_", show uid, "[", strSpn spn dep, " ]"]
      Met uid spn -> concat ["_", show uid]
      Log msg nxt -> 
        let msg' = termShower small msg dep
            nxt' = termShower small nxt dep
        in concat ["log ", msg', " ", nxt']
      Var nam idx -> nam
      Src src val -> if small
        then termShower small val dep
        else concat ["!", termShower small val dep]

pretty :: Term -> Maybe String
pretty term = prettyString term <|> prettyNat term <|> prettyList term <|> prettyEqual term

prettyString :: Term -> Maybe String
prettyString (Con "View" [(_, term)]) = do
  chars <- prettyStringGo term
  return $ '"' : chars ++ "\""
prettyString _ = Nothing

prettyStringGo :: Term -> Maybe String
prettyStringGo (Con "Nil" []) = Just []
prettyStringGo (Con "Cons" [(_, Num head), (_, tail)]) = do
  rest <- prettyStringGo tail
  return $ toEnum (fromIntegral head) : rest
prettyStringGo _ = Nothing

prettyNat :: Term -> Maybe String
prettyNat (Con "Zero" []) = Just "#0"
prettyNat term = go 0 term where
  go n (Con "Succ" [(_, pred)]) = go (n + 1) pred
  go n (Con "Zero" []) = Just $ "#" ++ show n
  go _ _ = Nothing

prettyList :: Term -> Maybe String
prettyList term = do
  terms <- asList term
  return $ "[" ++ unwords (map (\x -> termShower True x 0) terms) ++ "]"
  where asList (Con "Nil" []) = do
          Just []
        asList (Con "Cons" [(_, head), (_, tail)]) = do
          rest <- asList tail
          return (head : rest)
        asList _ = Nothing

prettyEqual :: Term -> Maybe String
prettyEqual (App (App (App (Ref "Equal") t) a) b) = do
  let a' = termShower True a 0
      b' = termShower True b 0
  return $ a' ++ " == " ++ b'
prettyEqual _ = Nothing

-- CHANGED: Added teleShower function
teleShower :: Bool -> Tele -> Int -> String
teleShower small tele dep = "{ " ++ go tele dep where
  go (TExt nam typ bod) dep =
    let typ' = termShower small typ dep
        bod' = go (bod (Var nam dep)) (dep + 1)
    in concat [nam, ": ", typ', " ", bod']
  go (TRet term) dep =
    let term' = termShower small term dep
    in concat ["}: ", term']

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
contextShow book fill ctx dep = unlines $ map (\term -> "- " ++ contextShowAnn book fill term dep) ctx

contextShowAnn :: Book -> Fill -> Term -> Int -> String
contextShowAnn book fill (Ann chk val typ) dep = concat [termShower True (normal book fill 0 val dep) dep, " : ", termShower True (normal book fill 0 typ dep) dep]
contextShowAnn book fill (Src _ val)       dep = contextShowAnn book fill val dep
contextShowAnn book fill term              dep = termShower True (normal book fill 0 term dep) dep

-- normal :: Book -> Fill -> Int -> Term -> Int -> Term

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
