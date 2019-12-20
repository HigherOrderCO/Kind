import { Loader } from "./loader";
import { Defs, Term } from "./core";
import parse_impl from "./parse-impl";

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

type ParseFn = (code: string, opts: Opts) => Promise<Parsed>;

const parse = parse_impl as ParseFn;

export default parse;
export { Opts, Parsed };
