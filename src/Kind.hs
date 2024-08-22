module Kind where

-- Kind2
-- =====

import Control.Monad (forM_)
import Data.Char (chr, ord)
import Debug.Trace
import Prelude hiding (LT, GT, EQ)
import System.Environment (getArgs)
import System.Exit (exitFailure)
import Text.Parsec ((<|>))
import qualified Data.IntMap.Strict as IM
import qualified Data.Map.Strict as M
import qualified Text.Parsec as P
import Control.Monad (zipWithM)

-- Kind2 Types
-- -----------

-- Kind Core's AST
data Term

  -- Product: `∀(x: A) B`
  = All String Term (Term -> Term) 

  -- Lambda: `λx f`
  | Lam String (Term -> Term)

  -- Application: `(fun arg)`
  | App Term Term

  -- Annotation: `{x: T}`
  | Ann Bool Term Term

  -- Self-Type: `$(x: A) B`
  | Slf String Term (Term -> Term)

  -- Self-Inst: `~x`
  | Ins Term

  -- Datatype: `"#[i0 i1...]{ #C0 { x0:T0 x1:T1 ... } #C1 { x0:T0 x1:T1 ... } }
  | Dat [Term] [Ctr]

  -- Constructor: `#CN { x0 x1 ... }`
  | Con String [Term]

  -- Match: `λ{ #C0:B0 #C1:B1 ... }`
  | Mat [(String, Term)]

  -- Top-Level Reference
  | Ref String

  -- Local let-definition
  | Let String Term (Term -> Term)

  -- Local use-definition
  | Use String Term (Term -> Term)

  -- Type : Type
  | Set

  -- U48 Type
  | U48

  -- U48 Value
  | Num Int

  -- U48 Binary Operation
  | Op2 Oper Term Term

  -- U48 Elimination
  | Swi String Term Term (Term -> Term) (Term -> Term)

  -- Inspection Hole
  | Hol String [Term]

  -- Unification Metavar
  | Met Int [Term]

  -- Variable
  | Var String Int

  -- Source Location
  | Src Int Term

  -- Text Literal (sugar)
  | Txt String

  -- Nat Literal (sugar)
  | Nat Integer

-- Numeric Operators
data Oper
  = ADD | SUB | MUL | DIV
  | MOD | EQ  | NE  | LT
  | GT  | LTE | GTE | AND
  | OR  | XOR | LSH | RSH

-- Ctrs
data Ctr = Ctr String [(String,Term)] Term

-- Book of Definitions
type Book = M.Map String Term

-- Type-Checker Outputs
data Info
  = Found String Term [Term] Int
  | Solve Int Term Int
  | Error Int Term Term Term Int
  | Vague String
  | Print Term Int

-- Unification Solutions
type Fill = IM.IntMap Term

-- Checker State
data Check = Check Int Term Term Int -- postponed check
data State = State Book Fill [Check] [Info] -- state type
data Res a = Done State a | Fail State -- result type
data Env a = Env (State -> Res a) -- monadic checker

-- Environment
-- -----------

infoIsSolve :: Info -> Bool
infoIsSolve (Solve _ _ _) = True
infoIsSolve _             = False

envBind :: Env a -> (a -> Env b) -> Env b
envBind (Env a) b = Env $ \state -> case a state of
  Done state' value -> let Env b' = b value in b' state'
  Fail state'       -> Fail state'

envPure :: a -> Env a
envPure a = Env $ \state -> Done state a

envFail :: Env a
envFail = Env $ \state -> Fail state

envRun :: Env a -> Book -> Res a
envRun (Env chk) book = chk (State book IM.empty [] [])

envLog :: Info -> Env Int
envLog log = Env $ \ (State book fill susp logs) -> Done (State book fill susp (log : logs)) 1

envSnapshot :: Env State
envSnapshot = Env $ \state -> Done state state

envRewind :: State -> Env Int
envRewind state = Env $ \_ -> Done state 0

envSusp :: Check -> Env ()
envSusp chk = Env $ \ (State book fill susp logs) -> Done (State book fill (susp ++ [chk]) logs) ()

envFill :: Int -> Term -> Env ()
envFill k v = Env $ \ (State book fill susp logs) -> Done (State book (IM.insert k v fill) susp logs) ()

envGetFill :: Env Fill
envGetFill = Env $ \ (State book fill susp logs) -> Done (State book fill susp logs) fill

envGetBook :: Env Book
envGetBook = Env $ \ (State book fill susp logs) -> Done (State book fill susp logs) book

envTakeSusp :: Env [Check]
envTakeSusp = Env $ \ (State book fill susp logs) -> Done (State book fill [] logs) susp

instance Functor Env where
  fmap f (Env chk) = Env $ \logs -> case chk logs of
    Done logs' a -> Done logs' (f a)
    Fail logs' -> Fail logs'

instance Applicative Env where
  pure = envPure
  (Env chkF) <*> (Env chkA) = Env $ \logs -> case chkF logs of
    Done logs' f -> case chkA logs' of
      Done logs'' a -> Done logs'' (f a)
      Fail logs'' -> Fail logs''
    Fail logs' -> Fail logs'

instance Monad Env where
  (Env a) >>= b = envBind (Env a) b

-- Binding
-- -------

bind :: Term -> [(String,Term)] -> Term
bind (All nam inp bod) ctx = All nam (bind inp ctx) (\x -> bind (bod (Var nam 0)) ((nam, x) : ctx))
bind (Lam nam bod)     ctx = Lam nam (\x -> bind (bod (Var nam 0)) ((nam, x) : ctx))
bind (App fun arg)     ctx = App (bind fun ctx) (bind arg ctx)
bind (Ann chk val typ) ctx = Ann chk (bind val ctx) (bind typ ctx)
bind (Slf nam typ bod) ctx = Slf nam (bind typ ctx) (\x -> bind (bod (Var nam 0)) ((nam, x) : ctx))
bind (Ins val)         ctx = Ins (bind val ctx)
bind (Dat scp cts)     ctx = Dat (map (\x -> bind x ctx) scp) (map (\ (Ctr nm fs rt) -> (Ctr nm (map (\ (nm,ty) -> (nm, bind ty ctx)) fs) (bind rt ctx))) cts)
bind (Con nam arg)     ctx = Con nam (map (\x -> bind x ctx) arg)
bind (Mat cse)         ctx = Mat (map (\ (cnam, cbod) -> (cnam, bind cbod ctx)) cse)
bind (Ref nam)         ctx = case lookup nam ctx of { Just x -> x; Nothing -> Ref nam }
bind (Let nam val bod) ctx = Let nam (bind val ctx) (\x -> bind (bod (Var nam 0)) ((nam, x) : ctx))
bind (Use nam val bod) ctx = Use nam (bind val ctx) (\x -> bind (bod (Var nam 0)) ((nam, x) : ctx))
bind Set               ctx = Set
bind U48               ctx = U48
bind (Num val)         ctx = Num val
bind (Op2 opr fst snd) ctx = Op2 opr (bind fst ctx) (bind snd ctx)
bind (Swi nam x z s p) ctx = Swi nam (bind x ctx) (bind z ctx) (\k -> bind (s (Var (nam ++ "-1") 0)) ((nam ++ "-1", k) : ctx)) (\k -> bind (p (Var nam 0)) ((nam, k) : ctx))
bind (Txt txt)         ctx = Txt txt
bind (Nat val)         ctx = Nat val
bind (Hol nam ctxs)    ctx = Hol nam (map (\t -> bind t ctx) ctxs)
bind (Met uid spn)     ctx = Met uid (map (\t -> bind t ctx) spn)
bind (Var nam idx)     ctx = Var nam idx
bind (Src src val)     ctx = Src src (bind val ctx)

