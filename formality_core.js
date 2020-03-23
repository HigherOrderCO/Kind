// Term
// ====

function Var(name) {
  return {ctor: "Var", name};
};

function Ref(name) {
  return {ctor: "Ref", name};
};

function Typ() {
  return {ctor: "Typ"};
};

function All(name, bind, body) {
  return {ctor: "All", name, bind, body};
};

function Lam(name, body) {
  return {ctor: "Lam", name, body};
};

function Slf(name, expr) {
  return {ctor: "Slf", name, expr};
};

function Ins(expr) {
  return {ctor: "Ins", expr};
};

function Eli(expr) {
  return {ctor: "Eli", expr};
};

function Ann(type, expr, done) {
  return {ctor: "Typ", expr, done};
};

// Module
// ======

function Def(name, ttyp, tval, defs) {
  return {ctor: "Def", name, ttyp, tval, defs};
};

function Eof() {
  return {ctor: "Eof"};
};
