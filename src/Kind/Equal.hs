module Kind.Equal where

import Control.Monad (zipWithM)

import Debug.Trace

import Kind.Type
import Kind.Env
import Kind.Reduce
import Kind.Show

import qualified Data.Map.Strict as M
import qualified Data.IntMap.Strict as IM

-- Equality
-- --------

-- Checks if two terms are equal, after reduction steps
equal :: Term -> Term -> Int -> Env Bool
equal a b dep = debug ("== " ++ termShower False a dep ++ "\n.. " ++ termShower False b dep) $ do
  -- Reduces both sides to wnf
  book <- envGetBook
  fill <- envGetFill
  let a' = reduce book fill 2 a
  let b' = reduce book fill 2 b
  state <- envSnapshot
  -- If both sides are identical, return true
  is_id <- identical a' b' dep
  if is_id then do
    envPure True
  -- Otherwise, check if they're component-wise equal
  else do
    envRewind state
    similar a' b' dep

-- Checks if two terms are already syntactically identical
identical :: Term -> Term -> Int -> Env Bool
identical a b dep = do
  fill <- envGetFill
  debug ("ID " ++ termShower False a dep ++ "\n.. " ++ termShower False b dep ++ "\n" ++ (unlines $ map (\(k,v) -> "~" ++ show k ++ " = " ++ termShower False v dep) $ IM.toList fill)) $ go a b dep
 where
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
    iSlf <- zipWithM (\ax bx -> identical ax bx dep) aScp bScp
    if and iSlf && length aCts == length bCts
      then and <$> zipWithM goCtr aCts bCts
      else return False
  go (Con aNam aArg) (Con bNam bArg) dep = do
    if aNam == bNam && length aArg == length bArg
      then and <$> zipWithM (\(_, aVal) (_, bVal) -> identical aVal bVal dep) aArg bArg
      else return False
  go (Mat aCse) (Mat bCse) dep = do
    if length aCse == length bCse
      then and <$> zipWithM goCse aCse bCse
      else return False
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
  go (Met aUid aSpn) b dep = do
    fill <- envGetFill
    case IM.lookup aUid fill of
      Just sol -> identical sol b dep
      Nothing  -> unify aUid aSpn b dep
  go a (Met bUid bSpn) dep = do
    fill <- envGetFill
    case IM.lookup bUid fill of
      Just sol -> identical a sol dep
      Nothing  -> unify bUid bSpn a dep
  go (Hol aNam aCtx) b dep =
    return True
  go a (Hol bNam bCtx) dep =
    return True
  go U32 U32 dep =
    return True
  go (Num aVal) (Num bVal) dep =
    return (aVal == bVal)
  go (Op2 aOpr aFst aSnd) (Op2 bOpr bFst bSnd) dep = do
    iFst <- identical aFst bFst dep
    iSnd <- identical aSnd bSnd dep
    return (iFst && iSnd)
  go (Swi aZer aSuc) (Swi bZer bSuc) dep = do
    iZer <- identical aZer bZer dep
    iSuc <- identical aSuc bSuc dep
    return (iZer && iSuc)
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

  goCtr (Ctr aCNm aTele) (Ctr bCNm bTele) = do
    if aCNm == bCNm
      then goTele aTele bTele dep
      else return False

  goCse (aCNam, aCBod) (bCNam, bCBod) = do
    if aCNam == bCNam
      then identical aCBod bCBod dep
      else return False

  goTele :: Tele -> Tele -> Int -> Env Bool
  goTele (TRet aTerm) (TRet bTerm) dep = identical aTerm bTerm dep
  goTele (TExt aNam aTyp aBod) (TExt bNam bTyp bBod) dep = do
    iTyp <- identical aTyp bTyp dep
    iBod <- goTele (aBod (Var aNam dep)) (bBod (Var bNam dep)) (dep + 1)
    return (iTyp && iBod)
  goTele _ _ _ = return False

