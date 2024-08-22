module Kind.Equal where

import Control.Monad (zipWithM)

import Kind.Type
import Kind.Env
import Kind.Reduce

import qualified Data.Map.Strict as M
import qualified Data.IntMap.Strict as IM
import Debug.Trace

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
occur book fill uid term dep = go term dep where
  go (All nam inp bod) dep =
    let o_inp = go inp dep
        o_bod = go (bod (Var nam dep)) (dep + 1)
    in o_inp || o_bod
  go (Lam nam bod) dep =
    let o_bod = go (bod (Var nam dep)) (dep + 1)
    in  o_bod
  go (App fun arg) dep =
    let o_fun = go fun dep
        o_arg = go arg dep
    in o_fun || o_arg
  go (Ann chk val typ) dep =
    let o_val = go val dep
        o_typ = go typ dep
    in o_val || o_typ
  go (Slf nam typ bod) dep =
    let o_typ = go typ dep
        o_bod = go (bod (Var nam dep)) (dep + 1)
    in o_typ || o_bod
  go (Ins val) dep =
    let o_val = go val dep
    in o_val
  go (Dat scp cts) dep =
    let o_scp = any (\x -> go x dep) scp
        o_cts = any (\ (Ctr _ fs rt) -> any (\ (_, ty) -> go ty dep) fs || go rt dep) cts
    in o_scp || o_cts
  go (Con nam arg) dep =
    any (\x -> go x dep) arg
  go (Mat cse) dep =
    any (\ (_, cbod) -> go cbod dep) cse
  go (Let nam val bod) dep =
    let o_val = go val dep
        o_bod = go (bod (Var nam dep)) (dep + 1)
    in o_val || o_bod
  go (Use nam val bod) dep =
    let o_val = go val dep
        o_bod = go (bod (Var nam dep)) (dep + 1)
    in o_val || o_bod
  go (Hol nam ctx) dep =
    False
  go (Op2 opr fst snd) dep =
    let o_fst = go fst dep
        o_snd = go snd dep
    in o_fst || o_snd
  go (Swi nam x z s p) dep =
    let o_x = go x dep
        o_z = go z dep
        o_s = go (s (Var (nam ++ "-1") dep)) (dep + 1)
        o_p = go (p (Var nam dep)) dep
    in o_x || o_z || o_s || o_p
  go (Src src val) dep =
    let o_val = go val dep
    in o_val
  go (Met bUid bSpn) dep =
    case reduce book fill 2 (Met bUid bSpn) of
      Met bUid bSpn -> uid == bUid
      term          -> go term dep
  go _ dep =
    False
