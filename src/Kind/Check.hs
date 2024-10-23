-- //./Type.hs//

module Kind.Check where

import Kind.Type
import Kind.Env
import Kind.Reduce
import Kind.Equal
import Kind.Show

import qualified Data.IntMap.Strict as IM
import qualified Data.Map.Strict as M

import Control.Monad (forM_, unless, when)
import Debug.Trace

-- Type-Checking
-- -------------

infer :: Maybe Cod -> Term -> Int -> Env Term
infer src term dep = debug ("infer: " ++ termShower False term dep) $ go src term dep where
  go src (All nam inp bod) dep = do
    envSusp (Check Nothing inp Set dep)
    envSusp (Check Nothing (bod (Ann False (Var nam dep) inp)) Set (dep + 1))
    return Set

  go src (App fun arg) dep = do
    ftyp <- infer src fun dep
    book <- envGetBook
    fill <- envGetFill
    case reduce book fill 2 ftyp of
      (All ftyp_nam ftyp_inp ftyp_bod) -> do
        envSusp (Check Nothing arg ftyp_inp dep)
        return $ ftyp_bod arg
      otherwise -> do
        envLog (Error src (Ref "function") ftyp (App fun arg) dep)
        envFail

  go src (Ann chk val typ) dep = do
    if chk then do
      -- check Nothing typ Set dep
      check Nothing val typ dep
    else do
      return ()
    return typ

  go src (Slf nam typ bod) dep = do
    envSusp (Check src (bod (Ann False (Var nam dep) typ)) Set (dep + 1))
    return Set

  go src (Ins val) dep = do
    vtyp <- infer src val dep
    book <- envGetBook
    fill <- envGetFill
    case reduce book fill 2 vtyp of
      (Slf vtyp_nam vtyp_typ vtyp_bod) -> do
        return $ vtyp_bod (Ins val)
      otherwise -> do
        envLog (Error src (Ref "Self") vtyp (Ins val) dep)
        envFail

  go src (Dat scp cts typ) dep = do
    forM_ cts $ \ (Ctr _ tele) -> do
      checkTele Nothing tele Set dep
    return Set

  go src (Ref nam) dep = do
    book <- envGetBook
    case M.lookup nam book of
      Just val -> infer src val dep
      Nothing  -> do
        envLog (Error src (Ref "expression") (Ref "undefined") (Ref nam) dep)
        envFail

  go src Set dep = do
    return Set

  go src U32 dep = do
    return Set

  go src F64 dep = do
    return Set

  go src (Num num) dep = do
    return U32

  go src (Flt num) dep = do
    return F64

  go src (Op2 opr fst snd) dep = do
    fstType <- infer src fst dep
    sndType <- infer src snd dep

    case (fstType, sndType) of
      (U32 , U32) -> do
        return U32
      (F64 , F64) -> do
        return F64
      (F64 , _)   -> do
        envLog (Error src (Ref "F64") (Ref (termShower False sndType dep)) (Op2 opr fst snd) dep)
        envFail
      (U32 , _)   -> do
        envLog (Error src (Ref "U32") (Ref (termShower False sndType dep)) (Op2 opr fst snd) dep)
        envFail
      (_ , _)     -> do
        envLog (Error src (Ref "U32 / F64") (Ref ((termShower True fstType dep) ++ " , " ++ (termShower True sndType dep))) (Op2 opr fst snd) dep)
        envFail

  go src (Swi zer suc) dep = do
    envLog (Error src (Ref "annotation") (Ref "switch") (Swi zer suc) dep)
    envFail

  go src (Let nam val bod) dep = do
    typ <- infer src val dep
    infer src (bod (Ann False (Var nam dep) typ)) dep

  go src (Use nam val bod) dep = do
    infer src (bod val) dep

  go src (Con nam arg) dep = do
    envLog (Error src (Ref "annotation") (Ref "constructor") (Con nam arg) dep)
    envFail

  go src (Mat cse) dep = do
    envLog (Error src (Ref "annotation") (Ref "match") (Mat cse) dep)
    envFail

  go src (Lam nam bod) dep = do
    envLog (Error src (Ref "annotation") (Ref "lambda") (Lam nam bod) dep)
    envFail

  go src (Hol nam ctx) dep = do
    envLog (Error src (Ref "annotation") (Ref "hole") (Hol nam ctx) dep)
    envFail

  go src (Met uid spn) dep = do
    envLog (Error src (Ref "annotation") (Ref "meta") (Met uid spn) dep)
    envFail

  go src (Log msg nxt) dep =
    go src nxt dep

  go src (Var nam idx) dep = do
    envLog (Error src (Ref "annotation") (Ref "variable") (Var nam idx) dep)
    envFail

  go _ (Src src val) dep = do
    infer (Just src) val dep

  go src tm@(Txt txt) dep = do
    book <- envGetBook
    fill <- envGetFill
    go src (reduce book fill 2 tm) dep

  go src tm@(Nat val) dep = do
    book <- envGetBook
    fill <- envGetFill
    go src (reduce book fill 2 tm) dep

  go src tm@(Lst lst) dep = do
    book <- envGetBook
    fill <- envGetFill
    go src (reduce book fill 2 tm) dep

