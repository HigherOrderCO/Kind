(self["webpackChunkkind_web"] = self["webpackChunkkind_web"] || []).push([[373],{

/***/ 373:
/***/ ((module) => {

module.exports = (function() {
    function int_pos(i) {
        return i >= 0n ? i : 0n;
    };

    function int_neg(i) {
        return i < 0n ? -i : 0n;
    };

    function word_to_u16(w) {
        var u = 0;
        for (var i = 0; i < 16; ++i) {
            u = u | (w._ === 'Word.i' ? 1 << i : 0);
            w = w.pred;
        };
        return u;
    };

    function u16_to_word(u) {
        var w = {
            _: 'Word.e'
        };
        for (var i = 0; i < 16; ++i) {
            w = {
                _: (u >>> (16 - i - 1)) & 1 ? 'Word.i' : 'Word.o',
                pred: w
            };
        };
        return w;
    };

    function u16_to_bits(x) {
        var s = '';
        for (var i = 0; i < 16; ++i) {
            s = (x & 1 ? '1' : '0') + s;
            x = x >>> 1;
        }
        return s;
    };

    function word_to_u32(w) {
        var u = 0;
        for (var i = 0; i < 32; ++i) {
            u = u | (w._ === 'Word.i' ? 1 << i : 0);
            w = w.pred;
        };
        return u;
    };

    function u32_to_word(u) {
        var w = {
            _: 'Word.e'
        };
        for (var i = 0; i < 32; ++i) {
            w = {
                _: (u >>> (32 - i - 1)) & 1 ? 'Word.i' : 'Word.o',
                pred: w
            };
        };
        return w;
    };

    function u32_for(state, from, til, func) {
        for (var i = from; i < til; ++i) {
            state = func(i)(state);
        }
        return state;
    };

    function word_to_i32(w) {
        var u = 0;
        for (var i = 0; i < 32; ++i) {
            u = u | (w._ === 'Word.i' ? 1 << i : 0);
            w = w.pred;
        };
        return u;
    };

    function i32_to_word(u) {
        var w = {
            _: 'Word.e'
        };
        for (var i = 0; i < 32; ++i) {
            w = {
                _: (u >> (32 - i - 1)) & 1 ? 'Word.i' : 'Word.o',
                pred: w
            };
        };
        return w;
    };

    function i32_for(state, from, til, func) {
        for (var i = from; i < til; ++i) {
            state = func(i)(state);
        }
        return state;
    };

    function word_to_u64(w) {
        var u = 0n;
        for (var i = 0n; i < 64n; i += 1n) {
            u = u | (w._ === 'Word.i' ? 1n << i : 0n);
            w = w.pred;
        };
        return u;
    };

    function u64_to_word(u) {
        var w = {
            _: 'Word.e'
        };
        for (var i = 0n; i < 64n; i += 1n) {
            w = {
                _: (u >> (64n - i - 1n)) & 1n ? 'Word.i' : 'Word.o',
                pred: w
            };
        };
        return w;
    };
    var f64 = new Float64Array(1);
    var u32 = new Uint32Array(f64.buffer);

    function f64_get_bit(x, i) {
        f64[0] = x;
        if (i < 32) {
            return (u32[0] >>> i) & 1;
        } else {
            return (u32[1] >>> (i - 32)) & 1;
        }
    };

    function f64_set_bit(x, i) {
        f64[0] = x;
        if (i < 32) {
            u32[0] = u32[0] | (1 << i);
        } else {
            u32[1] = u32[1] | (1 << (i - 32));
        }
        return f64[0];
    };

    function word_to_f64(w) {
        var x = 0;
        for (var i = 0; i < 64; ++i) {
            x = w._ === 'Word.i' ? f64_set_bit(x, i) : x;
            w = w.pred;
        };
        return x;
    };

    function f64_to_word(x) {
        var w = {
            _: 'Word.e'
        };
        for (var i = 0; i < 64; ++i) {
            w = {
                _: f64_get_bit(x, 64 - i - 1) ? 'Word.i' : 'Word.o',
                pred: w
            };
        };
        return w;
    };

    function f64_make(s, a, b) {
        return (s ? 1 : -1) * Number(a) / 10 ** Number(b);
    };

    function u32array_to_buffer32(a) {
        function go(a, buffer) {
            switch (a._) {
                case 'Array.tip':
                    buffer.push(a.value);
                    break;
                case 'Array.tie':
                    go(a.lft, buffer);
                    go(a.rgt, buffer);
                    break;
            }
            return buffer;
        };
        return new Uint32Array(go(a, []));
    };

    function buffer32_to_u32array(b) {
        function go(b) {
            if (b.length === 1) {
                return {
                    _: 'Array.tip',
                    value: b[0]
                };
            } else {
                var lft = go(b.slice(0, b.length / 2));
                var rgt = go(b.slice(b.length / 2));
                return {
                    _: 'Array.tie',
                    lft,
                    rgt
                };
            };
        };
        return go(b);
    };

    function buffer32_to_depth(b) {
        return BigInt(Math.log(b.length) / Math.log(2));
    };
    var bitsmap_new = {
        _: 'BitsMap.new'
    };
    var bitsmap_tie = function(val, lft, rgt) {
        return {
            _: 'BitsMap.tip',
            val,
            lft,
            rgt
        };
    }
    var maybe_none = {
        _: 'Maybe.none'
    };
    var maybe_some = function(value) {
        return {
            _: 'Maybe.some',
            value
        };
    }
    var bitsmap_get = function(bits, map) {
        for (var i = bits.length - 1; i >= 0; --i) {
            if (map._ !== 'BitsMap.new') {
                map = bits[i] === '0' ? map.lft : map.rgt;
            }
        }
        return map._ === 'BitsMap.new' ? maybe_none : map.val;
    }
    var bitsmap_set = function(bits, val, map, mode) {
        var res = {
            value: map
        };
        var key = 'value';
        var obj = res;
        for (var i = bits.length - 1; i >= 0; --i) {
            var map = obj[key];
            if (map._ === 'BitsMap.new') {
                obj[key] = {
                    _: 'BitsMap.tie',
                    val: maybe_none,
                    lft: bitsmap_new,
                    rgt: bitsmap_new
                };
            } else {
                obj[key] = {
                    _: 'BitsMap.tie',
                    val: map.val,
                    lft: map.lft,
                    rgt: map.rgt
                };
            }
            obj = obj[key];
            key = bits[i] === '0' ? 'lft' : 'rgt';
        }
        var map = obj[key];
        if (map._ === 'BitsMap.new') {
            var x = mode === 'del' ? maybe_none : {
                _: 'Maybe.some',
                value: val
            };
            obj[key] = {
                _: 'BitsMap.tie',
                val: x,
                lft: bitsmap_new,
                rgt: bitsmap_new
            };
        } else {
            var x = mode === 'set' ? {
                _: 'Maybe.some',
                value: val
            } : mode === 'del' ? maybe_none : map.val;
            obj[key] = {
                _: 'BitsMap.tie',
                val: x,
                lft: map.lft,
                rgt: map.rgt
            };
        }
        return res.value;
    };
    var list_for = list => nil => cons => {
        while (list._ !== 'List.nil') {
            nil = cons(list.head)(nil);
            list = list.tail;
        }
        return nil;
    };
    const inst_unit = x => x(null);
    const elim_unit = (x => {
        var $1 = (() => c0 => {
            var self = x;
            switch ("unit") {
                case 'unit':
                    var $0 = c0;
                    return $0;
            };
        })();
        return $1;
    });
    const inst_bool = x => x(true)(false);
    const elim_bool = (x => {
        var $4 = (() => c0 => c1 => {
            var self = x;
            if (self) {
                var $2 = c0;
                return $2;
            } else {
                var $3 = c1;
                return $3;
            };
        })();
        return $4;
    });
    const inst_nat = x => x(0n)(x0 => 1n + x0);
    const elim_nat = (x => {
        var $8 = (() => c0 => c1 => {
            var self = x;
            if (self === 0n) {
                var $5 = c0;
                return $5;
            } else {
                var $6 = (self - 1n);
                var $7 = c1($6);
                return $7;
            };
        })();
        return $8;
    });
    const inst_int = x => x(x0 => x1 => x0 - x1);
    const elim_int = (x => {
        var $12 = (() => c0 => {
            var self = x;
            switch ("new") {
                case 'new':
                    var $9 = int_pos(self);
                    var $10 = int_neg(self);
                    var $11 = c0($9)($10);
                    return $11;
            };
        })();
        return $12;
    });
    const inst_bits = x => x('')(x0 => x0 + '0')(x0 => x0 + '1');
    const elim_bits = (x => {
        var $18 = (() => c0 => c1 => c2 => {
            var self = x;
            switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                case 'o':
                    var $13 = self.slice(0, -1);
                    var $14 = c1($13);
                    return $14;
                case 'i':
                    var $15 = self.slice(0, -1);
                    var $16 = c2($15);
                    return $16;
                case 'e':
                    var $17 = c0;
                    return $17;
            };
        })();
        return $18;
    });
    const inst_u16 = x => x(x0 => word_to_u16(x0));
    const elim_u16 = (x => {
        var $21 = (() => c0 => {
            var self = x;
            switch ('u16') {
                case 'u16':
                    var $19 = u16_to_word(self);
                    var $20 = c0($19);
                    return $20;
            };
        })();
        return $21;
    });
    const inst_u32 = x => x(x0 => word_to_u32(x0));
    const elim_u32 = (x => {
        var $24 = (() => c0 => {
            var self = x;
            switch ('u32') {
                case 'u32':
                    var $22 = u32_to_word(self);
                    var $23 = c0($22);
                    return $23;
            };
        })();
        return $24;
    });
    const inst_i32 = x => x(x0 => word_to_i32(x0));
    const elim_i32 = (x => {
        var $27 = (() => c0 => {
            var self = x;
            switch ('i32') {
                case 'i32':
                    var $25 = i32_to_word(self);
                    var $26 = c0($25);
                    return $26;
            };
        })();
        return $27;
    });
    const inst_u64 = x => x(x0 => word_to_u64(x0));
    const elim_u64 = (x => {
        var $30 = (() => c0 => {
            var self = x;
            switch ('u64') {
                case 'u64':
                    var $28 = u64_to_word(self);
                    var $29 = c0($28);
                    return $29;
            };
        })();
        return $30;
    });
    const inst_f64 = x => x(x0 => word_to_f64(x0));
    const elim_f64 = (x => {
        var $33 = (() => c0 => {
            var self = x;
            switch ('f64') {
                case 'f64':
                    var $31 = f64_to_word(self);
                    var $32 = c0($31);
                    return $32;
            };
        })();
        return $33;
    });
    const inst_string = x => x('')(x0 => x1 => (String.fromCharCode(x0) + x1));
    const elim_string = (x => {
        var $38 = (() => c0 => c1 => {
            var self = x;
            if (self.length === 0) {
                var $34 = c0;
                return $34;
            } else {
                var $35 = self.charCodeAt(0);
                var $36 = self.slice(1);
                var $37 = c1($35)($36);
                return $37;
            };
        })();
        return $38;
    });
    const inst_buffer32 = x => x(x0 => x1 => u32array_to_buffer32(x1));
    const elim_buffer32 = (x => {
        var $42 = (() => c0 => {
            var self = x;
            switch ('b32') {
                case 'b32':
                    var $39 = buffer32_to_depth(self);
                    var $40 = buffer32_to_u32array(self);
                    var $41 = c0($39)($40);
                    return $41;
            };
        })();
        return $42;
    });

    function Buffer32$new$(_depth$1, _array$2) {
        var $43 = u32array_to_buffer32(_array$2);
        return $43;
    };
    const Buffer32$new = x0 => x1 => Buffer32$new$(x0, x1);

    function Array$(_A$1, _depth$2) {
        var $44 = null;
        return $44;
    };
    const Array = x0 => x1 => Array$(x0, x1);

    function Array$tip$(_value$2) {
        var $45 = ({
            _: 'Array.tip',
            'value': _value$2
        });
        return $45;
    };
    const Array$tip = x0 => Array$tip$(x0);

    function Array$tie$(_lft$3, _rgt$4) {
        var $46 = ({
            _: 'Array.tie',
            'lft': _lft$3,
            'rgt': _rgt$4
        });
        return $46;
    };
    const Array$tie = x0 => x1 => Array$tie$(x0, x1);

    function Array$alloc$(_depth$2, _x$3) {
        var self = _depth$2;
        if (self === 0n) {
            var $48 = Array$tip$(_x$3);
            var $47 = $48;
        } else {
            var $49 = (self - 1n);
            var _half$5 = Array$alloc$($49, _x$3);
            var $50 = Array$tie$(_half$5, _half$5);
            var $47 = $50;
        };
        return $47;
    };
    const Array$alloc = x0 => x1 => Array$alloc$(x0, x1);

    function U32$new$(_value$1) {
        var $51 = word_to_u32(_value$1);
        return $51;
    };
    const U32$new = x0 => U32$new$(x0);

    function Word$(_size$1) {
        var $52 = null;
        return $52;
    };
    const Word = x0 => Word$(x0);
    const Word$e = ({
        _: 'Word.e'
    });

    function Word$o$(_pred$2) {
        var $53 = ({
            _: 'Word.o',
            'pred': _pred$2
        });
        return $53;
    };
    const Word$o = x0 => Word$o$(x0);

    function Word$zero$(_size$1) {
        var self = _size$1;
        if (self === 0n) {
            var $55 = Word$e;
            var $54 = $55;
        } else {
            var $56 = (self - 1n);
            var $57 = Word$o$(Word$zero$($56));
            var $54 = $57;
        };
        return $54;
    };
    const Word$zero = x0 => Word$zero$(x0);

    function Nat$succ$(_pred$1) {
        var $58 = 1n + _pred$1;
        return $58;
    };
    const Nat$succ = x0 => Nat$succ$(x0);
    const Nat$zero = 0n;
    const U32$zero = U32$new$(Word$zero$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$zero))))))))))))))))))))))))))))))))));
    const Buffer32$alloc = a0 => (new Uint32Array(2 ** Number(a0)));

    function Word$bit_length$go$(_word$2, _c$3, _n$4) {
        var Word$bit_length$go$ = (_word$2, _c$3, _n$4) => ({
            ctr: 'TCO',
            arg: [_word$2, _c$3, _n$4]
        });
        var Word$bit_length$go = _word$2 => _c$3 => _n$4 => Word$bit_length$go$(_word$2, _c$3, _n$4);
        var arg = [_word$2, _c$3, _n$4];
        while (true) {
            let [_word$2, _c$3, _n$4] = arg;
            var R = (() => {
                var self = _word$2;
                switch (self._) {
                    case 'Word.o':
                        var $59 = self.pred;
                        var $60 = Word$bit_length$go$($59, Nat$succ$(_c$3), _n$4);
                        return $60;
                    case 'Word.i':
                        var $61 = self.pred;
                        var $62 = Word$bit_length$go$($61, Nat$succ$(_c$3), Nat$succ$(_c$3));
                        return $62;
                    case 'Word.e':
                        var $63 = _n$4;
                        return $63;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Word$bit_length$go = x0 => x1 => x2 => Word$bit_length$go$(x0, x1, x2);

    function Word$bit_length$(_word$2) {
        var $64 = Word$bit_length$go$(_word$2, 0n, 0n);
        return $64;
    };
    const Word$bit_length = x0 => Word$bit_length$(x0);

    function U32$bit_length$(_size$1) {
        var self = _size$1;
        switch ('u32') {
            case 'u32':
                var $66 = u32_to_word(self);
                var $67 = Word$bit_length$($66);
                var $65 = $67;
                break;
        };
        return $65;
    };
    const U32$bit_length = x0 => U32$bit_length$(x0);

    function Word$i$(_pred$2) {
        var $68 = ({
            _: 'Word.i',
            'pred': _pred$2
        });
        return $68;
    };
    const Word$i = x0 => Word$i$(x0);
    const Bool$false = false;
    const Bool$true = true;

    function Word$shift_left$one$go$(_word$2, _prev$3) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $70 = self.pred;
                var self = _prev$3;
                if (self) {
                    var $72 = Word$i$(Word$shift_left$one$go$($70, Bool$false));
                    var $71 = $72;
                } else {
                    var $73 = Word$o$(Word$shift_left$one$go$($70, Bool$false));
                    var $71 = $73;
                };
                var $69 = $71;
                break;
            case 'Word.i':
                var $74 = self.pred;
                var self = _prev$3;
                if (self) {
                    var $76 = Word$i$(Word$shift_left$one$go$($74, Bool$true));
                    var $75 = $76;
                } else {
                    var $77 = Word$o$(Word$shift_left$one$go$($74, Bool$true));
                    var $75 = $77;
                };
                var $69 = $75;
                break;
            case 'Word.e':
                var $78 = Word$e;
                var $69 = $78;
                break;
        };
        return $69;
    };
    const Word$shift_left$one$go = x0 => x1 => Word$shift_left$one$go$(x0, x1);

    function Word$shift_left$one$(_word$2) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $80 = self.pred;
                var $81 = Word$o$(Word$shift_left$one$go$($80, Bool$false));
                var $79 = $81;
                break;
            case 'Word.i':
                var $82 = self.pred;
                var $83 = Word$o$(Word$shift_left$one$go$($82, Bool$true));
                var $79 = $83;
                break;
            case 'Word.e':
                var $84 = Word$e;
                var $79 = $84;
                break;
        };
        return $79;
    };
    const Word$shift_left$one = x0 => Word$shift_left$one$(x0);

    function Word$shift_left$(_n$2, _value$3) {
        var Word$shift_left$ = (_n$2, _value$3) => ({
            ctr: 'TCO',
            arg: [_n$2, _value$3]
        });
        var Word$shift_left = _n$2 => _value$3 => Word$shift_left$(_n$2, _value$3);
        var arg = [_n$2, _value$3];
        while (true) {
            let [_n$2, _value$3] = arg;
            var R = (() => {
                var self = _n$2;
                if (self === 0n) {
                    var $85 = _value$3;
                    return $85;
                } else {
                    var $86 = (self - 1n);
                    var $87 = Word$shift_left$($86, Word$shift_left$one$(_value$3));
                    return $87;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Word$shift_left = x0 => x1 => Word$shift_left$(x0, x1);

    function Word$adder$(_a$2, _b$3, _c$4) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $89 = self.pred;
                var $90 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $92 = self.pred;
                            var $93 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $95 = Word$i$(Word$adder$(_a$pred$10, $92, Bool$false));
                                    var $94 = $95;
                                } else {
                                    var $96 = Word$o$(Word$adder$(_a$pred$10, $92, Bool$false));
                                    var $94 = $96;
                                };
                                return $94;
                            });
                            var $91 = $93;
                            break;
                        case 'Word.i':
                            var $97 = self.pred;
                            var $98 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $100 = Word$o$(Word$adder$(_a$pred$10, $97, Bool$true));
                                    var $99 = $100;
                                } else {
                                    var $101 = Word$i$(Word$adder$(_a$pred$10, $97, Bool$false));
                                    var $99 = $101;
                                };
                                return $99;
                            });
                            var $91 = $98;
                            break;
                        case 'Word.e':
                            var $102 = (_a$pred$8 => {
                                var $103 = Word$e;
                                return $103;
                            });
                            var $91 = $102;
                            break;
                    };
                    var $91 = $91($89);
                    return $91;
                });
                var $88 = $90;
                break;
            case 'Word.i':
                var $104 = self.pred;
                var $105 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $107 = self.pred;
                            var $108 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $110 = Word$o$(Word$adder$(_a$pred$10, $107, Bool$true));
                                    var $109 = $110;
                                } else {
                                    var $111 = Word$i$(Word$adder$(_a$pred$10, $107, Bool$false));
                                    var $109 = $111;
                                };
                                return $109;
                            });
                            var $106 = $108;
                            break;
                        case 'Word.i':
                            var $112 = self.pred;
                            var $113 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $115 = Word$i$(Word$adder$(_a$pred$10, $112, Bool$true));
                                    var $114 = $115;
                                } else {
                                    var $116 = Word$o$(Word$adder$(_a$pred$10, $112, Bool$true));
                                    var $114 = $116;
                                };
                                return $114;
                            });
                            var $106 = $113;
                            break;
                        case 'Word.e':
                            var $117 = (_a$pred$8 => {
                                var $118 = Word$e;
                                return $118;
                            });
                            var $106 = $117;
                            break;
                    };
                    var $106 = $106($104);
                    return $106;
                });
                var $88 = $105;
                break;
            case 'Word.e':
                var $119 = (_b$5 => {
                    var $120 = Word$e;
                    return $120;
                });
                var $88 = $119;
                break;
        };
        var $88 = $88(_b$3);
        return $88;
    };
    const Word$adder = x0 => x1 => x2 => Word$adder$(x0, x1, x2);

    function Word$add$(_a$2, _b$3) {
        var $121 = Word$adder$(_a$2, _b$3, Bool$false);
        return $121;
    };
    const Word$add = x0 => x1 => Word$add$(x0, x1);

    function Word$mul$go$(_a$3, _b$4, _acc$5) {
        var Word$mul$go$ = (_a$3, _b$4, _acc$5) => ({
            ctr: 'TCO',
            arg: [_a$3, _b$4, _acc$5]
        });
        var Word$mul$go = _a$3 => _b$4 => _acc$5 => Word$mul$go$(_a$3, _b$4, _acc$5);
        var arg = [_a$3, _b$4, _acc$5];
        while (true) {
            let [_a$3, _b$4, _acc$5] = arg;
            var R = (() => {
                var self = _a$3;
                switch (self._) {
                    case 'Word.o':
                        var $122 = self.pred;
                        var $123 = Word$mul$go$($122, Word$shift_left$(1n, _b$4), _acc$5);
                        return $123;
                    case 'Word.i':
                        var $124 = self.pred;
                        var $125 = Word$mul$go$($124, Word$shift_left$(1n, _b$4), Word$add$(_b$4, _acc$5));
                        return $125;
                    case 'Word.e':
                        var $126 = _acc$5;
                        return $126;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Word$mul$go = x0 => x1 => x2 => Word$mul$go$(x0, x1, x2);

    function Word$to_zero$(_word$2) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $128 = self.pred;
                var $129 = Word$o$(Word$to_zero$($128));
                var $127 = $129;
                break;
            case 'Word.i':
                var $130 = self.pred;
                var $131 = Word$o$(Word$to_zero$($130));
                var $127 = $131;
                break;
            case 'Word.e':
                var $132 = Word$e;
                var $127 = $132;
                break;
        };
        return $127;
    };
    const Word$to_zero = x0 => Word$to_zero$(x0);

    function Word$mul$(_a$2, _b$3) {
        var $133 = Word$mul$go$(_a$2, _b$3, Word$to_zero$(_a$2));
        return $133;
    };
    const Word$mul = x0 => x1 => Word$mul$(x0, x1);
    const U32$mul = a0 => a1 => ((a0 * a1) >>> 0);

    function Nat$apply$(_n$2, _f$3, _x$4) {
        var Nat$apply$ = (_n$2, _f$3, _x$4) => ({
            ctr: 'TCO',
            arg: [_n$2, _f$3, _x$4]
        });
        var Nat$apply = _n$2 => _f$3 => _x$4 => Nat$apply$(_n$2, _f$3, _x$4);
        var arg = [_n$2, _f$3, _x$4];
        while (true) {
            let [_n$2, _f$3, _x$4] = arg;
            var R = (() => {
                var self = _n$2;
                if (self === 0n) {
                    var $134 = _x$4;
                    return $134;
                } else {
                    var $135 = (self - 1n);
                    var $136 = Nat$apply$($135, _f$3, _f$3(_x$4));
                    return $136;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Nat$apply = x0 => x1 => x2 => Nat$apply$(x0, x1, x2);

    function Word$inc$(_word$2) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $138 = self.pred;
                var $139 = Word$i$($138);
                var $137 = $139;
                break;
            case 'Word.i':
                var $140 = self.pred;
                var $141 = Word$o$(Word$inc$($140));
                var $137 = $141;
                break;
            case 'Word.e':
                var $142 = Word$e;
                var $137 = $142;
                break;
        };
        return $137;
    };
    const Word$inc = x0 => Word$inc$(x0);

    function Nat$to_word$(_size$1, _n$2) {
        var $143 = Nat$apply$(_n$2, Word$inc, Word$zero$(_size$1));
        return $143;
    };
    const Nat$to_word = x0 => x1 => Nat$to_word$(x0, x1);
    const Nat$to_u32 = a0 => (Number(a0) >>> 0);

    function VoxBox$new$(_length$1, _capacity$2, _buffer$3) {
        var $144 = ({
            _: 'VoxBox.new',
            'length': _length$1,
            'capacity': _capacity$2,
            'buffer': _buffer$3
        });
        return $144;
    };
    const VoxBox$new = x0 => x1 => x2 => VoxBox$new$(x0, x1, x2);

    function VoxBox$alloc_capacity$(_capacity$1) {
        var _buffer$2 = (new Uint32Array(2 ** Number(U32$bit_length$(((2 * _capacity$1) >>> 0)))));
        var $145 = VoxBox$new$(0, _capacity$1, _buffer$2);
        return $145;
    };
    const VoxBox$alloc_capacity = x0 => VoxBox$alloc_capacity$(x0);

    function App$Store$new$(_local$2, _global$3) {
        var $146 = ({
            _: 'App.Store.new',
            'local': _local$2,
            'global': _global$3
        });
        return $146;
    };
    const App$Store$new = x0 => x1 => App$Store$new$(x0, x1);

    function Pair$new$(_fst$3, _snd$4) {
        var $147 = ({
            _: 'Pair.new',
            'fst': _fst$3,
            'snd': _snd$4
        });
        return $147;
    };
    const Pair$new = x0 => x1 => Pair$new$(x0, x1);
    const App$State$new = Pair$new$(null, null);
    const App$TicTacToe$State = App$State$new;

    function App$TicTacToe$State$local$new$(_board$1, _info$2) {
        var $148 = ({
            _: 'App.TicTacToe.State.local.new',
            'board': _board$1,
            'info': _info$2
        });
        return $148;
    };
    const App$TicTacToe$State$local$new = x0 => x1 => App$TicTacToe$State$local$new$(x0, x1);

    function Vector$(_A$1, _len$2) {
        var $149 = null;
        return $149;
    };
    const Vector = x0 => x1 => Vector$(x0, x1);

    function Vector$nil$(_A$1, _self$2, _nil$3) {
        var $150 = _nil$3;
        return $150;
    };
    const Vector$nil = x0 => x1 => x2 => Vector$nil$(x0, x1, x2);

    function Vector$cons$(_A$1, _len$2, _head$3, _tail$4, _self$5, _cons$6) {
        var $151 = _cons$6(_head$3)(_tail$4);
        return $151;
    };
    const Vector$cons = x0 => x1 => x2 => x3 => x4 => x5 => Vector$cons$(x0, x1, x2, x3, x4, x5);

    function Vector$fill$(_A$1, _size$2, _x$3) {
        var self = _size$2;
        if (self === 0n) {
            var $153 = Vector$nil(null);
            var $152 = $153;
        } else {
            var $154 = (self - 1n);
            var _pred$5 = Vector$fill$(null, $154, _x$3);
            var $155 = Vector$cons(null)($154)(_x$3)(_pred$5);
            var $152 = $155;
        };
        return $152;
    };
    const Vector$fill = x0 => x1 => x2 => Vector$fill$(x0, x1, x2);

    function Maybe$(_A$1) {
        var $156 = null;
        return $156;
    };
    const Maybe = x0 => Maybe$(x0);
    const Maybe$none = ({
        _: 'Maybe.none'
    });

    function App$EnvInfo$new$(_screen_size$1, _mouse_pos$2) {
        var $157 = ({
            _: 'App.EnvInfo.new',
            'screen_size': _screen_size$1,
            'mouse_pos': _mouse_pos$2
        });
        return $157;
    };
    const App$EnvInfo$new = x0 => x1 => App$EnvInfo$new$(x0, x1);
    const U32$from_nat = a0 => (Number(a0) >>> 0);
    const App$TicTacToe$State$global$new = ({
        _: 'App.TicTacToe.State.global.new'
    });
    const App$TicTacToe$init = App$Store$new$(App$TicTacToe$State$local$new$(Vector$fill$(null, 9n, Maybe$none), App$EnvInfo$new$(Pair$new$(0, 0), Pair$new$(0, 0))), App$TicTacToe$State$global$new);

    function I32$new$(_value$1) {
        var $158 = word_to_i32(_value$1);
        return $158;
    };
    const I32$new = x0 => I32$new$(x0);
    const Nat$ltn = a0 => a1 => (a0 < a1);
    const Nat$sub = a0 => a1 => (a0 - a1 <= 0n ? 0n : a0 - a1);

    function Cmp$as_gte$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
                var $160 = Bool$false;
                var $159 = $160;
                break;
            case 'Cmp.eql':
            case 'Cmp.gtn':
                var $161 = Bool$true;
                var $159 = $161;
                break;
        };
        return $159;
    };
    const Cmp$as_gte = x0 => Cmp$as_gte$(x0);
    const Cmp$ltn = ({
        _: 'Cmp.ltn'
    });
    const Cmp$gtn = ({
        _: 'Cmp.gtn'
    });

    function Word$cmp$go$(_a$2, _b$3, _c$4) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $163 = self.pred;
                var $164 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $166 = self.pred;
                            var $167 = (_a$pred$10 => {
                                var $168 = Word$cmp$go$(_a$pred$10, $166, _c$4);
                                return $168;
                            });
                            var $165 = $167;
                            break;
                        case 'Word.i':
                            var $169 = self.pred;
                            var $170 = (_a$pred$10 => {
                                var $171 = Word$cmp$go$(_a$pred$10, $169, Cmp$ltn);
                                return $171;
                            });
                            var $165 = $170;
                            break;
                        case 'Word.e':
                            var $172 = (_a$pred$8 => {
                                var $173 = _c$4;
                                return $173;
                            });
                            var $165 = $172;
                            break;
                    };
                    var $165 = $165($163);
                    return $165;
                });
                var $162 = $164;
                break;
            case 'Word.i':
                var $174 = self.pred;
                var $175 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $177 = self.pred;
                            var $178 = (_a$pred$10 => {
                                var $179 = Word$cmp$go$(_a$pred$10, $177, Cmp$gtn);
                                return $179;
                            });
                            var $176 = $178;
                            break;
                        case 'Word.i':
                            var $180 = self.pred;
                            var $181 = (_a$pred$10 => {
                                var $182 = Word$cmp$go$(_a$pred$10, $180, _c$4);
                                return $182;
                            });
                            var $176 = $181;
                            break;
                        case 'Word.e':
                            var $183 = (_a$pred$8 => {
                                var $184 = _c$4;
                                return $184;
                            });
                            var $176 = $183;
                            break;
                    };
                    var $176 = $176($174);
                    return $176;
                });
                var $162 = $175;
                break;
            case 'Word.e':
                var $185 = (_b$5 => {
                    var $186 = _c$4;
                    return $186;
                });
                var $162 = $185;
                break;
        };
        var $162 = $162(_b$3);
        return $162;
    };
    const Word$cmp$go = x0 => x1 => x2 => Word$cmp$go$(x0, x1, x2);
    const Cmp$eql = ({
        _: 'Cmp.eql'
    });

    function Word$cmp$(_a$2, _b$3) {
        var $187 = Word$cmp$go$(_a$2, _b$3, Cmp$eql);
        return $187;
    };
    const Word$cmp = x0 => x1 => Word$cmp$(x0, x1);

    function Word$gte$(_a$2, _b$3) {
        var $188 = Cmp$as_gte$(Word$cmp$(_a$2, _b$3));
        return $188;
    };
    const Word$gte = x0 => x1 => Word$gte$(x0, x1);

    function Pair$(_A$1, _B$2) {
        var $189 = null;
        return $189;
    };
    const Pair = x0 => x1 => Pair$(x0, x1);

    function Word$or$(_a$2, _b$3) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $191 = self.pred;
                var $192 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $194 = self.pred;
                            var $195 = (_a$pred$9 => {
                                var $196 = Word$o$(Word$or$(_a$pred$9, $194));
                                return $196;
                            });
                            var $193 = $195;
                            break;
                        case 'Word.i':
                            var $197 = self.pred;
                            var $198 = (_a$pred$9 => {
                                var $199 = Word$i$(Word$or$(_a$pred$9, $197));
                                return $199;
                            });
                            var $193 = $198;
                            break;
                        case 'Word.e':
                            var $200 = (_a$pred$7 => {
                                var $201 = Word$e;
                                return $201;
                            });
                            var $193 = $200;
                            break;
                    };
                    var $193 = $193($191);
                    return $193;
                });
                var $190 = $192;
                break;
            case 'Word.i':
                var $202 = self.pred;
                var $203 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $205 = self.pred;
                            var $206 = (_a$pred$9 => {
                                var $207 = Word$i$(Word$or$(_a$pred$9, $205));
                                return $207;
                            });
                            var $204 = $206;
                            break;
                        case 'Word.i':
                            var $208 = self.pred;
                            var $209 = (_a$pred$9 => {
                                var $210 = Word$i$(Word$or$(_a$pred$9, $208));
                                return $210;
                            });
                            var $204 = $209;
                            break;
                        case 'Word.e':
                            var $211 = (_a$pred$7 => {
                                var $212 = Word$e;
                                return $212;
                            });
                            var $204 = $211;
                            break;
                    };
                    var $204 = $204($202);
                    return $204;
                });
                var $190 = $203;
                break;
            case 'Word.e':
                var $213 = (_b$4 => {
                    var $214 = Word$e;
                    return $214;
                });
                var $190 = $213;
                break;
        };
        var $190 = $190(_b$3);
        return $190;
    };
    const Word$or = x0 => x1 => Word$or$(x0, x1);

    function Word$shift_right$one$go$(_word$2) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $216 = self.pred;
                var $217 = Word$o$(Word$shift_right$one$go$($216));
                var $215 = $217;
                break;
            case 'Word.i':
                var $218 = self.pred;
                var $219 = Word$i$(Word$shift_right$one$go$($218));
                var $215 = $219;
                break;
            case 'Word.e':
                var $220 = Word$o$(Word$e);
                var $215 = $220;
                break;
        };
        return $215;
    };
    const Word$shift_right$one$go = x0 => Word$shift_right$one$go$(x0);

    function Word$shift_right$one$(_word$2) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $222 = self.pred;
                var $223 = Word$shift_right$one$go$($222);
                var $221 = $223;
                break;
            case 'Word.i':
                var $224 = self.pred;
                var $225 = Word$shift_right$one$go$($224);
                var $221 = $225;
                break;
            case 'Word.e':
                var $226 = Word$e;
                var $221 = $226;
                break;
        };
        return $221;
    };
    const Word$shift_right$one = x0 => Word$shift_right$one$(x0);

    function Word$shift_right$(_n$2, _value$3) {
        var Word$shift_right$ = (_n$2, _value$3) => ({
            ctr: 'TCO',
            arg: [_n$2, _value$3]
        });
        var Word$shift_right = _n$2 => _value$3 => Word$shift_right$(_n$2, _value$3);
        var arg = [_n$2, _value$3];
        while (true) {
            let [_n$2, _value$3] = arg;
            var R = (() => {
                var self = _n$2;
                if (self === 0n) {
                    var $227 = _value$3;
                    return $227;
                } else {
                    var $228 = (self - 1n);
                    var $229 = Word$shift_right$($228, Word$shift_right$one$(_value$3));
                    return $229;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Word$shift_right = x0 => x1 => Word$shift_right$(x0, x1);

    function Word$subber$(_a$2, _b$3, _c$4) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $231 = self.pred;
                var $232 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $234 = self.pred;
                            var $235 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $237 = Word$i$(Word$subber$(_a$pred$10, $234, Bool$true));
                                    var $236 = $237;
                                } else {
                                    var $238 = Word$o$(Word$subber$(_a$pred$10, $234, Bool$false));
                                    var $236 = $238;
                                };
                                return $236;
                            });
                            var $233 = $235;
                            break;
                        case 'Word.i':
                            var $239 = self.pred;
                            var $240 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $242 = Word$o$(Word$subber$(_a$pred$10, $239, Bool$true));
                                    var $241 = $242;
                                } else {
                                    var $243 = Word$i$(Word$subber$(_a$pred$10, $239, Bool$true));
                                    var $241 = $243;
                                };
                                return $241;
                            });
                            var $233 = $240;
                            break;
                        case 'Word.e':
                            var $244 = (_a$pred$8 => {
                                var $245 = Word$e;
                                return $245;
                            });
                            var $233 = $244;
                            break;
                    };
                    var $233 = $233($231);
                    return $233;
                });
                var $230 = $232;
                break;
            case 'Word.i':
                var $246 = self.pred;
                var $247 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $249 = self.pred;
                            var $250 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $252 = Word$o$(Word$subber$(_a$pred$10, $249, Bool$false));
                                    var $251 = $252;
                                } else {
                                    var $253 = Word$i$(Word$subber$(_a$pred$10, $249, Bool$false));
                                    var $251 = $253;
                                };
                                return $251;
                            });
                            var $248 = $250;
                            break;
                        case 'Word.i':
                            var $254 = self.pred;
                            var $255 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $257 = Word$i$(Word$subber$(_a$pred$10, $254, Bool$true));
                                    var $256 = $257;
                                } else {
                                    var $258 = Word$o$(Word$subber$(_a$pred$10, $254, Bool$false));
                                    var $256 = $258;
                                };
                                return $256;
                            });
                            var $248 = $255;
                            break;
                        case 'Word.e':
                            var $259 = (_a$pred$8 => {
                                var $260 = Word$e;
                                return $260;
                            });
                            var $248 = $259;
                            break;
                    };
                    var $248 = $248($246);
                    return $248;
                });
                var $230 = $247;
                break;
            case 'Word.e':
                var $261 = (_b$5 => {
                    var $262 = Word$e;
                    return $262;
                });
                var $230 = $261;
                break;
        };
        var $230 = $230(_b$3);
        return $230;
    };
    const Word$subber = x0 => x1 => x2 => Word$subber$(x0, x1, x2);

    function Word$sub$(_a$2, _b$3) {
        var $263 = Word$subber$(_a$2, _b$3, Bool$false);
        return $263;
    };
    const Word$sub = x0 => x1 => Word$sub$(x0, x1);

    function Word$div$go$(_shift$2, _sub_copy$3, _shift_copy$4, _value$5) {
        var Word$div$go$ = (_shift$2, _sub_copy$3, _shift_copy$4, _value$5) => ({
            ctr: 'TCO',
            arg: [_shift$2, _sub_copy$3, _shift_copy$4, _value$5]
        });
        var Word$div$go = _shift$2 => _sub_copy$3 => _shift_copy$4 => _value$5 => Word$div$go$(_shift$2, _sub_copy$3, _shift_copy$4, _value$5);
        var arg = [_shift$2, _sub_copy$3, _shift_copy$4, _value$5];
        while (true) {
            let [_shift$2, _sub_copy$3, _shift_copy$4, _value$5] = arg;
            var R = (() => {
                var self = Word$gte$(_sub_copy$3, _shift_copy$4);
                if (self) {
                    var _mask$6 = Word$shift_left$(_shift$2, Word$inc$(Word$to_zero$(_sub_copy$3)));
                    var $264 = Pair$new$(Bool$true, Word$or$(_value$5, _mask$6));
                    var self = $264;
                } else {
                    var $265 = Pair$new$(Bool$false, _value$5);
                    var self = $265;
                };
                switch (self._) {
                    case 'Pair.new':
                        var $266 = self.fst;
                        var $267 = self.snd;
                        var self = _shift$2;
                        if (self === 0n) {
                            var $269 = $267;
                            var $268 = $269;
                        } else {
                            var $270 = (self - 1n);
                            var _new_shift_copy$9 = Word$shift_right$(1n, _shift_copy$4);
                            var self = $266;
                            if (self) {
                                var $272 = Word$div$go$($270, Word$sub$(_sub_copy$3, _shift_copy$4), _new_shift_copy$9, $267);
                                var $271 = $272;
                            } else {
                                var $273 = Word$div$go$($270, _sub_copy$3, _new_shift_copy$9, $267);
                                var $271 = $273;
                            };
                            var $268 = $271;
                        };
                        return $268;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Word$div$go = x0 => x1 => x2 => x3 => Word$div$go$(x0, x1, x2, x3);

    function Word$div$(_a$2, _b$3) {
        var _a_bits$4 = Word$bit_length$(_a$2);
        var _b_bits$5 = Word$bit_length$(_b$3);
        var self = (_a_bits$4 < _b_bits$5);
        if (self) {
            var $275 = Word$to_zero$(_a$2);
            var $274 = $275;
        } else {
            var _shift$6 = (_a_bits$4 - _b_bits$5 <= 0n ? 0n : _a_bits$4 - _b_bits$5);
            var _shift_copy$7 = Word$shift_left$(_shift$6, _b$3);
            var $276 = Word$div$go$(_shift$6, _a$2, _shift_copy$7, Word$to_zero$(_a$2));
            var $274 = $276;
        };
        return $274;
    };
    const Word$div = x0 => x1 => Word$div$(x0, x1);
    const I32$div = a0 => a1 => ((a0 / a1) >> 0);
    const F64$to_i32 = a0 => ((a0 >> 0));

    function Word$to_f64$(_a$2) {
        var Word$to_f64$ = (_a$2) => ({
            ctr: 'TCO',
            arg: [_a$2]
        });
        var Word$to_f64 = _a$2 => Word$to_f64$(_a$2);
        var arg = [_a$2];
        while (true) {
            let [_a$2] = arg;
            var R = Word$to_f64$(_a$2);
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Word$to_f64 = x0 => Word$to_f64$(x0);
    const U32$to_f64 = a0 => (a0);

    function U32$to_i32$(_n$1) {
        var $277 = (((_n$1) >> 0));
        return $277;
    };
    const U32$to_i32 = x0 => U32$to_i32$(x0);
    const App$TicTacToe$constant$size = 256;
    const side_board = U32$to_i32$(App$TicTacToe$constant$size);

    function Word$neg$aux$(_word$2, _inc$3) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $279 = self.pred;
                var self = _inc$3;
                if (self) {
                    var $281 = Word$o$(Word$neg$aux$($279, Bool$true));
                    var $280 = $281;
                } else {
                    var $282 = Word$i$(Word$neg$aux$($279, Bool$false));
                    var $280 = $282;
                };
                var $278 = $280;
                break;
            case 'Word.i':
                var $283 = self.pred;
                var self = _inc$3;
                if (self) {
                    var $285 = Word$i$(Word$neg$aux$($283, Bool$false));
                    var $284 = $285;
                } else {
                    var $286 = Word$o$(Word$neg$aux$($283, Bool$false));
                    var $284 = $286;
                };
                var $278 = $284;
                break;
            case 'Word.e':
                var $287 = Word$e;
                var $278 = $287;
                break;
        };
        return $278;
    };
    const Word$neg$aux = x0 => x1 => Word$neg$aux$(x0, x1);

    function Word$neg$(_word$2) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $289 = self.pred;
                var $290 = Word$o$(Word$neg$aux$($289, Bool$true));
                var $288 = $290;
                break;
            case 'Word.i':
                var $291 = self.pred;
                var $292 = Word$i$(Word$neg$aux$($291, Bool$false));
                var $288 = $292;
                break;
            case 'Word.e':
                var $293 = Word$e;
                var $288 = $293;
                break;
        };
        return $288;
    };
    const Word$neg = x0 => Word$neg$(x0);
    const I32$neg = a0 => ((-a0));
    const Int$to_i32 = a0 => (Number(a0));
    const Int$new = a0 => a1 => (a0 - a1);
    const Int$from_nat = a0 => (a0);
    const I32$from_nat = a0 => (Number(a0));

    function Word$is_neg$go$(_word$2, _n$3) {
        var Word$is_neg$go$ = (_word$2, _n$3) => ({
            ctr: 'TCO',
            arg: [_word$2, _n$3]
        });
        var Word$is_neg$go = _word$2 => _n$3 => Word$is_neg$go$(_word$2, _n$3);
        var arg = [_word$2, _n$3];
        while (true) {
            let [_word$2, _n$3] = arg;
            var R = (() => {
                var self = _word$2;
                switch (self._) {
                    case 'Word.o':
                        var $294 = self.pred;
                        var $295 = Word$is_neg$go$($294, Bool$false);
                        return $295;
                    case 'Word.i':
                        var $296 = self.pred;
                        var $297 = Word$is_neg$go$($296, Bool$true);
                        return $297;
                    case 'Word.e':
                        var $298 = _n$3;
                        return $298;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Word$is_neg$go = x0 => x1 => Word$is_neg$go$(x0, x1);

    function Word$is_neg$(_word$2) {
        var $299 = Word$is_neg$go$(_word$2, Bool$false);
        return $299;
    };
    const Word$is_neg = x0 => Word$is_neg$(x0);

    function Word$fold$(_nil$3, _w0$4, _w1$5, _word$6) {
        var self = _word$6;
        switch (self._) {
            case 'Word.o':
                var $301 = self.pred;
                var $302 = _w0$4(Word$fold$(_nil$3, _w0$4, _w1$5, $301));
                var $300 = $302;
                break;
            case 'Word.i':
                var $303 = self.pred;
                var $304 = _w1$5(Word$fold$(_nil$3, _w0$4, _w1$5, $303));
                var $300 = $304;
                break;
            case 'Word.e':
                var $305 = _nil$3;
                var $300 = $305;
                break;
        };
        return $300;
    };
    const Word$fold = x0 => x1 => x2 => x3 => Word$fold$(x0, x1, x2, x3);
    const Nat$add = a0 => a1 => (a0 + a1);
    const Nat$mul = a0 => a1 => (a0 * a1);

    function Word$to_nat$(_word$2) {
        var $306 = Word$fold$(0n, a1 => (2n * a1), (_x$4 => {
            var $307 = Nat$succ$((2n * _x$4));
            return $307;
        }), _word$2);
        return $306;
    };
    const Word$to_nat = x0 => Word$to_nat$(x0);

    function Word$shl$(_n$2, _value$3) {
        var _n_nat$4 = Word$to_nat$(_n$2);
        var $308 = Word$shift_left$(_n_nat$4, _value$3);
        return $308;
    };
    const Word$shl = x0 => x1 => Word$shl$(x0, x1);

    function Word$shr$(_n$2, _value$3) {
        var _n_nat$4 = Word$to_nat$(_n$2);
        var $309 = Word$shift_right$(_n_nat$4, _value$3);
        return $309;
    };
    const Word$shr = x0 => x1 => Word$shr$(x0, x1);

    function Word$s_shr$(_n$2, _value$3) {
        var _neg$4 = Word$is_neg$(_n$2);
        var self = _neg$4;
        if (self) {
            var _n$5 = Word$neg$(_n$2);
            var $311 = Word$shl$(_n$5, _value$3);
            var $310 = $311;
        } else {
            var $312 = Word$shr$(_n$2, _value$3);
            var $310 = $312;
        };
        return $310;
    };
    const Word$s_shr = x0 => x1 => Word$s_shr$(x0, x1);
    const I32$shr = a0 => a1 => (a0 >> a1);

    function Word$xor$(_a$2, _b$3) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $314 = self.pred;
                var $315 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $317 = self.pred;
                            var $318 = (_a$pred$9 => {
                                var $319 = Word$o$(Word$xor$(_a$pred$9, $317));
                                return $319;
                            });
                            var $316 = $318;
                            break;
                        case 'Word.i':
                            var $320 = self.pred;
                            var $321 = (_a$pred$9 => {
                                var $322 = Word$i$(Word$xor$(_a$pred$9, $320));
                                return $322;
                            });
                            var $316 = $321;
                            break;
                        case 'Word.e':
                            var $323 = (_a$pred$7 => {
                                var $324 = Word$e;
                                return $324;
                            });
                            var $316 = $323;
                            break;
                    };
                    var $316 = $316($314);
                    return $316;
                });
                var $313 = $315;
                break;
            case 'Word.i':
                var $325 = self.pred;
                var $326 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $328 = self.pred;
                            var $329 = (_a$pred$9 => {
                                var $330 = Word$i$(Word$xor$(_a$pred$9, $328));
                                return $330;
                            });
                            var $327 = $329;
                            break;
                        case 'Word.i':
                            var $331 = self.pred;
                            var $332 = (_a$pred$9 => {
                                var $333 = Word$o$(Word$xor$(_a$pred$9, $331));
                                return $333;
                            });
                            var $327 = $332;
                            break;
                        case 'Word.e':
                            var $334 = (_a$pred$7 => {
                                var $335 = Word$e;
                                return $335;
                            });
                            var $327 = $334;
                            break;
                    };
                    var $327 = $327($325);
                    return $327;
                });
                var $313 = $326;
                break;
            case 'Word.e':
                var $336 = (_b$4 => {
                    var $337 = Word$e;
                    return $337;
                });
                var $313 = $336;
                break;
        };
        var $313 = $313(_b$3);
        return $313;
    };
    const Word$xor = x0 => x1 => Word$xor$(x0, x1);
    const I32$xor = a0 => a1 => (a0 ^ a1);
    const I32$add = a0 => a1 => ((a0 + a1) >> 0);

    function I32$abs$(_a$1) {
        var _mask$2 = (_a$1 >> 31);
        var $338 = (((_mask$2 + _a$1) >> 0) ^ _mask$2);
        return $338;
    };
    const I32$abs = x0 => I32$abs$(x0);
    const I32$sub = a0 => a1 => ((a0 - a1) >> 0);

    function Cmp$as_ltn$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
                var $340 = Bool$true;
                var $339 = $340;
                break;
            case 'Cmp.eql':
            case 'Cmp.gtn':
                var $341 = Bool$false;
                var $339 = $341;
                break;
        };
        return $339;
    };
    const Cmp$as_ltn = x0 => Cmp$as_ltn$(x0);

    function Cmp$inv$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
                var $343 = Cmp$gtn;
                var $342 = $343;
                break;
            case 'Cmp.eql':
                var $344 = Cmp$eql;
                var $342 = $344;
                break;
            case 'Cmp.gtn':
                var $345 = Cmp$ltn;
                var $342 = $345;
                break;
        };
        return $342;
    };
    const Cmp$inv = x0 => Cmp$inv$(x0);

    function Word$s_ltn$(_a$2, _b$3) {
        var _neg_a$4 = Word$is_neg$(_a$2);
        var _neg_b$5 = Word$is_neg$(_b$3);
        var self = _neg_a$4;
        if (self) {
            var self = _neg_b$5;
            if (self) {
                var $348 = Cmp$as_ltn$(Cmp$inv$(Word$cmp$(_a$2, _b$3)));
                var $347 = $348;
            } else {
                var $349 = Bool$true;
                var $347 = $349;
            };
            var $346 = $347;
        } else {
            var self = _neg_b$5;
            if (self) {
                var $351 = Bool$false;
                var $350 = $351;
            } else {
                var $352 = Cmp$as_ltn$(Word$cmp$(_a$2, _b$3));
                var $350 = $352;
            };
            var $346 = $350;
        };
        return $346;
    };
    const Word$s_ltn = x0 => x1 => Word$s_ltn$(x0, x1);
    const I32$ltn = a0 => a1 => (a0 < a1);

    function List$(_A$1) {
        var $353 = null;
        return $353;
    };
    const List = x0 => List$(x0);

    function Cmp$as_gtn$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
            case 'Cmp.eql':
                var $355 = Bool$false;
                var $354 = $355;
                break;
            case 'Cmp.gtn':
                var $356 = Bool$true;
                var $354 = $356;
                break;
        };
        return $354;
    };
    const Cmp$as_gtn = x0 => Cmp$as_gtn$(x0);

    function Word$s_gtn$(_a$2, _b$3) {
        var _neg_a$4 = Word$is_neg$(_a$2);
        var _neg_b$5 = Word$is_neg$(_b$3);
        var self = _neg_a$4;
        if (self) {
            var self = _neg_b$5;
            if (self) {
                var $359 = Cmp$as_gtn$(Cmp$inv$(Word$cmp$(_a$2, _b$3)));
                var $358 = $359;
            } else {
                var $360 = Bool$false;
                var $358 = $360;
            };
            var $357 = $358;
        } else {
            var self = _neg_b$5;
            if (self) {
                var $362 = Bool$true;
                var $361 = $362;
            } else {
                var $363 = Cmp$as_gtn$(Word$cmp$(_a$2, _b$3));
                var $361 = $363;
            };
            var $357 = $361;
        };
        return $357;
    };
    const Word$s_gtn = x0 => x1 => Word$s_gtn$(x0, x1);
    const I32$gtn = a0 => a1 => (a0 > a1);
    const I32$mul = a0 => a1 => ((a0 * a1) >> 0);

    function Cmp$as_eql$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
            case 'Cmp.gtn':
                var $365 = Bool$false;
                var $364 = $365;
                break;
            case 'Cmp.eql':
                var $366 = Bool$true;
                var $364 = $366;
                break;
        };
        return $364;
    };
    const Cmp$as_eql = x0 => Cmp$as_eql$(x0);

    function Word$eql$(_a$2, _b$3) {
        var $367 = Cmp$as_eql$(Word$cmp$(_a$2, _b$3));
        return $367;
    };
    const Word$eql = x0 => x1 => Word$eql$(x0, x1);
    const I32$eql = a0 => a1 => (a0 === a1);

    function List$cons$(_head$2, _tail$3) {
        var $368 = ({
            _: 'List.cons',
            'head': _head$2,
            'tail': _tail$3
        });
        return $368;
    };
    const List$cons = x0 => x1 => List$cons$(x0, x1);

    function VoxBox$Draw$line$coords$low$go$(_x0$1, _y0$2, _x1$3, _y1$4, _yi$5, _dx$6, _dy$7, _d$8, _coords$9) {
        var VoxBox$Draw$line$coords$low$go$ = (_x0$1, _y0$2, _x1$3, _y1$4, _yi$5, _dx$6, _dy$7, _d$8, _coords$9) => ({
            ctr: 'TCO',
            arg: [_x0$1, _y0$2, _x1$3, _y1$4, _yi$5, _dx$6, _dy$7, _d$8, _coords$9]
        });
        var VoxBox$Draw$line$coords$low$go = _x0$1 => _y0$2 => _x1$3 => _y1$4 => _yi$5 => _dx$6 => _dy$7 => _d$8 => _coords$9 => VoxBox$Draw$line$coords$low$go$(_x0$1, _y0$2, _x1$3, _y1$4, _yi$5, _dx$6, _dy$7, _d$8, _coords$9);
        var arg = [_x0$1, _y0$2, _x1$3, _y1$4, _yi$5, _dx$6, _dy$7, _d$8, _coords$9];
        while (true) {
            let [_x0$1, _y0$2, _x1$3, _y1$4, _yi$5, _dx$6, _dy$7, _d$8, _coords$9] = arg;
            var R = (() => {
                var self = (_x0$1 === _x1$3);
                if (self) {
                    var $369 = List$cons$(Pair$new$(_x0$1, _y0$2), _coords$9);
                    return $369;
                } else {
                    var _new_x$10 = ((1 + _x0$1) >> 0);
                    var self = (_d$8 > 0);
                    if (self) {
                        var _new_y$11 = ((_yi$5 + _y0$2) >> 0);
                        var _new_d$12 = ((_d$8 + ((2 * ((_dy$7 - _dx$6) >> 0)) >> 0)) >> 0);
                        var $371 = VoxBox$Draw$line$coords$low$go$(_new_x$10, _new_y$11, _x1$3, _y1$4, _yi$5, _dx$6, _dy$7, _new_d$12, List$cons$(Pair$new$(_x0$1, _y0$2), _coords$9));
                        var $370 = $371;
                    } else {
                        var _new_d$11 = ((_d$8 + ((2 * _dy$7) >> 0)) >> 0);
                        var $372 = VoxBox$Draw$line$coords$low$go$(_new_x$10, _y0$2, _x1$3, _y1$4, _yi$5, _dx$6, _dy$7, _new_d$11, List$cons$(Pair$new$(_x0$1, _y0$2), _coords$9));
                        var $370 = $372;
                    };
                    return $370;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const VoxBox$Draw$line$coords$low$go = x0 => x1 => x2 => x3 => x4 => x5 => x6 => x7 => x8 => VoxBox$Draw$line$coords$low$go$(x0, x1, x2, x3, x4, x5, x6, x7, x8);
    const List$nil = ({
        _: 'List.nil'
    });

    function VoxBox$Draw$line$coords$low$(_x0$1, _y0$2, _x1$3, _y1$4) {
        var _dx$5 = ((_x1$3 - _x0$1) >> 0);
        var _dy$6 = I32$abs$(((_y1$4 - _y0$2) >> 0));
        var self = (_y1$4 > _y0$2);
        if (self) {
            var $374 = 1;
            var _yi$7 = $374;
        } else {
            var $375 = ((-1));
            var _yi$7 = $375;
        };
        var _d$8 = ((((2 * _dy$6) >> 0) - _dx$5) >> 0);
        var $373 = VoxBox$Draw$line$coords$low$go$(_x0$1, _y0$2, _x1$3, _y1$4, _yi$7, _dx$5, _dy$6, _d$8, List$nil);
        return $373;
    };
    const VoxBox$Draw$line$coords$low = x0 => x1 => x2 => x3 => VoxBox$Draw$line$coords$low$(x0, x1, x2, x3);

    function VoxBox$Draw$line$coords$high$go$(_x0$1, _y0$2, _x1$3, _y1$4, _xi$5, _dx$6, _dy$7, _d$8, _coords$9) {
        var VoxBox$Draw$line$coords$high$go$ = (_x0$1, _y0$2, _x1$3, _y1$4, _xi$5, _dx$6, _dy$7, _d$8, _coords$9) => ({
            ctr: 'TCO',
            arg: [_x0$1, _y0$2, _x1$3, _y1$4, _xi$5, _dx$6, _dy$7, _d$8, _coords$9]
        });
        var VoxBox$Draw$line$coords$high$go = _x0$1 => _y0$2 => _x1$3 => _y1$4 => _xi$5 => _dx$6 => _dy$7 => _d$8 => _coords$9 => VoxBox$Draw$line$coords$high$go$(_x0$1, _y0$2, _x1$3, _y1$4, _xi$5, _dx$6, _dy$7, _d$8, _coords$9);
        var arg = [_x0$1, _y0$2, _x1$3, _y1$4, _xi$5, _dx$6, _dy$7, _d$8, _coords$9];
        while (true) {
            let [_x0$1, _y0$2, _x1$3, _y1$4, _xi$5, _dx$6, _dy$7, _d$8, _coords$9] = arg;
            var R = (() => {
                var self = (_y0$2 === _y1$4);
                if (self) {
                    var $376 = List$cons$(Pair$new$(_x0$1, _y0$2), _coords$9);
                    return $376;
                } else {
                    var _new_y$10 = ((1 + _y0$2) >> 0);
                    var self = (_d$8 > 0);
                    if (self) {
                        var _new_x$11 = ((_x0$1 + _xi$5) >> 0);
                        var _new_d$12 = ((_d$8 + ((2 * ((_dx$6 - _dy$7) >> 0)) >> 0)) >> 0);
                        var $378 = VoxBox$Draw$line$coords$high$go$(_new_x$11, _new_y$10, _x1$3, _y1$4, _xi$5, _dx$6, _dy$7, _new_d$12, List$cons$(Pair$new$(_x0$1, _y0$2), _coords$9));
                        var $377 = $378;
                    } else {
                        var _new_d$11 = ((_d$8 + ((2 * _dx$6) >> 0)) >> 0);
                        var $379 = VoxBox$Draw$line$coords$high$go$(_x0$1, _new_y$10, _x1$3, _y1$4, _xi$5, _dx$6, _dy$7, _new_d$11, List$cons$(Pair$new$(_x0$1, _y0$2), _coords$9));
                        var $377 = $379;
                    };
                    return $377;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const VoxBox$Draw$line$coords$high$go = x0 => x1 => x2 => x3 => x4 => x5 => x6 => x7 => x8 => VoxBox$Draw$line$coords$high$go$(x0, x1, x2, x3, x4, x5, x6, x7, x8);

    function VoxBox$Draw$line$coords$high$(_x0$1, _y0$2, _x1$3, _y1$4) {
        var _dx$5 = I32$abs$(((_x1$3 - _x0$1) >> 0));
        var _dy$6 = ((_y1$4 - _y0$2) >> 0);
        var self = (_x0$1 > _x1$3);
        if (self) {
            var $381 = ((-1));
            var _xi$7 = $381;
        } else {
            var $382 = 1;
            var _xi$7 = $382;
        };
        var _d$8 = ((((2 * _dx$5) >> 0) - _dy$6) >> 0);
        var $380 = VoxBox$Draw$line$coords$high$go$(_x0$1, _y0$2, _x1$3, _y1$4, _xi$7, _dx$5, _dy$6, _d$8, List$nil);
        return $380;
    };
    const VoxBox$Draw$line$coords$high = x0 => x1 => x2 => x3 => VoxBox$Draw$line$coords$high$(x0, x1, x2, x3);

    function VoxBox$Draw$line$coords$(_x0$1, _y0$2, _x1$3, _y1$4) {
        var _dist_y$5 = I32$abs$(((_y1$4 - _y0$2) >> 0));
        var _dist_x$6 = I32$abs$(((_x1$3 - _x0$1) >> 0));
        var _low$7 = (_dist_y$5 < _dist_x$6);
        var self = _low$7;
        if (self) {
            var self = (_x0$1 > _x1$3);
            if (self) {
                var $385 = VoxBox$Draw$line$coords$low$(_x1$3, _y1$4, _x0$1, _y0$2);
                var $384 = $385;
            } else {
                var $386 = VoxBox$Draw$line$coords$low$(_x0$1, _y0$2, _x1$3, _y1$4);
                var $384 = $386;
            };
            var $383 = $384;
        } else {
            var self = (_y0$2 > _y1$4);
            if (self) {
                var $388 = VoxBox$Draw$line$coords$high$(_x1$3, _y1$4, _x0$1, _y0$2);
                var $387 = $388;
            } else {
                var $389 = VoxBox$Draw$line$coords$high$(_x0$1, _y0$2, _x1$3, _y1$4);
                var $387 = $389;
            };
            var $383 = $387;
        };
        return $383;
    };
    const VoxBox$Draw$line$coords = x0 => x1 => x2 => x3 => VoxBox$Draw$line$coords$(x0, x1, x2, x3);
    const List$for = a0 => a1 => a2 => (list_for(a0)(a1)(a2));

    function Word$trim$(_new_size$2, _word$3) {
        var self = _new_size$2;
        if (self === 0n) {
            var $391 = Word$e;
            var $390 = $391;
        } else {
            var $392 = (self - 1n);
            var self = _word$3;
            switch (self._) {
                case 'Word.o':
                    var $394 = self.pred;
                    var $395 = Word$o$(Word$trim$($392, $394));
                    var $393 = $395;
                    break;
                case 'Word.i':
                    var $396 = self.pred;
                    var $397 = Word$i$(Word$trim$($392, $396));
                    var $393 = $397;
                    break;
                case 'Word.e':
                    var $398 = Word$o$(Word$trim$($392, Word$e));
                    var $393 = $398;
                    break;
            };
            var $390 = $393;
        };
        return $390;
    };
    const Word$trim = x0 => x1 => Word$trim$(x0, x1);
    const Unit$new = null;

    function Array$extract_tip$(_arr$2) {
        var self = _arr$2;
        switch (self._) {
            case 'Array.tip':
                var $400 = self.value;
                var $401 = $400;
                var $399 = $401;
                break;
            case 'Array.tie':
                var $402 = Unit$new;
                var $399 = $402;
                break;
        };
        return $399;
    };
    const Array$extract_tip = x0 => Array$extract_tip$(x0);

    function Array$extract_tie$(_arr$3) {
        var self = _arr$3;
        switch (self._) {
            case 'Array.tie':
                var $404 = self.lft;
                var $405 = self.rgt;
                var $406 = Pair$new$($404, $405);
                var $403 = $406;
                break;
            case 'Array.tip':
                var $407 = Unit$new;
                var $403 = $407;
                break;
        };
        return $403;
    };
    const Array$extract_tie = x0 => Array$extract_tie$(x0);

    function Word$foldl$(_nil$3, _w0$4, _w1$5, _word$6) {
        var Word$foldl$ = (_nil$3, _w0$4, _w1$5, _word$6) => ({
            ctr: 'TCO',
            arg: [_nil$3, _w0$4, _w1$5, _word$6]
        });
        var Word$foldl = _nil$3 => _w0$4 => _w1$5 => _word$6 => Word$foldl$(_nil$3, _w0$4, _w1$5, _word$6);
        var arg = [_nil$3, _w0$4, _w1$5, _word$6];
        while (true) {
            let [_nil$3, _w0$4, _w1$5, _word$6] = arg;
            var R = (() => {
                var self = _word$6;
                switch (self._) {
                    case 'Word.o':
                        var $408 = self.pred;
                        var $409 = Word$foldl$(_w0$4(_nil$3), _w0$4, _w1$5, $408);
                        return $409;
                    case 'Word.i':
                        var $410 = self.pred;
                        var $411 = Word$foldl$(_w1$5(_nil$3), _w0$4, _w1$5, $410);
                        return $411;
                    case 'Word.e':
                        var $412 = _nil$3;
                        return $412;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Word$foldl = x0 => x1 => x2 => x3 => Word$foldl$(x0, x1, x2, x3);

    function Array$mut$(_idx$3, _f$4, _arr$5) {
        var $413 = Word$foldl$((_arr$6 => {
            var $414 = Array$tip$(_f$4(Array$extract_tip$(_arr$6)));
            return $414;
        }), (_rec$7 => _arr$8 => {
            var self = Array$extract_tie$(_arr$8);
            switch (self._) {
                case 'Pair.new':
                    var $416 = self.fst;
                    var $417 = self.snd;
                    var $418 = Array$tie$(_rec$7($416), $417);
                    var $415 = $418;
                    break;
            };
            return $415;
        }), (_rec$7 => _arr$8 => {
            var self = Array$extract_tie$(_arr$8);
            switch (self._) {
                case 'Pair.new':
                    var $420 = self.fst;
                    var $421 = self.snd;
                    var $422 = Array$tie$($420, _rec$7($421));
                    var $419 = $422;
                    break;
            };
            return $419;
        }), _idx$3)(_arr$5);
        return $413;
    };
    const Array$mut = x0 => x1 => x2 => Array$mut$(x0, x1, x2);

    function Array$set$(_idx$3, _val$4, _arr$5) {
        var $423 = Array$mut$(_idx$3, (_x$6 => {
            var $424 = _val$4;
            return $424;
        }), _arr$5);
        return $423;
    };
    const Array$set = x0 => x1 => x2 => Array$set$(x0, x1, x2);
    const Buffer32$set = a0 => a1 => a2 => ((a2[a0] = a1, a2));
    const VoxBox$set_pos = a0 => a1 => a2 => ((a2.buffer[a0 * 2] = a1, a2));
    const U32$add = a0 => a1 => ((a0 + a1) >>> 0);
    const VoxBox$set_col = a0 => a1 => a2 => ((a2.buffer[a0 * 2 + 1] = a1, a2));

    function VoxBox$set_length$(_length$1, _img$2) {
        var self = _img$2;
        switch (self._) {
            case 'VoxBox.new':
                var $426 = self.capacity;
                var $427 = self.buffer;
                var $428 = VoxBox$new$(_length$1, $426, $427);
                var $425 = $428;
                break;
        };
        return $425;
    };
    const VoxBox$set_length = x0 => x1 => VoxBox$set_length$(x0, x1);
    const VoxBox$push = a0 => a1 => a2 => ((a2.buffer[a2.length * 2] = a0, a2.buffer[a2.length * 2 + 1] = a1, a2.length++, a2));
    const U32$or = a0 => a1 => (a0 | a1);
    const U32$shl = a0 => a1 => ((a0 << a1) >>> 0);
    const Pos32$new = a0 => a1 => a2 => ((0 | a0 | (a1 << 12) | (a2 << 24)));
    const F64$to_u32 = a0 => ((a0 >>> 0));

    function Word$s_to_f64$(_a$2) {
        var Word$s_to_f64$ = (_a$2) => ({
            ctr: 'TCO',
            arg: [_a$2]
        });
        var Word$s_to_f64 = _a$2 => Word$s_to_f64$(_a$2);
        var arg = [_a$2];
        while (true) {
            let [_a$2] = arg;
            var R = Word$s_to_f64$(_a$2);
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Word$s_to_f64 = x0 => Word$s_to_f64$(x0);
    const I32$to_f64 = a0 => (a0);

    function I32$to_u32$(_n$1) {
        var $429 = (((_n$1) >>> 0));
        return $429;
    };
    const I32$to_u32 = x0 => I32$to_u32$(x0);

    function VoxBox$Draw$line$(_x0$1, _y0$2, _x1$3, _y1$4, _z$5, _col$6, _img$7) {
        var _coords$8 = VoxBox$Draw$line$coords$(_x0$1, _y0$2, _x1$3, _y1$4);
        var _img$9 = (() => {
            var $432 = _img$7;
            var $433 = _coords$8;
            let _img$10 = $432;
            let _coord$9;
            while ($433._ === 'List.cons') {
                _coord$9 = $433.head;
                var self = _coord$9;
                switch (self._) {
                    case 'Pair.new':
                        var $434 = self.fst;
                        var $435 = self.snd;
                        var $436 = ((_img$10.buffer[_img$10.length * 2] = ((0 | I32$to_u32$($434) | (I32$to_u32$($435) << 12) | (I32$to_u32$(_z$5) << 24))), _img$10.buffer[_img$10.length * 2 + 1] = _col$6, _img$10.length++, _img$10));
                        var $432 = $436;
                        break;
                };
                _img$10 = $432;
                $433 = $433.tail;
            }
            return _img$10;
        })();
        var $430 = _img$9;
        return $430;
    };
    const VoxBox$Draw$line = x0 => x1 => x2 => x3 => x4 => x5 => x6 => VoxBox$Draw$line$(x0, x1, x2, x3, x4, x5, x6);
    const Col32$new = a0 => a1 => a2 => a3 => ((0 | a0 | (a1 << 8) | (a2 << 16) | (a3 << 24)));

    function App$TicTacToe$draw_vertical_lines$(_img$1) {
        var _side_tale$2 = ((side_board / 3) >> 0);
        var _edge$3 = ((side_board / 12) >> 0);
        var _img$4 = VoxBox$Draw$line$(_side_tale$2, _edge$3, _side_tale$2, ((side_board - _edge$3) >> 0), 0, ((0 | 0 | (0 << 8) | (0 << 16) | (255 << 24))), _img$1);
        var $437 = VoxBox$Draw$line$(((side_board - _side_tale$2) >> 0), _edge$3, ((side_board - _side_tale$2) >> 0), ((side_board - _edge$3) >> 0), 0, ((0 | 0 | (0 << 8) | (0 << 16) | (255 << 24))), _img$4);
        return $437;
    };
    const App$TicTacToe$draw_vertical_lines = x0 => App$TicTacToe$draw_vertical_lines$(x0);

    function App$TicTacToe$draw_horizontal_lines$(_img$1) {
        var _side_tale$2 = ((side_board / 3) >> 0);
        var _edge$3 = ((side_board / 12) >> 0);
        var _img$4 = VoxBox$Draw$line$(_edge$3, _side_tale$2, ((side_board - _edge$3) >> 0), _side_tale$2, 0, ((0 | 0 | (0 << 8) | (0 << 16) | (255 << 24))), _img$1);
        var $438 = VoxBox$Draw$line$(_edge$3, ((side_board - _side_tale$2) >> 0), ((side_board - _edge$3) >> 0), ((side_board - _side_tale$2) >> 0), 0, ((0 | 0 | (0 << 8) | (0 << 16) | (255 << 24))), _img$4);
        return $438;
    };
    const App$TicTacToe$draw_horizontal_lines = x0 => App$TicTacToe$draw_horizontal_lines$(x0);

    function Vector$fold$(_A$1, _B$2, _size$3, _b$4, _f$5, _vec$6) {
        var self = _size$3;
        if (self === 0n) {
            var $440 = (_vec$7 => {
                var $441 = _b$4;
                return $441;
            });
            var $439 = $440;
        } else {
            var $442 = (self - 1n);
            var $443 = (_vec$8 => {
                var $444 = _vec$8((_vec$self$9 => {
                    var $445 = null;
                    return $445;
                }))((_vec$head$9 => _vec$tail$10 => {
                    var _pred$11 = Vector$fold$(null, null, $442, _b$4, _f$5, _vec$tail$10);
                    var $446 = _f$5(_vec$head$9)(_pred$11);
                    return $446;
                }));
                return $444;
            });
            var $439 = $443;
        };
        var $439 = $439(_vec$6);
        return $439;
    };
    const Vector$fold = x0 => x1 => x2 => x3 => x4 => x5 => Vector$fold$(x0, x1, x2, x3, x4, x5);
    const U32$sub = a0 => a1 => ((a0 - a1) >>> 0);
    const U32$div = a0 => a1 => ((a0 / a1) >>> 0);

    function Word$mod$(_a$2, _b$3) {
        var _q$4 = Word$div$(_a$2, _b$3);
        var $447 = Word$sub$(_a$2, Word$mul$(_b$3, _q$4));
        return $447;
    };
    const Word$mod = x0 => x1 => Word$mod$(x0, x1);
    const U32$mod = a0 => a1 => (a0 % a1);

    function App$TicTacToe$pos$posvector_to_minipair$(_posvector$1) {
        var $448 = Pair$new$(((_posvector$1 / 3) >>> 0), (_posvector$1 % 3));
        return $448;
    };
    const App$TicTacToe$pos$posvector_to_minipair = x0 => App$TicTacToe$pos$posvector_to_minipair$(x0);
    const App$TicTacToe$constant$side_tale = ((App$TicTacToe$constant$size / 3) >>> 0);
    const side_tale = App$TicTacToe$constant$side_tale;

    function App$TicTacToe$pos$posvector_to_pair$(_pos$1) {
        var _trans$2 = App$TicTacToe$pos$posvector_to_minipair$(_pos$1);
        var self = _trans$2;
        switch (self._) {
            case 'Pair.new':
                var $450 = self.fst;
                var $451 = self.snd;
                var $452 = Pair$new$((((($450 * side_tale) >>> 0) + ((side_tale / 2) >>> 0)) >>> 0), (((($451 * side_tale) >>> 0) + ((side_tale / 2) >>> 0)) >>> 0));
                var $449 = $452;
                break;
        };
        return $449;
    };
    const App$TicTacToe$pos$posvector_to_pair = x0 => App$TicTacToe$pos$posvector_to_pair$(x0);

    function VoxBox$get_len$(_img$1) {
        var self = _img$1;
        switch (self._) {
            case 'VoxBox.new':
                var $454 = self.length;
                var $455 = $454;
                var $453 = $455;
                break;
        };
        return $453;
    };
    const VoxBox$get_len = x0 => VoxBox$get_len$(x0);
    const U32$eql = a0 => a1 => (a0 === a1);
    const U32$inc = a0 => ((a0 + 1) >>> 0);
    const U32$for = a0 => a1 => a2 => a3 => (u32_for(a0, a1, a2, a3));

    function Array$get$(_idx$3, _arr$4) {
        var $456 = Word$foldl$(Array$extract_tip, (_rec$6 => _arr$7 => {
            var _arr_l$8 = Array$extract_tie$(_arr$7);
            var self = _arr_l$8;
            switch (self._) {
                case 'Pair.new':
                    var $458 = self.fst;
                    var $459 = _rec$6($458);
                    var $457 = $459;
                    break;
            };
            return $457;
        }), (_rec$6 => _arr$7 => {
            var _arr_r$8 = Array$extract_tie$(_arr$7);
            var self = _arr_r$8;
            switch (self._) {
                case 'Pair.new':
                    var $461 = self.snd;
                    var $462 = _rec$6($461);
                    var $460 = $462;
                    break;
            };
            return $460;
        }), _idx$3)(_arr$4);
        return $456;
    };
    const Array$get = x0 => x1 => Array$get$(x0, x1);
    const Buffer32$get = a0 => a1 => ((a1[a0]));
    const VoxBox$get_pos = a0 => a1 => ((a1.buffer[a0 * 2]));
    const VoxBox$get_col = a0 => a1 => ((a1.buffer[a0 * 2 + 1]));

    function Word$and$(_a$2, _b$3) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $464 = self.pred;
                var $465 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $467 = self.pred;
                            var $468 = (_a$pred$9 => {
                                var $469 = Word$o$(Word$and$(_a$pred$9, $467));
                                return $469;
                            });
                            var $466 = $468;
                            break;
                        case 'Word.i':
                            var $470 = self.pred;
                            var $471 = (_a$pred$9 => {
                                var $472 = Word$o$(Word$and$(_a$pred$9, $470));
                                return $472;
                            });
                            var $466 = $471;
                            break;
                        case 'Word.e':
                            var $473 = (_a$pred$7 => {
                                var $474 = Word$e;
                                return $474;
                            });
                            var $466 = $473;
                            break;
                    };
                    var $466 = $466($464);
                    return $466;
                });
                var $463 = $465;
                break;
            case 'Word.i':
                var $475 = self.pred;
                var $476 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $478 = self.pred;
                            var $479 = (_a$pred$9 => {
                                var $480 = Word$o$(Word$and$(_a$pred$9, $478));
                                return $480;
                            });
                            var $477 = $479;
                            break;
                        case 'Word.i':
                            var $481 = self.pred;
                            var $482 = (_a$pred$9 => {
                                var $483 = Word$i$(Word$and$(_a$pred$9, $481));
                                return $483;
                            });
                            var $477 = $482;
                            break;
                        case 'Word.e':
                            var $484 = (_a$pred$7 => {
                                var $485 = Word$e;
                                return $485;
                            });
                            var $477 = $484;
                            break;
                    };
                    var $477 = $477($475);
                    return $477;
                });
                var $463 = $476;
                break;
            case 'Word.e':
                var $486 = (_b$4 => {
                    var $487 = Word$e;
                    return $487;
                });
                var $463 = $486;
                break;
        };
        var $463 = $463(_b$3);
        return $463;
    };
    const Word$and = x0 => x1 => Word$and$(x0, x1);
    const U32$and = a0 => a1 => (a0 & a1);
    const U32$shr = a0 => a1 => (a0 >>> a1);

    function VoxBox$Draw$image$(_x$1, _y$2, _z$3, _src$4, _img$5) {
        var _len$6 = VoxBox$get_len$(_src$4);
        var _img$7 = (() => {
            var $489 = _img$5;
            var $490 = 0;
            var $491 = _len$6;
            let _img$8 = $489;
            for (let _i$7 = $490; _i$7 < $491; ++_i$7) {
                var _pos$9 = ((_src$4.buffer[_i$7 * 2]));
                var _col$10 = ((_src$4.buffer[_i$7 * 2 + 1]));
                var _p_x$11 = (_pos$9 & 4095);
                var _p_y$12 = ((_pos$9 & 16773120) >>> 12);
                var _p_z$13 = ((_pos$9 & 4278190080) >>> 24);
                var _p_x$14 = ((_p_x$11 + _x$1) >>> 0);
                var _p_y$15 = ((_p_y$12 + _y$2) >>> 0);
                var _p_z$16 = ((_p_z$13 + _z$3) >>> 0);
                var _pos$17 = ((0 | _p_x$14 | (_p_y$15 << 12) | (_p_z$16 << 24)));
                var $489 = ((_img$8.buffer[_img$8.length * 2] = _pos$17, _img$8.buffer[_img$8.length * 2 + 1] = _col$10, _img$8.length++, _img$8));
                _img$8 = $489;
            };
            return _img$8;
        })();
        var $488 = _img$7;
        return $488;
    };
    const VoxBox$Draw$image = x0 => x1 => x2 => x3 => x4 => VoxBox$Draw$image$(x0, x1, x2, x3, x4);
    const U32$length = a0 => ((a0.length) >>> 0);

    function Word$slice$(_a$2, _b$3, _str$4) {
        var Word$slice$ = (_a$2, _b$3, _str$4) => ({
            ctr: 'TCO',
            arg: [_a$2, _b$3, _str$4]
        });
        var Word$slice = _a$2 => _b$3 => _str$4 => Word$slice$(_a$2, _b$3, _str$4);
        var arg = [_a$2, _b$3, _str$4];
        while (true) {
            let [_a$2, _b$3, _str$4] = arg;
            var R = Word$slice$(_a$2, _b$3, _str$4);
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Word$slice = x0 => x1 => x2 => Word$slice$(x0, x1, x2);
    const U32$slice = a0 => a1 => a2 => (a2.slice(a0, a1));
    const U32$read_base = a0 => a1 => (parseInt(a1, a0));

    function VoxBox$parse_byte$(_idx$1, _voxdata$2) {
        var _chr$3 = (_voxdata$2.slice(((_idx$1 * 2) >>> 0), ((((_idx$1 * 2) >>> 0) + 2) >>> 0)));
        var $492 = (parseInt(_chr$3, 16));
        return $492;
    };
    const VoxBox$parse_byte = x0 => x1 => VoxBox$parse_byte$(x0, x1);

    function VoxBox$parse$(_voxdata$1) {
        var _siz$2 = ((((_voxdata$1.length) >>> 0) / 12) >>> 0);
        var _img$3 = VoxBox$alloc_capacity$(_siz$2);
        var _img$4 = (() => {
            var $494 = _img$3;
            var $495 = 0;
            var $496 = _siz$2;
            let _img$5 = $494;
            for (let _i$4 = $495; _i$4 < $496; ++_i$4) {
                var _x$6 = VoxBox$parse_byte$(((((_i$4 * 6) >>> 0) + 0) >>> 0), _voxdata$1);
                var _y$7 = VoxBox$parse_byte$(((((_i$4 * 6) >>> 0) + 1) >>> 0), _voxdata$1);
                var _z$8 = VoxBox$parse_byte$(((((_i$4 * 6) >>> 0) + 2) >>> 0), _voxdata$1);
                var _r$9 = VoxBox$parse_byte$(((((_i$4 * 6) >>> 0) + 3) >>> 0), _voxdata$1);
                var _g$10 = VoxBox$parse_byte$(((((_i$4 * 6) >>> 0) + 4) >>> 0), _voxdata$1);
                var _b$11 = VoxBox$parse_byte$(((((_i$4 * 6) >>> 0) + 5) >>> 0), _voxdata$1);
                var _pos$12 = ((0 | _x$6 | (_y$7 << 12) | (_z$8 << 24)));
                var _col$13 = ((0 | _r$9 | (_g$10 << 8) | (_b$11 << 16) | (255 << 24)));
                var $494 = ((_img$5.buffer[_img$5.length * 2] = _pos$12, _img$5.buffer[_img$5.length * 2 + 1] = _col$13, _img$5.length++, _img$5));
                _img$5 = $494;
            };
            return _img$5;
        })();
        var $493 = _img$4;
        return $493;
    };
    const VoxBox$parse = x0 => VoxBox$parse$(x0);
    const App$TicTacToe$Assets$circle = VoxBox$parse$("0d00020000000e00020000000f00020000001000020000001100020000001200020000001300020000001400020000001500020000001600020000000a01020000000b01020000000c01020000000d01020000000e01020000000f01020000001001020000001101020000001201020000001301020000001401020000001501020000001601020000001701020000001801020000000802020000000902020000000a02020000000b02020000000c02020000000d02020000000e02020000000f02020000001002020000001102020000001202020000001302020000001402020000001502020000001602020000001702020000001802020000001902020000000603020000000703020000000803020000000903020000000a03020000000b03020000000c03020000000d03020000000e03020000000f03020000001003020000001103020000001203020000001303020000001403020000001503020000001603020000001703020000001803020000001903020000001a03020000000504020000000604020000000704020000000804020000000904020000000a04020000000b04020000000c04020000000d04020000000e04020000000f04020000001004020000001104020000001204020000001304020000001404020000001504020000001604020000001704020000001804020000001904020000001a04020000001b04020000000405020000000505020000000605020000000705020000000805020000000905020000000a05020000000b05020000000c05020000000d05020000000e05020000001205020000001305020000001405020000001505020000001605020000001705020000001805020000001905020000001a05020000001b05020000001c05020000000306020000000406020000000506020000000606020000000706020000000806020000000906020000000a06020000001306020000001406020000001506020000001606020000001706020000001806020000001906020000001a06020000001b06020000001c06020000000207020000000307020000000407020000000507020000000607020000000707020000000807020000001407020000001507020000001607020000001707020000001807020000001907020000001a07020000001b07020000001c07020000001d07020000000208020000000308020000000408020000000508020000000608020000000708020000000808020000001608020000001708020000001808020000001908020000001a08020000001b08020000001c08020000001d08020000001e08020000000109020000000209020000000309020000000409020000000509020000000609020000000709020000001709020000001809020000001909020000001a09020000001b09020000001c09020000001d09020000001e0902000000010a02000000020a02000000030a02000000040a02000000050a02000000060a02000000170a02000000180a02000000190a020000001a0a020000001b0a020000001c0a020000001d0a020000001e0a020000001f0a02000000000b02000000010b02000000020b02000000030b02000000040b02000000050b02000000060b02000000180b02000000190b020000001a0b020000001b0b020000001c0b020000001d0b020000001e0b020000001f0b02000000000c02000000010c02000000020c02000000030c02000000040c02000000050c02000000060c02000000180c02000000190c020000001a0c020000001b0c020000001c0c020000001d0c020000001e0c020000001f0c02000000000d02000000010d02000000020d02000000030d02000000040d02000000050d02000000190d020000001a0d020000001b0d020000001c0d020000001d0d020000001e0d020000001f0d02000000000e02000000010e02000000020e02000000030e02000000040e02000000050e02000000190e020000001a0e020000001b0e020000001c0e020000001d0e020000001e0e020000001f0e02000000000f02000000010f02000000020f02000000030f02000000040f02000000050f02000000190f020000001a0f020000001b0f020000001c0f020000001d0f020000001e0f020000001f0f020000000010020000000110020000000210020000000310020000000410020000000510020000001a10020000001b10020000001c10020000001d10020000001e10020000001f10020000000011020000000111020000000211020000000311020000000411020000000511020000000611020000001a11020000001b11020000001c11020000001d11020000001e11020000001f11020000000012020000000112020000000212020000000312020000000412020000000512020000000612020000001a12020000001b12020000001c12020000001d12020000001e12020000001f12020000000013020000000113020000000213020000000313020000000413020000000513020000000613020000001a13020000001b13020000001c13020000001d13020000001e13020000001f13020000000014020000000114020000000214020000000314020000000414020000000514020000000614020000000714020000001a14020000001b14020000001c14020000001d14020000001e14020000001f14020000000015020000000115020000000215020000000315020000000415020000000515020000000615020000000715020000001a15020000001b15020000001c15020000001d15020000001e15020000001f15020000000016020000000116020000000216020000000316020000000416020000000516020000000616020000000716020000000816020000001a16020000001b16020000001c16020000001d16020000001e16020000001f16020000000117020000000217020000000317020000000417020000000517020000000617020000000717020000000817020000000917020000001a17020000001b17020000001c17020000001d17020000001e17020000001f17020000000118020000000218020000000318020000000418020000000518020000000618020000000718020000000818020000000918020000000a18020000001a18020000001b18020000001c18020000001d18020000001e18020000001f18020000000219020000000319020000000419020000000519020000000619020000000719020000000819020000000919020000000a19020000000b19020000001a19020000001b19020000001c19020000001d19020000001e19020000001f1902000000031a02000000041a02000000051a02000000061a02000000071a02000000081a02000000091a020000000a1a020000000b1a020000000c1a020000000d1a02000000191a020000001a1a020000001b1a020000001c1a020000001d1a020000001e1a020000001f1a02000000031b02000000041b02000000051b02000000061b02000000071b02000000081b02000000091b020000000a1b020000000b1b020000000c1b020000000d1b020000000e1b020000000f1b02000000191b020000001a1b020000001b1b020000001c1b020000001d1b020000001e1b020000001f1b02000000041c02000000051c02000000061c02000000071c02000000081c02000000091c020000000a1c020000000b1c020000000c1c020000000d1c020000000e1c020000000f1c02000000101c02000000111c02000000121c02000000181c02000000191c020000001a1c020000001b1c020000001c1c020000001d1c020000001e1c02000000051d02000000061d02000000071d02000000081d02000000091d020000000a1d020000000b1d020000000c1d020000000d1d020000000e1d020000000f1d02000000101d02000000111d02000000121d02000000131d02000000141d02000000151d02000000161d02000000171d02000000181d02000000191d020000001a1d020000001b1d020000001c1d020000001d1d020000001e1d02000000071e02000000081e02000000091e020000000a1e020000000b1e020000000c1e020000000d1e020000000e1e020000000f1e02000000101e02000000111e02000000121e02000000131e02000000141e02000000151e02000000161e02000000171e02000000181e02000000191e020000001a1e020000001b1e020000001c1e020000001d1e02000000091f020000000a1f020000000b1f020000000c1f020000000d1f020000000e1f020000000f1f02000000101f02000000111f02000000121f02000000131f02000000141f02000000151f02000000161f02000000171f02000000181f02000000191f020000001a1f020000001b1f020000001c1f020000000b20020000000c20020000000d20020000000e20020000000f20020000001020020000001120020000001220020000001320020000001420020000001520020000001620020000001720020000001820020000001920020000001a20020000000c21020000000d21020000000e21020000000f2102000000102102000000112102000000122102000000132102000000142102000000152102000000162102000000172102000000182102000000");
    const App$TicTacToe$Assets$x = VoxBox$parse$("0200020000000300020000000400020000000500020000001900020000001a00020000001b00020000001c00020000001d00020000000101020000000201020000000301020000000401020000000501020000000601020000001801020000001901020000001a01020000001b01020000001c01020000001d01020000000002020000000102020000000202020000000302020000000402020000000502020000000602020000000702020000000802020000001702020000001802020000001902020000001a02020000001b02020000001c02020000000003020000000103020000000203020000000303020000000403020000000503020000000603020000000703020000000803020000000903020000001703020000001803020000001903020000001a03020000001b03020000000104020000000204020000000304020000000404020000000504020000000604020000000704020000000804020000000904020000000a04020000000b04020000001604020000001704020000001804020000001904020000001a04020000001b04020000000305020000000405020000000505020000000605020000000705020000000805020000000905020000000a05020000000b05020000000c05020000001505020000001605020000001705020000001805020000001905020000001a05020000000506020000000606020000000706020000000806020000000906020000000a06020000000b06020000000c06020000000d06020000001406020000001506020000001606020000001706020000001806020000001906020000000607020000000707020000000807020000000907020000000a07020000000b07020000000c07020000000d07020000000e07020000001307020000001407020000001507020000001607020000001707020000001807020000000708020000000808020000000908020000000a08020000000b08020000000c08020000000d08020000000e08020000000f08020000001208020000001308020000001408020000001508020000001608020000001708020000000909020000000a09020000000b09020000000c09020000000d09020000000e09020000000f09020000001009020000001109020000001209020000001309020000001409020000001509020000001609020000001709020000000a0a020000000b0a020000000c0a020000000d0a020000000e0a020000000f0a02000000100a02000000110a02000000120a02000000130a02000000140a02000000150a02000000160a020000000b0b020000000c0b020000000d0b020000000e0b020000000f0b02000000100b02000000110b02000000120b02000000130b02000000140b02000000150b020000000c0c020000000d0c020000000e0c020000000f0c02000000100c02000000110c02000000120c02000000130c02000000140c020000000d0d020000000e0d020000000f0d02000000100d02000000110d02000000120d02000000130d02000000140d020000000d0e020000000e0e020000000f0e02000000100e02000000110e02000000120e02000000130e02000000140e02000000150e020000000c0f020000000d0f020000000e0f020000000f0f02000000100f02000000110f02000000120f02000000130f02000000140f02000000150f02000000160f020000000b10020000000c10020000000d10020000000e10020000000f10020000001010020000001110020000001210020000001310020000001410020000001510020000001610020000001710020000000a11020000000b11020000000c11020000000d11020000000e11020000000f11020000001111020000001211020000001311020000001411020000001511020000001611020000001711020000001811020000000912020000000a12020000000b12020000000c12020000000d12020000000e12020000001212020000001312020000001412020000001512020000001612020000001712020000001812020000001912020000000813020000000913020000000a13020000000b13020000000c13020000000d13020000001313020000001413020000001513020000001613020000001713020000001813020000001913020000001a13020000000714020000000814020000000914020000000a14020000000b14020000000c14020000001414020000001514020000001614020000001714020000001814020000001914020000001a14020000001b14020000000615020000000715020000000815020000000915020000000a15020000000b15020000001515020000001615020000001715020000001815020000001915020000001a15020000001b15020000001c15020000000516020000000616020000000716020000000816020000000916020000000a16020000001616020000001716020000001816020000001916020000001a16020000001b16020000001c16020000001d16020000000417020000000517020000000617020000000717020000000817020000000917020000001717020000001817020000001917020000001a17020000001b17020000001c17020000001d17020000001e17020000000318020000000418020000000518020000000618020000000718020000000818020000001718020000001818020000001918020000001a18020000001b18020000001c18020000001d18020000001e18020000001f18020000000219020000000319020000000419020000000519020000000619020000000719020000000819020000001819020000001919020000001a19020000001b19020000001c19020000001d19020000001e19020000001f1902000000021a02000000031a02000000041a02000000051a02000000061a02000000071a02000000191a020000001a1a020000001b1a020000001c1a020000001d1a020000001e1a020000001f1a02000000011b02000000021b02000000031b02000000041b02000000051b020000001b1b020000001c1b020000001d1b020000001e1b02000000011c02000000021c02000000031c02000000041c02000000");

    function App$TicTacToe$entity$to_assets$(_e$1) {
        var self = _e$1;
        switch (self._) {
            case 'App.TicTacToe.Entity.circle':
                var $498 = App$TicTacToe$Assets$circle;
                var $497 = $498;
                break;
            case 'App.TicTacToe.Entity.x':
                var $499 = App$TicTacToe$Assets$x;
                var $497 = $499;
                break;
        };
        return $497;
    };
    const App$TicTacToe$entity$to_assets = x0 => App$TicTacToe$entity$to_assets$(x0);

    function DOM$vbox$(_props$1, _style$2, _value$3) {
        var $500 = ({
            _: 'DOM.vbox',
            'props': _props$1,
            'style': _style$2,
            'value': _value$3
        });
        return $500;
    };
    const DOM$vbox = x0 => x1 => x2 => DOM$vbox$(x0, x1, x2);

    function BitsMap$(_A$1) {
        var $501 = null;
        return $501;
    };
    const BitsMap = x0 => BitsMap$(x0);

    function Map$(_V$1) {
        var $502 = null;
        return $502;
    };
    const Map = x0 => Map$(x0);
    const BitsMap$new = ({
        _: 'BitsMap.new'
    });

    function BitsMap$tie$(_val$2, _lft$3, _rgt$4) {
        var $503 = ({
            _: 'BitsMap.tie',
            'val': _val$2,
            'lft': _lft$3,
            'rgt': _rgt$4
        });
        return $503;
    };
    const BitsMap$tie = x0 => x1 => x2 => BitsMap$tie$(x0, x1, x2);

    function Maybe$some$(_value$2) {
        var $504 = ({
            _: 'Maybe.some',
            'value': _value$2
        });
        return $504;
    };
    const Maybe$some = x0 => Maybe$some$(x0);
    const BitsMap$set = a0 => a1 => a2 => (bitsmap_set(a0, a1, a2, 'set'));
    const Bits$e = '';
    const Bits$o = a0 => (a0 + '0');
    const Bits$i = a0 => (a0 + '1');
    const Bits$concat = a0 => a1 => (a1 + a0);

    function Word$to_bits$(_a$2) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $506 = self.pred;
                var $507 = (Word$to_bits$($506) + '0');
                var $505 = $507;
                break;
            case 'Word.i':
                var $508 = self.pred;
                var $509 = (Word$to_bits$($508) + '1');
                var $505 = $509;
                break;
            case 'Word.e':
                var $510 = Bits$e;
                var $505 = $510;
                break;
        };
        return $505;
    };
    const Word$to_bits = x0 => Word$to_bits$(x0);
    const U16$to_bits = a0 => (u16_to_bits(a0));

    function String$to_bits$(_str$1) {
        var self = _str$1;
        if (self.length === 0) {
            var $512 = Bits$e;
            var $511 = $512;
        } else {
            var $513 = self.charCodeAt(0);
            var $514 = self.slice(1);
            var $515 = (String$to_bits$($514) + (u16_to_bits($513)));
            var $511 = $515;
        };
        return $511;
    };
    const String$to_bits = x0 => String$to_bits$(x0);

    function Map$from_list$(_xs$2) {
        var self = _xs$2;
        switch (self._) {
            case 'List.cons':
                var $517 = self.head;
                var $518 = self.tail;
                var self = $517;
                switch (self._) {
                    case 'Pair.new':
                        var $520 = self.fst;
                        var $521 = self.snd;
                        var $522 = (bitsmap_set(String$to_bits$($520), $521, Map$from_list$($518), 'set'));
                        var $519 = $522;
                        break;
                };
                var $516 = $519;
                break;
            case 'List.nil':
                var $523 = BitsMap$new;
                var $516 = $523;
                break;
        };
        return $516;
    };
    const Map$from_list = x0 => Map$from_list$(x0);

    function App$TicTacToe$draw$(_img$1, _state$2) {
        var _img$3 = App$TicTacToe$draw_vertical_lines$(_img$1);
        var _img$4 = App$TicTacToe$draw_horizontal_lines$(_img$3);
        var self = _state$2;
        switch (self._) {
            case 'App.Store.new':
                var $525 = self.local;
                var self = Vector$fold$(null, null, 9n, Pair$new$(_img$4, 8), (_entity$7 => _pair$8 => {
                    var self = _pair$8;
                    switch (self._) {
                        case 'Pair.new':
                            var $528 = self.fst;
                            var $529 = self.snd;
                            var self = _entity$7;
                            switch (self._) {
                                case 'Maybe.some':
                                    var $531 = self.value;
                                    var self = App$TicTacToe$pos$posvector_to_pair$($529);
                                    switch (self._) {
                                        case 'Pair.new':
                                            var $533 = self.fst;
                                            var $534 = self.snd;
                                            var _img$14 = VoxBox$Draw$image$($533, $534, 1, App$TicTacToe$entity$to_assets$($531), $528);
                                            var $535 = Pair$new$(_img$14, (($529 - 1) >>> 0));
                                            var $532 = $535;
                                            break;
                                    };
                                    var $530 = $532;
                                    break;
                                case 'Maybe.none':
                                    var $536 = Pair$new$($528, (($529 - 1) >>> 0));
                                    var $530 = $536;
                                    break;
                            };
                            var $527 = $530;
                            break;
                    };
                    return $527;
                }), (() => {
                    var self = $525;
                    switch (self._) {
                        case 'App.TicTacToe.State.local.new':
                            var $537 = self.board;
                            var $538 = $537;
                            return $538;
                    };
                })());
                switch (self._) {
                    case 'Pair.new':
                        var $539 = self.fst;
                        var $540 = DOM$vbox$(Map$from_list$(List$nil), Map$from_list$(List$nil), $539);
                        var $526 = $540;
                        break;
                };
                var $524 = $526;
                break;
        };
        return $524;
    };
    const App$TicTacToe$draw = x0 => x1 => App$TicTacToe$draw$(x0, x1);

    function IO$(_A$1) {
        var $541 = null;
        return $541;
    };
    const IO = x0 => IO$(x0);

    function Pair$fst$(_pair$3) {
        var self = _pair$3;
        switch (self._) {
            case 'Pair.new':
                var $543 = self.fst;
                var $544 = $543;
                var $542 = $544;
                break;
        };
        return $542;
    };
    const Pair$fst = x0 => Pair$fst$(x0);
    const App$State$local = Pair$fst;

    function IO$ask$(_query$2, _param$3, _then$4) {
        var $545 = ({
            _: 'IO.ask',
            'query': _query$2,
            'param': _param$3,
            'then': _then$4
        });
        return $545;
    };
    const IO$ask = x0 => x1 => x2 => IO$ask$(x0, x1, x2);

    function IO$bind$(_a$3, _f$4) {
        var self = _a$3;
        switch (self._) {
            case 'IO.end':
                var $547 = self.value;
                var $548 = _f$4($547);
                var $546 = $548;
                break;
            case 'IO.ask':
                var $549 = self.query;
                var $550 = self.param;
                var $551 = self.then;
                var $552 = IO$ask$($549, $550, (_x$8 => {
                    var $553 = IO$bind$($551(_x$8), _f$4);
                    return $553;
                }));
                var $546 = $552;
                break;
        };
        return $546;
    };
    const IO$bind = x0 => x1 => IO$bind$(x0, x1);

    function IO$end$(_value$2) {
        var $554 = ({
            _: 'IO.end',
            'value': _value$2
        });
        return $554;
    };
    const IO$end = x0 => IO$end$(x0);

    function IO$monad$(_new$2) {
        var $555 = _new$2(IO$bind)(IO$end);
        return $555;
    };
    const IO$monad = x0 => IO$monad$(x0);
    const App$pass = IO$monad$((_m$bind$2 => _m$pure$3 => {
        var $556 = _m$pure$3;
        return $556;
    }))(Maybe$none);

    function App$set_local$(_value$2) {
        var $557 = IO$monad$((_m$bind$3 => _m$pure$4 => {
            var $558 = _m$pure$4;
            return $558;
        }))(Maybe$some$(_value$2));
        return $557;
    };
    const App$set_local = x0 => App$set_local$(x0);

    function Word$gtn$(_a$2, _b$3) {
        var $559 = Cmp$as_gtn$(Word$cmp$(_a$2, _b$3));
        return $559;
    };
    const Word$gtn = x0 => x1 => Word$gtn$(x0, x1);
    const U32$gtn = a0 => a1 => (a0 > a1);
    const App$TicTacToe$constant$edge = ((App$TicTacToe$constant$size / 12) >>> 0);
    const edge = App$TicTacToe$constant$edge;

    function Word$ltn$(_a$2, _b$3) {
        var $560 = Cmp$as_ltn$(Word$cmp$(_a$2, _b$3));
        return $560;
    };
    const Word$ltn = x0 => x1 => Word$ltn$(x0, x1);
    const U32$ltn = a0 => a1 => (a0 < a1);

    function App$TicTacToe$pos$mouse_to_tile$(_pos$1) {
        var self = (_pos$1 > edge);
        if (self) {
            var self = (_pos$1 < ((App$TicTacToe$constant$size - edge) >>> 0));
            if (self) {
                var $563 = ((_pos$1 / side_tale) >>> 0);
                var $562 = $563;
            } else {
                var $564 = 10;
                var $562 = $564;
            };
            var $561 = $562;
        } else {
            var $565 = 10;
            var $561 = $565;
        };
        return $561;
    };
    const App$TicTacToe$pos$mouse_to_tile = x0 => App$TicTacToe$pos$mouse_to_tile$(x0);

    function App$TicTacToe$pos$pair_to_minipair$(_pair$1) {
        var self = _pair$1;
        switch (self._) {
            case 'Pair.new':
                var $567 = self.fst;
                var $568 = self.snd;
                var $569 = Pair$new$(App$TicTacToe$pos$mouse_to_tile$($567), App$TicTacToe$pos$mouse_to_tile$($568));
                var $566 = $569;
                break;
        };
        return $566;
    };
    const App$TicTacToe$pos$pair_to_minipair = x0 => App$TicTacToe$pos$pair_to_minipair$(x0);

    function App$TicTacToe$pos$pair_to_posvector$(_pair$1) {
        var _trans$2 = App$TicTacToe$pos$pair_to_minipair$(_pair$1);
        var self = _trans$2;
        switch (self._) {
            case 'Pair.new':
                var $571 = self.fst;
                var $572 = self.snd;
                var $573 = (($572 + (($571 * 3) >>> 0)) >>> 0);
                var $570 = $573;
                break;
        };
        return $570;
    };
    const App$TicTacToe$pos$pair_to_posvector = x0 => App$TicTacToe$pos$pair_to_posvector$(x0);

    function Vector$simply_insert$(_A$1, _size$2, _n$3, _v$4, _vec$5) {
        var self = _size$2;
        if (self === 0n) {
            var $575 = (_vec$6 => {
                var $576 = Vector$nil(null);
                return $576;
            });
            var $574 = $575;
        } else {
            var $577 = (self - 1n);
            var $578 = (_vec$7 => {
                var self = _n$3;
                if (self === 0n) {
                    var $580 = _vec$7((_vec$self$8 => {
                        var $581 = null;
                        return $581;
                    }))((_vec$head$8 => _vec$tail$9 => {
                        var $582 = Vector$cons(null)($577)(_v$4)(_vec$tail$9);
                        return $582;
                    }));
                    var $579 = $580;
                } else {
                    var $583 = (self - 1n);
                    var $584 = _vec$7((_vec$self$9 => {
                        var $585 = null;
                        return $585;
                    }))((_vec$head$9 => _vec$tail$10 => {
                        var $586 = Vector$cons(null)($577)(_vec$head$9)(Vector$simply_insert$(null, $577, $583, _v$4, _vec$tail$10));
                        return $586;
                    }));
                    var $579 = $584;
                };
                return $579;
            });
            var $574 = $578;
        };
        var $574 = $574(_vec$5);
        return $574;
    };
    const Vector$simply_insert = x0 => x1 => x2 => x3 => x4 => Vector$simply_insert$(x0, x1, x2, x3, x4);
    const U32$to_nat = a0 => (BigInt(a0));

    function App$TicTacToe$Board$insert_entity$(_pos$1, _e$2, _state$3) {
        var self = _e$2;
        switch (self._) {
            case 'App.TicTacToe.Entity.circle':
            case 'App.TicTacToe.Entity.x':
                var _n$4 = App$TicTacToe$pos$pair_to_posvector$(_pos$1);
                var self = _state$3;
                switch (self._) {
                    case 'App.TicTacToe.State.local.new':
                        var $589 = self.info;
                        var $590 = App$TicTacToe$State$local$new$(Vector$simply_insert$(null, 9n, (BigInt(_n$4)), Maybe$some$(_e$2), (() => {
                            var self = _state$3;
                            switch (self._) {
                                case 'App.TicTacToe.State.local.new':
                                    var $591 = self.board;
                                    var $592 = $591;
                                    return $592;
                            };
                        })()), $589);
                        var $588 = $590;
                        break;
                };
                var $587 = $588;
                break;
        };
        return $587;
    };
    const App$TicTacToe$Board$insert_entity = x0 => x1 => x2 => App$TicTacToe$Board$insert_entity$(x0, x1, x2);
    const App$TicTacToe$Entity$circle = ({
        _: 'App.TicTacToe.Entity.circle'
    });

    function App$TicTacToe$when$(_event$1, _state$2) {
        var self = _event$1;
        switch (self._) {
            case 'App.Event.frame':
                var $594 = self.info;
                var self = _state$2;
                switch (self._) {
                    case 'App.Store.new':
                        var $596 = self.local;
                        var $597 = App$set_local$((() => {
                            var self = $596;
                            switch (self._) {
                                case 'App.TicTacToe.State.local.new':
                                    var $598 = self.board;
                                    var $599 = App$TicTacToe$State$local$new$($598, $594);
                                    return $599;
                            };
                        })());
                        var $595 = $597;
                        break;
                };
                var $593 = $595;
                break;
            case 'App.Event.init':
            case 'App.Event.mouse_down':
            case 'App.Event.key_down':
            case 'App.Event.key_up':
            case 'App.Event.mouse_over':
            case 'App.Event.mouse_click':
            case 'App.Event.input':
                var $600 = App$pass;
                var $593 = $600;
                break;
            case 'App.Event.mouse_up':
                var self = _state$2;
                switch (self._) {
                    case 'App.Store.new':
                        var $602 = self.local;
                        var self = $602;
                        switch (self._) {
                            case 'App.TicTacToe.State.local.new':
                                var $604 = self.info;
                                var $605 = $604;
                                var _info$7 = $605;
                                break;
                        };
                        var self = _info$7;
                        switch (self._) {
                            case 'App.EnvInfo.new':
                                var $606 = self.mouse_pos;
                                var _state$10 = App$TicTacToe$Board$insert_entity$($606, App$TicTacToe$Entity$circle, $602);
                                var $607 = App$set_local$(_state$10);
                                var $603 = $607;
                                break;
                        };
                        var $601 = $603;
                        break;
                };
                var $593 = $601;
                break;
        };
        return $593;
    };
    const App$TicTacToe$when = x0 => x1 => App$TicTacToe$when$(x0, x1);

    function App$TicTacToe$tick$(_tick$1, _glob$2) {
        var $608 = _glob$2;
        return $608;
    };
    const App$TicTacToe$tick = x0 => x1 => App$TicTacToe$tick$(x0, x1);

    function App$TicTacToe$post$(_time$1, _room$2, _addr$3, _data$4, _glob$5) {
        var $609 = _glob$5;
        return $609;
    };
    const App$TicTacToe$post = x0 => x1 => x2 => x3 => x4 => App$TicTacToe$post$(x0, x1, x2, x3, x4);

    function App$new$(_init$2, _draw$3, _when$4, _tick$5, _post$6) {
        var $610 = ({
            _: 'App.new',
            'init': _init$2,
            'draw': _draw$3,
            'when': _when$4,
            'tick': _tick$5,
            'post': _post$6
        });
        return $610;
    };
    const App$new = x0 => x1 => x2 => x3 => x4 => App$new$(x0, x1, x2, x3, x4);
    const App$TicTacToe = (() => {
        var _img$1 = VoxBox$alloc_capacity$(((65536 * 8) >>> 0));
        var _init$2 = App$TicTacToe$init;
        var _draw$3 = App$TicTacToe$draw(_img$1);
        var _when$4 = App$TicTacToe$when;
        var _tick$5 = App$TicTacToe$tick;
        var _post$6 = App$TicTacToe$post;
        var $611 = App$new$(_init$2, _draw$3, _when$4, _tick$5, _post$6);
        return $611;
    })();
    return {
        'Buffer32.new': Buffer32$new,
        'Array': Array,
        'Array.tip': Array$tip,
        'Array.tie': Array$tie,
        'Array.alloc': Array$alloc,
        'U32.new': U32$new,
        'Word': Word,
        'Word.e': Word$e,
        'Word.o': Word$o,
        'Word.zero': Word$zero,
        'Nat.succ': Nat$succ,
        'Nat.zero': Nat$zero,
        'U32.zero': U32$zero,
        'Buffer32.alloc': Buffer32$alloc,
        'Word.bit_length.go': Word$bit_length$go,
        'Word.bit_length': Word$bit_length,
        'U32.bit_length': U32$bit_length,
        'Word.i': Word$i,
        'Bool.false': Bool$false,
        'Bool.true': Bool$true,
        'Word.shift_left.one.go': Word$shift_left$one$go,
        'Word.shift_left.one': Word$shift_left$one,
        'Word.shift_left': Word$shift_left,
        'Word.adder': Word$adder,
        'Word.add': Word$add,
        'Word.mul.go': Word$mul$go,
        'Word.to_zero': Word$to_zero,
        'Word.mul': Word$mul,
        'U32.mul': U32$mul,
        'Nat.apply': Nat$apply,
        'Word.inc': Word$inc,
        'Nat.to_word': Nat$to_word,
        'Nat.to_u32': Nat$to_u32,
        'VoxBox.new': VoxBox$new,
        'VoxBox.alloc_capacity': VoxBox$alloc_capacity,
        'App.Store.new': App$Store$new,
        'Pair.new': Pair$new,
        'App.State.new': App$State$new,
        'App.TicTacToe.State': App$TicTacToe$State,
        'App.TicTacToe.State.local.new': App$TicTacToe$State$local$new,
        'Vector': Vector,
        'Vector.nil': Vector$nil,
        'Vector.cons': Vector$cons,
        'Vector.fill': Vector$fill,
        'Maybe': Maybe,
        'Maybe.none': Maybe$none,
        'App.EnvInfo.new': App$EnvInfo$new,
        'U32.from_nat': U32$from_nat,
        'App.TicTacToe.State.global.new': App$TicTacToe$State$global$new,
        'App.TicTacToe.init': App$TicTacToe$init,
        'I32.new': I32$new,
        'Nat.ltn': Nat$ltn,
        'Nat.sub': Nat$sub,
        'Cmp.as_gte': Cmp$as_gte,
        'Cmp.ltn': Cmp$ltn,
        'Cmp.gtn': Cmp$gtn,
        'Word.cmp.go': Word$cmp$go,
        'Cmp.eql': Cmp$eql,
        'Word.cmp': Word$cmp,
        'Word.gte': Word$gte,
        'Pair': Pair,
        'Word.or': Word$or,
        'Word.shift_right.one.go': Word$shift_right$one$go,
        'Word.shift_right.one': Word$shift_right$one,
        'Word.shift_right': Word$shift_right,
        'Word.subber': Word$subber,
        'Word.sub': Word$sub,
        'Word.div.go': Word$div$go,
        'Word.div': Word$div,
        'I32.div': I32$div,
        'F64.to_i32': F64$to_i32,
        'Word.to_f64': Word$to_f64,
        'U32.to_f64': U32$to_f64,
        'U32.to_i32': U32$to_i32,
        'App.TicTacToe.constant.size': App$TicTacToe$constant$size,
        'side_board': side_board,
        'Word.neg.aux': Word$neg$aux,
        'Word.neg': Word$neg,
        'I32.neg': I32$neg,
        'Int.to_i32': Int$to_i32,
        'Int.new': Int$new,
        'Int.from_nat': Int$from_nat,
        'I32.from_nat': I32$from_nat,
        'Word.is_neg.go': Word$is_neg$go,
        'Word.is_neg': Word$is_neg,
        'Word.fold': Word$fold,
        'Nat.add': Nat$add,
        'Nat.mul': Nat$mul,
        'Word.to_nat': Word$to_nat,
        'Word.shl': Word$shl,
        'Word.shr': Word$shr,
        'Word.s_shr': Word$s_shr,
        'I32.shr': I32$shr,
        'Word.xor': Word$xor,
        'I32.xor': I32$xor,
        'I32.add': I32$add,
        'I32.abs': I32$abs,
        'I32.sub': I32$sub,
        'Cmp.as_ltn': Cmp$as_ltn,
        'Cmp.inv': Cmp$inv,
        'Word.s_ltn': Word$s_ltn,
        'I32.ltn': I32$ltn,
        'List': List,
        'Cmp.as_gtn': Cmp$as_gtn,
        'Word.s_gtn': Word$s_gtn,
        'I32.gtn': I32$gtn,
        'I32.mul': I32$mul,
        'Cmp.as_eql': Cmp$as_eql,
        'Word.eql': Word$eql,
        'I32.eql': I32$eql,
        'List.cons': List$cons,
        'VoxBox.Draw.line.coords.low.go': VoxBox$Draw$line$coords$low$go,
        'List.nil': List$nil,
        'VoxBox.Draw.line.coords.low': VoxBox$Draw$line$coords$low,
        'VoxBox.Draw.line.coords.high.go': VoxBox$Draw$line$coords$high$go,
        'VoxBox.Draw.line.coords.high': VoxBox$Draw$line$coords$high,
        'VoxBox.Draw.line.coords': VoxBox$Draw$line$coords,
        'List.for': List$for,
        'Word.trim': Word$trim,
        'Unit.new': Unit$new,
        'Array.extract_tip': Array$extract_tip,
        'Array.extract_tie': Array$extract_tie,
        'Word.foldl': Word$foldl,
        'Array.mut': Array$mut,
        'Array.set': Array$set,
        'Buffer32.set': Buffer32$set,
        'VoxBox.set_pos': VoxBox$set_pos,
        'U32.add': U32$add,
        'VoxBox.set_col': VoxBox$set_col,
        'VoxBox.set_length': VoxBox$set_length,
        'VoxBox.push': VoxBox$push,
        'U32.or': U32$or,
        'U32.shl': U32$shl,
        'Pos32.new': Pos32$new,
        'F64.to_u32': F64$to_u32,
        'Word.s_to_f64': Word$s_to_f64,
        'I32.to_f64': I32$to_f64,
        'I32.to_u32': I32$to_u32,
        'VoxBox.Draw.line': VoxBox$Draw$line,
        'Col32.new': Col32$new,
        'App.TicTacToe.draw_vertical_lines': App$TicTacToe$draw_vertical_lines,
        'App.TicTacToe.draw_horizontal_lines': App$TicTacToe$draw_horizontal_lines,
        'Vector.fold': Vector$fold,
        'U32.sub': U32$sub,
        'U32.div': U32$div,
        'Word.mod': Word$mod,
        'U32.mod': U32$mod,
        'App.TicTacToe.pos.posvector_to_minipair': App$TicTacToe$pos$posvector_to_minipair,
        'App.TicTacToe.constant.side_tale': App$TicTacToe$constant$side_tale,
        'side_tale': side_tale,
        'App.TicTacToe.pos.posvector_to_pair': App$TicTacToe$pos$posvector_to_pair,
        'VoxBox.get_len': VoxBox$get_len,
        'U32.eql': U32$eql,
        'U32.inc': U32$inc,
        'U32.for': U32$for,
        'Array.get': Array$get,
        'Buffer32.get': Buffer32$get,
        'VoxBox.get_pos': VoxBox$get_pos,
        'VoxBox.get_col': VoxBox$get_col,
        'Word.and': Word$and,
        'U32.and': U32$and,
        'U32.shr': U32$shr,
        'VoxBox.Draw.image': VoxBox$Draw$image,
        'U32.length': U32$length,
        'Word.slice': Word$slice,
        'U32.slice': U32$slice,
        'U32.read_base': U32$read_base,
        'VoxBox.parse_byte': VoxBox$parse_byte,
        'VoxBox.parse': VoxBox$parse,
        'App.TicTacToe.Assets.circle': App$TicTacToe$Assets$circle,
        'App.TicTacToe.Assets.x': App$TicTacToe$Assets$x,
        'App.TicTacToe.entity.to_assets': App$TicTacToe$entity$to_assets,
        'DOM.vbox': DOM$vbox,
        'BitsMap': BitsMap,
        'Map': Map,
        'BitsMap.new': BitsMap$new,
        'BitsMap.tie': BitsMap$tie,
        'Maybe.some': Maybe$some,
        'BitsMap.set': BitsMap$set,
        'Bits.e': Bits$e,
        'Bits.o': Bits$o,
        'Bits.i': Bits$i,
        'Bits.concat': Bits$concat,
        'Word.to_bits': Word$to_bits,
        'U16.to_bits': U16$to_bits,
        'String.to_bits': String$to_bits,
        'Map.from_list': Map$from_list,
        'App.TicTacToe.draw': App$TicTacToe$draw,
        'IO': IO,
        'Pair.fst': Pair$fst,
        'App.State.local': App$State$local,
        'IO.ask': IO$ask,
        'IO.bind': IO$bind,
        'IO.end': IO$end,
        'IO.monad': IO$monad,
        'App.pass': App$pass,
        'App.set_local': App$set_local,
        'Word.gtn': Word$gtn,
        'U32.gtn': U32$gtn,
        'App.TicTacToe.constant.edge': App$TicTacToe$constant$edge,
        'edge': edge,
        'Word.ltn': Word$ltn,
        'U32.ltn': U32$ltn,
        'App.TicTacToe.pos.mouse_to_tile': App$TicTacToe$pos$mouse_to_tile,
        'App.TicTacToe.pos.pair_to_minipair': App$TicTacToe$pos$pair_to_minipair,
        'App.TicTacToe.pos.pair_to_posvector': App$TicTacToe$pos$pair_to_posvector,
        'Vector.simply_insert': Vector$simply_insert,
        'U32.to_nat': U32$to_nat,
        'App.TicTacToe.Board.insert_entity': App$TicTacToe$Board$insert_entity,
        'App.TicTacToe.Entity.circle': App$TicTacToe$Entity$circle,
        'App.TicTacToe.when': App$TicTacToe$when,
        'App.TicTacToe.tick': App$TicTacToe$tick,
        'App.TicTacToe.post': App$TicTacToe$post,
        'App.new': App$new,
        'App.TicTacToe': App$TicTacToe,
    };
})();

/***/ })

}]);
//# sourceMappingURL=373.index.js.map