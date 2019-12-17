import fs from "fs";
import replace from '@rollup/plugin-replace';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import commonjs from 'rollup-plugin-commonjs';
import builtins from 'builtin-modules';

const src_files = fs
  .readdirSync("./src/")
  .filter((x) => x.endsWith(".js") || x.endsWith(".ts"))
  .map((x) => `src/${x}`);
const version = JSON.parse(fs.readFileSync("./package.json")).version;

const replaceVersion = replace({ __VERSION__: version });
const external = ["bn.js", "ethereumjs-vm", "xhr-request-promise", "path", "util", "fs"];

export default [
  {
    input: src_files,
    plugins: [typescript(), replaceVersion],
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
  },
  {
    input: "src/index.ts",
    plugins: [typescript(), replaceVersion, resolve({mainFields: ['module', 'main', 'browser']}), commonjs()],
    external: builtins,
    output: {
      format: "umd",
      name: "formality",
      file: "dist/formality.umd.js"
    }
  }
]