import { Term } from "./core";

// :::::::::::::::::::::
// :: Stringification ::
// :::::::::::::::::::::

interface Opts {
  full_refs?: boolean;
}

export const show = (term: Term, nams: string[] = [], opts: Opts = {}) => {
  const format = (term: Term): string => {
    //function read_bits(term) {
    //var bits = [];
    ////λbe.λb0.λb1.(b0 ...)
    //var term = term[1].body[1].body[1].body;
    //while (term[0] !== "Var") {
    //bits.push(term[1].func[1].index === 1 ? 0 : 1);
    //term = term[1].argm[1].body[1].body[1].body;
    //}
    //return parseInt(bits.join(""), 2);
    //}

    // TODO: Figure out which type term here should have.
    // The problem is that I cannot find any constructor that has both body and func as data.
    function read_nums(term) {
      var nums = [];
      while (term[1].body[1].body[0] !== "Var") {
        term = term[1].body[1].body;
        nums.push(term[1].func[1].argm[1].numb);
        term = term[1].argm;
      }
      return nums;
    }
    try {
      var nums = read_nums(term);
    } catch (e) {
      return null;
    }
    var str = "";
    for (var i = 0; i < nums.length; ++i) {
      str += String.fromCharCode(nums[i]);
      if (/[\x00-\x08\x0E-\x1F\x80-\xFF]/.test(str[str.length - 1])) {
        return null; // non-printable; TODO: use a tag instead
      }
    }
    if (str.length > 0) {
      return '"' + str + '"';
    } else {
      return null;
    }
  };

  switch (term[0]) {
    case "Var":
      var name = nams[nams.length - term[1].index - 1];
      if (!name) {
        return "^" + term[1].index;
      } else {
        var suff = "";
        for (var i = 0; i < term[1].index; ++i) {
          if (nams[nams.length - i - 1] === name) {
            var suff = suff + "^";
          }
        }
        return name + suff;
      }
    case "Typ":
      return "Type";
    case "All":
      var curr_term: Term = term;
      var erase = [];
      var names = [];
      var types = [];
      while (curr_term[0] === "All") {
        erase.push(curr_term[1].eras);
        names.push(curr_term[1].name);
        types.push(
          show(curr_term[1].bind, nams.concat(names.slice(0, -1)), opts)
        );
        curr_term = curr_term[1].body;
      }
      var text = "(";
      for (var i = 0; i < names.length; ++i) {
        var not_last = i < names.length - 1;
        text += names[i] + (names[i].length > 0 ? ": " : ":") + types[i];
        text += erase[i] ? (not_last ? "; " : ";") : not_last ? ", " : "";
      }
      text += ") -> ";
      text += show(curr_term, nams.concat(names), opts);
      return text;
    case "Lam":
      var curr_term: Term = term;
      var formatted = format(curr_term);
      if (formatted) {
        return formatted;
      } else {
        var erase = [];
        var names = [];
        var types = [];
        while (curr_term[0] === "Lam") {
          erase.push(curr_term[1].eras);
          names.push(curr_term[1].name);
          types.push(
            curr_term[1].bind
              ? show(curr_term[1].bind, nams.concat(names.slice(0, -1)), opts)
              : null
          );
          curr_term = curr_term[1].body;
        }
        var text = "(";
        for (var i = 0; i < names.length; ++i) {
          var not_last = i < names.length - 1;
          text += names[i] + (types[i] !== null ? ": " + types[i] : "");
          text += erase[i] ? (not_last ? "; " : ";") : not_last ? ", " : "";
        }
        text += ") => ";
        text += show(curr_term, nams.concat(names), opts);
        return text;
      }
    case "App":
      var text = ")";
      var curr_term: Term = term;
      var last = true;
      while (curr_term[0] === "App") {
        text =
          show(curr_term[1].argm, nams, opts) +
          (curr_term[1].eras ? (!last ? "; " : ";") : !last ? ", " : "") +
          text;
        curr_term = curr_term[1].func;
        last = false;
      }
      var func: string;
      if (curr_term[0] === "Ref" || curr_term[0] === "Var") {
        func = show(curr_term, nams, opts);
      } else {
        func = "(" + show(curr_term, nams, opts) + ")";
      }
      return func + "(" + text;
    case "Num":
      return "Number";
    case "Val":
      return term[1].numb.toString();
    case "Op1":
    case "Op2":
      var func = term[1].func;
      var num0 = show(term[1].num0, nams, opts);
      var num1 = show(term[1].num1, nams, opts);
      return num0 + " " + func + " " + num1;
    case "Ite":
      var cond = show(term[1].cond, nams, opts);
      var if_t = show(term[1].if_t, nams, opts);
      var if_f = show(term[1].if_f, nams, opts);
      return "if " + cond + " then " + if_t + " else " + if_f;
    case "Slf":
      var name = term[1].name;
      var type = show(term[1].type, nams.concat([name]), opts);
      return "${" + name + "} " + type;
    case "New":
      var type = show(term[1].type, nams, opts);
      var expr = show(term[1].expr, nams, opts);
      return "new(" + type + ") " + expr;
    case "Use":
      var expr = show(term[1].expr, nams, opts);
      return "use(" + expr + ")";
    case "Ann":
      var type = show(term[1].type, nams, opts);
      var expr = show(term[1].expr, nams, opts);
      return expr + " :: " + type;
    case "Log":
      var expr = show(term[1].expr, nams, opts);
      return expr;
    case "Hol":
      return "?" + term[1].name;
    case "Ref":
      return !opts.full_refs
        ? term[1].name.replace(new RegExp(".*/", "g"), "")
        : term[1].name;
  }
};
