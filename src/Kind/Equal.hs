-- //./Type.hs//

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
equal a b dep = debug ("== " ++ showTermGo False a dep ++ "\n.. " ++ showTermGo False b dep) $ do
  -- If both terms are identical, return true
  state <- envSnapshot
  is_id <- identical a b dep
  if is_id then do
    envPure True
  -- Otherwise, reduces both terms to wnf
  else do
    envRewind state
    book <- envGetBook
    fill <- envGetFill
    let aWnf = reduce book fill 2 a
    let bWnf = reduce book fill 2 b
    -- If both term wnfs are identical, return true
    state <- envSnapshot
    is_id <- identical aWnf bWnf dep
    if is_id then do
      envPure True
    -- Otherwise, check if they're component-wise equal
    else do
      envRewind state
      similar aWnf bWnf dep

-- Checks if two terms are already syntactically identical
identical :: Term -> Term -> Int -> Env Bool
identical a b dep = do
  fill <- envGetFill
  debug ("ID " ++ showTermGo False a dep ++ "\n.. " ++ showTermGo False b dep ++ "\n" ++ (unlines $ map (\(k,v) -> "~" ++ show k ++ " = " ++ showTermGo False v dep) $ IM.toList fill)) $ go a b dep
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
  go (ADT aScp aCts aTyp) (ADT bScp bCts bTyp) dep = do
    identical aTyp bTyp dep
    -- iSlf <- zipWithM (\ax bx -> identical ax bx dep) aScp bScp
    -- if and iSlf && length aCts == length bCts
      -- then and <$> zipWithM goCtr aCts bCts
      -- else return False
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
  go (Log aMsg aNxt) b dep =
    identical aNxt b dep
  go a (Log bMsg bNxt) dep =
    identical a bNxt dep
  go (Hol aNam aCtx) b dep =
    return True
  go a (Hol bNam bCtx) dep =
    return True
  go U64 U64 dep =
    return True
  go F64 F64 dep =
    return True
  go (Num aVal) (Num bVal) dep =
    return (aVal == bVal)
  go (Flt aVal) (Flt bVal) dep =
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
  go (Lst aLst) (Lst bLst) dep =
    if length aLst == length bLst
      then and <$> zipWithM (\a b -> identical a b dep) aLst bLst
      else return False
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
  go (ADT aScp aCts aTyp) (ADT bScp bCts bTyp) dep = do
    book <- envGetBook
    similar (reduce book IM.empty 0 aTyp) (reduce book IM.empty 0 bTyp) dep
    -- eSlf <- zipWithM (\ax bx -> equal ax bx dep) aScp bScp
    -- if and eSlf && length aCts == length bCts
      -- then and <$> zipWithM goCtr aCts bCts
      -- else return False
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

  debug ("unify: " ++ show uid ++ " " ++ showTermGo False b dep ++ " | " ++ show solved ++ " " ++ show solvable ++ " " ++ show no_loops) $ do
    if not solved && solvable && no_loops then do
      let solution = solve book fill uid spn b
      debug ("solve: " ++ show uid ++ " " ++ showTermGo False solution dep ++ " | spn: " ++ show (map (\t -> showTermGo False t dep) spn)) $ envFill uid solution
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
  go (ADT scp cts typ) dep =
    let o_scp = any (\x -> go x dep) scp
        o_cts = any (\(Ctr _ tele) -> goTele tele dep) cts
        a_typ = go typ dep
    in o_scp || o_cts || a_typ
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
  go (Log msg nxt) dep =
    let o_msg = go msg dep
        o_nxt = go nxt dep
    in o_msg || o_nxt
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

-- Substitution
-- ------------

-- This is the ugly / slow part of Kind. See: https://gist.github.com/VictorTaelin/48eed41a8eca3500721c06dfec72d48c

-- Behaves like 'identical', except it is pure and returns a Bool.
same :: Term -> Term -> Int -> Bool
same (All aNam aInp aBod) (All bNam bInp bBod) dep =
  let sInp = same aInp bInp dep
      sBod = same (aBod (Var aNam dep)) (bBod (Var bNam dep)) (dep + 1)
  in sInp && sBod
same (Lam aNam aBod) (Lam bNam bBod) dep =
  let sBod = same (aBod (Var aNam dep)) (bBod (Var bNam dep)) (dep + 1)
  in  sBod
same (App aFun aArg) (App bFun bArg) dep =
  let sFun = same aFun bFun dep
      sArg = same aArg bArg dep
  in sFun && sArg
same (Slf aNam aTyp aBod) (Slf bNam bTyp bBod) dep =
  let sTyp = same aTyp bTyp dep
  in  sTyp
same (Ins aVal) b dep =
  same aVal b dep