-- Evaluation
-- ----------

-- Evaluation levels:
-- - 0: reduces refs: never
-- - 1: reduces refs: redexes
-- - 2: reduces refs: always

reduce :: Book -> Fill -> Int -> Term -> Term
reduce book fill lv (App fun arg)     = reduceApp book fill lv (reduce book fill lv fun) arg
reduce book fill lv (Ann chk val typ) = reduce book fill lv val
reduce book fill lv (Ins val)         = reduce book fill lv val
reduce book fill lv (Ref nam)         = reduceRef book fill lv nam
reduce book fill lv (Let nam val bod) = reduce book fill lv (bod val)
reduce book fill lv (Use nam val bod) = reduce book fill lv (bod val)
reduce book fill lv (Op2 opr fst snd) = reduceOp2 book fill lv opr (reduce book fill lv fst) (reduce book fill lv snd)
reduce book fill lv (Swi nam x z s p) = reduceSwi book fill lv nam (reduce book fill lv x) z s p
reduce book fill lv (Txt txt)         = reduceTxt book fill lv txt
reduce book fill lv (Nat val)         = reduceNat book fill lv val
reduce book fill lv (Src src val)     = reduce book fill lv val
reduce book fill lv (Met uid spn)     = reduceMet book fill lv uid spn
reduce book fill lv val               = val

reduceApp :: Book -> Fill -> Int -> Term -> Term -> Term
reduceApp book fill 2  (Ref nam)     arg = reduceApp book fill 2 (reduceRef book fill 2 nam) arg
reduceApp book fill 1  (Ref nam)     arg = reduceApp book fill 1 (reduceRef book fill 1 nam) arg
reduceApp book fill lv (Met uid spn) arg = reduce book fill lv (Met uid (spn ++ [arg]))
reduceApp book fill lv (Lam nam bod) arg = reduce book fill lv (bod (reduce book fill 0 arg))
reduceApp book fill lv (Mat cse)     arg = reduceMat book fill lv cse (reduce book fill lv arg)
reduceApp book fill lv fun arg           = App fun arg

reduceMat :: Book -> Fill -> Int -> [(String, Term)] -> Term -> Term
reduceMat book fill lv cse (Con cnam carg) =
  case lookup cnam cse of
    Just cx -> reduce book fill lv (foldl App cx carg)
    Nothing -> error $ "Constructor " ++ cnam ++ " not found in pattern match."
reduceMat book fill lv cse arg =
  Mat cse

reduceMet :: Book -> Fill -> Int -> Int -> [Term] -> Term
reduceMet book fill lv uid spn = case IM.lookup uid fill of
  Just val -> reduce book fill lv (reduceMetSpine val spn)
  Nothing  -> Met uid spn

reduceMetSpine :: Term -> [Term] -> Term
reduceMetSpine val []       = val
reduceMetSpine val (x : xs) = reduceMetSpine (App val x) xs

reduceOp2 :: Book -> Fill -> Int -> Oper -> Term -> Term -> Term
reduceOp2 book fill 1  op  (Ref nam) (Num snd) = reduceOp2 book fill 1 op (reduceRef book fill 1 nam) (Num snd)
reduceOp2 book fill 2  op  (Ref nam) (Num snd) = reduceOp2 book fill 2 op (reduceRef book fill 2 nam) (Num snd)
reduceOp2 book fill 1  op  (Num fst) (Ref nam) = reduceOp2 book fill 1 op (Num fst) (reduceRef book fill 1 nam)
reduceOp2 book fill 2  op  (Num fst) (Ref nam) = reduceOp2 book fill 2 op (Num fst) (reduceRef book fill 2 nam)
reduceOp2 book fill lv ADD (Num fst) (Num snd) = Num (fst + snd)
reduceOp2 book fill lv SUB (Num fst) (Num snd) = Num (fst - snd)
reduceOp2 book fill lv MUL (Num fst) (Num snd) = Num (fst * snd)
reduceOp2 book fill lv DIV (Num fst) (Num snd) = Num (div fst snd)
reduceOp2 book fill lv MOD (Num fst) (Num snd) = Num (mod fst snd)
reduceOp2 book fill lv EQ  (Num fst) (Num snd) = if fst == snd then Num 1 else Num 0
reduceOp2 book fill lv NE  (Num fst) (Num snd) = if fst /= snd then Num 1 else Num 0
reduceOp2 book fill lv LT  (Num fst) (Num snd) = if fst < snd then Num 1 else Num 0
reduceOp2 book fill lv GT  (Num fst) (Num snd) = if fst > snd then Num 1 else Num 0
reduceOp2 book fill lv LTE (Num fst) (Num snd) = if fst <= snd then Num 1 else Num 0
reduceOp2 book fill lv GTE (Num fst) (Num snd) = if fst >= snd then Num 1 else Num 0
reduceOp2 book fill lv opr fst snd             = Op2 opr fst snd

reduceSwi :: Book -> Fill -> Int -> String -> Term -> Term -> (Term -> Term) -> (Term -> Term) -> Term
reduceSwi book fill 2  nam (Ref x)             z s p = reduceSwi book fill 2 nam (reduceRef book fill 2 x) z s p
reduceSwi book fill 1  nam (Ref x)             z s p = reduceSwi book fill 1 nam (reduceRef book fill 1 x) z s p
reduceSwi book fill lv nam (Num 0)             z s p = reduce book fill lv z
reduceSwi book fill lv nam (Num n)             z s p = reduce book fill lv (s (Num (n - 1)))
reduceSwi book fill lv nam (Op2 ADD (Num 1) k) z s p = reduce book fill lv (s k)
reduceSwi book fill lv nam val                 z s p = Swi nam val z s p

reduceRef :: Book -> Fill -> Int -> String -> Term
reduceRef book fill 2  nam = case M.lookup nam book of
  Just val -> reduce book fill 2 val
  Nothing  -> error $ "Undefined reference: " ++ nam
reduceRef book fill 1  nam = Ref nam
reduceRef book fill lv nam = Ref nam

reduceTxt :: Book -> Fill -> Int -> String -> Term
reduceTxt book fill lv []     = reduce book fill lv (Ref "String/cons")
reduceTxt book fill lv (x:xs) = reduce book fill lv (App (App (Ref "String/nil") (Num (ord x))) (Txt xs))

