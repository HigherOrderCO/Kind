module Kind.Env where

import Kind.Type

import qualified Data.IntMap.Strict as IM
import qualified Data.Map.Strict as M

-- Environment
-- -----------

envBind :: Env a -> (a -> Env b) -> Env b
envBind (Env a) b = Env $ \state -> case a state of
  Done state' value -> let Env b' = b value in b' state'
  Fail state'       -> Fail state'

envPure :: a -> Env a
envPure a = Env $ \state -> Done state a

envFail :: Env a
envFail = Env $ \state -> Fail state

envRun :: Env a -> Book -> Res a
envRun (Env chk) book = chk (State book IM.empty [] [])

envLog :: Info -> Env Int
envLog log = Env $ \ (State book fill susp logs) -> Done (State book fill susp (log : logs)) 1

envSnapshot :: Env State
envSnapshot = Env $ \state -> Done state state

envRewind :: State -> Env Int
envRewind state = Env $ \_ -> Done state 0

envSusp :: Check -> Env ()
envSusp chk = Env $ \ (State book fill susp logs) -> Done (State book fill (susp ++ [chk]) logs) ()

envFill :: Int -> Term -> Env ()
envFill k v = Env $ \ (State book fill susp logs) -> Done (State book (IM.insert k v fill) susp logs) ()

envGetFill :: Env Fill
envGetFill = Env $ \ (State book fill susp logs) -> Done (State book fill susp logs) fill

envGetBook :: Env Book
envGetBook = Env $ \ (State book fill susp logs) -> Done (State book fill susp logs) book

envTakeSusp :: Env [Check]
envTakeSusp = Env $ \ (State book fill susp logs) -> Done (State book fill [] logs) susp

instance Functor Env where
  fmap f (Env chk) = Env $ \logs -> case chk logs of
    Done logs' a -> Done logs' (f a)
    Fail logs' -> Fail logs'

instance Applicative Env where
  pure = envPure
  (Env chkF) <*> (Env chkA) = Env $ \logs -> case chkF logs of
    Done logs' f -> case chkA logs' of
      Done logs'' a -> Done logs'' (f a)
      Fail logs'' -> Fail logs''
    Fail logs' -> Fail logs'

instance Monad Env where
  (Env a) >>= b = envBind (Env a) b
