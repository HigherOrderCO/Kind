module Core.Check where

import Core.Type
import Core.Env
import Core.Reduce
import Core.Equal
import Core.Show

import qualified Data.Map.Strict as M
import qualified Data.IntMap.Strict as IM
import Control.Monad (forM_)
import Debug.Trace

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