reduceNat :: Book -> Fill -> Int -> Integer -> Term
reduceNat book fill lv 0 = Ref "Nat/zero"
reduceNat book fill lv n = App (Ref "Nat/succ") (reduceNat book fill lv (n - 1))

-- Normalization
-- -------------

normal :: Book -> Fill -> Int -> Term -> Int -> Term
normal book fill lv term dep = go book fill lv (reduce book fill lv term) dep where
  go book fill lv (All nam inp bod) dep = All nam (normal book fill lv inp dep) (\x -> normal book fill lv (bod (Var nam dep)) (dep + 1))
  go book fill lv (Lam nam bod)     dep = Lam nam (\x -> normal book fill lv (bod (Var nam dep)) (dep + 1))
  go book fill lv (App fun arg)     dep = App (normal book fill lv fun dep) (normal book fill lv arg dep)
  go book fill lv (Ann chk val typ) dep = Ann chk (normal book fill lv val dep) (normal book fill lv typ dep)
  go book fill lv (Slf nam typ bod) dep = Slf nam typ (\x -> normal book fill lv (bod (Var nam dep)) (dep + 1))
  go book fill lv (Ins val)         dep = Ins (normal book fill lv val dep) 
  go book fill lv (Dat scp cts)     dep = Dat (map (\x -> normal book fill lv x dep) scp) (map (\ (Ctr nm fs rt) -> Ctr nm (map (\ (fn, ft) -> (fn, normal book fill lv ft dep)) fs) (normal book fill lv rt dep)) cts)
  go book fill lv (Con nam arg)     dep = Con nam (map (\arg -> normal book fill lv arg dep) arg)
  go book fill lv (Mat cse)         dep = Mat (map (\ (cnam, cbod) -> (cnam, normal book fill lv cbod dep)) cse)
  go book fill lv (Ref nam)         dep = Ref nam
  go book fill lv (Let nam val bod) dep = Let nam (normal book fill lv val dep) (\x -> normal book fill lv (bod (Var nam dep)) (dep + 1))
  go book fill lv (Use nam val bod) dep = Use nam (normal book fill lv val dep) (\x -> normal book fill lv (bod (Var nam dep)) (dep + 1))
  go book fill lv (Hol nam ctx)     dep = Hol nam ctx
  go book fill lv Set               dep = Set
  go book fill lv U48               dep = U48
  go book fill lv (Num val)         dep = Num val
  go book fill lv (Op2 opr fst snd) dep = Op2 opr (normal book fill lv fst dep) (normal book fill lv snd dep)
  go book fill lv (Swi nam x z s p) dep = Swi nam (normal book fill lv x dep) (normal book fill lv z dep) (\k -> normal book fill lv (s (Var (nam ++ "-1") dep)) dep) (\k -> normal book fill lv (p (Var nam dep)) dep)
  go book fill lv (Txt val)         dep = Txt val
  go book fill lv (Nat val)         dep = Nat val
  go book fill lv (Var nam idx)     dep = Var nam idx
  go book fill lv (Src src val)     dep = Src src (normal book fill lv val dep)
  go book fill lv (Met uid spn)     dep = Met uid spn -- TODO: normalize spine

-- Equality
-- --------

-- Conversion checking works as follows:
-- 1. Two terms are equal if their wnf's are structurally identical
-- 2. Otherwise, they're equal if they're similar (component-wise equal)
-- This allows us to always identify two terms that have the same normal form,
-- while also allowing us to return earlier, if they become identical at any
-- point in the reduction. Note that, for Self types, the similarity checker
-- will "un-reduce" from `$(x: (T a b)) body` to `(T a b)`, avoiding loops.

equal :: Term -> Term -> Int -> Env Bool
equal a b dep = do
  -- trace ("== " ++ termShow a dep ++ "\n.. " ++ termShow b dep) $ do
  book <- envGetBook
  fill <- envGetFill
  let a' = reduce book fill 2 a
  let b' = reduce book fill 2 b
  same <- tryIdentical a' b' dep
  if same then do
    return True
  else do
    similar a' b' dep

tryIdentical :: Term -> Term -> Int -> Env Bool
tryIdentical a b dep = do
  state <- envSnapshot
  equal <- identical a b dep
  if equal
    then envPure True
    else envRewind state >> envPure False

similar :: Term -> Term -> Int -> Env Bool
similar a b dep =
  -- trace ("~~ " ++ termShow a dep ++ "\n.. " ++ termShow b dep) $ do
  go a b dep
  where
  go (All aNam aInp aBod) (All bNam bInp bBod) dep = do
    eInp <- equal aInp bInp dep
    eBod <- equal (aBod (Var aNam dep)) (bBod (Var bNam dep)) (dep + 1)
    envPure (eInp && eBod)
  go (Lam aNam aBod) (Lam bNam bBod) dep =
    equal (aBod (Var aNam dep)) (bBod (Var bNam dep)) (dep + 1)
  go (App aFun aArg) (App bFun bArg) dep = do
    eFun <- similar aFun bFun dep
    eArg <- equal aArg bArg dep
    envPure (eFun && eArg)
  go (Slf aNam aTyp aBod) (Slf bNam bTyp bBod) dep = do
    book <- envGetBook
    similar (reduce book IM.empty 0 aTyp) (reduce book IM.empty 0 bTyp) dep
  go (Dat aScp aCts) (Dat bScp bCts) dep = do
    eSlf <- zipWithM (\ ax bx -> equal ax bx dep) aScp bScp
    if (and eSlf) && length aCts == length bCts then do
      results <- zipWithM
        (\ (Ctr aCNm aFs aRt) (Ctr bCNm bFs bRt) ->
          if aCNm == bCNm && length aFs == length bFs then do
            fs <- zipWithM
              (\ (aFNm, aFTyp) (bFNm, bFTyp) ->
                if aFNm == bFNm then
                  equal aFTyp bFTyp dep
                else
                  envPure False)
              aFs bFs
            rt <- equal aRt bRt dep
            envPure (and fs && rt)
          else
            envPure False)
        aCts bCts
      envPure (and results)
    else
      envPure False
  go (Con aNam aArg) (Con bNam bArg) dep = do
    if aNam == bNam && length aArg == length bArg then do
      results <- zipWithM (\aArg bArg -> equal aArg bArg dep) aArg bArg
      envPure (and results)
    else
      envPure False
  go (Mat aCse) (Mat bCse) dep = do
    if length aCse == length bCse then do
      results <- zipWithM
        (\ (aCNam, aCBod) (bCNam, bCBod) ->
          if aCNam == bCNam then
            equal aCBod bCBod dep
          else
            envPure False)
        aCse bCse
      envPure (and results)
    else
      envPure False
  go (Op2 aOpr aFst aSnd) (Op2 bOpr bFst bSnd) dep = do
    eFst <- equal aFst bFst dep
    eSnd <- equal aSnd bSnd dep
    envPure (eFst && eSnd)
  go (Swi aNam aX aZ aS aP) (Swi bNam bX bZ bS bP) dep = do
    eX <- equal aX bX dep
    eZ <- equal aZ bZ dep
    eS <- equal (aS (Var (aNam ++ "-1") dep)) (bS (Var (bNam ++ "-1") dep)) dep
    eP <- equal (aP (Var aNam dep)) (bP (Var bNam dep)) dep
    envPure (eX && eZ && eS && eP)
  go a b dep = identical a b dep

