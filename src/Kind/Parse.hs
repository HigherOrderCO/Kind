-- Files for context:

-- Kind-Lang parser in Rust:

-- //./../../../kind2/src/term/parse.rs//
-- //./../../../kind2/src/book/parse.rs//

-- Kind-Core types:

-- //./Type.hs//

-- ############################################################################

-- Now, file below is Kind-Core's parser, in Haskell. Note that:
-- The Kind-Lang parser (in Rust, above) has a high-level, user-friendly syntaxes.
-- The Kind-Core parser (in Haskell, below) has a low-level, raw, core syntax.
-- Our goal is to bring the high-level syntaxes to the Haskell version below.

module Kind.Parse where

import Prelude hiding (EQ, LT, GT)

import Kind.Type
import Kind.Reduce

import Data.Char (ord)
import qualified Data.Map.Strict as M
import Data.Functor.Identity (Identity)

import Text.Parsec ((<|>), getPosition, sourceLine, sourceColumn)
import qualified Text.Parsec as P

-- Parsing
-- -------

type PState   = String -- File name
type Parser a = P.ParsecT String PState Identity a

doParseTerm :: String -> String -> Term
doParseTerm filename input =
  case P.runParser (withSrc parseTerm) filename filename input of
    Left err -> error $ "Parse error: " ++ show err
    Right term -> bind term []

withSrc :: Parser Term -> Parser Term
withSrc parser = do
  ini <- getPosition
  val <- parser
  end <- getPosition
  nam <- P.getState
  let iniLoc = Loc nam (sourceLine ini) (sourceColumn ini)
  let endLoc = Loc nam (sourceLine end) (sourceColumn end)
  return $ Src (Cod iniLoc endLoc) val

parseTerm :: Parser Term
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
    , parseRef
    ]

parseAll = withSrc $ do
  P.string "∀"
  P.char '('
  nam <- parseName
  P.char ':'
  inp <- parseTerm
  P.char ')'
  bod <- parseTerm
  return $ All nam inp (\x -> bod)

parseLam = withSrc $ do
  P.string "λ"
  nam <- parseName
  bod <- parseTerm
  return $ Lam nam (\x -> bod)

parseApp = withSrc $ do
  P.char '('
  fun <- parseTerm
  arg <- P.many1 parseTerm
  P.char ')'
  return $ foldl App fun arg

parseAnn = withSrc $ do
  P.char '{'
  val <- parseTerm
  P.spaces
  P.char ':'
  chk <- P.option False (P.char ':' >> return True)
  typ <- parseTerm
  P.spaces
  P.char '}'
  return $ Ann chk val typ

parseSlf = withSrc $ do
  P.string "$("
  nam <- parseName
  P.char ':'
  typ <- parseTerm
  P.char ')'
  bod <- parseTerm
  return $ Slf nam typ (\x -> bod)

parseIns = withSrc $ do
  P.char '~'
  val <- parseTerm
  return $ Ins val

parseDat = withSrc $ do
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

parseCon = withSrc $ do
  P.char '#'
  nam <- parseName
  P.spaces
  P.char '{'
  arg <- P.many $ P.try $ parseTerm
  P.spaces
  P.char '}'
  return $ Con nam arg

parseMat = withSrc $ do
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

parseRef = withSrc $ do
  name <- parseName
  return $ case name of
    "U48" -> U48
    _     -> Ref name

parseUse = withSrc $ do
  P.try (P.string "use ")
  nam <- parseName
  P.spaces
  P.char '='
  val <- parseTerm
  bod <- parseTerm
  return $ Use nam val (\x -> bod)

parseLet = withSrc $ do
  P.try (P.string "let ")
  nam <- parseName
  P.spaces
  P.char '='
  val <- parseTerm
  bod <- parseTerm
  return $ Let nam val (\x -> bod)

parseSet = withSrc $ P.char '*' >> return Set

parseNum = withSrc $ Num . read <$> P.many1 P.digit

parseOp2 = withSrc $ do
  opr <- P.try $ do
    P.string "("
    opr <- parseOper
    return opr
  fst <- parseTerm
  snd <- parseTerm
  P.char ')'
  return $ Op2 opr fst snd

parseSwi = withSrc $ do
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

parseTxt = withSrc $ do
  P.char '"'
  txt <- P.many (P.noneOf "\"")
  P.char '"'
  return $ Txt txt

parseHol = withSrc $ do
  P.char '?'
  nam <- parseName
  ctx <- P.option [] $ do
    P.char '['
    terms <- P.sepBy parseTerm (P.char ',')
    P.char ']'
    return terms
  return $ Hol nam ctx

parseMet = withSrc $ do
  P.char '_'
  uid <- read <$> P.many1 P.digit
  return $ Met uid []

parseName :: Parser String
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

parseBook :: Parser Book
parseBook = do
  defs <- P.many parseDef
  return $ M.fromList defs

parseDef :: Parser (String, Term)
parseDef = do
  name <- parseName
  P.spaces
  typ <- P.optionMaybe $ do
    P.char ':'
    t <- parseTerm
    P.spaces
    return t
  P.char '='
  val <- parseTerm
  P.spaces
  case typ of
    Nothing -> return (name, val)
    Just t  -> return (name, bind (Ann False val t) [])

doParseBook :: String -> String -> Book
doParseBook filename input =
  case P.runParser parseBook filename filename input of
    Left err   -> error $ "Parse error: " ++ show err
    Right book -> book
