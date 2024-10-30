-- Checker:
-- //./Type.hs//

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
import Data.List (intercalate, isSuffixOf, elem)
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

-- Compilable Term
data CT
  = CNul
  | CLam String (CT -> CT)
  | CApp CT CT
  | CCon String [(String, CT)]
  | CMat CT [(String, [String], CT)]
  | CRef String
  | CHol String
  | CLet String CT (CT -> CT)
  | CNum Word64
  | CFlt Double
  | COp2 Oper CT CT
  | CSwi CT CT CT
  | CLog CT CT
  | CVar String Int
  | CTxt String
  | CLst [CT]
  | CNat Integer
  | CSub CT

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

    go (Lam nam bod) =
      let bod' = \x -> t2ct (bod (Var nam dep)) Nothing (dep+1)
      in CLam nam bod'
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
    go (ADT _ _ _) =
      CNul
    go (Con nam arg) =
      case lookup nam (getADTCts (reduce book fill 2 (fromJust typx))) of
        Just (Ctr _ tele) ->
          let fNames = getTeleNames tele dep []
              fields = map (\ (f,t) -> (f, t2ct t Nothing dep)) $ zip fNames (map snd arg)
          in CCon nam fields
        Nothing -> error $ "constructor-not-found:" ++ nam
    go (Mat cse) =
      if isJust typx then
        case reduce book fill 2 (fromJust typx) of
          (All _ adt _) ->
            let adt' = reduce book fill 2 adt
                cts  = getADTCts adt'
                cses = map (\ (cnam, cbod) ->
                  if cnam == "_" then
                    (cnam, ["_"], t2ct cbod Nothing dep)
                  else case lookup cnam cts of
                    Just (Ctr _ tele) ->
                      let fNames = getTeleNames tele dep []
                      in (cnam, fNames, t2ct cbod Nothing dep)
                    Nothing -> error $ "constructor-not-found:" ++ cnam) cse
            in CLam ("__" ++ show dep) $ \x -> CMat x cses
          otherwise -> error "match-without-type"
      else
        error "err"
    go (Swi zer suc) =
      let zer' = t2ct zer Nothing dep
          suc' = t2ct suc Nothing dep
      in CLam ("__" ++ show dep) $ \x -> CSwi x zer' suc'
    go (All _ _ _) =
      CNul
    go (Ref nam) =
      CRef nam
    go (Let nam val bod) =
      let val' = t2ct val Nothing dep
          bod' = \x -> t2ct (bod (Var nam dep)) Nothing (dep+1)
      in CLet nam val' bod'
    go (Use nam val bod) =
      t2ct (bod val) typx dep
    go Set =
      CNul
    go U64 =
      CNul
    go F64 =
      CNul
    go (Num val) =
      CNum val
    go (Flt val) =
      CFlt val
    go (Op2 opr fst snd) =
      let fst' = t2ct fst Nothing dep
          snd' = t2ct snd Nothing dep
      in COp2 opr fst' snd'
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
  go (CMat val cse) =
    let val' = go val
        cse' = filter (\(_,_,t) -> not (isNul t)) cse
    in CMat val' cse'
  go (CLam nam bod) =
    let bod' = \x -> go (bod x)
    in CLam nam bod'
  go (CApp fun arg) =
    let fun' = go fun
        arg' = go arg
    in CApp fun' arg'
  go (CCon nam fields) =
    let fields' = map (\(f,t) -> (f, go t)) fields
    in CCon nam fields'
  go (CRef nam) = CRef nam
  go (CHol nam) = CHol nam
  go (CLet nam val bod) =
    let val' = go val
        bod' = \x -> go (bod x)
    in CLet nam val' bod'
  go (CNum val) =
    CNum val
  go (CFlt val) =
    CFlt val
  go (COp2 opr fst snd) =
    let fst' = go fst
        snd' = go snd
    in COp2 opr fst' snd'
  go (CSwi val zer suc) =
    let val' = go val
        zer' = go zer
        suc' = go suc
    in CSwi val' zer' suc'
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
  go CNul =
    CNul

