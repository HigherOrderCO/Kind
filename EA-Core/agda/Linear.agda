data Bool : Set where
  true  : Bool
  false : Bool

data Nat : Set where
  suc : Nat -> Nat
  zer : Nat
{-# BUILTIN NATURAL Nat #-}

data Vec (A : Set) : (n : Nat) -> Set where
  _,_ : ∀ {n} -> A -> Vec A n -> Vec A (suc n)
  []  : Vec A zer

data Sig (A : Set) (B : A → Set) : Set where
  sig : (a : A) → B a → Sig A B

Exists : ∀ {A : Set} → (A → Set) → Set
Exists = Sig _

Pair : ∀ (A B : Set) → Set
Pair A B = Sig A (λ x → B)

-- variable
  -- m n : Nat
  -- b : Bool
  -- Γ Δ Ξ T I O : Vec Bool n

-- A Linear term has an output and an output usage annotation
-- For each variable (i.e. index in the Vec):
--  * true: available
--  * false: already consumed
Linear : Set₁
Linear = ∀ n (Γa Γb : Vec Bool n) → Set

data Var : Linear where
  z : ∀ {n Γ} → Var (suc n) (true , Γ) (false , Γ)
  s : ∀ {n Γa Γb x} → Var n Γa Γb → Var (suc n) (x , Γa) (x , Γb)

data Lam : Linear where
  var : ∀ {n Γa Γb} → Var n Γa Γb → Lam n Γa Γb
  app : ∀ {n Γa Γb Γc} → Lam n Γa Γb → Lam n Γb Γc → Lam n Γa Γc
  lam : ∀ {n Γa Γb} → Lam (suc n) (true , Γa) (false , Γb) → Lam n Γa Γb

-- Γi Γo: input and output usage of the env
-- Γt: target usage covered by the content of the env
data Env : ∀ n m → (Γi Γo : Vec Bool n) (Γt : Vec Bool m) → Set where
  -- empty environment
  []  : ∀ {n Γi Γo} → Env n zer Γi Γo [] 
  -- 0th variable is available so we have a value for it
  _,_ : ∀ {n m Γi Γm Γo Γt} → Lam n Γi Γm → Env n m Γm Γo Γt → Env n (suc m) Γi Γo (true , Γt)
  -- -- 0th variable has already been consumed: we don't have a term for it anymore
  ─,_ : ∀ {n m Γi Γo Γt} → Env n m Γi Γo Γt → Env n (suc m) Γi Γo (false , Γt)
  -- -- When we go under binders, we need to be able to extend the input/output
  -- -- context to cope with the extended context
  [v]∷_ : ∀ {n m Γi Γo Γt} → Env n m Γi Γo Γt → Env (suc n) (suc m) (true , Γi)  (false , Γo) (false , Γt)
  ]v[∷_ : ∀ {n m Γi Γo Γt} → Env n m Γi Γo Γt → Env (suc n) (suc m) (false , Γi) (false , Γo) (false , Γt)

-- Input/output usage pairs that have the same consumption pattern
data Equiv : ∀ n → (Γ0i Γ0o Γ1i Γ1o : Vec Bool n) → Set where
  -- Empty pairs have the same consumption pattern
  empty   : Equiv zer [] [] [] []
  -- If a resource is untouched in one side, then it must be untouched on the other
  skip    : ∀ {n} Γ0i Γ0o Γ1i Γ1o A B → Equiv (suc n) (A , Γ0i) (A , Γ0o) (B , Γ1i) (B , Γ1o)
  -- If a resource is used in one side, then it must be used on the other
  consume : ∀ {n} Γ0i Γ0o Γ1i Γ1o → Equiv (suc n) (true , Γ0i) (false , Γ0o) (true , Γ1i) (false , Γ1o)


-- R: target of the substitution
-- V: output (e.g. substituting for vars yields terms)
Subst : (R : Linear) (V : Linear) → Set
Subst R V = ∀ {n m Γi Γo I O}
          -- environment targetting I
          → Env n m Γi Γo I
          -- R consuming resources in I, returning O leftovers
          → R m I O
          -- the result is a usage annotation, a value V consuming in the input, returning M leftovers, an environment of leftovers for whatever is still true in O
          → Exists (λ M → Pair (V n Γi M) (Env n m M Γo O))

-- substVar : Subst Var Lam
-- substVar (t ∷ ρ)  z     = -, t     , ─∷ ρ
-- substVar (x ∷ ρ)  (s v) = {!!}
-- substVar (─∷ ρ)   (s v) = {!!}
-- substVar ([v]∷ ρ) (s v) = {!!}
-- substVar (]v[∷ ρ) (s v) = {!!}