same a (Ins bVal) dep =
  same a bVal dep
same (ADT aScp aCts aTyp) (ADT bScp bCts bTyp) dep =
  -- let sSlf = and $ zipWith (\ax bx -> same ax bx dep) aScp bScp
      -- sCts = length aCts == length bCts && and (zipWith (\ a b -> sameCtr a b dep) aCts bCts)
  let sTyp = same aTyp bTyp dep
  in sTyp
same (Con aNam aArg) (Con bNam bArg) dep =
  let sNam = aNam == bNam
      sArg = length aArg == length bArg && and (zipWith (\(_, aVal) (_, bVal) -> same aVal bVal dep) aArg bArg)
  in sNam && sArg
same (Mat aCse) (Mat bCse) dep =
  let sCse = length aCse == length bCse && and (zipWith (\ a b -> sameCse a b dep) aCse bCse)
  in  sCse
same (Let aNam aVal aBod) b dep =
  same (aBod aVal) b dep
same a (Let bNam bVal bBod) dep =
  same a (bBod bVal) dep
same (Use aNam aVal aBod) b dep =
  same (aBod aVal) b dep
same a (Use bNam bVal bBod) dep =
  same a (bBod bVal) dep
same Set Set dep =
  True
same (Ann chk aVal aTyp) b dep =
  same aVal b dep
same a (Ann chk bVal bTyp) dep =
  same a bVal dep
same (Met aUid aSpn) b dep =
  False
same a (Met bUid bSpn) dep =
  False
-- TODO: Log
same (Log aMsg aNxt) b dep =
  same aNxt b dep
same a (Log bMsg bNxt) dep =
  same a bNxt dep
same (Hol aNam aCtx) b dep =
  True
same a (Hol bNam bCtx) dep =
  True
same U64 U64 dep =
  True
same F64 F64 dep =
  True
same (Num aVal) (Num bVal) dep =
  aVal == bVal
same (Flt aVal) (Flt bVal) dep =
  aVal == bVal
same (Op2 aOpr aFst aSnd) (Op2 bOpr bFst bSnd) dep =
  same aFst bFst dep && same aSnd bSnd dep
same (Swi aZer aSuc) (Swi bZer bSuc) dep =
  same aZer bZer dep && same aSuc bSuc dep
same (Txt aTxt) (Txt bTxt) dep =
  aTxt == bTxt
same (Lst aLst) (Lst bLst) dep =
  length aLst == length bLst && and (zipWith (\a b -> same a b dep) aLst bLst)
same (Nat aVal) (Nat bVal) dep =
  aVal == bVal
same (Src aSrc aVal) b dep =
  same aVal b dep
same a (Src bSrc bVal) dep =
  same a bVal dep
same (Ref aNam) (Ref bNam) dep =
  aNam == bNam
same (Var aNam aIdx) (Var bNam bIdx) dep =
  aIdx == bIdx
same _ _ _ = False

-- Auxiliary functions
sameCtr :: Ctr -> Ctr -> Int -> Bool
sameCtr (Ctr aCNm aTele) (Ctr bCNm bTele) dep =
  if aCNm == bCNm
    then sameTele aTele bTele dep
    else False

sameCse :: (String, Term) -> (String, Term) -> Int -> Bool
sameCse (aCNam, aCBod) (bCNam, bCBod) dep =
  if aCNam == bCNam
    then same aCBod bCBod dep
    else False

sameTele :: Tele -> Tele -> Int -> Bool
sameTele (TRet aTerm) (TRet bTerm) dep = same aTerm bTerm dep
sameTele (TExt aNam aTyp aBod) (TExt bNam bTyp bBod) dep =
  let sTyp = same aTyp bTyp dep
      sBod = sameTele (aBod (Var aNam dep)) (bBod (Var bNam dep)) (dep + 1)
  in sTyp && sBod
sameTele _ _ _ = False

