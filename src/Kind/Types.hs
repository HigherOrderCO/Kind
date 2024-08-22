module Kind.Types where

import qualified Data.IntMap.Strict as IM
import qualified Data.Map.Strict as M

-- Kind Core's AST
data Term
  -- Product: `∀(x: A) B`
  = All String Term (Term -> Term)

  -- Lambda: `λx f`
  | Lam String (Term -> Term)

  -- Application: `(fun arg)`
  | App Term Term

  -- Annotation: `{x: T}`
  | Ann Bool Term Term

  -- Self-Type: `$(x: A) B`
  | Slf String Term (Term -> Term)

  -- Self-Inst: `~x`
  | Ins Term

  -- Datatype: `"#[i0 i1...]{ #C0 { x0:T0 x1:T1 ... } #C1 { x0:T0 x1:T1 ... } }
  | Dat [Term] [Ctr]

  -- Constructor: `#CN { x0 x1 ... }`
  | Con String [Term]

  -- Match: `λ{ #C0:B0 #C1:B1 ... }`
  | Mat [(String, Term)]

  -- Top-Level Reference
  | Ref String

  -- Local let-definition
  | Let String Term (Term -> Term)

  -- Local use-definition
  | Use String Term (Term -> Term)

  -- Type : Type
  | Set

  -- U48 Type
  | U48

  -- U48 Value
  | Num Int

  -- U48 Binary Operation
  | Op2 Oper Term Term

  -- U48 Elimination
  | Swi String Term Term (Term -> Term) (Term -> Term)

  -- Inspection Hole
  | Hol String [Term]

  -- Unification Metavar
  | Met Int [Term]

  -- Variable
  | Var String Int

  -- Source Location
  | Src Int Term

  -- Text Literal (sugar)
  | Txt String

  -- Nat Literal (sugar)
  | Nat Integer

-- Numeric Operators
data Oper
  = ADD | SUB | MUL | DIV
  | MOD | EQ  | NE  | LT
  | GT  | LTE | GTE | AND
  | OR  | XOR | LSH | RSH

-- Ctrs
data Ctr = Ctr String [(String,Term)] Term

-- Book of Definitions
type Book = M.Map String Term

-- Type-Checker Outputs
data Info
  = Found String Term [Term] Int
  | Solve Int Term Int
  | Error Int Term Term Term Int
  | Vague String
  | Print Term Int

-- Unification Solutions
type Fill = IM.IntMap Term

-- Checker State
data Check = Check Int Term Term Int -- postponed check
data State = State Book Fill [Check] [Info] -- state type
data Res a = Done State a | Fail State -- result type
data Env a = Env (State -> Res a) -- monadic checker
