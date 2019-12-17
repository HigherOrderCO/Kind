import fs from "fs";
import replace from '@rollup/plugin-replace';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import builtins from 'builtin-modules';

const src_files = fs
  .readdirSync("./src/")
  .filter((x) => x.endsWith(".js"))
  .map((x) => `src/${x}`);
const version = JSON.parse(fs.readFileSync("./package.json")).version;

const replaceVersion = replace({ __VERSION__: version });
const external = ["bn.js", "ethereumjs-vm", "xhr-request-promise", "path", "util", "fs"];

export default [
  {
    input: src_files,
    sourcemap: true,
    plugins: [replaceVersion],
    external,
    output: [
      {
        preserveModules: true,
        dir: 'cjs',
        format: 'cjs'
      },
      {
        preserveModules: true,
        dir: 'esm',
        format: 'esm'
      }
    ]
  },
  {
    input: "src/index.js",
    plugins: [replaceVersion, resolve({mainFields: ['module', 'main', 'browser']}), commonjs()],
    external: builtins,
    output: { 
      format: "umd",
      name: "formality",
      file: "umd/formality.umd.js"
    }
  }
]