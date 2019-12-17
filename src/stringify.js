// :::::::::::::::::::::
// :: Stringification ::
// :::::::::::::::::::::

// Converts a term to a string
const show = (term, nams = [], opts = {}) => {
  let [ctor, args] = term;
  const format = (term) => {
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
      if (/[\x00-\x08\x0E-\x1F\x80-\xFF]/.test(str[str.length-1])) {
        return null; // non-printable; TODO: use a tag instead
      }
    }
    if (str.length > 0) {
      return '"' + str + '"';
    } else {
      return null;
    }
  }

  switch (ctor) {
    case "Var":
      var name = nams[nams.length - args.index - 1];
      if (!name) {
        return "^" + args.index;
      } else {
        var suff = "";
        for (var i = 0; i < args.index; ++i) {
          if (nams[nams.length - i - 1] === name) {
            var suff = suff + "^";
          }
        }
        return name + suff;
      }
    case "Typ":
      return "Type";
    case "All":
      var term = [ctor, args];
      var erase = [];
      var names = [];
      var types = [];
      while (term[0] === "All") {
        erase.push(term[1].eras);
        names.push(term[1].name);
        types.push(show(term[1].bind, nams.concat(names.slice(0,-1)), opts));
        term = term[1].body;
      }
      var text = "(";
      for (var i = 0; i < names.length; ++i) {
        var not_last = i < names.length - 1;
        text += names[i] + (names[i].length > 0 ? " : " : ":") + types[i];
        text += erase[i] ? (not_last ? "; " : ";") : not_last ? ", " : "";
      }
      text += ") -> ";
      text += show(term, nams.concat(names), opts);
      return text;
    case "Lam":
      var term = [ctor, args];
      var formatted = format(term);
      if (formatted) {
        return formatted;
      } else {
        var erase = [];
        var names = [];
        var types = [];
        while (term[0] === "Lam") {
          erase.push(term[1].eras);
          names.push(term[1].name);
          types.push(term[1].bind
            ? show(term[1].bind, nams.concat(names.slice(0,-1)), opts)
            : null);
          term = term[1].body;
        }
        var text = "(";
        for (var i = 0; i < names.length; ++i) {
          var not_last = i < names.length - 1;
          text += names[i] + (types[i] !== null ? " : " + types[i] : "");
          text += erase[i] ? (not_last ? "; " : ";") : not_last ? ", " : "";
        }
        text += ") => ";
        text += show(term, nams.concat(names), opts);
        return text;
      }
    case "App":
      var text = ")";
      var term = [ctor, args];
      var last = true;
      while (term[0] === "App") {
        text = show(term[1].argm, nams, opts)
             + (term[1].eras ? (!last ? "; " : ";") : !last ? ", " : "")
             + text;
        term = term[1].func;
        last = false;
      }
      if (term[0] === "Ref" || term[0] === "Var" || term[0] === "Tak") {
        var func = show(term, nams, opts);
      } else {
        var func = "(" + show(term,nams, opts) + ")";
      }
      return func + "(" + text;
    case "Num":
      return "Number";
    case "Val":
      return args.numb.toString();
    case "Op1":
    case "Op2":
      var func = args.func;
      var num0 = show(args.num0, nams, opts);
      var num1 = show(args.num1, nams, opts);
      return num0 + " " + func + " " + num1;
    case "Ite":
      var cond = show(args.cond, nams, opts);
      var if_t = show(args.if_t, nams, opts);
      var if_f = show(args.if_f, nams, opts);
      return "if " + cond + " then " + if_t + " else " + if_f;
    case "Slf":
      var name = args.name;
      var type = show(args.type, nams.concat([name]), opts);
      return "${" + name + "} " + type;
    case "New":
      var type = show(args.type, nams, opts);
      var expr = show(args.expr, nams, opts);
      return "new(" + type + ") " + expr;
    case "Use":
      var expr = show(args.expr, nams, opts);
      return "use(" + expr + ")";
    case "Ann":
      var type = show(args.type, nams, opts);
      var expr = show(args.expr, nams, opts);
      return expr + " :: " + type;
    case "Log":
      var expr = show(args.expr, nams, opts);
      return expr;
    case "Hol":
      return "?" + args.name;
    case "Ref":
      return !opts.full_refs ? args.name.replace(new RegExp(".*/", "g"), "") : args.name;
  }
};

export default show;
