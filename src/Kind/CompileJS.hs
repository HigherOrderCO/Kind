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

-- Compilable Term
data CT
  = CNul
  | CLam String (CT -> CT)
  | CApp CT CT
  | CCon String [(String, CT)]
  | CMat [(String, [String], CT)]
  | CRef String
  | CLet String CT (CT -> CT)
  | CNum Word64
  | CFlt Double
  | COp2 Oper CT CT
  | CSwi CT CT
  | CLog CT CT
  | CVar String Int
  | CTxt String
  | CLst [CT]
  | CNat Integer

termToCT :: Book -> Fill -> Term -> Maybe Term -> Int -> CT
termToCT book fill term typx dep = go term where
  go (Lam nam bod) =
    let bod' = \x -> termToCT book fill (bod (Var nam dep)) Nothing (dep+1)
    in CLam nam bod'
  go (App fun arg) =
    let fun' = termToCT book fill fun Nothing dep
        arg' = termToCT book fill arg Nothing dep
    in CApp fun' arg'
  go (Ann _ val typ) =
    termToCT book fill val (Just typ) dep
  go (Slf _ _ _) =
    CNul
  go (Ins val) =
    termToCT book fill val typx dep
  go (ADT _ _ _) =
    CNul
  go (Con nam arg) =
    case lookup nam (getADTCts (reduce book fill 2 (fromJust typx))) of
      Just (Ctr _ tele) ->
        let fNames = getTeleNames tele dep []
            fields = map (\ (f,t) -> (f, termToCT book fill t Nothing dep)) $ zip fNames (map snd arg)
        in CCon nam fields
      Nothing -> error $ "constructor-not-found:" ++ nam
  go (Mat cse) =
    case reduce book fill 2 (fromJust typx) of
      (All _ adt _) ->
        let adt' = reduce book fill 2 adt
            cts  = getADTCts adt'
            cses = map (\ (cnam, cbod) ->
              if cnam == "_" then
                (cnam, [], termToCT book fill cbod Nothing dep)
              else case lookup cnam cts of
                Just (Ctr _ tele) ->
                  let fNames = getTeleNames tele dep []
                  in (cnam, fNames, termToCT book fill cbod Nothing dep)
                Nothing -> error $ "constructor-not-found:" ++ cnam) cse
        in CMat cses
      otherwise -> error "match-without-type"
  go (All _ _ _) =
    CNul
  go (Ref nam) =
    CRef nam
  go (Let nam val bod) =
    let val' = termToCT book fill val Nothing dep
        bod' = \x -> termToCT book fill (bod (Var nam dep)) Nothing (dep+1)
    in CLet nam val' bod'
  go (Use nam val bod) =
    termToCT book fill (bod val) typx dep
  go Set =
    CNul
  go U64 =
    CNul
  go F64 =
    CNul
  go (Num val) =
    CNum val
  go (Flt val) =
    CFlt val
  go (Op2 opr fst snd) =
    let fst' = termToCT book fill fst Nothing dep
        snd' = termToCT book fill snd Nothing dep
    in COp2 opr fst' snd'
  go (Swi zer suc) =
    let zer' = termToCT book fill zer Nothing dep
        suc' = termToCT book fill suc Nothing dep
    in CSwi zer' suc'
  go (Txt txt) =
    CTxt txt
  go (Lst lst) =
    CLst (map (\x -> termToCT book fill x Nothing dep) lst)
  go (Nat val) =
    CNat val
  go (Hol _ _) =
    CNul
  go (Met _ _) =
    CNul
  go (Log msg nxt) =
    let msg' = termToCT book fill msg Nothing dep
        nxt' = termToCT book fill nxt Nothing dep
    in CLog msg' nxt'
  go (Var nam idx) =
    CVar nam idx
  go (Src _ val) =
    termToCT book fill val typx dep

