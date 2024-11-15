-- Type.hs:
-- //./Type.hs//

-- FIXME: currently, the Map type will compile to a mutable map in JS, which
-- means we assume it is used linearly (no cloning). To improve this, we can add
-- a shallow-cloning operation for cloned maps, or use an immutable map. Adding
-- linearity checks to Kind would let us pick the best representation.

{-# LANGUAGE ViewPatterns #-}

module Kind.CompileJS where

import Kind.Check
import Kind.Env
import Kind.Equal
import Kind.Reduce
import Kind.Show
import Kind.Type
import Kind.Util

import Control.Monad (forM)
import Data.List (intercalate, isSuffixOf, elem, isInfixOf, isPrefixOf)
import Data.Maybe (fromJust, isJust)
import Data.Word
import qualified Control.Monad.State.Lazy as ST
import qualified Data.IntMap.Strict as IM
import qualified Data.Map.Strict as M
import qualified Data.Set as S

import Debug.Trace

import Prelude hiding (EQ, LT, GT)

-- Type
-- ----

-- Compilation Targets
data Target = C | JS deriving (Eq, Show)

-- Compilable Term
data CT
  = CNul
  | CSet
  | CU64
  | CF64
  | CADT [(String,[(String,CT)])]
  | CMap CT
  | CAll (String,CT) (CT -> CT)
  | CLam (String,CT) (CT -> CT)
  | CApp CT CT
  | CCon String [(String, CT)]
  | CMat CT [(String, [(String,CT)], CT)]
  | CRef String
  | CHol String
  | CLet (String,CT) CT (CT -> CT)
  | CNum Word64
  | CFlt Double
  | COp2 CT Oper CT CT
  | CSwi CT CT CT
  | CKVs (IM.IntMap CT) CT
  | CGet String String CT CT (CT -> CT -> CT)
  | CPut String String CT CT CT (CT -> CT -> CT)
  | CLog CT CT
  | CVar String Int
  | CTxt String
  | CLst [CT]
  | CNat Integer

type CTBook = M.Map String CT

-- Term to CT
-- ----------

-- Converts a Term into a Compilable Term
-- Uses type information to:
-- - Ensure constructor fields are present
-- - Annotate Mat cases with the field names
termToCT :: Book -> Fill -> Term -> Maybe Term -> Int -> CT
termToCT book fill term typx dep = bindCT (t2ct term typx dep) [] where

  t2ct term typx dep = 
    -- trace ("t2ct: " ++ showTerm term ++ "\ntype: " ++ maybe "*" showTerm typx ++ "\ndep: " ++ show dep) $
    go term where

    go (All nam inp bod) =
      let inp' = t2ct inp Nothing dep
          bod' = \x -> t2ct (bod (Var nam dep)) Nothing (dep+1)
      in CAll (nam,inp') bod'
    go (Lam nam bod) =
      case typx of
        Just typx -> case (reduce book fill 2 typx) of
          (All _ inp _) ->
            let inp' = t2ct inp Nothing dep
                bod' = \x -> t2ct (bod (Var nam dep)) Nothing (dep+1)
            in CLam (nam,inp') bod'
          other -> error "err"
        Nothing -> error "err"
    go (App fun arg) =
      let fun' = t2ct fun Nothing dep
          arg' = t2ct arg Nothing dep
      in CApp fun' arg'
    go (Ann _ val typ) =
      t2ct val (Just typ) dep
    go (Slf _ _ _) =
      CNul
    go (Ins val) =
      t2ct val typx dep
    go (ADT scp cts typ) =
      let cts' = map (\ (Ctr nam tele) -> (nam, map (\ (fn,ft) -> (fn, go ft)) (getTeleFields tele dep []))) cts
      in CADT cts'
    go (Con nam arg) =
      case typx of
        Just typx -> case lookup nam (getADTCts (reduce book fill 2 typx)) of
          Just (Ctr _ tele) ->
            let fNames = getTeleNames tele dep []
                fields = map (\ (f,t) -> (f, t2ct t Nothing dep)) $ zip fNames (map snd arg)
            in CCon nam fields
          Nothing -> error $ "constructor-not-found:" ++ nam
        Nothing -> error $ "untyped-constructor"
    go (Mat cse) =
      case typx of
        Just typx -> case reduce book fill 2 typx of
          (All _ adt _) ->
            let adtV = reduce book fill 2 adt
                cts  = getADTCts adtV
                adt' = t2ct adt Nothing dep
                cses = map (\ (cnam, cbod) ->
                  if cnam == "_" then
                    (cnam, [("_",adt')], t2ct cbod Nothing dep)
                  else case lookup cnam cts of
                    Just (Ctr _ tele) ->
                      let fInps  = getTeleFields tele dep []
                          fInps' = map (\ (nm,ty) -> (nm, t2ct ty Nothing dep)) fInps
                      in (cnam, fInps', t2ct cbod Nothing dep)
                    Nothing -> error $ "constructor-not-found:" ++ cnam) cse
            in CLam ("__" ++ show dep, adt') $ \x -> CMat x cses
          otherwise -> error "match-without-type"
        Nothing -> error "err"
    go (Swi zer suc) =
      let zer' = t2ct zer Nothing dep
          suc' = t2ct suc Nothing dep
      in CLam ("__" ++ show dep, CU64) $ \x -> CSwi x zer' suc'
    go (Map typ) =
      let typ' = t2ct typ Nothing dep
      in CMap typ'
    go (KVs kvs def) =
      let kvs' = IM.map (\v -> t2ct v Nothing dep) kvs
          def' = t2ct def Nothing dep
      in CKVs kvs' def'
    go (Get got nam map key bod) =
      let map' = t2ct map Nothing dep
          key' = t2ct key Nothing dep
          bod' = \x y -> t2ct (bod (Var got dep) (Var nam dep)) Nothing (dep+2)
      in CGet got nam map' key' bod'
    go (Put got nam map key val bod) =
      let map' = t2ct map Nothing dep
          key' = t2ct key Nothing dep
          val' = t2ct val Nothing dep
          bod' = \x y -> t2ct (bod (Var got dep) (Var nam dep)) Nothing (dep+2)
      in CPut got nam map' key' val' bod'
    go (Ref nam) =
      CRef nam
    go (Let nam val bod) =
      -- FIXME: add type
      let val' = t2ct val Nothing dep
          bod' = \x -> t2ct (bod (Var nam dep)) Nothing (dep+1)
      in CLet (nam,CNul) val' bod'
    go (Use nam val bod) =
      t2ct (bod val) typx dep
    go Set =
      CSet
    go U64 =
      CU64
    go F64 =
      CF64
    go (Num val) =
      CNum val
    go (Flt val) =
      CFlt val
    go (Op2 opr fst snd) = case typx of
      Nothing -> error "Type information required for binary operation"
      Just typ -> 
          let fst' = t2ct fst Nothing dep
              snd' = t2ct snd Nothing dep
              typ' = t2ct typ Nothing dep
          in COp2 typ' opr fst' snd'
    go (Txt txt) =
      CTxt txt
    go (Lst lst) =
      CLst (map (\x -> t2ct x Nothing dep) lst)
    go (Nat val) =
      CNat val
    go (Hol nam _) =
      CHol nam
    go (Met _ _) =
      CNul
    go (Log msg nxt) =
      let msg' = t2ct msg Nothing dep
          nxt' = t2ct nxt Nothing dep
      in CLog msg' nxt'
    go (Var nam idx) =
      CVar nam idx
    go (Src _ val) =
      t2ct val typx dep

-- CT Transformations
-- ------------------

-- Removes unreachable cases
removeUnreachables :: CT -> CT
removeUnreachables ct = go ct where
  go CNul =
    CNul
  go CSet =
    CSet
  go CU64 =
    CU64
  go CF64 =
    CF64
  go (CADT cts) =
    let cts' = map (\ (n,fs) -> (n, map (\ (fn,ft) -> (fn, go ft)) fs)) cts
    in CADT cts'
  go (CMap typ) =
    let typ' = go typ
    in CMap typ'
  go (CMat val cse) =
    let val' = go val
        cse' = map (\ (n,f,t) -> (n, map (\ (fn,ft) -> (fn, go ft)) f, go t)) cse
        cseF = filter (\ (_,_,t) -> not (isNul t)) cse'
    in CMat val' cseF
  go (CAll (nam,inp) bod) =
    let inp' = go inp
        bod' = \x -> go (bod x)
    in CAll (nam,inp') bod'
  go (CLam (nam,inp) bod) =
    let inp' = go inp
        bod' = \x -> go (bod x)
    in CLam (nam,inp') bod'
  go (CApp fun arg) =
    let fun' = go fun
        arg' = go arg
    in CApp fun' arg'
  go (CCon nam fields) =
    let fields' = map (\ (f,t) -> (f, go t)) fields
    in CCon nam fields'
  go (CRef nam) = CRef nam
  go (CHol nam) = CHol nam
  go (CLet (nam,typ) val bod) =
    let typ' = go typ
        val' = go val
        bod' = \x -> go (bod x)
    in CLet (nam,typ') val' bod'
  go (CNum val) =
    CNum val
  go (CFlt val) =
    CFlt val
  go (COp2 typ opr fst snd) =
    let fst' = go fst
        snd' = go snd
        typ' = go typ
    in COp2 typ' opr fst' snd'
  go (CSwi val zer suc) =
    let val' = go val
        zer' = go zer
        suc' = go suc
    in CSwi val' zer' suc'
  go (CKVs kvs def) =
    let kvs' = IM.map go kvs
        def' = go def
    in CKVs kvs' def'
  go (CGet got nam map key bod) =
    let map' = go map
        key' = go key
        bod' = \x y -> go (bod x y)
    in CGet got nam map' key' bod'
  go (CPut got nam map key val bod) =
    let map' = go map
        key' = go key
        val' = go val
        bod' = \x y -> go (bod x y)
    in CPut got nam map' key' val' bod'
  go (CLog msg nxt) =
    let msg' = go msg
        nxt' = go nxt
    in CLog msg' nxt'
  go (CVar nam idx) =
    CVar nam idx
  go (CTxt txt) =
    CTxt txt
  go (CLst lst) =
    CLst (map go lst)
  go (CNat val) =
    CNat val

-- Lifts shareable lambdas across branches:
-- - from: λx       match v { #Foo{a b}: λy λz A #Bar: λy λz B ... }
-- -   to: λx λy λz match v { #Foo{a b}:       A #Bar:       B ... }
-- TODO: document why this is (and has to be) terrible
-- NOTE: this loses dependencies, turning foralls into simple arrows
liftLambdas :: CT -> Int -> CT
liftLambdas ct depth = 
  gen (liftInp ct depth [] 0) [] ct depth where

  gen :: [CT] -> [CT] -> CT -> Int -> CT
  gen []         ctx ct dep = liftVal ctx ct dep [] 0
  gen (inp:inps) ctx ct dep = CLam (nam dep, inp) (\x -> gen inps (ctx++[x]) ct (dep+1))

  nam :: Int -> String
  nam d = "_" ++ "$" ++ show d

  var :: [CT] -> Int -> CT
  var ctx d | d < length ctx = ctx !! d
  var ctx d | otherwise      = CNul

  eta :: [(String,CT)] -> CT -> CT
  eta []         ct                   = ct
  eta (fld:flds) (CLam (nam,inp) bod) = CLam (nam,inp) $ \x -> eta flds (bod x)
  eta (fld:flds) ct                   = CLam fld       $ \x -> CApp (eta flds ct) x

  liftVal :: [CT] -> CT -> Int -> [CT] -> Int -> CT
  liftVal ctx ct dep inp skip = go ct dep inp skip where
    go (CLam (nam,inp) bod)     dep inps 0    = liftVal ctx (bod (var ctx (length inps))) (dep+1) (inps++[inp]) 0
    go (CLam (nam,inp) bod)     dep inps skip = CLam (nam,inp) $ \x -> liftVal ctx (bod x) (dep+1) inps (skip-1)
    go (CLet (nam,typ) val bod) dep inps skip = CLet (nam,typ) val $ \x -> liftVal ctx (bod x) (dep+1) inps skip
    go ct@(CMat val cse)     dep inps skip | length cse > 0 =
      let recsV = flip map cse $ \ (_,f,b) -> liftVal ctx (eta f b) dep inps (skip + length f)
          recsI = flip map cse $ \ (_,f,b) -> liftInp     (eta f b) dep inps (skip + length f)
          valid = flip all recsI $ \ a -> length a == length (head recsI)
      in if valid then CMat val (zipWith (\ (n,f,_) b -> (n,f,b)) cse recsV) else ct
    go ct@(CSwi val zer suc) dep inps skip =
      let recZI = liftInp     (eta []           zer) dep inps skip
          recZV = liftVal ctx (eta []           zer) dep inps skip
          recSI = liftInp     (eta [("p",CU64)] suc) dep inps (skip + 1)
          recSV = liftVal ctx (eta [("p",CU64)] suc) dep inps (skip + 1)
          valid = length recZI == length recSI
      in if valid then CSwi val recZV recSV else ct
    go ct dep inps s = ct

  liftInp :: CT -> Int -> [CT] -> Int -> [CT]
  liftInp ct dep inps skip = go ct dep inps skip where
    go (CLam (nam,inp) bod)     dep inps 0    = liftInp (bod CNul) (dep+1) (inps++[inp]) 0
    go (CLam (nam,inp) bod)     dep inps skip = liftInp (bod CNul) (dep+1) inps (skip-1)
    go (CLet (nam,typ) val bod) dep inps skip = liftInp (bod CNul) (dep+1) inps skip
    go (CMat val cse)           dep inps skip | length cse > 0 =
      let recsI = flip map cse $ \ (_,f,b) -> liftInp (eta f b) dep inps (skip + length f)
          valid = flip all recsI $ \ a -> length a == length (head recsI)
      in if valid then head recsI else inps
    go (CSwi val zer suc) dep inps skip =
      let recZI = liftInp (eta []           zer) dep inps skip
          recSI = liftInp (eta [("p",CU64)] suc) dep inps (skip + 1)
          valid = length recZI == length recSI
      in if valid then recZI else inps
    go ct dep inps s = inps

inline :: CTBook -> CT -> CT
inline book ct = nf ct where
  nf :: CT -> CT
  nf ct = go (red book ct) where
    go :: CT -> CT
    go CNul                     = CNul
    go CSet                     = CSet
    go CU64                     = CU64
    go CF64                     = CF64
    go (CADT cts)               = CADT (map (\ (n,fs) -> (n, map (\ (fn,ft) -> (fn, nf ft)) fs)) cts)
    go (CMap typ)               = CMap (nf typ)
    go (CAll (nam,inp) bod)     = CAll (nam, nf inp) (\x -> nf (bod x))
    go (CLam (nam,inp) bod)     = CLam (nam, nf inp) (\x -> nf (bod x))
    go (CApp fun arg)           = CApp (nf fun) (nf arg)
    go (CCon nam fields)        = CCon nam (map (\ (f,t) -> (f, nf t)) fields)
    go (CMat val cses)          = CMat (nf val) (map (\ (n,f,b) -> (n, map (\ (fn,ft) -> (fn, nf ft)) f, nf b)) cses)
    go (CRef nam)               = CRef nam
    go (CHol nam)               = CHol nam
    go (CLet (nam,typ) val bod) = CLet (nam, nf typ) (nf val) (\x -> nf (bod x))
    go (CNum val)               = CNum val
    go (CFlt val)               = CFlt val
    go (COp2 typ opr fst snd)   = COp2 (nf typ) opr (nf fst) (nf snd)
    go (CSwi val zer suc)       = CSwi (nf val) (nf zer) (nf suc)
    go (CKVs kvs def)           = CKVs (IM.map nf kvs) (nf def)
    go (CGet g n m k b)         = CGet g n (nf m) (nf k) (\x y -> nf (b x y))
    go (CPut g n m k v b)       = CPut g n (nf m) (nf k) (nf v) (\x y -> nf (b x y))
    go (CLog msg nxt)           = CLog (nf msg) (nf nxt)
    go (CVar nam idx)           = CVar nam idx
    go (CTxt txt)               = CTxt txt
    go (CLst lst)               = CLst (map nf lst)
    go (CNat val)               = CNat val

-- CT Evaluation
-- -------------

-- Reduce to WNF
red :: CTBook -> CT -> CT
red book tm = go tm where
  go (CApp fun arg) = app book (red book fun) arg
  go (CRef nam)     = ref book nam    
  go val            = val

-- (let x = y A B)
-- ---------------
-- let x = y (A B)

-- Application
app :: CTBook -> CT -> CT -> CT
app book (CAll (nam,inp) bod)     arg = red book (bod (red book arg))
app book (CLam (nam,inp) bod)     arg = red book (bod (red book arg))
app book (CMat val cse)           arg = CMat val (map (\ (n,f,b) -> (n, f, skp f b (\b -> CApp b arg))) cse)
app book (CLet (nam,typ) val bod) arg = CLet (nam,typ) val (\x -> app book (bod x) arg)
app book fun                      arg = CApp fun arg

-- Maps inside N lambdas
skp :: [(String,CT)] -> CT -> (CT -> CT) -> CT
skp []         ct fn = fn ct
skp (fld:flds) ct fn = CLam fld $ \x -> skp flds (CApp ct x) fn

-- Reference
-- NOTE: this should only inline refs ending with "bind", "bind/go" or "pure".
-- create an aux function called "inl :: String -> Bool" after it
ref :: CTBook -> String -> CT
ref book nam
  | inl nam   = red book (fromJust (M.lookup nam book))
  | otherwise = CRef nam
  where
    inl :: String -> Bool
    inl nam = any (`isSuffixOf` nam)
      [ "/bind"
      , "/bind/go"
      , "/pure"
      -- , "HVM/RTag/eq"
      -- , "HVM/RTerm/get-lab"
      -- , "HVM/RTerm/get-loc"
      -- , "HVM/RTerm/get-tag"
      -- , "HVM/RTerm/new"
      -- , "HVM/alloc-redex"
      -- , "HVM/alloc-rnod"
      -- , "HVM/get"
      -- , "HVM/just"
      -- , "HVM/link"
      -- , "HVM/port"
      -- , "HVM/push-redex"
      -- , "HVM/set"
      -- , "HVM/swap"
      -- , "HVM/take"
      -- , "U64/to-bool"
      , "IO/print"
      , "IO/prompt"
      , "IO/swap"
      , "IO/read"
      , "IO/exec"
      , "IO/args"
      ]

-- JavaScript Codegen
-- ------------------

getArguments :: CT -> ([(String,CT)], CT)
getArguments term = go term 0 where
  go (CLam (nam,inp) bod) dep =
    let (args, body) = go (bod (CVar nam dep)) (dep+1)
    in ((nam,inp):args, body)
  go body dep = ([], body)

arityOf :: CTBook -> String -> Int
arityOf book name = case M.lookup name book of
  Just ct -> length $ fst $ getArguments ct
  Nothing -> 0

isRecCall :: String -> Int -> CT -> [CT] -> Bool
isRecCall fnName arity appFun appArgs =
  case appFun of
    CRef appFunName ->
      let isSameFunc  = appFunName == fnName
          isSameArity = length appArgs == arity
      in isSameFunc && isSameArity
    _ -> False

isSatCall :: CTBook -> CT -> [CT] -> Bool
isSatCall book (CRef funName) appArgs = arityOf book funName == length appArgs
isSatCall book _              _       = False

isEffCall :: CTBook -> CT -> [CT] -> Bool
isEffCall book (CHol name) appArgs = True
isEffCall book name        appArgs = False

-- Converts a function to JavaScript or C
fnToJS :: CTBook -> String -> CT -> ST.State Int String
fnToJS book fnName ct@(getArguments -> (fnArgs, fnBody)) = do
  bodyName <- fresh
  bodyStmt <- ctToJS True bodyName fnBody 0 
  argTypes <- return $ zipWith (\ dep (nm,ty) -> tyToTS ty dep) [0..] fnArgs

  let arg = zip (map fst fnArgs) argTypes
  let tco = isInfixOf "/*TCO*/" bodyStmt
  let bod = "{" ++ bodyStmt ++ "return " ++ bodyName ++ "; }"
  let fun = jsDefFun fnName arg tco bod
  let cur = jsDefCur fnName arg
  return $ fun ++ "\n" ++ cur

  where

  -- Generates top-level function
  jsDefFun name [] tco body = 
    let wrap = \x -> "(() => " ++ x ++ ")()"
        head = "const " ++ nameToJS name ++ "$ = "
    in head ++ wrap body
  jsDefFun name arg tco body =
    let loop = \ x -> concat ["{while(1)", x, "}"]
        head = "function " ++ nameToJS name ++ "$(" ++ intercalate "," (map (\ (nm,ty) -> nm++"/*:"++ty++"*/") arg) ++ ") "
    in head ++ (if tco then loop body else body)

  -- Generates top-level function (curried version)
  jsDefCur name arg =
    let head = "const " ++ nameToJS name ++ " = " ++ concat (map (\x -> x ++ " => ") (map fst arg))
        body = nameToJS name ++ "$" ++ (if null arg then "" else "(" ++ intercalate "," (map fst arg) ++ ")")
    in head ++ body

  -- Genreates a fresh name
  fresh :: ST.State Int String
  fresh = do
    n <- ST.get
    ST.put (n + 1)
    return $ "$x" ++ show n

  -- Assigns an expression to a name, or return it directly
  set :: String -> String -> ST.State Int String
  set name expr = return $ "var " ++ name ++ " = " ++ expr ++ ";"

  -- Compiles a name to JS
  nameToJS :: String -> String
  nameToJS x = "$" ++ map (\c -> if c == '/' || c == '.' || c == '-' || c == '#' then '$' else c) x

  -- Compiles an Oper to JS
  operToJS :: Oper -> String
  operToJS ADD = "+"
  operToJS SUB = "-"
  operToJS MUL = "*"
  operToJS DIV = "/"
  operToJS MOD = "%"
  operToJS EQ  = "==="
  operToJS NE  = "!=="
  operToJS LT  = "<"
  operToJS GT  = ">"
  operToJS LTE = "<="
  operToJS GTE = ">="
  operToJS AND = "&"
  operToJS OR  = "|"
  operToJS XOR = "^"
  operToJS LSH = "<<"
  operToJS RSH = ">>"

  -- Compiles a CType to TS
  tyToTS :: CT -> Int -> String
  tyToTS CSet dep =
    "Type"
  tyToTS CU64 dep =
    "BigInt"
  tyToTS CF64 dep =
    "Number"
  tyToTS (CADT cts) dep =
    intercalate " | " $ flip map cts $ \ (nm,fs) -> "{$:'" ++ nm ++ "'" ++ concat (map (\ (fn,ft) -> ", " ++ fn ++ ": " ++ tyToTS ft dep) fs) ++ "}"
  tyToTS (CMap typ) dep =
    "Map<BigInt, " ++ tyToTS typ dep ++ ">"
  tyToTS (CAll (nam,inp) bod) dep =
    let uid = nameToJS nam ++ "$" ++ show dep
    in "(" ++ uid ++ ":" ++ tyToTS inp dep ++ ") => " ++ tyToTS (bod (CVar uid dep)) (dep + 1)
  tyToTS (CRef nam) dep =
    nam
  tyToTS (CVar nam _) dep = 
    nam
  tyToTS (CApp fun arg) dep =
    tyToTS fun dep ++ "<" ++ tyToTS arg dep ++ ">"
  tyToTS CNul dep =
    "null"
  tyToTS term dep =
    "null"

  -- Compiles a CTerm to JS
  ctToJS :: Bool -> String -> CT -> Int -> ST.State Int String
  ctToJS tail var term dep = 
    -- trace ("COMPILE: " ++ showCT term 0) $
    go (red book term) where
    go CNul =
      set var "null"
    go CSet =
      set var "/*Type*/null"
    go ty@CU64 =
      set var $ "/*" ++ tyToTS ty dep ++ "*/null"
    go ty@CF64 =
      set var $ "/*" ++ tyToTS ty dep ++ "*/null"
    go ty@(CADT cts) = do
      set var $ "/*" ++ tyToTS ty dep ++ "*/null"
    go ty@(CMap typ) =
      set var $ "/*" ++ tyToTS ty dep ++ "*/null"
    go ty@(CAll (nam,inp) bod) =
      set var $ "/*" ++ tyToTS ty dep ++ "*/null"
    go tm@(CLam (nam,inp) bod) = do
      let (names, bodyTerm, _) = lams tm dep []
      bodyName <- fresh
      bodyStmt <- ctToJS False bodyName bodyTerm (dep + length names)
      set var $ concat ["(", intercalate " => " names, " => {", bodyStmt, "return ", bodyName, ";})"]
      where lams :: CT -> Int -> [String] -> ([String], CT, Maybe Term)
            lams (CLam (n,i) b) dep names =
              let uid = nameToJS n ++ "$" ++ show dep
              in lams (b (CVar uid dep)) (dep + 1) (uid : names)
            lams term dep names = (reverse names, term, Nothing)
    go app@(CApp fun arg) = do
      let (appFun, appArgs) = getAppChain app
      -- Tail Recursive Call
      if tail && isRecCall fnName (length fnArgs) appFun appArgs then do
        argDefs <- forM (zip (map fst fnArgs) appArgs) $ \ (paramName, appArgs) -> do
          argName <- fresh
          argStmt <- ctToJS False argName appArgs dep
          return (argStmt, paramName ++ " = " ++ argName ++ ";")
        let (argStmts, paramDefs) = unzip argDefs
        return $ concat argStmts ++ concat paramDefs ++ "/*TCO*/continue;"
      -- Saturated Call Optimization
      else if isSatCall book appFun appArgs then do
        let (CRef funName) = appFun
        argNamesStmts <- forM appArgs $ \arg -> do
          argName <- fresh
          argStmt <- ctToJS False argName arg dep
          return (argName, argStmt)
        retStmt <- set var $ concat [nameToJS funName, "$(", intercalate ", " (map fst argNamesStmts), ")"]
        return $ concat (map snd argNamesStmts ++ [retStmt])
      -- IO Actions
      else if isEffCall book appFun appArgs then do
        let (CHol name) = appFun
        case name of
          "IO_BIND" -> do
            let [_, _, call, cont] = appArgs
            callName <- fresh
            callStmt <- ctToJS False callName call dep
            contStmt <- ctToJS False var (CApp cont (CVar callName dep)) dep
            return $ concat [callStmt, contStmt]
          "IO_PURE" -> do
            let [_, value] = appArgs
            valueStmt <- ctToJS False var value dep
            return $ valueStmt
          "IO_SWAP" -> do
            let [key, val] = appArgs
            keyName  <- fresh
            keyStmt  <- ctToJS False keyName key dep
            valName  <- fresh
            valStmt  <- ctToJS False valName val dep
            resName  <- fresh
            resStmt  <- set resName (concat ["SWAP(", keyName, ", ", valName, ");"])
            doneStmt <- ctToJS False var (CVar resName 0) dep
            return $ concat [keyStmt, valStmt, resStmt, doneStmt]
          "IO_PRINT" -> do
            let [text] = appArgs
            textName <- fresh
            textStmt <- ctToJS False textName text dep
            doneStmt <- ctToJS False var (CCon "Unit" []) dep 
            return $ concat [textStmt, "console.log(LIST_TO_JSTR(", textName, "));", doneStmt]
          "IO_PROMPT" -> do
            error $ "TODO"
          "IO_READ" -> do
            let [path] = appArgs
            pathName <- fresh
            pathStmt <- ctToJS False pathName path dep
            let readStmt = concat
                  [ "try { var ", var, " = { $: 'Done', value: JSTR_TO_LIST(readFileSync(LIST_TO_JSTR(", pathName, "), 'utf8')) }; } "
                  , "catch (e) { var ", var, " = { $: 'Fail', error: e.message }; }"
                  ]
            return $ concat [pathStmt, readStmt]
          "IO_EXEC" -> do
            let [cmd] = appArgs
            cmdName  <- fresh
            cmdStmt  <- ctToJS False cmdName cmd dep
            retStmt  <- set var $ concat ["JSTR_TO_LIST(execSync(LIST_TO_JSTR(", cmdName, ")).toString())"]
            return $ concat [cmdStmt, retStmt]
          "IO_ARGS" -> do
            let [_] = appArgs
            retStmt  <- set var "process.argv.slice(2).map(x => JARRAY_TO_LIST(x, JSTR_TO_LIST))"
            return retStmt
          _ -> error $ "Unknown IO operation: " ++ name
      -- Normal Application
      else do
        funName <- fresh
        funStmt <- ctToJS False funName fun dep
        argName <- fresh
        argStmt <- ctToJS False argName arg dep
        retStmt <- set var $ concat ["(", funName, ")(", argName, ")"]
        return $ concat [funStmt, argStmt, retStmt]
    go (CCon nam fields) = do
      objStmt <- set var $ concat ["({$: \"", nam, "\"})"]
      setStmts <- forM fields $ \ (nm, tm) -> do
        fldName <- fresh
        fldStmt <- ctToJS False fldName tm dep
        setStmt <- return $ concat [var ++ "." ++ nm ++ " = " ++ fldName ++ ";"]
        return $ concat [fldStmt, setStmt]
      return $ concat $ [objStmt] ++ setStmts
    go (CMat val cses) = do
      let isRecord = length cses == 1 && not (any (\ (nm,_,_) -> nm == "_") cses)
      valName <- fresh
      valStmt <- ctToJS False valName val dep
      cases <- forM cses $ \ (cnam, fields, cbod) ->
        if cnam == "_" then do
          retStmt <- ctToJS tail var (CApp cbod (CVar valName 0)) dep
          return $ concat ["default: { " ++ retStmt, " break; }"]
        else do
          let bod = foldl CApp cbod (map (\ (fn,ft) -> (CVar (valName++"."++fn) 0)) fields)
          retStmt <- ctToJS tail var bod dep
          return $ if isRecord
            then retStmt
            else concat ["case \"", cnam, "\": { ", retStmt, " break; }"]
      let switch = if isRecord
            then concat [valStmt, unwords cases]
            else concat [valStmt, "switch (", valName, ".$) { ", unwords cases, " }"]
      return $ switch
    go (CSwi val zer suc) = do
      valName <- fresh
      valStmt <- ctToJS False valName val dep
      zerStmt <- ctToJS tail var zer dep
      sucStmt <- ctToJS tail var (CApp suc (COp2 CU64 SUB (CVar valName 0) (CNum 1))) dep
      let swiStmt = concat [valStmt, "if (", valName, " === 0n) { ", zerStmt, " } else { ", sucStmt, " }"]
      return $ swiStmt
    go (CKVs kvs def) = do
      dftStmt <- do
        dftName <- fresh
        dftStmt <- ctToJS False dftName def dep
        return $ concat [dftStmt, var, ".set(-1n, ", dftName, ");"]
      kvStmts <- forM (IM.toList kvs) $ \(k, v) -> do
        valName <- fresh
        valStmt <- ctToJS False valName v dep
        return $ concat [valStmt, var, ".set(", show k, "n, ", valName, ");"]
      let mapStmt = concat ["var ", var, " = new Map();", unwords kvStmts, dftStmt]
      return $ mapStmt
    go (CGet got nam map key bod) = do
      mapName <- fresh
      mapStmt <- ctToJS False mapName map dep
      keyName <- fresh
      keyStmt <- ctToJS False keyName key dep
      neoName <- fresh
      gotName <- fresh
      retStmt <- ctToJS tail var (bod (CVar gotName dep) (CVar neoName dep)) dep
      let gotStmt = concat ["var ", gotName, " = ", mapName, ".has(", keyName, ") ? ", mapName, ".get(", keyName, ") : ", mapName, ".get(-1n);"]
      let neoStmt = concat ["var ", neoName, " = ", mapName, ";"]
      return $ concat [mapStmt, keyStmt, gotStmt, neoStmt, retStmt]
    go (CPut got nam map key val bod) = do
      mapName <- fresh
      mapStmt <- ctToJS False mapName map dep
      keyName <- fresh
      keyStmt <- ctToJS False keyName key dep
      valName <- fresh
      valStmt <- ctToJS False valName val dep
      neoName <- fresh
      gotName <- fresh
      retStmt <- ctToJS tail var (bod (CVar gotName dep) (CVar neoName dep)) dep
      let gotStmt = concat ["var ", gotName, " = ", mapName, ".has(", keyName, ") ? ", mapName, ".get(", keyName, ") : ", mapName, ".get(-1n);"]
      let neoStmt = concat ["var ", neoName, " = ", mapName, "; ", mapName, ".set(", keyName, ", ", valName, ");"]
      return $ concat [mapStmt, keyStmt, valStmt, gotStmt, neoStmt, retStmt]
    go (CRef nam) =
      set var $ nameToJS nam
    go (CHol nam) =
      set var $ "null"
    go (CLet (nam,typ) val bod) = do
      let uid = nameToJS nam ++ "$" ++ show dep
      valStmt <- ctToJS False uid val dep
      bodStmt <- ctToJS tail var (bod (CVar uid dep)) (dep + 1)
      return $ concat [valStmt, bodStmt]
    go (CNum val) =
      set var $ show val ++ "n"
    go (CFlt val) =
      set var $ show val

    go (COp2 typ opr fst snd) = do
      let opr' = operToJS opr
      fstName <- fresh
      sndName <- fresh
      fstStmt <- ctToJS False fstName fst dep
      sndStmt <- ctToJS False sndName snd dep


      let retExpr = case typ of
            CF64 -> concat [fstName, " ", opr', " ", sndName]
            CU64 -> concat ["BigInt.asUintN(64, ", fstName, " ", opr', " ", sndName, ")"]
            _ -> error ("Invalid type for binary operation: " ++ showCT typ dep)
              
      retStmt <- set var retExpr
      return $ concat [fstStmt, sndStmt, retStmt]
    go (CLog msg nxt) = do
      msgName <- fresh
      msgStmt <- ctToJS False msgName msg dep
      nxtName <- fresh
      nxtStmt <- ctToJS tail nxtName nxt dep
      retStmt <- set var $ concat ["(console.log(LIST_TO_JSTR(", msgName, ")), ", nxtName, ")"]
      return $ concat [msgStmt, nxtStmt, retStmt]
    go (CVar nam _) =
      set var nam
    go (CTxt txt) =
      set var $ "JSTR_TO_LIST(`" ++ txt ++ "`)"
    go (CLst lst) =
      let cons = \x acc -> CCon "Cons" [("head", x), ("tail", acc)]
          nil  = CCon "Nil" []
      in  ctToJS False var (foldr cons nil lst) dep
    go (CNat val) =
      let succ = \x -> CCon "Succ" [("pred", x)]
          zero = CCon "Zero" []
      in  ctToJS False var (foldr (\_ acc -> succ acc) zero [1..val]) dep

prelude :: String
prelude = unlines [
  "import { readFileSync } from 'fs';",
  "import { execSync } from 'child_process';",
  "",
  "function LIST_TO_JSTR(list) {",
  "  try {",
  "    let result = '';",
  "    let current = list;",
  "    while (current.$ === 'Cons') {",
  "      result += String.fromCodePoint(Number(current.head));",
  "      current = current.tail;",
  "    }",
  "    if (current.$ === 'Nil') {",
  "      return result;",
  "    }",
  "  } catch (e) {}",
  "  return list;",
  "}",
  "",
  "function JSTR_TO_LIST(str) {",
  "  let list = {$: 'Nil'};",
  "  for (let i = str.length - 1; i >= 0; i--) {",
  "    list = {$: 'Cons', head: BigInt(str.charCodeAt(i)), tail: list};",
  "  }",
  "  return list;",
  "}",
  "",
  "function LIST_TO_JARRAY(list, decode) {",
  "  try {",
  "    let result = [];",
  "    let current = list;",
  "    while (current.$ === 'Cons') {",
  "      result += decode(current.head);",
  "      current = current.tail;",
  "    }",
  "    if (current.$ === 'Nil') {",
  "      return result;",
  "    }",
  "  } catch (e) {}",
  "  return list;",
  "}",
  "",
  "function JARRAY_TO_LIST(inp, encode) {",
  "  let out = {$: 'Nil'};",
  "  for (let i = inp.length - 1; i >= 0; i--) {",
  "    out = {$: 'Cons', head: encode(inp[i]), tail: out};",
  "  }",
  "  return out;",
  "}",
  "",
  "let MEMORY = new Map();",
  "function SWAP(key, val) {",
  "  var old = MEMORY.get(key) || 0n;",
  "  MEMORY.set(key, val);",
  "  return old;",
  "}"
  ]

generateJS :: CTBook -> (String, CT) -> String
generateJS book (name, ct) = ST.evalState (fnToJS book name ct) 0 ++ "\n\n"

defToCT :: Book -> (String, Term) -> (String, CT)
defToCT book (name, term) =
  case envRun (doAnnotate term) book of
    Done _ (term, fill) -> (name, termToCT book fill term Nothing 0)
    Fail _              -> error $ "COMPILATION_ERROR: " ++ name ++ " is ill-typed"

compileJS :: Book -> String
compileJS book =
  let ctDefs0 = flip map (topoSortBook book) (defToCT book)
      ctDefs1 = flip map ctDefs0 $ \ (nm,ct) -> (nm, removeUnreachables ct)
      ctDefs2 = flip map ctDefs1 $ \ (nm,ct) -> (nm, inline (M.fromList ctDefs1) ct)
      ctDefs3 = flip map ctDefs2 $ \ (nm,ct) -> (nm, liftLambdas ct 0)
      jsFns   = concatMap (generateJS (M.fromList ctDefs3)) ctDefs3
      exports = "export { " ++ intercalate ", " (getFunctionNames jsFns) ++ " }" 
      debug   = trace ("\nCompiled CTs:\n" ++ unlines (map (\(n,c) -> "- " ++ n ++ ":\n" ++ showCT c 0) ctDefs3))
  in prelude ++ "\n\n" ++ jsFns ++ "\n" ++ exports

-- Utils
-- -----

bindCT :: CT -> [(String,CT)] -> CT
bindCT CNul ctx = CNul
bindCT CSet ctx = CSet
bindCT CU64 ctx = CU64
bindCT CF64 ctx = CF64
bindCT (CADT cts) ctx =
  let cts' = map (\ (n,fs) -> (n, map (\ (fn,ft) -> (fn, bindCT ft ctx)) fs)) cts in
  CADT cts'
bindCT (CMap typ) ctx =
  CMap (bindCT typ ctx)
bindCT (CAll (nam,inp) bod) ctx =
  let inp' = bindCT inp ctx in
  let bod' = \x -> bindCT (bod (CVar nam 0)) ((nam, x) : ctx) in
  CAll (nam,inp') bod'
bindCT (CLam (nam,inp) bod) ctx =
  let inp' = bindCT inp ctx in
  let bod' = \x -> bindCT (bod (CVar nam 0)) ((nam, x) : ctx) in
  CLam (nam,inp') bod'
bindCT (CApp fun arg) ctx =
  let fun' = bindCT fun ctx in
  let arg' = bindCT arg ctx in
  CApp fun' arg'
bindCT (CCon nam arg) ctx =
  let arg' = map (\(f, x) -> (f, bindCT x ctx)) arg in
  CCon nam arg'
bindCT (CMat val cse) ctx =
  let val' = bindCT val ctx in
  let cse' = map (\(cn,fs,cb) -> (cn, fs, bindCT cb ctx)) cse in
  CMat val' cse'
bindCT (CRef nam) ctx =
  case lookup nam ctx of
    Just x  -> x
    Nothing -> CRef nam
bindCT (CHol nam) ctx =
  CHol nam
bindCT (CLet (nam,typ) val bod) ctx =
  let typ' = bindCT typ ctx in
  let val' = bindCT val ctx in
  let bod' = \x -> bindCT (bod (CVar nam 0)) ((nam, x) : ctx) in
  CLet (nam,typ') val' bod'
bindCT (CNum val) ctx = CNum val
bindCT (CFlt val) ctx = CFlt val
bindCT (COp2 typ opr fst snd) ctx =
  let fst' = bindCT fst ctx in
  let snd' = bindCT snd ctx in
  let typ' = bindCT typ ctx in
  COp2 typ' opr fst' snd'
bindCT (CSwi val zer suc) ctx =
  let val' = bindCT val ctx in
  let zer' = bindCT zer ctx in
  let suc' = bindCT suc ctx in
  CSwi val' zer' suc'
bindCT (CKVs kvs def) ctx =
  let kvs' = IM.map (\v -> bindCT v ctx) kvs in
  let def' = bindCT def ctx in
  CKVs kvs' def'
bindCT (CGet got nam map key bod) ctx =
  let map' = bindCT map ctx in
  let key' = bindCT key ctx in
  let bod' = \x y -> bindCT (bod (CVar got 0) (CVar nam 0)) ((nam, y) : (got, x) : ctx) in
  CGet got nam map' key' bod'
bindCT (CPut got nam map key val bod) ctx =
  let map' = bindCT map ctx in
  let key' = bindCT key ctx in
  let val' = bindCT val ctx in
  let bod' = \x y -> bindCT (bod (CVar got 0) (CVar nam 0)) ((nam, y) : (got, x) : ctx) in
  CPut got nam map' key' val' bod'
bindCT (CLog msg nxt) ctx =
  let msg' = bindCT msg ctx in
  let nxt' = bindCT nxt ctx in
  CLog msg' nxt'
bindCT (CVar nam idx) ctx =
  case lookup nam ctx of
    Just x  -> x
    Nothing -> CVar nam idx
bindCT (CTxt txt) ctx = CTxt txt
bindCT (CLst lst) ctx =
  let lst' = map (\x -> bindCT x ctx) lst in
  CLst lst'
bindCT (CNat val) ctx = CNat val

rnCT :: CT -> [(String,CT)] -> CT
rnCT CNul ctx = CNul
rnCT CSet ctx = CSet
rnCT CU64 ctx = CU64
rnCT CF64 ctx = CF64
rnCT (CADT cts) ctx =
  let cts' = map (\ (n,fs) -> (n, map (\ (fn,ft) -> (fn, rnCT ft ctx)) fs)) cts in
  CADT cts'
rnCT (CMap typ) ctx =
  let typ' = rnCT typ ctx
  in (CMap typ')
rnCT (CAll (nam,inp) bod) ctx =
  let nam' = "x" ++ show (length ctx) in
  let inp' = rnCT inp ctx in
  let bod' = \x -> rnCT (bod (CVar nam' 0)) ((nam', x) : ctx) in
  CAll (nam',inp') bod'
rnCT (CLam (nam,inp) bod) ctx =
  let nam' = "x" ++ show (length ctx) in
  let inp' = rnCT inp ctx in
  let bod' = \x -> rnCT (bod (CVar nam' 0)) ((nam', x) : ctx) in
  CLam (nam',inp') bod'
rnCT (CApp fun arg) ctx =
  let fun' = rnCT fun ctx in
  let arg' = rnCT arg ctx in
  CApp fun' arg'
rnCT (CCon nam arg) ctx =
  let arg' = map (\(f, x) -> (f, rnCT x ctx)) arg in
  CCon nam arg'
rnCT (CMat val cse) ctx =
  let val' = rnCT val ctx in
  let cse' = map (\(cn,fs,cb) -> (cn, fs, rnCT cb ctx)) cse in
  CMat val' cse'
rnCT (CRef nam) ctx =
  case lookup nam ctx of
    Just x  -> x
    Nothing -> CRef nam
rnCT (CLet (nam,typ) val bod) ctx =
  let typ' = rnCT typ ctx in
  let val' = rnCT val ctx in
  let bod' = \x -> rnCT (bod (CVar nam 0)) ((nam, x) : ctx) in
  CLet (nam,typ') val' bod'
rnCT (CNum val) ctx = CNum val
rnCT (CFlt val) ctx = CFlt val
rnCT (COp2 typ opr fst snd) ctx =
  let fst' = rnCT fst ctx in
  let snd' = rnCT snd ctx in
  let typ' = rnCT typ ctx in
  COp2 typ' opr fst' snd'
rnCT (CSwi val zer suc) ctx =
  let val' = rnCT val ctx in
  let zer' = rnCT zer ctx in
  let suc' = rnCT suc ctx in
  CSwi val' zer' suc'
rnCT (CKVs kvs def) ctx =
  let kvs' = IM.map (\v -> rnCT v ctx) kvs in
  let def' = rnCT def ctx in
  CKVs kvs' def'
rnCT (CGet got nam map key bod) ctx =
  let map' = rnCT map ctx in
  let key' = rnCT key ctx in
  let bod' = \x y -> rnCT (bod (CVar got 0) (CVar nam 0)) ((got, x) : (nam, y) : ctx) in
  CGet got nam map' key' bod'
rnCT (CPut got nam map key val bod) ctx =
  let map' = rnCT map ctx in
  let key' = rnCT key ctx in
  let val' = rnCT val ctx in
  let bod' = \x y -> rnCT (bod (CVar got 0) (CVar nam 0)) ((got, x) : (nam, y) : ctx) in
  CPut got nam map' key' val' bod'
rnCT (CLog msg nxt) ctx =
  let msg' = rnCT msg ctx in
  let nxt' = rnCT nxt ctx in
  CLog msg' nxt'
rnCT (CVar nam idx) ctx =
  case lookup nam ctx of
    Just x  -> x
    Nothing -> CVar nam idx
rnCT (CTxt txt) ctx = CTxt txt
rnCT (CLst lst) ctx =
  let lst' = map (\x -> rnCT x ctx) lst in
  CLst lst'
rnCT (CNat val) ctx = CNat val

getAppChain :: CT -> (CT, [CT])
getAppChain (CApp fun arg) =
  let (f, args) = getAppChain fun
  in (f, args ++ [arg])
getAppChain term = (term, [])

isNul :: CT -> Bool
isNul CNul = True
isNul _    = False

getFunctionNames :: String -> [String]
getFunctionNames js = 
  [ name | line <- lines js,
           "const " `isPrefixOf` line,
           let parts = words line,
           length parts >= 2,
           let name = head $ words $ parts !! 1,
           not $ "$" `isSuffixOf` name  -- Skip internal functions ending with $
  ]

-- Stringification
-- ---------------

-- TODO: implement a showCT :: CT -> String function
showCT :: CT -> Int -> String
showCT CNul                     dep = "*"
showCT CSet                     dep = "Set"
showCT CU64                     dep = "U64"
showCT CF64                     dep = "F64"
showCT (CADT cts)               dep = "data{" ++ concatMap (\ (n,fs) -> "#" ++ n ++ " " ++ concatMap (\ (fn,ft) -> fn ++ ":" ++ showCT ft dep ++ " ") fs) cts ++ "}"
showCT (CMap typ)               dep = "(Map " ++ showCT typ dep ++ ")"
showCT (CLam (nam,inp) bod)     dep = "λ(" ++ nam ++ ": " ++ showCT inp dep ++ "). " ++ showCT (bod (CVar nam dep)) (dep+1)
showCT (CAll (nam,inp) bod)     dep = "∀(" ++ nam ++ ": " ++ showCT inp dep ++ "). " ++ showCT (bod (CVar nam dep)) (dep+1)
showCT (CApp fun arg)           dep = "(" ++ showCT fun dep ++ " " ++ showCT arg dep ++ ")"
showCT (CCon nam fields)        dep = "#" ++ nam ++ "{" ++ concatMap (\ (f,v) -> f ++ ":" ++ showCT v dep ++ " ") fields ++ "}"
showCT (CMat val cses)          dep = "match " ++ showCT val dep ++ " {" ++ concatMap (\(cn,fs,cb) -> "#" ++ cn ++ ":" ++ showCT cb dep ++ " ") cses ++ "}"
showCT (CRef nam)               dep = nam
showCT (CHol nam)               dep = nam
showCT (CLet (nam,typ) val bod) dep = "let " ++ nam ++ " : " ++ showCT typ dep ++ " = " ++ showCT val dep ++ "; " ++ showCT (bod (CVar nam dep)) (dep+1)
showCT (CNum val)               dep = show val
showCT (CFlt val)               dep = show val
showCT (COp2 typ opr fst snd)   dep = "(<op> " ++ showCT fst dep ++ " " ++ showCT snd dep ++ ")"
showCT (CSwi val zer suc)       dep = "switch " ++ showCT val dep ++ " {0:" ++ showCT zer dep ++ " _: " ++ showCT suc dep ++ "}"
showCT (CKVs kvs def)           dep = "{" ++ unwords (map (\(k,v) -> show k ++ ":" ++ showCT v dep) (IM.toList kvs)) ++ " | " ++ showCT def dep ++ "}"
showCT (CGet g n m k b)         dep = "get " ++ g ++ " = " ++ n ++ "@" ++ showCT m dep ++ "[" ++ showCT k dep ++ "] " ++ showCT (b (CVar g dep) (CVar n dep)) (dep+2)
showCT (CPut g n m k v b)       dep = "put " ++ g ++ " = " ++ n ++ "@" ++ showCT m dep ++ "[" ++ showCT k dep ++ "] := " ++ showCT v dep ++ " " ++ showCT (b (CVar g dep) (CVar n dep)) (dep+2)
showCT (CLog msg nxt)           dep = "log(" ++ showCT msg dep ++ "," ++ showCT nxt dep ++ ")"
showCT (CVar nam dep)           _   = nam ++ "^" ++ show dep
showCT (CTxt txt)               dep = show txt
showCT (CLst lst)               dep = "[" ++ unwords (map (\x -> showCT x dep) lst) ++ "]"
showCT (CNat val)               dep = show val