identical :: Term -> Term -> Int -> Env Bool
identical a b dep = go a b dep where
  go (All aNam aInp aBod) (All bNam bInp bBod) dep = do
    iInp <- identical aInp bInp dep
    iBod <- identical (aBod (Var aNam dep)) (bBod (Var bNam dep)) (dep + 1)
    return (iInp && iBod)
  go (Lam aNam aBod) (Lam bNam bBod) dep =
    identical (aBod (Var aNam dep)) (bBod (Var bNam dep)) (dep + 1)
  go (App aFun aArg) (App bFun bArg) dep = do
    iFun <- identical aFun bFun dep
    iArg <- identical aArg bArg dep
    return (iFun && iArg)
  go (Slf aNam aTyp aBod) (Slf bNam bTyp bBod) dep =
    identical aTyp bTyp dep
  go (Ins aVal) b dep =
    identical aVal b dep
  go a (Ins bVal) dep =
    identical a bVal dep
  go (Dat aScp aCts) (Dat bScp bCts) dep = do
    iSlf <- zipWithM (\ ax bx -> equal ax bx dep) aScp bScp
    if (and iSlf) && length aCts == length bCts then do
      results <- zipWithM
        (\ (Ctr aCNm aFs aRt) (Ctr bCNm bFs bRt) ->
          if aCNm == bCNm && length aFs == length bFs then do
            fs <- zipWithM (\ (aFNm, aFTy) (bFNm, bFTy) -> identical aFTy bFTy dep) aFs bFs
            rt <- identical aRt bRt dep
            envPure (and fs && rt)
          else
            envPure False)
        aCts bCts
      envPure (and results)
    else
      envPure False
  go (Con aNam aArg) (Con bNam bArg) dep = do
    if aNam == bNam && length aArg == length bArg then do
      results <- zipWithM (\aArg bArg -> identical aArg bArg dep) aArg bArg
      envPure (and results)
    else
      envPure False
  go (Mat aCse) (Mat bCse) dep = do
    if length aCse == length bCse then do
      results <- zipWithM
        (\ (aCNam, aCBod) (bCNam, bCBod) ->
          if aCNam == bCNam then
            identical aCBod bCBod dep
          else
            envPure False)
        aCse bCse
      envPure (and results)
    else
      envPure False
  go (Let aNam aVal aBod) b dep =
    identical (aBod aVal) b dep
  go a (Let bNam bVal bBod) dep =
    identical a (bBod bVal) dep
  go (Use aNam aVal aBod) b dep =
    identical (aBod aVal) b dep
  go a (Use bNam bVal bBod) dep =
    identical a (bBod bVal) dep
  go Set Set dep =
    return True
  go (Ann chk aVal aTyp) b dep =
    identical aVal b dep
  go a (Ann chk bVal bTyp) dep =
    identical a bVal dep
  go a (Met bUid bSpn) dep =
    unify bUid bSpn a dep
  go (Met aUid aSpn) b dep =
    unify aUid aSpn b dep
  go (Hol aNam aCtx) b dep =
    return True
  go a (Hol bNam bCtx) dep =
    return True
  go U48 U48 dep =
    return True
  go (Num aVal) (Num bVal) dep =
    return (aVal == bVal)
  go (Op2 aOpr aFst aSnd) (Op2 bOpr bFst bSnd) dep = do
    iFst <- identical aFst bFst dep
    iSnd <- identical aSnd bSnd dep
    return (iFst && iSnd)
  go (Swi aNam aX aZ aS aP) (Swi bNam bX bZ bS bP) dep = do
    iX <- identical aX bX dep
    iZ <- identical aZ bZ dep
    iS <- identical (aS (Var (aNam ++ "-1") dep)) (bS (Var (bNam ++ "-1") dep)) dep
    iP <- identical (aP (Var aNam dep)) (bP (Var bNam dep)) dep
    return (iX && iZ && iS && iP)
  go (Txt aTxt) (Txt bTxt) dep =
    return (aTxt == bTxt)
  go (Nat aVal) (Nat bVal) dep =
    return (aVal == bVal)
  go (Src aSrc aVal) b dep =
    identical aVal b dep
  go a (Src bSrc bVal) dep =
    identical a bVal dep
  go (Ref aNam) (Ref bNam) dep =
    return (aNam == bNam)
  go (Var aNam aIdx) (Var bNam bIdx) dep =
    return (aIdx == bIdx)
  go a b dep =
    return False

-- Unification
-- -----------

-- The unification algorithm is a simple pattern unifier, based on smalltt:
-- > https://github.com/AndrasKovacs/elaboration-zoo/blob/master/03-holes/Main.hs
-- The pattern unification problem provides a solution to the following problem:
--   (?X x y z ...) = K
-- When:
--   1. The LHS spine, `x y z ...`, consists of distinct variables.
--   2. Every free var of the RHS, `K`, occurs in the spine.
--   3. The LHS hole, `?A`, doesn't occur in the RHS, `K`.
-- If these conditions are met, ?X is solved as:
--   ?X = λx λy λz ... K
-- In this implementation, checking condition `2` is not necessary, because we
-- subst holes directly where they occur (rather than on top-level definitions),
-- so, it is impossible for unbound variables to appear. This approach may not
-- be completely correct, and is pending review.

-- If possible, solves a `(?X x y z ...) = K` problem, generating a subst.
unify :: Int -> [Term] -> Term -> Int -> Env Bool
unify uid spn b dep = do
  book <- envGetBook
  fill <- envGetFill
  let unsolved = not (IM.member uid fill) -- is this hole not already solved?
  let solvable = valid fill spn [] -- does the spine satisfies conditions?
  let no_loops = not $ occur book fill uid b dep -- is the solution not recursive?
  -- trace ("unify: " ++ show uid ++ " " ++ termShow b dep ++ " | " ++ show unsolved ++ " " ++ show solvable ++ " " ++ show no_loops) $ do
  do
    -- If all is ok, generate the solution and return true
    if unsolved && solvable && no_loops then do
      let solution = solve book fill uid spn b
      envFill uid solution
      return True
    -- Otherwise, return true iff both are identical metavars
    else case b of
      (Met bUid bSpn) -> return $ uid == bUid
      other           -> return False

