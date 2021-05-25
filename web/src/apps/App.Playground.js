module.exports = function() {
    function word_to_u16(w) {
        var u = 0;
        for (var i = 0; i < 16; ++i) {
            u = u | (w._ === "Word.i" ? 1 << i : 0);
            w = w.pred;
        }
        return u;
    }
    function u16_to_word(u) {
        var w = {
            _: "Word.e"
        };
        for (var i = 0; i < 16; ++i) {
            w = {
                _: u >>> 16 - i - 1 & 1 ? "Word.i" : "Word.o",
                pred: w
            };
        }
        return w;
    }
    function u16_to_bits(x) {
        var s = "";
        for (var i = 0; i < 16; ++i) {
            s = (x & 1 ? "1" : "0") + s;
            x = x >>> 1;
        }
        return s;
    }
    function word_to_u32(w) {
        var u = 0;
        for (var i = 0; i < 32; ++i) {
            u = u | (w._ === "Word.i" ? 1 << i : 0);
            w = w.pred;
        }
        return u;
    }
    function u32_to_word(u) {
        var w = {
            _: "Word.e"
        };
        for (var i = 0; i < 32; ++i) {
            w = {
                _: u >>> 32 - i - 1 & 1 ? "Word.i" : "Word.o",
                pred: w
            };
        }
        return w;
    }
    function u32_for(state, from, til, func) {
        for (var i = from; i < til; ++i) {
            state = func(i)(state);
        }
        return state;
    }
    function word_to_u64(w) {
        var u = 0n;
        for (var i = 0n; i < 64n; i += 1n) {
            u = u | (w._ === "Word.i" ? 1n << i : 0n);
            w = w.pred;
        }
        return u;
    }
    function u64_to_word(u) {
        var w = {
            _: "Word.e"
        };
        for (var i = 0n; i < 64n; i += 1n) {
            w = {
                _: u >> 64n - i - 1n & 1n ? "Word.i" : "Word.o",
                pred: w
            };
        }
        return w;
    }
    function u32array_to_buffer32(a) {
        function go(a, buffer) {
            switch (a._) {
              case "Array.tip":
                buffer.push(a.value);
                break;

              case "Array.tie":
                go(a.lft, buffer);
                go(a.rgt, buffer);
                break;
            }
            return buffer;
        }
        return new Uint32Array(go(a, []));
    }
    function buffer32_to_u32array(b) {
        function go(b) {
            if (b.length === 1) {
                return {
                    _: "Array.tip",
                    value: b[0]
                };
            } else {
                var lft = go(b.slice(0, b.length / 2));
                var rgt = go(b.slice(b.length / 2));
                return {
                    _: "Array.tie",
                    lft: lft,
                    rgt: rgt
                };
            }
        }
        return go(b);
    }
    function buffer32_to_depth(b) {
        return BigInt(Math.log(b.length) / Math.log(2));
    }
    var bitsmap_new = {
        _: "BitsMap.new"
    };
    var bitsmap_tie = function(val, lft, rgt) {
        return {
            _: "BitsMap.tip",
            val: val,
            lft: lft,
            rgt: rgt
        };
    };
    var maybe_none = {
        _: "Maybe.none"
    };
    var maybe_some = function(value) {
        return {
            _: "Maybe.some",
            value: value
        };
    };
    var bitsmap_get = function(bits, map) {
        for (var i = bits.length - 1; i >= 0; --i) {
            if (map._ !== "BitsMap.new") {
                map = bits[i] === "0" ? map.lft : map.rgt;
            }
        }
        return map._ === "BitsMap.new" ? maybe_none : map.val;
    };
    var bitsmap_set = function(bits, val, map, mode) {
        var res = {
            value: map
        };
        var key = "value";
        var obj = res;
        for (var i = bits.length - 1; i >= 0; --i) {
            var map = obj[key];
            if (map._ === "BitsMap.new") {
                obj[key] = {
                    _: "BitsMap.tie",
                    val: maybe_none,
                    lft: bitsmap_new,
                    rgt: bitsmap_new
                };
            } else {
                obj[key] = {
                    _: "BitsMap.tie",
                    val: map.val,
                    lft: map.lft,
                    rgt: map.rgt
                };
            }
            obj = obj[key];
            key = bits[i] === "0" ? "lft" : "rgt";
        }
        var map = obj[key];
        if (map._ === "BitsMap.new") {
            var x = mode === "del" ? maybe_none : {
                _: "Maybe.some",
                value: val
            };
            obj[key] = {
                _: "BitsMap.tie",
                val: x,
                lft: bitsmap_new,
                rgt: bitsmap_new
            };
        } else {
            var x = mode === "set" ? {
                _: "Maybe.some",
                value: val
            } : mode === "del" ? maybe_none : map.val;
            obj[key] = {
                _: "BitsMap.tie",
                val: x,
                lft: map.lft,
                rgt: map.rgt
            };
        }
        return res.value;
    };
    const inst_unit = x => x(null);
    const elim_unit = x => {
        var $1 = (() => c0 => {
            var self = x;
            switch ("unit") {
              case "unit":
                var $0 = c0;
                return $0;
            }
        })();
        return $1;
    };
    const inst_bool = x => x(true)(false);
    const elim_bool = x => {
        var $4 = (() => c0 => c1 => {
            var self = x;
            if (self) {
                var $2 = c0;
                return $2;
            } else {
                var $3 = c1;
                return $3;
            }
        })();
        return $4;
    };
    const inst_nat = x => x(0n)(x0 => 1n + x0);
    const elim_nat = x => {
        var $8 = (() => c0 => c1 => {
            var self = x;
            if (self === 0n) {
                var $5 = c0;
                return $5;
            } else {
                var $6 = self - 1n;
                var $7 = c1($6);
                return $7;
            }
        })();
        return $8;
    };
    const inst_bits = x => x("")(x0 => x0 + "0")(x0 => x0 + "1");
    const elim_bits = x => {
        var $14 = (() => c0 => c1 => c2 => {
            var self = x;
            switch (self.length === 0 ? "e" : self[self.length - 1] === "0" ? "o" : "i") {
              case "o":
                var $9 = self.slice(0, -1);
                var $10 = c1($9);
                return $10;

              case "i":
                var $11 = self.slice(0, -1);
                var $12 = c2($11);
                return $12;

              case "e":
                var $13 = c0;
                return $13;
            }
        })();
        return $14;
    };
    const inst_u16 = x => x(x0 => word_to_u16(x0));
    const elim_u16 = x => {
        var $17 = (() => c0 => {
            var self = x;
            switch ("u16") {
              case "u16":
                var $15 = u16_to_word(self);
                var $16 = c0($15);
                return $16;
            }
        })();
        return $17;
    };
    const inst_u32 = x => x(x0 => word_to_u32(x0));
    const elim_u32 = x => {
        var $20 = (() => c0 => {
            var self = x;
            switch ("u32") {
              case "u32":
                var $18 = u32_to_word(self);
                var $19 = c0($18);
                return $19;
            }
        })();
        return $20;
    };
    const inst_u64 = x => x(x0 => word_to_u64(x0));
    const elim_u64 = x => {
        var $23 = (() => c0 => {
            var self = x;
            switch ("u64") {
              case "u64":
                var $21 = u64_to_word(self);
                var $22 = c0($21);
                return $22;
            }
        })();
        return $23;
    };
    const inst_string = x => x("")(x0 => x1 => String.fromCharCode(x0) + x1);
    const elim_string = x => {
        var $28 = (() => c0 => c1 => {
            var self = x;
            if (self.length === 0) {
                var $24 = c0;
                return $24;
            } else {
                var $25 = self.charCodeAt(0);
                var $26 = self.slice(1);
                var $27 = c1($25)($26);
                return $27;
            }
        })();
        return $28;
    };
    const inst_buffer32 = x => x(x0 => x1 => u32array_to_buffer32(x1));
    const elim_buffer32 = x => {
        var $32 = (() => c0 => {
            var self = x;
            switch ("b32") {
              case "b32":
                var $29 = buffer32_to_depth(self);
                var $30 = buffer32_to_u32array(self);
                var $31 = c0($29)($30);
                return $31;
            }
        })();
        return $32;
    };
    function App$Store$new$(_local$2, _global$3) {
        var $33 = {
            _: "App.Store.new",
            local: _local$2,
            global: _global$3
        };
        return $33;
    }
    const App$Store$new = x0 => x1 => App$Store$new$(x0, x1);
    function Pair$new$(_fst$3, _snd$4) {
        var $34 = {
            _: "Pair.new",
            fst: _fst$3,
            snd: _snd$4
        };
        return $34;
    }
    const Pair$new = x0 => x1 => Pair$new$(x0, x1);
    const App$State$new = Pair$new$(null, null);
    const App$Playground$State = App$State$new;
    function App$Playground$State$local$new$(_device$1, _window$2, _mouse_over$3, _code$4, _output$5) {
        var $35 = {
            _: "App.Playground.State.local.new",
            device: _device$1,
            window: _window$2,
            mouse_over: _mouse_over$3,
            code: _code$4,
            output: _output$5
        };
        return $35;
    }
    const App$Playground$State$local$new = x0 => x1 => x2 => x3 => x4 => App$Playground$State$local$new$(x0, x1, x2, x3, x4);
    const Device$big_desktop = {
        _: "Device.big_desktop"
    };
    const App$Playground$Window$input = {
        _: "App.Playground.Window.input"
    };
    const App$Playground$State$local_empty = App$Playground$State$local$new$(Device$big_desktop, App$Playground$Window$input, "", "", "");
    const Unit$new = null;
    function DOM$node$(_tag$1, _props$2, _style$3, _children$4) {
        var $36 = {
            _: "DOM.node",
            tag: _tag$1,
            props: _props$2,
            style: _style$3,
            children: _children$4
        };
        return $36;
    }
    const DOM$node = x0 => x1 => x2 => x3 => DOM$node$(x0, x1, x2, x3);
    function BitsMap$(_A$1) {
        var $37 = null;
        return $37;
    }
    const BitsMap = x0 => BitsMap$(x0);
    function Map$(_V$1) {
        var $38 = null;
        return $38;
    }
    const Map = x0 => Map$(x0);
    const BitsMap$new = {
        _: "BitsMap.new"
    };
    function BitsMap$tie$(_val$2, _lft$3, _rgt$4) {
        var $39 = {
            _: "BitsMap.tie",
            val: _val$2,
            lft: _lft$3,
            rgt: _rgt$4
        };
        return $39;
    }
    const BitsMap$tie = x0 => x1 => x2 => BitsMap$tie$(x0, x1, x2);
    function Maybe$some$(_value$2) {
        var $40 = {
            _: "Maybe.some",
            value: _value$2
        };
        return $40;
    }
    const Maybe$some = x0 => Maybe$some$(x0);
    const Maybe$none = {
        _: "Maybe.none"
    };
    const BitsMap$set = a0 => a1 => a2 => bitsmap_set(a0, a1, a2, "set");
    const Bits$e = "";
    const Bits$o = a0 => a0 + "0";
    const Bits$i = a0 => a0 + "1";
    const Bits$concat = a0 => a1 => a1 + a0;
    function Word$to_bits$(_a$2) {
        var self = _a$2;
        switch (self._) {
          case "Word.o":
            var $42 = self.pred;
            var $43 = Word$to_bits$($42) + "0";
            var $41 = $43;
            break;

          case "Word.i":
            var $44 = self.pred;
            var $45 = Word$to_bits$($44) + "1";
            var $41 = $45;
            break;

          case "Word.e":
            var $46 = Bits$e;
            var $41 = $46;
            break;
        }
        return $41;
    }
    const Word$to_bits = x0 => Word$to_bits$(x0);
    function Nat$succ$(_pred$1) {
        var $47 = 1n + _pred$1;
        return $47;
    }
    const Nat$succ = x0 => Nat$succ$(x0);
    const Nat$zero = 0n;
    const U16$to_bits = a0 => u16_to_bits(a0);
    function String$to_bits$(_str$1) {
        var self = _str$1;
        if (self.length === 0) {
            var $49 = Bits$e;
            var $48 = $49;
        } else {
            var $50 = self.charCodeAt(0);
            var $51 = self.slice(1);
            var $52 = String$to_bits$($51) + u16_to_bits($50);
            var $48 = $52;
        }
        return $48;
    }
    const String$to_bits = x0 => String$to_bits$(x0);
    function Map$from_list$(_xs$2) {
        var self = _xs$2;
        switch (self._) {
          case "List.cons":
            var $54 = self.head;
            var $55 = self.tail;
            var self = $54;
            switch (self._) {
              case "Pair.new":
                var $57 = self.fst;
                var $58 = self.snd;
                var $59 = bitsmap_set(String$to_bits$($57), $58, Map$from_list$($55), "set");
                var $56 = $59;
                break;
            }
            ;
            var $53 = $56;
            break;

          case "List.nil":
            var $60 = BitsMap$new;
            var $53 = $60;
            break;
        }
        return $53;
    }
    const Map$from_list = x0 => Map$from_list$(x0);
    function List$cons$(_head$2, _tail$3) {
        var $61 = {
            _: "List.cons",
            head: _head$2,
            tail: _tail$3
        };
        return $61;
    }
    const List$cons = x0 => x1 => List$cons$(x0, x1);
    function Pair$(_A$1, _B$2) {
        var $62 = null;
        return $62;
    }
    const Pair = x0 => x1 => Pair$(x0, x1);
    const List$nil = {
        _: "List.nil"
    };
    const App$Playground$constant$light_gray_color = "#E0E0E0";
    const App$Playground$constant$white_smoke = "#F5F5F5";
    function DOM$text$(_value$1) {
        var $63 = {
            _: "DOM.text",
            value: _value$1
        };
        return $63;
    }
    const DOM$text = x0 => DOM$text$(x0);
    const Bool$true = true;
    const Bool$false = false;
    const Bool$and = a0 => a1 => a0 && a1;
    function Cmp$as_eql$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
          case "Cmp.ltn":
          case "Cmp.gtn":
            var $65 = Bool$false;
            var $64 = $65;
            break;

          case "Cmp.eql":
            var $66 = Bool$true;
            var $64 = $66;
            break;
        }
        return $64;
    }
    const Cmp$as_eql = x0 => Cmp$as_eql$(x0);
    const Cmp$ltn = {
        _: "Cmp.ltn"
    };
    const Cmp$gtn = {
        _: "Cmp.gtn"
    };
    function Word$cmp$go$(_a$2, _b$3, _c$4) {
        var self = _a$2;
        switch (self._) {
          case "Word.o":
            var $68 = self.pred;
            var $69 = _b$7 => {
                var self = _b$7;
                switch (self._) {
                  case "Word.o":
                    var $71 = self.pred;
                    var $72 = _a$pred$10 => {
                        var $73 = Word$cmp$go$(_a$pred$10, $71, _c$4);
                        return $73;
                    };
                    var $70 = $72;
                    break;

                  case "Word.i":
                    var $74 = self.pred;
                    var $75 = _a$pred$10 => {
                        var $76 = Word$cmp$go$(_a$pred$10, $74, Cmp$ltn);
                        return $76;
                    };
                    var $70 = $75;
                    break;

                  case "Word.e":
                    var $77 = _a$pred$8 => {
                        var $78 = _c$4;
                        return $78;
                    };
                    var $70 = $77;
                    break;
                }
                var $70 = $70($68);
                return $70;
            };
            var $67 = $69;
            break;

          case "Word.i":
            var $79 = self.pred;
            var $80 = _b$7 => {
                var self = _b$7;
                switch (self._) {
                  case "Word.o":
                    var $82 = self.pred;
                    var $83 = _a$pred$10 => {
                        var $84 = Word$cmp$go$(_a$pred$10, $82, Cmp$gtn);
                        return $84;
                    };
                    var $81 = $83;
                    break;

                  case "Word.i":
                    var $85 = self.pred;
                    var $86 = _a$pred$10 => {
                        var $87 = Word$cmp$go$(_a$pred$10, $85, _c$4);
                        return $87;
                    };
                    var $81 = $86;
                    break;

                  case "Word.e":
                    var $88 = _a$pred$8 => {
                        var $89 = _c$4;
                        return $89;
                    };
                    var $81 = $88;
                    break;
                }
                var $81 = $81($79);
                return $81;
            };
            var $67 = $80;
            break;

          case "Word.e":
            var $90 = _b$5 => {
                var $91 = _c$4;
                return $91;
            };
            var $67 = $90;
            break;
        }
        var $67 = $67(_b$3);
        return $67;
    }
    const Word$cmp$go = x0 => x1 => x2 => Word$cmp$go$(x0, x1, x2);
    const Cmp$eql = {
        _: "Cmp.eql"
    };
    function Word$cmp$(_a$2, _b$3) {
        var $92 = Word$cmp$go$(_a$2, _b$3, Cmp$eql);
        return $92;
    }
    const Word$cmp = x0 => x1 => Word$cmp$(x0, x1);
    function Word$eql$(_a$2, _b$3) {
        var $93 = Cmp$as_eql$(Word$cmp$(_a$2, _b$3));
        return $93;
    }
    const Word$eql = x0 => x1 => Word$eql$(x0, x1);
    const U16$eql = a0 => a1 => a0 === a1;
    const String$eql = a0 => a1 => a0 === a1;
    function BitsMap$union$(_a$2, _b$3) {
        var self = _a$2;
        switch (self._) {
          case "BitsMap.tie":
            var $95 = self.val;
            var $96 = self.lft;
            var $97 = self.rgt;
            var self = _b$3;
            switch (self._) {
              case "BitsMap.tie":
                var $99 = self.val;
                var $100 = self.lft;
                var $101 = self.rgt;
                var self = $95;
                switch (self._) {
                  case "Maybe.none":
                    var $103 = BitsMap$tie$($99, BitsMap$union$($96, $100), BitsMap$union$($97, $101));
                    var $102 = $103;
                    break;

                  case "Maybe.some":
                    var $104 = BitsMap$tie$($95, BitsMap$union$($96, $100), BitsMap$union$($97, $101));
                    var $102 = $104;
                    break;
                }
                ;
                var $98 = $102;
                break;

              case "BitsMap.new":
                var $105 = _a$2;
                var $98 = $105;
                break;
            }
            ;
            var $94 = $98;
            break;

          case "BitsMap.new":
            var $106 = _b$3;
            var $94 = $106;
            break;
        }
        return $94;
    }
    const BitsMap$union = x0 => x1 => BitsMap$union$(x0, x1);
    function Map$union$(_a$2, _b$3) {
        var $107 = BitsMap$union$(_a$2, _b$3);
        return $107;
    }
    const Map$union = x0 => x1 => Map$union$(x0, x1);
    const App$Kind$constant$secondary_color = "#3891A6";
    function App$Playground$comp$btn_run_code$(_mouse_over$1) {
        var _is_hover$2 = "btn_run_code" === _mouse_over$1;
        var _normal$3 = Map$from_list$(List$cons$(Pair$new$("width", "50px"), List$cons$(Pair$new$("height", "25px"), List$cons$(Pair$new$("margin", "5px 0px"), List$cons$(Pair$new$("color", "white"), List$cons$(Pair$new$("cursor", "pointer"), List$cons$(Pair$new$("border", "none"), List$cons$(Pair$new$("border-radius", "4px"), List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("justify-content", "center"), List$cons$(Pair$new$("align-content", "center"), List$cons$(Pair$new$("align-items", "center"), List$nil))))))))))));
        var $108 = DOM$node$("div", Map$from_list$(List$cons$(Pair$new$("id", "btn_run_code"), List$nil)), (() => {
            var self = _is_hover$2;
            if (self) {
                var $109 = Map$union$(_normal$3, Map$from_list$(List$cons$(Pair$new$("background-color", "#44B8D3"), List$nil)));
                return $109;
            } else {
                var $110 = Map$union$(_normal$3, Map$from_list$(List$cons$(Pair$new$("background-color", App$Kind$constant$secondary_color), List$nil)));
                return $110;
            }
        })(), List$cons$(DOM$text$("check"), List$nil));
        return $108;
    }
    const App$Playground$comp$btn_run_code = x0 => App$Playground$comp$btn_run_code$(x0);
    function App$Playground$comp$header$(_device$1, _mouse_over$2, _window$3) {
        var _playground$4 = DOM$node$("div", Map$from_list$(List$cons$(Pair$new$("id", "input_view"), List$nil)), Map$from_list$(List$cons$(Pair$new$("font-size", "14px"), List$cons$(Pair$new$("height", "35px"), List$cons$(Pair$new$("padding", "8px 15px 0px 15px"), List$cons$(Pair$new$("background-color", (() => {
            var self = _window$3;
            switch (self._) {
              case "App.Playground.Window.input":
                var $112 = App$Playground$constant$light_gray_color;
                return $112;

              case "App.Playground.Window.terminal":
                var $113 = App$Playground$constant$white_smoke;
                return $113;
            }
        })()), List$cons$(Pair$new$("display", "flex"), List$nil)))))), List$cons$(DOM$text$("playground.kind"), List$nil));
        var _btn_run$5 = App$Playground$comp$btn_run_code$(_mouse_over$2);
        var _style_header$6 = Map$from_list$(List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("flex-direction", "row"), List$cons$(Pair$new$("justify-content", "space-between"), List$cons$(Pair$new$("align-content", "center"), List$cons$(Pair$new$("justify-content", "center"), List$nil))))));
        var self = _device$1;
        switch (self._) {
          case "Device.phone":
            var _terminal$7 = DOM$node$("div", Map$from_list$(List$cons$(Pair$new$("id", "terminal_view"), List$nil)), Map$from_list$(List$cons$(Pair$new$("font-size", "14px"), List$cons$(Pair$new$("height", "35px"), List$cons$(Pair$new$("padding", "8px 15px 0px 15px"), List$cons$(Pair$new$("background-color", (() => {
                var self = _window$3;
                switch (self._) {
                  case "App.Playground.Window.input":
                    var $115 = App$Playground$constant$white_smoke;
                    return $115;

                  case "App.Playground.Window.terminal":
                    var $116 = App$Playground$constant$light_gray_color;
                    return $116;
                }
            })()), List$cons$(Pair$new$("display", "flex"), List$nil)))))), List$cons$(DOM$text$("output"), List$nil));
            var $114 = DOM$node$("div", Map$from_list$(List$nil), _style_header$6, List$cons$(DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("justify-content", "flex-start"), List$cons$(Pair$new$("flex-direction", "row"), List$nil)))), List$cons$(_playground$4, List$cons$(_terminal$7, List$nil))), List$cons$(_btn_run$5, List$nil)));
            var $111 = $114;
            break;

          case "Device.tablet":
          case "Device.desktop":
          case "Device.big_desktop":
            var $117 = DOM$node$("div", Map$from_list$(List$nil), _style_header$6, List$cons$(_playground$4, List$cons$(_btn_run$5, List$nil)));
            var $111 = $117;
            break;
        }
        return $111;
    }
    const App$Playground$comp$header = x0 => x1 => x2 => App$Playground$comp$header$(x0, x1, x2);
    function String$cons$(_head$1, _tail$2) {
        var $118 = String.fromCharCode(_head$1) + _tail$2;
        return $118;
    }
    const String$cons = x0 => x1 => String$cons$(x0, x1);
    const String$concat = a0 => a1 => a0 + a1;
    function App$Playground$comp$input$(_code$1) {
        var $119 = DOM$node$("textarea", Map$from_list$(List$cons$(Pair$new$("id", "input_code"), List$cons$(Pair$new$("placeholder", "Write Kind code in this online editor and run it <3"), List$nil))), Map$from_list$(List$cons$(Pair$new$("cols", "100"), List$cons$(Pair$new$("height", "100%"), List$cons$(Pair$new$("border", "solid 5px " + App$Playground$constant$light_gray_color), List$cons$(Pair$new$("resize", "none"), List$cons$(Pair$new$("padding", "10px"), List$nil)))))), List$cons$(DOM$text$(_code$1), List$nil));
        return $119;
    }
    const App$Playground$comp$input = x0 => App$Playground$comp$input$(x0);
    function App$Playground$comp$output_area$(_output$1, _device$2) {
        var _style$3 = Map$from_list$(List$cons$(Pair$new$("width", "400px"), List$cons$(Pair$new$("max-width", "500px"), List$cons$(Pair$new$("overflow", "auto"), List$cons$(Pair$new$("padding", "10px"), List$cons$(Pair$new$("background-color", App$Playground$constant$light_gray_color), List$nil))))));
        var $120 = DOM$node$("div", Map$from_list$(List$nil), (() => {
            var self = _device$2;
            switch (self._) {
              case "Device.phone":
                var $121 = Map$union$(_style$3, Map$from_list$(List$cons$(Pair$new$("height", "100%"), List$cons$(Pair$new$("margin-top", "0px"), List$nil))));
                return $121;

              case "Device.tablet":
              case "Device.desktop":
              case "Device.big_desktop":
                var $122 = Map$union$(_style$3, Map$from_list$(List$cons$(Pair$new$("height", "100% - 35px"), List$cons$(Pair$new$("margin-top", "35px"), List$nil))));
                return $122;
            }
        })(), List$cons$(DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$nil), List$cons$(DOM$text$("kind-lang@1.0.51"), List$nil)), List$cons$(DOM$node$("pre", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("margin-top", "10px"), List$nil)), List$cons$(DOM$text$(_output$1), List$nil)), List$nil)));
        return $120;
    }
    const App$Playground$comp$output_area = x0 => x1 => App$Playground$comp$output_area$(x0, x1);
    function App$Playground$comp$main_area$(_stt$1) {
        var self = _stt$1;
        switch (self._) {
          case "App.Playground.State.local.new":
            var $124 = self.device;
            var $125 = self.window;
            var $126 = self.mouse_over;
            var $127 = self.code;
            var $128 = self.output;
            var _header$7 = App$Playground$comp$header$($124, $126, $125);
            var _input_view$8 = App$Playground$comp$input$($127);
            var _output_view$9 = App$Playground$comp$output_area$($128, $124);
            var self = $124;
            switch (self._) {
              case "Device.phone":
                var $130 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("width", "100%"), List$cons$(Pair$new$("height", "100%"), List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("flex-direction", "column"), List$nil))))), List$cons$(_header$7, List$cons$((() => {
                    var self = $125;
                    switch (self._) {
                      case "App.Playground.Window.input":
                        var $131 = _input_view$8;
                        return $131;

                      case "App.Playground.Window.terminal":
                        var $132 = _output_view$9;
                        return $132;
                    }
                })(), List$nil)));
                var $129 = $130;
                break;

              case "Device.tablet":
              case "Device.desktop":
              case "Device.big_desktop":
                var $133 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("width", "100%"), List$cons$(Pair$new$("height", "100%"), List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("flex-direction", "row"), List$nil))))), List$cons$(DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("flex-direction", "column"), List$cons$(Pair$new$("width", "60%"), List$nil)))), List$cons$(_header$7, List$cons$(_input_view$8, List$nil))), List$cons$(_output_view$9, List$nil)));
                var $129 = $133;
                break;
            }
            ;
            var $123 = $129;
            break;
        }
        return $123;
    }
    const App$Playground$comp$main_area = x0 => App$Playground$comp$main_area$(x0);
    function App$Playground$draw$(_stt$1) {
        var self = _stt$1;
        switch (self._) {
          case "App.Playground.State.local.new":
            var $135 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("width", "100%"), List$cons$(Pair$new$("height", "100%"), List$cons$(Pair$new$("margin", "20px 0x"), List$cons$(Pair$new$("display", "flex"), List$nil))))), List$cons$(App$Playground$comp$main_area$(_stt$1), List$nil));
            var $134 = $135;
            break;
        }
        return $134;
    }
    const App$Playground$draw = x0 => App$Playground$draw$(x0);
    function App$playground$body$(_stt$1) {
        var self = _stt$1;
        switch (self._) {
          case "App.Playground.State.local.new":
            var $137 = self.device;
            var self = $137;
            switch (self._) {
              case "Device.phone":
                var $139 = DOM$node$("div", Map$from_list$(List$cons$(Pair$new$("id", "page"), List$nil)), Map$from_list$(List$cons$(Pair$new$("margin", "10px"), List$cons$(Pair$new$("height", "300px"), List$nil))), List$cons$(App$Playground$draw$(_stt$1), List$nil));
                var $138 = $139;
                break;

              case "Device.tablet":
              case "Device.desktop":
              case "Device.big_desktop":
                var $140 = DOM$node$("div", Map$from_list$(List$cons$(Pair$new$("id", "page"), List$nil)), Map$from_list$(List$cons$(Pair$new$("margin", "100px"), List$cons$(Pair$new$("height", "500px"), List$nil))), List$cons$(App$Playground$draw$(_stt$1), List$nil));
                var $138 = $140;
                break;
            }
            ;
            var $136 = $138;
            break;
        }
        return $136;
    }
    const App$playground$body = x0 => App$playground$body$(x0);
    function Pair$fst$(_pair$3) {
        var self = _pair$3;
        switch (self._) {
          case "Pair.new":
            var $142 = self.fst;
            var $143 = $142;
            var $141 = $143;
            break;
        }
        return $141;
    }
    const Pair$fst = x0 => Pair$fst$(x0);
    const App$State$local = Pair$fst;
    function IO$(_A$1) {
        var $144 = null;
        return $144;
    }
    const IO = x0 => IO$(x0);
    function Maybe$(_A$1) {
        var $145 = null;
        return $145;
    }
    const Maybe = x0 => Maybe$(x0);
    function IO$ask$(_query$2, _param$3, _then$4) {
        var $146 = {
            _: "IO.ask",
            query: _query$2,
            param: _param$3,
            then: _then$4
        };
        return $146;
    }
    const IO$ask = x0 => x1 => x2 => IO$ask$(x0, x1, x2);
    function IO$bind$(_a$3, _f$4) {
        var self = _a$3;
        switch (self._) {
          case "IO.end":
            var $148 = self.value;
            var $149 = _f$4($148);
            var $147 = $149;
            break;

          case "IO.ask":
            var $150 = self.query;
            var $151 = self.param;
            var $152 = self.then;
            var $153 = IO$ask$($150, $151, _x$8 => {
                var $154 = IO$bind$($152(_x$8), _f$4);
                return $154;
            });
            var $147 = $153;
            break;
        }
        return $147;
    }
    const IO$bind = x0 => x1 => IO$bind$(x0, x1);
    function IO$end$(_value$2) {
        var $155 = {
            _: "IO.end",
            value: _value$2
        };
        return $155;
    }
    const IO$end = x0 => IO$end$(x0);
    function IO$monad$(_new$2) {
        var $156 = _new$2(IO$bind)(IO$end);
        return $156;
    }
    const IO$monad = x0 => IO$monad$(x0);
    const App$pass = IO$monad$(_m$bind$2 => _m$pure$3 => {
        var $157 = _m$pure$3;
        return $157;
    })(Maybe$none);
    function Cmp$as_lte$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
          case "Cmp.ltn":
          case "Cmp.eql":
            var $159 = Bool$true;
            var $158 = $159;
            break;

          case "Cmp.gtn":
            var $160 = Bool$false;
            var $158 = $160;
            break;
        }
        return $158;
    }
    const Cmp$as_lte = x0 => Cmp$as_lte$(x0);
    function Word$lte$(_a$2, _b$3) {
        var $161 = Cmp$as_lte$(Word$cmp$(_a$2, _b$3));
        return $161;
    }
    const Word$lte = x0 => x1 => Word$lte$(x0, x1);
    const U32$lte = a0 => a1 => a0 <= a1;
    function U32$new$(_value$1) {
        var $162 = word_to_u32(_value$1);
        return $162;
    }
    const U32$new = x0 => U32$new$(x0);
    function Nat$apply$(_n$2, _f$3, _x$4) {
        var Nat$apply$ = (_n$2, _f$3, _x$4) => ({
            ctr: "TCO",
            arg: [ _n$2, _f$3, _x$4 ]
        });
        var Nat$apply = _n$2 => _f$3 => _x$4 => Nat$apply$(_n$2, _f$3, _x$4);
        var arg = [ _n$2, _f$3, _x$4 ];
        while (true) {
            let [ _n$2, _f$3, _x$4 ] = arg;
            var R = (() => {
                var self = _n$2;
                if (self === 0n) {
                    var $163 = _x$4;
                    return $163;
                } else {
                    var $164 = self - 1n;
                    var $165 = Nat$apply$($164, _f$3, _f$3(_x$4));
                    return $165;
                }
            })();
            if (R.ctr === "TCO") arg = R.arg; else return R;
        }
    }
    const Nat$apply = x0 => x1 => x2 => Nat$apply$(x0, x1, x2);
    function Word$(_size$1) {
        var $166 = null;
        return $166;
    }
    const Word = x0 => Word$(x0);
    const Word$e = {
        _: "Word.e"
    };
    function Word$i$(_pred$2) {
        var $167 = {
            _: "Word.i",
            pred: _pred$2
        };
        return $167;
    }
    const Word$i = x0 => Word$i$(x0);
    function Word$o$(_pred$2) {
        var $168 = {
            _: "Word.o",
            pred: _pred$2
        };
        return $168;
    }
    const Word$o = x0 => Word$o$(x0);
    function Word$inc$(_word$2) {
        var self = _word$2;
        switch (self._) {
          case "Word.o":
            var $170 = self.pred;
            var $171 = Word$i$($170);
            var $169 = $171;
            break;

          case "Word.i":
            var $172 = self.pred;
            var $173 = Word$o$(Word$inc$($172));
            var $169 = $173;
            break;

          case "Word.e":
            var $174 = Word$e;
            var $169 = $174;
            break;
        }
        return $169;
    }
    const Word$inc = x0 => Word$inc$(x0);
    function Word$zero$(_size$1) {
        var self = _size$1;
        if (self === 0n) {
            var $176 = Word$e;
            var $175 = $176;
        } else {
            var $177 = self - 1n;
            var $178 = Word$o$(Word$zero$($177));
            var $175 = $178;
        }
        return $175;
    }
    const Word$zero = x0 => Word$zero$(x0);
    function Nat$to_word$(_size$1, _n$2) {
        var $179 = Nat$apply$(_n$2, Word$inc, Word$zero$(_size$1));
        return $179;
    }
    const Nat$to_word = x0 => x1 => Nat$to_word$(x0, x1);
    const Nat$to_u32 = a0 => Number(a0) >>> 0;
    const Device$phone = {
        _: "Device.phone"
    };
    const Device$tablet = {
        _: "Device.tablet"
    };
    const Device$desktop = {
        _: "Device.desktop"
    };
    function Device$classify$(_width$1) {
        var self = _width$1 <= 600;
        if (self) {
            var $181 = Device$phone;
            var $180 = $181;
        } else {
            var self = _width$1 <= 768;
            if (self) {
                var $183 = Device$tablet;
                var $182 = $183;
            } else {
                var self = _width$1 <= 992;
                if (self) {
                    var $185 = Device$desktop;
                    var $184 = $185;
                } else {
                    var $186 = Device$big_desktop;
                    var $184 = $186;
                }
                var $182 = $184;
            }
            var $180 = $182;
        }
        return $180;
    }
    const Device$classify = x0 => Device$classify$(x0);
    function App$set_local$(_value$2) {
        var $187 = IO$monad$(_m$bind$3 => _m$pure$4 => {
            var $188 = _m$pure$4;
            return $188;
        })(Maybe$some$(_value$2));
        return $187;
    }
    const App$set_local = x0 => App$set_local$(x0);
    function App$Playground$set_mouse_over$(_id$1, _stt$2) {
        var self = _stt$2;
        switch (self._) {
          case "App.Playground.State.local.new":
            var $190 = self.device;
            var $191 = self.window;
            var $192 = self.code;
            var $193 = self.output;
            var $194 = App$Playground$State$local$new$($190, $191, _id$1, $192, $193);
            var $189 = $194;
            break;
        }
        return $189;
    }
    const App$Playground$set_mouse_over = x0 => x1 => App$Playground$set_mouse_over$(x0, x1);
    const App$Playground$Window$terminal = {
        _: "App.Playground.Window.terminal"
    };
    function String$is_empty$(_str$1) {
        var self = _str$1;
        if (self.length === 0) {
            var $196 = Bool$true;
            var $195 = $196;
        } else {
            var $197 = self.charCodeAt(0);
            var $198 = self.slice(1);
            var $199 = Bool$false;
            var $195 = $199;
        }
        return $195;
    }
    const String$is_empty = x0 => String$is_empty$(x0);
    function IO$request$(_url$1) {
        var $200 = IO$ask$("request", _url$1, _text$2 => {
            var $201 = IO$end$(_text$2);
            return $201;
        });
        return $200;
    }
    const IO$request = x0 => IO$request$(x0);
    function App$Playground$when$(_event$1, _stt$2) {
        var self = _stt$2;
        switch (self._) {
          case "App.Store.new":
            var $203 = self.local;
            var $204 = $203;
            var _state$3 = $204;
            break;
        }
        var self = _state$3;
        switch (self._) {
          case "App.Playground.State.local.new":
            var $205 = self.device;
            var $206 = self.window;
            var $207 = self.mouse_over;
            var $208 = self.code;
            var $209 = self.output;
            var self = _event$1;
            switch (self._) {
              case "App.Event.frame":
                var $211 = self.info;
                var self = $211;
                switch (self._) {
                  case "App.EnvInfo.new":
                    var $213 = self.screen_size;
                    var self = $213;
                    switch (self._) {
                      case "Pair.new":
                        var $215 = self.fst;
                        var _device$15 = Device$classify$($215);
                        var $216 = App$set_local$(App$Playground$State$local$new$(_device$15, $206, $207, $208, $209));
                        var $214 = $216;
                        break;
                    }
                    ;
                    var $212 = $214;
                    break;
                }
                ;
                var $210 = $212;
                break;

              case "App.Event.mouse_over":
                var $217 = self.id;
                var $218 = App$set_local$(App$Playground$set_mouse_over$($217, _state$3));
                var $210 = $218;
                break;

              case "App.Event.mouse_click":
                var $219 = self.id;
                var self = $219 === "btn_run_code";
                if (self) {
                    var self = $205;
                    switch (self._) {
                      case "Device.phone":
                        var $222 = App$Playground$Window$terminal;
                        var _window$12 = $222;
                        break;

                      case "Device.tablet":
                      case "Device.desktop":
                      case "Device.big_desktop":
                        var $223 = App$Playground$Window$input;
                        var _window$12 = $223;
                        break;
                    }
                    var self = String$is_empty$($208);
                    if (self) {
                        var $224 = App$set_local$(App$Playground$State$local$new$($205, _window$12, $207, $208, "How can I type check an empty code? haha"));
                        var $221 = $224;
                    } else {
                        var $225 = IO$monad$(_m$bind$13 => _m$pure$14 => {
                            var $226 = _m$bind$13;
                            return $226;
                        })(IO$request$("http://18.222.191.174:3030/api/check_term?code=" + $208))(_checked$13 => {
                            var $227 = App$set_local$(App$Playground$State$local$new$($205, _window$12, $207, $208, _checked$13));
                            return $227;
                        });
                        var $221 = $225;
                    }
                    var $220 = $221;
                } else {
                    var self = $219 === "terminal_view";
                    if (self) {
                        var $229 = App$set_local$(App$Playground$State$local$new$($205, App$Playground$Window$terminal, $207, $208, $209));
                        var $228 = $229;
                    } else {
                        var self = $219 === "input_view";
                        if (self) {
                            var $231 = App$set_local$(App$Playground$State$local$new$($205, App$Playground$Window$input, $207, $208, $209));
                            var $230 = $231;
                        } else {
                            var $232 = App$pass;
                            var $230 = $232;
                        }
                        var $228 = $230;
                    }
                    var $220 = $228;
                }
                ;
                var $210 = $220;
                break;

              case "App.Event.input":
                var $233 = self.id;
                var $234 = self.text;
                var self = $233 === "input_code";
                if (self) {
                    var $236 = App$set_local$(App$Playground$State$local$new$($205, $206, $207, $234, $209));
                    var $235 = $236;
                } else {
                    var $237 = App$pass;
                    var $235 = $237;
                }
                ;
                var $210 = $235;
                break;

              case "App.Event.init":
              case "App.Event.mouse_down":
              case "App.Event.mouse_up":
              case "App.Event.key_down":
              case "App.Event.key_up":
                var $238 = App$pass;
                var $210 = $238;
                break;
            }
            ;
            var $202 = $210;
            break;
        }
        return $202;
    }
    const App$Playground$when = x0 => x1 => App$Playground$when$(x0, x1);
    function App$new$(_init$2, _draw$3, _when$4, _tick$5, _post$6) {
        var $239 = {
            _: "App.new",
            init: _init$2,
            draw: _draw$3,
            when: _when$4,
            tick: _tick$5,
            post: _post$6
        };
        return $239;
    }
    const App$new = x0 => x1 => x2 => x3 => x4 => App$new$(x0, x1, x2, x3, x4);
    const App$Playground = (() => {
        var _init$1 = App$Store$new$(App$Playground$State$local_empty, Unit$new);
        var _draw$2 = _state$2 => {
            var $241 = App$playground$body$((() => {
                var self = _state$2;
                switch (self._) {
                  case "App.Store.new":
                    var $242 = self.local;
                    var $243 = $242;
                    return $243;
                }
            })());
            return $241;
        };
        var _when$3 = App$Playground$when;
        var _tick$4 = _tick$4 => _glob$5 => {
            var $244 = _glob$5;
            return $244;
        };
        var _post$5 = _time$5 => _room$6 => _addr$7 => _data$8 => _glob$9 => {
            var $245 = _glob$9;
            return $245;
        };
        var $240 = App$new$(_init$1, _draw$2, _when$3, _tick$4, _post$5);
        return $240;
    })();
    return {
        "App.Store.new": App$Store$new,
        "Pair.new": Pair$new,
        "App.State.new": App$State$new,
        "App.Playground.State": App$Playground$State,
        "App.Playground.State.local.new": App$Playground$State$local$new,
        "Device.big_desktop": Device$big_desktop,
        "App.Playground.Window.input": App$Playground$Window$input,
        "App.Playground.State.local_empty": App$Playground$State$local_empty,
        "Unit.new": Unit$new,
        "DOM.node": DOM$node,
        BitsMap: BitsMap,
        Map: Map,
        "BitsMap.new": BitsMap$new,
        "BitsMap.tie": BitsMap$tie,
        "Maybe.some": Maybe$some,
        "Maybe.none": Maybe$none,
        "BitsMap.set": BitsMap$set,
        "Bits.e": Bits$e,
        "Bits.o": Bits$o,
        "Bits.i": Bits$i,
        "Bits.concat": Bits$concat,
        "Word.to_bits": Word$to_bits,
        "Nat.succ": Nat$succ,
        "Nat.zero": Nat$zero,
        "U16.to_bits": U16$to_bits,
        "String.to_bits": String$to_bits,
        "Map.from_list": Map$from_list,
        "List.cons": List$cons,
        Pair: Pair,
        "List.nil": List$nil,
        "App.Playground.constant.light_gray_color": App$Playground$constant$light_gray_color,
        "App.Playground.constant.white_smoke": App$Playground$constant$white_smoke,
        "DOM.text": DOM$text,
        "Bool.true": Bool$true,
        "Bool.false": Bool$false,
        "Bool.and": Bool$and,
        "Cmp.as_eql": Cmp$as_eql,
        "Cmp.ltn": Cmp$ltn,
        "Cmp.gtn": Cmp$gtn,
        "Word.cmp.go": Word$cmp$go,
        "Cmp.eql": Cmp$eql,
        "Word.cmp": Word$cmp,
        "Word.eql": Word$eql,
        "U16.eql": U16$eql,
        "String.eql": String$eql,
        "BitsMap.union": BitsMap$union,
        "Map.union": Map$union,
        "App.Kind.constant.secondary_color": App$Kind$constant$secondary_color,
        "App.Playground.comp.btn_run_code": App$Playground$comp$btn_run_code,
        "App.Playground.comp.header": App$Playground$comp$header,
        "String.cons": String$cons,
        "String.concat": String$concat,
        "App.Playground.comp.input": App$Playground$comp$input,
        "App.Playground.comp.output_area": App$Playground$comp$output_area,
        "App.Playground.comp.main_area": App$Playground$comp$main_area,
        "App.Playground.draw": App$Playground$draw,
        "App.playground.body": App$playground$body,
        "Pair.fst": Pair$fst,
        "App.State.local": App$State$local,
        IO: IO,
        Maybe: Maybe,
        "IO.ask": IO$ask,
        "IO.bind": IO$bind,
        "IO.end": IO$end,
        "IO.monad": IO$monad,
        "App.pass": App$pass,
        "Cmp.as_lte": Cmp$as_lte,
        "Word.lte": Word$lte,
        "U32.lte": U32$lte,
        "U32.new": U32$new,
        "Nat.apply": Nat$apply,
        Word: Word,
        "Word.e": Word$e,
        "Word.i": Word$i,
        "Word.o": Word$o,
        "Word.inc": Word$inc,
        "Word.zero": Word$zero,
        "Nat.to_word": Nat$to_word,
        "Nat.to_u32": Nat$to_u32,
        "Device.phone": Device$phone,
        "Device.tablet": Device$tablet,
        "Device.desktop": Device$desktop,
        "Device.classify": Device$classify,
        "App.set_local": App$set_local,
        "App.Playground.set_mouse_over": App$Playground$set_mouse_over,
        "App.Playground.Window.terminal": App$Playground$Window$terminal,
        "String.is_empty": String$is_empty,
        "IO.request": IO$request,
        "App.Playground.when": App$Playground$when,
        "App.new": App$new,
        "App.Playground": App$Playground
    };
}();
