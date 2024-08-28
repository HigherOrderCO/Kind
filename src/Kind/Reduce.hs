module Kind.Reduce where

import Prelude hiding (EQ, LT, GT)
import Data.Char (ord)

import Kind.Type

import qualified Data.Map.Strict as M
import qualified Data.IntMap.Strict as IM

-- Evaluation
-- ----------

-- Evaluates a term to weak normal form
reduce :: Book -> Fill -> Int -> Term -> Term
reduce book fill lv term = red term where

  red (App fun arg)     = app (red fun) arg
  red (Ann chk val typ) = red val
  red (Ins val)         = red val
  red (Ref nam)         = ref nam
  red (Let nam val bod) = red (bod (red val))
  red (Use nam val bod) = red (bod (red val))
  red (Op2 opr fst snd) = op2 opr (red fst) (red snd)
  red (Swi nam x z s p) = swi nam (red x) z s p
  red (Txt val)         = txt val
  red (Nat val)         = nat val
  red (Src src val)     = red val
  red (Met uid spn)     = met uid spn
  red val               = val

  app (Ref nam)     arg = app (ref nam) arg
  app (Met uid spn) arg = red (Met uid (spn ++ [arg]))
  app (Lam nam bod) arg = red (bod (reduce book fill 0 arg))
  app (Mat cse)     arg = mat cse (red arg)
  app fun           arg = App fun arg

  mat cse (Con cnam carg) = case lookup cnam cse of
    Just cx -> red (foldl App cx carg)
    Nothing -> error $ "Constructor " ++ cnam ++ " not found in pattern match."
  mat cse arg = Mat cse

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
  op2 opr fst       snd       = Op2 opr fst snd

  swi nam (Ref x)             z s p | lv > 0 = swi nam (ref x) z s p
  swi nam (Num 0)             z s p = red z
  swi nam (Num n)             z s p = red (s (Num (n - 1)))
  swi nam (Op2 ADD (Num 1) k) z s p = red (s k)
  swi nam val                 z s p = Swi nam val z s p

  ref nam | lv == 2 = case M.lookup nam book of
    Just val -> red val
    Nothing  -> error $ "Undefined reference: " ++ nam
  ref nam = Ref nam

  txt []     = red (Ref "String/cons")
  txt (x:xs) = red (App (App (Ref "String/nil") (Num (ord x))) (Txt xs))

  nat 0 = Ref "Nat/zero"
  nat n = App (Ref "Nat/succ") (nat (n - 1))

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
    let go_ctr = (\ (Ctr nm fs rt) ->
          let nf_fs = map (\(fn, ft) -> (fn, normal book fill lv ft dep)) fs in
          let nf_rt = normal book fill lv rt dep in
          Ctr nm nf_fs nf_rt) in
    let nf_scp = map (\x -> normal book fill lv x dep) scp in
    let nf_cts = map go_ctr cts in
    Dat nf_scp nf_cts
  go (Con nam arg) dep =
    let nf_arg = map (\a -> normal book fill lv a dep) arg in
    Con nam nf_arg
  go (Mat cse) dep =
    let nf_cse = map (\(cnam, cbod) -> (cnam, normal book fill lv cbod dep)) cse in
    Mat nf_cse
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
  go (Swi nam x z s p) dep =
    let nf_x = normal book fill lv x dep in
    let nf_z = normal book fill lv z dep in
    let nf_s = \k -> normal book fill lv (s (Var (nam ++ "-1") dep)) dep in
    let nf_p = \k -> normal book fill lv (p (Var nam dep)) dep in
    Swi nam nf_x nf_z nf_s nf_p
  go (Txt val) dep = Txt val
  go (Nat val) dep = Nat val
  go (Var nam idx) dep = Var nam idx
  go (Src src val) dep =
    let nf_val = normal book fill lv val dep in
    Src src nf_val
  go (Met uid spn) dep = Met uid spn -- TODO: normalize spine

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
  let cts' = map bindCtr cts in
  Dat scp' cts'
  where
    bindCtr (Ctr nm fs rt) =
      let fs' = map (\(n,t) -> (n, bind t ctx)) fs in
      let rt' = bind rt ctx in
      Ctr nm fs' rt'
bind (Con nam arg) ctx =
  let arg' = map (\x -> bind x ctx) arg in
  Con nam arg'
bind (Mat cse) ctx =
  let cse' = map (\(cn,cb) -> (cn, bind cb ctx)) cse in
  Mat cse'
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
bind (Swi nam x z s p) ctx =
  let x' = bind x ctx in
  let z' = bind z ctx in
  let s' = \k -> bind (s (Var (nam ++ "-1") 0)) ((nam ++ "-1", k) : ctx) in
  let p' = \k -> bind (p (Var nam 0)) ((nam, k) : ctx) in
  Swi nam x' z' s' p'
bind (Txt txt) ctx = Txt txt
bind (Nat val) ctx = Nat val
bind (Hol nam ctxs) ctx = Hol nam (map snd ctx)
bind (Met uid spn) ctx = Met uid (map snd ctx)
bind (Var nam idx) ctx =
  case lookup nam ctx of
    Just x  -> x
    Nothing -> Var nam idx
bind (Src src val) ctx =
  let val' = bind val ctx in
  Src src val'

-- Substitution
-- ------------

-- Substitutes a Bruijn level variable by a `neo` value in `term`.
subst :: Int -> Term -> Term -> Term
subst lvl neo term = go term where
  go (All nam inp bod) = All nam (go inp) (\x -> go (bod x))
  go (Lam nam bod)     = Lam nam (\x -> go (bod x))
  go (App fun arg)     = App (go fun) (go arg)
  go (Ann chk val typ) = Ann chk (go val) (go typ)
  go (Slf nam typ bod) = Slf nam (go typ) (\x -> go (bod x))
  go (Ins val)         = Ins (go val)
  go (Dat scp cts)     = Dat (map go scp) (map goCtr cts)
  go (Con nam arg)     = Con nam (map go arg)
  go (Mat cse)         = Mat (map goCse cse)
  go (Ref nam)         = Ref nam
  go (Let nam val bod) = Let nam (go val) (\x -> go (bod x))
  go (Use nam val bod) = Use nam (go val) (\x -> go (bod x))
  go (Met uid spn)     = Met uid (map go spn)
  go (Hol nam ctx)     = Hol nam (map go ctx)
  go Set               = Set
  go U32               = U32
  go (Num n)           = Num n
  go (Op2 opr fst snd) = Op2 opr (go fst) (go snd)
  go (Swi nam x z s p) = Swi nam (go x) (go z) (\k -> go (s k)) (\k -> go (p k))
  go (Txt txt)         = Txt txt
  go (Nat val)         = Nat val
  go (Var nam idx)     = if lvl == idx then neo else Var nam idx
  go (Src src val)     = Src src (go val)
  goCtr (Ctr nm fs rt) = Ctr nm (map goFld fs) (go rt)
  goFld (fn, ft)       = (fn, go ft)
  goCse (cnam, cbod)   = (cnam, go cbod)
