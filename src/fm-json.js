const lang = require("./fm-lang");
const to_js = require("./fm-to-js");
const core = require("./fm-core");

// For now, we are converting the terms from and to JS-compiled Formality
// In the future we may convert from and to directly the Formality Core AST
module.exports = {
  to: (val) => to_js.decompile(json.to(val)),
  from: (term) => json.from(to_js.compile(term))
}

// A Mapper is responsible for mapping between JS and Formality types.
// It's basically two functions, to and from. To converts from JS to FormalityJS and from does the
// other way around.
// Some mappers are polymorphic (for polymorphic types, for example). Here they are represented as
// functions which return mappers.

const word = {
  to: (x) => x,
  from: (x) => x
}

const float = {
  to: core.put_float_on_word,
  from: core.get_float_on_word
}

const js_number = {
  to: (val) => (js_number) => js_number(float.to(val)),
  from: (enc) => enc(float.from)
}

const list = (type) => ({
  to: (val) => (cons) => (nil) => (
    val.length == 0
      ? nil
      : cons(type.to(val[0]))(list(type).to(val.slice(1)))
  ),
  from: (val) => {
    const cons = (head) => (tail) => [type.from(head)].concat(list(type).from(tail))
    const nil = []

    return val(cons)(nil)
  }
})

const string = {
  to: (str) => {
    let bytes = Array.from(new TextEncoder("utf-8").encode(str));
    while (bytes.length % 4 !== 0) {
      bytes.push(0);
    }
    const nums = new Uint32Array(new Uint8Array(bytes).buffer)
    return list(word).to(nums)
  },
  from: (enc) => {
    const nums = list(word).from(enc);
    const bytes = new Uint8Array(new Uint32Array(nums).buffer)
    const str = new TextDecoder("utf-8").decode(bytes)
    return str.replace(/\0*$/, '')
  }
}

const pair = (tfst, tsnd) => ({
  to: ([fst, snd]) => [tfst.to(fst), tsnd.to(snd)],
  from: ([fst, snd]) => [tfst.from(fst), tsnd.from(snd)]
})

// This is the main mapper of this module, which enables converting almost all JS objects
const json = {
  to: (val) => (j_null) => (j_number) => (j_string) => (j_list) => (j_object) => {
    if(val === null) {
      return j_null
    } else if(typeof val === "number") {
      return j_number(js_number.to(val))
    } else if(typeof val === "string") {
      return j_string(string.to(val))
    } else if (Array.isArray(val)) {
      return j_list(list(json).to(val))
    } else {
      return j_object(list(pair(string, json)).to(obj_to_kw(val)))
    }
  },
  from: (enc) => {
    const j_null = null
    const j_number = js_number.from
    const j_string = string.from
    const j_list = list(json).from
    const j_object = (o) => kw_to_obj(list(pair(string, json)).from(o))

    return enc(j_null)(j_number)(j_string)(j_list)(j_object)
  }
}

// Object to keyword list conversion
const obj_to_kw = (obj) => Object.keys(obj).map((key) => [key.toString(), obj[key]])
const kw_to_obj = (kw) => kw.reduce((obj, [k, v]) => ({[k]: v, ...obj}), {})