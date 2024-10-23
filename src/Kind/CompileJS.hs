-- Checker:
-- //./Check.hs//

module Kind.CompileJS where

import Kind.Equal
import Kind.Reduce
import Kind.Show
import Kind.Type
import Kind.Util

import Control.Monad (forM)
import Data.List (intercalate)
import qualified Control.Monad.State.Lazy as ST
import qualified Data.IntMap.Strict as IM
import qualified Data.Map.Strict as M

import Debug.Trace

import Prelude hiding (EQ, LT, GT)

termToJS :: Maybe String -> Term -> Maybe Term -> Int -> ST.State Int String
termToJS var term typx dep = trace ("termToJS: " ++ termShower False term dep ++ maybe "" (\t -> " :: " ++ termShower True t dep) typx) $ go var term typx dep where
  go var (All _ _ _) _ _ =
    ret var "null"
  go var tm@(Lam nam bod) _ dep = do
    let (names, body) = lams tm dep []
    bodyName <- fresh
    bodyStmt <- termToJS (Just bodyName) body Nothing (dep + length names)
    ret var $ concat ["(", intercalate " => " names, " => {", bodyStmt, "return ", bodyName, ";", "})"]
    where lams (Lam n b) dep names = lams (b (Var n dep)) (dep+1) ((nameToJS n ++ "$" ++ show dep) : names)
          lams (Src x v) dep names = lams v dep names
          lams t         dep names = (reverse names, t)
  go var (App fun arg) _ dep = do
    funExpr <- termToJS Nothing fun Nothing dep
    argExpr <- termToJS Nothing arg Nothing dep
    ret var $ concat ["(", funExpr, ")(", argExpr, ")"]
  go var (Ann _ val typ) _ dep =
    termToJS var val (Just typ) dep
  go var (Slf _ _ _) _ _ =
    ret var "null"
  go var (Ins val) typx dep =
    termToJS var val typx dep
  go var (Dat _ _ _) _ _ =
    ret var "null"
  go var (Con nam arg) _ dep = do
    argExpr <- mapM (\(f, x) -> termToJS Nothing x Nothing dep) arg
    let fields = concat (zipWith (\i x -> concat [", x", show i, ": ", x]) [0..] argExpr)
    ret var $ concat ["({$: \"", nam, "\", _: ", show (length arg), fields, "})"]
  go var (Mat cse) _ dep = do
    cseExpr <- mapM (\(cnam, cbod) -> do
      cbodExpr <- termToJS Nothing cbod Nothing dep
      return $ if cnam == "_"
        then concat ["default: return (", cbodExpr, ")(x);"]
        else concat ["case \"", cnam, "\": return APPLY(", cbodExpr, ", x);"]
      ) cse
    ret var $ concat ["(x => { switch (x.$) { ", unwords cseExpr, " } })"]
  go var (Ref nam) _ _ =
    ret var $ nameToJS nam
  go var (Let nam val bod) typx dep =
    case var of
      Just var -> do
        valExpr <- termToJS (Just (nameToJS nam ++ "$" ++ show dep)) val Nothing dep
        bodExpr <- termToJS (Just var) (bod (Var nam dep)) Nothing (dep + 1)
        return $ concat [valExpr, bodExpr]
      Nothing -> do
        valExpr <- termToJS (Just (nameToJS nam ++ "$" ++ show dep)) val Nothing dep
        bodExpr <- termToJS Nothing (bod (Var nam dep)) Nothing (dep + 1)
        return $ concat ["(() => {", valExpr, "return ", bodExpr, ";})()"]
  go var (Use nam val bod) typx dep =
    termToJS var (bod val) typx dep
  go var Set _ _ =
    ret var "null"
  go var U32 _ _ =
    ret var "null"
  go var (Num val) _ _ =
    ret var $ show val
  go var (Op2 opr fst snd) _ dep = do
    let opr' = operToJS opr
    fstExpr <- termToJS Nothing fst Nothing dep
    sndExpr <- termToJS Nothing snd Nothing dep
    ret var $ concat ["((", fstExpr, " ", opr', " ", sndExpr, ") >>> 0)"]
  go var (Swi zer suc) _ dep = do
    zerExpr <- termToJS Nothing zer Nothing dep
    sucExpr <- termToJS Nothing suc Nothing dep
    ret var $ concat ["((x => x === 0 ? ", zerExpr, " : ", sucExpr, "(x - 1)))"]
  go var (Txt txt) typx dep =
    let cons = \x acc -> Con "Cons" [(Nothing, x), (Nothing, acc)]
        nil  = Con "Nil" []
    in  termToJS var (foldr cons nil (map (Num . fromIntegral . fromEnum) txt)) typx dep
  go var (Lst lst) typx dep =
    let cons = \x acc -> Con "Cons" [(Nothing, x), (Nothing, acc)]
        nil  = Con "Nil" []
    in  termToJS var (foldr cons nil lst) typx dep
  go var (Nat val) typx dep =
    let succ = \x -> Con "Succ" [(Nothing, x)]
        zero = Con "Zero" []
    in  termToJS var (foldr (\_ acc -> succ acc) zero [1..val]) typx dep
  go var (Hol _ _) _ _ =
    ret var "null"
  go var (Met _ _) _ _ =
    ret var "null"
  go var (Log msg nxt) _ dep = do
    msgExpr <- termToJS Nothing msg Nothing dep
    nxtExpr <- termToJS Nothing nxt Nothing dep
    ret var $ concat ["(console.log(LIST_TO_STRING(", msgExpr, ")), ", nxtExpr, ")"]
  go var (Var nam idx) _ _ =
    ret var $ nameToJS nam ++ "$" ++ show idx
  go var (Src _ val) typx dep =
    termToJS var val typx dep



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
bookToJS book = unlines $ map (\(nm, tm) -> concat [nameToJS nm, " = ", ST.evalState (termToJS Nothing tm Nothing 0) 0, ";"]) (topoSortBook book)

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