-- Lifts shareable lambdas across branches:
-- - from: λx       match v { #Foo{a b}: λy λz A #Bar: λy λz B ... }
-- -   to: λx λy λz match v { #Foo{a b}:       A #Bar:       B ... }
-- TODO: document why this is (and has to be) terrible
liftLambdas :: [String] -> CT -> Int -> CT
liftLambdas nms ct depth = gen (liftLen ct depth 0 0) [] ct depth where

  gen :: Int -> [CT] -> CT -> Int -> CT
  gen 0 ctx ct dep = liftVal ctx ct dep 0 0
  gen n ctx ct dep = CLam (nam dep) (\x -> gen (n-1) (ctx++[x]) ct (dep+1))

  nam :: Int -> String
  nam d | d < length nms = nms !! d ++ "$" ++ show d
  nam d | otherwise      = "_"      ++ "$" ++ show d

  var :: [CT] -> Int -> CT
  var ctx d | d < length ctx = ctx !! d
  var ctx d | otherwise      = CNul

  liftVal :: [CT] -> CT -> Int -> Int -> Int -> CT
  liftVal ctx ct dep lifts skip = go ct dep lifts skip where
    go (CLam nam bod)     dep lifts 0    = liftVal ctx (bod (var ctx lifts)) (dep+1) (lifts+1) 0
    go (CLam nam bod)     dep lifts skip = CLam nam     $ \x -> liftVal ctx (bod x) (dep+1) lifts (skip-1)
    go (CLet nam val bod) dep lifts skip = CLet nam val $ \x -> liftVal ctx (bod x) (dep+1) lifts skip
    go ct@(CMat val cse)  dep lifts skip | length cse > 0 =
      let recsV = flip map cse $ \ (_,f,b) -> liftVal ctx (liftLambdas f b dep) dep lifts (skip + length f)
          recsL = flip map cse $ \ (_,f,b) -> liftLen     (liftLambdas f b dep) dep lifts (skip + length f)
          valid = flip all recsL $ \ a -> a == head recsL
      in if valid then CMat val (zipWith (\ (n,f,_) b -> (n,f,b)) cse recsV) else ct
    go ct@(CSwi val zer suc) dep lifts skip =
      let recZL = liftLen     (liftLambdas []    zer dep) dep lifts skip
          recZV = liftVal ctx (liftLambdas []    zer dep) dep lifts skip
          recSL = liftLen     (liftLambdas ["p"] suc dep) dep lifts (skip + 1)
          recSV = liftVal ctx (liftLambdas ["p"] suc dep) dep lifts (skip + 1)
          valid = recZL == recSL
      in if valid then CSwi val recZV recSV else ct
    go ct dep lifts s = ct

  liftLen :: CT -> Int -> Int -> Int -> Int
  liftLen ct dep lifts skip = go ct dep lifts skip where
    go (CLam nam bod)     dep lifts 0    = liftLen (bod CNul) (dep+1) (lifts+1) 0
    go (CLam nam bod)     dep lifts skip = liftLen (bod CNul) (dep+1) lifts (skip-1)
    go (CLet nam val bod) dep lifts skip = liftLen (bod CNul) (dep+1) lifts skip
    go (CMat val cse)     dep lifts skip | length cse > 0 =
      let recsL = flip map cse $ \ (_,f,b) -> liftLen (liftLambdas f b dep) dep lifts (skip + length f)
          valid = flip all recsL $ \ a -> a == head recsL
      in if valid then head recsL else lifts
    go (CSwi val zer suc) dep lifts skip =
      let recZL = liftLen (liftLambdas []    zer dep) dep lifts skip
          recSL = liftLen (liftLambdas ["p"] suc dep) dep lifts (skip + 1)
          valid = recZL == recSL
      in if valid then recZL else lifts
    go ct dep lifts s = lifts

-- JavaScript Codegen
-- ------------------

getArguments :: CT -> ([String], CT)
getArguments term = go term 0 where
  go (CLam nam bod) dep =
    let (args, body) = go (bod (CVar nam dep)) (dep+1)
    in (nam:args, body)
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

-- Converts a function to JavaScript
fnToJS :: CTBook -> String -> CT -> ST.State Int String
fnToJS book fnName (getArguments -> (fnArgs, fnBody)) = do

  -- Compiles the top-level function to JS
  bodyName <- fresh
  bodyStmt <- ctToJS True (Just bodyName) fnBody 0 
  let wrapArgs cur args fnBody
        | null args = concat ["(() => ", fnBody, ")()"]
        | otherwise = if cur
            then concat [intercalate " => " args, " => ", fnBody]
            else concat ["(", intercalate "," args, ") => ", fnBody]
  let uncBody = concat ["{ while (1) { ", bodyStmt, "return ", bodyName, "; } }"]
  let curBody = nameToJS fnName ++ "$" ++ (if null fnArgs then "" else "(" ++ intercalate "," fnArgs ++ ")")
  let uncFunc = concat ["const ", nameToJS fnName, "$ = ", wrapArgs False fnArgs uncBody]
  let curFunc = concat ["const ", nameToJS fnName, " = ", wrapArgs True fnArgs curBody]
  return $ uncFunc ++ "\n" ++ curFunc

  where

  -- Inliner
  red :: CT -> CT
  red tm = trace ("red " ++ showCT tm 0) $ go tm where
    go (CApp fun arg) = app (red fun) arg
    go (CRef nam)     = ref nam    
    go val            = val

  -- Inliner APP
  app :: CT -> CT -> CT
  app (CLam nam bod) arg = red (bod (red arg))
  app fun            arg = CApp fun arg

  -- Inliner REF
  -- NOTE: this should only inline refs ending with "bind", "bind/go" or "pure".
  -- create an aux function called "inl :: String -> Bool" after it
  ref :: String -> CT
  ref nam
    | inl nam   = trace ("inlined:"++nam) $ red (fromJust (M.lookup nam book))
    | otherwise = CRef nam

  inl :: String -> Bool
  -- inl nam = False
  inl nam = any (`isSuffixOf` nam)
    [ "/bind"
    , "/bind/go"
    , "/pure"
    , "IO/print"
    , "IO/prompt"
    , "IO/swap"
    ]

  -- Genreates a fresh name
  fresh :: ST.State Int String
  fresh = do
    n <- ST.get
    ST.put (n + 1)
    return $ "$x" ++ show n

  -- Assigns an expression to a name, or return it directly
  ret :: Maybe String -> String -> ST.State Int String
  ret (Just name) expr = return $ "var " ++ name ++ " = " ++ expr ++ ";"
  ret Nothing     expr = return $ expr

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

  -- Compiles a CT to JS
  ctToJS :: Bool -> Maybe String -> CT -> Int -> ST.State Int String
  ctToJS tail var term dep = go (red term) where
    go CNul =
      ret var "null"
    go tm@(CLam nam bod) = do
      let (names, bodyTerm, _) = lams tm dep []
      bodyName <- fresh
      bodyStmt <- ctToJS False (Just bodyName) bodyTerm (dep + length names)
      ret var $ concat ["(", intercalate " => " names, " => {", bodyStmt, "return ", bodyName, ";})"]
      where
        lams :: CT -> Int -> [String] -> ([String], CT, Maybe Term)
        lams (CLam n b) dep names =
          let uid = nameToJS n ++ "$" ++ show dep
          in lams (b (CVar uid dep)) (dep + 1) (uid : names)
        lams term       dep names = (reverse names, term, Nothing)
    go app@(CApp fun arg) = do
      let (appFun, appArgs) = getAppChain app
      -- Tail Recursive Call
      if tail && isRecCall fnName (length fnArgs) appFun appArgs then do
        -- TODO: here, we will mutably set the function's arguments with the new argList values, and 'continue'
        -- TODO: AI generated, review
        argDefs <- forM (zip fnArgs appArgs) $ \(paramName, appArgs) -> do
          argName <- fresh
          argStmt <- ctToJS False (Just argName) appArgs dep
          return (argStmt, paramName ++ " = " ++ argName ++ ";")
        let (argStmts, paramDefs) = unzip argDefs
        return $ concat argStmts ++ concat paramDefs ++ " continue;"
      -- Saturated Call Optimization
      else if isSatCall book appFun appArgs then do
        let (CRef funName) = appFun
        argExprs <- mapM (\arg -> ctToJS False Nothing arg dep) appArgs
        ret var $ concat [nameToJS funName, "$(", intercalate ", " argExprs, ")"]
      -- IO Actions
      else if isEffCall book appFun appArgs then do
        let (CHol name) = appFun
        case name of
          "IO_BIND" -> do
            let [_, _, call, cont] = appArgs
            callName <- fresh
            callStmt <- ctToJS False (Just callName) call dep
            contStmt <- ctToJS False var (CApp cont (CVar callName dep)) dep
            return $ concat [callStmt, contStmt]
          "IO_PURE" -> do
            let [_, value] = appArgs
            valueStmt <- ctToJS False var value dep
            return $ valueStmt
          "IO_SWAP" -> do
            let [key, val] = appArgs
            keyName  <- fresh
            keyStmt  <- ctToJS False (Just keyName) key dep
            valName  <- fresh
            valStmt  <- ctToJS False (Just valName) val dep
            resName  <- fresh
            resStmt  <- return $ concat ["var ", resName, " = SWAP(", keyName, ", ", valName, ");"]
            doneStmt <- ctToJS False var (CVar resName 0) dep
            return $ concat [keyStmt, valStmt, resStmt, doneStmt]
          "IO_PRINT" -> do
            let [text] = appArgs
            textName <- fresh
            textStmt <- ctToJS False (Just textName) text dep
            doneStmt <- ctToJS False var (CCon "Unit" []) dep 
            return $ concat [textStmt, "console.log(LIST_TO_JSTR(", textName, "));", doneStmt]
          "IO_PROMPT" -> do
            error $ "TODO"
          _ -> error $ "Unknown IO operation: " ++ name
      -- Normal Application
      else do
        funExpr <- ctToJS False Nothing fun dep
        argExpr <- ctToJS False Nothing arg dep
        ret var $ concat ["(", funExpr, ")(", argExpr, ")"]
    go (CCon nam fields) = do
      fieldExprs <- forM fields $ \ (fname, fterm) -> do
        expr <- ctToJS False Nothing fterm dep
        return (fname, expr)
      let fields' = concatMap (\ (fname, expr) -> ", " ++ fname ++ ": " ++ expr) fieldExprs
      ret var $ concat ["({$: \"", nam, "\"", fields', "})"]
    go (CMat val cses) = do
      valName <- fresh
      valStmt <- ctToJS False (Just valName) val dep
      retName <- case var of
        Just var -> return var
        Nothing  -> fresh
      cases <- forM cses $ \ (cnam, fields, cbod) ->
        if cnam == "_" then do
          retStmt <- ctToJS tail (Just retName) (CApp cbod (CVar valName 0)) dep
          return $ concat ["default: { " ++ retStmt, " break; }"]
        else do
          let bod = foldl CApp cbod (map (\f -> (CVar (valName++"."++f) 0)) fields)
          retStmt <- ctToJS tail (Just retName) bod dep
          return $ concat ["case \"", cnam, "\": { ", retStmt, " break; }"]
      let switch = concat [valStmt, "switch (", valName, ".$) { ", unwords cases, " }"]
      case var of
        Just var -> return $ switch
        Nothing  -> ret var $ concat ["(() => { var ", retName, ";", switch, " return ", retName, " })()"]
    go (CSwi val zer suc) = do
      valName <- fresh
      valStmt <- ctToJS False (Just valName) val dep
      retName <- case var of
        Just var -> return var
        Nothing  -> fresh
      zerStmt <- ctToJS tail (Just retName) zer dep
      sucStmt <- ctToJS tail (Just retName) (CApp suc (COp2 SUB (CVar valName 0) (CNum 1))) dep
      let ifelse = concat [valStmt, "if (", valName, " === 0n) { ", zerStmt, " } else { ", sucStmt, " }"]
      case var of
        Just var -> return $ ifelse
        Nothing  -> ret var $ concat ["(() => { var ", retName, ";", ifelse, " return ", retName, " })()"]
    go (CRef nam) =
      ret var $ nameToJS nam
    go (CHol nam) =
      ret var $ "null"
    go (CLet nam val bod) =
      case var of
        Just var -> do
          let uid = nameToJS nam ++ "$" ++ show dep
          valExpr <- ctToJS False (Just uid) val dep
          bodExpr <- ctToJS tail (Just var) (bod (CVar uid dep)) (dep + 1)
          return $ concat [valExpr, bodExpr]
        Nothing -> do
          let uid = nameToJS nam ++ "$" ++ show dep
          valExpr <- ctToJS False (Just uid) val dep
          bodExpr <- ctToJS tail Nothing (bod (CVar uid dep)) (dep + 1)
          return $ concat ["(() => {", valExpr, "return ", bodExpr, ";})()"]
    go (CNum val) =
      ret var $ show val ++ "n"
    go (CFlt val) =
      ret var $ show val
    go (COp2 opr fst snd) = do
      let opr' = operToJS opr
      fstExpr <- ctToJS False Nothing fst dep
      sndExpr <- ctToJS False Nothing snd dep
      ret var $ concat ["BigInt.asUintN(64, ", fstExpr, " ", opr', " ", sndExpr, ")"]
    go (CLog msg nxt) = do
      msgExpr <- ctToJS False Nothing msg dep
      nxtExpr <- ctToJS tail Nothing nxt dep
      ret var $ concat ["(console.log(LIST_TO_JSTR(", msgExpr, ")), ", nxtExpr, ")"]
    go (CVar nam _) =
      ret var nam
    go (CTxt txt) =
      ret var $ "JSTR_TO_LIST(`" ++ txt ++ "`)"
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
  "let MEMORY = new Map();",
  "function SWAP(key, val) {",
  "  var old = MEMORY.get(key) || 0n;",
  "  MEMORY.set(key, val);",
  "  return old;",
  "}"
  ]

compileTerm :: Book -> (String, Term) -> (String, CT)
compileTerm book (name, term) =
  case envRun (doAnnotate term) book of
    Done _ (term, fill) ->
      let tm  = bind term []
          arg = getArgNames tm
          ct0 = termToCT book fill tm Nothing 0
          ct1 = removeUnreachables ct0
          ct2 = liftLambdas arg ct1 0
          -- dbg = trace ("~" ++ showCT ct0 0 ++ "\n~" ++ showCT (rnCT ct0 []) 0 ++ "\n~" ++ showCT ct2 0 ++ "\n")
          dbg = id
      in dbg (name, ct2)
    Fail _ ->
      error $ "COMPILATION_ERROR: " ++ name ++ " isn't well-typed."

generateJS :: CTBook -> (String, CT) -> String
generateJS book (name, ct) = ST.evalState (fnToJS book name ct) 0 ++ "\n\n"

compileJS :: Book -> String
compileJS book =
  let ctDefs  = map (compileTerm book) (topoSortBook book)
      ctBook  = M.fromList ctDefs
      jsFns   = concatMap (generateJS ctBook) ctDefs
  in prelude ++ "\n\n" ++ jsFns

-- Utils
-- -----

bindCT :: CT -> [(String,CT)] -> CT
bindCT CNul ctx = CNul
bindCT (CLam nam bod) ctx =
  let bod' = \x -> bindCT (bod (CVar nam 0)) ((nam, x) : ctx) in
  CLam nam bod'
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
bindCT (CLet nam val bod) ctx =
  let val' = bindCT val ctx in
  let bod' = \x -> bindCT (bod (CVar nam 0)) ((nam, x) : ctx) in
  CLet nam val' bod'
bindCT (CNum val) ctx = CNum val
bindCT (CFlt val) ctx = CFlt val
bindCT (COp2 opr fst snd) ctx =
  let fst' = bindCT fst ctx in
  let snd' = bindCT snd ctx in
  COp2 opr fst' snd'
bindCT (CSwi val zer suc) ctx =
  let val' = bindCT val ctx in
  let zer' = bindCT zer ctx in
  let suc' = bindCT suc ctx in
  CSwi val' zer' suc'
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
rnCT (CLam nam bod) ctx =
  let nam' = "x" ++ show (length ctx) in
  let bod' = \x -> rnCT (bod (CVar nam' 0)) ((nam', x) : ctx) in
  CLam nam' bod'
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
rnCT (CRef nam) ctx =
  CHol nam
rnCT (CLet nam val bod) ctx =
  let val' = rnCT val ctx in
  let bod' = \x -> rnCT (bod (CVar nam 0)) ((nam, x) : ctx) in
  CLet nam val' bod'
rnCT (CNum val) ctx = CNum val
rnCT (CFlt val) ctx = CFlt val
rnCT (COp2 opr fst snd) ctx =
  let fst' = rnCT fst ctx in
  let snd' = rnCT snd ctx in
  COp2 opr fst' snd'
rnCT (CSwi val zer suc) ctx =
  let val' = rnCT val ctx in
  let zer' = rnCT zer ctx in
  let suc' = rnCT suc ctx in
  CSwi val' zer' suc'
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

-- substCT :: Bool -> Int -> CT -> CT -> CT
-- substCT dry lvl neo term =
  -- let result = go term
  -- in  (if dry then id else trace ("SUBST-OLD: " ++ show lvl ++ " " ++ showCT term lvl ++ "\nSUBST-NEW: " ++ show lvl ++ " " ++ showCT result lvl)) $
      -- result

  -- where
  -- go (CLam nam bod)     = CLam nam (\x -> go (bod (CSub x)))
  -- go (CApp fun arg)     = CApp (go fun) (go arg)
  -- go (CCon nam fields)  = CCon nam (map (\(f,t) -> (f,go t)) fields)
  -- go (CMat val cses)    = CMat (go val) (map (\(n,f,b) -> (n,f,go b)) cses)
  -- go (CRef nam)         = CRef nam
  -- go (CLet nam val bod) = CLet nam (go val) (\x -> go (bod (CSub x)))
  -- go (CNum n)           = CNum n
  -- go (CFlt n)           = CFlt n
  -- go (COp2 opr fst snd) = COp2 opr (go fst) (go snd)
  -- go (CSwi val zer suc) = CSwi (go val) (go zer) (go suc)
  -- go (CLog msg nxt)     = CLog (go msg) (go nxt)
  -- go (CVar nam idx)     = if lvl == idx then neo else CVar nam idx
  -- go (CTxt txt)         = CTxt txt
  -- go (CLst lst)         = CLst (map go lst)
  -- go (CNat val)         = CNat val
  -- go CNul               = CNul
  -- go (CSub val)         = val

getAppChain :: CT -> (CT, [CT])
getAppChain (CApp fun arg) =
  let (f, args) = getAppChain fun
  in (f, args ++ [arg])
getAppChain term = (term, [])

isNul :: CT -> Bool
isNul CNul = True
isNul _    = False

-- Stringification
-- ---------------

-- TODO: implement a showCT :: CT -> String function
showCT :: CT -> Int -> String
showCT CNul               dep = "*"
showCT (CLam nam bod)     dep = "λ" ++ nam ++ " " ++ showCT (bod (CVar nam dep)) (dep+1)
showCT (CApp fun arg)     dep = "(" ++ showCT fun dep ++ " " ++ showCT arg dep ++ ")"
showCT (CCon nam fields)  dep = "#" ++ nam ++ "{" ++ concatMap (\(f,t) -> f ++ ":" ++ showCT t dep ++ " ") fields ++ "}"
showCT (CMat val cses)    dep = "match " ++ showCT val dep ++ " {" ++ concatMap (\(cn,fs,cb) -> "#" ++ cn ++ ":" ++ showCT cb dep ++ " ") cses ++ "}"
showCT (CRef nam)         dep = nam
showCT (CHol nam)         dep = nam
showCT (CLet nam val bod) dep = "let " ++ nam ++ " = " ++ showCT val dep ++ "; " ++ showCT (bod (CVar nam dep)) (dep+1)
showCT (CNum val)         dep = show val
showCT (CFlt val)         dep = show val
showCT (COp2 opr fst snd) dep = "(<op> " ++ showCT fst dep ++ " " ++ showCT snd dep ++ ")"
showCT (CSwi val zer suc) dep = "switch " ++ showCT val dep ++ " {0:" ++ showCT zer dep ++ " _: " ++ showCT suc dep ++ "}"
showCT (CLog msg nxt)     dep = "log(" ++ showCT msg dep ++ "," ++ showCT nxt dep ++ ")"
showCT (CVar nam dep)     _   = nam ++ "^" ++ show dep
showCT (CTxt txt)         dep = show txt
showCT (CLst lst)         dep = "[" ++ unwords (map (\x -> showCT x dep) lst) ++ "]"
showCT (CNat val)         dep = show val
showCT (CSub val)         dep = "<" ++ showCT val dep ++ ">"

-- Tests
-- -----

-- data A = #Foo{x0 x1} | #Bar
-- data B = #T | #F

-- test0 = λx match x {
--   #Foo: λx0 λx1 λy match y {
--     #Foo: λy0 λy1 λz λw 10
--     #Bar: λz λw 20
--   }
--   #Bar: λy match y {
--     #Foo: λy0 λy1 λz λw 30
--     #Bar: λz λw 40
--   }
-- }
test0 :: CT
test0 = CLam "x" $ \x -> CMat x [
    ("Foo", ["x0", "x1"], CLam "x0" $ \x0 -> CLam "x1" $ \x1 -> CLam "y" $ \y -> CMat y [
      ("Foo", ["y0", "y1"], CLam "y0" $ \y0 -> CLam "y1" $ \y1 -> CLam "z" $ \z -> CLam "w" $ \w -> CNum 10),
      ("Bar", [], CLam "z" $ \z -> CLam "w" $ \w -> CNum 20)
    ]),
    ("Bar", [], CLam "y" $ \y -> CMat y [
      ("Foo", ["y0", "y1"], CLam "y0" $ \y0 -> CLam "y1" $ \y1 -> CLam "z" $ \z -> CLam "w" $ \w -> CNum 30),
      ("Bar", [], CLam "z" $ \z -> CLam "w" $ \w -> CNum 40)
    ])
  ]

-- test1 = λx match x {
--   #Foo: λx0 match x0 {
--     #T: λx1 λy match y {
--       #Foo: λy0 λy1 λz λw 10
--       #Bar: λz λw 20
--     }
--     #F: λx1 λy λz λw 15
--   }
--   #Bar: λy match y {
--     #Foo: λy0 λy1 λz λw 30
--     #Bar: λz λw 40
--   }
-- }
test1 :: CT
test1 = CLam "x" $ \x -> CMat x [
    ("Foo", ["x0"], CLam "x0" $ \x0 -> CMat x0 [
      ("T", ["x1"], CLam "x1" $ \x1 -> CLam "y" $ \y -> CMat y [
        ("Foo", ["y0", "y1"], CLam "y0" $ \y0 -> CLam "y1" $ \y1 -> CLam "z" $ \z -> CLam "w" $ \w -> CNum 10),
        ("Bar", [], CLam "z" $ \z -> CLam "w" $ \w -> CNum 20)
      ]),
      ("F", ["x1"], CLam "x1" $ \x1 -> CLam "y" $ \y -> CLam "z" $ \z -> CLam "w" $ \w -> CNum 15)
    ]),
    ("Bar", [], CLam "y" $ \y -> CMat y [
      ("Foo", ["y0", "y1"], CLam "y0" $ \y0 -> CLam "y1" $ \y1 -> CLam "z" $ \z -> CLam "w" $ \w -> CNum 30),
      ("Bar", [], CLam "z" $ \z -> CLam "w" $ \w -> CNum 40)
    ])
  ]

ctest :: IO ()
ctest = do
  putStrLn $ showCT test1 0
  putStrLn $ showCT (liftLambdas [] test1 0) 0
