-- //./Type.hs//

module Kind.Reduce where

import Prelude hiding (EQ, LT, GT)
import Data.Bits ( (.&.), (.|.), xor, shiftL, shiftR )
import Data.Char (ord)
import Data.Fixed (mod')
import Debug.Trace
import Kind.Show
import Kind.Type

import qualified Data.Map.Strict as M
import qualified Data.IntMap.Strict as IM

-- for exitting on undefined ref (should be handled better)
import System.Exit (exitWith, ExitCode(ExitFailure))
import System.IO.Unsafe (unsafePerformIO)

-- Evaluation
-- ----------

-- Evaluates a term to weak normal form
-- 'lv' defines when to expand refs: 0 = never, 1 = on redexes
reduce :: Book -> Fill -> Int -> Term -> Term
reduce book fill lv term = red term where

  red (App fun arg)     = app (red fun) arg
  red (Ann chk val typ) = red val
  red (Ins val)         = red val
  red (Ref nam)         = ref nam
  red (Let nam val bod) = red (bod (red val))
  red (Use nam val bod) = red (bod (red val))
  red (Op2 opr fst snd) = op2 opr (red fst) (red snd)
  red (Txt val)         = txt val
  red (Lst val)         = lst val
  red (Nat val)         = nat val
  red (Src src val)     = red val
  red (Met uid spn)     = met uid spn
  red (Log msg nxt)     = log msg nxt
  red (Get g n m k b)   = get g n (red m) (red k) b
  red (Put g n m k v b) = put g n (red m) (red k) v b
  red (Upd trm args)    = upd (reduce book fill lv trm) args
  red val               = val

  app (Ref nam)     arg | lv > 0 = app (ref nam) arg
  app (Met uid spn) arg = red (Met uid (spn ++ [arg]))
  app (Lam nam bod) arg = red (bod (reduce book fill 0 arg))
  app (Mat cse)     arg = mat cse (red arg)
  app (Swi zer suc) arg = swi zer suc (red arg)
  app fun           arg = App fun arg

  mat cse (Con cnam carg) = case lookup cnam cse of
    Just cx -> red (foldl App cx (map snd carg))
    Nothing -> case lookup "_" cse of
      Just df -> red (App df (Con cnam carg))
      Nothing -> error $ "Constructor " ++ cnam ++ " not found in pattern match and no default case '_' provided :" ++ (showTermGo True (Mat cse) 0)
  mat cse arg = App (Mat cse) arg

  swi zer suc (Num 0)             = red zer
  swi zer suc (Num n)             = red (App suc (Num (n - 1)))
  swi zer suc (Op2 ADD (Num 1) k) = red (App suc k)
  swi zer suc val                 = App (Swi zer suc) val

  met uid spn = case IM.lookup uid fill of
    Just val -> red (case spn of
      []       -> val
      (x : xs) -> foldl App val spn)
    Nothing  -> Met uid spn

  op2 op  (Ref nam) (Num snd) | lv > 0 = op2 op (ref nam) (Num snd)
  op2 op  (Num fst) (Ref nam) | lv > 0 = op2 op (Num fst) (ref nam)
  op2 ADD (Num fst) (Num snd) = Num (fst + snd)
  op2 SUB (Num fst) (Num snd) = Num (fst - snd)
  op2 MUL (Num fst) (Num snd) = Num (fst * snd)
  op2 DIV (Num fst) (Num snd) = Num (div fst snd)
  op2 MOD (Num fst) (Num snd) = Num (mod fst snd)
  op2 EQ  (Num fst) (Num snd) = Num (if fst == snd then 1 else 0)
  op2 NE  (Num fst) (Num snd) = Num (if fst /= snd then 1 else 0)
  op2 LT  (Num fst) (Num snd) = Num (if fst < snd then 1 else 0)
  op2 GT  (Num fst) (Num snd) = Num (if fst > snd then 1 else 0)
  op2 LTE (Num fst) (Num snd) = Num (if fst <= snd then 1 else 0)
  op2 GTE (Num fst) (Num snd) = Num (if fst >= snd then 1 else 0)
  op2 AND (Num fst) (Num snd) = Num (fst .&. snd)
  op2 OR  (Num fst) (Num snd) = Num (fst .|. snd)
  op2 XOR (Num fst) (Num snd) = Num (fst `xor` snd)
  op2 LSH (Num fst) (Num snd) = Num (shiftL fst (fromIntegral snd))
  op2 RSH (Num fst) (Num snd) = Num (shiftR fst (fromIntegral snd))
  op2 op  (Ref nam) (Flt snd)  | lv > 0 = op2 op (ref nam) (Flt snd)
  op2 op  (Flt fst) (Ref nam)  | lv > 0 = op2 op (Flt fst) (ref nam)
  op2 ADD (Flt fst) (Flt snd) = Flt (fst + snd)
  op2 SUB (Flt fst) (Flt snd) = Flt (fst - snd)
  op2 MUL (Flt fst) (Flt snd) = Flt (fst * snd)
  op2 DIV (Flt fst) (Flt snd) = Flt (fst / snd)
  op2 MOD (Flt fst) (Flt snd) = Flt (mod' fst snd)
  op2 EQ  (Flt fst) (Flt snd) = Num (if fst == snd then 1 else 0)
  op2 NE  (Flt fst) (Flt snd) = Num (if fst /= snd then 1 else 0)
  op2 LT  (Flt fst) (Flt snd) = Num (if fst < snd then 1 else 0)
  op2 GT  (Flt fst) (Flt snd) = Num (if fst > snd then 1 else 0)
  op2 LTE (Flt fst) (Flt snd) = Num (if fst <= snd then 1 else 0)
  op2 GTE (Flt fst) (Flt snd) = Num (if fst >= snd then 1 else 0)
  op2 AND (Flt _)   (Flt _)   = error "Bitwise AND not supported for floating-point numbers"
  op2 OR  (Flt _)   (Flt _)   = error "Bitwise OR not supported for floating-point numbers"
  op2 XOR (Flt _)   (Flt _)   = error "Bitwise XOR not supported for floating-point numbers"
  op2 opr fst       snd       = Op2 opr fst snd

  ref nam | lv > 0 = case M.lookup nam book of
    Just val -> red val
    Nothing  -> Con ("undefined-reference:"++nam) []
  ref nam = Ref nam

  txt []     = red (Con "Nil" [])
  txt (x:xs) = red (Con "Cons" [(Nothing, Num (toEnum (ord x))), (Nothing, Txt xs)])

  lst []     = red (Con "Nil" [])
  lst (x:xs) = red (Con "Cons" [(Nothing, x), (Nothing, Lst xs)])
  
  nat 0 = Con "Zero" []
  nat n = Con "Succ" [(Nothing, Nat (n - 1))]

  log msg nxt = logMsg book fill lv msg msg nxt ""

  get g n (KVs kvs d) (Num k) b = case IM.lookup (fromIntegral k) kvs of
    Just v  -> red (b v (KVs kvs d))
    Nothing -> red (b d (KVs kvs d))
  get g n m k b = Get g n m k b

  put g n (KVs kvs d) (Num k) v b = case IM.lookup (fromIntegral k) kvs of
    Just o  -> red (b o (KVs (IM.insert (fromIntegral k) v kvs) d))
    Nothing -> red (b d (KVs (IM.insert (fromIntegral k) v kvs) d))
  put g n m k v b = Put g n m k v b

  -- Requires the original constructor to have been declared with its field names.
  -- Updated fields must appear in the same order as the constructor's definition.
  upd (Con cnam cargs) changes = Con cnam (updateArgs cargs changes) where
    updateArgs ((Just argName, argVal) : otherArgs) changes@((changeName, changeVal) : otherChanges) = 
      if argName == changeName
        then (Just argName, changeVal) : updateArgs otherArgs otherChanges
        else (Just argName, argVal)    : updateArgs otherArgs changes
    updateArgs args changes = args
  upd trm changes = trace (showTerm trm) $ Upd trm changes

-- Logging
-- -------

logMsg :: Book -> Fill -> Int -> Term -> Term -> Term -> String -> Term
logMsg book fill lv msg' msg nxt txt =
  case (reduce book fill 2 msg) of
    Con "Cons" [(_, head), (_, tail)] -> case (reduce book fill lv head) of
      Num chr -> logMsg book fill lv msg' tail nxt (txt ++ [toEnum (fromIntegral chr)])
      _       -> trace (">> " ++ (showTerm (normal book fill 1 msg' 0))) $ (reduce book fill lv nxt)
    Con "Nil" [] ->
      trace txt (reduce book fill lv nxt)
    bad ->
      trace (">> " ++ (showTerm (normal book fill 1 msg' 0))) $ (reduce book fill lv nxt)

-- Normalization
-- -------------

-- Evaluates a term to full normal form
normal :: Book -> Fill -> Int -> Term -> Int -> Term
normal book fill lv term dep = go (reduce book fill lv term) dep where
  go (All nam inp bod) dep =
    let nf_inp = normal book fill lv inp dep in
    let nf_bod = \x -> normal book fill lv (bod (Var nam dep)) (dep + 1) in
    All nam nf_inp nf_bod
  go (Lam nam bod) dep =
    let nf_bod = \x -> normal book fill lv (bod (Var nam dep)) (dep + 1) in
    Lam nam nf_bod
  go (App fun arg) dep =
    let nf_fun = normal book fill lv fun dep in
    let nf_arg = normal book fill lv arg dep in
    App nf_fun nf_arg
  go (Ann chk val typ) dep =
    let nf_val = normal book fill lv val dep in
    let nf_typ = normal book fill lv typ dep in
    Ann chk nf_val nf_typ
  go (Slf nam typ bod) dep =
    let nf_bod = \x -> normal book fill lv (bod (Var nam dep)) (dep + 1) in
    Slf nam typ nf_bod
  go (Ins val) dep =
    let nf_val = normal book fill lv val dep in
    Ins nf_val
  go (ADT scp cts typ) dep =
    let go_ctr = (\ (Ctr nm tele) ->
          let nf_tele = normalTele book fill lv tele dep in
          Ctr nm nf_tele) in
    let nf_scp = map (\x -> normal book fill lv x dep) scp in
    let nf_cts = map go_ctr cts in
    let nf_typ = normal book fill lv typ dep in
    ADT nf_scp nf_cts nf_typ
  go (Con nam arg) dep =
    let nf_arg = map (\(f, t) -> (f, normal book fill lv t dep)) arg in
    Con nam nf_arg
  go (Upd trm arg) dep =
    let nf_trm = normal book fill lv trm dep in
    let nf_arg = map (\(f, t) -> (f, normal book fill lv t dep)) arg in
    Upd nf_trm nf_arg
  go (Mat cse) dep =
    let nf_cse = map (\(cnam, cbod) -> (cnam, normal book fill lv cbod dep)) cse in
    Mat nf_cse
  go (Swi zer suc) dep =
    let nf_zer = normal book fill lv zer dep in
    let nf_suc = normal book fill lv suc dep in
    Swi nf_zer nf_suc
  go (Ref nam) dep = Ref nam
  go (Let nam val bod) dep =
    let nf_val = normal book fill lv val dep in
    let nf_bod = \x -> normal book fill lv (bod (Var nam dep)) (dep + 1) in
    Let nam nf_val nf_bod
  go (Use nam val bod) dep =
    let nf_val = normal book fill lv val dep in
    let nf_bod = \x -> normal book fill lv (bod (Var nam dep)) (dep + 1) in
    Use nam nf_val nf_bod
  go (Hol nam ctx) dep = Hol nam ctx
  go Set dep = Set
  go U64 dep = U64
  go F64 dep = F64
  go (Num val) dep = Num val
  go (Flt val) dep = Flt val
  go (Op2 opr fst snd) dep =
    let nf_fst = normal book fill lv fst dep in
    let nf_snd = normal book fill lv snd dep in
    Op2 opr nf_fst nf_snd
  go (Map typ) dep =
    let nf_typ = normal book fill lv typ dep in
    Map nf_typ
  go (KVs kvs def) dep =
    let nf_kvs = IM.map (\x -> normal book fill lv x dep) kvs in
    let nf_def = normal book fill lv def dep in
    KVs nf_kvs nf_def
  go (Get g n m k b) dep =
    let nf_m = normal book fill lv m dep in
    let nf_k = normal book fill lv k dep in
    let nf_b = \v s -> normal book fill lv (b (Var g dep) (Var n dep)) (dep + 2) in
    Get g n nf_m nf_k nf_b
  go (Put g n m k v b) dep =
    let nf_m = normal book fill lv m dep in
    let nf_k = normal book fill lv k dep in
    let nf_v = normal book fill lv v dep in
    let nf_b = \o s -> normal book fill lv (b (Var g dep) (Var n dep)) (dep + 2) in
    Put g n nf_m nf_k nf_v nf_b
  go (Txt val) dep = Txt val
  go (Lst val) dep =
    let nf_val = map (\x -> normal book fill lv x dep) val in
    Lst nf_val
  go (Nat val) dep = Nat val
  go (Var nam idx) dep = Var nam idx
  go (Src src val) dep =
    let nf_val = normal book fill lv val dep in
    Src src nf_val
  go (Met uid spn) dep = Met uid spn -- TODO: normalize spine
  go (Log msg nxt) dep =
    let nf_msg = normal book fill lv msg dep in
    let nf_nxt = normal book fill lv nxt dep in
    Log nf_msg nf_nxt

normalTele :: Book -> Fill -> Int -> Tele -> Int -> Tele
normalTele book fill lv tele dep = case tele of
  TRet term ->
    let nf_term = normal book fill lv term dep in
    TRet nf_term
  TExt nam typ bod ->
    let nf_typ = normal book fill lv typ dep in
    let nf_bod = \x -> normalTele book fill lv (bod (Var nam dep)) (dep + 1) in
    TExt nam nf_typ nf_bod

-- Binding
-- -------

-- Binds quoted variables to bound HOAS variables
bind :: Term -> [(String,Term)] -> Term
bind (All nam inp bod) ctx =
  let inp' = bind inp ctx in
  let bod' = \x -> bind (bod (Var nam 0)) ((nam, x) : ctx) in
  All nam inp' bod'
bind (Lam nam bod) ctx =
  let bod' = \x -> bind (bod (Var nam 0)) ((nam, x) : ctx) in
  Lam nam bod'
bind (App fun arg) ctx =
  let fun' = bind fun ctx in
  let arg' = bind arg ctx in
  App fun' arg'
bind (Ann chk val typ) ctx =
  let val' = bind val ctx in
  let typ' = bind typ ctx in
  Ann chk val' typ'
bind (Slf nam typ bod) ctx =
  let typ' = bind typ ctx in
  let bod' = \x -> bind (bod (Var nam 0)) ((nam, x) : ctx) in
  Slf nam typ' bod'
bind (Ins val) ctx =
  let val' = bind val ctx in
  Ins val'
bind (ADT scp cts typ) ctx =
  let scp' = map (\x -> bind x ctx) scp in
  let cts' = map (\x -> bindCtr x ctx) cts in
  let typ' = bind typ ctx in
  ADT scp' cts' typ'
  where
    bindCtr (Ctr nm tele)       ctx = Ctr nm (bindTele tele ctx)
    bindTele (TRet term)        ctx = TRet (bind term ctx)
    bindTele (TExt nam typ bod) ctx = TExt nam (bind typ ctx) $ \x -> bindTele (bod x) ((nam, x) : ctx) -- FIXME: 'bod x'?
bind (Con nam arg) ctx =
  let arg' = map (\(f, x) -> (f, bind x ctx)) arg in
  Con nam arg'
bind (Upd trm arg) ctx =
  let trm' = bind trm ctx in
  let arg' = map (\(n, x) -> (n, bind x ctx)) arg in
  Upd trm' arg'
bind (Mat cse) ctx =
  let cse' = map (\(cn,cb) -> (cn, bind cb ctx)) cse in
  Mat cse'
bind (Swi zer suc) ctx =
  let zer' = bind zer ctx in
  let suc' = bind suc ctx in
  Swi zer' suc'
bind (Map typ) ctx =
  let typ' = bind typ ctx in
  Map typ'
bind (KVs kvs def) ctx =
  let kvs' = IM.map (\x -> bind x ctx) kvs in
  let def' = bind def ctx in
  KVs kvs' def'
bind (Get g n m k b) ctx =
  let m' = bind m ctx in
  let k' = bind k ctx in
  let b' = \v s -> bind (b v s) ((n, s) : (g, v) : ctx) in
  Get g n m' k' b'
bind (Put g n m k v b) ctx =
  let m' = bind m ctx in
  let k' = bind k ctx in
  let v' = bind v ctx in
  let b' = \o s -> bind (b o s) ((n, s) : (g, o) : ctx) in
  Put g n m' k' v' b'
bind (Ref nam) ctx =
  case lookup nam ctx of
    Just x  -> x
    Nothing -> Ref nam
bind (Let nam val bod) ctx =
  let val' = bind val ctx in
  let bod' = \x -> bind (bod (Var nam 0)) ((nam, x) : ctx) in
  Let nam val' bod'
bind (Use nam val bod) ctx =
  let val' = bind val ctx in
  let bod' = \x -> bind (bod (Var nam 0)) ((nam, x) : ctx) in
  Use nam val' bod'
bind Set ctx = Set
bind U64 ctx = U64
bind F64 ctx = F64
bind (Num val) ctx = Num val
bind (Flt val) ctx = Flt val
bind (Op2 opr fst snd) ctx =
  let fst' = bind fst ctx in
  let snd' = bind snd ctx in
  Op2 opr fst' snd'
bind (Txt txt) ctx = Txt txt
bind (Lst lst) ctx =
  let lst' = map (\x -> bind x ctx) lst in
  Lst lst'
bind (Nat val) ctx = Nat val
bind (Hol nam ctxs) ctx = Hol nam (reverse (map snd ctx))
bind (Met uid spn) ctx = Met uid []
bind (Log msg nxt) ctx =
  let msg' = bind msg ctx in
  let nxt' = bind nxt ctx in
  Log msg' nxt'
bind (Var nam idx) ctx =
  case lookup nam ctx of
    Just x  -> x
    Nothing -> Var nam idx
bind (Src src val) ctx =
  let val' = bind val ctx in
  Src src val'

genMetas :: Term -> Term
genMetas term = fst (genMetasGo term 0)

genMetasGo :: Term -> Int -> (Term, Int)
genMetasGo (All nam inp bod) c = 
  let (inp', c1) = genMetasGo inp c
      (bod', c2) = genMetasGo (bod (Var nam 0)) c1
  in (All nam inp' (\_ -> bod'), c2)
genMetasGo (Lam nam bod) c = 
  let (bod', c1) = genMetasGo (bod (Var nam 0)) c
  in (Lam nam (\_ -> bod'), c1)
genMetasGo (App fun arg) c = 
  let (fun', c1) = genMetasGo fun c
      (arg', c2) = genMetasGo arg c1
  in (App fun' arg', c2)
genMetasGo (Ann chk val typ) c = 
  let (val', c1) = genMetasGo val c
      (typ', c2) = genMetasGo typ c1
  in (Ann chk val' typ', c2)
genMetasGo (Slf nam typ bod) c = 
  let (typ', c1) = genMetasGo typ c
      (bod', c2) = genMetasGo (bod (Var nam 0)) c1
  in (Slf nam typ' (\_ -> bod'), c2)
genMetasGo (Ins val) c = 
  let (val', c1) = genMetasGo val c
  in (Ins val', c1)
genMetasGo (ADT scp cts typ) c = 
  let (scp', c1) = foldr (\t (acc, c') -> let (t', c'') = genMetasGo t c' in (t':acc, c'')) ([], c) scp
      (cts', c2) = foldr (\(Ctr nm tele) (acc, c') -> let (tele', c'') = genMetasGoTele tele c' in (Ctr nm tele' : acc, c'')) ([], c1) cts
      (typ', c3) = genMetasGo typ c2
  in (ADT scp' cts' typ', c3)
genMetasGo (Con nam arg) c = 
  let (arg', c1) = foldr (\(f, t) (acc, c') -> let (t', c'') = genMetasGo t c' in ((f, t'):acc, c'')) ([], c) arg
  in (Con nam arg', c1)
genMetasGo (Upd trm arg) c =
  let (trm', c') = genMetasGo trm c in
  let (arg', c1) = foldr (\(f, t) (acc, c') -> let (t', c'') = genMetasGo t c' in ((f, t'):acc, c'')) ([], c') arg
  in (Upd trm' arg', c1)
genMetasGo (Mat cse) c = 
  let (cse', c1) = foldr (\(cn, cb) (acc, c') -> let (cb', c'') = genMetasGo cb c' in ((cn, cb'):acc, c'')) ([], c) cse
  in (Mat cse', c1)
genMetasGo (Swi zer suc) c = 
  let (zer', c1) = genMetasGo zer c
      (suc', c2) = genMetasGo suc c1
  in (Swi zer' suc', c2)
genMetasGo (Map typ) c = 
  let (typ', c1) = genMetasGo typ c
  in (Map typ', c1)
genMetasGo (KVs kvs def) c = 
  let (def', c1) = genMetasGo def c
      (kvs', c2) = foldr (\ (k, t) (acc, c') -> let (t', c'') = genMetasGo t c' in (IM.insert k t' acc, c'')) (IM.empty, c1) (IM.toList kvs)
  in (KVs kvs' def', c2)
genMetasGo (Get g n m k b) c = 
  let (m', c1) = genMetasGo m c
      (k', c2) = genMetasGo k c1
      (b', c3) = genMetasGo (b (Var g 0) (Var n 0)) c2
  in (Get g n m' k' (\_ _ -> b'), c3)
genMetasGo (Put g n m k v b) c = 
  let (m', c1) = genMetasGo m c
      (k', c2) = genMetasGo k c1
      (v', c3) = genMetasGo v c2
      (b', c4) = genMetasGo (b (Var g 0) (Var n 0)) c3
  in (Put g n m' k' v' (\_ _ -> b'), c4)
genMetasGo (Let nam val bod) c = 
  let (val', c1) = genMetasGo val c
      (bod', c2) = genMetasGo (bod (Var nam 0)) c1
  in (Let nam val' (\_ -> bod'), c2)
genMetasGo (Use nam val bod) c = 
  let (val', c1) = genMetasGo val c
      (bod', c2) = genMetasGo (bod (Var nam 0)) c1
  in (Use nam val' (\_ -> bod'), c2)
genMetasGo (Met _ spn) c = 
  let (spn', c1) = foldr (\t (acc, c') -> let (t', c'') = genMetasGo t c' in (t':acc, c'')) ([], c) spn
  in (Met c1 spn', c1 + 1)
genMetasGo (Op2 opr fst snd) c = 
  let (fst', c1) = genMetasGo fst c
      (snd', c2) = genMetasGo snd c1
  in (Op2 opr fst' snd', c2)
genMetasGo (Lst lst) c = 
  let (lst', c1) = foldr (\t (acc, c') -> let (t', c'') = genMetasGo t c' in (t':acc, c'')) ([], c) lst
  in (Lst lst', c1)
genMetasGo (Log msg nxt) c = 
  let (msg', c1) = genMetasGo msg c
      (nxt', c2) = genMetasGo nxt c1
  in (Log msg' nxt', c2)
genMetasGo (Hol nam ctx) c = 
  let (ctx', c1) = foldr (\t (acc, c') -> let (t', c'') = genMetasGo t c' in (t':acc, c'')) ([], c) ctx
  in (Hol nam ctx', c1)
genMetasGo (Src src val) c = 
  let (val', c1) = genMetasGo val c
  in (Src src val', c1)
genMetasGo term c = (term, c)

genMetasGoTele :: Tele -> Int -> (Tele, Int)
genMetasGoTele (TRet term) c = 
  let (term', c1) = genMetasGo term c
  in (TRet term', c1)
genMetasGoTele (TExt nam typ bod) c = 
  let (typ', c1) = genMetasGo typ c
      (bod', c2) = genMetasGoTele (bod (Var nam 0)) c1
  in (TExt nam typ' (\_ -> bod'), c2)

countMetas :: Term -> Int
countMetas term = snd (genMetasGo term 0)
