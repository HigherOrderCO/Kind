module Kind.Type where

import qualified Data.IntMap.Strict as IM
import qualified Data.Map.Strict as M

import Debug.Trace
import Data.Word (Word64)

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
  | ADT [Term] [Ctr] Term

  -- Constructor: #CN { x0 x1 ... }
  | Con String [(Maybe String, Term)]

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

  -- U64 Type
  | U64

  -- F64 Type
  | F64

  -- U64 Value
  | Num Word64

  -- F64 Value
  | Flt Double

  -- Binary Operation
  | Op2 Oper Term Term

  -- U64 Elimination (updated to use splitting lambda)
  | Swi Term Term

  -- Inspection Hole
  | Hol String [Term]

  -- Unification Metavar
  | Met Int [Term]

  -- Logging
  | Log Term Term

  -- Variable
  | Var String Int

  -- Source Location
  | Src Cod Term

  -- Text Literal (sugar)
  | Txt String

  -- List Literal (sugar)
  | Lst [Term]

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

-- UNCOMMENT THIS TO DEBUG THE TYPE CHECKER
-- debug a b = trace a b
debug a b = b
