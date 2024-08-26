module Kind.Show where

import Prelude hiding (EQ, LT, GT)

import Kind.Type
import Kind.Reduce

import qualified Data.Map.Strict as M
import qualified Data.IntMap.Strict as IM

import System.Console.ANSI

-- Stringification
-- ---------------

termShow :: Term -> Int -> String
termShow (All nam inp bod) dep =
  let nam' = nam
      inp' = termShow inp dep
      bod' = termShow (bod (Var nam dep)) (dep + 1)
  in concat ["∀(" , nam' , ": " , inp' , ") " , bod']
termShow (Lam nam bod) dep =
  let nam' = nam
      bod' = termShow (bod (Var nam dep)) (dep + 1)
  in concat ["λ" , nam' , " " , bod']
termShow (App fun arg) dep =
  let fun' = termShow fun dep
      arg' = termShow arg dep
  in concat ["(" , fun' , " " , arg' , ")"]
termShow (Ann chk val typ) dep =
  let val' = termShow val dep
      typ' = termShow typ dep
  in concat ["{" , val' , ": " , typ' , "}"]
termShow (Slf nam typ bod) dep =
  termShow typ dep
termShow (Ins val) dep =
  let val' = termShow val dep
  in concat ["~" , val']
termShow (Dat scp cts) dep =
  let scp' = unwords (map (\x -> termShow x dep) scp)
      cts' = unwords (map (\(Ctr nm fs rt) ->
        "#" ++ nm ++ "{" ++
        unwords (map (\(fn, ft) -> fn ++ ":" ++ termShow ft dep) fs) ++
        "} : " ++ termShow rt dep) cts)
  in concat ["#[", scp', "]{ ", cts', " }"]
termShow (Con nam arg) dep =
  let arg' = unwords (map (\x -> termShow x dep) arg)
  in concat ["#", nam, "{", arg', "}"]
termShow (Mat cse) dep =
  let cse' = unwords (map (\(cnm, cbod) -> "#" ++ cnm ++ ": " ++ termShow cbod dep) cse)
  in concat ["λ{ ", cse', " }"]
termShow (Ref nam) dep = nam
termShow (Let nam val bod) dep =
  let nam' = nam
      val' = termShow val dep
      bod' = termShow (bod (Var nam dep)) (dep + 1)
  in concat ["let " , nam' , " = " , val' , "; " , bod']
termShow (Use nam val bod) dep =
  let nam' = nam
      val' = termShow val dep
      bod' = termShow (bod (Var nam dep)) (dep + 1)
  in concat ["use " , nam' , " = " , val' , "; " , bod']
termShow Set dep = "*"
termShow U48 dep = "U48"
termShow (Num val) dep =
  let val' = show val
  in concat [val']
termShow (Op2 opr fst snd) dep =
  let opr' = operShow opr
      fst' = termShow fst dep
      snd' = termShow snd dep
  in concat ["(" , opr' , " " , fst' , " " , snd' , ")"]
termShow (Swi nam x z s p) dep =
  let nam' = nam
      x'   = termShow x dep
      z'   = termShow z dep
      s'   = termShow (s (Var (nam ++ "-1") dep)) (dep + 1)
      p'   = termShow (p (Var nam dep)) dep
  in concat ["switch " , nam' , " = " , x' , " { 0: " , z' , " _: " , s' , " }: " , p']
termShow (Txt txt) dep = concat ["\"" , txt , "\""]
termShow (Nat val) dep = show val
termShow (Hol nam ctx) dep = concat ["?" , nam]
termShow (Met uid spn) dep = concat ["(_", strSpn (reverse spn) dep, ")"]
termShow (Var nam idx) dep = nam
termShow (Src src val) dep = termShow val dep

strSpn :: [Term] -> Int -> String
strSpn []       dep = ""
strSpn (x : xs) dep = concat [" ", termShow x dep, strSpn xs dep]

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
contextShow book fill []     dep = ""
contextShow book fill (x:xs) dep = concat [" " , contextShowAnn book fill x dep , contextShow book fill xs dep]

contextShowAnn :: Book -> Fill -> Term -> Int -> String
contextShowAnn book fill (Ann chk val typ) dep = concat ["{" , termShow (normal book fill 0 val dep) dep , ": " , termShow (normal book fill 0 typ dep) dep , "}"]
contextShowAnn book fill term              dep = termShow (normal book fill 0 term dep) dep

infoShow :: Book -> Fill -> Info -> String
infoShow book fill (Found name typ ctx dep) =
  let typ' = termShow (normal book fill 0 typ dep) dep
      ctx' = drop 1 (contextShow book fill ctx dep)
  in concat [(colorize Yellow "Hole: "), name, " \nType: ", typ', "\nContext [", ctx', "]"]
infoShow book fill (Error src expected detected value dep) =
  let exp = termShow (normal book fill 0 expected dep) dep
      det = termShow (normal book fill 0 detected dep) dep
      val = termShow (normal book fill 0 value dep) dep
  in concat [(colorize Red "Error:\n"), "Expected: ", (colorize Green exp), "\n Found: ", (colorize Red det), "\n value: ", (colorize Yellow val), "\n path: ", locShow src ]
infoShow book fill (Solve name term dep) =
  let term' = termShow (normal book fill 0 term dep) dep
  in concat ["Solve:\n", show name, " ",  term']
infoShow book fill (Vague name) =
  concat ["Vague: ", name]
infoShow book fill (Print value dep) =
  let val = termShow (normal book fill 0 value dep) dep
  in concat [(colorize Blue "Result: "), val]

locShow :: Maybe Cod -> String
locShow Nothing = "Unknown location"
locShow (Just (Cod start end)) = showLoc start

showLoc :: Loc -> String
showLoc (Loc file line col) = file ++ " - " ++ show line ++ ":" ++ show col

colorize :: Color -> String -> String
colorize color str =
    setSGRCode [SetColor Foreground Vivid color] ++ str ++ setSGRCode [Reset]

highlightString :: String -> Color -> Int -> Int -> String
highlightString line color ini end =
    let (prefix, rest) = splitAt ini line
        (highlight, suffix) = splitAt (end - ini) rest
        coloredPart = setSGRCode [SetColor Foreground Vivid color] ++ 
                      highlight ++ 
                      setSGRCode [Reset]
    in prefix ++ coloredPart ++ suffix