-- Substitutes a Bruijn level variable by a neo value in term.
subst :: Int -> Term -> Term -> Term
subst lvl neo term = go term where
  go (All nam inp bod) = All nam (go inp) (\x -> go (bod (Sub x)))
  go (Lam nam bod)     = Lam nam (\x -> go (bod (Sub x)))
  go (App fun arg)     = App (go fun) (go arg)
  go (Ann chk val typ) = Ann chk (go val) (go typ)
  go (Slf nam typ bod) = Slf nam (go typ) (\x -> go (bod (Sub x)))
  go (Ins val)         = Ins (go val)
  go (ADT scp cts typ) = ADT (map go scp) (map goCtr cts) (go typ)
  go (Con nam arg)     = Con nam (map (\(f, t) -> (f, go t)) arg)
  go (Mat cse)         = Mat (map goCse cse)
  go (Swi zer suc)     = Swi (go zer) (go suc)
  go (Ref nam)         = Ref nam
  go (Let nam val bod) = Let nam (go val) (\x -> go (bod (Sub x)))
  go (Use nam val bod) = Use nam (go val) (\x -> go (bod (Sub x)))
  go (Met uid spn)     = Met uid (map go spn)
  go (Log msg nxt)     = Log (go msg) (go nxt)
  go (Hol nam ctx)     = Hol nam (map go ctx)
  go Set               = Set
  go U64               = U64
  go F64               = F64
  go (Num n)           = Num n
  go (Flt n)           = Flt n
  go (Op2 opr fst snd) = Op2 opr (go fst) (go snd)
  go (Txt txt)         = Txt txt
  go (Lst lst)         = Lst (map go lst)
  go (Nat val)         = Nat val
  go (Var nam idx)     = if lvl == idx then neo else Var nam idx
  go (Src src val)     = Src src (go val)
  go (Sub val)         = val
  goCtr (Ctr nm tele)  = Ctr nm (goTele tele)
  goCse (cnam, cbod)   = (cnam, go cbod)
  goTele (TRet term)   = TRet (go term)
  goTele (TExt k t b)  = TExt k (go t) (\x -> goTele (b x))

-- Replaces a term by another
replace :: Term -> Term -> Term -> Int -> Term
replace old neo term dep = if same old term dep then neo else go term where
  go (All nam inp bod)  = All nam (replace old neo inp dep) (\x -> replace old neo (bod (Sub x)) (dep+1))
  go (Lam nam bod)      = Lam nam (\x -> replace old neo (bod (Sub x)) (dep+1))
  go (App fun arg)      = App (replace old neo fun dep) (replace old neo arg dep)
  go (Ann chk val typ)  = Ann chk (replace old neo val dep) (replace old neo typ dep)
  go (Slf nam typ bod)  = Slf nam (replace old neo typ dep) (\x -> replace old neo (bod (Sub x)) (dep+1))
  go (Ins val)          = Ins (replace old neo val dep)
  go (ADT scp cts typ)  = ADT (map (\x -> replace old neo x (dep+1)) scp) (map goCtr cts) (replace old neo typ dep)
  go (Con nam arg)      = Con nam (map (\(f, t) -> (f, replace old neo t dep)) arg)
  go (Mat cse)          = Mat (map goCse cse)
  go (Swi zer suc)      = Swi (replace old neo zer dep) (replace old neo suc dep)
  go (Ref nam)          = Ref nam
  go (Let nam val bod)  = Let nam (replace old neo val dep) (\x -> replace old neo (bod (Sub x)) (dep+1))
  go (Use nam val bod)  = Use nam (replace old neo val dep) (\x -> replace old neo (bod (Sub x)) (dep+1))
  go (Met uid spn)      = Met uid (map (\x -> replace old neo x (dep+1)) spn)
  go (Log msg nxt)      = Log (replace old neo msg dep) (replace old neo nxt dep)
  go (Hol nam ctx)      = Hol nam (map (\x -> replace old neo x (dep+1)) ctx)
  go Set                = Set
  go U64                = U64
  go F64                = F64
  go (Num n)            = Num n
  go (Flt n)            = Flt n
  go (Op2 opr fst snd)  = Op2 opr (replace old neo fst dep) (replace old neo snd dep)
  go (Txt txt)          = Txt txt
  go (Lst lst)          = Lst (map (\x -> replace old neo x dep) lst)
  go (Nat val)          = Nat val
  go (Var nam idx)      = Var nam idx
  go (Src src val)      = Src src (replace old neo val dep)
  go (Sub val)          = val
  goCtr (Ctr nm tele)   = Ctr nm (goTele tele dep)
  goCse (cnam, cbod)    = (cnam, replace old neo cbod dep)
  goTele (TRet term)  d = TRet (replace old neo term d)
  goTele (TExt k t b) d = TExt k (replace old neo t d) (\x -> goTele (b x) (d+1))

-- Returns true when two terms can definitely never be made identical.
-- TODO: to implement this, just recurse pairwise on the Con constructor,
-- until a different name is found. All other terms are considered compatible.
incompatible :: Term -> Term -> Int -> Bool
incompatible (Con aNam aArg) (Con bNam bArg) dep | aNam /= bNam = True
incompatible (Con aNam aArg) (Con bNam bArg) dep | otherwise    = length aArg == length bArg && any (\(a,b) -> incompatible a b dep) (zip (map snd aArg) (map snd bArg))
incompatible (Src aSrc aVal) b               dep                = incompatible aVal b dep
incompatible a               (Src bSrc bVal) dep                = incompatible a bVal dep
incompatible _               _               _                  = False
