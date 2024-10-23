-- //./Type.hs//

module Kind.Util where

import Kind.Type
import qualified Data.Set as S
import qualified Data.Map.Strict as M
import Debug.Trace

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

-- TODO: implement an algorithm that topologically sorts a book. that is, given
-- a book, it will return a list of terms, sorted by direct dependencies. terms
-- with no direct dependencies are placed in the beginning of the list. then,
-- each term that appears is such that all its dependencies come before it.
-- It works as follows:
-- first, we convert the book to a SET of names to be included.
-- then, we pop a name from that set, and pass it to the 'include' function.
-- the include function includes a give name in the result list.
-- that function receives a name, the set of names to be included, etc.
-- then, it checks if the name is on the set. if it isn't, we skip.
-- then, it REMOVES the name from the set.
-- then, it gets this term's list of dependencies (getDeps), and includes each (recursion).
-- then, we will push the term to the result list.
-- at the end, we will have just a list of (name,term) in topologically sorted order.


-- Topologically sorts a book
-- topoSortBook :: Book -> [(String, Term)]
-- topoSortBook book = go (M.keysSet book) [] where
  -- go names done = case S.lookupMin names of
    -- Nothing   -> done
    -- Just name -> include name names done

  -- include :: String -> S.Set String -> [(String, Term)] -> [(String, Term)]
  -- include name names done = 
    -- if not (S.member name names) then
      -- go names done
    -- else case M.lookup name book of
      -- Nothing ->
        -- go names done
      -- Just term ->
        -- let deps   = getDeps term
            -- names' = S.delete name names
            -- done'  = foldl (\acc dep -> include dep names' acc) done deps
        -- in (name, term) : go names' done'

-- This is wrong.
-- 1. the 'names' argument must be the first, and should be renamed to "mustInclude"
-- 2. the 'done' argument must be the second.
-- 3. 'include' should return the updated 'names' object, as well as the new 'done' list.
-- 4. to compute "done'", we must create an aux recursive function called
-- 'includeDeps' that receives the mustInclude set, the 'done' list, a list of
-- dep names. then, it recurses through the list of dep names, passing the
-- updated mustIncluded set down the recursion.

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
