-- //./Type.hs//

module Kind.Util where

import Kind.Show
import Kind.Type
import Kind.Equal

import Prelude hiding (LT, GT, EQ)

import qualified Data.IntMap.Strict as IM
import qualified Data.Map.Strict as M
import qualified Data.Set as S

import Debug.Trace

-- Gets dependencies of a term
getDeps :: Term -> [String]
getDeps term = case term of
  Ref nam         -> [nam]
  All _ inp out   -> getDeps inp ++ getDeps (out Set)
  Lam _ bod       -> getDeps (bod Set)
  App fun arg     -> getDeps fun ++ getDeps arg
  Ann _ val typ   -> getDeps val ++ getDeps typ
  Slf _ typ bod   -> getDeps typ ++ getDeps (bod Set)
  Ins val         -> getDeps val
  ADT scp cts t   -> concatMap getDeps scp ++ concatMap getDepsCtr cts ++ getDeps t
  Con _ arg       -> concatMap (getDeps . snd) arg
  Mat cse         -> concatMap (getDeps . snd) cse
  Let _ val bod   -> getDeps val ++ getDeps (bod Set)
  Use _ val bod   -> getDeps val ++ getDeps (bod Set)
  Op2 _ fst snd   -> getDeps fst ++ getDeps snd
  Swi zer suc     -> getDeps zer ++ getDeps suc
  Map val         -> getDeps val
  KVs kvs def     -> concatMap getDeps (IM.elems kvs) ++ getDeps def
  Get _ _ m k b   -> getDeps m ++ getDeps k ++ getDeps (b Set Set)
  Put _ _ m k v b -> getDeps m ++ getDeps k ++ getDeps v ++ getDeps (b Set Set)
  Src _ val       -> getDeps val
  Hol _ args      -> concatMap getDeps args
  Met _ args      -> concatMap getDeps args
  Log msg nxt     -> getDeps msg ++ getDeps nxt
  Var _ _         -> []
  Set             -> []
  U64             -> []
  F64             -> []
  Num _           -> []
  Flt _           -> []
  Txt _           -> []
  Lst elems       -> concatMap getDeps elems
  Nat _           -> []

-- Gets dependencies of a constructor
getDepsCtr :: Ctr -> [String]
getDepsCtr (Ctr _ tele) = getDepsTele tele

-- Gets dependencies of a telescope
getDepsTele :: Tele -> [String]
getDepsTele (TRet term) = getDeps term
getDepsTele (TExt _ typ bod) = getDeps typ ++ getDepsTele (bod Set)

-- Gets all dependencies (direct and indirect) of a term
getAllDeps :: Book -> String -> S.Set String
getAllDeps book name = go S.empty [name] where
  go visited [] = visited
  go visited (x:xs)
    | S.member x visited = go visited xs
    | otherwise = case M.lookup x book of
        Just term -> go (S.insert x visited) (getDeps term ++ xs)
        Nothing   -> go (S.insert x visited) xs

