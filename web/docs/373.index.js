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
    const App$TicTacToe$constant$size = 256;
    const side_board = App$TicTacToe$constant$size;

    function Word$neg$aux$(_word$2, _inc$3) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $278 = self.pred;
                var self = _inc$3;
                if (self) {
                    var $280 = Word$o$(Word$neg$aux$($278, Bool$true));
                    var $279 = $280;
                } else {
                    var $281 = Word$i$(Word$neg$aux$($278, Bool$false));
                    var $279 = $281;
                };
                var $277 = $279;
                break;
            case 'Word.i':
                var $282 = self.pred;
                var self = _inc$3;
                if (self) {
                    var $284 = Word$i$(Word$neg$aux$($282, Bool$false));
                    var $283 = $284;
                } else {
                    var $285 = Word$o$(Word$neg$aux$($282, Bool$false));
                    var $283 = $285;
                };
                var $277 = $283;
                break;
            case 'Word.e':
                var $286 = Word$e;
                var $277 = $286;
                break;
        };
        return $277;
    };
    const Word$neg$aux = x0 => x1 => Word$neg$aux$(x0, x1);

    function Word$neg$(_word$2) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $288 = self.pred;
                var $289 = Word$o$(Word$neg$aux$($288, Bool$true));
                var $287 = $289;
                break;
            case 'Word.i':
                var $290 = self.pred;
                var $291 = Word$i$(Word$neg$aux$($290, Bool$false));
                var $287 = $291;
                break;
            case 'Word.e':
                var $292 = Word$e;
                var $287 = $292;
                break;
        };
        return $287;
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
                        var $293 = self.pred;
                        var $294 = Word$is_neg$go$($293, Bool$false);
                        return $294;
                    case 'Word.i':
                        var $295 = self.pred;
                        var $296 = Word$is_neg$go$($295, Bool$true);
                        return $296;
                    case 'Word.e':
                        var $297 = _n$3;
                        return $297;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Word$is_neg$go = x0 => x1 => Word$is_neg$go$(x0, x1);

    function Word$is_neg$(_word$2) {
        var $298 = Word$is_neg$go$(_word$2, Bool$false);
        return $298;
    };
    const Word$is_neg = x0 => Word$is_neg$(x0);

    function Word$fold$(_nil$3, _w0$4, _w1$5, _word$6) {
        var self = _word$6;
        switch (self._) {
            case 'Word.o':
                var $300 = self.pred;
                var $301 = _w0$4(Word$fold$(_nil$3, _w0$4, _w1$5, $300));
                var $299 = $301;
                break;
            case 'Word.i':
                var $302 = self.pred;
                var $303 = _w1$5(Word$fold$(_nil$3, _w0$4, _w1$5, $302));
                var $299 = $303;
                break;
            case 'Word.e':
                var $304 = _nil$3;
                var $299 = $304;
                break;
        };
        return $299;
    };
    const Word$fold = x0 => x1 => x2 => x3 => Word$fold$(x0, x1, x2, x3);
    const Nat$add = a0 => a1 => (a0 + a1);
    const Nat$mul = a0 => a1 => (a0 * a1);

    function Word$to_nat$(_word$2) {
        var $305 = Word$fold$(0n, a1 => (2n * a1), (_x$4 => {
            var $306 = Nat$succ$((2n * _x$4));
            return $306;
        }), _word$2);
        return $305;
    };
    const Word$to_nat = x0 => Word$to_nat$(x0);

    function Word$shl$(_n$2, _value$3) {
        var _n_nat$4 = Word$to_nat$(_n$2);
        var $307 = Word$shift_left$(_n_nat$4, _value$3);
        return $307;
    };
    const Word$shl = x0 => x1 => Word$shl$(x0, x1);

    function Word$shr$(_n$2, _value$3) {
        var _n_nat$4 = Word$to_nat$(_n$2);
        var $308 = Word$shift_right$(_n_nat$4, _value$3);
        return $308;
    };
    const Word$shr = x0 => x1 => Word$shr$(x0, x1);

    function Word$s_shr$(_n$2, _value$3) {
        var _neg$4 = Word$is_neg$(_n$2);
        var self = _neg$4;
        if (self) {
            var _n$5 = Word$neg$(_n$2);
            var $310 = Word$shl$(_n$5, _value$3);
            var $309 = $310;
        } else {
            var $311 = Word$shr$(_n$2, _value$3);
            var $309 = $311;
        };
        return $309;
    };
    const Word$s_shr = x0 => x1 => Word$s_shr$(x0, x1);
    const I32$shr = a0 => a1 => (a0 >> a1);

    function Word$xor$(_a$2, _b$3) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $313 = self.pred;
                var $314 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $316 = self.pred;
                            var $317 = (_a$pred$9 => {
                                var $318 = Word$o$(Word$xor$(_a$pred$9, $316));
                                return $318;
                            });
                            var $315 = $317;
                            break;
                        case 'Word.i':
                            var $319 = self.pred;
                            var $320 = (_a$pred$9 => {
                                var $321 = Word$i$(Word$xor$(_a$pred$9, $319));
                                return $321;
                            });
                            var $315 = $320;
                            break;
                        case 'Word.e':
                            var $322 = (_a$pred$7 => {
                                var $323 = Word$e;
                                return $323;
                            });
                            var $315 = $322;
                            break;
                    };
                    var $315 = $315($313);
                    return $315;
                });
                var $312 = $314;
                break;
            case 'Word.i':
                var $324 = self.pred;
                var $325 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $327 = self.pred;
                            var $328 = (_a$pred$9 => {
                                var $329 = Word$i$(Word$xor$(_a$pred$9, $327));
                                return $329;
                            });
                            var $326 = $328;
                            break;
                        case 'Word.i':
                            var $330 = self.pred;
                            var $331 = (_a$pred$9 => {
                                var $332 = Word$o$(Word$xor$(_a$pred$9, $330));
                                return $332;
                            });
                            var $326 = $331;
                            break;
                        case 'Word.e':
                            var $333 = (_a$pred$7 => {
                                var $334 = Word$e;
                                return $334;
                            });
                            var $326 = $333;
                            break;
                    };
                    var $326 = $326($324);
                    return $326;
                });
                var $312 = $325;
                break;
            case 'Word.e':
                var $335 = (_b$4 => {
                    var $336 = Word$e;
                    return $336;
                });
                var $312 = $335;
                break;
        };
        var $312 = $312(_b$3);
        return $312;
    };
    const Word$xor = x0 => x1 => Word$xor$(x0, x1);
    const I32$xor = a0 => a1 => (a0 ^ a1);
    const I32$add = a0 => a1 => ((a0 + a1) >> 0);

    function I32$abs$(_a$1) {
        var _mask$2 = (_a$1 >> 31);
        var $337 = (((_mask$2 + _a$1) >> 0) ^ _mask$2);
        return $337;
    };
    const I32$abs = x0 => I32$abs$(x0);
    const I32$sub = a0 => a1 => ((a0 - a1) >> 0);

    function Cmp$as_ltn$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
                var $339 = Bool$true;
                var $338 = $339;
                break;
            case 'Cmp.eql':
            case 'Cmp.gtn':
                var $340 = Bool$false;
                var $338 = $340;
                break;
        };
        return $338;
    };
    const Cmp$as_ltn = x0 => Cmp$as_ltn$(x0);

    function Cmp$inv$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
                var $342 = Cmp$gtn;
                var $341 = $342;
                break;
            case 'Cmp.eql':
                var $343 = Cmp$eql;
                var $341 = $343;
                break;
            case 'Cmp.gtn':
                var $344 = Cmp$ltn;
                var $341 = $344;
                break;
        };
        return $341;
    };
    const Cmp$inv = x0 => Cmp$inv$(x0);

    function Word$s_ltn$(_a$2, _b$3) {
        var _neg_a$4 = Word$is_neg$(_a$2);
        var _neg_b$5 = Word$is_neg$(_b$3);
        var self = _neg_a$4;
        if (self) {
            var self = _neg_b$5;
            if (self) {
                var $347 = Cmp$as_ltn$(Cmp$inv$(Word$cmp$(_a$2, _b$3)));
                var $346 = $347;
            } else {
                var $348 = Bool$true;
                var $346 = $348;
            };
            var $345 = $346;
        } else {
            var self = _neg_b$5;
            if (self) {
                var $350 = Bool$false;
                var $349 = $350;
            } else {
                var $351 = Cmp$as_ltn$(Word$cmp$(_a$2, _b$3));
                var $349 = $351;
            };
            var $345 = $349;
        };
        return $345;
    };
    const Word$s_ltn = x0 => x1 => Word$s_ltn$(x0, x1);
    const I32$ltn = a0 => a1 => (a0 < a1);

    function List$(_A$1) {
        var $352 = null;
        return $352;
    };
    const List = x0 => List$(x0);

    function Cmp$as_gtn$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
            case 'Cmp.eql':
                var $354 = Bool$false;
                var $353 = $354;
                break;
            case 'Cmp.gtn':
                var $355 = Bool$true;
                var $353 = $355;
                break;
        };
        return $353;
    };
    const Cmp$as_gtn = x0 => Cmp$as_gtn$(x0);

    function Word$s_gtn$(_a$2, _b$3) {
        var _neg_a$4 = Word$is_neg$(_a$2);
        var _neg_b$5 = Word$is_neg$(_b$3);
        var self = _neg_a$4;
        if (self) {
            var self = _neg_b$5;
            if (self) {
                var $358 = Cmp$as_gtn$(Cmp$inv$(Word$cmp$(_a$2, _b$3)));
                var $357 = $358;
            } else {
                var $359 = Bool$false;
                var $357 = $359;
            };
            var $356 = $357;
        } else {
            var self = _neg_b$5;
            if (self) {
                var $361 = Bool$true;
                var $360 = $361;
            } else {
                var $362 = Cmp$as_gtn$(Word$cmp$(_a$2, _b$3));
                var $360 = $362;
            };
            var $356 = $360;
        };
        return $356;
    };
    const Word$s_gtn = x0 => x1 => Word$s_gtn$(x0, x1);
    const I32$gtn = a0 => a1 => (a0 > a1);
    const I32$mul = a0 => a1 => ((a0 * a1) >> 0);

    function Cmp$as_eql$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
            case 'Cmp.gtn':
                var $364 = Bool$false;
                var $363 = $364;
                break;
            case 'Cmp.eql':
                var $365 = Bool$true;
                var $363 = $365;
                break;
        };
        return $363;
    };
    const Cmp$as_eql = x0 => Cmp$as_eql$(x0);

    function Word$eql$(_a$2, _b$3) {
        var $366 = Cmp$as_eql$(Word$cmp$(_a$2, _b$3));
        return $366;
    };
    const Word$eql = x0 => x1 => Word$eql$(x0, x1);
    const I32$eql = a0 => a1 => (a0 === a1);

    function List$cons$(_head$2, _tail$3) {
        var $367 = ({
            _: 'List.cons',
            'head': _head$2,
            'tail': _tail$3
        });
        return $367;
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
                    var $368 = List$cons$(Pair$new$(_x0$1, _y0$2), _coords$9);
                    return $368;
                } else {
                    var _new_x$10 = ((1 + _x0$1) >> 0);
                    var self = (_d$8 > 0);
                    if (self) {
                        var _new_y$11 = ((_yi$5 + _y0$2) >> 0);
                        var _new_d$12 = ((_d$8 + ((2 * ((_dy$7 - _dx$6) >> 0)) >> 0)) >> 0);
                        var $370 = VoxBox$Draw$line$coords$low$go$(_new_x$10, _new_y$11, _x1$3, _y1$4, _yi$5, _dx$6, _dy$7, _new_d$12, List$cons$(Pair$new$(_x0$1, _y0$2), _coords$9));
                        var $369 = $370;
                    } else {
                        var _new_d$11 = ((_d$8 + ((2 * _dy$7) >> 0)) >> 0);
                        var $371 = VoxBox$Draw$line$coords$low$go$(_new_x$10, _y0$2, _x1$3, _y1$4, _yi$5, _dx$6, _dy$7, _new_d$11, List$cons$(Pair$new$(_x0$1, _y0$2), _coords$9));
                        var $369 = $371;
                    };
                    return $369;
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
            var $373 = 1;
            var _yi$7 = $373;
        } else {
            var $374 = ((-1));
            var _yi$7 = $374;
        };
        var _d$8 = ((((2 * _dy$6) >> 0) - _dx$5) >> 0);
        var $372 = VoxBox$Draw$line$coords$low$go$(_x0$1, _y0$2, _x1$3, _y1$4, _yi$7, _dx$5, _dy$6, _d$8, List$nil);
        return $372;
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
                    var $375 = List$cons$(Pair$new$(_x0$1, _y0$2), _coords$9);
                    return $375;
                } else {
                    var _new_y$10 = ((1 + _y0$2) >> 0);
                    var self = (_d$8 > 0);
                    if (self) {
                        var _new_x$11 = ((_x0$1 + _xi$5) >> 0);
                        var _new_d$12 = ((_d$8 + ((2 * ((_dx$6 - _dy$7) >> 0)) >> 0)) >> 0);
                        var $377 = VoxBox$Draw$line$coords$high$go$(_new_x$11, _new_y$10, _x1$3, _y1$4, _xi$5, _dx$6, _dy$7, _new_d$12, List$cons$(Pair$new$(_x0$1, _y0$2), _coords$9));
                        var $376 = $377;
                    } else {
                        var _new_d$11 = ((_d$8 + ((2 * _dx$6) >> 0)) >> 0);
                        var $378 = VoxBox$Draw$line$coords$high$go$(_x0$1, _new_y$10, _x1$3, _y1$4, _xi$5, _dx$6, _dy$7, _new_d$11, List$cons$(Pair$new$(_x0$1, _y0$2), _coords$9));
                        var $376 = $378;
                    };
                    return $376;
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
            var $380 = ((-1));
            var _xi$7 = $380;
        } else {
            var $381 = 1;
            var _xi$7 = $381;
        };
        var _d$8 = ((((2 * _dx$5) >> 0) - _dy$6) >> 0);
        var $379 = VoxBox$Draw$line$coords$high$go$(_x0$1, _y0$2, _x1$3, _y1$4, _xi$7, _dx$5, _dy$6, _d$8, List$nil);
        return $379;
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
                var $384 = VoxBox$Draw$line$coords$low$(_x1$3, _y1$4, _x0$1, _y0$2);
                var $383 = $384;
            } else {
                var $385 = VoxBox$Draw$line$coords$low$(_x0$1, _y0$2, _x1$3, _y1$4);
                var $383 = $385;
            };
            var $382 = $383;
        } else {
            var self = (_y0$2 > _y1$4);
            if (self) {
                var $387 = VoxBox$Draw$line$coords$high$(_x1$3, _y1$4, _x0$1, _y0$2);
                var $386 = $387;
            } else {
                var $388 = VoxBox$Draw$line$coords$high$(_x0$1, _y0$2, _x1$3, _y1$4);
                var $386 = $388;
            };
            var $382 = $386;
        };
        return $382;
    };
    const VoxBox$Draw$line$coords = x0 => x1 => x2 => x3 => VoxBox$Draw$line$coords$(x0, x1, x2, x3);
    const List$for = a0 => a1 => a2 => (list_for(a0)(a1)(a2));

    function Word$trim$(_new_size$2, _word$3) {
        var self = _new_size$2;
        if (self === 0n) {
            var $390 = Word$e;
            var $389 = $390;
        } else {
            var $391 = (self - 1n);
            var self = _word$3;
            switch (self._) {
                case 'Word.o':
                    var $393 = self.pred;
                    var $394 = Word$o$(Word$trim$($391, $393));
                    var $392 = $394;
                    break;
                case 'Word.i':
                    var $395 = self.pred;
                    var $396 = Word$i$(Word$trim$($391, $395));
                    var $392 = $396;
                    break;
                case 'Word.e':
                    var $397 = Word$o$(Word$trim$($391, Word$e));
                    var $392 = $397;
                    break;
            };
            var $389 = $392;
        };
        return $389;
    };
    const Word$trim = x0 => x1 => Word$trim$(x0, x1);
    const Unit$new = null;

    function Array$extract_tip$(_arr$2) {
        var self = _arr$2;
        switch (self._) {
            case 'Array.tip':
                var $399 = self.value;
                var $400 = $399;
                var $398 = $400;
                break;
            case 'Array.tie':
                var $401 = Unit$new;
                var $398 = $401;
                break;
        };
        return $398;
    };
    const Array$extract_tip = x0 => Array$extract_tip$(x0);

    function Array$extract_tie$(_arr$3) {
        var self = _arr$3;
        switch (self._) {
            case 'Array.tie':
                var $403 = self.lft;
                var $404 = self.rgt;
                var $405 = Pair$new$($403, $404);
                var $402 = $405;
                break;
            case 'Array.tip':
                var $406 = Unit$new;
                var $402 = $406;
                break;
        };
        return $402;
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
                        var $407 = self.pred;
                        var $408 = Word$foldl$(_w0$4(_nil$3), _w0$4, _w1$5, $407);
                        return $408;
                    case 'Word.i':
                        var $409 = self.pred;
                        var $410 = Word$foldl$(_w1$5(_nil$3), _w0$4, _w1$5, $409);
                        return $410;
                    case 'Word.e':
                        var $411 = _nil$3;
                        return $411;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Word$foldl = x0 => x1 => x2 => x3 => Word$foldl$(x0, x1, x2, x3);

    function Array$mut$(_idx$3, _f$4, _arr$5) {
        var $412 = Word$foldl$((_arr$6 => {
            var $413 = Array$tip$(_f$4(Array$extract_tip$(_arr$6)));
            return $413;
        }), (_rec$7 => _arr$8 => {
            var self = Array$extract_tie$(_arr$8);
            switch (self._) {
                case 'Pair.new':
                    var $415 = self.fst;
                    var $416 = self.snd;
                    var $417 = Array$tie$(_rec$7($415), $416);
                    var $414 = $417;
                    break;
            };
            return $414;
        }), (_rec$7 => _arr$8 => {
            var self = Array$extract_tie$(_arr$8);
            switch (self._) {
                case 'Pair.new':
                    var $419 = self.fst;
                    var $420 = self.snd;
                    var $421 = Array$tie$($419, _rec$7($420));
                    var $418 = $421;
                    break;
            };
            return $418;
        }), _idx$3)(_arr$5);
        return $412;
    };
    const Array$mut = x0 => x1 => x2 => Array$mut$(x0, x1, x2);

    function Array$set$(_idx$3, _val$4, _arr$5) {
        var $422 = Array$mut$(_idx$3, (_x$6 => {
            var $423 = _val$4;
            return $423;
        }), _arr$5);
        return $422;
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
                var $425 = self.capacity;
                var $426 = self.buffer;
                var $427 = VoxBox$new$(_length$1, $425, $426);
                var $424 = $427;
                break;
        };
        return $424;
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
        var $428 = (((_n$1) >>> 0));
        return $428;
    };
    const I32$to_u32 = x0 => I32$to_u32$(x0);

    function VoxBox$Draw$line$(_x0$1, _y0$2, _x1$3, _y1$4, _z$5, _col$6, _img$7) {
        var _coords$8 = VoxBox$Draw$line$coords$(_x0$1, _y0$2, _x1$3, _y1$4);
        var _img$9 = (() => {
            var $431 = _img$7;
            var $432 = _coords$8;
            let _img$10 = $431;
            let _coord$9;
            while ($432._ === 'List.cons') {
                _coord$9 = $432.head;
                var self = _coord$9;
                switch (self._) {
                    case 'Pair.new':
                        var $433 = self.fst;
                        var $434 = self.snd;
                        var $435 = ((_img$10.buffer[_img$10.length * 2] = ((0 | I32$to_u32$($433) | (I32$to_u32$($434) << 12) | (I32$to_u32$(_z$5) << 24))), _img$10.buffer[_img$10.length * 2 + 1] = _col$6, _img$10.length++, _img$10));
                        var $431 = $435;
                        break;
                };
                _img$10 = $431;
                $432 = $432.tail;
            }
            return _img$10;
        })();
        var $429 = _img$9;
        return $429;
    };
    const VoxBox$Draw$line = x0 => x1 => x2 => x3 => x4 => x5 => x6 => VoxBox$Draw$line$(x0, x1, x2, x3, x4, x5, x6);
    const Col32$new = a0 => a1 => a2 => a3 => ((0 | a0 | (a1 << 8) | (a2 << 16) | (a3 << 24)));

    function App$TicTacToe$draw_vertical_lines$(_img$1) {
        var _side_tale$2 = ((side_board / 3) >> 0);
        var _edge$3 = ((side_board / 12) >> 0);
        var _img$4 = VoxBox$Draw$line$(_side_tale$2, _edge$3, _side_tale$2, ((side_board - _edge$3) >> 0), 0, ((0 | 0 | (0 << 8) | (0 << 16) | (255 << 24))), _img$1);
        var $436 = VoxBox$Draw$line$(((side_board - _side_tale$2) >> 0), _edge$3, ((side_board - _side_tale$2) >> 0), ((side_board - _edge$3) >> 0), 0, ((0 | 0 | (0 << 8) | (0 << 16) | (255 << 24))), _img$4);
        return $436;
    };
    const App$TicTacToe$draw_vertical_lines = x0 => App$TicTacToe$draw_vertical_lines$(x0);

    function App$TicTacToe$draw_horizontal_lines$(_img$1) {
        var _side_tale$2 = ((side_board / 3) >> 0);
        var _edge$3 = ((side_board / 12) >> 0);
        var _img$4 = VoxBox$Draw$line$(_edge$3, _side_tale$2, ((side_board - _edge$3) >> 0), _side_tale$2, 0, ((0 | 0 | (0 << 8) | (0 << 16) | (255 << 24))), _img$1);
        var $437 = VoxBox$Draw$line$(_edge$3, ((side_board - _side_tale$2) >> 0), ((side_board - _edge$3) >> 0), ((side_board - _side_tale$2) >> 0), 0, ((0 | 0 | (0 << 8) | (0 << 16) | (255 << 24))), _img$4);
        return $437;
    };
    const App$TicTacToe$draw_horizontal_lines = x0 => App$TicTacToe$draw_horizontal_lines$(x0);

    function DOM$vbox$(_props$1, _style$2, _value$3) {
        var $438 = ({
            _: 'DOM.vbox',
            'props': _props$1,
            'style': _style$2,
            'value': _value$3
        });
        return $438;
    };
    const DOM$vbox = x0 => x1 => x2 => DOM$vbox$(x0, x1, x2);

    function BitsMap$(_A$1) {
        var $439 = null;
        return $439;
    };
    const BitsMap = x0 => BitsMap$(x0);

    function Map$(_V$1) {
        var $440 = null;
        return $440;
    };
    const Map = x0 => Map$(x0);
    const BitsMap$new = ({
        _: 'BitsMap.new'
    });

    function BitsMap$tie$(_val$2, _lft$3, _rgt$4) {
        var $441 = ({
            _: 'BitsMap.tie',
            'val': _val$2,
            'lft': _lft$3,
            'rgt': _rgt$4
        });
        return $441;
    };
    const BitsMap$tie = x0 => x1 => x2 => BitsMap$tie$(x0, x1, x2);

    function Maybe$some$(_value$2) {
        var $442 = ({
            _: 'Maybe.some',
            'value': _value$2
        });
        return $442;
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
                var $444 = self.pred;
                var $445 = (Word$to_bits$($444) + '0');
                var $443 = $445;
                break;
            case 'Word.i':
                var $446 = self.pred;
                var $447 = (Word$to_bits$($446) + '1');
                var $443 = $447;
                break;
            case 'Word.e':
                var $448 = Bits$e;
                var $443 = $448;
                break;
        };
        return $443;
    };
    const Word$to_bits = x0 => Word$to_bits$(x0);
    const U16$to_bits = a0 => (u16_to_bits(a0));

    function String$to_bits$(_str$1) {
        var self = _str$1;
        if (self.length === 0) {
            var $450 = Bits$e;
            var $449 = $450;
        } else {
            var $451 = self.charCodeAt(0);
            var $452 = self.slice(1);
            var $453 = (String$to_bits$($452) + (u16_to_bits($451)));
            var $449 = $453;
        };
        return $449;
    };
    const String$to_bits = x0 => String$to_bits$(x0);

    function Map$from_list$(_xs$2) {
        var self = _xs$2;
        switch (self._) {
            case 'List.cons':
                var $455 = self.head;
                var $456 = self.tail;
                var self = $455;
                switch (self._) {
                    case 'Pair.new':
                        var $458 = self.fst;
                        var $459 = self.snd;
                        var $460 = (bitsmap_set(String$to_bits$($458), $459, Map$from_list$($456), 'set'));
                        var $457 = $460;
                        break;
                };
                var $454 = $457;
                break;
            case 'List.nil':
                var $461 = BitsMap$new;
                var $454 = $461;
                break;
        };
        return $454;
    };
    const Map$from_list = x0 => Map$from_list$(x0);

    function App$TicTacToe$draw$(_img$1, _state$2) {
        var _img$3 = App$TicTacToe$draw_vertical_lines$(_img$1);
        var _img$4 = App$TicTacToe$draw_horizontal_lines$(_img$3);
        var $462 = DOM$vbox$(Map$from_list$(List$nil), Map$from_list$(List$nil), _img$4);
        return $462;
    };
    const App$TicTacToe$draw = x0 => x1 => App$TicTacToe$draw$(x0, x1);

    function IO$(_A$1) {
        var $463 = null;
        return $463;
    };
    const IO = x0 => IO$(x0);

    function Pair$fst$(_pair$3) {
        var self = _pair$3;
        switch (self._) {
            case 'Pair.new':
                var $465 = self.fst;
                var $466 = $465;
                var $464 = $466;
                break;
        };
        return $464;
    };
    const Pair$fst = x0 => Pair$fst$(x0);
    const App$State$local = Pair$fst;

    function IO$ask$(_query$2, _param$3, _then$4) {
        var $467 = ({
            _: 'IO.ask',
            'query': _query$2,
            'param': _param$3,
            'then': _then$4
        });
        return $467;
    };
    const IO$ask = x0 => x1 => x2 => IO$ask$(x0, x1, x2);

    function IO$bind$(_a$3, _f$4) {
        var self = _a$3;
        switch (self._) {
            case 'IO.end':
                var $469 = self.value;
                var $470 = _f$4($469);
                var $468 = $470;
                break;
            case 'IO.ask':
                var $471 = self.query;
                var $472 = self.param;
                var $473 = self.then;
                var $474 = IO$ask$($471, $472, (_x$8 => {
                    var $475 = IO$bind$($473(_x$8), _f$4);
                    return $475;
                }));
                var $468 = $474;
                break;
        };
        return $468;
    };
    const IO$bind = x0 => x1 => IO$bind$(x0, x1);

    function IO$end$(_value$2) {
        var $476 = ({
            _: 'IO.end',
            'value': _value$2
        });
        return $476;
    };
    const IO$end = x0 => IO$end$(x0);

    function IO$monad$(_new$2) {
        var $477 = _new$2(IO$bind)(IO$end);
        return $477;
    };
    const IO$monad = x0 => IO$monad$(x0);
    const App$pass = IO$monad$((_m$bind$2 => _m$pure$3 => {
        var $478 = _m$pure$3;
        return $478;
    }))(Maybe$none);

    function App$set_local$(_value$2) {
        var $479 = IO$monad$((_m$bind$3 => _m$pure$4 => {
            var $480 = _m$pure$4;
            return $480;
        }))(Maybe$some$(_value$2));
        return $479;
    };
    const App$set_local = x0 => App$set_local$(x0);

    function Word$gtn$(_a$2, _b$3) {
        var $481 = Cmp$as_gtn$(Word$cmp$(_a$2, _b$3));
        return $481;
    };
    const Word$gtn = x0 => x1 => Word$gtn$(x0, x1);
    const U32$gtn = a0 => a1 => (a0 > a1);
    const U32$div = a0 => a1 => ((a0 / a1) >>> 0);
    const App$TicTacToe$constant$edge = ((App$TicTacToe$constant$size / 12) >>> 0);
    const edge = App$TicTacToe$constant$edge;

    function Word$ltn$(_a$2, _b$3) {
        var $482 = Cmp$as_ltn$(Word$cmp$(_a$2, _b$3));
        return $482;
    };
    const Word$ltn = x0 => x1 => Word$ltn$(x0, x1);
    const U32$ltn = a0 => a1 => (a0 < a1);
    const U32$sub = a0 => a1 => ((a0 - a1) >>> 0);
    const App$TicTacToe$constant$side_tale = ((App$TicTacToe$constant$size / 3) >>> 0);
    const side_tale = App$TicTacToe$constant$side_tale;

    function App$TicTacToe$pos$mouse_to_tile$(_pos$1) {
        var self = (_pos$1 > edge);
        if (self) {
            var self = (_pos$1 < ((side_board - edge) >>> 0));
            if (self) {
                var $485 = ((_pos$1 / side_tale) >>> 0);
                var $484 = $485;
            } else {
                var $486 = 10;
                var $484 = $486;
            };
            var $483 = $484;
        } else {
            var $487 = 10;
            var $483 = $487;
        };
        return $483;
    };
    const App$TicTacToe$pos$mouse_to_tile = x0 => App$TicTacToe$pos$mouse_to_tile$(x0);

    function App$TicTacToe$pos$pair_to_minipair$(_pair$1) {
        var self = _pair$1;
        switch (self._) {
            case 'Pair.new':
                var $489 = self.fst;
                var $490 = self.snd;
                var $491 = Pair$new$(App$TicTacToe$pos$mouse_to_tile$($489), App$TicTacToe$pos$mouse_to_tile$($490));
                var $488 = $491;
                break;
        };
        return $488;
    };
    const App$TicTacToe$pos$pair_to_minipair = x0 => App$TicTacToe$pos$pair_to_minipair$(x0);

    function App$TicTacToe$pos$pair_to_posvector$(_pair$1) {
        var _trans$2 = App$TicTacToe$pos$pair_to_minipair$(_pair$1);
        var self = _trans$2;
        switch (self._) {
            case 'Pair.new':
                var $493 = self.fst;
                var $494 = self.snd;
                var $495 = (((($494 + 1) >>> 0) + (($493 * 3) >>> 0)) >>> 0);
                var $492 = $495;
                break;
        };
        return $492;
    };
    const App$TicTacToe$pos$pair_to_posvector = x0 => App$TicTacToe$pos$pair_to_posvector$(x0);
    const Debug$log = a0 => a1 => ((console.log(a0), a1()));

    function String$cons$(_head$1, _tail$2) {
        var $496 = (String.fromCharCode(_head$1) + _tail$2);
        return $496;
    };
    const String$cons = x0 => x1 => String$cons$(x0, x1);
    const String$concat = a0 => a1 => (a0 + a1);

    function List$fold$(_list$2, _nil$4, _cons$5) {
        var self = _list$2;
        switch (self._) {
            case 'List.cons':
                var $498 = self.head;
                var $499 = self.tail;
                var $500 = _cons$5($498)(List$fold$($499, _nil$4, _cons$5));
                var $497 = $500;
                break;
            case 'List.nil':
                var $501 = _nil$4;
                var $497 = $501;
                break;
        };
        return $497;
    };
    const List$fold = x0 => x1 => x2 => List$fold$(x0, x1, x2);

    function Either$(_A$1, _B$2) {
        var $502 = null;
        return $502;
    };
    const Either = x0 => x1 => Either$(x0, x1);

    function Either$left$(_value$3) {
        var $503 = ({
            _: 'Either.left',
            'value': _value$3
        });
        return $503;
    };
    const Either$left = x0 => Either$left$(x0);

    function Either$right$(_value$3) {
        var $504 = ({
            _: 'Either.right',
            'value': _value$3
        });
        return $504;
    };
    const Either$right = x0 => Either$right$(x0);

    function Nat$sub_rem$(_n$1, _m$2) {
        var Nat$sub_rem$ = (_n$1, _m$2) => ({
            ctr: 'TCO',
            arg: [_n$1, _m$2]
        });
        var Nat$sub_rem = _n$1 => _m$2 => Nat$sub_rem$(_n$1, _m$2);
        var arg = [_n$1, _m$2];
        while (true) {
            let [_n$1, _m$2] = arg;
            var R = (() => {
                var self = _m$2;
                if (self === 0n) {
                    var $505 = Either$left$(_n$1);
                    return $505;
                } else {
                    var $506 = (self - 1n);
                    var self = _n$1;
                    if (self === 0n) {
                        var $508 = Either$right$(Nat$succ$($506));
                        var $507 = $508;
                    } else {
                        var $509 = (self - 1n);
                        var $510 = Nat$sub_rem$($509, $506);
                        var $507 = $510;
                    };
                    return $507;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Nat$sub_rem = x0 => x1 => Nat$sub_rem$(x0, x1);

    function Nat$div_mod$go$(_n$1, _m$2, _d$3) {
        var Nat$div_mod$go$ = (_n$1, _m$2, _d$3) => ({
            ctr: 'TCO',
            arg: [_n$1, _m$2, _d$3]
        });
        var Nat$div_mod$go = _n$1 => _m$2 => _d$3 => Nat$div_mod$go$(_n$1, _m$2, _d$3);
        var arg = [_n$1, _m$2, _d$3];
        while (true) {
            let [_n$1, _m$2, _d$3] = arg;
            var R = (() => {
                var self = Nat$sub_rem$(_n$1, _m$2);
                switch (self._) {
                    case 'Either.left':
                        var $511 = self.value;
                        var $512 = Nat$div_mod$go$($511, _m$2, Nat$succ$(_d$3));
                        return $512;
                    case 'Either.right':
                        var $513 = Pair$new$(_d$3, _n$1);
                        return $513;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Nat$div_mod$go = x0 => x1 => x2 => Nat$div_mod$go$(x0, x1, x2);
    const Nat$div_mod = a0 => a1 => (({
        _: 'Pair.new',
        'fst': a0 / a1,
        'snd': a0 % a1
    }));

    function Nat$to_base$go$(_base$1, _nat$2, _res$3) {
        var Nat$to_base$go$ = (_base$1, _nat$2, _res$3) => ({
            ctr: 'TCO',
            arg: [_base$1, _nat$2, _res$3]
        });
        var Nat$to_base$go = _base$1 => _nat$2 => _res$3 => Nat$to_base$go$(_base$1, _nat$2, _res$3);
        var arg = [_base$1, _nat$2, _res$3];
        while (true) {
            let [_base$1, _nat$2, _res$3] = arg;
            var R = (() => {
                var self = (({
                    _: 'Pair.new',
                    'fst': _nat$2 / _base$1,
                    'snd': _nat$2 % _base$1
                }));
                switch (self._) {
                    case 'Pair.new':
                        var $514 = self.fst;
                        var $515 = self.snd;
                        var self = $514;
                        if (self === 0n) {
                            var $517 = List$cons$($515, _res$3);
                            var $516 = $517;
                        } else {
                            var $518 = (self - 1n);
                            var $519 = Nat$to_base$go$(_base$1, $514, List$cons$($515, _res$3));
                            var $516 = $519;
                        };
                        return $516;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Nat$to_base$go = x0 => x1 => x2 => Nat$to_base$go$(x0, x1, x2);

    function Nat$to_base$(_base$1, _nat$2) {
        var $520 = Nat$to_base$go$(_base$1, _nat$2, List$nil);
        return $520;
    };
    const Nat$to_base = x0 => x1 => Nat$to_base$(x0, x1);
    const String$nil = '';

    function Nat$mod$go$(_n$1, _m$2, _r$3) {
        var Nat$mod$go$ = (_n$1, _m$2, _r$3) => ({
            ctr: 'TCO',
            arg: [_n$1, _m$2, _r$3]
        });
        var Nat$mod$go = _n$1 => _m$2 => _r$3 => Nat$mod$go$(_n$1, _m$2, _r$3);
        var arg = [_n$1, _m$2, _r$3];
        while (true) {
            let [_n$1, _m$2, _r$3] = arg;
            var R = (() => {
                var self = _m$2;
                if (self === 0n) {
                    var $521 = Nat$mod$go$(_n$1, _r$3, _m$2);
                    return $521;
                } else {
                    var $522 = (self - 1n);
                    var self = _n$1;
                    if (self === 0n) {
                        var $524 = _r$3;
                        var $523 = $524;
                    } else {
                        var $525 = (self - 1n);
                        var $526 = Nat$mod$go$($525, $522, Nat$succ$(_r$3));
                        var $523 = $526;
                    };
                    return $523;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Nat$mod$go = x0 => x1 => x2 => Nat$mod$go$(x0, x1, x2);
    const Nat$mod = a0 => a1 => (a0 % a1);
    const Bool$and = a0 => a1 => (a0 && a1);
    const Nat$gtn = a0 => a1 => (a0 > a1);
    const Nat$lte = a0 => a1 => (a0 <= a1);

    function List$at$(_index$2, _list$3) {
        var List$at$ = (_index$2, _list$3) => ({
            ctr: 'TCO',
            arg: [_index$2, _list$3]
        });
        var List$at = _index$2 => _list$3 => List$at$(_index$2, _list$3);
        var arg = [_index$2, _list$3];
        while (true) {
            let [_index$2, _list$3] = arg;
            var R = (() => {
                var self = _list$3;
                switch (self._) {
                    case 'List.cons':
                        var $527 = self.head;
                        var $528 = self.tail;
                        var self = _index$2;
                        if (self === 0n) {
                            var $530 = Maybe$some$($527);
                            var $529 = $530;
                        } else {
                            var $531 = (self - 1n);
                            var $532 = List$at$($531, $528);
                            var $529 = $532;
                        };
                        return $529;
                    case 'List.nil':
                        var $533 = Maybe$none;
                        return $533;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const List$at = x0 => x1 => List$at$(x0, x1);

    function Nat$show_digit$(_base$1, _n$2) {
        var _m$3 = (_n$2 % _base$1);
        var _base64$4 = List$cons$(48, List$cons$(49, List$cons$(50, List$cons$(51, List$cons$(52, List$cons$(53, List$cons$(54, List$cons$(55, List$cons$(56, List$cons$(57, List$cons$(65, List$cons$(66, List$cons$(67, List$cons$(68, List$cons$(69, List$cons$(70, List$cons$(71, List$cons$(72, List$cons$(73, List$cons$(74, List$cons$(75, List$cons$(76, List$cons$(77, List$cons$(78, List$cons$(79, List$cons$(80, List$cons$(81, List$cons$(82, List$cons$(83, List$cons$(84, List$cons$(85, List$cons$(86, List$cons$(87, List$cons$(88, List$cons$(89, List$cons$(90, List$cons$(97, List$cons$(98, List$cons$(99, List$cons$(100, List$cons$(101, List$cons$(102, List$cons$(103, List$cons$(104, List$cons$(105, List$cons$(106, List$cons$(107, List$cons$(108, List$cons$(109, List$cons$(110, List$cons$(111, List$cons$(112, List$cons$(113, List$cons$(114, List$cons$(115, List$cons$(116, List$cons$(117, List$cons$(118, List$cons$(119, List$cons$(120, List$cons$(121, List$cons$(122, List$cons$(43, List$cons$(47, List$nil))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))));
        var self = ((_base$1 > 0n) && (_base$1 <= 64n));
        if (self) {
            var self = List$at$(_m$3, _base64$4);
            switch (self._) {
                case 'Maybe.some':
                    var $536 = self.value;
                    var $537 = $536;
                    var $535 = $537;
                    break;
                case 'Maybe.none':
                    var $538 = 35;
                    var $535 = $538;
                    break;
            };
            var $534 = $535;
        } else {
            var $539 = 35;
            var $534 = $539;
        };
        return $534;
    };
    const Nat$show_digit = x0 => x1 => Nat$show_digit$(x0, x1);

    function Nat$to_string_base$(_base$1, _nat$2) {
        var $540 = List$fold$(Nat$to_base$(_base$1, _nat$2), String$nil, (_n$3 => _str$4 => {
            var $541 = String$cons$(Nat$show_digit$(_base$1, _n$3), _str$4);
            return $541;
        }));
        return $540;
    };
    const Nat$to_string_base = x0 => x1 => Nat$to_string_base$(x0, x1);

    function Nat$show$(_n$1) {
        var $542 = Nat$to_string_base$(10n, _n$1);
        return $542;
    };
    const Nat$show = x0 => Nat$show$(x0);

    function Word$show$(_size$1, _a$2) {
        var _n$3 = Word$to_nat$(_a$2);
        var $543 = (Nat$show$(_n$3) + ("#" + Nat$show$(_size$1)));
        return $543;
    };
    const Word$show = x0 => x1 => Word$show$(x0, x1);
    const U32$show = a0 => (a0 + "#32");

    function Vector$simply_insert$(_A$1, _size$2, _n$3, _v$4, _vec$5) {
        var self = _size$2;
        if (self === 0n) {
            var $545 = (_vec$6 => {
                var $546 = Vector$nil(null);
                return $546;
            });
            var $544 = $545;
        } else {
            var $547 = (self - 1n);
            var $548 = (_vec$7 => {
                var self = _n$3;
                if (self === 0n) {
                    var $550 = _vec$7((_vec$self$8 => {
                        var $551 = null;
                        return $551;
                    }))((_vec$head$8 => _vec$tail$9 => {
                        var $552 = Vector$cons(null)($547)(_v$4)(_vec$tail$9);
                        return $552;
                    }));
                    var $549 = $550;
                } else {
                    var $553 = (self - 1n);
                    var $554 = _vec$7((_vec$self$9 => {
                        var $555 = null;
                        return $555;
                    }))((_vec$head$9 => _vec$tail$10 => {
                        var $556 = Vector$cons(null)($547)(_vec$head$9)(Vector$simply_insert$(null, $547, $553, _v$4, _vec$tail$10));
                        return $556;
                    }));
                    var $549 = $554;
                };
                return $549;
            });
            var $544 = $548;
        };
        var $544 = $544(_vec$5);
        return $544;
    };
    const Vector$simply_insert = x0 => x1 => x2 => x3 => x4 => Vector$simply_insert$(x0, x1, x2, x3, x4);
    const U32$to_nat = a0 => (BigInt(a0));

    function App$TicTacToe$board$insert_entity$(_pos$1, _e$2, _state$3) {
        var self = _e$2;
        switch (self._) {
            case 'App.TicTacToe.Entity.Circle':
            case 'App.TicTacToe.Entity.X':
            case 'App.TicTacToe.Entity.Empty':
                var _n$4 = App$TicTacToe$pos$pair_to_posvector$(_pos$1);
                var $558 = ((console.log((_n$4 + "#32")), (_$5 => {
                    var self = _state$3;
                    switch (self._) {
                        case 'App.TicTacToe.State.local.new':
                            var $560 = self.board;
                            var $561 = self.info;
                            var $562 = App$TicTacToe$State$local$new$(Vector$simply_insert$(null, 9n, (BigInt(_n$4)), Maybe$some$(_e$2), $560), $561);
                            var $559 = $562;
                            break;
                    };
                    return $559;
                })()));
                var $557 = $558;
                break;
        };
        return $557;
    };
    const App$TicTacToe$board$insert_entity = x0 => x1 => x2 => App$TicTacToe$board$insert_entity$(x0, x1, x2);
    const App$TicTacToe$Entity$circle = ({
        _: 'App.TicTacToe.Entity.Circle'
    });

    function App$TicTacToe$when$(_event$1, _state$2) {
        var self = _event$1;
        switch (self._) {
            case 'App.Event.frame':
                var $564 = self.info;
                var self = _state$2;
                switch (self._) {
                    case 'App.Store.new':
                        var $566 = self.local;
                        var $567 = App$set_local$((() => {
                            var self = $566;
                            switch (self._) {
                                case 'App.TicTacToe.State.local.new':
                                    var $568 = self.board;
                                    var $569 = App$TicTacToe$State$local$new$($568, $564);
                                    return $569;
                            };
                        })());
                        var $565 = $567;
                        break;
                };
                var $563 = $565;
                break;
            case 'App.Event.init':
            case 'App.Event.mouse_down':
            case 'App.Event.key_down':
            case 'App.Event.key_up':
            case 'App.Event.mouse_over':
            case 'App.Event.mouse_click':
            case 'App.Event.input':
                var $570 = App$pass;
                var $563 = $570;
                break;
            case 'App.Event.mouse_up':
                var self = _state$2;
                switch (self._) {
                    case 'App.Store.new':
                        var $572 = self.local;
                        var self = $572;
                        switch (self._) {
                            case 'App.TicTacToe.State.local.new':
                                var $574 = self.info;
                                var $575 = $574;
                                var _info$7 = $575;
                                break;
                        };
                        var self = _info$7;
                        switch (self._) {
                            case 'App.EnvInfo.new':
                                var $576 = self.mouse_pos;
                                var _state$10 = App$TicTacToe$board$insert_entity$($576, App$TicTacToe$Entity$circle, $572);
                                var $577 = App$set_local$(_state$10);
                                var $573 = $577;
                                break;
                        };
                        var $571 = $573;
                        break;
                };
                var $563 = $571;
                break;
        };
        return $563;
    };
    const App$TicTacToe$when = x0 => x1 => App$TicTacToe$when$(x0, x1);

    function App$TicTacToe$tick$(_tick$1, _glob$2) {
        var $578 = _glob$2;
        return $578;
    };
    const App$TicTacToe$tick = x0 => x1 => App$TicTacToe$tick$(x0, x1);

    function App$TicTacToe$post$(_time$1, _room$2, _addr$3, _data$4, _glob$5) {
        var $579 = _glob$5;
        return $579;
    };
    const App$TicTacToe$post = x0 => x1 => x2 => x3 => x4 => App$TicTacToe$post$(x0, x1, x2, x3, x4);

    function App$new$(_init$2, _draw$3, _when$4, _tick$5, _post$6) {
        var $580 = ({
            _: 'App.new',
            'init': _init$2,
            'draw': _draw$3,
            'when': _when$4,
            'tick': _tick$5,
            'post': _post$6
        });
        return $580;
    };
    const App$new = x0 => x1 => x2 => x3 => x4 => App$new$(x0, x1, x2, x3, x4);
    const App$TicTacToe = (() => {
        var _img$1 = VoxBox$alloc_capacity$(((65536 * 8) >>> 0));
        var _init$2 = App$TicTacToe$init;
        var _draw$3 = App$TicTacToe$draw(_img$1);
        var _when$4 = App$TicTacToe$when;
        var _tick$5 = App$TicTacToe$tick;
        var _post$6 = App$TicTacToe$post;
        var $581 = App$new$(_init$2, _draw$3, _when$4, _tick$5, _post$6);
        return $581;
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
        'U32.div': U32$div,
        'App.TicTacToe.constant.edge': App$TicTacToe$constant$edge,
        'edge': edge,
        'Word.ltn': Word$ltn,
        'U32.ltn': U32$ltn,
        'U32.sub': U32$sub,
        'App.TicTacToe.constant.side_tale': App$TicTacToe$constant$side_tale,
        'side_tale': side_tale,
        'App.TicTacToe.pos.mouse_to_tile': App$TicTacToe$pos$mouse_to_tile,
        'App.TicTacToe.pos.pair_to_minipair': App$TicTacToe$pos$pair_to_minipair,
        'App.TicTacToe.pos.pair_to_posvector': App$TicTacToe$pos$pair_to_posvector,
        'Debug.log': Debug$log,
        'String.cons': String$cons,
        'String.concat': String$concat,
        'List.fold': List$fold,
        'Either': Either,
        'Either.left': Either$left,
        'Either.right': Either$right,
        'Nat.sub_rem': Nat$sub_rem,
        'Nat.div_mod.go': Nat$div_mod$go,
        'Nat.div_mod': Nat$div_mod,
        'Nat.to_base.go': Nat$to_base$go,
        'Nat.to_base': Nat$to_base,
        'String.nil': String$nil,
        'Nat.mod.go': Nat$mod$go,
        'Nat.mod': Nat$mod,
        'Bool.and': Bool$and,
        'Nat.gtn': Nat$gtn,
        'Nat.lte': Nat$lte,
        'List.at': List$at,
        'Nat.show_digit': Nat$show_digit,
        'Nat.to_string_base': Nat$to_string_base,
        'Nat.show': Nat$show,
        'Word.show': Word$show,
        'U32.show': U32$show,
        'Vector.simply_insert': Vector$simply_insert,
        'U32.to_nat': U32$to_nat,
        'App.TicTacToe.board.insert_entity': App$TicTacToe$board$insert_entity,
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