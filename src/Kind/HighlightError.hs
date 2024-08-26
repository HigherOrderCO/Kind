module Kind.HighlightError (highlightError) where

import Data.Char (ord)
import Data.List (foldl')
import Text.Printf (printf)

-- | Given a complete source file, highlights an error between two line ranges.
highlightError :: (Int, Int) -> (Int, Int) -> String -> String
highlightError (startLine, startCol) (endLine, endCol) file = 
    assert (startLine <= endLine && (startLine /= endLine || startCol <= endCol)) "Start position must be before or equal to end position" $
    let lines = zip [1..] (splitLines file)
        relevantLines = takeWhile (\(n, _) -> n <= endLine) $ dropWhile (\(n, _) -> n < startLine) lines
        color = "\x1b[4m\x1b[31m"
        reset = "\x1b[0m"
        numLen = length $ show endLine
    in buildDisplayText numLen color reset relevantLines startLine startCol endLine (endCol - 1)

buildDisplayText :: Int -> String -> String -> [(Int, String)] -> Int -> Int -> Int -> Int -> String
buildDisplayText numLen color reset lines startLine startCol endLine endCol =
    unlines $ map processLine lines
  where
    processLine (lineNum, line)
      | lineNum == startLine && lineNum == endLine =
          let (pre, mid, post) = splitLine line startCol endCol
          in formatLine lineNum pre (color ++ mid ++ reset) post
      | lineNum == startLine =
          let (pre, post) = splitAt (startCol - 1) line
          in formatLine lineNum pre (color ++ post) ""
      | lineNum == endLine =
          let (pre, post) = splitAt endCol line
          in formatLine lineNum "" (color ++ pre ++ reset) post
      | startLine < lineNum && lineNum < endLine =
          formatLine lineNum "" (color ++ line) ""
      | otherwise =
          formatLine lineNum "" line ""

    formatLine lineNum pre mid post =
        let lineNumStr = pad numLen (show lineNum)
        in printf " %s |   %s%s%s" lineNumStr pre mid post

-- | Splits a line into three parts: before highlight, highlighted, after highlight
splitLine :: String -> Int -> Int -> (String, String, String)
splitLine line start end = 
    let (pre, rest) = splitAt (start - 1) line
        (mid, post) = splitAt (end - start + 1) rest
    in (pre, mid, post)

-- | Splits a string into lines
splitLines :: String -> [String]
splitLines [] = []
splitLines s = let (l, s') = break (== '\n') s
               in l : case s' of
                        []      -> []
                        (_:s'') -> splitLines s''

-- | Pads a string with spaces to the left
pad :: Int -> String -> String
pad len txt = replicate (max (len - length txt) 0) ' ' ++ txt

-- | Simple assertion function
assert :: Bool -> String -> a -> a
assert True _ x = x
assert False msg _ = error msg
