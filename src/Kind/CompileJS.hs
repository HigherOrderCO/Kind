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
import Data.Word
import qualified Control.Monad.State.Lazy as ST
import qualified Data.IntMap.Strict as IM
import qualified Data.Map.Strict as M

import Debug.Trace

import Prelude hiding (EQ, LT, GT)

useTypes :: Book -> Fill -> Term -> Maybe Term -> Int -> Term
useTypes book fill term typx dep = go term where
  go (All _ _ _) =
    Set
  go (Lam nam bod) =
    let bod' = \x -> useTypes book fill (bod x) Nothing (dep+1)
    in Lam nam bod'
  go (App fun arg) =
    let fun' = useTypes book fill fun Nothing dep
        arg' = useTypes book fill arg Nothing dep
    in App fun' arg'
  go (Ann _ val typ) =
    useTypes book fill val (Just typ) dep
  go (Slf _ _ _) =
    Set
  go (Ins val) =
    useTypes book fill val typx dep
  go (ADT _ _ _) =
    Set
  go (Con nam arg) =
    let adt = reduce book fill 2 (fromJust typx)
        cts = getADTCts adt
    in case lookup nam cts of
      Just (Ctr _ tele) ->
        let nms  = getTeleNames tele dep []
            arg' = map (\ (nm, (_, tm)) -> (Just nm, useTypes book fill tm Nothing dep)) (zip nms arg)
        in Con nam arg'
  go (Mat cse) =
    case reduce book fill 2 (fromJust typx) of
      All _ adt _ ->
        let cts = getADTCts (reduce book fill 2 adt)
        in Mat $ map (\(cnam, cbod) ->
          if cnam == "_" then
            (cnam, useTypes book fill (App cbod (Var "x" 0)) Nothing dep)
          else case lookup cnam cts of
            Just (Ctr _ tele) ->
              let fieldNames = getTeleNames tele dep []
                  cbodApps = foldl App cbod (map (\f -> Var ("x."++f) 0) fieldNames)
              in (cnam, useTypes book fill cbodApps Nothing dep)
            Nothing -> error $ "constructor-not-found:" ++ cnam
        ) cse
      _ -> error "Invalid type for match expression"
  go (Ref nam) =
    Ref nam
  go (Let nam val bod) =
    let val' = useTypes book fill val Nothing dep
        bod' = \x -> useTypes book fill (bod x) Nothing (dep + 1)
    in Let nam val' bod'
  go (Use nam val bod) =
    useTypes book fill (bod val) typx dep
  go Set =
    Set
  go U64 =
    U64
  go F64 =
    F64
  go (Num val) =
    Num val
  go (Flt val) =
    Flt val
  go (Op2 opr fst snd) =
    let fst' = useTypes book fill fst Nothing dep
        snd' = useTypes book fill snd Nothing dep
    in Op2 opr fst' snd'
  go (Swi zer suc) =
    let zer' = useTypes book fill zer Nothing dep
        suc' = useTypes book fill suc Nothing dep
    in Swi zer' suc'
  go (Txt txt) =
    Txt txt
  go (Lst lst) =
    let lst' = map (\x -> useTypes book fill x Nothing dep) lst
    in Lst lst'
  go (Nat val) =
    Nat val
  go (Hol _ _) =
    Set
  go (Met _ _) =
    Set
  go (Log msg nxt) =
    let msg' = useTypes book fill msg Nothing dep
        nxt' = useTypes book fill nxt Nothing dep
    in Log msg' nxt'
  go (Var nam _) =
    Var nam 0
  go (Src _ val) =
    useTypes book fill val typx dep

