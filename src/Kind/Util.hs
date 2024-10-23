-- //./Type.hs//

module Kind.Util where

import Kind.Show
import Kind.Type

import Debug.Trace
import qualified Data.Map.Strict as M
import qualified Data.Set as S

-- Gets dependencies of a term
getDeps :: Term -> [String]
getDeps term = case term of
  Ref nam       -> [nam]
  All _ inp out -> getDeps inp ++ getDeps (out Set)
  Lam _ bod     -> getDeps (bod Set)
  App fun arg   -> getDeps fun ++ getDeps arg
  Ann _ val typ -> getDeps val ++ getDeps typ
  Slf _ typ bod -> getDeps typ ++ getDeps (bod Set)
  Ins val       -> getDeps val
  ADT scp cts t -> concatMap getDeps scp ++ concatMap getDepsCtr cts ++ getDeps t
  Con _ arg     -> concatMap (getDeps . snd) arg
  Mat cse       -> concatMap (getDeps . snd) cse
  Let _ val bod -> getDeps val ++ getDeps (bod Set)
  Use _ val bod -> getDeps val ++ getDeps (bod Set)
  Op2 _ fst snd -> getDeps fst ++ getDeps snd
  Swi zer suc   -> getDeps zer ++ getDeps suc
  Src _ val     -> getDeps val
  Hol _ args    -> concatMap getDeps args
  Met _ args    -> concatMap getDeps args
  Log msg nxt   -> getDeps msg ++ getDeps nxt
  Var _ _       -> []
  Set           -> []
  U32           -> []
  Num _         -> []
  Txt _         -> []
  Lst elems     -> concatMap getDeps elems
  Nat _         -> []

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
