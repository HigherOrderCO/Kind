module Kind.Reduce where

import Prelude hiding (EQ, LT, GT)
import Data.Bits ( (.&.), (.|.), xor, shiftL, shiftR )
import Data.Char (ord)
import Debug.Trace
import Kind.Type
import Kind.Show

import qualified Data.Map.Strict as M
import qualified Data.IntMap.Strict as IM

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
  red (Nat val)         = nat val
  red (Src src val)     = red val
  red (Met uid spn)     = met uid spn
  red val               = val

  app (Ref nam)     arg | lv > 0 = app (ref nam) arg
  app (Met uid spn) arg = red (Met uid (spn ++ [arg]))
  app (Lam nam bod) arg = red (bod (reduce book fill 0 arg))
  app (Mat cse)     arg = mat cse (red arg)
  app (Swi zer suc) arg = swi zer suc (red arg)
  app fun           arg = App fun arg

  mat cse (Con cnam carg) = case lookup cnam cse of
    Just cx -> red (foldl App cx (map snd carg))
    Nothing -> error $ "Constructor " ++ cnam ++ " not found in pattern match."
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
  op2 opr fst       snd       = Op2 opr fst snd

  ref nam | lv > 0 = case M.lookup nam book of
    Just val -> red val
    Nothing  -> error $ "Undefined reference: " ++ nam
  ref nam = Ref nam

  txt []     = red (Ref "Base/String/cons")
  txt (x:xs) = red (App (App (Ref "Base/String/nil") (Num (toEnum (ord x)))) (Txt xs))

  nat 0 = Ref "Base/Nat/zero"
  nat n = App (Ref "Base/Nat/succ") (nat (n - 1))

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
  go (Dat scp cts) dep =
    let go_ctr = (\ (Ctr nm tele) ->
          let nf_tele = normalTele book fill lv tele dep in
          Ctr nm nf_tele) in
    let nf_scp = map (\x -> normal book fill lv x dep) scp in
    let nf_cts = map go_ctr cts in
    Dat nf_scp nf_cts
  go (Con nam arg) dep =
    let nf_arg = map (\(f, t) -> (f, normal book fill lv t dep)) arg in
    Con nam nf_arg
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
  go U32 dep = U32
  go (Num val) dep = Num val
  go (Op2 opr fst snd) dep =
    let nf_fst = normal book fill lv fst dep in
    let nf_snd = normal book fill lv snd dep in
    Op2 opr nf_fst nf_snd
  go (Txt val) dep = Txt val
  go (Nat val) dep = Nat val
  go (Var nam idx) dep = Var nam idx
  go (Src src val) dep =
    let nf_val = normal book fill lv val dep in
    Src src nf_val
  go (Met uid spn) dep = Met uid spn -- TODO: normalize spine

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
bind (Dat scp cts) ctx =
  let scp' = map (\x -> bind x ctx) scp in
  let cts' = map (\x -> bindCtr x ctx) cts in
  Dat scp' cts'
  where
    bindCtr (Ctr nm tele)       ctx = Ctr nm (bindTele tele ctx)
    bindTele (TRet term)        ctx = TRet (bind term ctx)
    bindTele (TExt nam typ bod) ctx = TExt nam (bind typ ctx) $ \x -> bindTele (bod x) ((nam, x) : ctx)
bind (Con nam arg) ctx =
  let arg' = map (\(f, x) -> (f, bind x ctx)) arg in
  Con nam arg'
bind (Mat cse) ctx =
  let cse' = map (\(cn,cb) -> (cn, bind cb ctx)) cse in
  Mat cse'
bind (Swi zer suc) ctx =
  let zer' = bind zer ctx in
  let suc' = bind suc ctx in
  Swi zer' suc'
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
bind U32 ctx = U32
bind (Num val) ctx = Num val
bind (Op2 opr fst snd) ctx =
  let fst' = bind fst ctx in
  let snd' = bind snd ctx in
  Op2 opr fst' snd'
