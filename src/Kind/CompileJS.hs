-- Checker:
-- //./Type.hs//

module Kind.CompileJS where

import Kind.Check
import Kind.Env
import Kind.Equal
import Kind.Reduce
import Kind.Show
import Kind.Type
import Kind.Util

import Control.Monad (forM)
import Data.List (intercalate)
import Data.Maybe (fromJust)
import qualified Control.Monad.State.Lazy as ST
import qualified Data.IntMap.Strict as IM
import qualified Data.Map.Strict as M

import Debug.Trace

import Prelude hiding (EQ, LT, GT)

termToJS :: Book -> Fill -> Maybe String -> Term -> Maybe Term -> Int -> ST.State Int String
termToJS book fill var term typx dep = {-trace ("termToJS: " ++ showTermGo False term dep ++ maybe "" (\t -> " :: " ++ showTermGo True t dep) typx) $ -} go term where
  go (All _ _ _) =
    ret var "null"
  go tm@(Lam nam bod) = do
    let (names, bodyTerm, bodyType) = lams tm typx dep []
    bodyName <- fresh
    bodyStmt <- termToJS book fill (Just bodyName) bodyTerm bodyType (dep + length names)
    ret var $ concat ["(", intercalate " => " names, " => {", bodyStmt, "return ", bodyName, ";", "})"]
    where lams (Lam n b)   ty dep names = let uid = nameToJS nam ++ "$" ++ show dep
                                          in lams (b (Var uid dep)) Nothing (dep+1) (uid : names)
          lams (Src x v)   ty dep names = lams v ty       dep names
          lams (Ann c v t) _  dep names = lams v (Just t) dep names
          lams tm          ty dep names = (reverse names, tm, ty)
  go (App fun arg) = do
    funExpr <- termToJS book fill Nothing fun Nothing dep
    argExpr <- termToJS book fill Nothing arg Nothing dep
    ret var $ concat ["(", funExpr, ")(", argExpr, ")"]
  go (Ann _ val typ) =
    termToJS book fill var val (Just typ) dep
  go (Slf _ _ _) =
    ret var "null"
  go (Ins val) =
    termToJS book fill var val typx dep
  go (ADT _ _ _) =
    ret var "null"
  go (Con nam arg) = do
    let adt = reduce book fill 2 (fromJust typx)
    let cts = getADTCts adt
    case lookup nam cts of
      Just (Ctr _ tele) -> do
        let fieldNames = getTeleNames tele dep []
        argExprs <- forM (zip fieldNames arg) $ \ (fieldName, (_, argTerm)) -> do
          expr <- termToJS book fill Nothing argTerm Nothing dep
          return (fieldName, expr)
        let fields = concatMap (\ (fname, expr) -> ", " ++ fname ++ ": " ++ expr) argExprs
        ret var $ concat ["({$: \"", nam, "\"", fields, "})"]
      Nothing -> error $ "constructor-not-found:" ++ nam
  go (Mat cse) = do
    case (reduce book fill 2 (fromJust typx)) of
      (All _ adt _) -> do
        let cts = getADTCts (reduce book fill 2 adt)
        cases <- forM cse $ \ (cnam, cbod) ->
          if cnam == "_" then do
            retName <- fresh
            retStmt <- termToJS book fill (Just retName) (App cbod (Var "x" 0)) Nothing dep
            return $ concat ["default: { " ++ retStmt, " return " ++ retName ++ "; }"]
          else case lookup cnam cts of
            Just (Ctr _ tele) -> do
              let fieldNames = getTeleNames tele dep []
              let cbodApps = foldl App cbod (map (\f -> (Var ("x."++f) 0)) fieldNames)
              retName <- fresh
              retStmt <- termToJS book fill (Just retName) cbodApps Nothing dep
              return $ concat ["case \"", cnam, "\": { ", retStmt, " return " ++ retName ++ "; }"]
            Nothing -> error $ "constructor-not-found:" ++ cnam
        ret var $ concat ["(x => { switch (x.$) { ", unwords cases, " } })"]
      otherwise -> error "?"
  go (Ref nam) =
    ret var $ nameToJS nam
  go (Let nam val bod) =
    case var of
      Just var -> do
        let uid = nameToJS nam ++ "$" ++ show dep
        valExpr <- termToJS book fill (Just uid) val Nothing dep
        bodExpr <- termToJS book fill (Just var) (bod (Var uid dep)) Nothing (dep + 1)
        return $ concat [valExpr, bodExpr]
      Nothing -> do
        let uid = nameToJS nam ++ "$" ++ show dep
        valExpr <- termToJS book fill (Just uid) val Nothing dep
        bodExpr <- termToJS book fill Nothing (bod (Var uid dep)) Nothing (dep + 1)
        return $ concat ["(() => {", valExpr, "return ", bodExpr, ";})()"]
  go (Use nam val bod) =
    termToJS book fill var (bod val) typx dep
  go Set =
    ret var "null"
  go U32 =
    ret var "null"
  go (Num val) =
    ret var $ show val
  go (Op2 opr fst snd) = do
    let opr' = operToJS opr
    fstExpr <- termToJS book fill Nothing fst Nothing dep
    sndExpr <- termToJS book fill Nothing snd Nothing dep
    ret var $ concat ["((", fstExpr, " ", opr', " ", sndExpr, ") >>> 0)"]
  go (Swi zer suc) = do
    zerExpr <- termToJS book fill Nothing zer Nothing dep
    sucExpr <- termToJS book fill Nothing suc Nothing dep
    ret var $ concat ["((x => x === 0 ? ", zerExpr, " : ", sucExpr, "(x - 1)))"]
  go (Txt txt) =
    ret var $ "JSTR_TO_LIST(`" ++ txt ++ "`)"
  go (Lst lst) =
    let cons = \x acc -> Con "Cons" [(Nothing, x), (Nothing, acc)]
        nil  = Con "Nil" []
    in  termToJS book fill var (foldr cons nil lst) typx dep
  go (Nat val) =
    let succ = \x -> Con "Succ" [(Nothing, x)]
        zero = Con "Zero" []
    in  termToJS book fill var (foldr (\_ acc -> succ acc) zero [1..val]) typx dep
  go (Hol _ _) =
    ret var "null"
  go (Met _ _) =
    ret var "null"
  go (Log msg nxt) = do
    msgExpr <- termToJS book fill Nothing msg Nothing dep
    nxtExpr <- termToJS book fill Nothing nxt Nothing dep
    ret var $ concat ["(console.log(LIST_TO_JSTR(", msgExpr, ")), ", nxtExpr, ")"]
  go (Var nam _) =
    ret var nam
  go (Src _ val) =
    termToJS book fill var val typx dep

operToJS :: Oper -> String
operToJS ADD = "+"
operToJS SUB = "-"
operToJS MUL = "*"
operToJS DIV = "/"
operToJS MOD = "%"
operToJS EQ  = "==="
operToJS NE  = "!=="
operToJS LT  = "<"
operToJS GT  = ">"
operToJS LTE = "<="
operToJS GTE = ">="
operToJS AND = "&"
operToJS OR  = "|"
operToJS XOR = "^"
operToJS LSH = "<<"
operToJS RSH = ">>"

nameToJS :: String -> String
nameToJS x = "$" ++ map (\c -> if c == '/' || c == '.' || c == '-' || c == '#' then '$' else c) x

fresh :: ST.State Int String
fresh = do
  n <- ST.get
  ST.put (n + 1)
  return $ "$x" ++ show n

-- Assigns an expression to a name, or return it directly
ret :: Maybe String -> String -> ST.State Int String
ret (Just name) expr = return $ "var " ++ name ++ " = " ++ expr ++ ";"
ret Nothing     expr = return $ expr

prelude :: String
prelude = unlines [
  "function LIST_TO_JSTR(list) {",
  "  try {",
  "    let result = '';",
  "    let current = list;",
  "    while (current.$ === 'Cons') {",
  "      result += String.fromCodePoint(current.head);",
  "      current = current.tail;",
  "    }",
  "    if (current.$ === 'Nil') {",
  "      return result;",
  "    }",
  "  } catch (e) {}",
  "  return list;",
  "}",
  "",
  "function JSTR_TO_LIST(str) {",
  "  let list = {$: 'Nil'};",
  "  for (let i = str.length - 1; i >= 0; i--) {",
  "    list = {$: 'Cons', head: str.charCodeAt(i), tail: list};",
  "  }",
  "  return list;",
  "}"
  ]

compileJS :: Book -> String
compileJS book = prelude ++ "\n\n" ++ concatMap compileDef (topoSortBook book) where
  compileDef (name, term) =
    case envRun (doAnnotate term) book of
      Done _ (term, fill) ->
        let uid = nameToJS name
            val = bind term []
            def = ST.evalState (termToJS book fill (Just uid) val Nothing 0) 0
        in def ++ "\n\n"
      Fail _ ->
        error $ "COMPILATION_ERROR: " ++ name ++ " isn't well-typed."
