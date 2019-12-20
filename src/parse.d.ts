import { Loader } from "./loader";
import { Defs, Term } from "./core";

interface Opts {
  file?: string;
  loader?: Loader;
  tokenify?: boolean;
}

type TokenType = "???" | "cmm" | "def" | "doc" | "imp" | "sym" | "txt";
type Token = [TokenType, string];

interface Adt {
  adt_pram: [string, Term, boolean][];
  adt_indx: [string, Term, boolean][];
  adt_ctor: [string, [string, Term, boolean][], Term][];
  adt_name: string;
}

interface Parsed {
  defs: Defs;
  adts: Record<string, Adt>;
  tokens: Token[];
  local_imports: Record<string, boolean>;
  qual_imports: Record<string, string>;
  open_imports: Record<string, boolean>;
}

declare function parse(code: string, opts: Opts): Promise<Parsed>;

export default parse;
export { Opts, Parsed, Adt, TokenType, Token };
