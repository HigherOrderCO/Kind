const fs = require('fs');

const template = (src) => `
  const src = '${src}';
  let buf = null;

  const isNode = typeof process !== 'undefined' && process.versions != null && process.versions.node != null;
  if (isNode) {
    buf = Buffer.from(src, 'base64');
  } else {
    const raw = window.atob(src);
    const rawLength = raw.length;
    buf = new Uint8Array(new ArrayBuffer(rawLength));
    for(let i = 0; i < rawLength; i++) {
      buf[i] = raw.charCodeAt(i);
    }
  }

  var setTempRet0= function(x){global.tempRet0 = x};
  const config = {
    env : {
      setTempRet0 : setTempRet0
      , _llvm_trunc_f64 : function(x) {}
    }};
  const mod = new WebAssembly.Module(buf);
  const instance = new WebAssembly.Instance(mod, config);
  module.exports = instance.exports;
`.trim()

const convert = async (wasm_path) => {
  const match = wasm_path.match(/(.*)(\.wasm$)/);
  if(!match){
    console.log("File does not end with .wasm extension");
    process.exit(1);
  }

  if(!fs.existsSync(wasm_path)) {
    console.log("File does not exist");
    process.exit(1);
  }

  const target_path = `${match[1]}.js`
  const src = fs.readFileSync(wasm_path).toString('base64')
  fs.writeFileSync(target_path, template(src));
}

if(!process.argv[2]) {
  console.log("Please specify at least one .wasm file");
  process.exit(1);
}

(async () => {
  for(let i = 2; i < process.argv.length; i++) {
    const path = process.argv[i];
    console.log(`Converting ${path} to .js...`)
    await convert(path);
  }
})()