-- Checks if a problem is solveable by pattern unification.
valid :: Fill -> [Term] -> [Int] -> Bool
valid fill []        vars = True
valid fill (x : spn) vars = case reduce M.empty fill 0 x of
  (Var nam idx) -> not (elem idx vars) && valid fill spn (idx : vars)
  otherwise     -> False
  
-- Generates the solution, adding binders and renaming variables.
solve :: Book -> Fill -> Int -> [Term] -> Term -> Term
solve book fill uid []        b = b
solve book fill uid (x : spn) b = case reduce book fill 0 x of
  (Var nam idx) -> Lam nam $ \x -> subst idx x (solve book fill uid spn b)
  otherwise     -> error "unreachable"         

-- Checks if a metavar uid occurs recursively inside a term
occur :: Book -> Fill -> Int -> Term -> Int -> Bool
occur book fill uid (All nam inp bod) dep = occur book fill uid inp dep || occur book fill uid (bod (Var nam dep)) (dep + 1)
occur book fill uid (Lam nam bod)     dep = occur book fill uid (bod (Var nam dep)) (dep + 1)
occur book fill uid (App fun arg)     dep = occur book fill uid fun dep || occur book fill uid arg dep
occur book fill uid (Ann chk val typ) dep = occur book fill uid val dep || occur book fill uid typ dep
occur book fill uid (Slf nam typ bod) dep = occur book fill uid typ dep || occur book fill uid (bod (Var nam dep)) (dep + 1)
occur book fill uid (Ins val)         dep = occur book fill uid val dep
occur book fill uid (Dat scp cts)     dep = any (\x -> occur book fill uid x dep) scp || any (\ (Ctr _ fs rt) -> any (\ (_, ty) -> occur book fill uid ty dep) fs || occur book fill uid rt dep) cts
occur book fill uid (Con nam arg)     dep = any (\x -> occur book fill uid x dep) arg
occur book fill uid (Mat cse)         dep = any (\ (_, cbod) -> occur book fill uid cbod dep) cse
occur book fill uid (Let nam val bod) dep = occur book fill uid val dep || occur book fill uid (bod (Var nam dep)) (dep + 1)
occur book fill uid (Use nam val bod) dep = occur book fill uid val dep || occur book fill uid (bod (Var nam dep)) (dep + 1)
occur book fill uid (Hol nam ctx)     dep = False
occur book fill uid (Op2 opr fst snd) dep = occur book fill uid fst dep || occur book fill uid snd dep
occur book fill uid (Swi nam x z s p) dep = occur book fill uid x dep || occur book fill uid z dep || occur book fill uid (s (Var (nam ++ "-1") dep)) (dep + 1) || occur book fill uid (p (Var nam dep)) dep
occur book fill uid (Src src val)     dep = occur book fill uid val dep
occur book fill uid (Met bUid bSpn)   dep = case reduceMet book fill 2 bUid bSpn of { (Met bUid bSpn) -> uid == bUid; term -> occur book fill uid term dep }
occur book fill uid _                 dep = False

-- Substitution
-- ------------

-- Substitutes a Bruijn level variable by a `neo` value in `term`.
subst :: Int -> Term -> Term -> Term
subst lvl neo (All nam inp bod) = All nam (subst lvl neo inp) (\x -> subst lvl neo (bod x))
subst lvl neo (Lam nam bod)     = Lam nam (\x -> subst lvl neo (bod x))
subst lvl neo (App fun arg)     = App (subst lvl neo fun) (subst lvl neo arg)
subst lvl neo (Ann chk val typ) = Ann chk (subst lvl neo val) (subst lvl neo typ)
subst lvl neo (Slf nam typ bod) = Slf nam (subst lvl neo typ) (\x -> subst lvl neo (bod x))
subst lvl neo (Ins val)         = Ins (subst lvl neo val)
subst lvl neo (Dat scp cts)     = Dat (map (subst lvl neo) scp) (map (\ (Ctr nm fs rt) -> Ctr nm (map (\ (fn, ft) -> (fn, subst lvl neo ft)) fs) (subst lvl neo rt)) cts)
subst lvl neo (Con nam arg)     = Con nam (map (subst lvl neo) arg)
subst lvl neo (Mat cse)         = Mat (map (\ (cnam, cbod) -> (cnam, subst lvl neo cbod)) cse)
subst lvl neo (Ref nam)         = Ref nam
subst lvl neo (Let nam val bod) = Let nam (subst lvl neo val) (\x -> subst lvl neo (bod x))
subst lvl neo (Use nam val bod) = Use nam (subst lvl neo val) (\x -> subst lvl neo (bod x))
subst lvl neo (Met uid spn)     = Met uid (map (subst lvl neo) spn)
subst lvl neo (Hol nam ctx)     = Hol nam (map (subst lvl neo) ctx)
subst lvl neo Set               = Set
subst lvl neo U48               = U48
subst lvl neo (Num n)           = Num n
subst lvl neo (Op2 opr fst snd) = Op2 opr (subst lvl neo fst) (subst lvl neo snd)
subst lvl neo (Swi nam x z s p) = Swi nam (subst lvl neo x) (subst lvl neo z) (\k -> subst lvl neo (s k)) (\k -> subst lvl neo (p k))
subst lvl neo (Txt txt)         = Txt txt
subst lvl neo (Nat val)         = Nat val
subst lvl neo (Var nam idx)     = if lvl == idx then neo else Var nam idx
subst lvl neo (Src src val)     = Src src (subst lvl neo val)

-- Type-Checking
-- -------------

-- Note that, for type-checking, instead of passing down contexts (as usual), we
-- just annotate variables (with a `{x: T}` type hint) and check. This has the
-- same effect, while being slightly more efficient. Type derivations comments
-- are written in this style too.

-- ### Inference

