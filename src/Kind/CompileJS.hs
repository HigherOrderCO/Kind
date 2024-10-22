-- //./Type.hs//

module Kind.CompileJS where

import Kind.Reduce
import Kind.Type
import Kind.Util

import qualified Data.Map.Strict as M
import qualified Data.IntMap.Strict as IM
import Data.List (intercalate)

import Prelude hiding (EQ, LT, GT)

nameToJS :: String -> String
nameToJS x = "$" ++ map (\c -> if c == '/' || c == '.' || c == '-' || c == '#' then '$' else c) x

termToJS :: Term -> Int -> String
termToJS term dep = case term of
  All _ _ _ ->
    "null"
  Lam nam bod ->
    let nam' = nameToJS nam ++ "$" ++ show dep
        bod' = termToJS (bod (Var nam dep)) (dep + 1)
    in concat ["(", nam', " => ", bod', ")"]
  App fun arg   ->
    let fun' = termToJS fun dep
        arg' = termToJS arg dep
    in concat ["(", fun', ")(", arg', ")"]
  Ann _ val _ ->
    termToJS val dep
  Slf _ _ _ ->
    "null"
  Ins val ->
    termToJS val dep
  Dat _ _ _ ->
    "null"
  Con nam arg ->
    let arg' = map (\(f, x) -> termToJS x dep) arg
        fds' = concat (zipWith (\i x -> concat [", x", show i, ": ", x]) [0..] arg')
    in concat ["({$: \"", nam, "\", _: ", show (length arg), fds', "})"]
  Mat cse ->
    -- let cse' = map (\(cnam, cbod) -> concat ["case \"", nameToJS cnam, "\": return APPLY(", termToJS cbod dep, ", x);"]) cse
    -- in concat ["(x => { switch (x.$) { ", unwords cse', " } })"]
    -- TODO: refactor this so that a case named "_" is compiled to a "default" in JS (instead of 'case "_"'):
    let cse' = map (\(cnam, cbod) ->
                if cnam == "_"
                  then concat ["default: return (", termToJS cbod dep, ")(x);"]
                  else concat ["case \"", cnam, "\": return APPLY(", termToJS cbod dep, ", x);"]) cse
    in concat ["(x => { switch (x.$) { ", unwords cse', " } })"]
  Ref nam ->
    nameToJS nam
  Let nam val bod ->
    let nam' = nameToJS nam ++ "$" ++ show dep
        val' = termToJS val dep
        bod' = termToJS (bod (Var nam dep)) (dep + 1)
    in concat ["((", nam', " => ", bod', ")(", val', "))"]
  Use nam val bod ->
    termToJS (bod val) dep
  Set ->
    "null"
  U32 ->
    "null"
  Num val ->
    show val
  Op2 opr fst snd ->
    let opr' = operToJS opr
        fst' = termToJS fst dep
        snd' = termToJS snd dep
    in concat ["((", fst', " ", opr', " ", snd', ") >>> 0)"]
  Swi zer suc ->
    let zer' = termToJS zer dep
        suc' = termToJS suc dep
    in concat ["((x => x === 0 ? ", zer', " : ", suc', "(x - 1)))"]
  Txt txt ->
    let cons = \x acc -> Con "Cons" [(Nothing, x), (Nothing, acc)]
        nil  = Con "Nil" []
    in  termToJS (foldr cons nil (map (Num . fromIntegral . fromEnum) txt)) dep
  Lst lst ->
    let cons = \x acc -> Con "Cons" [(Nothing, x), (Nothing, acc)]
        nil  = Con "Nil" []
    in  termToJS (foldr cons nil lst) dep
  Nat val ->
    -- TODO: this must be compiled to (Con "Succ" ... and (Con "Zero"
    -- similar to the Txt/Lst cases. do it now:
    let succ = \x -> Con "Succ" [(Nothing, x)]
        zero = Con "Zero" []
    in  termToJS (foldr (\_ acc -> succ acc) zero [1..val]) dep
  Hol _ _ ->
    "null"
  Met _ _ ->
    "null"
  Log msg nxt ->
    let msg' = termToJS msg dep
        nxt' = termToJS nxt dep
    in concat ["(console.log(LIST_TO_STRING(", msg', ")), ", nxt', ")"]
  Var nam idx ->
    nameToJS nam ++ "$" ++ show idx
  Src _ val ->
    termToJS val dep

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
bookToJS book = unlines $ map (\(nm, tm) -> concat [nameToJS nm, " = ", termToJS tm 0, ";"]) (topoSortBook book)

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