check :: Maybe Cod -> Term -> Term -> Int -> Env ()
check src val typ dep = debug ("check: " ++ termShower False val dep ++ "\n    :: " ++ termShower True typ dep) $ go src val typ dep where

  -- Case-Of: `(λ{...} x)`. NOTE: this is probably very slow due to 'replace'
  go src (App (Src _ val) arg) typx dep = go src (App val arg) typx dep
  go src (App (Mat cse) arg) typx dep = do
    arg_ty <- infer src arg dep
    infer src (App (Ann True (Mat cse) (All "x" arg_ty (\x -> replace arg x typx dep))) arg) dep
    return ()
  go src (App (Swi zer suc) arg) typx dep = do
    arg_ty <- infer src arg dep
    infer src (App (Ann True (Swi zer suc) (All "x" arg_ty (\x -> replace arg x typx dep))) arg) dep
    return ()

  go src (Lam nam bod) typx dep = do
    book <- envGetBook
    fill <- envGetFill
    case reduce book fill 2 typx of
      (All typ_nam typ_inp typ_bod) -> do
        let ann = Ann False (Var nam dep) typ_inp
        check Nothing (bod ann) (typ_bod ann) (dep + 1)
      otherwise -> do
        infer src (Lam nam bod) dep
        return ()

  go src (Ins val) typx dep = do
    book <- envGetBook
    fill <- envGetFill
    case reduce book fill 2 typx of
      Slf typ_nam typ_typ typ_bod -> do
        check Nothing val (typ_bod (Ins val)) dep
      _ -> do
        infer src (Ins val) dep
        return ()

  go src val@(Con nam arg) typx dep = do
    book <- envGetBook
    fill <- envGetFill
    case reduce book fill 2 typx of
      (Dat adt_scp adt_cts adt_typ) -> do
        case lookup nam (map (\(Ctr cnm tele) -> (cnm, tele)) adt_cts) of
          Just tele -> do
            rtyp <- checkConAgainstTele Nothing arg tele dep
            cmp src val rtyp typx dep
          Nothing -> do
            envLog (Error src (Hol ("constructor_not_found:"++nam) []) (Hol "unknown_type" []) (Con nam arg) dep)
            envFail
      _ -> do
        infer src (Con nam arg) dep
        return ()

  go src (Mat cse) typx dep = do
    book <- envGetBook
    fill <- envGetFill
    case reduce book fill 2 typx of
      (All typ_nam typ_inp typ_bod) -> do
        case reduce book fill 2 typ_inp of
          (Dat adt_scp adt_cts adt_typ) -> do
            let adt_cts_map = M.fromList (map (\ (Ctr cnm tele) -> (cnm, tele)) adt_cts)
            -- Check if all cases are present
            let hasDefaultCase = any (\(cnm, _) -> cnm == "_") cse
            unless hasDefaultCase $ do
              let presentCases = M.fromList cse
              forM_ adt_cts $ \ (Ctr cnm _) -> do
                unless (M.member cnm presentCases) $ do
                  envLog (Error src (Hol ("missing_case:" ++ cnm) []) (Hol "incomplete_match" []) (Mat cse) dep)
                  envFail
            -- If there is a default case, check that it is well-typed
            when hasDefaultCase $ do
              let defaultCase = snd $ head $ filter (\(cnm, _) -> cnm == "_") cse
              check Nothing defaultCase (All "" typ_inp typ_bod) dep
            -- Check if all concrete cases are well-typed
            forM_ cse $ \ (cnm, cbod) -> do
              when (cnm /= "_") $ case M.lookup cnm adt_cts_map of
                Just tele -> do
                  let a_r = teleToTerm tele dep
                  let eqs = extractEqualities (reduce book fill 2 typ_inp) (reduce book fill 2 (snd a_r)) dep
                  let rt0 = teleToType tele (typ_bod (Ann False (Con cnm (fst a_r)) typ_inp)) dep
                  let rt1 = foldl' (\ ty (a,b) -> replace a b ty dep) rt0 eqs
                  if any (\(a,b) -> incompatible a b dep) eqs then
                    unreachable Nothing cbod dep
                  else
                    check Nothing cbod rt1 dep
                Nothing -> do
                  envLog (Error src (Hol ("constructor_not_found:"++cnm) []) (Hol "unknown_type" []) (Mat cse) dep)
                  envFail
          _ -> do
            infer src (Mat cse) dep
            return ()
      _ -> do
        infer src (Mat cse) dep
        return ()

  go src (Swi zer suc) typx dep = do
    book <- envGetBook
    fill <- envGetFill
    case reduce book fill 2 typx of
      (All typ_nam typ_inp typ_bod) -> do
        case reduce book fill 2 typ_inp of
          U32 -> do
            -- Check zero case
            let zerAnn = Ann False (Num 0) U32
            check src zer (typ_bod zerAnn) dep
            -- Check successor case
            let n = Var "n" dep
            let sucAnn = Ann False n U32
            let sucTyp = All "n" U32 (\x -> typ_bod (Op2 ADD (Num 1) x))
            check src suc sucTyp dep
          _ -> do
            infer src (Swi zer suc) dep
            return ()
      _ -> do
        infer src (Swi zer suc) dep
        return ()

  go src (Let nam val bod) typx dep = do
    typ <- infer src val dep
    check src (bod (Ann False (Var nam dep) typ)) typx dep

  go src (Use nam val bod) typx dep = do
    check src (bod val) typx dep

  go src (Hol nam ctx) typx dep = do
    envLog (Found nam typx ctx dep)
    return ()

  go src (Met uid spn) typx dep = do
    return ()

  go src (Log msg nxt) typx dep = do
    go src nxt typx dep

  go src tm@(Txt txt) typx dep = do
    book <- envGetBook
    fill <- envGetFill
    go src (reduce book fill 2 tm) typx dep

  go src tm@(Nat val) typx dep = do
    book <- envGetBook
    fill <- envGetFill
    go src (reduce book fill 2 tm) typx dep

  go src tm@(Lst lst) typx dep = do
    book <- envGetBook
    fill <- envGetFill
    go src (reduce book fill 2 tm) typx dep

  go src (Ann chk val typ) typx dep = do
    cmp src val typ typx dep
    if chk then do
      -- check src typ Set dep
      check src val typ dep
    else do
      return ()

  go _ (Src src val) typx dep = do
    check (Just src) val typx dep

  go src term typx dep = do
    inferred <- infer src term dep
    cmp src term typx inferred dep

  cmp src term expected detected dep = do
    equal <- equal expected detected dep
    if equal then do
      susp <- envTakeSusp
      forM_ susp $ \ (Check src val typ dep) -> do
        go src val typ dep
      return ()
    else do
      envLog (Error src expected detected term dep)
      envFail

