module Kind.Compile where

import Kind.Type
import Kind.Reduce

import qualified Data.Map.Strict as M
import qualified Data.IntMap.Strict as IM
import Data.List (intercalate)


import Prelude hiding (EQ, LT, GT)

nameToJS :: String -> String
nameToJS = map (\c -> if c == '/' || c == '.' then '$' else c)

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
  Dat _ _ ->
    "null"
  Con nam arg ->
    let arg' = map (\(f, x) -> termToJS x dep) arg
        fds' = concat (zipWith (\i x -> concat [", x", show i, ": ", x]) [0..] arg')
    in concat ["{$: \"", nameToJS nam, "\", length: ", show (length arg), fds', "}"]
  Mat cse ->
    let cse' = map (\(cnam, cbod) -> concat ["case \"", nameToJS cnam, "\": return APPLY(", termToJS cbod dep, ", x);"]) cse
    in concat ["(x => ({ switch (x.$) { ", unwords cse', " } }))"]
  Ref nam ->
    nameToJS nam
  Let nam val bod ->
    let nam' = nameToJS nam ++ "$" ++ show dep
        val' = termToJS val dep
        bod' = termToJS (bod (Var nam dep)) (dep + 1)
    in concat ["((", nam', " => ", bod', ")(", val', "))"]
  Use nam val bod ->
    let val' = termToJS val dep
        bod' = termToJS (bod val) dep
    in concat ["((", val', ") => ", bod', ")"]
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
    show txt
  Lst lst ->
    "[" ++ intercalate " " (map (\x -> termToJS x dep) lst) ++ "]"
  Nat val ->
    show val
  Hol _ _ ->
    "null"
  Met _ _ ->
    "null"
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
bookToJS book = unlines $ map (\(nm, tm) -> concat [nameToJS nm, " = ", termToJS tm 0, ";"]) (M.toList book)

compileJS :: Book -> String
compileJS book =
  let prelude = unlines [
        "function APPLY(f, x) {",
        "  switch (x.length) {",
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
        "      for (let i = 0; i < x.length; i++) {",
        "        f = f(x['x' + i]);",
        "      }",
        "      return f;",
        "  }",
        "}"]
      bookJS  = bookToJS book
  in concat [prelude, "\n\n", bookJS]
