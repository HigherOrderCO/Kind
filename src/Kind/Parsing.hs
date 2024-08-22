module Kind.Parsing where

import Prelude hiding (EQ, LT, GT)

import Kind.Types
import Kind.Evaluation

import qualified Data.Map.Strict as M
import Text.Parsec ((<|>))
import qualified Text.Parsec as P
import Data.Char (ord)

-- Parsing
-- -------

doParseTerm :: String -> Term
doParseTerm input = case P.parse parseTerm "" input of
  Left  err  -> error $ "Parse error: " ++ show err
  Right term -> bind term []

parseTerm :: P.Parsec String () Term
parseTerm = do
  P.spaces
  P.choice
    [ parseAll
    , parseMat
    , parseLam
    , parseOp2
    , parseApp
    , parseAnn
    , parseSlf
    , parseIns
    , parseDat
    , parseCon
    , parseUse
    , parseLet
    , parseSet
    , parseNum
    , parseSwi
    , parseTxt
    , parseHol
    , parseMet
    , parseSrc
    , parseRef
    ]

parseAll = do
  P.string "∀"
  P.char '('
  nam <- parseName
  P.char ':'
  inp <- parseTerm
  P.char ')'
  bod <- parseTerm
  return $ All nam inp (\x -> bod)

parseLam = do
  P.string "λ"
  nam <- parseName
  bod <- parseTerm
  return $ Lam nam (\x -> bod)

parseApp = do
  P.char '('
  fun <- parseTerm
  arg <- parseTerm
  P.char ')'
  return $ App fun arg

parseAnn = do
  P.char '{'
  val <- parseTerm
  P.spaces
  P.char ':'
  chk <- P.option False (P.char ':' >> return True)
  typ <- parseTerm
  P.spaces
  P.char '}'
  return $ Ann chk val typ

parseSlf = do
  P.string "$("
  nam <- parseName
  P.char ':'
  typ <- parseTerm
  P.char ')'
  bod <- parseTerm
  return $ Slf nam typ (\x -> bod)

parseIns = do
  P.char '~'
  val <- parseTerm
  return $ Ins val

parseDat = do
  P.try $ P.string "#["
  scp <- do
    indices <- P.many $ P.try $ parseTerm
    return indices
  P.spaces
  P.char ']'
  P.char '{'
  cts <- P.many $ P.try $ do
    P.spaces
    P.char '#'
    nm <- parseName
    P.spaces
    P.char '{'
    fs <- P.many $ P.try $ do
      fn <- parseName
      P.spaces
      P.char ':'
      ft <- parseTerm
      return (fn, ft)
    P.spaces
    P.char '}'
    P.spaces
    P.char ':'
    rt <- parseTerm
    return $ Ctr nm fs rt
  P.spaces
  P.char '}'
  return $ Dat scp cts

parseCon = do
  P.char '#'
  nam <- parseName
  P.spaces
  P.char '{'
  arg <- P.many $ P.try $ parseTerm
  P.spaces
  P.char '}'
  return $ Con nam arg

parseMat = do
  P.try $ P.string "λ{"
  cse <- P.many $ P.try $ do
    P.spaces
    P.char '#'
    cnam <- parseName
    P.spaces
    P.char ':'
    cbod <- parseTerm
    return (cnam, cbod)
  P.spaces
  P.char '}'
  return $ Mat cse

parseRef = do
  name <- parseName
  return $ case name of
    "U48" -> U48
    _     -> Ref name

parseUse = do
  P.try (P.string "use ")
  nam <- parseName
  P.spaces
  P.char '='
  val <- parseTerm
  P.char ';'
  bod <- parseTerm
  return $ Use nam val (\x -> bod)

parseLet = do
  P.try (P.string "let ")
  nam <- parseName
  P.spaces
  P.char '='
  val <- parseTerm
  P.char ';'
  bod <- parseTerm
  return $ Let nam val (\x -> bod)

parseSet = P.char '*' >> return Set

parseNum = Num . read <$> P.many1 P.digit

parseOp2 = do
  opr <- P.try $ do
    P.string "("
    opr <- parseOper
    return opr
  fst <- parseTerm
  snd <- parseTerm
  P.char ')'
  return $ Op2 opr fst snd

parseSwi = do
  P.try (P.string "switch ")
  nam <- parseName
  P.spaces
  P.char '='
  x <- parseTerm
  P.spaces
  P.char '{'
  P.spaces
  P.string "0:"
  z <- parseTerm
  P.spaces
  P.string "_:"
  s <- parseTerm
  P.spaces
  P.char '}'
  P.char ':'
  p <- parseTerm
  return $ Swi nam x z (\k -> s) (\k -> p)

parseTxt = do
  P.char '"'
  txt <- P.many (P.noneOf "\"")
  P.char '"'
  return $ Txt txt

-- parseNat = do
  -- P.char '#'
  -- val <- read <$> P.many1 P.digit
  -- return $ Nat val

parseHol = do
  P.char '?'
  nam <- parseName
  ctx <- P.option [] $ do
    P.char '['
    terms <- P.sepBy parseTerm (P.char ',')
    P.char ']'
    return terms
  return $ Hol nam ctx

parseMet = do
  P.char '_'
  uid <- read <$> P.many1 P.digit
  return $ Met uid []

parseSrc = do
  P.char '!'
  src <- read <$> P.many1 P.digit
  val <- parseTerm
  return $ Src src val

parseName :: P.Parsec String () String
parseName = do
  P.spaces
  head <- P.letter
  tail <- P.many (P.alphaNum <|> P.char '/' <|> P.char '.' <|> P.char '_' <|> P.char '-')
  return (head : tail)

parseOper = P.choice
  [ P.try (P.string "+") >> return ADD
  , P.try (P.string "-") >> return SUB
  , P.try (P.string "*") >> return MUL
  , P.try (P.string "/") >> return DIV
  , P.try (P.string "%") >> return MOD
  , P.try (P.string "<=") >> return LTE
  , P.try (P.string ">=") >> return GTE
  , P.try (P.string "<") >> return LT
  , P.try (P.string ">") >> return GT
  , P.try (P.string "==") >> return EQ
  , P.try (P.string "!=") >> return NE
  , P.try (P.string "&") >> return AND
  , P.try (P.string "|") >> return OR
  , P.try (P.string "^") >> return XOR
  , P.try (P.string "<<") >> return LSH
  , P.try (P.string ">>") >> return RSH
  ]

parseBook :: P.Parsec String () Book
parseBook = do
  defs <- P.many parseDef
  return $ M.fromList defs

parseDef :: P.Parsec String () (String, Term)
parseDef = do
  name <- parseName
  P.spaces
  (typ, hasType) <- P.option (undefined, False) $ do
    P.char ':'
    typ <- parseTerm
    P.spaces
    return (typ, True)
  P.char '='
  value <- parseTerm
  P.char ';'
  P.spaces
  return (name, if hasType then Ann True value typ else value)

doParseBook :: String -> Book
doParseBook input = case P.parse parseBook "" input of
  Left  err  -> error $ "Parse error: " ++ show err
  Right book -> M.map (\x -> bind x []) book