unreachable :: Maybe Cod -> Term -> Int -> Env ()
unreachable src (Lam nam bod)     dep = unreachable src (bod (Con "void" [])) (dep+1)
unreachable src (Hol nam ctx)     dep = envLog (Found nam (Hol "unreachable" []) ctx dep) >> return ()
unreachable src (Let nam val bod) dep = unreachable src (bod (Con "void" [])) (dep+1)
unreachable src (Use nam val bod) dep = unreachable src (bod (Con "void" [])) (dep+1)
unreachable _   (Src src val)     dep = unreachable (Just src) val dep
unreachable src term              dep = return ()

checkTele :: Maybe Cod -> Tele -> Term -> Int -> Env ()
checkTele src tele typ dep = case tele of
  TRet term -> check src term typ dep
  TExt nam inp bod -> do
    check src inp Set dep
    checkTele src (bod (Ann False (Var nam dep) inp)) typ (dep + 1)

checkConAgainstTele :: Maybe Cod -> [(Maybe String, Term)] -> Tele -> Int -> Env Term
checkConAgainstTele src [] (TRet ret) _ = return ret
checkConAgainstTele src ((maybeField, arg):args) (TExt nam inp bod) dep = do
  case maybeField of
    Just field -> if field /= nam
      then do
        envLog (Error src (Hol ("expected:" ++ nam) []) (Hol ("detected:" ++ field) []) (Hol "field_mismatch" []) dep)
        envFail
      else check src arg inp dep
    Nothing -> check src arg inp dep
  checkConAgainstTele src args (bod arg) (dep + 1)
checkConAgainstTele src _ _ dep = do
  envLog (Error src (Hol "constructor_arity_mismatch" []) (Hol "unknown_type" []) (Hol "constructor" []) dep)
  envFail

teleToType :: Tele -> Term -> Int -> Term
teleToType (TRet _)           ret _   = ret
teleToType (TExt nam inp bod) ret dep = All nam inp (\x -> teleToType (bod x) ret (dep + 1))

teleToTerm :: Tele -> Int -> ([(Maybe String, Term)], Term)
teleToTerm tele dep = go tele [] dep where
  go (TRet ret)         args _   = (reverse args, ret)
  go (TExt nam inp bod) args dep = go (bod (Var nam dep)) ((Just nam, Var nam dep) : args) (dep + 1)

extractEqualities :: Term -> Term -> Int -> [(Term, Term)]
extractEqualities (Dat as _ at) (Dat bs _ bt) dep = zip as bs where
extractEqualities a             b             dep = trace ("Unexpected terms: " ++ termShower True a dep ++ " and " ++ termShower True b dep) []

doCheck :: Term -> Env ()
doCheck (Ann _ val typ) = do
  check Nothing typ Set 0
  check Nothing val typ 0
  return ()
doCheck (Src _ val) = do
  doCheck val
doCheck (Ref nam) = do
  doCheckRef nam
doCheck term = do
  infer Nothing term 0 >> return ()

doCheckRef :: String -> Env ()
doCheckRef nam = do
  book <- envGetBook
  case M.lookup nam book of
    Just val -> doCheck val
    Nothing  -> envLog (Error Nothing (Ref "expression") (Ref "undefined") (Ref nam) 0) >> envFail
