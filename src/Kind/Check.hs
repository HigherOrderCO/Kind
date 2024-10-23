-- //./Type.hs//

module Kind.Check where

import Kind.Env
import Kind.Equal
import Kind.Reduce
import Kind.Show
import Kind.Type
import Kind.Util

import qualified Data.IntMap.Strict as IM
import qualified Data.Map.Strict as M

import Control.Monad (forM, forM_, unless, when)
import Debug.Trace

-- Type-Checking
-- -------------

-- Modes:
-- - sus=True  : suspended checks on / better unification / wont return annotated term 
-- - sus=False : suspended checks off / worse unification / will return annotated term

infer :: Bool -> Maybe Cod -> Term -> Int -> Env Term
infer sus src term dep = debug ("infer: " ++ showTermGo False term dep) $ go src term dep where

  go src (All nam inp bod) dep = do
    inpA <- checkLater sus src inp Set dep
    bodA <- checkLater sus src (bod (Ann False (Var nam dep) inp)) Set (dep + 1)
    return $ Ann False (All nam inpA (\x -> bodA)) Set

  go src (App fun arg) dep = do
    funA <- infer sus src fun dep
    book <- envGetBook
    fill <- envGetFill
    case reduce book fill 2 (getType funA) of
      (All inpNam inpTyp inpBod) -> do
        argA <- checkLater sus src arg inpTyp dep
        return $ Ann False (App funA argA) (inpBod arg)
      otherwise -> do
        envLog (Error src (Ref "function") (getType funA) (App fun arg) dep)
        envFail

  go src (Ann True val typ) dep = do
    check sus src val typ dep

  go src (Ann False val typ) dep = do
    return $ Ann False val typ

  go src (Slf nam typ bod) dep = do
    typA <- checkLater sus src typ Set dep
    bodA <- checkLater sus src (bod (Ann False (Var nam dep) typ)) Set (dep + 1)
    return $ Ann False (Slf nam typA (\x -> bodA)) Set

  go src (Ins val) dep = do
    valA <- infer sus src val dep
    book <- envGetBook
    fill <- envGetFill
    case reduce book fill 2 (getType valA) of
      (Slf slfNam slfTyp slfBod) -> do
        return $ Ann False (Ins valA) (slfBod (Ins valA))
      otherwise -> do
        envLog (Error src (Ref "Self") (getType valA) (Ins val) dep)
        envFail

  go src (Ref nam) dep = do
    book <- envGetBook
    case M.lookup nam book of
      Just val -> do
        valA <- infer sus src val dep
        return $ Ann False (Ref nam) (getType valA)
      Nothing -> do
        envLog (Error src (Ref "expression") (Ref "undefined") (Ref nam) dep)
        envFail

  go src Set dep = do
    return $ Ann False Set Set

  go src U64 dep = do
    return $ Ann False U64 Set

  go src F64 dep = do
    return Set

  go src (Num num) dep = do
    return $ Ann False (Num num) U64

  go src (Flt num) dep = do
    return F64

  go src (Op2 opr fst snd) dep = do
    fstType <- infer src fst dep
    sndType <- infer src snd dep

    case (fstType, sndType) of
      (U64 , U64) -> do
        return U64
      (F64 , F64) -> do
        return F64
      (F64 , _)   -> do
        envLog (Error src (Ref "F64") sndType (Op2 opr fst snd) dep)
        envFail
      (U64 , _)   -> do
        envLog (Error src (Ref "U64") sndType (Op2 opr fst snd) dep)
        envFail
      (_ , _)     -> do
        envLog (Error src (Ref "U64 / F64") fstType (Op2 opr fst snd) dep)
        envLog (Error src (Ref "U64 / F64") sndType (Op2 opr fst snd) dep)
        envFail

  go src (Swi zer suc) dep = do
    envLog (Error src (Ref "annotation") (Ref "switch") (Swi zer suc) dep)
    envFail

  go src (Let nam val bod) dep = do
    valA <- infer sus src val dep
    bodA <- infer sus src (bod (Ann False (Var nam dep) (getType valA))) dep
    return $ Ann False (Let nam valA (\x -> bodA)) (getType bodA)

  go src (Use nam val bod) dep = do
    infer sus src (bod val) dep

  -- TODO: annotate inside ADT for completion (not needed)
  go src (ADT scp cts typ) dep = do
    forM_ cts $ \ (Ctr _ tele) -> do
      checkTele sus src tele Set dep
    return $ Ann False (ADT scp cts typ) Set

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

  go src (Log msg nxt) dep = do
    -- msgA <- infer sus src msg dep
    nxtA <- infer sus src nxt dep
    return $ Ann False (Log msg nxtA) (getType nxtA)

  go src (Var nam idx) dep = do
    envLog (Error src (Ref "annotation") (Ref "variable") (Var nam idx) dep)
    envFail

  go _ (Src src val) dep = do
    infer sus (Just src) val dep

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

