module.exports = function() {
    function int_pos(i) {
        return i >= 0n ? i : 0n;
    }
    function int_neg(i) {
        return i < 0n ? -i : 0n;
    }
    function word_to_u8(w) {
        var u = 0;
        for (var i = 0; i < 8; ++i) {
            u = u | (w._ === "Word.i" ? 1 << i : 0);
            w = w.pred;
        }
        return u;
    }
    function u8_to_word(u) {
        var w = {
            _: "Word.e"
        };
        for (var i = 0; i < 8; ++i) {
            w = {
                _: u >>> 8 - i - 1 & 1 ? "Word.i" : "Word.o",
                pred: w
            };
        }
        return w;
    }
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
    function word_to_i32(w) {
        var u = 0;
        for (var i = 0; i < 32; ++i) {
            u = u | (w._ === "Word.i" ? 1 << i : 0);
            w = w.pred;
        }
        return u;
    }
    function i32_to_word(u) {
        var w = {
            _: "Word.e"
        };
        for (var i = 0; i < 32; ++i) {
            w = {
                _: u >> 32 - i - 1 & 1 ? "Word.i" : "Word.o",
                pred: w
            };
        }
        return w;
    }
    function i32_for(state, from, til, func) {
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
    var f64 = new Float64Array(1);
    var u32 = new Uint32Array(f64.buffer);
    function f64_get_bit(x, i) {
        f64[0] = x;
        if (i < 32) {
            return u32[0] >>> i & 1;
        } else {
            return u32[1] >>> i - 32 & 1;
        }
    }
    function f64_set_bit(x, i) {
        f64[0] = x;
        if (i < 32) {
            u32[0] = u32[0] | 1 << i;
        } else {
            u32[1] = u32[1] | 1 << i - 32;
        }
        return f64[0];
    }
    function word_to_f64(w) {
        var x = 0;
        for (var i = 0; i < 64; ++i) {
            x = w._ === "Word.i" ? f64_set_bit(x, i) : x;
            w = w.pred;
        }
        return x;
    }
    function f64_to_word(x) {
        var w = {
            _: "Word.e"
        };
        for (var i = 0; i < 64; ++i) {
            w = {
                _: f64_get_bit(x, 64 - i - 1) ? "Word.i" : "Word.o",
                pred: w
            };
        }
        return w;
    }
    function f64_make(s, a, b) {
        return (s ? 1 : -1) * Number(a) / 10 ** Number(b);
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
    var list_for = list => nil => cons => {
        while (list._ !== "List.nil") {
            nil = cons(list.head)(nil);
            list = list.tail;
        }
        return nil;
    };
    var list_length = list => {
        var len = 0;
        while (list._ === "List.cons") {
            len += 1;
            list = list.tail;
        }
        return BigInt(len);
    };
    var nat_to_bits = n => {
        return n === 0n ? "" : n.toString(2);
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
    const inst_int = x => x(x0 => x1 => x0 - x1);
    const elim_int = x => {
        var $12 = (() => c0 => {
            var self = x;
            switch ("new") {
              case "new":
                var $9 = int_pos(self);
                var $10 = int_neg(self);
                var $11 = c0($9)($10);
                return $11;
            }
        })();
        return $12;
    };
    const inst_bits = x => x("")(x0 => x0 + "0")(x0 => x0 + "1");
    const elim_bits = x => {
        var $18 = (() => c0 => c1 => c2 => {
            var self = x;
            switch (self.length === 0 ? "e" : self[self.length - 1] === "0" ? "o" : "i") {
              case "o":
                var $13 = self.slice(0, -1);
                var $14 = c1($13);
                return $14;

              case "i":
                var $15 = self.slice(0, -1);
                var $16 = c2($15);
                return $16;

              case "e":
                var $17 = c0;
                return $17;
            }
        })();
        return $18;
    };
    const inst_u8 = x => x(x0 => word_to_u8(x0));
    const elim_u8 = x => {
        var $21 = (() => c0 => {
            var self = x;
            switch ("u8") {
              case "u8":
                var $19 = u8_to_word(self);
                var $20 = c0($19);
                return $20;
            }
        })();
        return $21;
    };
    const inst_u16 = x => x(x0 => word_to_u16(x0));
    const elim_u16 = x => {
        var $24 = (() => c0 => {
            var self = x;
            switch ("u16") {
              case "u16":
                var $22 = u16_to_word(self);
                var $23 = c0($22);
                return $23;
            }
        })();
        return $24;
    };
    const inst_u32 = x => x(x0 => word_to_u32(x0));
    const elim_u32 = x => {
        var $27 = (() => c0 => {
            var self = x;
            switch ("u32") {
              case "u32":
                var $25 = u32_to_word(self);
                var $26 = c0($25);
                return $26;
            }
        })();
        return $27;
    };
    const inst_i32 = x => x(x0 => word_to_i32(x0));
    const elim_i32 = x => {
        var $30 = (() => c0 => {
            var self = x;
            switch ("i32") {
              case "i32":
                var $28 = i32_to_word(self);
                var $29 = c0($28);
                return $29;
            }
        })();
        return $30;
    };
    const inst_u64 = x => x(x0 => word_to_u64(x0));
    const elim_u64 = x => {
        var $33 = (() => c0 => {
            var self = x;
            switch ("u64") {
              case "u64":
                var $31 = u64_to_word(self);
                var $32 = c0($31);
                return $32;
            }
        })();
        return $33;
    };
    const inst_f64 = x => x(x0 => word_to_f64(x0));
    const elim_f64 = x => {
        var $36 = (() => c0 => {
            var self = x;
            switch ("f64") {
              case "f64":
                var $34 = f64_to_word(self);
                var $35 = c0($34);
                return $35;
            }
        })();
        return $36;
    };
    const inst_string = x => x("")(x0 => x1 => String.fromCharCode(x0) + x1);
    const elim_string = x => {
        var $41 = (() => c0 => c1 => {
            var self = x;
            if (self.length === 0) {
                var $37 = c0;
                return $37;
            } else {
                var $38 = self.charCodeAt(0);
                var $39 = self.slice(1);
                var $40 = c1($38)($39);
                return $40;
            }
        })();
        return $41;
    };
    const inst_buffer32 = x => x(x0 => x1 => u32array_to_buffer32(x1));
    const elim_buffer32 = x => {
        var $45 = (() => c0 => {
            var self = x;
            switch ("b32") {
              case "b32":
                var $42 = buffer32_to_depth(self);
                var $43 = buffer32_to_u32array(self);
                var $44 = c0($42)($43);
                return $44;
            }
        })();
        return $45;
    };
    function Buffer32$new$(_depth$1, _array$2) {
        var $46 = u32array_to_buffer32(_array$2);
        return $46;
    }
    const Buffer32$new = x0 => x1 => Buffer32$new$(x0, x1);
    function Array$(_A$1, _depth$2) {
        var $47 = null;
        return $47;
    }
    const Array = x0 => x1 => Array$(x0, x1);
    function Array$tip$(_value$2) {
        var $48 = {
            _: "Array.tip",
            value: _value$2
        };
        return $48;
    }
    const Array$tip = x0 => Array$tip$(x0);
    function Array$tie$(_lft$3, _rgt$4) {
        var $49 = {
            _: "Array.tie",
            lft: _lft$3,
            rgt: _rgt$4
        };
        return $49;
    }
    const Array$tie = x0 => x1 => Array$tie$(x0, x1);
    function Array$alloc$(_depth$2, _x$3) {
        var self = _depth$2;
        if (self === 0n) {
            var $51 = Array$tip$(_x$3);
            var $50 = $51;
        } else {
            var $52 = self - 1n;
            var _half$5 = Array$alloc$($52, _x$3);
            var $53 = Array$tie$(_half$5, _half$5);
            var $50 = $53;
        }
        return $50;
    }
    const Array$alloc = x0 => x1 => Array$alloc$(x0, x1);
    function U32$new$(_value$1) {
        var $54 = word_to_u32(_value$1);
        return $54;
    }
    const U32$new = x0 => U32$new$(x0);
    function Word$(_size$1) {
        var $55 = null;
        return $55;
    }
    const Word = x0 => Word$(x0);
    const Word$e = {
        _: "Word.e"
    };
    function Word$o$(_pred$2) {
        var $56 = {
            _: "Word.o",
            pred: _pred$2
        };
        return $56;
    }
    const Word$o = x0 => Word$o$(x0);
    function Word$zero$(_size$1) {
        var self = _size$1;
        if (self === 0n) {
            var $58 = Word$e;
            var $57 = $58;
        } else {
            var $59 = self - 1n;
            var $60 = Word$o$(Word$zero$($59));
            var $57 = $60;
        }
        return $57;
    }
    const Word$zero = x0 => Word$zero$(x0);
    function Nat$succ$(_pred$1) {
        var $61 = 1n + _pred$1;
        return $61;
    }
    const Nat$succ = x0 => Nat$succ$(x0);
    const Nat$zero = 0n;
    const U32$zero = U32$new$(Word$zero$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$zero))))))))))))))))))))))))))))))))));
    const Buffer32$alloc = a0 => new Uint32Array(2 ** Number(a0));
    function Word$bit_length$go$(_word$2, _c$3, _n$4) {
        var Word$bit_length$go$ = (_word$2, _c$3, _n$4) => ({
            ctr: "TCO",
            arg: [ _word$2, _c$3, _n$4 ]
        });
        var Word$bit_length$go = _word$2 => _c$3 => _n$4 => Word$bit_length$go$(_word$2, _c$3, _n$4);
        var arg = [ _word$2, _c$3, _n$4 ];
        while (true) {
            let [ _word$2, _c$3, _n$4 ] = arg;
            var R = (() => {
                var self = _word$2;
                switch (self._) {
                  case "Word.o":
                    var $62 = self.pred;
                    var $63 = Word$bit_length$go$($62, Nat$succ$(_c$3), _n$4);
                    return $63;

                  case "Word.i":
                    var $64 = self.pred;
                    var $65 = Word$bit_length$go$($64, Nat$succ$(_c$3), Nat$succ$(_c$3));
                    return $65;

                  case "Word.e":
                    var $66 = _n$4;
                    return $66;
                }
            })();
            if (R.ctr === "TCO") arg = R.arg; else return R;
        }
    }
    const Word$bit_length$go = x0 => x1 => x2 => Word$bit_length$go$(x0, x1, x2);
    function Word$bit_length$(_word$2) {
        var $67 = Word$bit_length$go$(_word$2, 0n, 0n);
        return $67;
    }
    const Word$bit_length = x0 => Word$bit_length$(x0);
    function U32$bit_length$(_size$1) {
        var self = _size$1;
        switch ("u32") {
          case "u32":
            var $69 = u32_to_word(self);
            var $70 = Word$bit_length$($69);
            var $68 = $70;
            break;
        }
        return $68;
    }
    const U32$bit_length = x0 => U32$bit_length$(x0);
    function Word$i$(_pred$2) {
        var $71 = {
            _: "Word.i",
            pred: _pred$2
        };
        return $71;
    }
    const Word$i = x0 => Word$i$(x0);
    const Bool$false = false;
    const Bool$true = true;
    function Word$shift_left$one$go$(_word$2, _prev$3) {
        var self = _word$2;
        switch (self._) {
          case "Word.o":
            var $73 = self.pred;
            var self = _prev$3;
            if (self) {
                var $75 = Word$i$(Word$shift_left$one$go$($73, Bool$false));
                var $74 = $75;
            } else {
                var $76 = Word$o$(Word$shift_left$one$go$($73, Bool$false));
                var $74 = $76;
            }
            ;
            var $72 = $74;
            break;

          case "Word.i":
            var $77 = self.pred;
            var self = _prev$3;
            if (self) {
                var $79 = Word$i$(Word$shift_left$one$go$($77, Bool$true));
                var $78 = $79;
            } else {
                var $80 = Word$o$(Word$shift_left$one$go$($77, Bool$true));
                var $78 = $80;
            }
            ;
            var $72 = $78;
            break;

          case "Word.e":
            var $81 = Word$e;
            var $72 = $81;
            break;
        }
        return $72;
    }
    const Word$shift_left$one$go = x0 => x1 => Word$shift_left$one$go$(x0, x1);
    function Word$shift_left$one$(_word$2) {
        var self = _word$2;
        switch (self._) {
          case "Word.o":
            var $83 = self.pred;
            var $84 = Word$o$(Word$shift_left$one$go$($83, Bool$false));
            var $82 = $84;
            break;

          case "Word.i":
            var $85 = self.pred;
            var $86 = Word$o$(Word$shift_left$one$go$($85, Bool$true));
            var $82 = $86;
            break;

          case "Word.e":
            var $87 = Word$e;
            var $82 = $87;
            break;
        }
        return $82;
    }
    const Word$shift_left$one = x0 => Word$shift_left$one$(x0);
    function Word$shift_left$(_n$2, _value$3) {
        var Word$shift_left$ = (_n$2, _value$3) => ({
            ctr: "TCO",
            arg: [ _n$2, _value$3 ]
        });
        var Word$shift_left = _n$2 => _value$3 => Word$shift_left$(_n$2, _value$3);
        var arg = [ _n$2, _value$3 ];
        while (true) {
            let [ _n$2, _value$3 ] = arg;
            var R = (() => {
                var self = _n$2;
                if (self === 0n) {
                    var $88 = _value$3;
                    return $88;
                } else {
                    var $89 = self - 1n;
                    var $90 = Word$shift_left$($89, Word$shift_left$one$(_value$3));
                    return $90;
                }
            })();
            if (R.ctr === "TCO") arg = R.arg; else return R;
        }
    }
    const Word$shift_left = x0 => x1 => Word$shift_left$(x0, x1);
    function Word$adder$(_a$2, _b$3, _c$4) {
        var self = _a$2;
        switch (self._) {
          case "Word.o":
            var $92 = self.pred;
            var $93 = _b$7 => {
                var self = _b$7;
                switch (self._) {
                  case "Word.o":
                    var $95 = self.pred;
                    var $96 = _a$pred$10 => {
                        var self = _c$4;
                        if (self) {
                            var $98 = Word$i$(Word$adder$(_a$pred$10, $95, Bool$false));
                            var $97 = $98;
                        } else {
                            var $99 = Word$o$(Word$adder$(_a$pred$10, $95, Bool$false));
                            var $97 = $99;
                        }
                        return $97;
                    };
                    var $94 = $96;
                    break;

                  case "Word.i":
                    var $100 = self.pred;
                    var $101 = _a$pred$10 => {
                        var self = _c$4;
                        if (self) {
                            var $103 = Word$o$(Word$adder$(_a$pred$10, $100, Bool$true));
                            var $102 = $103;
                        } else {
                            var $104 = Word$i$(Word$adder$(_a$pred$10, $100, Bool$false));
                            var $102 = $104;
                        }
                        return $102;
                    };
                    var $94 = $101;
                    break;

                  case "Word.e":
                    var $105 = _a$pred$8 => {
                        var $106 = Word$e;
                        return $106;
                    };
                    var $94 = $105;
                    break;
                }
                var $94 = $94($92);
                return $94;
            };
            var $91 = $93;
            break;

          case "Word.i":
            var $107 = self.pred;
            var $108 = _b$7 => {
                var self = _b$7;
                switch (self._) {
                  case "Word.o":
                    var $110 = self.pred;
                    var $111 = _a$pred$10 => {
                        var self = _c$4;
                        if (self) {
                            var $113 = Word$o$(Word$adder$(_a$pred$10, $110, Bool$true));
                            var $112 = $113;
                        } else {
                            var $114 = Word$i$(Word$adder$(_a$pred$10, $110, Bool$false));
                            var $112 = $114;
                        }
                        return $112;
                    };
                    var $109 = $111;
                    break;

                  case "Word.i":
                    var $115 = self.pred;
                    var $116 = _a$pred$10 => {
                        var self = _c$4;
                        if (self) {
                            var $118 = Word$i$(Word$adder$(_a$pred$10, $115, Bool$true));
                            var $117 = $118;
                        } else {
                            var $119 = Word$o$(Word$adder$(_a$pred$10, $115, Bool$true));
                            var $117 = $119;
                        }
                        return $117;
                    };
                    var $109 = $116;
                    break;

                  case "Word.e":
                    var $120 = _a$pred$8 => {
                        var $121 = Word$e;
                        return $121;
                    };
                    var $109 = $120;
                    break;
                }
                var $109 = $109($107);
                return $109;
            };
            var $91 = $108;
            break;

          case "Word.e":
            var $122 = _b$5 => {
                var $123 = Word$e;
                return $123;
            };
            var $91 = $122;
            break;
        }
        var $91 = $91(_b$3);
        return $91;
    }
    const Word$adder = x0 => x1 => x2 => Word$adder$(x0, x1, x2);
    function Word$add$(_a$2, _b$3) {
        var $124 = Word$adder$(_a$2, _b$3, Bool$false);
        return $124;
    }
    const Word$add = x0 => x1 => Word$add$(x0, x1);
    function Word$mul$go$(_a$3, _b$4, _acc$5) {
        var Word$mul$go$ = (_a$3, _b$4, _acc$5) => ({
            ctr: "TCO",
            arg: [ _a$3, _b$4, _acc$5 ]
        });
        var Word$mul$go = _a$3 => _b$4 => _acc$5 => Word$mul$go$(_a$3, _b$4, _acc$5);
        var arg = [ _a$3, _b$4, _acc$5 ];
        while (true) {
            let [ _a$3, _b$4, _acc$5 ] = arg;
            var R = (() => {
                var self = _a$3;
                switch (self._) {
                  case "Word.o":
                    var $125 = self.pred;
                    var $126 = Word$mul$go$($125, Word$shift_left$(1n, _b$4), _acc$5);
                    return $126;

                  case "Word.i":
                    var $127 = self.pred;
                    var $128 = Word$mul$go$($127, Word$shift_left$(1n, _b$4), Word$add$(_b$4, _acc$5));
                    return $128;

                  case "Word.e":
                    var $129 = _acc$5;
                    return $129;
                }
            })();
            if (R.ctr === "TCO") arg = R.arg; else return R;
        }
    }
    const Word$mul$go = x0 => x1 => x2 => Word$mul$go$(x0, x1, x2);
    function Word$to_zero$(_word$2) {
        var self = _word$2;
        switch (self._) {
          case "Word.o":
            var $131 = self.pred;
            var $132 = Word$o$(Word$to_zero$($131));
            var $130 = $132;
            break;

          case "Word.i":
            var $133 = self.pred;
            var $134 = Word$o$(Word$to_zero$($133));
            var $130 = $134;
            break;

          case "Word.e":
            var $135 = Word$e;
            var $130 = $135;
            break;
        }
        return $130;
    }
    const Word$to_zero = x0 => Word$to_zero$(x0);
    function Word$mul$(_a$2, _b$3) {
        var $136 = Word$mul$go$(_a$2, _b$3, Word$to_zero$(_a$2));
        return $136;
    }
    const Word$mul = x0 => x1 => Word$mul$(x0, x1);
    const U32$mul = a0 => a1 => a0 * a1 >>> 0;
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
                    var $137 = _x$4;
                    return $137;
                } else {
                    var $138 = self - 1n;
                    var $139 = Nat$apply$($138, _f$3, _f$3(_x$4));
                    return $139;
                }
            })();
            if (R.ctr === "TCO") arg = R.arg; else return R;
        }
    }
    const Nat$apply = x0 => x1 => x2 => Nat$apply$(x0, x1, x2);
    function Word$inc$(_word$2) {
        var self = _word$2;
        switch (self._) {
          case "Word.o":
            var $141 = self.pred;
            var $142 = Word$i$($141);
            var $140 = $142;
            break;

          case "Word.i":
            var $143 = self.pred;
            var $144 = Word$o$(Word$inc$($143));
            var $140 = $144;
            break;

          case "Word.e":
            var $145 = Word$e;
            var $140 = $145;
            break;
        }
        return $140;
    }
    const Word$inc = x0 => Word$inc$(x0);
    function Nat$to_word$(_size$1, _n$2) {
        var $146 = Nat$apply$(_n$2, Word$inc, Word$zero$(_size$1));
        return $146;
    }
    const Nat$to_word = x0 => x1 => Nat$to_word$(x0, x1);
    const Nat$to_u32 = a0 => Number(a0) >>> 0;
    function VoxBox$new$(_length$1, _capacity$2, _buffer$3) {
        var $147 = {
            _: "VoxBox.new",
            length: _length$1,
            capacity: _capacity$2,
            buffer: _buffer$3
        };
        return $147;
    }
    const VoxBox$new = x0 => x1 => x2 => VoxBox$new$(x0, x1, x2);
    function VoxBox$alloc_capacity$(_capacity$1) {
        var _buffer$2 = new Uint32Array(2 ** Number(U32$bit_length$(2 * _capacity$1 >>> 0)));
        var $148 = VoxBox$new$(0, _capacity$1, _buffer$2);
        return $148;
    }
    const VoxBox$alloc_capacity = x0 => VoxBox$alloc_capacity$(x0);
    const App$Kaelin$Constants$room = "0x78414442332238";
    const Maybe$none = {
        _: "Maybe.none"
    };
    function App$Kaelin$Coord$new$(_i$1, _j$2) {
        var $149 = {
            _: "App.Kaelin.Coord.new",
            i: _i$1,
            j: _j$2
        };
        return $149;
    }
    const App$Kaelin$Coord$new = x0 => x1 => App$Kaelin$Coord$new$(x0, x1);
    function Maybe$default$(_m$2, _a$3) {
        var self = _m$2;
        switch (self._) {
          case "Maybe.some":
            var $151 = self.value;
            var $152 = $151;
            var $150 = $152;
            break;

          case "Maybe.none":
            var $153 = _a$3;
            var $150 = $153;
            break;
        }
        return $150;
    }
    const Maybe$default = x0 => x1 => Maybe$default$(x0, x1);
    function Cmp$as_eql$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
          case "Cmp.ltn":
          case "Cmp.gtn":
            var $155 = Bool$false;
            var $154 = $155;
            break;

          case "Cmp.eql":
            var $156 = Bool$true;
            var $154 = $156;
            break;
        }
        return $154;
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
            var $158 = self.pred;
            var $159 = _b$7 => {
                var self = _b$7;
                switch (self._) {
                  case "Word.o":
                    var $161 = self.pred;
                    var $162 = _a$pred$10 => {
                        var $163 = Word$cmp$go$(_a$pred$10, $161, _c$4);
                        return $163;
                    };
                    var $160 = $162;
                    break;

                  case "Word.i":
                    var $164 = self.pred;
                    var $165 = _a$pred$10 => {
                        var $166 = Word$cmp$go$(_a$pred$10, $164, Cmp$ltn);
                        return $166;
                    };
                    var $160 = $165;
                    break;

                  case "Word.e":
                    var $167 = _a$pred$8 => {
                        var $168 = _c$4;
                        return $168;
                    };
                    var $160 = $167;
                    break;
                }
                var $160 = $160($158);
                return $160;
            };
            var $157 = $159;
            break;

          case "Word.i":
            var $169 = self.pred;
            var $170 = _b$7 => {
                var self = _b$7;
                switch (self._) {
                  case "Word.o":
                    var $172 = self.pred;
                    var $173 = _a$pred$10 => {
                        var $174 = Word$cmp$go$(_a$pred$10, $172, Cmp$gtn);
                        return $174;
                    };
                    var $171 = $173;
                    break;

                  case "Word.i":
                    var $175 = self.pred;
                    var $176 = _a$pred$10 => {
                        var $177 = Word$cmp$go$(_a$pred$10, $175, _c$4);
                        return $177;
                    };
                    var $171 = $176;
                    break;

                  case "Word.e":
                    var $178 = _a$pred$8 => {
                        var $179 = _c$4;
                        return $179;
                    };
                    var $171 = $178;
                    break;
                }
                var $171 = $171($169);
                return $171;
            };
            var $157 = $170;
            break;

          case "Word.e":
            var $180 = _b$5 => {
                var $181 = _c$4;
                return $181;
            };
            var $157 = $180;
            break;
        }
        var $157 = $157(_b$3);
        return $157;
    }
    const Word$cmp$go = x0 => x1 => x2 => Word$cmp$go$(x0, x1, x2);
    const Cmp$eql = {
        _: "Cmp.eql"
    };
    function Word$cmp$(_a$2, _b$3) {
        var $182 = Word$cmp$go$(_a$2, _b$3, Cmp$eql);
        return $182;
    }
    const Word$cmp = x0 => x1 => Word$cmp$(x0, x1);
    function Word$eql$(_a$2, _b$3) {
        var $183 = Cmp$as_eql$(Word$cmp$(_a$2, _b$3));
        return $183;
    }
    const Word$eql = x0 => x1 => Word$eql$(x0, x1);
    const U8$eql = a0 => a1 => a0 === a1;
    function U8$new$(_value$1) {
        var $184 = word_to_u8(_value$1);
        return $184;
    }
    const U8$new = x0 => U8$new$(x0);
    const U8$from_nat = a0 => Number(a0) & 255;
    function Maybe$(_A$1) {
        var $185 = null;
        return $185;
    }
    const Maybe = x0 => Maybe$(x0);
    function Maybe$some$(_value$2) {
        var $186 = {
            _: "Maybe.some",
            value: _value$2
        };
        return $186;
    }
    const Maybe$some = x0 => Maybe$some$(x0);
    function App$Kaelin$Hero$new$(_name$1, _img$2, _max_hp$3, _max_ap$4, _skills$5) {
        var $187 = {
            _: "App.Kaelin.Hero.new",
            name: _name$1,
            img: _img$2,
            max_hp: _max_hp$3,
            max_ap: _max_ap$4,
            skills: _skills$5
        };
        return $187;
    }
    const App$Kaelin$Hero$new = x0 => x1 => x2 => x3 => x4 => App$Kaelin$Hero$new$(x0, x1, x2, x3, x4);
    const Nat$ltn = a0 => a1 => a0 < a1;
    const Nat$sub = a0 => a1 => a0 - a1 <= 0n ? 0n : a0 - a1;
    function Cmp$as_gte$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
          case "Cmp.ltn":
            var $189 = Bool$false;
            var $188 = $189;
            break;

          case "Cmp.eql":
          case "Cmp.gtn":
            var $190 = Bool$true;
            var $188 = $190;
            break;
        }
        return $188;
    }
    const Cmp$as_gte = x0 => Cmp$as_gte$(x0);
    function Word$gte$(_a$2, _b$3) {
        var $191 = Cmp$as_gte$(Word$cmp$(_a$2, _b$3));
        return $191;
    }
    const Word$gte = x0 => x1 => Word$gte$(x0, x1);
    function Pair$(_A$1, _B$2) {
        var $192 = null;
        return $192;
    }
    const Pair = x0 => x1 => Pair$(x0, x1);
    function Pair$new$(_fst$3, _snd$4) {
        var $193 = {
            _: "Pair.new",
            fst: _fst$3,
            snd: _snd$4
        };
        return $193;
    }
    const Pair$new = x0 => x1 => Pair$new$(x0, x1);
    function Word$or$(_a$2, _b$3) {
        var self = _a$2;
        switch (self._) {
          case "Word.o":
            var $195 = self.pred;
            var $196 = _b$6 => {
                var self = _b$6;
                switch (self._) {
                  case "Word.o":
                    var $198 = self.pred;
                    var $199 = _a$pred$9 => {
                        var $200 = Word$o$(Word$or$(_a$pred$9, $198));
                        return $200;
                    };
                    var $197 = $199;
                    break;

                  case "Word.i":
                    var $201 = self.pred;
                    var $202 = _a$pred$9 => {
                        var $203 = Word$i$(Word$or$(_a$pred$9, $201));
                        return $203;
                    };
                    var $197 = $202;
                    break;

                  case "Word.e":
                    var $204 = _a$pred$7 => {
                        var $205 = Word$e;
                        return $205;
                    };
                    var $197 = $204;
                    break;
                }
                var $197 = $197($195);
                return $197;
            };
            var $194 = $196;
            break;

          case "Word.i":
            var $206 = self.pred;
            var $207 = _b$6 => {
                var self = _b$6;
                switch (self._) {
                  case "Word.o":
                    var $209 = self.pred;
                    var $210 = _a$pred$9 => {
                        var $211 = Word$i$(Word$or$(_a$pred$9, $209));
                        return $211;
                    };
                    var $208 = $210;
                    break;

                  case "Word.i":
                    var $212 = self.pred;
                    var $213 = _a$pred$9 => {
                        var $214 = Word$i$(Word$or$(_a$pred$9, $212));
                        return $214;
                    };
                    var $208 = $213;
                    break;

                  case "Word.e":
                    var $215 = _a$pred$7 => {
                        var $216 = Word$e;
                        return $216;
                    };
                    var $208 = $215;
                    break;
                }
                var $208 = $208($206);
                return $208;
            };
            var $194 = $207;
            break;

          case "Word.e":
            var $217 = _b$4 => {
                var $218 = Word$e;
                return $218;
            };
            var $194 = $217;
            break;
        }
        var $194 = $194(_b$3);
        return $194;
    }
    const Word$or = x0 => x1 => Word$or$(x0, x1);
    function Word$shift_right$one$go$(_word$2) {
        var self = _word$2;
        switch (self._) {
          case "Word.o":
            var $220 = self.pred;
            var $221 = Word$o$(Word$shift_right$one$go$($220));
            var $219 = $221;
            break;

          case "Word.i":
            var $222 = self.pred;
            var $223 = Word$i$(Word$shift_right$one$go$($222));
            var $219 = $223;
            break;

          case "Word.e":
            var $224 = Word$o$(Word$e);
            var $219 = $224;
            break;
        }
        return $219;
    }
    const Word$shift_right$one$go = x0 => Word$shift_right$one$go$(x0);
    function Word$shift_right$one$(_word$2) {
        var self = _word$2;
        switch (self._) {
          case "Word.o":
            var $226 = self.pred;
            var $227 = Word$shift_right$one$go$($226);
            var $225 = $227;
            break;

          case "Word.i":
            var $228 = self.pred;
            var $229 = Word$shift_right$one$go$($228);
            var $225 = $229;
            break;

          case "Word.e":
            var $230 = Word$e;
            var $225 = $230;
            break;
        }
        return $225;
    }
    const Word$shift_right$one = x0 => Word$shift_right$one$(x0);
    function Word$shift_right$(_n$2, _value$3) {
        var Word$shift_right$ = (_n$2, _value$3) => ({
            ctr: "TCO",
            arg: [ _n$2, _value$3 ]
        });
        var Word$shift_right = _n$2 => _value$3 => Word$shift_right$(_n$2, _value$3);
        var arg = [ _n$2, _value$3 ];
        while (true) {
            let [ _n$2, _value$3 ] = arg;
            var R = (() => {
                var self = _n$2;
                if (self === 0n) {
                    var $231 = _value$3;
                    return $231;
                } else {
                    var $232 = self - 1n;
                    var $233 = Word$shift_right$($232, Word$shift_right$one$(_value$3));
                    return $233;
                }
            })();
            if (R.ctr === "TCO") arg = R.arg; else return R;
        }
    }
    const Word$shift_right = x0 => x1 => Word$shift_right$(x0, x1);
    function Word$subber$(_a$2, _b$3, _c$4) {
        var self = _a$2;
        switch (self._) {
          case "Word.o":
            var $235 = self.pred;
            var $236 = _b$7 => {
                var self = _b$7;
                switch (self._) {
                  case "Word.o":
                    var $238 = self.pred;
                    var $239 = _a$pred$10 => {
                        var self = _c$4;
                        if (self) {
                            var $241 = Word$i$(Word$subber$(_a$pred$10, $238, Bool$true));
                            var $240 = $241;
                        } else {
                            var $242 = Word$o$(Word$subber$(_a$pred$10, $238, Bool$false));
                            var $240 = $242;
                        }
                        return $240;
                    };
                    var $237 = $239;
                    break;

                  case "Word.i":
                    var $243 = self.pred;
                    var $244 = _a$pred$10 => {
                        var self = _c$4;
                        if (self) {
                            var $246 = Word$o$(Word$subber$(_a$pred$10, $243, Bool$true));
                            var $245 = $246;
                        } else {
                            var $247 = Word$i$(Word$subber$(_a$pred$10, $243, Bool$true));
                            var $245 = $247;
                        }
                        return $245;
                    };
                    var $237 = $244;
                    break;

                  case "Word.e":
                    var $248 = _a$pred$8 => {
                        var $249 = Word$e;
                        return $249;
                    };
                    var $237 = $248;
                    break;
                }
                var $237 = $237($235);
                return $237;
            };
            var $234 = $236;
            break;

          case "Word.i":
            var $250 = self.pred;
            var $251 = _b$7 => {
                var self = _b$7;
                switch (self._) {
                  case "Word.o":
                    var $253 = self.pred;
                    var $254 = _a$pred$10 => {
                        var self = _c$4;
                        if (self) {
                            var $256 = Word$o$(Word$subber$(_a$pred$10, $253, Bool$false));
                            var $255 = $256;
                        } else {
                            var $257 = Word$i$(Word$subber$(_a$pred$10, $253, Bool$false));
                            var $255 = $257;
                        }
                        return $255;
                    };
                    var $252 = $254;
                    break;

                  case "Word.i":
                    var $258 = self.pred;
                    var $259 = _a$pred$10 => {
                        var self = _c$4;
                        if (self) {
                            var $261 = Word$i$(Word$subber$(_a$pred$10, $258, Bool$true));
                            var $260 = $261;
                        } else {
                            var $262 = Word$o$(Word$subber$(_a$pred$10, $258, Bool$false));
                            var $260 = $262;
                        }
                        return $260;
                    };
                    var $252 = $259;
                    break;

                  case "Word.e":
                    var $263 = _a$pred$8 => {
                        var $264 = Word$e;
                        return $264;
                    };
                    var $252 = $263;
                    break;
                }
                var $252 = $252($250);
                return $252;
            };
            var $234 = $251;
            break;

          case "Word.e":
            var $265 = _b$5 => {
                var $266 = Word$e;
                return $266;
            };
            var $234 = $265;
            break;
        }
        var $234 = $234(_b$3);
        return $234;
    }
    const Word$subber = x0 => x1 => x2 => Word$subber$(x0, x1, x2);
    function Word$sub$(_a$2, _b$3) {
        var $267 = Word$subber$(_a$2, _b$3, Bool$false);
        return $267;
    }
    const Word$sub = x0 => x1 => Word$sub$(x0, x1);
    function Word$div$go$(_shift$2, _sub_copy$3, _shift_copy$4, _value$5) {
        var Word$div$go$ = (_shift$2, _sub_copy$3, _shift_copy$4, _value$5) => ({
            ctr: "TCO",
            arg: [ _shift$2, _sub_copy$3, _shift_copy$4, _value$5 ]
        });
        var Word$div$go = _shift$2 => _sub_copy$3 => _shift_copy$4 => _value$5 => Word$div$go$(_shift$2, _sub_copy$3, _shift_copy$4, _value$5);
        var arg = [ _shift$2, _sub_copy$3, _shift_copy$4, _value$5 ];
        while (true) {
            let [ _shift$2, _sub_copy$3, _shift_copy$4, _value$5 ] = arg;
            var R = (() => {
                var self = Word$gte$(_sub_copy$3, _shift_copy$4);
                if (self) {
                    var _mask$6 = Word$shift_left$(_shift$2, Word$inc$(Word$to_zero$(_sub_copy$3)));
                    var $268 = Pair$new$(Bool$true, Word$or$(_value$5, _mask$6));
                    var self = $268;
                } else {
                    var $269 = Pair$new$(Bool$false, _value$5);
                    var self = $269;
                }
                switch (self._) {
                  case "Pair.new":
                    var $270 = self.fst;
                    var $271 = self.snd;
                    var self = _shift$2;
                    if (self === 0n) {
                        var $273 = $271;
                        var $272 = $273;
                    } else {
                        var $274 = self - 1n;
                        var _new_shift_copy$9 = Word$shift_right$(1n, _shift_copy$4);
                        var self = $270;
                        if (self) {
                            var $276 = Word$div$go$($274, Word$sub$(_sub_copy$3, _shift_copy$4), _new_shift_copy$9, $271);
                            var $275 = $276;
                        } else {
                            var $277 = Word$div$go$($274, _sub_copy$3, _new_shift_copy$9, $271);
                            var $275 = $277;
                        }
                        var $272 = $275;
                    }
                    ;
                    return $272;
                }
            })();
            if (R.ctr === "TCO") arg = R.arg; else return R;
        }
    }
    const Word$div$go = x0 => x1 => x2 => x3 => Word$div$go$(x0, x1, x2, x3);
    function Word$div$(_a$2, _b$3) {
        var _a_bits$4 = Word$bit_length$(_a$2);
        var _b_bits$5 = Word$bit_length$(_b$3);
        var self = _a_bits$4 < _b_bits$5;
        if (self) {
            var $279 = Word$to_zero$(_a$2);
            var $278 = $279;
        } else {
            var _shift$6 = _a_bits$4 - _b_bits$5 <= 0n ? 0n : _a_bits$4 - _b_bits$5;
            var _shift_copy$7 = Word$shift_left$(_shift$6, _b$3);
            var $280 = Word$div$go$(_shift$6, _a$2, _shift_copy$7, Word$to_zero$(_a$2));
            var $278 = $280;
        }
        return $278;
    }
    const Word$div = x0 => x1 => Word$div$(x0, x1);
    const U32$div = a0 => a1 => a0 / a1 >>> 0;
    const U32$length = a0 => a0.length >>> 0;
    const U32$eql = a0 => a1 => a0 === a1;
    const U32$inc = a0 => a0 + 1 >>> 0;
    const U32$for = a0 => a1 => a2 => a3 => u32_for(a0, a1, a2, a3);
    function Word$slice$(_a$2, _b$3, _str$4) {
        var Word$slice$ = (_a$2, _b$3, _str$4) => ({
            ctr: "TCO",
            arg: [ _a$2, _b$3, _str$4 ]
        });
        var Word$slice = _a$2 => _b$3 => _str$4 => Word$slice$(_a$2, _b$3, _str$4);
        var arg = [ _a$2, _b$3, _str$4 ];
        while (true) {
            let [ _a$2, _b$3, _str$4 ] = arg;
            var R = Word$slice$(_a$2, _b$3, _str$4);
            if (R.ctr === "TCO") arg = R.arg; else return R;
        }
    }
    const Word$slice = x0 => x1 => x2 => Word$slice$(x0, x1, x2);
    const U32$slice = a0 => a1 => a2 => a2.slice(a0, a1);
    const U32$add = a0 => a1 => a0 + a1 >>> 0;
    const U32$read_base = a0 => a1 => parseInt(a1, a0);
    function VoxBox$parse_byte$(_idx$1, _voxdata$2) {
        var _chr$3 = _voxdata$2.slice(_idx$1 * 2 >>> 0, (_idx$1 * 2 >>> 0) + 2 >>> 0);
        var $281 = parseInt(_chr$3, 16);
        return $281;
    }
    const VoxBox$parse_byte = x0 => x1 => VoxBox$parse_byte$(x0, x1);
    const U32$or = a0 => a1 => a0 | a1;
    function Word$fold$(_nil$3, _w0$4, _w1$5, _word$6) {
        var self = _word$6;
        switch (self._) {
          case "Word.o":
            var $283 = self.pred;
            var $284 = _w0$4(Word$fold$(_nil$3, _w0$4, _w1$5, $283));
            var $282 = $284;
            break;

          case "Word.i":
            var $285 = self.pred;
            var $286 = _w1$5(Word$fold$(_nil$3, _w0$4, _w1$5, $285));
            var $282 = $286;
            break;

          case "Word.e":
            var $287 = _nil$3;
            var $282 = $287;
            break;
        }
        return $282;
    }
    const Word$fold = x0 => x1 => x2 => x3 => Word$fold$(x0, x1, x2, x3);
    const Nat$add = a0 => a1 => a0 + a1;
    const Nat$mul = a0 => a1 => a0 * a1;
    function Word$to_nat$(_word$2) {
        var $288 = Word$fold$(0n, a1 => 2n * a1, _x$4 => {
            var $289 = Nat$succ$(2n * _x$4);
            return $289;
        }, _word$2);
        return $288;
    }
    const Word$to_nat = x0 => Word$to_nat$(x0);
    function Word$shl$(_n$2, _value$3) {
        var _n_nat$4 = Word$to_nat$(_n$2);
        var $290 = Word$shift_left$(_n_nat$4, _value$3);
        return $290;
    }
    const Word$shl = x0 => x1 => Word$shl$(x0, x1);
    const U32$shl = a0 => a1 => a0 << a1 >>> 0;
    const Pos32$new = a0 => a1 => a2 => 0 | a0 | a1 << 12 | a2 << 24;
    const Col32$new = a0 => a1 => a2 => a3 => 0 | a0 | a1 << 8 | a2 << 16 | a3 << 24;
    function Word$trim$(_new_size$2, _word$3) {
        var self = _new_size$2;
        if (self === 0n) {
            var $292 = Word$e;
            var $291 = $292;
        } else {
            var $293 = self - 1n;
            var self = _word$3;
            switch (self._) {
              case "Word.o":
                var $295 = self.pred;
                var $296 = Word$o$(Word$trim$($293, $295));
                var $294 = $296;
                break;

              case "Word.i":
                var $297 = self.pred;
                var $298 = Word$i$(Word$trim$($293, $297));
                var $294 = $298;
                break;

              case "Word.e":
                var $299 = Word$o$(Word$trim$($293, Word$e));
                var $294 = $299;
                break;
            }
            var $291 = $294;
        }
        return $291;
    }
    const Word$trim = x0 => x1 => Word$trim$(x0, x1);
    const Unit$new = null;
    function Array$extract_tip$(_arr$2) {
        var self = _arr$2;
        switch (self._) {
          case "Array.tip":
            var $301 = self.value;
            var $302 = $301;
            var $300 = $302;
            break;

          case "Array.tie":
            var $303 = Unit$new;
            var $300 = $303;
            break;
        }
        return $300;
    }
    const Array$extract_tip = x0 => Array$extract_tip$(x0);
    function Array$extract_tie$(_arr$3) {
        var self = _arr$3;
        switch (self._) {
          case "Array.tie":
            var $305 = self.lft;
            var $306 = self.rgt;
            var $307 = Pair$new$($305, $306);
            var $304 = $307;
            break;

          case "Array.tip":
            var $308 = Unit$new;
            var $304 = $308;
            break;
        }
        return $304;
    }
    const Array$extract_tie = x0 => Array$extract_tie$(x0);
    function Word$foldl$(_nil$3, _w0$4, _w1$5, _word$6) {
        var Word$foldl$ = (_nil$3, _w0$4, _w1$5, _word$6) => ({
            ctr: "TCO",
            arg: [ _nil$3, _w0$4, _w1$5, _word$6 ]
        });
        var Word$foldl = _nil$3 => _w0$4 => _w1$5 => _word$6 => Word$foldl$(_nil$3, _w0$4, _w1$5, _word$6);
        var arg = [ _nil$3, _w0$4, _w1$5, _word$6 ];
        while (true) {
            let [ _nil$3, _w0$4, _w1$5, _word$6 ] = arg;
            var R = (() => {
                var self = _word$6;
                switch (self._) {
                  case "Word.o":
                    var $309 = self.pred;
                    var $310 = Word$foldl$(_w0$4(_nil$3), _w0$4, _w1$5, $309);
                    return $310;

                  case "Word.i":
                    var $311 = self.pred;
                    var $312 = Word$foldl$(_w1$5(_nil$3), _w0$4, _w1$5, $311);
                    return $312;

                  case "Word.e":
                    var $313 = _nil$3;
                    return $313;
                }
            })();
            if (R.ctr === "TCO") arg = R.arg; else return R;
        }
    }
    const Word$foldl = x0 => x1 => x2 => x3 => Word$foldl$(x0, x1, x2, x3);
    function Array$mut$(_idx$3, _f$4, _arr$5) {
        var $314 = Word$foldl$(_arr$6 => {
            var $315 = Array$tip$(_f$4(Array$extract_tip$(_arr$6)));
            return $315;
        }, _rec$7 => _arr$8 => {
            var self = Array$extract_tie$(_arr$8);
            switch (self._) {
              case "Pair.new":
                var $317 = self.fst;
                var $318 = self.snd;
                var $319 = Array$tie$(_rec$7($317), $318);
                var $316 = $319;
                break;
            }
            return $316;
        }, _rec$7 => _arr$8 => {
            var self = Array$extract_tie$(_arr$8);
            switch (self._) {
              case "Pair.new":
                var $321 = self.fst;
                var $322 = self.snd;
                var $323 = Array$tie$($321, _rec$7($322));
                var $320 = $323;
                break;
            }
            return $320;
        }, _idx$3)(_arr$5);
        return $314;
    }
    const Array$mut = x0 => x1 => x2 => Array$mut$(x0, x1, x2);
    function Array$set$(_idx$3, _val$4, _arr$5) {
        var $324 = Array$mut$(_idx$3, _x$6 => {
            var $325 = _val$4;
            return $325;
        }, _arr$5);
        return $324;
    }
    const Array$set = x0 => x1 => x2 => Array$set$(x0, x1, x2);
    const Buffer32$set = a0 => a1 => a2 => (a2[a0] = a1, a2);
    const VoxBox$set_pos = a0 => a1 => a2 => (a2.buffer[a0 * 2] = a1, a2);
    const VoxBox$set_col = a0 => a1 => a2 => (a2.buffer[a0 * 2 + 1] = a1, a2);
    function VoxBox$set_length$(_length$1, _img$2) {
        var self = _img$2;
        switch (self._) {
          case "VoxBox.new":
            var $327 = self.capacity;
            var $328 = self.buffer;
            var $329 = VoxBox$new$(_length$1, $327, $328);
            var $326 = $329;
            break;
        }
        return $326;
    }
    const VoxBox$set_length = x0 => x1 => VoxBox$set_length$(x0, x1);
    const VoxBox$push = a0 => a1 => a2 => (a2.buffer[a2.length * 2] = a0, a2.buffer[a2.length * 2 + 1] = a1, 
    a2.length++, a2);
    function VoxBox$parse$(_voxdata$1) {
        var _siz$2 = (_voxdata$1.length >>> 0) / 12 >>> 0;
        var _img$3 = VoxBox$alloc_capacity$(_siz$2);
        var _img$4 = (() => {
            var $331 = _img$3;
            var $332 = 0;
            var $333 = _siz$2;
            let _img$5 = $331;
            for (let _i$4 = $332; _i$4 < $333; ++_i$4) {
                var _x$6 = VoxBox$parse_byte$((_i$4 * 6 >>> 0) + 0 >>> 0, _voxdata$1);
                var _y$7 = VoxBox$parse_byte$((_i$4 * 6 >>> 0) + 1 >>> 0, _voxdata$1);
                var _z$8 = VoxBox$parse_byte$((_i$4 * 6 >>> 0) + 2 >>> 0, _voxdata$1);
                var _r$9 = VoxBox$parse_byte$((_i$4 * 6 >>> 0) + 3 >>> 0, _voxdata$1);
                var _g$10 = VoxBox$parse_byte$((_i$4 * 6 >>> 0) + 4 >>> 0, _voxdata$1);
                var _b$11 = VoxBox$parse_byte$((_i$4 * 6 >>> 0) + 5 >>> 0, _voxdata$1);
                var _pos$12 = 0 | _x$6 | _y$7 << 12 | _z$8 << 24;
                var _col$13 = 0 | _r$9 | _g$10 << 8 | _b$11 << 16 | 255 << 24;
                var $331 = (_img$5.buffer[_img$5.length * 2] = _pos$12, _img$5.buffer[_img$5.length * 2 + 1] = _col$13, 
                _img$5.length++, _img$5);
                _img$5 = $331;
            }
            return _img$5;
        })();
        var $330 = _img$4;
        return $330;
    }
    const VoxBox$parse = x0 => VoxBox$parse$(x0);
    const App$Kaelin$Assets$hero$croni0_d_1 = VoxBox$parse$("0f0b16351d4d100b16351d4d0d0c15351d4d0e0c15351d4d0f0c156a3a86100c158e4a9d110c15351d4d120c15351d4d0c0d14351d4d0d0d146a3a860e0d146a3a860f0d148e4a9d100d146a3a86110d146a3a86120d146a3a86130d14351d4d0b0e13351d4d0c0e136a3a860d0e136a3a860e0e136a3a860f0e136a3a86100e136a3a86110e136a3a86120e136a3a86130e136a3a86140e13351d4d0a0f12351d4d0b0f126a3a860c0f126a3a860d0f126a3a860e0f126a3a860f0f126a3a86100f126a3a86110f126a3a86120f126a3a86130f126a3a86140f126a3a86150f12351d4d0a1011351d4d0b10116a3a860c10116a3a860d10116a3a860e10116a3a860f10116a3a861010116a3a861110116a3a861210116a3a861310116a3a861410116a3a86151011351d4d091110351d4d0a11106a3a860b11106a3a860c11106a3a860d11106a3a860e11106a3a860f11106a3a861011106a3a861111106a3a861211106a3a861311106a3a861411106a3a861511106a3a86161110351d4d09120f351d4d0a120f6a3a860b120f6a3a860c120f602d800d120f602d800e120f6a3a860f120f6a3a8610120f6a3a8611120f6a3a8612120f602d8013120f602d8014120f6a3a8615120f6a3a8616120f351d4d09130e351d4d0a130e602d800b130e602d800c130e351d4d0d130e351d4d0e130e6a3a860f130e6a3a8610130e6a3a8611130e6a3a8612130e351d4d13130e351d4d14130e602d8015130e602d8016130e351d4d09140d351d4d0a140d602d800b140d351d4d0c140d351d4d0d140d531e480e140d351d4d0f140d6a3a8610140d6a3a8611140d351d4d12140d531e4813140d351d4d14140d351d4d15140d4a358016140d351d4d09150c351d4d0a150c4a35800b150c351d4d0c150c531e480d150cdf3e460e150c531e480f150c351d4d10150c351d4d11150c531e4812150cdf3e4613150c531e4814150c351d4d15150c4a358016150c351d4d0a160b351d4d0b160b4a35800c160b351d4d0d160b531e480e160b351d4d0f160b351d4d10160b351d4d11160b351d4d12160b531e4813160b351d4d14160b4a358015160b351d4d0b170a351d4d0c170a4a35800d170a8e4a9d0e170a351d4d0f170a351d4d10170a351d4d11170a351d4d12170a8e4a9d13170a4a358014170a351d4d0d1809351d4d0e1809602d800f1809602d801018094a3580111809602d80121809351d4d0c1908351d4d0d19086a3a860e19086a3a860f19086a3a861019084a35801119086a3a861219086a3a86131908351d4d0c1a07351d4d0d1a076a3a860e1a076a3a860f1a076a3a86101a074a3580111a076a3a86121a076a3a86131a07351d4d0c1b06351d4d0d1b068e4a9d0e1b066a3a860f1b066a3a86101b064a3580111b066a3a86121b068e4a9d131b06351d4d0d1c05351d4d0e1c05351d4d0f1c05351d4d101c05351d4d111c05351d4d121c05351d4d111d04351d4d121d04351d4d");
    function I32$new$(_value$1) {
        var $334 = word_to_i32(_value$1);
        return $334;
    }
    const I32$new = x0 => I32$new$(x0);
    function Word$neg$aux$(_word$2, _inc$3) {
        var self = _word$2;
        switch (self._) {
          case "Word.o":
            var $336 = self.pred;
            var self = _inc$3;
            if (self) {
                var $338 = Word$o$(Word$neg$aux$($336, Bool$true));
                var $337 = $338;
            } else {
                var $339 = Word$i$(Word$neg$aux$($336, Bool$false));
                var $337 = $339;
            }
            ;
            var $335 = $337;
            break;

          case "Word.i":
            var $340 = self.pred;
            var self = _inc$3;
            if (self) {
                var $342 = Word$i$(Word$neg$aux$($340, Bool$false));
                var $341 = $342;
            } else {
                var $343 = Word$o$(Word$neg$aux$($340, Bool$false));
                var $341 = $343;
            }
            ;
            var $335 = $341;
            break;

          case "Word.e":
            var $344 = Word$e;
            var $335 = $344;
            break;
        }
        return $335;
    }
    const Word$neg$aux = x0 => x1 => Word$neg$aux$(x0, x1);
    function Word$neg$(_word$2) {
        var self = _word$2;
        switch (self._) {
          case "Word.o":
            var $346 = self.pred;
            var $347 = Word$o$(Word$neg$aux$($346, Bool$true));
            var $345 = $347;
            break;

          case "Word.i":
            var $348 = self.pred;
            var $349 = Word$i$(Word$neg$aux$($348, Bool$false));
            var $345 = $349;
            break;

          case "Word.e":
            var $350 = Word$e;
            var $345 = $350;
            break;
        }
        return $345;
    }
    const Word$neg = x0 => Word$neg$(x0);
    const I32$neg = a0 => -a0;
    const Int$to_i32 = a0 => Number(a0);
    const Int$new = a0 => a1 => a0 - a1;
    const Int$from_nat = a0 => a0;
    const I32$from_nat = a0 => Number(a0);
    function List$cons$(_head$2, _tail$3) {
        var $351 = {
            _: "List.cons",
            head: _head$2,
            tail: _tail$3
        };
        return $351;
    }
    const List$cons = x0 => x1 => List$cons$(x0, x1);
    function App$Kaelin$Skill$new$(_name$1, _range$2, _effect$3, _key$4) {
        var $352 = {
            _: "App.Kaelin.Skill.new",
            name: _name$1,
            range: _range$2,
            effect: _effect$3,
            key: _key$4
        };
        return $352;
    }
    const App$Kaelin$Skill$new = x0 => x1 => x2 => x3 => App$Kaelin$Skill$new$(x0, x1, x2, x3);
    function App$Kaelin$Effect$Result$(_A$1) {
        var $353 = null;
        return $353;
    }
    const App$Kaelin$Effect$Result = x0 => App$Kaelin$Effect$Result$(x0);
    function List$(_A$1) {
        var $354 = null;
        return $354;
    }
    const List = x0 => List$(x0);
    function List$concat$(_as$2, _bs$3) {
        var self = _as$2;
        switch (self._) {
          case "List.cons":
            var $356 = self.head;
            var $357 = self.tail;
            var $358 = List$cons$($356, List$concat$($357, _bs$3));
            var $355 = $358;
            break;

          case "List.nil":
            var $359 = _bs$3;
            var $355 = $359;
            break;
        }
        return $355;
    }
    const List$concat = x0 => x1 => List$concat$(x0, x1);
    function BitsMap$(_A$1) {
        var $360 = null;
        return $360;
    }
    const BitsMap = x0 => BitsMap$(x0);
    function BitsMap$tie$(_val$2, _lft$3, _rgt$4) {
        var $361 = {
            _: "BitsMap.tie",
            val: _val$2,
            lft: _lft$3,
            rgt: _rgt$4
        };
        return $361;
    }
    const BitsMap$tie = x0 => x1 => x2 => BitsMap$tie$(x0, x1, x2);
    function BitsMap$union$(_a$2, _b$3) {
        var self = _a$2;
        switch (self._) {
          case "BitsMap.tie":
            var $363 = self.val;
            var $364 = self.lft;
            var $365 = self.rgt;
            var self = _b$3;
            switch (self._) {
              case "BitsMap.tie":
                var $367 = self.val;
                var $368 = self.lft;
                var $369 = self.rgt;
                var self = $363;
                switch (self._) {
                  case "Maybe.none":
                    var $371 = BitsMap$tie$($367, BitsMap$union$($364, $368), BitsMap$union$($365, $369));
                    var $370 = $371;
                    break;

                  case "Maybe.some":
                    var $372 = BitsMap$tie$($363, BitsMap$union$($364, $368), BitsMap$union$($365, $369));
                    var $370 = $372;
                    break;
                }
                ;
                var $366 = $370;
                break;

              case "BitsMap.new":
                var $373 = _a$2;
                var $366 = $373;
                break;
            }
            ;
            var $362 = $366;
            break;

          case "BitsMap.new":
            var $374 = _b$3;
            var $362 = $374;
            break;
        }
        return $362;
    }
    const BitsMap$union = x0 => x1 => BitsMap$union$(x0, x1);
    function NatMap$union$(_a$2, _b$3) {
        var $375 = BitsMap$union$(_a$2, _b$3);
        return $375;
    }
    const NatMap$union = x0 => x1 => NatMap$union$(x0, x1);
    function App$Kaelin$Effect$Result$new$(_value$2, _map$3, _futures$4, _indicators$5) {
        var $376 = {
            _: "App.Kaelin.Effect.Result.new",
            value: _value$2,
            map: _map$3,
            futures: _futures$4,
            indicators: _indicators$5
        };
        return $376;
    }
    const App$Kaelin$Effect$Result$new = x0 => x1 => x2 => x3 => App$Kaelin$Effect$Result$new$(x0, x1, x2, x3);
    function App$Kaelin$Effect$bind$(_effect$3, _next$4, _center$5, _target$6, _map$7) {
        var self = _effect$3(_center$5)(_target$6)(_map$7);
        switch (self._) {
          case "App.Kaelin.Effect.Result.new":
            var $378 = self.value;
            var $379 = self.map;
            var $380 = self.futures;
            var $381 = self.indicators;
            var self = _next$4($378)(_center$5)(_target$6)($379);
            switch (self._) {
              case "App.Kaelin.Effect.Result.new":
                var $383 = self.value;
                var $384 = self.map;
                var $385 = self.futures;
                var $386 = self.indicators;
                var _value$16 = $383;
                var _map$17 = $384;
                var _futures$18 = List$concat$($380, $385);
                var _indicators$19 = NatMap$union$($381, $386);
                var $387 = App$Kaelin$Effect$Result$new$(_value$16, _map$17, _futures$18, _indicators$19);
                var $382 = $387;
                break;
            }
            ;
            var $377 = $382;
            break;
        }
        return $377;
    }
    const App$Kaelin$Effect$bind = x0 => x1 => x2 => x3 => x4 => App$Kaelin$Effect$bind$(x0, x1, x2, x3, x4);
    const List$nil = {
        _: "List.nil"
    };
    const BitsMap$new = {
        _: "BitsMap.new"
    };
    const NatMap$new = BitsMap$new;
    function App$Kaelin$Effect$pure$(_value$2, _center$3, _target$4, _map$5) {
        var $388 = App$Kaelin$Effect$Result$new$(_value$2, _map$5, List$nil, NatMap$new);
        return $388;
    }
    const App$Kaelin$Effect$pure = x0 => x1 => x2 => x3 => App$Kaelin$Effect$pure$(x0, x1, x2, x3);
    function App$Kaelin$Effect$monad$(_new$2) {
        var $389 = _new$2(App$Kaelin$Effect$bind)(App$Kaelin$Effect$pure);
        return $389;
    }
    const App$Kaelin$Effect$monad = x0 => App$Kaelin$Effect$monad$(x0);
    function App$Kaelin$Effect$coord$get_center$(_center$1, _target$2, _map$3) {
        var $390 = App$Kaelin$Effect$Result$new$(_center$1, _map$3, List$nil, NatMap$new);
        return $390;
    }
    const App$Kaelin$Effect$coord$get_center = x0 => x1 => x2 => App$Kaelin$Effect$coord$get_center$(x0, x1, x2);
    function App$Kaelin$Effect$coord$get_target$(_center$1, _target$2, _map$3) {
        var $391 = App$Kaelin$Effect$Result$new$(_target$2, _map$3, List$nil, NatMap$new);
        return $391;
    }
    const App$Kaelin$Effect$coord$get_target = x0 => x1 => x2 => App$Kaelin$Effect$coord$get_target$(x0, x1, x2);
    const NatMap = null;
    function App$Kaelin$Effect$map$get$(_center$1, _target$2, _map$3) {
        var $392 = App$Kaelin$Effect$Result$new$(_map$3, _map$3, List$nil, NatMap$new);
        return $392;
    }
    const App$Kaelin$Effect$map$get = x0 => x1 => x2 => App$Kaelin$Effect$map$get$(x0, x1, x2);
    const Bool$and = a0 => a1 => a0 && a1;
    const I32$eql = a0 => a1 => a0 === a1;
    function App$Kaelin$Coord$eql$(_a$1, _b$2) {
        var self = _a$1;
        switch (self._) {
          case "App.Kaelin.Coord.new":
            var $394 = self.i;
            var $395 = self.j;
            var self = _b$2;
            switch (self._) {
              case "App.Kaelin.Coord.new":
                var $397 = self.i;
                var $398 = self.j;
                var $399 = $394 === $397 && $395 === $398;
                var $396 = $399;
                break;
            }
            ;
            var $393 = $396;
            break;
        }
        return $393;
    }
    const App$Kaelin$Coord$eql = x0 => x1 => App$Kaelin$Coord$eql$(x0, x1);
    function App$Kaelin$Effect$(_A$1) {
        var $400 = null;
        return $400;
    }
    const App$Kaelin$Effect = x0 => App$Kaelin$Effect$(x0);
    const I32$add = a0 => a1 => a0 + a1 >> 0;
    const I32$mul = a0 => a1 => a0 * a1 >> 0;
    const F64$to_u32 = a0 => a0 >>> 0;
    function Word$s_to_f64$(_a$2) {
        var Word$s_to_f64$ = _a$2 => ({
            ctr: "TCO",
            arg: [ _a$2 ]
        });
        var Word$s_to_f64 = _a$2 => Word$s_to_f64$(_a$2);
        var arg = [ _a$2 ];
        while (true) {
            let [ _a$2 ] = arg;
            var R = Word$s_to_f64$(_a$2);
            if (R.ctr === "TCO") arg = R.arg; else return R;
        }
    }
    const Word$s_to_f64 = x0 => Word$s_to_f64$(x0);
    const I32$to_f64 = a0 => a0;
    function I32$to_u32$(_n$1) {
        var $401 = _n$1 >>> 0;
        return $401;
    }
    const I32$to_u32 = x0 => I32$to_u32$(x0);
    const U32$to_nat = a0 => BigInt(a0);
    function App$Kaelin$Coord$Convert$axial_to_nat$(_coord$1) {
        var self = _coord$1;
        switch (self._) {
          case "App.Kaelin.Coord.new":
            var $403 = self.i;
            var $404 = self.j;
            var _i$4 = $403 + 100 >> 0;
            var _i$5 = _i$4 * 1e3 >> 0;
            var _i$6 = I32$to_u32$(_i$5);
            var _j$7 = $404 + 100 >> 0;
            var _j$8 = I32$to_u32$(_j$7);
            var _sum$9 = _i$6 + _j$8 >>> 0;
            var $405 = BigInt(_sum$9);
            var $402 = $405;
            break;
        }
        return $402;
    }
    const App$Kaelin$Coord$Convert$axial_to_nat = x0 => App$Kaelin$Coord$Convert$axial_to_nat$(x0);
    const BitsMap$get = a0 => a1 => bitsmap_get(a0, a1);
    const Bits$o = a0 => a0 + "0";
    const Bits$e = "";
    const Bits$i = a0 => a0 + "1";
    function Bits$inc$(_a$1) {
        var self = _a$1;
        switch (self.length === 0 ? "e" : self[self.length - 1] === "0" ? "o" : "i") {
          case "o":
            var $407 = self.slice(0, -1);
            var $408 = $407 + "1";
            var $406 = $408;
            break;

          case "i":
            var $409 = self.slice(0, -1);
            var $410 = Bits$inc$($409) + "0";
            var $406 = $410;
            break;

          case "e":
            var $411 = Bits$e + "1";
            var $406 = $411;
            break;
        }
        return $406;
    }
    const Bits$inc = x0 => Bits$inc$(x0);
    const Nat$to_bits = a0 => nat_to_bits(a0);
    function NatMap$get$(_key$2, _map$3) {
        var $412 = bitsmap_get(nat_to_bits(_key$2), _map$3);
        return $412;
    }
    const NatMap$get = x0 => x1 => NatMap$get$(x0, x1);
    function App$Kaelin$Map$creature$get$(_coord$1, _map$2) {
        var _key$3 = App$Kaelin$Coord$Convert$axial_to_nat$(_coord$1);
        var _tile$4 = NatMap$get$(_key$3, _map$2);
        var self = _tile$4;
        switch (self._) {
          case "Maybe.some":
            var $414 = self.value;
            var self = $414;
            switch (self._) {
              case "App.Kaelin.Tile.new":
                var $416 = self.creature;
                var $417 = $416;
                var $415 = $417;
                break;
            }
            ;
            var $413 = $415;
            break;

          case "Maybe.none":
            var $418 = Maybe$none;
            var $413 = $418;
            break;
        }
        return $413;
    }
    const App$Kaelin$Map$creature$get = x0 => x1 => App$Kaelin$Map$creature$get$(x0, x1);
    function Word$is_neg$go$(_word$2, _n$3) {
        var Word$is_neg$go$ = (_word$2, _n$3) => ({
            ctr: "TCO",
            arg: [ _word$2, _n$3 ]
        });
        var Word$is_neg$go = _word$2 => _n$3 => Word$is_neg$go$(_word$2, _n$3);
        var arg = [ _word$2, _n$3 ];
        while (true) {
            let [ _word$2, _n$3 ] = arg;
            var R = (() => {
                var self = _word$2;
                switch (self._) {
                  case "Word.o":
                    var $419 = self.pred;
                    var $420 = Word$is_neg$go$($419, Bool$false);
                    return $420;

                  case "Word.i":
                    var $421 = self.pred;
                    var $422 = Word$is_neg$go$($421, Bool$true);
                    return $422;

                  case "Word.e":
                    var $423 = _n$3;
                    return $423;
                }
            })();
            if (R.ctr === "TCO") arg = R.arg; else return R;
        }
    }
    const Word$is_neg$go = x0 => x1 => Word$is_neg$go$(x0, x1);
    function Word$is_neg$(_word$2) {
        var $424 = Word$is_neg$go$(_word$2, Bool$false);
        return $424;
    }
    const Word$is_neg = x0 => Word$is_neg$(x0);
    function Cmp$as_gtn$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
          case "Cmp.ltn":
          case "Cmp.eql":
            var $426 = Bool$false;
            var $425 = $426;
            break;

          case "Cmp.gtn":
            var $427 = Bool$true;
            var $425 = $427;
            break;
        }
        return $425;
    }
    const Cmp$as_gtn = x0 => Cmp$as_gtn$(x0);
    function Cmp$inv$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
          case "Cmp.ltn":
            var $429 = Cmp$gtn;
            var $428 = $429;
            break;

          case "Cmp.eql":
            var $430 = Cmp$eql;
            var $428 = $430;
            break;

          case "Cmp.gtn":
            var $431 = Cmp$ltn;
            var $428 = $431;
            break;
        }
        return $428;
    }
    const Cmp$inv = x0 => Cmp$inv$(x0);
    function Word$s_gtn$(_a$2, _b$3) {
        var _neg_a$4 = Word$is_neg$(_a$2);
        var _neg_b$5 = Word$is_neg$(_b$3);
        var self = _neg_a$4;
        if (self) {
            var self = _neg_b$5;
            if (self) {
                var $434 = Cmp$as_gtn$(Cmp$inv$(Word$cmp$(_a$2, _b$3)));
                var $433 = $434;
            } else {
                var $435 = Bool$false;
                var $433 = $435;
            }
            var $432 = $433;
        } else {
            var self = _neg_b$5;
            if (self) {
                var $437 = Bool$true;
                var $436 = $437;
            } else {
                var $438 = Cmp$as_gtn$(Word$cmp$(_a$2, _b$3));
                var $436 = $438;
            }
            var $432 = $436;
        }
        return $432;
    }
    const Word$s_gtn = x0 => x1 => Word$s_gtn$(x0, x1);
    const I32$gtn = a0 => a1 => a0 > a1;
    function I32$max$(_a$1, _b$2) {
        var self = _a$1 > _b$2;
        if (self) {
            var $440 = _a$1;
            var $439 = $440;
        } else {
            var $441 = _b$2;
            var $439 = $441;
        }
        return $439;
    }
    const I32$max = x0 => x1 => I32$max$(x0, x1);
    function Cmp$as_ltn$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
          case "Cmp.ltn":
            var $443 = Bool$true;
            var $442 = $443;
            break;

          case "Cmp.eql":
          case "Cmp.gtn":
            var $444 = Bool$false;
            var $442 = $444;
            break;
        }
        return $442;
    }
    const Cmp$as_ltn = x0 => Cmp$as_ltn$(x0);
    function Word$s_ltn$(_a$2, _b$3) {
        var _neg_a$4 = Word$is_neg$(_a$2);
        var _neg_b$5 = Word$is_neg$(_b$3);
        var self = _neg_a$4;
        if (self) {
            var self = _neg_b$5;
            if (self) {
                var $447 = Cmp$as_ltn$(Cmp$inv$(Word$cmp$(_a$2, _b$3)));
                var $446 = $447;
            } else {
                var $448 = Bool$true;
                var $446 = $448;
            }
            var $445 = $446;
        } else {
            var self = _neg_b$5;
            if (self) {
                var $450 = Bool$false;
                var $449 = $450;
            } else {
                var $451 = Cmp$as_ltn$(Word$cmp$(_a$2, _b$3));
                var $449 = $451;
            }
            var $445 = $449;
        }
        return $445;
    }
    const Word$s_ltn = x0 => x1 => Word$s_ltn$(x0, x1);
    const I32$ltn = a0 => a1 => a0 < a1;
    function I32$min$(_a$1, _b$2) {
        var self = _a$1 < _b$2;
        if (self) {
            var $453 = _a$1;
            var $452 = $453;
        } else {
            var $454 = _b$2;
            var $452 = $454;
        }
        return $452;
    }
    const I32$min = x0 => x1 => I32$min$(x0, x1);
    const I32$sub = a0 => a1 => a0 - a1 >> 0;
    function Maybe$bind$(_m$3, _f$4) {
        var self = _m$3;
        switch (self._) {
          case "Maybe.some":
            var $456 = self.value;
            var $457 = _f$4($456);
            var $455 = $457;
            break;

          case "Maybe.none":
            var $458 = Maybe$none;
            var $455 = $458;
            break;
        }
        return $455;
    }
    const Maybe$bind = x0 => x1 => Maybe$bind$(x0, x1);
    function Maybe$monad$(_new$2) {
        var $459 = _new$2(Maybe$bind)(Maybe$some);
        return $459;
    }
    const Maybe$monad = x0 => Maybe$monad$(x0);
    function App$Kaelin$Tile$new$(_background$1, _creature$2, _animation$3) {
        var $460 = {
            _: "App.Kaelin.Tile.new",
            background: _background$1,
            creature: _creature$2,
            animation: _animation$3
        };
        return $460;
    }
    const App$Kaelin$Tile$new = x0 => x1 => x2 => App$Kaelin$Tile$new$(x0, x1, x2);
    const BitsMap$set = a0 => a1 => a2 => bitsmap_set(a0, a1, a2, "set");
    function NatMap$set$(_key$2, _val$3, _map$4) {
        var $461 = bitsmap_set(nat_to_bits(_key$2), _val$3, _map$4, "set");
        return $461;
    }
    const NatMap$set = x0 => x1 => x2 => NatMap$set$(x0, x1, x2);
    function App$Kaelin$Map$creature$modify_at$(_mod$1, _pos$2, _map$3) {
        var _key$4 = App$Kaelin$Coord$Convert$axial_to_nat$(_pos$2);
        var _result$4 = Maybe$monad$(_m$bind$5 => _m$pure$6 => {
            var $463 = _m$bind$5;
            return $463;
        })(NatMap$get$(_key$4, _map$3))(_tile$5 => {
            var $464 = Maybe$monad$(_m$bind$6 => _m$pure$7 => {
                var $465 = _m$bind$6;
                return $465;
            })((() => {
                var self = _tile$5;
                switch (self._) {
                  case "App.Kaelin.Tile.new":
                    var $466 = self.creature;
                    var $467 = $466;
                    return $467;
                }
            })())(_creature$6 => {
                var _new_creature$7 = _mod$1(_creature$6);
                var _new_tile$8 = App$Kaelin$Tile$new$((() => {
                    var self = _tile$5;
                    switch (self._) {
                      case "App.Kaelin.Tile.new":
                        var $469 = self.background;
                        var $470 = $469;
                        return $470;
                    }
                })(), Maybe$some$(_new_creature$7), (() => {
                    var self = _tile$5;
                    switch (self._) {
                      case "App.Kaelin.Tile.new":
                        var $471 = self.animation;
                        var $472 = $471;
                        return $472;
                    }
                })());
                var _new_map$9 = NatMap$set$(_key$4, _new_tile$8, _map$3);
                var $468 = Maybe$monad$(_m$bind$10 => _m$pure$11 => {
                    var $473 = _m$pure$11;
                    return $473;
                })(_new_map$9);
                return $468;
            });
            return $464;
        });
        var $462 = Maybe$default$(_result$4, _map$3);
        return $462;
    }
    const App$Kaelin$Map$creature$modify_at = x0 => x1 => x2 => App$Kaelin$Map$creature$modify_at$(x0, x1, x2);
    function Cmp$as_lte$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
          case "Cmp.ltn":
          case "Cmp.eql":
            var $475 = Bool$true;
            var $474 = $475;
            break;

          case "Cmp.gtn":
            var $476 = Bool$false;
            var $474 = $476;
            break;
        }
        return $474;
    }
    const Cmp$as_lte = x0 => Cmp$as_lte$(x0);
    function Word$s_lte$(_a$2, _b$3) {
        var _neg_a$4 = Word$is_neg$(_a$2);
        var _neg_b$5 = Word$is_neg$(_b$3);
        var self = _neg_a$4;
        if (self) {
            var self = _neg_b$5;
            if (self) {
                var $479 = Cmp$as_lte$(Cmp$inv$(Word$cmp$(_a$2, _b$3)));
                var $478 = $479;
            } else {
                var $480 = Bool$true;
                var $478 = $480;
            }
            var $477 = $478;
        } else {
            var self = _neg_b$5;
            if (self) {
                var $482 = Bool$false;
                var $481 = $482;
            } else {
                var $483 = Cmp$as_lte$(Word$cmp$(_a$2, _b$3));
                var $481 = $483;
            }
            var $477 = $481;
        }
        return $477;
    }
    const Word$s_lte = x0 => x1 => Word$s_lte$(x0, x1);
    const I32$lte = a0 => a1 => a0 <= a1;
    function App$Kaelin$Creature$new$(_player$1, _hero$2, _team$3, _hp$4, _ap$5, _status$6) {
        var $484 = {
            _: "App.Kaelin.Creature.new",
            player: _player$1,
            hero: _hero$2,
            team: _team$3,
            hp: _hp$4,
            ap: _ap$5,
            status: _status$6
        };
        return $484;
    }
    const App$Kaelin$Creature$new = x0 => x1 => x2 => x3 => x4 => x5 => App$Kaelin$Creature$new$(x0, x1, x2, x3, x4, x5);
    function App$Kaelin$Tile$creature$change_hp$(_change$1, _creature$2) {
        var self = _creature$2;
        switch (self._) {
          case "App.Kaelin.Creature.new":
            var $486 = self.hero;
            var $487 = self.hp;
            var self = $486;
            switch (self._) {
              case "App.Kaelin.Hero.new":
                var $489 = self.max_hp;
                var self = $487 <= 0;
                if (self) {
                    var $491 = _creature$2;
                    var $490 = $491;
                } else {
                    var self = _creature$2;
                    switch (self._) {
                      case "App.Kaelin.Creature.new":
                        var $493 = self.player;
                        var $494 = self.hero;
                        var $495 = self.team;
                        var $496 = self.ap;
                        var $497 = self.status;
                        var $498 = App$Kaelin$Creature$new$($493, $494, $495, I32$min$($487 + _change$1 >> 0, $489), $496, $497);
                        var $492 = $498;
                        break;
                    }
                    var $490 = $492;
                }
                ;
                var $488 = $490;
                break;
            }
            ;
            var $485 = $488;
            break;
        }
        return $485;
    }
    const App$Kaelin$Tile$creature$change_hp = x0 => x1 => App$Kaelin$Tile$creature$change_hp$(x0, x1);
    function App$Kaelin$Map$creature$change_hp_at$(_value$1, _pos$2, _map$3) {
        var _creature$4 = App$Kaelin$Map$creature$get$(_pos$2, _map$3);
        var self = _creature$4;
        switch (self._) {
          case "Maybe.some":
            var $500 = self.value;
            var self = $500;
            switch (self._) {
              case "App.Kaelin.Creature.new":
                var $502 = self.hero;
                var self = $502;
                switch (self._) {
                  case "App.Kaelin.Hero.new":
                    var $504 = self.max_hp;
                    var _new_hp$17 = I32$max$((() => {
                        var self = $500;
                        switch (self._) {
                          case "App.Kaelin.Creature.new":
                            var $506 = self.hp;
                            var $507 = $506;
                            return $507;
                        }
                    })() + _value$1 >> 0, 0);
                    var _new_hp$18 = I32$min$(_new_hp$17, $504);
                    var _hp_diff$19 = _new_hp$18 - (() => {
                        var self = $500;
                        switch (self._) {
                          case "App.Kaelin.Creature.new":
                            var $508 = self.hp;
                            var $509 = $508;
                            return $509;
                        }
                    })() >> 0;
                    var _map$20 = App$Kaelin$Map$creature$modify_at$(App$Kaelin$Tile$creature$change_hp(_hp_diff$19), _pos$2, _map$3);
                    var $505 = Pair$new$(_hp_diff$19, _map$20);
                    var $503 = $505;
                    break;
                }
                ;
                var $501 = $503;
                break;
            }
            ;
            var $499 = $501;
            break;

          case "Maybe.none":
            var $510 = Pair$new$(0, _map$3);
            var $499 = $510;
            break;
        }
        return $499;
    }
    const App$Kaelin$Map$creature$change_hp_at = x0 => x1 => x2 => App$Kaelin$Map$creature$change_hp_at$(x0, x1, x2);
    function App$Kaelin$Map$get$(_coord$1, _map$2) {
        var _key$3 = App$Kaelin$Coord$Convert$axial_to_nat$(_coord$1);
        var $511 = NatMap$get$(_key$3, _map$2);
        return $511;
    }
    const App$Kaelin$Map$get = x0 => x1 => App$Kaelin$Map$get$(x0, x1);
    function App$Kaelin$Map$is_occupied$(_coord$1, _map$2) {
        var _maybe_tile$3 = App$Kaelin$Map$get$(_coord$1, _map$2);
        var self = _maybe_tile$3;
        switch (self._) {
          case "Maybe.some":
            var $513 = self.value;
            var self = $513;
            switch (self._) {
              case "App.Kaelin.Tile.new":
                var $515 = self.creature;
                var self = $515;
                switch (self._) {
                  case "Maybe.none":
                    var $517 = Bool$false;
                    var $516 = $517;
                    break;

                  case "Maybe.some":
                    var $518 = Bool$true;
                    var $516 = $518;
                    break;
                }
                ;
                var $514 = $516;
                break;
            }
            ;
            var $512 = $514;
            break;

          case "Maybe.none":
            var $519 = Bool$false;
            var $512 = $519;
            break;
        }
        return $512;
    }
    const App$Kaelin$Map$is_occupied = x0 => x1 => App$Kaelin$Map$is_occupied$(x0, x1);
    function App$Kaelin$Effect$map$set$(_new_map$1, _center$2, _target$3, _map$4) {
        var $520 = App$Kaelin$Effect$Result$new$(Unit$new, _new_map$1, List$nil, NatMap$new);
        return $520;
    }
    const App$Kaelin$Effect$map$set = x0 => x1 => x2 => x3 => App$Kaelin$Effect$map$set$(x0, x1, x2, x3);
    function App$Kaelin$Effect$indicators$add$(_indicators$1, _center$2, _target$3, _map$4) {
        var $521 = App$Kaelin$Effect$Result$new$(Unit$new, _map$4, List$nil, _indicators$1);
        return $521;
    }
    const App$Kaelin$Effect$indicators$add = x0 => x1 => x2 => x3 => App$Kaelin$Effect$indicators$add$(x0, x1, x2, x3);
    const App$Kaelin$Indicator$green = {
        _: "App.Kaelin.Indicator.green"
    };
    const App$Kaelin$Indicator$red = {
        _: "App.Kaelin.Indicator.red"
    };
    function App$Kaelin$Effect$hp$change_at$(_change$1, _pos$2) {
        var $522 = App$Kaelin$Effect$monad$(_m$bind$3 => _m$pure$4 => {
            var $523 = _m$bind$3;
            return $523;
        })(App$Kaelin$Effect$map$get)(_map$3 => {
            var $524 = App$Kaelin$Effect$monad$(_m$bind$4 => _m$pure$5 => {
                var $525 = _m$bind$4;
                return $525;
            })(App$Kaelin$Effect$coord$get_center)(_center_pos$4 => {
                var _key$5 = App$Kaelin$Coord$Convert$axial_to_nat$(_pos$2);
                var _res$6 = App$Kaelin$Map$creature$change_hp_at$(_change$1, _pos$2, _map$3);
                var self = _res$6;
                switch (self._) {
                  case "Pair.new":
                    var $527 = self.fst;
                    var $528 = $527;
                    var _dhp$7 = $528;
                    break;
                }
                var self = _res$6;
                switch (self._) {
                  case "Pair.new":
                    var $529 = self.snd;
                    var $530 = $529;
                    var _map$8 = $530;
                    break;
                }
                var _indicators$9 = NatMap$new;
                var _occupied$10 = App$Kaelin$Map$is_occupied$(_pos$2, _map$8);
                var self = _occupied$10;
                if (self) {
                    var $531 = App$Kaelin$Effect$monad$(_m$bind$11 => _m$pure$12 => {
                        var $532 = _m$bind$11;
                        return $532;
                    })(App$Kaelin$Effect$map$set(_map$8))(_$11 => {
                        var $533 = App$Kaelin$Effect$monad$(_m$bind$12 => _m$pure$13 => {
                            var $534 = _m$bind$12;
                            return $534;
                        })((() => {
                            var self = _dhp$7 > 0;
                            if (self) {
                                var $535 = App$Kaelin$Effect$indicators$add(NatMap$set$(_key$5, App$Kaelin$Indicator$green, _indicators$9));
                                return $535;
                            } else {
                                var self = _dhp$7 < 0;
                                if (self) {
                                    var $537 = App$Kaelin$Effect$indicators$add(NatMap$set$(_key$5, App$Kaelin$Indicator$red, _indicators$9));
                                    var $536 = $537;
                                } else {
                                    var $538 = App$Kaelin$Effect$monad$(_m$bind$12 => _m$pure$13 => {
                                        var $539 = _m$pure$13;
                                        return $539;
                                    })(Unit$new);
                                    var $536 = $538;
                                }
                                return $536;
                            }
                        })())(_$12 => {
                            var $540 = App$Kaelin$Effect$monad$(_m$bind$13 => _m$pure$14 => {
                                var $541 = _m$pure$14;
                                return $541;
                            })(_dhp$7);
                            return $540;
                        });
                        return $533;
                    });
                    var $526 = $531;
                } else {
                    var $542 = App$Kaelin$Effect$monad$(_m$bind$11 => _m$pure$12 => {
                        var $543 = _m$pure$12;
                        return $543;
                    })(0);
                    var $526 = $542;
                }
                return $526;
            });
            return $524;
        });
        return $522;
    }
    const App$Kaelin$Effect$hp$change_at = x0 => x1 => App$Kaelin$Effect$hp$change_at$(x0, x1);
    function App$Kaelin$Effect$hp$damage_at$(_dmg$1, _pos$2) {
        var $544 = App$Kaelin$Effect$hp$change_at$(-_dmg$1, _pos$2);
        return $544;
    }
    const App$Kaelin$Effect$hp$damage_at = x0 => x1 => App$Kaelin$Effect$hp$damage_at$(x0, x1);
    function App$Kaelin$Effect$hp$heal_at$(_dmg$1, _pos$2) {
        var $545 = App$Kaelin$Effect$hp$change_at$(-_dmg$1, _pos$2);
        return $545;
    }
    const App$Kaelin$Effect$hp$heal_at = x0 => x1 => App$Kaelin$Effect$hp$heal_at$(x0, x1);
    function App$Kaelin$Tile$creature$change_ap$(_change$1, _creature$2) {
        var self = _creature$2;
        switch (self._) {
          case "App.Kaelin.Creature.new":
            var $547 = self.hero;
            var $548 = self.hp;
            var $549 = self.ap;
            var self = $547;
            switch (self._) {
              case "App.Kaelin.Hero.new":
                var $551 = self.max_ap;
                var self = $548 <= 0;
                if (self) {
                    var $553 = _creature$2;
                    var $552 = $553;
                } else {
                    var self = _creature$2;
                    switch (self._) {
                      case "App.Kaelin.Creature.new":
                        var $555 = self.player;
                        var $556 = self.hero;
                        var $557 = self.team;
                        var $558 = self.hp;
                        var $559 = self.status;
                        var $560 = App$Kaelin$Creature$new$($555, $556, $557, $558, I32$min$($549 + _change$1 >> 0, $551), $559);
                        var $554 = $560;
                        break;
                    }
                    var $552 = $554;
                }
                ;
                var $550 = $552;
                break;
            }
            ;
            var $546 = $550;
            break;
        }
        return $546;
    }
    const App$Kaelin$Tile$creature$change_ap = x0 => x1 => App$Kaelin$Tile$creature$change_ap$(x0, x1);
    function App$Kaelin$Map$creature$change_ap_at$(_value$1, _pos$2, _map$3) {
        var _creature$4 = App$Kaelin$Map$creature$get$(_pos$2, _map$3);
        var self = _creature$4;
        switch (self._) {
          case "Maybe.some":
            var $562 = self.value;
            var self = $562;
            switch (self._) {
              case "App.Kaelin.Creature.new":
                var $564 = self.hero;
                var self = $564;
                switch (self._) {
                  case "App.Kaelin.Hero.new":
                    var $566 = self.max_ap;
                    var _new_ap$17 = I32$max$((() => {
                        var self = $562;
                        switch (self._) {
                          case "App.Kaelin.Creature.new":
                            var $568 = self.ap;
                            var $569 = $568;
                            return $569;
                        }
                    })() + _value$1 >> 0, 0);
                    var _new_ap$18 = I32$min$(_new_ap$17, $566);
                    var _ap_diff$19 = _new_ap$18 - (() => {
                        var self = $562;
                        switch (self._) {
                          case "App.Kaelin.Creature.new":
                            var $570 = self.ap;
                            var $571 = $570;
                            return $571;
                        }
                    })() >> 0;
                    var _map$20 = App$Kaelin$Map$creature$modify_at$(App$Kaelin$Tile$creature$change_ap(_ap_diff$19), _pos$2, _map$3);
                    var $567 = Pair$new$(_ap_diff$19, _map$20);
                    var $565 = $567;
                    break;
                }
                ;
                var $563 = $565;
                break;
            }
            ;
            var $561 = $563;
            break;

          case "Maybe.none":
            var $572 = Pair$new$(0, _map$3);
            var $561 = $572;
            break;
        }
        return $561;
    }
    const App$Kaelin$Map$creature$change_ap_at = x0 => x1 => x2 => App$Kaelin$Map$creature$change_ap_at$(x0, x1, x2);
    function App$Kaelin$Effect$ap$change_at$(_change$1, _pos$2) {
        var $573 = App$Kaelin$Effect$monad$(_m$bind$3 => _m$pure$4 => {
            var $574 = _m$bind$3;
            return $574;
        })(App$Kaelin$Effect$map$get)(_map$3 => {
            var $575 = App$Kaelin$Effect$monad$(_m$bind$4 => _m$pure$5 => {
                var $576 = _m$bind$4;
                return $576;
            })(App$Kaelin$Effect$coord$get_center)(_center_pos$4 => {
                var _key$5 = App$Kaelin$Coord$Convert$axial_to_nat$(_pos$2);
                var _res$6 = App$Kaelin$Map$creature$change_ap_at$(_change$1, _pos$2, _map$3);
                var self = _res$6;
                switch (self._) {
                  case "Pair.new":
                    var $578 = self.fst;
                    var $579 = $578;
                    var _apc$7 = $579;
                    break;
                }
                var self = _res$6;
                switch (self._) {
                  case "Pair.new":
                    var $580 = self.snd;
                    var $581 = $580;
                    var _map$8 = $581;
                    break;
                }
                var _indicators$9 = NatMap$new;
                var $577 = App$Kaelin$Effect$monad$(_m$bind$10 => _m$pure$11 => {
                    var $582 = _m$bind$10;
                    return $582;
                })(App$Kaelin$Effect$map$set(_map$8))(_$10 => {
                    var $583 = App$Kaelin$Effect$monad$(_m$bind$11 => _m$pure$12 => {
                        var $584 = _m$bind$11;
                        return $584;
                    })((() => {
                        var self = _apc$7 > 0;
                        if (self) {
                            var $585 = App$Kaelin$Effect$indicators$add(NatMap$set$(_key$5, App$Kaelin$Indicator$green, _indicators$9));
                            return $585;
                        } else {
                            var $586 = App$Kaelin$Effect$monad$(_m$bind$11 => _m$pure$12 => {
                                var $587 = _m$pure$12;
                                return $587;
                            })(Unit$new);
                            return $586;
                        }
                    })())(_$11 => {
                        var $588 = App$Kaelin$Effect$monad$(_m$bind$12 => _m$pure$13 => {
                            var $589 = _m$pure$13;
                            return $589;
                        })(_apc$7);
                        return $588;
                    });
                    return $583;
                });
                return $577;
            });
            return $575;
        });
        return $573;
    }
    const App$Kaelin$Effect$ap$change_at = x0 => x1 => App$Kaelin$Effect$ap$change_at$(x0, x1);
    function App$Kaelin$Effect$ap$cost$(_cost$1, _target$2) {
        var $590 = App$Kaelin$Effect$ap$change_at$(-_cost$1, _target$2);
        return $590;
    }
    const App$Kaelin$Effect$ap$cost = x0 => x1 => App$Kaelin$Effect$ap$cost$(x0, x1);
    function App$Kaelin$Skill$vampirism$(_cost$1, _dmg$2) {
        var $591 = App$Kaelin$Effect$monad$(_m$bind$3 => _m$pure$4 => {
            var $592 = _m$bind$3;
            return $592;
        })(App$Kaelin$Effect$coord$get_center)(_center_pos$3 => {
            var $593 = App$Kaelin$Effect$monad$(_m$bind$4 => _m$pure$5 => {
                var $594 = _m$bind$4;
                return $594;
            })(App$Kaelin$Effect$coord$get_target)(_target_pos$4 => {
                var $595 = App$Kaelin$Effect$monad$(_m$bind$5 => _m$pure$6 => {
                    var $596 = _m$bind$5;
                    return $596;
                })(App$Kaelin$Effect$map$get)(_map$5 => {
                    var _block$6 = App$Kaelin$Coord$eql$(_target_pos$4, _center_pos$3);
                    var self = _block$6;
                    if (self) {
                        var $598 = App$Kaelin$Effect$monad$(_m$bind$7 => _m$pure$8 => {
                            var $599 = _m$pure$8;
                            return $599;
                        })(Unit$new);
                        var $597 = $598;
                    } else {
                        var $600 = App$Kaelin$Effect$monad$(_m$bind$7 => _m$pure$8 => {
                            var $601 = _m$bind$7;
                            return $601;
                        })(App$Kaelin$Effect$hp$damage_at$(_dmg$2, _target_pos$4))(_dd$7 => {
                            var $602 = App$Kaelin$Effect$monad$(_m$bind$8 => _m$pure$9 => {
                                var $603 = _m$bind$8;
                                return $603;
                            })(App$Kaelin$Effect$hp$damage_at$(_dmg$2, _target_pos$4))(_$8 => {
                                var $604 = App$Kaelin$Effect$monad$(_m$bind$9 => _m$pure$10 => {
                                    var $605 = _m$bind$9;
                                    return $605;
                                })(App$Kaelin$Effect$hp$heal_at$(_dd$7, _center_pos$3))(_$9 => {
                                    var self = _dd$7 > 0;
                                    if (self) {
                                        var $607 = App$Kaelin$Effect$monad$(_m$bind$10 => _m$pure$11 => {
                                            var $608 = _m$bind$10;
                                            return $608;
                                        })(App$Kaelin$Effect$ap$cost$(_cost$1, _center_pos$3))(_$10 => {
                                            var $609 = App$Kaelin$Effect$monad$(_m$bind$11 => _m$pure$12 => {
                                                var $610 = _m$pure$12;
                                                return $610;
                                            })(Unit$new);
                                            return $609;
                                        });
                                        var $606 = $607;
                                    } else {
                                        var $611 = App$Kaelin$Effect$monad$(_m$bind$10 => _m$pure$11 => {
                                            var $612 = _m$pure$11;
                                            return $612;
                                        })(Unit$new);
                                        var $606 = $611;
                                    }
                                    return $606;
                                });
                                return $604;
                            });
                            return $602;
                        });
                        var $597 = $600;
                    }
                    return $597;
                });
                return $595;
            });
            return $593;
        });
        return $591;
    }
    const App$Kaelin$Skill$vampirism = x0 => x1 => App$Kaelin$Skill$vampirism$(x0, x1);
    const App$Kaelin$Heroes$Croni$skills$vampirism = App$Kaelin$Skill$new$("Vampirism", 3, App$Kaelin$Skill$vampirism$(2, 3), 81);
    function App$Kaelin$Coord$Cubic$new$(_x$1, _y$2, _z$3) {
        var $613 = {
            _: "App.Kaelin.Coord.Cubic.new",
            x: _x$1,
            y: _y$2,
            z: _z$3
        };
        return $613;
    }
    const App$Kaelin$Coord$Cubic$new = x0 => x1 => x2 => App$Kaelin$Coord$Cubic$new$(x0, x1, x2);
    function App$Kaelin$Coord$Convert$axial_to_cubic$(_coord$1) {
        var self = _coord$1;
        switch (self._) {
          case "App.Kaelin.Coord.new":
            var $615 = self.i;
            var $616 = self.j;
            var _x$4 = $615;
            var _z$5 = $616;
            var _y$6 = -_x$4 - _z$5 >> 0;
            var $617 = App$Kaelin$Coord$Cubic$new$(_x$4, _y$6, _z$5);
            var $614 = $617;
            break;
        }
        return $614;
    }
    const App$Kaelin$Coord$Convert$axial_to_cubic = x0 => App$Kaelin$Coord$Convert$axial_to_cubic$(x0);
    function List$map$(_f$3, _as$4) {
        var self = _as$4;
        switch (self._) {
          case "List.cons":
            var $619 = self.head;
            var $620 = self.tail;
            var $621 = List$cons$(_f$3($619), List$map$(_f$3, $620));
            var $618 = $621;
            break;

          case "List.nil":
            var $622 = List$nil;
            var $618 = $622;
            break;
        }
        return $618;
    }
    const List$map = x0 => x1 => List$map$(x0, x1);
    function App$Kaelin$Coord$Convert$cubic_to_axial$(_coord$1) {
        var self = _coord$1;
        switch (self._) {
          case "App.Kaelin.Coord.Cubic.new":
            var $624 = self.x;
            var $625 = self.z;
            var _i$5 = $624;
            var _j$6 = $625;
            var $626 = App$Kaelin$Coord$new$(_i$5, _j$6);
            var $623 = $626;
            break;
        }
        return $623;
    }
    const App$Kaelin$Coord$Convert$cubic_to_axial = x0 => App$Kaelin$Coord$Convert$cubic_to_axial$(x0);
    const U32$from_nat = a0 => Number(a0) >>> 0;
    const F64$to_i32 = a0 => a0 >> 0;
    function Word$to_f64$(_a$2) {
        var Word$to_f64$ = _a$2 => ({
            ctr: "TCO",
            arg: [ _a$2 ]
        });
        var Word$to_f64 = _a$2 => Word$to_f64$(_a$2);
        var arg = [ _a$2 ];
        while (true) {
            let [ _a$2 ] = arg;
            var R = Word$to_f64$(_a$2);
            if (R.ctr === "TCO") arg = R.arg; else return R;
        }
    }
    const Word$to_f64 = x0 => Word$to_f64$(x0);
    const U32$to_f64 = a0 => a0;
    function U32$to_i32$(_n$1) {
        var $627 = _n$1 >> 0;
        return $627;
    }
    const U32$to_i32 = x0 => U32$to_i32$(x0);
    function Word$shr$(_n$2, _value$3) {
        var _n_nat$4 = Word$to_nat$(_n$2);
        var $628 = Word$shift_right$(_n_nat$4, _value$3);
        return $628;
    }
    const Word$shr = x0 => x1 => Word$shr$(x0, x1);
    function Word$s_shr$(_n$2, _value$3) {
        var _neg$4 = Word$is_neg$(_n$2);
        var self = _neg$4;
        if (self) {
            var _n$5 = Word$neg$(_n$2);
            var $630 = Word$shl$(_n$5, _value$3);
            var $629 = $630;
        } else {
            var $631 = Word$shr$(_n$2, _value$3);
            var $629 = $631;
        }
        return $629;
    }
    const Word$s_shr = x0 => x1 => Word$s_shr$(x0, x1);
    const I32$shr = a0 => a1 => a0 >> a1;
    function Word$xor$(_a$2, _b$3) {
        var self = _a$2;
        switch (self._) {
          case "Word.o":
            var $633 = self.pred;
            var $634 = _b$6 => {
                var self = _b$6;
                switch (self._) {
                  case "Word.o":
                    var $636 = self.pred;
                    var $637 = _a$pred$9 => {
                        var $638 = Word$o$(Word$xor$(_a$pred$9, $636));
                        return $638;
                    };
                    var $635 = $637;
                    break;

                  case "Word.i":
                    var $639 = self.pred;
                    var $640 = _a$pred$9 => {
                        var $641 = Word$i$(Word$xor$(_a$pred$9, $639));
                        return $641;
                    };
                    var $635 = $640;
                    break;

                  case "Word.e":
                    var $642 = _a$pred$7 => {
                        var $643 = Word$e;
                        return $643;
                    };
                    var $635 = $642;
                    break;
                }
                var $635 = $635($633);
                return $635;
            };
            var $632 = $634;
            break;

          case "Word.i":
            var $644 = self.pred;
            var $645 = _b$6 => {
                var self = _b$6;
                switch (self._) {
                  case "Word.o":
                    var $647 = self.pred;
                    var $648 = _a$pred$9 => {
                        var $649 = Word$i$(Word$xor$(_a$pred$9, $647));
                        return $649;
                    };
                    var $646 = $648;
                    break;

                  case "Word.i":
                    var $650 = self.pred;
                    var $651 = _a$pred$9 => {
                        var $652 = Word$o$(Word$xor$(_a$pred$9, $650));
                        return $652;
                    };
                    var $646 = $651;
                    break;

                  case "Word.e":
                    var $653 = _a$pred$7 => {
                        var $654 = Word$e;
                        return $654;
                    };
                    var $646 = $653;
                    break;
                }
                var $646 = $646($644);
                return $646;
            };
            var $632 = $645;
            break;

          case "Word.e":
            var $655 = _b$4 => {
                var $656 = Word$e;
                return $656;
            };
            var $632 = $655;
            break;
        }
        var $632 = $632(_b$3);
        return $632;
    }
    const Word$xor = x0 => x1 => Word$xor$(x0, x1);
    const I32$xor = a0 => a1 => a0 ^ a1;
    function I32$abs$(_a$1) {
        var _mask$2 = _a$1 >> 31;
        var $657 = _mask$2 + _a$1 >> 0 ^ _mask$2;
        return $657;
    }
    const I32$abs = x0 => I32$abs$(x0);
    function App$Kaelin$Coord$Cubic$add$(_coord_a$1, _coord_b$2) {
        var self = _coord_a$1;
        switch (self._) {
          case "App.Kaelin.Coord.Cubic.new":
            var $659 = self.x;
            var $660 = self.y;
            var $661 = self.z;
            var self = _coord_b$2;
            switch (self._) {
              case "App.Kaelin.Coord.Cubic.new":
                var $663 = self.x;
                var $664 = self.y;
                var $665 = self.z;
                var _x$9 = $659 + $663 >> 0;
                var _y$10 = $660 + $664 >> 0;
                var _z$11 = $661 + $665 >> 0;
                var $666 = App$Kaelin$Coord$Cubic$new$(_x$9, _y$10, _z$11);
                var $662 = $666;
                break;
            }
            ;
            var $658 = $662;
            break;
        }
        return $658;
    }
    const App$Kaelin$Coord$Cubic$add = x0 => x1 => App$Kaelin$Coord$Cubic$add$(x0, x1);
    function App$Kaelin$Coord$Cubic$range$(_coord$1, _distance$2) {
        var _distance_32$3 = I32$to_u32$(_distance$2);
        var _double_distance$4 = (_distance_32$3 * 2 >>> 0) + 1 >>> 0;
        var _result$5 = List$nil;
        var _result$6 = (() => {
            var $668 = _result$5;
            var $669 = 0;
            var $670 = _double_distance$4;
            let _result$7 = $668;
            for (let _actual_distance$6 = $669; _actual_distance$6 < $670; ++_actual_distance$6) {
                var _negative_distance$8 = -_distance$2;
                var _positive_distance$9 = _distance$2;
                var _actual_distance$10 = U32$to_i32$(_actual_distance$6);
                var _x$11 = _actual_distance$10 - _positive_distance$9 >> 0;
                var _max$12 = I32$max$(_negative_distance$8, -_x$11 + _negative_distance$8 >> 0);
                var _min$13 = I32$min$(_positive_distance$9, -_x$11 + _positive_distance$9 >> 0);
                var _distance_between_max_min$14 = 1 + I32$to_u32$(I32$abs$(_max$12 - _min$13 >> 0)) >>> 0;
                var _result$15 = (() => {
                    var $671 = _result$7;
                    var $672 = 0;
                    var $673 = _distance_between_max_min$14;
                    let _result$16 = $671;
                    for (let _range$15 = $672; _range$15 < $673; ++_range$15) {
                        var _y$17 = U32$to_i32$(_range$15) + _max$12 >> 0;
                        var _z$18 = -_x$11 - _y$17 >> 0;
                        var _new_coord$19 = App$Kaelin$Coord$Cubic$add$(_coord$1, App$Kaelin$Coord$Cubic$new$(_x$11, _y$17, _z$18));
                        var $671 = List$cons$(_new_coord$19, _result$16);
                        _result$16 = $671;
                    }
                    return _result$16;
                })();
                var $668 = _result$15;
                _result$7 = $668;
            }
            return _result$7;
        })();
        var $667 = _result$6;
        return $667;
    }
    const App$Kaelin$Coord$Cubic$range = x0 => x1 => App$Kaelin$Coord$Cubic$range$(x0, x1);
    function Word$lte$(_a$2, _b$3) {
        var $674 = Cmp$as_lte$(Word$cmp$(_a$2, _b$3));
        return $674;
    }
    const Word$lte = x0 => x1 => Word$lte$(x0, x1);
    const U32$lte = a0 => a1 => a0 <= a1;
    function App$Kaelin$Coord$fit$(_coord$1, _map_size$2) {
        var _coord$3 = App$Kaelin$Coord$Convert$axial_to_cubic$(_coord$1);
        var self = _coord$3;
        switch (self._) {
          case "App.Kaelin.Coord.Cubic.new":
            var $676 = self.x;
            var $677 = self.y;
            var $678 = self.z;
            var _x$7 = I32$abs$($676);
            var _y$8 = I32$abs$($677);
            var _z$9 = I32$abs$($678);
            var _greater$10 = I32$max$(_x$7, I32$max$(_y$8, _z$9));
            var _greater$11 = I32$to_u32$(_greater$10);
            var $679 = _greater$11 <= _map_size$2;
            var $675 = $679;
            break;
        }
        return $675;
    }
    const App$Kaelin$Coord$fit = x0 => x1 => App$Kaelin$Coord$fit$(x0, x1);
    const App$Kaelin$Constants$map_size = 4;
    function List$filter$(_f$2, _xs$3) {
        var self = _xs$3;
        switch (self._) {
          case "List.cons":
            var $681 = self.head;
            var $682 = self.tail;
            var self = _f$2($681);
            if (self) {
                var $684 = List$cons$($681, List$filter$(_f$2, $682));
                var $683 = $684;
            } else {
                var $685 = List$filter$(_f$2, $682);
                var $683 = $685;
            }
            ;
            var $680 = $683;
            break;

          case "List.nil":
            var $686 = List$nil;
            var $680 = $686;
            break;
        }
        return $680;
    }
    const List$filter = x0 => x1 => List$filter$(x0, x1);
    function App$Kaelin$Coord$range$(_coord$1, _distance$2) {
        var _center$3 = App$Kaelin$Coord$Convert$axial_to_cubic$(_coord$1);
        var _list_coords$4 = List$map$(App$Kaelin$Coord$Convert$cubic_to_axial, App$Kaelin$Coord$Cubic$range$(_center$3, _distance$2));
        var _fit$5 = _x$5 => {
            var $688 = App$Kaelin$Coord$fit$(_x$5, App$Kaelin$Constants$map_size);
            return $688;
        };
        var $687 = List$filter$(_fit$5, _list_coords$4);
        return $687;
    }
    const App$Kaelin$Coord$range = x0 => x1 => App$Kaelin$Coord$range$(x0, x1);
    function List$fold$(_list$2, _nil$4, _cons$5) {
        var self = _list$2;
        switch (self._) {
          case "List.cons":
            var $690 = self.head;
            var $691 = self.tail;
            var $692 = _cons$5($690)(List$fold$($691, _nil$4, _cons$5));
            var $689 = $692;
            break;

          case "List.nil":
            var $693 = _nil$4;
            var $689 = $693;
            break;
        }
        return $689;
    }
    const List$fold = x0 => x1 => x2 => List$fold$(x0, x1, x2);
    function List$foldr$(_b$3, _f$4, _xs$5) {
        var $694 = List$fold$(_xs$5, _b$3, _f$4);
        return $694;
    }
    const List$foldr = x0 => x1 => x2 => List$foldr$(x0, x1, x2);
    function App$Kaelin$Map$set$(_coord$1, _tile$2, _map$3) {
        var _key$4 = App$Kaelin$Coord$Convert$axial_to_nat$(_coord$1);
        var $695 = NatMap$set$(_key$4, _tile$2, _map$3);
        return $695;
    }
    const App$Kaelin$Map$set = x0 => x1 => x2 => App$Kaelin$Map$set$(x0, x1, x2);
    function App$Kaelin$Map$push$(_coord$1, _entity$2, _map$3) {
        var _tile$4 = App$Kaelin$Map$get$(_coord$1, _map$3);
        var self = _tile$4;
        switch (self._) {
          case "Maybe.some":
            var $697 = self.value;
            var self = $697;
            switch (self._) {
              case "App.Kaelin.Tile.new":
                var self = _entity$2;
                switch (self._) {
                  case "App.Kaelin.Map.Entity.animation":
                    var $700 = self.value;
                    var self = $697;
                    switch (self._) {
                      case "App.Kaelin.Tile.new":
                        var $702 = self.background;
                        var $703 = self.creature;
                        var $704 = App$Kaelin$Tile$new$($702, $703, Maybe$some$($700));
                        var _animation_tile$10 = $704;
                        break;
                    }
                    ;
                    var $701 = App$Kaelin$Map$set$(_coord$1, _animation_tile$10, _map$3);
                    var $699 = $701;
                    break;

                  case "App.Kaelin.Map.Entity.background":
                    var $705 = self.value;
                    var self = $697;
                    switch (self._) {
                      case "App.Kaelin.Tile.new":
                        var $707 = self.creature;
                        var $708 = self.animation;
                        var $709 = App$Kaelin$Tile$new$($705, $707, $708);
                        var _background_tile$10 = $709;
                        break;
                    }
                    ;
                    var $706 = App$Kaelin$Map$set$(_coord$1, _background_tile$10, _map$3);
                    var $699 = $706;
                    break;

                  case "App.Kaelin.Map.Entity.creature":
                    var $710 = self.value;
                    var self = $697;
                    switch (self._) {
                      case "App.Kaelin.Tile.new":
                        var $712 = self.background;
                        var $713 = self.animation;
                        var $714 = App$Kaelin$Tile$new$($712, Maybe$some$($710), $713);
                        var _creature_tile$10 = $714;
                        break;
                    }
                    ;
                    var $711 = App$Kaelin$Map$set$(_coord$1, _creature_tile$10, _map$3);
                    var $699 = $711;
                    break;
                }
                ;
                var $698 = $699;
                break;
            }
            ;
            var $696 = $698;
            break;

          case "Maybe.none":
            var self = _entity$2;
            switch (self._) {
              case "App.Kaelin.Map.Entity.background":
                var $716 = self.value;
                var _new_tile$6 = App$Kaelin$Tile$new$($716, Maybe$none, Maybe$none);
                var $717 = App$Kaelin$Map$set$(_coord$1, _new_tile$6, _map$3);
                var $715 = $717;
                break;

              case "App.Kaelin.Map.Entity.animation":
              case "App.Kaelin.Map.Entity.creature":
                var $718 = _map$3;
                var $715 = $718;
                break;
            }
            ;
            var $696 = $715;
            break;
        }
        return $696;
    }
    const App$Kaelin$Map$push = x0 => x1 => x2 => App$Kaelin$Map$push$(x0, x1, x2);
    function App$Kaelin$Map$Entity$animation$(_value$1) {
        var $719 = {
            _: "App.Kaelin.Map.Entity.animation",
            value: _value$1
        };
        return $719;
    }
    const App$Kaelin$Map$Entity$animation = x0 => App$Kaelin$Map$Entity$animation$(x0);
    function App$Kaelin$Animation$new$(_fps$1, _sprite$2) {
        var $720 = {
            _: "App.Kaelin.Animation.new",
            fps: _fps$1,
            sprite: _sprite$2
        };
        return $720;
    }
    const App$Kaelin$Animation$new = x0 => x1 => App$Kaelin$Animation$new$(x0, x1);
    function App$Kaelin$Sprite$new$(_frame_info$1, _voxboxes$2) {
        var $721 = {
            _: "App.Kaelin.Sprite.new",
            frame_info: _frame_info$1,
            voxboxes: _voxboxes$2
        };
        return $721;
    }
    const App$Kaelin$Sprite$new = x0 => x1 => App$Kaelin$Sprite$new$(x0, x1);
    const App$Kaelin$Assets$effects$fire_1 = VoxBox$parse$("100002b35229100102b95425110102b55328120102be5b2a0f0202b35229100202b55328110202c65b24120202d76c2b0f0302b35229100302c15923110302d66328120302bd64361303029b7256140302b1552f0f0402b15931100402c6632e110402bd6335130402a96342140402b85629150402ba55250e05029d74640f05029e7361100502b45d32110502bc5725120502b36036130502c25a22140502e071290d06029f73620e06029e6f5b0f0602af6243100602b45228110602cf6023120602d96829130602c8642d0d0702b862350e0702d165250f0702bc582a110702b55329120702d1612a130702ca642c160702997c6b0c0802c8642c0d0802d566290e0802ce5f2a0f0802a86f66100802a5736d120802bf5b2a130802b4572f1408029a7b611508029b7968160802997c6b0c0902be5c2b0d0902cd602a0e0902ba5528110902ab6640120902a17458130902aa846c140902a36d50150902b8572c160902ba55250c0a02b352290d0a02b452280e0a02c5581a0f0a02c74e14110a02aa6a3d120a02b16742130a02a47256140a02c35c29150a02e2722a160a02b452280d0b02c5571f0e0b02e58d220f0b02db6718100b02c54c13110b02c7531a120b02cd6227130b02aa6946140b02c65b27150b02d76327160b02b654290c0c02b9633d0d0c02db6d1f0e0c02f7a8280f0c02d2671d100c02cf4f16110c02cd5417120c02ee8b26130c02a76544140c02b55229150c02ce6024160c02b754280a0d02a4746c0b0d029f776c0c0d02bb6a420d0d02f7a9280e0d02eb811a0f0d02c5561f100d02de5717110d02e5661a120d02d98235130d029f7763150d02b35229160d02b35229090e029980600a0e02a079670b0e029c7d5f0c0e02de63200d0e02f9ae2d0e0e02e15e190f0e02de5417100e02e7721a110e02ed771c120e02f39a28130e02e26118090f029980600a0f02a178640b0f02a968500c0f02d9622b0d0f02f2a0210e0f02f391230f0f02ea721d100f02f6ad2d110f02e07921120f02f0911a130f02f29f20140f02e05e170910029f7a670a10029d7c5d0b1002b25c350c1002c6844b0d1002dd631f0e1002f8af270f1002fbad31101002f09624111002df5e1a121002ed781c131002f8b128141002e1621b1510029d7d5d161002998060091102a5736d0a1102a671690b1102d6712a0c1102e17e250d1102b963440e1102f3a8320f1102fccd40101102edb247111102e58432121102f5ad3b131102f6af2c141102cd6938151102c45721161102c54f1b0a1202a76f670b1202cd5e2b0c1202f9ad320d1202e495360e1202fac13f0f1202fcc74a101202f8ac4a111202f7c34b121202f6a13a131202f08a21141202e16d1f151202ef9321161202c950140a13029b63460b1302ba5a310c1302e9a1370d1302f3a13e0e1302efae500f1302f7a853101302fbd37b111302fbca5e121302f6aa48131302ed751b141302f8941e151302f9a329161302ce58150714029d75650814029d75650a1402aa63500b1402c371340c1402d47c370d1402f9b85a0e1402e99f680f1402ea9f65101402fcd68f111402fccb7e121402fda342131402f4862d141402f5a220151402e57319161402a6682b171402ae68290715029d75650a1502b5672a0b1502c570270c1502ec7f250d1502f2a03f0e1502eca6780f1502f9d8aa101502fbe2c1111502fceaba121502fcd185131502fbae4f141502fba22d151502f47f1f161502c16f20171502b56727081602a175450916029a70450a1602a666360b1602c166200c1602f6972c0d1602f9ad520e1602f5b1840f1602fae1c5101602fcf3e5111602fbf1d6121602fde2b3131602fda764141602f8ab4a151602f6982c161602c1651f171602a85f26081702a1764e0917029f72530a1702a467540b1702c85f320c1702f68e3d0d1702f8c7610e1702f9c48f0f1702f9e8d4101702fdf8f2111702fcf3df121702fde5bf131702f8b076141702f8c661151702f68e3d161702d1581d171702b66323181702a0692c0818029b7256091802a374530a1802a46b4d0b1802ad6b510c1802dc6b340d1802eea1530e1802f3b7850f1802f5ddb9101802fbe9d3111802fbeecc121802fbdab1131802ecb069141802eda74f151802df6b2c161802b45f1e171802ad66261818029b73140919028055260a19028656320b19027e5a370c19029774450d19029f755c0e1902bc927a0f1902c39f7f101902dbb598111902f7ca89121902d2a876131902daa861141902ae874b151902874929161902a95920171902ae6f161819029b7410091a027952230a1a028e642b0b1a025a4d360c1a02785d350d1a025e59400e1a028a71540f1a02927451101a02ad9671111a02a28263121a029e8858131a026b5444141a0286744a151a02886434161a028c6217171a02a672110a1b027c51290b1b0267462e0c1b02623f1f0d1b02794f280e1b025b56310f1b027e6a4a101b027a6f52111b02746240121b0281724c131b026b5533141b02895b2c151b02784d21161b02694e130a1c028350300b1c0264442e0c1c028d491a0d1c027340200e1c028357290f1c02706144101c028f5f2a111c026a4a27121c02926d36131c026f4d28141c0284551b151c028a571b161c026f4f190d1d02824c1c0e1d02895a1d0f1d02916f35101d028b5521111d02523823121d029b6f2d");
    const App$Kaelin$Assets$effects$fire_2 = VoxBox$parse$("0f0002b352290e0102b352290f0102c05823100102d15d1e0f0202ba5626100202be5f2d110202ae60390d0302b65e350e0302db541b0f0302ae5f38100302ae5f380c0402de53170d0402de55190e0402d7561b110402a16f51120402b3552e0c0502e25d180d0502f0851a0e0502c85a1a1005029b7256110502bc6f44120502c45e271405029a7b6b1505029a7b6b0b0602e059180c0602f391230d0602f296210e0602cc54141006029b7256110602ab6443120602b55429140602a4746d150602c46650160602de54180b0702e05e170c0702f7a8210d0702ea731a0e0702dc5217150702d56021160702de621a170702bf57210b0802e05c170c0802f398210d0802e375190e0802dd53170f0802c54c13100802c54c13150802e76c29160802ca5e25170802b452290b0902de53170c0902e9791c0d0902ec8e2a0e0902df55170f0902d65116100902d35115110902c94e14140902dc6627150902d96529160902b553290c0a02de53170d0a02de53170e0a02de53170f0a02de5317100a02e86b1a110a02db6317120a02c54c13140a02bf5827150a02b56045160a02b8562a0a0b029980600e0b02e35e220f0b02e2601d100b02f49b28110b02e2741b120b02c54c13130b02de5317140b02cf5624150b029e7565160b029d75650a0c029a7f610b0c02a4746c0e0c02e05e170f0c02f19e20100c02f1921a110c02cf5915120c02de5517130c02e86b19140c02e05918090d02a5736d0a0d02ab6e650b0d02da56250d0d02df56170e0d02ea731b0f0d02f8b026100d02ec751a110d02e25c18120d02ec821a130d02f7a320140d02e05e17150d02de5317160d02de5317090e02c7501e0a0e02d55e250b0e02e66d1f0c0e02b067400d0e02e15d180e0e02f49e220f0e02f79c20100e02e86a1a110e02f28b1c120e02f9b226130e02f38c1c140e02df631a150e02d25920160e02d55d23080f02c54c13090f02d256190a0f02f9811e0b0f02fabb3c0c0f02f490210d0f02ed831d0e0f02fabf3c0f0f02ed7c20100f02f7a11a110f02f8b327120f02faae28130f02ec741b140f02d3591b150f02e16d1f160f02be5c29081002c54c13091002c84e150a1002ea962b0b1002f4a2300c1002d563210d1002ee8f240e1002f9b63a0f1002ec8c19101002fab72b111002ed8619121002f8aa2a131002dc7423141002d55d1a151002eb9a2b161002ba5f2a091102ab56390a1102d98e330b1102f09c250c1102bc6c3d0d1102ed96290e1102faa8280f1102f89e21101102f39921111102ee8025121102f6b236131102bd6128141102e97a1f151102f8aa29161102d17625171102b35229091202e0601e0a1202ea94350b1202f7ba380c1202f797260d1202dc7a2f0e1202ef9d400f1202fbce59101202ec8331111202e67d29121202f69d2b131202c35a26141202f18321151202f18f1f161202c75924171202b35229091302cd5f280a1302d9772e0b1302f4af370c1302fbb6330d1302f496290e1302ea85250f1302f4aa4b101302f8a442111302ed902b121302df6f1f131302e17621141302e98323151302ce5921161302b452290614029d75650714029d7565091402ba5b1e0a1402c561250b1402e98e260c1402ef9d400d1402fbbe5b0e1402fc9f3a0f1402f49642101402fcd9b8111402f99440121402f18426131402f69335141402f1811e151402dd5819161402a966290715029d7565091502bf601e0a1502df62180b1502f4881c0c1502ee97310d1502f4ab560e1502fdbd6e0f1502fbd09d101502fbcc9d111502fbbf78121502feb45b131502fca440141502f58723151502eb7217161502ce5b1b171502bc611e0816029b7145091602bd6a210a1602e37f200b1602fda5410c1602fba64f0d1602f4ab720e1602f7c6a40f1602fcebd4101602fce7d0111602fce5bd121602fec48a131602f99c45141602f78f2b151602faa43c161602c6631d171602bd6c1f071702a1764e081702a1754e091702b365400a1702d95d200b1702f599360c1702f9c9660d1702fbb2760e1702f6d2b50f1702fcf0e2101702fcf6ea111702fcf1d8121702fac692131702fabc6b141702fabb55151702e97724161702c75a1b171702a5682a0818029d7255091802a772510a1802ae66410b1802de77320c1802eca8500d1802ebaf6a0e1802f9cfa00f1802f6e3ca101802fbedd4111802fae9c6121802f6c085131802e7af5f141802ee9641151802c86221161802ad6022171802a66a210819027d5425091902895a2b0a19027c54370b190283613b0c1902a67c490d1902a881720e1902c69b820f1902c8ac8c101902f0c490111902e3b982121902dda467131902c39e5a1419028d663c1519029c4f26161902b76a18171902a070111819029a7510081a02795122091a027e56280a1a027f5e310b1a02755d350c1a02594d370d1a028773480e1a026c5c550f1a02bc9e68101a029d7865111a02ab9464121a026f6045131a0276604f141a02927739151a02835f29161a029e6911171a029c7510091b027d542c0a1b02764f270b1b025f3d2c0c1b026947220d1b0274522b0e1b0255533a0f1b02937e52101b0265614a111b027e6844121b02786c45131b0276512f141b02895b24151b026f4b1b161b02684f110a1c02774d2a0b1c027341290c1c0285431d0d1c027245220e1c02805e310f1c027e6142101c02855c26111c027e5a2a121c027e6139131c0282541d141c028a5219151c02815d1c0d1d0284511c0e1d028e65290f1d028b693c101d02754720111d02684823121d02b58435");
    const App$Kaelin$Assets$effects$fire_3 = VoxBox$parse$("0c0002c54c130b0102c64c130c0102c74c130d0102c64c13100102c54c130b0202dd53170c0202e362190d0202d556160e0202c54c130f0202c74d13100202c64c13140202c54c13150202c54c130b0302de53170c0302ee7a1d0d0302e382200e0302cb4f140f0302e06218100302de5617140302bc4f20150302c64f160b0402dd53170c0402ec83220d0402d3681e0e0402c953150f0402f28d23100402e2641a140402b85529150402dc6424160402c84f150b0502c157200c0502ca571e0d0502c2561f0e0502c0521f0f0502ed8c23100502f28a1c110502e26517140502b65429150502d26923160502c0531f0b0602c057200c0602c057200e0602ba54240f0602cb5820100602f38f23110602ec8f21120602de5317130602de5317140602cb5321150602bf5721160602b452280e0702de53170f0702d25a18100702f29025110702ec932c120702de5317130702dc5418140702c75623150702b55228180702c057200a0802c54c130d0802bd58270e0802e566190f0802d95a1b100802ee9a29110802f1911a120802e05818130802c75e1f140802ed8d1b150802bd5b27180802c5581a190802c74e140a0902c64c130b0902c74d130d0902bb5e270e0902f5a4200f0902ec7617100902ec7e19110902e6701b120902de5317130902c25f25140902f7a828150902e5691a160902dd5317170902c5571f180902e58d22190902db67181a0902c54c130a0a02df59180b0a02e066190c0a02d878290d0a02dc6b210e0a02f8b82f0f0a02ef8e2a100a02f68e1c110a02e05918120a02de5317130a02e77e19140a02ec8f20150a02de5417160a02ca571e170a02db6d1f180a02f7a828190a02d2671d1a0a02bd4f1f090b02dc53180a0b02ec761e0b0b02fab4390c0b02ea721d0d0b02e05a190e0b02f3871d0f0b02f7b132100b02f9a12b110b02e15918120b02de5317130b02ed8d20140b02f17e1c150b02de5317160b02c76121170b02f7a928180b02eb811a190b02c4561f080c02de5317090c02db53190a0c02d05b220b0c02ef9b330c0c02f9b4390d0c02e15e190e0c02e25d180f0c02f39124100c02fbb02f110c02e96e1b120c02de5317130c02e86a19140c02e15d18160c02e0621b170c02f9ae2d180c02e15e19190c02de5317080d02de5317090d02df55170a0d02f19a2b0b0d02cf77250c0d02ed991c0d0d02e05f170e0d02cf4f150f0d02d95f13100d02faaf2a110d02f2951f120d02e05d17130d02cb5815140d02d05115150d02d35015160d02e05e17170d02f2a021180d02f39123190d02e05918090e02cb4f150a0e02e3701b0b0e02f3a4240c0e02f2a4270d0e02e05d170e0e02df57180f0e02f39e2c100e02fcc93d110e02f8a324120e02d95e17130e02e68d21140e02ec751b150e02de5317160e02de5317170e02e16217180e02f09c20190e02e0611a090f02df5c210a0f02e86d1b0b0f02fab5360c0f02ee932a0d0f02de53170e0f02e6752e0f0f02fac13f100f02f49826110f02faa328120f02f39822130f02f7a421140f02e96e19150f02df5517160f02df5517170f02dc5419180f02c05c26091002c84e150a1002d5601b0b1002fab9380c1002e987200d1002d8581b0e1002ed78190f1002fbb435101002e86c18111002ee8123121002f59f23131002f8921d141002e05918151002e96f1a161002eb7b19171002de53170a1102e46a130b1102f9a6250c1102eea32b0d1102d66c1b0e1102df59180f1102f58522101102ef852d111102f48c2f121102f49a2c131102ee781d141102f39024151102f9aa28161102ed761b171102de53170a1202e465100b1202ef9d330c1202f7ba380d1202f897240e1202d86c2b0f1202f38321101202ef7b32111202fab58d121202ef8832131202fbb12f141202f9b227151202f38c1c161202e05d180a1302c866350b1302c962300c1302eca4330d1302fbb6330e1302f999290f1302faa536101302f0a678111302fac194121302ef9a44131302f8a827141302e66c1a151302c75c1e161302d250150714029d75650814029d75650a1402c0673e0b1402ca5c350c1402e05f190d1402f49d3b0e1402fbbe5b0f1402fcb05b101402fccab1111402fbd9a5121402f0842b131402f8a624141402eb7c23151402e05c18161402de5519171402c2683d0815029d7565091502bc611e0a1502c8621f0b1502ea791f0c1502f98e240d1502f290300e1502f4ab560f1502fdba6b101502fbbf9a111502fcecdc121502fbc27e131502fdb755141502f59739151502f98e24161502eb791d171502c8621f181502bc611e0916029c6f430a1602b15e250b1602df73200c1602fbbb4e0d1602fa973b0e1602f4a9740f1602f7c5a2101602fce1c0111602fceddf121602fce6bd131602fec48a141602fa983d151602fbbb4e161602df7320171602b25d24181602a75f26081702a1764e091702a1754e0a1702b45f400b1702db5f230c1702faa5400d1702fbb4520e1702fabc840f1702f6d3b6101702fcf0e2111702fcf6ea121702fcf1d8131702fbc590141702fbad4e151702faa540161702de6122171702c6591b181702a5682a0918029d72550a1802a772510b1802b565460c1802db78320d1802f8bb580e1802f4b7740f1802f9cfa1101802f6e3ca111802fbedd4121802fae9c6131802fbbf7f141802e7a349151802e88339161802c86121171802ad6022181802a66a210919027d54250a1902895a2b0b19027c54370c190284603a0d1902b879420e1902a880720f1902c59a82101902c8ac8c111902f0c490121902e3b982131902dda467141902c39e5a1519028d663c1619029c4f26171902b76a18181902a070111919029a7510091a027951220a1a027e56280b1a027f5e310c1a02755d350d1a02594d370e1a028773480f1a026c5c55101a02bc9e68111a029d7865121a02ab9464131a026f6045141a0276604f151a02927739161a02835f29171a029e6911181a029c75100a1b027d542c0b1b02764f270c1b025f3d2c0d1b026947220e1b0274522b0f1b0255533a101b02937e52111b0265614a121b027e6844131b02786c45141b0276512f151b02895b24161b026f4b1b171b02684f110b1c02774d2a0c1c027341290d1c0285431d0e1c027245220f1c02805e31101c027e6142111c02855c26121c027e5a2a131c027e6139141c0282541d151c028a5219161c02815d1c0e1d0284511c0f1d028e6529101d028b693c111d02754720121d02684823131d02b58435");
    const App$Kaelin$Assets$effects$fire_4 = VoxBox$parse$("0b0102c54c130c0102c54c13100102b55228110102b55228120102b35229140102c74d13150102c74d130a0202c74d130b0202c54c130c0202c74d130d0202c54c130f0202b75228100202c85a25110202db651f120202ca5321130202c74d13140202df6218150202de5617090302d250150a0302df62180b0302e96b1a0c0302d2531e0d0302b552280f0302dc5318100302ec8f29110302ed9129120302df5617130302c85014140302e66819150302df5617160302c54c13170302d35315180302df55170a0402e25d180b0402eb6f1a0c0402e3621a0d0402c856230e0402b552280f0402cb5321100402dd681e110402f6971c120402e36817130402c54c13140402d14f15160402c54c13170402e06919180402ed8b22190402e260180b0502de53170c0502e15e180d0502ef861c0e0502c857230f0502ba5227100502bd5326110502de6f20120502ef8d19130502e05d17170502df5a17180502f59e27190502ec801a1a0502de53170a0602de53170b0602df59170c0602e8821b0d0602f8be330e0602ec761d0f0602dd5318100602de5317110602b95528120602dd6b1f130602df5617160602de5317170602d95716180602f49a22190602e9781a1a0602de53170a0702de53170b0702e9731c0c0702f8ba350d0702f6a2280e0702e96c1a0f0702cf4f15100702d75116110702de5317120702dd5317130702dc5217160702de5317170702e5671b180702ed952a190702e05c180a0802e05c170b0802f7af2b0c0802fab9350d0802ea711c0e0802df56170f0802c95014100802e36219110802dd5317120802c74d13130802c64c13160802de5317170802de5317180802de53170a0902e05d170b0902f8b52f0c0902f08b1b0d0902cf51130e0902de53170f0902cf4f15100902dd5717110902c74d13120902df6218130902de56170a0a02df58170b0a02ea7b1b0c0a02f8b02f0d0a02e5691b0e0a02de53170f0a02db5216110a02ca5314120a02f28c23130a02e2641a0b0b02df58170c0b02e1621b0d0b02df57180e0b02dd53170f0b02c54c13110b02c0521f120b02ed8d22130b02f1921a140b02e265170e0c02cc4e140f0c02c54c13110c02ba5424120c02cb5c20130c02f7a621140c02ec9021150c02dd5317160c02c057200d0d02b352290e0d02bf4e1d0f0d02c54c13100d02c54c13120d02bc5828130d02f7a025140d02ec942b150d02c5561e160d02c057200c0e02cb53210d0e02c656230e0e02ca53210f0e02c54c13100e02c54c13120e02de5918130e02f89f22140e02eb8919150e02c84d14160e02c74d130b0f02cc58210c0f02e3701b0d0f02ef9a200e0f02e05e170f0f02d35015100f02cf4f15110f02df5817120f02e26a1a130f02f89d22140f02e16d19150f02de5617160f02e06218170f02cf51150b1002cf5c200c1002f8b2350d1002ef992a0e1002e25c160f1002e66414101002e46218111002f3821e121002f9aa27131002eb8a1e141002b85528151002e6681a161002f28d23171002ca58160b1102e15f190c1102fab9390d1102eb8b260e1102f8830b0f1102f28e12101102e4681e111102f8b127121102f7a31a131102ee7a20141102b9541f151102e05e19161102ec8a22171102c0531f0b1202e368180c1202faae2a0d1202e98f240e1202ee7b120f1202f9a41d101202ee7819111202fab632121202f89d1e131202f38b20141202c2541a151202c3571f161202cb571d171202ba54240a1302a163430b1302e467120c1302f9a6240d1302f2b5330e1302e36d180f1302f9b468101302f8a837111302f5a738121302fab145131302f8911c141302df5918151302c5561f161302c3571f0714029d75650a1402a85f450b1402e466190c1402eb821e0d1402f8b8380e1402ec90270f1402f7992e101402f9ca93111402f48f2f121402fcb043131402f8a726141402e96c1a151402e76615161402d25a1d0715029d75650815029d7565091502a76f2d0a1502c764240b1502fa9f230c1502e96f160d1502f2a3360e1502fab1510f1502ee7a17101502f8c793111502fbbe81121502f6963b131502fdaa4b141502eb731e151502fa9f23161502c86523171502ab6d2c0916029f67330a1602cf5a160b1602faac680c1602f6923a0d1602f091460e1602f4af760f1602fabc8e101602fcd4a5111602fcf0da121602fec77b131602fca95c141602f6933b151602faad68161602c86e1c171602ac6328081702a578460917029b70470a1702b960390b1702f4a03b0c1702fbca7e0d1702ef85460e1702f6bd8e0f1702fae6cd101702fbe9d8111702fcf4e6121702fde2ba131702fda262141702fbca7e151702f49236161702c2561c171702bc5b1b0818029c7355091802a1765a0a1802a96b540b1802f186260c1802fac05c0d1802f9bf5f0e1802facfa40f1802fae8d2101802fdf4e8111802fbf1d6121802fde4bb131802f99f50141802fabd5a151802f38320161802ca5d1e171802b26628181802a0692c091902a36d410a19029d65400b1902b26b480c1902bd82460d1902d5a2600e1902e9be900f1902e0c59e101902f2d5b9111902fae2ac121902eec497131902dea75c141902c98745151902c45b29161902b95d1e171902af6a1d1819029b7410091a027a52230a1a027553290b1a025c4c2e0c1a028770460d1a027f67500e1a02a585610f1a02ac8464101a02c39f7f111a02dda871121a02b39261131a02b68f5b141a02a69154151a025f4a33161a02865b1e171a02a77111181a029a7410091b027b552a0a1b029365290b1b026349330c1b027854240d1b027b5c380e1b0258593c0f1b027e6d4c101b02928565111b026c6357121b02968258131b025c4f36141b027f5d34151b02936326161b028b61120a1c0281502f0b1c0265442e0c1c02703f1e0d1c02623b220e1c02694c2b0f1c02796647101c02816436111c02816331121c027b663e131c026f4c2c141c02805026151c027b4e1f161c025c3e150c1d02934c190d1d027f4a1d0e1d028f5e240f1d027e673f101d028c5722111d02563b23121d029a6f2e131d0289622c141d02855618151d028d591a0e1e0286591b0f1e02967131");
    const App$Kaelin$Assets$effects$fire_5 = VoxBox$parse$("0c0002c465500d0002a6736d100002b35229110002b955270b0102d2571c0c0102df5c1c0d0102ce6544100102b75427110102d0601a120102b560350b0202c058240c0202e56b1d0d0202d46123110202b35a31120202af5f38140202db541b150202b65e350b0302b452290c0302d161290d0302e36926110302c85a2c140302dc5418150302de5519160302de53170b0402b352290c0402bb55270d0402cd602c0e0402c05720100402ca4d14110402dd5317140402c95a1a150402f0851a160402e25d180c0502b365500d0502b4654f0e0502c057200f0502c54c13100502d96017110502df5617140502cc5414150502f29621160502f39123170502e059180f0602c54c13100602cf5115110602df5617140602dc5217150602ea731a160602f7a821170602e05e17100702c54c13140702dd5317150702e37519160702f39821170702e05c170e0802c54c13130802de5317140802df5517150802ec8e2a160802e9791c170802de53170d0902c850140e0902c84f140f0902c64c13130902de5317140902de5317150902de5317160902de53170c0a02c54c130d0a02da68170e0a02e363190f0a02dd5317140a02c54c13150a02c54c130c0b02c54c130d0b02e17b170e0b02d97b1a0f0b02c3571f130b02c54c13140b02c54c13160b02c54c13170b02c54c130c0c02c54c130d0c02e2731a0e0c02f196220f0c02ce5a1d100c02c05720130c02c64d15140c02c64c13160c02c54c13170c02c54c130c0d02dc52170d0d02cf59150e0d02f297210f0d02ed9125100d02c55d20120d02dc5919130d02dc731c140d02de5917160d02d25015170d02d35115180d02c94e140b0e02de53170c0e02dd53170d0e02cb561d0e0e02e0811c0f0e02f7b127100e02d4631e110e02c05b26120e02ef9625130e02f2a327140e02e05e17160e02d75116170e02e16519180e02db6317190e02c54c130b0f02dc571a0c0f02d55f1e0d0f02ca551b0e0f02d5631d0f0f02f7a928100f02e26119110f02df5d18120f02f9b93f130f02ee9026140f02d75116150f02d35015160f02df5917170f02f39927180f02e1731b190f02c44c140b1002bd5a270c1002ed8d1a0d1002cf5c1e0e1002e66c1b0f1002f8ae31101002ef8b1e111002ea731c121002fbc841131002f19a1f141002d25515151002d55615161002f09d1f171002f0911a181002c3561f191002b552280a1102b352290b1102d66d260c1102f9a9270d1102d574350e1102e67b1f0f1102f9a82f101102f5ab3c111102faa22c121102fbc73f131102fcca3e141102ec7b1d151102ec811d161102f8b227171102dc6e20181102b65228191102b352290a1202b352290b1202d66e260c1202f9a9250d1202f8a0230e1202f28a1b0f1202ef9524101202fbcc5b111202fac245121202fbe270131202f8aa2a141202e98a21151202faab35161202f8c036171202dd741c181202c35624191202b352290813029d75650a1302aa5e2b0b1302b756280c1302e8701c0d1302f7a5210e1302f7a1190f1302f48421101302fcc05f111302fbcc79121302f8cd71131302e58a35141302f4ab4d151302fba729161302f9b02b171302f79a30181302e0811f0814029d75650914029d75650a1402a76f2d0b1402b767280c1402e25b160d1402f07d1c0e1402faa02f0f1402fda646101402fdd086111402fdd89a121402fabd5e131402f3b67b141402fbb559151402faa634161402fbb04a171402f59834181402dd7b230a1502a2652f0b1502c65c1b0c1502f5942e0d1502f484210e1502f99e410f1502febe75101502fcdca5111502fbecd7121502fce2bf131502f6c296141502f4a463151502fdac51161502faa944171502c66321181502ac6328091602a578460a1602a070430b1602be64300c1602f496330d1602fbb04b0e1602faa9580f1602fec591101602fcefd4111602fcf3e9121602fbecd7131602f8cfb0141602f8af74151602fab556161602f59939171602c36023181602bb5e1d0917029c73550a1702a1724f0b1702b664440c1702da66210d1702f9ae460e1702fac16f0f1702f6c58e101702fbefd0111702fcf3e3121702fcf0e0131702f8d0ad141702f8b375151702f9c25e161702ee882d171702c95d22181702b16628191702a0692c0a1802a36d410b1802a062360c1802ab63350d1802be76410e1802bd8c550f1802e7af8a101802e5cba8111802f2d8b9121802f5d8a8131802edc48d141802dea85f151802c98845161802bd5e2d171802b66135181802af6a1d1918029b74100a19027a52230b19027553290c19025c4c2e0d19028770460e19027f67500f1902a58561101902ac8464111902c39f7f121902dda871131902b39261141902b68f5b151902a691541619025f4a33171902865b1e181902a771111919029a74100a1a027b552a0b1a029365290c1a026349330d1a027854240e1a027b5c380f1a0258593c101a027e6d4c111a02928565121a026c6357131a02968258141a025c4f36151a027f5d34161a02936326171a028b61120b1b0281502f0c1b0265442e0d1b02703f1e0e1b02623b220f1b02694c2b101b02796647111b02816436121b02816331131b027b663e141b026f4c2c151b02805026161b027b4e1f171b025c3e150d1c02934c190e1c027f4a1d0f1c028f5e24101c027e673f111c028c5722121c02563b23131c029a6f2e141c0289622c151c02855618161c028d591a0f1d0286591b101d02967131");
    const App$Kaelin$Sprite$fire = App$Kaelin$Sprite$new$(9n, List$cons$(App$Kaelin$Assets$effects$fire_1, List$cons$(App$Kaelin$Assets$effects$fire_2, List$cons$(App$Kaelin$Assets$effects$fire_3, List$cons$(App$Kaelin$Assets$effects$fire_4, List$cons$(App$Kaelin$Assets$effects$fire_5, List$nil))))));
    function App$Kaelin$Effect$animation$push$(_coords$1, _center$2, _target$3, _map$4) {
        var _map$5 = List$foldr$(_map$4, _coord$5 => _map$6 => {
            var $723 = App$Kaelin$Map$push$(_coord$5, App$Kaelin$Map$Entity$animation$(App$Kaelin$Animation$new$(16n, App$Kaelin$Sprite$fire)), _map$6);
            return $723;
        }, _coords$1);
        var $722 = App$Kaelin$Effect$Result$new$(Unit$new, _map$5, List$nil, NatMap$new);
        return $722;
    }
    const App$Kaelin$Effect$animation$push = x0 => x1 => x2 => x3 => App$Kaelin$Effect$animation$push$(x0, x1, x2, x3);
    const List$for = a0 => a1 => a2 => list_for(a0)(a1)(a2);
    function App$Kaelin$Effect$result$union$(_a$2, _b$3, _value_union$4) {
        var $724 = App$Kaelin$Effect$Result$new$(_value_union$4((() => {
            var self = _a$2;
            switch (self._) {
              case "App.Kaelin.Effect.Result.new":
                var $725 = self.value;
                var $726 = $725;
                return $726;
            }
        })())((() => {
            var self = _b$3;
            switch (self._) {
              case "App.Kaelin.Effect.Result.new":
                var $727 = self.value;
                var $728 = $727;
                return $728;
            }
        })()), (() => {
            var self = _b$3;
            switch (self._) {
              case "App.Kaelin.Effect.Result.new":
                var $729 = self.map;
                var $730 = $729;
                return $730;
            }
        })(), List$concat$((() => {
            var self = _a$2;
            switch (self._) {
              case "App.Kaelin.Effect.Result.new":
                var $731 = self.futures;
                var $732 = $731;
                return $732;
            }
        })(), (() => {
            var self = _b$3;
            switch (self._) {
              case "App.Kaelin.Effect.Result.new":
                var $733 = self.futures;
                var $734 = $733;
                return $734;
            }
        })()), NatMap$union$((() => {
            var self = _a$2;
            switch (self._) {
              case "App.Kaelin.Effect.Result.new":
                var $735 = self.indicators;
                var $736 = $735;
                return $736;
            }
        })(), (() => {
            var self = _b$3;
            switch (self._) {
              case "App.Kaelin.Effect.Result.new":
                var $737 = self.indicators;
                var $738 = $737;
                return $738;
            }
        })()));
        return $724;
    }
    const App$Kaelin$Effect$result$union = x0 => x1 => x2 => App$Kaelin$Effect$result$union$(x0, x1, x2);
    function App$Kaelin$Effect$area$(_eff$2, _coords$3, _center$4, _target$5, _map$6) {
        var _map_result$7 = NatMap$new;
        var _eff_result$8 = App$Kaelin$Effect$pure(_map_result$7);
        var _result$9 = App$Kaelin$Effect$Result$new$(_map_result$7, _map$6, List$nil, NatMap$new);
        var _result$10 = (() => {
            var $741 = _result$9;
            var $742 = _coords$3;
            let _result$11 = $741;
            let _coord$10;
            while ($742._ === "List.cons") {
                _coord$10 = $742.head;
                var _result_of_effect$12 = _eff$2(_center$4)(_coord$10)((() => {
                    var self = _result$11;
                    switch (self._) {
                      case "App.Kaelin.Effect.Result.new":
                        var $743 = self.map;
                        var $744 = $743;
                        return $744;
                    }
                })());
                var _key$13 = App$Kaelin$Coord$Convert$axial_to_nat$(_coord$10);
                var _new_form$14 = App$Kaelin$Effect$Result$new$(NatMap$set$(_key$13, (() => {
                    var self = _result_of_effect$12;
                    switch (self._) {
                      case "App.Kaelin.Effect.Result.new":
                        var $745 = self.value;
                        var $746 = $745;
                        return $746;
                    }
                })(), NatMap$new), (() => {
                    var self = _result_of_effect$12;
                    switch (self._) {
                      case "App.Kaelin.Effect.Result.new":
                        var $747 = self.map;
                        var $748 = $747;
                        return $748;
                    }
                })(), (() => {
                    var self = _result_of_effect$12;
                    switch (self._) {
                      case "App.Kaelin.Effect.Result.new":
                        var $749 = self.futures;
                        var $750 = $749;
                        return $750;
                    }
                })(), (() => {
                    var self = _result_of_effect$12;
                    switch (self._) {
                      case "App.Kaelin.Effect.Result.new":
                        var $751 = self.indicators;
                        var $752 = $751;
                        return $752;
                    }
                })());
                var $741 = App$Kaelin$Effect$result$union$(_result$11, _new_form$14, NatMap$union);
                _result$11 = $741;
                $742 = $742.tail;
            }
            return _result$11;
        })();
        var $739 = _result$10;
        return $739;
    }
    const App$Kaelin$Effect$area = x0 => x1 => x2 => x3 => x4 => App$Kaelin$Effect$area$(x0, x1, x2, x3, x4);
    function App$Kaelin$Map$creature$change_hp$(_value$1, _pos$2, _map$3) {
        var _map$4 = App$Kaelin$Map$creature$modify_at$(App$Kaelin$Tile$creature$change_hp(_value$1), _pos$2, _map$3);
        var $753 = Pair$new$(_value$1, _map$4);
        return $753;
    }
    const App$Kaelin$Map$creature$change_hp = x0 => x1 => x2 => App$Kaelin$Map$creature$change_hp$(x0, x1, x2);
    function App$Kaelin$Effect$hp$change$(_change$1) {
        var $754 = App$Kaelin$Effect$monad$(_m$bind$2 => _m$pure$3 => {
            var $755 = _m$bind$2;
            return $755;
        })(App$Kaelin$Effect$map$get)(_map$2 => {
            var $756 = App$Kaelin$Effect$monad$(_m$bind$3 => _m$pure$4 => {
                var $757 = _m$bind$3;
                return $757;
            })(App$Kaelin$Effect$coord$get_target)(_target$3 => {
                var _res$4 = App$Kaelin$Map$creature$change_hp$(_change$1, _target$3, _map$2);
                var self = _res$4;
                switch (self._) {
                  case "Pair.new":
                    var $759 = self.fst;
                    var $760 = $759;
                    var _dhp$5 = $760;
                    break;
                }
                var self = _res$4;
                switch (self._) {
                  case "Pair.new":
                    var $761 = self.snd;
                    var $762 = $761;
                    var _map$6 = $762;
                    break;
                }
                var _key$7 = App$Kaelin$Coord$Convert$axial_to_nat$(_target$3);
                var _indicators$8 = NatMap$new;
                var $758 = App$Kaelin$Effect$monad$(_m$bind$9 => _m$pure$10 => {
                    var $763 = _m$bind$9;
                    return $763;
                })(App$Kaelin$Effect$map$set(_map$6))(_$9 => {
                    var $764 = App$Kaelin$Effect$monad$(_m$bind$10 => _m$pure$11 => {
                        var $765 = _m$bind$10;
                        return $765;
                    })((() => {
                        var self = _dhp$5 > 0;
                        if (self) {
                            var $766 = App$Kaelin$Effect$indicators$add(NatMap$set$(_key$7, App$Kaelin$Indicator$green, _indicators$8));
                            return $766;
                        } else {
                            var self = _dhp$5 <= 0;
                            if (self) {
                                var $768 = App$Kaelin$Effect$indicators$add(NatMap$set$(_key$7, App$Kaelin$Indicator$red, _indicators$8));
                                var $767 = $768;
                            } else {
                                var $769 = App$Kaelin$Effect$monad$(_m$bind$10 => _m$pure$11 => {
                                    var $770 = _m$pure$11;
                                    return $770;
                                })(Unit$new);
                                var $767 = $769;
                            }
                            return $767;
                        }
                    })())(_$10 => {
                        var $771 = App$Kaelin$Effect$monad$(_m$bind$11 => _m$pure$12 => {
                            var $772 = _m$pure$12;
                            return $772;
                        })(_dhp$5);
                        return $771;
                    });
                    return $764;
                });
                return $758;
            });
            return $756;
        });
        return $754;
    }
    const App$Kaelin$Effect$hp$change = x0 => App$Kaelin$Effect$hp$change$(x0);
    function App$Kaelin$Effect$hp$damage$(_dmg$1) {
        var $773 = App$Kaelin$Effect$hp$change$(-_dmg$1);
        return $773;
    }
    const App$Kaelin$Effect$hp$damage = x0 => App$Kaelin$Effect$hp$damage$(x0);
    function App$Kaelin$Skill$fireball$(_cost$1, _dmg$2, _range$3) {
        var $774 = App$Kaelin$Effect$monad$(_m$bind$4 => _m$pure$5 => {
            var $775 = _m$bind$4;
            return $775;
        })(App$Kaelin$Effect$map$get)(_map$4 => {
            var $776 = App$Kaelin$Effect$monad$(_m$bind$5 => _m$pure$6 => {
                var $777 = _m$bind$5;
                return $777;
            })(App$Kaelin$Effect$coord$get_target)(_target_pos$5 => {
                var $778 = App$Kaelin$Effect$monad$(_m$bind$6 => _m$pure$7 => {
                    var $779 = _m$bind$6;
                    return $779;
                })(App$Kaelin$Effect$coord$get_center)(_center_pos$6 => {
                    var _coords$7 = App$Kaelin$Coord$range$(_target_pos$5, _range$3);
                    var $780 = App$Kaelin$Effect$monad$(_m$bind$8 => _m$pure$9 => {
                        var $781 = _m$bind$8;
                        return $781;
                    })(App$Kaelin$Effect$animation$push(_coords$7))(_$8 => {
                        var $782 = App$Kaelin$Effect$monad$(_m$bind$9 => _m$pure$10 => {
                            var $783 = _m$bind$9;
                            return $783;
                        })(App$Kaelin$Effect$area(App$Kaelin$Effect$hp$damage$(_dmg$2))(_coords$7))(_$9 => {
                            var $784 = App$Kaelin$Effect$monad$(_m$bind$10 => _m$pure$11 => {
                                var $785 = _m$bind$10;
                                return $785;
                            })(App$Kaelin$Effect$ap$cost$(_cost$1, _center_pos$6))(_$10 => {
                                var $786 = App$Kaelin$Effect$monad$(_m$bind$11 => _m$pure$12 => {
                                    var $787 = _m$pure$12;
                                    return $787;
                                })(Unit$new);
                                return $786;
                            });
                            return $784;
                        });
                        return $782;
                    });
                    return $780;
                });
                return $778;
            });
            return $776;
        });
        return $774;
    }
    const App$Kaelin$Skill$fireball = x0 => x1 => x2 => App$Kaelin$Skill$fireball$(x0, x1, x2);
    const App$Kaelin$Heroes$Croni$skills$fireball = App$Kaelin$Skill$new$("Fireball", 2, App$Kaelin$Skill$fireball$(4, 3, 1), 87);
    function App$Kaelin$Effect$ap$burn$(_value$1, _pos$2) {
        var $788 = App$Kaelin$Effect$ap$change_at$(-_value$1, _pos$2);
        return $788;
    }
    const App$Kaelin$Effect$ap$burn = x0 => x1 => App$Kaelin$Effect$ap$burn$(x0, x1);
    function App$Kaelin$Effect$ap$restore$(_value$1, _target$2) {
        var $789 = App$Kaelin$Effect$ap$change_at$(_value$1, _target$2);
        return $789;
    }
    const App$Kaelin$Effect$ap$restore = x0 => x1 => App$Kaelin$Effect$ap$restore$(x0, x1);
    function App$Kaelin$Skill$ap_drain$(_cost$1, _drain$2) {
        var $790 = App$Kaelin$Effect$monad$(_m$bind$3 => _m$pure$4 => {
            var $791 = _m$bind$3;
            return $791;
        })(App$Kaelin$Effect$map$get)(_map$3 => {
            var $792 = App$Kaelin$Effect$monad$(_m$bind$4 => _m$pure$5 => {
                var $793 = _m$bind$4;
                return $793;
            })(App$Kaelin$Effect$coord$get_center)(_center_pos$4 => {
                var $794 = App$Kaelin$Effect$monad$(_m$bind$5 => _m$pure$6 => {
                    var $795 = _m$bind$5;
                    return $795;
                })(App$Kaelin$Effect$coord$get_target)(_target_pos$5 => {
                    var _block$6 = App$Kaelin$Coord$eql$(_target_pos$5, _center_pos$4);
                    var self = _block$6;
                    if (self) {
                        var $797 = App$Kaelin$Effect$monad$(_m$bind$7 => _m$pure$8 => {
                            var $798 = _m$pure$8;
                            return $798;
                        })(Unit$new);
                        var $796 = $797;
                    } else {
                        var $799 = App$Kaelin$Effect$monad$(_m$bind$7 => _m$pure$8 => {
                            var $800 = _m$bind$7;
                            return $800;
                        })(App$Kaelin$Effect$ap$burn$(_drain$2, _target_pos$5))(_burn$7 => {
                            var $801 = App$Kaelin$Effect$monad$(_m$bind$8 => _m$pure$9 => {
                                var $802 = _m$bind$8;
                                return $802;
                            })(App$Kaelin$Effect$ap$burn$(_drain$2, _target_pos$5))(_$8 => {
                                var $803 = App$Kaelin$Effect$monad$(_m$bind$9 => _m$pure$10 => {
                                    var $804 = _m$bind$9;
                                    return $804;
                                })(App$Kaelin$Effect$ap$restore$(-_burn$7, _center_pos$4))(_$9 => {
                                    var $805 = App$Kaelin$Effect$monad$(_m$bind$10 => _m$pure$11 => {
                                        var $806 = _m$pure$11;
                                        return $806;
                                    })(Unit$new);
                                    return $805;
                                });
                                return $803;
                            });
                            return $801;
                        });
                        var $796 = $799;
                    }
                    return $796;
                });
                return $794;
            });
            return $792;
        });
        return $790;
    }
    const App$Kaelin$Skill$ap_drain = x0 => x1 => App$Kaelin$Skill$ap_drain$(x0, x1);
    const App$Kaelin$Heroes$Croni$skills$ap_drain = App$Kaelin$Skill$new$("Action Points Drain", 3, App$Kaelin$Skill$ap_drain$(0, 2), 69);
    function App$Kaelin$Skill$ap_recover$(_cost$1, _restoration$2) {
        var $807 = App$Kaelin$Effect$monad$(_m$bind$3 => _m$pure$4 => {
            var $808 = _m$bind$3;
            return $808;
        })(App$Kaelin$Effect$coord$get_center)(_self$3 => {
            var $809 = App$Kaelin$Effect$monad$(_m$bind$4 => _m$pure$5 => {
                var $810 = _m$bind$4;
                return $810;
            })(App$Kaelin$Effect$ap$change_at$(_restoration$2, _self$3))(_$4 => {
                var $811 = App$Kaelin$Effect$monad$(_m$bind$5 => _m$pure$6 => {
                    var $812 = _m$pure$6;
                    return $812;
                })(Unit$new);
                return $811;
            });
            return $809;
        });
        return $807;
    }
    const App$Kaelin$Skill$ap_recover = x0 => x1 => App$Kaelin$Skill$ap_recover$(x0, x1);
    const App$Kaelin$Heroes$Croni$skills$ap_recover = App$Kaelin$Skill$new$("Action Points Reovery", 0, App$Kaelin$Skill$ap_recover$(0, 10), 82);
    function App$Kaelin$Coord$Cubic$distance$(_coord_a$1, _coord_b$2) {
        var self = _coord_a$1;
        switch (self._) {
          case "App.Kaelin.Coord.Cubic.new":
            var $814 = self.x;
            var $815 = self.y;
            var $816 = self.z;
            var self = _coord_b$2;
            switch (self._) {
              case "App.Kaelin.Coord.Cubic.new":
                var $818 = self.x;
                var $819 = self.y;
                var $820 = self.z;
                var _subx$9 = $814 - $818 >> 0;
                var _suby$10 = $815 - $819 >> 0;
                var _subz$11 = $816 - $820 >> 0;
                var $821 = I32$max$(I32$max$(I32$abs$(_subx$9), I32$abs$(_suby$10)), I32$abs$(_subz$11));
                var $817 = $821;
                break;
            }
            ;
            var $813 = $817;
            break;
        }
        return $813;
    }
    const App$Kaelin$Coord$Cubic$distance = x0 => x1 => App$Kaelin$Coord$Cubic$distance$(x0, x1);
    function App$Kaelin$Coord$distance$(_fst_coord$1, _snd_coord$2) {
        var _convert_fst$3 = App$Kaelin$Coord$Convert$axial_to_cubic$(_fst_coord$1);
        var _convert_snd$4 = App$Kaelin$Coord$Convert$axial_to_cubic$(_snd_coord$2);
        var $822 = App$Kaelin$Coord$Cubic$distance$(_convert_fst$3, _convert_snd$4);
        return $822;
    }
    const App$Kaelin$Coord$distance = x0 => x1 => App$Kaelin$Coord$distance$(x0, x1);
    function App$Kaelin$Map$Entity$creature$(_value$1) {
        var $823 = {
            _: "App.Kaelin.Map.Entity.creature",
            value: _value$1
        };
        return $823;
    }
    const App$Kaelin$Map$Entity$creature = x0 => App$Kaelin$Map$Entity$creature$(x0);
    function App$Kaelin$Map$creature$pop$(_coord$1, _map$2) {
        var _tile$3 = App$Kaelin$Map$get$(_coord$1, _map$2);
        var self = _tile$3;
        switch (self._) {
          case "Maybe.some":
            var $825 = self.value;
            var self = $825;
            switch (self._) {
              case "App.Kaelin.Tile.new":
                var $827 = self.background;
                var $828 = self.creature;
                var $829 = self.animation;
                var _creature$8 = $828;
                var _remaining_tile$9 = App$Kaelin$Tile$new$($827, Maybe$none, $829);
                var _new_map$10 = App$Kaelin$Map$set$(_coord$1, _remaining_tile$9, _map$2);
                var $830 = Pair$new$(_new_map$10, _creature$8);
                var $826 = $830;
                break;
            }
            ;
            var $824 = $826;
            break;

          case "Maybe.none":
            var $831 = Pair$new$(_map$2, Maybe$none);
            var $824 = $831;
            break;
        }
        return $824;
    }
    const App$Kaelin$Map$creature$pop = x0 => x1 => App$Kaelin$Map$creature$pop$(x0, x1);
    function App$Kaelin$Map$creature$swap$(_ca$1, _cb$2, _map$3) {
        var self = App$Kaelin$Map$creature$pop$(_ca$1, _map$3);
        switch (self._) {
          case "Pair.new":
            var $833 = self.fst;
            var $834 = self.snd;
            var self = $834;
            switch (self._) {
              case "Maybe.some":
                var $836 = self.value;
                var _entity$7 = App$Kaelin$Map$Entity$creature$($836);
                var $837 = App$Kaelin$Map$push$(_cb$2, _entity$7, $833);
                var $835 = $837;
                break;

              case "Maybe.none":
                var $838 = _map$3;
                var $835 = $838;
                break;
            }
            ;
            var $832 = $835;
            break;
        }
        return $832;
    }
    const App$Kaelin$Map$creature$swap = x0 => x1 => x2 => App$Kaelin$Map$creature$swap$(x0, x1, x2);
    const App$Kaelin$Effect$movement$move = App$Kaelin$Effect$monad$(_m$bind$1 => _m$pure$2 => {
        var $839 = _m$bind$1;
        return $839;
    })(App$Kaelin$Effect$map$get)(_map$1 => {
        var $840 = App$Kaelin$Effect$monad$(_m$bind$2 => _m$pure$3 => {
            var $841 = _m$bind$2;
            return $841;
        })(App$Kaelin$Effect$coord$get_center)(_center$2 => {
            var $842 = App$Kaelin$Effect$monad$(_m$bind$3 => _m$pure$4 => {
                var $843 = _m$bind$3;
                return $843;
            })(App$Kaelin$Effect$coord$get_target)(_target$3 => {
                var _distance$4 = I32$abs$(App$Kaelin$Coord$distance$(_center$2, _target$3));
                var $844 = App$Kaelin$Effect$monad$(_m$bind$5 => _m$pure$6 => {
                    var $845 = _m$bind$5;
                    return $845;
                })(App$Kaelin$Effect$ap$cost$(_distance$4, _center$2))(_cost$5 => {
                    var _creature$6 = App$Kaelin$Map$creature$get$(_center$2, _map$1);
                    var self = _creature$6;
                    switch (self._) {
                      case "Maybe.some":
                        var $847 = self.value;
                        var _new_creature$8 = App$Kaelin$Tile$creature$change_ap$(_cost$5, $847);
                        var _mod_map$9 = App$Kaelin$Map$push$(_center$2, App$Kaelin$Map$Entity$creature$(_new_creature$8), _map$1);
                        var _key$10 = App$Kaelin$Coord$Convert$axial_to_nat$(_center$2);
                        var _tile$11 = NatMap$get$(_key$10, _map$1);
                        var self = _tile$11;
                        switch (self._) {
                          case "Maybe.none":
                            var $849 = App$Kaelin$Effect$monad$(_m$bind$12 => _m$pure$13 => {
                                var $850 = _m$pure$13;
                                return $850;
                            })(Unit$new);
                            var $848 = $849;
                            break;

                          case "Maybe.some":
                            var self = App$Kaelin$Map$is_occupied$(_target$3, _map$1);
                            if (self) {
                                var $852 = App$Kaelin$Effect$monad$(_m$bind$13 => _m$pure$14 => {
                                    var $853 = _m$pure$14;
                                    return $853;
                                })(Unit$new);
                                var $851 = $852;
                            } else {
                                var _new_map$13 = App$Kaelin$Map$creature$swap$(_center$2, _target$3, _mod_map$9);
                                var $854 = App$Kaelin$Effect$map$set(_new_map$13);
                                var $851 = $854;
                            }
                            ;
                            var $848 = $851;
                            break;
                        }
                        ;
                        var $846 = $848;
                        break;

                      case "Maybe.none":
                        var $855 = App$Kaelin$Effect$monad$(_m$bind$7 => _m$pure$8 => {
                            var $856 = _m$pure$8;
                            return $856;
                        })(Unit$new);
                        var $846 = $855;
                        break;
                    }
                    return $846;
                });
                return $844;
            });
            return $842;
        });
        return $840;
    });
    function App$Kaelin$Skill$move$(_max_cost$1, _range$2) {
        var $857 = App$Kaelin$Skill$new$("Move", _range$2, App$Kaelin$Effect$movement$move, 88);
        return $857;
    }
    const App$Kaelin$Skill$move = x0 => x1 => App$Kaelin$Skill$move$(x0, x1);
    const App$Kaelin$Heroes$Croni$skills = List$cons$(App$Kaelin$Heroes$Croni$skills$vampirism, List$cons$(App$Kaelin$Heroes$Croni$skills$fireball, List$cons$(App$Kaelin$Heroes$Croni$skills$ap_drain, List$cons$(App$Kaelin$Heroes$Croni$skills$ap_recover, List$cons$(App$Kaelin$Skill$move$(2, 2), List$nil)))));
    const App$Kaelin$Heroes$Croni$hero = App$Kaelin$Hero$new$("Croni", App$Kaelin$Assets$hero$croni0_d_1, 25, 10, App$Kaelin$Heroes$Croni$skills);
    const App$Kaelin$Assets$hero$cyclope_d_1 = VoxBox$parse$("0e0a212c333d0f0a212c333d100a212c333d110a212c333d0d0b202c333d0e0b20fff9e10f0b20fff9e1100b20fff9e1110b20fff9e1120b202c333d0d0c1f2c333d0e0c1ffff9e10f0c1ffff9e1100c1ffff9e1110c1ffff9e1120c1f2c333d0c0d1e2729600d0d1e2729600e0d1efff9e10f0d1eccc8b7100d1eccc8b7110d1eccc8b7120d1e272960130d1e272960140d1e2729600c0e1d2729600d0e1d2729600e0e1dfff9e10f0e1dccc8b7100e1dccc8b7110e1dccc8b7120e1d272960130e1d272960140e1d272960050f1c272960060f1c272960070f1c272960090f1c2729600a0f1c2729600b0f1c2729600c0f1c5176b80d0f1cfff9e10e0f1cdfdbc80f0f1cdfdbc8100f1cdfdbc8110f1cdfdbc8120f1cccc8b7130f1c5176b8140f1c5176b8150f1c27296005101b27296006101b799cd307101b799cd308101b27296009101b5176b80a101b5176b80b101b5176b80c101b799cd30d101b5176b80e101bdfdbc80f101bccc8b710101bccc8b711101bccc8b712101b5176b813101b799cd314101b799cd315101b5176b816101b27296017101b27296018101b27296005111a27296006111a799cd307111a799cd308111a27296009111a5176b80a111a5176b80b111a5176b80c111a799cd30d111a5176b80e111adfdbc80f111accc8b710111accc8b711111accc8b712111a5176b813111a799cd314111a799cd315111a5176b816111a27296017111a27296018111a2729600512192729600612195176b80712195176b8081219394c87091219799cd30a1219799cd30b1219799cd30c12195176b80d12194a2b710e12194a2b710f12194a2b711012194a2b711112194a2b711212194a2b711312195176b81412195176b8151219799cd31612192729601712192729601812192729600513182729600613185176b80713185176b8081318394c87091318799cd30a1318799cd30b1318799cd30c13185176b80d13184a2b710e13184a2b710f13184a2b711013184a2b711113184a2b711213184a2b711313185176b81413185176b8151318799cd3161318272960171318272960181318272960051417272960061417272960071417272960081417394c870914175176b80a14175176b80b14175176b80c14174a2b710d1417dab04d0e1417dab04d0f1417dab04d101417dab04d111417dab04d121417dab04d1314174a2b711414174a2b711514175176b8161417394c87171417394c87181417394c871914172729601a1417272960051516272960061516799cd3071516799cd3081516394c870915165176b80a15165176b80b15165176b80c15164a2b710d1516dab04d0e1516fff9e10f1516fff9e1101516fff9e1111516fff9e1121516dab04d1315164a2b711415164a2b711515165176b8161516394c87171516394c87181516394c87191516799cd31a1516272960051615272960061615799cd3071615799cd3081615394c870916155176b80a16155176b80b16155176b80c16154a2b710d1615dab04d0e1615fff9e10f1615fff9e1101615fff9e1111615fff9e1121615dab04d1316154a2b711416154a2b711516155176b8161615394c87171615394c87181615394c87191615799cd31a1615272960051714272960061714272960071714272960081714394c870917145176b80a17145176b80b17145176b80c17144a2b710d1714dab04d0e17142421260f1714242126101714242126111714242126121714dab04d1317144a2b711417144a2b711517145176b8161714394c87171714394c87181714394c871917142729601a17145176b81b17142729600518132729600618135176b80718135176b8081813394c870918135176b80a18135176b80b18135176b80c18135176b80d18134a2b710e18134a2b710f18134a2b711018134a2b711118134a2b711218134a2b711318135176b81418135176b81518135176b8161813394c87171813394c87181813394c87191813799cd31a1813799cd31b18132729600519122729600619125176b80719125176b8081912394c870919125176b80a19125176b80b19125176b80c19125176b80d19124a2b710e19124a2b710f19124a2b711019124a2b711119124a2b711219124a2b711319125176b81419125176b81519125176b8161912394c87171912394c87181912394c87191912799cd31a1912799cd31b1912272960051a11272960061a115176b8071a115176b8081a11394c87091a115176b80a1a115176b80b1a115176b80c1a115176b80d1a114a2b710e1a114a2b710f1a114a2b71101a114a2b71111a114a2b71121a114a2b71131a115176b8141a115176b8151a115176b8161a11394c87171a11394c87181a11394c87191a11799cd31a1a11799cd31b1a11272960051b10272960061b10799cd3071b10799cd3081b105176b8091b10394c870a1b10394c870b1b10394c870c1b10dfdbc80d1b105176b80e1b105176b80f1b105176b8101b105176b8111b105176b8121b105176b8131b10dfdbc8141b10dfdbc8151b10394c87161b105176b8171b105176b8181b105176b8191b105176b81a1b10799cd31b1b10272960061c0f272960071c0f272960081c0f272960091c0f394c870a1c0f394c870b1c0f394c870c1c0fdfdbc80d1c0f4662a10e1c0f4662a10f1c0f4662a1101c0f4662a1111c0f4662a1121c0f4662a1131c0fdfdbc8141c0fdfdbc8151c0f394c87161c0f394c87171c0f394c87181c0f394c87191c0f5176b81a1c0f5176b81b1c0f272960081d0e272960091d0e5176b80a1d0e5176b80b1d0e5176b80c1d0e394c870d1d0e394c870e1d0e394c870f1d0e394c87101d0e394c87111d0e394c87121d0e394c87131d0e394c87141d0e394c87151d0e5176b8161d0e394c87171d0e394c87181d0e394c87191d0e5176b81a1d0e5176b81b1d0e272960081e0d272960091e0d5176b80a1e0d5176b80b1e0d5176b80c1e0d394c870d1e0d394c870e1e0d394c870f1e0d394c87101e0d394c87111e0d394c87121e0d394c87131e0d394c87141e0d394c87151e0d5176b8161e0d394c87171e0d394c87181e0d394c87191e0d5176b81a1e0d5176b81b1e0d272960081f0c272960091f0c5176b80a1f0c5176b80b1f0c5176b80c1f0c394c870d1f0c394c870e1f0c394c870f1f0c394c87101f0c394c87111f0c394c87121f0c394c87131f0c394c87141f0c394c87151f0c5176b8161f0c394c87171f0c394c87181f0c394c87191f0c5176b81a1f0c5176b81b1f0c27296008200b27296009200b5176b80a200b5176b80b200b5176b80c200b5176b80d200b5176b80e200b5176b80f200b5176b810200b5176b811200b5176b812200b5176b813200b5176b814200b5176b815200b394c8716200b799cd317200b799cd318200b799cd319200b5176b81a200b5176b81b200b27296008210a27296009210a8e4a9d0a210a8e4a9d0b210a8e4a9d0c210a8e4a9d0d210a5176b80e210a5176b80f210a5176b810210a5176b811210a5176b812210a5176b813210a394c8714210a394c8715210a394c8716210a799cd317210a799cd318210a799cd319210a799cd31a210a5176b81b210a2729600922092729600a22092729600b22092729600c22094a2b710d22098e4a9d0e22098e4a9d0f22098e4a9d1022098e4a9d1122098e4a9d1222098e4a9d132209394c87142209394c871522095176b8162209394c87172209394c87182209394c87192209394c871a22092729600923082729600a23082729600b23082729600c23084a2b710d23088e4a9d0e23088e4a9d0f23088e4a9d1023088e4a9d1123088e4a9d1223088e4a9d132308394c87142308394c871523085176b8162308394c87172308394c87182308394c87192308394c871a23082729600924072729600a24072729600b24072729600c24074a2b710d24078e4a9d0e24078e4a9d0f24078e4a9d1024078e4a9d1124078e4a9d1224078e4a9d132407394c87142407394c871524075176b8162407394c87172407394c87182407394c87192407394c871a24072729600925062729600a25062729600b25062729600c25065176b80d25064a2b710e25068e4a9d0f25068e4a9d1025068e4a9d1125068e4a9d1225064a2b71132506394c87142506394c87152506799cd3162506799cd3172506799cd3182506799cd31925065176b81a25062729600926052729600a26052729600b26052729600c2605799cd30d2605799cd30e26054a2b710f26054a2b711026054a2b711126054a2b711226052729601326052729601426052729601526052729601626052729601726052729601826052729601926052729600927042729600a27042729600b27042729600c27042729600d27042729600e2704272960");
    const App$Kaelin$Heroes$Cyclope$skills$vampirism = App$Kaelin$Skill$new$("Vampirism", 2, App$Kaelin$Skill$vampirism$(1, 2), 81);
    const App$Kaelin$Heroes$Cyclope$skills$ap_recover = App$Kaelin$Skill$new$("Action Points Reovery", 0, App$Kaelin$Skill$ap_recover$(0, 10), 82);
    const App$Kaelin$Heroes$Cyclope$skills = List$cons$(App$Kaelin$Heroes$Cyclope$skills$vampirism, List$cons$(App$Kaelin$Heroes$Cyclope$skills$ap_recover, List$cons$(App$Kaelin$Skill$move$(2, 3), List$nil)));
    const App$Kaelin$Heroes$Cyclope$hero = App$Kaelin$Hero$new$("Cyclope", App$Kaelin$Assets$hero$cyclope_d_1, 15, 10, App$Kaelin$Heroes$Cyclope$skills);
    const App$Kaelin$Assets$hero$lela_d_1 = VoxBox$parse$("091219fb4d4d0a1219fb4d4d0b1219fb4d4d0c1219fb4d4d131219fb4d4d141219fb4d4d151219fb4d4d161219fb4d4d081318fb4d4d0913182b496c0a13182b496c0b13182b496c0c13182b496c0d1318fb4d4d121318fb4d4d1313182b496c1413182b496c1513182b496c1613182b496c171318fb4d4d071417fb4d4d0814172b496c09141781aeff0a141781aeff0b141781aeff0c141781aeff0d14172b496c0e1417fb4d4d0f1417fb4d4d101417fb4d4d111417fb4d4d1214172b496c13141781aeff14141781aeff15141781aeff16141781aeff1714172b496c181417fb4d4d071516fb4d4d0815161f3b5b091516538ccf0a1516538ccf0b1516538ccf0c1516538ccf0d1516538ccf0e15162b496c0f15162b496c1015162b496c1115162b496c121516538ccf131516538ccf141516538ccf151516538ccf161516538ccf1715161f3b5b181516fb4d4d071615fb4d4d0816151f3b5b091615538ccf0a1615538ccf0b1615538ccf0c1615538ccf0d1615538ccf0e161581aeff0f161581aeff10161581aeff11161581aeff121615538ccf131615538ccf141615538ccf151615538ccf161615538ccf1716151f3b5b181615fb4d4d071714fb4d4d0817141f3b5b091714538ccf0a1714538ccf0b1714538ccf0c1714538ccf0d1714538ccf0e1714538ccf0f1714538ccf101714538ccf111714538ccf121714538ccf131714538ccf141714538ccf151714538ccf161714538ccf1717141f3b5b181714fb4d4d081813fb4d4d0918131f3b5b0a1813538ccf0b1813538ccf0c1813538ccf0d1813538ccf0e1813538ccf0f1813cb4646101813cb4646111813538ccf121813538ccf131813538ccf141813538ccf151813538ccf1618131f3b5b171813fb4d4d091912fb4d4d0a19121f3b5b0b1912538ccf0c1912538ccf0d1912538ccf0e1912538ccf0f1912ad1f1f101912ad1f1f111912538ccf121912538ccf131912538ccf141912538ccf1519121f3b5b161912fb4d4d091a11fb4d4d0a1a111f3b5b0b1a11538ccf0c1a11538ccf0d1a11cb46460e1a11538ccf0f1a11538ccf101a11538ccf111a11538ccf121a11cb4646131a11538ccf141a11538ccf151a111f3b5b161a11fb4d4d091b10fb4d4d0a1b101f3b5b0b1b10538ccf0c1b10538ccf0d1b10ad1f1f0e1b10538ccf0f1b103d5497101b103d5497111b10538ccf121b10ad1f1f131b10538ccf141b10538ccf151b101f3b5b161b10fb4d4d0a1c0ffb4d4d0b1c0f1f3b5b0c1c0f538ccf0d1c0f538ccf0e1c0f538ccf0f1c0f2d4382101c0f2d4382111c0f538ccf121c0f538ccf131c0f538ccf141c0f1f3b5b151c0ffb4d4d0b1d0efb4d4d0c1d0e1f3b5b0d1d0e3a67b70e1d0e538ccf0f1d0e203368101d0e203368111d0e538ccf121d0e3a67b7131d0e1f3b5b141d0efb4d4d0a1e0dfb4d4d0b1e0d1f3b5b0c1e0d538ccf0d1e0d538ccf0e1e0d3a67b70f1e0d3a67b7101e0d3a67b7111e0d3a67b7121e0d538ccf131e0d538ccf141e0d1f3b5b151e0dfb4d4d091f0cfb4d4d0a1f0c1f3b5b0b1f0c81aeff0c1f0c3a71b10d1f0c538ccf0e1f0c81aeff0f1f0c81aeff101f0c81aeff111f0c81aeff121f0c538ccf131f0c3a71b1141f0c81aeff151f0c1f3b5b161f0cfb4d4d08200bfb4d4d09200b1f3b5b0a200b538ccf0b200b538ccf0c200b3a71b10d200b538ccf0e200b538ccf0f200b538ccf10200b538ccf11200b538ccf12200b538ccf13200b3a71b114200b538ccf15200b538ccf16200b1f3b5b17200bfb4d4d08210afb4d4d09210a1f3b5b0a210a538ccf0b210a538ccf0c210a3a71b10d210a538ccf0e210a538ccf0f210a538ccf10210a538ccf11210a538ccf12210a538ccf13210a3a71b114210a538ccf15210a538ccf16210a1f3b5b17210afb4d4d082209fb4d4d0922091f3b5b0a2209538ccf0b2209538ccf0c22092753860d2209538ccf0e2209538ccf0f2209538ccf102209538ccf112209538ccf122209538ccf132209275386142209538ccf152209538ccf1622091f3b5b172209fb4d4d092308fb4d4d0a23081f3b5b0b23081f3b5b0c23081f3b5b0d23083a67b70e2308538ccf0f2308538ccf102308538ccf112308538ccf1223083a67b71323081f3b5b1423081f3b5b1523081f3b5b162308fb4d4d0a2407fb4d4d0b2407fb4d4d0c2407fb4d4d0d24071f3b5b0e24073a67b70f2407538ccf102407538ccf1124073a67b71224071f3b5b132407fb4d4d142407fb4d4d152407fb4d4d0d2506fb4d4d0e25061f3b5b0f25063a67b71025063a67b71125061f3b5b122506fb4d4d0e2605fb4d4d0f26051f3b5b1026051f3b5b112605fb4d4d0f2704fb4d4d102704fb4d4d");
    const App$Kaelin$Heroes$Lela$skills$vampirism = App$Kaelin$Skill$new$("Vampirism", 4, App$Kaelin$Skill$vampirism$(2, 4), 81);
    const App$Kaelin$Heroes$Lela$skills$ap_recover = App$Kaelin$Skill$new$("Action Points Reovery", 0, App$Kaelin$Skill$ap_recover$(0, 10), 82);
    const App$Kaelin$Heroes$Lela$skills = List$cons$(App$Kaelin$Heroes$Lela$skills$vampirism, List$cons$(App$Kaelin$Heroes$Lela$skills$ap_recover, List$cons$(App$Kaelin$Skill$move$(2, 2), List$nil)));
    const App$Kaelin$Heroes$Lela$hero = App$Kaelin$Hero$new$("Lela", App$Kaelin$Assets$hero$lela_d_1, 20, 10, App$Kaelin$Heroes$Lela$skills);
    const App$Kaelin$Assets$hero$octoking_d_1 = VoxBox$parse$("0a0a21192a020b0a21192a020d0a21192a020e0a21192a02100a21192a02110a21192a02120a21192a02130a21192a02150a21192a02160a21192a02180a21192a02190a21192a020a0b20192a020b0b20192a020d0b20192a020e0b20192a02100b20192a02110b20192a02120b20192a02130b20192a02150b20192a02160b20192a02180b20192a02190b20192a02080c1f192a02090c1f192a020a0c1fe6d7510b0c1fe6d7510c0c1f192a020d0c1f70681e0e0c1f70681e0f0c1f192a02100c1ffff6a6110c1ffff6a6120c1ffff6a6130c1ffff6a6140c1f192a02150c1f70681e160c1f70681e170c1f192a02180c1fe6d751190c1fe6d7511a0c1f192a021b0c1f192a02080d1e192a02090d1e192a020a0d1ee6d7510b0d1ee6d7510c0d1efff6a60d0d1e192a020e0d1e192a020f0d1ee6d751100d1ee6d751110d1ee6d751120d1ee6d751130d1ee6d751140d1ee6d751150d1e192a02160d1e192a02170d1efff6a6180d1ee6d751190d1ee6d7511a0d1e192a021b0d1e192a02080e1d192a02090e1d192a020a0e1de6d7510b0e1de6d7510c0e1dfff6a60d0e1d192a020e0e1d192a020f0e1de6d751100e1de6d751110e1de6d751120e1de6d751130e1de6d751140e1de6d751150e1d192a02160e1d192a02170e1dfff6a6180e1de6d751190e1de6d7511a0e1d192a021b0e1d192a02080f1c192a02090f1c192a020a0f1cc9ae530b0f1cc9ae530c0f1ce6d7510d0f1ce6d7510e0f1ce6d7510f0f1ce6d751100f1cb8321d110f1cb8321d120f1cb8321d130f1cb8321d140f1ce6d751150f1ce6d751160f1ce6d751170f1ce6d751180f1cc9ae53190f1cc9ae531a0f1c192a021b0f1c192a0208101b192a0209101b192a020a101bc9ae530b101bc9ae530c101be6d7510d101be6d7510e101be6d7510f101be6d75110101bb8321d11101bb8321d12101bb8321d13101bb8321d14101be6d75115101be6d75116101be6d75117101be6d75118101bc9ae5319101bc9ae531a101b192a021b101b192a0205111a192a0206111a192a0207111a192a0208111a192a0209111a192a020a111a4281350b111a4281350c111a4281350d111a4281350e111a4281350f111ac9ae5310111ac9ae5311111ac9ae5312111ac9ae5313111ac9ae5314111ac9ae5315111a42813516111a42813517111a42813518111a42813519111a4281351a111a192a021b111a192a021c111a192a021d111a192a021e111a192a02041219192a020512199fd95d0612199fd95d0712199fd95d081219192a02091219192a020a12199fd95d0b12199fd95d0c12195ea6420d12195ea6420e12195ea6420f12194281351012194281351112194281351212194281351312194281351412194281351512195ea6421612195ea6421712195ea6421812199fd95d1912199fd95d1a1219192a021b1219192a021c12199fd95d1d12199fd95d1e12199fd95d1f1219192a02041318192a020513189fd95d0613189fd95d0713189fd95d081318192a02091318192a020a13189fd95d0b13189fd95d0c13185ea6420d13185ea6420e13185ea6420f13184281351013184281351113184281351213184281351313184281351413184281351513185ea6421613185ea6421713185ea6421813189fd95d1913189fd95d1a1318192a021b1318192a021c13189fd95d1d13189fd95d1e13189fd95d1f1318192a02021417192a02031417192a020414179fd95d0514175ea6420614175ea6420714175ea642081417192a02091417192a020a14175ea6420b14175ea6420c14175ea6420d14175ea6420e14175ea6420f14175ea6421014175ea6421114175ea6421214175ea6421314175ea6421414175ea6421514175ea6421614175ea6421714175ea6421814175ea6421914175ea6421a1417192a021b1417192a021c14175ea6421d14175ea6421e14175ea6421f14179fd95d201417192a02211417192a02041516192a020515165ea6420615165ea6420715165ea642081516192a02091516192a020a15164281350b15164281350c15164281350d15164281350e15164281350f15164281351015165ea6421115165ea6421215165ea6421315165ea6421415164281351515164281351615164281351715164281351815164281351915164281351a1516192a021b1516192a021c15165ea6421d15165ea6421e15165ea6421f1516192a02041615192a020516155ea6420616155ea6420716155ea642081615192a02091615192a020a16154281350b16154281350c16154281350d16154281350e16154281350f16154281351016155ea6421116155ea6421216155ea6421316155ea6421416154281351516154281351616154281351716154281351816154281351916154281351a1615192a021b1615192a021c16155ea6421d16155ea6421e16155ea6421f1615192a02051714192a02061714192a020717145ea6420817145ea6420917145ea6420a1714192a020b1714192a020c17144281350d1714e6d7510e1714e6d7510f1714e6d751101714428135111714428135121714428135131714428135141714e6d751151714e6d751161714e6d751171714428135181714192a02191714192a021a17145ea6421b17145ea6421c17145ea6421d1714192a021e1714192a02071813192a020818135ea6420918135ea6420a1813366d2a0b1813366d2a0c1813192a020d18134281350e18134281350f1813173e0f101813173e0f111813173e0f121813173e0f131813173e0f141813173e0f151813428135161813428135171813192a02181813366d2a191813366d2a1a18135ea6421b18135ea6421c1813192a02071912192a020819125ea6420919125ea6420a1912366d2a0b1912366d2a0c1912192a020d19124281350e19124281350f1912173e0f101912173e0f111912173e0f121912173e0f131912173e0f141912173e0f151912428135161912428135171912192a02181912366d2a191912366d2a1a19125ea6421b19125ea6421c1912192a02051a11192a02061a11192a02071a11192a02081a11428135091a114281350a1a115ea6420b1a115ea6420c1a114281350d1a11192a020e1a11192a020f1a119fd95d101a119fd95d111a119fd95d121a119fd95d131a119fd95d141a119fd95d151a11192a02161a11192a02171a11428135181a115ea642191a115ea6421a1a114281351b1a114281351c1a11192a021d1a11192a021e1a11192a02051b10192a02061b10192a02071b10192a02081b10428135091b104281350a1b105ea6420b1b105ea6420c1b104281350d1b10192a020e1b10192a020f1b109fd95d101b109fd95d111b109fd95d121b109fd95d131b109fd95d141b109fd95d151b10192a02161b10192a02171b10428135181b105ea642191b105ea6421a1b104281351b1b104281351c1b10192a021d1b10192a021e1b10192a02041c0f192a02051c0f366d2a061c0f366d2a071c0f192a02081c0f5ea642091c0f5ea6420a1c0f4281350b1c0f4281350c1c0f192a020d1c0f9fd95d0e1c0f9fd95d0f1c0f5ea642101c0f428135111c0f428135121c0f428135131c0f428135141c0f5ea642151c0f9fd95d161c0f9fd95d171c0f192a02181c0f428135191c0f4281351a1c0f5ea6421b1c0f5ea6421c1c0f192a021d1c0f366d2a1e1c0f366d2a1f1c0f192a02021d0e192a02031d0e192a02041d0e428135051d0e428135061d0e428135071d0e192a02081d0e428135091d0e4281350a1d0e4281350b1d0e4281350c1d0e192a020d1d0e5ea6420e1d0e5ea6420f1d0e5ea642101d0e428135111d0e428135121d0e428135131d0e428135141d0e5ea642151d0e5ea642161d0e5ea642171d0e192a02181d0e428135191d0e4281351a1d0e4281351b1d0e4281351c1d0e192a021d1d0e4281351e1d0e4281351f1d0e428135201d0e192a02211d0e192a02021e0d192a02031e0d192a02041e0d428135051e0d428135061e0d428135071e0d192a02081e0d428135091e0d4281350a1e0d4281350b1e0d4281350c1e0d192a020d1e0d5ea6420e1e0d5ea6420f1e0d5ea642101e0d428135111e0d428135121e0d428135131e0d428135141e0d5ea642151e0d5ea642161e0d5ea642171e0d192a02181e0d428135191e0d4281351a1e0d4281351b1e0d4281351c1e0d192a021d1e0d4281351e1e0d4281351f1e0d428135201e0d192a02211e0d192a02001f0c192a02011f0c192a02021f0c9fd95d031f0c9fd95d041f0c5ea642051f0c428135061f0c428135071f0c192a02081f0c5ea642091f0c5ea6420a1f0c4281350b1f0c4281350c1f0c192a020d1f0c5ea6420e1f0c5ea6420f1f0c5ea642101f0c428135111f0c428135121f0c428135131f0c428135141f0c5ea642151f0c5ea642161f0c5ea642171f0c192a02181f0c428135191f0c4281351a1f0c5ea6421b1f0c5ea6421c1f0c192a021d1f0c4281351e1f0c4281351f1f0c5ea642201f0c9fd95d211f0c9fd95d221f0c192a0202200b192a0203200b192a0204200b192a0205200b42813506200b42813507200b42813508200b192a0209200b192a020a200b366d2a0b200b366d2a0c200b192a020d200b5ea6420e200b5ea6420f200b5ea64210200b42813511200b42813512200b42813513200b42813514200b5ea64215200b5ea64216200b5ea64217200b192a0218200b366d2a19200b366d2a1a200b192a021b200b192a021c200b4281351d200b4281351e200b4281351f200b192a0220200b192a0221200b192a0202210a192a0203210a192a0204210a192a0205210a42813506210a42813507210a42813508210a192a0209210a192a020a210a366d2a0b210a366d2a0c210a192a020d210a5ea6420e210a5ea6420f210a5ea64210210a42813511210a42813512210a42813513210a42813514210a5ea64215210a5ea64216210a5ea64217210a192a0218210a366d2a19210a366d2a1a210a192a021b210a192a021c210a4281351d210a4281351e210a4281351f210a192a0220210a192a0221210a192a02052209192a02062209192a02072209192a020a2209192a020b2209192a020c2209192a020d22095ea6420e22095ea6420f22094281351022094281351122094281351222094281351322094281351422094281351522095ea6421622095ea642172209192a02182209192a02192209192a021c2209192a021d2209192a021e2209192a02052308192a02062308192a02072308192a020a2308192a020b2308192a020c2308192a020d23085ea6420e23085ea6420f23084281351023084281351123084281351223084281351323084281351423084281351523085ea6421623085ea642172308192a02182308192a02192308192a021c2308192a021d2308192a021e2308192a02082407192a02092407192a020a2407192a020b2407192a020c24075ea6420d24074281350e24074281350f2407428135102407366d2a112407366d2a122407366d2a132407366d2a1424074281351524074281351624074281351724075ea642182407192a02192407192a021a2407192a021b2407192a02072506192a020825065ea6420925065ea6420a25065ea6420b25065ea6420c25064281350d25064281350e25064281350f2506366d2a102506192a02112506192a02122506192a02132506192a02142506366d2a1525064281351625064281351725064281351825065ea6421925065ea6421a25065ea6421b25065ea6421c2506192a02072605192a020826055ea6420926055ea6420a26055ea6420b26055ea6420c26054281350d26054281350e26054281350f2605366d2a102605192a02112605192a02122605192a02132605192a02142605366d2a1526054281351626054281351726054281351826055ea6421926055ea6421a26055ea6421b26055ea6421c2605192a02082704192a02092704192a020a2704192a020b2704192a020c2704192a020d2704192a020e2704192a020f2704192a02142704192a02152704192a02162704192a02172704192a02182704192a02192704192a021a2704192a021b2704192a02");
    const App$Kaelin$Heroes$Octoking$skills$ap_recover = App$Kaelin$Skill$new$("Action Points Reovery", 0, App$Kaelin$Skill$ap_recover$(0, 10), 82);
    const App$Kaelin$Heroes$Octoking$skills = List$cons$(App$Kaelin$Skill$move$(0, 1), List$cons$(App$Kaelin$Heroes$Octoking$skills$ap_recover, List$nil));
    const App$Kaelin$Heroes$Octoking$hero = App$Kaelin$Hero$new$("Octoking", App$Kaelin$Assets$hero$octoking_d_1, 40, 10, App$Kaelin$Heroes$Octoking$skills);
    function App$Kaelin$Hero$info$(_id$1) {
        var self = _id$1 === 0;
        if (self) {
            var $859 = Maybe$some$(App$Kaelin$Heroes$Croni$hero);
            var $858 = $859;
        } else {
            var self = _id$1 === 1;
            if (self) {
                var $861 = Maybe$some$(App$Kaelin$Heroes$Cyclope$hero);
                var $860 = $861;
            } else {
                var self = _id$1 === 2;
                if (self) {
                    var $863 = Maybe$some$(App$Kaelin$Heroes$Lela$hero);
                    var $862 = $863;
                } else {
                    var self = _id$1 === 3;
                    if (self) {
                        var $865 = Maybe$some$(App$Kaelin$Heroes$Octoking$hero);
                        var $864 = $865;
                    } else {
                        var $866 = Maybe$none;
                        var $864 = $866;
                    }
                    var $862 = $864;
                }
                var $860 = $862;
            }
            var $858 = $860;
        }
        return $858;
    }
    const App$Kaelin$Hero$info = x0 => App$Kaelin$Hero$info$(x0);
    function App$Kaelin$Tile$creature$create$(_hero_id$1, _player_addr$2, _team$3) {
        var _hero$4 = Maybe$default$(App$Kaelin$Hero$info$(_hero_id$1), App$Kaelin$Heroes$Croni$hero);
        var $867 = App$Kaelin$Creature$new$(_player_addr$2, _hero$4, _team$3, (() => {
            var self = _hero$4;
            switch (self._) {
              case "App.Kaelin.Hero.new":
                var $868 = self.max_hp;
                var $869 = $868;
                return $869;
            }
        })(), (() => {
            var self = _hero$4;
            switch (self._) {
              case "App.Kaelin.Hero.new":
                var $870 = self.max_ap;
                var $871 = $870;
                return $871;
            }
        })(), List$nil);
        return $867;
    }
    const App$Kaelin$Tile$creature$create = x0 => x1 => x2 => App$Kaelin$Tile$creature$create$(x0, x1, x2);
    const App$Kaelin$Team$neutral = {
        _: "App.Kaelin.Team.neutral"
    };
    function App$Kaelin$Map$init$(_map$1) {
        var _new_coord$2 = App$Kaelin$Coord$new;
        var _creature$3 = App$Kaelin$Tile$creature$create;
        var _croni$4 = App$Kaelin$Heroes$Croni$hero;
        var _cyclope$5 = App$Kaelin$Heroes$Cyclope$hero;
        var _lela$6 = App$Kaelin$Heroes$Lela$hero;
        var _octoking$7 = App$Kaelin$Heroes$Octoking$hero;
        var _entity_croni$8 = App$Kaelin$Map$Entity$creature$(_creature$3(0)(Maybe$none)(App$Kaelin$Team$neutral));
        var _entity_cyclope$9 = App$Kaelin$Map$Entity$creature$(_creature$3(1)(Maybe$none)(App$Kaelin$Team$neutral));
        var _entity_lela$10 = App$Kaelin$Map$Entity$creature$(_creature$3(2)(Maybe$none)(App$Kaelin$Team$neutral));
        var _entity_octoking$11 = App$Kaelin$Map$Entity$creature$(_creature$3(3)(Maybe$none)(App$Kaelin$Team$neutral));
        var _map$12 = App$Kaelin$Map$push$(_new_coord$2(-1)(-2), _entity_croni$8, _map$1);
        var _map$13 = App$Kaelin$Map$push$(_new_coord$2(0)(3), _entity_cyclope$9, _map$12);
        var _map$14 = App$Kaelin$Map$push$(_new_coord$2(-2)(0), _entity_lela$10, _map$13);
        var _map$15 = App$Kaelin$Map$push$(_new_coord$2(3)(-2), _entity_octoking$11, _map$14);
        var $872 = _map$15;
        return $872;
    }
    const App$Kaelin$Map$init = x0 => App$Kaelin$Map$init$(x0);
    const App$Kaelin$Assets$tile$green_2 = VoxBox$parse$("0e00011652320f00011652321000011652320c01011652320d01011652320e0101408d640f0101408d64100101469e651101011652321201011652320a02011652320b02011652320c0201469e650d0201469e650e0201469e650f0201408d64100201469e65110201469e65120201408d641302011652321402011652320803011652320903011652320a0301469e650b0301408d640c0301469e650d0301469e650e0301469e650f0301408d64100301408d64110301408d64120301408d64130301469e65140301469e65150301165232160301165232060401165232070401165232080401469e65090401469e650a0401469e650b0401408d640c0401408d640d0401469e650e0401469e650f0401408d64100401469e65110401408d64120401408d64130401408d64140401408d64150401408d64160401408d64170401165232180401165232040501165232050501165232060501469e65070501408d64080501469e65090501469e650a0501408d640b0501408d640c0501408d640d0501347e570e0501347e570f0501469e65100501469e65110501469e65120501347e57130501408d64140501469e65150501469e65160501408d64170501469e65180501469e651905011652321a0501165232020601165232030601165232040601347e57050601469e65060601469e65070601408d64080601408d64090601347e570a0601408d640b0601408d640c0601408d640d0601408d640e0601347e570f0601469e65100601469e65110601408d64120601347e57130601347e57140601469e65150601469e65160601408d64170601408d64180601347e57190601408d641a0601408d641b06011652321c0601165232000701165232010701165232020701408d64030701408d64040701408d64050701469e65060701469e65070701469e65080701408d64090701347e570a0701347e570b0701408d640c0701469e650d0701469e650e0701408d640f0701408d64100701408d64110701408d64120701408d64130701408d64140701408d64150701408d64160701408d64170701408d64180701347e57190701347e571a0701408d641b0701469e651c0701469e651d07011652321e0701165232000801165232010801408d64020801469e65030801469e65040801408d64050801469e65060801469e65070801469e65080801408d64090801469e650a0801469e650b0801408d640c0801408d640d0801469e650e0801469e650f0801347e57100801408d64110801469e65120801469e65130801408d64140801469e65150801469e65160801469e65170801408d64180801408d64190801408d641a0801408d641b0801408d641c0801469e651d0801469e651e0801165232000901165232010901408d64020901408d64030901469e65040901408d64050901408d64060901469e65070901408d64080901408d64090901469e650a0901469e650b0901408d640c0901408d640d0901469e650e0901469e650f0901408d64100901408d64110901469e65120901469e65130901408d64140901408d64150901469e65160901469e65170901408d64180901408d64190901469e651a0901469e651b0901408d641c0901408d641d0901408d641e0901165232000a01165232010a01408d64020a01408d64030a01347e57040a01347e57050a01408d64060a01408d64070a01408d64080a01408d64090a01408d640a0a01469e650b0a01469e650c0a01408d640d0a01408d640e0a01408d640f0a01408d64100a01408d64110a01408d64120a01408d64130a01408d64140a01347e57150a01408d64160a01408d64170a01408d64180a01408d64190a01469e651a0a01469e651b0a01469e651c0a01408d641d0a01408d641e0a01165232000b01165232010b01408d64020b01469e65030b01408d64040b01408d64050b01469e65060b01469e65070b01408d64080b01408d64090b01408d640a0b01408d640b0b01408d640c0b01408d640d0b01469e650e0b01408d640f0b01408d64100b01408d64110b01469e65120b01408d64130b01408d64140b01347e57150b01469e65160b01408d64170b01408d64180b01408d64190b01408d641a0b01408d641b0b01408d641c0b01408d641d0b01408d641e0b01165232000c01165232010c01408d64020c01469e65030c01408d64040c01408d64050c01408d64060c01408d64070c01469e65080c01469e65090c01408d640a0c01347e570b0c01347e570c0c01408d640d0c01469e650e0c01408d640f0c01469e65100c01408d64110c01408d64120c01408d64130c01408d64140c01408d64150c01408d64160c01469e65170c01469e65180c01408d64190c01347e571a0c01347e571b0c01408d641c0c01408d641d0c01408d641e0c01165232000d01165232010d01408d64020d01408d64030d01469e65040d01469e65050d01408d64060d01469e65070d01469e65080d01469e65090d01408d640a0d01347e570b0d01408d640c0d01469e650d0d01469e650e0d01408d640f0d01469e65100d01408d64110d01408d64120d01469e65130d01469e65140d01408d64150d01469e65160d01469e65170d01469e65180d01408d64190d01347e571a0d01408d641b0d01469e651c0d01469e651d0d01408d641e0d01165232000e01165232010e01408d64020e01469e65030e01469e65040e01469e65050e01408d64060e01469e65070e01469e65080e01408d64090e01408d640a0e01408d640b0e01408d640c0e01469e650d0e01469e650e0e01469e650f0e01347e57100e01408d64110e01469e65120e01469e65130e01469e65140e01408d64150e01469e65160e01469e65170e01408d64180e01408d64190e01408d641a0e01408d641b0e01469e651c0e01469e651d0e01469e651e0e01165232000f01165232010f01408d64020f01469e65030f01469e65040f01408d64050f01408d64060f01408d64070f01408d64080f01408d64090f01408d640a0f01408d640b0f01408d640c0f01408d640d0f01469e650e0f01469e650f0f01347e57100f01347e57110f01469e65120f01469e65130f01408d64140f01408d64150f01408d64160f01408d64170f01408d64180f01408d64190f01408d641a0f01408d641b0f01408d641c0f01469e651d0f01469e651e0f01165232001001165232011001408d64021001469e65031001469e65041001408d64051001347e57061001408d64071001469e65081001469e65091001469e650a1001408d640b1001469e650c1001469e650d1001408d640e1001408d640f1001469e65101001408d64111001469e65121001469e65131001408d64141001347e57151001408d64161001469e65171001469e65181001469e65191001408d641a1001469e651b1001469e651c1001408d641d1001408d641e1001165232001101165232011101469e65021101469e65031101469e65041101408d64051101408d64061101408d64071101469e65081101469e65091101408d640a1101408d640b1101408d640c1101408d640d1101408d640e1101408d640f1101408d64101101469e65111101469e65121101469e65131101408d64141101408d64151101408d64161101469e65171101469e65181101408d64191101408d641a1101408d641b1101408d641c1101408d641d1101408d641e1101165232001201165232011201469e65021201469e65031201408d64041201469e65051201469e65061201408d64071201408d64081201408d64091201408d640a1201408d640b1201408d640c1201469e650d1201469e650e1201469e650f1201408d64101201469e65111201469e65121201408d64131201469e65141201469e65151201408d64161201408d64171201408d64181201408d64191201408d641a1201408d641b1201469e651c1201469e651d1201469e651e1201165232001301165232011301408d64021301408d64031301408d64041301469e65051301469e65061301408d64071301408d64081301408d64091301469e650a1301469e650b1301408d640c1301469e650d1301469e650e1301469e650f1301408d64101301408d64111301408d64121301408d64131301469e65141301469e65151301408d64161301408d64171301408d64181301469e65191301469e651a1301408d641b1301469e651c1301469e651d1301469e651e1301165232001401165232011401469e65021401408d64031401408d64041401408d64051401408d64061401408d64071401408d64081401469e65091401469e650a1401469e650b1401408d640c1401408d640d1401469e650e1401469e650f1401408d64101401469e65111401408d64121401408d64131401408d64141401408d64151401408d64161401408d64171401469e65181401469e65191401469e651a1401408d641b1401408d641c1401469e651d1401469e651e1401165232001501165232011501469e65021501469e65031501347e57041501408d64051501469e65061501469e65071501408d64081501469e65091501469e650a1501408d640b1501408d640c1501408d640d1501347e570e1501347e570f1501469e65101501469e65111501469e65121501347e57131501408d64141501469e65151501469e65161501408d64171501469e65181501469e65191501408d641a1501408d641b1501408d641c1501347e571d1501347e571e1501165232001601165232011601469e65021601408d64031601347e57041601347e57051601469e65061601469e65071601408d64081601408d64091601347e570a1601408d640b1601408d640c1601408d640d1601408d640e1601347e570f1601469e65101601469e65111601408d64121601347e57131601347e57141601469e65151601469e65161601408d64171601408d64181601347e57191601408d641a1601408d641b1601408d641c1601408d641d1601347e571e1601165232001701165232011701165232021701408d64031701408d64041701408d64051701408d64061701408d64071701408d64081701408d64091701347e570a1701347e570b1701408d640c1701469e650d1701469e650e1701408d640f1701408d64101701408d64111701408d64121701408d64131701408d64141701408d64151701408d64161701408d64171701408d64181701347e57191701347e571a1701408d641b1701469e651c1701469e651d17011652321e1701165232021801165232031801165232041801408d64051801408d64061801469e65071801469e65081801408d64091801469e650a1801469e650b1801408d640c1801469e650d1801469e650e1801469e650f1801347e57101801347e57111801469e65121801469e65131801408d64141801408d64151801469e65161801469e65171801408d64181801469e65191801469e651a1801408d641b18011652321c1801165232041901165232051901165232061901469e65071901469e65081901408d64091901469e650a1901469e650b1901408d640c1901408d640d1901469e650e1901469e650f1901347e57101901408d64111901469e65121901469e65131901408d64141901469e65151901469e65161901469e65171901408d64181901469e651919011652321a1901165232061a01165232071a01165232081a01408d64091a01408d640a1a01408d640b1a01408d640c1a01408d640d1a01408d640e1a01408d640f1a01408d64101a01408d64111a01408d64121a01408d64131a01408d64141a01469e65151a01469e65161a01408d64171a01165232181a01165232081b01165232091b011652320a1b01347e570b1b01347e570c1b01408d640d1b01408d640e1b01408d640f1b01469e65101b01408d64111b01408d64121b01408d64131b01408d64141b01408d64151b01165232161b011652320a1c011652320b1c011652320c1c01469e650d1c01469e650e1c01408d640f1c01469e65101c01408d64111c01408d64121c01469e65131c01165232141c011652320c1d011652320d1d011652320e1d01469e650f1d01408d64101d01408d64111d01165232121d011652320e1e011652320f1e01165232101e01165232");
    const App$Kaelin$Assets$tile$effect$dark_red2 = VoxBox$parse$("0e0001881c170f0001881c17100001881c170c0101881c170d0101881c170e0101bc524c0f0101bc524c100101c75f56110101881c17120101881c170a0201881c170b0201881c170c0201c75f560d0201c75f560e0201c75f560f0201bc524c100201c75f56110201c75f56120201bc524c130201881c17140201881c17080301881c17090301881c170a0301c75f560b0301bc524c0c0301c75f560d0301c75f560e0301c75f560f0301bc524c100301bc524c110301bc524c120301bc524c130301c75f56140301c75f56150301881c17160301881c17060401881c17070401881c17080401c75f56090401c75f560a0401c75f560b0401bc524c0c0401bc524c0d0401c75f560e0401c75f560f0401bc524c100401c75f56110401bc524c120401bc524c130401bc524c140401bc524c150401bc524c160401bc524c170401881c17180401881c17040501881c17050501881c17060501c75f56070501bc524c080501c75f56090501c75f560a0501bc524c0b0501bc524c0c0501bc524c0d0501ae443e0e0501ae443e0f0501c75f56100501c75f56110501c75f56120501ae443e130501bc524c140501c75f56150501c75f56160501bc524c170501c75f56180501c75f56190501881c171a0501881c17020601881c17030601881c17040601ae443e050601c75f56060601c75f56070601bc524c080601bc524c090601ae443e0a0601bc524c0b0601bc524c0c0601bc524c0d0601bc524c0e0601ae443e0f0601c75f56100601c75f56110601bc524c120601ae443e130601ae443e140601c75f56150601c75f56160601bc524c170601bc524c180601ae443e190601bc524c1a0601bc524c1b0601881c171c0601881c17000701881c17010701881c17020701bc524c030701bc524c040701bc524c050701c75f56060701c75f56070701c75f56080701bc524c090701ae443e0a0701ae443e0b0701bc524c0c0701c75f560d0701c75f560e0701bc524c0f0701bc524c100701bc524c110701bc524c120701bc524c130701bc524c140701bc524c150701bc524c160701bc524c170701bc524c180701ae443e190701ae443e1a0701bc524c1b0701c75f561c0701c75f561d0701881c171e0701881c17000801881c17010801bc524c020801c75f56030801c75f56040801bc524c050801c75f56060801c75f56070801c75f56080801bc524c090801c75f560a0801c75f560b0801bc524c0c0801bc524c0d0801c75f560e0801c75f560f0801ae443e100801bc524c110801c75f56120801c75f56130801bc524c140801c75f56150801c75f56160801c75f56170801bc524c180801bc524c190801bc524c1a0801bc524c1b0801bc524c1c0801c75f561d0801c75f561e0801881c17000901881c17010901bc524c020901bc524c030901c75f56040901bc524c050901bc524c060901c75f56070901bc524c080901bc524c090901c75f560a0901c75f560b0901bc524c0c0901bc524c0d0901c75f560e0901c75f560f0901bc524c100901bc524c110901c75f56120901c75f56130901bc524c140901bc524c150901c75f56160901c75f56170901bc524c180901bc524c190901c75f561a0901c75f561b0901bc524c1c0901bc524c1d0901bc524c1e0901881c17000a01881c17010a01bc524c020a01bc524c030a01ae443e040a01ae443e050a01bc524c060a01bc524c070a01bc524c080a01bc524c090a01bc524c0a0a01c75f560b0a01c75f560c0a01bc524c0d0a01bc524c0e0a01bc524c0f0a01bc524c100a01bc524c110a01bc524c120a01bc524c130a01bc524c140a01ae443e150a01bc524c160a01bc524c170a01bc524c180a01bc524c190a01c75f561a0a01c75f561b0a01c75f561c0a01bc524c1d0a01bc524c1e0a01881c17000b01881c17010b01bc524c020b01c75f56030b01bc524c040b01bc524c050b01c75f56060b01c75f56070b01bc524c080b01bc524c090b01bc524c0a0b01bc524c0b0b01bc524c0c0b01bc524c0d0b01c75f560e0b01bc524c0f0b01bc524c100b01bc524c110b01c75f56120b01bc524c130b01bc524c140b01ae443e150b01c75f56160b01bc524c170b01bc524c180b01bc524c190b01bc524c1a0b01bc524c1b0b01bc524c1c0b01bc524c1d0b01bc524c1e0b01881c17000c01881c17010c01bc524c020c01c75f56030c01bc524c040c01bc524c050c01bc524c060c01bc524c070c01c75f56080c01c75f56090c01bc524c0a0c01ae443e0b0c01ae443e0c0c01bc524c0d0c01c75f560e0c01bc524c0f0c01c75f56100c01bc524c110c01bc524c120c01bc524c130c01bc524c140c01bc524c150c01bc524c160c01c75f56170c01c75f56180c01bc524c190c01ae443e1a0c01ae443e1b0c01bc524c1c0c01bc524c1d0c01bc524c1e0c01881c17000d01881c17010d01bc524c020d01bc524c030d01c75f56040d01c75f56050d01bc524c060d01c75f56070d01c75f56080d01c75f56090d01bc524c0a0d01ae443e0b0d01bc524c0c0d01c75f560d0d01c75f560e0d01bc524c0f0d01c75f56100d01bc524c110d01bc524c120d01c75f56130d01c75f56140d01bc524c150d01c75f56160d01c75f56170d01c75f56180d01bc524c190d01ae443e1a0d01bc524c1b0d01c75f561c0d01c75f561d0d01bc524c1e0d01881c17000e01881c17010e01bc524c020e01c75f56030e01c75f56040e01c75f56050e01bc524c060e01c75f56070e01c75f56080e01bc524c090e01bc524c0a0e01bc524c0b0e01bc524c0c0e01c75f560d0e01c75f560e0e01c75f560f0e01ae443e100e01bc524c110e01c75f56120e01c75f56130e01c75f56140e01bc524c150e01c75f56160e01c75f56170e01bc524c180e01bc524c190e01bc524c1a0e01bc524c1b0e01c75f561c0e01c75f561d0e01c75f561e0e01881c17000f01881c17010f01bc524c020f01c75f56030f01c75f56040f01bc524c050f01bc524c060f01bc524c070f01bc524c080f01bc524c090f01bc524c0a0f01bc524c0b0f01bc524c0c0f01bc524c0d0f01c75f560e0f01c75f560f0f01ae443e100f01ae443e110f01c75f56120f01c75f56130f01bc524c140f01bc524c150f01bc524c160f01bc524c170f01bc524c180f01bc524c190f01bc524c1a0f01bc524c1b0f01bc524c1c0f01c75f561d0f01c75f561e0f01881c17001001881c17011001bc524c021001c75f56031001c75f56041001bc524c051001ae443e061001bc524c071001c75f56081001c75f56091001c75f560a1001bc524c0b1001c75f560c1001c75f560d1001bc524c0e1001bc524c0f1001c75f56101001bc524c111001c75f56121001c75f56131001bc524c141001ae443e151001bc524c161001c75f56171001c75f56181001c75f56191001bc524c1a1001c75f561b1001c75f561c1001bc524c1d1001bc524c1e1001881c17001101881c17011101c75f56021101c75f56031101c75f56041101bc524c051101bc524c061101bc524c071101c75f56081101c75f56091101bc524c0a1101bc524c0b1101bc524c0c1101bc524c0d1101bc524c0e1101bc524c0f1101bc524c101101c75f56111101c75f56121101c75f56131101bc524c141101bc524c151101bc524c161101c75f56171101c75f56181101bc524c191101bc524c1a1101bc524c1b1101bc524c1c1101bc524c1d1101bc524c1e1101881c17001201881c17011201c75f56021201c75f56031201bc524c041201c75f56051201c75f56061201bc524c071201bc524c081201bc524c091201bc524c0a1201bc524c0b1201bc524c0c1201c75f560d1201c75f560e1201c75f560f1201bc524c101201c75f56111201c75f56121201bc524c131201c75f56141201c75f56151201bc524c161201bc524c171201bc524c181201bc524c191201bc524c1a1201bc524c1b1201c75f561c1201c75f561d1201c75f561e1201881c17001301881c17011301bc524c021301bc524c031301bc524c041301c75f56051301c75f56061301bc524c071301bc524c081301bc524c091301c75f560a1301c75f560b1301bc524c0c1301c75f560d1301c75f560e1301c75f560f1301bc524c101301bc524c111301bc524c121301bc524c131301c75f56141301c75f56151301bc524c161301bc524c171301bc524c181301c75f56191301c75f561a1301bc524c1b1301c75f561c1301c75f561d1301c75f561e1301881c17001401881c17011401c75f56021401bc524c031401bc524c041401bc524c051401bc524c061401bc524c071401bc524c081401c75f56091401c75f560a1401c75f560b1401bc524c0c1401bc524c0d1401c75f560e1401c75f560f1401bc524c101401c75f56111401bc524c121401bc524c131401bc524c141401bc524c151401bc524c161401bc524c171401c75f56181401c75f56191401c75f561a1401bc524c1b1401bc524c1c1401c75f561d1401c75f561e1401881c17001501881c17011501c75f56021501c75f56031501ae443e041501bc524c051501c75f56061501c75f56071501bc524c081501c75f56091501c75f560a1501bc524c0b1501bc524c0c1501bc524c0d1501ae443e0e1501ae443e0f1501c75f56101501c75f56111501c75f56121501ae443e131501bc524c141501c75f56151501c75f56161501bc524c171501c75f56181501c75f56191501bc524c1a1501bc524c1b1501bc524c1c1501ae443e1d1501ae443e1e1501881c17001601881c17011601c75f56021601bc524c031601ae443e041601ae443e051601c75f56061601c75f56071601bc524c081601bc524c091601ae443e0a1601bc524c0b1601bc524c0c1601bc524c0d1601bc524c0e1601ae443e0f1601c75f56101601c75f56111601bc524c121601ae443e131601ae443e141601c75f56151601c75f56161601bc524c171601bc524c181601ae443e191601bc524c1a1601bc524c1b1601bc524c1c1601bc524c1d1601ae443e1e1601881c17001701881c17011701881c17021701bc524c031701bc524c041701bc524c051701bc524c061701bc524c071701bc524c081701bc524c091701ae443e0a1701ae443e0b1701bc524c0c1701c75f560d1701c75f560e1701bc524c0f1701bc524c101701bc524c111701bc524c121701bc524c131701bc524c141701bc524c151701bc524c161701bc524c171701bc524c181701ae443e191701ae443e1a1701bc524c1b1701c75f561c1701c75f561d1701881c171e1701881c17021801881c17031801881c17041801bc524c051801bc524c061801c75f56071801c75f56081801bc524c091801c75f560a1801c75f560b1801bc524c0c1801c75f560d1801c75f560e1801c75f560f1801ae443e101801ae443e111801c75f56121801c75f56131801bc524c141801bc524c151801c75f56161801c75f56171801bc524c181801c75f56191801c75f561a1801bc524c1b1801881c171c1801881c17041901881c17051901881c17061901c75f56071901c75f56081901bc524c091901c75f560a1901c75f560b1901bc524c0c1901bc524c0d1901c75f560e1901c75f560f1901ae443e101901bc524c111901c75f56121901c75f56131901bc524c141901c75f56151901c75f56161901c75f56171901bc524c181901c75f56191901881c171a1901881c17061a01881c17071a01881c17081a01bc524c091a01bc524c0a1a01bc524c0b1a01bc524c0c1a01bc524c0d1a01bc524c0e1a01bc524c0f1a01bc524c101a01bc524c111a01bc524c121a01bc524c131a01bc524c141a01c75f56151a01c75f56161a01bc524c171a01881c17181a01881c17081b01881c17091b01881c170a1b01ae443e0b1b01ae443e0c1b01bc524c0d1b01bc524c0e1b01bc524c0f1b01c75f56101b01bc524c111b01bc524c121b01bc524c131b01bc524c141b01bc524c151b01881c17161b01881c170a1c01881c170b1c01881c170c1c01c75f560d1c01c75f560e1c01bc524c0f1c01c75f56101c01bc524c111c01bc524c121c01c75f56131c01881c17141c01881c170c1d01881c170d1d01881c170e1d01c75f560f1d01bc524c101d01bc524c111d01881c17121d01881c170e1e01881c170f1e01881c17101e01881c17");
    const App$Kaelin$Assets$tile$effect$light_red2 = VoxBox$parse$("0e0001652b270f0001652b27100001652b270c0101652b270d0101652b270e010199615b0f010199615b100101a46e65110101652b27120101652b270a0201652b270b0201652b270c0201a46e650d0201a46e650e0201a46e650f020199615b100201a46e65110201a46e6512020199615b130201652b27140201652b27080301652b27090301652b270a0301a46e650b030199615b0c0301a46e650d0301a46e650e0301a46e650f030199615b10030199615b11030199615b12030199615b130301a46e65140301a46e65150301652b27160301652b27060401652b27070401652b27080401a46e65090401a46e650a0401a46e650b040199615b0c040199615b0d0401a46e650e0401a46e650f040199615b100401a46e6511040199615b12040199615b13040199615b14040199615b15040199615b16040199615b170401652b27180401652b27040501652b27050501652b27060501a46e6507050199615b080501a46e65090501a46e650a050199615b0b050199615b0c050199615b0d05018b534d0e05018b534d0f0501a46e65100501a46e65110501a46e651205018b534d13050199615b140501a46e65150501a46e6516050199615b170501a46e65180501a46e65190501652b271a0501652b27020601652b27030601652b270406018b534d050601a46e65060601a46e6507060199615b08060199615b0906018b534d0a060199615b0b060199615b0c060199615b0d060199615b0e06018b534d0f0601a46e65100601a46e6511060199615b1206018b534d1306018b534d140601a46e65150601a46e6516060199615b17060199615b1806018b534d19060199615b1a060199615b1b0601652b271c0601652b27000701652b27010701652b2702070199615b03070199615b04070199615b050701a46e65060701a46e65070701a46e6508070199615b0907018b534d0a07018b534d0b070199615b0c0701a46e650d0701a46e650e070199615b0f070199615b10070199615b11070199615b12070199615b13070199615b14070199615b15070199615b16070199615b17070199615b1807018b534d1907018b534d1a070199615b1b0701a46e651c0701a46e651d0701652b271e0701652b27000801652b2701080199615b020801a46e65030801a46e6504080199615b050801a46e65060801a46e65070801a46e6508080199615b090801a46e650a0801a46e650b080199615b0c080199615b0d0801a46e650e0801a46e650f08018b534d10080199615b110801a46e65120801a46e6513080199615b140801a46e65150801a46e65160801a46e6517080199615b18080199615b19080199615b1a080199615b1b080199615b1c0801a46e651d0801a46e651e0801652b27000901652b2701090199615b02090199615b030901a46e6504090199615b05090199615b060901a46e6507090199615b08090199615b090901a46e650a0901a46e650b090199615b0c090199615b0d0901a46e650e0901a46e650f090199615b10090199615b110901a46e65120901a46e6513090199615b14090199615b150901a46e65160901a46e6517090199615b18090199615b190901a46e651a0901a46e651b090199615b1c090199615b1d090199615b1e0901652b27000a01652b27010a0199615b020a0199615b030a018b534d040a018b534d050a0199615b060a0199615b070a0199615b080a0199615b090a0199615b0a0a01a46e650b0a01a46e650c0a0199615b0d0a0199615b0e0a0199615b0f0a0199615b100a0199615b110a0199615b120a0199615b130a0199615b140a018b534d150a0199615b160a0199615b170a0199615b180a0199615b190a01a46e651a0a01a46e651b0a01a46e651c0a0199615b1d0a0199615b1e0a01652b27000b01652b27010b0199615b020b01a46e65030b0199615b040b0199615b050b01a46e65060b01a46e65070b0199615b080b0199615b090b0199615b0a0b0199615b0b0b0199615b0c0b0199615b0d0b01a46e650e0b0199615b0f0b0199615b100b0199615b110b01a46e65120b0199615b130b0199615b140b018b534d150b01a46e65160b0199615b170b0199615b180b0199615b190b0199615b1a0b0199615b1b0b0199615b1c0b0199615b1d0b0199615b1e0b01652b27000c01652b27010c0199615b020c01a46e65030c0199615b040c0199615b050c0199615b060c0199615b070c01a46e65080c01a46e65090c0199615b0a0c018b534d0b0c018b534d0c0c0199615b0d0c01a46e650e0c0199615b0f0c01a46e65100c0199615b110c0199615b120c0199615b130c0199615b140c0199615b150c0199615b160c01a46e65170c01a46e65180c0199615b190c018b534d1a0c018b534d1b0c0199615b1c0c0199615b1d0c0199615b1e0c01652b27000d01652b27010d0199615b020d0199615b030d01a46e65040d01a46e65050d0199615b060d01a46e65070d01a46e65080d01a46e65090d0199615b0a0d018b534d0b0d0199615b0c0d01a46e650d0d01a46e650e0d0199615b0f0d01a46e65100d0199615b110d0199615b120d01a46e65130d01a46e65140d0199615b150d01a46e65160d01a46e65170d01a46e65180d0199615b190d018b534d1a0d0199615b1b0d01a46e651c0d01a46e651d0d0199615b1e0d01652b27000e01652b27010e0199615b020e01a46e65030e01a46e65040e01a46e65050e0199615b060e01a46e65070e01a46e65080e0199615b090e0199615b0a0e0199615b0b0e0199615b0c0e01a46e650d0e01a46e650e0e01a46e650f0e018b534d100e0199615b110e01a46e65120e01a46e65130e01a46e65140e0199615b150e01a46e65160e01a46e65170e0199615b180e0199615b190e0199615b1a0e0199615b1b0e01a46e651c0e01a46e651d0e01a46e651e0e01652b27000f01652b27010f0199615b020f01a46e65030f01a46e65040f0199615b050f0199615b060f0199615b070f0199615b080f0199615b090f0199615b0a0f0199615b0b0f0199615b0c0f0199615b0d0f01a46e650e0f01a46e650f0f018b534d100f018b534d110f01a46e65120f01a46e65130f0199615b140f0199615b150f0199615b160f0199615b170f0199615b180f0199615b190f0199615b1a0f0199615b1b0f0199615b1c0f01a46e651d0f01a46e651e0f01652b27001001652b2701100199615b021001a46e65031001a46e6504100199615b0510018b534d06100199615b071001a46e65081001a46e65091001a46e650a100199615b0b1001a46e650c1001a46e650d100199615b0e100199615b0f1001a46e6510100199615b111001a46e65121001a46e6513100199615b1410018b534d15100199615b161001a46e65171001a46e65181001a46e6519100199615b1a1001a46e651b1001a46e651c100199615b1d100199615b1e1001652b27001101652b27011101a46e65021101a46e65031101a46e6504110199615b05110199615b06110199615b071101a46e65081101a46e6509110199615b0a110199615b0b110199615b0c110199615b0d110199615b0e110199615b0f110199615b101101a46e65111101a46e65121101a46e6513110199615b14110199615b15110199615b161101a46e65171101a46e6518110199615b19110199615b1a110199615b1b110199615b1c110199615b1d110199615b1e1101652b27001201652b27011201a46e65021201a46e6503120199615b041201a46e65051201a46e6506120199615b07120199615b08120199615b09120199615b0a120199615b0b120199615b0c1201a46e650d1201a46e650e1201a46e650f120199615b101201a46e65111201a46e6512120199615b131201a46e65141201a46e6515120199615b16120199615b17120199615b18120199615b19120199615b1a120199615b1b1201a46e651c1201a46e651d1201a46e651e1201652b27001301652b2701130199615b02130199615b03130199615b041301a46e65051301a46e6506130199615b07130199615b08130199615b091301a46e650a1301a46e650b130199615b0c1301a46e650d1301a46e650e1301a46e650f130199615b10130199615b11130199615b12130199615b131301a46e65141301a46e6515130199615b16130199615b17130199615b181301a46e65191301a46e651a130199615b1b1301a46e651c1301a46e651d1301a46e651e1301652b27001401652b27011401a46e6502140199615b03140199615b04140199615b05140199615b06140199615b07140199615b081401a46e65091401a46e650a1401a46e650b140199615b0c140199615b0d1401a46e650e1401a46e650f140199615b101401a46e6511140199615b12140199615b13140199615b14140199615b15140199615b16140199615b171401a46e65181401a46e65191401a46e651a140199615b1b140199615b1c1401a46e651d1401a46e651e1401652b27001501652b27011501a46e65021501a46e650315018b534d04150199615b051501a46e65061501a46e6507150199615b081501a46e65091501a46e650a150199615b0b150199615b0c150199615b0d15018b534d0e15018b534d0f1501a46e65101501a46e65111501a46e651215018b534d13150199615b141501a46e65151501a46e6516150199615b171501a46e65181501a46e6519150199615b1a150199615b1b150199615b1c15018b534d1d15018b534d1e1501652b27001601652b27011601a46e6502160199615b0316018b534d0416018b534d051601a46e65061601a46e6507160199615b08160199615b0916018b534d0a160199615b0b160199615b0c160199615b0d160199615b0e16018b534d0f1601a46e65101601a46e6511160199615b1216018b534d1316018b534d141601a46e65151601a46e6516160199615b17160199615b1816018b534d19160199615b1a160199615b1b160199615b1c160199615b1d16018b534d1e1601652b27001701652b27011701652b2702170199615b03170199615b04170199615b05170199615b06170199615b07170199615b08170199615b0917018b534d0a17018b534d0b170199615b0c1701a46e650d1701a46e650e170199615b0f170199615b10170199615b11170199615b12170199615b13170199615b14170199615b15170199615b16170199615b17170199615b1817018b534d1917018b534d1a170199615b1b1701a46e651c1701a46e651d1701652b271e1701652b27021801652b27031801652b2704180199615b05180199615b061801a46e65071801a46e6508180199615b091801a46e650a1801a46e650b180199615b0c1801a46e650d1801a46e650e1801a46e650f18018b534d1018018b534d111801a46e65121801a46e6513180199615b14180199615b151801a46e65161801a46e6517180199615b181801a46e65191801a46e651a180199615b1b1801652b271c1801652b27041901652b27051901652b27061901a46e65071901a46e6508190199615b091901a46e650a1901a46e650b190199615b0c190199615b0d1901a46e650e1901a46e650f19018b534d10190199615b111901a46e65121901a46e6513190199615b141901a46e65151901a46e65161901a46e6517190199615b181901a46e65191901652b271a1901652b27061a01652b27071a01652b27081a0199615b091a0199615b0a1a0199615b0b1a0199615b0c1a0199615b0d1a0199615b0e1a0199615b0f1a0199615b101a0199615b111a0199615b121a0199615b131a0199615b141a01a46e65151a01a46e65161a0199615b171a01652b27181a01652b27081b01652b27091b01652b270a1b018b534d0b1b018b534d0c1b0199615b0d1b0199615b0e1b0199615b0f1b01a46e65101b0199615b111b0199615b121b0199615b131b0199615b141b0199615b151b01652b27161b01652b270a1c01652b270b1c01652b270c1c01a46e650d1c01a46e650e1c0199615b0f1c01a46e65101c0199615b111c0199615b121c01a46e65131c01652b27141c01652b270c1d01652b270d1d01652b270e1d01a46e650f1d0199615b101d0199615b111d01652b27121d01652b270e1e01652b270f1e01652b27101e01652b27");
    const App$Kaelin$Assets$tile$effect$dark_blue2 = VoxBox$parse$("0e00011b3d920f00011b3d921000011b3d920c01011b3d920d01011b3d920e01014c74c50f01014c74c51001015783c51101011b3d921201011b3d920a02011b3d920b02011b3d920c02015783c50d02015783c50e02015783c50f02014c74c51002015783c51102015783c51202014c74c51302011b3d921402011b3d920803011b3d920903011b3d920a03015783c50b03014c74c50c03015783c50d03015783c50e03015783c50f03014c74c51003014c74c51103014c74c51203014c74c51303015783c51403015783c51503011b3d921603011b3d920604011b3d920704011b3d920804015783c50904015783c50a04015783c50b04014c74c50c04014c74c50d04015783c50e04015783c50f04014c74c51004015783c51104014c74c51204014c74c51304014c74c51404014c74c51504014c74c51604014c74c51704011b3d921804011b3d920405011b3d920505011b3d920605015783c50705014c74c50805015783c50905015783c50a05014c74c50b05014c74c50c05014c74c50d05013e66b80e05013e66b80f05015783c51005015783c51105015783c51205013e66b81305014c74c51405015783c51505015783c51605014c74c51705015783c51805015783c51905011b3d921a05011b3d920206011b3d920306011b3d920406013e66b80506015783c50606015783c50706014c74c50806014c74c50906013e66b80a06014c74c50b06014c74c50c06014c74c50d06014c74c50e06013e66b80f06015783c51006015783c51106014c74c51206013e66b81306013e66b81406015783c51506015783c51606014c74c51706014c74c51806013e66b81906014c74c51a06014c74c51b06011b3d921c06011b3d920007011b3d920107011b3d920207014c74c50307014c74c50407014c74c50507015783c50607015783c50707015783c50807014c74c50907013e66b80a07013e66b80b07014c74c50c07015783c50d07015783c50e07014c74c50f07014c74c51007014c74c51107014c74c51207014c74c51307014c74c51407014c74c51507014c74c51607014c74c51707014c74c51807013e66b81907013e66b81a07014c74c51b07015783c51c07015783c51d07011b3d921e07011b3d920008011b3d920108014c74c50208015783c50308015783c50408014c74c50508015783c50608015783c50708015783c50808014c74c50908015783c50a08015783c50b08014c74c50c08014c74c50d08015783c50e08015783c50f08013e66b81008014c74c51108015783c51208015783c51308014c74c51408015783c51508015783c51608015783c51708014c74c51808014c74c51908014c74c51a08014c74c51b08014c74c51c08015783c51d08015783c51e08011b3d920009011b3d920109014c74c50209014c74c50309015783c50409014c74c50509014c74c50609015783c50709014c74c50809014c74c50909015783c50a09015783c50b09014c74c50c09014c74c50d09015783c50e09015783c50f09014c74c51009014c74c51109015783c51209015783c51309014c74c51409014c74c51509015783c51609015783c51709014c74c51809014c74c51909015783c51a09015783c51b09014c74c51c09014c74c51d09014c74c51e09011b3d92000a011b3d92010a014c74c5020a014c74c5030a013e66b8040a013e66b8050a014c74c5060a014c74c5070a014c74c5080a014c74c5090a014c74c50a0a015783c50b0a015783c50c0a014c74c50d0a014c74c50e0a014c74c50f0a014c74c5100a014c74c5110a014c74c5120a014c74c5130a014c74c5140a013e66b8150a014c74c5160a014c74c5170a014c74c5180a014c74c5190a015783c51a0a015783c51b0a015783c51c0a014c74c51d0a014c74c51e0a011b3d92000b011b3d92010b014c74c5020b015783c5030b014c74c5040b014c74c5050b015783c5060b015783c5070b014c74c5080b014c74c5090b014c74c50a0b014c74c50b0b014c74c50c0b014c74c50d0b015783c50e0b014c74c50f0b014c74c5100b014c74c5110b015783c5120b014c74c5130b014c74c5140b013e66b8150b015783c5160b014c74c5170b014c74c5180b014c74c5190b014c74c51a0b014c74c51b0b014c74c51c0b014c74c51d0b014c74c51e0b011b3d92000c011b3d92010c014c74c5020c015783c5030c014c74c5040c014c74c5050c014c74c5060c014c74c5070c015783c5080c015783c5090c014c74c50a0c013e66b80b0c013e66b80c0c014c74c50d0c015783c50e0c014c74c50f0c015783c5100c014c74c5110c014c74c5120c014c74c5130c014c74c5140c014c74c5150c014c74c5160c015783c5170c015783c5180c014c74c5190c013e66b81a0c013e66b81b0c014c74c51c0c014c74c51d0c014c74c51e0c011b3d92000d011b3d92010d014c74c5020d014c74c5030d015783c5040d015783c5050d014c74c5060d015783c5070d015783c5080d015783c5090d014c74c50a0d013e66b80b0d014c74c50c0d015783c50d0d015783c50e0d014c74c50f0d015783c5100d014c74c5110d014c74c5120d015783c5130d015783c5140d014c74c5150d015783c5160d015783c5170d015783c5180d014c74c5190d013e66b81a0d014c74c51b0d015783c51c0d015783c51d0d014c74c51e0d011b3d92000e011b3d92010e014c74c5020e015783c5030e015783c5040e015783c5050e014c74c5060e015783c5070e015783c5080e014c74c5090e014c74c50a0e014c74c50b0e014c74c50c0e015783c50d0e015783c50e0e015783c50f0e013e66b8100e014c74c5110e015783c5120e015783c5130e015783c5140e014c74c5150e015783c5160e015783c5170e014c74c5180e014c74c5190e014c74c51a0e014c74c51b0e015783c51c0e015783c51d0e015783c51e0e011b3d92000f011b3d92010f014c74c5020f015783c5030f015783c5040f014c74c5050f014c74c5060f014c74c5070f014c74c5080f014c74c5090f014c74c50a0f014c74c50b0f014c74c50c0f014c74c50d0f015783c50e0f015783c50f0f013e66b8100f013e66b8110f015783c5120f015783c5130f014c74c5140f014c74c5150f014c74c5160f014c74c5170f014c74c5180f014c74c5190f014c74c51a0f014c74c51b0f014c74c51c0f015783c51d0f015783c51e0f011b3d920010011b3d920110014c74c50210015783c50310015783c50410014c74c50510013e66b80610014c74c50710015783c50810015783c50910015783c50a10014c74c50b10015783c50c10015783c50d10014c74c50e10014c74c50f10015783c51010014c74c51110015783c51210015783c51310014c74c51410013e66b81510014c74c51610015783c51710015783c51810015783c51910014c74c51a10015783c51b10015783c51c10014c74c51d10014c74c51e10011b3d920011011b3d920111015783c50211015783c50311015783c50411014c74c50511014c74c50611014c74c50711015783c50811015783c50911014c74c50a11014c74c50b11014c74c50c11014c74c50d11014c74c50e11014c74c50f11014c74c51011015783c51111015783c51211015783c51311014c74c51411014c74c51511014c74c51611015783c51711015783c51811014c74c51911014c74c51a11014c74c51b11014c74c51c11014c74c51d11014c74c51e11011b3d920012011b3d920112015783c50212015783c50312014c74c50412015783c50512015783c50612014c74c50712014c74c50812014c74c50912014c74c50a12014c74c50b12014c74c50c12015783c50d12015783c50e12015783c50f12014c74c51012015783c51112015783c51212014c74c51312015783c51412015783c51512014c74c51612014c74c51712014c74c51812014c74c51912014c74c51a12014c74c51b12015783c51c12015783c51d12015783c51e12011b3d920013011b3d920113014c74c50213014c74c50313014c74c50413015783c50513015783c50613014c74c50713014c74c50813014c74c50913015783c50a13015783c50b13014c74c50c13015783c50d13015783c50e13015783c50f13014c74c51013014c74c51113014c74c51213014c74c51313015783c51413015783c51513014c74c51613014c74c51713014c74c51813015783c51913015783c51a13014c74c51b13015783c51c13015783c51d13015783c51e13011b3d920014011b3d920114015783c50214014c74c50314014c74c50414014c74c50514014c74c50614014c74c50714014c74c50814015783c50914015783c50a14015783c50b14014c74c50c14014c74c50d14015783c50e14015783c50f14014c74c51014015783c51114014c74c51214014c74c51314014c74c51414014c74c51514014c74c51614014c74c51714015783c51814015783c51914015783c51a14014c74c51b14014c74c51c14015783c51d14015783c51e14011b3d920015011b3d920115015783c50215015783c50315013e66b80415014c74c50515015783c50615015783c50715014c74c50815015783c50915015783c50a15014c74c50b15014c74c50c15014c74c50d15013e66b80e15013e66b80f15015783c51015015783c51115015783c51215013e66b81315014c74c51415015783c51515015783c51615014c74c51715015783c51815015783c51915014c74c51a15014c74c51b15014c74c51c15013e66b81d15013e66b81e15011b3d920016011b3d920116015783c50216014c74c50316013e66b80416013e66b80516015783c50616015783c50716014c74c50816014c74c50916013e66b80a16014c74c50b16014c74c50c16014c74c50d16014c74c50e16013e66b80f16015783c51016015783c51116014c74c51216013e66b81316013e66b81416015783c51516015783c51616014c74c51716014c74c51816013e66b81916014c74c51a16014c74c51b16014c74c51c16014c74c51d16013e66b81e16011b3d920017011b3d920117011b3d920217014c74c50317014c74c50417014c74c50517014c74c50617014c74c50717014c74c50817014c74c50917013e66b80a17013e66b80b17014c74c50c17015783c50d17015783c50e17014c74c50f17014c74c51017014c74c51117014c74c51217014c74c51317014c74c51417014c74c51517014c74c51617014c74c51717014c74c51817013e66b81917013e66b81a17014c74c51b17015783c51c17015783c51d17011b3d921e17011b3d920218011b3d920318011b3d920418014c74c50518014c74c50618015783c50718015783c50818014c74c50918015783c50a18015783c50b18014c74c50c18015783c50d18015783c50e18015783c50f18013e66b81018013e66b81118015783c51218015783c51318014c74c51418014c74c51518015783c51618015783c51718014c74c51818015783c51918015783c51a18014c74c51b18011b3d921c18011b3d920419011b3d920519011b3d920619015783c50719015783c50819014c74c50919015783c50a19015783c50b19014c74c50c19014c74c50d19015783c50e19015783c50f19013e66b81019014c74c51119015783c51219015783c51319014c74c51419015783c51519015783c51619015783c51719014c74c51819015783c51919011b3d921a19011b3d92061a011b3d92071a011b3d92081a014c74c5091a014c74c50a1a014c74c50b1a014c74c50c1a014c74c50d1a014c74c50e1a014c74c50f1a014c74c5101a014c74c5111a014c74c5121a014c74c5131a014c74c5141a015783c5151a015783c5161a014c74c5171a011b3d92181a011b3d92081b011b3d92091b011b3d920a1b013e66b80b1b013e66b80c1b014c74c50d1b014c74c50e1b014c74c50f1b015783c5101b014c74c5111b014c74c5121b014c74c5131b014c74c5141b014c74c5151b011b3d92161b011b3d920a1c011b3d920b1c011b3d920c1c015783c50d1c015783c50e1c014c74c50f1c015783c5101c014c74c5111c014c74c5121c015783c5131c011b3d92141c011b3d920c1d011b3d920d1d011b3d920e1d015783c50f1d014c74c5101d014c74c5111d011b3d92121d011b3d920e1e011b3d920f1e011b3d92101e011b3d92");
    function App$Kaelin$Resources$terrains$(_indicator$1) {
        var self = _indicator$1;
        switch (self._) {
          case "App.Kaelin.Indicator.green":
            var $874 = App$Kaelin$Assets$tile$green_2;
            var $873 = $874;
            break;

          case "App.Kaelin.Indicator.red":
            var $875 = App$Kaelin$Assets$tile$effect$dark_red2;
            var $873 = $875;
            break;

          case "App.Kaelin.Indicator.yellow":
            var $876 = App$Kaelin$Assets$tile$effect$light_red2;
            var $873 = $876;
            break;

          case "App.Kaelin.Indicator.blue":
            var $877 = App$Kaelin$Assets$tile$effect$dark_blue2;
            var $873 = $877;
            break;
        }
        return $873;
    }
    const App$Kaelin$Resources$terrains = x0 => App$Kaelin$Resources$terrains$(x0);
    function App$Kaelin$Terrain$new$(_draw$1) {
        var $878 = {
            _: "App.Kaelin.Terrain.new",
            draw: _draw$1
        };
        return $878;
    }
    const App$Kaelin$Terrain$new = x0 => App$Kaelin$Terrain$new$(x0);
    function App$Kaelin$Map$Entity$background$(_value$1) {
        var $879 = {
            _: "App.Kaelin.Map.Entity.background",
            value: _value$1
        };
        return $879;
    }
    const App$Kaelin$Map$Entity$background = x0 => App$Kaelin$Map$Entity$background$(x0);
    const App$Kaelin$Map$arena = (() => {
        var _map$1 = NatMap$new;
        var _map_size$2 = App$Kaelin$Constants$map_size;
        var _width$3 = (_map_size$2 * 2 >>> 0) + 1 >>> 0;
        var _height$4 = (_map_size$2 * 2 >>> 0) + 1 >>> 0;
        var _terrain_img$5 = App$Kaelin$Resources$terrains;
        var _new_terrain$6 = App$Kaelin$Terrain$new$(_terrain_img$5);
        var _new_terrain$7 = App$Kaelin$Map$Entity$background$(_new_terrain$6);
        var _map$8 = (() => {
            var $881 = _map$1;
            var $882 = 0;
            var $883 = _height$4;
            let _map$9 = $881;
            for (let _j$8 = $882; _j$8 < $883; ++_j$8) {
                var _map$10 = (() => {
                    var $884 = _map$9;
                    var $885 = 0;
                    var $886 = _width$3;
                    let _map$11 = $884;
                    for (let _i$10 = $885; _i$10 < $886; ++_i$10) {
                        var _coord_i$12 = U32$to_i32$(_i$10) - U32$to_i32$(_map_size$2) >> 0;
                        var _coord_j$13 = U32$to_i32$(_j$8) - U32$to_i32$(_map_size$2) >> 0;
                        var _coord$14 = App$Kaelin$Coord$new$(_coord_i$12, _coord_j$13);
                        var _fit$15 = App$Kaelin$Coord$fit$(_coord$14, _map_size$2);
                        var self = _fit$15;
                        if (self) {
                            var $887 = App$Kaelin$Map$push$(_coord$14, _new_terrain$7, _map$11);
                            var $884 = $887;
                        } else {
                            var $888 = _map$11;
                            var $884 = $888;
                        }
                        _map$11 = $884;
                    }
                    return _map$11;
                })();
                var $881 = _map$10;
                _map$9 = $881;
            }
            return _map$9;
        })();
        var $880 = _map$8;
        return $880;
    })();
    function App$EnvInfo$new$(_screen_size$1, _mouse_pos$2) {
        var $889 = {
            _: "App.EnvInfo.new",
            screen_size: _screen_size$1,
            mouse_pos: _mouse_pos$2
        };
        return $889;
    }
    const App$EnvInfo$new = x0 => x1 => App$EnvInfo$new$(x0, x1);
    function App$Kaelin$Internal$new$(_tick$1, _frame$2, _timer$3) {
        var $890 = {
            _: "App.Kaelin.Internal.new",
            tick: _tick$1,
            frame: _frame$2,
            timer: _timer$3
        };
        return $890;
    }
    const App$Kaelin$Internal$new = x0 => x1 => x2 => App$Kaelin$Internal$new$(x0, x1, x2);
    const Map$new = BitsMap$new;
    function Parser$State$new$(_err$1, _nam$2, _ini$3, _idx$4, _str$5) {
        var $891 = {
            _: "Parser.State.new",
            err: _err$1,
            nam: _nam$2,
            ini: _ini$3,
            idx: _idx$4,
            str: _str$5
        };
        return $891;
    }
    const Parser$State$new = x0 => x1 => x2 => x3 => x4 => Parser$State$new$(x0, x1, x2, x3, x4);
    function Parser$run$(_parser$2, _code$3) {
        var self = _parser$2(Parser$State$new$(Maybe$none, "", 0n, 0n, _code$3));
        switch (self._) {
          case "Parser.Reply.value":
            var $893 = self.val;
            var $894 = Maybe$some$($893);
            var $892 = $894;
            break;

          case "Parser.Reply.error":
            var $895 = Maybe$none;
            var $892 = $895;
            break;
        }
        return $892;
    }
    const Parser$run = x0 => x1 => Parser$run$(x0, x1);
    function Parser$Reply$(_V$1) {
        var $896 = null;
        return $896;
    }
    const Parser$Reply = x0 => Parser$Reply$(x0);
    function Parser$Reply$error$(_err$2) {
        var $897 = {
            _: "Parser.Reply.error",
            err: _err$2
        };
        return $897;
    }
    const Parser$Reply$error = x0 => Parser$Reply$error$(x0);
    function Parser$Error$new$(_nam$1, _ini$2, _idx$3, _msg$4) {
        var $898 = {
            _: "Parser.Error.new",
            nam: _nam$1,
            ini: _ini$2,
            idx: _idx$3,
            msg: _msg$4
        };
        return $898;
    }
    const Parser$Error$new = x0 => x1 => x2 => x3 => Parser$Error$new$(x0, x1, x2, x3);
    function Parser$Reply$fail$(_nam$2, _ini$3, _idx$4, _msg$5) {
        var $899 = Parser$Reply$error$(Parser$Error$new$(_nam$2, _ini$3, _idx$4, _msg$5));
        return $899;
    }
    const Parser$Reply$fail = x0 => x1 => x2 => x3 => Parser$Reply$fail$(x0, x1, x2, x3);
    const Nat$gtn = a0 => a1 => a0 > a1;
    function Parser$Error$combine$(_a$1, _b$2) {
        var self = _a$1;
        switch (self._) {
          case "Parser.Error.new":
            var $901 = self.idx;
            var self = _b$2;
            switch (self._) {
              case "Parser.Error.new":
                var $903 = self.idx;
                var self = $901 > $903;
                if (self) {
                    var $905 = _a$1;
                    var $904 = $905;
                } else {
                    var $906 = _b$2;
                    var $904 = $906;
                }
                ;
                var $902 = $904;
                break;
            }
            ;
            var $900 = $902;
            break;
        }
        return $900;
    }
    const Parser$Error$combine = x0 => x1 => Parser$Error$combine$(x0, x1);
    function Parser$Error$maybe_combine$(_a$1, _b$2) {
        var self = _a$1;
        switch (self._) {
          case "Maybe.some":
            var $908 = self.value;
            var self = _b$2;
            switch (self._) {
              case "Maybe.some":
                var $910 = self.value;
                var $911 = Maybe$some$(Parser$Error$combine$($908, $910));
                var $909 = $911;
                break;

              case "Maybe.none":
                var $912 = _a$1;
                var $909 = $912;
                break;
            }
            ;
            var $907 = $909;
            break;

          case "Maybe.none":
            var self = _b$2;
            switch (self._) {
              case "Maybe.none":
                var $914 = Maybe$none;
                var $913 = $914;
                break;

              case "Maybe.some":
                var $915 = _b$2;
                var $913 = $915;
                break;
            }
            ;
            var $907 = $913;
            break;
        }
        return $907;
    }
    const Parser$Error$maybe_combine = x0 => x1 => Parser$Error$maybe_combine$(x0, x1);
    function Parser$Reply$value$(_pst$2, _val$3) {
        var $916 = {
            _: "Parser.Reply.value",
            pst: _pst$2,
            val: _val$3
        };
        return $916;
    }
    const Parser$Reply$value = x0 => x1 => Parser$Reply$value$(x0, x1);
    function Parser$first_of$go$(_pars$2, _pst$3) {
        var Parser$first_of$go$ = (_pars$2, _pst$3) => ({
            ctr: "TCO",
            arg: [ _pars$2, _pst$3 ]
        });
        var Parser$first_of$go = _pars$2 => _pst$3 => Parser$first_of$go$(_pars$2, _pst$3);
        var arg = [ _pars$2, _pst$3 ];
        while (true) {
            let [ _pars$2, _pst$3 ] = arg;
            var R = (() => {
                var self = _pst$3;
                switch (self._) {
                  case "Parser.State.new":
                    var $917 = self.err;
                    var $918 = self.nam;
                    var $919 = self.ini;
                    var $920 = self.idx;
                    var $921 = self.str;
                    var self = _pars$2;
                    switch (self._) {
                      case "List.cons":
                        var $923 = self.head;
                        var $924 = self.tail;
                        var _parsed$11 = $923(_pst$3);
                        var self = _parsed$11;
                        switch (self._) {
                          case "Parser.Reply.error":
                            var $926 = self.err;
                            var _cur_err$13 = Maybe$some$($926);
                            var _far_err$14 = Parser$Error$maybe_combine$($917, _cur_err$13);
                            var _new_pst$15 = Parser$State$new$(_far_err$14, $918, $919, $920, $921);
                            var $927 = Parser$first_of$go$($924, _new_pst$15);
                            var $925 = $927;
                            break;

                          case "Parser.Reply.value":
                            var $928 = self.pst;
                            var $929 = self.val;
                            var $930 = Parser$Reply$value$($928, $929);
                            var $925 = $930;
                            break;
                        }
                        ;
                        var $922 = $925;
                        break;

                      case "List.nil":
                        var self = $917;
                        switch (self._) {
                          case "Maybe.some":
                            var $932 = self.value;
                            var $933 = Parser$Reply$error$($932);
                            var $931 = $933;
                            break;

                          case "Maybe.none":
                            var $934 = Parser$Reply$fail$($918, $919, $920, "No parse.");
                            var $931 = $934;
                            break;
                        }
                        ;
                        var $922 = $931;
                        break;
                    }
                    ;
                    return $922;
                }
            })();
            if (R.ctr === "TCO") arg = R.arg; else return R;
        }
    }
    const Parser$first_of$go = x0 => x1 => Parser$first_of$go$(x0, x1);
    function Parser$first_of$(_pars$2) {
        var $935 = Parser$first_of$go(_pars$2);
        return $935;
    }
    const Parser$first_of = x0 => Parser$first_of$(x0);
    function Parser$(_V$1) {
        var $936 = null;
        return $936;
    }
    const Parser = x0 => Parser$(x0);
    function String$cons$(_head$1, _tail$2) {
        var $937 = String.fromCharCode(_head$1) + _tail$2;
        return $937;
    }
    const String$cons = x0 => x1 => String$cons$(x0, x1);
    const String$concat = a0 => a1 => a0 + a1;
    const U16$eql = a0 => a1 => a0 === a1;
    const String$nil = "";
    function Parser$text$go$(_ini_idx$1, _ini_txt$2, _text$3, _pst$4) {
        var Parser$text$go$ = (_ini_idx$1, _ini_txt$2, _text$3, _pst$4) => ({
            ctr: "TCO",
            arg: [ _ini_idx$1, _ini_txt$2, _text$3, _pst$4 ]
        });
        var Parser$text$go = _ini_idx$1 => _ini_txt$2 => _text$3 => _pst$4 => Parser$text$go$(_ini_idx$1, _ini_txt$2, _text$3, _pst$4);
        var arg = [ _ini_idx$1, _ini_txt$2, _text$3, _pst$4 ];
        while (true) {
            let [ _ini_idx$1, _ini_txt$2, _text$3, _pst$4 ] = arg;
            var R = (() => {
                var self = _pst$4;
                switch (self._) {
                  case "Parser.State.new":
                    var $938 = self.err;
                    var $939 = self.nam;
                    var $940 = self.ini;
                    var $941 = self.idx;
                    var $942 = self.str;
                    var self = _text$3;
                    if (self.length === 0) {
                        var $944 = Parser$Reply$value$(_pst$4, Unit$new);
                        var $943 = $944;
                    } else {
                        var $945 = self.charCodeAt(0);
                        var $946 = self.slice(1);
                        var self = $942;
                        if (self.length === 0) {
                            var _error_msg$12 = "Expected '" + (_ini_txt$2 + "', found end of file.");
                            var $948 = Parser$Reply$fail$($939, $940, _ini_idx$1, _error_msg$12);
                            var $947 = $948;
                        } else {
                            var $949 = self.charCodeAt(0);
                            var $950 = self.slice(1);
                            var self = $945 === $949;
                            if (self) {
                                var _pst$14 = Parser$State$new$($938, $939, $940, Nat$succ$($941), $950);
                                var $952 = Parser$text$go$(_ini_idx$1, _ini_txt$2, $946, _pst$14);
                                var $951 = $952;
                            } else {
                                var _chr$14 = String$cons$($949, String$nil);
                                var _err$15 = "Expected '" + (_ini_txt$2 + ("', found '" + (_chr$14 + "'.")));
                                var $953 = Parser$Reply$fail$($939, $940, _ini_idx$1, _err$15);
                                var $951 = $953;
                            }
                            var $947 = $951;
                        }
                        var $943 = $947;
                    }
                    ;
                    return $943;
                }
            })();
            if (R.ctr === "TCO") arg = R.arg; else return R;
        }
    }
    const Parser$text$go = x0 => x1 => x2 => x3 => Parser$text$go$(x0, x1, x2, x3);
    function Parser$text$(_text$1, _pst$2) {
        var self = _pst$2;
        switch (self._) {
          case "Parser.State.new":
            var $955 = self.idx;
            var self = Parser$text$go$($955, _text$1, _text$1, _pst$2);
            switch (self._) {
              case "Parser.Reply.error":
                var $957 = self.err;
                var $958 = Parser$Reply$error$($957);
                var $956 = $958;
                break;

              case "Parser.Reply.value":
                var $959 = self.pst;
                var $960 = self.val;
                var $961 = Parser$Reply$value$($959, $960);
                var $956 = $961;
                break;
            }
            ;
            var $954 = $956;
            break;
        }
        return $954;
    }
    const Parser$text = x0 => x1 => Parser$text$(x0, x1);
    function Parser$many$go$(_parse$2, _values$3, _pst$4) {
        var Parser$many$go$ = (_parse$2, _values$3, _pst$4) => ({
            ctr: "TCO",
            arg: [ _parse$2, _values$3, _pst$4 ]
        });
        var Parser$many$go = _parse$2 => _values$3 => _pst$4 => Parser$many$go$(_parse$2, _values$3, _pst$4);
        var arg = [ _parse$2, _values$3, _pst$4 ];
        while (true) {
            let [ _parse$2, _values$3, _pst$4 ] = arg;
            var R = (() => {
                var self = _pst$4;
                switch (self._) {
                  case "Parser.State.new":
                    var self = _parse$2(_pst$4);
                    switch (self._) {
                      case "Parser.Reply.value":
                        var $963 = self.pst;
                        var $964 = self.val;
                        var $965 = Parser$many$go$(_parse$2, _xs$12 => {
                            var $966 = _values$3(List$cons$($964, _xs$12));
                            return $966;
                        }, $963);
                        var $962 = $965;
                        break;

                      case "Parser.Reply.error":
                        var $967 = Parser$Reply$value$(_pst$4, _values$3(List$nil));
                        var $962 = $967;
                        break;
                    }
                    ;
                    return $962;
                }
            })();
            if (R.ctr === "TCO") arg = R.arg; else return R;
        }
    }
    const Parser$many$go = x0 => x1 => x2 => Parser$many$go$(x0, x1, x2);
    function Parser$many$(_parser$2) {
        var $968 = Parser$many$go(_parser$2)(_x$3 => {
            var $969 = _x$3;
            return $969;
        });
        return $968;
    }
    const Parser$many = x0 => Parser$many$(x0);
    function Parser$many1$(_parser$2, _pst$3) {
        var self = _pst$3;
        switch (self._) {
          case "Parser.State.new":
            var $971 = self.err;
            var _reply$9 = _parser$2(_pst$3);
            var self = _reply$9;
            switch (self._) {
              case "Parser.Reply.error":
                var $973 = self.err;
                var self = $971;
                switch (self._) {
                  case "Maybe.some":
                    var $975 = self.value;
                    var $976 = Parser$Reply$error$(Parser$Error$combine$($975, $973));
                    var $974 = $976;
                    break;

                  case "Maybe.none":
                    var $977 = Parser$Reply$error$($973);
                    var $974 = $977;
                    break;
                }
                ;
                var $972 = $974;
                break;

              case "Parser.Reply.value":
                var $978 = self.pst;
                var $979 = self.val;
                var self = $978;
                switch (self._) {
                  case "Parser.State.new":
                    var $981 = self.err;
                    var $982 = self.nam;
                    var $983 = self.ini;
                    var $984 = self.idx;
                    var $985 = self.str;
                    var _reply$pst$17 = Parser$State$new$(Parser$Error$maybe_combine$($971, $981), $982, $983, $984, $985);
                    var self = _reply$pst$17;
                    switch (self._) {
                      case "Parser.State.new":
                        var $987 = self.err;
                        var _reply$23 = Parser$many$(_parser$2)(_reply$pst$17);
                        var self = _reply$23;
                        switch (self._) {
                          case "Parser.Reply.error":
                            var $989 = self.err;
                            var self = $987;
                            switch (self._) {
                              case "Maybe.some":
                                var $991 = self.value;
                                var $992 = Parser$Reply$error$(Parser$Error$combine$($991, $989));
                                var $990 = $992;
                                break;

                              case "Maybe.none":
                                var $993 = Parser$Reply$error$($989);
                                var $990 = $993;
                                break;
                            }
                            ;
                            var $988 = $990;
                            break;

                          case "Parser.Reply.value":
                            var $994 = self.pst;
                            var $995 = self.val;
                            var self = $994;
                            switch (self._) {
                              case "Parser.State.new":
                                var $997 = self.err;
                                var $998 = self.nam;
                                var $999 = self.ini;
                                var $1000 = self.idx;
                                var $1001 = self.str;
                                var _reply$pst$31 = Parser$State$new$(Parser$Error$maybe_combine$($987, $997), $998, $999, $1000, $1001);
                                var $1002 = Parser$Reply$value$(_reply$pst$31, List$cons$($979, $995));
                                var $996 = $1002;
                                break;
                            }
                            ;
                            var $988 = $996;
                            break;
                        }
                        ;
                        var $986 = $988;
                        break;
                    }
                    ;
                    var $980 = $986;
                    break;
                }
                ;
                var $972 = $980;
                break;
            }
            ;
            var $970 = $972;
            break;
        }
        return $970;
    }
    const Parser$many1 = x0 => x1 => Parser$many1$(x0, x1);
    function Parser$hex_digit$(_pst$1) {
        var self = _pst$1;
        switch (self._) {
          case "Parser.State.new":
            var $1004 = self.err;
            var $1005 = self.nam;
            var $1006 = self.ini;
            var $1007 = self.idx;
            var $1008 = self.str;
            var self = $1008;
            if (self.length === 0) {
                var $1010 = Parser$Reply$fail$($1005, $1006, $1007, "Not a digit.");
                var $1009 = $1010;
            } else {
                var $1011 = self.charCodeAt(0);
                var $1012 = self.slice(1);
                var _pst$9 = Parser$State$new$($1004, $1005, $1006, Nat$succ$($1007), $1012);
                var self = $1011 === 48;
                if (self) {
                    var $1014 = Parser$Reply$value$(_pst$9, 0n);
                    var $1013 = $1014;
                } else {
                    var self = $1011 === 49;
                    if (self) {
                        var $1016 = Parser$Reply$value$(_pst$9, 1n);
                        var $1015 = $1016;
                    } else {
                        var self = $1011 === 50;
                        if (self) {
                            var $1018 = Parser$Reply$value$(_pst$9, 2n);
                            var $1017 = $1018;
                        } else {
                            var self = $1011 === 51;
                            if (self) {
                                var $1020 = Parser$Reply$value$(_pst$9, 3n);
                                var $1019 = $1020;
                            } else {
                                var self = $1011 === 52;
                                if (self) {
                                    var $1022 = Parser$Reply$value$(_pst$9, 4n);
                                    var $1021 = $1022;
                                } else {
                                    var self = $1011 === 53;
                                    if (self) {
                                        var $1024 = Parser$Reply$value$(_pst$9, 5n);
                                        var $1023 = $1024;
                                    } else {
                                        var self = $1011 === 54;
                                        if (self) {
                                            var $1026 = Parser$Reply$value$(_pst$9, 6n);
                                            var $1025 = $1026;
                                        } else {
                                            var self = $1011 === 55;
                                            if (self) {
                                                var $1028 = Parser$Reply$value$(_pst$9, 7n);
                                                var $1027 = $1028;
                                            } else {
                                                var self = $1011 === 56;
                                                if (self) {
                                                    var $1030 = Parser$Reply$value$(_pst$9, 8n);
                                                    var $1029 = $1030;
                                                } else {
                                                    var self = $1011 === 57;
                                                    if (self) {
                                                        var $1032 = Parser$Reply$value$(_pst$9, 9n);
                                                        var $1031 = $1032;
                                                    } else {
                                                        var self = $1011 === 97;
                                                        if (self) {
                                                            var $1034 = Parser$Reply$value$(_pst$9, 10n);
                                                            var $1033 = $1034;
                                                        } else {
                                                            var self = $1011 === 98;
                                                            if (self) {
                                                                var $1036 = Parser$Reply$value$(_pst$9, 11n);
                                                                var $1035 = $1036;
                                                            } else {
                                                                var self = $1011 === 99;
                                                                if (self) {
                                                                    var $1038 = Parser$Reply$value$(_pst$9, 12n);
                                                                    var $1037 = $1038;
                                                                } else {
                                                                    var self = $1011 === 100;
                                                                    if (self) {
                                                                        var $1040 = Parser$Reply$value$(_pst$9, 13n);
                                                                        var $1039 = $1040;
                                                                    } else {
                                                                        var self = $1011 === 101;
                                                                        if (self) {
                                                                            var $1042 = Parser$Reply$value$(_pst$9, 14n);
                                                                            var $1041 = $1042;
                                                                        } else {
                                                                            var self = $1011 === 102;
                                                                            if (self) {
                                                                                var $1044 = Parser$Reply$value$(_pst$9, 15n);
                                                                                var $1043 = $1044;
                                                                            } else {
                                                                                var self = $1011 === 65;
                                                                                if (self) {
                                                                                    var $1046 = Parser$Reply$value$(_pst$9, 10n);
                                                                                    var $1045 = $1046;
                                                                                } else {
                                                                                    var self = $1011 === 66;
                                                                                    if (self) {
                                                                                        var $1048 = Parser$Reply$value$(_pst$9, 11n);
                                                                                        var $1047 = $1048;
                                                                                    } else {
                                                                                        var self = $1011 === 67;
                                                                                        if (self) {
                                                                                            var $1050 = Parser$Reply$value$(_pst$9, 12n);
                                                                                            var $1049 = $1050;
                                                                                        } else {
                                                                                            var self = $1011 === 68;
                                                                                            if (self) {
                                                                                                var $1052 = Parser$Reply$value$(_pst$9, 13n);
                                                                                                var $1051 = $1052;
                                                                                            } else {
                                                                                                var self = $1011 === 69;
                                                                                                if (self) {
                                                                                                    var $1054 = Parser$Reply$value$(_pst$9, 14n);
                                                                                                    var $1053 = $1054;
                                                                                                } else {
                                                                                                    var self = $1011 === 70;
                                                                                                    if (self) {
                                                                                                        var $1056 = Parser$Reply$value$(_pst$9, 15n);
                                                                                                        var $1055 = $1056;
                                                                                                    } else {
                                                                                                        var $1057 = Parser$Reply$fail$($1005, $1006, $1007, "Not a digit.");
                                                                                                        var $1055 = $1057;
                                                                                                    }
                                                                                                    var $1053 = $1055;
                                                                                                }
                                                                                                var $1051 = $1053;
                                                                                            }
                                                                                            var $1049 = $1051;
                                                                                        }
                                                                                        var $1047 = $1049;
                                                                                    }
                                                                                    var $1045 = $1047;
                                                                                }
                                                                                var $1043 = $1045;
                                                                            }
                                                                            var $1041 = $1043;
                                                                        }
                                                                        var $1039 = $1041;
                                                                    }
                                                                    var $1037 = $1039;
                                                                }
                                                                var $1035 = $1037;
                                                            }
                                                            var $1033 = $1035;
                                                        }
                                                        var $1031 = $1033;
                                                    }
                                                    var $1029 = $1031;
                                                }
                                                var $1027 = $1029;
                                            }
                                            var $1025 = $1027;
                                        }
                                        var $1023 = $1025;
                                    }
                                    var $1021 = $1023;
                                }
                                var $1019 = $1021;
                            }
                            var $1017 = $1019;
                        }
                        var $1015 = $1017;
                    }
                    var $1013 = $1015;
                }
                var $1009 = $1013;
            }
            ;
            var $1003 = $1009;
            break;
        }
        return $1003;
    }
    const Parser$hex_digit = x0 => Parser$hex_digit$(x0);
    function Nat$from_base$go$(_b$1, _ds$2, _p$3, _res$4) {
        var Nat$from_base$go$ = (_b$1, _ds$2, _p$3, _res$4) => ({
            ctr: "TCO",
            arg: [ _b$1, _ds$2, _p$3, _res$4 ]
        });
        var Nat$from_base$go = _b$1 => _ds$2 => _p$3 => _res$4 => Nat$from_base$go$(_b$1, _ds$2, _p$3, _res$4);
        var arg = [ _b$1, _ds$2, _p$3, _res$4 ];
        while (true) {
            let [ _b$1, _ds$2, _p$3, _res$4 ] = arg;
            var R = (() => {
                var self = _ds$2;
                switch (self._) {
                  case "List.cons":
                    var $1058 = self.head;
                    var $1059 = self.tail;
                    var $1060 = Nat$from_base$go$(_b$1, $1059, _b$1 * _p$3, $1058 * _p$3 + _res$4);
                    return $1060;

                  case "List.nil":
                    var $1061 = _res$4;
                    return $1061;
                }
            })();
            if (R.ctr === "TCO") arg = R.arg; else return R;
        }
    }
    const Nat$from_base$go = x0 => x1 => x2 => x3 => Nat$from_base$go$(x0, x1, x2, x3);
    function List$reverse$go$(_xs$2, _res$3) {
        var List$reverse$go$ = (_xs$2, _res$3) => ({
            ctr: "TCO",
            arg: [ _xs$2, _res$3 ]
        });
        var List$reverse$go = _xs$2 => _res$3 => List$reverse$go$(_xs$2, _res$3);
        var arg = [ _xs$2, _res$3 ];
        while (true) {
            let [ _xs$2, _res$3 ] = arg;
            var R = (() => {
                var self = _xs$2;
                switch (self._) {
                  case "List.cons":
                    var $1062 = self.head;
                    var $1063 = self.tail;
                    var $1064 = List$reverse$go$($1063, List$cons$($1062, _res$3));
                    return $1064;

                  case "List.nil":
                    var $1065 = _res$3;
                    return $1065;
                }
            })();
            if (R.ctr === "TCO") arg = R.arg; else return R;
        }
    }
    const List$reverse$go = x0 => x1 => List$reverse$go$(x0, x1);
    function List$reverse$(_xs$2) {
        var $1066 = List$reverse$go$(_xs$2, List$nil);
        return $1066;
    }
    const List$reverse = x0 => List$reverse$(x0);
    function Nat$from_base$(_base$1, _ds$2) {
        var $1067 = Nat$from_base$go$(_base$1, List$reverse$(_ds$2), 1n, 0n);
        return $1067;
    }
    const Nat$from_base = x0 => x1 => Nat$from_base$(x0, x1);
    function Parser$hex_nat$(_pst$1) {
        var self = _pst$1;
        switch (self._) {
          case "Parser.State.new":
            var $1069 = self.err;
            var _reply$7 = Parser$text$("0x", _pst$1);
            var self = _reply$7;
            switch (self._) {
              case "Parser.Reply.error":
                var $1071 = self.err;
                var self = $1069;
                switch (self._) {
                  case "Maybe.some":
                    var $1073 = self.value;
                    var $1074 = Parser$Reply$error$(Parser$Error$combine$($1073, $1071));
                    var $1072 = $1074;
                    break;

                  case "Maybe.none":
                    var $1075 = Parser$Reply$error$($1071);
                    var $1072 = $1075;
                    break;
                }
                ;
                var $1070 = $1072;
                break;

              case "Parser.Reply.value":
                var $1076 = self.pst;
                var self = $1076;
                switch (self._) {
                  case "Parser.State.new":
                    var $1078 = self.err;
                    var $1079 = self.nam;
                    var $1080 = self.ini;
                    var $1081 = self.idx;
                    var $1082 = self.str;
                    var _reply$pst$15 = Parser$State$new$(Parser$Error$maybe_combine$($1069, $1078), $1079, $1080, $1081, $1082);
                    var self = _reply$pst$15;
                    switch (self._) {
                      case "Parser.State.new":
                        var $1084 = self.err;
                        var _reply$21 = Parser$many1$(Parser$hex_digit, _reply$pst$15);
                        var self = _reply$21;
                        switch (self._) {
                          case "Parser.Reply.error":
                            var $1086 = self.err;
                            var self = $1084;
                            switch (self._) {
                              case "Maybe.some":
                                var $1088 = self.value;
                                var $1089 = Parser$Reply$error$(Parser$Error$combine$($1088, $1086));
                                var $1087 = $1089;
                                break;

                              case "Maybe.none":
                                var $1090 = Parser$Reply$error$($1086);
                                var $1087 = $1090;
                                break;
                            }
                            ;
                            var $1085 = $1087;
                            break;

                          case "Parser.Reply.value":
                            var $1091 = self.pst;
                            var $1092 = self.val;
                            var self = $1091;
                            switch (self._) {
                              case "Parser.State.new":
                                var $1094 = self.err;
                                var $1095 = self.nam;
                                var $1096 = self.ini;
                                var $1097 = self.idx;
                                var $1098 = self.str;
                                var _reply$pst$29 = Parser$State$new$(Parser$Error$maybe_combine$($1084, $1094), $1095, $1096, $1097, $1098);
                                var $1099 = Parser$Reply$value$(_reply$pst$29, Nat$from_base$(16n, $1092));
                                var $1093 = $1099;
                                break;
                            }
                            ;
                            var $1085 = $1093;
                            break;
                        }
                        ;
                        var $1083 = $1085;
                        break;
                    }
                    ;
                    var $1077 = $1083;
                    break;
                }
                ;
                var $1070 = $1077;
                break;
            }
            ;
            var $1068 = $1070;
            break;
        }
        return $1068;
    }
    const Parser$hex_nat = x0 => Parser$hex_nat$(x0);
    function Parser$digit$(_pst$1) {
        var self = _pst$1;
        switch (self._) {
          case "Parser.State.new":
            var $1101 = self.err;
            var $1102 = self.nam;
            var $1103 = self.ini;
            var $1104 = self.idx;
            var $1105 = self.str;
            var self = $1105;
            if (self.length === 0) {
                var $1107 = Parser$Reply$fail$($1102, $1103, $1104, "Not a digit.");
                var $1106 = $1107;
            } else {
                var $1108 = self.charCodeAt(0);
                var $1109 = self.slice(1);
                var _pst$9 = Parser$State$new$($1101, $1102, $1103, Nat$succ$($1104), $1109);
                var self = $1108 === 48;
                if (self) {
                    var $1111 = Parser$Reply$value$(_pst$9, 0n);
                    var $1110 = $1111;
                } else {
                    var self = $1108 === 49;
                    if (self) {
                        var $1113 = Parser$Reply$value$(_pst$9, 1n);
                        var $1112 = $1113;
                    } else {
                        var self = $1108 === 50;
                        if (self) {
                            var $1115 = Parser$Reply$value$(_pst$9, 2n);
                            var $1114 = $1115;
                        } else {
                            var self = $1108 === 51;
                            if (self) {
                                var $1117 = Parser$Reply$value$(_pst$9, 3n);
                                var $1116 = $1117;
                            } else {
                                var self = $1108 === 52;
                                if (self) {
                                    var $1119 = Parser$Reply$value$(_pst$9, 4n);
                                    var $1118 = $1119;
                                } else {
                                    var self = $1108 === 53;
                                    if (self) {
                                        var $1121 = Parser$Reply$value$(_pst$9, 5n);
                                        var $1120 = $1121;
                                    } else {
                                        var self = $1108 === 54;
                                        if (self) {
                                            var $1123 = Parser$Reply$value$(_pst$9, 6n);
                                            var $1122 = $1123;
                                        } else {
                                            var self = $1108 === 55;
                                            if (self) {
                                                var $1125 = Parser$Reply$value$(_pst$9, 7n);
                                                var $1124 = $1125;
                                            } else {
                                                var self = $1108 === 56;
                                                if (self) {
                                                    var $1127 = Parser$Reply$value$(_pst$9, 8n);
                                                    var $1126 = $1127;
                                                } else {
                                                    var self = $1108 === 57;
                                                    if (self) {
                                                        var $1129 = Parser$Reply$value$(_pst$9, 9n);
                                                        var $1128 = $1129;
                                                    } else {
                                                        var $1130 = Parser$Reply$fail$($1102, $1103, $1104, "Not a digit.");
                                                        var $1128 = $1130;
                                                    }
                                                    var $1126 = $1128;
                                                }
                                                var $1124 = $1126;
                                            }
                                            var $1122 = $1124;
                                        }
                                        var $1120 = $1122;
                                    }
                                    var $1118 = $1120;
                                }
                                var $1116 = $1118;
                            }
                            var $1114 = $1116;
                        }
                        var $1112 = $1114;
                    }
                    var $1110 = $1112;
                }
                var $1106 = $1110;
            }
            ;
            var $1100 = $1106;
            break;
        }
        return $1100;
    }
    const Parser$digit = x0 => Parser$digit$(x0);
    function Parser$nat$(_pst$1) {
        var self = _pst$1;
        switch (self._) {
          case "Parser.State.new":
            var $1132 = self.err;
            var _reply$7 = Parser$many1$(Parser$digit, _pst$1);
            var self = _reply$7;
            switch (self._) {
              case "Parser.Reply.error":
                var $1134 = self.err;
                var self = $1132;
                switch (self._) {
                  case "Maybe.some":
                    var $1136 = self.value;
                    var $1137 = Parser$Reply$error$(Parser$Error$combine$($1136, $1134));
                    var $1135 = $1137;
                    break;

                  case "Maybe.none":
                    var $1138 = Parser$Reply$error$($1134);
                    var $1135 = $1138;
                    break;
                }
                ;
                var $1133 = $1135;
                break;

              case "Parser.Reply.value":
                var $1139 = self.pst;
                var $1140 = self.val;
                var self = $1139;
                switch (self._) {
                  case "Parser.State.new":
                    var $1142 = self.err;
                    var $1143 = self.nam;
                    var $1144 = self.ini;
                    var $1145 = self.idx;
                    var $1146 = self.str;
                    var _reply$pst$15 = Parser$State$new$(Parser$Error$maybe_combine$($1132, $1142), $1143, $1144, $1145, $1146);
                    var $1147 = Parser$Reply$value$(_reply$pst$15, Nat$from_base$(10n, $1140));
                    var $1141 = $1147;
                    break;
                }
                ;
                var $1133 = $1141;
                break;
            }
            ;
            var $1131 = $1133;
            break;
        }
        return $1131;
    }
    const Parser$nat = x0 => Parser$nat$(x0);
    function Parser$maybe$(_parse$2, _pst$3) {
        var self = _pst$3;
        switch (self._) {
          case "Parser.State.new":
            var self = _parse$2(_pst$3);
            switch (self._) {
              case "Parser.Reply.value":
                var $1150 = self.pst;
                var $1151 = self.val;
                var $1152 = Parser$Reply$value$($1150, Maybe$some$($1151));
                var $1149 = $1152;
                break;

              case "Parser.Reply.error":
                var $1153 = Parser$Reply$value$(_pst$3, Maybe$none);
                var $1149 = $1153;
                break;
            }
            ;
            var $1148 = $1149;
            break;
        }
        return $1148;
    }
    const Parser$maybe = x0 => x1 => Parser$maybe$(x0, x1);
    function Parser$Number$new$(_sign$1, _numb$2, _frac$3) {
        var $1154 = {
            _: "Parser.Number.new",
            sign: _sign$1,
            numb: _numb$2,
            frac: _frac$3
        };
        return $1154;
    }
    const Parser$Number$new = x0 => x1 => x2 => Parser$Number$new$(x0, x1, x2);
    function Parser$num$(_pst$1) {
        var self = _pst$1;
        switch (self._) {
          case "Parser.State.new":
            var $1156 = self.err;
            var _reply$7 = Parser$first_of$(List$cons$(_pst$7 => {
                var self = _pst$7;
                switch (self._) {
                  case "Parser.State.new":
                    var $1159 = self.err;
                    var _reply$13 = Parser$text$("+", _pst$7);
                    var self = _reply$13;
                    switch (self._) {
                      case "Parser.Reply.error":
                        var $1161 = self.err;
                        var self = $1159;
                        switch (self._) {
                          case "Maybe.some":
                            var $1163 = self.value;
                            var $1164 = Parser$Reply$error$(Parser$Error$combine$($1163, $1161));
                            var $1162 = $1164;
                            break;

                          case "Maybe.none":
                            var $1165 = Parser$Reply$error$($1161);
                            var $1162 = $1165;
                            break;
                        }
                        ;
                        var $1160 = $1162;
                        break;

                      case "Parser.Reply.value":
                        var $1166 = self.pst;
                        var self = $1166;
                        switch (self._) {
                          case "Parser.State.new":
                            var $1168 = self.err;
                            var $1169 = self.nam;
                            var $1170 = self.ini;
                            var $1171 = self.idx;
                            var $1172 = self.str;
                            var _reply$pst$21 = Parser$State$new$(Parser$Error$maybe_combine$($1159, $1168), $1169, $1170, $1171, $1172);
                            var $1173 = Parser$Reply$value$(_reply$pst$21, Maybe$some$(Bool$true));
                            var $1167 = $1173;
                            break;
                        }
                        ;
                        var $1160 = $1167;
                        break;
                    }
                    ;
                    var $1158 = $1160;
                    break;
                }
                return $1158;
            }, List$cons$(_pst$7 => {
                var self = _pst$7;
                switch (self._) {
                  case "Parser.State.new":
                    var $1175 = self.err;
                    var _reply$13 = Parser$text$("-", _pst$7);
                    var self = _reply$13;
                    switch (self._) {
                      case "Parser.Reply.error":
                        var $1177 = self.err;
                        var self = $1175;
                        switch (self._) {
                          case "Maybe.some":
                            var $1179 = self.value;
                            var $1180 = Parser$Reply$error$(Parser$Error$combine$($1179, $1177));
                            var $1178 = $1180;
                            break;

                          case "Maybe.none":
                            var $1181 = Parser$Reply$error$($1177);
                            var $1178 = $1181;
                            break;
                        }
                        ;
                        var $1176 = $1178;
                        break;

                      case "Parser.Reply.value":
                        var $1182 = self.pst;
                        var self = $1182;
                        switch (self._) {
                          case "Parser.State.new":
                            var $1184 = self.err;
                            var $1185 = self.nam;
                            var $1186 = self.ini;
                            var $1187 = self.idx;
                            var $1188 = self.str;
                            var _reply$pst$21 = Parser$State$new$(Parser$Error$maybe_combine$($1175, $1184), $1185, $1186, $1187, $1188);
                            var $1189 = Parser$Reply$value$(_reply$pst$21, Maybe$some$(Bool$false));
                            var $1183 = $1189;
                            break;
                        }
                        ;
                        var $1176 = $1183;
                        break;
                    }
                    ;
                    var $1174 = $1176;
                    break;
                }
                return $1174;
            }, List$cons$(_pst$7 => {
                var $1190 = Parser$Reply$value$(_pst$7, Maybe$none);
                return $1190;
            }, List$nil))))(_pst$1);
            var self = _reply$7;
            switch (self._) {
              case "Parser.Reply.error":
                var $1191 = self.err;
                var self = $1156;
                switch (self._) {
                  case "Maybe.some":
                    var $1193 = self.value;
                    var $1194 = Parser$Reply$error$(Parser$Error$combine$($1193, $1191));
                    var $1192 = $1194;
                    break;

                  case "Maybe.none":
                    var $1195 = Parser$Reply$error$($1191);
                    var $1192 = $1195;
                    break;
                }
                ;
                var $1157 = $1192;
                break;

              case "Parser.Reply.value":
                var $1196 = self.pst;
                var $1197 = self.val;
                var self = $1196;
                switch (self._) {
                  case "Parser.State.new":
                    var $1199 = self.err;
                    var $1200 = self.nam;
                    var $1201 = self.ini;
                    var $1202 = self.idx;
                    var $1203 = self.str;
                    var _reply$pst$15 = Parser$State$new$(Parser$Error$maybe_combine$($1156, $1199), $1200, $1201, $1202, $1203);
                    var self = _reply$pst$15;
                    switch (self._) {
                      case "Parser.State.new":
                        var $1205 = self.err;
                        var _reply$21 = Parser$first_of$(List$cons$(Parser$hex_nat, List$cons$(Parser$nat, List$nil)))(_reply$pst$15);
                        var self = _reply$21;
                        switch (self._) {
                          case "Parser.Reply.error":
                            var $1207 = self.err;
                            var self = $1205;
                            switch (self._) {
                              case "Maybe.some":
                                var $1209 = self.value;
                                var $1210 = Parser$Reply$error$(Parser$Error$combine$($1209, $1207));
                                var $1208 = $1210;
                                break;

                              case "Maybe.none":
                                var $1211 = Parser$Reply$error$($1207);
                                var $1208 = $1211;
                                break;
                            }
                            ;
                            var $1206 = $1208;
                            break;

                          case "Parser.Reply.value":
                            var $1212 = self.pst;
                            var $1213 = self.val;
                            var self = $1212;
                            switch (self._) {
                              case "Parser.State.new":
                                var $1215 = self.err;
                                var $1216 = self.nam;
                                var $1217 = self.ini;
                                var $1218 = self.idx;
                                var $1219 = self.str;
                                var _reply$pst$29 = Parser$State$new$(Parser$Error$maybe_combine$($1205, $1215), $1216, $1217, $1218, $1219);
                                var self = _reply$pst$29;
                                switch (self._) {
                                  case "Parser.State.new":
                                    var $1221 = self.err;
                                    var self = _reply$pst$29;
                                    switch (self._) {
                                      case "Parser.State.new":
                                        var $1223 = self.err;
                                        var _reply$40 = Parser$maybe$(Parser$text("."), _reply$pst$29);
                                        var self = _reply$40;
                                        switch (self._) {
                                          case "Parser.Reply.error":
                                            var $1225 = self.err;
                                            var self = $1223;
                                            switch (self._) {
                                              case "Maybe.some":
                                                var $1227 = self.value;
                                                var $1228 = Parser$Reply$error$(Parser$Error$combine$($1227, $1225));
                                                var $1226 = $1228;
                                                break;

                                              case "Maybe.none":
                                                var $1229 = Parser$Reply$error$($1225);
                                                var $1226 = $1229;
                                                break;
                                            }
                                            ;
                                            var $1224 = $1226;
                                            break;

                                          case "Parser.Reply.value":
                                            var $1230 = self.pst;
                                            var self = $1230;
                                            switch (self._) {
                                              case "Parser.State.new":
                                                var $1232 = self.err;
                                                var $1233 = self.nam;
                                                var $1234 = self.ini;
                                                var $1235 = self.idx;
                                                var $1236 = self.str;
                                                var _reply$pst$48 = Parser$State$new$(Parser$Error$maybe_combine$($1223, $1232), $1233, $1234, $1235, $1236);
                                                var self = _reply$pst$48;
                                                switch (self._) {
                                                  case "Parser.State.new":
                                                    var $1238 = self.err;
                                                    var _reply$54 = Parser$maybe$(Parser$nat, _reply$pst$48);
                                                    var self = _reply$54;
                                                    switch (self._) {
                                                      case "Parser.Reply.error":
                                                        var $1240 = self.err;
                                                        var self = $1238;
                                                        switch (self._) {
                                                          case "Maybe.some":
                                                            var $1242 = self.value;
                                                            var $1243 = Parser$Reply$error$(Parser$Error$combine$($1242, $1240));
                                                            var $1241 = $1243;
                                                            break;

                                                          case "Maybe.none":
                                                            var $1244 = Parser$Reply$error$($1240);
                                                            var $1241 = $1244;
                                                            break;
                                                        }
                                                        ;
                                                        var $1239 = $1241;
                                                        break;

                                                      case "Parser.Reply.value":
                                                        var $1245 = self.pst;
                                                        var $1246 = self.val;
                                                        var self = $1245;
                                                        switch (self._) {
                                                          case "Parser.State.new":
                                                            var $1248 = self.err;
                                                            var $1249 = self.nam;
                                                            var $1250 = self.ini;
                                                            var $1251 = self.idx;
                                                            var $1252 = self.str;
                                                            var _reply$pst$62 = Parser$State$new$(Parser$Error$maybe_combine$($1238, $1248), $1249, $1250, $1251, $1252);
                                                            var $1253 = Parser$Reply$value$(_reply$pst$62, $1246);
                                                            var $1247 = $1253;
                                                            break;
                                                        }
                                                        ;
                                                        var $1239 = $1247;
                                                        break;
                                                    }
                                                    ;
                                                    var $1237 = $1239;
                                                    break;
                                                }
                                                ;
                                                var $1231 = $1237;
                                                break;
                                            }
                                            ;
                                            var $1224 = $1231;
                                            break;
                                        }
                                        ;
                                        var _reply$35 = $1224;
                                        break;
                                    }
                                    ;
                                    var self = _reply$35;
                                    switch (self._) {
                                      case "Parser.Reply.error":
                                        var $1254 = self.err;
                                        var self = $1221;
                                        switch (self._) {
                                          case "Maybe.some":
                                            var $1256 = self.value;
                                            var $1257 = Parser$Reply$error$(Parser$Error$combine$($1256, $1254));
                                            var $1255 = $1257;
                                            break;

                                          case "Maybe.none":
                                            var $1258 = Parser$Reply$error$($1254);
                                            var $1255 = $1258;
                                            break;
                                        }
                                        ;
                                        var $1222 = $1255;
                                        break;

                                      case "Parser.Reply.value":
                                        var $1259 = self.pst;
                                        var $1260 = self.val;
                                        var self = $1259;
                                        switch (self._) {
                                          case "Parser.State.new":
                                            var $1262 = self.err;
                                            var $1263 = self.nam;
                                            var $1264 = self.ini;
                                            var $1265 = self.idx;
                                            var $1266 = self.str;
                                            var _reply$pst$43 = Parser$State$new$(Parser$Error$maybe_combine$($1221, $1262), $1263, $1264, $1265, $1266);
                                            var $1267 = Parser$Reply$value$(_reply$pst$43, Parser$Number$new$($1197, $1213, $1260));
                                            var $1261 = $1267;
                                            break;
                                        }
                                        ;
                                        var $1222 = $1261;
                                        break;
                                    }
                                    ;
                                    var $1220 = $1222;
                                    break;
                                }
                                ;
                                var $1214 = $1220;
                                break;
                            }
                            ;
                            var $1206 = $1214;
                            break;
                        }
                        ;
                        var $1204 = $1206;
                        break;
                    }
                    ;
                    var $1198 = $1204;
                    break;
                }
                ;
                var $1157 = $1198;
                break;
            }
            ;
            var $1155 = $1157;
            break;
        }
        return $1155;
    }
    const Parser$num = x0 => Parser$num$(x0);
    const Nat$to_i32 = a0 => Number(a0);
    const I32$read = a0 => parseInt(a0);
    const U32$sub = a0 => a1 => a0 - a1 >>> 0;
    const String$eql = a0 => a1 => a0 === a1;
    function App$Kaelin$Coord$draft$arena_go$(_team$1, _coord$2) {
        var self = _coord$2;
        switch (self._) {
          case "App.Kaelin.Coord.new":
            var $1269 = self.i;
            var $1270 = self.j;
            var _map_size$5 = U32$to_i32$(App$Kaelin$Constants$map_size - 1 >>> 0);
            var self = _team$1 === "blue";
            if (self) {
                var $1272 = App$Kaelin$Coord$new$($1269 - _map_size$5 >> 0, $1270);
                var $1271 = $1272;
            } else {
                var self = _team$1 === "red";
                if (self) {
                    var $1274 = App$Kaelin$Coord$new$($1269 + _map_size$5 >> 0, $1270);
                    var $1273 = $1274;
                } else {
                    var $1275 = _coord$2;
                    var $1273 = $1275;
                }
                var $1271 = $1273;
            }
            ;
            var $1268 = $1271;
            break;
        }
        return $1268;
    }
    const App$Kaelin$Coord$draft$arena_go = x0 => x1 => App$Kaelin$Coord$draft$arena_go$(x0, x1);
    const App$Kaelin$Coord$draft$arena = (() => {
        var _a$1 = App$Kaelin$Coord$new$(1, -2);
        var _b$2 = App$Kaelin$Coord$new$(0, -1);
        var _c$3 = App$Kaelin$Coord$new$(1, -1);
        var _d$4 = App$Kaelin$Coord$new$(0, 0);
        var _e$5 = App$Kaelin$Coord$new$(-1, 1);
        var _f$6 = App$Kaelin$Coord$new$(0, 1);
        var _g$7 = App$Kaelin$Coord$new$(-1, 2);
        var _one$8 = App$Kaelin$Coord$new$(-1, 0);
        var _two$9 = App$Kaelin$Coord$new$(1, 0);
        var _blue$10 = List$map$(App$Kaelin$Coord$draft$arena_go("blue"), List$cons$(_a$1, List$cons$(_b$2, List$cons$(_c$3, List$cons$(_d$4, List$cons$(_e$5, List$cons$(_f$6, List$cons$(_g$7, List$cons$(_one$8, List$nil)))))))));
        var _red$11 = List$map$(App$Kaelin$Coord$draft$arena_go("red"), List$cons$(_a$1, List$cons$(_b$2, List$cons$(_c$3, List$cons$(_d$4, List$cons$(_e$5, List$cons$(_f$6, List$cons$(_g$7, List$cons$(_two$9, List$nil)))))))));
        var _blue_map$12 = NatMap$new;
        var _red_map$13 = NatMap$new;
        var _blue_map$14 = (() => {
            var $1278 = _blue_map$12;
            var $1279 = _blue$10;
            let _blue_map$15 = $1278;
            let _coord$14;
            while ($1279._ === "List.cons") {
                _coord$14 = $1279.head;
                var _key$16 = App$Kaelin$Coord$Convert$axial_to_nat$(_coord$14);
                var $1278 = NatMap$set$(_key$16, "empty", _blue_map$15);
                _blue_map$15 = $1278;
                $1279 = $1279.tail;
            }
            return _blue_map$15;
        })();
        var _red_map$15 = (() => {
            var $1281 = _red_map$13;
            var $1282 = _red$11;
            let _red_map$16 = $1281;
            let _coord$15;
            while ($1282._ === "List.cons") {
                _coord$15 = $1282.head;
                var _key$17 = App$Kaelin$Coord$Convert$axial_to_nat$(_coord$15);
                var $1281 = NatMap$set$(_key$17, "empty", _red_map$16);
                _red_map$16 = $1281;
                $1282 = $1282.tail;
            }
            return _red_map$16;
        })();
        var $1276 = Pair$new$(_blue_map$14, _red_map$15);
        return $1276;
    })();
    function App$Kaelin$Stage$draft$(_players$1, _coords$2) {
        var $1283 = {
            _: "App.Kaelin.Stage.draft",
            players: _players$1,
            coords: _coords$2
        };
        return $1283;
    }
    const App$Kaelin$Stage$draft = x0 => x1 => App$Kaelin$Stage$draft$(x0, x1);
    const App$Kaelin$Stage$init = {
        _: "App.Kaelin.Stage.init"
    };
    function App$Store$new$(_local$2, _global$3) {
        var $1284 = {
            _: "App.Store.new",
            local: _local$2,
            global: _global$3
        };
        return $1284;
    }
    const App$Store$new = x0 => x1 => App$Store$new$(x0, x1);
    const App$State$new = Pair$new$(null, null);
    const App$Kaelin$State = App$State$new;
    function App$Kaelin$State$local$new$(_input$1, _user$2, _team$3, _cast_info$4, _env_info$5, _internal$6) {
        var $1285 = {
            _: "App.Kaelin.State.local.new",
            input: _input$1,
            user: _user$2,
            team: _team$3,
            cast_info: _cast_info$4,
            env_info: _env_info$5,
            internal: _internal$6
        };
        return $1285;
    }
    const App$Kaelin$State$local$new = x0 => x1 => x2 => x3 => x4 => x5 => App$Kaelin$State$local$new$(x0, x1, x2, x3, x4, x5);
    function App$Kaelin$State$global$new$(_round$1, _tick$2, _room$3, _map$4, _stage$5, _skills_list$6) {
        var $1286 = {
            _: "App.Kaelin.State.global.new",
            round: _round$1,
            tick: _tick$2,
            room: _room$3,
            map: _map$4,
            stage: _stage$5,
            skills_list: _skills_list$6
        };
        return $1286;
    }
    const App$Kaelin$State$global$new = x0 => x1 => x2 => x3 => x4 => x5 => App$Kaelin$State$global$new$(x0, x1, x2, x3, x4, x5);
    function U64$new$(_value$1) {
        var $1287 = word_to_u64(_value$1);
        return $1287;
    }
    const U64$new = x0 => U64$new$(x0);
    const U64$from_nat = a0 => a0 & 0xffffffffffffffffn;
    const App$Kaelin$App$init = (() => {
        var _input$1 = "";
        var _user$2 = "";
        var _room$3 = App$Kaelin$Constants$room;
        var _tick$4 = 0n;
        var _frame$5 = 0n;
        var _cast_info$6 = Maybe$none;
        var _map$7 = App$Kaelin$Map$init$(App$Kaelin$Map$arena);
        var _interface$8 = App$EnvInfo$new$(Pair$new$(256, 256), Pair$new$(0, 0));
        var _internal$9 = App$Kaelin$Internal$new$(_tick$4, _frame$5, List$nil);
        var _draft_map$10 = Map$new;
        var _draft_natmap$11 = App$Kaelin$Coord$draft$arena;
        var _stage_draft$12 = App$Kaelin$Stage$draft$(_draft_map$10, _draft_natmap$11);
        var _stage_init$13 = App$Kaelin$Stage$init;
        var _team$14 = App$Kaelin$Team$neutral;
        var $1288 = App$Store$new$(App$Kaelin$State$local$new$(_input$1, _user$2, _team$14, _cast_info$6, _interface$8, _internal$9), App$Kaelin$State$global$new$(0, 1n, _room$3, _map$7, _stage_init$13, List$nil));
        return $1288;
    })();
    function DOM$node$(_tag$1, _props$2, _style$3, _children$4) {
        var $1289 = {
            _: "DOM.node",
            tag: _tag$1,
            props: _props$2,
            style: _style$3,
            children: _children$4
        };
        return $1289;
    }
    const DOM$node = x0 => x1 => x2 => x3 => DOM$node$(x0, x1, x2, x3);
    function Map$(_V$1) {
        var $1290 = null;
        return $1290;
    }
    const Map = x0 => Map$(x0);
    const Bits$concat = a0 => a1 => a1 + a0;
    function Word$to_bits$(_a$2) {
        var self = _a$2;
        switch (self._) {
          case "Word.o":
            var $1292 = self.pred;
            var $1293 = Word$to_bits$($1292) + "0";
            var $1291 = $1293;
            break;

          case "Word.i":
            var $1294 = self.pred;
            var $1295 = Word$to_bits$($1294) + "1";
            var $1291 = $1295;
            break;

          case "Word.e":
            var $1296 = Bits$e;
            var $1291 = $1296;
            break;
        }
        return $1291;
    }
    const Word$to_bits = x0 => Word$to_bits$(x0);
    const U16$to_bits = a0 => u16_to_bits(a0);
    function String$to_bits$(_str$1) {
        var self = _str$1;
        if (self.length === 0) {
            var $1298 = Bits$e;
            var $1297 = $1298;
        } else {
            var $1299 = self.charCodeAt(0);
            var $1300 = self.slice(1);
            var $1301 = String$to_bits$($1300) + u16_to_bits($1299);
            var $1297 = $1301;
        }
        return $1297;
    }
    const String$to_bits = x0 => String$to_bits$(x0);
    function Map$from_list$(_xs$2) {
        var self = _xs$2;
        switch (self._) {
          case "List.cons":
            var $1303 = self.head;
            var $1304 = self.tail;
            var self = $1303;
            switch (self._) {
              case "Pair.new":
                var $1306 = self.fst;
                var $1307 = self.snd;
                var $1308 = bitsmap_set(String$to_bits$($1306), $1307, Map$from_list$($1304), "set");
                var $1305 = $1308;
                break;
            }
            ;
            var $1302 = $1305;
            break;

          case "List.nil":
            var $1309 = BitsMap$new;
            var $1302 = $1309;
            break;
        }
        return $1302;
    }
    const Map$from_list = x0 => Map$from_list$(x0);
    function DOM$text$(_value$1) {
        var $1310 = {
            _: "DOM.text",
            value: _value$1
        };
        return $1310;
    }
    const DOM$text = x0 => DOM$text$(x0);
    function App$Kaelin$Draw$init$(_room$1) {
        var $1311 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("width", "100vw"), List$cons$(Pair$new$("height", "100vh"), List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("flex-direction", "column"), List$cons$(Pair$new$("justify-content", "center"), List$cons$(Pair$new$("align-items", "center"), List$cons$(Pair$new$("font-size", "2rem"), List$nil)))))))), List$cons$(DOM$node$("h1", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("margin-bottom", "10px"), List$nil)), List$cons$(DOM$text$("Welcome to Kaelin"), List$nil)), List$cons$(DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$nil), List$cons$(DOM$text$("Enter a room number: "), List$cons$(DOM$node$("input", Map$from_list$(List$cons$(Pair$new$("id", "text"), List$cons$(Pair$new$("value", _room$1), List$nil))), Map$from_list$(List$cons$(Pair$new$("font-size", "2rem"), List$cons$(Pair$new$("font-family", "monospace"), List$cons$(Pair$new$("outline", "transparent"), List$nil)))), List$nil), List$cons$(DOM$node$("button", Map$from_list$(List$cons$(Pair$new$("id", "ready"), List$nil)), Map$from_list$(List$cons$(Pair$new$("font-size", "2rem"), List$cons$(Pair$new$("font-family", "monospace"), List$cons$(Pair$new$("margin-left", "10px"), List$cons$(Pair$new$("padding", "2px"), List$nil))))), List$cons$(DOM$text$("Enter"), List$nil)), List$cons$(DOM$node$("button", Map$from_list$(List$cons$(Pair$new$("id", "random"), List$nil)), Map$from_list$(List$cons$(Pair$new$("font-size", "2rem"), List$cons$(Pair$new$("font-family", "monospace"), List$cons$(Pair$new$("margin-left", "10px"), List$cons$(Pair$new$("padding", "2px"), List$nil))))), List$cons$(DOM$text$("Random"), List$nil)), List$nil))))), List$nil)));
        return $1311;
    }
    const App$Kaelin$Draw$init = x0 => App$Kaelin$Draw$init$(x0);
    function Pair$snd$(_pair$3) {
        var self = _pair$3;
        switch (self._) {
          case "Pair.new":
            var $1313 = self.snd;
            var $1314 = $1313;
            var $1312 = $1314;
            break;
        }
        return $1312;
    }
    const Pair$snd = x0 => Pair$snd$(x0);
    function Bits$reverse$tco$(_a$1, _r$2) {
        var Bits$reverse$tco$ = (_a$1, _r$2) => ({
            ctr: "TCO",
            arg: [ _a$1, _r$2 ]
        });
        var Bits$reverse$tco = _a$1 => _r$2 => Bits$reverse$tco$(_a$1, _r$2);
        var arg = [ _a$1, _r$2 ];
        while (true) {
            let [ _a$1, _r$2 ] = arg;
            var R = (() => {
                var self = _a$1;
                switch (self.length === 0 ? "e" : self[self.length - 1] === "0" ? "o" : "i") {
                  case "o":
                    var $1315 = self.slice(0, -1);
                    var $1316 = Bits$reverse$tco$($1315, _r$2 + "0");
                    return $1316;

                  case "i":
                    var $1317 = self.slice(0, -1);
                    var $1318 = Bits$reverse$tco$($1317, _r$2 + "1");
                    return $1318;

                  case "e":
                    var $1319 = _r$2;
                    return $1319;
                }
            })();
            if (R.ctr === "TCO") arg = R.arg; else return R;
        }
    }
    const Bits$reverse$tco = x0 => x1 => Bits$reverse$tco$(x0, x1);
    function Bits$reverse$(_a$1) {
        var $1320 = Bits$reverse$tco$(_a$1, Bits$e);
        return $1320;
    }
    const Bits$reverse = x0 => Bits$reverse$(x0);
    function BitsMap$to_list$go$(_xs$2, _key$3, _list$4) {
        var self = _xs$2;
        switch (self._) {
          case "BitsMap.tie":
            var $1322 = self.val;
            var $1323 = self.lft;
            var $1324 = self.rgt;
            var self = $1322;
            switch (self._) {
              case "Maybe.some":
                var $1326 = self.value;
                var $1327 = List$cons$(Pair$new$(Bits$reverse$(_key$3), $1326), _list$4);
                var _list0$8 = $1327;
                break;

              case "Maybe.none":
                var $1328 = _list$4;
                var _list0$8 = $1328;
                break;
            }
            ;
            var _list1$9 = BitsMap$to_list$go$($1323, _key$3 + "0", _list0$8);
            var _list2$10 = BitsMap$to_list$go$($1324, _key$3 + "1", _list1$9);
            var $1325 = _list2$10;
            var $1321 = $1325;
            break;

          case "BitsMap.new":
            var $1329 = _list$4;
            var $1321 = $1329;
            break;
        }
        return $1321;
    }
    const BitsMap$to_list$go = x0 => x1 => x2 => BitsMap$to_list$go$(x0, x1, x2);
    function List$mapped$(_as$2, _f$4) {
        var self = _as$2;
        switch (self._) {
          case "List.cons":
            var $1331 = self.head;
            var $1332 = self.tail;
            var $1333 = List$cons$(_f$4($1331), List$mapped$($1332, _f$4));
            var $1330 = $1333;
            break;

          case "List.nil":
            var $1334 = List$nil;
            var $1330 = $1334;
            break;
        }
        return $1330;
    }
    const List$mapped = x0 => x1 => List$mapped$(x0, x1);
    function Bits$show$(_a$1) {
        var self = _a$1;
        switch (self.length === 0 ? "e" : self[self.length - 1] === "0" ? "o" : "i") {
          case "o":
            var $1336 = self.slice(0, -1);
            var $1337 = String$cons$(48, Bits$show$($1336));
            var $1335 = $1337;
            break;

          case "i":
            var $1338 = self.slice(0, -1);
            var $1339 = String$cons$(49, Bits$show$($1338));
            var $1335 = $1339;
            break;

          case "e":
            var $1340 = "";
            var $1335 = $1340;
            break;
        }
        return $1335;
    }
    const Bits$show = x0 => Bits$show$(x0);
    function Map$to_list$(_xs$2) {
        var _kvs$3 = List$reverse$(BitsMap$to_list$go$(_xs$2, Bits$e, List$nil));
        var $1341 = List$mapped$(_kvs$3, _kv$4 => {
            var self = _kv$4;
            switch (self._) {
              case "Pair.new":
                var $1343 = self.fst;
                var $1344 = self.snd;
                var $1345 = Pair$new$(Bits$show$($1343), $1344);
                var $1342 = $1345;
                break;
            }
            return $1342;
        });
        return $1341;
    }
    const Map$to_list = x0 => Map$to_list$(x0);
    function Map$set$(_key$2, _val$3, _map$4) {
        var $1346 = bitsmap_set(String$to_bits$(_key$2), _val$3, _map$4, "set");
        return $1346;
    }
    const Map$set = x0 => x1 => x2 => Map$set$(x0, x1, x2);
    const App$Kaelin$Resources$heroes = (() => {
        var _heroes$1 = List$cons$(App$Kaelin$Heroes$Croni$hero, List$cons$(App$Kaelin$Heroes$Cyclope$hero, List$cons$(App$Kaelin$Heroes$Lela$hero, List$cons$(App$Kaelin$Heroes$Octoking$hero, List$nil))));
        var $1347 = List$fold$(_heroes$1, Map$from_list$(List$nil), _hero$2 => _map$3 => {
            var self = _hero$2;
            switch (self._) {
              case "App.Kaelin.Hero.new":
                var $1349 = self.name;
                var $1350 = Map$set$($1349, _hero$2, _map$3);
                var $1348 = $1350;
                break;
            }
            return $1348;
        });
        return $1347;
    })();
    function Map$get$(_key$2, _map$3) {
        var $1351 = bitsmap_get(String$to_bits$(_key$2), _map$3);
        return $1351;
    }
    const Map$get = x0 => x1 => Map$get$(x0, x1);
    function App$Kaelin$Coord$draft$to_team$(_user$1, _players$2) {
        var _player$3 = Map$get$(_user$1, _players$2);
        var self = _player$3;
        switch (self._) {
          case "Maybe.some":
            var $1353 = self.value;
            var $1354 = Maybe$some$((() => {
                var self = $1353;
                switch (self._) {
                  case "App.Kaelin.DraftInfo.new":
                    var $1355 = self.team;
                    var $1356 = $1355;
                    return $1356;
                }
            })());
            var $1352 = $1354;
            break;

          case "Maybe.none":
            var $1357 = Maybe$none;
            var $1352 = $1357;
            break;
        }
        return $1352;
    }
    const App$Kaelin$Coord$draft$to_team = x0 => x1 => App$Kaelin$Coord$draft$to_team$(x0, x1);
    function App$Kaelin$Team$show$(_team$1) {
        var self = _team$1;
        switch (self._) {
          case "App.Kaelin.Team.red":
            var $1359 = "red";
            var $1358 = $1359;
            break;

          case "App.Kaelin.Team.blue":
            var $1360 = "blue";
            var $1358 = $1360;
            break;

          case "App.Kaelin.Team.neutral":
            var $1361 = "neutral";
            var $1358 = $1361;
            break;
        }
        return $1358;
    }
    const App$Kaelin$Team$show = x0 => App$Kaelin$Team$show$(x0);
    function App$Kaelin$Coord$draft$to_map$(_team$1, _coords$2) {
        var self = App$Kaelin$Team$show$(_team$1) === "blue";
        if (self) {
            var self = _coords$2;
            switch (self._) {
              case "Pair.new":
                var $1364 = self.fst;
                var $1365 = $1364;
                var $1363 = $1365;
                break;
            }
            var $1362 = $1363;
        } else {
            var self = App$Kaelin$Team$show$(_team$1) === "red";
            if (self) {
                var self = _coords$2;
                switch (self._) {
                  case "Pair.new":
                    var $1368 = self.snd;
                    var $1369 = $1368;
                    var $1367 = $1369;
                    break;
                }
                var $1366 = $1367;
            } else {
                var $1370 = NatMap$new;
                var $1366 = $1370;
            }
            var $1362 = $1366;
        }
        return $1362;
    }
    const App$Kaelin$Coord$draft$to_map = x0 => x1 => App$Kaelin$Coord$draft$to_map$(x0, x1);
    function Bits$to_nat$(_b$1) {
        var self = _b$1;
        switch (self.length === 0 ? "e" : self[self.length - 1] === "0" ? "o" : "i") {
          case "o":
            var $1372 = self.slice(0, -1);
            var $1373 = 2n * Bits$to_nat$($1372);
            var $1371 = $1373;
            break;

          case "i":
            var $1374 = self.slice(0, -1);
            var $1375 = Nat$succ$(2n * Bits$to_nat$($1374));
            var $1371 = $1375;
            break;

          case "e":
            var $1376 = 0n;
            var $1371 = $1376;
            break;
        }
        return $1371;
    }
    const Bits$to_nat = x0 => Bits$to_nat$(x0);
    function NatMap$to_list$(_xs$2) {
        var _kvs$3 = List$reverse$(BitsMap$to_list$go$(_xs$2, Bits$e, List$nil));
        var $1377 = List$mapped$(_kvs$3, _kv$4 => {
            var self = _kv$4;
            switch (self._) {
              case "Pair.new":
                var $1379 = self.fst;
                var $1380 = self.snd;
                var $1381 = Pair$new$(Bits$to_nat$($1379), $1380);
                var $1378 = $1381;
                break;
            }
            return $1378;
        });
        return $1377;
    }
    const NatMap$to_list = x0 => NatMap$to_list$(x0);
    function Word$mod$(_a$2, _b$3) {
        var _q$4 = Word$div$(_a$2, _b$3);
        var $1382 = Word$sub$(_a$2, Word$mul$(_b$3, _q$4));
        return $1382;
    }
    const Word$mod = x0 => x1 => Word$mod$(x0, x1);
    const U32$mod = a0 => a1 => a0 % a1;
    function App$Kaelin$Coord$Convert$nat_to_axial$(_key$1) {
        var _key_converted$2 = Number(_key$1) >>> 0;
        var _coord_i$3 = _key_converted$2 / 1e3 >>> 0;
        var _coord_i$4 = U32$to_i32$(_coord_i$3);
        var _coord_i$5 = _coord_i$4 - 100 >> 0;
        var _coord_j$6 = _key_converted$2 % 1e3;
        var _coord_j$7 = U32$to_i32$(_coord_j$6);
        var _coord_j$8 = _coord_j$7 - 100 >> 0;
        var $1383 = App$Kaelin$Coord$new$(_coord_i$5, _coord_j$8);
        return $1383;
    }
    const App$Kaelin$Coord$Convert$nat_to_axial = x0 => App$Kaelin$Coord$Convert$nat_to_axial$(x0);
    const App$Kaelin$Constants$draft_hexagon_radius = 8;
    const F64$div = a0 => a1 => a0 / a1;
    const F64$parse = a0 => parseFloat(a0);
    const F64$read = a0 => parseFloat(a0);
    const F64$add = a0 => a1 => a0 + a1;
    const F64$mul = a0 => a1 => a0 * a1;
    const F64$make = a0 => a1 => a2 => f64_make(a0, a1, a2);
    const F64$from_nat = a0 => Number(a0);
    function App$Kaelin$Coord$draft$to_xy$(_coord$1, _team$2) {
        var self = App$Kaelin$Team$show$(_team$2) === "blue";
        if (self) {
            var $1385 = U32$to_i32$(App$Kaelin$Constants$map_size - 1 >>> 0);
            var _centralizer$3 = $1385;
        } else {
            var self = App$Kaelin$Team$show$(_team$2) === "red";
            if (self) {
                var $1387 = -U32$to_i32$(App$Kaelin$Constants$map_size - 1 >>> 0);
                var $1386 = $1387;
            } else {
                var $1388 = 0;
                var $1386 = $1388;
            }
            var _centralizer$3 = $1386;
        }
        var self = _coord$1;
        switch (self._) {
          case "App.Kaelin.Coord.new":
            var $1389 = self.i;
            var $1390 = self.j;
            var _i$6 = $1389 + _centralizer$3 >> 0;
            var _j$7 = $1390;
            var _i$8 = _i$6;
            var _j$9 = _j$7;
            var _int_rad$10 = App$Kaelin$Constants$draft_hexagon_radius;
            var _hlf$11 = _int_rad$10 / +2;
            var _int_screen_center_x$12 = 50;
            var _int_screen_center_y$13 = 50;
            var _cx$14 = _int_screen_center_x$12 + _j$9 * _int_rad$10;
            var _cx$15 = _cx$14 + _i$8 * (_int_rad$10 * Number(2n));
            var _cy$16 = _int_screen_center_y$13 + _j$9 * (_hlf$11 * Number(3n));
            var _cx$17 = _cx$15 >>> 0;
            var _y$18 = _cy$16 + .5;
            var _cy$19 = _cy$16 >>> 0;
            var $1391 = Pair$new$(_cx$17, _cy$19);
            var $1384 = $1391;
            break;
        }
        return $1384;
    }
    const App$Kaelin$Coord$draft$to_xy = x0 => x1 => App$Kaelin$Coord$draft$to_xy$(x0, x1);
    function Either$(_A$1, _B$2) {
        var $1392 = null;
        return $1392;
    }
    const Either = x0 => x1 => Either$(x0, x1);
    function Either$left$(_value$3) {
        var $1393 = {
            _: "Either.left",
            value: _value$3
        };
        return $1393;
    }
    const Either$left = x0 => Either$left$(x0);
    function Either$right$(_value$3) {
        var $1394 = {
            _: "Either.right",
            value: _value$3
        };
        return $1394;
    }
    const Either$right = x0 => Either$right$(x0);
    function Nat$sub_rem$(_n$1, _m$2) {
        var Nat$sub_rem$ = (_n$1, _m$2) => ({
            ctr: "TCO",
            arg: [ _n$1, _m$2 ]
        });
        var Nat$sub_rem = _n$1 => _m$2 => Nat$sub_rem$(_n$1, _m$2);
        var arg = [ _n$1, _m$2 ];
        while (true) {
            let [ _n$1, _m$2 ] = arg;
            var R = (() => {
                var self = _m$2;
                if (self === 0n) {
                    var $1395 = Either$left$(_n$1);
                    return $1395;
                } else {
                    var $1396 = self - 1n;
                    var self = _n$1;
                    if (self === 0n) {
                        var $1398 = Either$right$(Nat$succ$($1396));
                        var $1397 = $1398;
                    } else {
                        var $1399 = self - 1n;
                        var $1400 = Nat$sub_rem$($1399, $1396);
                        var $1397 = $1400;
                    }
                    return $1397;
                }
            })();
            if (R.ctr === "TCO") arg = R.arg; else return R;
        }
    }
    const Nat$sub_rem = x0 => x1 => Nat$sub_rem$(x0, x1);
    function Nat$div_mod$go$(_n$1, _m$2, _d$3) {
        var Nat$div_mod$go$ = (_n$1, _m$2, _d$3) => ({
            ctr: "TCO",
            arg: [ _n$1, _m$2, _d$3 ]
        });
        var Nat$div_mod$go = _n$1 => _m$2 => _d$3 => Nat$div_mod$go$(_n$1, _m$2, _d$3);
        var arg = [ _n$1, _m$2, _d$3 ];
        while (true) {
            let [ _n$1, _m$2, _d$3 ] = arg;
            var R = (() => {
                var self = Nat$sub_rem$(_n$1, _m$2);
                switch (self._) {
                  case "Either.left":
                    var $1401 = self.value;
                    var $1402 = Nat$div_mod$go$($1401, _m$2, Nat$succ$(_d$3));
                    return $1402;

                  case "Either.right":
                    var $1403 = Pair$new$(_d$3, _n$1);
                    return $1403;
                }
            })();
            if (R.ctr === "TCO") arg = R.arg; else return R;
        }
    }
    const Nat$div_mod$go = x0 => x1 => x2 => Nat$div_mod$go$(x0, x1, x2);
    const Nat$div_mod = a0 => a1 => ({
        _: "Pair.new",
        fst: a0 / a1,
        snd: a0 % a1
    });
    function Nat$to_base$go$(_base$1, _nat$2, _res$3) {
        var Nat$to_base$go$ = (_base$1, _nat$2, _res$3) => ({
            ctr: "TCO",
            arg: [ _base$1, _nat$2, _res$3 ]
        });
        var Nat$to_base$go = _base$1 => _nat$2 => _res$3 => Nat$to_base$go$(_base$1, _nat$2, _res$3);
        var arg = [ _base$1, _nat$2, _res$3 ];
        while (true) {
            let [ _base$1, _nat$2, _res$3 ] = arg;
            var R = (() => {
                var self = {
                    _: "Pair.new",
                    fst: _nat$2 / _base$1,
                    snd: _nat$2 % _base$1
                };
                switch (self._) {
                  case "Pair.new":
                    var $1404 = self.fst;
                    var $1405 = self.snd;
                    var self = $1404;
                    if (self === 0n) {
                        var $1407 = List$cons$($1405, _res$3);
                        var $1406 = $1407;
                    } else {
                        var $1408 = self - 1n;
                        var $1409 = Nat$to_base$go$(_base$1, $1404, List$cons$($1405, _res$3));
                        var $1406 = $1409;
                    }
                    ;
                    return $1406;
                }
            })();
            if (R.ctr === "TCO") arg = R.arg; else return R;
        }
    }
    const Nat$to_base$go = x0 => x1 => x2 => Nat$to_base$go$(x0, x1, x2);
    function Nat$to_base$(_base$1, _nat$2) {
        var $1410 = Nat$to_base$go$(_base$1, _nat$2, List$nil);
        return $1410;
    }
    const Nat$to_base = x0 => x1 => Nat$to_base$(x0, x1);
    function Nat$mod$go$(_n$1, _m$2, _r$3) {
        var Nat$mod$go$ = (_n$1, _m$2, _r$3) => ({
            ctr: "TCO",
            arg: [ _n$1, _m$2, _r$3 ]
        });
        var Nat$mod$go = _n$1 => _m$2 => _r$3 => Nat$mod$go$(_n$1, _m$2, _r$3);
        var arg = [ _n$1, _m$2, _r$3 ];
        while (true) {
            let [ _n$1, _m$2, _r$3 ] = arg;
            var R = (() => {
                var self = _m$2;
                if (self === 0n) {
                    var $1411 = Nat$mod$go$(_n$1, _r$3, _m$2);
                    return $1411;
                } else {
                    var $1412 = self - 1n;
                    var self = _n$1;
                    if (self === 0n) {
                        var $1414 = _r$3;
                        var $1413 = $1414;
                    } else {
                        var $1415 = self - 1n;
                        var $1416 = Nat$mod$go$($1415, $1412, Nat$succ$(_r$3));
                        var $1413 = $1416;
                    }
                    return $1413;
                }
            })();
            if (R.ctr === "TCO") arg = R.arg; else return R;
        }
    }
    const Nat$mod$go = x0 => x1 => x2 => Nat$mod$go$(x0, x1, x2);
    const Nat$mod = a0 => a1 => a0 % a1;
    const Nat$lte = a0 => a1 => a0 <= a1;
    function List$at$(_index$2, _list$3) {
        var List$at$ = (_index$2, _list$3) => ({
            ctr: "TCO",
            arg: [ _index$2, _list$3 ]
        });
        var List$at = _index$2 => _list$3 => List$at$(_index$2, _list$3);
        var arg = [ _index$2, _list$3 ];
        while (true) {
            let [ _index$2, _list$3 ] = arg;
            var R = (() => {
                var self = _list$3;
                switch (self._) {
                  case "List.cons":
                    var $1417 = self.head;
                    var $1418 = self.tail;
                    var self = _index$2;
                    if (self === 0n) {
                        var $1420 = Maybe$some$($1417);
                        var $1419 = $1420;
                    } else {
                        var $1421 = self - 1n;
                        var $1422 = List$at$($1421, $1418);
                        var $1419 = $1422;
                    }
                    ;
                    return $1419;

                  case "List.nil":
                    var $1423 = Maybe$none;
                    return $1423;
                }
            })();
            if (R.ctr === "TCO") arg = R.arg; else return R;
        }
    }
    const List$at = x0 => x1 => List$at$(x0, x1);
    function Nat$show_digit$(_base$1, _n$2) {
        var _m$3 = _n$2 % _base$1;
        var _base64$4 = List$cons$(48, List$cons$(49, List$cons$(50, List$cons$(51, List$cons$(52, List$cons$(53, List$cons$(54, List$cons$(55, List$cons$(56, List$cons$(57, List$cons$(65, List$cons$(66, List$cons$(67, List$cons$(68, List$cons$(69, List$cons$(70, List$cons$(71, List$cons$(72, List$cons$(73, List$cons$(74, List$cons$(75, List$cons$(76, List$cons$(77, List$cons$(78, List$cons$(79, List$cons$(80, List$cons$(81, List$cons$(82, List$cons$(83, List$cons$(84, List$cons$(85, List$cons$(86, List$cons$(87, List$cons$(88, List$cons$(89, List$cons$(90, List$cons$(97, List$cons$(98, List$cons$(99, List$cons$(100, List$cons$(101, List$cons$(102, List$cons$(103, List$cons$(104, List$cons$(105, List$cons$(106, List$cons$(107, List$cons$(108, List$cons$(109, List$cons$(110, List$cons$(111, List$cons$(112, List$cons$(113, List$cons$(114, List$cons$(115, List$cons$(116, List$cons$(117, List$cons$(118, List$cons$(119, List$cons$(120, List$cons$(121, List$cons$(122, List$cons$(43, List$cons$(47, List$nil))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))));
        var self = _base$1 > 0n && _base$1 <= 64n;
        if (self) {
            var self = List$at$(_m$3, _base64$4);
            switch (self._) {
              case "Maybe.some":
                var $1426 = self.value;
                var $1427 = $1426;
                var $1425 = $1427;
                break;

              case "Maybe.none":
                var $1428 = 35;
                var $1425 = $1428;
                break;
            }
            var $1424 = $1425;
        } else {
            var $1429 = 35;
            var $1424 = $1429;
        }
        return $1424;
    }
    const Nat$show_digit = x0 => x1 => Nat$show_digit$(x0, x1);
    function Nat$to_string_base$(_base$1, _nat$2) {
        var $1430 = List$fold$(Nat$to_base$(_base$1, _nat$2), String$nil, _n$3 => _str$4 => {
            var $1431 = String$cons$(Nat$show_digit$(_base$1, _n$3), _str$4);
            return $1431;
        });
        return $1430;
    }
    const Nat$to_string_base = x0 => x1 => Nat$to_string_base$(x0, x1);
    function Nat$show$(_n$1) {
        var $1432 = Nat$to_string_base$(10n, _n$1);
        return $1432;
    }
    const Nat$show = x0 => Nat$show$(x0);
    function App$Kaelin$Draw$draft$positions_go$(_players$1, _coord$2, _nat$3, _id$4, _user$5) {
        var _team$6 = Maybe$default$(App$Kaelin$Coord$draft$to_team$(_user$5, _players$1), App$Kaelin$Team$neutral);
        var self = App$Kaelin$Coord$draft$to_xy$(_coord$2, _team$6);
        switch (self._) {
          case "Pair.new":
            var $1434 = self.fst;
            var $1435 = self.snd;
            var _top$9 = Nat$show$(BigInt($1435)) + "%";
            var _left$10 = Nat$show$(BigInt($1434)) + "%";
            var _size$11 = Nat$show$(BigInt((App$Kaelin$Constants$draft_hexagon_radius * 2 >>> 0) - 1 >>> 0)) + "%";
            var _margin$12 = Nat$show$(BigInt(App$Kaelin$Constants$draft_hexagon_radius));
            var self = _user$5 === _id$4;
            if (self) {
                var $1437 = "#0FB735";
                var _color$13 = $1437;
            } else {
                var _x$13 = Map$get$(_id$4, _players$1);
                var self = _x$13;
                switch (self._) {
                  case "Maybe.none":
                    var $1439 = "#B97A57";
                    var $1438 = $1439;
                    break;

                  case "Maybe.some":
                    var $1440 = "#4B97E2";
                    var $1438 = $1440;
                    break;
                }
                var _color$13 = $1438;
            }
            ;
            var $1436 = DOM$node$("div", Map$from_list$(List$cons$(Pair$new$("id", "C" + Nat$show$(_nat$3)), List$nil)), Map$from_list$(List$cons$(Pair$new$("width", _size$11), List$cons$(Pair$new$("height", _size$11), List$cons$(Pair$new$("margin", "-" + (_margin$12 + ("% 0px 0px -" + (_margin$12 + "%")))), List$cons$(Pair$new$("position", "absolute"), List$cons$(Pair$new$("top", _top$9), List$cons$(Pair$new$("left", _left$10), List$cons$(Pair$new$("clip-path", "polygon(0% 25%, 0% 75%, 50% 100%, 100% 75%, 100% 25%, 50% 0%)"), List$cons$(Pair$new$("background", _color$13), List$nil))))))))), List$nil);
            var $1433 = $1436;
            break;
        }
        return $1433;
    }
    const App$Kaelin$Draw$draft$positions_go = x0 => x1 => x2 => x3 => x4 => App$Kaelin$Draw$draft$positions_go$(x0, x1, x2, x3, x4);
    function App$Kaelin$Draw$draft$positions$(_players$1, _coords$2, _user$3) {
        var self = _coords$2;
        switch (self._) {
          case "Pair.new":
            var _team$6 = Maybe$default$(App$Kaelin$Coord$draft$to_team$(_user$3, _players$1), App$Kaelin$Team$neutral);
            var _map$7 = App$Kaelin$Coord$draft$to_map$(_team$6, _coords$2);
            var _map$8 = NatMap$to_list$(_map$7);
            var _list$9 = List$nil;
            var _list$10 = (() => {
                var $1444 = _list$9;
                var $1445 = _map$8;
                let _list$11 = $1444;
                let _pair$10;
                while ($1445._ === "List.cons") {
                    _pair$10 = $1445.head;
                    var self = _pair$10;
                    switch (self._) {
                      case "Pair.new":
                        var $1446 = self.fst;
                        var $1447 = self.snd;
                        var _coord$14 = App$Kaelin$Coord$Convert$nat_to_axial$($1446);
                        var $1448 = List$cons$(App$Kaelin$Draw$draft$positions_go$(_players$1, _coord$14, $1446, $1447, _user$3), _list$11);
                        var $1444 = $1448;
                        break;
                    }
                    _list$11 = $1444;
                    $1445 = $1445.tail;
                }
                return _list$11;
            })();
            var $1442 = _list$10;
            var $1441 = $1442;
            break;
        }
        return $1441;
    }
    const App$Kaelin$Draw$draft$positions = x0 => x1 => x2 => App$Kaelin$Draw$draft$positions$(x0, x1, x2);
    function App$Kaelin$Draw$draft$map_space$(_players$1, _coords$2, _user$3) {
        var $1449 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("width", "100%"), List$cons$(Pair$new$("height", "0"), List$cons$(Pair$new$("border", "5px solid #d6dadc"), List$cons$(Pair$new$("border-radius", "15px"), List$cons$(Pair$new$("background-color", "#d6dadc"), List$cons$(Pair$new$("position", "relative"), List$cons$(Pair$new$("padding-top", "100%"), List$nil)))))))), App$Kaelin$Draw$draft$positions$(_players$1, _coords$2, _user$3));
        return $1449;
    }
    const App$Kaelin$Draw$draft$map_space = x0 => x1 => x2 => App$Kaelin$Draw$draft$map_space$(x0, x1, x2);
    function App$Kaelin$Draw$draft$map$(_players$1, _coords$2, _user$3) {
        var $1450 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("width", "30%"), List$cons$(Pair$new$("height", "100%"), List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("align-items", "center"), List$cons$(Pair$new$("padding", "10% 0px 10% 2%"), List$nil)))))), List$cons$(App$Kaelin$Draw$draft$map_space$(_players$1, _coords$2, _user$3), List$nil));
        return $1450;
    }
    const App$Kaelin$Draw$draft$map = x0 => x1 => x2 => App$Kaelin$Draw$draft$map$(x0, x1, x2);
    function BitsMap$delete$(_key$2, _map$3) {
        var self = _map$3;
        switch (self._) {
          case "BitsMap.tie":
            var $1452 = self.val;
            var $1453 = self.lft;
            var $1454 = self.rgt;
            var self = _key$2;
            switch (self.length === 0 ? "e" : self[self.length - 1] === "0" ? "o" : "i") {
              case "o":
                var $1456 = self.slice(0, -1);
                var $1457 = BitsMap$tie$($1452, BitsMap$delete$($1456, $1453), $1454);
                var $1455 = $1457;
                break;

              case "i":
                var $1458 = self.slice(0, -1);
                var $1459 = BitsMap$tie$($1452, $1453, BitsMap$delete$($1458, $1454));
                var $1455 = $1459;
                break;

              case "e":
                var $1460 = BitsMap$tie$(Maybe$none, $1453, $1454);
                var $1455 = $1460;
                break;
            }
            ;
            var $1451 = $1455;
            break;

          case "BitsMap.new":
            var $1461 = BitsMap$new;
            var $1451 = $1461;
            break;
        }
        return $1451;
    }
    const BitsMap$delete = x0 => x1 => BitsMap$delete$(x0, x1);
    function Map$delete$(_key$2, _map$3) {
        var $1462 = BitsMap$delete$(String$to_bits$(_key$2), _map$3);
        return $1462;
    }
    const Map$delete = x0 => x1 => Map$delete$(x0, x1);
    const App$Kaelin$Draw$draft$croni = "data:image/gif;base64,R0lGODlhGAAYAPMAAAAAABYOIzUdTSojT1MeSN8+Rmo6hmlli4B9msPCzQAAAAAAAAAAAAAAAAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh/iZFZGl0ZWQgd2l0aCBlemdpZi5jb20gb25saW5lIEdJRiBtYWtlcgAh+QQNCgAKACwAAAAAGAAYAAAEkVDJSau9eIK9M95JmCCAR4HiWJoSkIYkq3C0ym6DoesDEHuA3G5o6GSCxKTRgkzucr5VBUAMBJ7U6AVw1VmtOpcP8TsRvmdwEUaWagpnAlztIreZ6UA+PLK7NV9WQnV+RwOHQgY9dmVMAwkHBwlYd4aQCJJYf1OPkWSTWJY+B22gBgmbGqgAAgKsrimpMrO0FREAIfkEDQoACgAsAAAAABgAGAAABI1QyUmrvVgBkLsGScJ5FhiKZGWGyJhqJ+umW721NDAYPD9sJF1vyJtdhEQi8LhL9nYAXIkYCDwBhqiUArDyqtWiCEE2aghgdDjLIm8lgAKaIF+b3O9zGixO4M1dYAFNG35uZnBNRD9/GDoJBwcJQ4x5E4+RZJNXiBoDYwdlmzwoJSEbAgIAqSunL6+wGBEAIfkEDQoACgAsAAAAABgAGAAABIxQyUmrvThrBfrWQJJ0wGeFYoJ45oSKyNpKLyybZK7eWTcYQOAAECv1fsGkgcirAJDKJNHohEYNv+kFoAwEgsNl8fQFer3AELNJI5zd6KWNzSm4CfY4KkYHwAN/aTtjZGcBSCR8VCcDCQcHCUlDWluNjzGRYENbTyMIB0WZQSNOKR0CAgCoNSKLM6+wEQAh+QQNCgAKACwAAAAAGAAYAAAEilDJSau9OOvNu1dAGH4TkJznSJpogqibKJ/Iq4WDoesDWwMYQG5HNPhsFWFxafolh0ue0eUsFQOBXW9aQ0oAWR0WqzMdvSDCWE2eorrAUkFNmLdZtOqXHeCX33olY1hDInloJQMJBwcJRD0AgYmLBzWOWpAWOAmRlS+XO5xJKCECAgCmeKQkrK0KEQAh+QQNCgAKACwAAAAAGAAYAAAEjlDJSau9OGsMwNZAknTfFYqIV1InqmZd3IloygGDoetDm9gW3G6oayGAEyGReDq+FMolz9BEQomBwK5HrT0BWl02WxzVrADCWE3u0o7ogpogbxudlfR6XD4/JWBjATlUVVYshEQ9cH+ICQcHCUOLjUkDjwdHkluVgJcACJkpmzojJiIdAgIAqj6mK7CxFxEAIfkEDQoACgAsAAAAABgAGAAABJBQyUmrvThrDfq+HZAkwEd144iUW+iqbNYNRl0P4srRdm8AOgyA5+sBYydi0UA7gnyBgA33C1YA0lo0WhMBEdYJgLAlc38qMFICKJAJ7rMoAQ6zzQF8l15fs7dRPHN1dmIDh0Q4hH6GCQcHCVNfjI0HCJCSlGwDjpYIkZIynECeIjYkMiQAAgKrrSmoJrKzGxEAOw==";
    function App$Kaelin$Draw$draft$player$(_hero$1) {
        var self = _hero$1;
        switch (self._) {
          case "Maybe.some":
            var $1464 = self.value;
            var _hero$3 = App$Kaelin$Hero$info$($1464);
            var self = _hero$3;
            switch (self._) {
              case "Maybe.some":
                var $1466 = self.value;
                var self = $1466;
                switch (self._) {
                  case "App.Kaelin.Hero.new":
                    var $1468 = self.name;
                    var $1469 = $1468;
                    var $1467 = $1469;
                    break;
                }
                ;
                var $1465 = $1467;
                break;

              case "Maybe.none":
                var $1470 = "Choosing";
                var $1465 = $1470;
                break;
            }
            ;
            var _name$2 = $1465;
            break;

          case "Maybe.none":
            var $1471 = "Choosing";
            var _name$2 = $1471;
            break;
        }
        var $1463 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("width", "100%"), List$cons$(Pair$new$("height", "100%"), List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("border", "5px solid #d6dadc"), List$cons$(Pair$new$("background-color", "#bac1c4"), List$cons$(Pair$new$("margin", "3%"), List$cons$(Pair$new$("border-radius", "5px"), List$cons$(Pair$new$("flex-direction", "column"), List$cons$(Pair$new$("justify-content", "space-between"), List$cons$(Pair$new$("align-items", "center"), List$cons$(Pair$new$("box-sizing", "border-box"), List$nil)))))))))))), List$cons$(DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("height", "10%"), List$cons$(Pair$new$("margin-top", "5%"), List$nil))), List$cons$(DOM$text$(_name$2), List$nil)), List$cons$(DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("width", "50%"), List$cons$(Pair$new$("height", "auto"), List$nil))), List$cons$(DOM$node$("img", Map$from_list$(List$cons$(Pair$new$("src", App$Kaelin$Draw$draft$croni), List$nil)), Map$from_list$(List$cons$(Pair$new$("width", "100%"), List$cons$(Pair$new$("height", "auto"), List$cons$(Pair$new$("image-rendering", "pixelated"), List$nil)))), List$nil), List$nil)), List$cons$(DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("width", "100%"), List$cons$(Pair$new$("height", "40%"), List$cons$(Pair$new$("background-color", "#d6dadc"), List$nil)))), List$nil), List$nil))));
        return $1463;
    }
    const App$Kaelin$Draw$draft$player = x0 => App$Kaelin$Draw$draft$player$(x0);
    function App$Kaelin$Draw$draft$picks_left$(_hero$1) {
        var $1472 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("width", "40%"), List$cons$(Pair$new$("height", "100%"), List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("padding", "5%"), List$cons$(Pair$new$("box-sizing", "border-box"), List$nil)))))), List$cons$(App$Kaelin$Draw$draft$player$(_hero$1), List$nil));
        return $1472;
    }
    const App$Kaelin$Draw$draft$picks_left = x0 => App$Kaelin$Draw$draft$picks_left$(x0);
    function App$Kaelin$Team$eql$(_a$1, _b$2) {
        var self = _a$1;
        switch (self._) {
          case "App.Kaelin.Team.red":
            var self = _b$2;
            switch (self._) {
              case "App.Kaelin.Team.red":
                var $1475 = Bool$true;
                var $1474 = $1475;
                break;

              case "App.Kaelin.Team.blue":
              case "App.Kaelin.Team.neutral":
                var $1476 = Bool$false;
                var $1474 = $1476;
                break;
            }
            ;
            var $1473 = $1474;
            break;

          case "App.Kaelin.Team.blue":
            var self = _b$2;
            switch (self._) {
              case "App.Kaelin.Team.red":
              case "App.Kaelin.Team.neutral":
                var $1478 = Bool$false;
                var $1477 = $1478;
                break;

              case "App.Kaelin.Team.blue":
                var $1479 = Bool$true;
                var $1477 = $1479;
                break;
            }
            ;
            var $1473 = $1477;
            break;

          case "App.Kaelin.Team.neutral":
            var self = _b$2;
            switch (self._) {
              case "App.Kaelin.Team.red":
              case "App.Kaelin.Team.blue":
                var $1481 = Bool$false;
                var $1480 = $1481;
                break;

              case "App.Kaelin.Team.neutral":
                var $1482 = Bool$true;
                var $1480 = $1482;
                break;
            }
            ;
            var $1473 = $1480;
            break;
        }
        return $1473;
    }
    const App$Kaelin$Team$eql = x0 => x1 => App$Kaelin$Team$eql$(x0, x1);
    const List$length = a0 => list_length(a0);
    const Nat$eql = a0 => a1 => a0 === a1;
    function Nat$for$(_state$2, _from$3, _til$4, _func$5) {
        var Nat$for$ = (_state$2, _from$3, _til$4, _func$5) => ({
            ctr: "TCO",
            arg: [ _state$2, _from$3, _til$4, _func$5 ]
        });
        var Nat$for = _state$2 => _from$3 => _til$4 => _func$5 => Nat$for$(_state$2, _from$3, _til$4, _func$5);
        var arg = [ _state$2, _from$3, _til$4, _func$5 ];
        while (true) {
            let [ _state$2, _from$3, _til$4, _func$5 ] = arg;
            var R = (() => {
                var self = _from$3 === _til$4;
                if (self) {
                    var $1483 = _state$2;
                    return $1483;
                } else {
                    var $1484 = Nat$for$(_func$5(_from$3)(_state$2), Nat$succ$(_from$3), _til$4, _func$5);
                    return $1484;
                }
            })();
            if (R.ctr === "TCO") arg = R.arg; else return R;
        }
    }
    const Nat$for = x0 => x1 => x2 => x3 => Nat$for$(x0, x1, x2, x3);
    function App$Kaelin$Draw$draft$ally$(_user$1, _info$2) {
        var self = _info$2;
        switch (self._) {
          case "Maybe.some":
            var $1486 = self.value;
            var self = $1486;
            switch (self._) {
              case "App.Kaelin.DraftInfo.new":
                var $1488 = self.hero;
                var self = $1488;
                switch (self._) {
                  case "Maybe.some":
                    var $1490 = self.value;
                    var _hero$7 = App$Kaelin$Hero$info$($1490);
                    var self = _hero$7;
                    switch (self._) {
                      case "Maybe.some":
                        var $1492 = self.value;
                        var self = $1492;
                        switch (self._) {
                          case "App.Kaelin.Hero.new":
                            var $1494 = self.name;
                            var $1495 = $1494;
                            var $1493 = $1495;
                            break;
                        }
                        ;
                        var $1491 = $1493;
                        break;

                      case "Maybe.none":
                        var $1496 = "Choosing";
                        var $1491 = $1496;
                        break;
                    }
                    ;
                    var $1489 = $1491;
                    break;

                  case "Maybe.none":
                    var $1497 = "Choosing";
                    var $1489 = $1497;
                    break;
                }
                ;
                var $1487 = $1489;
                break;
            }
            ;
            var _name$3 = $1487;
            break;

          case "Maybe.none":
            var $1498 = "Connecting";
            var _name$3 = $1498;
            break;
        }
        var $1485 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("width", "100%"), List$cons$(Pair$new$("height", "80%"), List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("border", "5px solid #d6dadc"), List$cons$(Pair$new$("background-color", "#bac1c4"), List$cons$(Pair$new$("margin", "3%"), List$cons$(Pair$new$("border-radius", "5px"), List$cons$(Pair$new$("flex-direction", "column"), List$cons$(Pair$new$("justify-content", "space-between"), List$cons$(Pair$new$("align-items", "center"), List$cons$(Pair$new$("box-sizing", "border-box"), List$nil)))))))))))), List$cons$(DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("height", "10%"), List$cons$(Pair$new$("margin-top", "5%"), List$nil))), List$cons$(DOM$text$(_name$3), List$nil)), List$cons$(DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("width", "50%"), List$cons$(Pair$new$("height", "auto"), List$nil))), List$cons$(DOM$node$("img", Map$from_list$(List$cons$(Pair$new$("src", App$Kaelin$Draw$draft$croni), List$nil)), Map$from_list$(List$cons$(Pair$new$("width", "100%"), List$cons$(Pair$new$("height", "auto"), List$cons$(Pair$new$("image-rendering", "pixelated"), List$nil)))), List$nil), List$nil)), List$cons$(DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("width", "100%"), List$cons$(Pair$new$("height", "40%"), List$cons$(Pair$new$("background-color", "#d6dadc"), List$nil)))), List$nil), List$nil))));
        return $1485;
    }
    const App$Kaelin$Draw$draft$ally = x0 => x1 => App$Kaelin$Draw$draft$ally$(x0, x1);
    function App$Kaelin$Draw$draft$allies$(_map$1, _team$2) {
        var _lst$3 = Map$to_list$(_map$1);
        var _teammates$4 = List$nil;
        var _teammates$5 = (() => {
            var $1501 = _teammates$4;
            var $1502 = _lst$3;
            let _teammates$6 = $1501;
            let _info$5;
            while ($1502._ === "List.cons") {
                _info$5 = $1502.head;
                var self = _info$5;
                switch (self._) {
                  case "Pair.new":
                    var $1503 = self.snd;
                    var self = App$Kaelin$Team$eql$(_team$2, (() => {
                        var self = $1503;
                        switch (self._) {
                          case "App.Kaelin.DraftInfo.new":
                            var $1505 = self.team;
                            var $1506 = $1505;
                            return $1506;
                        }
                    })());
                    if (self) {
                        var $1507 = List$cons$(_info$5, _teammates$6);
                        var $1504 = $1507;
                    } else {
                        var $1508 = _teammates$6;
                        var $1504 = $1508;
                    }
                    ;
                    var $1501 = $1504;
                    break;
                }
                _teammates$6 = $1501;
                $1502 = $1502.tail;
            }
            return _teammates$6;
        })();
        var _count$6 = 2n - list_length(_teammates$5) <= 0n ? 0n : 2n - list_length(_teammates$5);
        var _dom$7 = List$nil;
        var _dom$8 = Nat$for$(_dom$7, 0n, _count$6, _i$8 => _dom$9 => {
            var $1509 = List$cons$(App$Kaelin$Draw$draft$ally$("none", Maybe$none), _dom$9);
            return $1509;
        });
        var _dom$9 = (() => {
            var $1511 = _dom$8;
            var $1512 = _teammates$5;
            let _dom$10 = $1511;
            let _pair$9;
            while ($1512._ === "List.cons") {
                _pair$9 = $1512.head;
                var $1511 = List$cons$(App$Kaelin$Draw$draft$ally$((() => {
                    var self = _pair$9;
                    switch (self._) {
                      case "Pair.new":
                        var $1513 = self.fst;
                        var $1514 = $1513;
                        return $1514;
                    }
                })(), Maybe$some$((() => {
                    var self = _pair$9;
                    switch (self._) {
                      case "Pair.new":
                        var $1515 = self.snd;
                        var $1516 = $1515;
                        return $1516;
                    }
                })())), _dom$10);
                _dom$10 = $1511;
                $1512 = $1512.tail;
            }
            return _dom$10;
        })();
        var $1499 = _dom$9;
        return $1499;
    }
    const App$Kaelin$Draw$draft$allies = x0 => x1 => App$Kaelin$Draw$draft$allies$(x0, x1);
    function App$Kaelin$Draw$draft$picks_right$(_map$1, _team$2) {
        var $1517 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("width", "60%"), List$cons$(Pair$new$("height", "100%"), List$cons$(Pair$new$("padding", "3%"), List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("flex-direction", "row"), List$cons$(Pair$new$("align-items", "center"), List$cons$(Pair$new$("box-sizing", "border-box"), List$nil)))))))), App$Kaelin$Draw$draft$allies$(_map$1, _team$2));
        return $1517;
    }
    const App$Kaelin$Draw$draft$picks_right = x0 => x1 => App$Kaelin$Draw$draft$picks_right$(x0, x1);
    function App$Kaelin$Draw$draft$picks$(_players$1, _user$2) {
        var _team$3 = Maybe$default$(App$Kaelin$Coord$draft$to_team$(_user$2, _players$1), App$Kaelin$Team$neutral);
        var _player$4 = Map$get$(_user$2, _players$1);
        var _allies$5 = Map$delete$(_user$2, _players$1);
        var self = _player$4;
        switch (self._) {
          case "Maybe.some":
            var $1519 = self.value;
            var _player$7 = $1519;
            var self = _player$7;
            switch (self._) {
              case "App.Kaelin.DraftInfo.new":
                var $1521 = self.hero;
                var $1522 = $1521;
                var $1520 = $1522;
                break;
            }
            ;
            var _hero$6 = $1520;
            break;

          case "Maybe.none":
            var $1523 = Maybe$none;
            var _hero$6 = $1523;
            break;
        }
        var $1518 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("width", "70%"), List$cons$(Pair$new$("height", "100%"), List$cons$(Pair$new$("display", "flex"), List$nil)))), List$cons$(App$Kaelin$Draw$draft$picks_left$(_hero$6), List$cons$(App$Kaelin$Draw$draft$picks_right$(_allies$5, _team$3), List$nil)));
        return $1518;
    }
    const App$Kaelin$Draw$draft$picks = x0 => x1 => App$Kaelin$Draw$draft$picks$(x0, x1);
    function App$Kaelin$Draw$draft$top$(_players$1, _coords$2, _user$3) {
        var _team$4 = Maybe$default$(App$Kaelin$Coord$draft$to_team$(_user$3, _players$1), App$Kaelin$Team$neutral);
        var self = App$Kaelin$Team$show$(_team$4) === "blue";
        if (self) {
            var $1525 = "linear-gradient(#3fbcf2, #3791d4)";
            var _color$5 = $1525;
        } else {
            var self = App$Kaelin$Team$show$(_team$4) === "red";
            if (self) {
                var $1527 = "linear-gradient(#ff6666, #ff4d4d)";
                var $1526 = $1527;
            } else {
                var $1528 = "linear-gradient(#94b8b8, #75a3a3)";
                var $1526 = $1528;
            }
            var _color$5 = $1526;
        }
        var $1524 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("width", "100%"), List$cons$(Pair$new$("height", "60%"), List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("background-image", _color$5), List$cons$(Pair$new$("align-items", "center"), List$cons$(Pair$new$("justify-content", "center"), List$nil))))))), List$cons$(App$Kaelin$Draw$draft$map$(_players$1, _coords$2, _user$3), List$cons$(App$Kaelin$Draw$draft$picks$(_players$1, _user$3), List$nil)));
        return $1524;
    }
    const App$Kaelin$Draw$draft$top = x0 => x1 => x2 => App$Kaelin$Draw$draft$top$(x0, x1, x2);
    function App$Kaelin$Draw$draft$selection$(_hero$1) {
        var $1529 = DOM$node$("div", Map$from_list$(List$cons$(Pair$new$("id", "H" + (() => {
            var self = _hero$1;
            switch (self._) {
              case "App.Kaelin.Hero.new":
                var $1530 = self.name;
                var $1531 = $1530;
                return $1531;
            }
        })()), List$cons$(Pair$new$("action", (() => {
            var self = _hero$1;
            switch (self._) {
              case "App.Kaelin.Hero.new":
                var $1532 = self.name;
                var $1533 = $1532;
                return $1533;
            }
        })()), List$nil))), Map$from_list$(List$cons$(Pair$new$("margin", "4px"), List$cons$(Pair$new$("border", "5px solid #d6dadc"), List$cons$(Pair$new$("background-color", "#bac1c4"), List$cons$(Pair$new$("height", "0"), List$cons$(Pair$new$("padding-bottom", "10%"), List$cons$(Pair$new$("width", "10%"), List$cons$(Pair$new$("border-radius", "5px"), List$nil)))))))), List$cons$(DOM$node$("div", Map$from_list$(List$cons$(Pair$new$("id", "H" + (() => {
            var self = _hero$1;
            switch (self._) {
              case "App.Kaelin.Hero.new":
                var $1534 = self.name;
                var $1535 = $1534;
                return $1535;
            }
        })()), List$cons$(Pair$new$("action", (() => {
            var self = _hero$1;
            switch (self._) {
              case "App.Kaelin.Hero.new":
                var $1536 = self.name;
                var $1537 = $1536;
                return $1537;
            }
        })()), List$nil))), Map$from_list$(List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("justify-content", "center"), List$cons$(Pair$new$("font-size", "1.2vw"), List$nil)))), List$cons$(DOM$text$((() => {
            var self = _hero$1;
            switch (self._) {
              case "App.Kaelin.Hero.new":
                var $1538 = self.name;
                var $1539 = $1538;
                return $1539;
            }
        })()), List$nil)), List$cons$(DOM$node$("div", Map$from_list$(List$cons$(Pair$new$("id", "H" + (() => {
            var self = _hero$1;
            switch (self._) {
              case "App.Kaelin.Hero.new":
                var $1540 = self.name;
                var $1541 = $1540;
                return $1541;
            }
        })()), List$cons$(Pair$new$("action", (() => {
            var self = _hero$1;
            switch (self._) {
              case "App.Kaelin.Hero.new":
                var $1542 = self.name;
                var $1543 = $1542;
                return $1543;
            }
        })()), List$nil))), Map$from_list$(List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("justify-content", "center"), List$cons$(Pair$new$("height", "100%"), List$cons$(Pair$new$("width", "100%"), List$nil))))), List$cons$(DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("padding", "2px"), List$cons$(Pair$new$("height", "100%"), List$cons$(Pair$new$("width", "100%"), List$nil)))), List$cons$(DOM$node$("img", Map$from_list$(List$cons$(Pair$new$("src", App$Kaelin$Draw$draft$croni), List$cons$(Pair$new$("id", "H" + (() => {
            var self = _hero$1;
            switch (self._) {
              case "App.Kaelin.Hero.new":
                var $1544 = self.name;
                var $1545 = $1544;
                return $1545;
            }
        })()), List$cons$(Pair$new$("action", (() => {
            var self = _hero$1;
            switch (self._) {
              case "App.Kaelin.Hero.new":
                var $1546 = self.name;
                var $1547 = $1546;
                return $1547;
            }
        })()), List$nil)))), Map$from_list$(List$cons$(Pair$new$("width", "75%"), List$cons$(Pair$new$("margin-left", "12.5%"), List$cons$(Pair$new$("height", "auto"), List$cons$(Pair$new$("image-rendering", "pixelated"), List$nil))))), List$nil), List$nil)), List$nil)), List$nil)));
        return $1529;
    }
    const App$Kaelin$Draw$draft$selection = x0 => App$Kaelin$Draw$draft$selection$(x0);
    function App$Kaelin$Draw$draft$bottom_left$(_players$1) {
        var _heroes$2 = List$map$(Pair$snd, Map$to_list$(App$Kaelin$Resources$heroes));
        var $1548 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("width", "85%"), List$cons$(Pair$new$("height", "100%"), List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("justify-content", "center"), List$cons$(Pair$new$("align-items", "center"), List$nil)))))), List$cons$(DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("flex-wrap", "wrap"), List$cons$(Pair$new$("justify-content", "center"), List$cons$(Pair$new$("width", "100%"), List$nil))))), List$map$(App$Kaelin$Draw$draft$selection, _heroes$2)), List$nil));
        return $1548;
    }
    const App$Kaelin$Draw$draft$bottom_left = x0 => App$Kaelin$Draw$draft$bottom_left$(x0);
    const App$Kaelin$Draw$draft$bottom_right = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("width", "15%"), List$cons$(Pair$new$("height", "auto"), List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("justify-content", "center"), List$cons$(Pair$new$("align-items", "center"), List$nil)))))), List$cons$(DOM$node$("button", Map$from_list$(List$cons$(Pair$new$("id", "Ready"), List$nil)), Map$from_list$(List$cons$(Pair$new$("background-color", "#4CAF50"), List$cons$(Pair$new$("border", "none"), List$cons$(Pair$new$("color", "white"), List$cons$(Pair$new$("padding", "32px"), List$cons$(Pair$new$("text-align", "center"), List$cons$(Pair$new$("text-decoration", "none"), List$cons$(Pair$new$("display", "inline-block"), List$cons$(Pair$new$("font-size", "32px"), List$cons$(Pair$new$("margin", "4px 2px"), List$cons$(Pair$new$("cursor", "pointer"), List$nil))))))))))), List$cons$(DOM$text$("Ready"), List$nil)), List$nil));
    function App$Kaelin$Draw$draft$bottom$(_players$1) {
        var _heroes$2 = List$map$(Pair$snd, Map$to_list$(App$Kaelin$Resources$heroes));
        var $1549 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("width", "100%"), List$cons$(Pair$new$("height", "40%"), List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("background-image", "linear-gradient(#0e0c0e, #242324)"), List$cons$(Pair$new$("justify-content", "center"), List$cons$(Pair$new$("align-items", "center"), List$nil))))))), List$cons$(App$Kaelin$Draw$draft$bottom_left$(_players$1), List$cons$(App$Kaelin$Draw$draft$bottom_right, List$nil)));
        return $1549;
    }
    const App$Kaelin$Draw$draft$bottom = x0 => App$Kaelin$Draw$draft$bottom$(x0);
    function App$Kaelin$Draw$draft$blue$(_players$1, _list$2) {
        var _length$3 = Nat$show$(list_length(_list$2));
        var _text$4 = _length$3 + "/3 Players";
        var $1550 = DOM$node$("button", Map$from_list$(List$cons$(Pair$new$("id", "T" + (_length$3 + "blue")), List$nil)), Map$from_list$(List$cons$(Pair$new$("width", "40%"), List$cons$(Pair$new$("height", "100%"), List$cons$(Pair$new$("background-image", "linear-gradient(#38a5fa, #2081e0)"), List$cons$(Pair$new$("box-shadow", "2px -2px 2px black"), List$cons$(Pair$new$("font-size", "8rem"), List$nil)))))), List$cons$(DOM$text$(_text$4), List$nil));
        return $1550;
    }
    const App$Kaelin$Draw$draft$blue = x0 => x1 => App$Kaelin$Draw$draft$blue$(x0, x1);
    function App$Kaelin$Draw$draft$red$(_players$1, _list$2) {
        var _length$3 = Nat$show$(list_length(_list$2));
        var _text$4 = _length$3 + "/3 Players";
        var $1551 = DOM$node$("button", Map$from_list$(List$cons$(Pair$new$("id", "T" + (_length$3 + "red")), List$nil)), Map$from_list$(List$cons$(Pair$new$("width", "40%"), List$cons$(Pair$new$("height", "100%"), List$cons$(Pair$new$("background-image", "linear-gradient(#ff3537, #d60f10)"), List$cons$(Pair$new$("box-shadow", "2px -2px 2px black"), List$cons$(Pair$new$("font-size", "8rem"), List$nil)))))), List$cons$(DOM$text$(_text$4), List$nil));
        return $1551;
    }
    const App$Kaelin$Draw$draft$red = x0 => x1 => App$Kaelin$Draw$draft$red$(x0, x1);
    function App$Kaelin$Draw$draft$choose_team$(_players$1) {
        var _list$2 = Map$to_list$(_players$1);
        var _pair$3 = Pair$new$(List$nil, List$nil);
        var _pair$4 = (() => {
            var $1554 = _pair$3;
            var $1555 = _list$2;
            let _pair$5 = $1554;
            let _player$4;
            while ($1555._ === "List.cons") {
                _player$4 = $1555.head;
                var self = _player$4;
                switch (self._) {
                  case "Pair.new":
                    var $1556 = self.fst;
                    var $1557 = self.snd;
                    var self = $1557;
                    switch (self._) {
                      case "App.Kaelin.DraftInfo.new":
                        var $1559 = self.team;
                        var self = App$Kaelin$Team$show$($1559) === "blue";
                        if (self) {
                            var $1561 = Pair$new$(List$cons$($1556, (() => {
                                var self = _pair$5;
                                switch (self._) {
                                  case "Pair.new":
                                    var $1562 = self.fst;
                                    var $1563 = $1562;
                                    return $1563;
                                }
                            })()), (() => {
                                var self = _pair$5;
                                switch (self._) {
                                  case "Pair.new":
                                    var $1564 = self.snd;
                                    var $1565 = $1564;
                                    return $1565;
                                }
                            })());
                            var $1560 = $1561;
                        } else {
                            var self = App$Kaelin$Team$show$($1559) === "red";
                            if (self) {
                                var $1567 = Pair$new$((() => {
                                    var self = _pair$5;
                                    switch (self._) {
                                      case "Pair.new":
                                        var $1568 = self.fst;
                                        var $1569 = $1568;
                                        return $1569;
                                    }
                                })(), List$cons$($1556, (() => {
                                    var self = _pair$5;
                                    switch (self._) {
                                      case "Pair.new":
                                        var $1570 = self.snd;
                                        var $1571 = $1570;
                                        return $1571;
                                    }
                                })()));
                                var $1566 = $1567;
                            } else {
                                var $1572 = _pair$5;
                                var $1566 = $1572;
                            }
                            var $1560 = $1566;
                        }
                        ;
                        var $1558 = $1560;
                        break;
                    }
                    ;
                    var $1554 = $1558;
                    break;
                }
                _pair$5 = $1554;
                $1555 = $1555.tail;
            }
            return _pair$5;
        })();
        var self = _pair$4;
        switch (self._) {
          case "Pair.new":
            var $1573 = self.fst;
            var $1574 = $1573;
            var _blue$5 = $1574;
            break;
        }
        var self = _pair$4;
        switch (self._) {
          case "Pair.new":
            var $1575 = self.snd;
            var $1576 = $1575;
            var _red$6 = $1576;
            break;
        }
        var $1552 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("width", "60%"), List$cons$(Pair$new$("height", "30%"), List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("flex-direction", "row"), List$cons$(Pair$new$("justify-content", "space-between"), List$nil)))))), List$cons$(App$Kaelin$Draw$draft$blue$(_players$1, _blue$5), List$cons$(App$Kaelin$Draw$draft$red$(_players$1, _red$6), List$nil)));
        return $1552;
    }
    const App$Kaelin$Draw$draft$choose_team = x0 => App$Kaelin$Draw$draft$choose_team$(x0);
    function App$Kaelin$Draw$draft$main$(_players$1, _coords$2, _user$3) {
        var _player$4 = Map$get$(_user$3, _players$1);
        var _normal$5 = List$cons$(App$Kaelin$Draw$draft$top$(_players$1, _coords$2, _user$3), List$cons$(App$Kaelin$Draw$draft$bottom$(_players$1), List$nil));
        var self = _player$4;
        switch (self._) {
          case "Maybe.some":
            var $1578 = self.value;
            var self = App$Kaelin$Team$show$((() => {
                var self = $1578;
                switch (self._) {
                  case "App.Kaelin.DraftInfo.new":
                    var $1580 = self.team;
                    var $1581 = $1580;
                    return $1581;
                }
            })()) === "blue";
            if (self) {
                var $1582 = _normal$5;
                var $1579 = $1582;
            } else {
                var self = App$Kaelin$Team$show$((() => {
                    var self = $1578;
                    switch (self._) {
                      case "App.Kaelin.DraftInfo.new":
                        var $1584 = self.team;
                        var $1585 = $1584;
                        return $1585;
                    }
                })()) === "red";
                if (self) {
                    var $1586 = _normal$5;
                    var $1583 = $1586;
                } else {
                    var $1587 = List$cons$(App$Kaelin$Draw$draft$choose_team$(_players$1), List$nil);
                    var $1583 = $1587;
                }
                var $1579 = $1583;
            }
            ;
            var _draw$6 = $1579;
            break;

          case "Maybe.none":
            var $1588 = List$cons$(App$Kaelin$Draw$draft$choose_team$(_players$1), List$nil);
            var _draw$6 = $1588;
            break;
        }
        var $1577 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("width", "100vw"), List$cons$(Pair$new$("height", "100vh"), List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("flex-direction", "column"), List$cons$(Pair$new$("justify-content", "center"), List$cons$(Pair$new$("align-items", "center"), List$cons$(Pair$new$("font-size", "2rem"), List$nil)))))))), _draw$6);
        return $1577;
    }
    const App$Kaelin$Draw$draft$main = x0 => x1 => x2 => App$Kaelin$Draw$draft$main$(x0, x1, x2);
    function App$Kaelin$Draw$draft$(_players$1, _coords$2, _user$3) {
        var _heroes$4 = List$map$(Pair$snd, Map$to_list$(App$Kaelin$Resources$heroes));
        var $1589 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("width", "100vw"), List$cons$(Pair$new$("height", "100vh"), List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("justify-content", "center"), List$cons$(Pair$new$("align-items", "center"), List$nil)))))), List$cons$(App$Kaelin$Draw$draft$main$(_players$1, _coords$2, _user$3), List$nil));
        return $1589;
    }
    const App$Kaelin$Draw$draft = x0 => x1 => x2 => App$Kaelin$Draw$draft$(x0, x1, x2);
    function String$drop$(_n$1, _xs$2) {
        var String$drop$ = (_n$1, _xs$2) => ({
            ctr: "TCO",
            arg: [ _n$1, _xs$2 ]
        });
        var String$drop = _n$1 => _xs$2 => String$drop$(_n$1, _xs$2);
        var arg = [ _n$1, _xs$2 ];
        while (true) {
            let [ _n$1, _xs$2 ] = arg;
            var R = (() => {
                var self = _n$1;
                if (self === 0n) {
                    var $1590 = _xs$2;
                    return $1590;
                } else {
                    var $1591 = self - 1n;
                    var self = _xs$2;
                    if (self.length === 0) {
                        var $1593 = String$nil;
                        var $1592 = $1593;
                    } else {
                        var $1594 = self.charCodeAt(0);
                        var $1595 = self.slice(1);
                        var $1596 = String$drop$($1591, $1595);
                        var $1592 = $1596;
                    }
                    return $1592;
                }
            })();
            if (R.ctr === "TCO") arg = R.arg; else return R;
        }
    }
    const String$drop = x0 => x1 => String$drop$(x0, x1);
    function List$head$(_xs$2) {
        var self = _xs$2;
        switch (self._) {
          case "List.cons":
            var $1598 = self.head;
            var $1599 = Maybe$some$($1598);
            var $1597 = $1599;
            break;

          case "List.nil":
            var $1600 = Maybe$none;
            var $1597 = $1600;
            break;
        }
        return $1597;
    }
    const List$head = x0 => List$head$(x0);
    function Char$eql$(_a$1, _b$2) {
        var $1601 = _a$1 === _b$2;
        return $1601;
    }
    const Char$eql = x0 => x1 => Char$eql$(x0, x1);
    function String$starts_with$(_xs$1, _match$2) {
        var String$starts_with$ = (_xs$1, _match$2) => ({
            ctr: "TCO",
            arg: [ _xs$1, _match$2 ]
        });
        var String$starts_with = _xs$1 => _match$2 => String$starts_with$(_xs$1, _match$2);
        var arg = [ _xs$1, _match$2 ];
        while (true) {
            let [ _xs$1, _match$2 ] = arg;
            var R = (() => {
                var self = _match$2;
                if (self.length === 0) {
                    var $1602 = Bool$true;
                    return $1602;
                } else {
                    var $1603 = self.charCodeAt(0);
                    var $1604 = self.slice(1);
                    var self = _xs$1;
                    if (self.length === 0) {
                        var $1606 = Bool$false;
                        var $1605 = $1606;
                    } else {
                        var $1607 = self.charCodeAt(0);
                        var $1608 = self.slice(1);
                        var self = Char$eql$($1603, $1607);
                        if (self) {
                            var $1610 = String$starts_with$($1608, $1604);
                            var $1609 = $1610;
                        } else {
                            var $1611 = Bool$false;
                            var $1609 = $1611;
                        }
                        var $1605 = $1609;
                    }
                    return $1605;
                }
            })();
            if (R.ctr === "TCO") arg = R.arg; else return R;
        }
    }
    const String$starts_with = x0 => x1 => String$starts_with$(x0, x1);
    function String$length$go$(_xs$1, _n$2) {
        var String$length$go$ = (_xs$1, _n$2) => ({
            ctr: "TCO",
            arg: [ _xs$1, _n$2 ]
        });
        var String$length$go = _xs$1 => _n$2 => String$length$go$(_xs$1, _n$2);
        var arg = [ _xs$1, _n$2 ];
        while (true) {
            let [ _xs$1, _n$2 ] = arg;
            var R = (() => {
                var self = _xs$1;
                if (self.length === 0) {
                    var $1612 = _n$2;
                    return $1612;
                } else {
                    var $1613 = self.charCodeAt(0);
                    var $1614 = self.slice(1);
                    var $1615 = String$length$go$($1614, Nat$succ$(_n$2));
                    return $1615;
                }
            })();
            if (R.ctr === "TCO") arg = R.arg; else return R;
        }
    }
    const String$length$go = x0 => x1 => String$length$go$(x0, x1);
    function String$length$(_xs$1) {
        var $1616 = String$length$go$(_xs$1, 0n);
        return $1616;
    }
    const String$length = x0 => String$length$(x0);
    function String$split$go$(_xs$1, _match$2, _last$3) {
        var self = _xs$1;
        if (self.length === 0) {
            var $1618 = List$cons$(_last$3, List$nil);
            var $1617 = $1618;
        } else {
            var $1619 = self.charCodeAt(0);
            var $1620 = self.slice(1);
            var self = String$starts_with$(_xs$1, _match$2);
            if (self) {
                var _rest$6 = String$drop$(String$length$(_match$2), _xs$1);
                var $1622 = List$cons$(_last$3, String$split$go$(_rest$6, _match$2, ""));
                var $1621 = $1622;
            } else {
                var _next$6 = String$cons$($1619, String$nil);
                var $1623 = String$split$go$($1620, _match$2, _last$3 + _next$6);
                var $1621 = $1623;
            }
            var $1617 = $1621;
        }
        return $1617;
    }
    const String$split$go = x0 => x1 => x2 => String$split$go$(x0, x1, x2);
    function String$split$(_xs$1, _match$2) {
        var $1624 = String$split$go$(_xs$1, _match$2, "");
        return $1624;
    }
    const String$split = x0 => x1 => String$split$(x0, x1);
    function Word$abs$(_a$2) {
        var _neg$3 = Word$is_neg$(_a$2);
        var self = _neg$3;
        if (self) {
            var $1626 = Word$neg$(_a$2);
            var $1625 = $1626;
        } else {
            var $1627 = _a$2;
            var $1625 = $1627;
        }
        return $1625;
    }
    const Word$abs = x0 => Word$abs$(x0);
    function Word$s_show$(_size$1, _a$2) {
        var _neg$3 = Word$is_neg$(_a$2);
        var _n$4 = Word$to_nat$(Word$abs$(_a$2));
        var self = _neg$3;
        if (self) {
            var $1629 = "-";
            var _sgn$5 = $1629;
        } else {
            var $1630 = "+";
            var _sgn$5 = $1630;
        }
        var $1628 = _sgn$5 + (Nat$show$(_n$4) + ("#" + Nat$show$(_size$1)));
        return $1628;
    }
    const Word$s_show = x0 => x1 => Word$s_show$(x0, x1);
    function I32$show$(_a$1) {
        var self = _a$1;
        switch ("i32") {
          case "i32":
            var $1632 = i32_to_word(self);
            var $1633 = Word$s_show$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$zero)))))))))))))))))))))))))))))))), $1632);
            var $1631 = $1633;
            break;
        }
        return $1631;
    }
    const I32$show = x0 => I32$show$(x0);
    function Word$show$(_size$1, _a$2) {
        var _n$3 = Word$to_nat$(_a$2);
        var $1634 = Nat$show$(_n$3) + ("#" + Nat$show$(_size$1));
        return $1634;
    }
    const Word$show = x0 => x1 => Word$show$(x0, x1);
    const U64$show = a0 => a0 + "#64";
    function App$Kaelin$Draw$game$round$(_seconds$1, _round$2) {
        var _round$3 = String$drop$(1n, Maybe$default$(List$head$(String$split$(I32$show$(_round$2), "#")), ""));
        var self = _seconds$1;
        switch (self._) {
          case "Maybe.some":
            var $1636 = self.value;
            var _seconds$5 = Maybe$default$(List$head$(String$split$($1636 + "#64", "#")), "");
            var $1637 = List$cons$(DOM$node$("p", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("margin-bottom", "5px"), List$nil)), List$cons$(DOM$text$("Round: " + _round$3), List$nil)), List$cons$(DOM$node$("p", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("text-align", "center"), List$nil)), List$cons$(DOM$text$(_seconds$5), List$nil)), List$nil));
            var $1635 = $1637;
            break;

          case "Maybe.none":
            var $1638 = List$cons$(DOM$node$("p", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("margin-bottom", "5px"), List$nil)), List$cons$(DOM$text$("Round: " + _round$3), List$nil)), List$nil);
            var $1635 = $1638;
            break;
        }
        return $1635;
    }
    const App$Kaelin$Draw$game$round = x0 => x1 => App$Kaelin$Draw$game$round$(x0, x1);
    function DOM$vbox$(_props$1, _style$2, _value$3) {
        var $1639 = {
            _: "DOM.vbox",
            props: _props$1,
            style: _style$2,
            value: _value$3
        };
        return $1639;
    }
    const DOM$vbox = x0 => x1 => x2 => DOM$vbox$(x0, x1, x2);
    const App$Kaelin$Constants$hexagon_radius = 15;
    const App$Kaelin$Constants$center_x = 256;
    const App$Kaelin$Constants$center_y = 128;
    const F64$sub = a0 => a1 => a0 - a1;
    function App$Kaelin$Coord$round$floor$(_n$1) {
        var $1640 = _n$1 >> 0;
        return $1640;
    }
    const App$Kaelin$Coord$round$floor = x0 => App$Kaelin$Coord$round$floor$(x0);
    function App$Kaelin$Coord$round$round_F64$(_n$1) {
        var _half$2 = .5;
        var _big_number$3 = 1e3;
        var _n$4 = _n$1 + _big_number$3;
        var _result$5 = App$Kaelin$Coord$round$floor$(_n$4 + _half$2);
        var $1641 = _result$5 - _big_number$3;
        return $1641;
    }
    const App$Kaelin$Coord$round$round_F64 = x0 => App$Kaelin$Coord$round$round_F64$(x0);
    function Word$gtn$(_a$2, _b$3) {
        var $1642 = Cmp$as_gtn$(Word$cmp$(_a$2, _b$3));
        return $1642;
    }
    const Word$gtn = x0 => x1 => Word$gtn$(x0, x1);
    function F64$gtn$(_a$1, _b$2) {
        var self = _a$1;
        switch ("f64") {
          case "f64":
            var $1644 = f64_to_word(self);
            var self = _b$2;
            switch ("f64") {
              case "f64":
                var $1646 = f64_to_word(self);
                var $1647 = Word$gtn$($1644, $1646);
                var $1645 = $1647;
                break;
            }
            ;
            var $1643 = $1645;
            break;
        }
        return $1643;
    }
    const F64$gtn = x0 => x1 => F64$gtn$(x0, x1);
    function App$Kaelin$Coord$round$diff$(_x$1, _y$2) {
        var _big_number$3 = 1e3;
        var _x$4 = _x$1 + _big_number$3;
        var _y$5 = _y$2 + _big_number$3;
        var self = F64$gtn$(_x$4, _y$5);
        if (self) {
            var $1649 = _x$4 - _y$5;
            var $1648 = $1649;
        } else {
            var $1650 = _y$5 - _x$4;
            var $1648 = $1650;
        }
        return $1648;
    }
    const App$Kaelin$Coord$round$diff = x0 => x1 => App$Kaelin$Coord$round$diff$(x0, x1);
    function App$Kaelin$Coord$round$(_axial_x$1, _axial_y$2) {
        var _f$3 = U32$to_f64;
        var _i$4 = F64$to_i32;
        var _axial_z$5 = _f$3(0) - _axial_x$1 - _axial_y$2;
        var _round_x$6 = App$Kaelin$Coord$round$round_F64$(_axial_x$1);
        var _round_y$7 = App$Kaelin$Coord$round$round_F64$(_axial_y$2);
        var _round_z$8 = App$Kaelin$Coord$round$round_F64$(_axial_z$5);
        var _diff_x$9 = App$Kaelin$Coord$round$diff$(_axial_x$1, _round_x$6);
        var _diff_y$10 = App$Kaelin$Coord$round$diff$(_axial_y$2, _round_y$7);
        var _diff_z$11 = App$Kaelin$Coord$round$diff$(_axial_z$5, _round_z$8);
        var self = F64$gtn$(_diff_x$9, _diff_z$11);
        if (self) {
            var self = F64$gtn$(_diff_y$10, _diff_x$9);
            if (self) {
                var _new_y$12 = _f$3(0) - _round_x$6 - _round_z$8;
                var $1653 = Pair$new$(_i$4(_round_x$6), _i$4(_new_y$12));
                var $1652 = $1653;
            } else {
                var _new_x$12 = _f$3(0) - _round_y$7 - _round_z$8;
                var $1654 = Pair$new$(_i$4(_new_x$12), _i$4(_round_y$7));
                var $1652 = $1654;
            }
            var _result$12 = $1652;
        } else {
            var self = F64$gtn$(_diff_y$10, _diff_z$11);
            if (self) {
                var _new_y$12 = _f$3(0) - _round_x$6 - _round_z$8;
                var $1656 = Pair$new$(_i$4(_round_x$6), _i$4(_new_y$12));
                var $1655 = $1656;
            } else {
                var $1657 = Pair$new$(_i$4(_round_x$6), _i$4(_round_y$7));
                var $1655 = $1657;
            }
            var _result$12 = $1655;
        }
        var $1651 = _result$12;
        return $1651;
    }
    const App$Kaelin$Coord$round = x0 => x1 => App$Kaelin$Coord$round$(x0, x1);
    function App$Kaelin$Coord$to_axial$(_coord$1) {
        var self = _coord$1;
        switch (self._) {
          case "Pair.new":
            var $1659 = self.fst;
            var $1660 = self.snd;
            var _f$4 = U32$to_f64;
            var _i$5 = F64$to_i32;
            var _float_hex_rad$6 = _f$4(App$Kaelin$Constants$hexagon_radius) / Number(2n);
            var _center_x$7 = App$Kaelin$Constants$center_x;
            var _center_y$8 = App$Kaelin$Constants$center_y;
            var _float_x$9 = (_f$4($1659) - _f$4(_center_x$7)) / _float_hex_rad$6;
            var _float_y$10 = (_f$4($1660) - _f$4(_center_y$8)) / _float_hex_rad$6;
            var _fourth$11 = .25;
            var _sixth$12 = Number(1n) / Number(6n);
            var _third$13 = Number(1n) / Number(3n);
            var _half$14 = .5;
            var _axial_x$15 = _float_x$9 * _fourth$11 - _float_y$10 * _sixth$12;
            var _axial_y$16 = _float_y$10 * _third$13;
            var self = App$Kaelin$Coord$round$(_axial_x$15, _axial_y$16);
            switch (self._) {
              case "Pair.new":
                var $1662 = self.fst;
                var $1663 = self.snd;
                var $1664 = App$Kaelin$Coord$new$($1662, $1663);
                var $1661 = $1664;
                break;
            }
            ;
            var $1658 = $1661;
            break;
        }
        return $1658;
    }
    const App$Kaelin$Coord$to_axial = x0 => App$Kaelin$Coord$to_axial$(x0);
    function NatSet$has$(_nat$1, _set$2) {
        var self = NatMap$get$(_nat$1, _set$2);
        switch (self._) {
          case "Maybe.none":
            var $1666 = Bool$false;
            var $1665 = $1666;
            break;

          case "Maybe.some":
            var $1667 = Bool$true;
            var $1665 = $1667;
            break;
        }
        return $1665;
    }
    const NatSet$has = x0 => x1 => NatSet$has$(x0, x1);
    const App$Kaelin$Indicator$blue = {
        _: "App.Kaelin.Indicator.blue"
    };
    function App$Kaelin$Draw$support$get_effect$(_coord$1, _coord_nat$2, _cast_info$3) {
        var self = _cast_info$3;
        switch (self._) {
          case "Maybe.some":
            var $1669 = self.value;
            var self = $1669;
            switch (self._) {
              case "App.Kaelin.CastInfo.local.new":
                var $1671 = self.range;
                var _is_in_range$10 = NatSet$has$(_coord_nat$2, $1671);
                var self = _is_in_range$10;
                if (self) {
                    var $1673 = Maybe$some$(App$Kaelin$Indicator$blue);
                    var $1672 = $1673;
                } else {
                    var $1674 = Maybe$none;
                    var $1672 = $1674;
                }
                ;
                var $1670 = $1672;
                break;
            }
            ;
            var $1668 = $1670;
            break;

          case "Maybe.none":
            var $1675 = Maybe$none;
            var $1668 = $1675;
            break;
        }
        return $1668;
    }
    const App$Kaelin$Draw$support$get_effect = x0 => x1 => x2 => App$Kaelin$Draw$support$get_effect$(x0, x1, x2);
    function App$Kaelin$Draw$support$area_of_effect$(_coord$1, _coord_nat$2, _cast_info$3) {
        var $1676 = Maybe$monad$(_m$bind$4 => _m$pure$5 => {
            var $1677 = _m$bind$4;
            return $1677;
        })(_cast_info$3)(_cast$4 => {
            var _mouse_pos$5 = App$Kaelin$Coord$Convert$axial_to_nat$((() => {
                var self = _cast$4;
                switch (self._) {
                  case "App.Kaelin.CastInfo.local.new":
                    var $1679 = self.mouse_pos;
                    var $1680 = $1679;
                    return $1680;
                }
            })());
            var self = NatSet$has$(_mouse_pos$5, (() => {
                var self = _cast$4;
                switch (self._) {
                  case "App.Kaelin.CastInfo.local.new":
                    var $1681 = self.range;
                    var $1682 = $1681;
                    return $1682;
                }
            })());
            if (self) {
                var $1683 = NatMap$get$(_coord_nat$2, (() => {
                    var self = _cast$4;
                    switch (self._) {
                      case "App.Kaelin.CastInfo.local.new":
                        var $1684 = self.area;
                        var $1685 = $1684;
                        return $1685;
                    }
                })());
                var $1678 = $1683;
            } else {
                var $1686 = Maybe$none;
                var $1678 = $1686;
            }
            return $1678;
        });
        return $1676;
    }
    const App$Kaelin$Draw$support$area_of_effect = x0 => x1 => x2 => App$Kaelin$Draw$support$area_of_effect$(x0, x1, x2);
    function App$Kaelin$Draw$support$get_indicator$(_coord$1, _cast_info$2) {
        var self = _cast_info$2;
        switch (self._) {
          case "Maybe.none":
            var $1688 = App$Kaelin$Indicator$green;
            var $1687 = $1688;
            break;

          case "Maybe.some":
            var _coord_nat$4 = App$Kaelin$Coord$Convert$axial_to_nat$(_coord$1);
            var _range$5 = App$Kaelin$Draw$support$get_effect$(_coord$1, _coord_nat$4, _cast_info$2);
            var _area$6 = App$Kaelin$Draw$support$area_of_effect$(_coord$1, _coord_nat$4, _cast_info$2);
            var self = _area$6;
            switch (self._) {
              case "Maybe.some":
                var $1690 = self.value;
                var $1691 = $1690;
                var $1689 = $1691;
                break;

              case "Maybe.none":
                var self = _range$5;
                switch (self._) {
                  case "Maybe.some":
                    var $1693 = self.value;
                    var $1694 = $1693;
                    var $1692 = $1694;
                    break;

                  case "Maybe.none":
                    var $1695 = App$Kaelin$Indicator$green;
                    var $1692 = $1695;
                    break;
                }
                ;
                var $1689 = $1692;
                break;
            }
            ;
            var $1687 = $1689;
            break;
        }
        return $1687;
    }
    const App$Kaelin$Draw$support$get_indicator = x0 => x1 => App$Kaelin$Draw$support$get_indicator$(x0, x1);
    function App$Kaelin$Coord$to_screen_xy$(_coord$1) {
        var self = _coord$1;
        switch (self._) {
          case "App.Kaelin.Coord.new":
            var $1697 = self.i;
            var $1698 = self.j;
            var _i$4 = $1697;
            var _j$5 = $1698;
            var _i$6 = _i$4;
            var _j$7 = _j$5;
            var _int_rad$8 = App$Kaelin$Constants$hexagon_radius;
            var _hlf$9 = _int_rad$8 / +2;
            var _int_screen_center_x$10 = App$Kaelin$Constants$center_x;
            var _int_screen_center_y$11 = App$Kaelin$Constants$center_y;
            var _cx$12 = _int_screen_center_x$10 + _j$7 * _int_rad$8;
            var _cx$13 = _cx$12 + _i$6 * (_int_rad$8 * Number(2n));
            var _cy$14 = _int_screen_center_y$11 + _j$7 * (_hlf$9 * Number(3n));
            var _cx$15 = _cx$13 >>> 0;
            var _y$16 = _cy$14 + .5;
            var _cy$17 = _cy$14 >>> 0;
            var $1699 = Pair$new$(_cx$15, _cy$17);
            var $1696 = $1699;
            break;
        }
        return $1696;
    }
    const App$Kaelin$Coord$to_screen_xy = x0 => App$Kaelin$Coord$to_screen_xy$(x0);
    function App$Kaelin$Draw$support$centralize$(_coord$1) {
        var self = App$Kaelin$Coord$to_screen_xy$(_coord$1);
        switch (self._) {
          case "Pair.new":
            var $1701 = self.fst;
            var $1702 = self.snd;
            var _i$4 = $1701 - App$Kaelin$Constants$hexagon_radius >>> 0;
            var _j$5 = $1702 - App$Kaelin$Constants$hexagon_radius >>> 0;
            var $1703 = Pair$new$(_i$4, _j$5);
            var $1700 = $1703;
            break;
        }
        return $1700;
    }
    const App$Kaelin$Draw$support$centralize = x0 => App$Kaelin$Draw$support$centralize$(x0);
    function VoxBox$get_len$(_img$1) {
        var self = _img$1;
        switch (self._) {
          case "VoxBox.new":
            var $1705 = self.length;
            var $1706 = $1705;
            var $1704 = $1706;
            break;
        }
        return $1704;
    }
    const VoxBox$get_len = x0 => VoxBox$get_len$(x0);
    function Array$get$(_idx$3, _arr$4) {
        var $1707 = Word$foldl$(Array$extract_tip, _rec$6 => _arr$7 => {
            var _arr_l$8 = Array$extract_tie$(_arr$7);
            var self = _arr_l$8;
            switch (self._) {
              case "Pair.new":
                var $1709 = self.fst;
                var $1710 = _rec$6($1709);
                var $1708 = $1710;
                break;
            }
            return $1708;
        }, _rec$6 => _arr$7 => {
            var _arr_r$8 = Array$extract_tie$(_arr$7);
            var self = _arr_r$8;
            switch (self._) {
              case "Pair.new":
                var $1712 = self.snd;
                var $1713 = _rec$6($1712);
                var $1711 = $1713;
                break;
            }
            return $1711;
        }, _idx$3)(_arr$4);
        return $1707;
    }
    const Array$get = x0 => x1 => Array$get$(x0, x1);
    const Buffer32$get = a0 => a1 => a1[a0];
    const VoxBox$get_pos = a0 => a1 => a1.buffer[a0 * 2];
    const VoxBox$get_col = a0 => a1 => a1.buffer[a0 * 2 + 1];
    function Word$and$(_a$2, _b$3) {
        var self = _a$2;
        switch (self._) {
          case "Word.o":
            var $1715 = self.pred;
            var $1716 = _b$6 => {
                var self = _b$6;
                switch (self._) {
                  case "Word.o":
                    var $1718 = self.pred;
                    var $1719 = _a$pred$9 => {
                        var $1720 = Word$o$(Word$and$(_a$pred$9, $1718));
                        return $1720;
                    };
                    var $1717 = $1719;
                    break;

                  case "Word.i":
                    var $1721 = self.pred;
                    var $1722 = _a$pred$9 => {
                        var $1723 = Word$o$(Word$and$(_a$pred$9, $1721));
                        return $1723;
                    };
                    var $1717 = $1722;
                    break;

                  case "Word.e":
                    var $1724 = _a$pred$7 => {
                        var $1725 = Word$e;
                        return $1725;
                    };
                    var $1717 = $1724;
                    break;
                }
                var $1717 = $1717($1715);
                return $1717;
            };
            var $1714 = $1716;
            break;

          case "Word.i":
            var $1726 = self.pred;
            var $1727 = _b$6 => {
                var self = _b$6;
                switch (self._) {
                  case "Word.o":
                    var $1729 = self.pred;
                    var $1730 = _a$pred$9 => {
                        var $1731 = Word$o$(Word$and$(_a$pred$9, $1729));
                        return $1731;
                    };
                    var $1728 = $1730;
                    break;

                  case "Word.i":
                    var $1732 = self.pred;
                    var $1733 = _a$pred$9 => {
                        var $1734 = Word$i$(Word$and$(_a$pred$9, $1732));
                        return $1734;
                    };
                    var $1728 = $1733;
                    break;

                  case "Word.e":
                    var $1735 = _a$pred$7 => {
                        var $1736 = Word$e;
                        return $1736;
                    };
                    var $1728 = $1735;
                    break;
                }
                var $1728 = $1728($1726);
                return $1728;
            };
            var $1714 = $1727;
            break;

          case "Word.e":
            var $1737 = _b$4 => {
                var $1738 = Word$e;
                return $1738;
            };
            var $1714 = $1737;
            break;
        }
        var $1714 = $1714(_b$3);
        return $1714;
    }
    const Word$and = x0 => x1 => Word$and$(x0, x1);
    const U32$and = a0 => a1 => a0 & a1;
    const U32$shr = a0 => a1 => a0 >>> a1;
    function VoxBox$Draw$image$(_x$1, _y$2, _z$3, _src$4, _img$5) {
        var _len$6 = VoxBox$get_len$(_src$4);
        var _img$7 = (() => {
            var $1740 = _img$5;
            var $1741 = 0;
            var $1742 = _len$6;
            let _img$8 = $1740;
            for (let _i$7 = $1741; _i$7 < $1742; ++_i$7) {
                var _pos$9 = _src$4.buffer[_i$7 * 2];
                var _col$10 = _src$4.buffer[_i$7 * 2 + 1];
                var _p_x$11 = _pos$9 & 4095;
                var _p_y$12 = (_pos$9 & 16773120) >>> 12;
                var _p_z$13 = (_pos$9 & 4278190080) >>> 24;
                var _p_x$14 = _p_x$11 + _x$1 >>> 0;
                var _p_y$15 = _p_y$12 + _y$2 >>> 0;
                var _p_z$16 = _p_z$13 + _z$3 >>> 0;
                var _pos$17 = 0 | _p_x$14 | _p_y$15 << 12 | _p_z$16 << 24;
                var $1740 = (_img$8.buffer[_img$8.length * 2] = _pos$17, _img$8.buffer[_img$8.length * 2 + 1] = _col$10, 
                _img$8.length++, _img$8);
                _img$8 = $1740;
            }
            return _img$8;
        })();
        var $1739 = _img$7;
        return $1739;
    }
    const VoxBox$Draw$image = x0 => x1 => x2 => x3 => x4 => VoxBox$Draw$image$(x0, x1, x2, x3, x4);
    function App$Kaelin$Draw$tile$background$(_terrain$1, _cast_info$2, _coord$3, _mouse_coord$4, _img$5) {
        var _coord_nat$6 = App$Kaelin$Coord$Convert$axial_to_nat$(_coord$3);
        var _sprite$7 = App$Kaelin$Draw$support$get_indicator$(_coord$3, _cast_info$2);
        var self = App$Kaelin$Draw$support$centralize$(_coord$3);
        switch (self._) {
          case "Pair.new":
            var $1744 = self.fst;
            var $1745 = self.snd;
            var $1746 = VoxBox$Draw$image$($1744, $1745, 0, (() => {
                var self = _terrain$1;
                switch (self._) {
                  case "App.Kaelin.Terrain.new":
                    var $1747 = self.draw;
                    var $1748 = $1747;
                    return $1748;
                }
            })()(_sprite$7), _img$5);
            var $1743 = $1746;
            break;
        }
        return $1743;
    }
    const App$Kaelin$Draw$tile$background = x0 => x1 => x2 => x3 => x4 => App$Kaelin$Draw$tile$background$(x0, x1, x2, x3, x4);
    function App$Kaelin$Draw$hero$(_cx$1, _cy$2, _z$3, _hero$4, _img$5) {
        var self = _hero$4;
        switch (self._) {
          case "App.Kaelin.Hero.new":
            var $1750 = self.img;
            var _aux_y$11 = App$Kaelin$Constants$hexagon_radius * 2 >>> 0;
            var _cy$12 = _cy$2 - _aux_y$11 >>> 0;
            var _cx$13 = _cx$1 - App$Kaelin$Constants$hexagon_radius >>> 0;
            var $1751 = VoxBox$Draw$image$(_cx$13, _cy$12, 0, $1750, _img$5);
            var $1749 = $1751;
            break;
        }
        return $1749;
    }
    const App$Kaelin$Draw$hero = x0 => x1 => x2 => x3 => x4 => App$Kaelin$Draw$hero$(x0, x1, x2, x3, x4);
    function Int$neg$(_a$1) {
        var self = _a$1;
        switch ("new") {
          case "new":
            var $1753 = int_pos(self);
            var $1754 = int_neg(self);
            var $1755 = $1754 - $1753;
            var $1752 = $1755;
            break;
        }
        return $1752;
    }
    const Int$neg = x0 => Int$neg$(x0);
    function Word$to_int$(_a$2) {
        var _neg$3 = Word$is_neg$(_a$2);
        var _i$4 = Word$to_nat$(Word$abs$(_a$2));
        var self = _neg$3;
        if (self) {
            var $1757 = Int$neg$(_i$4);
            var $1756 = $1757;
        } else {
            var $1758 = _i$4;
            var $1756 = $1758;
        }
        return $1756;
    }
    const Word$to_int = x0 => Word$to_int$(x0);
    function I32$to_int$(_a$1) {
        var self = _a$1;
        switch ("i32") {
          case "i32":
            var $1760 = i32_to_word(self);
            var $1761 = Word$to_int$($1760);
            var $1759 = $1761;
            break;
        }
        return $1759;
    }
    const I32$to_int = x0 => I32$to_int$(x0);
    function Int$to_nat$(_a$1) {
        var self = _a$1;
        switch ("new") {
          case "new":
            var $1763 = int_pos(self);
            var $1764 = $1763;
            var $1762 = $1764;
            break;
        }
        return $1762;
    }
    const Int$to_nat = x0 => Int$to_nat$(x0);
    function List$imap$(_f$3, _xs$4) {
        var self = _xs$4;
        switch (self._) {
          case "List.cons":
            var $1766 = self.head;
            var $1767 = self.tail;
            var $1768 = List$cons$(_f$3(0n)($1766), List$imap$(_n$7 => {
                var $1769 = _f$3(Nat$succ$(_n$7));
                return $1769;
            }, $1767));
            var $1765 = $1768;
            break;

          case "List.nil":
            var $1770 = List$nil;
            var $1765 = $1770;
            break;
        }
        return $1765;
    }
    const List$imap = x0 => x1 => List$imap$(x0, x1);
    function List$indices$u32$(_xs$2) {
        var $1771 = List$imap$(_i$3 => _x$4 => {
            var $1772 = Pair$new$(Number(_i$3) >>> 0, _x$4);
            return $1772;
        }, _xs$2);
        return $1771;
    }
    const List$indices$u32 = x0 => List$indices$u32$(x0);
    function String$to_list$(_str$1) {
        var self = _str$1;
        if (self.length === 0) {
            var $1774 = List$nil;
            var $1773 = $1774;
        } else {
            var $1775 = self.charCodeAt(0);
            var $1776 = self.slice(1);
            var $1777 = List$cons$($1775, String$to_list$($1776));
            var $1773 = $1777;
        }
        return $1773;
    }
    const String$to_list = x0 => String$to_list$(x0);
    function U16$show_hex$(_a$1) {
        var self = _a$1;
        switch ("u16") {
          case "u16":
            var $1779 = u16_to_word(self);
            var $1780 = Nat$to_string_base$(16n, Bits$to_nat$(Word$to_bits$($1779)));
            var $1778 = $1780;
            break;
        }
        return $1778;
    }
    const U16$show_hex = x0 => U16$show_hex$(x0);
    function PixelFont$get_img$(_char$1, _map$2) {
        var self = Map$get$(U16$show_hex$(_char$1), _map$2);
        switch (self._) {
          case "Maybe.some":
            var $1782 = self.value;
            var $1783 = Maybe$some$($1782);
            var $1781 = $1783;
            break;

          case "Maybe.none":
            var $1784 = Maybe$none;
            var $1781 = $1784;
            break;
        }
        return $1781;
    }
    const PixelFont$get_img = x0 => x1 => PixelFont$get_img$(x0, x1);
    const Pos32$get_x = a0 => a0 & 4095;
    const Pos32$get_y = a0 => a0 >>> 12 & 4095;
    const Pos32$get_z = a0 => a0 >>> 24;
    function VoxBox$Draw$text$char$(_chr$1, _font_map$2, _chr_pos$3, _scr$4) {
        var self = PixelFont$get_img$(_chr$1, _font_map$2);
        switch (self._) {
          case "Maybe.some":
            var $1786 = self.value;
            var _x$6 = _chr_pos$3 & 4095;
            var _y$7 = _chr_pos$3 >>> 12 & 4095;
            var _z$8 = _chr_pos$3 >>> 24;
            var $1787 = VoxBox$Draw$image$(_x$6, _y$7, _z$8, $1786, _scr$4);
            var $1785 = $1787;
            break;

          case "Maybe.none":
            var $1788 = _scr$4;
            var $1785 = $1788;
            break;
        }
        return $1785;
    }
    const VoxBox$Draw$text$char = x0 => x1 => x2 => x3 => VoxBox$Draw$text$char$(x0, x1, x2, x3);
    function Pos32$add$(_a$1, _b$2) {
        var _x$3 = (_a$1 & 4095) + (_b$2 & 4095) >>> 0;
        var _y$4 = (_a$1 >>> 12 & 4095) + (_b$2 >>> 12 & 4095) >>> 0;
        var _z$5 = (_a$1 >>> 24) + (_b$2 >>> 24) >>> 0;
        var $1789 = 0 | _x$3 | _y$4 << 12 | _z$5 << 24;
        return $1789;
    }
    const Pos32$add = x0 => x1 => Pos32$add$(x0, x1);
    function VoxBox$Draw$text$(_txt$1, _font_map$2, _pos$3, _scr$4) {
        var _scr$5 = (() => {
            var $1792 = _scr$4;
            var $1793 = List$indices$u32$(String$to_list$(_txt$1));
            let _scr$6 = $1792;
            let _pair$5;
            while ($1793._ === "List.cons") {
                _pair$5 = $1793.head;
                var self = _pair$5;
                switch (self._) {
                  case "Pair.new":
                    var $1794 = self.fst;
                    var $1795 = self.snd;
                    var _add_pos$9 = 0 | $1794 * 6 >>> 0 | 0 << 12 | 0 << 24;
                    var $1796 = VoxBox$Draw$text$char$($1795, _font_map$2, Pos32$add$(_pos$3, _add_pos$9), _scr$6);
                    var $1792 = $1796;
                    break;
                }
                _scr$6 = $1792;
                $1793 = $1793.tail;
            }
            return _scr$6;
        })();
        var $1790 = _scr$5;
        return $1790;
    }
    const VoxBox$Draw$text = x0 => x1 => x2 => x3 => VoxBox$Draw$text$(x0, x1, x2, x3);
    function PixelFont$set_img$(_char$1, _img$2, _map$3) {
        var $1797 = Map$set$(U16$show_hex$(_char$1), _img$2, _map$3);
        return $1797;
    }
    const PixelFont$set_img = x0 => x1 => x2 => PixelFont$set_img$(x0, x1, x2);
    function U16$new$(_value$1) {
        var $1798 = word_to_u16(_value$1);
        return $1798;
    }
    const U16$new = x0 => U16$new$(x0);
    const Nat$to_u16 = a0 => Number(a0) & 65535;
    const PixelFont$small_black$100 = VoxBox$parse$("00001e21212801001e21212802001e21212800011e21212803011e21212800021e21212803021e21212800031e21212803031e21212800041e21212801041e21212802041e212128");
    const PixelFont$small_black$101 = VoxBox$parse$("00001e21212801001e21212802001e21212803001e21212800011e21212800021e21212801021e21212802021e21212800031e21212800041e21212801041e21212802041e21212803041e212128");
    const PixelFont$small_black$102 = VoxBox$parse$("00001e21212801001e21212802001e21212803001e21212800011e21212800021e21212801021e21212802021e21212803021e21212800031e21212800041e212128");
    const PixelFont$small_black$103 = VoxBox$parse$("01001e21212802001e21212803001e21212800011e21212800021e21212802021e21212803021e21212800031e21212803031e21212801041e21212802041e21212803041e212128");
    const PixelFont$small_black$104 = VoxBox$parse$("00001e21212803001e21212800011e21212803011e21212800021e21212801021e21212802021e21212803021e21212800031e21212803031e21212800041e21212803041e212128");
    const PixelFont$small_black$105 = VoxBox$parse$("01001e21212802001e21212803001e21212802011e21212802021e21212802031e21212801041e21212802041e21212803041e212128");
    const PixelFont$small_black$106 = VoxBox$parse$("03001e21212803011e21212803021e21212800031e21212803031e21212801041e21212802041e212128");
    const PixelFont$small_black$107 = VoxBox$parse$("00001e21212803001e21212800011e21212802011e21212800021e21212801021e21212800031e21212802031e21212800041e21212803041e212128");
    const PixelFont$small_black$108 = VoxBox$parse$("00001e21212800011e21212800021e21212800031e21212800041e21212801041e21212802041e21212803041e212128");
    const PixelFont$small_black$109 = VoxBox$parse$("00001e21212801001e21212803001e21212804001e21212800011e21212802011e21212804011e21212800021e21212804021e21212800031e21212804031e21212800041e21212804041e212128");
    const PixelFont$small_black$110 = VoxBox$parse$("00001e21212803001e21212800011e21212801011e21212803011e21212800021e21212802021e21212803021e21212800031e21212803031e21212800041e21212803041e212128");
    const PixelFont$small_black$111 = VoxBox$parse$("01001e21212802001e21212800011e21212803011e21212800021e21212803021e21212800031e21212803031e21212801041e21212802041e212128");
    const PixelFont$small_black$112 = VoxBox$parse$("00001e21212801001e21212802001e21212803001e21212800011e21212803011e21212800021e21212801021e21212802021e21212800031e21212800041e212128");
    const PixelFont$small_black$113 = VoxBox$parse$("01001e21212802001e21212800011e21212803011e21212800021e21212803021e21212800031e21212803031e21212801041e21212802041e21212802051e21212803051e212128");
    const PixelFont$small_black$114 = VoxBox$parse$("00001e21212801001e21212802001e21212803001e21212800011e21212803011e21212800021e21212801021e21212802021e21212800031e21212803031e21212800041e21212803041e212128");
    const PixelFont$small_black$115 = VoxBox$parse$("01001e21212802001e21212803001e21212800011e21212801021e21212802021e21212803031e21212800041e21212801041e21212802041e212128");
    const PixelFont$small_black$116 = VoxBox$parse$("01001e21212802001e21212803001e21212802011e21212802021e21212802031e21212802041e212128");
    const PixelFont$small_black$117 = VoxBox$parse$("00001e21212803001e21212800011e21212803011e21212800021e21212803021e21212800031e21212803031e21212801041e21212802041e212128");
    const PixelFont$small_black$118 = VoxBox$parse$("01001e21212803001e21212801011e21212803011e21212801021e21212803021e21212801031e21212803031e21212802041e212128");
    const PixelFont$small_black$119 = VoxBox$parse$("00001e21212804001e21212800011e21212804011e21212800021e21212802021e21212804021e21212800031e21212801031e21212803031e21212804031e21212800041e21212804041e212128");
    const PixelFont$small_black$120 = VoxBox$parse$("00001e21212804001e21212801011e21212803011e21212802021e21212801031e21212803031e21212800041e21212804041e212128");
    const PixelFont$small_black$121 = VoxBox$parse$("00001e21212804001e21212801011e21212803011e21212802021e21212802031e21212802041e212128");
    const PixelFont$small_black$122 = VoxBox$parse$("00001e21212801001e21212802001e21212803001e21212803011e21212801021e21212802021e21212800031e21212800041e21212801041e21212802041e21212803041e212128");
    const PixelFont$small_black$123 = VoxBox$parse$("02001e21212803001e21212802011e21212801021e21212802031e21212802041e21212803041e212128");
    const PixelFont$small_black$124 = VoxBox$parse$("02001e21212802011e21212802021e21212802031e21212802041e212128");
    const PixelFont$small_black$125 = VoxBox$parse$("01001e21212802001e21212802011e21212803021e21212802031e21212801041e21212802041e212128");
    const PixelFont$small_black$126 = VoxBox$parse$("01001e21212802001e21212804001e21212800011e21212802011e21212804011e21212800021e21212802021e21212803021e212128");
    const PixelFont$small_black$32 = VoxBox$parse$("");
    const PixelFont$small_black$33 = VoxBox$parse$("02001e21212802011e21212802021e21212802041e212128");
    const PixelFont$small_black$34 = VoxBox$parse$("01001e21212803001e21212801011e21212803011e212128");
    const PixelFont$small_black$35 = VoxBox$parse$("01001e21212803001e21212800011e21212801011e21212802011e21212803011e21212804011e21212801021e21212803021e21212800031e21212801031e21212802031e21212803031e21212804031e21212801041e21212803041e212128");
    const PixelFont$small_black$36 = VoxBox$parse$("01001e21212802001e21212803001e21212800011e21212800021e21212801021e21212802021e21212803021e21212804021e21212804031e21212801041e21212802041e21212803041e21212802051e212128");
    const PixelFont$small_black$37 = VoxBox$parse$("00001e21212801001e21212804001e21212803011e21212802021e21212801031e21212800041e21212803041e21212804041e212128");
    const PixelFont$small_black$38 = VoxBox$parse$("01001e21212802001e21212800011e21212803011e21212801021e21212802021e21212804021e21212800031e21212803031e21212801041e21212802041e21212804041e212128");
    const PixelFont$small_black$39 = VoxBox$parse$("02001e21212802011e212128");
    const PixelFont$small_black$40 = VoxBox$parse$("03001e21212802011e21212802021e21212802031e21212803041e212128");
    const PixelFont$small_black$41 = VoxBox$parse$("01001e21212802011e21212802021e21212802031e21212801041e212128");
    const PixelFont$small_black$42 = VoxBox$parse$("01001e21212803001e21212802011e21212801021e21212803021e212128");
    const PixelFont$small_black$43 = VoxBox$parse$("02011e21212801021e21212802021e21212803021e21212802031e212128");
    const PixelFont$small_black$44 = VoxBox$parse$("01041e21212802041e21212802051e212128");
    const PixelFont$small_black$45 = VoxBox$parse$("01021e21212802021e21212803021e212128");
    const PixelFont$small_black$46 = VoxBox$parse$("02041e212128");
    const PixelFont$small_black$47 = VoxBox$parse$("03011e21212802021e21212801031e21212800041e212128");
    const PixelFont$small_black$48 = VoxBox$parse$("01001e21212802001e21212800011e21212803011e21212800021e21212803021e21212800031e21212803031e21212801041e21212802041e212128");
    const PixelFont$small_black$49 = VoxBox$parse$("02001e21212801011e21212802011e21212802021e21212802031e21212801041e21212802041e21212803041e212128");
    const PixelFont$small_black$50 = VoxBox$parse$("01001e21212802001e21212800011e21212803011e21212802021e21212801031e21212800041e21212801041e21212802041e21212803041e212128");
    const PixelFont$small_black$51 = VoxBox$parse$("00001e21212801001e21212802001e21212803011e21212801021e21212802021e21212803021e21212803031e21212800041e21212801041e21212802041e212128");
    const PixelFont$small_black$52 = VoxBox$parse$("00001e21212803001e21212800011e21212803011e21212800021e21212801021e21212802021e21212803021e21212803031e21212803041e212128");
    const PixelFont$small_black$53 = VoxBox$parse$("00001e21212801001e21212802001e21212803001e21212800011e21212800021e21212801021e21212802021e21212803021e21212803031e21212800041e21212801041e21212802041e212128");
    const PixelFont$small_black$54 = VoxBox$parse$("01001e21212802001e21212803001e21212800011e21212800021e21212801021e21212802021e21212803021e21212800031e21212803031e21212801041e21212802041e212128");
    const PixelFont$small_black$55 = VoxBox$parse$("00001e21212801001e21212802001e21212803001e21212803011e21212802021e21212801031e21212800041e212128");
    const PixelFont$small_black$56 = VoxBox$parse$("01001e21212802001e21212800011e21212803011e21212801021e21212802021e21212800031e21212803031e21212801041e21212802041e212128");
    const PixelFont$small_black$57 = VoxBox$parse$("01001e21212802001e21212800011e21212803011e21212801021e21212802021e21212803021e21212803031e21212800041e21212801041e21212802041e212128");
    const PixelFont$small_black$58 = VoxBox$parse$("02011e21212802031e212128");
    const PixelFont$small_black$59 = VoxBox$parse$("02011e21212801031e21212802031e21212802041e212128");
    const PixelFont$small_black$60 = VoxBox$parse$("03001e21212802011e21212801021e21212802031e21212803041e212128");
    const PixelFont$small_black$61 = VoxBox$parse$("01011e21212802011e21212803011e21212801031e21212802031e21212803031e212128");
    const PixelFont$small_black$62 = VoxBox$parse$("01001e21212802011e21212803021e21212802031e21212801041e212128");
    const PixelFont$small_black$63 = VoxBox$parse$("01001e21212802001e21212803001e21212803011e21212801021e21212802021e21212801041e212128");
    const PixelFont$small_black$64 = VoxBox$parse$("01001e21212802001e21212803001e21212800011e21212802011e21212803011e21212800021e21212802021e21212803021e21212800031e21212801041e21212802041e21212803041e212128");
    const PixelFont$small_black$65 = VoxBox$parse$("01001e21212802001e21212800011e21212803011e21212800021e21212801021e21212802021e21212803021e21212800031e21212803031e21212800041e21212803041e212128");
    const PixelFont$small_black$66 = VoxBox$parse$("00001e21212801001e21212802001e21212800011e21212803011e21212800021e21212801021e21212802021e21212800031e21212803031e21212800041e21212801041e21212802041e212128");
    const PixelFont$small_black$67 = VoxBox$parse$("01001e21212802001e21212803001e21212800011e21212800021e21212800031e21212801041e21212802041e21212803041e212128");
    const PixelFont$small_black$68 = VoxBox$parse$("00001e21212801001e21212802001e21212800011e21212803011e21212800021e21212803021e21212800031e21212803031e21212800041e21212801041e21212802041e212128");
    const PixelFont$small_black$69 = VoxBox$parse$("00001e21212801001e21212802001e21212803001e21212800011e21212800021e21212801021e21212802021e21212800031e21212800041e21212801041e21212802041e21212803041e212128");
    const PixelFont$small_black$70 = VoxBox$parse$("00001e21212801001e21212802001e21212803001e21212800011e21212800021e21212801021e21212802021e21212803021e21212800031e21212800041e212128");
    const PixelFont$small_black$71 = VoxBox$parse$("01001e21212802001e21212803001e21212800011e21212800021e21212802021e21212803021e21212800031e21212803031e21212801041e21212802041e21212803041e212128");
    const PixelFont$small_black$72 = VoxBox$parse$("00001e21212803001e21212800011e21212803011e21212800021e21212801021e21212802021e21212803021e21212800031e21212803031e21212800041e21212803041e212128");
    const PixelFont$small_black$73 = VoxBox$parse$("01001e21212802001e21212803001e21212802011e21212802021e21212802031e21212801041e21212802041e21212803041e212128");
    const PixelFont$small_black$74 = VoxBox$parse$("03001e21212803011e21212803021e21212800031e21212803031e21212801041e21212802041e212128");
    const PixelFont$small_black$75 = VoxBox$parse$("00001e21212803001e21212800011e21212802011e21212800021e21212801021e21212800031e21212802031e21212800041e21212803041e212128");
    const PixelFont$small_black$76 = VoxBox$parse$("00001e21212800011e21212800021e21212800031e21212800041e21212801041e21212802041e21212803041e212128");
    const PixelFont$small_black$77 = VoxBox$parse$("00001e21212801001e21212803001e21212804001e21212800011e21212802011e21212804011e21212800021e21212804021e21212800031e21212804031e21212800041e21212804041e212128");
    const PixelFont$small_black$78 = VoxBox$parse$("00001e21212803001e21212800011e21212801011e21212803011e21212800021e21212802021e21212803021e21212800031e21212803031e21212800041e21212803041e212128");
    const PixelFont$small_black$79 = VoxBox$parse$("01001e21212802001e21212800011e21212803011e21212800021e21212803021e21212800031e21212803031e21212801041e21212802041e212128");
    const PixelFont$small_black$80 = VoxBox$parse$("00001e21212801001e21212802001e21212803001e21212800011e21212803011e21212800021e21212801021e21212802021e21212800031e21212800041e212128");
    const PixelFont$small_black$81 = VoxBox$parse$("01001e21212802001e21212800011e21212803011e21212800021e21212803021e21212800031e21212803031e21212801041e21212802041e21212802051e21212803051e212128");
    const PixelFont$small_black$82 = VoxBox$parse$("00001e21212801001e21212802001e21212803001e21212800011e21212803011e21212800021e21212801021e21212802021e21212800031e21212803031e21212800041e21212803041e212128");
    const PixelFont$small_black$83 = VoxBox$parse$("01001e21212802001e21212803001e21212800011e21212801021e21212802021e21212803031e21212800041e21212801041e21212802041e212128");
    const PixelFont$small_black$84 = VoxBox$parse$("01001e21212802001e21212803001e21212802011e21212802021e21212802031e21212802041e212128");
    const PixelFont$small_black$85 = VoxBox$parse$("00001e21212803001e21212800011e21212803011e21212800021e21212803021e21212800031e21212803031e21212801041e21212802041e212128");
    const PixelFont$small_black$86 = VoxBox$parse$("01001e21212803001e21212801011e21212803011e21212801021e21212803021e21212801031e21212803031e21212802041e212128");
    const PixelFont$small_black$87 = VoxBox$parse$("00001e21212804001e21212800011e21212804011e21212800021e21212802021e21212804021e21212800031e21212801031e21212803031e21212804031e21212800041e21212804041e212128");
    const PixelFont$small_black$88 = VoxBox$parse$("00001e21212804001e21212801011e21212803011e21212802021e21212801031e21212803031e21212800041e21212804041e212128");
    const PixelFont$small_black$89 = VoxBox$parse$("00001e21212804001e21212801011e21212803011e21212802021e21212802031e21212802041e212128");
    const PixelFont$small_black$90 = VoxBox$parse$("00001e21212801001e21212802001e21212803001e21212803011e21212801021e21212802021e21212800031e21212800041e21212801041e21212802041e21212803041e212128");
    const PixelFont$small_black$91 = VoxBox$parse$("01001e21212802001e21212801011e21212801021e21212801031e21212801041e21212802041e212128");
    const PixelFont$small_black$92 = VoxBox$parse$("01001e21212801011e21212802021e21212802031e21212803041e212128");
    const PixelFont$small_black$93 = VoxBox$parse$("02001e21212803001e21212803011e21212803021e21212803031e21212802041e21212803041e212128");
    const PixelFont$small_black$94 = VoxBox$parse$("02001e21212801011e21212803011e212128");
    const PixelFont$small_black$95 = VoxBox$parse$("00041e21212801041e21212802041e21212803041e212128");
    const PixelFont$small_black$96 = VoxBox$parse$("00001e21212801011e21212802021e212128");
    const PixelFont$small_black$97 = VoxBox$parse$("01001e21212802001e21212800011e21212803011e21212800021e21212801021e21212802021e21212803021e21212800031e21212803031e21212800041e21212803041e212128");
    const PixelFont$small_black$98 = VoxBox$parse$("00001e21212801001e21212802001e21212800011e21212803011e21212800021e21212801021e21212802021e21212800031e21212803031e21212800041e21212801041e21212802041e212128");
    const PixelFont$small_black$99 = VoxBox$parse$("01001e21212802001e21212803001e21212800011e21212800021e21212800031e21212801041e21212802041e21212803041e212128");
    const PixelFont$small_black = (() => {
        var _map$1 = Map$new;
        var _map$2 = PixelFont$set_img$(100, PixelFont$small_black$100, _map$1);
        var _map$3 = PixelFont$set_img$(101, PixelFont$small_black$101, _map$2);
        var _map$4 = PixelFont$set_img$(102, PixelFont$small_black$102, _map$3);
        var _map$5 = PixelFont$set_img$(103, PixelFont$small_black$103, _map$4);
        var _map$6 = PixelFont$set_img$(104, PixelFont$small_black$104, _map$5);
        var _map$7 = PixelFont$set_img$(105, PixelFont$small_black$105, _map$6);
        var _map$8 = PixelFont$set_img$(106, PixelFont$small_black$106, _map$7);
        var _map$9 = PixelFont$set_img$(107, PixelFont$small_black$107, _map$8);
        var _map$10 = PixelFont$set_img$(108, PixelFont$small_black$108, _map$9);
        var _map$11 = PixelFont$set_img$(109, PixelFont$small_black$109, _map$10);
        var _map$12 = PixelFont$set_img$(110, PixelFont$small_black$110, _map$11);
        var _map$13 = PixelFont$set_img$(111, PixelFont$small_black$111, _map$12);
        var _map$14 = PixelFont$set_img$(112, PixelFont$small_black$112, _map$13);
        var _map$15 = PixelFont$set_img$(113, PixelFont$small_black$113, _map$14);
        var _map$16 = PixelFont$set_img$(114, PixelFont$small_black$114, _map$15);
        var _map$17 = PixelFont$set_img$(115, PixelFont$small_black$115, _map$16);
        var _map$18 = PixelFont$set_img$(116, PixelFont$small_black$116, _map$17);
        var _map$19 = PixelFont$set_img$(117, PixelFont$small_black$117, _map$18);
        var _map$20 = PixelFont$set_img$(118, PixelFont$small_black$118, _map$19);
        var _map$21 = PixelFont$set_img$(119, PixelFont$small_black$119, _map$20);
        var _map$22 = PixelFont$set_img$(120, PixelFont$small_black$120, _map$21);
        var _map$23 = PixelFont$set_img$(121, PixelFont$small_black$121, _map$22);
        var _map$24 = PixelFont$set_img$(122, PixelFont$small_black$122, _map$23);
        var _map$25 = PixelFont$set_img$(123, PixelFont$small_black$123, _map$24);
        var _map$26 = PixelFont$set_img$(124, PixelFont$small_black$124, _map$25);
        var _map$27 = PixelFont$set_img$(125, PixelFont$small_black$125, _map$26);
        var _map$28 = PixelFont$set_img$(126, PixelFont$small_black$126, _map$27);
        var _map$29 = PixelFont$set_img$(32, PixelFont$small_black$32, _map$28);
        var _map$30 = PixelFont$set_img$(33, PixelFont$small_black$33, _map$29);
        var _map$31 = PixelFont$set_img$(34, PixelFont$small_black$34, _map$30);
        var _map$32 = PixelFont$set_img$(35, PixelFont$small_black$35, _map$31);
        var _map$33 = PixelFont$set_img$(36, PixelFont$small_black$36, _map$32);
        var _map$34 = PixelFont$set_img$(37, PixelFont$small_black$37, _map$33);
        var _map$35 = PixelFont$set_img$(38, PixelFont$small_black$38, _map$34);
        var _map$36 = PixelFont$set_img$(39, PixelFont$small_black$39, _map$35);
        var _map$37 = PixelFont$set_img$(40, PixelFont$small_black$40, _map$36);
        var _map$38 = PixelFont$set_img$(41, PixelFont$small_black$41, _map$37);
        var _map$39 = PixelFont$set_img$(42, PixelFont$small_black$42, _map$38);
        var _map$40 = PixelFont$set_img$(43, PixelFont$small_black$43, _map$39);
        var _map$41 = PixelFont$set_img$(44, PixelFont$small_black$44, _map$40);
        var _map$42 = PixelFont$set_img$(45, PixelFont$small_black$45, _map$41);
        var _map$43 = PixelFont$set_img$(46, PixelFont$small_black$46, _map$42);
        var _map$44 = PixelFont$set_img$(47, PixelFont$small_black$47, _map$43);
        var _map$45 = PixelFont$set_img$(48, PixelFont$small_black$48, _map$44);
        var _map$46 = PixelFont$set_img$(49, PixelFont$small_black$49, _map$45);
        var _map$47 = PixelFont$set_img$(50, PixelFont$small_black$50, _map$46);
        var _map$48 = PixelFont$set_img$(51, PixelFont$small_black$51, _map$47);
        var _map$49 = PixelFont$set_img$(52, PixelFont$small_black$52, _map$48);
        var _map$50 = PixelFont$set_img$(53, PixelFont$small_black$53, _map$49);
        var _map$51 = PixelFont$set_img$(54, PixelFont$small_black$54, _map$50);
        var _map$52 = PixelFont$set_img$(55, PixelFont$small_black$55, _map$51);
        var _map$53 = PixelFont$set_img$(56, PixelFont$small_black$56, _map$52);
        var _map$54 = PixelFont$set_img$(57, PixelFont$small_black$57, _map$53);
        var _map$55 = PixelFont$set_img$(58, PixelFont$small_black$58, _map$54);
        var _map$56 = PixelFont$set_img$(59, PixelFont$small_black$59, _map$55);
        var _map$57 = PixelFont$set_img$(60, PixelFont$small_black$60, _map$56);
        var _map$58 = PixelFont$set_img$(61, PixelFont$small_black$61, _map$57);
        var _map$59 = PixelFont$set_img$(62, PixelFont$small_black$62, _map$58);
        var _map$60 = PixelFont$set_img$(63, PixelFont$small_black$63, _map$59);
        var _map$61 = PixelFont$set_img$(64, PixelFont$small_black$64, _map$60);
        var _map$62 = PixelFont$set_img$(65, PixelFont$small_black$65, _map$61);
        var _map$63 = PixelFont$set_img$(66, PixelFont$small_black$66, _map$62);
        var _map$64 = PixelFont$set_img$(67, PixelFont$small_black$67, _map$63);
        var _map$65 = PixelFont$set_img$(68, PixelFont$small_black$68, _map$64);
        var _map$66 = PixelFont$set_img$(69, PixelFont$small_black$69, _map$65);
        var _map$67 = PixelFont$set_img$(70, PixelFont$small_black$70, _map$66);
        var _map$68 = PixelFont$set_img$(71, PixelFont$small_black$71, _map$67);
        var _map$69 = PixelFont$set_img$(72, PixelFont$small_black$72, _map$68);
        var _map$70 = PixelFont$set_img$(73, PixelFont$small_black$73, _map$69);
        var _map$71 = PixelFont$set_img$(74, PixelFont$small_black$74, _map$70);
        var _map$72 = PixelFont$set_img$(75, PixelFont$small_black$75, _map$71);
        var _map$73 = PixelFont$set_img$(76, PixelFont$small_black$76, _map$72);
        var _map$74 = PixelFont$set_img$(77, PixelFont$small_black$77, _map$73);
        var _map$75 = PixelFont$set_img$(78, PixelFont$small_black$78, _map$74);
        var _map$76 = PixelFont$set_img$(79, PixelFont$small_black$79, _map$75);
        var _map$77 = PixelFont$set_img$(80, PixelFont$small_black$80, _map$76);
        var _map$78 = PixelFont$set_img$(81, PixelFont$small_black$81, _map$77);
        var _map$79 = PixelFont$set_img$(82, PixelFont$small_black$82, _map$78);
        var _map$80 = PixelFont$set_img$(83, PixelFont$small_black$83, _map$79);
        var _map$81 = PixelFont$set_img$(84, PixelFont$small_black$84, _map$80);
        var _map$82 = PixelFont$set_img$(85, PixelFont$small_black$85, _map$81);
        var _map$83 = PixelFont$set_img$(86, PixelFont$small_black$86, _map$82);
        var _map$84 = PixelFont$set_img$(87, PixelFont$small_black$87, _map$83);
        var _map$85 = PixelFont$set_img$(88, PixelFont$small_black$88, _map$84);
        var _map$86 = PixelFont$set_img$(89, PixelFont$small_black$89, _map$85);
        var _map$87 = PixelFont$set_img$(90, PixelFont$small_black$90, _map$86);
        var _map$88 = PixelFont$set_img$(91, PixelFont$small_black$91, _map$87);
        var _map$89 = PixelFont$set_img$(92, PixelFont$small_black$92, _map$88);
        var _map$90 = PixelFont$set_img$(93, PixelFont$small_black$93, _map$89);
        var _map$91 = PixelFont$set_img$(94, PixelFont$small_black$94, _map$90);
        var _map$92 = PixelFont$set_img$(95, PixelFont$small_black$95, _map$91);
        var _map$93 = PixelFont$set_img$(96, PixelFont$small_black$96, _map$92);
        var _map$94 = PixelFont$set_img$(97, PixelFont$small_black$97, _map$93);
        var _map$95 = PixelFont$set_img$(98, PixelFont$small_black$98, _map$94);
        var _map$96 = PixelFont$set_img$(99, PixelFont$small_black$99, _map$95);
        var $1799 = _map$96;
        return $1799;
    })();
    function App$Kaelin$Draw$creature$hp$(_cx$1, _cy$2, _creature$3, _img$4) {
        var _hp$5 = I32$to_int$((() => {
            var self = _creature$3;
            switch (self._) {
              case "App.Kaelin.Creature.new":
                var $1801 = self.hp;
                var $1802 = $1801;
                return $1802;
            }
        })());
        var _hp$6 = Nat$show$(Int$to_nat$(_hp$5));
        var $1800 = VoxBox$Draw$text$(_hp$6, PixelFont$small_black, 0 | _cx$1 | _cy$2 << 12 | 0 << 24, _img$4);
        return $1800;
    }
    const App$Kaelin$Draw$creature$hp = x0 => x1 => x2 => x3 => App$Kaelin$Draw$creature$hp$(x0, x1, x2, x3);
    function App$Kaelin$Draw$creature$ap$(_cx$1, _cy$2, _creature$3, _img$4) {
        var _ap$5 = I32$to_int$((() => {
            var self = _creature$3;
            switch (self._) {
              case "App.Kaelin.Creature.new":
                var $1804 = self.ap;
                var $1805 = $1804;
                return $1805;
            }
        })());
        var _ap$6 = Nat$show$(Int$to_nat$(_ap$5));
        var $1803 = VoxBox$Draw$text$(_ap$6, PixelFont$small_black, 0 | _cx$1 | _cy$2 << 12 | 0 << 24, _img$4);
        return $1803;
    }
    const App$Kaelin$Draw$creature$ap = x0 => x1 => x2 => x3 => App$Kaelin$Draw$creature$ap$(x0, x1, x2, x3);
    function App$Kaelin$Draw$tile$creature$(_creature$1, _coord$2, _img$3) {
        var self = _creature$1;
        switch (self._) {
          case "Maybe.some":
            var $1807 = self.value;
            var _key$5 = App$Kaelin$Coord$Convert$axial_to_nat$(_coord$2);
            var self = App$Kaelin$Coord$to_screen_xy$(_coord$2);
            switch (self._) {
              case "Pair.new":
                var $1809 = self.fst;
                var $1810 = self.snd;
                var _img$8 = App$Kaelin$Draw$hero$($1809, $1810, 0, (() => {
                    var self = $1807;
                    switch (self._) {
                      case "App.Kaelin.Creature.new":
                        var $1812 = self.hero;
                        var $1813 = $1812;
                        return $1813;
                    }
                })(), _img$3);
                var self = (() => {
                    var self = $1807;
                    switch (self._) {
                      case "App.Kaelin.Creature.new":
                        var $1814 = self.hp;
                        var $1815 = $1814;
                        return $1815;
                    }
                })() > 0;
                if (self) {
                    var _hp$9 = App$Kaelin$Draw$creature$hp$($1809 - 5 >>> 0, $1810 - 31 >>> 0, $1807, _img$8);
                    var _ap$10 = App$Kaelin$Draw$creature$ap$($1809 - 5 >>> 0, $1810 - 25 >>> 0, $1807, _img$8);
                    var $1816 = _ap$10;
                    var $1811 = $1816;
                } else {
                    var $1817 = _img$8;
                    var $1811 = $1817;
                }
                ;
                var $1808 = $1811;
                break;
            }
            ;
            var $1806 = $1808;
            break;

          case "Maybe.none":
            var $1818 = _img$3;
            var $1806 = $1818;
            break;
        }
        return $1806;
    }
    const App$Kaelin$Draw$tile$creature = x0 => x1 => x2 => App$Kaelin$Draw$tile$creature$(x0, x1, x2);
    function Pair$fst$(_pair$3) {
        var self = _pair$3;
        switch (self._) {
          case "Pair.new":
            var $1820 = self.fst;
            var $1821 = $1820;
            var $1819 = $1821;
            break;
        }
        return $1819;
    }
    const Pair$fst = x0 => Pair$fst$(x0);
    const Nat$div = a0 => a1 => a0 / a1;
    function List$get$(_index$2, _list$3) {
        var List$get$ = (_index$2, _list$3) => ({
            ctr: "TCO",
            arg: [ _index$2, _list$3 ]
        });
        var List$get = _index$2 => _list$3 => List$get$(_index$2, _list$3);
        var arg = [ _index$2, _list$3 ];
        while (true) {
            let [ _index$2, _list$3 ] = arg;
            var R = (() => {
                var self = _list$3;
                switch (self._) {
                  case "List.cons":
                    var $1822 = self.head;
                    var $1823 = self.tail;
                    var self = _index$2;
                    if (self === 0n) {
                        var $1825 = Maybe$some$($1822);
                        var $1824 = $1825;
                    } else {
                        var $1826 = self - 1n;
                        var $1827 = List$get$($1826, $1823);
                        var $1824 = $1827;
                    }
                    ;
                    return $1824;

                  case "List.nil":
                    var $1828 = Maybe$none;
                    return $1828;
                }
            })();
            if (R.ctr === "TCO") arg = R.arg; else return R;
        }
    }
    const List$get = x0 => x1 => List$get$(x0, x1);
    function App$Kaelin$Draw$support$animation_frame$(_pos$1, _z$2, _effect$3, _img$4) {
        var self = App$Kaelin$Draw$support$centralize$(_pos$1);
        switch (self._) {
          case "Pair.new":
            var $1830 = self.fst;
            var $1831 = self.snd;
            var $1832 = VoxBox$Draw$image$($1830, $1831 - (App$Kaelin$Constants$hexagon_radius / 2 >>> 0) >>> 0, _z$2, _effect$3, _img$4);
            var $1829 = $1832;
            break;
        }
        return $1829;
    }
    const App$Kaelin$Draw$support$animation_frame = x0 => x1 => x2 => x3 => App$Kaelin$Draw$support$animation_frame$(x0, x1, x2, x3);
    function App$Kaelin$Draw$tile$animation$(_animation$1, _coord$2, _internal$3, _img$4) {
        var self = _animation$1;
        switch (self._) {
          case "Maybe.some":
            var $1834 = self.value;
            var self = $1834;
            switch (self._) {
              case "App.Kaelin.Animation.new":
                var $1836 = self.sprite;
                var self = $1836;
                switch (self._) {
                  case "App.Kaelin.Sprite.new":
                    var $1838 = self.frame_info;
                    var $1839 = self.voxboxes;
                    var self = _internal$3;
                    switch (self._) {
                      case "App.Kaelin.Internal.new":
                        var $1841 = self.frame;
                        var _indx$13 = $1841 / $1838 % list_length($1839);
                        var self = List$get$(_indx$13, $1839);
                        switch (self._) {
                          case "Maybe.some":
                            var $1843 = self.value;
                            var $1844 = App$Kaelin$Draw$support$animation_frame$(_coord$2, 6, $1843, _img$4);
                            var $1842 = $1844;
                            break;

                          case "Maybe.none":
                            var $1845 = _img$4;
                            var $1842 = $1845;
                            break;
                        }
                        ;
                        var $1840 = $1842;
                        break;
                    }
                    ;
                    var $1837 = $1840;
                    break;
                }
                ;
                var $1835 = $1837;
                break;
            }
            ;
            var $1833 = $1835;
            break;

          case "Maybe.none":
            var $1846 = _img$4;
            var $1833 = $1846;
            break;
        }
        return $1833;
    }
    const App$Kaelin$Draw$tile$animation = x0 => x1 => x2 => x3 => App$Kaelin$Draw$tile$animation$(x0, x1, x2, x3);
    function App$Kaelin$Draw$state$map$(_map$1, _cast_info$2, _env_info$3, _internal$4, _img$5) {
        var _map$6 = NatMap$to_list$(_map$1);
        var _mouse_coord$7 = App$Kaelin$Coord$to_axial$((() => {
            var self = _env_info$3;
            switch (self._) {
              case "App.EnvInfo.new":
                var $1848 = self.mouse_pos;
                var $1849 = $1848;
                return $1849;
            }
        })());
        var _img$8 = (() => {
            var $1851 = _img$5;
            var $1852 = _map$6;
            let _img$9 = $1851;
            let _pos$8;
            while ($1852._ === "List.cons") {
                _pos$8 = $1852.head;
                var self = _pos$8;
                switch (self._) {
                  case "Pair.new":
                    var $1853 = self.fst;
                    var $1854 = self.snd;
                    var _coord$12 = App$Kaelin$Coord$Convert$nat_to_axial$($1853);
                    var _img$13 = App$Kaelin$Draw$tile$background$((() => {
                        var self = $1854;
                        switch (self._) {
                          case "App.Kaelin.Tile.new":
                            var $1856 = self.background;
                            var $1857 = $1856;
                            return $1857;
                        }
                    })(), _cast_info$2, _coord$12, _mouse_coord$7, _img$9);
                    var _img$14 = App$Kaelin$Draw$tile$creature$((() => {
                        var self = $1854;
                        switch (self._) {
                          case "App.Kaelin.Tile.new":
                            var $1858 = self.creature;
                            var $1859 = $1858;
                            return $1859;
                        }
                    })(), _coord$12, _img$13);
                    var _img$15 = App$Kaelin$Draw$tile$animation$((() => {
                        var self = $1854;
                        switch (self._) {
                          case "App.Kaelin.Tile.new":
                            var $1860 = self.animation;
                            var $1861 = $1860;
                            return $1861;
                        }
                    })(), _coord$12, _internal$4, _img$14);
                    var $1855 = _img$15;
                    var $1851 = $1855;
                    break;
                }
                _img$9 = $1851;
                $1852 = $1852.tail;
            }
            return _img$9;
        })();
        var $1847 = _img$8;
        return $1847;
    }
    const App$Kaelin$Draw$state$map = x0 => x1 => x2 => x3 => x4 => App$Kaelin$Draw$state$map$(x0, x1, x2, x3, x4);
    const App$Kaelin$Assets$tile$mouse_ui = VoxBox$parse$("0d0302ffffff0e0302ffffff0f0302ffffff100302ffffff110302ffffff0b0402ffffff0c0402ffffff0d0402ffffff0e0402ffffff0f0402ffffff100402ffffff110402ffffff120402ffffff130402ffffff0b0502ffffff0c0502ffffff0d0502ffffff110502ffffff120502ffffff130502ffffff040702ffffff050702ffffff060702ffffff180702ffffff190702ffffff1a0702ffffff030802ffffff040802ffffff050802ffffff060802ffffff180802ffffff190802ffffff1a0802ffffff1b0802ffffff020902ffffff030902ffffff040902ffffff1a0902ffffff1b0902ffffff1c0902ffffff020a02ffffff030a02ffffff1b0a02ffffff1c0a02ffffff020b02ffffff030b02ffffff1b0b02ffffff1c0b02ffffff021302ffffff031302ffffff1b1302ffffff1c1302ffffff021402ffffff031402ffffff1b1402ffffff1c1402ffffff021502ffffff031502ffffff041502ffffff1a1502ffffff1b1502ffffff1c1502ffffff031602ffffff041602ffffff051602ffffff061602ffffff181602ffffff191602ffffff1a1602ffffff1b1602ffffff041702ffffff051702ffffff061702ffffff181702ffffff191702ffffff1a1702ffffff0b1902ffffff0c1902ffffff0d1902ffffff111902ffffff121902ffffff131902ffffff0b1a02ffffff0c1a02ffffff0d1a02ffffff0e1a02ffffff0f1a02ffffff101a02ffffff111a02ffffff121a02ffffff131a02ffffff0d1b02ffffff0e1b02ffffff0f1b02ffffff101b02ffffff111b02ffffff");
    function App$Kaelin$Draw$state$mouse_ui$(_info$1, _img$2) {
        var self = _info$1;
        switch (self._) {
          case "App.EnvInfo.new":
            var $1863 = self.mouse_pos;
            var _coord$5 = App$Kaelin$Coord$to_axial$($1863);
            var self = App$Kaelin$Draw$support$centralize$(_coord$5);
            switch (self._) {
              case "Pair.new":
                var $1865 = self.fst;
                var $1866 = self.snd;
                var $1867 = VoxBox$Draw$image$($1865, $1866, 0, App$Kaelin$Assets$tile$mouse_ui, _img$2);
                var $1864 = $1867;
                break;
            }
            ;
            var $1862 = $1864;
            break;
        }
        return $1862;
    }
    const App$Kaelin$Draw$state$mouse_ui = x0 => x1 => App$Kaelin$Draw$state$mouse_ui$(x0, x1);
    function App$Kaelin$Draw$map$(_img$1, _state$2) {
        var self = _state$2;
        switch (self._) {
          case "App.Store.new":
            var $1869 = self.local;
            var $1870 = self.global;
            var self = $1869;
            switch (self._) {
              case "App.Kaelin.State.local.new":
                var $1872 = self.cast_info;
                var $1873 = self.env_info;
                var $1874 = self.internal;
                var self = $1870;
                switch (self._) {
                  case "App.Kaelin.State.global.new":
                    var $1876 = self.map;
                    var _img$17 = App$Kaelin$Draw$state$map$($1876, $1872, $1873, $1874, _img$1);
                    var _img$18 = App$Kaelin$Draw$state$mouse_ui$($1873, _img$17);
                    var $1877 = _img$18;
                    var $1875 = $1877;
                    break;
                }
                ;
                var $1871 = $1875;
                break;
            }
            ;
            var $1868 = $1871;
            break;
        }
        return $1868;
    }
    const App$Kaelin$Draw$map = x0 => x1 => App$Kaelin$Draw$map$(x0, x1);
    function App$Kaelin$Map$find_players$(_map$1) {
        var _lmap$2 = NatMap$to_list$(_map$1);
        var _players$3 = List$nil;
        var _players$4 = (() => {
            var $1880 = _players$3;
            var $1881 = _lmap$2;
            let _players$5 = $1880;
            let _pair$4;
            while ($1881._ === "List.cons") {
                _pair$4 = $1881.head;
                var self = _pair$4;
                switch (self._) {
                  case "Pair.new":
                    var $1882 = self.fst;
                    var $1883 = $1882;
                    var _coord$6 = $1883;
                    break;
                }
                var self = _pair$4;
                switch (self._) {
                  case "Pair.new":
                    var $1884 = self.snd;
                    var $1885 = $1884;
                    var _tile$7 = $1885;
                    break;
                }
                var _axial_coord$8 = App$Kaelin$Coord$Convert$nat_to_axial$(_coord$6);
                var _result$6 = Maybe$monad$(_m$bind$9 => _m$pure$10 => {
                    var $1886 = _m$bind$9;
                    return $1886;
                })((() => {
                    var self = _tile$7;
                    switch (self._) {
                      case "App.Kaelin.Tile.new":
                        var $1887 = self.creature;
                        var $1888 = $1887;
                        return $1888;
                    }
                })())(_creature$9 => {
                    var $1889 = Maybe$monad$(_m$bind$10 => _m$pure$11 => {
                        var $1890 = _m$bind$10;
                        return $1890;
                    })((() => {
                        var self = _creature$9;
                        switch (self._) {
                          case "App.Kaelin.Creature.new":
                            var $1891 = self.player;
                            var $1892 = $1891;
                            return $1892;
                        }
                    })())(_player$10 => {
                        var $1893 = Maybe$monad$(_m$bind$11 => _m$pure$12 => {
                            var $1894 = _m$pure$12;
                            return $1894;
                        })(List$cons$(Pair$new$(_player$10, _axial_coord$8), List$nil));
                        return $1893;
                    });
                    return $1889;
                });
                var $1880 = List$concat$(_players$5, Maybe$default$(_result$6, List$nil));
                _players$5 = $1880;
                $1881 = $1881.tail;
            }
            return _players$5;
        })();
        var $1878 = Map$from_list$(_players$4);
        return $1878;
    }
    const App$Kaelin$Map$find_players = x0 => App$Kaelin$Map$find_players$(x0);
    function App$Kaelin$Map$player$to_coord$(_address$1, _map$2) {
        var _players$3 = App$Kaelin$Map$find_players$(_map$2);
        var $1895 = Map$get$(_address$1, _players$3);
        return $1895;
    }
    const App$Kaelin$Map$player$to_coord = x0 => x1 => App$Kaelin$Map$player$to_coord$(x0, x1);
    function App$Kaelin$Map$player$info$(_address$1, _map$2) {
        var $1896 = Maybe$monad$(_m$bind$3 => _m$pure$4 => {
            var $1897 = _m$bind$3;
            return $1897;
        })(App$Kaelin$Map$player$to_coord$(_address$1, _map$2))(_coord$3 => {
            var $1898 = Maybe$monad$(_m$bind$4 => _m$pure$5 => {
                var $1899 = _m$bind$4;
                return $1899;
            })(App$Kaelin$Map$get$(_coord$3, _map$2))(_tile$4 => {
                var $1900 = Maybe$monad$(_m$bind$5 => _m$pure$6 => {
                    var $1901 = _m$bind$5;
                    return $1901;
                })((() => {
                    var self = _tile$4;
                    switch (self._) {
                      case "App.Kaelin.Tile.new":
                        var $1902 = self.creature;
                        var $1903 = $1902;
                        return $1903;
                    }
                })())(_creature$5 => {
                    var $1904 = Maybe$monad$(_m$bind$6 => _m$pure$7 => {
                        var $1905 = _m$pure$7;
                        return $1905;
                    })(Pair$new$(_coord$3, _creature$5));
                    return $1904;
                });
                return $1900;
            });
            return $1898;
        });
        return $1896;
    }
    const App$Kaelin$Map$player$info = x0 => x1 => App$Kaelin$Map$player$info$(x0, x1);
    function List$find$(_cond$2, _xs$3) {
        var List$find$ = (_cond$2, _xs$3) => ({
            ctr: "TCO",
            arg: [ _cond$2, _xs$3 ]
        });
        var List$find = _cond$2 => _xs$3 => List$find$(_cond$2, _xs$3);
        var arg = [ _cond$2, _xs$3 ];
        while (true) {
            let [ _cond$2, _xs$3 ] = arg;
            var R = (() => {
                var self = _xs$3;
                switch (self._) {
                  case "List.cons":
                    var $1906 = self.head;
                    var $1907 = self.tail;
                    var self = _cond$2($1906);
                    if (self) {
                        var $1909 = Maybe$some$($1906);
                        var $1908 = $1909;
                    } else {
                        var $1910 = List$find$(_cond$2, $1907);
                        var $1908 = $1910;
                    }
                    ;
                    return $1908;

                  case "List.nil":
                    var $1911 = Maybe$none;
                    return $1911;
                }
            })();
            if (R.ctr === "TCO") arg = R.arg; else return R;
        }
    }
    const List$find = x0 => x1 => List$find$(x0, x1);
    function App$Kaelin$Skill$has_key$(_key$1, _skill$2) {
        var self = _skill$2;
        switch (self._) {
          case "App.Kaelin.Skill.new":
            var $1913 = self.key;
            var $1914 = _key$1 === $1913;
            var $1912 = $1914;
            break;
        }
        return $1912;
    }
    const App$Kaelin$Skill$has_key = x0 => x1 => App$Kaelin$Skill$has_key$(x0, x1);
    function App$Kaelin$Hero$skill$from_key$(_key$1, _hero$2) {
        var self = _hero$2;
        switch (self._) {
          case "App.Kaelin.Hero.new":
            var $1916 = self.skills;
            var $1917 = List$find$(App$Kaelin$Skill$has_key(_key$1), $1916);
            var $1915 = $1917;
            break;
        }
        return $1915;
    }
    const App$Kaelin$Hero$skill$from_key = x0 => x1 => App$Kaelin$Hero$skill$from_key$(x0, x1);
    function App$Kaelin$Coord$show$(_coord$1) {
        var self = _coord$1;
        switch (self._) {
          case "App.Kaelin.Coord.new":
            var $1919 = self.i;
            var $1920 = self.j;
            var $1921 = I32$show$($1919) + (":" + I32$show$($1920));
            var $1918 = $1921;
            break;
        }
        return $1918;
    }
    const App$Kaelin$Coord$show = x0 => App$Kaelin$Coord$show$(x0);
    function U8$to_bits$(_a$1) {
        var self = _a$1;
        switch ("u8") {
          case "u8":
            var $1923 = u8_to_word(self);
            var $1924 = Word$to_bits$($1923);
            var $1922 = $1924;
            break;
        }
        return $1922;
    }
    const U8$to_bits = x0 => U8$to_bits$(x0);
    function List$zip$(_as$3, _bs$4) {
        var self = _as$3;
        switch (self._) {
          case "List.cons":
            var $1926 = self.head;
            var $1927 = self.tail;
            var self = _bs$4;
            switch (self._) {
              case "List.cons":
                var $1929 = self.head;
                var $1930 = self.tail;
                var $1931 = List$cons$(Pair$new$($1926, $1929), List$zip$($1927, $1930));
                var $1928 = $1931;
                break;

              case "List.nil":
                var $1932 = List$nil;
                var $1928 = $1932;
                break;
            }
            ;
            var $1925 = $1928;
            break;

          case "List.nil":
            var $1933 = List$nil;
            var $1925 = $1933;
            break;
        }
        return $1925;
    }
    const List$zip = x0 => x1 => List$zip$(x0, x1);
    const Nat$to_u8 = a0 => Number(a0) & 255;
    const App$Kaelin$Event$Code$action = List$cons$(2, List$nil);
    function String$repeat$(_xs$1, _n$2) {
        var self = _n$2;
        if (self === 0n) {
            var $1935 = String$nil;
            var $1934 = $1935;
        } else {
            var $1936 = self - 1n;
            var $1937 = _xs$1 + String$repeat$(_xs$1, $1936);
            var $1934 = $1937;
        }
        return $1934;
    }
    const String$repeat = x0 => x1 => String$repeat$(x0, x1);
    function App$Kaelin$Event$Code$Hex$set_min_length$(_min$1, _hex$2) {
        var _dif$3 = _min$1 - String$length$(_hex$2) <= 0n ? 0n : _min$1 - String$length$(_hex$2);
        var $1938 = _hex$2 + String$repeat$("0", _dif$3);
        return $1938;
    }
    const App$Kaelin$Event$Code$Hex$set_min_length = x0 => x1 => App$Kaelin$Event$Code$Hex$set_min_length$(x0, x1);
    function App$Kaelin$Event$Code$Hex$format_hex$(_min$1, _hex$2) {
        var _dif$3 = _min$1 - String$length$(_hex$2) <= 0n ? 0n : _min$1 - String$length$(_hex$2);
        var self = String$length$(_hex$2) < _min$1;
        if (self) {
            var $1940 = String$repeat$("0", _dif$3) + _hex$2;
            var $1939 = $1940;
        } else {
            var $1941 = _hex$2;
            var $1939 = $1941;
        }
        return $1939;
    }
    const App$Kaelin$Event$Code$Hex$format_hex = x0 => x1 => App$Kaelin$Event$Code$Hex$format_hex$(x0, x1);
    function Bits$chunks_of$go$(_len$1, _bits$2, _need$3, _chunk$4) {
        var self = _bits$2;
        switch (self.length === 0 ? "e" : self[self.length - 1] === "0" ? "o" : "i") {
          case "o":
            var $1943 = self.slice(0, -1);
            var self = _need$3;
            if (self === 0n) {
                var _head$6 = Bits$reverse$(_chunk$4);
                var _tail$7 = Bits$chunks_of$go$(_len$1, _bits$2, _len$1, Bits$e);
                var $1945 = List$cons$(_head$6, _tail$7);
                var $1944 = $1945;
            } else {
                var $1946 = self - 1n;
                var _chunk$7 = _chunk$4 + "0";
                var $1947 = Bits$chunks_of$go$(_len$1, $1943, $1946, _chunk$7);
                var $1944 = $1947;
            }
            ;
            var $1942 = $1944;
            break;

          case "i":
            var $1948 = self.slice(0, -1);
            var self = _need$3;
            if (self === 0n) {
                var _head$6 = Bits$reverse$(_chunk$4);
                var _tail$7 = Bits$chunks_of$go$(_len$1, _bits$2, _len$1, Bits$e);
                var $1950 = List$cons$(_head$6, _tail$7);
                var $1949 = $1950;
            } else {
                var $1951 = self - 1n;
                var _chunk$7 = _chunk$4 + "1";
                var $1952 = Bits$chunks_of$go$(_len$1, $1948, $1951, _chunk$7);
                var $1949 = $1952;
            }
            ;
            var $1942 = $1949;
            break;

          case "e":
            var $1953 = List$cons$(Bits$reverse$(_chunk$4), List$nil);
            var $1942 = $1953;
            break;
        }
        return $1942;
    }
    const Bits$chunks_of$go = x0 => x1 => x2 => x3 => Bits$chunks_of$go$(x0, x1, x2, x3);
    function Bits$chunks_of$(_len$1, _bits$2) {
        var $1954 = Bits$chunks_of$go$(_len$1, _bits$2, _len$1, Bits$e);
        return $1954;
    }
    const Bits$chunks_of = x0 => x1 => Bits$chunks_of$(x0, x1);
    function Function$flip$(_f$4, _y$5, _x$6) {
        var $1955 = _f$4(_x$6)(_y$5);
        return $1955;
    }
    const Function$flip = x0 => x1 => x2 => Function$flip$(x0, x1, x2);
    function Bits$to_hex_string$(_x$1) {
        var _hex_to_string$2 = _x$2 => {
            var self = Bits$to_nat$(_x$2) === 0n;
            if (self) {
                var $1958 = "0";
                var $1957 = $1958;
            } else {
                var self = Bits$to_nat$(_x$2) === 1n;
                if (self) {
                    var $1960 = "1";
                    var $1959 = $1960;
                } else {
                    var self = Bits$to_nat$(_x$2) === 2n;
                    if (self) {
                        var $1962 = "2";
                        var $1961 = $1962;
                    } else {
                        var self = Bits$to_nat$(_x$2) === 3n;
                        if (self) {
                            var $1964 = "3";
                            var $1963 = $1964;
                        } else {
                            var self = Bits$to_nat$(_x$2) === 4n;
                            if (self) {
                                var $1966 = "4";
                                var $1965 = $1966;
                            } else {
                                var self = Bits$to_nat$(_x$2) === 5n;
                                if (self) {
                                    var $1968 = "5";
                                    var $1967 = $1968;
                                } else {
                                    var self = Bits$to_nat$(_x$2) === 6n;
                                    if (self) {
                                        var $1970 = "6";
                                        var $1969 = $1970;
                                    } else {
                                        var self = Bits$to_nat$(_x$2) === 7n;
                                        if (self) {
                                            var $1972 = "7";
                                            var $1971 = $1972;
                                        } else {
                                            var self = Bits$to_nat$(_x$2) === 8n;
                                            if (self) {
                                                var $1974 = "8";
                                                var $1973 = $1974;
                                            } else {
                                                var self = Bits$to_nat$(_x$2) === 9n;
                                                if (self) {
                                                    var $1976 = "9";
                                                    var $1975 = $1976;
                                                } else {
                                                    var self = Bits$to_nat$(_x$2) === 10n;
                                                    if (self) {
                                                        var $1978 = "a";
                                                        var $1977 = $1978;
                                                    } else {
                                                        var self = Bits$to_nat$(_x$2) === 11n;
                                                        if (self) {
                                                            var $1980 = "b";
                                                            var $1979 = $1980;
                                                        } else {
                                                            var self = Bits$to_nat$(_x$2) === 12n;
                                                            if (self) {
                                                                var $1982 = "c";
                                                                var $1981 = $1982;
                                                            } else {
                                                                var self = Bits$to_nat$(_x$2) === 13n;
                                                                if (self) {
                                                                    var $1984 = "d";
                                                                    var $1983 = $1984;
                                                                } else {
                                                                    var self = Bits$to_nat$(_x$2) === 14n;
                                                                    if (self) {
                                                                        var $1986 = "e";
                                                                        var $1985 = $1986;
                                                                    } else {
                                                                        var self = Bits$to_nat$(_x$2) === 15n;
                                                                        if (self) {
                                                                            var $1988 = "f";
                                                                            var $1987 = $1988;
                                                                        } else {
                                                                            var $1989 = "?";
                                                                            var $1987 = $1989;
                                                                        }
                                                                        var $1985 = $1987;
                                                                    }
                                                                    var $1983 = $1985;
                                                                }
                                                                var $1981 = $1983;
                                                            }
                                                            var $1979 = $1981;
                                                        }
                                                        var $1977 = $1979;
                                                    }
                                                    var $1975 = $1977;
                                                }
                                                var $1973 = $1975;
                                            }
                                            var $1971 = $1973;
                                        }
                                        var $1969 = $1971;
                                    }
                                    var $1967 = $1969;
                                }
                                var $1965 = $1967;
                            }
                            var $1963 = $1965;
                        }
                        var $1961 = $1963;
                    }
                    var $1959 = $1961;
                }
                var $1957 = $1959;
            }
            return $1957;
        };
        var _ls$3 = Bits$chunks_of$(4n, _x$1);
        var $1956 = List$foldr$("", _x$4 => {
            var $1990 = Function$flip(String$concat)(_hex_to_string$2(_x$4));
            return $1990;
        }, _ls$3);
        return $1956;
    }
    const Bits$to_hex_string = x0 => Bits$to_hex_string$(x0);
    function App$Kaelin$Event$Code$Hex$append$(_hex$1, _size$2, _x$3) {
        var _hex2$4 = App$Kaelin$Event$Code$Hex$format_hex$(_size$2, Bits$to_hex_string$(_x$3));
        var $1991 = _hex$1 + _hex2$4;
        return $1991;
    }
    const App$Kaelin$Event$Code$Hex$append = x0 => x1 => x2 => App$Kaelin$Event$Code$Hex$append$(x0, x1, x2);
    const U8$to_nat = a0 => BigInt(a0);
    function App$Kaelin$Event$Code$generate_hex$(_xs$1) {
        var $1992 = List$foldr$("", _x$2 => _y$3 => {
            var $1993 = App$Kaelin$Event$Code$Hex$append$(_y$3, BigInt(Pair$fst$(_x$2)), Pair$snd$(_x$2));
            return $1993;
        }, List$reverse$(_xs$1));
        return $1992;
    }
    const App$Kaelin$Event$Code$generate_hex = x0 => App$Kaelin$Event$Code$generate_hex$(x0);
    function generate_hex$(_xs$1, _ys$2) {
        var _consumer$3 = List$zip$(List$concat$(App$Kaelin$Event$Code$action, _xs$1), _ys$2);
        var $1994 = "0x" + App$Kaelin$Event$Code$Hex$set_min_length$(64n, App$Kaelin$Event$Code$generate_hex$(_consumer$3));
        return $1994;
    }
    const generate_hex = x0 => x1 => generate_hex$(x0, x1);
    const App$Kaelin$Event$Code$create_hero = List$cons$(2, List$nil);
    function Hex_to_nat$parser$(_pst$1) {
        var self = _pst$1;
        switch (self._) {
          case "Parser.State.new":
            var $1996 = self.err;
            var _reply$7 = Parser$maybe$(Parser$text("0x"), _pst$1);
            var self = _reply$7;
            switch (self._) {
              case "Parser.Reply.error":
                var $1998 = self.err;
                var self = $1996;
                switch (self._) {
                  case "Maybe.some":
                    var $2000 = self.value;
                    var $2001 = Parser$Reply$error$(Parser$Error$combine$($2000, $1998));
                    var $1999 = $2001;
                    break;

                  case "Maybe.none":
                    var $2002 = Parser$Reply$error$($1998);
                    var $1999 = $2002;
                    break;
                }
                ;
                var $1997 = $1999;
                break;

              case "Parser.Reply.value":
                var $2003 = self.pst;
                var self = $2003;
                switch (self._) {
                  case "Parser.State.new":
                    var $2005 = self.err;
                    var $2006 = self.nam;
                    var $2007 = self.ini;
                    var $2008 = self.idx;
                    var $2009 = self.str;
                    var _reply$pst$15 = Parser$State$new$(Parser$Error$maybe_combine$($1996, $2005), $2006, $2007, $2008, $2009);
                    var self = _reply$pst$15;
                    switch (self._) {
                      case "Parser.State.new":
                        var $2011 = self.err;
                        var _reply$21 = Parser$many1$(Parser$hex_digit, _reply$pst$15);
                        var self = _reply$21;
                        switch (self._) {
                          case "Parser.Reply.error":
                            var $2013 = self.err;
                            var self = $2011;
                            switch (self._) {
                              case "Maybe.some":
                                var $2015 = self.value;
                                var $2016 = Parser$Reply$error$(Parser$Error$combine$($2015, $2013));
                                var $2014 = $2016;
                                break;

                              case "Maybe.none":
                                var $2017 = Parser$Reply$error$($2013);
                                var $2014 = $2017;
                                break;
                            }
                            ;
                            var $2012 = $2014;
                            break;

                          case "Parser.Reply.value":
                            var $2018 = self.pst;
                            var $2019 = self.val;
                            var self = $2018;
                            switch (self._) {
                              case "Parser.State.new":
                                var $2021 = self.err;
                                var $2022 = self.nam;
                                var $2023 = self.ini;
                                var $2024 = self.idx;
                                var $2025 = self.str;
                                var _reply$pst$29 = Parser$State$new$(Parser$Error$maybe_combine$($2011, $2021), $2022, $2023, $2024, $2025);
                                var $2026 = Parser$Reply$value$(_reply$pst$29, Nat$from_base$(16n, $2019));
                                var $2020 = $2026;
                                break;
                            }
                            ;
                            var $2012 = $2020;
                            break;
                        }
                        ;
                        var $2010 = $2012;
                        break;
                    }
                    ;
                    var $2004 = $2010;
                    break;
                }
                ;
                var $1997 = $2004;
                break;
            }
            ;
            var $1995 = $1997;
            break;
        }
        return $1995;
    }
    const Hex_to_nat$parser = x0 => Hex_to_nat$parser$(x0);
    function App$Kaelin$Event$Code$Hex$to_nat$(_x$1) {
        var self = Parser$run$(Hex_to_nat$parser, _x$1);
        switch (self._) {
          case "Maybe.some":
            var $2028 = self.value;
            var $2029 = $2028;
            var $2027 = $2029;
            break;

          case "Maybe.none":
            var $2030 = 0n;
            var $2027 = $2030;
            break;
        }
        return $2027;
    }
    const App$Kaelin$Event$Code$Hex$to_nat = x0 => App$Kaelin$Event$Code$Hex$to_nat$(x0);
    function App$Kaelin$Resources$Action$to_bits$(_x$1) {
        var self = _x$1;
        switch (self._) {
          case "App.Kaelin.Action.walk":
            var $2032 = 0n;
            var _n$2 = $2032;
            break;

          case "App.Kaelin.Action.ability_0":
            var $2033 = 1n;
            var _n$2 = $2033;
            break;

          case "App.Kaelin.Action.ability_1":
            var $2034 = 2n;
            var _n$2 = $2034;
            break;
        }
        var $2031 = nat_to_bits(_n$2);
        return $2031;
    }
    const App$Kaelin$Resources$Action$to_bits = x0 => App$Kaelin$Resources$Action$to_bits$(x0);
    function App$Kaelin$Coord$Convert$axial_to_bits$(_x$1) {
        var _unique_nat$2 = App$Kaelin$Coord$Convert$axial_to_nat$(_x$1);
        var $2035 = nat_to_bits(_unique_nat$2);
        return $2035;
    }
    const App$Kaelin$Coord$Convert$axial_to_bits = x0 => App$Kaelin$Coord$Convert$axial_to_bits$(x0);
    const App$Kaelin$Event$Code$user_input = List$cons$(40, List$cons$(2, List$cons$(8, List$nil)));
    const App$Kaelin$Event$Code$exe_skill = List$cons$(40, List$cons$(8, List$cons$(4, List$nil)));
    function App$Kaelin$Team$code$(_team$1) {
        var self = _team$1;
        switch (self._) {
          case "App.Kaelin.Team.red":
            var $2037 = 1;
            var $2036 = $2037;
            break;

          case "App.Kaelin.Team.blue":
            var $2038 = 2;
            var $2036 = $2038;
            break;

          case "App.Kaelin.Team.neutral":
            var $2039 = 0;
            var $2036 = $2039;
            break;
        }
        return $2036;
    }
    const App$Kaelin$Team$code = x0 => App$Kaelin$Team$code$(x0);
    const App$Kaelin$Event$Code$save_skill = List$cons$(40, List$cons$(8, List$cons$(4, List$cons$(2, List$nil))));
    const App$Kaelin$Event$Code$remove_skill = List$cons$(40, List$cons$(8, List$cons$(4, List$nil)));
    const App$Kaelin$Event$Code$draft_hero = List$cons$(2, List$nil);
    const App$Kaelin$Event$Code$draft_coord = List$cons$(8, List$nil);
    const App$Kaelin$Event$Code$draft_team = List$cons$(2, List$nil);
    function App$Kaelin$Event$serialize$(_event$1) {
        var self = _event$1;
        switch (self._) {
          case "App.Kaelin.Event.create_hero":
            var $2041 = self.hero_id;
            var _cod$3 = List$cons$(nat_to_bits(1n), List$cons$(U8$to_bits$($2041), List$nil));
            var $2042 = generate_hex$(App$Kaelin$Event$Code$create_hero, _cod$3);
            var $2040 = $2042;
            break;

          case "App.Kaelin.Event.user_input":
            var $2043 = self.player;
            var $2044 = self.coord;
            var $2045 = self.action;
            var _cod$5 = List$cons$(nat_to_bits(4n), List$cons$(nat_to_bits(App$Kaelin$Event$Code$Hex$to_nat$($2043)), List$cons$(App$Kaelin$Resources$Action$to_bits$($2045), List$cons$(App$Kaelin$Coord$Convert$axial_to_bits$($2044), List$nil))));
            var $2046 = generate_hex$(App$Kaelin$Event$Code$user_input, _cod$5);
            var $2040 = $2046;
            break;

          case "App.Kaelin.Event.exe_skill":
            var $2047 = self.player;
            var $2048 = self.target_pos;
            var $2049 = self.key;
            var _cod$5 = List$cons$(nat_to_bits(5n), List$cons$(nat_to_bits(App$Kaelin$Event$Code$Hex$to_nat$($2047)), List$cons$(App$Kaelin$Coord$Convert$axial_to_bits$($2048), List$cons$(u16_to_bits($2049), List$nil))));
            var $2050 = generate_hex$(App$Kaelin$Event$Code$exe_skill, _cod$5);
            var $2040 = $2050;
            break;

          case "App.Kaelin.Event.save_skill":
            var $2051 = self.player;
            var $2052 = self.target_pos;
            var $2053 = self.key;
            var $2054 = self.team;
            var _cod$6 = List$cons$(nat_to_bits(11n), List$cons$(nat_to_bits(App$Kaelin$Event$Code$Hex$to_nat$($2051)), List$cons$(App$Kaelin$Coord$Convert$axial_to_bits$($2052), List$cons$(u16_to_bits($2053), List$cons$(U8$to_bits$(App$Kaelin$Team$code$($2054)), List$nil)))));
            var $2055 = generate_hex$(App$Kaelin$Event$Code$save_skill, _cod$6);
            var $2040 = $2055;
            break;

          case "App.Kaelin.Event.remove_skill":
            var $2056 = self.player;
            var $2057 = self.target_pos;
            var $2058 = self.key;
            var $2059 = self.team;
            var _cod$6 = List$cons$(nat_to_bits(12n), List$cons$(nat_to_bits(App$Kaelin$Event$Code$Hex$to_nat$($2056)), List$cons$(App$Kaelin$Coord$Convert$axial_to_bits$($2057), List$cons$(u16_to_bits($2058), List$cons$(U8$to_bits$(App$Kaelin$Team$code$($2059)), List$nil)))));
            var $2060 = generate_hex$(App$Kaelin$Event$Code$remove_skill, _cod$6);
            var $2040 = $2060;
            break;

          case "App.Kaelin.Event.draft_hero":
            var $2061 = self.hero;
            var _cod$3 = List$cons$(nat_to_bits(6n), List$cons$(U8$to_bits$($2061), List$nil));
            var $2062 = generate_hex$(App$Kaelin$Event$Code$draft_hero, _cod$3);
            var $2040 = $2062;
            break;

          case "App.Kaelin.Event.draft_coord":
            var $2063 = self.coord;
            var _cod$3 = List$cons$(nat_to_bits(7n), List$cons$(App$Kaelin$Coord$Convert$axial_to_bits$($2063), List$nil));
            var $2064 = generate_hex$(App$Kaelin$Event$Code$draft_coord, _cod$3);
            var $2040 = $2064;
            break;

          case "App.Kaelin.Event.draft_team":
            var $2065 = self.team;
            var _cod$3 = List$cons$(nat_to_bits(10n), List$cons$(U8$to_bits$($2065), List$nil));
            var $2066 = generate_hex$(App$Kaelin$Event$Code$draft_team, _cod$3);
            var $2040 = $2066;
            break;

          case "App.Kaelin.Event.start_game":
          case "App.Kaelin.Event.create_user":
            var $2067 = "";
            var $2040 = $2067;
            break;

          case "App.Kaelin.Event.end_action":
            var _cod$2 = List$cons$(nat_to_bits(13n), List$nil);
            var $2068 = generate_hex$(List$nil, _cod$2);
            var $2040 = $2068;
            break;

          case "App.Kaelin.Event.draft_end":
            var _cod$2 = List$cons$(nat_to_bits(8n), List$nil);
            var $2069 = generate_hex$(List$nil, _cod$2);
            var $2040 = $2069;
            break;

          case "App.Kaelin.Event.to_draft":
            var _cod$2 = List$cons$(nat_to_bits(9n), List$nil);
            var $2070 = generate_hex$(List$nil, _cod$2);
            var $2040 = $2070;
            break;
        }
        return $2040;
    }
    const App$Kaelin$Event$serialize = x0 => App$Kaelin$Event$serialize$(x0);
    function App$Kaelin$Event$remove_skill$(_player$1, _target_pos$2, _key$3, _team$4) {
        var $2071 = {
            _: "App.Kaelin.Event.remove_skill",
            player: _player$1,
            target_pos: _target_pos$2,
            key: _key$3,
            team: _team$4
        };
        return $2071;
    }
    const App$Kaelin$Event$remove_skill = x0 => x1 => x2 => x3 => App$Kaelin$Event$remove_skill$(x0, x1, x2, x3);
    function remove_button$(_cast$1) {
        var $2072 = DOM$node$("button", Map$from_list$(List$cons$(Pair$new$("id", App$Kaelin$Event$serialize$(App$Kaelin$Event$remove_skill$((() => {
            var self = _cast$1;
            switch (self._) {
              case "App.Kaelin.CastInfo.global.new":
                var $2073 = self.player;
                var $2074 = $2073;
                return $2074;
            }
        })(), (() => {
            var self = _cast$1;
            switch (self._) {
              case "App.Kaelin.CastInfo.global.new":
                var $2075 = self.target_pos;
                var $2076 = $2075;
                return $2076;
            }
        })(), (() => {
            var self = _cast$1;
            switch (self._) {
              case "App.Kaelin.CastInfo.global.new":
                var $2077 = self.key;
                var $2078 = $2077;
                return $2078;
            }
        })(), (() => {
            var self = _cast$1;
            switch (self._) {
              case "App.Kaelin.CastInfo.global.new":
                var $2079 = self.team;
                var $2080 = $2079;
                return $2080;
            }
        })()))), List$nil)), Map$from_list$(List$cons$(Pair$new$("padding", "5px 10px"), List$cons$(Pair$new$("background-color", "red"), List$cons$(Pair$new$("font-weight", "bold"), List$cons$(Pair$new$("color", "white"), List$cons$(Pair$new$("border", "none"), List$cons$(Pair$new$("border-radius", "5px"), List$cons$(Pair$new$("box-shadow", "0 0 3px black"), List$cons$(Pair$new$("cursor", "pointer"), List$nil))))))))), List$cons$(DOM$text$("X"), List$nil));
        return $2072;
    }
    const remove_button = x0 => remove_button$(x0);
    function App$Kaelin$Draw$game$skill_list$(_local_player$1, _map$2, _is_planning$3, _cast$4) {
        var _result$5 = Maybe$monad$(_m$bind$5 => _m$pure$6 => {
            var $2082 = _m$bind$5;
            return $2082;
        })(App$Kaelin$Map$player$info$((() => {
            var self = _cast$4;
            switch (self._) {
              case "App.Kaelin.CastInfo.global.new":
                var $2083 = self.player;
                var $2084 = $2083;
                return $2084;
            }
        })(), _map$2))(_info$5 => {
            var self = _info$5;
            switch (self._) {
              case "Pair.new":
                var $2086 = self.snd;
                var $2087 = $2086;
                var _creature$6 = $2087;
                break;
            }
            var $2085 = Maybe$monad$(_m$bind$7 => _m$pure$8 => {
                var $2088 = _m$bind$7;
                return $2088;
            })(App$Kaelin$Hero$skill$from_key$((() => {
                var self = _cast$4;
                switch (self._) {
                  case "App.Kaelin.CastInfo.global.new":
                    var $2089 = self.key;
                    var $2090 = $2089;
                    return $2090;
                }
            })(), (() => {
                var self = _creature$6;
                switch (self._) {
                  case "App.Kaelin.Creature.new":
                    var $2091 = self.hero;
                    var $2092 = $2091;
                    return $2092;
                }
            })()))(_skill$7 => {
                var _coord$8 = App$Kaelin$Coord$show$((() => {
                    var self = _cast$4;
                    switch (self._) {
                      case "App.Kaelin.CastInfo.global.new":
                        var $2094 = self.target_pos;
                        var $2095 = $2094;
                        return $2095;
                    }
                })());
                var self = _is_planning$3;
                if (self) {
                    var $2096 = remove_button$(_cast$4);
                    var _button$9 = $2096;
                } else {
                    var $2097 = DOM$text$("");
                    var _button$9 = $2097;
                }
                var $2093 = Maybe$monad$(_m$bind$10 => _m$pure$11 => {
                    var $2098 = _m$pure$11;
                    return $2098;
                })(DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("align-items", "center"), List$cons$(Pair$new$("margin-bottom", "5px"), List$nil)))), List$cons$(DOM$node$("p", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("margin-right", "5px"), List$nil)), List$cons$(DOM$text$(_coord$8 + (" " + (() => {
                    var self = _skill$7;
                    switch (self._) {
                      case "App.Kaelin.Skill.new":
                        var $2099 = self.name;
                        var $2100 = $2099;
                        return $2100;
                    }
                })())), List$nil)), List$cons$(_button$9, List$nil))));
                return $2093;
            });
            return $2085;
        });
        var _result$6 = Maybe$default$(_result$5, DOM$text$(""));
        var self = _is_planning$3;
        if (self) {
            var self = (() => {
                var self = _cast$4;
                switch (self._) {
                  case "App.Kaelin.CastInfo.global.new":
                    var $2102 = self.player;
                    var $2103 = $2102;
                    return $2103;
                }
            })() === _local_player$1;
            if (self) {
                var $2104 = _result$6;
                var $2101 = $2104;
            } else {
                var $2105 = DOM$text$("");
                var $2101 = $2105;
            }
            var $2081 = $2101;
        } else {
            var $2106 = _result$6;
            var $2081 = $2106;
        }
        return $2081;
    }
    const App$Kaelin$Draw$game$skill_list = x0 => x1 => x2 => x3 => App$Kaelin$Draw$game$skill_list$(x0, x1, x2, x3);
    function App$Kaelin$Draw$game$(_img$1, _state$2) {
        var self = _state$2;
        switch (self._) {
          case "App.Store.new":
            var $2108 = self.local;
            var $2109 = self.global;
            var self = $2109;
            switch (self._) {
              case "App.Kaelin.State.global.new":
                var $2111 = self.round;
                var $2112 = self.map;
                var $2113 = self.stage;
                var $2114 = self.skills_list;
                var self = $2108;
                switch (self._) {
                  case "App.Kaelin.State.local.new":
                    var $2116 = self.user;
                    var self = $2113;
                    switch (self._) {
                      case "App.Kaelin.Stage.planning":
                        var $2118 = self.seconds;
                        var $2119 = Maybe$some$($2118);
                        var _seconds$17 = $2119;
                        break;

                      case "App.Kaelin.Stage.init":
                      case "App.Kaelin.Stage.draft":
                      case "App.Kaelin.Stage.action":
                        var $2120 = Maybe$none;
                        var _seconds$17 = $2120;
                        break;
                    }
                    ;
                    var self = $2113;
                    switch (self._) {
                      case "App.Kaelin.Stage.init":
                      case "App.Kaelin.Stage.draft":
                      case "App.Kaelin.Stage.action":
                        var $2121 = Bool$false;
                        var _is_planning$18 = $2121;
                        break;

                      case "App.Kaelin.Stage.planning":
                        var $2122 = Bool$true;
                        var _is_planning$18 = $2122;
                        break;
                    }
                    ;
                    var $2117 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("width", "100vw"), List$cons$(Pair$new$("height", "100vh"), List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("flex-direction", "column"), List$cons$(Pair$new$("justify-content", "center"), List$cons$(Pair$new$("align-items", "center"), List$cons$(Pair$new$("position", "relative"), List$nil)))))))), List$cons$(DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("margin-bottom", "10px"), List$nil)), App$Kaelin$Draw$game$round$(_seconds$17, $2111)), List$cons$(DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$nil), List$cons$(DOM$vbox$(Map$from_list$(List$cons$(Pair$new$("width", "512"), List$nil)), Map$from_list$(List$cons$(Pair$new$("border", "none"), List$cons$(Pair$new$("image-rendering", "pixelated"), List$nil))), App$Kaelin$Draw$map$(_img$1, _state$2)), List$nil)), List$cons$(DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("position", "absolute"), List$cons$(Pair$new$("bottom", "0px"), List$cons$(Pair$new$("right", "0px"), List$cons$(Pair$new$("margin", "15px"), List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("flex-direction", "column-reverse"), List$nil))))))), List$map$(App$Kaelin$Draw$game$skill_list($2116)($2112)(_is_planning$18), $2114)), List$nil))));
                    var $2115 = $2117;
                    break;
                }
                ;
                var $2110 = $2115;
                break;
            }
            ;
            var $2107 = $2110;
            break;
        }
        return $2107;
    }
    const App$Kaelin$Draw$game = x0 => x1 => App$Kaelin$Draw$game$(x0, x1);
    function App$Kaelin$App$draw$(_img$1, _state$2) {
        var self = _state$2;
        switch (self._) {
          case "App.Store.new":
            var $2124 = self.local;
            var $2125 = self.global;
            var self = $2125;
            switch (self._) {
              case "App.Kaelin.State.global.new":
                var $2127 = self.stage;
                var $2128 = $2127;
                var _stage$5 = $2128;
                break;
            }
            ;
            var self = _stage$5;
            switch (self._) {
              case "App.Kaelin.Stage.draft":
                var $2129 = self.players;
                var $2130 = self.coords;
                var $2131 = App$Kaelin$Draw$draft$($2129, $2130, (() => {
                    var self = $2124;
                    switch (self._) {
                      case "App.Kaelin.State.local.new":
                        var $2132 = self.user;
                        var $2133 = $2132;
                        return $2133;
                    }
                })());
                var $2126 = $2131;
                break;

              case "App.Kaelin.Stage.init":
                var $2134 = App$Kaelin$Draw$init$((() => {
                    var self = $2124;
                    switch (self._) {
                      case "App.Kaelin.State.local.new":
                        var $2135 = self.input;
                        var $2136 = $2135;
                        return $2136;
                    }
                })());
                var $2126 = $2134;
                break;

              case "App.Kaelin.Stage.planning":
              case "App.Kaelin.Stage.action":
                var $2137 = App$Kaelin$Draw$game$(_img$1, _state$2);
                var $2126 = $2137;
                break;
            }
            ;
            var $2123 = $2126;
            break;
        }
        return $2123;
    }
    const App$Kaelin$App$draw = x0 => x1 => App$Kaelin$App$draw$(x0, x1);
    function IO$(_A$1) {
        var $2138 = null;
        return $2138;
    }
    const IO = x0 => IO$(x0);
    const App$State$local = Pair$fst;
    function String$map$(_f$1, _as$2) {
        var self = _as$2;
        if (self.length === 0) {
            var $2140 = String$nil;
            var $2139 = $2140;
        } else {
            var $2141 = self.charCodeAt(0);
            var $2142 = self.slice(1);
            var $2143 = String$cons$(_f$1($2141), String$map$(_f$1, $2142));
            var $2139 = $2143;
        }
        return $2139;
    }
    const String$map = x0 => x1 => String$map$(x0, x1);
    const U16$gte = a0 => a1 => a0 >= a1;
    const U16$lte = a0 => a1 => a0 <= a1;
    const U16$add = a0 => a1 => a0 + a1 & 65535;
    function Char$to_lower$(_char$1) {
        var self = _char$1 >= 65 && _char$1 <= 90;
        if (self) {
            var $2145 = _char$1 + 32 & 65535;
            var $2144 = $2145;
        } else {
            var $2146 = _char$1;
            var $2144 = $2146;
        }
        return $2144;
    }
    const Char$to_lower = x0 => Char$to_lower$(x0);
    function String$to_lower$(_str$1) {
        var $2147 = String$map$(Char$to_lower, _str$1);
        return $2147;
    }
    const String$to_lower = x0 => String$to_lower$(x0);
    function IO$ask$(_query$2, _param$3, _then$4) {
        var $2148 = {
            _: "IO.ask",
            query: _query$2,
            param: _param$3,
            then: _then$4
        };
        return $2148;
    }
    const IO$ask = x0 => x1 => x2 => IO$ask$(x0, x1, x2);
    function IO$bind$(_a$3, _f$4) {
        var self = _a$3;
        switch (self._) {
          case "IO.end":
            var $2150 = self.value;
            var $2151 = _f$4($2150);
            var $2149 = $2151;
            break;

          case "IO.ask":
            var $2152 = self.query;
            var $2153 = self.param;
            var $2154 = self.then;
            var $2155 = IO$ask$($2152, $2153, _x$8 => {
                var $2156 = IO$bind$($2154(_x$8), _f$4);
                return $2156;
            });
            var $2149 = $2155;
            break;
        }
        return $2149;
    }
    const IO$bind = x0 => x1 => IO$bind$(x0, x1);
    function IO$end$(_value$2) {
        var $2157 = {
            _: "IO.end",
            value: _value$2
        };
        return $2157;
    }
    const IO$end = x0 => IO$end$(x0);
    function IO$monad$(_new$2) {
        var $2158 = _new$2(IO$bind)(IO$end);
        return $2158;
    }
    const IO$monad = x0 => IO$monad$(x0);
    function App$set_local$(_value$2) {
        var $2159 = IO$monad$(_m$bind$3 => _m$pure$4 => {
            var $2160 = _m$pure$4;
            return $2160;
        })(Maybe$some$(_value$2));
        return $2159;
    }
    const App$set_local = x0 => App$set_local$(x0);
    const App$pass = IO$monad$(_m$bind$2 => _m$pure$3 => {
        var $2161 = _m$pure$3;
        return $2161;
    })(Maybe$none);
    const Nat$read = a0 => BigInt(a0);
    const IO$get_time = IO$ask$("get_time", "", _time$1 => {
        var $2162 = IO$end$(BigInt(_time$1));
        return $2162;
    });
    function Nat$random$(_seed$1) {
        var _m$2 = 1664525n;
        var _i$3 = 1013904223n;
        var _q$4 = 4294967296n;
        var $2163 = (_seed$1 * _m$2 + _i$3) % _q$4;
        return $2163;
    }
    const Nat$random = x0 => Nat$random$(x0);
    function IO$random$(_a$1) {
        var $2164 = IO$monad$(_m$bind$2 => _m$pure$3 => {
            var $2165 = _m$bind$2;
            return $2165;
        })(IO$get_time)(_seed$2 => {
            var _seed$3 = Nat$random$(_seed$2);
            var $2166 = IO$monad$(_m$bind$4 => _m$pure$5 => {
                var $2167 = _m$pure$5;
                return $2167;
            })(_seed$3 % _a$1);
            return $2166;
        });
        return $2164;
    }
    const IO$random = x0 => IO$random$(x0);
    function IO$do$(_call$1, _param$2) {
        var $2168 = IO$ask$(_call$1, _param$2, _answer$3 => {
            var $2169 = IO$end$(Unit$new);
            return $2169;
        });
        return $2168;
    }
    const IO$do = x0 => x1 => IO$do$(x0, x1);
    function App$do$(_call$2, _param$3) {
        var $2170 = IO$monad$(_m$bind$4 => _m$pure$5 => {
            var $2171 = _m$bind$4;
            return $2171;
        })(IO$do$(_call$2, _param$3))(_$4 => {
            var $2172 = App$pass;
            return $2172;
        });
        return $2170;
    }
    const App$do = x0 => x1 => App$do$(x0, x1);
    function App$watch$(_room$2) {
        var $2173 = App$do$("watch", _room$2);
        return $2173;
    }
    const App$watch = x0 => App$watch$(x0);
    function App$new_post$(_room$2, _data$3) {
        var $2174 = IO$monad$(_m$bind$4 => _m$pure$5 => {
            var $2175 = _m$bind$4;
            return $2175;
        })(App$do$("post", _room$2 + (";" + _data$3)))(_$4 => {
            var $2176 = App$pass;
            return $2176;
        });
        return $2174;
    }
    const App$new_post = x0 => x1 => App$new_post$(x0, x1);
    const App$Kaelin$Event$to_draft = {
        _: "App.Kaelin.Event.to_draft"
    };
    const Debug$log = a0 => a1 => (console.log(a0), a1());
    function App$Kaelin$Event$draft_coord$(_coord$1) {
        var $2177 = {
            _: "App.Kaelin.Event.draft_coord",
            coord: _coord$1
        };
        return $2177;
    }
    const App$Kaelin$Event$draft_coord = x0 => App$Kaelin$Event$draft_coord$(x0);
    const U8$add = a0 => a1 => a0 + a1 & 255;
    function App$Kaelin$Hero$info$map_go$(_id$1, _map$2) {
        var App$Kaelin$Hero$info$map_go$ = (_id$1, _map$2) => ({
            ctr: "TCO",
            arg: [ _id$1, _map$2 ]
        });
        var App$Kaelin$Hero$info$map_go = _id$1 => _map$2 => App$Kaelin$Hero$info$map_go$(_id$1, _map$2);
        var arg = [ _id$1, _map$2 ];
        while (true) {
            let [ _id$1, _map$2 ] = arg;
            var R = (() => {
                var _hero$3 = App$Kaelin$Hero$info$(_id$1);
                var self = _hero$3;
                switch (self._) {
                  case "Maybe.some":
                    var $2179 = self.value;
                    var $2180 = App$Kaelin$Hero$info$map_go$(_id$1 + 1 & 255, Map$set$((() => {
                        var self = $2179;
                        switch (self._) {
                          case "App.Kaelin.Hero.new":
                            var $2181 = self.name;
                            var $2182 = $2181;
                            return $2182;
                        }
                    })(), _id$1, _map$2));
                    var $2178 = $2180;
                    break;

                  case "Maybe.none":
                    var $2183 = _map$2;
                    var $2178 = $2183;
                    break;
                }
                return $2178;
            })();
            if (R.ctr === "TCO") arg = R.arg; else return R;
        }
    }
    const App$Kaelin$Hero$info$map_go = x0 => x1 => App$Kaelin$Hero$info$map_go$(x0, x1);
    const App$Kaelin$Hero$info$map = App$Kaelin$Hero$info$map_go$(0, Map$new);
    function App$Kaelin$Event$draft_hero$(_hero$1) {
        var $2184 = {
            _: "App.Kaelin.Event.draft_hero",
            hero: _hero$1
        };
        return $2184;
    }
    const App$Kaelin$Event$draft_hero = x0 => App$Kaelin$Event$draft_hero$(x0);
    const App$Kaelin$Event$draft_end = {
        _: "App.Kaelin.Event.draft_end"
    };
    function App$Kaelin$Event$draft_team$(_team$1) {
        var $2185 = {
            _: "App.Kaelin.Event.draft_team",
            team: _team$1
        };
        return $2185;
    }
    const App$Kaelin$Event$draft_team = x0 => App$Kaelin$Event$draft_team$(x0);
    const U64$to_nat = a0 => a0;
    function App$Kaelin$Action$local$set_internal$(_time$1, _local$2) {
        var self = _local$2;
        switch (self._) {
          case "App.Kaelin.State.local.new":
            var $2187 = self.internal;
            var self = $2187;
            switch (self._) {
              case "App.Kaelin.Internal.new":
                var $2189 = self.frame;
                var $2190 = self.timer;
                var self = _local$2;
                switch (self._) {
                  case "App.Kaelin.State.local.new":
                    var $2192 = self.input;
                    var $2193 = self.user;
                    var $2194 = self.team;
                    var $2195 = self.cast_info;
                    var $2196 = self.env_info;
                    var $2197 = App$Kaelin$State$local$new$($2192, $2193, $2194, $2195, $2196, App$Kaelin$Internal$new$(_time$1, $2189 + 1n, $2190));
                    var $2191 = $2197;
                    break;
                }
                ;
                var $2188 = $2191;
                break;
            }
            ;
            var $2186 = $2188;
            break;
        }
        return $2186;
    }
    const App$Kaelin$Action$local$set_internal = x0 => x1 => App$Kaelin$Action$local$set_internal$(x0, x1);
    function App$Kaelin$Action$local$env_info$(_time$1, _env_info$2, _local$3) {
        var _local$4 = App$Kaelin$Action$local$set_internal$(_time$1, _local$3);
        var self = _local$4;
        switch (self._) {
          case "App.Kaelin.State.local.new":
            var $2199 = self.input;
            var $2200 = self.user;
            var $2201 = self.team;
            var $2202 = self.cast_info;
            var $2203 = self.internal;
            var $2204 = App$Kaelin$State$local$new$($2199, $2200, $2201, $2202, _env_info$2, $2203);
            var $2198 = $2204;
            break;
        }
        return $2198;
    }
    const App$Kaelin$Action$local$env_info = x0 => x1 => x2 => App$Kaelin$Action$local$env_info$(x0, x1, x2);
    function App$Kaelin$Effect$indicators$get_indicators$(_hero_pos$1, _skill$2, _mouse_coord$3, _map$4) {
        var self = _skill$2;
        switch (self._) {
          case "App.Kaelin.Skill.new":
            var $2206 = self.effect;
            var _result$9 = $2206(_hero_pos$1)(_mouse_coord$3)(_map$4);
            var self = _result$9;
            switch (self._) {
              case "App.Kaelin.Effect.Result.new":
                var $2208 = self.indicators;
                var $2209 = $2208;
                var $2207 = $2209;
                break;
            }
            ;
            var $2205 = $2207;
            break;
        }
        return $2205;
    }
    const App$Kaelin$Effect$indicators$get_indicators = x0 => x1 => x2 => x3 => App$Kaelin$Effect$indicators$get_indicators$(x0, x1, x2, x3);
    function App$Kaelin$CastInfo$local$new$(_hero_pos$1, _skill$2, _range$3, _area$4, _mouse_pos$5) {
        var $2210 = {
            _: "App.Kaelin.CastInfo.local.new",
            hero_pos: _hero_pos$1,
            skill: _skill$2,
            range: _range$3,
            area: _area$4,
            mouse_pos: _mouse_pos$5
        };
        return $2210;
    }
    const App$Kaelin$CastInfo$local$new = x0 => x1 => x2 => x3 => x4 => App$Kaelin$CastInfo$local$new$(x0, x1, x2, x3, x4);
    function App$Kaelin$Action$local$area$(_time$1, _global$2, _local$3) {
        var self = _local$3;
        switch (self._) {
          case "App.Kaelin.State.local.new":
            var $2212 = self.cast_info;
            var $2213 = self.env_info;
            var self = $2213;
            switch (self._) {
              case "App.EnvInfo.new":
                var $2215 = self.mouse_pos;
                var self = $2212;
                switch (self._) {
                  case "Maybe.some":
                    var $2217 = self.value;
                    var _cast$13 = $2217;
                    var self = _cast$13;
                    switch (self._) {
                      case "App.Kaelin.CastInfo.local.new":
                        var $2219 = self.hero_pos;
                        var $2220 = self.skill;
                        var $2221 = self.mouse_pos;
                        var _mouse_coord$19 = App$Kaelin$Coord$to_axial$($2215);
                        var self = App$Kaelin$Coord$eql$(_mouse_coord$19, $2221);
                        if (self) {
                            var $2223 = _local$3;
                            var $2222 = $2223;
                        } else {
                            var _area$20 = App$Kaelin$Effect$indicators$get_indicators$($2219, $2220, _mouse_coord$19, (() => {
                                var self = _global$2;
                                switch (self._) {
                                  case "App.Kaelin.State.global.new":
                                    var $2225 = self.map;
                                    var $2226 = $2225;
                                    return $2226;
                                }
                            })());
                            var _new_cast_info$21 = Maybe$some$((() => {
                                var self = _cast$13;
                                switch (self._) {
                                  case "App.Kaelin.CastInfo.local.new":
                                    var $2227 = self.hero_pos;
                                    var $2228 = self.skill;
                                    var $2229 = self.range;
                                    var $2230 = self.mouse_pos;
                                    var $2231 = App$Kaelin$CastInfo$local$new$($2227, $2228, $2229, _area$20, $2230);
                                    return $2231;
                                }
                            })());
                            var self = _local$3;
                            switch (self._) {
                              case "App.Kaelin.State.local.new":
                                var $2232 = self.input;
                                var $2233 = self.user;
                                var $2234 = self.team;
                                var $2235 = self.env_info;
                                var $2236 = self.internal;
                                var $2237 = App$Kaelin$State$local$new$($2232, $2233, $2234, _new_cast_info$21, $2235, $2236);
                                var _new_local$22 = $2237;
                                break;
                            }
                            var $2224 = _new_local$22;
                            var $2222 = $2224;
                        }
                        ;
                        var $2218 = $2222;
                        break;
                    }
                    ;
                    var $2216 = $2218;
                    break;

                  case "Maybe.none":
                    var $2238 = _local$3;
                    var $2216 = $2238;
                    break;
                }
                ;
                var $2214 = $2216;
                break;
            }
            ;
            var $2211 = $2214;
            break;
        }
        return $2211;
    }
    const App$Kaelin$Action$local$area = x0 => x1 => x2 => App$Kaelin$Action$local$area$(x0, x1, x2);
    function App$Kaelin$Event$save_skill$(_player$1, _target_pos$2, _key$3, _team$4) {
        var $2239 = {
            _: "App.Kaelin.Event.save_skill",
            player: _player$1,
            target_pos: _target_pos$2,
            key: _key$3,
            team: _team$4
        };
        return $2239;
    }
    const App$Kaelin$Event$save_skill = x0 => x1 => x2 => x3 => App$Kaelin$Event$save_skill$(x0, x1, x2, x3);
    function App$Kaelin$Event$create_hero$(_hero_id$1) {
        var $2240 = {
            _: "App.Kaelin.Event.create_hero",
            hero_id: _hero_id$1
        };
        return $2240;
    }
    const App$Kaelin$Event$create_hero = x0 => App$Kaelin$Event$create_hero$(x0);
    const NatSet$new = NatMap$new;
    function NatSet$set$(_nat$1, _set$2) {
        var $2241 = NatMap$set$(_nat$1, Unit$new, _set$2);
        return $2241;
    }
    const NatSet$set = x0 => x1 => NatSet$set$(x0, x1);
    function NatSet$from_list$(_xs$1) {
        var self = _xs$1;
        switch (self._) {
          case "List.cons":
            var $2243 = self.head;
            var $2244 = self.tail;
            var $2245 = NatSet$set$($2243, NatSet$from_list$($2244));
            var $2242 = $2245;
            break;

          case "List.nil":
            var $2246 = NatSet$new;
            var $2242 = $2246;
            break;
        }
        return $2242;
    }
    const NatSet$from_list = x0 => NatSet$from_list$(x0);
    function App$Kaelin$Coord$range_natset$(_coord$1, _distance$2) {
        var _range$3 = App$Kaelin$Coord$range$(_coord$1, _distance$2);
        var _range$4 = List$map$(App$Kaelin$Coord$Convert$axial_to_nat, _range$3);
        var $2247 = NatSet$from_list$(_range$4);
        return $2247;
    }
    const App$Kaelin$Coord$range_natset = x0 => x1 => App$Kaelin$Coord$range_natset$(x0, x1);
    function App$Kaelin$CastInfo$start$(_player$1, _key_code$2, _target_pos$3, _global$4) {
        var self = _global$4;
        switch (self._) {
          case "App.Kaelin.State.global.new":
            var $2249 = self.map;
            var _result$11 = Maybe$monad$(_m$bind$11 => _m$pure$12 => {
                var $2251 = _m$bind$11;
                return $2251;
            })(App$Kaelin$Map$player$info$(_player$1, $2249))(_player_info$11 => {
                var self = _player_info$11;
                switch (self._) {
                  case "Pair.new":
                    var $2253 = self.fst;
                    var $2254 = $2253;
                    var _player_coord$12 = $2254;
                    break;
                }
                var self = _player_info$11;
                switch (self._) {
                  case "Pair.new":
                    var $2255 = self.snd;
                    var $2256 = $2255;
                    var _player_creature$13 = $2256;
                    break;
                }
                var $2252 = Maybe$monad$(_m$bind$14 => _m$pure$15 => {
                    var $2257 = _m$bind$14;
                    return $2257;
                })(App$Kaelin$Hero$skill$from_key$(_key_code$2, (() => {
                    var self = _player_creature$13;
                    switch (self._) {
                      case "App.Kaelin.Creature.new":
                        var $2258 = self.hero;
                        var $2259 = $2258;
                        return $2259;
                    }
                })()))(_skill$14 => {
                    var _range$15 = App$Kaelin$Coord$range_natset$(_player_coord$12, (() => {
                        var self = _skill$14;
                        switch (self._) {
                          case "App.Kaelin.Skill.new":
                            var $2261 = self.range;
                            var $2262 = $2261;
                            return $2262;
                        }
                    })());
                    var _area$16 = App$Kaelin$Effect$indicators$get_indicators$(_player_coord$12, _skill$14, _target_pos$3, $2249);
                    var _cast$17 = App$Kaelin$CastInfo$local$new$(_player_coord$12, _skill$14, _range$15, _area$16, _target_pos$3);
                    var $2260 = Maybe$monad$(_m$bind$18 => _m$pure$19 => {
                        var $2263 = _m$pure$19;
                        return $2263;
                    })(_cast$17);
                    return $2260;
                });
                return $2252;
            });
            var $2250 = _result$11;
            var $2248 = $2250;
            break;
        }
        return $2248;
    }
    const App$Kaelin$CastInfo$start = x0 => x1 => x2 => x3 => App$Kaelin$CastInfo$start$(x0, x1, x2, x3);
    function App$Kaelin$Action$local$set_cast$(_key_code$1, _local$2, _global$3) {
        var self = _local$2;
        switch (self._) {
          case "App.Kaelin.State.local.new":
            var $2265 = self.user;
            var $2266 = self.env_info;
            var _target_pos$10 = App$Kaelin$Coord$to_axial$((() => {
                var self = $2266;
                switch (self._) {
                  case "App.EnvInfo.new":
                    var $2268 = self.mouse_pos;
                    var $2269 = $2268;
                    return $2269;
                }
            })());
            var _cast$11 = App$Kaelin$CastInfo$start$($2265, _key_code$1, _target_pos$10, _global$3);
            var self = _local$2;
            switch (self._) {
              case "App.Kaelin.State.local.new":
                var $2270 = self.input;
                var $2271 = self.user;
                var $2272 = self.team;
                var $2273 = self.env_info;
                var $2274 = self.internal;
                var $2275 = App$Kaelin$State$local$new$($2270, $2271, $2272, _cast$11, $2273, $2274);
                var $2267 = $2275;
                break;
            }
            ;
            var $2264 = $2267;
            break;
        }
        return $2264;
    }
    const App$Kaelin$Action$local$set_cast = x0 => x1 => x2 => App$Kaelin$Action$local$set_cast$(x0, x1, x2);
    function App$Kaelin$App$when$(_event$1, _state$2) {
        var self = _state$2;
        switch (self._) {
          case "App.Store.new":
            var $2277 = self.local;
            var $2278 = self.global;
            var self = $2278;
            switch (self._) {
              case "App.Kaelin.State.global.new":
                var $2280 = self.room;
                var $2281 = self.stage;
                var self = $2277;
                switch (self._) {
                  case "App.Kaelin.State.local.new":
                    var $2283 = self.input;
                    var $2284 = self.user;
                    var $2285 = self.team;
                    var $2286 = self.cast_info;
                    var $2287 = self.env_info;
                    var self = $2281;
                    switch (self._) {
                      case "App.Kaelin.Stage.draft":
                        var $2289 = self.players;
                        var self = _event$1;
                        switch (self._) {
                          case "App.Event.frame":
                            var $2291 = self.time;
                            var $2292 = (console.log($2291 + "#64"), (_$21 => {
                                var $2293 = App$pass;
                                return $2293;
                            })());
                            var $2290 = $2292;
                            break;

                          case "App.Event.mouse_click":
                            var $2294 = self.id;
                            var $2295 = (console.log("user:" + $2284), (_$22 => {
                                var self = String$starts_with$($2294, "C");
                                if (self) {
                                    var $2297 = (console.log($2294), (_$23 => {
                                        var _coord_nat$24 = String$drop$(1n, $2294);
                                        var _coord$25 = App$Kaelin$Coord$Convert$nat_to_axial$(BigInt(_coord_nat$24));
                                        var $2298 = App$new_post$($2280, App$Kaelin$Event$serialize$(App$Kaelin$Event$draft_coord$(_coord$25)));
                                        return $2298;
                                    })());
                                    var $2296 = $2297;
                                } else {
                                    var self = String$starts_with$($2294, "H");
                                    if (self) {
                                        var _heroes_list$23 = List$map$(Pair$snd, Map$to_list$($2289));
                                        var _team$24 = Maybe$default$(App$Kaelin$Coord$draft$to_team$($2284, $2289), App$Kaelin$Team$neutral);
                                        var _heroes_map$25 = App$Kaelin$Hero$info$map;
                                        var _hero_name$26 = String$drop$(1n, $2294);
                                        var _hero_id$27 = Map$get$(_hero_name$26, _heroes_map$25);
                                        var _taken$28 = Bool$false;
                                        var _taken$29 = (() => {
                                            var $2302 = _taken$28;
                                            var $2303 = _heroes_list$23;
                                            let _taken$30 = $2302;
                                            let _player$29;
                                            while ($2303._ === "List.cons") {
                                                _player$29 = $2303.head;
                                                var self = _player$29;
                                                switch (self._) {
                                                  case "App.Kaelin.DraftInfo.new":
                                                    var $2304 = self.hero;
                                                    var $2305 = self.team;
                                                    var self = App$Kaelin$Team$eql$(_team$24, $2305);
                                                    if (self) {
                                                        var self = Maybe$default$($2304, 99) === Maybe$default$(_hero_id$27, 0);
                                                        if (self) {
                                                            var $2308 = Bool$true;
                                                            var $2307 = $2308;
                                                        } else {
                                                            var $2309 = _taken$30;
                                                            var $2307 = $2309;
                                                        }
                                                        var $2306 = $2307;
                                                    } else {
                                                        var $2310 = _taken$30;
                                                        var $2306 = $2310;
                                                    }
                                                    ;
                                                    var $2302 = $2306;
                                                    break;
                                                }
                                                _taken$30 = $2302;
                                                $2303 = $2303.tail;
                                            }
                                            return _taken$30;
                                        })();
                                        var self = _hero_id$27;
                                        switch (self._) {
                                          case "Maybe.some":
                                            var $2311 = self.value;
                                            var self = _taken$29;
                                            if (self) {
                                                var $2313 = App$pass;
                                                var $2312 = $2313;
                                            } else {
                                                var $2314 = App$new_post$($2280, App$Kaelin$Event$serialize$(App$Kaelin$Event$draft_hero$($2311)));
                                                var $2312 = $2314;
                                            }
                                            ;
                                            var $2300 = $2312;
                                            break;

                                          case "Maybe.none":
                                            var $2315 = App$pass;
                                            var $2300 = $2315;
                                            break;
                                        }
                                        var $2299 = $2300;
                                    } else {
                                        var self = String$starts_with$($2294, "R");
                                        if (self) {
                                            var $2317 = App$new_post$($2280, App$Kaelin$Event$serialize$(App$Kaelin$Event$draft_end));
                                            var $2316 = $2317;
                                        } else {
                                            var self = String$starts_with$($2294, "T");
                                            if (self) {
                                                var _player_count$23 = String$drop$(1n, $2294);
                                                var self = String$starts_with$(_player_count$23, "3");
                                                if (self) {
                                                    var $2320 = App$pass;
                                                    var $2319 = $2320;
                                                } else {
                                                    var _team$24 = String$drop$(1n, _player_count$23);
                                                    var self = _team$24 === "blue";
                                                    if (self) {
                                                        var $2322 = App$new_post$($2280, App$Kaelin$Event$serialize$(App$Kaelin$Event$draft_team$(0)));
                                                        var $2321 = $2322;
                                                    } else {
                                                        var self = _team$24 === "red";
                                                        if (self) {
                                                            var $2324 = App$new_post$($2280, App$Kaelin$Event$serialize$(App$Kaelin$Event$draft_team$(1)));
                                                            var $2323 = $2324;
                                                        } else {
                                                            var $2325 = App$pass;
                                                            var $2323 = $2325;
                                                        }
                                                        var $2321 = $2323;
                                                    }
                                                    var $2319 = $2321;
                                                }
                                                var $2318 = $2319;
                                            } else {
                                                var $2326 = App$pass;
                                                var $2318 = $2326;
                                            }
                                            var $2316 = $2318;
                                        }
                                        var $2299 = $2316;
                                    }
                                    var $2296 = $2299;
                                }
                                return $2296;
                            })());
                            var $2290 = $2295;
                            break;

                          case "App.Event.init":
                          case "App.Event.mouse_down":
                          case "App.Event.mouse_up":
                          case "App.Event.key_down":
                          case "App.Event.key_up":
                          case "App.Event.mouse_over":
                          case "App.Event.input":
                            var $2327 = App$pass;
                            var $2290 = $2327;
                            break;
                        }
                        ;
                        var $2288 = $2290;
                        break;

                      case "App.Kaelin.Stage.init":
                        var self = _event$1;
                        switch (self._) {
                          case "App.Event.init":
                            var $2329 = self.user;
                            var _user$20 = String$to_lower$($2329);
                            var self = $2277;
                            switch (self._) {
                              case "App.Kaelin.State.local.new":
                                var $2331 = self.input;
                                var $2332 = self.team;
                                var $2333 = self.cast_info;
                                var $2334 = self.env_info;
                                var $2335 = self.internal;
                                var $2336 = App$Kaelin$State$local$new$($2331, _user$20, $2332, $2333, $2334, $2335);
                                var _new_local$21 = $2336;
                                break;
                            }
                            ;
                            var $2330 = App$set_local$(_new_local$21);
                            var $2328 = $2330;
                            break;

                          case "App.Event.mouse_click":
                            var $2337 = self.id;
                            var self = $2337 === "random";
                            if (self) {
                                var $2339 = IO$monad$(_m$bind$20 => _m$pure$21 => {
                                    var $2340 = _m$bind$20;
                                    return $2340;
                                })(IO$random$(10000000000n))(_rnd$20 => {
                                    var _str$21 = Nat$show$(_rnd$20);
                                    var _room$22 = "0x72214422" + String$drop$(String$length$(_str$21) - 6n <= 0n ? 0n : String$length$(_str$21) - 6n, _str$21);
                                    var self = $2277;
                                    switch (self._) {
                                      case "App.Kaelin.State.local.new":
                                        var $2342 = self.user;
                                        var $2343 = self.team;
                                        var $2344 = self.cast_info;
                                        var $2345 = self.env_info;
                                        var $2346 = self.internal;
                                        var $2347 = App$Kaelin$State$local$new$(_room$22, $2342, $2343, $2344, $2345, $2346);
                                        var _new_local$23 = $2347;
                                        break;
                                    }
                                    var $2341 = App$set_local$(_new_local$23);
                                    return $2341;
                                });
                                var $2338 = $2339;
                            } else {
                                var self = $2337 === "ready";
                                if (self) {
                                    var $2349 = IO$monad$(_m$bind$20 => _m$pure$21 => {
                                        var $2350 = _m$bind$20;
                                        return $2350;
                                    })(App$watch$($2283))(_$20 => {
                                        var $2351 = App$new_post$($2283, App$Kaelin$Event$serialize$(App$Kaelin$Event$to_draft));
                                        return $2351;
                                    });
                                    var $2348 = $2349;
                                } else {
                                    var $2352 = App$pass;
                                    var $2348 = $2352;
                                }
                                var $2338 = $2348;
                            }
                            ;
                            var $2328 = $2338;
                            break;

                          case "App.Event.input":
                            var $2353 = self.text;
                            var $2354 = (console.log($2353), (_$20 => {
                                var self = $2277;
                                switch (self._) {
                                  case "App.Kaelin.State.local.new":
                                    var $2356 = self.user;
                                    var $2357 = self.team;
                                    var $2358 = self.cast_info;
                                    var $2359 = self.env_info;
                                    var $2360 = self.internal;
                                    var $2361 = App$Kaelin$State$local$new$($2353, $2356, $2357, $2358, $2359, $2360);
                                    var _new_local$21 = $2361;
                                    break;
                                }
                                var $2355 = App$set_local$(_new_local$21);
                                return $2355;
                            })());
                            var $2328 = $2354;
                            break;

                          case "App.Event.frame":
                          case "App.Event.mouse_down":
                          case "App.Event.mouse_up":
                          case "App.Event.key_down":
                          case "App.Event.key_up":
                          case "App.Event.mouse_over":
                            var $2362 = App$pass;
                            var $2328 = $2362;
                            break;
                        }
                        ;
                        var $2288 = $2328;
                        break;

                      case "App.Kaelin.Stage.planning":
                        var self = _event$1;
                        switch (self._) {
                          case "App.Event.frame":
                            var $2364 = self.time;
                            var $2365 = self.info;
                            var _new_local$21 = App$Kaelin$Action$local$env_info$($2364, $2365, $2277);
                            var _new_local$22 = App$Kaelin$Action$local$area$($2364, $2278, _new_local$21);
                            var $2366 = App$set_local$(_new_local$22);
                            var $2363 = $2366;
                            break;

                          case "App.Event.key_down":
                            var $2367 = self.code;
                            var self = $2367 === 49;
                            if (self) {
                                var $2369 = App$new_post$($2280, App$Kaelin$Event$serialize$(App$Kaelin$Event$create_hero$(0)));
                                var $2368 = $2369;
                            } else {
                                var $2370 = App$set_local$(App$Kaelin$Action$local$set_cast$($2367, $2277, $2278));
                                var $2368 = $2370;
                            }
                            ;
                            var $2363 = $2368;
                            break;

                          case "App.Event.mouse_click":
                            var $2371 = self.id;
                            var $2372 = App$new_post$($2280, $2371);
                            var $2363 = $2372;
                            break;

                          case "App.Event.init":
                          case "App.Event.mouse_down":
                          case "App.Event.key_up":
                          case "App.Event.mouse_over":
                          case "App.Event.input":
                            var $2373 = App$pass;
                            var $2363 = $2373;
                            break;

                          case "App.Event.mouse_up":
                            var self = $2286;
                            switch (self._) {
                              case "Maybe.some":
                                var $2375 = self.value;
                                var self = $2375;
                                switch (self._) {
                                  case "App.Kaelin.CastInfo.local.new":
                                    var $2377 = self.skill;
                                    var $2378 = self.mouse_pos;
                                    var self = $2377;
                                    switch (self._) {
                                      case "App.Kaelin.Skill.new":
                                        var $2380 = self.key;
                                        var _info$31 = $2287;
                                        var self = App$Kaelin$Coord$to_axial$((() => {
                                            var self = _info$31;
                                            switch (self._) {
                                              case "App.EnvInfo.new":
                                                var $2382 = self.mouse_pos;
                                                var $2383 = $2382;
                                                return $2383;
                                            }
                                        })());
                                        switch (self._) {
                                          case "App.Kaelin.Coord.new":
                                            var _hex$34 = App$Kaelin$Event$serialize$(App$Kaelin$Event$save_skill$($2284, $2378, $2380, $2285));
                                            var $2384 = IO$monad$(_m$bind$35 => _m$pure$36 => {
                                                var $2385 = _m$bind$35;
                                                return $2385;
                                            })(App$new_post$($2280, _hex$34))(_$35 => {
                                                var $2386 = App$set_local$((() => {
                                                    var self = $2277;
                                                    switch (self._) {
                                                      case "App.Kaelin.State.local.new":
                                                        var $2387 = self.input;
                                                        var $2388 = self.user;
                                                        var $2389 = self.team;
                                                        var $2390 = self.env_info;
                                                        var $2391 = self.internal;
                                                        var $2392 = App$Kaelin$State$local$new$($2387, $2388, $2389, Maybe$none, $2390, $2391);
                                                        return $2392;
                                                    }
                                                })());
                                                return $2386;
                                            });
                                            var $2381 = $2384;
                                            break;
                                        }
                                        ;
                                        var $2379 = $2381;
                                        break;
                                    }
                                    ;
                                    var $2376 = $2379;
                                    break;
                                }
                                ;
                                var $2374 = $2376;
                                break;

                              case "Maybe.none":
                                var $2393 = App$pass;
                                var $2374 = $2393;
                                break;
                            }
                            ;
                            var $2363 = $2374;
                            break;
                        }
                        ;
                        var $2288 = $2363;
                        break;

                      case "App.Kaelin.Stage.action":
                        var self = _event$1;
                        switch (self._) {
                          case "App.Event.init":
                          case "App.Event.frame":
                          case "App.Event.mouse_down":
                          case "App.Event.mouse_up":
                          case "App.Event.key_down":
                          case "App.Event.key_up":
                          case "App.Event.mouse_over":
                          case "App.Event.mouse_click":
                          case "App.Event.input":
                            var $2395 = App$pass;
                            var $2394 = $2395;
                            break;
                        }
                        ;
                        var $2288 = $2394;
                        break;
                    }
                    ;
                    var $2282 = $2288;
                    break;
                }
                ;
                var $2279 = $2282;
                break;
            }
            ;
            var $2276 = $2279;
            break;
        }
        return $2276;
    }
    const App$Kaelin$App$when = x0 => x1 => App$Kaelin$App$when$(x0, x1);
    const U64$add = a0 => a1 => a0 + a1 & 0xffffffffffffffffn;
    const U64$sub = a0 => a1 => a0 - a1 & 0xffffffffffffffffn;
    const Nat$to_u64 = a0 => a0 & 0xffffffffffffffffn;
    const U64$div = a0 => a1 => a0 / a1 & 0xffffffffffffffffn;
    const U64$mul = a0 => a1 => a0 * a1 & 0xffffffffffffffffn;
    const U64$gte = a0 => a1 => a0 >= a1;
    const App$Kaelin$Stage$action = {
        _: "App.Kaelin.Stage.action"
    };
    function App$Kaelin$Stage$planning$(_local_tick$1, _seconds$2) {
        var $2396 = {
            _: "App.Kaelin.Stage.planning",
            local_tick: _local_tick$1,
            seconds: _seconds$2
        };
        return $2396;
    }
    const App$Kaelin$Stage$planning = x0 => x1 => App$Kaelin$Stage$planning$(x0, x1);
    function App$Kaelin$Action$global$exe_skill$(_player$1, _mouse_pos$2, _key$3, _global$4) {
        var self = _global$4;
        switch (self._) {
          case "App.Kaelin.State.global.new":
            var $2398 = self.map;
            var $2399 = (console.log("aqui"), (_$11 => {
                var _result$12 = Maybe$monad$(_m$bind$12 => _m$pure$13 => {
                    var $2401 = _m$bind$12;
                    return $2401;
                })(App$Kaelin$Map$player$info$(_player$1, (() => {
                    var self = _global$4;
                    switch (self._) {
                      case "App.Kaelin.State.global.new":
                        var $2402 = self.map;
                        var $2403 = $2402;
                        return $2403;
                    }
                })()))(_info$12 => {
                    var self = _info$12;
                    switch (self._) {
                      case "Pair.new":
                        var $2405 = self.snd;
                        var $2406 = $2405;
                        var _creature$13 = $2406;
                        break;
                    }
                    var self = _info$12;
                    switch (self._) {
                      case "Pair.new":
                        var $2407 = self.fst;
                        var $2408 = $2407;
                        var _hero_pos$14 = $2408;
                        break;
                    }
                    var self = _creature$13;
                    switch (self._) {
                      case "App.Kaelin.Creature.new":
                        var $2409 = self.hero;
                        var $2410 = $2409;
                        var _hero$15 = $2410;
                        break;
                    }
                    var $2404 = Maybe$monad$(_m$bind$16 => _m$pure$17 => {
                        var $2411 = _m$bind$16;
                        return $2411;
                    })(List$find$(_x$16 => {
                        var $2412 = (() => {
                            var self = _x$16;
                            switch (self._) {
                              case "App.Kaelin.Skill.new":
                                var $2413 = self.key;
                                var $2414 = $2413;
                                return $2414;
                            }
                        })() === _key$3;
                        return $2412;
                    }, (() => {
                        var self = _hero$15;
                        switch (self._) {
                          case "App.Kaelin.Hero.new":
                            var $2415 = self.skills;
                            var $2416 = $2415;
                            return $2416;
                        }
                    })()))(_skill$16 => {
                        var self = _skill$16;
                        switch (self._) {
                          case "App.Kaelin.Skill.new":
                            var $2418 = self.effect;
                            var $2419 = $2418;
                            var _effect$17 = $2419;
                            break;
                        }
                        var _effect$17 = _effect$17(_hero_pos$14)(_mouse_pos$2)($2398);
                        var _mouse_nat$18 = App$Kaelin$Coord$Convert$axial_to_nat$(_mouse_pos$2);
                        var _skill_range$19 = App$Kaelin$Coord$range_natset$(_hero_pos$14, (() => {
                            var self = _skill$16;
                            switch (self._) {
                              case "App.Kaelin.Skill.new":
                                var $2420 = self.range;
                                var $2421 = $2420;
                                return $2421;
                            }
                        })());
                        var self = NatSet$has$(_mouse_nat$18, _skill_range$19);
                        if (self) {
                            var self = _global$4;
                            switch (self._) {
                              case "App.Kaelin.State.global.new":
                                var $2423 = self.round;
                                var $2424 = self.tick;
                                var $2425 = self.room;
                                var $2426 = self.stage;
                                var $2427 = self.skills_list;
                                var $2428 = App$Kaelin$State$global$new$($2423, $2424, $2425, (() => {
                                    var self = _effect$17;
                                    switch (self._) {
                                      case "App.Kaelin.Effect.Result.new":
                                        var $2429 = self.map;
                                        var $2430 = $2429;
                                        return $2430;
                                    }
                                })(), $2426, $2427);
                                var $2422 = $2428;
                                break;
                            }
                            var _global$20 = $2422;
                        } else {
                            var $2431 = _global$4;
                            var _global$20 = $2431;
                        }
                        var $2417 = Maybe$monad$(_m$bind$21 => _m$pure$22 => {
                            var $2432 = _m$pure$22;
                            return $2432;
                        })(_global$20);
                        return $2417;
                    });
                    return $2404;
                });
                var $2400 = Maybe$default$(_result$12, _global$4);
                return $2400;
            })());
            var $2397 = $2399;
            break;
        }
        return $2397;
    }
    const App$Kaelin$Action$global$exe_skill = x0 => x1 => x2 => x3 => App$Kaelin$Action$global$exe_skill$(x0, x1, x2, x3);
    function App$Kaelin$Action$global$exe_skills_list$(_skills$2, _glob$3) {
        var App$Kaelin$Action$global$exe_skills_list$ = (_skills$2, _glob$3) => ({
            ctr: "TCO",
            arg: [ _skills$2, _glob$3 ]
        });
        var App$Kaelin$Action$global$exe_skills_list = _skills$2 => _glob$3 => App$Kaelin$Action$global$exe_skills_list$(_skills$2, _glob$3);
        var arg = [ _skills$2, _glob$3 ];
        while (true) {
            let [ _skills$2, _glob$3 ] = arg;
            var R = (() => {
                var self = _skills$2;
                switch (self._) {
                  case "List.cons":
                    var $2433 = self.head;
                    var $2434 = self.tail;
                    var _new_glob$6 = App$Kaelin$Action$global$exe_skill$((() => {
                        var self = $2433;
                        switch (self._) {
                          case "App.Kaelin.CastInfo.global.new":
                            var $2436 = self.player;
                            var $2437 = $2436;
                            return $2437;
                        }
                    })(), (() => {
                        var self = $2433;
                        switch (self._) {
                          case "App.Kaelin.CastInfo.global.new":
                            var $2438 = self.target_pos;
                            var $2439 = $2438;
                            return $2439;
                        }
                    })(), (() => {
                        var self = $2433;
                        switch (self._) {
                          case "App.Kaelin.CastInfo.global.new":
                            var $2440 = self.key;
                            var $2441 = $2440;
                            return $2441;
                        }
                    })(), _glob$3);
                    var $2435 = App$Kaelin$Action$global$exe_skills_list$($2434, _new_glob$6);
                    return $2435;

                  case "List.nil":
                    var $2442 = _glob$3;
                    return $2442;
                }
            })();
            if (R.ctr === "TCO") arg = R.arg; else return R;
        }
    }
    const App$Kaelin$Action$global$exe_skills_list = x0 => x1 => App$Kaelin$Action$global$exe_skills_list$(x0, x1);
    function App$Kaelin$Tile$creature$restore_ap$(_creature$1) {
        var self = _creature$1;
        switch (self._) {
          case "App.Kaelin.Creature.new":
            var $2444 = self.hp;
            var self = _creature$1;
            switch (self._) {
              case "App.Kaelin.Creature.new":
                var $2446 = self.hero;
                var $2447 = $2446;
                var _hero$8 = $2447;
                break;
            }
            ;
            var self = $2444 <= 0;
            if (self) {
                var $2448 = _creature$1;
                var $2445 = $2448;
            } else {
                var $2449 = (console.log(I32$show$((() => {
                    var self = _hero$8;
                    switch (self._) {
                      case "App.Kaelin.Hero.new":
                        var $2450 = self.max_ap;
                        var $2451 = $2450;
                        return $2451;
                    }
                })())), (_$9 => {
                    var self = _creature$1;
                    switch (self._) {
                      case "App.Kaelin.Creature.new":
                        var $2453 = self.player;
                        var $2454 = self.hero;
                        var $2455 = self.team;
                        var $2456 = self.hp;
                        var $2457 = self.status;
                        var $2458 = App$Kaelin$Creature$new$($2453, $2454, $2455, $2456, (() => {
                            var self = _hero$8;
                            switch (self._) {
                              case "App.Kaelin.Hero.new":
                                var $2459 = self.max_ap;
                                var $2460 = $2459;
                                return $2460;
                            }
                        })(), $2457);
                        var $2452 = $2458;
                        break;
                    }
                    return $2452;
                })());
                var $2445 = $2449;
            }
            ;
            var $2443 = $2445;
            break;
        }
        return $2443;
    }
    const App$Kaelin$Tile$creature$restore_ap = x0 => App$Kaelin$Tile$creature$restore_ap$(x0);
    function App$Kaelin$Map$creature$restore_all_ap$(_map$1) {
        var _map$2 = NatMap$to_list$(_map$1);
        var _new_map$3 = Map$from_list$(List$nil);
        var _new_map$4 = (() => {
            var $2463 = _new_map$3;
            var $2464 = _map$2;
            let _new_map$5 = $2463;
            let _pos$4;
            while ($2464._ === "List.cons") {
                _pos$4 = $2464.head;
                var self = _pos$4;
                switch (self._) {
                  case "Pair.new":
                    var $2465 = self.snd;
                    var $2466 = $2465;
                    var _tile$6 = $2466;
                    break;
                }
                var self = _pos$4;
                switch (self._) {
                  case "Pair.new":
                    var $2467 = self.fst;
                    var $2468 = $2467;
                    var _coord$7 = $2468;
                    break;
                }
                var self = _tile$6;
                switch (self._) {
                  case "App.Kaelin.Tile.new":
                    var $2469 = self.creature;
                    var $2470 = $2469;
                    var _creature$8 = $2470;
                    break;
                }
                var self = _creature$8;
                switch (self._) {
                  case "Maybe.some":
                    var $2471 = self.value;
                    var self = _tile$6;
                    switch (self._) {
                      case "App.Kaelin.Tile.new":
                        var $2473 = self.background;
                        var $2474 = self.animation;
                        var $2475 = App$Kaelin$Tile$new$($2473, Maybe$some$(App$Kaelin$Tile$creature$restore_ap$($2471)), $2474);
                        var $2472 = $2475;
                        break;
                    }
                    ;
                    var _new_tile$9 = $2472;
                    break;

                  case "Maybe.none":
                    var $2476 = _tile$6;
                    var _new_tile$9 = $2476;
                    break;
                }
                var $2463 = NatMap$set$(_coord$7, _new_tile$9, _new_map$5);
                _new_map$5 = $2463;
                $2464 = $2464.tail;
            }
            return _new_map$5;
        })();
        var $2461 = _new_map$4;
        return $2461;
    }
    const App$Kaelin$Map$creature$restore_all_ap = x0 => App$Kaelin$Map$creature$restore_all_ap$(x0);
    function App$Kaelin$Stage$action$end$(_glob$1) {
        var self = _glob$1;
        switch (self._) {
          case "App.Kaelin.State.global.new":
            var $2478 = self.stage;
            var self = $2478;
            switch (self._) {
              case "App.Kaelin.Stage.init":
              case "App.Kaelin.Stage.draft":
              case "App.Kaelin.Stage.planning":
                var $2480 = _glob$1;
                var $2479 = $2480;
                break;

              case "App.Kaelin.Stage.action":
                var self = _glob$1;
                switch (self._) {
                  case "App.Kaelin.State.global.new":
                    var $2482 = self.round;
                    var $2483 = self.tick;
                    var $2484 = self.room;
                    var $2485 = self.map;
                    var $2486 = self.skills_list;
                    var $2487 = App$Kaelin$State$global$new$($2482, $2483, $2484, $2485, App$Kaelin$Stage$planning$(0n, 0n), $2486);
                    var _new_glob$8 = $2487;
                    break;
                }
                ;
                var self = _new_glob$8;
                switch (self._) {
                  case "App.Kaelin.State.global.new":
                    var $2488 = self.tick;
                    var $2489 = self.room;
                    var $2490 = self.map;
                    var $2491 = self.stage;
                    var $2492 = self.skills_list;
                    var $2493 = App$Kaelin$State$global$new$((() => {
                        var self = _new_glob$8;
                        switch (self._) {
                          case "App.Kaelin.State.global.new":
                            var $2494 = self.round;
                            var $2495 = $2494;
                            return $2495;
                        }
                    })() + 1 >> 0, $2488, $2489, $2490, $2491, $2492);
                    var _new_glob$9 = $2493;
                    break;
                }
                ;
                var self = _new_glob$9;
                switch (self._) {
                  case "App.Kaelin.State.global.new":
                    var $2496 = self.round;
                    var $2497 = self.tick;
                    var $2498 = self.room;
                    var $2499 = self.map;
                    var $2500 = self.stage;
                    var $2501 = App$Kaelin$State$global$new$($2496, $2497, $2498, $2499, $2500, List$nil);
                    var _new_glob$10 = $2501;
                    break;
                }
                ;
                var self = _new_glob$10;
                switch (self._) {
                  case "App.Kaelin.State.global.new":
                    var $2502 = self.round;
                    var $2503 = self.tick;
                    var $2504 = self.room;
                    var $2505 = self.stage;
                    var $2506 = self.skills_list;
                    var $2507 = App$Kaelin$State$global$new$($2502, $2503, $2504, App$Kaelin$Map$creature$restore_all_ap$((() => {
                        var self = _new_glob$10;
                        switch (self._) {
                          case "App.Kaelin.State.global.new":
                            var $2508 = self.map;
                            var $2509 = $2508;
                            return $2509;
                        }
                    })()), $2505, $2506);
                    var _new_glob$11 = $2507;
                    break;
                }
                ;
                var $2481 = _new_glob$11;
                var $2479 = $2481;
                break;
            }
            ;
            var $2477 = $2479;
            break;
        }
        return $2477;
    }
    const App$Kaelin$Stage$action$end = x0 => App$Kaelin$Stage$action$end$(x0);
    function App$Kaelin$App$tick$(_tick$1, _glob$2) {
        var self = _glob$2;
        switch (self._) {
          case "App.Kaelin.State.global.new":
            var $2511 = self.round;
            var $2512 = self.room;
            var $2513 = self.map;
            var $2514 = self.stage;
            var $2515 = self.skills_list;
            var $2516 = App$Kaelin$State$global$new$($2511, (() => {
                var self = _glob$2;
                switch (self._) {
                  case "App.Kaelin.State.global.new":
                    var $2517 = self.tick;
                    var $2518 = $2517;
                    return $2518;
                }
            })() + 1n & 0xffffffffffffffffn, $2512, $2513, $2514, $2515);
            var _glob$3 = $2516;
            break;
        }
        var self = _glob$3;
        switch (self._) {
          case "App.Kaelin.State.global.new":
            var $2519 = self.stage;
            var $2520 = $2519;
            var _stage$4 = $2520;
            break;
        }
        var self = _stage$4;
        switch (self._) {
          case "App.Kaelin.Stage.planning":
            var $2521 = self.local_tick;
            var _stage_seconds$7 = (5n - ($2521 / 16n & 0xffffffffffffffffn) & 0xffffffffffffffffn) - 1n & 0xffffffffffffffffn;
            var _ticks_per_round$8 = 5n * 16n & 0xffffffffffffffffn;
            var self = $2521 >= _ticks_per_round$8;
            if (self) {
                var self = _glob$3;
                switch (self._) {
                  case "App.Kaelin.State.global.new":
                    var $2524 = self.round;
                    var $2525 = self.tick;
                    var $2526 = self.room;
                    var $2527 = self.map;
                    var $2528 = self.stage;
                    var $2529 = App$Kaelin$State$global$new$($2524, $2525, $2526, $2527, $2528, List$reverse$((() => {
                        var self = _glob$3;
                        switch (self._) {
                          case "App.Kaelin.State.global.new":
                            var $2530 = self.skills_list;
                            var $2531 = $2530;
                            return $2531;
                        }
                    })()));
                    var _new_glob$9 = $2529;
                    break;
                }
                var self = _new_glob$9;
                switch (self._) {
                  case "App.Kaelin.State.global.new":
                    var $2532 = self.round;
                    var $2533 = self.tick;
                    var $2534 = self.room;
                    var $2535 = self.map;
                    var $2536 = self.skills_list;
                    var $2537 = App$Kaelin$State$global$new$($2532, $2533, $2534, $2535, App$Kaelin$Stage$action, $2536);
                    var _new_glob$10 = $2537;
                    break;
                }
                var $2523 = _new_glob$10;
                var $2522 = $2523;
            } else {
                var self = _glob$3;
                switch (self._) {
                  case "App.Kaelin.State.global.new":
                    var $2539 = self.round;
                    var $2540 = self.tick;
                    var $2541 = self.room;
                    var $2542 = self.map;
                    var $2543 = self.skills_list;
                    var $2544 = App$Kaelin$State$global$new$($2539, $2540, $2541, $2542, App$Kaelin$Stage$planning$($2521 + 1n & 0xffffffffffffffffn, _stage_seconds$7), $2543);
                    var $2538 = $2544;
                    break;
                }
                var $2522 = $2538;
            }
            ;
            var $2510 = $2522;
            break;

          case "App.Kaelin.Stage.init":
          case "App.Kaelin.Stage.draft":
            var $2545 = _glob$3;
            var $2510 = $2545;
            break;

          case "App.Kaelin.Stage.action":
            var _glob$5 = App$Kaelin$Action$global$exe_skills_list$((() => {
                var self = _glob$3;
                switch (self._) {
                  case "App.Kaelin.State.global.new":
                    var $2547 = self.skills_list;
                    var $2548 = $2547;
                    return $2548;
                }
            })(), _glob$3);
            var $2546 = App$Kaelin$Stage$action$end$(_glob$5);
            var $2510 = $2546;
            break;
        }
        return $2510;
    }
    const App$Kaelin$App$tick = x0 => x1 => App$Kaelin$App$tick$(x0, x1);
    function App$Kaelin$Event$Buffer$monad$run$(_A$1, _buffer$2, _str$3) {
        var $2549 = Parser$run$(_pst$4 => {
            var self = _pst$4;
            switch (self._) {
              case "Parser.State.new":
                var $2551 = self.err;
                var _reply$10 = _buffer$2(List$nil)(_pst$4);
                var self = _reply$10;
                switch (self._) {
                  case "Parser.Reply.error":
                    var $2553 = self.err;
                    var self = $2551;
                    switch (self._) {
                      case "Maybe.some":
                        var $2555 = self.value;
                        var $2556 = Parser$Reply$error$(Parser$Error$combine$($2555, $2553));
                        var $2554 = $2556;
                        break;

                      case "Maybe.none":
                        var $2557 = Parser$Reply$error$($2553);
                        var $2554 = $2557;
                        break;
                    }
                    ;
                    var $2552 = $2554;
                    break;

                  case "Parser.Reply.value":
                    var $2558 = self.pst;
                    var $2559 = self.val;
                    var self = $2558;
                    switch (self._) {
                      case "Parser.State.new":
                        var $2561 = self.err;
                        var $2562 = self.nam;
                        var $2563 = self.ini;
                        var $2564 = self.idx;
                        var $2565 = self.str;
                        var _reply$pst$18 = Parser$State$new$(Parser$Error$maybe_combine$($2551, $2561), $2562, $2563, $2564, $2565);
                        var $2566 = Parser$Reply$value$(_reply$pst$18, Pair$snd$($2559));
                        var $2560 = $2566;
                        break;
                    }
                    ;
                    var $2552 = $2560;
                    break;
                }
                ;
                var $2550 = $2552;
                break;
            }
            return $2550;
        }, _str$3);
        return $2549;
    }
    const App$Kaelin$Event$Buffer$monad$run = x0 => x1 => x2 => App$Kaelin$Event$Buffer$monad$run$(x0, x1, x2);
    function Parser$fail$(_error$2, _pst$3) {
        var self = _pst$3;
        switch (self._) {
          case "Parser.State.new":
            var $2568 = self.nam;
            var $2569 = self.ini;
            var $2570 = self.idx;
            var $2571 = Parser$Reply$fail$($2568, $2569, $2570, _error$2);
            var $2567 = $2571;
            break;
        }
        return $2567;
    }
    const Parser$fail = x0 => x1 => Parser$fail$(x0, x1);
    function Parser$one$(_pst$1) {
        var self = _pst$1;
        switch (self._) {
          case "Parser.State.new":
            var $2573 = self.err;
            var $2574 = self.nam;
            var $2575 = self.ini;
            var $2576 = self.idx;
            var $2577 = self.str;
            var self = $2577;
            if (self.length === 0) {
                var $2579 = Parser$Reply$fail$($2574, $2575, $2576, "Unexpected end of file.");
                var $2578 = $2579;
            } else {
                var $2580 = self.charCodeAt(0);
                var $2581 = self.slice(1);
                var _pst$9 = Parser$State$new$($2573, $2574, $2575, Nat$succ$($2576), $2581);
                var $2582 = Parser$Reply$value$(_pst$9, $2580);
                var $2578 = $2582;
            }
            ;
            var $2572 = $2578;
            break;
        }
        return $2572;
    }
    const Parser$one = x0 => Parser$one$(x0);
    function Char$to_string$(_chr$1) {
        var $2583 = String$cons$(_chr$1, String$nil);
        return $2583;
    }
    const Char$to_string = x0 => Char$to_string$(x0);
    function Parser$drop$go$(_x$1, _p$2) {
        var Parser$drop$go$ = (_x$1, _p$2) => ({
            ctr: "TCO",
            arg: [ _x$1, _p$2 ]
        });
        var Parser$drop$go = _x$1 => _p$2 => Parser$drop$go$(_x$1, _p$2);
        var arg = [ _x$1, _p$2 ];
        while (true) {
            let [ _x$1, _p$2 ] = arg;
            var R = (() => {
                var self = _x$1;
                if (self === 0n) {
                    var $2584 = _p$2;
                    return $2584;
                } else {
                    var $2585 = self - 1n;
                    var $2586 = Parser$drop$go$($2585, _pst$4 => {
                        var self = _pst$4;
                        switch (self._) {
                          case "Parser.State.new":
                            var $2588 = self.err;
                            var _reply$10 = Parser$one$(_pst$4);
                            var self = _reply$10;
                            switch (self._) {
                              case "Parser.Reply.error":
                                var $2590 = self.err;
                                var self = $2588;
                                switch (self._) {
                                  case "Maybe.some":
                                    var $2592 = self.value;
                                    var $2593 = Parser$Reply$error$(Parser$Error$combine$($2592, $2590));
                                    var $2591 = $2593;
                                    break;

                                  case "Maybe.none":
                                    var $2594 = Parser$Reply$error$($2590);
                                    var $2591 = $2594;
                                    break;
                                }
                                ;
                                var $2589 = $2591;
                                break;

                              case "Parser.Reply.value":
                                var $2595 = self.pst;
                                var $2596 = self.val;
                                var self = $2595;
                                switch (self._) {
                                  case "Parser.State.new":
                                    var $2598 = self.err;
                                    var $2599 = self.nam;
                                    var $2600 = self.ini;
                                    var $2601 = self.idx;
                                    var $2602 = self.str;
                                    var _reply$pst$18 = Parser$State$new$(Parser$Error$maybe_combine$($2588, $2598), $2599, $2600, $2601, $2602);
                                    var self = _reply$pst$18;
                                    switch (self._) {
                                      case "Parser.State.new":
                                        var $2604 = self.err;
                                        var _reply$24 = _p$2(_reply$pst$18);
                                        var self = _reply$24;
                                        switch (self._) {
                                          case "Parser.Reply.error":
                                            var $2606 = self.err;
                                            var self = $2604;
                                            switch (self._) {
                                              case "Maybe.some":
                                                var $2608 = self.value;
                                                var $2609 = Parser$Reply$error$(Parser$Error$combine$($2608, $2606));
                                                var $2607 = $2609;
                                                break;

                                              case "Maybe.none":
                                                var $2610 = Parser$Reply$error$($2606);
                                                var $2607 = $2610;
                                                break;
                                            }
                                            ;
                                            var $2605 = $2607;
                                            break;

                                          case "Parser.Reply.value":
                                            var $2611 = self.pst;
                                            var $2612 = self.val;
                                            var self = $2611;
                                            switch (self._) {
                                              case "Parser.State.new":
                                                var $2614 = self.err;
                                                var $2615 = self.nam;
                                                var $2616 = self.ini;
                                                var $2617 = self.idx;
                                                var $2618 = self.str;
                                                var _reply$pst$32 = Parser$State$new$(Parser$Error$maybe_combine$($2604, $2614), $2615, $2616, $2617, $2618);
                                                var $2619 = Parser$Reply$value$(_reply$pst$32, Char$to_string$($2596) + $2612);
                                                var $2613 = $2619;
                                                break;
                                            }
                                            ;
                                            var $2605 = $2613;
                                            break;
                                        }
                                        ;
                                        var $2603 = $2605;
                                        break;
                                    }
                                    ;
                                    var $2597 = $2603;
                                    break;
                                }
                                ;
                                var $2589 = $2597;
                                break;
                            }
                            ;
                            var $2587 = $2589;
                            break;
                        }
                        return $2587;
                    });
                    return $2586;
                }
            })();
            if (R.ctr === "TCO") arg = R.arg; else return R;
        }
    }
    const Parser$drop$go = x0 => x1 => Parser$drop$go$(x0, x1);
    function Parser$ignore$(_x$1) {
        var $2620 = Parser$drop$go$(_x$1, _pst$2 => {
            var $2621 = Parser$Reply$value$(_pst$2, "");
            return $2621;
        });
        return $2620;
    }
    const Parser$ignore = x0 => Parser$ignore$(x0);
    function App$Kaelin$Event$Buffer$monad$pure$(_x$2, _ls$3, _pst$4) {
        var $2622 = Parser$Reply$value$(_pst$4, Pair$new$(_ls$3, _x$2));
        return $2622;
    }
    const App$Kaelin$Event$Buffer$monad$pure = x0 => x1 => x2 => App$Kaelin$Event$Buffer$monad$pure$(x0, x1, x2);
    function App$Kaelin$Event$Buffer$hex$(_A$1, _f$2, _ls$3) {
        var self = _ls$3;
        switch (self._) {
          case "List.cons":
            var $2624 = self.head;
            var $2625 = self.tail;
            var $2626 = _pst$6 => {
                var self = _pst$6;
                switch (self._) {
                  case "Parser.State.new":
                    var $2628 = self.err;
                    var _reply$12 = Parser$ignore$(BigInt($2624))(_pst$6);
                    var self = _reply$12;
                    switch (self._) {
                      case "Parser.Reply.error":
                        var $2630 = self.err;
                        var self = $2628;
                        switch (self._) {
                          case "Maybe.some":
                            var $2632 = self.value;
                            var $2633 = Parser$Reply$error$(Parser$Error$combine$($2632, $2630));
                            var $2631 = $2633;
                            break;

                          case "Maybe.none":
                            var $2634 = Parser$Reply$error$($2630);
                            var $2631 = $2634;
                            break;
                        }
                        ;
                        var $2629 = $2631;
                        break;

                      case "Parser.Reply.value":
                        var $2635 = self.pst;
                        var $2636 = self.val;
                        var self = $2635;
                        switch (self._) {
                          case "Parser.State.new":
                            var $2638 = self.err;
                            var $2639 = self.nam;
                            var $2640 = self.ini;
                            var $2641 = self.idx;
                            var $2642 = self.str;
                            var _reply$pst$20 = Parser$State$new$(Parser$Error$maybe_combine$($2628, $2638), $2639, $2640, $2641, $2642);
                            var $2643 = App$Kaelin$Event$Buffer$monad$pure$(_f$2($2636), $2625, _reply$pst$20);
                            var $2637 = $2643;
                            break;
                        }
                        ;
                        var $2629 = $2637;
                        break;
                    }
                    ;
                    var $2627 = $2629;
                    break;
                }
                return $2627;
            };
            var $2623 = $2626;
            break;

          case "List.nil":
            var $2644 = Parser$fail("The buffer is empty");
            var $2623 = $2644;
            break;
        }
        return $2623;
    }
    const App$Kaelin$Event$Buffer$hex = x0 => x1 => x2 => App$Kaelin$Event$Buffer$hex$(x0, x1, x2);
    const App$Kaelin$Event$Buffer$next = App$Kaelin$Event$Buffer$hex(null)(App$Kaelin$Event$Code$Hex$to_nat);
    function App$Kaelin$Event$Buffer$push$(_list$1, _ls$2, _pst$3) {
        var $2645 = Parser$Reply$value$(_pst$3, Pair$new$(List$concat$(_ls$2, _list$1), Unit$new));
        return $2645;
    }
    const App$Kaelin$Event$Buffer$push = x0 => x1 => x2 => App$Kaelin$Event$Buffer$push$(x0, x1, x2);
    function App$Kaelin$Event$Buffer$fail$(_ls$2) {
        var $2646 = Parser$fail("Falhou");
        return $2646;
    }
    const App$Kaelin$Event$Buffer$fail = x0 => App$Kaelin$Event$Buffer$fail$(x0);
    function App$Kaelin$Event$Buffer$monad$bind$(_x$3, _f$4, _ls$5, _pst$6) {
        var self = _pst$6;
        switch (self._) {
          case "Parser.State.new":
            var $2648 = self.err;
            var _reply$12 = _x$3(_ls$5)(_pst$6);
            var self = _reply$12;
            switch (self._) {
              case "Parser.Reply.error":
                var $2650 = self.err;
                var self = $2648;
                switch (self._) {
                  case "Maybe.some":
                    var $2652 = self.value;
                    var $2653 = Parser$Reply$error$(Parser$Error$combine$($2652, $2650));
                    var $2651 = $2653;
                    break;

                  case "Maybe.none":
                    var $2654 = Parser$Reply$error$($2650);
                    var $2651 = $2654;
                    break;
                }
                ;
                var $2649 = $2651;
                break;

              case "Parser.Reply.value":
                var $2655 = self.pst;
                var $2656 = self.val;
                var self = $2655;
                switch (self._) {
                  case "Parser.State.new":
                    var $2658 = self.err;
                    var $2659 = self.nam;
                    var $2660 = self.ini;
                    var $2661 = self.idx;
                    var $2662 = self.str;
                    var _reply$pst$20 = Parser$State$new$(Parser$Error$maybe_combine$($2648, $2658), $2659, $2660, $2661, $2662);
                    var self = _reply$pst$20;
                    switch (self._) {
                      case "Parser.State.new":
                        var $2664 = self.err;
                        var _reply$26 = _f$4(Pair$snd$($2656))(Pair$fst$($2656))(_reply$pst$20);
                        var self = _reply$26;
                        switch (self._) {
                          case "Parser.Reply.error":
                            var $2666 = self.err;
                            var self = $2664;
                            switch (self._) {
                              case "Maybe.some":
                                var $2668 = self.value;
                                var $2669 = Parser$Reply$error$(Parser$Error$combine$($2668, $2666));
                                var $2667 = $2669;
                                break;

                              case "Maybe.none":
                                var $2670 = Parser$Reply$error$($2666);
                                var $2667 = $2670;
                                break;
                            }
                            ;
                            var $2665 = $2667;
                            break;

                          case "Parser.Reply.value":
                            var $2671 = self.pst;
                            var $2672 = self.val;
                            var self = $2671;
                            switch (self._) {
                              case "Parser.State.new":
                                var $2674 = self.err;
                                var $2675 = self.nam;
                                var $2676 = self.ini;
                                var $2677 = self.idx;
                                var $2678 = self.str;
                                var _reply$pst$34 = Parser$State$new$(Parser$Error$maybe_combine$($2664, $2674), $2675, $2676, $2677, $2678);
                                var $2679 = Parser$Reply$value$(_reply$pst$34, Pair$new$(List$concat$(_ls$5, Pair$fst$($2672)), Pair$snd$($2672)));
                                var $2673 = $2679;
                                break;
                            }
                            ;
                            var $2665 = $2673;
                            break;
                        }
                        ;
                        var $2663 = $2665;
                        break;
                    }
                    ;
                    var $2657 = $2663;
                    break;
                }
                ;
                var $2649 = $2657;
                break;
            }
            ;
            var $2647 = $2649;
            break;
        }
        return $2647;
    }
    const App$Kaelin$Event$Buffer$monad$bind = x0 => x1 => x2 => x3 => App$Kaelin$Event$Buffer$monad$bind$(x0, x1, x2, x3);
    function App$Kaelin$Event$Buffer$monad$(_new$2) {
        var $2680 = _new$2(App$Kaelin$Event$Buffer$monad$bind)(App$Kaelin$Event$Buffer$monad$pure);
        return $2680;
    }
    const App$Kaelin$Event$Buffer$monad = x0 => App$Kaelin$Event$Buffer$monad$(x0);
    function App$Kaelin$Event$Buffer$(_A$1) {
        var $2681 = null;
        return $2681;
    }
    const App$Kaelin$Event$Buffer = x0 => App$Kaelin$Event$Buffer$(x0);
    const App$Kaelin$Action$walk = {
        _: "App.Kaelin.Action.walk"
    };
    const App$Kaelin$Action$ability_0 = {
        _: "App.Kaelin.Action.ability_0"
    };
    const App$Kaelin$Action$ability_1 = {
        _: "App.Kaelin.Action.ability_1"
    };
    const App$Kaelin$Resources$Action$to_action = App$Kaelin$Event$Buffer$monad$(_m$bind$1 => _m$pure$2 => {
        var $2682 = _m$bind$1;
        return $2682;
    })(App$Kaelin$Event$Buffer$next)(_id$1 => {
        var self = _id$1 === 0n;
        if (self) {
            var $2684 = App$Kaelin$Event$Buffer$monad$pure(App$Kaelin$Action$walk);
            var $2683 = $2684;
        } else {
            var self = _id$1 === 1n;
            if (self) {
                var $2686 = App$Kaelin$Event$Buffer$monad$pure(App$Kaelin$Action$ability_0);
                var $2685 = $2686;
            } else {
                var self = _id$1 === 2n;
                if (self) {
                    var $2688 = App$Kaelin$Event$Buffer$monad$pure(App$Kaelin$Action$ability_1);
                    var $2687 = $2688;
                } else {
                    var $2689 = App$Kaelin$Event$Buffer$fail;
                    var $2687 = $2689;
                }
                var $2685 = $2687;
            }
            var $2683 = $2685;
        }
        return $2683;
    });
    function App$Kaelin$Event$user_input$(_player$1, _coord$2, _action$3) {
        var $2690 = {
            _: "App.Kaelin.Event.user_input",
            player: _player$1,
            coord: _coord$2,
            action: _action$3
        };
        return $2690;
    }
    const App$Kaelin$Event$user_input = x0 => x1 => x2 => App$Kaelin$Event$user_input$(x0, x1, x2);
    function App$Kaelin$Event$exe_skill$(_player$1, _target_pos$2, _key$3) {
        var $2691 = {
            _: "App.Kaelin.Event.exe_skill",
            player: _player$1,
            target_pos: _target_pos$2,
            key: _key$3
        };
        return $2691;
    }
    const App$Kaelin$Event$exe_skill = x0 => x1 => x2 => App$Kaelin$Event$exe_skill$(x0, x1, x2);
    const App$Kaelin$Team$red = {
        _: "App.Kaelin.Team.red"
    };
    const App$Kaelin$Team$blue = {
        _: "App.Kaelin.Team.blue"
    };
    function App$Kaelin$Team$decode$(_n$1) {
        var self = _n$1 === 1;
        if (self) {
            var $2693 = App$Kaelin$Team$red;
            var $2692 = $2693;
        } else {
            var self = _n$1 === 2;
            if (self) {
                var $2695 = App$Kaelin$Team$blue;
                var $2694 = $2695;
            } else {
                var $2696 = App$Kaelin$Team$neutral;
                var $2694 = $2696;
            }
            var $2692 = $2694;
        }
        return $2692;
    }
    const App$Kaelin$Team$decode = x0 => App$Kaelin$Team$decode$(x0);
    const App$Kaelin$Event$end_action = {
        _: "App.Kaelin.Event.end_action"
    };
    const App$Kaelin$Event$deserialize_scheme = App$Kaelin$Event$Buffer$monad$(_m$bind$1 => _m$pure$2 => {
        var $2697 = _m$bind$1;
        return $2697;
    })(App$Kaelin$Event$Buffer$push(App$Kaelin$Event$Code$action))(_$1 => {
        var $2698 = App$Kaelin$Event$Buffer$monad$(_m$bind$2 => _m$pure$3 => {
            var $2699 = _m$bind$2;
            return $2699;
        })(App$Kaelin$Event$Buffer$next)(_id_event$2 => {
            var self = _id_event$2 === 1n;
            if (self) {
                var $2701 = App$Kaelin$Event$Buffer$monad$(_m$bind$3 => _m$pure$4 => {
                    var $2702 = _m$bind$3;
                    return $2702;
                })(App$Kaelin$Event$Buffer$push(App$Kaelin$Event$Code$create_hero))(_$3 => {
                    var $2703 = App$Kaelin$Event$Buffer$monad$(_m$bind$4 => _m$pure$5 => {
                        var $2704 = _m$bind$4;
                        return $2704;
                    })(App$Kaelin$Event$Buffer$next)(_id_hero$4 => {
                        var $2705 = App$Kaelin$Event$Buffer$monad$(_m$bind$5 => _m$pure$6 => {
                            var $2706 = _m$pure$6;
                            return $2706;
                        })(App$Kaelin$Event$create_hero$(Number(_id_hero$4) & 255));
                        return $2705;
                    });
                    return $2703;
                });
                var $2700 = $2701;
            } else {
                var self = _id_event$2 === 4n;
                if (self) {
                    var $2708 = App$Kaelin$Event$Buffer$monad$(_m$bind$3 => _m$pure$4 => {
                        var $2709 = _m$bind$3;
                        return $2709;
                    })(App$Kaelin$Event$Buffer$push(App$Kaelin$Event$Code$user_input))(_$3 => {
                        var $2710 = App$Kaelin$Event$Buffer$monad$(_m$bind$4 => _m$pure$5 => {
                            var $2711 = _m$bind$4;
                            return $2711;
                        })(App$Kaelin$Event$Buffer$hex(null)(_x$4 => {
                            var $2712 = _x$4;
                            return $2712;
                        }))(_player$4 => {
                            var $2713 = App$Kaelin$Event$Buffer$monad$(_m$bind$5 => _m$pure$6 => {
                                var $2714 = _m$bind$5;
                                return $2714;
                            })(App$Kaelin$Resources$Action$to_action)(_action$5 => {
                                var $2715 = App$Kaelin$Event$Buffer$monad$(_m$bind$6 => _m$pure$7 => {
                                    var $2716 = _m$bind$6;
                                    return $2716;
                                })(App$Kaelin$Event$Buffer$next)(_pos$6 => {
                                    var $2717 = App$Kaelin$Event$Buffer$monad$(_m$bind$7 => _m$pure$8 => {
                                        var $2718 = _m$pure$8;
                                        return $2718;
                                    })(App$Kaelin$Event$user_input$("0x" + _player$4, App$Kaelin$Coord$Convert$nat_to_axial$(_pos$6), _action$5));
                                    return $2717;
                                });
                                return $2715;
                            });
                            return $2713;
                        });
                        return $2710;
                    });
                    var $2707 = $2708;
                } else {
                    var self = _id_event$2 === 5n;
                    if (self) {
                        var $2720 = App$Kaelin$Event$Buffer$monad$(_m$bind$3 => _m$pure$4 => {
                            var $2721 = _m$bind$3;
                            return $2721;
                        })(App$Kaelin$Event$Buffer$push(App$Kaelin$Event$Code$exe_skill))(_$3 => {
                            var $2722 = App$Kaelin$Event$Buffer$monad$(_m$bind$4 => _m$pure$5 => {
                                var $2723 = _m$bind$4;
                                return $2723;
                            })(App$Kaelin$Event$Buffer$hex(null)(_x$4 => {
                                var $2724 = _x$4;
                                return $2724;
                            }))(_player$4 => {
                                var $2725 = App$Kaelin$Event$Buffer$monad$(_m$bind$5 => _m$pure$6 => {
                                    var $2726 = _m$bind$5;
                                    return $2726;
                                })(App$Kaelin$Event$Buffer$next)(_mouse_pos$5 => {
                                    var $2727 = App$Kaelin$Event$Buffer$monad$(_m$bind$6 => _m$pure$7 => {
                                        var $2728 = _m$bind$6;
                                        return $2728;
                                    })(App$Kaelin$Event$Buffer$next)(_key$6 => {
                                        var $2729 = App$Kaelin$Event$Buffer$monad$(_m$bind$7 => _m$pure$8 => {
                                            var $2730 = _m$pure$8;
                                            return $2730;
                                        })(App$Kaelin$Event$exe_skill$("0x" + _player$4, App$Kaelin$Coord$Convert$nat_to_axial$(_mouse_pos$5), Number(_key$6) & 65535));
                                        return $2729;
                                    });
                                    return $2727;
                                });
                                return $2725;
                            });
                            return $2722;
                        });
                        var $2719 = $2720;
                    } else {
                        var self = _id_event$2 === 11n;
                        if (self) {
                            var $2732 = App$Kaelin$Event$Buffer$monad$(_m$bind$3 => _m$pure$4 => {
                                var $2733 = _m$bind$3;
                                return $2733;
                            })(App$Kaelin$Event$Buffer$push(App$Kaelin$Event$Code$save_skill))(_$3 => {
                                var $2734 = App$Kaelin$Event$Buffer$monad$(_m$bind$4 => _m$pure$5 => {
                                    var $2735 = _m$bind$4;
                                    return $2735;
                                })(App$Kaelin$Event$Buffer$hex(null)(_x$4 => {
                                    var $2736 = _x$4;
                                    return $2736;
                                }))(_player$4 => {
                                    var $2737 = App$Kaelin$Event$Buffer$monad$(_m$bind$5 => _m$pure$6 => {
                                        var $2738 = _m$bind$5;
                                        return $2738;
                                    })(App$Kaelin$Event$Buffer$next)(_mouse_pos$5 => {
                                        var $2739 = App$Kaelin$Event$Buffer$monad$(_m$bind$6 => _m$pure$7 => {
                                            var $2740 = _m$bind$6;
                                            return $2740;
                                        })(App$Kaelin$Event$Buffer$next)(_key$6 => {
                                            var $2741 = App$Kaelin$Event$Buffer$monad$(_m$bind$7 => _m$pure$8 => {
                                                var $2742 = _m$bind$7;
                                                return $2742;
                                            })(App$Kaelin$Event$Buffer$next)(_team$7 => {
                                                var $2743 = App$Kaelin$Event$Buffer$monad$(_m$bind$8 => _m$pure$9 => {
                                                    var $2744 = _m$pure$9;
                                                    return $2744;
                                                })(App$Kaelin$Event$save_skill$("0x" + _player$4, App$Kaelin$Coord$Convert$nat_to_axial$(_mouse_pos$5), Number(_key$6) & 65535, App$Kaelin$Team$decode$(Number(_team$7) & 255)));
                                                return $2743;
                                            });
                                            return $2741;
                                        });
                                        return $2739;
                                    });
                                    return $2737;
                                });
                                return $2734;
                            });
                            var $2731 = $2732;
                        } else {
                            var self = _id_event$2 === 13n;
                            if (self) {
                                var $2746 = App$Kaelin$Event$Buffer$monad$(_m$bind$3 => _m$pure$4 => {
                                    var $2747 = _m$pure$4;
                                    return $2747;
                                })(App$Kaelin$Event$end_action);
                                var $2745 = $2746;
                            } else {
                                var self = _id_event$2 === 12n;
                                if (self) {
                                    var $2749 = App$Kaelin$Event$Buffer$monad$(_m$bind$3 => _m$pure$4 => {
                                        var $2750 = _m$bind$3;
                                        return $2750;
                                    })(App$Kaelin$Event$Buffer$push(App$Kaelin$Event$Code$remove_skill))(_$3 => {
                                        var $2751 = App$Kaelin$Event$Buffer$monad$(_m$bind$4 => _m$pure$5 => {
                                            var $2752 = _m$bind$4;
                                            return $2752;
                                        })(App$Kaelin$Event$Buffer$hex(null)(_x$4 => {
                                            var $2753 = _x$4;
                                            return $2753;
                                        }))(_player$4 => {
                                            var $2754 = App$Kaelin$Event$Buffer$monad$(_m$bind$5 => _m$pure$6 => {
                                                var $2755 = _m$bind$5;
                                                return $2755;
                                            })(App$Kaelin$Event$Buffer$next)(_mouse_pos$5 => {
                                                var $2756 = App$Kaelin$Event$Buffer$monad$(_m$bind$6 => _m$pure$7 => {
                                                    var $2757 = _m$bind$6;
                                                    return $2757;
                                                })(App$Kaelin$Event$Buffer$next)(_key$6 => {
                                                    var $2758 = App$Kaelin$Event$Buffer$monad$(_m$bind$7 => _m$pure$8 => {
                                                        var $2759 = _m$bind$7;
                                                        return $2759;
                                                    })(App$Kaelin$Event$Buffer$next)(_team$7 => {
                                                        var $2760 = App$Kaelin$Event$Buffer$monad$(_m$bind$8 => _m$pure$9 => {
                                                            var $2761 = _m$pure$9;
                                                            return $2761;
                                                        })(App$Kaelin$Event$remove_skill$("0x" + _player$4, App$Kaelin$Coord$Convert$nat_to_axial$(_mouse_pos$5), Number(_key$6) & 65535, App$Kaelin$Team$decode$(Number(_team$7) & 255)));
                                                        return $2760;
                                                    });
                                                    return $2758;
                                                });
                                                return $2756;
                                            });
                                            return $2754;
                                        });
                                        return $2751;
                                    });
                                    var $2748 = $2749;
                                } else {
                                    var self = _id_event$2 === 6n;
                                    if (self) {
                                        var $2763 = App$Kaelin$Event$Buffer$monad$(_m$bind$3 => _m$pure$4 => {
                                            var $2764 = _m$bind$3;
                                            return $2764;
                                        })(App$Kaelin$Event$Buffer$push(App$Kaelin$Event$Code$draft_hero))(_$3 => {
                                            var $2765 = App$Kaelin$Event$Buffer$monad$(_m$bind$4 => _m$pure$5 => {
                                                var $2766 = _m$bind$4;
                                                return $2766;
                                            })(App$Kaelin$Event$Buffer$next)(_id_hero$4 => {
                                                var $2767 = App$Kaelin$Event$Buffer$monad$(_m$bind$5 => _m$pure$6 => {
                                                    var $2768 = _m$pure$6;
                                                    return $2768;
                                                })(App$Kaelin$Event$draft_hero$(Number(_id_hero$4) & 255));
                                                return $2767;
                                            });
                                            return $2765;
                                        });
                                        var $2762 = $2763;
                                    } else {
                                        var self = _id_event$2 === 7n;
                                        if (self) {
                                            var $2770 = App$Kaelin$Event$Buffer$monad$(_m$bind$3 => _m$pure$4 => {
                                                var $2771 = _m$bind$3;
                                                return $2771;
                                            })(App$Kaelin$Event$Buffer$push(App$Kaelin$Event$Code$draft_coord))(_$3 => {
                                                var $2772 = App$Kaelin$Event$Buffer$monad$(_m$bind$4 => _m$pure$5 => {
                                                    var $2773 = _m$bind$4;
                                                    return $2773;
                                                })(App$Kaelin$Event$Buffer$next)(_coord$4 => {
                                                    var $2774 = App$Kaelin$Event$Buffer$monad$(_m$bind$5 => _m$pure$6 => {
                                                        var $2775 = _m$pure$6;
                                                        return $2775;
                                                    })(App$Kaelin$Event$draft_coord$(App$Kaelin$Coord$Convert$nat_to_axial$(_coord$4)));
                                                    return $2774;
                                                });
                                                return $2772;
                                            });
                                            var $2769 = $2770;
                                        } else {
                                            var self = _id_event$2 === 8n;
                                            if (self) {
                                                var $2777 = App$Kaelin$Event$Buffer$monad$(_m$bind$3 => _m$pure$4 => {
                                                    var $2778 = _m$pure$4;
                                                    return $2778;
                                                })(App$Kaelin$Event$draft_end);
                                                var $2776 = $2777;
                                            } else {
                                                var self = _id_event$2 === 9n;
                                                if (self) {
                                                    var $2780 = App$Kaelin$Event$Buffer$monad$(_m$bind$3 => _m$pure$4 => {
                                                        var $2781 = _m$pure$4;
                                                        return $2781;
                                                    })(App$Kaelin$Event$to_draft);
                                                    var $2779 = $2780;
                                                } else {
                                                    var self = _id_event$2 === 10n;
                                                    if (self) {
                                                        var $2783 = App$Kaelin$Event$Buffer$monad$(_m$bind$3 => _m$pure$4 => {
                                                            var $2784 = _m$bind$3;
                                                            return $2784;
                                                        })(App$Kaelin$Event$Buffer$push(App$Kaelin$Event$Code$draft_team))(_$3 => {
                                                            var $2785 = App$Kaelin$Event$Buffer$monad$(_m$bind$4 => _m$pure$5 => {
                                                                var $2786 = _m$bind$4;
                                                                return $2786;
                                                            })(App$Kaelin$Event$Buffer$next)(_team$4 => {
                                                                var $2787 = App$Kaelin$Event$Buffer$monad$(_m$bind$5 => _m$pure$6 => {
                                                                    var $2788 = _m$pure$6;
                                                                    return $2788;
                                                                })(App$Kaelin$Event$draft_team$(Number(_team$4) & 255));
                                                                return $2787;
                                                            });
                                                            return $2785;
                                                        });
                                                        var $2782 = $2783;
                                                    } else {
                                                        var $2789 = App$Kaelin$Event$Buffer$fail;
                                                        var $2782 = $2789;
                                                    }
                                                    var $2779 = $2782;
                                                }
                                                var $2776 = $2779;
                                            }
                                            var $2769 = $2776;
                                        }
                                        var $2762 = $2769;
                                    }
                                    var $2748 = $2762;
                                }
                                var $2745 = $2748;
                            }
                            var $2731 = $2745;
                        }
                        var $2719 = $2731;
                    }
                    var $2707 = $2719;
                }
                var $2700 = $2707;
            }
            return $2700;
        });
        return $2698;
    });
    function App$Kaelin$Event$deserialize$(_code$1) {
        var $2790 = App$Kaelin$Event$Buffer$monad$run$(null, App$Kaelin$Event$deserialize_scheme, _code$1);
        return $2790;
    }
    const App$Kaelin$Event$deserialize = x0 => App$Kaelin$Event$deserialize$(x0);
    const App$State$global = Pair$snd;
    function App$Kaelin$Action$create_player$(_user$1, _hero$2, _glob$3) {
        var _key$4 = _user$1;
        var _init_pos$5 = App$Kaelin$Coord$new$(0, 0);
        var self = App$Kaelin$Map$player$info$(_user$1, (() => {
            var self = _glob$3;
            switch (self._) {
              case "App.Kaelin.State.global.new":
                var $2792 = self.map;
                var $2793 = $2792;
                return $2793;
            }
        })());
        switch (self._) {
          case "Maybe.none":
            var _new_creature$6 = App$Kaelin$Tile$creature$create$(_hero$2, Maybe$some$(_user$1), App$Kaelin$Team$blue);
            var _entity$7 = App$Kaelin$Map$Entity$creature$(_new_creature$6);
            var _map$8 = App$Kaelin$Map$push$(_init_pos$5, _entity$7, (() => {
                var self = _glob$3;
                switch (self._) {
                  case "App.Kaelin.State.global.new":
                    var $2795 = self.map;
                    var $2796 = $2795;
                    return $2796;
                }
            })());
            var self = _glob$3;
            switch (self._) {
              case "App.Kaelin.State.global.new":
                var $2797 = self.round;
                var $2798 = self.tick;
                var $2799 = self.room;
                var $2800 = self.stage;
                var $2801 = self.skills_list;
                var $2802 = App$Kaelin$State$global$new$($2797, $2798, $2799, _map$8, $2800, $2801);
                var $2794 = $2802;
                break;
            }
            ;
            var $2791 = $2794;
            break;

          case "Maybe.some":
            var $2803 = _glob$3;
            var $2791 = $2803;
            break;
        }
        return $2791;
    }
    const App$Kaelin$Action$create_player = x0 => x1 => x2 => App$Kaelin$Action$create_player$(x0, x1, x2);
    function App$Kaelin$CastInfo$global$new$(_player$1, _target_pos$2, _key$3, _team$4) {
        var $2804 = {
            _: "App.Kaelin.CastInfo.global.new",
            player: _player$1,
            target_pos: _target_pos$2,
            key: _key$3,
            team: _team$4
        };
        return $2804;
    }
    const App$Kaelin$CastInfo$global$new = x0 => x1 => x2 => x3 => App$Kaelin$CastInfo$global$new$(x0, x1, x2, x3);
    function App$Kaelin$Action$global$save_skill$(_user$1, _target_pos$2, _key$3, _team$4, _global$5) {
        var self = _global$5;
        switch (self._) {
          case "App.Kaelin.State.global.new":
            var $2806 = self.round;
            var $2807 = self.tick;
            var $2808 = self.room;
            var $2809 = self.map;
            var $2810 = self.stage;
            var $2811 = App$Kaelin$State$global$new$($2806, $2807, $2808, $2809, $2810, List$cons$(App$Kaelin$CastInfo$global$new$(_user$1, _target_pos$2, _key$3, _team$4), (() => {
                var self = _global$5;
                switch (self._) {
                  case "App.Kaelin.State.global.new":
                    var $2812 = self.skills_list;
                    var $2813 = $2812;
                    return $2813;
                }
            })()));
            var $2805 = $2811;
            break;
        }
        return $2805;
    }
    const App$Kaelin$Action$global$save_skill = x0 => x1 => x2 => x3 => x4 => App$Kaelin$Action$global$save_skill$(x0, x1, x2, x3, x4);
    function List$delete_by$(_p$2, _a$3, _as$4) {
        var self = _as$4;
        switch (self._) {
          case "List.cons":
            var $2815 = self.head;
            var $2816 = self.tail;
            var self = _p$2(_a$3)($2815);
            if (self) {
                var $2818 = List$delete_by$(_p$2, _a$3, $2816);
                var $2817 = $2818;
            } else {
                var $2819 = List$cons$($2815, List$delete_by$(_p$2, _a$3, $2816));
                var $2817 = $2819;
            }
            ;
            var $2814 = $2817;
            break;

          case "List.nil":
            var $2820 = List$nil;
            var $2814 = $2820;
            break;
        }
        return $2814;
    }
    const List$delete_by = x0 => x1 => x2 => List$delete_by$(x0, x1, x2);
    function List$all$(_cond$2, _list$3) {
        var List$all$ = (_cond$2, _list$3) => ({
            ctr: "TCO",
            arg: [ _cond$2, _list$3 ]
        });
        var List$all = _cond$2 => _list$3 => List$all$(_cond$2, _list$3);
        var arg = [ _cond$2, _list$3 ];
        while (true) {
            let [ _cond$2, _list$3 ] = arg;
            var R = (() => {
                var self = _list$3;
                switch (self._) {
                  case "List.cons":
                    var $2821 = self.head;
                    var $2822 = self.tail;
                    var self = _cond$2($2821);
                    if (self) {
                        var $2824 = List$all$(_cond$2, $2822);
                        var $2823 = $2824;
                    } else {
                        var $2825 = Bool$false;
                        var $2823 = $2825;
                    }
                    ;
                    return $2823;

                  case "List.nil":
                    var $2826 = Bool$true;
                    return $2826;
                }
            })();
            if (R.ctr === "TCO") arg = R.arg; else return R;
        }
    }
    const List$all = x0 => x1 => List$all$(x0, x1);
    function Function$id$(_x$2) {
        var $2827 = _x$2;
        return $2827;
    }
    const Function$id = x0 => Function$id$(x0);
    function App$Kaelin$CastInfo$global$eql$(_a$1, _b$2) {
        var $2828 = List$all$(Function$id, List$cons$(App$Kaelin$Coord$eql$((() => {
            var self = _a$1;
            switch (self._) {
              case "App.Kaelin.CastInfo.global.new":
                var $2829 = self.target_pos;
                var $2830 = $2829;
                return $2830;
            }
        })(), (() => {
            var self = _b$2;
            switch (self._) {
              case "App.Kaelin.CastInfo.global.new":
                var $2831 = self.target_pos;
                var $2832 = $2831;
                return $2832;
            }
        })()), List$cons$((() => {
            var self = _a$1;
            switch (self._) {
              case "App.Kaelin.CastInfo.global.new":
                var $2833 = self.player;
                var $2834 = $2833;
                return $2834;
            }
        })() === (() => {
            var self = _b$2;
            switch (self._) {
              case "App.Kaelin.CastInfo.global.new":
                var $2835 = self.player;
                var $2836 = $2835;
                return $2836;
            }
        })(), List$cons$((() => {
            var self = _a$1;
            switch (self._) {
              case "App.Kaelin.CastInfo.global.new":
                var $2837 = self.key;
                var $2838 = $2837;
                return $2838;
            }
        })() === (() => {
            var self = _b$2;
            switch (self._) {
              case "App.Kaelin.CastInfo.global.new":
                var $2839 = self.key;
                var $2840 = $2839;
                return $2840;
            }
        })(), List$nil))));
        return $2828;
    }
    const App$Kaelin$CastInfo$global$eql = x0 => x1 => App$Kaelin$CastInfo$global$eql$(x0, x1);
    function App$Kaelin$Action$global$remove_skill$(_user$1, _target_pos$2, _key$3, _team$4, _global$5) {
        var _this_cast$6 = App$Kaelin$CastInfo$global$new$(_user$1, _target_pos$2, _key$3, _team$4);
        var self = _global$5;
        switch (self._) {
          case "App.Kaelin.State.global.new":
            var $2842 = self.round;
            var $2843 = self.tick;
            var $2844 = self.room;
            var $2845 = self.map;
            var $2846 = self.stage;
            var $2847 = App$Kaelin$State$global$new$($2842, $2843, $2844, $2845, $2846, List$delete_by$(App$Kaelin$CastInfo$global$eql, _this_cast$6, (() => {
                var self = _global$5;
                switch (self._) {
                  case "App.Kaelin.State.global.new":
                    var $2848 = self.skills_list;
                    var $2849 = $2848;
                    return $2849;
                }
            })()));
            var $2841 = $2847;
            break;
        }
        return $2841;
    }
    const App$Kaelin$Action$global$remove_skill = x0 => x1 => x2 => x3 => x4 => App$Kaelin$Action$global$remove_skill$(x0, x1, x2, x3, x4);
    function App$Kaelin$DraftInfo$new$(_hero$1, _team$2) {
        var $2850 = {
            _: "App.Kaelin.DraftInfo.new",
            hero: _hero$1,
            team: _team$2
        };
        return $2850;
    }
    const App$Kaelin$DraftInfo$new = x0 => x1 => App$Kaelin$DraftInfo$new$(x0, x1);
    function App$Kaelin$Action$draft_hero$(_user$1, _hero$2, _glob$3) {
        var _key$4 = _user$1;
        var self = _glob$3;
        switch (self._) {
          case "App.Kaelin.State.global.new":
            var $2852 = self.stage;
            var self = $2852;
            switch (self._) {
              case "App.Kaelin.Stage.draft":
                var $2854 = self.players;
                var $2855 = self.coords;
                var _map$13 = $2854;
                var _player$14 = Map$get$(_user$1, _map$13);
                var self = _player$14;
                switch (self._) {
                  case "Maybe.some":
                    var $2857 = self.value;
                    var self = $2857;
                    switch (self._) {
                      case "App.Kaelin.DraftInfo.new":
                        var $2859 = self.team;
                        var _new_player$18 = App$Kaelin$DraftInfo$new$(Maybe$some$(_hero$2), $2859);
                        var _new_map$19 = Map$set$(_user$1, _new_player$18, _map$13);
                        var _new_stage$20 = App$Kaelin$Stage$draft$(_new_map$19, $2855);
                        var self = _glob$3;
                        switch (self._) {
                          case "App.Kaelin.State.global.new":
                            var $2861 = self.round;
                            var $2862 = self.tick;
                            var $2863 = self.room;
                            var $2864 = self.map;
                            var $2865 = self.skills_list;
                            var $2866 = App$Kaelin$State$global$new$($2861, $2862, $2863, $2864, _new_stage$20, $2865);
                            var $2860 = $2866;
                            break;
                        }
                        ;
                        var $2858 = $2860;
                        break;
                    }
                    ;
                    var $2856 = $2858;
                    break;

                  case "Maybe.none":
                    var $2867 = _glob$3;
                    var $2856 = $2867;
                    break;
                }
                ;
                var $2853 = $2856;
                break;

              case "App.Kaelin.Stage.init":
              case "App.Kaelin.Stage.planning":
              case "App.Kaelin.Stage.action":
                var $2868 = _glob$3;
                var $2853 = $2868;
                break;
            }
            ;
            var $2851 = $2853;
            break;
        }
        return $2851;
    }
    const App$Kaelin$Action$draft_hero = x0 => x1 => x2 => App$Kaelin$Action$draft_hero$(x0, x1, x2);
    function App$Kaelin$Action$draft_coord$(_user$1, _coord$2, _glob$3) {
        var _key$4 = _user$1;
        var self = _glob$3;
        switch (self._) {
          case "App.Kaelin.State.global.new":
            var $2870 = self.stage;
            var self = $2870;
            switch (self._) {
              case "App.Kaelin.Stage.draft":
                var $2872 = self.players;
                var $2873 = self.coords;
                var _key$13 = App$Kaelin$Coord$Convert$axial_to_nat$(_coord$2);
                var _team$14 = Maybe$default$(App$Kaelin$Coord$draft$to_team$(_user$1, $2872), App$Kaelin$Team$neutral);
                var _map$15 = App$Kaelin$Coord$draft$to_map$(_team$14, $2873);
                var _coord_id$16 = Maybe$default$(NatMap$get$(_key$13, _map$15), "empty");
                var self = _coord_id$16 === "empty";
                if (self) {
                    var _coords$17 = NatMap$to_list$(_map$15);
                    var _map$18 = (() => {
                        var $2877 = _map$15;
                        var $2878 = _coords$17;
                        let _map$19 = $2877;
                        let _pair$18;
                        while ($2878._ === "List.cons") {
                            _pair$18 = $2878.head;
                            var self = _pair$18;
                            switch (self._) {
                              case "Pair.new":
                                var $2879 = self.fst;
                                var $2880 = self.snd;
                                var self = $2880 === _user$1;
                                if (self) {
                                    var $2882 = NatMap$set$($2879, "empty", _map$19);
                                    var $2881 = $2882;
                                } else {
                                    var $2883 = _map$19;
                                    var $2881 = $2883;
                                }
                                ;
                                var $2877 = $2881;
                                break;
                            }
                            _map$19 = $2877;
                            $2878 = $2878.tail;
                        }
                        return _map$19;
                    })();
                    var _new_map$19 = NatMap$set$(_key$13, _user$1, _map$18);
                    var self = App$Kaelin$Team$show$(_team$14) === "blue";
                    if (self) {
                        var $2884 = Pair$new$(_new_map$19, Pair$snd$($2873));
                        var _new_map$20 = $2884;
                    } else {
                        var self = App$Kaelin$Team$show$(_team$14) === "red";
                        if (self) {
                            var $2886 = Pair$new$(Pair$fst$($2873), _new_map$19);
                            var $2885 = $2886;
                        } else {
                            var $2887 = $2873;
                            var $2885 = $2887;
                        }
                        var _new_map$20 = $2885;
                    }
                    var _stage$21 = App$Kaelin$Stage$draft$($2872, _new_map$20);
                    var self = _glob$3;
                    switch (self._) {
                      case "App.Kaelin.State.global.new":
                        var $2888 = self.round;
                        var $2889 = self.tick;
                        var $2890 = self.room;
                        var $2891 = self.map;
                        var $2892 = self.skills_list;
                        var $2893 = App$Kaelin$State$global$new$($2888, $2889, $2890, $2891, _stage$21, $2892);
                        var $2875 = $2893;
                        break;
                    }
                    var $2874 = $2875;
                } else {
                    var $2894 = _glob$3;
                    var $2874 = $2894;
                }
                ;
                var $2871 = $2874;
                break;

              case "App.Kaelin.Stage.init":
              case "App.Kaelin.Stage.planning":
              case "App.Kaelin.Stage.action":
                var $2895 = _glob$3;
                var $2871 = $2895;
                break;
            }
            ;
            var $2869 = $2871;
            break;
        }
        return $2869;
    }
    const App$Kaelin$Action$draft_coord = x0 => x1 => x2 => App$Kaelin$Action$draft_coord$(x0, x1, x2);
    function App$Kaelin$Coord$draft$start_game$(_map$1, _draft_map$2, _players$3) {
        var _draft_map$4 = NatMap$union$((() => {
            var self = _draft_map$2;
            switch (self._) {
              case "Pair.new":
                var $2897 = self.fst;
                var $2898 = $2897;
                return $2898;
            }
        })(), (() => {
            var self = _draft_map$2;
            switch (self._) {
              case "Pair.new":
                var $2899 = self.snd;
                var $2900 = $2899;
                return $2900;
            }
        })());
        var _coords$5 = NatMap$to_list$(_draft_map$4);
        var _map$6 = (() => {
            var $2902 = _map$1;
            var $2903 = _coords$5;
            let _map$7 = $2902;
            let _coord$6;
            while ($2903._ === "List.cons") {
                _coord$6 = $2903.head;
                var self = _coord$6;
                switch (self._) {
                  case "Pair.new":
                    var $2904 = self.snd;
                    var $2905 = $2904;
                    var _user$8 = $2905;
                    break;
                }
                var _result$9 = Maybe$monad$(_m$bind$9 => _m$pure$10 => {
                    var $2906 = _m$bind$9;
                    return $2906;
                })(Map$get$(_user$8, _players$3))(_player$9 => {
                    var $2907 = Maybe$monad$(_m$bind$10 => _m$pure$11 => {
                        var $2908 = _m$bind$10;
                        return $2908;
                    })((() => {
                        var self = _player$9;
                        switch (self._) {
                          case "App.Kaelin.DraftInfo.new":
                            var $2909 = self.hero;
                            var $2910 = $2909;
                            return $2910;
                        }
                    })())(_hero$10 => {
                        var $2911 = Maybe$monad$(_m$bind$11 => _m$pure$12 => {
                            var $2912 = _m$bind$11;
                            return $2912;
                        })(App$Kaelin$Coord$draft$to_team$(_user$8, _players$3))(_team$11 => {
                            var _new_creature$12 = App$Kaelin$Tile$creature$create$(_hero$10, Maybe$some$(_user$8), _team$11);
                            var _coord$13 = App$Kaelin$Coord$Convert$nat_to_axial$((() => {
                                var self = _coord$6;
                                switch (self._) {
                                  case "Pair.new":
                                    var $2914 = self.fst;
                                    var $2915 = $2914;
                                    return $2915;
                                }
                            })());
                            var _entity$14 = App$Kaelin$Map$Entity$creature$(_new_creature$12);
                            var $2913 = Maybe$monad$(_m$bind$15 => _m$pure$16 => {
                                var $2916 = _m$pure$16;
                                return $2916;
                            })(App$Kaelin$Map$push$(_coord$13, _entity$14, _map$7));
                            return $2913;
                        });
                        return $2911;
                    });
                    return $2907;
                });
                var $2902 = Maybe$default$(_result$9, _map$7);
                _map$7 = $2902;
                $2903 = $2903.tail;
            }
            return _map$7;
        })();
        var $2896 = _map$6;
        return $2896;
    }
    const App$Kaelin$Coord$draft$start_game = x0 => x1 => x2 => App$Kaelin$Coord$draft$start_game$(x0, x1, x2);
    function App$Kaelin$Action$draft_end$(_glob$1) {
        var self = _glob$1;
        switch (self._) {
          case "App.Kaelin.State.global.new":
            var $2918 = self.round;
            var $2919 = self.tick;
            var $2920 = self.room;
            var $2921 = self.map;
            var $2922 = self.stage;
            var $2923 = self.skills_list;
            var self = $2922;
            switch (self._) {
              case "App.Kaelin.Stage.draft":
                var $2925 = self.players;
                var $2926 = self.coords;
                var _new_stage$10 = App$Kaelin$Stage$planning$(0n, 0n);
                var _new_map$11 = App$Kaelin$Coord$draft$start_game$($2921, $2926, $2925);
                var $2927 = App$Kaelin$State$global$new$($2918, $2919, $2920, _new_map$11, _new_stage$10, $2923);
                var $2924 = $2927;
                break;

              case "App.Kaelin.Stage.init":
              case "App.Kaelin.Stage.planning":
              case "App.Kaelin.Stage.action":
                var $2928 = _glob$1;
                var $2924 = $2928;
                break;
            }
            ;
            var $2917 = $2924;
            break;
        }
        return $2917;
    }
    const App$Kaelin$Action$draft_end = x0 => App$Kaelin$Action$draft_end$(x0);
    function App$Kaelin$Action$to_draft$(_user$1, _room$2, _glob$3) {
        var self = _glob$3;
        switch (self._) {
          case "App.Kaelin.State.global.new":
            var $2930 = self.round;
            var $2931 = self.tick;
            var $2932 = self.map;
            var $2933 = self.stage;
            var $2934 = self.skills_list;
            var _info$10 = App$Kaelin$DraftInfo$new$(Maybe$none, App$Kaelin$Team$neutral);
            var $2935 = (console.log("user:" + _user$1), (_$11 => {
                var $2936 = (console.log("room:" + _room$2), (_$12 => {
                    var self = $2933;
                    switch (self._) {
                      case "App.Kaelin.Stage.draft":
                        var $2938 = self.players;
                        var $2939 = self.coords;
                        var _players$15 = Map$set$(_user$1, _info$10, $2938);
                        var _new_stage$16 = App$Kaelin$Stage$draft$(_players$15, $2939);
                        var $2940 = App$Kaelin$State$global$new$($2930, $2931, _room$2, $2932, _new_stage$16, $2934);
                        var $2937 = $2940;
                        break;

                      case "App.Kaelin.Stage.init":
                        var _map$13 = Map$new;
                        var _coords$14 = App$Kaelin$Coord$draft$arena;
                        var _new_stage$15 = App$Kaelin$Stage$draft$(_map$13, _coords$14);
                        var $2941 = App$Kaelin$State$global$new$($2930, $2931, _room$2, $2932, _new_stage$15, $2934);
                        var $2937 = $2941;
                        break;

                      case "App.Kaelin.Stage.planning":
                      case "App.Kaelin.Stage.action":
                        var $2942 = _glob$3;
                        var $2937 = $2942;
                        break;
                    }
                    return $2937;
                })());
                return $2936;
            })());
            var $2929 = $2935;
            break;
        }
        return $2929;
    }
    const App$Kaelin$Action$to_draft = x0 => x1 => x2 => App$Kaelin$Action$to_draft$(x0, x1, x2);
    function App$Kaelin$Action$draft_team$(_user$1, _team$2, _glob$3) {
        var _key$4 = _user$1;
        var self = _glob$3;
        switch (self._) {
          case "App.Kaelin.State.global.new":
            var $2944 = self.stage;
            var self = $2944;
            switch (self._) {
              case "App.Kaelin.Stage.draft":
                var $2946 = self.players;
                var $2947 = self.coords;
                var self = _team$2 === 0;
                if (self) {
                    var $2949 = App$Kaelin$Team$blue;
                    var _team$13 = $2949;
                } else {
                    var self = _team$2 === 1;
                    if (self) {
                        var $2951 = App$Kaelin$Team$red;
                        var $2950 = $2951;
                    } else {
                        var $2952 = App$Kaelin$Team$neutral;
                        var $2950 = $2952;
                    }
                    var _team$13 = $2950;
                }
                ;
                var _map$14 = $2946;
                var _new_player$15 = App$Kaelin$DraftInfo$new$(Maybe$none, _team$13);
                var _new_map$16 = Map$set$(_user$1, _new_player$15, _map$14);
                var _new_stage$17 = App$Kaelin$Stage$draft$(_new_map$16, $2947);
                var self = _glob$3;
                switch (self._) {
                  case "App.Kaelin.State.global.new":
                    var $2953 = self.round;
                    var $2954 = self.tick;
                    var $2955 = self.room;
                    var $2956 = self.map;
                    var $2957 = self.skills_list;
                    var $2958 = App$Kaelin$State$global$new$($2953, $2954, $2955, $2956, _new_stage$17, $2957);
                    var $2948 = $2958;
                    break;
                }
                ;
                var $2945 = $2948;
                break;

              case "App.Kaelin.Stage.init":
              case "App.Kaelin.Stage.planning":
              case "App.Kaelin.Stage.action":
                var $2959 = _glob$3;
                var $2945 = $2959;
                break;
            }
            ;
            var $2943 = $2945;
            break;
        }
        return $2943;
    }
    const App$Kaelin$Action$draft_team = x0 => x1 => x2 => App$Kaelin$Action$draft_team$(x0, x1, x2);
    function App$Kaelin$App$post$(_time$1, _room$2, _addr$3, _data$4, _glob$5) {
        var self = App$Kaelin$Event$deserialize$(String$drop$(2n, _data$4));
        switch (self._) {
          case "Maybe.some":
            var $2961 = self.value;
            var self = $2961;
            switch (self._) {
              case "App.Kaelin.Event.create_hero":
                var $2963 = self.hero_id;
                var $2964 = App$Kaelin$Action$create_player$(_addr$3, $2963, _glob$5);
                var $2962 = $2964;
                break;

              case "App.Kaelin.Event.exe_skill":
                var $2965 = self.player;
                var $2966 = self.target_pos;
                var $2967 = self.key;
                var $2968 = App$Kaelin$Action$global$exe_skill$($2965, $2966, $2967, _glob$5);
                var $2962 = $2968;
                break;

              case "App.Kaelin.Event.save_skill":
                var $2969 = self.player;
                var $2970 = self.target_pos;
                var $2971 = self.key;
                var $2972 = self.team;
                var $2973 = App$Kaelin$Action$global$save_skill$($2969, $2970, $2971, $2972, _glob$5);
                var $2962 = $2973;
                break;

              case "App.Kaelin.Event.remove_skill":
                var $2974 = self.player;
                var $2975 = self.target_pos;
                var $2976 = self.key;
                var $2977 = self.team;
                var $2978 = App$Kaelin$Action$global$remove_skill$($2974, $2975, $2976, $2977, _glob$5);
                var $2962 = $2978;
                break;

              case "App.Kaelin.Event.draft_hero":
                var $2979 = self.hero;
                var $2980 = App$Kaelin$Action$draft_hero$(_addr$3, $2979, _glob$5);
                var $2962 = $2980;
                break;

              case "App.Kaelin.Event.draft_coord":
                var $2981 = self.coord;
                var $2982 = App$Kaelin$Action$draft_coord$(_addr$3, $2981, _glob$5);
                var $2962 = $2982;
                break;

              case "App.Kaelin.Event.draft_team":
                var $2983 = self.team;
                var $2984 = App$Kaelin$Action$draft_team$(_addr$3, $2983, _glob$5);
                var $2962 = $2984;
                break;

              case "App.Kaelin.Event.start_game":
              case "App.Kaelin.Event.create_user":
              case "App.Kaelin.Event.user_input":
                var $2985 = _glob$5;
                var $2962 = $2985;
                break;

              case "App.Kaelin.Event.end_action":
                var $2986 = App$Kaelin$Stage$action$end$(_glob$5);
                var $2962 = $2986;
                break;

              case "App.Kaelin.Event.draft_end":
                var $2987 = App$Kaelin$Action$draft_end$(_glob$5);
                var $2962 = $2987;
                break;

              case "App.Kaelin.Event.to_draft":
                var $2988 = App$Kaelin$Action$to_draft$(_addr$3, _room$2, _glob$5);
                var $2962 = $2988;
                break;
            }
            ;
            var $2960 = $2962;
            break;

          case "Maybe.none":
            var $2989 = _glob$5;
            var $2960 = $2989;
            break;
        }
        return $2960;
    }
    const App$Kaelin$App$post = x0 => x1 => x2 => x3 => x4 => App$Kaelin$App$post$(x0, x1, x2, x3, x4);
    function App$new$(_init$2, _draw$3, _when$4, _tick$5, _post$6) {
        var $2990 = {
            _: "App.new",
            init: _init$2,
            draw: _draw$3,
            when: _when$4,
            tick: _tick$5,
            post: _post$6
        };
        return $2990;
    }
    const App$new = x0 => x1 => x2 => x3 => x4 => App$new$(x0, x1, x2, x3, x4);
    const App$Kaelin = (() => {
        var _img$1 = VoxBox$alloc_capacity$(65536 * 8 >>> 0);
        var _init$2 = App$Kaelin$App$init;
        var _draw$3 = App$Kaelin$App$draw(_img$1);
        var _when$4 = App$Kaelin$App$when;
        var _tick$5 = App$Kaelin$App$tick;
        var _post$6 = App$Kaelin$App$post;
        var $2991 = App$new$(_init$2, _draw$3, _when$4, _tick$5, _post$6);
        return $2991;
    })();
    return {
        "Buffer32.new": Buffer32$new,
        Array: Array,
        "Array.tip": Array$tip,
        "Array.tie": Array$tie,
        "Array.alloc": Array$alloc,
        "U32.new": U32$new,
        Word: Word,
        "Word.e": Word$e,
        "Word.o": Word$o,
        "Word.zero": Word$zero,
        "Nat.succ": Nat$succ,
        "Nat.zero": Nat$zero,
        "U32.zero": U32$zero,
        "Buffer32.alloc": Buffer32$alloc,
        "Word.bit_length.go": Word$bit_length$go,
        "Word.bit_length": Word$bit_length,
        "U32.bit_length": U32$bit_length,
        "Word.i": Word$i,
        "Bool.false": Bool$false,
        "Bool.true": Bool$true,
        "Word.shift_left.one.go": Word$shift_left$one$go,
        "Word.shift_left.one": Word$shift_left$one,
        "Word.shift_left": Word$shift_left,
        "Word.adder": Word$adder,
        "Word.add": Word$add,
        "Word.mul.go": Word$mul$go,
        "Word.to_zero": Word$to_zero,
        "Word.mul": Word$mul,
        "U32.mul": U32$mul,
        "Nat.apply": Nat$apply,
        "Word.inc": Word$inc,
        "Nat.to_word": Nat$to_word,
        "Nat.to_u32": Nat$to_u32,
        "VoxBox.new": VoxBox$new,
        "VoxBox.alloc_capacity": VoxBox$alloc_capacity,
        "App.Kaelin.Constants.room": App$Kaelin$Constants$room,
        "Maybe.none": Maybe$none,
        "App.Kaelin.Coord.new": App$Kaelin$Coord$new,
        "Maybe.default": Maybe$default,
        "Cmp.as_eql": Cmp$as_eql,
        "Cmp.ltn": Cmp$ltn,
        "Cmp.gtn": Cmp$gtn,
        "Word.cmp.go": Word$cmp$go,
        "Cmp.eql": Cmp$eql,
        "Word.cmp": Word$cmp,
        "Word.eql": Word$eql,
        "U8.eql": U8$eql,
        "U8.new": U8$new,
        "U8.from_nat": U8$from_nat,
        Maybe: Maybe,
        "Maybe.some": Maybe$some,
        "App.Kaelin.Hero.new": App$Kaelin$Hero$new,
        "Nat.ltn": Nat$ltn,
        "Nat.sub": Nat$sub,
        "Cmp.as_gte": Cmp$as_gte,
        "Word.gte": Word$gte,
        Pair: Pair,
        "Pair.new": Pair$new,
        "Word.or": Word$or,
        "Word.shift_right.one.go": Word$shift_right$one$go,
        "Word.shift_right.one": Word$shift_right$one,
        "Word.shift_right": Word$shift_right,
        "Word.subber": Word$subber,
        "Word.sub": Word$sub,
        "Word.div.go": Word$div$go,
        "Word.div": Word$div,
        "U32.div": U32$div,
        "U32.length": U32$length,
        "U32.eql": U32$eql,
        "U32.inc": U32$inc,
        "U32.for": U32$for,
        "Word.slice": Word$slice,
        "U32.slice": U32$slice,
        "U32.add": U32$add,
        "U32.read_base": U32$read_base,
        "VoxBox.parse_byte": VoxBox$parse_byte,
        "U32.or": U32$or,
        "Word.fold": Word$fold,
        "Nat.add": Nat$add,
        "Nat.mul": Nat$mul,
        "Word.to_nat": Word$to_nat,
        "Word.shl": Word$shl,
        "U32.shl": U32$shl,
        "Pos32.new": Pos32$new,
        "Col32.new": Col32$new,
        "Word.trim": Word$trim,
        "Unit.new": Unit$new,
        "Array.extract_tip": Array$extract_tip,
        "Array.extract_tie": Array$extract_tie,
        "Word.foldl": Word$foldl,
        "Array.mut": Array$mut,
        "Array.set": Array$set,
        "Buffer32.set": Buffer32$set,
        "VoxBox.set_pos": VoxBox$set_pos,
        "VoxBox.set_col": VoxBox$set_col,
        "VoxBox.set_length": VoxBox$set_length,
        "VoxBox.push": VoxBox$push,
        "VoxBox.parse": VoxBox$parse,
        "App.Kaelin.Assets.hero.croni0_d_1": App$Kaelin$Assets$hero$croni0_d_1,
        "I32.new": I32$new,
        "Word.neg.aux": Word$neg$aux,
        "Word.neg": Word$neg,
        "I32.neg": I32$neg,
        "Int.to_i32": Int$to_i32,
        "Int.new": Int$new,
        "Int.from_nat": Int$from_nat,
        "I32.from_nat": I32$from_nat,
        "List.cons": List$cons,
        "App.Kaelin.Skill.new": App$Kaelin$Skill$new,
        "App.Kaelin.Effect.Result": App$Kaelin$Effect$Result,
        List: List,
        "List.concat": List$concat,
        BitsMap: BitsMap,
        "BitsMap.tie": BitsMap$tie,
        "BitsMap.union": BitsMap$union,
        "NatMap.union": NatMap$union,
        "App.Kaelin.Effect.Result.new": App$Kaelin$Effect$Result$new,
        "App.Kaelin.Effect.bind": App$Kaelin$Effect$bind,
        "List.nil": List$nil,
        "BitsMap.new": BitsMap$new,
        "NatMap.new": NatMap$new,
        "App.Kaelin.Effect.pure": App$Kaelin$Effect$pure,
        "App.Kaelin.Effect.monad": App$Kaelin$Effect$monad,
        "App.Kaelin.Effect.coord.get_center": App$Kaelin$Effect$coord$get_center,
        "App.Kaelin.Effect.coord.get_target": App$Kaelin$Effect$coord$get_target,
        NatMap: NatMap,
        "App.Kaelin.Effect.map.get": App$Kaelin$Effect$map$get,
        "Bool.and": Bool$and,
        "I32.eql": I32$eql,
        "App.Kaelin.Coord.eql": App$Kaelin$Coord$eql,
        "App.Kaelin.Effect": App$Kaelin$Effect,
        "I32.add": I32$add,
        "I32.mul": I32$mul,
        "F64.to_u32": F64$to_u32,
        "Word.s_to_f64": Word$s_to_f64,
        "I32.to_f64": I32$to_f64,
        "I32.to_u32": I32$to_u32,
        "U32.to_nat": U32$to_nat,
        "App.Kaelin.Coord.Convert.axial_to_nat": App$Kaelin$Coord$Convert$axial_to_nat,
        "BitsMap.get": BitsMap$get,
        "Bits.o": Bits$o,
        "Bits.e": Bits$e,
        "Bits.i": Bits$i,
        "Bits.inc": Bits$inc,
        "Nat.to_bits": Nat$to_bits,
        "NatMap.get": NatMap$get,
        "App.Kaelin.Map.creature.get": App$Kaelin$Map$creature$get,
        "Word.is_neg.go": Word$is_neg$go,
        "Word.is_neg": Word$is_neg,
        "Cmp.as_gtn": Cmp$as_gtn,
        "Cmp.inv": Cmp$inv,
        "Word.s_gtn": Word$s_gtn,
        "I32.gtn": I32$gtn,
        "I32.max": I32$max,
        "Cmp.as_ltn": Cmp$as_ltn,
        "Word.s_ltn": Word$s_ltn,
        "I32.ltn": I32$ltn,
        "I32.min": I32$min,
        "I32.sub": I32$sub,
        "Maybe.bind": Maybe$bind,
        "Maybe.monad": Maybe$monad,
        "App.Kaelin.Tile.new": App$Kaelin$Tile$new,
        "BitsMap.set": BitsMap$set,
        "NatMap.set": NatMap$set,
        "App.Kaelin.Map.creature.modify_at": App$Kaelin$Map$creature$modify_at,
        "Cmp.as_lte": Cmp$as_lte,
        "Word.s_lte": Word$s_lte,
        "I32.lte": I32$lte,
        "App.Kaelin.Creature.new": App$Kaelin$Creature$new,
        "App.Kaelin.Tile.creature.change_hp": App$Kaelin$Tile$creature$change_hp,
        "App.Kaelin.Map.creature.change_hp_at": App$Kaelin$Map$creature$change_hp_at,
        "App.Kaelin.Map.get": App$Kaelin$Map$get,
        "App.Kaelin.Map.is_occupied": App$Kaelin$Map$is_occupied,
        "App.Kaelin.Effect.map.set": App$Kaelin$Effect$map$set,
        "App.Kaelin.Effect.indicators.add": App$Kaelin$Effect$indicators$add,
        "App.Kaelin.Indicator.green": App$Kaelin$Indicator$green,
        "App.Kaelin.Indicator.red": App$Kaelin$Indicator$red,
        "App.Kaelin.Effect.hp.change_at": App$Kaelin$Effect$hp$change_at,
        "App.Kaelin.Effect.hp.damage_at": App$Kaelin$Effect$hp$damage_at,
        "App.Kaelin.Effect.hp.heal_at": App$Kaelin$Effect$hp$heal_at,
        "App.Kaelin.Tile.creature.change_ap": App$Kaelin$Tile$creature$change_ap,
        "App.Kaelin.Map.creature.change_ap_at": App$Kaelin$Map$creature$change_ap_at,
        "App.Kaelin.Effect.ap.change_at": App$Kaelin$Effect$ap$change_at,
        "App.Kaelin.Effect.ap.cost": App$Kaelin$Effect$ap$cost,
        "App.Kaelin.Skill.vampirism": App$Kaelin$Skill$vampirism,
        "App.Kaelin.Heroes.Croni.skills.vampirism": App$Kaelin$Heroes$Croni$skills$vampirism,
        "App.Kaelin.Coord.Cubic.new": App$Kaelin$Coord$Cubic$new,
        "App.Kaelin.Coord.Convert.axial_to_cubic": App$Kaelin$Coord$Convert$axial_to_cubic,
        "List.map": List$map,
        "App.Kaelin.Coord.Convert.cubic_to_axial": App$Kaelin$Coord$Convert$cubic_to_axial,
        "U32.from_nat": U32$from_nat,
        "F64.to_i32": F64$to_i32,
        "Word.to_f64": Word$to_f64,
        "U32.to_f64": U32$to_f64,
        "U32.to_i32": U32$to_i32,
        "Word.shr": Word$shr,
        "Word.s_shr": Word$s_shr,
        "I32.shr": I32$shr,
        "Word.xor": Word$xor,
        "I32.xor": I32$xor,
        "I32.abs": I32$abs,
        "App.Kaelin.Coord.Cubic.add": App$Kaelin$Coord$Cubic$add,
        "App.Kaelin.Coord.Cubic.range": App$Kaelin$Coord$Cubic$range,
        "Word.lte": Word$lte,
        "U32.lte": U32$lte,
        "App.Kaelin.Coord.fit": App$Kaelin$Coord$fit,
        "App.Kaelin.Constants.map_size": App$Kaelin$Constants$map_size,
        "List.filter": List$filter,
        "App.Kaelin.Coord.range": App$Kaelin$Coord$range,
        "List.fold": List$fold,
        "List.foldr": List$foldr,
        "App.Kaelin.Map.set": App$Kaelin$Map$set,
        "App.Kaelin.Map.push": App$Kaelin$Map$push,
        "App.Kaelin.Map.Entity.animation": App$Kaelin$Map$Entity$animation,
        "App.Kaelin.Animation.new": App$Kaelin$Animation$new,
        "App.Kaelin.Sprite.new": App$Kaelin$Sprite$new,
        "App.Kaelin.Assets.effects.fire_1": App$Kaelin$Assets$effects$fire_1,
        "App.Kaelin.Assets.effects.fire_2": App$Kaelin$Assets$effects$fire_2,
        "App.Kaelin.Assets.effects.fire_3": App$Kaelin$Assets$effects$fire_3,
        "App.Kaelin.Assets.effects.fire_4": App$Kaelin$Assets$effects$fire_4,
        "App.Kaelin.Assets.effects.fire_5": App$Kaelin$Assets$effects$fire_5,
        "App.Kaelin.Sprite.fire": App$Kaelin$Sprite$fire,
        "App.Kaelin.Effect.animation.push": App$Kaelin$Effect$animation$push,
        "List.for": List$for,
        "App.Kaelin.Effect.result.union": App$Kaelin$Effect$result$union,
        "App.Kaelin.Effect.area": App$Kaelin$Effect$area,
        "App.Kaelin.Map.creature.change_hp": App$Kaelin$Map$creature$change_hp,
        "App.Kaelin.Effect.hp.change": App$Kaelin$Effect$hp$change,
        "App.Kaelin.Effect.hp.damage": App$Kaelin$Effect$hp$damage,
        "App.Kaelin.Skill.fireball": App$Kaelin$Skill$fireball,
        "App.Kaelin.Heroes.Croni.skills.fireball": App$Kaelin$Heroes$Croni$skills$fireball,
        "App.Kaelin.Effect.ap.burn": App$Kaelin$Effect$ap$burn,
        "App.Kaelin.Effect.ap.restore": App$Kaelin$Effect$ap$restore,
        "App.Kaelin.Skill.ap_drain": App$Kaelin$Skill$ap_drain,
        "App.Kaelin.Heroes.Croni.skills.ap_drain": App$Kaelin$Heroes$Croni$skills$ap_drain,
        "App.Kaelin.Skill.ap_recover": App$Kaelin$Skill$ap_recover,
        "App.Kaelin.Heroes.Croni.skills.ap_recover": App$Kaelin$Heroes$Croni$skills$ap_recover,
        "App.Kaelin.Coord.Cubic.distance": App$Kaelin$Coord$Cubic$distance,
        "App.Kaelin.Coord.distance": App$Kaelin$Coord$distance,
        "App.Kaelin.Map.Entity.creature": App$Kaelin$Map$Entity$creature,
        "App.Kaelin.Map.creature.pop": App$Kaelin$Map$creature$pop,
        "App.Kaelin.Map.creature.swap": App$Kaelin$Map$creature$swap,
        "App.Kaelin.Effect.movement.move": App$Kaelin$Effect$movement$move,
        "App.Kaelin.Skill.move": App$Kaelin$Skill$move,
        "App.Kaelin.Heroes.Croni.skills": App$Kaelin$Heroes$Croni$skills,
        "App.Kaelin.Heroes.Croni.hero": App$Kaelin$Heroes$Croni$hero,
        "App.Kaelin.Assets.hero.cyclope_d_1": App$Kaelin$Assets$hero$cyclope_d_1,
        "App.Kaelin.Heroes.Cyclope.skills.vampirism": App$Kaelin$Heroes$Cyclope$skills$vampirism,
        "App.Kaelin.Heroes.Cyclope.skills.ap_recover": App$Kaelin$Heroes$Cyclope$skills$ap_recover,
        "App.Kaelin.Heroes.Cyclope.skills": App$Kaelin$Heroes$Cyclope$skills,
        "App.Kaelin.Heroes.Cyclope.hero": App$Kaelin$Heroes$Cyclope$hero,
        "App.Kaelin.Assets.hero.lela_d_1": App$Kaelin$Assets$hero$lela_d_1,
        "App.Kaelin.Heroes.Lela.skills.vampirism": App$Kaelin$Heroes$Lela$skills$vampirism,
        "App.Kaelin.Heroes.Lela.skills.ap_recover": App$Kaelin$Heroes$Lela$skills$ap_recover,
        "App.Kaelin.Heroes.Lela.skills": App$Kaelin$Heroes$Lela$skills,
        "App.Kaelin.Heroes.Lela.hero": App$Kaelin$Heroes$Lela$hero,
        "App.Kaelin.Assets.hero.octoking_d_1": App$Kaelin$Assets$hero$octoking_d_1,
        "App.Kaelin.Heroes.Octoking.skills.ap_recover": App$Kaelin$Heroes$Octoking$skills$ap_recover,
        "App.Kaelin.Heroes.Octoking.skills": App$Kaelin$Heroes$Octoking$skills,
        "App.Kaelin.Heroes.Octoking.hero": App$Kaelin$Heroes$Octoking$hero,
        "App.Kaelin.Hero.info": App$Kaelin$Hero$info,
        "App.Kaelin.Tile.creature.create": App$Kaelin$Tile$creature$create,
        "App.Kaelin.Team.neutral": App$Kaelin$Team$neutral,
        "App.Kaelin.Map.init": App$Kaelin$Map$init,
        "App.Kaelin.Assets.tile.green_2": App$Kaelin$Assets$tile$green_2,
        "App.Kaelin.Assets.tile.effect.dark_red2": App$Kaelin$Assets$tile$effect$dark_red2,
        "App.Kaelin.Assets.tile.effect.light_red2": App$Kaelin$Assets$tile$effect$light_red2,
        "App.Kaelin.Assets.tile.effect.dark_blue2": App$Kaelin$Assets$tile$effect$dark_blue2,
        "App.Kaelin.Resources.terrains": App$Kaelin$Resources$terrains,
        "App.Kaelin.Terrain.new": App$Kaelin$Terrain$new,
        "App.Kaelin.Map.Entity.background": App$Kaelin$Map$Entity$background,
        "App.Kaelin.Map.arena": App$Kaelin$Map$arena,
        "App.EnvInfo.new": App$EnvInfo$new,
        "App.Kaelin.Internal.new": App$Kaelin$Internal$new,
        "Map.new": Map$new,
        "Parser.State.new": Parser$State$new,
        "Parser.run": Parser$run,
        "Parser.Reply": Parser$Reply,
        "Parser.Reply.error": Parser$Reply$error,
        "Parser.Error.new": Parser$Error$new,
        "Parser.Reply.fail": Parser$Reply$fail,
        "Nat.gtn": Nat$gtn,
        "Parser.Error.combine": Parser$Error$combine,
        "Parser.Error.maybe_combine": Parser$Error$maybe_combine,
        "Parser.Reply.value": Parser$Reply$value,
        "Parser.first_of.go": Parser$first_of$go,
        "Parser.first_of": Parser$first_of,
        Parser: Parser,
        "String.cons": String$cons,
        "String.concat": String$concat,
        "U16.eql": U16$eql,
        "String.nil": String$nil,
        "Parser.text.go": Parser$text$go,
        "Parser.text": Parser$text,
        "Parser.many.go": Parser$many$go,
        "Parser.many": Parser$many,
        "Parser.many1": Parser$many1,
        "Parser.hex_digit": Parser$hex_digit,
        "Nat.from_base.go": Nat$from_base$go,
        "List.reverse.go": List$reverse$go,
        "List.reverse": List$reverse,
        "Nat.from_base": Nat$from_base,
        "Parser.hex_nat": Parser$hex_nat,
        "Parser.digit": Parser$digit,
        "Parser.nat": Parser$nat,
        "Parser.maybe": Parser$maybe,
        "Parser.Number.new": Parser$Number$new,
        "Parser.num": Parser$num,
        "Nat.to_i32": Nat$to_i32,
        "I32.read": I32$read,
        "U32.sub": U32$sub,
        "String.eql": String$eql,
        "App.Kaelin.Coord.draft.arena_go": App$Kaelin$Coord$draft$arena_go,
        "App.Kaelin.Coord.draft.arena": App$Kaelin$Coord$draft$arena,
        "App.Kaelin.Stage.draft": App$Kaelin$Stage$draft,
        "App.Kaelin.Stage.init": App$Kaelin$Stage$init,
        "App.Store.new": App$Store$new,
        "App.State.new": App$State$new,
        "App.Kaelin.State": App$Kaelin$State,
        "App.Kaelin.State.local.new": App$Kaelin$State$local$new,
        "App.Kaelin.State.global.new": App$Kaelin$State$global$new,
        "U64.new": U64$new,
        "U64.from_nat": U64$from_nat,
        "App.Kaelin.App.init": App$Kaelin$App$init,
        "DOM.node": DOM$node,
        Map: Map,
        "Bits.concat": Bits$concat,
        "Word.to_bits": Word$to_bits,
        "U16.to_bits": U16$to_bits,
        "String.to_bits": String$to_bits,
        "Map.from_list": Map$from_list,
        "DOM.text": DOM$text,
        "App.Kaelin.Draw.init": App$Kaelin$Draw$init,
        "Pair.snd": Pair$snd,
        "Bits.reverse.tco": Bits$reverse$tco,
        "Bits.reverse": Bits$reverse,
        "BitsMap.to_list.go": BitsMap$to_list$go,
        "List.mapped": List$mapped,
        "Bits.show": Bits$show,
        "Map.to_list": Map$to_list,
        "Map.set": Map$set,
        "App.Kaelin.Resources.heroes": App$Kaelin$Resources$heroes,
        "Map.get": Map$get,
        "App.Kaelin.Coord.draft.to_team": App$Kaelin$Coord$draft$to_team,
        "App.Kaelin.Team.show": App$Kaelin$Team$show,
        "App.Kaelin.Coord.draft.to_map": App$Kaelin$Coord$draft$to_map,
        "Bits.to_nat": Bits$to_nat,
        "NatMap.to_list": NatMap$to_list,
        "Word.mod": Word$mod,
        "U32.mod": U32$mod,
        "App.Kaelin.Coord.Convert.nat_to_axial": App$Kaelin$Coord$Convert$nat_to_axial,
        "App.Kaelin.Constants.draft_hexagon_radius": App$Kaelin$Constants$draft_hexagon_radius,
        "F64.div": F64$div,
        "F64.parse": F64$parse,
        "F64.read": F64$read,
        "F64.add": F64$add,
        "F64.mul": F64$mul,
        "F64.make": F64$make,
        "F64.from_nat": F64$from_nat,
        "App.Kaelin.Coord.draft.to_xy": App$Kaelin$Coord$draft$to_xy,
        Either: Either,
        "Either.left": Either$left,
        "Either.right": Either$right,
        "Nat.sub_rem": Nat$sub_rem,
        "Nat.div_mod.go": Nat$div_mod$go,
        "Nat.div_mod": Nat$div_mod,
        "Nat.to_base.go": Nat$to_base$go,
        "Nat.to_base": Nat$to_base,
        "Nat.mod.go": Nat$mod$go,
        "Nat.mod": Nat$mod,
        "Nat.lte": Nat$lte,
        "List.at": List$at,
        "Nat.show_digit": Nat$show_digit,
        "Nat.to_string_base": Nat$to_string_base,
        "Nat.show": Nat$show,
        "App.Kaelin.Draw.draft.positions_go": App$Kaelin$Draw$draft$positions_go,
        "App.Kaelin.Draw.draft.positions": App$Kaelin$Draw$draft$positions,
        "App.Kaelin.Draw.draft.map_space": App$Kaelin$Draw$draft$map_space,
        "App.Kaelin.Draw.draft.map": App$Kaelin$Draw$draft$map,
        "BitsMap.delete": BitsMap$delete,
        "Map.delete": Map$delete,
        "App.Kaelin.Draw.draft.croni": App$Kaelin$Draw$draft$croni,
        "App.Kaelin.Draw.draft.player": App$Kaelin$Draw$draft$player,
        "App.Kaelin.Draw.draft.picks_left": App$Kaelin$Draw$draft$picks_left,
        "App.Kaelin.Team.eql": App$Kaelin$Team$eql,
        "List.length": List$length,
        "Nat.eql": Nat$eql,
        "Nat.for": Nat$for,
        "App.Kaelin.Draw.draft.ally": App$Kaelin$Draw$draft$ally,
        "App.Kaelin.Draw.draft.allies": App$Kaelin$Draw$draft$allies,
        "App.Kaelin.Draw.draft.picks_right": App$Kaelin$Draw$draft$picks_right,
        "App.Kaelin.Draw.draft.picks": App$Kaelin$Draw$draft$picks,
        "App.Kaelin.Draw.draft.top": App$Kaelin$Draw$draft$top,
        "App.Kaelin.Draw.draft.selection": App$Kaelin$Draw$draft$selection,
        "App.Kaelin.Draw.draft.bottom_left": App$Kaelin$Draw$draft$bottom_left,
        "App.Kaelin.Draw.draft.bottom_right": App$Kaelin$Draw$draft$bottom_right,
        "App.Kaelin.Draw.draft.bottom": App$Kaelin$Draw$draft$bottom,
        "App.Kaelin.Draw.draft.blue": App$Kaelin$Draw$draft$blue,
        "App.Kaelin.Draw.draft.red": App$Kaelin$Draw$draft$red,
        "App.Kaelin.Draw.draft.choose_team": App$Kaelin$Draw$draft$choose_team,
        "App.Kaelin.Draw.draft.main": App$Kaelin$Draw$draft$main,
        "App.Kaelin.Draw.draft": App$Kaelin$Draw$draft,
        "String.drop": String$drop,
        "List.head": List$head,
        "Char.eql": Char$eql,
        "String.starts_with": String$starts_with,
        "String.length.go": String$length$go,
        "String.length": String$length,
        "String.split.go": String$split$go,
        "String.split": String$split,
        "Word.abs": Word$abs,
        "Word.s_show": Word$s_show,
        "I32.show": I32$show,
        "Word.show": Word$show,
        "U64.show": U64$show,
        "App.Kaelin.Draw.game.round": App$Kaelin$Draw$game$round,
        "DOM.vbox": DOM$vbox,
        "App.Kaelin.Constants.hexagon_radius": App$Kaelin$Constants$hexagon_radius,
        "App.Kaelin.Constants.center_x": App$Kaelin$Constants$center_x,
        "App.Kaelin.Constants.center_y": App$Kaelin$Constants$center_y,
        "F64.sub": F64$sub,
        "App.Kaelin.Coord.round.floor": App$Kaelin$Coord$round$floor,
        "App.Kaelin.Coord.round.round_F64": App$Kaelin$Coord$round$round_F64,
        "Word.gtn": Word$gtn,
        "F64.gtn": F64$gtn,
        "App.Kaelin.Coord.round.diff": App$Kaelin$Coord$round$diff,
        "App.Kaelin.Coord.round": App$Kaelin$Coord$round,
        "App.Kaelin.Coord.to_axial": App$Kaelin$Coord$to_axial,
        "NatSet.has": NatSet$has,
        "App.Kaelin.Indicator.blue": App$Kaelin$Indicator$blue,
        "App.Kaelin.Draw.support.get_effect": App$Kaelin$Draw$support$get_effect,
        "App.Kaelin.Draw.support.area_of_effect": App$Kaelin$Draw$support$area_of_effect,
        "App.Kaelin.Draw.support.get_indicator": App$Kaelin$Draw$support$get_indicator,
        "App.Kaelin.Coord.to_screen_xy": App$Kaelin$Coord$to_screen_xy,
        "App.Kaelin.Draw.support.centralize": App$Kaelin$Draw$support$centralize,
        "VoxBox.get_len": VoxBox$get_len,
        "Array.get": Array$get,
        "Buffer32.get": Buffer32$get,
        "VoxBox.get_pos": VoxBox$get_pos,
        "VoxBox.get_col": VoxBox$get_col,
        "Word.and": Word$and,
        "U32.and": U32$and,
        "U32.shr": U32$shr,
        "VoxBox.Draw.image": VoxBox$Draw$image,
        "App.Kaelin.Draw.tile.background": App$Kaelin$Draw$tile$background,
        "App.Kaelin.Draw.hero": App$Kaelin$Draw$hero,
        "Int.neg": Int$neg,
        "Word.to_int": Word$to_int,
        "I32.to_int": I32$to_int,
        "Int.to_nat": Int$to_nat,
        "List.imap": List$imap,
        "List.indices.u32": List$indices$u32,
        "String.to_list": String$to_list,
        "U16.show_hex": U16$show_hex,
        "PixelFont.get_img": PixelFont$get_img,
        "Pos32.get_x": Pos32$get_x,
        "Pos32.get_y": Pos32$get_y,
        "Pos32.get_z": Pos32$get_z,
        "VoxBox.Draw.text.char": VoxBox$Draw$text$char,
        "Pos32.add": Pos32$add,
        "VoxBox.Draw.text": VoxBox$Draw$text,
        "PixelFont.set_img": PixelFont$set_img,
        "U16.new": U16$new,
        "Nat.to_u16": Nat$to_u16,
        "PixelFont.small_black.100": PixelFont$small_black$100,
        "PixelFont.small_black.101": PixelFont$small_black$101,
        "PixelFont.small_black.102": PixelFont$small_black$102,
        "PixelFont.small_black.103": PixelFont$small_black$103,
        "PixelFont.small_black.104": PixelFont$small_black$104,
        "PixelFont.small_black.105": PixelFont$small_black$105,
        "PixelFont.small_black.106": PixelFont$small_black$106,
        "PixelFont.small_black.107": PixelFont$small_black$107,
        "PixelFont.small_black.108": PixelFont$small_black$108,
        "PixelFont.small_black.109": PixelFont$small_black$109,
        "PixelFont.small_black.110": PixelFont$small_black$110,
        "PixelFont.small_black.111": PixelFont$small_black$111,
        "PixelFont.small_black.112": PixelFont$small_black$112,
        "PixelFont.small_black.113": PixelFont$small_black$113,
        "PixelFont.small_black.114": PixelFont$small_black$114,
        "PixelFont.small_black.115": PixelFont$small_black$115,
        "PixelFont.small_black.116": PixelFont$small_black$116,
        "PixelFont.small_black.117": PixelFont$small_black$117,
        "PixelFont.small_black.118": PixelFont$small_black$118,
        "PixelFont.small_black.119": PixelFont$small_black$119,
        "PixelFont.small_black.120": PixelFont$small_black$120,
        "PixelFont.small_black.121": PixelFont$small_black$121,
        "PixelFont.small_black.122": PixelFont$small_black$122,
        "PixelFont.small_black.123": PixelFont$small_black$123,
        "PixelFont.small_black.124": PixelFont$small_black$124,
        "PixelFont.small_black.125": PixelFont$small_black$125,
        "PixelFont.small_black.126": PixelFont$small_black$126,
        "PixelFont.small_black.32": PixelFont$small_black$32,
        "PixelFont.small_black.33": PixelFont$small_black$33,
        "PixelFont.small_black.34": PixelFont$small_black$34,
        "PixelFont.small_black.35": PixelFont$small_black$35,
        "PixelFont.small_black.36": PixelFont$small_black$36,
        "PixelFont.small_black.37": PixelFont$small_black$37,
        "PixelFont.small_black.38": PixelFont$small_black$38,
        "PixelFont.small_black.39": PixelFont$small_black$39,
        "PixelFont.small_black.40": PixelFont$small_black$40,
        "PixelFont.small_black.41": PixelFont$small_black$41,
        "PixelFont.small_black.42": PixelFont$small_black$42,
        "PixelFont.small_black.43": PixelFont$small_black$43,
        "PixelFont.small_black.44": PixelFont$small_black$44,
        "PixelFont.small_black.45": PixelFont$small_black$45,
        "PixelFont.small_black.46": PixelFont$small_black$46,
        "PixelFont.small_black.47": PixelFont$small_black$47,
        "PixelFont.small_black.48": PixelFont$small_black$48,
        "PixelFont.small_black.49": PixelFont$small_black$49,
        "PixelFont.small_black.50": PixelFont$small_black$50,
        "PixelFont.small_black.51": PixelFont$small_black$51,
        "PixelFont.small_black.52": PixelFont$small_black$52,
        "PixelFont.small_black.53": PixelFont$small_black$53,
        "PixelFont.small_black.54": PixelFont$small_black$54,
        "PixelFont.small_black.55": PixelFont$small_black$55,
        "PixelFont.small_black.56": PixelFont$small_black$56,
        "PixelFont.small_black.57": PixelFont$small_black$57,
        "PixelFont.small_black.58": PixelFont$small_black$58,
        "PixelFont.small_black.59": PixelFont$small_black$59,
        "PixelFont.small_black.60": PixelFont$small_black$60,
        "PixelFont.small_black.61": PixelFont$small_black$61,
        "PixelFont.small_black.62": PixelFont$small_black$62,
        "PixelFont.small_black.63": PixelFont$small_black$63,
        "PixelFont.small_black.64": PixelFont$small_black$64,
        "PixelFont.small_black.65": PixelFont$small_black$65,
        "PixelFont.small_black.66": PixelFont$small_black$66,
        "PixelFont.small_black.67": PixelFont$small_black$67,
        "PixelFont.small_black.68": PixelFont$small_black$68,
        "PixelFont.small_black.69": PixelFont$small_black$69,
        "PixelFont.small_black.70": PixelFont$small_black$70,
        "PixelFont.small_black.71": PixelFont$small_black$71,
        "PixelFont.small_black.72": PixelFont$small_black$72,
        "PixelFont.small_black.73": PixelFont$small_black$73,
        "PixelFont.small_black.74": PixelFont$small_black$74,
        "PixelFont.small_black.75": PixelFont$small_black$75,
        "PixelFont.small_black.76": PixelFont$small_black$76,
        "PixelFont.small_black.77": PixelFont$small_black$77,
        "PixelFont.small_black.78": PixelFont$small_black$78,
        "PixelFont.small_black.79": PixelFont$small_black$79,
        "PixelFont.small_black.80": PixelFont$small_black$80,
        "PixelFont.small_black.81": PixelFont$small_black$81,
        "PixelFont.small_black.82": PixelFont$small_black$82,
        "PixelFont.small_black.83": PixelFont$small_black$83,
        "PixelFont.small_black.84": PixelFont$small_black$84,
        "PixelFont.small_black.85": PixelFont$small_black$85,
        "PixelFont.small_black.86": PixelFont$small_black$86,
        "PixelFont.small_black.87": PixelFont$small_black$87,
        "PixelFont.small_black.88": PixelFont$small_black$88,
        "PixelFont.small_black.89": PixelFont$small_black$89,
        "PixelFont.small_black.90": PixelFont$small_black$90,
        "PixelFont.small_black.91": PixelFont$small_black$91,
        "PixelFont.small_black.92": PixelFont$small_black$92,
        "PixelFont.small_black.93": PixelFont$small_black$93,
        "PixelFont.small_black.94": PixelFont$small_black$94,
        "PixelFont.small_black.95": PixelFont$small_black$95,
        "PixelFont.small_black.96": PixelFont$small_black$96,
        "PixelFont.small_black.97": PixelFont$small_black$97,
        "PixelFont.small_black.98": PixelFont$small_black$98,
        "PixelFont.small_black.99": PixelFont$small_black$99,
        "PixelFont.small_black": PixelFont$small_black,
        "App.Kaelin.Draw.creature.hp": App$Kaelin$Draw$creature$hp,
        "App.Kaelin.Draw.creature.ap": App$Kaelin$Draw$creature$ap,
        "App.Kaelin.Draw.tile.creature": App$Kaelin$Draw$tile$creature,
        "Pair.fst": Pair$fst,
        "Nat.div": Nat$div,
        "List.get": List$get,
        "App.Kaelin.Draw.support.animation_frame": App$Kaelin$Draw$support$animation_frame,
        "App.Kaelin.Draw.tile.animation": App$Kaelin$Draw$tile$animation,
        "App.Kaelin.Draw.state.map": App$Kaelin$Draw$state$map,
        "App.Kaelin.Assets.tile.mouse_ui": App$Kaelin$Assets$tile$mouse_ui,
        "App.Kaelin.Draw.state.mouse_ui": App$Kaelin$Draw$state$mouse_ui,
        "App.Kaelin.Draw.map": App$Kaelin$Draw$map,
        "App.Kaelin.Map.find_players": App$Kaelin$Map$find_players,
        "App.Kaelin.Map.player.to_coord": App$Kaelin$Map$player$to_coord,
        "App.Kaelin.Map.player.info": App$Kaelin$Map$player$info,
        "List.find": List$find,
        "App.Kaelin.Skill.has_key": App$Kaelin$Skill$has_key,
        "App.Kaelin.Hero.skill.from_key": App$Kaelin$Hero$skill$from_key,
        "App.Kaelin.Coord.show": App$Kaelin$Coord$show,
        "U8.to_bits": U8$to_bits,
        "List.zip": List$zip,
        "Nat.to_u8": Nat$to_u8,
        "App.Kaelin.Event.Code.action": App$Kaelin$Event$Code$action,
        "String.repeat": String$repeat,
        "App.Kaelin.Event.Code.Hex.set_min_length": App$Kaelin$Event$Code$Hex$set_min_length,
        "App.Kaelin.Event.Code.Hex.format_hex": App$Kaelin$Event$Code$Hex$format_hex,
        "Bits.chunks_of.go": Bits$chunks_of$go,
        "Bits.chunks_of": Bits$chunks_of,
        "Function.flip": Function$flip,
        "Bits.to_hex_string": Bits$to_hex_string,
        "App.Kaelin.Event.Code.Hex.append": App$Kaelin$Event$Code$Hex$append,
        "U8.to_nat": U8$to_nat,
        "App.Kaelin.Event.Code.generate_hex": App$Kaelin$Event$Code$generate_hex,
        generate_hex: generate_hex,
        "App.Kaelin.Event.Code.create_hero": App$Kaelin$Event$Code$create_hero,
        "Hex_to_nat.parser": Hex_to_nat$parser,
        "App.Kaelin.Event.Code.Hex.to_nat": App$Kaelin$Event$Code$Hex$to_nat,
        "App.Kaelin.Resources.Action.to_bits": App$Kaelin$Resources$Action$to_bits,
        "App.Kaelin.Coord.Convert.axial_to_bits": App$Kaelin$Coord$Convert$axial_to_bits,
        "App.Kaelin.Event.Code.user_input": App$Kaelin$Event$Code$user_input,
        "App.Kaelin.Event.Code.exe_skill": App$Kaelin$Event$Code$exe_skill,
        "App.Kaelin.Team.code": App$Kaelin$Team$code,
        "App.Kaelin.Event.Code.save_skill": App$Kaelin$Event$Code$save_skill,
        "App.Kaelin.Event.Code.remove_skill": App$Kaelin$Event$Code$remove_skill,
        "App.Kaelin.Event.Code.draft_hero": App$Kaelin$Event$Code$draft_hero,
        "App.Kaelin.Event.Code.draft_coord": App$Kaelin$Event$Code$draft_coord,
        "App.Kaelin.Event.Code.draft_team": App$Kaelin$Event$Code$draft_team,
        "App.Kaelin.Event.serialize": App$Kaelin$Event$serialize,
        "App.Kaelin.Event.remove_skill": App$Kaelin$Event$remove_skill,
        remove_button: remove_button,
        "App.Kaelin.Draw.game.skill_list": App$Kaelin$Draw$game$skill_list,
        "App.Kaelin.Draw.game": App$Kaelin$Draw$game,
        "App.Kaelin.App.draw": App$Kaelin$App$draw,
        IO: IO,
        "App.State.local": App$State$local,
        "String.map": String$map,
        "U16.gte": U16$gte,
        "U16.lte": U16$lte,
        "U16.add": U16$add,
        "Char.to_lower": Char$to_lower,
        "String.to_lower": String$to_lower,
        "IO.ask": IO$ask,
        "IO.bind": IO$bind,
        "IO.end": IO$end,
        "IO.monad": IO$monad,
        "App.set_local": App$set_local,
        "App.pass": App$pass,
        "Nat.read": Nat$read,
        "IO.get_time": IO$get_time,
        "Nat.random": Nat$random,
        "IO.random": IO$random,
        "IO.do": IO$do,
        "App.do": App$do,
        "App.watch": App$watch,
        "App.new_post": App$new_post,
        "App.Kaelin.Event.to_draft": App$Kaelin$Event$to_draft,
        "Debug.log": Debug$log,
        "App.Kaelin.Event.draft_coord": App$Kaelin$Event$draft_coord,
        "U8.add": U8$add,
        "App.Kaelin.Hero.info.map_go": App$Kaelin$Hero$info$map_go,
        "App.Kaelin.Hero.info.map": App$Kaelin$Hero$info$map,
        "App.Kaelin.Event.draft_hero": App$Kaelin$Event$draft_hero,
        "App.Kaelin.Event.draft_end": App$Kaelin$Event$draft_end,
        "App.Kaelin.Event.draft_team": App$Kaelin$Event$draft_team,
        "U64.to_nat": U64$to_nat,
        "App.Kaelin.Action.local.set_internal": App$Kaelin$Action$local$set_internal,
        "App.Kaelin.Action.local.env_info": App$Kaelin$Action$local$env_info,
        "App.Kaelin.Effect.indicators.get_indicators": App$Kaelin$Effect$indicators$get_indicators,
        "App.Kaelin.CastInfo.local.new": App$Kaelin$CastInfo$local$new,
        "App.Kaelin.Action.local.area": App$Kaelin$Action$local$area,
        "App.Kaelin.Event.save_skill": App$Kaelin$Event$save_skill,
        "App.Kaelin.Event.create_hero": App$Kaelin$Event$create_hero,
        "NatSet.new": NatSet$new,
        "NatSet.set": NatSet$set,
        "NatSet.from_list": NatSet$from_list,
        "App.Kaelin.Coord.range_natset": App$Kaelin$Coord$range_natset,
        "App.Kaelin.CastInfo.start": App$Kaelin$CastInfo$start,
        "App.Kaelin.Action.local.set_cast": App$Kaelin$Action$local$set_cast,
        "App.Kaelin.App.when": App$Kaelin$App$when,
        "U64.add": U64$add,
        "U64.sub": U64$sub,
        "Nat.to_u64": Nat$to_u64,
        "U64.div": U64$div,
        "U64.mul": U64$mul,
        "U64.gte": U64$gte,
        "App.Kaelin.Stage.action": App$Kaelin$Stage$action,
        "App.Kaelin.Stage.planning": App$Kaelin$Stage$planning,
        "App.Kaelin.Action.global.exe_skill": App$Kaelin$Action$global$exe_skill,
        "App.Kaelin.Action.global.exe_skills_list": App$Kaelin$Action$global$exe_skills_list,
        "App.Kaelin.Tile.creature.restore_ap": App$Kaelin$Tile$creature$restore_ap,
        "App.Kaelin.Map.creature.restore_all_ap": App$Kaelin$Map$creature$restore_all_ap,
        "App.Kaelin.Stage.action.end": App$Kaelin$Stage$action$end,
        "App.Kaelin.App.tick": App$Kaelin$App$tick,
        "App.Kaelin.Event.Buffer.monad.run": App$Kaelin$Event$Buffer$monad$run,
        "Parser.fail": Parser$fail,
        "Parser.one": Parser$one,
        "Char.to_string": Char$to_string,
        "Parser.drop.go": Parser$drop$go,
        "Parser.ignore": Parser$ignore,
        "App.Kaelin.Event.Buffer.monad.pure": App$Kaelin$Event$Buffer$monad$pure,
        "App.Kaelin.Event.Buffer.hex": App$Kaelin$Event$Buffer$hex,
        "App.Kaelin.Event.Buffer.next": App$Kaelin$Event$Buffer$next,
        "App.Kaelin.Event.Buffer.push": App$Kaelin$Event$Buffer$push,
        "App.Kaelin.Event.Buffer.fail": App$Kaelin$Event$Buffer$fail,
        "App.Kaelin.Event.Buffer.monad.bind": App$Kaelin$Event$Buffer$monad$bind,
        "App.Kaelin.Event.Buffer.monad": App$Kaelin$Event$Buffer$monad,
        "App.Kaelin.Event.Buffer": App$Kaelin$Event$Buffer,
        "App.Kaelin.Action.walk": App$Kaelin$Action$walk,
        "App.Kaelin.Action.ability_0": App$Kaelin$Action$ability_0,
        "App.Kaelin.Action.ability_1": App$Kaelin$Action$ability_1,
        "App.Kaelin.Resources.Action.to_action": App$Kaelin$Resources$Action$to_action,
        "App.Kaelin.Event.user_input": App$Kaelin$Event$user_input,
        "App.Kaelin.Event.exe_skill": App$Kaelin$Event$exe_skill,
        "App.Kaelin.Team.red": App$Kaelin$Team$red,
        "App.Kaelin.Team.blue": App$Kaelin$Team$blue,
        "App.Kaelin.Team.decode": App$Kaelin$Team$decode,
        "App.Kaelin.Event.end_action": App$Kaelin$Event$end_action,
        "App.Kaelin.Event.deserialize_scheme": App$Kaelin$Event$deserialize_scheme,
        "App.Kaelin.Event.deserialize": App$Kaelin$Event$deserialize,
        "App.State.global": App$State$global,
        "App.Kaelin.Action.create_player": App$Kaelin$Action$create_player,
        "App.Kaelin.CastInfo.global.new": App$Kaelin$CastInfo$global$new,
        "App.Kaelin.Action.global.save_skill": App$Kaelin$Action$global$save_skill,
        "List.delete_by": List$delete_by,
        "List.all": List$all,
        "Function.id": Function$id,
        "App.Kaelin.CastInfo.global.eql": App$Kaelin$CastInfo$global$eql,
        "App.Kaelin.Action.global.remove_skill": App$Kaelin$Action$global$remove_skill,
        "App.Kaelin.DraftInfo.new": App$Kaelin$DraftInfo$new,
        "App.Kaelin.Action.draft_hero": App$Kaelin$Action$draft_hero,
        "App.Kaelin.Action.draft_coord": App$Kaelin$Action$draft_coord,
        "App.Kaelin.Coord.draft.start_game": App$Kaelin$Coord$draft$start_game,
        "App.Kaelin.Action.draft_end": App$Kaelin$Action$draft_end,
        "App.Kaelin.Action.to_draft": App$Kaelin$Action$to_draft,
        "App.Kaelin.Action.draft_team": App$Kaelin$Action$draft_team,
        "App.Kaelin.App.post": App$Kaelin$App$post,
        "App.new": App$new,
        "App.Kaelin": App$Kaelin
    };
}();
