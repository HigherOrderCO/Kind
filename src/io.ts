import * as js from "./fm-to-js";
import * as core from "./core";
import readline from "readline";

const run_io = (name: string, defs: core.Defs = {}) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  var make_fm_string = (str) => {
    return (function go(i) {
      if (i < str.length) {
        return (nil) => (cons) =>
          cons(str[i].charCodeAt(0))(go(i+1));
      } else {
        return (nil) => (cons) => nil;
      }
    })(0);
  };

  var read_fm_string = (str) => {
    let case_nil  = "";
    let case_cons = (head) => (tail) =>
      String.fromCharCode(head) + read_fm_string(tail);
    return str(case_nil)(case_cons);
  };

  var eval_io = (io: any) => {
    let case_exec = (eff) => (cont) => {
      let case_putval = (str) => () => {
        console.log(read_fm_string(str));
        return eval_io(cont(make_fm_string("")))();
      };
      let case_getval = () => {
        rl.question("> ", (line) => {
          return eval_io(cont(make_fm_string(line)))();
        });
      };
      return eff(case_putval)(case_getval);
    };
    let case_exit = (val) => {
      return () => {
        process.exit();
      };
    };
    return io(case_exec)(case_exit);
  };

  var js_code = js.compile(name, defs);
  eval_io(eval(js_code))();
};

export {run_io};