-- Checks if two terms are component-wise equal
similar :: Term -> Term -> Int -> Env Bool
similar a b dep = go a b dep where
  go (All aNam aInp aBod) (All bNam bInp bBod) dep = do
    eInp <- equal aInp bInp dep
    eBod <- equal (aBod (Var aNam dep)) (bBod (Var bNam dep)) (dep + 1)
    return (eInp && eBod)
  go (Lam aNam aBod) (Lam bNam bBod) dep =
    equal (aBod (Var aNam dep)) (bBod (Var bNam dep)) (dep + 1)
  go (App aFun aArg) (App bFun bArg) dep = do
    eFun <- similar aFun bFun dep
    eArg <- equal aArg bArg dep
    return (eFun && eArg)
  go (Slf aNam aTyp aBod) (Slf bNam bTyp bBod) dep = do
    book <- envGetBook
    similar (reduce book IM.empty 0 aTyp) (reduce book IM.empty 0 bTyp) dep
  go (Dat aScp aCts) (Dat bScp bCts) dep = do
    eSlf <- zipWithM (\ax bx -> equal ax bx dep) aScp bScp
    if and eSlf && length aCts == length bCts
      then and <$> zipWithM goCtr aCts bCts
      else return False
  go (Con aNam aArg) (Con bNam bArg) dep = do
    if aNam == bNam && length aArg == length bArg
      then and <$> zipWithM (\(_, aVal) (_, bVal) -> equal aVal bVal dep) aArg bArg
      else return False
  go (Mat aCse) (Mat bCse) dep = do
    if length aCse == length bCse
      then and <$> zipWithM goCse aCse bCse
      else return False
  go (Op2 aOpr aFst aSnd) (Op2 bOpr bFst bSnd) dep = do
    eFst <- equal aFst bFst dep
    eSnd <- equal aSnd bSnd dep
    return (eFst && eSnd)
  go (Swi aZer aSuc) (Swi bZer bSuc) dep = do
    eZer <- equal aZer bZer dep
    eSuc <- equal aSuc bSuc dep
    return (eZer && eSuc)
  go a b dep = identical a b dep

  goCtr (Ctr aCNm aTele) (Ctr bCNm bTele) = do
    if aCNm == bCNm
      then goTele aTele bTele dep
      else return False

  goCse (aCNam, aCBod) (bCNam, bCBod) = do
    if aCNam == bCNam
      then equal aCBod bCBod dep
      else return False

  goTele :: Tele -> Tele -> Int -> Env Bool
  goTele (TRet aTerm) (TRet bTerm) dep = equal aTerm bTerm dep
  goTele (TExt aNam aTyp aBod) (TExt bNam bTyp bBod) dep = do
    eTyp <- equal aTyp bTyp dep
    eBod <- goTele (aBod (Var aNam dep)) (bBod (Var bNam dep)) (dep + 1)
    return (eTyp && eBod)
  goTele _ _ _ = return False

-- Unification
-- -----------

-- If possible, solves a (?X x y z ...) = K problem, generating a subst.
unify :: Int -> [Term] -> Term -> Int -> Env Bool
unify uid spn b dep = do
  book <- envGetBook
  fill <- envGetFill

  -- is this hole not already solved?
  let solved = IM.member uid fill

  -- does the spine satisfies conditions?
  let solvable = valid fill spn []

  -- is the solution not recursive?
  let no_loops = not $ occur book fill uid b dep

  debug ("unify: " ++ show uid ++ " " ++ termShower False b dep ++ " | " ++ show solved ++ " " ++ show solvable ++ " " ++ show no_loops) $ do
    -- If all is ok, generate the solution and return true
    if not solved && solvable && no_loops then do
      let solution = solve book fill uid spn b
      debug ("solve: " ++ show uid ++ " " ++ termShower False solution dep ++ " | spn: " ++ show (map (\t -> termShower False t dep) spn)) $ envFill uid solution
      return True

    -- Otherwise, return true iff both are identical metavars
    else case b of
      (Src bSrc bVal) -> unify uid spn bVal dep
      (Met bUid bSpn) -> return $ uid == bUid
      other           -> return $ False

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
        o_cts = any (\(Ctr _ tele) -> goTele tele dep) cts
    in o_scp || o_cts
  go (Con nam arg) dep =
    any (\(_, x) -> go x dep) arg
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
  go (Swi zer suc) dep =
    let o_zer = go zer dep
        o_suc = go suc dep
    in o_zer || o_suc
  go (Src src val) dep =
    let o_val = go val dep
    in o_val
  go (Met bUid bSpn) dep =
    case reduce book fill 2 (Met bUid bSpn) of
      Met bUid bSpn -> uid == bUid
      term          -> go term dep
  go _ dep =
    False

  goTele :: Tele -> Int -> Bool
  goTele (TRet term) dep = go term dep
  goTele (TExt nam typ bod) dep =
    let o_typ = go typ dep
        o_bod = goTele (bod (Var nam dep)) (dep + 1)
    in o_typ || o_bod