check :: Bool -> Maybe Cod -> Term -> Term -> Int -> Env Term
check sus src val typ dep = debug ("check: " ++ showTermGo False val dep ++ "\n    :: " ++ showTermGo True typ dep) $ go src val typ dep where

  go src (App (Src _ val) arg) typx dep =
    go src (App val arg) typx dep

  go src (App (Mat cse) arg) typx dep = do
    argA <- infer sus src arg dep
    infer sus src (App (Ann True (Mat cse) (All "x" (getType argA) (\x -> replace arg x typx dep))) arg) dep

  go src (App (Swi zer suc) arg) typx dep = do
    argA <- infer sus src arg dep
    infer sus src (App (Ann True (Swi zer suc) (All "x" (getType argA) (\x -> replace arg x typx dep))) arg) dep

  go src (Lam nam bod) typx dep = do
    book <- envGetBook
    fill <- envGetFill
    case reduce book fill 2 typx of
      (All typNam typInp typBod) -> do
        let ann = Ann False (Var nam dep) typInp
        bodA <- check sus src (bod ann) (typBod ann) (dep + 1)
        return $ Ann False (Lam nam (\x -> bodA)) typx
      otherwise -> do
        infer sus src (Lam nam bod) dep

  go src (Ins val) typx dep = do
    book <- envGetBook
    fill <- envGetFill
    case reduce book fill 2 typx of
      Slf typNam typTyp typBod -> do
        valA <- check sus src val (typBod (Ins val)) dep
        return $ Ann False (Ins valA) typx
      _ -> infer sus src (Ins val) dep

  go src val@(Con nam arg) typx dep = do
    book <- envGetBook
    fill <- envGetFill
    case reduce book fill 2 typx of
      (ADT adtScp adtCts adtTyp) -> do
        case lookup nam (map (\(Ctr cNam cTel) -> (cNam, cTel)) adtCts) of
          Just cTel -> do
            argA <- checkConstructor src arg cTel dep
            return $ Ann False (Con nam argA) typx
          Nothing -> do
            envLog (Error src (Hol ("constructor_not_found:"++nam) []) (Hol "unknown_type" []) (Con nam arg) dep)
            envFail
      otherwise -> infer sus src (Con nam arg) dep
    where
      checkConstructor :: Maybe Cod -> [(Maybe String, Term)] -> Tele -> Int -> Env [(Maybe String, Term)]
      checkConstructor src [] (TRet ret) _ = return []
      checkConstructor src ((field, arg):args) (TExt nam inp bod) dep =
        case field of
          Just field -> if field /= nam
            then do
              envLog (Error src (Hol ("expected:" ++ nam) []) (Hol ("detected:" ++ field) []) (Hol "field_mismatch" []) dep)
              envFail
            else do
              argA  <- check sus src arg inp dep
              argsA <- checkConstructor src args (bod arg) (dep + 1)
              return $ (Just field, argA) : argsA
          Nothing -> do
            argA  <- check sus src arg inp dep
            argsA <- checkConstructor src args (bod arg) (dep + 1)
            return $ (Nothing, argA) : argsA
      checkConstructor src _ _ dep = do
        envLog (Error src (Hol "arity_mismatch" []) (Hol "unknown_type" []) (Hol "constructor" []) dep)
        envFail

  go src (Mat cse) typx dep = do
    book <- envGetBook
    fill <- envGetFill
    case reduce book fill 2 typx of
      (All typNam typInp typBod) -> do
        case reduce book fill 2 typInp of
          (ADT adtScp adtCts adtTyp) -> do
            -- Check every expected case of the match, skipping redundant cases
            let presentCases = M.fromList $ reverse cse
            cseA <- forM adtCts $ \ (Ctr cNam cTel) -> do
              case M.lookup cNam presentCases of
                Just cBod -> do
                  let a_r = teleToTerms cTel dep
                  let eqs = zip (getDatIndices (reduce book fill 2 typInp)) (getDatIndices (reduce book fill 2 (snd a_r)))
                  let rt0 = teleToType cTel (typBod (Ann False (Con cNam (fst a_r)) typInp)) dep
                  let rt1 = foldl' (\ ty (a,b) -> replace a b ty dep) rt0 eqs
                  if any (\(a,b) -> incompatible a b dep) eqs then
                    checkUnreachable Nothing cNam cBod dep
                  else do
                    cBodA <- check sus src cBod rt1 dep
                    return (cNam, cBodA)
                Nothing -> case M.lookup "_" presentCases of
                  Just defaultCase -> do
                    defaultA <- check sus src defaultCase (All "" typInp typBod) dep
                    return (cNam, defaultA)
                  Nothing -> do
                    envLog (Error src (Hol ("missing_case:" ++ cNam) []) (Hol "incomplete_match" []) (Mat cse) dep)
                    envFail
            -- Check if all cases refer to an expected constructor
            let adtCtsMap = M.fromList (map (\ (Ctr cNam cTel) -> (cNam, cTel)) adtCts)
            forM_ cse $ \ (cNam, cBod) -> do
              when (cNam /= "_") $ case M.lookup cNam adtCtsMap of
                Just _ -> return ()
                Nothing -> do
                  envLog (Error src (Hol ("constructor_not_found:"++cNam) []) (Hol "unknown_type" []) (Mat cse) dep)
                  envFail
            return $ Ann False (Mat cseA) typx
          otherwise -> infer sus src (Mat cse) dep
      otherwise -> infer sus src (Mat cse) dep

  go src (Swi zer suc) typx dep = do
    book <- envGetBook
    fill <- envGetFill
    case reduce book fill 2 typx of
      (All typNam typInp typBod) -> do
        case reduce book fill 2 typInp of
          U64 -> do
            -- Check zero case
            let zerAnn = Ann False (Num 0) U64
            zerA <- check sus src zer (typBod zerAnn) dep
            -- Check successor case
            let sucAnn = Ann False (Var "n" dep) U64
            let sucTyp = All "n" U32 (\x -> typBod (Op2 ADD (Num 1) x))
            sucA <- check sus src suc sucTyp dep
            return $ Ann False (Swi zerA sucA) typx
          otherwise -> infer sus src (Swi zer suc) dep
      otherwise -> infer sus src (Swi zer suc) dep

  go src (Let nam val bod) typx dep = do
    valA <- infer sus src val dep
    bodA <- check sus src (bod (Ann False (Var nam dep) (getType valA))) typx dep
    return $ Ann False (Let nam valA (\x -> bodA)) typx

  go src (Use nam val bod) typx dep = do
    check sus src (bod val) typx dep

  go src (Hol nam ctx) typx dep = do
    envLog (Found nam typx ctx dep)
    return $ Ann False (Hol nam ctx) typx

  go src (Met uid spn) typx dep = do
    if sus then do
      return $ Ann False (Met uid spn) typx
    else do
      fill <- envGetFill
      case IM.lookup uid fill of
        Just val -> check sus src val typx dep
        Nothing  -> error $ "unfilled-meta:" ++ show uid

  go src (Log msg nxt) typx dep = do
    -- msgA <- infer sus src msg dep
    nxtA <- check sus src nxt typx dep
    return $ Ann False (Log msg nxtA) typx

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

  go src (Ann True val typ) typx dep = do
    cmp src val typ typx dep
    check sus src val typ dep

  go src (Ann False val typ) typx dep = do
    cmp src val typ typx dep -- FIXME: should this be here?
    return $ Ann False val typ

  go _ (Src src val) typx dep = do
    check sus (Just src) val typx dep

  go src term typx dep = do
    termA <- infer sus src term dep
    cmp src term typx (getType termA) dep
    return termA

  cmp src term expected detected dep = do
    equal <- equal expected detected dep
    if equal then do
      susp <- envTakeSusp
      forM_ susp $ \ (Check src val typ dep) -> do
        check sus src val typ dep
      return ()
    else do
      envLog (Error src expected detected term dep)
      envFail

