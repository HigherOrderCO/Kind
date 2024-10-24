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
infer sus src term dep = debug ("infer:" ++ (if sus then "* " else " ") ++ showTermGo False term dep) $ go term where

  go (All nam inp bod) = do
    inpA <- checkLater sus src inp Set dep
    bodA <- checkLater sus src (bod (Ann False (Var nam dep) inp)) Set (dep + 1)
    return $ Ann False (All nam inpA (\x -> bodA)) Set

  go (App fun arg) = do
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

  go (Ann True val typ) = do
    check sus src val typ dep

  go (Ann False val typ) = do
    return $ Ann False val typ

  go (Slf nam typ bod) = do
    typA <- checkLater sus src typ Set dep
    bodA <- checkLater sus src (bod (Ann False (Var nam dep) typ)) Set (dep + 1)
    return $ Ann False (Slf nam typA (\x -> bodA)) Set

  go (Ins val) = do
    valA <- infer sus src val dep
    book <- envGetBook
    fill <- envGetFill
    case reduce book fill 2 (getType valA) of
      (Slf slfNam slfTyp slfBod) -> do
        return $ Ann False (Ins valA) (slfBod (Ins valA))
      otherwise -> do
        envLog (Error src (Ref "Self") (getType valA) (Ins val) dep)
        envFail

  go (Ref nam) = do
    book <- envGetBook
    case M.lookup nam book of
      Just val -> do
        valA <- infer sus src val dep
        return $ Ann False (Ref nam) (getType valA)
      Nothing -> do
        envLog (Error src (Ref "expression") (Ref "undefined") (Ref nam) dep)
        envFail

  go Set = do
    return $ Ann False Set Set

  go U64 = do
    return $ Ann False U64 Set

  go F64 = do
    return $ Ann False F64 Set

  go (Num num) = do
    return $ Ann False (Num num) U64

  go (Flt num) = do
    return $ Ann False (Flt num) F64


  go (Op2 opr fst snd) = do
    fstT <- infer sus src fst dep
    sndT <- infer sus src snd dep
 
    let validTypes = [F64, U64]
    let checkValidType typ = do
          isValid <- foldr (\t acc -> do
                              isEqual <- equal typ t dep
                              if isEqual then return True else acc
                           ) (return False) validTypes
          return isValid

    isValidType <- checkValidType (getType fstT)
    if not isValidType then do
      envLog (Error src (Ref "Valid numeric type") (getType fstT) (Op2 opr fst snd) dep)
      envFail
    else do
      typesEqual <- equal (getType fstT) (getType sndT) dep
      if not typesEqual then do
        envLog (Error src (getType fstT) (getType sndT) (Op2 opr fst snd) dep)
        envFail
      else do
        book <- envGetBook
        fill <- envGetFill
        let reducedFst = reduce book fill 1 (getType fstT)
        let returnType = getOpReturnType opr reducedFst
        return $ Ann False (Op2 opr fstT sndT) returnType
  
  go (Swi zer suc) = do
    envLog (Error src (Ref "annotation") (Ref "switch") (Swi zer suc) dep)
    envFail

  go (Let nam val bod) = do
    valA <- infer sus src val dep
    bodA <- infer sus src (bod (Ann False (Var nam dep) (getType valA))) dep
    return $ Ann False (Let nam valA (\x -> bodA)) (getType bodA)

  go (Use nam val bod) = do
    infer sus src (bod val) dep

  -- TODO: annotate inside ADT for completion (not needed)
  go (ADT scp cts typ) = do
    forM_ cts $ \ (Ctr _ tele) -> do
      checkTele sus src tele Set dep
    return $ Ann False (ADT scp cts typ) Set

  go (Con nam arg) = do
    envLog (Error src (Ref "annotation") (Ref "constructor") (Con nam arg) dep)
    envFail

  go (Mat cse) = do
    envLog (Error src (Ref "annotation") (Ref "match") (Mat cse) dep)
    envFail

  go (Lam nam bod) = do
    envLog (Error src (Ref "annotation") (Ref "lambda") (Lam nam bod) dep)
    envFail

  go (Hol nam ctx) = do
    envLog (Error src (Ref "annotation") (Ref "hole") (Hol nam ctx) dep)
    envFail

  go (Met uid spn) = do
    envLog (Error src (Ref "annotation") (Ref "meta") (Met uid spn) dep)
    envFail

  go (Log msg nxt) = do
    msgA <- infer sus src msg dep
    nxtA <- infer sus src nxt dep
    return $ Ann False (Log msgA nxtA) (getType nxtA)

  go (Var nam idx) = do
    envLog (Error src (Ref "annotation") (Ref "variable") (Var nam idx) dep)
    envFail

  go (Src src val) = do
    infer sus (Just src) val dep

  go tm@(Txt txt) = do
    return $ Ann False tm (Ref "String")
    -- book <- envGetBook
    -- fill <- envGetFill
    -- go (reduce book fill 2 tm)

  go tm@(Nat val) = do
    book <- envGetBook
    fill <- envGetFill
    go (reduce book fill 2 tm)

  go tm@(Lst lst) = do
    book <- envGetBook
    fill <- envGetFill
    go (reduce book fill 2 tm)