-- Topologically sorts a book
topoSortBook :: Book -> [(String, Term)]
topoSortBook book = go (M.keysSet book) [] where
  go mustInclude done = case S.lookupMin mustInclude of
    Nothing   -> reverse done
    Just name -> 
      let (mustInclude', done') = include mustInclude done name
      in go mustInclude' done'

  include :: S.Set String -> [(String, Term)] -> String -> (S.Set String, [(String, Term)])
  include mustInclude done name =
    if not (S.member name mustInclude) then
      (mustInclude, done)
    else case M.lookup name book of
      Nothing ->
        error ("unbound:" ++ name)
      Just term ->
        let deps = getDeps term
            mustInclude' = S.delete name mustInclude
            (mustInclude'', done') = includeDeps mustInclude' done deps
        in (mustInclude'', (name,term) : done')

  includeDeps :: S.Set String -> [(String, Term)] -> [String] -> (S.Set String, [(String, Term)])
  includeDeps mustInclude done [] = (mustInclude, done)
  includeDeps mustInclude done (dep:deps) =
    let (mustInclude', done') = include mustInclude done dep
        (mustInclude'', done'') = includeDeps mustInclude' done' deps
    in (mustInclude'', done'')

-- Converts:
-- - from a Tele: `{ x:A y:(B x) ... }: (C x y ...)`
-- - to a type: `∀(x: A) ∀(y: (B x)) ... (C x y ...)`
teleToType :: Tele -> Term -> Int -> Term
teleToType (TRet _)           ret _   = ret
teleToType (TExt nam inp bod) ret dep = All nam inp (\x -> teleToType (bod x) ret (dep + 1))

-- Converts:
-- - from a Tele : `{ x:A y:(B x) ... }: (C x y ...)`
-- - to terms    : `([(Just "x", <A>), [(Just "y", <(B x)>)], ...], <(C x y ...)>)`
teleToTerms :: Tele -> Int -> ([(Maybe String, Term)], Term)
teleToTerms tele dep = go tele [] dep where
  go (TRet ret)         args _   = (reverse args, ret)
  go (TExt nam inp bod) args dep = go (bod (Var nam dep)) ((Just nam, Var nam dep) : args) (dep + 1)

getTeleNames :: Tele -> Int -> [String] -> [String]
getTeleNames (TRet _)           dep acc = reverse acc
getTeleNames (TExt name _ next) dep acc = getTeleNames (next (Var name dep)) (dep+1) (name:acc)

getTeleFields :: Tele -> Int -> [(String,Term)] -> [(String,Term)]
getTeleFields (TRet _)              dep acc = reverse acc
getTeleFields (TExt name ttyp next) dep acc = getTeleFields (next (Var name dep)) (dep+1) ((name,ttyp):acc)

getDatIndices :: Term -> [Term]
getDatIndices term = case term of
  ADT idxs _ _ -> idxs
  _            -> []

getType :: Term -> Term
getType (Ann _ val typ) = typ
getType _               = error "?"

getTerm :: Term -> Term
getTerm (Ann _ val typ) = val
getTerm _               = error "?"

getCtrName :: Ctr -> String
getCtrName (Ctr name _) = name

getADTCts :: Term -> [(String,Ctr)]
getADTCts (ADT _ cts _) = map (\ ctr -> (getCtrName ctr, ctr)) cts
getADTCts (Src loc val) = getADTCts val
getADTCts term          = error ("not-an-adt:" ++ showTerm term)

-- Given a typed term, return its argument's names
getArgNames :: Term -> [String]
getArgNames (Ann _ _ typ) = getForallNames typ
getArgNames (Src _ val)   = getArgNames val
getArgNames _             = []

-- Returns the names in a chain of foralls
getForallNames :: Term -> [String]
getForallNames (All nam _ bod) = nam : getForallNames (bod Set)
getForallNames (Src _ val)     = getForallNames val
getForallNames _               = []

getOpReturnType :: Oper -> Term -> Term
getOpReturnType ADD U64 = U64
getOpReturnType ADD F64 = F64
getOpReturnType SUB U64 = U64
getOpReturnType SUB F64 = F64
getOpReturnType MUL U64 = U64
getOpReturnType MUL F64 = F64
getOpReturnType DIV U64 = U64
getOpReturnType DIV F64 = F64
getOpReturnType MOD U64 = U64
getOpReturnType EQ  _   = U64
getOpReturnType NE  _   = U64
getOpReturnType LT  _   = U64
getOpReturnType GT  _   = U64
getOpReturnType LTE _   = U64
getOpReturnType GTE _   = U64
getOpReturnType AND U64 = U64
getOpReturnType OR  U64 = U64
getOpReturnType XOR U64 = U64
getOpReturnType LSH U64 = U64
getOpReturnType RSH U64 = U64
getOpReturnType opr trm = error ("Invalid opertor: " ++ (show opr) ++ " Invalid operand type: " ++ (showTerm trm))

checkValidType :: Term -> [Term] -> Int -> Env Bool
checkValidType typ validTypes dep = foldr (\t acc -> do
    isEqual <- equal typ t dep
    if isEqual then return True else acc
  ) (return False) validTypes