termToJS :: Book -> Fill -> Maybe String -> Term -> Int -> ST.State Int String
termToJS book fill var term dep = go term where
  go (All _ _ _) =
    ret var "null"
  go (Lam nam bod) = do
    let (names, bodyTerm) = lams term [] where
          lams (Lam n b)   names = let uid = nameToJS n ++ "$" ++ show dep
                                   in lams (b (Var uid dep)) (uid : names)
          lams (Src _ v)   names = lams v names
          lams (Ann _ v _) names = lams v names
          lams tm          names = (reverse names, tm)
    bodyName <- fresh
    bodyStmt <- termToJS book fill (Just bodyName) bodyTerm (dep + length names)
    ret var $ concat ["(", intercalate " => " names, " => {", bodyStmt, "return ", bodyName, ";", "})"]
  go (App fun arg) = do
    funExpr <- termToJS book fill Nothing fun dep
    argExpr <- termToJS book fill Nothing arg dep
    ret var $ concat ["(", funExpr, ")(", argExpr, ")"]
  go (Ann _ val _) =
    termToJS book fill var val dep
  go (Slf _ _ _) =
    ret var "null"
  go (Ins val) =
    termToJS book fill var val dep
  go (ADT _ _ _) =
    ret var "null"
  go (Con nam arg) = do
    argExprs <- forM arg $ \ (fname, argTerm) -> do
      expr <- termToJS book fill Nothing argTerm dep
      return (fromJust fname, expr)
    let fields = concatMap (\ (fname, expr) -> ", " ++ fname ++ ": " ++ expr) argExprs
    ret var $ concat ["({$: \"", nam, "\"", fields, "})"]
  go (Mat cse) = do
    cases <- forM cse $ \ (cnam, cbod) -> do
      retName <- fresh
      retStmt <- termToJS book fill (Just retName) cbod dep
      return $ concat ["case \"", cnam, "\": { ", retStmt, " return " ++ retName ++ "; }"]
    ret var $ concat ["(x => { switch (x.$) { ", unwords cases, " } })"]
  go (Ref nam) =
    ret var $ nameToJS nam

  go (Let nam val bod) =
    case var of
      Just var -> do
        let uid = nameToJS nam ++ "$" ++ show dep
        valExpr <- termToJS book fill (Just uid) val dep
        bodExpr <- termToJS book fill (Just var) (bod (Var uid dep)) (dep + 1)
        return $ concat [valExpr, bodExpr]
      Nothing -> do
        let uid = nameToJS nam ++ "$" ++ show dep
        valExpr <- termToJS book fill (Just uid) val dep
        bodExpr <- termToJS book fill Nothing (bod (Var uid dep)) (dep + 1)
        return $ concat ["(() => {", valExpr, "return ", bodExpr, ";})()"]
  go (Use nam val bod) =
    termToJS book fill var (bod val) dep
  go Set =
    ret var "null"
  go U64 =
    ret var "null"
  go F64 =
    ret var "null"
  go (Num val) =
    ret var $ show val
  go (Flt val) =
    ret var $ show val
  go (Op2 opr fst snd) = do
    let opr' = operToJS opr
    fstExpr <- termToJS book fill Nothing fst dep
    sndExpr <- termToJS book fill Nothing snd dep
    ret var $ concat ["((", fstExpr, " ", opr', " ", sndExpr, ") >>> 0)"]
  go (Swi zer suc) = do
    zerExpr <- termToJS book fill Nothing zer dep
    sucExpr <- termToJS book fill Nothing suc dep
    ret var $ concat ["((x => x === 0 ? ", zerExpr, " : ", sucExpr, "(x - 1)))"]
  go (Txt txt) =
    ret var $ "JSTR_TO_LIST(`" ++ txt ++ "`)"
  go (Lst lst) = do
    let cons = \x acc -> Con "Cons" [(Just "head", x), (Just "tail", acc)]
        nil  = Con "Nil" []
    termToJS book fill var (foldr cons nil lst) dep
  go (Nat val) = do
    let succ = \x -> Con "Succ" [(Just "pred", x)]
        zero = Con "Zero" []
    termToJS book fill var (foldr (\_ acc -> succ acc) zero [1..val]) dep
  go (Hol _ _) =
    ret var "null"
  go (Met _ _) =
    ret var "null"
  go (Log msg nxt) = do
    msgExpr <- termToJS book fill Nothing msg dep
    nxtExpr <- termToJS book fill Nothing nxt dep
    ret var $ concat ["(console.log(LIST_TO_JSTR(", msgExpr, ")), ", nxtExpr, ")"]
  go (Var nam _) =
    ret var nam
  go (Src _ val) =
    termToJS book fill var val dep






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
            adj = useTypes book fill val Nothing 0
            def = ST.evalState (termToJS book fill (Just uid) adj 0) 0
        in def ++ "\n\n"
      Fail _ ->
        error $ "COMPILATION_ERROR: " ++ name ++ " isn't well-typed."