infer :: Term -> Int -> Env Term
infer term dep = trace ("infer: " ++ termShow term dep) $ go term dep where
  -- inp : Set
  -- (bod {nam: inp}) : Set
  -- ----------------------- function
  -- (∀(nam: inp) bod) : Set
  go (All nam inp bod) dep = do
    envSusp (Check 0 inp Set dep)
    envSusp (Check 0 (bod (Ann False (Var nam dep) inp)) Set (dep + 1))
    return Set

  -- fun : ∀(ftyp_nam: ftyp_inp) ftyp_bod
  -- arg : ftyp_inp
  -- ------------------------------------ application
  -- (fun arg) : (ftyp_bod arg)
  go (App fun arg) dep = do
    ftyp <- infer fun dep
    book <- envGetBook
    fill <- envGetFill
    case reduce book fill 2 ftyp of
      (All ftyp_nam ftyp_inp ftyp_bod) -> do
        envSusp (Check 0 arg ftyp_inp dep)
        return $ ftyp_bod arg
      otherwise -> do
        envLog (Error 0 (Hol "function" []) ftyp (App fun arg) dep)
        envFail

  -- 
  -- ---------------- annotation (infer)
  -- {val: typ} : typ
  go (Ann chk val typ) dep = do
    if chk then do
      check 0 val typ dep
    else do
      return ()
    return typ

  -- (bod {nam: typ}) : Set
  -- ----------------------- self-type
  -- ($(nam: typ) bod) : Set
  go (Slf nam typ bod) dep = do
    envSusp (Check 0 (bod (Ann False (Var nam dep) typ)) Set (dep + 1))
    return Set

  -- val : $(vtyp_nam: vtyp_typ) vtyp_bod
  -- ------------------------------------ self-inst (infer)
  -- ~val : (vtyp_bod (~val))
  go (Ins val) dep = do
    vtyp <- infer val dep
    book <- envGetBook
    fill <- envGetFill
    case reduce book fill 2 vtyp of
      (Slf vtyp_nam vtyp_typ vtyp_bod) -> do
        return $ vtyp_bod (Ins val)
      otherwise -> do
        envLog (Error 0 (Hol "self-type" []) vtyp (Ins val) dep)
        envFail
  
  -- T0: * ...
  -- --------------------------------- data
  -- %Foo{ #C0 { x0:T0 ... } ... } : *
  go (Dat scp cts) dep = do
    forM_ cts $ \ (Ctr _ fs rt) -> do
      forM_ fs $ \ (_, ty) -> do
        envSusp (Check 0 ty Set dep)
      envSusp (Check 0 rt Set dep)
    return Set

  -- val : T
  -- ----------------- reference
  -- (Ref nam) : T
  go (Ref nam) dep = do
    book <- envGetBook
    case M.lookup nam book of
      Just val -> infer val dep
      Nothing  -> do
        envLog (Error 0 (Hol "undefined_reference" []) (Hol "unknown_type" []) (Ref nam) dep)
        envFail

  -- ...
  -- --------- type-in-type
  -- Set : Set
  go Set dep = do
    return Set

  -- ...
  -- --------- U48-type
  -- U48 : Set
  go U48 dep = do
    return Set

  -- ...
  -- ----------- U48-value
  -- <num> : U48
  go (Num num) dep = do
    return U48

  -- ...
  -- -------------- String-literal
  -- "txt" : String
  go (Txt txt) dep = do
    return (Ref "String")

  -- ...
  -- --------- Nat-literal
  -- 123 : Nat
  go (Nat val) dep = do
    return (Ref "Nat")

  -- fst : U48
  -- snd : U48
  -- ----------------- U48-operator
  -- (+ fst snd) : U48
  go (Op2 opr fst snd) dep = do
    envSusp (Check 0 fst U48 dep)
    envSusp (Check 0 snd U48 dep)
    return U48

  -- x : U48
  -- p : U48 -> Set
  -- z : (p 0)
  -- s : (n: U48) -> (p (+ 1 n))
  -- ------------------------------------- U48-elim
  -- (switch x { 0: z ; _: s }: p) : (p x)
  go (Swi nam x z s p) dep = do
    envSusp (Check 0 x U48 dep)
    envSusp (Check 0 (p (Ann False (Var nam dep) U48)) Set dep)
    envSusp (Check 0 z (p (Num 0)) dep)
    envSusp (Check 0 (s (Ann False (Var (nam ++ "-1") dep) U48)) (p (Op2 ADD (Num 1) (Var (nam ++ "-1") dep))) (dep + 1))
    return (p x)

  -- val : typ
  -- (bod {nam: typ}) : T
  -- ------------------------ let-binder (infer)
  -- (let nam = val; bod) : T
  go (Let nam val bod) dep = do
    typ <- infer val dep
    infer (bod (Ann False (Var nam dep) typ)) dep

  -- (bod val) : T
  -- ------------------------ use-binder (infer)
  -- (use nam = val; bod) : T
  go (Use nam val bod) dep = do
    infer (bod val) dep

  -- Can't infer #
  go (Con nam arg) dep = do
    envLog (Error 0  (Hol "type_annotation" []) (Hol "untyped_constructor" []) (Con nam arg) dep)
    envFail

  -- Can't infer λ{}
  go (Mat cse) dep = do
    envLog (Error 0  (Hol "type_annotation" []) (Hol "untyped_match" []) (Mat cse) dep)
    envFail

  -- Can't Infer λ
  go (Lam nam bod) dep = do
    envLog (Error 0  (Hol "type_annotation" []) (Hol "untyped_lambda" []) (Lam nam bod) dep)
    envFail

  -- Can't Infer ?
  go (Hol nam ctx) dep = do
    envLog (Error 0  (Hol "type_annotation" []) (Hol "untyped_hole" []) (Hol nam ctx) dep)
    envFail

  -- Can't Infer _
  go (Met uid spn) dep = do
    envLog (Error 0  (Hol "type_annotation" []) (Hol "untyped_meta" []) (Met uid spn) dep)
    envFail

  -- Can't Infer x
  go (Var nam idx) dep = do
    envLog (Error 0  (Hol "type_annotation" []) (Hol "untyped_variable" []) (Var nam idx) dep)
    envFail

  -- Src-passthrough
  go (Src src val) dep = do
    infer val dep

check :: Int -> Term -> Term -> Int -> Env ()
check src val typ dep = trace ("check: " ++ termShow val dep ++ "\n    :: " ++ termShow typ dep) $ go src val typ dep where
  -- (bod {typ_nam: typ_inp}) : (typ_bod {nam: typ_inp})
  -- --------------------------------------------------- lambda
  -- (λnam bod) : (∀(typ_nam: typ_inp) typ_bod)
  go src (Lam nam bod) typx dep = do
    book <- envGetBook
    fill <- envGetFill
    case reduce book fill 2 typx of
      (All typ_nam typ_inp typ_bod) -> do
        let ann = Ann False (Var nam dep) typ_inp
        check 0 (bod ann) (typ_bod ann) (dep + 1)
      otherwise -> do
        infer (Lam nam bod) dep
        return ()

  -- val : (typ_bod ~val)
  -- ---------------------------------- self-inst (check)
  -- ~val : $(typ_nam: typ_typ) typ_bod
  go src (Ins val) typx dep = do
    book <- envGetBook
    fill <- envGetFill
    case reduce book fill 2 typx of
      Slf typ_nam typ_typ typ_bod -> do
        check 0 val (typ_bod (Ins val)) dep
      _ -> do
        infer (Ins val) dep
        return ()
  
  -- TODO: comment constructor checker
  go src val@(Con nam arg) typx dep = do
    book <- envGetBook
    fill <- envGetFill
    case reduce book fill 2 typx of
      (Dat adt_scp adt_cts) -> do
        case lookup nam (map (\(Ctr cnm cfs crt) -> (cnm, (cfs, crt))) adt_cts) of
          Just (cfs,crt) -> do
            if length cfs == length arg then do
              forM_ (zip arg cfs) $ \(a, (_, t)) -> do
                check 0 a t dep
              cmp src val crt typx dep
            else do
              envLog (Error 0 (Hol "constructor_arity_mismatch" []) (Hol "unknown_type" []) (Con nam arg) dep)
              envFail
          Nothing -> do
            envLog (Error 0 (Hol ("constructor_not_found:"++nam) []) (Hol "unknown_type" []) (Con nam arg) dep)
            envFail
      _ -> trace ("OXI " ++ termShow (reduce book fill 2 typx) dep) $ do
        infer (Con nam arg) dep
        return ()

  -- Nat = ##Nat{ #zero{} #succ{ pred:Nat } }
  -- (λ{ #succ: λp p } x)
  -- ∀(x: Nat) Nat
  -- TODO: comment match checker
  go src (Mat cse) typx dep = do
    book <- envGetBook
    fill <- envGetFill
    case reduce book fill 2 typx of
      (All typ_nam typ_inp typ_bod) -> do
        case reduce book fill 2 typ_inp of
          (Dat adt_scp adt_cts) -> do
            let adt_cts_map = M.fromList (map (\ (Ctr cnm cfs crt) -> (cnm, (cfs, crt))) adt_cts)
            forM_ cse $ \ (cnm, cbod) -> do
              case M.lookup cnm adt_cts_map of
                Just (cfs,crt) -> do
                  let ann = Ann False (Con cnm (map (\ (fn, ft) -> Var fn dep) cfs)) typ_inp
                  let bty = foldr (\(fn, ft) acc -> All fn ft (\x -> acc)) (typ_bod ann) cfs
                  let ext = \ (Dat as _) (Dat bs _) -> zipWith (\ (Var _ i) v -> (i,v)) as bs
                  let sub = ext (reduce book fill 2 typ_inp) (reduce book fill 2 crt)
                  let rty = foldl' (\ ty (i,t) -> subst i t ty) bty sub
                  check 0 cbod rty dep
                Nothing -> do
                  envLog (Error 0 (Hol ("constructor_not_found:"++cnm) []) (Hol "unknown_type" []) (Mat cse) dep)
                  envFail
          _ -> do
            infer (Mat cse) dep
            return ()
      _ -> do
        infer (Mat cse) dep
        return ()

  -- val : typ
  -- (bod {nam: typ}) : T
  -- ------------------------ let-binder (check)
  -- (let nam = val; bod) : T
  go src (Let nam val bod) typx dep = do
    typ <- infer val dep
    check 0 (bod (Ann False (Var nam dep) typ)) typx dep

  -- (bod val) : T
  -- ------------------------ use-binder (check)
  -- (use nam = val; bod) : T
  go src (Use nam val bod) typx dep = do
    check 0 (bod val) typx dep

  -- ...
  -- ------ inspection
  -- ?A : T
  go src (Hol nam ctx) typx dep = do
    envLog (Found nam typx ctx dep)
    return ()

  -- ...
  -- ----- metavar
  -- _ : T
  go src (Met uid spn) typx dep = do
    return ()

  -- ...
  -- ---------------- annotation (check)
  -- {val: typ} : typ
  go src (Ann chk val typ) typx dep = do
    cmp src val typ typx dep
    if chk then do
      check src val typ dep
    else do
      return ()

  -- val : T
  -- ------- source (just skipped)
  -- val : T
  go _ (Src src val) typx dep = do
    check src val typx dep

  -- A == B
  -- val : A
  -- -------
  -- val : B
  go src term typx dep = do
    infer <- infer term dep
    cmp src term typx infer dep

  -- Checks types equality and reports
  cmp src term expected detected dep = trace ("cmp " ++ termShow expected dep ++ " " ++ termShow detected dep) $ do
    equal <- equal expected detected dep
    if equal then do
      susp <- envTakeSusp
      forM_ susp $ \ (Check src val typ dep) -> do
        go src val typ dep
      return ()
    else do
      envLog (Error src expected detected term dep)
      envFail

-- identify :: Term -> Term -> ()
-- identify 

checkDef :: Term -> Env ()
checkDef (Ref nam) = do
  book <- envGetBook
  case M.lookup nam book of
    Just val -> case val of
      Ann chk val typ -> check 0 val typ 0 >> return ()
      Ref nm2         -> checkDef (Ref nm2)
      _               -> infer val 0 >> return ()
    Nothing  -> do
      envLog (Error 0 (Hol "undefined_reference" []) (Hol "unknown_type" []) (Ref nam) 0)
      envFail
checkDef other = error "invalid top-level definition"

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
  in concat ["#found{", name, " ", typ', " [", ctx', "]}"]
infoShow book fill (Error src expected detected value dep) =
  let exp = termShow (normal book fill 0 expected dep) dep
      det = termShow (normal book fill 0 detected dep) dep
      val = termShow (normal book fill 0 value dep) dep
  in concat ["#error{", exp, " ", det, " ", val, " ", show src, "}"]
infoShow book fill (Solve name term dep) =
  let term' = termShow (normal book fill 0 term dep) dep
  in concat ["#solve{", show name, " ",  term', "}"]
infoShow book fill (Vague name) =
  concat ["#vague{", name, "}"]
infoShow book fill (Print value dep) =
  let val = termShow (normal book fill 0 value dep) dep
  in concat ["#print{", val, "}"]

-- Parsing
-- -------

doParseTerm :: String -> Term
doParseTerm input = case P.parse parseTerm "" input of
  Left  err  -> error $ "Parse error: " ++ show err
  Right term -> bind term []

parseTerm :: P.Parsec String () Term
parseTerm = do
  P.spaces
  P.choice
    [ parseAll
    , parseMat
    , parseLam
    , parseOp2
    , parseApp
    , parseAnn
    , parseSlf
    , parseIns
    , parseDat
    , parseCon
    , parseUse
    , parseLet
    , parseSet
    , parseNum
    , parseSwi
    , parseTxt
    -- , parseNat
    , parseHol
    , parseMet
    , parseSrc
    , parseRef
    ]

parseAll = do
  P.string "∀"
  P.char '('
  nam <- parseName
  P.char ':'
  inp <- parseTerm
  P.char ')'
  bod <- parseTerm
  return $ All nam inp (\x -> bod)

parseLam = do
  P.string "λ"
  nam <- parseName
  bod <- parseTerm
  return $ Lam nam (\x -> bod)

parseApp = do
  P.char '('
  fun <- parseTerm
  arg <- parseTerm
  P.char ')'
  return $ App fun arg

parseAnn = do
  P.char '{'
  val <- parseTerm
  P.spaces
  P.char ':'
  chk <- P.option False (P.char ':' >> return True)
  typ <- parseTerm
  P.spaces
  P.char '}'
  return $ Ann chk val typ

parseSlf = do
  P.string "$("
  nam <- parseName
  P.char ':'
  typ <- parseTerm
  P.char ')'
  bod <- parseTerm
  return $ Slf nam typ (\x -> bod)

parseIns = do
  P.char '~'
  val <- parseTerm
  return $ Ins val

parseDat = do
  P.try $ P.string "#["
  scp <- do
    indices <- P.many $ P.try $ parseTerm
    return indices
  P.spaces
  P.char ']'
  P.char '{'
  cts <- P.many $ P.try $ do
    P.spaces
    P.char '#'
    nm <- parseName
    P.spaces
    P.char '{'
    fs <- P.many $ P.try $ do
      fn <- parseName
      P.spaces
      P.char ':'
      ft <- parseTerm
      return (fn, ft)
    P.spaces
    P.char '}'
    P.spaces
    P.char ':'
    rt <- parseTerm
    return $ Ctr nm fs rt
  P.spaces
  P.char '}'
  return $ Dat scp cts

parseCon = do
  P.char '#'
  nam <- parseName
  P.spaces
  P.char '{'
  arg <- P.many $ P.try $ parseTerm
  P.spaces
  P.char '}'
  return $ Con nam arg

parseMat = do
  P.try $ P.string "λ{"
  cse <- P.many $ P.try $ do
    P.spaces
    P.char '#'
    cnam <- parseName
    P.spaces
    P.char ':'
    cbod <- parseTerm
    return (cnam, cbod)
  P.spaces
  P.char '}'
  return $ Mat cse

parseRef = do
  name <- parseName
  return $ case name of
    "U48" -> U48
    _     -> Ref name

parseUse = do
  P.try (P.string "use ")
  nam <- parseName
  P.spaces
  P.char '='
  val <- parseTerm
  P.char ';'
  bod <- parseTerm
  return $ Use nam val (\x -> bod)

parseLet = do
  P.try (P.string "let ")
  nam <- parseName
  P.spaces
  P.char '='
  val <- parseTerm
  P.char ';'
  bod <- parseTerm
  return $ Let nam val (\x -> bod)

parseSet = P.char '*' >> return Set

parseNum = Num . read <$> P.many1 P.digit

parseOp2 = do
  opr <- P.try $ do
    P.string "("
    opr <- parseOper
    return opr
  fst <- parseTerm
  snd <- parseTerm
  P.char ')'
  return $ Op2 opr fst snd

parseSwi = do
  P.try (P.string "switch ")
  nam <- parseName
  P.spaces
  P.char '='
  x <- parseTerm
  P.spaces
  P.char '{'
  P.spaces
  P.string "0:"
  z <- parseTerm
  P.spaces
  P.string "_:"
  s <- parseTerm
  P.spaces
  P.char '}'
  P.char ':'
  p <- parseTerm
  return $ Swi nam x z (\k -> s) (\k -> p)

parseTxt = do
  P.char '"'
  txt <- P.many (P.noneOf "\"")
  P.char '"'
  return $ Txt txt

-- parseNat = do
  -- P.char '#'
  -- val <- read <$> P.many1 P.digit
  -- return $ Nat val

parseHol = do
  P.char '?'
  nam <- parseName
  ctx <- P.option [] $ do
    P.char '['
    terms <- P.sepBy parseTerm (P.char ',')
    P.char ']'
    return terms
  return $ Hol nam ctx

parseMet = do
  P.char '_'
  uid <- read <$> P.many1 P.digit
  return $ Met uid []

parseSrc = do
  P.char '!'
  src <- read <$> P.many1 P.digit
  val <- parseTerm
  return $ Src src val

parseName :: P.Parsec String () String
parseName = do
  P.spaces
  head <- P.letter
  tail <- P.many (P.alphaNum <|> P.char '/' <|> P.char '.' <|> P.char '_' <|> P.char '-')
  return (head : tail)

parseOper = P.choice
  [ P.try (P.string "+") >> return ADD
  , P.try (P.string "-") >> return SUB
  , P.try (P.string "*") >> return MUL
  , P.try (P.string "/") >> return DIV
  , P.try (P.string "%") >> return MOD
  , P.try (P.string "<=") >> return LTE
  , P.try (P.string ">=") >> return GTE
  , P.try (P.string "<") >> return LT
  , P.try (P.string ">") >> return GT
  , P.try (P.string "==") >> return EQ
  , P.try (P.string "!=") >> return NE
  , P.try (P.string "&") >> return AND
  , P.try (P.string "|") >> return OR
  , P.try (P.string "^") >> return XOR
  , P.try (P.string "<<") >> return LSH
  , P.try (P.string ">>") >> return RSH
  ]

parseBook :: P.Parsec String () Book
parseBook = do
  defs <- P.many parseDef
  return $ M.fromList defs

parseDef :: P.Parsec String () (String, Term)
parseDef = do
  name <- parseName
  P.spaces
  (typ, hasType) <- P.option (undefined, False) $ do
    P.char ':'
    typ <- parseTerm
    P.spaces
    return (typ, True)
  P.char '='
  value <- parseTerm
  P.char ';'
  P.spaces
  return (name, if hasType then Ann True value typ else value)

doParseBook :: String -> Book
doParseBook input = case P.parse parseBook "" input of
  Left  err  -> error $ "Parse error: " ++ show err
  Right book -> M.map (\x -> bind x []) book

-- API
-- ---

-- Normalizes a term
apiNormal :: Book -> Term -> IO ()
apiNormal book term = putStrLn $ infoShow book IM.empty (Print (normal book IM.empty 2 term 0) 0)

-- Type-checks a term
apiCheck :: Book -> Term -> IO ()
apiCheck book term = case envRun (checkDef term) book of
  Done state value -> apiPrintLogs state
  Fail state       -> apiPrintLogs state

apiPrintLogs :: State -> IO ()
apiPrintLogs (State book fill susp (log : logs)) = do
  putStrLn $ infoShow book fill log
  apiPrintLogs (State book fill susp logs)
apiPrintLogs (State book fill susp []) = do
  return ()

-- Main
-- ----

book :: Book
book = M.fromList []

main :: IO ()
main = do
  args <- getArgs
  case args of
    ["check", file] -> do
      content <- readFile file
      let book = doParseBook content
      case M.lookup "MAIN" book of
        Just term -> apiCheck book (Ref "MAIN")
        Nothing -> putStrLn "Error: No 'main' definition found in the file."
    ["run", file] -> do
      content <- readFile file
      let book = doParseBook content
      case M.lookup "MAIN" book of
        Just term -> apiNormal book term
        Nothing -> putStrLn "Error: No 'main' definition found in the file."
    ["show", file] -> do
      content <- readFile file
      let book = doParseBook content
      case M.lookup "MAIN" book of
        Just term -> putStrLn $ termShow term 0
        Nothing -> putStrLn "Error: No 'main' definition found in the file."
    ["help"] -> printHelp
    [] -> printHelp
    _ -> do
      putStrLn "Invalid command. Use 'kindc help' for usage information."
      exitFailure

printHelp :: IO ()
printHelp = do
  putStrLn "Kind2 usage:"
  putStrLn "  kindc check file.kindc # Type-checks the main definition"
  putStrLn "  kindc run   file.kindc # Normalizes the main definition"
  putStrLn "  kindc show  file.kindc # Stringifies the main definition"
  putStrLn "  kindc help             # Shows this help message"
