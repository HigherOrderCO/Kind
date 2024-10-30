-- //./Type.hs//

module Kind.Show where

import Prelude hiding (EQ, LT, GT)

import Kind.Type

import Debug.Trace
import Data.Word

import Control.Applicative ((<|>))

import qualified Data.Map.Strict as M
import qualified Data.IntMap.Strict as IM

-- Stringification
-- ---------------

showTermGo :: Bool -> Term -> Int -> String
showTermGo small term dep =
  case pretty term of
    Just str -> str
    Nothing  -> case term of
      All nam inp bod ->
        let nam' = nam
            inp' = showTermGo small inp dep
            bod' = showTermGo small (bod (Var nam dep)) (dep + 1)
        in concat ["∀(" , nam' , ": " , inp' , ") " , bod']
      Lam nam bod ->
        let nam' = nam
            bod' = showTermGo small (bod (Var nam dep)) (dep + 1)
        in concat ["λ" , nam' , " " , bod']
      App fun arg ->
        let (func, args) = unwrap fun [arg]
            func' = showTermGo small func dep
            args' = unwords (map (\x -> showTermGo small x dep) args)
        in concat ["(" , func' , " " , args' , ")"]
        where unwrap :: Term -> [Term] -> (Term, [Term])
              unwrap (App fun arg) args = unwrap fun (arg:args)
              unwrap term          args = (term, args)
      Ann chk val typ ->
        if small
          then showTermGo small val dep
          else let val' = showTermGo small val dep
                   typ' = showTermGo small typ dep
              in concat ["{" , val' , ": " , typ' , "}"]
      Slf nam typ bod ->
        let nam' = nam
            typ' = showTermGo small typ dep
            bod' = showTermGo small (bod (Var nam dep)) (dep + 1)
        in concat ["$(" , nam' , ": " , typ' , ") " , bod']
      Ins val ->
        let val' = showTermGo small val dep
        in concat ["~" , val']
      -- CHANGED: Updated ADT case to use new Ctr structure
      ADT scp cts typ ->
        let scp' = unwords (map (\x -> showTermGo small x dep) scp)
            cts' = unwords (map (\(Ctr nm tele) -> "#" ++ nm ++ " " ++ showTeleGo small tele dep) cts)
            typ' = showTermGo small typ dep
        in concat ["#[", scp', "]{ ", cts', " } : ", typ']
      Con nam arg ->
        let arg' = unwords (map showArg arg)
        in concat ["#", nam, "{", arg', "}"]
        where
          showArg (maybeField, term) = case maybeField of
            Just field -> field ++ ": " ++ showTermGo small term dep
            Nothing -> showTermGo small term dep
      Mat cse ->
        let cse' = unwords (map (\(cnm, cbod) -> "#" ++ cnm ++ ": " ++ showTermGo small cbod dep) cse)
        in concat ["λ{ ", cse', " }"]
      -- Ref nam -> concat ["@", nam]
      Ref nam -> concat [nam]
      Let nam val bod ->
        let nam' = nam
            val' = showTermGo small val dep
            bod' = showTermGo small (bod (Var nam dep)) (dep + 1)
        in concat ["let " , nam' , " = " , val' , " " , bod']
      Use nam val bod ->
        let nam' = nam
            val' = showTermGo small val dep
            bod' = showTermGo small (bod (Var nam dep)) (dep + 1)
        in concat ["use " , nam' , " = " , val' , " " , bod']
      Set -> "*"
      U64 -> "U64"
      F64 -> "F64"
      Num val ->
        let val' = show val
        in concat [val']
      Flt val ->
        let val' = show val
        in concat [val']
      Op2 opr fst snd ->
        let opr' = showOper opr
            fst' = showTermGo small fst dep
            snd' = showTermGo small snd dep
        in concat ["(" , opr' , " " , fst' , " " , snd' , ")"]
      Swi zero succ ->
        let zero' = showTermGo small zero dep
            succ' = showTermGo small succ dep
        in concat ["λ{ 0: ", zero', " _: ", succ', " }"]
      Txt txt -> concat ["\"" , txt , "\""]
      Lst lst -> concat ["[", unwords (map (\x -> showTermGo small x dep) lst), "]"]
      Nat val -> concat ["#", (show val)]
      Hol nam ctx -> concat ["?" , nam]
      -- Met uid spn -> concat ["_", show uid, "[", strSpn spn dep, " ]"]
      Met uid spn -> concat ["_", show uid]
      Log msg nxt -> 
        let msg' = showTermGo small msg dep
            nxt' = showTermGo small nxt dep
        in concat ["log ", msg', " ", nxt']
      Var nam idx -> nam
      Src src val -> if small
        then showTermGo small val dep
        else concat ["!", showTermGo small val dep]

-- CHANGED: Added showTeleGo function
showTeleGo :: Bool -> Tele -> Int -> String
showTeleGo small tele dep = "{ " ++ go tele dep where
  go (TExt nam typ bod) dep =
    let typ' = showTermGo small typ dep
        bod' = go (bod (Var nam dep)) (dep + 1)
    in concat [nam, ": ", typ', " ", bod']
  go (TRet term) dep =
    let term' = showTermGo small term dep
    in concat ["}: ", term']

showTele :: Tele -> String
showTele tele = showTeleGo True tele 0

showTerm :: Term -> String
showTerm term = showTermGo True term 0

strSpn :: [Term] -> Int -> String
strSpn []       dep = ""
strSpn (x : xs) dep = concat [" ", showTermGo True x dep, strSpn xs dep]

showOper :: Oper -> String
showOper ADD = "+"
showOper SUB = "-"
showOper MUL = "*"
showOper DIV = "/"
showOper MOD = "%"
showOper EQ  = "=="
showOper NE  = "!="
showOper LT  = "<"
showOper GT  = ">"
showOper LTE = "<="
showOper GTE = ">="
showOper AND = "&"
showOper OR  = "|"
showOper XOR = "^"
showOper LSH = "<<"
showOper RSH = ">>"

-- Pretty Printing (Sugars)
-- ------------------------

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
  return $ "[" ++ unwords (map (\x -> showTermGo True x 0) terms) ++ "]"
  where asList (Con "Nil" []) = do
          Just []
        asList (Con "Cons" [(_, head), (_, tail)]) = do
          rest <- asList tail
          return (head : rest)
        asList _ = Nothing

prettyEqual :: Term -> Maybe String
prettyEqual (App (App (App (Ref "Equal") t) a) b) = do
  let a' = showTermGo True a 0
      b' = showTermGo True b 0
  return $ a' ++ " == " ++ b'
prettyEqual _ = Nothing
