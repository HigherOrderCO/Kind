module.exports = {
  erase: function erase(term, unlet = false, dep = 0) {
    const id = {ctor: "Lam", body: {ctor: "Var", indx: 0}};
    switch (term.ctor) {
      case "Var":
        return {
          ctor: "Var",
          indx: dep - term.indx - 1,
        };
      case "Ref":
        return {ctor: "Ref", name: term.name};
      case "Typ":
        return id;
      case "All":
        return id;
      case "Lam":
        if (term.eras) {
          return erase(term.body(id), unlet, dep);
        } else {
          return {
            ctor: "Lam",
            name: term.name,
            body: erase(term.body({ctor: "Var", indx: dep}), unlet, dep + 1),
          };
        }
      case "App":
        if (term.eras) {
          return erase(term.func, unlet, dep);
        } else {
          return {
            ctor: "App",
            func: erase(term.func, unlet, dep),
            argm: erase(term.argm, unlet, dep),
          };
        }
      case "Let":
        if (unlet) {
          return erase(term.body(term.expr), unlet, dep);
        } else {
          return {
            ctor: "Let",
            name: term.name,
            expr: erase(term.expr, unlet, dep),
            body: erase(term.body({ctor: "Var", indx: dep}), unlet, dep + 1),
          };
        }
      case "Ann":
        return erase(term.expr, unlet, dep);
      case "Loc":
        return erase(term.expr, unlet, dep);
      case "Hol":
        throw "Can't compile hole.";
      default:
        throw "Can't compile "+term.ctor+".";
    };
  }
};