bind (Txt txt) ctx = Txt txt
bind (Nat val) ctx = Nat val
bind (Hol nam ctxs) ctx = Hol nam (reverse (map snd ctx))
bind (Met uid spn) ctx = Met uid []
bind (Var nam idx) ctx =
  case lookup nam ctx of
    Just x  -> x
    Nothing -> Var nam idx
bind (Src src val) ctx =
  let val' = bind val ctx in
  Src src val'

genMetas :: Term -> Term
genMetas term = fst (go term 0) where
  go :: Term -> Int -> (Term, Int)
  go (All nam inp bod) c = 
    let (inp', c1) = go inp c
        (bod', c2) = go (bod (Var nam 0)) c1
    in (All nam inp' (\_ -> bod'), c2)
  go (Lam nam bod) c = 
    let (bod', c1) = go (bod (Var nam 0)) c
    in (Lam nam (\_ -> bod'), c1)
  go (App fun arg) c = 
    let (fun', c1) = go fun c
        (arg', c2) = go arg c1
    in (App fun' arg', c2)
  go (Ann chk val typ) c = 
    let (val', c1) = go val c
        (typ', c2) = go typ c1
    in (Ann chk val' typ', c2)
  go (Slf nam typ bod) c = 
    let (typ', c1) = go typ c
        (bod', c2) = go (bod (Var nam 0)) c1
    in (Slf nam typ' (\_ -> bod'), c2)
  go (Ins val) c = 
    let (val', c1) = go val c
    in (Ins val', c1)
  go (Dat scp cts) c = 
    let (scp', c1) = foldr (\t (acc, c') -> let (t', c'') = go t c' in (t':acc, c'')) ([], c) scp
        (cts', c2) = foldr (\(Ctr nm tele) (acc, c') -> let (tele', c'') = goTele tele c' in (Ctr nm tele' : acc, c'')) ([], c1) cts
    in (Dat scp' cts', c2)
  go (Con nam arg) c = 
    let (arg', c1) = foldr (\(f, t) (acc, c') -> let (t', c'') = go t c' in ((f, t'):acc, c'')) ([], c) arg
    in (Con nam arg', c1)
  go (Mat cse) c = 
    let (cse', c1) = foldr (\(cn, cb) (acc, c') -> let (cb', c'') = go cb c' in ((cn, cb'):acc, c'')) ([], c) cse
    in (Mat cse', c1)
  go (Swi zer suc) c = 
    let (zer', c1) = go zer c
        (suc', c2) = go suc c1
    in (Swi zer' suc', c2)
  go (Let nam val bod) c = 
    let (val', c1) = go val c
        (bod', c2) = go (bod (Var nam 0)) c1
    in (Let nam val' (\_ -> bod'), c2)
  go (Use nam val bod) c = 
    let (val', c1) = go val c
        (bod', c2) = go (bod (Var nam 0)) c1
    in (Use nam val' (\_ -> bod'), c2)
  go (Met _ spn) c = 
    let (spn', c1) = foldr (\t (acc, c') -> let (t', c'') = go t c' in (t':acc, c'')) ([], c) spn
    in (Met c1 spn', c1 + 1)
  go (Hol nam ctx) c = 
    let (ctx', c1) = foldr (\t (acc, c') -> let (t', c'') = go t c' in (t':acc, c'')) ([], c) ctx
    in (Hol nam ctx', c1)
  go (Src src val) c = 
    let (val', c1) = go val c
    in (Src src val', c1)
  go term c = (term, c)

  goTele :: Tele -> Int -> (Tele, Int)
  goTele (TRet term) c = 
    let (term', c1) = go term c
    in (TRet term', c1)
  goTele (TExt nam typ bod) c = 
    let (typ', c1) = go typ c
        (bod', c2) = goTele (bod (Var nam 0)) c1
    in (TExt nam typ' (\_ -> bod'), c2)
