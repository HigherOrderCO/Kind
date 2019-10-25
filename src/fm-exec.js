const lang = require("./fm-lang");
const to_net = require("./fm-to-net");
const to_js = require("./fm-to-js");
const json = require("./fm-json");

// Return a term or a reference to it based on a name
function name_to_term(name, defs) {
  if (defs[name] && defs[name][0] === "Ref" && !defs[defs[name][1].name]) {
    name = defs[name][1].name;
  }
  return defs[name] || lang.Ref(name);
}

// Returns the type of a term. Can pass a term or a name to it.
function type(term_or_name, defs, opts = {}) {
  const term = name_to_term_if_not_term(term_or_name, defs);
  lang.boxcheck(term, defs);
  const type = lang.typecheck(term, null, defs)

  return lang.norm(
    opts.erased ? lang.erase(type) : type,
    {},
    {weak: false, unbox: true}
  )
}

// Reduces a term to it's normal form using the optimal algorithm.
function optimal_reduce(term_or_name, defs, opts = {}) {
  const term = name_to_term_if_not_term(term_or_name, defs);
  let stats = opts.stats || {}
  let net = to_net.compile(lang.erase(term, defs), defs);

  if (stats.input_net === null) {
    stats.input_net = clone(net);
  }

  if (opts.strict) {
    net.reduce_strict(stats);
  } else {
    net.reduce_lazy(stats);
  }

  if (stats.output_net !== undefined) {
    stats.output_net = clone(net);
  }

  return to_net.decompile(net);
}

// Reduces a term to it's normal form using javascript functions (beta reduction)
function beta_reduce(term_or_name, defs, opts = {}) {
  const term = name_to_term_if_not_term(term_or_name, defs);
  return to_js.decompile(to_js.compile(lang.erase(term, defs), defs));
}

// Reduces a term to it's normal form using it's AST so it keeps more info that is useful for debug
// If weak is set to false, it will first try a non-weak reduction but if it fails it will fallback
// to a weak reduction.
function debug_reduce(term_or_name, defs, opts = {}) {
  const {erased, weak, unbox, logging} = opts;

  const term = name_to_term_if_not_term(term_or_name, defs);
  const erased_term = erased ? lang.erase(term) : term;

  try {
    return lang.norm(erased_term, defs, {unbox, logging, weak});
  } catch (e) {
    return lang.norm(erased_term, defs, {unbox, logging, weak: true});
  }
}

// Calls a formality function with a JS value using Json interop layer
// You can optionally specify a reducer function to use anything other than optimal reduction
function json_call(term_or_name, defs, argument, opts = {}) {
  const term = name_to_term_if_not_term(term_or_name, defs);

  lang.typecheck(term, json_to_json_type_term, defs);

  const argument_term = json.to(argument);
  const default_reducer = (term) => optimal_reduce(term, defs);
  const reducer = opts.reducer || default_reducer;
  const app_term = lang.App(term, argument_term, false);
  return json.from(reducer(app_term))
}

module.exports = {
  name_to_term,
  type,
  optimal_reduce,
  beta_reduce,
  debug_reduce,
  json_call
}

// Private helpers

function name_to_term_if_not_term(term_or_name, defs) {
  if(typeof term_or_name === "string") {
    return name_to_term(term_or_name, defs);
  }

  return term_or_name;
}

function clone(obj) {
  return JSON.parse(JSON.stringify(obj))
}

const json_type = 'Data.Json@0/Json'
const json_to_json_type_term = lang.All(
  "",
  lang.Ref(json_type),
  lang.Ref(json_type)
)