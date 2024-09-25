module Kind.Type where

import qualified Data.IntMap.Strict as IM
import qualified Data.Map.Strict as M

import Debug.Trace

-- Kind's AST
data Term
  -- Product: ∀(x: A) B
  = All String Term (Term -> Term)

  -- Lambda: λx f
  | Lam String (Term -> Term)

  -- Application: (fun arg)
  | App Term Term

  -- Annotation: {x: T}
  | Ann Bool Term Term

  -- Self-Type: $(x: A) B
  | Slf String Term (Term -> Term)

  -- Self-Inst: ~x
  | Ins Term

  -- Datatype: "#[i0 i1...]{ #C0 Tele0 #C1 Tele1 ... }
  | Dat [Term] [Ctr]

  -- Constructor: #CN { x0 x1 ... }
  | Con String [Term]

  -- Match: λ{ #C0:B0 #C1:B1 ... }
  | Mat [(String, Term)]

  -- Top-Level Reference
  | Ref String

  -- Local let-definition
  | Let String Term (Term -> Term)

  -- Local use-definition
  | Use String Term (Term -> Term)

  -- Type : Type
  | Set

  -- U32 Type
  | U32

  -- U32 Value (FIXME: this is wrong, should be Word32)
  | Num Int

  -- U32 Binary Operation
  | Op2 Oper Term Term

  -- U32 Elimination (updated to use splitting lambda)
  | Swi Term Term

  -- Inspection Hole
  | Hol String [Term]

  -- Unification Metavar
  | Met Int [Term]

  -- Variable
  | Var String Int

  -- Source Location
  | Src Cod Term

  -- Text Literal (sugar)
  | Txt String

  -- Nat Literal (sugar)
  | Nat Integer

-- Location: Name, Line, Column
data Loc = Loc String Int Int
data Cod = Cod Loc Loc

-- Numeric Operators
data Oper
  = ADD | SUB | MUL | DIV
  | MOD | EQ  | NE  | LT
  | GT  | LTE | GTE | AND
  | OR  | XOR | LSH | RSH

-- Telescope
data Tele
  = TRet Term
  | TExt String Term (Term -> Tele)

-- Constructor
data Ctr = Ctr String Tele

-- Book of Definitions
type Book = M.Map String Term

-- Type-Checker Outputs
data Info
  = Found String Term [Term] Int
  | Solve Int Term Int
  | Error (Maybe Cod) Term Term Term Int
  | Vague String
  | Print Term Int

-- Unification Solutions
type Fill = IM.IntMap Term

-- Checker State
data Check = Check (Maybe Cod) Term Term Int -- postponed check
data State = State Book Fill [Check] [Info] -- state type
data Res a = Done State a | Fail State -- result type
data Env a = Env (State -> Res a) -- monadic checker

-- debug a b = trace a b
debug a b = b
