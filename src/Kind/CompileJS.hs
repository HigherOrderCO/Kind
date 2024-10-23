-- old compiler:
-- //./old_compiler.txt//

module Kind.CompileJS where

import Kind.Reduce
import Kind.Type
import Kind.Util

import qualified Data.Map.Strict as M
import qualified Data.IntMap.Strict as IM
import Data.List (intercalate)
import qualified Control.Monad.State.Lazy as ST

import Prelude hiding (EQ, LT, GT)

termToJS :: Maybe String -> Term -> Int -> ST.State Int String
termToJS var term dep = case term of
  All _ _ _ ->
    ret var "null"
  -- on the lam case, let's group lambdas, allowing us to give a fresh name to the body
  tm@(Lam nam bod) -> do
    let (names, body) = lams tm dep []
    bodyName <- fresh
    bodyStmt <- termToJS (Just bodyName) body (dep + length names)
    ret var $ concat ["(", intercalate " => " names, " => {", bodyStmt, "return ", bodyName, ";", "})"]
    where lams (Lam n b) dep names = lams (b (Var n dep)) (dep+1) ((nameToJS n ++ "$" ++ show dep) : names)
          lams (Src x v) dep names = lams v dep names
          lams t         dep names = (reverse names, t)
  App fun arg -> do
    funExpr <- termToJS Nothing fun dep
    argExpr <- termToJS Nothing arg dep
    ret var $ concat ["(", funExpr, ")(", argExpr, ")"]
  Ann _ val _ ->
    termToJS var val dep
  Slf _ _ _ ->
    ret var "null"
  Ins val ->
    termToJS var val dep
  Dat _ _ _ ->
    ret var "null"
  Con nam arg -> do
    argExpr <- mapM (\(f, x) -> termToJS Nothing x dep) arg
    let fields = concat (zipWith (\i x -> concat [", x", show i, ": ", x]) [0..] argExpr)
    ret var $ concat ["({$: \"", nam, "\", _: ", show (length arg), fields, "})"]
  Mat cse -> do
    cseExpr <- mapM (\(cnam, cbod) -> do
      cbodExpr <- termToJS Nothing cbod dep
      return $ if cnam == "_"
        then concat ["default: return (", cbodExpr, ")(x);"]
        else concat ["case \"", cnam, "\": return APPLY(", cbodExpr, ", x);"]
      ) cse
    ret var $ concat ["(x => { switch (x.$) { ", unwords cseExpr, " } })"]
  Ref nam ->
    ret var $ nameToJS nam
  Let nam val bod ->
    case var of
      Just var -> do
        valExpr <- termToJS (Just (nameToJS nam ++ "$" ++ show dep)) val dep
        bodExpr <- termToJS (Just var) (bod (Var nam dep)) (dep + 1)
        return $ concat [valExpr, bodExpr]
      Nothing -> do
        valExpr <- termToJS (Just (nameToJS nam ++ "$" ++ show dep)) val dep
        bodExpr <- termToJS Nothing (bod (Var nam dep)) (dep + 1)
        return $ concat ["(() => {", valExpr, "return ", bodExpr, ";})()"]
  Use nam val bod -> do
    termToJS var (bod val) dep
  Set ->
    ret var "null"
  U32 ->
    ret var "null"
  Num val ->
    ret var $ show val
  Op2 opr fst snd -> do
    let opr' = operToJS opr
    fstExpr <- termToJS Nothing fst dep
    sndExpr <- termToJS Nothing snd dep
    ret var $ concat ["((", fstExpr, " ", opr', " ", sndExpr, ") >>> 0)"]
  Swi zer suc -> do
    zerExpr <- termToJS Nothing zer dep
    sucExpr <- termToJS Nothing suc dep
    ret var $ concat ["((x => x === 0 ? ", zerExpr, " : ", sucExpr, "(x - 1)))"]
  Txt txt ->
    let cons = \x acc -> Con "Cons" [(Nothing, x), (Nothing, acc)]
        nil  = Con "Nil" []
    in  termToJS var (foldr cons nil (map (Num . fromIntegral . fromEnum) txt)) dep
  Lst lst ->
    let cons = \x acc -> Con "Cons" [(Nothing, x), (Nothing, acc)]
        nil  = Con "Nil" []
    in  termToJS var (foldr cons nil lst) dep
  Nat val ->
    let succ = \x -> Con "Succ" [(Nothing, x)]
        zero = Con "Zero" []
    in  termToJS var (foldr (\_ acc -> succ acc) zero [1..val]) dep
  Hol _ _ ->
    ret var "null"
  Met _ _ ->
    ret var "null"
  Log msg nxt -> do
    msgExpr <- termToJS Nothing msg dep
    nxtExpr <- termToJS Nothing nxt dep
    ret var $ concat ["(console.log(LIST_TO_STRING(", msgExpr, ")), ", nxtExpr, ")"]
  Var nam idx ->
    ret var $ nameToJS nam ++ "$" ++ show idx
  Src _ val ->
    termToJS var val dep

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

bookToJS :: Book -> String
bookToJS book = unlines $ map (\(nm, tm) -> concat [nameToJS nm, " = ", ST.evalState (termToJS Nothing tm 0) 0, ";"]) (topoSortBook book)

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

compileJS :: Book -> String
compileJS book =
  let prelude = unlines [
        "function APPLY(f, x) {",
        "  switch (x._) {",
        "    case 0: return f;",
        "    case 1: return f(x.x0);",
        "    case 2: return f(x.x0)(x.x1);",
        "    case 3: return f(x.x0)(x.x1)(x.x2);",
        "    case 4: return f(x.x0)(x.x1)(x.x2)(x.x3);",
        "    case 5: return f(x.x0)(x.x1)(x.x2)(x.x3)(x.x4);",
        "    case 6: return f(x.x0)(x.x1)(x.x2)(x.x3)(x.x4)(x.x5);",
        "    case 7: return f(x.x0)(x.x1)(x.x2)(x.x3)(x.x4)(x.x5)(x.x6);",
        "    case 8: return f(x.x0)(x.x1)(x.x2)(x.x3)(x.x4)(x.x5)(x.x6)(x.x7);",
        "    default:",
        "      for (let i = 0; i < x._; i++) {",
        "        f = f(x['x' + i]);",
        "      }",
        "      return f;",
        "  }",
        "}",
        "function LIST_TO_STRING(list) {",
        "  try {",
        "    let result = '';",
        "    let current = list;",
        "    while (current.$ === 'Cons') {",
        "      result += String.fromCodePoint(current.x0);",
        "      current = current.x1;",
        "    }",
        "    if (current.$ === 'Nil') {",
        "      return result;",
        "    }",
        "  } catch (e) {}",
        "  return list;",
        "}"
        ]
      bookJS  = bookToJS book
  in concat [prelude, "\n\n", bookJS]