check :: Bool -> Maybe Cod -> Term -> Term -> Int -> Env Term
check sus src term typx dep = debug ("check:" ++ (if sus then "* " else " ") ++ showTermGo False term dep ++ "\n    :: " ++ showTermGo True typx dep) $ go term where

  go (App (Src _ val) arg) =
    go (App val arg)

  go (App (Mat cse) arg) = do
    argA <- infer sus src arg dep
    infer sus src (App (Ann True (Mat cse) (All "x" (getType argA) (\x -> replace arg x typx dep))) arg) dep

  go (App (Swi zer suc) arg) = do
    argA <- infer sus src arg dep
    infer sus src (App (Ann True (Swi zer suc) (All "x" (getType argA) (\x -> replace arg x typx dep))) arg) dep

  go (Lam nam bod) = do
    book <- envGetBook
    fill <- envGetFill
    case reduce book fill 2 typx of
      (All typNam typInp typBod) -> do
        let ann = Ann False (Var nam dep) typInp
        bodA <- check sus src (bod ann) (typBod ann) (dep + 1)
        return $ Ann False (Lam nam (\x -> bodA)) typx
      otherwise -> do
        infer sus src (Lam nam bod) dep

  go (Ins val) = do
    book <- envGetBook
    fill <- envGetFill
    case reduce book fill 2 typx of
      Slf typNam typTyp typBod -> do
        valA <- check sus src val (typBod (Ins val)) dep
        return $ Ann False (Ins valA) typx
      _ -> infer sus src (Ins val) dep

  go val@(Con nam arg) = do
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

  go (Mat cse) = do
    book <- envGetBook
    fill <- envGetFill
    case reduce book fill 2 typx of
      (All typNam typInp typBod) -> do
        case reduce book fill 2 typInp of
          (ADT adtScp adtCts adtTyp) -> do
            -- Checks if all unique cases are well-typed, discarding redundant ones
            let adtCtsMap = M.fromList (map (\ (Ctr cNam cTel) -> (cNam, cTel)) adtCts)
            (cseA, coveredCases) <- checkCse cse M.empty book fill adtCtsMap typInp typBod dep
            -- Check if all constructors are covered
            forM_ adtCts $ \ (Ctr cNam _) ->
              unless (M.member cNam coveredCases || M.member "_" coveredCases) $ do
                envLog (Error src (Hol ("missing_case:" ++ cNam) []) (Hol "incomplete_match" []) (Mat cse) dep)
                envFail
            return $ Ann False (Mat cseA) typx
          otherwise -> infer sus src (Mat cse) dep
      otherwise -> infer sus src (Mat cse) dep
    where checkCse [] coveredCases book fill adtCtsMap typInp typBod dep = do
            return ([], coveredCases)
          checkCse ((cNam, cBod):cse) coveredCases book fill adtCtsMap typInp typBod dep = do
            cse1 <- do
              if M.member cNam coveredCases then
                -- Redundant case
                return []
              else if cNam == "_" then do
                if null ((M.map (const ()) adtCtsMap) `M.difference` coveredCases) then
                  -- All concrete cases already covered, redundant default case
                  return []
                else do
                  -- Default case
                  cBodA <- check sus src cBod (All "" typInp typBod) dep
                  return [(cNam, cBodA)]
              else case M.lookup cNam adtCtsMap of
                Just cTel -> do
                  -- New concrete case
                  let a_r = teleToTerms cTel dep
                  let eqs = zip (getDatIndices (reduce book fill 2 typInp)) (getDatIndices (reduce book fill 2 (snd a_r)))
                  let rt0 = teleToType cTel (typBod (Ann False (Con cNam (fst a_r)) typInp)) dep
                  let rt1 = foldl' (\ ty (a,b) -> replace a b ty dep) rt0 eqs
                  if any (\(a,b) -> incompatible a b dep) eqs then do
                    cse1 <- checkUnreachable Nothing cNam cBod dep
                    return [cse1]
                  else do
                    cBodA <- check sus src cBod rt1 dep
                    return [(cNam, cBodA)]
                Nothing -> do
                  envLog (Error src (Hol ("constructor_not_found:"++cNam) []) (Hol "unknown_type" []) (Mat cse) dep)
                  envFail
            let coveredCases' = M.insert cNam () coveredCases
            (cse', coveredCases) <- checkCse cse coveredCases' book fill adtCtsMap typInp typBod dep
            return ((cse1 ++ cse1), coveredCases)

  go (Swi zer suc) = do
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
            let sucTyp = All "n" U64 (\x -> typBod (Op2 ADD (Num 1) x))
            sucA <- check sus src suc sucTyp dep
            return $ Ann False (Swi zerA sucA) typx
          otherwise -> infer sus src (Swi zer suc) dep
      otherwise -> infer sus src (Swi zer suc) dep

  go (Let nam val bod) = do
    valA <- infer sus src val dep
    bodA <- check sus src (bod (Ann False (Var nam dep) (getType valA))) typx dep
    return $ Ann False (Let nam valA (\x -> bodA)) typx

  go (Use nam val bod) = do
    check sus src (bod val) typx dep

  go (Hol nam ctx) = do
    envLog (Found nam typx ctx dep)
    return $ Ann False (Hol nam ctx) typx

  go (Met uid spn) = do
    return $ Ann False (Met uid spn) typx

  go (Log msg nxt) = do
    msgA <- infer sus src msg dep
    nxtA <- check sus src nxt typx dep
    return $ Ann False (Log msgA nxtA) typx

  go tm@(Txt txt) = do
    return $ Ann False tm (Ref "String")
    -- book <- envGetBook
    -- fill <- envGetFill
    -- go (reduce book fill 2 tm)

  go tm@(Nat val) = do
    book <- envGetBook
    fill <- envGetFill
    go (reduce book fill 2 tm)

  go tm@(Lst lst) = do
    book <- envGetBook
    fill <- envGetFill
    go (reduce book fill 2 tm)

  go (Ann True val typ) = do
    cmp src val typ typx dep
    check sus src val typ dep

  go (Ann False val typ) = do
    cmp src val typ typx dep -- FIXME: should this be here?
    return $ Ann False val typ

  go (Src src val) = do
    check sus (Just src) val typx dep

  go term = do
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
  go src cNam term              dep = return (cNam, Ann False (Num 0) U64)

checkLater :: Bool -> Maybe Cod -> Term -> Term -> Int -> Env Term
checkLater False src term typx dep = check False src term typx dep
checkLater True  src term typx dep = envSusp (Check src term typx dep) >> return (Met 0 [])

doCheckMode :: Bool -> Term -> Env Term
doCheckMode sus (Ann _ val typ) = do
  check sus Nothing typ Set 0
  check sus Nothing val typ 0
doCheckMode sus (Src _ val) = do
  doCheckMode sus val
doCheckMode sus (Ref nam) = do
  book <- envGetBook
  case M.lookup nam book of
    Just val -> doCheckMode sus val
    Nothing  -> envLog (Error Nothing (Ref "expression") (Ref "undefined") (Ref nam) 0) >> envFail
doCheckMode sus term = do
  infer True Nothing term 0

doCheck :: Term -> Env Term
doCheck = doCheckMode True

doAnnotate :: Term -> Env (Term, Fill)
doAnnotate term = do
  doCheckMode True term
  term <- doCheckMode False term
  fill <- envGetFill
  return (term, fill)
