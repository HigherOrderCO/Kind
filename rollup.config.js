import fs from "fs";
import replace from '@rollup/plugin-replace';

const src_files = fs
  .readdirSync("./src/")
  .map((x) => `src/${x}`);
const version = JSON.parse(fs.readFileSync("./package.json")).version;

const replaceVersion = replace({ __VERSION__: version });
const external = ["bn.js", "ethereumjs-vm", "xhr-request-promise", "path", "util", "fs"];

export default [
  {
    input: src_files,
    plugins: [replaceVersion],
    external,
    output: [
      {
        dir: 'dist/cjs',
        format: 'cjs'
      },
      {
        dir: 'dist/esm',
        format: 'esm'
      }
    ]
  }
]