ctToJS :: Book -> Fill -> Maybe String -> CT -> Int -> ST.State Int String
ctToJS book fill var term dep = go term where
  go CNul =
    ret var "null"
  go (CLam nam bod) = do
    let uid = nameToJS nam ++ "$" ++ show dep
    bodyName <- fresh
    bodyStmt <- ctToJS book fill (Just bodyName) (bod (CVar uid dep)) (dep + 1)
    ret var $ concat ["(", uid, " => {", bodyStmt, "return ", bodyName, ";})" ]
  go (CApp fun arg) = do
    funExpr <- ctToJS book fill Nothing fun dep
    argExpr <- ctToJS book fill Nothing arg dep
    ret var $ concat ["(", funExpr, ")(", argExpr, ")"]
  go (CCon nam fields) = do
    fieldExprs <- forM fields $ \ (fname, fterm) -> do
      expr <- ctToJS book fill Nothing fterm dep
      return (fname, expr)
    let fields' = concatMap (\ (fname, expr) -> ", " ++ fname ++ ": " ++ expr) fieldExprs
    ret var $ concat ["({$: \"", nam, "\"", fields', "})"]
  go (CMat cses) = do
    cases <- forM cses $ \ (cnam, fields, cbod) ->
      if cnam == "_" then do
        retName <- fresh
        retStmt <- ctToJS book fill (Just retName) (CApp cbod (CVar "x" 0)) dep
        return $ concat ["default: { " ++ retStmt, " return " ++ retName ++ "; }"]
      else do
        let bod = foldl CApp cbod (map (\f -> (CVar ("x."++f) 0)) fields)
        retName <- fresh
        retStmt <- ctToJS book fill (Just retName) bod dep
        return $ concat ["case \"", cnam, "\": { ", retStmt, " return " ++ retName ++ "; }"]
    ret var $ concat ["(x => { switch (x.$) { ", unwords cases, " } })"]
  go (CRef nam) =
    ret var $ nameToJS nam
  go (CLet nam val bod) =
    case var of
      Just var -> do
        let uid = nameToJS nam ++ "$" ++ show dep
        valExpr <- ctToJS book fill (Just uid) val dep
        bodExpr <- ctToJS book fill (Just var) (bod (CVar uid dep)) (dep + 1)
        return $ concat [valExpr, bodExpr]
      Nothing -> do
        let uid = nameToJS nam ++ "$" ++ show dep
        valExpr <- ctToJS book fill (Just uid) val dep
        bodExpr <- ctToJS book fill Nothing (bod (CVar uid dep)) (dep + 1)
        return $ concat ["(() => {", valExpr, "return ", bodExpr, ";})()"]
  go (CNum val) =
    ret var $ show val
  go (CFlt val) =
    ret var $ show val
  go (COp2 opr fst snd) = do
    let opr' = operToJS opr
    fstExpr <- ctToJS book fill Nothing fst dep
    sndExpr <- ctToJS book fill Nothing snd dep
    ret var $ concat ["((", fstExpr, " ", opr', " ", sndExpr, ") >>> 0)"]
  go (CSwi zer suc) = do
    zerExpr <- ctToJS book fill Nothing zer dep
    sucExpr <- ctToJS book fill Nothing suc dep
    ret var $ concat ["((x => x === 0 ? ", zerExpr, " : ", sucExpr, "(x - 1)))"]
  go (CLog msg nxt) = do
    msgExpr <- ctToJS book fill Nothing msg dep
    nxtExpr <- ctToJS book fill Nothing nxt dep
    ret var $ concat ["(console.log(LIST_TO_JSTR(", msgExpr, ")), ", nxtExpr, ")"]
  go (CVar nam _) =
    ret var nam
  go (CTxt txt) =
    ret var $ "JSTR_TO_LIST(`" ++ txt ++ "`)"
  go (CLst lst) =
    let cons = \x acc -> CCon "Cons" [("head", x), ("tail", acc)]
        nil  = CCon "Nil" []
    in  ctToJS book fill var (foldr cons nil lst) dep
  go (CNat val) =
    let succ = \x -> CCon "Succ" [("pred", x)]
        zero = CCon "Zero" []
    in  ctToJS book fill var (foldr (\_ acc -> succ acc) zero [1..val]) dep

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
            ct  = bindCT (termToCT book fill (bind term []) Nothing 0) []
            def = ST.evalState (ctToJS book fill (Just uid) ct 0) 0
        in def ++ "\n\n"
      Fail _ ->
        error $ "COMPILATION_ERROR: " ++ name ++ " isn't well-typed."

bindCT :: CT -> [(String,CT)] -> CT
bindCT CNul ctx = CNul
bindCT (CLam nam bod) ctx =
  let bod' = \x -> bindCT (bod (CVar nam 0)) ((nam, x) : ctx) in
  CLam nam bod'
bindCT (CApp fun arg) ctx =
  let fun' = bindCT fun ctx in
  let arg' = bindCT arg ctx in
  CApp fun' arg'
bindCT (CCon nam fields) ctx =
  let fields' = map (\(f, x) -> (f, bindCT x ctx)) fields in
  CCon nam fields'
bindCT (CMat cases) ctx =
  let cases' = map (\(cn,fs,cb) -> (cn, fs, bindCT cb ctx)) cases in
  CMat cases'
bindCT (CRef nam) ctx =
  case lookup nam ctx of
    Just x  -> x
    Nothing -> CRef nam
bindCT (CLet nam val bod) ctx =
  let val' = bindCT val ctx in
  let bod' = \x -> bindCT (bod (CVar nam 0)) ((nam, x) : ctx) in
  CLet nam val' bod'
bindCT (CNum val) ctx = CNum val
bindCT (CFlt val) ctx = CFlt val
bindCT (COp2 opr fst snd) ctx =
  let fst' = bindCT fst ctx in
  let snd' = bindCT snd ctx in
  COp2 opr fst' snd'
bindCT (CSwi zer suc) ctx =
  let zer' = bindCT zer ctx in
  let suc' = bindCT suc ctx in
  CSwi zer' suc'
bindCT (CLog msg nxt) ctx =
  let msg' = bindCT msg ctx in
  let nxt' = bindCT nxt ctx in
  CLog msg' nxt'
bindCT (CVar nam idx) ctx =
  case lookup nam ctx of
    Just x  -> x
    Nothing -> CVar nam idx
bindCT (CTxt txt) ctx = CTxt txt
bindCT (CLst lst) ctx =
  let lst' = map (\x -> bindCT x ctx) lst in
  CLst lst'
bindCT (CNat val) ctx = CNat val
