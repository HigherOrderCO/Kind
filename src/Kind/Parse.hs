module Kind.Parse where

import Prelude hiding (EQ, LT, GT)

import Kind.Type
import Kind.Reduce

import Highlight (highlightError, highlight)

import Data.Char (ord)
import qualified Data.Map.Strict as M
import Data.Functor.Identity (Identity)

import System.Exit (die)

import Text.Parsec ((<|>), getPosition, sourceLine, sourceColumn)
import Text.Parsec.Error (errorPos, errorMessages, showErrorMessages, ParseError, errorMessages, Message(..))
import qualified Text.Parsec as P

import Data.List (intercalate)

import System.Console.ANSI

type PState   = String
type Parser a = P.ParsecT String PState Identity a

doParseTerm :: String -> String -> IO Term
doParseTerm filename input =
  case P.runParser (withSrc parseTerm) filename filename input of
    Left err -> do
      showParseError filename input err
      die ""
    Right term -> return $ bind term []

doParseBook :: String -> String -> IO Book
doParseBook filename input =
  case P.runParser parseBook filename filename input of
    Left err -> do
      showParseError filename input err
      die ""
    Right book -> return book

extractExpectedTokens :: ParseError -> String
extractExpectedTokens err =
    let expectedMsgs = [msg | Expect msg <- errorMessages err]
    in intercalate ", " expectedMsgs

showParseError :: String -> String -> P.ParseError -> IO ()
showParseError filename input err = do
  let pos = errorPos err
  let line = sourceLine pos
  let col = sourceColumn pos
  let errorMsg = extractExpectedTokens err

  putStrLn $ setSGRCode [SetConsoleIntensity BoldIntensity] ++ "\nPARSE_ERROR" ++ setSGRCode [Reset]
  putStrLn $ "- expected: " ++ errorMsg
  putStrLn "- detected:"
  putStrLn $ highlightError (line, col) (line, col + 1) input
  putStrLn $ setSGRCode [SetUnderlining SingleUnderline] ++ filename ++ 
             setSGRCode [Reset] ++ " " ++ show line ++ ":" ++ show col

withSrc :: Parser Term -> Parser Term
withSrc parser = do
  ini <- getPosition
  val <- parser
  end <- getPosition
  nam <- P.getState
  let iniLoc = Loc nam (sourceLine ini) (sourceColumn ini)
  let endLoc = Loc nam (sourceLine end) (sourceColumn end)
  return $ Src (Cod iniLoc endLoc) val

parseTrivia :: Parser ()
parseTrivia = P.skipMany (parseSpace <|> parseComment) where
  parseSpace = do
    P.space
    return ()
  parseComment = P.try $ do
    P.string "//"
    P.skipMany (P.noneOf "\n")
    P.char '\n'
    return ()

parseTerm :: Parser Term
parseTerm = do
  parseTrivia
  P.choice
    [ parseAll
    , parseSwi
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
    , parseTxt
    , parseHol
    , parseMet
    , parseRef
    ]

parseAll = withSrc $ do
  P.string "∀"
  era <- P.optionMaybe (P.char '-')
  P.char '('
  nam <- parseName
  P.char ':'
  inp <- parseTerm
  P.char ')'
  bod <- parseTerm
  return $ All nam inp (\x -> bod)

parseLam = withSrc $ do
  P.string "λ"
  era <- P.optionMaybe (P.char '-')
  nam <- parseName
  bod <- parseTerm
  return $ Lam nam (\x -> bod)

parseApp = withSrc $ do
  P.char '('
  fun <- parseTerm
  args <- P.many $ do
    era <- P.optionMaybe (P.char '-')
    arg <- parseTerm
    return (era, arg)
  P.char ')'
  return $ foldl (\f (era, a) -> App f a) fun args

parseAnn = withSrc $ do
  P.char '{'
  val <- parseTerm
  parseTrivia
  P.char ':'
  chk <- P.option False (P.char ':' >> return True)
  typ <- parseTerm
  parseTrivia
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
  parseTrivia
  P.char ']'
  P.char '{'
  cts <- P.many $ P.try $ do
    parseTrivia
    P.char '#'
    nm <- parseName
    parseTrivia
    P.char '{'
    fs <- P.many $ P.try $ do
      fn <- parseName
      parseTrivia
      P.char ':'
      ft <- parseTerm
      return (fn, ft)
    parseTrivia
    P.char '}'
    parseTrivia
    P.char ':'
    rt <- parseTerm
    return $ Ctr nm fs rt
  parseTrivia
  P.char '}'
  return $ Dat scp cts

parseCon = withSrc $ do
  P.char '#'
  nam <- parseName
  parseTrivia
  P.char '{'
  arg <- P.many $ P.try $ parseTerm
  parseTrivia
  P.char '}'
  return $ Con nam arg

parseSwi = withSrc $ do
  P.try $ do
    P.string "λ{"
    parseTrivia
    P.string "0:"
  zero <- parseTerm
  parseTrivia
  P.string "_:"
  succ <- parseTerm
  parseTrivia
  P.char '}'
  return $ Swi zero succ

parseMat = withSrc $ do
  P.try $ P.string "λ{"
  cse <- P.many $ P.try $ do
    parseTrivia
    P.char '#'
    cnam <- parseName
    parseTrivia
    P.char ':'
    cbod <- parseTerm
    return (cnam, cbod)
  parseTrivia
  P.char '}'
  return $ Mat cse

parseRef = withSrc $ do
  name <- parseName
  return $ case name of
    "U32" -> U32
    _     -> Ref name

parseUse = withSrc $ do
  P.try (P.string "use ")
  nam <- parseName
  parseTrivia
  P.char '='
  val <- parseTerm
  bod <- parseTerm
  return $ Use nam val (\x -> bod)

parseLet = withSrc $ do
  P.try (P.string "let ")
  nam <- parseName
  parseTrivia
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
  parseTrivia
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
  parseTrivia
  typ <- P.optionMaybe $ do
    P.char ':'
    t <- parseTerm
    parseTrivia
    return t
  P.char '='
  val <- parseTerm
  parseTrivia
  case typ of
    Nothing -> return (name, val)
    Just t  -> return (name, bind (Ann False val t) [])