checkTele :: Bool -> Maybe Cod -> Tele -> Term -> Int -> Env Tele
checkTele sus src tele typ dep = case tele of
  TRet term -> do
    termA <- check sus src term typ dep
    return $ TRet termA
  TExt nam inp bod -> do
    inpA <- check sus src inp Set dep
    bodA <- checkTele sus src (bod (Ann False (Var nam dep) inp)) typ (dep + 1)
    return $ TExt nam inpA (\x -> bodA)

checkUnreachable :: Maybe Cod -> String -> Term -> Int -> Env (String, Term)
checkUnreachable src cNam term dep = go src cNam term dep where
  go src cNam (Lam nam bod)     dep = go src cNam (bod (Con "void" [])) (dep+1)
  go src cNam (Let nam val bod) dep = go src cNam (bod (Con "void" [])) (dep+1)
  go src cNam (Use nam val bod) dep = go src cNam (bod (Con "void" [])) (dep+1)
  go _   cNam (Src src val)     dep = go (Just src) cNam val dep
  go src cNam (Hol nam ctx)     dep = envLog (Found nam (Hol "unreachable" []) ctx dep) >> go src cNam Set dep
  go src cNam term              dep = return (cNam, Ann False (Num 0) U32)

checkLater :: Bool -> Maybe Cod -> Term -> Term -> Int -> Env Term
checkLater False src term typx dep = check False src term typx dep
checkLater True  src term typx dep = envSusp (Check src term typx dep) >> return (Met 0 [])

doCheck :: Term -> Env ()
doCheck (Ann _ val typ) = do
  check True Nothing typ Set 0
  check True Nothing val typ 0
  return ()
doCheck (Src _ val) = do
  doCheck val
doCheck (Ref nam) = do
  doCheckRef nam
doCheck term = do
  infer True Nothing term 0 >> return ()

doCheckRef :: String -> Env ()
doCheckRef nam = do
  book <- envGetBook
  case M.lookup nam book of
    Just val -> doCheck val
    Nothing  -> envLog (Error Nothing (Ref "expression") (Ref "undefined") (Ref nam) 0) >> envFail
