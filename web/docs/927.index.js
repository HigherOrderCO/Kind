(self["webpackChunkkind_web"] = self["webpackChunkkind_web"] || []).push([[927],{

/***/ 927:
/***/ ((module) => {

module.exports = (function() {
    function int_pos(i) {
        return i >= 0n ? i : 0n;
    };

    function int_neg(i) {
        return i < 0n ? -i : 0n;
    };

    function word_to_u8(w) {
        var u = 0;
        for (var i = 0; i < 8; ++i) {
            u = u | (w._ === 'Word.i' ? 1 << i : 0);
            w = w.pred;
        };
        return u;
    };

    function u8_to_word(u) {
        var w = {
            _: 'Word.e'
        };
        for (var i = 0; i < 8; ++i) {
            w = {
                _: (u >>> (8 - i - 1)) & 1 ? 'Word.i' : 'Word.o',
                pred: w
            };
        };
        return w;
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
    var nat_to_bits = n => {
        return n === 0n ? '' : n.toString(2);
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
    const inst_u8 = x => x(x0 => word_to_u8(x0));
    const elim_u8 = (x => {
        var $21 = (() => c0 => {
            var self = x;
            switch ('u8') {
                case 'u8':
                    var $19 = u8_to_word(self);
                    var $20 = c0($19);
                    return $20;
            };
        })();
        return $21;
    });
    const inst_u16 = x => x(x0 => word_to_u16(x0));
    const elim_u16 = (x => {
        var $24 = (() => c0 => {
            var self = x;
            switch ('u16') {
                case 'u16':
                    var $22 = u16_to_word(self);
                    var $23 = c0($22);
                    return $23;
            };
        })();
        return $24;
    });
    const inst_u32 = x => x(x0 => word_to_u32(x0));
    const elim_u32 = (x => {
        var $27 = (() => c0 => {
            var self = x;
            switch ('u32') {
                case 'u32':
                    var $25 = u32_to_word(self);
                    var $26 = c0($25);
                    return $26;
            };
        })();
        return $27;
    });
    const inst_i32 = x => x(x0 => word_to_i32(x0));
    const elim_i32 = (x => {
        var $30 = (() => c0 => {
            var self = x;
            switch ('i32') {
                case 'i32':
                    var $28 = i32_to_word(self);
                    var $29 = c0($28);
                    return $29;
            };
        })();
        return $30;
    });
    const inst_u64 = x => x(x0 => word_to_u64(x0));
    const elim_u64 = (x => {
        var $33 = (() => c0 => {
            var self = x;
            switch ('u64') {
                case 'u64':
                    var $31 = u64_to_word(self);
                    var $32 = c0($31);
                    return $32;
            };
        })();
        return $33;
    });
    const inst_f64 = x => x(x0 => word_to_f64(x0));
    const elim_f64 = (x => {
        var $36 = (() => c0 => {
            var self = x;
            switch ('f64') {
                case 'f64':
                    var $34 = f64_to_word(self);
                    var $35 = c0($34);
                    return $35;
            };
        })();
        return $36;
    });
    const inst_string = x => x('')(x0 => x1 => (String.fromCharCode(x0) + x1));
    const elim_string = (x => {
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
            };
        })();
        return $41;
    });
    const inst_buffer32 = x => x(x0 => x1 => u32array_to_buffer32(x1));
    const elim_buffer32 = (x => {
        var $45 = (() => c0 => {
            var self = x;
            switch ('b32') {
                case 'b32':
                    var $42 = buffer32_to_depth(self);
                    var $43 = buffer32_to_u32array(self);
                    var $44 = c0($42)($43);
                    return $44;
            };
        })();
        return $45;
    });

    function Buffer32$new$(_depth$1, _array$2) {
        var $46 = u32array_to_buffer32(_array$2);
        return $46;
    };
    const Buffer32$new = x0 => x1 => Buffer32$new$(x0, x1);

    function Array$(_A$1, _depth$2) {
        var $47 = null;
        return $47;
    };
    const Array = x0 => x1 => Array$(x0, x1);

    function Array$tip$(_value$2) {
        var $48 = ({
            _: 'Array.tip',
            'value': _value$2
        });
        return $48;
    };
    const Array$tip = x0 => Array$tip$(x0);

    function Array$tie$(_lft$3, _rgt$4) {
        var $49 = ({
            _: 'Array.tie',
            'lft': _lft$3,
            'rgt': _rgt$4
        });
        return $49;
    };
    const Array$tie = x0 => x1 => Array$tie$(x0, x1);

    function Array$alloc$(_depth$2, _x$3) {
        var self = _depth$2;
        if (self === 0n) {
            var $51 = Array$tip$(_x$3);
            var $50 = $51;
        } else {
            var $52 = (self - 1n);
            var _half$5 = Array$alloc$($52, _x$3);
            var $53 = Array$tie$(_half$5, _half$5);
            var $50 = $53;
        };
        return $50;
    };
    const Array$alloc = x0 => x1 => Array$alloc$(x0, x1);

    function U32$new$(_value$1) {
        var $54 = word_to_u32(_value$1);
        return $54;
    };
    const U32$new = x0 => U32$new$(x0);

    function Word$(_size$1) {
        var $55 = null;
        return $55;
    };
    const Word = x0 => Word$(x0);
    const Word$e = ({
        _: 'Word.e'
    });

    function Word$o$(_pred$2) {
        var $56 = ({
            _: 'Word.o',
            'pred': _pred$2
        });
        return $56;
    };
    const Word$o = x0 => Word$o$(x0);

    function Word$zero$(_size$1) {
        var self = _size$1;
        if (self === 0n) {
            var $58 = Word$e;
            var $57 = $58;
        } else {
            var $59 = (self - 1n);
            var $60 = Word$o$(Word$zero$($59));
            var $57 = $60;
        };
        return $57;
    };
    const Word$zero = x0 => Word$zero$(x0);

    function Nat$succ$(_pred$1) {
        var $61 = 1n + _pred$1;
        return $61;
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
                        var $62 = self.pred;
                        var $63 = Word$bit_length$go$($62, Nat$succ$(_c$3), _n$4);
                        return $63;
                    case 'Word.i':
                        var $64 = self.pred;
                        var $65 = Word$bit_length$go$($64, Nat$succ$(_c$3), Nat$succ$(_c$3));
                        return $65;
                    case 'Word.e':
                        var $66 = _n$4;
                        return $66;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Word$bit_length$go = x0 => x1 => x2 => Word$bit_length$go$(x0, x1, x2);

    function Word$bit_length$(_word$2) {
        var $67 = Word$bit_length$go$(_word$2, 0n, 0n);
        return $67;
    };
    const Word$bit_length = x0 => Word$bit_length$(x0);

    function U32$bit_length$(_size$1) {
        var self = _size$1;
        switch ('u32') {
            case 'u32':
                var $69 = u32_to_word(self);
                var $70 = Word$bit_length$($69);
                var $68 = $70;
                break;
        };
        return $68;
    };
    const U32$bit_length = x0 => U32$bit_length$(x0);

    function Word$i$(_pred$2) {
        var $71 = ({
            _: 'Word.i',
            'pred': _pred$2
        });
        return $71;
    };
    const Word$i = x0 => Word$i$(x0);
    const Bool$false = false;
    const Bool$true = true;

    function Word$shift_left$one$go$(_word$2, _prev$3) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $73 = self.pred;
                var self = _prev$3;
                if (self) {
                    var $75 = Word$i$(Word$shift_left$one$go$($73, Bool$false));
                    var $74 = $75;
                } else {
                    var $76 = Word$o$(Word$shift_left$one$go$($73, Bool$false));
                    var $74 = $76;
                };
                var $72 = $74;
                break;
            case 'Word.i':
                var $77 = self.pred;
                var self = _prev$3;
                if (self) {
                    var $79 = Word$i$(Word$shift_left$one$go$($77, Bool$true));
                    var $78 = $79;
                } else {
                    var $80 = Word$o$(Word$shift_left$one$go$($77, Bool$true));
                    var $78 = $80;
                };
                var $72 = $78;
                break;
            case 'Word.e':
                var $81 = Word$e;
                var $72 = $81;
                break;
        };
        return $72;
    };
    const Word$shift_left$one$go = x0 => x1 => Word$shift_left$one$go$(x0, x1);

    function Word$shift_left$one$(_word$2) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $83 = self.pred;
                var $84 = Word$o$(Word$shift_left$one$go$($83, Bool$false));
                var $82 = $84;
                break;
            case 'Word.i':
                var $85 = self.pred;
                var $86 = Word$o$(Word$shift_left$one$go$($85, Bool$true));
                var $82 = $86;
                break;
            case 'Word.e':
                var $87 = Word$e;
                var $82 = $87;
                break;
        };
        return $82;
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
                    var $88 = _value$3;
                    return $88;
                } else {
                    var $89 = (self - 1n);
                    var $90 = Word$shift_left$($89, Word$shift_left$one$(_value$3));
                    return $90;
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
                var $92 = self.pred;
                var $93 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $95 = self.pred;
                            var $96 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $98 = Word$i$(Word$adder$(_a$pred$10, $95, Bool$false));
                                    var $97 = $98;
                                } else {
                                    var $99 = Word$o$(Word$adder$(_a$pred$10, $95, Bool$false));
                                    var $97 = $99;
                                };
                                return $97;
                            });
                            var $94 = $96;
                            break;
                        case 'Word.i':
                            var $100 = self.pred;
                            var $101 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $103 = Word$o$(Word$adder$(_a$pred$10, $100, Bool$true));
                                    var $102 = $103;
                                } else {
                                    var $104 = Word$i$(Word$adder$(_a$pred$10, $100, Bool$false));
                                    var $102 = $104;
                                };
                                return $102;
                            });
                            var $94 = $101;
                            break;
                        case 'Word.e':
                            var $105 = (_a$pred$8 => {
                                var $106 = Word$e;
                                return $106;
                            });
                            var $94 = $105;
                            break;
                    };
                    var $94 = $94($92);
                    return $94;
                });
                var $91 = $93;
                break;
            case 'Word.i':
                var $107 = self.pred;
                var $108 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $110 = self.pred;
                            var $111 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $113 = Word$o$(Word$adder$(_a$pred$10, $110, Bool$true));
                                    var $112 = $113;
                                } else {
                                    var $114 = Word$i$(Word$adder$(_a$pred$10, $110, Bool$false));
                                    var $112 = $114;
                                };
                                return $112;
                            });
                            var $109 = $111;
                            break;
                        case 'Word.i':
                            var $115 = self.pred;
                            var $116 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $118 = Word$i$(Word$adder$(_a$pred$10, $115, Bool$true));
                                    var $117 = $118;
                                } else {
                                    var $119 = Word$o$(Word$adder$(_a$pred$10, $115, Bool$true));
                                    var $117 = $119;
                                };
                                return $117;
                            });
                            var $109 = $116;
                            break;
                        case 'Word.e':
                            var $120 = (_a$pred$8 => {
                                var $121 = Word$e;
                                return $121;
                            });
                            var $109 = $120;
                            break;
                    };
                    var $109 = $109($107);
                    return $109;
                });
                var $91 = $108;
                break;
            case 'Word.e':
                var $122 = (_b$5 => {
                    var $123 = Word$e;
                    return $123;
                });
                var $91 = $122;
                break;
        };
        var $91 = $91(_b$3);
        return $91;
    };
    const Word$adder = x0 => x1 => x2 => Word$adder$(x0, x1, x2);

    function Word$add$(_a$2, _b$3) {
        var $124 = Word$adder$(_a$2, _b$3, Bool$false);
        return $124;
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
                        var $125 = self.pred;
                        var $126 = Word$mul$go$($125, Word$shift_left$(1n, _b$4), _acc$5);
                        return $126;
                    case 'Word.i':
                        var $127 = self.pred;
                        var $128 = Word$mul$go$($127, Word$shift_left$(1n, _b$4), Word$add$(_b$4, _acc$5));
                        return $128;
                    case 'Word.e':
                        var $129 = _acc$5;
                        return $129;
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
                var $131 = self.pred;
                var $132 = Word$o$(Word$to_zero$($131));
                var $130 = $132;
                break;
            case 'Word.i':
                var $133 = self.pred;
                var $134 = Word$o$(Word$to_zero$($133));
                var $130 = $134;
                break;
            case 'Word.e':
                var $135 = Word$e;
                var $130 = $135;
                break;
        };
        return $130;
    };
    const Word$to_zero = x0 => Word$to_zero$(x0);

    function Word$mul$(_a$2, _b$3) {
        var $136 = Word$mul$go$(_a$2, _b$3, Word$to_zero$(_a$2));
        return $136;
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
                    var $137 = _x$4;
                    return $137;
                } else {
                    var $138 = (self - 1n);
                    var $139 = Nat$apply$($138, _f$3, _f$3(_x$4));
                    return $139;
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
                var $141 = self.pred;
                var $142 = Word$i$($141);
                var $140 = $142;
                break;
            case 'Word.i':
                var $143 = self.pred;
                var $144 = Word$o$(Word$inc$($143));
                var $140 = $144;
                break;
            case 'Word.e':
                var $145 = Word$e;
                var $140 = $145;
                break;
        };
        return $140;
    };
    const Word$inc = x0 => Word$inc$(x0);

    function Nat$to_word$(_size$1, _n$2) {
        var $146 = Nat$apply$(_n$2, Word$inc, Word$zero$(_size$1));
        return $146;
    };
    const Nat$to_word = x0 => x1 => Nat$to_word$(x0, x1);
    const Nat$to_u32 = a0 => (Number(a0) >>> 0);

    function VoxBox$new$(_length$1, _capacity$2, _buffer$3) {
        var $147 = ({
            _: 'VoxBox.new',
            'length': _length$1,
            'capacity': _capacity$2,
            'buffer': _buffer$3
        });
        return $147;
    };
    const VoxBox$new = x0 => x1 => x2 => VoxBox$new$(x0, x1, x2);

    function VoxBox$alloc_capacity$(_capacity$1) {
        var _buffer$2 = (new Uint32Array(2 ** Number(U32$bit_length$(((2 * _capacity$1) >>> 0)))));
        var $148 = VoxBox$new$(0, _capacity$1, _buffer$2);
        return $148;
    };
    const VoxBox$alloc_capacity = x0 => VoxBox$alloc_capacity$(x0);
    const Web$Kaelin$Constants$room = "0x414562845298";

    function BitsMap$(_A$1) {
        var $149 = null;
        return $149;
    };
    const BitsMap = x0 => BitsMap$(x0);

    function Map$(_V$1) {
        var $150 = null;
        return $150;
    };
    const Map = x0 => Map$(x0);
    const BitsMap$new = ({
        _: 'BitsMap.new'
    });

    function BitsMap$tie$(_val$2, _lft$3, _rgt$4) {
        var $151 = ({
            _: 'BitsMap.tie',
            'val': _val$2,
            'lft': _lft$3,
            'rgt': _rgt$4
        });
        return $151;
    };
    const BitsMap$tie = x0 => x1 => x2 => BitsMap$tie$(x0, x1, x2);

    function Maybe$some$(_value$2) {
        var $152 = ({
            _: 'Maybe.some',
            'value': _value$2
        });
        return $152;
    };
    const Maybe$some = x0 => Maybe$some$(x0);
    const Maybe$none = ({
        _: 'Maybe.none'
    });
    const BitsMap$set = a0 => a1 => a2 => (bitsmap_set(a0, a1, a2, 'set'));
    const Bits$e = '';
    const Bits$o = a0 => (a0 + '0');
    const Bits$i = a0 => (a0 + '1');
    const Bits$concat = a0 => a1 => (a1 + a0);

    function Word$to_bits$(_a$2) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $154 = self.pred;
                var $155 = (Word$to_bits$($154) + '0');
                var $153 = $155;
                break;
            case 'Word.i':
                var $156 = self.pred;
                var $157 = (Word$to_bits$($156) + '1');
                var $153 = $157;
                break;
            case 'Word.e':
                var $158 = Bits$e;
                var $153 = $158;
                break;
        };
        return $153;
    };
    const Word$to_bits = x0 => Word$to_bits$(x0);
    const U16$to_bits = a0 => (u16_to_bits(a0));

    function String$to_bits$(_str$1) {
        var self = _str$1;
        if (self.length === 0) {
            var $160 = Bits$e;
            var $159 = $160;
        } else {
            var $161 = self.charCodeAt(0);
            var $162 = self.slice(1);
            var $163 = (String$to_bits$($162) + (u16_to_bits($161)));
            var $159 = $163;
        };
        return $159;
    };
    const String$to_bits = x0 => String$to_bits$(x0);

    function Map$from_list$(_xs$2) {
        var self = _xs$2;
        switch (self._) {
            case 'List.cons':
                var $165 = self.head;
                var $166 = self.tail;
                var self = $165;
                switch (self._) {
                    case 'Pair.new':
                        var $168 = self.fst;
                        var $169 = self.snd;
                        var $170 = (bitsmap_set(String$to_bits$($168), $169, Map$from_list$($166), 'set'));
                        var $167 = $170;
                        break;
                };
                var $164 = $167;
                break;
            case 'List.nil':
                var $171 = BitsMap$new;
                var $164 = $171;
                break;
        };
        return $164;
    };
    const Map$from_list = x0 => Map$from_list$(x0);
    const List$nil = ({
        _: 'List.nil'
    });

    function Pair$(_A$1, _B$2) {
        var $172 = null;
        return $172;
    };
    const Pair = x0 => x1 => Pair$(x0, x1);

    function Web$Kaelin$Coord$new$(_i$1, _j$2) {
        var $173 = ({
            _: 'Web.Kaelin.Coord.new',
            'i': _i$1,
            'j': _j$2
        });
        return $173;
    };
    const Web$Kaelin$Coord$new = x0 => x1 => Web$Kaelin$Coord$new$(x0, x1);
    const Bool$and = a0 => a1 => (a0 && a1);

    function Cmp$as_eql$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
            case 'Cmp.gtn':
                var $175 = Bool$false;
                var $174 = $175;
                break;
            case 'Cmp.eql':
                var $176 = Bool$true;
                var $174 = $176;
                break;
        };
        return $174;
    };
    const Cmp$as_eql = x0 => Cmp$as_eql$(x0);
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
                var $178 = self.pred;
                var $179 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $181 = self.pred;
                            var $182 = (_a$pred$10 => {
                                var $183 = Word$cmp$go$(_a$pred$10, $181, _c$4);
                                return $183;
                            });
                            var $180 = $182;
                            break;
                        case 'Word.i':
                            var $184 = self.pred;
                            var $185 = (_a$pred$10 => {
                                var $186 = Word$cmp$go$(_a$pred$10, $184, Cmp$ltn);
                                return $186;
                            });
                            var $180 = $185;
                            break;
                        case 'Word.e':
                            var $187 = (_a$pred$8 => {
                                var $188 = _c$4;
                                return $188;
                            });
                            var $180 = $187;
                            break;
                    };
                    var $180 = $180($178);
                    return $180;
                });
                var $177 = $179;
                break;
            case 'Word.i':
                var $189 = self.pred;
                var $190 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $192 = self.pred;
                            var $193 = (_a$pred$10 => {
                                var $194 = Word$cmp$go$(_a$pred$10, $192, Cmp$gtn);
                                return $194;
                            });
                            var $191 = $193;
                            break;
                        case 'Word.i':
                            var $195 = self.pred;
                            var $196 = (_a$pred$10 => {
                                var $197 = Word$cmp$go$(_a$pred$10, $195, _c$4);
                                return $197;
                            });
                            var $191 = $196;
                            break;
                        case 'Word.e':
                            var $198 = (_a$pred$8 => {
                                var $199 = _c$4;
                                return $199;
                            });
                            var $191 = $198;
                            break;
                    };
                    var $191 = $191($189);
                    return $191;
                });
                var $177 = $190;
                break;
            case 'Word.e':
                var $200 = (_b$5 => {
                    var $201 = _c$4;
                    return $201;
                });
                var $177 = $200;
                break;
        };
        var $177 = $177(_b$3);
        return $177;
    };
    const Word$cmp$go = x0 => x1 => x2 => Word$cmp$go$(x0, x1, x2);
    const Cmp$eql = ({
        _: 'Cmp.eql'
    });

    function Word$cmp$(_a$2, _b$3) {
        var $202 = Word$cmp$go$(_a$2, _b$3, Cmp$eql);
        return $202;
    };
    const Word$cmp = x0 => x1 => Word$cmp$(x0, x1);

    function Word$eql$(_a$2, _b$3) {
        var $203 = Cmp$as_eql$(Word$cmp$(_a$2, _b$3));
        return $203;
    };
    const Word$eql = x0 => x1 => Word$eql$(x0, x1);
    const U16$eql = a0 => a1 => (a0 === a1);
    const String$eql = a0 => a1 => (a0 === a1);

    function Web$Kaelin$Hero$new$(_name$1, _img$2, _max_hp$3, _skills$4) {
        var $204 = ({
            _: 'Web.Kaelin.Hero.new',
            'name': _name$1,
            'img': _img$2,
            'max_hp': _max_hp$3,
            'skills': _skills$4
        });
        return $204;
    };
    const Web$Kaelin$Hero$new = x0 => x1 => x2 => x3 => Web$Kaelin$Hero$new$(x0, x1, x2, x3);
    const Nat$ltn = a0 => a1 => (a0 < a1);
    const Nat$sub = a0 => a1 => (a0 - a1 <= 0n ? 0n : a0 - a1);

    function Cmp$as_gte$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
                var $206 = Bool$false;
                var $205 = $206;
                break;
            case 'Cmp.eql':
            case 'Cmp.gtn':
                var $207 = Bool$true;
                var $205 = $207;
                break;
        };
        return $205;
    };
    const Cmp$as_gte = x0 => Cmp$as_gte$(x0);

    function Word$gte$(_a$2, _b$3) {
        var $208 = Cmp$as_gte$(Word$cmp$(_a$2, _b$3));
        return $208;
    };
    const Word$gte = x0 => x1 => Word$gte$(x0, x1);

    function Pair$new$(_fst$3, _snd$4) {
        var $209 = ({
            _: 'Pair.new',
            'fst': _fst$3,
            'snd': _snd$4
        });
        return $209;
    };
    const Pair$new = x0 => x1 => Pair$new$(x0, x1);

    function Word$or$(_a$2, _b$3) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $211 = self.pred;
                var $212 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $214 = self.pred;
                            var $215 = (_a$pred$9 => {
                                var $216 = Word$o$(Word$or$(_a$pred$9, $214));
                                return $216;
                            });
                            var $213 = $215;
                            break;
                        case 'Word.i':
                            var $217 = self.pred;
                            var $218 = (_a$pred$9 => {
                                var $219 = Word$i$(Word$or$(_a$pred$9, $217));
                                return $219;
                            });
                            var $213 = $218;
                            break;
                        case 'Word.e':
                            var $220 = (_a$pred$7 => {
                                var $221 = Word$e;
                                return $221;
                            });
                            var $213 = $220;
                            break;
                    };
                    var $213 = $213($211);
                    return $213;
                });
                var $210 = $212;
                break;
            case 'Word.i':
                var $222 = self.pred;
                var $223 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $225 = self.pred;
                            var $226 = (_a$pred$9 => {
                                var $227 = Word$i$(Word$or$(_a$pred$9, $225));
                                return $227;
                            });
                            var $224 = $226;
                            break;
                        case 'Word.i':
                            var $228 = self.pred;
                            var $229 = (_a$pred$9 => {
                                var $230 = Word$i$(Word$or$(_a$pred$9, $228));
                                return $230;
                            });
                            var $224 = $229;
                            break;
                        case 'Word.e':
                            var $231 = (_a$pred$7 => {
                                var $232 = Word$e;
                                return $232;
                            });
                            var $224 = $231;
                            break;
                    };
                    var $224 = $224($222);
                    return $224;
                });
                var $210 = $223;
                break;
            case 'Word.e':
                var $233 = (_b$4 => {
                    var $234 = Word$e;
                    return $234;
                });
                var $210 = $233;
                break;
        };
        var $210 = $210(_b$3);
        return $210;
    };
    const Word$or = x0 => x1 => Word$or$(x0, x1);

    function Word$shift_right$one$go$(_word$2) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $236 = self.pred;
                var $237 = Word$o$(Word$shift_right$one$go$($236));
                var $235 = $237;
                break;
            case 'Word.i':
                var $238 = self.pred;
                var $239 = Word$i$(Word$shift_right$one$go$($238));
                var $235 = $239;
                break;
            case 'Word.e':
                var $240 = Word$o$(Word$e);
                var $235 = $240;
                break;
        };
        return $235;
    };
    const Word$shift_right$one$go = x0 => Word$shift_right$one$go$(x0);

    function Word$shift_right$one$(_word$2) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $242 = self.pred;
                var $243 = Word$shift_right$one$go$($242);
                var $241 = $243;
                break;
            case 'Word.i':
                var $244 = self.pred;
                var $245 = Word$shift_right$one$go$($244);
                var $241 = $245;
                break;
            case 'Word.e':
                var $246 = Word$e;
                var $241 = $246;
                break;
        };
        return $241;
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
                    var $247 = _value$3;
                    return $247;
                } else {
                    var $248 = (self - 1n);
                    var $249 = Word$shift_right$($248, Word$shift_right$one$(_value$3));
                    return $249;
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
                var $251 = self.pred;
                var $252 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
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
                            var $253 = $255;
                            break;
                        case 'Word.i':
                            var $259 = self.pred;
                            var $260 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $262 = Word$o$(Word$subber$(_a$pred$10, $259, Bool$true));
                                    var $261 = $262;
                                } else {
                                    var $263 = Word$i$(Word$subber$(_a$pred$10, $259, Bool$true));
                                    var $261 = $263;
                                };
                                return $261;
                            });
                            var $253 = $260;
                            break;
                        case 'Word.e':
                            var $264 = (_a$pred$8 => {
                                var $265 = Word$e;
                                return $265;
                            });
                            var $253 = $264;
                            break;
                    };
                    var $253 = $253($251);
                    return $253;
                });
                var $250 = $252;
                break;
            case 'Word.i':
                var $266 = self.pred;
                var $267 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $269 = self.pred;
                            var $270 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $272 = Word$o$(Word$subber$(_a$pred$10, $269, Bool$false));
                                    var $271 = $272;
                                } else {
                                    var $273 = Word$i$(Word$subber$(_a$pred$10, $269, Bool$false));
                                    var $271 = $273;
                                };
                                return $271;
                            });
                            var $268 = $270;
                            break;
                        case 'Word.i':
                            var $274 = self.pred;
                            var $275 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $277 = Word$i$(Word$subber$(_a$pred$10, $274, Bool$true));
                                    var $276 = $277;
                                } else {
                                    var $278 = Word$o$(Word$subber$(_a$pred$10, $274, Bool$false));
                                    var $276 = $278;
                                };
                                return $276;
                            });
                            var $268 = $275;
                            break;
                        case 'Word.e':
                            var $279 = (_a$pred$8 => {
                                var $280 = Word$e;
                                return $280;
                            });
                            var $268 = $279;
                            break;
                    };
                    var $268 = $268($266);
                    return $268;
                });
                var $250 = $267;
                break;
            case 'Word.e':
                var $281 = (_b$5 => {
                    var $282 = Word$e;
                    return $282;
                });
                var $250 = $281;
                break;
        };
        var $250 = $250(_b$3);
        return $250;
    };
    const Word$subber = x0 => x1 => x2 => Word$subber$(x0, x1, x2);

    function Word$sub$(_a$2, _b$3) {
        var $283 = Word$subber$(_a$2, _b$3, Bool$false);
        return $283;
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
                    var $284 = Pair$new$(Bool$true, Word$or$(_value$5, _mask$6));
                    var self = $284;
                } else {
                    var $285 = Pair$new$(Bool$false, _value$5);
                    var self = $285;
                };
                switch (self._) {
                    case 'Pair.new':
                        var $286 = self.fst;
                        var $287 = self.snd;
                        var self = _shift$2;
                        if (self === 0n) {
                            var $289 = $287;
                            var $288 = $289;
                        } else {
                            var $290 = (self - 1n);
                            var _new_shift_copy$9 = Word$shift_right$(1n, _shift_copy$4);
                            var self = $286;
                            if (self) {
                                var $292 = Word$div$go$($290, Word$sub$(_sub_copy$3, _shift_copy$4), _new_shift_copy$9, $287);
                                var $291 = $292;
                            } else {
                                var $293 = Word$div$go$($290, _sub_copy$3, _new_shift_copy$9, $287);
                                var $291 = $293;
                            };
                            var $288 = $291;
                        };
                        return $288;
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
            var $295 = Word$to_zero$(_a$2);
            var $294 = $295;
        } else {
            var _shift$6 = (_a_bits$4 - _b_bits$5 <= 0n ? 0n : _a_bits$4 - _b_bits$5);
            var _shift_copy$7 = Word$shift_left$(_shift$6, _b$3);
            var $296 = Word$div$go$(_shift$6, _a$2, _shift_copy$7, Word$to_zero$(_a$2));
            var $294 = $296;
        };
        return $294;
    };
    const Word$div = x0 => x1 => Word$div$(x0, x1);
    const U32$div = a0 => a1 => ((a0 / a1) >>> 0);
    const U32$length = a0 => ((a0.length) >>> 0);
    const U32$eql = a0 => a1 => (a0 === a1);
    const U32$inc = a0 => ((a0 + 1) >>> 0);
    const U32$for = a0 => a1 => a2 => a3 => (u32_for(a0, a1, a2, a3));

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
    const U32$add = a0 => a1 => ((a0 + a1) >>> 0);
    const U32$read_base = a0 => a1 => (parseInt(a1, a0));

    function VoxBox$parse_byte$(_idx$1, _voxdata$2) {
        var _chr$3 = (_voxdata$2.slice(((_idx$1 * 2) >>> 0), ((((_idx$1 * 2) >>> 0) + 2) >>> 0)));
        var $297 = (parseInt(_chr$3, 16));
        return $297;
    };
    const VoxBox$parse_byte = x0 => x1 => VoxBox$parse_byte$(x0, x1);
    const U32$or = a0 => a1 => (a0 | a1);

    function Word$fold$(_nil$3, _w0$4, _w1$5, _word$6) {
        var self = _word$6;
        switch (self._) {
            case 'Word.o':
                var $299 = self.pred;
                var $300 = _w0$4(Word$fold$(_nil$3, _w0$4, _w1$5, $299));
                var $298 = $300;
                break;
            case 'Word.i':
                var $301 = self.pred;
                var $302 = _w1$5(Word$fold$(_nil$3, _w0$4, _w1$5, $301));
                var $298 = $302;
                break;
            case 'Word.e':
                var $303 = _nil$3;
                var $298 = $303;
                break;
        };
        return $298;
    };
    const Word$fold = x0 => x1 => x2 => x3 => Word$fold$(x0, x1, x2, x3);
    const Nat$add = a0 => a1 => (a0 + a1);
    const Nat$mul = a0 => a1 => (a0 * a1);

    function Word$to_nat$(_word$2) {
        var $304 = Word$fold$(0n, a1 => (2n * a1), (_x$4 => {
            var $305 = Nat$succ$((2n * _x$4));
            return $305;
        }), _word$2);
        return $304;
    };
    const Word$to_nat = x0 => Word$to_nat$(x0);

    function Word$shl$(_n$2, _value$3) {
        var _n_nat$4 = Word$to_nat$(_n$2);
        var $306 = Word$shift_left$(_n_nat$4, _value$3);
        return $306;
    };
    const Word$shl = x0 => x1 => Word$shl$(x0, x1);
    const U32$shl = a0 => a1 => ((a0 << a1) >>> 0);
    const Pos32$new = a0 => a1 => a2 => ((0 | a0 | (a1 << 12) | (a2 << 24)));
    const Col32$new = a0 => a1 => a2 => a3 => ((0 | a0 | (a1 << 8) | (a2 << 16) | (a3 << 24)));

    function Word$trim$(_new_size$2, _word$3) {
        var self = _new_size$2;
        if (self === 0n) {
            var $308 = Word$e;
            var $307 = $308;
        } else {
            var $309 = (self - 1n);
            var self = _word$3;
            switch (self._) {
                case 'Word.o':
                    var $311 = self.pred;
                    var $312 = Word$o$(Word$trim$($309, $311));
                    var $310 = $312;
                    break;
                case 'Word.i':
                    var $313 = self.pred;
                    var $314 = Word$i$(Word$trim$($309, $313));
                    var $310 = $314;
                    break;
                case 'Word.e':
                    var $315 = Word$o$(Word$trim$($309, Word$e));
                    var $310 = $315;
                    break;
            };
            var $307 = $310;
        };
        return $307;
    };
    const Word$trim = x0 => x1 => Word$trim$(x0, x1);
    const Unit$new = null;

    function Array$extract_tip$(_arr$2) {
        var self = _arr$2;
        switch (self._) {
            case 'Array.tip':
                var $317 = self.value;
                var $318 = $317;
                var $316 = $318;
                break;
            case 'Array.tie':
                var $319 = Unit$new;
                var $316 = $319;
                break;
        };
        return $316;
    };
    const Array$extract_tip = x0 => Array$extract_tip$(x0);

    function Array$extract_tie$(_arr$3) {
        var self = _arr$3;
        switch (self._) {
            case 'Array.tie':
                var $321 = self.lft;
                var $322 = self.rgt;
                var $323 = Pair$new$($321, $322);
                var $320 = $323;
                break;
            case 'Array.tip':
                var $324 = Unit$new;
                var $320 = $324;
                break;
        };
        return $320;
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
                        var $325 = self.pred;
                        var $326 = Word$foldl$(_w0$4(_nil$3), _w0$4, _w1$5, $325);
                        return $326;
                    case 'Word.i':
                        var $327 = self.pred;
                        var $328 = Word$foldl$(_w1$5(_nil$3), _w0$4, _w1$5, $327);
                        return $328;
                    case 'Word.e':
                        var $329 = _nil$3;
                        return $329;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Word$foldl = x0 => x1 => x2 => x3 => Word$foldl$(x0, x1, x2, x3);

    function Array$mut$(_idx$3, _f$4, _arr$5) {
        var $330 = Word$foldl$((_arr$6 => {
            var $331 = Array$tip$(_f$4(Array$extract_tip$(_arr$6)));
            return $331;
        }), (_rec$7 => _arr$8 => {
            var self = Array$extract_tie$(_arr$8);
            switch (self._) {
                case 'Pair.new':
                    var $333 = self.fst;
                    var $334 = self.snd;
                    var $335 = Array$tie$(_rec$7($333), $334);
                    var $332 = $335;
                    break;
            };
            return $332;
        }), (_rec$7 => _arr$8 => {
            var self = Array$extract_tie$(_arr$8);
            switch (self._) {
                case 'Pair.new':
                    var $337 = self.fst;
                    var $338 = self.snd;
                    var $339 = Array$tie$($337, _rec$7($338));
                    var $336 = $339;
                    break;
            };
            return $336;
        }), _idx$3)(_arr$5);
        return $330;
    };
    const Array$mut = x0 => x1 => x2 => Array$mut$(x0, x1, x2);

    function Array$set$(_idx$3, _val$4, _arr$5) {
        var $340 = Array$mut$(_idx$3, (_x$6 => {
            var $341 = _val$4;
            return $341;
        }), _arr$5);
        return $340;
    };
    const Array$set = x0 => x1 => x2 => Array$set$(x0, x1, x2);
    const Buffer32$set = a0 => a1 => a2 => ((a2[a0] = a1, a2));
    const VoxBox$set_pos = a0 => a1 => a2 => ((a2.buffer[a0 * 2] = a1, a2));
    const VoxBox$set_col = a0 => a1 => a2 => ((a2.buffer[a0 * 2 + 1] = a1, a2));

    function VoxBox$set_length$(_length$1, _img$2) {
        var self = _img$2;
        switch (self._) {
            case 'VoxBox.new':
                var $343 = self.capacity;
                var $344 = self.buffer;
                var $345 = VoxBox$new$(_length$1, $343, $344);
                var $342 = $345;
                break;
        };
        return $342;
    };
    const VoxBox$set_length = x0 => x1 => VoxBox$set_length$(x0, x1);
    const VoxBox$push = a0 => a1 => a2 => ((a2.buffer[a2.length * 2] = a0, a2.buffer[a2.length * 2 + 1] = a1, a2.length++, a2));

    function VoxBox$parse$(_voxdata$1) {
        var _siz$2 = ((((_voxdata$1.length) >>> 0) / 12) >>> 0);
        var _img$3 = VoxBox$alloc_capacity$(_siz$2);
        var _img$4 = (() => {
            var $347 = _img$3;
            var $348 = 0;
            var $349 = _siz$2;
            let _img$5 = $347;
            for (let _i$4 = $348; _i$4 < $349; ++_i$4) {
                var _x$6 = VoxBox$parse_byte$(((((_i$4 * 6) >>> 0) + 0) >>> 0), _voxdata$1);
                var _y$7 = VoxBox$parse_byte$(((((_i$4 * 6) >>> 0) + 1) >>> 0), _voxdata$1);
                var _z$8 = VoxBox$parse_byte$(((((_i$4 * 6) >>> 0) + 2) >>> 0), _voxdata$1);
                var _r$9 = VoxBox$parse_byte$(((((_i$4 * 6) >>> 0) + 3) >>> 0), _voxdata$1);
                var _g$10 = VoxBox$parse_byte$(((((_i$4 * 6) >>> 0) + 4) >>> 0), _voxdata$1);
                var _b$11 = VoxBox$parse_byte$(((((_i$4 * 6) >>> 0) + 5) >>> 0), _voxdata$1);
                var _pos$12 = ((0 | _x$6 | (_y$7 << 12) | (_z$8 << 24)));
                var _col$13 = ((0 | _r$9 | (_g$10 << 8) | (_b$11 << 16) | (255 << 24)));
                var $347 = ((_img$5.buffer[_img$5.length * 2] = _pos$12, _img$5.buffer[_img$5.length * 2 + 1] = _col$13, _img$5.length++, _img$5));
                _img$5 = $347;
            };
            return _img$5;
        })();
        var $346 = _img$4;
        return $346;
    };
    const VoxBox$parse = x0 => VoxBox$parse$(x0);
    const Web$Kaelin$Assets$hero$croni0_d_1 = VoxBox$parse$("0f0b16351d4d100b16351d4d0d0c15351d4d0e0c15351d4d0f0c156a3a86100c158e4a9d110c15351d4d120c15351d4d0c0d14351d4d0d0d146a3a860e0d146a3a860f0d148e4a9d100d146a3a86110d146a3a86120d146a3a86130d14351d4d0b0e13351d4d0c0e136a3a860d0e136a3a860e0e136a3a860f0e136a3a86100e136a3a86110e136a3a86120e136a3a86130e136a3a86140e13351d4d0a0f12351d4d0b0f126a3a860c0f126a3a860d0f126a3a860e0f126a3a860f0f126a3a86100f126a3a86110f126a3a86120f126a3a86130f126a3a86140f126a3a86150f12351d4d0a1011351d4d0b10116a3a860c10116a3a860d10116a3a860e10116a3a860f10116a3a861010116a3a861110116a3a861210116a3a861310116a3a861410116a3a86151011351d4d091110351d4d0a11106a3a860b11106a3a860c11106a3a860d11106a3a860e11106a3a860f11106a3a861011106a3a861111106a3a861211106a3a861311106a3a861411106a3a861511106a3a86161110351d4d09120f351d4d0a120f6a3a860b120f6a3a860c120f602d800d120f602d800e120f6a3a860f120f6a3a8610120f6a3a8611120f6a3a8612120f602d8013120f602d8014120f6a3a8615120f6a3a8616120f351d4d09130e351d4d0a130e602d800b130e602d800c130e351d4d0d130e351d4d0e130e6a3a860f130e6a3a8610130e6a3a8611130e6a3a8612130e351d4d13130e351d4d14130e602d8015130e602d8016130e351d4d09140d351d4d0a140d602d800b140d351d4d0c140d351d4d0d140d531e480e140d351d4d0f140d6a3a8610140d6a3a8611140d351d4d12140d531e4813140d351d4d14140d351d4d15140d4a358016140d351d4d09150c351d4d0a150c4a35800b150c351d4d0c150c531e480d150cdf3e460e150c531e480f150c351d4d10150c351d4d11150c531e4812150cdf3e4613150c531e4814150c351d4d15150c4a358016150c351d4d0a160b351d4d0b160b4a35800c160b351d4d0d160b531e480e160b351d4d0f160b351d4d10160b351d4d11160b351d4d12160b531e4813160b351d4d14160b4a358015160b351d4d0b170a351d4d0c170a4a35800d170a8e4a9d0e170a351d4d0f170a351d4d10170a351d4d11170a351d4d12170a8e4a9d13170a4a358014170a351d4d0d1809351d4d0e1809602d800f1809602d801018094a3580111809602d80121809351d4d0c1908351d4d0d19086a3a860e19086a3a860f19086a3a861019084a35801119086a3a861219086a3a86131908351d4d0c1a07351d4d0d1a076a3a860e1a076a3a860f1a076a3a86101a074a3580111a076a3a86121a076a3a86131a07351d4d0c1b06351d4d0d1b068e4a9d0e1b066a3a860f1b066a3a86101b064a3580111b066a3a86121b068e4a9d131b06351d4d0d1c05351d4d0e1c05351d4d0f1c05351d4d101c05351d4d111c05351d4d121c05351d4d111d04351d4d121d04351d4d");

    function I32$new$(_value$1) {
        var $350 = word_to_i32(_value$1);
        return $350;
    };
    const I32$new = x0 => I32$new$(x0);

    function Word$neg$aux$(_word$2, _inc$3) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $352 = self.pred;
                var self = _inc$3;
                if (self) {
                    var $354 = Word$o$(Word$neg$aux$($352, Bool$true));
                    var $353 = $354;
                } else {
                    var $355 = Word$i$(Word$neg$aux$($352, Bool$false));
                    var $353 = $355;
                };
                var $351 = $353;
                break;
            case 'Word.i':
                var $356 = self.pred;
                var self = _inc$3;
                if (self) {
                    var $358 = Word$i$(Word$neg$aux$($356, Bool$false));
                    var $357 = $358;
                } else {
                    var $359 = Word$o$(Word$neg$aux$($356, Bool$false));
                    var $357 = $359;
                };
                var $351 = $357;
                break;
            case 'Word.e':
                var $360 = Word$e;
                var $351 = $360;
                break;
        };
        return $351;
    };
    const Word$neg$aux = x0 => x1 => Word$neg$aux$(x0, x1);

    function Word$neg$(_word$2) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $362 = self.pred;
                var $363 = Word$o$(Word$neg$aux$($362, Bool$true));
                var $361 = $363;
                break;
            case 'Word.i':
                var $364 = self.pred;
                var $365 = Word$i$(Word$neg$aux$($364, Bool$false));
                var $361 = $365;
                break;
            case 'Word.e':
                var $366 = Word$e;
                var $361 = $366;
                break;
        };
        return $361;
    };
    const Word$neg = x0 => Word$neg$(x0);
    const I32$neg = a0 => ((-a0));
    const Int$to_i32 = a0 => (Number(a0));
    const Int$new = a0 => a1 => (a0 - a1);
    const Int$from_nat = a0 => (a0);
    const I32$from_nat = a0 => (Number(a0));

    function List$cons$(_head$2, _tail$3) {
        var $367 = ({
            _: 'List.cons',
            'head': _head$2,
            'tail': _tail$3
        });
        return $367;
    };
    const List$cons = x0 => x1 => List$cons$(x0, x1);

    function Web$Kaelin$Skill$new$(_name$1, _range$2, _effect$3, _key$4) {
        var $368 = ({
            _: 'Web.Kaelin.Skill.new',
            'name': _name$1,
            'range': _range$2,
            'effect': _effect$3,
            'key': _key$4
        });
        return $368;
    };
    const Web$Kaelin$Skill$new = x0 => x1 => x2 => x3 => Web$Kaelin$Skill$new$(x0, x1, x2, x3);

    function Web$Kaelin$Effect$Result$(_A$1) {
        var $369 = null;
        return $369;
    };
    const Web$Kaelin$Effect$Result = x0 => Web$Kaelin$Effect$Result$(x0);

    function List$(_A$1) {
        var $370 = null;
        return $370;
    };
    const List = x0 => List$(x0);

    function List$concat$(_as$2, _bs$3) {
        var self = _as$2;
        switch (self._) {
            case 'List.cons':
                var $372 = self.head;
                var $373 = self.tail;
                var $374 = List$cons$($372, List$concat$($373, _bs$3));
                var $371 = $374;
                break;
            case 'List.nil':
                var $375 = _bs$3;
                var $371 = $375;
                break;
        };
        return $371;
    };
    const List$concat = x0 => x1 => List$concat$(x0, x1);

    function BitsMap$union$(_a$2, _b$3) {
        var self = _a$2;
        switch (self._) {
            case 'BitsMap.tie':
                var $377 = self.val;
                var $378 = self.lft;
                var $379 = self.rgt;
                var self = _b$3;
                switch (self._) {
                    case 'BitsMap.tie':
                        var $381 = self.val;
                        var $382 = self.lft;
                        var $383 = self.rgt;
                        var self = $377;
                        switch (self._) {
                            case 'Maybe.none':
                                var $385 = BitsMap$tie$($381, BitsMap$union$($378, $382), BitsMap$union$($379, $383));
                                var $384 = $385;
                                break;
                            case 'Maybe.some':
                                var $386 = BitsMap$tie$($377, BitsMap$union$($378, $382), BitsMap$union$($379, $383));
                                var $384 = $386;
                                break;
                        };
                        var $380 = $384;
                        break;
                    case 'BitsMap.new':
                        var $387 = _a$2;
                        var $380 = $387;
                        break;
                };
                var $376 = $380;
                break;
            case 'BitsMap.new':
                var $388 = _b$3;
                var $376 = $388;
                break;
        };
        return $376;
    };
    const BitsMap$union = x0 => x1 => BitsMap$union$(x0, x1);

    function NatMap$union$(_a$2, _b$3) {
        var $389 = BitsMap$union$(_a$2, _b$3);
        return $389;
    };
    const NatMap$union = x0 => x1 => NatMap$union$(x0, x1);

    function Web$Kaelin$Effect$Result$new$(_value$2, _map$3, _futures$4, _indicators$5) {
        var $390 = ({
            _: 'Web.Kaelin.Effect.Result.new',
            'value': _value$2,
            'map': _map$3,
            'futures': _futures$4,
            'indicators': _indicators$5
        });
        return $390;
    };
    const Web$Kaelin$Effect$Result$new = x0 => x1 => x2 => x3 => Web$Kaelin$Effect$Result$new$(x0, x1, x2, x3);

    function Web$Kaelin$Effect$bind$(_effect$3, _next$4, _tick$5, _center$6, _target$7, _map$8) {
        var self = _effect$3(_tick$5)(_center$6)(_target$7)(_map$8);
        switch (self._) {
            case 'Web.Kaelin.Effect.Result.new':
                var $392 = self.value;
                var $393 = self.map;
                var $394 = self.futures;
                var $395 = self.indicators;
                var self = _next$4($392)(_tick$5)(_center$6)(_target$7)($393);
                switch (self._) {
                    case 'Web.Kaelin.Effect.Result.new':
                        var $397 = self.value;
                        var $398 = self.map;
                        var $399 = self.futures;
                        var $400 = self.indicators;
                        var _value$17 = $397;
                        var _map$18 = $398;
                        var _futures$19 = List$concat$($394, $399);
                        var _indicators$20 = NatMap$union$($395, $400);
                        var $401 = Web$Kaelin$Effect$Result$new$(_value$17, _map$18, _futures$19, _indicators$20);
                        var $396 = $401;
                        break;
                };
                var $391 = $396;
                break;
        };
        return $391;
    };
    const Web$Kaelin$Effect$bind = x0 => x1 => x2 => x3 => x4 => x5 => Web$Kaelin$Effect$bind$(x0, x1, x2, x3, x4, x5);
    const NatMap$new = BitsMap$new;

    function Web$Kaelin$Effect$pure$(_value$2, _tick$3, _center$4, _target$5, _map$6) {
        var $402 = Web$Kaelin$Effect$Result$new$(_value$2, _map$6, List$nil, NatMap$new);
        return $402;
    };
    const Web$Kaelin$Effect$pure = x0 => x1 => x2 => x3 => x4 => Web$Kaelin$Effect$pure$(x0, x1, x2, x3, x4);

    function Web$Kaelin$Effect$monad$(_new$2) {
        var $403 = _new$2(Web$Kaelin$Effect$bind)(Web$Kaelin$Effect$pure);
        return $403;
    };
    const Web$Kaelin$Effect$monad = x0 => Web$Kaelin$Effect$monad$(x0);
    const NatMap = null;

    function Web$Kaelin$Effect$map$get$(_tick$1, _center$2, _target$3, _map$4) {
        var $404 = Web$Kaelin$Effect$Result$new$(_map$4, _map$4, List$nil, NatMap$new);
        return $404;
    };
    const Web$Kaelin$Effect$map$get = x0 => x1 => x2 => x3 => Web$Kaelin$Effect$map$get$(x0, x1, x2, x3);

    function Web$Kaelin$Effect$coord$get_target$(_tick$1, _center$2, _target$3, _map$4) {
        var $405 = Web$Kaelin$Effect$Result$new$(_target$3, _map$4, List$nil, NatMap$new);
        return $405;
    };
    const Web$Kaelin$Effect$coord$get_target = x0 => x1 => x2 => x3 => Web$Kaelin$Effect$coord$get_target$(x0, x1, x2, x3);
    const I32$sub = a0 => a1 => ((a0 - a1) >> 0);

    function Web$Kaelin$Coord$Cubic$new$(_x$1, _y$2, _z$3) {
        var $406 = ({
            _: 'Web.Kaelin.Coord.Cubic.new',
            'x': _x$1,
            'y': _y$2,
            'z': _z$3
        });
        return $406;
    };
    const Web$Kaelin$Coord$Cubic$new = x0 => x1 => x2 => Web$Kaelin$Coord$Cubic$new$(x0, x1, x2);

    function Web$Kaelin$Coord$Convert$axial_to_cubic$(_coord$1) {
        var self = _coord$1;
        switch (self._) {
            case 'Web.Kaelin.Coord.new':
                var $408 = self.i;
                var $409 = self.j;
                var _x$4 = $408;
                var _z$5 = $409;
                var _y$6 = ((((-_x$4)) - _z$5) >> 0);
                var $410 = Web$Kaelin$Coord$Cubic$new$(_x$4, _y$6, _z$5);
                var $407 = $410;
                break;
        };
        return $407;
    };
    const Web$Kaelin$Coord$Convert$axial_to_cubic = x0 => Web$Kaelin$Coord$Convert$axial_to_cubic$(x0);

    function List$map$(_f$3, _as$4) {
        var self = _as$4;
        switch (self._) {
            case 'List.cons':
                var $412 = self.head;
                var $413 = self.tail;
                var $414 = List$cons$(_f$3($412), List$map$(_f$3, $413));
                var $411 = $414;
                break;
            case 'List.nil':
                var $415 = List$nil;
                var $411 = $415;
                break;
        };
        return $411;
    };
    const List$map = x0 => x1 => List$map$(x0, x1);

    function Web$Kaelin$Coord$Convert$cubic_to_axial$(_coord$1) {
        var self = _coord$1;
        switch (self._) {
            case 'Web.Kaelin.Coord.Cubic.new':
                var $417 = self.x;
                var $418 = self.z;
                var _i$5 = $417;
                var _j$6 = $418;
                var $419 = Web$Kaelin$Coord$new$(_i$5, _j$6);
                var $416 = $419;
                break;
        };
        return $416;
    };
    const Web$Kaelin$Coord$Convert$cubic_to_axial = x0 => Web$Kaelin$Coord$Convert$cubic_to_axial$(x0);
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
        var $420 = (((_n$1) >>> 0));
        return $420;
    };
    const I32$to_u32 = x0 => I32$to_u32$(x0);
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
        var $421 = (((_n$1) >> 0));
        return $421;
    };
    const U32$to_i32 = x0 => U32$to_i32$(x0);

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
                        var $422 = self.pred;
                        var $423 = Word$is_neg$go$($422, Bool$false);
                        return $423;
                    case 'Word.i':
                        var $424 = self.pred;
                        var $425 = Word$is_neg$go$($424, Bool$true);
                        return $425;
                    case 'Word.e':
                        var $426 = _n$3;
                        return $426;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Word$is_neg$go = x0 => x1 => Word$is_neg$go$(x0, x1);

    function Word$is_neg$(_word$2) {
        var $427 = Word$is_neg$go$(_word$2, Bool$false);
        return $427;
    };
    const Word$is_neg = x0 => Word$is_neg$(x0);

    function Cmp$as_gtn$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
            case 'Cmp.eql':
                var $429 = Bool$false;
                var $428 = $429;
                break;
            case 'Cmp.gtn':
                var $430 = Bool$true;
                var $428 = $430;
                break;
        };
        return $428;
    };
    const Cmp$as_gtn = x0 => Cmp$as_gtn$(x0);

    function Cmp$inv$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
                var $432 = Cmp$gtn;
                var $431 = $432;
                break;
            case 'Cmp.eql':
                var $433 = Cmp$eql;
                var $431 = $433;
                break;
            case 'Cmp.gtn':
                var $434 = Cmp$ltn;
                var $431 = $434;
                break;
        };
        return $431;
    };
    const Cmp$inv = x0 => Cmp$inv$(x0);

    function Word$s_gtn$(_a$2, _b$3) {
        var _neg_a$4 = Word$is_neg$(_a$2);
        var _neg_b$5 = Word$is_neg$(_b$3);
        var self = _neg_a$4;
        if (self) {
            var self = _neg_b$5;
            if (self) {
                var $437 = Cmp$as_gtn$(Cmp$inv$(Word$cmp$(_a$2, _b$3)));
                var $436 = $437;
            } else {
                var $438 = Bool$false;
                var $436 = $438;
            };
            var $435 = $436;
        } else {
            var self = _neg_b$5;
            if (self) {
                var $440 = Bool$true;
                var $439 = $440;
            } else {
                var $441 = Cmp$as_gtn$(Word$cmp$(_a$2, _b$3));
                var $439 = $441;
            };
            var $435 = $439;
        };
        return $435;
    };
    const Word$s_gtn = x0 => x1 => Word$s_gtn$(x0, x1);
    const I32$gtn = a0 => a1 => (a0 > a1);

    function I32$max$(_a$1, _b$2) {
        var self = (_a$1 > _b$2);
        if (self) {
            var $443 = _a$1;
            var $442 = $443;
        } else {
            var $444 = _b$2;
            var $442 = $444;
        };
        return $442;
    };
    const I32$max = x0 => x1 => I32$max$(x0, x1);
    const I32$add = a0 => a1 => ((a0 + a1) >> 0);

    function Cmp$as_ltn$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
                var $446 = Bool$true;
                var $445 = $446;
                break;
            case 'Cmp.eql':
            case 'Cmp.gtn':
                var $447 = Bool$false;
                var $445 = $447;
                break;
        };
        return $445;
    };
    const Cmp$as_ltn = x0 => Cmp$as_ltn$(x0);

    function Word$s_ltn$(_a$2, _b$3) {
        var _neg_a$4 = Word$is_neg$(_a$2);
        var _neg_b$5 = Word$is_neg$(_b$3);
        var self = _neg_a$4;
        if (self) {
            var self = _neg_b$5;
            if (self) {
                var $450 = Cmp$as_ltn$(Cmp$inv$(Word$cmp$(_a$2, _b$3)));
                var $449 = $450;
            } else {
                var $451 = Bool$true;
                var $449 = $451;
            };
            var $448 = $449;
        } else {
            var self = _neg_b$5;
            if (self) {
                var $453 = Bool$false;
                var $452 = $453;
            } else {
                var $454 = Cmp$as_ltn$(Word$cmp$(_a$2, _b$3));
                var $452 = $454;
            };
            var $448 = $452;
        };
        return $448;
    };
    const Word$s_ltn = x0 => x1 => Word$s_ltn$(x0, x1);
    const I32$ltn = a0 => a1 => (a0 < a1);

    function I32$min$(_a$1, _b$2) {
        var self = (_a$1 < _b$2);
        if (self) {
            var $456 = _a$1;
            var $455 = $456;
        } else {
            var $457 = _b$2;
            var $455 = $457;
        };
        return $455;
    };
    const I32$min = x0 => x1 => I32$min$(x0, x1);

    function Word$shr$(_n$2, _value$3) {
        var _n_nat$4 = Word$to_nat$(_n$2);
        var $458 = Word$shift_right$(_n_nat$4, _value$3);
        return $458;
    };
    const Word$shr = x0 => x1 => Word$shr$(x0, x1);

    function Word$s_shr$(_n$2, _value$3) {
        var _neg$4 = Word$is_neg$(_n$2);
        var self = _neg$4;
        if (self) {
            var _n$5 = Word$neg$(_n$2);
            var $460 = Word$shl$(_n$5, _value$3);
            var $459 = $460;
        } else {
            var $461 = Word$shr$(_n$2, _value$3);
            var $459 = $461;
        };
        return $459;
    };
    const Word$s_shr = x0 => x1 => Word$s_shr$(x0, x1);
    const I32$shr = a0 => a1 => (a0 >> a1);

    function Word$xor$(_a$2, _b$3) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $463 = self.pred;
                var $464 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $466 = self.pred;
                            var $467 = (_a$pred$9 => {
                                var $468 = Word$o$(Word$xor$(_a$pred$9, $466));
                                return $468;
                            });
                            var $465 = $467;
                            break;
                        case 'Word.i':
                            var $469 = self.pred;
                            var $470 = (_a$pred$9 => {
                                var $471 = Word$i$(Word$xor$(_a$pred$9, $469));
                                return $471;
                            });
                            var $465 = $470;
                            break;
                        case 'Word.e':
                            var $472 = (_a$pred$7 => {
                                var $473 = Word$e;
                                return $473;
                            });
                            var $465 = $472;
                            break;
                    };
                    var $465 = $465($463);
                    return $465;
                });
                var $462 = $464;
                break;
            case 'Word.i':
                var $474 = self.pred;
                var $475 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $477 = self.pred;
                            var $478 = (_a$pred$9 => {
                                var $479 = Word$i$(Word$xor$(_a$pred$9, $477));
                                return $479;
                            });
                            var $476 = $478;
                            break;
                        case 'Word.i':
                            var $480 = self.pred;
                            var $481 = (_a$pred$9 => {
                                var $482 = Word$o$(Word$xor$(_a$pred$9, $480));
                                return $482;
                            });
                            var $476 = $481;
                            break;
                        case 'Word.e':
                            var $483 = (_a$pred$7 => {
                                var $484 = Word$e;
                                return $484;
                            });
                            var $476 = $483;
                            break;
                    };
                    var $476 = $476($474);
                    return $476;
                });
                var $462 = $475;
                break;
            case 'Word.e':
                var $485 = (_b$4 => {
                    var $486 = Word$e;
                    return $486;
                });
                var $462 = $485;
                break;
        };
        var $462 = $462(_b$3);
        return $462;
    };
    const Word$xor = x0 => x1 => Word$xor$(x0, x1);
    const I32$xor = a0 => a1 => (a0 ^ a1);

    function I32$abs$(_a$1) {
        var _mask$2 = (_a$1 >> 31);
        var $487 = (((_mask$2 + _a$1) >> 0) ^ _mask$2);
        return $487;
    };
    const I32$abs = x0 => I32$abs$(x0);

    function Web$Kaelin$Coord$Cubic$add$(_a$1, _b$2) {
        var self = _a$1;
        switch (self._) {
            case 'Web.Kaelin.Coord.Cubic.new':
                var $489 = self.x;
                var $490 = self.y;
                var $491 = self.z;
                var self = _b$2;
                switch (self._) {
                    case 'Web.Kaelin.Coord.Cubic.new':
                        var $493 = self.x;
                        var $494 = self.y;
                        var $495 = self.z;
                        var _x$9 = (($489 + $493) >> 0);
                        var _y$10 = (($490 + $494) >> 0);
                        var _z$11 = (($491 + $495) >> 0);
                        var $496 = Web$Kaelin$Coord$Cubic$new$(_x$9, _y$10, _z$11);
                        var $492 = $496;
                        break;
                };
                var $488 = $492;
                break;
        };
        return $488;
    };
    const Web$Kaelin$Coord$Cubic$add = x0 => x1 => Web$Kaelin$Coord$Cubic$add$(x0, x1);

    function Web$Kaelin$Coord$Cubic$range$(_coord$1, _distance$2) {
        var _distance_32$3 = I32$to_u32$(_distance$2);
        var _double_distance$4 = ((((_distance_32$3 * 2) >>> 0) + 1) >>> 0);
        var _result$5 = List$nil;
        var _result$6 = (() => {
            var $498 = _result$5;
            var $499 = 0;
            var $500 = _double_distance$4;
            let _result$7 = $498;
            for (let _j$6 = $499; _j$6 < $500; ++_j$6) {
                var _negative_distance$8 = ((-_distance$2));
                var _positive_distance$9 = _distance$2;
                var _x$10 = ((U32$to_i32$(_j$6) - _positive_distance$9) >> 0);
                var _max$11 = I32$max$(_negative_distance$8, ((((-_x$10)) + _negative_distance$8) >> 0));
                var _min$12 = I32$min$(_positive_distance$9, ((((-_x$10)) + _positive_distance$9) >> 0));
                var _distance_between_max_min$13 = ((1 + I32$to_u32$(I32$abs$(((_max$11 - _min$12) >> 0)))) >>> 0);
                var _result$14 = (() => {
                    var $501 = _result$7;
                    var $502 = 0;
                    var $503 = _distance_between_max_min$13;
                    let _result$15 = $501;
                    for (let _i$14 = $502; _i$14 < $503; ++_i$14) {
                        var _y$16 = ((U32$to_i32$(_i$14) + _max$11) >> 0);
                        var _z$17 = ((((-_x$10)) - _y$16) >> 0);
                        var _new_coord$18 = Web$Kaelin$Coord$Cubic$add$(_coord$1, Web$Kaelin$Coord$Cubic$new$(_x$10, _y$16, _z$17));
                        var $501 = List$cons$(_new_coord$18, _result$15);
                        _result$15 = $501;
                    };
                    return _result$15;
                })();
                var $498 = _result$14;
                _result$7 = $498;
            };
            return _result$7;
        })();
        var $497 = _result$6;
        return $497;
    };
    const Web$Kaelin$Coord$Cubic$range = x0 => x1 => Web$Kaelin$Coord$Cubic$range$(x0, x1);

    function Web$Kaelin$Coord$Axial$range$(_a$1, _distance$2) {
        var _ab$3 = Web$Kaelin$Coord$Convert$axial_to_cubic$(_a$1);
        var _d$4 = _distance$2;
        var $504 = List$map$(Web$Kaelin$Coord$Convert$cubic_to_axial, Web$Kaelin$Coord$Cubic$range$(_ab$3, _d$4));
        return $504;
    };
    const Web$Kaelin$Coord$Axial$range = x0 => x1 => Web$Kaelin$Coord$Axial$range$(x0, x1);

    function Cmp$as_lte$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
            case 'Cmp.eql':
                var $506 = Bool$true;
                var $505 = $506;
                break;
            case 'Cmp.gtn':
                var $507 = Bool$false;
                var $505 = $507;
                break;
        };
        return $505;
    };
    const Cmp$as_lte = x0 => Cmp$as_lte$(x0);

    function Word$lte$(_a$2, _b$3) {
        var $508 = Cmp$as_lte$(Word$cmp$(_a$2, _b$3));
        return $508;
    };
    const Word$lte = x0 => x1 => Word$lte$(x0, x1);
    const U32$lte = a0 => a1 => (a0 <= a1);

    function Web$Kaelin$Coord$fit$(_coord$1, _map_size$2) {
        var _coord$3 = Web$Kaelin$Coord$Convert$axial_to_cubic$(_coord$1);
        var self = _coord$3;
        switch (self._) {
            case 'Web.Kaelin.Coord.Cubic.new':
                var $510 = self.x;
                var $511 = self.y;
                var $512 = self.z;
                var _x$7 = I32$abs$($510);
                var _y$8 = I32$abs$($511);
                var _z$9 = I32$abs$($512);
                var _greater$10 = I32$max$(_x$7, I32$max$(_y$8, _z$9));
                var _greater$11 = I32$to_u32$(_greater$10);
                var $513 = (_greater$11 <= _map_size$2);
                var $509 = $513;
                break;
        };
        return $509;
    };
    const Web$Kaelin$Coord$fit = x0 => x1 => Web$Kaelin$Coord$fit$(x0, x1);
    const Web$Kaelin$Constants$map_size = 5;

    function List$filter$(_f$2, _xs$3) {
        var self = _xs$3;
        switch (self._) {
            case 'List.cons':
                var $515 = self.head;
                var $516 = self.tail;
                var self = _f$2($515);
                if (self) {
                    var $518 = List$cons$($515, List$filter$(_f$2, $516));
                    var $517 = $518;
                } else {
                    var $519 = List$filter$(_f$2, $516);
                    var $517 = $519;
                };
                var $514 = $517;
                break;
            case 'List.nil':
                var $520 = List$nil;
                var $514 = $520;
                break;
        };
        return $514;
    };
    const List$filter = x0 => x1 => List$filter$(x0, x1);

    function Web$Kaelin$Coord$range$(_coord$1, _distance$2) {
        var _list_coords$3 = Web$Kaelin$Coord$Axial$range$(_coord$1, _distance$2);
        var _fit$4 = (_x$4 => {
            var $522 = Web$Kaelin$Coord$fit$(_x$4, Web$Kaelin$Constants$map_size);
            return $522;
        });
        var $521 = List$filter$(_fit$4, _list_coords$3);
        return $521;
    };
    const Web$Kaelin$Coord$range = x0 => x1 => Web$Kaelin$Coord$range$(x0, x1);
    const List$for = a0 => a1 => a2 => (list_for(a0)(a1)(a2));
    const I32$mul = a0 => a1 => ((a0 * a1) >> 0);
    const U32$to_nat = a0 => (BigInt(a0));

    function Web$Kaelin$Coord$Convert$axial_to_nat$(_coord$1) {
        var self = _coord$1;
        switch (self._) {
            case 'Web.Kaelin.Coord.new':
                var $524 = self.i;
                var $525 = self.j;
                var _i$4 = (($524 + 100) >> 0);
                var _i$5 = ((_i$4 * 1000) >> 0);
                var _i$6 = I32$to_u32$(_i$5);
                var _j$7 = (($525 + 100) >> 0);
                var _j$8 = I32$to_u32$(_j$7);
                var _sum$9 = ((_i$6 + _j$8) >>> 0);
                var $526 = (BigInt(_sum$9));
                var $523 = $526;
                break;
        };
        return $523;
    };
    const Web$Kaelin$Coord$Convert$axial_to_nat = x0 => Web$Kaelin$Coord$Convert$axial_to_nat$(x0);

    function Bits$inc$(_a$1) {
        var self = _a$1;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'o':
                var $528 = self.slice(0, -1);
                var $529 = ($528 + '1');
                var $527 = $529;
                break;
            case 'i':
                var $530 = self.slice(0, -1);
                var $531 = (Bits$inc$($530) + '0');
                var $527 = $531;
                break;
            case 'e':
                var $532 = (Bits$e + '1');
                var $527 = $532;
                break;
        };
        return $527;
    };
    const Bits$inc = x0 => Bits$inc$(x0);
    const Nat$to_bits = a0 => (nat_to_bits(a0));

    function NatMap$set$(_key$2, _val$3, _map$4) {
        var $533 = (bitsmap_set((nat_to_bits(_key$2)), _val$3, _map$4, 'set'));
        return $533;
    };
    const NatMap$set = x0 => x1 => x2 => NatMap$set$(x0, x1, x2);

    function Web$Kaelin$Effect$Result$union$(_a$2, _b$3, _value_union$4) {
        var $534 = Web$Kaelin$Effect$Result$new$(_value_union$4((() => {
            var self = _a$2;
            switch (self._) {
                case 'Web.Kaelin.Effect.Result.new':
                    var $535 = self.value;
                    var $536 = $535;
                    return $536;
            };
        })())((() => {
            var self = _b$3;
            switch (self._) {
                case 'Web.Kaelin.Effect.Result.new':
                    var $537 = self.value;
                    var $538 = $537;
                    return $538;
            };
        })()), NatMap$union$((() => {
            var self = _a$2;
            switch (self._) {
                case 'Web.Kaelin.Effect.Result.new':
                    var $539 = self.map;
                    var $540 = $539;
                    return $540;
            };
        })(), (() => {
            var self = _b$3;
            switch (self._) {
                case 'Web.Kaelin.Effect.Result.new':
                    var $541 = self.map;
                    var $542 = $541;
                    return $542;
            };
        })()), List$concat$((() => {
            var self = _a$2;
            switch (self._) {
                case 'Web.Kaelin.Effect.Result.new':
                    var $543 = self.futures;
                    var $544 = $543;
                    return $544;
            };
        })(), (() => {
            var self = _b$3;
            switch (self._) {
                case 'Web.Kaelin.Effect.Result.new':
                    var $545 = self.futures;
                    var $546 = $545;
                    return $546;
            };
        })()), NatMap$union$((() => {
            var self = _a$2;
            switch (self._) {
                case 'Web.Kaelin.Effect.Result.new':
                    var $547 = self.indicators;
                    var $548 = $547;
                    return $548;
            };
        })(), (() => {
            var self = _b$3;
            switch (self._) {
                case 'Web.Kaelin.Effect.Result.new':
                    var $549 = self.indicators;
                    var $550 = $549;
                    return $550;
            };
        })()));
        return $534;
    };
    const Web$Kaelin$Effect$Result$union = x0 => x1 => x2 => Web$Kaelin$Effect$Result$union$(x0, x1, x2);

    function Web$Kaelin$Effect$area$(_eff$2, _coords$3, _tick$4, _center$5, _target$6, _map$7) {
        var _map_result$8 = NatMap$new;
        var _eff_result$9 = Web$Kaelin$Effect$pure(_map_result$8);
        var _result$10 = Web$Kaelin$Effect$Result$new$(_map_result$8, _map$7, List$nil, NatMap$new);
        var _result$11 = (() => {
            var $553 = _result$10;
            var $554 = _coords$3;
            let _result$12 = $553;
            let _coord$11;
            while ($554._ === 'List.cons') {
                _coord$11 = $554.head;
                var _result_of_effect$13 = _eff$2(_tick$4)(_center$5)(_coord$11)(_map$7);
                var _key$14 = Web$Kaelin$Coord$Convert$axial_to_nat$(_coord$11);
                var _new_form$15 = Web$Kaelin$Effect$Result$new$(NatMap$set$(_key$14, (() => {
                    var self = _result_of_effect$13;
                    switch (self._) {
                        case 'Web.Kaelin.Effect.Result.new':
                            var $555 = self.value;
                            var $556 = $555;
                            return $556;
                    };
                })(), NatMap$new), (() => {
                    var self = _result_of_effect$13;
                    switch (self._) {
                        case 'Web.Kaelin.Effect.Result.new':
                            var $557 = self.map;
                            var $558 = $557;
                            return $558;
                    };
                })(), (() => {
                    var self = _result_of_effect$13;
                    switch (self._) {
                        case 'Web.Kaelin.Effect.Result.new':
                            var $559 = self.futures;
                            var $560 = $559;
                            return $560;
                    };
                })(), (() => {
                    var self = _result_of_effect$13;
                    switch (self._) {
                        case 'Web.Kaelin.Effect.Result.new':
                            var $561 = self.indicators;
                            var $562 = $561;
                            return $562;
                    };
                })());
                var $553 = Web$Kaelin$Effect$Result$union$(_result$12, _new_form$15, NatMap$union);
                _result$12 = $553;
                $554 = $554.tail;
            }
            return _result$12;
        })();
        var $551 = _result$11;
        return $551;
    };
    const Web$Kaelin$Effect$area = x0 => x1 => x2 => x3 => x4 => x5 => Web$Kaelin$Effect$area$(x0, x1, x2, x3, x4, x5);

    function Maybe$(_A$1) {
        var $563 = null;
        return $563;
    };
    const Maybe = x0 => Maybe$(x0);
    const BitsMap$get = a0 => a1 => (bitsmap_get(a0, a1));

    function NatMap$get$(_key$2, _map$3) {
        var $564 = (bitsmap_get((nat_to_bits(_key$2)), _map$3));
        return $564;
    };
    const NatMap$get = x0 => x1 => NatMap$get$(x0, x1);

    function Web$Kaelin$Tile$new$(_background$1, _creature$2) {
        var $565 = ({
            _: 'Web.Kaelin.Tile.new',
            'background': _background$1,
            'creature': _creature$2
        });
        return $565;
    };
    const Web$Kaelin$Tile$new = x0 => x1 => Web$Kaelin$Tile$new$(x0, x1);

    function Web$Kaelin$Map$modify_at$(_mod$1, _pos$2, _map$3) {
        var _key$4 = Web$Kaelin$Coord$Convert$axial_to_nat$(_pos$2);
        var _tile$5 = NatMap$get$(_key$4, _map$3);
        var self = _tile$5;
        switch (self._) {
            case 'Maybe.some':
                var $567 = self.value;
                var self = $567;
                switch (self._) {
                    case 'Web.Kaelin.Tile.new':
                        var $569 = self.background;
                        var $570 = self.creature;
                        var self = $570;
                        switch (self._) {
                            case 'Maybe.some':
                                var $572 = self.value;
                                var _new_creature$10 = _mod$1($572);
                                var _new_tile$11 = Web$Kaelin$Tile$new$($569, Maybe$some$(_new_creature$10));
                                var $573 = NatMap$set$(_key$4, _new_tile$11, _map$3);
                                var $571 = $573;
                                break;
                            case 'Maybe.none':
                                var $574 = _map$3;
                                var $571 = $574;
                                break;
                        };
                        var $568 = $571;
                        break;
                };
                var $566 = $568;
                break;
            case 'Maybe.none':
                var $575 = _map$3;
                var $566 = $575;
                break;
        };
        return $566;
    };
    const Web$Kaelin$Map$modify_at = x0 => x1 => x2 => Web$Kaelin$Map$modify_at$(x0, x1, x2);

    function Word$s_lte$(_a$2, _b$3) {
        var _neg_a$4 = Word$is_neg$(_a$2);
        var _neg_b$5 = Word$is_neg$(_b$3);
        var self = _neg_a$4;
        if (self) {
            var self = _neg_b$5;
            if (self) {
                var $578 = Cmp$as_lte$(Cmp$inv$(Word$cmp$(_a$2, _b$3)));
                var $577 = $578;
            } else {
                var $579 = Bool$true;
                var $577 = $579;
            };
            var $576 = $577;
        } else {
            var self = _neg_b$5;
            if (self) {
                var $581 = Bool$false;
                var $580 = $581;
            } else {
                var $582 = Cmp$as_lte$(Word$cmp$(_a$2, _b$3));
                var $580 = $582;
            };
            var $576 = $580;
        };
        return $576;
    };
    const Word$s_lte = x0 => x1 => Word$s_lte$(x0, x1);
    const I32$lte = a0 => a1 => (a0 <= a1);

    function Web$Kaelin$Creature$new$(_player$1, _hero$2, _team$3, _hp$4, _status$5) {
        var $583 = ({
            _: 'Web.Kaelin.Creature.new',
            'player': _player$1,
            'hero': _hero$2,
            'team': _team$3,
            'hp': _hp$4,
            'status': _status$5
        });
        return $583;
    };
    const Web$Kaelin$Creature$new = x0 => x1 => x2 => x3 => x4 => Web$Kaelin$Creature$new$(x0, x1, x2, x3, x4);

    function Web$Kaelin$Tile$creature$change_hp$(_change$1, _creature$2) {
        var self = _creature$2;
        switch (self._) {
            case 'Web.Kaelin.Creature.new':
                var $585 = self.hero;
                var $586 = self.hp;
                var self = $585;
                switch (self._) {
                    case 'Web.Kaelin.Hero.new':
                        var $588 = self.max_hp;
                        var self = ($586 <= 0);
                        if (self) {
                            var $590 = _creature$2;
                            var $589 = $590;
                        } else {
                            var self = _creature$2;
                            switch (self._) {
                                case 'Web.Kaelin.Creature.new':
                                    var $592 = self.player;
                                    var $593 = self.hero;
                                    var $594 = self.team;
                                    var $595 = self.status;
                                    var $596 = Web$Kaelin$Creature$new$($592, $593, $594, I32$min$((($586 + _change$1) >> 0), $588), $595);
                                    var $591 = $596;
                                    break;
                            };
                            var $589 = $591;
                        };
                        var $587 = $589;
                        break;
                };
                var $584 = $587;
                break;
        };
        return $584;
    };
    const Web$Kaelin$Tile$creature$change_hp = x0 => x1 => Web$Kaelin$Tile$creature$change_hp$(x0, x1);

    function Web$Kaelin$Map$change_hp_at$(_value$1, _pos$2, _map$3) {
        var _map$4 = Web$Kaelin$Map$modify_at$(Web$Kaelin$Tile$creature$change_hp(_value$1), _pos$2, _map$3);
        var $597 = Pair$new$(_value$1, _map$4);
        return $597;
    };
    const Web$Kaelin$Map$change_hp_at = x0 => x1 => x2 => Web$Kaelin$Map$change_hp_at$(x0, x1, x2);

    function Pair$fst$(_pair$3) {
        var self = _pair$3;
        switch (self._) {
            case 'Pair.new':
                var $599 = self.fst;
                var $600 = $599;
                var $598 = $600;
                break;
        };
        return $598;
    };
    const Pair$fst = x0 => Pair$fst$(x0);

    function Pair$snd$(_pair$3) {
        var self = _pair$3;
        switch (self._) {
            case 'Pair.new':
                var $602 = self.snd;
                var $603 = $602;
                var $601 = $603;
                break;
        };
        return $601;
    };
    const Pair$snd = x0 => Pair$snd$(x0);

    function Web$Kaelin$Effect$map$set$(_new_map$1, _tick$2, _center$3, _target$4, _map$5) {
        var $604 = Web$Kaelin$Effect$Result$new$(Unit$new, _new_map$1, List$nil, NatMap$new);
        return $604;
    };
    const Web$Kaelin$Effect$map$set = x0 => x1 => x2 => x3 => x4 => Web$Kaelin$Effect$map$set$(x0, x1, x2, x3, x4);

    function Word$s_gte$(_a$2, _b$3) {
        var _neg_a$4 = Word$is_neg$(_a$2);
        var _neg_b$5 = Word$is_neg$(_b$3);
        var self = _neg_a$4;
        if (self) {
            var self = _neg_b$5;
            if (self) {
                var $607 = Cmp$as_gte$(Cmp$inv$(Word$cmp$(_a$2, _b$3)));
                var $606 = $607;
            } else {
                var $608 = Bool$false;
                var $606 = $608;
            };
            var $605 = $606;
        } else {
            var self = _neg_b$5;
            if (self) {
                var $610 = Bool$true;
                var $609 = $610;
            } else {
                var $611 = Cmp$as_gte$(Word$cmp$(_a$2, _b$3));
                var $609 = $611;
            };
            var $605 = $609;
        };
        return $605;
    };
    const Word$s_gte = x0 => x1 => Word$s_gte$(x0, x1);
    const I32$gte = a0 => a1 => (a0 >= a1);

    function Web$Kaelin$Effect$(_A$1) {
        var $612 = null;
        return $612;
    };
    const Web$Kaelin$Effect = x0 => Web$Kaelin$Effect$(x0);

    function Web$Kaelin$Effect$indicators$add$(_indicators$1, _tick$2, _center$3, _target$4, _map$5) {
        var $613 = Web$Kaelin$Effect$Result$new$(Unit$new, _map$5, List$nil, _indicators$1);
        return $613;
    };
    const Web$Kaelin$Effect$indicators$add = x0 => x1 => x2 => x3 => x4 => Web$Kaelin$Effect$indicators$add$(x0, x1, x2, x3, x4);
    const Web$Kaelin$Indicator$green = ({
        _: 'Web.Kaelin.Indicator.green'
    });
    const Web$Kaelin$Indicator$red = ({
        _: 'Web.Kaelin.Indicator.red'
    });

    function Web$Kaelin$Effect$hp$change$(_change$1) {
        var $614 = Web$Kaelin$Effect$monad$((_m$bind$2 => _m$pure$3 => {
            var $615 = _m$bind$2;
            return $615;
        }))(Web$Kaelin$Effect$map$get)((_map$2 => {
            var $616 = Web$Kaelin$Effect$monad$((_m$bind$3 => _m$pure$4 => {
                var $617 = _m$bind$3;
                return $617;
            }))(Web$Kaelin$Effect$coord$get_target)((_target$3 => {
                var _res$4 = Web$Kaelin$Map$change_hp_at$(_change$1, _target$3, _map$2);
                var _dhp$5 = Pair$fst$(_res$4);
                var _map$6 = Pair$snd$(_res$4);
                var _key$7 = Web$Kaelin$Coord$Convert$axial_to_nat$(_target$3);
                var _indicators$8 = NatMap$new;
                var $618 = Web$Kaelin$Effect$monad$((_m$bind$9 => _m$pure$10 => {
                    var $619 = _m$bind$9;
                    return $619;
                }))(Web$Kaelin$Effect$map$set(_map$6))((_$9 => {
                    var $620 = Web$Kaelin$Effect$monad$((_m$bind$10 => _m$pure$11 => {
                        var $621 = _m$bind$10;
                        return $621;
                    }))((() => {
                        var self = (_dhp$5 >= 0);
                        if (self) {
                            var $622 = Web$Kaelin$Effect$indicators$add(NatMap$set$(_key$7, Web$Kaelin$Indicator$green, _indicators$8));
                            return $622;
                        } else {
                            var self = (_dhp$5 < 0);
                            if (self) {
                                var $624 = Web$Kaelin$Effect$indicators$add(NatMap$set$(_key$7, Web$Kaelin$Indicator$red, _indicators$8));
                                var $623 = $624;
                            } else {
                                var $625 = Web$Kaelin$Effect$monad$((_m$bind$10 => _m$pure$11 => {
                                    var $626 = _m$pure$11;
                                    return $626;
                                }))(Unit$new);
                                var $623 = $625;
                            };
                            return $623;
                        };
                    })())((_$10 => {
                        var $627 = Web$Kaelin$Effect$monad$((_m$bind$11 => _m$pure$12 => {
                            var $628 = _m$pure$12;
                            return $628;
                        }))(_dhp$5);
                        return $627;
                    }));
                    return $620;
                }));
                return $618;
            }));
            return $616;
        }));
        return $614;
    };
    const Web$Kaelin$Effect$hp$change = x0 => Web$Kaelin$Effect$hp$change$(x0);

    function Web$Kaelin$Effect$hp$damage$(_dmg$1) {
        var $629 = Web$Kaelin$Effect$hp$change$(((-_dmg$1)));
        return $629;
    };
    const Web$Kaelin$Effect$hp$damage = x0 => Web$Kaelin$Effect$hp$damage$(x0);

    function Web$Kaelin$Effect$all$fireball$(_dmg$1, _range$2) {
        var $630 = Web$Kaelin$Effect$monad$((_m$bind$3 => _m$pure$4 => {
            var $631 = _m$bind$3;
            return $631;
        }))(Web$Kaelin$Effect$map$get)((_map$3 => {
            var $632 = Web$Kaelin$Effect$monad$((_m$bind$4 => _m$pure$5 => {
                var $633 = _m$bind$4;
                return $633;
            }))(Web$Kaelin$Effect$coord$get_target)((_target_pos$4 => {
                var _coords$5 = Web$Kaelin$Coord$range$(_target_pos$4, _range$2);
                var $634 = Web$Kaelin$Effect$monad$((_m$bind$6 => _m$pure$7 => {
                    var $635 = _m$bind$6;
                    return $635;
                }))(Web$Kaelin$Effect$area(Web$Kaelin$Effect$hp$damage$(_dmg$1))(_coords$5))((_$6 => {
                    var $636 = Web$Kaelin$Effect$monad$((_m$bind$7 => _m$pure$8 => {
                        var $637 = _m$pure$8;
                        return $637;
                    }))(Unit$new);
                    return $636;
                }));
                return $634;
            }));
            return $632;
        }));
        return $630;
    };
    const Web$Kaelin$Effect$all$fireball = x0 => x1 => Web$Kaelin$Effect$all$fireball$(x0, x1);
    const Web$Kaelin$Heroes$Croni$skills$quick_shot = Web$Kaelin$Skill$new$("Quick Shot", 2, Web$Kaelin$Effect$all$fireball$(3, 1), 48);

    function Web$Kaelin$Effect$coord$get_center$(_tick$1, _center$2, _target$3, _map$4) {
        var $638 = Web$Kaelin$Effect$Result$new$(_center$2, _map$4, List$nil, NatMap$new);
        return $638;
    };
    const Web$Kaelin$Effect$coord$get_center = x0 => x1 => x2 => x3 => Web$Kaelin$Effect$coord$get_center$(x0, x1, x2, x3);

    function Web$Kaelin$Effect$hp$change_at$(_change$1, _pos$2) {
        var $639 = Web$Kaelin$Effect$monad$((_m$bind$3 => _m$pure$4 => {
            var $640 = _m$bind$3;
            return $640;
        }))(Web$Kaelin$Effect$map$get)((_map$3 => {
            var _res$4 = Web$Kaelin$Map$change_hp_at$(_change$1, _pos$2, _map$3);
            var _dhp$5 = Pair$fst$(_res$4);
            var _map$6 = Pair$snd$(_res$4);
            var _key$7 = Web$Kaelin$Coord$Convert$axial_to_nat$(_pos$2);
            var _indicators$8 = NatMap$new;
            var $641 = Web$Kaelin$Effect$monad$((_m$bind$9 => _m$pure$10 => {
                var $642 = _m$bind$9;
                return $642;
            }))(Web$Kaelin$Effect$map$set(_map$6))((_$9 => {
                var $643 = Web$Kaelin$Effect$monad$((_m$bind$10 => _m$pure$11 => {
                    var $644 = _m$bind$10;
                    return $644;
                }))((() => {
                    var self = (_dhp$5 >= 0);
                    if (self) {
                        var $645 = Web$Kaelin$Effect$indicators$add(NatMap$set$(_key$7, Web$Kaelin$Indicator$green, _indicators$8));
                        return $645;
                    } else {
                        var self = (_dhp$5 < 0);
                        if (self) {
                            var $647 = Web$Kaelin$Effect$indicators$add(NatMap$set$(_key$7, Web$Kaelin$Indicator$red, _indicators$8));
                            var $646 = $647;
                        } else {
                            var $648 = Web$Kaelin$Effect$monad$((_m$bind$10 => _m$pure$11 => {
                                var $649 = _m$pure$11;
                                return $649;
                            }))(Unit$new);
                            var $646 = $648;
                        };
                        return $646;
                    };
                })())((_$10 => {
                    var $650 = Web$Kaelin$Effect$monad$((_m$bind$11 => _m$pure$12 => {
                        var $651 = _m$pure$12;
                        return $651;
                    }))(_dhp$5);
                    return $650;
                }));
                return $643;
            }));
            return $641;
        }));
        return $639;
    };
    const Web$Kaelin$Effect$hp$change_at = x0 => x1 => Web$Kaelin$Effect$hp$change_at$(x0, x1);

    function Web$Kaelin$Effect$hp$damage_at$(_dmg$1, _pos$2) {
        var $652 = Web$Kaelin$Effect$hp$change_at$(((-_dmg$1)), _pos$2);
        return $652;
    };
    const Web$Kaelin$Effect$hp$damage_at = x0 => x1 => Web$Kaelin$Effect$hp$damage_at$(x0, x1);

    function Web$Kaelin$Effect$hp$heal_at$(_dmg$1, _pos$2) {
        var $653 = Web$Kaelin$Effect$hp$change_at$(((-_dmg$1)), _pos$2);
        return $653;
    };
    const Web$Kaelin$Effect$hp$heal_at = x0 => x1 => Web$Kaelin$Effect$hp$heal_at$(x0, x1);

    function Web$Kaelin$Effect$all$vampirism$(_dmg$1) {
        var $654 = Web$Kaelin$Effect$monad$((_m$bind$2 => _m$pure$3 => {
            var $655 = _m$bind$2;
            return $655;
        }))(Web$Kaelin$Effect$coord$get_center)((_center_pos$2 => {
            var $656 = Web$Kaelin$Effect$monad$((_m$bind$3 => _m$pure$4 => {
                var $657 = _m$bind$3;
                return $657;
            }))(Web$Kaelin$Effect$coord$get_target)((_target_pos$3 => {
                var $658 = Web$Kaelin$Effect$monad$((_m$bind$4 => _m$pure$5 => {
                    var $659 = _m$bind$4;
                    return $659;
                }))(Web$Kaelin$Effect$hp$damage_at$(_dmg$1, _target_pos$3))((_actual_dmg$4 => {
                    var $660 = Web$Kaelin$Effect$monad$((_m$bind$5 => _m$pure$6 => {
                        var $661 = _m$bind$5;
                        return $661;
                    }))(Web$Kaelin$Effect$hp$heal_at$(_actual_dmg$4, _center_pos$2))((_$5 => {
                        var $662 = Web$Kaelin$Effect$monad$((_m$bind$6 => _m$pure$7 => {
                            var $663 = _m$pure$7;
                            return $663;
                        }))(Unit$new);
                        return $662;
                    }));
                    return $660;
                }));
                return $658;
            }));
            return $656;
        }));
        return $654;
    };
    const Web$Kaelin$Effect$all$vampirism = x0 => Web$Kaelin$Effect$all$vampirism$(x0);
    const Web$Kaelin$Heroes$Croni$skills$vampirism = Web$Kaelin$Skill$new$("Vampirism", 3, Web$Kaelin$Effect$all$vampirism$(3), 86);

    function Web$Kaelin$Map$get$(_coord$1, _map$2) {
        var _key$3 = Web$Kaelin$Coord$Convert$axial_to_nat$(_coord$1);
        var $664 = NatMap$get$(_key$3, _map$2);
        return $664;
    };
    const Web$Kaelin$Map$get = x0 => x1 => Web$Kaelin$Map$get$(x0, x1);

    function Web$Kaelin$Map$is_occupied$(_coord$1, _map$2) {
        var _maybe_tile$3 = Web$Kaelin$Map$get$(_coord$1, _map$2);
        var self = _maybe_tile$3;
        switch (self._) {
            case 'Maybe.some':
                var $666 = self.value;
                var self = $666;
                switch (self._) {
                    case 'Web.Kaelin.Tile.new':
                        var $668 = self.creature;
                        var self = $668;
                        switch (self._) {
                            case 'Maybe.none':
                                var $670 = Bool$false;
                                var $669 = $670;
                                break;
                            case 'Maybe.some':
                                var $671 = Bool$true;
                                var $669 = $671;
                                break;
                        };
                        var $667 = $669;
                        break;
                };
                var $665 = $667;
                break;
            case 'Maybe.none':
                var $672 = Bool$false;
                var $665 = $672;
                break;
        };
        return $665;
    };
    const Web$Kaelin$Map$is_occupied = x0 => x1 => Web$Kaelin$Map$is_occupied$(x0, x1);

    function Web$Kaelin$Map$set$(_coord$1, _tile$2, _map$3) {
        var _key$4 = Web$Kaelin$Coord$Convert$axial_to_nat$(_coord$1);
        var $673 = NatMap$set$(_key$4, _tile$2, _map$3);
        return $673;
    };
    const Web$Kaelin$Map$set = x0 => x1 => x2 => Web$Kaelin$Map$set$(x0, x1, x2);

    function Web$Kaelin$Map$pop_creature$(_coord$1, _map$2) {
        var _tile$3 = Web$Kaelin$Map$get$(_coord$1, _map$2);
        var self = _tile$3;
        switch (self._) {
            case 'Maybe.some':
                var $675 = self.value;
                var self = $675;
                switch (self._) {
                    case 'Web.Kaelin.Tile.new':
                        var $677 = self.background;
                        var $678 = self.creature;
                        var _creature$7 = $678;
                        var _remaining_tile$8 = Web$Kaelin$Tile$new$($677, Maybe$none);
                        var _new_map$9 = Web$Kaelin$Map$set$(_coord$1, _remaining_tile$8, _map$2);
                        var $679 = Pair$new$(_new_map$9, _creature$7);
                        var $676 = $679;
                        break;
                };
                var $674 = $676;
                break;
            case 'Maybe.none':
                var $680 = Pair$new$(_map$2, Maybe$none);
                var $674 = $680;
                break;
        };
        return $674;
    };
    const Web$Kaelin$Map$pop_creature = x0 => x1 => Web$Kaelin$Map$pop_creature$(x0, x1);

    function Web$Kaelin$Map$Entity$creature$(_value$1) {
        var $681 = ({
            _: 'Web.Kaelin.Map.Entity.creature',
            'value': _value$1
        });
        return $681;
    };
    const Web$Kaelin$Map$Entity$creature = x0 => Web$Kaelin$Map$Entity$creature$(x0);

    function Web$Kaelin$Map$push$(_coord$1, _entity$2, _map$3) {
        var _tile$4 = Web$Kaelin$Map$get$(_coord$1, _map$3);
        var self = _tile$4;
        switch (self._) {
            case 'Maybe.some':
                var $683 = self.value;
                var self = $683;
                switch (self._) {
                    case 'Web.Kaelin.Tile.new':
                        var self = _entity$2;
                        switch (self._) {
                            case 'Web.Kaelin.Map.Entity.background':
                                var $686 = self.value;
                                var self = $683;
                                switch (self._) {
                                    case 'Web.Kaelin.Tile.new':
                                        var $688 = self.creature;
                                        var $689 = Web$Kaelin$Tile$new$($686, $688);
                                        var _background_tile$9 = $689;
                                        break;
                                };
                                var $687 = Web$Kaelin$Map$set$(_coord$1, _background_tile$9, _map$3);
                                var $685 = $687;
                                break;
                            case 'Web.Kaelin.Map.Entity.creature':
                                var $690 = self.value;
                                var self = $683;
                                switch (self._) {
                                    case 'Web.Kaelin.Tile.new':
                                        var $692 = self.background;
                                        var $693 = Web$Kaelin$Tile$new$($692, Maybe$some$($690));
                                        var _creature_tile$9 = $693;
                                        break;
                                };
                                var $691 = Web$Kaelin$Map$set$(_coord$1, _creature_tile$9, _map$3);
                                var $685 = $691;
                                break;
                            case 'Web.Kaelin.Map.Entity.animation':
                                var $694 = _map$3;
                                var $685 = $694;
                                break;
                        };
                        var $684 = $685;
                        break;
                };
                var $682 = $684;
                break;
            case 'Maybe.none':
                var self = _entity$2;
                switch (self._) {
                    case 'Web.Kaelin.Map.Entity.background':
                        var $696 = self.value;
                        var _new_tile$6 = Web$Kaelin$Tile$new$($696, Maybe$none);
                        var $697 = Web$Kaelin$Map$set$(_coord$1, _new_tile$6, _map$3);
                        var $695 = $697;
                        break;
                    case 'Web.Kaelin.Map.Entity.animation':
                    case 'Web.Kaelin.Map.Entity.creature':
                        var $698 = _map$3;
                        var $695 = $698;
                        break;
                };
                var $682 = $695;
                break;
        };
        return $682;
    };
    const Web$Kaelin$Map$push = x0 => x1 => x2 => Web$Kaelin$Map$push$(x0, x1, x2);

    function Web$Kaelin$Map$swap$(_ca$1, _cb$2, _map$3) {
        var self = Web$Kaelin$Map$pop_creature$(_ca$1, _map$3);
        switch (self._) {
            case 'Pair.new':
                var $700 = self.fst;
                var $701 = self.snd;
                var self = $701;
                switch (self._) {
                    case 'Maybe.some':
                        var $703 = self.value;
                        var _entity$7 = Web$Kaelin$Map$Entity$creature$($703);
                        var $704 = Web$Kaelin$Map$push$(_cb$2, _entity$7, $700);
                        var $702 = $704;
                        break;
                    case 'Maybe.none':
                        var $705 = _map$3;
                        var $702 = $705;
                        break;
                };
                var $699 = $702;
                break;
        };
        return $699;
    };
    const Web$Kaelin$Map$swap = x0 => x1 => x2 => Web$Kaelin$Map$swap$(x0, x1, x2);
    const Web$Kaelin$Effect$all$move = Web$Kaelin$Effect$monad$((_m$bind$1 => _m$pure$2 => {
        var $706 = _m$bind$1;
        return $706;
    }))(Web$Kaelin$Effect$map$get)((_map$1 => {
        var $707 = Web$Kaelin$Effect$monad$((_m$bind$2 => _m$pure$3 => {
            var $708 = _m$bind$2;
            return $708;
        }))(Web$Kaelin$Effect$coord$get_center)((_center$2 => {
            var $709 = Web$Kaelin$Effect$monad$((_m$bind$3 => _m$pure$4 => {
                var $710 = _m$bind$3;
                return $710;
            }))(Web$Kaelin$Effect$coord$get_target)((_target$3 => {
                var _key$4 = Web$Kaelin$Coord$Convert$axial_to_nat$(_center$2);
                var _tile$5 = NatMap$get$(_key$4, _map$1);
                var self = _tile$5;
                switch (self._) {
                    case 'Maybe.some':
                        var $712 = self.value;
                        var self = $712;
                        switch (self._) {
                            case 'Web.Kaelin.Tile.new':
                                var self = Web$Kaelin$Map$is_occupied$(_target$3, _map$1);
                                if (self) {
                                    var $715 = Web$Kaelin$Effect$monad$((_m$bind$9 => _m$pure$10 => {
                                        var $716 = _m$pure$10;
                                        return $716;
                                    }))(Unit$new);
                                    var $714 = $715;
                                } else {
                                    var _new_map$9 = Web$Kaelin$Map$swap$(_center$2, _target$3, _map$1);
                                    var $717 = Web$Kaelin$Effect$map$set(_new_map$9);
                                    var $714 = $717;
                                };
                                var $713 = $714;
                                break;
                        };
                        var $711 = $713;
                        break;
                    case 'Maybe.none':
                        var $718 = Web$Kaelin$Effect$monad$((_m$bind$6 => _m$pure$7 => {
                            var $719 = _m$pure$7;
                            return $719;
                        }))(Unit$new);
                        var $711 = $718;
                        break;
                };
                return $711;
            }));
            return $709;
        }));
        return $707;
    }));

    function Web$Kaelin$Skill$move$(_range$1) {
        var $720 = Web$Kaelin$Skill$new$("Move", _range$1, Web$Kaelin$Effect$all$move, 88);
        return $720;
    };
    const Web$Kaelin$Skill$move = x0 => Web$Kaelin$Skill$move$(x0);
    const Web$Kaelin$Heroes$Croni$skills = List$cons$(Web$Kaelin$Heroes$Croni$skills$quick_shot, List$cons$(Web$Kaelin$Heroes$Croni$skills$vampirism, List$cons$(Web$Kaelin$Skill$move$(2), List$nil)));
    const Web$Kaelin$Heroes$Croni$hero = Web$Kaelin$Hero$new$("Croni", Web$Kaelin$Assets$hero$croni0_d_1, 25, Web$Kaelin$Heroes$Croni$skills);
    const Web$Kaelin$Assets$hero$cyclope_d_1 = VoxBox$parse$("0e0a212c333d0f0a212c333d100a212c333d110a212c333d0d0b202c333d0e0b20fff9e10f0b20fff9e1100b20fff9e1110b20fff9e1120b202c333d0d0c1f2c333d0e0c1ffff9e10f0c1ffff9e1100c1ffff9e1110c1ffff9e1120c1f2c333d0c0d1e2729600d0d1e2729600e0d1efff9e10f0d1eccc8b7100d1eccc8b7110d1eccc8b7120d1e272960130d1e272960140d1e2729600c0e1d2729600d0e1d2729600e0e1dfff9e10f0e1dccc8b7100e1dccc8b7110e1dccc8b7120e1d272960130e1d272960140e1d272960050f1c272960060f1c272960070f1c272960090f1c2729600a0f1c2729600b0f1c2729600c0f1c5176b80d0f1cfff9e10e0f1cdfdbc80f0f1cdfdbc8100f1cdfdbc8110f1cdfdbc8120f1cccc8b7130f1c5176b8140f1c5176b8150f1c27296005101b27296006101b799cd307101b799cd308101b27296009101b5176b80a101b5176b80b101b5176b80c101b799cd30d101b5176b80e101bdfdbc80f101bccc8b710101bccc8b711101bccc8b712101b5176b813101b799cd314101b799cd315101b5176b816101b27296017101b27296018101b27296005111a27296006111a799cd307111a799cd308111a27296009111a5176b80a111a5176b80b111a5176b80c111a799cd30d111a5176b80e111adfdbc80f111accc8b710111accc8b711111accc8b712111a5176b813111a799cd314111a799cd315111a5176b816111a27296017111a27296018111a2729600512192729600612195176b80712195176b8081219394c87091219799cd30a1219799cd30b1219799cd30c12195176b80d12194a2b710e12194a2b710f12194a2b711012194a2b711112194a2b711212194a2b711312195176b81412195176b8151219799cd31612192729601712192729601812192729600513182729600613185176b80713185176b8081318394c87091318799cd30a1318799cd30b1318799cd30c13185176b80d13184a2b710e13184a2b710f13184a2b711013184a2b711113184a2b711213184a2b711313185176b81413185176b8151318799cd3161318272960171318272960181318272960051417272960061417272960071417272960081417394c870914175176b80a14175176b80b14175176b80c14174a2b710d1417dab04d0e1417dab04d0f1417dab04d101417dab04d111417dab04d121417dab04d1314174a2b711414174a2b711514175176b8161417394c87171417394c87181417394c871914172729601a1417272960051516272960061516799cd3071516799cd3081516394c870915165176b80a15165176b80b15165176b80c15164a2b710d1516dab04d0e1516fff9e10f1516fff9e1101516fff9e1111516fff9e1121516dab04d1315164a2b711415164a2b711515165176b8161516394c87171516394c87181516394c87191516799cd31a1516272960051615272960061615799cd3071615799cd3081615394c870916155176b80a16155176b80b16155176b80c16154a2b710d1615dab04d0e1615fff9e10f1615fff9e1101615fff9e1111615fff9e1121615dab04d1316154a2b711416154a2b711516155176b8161615394c87171615394c87181615394c87191615799cd31a1615272960051714272960061714272960071714272960081714394c870917145176b80a17145176b80b17145176b80c17144a2b710d1714dab04d0e17142421260f1714242126101714242126111714242126121714dab04d1317144a2b711417144a2b711517145176b8161714394c87171714394c87181714394c871917142729601a17145176b81b17142729600518132729600618135176b80718135176b8081813394c870918135176b80a18135176b80b18135176b80c18135176b80d18134a2b710e18134a2b710f18134a2b711018134a2b711118134a2b711218134a2b711318135176b81418135176b81518135176b8161813394c87171813394c87181813394c87191813799cd31a1813799cd31b18132729600519122729600619125176b80719125176b8081912394c870919125176b80a19125176b80b19125176b80c19125176b80d19124a2b710e19124a2b710f19124a2b711019124a2b711119124a2b711219124a2b711319125176b81419125176b81519125176b8161912394c87171912394c87181912394c87191912799cd31a1912799cd31b1912272960051a11272960061a115176b8071a115176b8081a11394c87091a115176b80a1a115176b80b1a115176b80c1a115176b80d1a114a2b710e1a114a2b710f1a114a2b71101a114a2b71111a114a2b71121a114a2b71131a115176b8141a115176b8151a115176b8161a11394c87171a11394c87181a11394c87191a11799cd31a1a11799cd31b1a11272960051b10272960061b10799cd3071b10799cd3081b105176b8091b10394c870a1b10394c870b1b10394c870c1b10dfdbc80d1b105176b80e1b105176b80f1b105176b8101b105176b8111b105176b8121b105176b8131b10dfdbc8141b10dfdbc8151b10394c87161b105176b8171b105176b8181b105176b8191b105176b81a1b10799cd31b1b10272960061c0f272960071c0f272960081c0f272960091c0f394c870a1c0f394c870b1c0f394c870c1c0fdfdbc80d1c0f4662a10e1c0f4662a10f1c0f4662a1101c0f4662a1111c0f4662a1121c0f4662a1131c0fdfdbc8141c0fdfdbc8151c0f394c87161c0f394c87171c0f394c87181c0f394c87191c0f5176b81a1c0f5176b81b1c0f272960081d0e272960091d0e5176b80a1d0e5176b80b1d0e5176b80c1d0e394c870d1d0e394c870e1d0e394c870f1d0e394c87101d0e394c87111d0e394c87121d0e394c87131d0e394c87141d0e394c87151d0e5176b8161d0e394c87171d0e394c87181d0e394c87191d0e5176b81a1d0e5176b81b1d0e272960081e0d272960091e0d5176b80a1e0d5176b80b1e0d5176b80c1e0d394c870d1e0d394c870e1e0d394c870f1e0d394c87101e0d394c87111e0d394c87121e0d394c87131e0d394c87141e0d394c87151e0d5176b8161e0d394c87171e0d394c87181e0d394c87191e0d5176b81a1e0d5176b81b1e0d272960081f0c272960091f0c5176b80a1f0c5176b80b1f0c5176b80c1f0c394c870d1f0c394c870e1f0c394c870f1f0c394c87101f0c394c87111f0c394c87121f0c394c87131f0c394c87141f0c394c87151f0c5176b8161f0c394c87171f0c394c87181f0c394c87191f0c5176b81a1f0c5176b81b1f0c27296008200b27296009200b5176b80a200b5176b80b200b5176b80c200b5176b80d200b5176b80e200b5176b80f200b5176b810200b5176b811200b5176b812200b5176b813200b5176b814200b5176b815200b394c8716200b799cd317200b799cd318200b799cd319200b5176b81a200b5176b81b200b27296008210a27296009210a8e4a9d0a210a8e4a9d0b210a8e4a9d0c210a8e4a9d0d210a5176b80e210a5176b80f210a5176b810210a5176b811210a5176b812210a5176b813210a394c8714210a394c8715210a394c8716210a799cd317210a799cd318210a799cd319210a799cd31a210a5176b81b210a2729600922092729600a22092729600b22092729600c22094a2b710d22098e4a9d0e22098e4a9d0f22098e4a9d1022098e4a9d1122098e4a9d1222098e4a9d132209394c87142209394c871522095176b8162209394c87172209394c87182209394c87192209394c871a22092729600923082729600a23082729600b23082729600c23084a2b710d23088e4a9d0e23088e4a9d0f23088e4a9d1023088e4a9d1123088e4a9d1223088e4a9d132308394c87142308394c871523085176b8162308394c87172308394c87182308394c87192308394c871a23082729600924072729600a24072729600b24072729600c24074a2b710d24078e4a9d0e24078e4a9d0f24078e4a9d1024078e4a9d1124078e4a9d1224078e4a9d132407394c87142407394c871524075176b8162407394c87172407394c87182407394c87192407394c871a24072729600925062729600a25062729600b25062729600c25065176b80d25064a2b710e25068e4a9d0f25068e4a9d1025068e4a9d1125068e4a9d1225064a2b71132506394c87142506394c87152506799cd3162506799cd3172506799cd3182506799cd31925065176b81a25062729600926052729600a26052729600b26052729600c2605799cd30d2605799cd30e26054a2b710f26054a2b711026054a2b711126054a2b711226052729601326052729601426052729601526052729601626052729601726052729601826052729601926052729600927042729600a27042729600b27042729600c27042729600d27042729600e2704272960");
    const Web$Kaelin$Heroes$Cyclope$hero = Web$Kaelin$Hero$new$("Cyclope", Web$Kaelin$Assets$hero$cyclope_d_1, 25, List$nil);
    const Web$Kaelin$Assets$hero$lela_d_1 = VoxBox$parse$("091219fb4d4d0a1219fb4d4d0b1219fb4d4d0c1219fb4d4d131219fb4d4d141219fb4d4d151219fb4d4d161219fb4d4d081318fb4d4d0913182b496c0a13182b496c0b13182b496c0c13182b496c0d1318fb4d4d121318fb4d4d1313182b496c1413182b496c1513182b496c1613182b496c171318fb4d4d071417fb4d4d0814172b496c09141781aeff0a141781aeff0b141781aeff0c141781aeff0d14172b496c0e1417fb4d4d0f1417fb4d4d101417fb4d4d111417fb4d4d1214172b496c13141781aeff14141781aeff15141781aeff16141781aeff1714172b496c181417fb4d4d071516fb4d4d0815161f3b5b091516538ccf0a1516538ccf0b1516538ccf0c1516538ccf0d1516538ccf0e15162b496c0f15162b496c1015162b496c1115162b496c121516538ccf131516538ccf141516538ccf151516538ccf161516538ccf1715161f3b5b181516fb4d4d071615fb4d4d0816151f3b5b091615538ccf0a1615538ccf0b1615538ccf0c1615538ccf0d1615538ccf0e161581aeff0f161581aeff10161581aeff11161581aeff121615538ccf131615538ccf141615538ccf151615538ccf161615538ccf1716151f3b5b181615fb4d4d071714fb4d4d0817141f3b5b091714538ccf0a1714538ccf0b1714538ccf0c1714538ccf0d1714538ccf0e1714538ccf0f1714538ccf101714538ccf111714538ccf121714538ccf131714538ccf141714538ccf151714538ccf161714538ccf1717141f3b5b181714fb4d4d081813fb4d4d0918131f3b5b0a1813538ccf0b1813538ccf0c1813538ccf0d1813538ccf0e1813538ccf0f1813cb4646101813cb4646111813538ccf121813538ccf131813538ccf141813538ccf151813538ccf1618131f3b5b171813fb4d4d091912fb4d4d0a19121f3b5b0b1912538ccf0c1912538ccf0d1912538ccf0e1912538ccf0f1912ad1f1f101912ad1f1f111912538ccf121912538ccf131912538ccf141912538ccf1519121f3b5b161912fb4d4d091a11fb4d4d0a1a111f3b5b0b1a11538ccf0c1a11538ccf0d1a11cb46460e1a11538ccf0f1a11538ccf101a11538ccf111a11538ccf121a11cb4646131a11538ccf141a11538ccf151a111f3b5b161a11fb4d4d091b10fb4d4d0a1b101f3b5b0b1b10538ccf0c1b10538ccf0d1b10ad1f1f0e1b10538ccf0f1b103d5497101b103d5497111b10538ccf121b10ad1f1f131b10538ccf141b10538ccf151b101f3b5b161b10fb4d4d0a1c0ffb4d4d0b1c0f1f3b5b0c1c0f538ccf0d1c0f538ccf0e1c0f538ccf0f1c0f2d4382101c0f2d4382111c0f538ccf121c0f538ccf131c0f538ccf141c0f1f3b5b151c0ffb4d4d0b1d0efb4d4d0c1d0e1f3b5b0d1d0e3a67b70e1d0e538ccf0f1d0e203368101d0e203368111d0e538ccf121d0e3a67b7131d0e1f3b5b141d0efb4d4d0a1e0dfb4d4d0b1e0d1f3b5b0c1e0d538ccf0d1e0d538ccf0e1e0d3a67b70f1e0d3a67b7101e0d3a67b7111e0d3a67b7121e0d538ccf131e0d538ccf141e0d1f3b5b151e0dfb4d4d091f0cfb4d4d0a1f0c1f3b5b0b1f0c81aeff0c1f0c3a71b10d1f0c538ccf0e1f0c81aeff0f1f0c81aeff101f0c81aeff111f0c81aeff121f0c538ccf131f0c3a71b1141f0c81aeff151f0c1f3b5b161f0cfb4d4d08200bfb4d4d09200b1f3b5b0a200b538ccf0b200b538ccf0c200b3a71b10d200b538ccf0e200b538ccf0f200b538ccf10200b538ccf11200b538ccf12200b538ccf13200b3a71b114200b538ccf15200b538ccf16200b1f3b5b17200bfb4d4d08210afb4d4d09210a1f3b5b0a210a538ccf0b210a538ccf0c210a3a71b10d210a538ccf0e210a538ccf0f210a538ccf10210a538ccf11210a538ccf12210a538ccf13210a3a71b114210a538ccf15210a538ccf16210a1f3b5b17210afb4d4d082209fb4d4d0922091f3b5b0a2209538ccf0b2209538ccf0c22092753860d2209538ccf0e2209538ccf0f2209538ccf102209538ccf112209538ccf122209538ccf132209275386142209538ccf152209538ccf1622091f3b5b172209fb4d4d092308fb4d4d0a23081f3b5b0b23081f3b5b0c23081f3b5b0d23083a67b70e2308538ccf0f2308538ccf102308538ccf112308538ccf1223083a67b71323081f3b5b1423081f3b5b1523081f3b5b162308fb4d4d0a2407fb4d4d0b2407fb4d4d0c2407fb4d4d0d24071f3b5b0e24073a67b70f2407538ccf102407538ccf1124073a67b71224071f3b5b132407fb4d4d142407fb4d4d152407fb4d4d0d2506fb4d4d0e25061f3b5b0f25063a67b71025063a67b71125061f3b5b122506fb4d4d0e2605fb4d4d0f26051f3b5b1026051f3b5b112605fb4d4d0f2704fb4d4d102704fb4d4d");
    const Web$Kaelin$Heroes$Lela$hero = Web$Kaelin$Hero$new$("Lela", Web$Kaelin$Assets$hero$lela_d_1, 25, List$nil);
    const Web$Kaelin$Assets$hero$octoking_d_1 = VoxBox$parse$("0a0a21192a020b0a21192a020d0a21192a020e0a21192a02100a21192a02110a21192a02120a21192a02130a21192a02150a21192a02160a21192a02180a21192a02190a21192a020a0b20192a020b0b20192a020d0b20192a020e0b20192a02100b20192a02110b20192a02120b20192a02130b20192a02150b20192a02160b20192a02180b20192a02190b20192a02080c1f192a02090c1f192a020a0c1fe6d7510b0c1fe6d7510c0c1f192a020d0c1f70681e0e0c1f70681e0f0c1f192a02100c1ffff6a6110c1ffff6a6120c1ffff6a6130c1ffff6a6140c1f192a02150c1f70681e160c1f70681e170c1f192a02180c1fe6d751190c1fe6d7511a0c1f192a021b0c1f192a02080d1e192a02090d1e192a020a0d1ee6d7510b0d1ee6d7510c0d1efff6a60d0d1e192a020e0d1e192a020f0d1ee6d751100d1ee6d751110d1ee6d751120d1ee6d751130d1ee6d751140d1ee6d751150d1e192a02160d1e192a02170d1efff6a6180d1ee6d751190d1ee6d7511a0d1e192a021b0d1e192a02080e1d192a02090e1d192a020a0e1de6d7510b0e1de6d7510c0e1dfff6a60d0e1d192a020e0e1d192a020f0e1de6d751100e1de6d751110e1de6d751120e1de6d751130e1de6d751140e1de6d751150e1d192a02160e1d192a02170e1dfff6a6180e1de6d751190e1de6d7511a0e1d192a021b0e1d192a02080f1c192a02090f1c192a020a0f1cc9ae530b0f1cc9ae530c0f1ce6d7510d0f1ce6d7510e0f1ce6d7510f0f1ce6d751100f1cb8321d110f1cb8321d120f1cb8321d130f1cb8321d140f1ce6d751150f1ce6d751160f1ce6d751170f1ce6d751180f1cc9ae53190f1cc9ae531a0f1c192a021b0f1c192a0208101b192a0209101b192a020a101bc9ae530b101bc9ae530c101be6d7510d101be6d7510e101be6d7510f101be6d75110101bb8321d11101bb8321d12101bb8321d13101bb8321d14101be6d75115101be6d75116101be6d75117101be6d75118101bc9ae5319101bc9ae531a101b192a021b101b192a0205111a192a0206111a192a0207111a192a0208111a192a0209111a192a020a111a4281350b111a4281350c111a4281350d111a4281350e111a4281350f111ac9ae5310111ac9ae5311111ac9ae5312111ac9ae5313111ac9ae5314111ac9ae5315111a42813516111a42813517111a42813518111a42813519111a4281351a111a192a021b111a192a021c111a192a021d111a192a021e111a192a02041219192a020512199fd95d0612199fd95d0712199fd95d081219192a02091219192a020a12199fd95d0b12199fd95d0c12195ea6420d12195ea6420e12195ea6420f12194281351012194281351112194281351212194281351312194281351412194281351512195ea6421612195ea6421712195ea6421812199fd95d1912199fd95d1a1219192a021b1219192a021c12199fd95d1d12199fd95d1e12199fd95d1f1219192a02041318192a020513189fd95d0613189fd95d0713189fd95d081318192a02091318192a020a13189fd95d0b13189fd95d0c13185ea6420d13185ea6420e13185ea6420f13184281351013184281351113184281351213184281351313184281351413184281351513185ea6421613185ea6421713185ea6421813189fd95d1913189fd95d1a1318192a021b1318192a021c13189fd95d1d13189fd95d1e13189fd95d1f1318192a02021417192a02031417192a020414179fd95d0514175ea6420614175ea6420714175ea642081417192a02091417192a020a14175ea6420b14175ea6420c14175ea6420d14175ea6420e14175ea6420f14175ea6421014175ea6421114175ea6421214175ea6421314175ea6421414175ea6421514175ea6421614175ea6421714175ea6421814175ea6421914175ea6421a1417192a021b1417192a021c14175ea6421d14175ea6421e14175ea6421f14179fd95d201417192a02211417192a02041516192a020515165ea6420615165ea6420715165ea642081516192a02091516192a020a15164281350b15164281350c15164281350d15164281350e15164281350f15164281351015165ea6421115165ea6421215165ea6421315165ea6421415164281351515164281351615164281351715164281351815164281351915164281351a1516192a021b1516192a021c15165ea6421d15165ea6421e15165ea6421f1516192a02041615192a020516155ea6420616155ea6420716155ea642081615192a02091615192a020a16154281350b16154281350c16154281350d16154281350e16154281350f16154281351016155ea6421116155ea6421216155ea6421316155ea6421416154281351516154281351616154281351716154281351816154281351916154281351a1615192a021b1615192a021c16155ea6421d16155ea6421e16155ea6421f1615192a02051714192a02061714192a020717145ea6420817145ea6420917145ea6420a1714192a020b1714192a020c17144281350d1714e6d7510e1714e6d7510f1714e6d751101714428135111714428135121714428135131714428135141714e6d751151714e6d751161714e6d751171714428135181714192a02191714192a021a17145ea6421b17145ea6421c17145ea6421d1714192a021e1714192a02071813192a020818135ea6420918135ea6420a1813366d2a0b1813366d2a0c1813192a020d18134281350e18134281350f1813173e0f101813173e0f111813173e0f121813173e0f131813173e0f141813173e0f151813428135161813428135171813192a02181813366d2a191813366d2a1a18135ea6421b18135ea6421c1813192a02071912192a020819125ea6420919125ea6420a1912366d2a0b1912366d2a0c1912192a020d19124281350e19124281350f1912173e0f101912173e0f111912173e0f121912173e0f131912173e0f141912173e0f151912428135161912428135171912192a02181912366d2a191912366d2a1a19125ea6421b19125ea6421c1912192a02051a11192a02061a11192a02071a11192a02081a11428135091a114281350a1a115ea6420b1a115ea6420c1a114281350d1a11192a020e1a11192a020f1a119fd95d101a119fd95d111a119fd95d121a119fd95d131a119fd95d141a119fd95d151a11192a02161a11192a02171a11428135181a115ea642191a115ea6421a1a114281351b1a114281351c1a11192a021d1a11192a021e1a11192a02051b10192a02061b10192a02071b10192a02081b10428135091b104281350a1b105ea6420b1b105ea6420c1b104281350d1b10192a020e1b10192a020f1b109fd95d101b109fd95d111b109fd95d121b109fd95d131b109fd95d141b109fd95d151b10192a02161b10192a02171b10428135181b105ea642191b105ea6421a1b104281351b1b104281351c1b10192a021d1b10192a021e1b10192a02041c0f192a02051c0f366d2a061c0f366d2a071c0f192a02081c0f5ea642091c0f5ea6420a1c0f4281350b1c0f4281350c1c0f192a020d1c0f9fd95d0e1c0f9fd95d0f1c0f5ea642101c0f428135111c0f428135121c0f428135131c0f428135141c0f5ea642151c0f9fd95d161c0f9fd95d171c0f192a02181c0f428135191c0f4281351a1c0f5ea6421b1c0f5ea6421c1c0f192a021d1c0f366d2a1e1c0f366d2a1f1c0f192a02021d0e192a02031d0e192a02041d0e428135051d0e428135061d0e428135071d0e192a02081d0e428135091d0e4281350a1d0e4281350b1d0e4281350c1d0e192a020d1d0e5ea6420e1d0e5ea6420f1d0e5ea642101d0e428135111d0e428135121d0e428135131d0e428135141d0e5ea642151d0e5ea642161d0e5ea642171d0e192a02181d0e428135191d0e4281351a1d0e4281351b1d0e4281351c1d0e192a021d1d0e4281351e1d0e4281351f1d0e428135201d0e192a02211d0e192a02021e0d192a02031e0d192a02041e0d428135051e0d428135061e0d428135071e0d192a02081e0d428135091e0d4281350a1e0d4281350b1e0d4281350c1e0d192a020d1e0d5ea6420e1e0d5ea6420f1e0d5ea642101e0d428135111e0d428135121e0d428135131e0d428135141e0d5ea642151e0d5ea642161e0d5ea642171e0d192a02181e0d428135191e0d4281351a1e0d4281351b1e0d4281351c1e0d192a021d1e0d4281351e1e0d4281351f1e0d428135201e0d192a02211e0d192a02001f0c192a02011f0c192a02021f0c9fd95d031f0c9fd95d041f0c5ea642051f0c428135061f0c428135071f0c192a02081f0c5ea642091f0c5ea6420a1f0c4281350b1f0c4281350c1f0c192a020d1f0c5ea6420e1f0c5ea6420f1f0c5ea642101f0c428135111f0c428135121f0c428135131f0c428135141f0c5ea642151f0c5ea642161f0c5ea642171f0c192a02181f0c428135191f0c4281351a1f0c5ea6421b1f0c5ea6421c1f0c192a021d1f0c4281351e1f0c4281351f1f0c5ea642201f0c9fd95d211f0c9fd95d221f0c192a0202200b192a0203200b192a0204200b192a0205200b42813506200b42813507200b42813508200b192a0209200b192a020a200b366d2a0b200b366d2a0c200b192a020d200b5ea6420e200b5ea6420f200b5ea64210200b42813511200b42813512200b42813513200b42813514200b5ea64215200b5ea64216200b5ea64217200b192a0218200b366d2a19200b366d2a1a200b192a021b200b192a021c200b4281351d200b4281351e200b4281351f200b192a0220200b192a0221200b192a0202210a192a0203210a192a0204210a192a0205210a42813506210a42813507210a42813508210a192a0209210a192a020a210a366d2a0b210a366d2a0c210a192a020d210a5ea6420e210a5ea6420f210a5ea64210210a42813511210a42813512210a42813513210a42813514210a5ea64215210a5ea64216210a5ea64217210a192a0218210a366d2a19210a366d2a1a210a192a021b210a192a021c210a4281351d210a4281351e210a4281351f210a192a0220210a192a0221210a192a02052209192a02062209192a02072209192a020a2209192a020b2209192a020c2209192a020d22095ea6420e22095ea6420f22094281351022094281351122094281351222094281351322094281351422094281351522095ea6421622095ea642172209192a02182209192a02192209192a021c2209192a021d2209192a021e2209192a02052308192a02062308192a02072308192a020a2308192a020b2308192a020c2308192a020d23085ea6420e23085ea6420f23084281351023084281351123084281351223084281351323084281351423084281351523085ea6421623085ea642172308192a02182308192a02192308192a021c2308192a021d2308192a021e2308192a02082407192a02092407192a020a2407192a020b2407192a020c24075ea6420d24074281350e24074281350f2407428135102407366d2a112407366d2a122407366d2a132407366d2a1424074281351524074281351624074281351724075ea642182407192a02192407192a021a2407192a021b2407192a02072506192a020825065ea6420925065ea6420a25065ea6420b25065ea6420c25064281350d25064281350e25064281350f2506366d2a102506192a02112506192a02122506192a02132506192a02142506366d2a1525064281351625064281351725064281351825065ea6421925065ea6421a25065ea6421b25065ea6421c2506192a02072605192a020826055ea6420926055ea6420a26055ea6420b26055ea6420c26054281350d26054281350e26054281350f2605366d2a102605192a02112605192a02122605192a02132605192a02142605366d2a1526054281351626054281351726054281351826055ea6421926055ea6421a26055ea6421b26055ea6421c2605192a02082704192a02092704192a020a2704192a020b2704192a020c2704192a020d2704192a020e2704192a020f2704192a02142704192a02152704192a02162704192a02172704192a02182704192a02192704192a021a2704192a021b2704192a02");
    const Web$Kaelin$Heroes$Octoking$hero = Web$Kaelin$Hero$new$("Octoking", Web$Kaelin$Assets$hero$octoking_d_1, 25, List$nil);

    function Web$Kaelin$Hero$info$(_name$1) {
        var self = (_name$1 === "Croni");
        if (self) {
            var $722 = Web$Kaelin$Heroes$Croni$hero;
            var $721 = $722;
        } else {
            var self = (_name$1 === "Cyclope");
            if (self) {
                var $724 = Web$Kaelin$Heroes$Cyclope$hero;
                var $723 = $724;
            } else {
                var self = (_name$1 === "Lela");
                if (self) {
                    var $726 = Web$Kaelin$Heroes$Lela$hero;
                    var $725 = $726;
                } else {
                    var self = (_name$1 === "Octoking");
                    if (self) {
                        var $728 = Web$Kaelin$Heroes$Octoking$hero;
                        var $727 = $728;
                    } else {
                        var $729 = Web$Kaelin$Heroes$Croni$hero;
                        var $727 = $729;
                    };
                    var $725 = $727;
                };
                var $723 = $725;
            };
            var $721 = $723;
        };
        return $721;
    };
    const Web$Kaelin$Hero$info = x0 => Web$Kaelin$Hero$info$(x0);

    function Web$Kaelin$Tile$creature$create$(_hero_name$1, _player_addr$2, _team$3) {
        var _hero$4 = Web$Kaelin$Hero$info$(_hero_name$1);
        var self = _hero$4;
        switch (self._) {
            case 'Web.Kaelin.Hero.new':
                var $731 = self.max_hp;
                var $732 = Web$Kaelin$Creature$new$(_player_addr$2, _hero$4, _team$3, $731, List$nil);
                var $730 = $732;
                break;
        };
        return $730;
    };
    const Web$Kaelin$Tile$creature$create = x0 => x1 => x2 => Web$Kaelin$Tile$creature$create$(x0, x1, x2);

    function Web$Kaelin$Map$init$(_map$1) {
        var _new_coord$2 = Web$Kaelin$Coord$new;
        var _creature$3 = Web$Kaelin$Tile$creature$create;
        var _croni$4 = Web$Kaelin$Heroes$Croni$hero;
        var _cyclope$5 = Web$Kaelin$Heroes$Cyclope$hero;
        var _lela$6 = Web$Kaelin$Heroes$Lela$hero;
        var _octoking$7 = Web$Kaelin$Heroes$Octoking$hero;
        var _entity_croni$8 = Web$Kaelin$Map$Entity$creature$(_creature$3("Croni")(Maybe$none)("blue"));
        var _entity_cyclope$9 = Web$Kaelin$Map$Entity$creature$(_creature$3("Cyclope")(Maybe$none)("blue"));
        var _entity_lela$10 = Web$Kaelin$Map$Entity$creature$(_creature$3("Lela")(Maybe$none)("blue"));
        var _entity_octoking$11 = Web$Kaelin$Map$Entity$creature$(_creature$3("Octoking")(Maybe$none)("blue"));
        var _map$12 = Web$Kaelin$Map$push$(_new_coord$2(((-1)))(((-2))), _entity_croni$8, _map$1);
        var _map$13 = Web$Kaelin$Map$push$(_new_coord$2(0)(3), _entity_cyclope$9, _map$12);
        var _map$14 = Web$Kaelin$Map$push$(_new_coord$2(((-2)))(0), _entity_lela$10, _map$13);
        var _map$15 = Web$Kaelin$Map$push$(_new_coord$2(3)(((-2))), _entity_octoking$11, _map$14);
        var $733 = _map$15;
        return $733;
    };
    const Web$Kaelin$Map$init = x0 => Web$Kaelin$Map$init$(x0);
    const Web$Kaelin$Assets$tile$green_2 = VoxBox$parse$("0e00011652320f00011652321000011652320c01011652320d01011652320e0101408d640f0101408d64100101469e651101011652321201011652320a02011652320b02011652320c0201469e650d0201469e650e0201469e650f0201408d64100201469e65110201469e65120201408d641302011652321402011652320803011652320903011652320a0301469e650b0301408d640c0301469e650d0301469e650e0301469e650f0301408d64100301408d64110301408d64120301408d64130301469e65140301469e65150301165232160301165232060401165232070401165232080401469e65090401469e650a0401469e650b0401408d640c0401408d640d0401469e650e0401469e650f0401408d64100401469e65110401408d64120401408d64130401408d64140401408d64150401408d64160401408d64170401165232180401165232040501165232050501165232060501469e65070501408d64080501469e65090501469e650a0501408d640b0501408d640c0501408d640d0501347e570e0501347e570f0501469e65100501469e65110501469e65120501347e57130501408d64140501469e65150501469e65160501408d64170501469e65180501469e651905011652321a0501165232020601165232030601165232040601347e57050601469e65060601469e65070601408d64080601408d64090601347e570a0601408d640b0601408d640c0601408d640d0601408d640e0601347e570f0601469e65100601469e65110601408d64120601347e57130601347e57140601469e65150601469e65160601408d64170601408d64180601347e57190601408d641a0601408d641b06011652321c0601165232000701165232010701165232020701408d64030701408d64040701408d64050701469e65060701469e65070701469e65080701408d64090701347e570a0701347e570b0701408d640c0701469e650d0701469e650e0701408d640f0701408d64100701408d64110701408d64120701408d64130701408d64140701408d64150701408d64160701408d64170701408d64180701347e57190701347e571a0701408d641b0701469e651c0701469e651d07011652321e0701165232000801165232010801408d64020801469e65030801469e65040801408d64050801469e65060801469e65070801469e65080801408d64090801469e650a0801469e650b0801408d640c0801408d640d0801469e650e0801469e650f0801347e57100801408d64110801469e65120801469e65130801408d64140801469e65150801469e65160801469e65170801408d64180801408d64190801408d641a0801408d641b0801408d641c0801469e651d0801469e651e0801165232000901165232010901408d64020901408d64030901469e65040901408d64050901408d64060901469e65070901408d64080901408d64090901469e650a0901469e650b0901408d640c0901408d640d0901469e650e0901469e650f0901408d64100901408d64110901469e65120901469e65130901408d64140901408d64150901469e65160901469e65170901408d64180901408d64190901469e651a0901469e651b0901408d641c0901408d641d0901408d641e0901165232000a01165232010a01408d64020a01408d64030a01347e57040a01347e57050a01408d64060a01408d64070a01408d64080a01408d64090a01408d640a0a01469e650b0a01469e650c0a01408d640d0a01408d640e0a01408d640f0a01408d64100a01408d64110a01408d64120a01408d64130a01408d64140a01347e57150a01408d64160a01408d64170a01408d64180a01408d64190a01469e651a0a01469e651b0a01469e651c0a01408d641d0a01408d641e0a01165232000b01165232010b01408d64020b01469e65030b01408d64040b01408d64050b01469e65060b01469e65070b01408d64080b01408d64090b01408d640a0b01408d640b0b01408d640c0b01408d640d0b01469e650e0b01408d640f0b01408d64100b01408d64110b01469e65120b01408d64130b01408d64140b01347e57150b01469e65160b01408d64170b01408d64180b01408d64190b01408d641a0b01408d641b0b01408d641c0b01408d641d0b01408d641e0b01165232000c01165232010c01408d64020c01469e65030c01408d64040c01408d64050c01408d64060c01408d64070c01469e65080c01469e65090c01408d640a0c01347e570b0c01347e570c0c01408d640d0c01469e650e0c01408d640f0c01469e65100c01408d64110c01408d64120c01408d64130c01408d64140c01408d64150c01408d64160c01469e65170c01469e65180c01408d64190c01347e571a0c01347e571b0c01408d641c0c01408d641d0c01408d641e0c01165232000d01165232010d01408d64020d01408d64030d01469e65040d01469e65050d01408d64060d01469e65070d01469e65080d01469e65090d01408d640a0d01347e570b0d01408d640c0d01469e650d0d01469e650e0d01408d640f0d01469e65100d01408d64110d01408d64120d01469e65130d01469e65140d01408d64150d01469e65160d01469e65170d01469e65180d01408d64190d01347e571a0d01408d641b0d01469e651c0d01469e651d0d01408d641e0d01165232000e01165232010e01408d64020e01469e65030e01469e65040e01469e65050e01408d64060e01469e65070e01469e65080e01408d64090e01408d640a0e01408d640b0e01408d640c0e01469e650d0e01469e650e0e01469e650f0e01347e57100e01408d64110e01469e65120e01469e65130e01469e65140e01408d64150e01469e65160e01469e65170e01408d64180e01408d64190e01408d641a0e01408d641b0e01469e651c0e01469e651d0e01469e651e0e01165232000f01165232010f01408d64020f01469e65030f01469e65040f01408d64050f01408d64060f01408d64070f01408d64080f01408d64090f01408d640a0f01408d640b0f01408d640c0f01408d640d0f01469e650e0f01469e650f0f01347e57100f01347e57110f01469e65120f01469e65130f01408d64140f01408d64150f01408d64160f01408d64170f01408d64180f01408d64190f01408d641a0f01408d641b0f01408d641c0f01469e651d0f01469e651e0f01165232001001165232011001408d64021001469e65031001469e65041001408d64051001347e57061001408d64071001469e65081001469e65091001469e650a1001408d640b1001469e650c1001469e650d1001408d640e1001408d640f1001469e65101001408d64111001469e65121001469e65131001408d64141001347e57151001408d64161001469e65171001469e65181001469e65191001408d641a1001469e651b1001469e651c1001408d641d1001408d641e1001165232001101165232011101469e65021101469e65031101469e65041101408d64051101408d64061101408d64071101469e65081101469e65091101408d640a1101408d640b1101408d640c1101408d640d1101408d640e1101408d640f1101408d64101101469e65111101469e65121101469e65131101408d64141101408d64151101408d64161101469e65171101469e65181101408d64191101408d641a1101408d641b1101408d641c1101408d641d1101408d641e1101165232001201165232011201469e65021201469e65031201408d64041201469e65051201469e65061201408d64071201408d64081201408d64091201408d640a1201408d640b1201408d640c1201469e650d1201469e650e1201469e650f1201408d64101201469e65111201469e65121201408d64131201469e65141201469e65151201408d64161201408d64171201408d64181201408d64191201408d641a1201408d641b1201469e651c1201469e651d1201469e651e1201165232001301165232011301408d64021301408d64031301408d64041301469e65051301469e65061301408d64071301408d64081301408d64091301469e650a1301469e650b1301408d640c1301469e650d1301469e650e1301469e650f1301408d64101301408d64111301408d64121301408d64131301469e65141301469e65151301408d64161301408d64171301408d64181301469e65191301469e651a1301408d641b1301469e651c1301469e651d1301469e651e1301165232001401165232011401469e65021401408d64031401408d64041401408d64051401408d64061401408d64071401408d64081401469e65091401469e650a1401469e650b1401408d640c1401408d640d1401469e650e1401469e650f1401408d64101401469e65111401408d64121401408d64131401408d64141401408d64151401408d64161401408d64171401469e65181401469e65191401469e651a1401408d641b1401408d641c1401469e651d1401469e651e1401165232001501165232011501469e65021501469e65031501347e57041501408d64051501469e65061501469e65071501408d64081501469e65091501469e650a1501408d640b1501408d640c1501408d640d1501347e570e1501347e570f1501469e65101501469e65111501469e65121501347e57131501408d64141501469e65151501469e65161501408d64171501469e65181501469e65191501408d641a1501408d641b1501408d641c1501347e571d1501347e571e1501165232001601165232011601469e65021601408d64031601347e57041601347e57051601469e65061601469e65071601408d64081601408d64091601347e570a1601408d640b1601408d640c1601408d640d1601408d640e1601347e570f1601469e65101601469e65111601408d64121601347e57131601347e57141601469e65151601469e65161601408d64171601408d64181601347e57191601408d641a1601408d641b1601408d641c1601408d641d1601347e571e1601165232001701165232011701165232021701408d64031701408d64041701408d64051701408d64061701408d64071701408d64081701408d64091701347e570a1701347e570b1701408d640c1701469e650d1701469e650e1701408d640f1701408d64101701408d64111701408d64121701408d64131701408d64141701408d64151701408d64161701408d64171701408d64181701347e57191701347e571a1701408d641b1701469e651c1701469e651d17011652321e1701165232021801165232031801165232041801408d64051801408d64061801469e65071801469e65081801408d64091801469e650a1801469e650b1801408d640c1801469e650d1801469e650e1801469e650f1801347e57101801347e57111801469e65121801469e65131801408d64141801408d64151801469e65161801469e65171801408d64181801469e65191801469e651a1801408d641b18011652321c1801165232041901165232051901165232061901469e65071901469e65081901408d64091901469e650a1901469e650b1901408d640c1901408d640d1901469e650e1901469e650f1901347e57101901408d64111901469e65121901469e65131901408d64141901469e65151901469e65161901469e65171901408d64181901469e651919011652321a1901165232061a01165232071a01165232081a01408d64091a01408d640a1a01408d640b1a01408d640c1a01408d640d1a01408d640e1a01408d640f1a01408d64101a01408d64111a01408d64121a01408d64131a01408d64141a01469e65151a01469e65161a01408d64171a01165232181a01165232081b01165232091b011652320a1b01347e570b1b01347e570c1b01408d640d1b01408d640e1b01408d640f1b01469e65101b01408d64111b01408d64121b01408d64131b01408d64141b01408d64151b01165232161b011652320a1c011652320b1c011652320c1c01469e650d1c01469e650e1c01408d640f1c01469e65101c01408d64111c01408d64121c01469e65131c01165232141c011652320c1d011652320d1d011652320e1d01469e650f1d01408d64101d01408d64111d01165232121d011652320e1e011652320f1e01165232101e01165232");
    const Web$Kaelin$Assets$tile$effect$light_blue2 = VoxBox$parse$("0e00010b51570f00010b51571000010b51570c01010b51570d01010b51570e0101278e9f0f0101278e9f100101309da51101010b51571201010b51570a02010b51570b02010b51570c0201309da50d0201309da50e0201309da50f0201278e9f100201309da5110201309da5120201278e9f1302010b51571402010b51570803010b51570903010b51570a0301309da50b0301278e9f0c0301309da50d0301309da50e0301309da50f0301278e9f100301278e9f110301278e9f120301278e9f130301309da5140301309da51503010b51571603010b51570604010b51570704010b5157080401309da5090401309da50a0401309da50b0401278e9f0c0401278e9f0d0401309da50e0401309da50f0401278e9f100401309da5110401278e9f120401278e9f130401278e9f140401278e9f150401278e9f160401278e9f1704010b51571804010b51570405010b51570505010b5157060501309da5070501278e9f080501309da5090501309da50a0501278e9f0b0501278e9f0c0501278e9f0d05011a7f910e05011a7f910f0501309da5100501309da5110501309da51205011a7f91130501278e9f140501309da5150501309da5160501278e9f170501309da5180501309da51905010b51571a05010b51570206010b51570306010b51570406011a7f91050601309da5060601309da5070601278e9f080601278e9f0906011a7f910a0601278e9f0b0601278e9f0c0601278e9f0d0601278e9f0e06011a7f910f0601309da5100601309da5110601278e9f1206011a7f911306011a7f91140601309da5150601309da5160601278e9f170601278e9f1806011a7f91190601278e9f1a0601278e9f1b06010b51571c06010b51570007010b51570107010b5157020701278e9f030701278e9f040701278e9f050701309da5060701309da5070701309da5080701278e9f0907011a7f910a07011a7f910b0701278e9f0c0701309da50d0701309da50e0701278e9f0f0701278e9f100701278e9f110701278e9f120701278e9f130701278e9f140701278e9f150701278e9f160701278e9f170701278e9f1807011a7f911907011a7f911a0701278e9f1b0701309da51c0701309da51d07010b51571e07010b51570008010b5157010801278e9f020801309da5030801309da5040801278e9f050801309da5060801309da5070801309da5080801278e9f090801309da50a0801309da50b0801278e9f0c0801278e9f0d0801309da50e0801309da50f08011a7f91100801278e9f110801309da5120801309da5130801278e9f140801309da5150801309da5160801309da5170801278e9f180801278e9f190801278e9f1a0801278e9f1b0801278e9f1c0801309da51d0801309da51e08010b51570009010b5157010901278e9f020901278e9f030901309da5040901278e9f050901278e9f060901309da5070901278e9f080901278e9f090901309da50a0901309da50b0901278e9f0c0901278e9f0d0901309da50e0901309da50f0901278e9f100901278e9f110901309da5120901309da5130901278e9f140901278e9f150901309da5160901309da5170901278e9f180901278e9f190901309da51a0901309da51b0901278e9f1c0901278e9f1d0901278e9f1e09010b5157000a010b5157010a01278e9f020a01278e9f030a011a7f91040a011a7f91050a01278e9f060a01278e9f070a01278e9f080a01278e9f090a01278e9f0a0a01309da50b0a01309da50c0a01278e9f0d0a01278e9f0e0a01278e9f0f0a01278e9f100a01278e9f110a01278e9f120a01278e9f130a01278e9f140a011a7f91150a01278e9f160a01278e9f170a01278e9f180a01278e9f190a01309da51a0a01309da51b0a01309da51c0a01278e9f1d0a01278e9f1e0a010b5157000b010b5157010b01278e9f020b01309da5030b01278e9f040b01278e9f050b01309da5060b01309da5070b01278e9f080b01278e9f090b01278e9f0a0b01278e9f0b0b01278e9f0c0b01278e9f0d0b01309da50e0b01278e9f0f0b01278e9f100b01278e9f110b01309da5120b01278e9f130b01278e9f140b011a7f91150b01309da5160b01278e9f170b01278e9f180b01278e9f190b01278e9f1a0b01278e9f1b0b01278e9f1c0b01278e9f1d0b01278e9f1e0b010b5157000c010b5157010c01278e9f020c01309da5030c01278e9f040c01278e9f050c01278e9f060c01278e9f070c01309da5080c01309da5090c01278e9f0a0c011a7f910b0c011a7f910c0c01278e9f0d0c01309da50e0c01278e9f0f0c01309da5100c01278e9f110c01278e9f120c01278e9f130c01278e9f140c01278e9f150c01278e9f160c01309da5170c01309da5180c01278e9f190c011a7f911a0c011a7f911b0c01278e9f1c0c01278e9f1d0c01278e9f1e0c010b5157000d010b5157010d01278e9f020d01278e9f030d01309da5040d01309da5050d01278e9f060d01309da5070d01309da5080d01309da5090d01278e9f0a0d011a7f910b0d01278e9f0c0d01309da50d0d01309da50e0d01278e9f0f0d01309da5100d01278e9f110d01278e9f120d01309da5130d01309da5140d01278e9f150d01309da5160d01309da5170d01309da5180d01278e9f190d011a7f911a0d01278e9f1b0d01309da51c0d01309da51d0d01278e9f1e0d010b5157000e010b5157010e01278e9f020e01309da5030e01309da5040e01309da5050e01278e9f060e01309da5070e01309da5080e01278e9f090e01278e9f0a0e01278e9f0b0e01278e9f0c0e01309da50d0e01309da50e0e01309da50f0e011a7f91100e01278e9f110e01309da5120e01309da5130e01309da5140e01278e9f150e01309da5160e01309da5170e01278e9f180e01278e9f190e01278e9f1a0e01278e9f1b0e01309da51c0e01309da51d0e01309da51e0e010b5157000f010b5157010f01278e9f020f01309da5030f01309da5040f01278e9f050f01278e9f060f01278e9f070f01278e9f080f01278e9f090f01278e9f0a0f01278e9f0b0f01278e9f0c0f01278e9f0d0f01309da50e0f01309da50f0f011a7f91100f011a7f91110f01309da5120f01309da5130f01278e9f140f01278e9f150f01278e9f160f01278e9f170f01278e9f180f01278e9f190f01278e9f1a0f01278e9f1b0f01278e9f1c0f01309da51d0f01309da51e0f010b51570010010b5157011001278e9f021001309da5031001309da5041001278e9f0510011a7f91061001278e9f071001309da5081001309da5091001309da50a1001278e9f0b1001309da50c1001309da50d1001278e9f0e1001278e9f0f1001309da5101001278e9f111001309da5121001309da5131001278e9f1410011a7f91151001278e9f161001309da5171001309da5181001309da5191001278e9f1a1001309da51b1001309da51c1001278e9f1d1001278e9f1e10010b51570011010b5157011101309da5021101309da5031101309da5041101278e9f051101278e9f061101278e9f071101309da5081101309da5091101278e9f0a1101278e9f0b1101278e9f0c1101278e9f0d1101278e9f0e1101278e9f0f1101278e9f101101309da5111101309da5121101309da5131101278e9f141101278e9f151101278e9f161101309da5171101309da5181101278e9f191101278e9f1a1101278e9f1b1101278e9f1c1101278e9f1d1101278e9f1e11010b51570012010b5157011201309da5021201309da5031201278e9f041201309da5051201309da5061201278e9f071201278e9f081201278e9f091201278e9f0a1201278e9f0b1201278e9f0c1201309da50d1201309da50e1201309da50f1201278e9f101201309da5111201309da5121201278e9f131201309da5141201309da5151201278e9f161201278e9f171201278e9f181201278e9f191201278e9f1a1201278e9f1b1201309da51c1201309da51d1201309da51e12010b51570013010b5157011301278e9f021301278e9f031301278e9f041301309da5051301309da5061301278e9f071301278e9f081301278e9f091301309da50a1301309da50b1301278e9f0c1301309da50d1301309da50e1301309da50f1301278e9f101301278e9f111301278e9f121301278e9f131301309da5141301309da5151301278e9f161301278e9f171301278e9f181301309da5191301309da51a1301278e9f1b1301309da51c1301309da51d1301309da51e13010b51570014010b5157011401309da5021401278e9f031401278e9f041401278e9f051401278e9f061401278e9f071401278e9f081401309da5091401309da50a1401309da50b1401278e9f0c1401278e9f0d1401309da50e1401309da50f1401278e9f101401309da5111401278e9f121401278e9f131401278e9f141401278e9f151401278e9f161401278e9f171401309da5181401309da5191401309da51a1401278e9f1b1401278e9f1c1401309da51d1401309da51e14010b51570015010b5157011501309da5021501309da50315011a7f91041501278e9f051501309da5061501309da5071501278e9f081501309da5091501309da50a1501278e9f0b1501278e9f0c1501278e9f0d15011a7f910e15011a7f910f1501309da5101501309da5111501309da51215011a7f91131501278e9f141501309da5151501309da5161501278e9f171501309da5181501309da5191501278e9f1a1501278e9f1b1501278e9f1c15011a7f911d15011a7f911e15010b51570016010b5157011601309da5021601278e9f0316011a7f910416011a7f91051601309da5061601309da5071601278e9f081601278e9f0916011a7f910a1601278e9f0b1601278e9f0c1601278e9f0d1601278e9f0e16011a7f910f1601309da5101601309da5111601278e9f1216011a7f911316011a7f91141601309da5151601309da5161601278e9f171601278e9f1816011a7f91191601278e9f1a1601278e9f1b1601278e9f1c1601278e9f1d16011a7f911e16010b51570017010b51570117010b5157021701278e9f031701278e9f041701278e9f051701278e9f061701278e9f071701278e9f081701278e9f0917011a7f910a17011a7f910b1701278e9f0c1701309da50d1701309da50e1701278e9f0f1701278e9f101701278e9f111701278e9f121701278e9f131701278e9f141701278e9f151701278e9f161701278e9f171701278e9f1817011a7f911917011a7f911a1701278e9f1b1701309da51c1701309da51d17010b51571e17010b51570218010b51570318010b5157041801278e9f051801278e9f061801309da5071801309da5081801278e9f091801309da50a1801309da50b1801278e9f0c1801309da50d1801309da50e1801309da50f18011a7f911018011a7f91111801309da5121801309da5131801278e9f141801278e9f151801309da5161801309da5171801278e9f181801309da5191801309da51a1801278e9f1b18010b51571c18010b51570419010b51570519010b5157061901309da5071901309da5081901278e9f091901309da50a1901309da50b1901278e9f0c1901278e9f0d1901309da50e1901309da50f19011a7f91101901278e9f111901309da5121901309da5131901278e9f141901309da5151901309da5161901309da5171901278e9f181901309da51919010b51571a19010b5157061a010b5157071a010b5157081a01278e9f091a01278e9f0a1a01278e9f0b1a01278e9f0c1a01278e9f0d1a01278e9f0e1a01278e9f0f1a01278e9f101a01278e9f111a01278e9f121a01278e9f131a01278e9f141a01309da5151a01309da5161a01278e9f171a010b5157181a010b5157081b010b5157091b010b51570a1b011a7f910b1b011a7f910c1b01278e9f0d1b01278e9f0e1b01278e9f0f1b01309da5101b01278e9f111b01278e9f121b01278e9f131b01278e9f141b01278e9f151b010b5157161b010b51570a1c010b51570b1c010b51570c1c01309da50d1c01309da50e1c01278e9f0f1c01309da5101c01278e9f111c01278e9f121c01309da5131c010b5157141c010b51570c1d010b51570d1d010b51570e1d01309da50f1d01278e9f101d01278e9f111d010b5157121d010b51570e1e010b51570f1e010b5157101e010b5157");
    const Web$Kaelin$Assets$tile$effect$dark_blue2 = VoxBox$parse$("0e00011b3d920f00011b3d921000011b3d920c01011b3d920d01011b3d920e01014c74c50f01014c74c51001015783c51101011b3d921201011b3d920a02011b3d920b02011b3d920c02015783c50d02015783c50e02015783c50f02014c74c51002015783c51102015783c51202014c74c51302011b3d921402011b3d920803011b3d920903011b3d920a03015783c50b03014c74c50c03015783c50d03015783c50e03015783c50f03014c74c51003014c74c51103014c74c51203014c74c51303015783c51403015783c51503011b3d921603011b3d920604011b3d920704011b3d920804015783c50904015783c50a04015783c50b04014c74c50c04014c74c50d04015783c50e04015783c50f04014c74c51004015783c51104014c74c51204014c74c51304014c74c51404014c74c51504014c74c51604014c74c51704011b3d921804011b3d920405011b3d920505011b3d920605015783c50705014c74c50805015783c50905015783c50a05014c74c50b05014c74c50c05014c74c50d05013e66b80e05013e66b80f05015783c51005015783c51105015783c51205013e66b81305014c74c51405015783c51505015783c51605014c74c51705015783c51805015783c51905011b3d921a05011b3d920206011b3d920306011b3d920406013e66b80506015783c50606015783c50706014c74c50806014c74c50906013e66b80a06014c74c50b06014c74c50c06014c74c50d06014c74c50e06013e66b80f06015783c51006015783c51106014c74c51206013e66b81306013e66b81406015783c51506015783c51606014c74c51706014c74c51806013e66b81906014c74c51a06014c74c51b06011b3d921c06011b3d920007011b3d920107011b3d920207014c74c50307014c74c50407014c74c50507015783c50607015783c50707015783c50807014c74c50907013e66b80a07013e66b80b07014c74c50c07015783c50d07015783c50e07014c74c50f07014c74c51007014c74c51107014c74c51207014c74c51307014c74c51407014c74c51507014c74c51607014c74c51707014c74c51807013e66b81907013e66b81a07014c74c51b07015783c51c07015783c51d07011b3d921e07011b3d920008011b3d920108014c74c50208015783c50308015783c50408014c74c50508015783c50608015783c50708015783c50808014c74c50908015783c50a08015783c50b08014c74c50c08014c74c50d08015783c50e08015783c50f08013e66b81008014c74c51108015783c51208015783c51308014c74c51408015783c51508015783c51608015783c51708014c74c51808014c74c51908014c74c51a08014c74c51b08014c74c51c08015783c51d08015783c51e08011b3d920009011b3d920109014c74c50209014c74c50309015783c50409014c74c50509014c74c50609015783c50709014c74c50809014c74c50909015783c50a09015783c50b09014c74c50c09014c74c50d09015783c50e09015783c50f09014c74c51009014c74c51109015783c51209015783c51309014c74c51409014c74c51509015783c51609015783c51709014c74c51809014c74c51909015783c51a09015783c51b09014c74c51c09014c74c51d09014c74c51e09011b3d92000a011b3d92010a014c74c5020a014c74c5030a013e66b8040a013e66b8050a014c74c5060a014c74c5070a014c74c5080a014c74c5090a014c74c50a0a015783c50b0a015783c50c0a014c74c50d0a014c74c50e0a014c74c50f0a014c74c5100a014c74c5110a014c74c5120a014c74c5130a014c74c5140a013e66b8150a014c74c5160a014c74c5170a014c74c5180a014c74c5190a015783c51a0a015783c51b0a015783c51c0a014c74c51d0a014c74c51e0a011b3d92000b011b3d92010b014c74c5020b015783c5030b014c74c5040b014c74c5050b015783c5060b015783c5070b014c74c5080b014c74c5090b014c74c50a0b014c74c50b0b014c74c50c0b014c74c50d0b015783c50e0b014c74c50f0b014c74c5100b014c74c5110b015783c5120b014c74c5130b014c74c5140b013e66b8150b015783c5160b014c74c5170b014c74c5180b014c74c5190b014c74c51a0b014c74c51b0b014c74c51c0b014c74c51d0b014c74c51e0b011b3d92000c011b3d92010c014c74c5020c015783c5030c014c74c5040c014c74c5050c014c74c5060c014c74c5070c015783c5080c015783c5090c014c74c50a0c013e66b80b0c013e66b80c0c014c74c50d0c015783c50e0c014c74c50f0c015783c5100c014c74c5110c014c74c5120c014c74c5130c014c74c5140c014c74c5150c014c74c5160c015783c5170c015783c5180c014c74c5190c013e66b81a0c013e66b81b0c014c74c51c0c014c74c51d0c014c74c51e0c011b3d92000d011b3d92010d014c74c5020d014c74c5030d015783c5040d015783c5050d014c74c5060d015783c5070d015783c5080d015783c5090d014c74c50a0d013e66b80b0d014c74c50c0d015783c50d0d015783c50e0d014c74c50f0d015783c5100d014c74c5110d014c74c5120d015783c5130d015783c5140d014c74c5150d015783c5160d015783c5170d015783c5180d014c74c5190d013e66b81a0d014c74c51b0d015783c51c0d015783c51d0d014c74c51e0d011b3d92000e011b3d92010e014c74c5020e015783c5030e015783c5040e015783c5050e014c74c5060e015783c5070e015783c5080e014c74c5090e014c74c50a0e014c74c50b0e014c74c50c0e015783c50d0e015783c50e0e015783c50f0e013e66b8100e014c74c5110e015783c5120e015783c5130e015783c5140e014c74c5150e015783c5160e015783c5170e014c74c5180e014c74c5190e014c74c51a0e014c74c51b0e015783c51c0e015783c51d0e015783c51e0e011b3d92000f011b3d92010f014c74c5020f015783c5030f015783c5040f014c74c5050f014c74c5060f014c74c5070f014c74c5080f014c74c5090f014c74c50a0f014c74c50b0f014c74c50c0f014c74c50d0f015783c50e0f015783c50f0f013e66b8100f013e66b8110f015783c5120f015783c5130f014c74c5140f014c74c5150f014c74c5160f014c74c5170f014c74c5180f014c74c5190f014c74c51a0f014c74c51b0f014c74c51c0f015783c51d0f015783c51e0f011b3d920010011b3d920110014c74c50210015783c50310015783c50410014c74c50510013e66b80610014c74c50710015783c50810015783c50910015783c50a10014c74c50b10015783c50c10015783c50d10014c74c50e10014c74c50f10015783c51010014c74c51110015783c51210015783c51310014c74c51410013e66b81510014c74c51610015783c51710015783c51810015783c51910014c74c51a10015783c51b10015783c51c10014c74c51d10014c74c51e10011b3d920011011b3d920111015783c50211015783c50311015783c50411014c74c50511014c74c50611014c74c50711015783c50811015783c50911014c74c50a11014c74c50b11014c74c50c11014c74c50d11014c74c50e11014c74c50f11014c74c51011015783c51111015783c51211015783c51311014c74c51411014c74c51511014c74c51611015783c51711015783c51811014c74c51911014c74c51a11014c74c51b11014c74c51c11014c74c51d11014c74c51e11011b3d920012011b3d920112015783c50212015783c50312014c74c50412015783c50512015783c50612014c74c50712014c74c50812014c74c50912014c74c50a12014c74c50b12014c74c50c12015783c50d12015783c50e12015783c50f12014c74c51012015783c51112015783c51212014c74c51312015783c51412015783c51512014c74c51612014c74c51712014c74c51812014c74c51912014c74c51a12014c74c51b12015783c51c12015783c51d12015783c51e12011b3d920013011b3d920113014c74c50213014c74c50313014c74c50413015783c50513015783c50613014c74c50713014c74c50813014c74c50913015783c50a13015783c50b13014c74c50c13015783c50d13015783c50e13015783c50f13014c74c51013014c74c51113014c74c51213014c74c51313015783c51413015783c51513014c74c51613014c74c51713014c74c51813015783c51913015783c51a13014c74c51b13015783c51c13015783c51d13015783c51e13011b3d920014011b3d920114015783c50214014c74c50314014c74c50414014c74c50514014c74c50614014c74c50714014c74c50814015783c50914015783c50a14015783c50b14014c74c50c14014c74c50d14015783c50e14015783c50f14014c74c51014015783c51114014c74c51214014c74c51314014c74c51414014c74c51514014c74c51614014c74c51714015783c51814015783c51914015783c51a14014c74c51b14014c74c51c14015783c51d14015783c51e14011b3d920015011b3d920115015783c50215015783c50315013e66b80415014c74c50515015783c50615015783c50715014c74c50815015783c50915015783c50a15014c74c50b15014c74c50c15014c74c50d15013e66b80e15013e66b80f15015783c51015015783c51115015783c51215013e66b81315014c74c51415015783c51515015783c51615014c74c51715015783c51815015783c51915014c74c51a15014c74c51b15014c74c51c15013e66b81d15013e66b81e15011b3d920016011b3d920116015783c50216014c74c50316013e66b80416013e66b80516015783c50616015783c50716014c74c50816014c74c50916013e66b80a16014c74c50b16014c74c50c16014c74c50d16014c74c50e16013e66b80f16015783c51016015783c51116014c74c51216013e66b81316013e66b81416015783c51516015783c51616014c74c51716014c74c51816013e66b81916014c74c51a16014c74c51b16014c74c51c16014c74c51d16013e66b81e16011b3d920017011b3d920117011b3d920217014c74c50317014c74c50417014c74c50517014c74c50617014c74c50717014c74c50817014c74c50917013e66b80a17013e66b80b17014c74c50c17015783c50d17015783c50e17014c74c50f17014c74c51017014c74c51117014c74c51217014c74c51317014c74c51417014c74c51517014c74c51617014c74c51717014c74c51817013e66b81917013e66b81a17014c74c51b17015783c51c17015783c51d17011b3d921e17011b3d920218011b3d920318011b3d920418014c74c50518014c74c50618015783c50718015783c50818014c74c50918015783c50a18015783c50b18014c74c50c18015783c50d18015783c50e18015783c50f18013e66b81018013e66b81118015783c51218015783c51318014c74c51418014c74c51518015783c51618015783c51718014c74c51818015783c51918015783c51a18014c74c51b18011b3d921c18011b3d920419011b3d920519011b3d920619015783c50719015783c50819014c74c50919015783c50a19015783c50b19014c74c50c19014c74c50d19015783c50e19015783c50f19013e66b81019014c74c51119015783c51219015783c51319014c74c51419015783c51519015783c51619015783c51719014c74c51819015783c51919011b3d921a19011b3d92061a011b3d92071a011b3d92081a014c74c5091a014c74c50a1a014c74c50b1a014c74c50c1a014c74c50d1a014c74c50e1a014c74c50f1a014c74c5101a014c74c5111a014c74c5121a014c74c5131a014c74c5141a015783c5151a015783c5161a014c74c5171a011b3d92181a011b3d92081b011b3d92091b011b3d920a1b013e66b80b1b013e66b80c1b014c74c50d1b014c74c50e1b014c74c50f1b015783c5101b014c74c5111b014c74c5121b014c74c5131b014c74c5141b014c74c5151b011b3d92161b011b3d920a1c011b3d920b1c011b3d920c1c015783c50d1c015783c50e1c014c74c50f1c015783c5101c014c74c5111c014c74c5121c015783c5131c011b3d92141c011b3d920c1d011b3d920d1d011b3d920e1d015783c50f1d014c74c5101d014c74c5111d011b3d92121d011b3d920e1e011b3d920f1e011b3d92101e011b3d92");
    const Web$Kaelin$Assets$tile$effect$blue_green2 = VoxBox$parse$("0e00010955400f00010955401000010955400c01010955400d01010955400e01011a9c7c0f01011a9c7c1001011cad851101010955401201010955400a02010955400b02010955400c02011cad850d02011cad850e02011cad850f02011a9c7c1002011cad851102011cad851202011a9c7c1302010955401402010955400803010955400903010955400a03011cad850b03011a9c7c0c03011cad850d03011cad850e03011cad850f03011a9c7c1003011a9c7c1103011a9c7c1203011a9c7c1303011cad851403011cad851503010955401603010955400604010955400704010955400804011cad850904011cad850a04011cad850b04011a9c7c0c04011a9c7c0d04011cad850e04011cad850f04011a9c7c1004011cad851104011a9c7c1204011a9c7c1304011a9c7c1404011a9c7c1504011a9c7c1604011a9c7c1704010955401804010955400405010955400505010955400605011cad850705011a9c7c0805011cad850905011cad850a05011a9c7c0b05011a9c7c0c05011a9c7c0d050115896c0e050115896c0f05011cad851005011cad851105011cad8512050115896c1305011a9c7c1405011cad851505011cad851605011a9c7c1705011cad851805011cad851905010955401a050109554002060109554003060109554004060115896c0506011cad850606011cad850706011a9c7c0806011a9c7c09060115896c0a06011a9c7c0b06011a9c7c0c06011a9c7c0d06011a9c7c0e060115896c0f06011cad851006011cad851106011a9c7c12060115896c13060115896c1406011cad851506011cad851606011a9c7c1706011a9c7c18060115896c1906011a9c7c1a06011a9c7c1b06010955401c06010955400007010955400107010955400207011a9c7c0307011a9c7c0407011a9c7c0507011cad850607011cad850707011cad850807011a9c7c09070115896c0a070115896c0b07011a9c7c0c07011cad850d07011cad850e07011a9c7c0f07011a9c7c1007011a9c7c1107011a9c7c1207011a9c7c1307011a9c7c1407011a9c7c1507011a9c7c1607011a9c7c1707011a9c7c18070115896c19070115896c1a07011a9c7c1b07011cad851c07011cad851d07010955401e07010955400008010955400108011a9c7c0208011cad850308011cad850408011a9c7c0508011cad850608011cad850708011cad850808011a9c7c0908011cad850a08011cad850b08011a9c7c0c08011a9c7c0d08011cad850e08011cad850f080115896c1008011a9c7c1108011cad851208011cad851308011a9c7c1408011cad851508011cad851608011cad851708011a9c7c1808011a9c7c1908011a9c7c1a08011a9c7c1b08011a9c7c1c08011cad851d08011cad851e08010955400009010955400109011a9c7c0209011a9c7c0309011cad850409011a9c7c0509011a9c7c0609011cad850709011a9c7c0809011a9c7c0909011cad850a09011cad850b09011a9c7c0c09011a9c7c0d09011cad850e09011cad850f09011a9c7c1009011a9c7c1109011cad851209011cad851309011a9c7c1409011a9c7c1509011cad851609011cad851709011a9c7c1809011a9c7c1909011cad851a09011cad851b09011a9c7c1c09011a9c7c1d09011a9c7c1e0901095540000a01095540010a011a9c7c020a011a9c7c030a0115896c040a0115896c050a011a9c7c060a011a9c7c070a011a9c7c080a011a9c7c090a011a9c7c0a0a011cad850b0a011cad850c0a011a9c7c0d0a011a9c7c0e0a011a9c7c0f0a011a9c7c100a011a9c7c110a011a9c7c120a011a9c7c130a011a9c7c140a0115896c150a011a9c7c160a011a9c7c170a011a9c7c180a011a9c7c190a011cad851a0a011cad851b0a011cad851c0a011a9c7c1d0a011a9c7c1e0a01095540000b01095540010b011a9c7c020b011cad85030b011a9c7c040b011a9c7c050b011cad85060b011cad85070b011a9c7c080b011a9c7c090b011a9c7c0a0b011a9c7c0b0b011a9c7c0c0b011a9c7c0d0b011cad850e0b011a9c7c0f0b011a9c7c100b011a9c7c110b011cad85120b011a9c7c130b011a9c7c140b0115896c150b011cad85160b011a9c7c170b011a9c7c180b011a9c7c190b011a9c7c1a0b011a9c7c1b0b011a9c7c1c0b011a9c7c1d0b011a9c7c1e0b01095540000c01095540010c011a9c7c020c011cad85030c011a9c7c040c011a9c7c050c011a9c7c060c011a9c7c070c011cad85080c011cad85090c011a9c7c0a0c0115896c0b0c0115896c0c0c011a9c7c0d0c011cad850e0c011a9c7c0f0c011cad85100c011a9c7c110c011a9c7c120c011a9c7c130c011a9c7c140c011a9c7c150c011a9c7c160c011cad85170c011cad85180c011a9c7c190c0115896c1a0c0115896c1b0c011a9c7c1c0c011a9c7c1d0c011a9c7c1e0c01095540000d01095540010d011a9c7c020d011a9c7c030d011cad85040d011cad85050d011a9c7c060d011cad85070d011cad85080d011cad85090d011a9c7c0a0d0115896c0b0d011a9c7c0c0d011cad850d0d011cad850e0d011a9c7c0f0d011cad85100d011a9c7c110d011a9c7c120d011cad85130d011cad85140d011a9c7c150d011cad85160d011cad85170d011cad85180d011a9c7c190d0115896c1a0d011a9c7c1b0d011cad851c0d011cad851d0d011a9c7c1e0d01095540000e01095540010e011a9c7c020e011cad85030e011cad85040e011cad85050e011a9c7c060e011cad85070e011cad85080e011a9c7c090e011a9c7c0a0e011a9c7c0b0e011a9c7c0c0e011cad850d0e011cad850e0e011cad850f0e0115896c100e011a9c7c110e011cad85120e011cad85130e011cad85140e011a9c7c150e011cad85160e011cad85170e011a9c7c180e011a9c7c190e011a9c7c1a0e011a9c7c1b0e011cad851c0e011cad851d0e011cad851e0e01095540000f01095540010f011a9c7c020f011cad85030f011cad85040f011a9c7c050f011a9c7c060f011a9c7c070f011a9c7c080f011a9c7c090f011a9c7c0a0f011a9c7c0b0f011a9c7c0c0f011a9c7c0d0f011cad850e0f011cad850f0f0115896c100f0115896c110f011cad85120f011cad85130f011a9c7c140f011a9c7c150f011a9c7c160f011a9c7c170f011a9c7c180f011a9c7c190f011a9c7c1a0f011a9c7c1b0f011a9c7c1c0f011cad851d0f011cad851e0f010955400010010955400110011a9c7c0210011cad850310011cad850410011a9c7c05100115896c0610011a9c7c0710011cad850810011cad850910011cad850a10011a9c7c0b10011cad850c10011cad850d10011a9c7c0e10011a9c7c0f10011cad851010011a9c7c1110011cad851210011cad851310011a9c7c14100115896c1510011a9c7c1610011cad851710011cad851810011cad851910011a9c7c1a10011cad851b10011cad851c10011a9c7c1d10011a9c7c1e10010955400011010955400111011cad850211011cad850311011cad850411011a9c7c0511011a9c7c0611011a9c7c0711011cad850811011cad850911011a9c7c0a11011a9c7c0b11011a9c7c0c11011a9c7c0d11011a9c7c0e11011a9c7c0f11011a9c7c1011011cad851111011cad851211011cad851311011a9c7c1411011a9c7c1511011a9c7c1611011cad851711011cad851811011a9c7c1911011a9c7c1a11011a9c7c1b11011a9c7c1c11011a9c7c1d11011a9c7c1e11010955400012010955400112011cad850212011cad850312011a9c7c0412011cad850512011cad850612011a9c7c0712011a9c7c0812011a9c7c0912011a9c7c0a12011a9c7c0b12011a9c7c0c12011cad850d12011cad850e12011cad850f12011a9c7c1012011cad851112011cad851212011a9c7c1312011cad851412011cad851512011a9c7c1612011a9c7c1712011a9c7c1812011a9c7c1912011a9c7c1a12011a9c7c1b12011cad851c12011cad851d12011cad851e12010955400013010955400113011a9c7c0213011a9c7c0313011a9c7c0413011cad850513011cad850613011a9c7c0713011a9c7c0813011a9c7c0913011cad850a13011cad850b13011a9c7c0c13011cad850d13011cad850e13011cad850f13011a9c7c1013011a9c7c1113011a9c7c1213011a9c7c1313011cad851413011cad851513011a9c7c1613011a9c7c1713011a9c7c1813011cad851913011cad851a13011a9c7c1b13011cad851c13011cad851d13011cad851e13010955400014010955400114011cad850214011a9c7c0314011a9c7c0414011a9c7c0514011a9c7c0614011a9c7c0714011a9c7c0814011cad850914011cad850a14011cad850b14011a9c7c0c14011a9c7c0d14011cad850e14011cad850f14011a9c7c1014011cad851114011a9c7c1214011a9c7c1314011a9c7c1414011a9c7c1514011a9c7c1614011a9c7c1714011cad851814011cad851914011cad851a14011a9c7c1b14011a9c7c1c14011cad851d14011cad851e14010955400015010955400115011cad850215011cad8503150115896c0415011a9c7c0515011cad850615011cad850715011a9c7c0815011cad850915011cad850a15011a9c7c0b15011a9c7c0c15011a9c7c0d150115896c0e150115896c0f15011cad851015011cad851115011cad8512150115896c1315011a9c7c1415011cad851515011cad851615011a9c7c1715011cad851815011cad851915011a9c7c1a15011a9c7c1b15011a9c7c1c150115896c1d150115896c1e15010955400016010955400116011cad850216011a9c7c03160115896c04160115896c0516011cad850616011cad850716011a9c7c0816011a9c7c09160115896c0a16011a9c7c0b16011a9c7c0c16011a9c7c0d16011a9c7c0e160115896c0f16011cad851016011cad851116011a9c7c12160115896c13160115896c1416011cad851516011cad851616011a9c7c1716011a9c7c18160115896c1916011a9c7c1a16011a9c7c1b16011a9c7c1c16011a9c7c1d160115896c1e16010955400017010955400117010955400217011a9c7c0317011a9c7c0417011a9c7c0517011a9c7c0617011a9c7c0717011a9c7c0817011a9c7c09170115896c0a170115896c0b17011a9c7c0c17011cad850d17011cad850e17011a9c7c0f17011a9c7c1017011a9c7c1117011a9c7c1217011a9c7c1317011a9c7c1417011a9c7c1517011a9c7c1617011a9c7c1717011a9c7c18170115896c19170115896c1a17011a9c7c1b17011cad851c17011cad851d17010955401e17010955400218010955400318010955400418011a9c7c0518011a9c7c0618011cad850718011cad850818011a9c7c0918011cad850a18011cad850b18011a9c7c0c18011cad850d18011cad850e18011cad850f180115896c10180115896c1118011cad851218011cad851318011a9c7c1418011a9c7c1518011cad851618011cad851718011a9c7c1818011cad851918011cad851a18011a9c7c1b18010955401c18010955400419010955400519010955400619011cad850719011cad850819011a9c7c0919011cad850a19011cad850b19011a9c7c0c19011a9c7c0d19011cad850e19011cad850f190115896c1019011a9c7c1119011cad851219011cad851319011a9c7c1419011cad851519011cad851619011cad851719011a9c7c1819011cad851919010955401a1901095540061a01095540071a01095540081a011a9c7c091a011a9c7c0a1a011a9c7c0b1a011a9c7c0c1a011a9c7c0d1a011a9c7c0e1a011a9c7c0f1a011a9c7c101a011a9c7c111a011a9c7c121a011a9c7c131a011a9c7c141a011cad85151a011cad85161a011a9c7c171a01095540181a01095540081b01095540091b010955400a1b0115896c0b1b0115896c0c1b011a9c7c0d1b011a9c7c0e1b011a9c7c0f1b011cad85101b011a9c7c111b011a9c7c121b011a9c7c131b011a9c7c141b011a9c7c151b01095540161b010955400a1c010955400b1c010955400c1c011cad850d1c011cad850e1c011a9c7c0f1c011cad85101c011a9c7c111c011a9c7c121c011cad85131c01095540141c010955400c1d010955400d1d010955400e1d011cad850f1d011a9c7c101d011a9c7c111d01095540121d010955400e1e010955400f1e01095540101e01095540");
    const Web$Kaelin$Assets$tile$effect$dark_red2 = VoxBox$parse$("0e0001881c170f0001881c17100001881c170c0101881c170d0101881c170e0101bc524c0f0101bc524c100101c75f56110101881c17120101881c170a0201881c170b0201881c170c0201c75f560d0201c75f560e0201c75f560f0201bc524c100201c75f56110201c75f56120201bc524c130201881c17140201881c17080301881c17090301881c170a0301c75f560b0301bc524c0c0301c75f560d0301c75f560e0301c75f560f0301bc524c100301bc524c110301bc524c120301bc524c130301c75f56140301c75f56150301881c17160301881c17060401881c17070401881c17080401c75f56090401c75f560a0401c75f560b0401bc524c0c0401bc524c0d0401c75f560e0401c75f560f0401bc524c100401c75f56110401bc524c120401bc524c130401bc524c140401bc524c150401bc524c160401bc524c170401881c17180401881c17040501881c17050501881c17060501c75f56070501bc524c080501c75f56090501c75f560a0501bc524c0b0501bc524c0c0501bc524c0d0501ae443e0e0501ae443e0f0501c75f56100501c75f56110501c75f56120501ae443e130501bc524c140501c75f56150501c75f56160501bc524c170501c75f56180501c75f56190501881c171a0501881c17020601881c17030601881c17040601ae443e050601c75f56060601c75f56070601bc524c080601bc524c090601ae443e0a0601bc524c0b0601bc524c0c0601bc524c0d0601bc524c0e0601ae443e0f0601c75f56100601c75f56110601bc524c120601ae443e130601ae443e140601c75f56150601c75f56160601bc524c170601bc524c180601ae443e190601bc524c1a0601bc524c1b0601881c171c0601881c17000701881c17010701881c17020701bc524c030701bc524c040701bc524c050701c75f56060701c75f56070701c75f56080701bc524c090701ae443e0a0701ae443e0b0701bc524c0c0701c75f560d0701c75f560e0701bc524c0f0701bc524c100701bc524c110701bc524c120701bc524c130701bc524c140701bc524c150701bc524c160701bc524c170701bc524c180701ae443e190701ae443e1a0701bc524c1b0701c75f561c0701c75f561d0701881c171e0701881c17000801881c17010801bc524c020801c75f56030801c75f56040801bc524c050801c75f56060801c75f56070801c75f56080801bc524c090801c75f560a0801c75f560b0801bc524c0c0801bc524c0d0801c75f560e0801c75f560f0801ae443e100801bc524c110801c75f56120801c75f56130801bc524c140801c75f56150801c75f56160801c75f56170801bc524c180801bc524c190801bc524c1a0801bc524c1b0801bc524c1c0801c75f561d0801c75f561e0801881c17000901881c17010901bc524c020901bc524c030901c75f56040901bc524c050901bc524c060901c75f56070901bc524c080901bc524c090901c75f560a0901c75f560b0901bc524c0c0901bc524c0d0901c75f560e0901c75f560f0901bc524c100901bc524c110901c75f56120901c75f56130901bc524c140901bc524c150901c75f56160901c75f56170901bc524c180901bc524c190901c75f561a0901c75f561b0901bc524c1c0901bc524c1d0901bc524c1e0901881c17000a01881c17010a01bc524c020a01bc524c030a01ae443e040a01ae443e050a01bc524c060a01bc524c070a01bc524c080a01bc524c090a01bc524c0a0a01c75f560b0a01c75f560c0a01bc524c0d0a01bc524c0e0a01bc524c0f0a01bc524c100a01bc524c110a01bc524c120a01bc524c130a01bc524c140a01ae443e150a01bc524c160a01bc524c170a01bc524c180a01bc524c190a01c75f561a0a01c75f561b0a01c75f561c0a01bc524c1d0a01bc524c1e0a01881c17000b01881c17010b01bc524c020b01c75f56030b01bc524c040b01bc524c050b01c75f56060b01c75f56070b01bc524c080b01bc524c090b01bc524c0a0b01bc524c0b0b01bc524c0c0b01bc524c0d0b01c75f560e0b01bc524c0f0b01bc524c100b01bc524c110b01c75f56120b01bc524c130b01bc524c140b01ae443e150b01c75f56160b01bc524c170b01bc524c180b01bc524c190b01bc524c1a0b01bc524c1b0b01bc524c1c0b01bc524c1d0b01bc524c1e0b01881c17000c01881c17010c01bc524c020c01c75f56030c01bc524c040c01bc524c050c01bc524c060c01bc524c070c01c75f56080c01c75f56090c01bc524c0a0c01ae443e0b0c01ae443e0c0c01bc524c0d0c01c75f560e0c01bc524c0f0c01c75f56100c01bc524c110c01bc524c120c01bc524c130c01bc524c140c01bc524c150c01bc524c160c01c75f56170c01c75f56180c01bc524c190c01ae443e1a0c01ae443e1b0c01bc524c1c0c01bc524c1d0c01bc524c1e0c01881c17000d01881c17010d01bc524c020d01bc524c030d01c75f56040d01c75f56050d01bc524c060d01c75f56070d01c75f56080d01c75f56090d01bc524c0a0d01ae443e0b0d01bc524c0c0d01c75f560d0d01c75f560e0d01bc524c0f0d01c75f56100d01bc524c110d01bc524c120d01c75f56130d01c75f56140d01bc524c150d01c75f56160d01c75f56170d01c75f56180d01bc524c190d01ae443e1a0d01bc524c1b0d01c75f561c0d01c75f561d0d01bc524c1e0d01881c17000e01881c17010e01bc524c020e01c75f56030e01c75f56040e01c75f56050e01bc524c060e01c75f56070e01c75f56080e01bc524c090e01bc524c0a0e01bc524c0b0e01bc524c0c0e01c75f560d0e01c75f560e0e01c75f560f0e01ae443e100e01bc524c110e01c75f56120e01c75f56130e01c75f56140e01bc524c150e01c75f56160e01c75f56170e01bc524c180e01bc524c190e01bc524c1a0e01bc524c1b0e01c75f561c0e01c75f561d0e01c75f561e0e01881c17000f01881c17010f01bc524c020f01c75f56030f01c75f56040f01bc524c050f01bc524c060f01bc524c070f01bc524c080f01bc524c090f01bc524c0a0f01bc524c0b0f01bc524c0c0f01bc524c0d0f01c75f560e0f01c75f560f0f01ae443e100f01ae443e110f01c75f56120f01c75f56130f01bc524c140f01bc524c150f01bc524c160f01bc524c170f01bc524c180f01bc524c190f01bc524c1a0f01bc524c1b0f01bc524c1c0f01c75f561d0f01c75f561e0f01881c17001001881c17011001bc524c021001c75f56031001c75f56041001bc524c051001ae443e061001bc524c071001c75f56081001c75f56091001c75f560a1001bc524c0b1001c75f560c1001c75f560d1001bc524c0e1001bc524c0f1001c75f56101001bc524c111001c75f56121001c75f56131001bc524c141001ae443e151001bc524c161001c75f56171001c75f56181001c75f56191001bc524c1a1001c75f561b1001c75f561c1001bc524c1d1001bc524c1e1001881c17001101881c17011101c75f56021101c75f56031101c75f56041101bc524c051101bc524c061101bc524c071101c75f56081101c75f56091101bc524c0a1101bc524c0b1101bc524c0c1101bc524c0d1101bc524c0e1101bc524c0f1101bc524c101101c75f56111101c75f56121101c75f56131101bc524c141101bc524c151101bc524c161101c75f56171101c75f56181101bc524c191101bc524c1a1101bc524c1b1101bc524c1c1101bc524c1d1101bc524c1e1101881c17001201881c17011201c75f56021201c75f56031201bc524c041201c75f56051201c75f56061201bc524c071201bc524c081201bc524c091201bc524c0a1201bc524c0b1201bc524c0c1201c75f560d1201c75f560e1201c75f560f1201bc524c101201c75f56111201c75f56121201bc524c131201c75f56141201c75f56151201bc524c161201bc524c171201bc524c181201bc524c191201bc524c1a1201bc524c1b1201c75f561c1201c75f561d1201c75f561e1201881c17001301881c17011301bc524c021301bc524c031301bc524c041301c75f56051301c75f56061301bc524c071301bc524c081301bc524c091301c75f560a1301c75f560b1301bc524c0c1301c75f560d1301c75f560e1301c75f560f1301bc524c101301bc524c111301bc524c121301bc524c131301c75f56141301c75f56151301bc524c161301bc524c171301bc524c181301c75f56191301c75f561a1301bc524c1b1301c75f561c1301c75f561d1301c75f561e1301881c17001401881c17011401c75f56021401bc524c031401bc524c041401bc524c051401bc524c061401bc524c071401bc524c081401c75f56091401c75f560a1401c75f560b1401bc524c0c1401bc524c0d1401c75f560e1401c75f560f1401bc524c101401c75f56111401bc524c121401bc524c131401bc524c141401bc524c151401bc524c161401bc524c171401c75f56181401c75f56191401c75f561a1401bc524c1b1401bc524c1c1401c75f561d1401c75f561e1401881c17001501881c17011501c75f56021501c75f56031501ae443e041501bc524c051501c75f56061501c75f56071501bc524c081501c75f56091501c75f560a1501bc524c0b1501bc524c0c1501bc524c0d1501ae443e0e1501ae443e0f1501c75f56101501c75f56111501c75f56121501ae443e131501bc524c141501c75f56151501c75f56161501bc524c171501c75f56181501c75f56191501bc524c1a1501bc524c1b1501bc524c1c1501ae443e1d1501ae443e1e1501881c17001601881c17011601c75f56021601bc524c031601ae443e041601ae443e051601c75f56061601c75f56071601bc524c081601bc524c091601ae443e0a1601bc524c0b1601bc524c0c1601bc524c0d1601bc524c0e1601ae443e0f1601c75f56101601c75f56111601bc524c121601ae443e131601ae443e141601c75f56151601c75f56161601bc524c171601bc524c181601ae443e191601bc524c1a1601bc524c1b1601bc524c1c1601bc524c1d1601ae443e1e1601881c17001701881c17011701881c17021701bc524c031701bc524c041701bc524c051701bc524c061701bc524c071701bc524c081701bc524c091701ae443e0a1701ae443e0b1701bc524c0c1701c75f560d1701c75f560e1701bc524c0f1701bc524c101701bc524c111701bc524c121701bc524c131701bc524c141701bc524c151701bc524c161701bc524c171701bc524c181701ae443e191701ae443e1a1701bc524c1b1701c75f561c1701c75f561d1701881c171e1701881c17021801881c17031801881c17041801bc524c051801bc524c061801c75f56071801c75f56081801bc524c091801c75f560a1801c75f560b1801bc524c0c1801c75f560d1801c75f560e1801c75f560f1801ae443e101801ae443e111801c75f56121801c75f56131801bc524c141801bc524c151801c75f56161801c75f56171801bc524c181801c75f56191801c75f561a1801bc524c1b1801881c171c1801881c17041901881c17051901881c17061901c75f56071901c75f56081901bc524c091901c75f560a1901c75f560b1901bc524c0c1901bc524c0d1901c75f560e1901c75f560f1901ae443e101901bc524c111901c75f56121901c75f56131901bc524c141901c75f56151901c75f56161901c75f56171901bc524c181901c75f56191901881c171a1901881c17061a01881c17071a01881c17081a01bc524c091a01bc524c0a1a01bc524c0b1a01bc524c0c1a01bc524c0d1a01bc524c0e1a01bc524c0f1a01bc524c101a01bc524c111a01bc524c121a01bc524c131a01bc524c141a01c75f56151a01c75f56161a01bc524c171a01881c17181a01881c17081b01881c17091b01881c170a1b01ae443e0b1b01ae443e0c1b01bc524c0d1b01bc524c0e1b01bc524c0f1b01c75f56101b01bc524c111b01bc524c121b01bc524c131b01bc524c141b01bc524c151b01881c17161b01881c170a1c01881c170b1c01881c170c1c01c75f560d1c01c75f560e1c01bc524c0f1c01c75f56101c01bc524c111c01bc524c121c01c75f56131c01881c17141c01881c170c1d01881c170d1d01881c170e1d01c75f560f1d01bc524c101d01bc524c111d01881c17121d01881c170e1e01881c170f1e01881c17101e01881c17");
    const Web$Kaelin$Assets$tile$effect$light_red2 = VoxBox$parse$("0e0001652b270f0001652b27100001652b270c0101652b270d0101652b270e010199615b0f010199615b100101a46e65110101652b27120101652b270a0201652b270b0201652b270c0201a46e650d0201a46e650e0201a46e650f020199615b100201a46e65110201a46e6512020199615b130201652b27140201652b27080301652b27090301652b270a0301a46e650b030199615b0c0301a46e650d0301a46e650e0301a46e650f030199615b10030199615b11030199615b12030199615b130301a46e65140301a46e65150301652b27160301652b27060401652b27070401652b27080401a46e65090401a46e650a0401a46e650b040199615b0c040199615b0d0401a46e650e0401a46e650f040199615b100401a46e6511040199615b12040199615b13040199615b14040199615b15040199615b16040199615b170401652b27180401652b27040501652b27050501652b27060501a46e6507050199615b080501a46e65090501a46e650a050199615b0b050199615b0c050199615b0d05018b534d0e05018b534d0f0501a46e65100501a46e65110501a46e651205018b534d13050199615b140501a46e65150501a46e6516050199615b170501a46e65180501a46e65190501652b271a0501652b27020601652b27030601652b270406018b534d050601a46e65060601a46e6507060199615b08060199615b0906018b534d0a060199615b0b060199615b0c060199615b0d060199615b0e06018b534d0f0601a46e65100601a46e6511060199615b1206018b534d1306018b534d140601a46e65150601a46e6516060199615b17060199615b1806018b534d19060199615b1a060199615b1b0601652b271c0601652b27000701652b27010701652b2702070199615b03070199615b04070199615b050701a46e65060701a46e65070701a46e6508070199615b0907018b534d0a07018b534d0b070199615b0c0701a46e650d0701a46e650e070199615b0f070199615b10070199615b11070199615b12070199615b13070199615b14070199615b15070199615b16070199615b17070199615b1807018b534d1907018b534d1a070199615b1b0701a46e651c0701a46e651d0701652b271e0701652b27000801652b2701080199615b020801a46e65030801a46e6504080199615b050801a46e65060801a46e65070801a46e6508080199615b090801a46e650a0801a46e650b080199615b0c080199615b0d0801a46e650e0801a46e650f08018b534d10080199615b110801a46e65120801a46e6513080199615b140801a46e65150801a46e65160801a46e6517080199615b18080199615b19080199615b1a080199615b1b080199615b1c0801a46e651d0801a46e651e0801652b27000901652b2701090199615b02090199615b030901a46e6504090199615b05090199615b060901a46e6507090199615b08090199615b090901a46e650a0901a46e650b090199615b0c090199615b0d0901a46e650e0901a46e650f090199615b10090199615b110901a46e65120901a46e6513090199615b14090199615b150901a46e65160901a46e6517090199615b18090199615b190901a46e651a0901a46e651b090199615b1c090199615b1d090199615b1e0901652b27000a01652b27010a0199615b020a0199615b030a018b534d040a018b534d050a0199615b060a0199615b070a0199615b080a0199615b090a0199615b0a0a01a46e650b0a01a46e650c0a0199615b0d0a0199615b0e0a0199615b0f0a0199615b100a0199615b110a0199615b120a0199615b130a0199615b140a018b534d150a0199615b160a0199615b170a0199615b180a0199615b190a01a46e651a0a01a46e651b0a01a46e651c0a0199615b1d0a0199615b1e0a01652b27000b01652b27010b0199615b020b01a46e65030b0199615b040b0199615b050b01a46e65060b01a46e65070b0199615b080b0199615b090b0199615b0a0b0199615b0b0b0199615b0c0b0199615b0d0b01a46e650e0b0199615b0f0b0199615b100b0199615b110b01a46e65120b0199615b130b0199615b140b018b534d150b01a46e65160b0199615b170b0199615b180b0199615b190b0199615b1a0b0199615b1b0b0199615b1c0b0199615b1d0b0199615b1e0b01652b27000c01652b27010c0199615b020c01a46e65030c0199615b040c0199615b050c0199615b060c0199615b070c01a46e65080c01a46e65090c0199615b0a0c018b534d0b0c018b534d0c0c0199615b0d0c01a46e650e0c0199615b0f0c01a46e65100c0199615b110c0199615b120c0199615b130c0199615b140c0199615b150c0199615b160c01a46e65170c01a46e65180c0199615b190c018b534d1a0c018b534d1b0c0199615b1c0c0199615b1d0c0199615b1e0c01652b27000d01652b27010d0199615b020d0199615b030d01a46e65040d01a46e65050d0199615b060d01a46e65070d01a46e65080d01a46e65090d0199615b0a0d018b534d0b0d0199615b0c0d01a46e650d0d01a46e650e0d0199615b0f0d01a46e65100d0199615b110d0199615b120d01a46e65130d01a46e65140d0199615b150d01a46e65160d01a46e65170d01a46e65180d0199615b190d018b534d1a0d0199615b1b0d01a46e651c0d01a46e651d0d0199615b1e0d01652b27000e01652b27010e0199615b020e01a46e65030e01a46e65040e01a46e65050e0199615b060e01a46e65070e01a46e65080e0199615b090e0199615b0a0e0199615b0b0e0199615b0c0e01a46e650d0e01a46e650e0e01a46e650f0e018b534d100e0199615b110e01a46e65120e01a46e65130e01a46e65140e0199615b150e01a46e65160e01a46e65170e0199615b180e0199615b190e0199615b1a0e0199615b1b0e01a46e651c0e01a46e651d0e01a46e651e0e01652b27000f01652b27010f0199615b020f01a46e65030f01a46e65040f0199615b050f0199615b060f0199615b070f0199615b080f0199615b090f0199615b0a0f0199615b0b0f0199615b0c0f0199615b0d0f01a46e650e0f01a46e650f0f018b534d100f018b534d110f01a46e65120f01a46e65130f0199615b140f0199615b150f0199615b160f0199615b170f0199615b180f0199615b190f0199615b1a0f0199615b1b0f0199615b1c0f01a46e651d0f01a46e651e0f01652b27001001652b2701100199615b021001a46e65031001a46e6504100199615b0510018b534d06100199615b071001a46e65081001a46e65091001a46e650a100199615b0b1001a46e650c1001a46e650d100199615b0e100199615b0f1001a46e6510100199615b111001a46e65121001a46e6513100199615b1410018b534d15100199615b161001a46e65171001a46e65181001a46e6519100199615b1a1001a46e651b1001a46e651c100199615b1d100199615b1e1001652b27001101652b27011101a46e65021101a46e65031101a46e6504110199615b05110199615b06110199615b071101a46e65081101a46e6509110199615b0a110199615b0b110199615b0c110199615b0d110199615b0e110199615b0f110199615b101101a46e65111101a46e65121101a46e6513110199615b14110199615b15110199615b161101a46e65171101a46e6518110199615b19110199615b1a110199615b1b110199615b1c110199615b1d110199615b1e1101652b27001201652b27011201a46e65021201a46e6503120199615b041201a46e65051201a46e6506120199615b07120199615b08120199615b09120199615b0a120199615b0b120199615b0c1201a46e650d1201a46e650e1201a46e650f120199615b101201a46e65111201a46e6512120199615b131201a46e65141201a46e6515120199615b16120199615b17120199615b18120199615b19120199615b1a120199615b1b1201a46e651c1201a46e651d1201a46e651e1201652b27001301652b2701130199615b02130199615b03130199615b041301a46e65051301a46e6506130199615b07130199615b08130199615b091301a46e650a1301a46e650b130199615b0c1301a46e650d1301a46e650e1301a46e650f130199615b10130199615b11130199615b12130199615b131301a46e65141301a46e6515130199615b16130199615b17130199615b181301a46e65191301a46e651a130199615b1b1301a46e651c1301a46e651d1301a46e651e1301652b27001401652b27011401a46e6502140199615b03140199615b04140199615b05140199615b06140199615b07140199615b081401a46e65091401a46e650a1401a46e650b140199615b0c140199615b0d1401a46e650e1401a46e650f140199615b101401a46e6511140199615b12140199615b13140199615b14140199615b15140199615b16140199615b171401a46e65181401a46e65191401a46e651a140199615b1b140199615b1c1401a46e651d1401a46e651e1401652b27001501652b27011501a46e65021501a46e650315018b534d04150199615b051501a46e65061501a46e6507150199615b081501a46e65091501a46e650a150199615b0b150199615b0c150199615b0d15018b534d0e15018b534d0f1501a46e65101501a46e65111501a46e651215018b534d13150199615b141501a46e65151501a46e6516150199615b171501a46e65181501a46e6519150199615b1a150199615b1b150199615b1c15018b534d1d15018b534d1e1501652b27001601652b27011601a46e6502160199615b0316018b534d0416018b534d051601a46e65061601a46e6507160199615b08160199615b0916018b534d0a160199615b0b160199615b0c160199615b0d160199615b0e16018b534d0f1601a46e65101601a46e6511160199615b1216018b534d1316018b534d141601a46e65151601a46e6516160199615b17160199615b1816018b534d19160199615b1a160199615b1b160199615b1c160199615b1d16018b534d1e1601652b27001701652b27011701652b2702170199615b03170199615b04170199615b05170199615b06170199615b07170199615b08170199615b0917018b534d0a17018b534d0b170199615b0c1701a46e650d1701a46e650e170199615b0f170199615b10170199615b11170199615b12170199615b13170199615b14170199615b15170199615b16170199615b17170199615b1817018b534d1917018b534d1a170199615b1b1701a46e651c1701a46e651d1701652b271e1701652b27021801652b27031801652b2704180199615b05180199615b061801a46e65071801a46e6508180199615b091801a46e650a1801a46e650b180199615b0c1801a46e650d1801a46e650e1801a46e650f18018b534d1018018b534d111801a46e65121801a46e6513180199615b14180199615b151801a46e65161801a46e6517180199615b181801a46e65191801a46e651a180199615b1b1801652b271c1801652b27041901652b27051901652b27061901a46e65071901a46e6508190199615b091901a46e650a1901a46e650b190199615b0c190199615b0d1901a46e650e1901a46e650f19018b534d10190199615b111901a46e65121901a46e6513190199615b141901a46e65151901a46e65161901a46e6517190199615b181901a46e65191901652b271a1901652b27061a01652b27071a01652b27081a0199615b091a0199615b0a1a0199615b0b1a0199615b0c1a0199615b0d1a0199615b0e1a0199615b0f1a0199615b101a0199615b111a0199615b121a0199615b131a0199615b141a01a46e65151a01a46e65161a0199615b171a01652b27181a01652b27081b01652b27091b01652b270a1b018b534d0b1b018b534d0c1b0199615b0d1b0199615b0e1b0199615b0f1b01a46e65101b0199615b111b0199615b121b0199615b131b0199615b141b0199615b151b01652b27161b01652b270a1c01652b270b1c01652b270c1c01a46e650d1c01a46e650e1c0199615b0f1c01a46e65101c0199615b111c0199615b121c01a46e65131c01652b27141c01652b270c1d01652b270d1d01652b270e1d01a46e650f1d0199615b101d0199615b111d01652b27121d01652b270e1e01652b270f1e01652b27101e01652b27");

    function Web$Kaelin$Terrain$grass$(_draw$1) {
        var $734 = ({
            _: 'Web.Kaelin.Terrain.grass',
            'draw': _draw$1
        });
        return $734;
    };
    const Web$Kaelin$Terrain$grass = x0 => Web$Kaelin$Terrain$grass$(x0);

    function Web$Kaelin$Map$Entity$background$(_value$1) {
        var $735 = ({
            _: 'Web.Kaelin.Map.Entity.background',
            'value': _value$1
        });
        return $735;
    };
    const Web$Kaelin$Map$Entity$background = x0 => Web$Kaelin$Map$Entity$background$(x0);
    const Web$Kaelin$Map$arena = (() => {
        var _map$1 = NatMap$new;
        var _map_size$2 = Web$Kaelin$Constants$map_size;
        var _width$3 = ((((_map_size$2 * 2) >>> 0) + 1) >>> 0);
        var _height$4 = ((((_map_size$2 * 2) >>> 0) + 1) >>> 0);
        var _terrain_img$5 = (_sprite$5 => {
            var self = _sprite$5;
            switch (self._) {
                case 'Web.Kaelin.Terrain.Sprite.new':
                    var $738 = self.effect;
                    var $739 = self.indicator;
                    var self = $739;
                    switch (self._) {
                        case 'Maybe.some':
                            var $741 = self.value;
                            var self = $741;
                            switch (self._) {
                                case 'Web.Kaelin.Indicator.green':
                                    var $743 = Web$Kaelin$Assets$tile$effect$blue_green2;
                                    var $742 = $743;
                                    break;
                                case 'Web.Kaelin.Indicator.red':
                                    var $744 = Web$Kaelin$Assets$tile$effect$dark_red2;
                                    var $742 = $744;
                                    break;
                                case 'Web.Kaelin.Indicator.yellow':
                                    var $745 = Web$Kaelin$Assets$tile$effect$light_red2;
                                    var $742 = $745;
                                    break;
                                case 'Web.Kaelin.Indicator.blue':
                                    var $746 = Web$Kaelin$Assets$tile$effect$light_blue2;
                                    var $742 = $746;
                                    break;
                            };
                            var $740 = $742;
                            break;
                        case 'Maybe.none':
                            var self = $738;
                            switch (self._) {
                                case 'Web.Kaelin.HexEffect.normal':
                                    var $748 = Web$Kaelin$Assets$tile$green_2;
                                    var $747 = $748;
                                    break;
                                case 'Web.Kaelin.HexEffect.movement':
                                    var $749 = Web$Kaelin$Assets$tile$effect$light_blue2;
                                    var $747 = $749;
                                    break;
                                case 'Web.Kaelin.HexEffect.skill':
                                    var $750 = Web$Kaelin$Assets$tile$effect$dark_blue2;
                                    var $747 = $750;
                                    break;
                            };
                            var $740 = $747;
                            break;
                    };
                    var $737 = $740;
                    break;
            };
            return $737;
        });
        var _new_terrain$6 = Web$Kaelin$Terrain$grass$(_terrain_img$5);
        var _new_terrain$7 = Web$Kaelin$Map$Entity$background$(_new_terrain$6);
        var _map$8 = (() => {
            var $751 = _map$1;
            var $752 = 0;
            var $753 = _height$4;
            let _map$9 = $751;
            for (let _j$8 = $752; _j$8 < $753; ++_j$8) {
                var _map$10 = (() => {
                    var $754 = _map$9;
                    var $755 = 0;
                    var $756 = _width$3;
                    let _map$11 = $754;
                    for (let _i$10 = $755; _i$10 < $756; ++_i$10) {
                        var _coord_i$12 = ((U32$to_i32$(_i$10) - U32$to_i32$(_map_size$2)) >> 0);
                        var _coord_j$13 = ((U32$to_i32$(_j$8) - U32$to_i32$(_map_size$2)) >> 0);
                        var _coord$14 = Web$Kaelin$Coord$new$(_coord_i$12, _coord_j$13);
                        var _fit$15 = Web$Kaelin$Coord$fit$(_coord$14, _map_size$2);
                        var self = _fit$15;
                        if (self) {
                            var $757 = Web$Kaelin$Map$push$(_coord$14, _new_terrain$7, _map$11);
                            var $754 = $757;
                        } else {
                            var $758 = _map$11;
                            var $754 = $758;
                        };
                        _map$11 = $754;
                    };
                    return _map$11;
                })();
                var $751 = _map$10;
                _map$9 = $751;
            };
            return _map$9;
        })();
        var $736 = _map$8;
        return $736;
    })();

    function App$EnvInfo$new$(_screen_size$1, _mouse_pos$2) {
        var $759 = ({
            _: 'App.EnvInfo.new',
            'screen_size': _screen_size$1,
            'mouse_pos': _mouse_pos$2
        });
        return $759;
    };
    const App$EnvInfo$new = x0 => x1 => App$EnvInfo$new$(x0, x1);

    function Web$Kaelin$State$game$(_user$1, _room$2, _players$3, _cast_info$4, _map$5, _internal$6, _env_info$7) {
        var $760 = ({
            _: 'Web.Kaelin.State.game',
            'user': _user$1,
            'room': _room$2,
            'players': _players$3,
            'cast_info': _cast_info$4,
            'map': _map$5,
            'internal': _internal$6,
            'env_info': _env_info$7
        });
        return $760;
    };
    const Web$Kaelin$State$game = x0 => x1 => x2 => x3 => x4 => x5 => x6 => Web$Kaelin$State$game$(x0, x1, x2, x3, x4, x5, x6);

    function Web$Kaelin$Internal$new$(_tick$1, _frame$2, _timer$3) {
        var $761 = ({
            _: 'Web.Kaelin.Internal.new',
            'tick': _tick$1,
            'frame': _frame$2,
            'timer': _timer$3
        });
        return $761;
    };
    const Web$Kaelin$Internal$new = x0 => x1 => x2 => Web$Kaelin$Internal$new$(x0, x1, x2);
    const Web$Kaelin$App$init = (() => {
        var _user$1 = "";
        var _room$2 = Web$Kaelin$Constants$room;
        var _tick$3 = 0n;
        var _frame$4 = 0n;
        var _players$5 = Map$from_list$(List$nil);
        var _cast_info$6 = Maybe$none;
        var _map$7 = Web$Kaelin$Map$init$(Web$Kaelin$Map$arena);
        var _interface$8 = App$EnvInfo$new$(Pair$new$(256, 256), Pair$new$(0, 0));
        var $762 = Web$Kaelin$State$game$(_user$1, _room$2, _players$5, _cast_info$6, _map$7, Web$Kaelin$Internal$new$(_tick$3, _frame$4, List$nil), _interface$8);
        return $762;
    })();

    function DOM$text$(_value$1) {
        var $763 = ({
            _: 'DOM.text',
            'value': _value$1
        });
        return $763;
    };
    const DOM$text = x0 => DOM$text$(x0);

    function DOM$vbox$(_props$1, _style$2, _value$3) {
        var $764 = ({
            _: 'DOM.vbox',
            'props': _props$1,
            'style': _style$2,
            'value': _value$3
        });
        return $764;
    };
    const DOM$vbox = x0 => x1 => x2 => DOM$vbox$(x0, x1, x2);

    function List$reverse$go$(_xs$2, _res$3) {
        var List$reverse$go$ = (_xs$2, _res$3) => ({
            ctr: 'TCO',
            arg: [_xs$2, _res$3]
        });
        var List$reverse$go = _xs$2 => _res$3 => List$reverse$go$(_xs$2, _res$3);
        var arg = [_xs$2, _res$3];
        while (true) {
            let [_xs$2, _res$3] = arg;
            var R = (() => {
                var self = _xs$2;
                switch (self._) {
                    case 'List.cons':
                        var $765 = self.head;
                        var $766 = self.tail;
                        var $767 = List$reverse$go$($766, List$cons$($765, _res$3));
                        return $767;
                    case 'List.nil':
                        var $768 = _res$3;
                        return $768;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const List$reverse$go = x0 => x1 => List$reverse$go$(x0, x1);

    function List$reverse$(_xs$2) {
        var $769 = List$reverse$go$(_xs$2, List$nil);
        return $769;
    };
    const List$reverse = x0 => List$reverse$(x0);

    function Bits$reverse$tco$(_a$1, _r$2) {
        var Bits$reverse$tco$ = (_a$1, _r$2) => ({
            ctr: 'TCO',
            arg: [_a$1, _r$2]
        });
        var Bits$reverse$tco = _a$1 => _r$2 => Bits$reverse$tco$(_a$1, _r$2);
        var arg = [_a$1, _r$2];
        while (true) {
            let [_a$1, _r$2] = arg;
            var R = (() => {
                var self = _a$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'o':
                        var $770 = self.slice(0, -1);
                        var $771 = Bits$reverse$tco$($770, (_r$2 + '0'));
                        return $771;
                    case 'i':
                        var $772 = self.slice(0, -1);
                        var $773 = Bits$reverse$tco$($772, (_r$2 + '1'));
                        return $773;
                    case 'e':
                        var $774 = _r$2;
                        return $774;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Bits$reverse$tco = x0 => x1 => Bits$reverse$tco$(x0, x1);

    function Bits$reverse$(_a$1) {
        var $775 = Bits$reverse$tco$(_a$1, Bits$e);
        return $775;
    };
    const Bits$reverse = x0 => Bits$reverse$(x0);

    function BitsMap$to_list$go$(_xs$2, _key$3, _list$4) {
        var self = _xs$2;
        switch (self._) {
            case 'BitsMap.tie':
                var $777 = self.val;
                var $778 = self.lft;
                var $779 = self.rgt;
                var self = $777;
                switch (self._) {
                    case 'Maybe.some':
                        var $781 = self.value;
                        var $782 = List$cons$(Pair$new$(Bits$reverse$(_key$3), $781), _list$4);
                        var _list0$8 = $782;
                        break;
                    case 'Maybe.none':
                        var $783 = _list$4;
                        var _list0$8 = $783;
                        break;
                };
                var _list1$9 = BitsMap$to_list$go$($778, (_key$3 + '0'), _list0$8);
                var _list2$10 = BitsMap$to_list$go$($779, (_key$3 + '1'), _list1$9);
                var $780 = _list2$10;
                var $776 = $780;
                break;
            case 'BitsMap.new':
                var $784 = _list$4;
                var $776 = $784;
                break;
        };
        return $776;
    };
    const BitsMap$to_list$go = x0 => x1 => x2 => BitsMap$to_list$go$(x0, x1, x2);

    function List$mapped$(_as$2, _f$4) {
        var self = _as$2;
        switch (self._) {
            case 'List.cons':
                var $786 = self.head;
                var $787 = self.tail;
                var $788 = List$cons$(_f$4($786), List$mapped$($787, _f$4));
                var $785 = $788;
                break;
            case 'List.nil':
                var $789 = List$nil;
                var $785 = $789;
                break;
        };
        return $785;
    };
    const List$mapped = x0 => x1 => List$mapped$(x0, x1);

    function Bits$to_nat$(_b$1) {
        var self = _b$1;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'o':
                var $791 = self.slice(0, -1);
                var $792 = (2n * Bits$to_nat$($791));
                var $790 = $792;
                break;
            case 'i':
                var $793 = self.slice(0, -1);
                var $794 = Nat$succ$((2n * Bits$to_nat$($793)));
                var $790 = $794;
                break;
            case 'e':
                var $795 = 0n;
                var $790 = $795;
                break;
        };
        return $790;
    };
    const Bits$to_nat = x0 => Bits$to_nat$(x0);

    function NatMap$to_list$(_xs$2) {
        var _kvs$3 = List$reverse$(BitsMap$to_list$go$(_xs$2, Bits$e, List$nil));
        var $796 = List$mapped$(_kvs$3, (_kv$4 => {
            var self = _kv$4;
            switch (self._) {
                case 'Pair.new':
                    var $798 = self.fst;
                    var $799 = self.snd;
                    var $800 = Pair$new$(Bits$to_nat$($798), $799);
                    var $797 = $800;
                    break;
            };
            return $797;
        }));
        return $796;
    };
    const NatMap$to_list = x0 => NatMap$to_list$(x0);
    const F64$div = a0 => a1 => (a0 / a1);
    const Web$Kaelin$Constants$hexagon_radius = 15;
    const F64$parse = a0 => (parseFloat(a0));
    const Web$Kaelin$Constants$center_x = 128;
    const Web$Kaelin$Constants$center_y = 128;
    const F64$sub = a0 => a1 => (a0 - a1);
    const F64$mul = a0 => a1 => (a0 * a1);
    const U32$from_nat = a0 => (Number(a0) >>> 0);
    const F64$add = a0 => a1 => (a0 + a1);

    function Web$Kaelin$Coord$round$floor$(_n$1) {
        var $801 = (((_n$1 >> 0)));
        return $801;
    };
    const Web$Kaelin$Coord$round$floor = x0 => Web$Kaelin$Coord$round$floor$(x0);

    function Web$Kaelin$Coord$round$round_F64$(_n$1) {
        var _half$2 = (+0.5);
        var _big_number$3 = (+1000.0);
        var _n$4 = (_n$1 + _big_number$3);
        var _result$5 = Web$Kaelin$Coord$round$floor$((_n$4 + _half$2));
        var $802 = (_result$5 - _big_number$3);
        return $802;
    };
    const Web$Kaelin$Coord$round$round_F64 = x0 => Web$Kaelin$Coord$round$round_F64$(x0);

    function Word$gtn$(_a$2, _b$3) {
        var $803 = Cmp$as_gtn$(Word$cmp$(_a$2, _b$3));
        return $803;
    };
    const Word$gtn = x0 => x1 => Word$gtn$(x0, x1);

    function F64$gtn$(_a$1, _b$2) {
        var self = _a$1;
        switch ('f64') {
            case 'f64':
                var $805 = f64_to_word(self);
                var self = _b$2;
                switch ('f64') {
                    case 'f64':
                        var $807 = f64_to_word(self);
                        var $808 = Word$gtn$($805, $807);
                        var $806 = $808;
                        break;
                };
                var $804 = $806;
                break;
        };
        return $804;
    };
    const F64$gtn = x0 => x1 => F64$gtn$(x0, x1);

    function Web$Kaelin$Coord$round$diff$(_x$1, _y$2) {
        var _big_number$3 = (+1000.0);
        var _x$4 = (_x$1 + _big_number$3);
        var _y$5 = (_y$2 + _big_number$3);
        var self = F64$gtn$(_x$4, _y$5);
        if (self) {
            var $810 = (_x$4 - _y$5);
            var $809 = $810;
        } else {
            var $811 = (_y$5 - _x$4);
            var $809 = $811;
        };
        return $809;
    };
    const Web$Kaelin$Coord$round$diff = x0 => x1 => Web$Kaelin$Coord$round$diff$(x0, x1);

    function Web$Kaelin$Coord$round$(_axial_x$1, _axial_y$2) {
        var _f$3 = U32$to_f64;
        var _i$4 = F64$to_i32;
        var _axial_z$5 = ((_f$3(0) - _axial_x$1) - _axial_y$2);
        var _round_x$6 = Web$Kaelin$Coord$round$round_F64$(_axial_x$1);
        var _round_y$7 = Web$Kaelin$Coord$round$round_F64$(_axial_y$2);
        var _round_z$8 = Web$Kaelin$Coord$round$round_F64$(_axial_z$5);
        var _diff_x$9 = Web$Kaelin$Coord$round$diff$(_axial_x$1, _round_x$6);
        var _diff_y$10 = Web$Kaelin$Coord$round$diff$(_axial_y$2, _round_y$7);
        var _diff_z$11 = Web$Kaelin$Coord$round$diff$(_axial_z$5, _round_z$8);
        var self = F64$gtn$(_diff_x$9, _diff_z$11);
        if (self) {
            var self = F64$gtn$(_diff_y$10, _diff_x$9);
            if (self) {
                var _new_y$12 = ((_f$3(0) - _round_x$6) - _round_z$8);
                var $814 = Pair$new$(_i$4(_round_x$6), _i$4(_new_y$12));
                var $813 = $814;
            } else {
                var _new_x$12 = ((_f$3(0) - _round_y$7) - _round_z$8);
                var $815 = Pair$new$(_i$4(_new_x$12), _i$4(_round_y$7));
                var $813 = $815;
            };
            var _result$12 = $813;
        } else {
            var self = F64$gtn$(_diff_y$10, _diff_z$11);
            if (self) {
                var _new_y$12 = ((_f$3(0) - _round_x$6) - _round_z$8);
                var $817 = Pair$new$(_i$4(_round_x$6), _i$4(_new_y$12));
                var $816 = $817;
            } else {
                var $818 = Pair$new$(_i$4(_round_x$6), _i$4(_round_y$7));
                var $816 = $818;
            };
            var _result$12 = $816;
        };
        var $812 = _result$12;
        return $812;
    };
    const Web$Kaelin$Coord$round = x0 => x1 => Web$Kaelin$Coord$round$(x0, x1);

    function Web$Kaelin$Coord$to_axial$(_coord$1) {
        var self = _coord$1;
        switch (self._) {
            case 'Pair.new':
                var $820 = self.fst;
                var $821 = self.snd;
                var _f$4 = U32$to_f64;
                var _i$5 = F64$to_i32;
                var _float_hex_rad$6 = (_f$4(Web$Kaelin$Constants$hexagon_radius) / (+2.0));
                var _center_x$7 = Web$Kaelin$Constants$center_x;
                var _center_y$8 = Web$Kaelin$Constants$center_y;
                var _float_x$9 = ((_f$4($820) - _f$4(_center_x$7)) / _float_hex_rad$6);
                var _float_y$10 = ((_f$4($821) - _f$4(_center_y$8)) / _float_hex_rad$6);
                var _fourth$11 = (+0.25);
                var _sixth$12 = ((+1.0) / (+6.0));
                var _third$13 = ((+1.0) / (+3.0));
                var _half$14 = (+0.5);
                var _axial_x$15 = ((_float_x$9 * _fourth$11) - (_float_y$10 * _sixth$12));
                var _axial_y$16 = (_float_y$10 * _third$13);
                var self = Web$Kaelin$Coord$round$(_axial_x$15, _axial_y$16);
                switch (self._) {
                    case 'Pair.new':
                        var $823 = self.fst;
                        var $824 = self.snd;
                        var $825 = Web$Kaelin$Coord$new$($823, $824);
                        var $822 = $825;
                        break;
                };
                var $819 = $822;
                break;
        };
        return $819;
    };
    const Web$Kaelin$Coord$to_axial = x0 => Web$Kaelin$Coord$to_axial$(x0);

    function Word$mod$(_a$2, _b$3) {
        var _q$4 = Word$div$(_a$2, _b$3);
        var $826 = Word$sub$(_a$2, Word$mul$(_b$3, _q$4));
        return $826;
    };
    const Word$mod = x0 => x1 => Word$mod$(x0, x1);
    const U32$mod = a0 => a1 => (a0 % a1);

    function Web$Kaelin$Coord$Convert$nat_to_axial$(_a$1) {
        var _a_32$2 = (Number(_a$1) >>> 0);
        var _coord_i$3 = ((_a_32$2 / 1000) >>> 0);
        var _coord_i$4 = U32$to_i32$(_coord_i$3);
        var _coord_i$5 = ((_coord_i$4 - 100) >> 0);
        var _coord_j$6 = (_a_32$2 % 1000);
        var _coord_j$7 = U32$to_i32$(_coord_j$6);
        var _coord_j$8 = ((_coord_j$7 - 100) >> 0);
        var $827 = Web$Kaelin$Coord$new$(_coord_i$5, _coord_j$8);
        return $827;
    };
    const Web$Kaelin$Coord$Convert$nat_to_axial = x0 => Web$Kaelin$Coord$Convert$nat_to_axial$(x0);
    const Web$Kaelin$HexEffect$normal = ({
        _: 'Web.Kaelin.HexEffect.normal'
    });

    function NatSet$has$(_nat$1, _set$2) {
        var self = NatMap$get$(_nat$1, _set$2);
        switch (self._) {
            case 'Maybe.none':
                var $829 = Bool$false;
                var $828 = $829;
                break;
            case 'Maybe.some':
                var $830 = Bool$true;
                var $828 = $830;
                break;
        };
        return $828;
    };
    const NatSet$has = x0 => x1 => NatSet$has$(x0, x1);

    function Web$Kaelin$Draw$support$get_effect$(_coord$1, _coord_nat$2, _cast_info$3) {
        var self = _cast_info$3;
        switch (self._) {
            case 'Web.Kaelin.CastInfo.new':
                var $832 = self.hex_effect;
                var $833 = self.range;
                var _is_in_range$10 = NatSet$has$(_coord_nat$2, $833);
                var self = _is_in_range$10;
                if (self) {
                    var $835 = $832;
                    var $834 = $835;
                } else {
                    var $836 = Web$Kaelin$HexEffect$normal;
                    var $834 = $836;
                };
                var $831 = $834;
                break;
        };
        return $831;
    };
    const Web$Kaelin$Draw$support$get_effect = x0 => x1 => x2 => Web$Kaelin$Draw$support$get_effect$(x0, x1, x2);

    function Web$Kaelin$Draw$support$area_of_effect$(_cast_info$1, _coord$2, _coord_nat$3, _area$4) {
        var self = _cast_info$1;
        switch (self._) {
            case 'Web.Kaelin.CastInfo.new':
                var $838 = self.hex_effect;
                var $839 = self.range;
                var self = $838;
                switch (self._) {
                    case 'Web.Kaelin.HexEffect.normal':
                    case 'Web.Kaelin.HexEffect.movement':
                        var $841 = Maybe$none;
                        var $840 = $841;
                        break;
                    case 'Web.Kaelin.HexEffect.skill':
                        var self = NatSet$has$(_coord_nat$3, $839);
                        if (self) {
                            var $843 = NatMap$get$(_coord_nat$3, _area$4);
                            var $842 = $843;
                        } else {
                            var $844 = Maybe$none;
                            var $842 = $844;
                        };
                        var $840 = $842;
                        break;
                };
                var $837 = $840;
                break;
        };
        return $837;
    };
    const Web$Kaelin$Draw$support$area_of_effect = x0 => x1 => x2 => x3 => Web$Kaelin$Draw$support$area_of_effect$(x0, x1, x2, x3);

    function Web$Kaelin$Terrain$Sprite$new$(_effect$1, _indicator$2) {
        var $845 = ({
            _: 'Web.Kaelin.Terrain.Sprite.new',
            'effect': _effect$1,
            'indicator': _indicator$2
        });
        return $845;
    };
    const Web$Kaelin$Terrain$Sprite$new = x0 => x1 => Web$Kaelin$Terrain$Sprite$new$(x0, x1);

    function Web$Kaelin$Draw$support$get_sprite$(_coord$1, _coord_nat$2, _cast_info$3) {
        var self = _cast_info$3;
        switch (self._) {
            case 'Maybe.some':
                var $847 = self.value;
                var $848 = Web$Kaelin$Draw$support$get_effect$(_coord$1, _coord_nat$2, $847);
                var _hex_effect$4 = $848;
                break;
            case 'Maybe.none':
                var $849 = Web$Kaelin$HexEffect$normal;
                var _hex_effect$4 = $849;
                break;
        };
        var self = _cast_info$3;
        switch (self._) {
            case 'Maybe.some':
                var $850 = self.value;
                var self = $850;
                switch (self._) {
                    case 'Web.Kaelin.CastInfo.new':
                        var $852 = self.area;
                        var $853 = Web$Kaelin$Draw$support$area_of_effect$($850, _coord$1, _coord_nat$2, $852);
                        var $851 = $853;
                        break;
                };
                var _area$5 = $851;
                break;
            case 'Maybe.none':
                var $854 = Maybe$none;
                var _area$5 = $854;
                break;
        };
        var $846 = Web$Kaelin$Terrain$Sprite$new$(_hex_effect$4, _area$5);
        return $846;
    };
    const Web$Kaelin$Draw$support$get_sprite = x0 => x1 => x2 => Web$Kaelin$Draw$support$get_sprite$(x0, x1, x2);

    function Web$Kaelin$Coord$to_screen_xy$(_coord$1) {
        var self = _coord$1;
        switch (self._) {
            case 'Web.Kaelin.Coord.new':
                var $856 = self.i;
                var $857 = self.j;
                var _i$4 = $856;
                var _j$5 = $857;
                var _i$6 = (_i$4);
                var _j$7 = (_j$5);
                var _int_rad$8 = (Web$Kaelin$Constants$hexagon_radius);
                var _hlf$9 = (_int_rad$8 / (+2.0));
                var _int_screen_center_x$10 = (Web$Kaelin$Constants$center_x);
                var _int_screen_center_y$11 = (Web$Kaelin$Constants$center_y);
                var _cx$12 = (_int_screen_center_x$10 + (_j$7 * _int_rad$8));
                var _cx$13 = (_cx$12 + (_i$6 * (_int_rad$8 * (+2.0))));
                var _cy$14 = (_int_screen_center_y$11 + (_j$7 * (_hlf$9 * (+3.0))));
                var _cx$15 = ((_cx$13 >>> 0));
                var _cy$16 = (_cy$14 + (+0.5));
                var _cy$17 = ((_cy$16 >>> 0));
                var $858 = Pair$new$(_cx$15, _cy$17);
                var $855 = $858;
                break;
        };
        return $855;
    };
    const Web$Kaelin$Coord$to_screen_xy = x0 => Web$Kaelin$Coord$to_screen_xy$(x0);
    const U32$sub = a0 => a1 => ((a0 - a1) >>> 0);

    function Web$Kaelin$Draw$support$centralize$(_coord$1) {
        var self = Web$Kaelin$Coord$to_screen_xy$(_coord$1);
        switch (self._) {
            case 'Pair.new':
                var $860 = self.fst;
                var $861 = self.snd;
                var _i$4 = (($860 - Web$Kaelin$Constants$hexagon_radius) >>> 0);
                var _j$5 = (($861 - Web$Kaelin$Constants$hexagon_radius) >>> 0);
                var $862 = Pair$new$(_i$4, _j$5);
                var $859 = $862;
                break;
        };
        return $859;
    };
    const Web$Kaelin$Draw$support$centralize = x0 => Web$Kaelin$Draw$support$centralize$(x0);

    function VoxBox$get_len$(_img$1) {
        var self = _img$1;
        switch (self._) {
            case 'VoxBox.new':
                var $864 = self.length;
                var $865 = $864;
                var $863 = $865;
                break;
        };
        return $863;
    };
    const VoxBox$get_len = x0 => VoxBox$get_len$(x0);

    function Array$get$(_idx$3, _arr$4) {
        var $866 = Word$foldl$(Array$extract_tip, (_rec$6 => _arr$7 => {
            var _arr_l$8 = Array$extract_tie$(_arr$7);
            var self = _arr_l$8;
            switch (self._) {
                case 'Pair.new':
                    var $868 = self.fst;
                    var $869 = _rec$6($868);
                    var $867 = $869;
                    break;
            };
            return $867;
        }), (_rec$6 => _arr$7 => {
            var _arr_r$8 = Array$extract_tie$(_arr$7);
            var self = _arr_r$8;
            switch (self._) {
                case 'Pair.new':
                    var $871 = self.snd;
                    var $872 = _rec$6($871);
                    var $870 = $872;
                    break;
            };
            return $870;
        }), _idx$3)(_arr$4);
        return $866;
    };
    const Array$get = x0 => x1 => Array$get$(x0, x1);
    const Buffer32$get = a0 => a1 => ((a1[a0]));
    const VoxBox$get_pos = a0 => a1 => ((a1.buffer[a0 * 2]));
    const VoxBox$get_col = a0 => a1 => ((a1.buffer[a0 * 2 + 1]));

    function Word$and$(_a$2, _b$3) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $874 = self.pred;
                var $875 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $877 = self.pred;
                            var $878 = (_a$pred$9 => {
                                var $879 = Word$o$(Word$and$(_a$pred$9, $877));
                                return $879;
                            });
                            var $876 = $878;
                            break;
                        case 'Word.i':
                            var $880 = self.pred;
                            var $881 = (_a$pred$9 => {
                                var $882 = Word$o$(Word$and$(_a$pred$9, $880));
                                return $882;
                            });
                            var $876 = $881;
                            break;
                        case 'Word.e':
                            var $883 = (_a$pred$7 => {
                                var $884 = Word$e;
                                return $884;
                            });
                            var $876 = $883;
                            break;
                    };
                    var $876 = $876($874);
                    return $876;
                });
                var $873 = $875;
                break;
            case 'Word.i':
                var $885 = self.pred;
                var $886 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $888 = self.pred;
                            var $889 = (_a$pred$9 => {
                                var $890 = Word$o$(Word$and$(_a$pred$9, $888));
                                return $890;
                            });
                            var $887 = $889;
                            break;
                        case 'Word.i':
                            var $891 = self.pred;
                            var $892 = (_a$pred$9 => {
                                var $893 = Word$i$(Word$and$(_a$pred$9, $891));
                                return $893;
                            });
                            var $887 = $892;
                            break;
                        case 'Word.e':
                            var $894 = (_a$pred$7 => {
                                var $895 = Word$e;
                                return $895;
                            });
                            var $887 = $894;
                            break;
                    };
                    var $887 = $887($885);
                    return $887;
                });
                var $873 = $886;
                break;
            case 'Word.e':
                var $896 = (_b$4 => {
                    var $897 = Word$e;
                    return $897;
                });
                var $873 = $896;
                break;
        };
        var $873 = $873(_b$3);
        return $873;
    };
    const Word$and = x0 => x1 => Word$and$(x0, x1);
    const U32$and = a0 => a1 => (a0 & a1);
    const U32$shr = a0 => a1 => (a0 >>> a1);

    function VoxBox$Draw$image$(_x$1, _y$2, _z$3, _src$4, _img$5) {
        var _len$6 = VoxBox$get_len$(_src$4);
        var _img$7 = (() => {
            var $899 = _img$5;
            var $900 = 0;
            var $901 = _len$6;
            let _img$8 = $899;
            for (let _i$7 = $900; _i$7 < $901; ++_i$7) {
                var _pos$9 = ((_src$4.buffer[_i$7 * 2]));
                var _col$10 = ((_src$4.buffer[_i$7 * 2 + 1]));
                var _p_x$11 = (_pos$9 & 4095);
                var _p_y$12 = ((_pos$9 & 16773120) >>> 12);
                var _p_z$13 = ((_pos$9 & 4278190080) >>> 24);
                var _p_x$14 = ((_p_x$11 + _x$1) >>> 0);
                var _p_y$15 = ((_p_y$12 + _y$2) >>> 0);
                var _p_z$16 = ((_p_z$13 + _z$3) >>> 0);
                var _pos$17 = ((0 | _p_x$14 | (_p_y$15 << 12) | (_p_z$16 << 24)));
                var $899 = ((_img$8.buffer[_img$8.length * 2] = _pos$17, _img$8.buffer[_img$8.length * 2 + 1] = _col$10, _img$8.length++, _img$8));
                _img$8 = $899;
            };
            return _img$8;
        })();
        var $898 = _img$7;
        return $898;
    };
    const VoxBox$Draw$image = x0 => x1 => x2 => x3 => x4 => VoxBox$Draw$image$(x0, x1, x2, x3, x4);

    function Web$Kaelin$Draw$state$background$(_map$1, _cast_info$2, _env_info$3, _img$4) {
        var self = _env_info$3;
        switch (self._) {
            case 'App.EnvInfo.new':
                var $903 = self.mouse_pos;
                var _list$7 = NatMap$to_list$(_map$1);
                var _mouse_coord$8 = Web$Kaelin$Coord$to_axial$($903);
                var _img$9 = (() => {
                    var $906 = _img$4;
                    var $907 = _list$7;
                    let _img$10 = $906;
                    let _pair$9;
                    while ($907._ === 'List.cons') {
                        _pair$9 = $907.head;
                        var self = _pair$9;
                        switch (self._) {
                            case 'Pair.new':
                                var $908 = self.fst;
                                var $909 = self.snd;
                                var _coord$13 = Web$Kaelin$Coord$Convert$nat_to_axial$($908);
                                var _coord_nat$14 = $908;
                                var _sprite$15 = Web$Kaelin$Draw$support$get_sprite$(_coord$13, _coord_nat$14, _cast_info$2);
                                var _tile$16 = $909;
                                var self = Web$Kaelin$Draw$support$centralize$(_coord$13);
                                switch (self._) {
                                    case 'Pair.new':
                                        var $911 = self.fst;
                                        var $912 = self.snd;
                                        var self = _tile$16;
                                        switch (self._) {
                                            case 'Web.Kaelin.Tile.new':
                                                var $914 = self.background;
                                                var self = $914;
                                                switch (self._) {
                                                    case 'Web.Kaelin.Terrain.grass':
                                                        var $916 = self.draw;
                                                        var $917 = VoxBox$Draw$image$($911, $912, 0, $916(_sprite$15), _img$10);
                                                        var $915 = $917;
                                                        break;
                                                };
                                                var $913 = $915;
                                                break;
                                        };
                                        var $910 = $913;
                                        break;
                                };
                                var $906 = $910;
                                break;
                        };
                        _img$10 = $906;
                        $907 = $907.tail;
                    }
                    return _img$10;
                })();
                var $904 = _img$9;
                var $902 = $904;
                break;
        };
        return $902;
    };
    const Web$Kaelin$Draw$state$background = x0 => x1 => x2 => x3 => Web$Kaelin$Draw$state$background$(x0, x1, x2, x3);
    const Web$Kaelin$Assets$tile$mouse_ui = VoxBox$parse$("0d0302ffffff0e0302ffffff0f0302ffffff100302ffffff110302ffffff0b0402ffffff0c0402ffffff0d0402ffffff0e0402ffffff0f0402ffffff100402ffffff110402ffffff120402ffffff130402ffffff0b0502ffffff0c0502ffffff0d0502ffffff110502ffffff120502ffffff130502ffffff040702ffffff050702ffffff060702ffffff180702ffffff190702ffffff1a0702ffffff030802ffffff040802ffffff050802ffffff060802ffffff180802ffffff190802ffffff1a0802ffffff1b0802ffffff020902ffffff030902ffffff040902ffffff1a0902ffffff1b0902ffffff1c0902ffffff020a02ffffff030a02ffffff1b0a02ffffff1c0a02ffffff020b02ffffff030b02ffffff1b0b02ffffff1c0b02ffffff021302ffffff031302ffffff1b1302ffffff1c1302ffffff021402ffffff031402ffffff1b1402ffffff1c1402ffffff021502ffffff031502ffffff041502ffffff1a1502ffffff1b1502ffffff1c1502ffffff031602ffffff041602ffffff051602ffffff061602ffffff181602ffffff191602ffffff1a1602ffffff1b1602ffffff041702ffffff051702ffffff061702ffffff181702ffffff191702ffffff1a1702ffffff0b1902ffffff0c1902ffffff0d1902ffffff111902ffffff121902ffffff131902ffffff0b1a02ffffff0c1a02ffffff0d1a02ffffff0e1a02ffffff0f1a02ffffff101a02ffffff111a02ffffff121a02ffffff131a02ffffff0d1b02ffffff0e1b02ffffff0f1b02ffffff101b02ffffff111b02ffffff");

    function Web$Kaelin$Draw$state$mouse_ui$(_info$1, _img$2) {
        var self = _info$1;
        switch (self._) {
            case 'App.EnvInfo.new':
                var $919 = self.mouse_pos;
                var _coord$5 = Web$Kaelin$Coord$to_axial$($919);
                var self = Web$Kaelin$Draw$support$centralize$(_coord$5);
                switch (self._) {
                    case 'Pair.new':
                        var $921 = self.fst;
                        var $922 = self.snd;
                        var $923 = VoxBox$Draw$image$($921, $922, 0, Web$Kaelin$Assets$tile$mouse_ui, _img$2);
                        var $920 = $923;
                        break;
                };
                var $918 = $920;
                break;
        };
        return $918;
    };
    const Web$Kaelin$Draw$state$mouse_ui = x0 => x1 => Web$Kaelin$Draw$state$mouse_ui$(x0, x1);

    function Web$Kaelin$Draw$hero$(_cx$1, _cy$2, _z$3, _hero$4, _img$5) {
        var self = _hero$4;
        switch (self._) {
            case 'Web.Kaelin.Hero.new':
                var $925 = self.img;
                var _aux_y$10 = ((Web$Kaelin$Constants$hexagon_radius * 2) >>> 0);
                var _cy$11 = ((_cy$2 - _aux_y$10) >>> 0);
                var _cx$12 = ((_cx$1 - Web$Kaelin$Constants$hexagon_radius) >>> 0);
                var $926 = VoxBox$Draw$image$(_cx$12, _cy$11, 0, $925, _img$5);
                var $924 = $926;
                break;
        };
        return $924;
    };
    const Web$Kaelin$Draw$hero = x0 => x1 => x2 => x3 => x4 => Web$Kaelin$Draw$hero$(x0, x1, x2, x3, x4);
    const Nat$gtn = a0 => a1 => (a0 > a1);

    function Int$is_neg$(_a$1) {
        var self = _a$1;
        switch ("new") {
            case 'new':
                var $928 = int_pos(self);
                var $929 = int_neg(self);
                var $930 = ($929 > $928);
                var $927 = $930;
                break;
        };
        return $927;
    };
    const Int$is_neg = x0 => Int$is_neg$(x0);

    function Int$neg$(_a$1) {
        var self = _a$1;
        switch ("new") {
            case 'new':
                var $932 = int_pos(self);
                var $933 = int_neg(self);
                var $934 = ($933 - $932);
                var $931 = $934;
                break;
        };
        return $931;
    };
    const Int$neg = x0 => Int$neg$(x0);

    function Int$abs$(_a$1) {
        var _neg$2 = Int$is_neg$(_a$1);
        var self = _neg$2;
        if (self) {
            var _a$3 = Int$neg$(_a$1);
            var self = _a$3;
            switch ("new") {
                case 'new':
                    var $937 = int_pos(self);
                    var $938 = $937;
                    var $936 = $938;
                    break;
            };
            var $935 = $936;
        } else {
            var self = _a$1;
            switch ("new") {
                case 'new':
                    var $940 = int_pos(self);
                    var $941 = $940;
                    var $939 = $941;
                    break;
            };
            var $935 = $939;
        };
        return $935;
    };
    const Int$abs = x0 => Int$abs$(x0);

    function Int$to_nat_signed$(_a$1) {
        var $942 = Pair$new$(Int$is_neg$(_a$1), Int$abs$(_a$1));
        return $942;
    };
    const Int$to_nat_signed = x0 => Int$to_nat_signed$(x0);

    function String$cons$(_head$1, _tail$2) {
        var $943 = (String.fromCharCode(_head$1) + _tail$2);
        return $943;
    };
    const String$cons = x0 => x1 => String$cons$(x0, x1);
    const String$concat = a0 => a1 => (a0 + a1);

    function List$fold$(_list$2, _nil$4, _cons$5) {
        var self = _list$2;
        switch (self._) {
            case 'List.cons':
                var $945 = self.head;
                var $946 = self.tail;
                var $947 = _cons$5($945)(List$fold$($946, _nil$4, _cons$5));
                var $944 = $947;
                break;
            case 'List.nil':
                var $948 = _nil$4;
                var $944 = $948;
                break;
        };
        return $944;
    };
    const List$fold = x0 => x1 => x2 => List$fold$(x0, x1, x2);

    function Either$(_A$1, _B$2) {
        var $949 = null;
        return $949;
    };
    const Either = x0 => x1 => Either$(x0, x1);

    function Either$left$(_value$3) {
        var $950 = ({
            _: 'Either.left',
            'value': _value$3
        });
        return $950;
    };
    const Either$left = x0 => Either$left$(x0);

    function Either$right$(_value$3) {
        var $951 = ({
            _: 'Either.right',
            'value': _value$3
        });
        return $951;
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
                    var $952 = Either$left$(_n$1);
                    return $952;
                } else {
                    var $953 = (self - 1n);
                    var self = _n$1;
                    if (self === 0n) {
                        var $955 = Either$right$(Nat$succ$($953));
                        var $954 = $955;
                    } else {
                        var $956 = (self - 1n);
                        var $957 = Nat$sub_rem$($956, $953);
                        var $954 = $957;
                    };
                    return $954;
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
                        var $958 = self.value;
                        var $959 = Nat$div_mod$go$($958, _m$2, Nat$succ$(_d$3));
                        return $959;
                    case 'Either.right':
                        var $960 = Pair$new$(_d$3, _n$1);
                        return $960;
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
                        var $961 = self.fst;
                        var $962 = self.snd;
                        var self = $961;
                        if (self === 0n) {
                            var $964 = List$cons$($962, _res$3);
                            var $963 = $964;
                        } else {
                            var $965 = (self - 1n);
                            var $966 = Nat$to_base$go$(_base$1, $961, List$cons$($962, _res$3));
                            var $963 = $966;
                        };
                        return $963;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Nat$to_base$go = x0 => x1 => x2 => Nat$to_base$go$(x0, x1, x2);

    function Nat$to_base$(_base$1, _nat$2) {
        var $967 = Nat$to_base$go$(_base$1, _nat$2, List$nil);
        return $967;
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
                    var $968 = Nat$mod$go$(_n$1, _r$3, _m$2);
                    return $968;
                } else {
                    var $969 = (self - 1n);
                    var self = _n$1;
                    if (self === 0n) {
                        var $971 = _r$3;
                        var $970 = $971;
                    } else {
                        var $972 = (self - 1n);
                        var $973 = Nat$mod$go$($972, $969, Nat$succ$(_r$3));
                        var $970 = $973;
                    };
                    return $970;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Nat$mod$go = x0 => x1 => x2 => Nat$mod$go$(x0, x1, x2);
    const Nat$mod = a0 => a1 => (a0 % a1);
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
                        var $974 = self.head;
                        var $975 = self.tail;
                        var self = _index$2;
                        if (self === 0n) {
                            var $977 = Maybe$some$($974);
                            var $976 = $977;
                        } else {
                            var $978 = (self - 1n);
                            var $979 = List$at$($978, $975);
                            var $976 = $979;
                        };
                        return $976;
                    case 'List.nil':
                        var $980 = Maybe$none;
                        return $980;
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
                    var $983 = self.value;
                    var $984 = $983;
                    var $982 = $984;
                    break;
                case 'Maybe.none':
                    var $985 = 35;
                    var $982 = $985;
                    break;
            };
            var $981 = $982;
        } else {
            var $986 = 35;
            var $981 = $986;
        };
        return $981;
    };
    const Nat$show_digit = x0 => x1 => Nat$show_digit$(x0, x1);

    function Nat$to_string_base$(_base$1, _nat$2) {
        var $987 = List$fold$(Nat$to_base$(_base$1, _nat$2), String$nil, (_n$3 => _str$4 => {
            var $988 = String$cons$(Nat$show_digit$(_base$1, _n$3), _str$4);
            return $988;
        }));
        return $987;
    };
    const Nat$to_string_base = x0 => x1 => Nat$to_string_base$(x0, x1);

    function Nat$show$(_n$1) {
        var $989 = Nat$to_string_base$(10n, _n$1);
        return $989;
    };
    const Nat$show = x0 => Nat$show$(x0);

    function Int$show$(_a$1) {
        var _result$2 = Int$to_nat_signed$(_a$1);
        var self = _result$2;
        switch (self._) {
            case 'Pair.new':
                var $991 = self.fst;
                var $992 = self.snd;
                var self = $991;
                if (self) {
                    var $994 = ("-" + Nat$show$($992));
                    var $993 = $994;
                } else {
                    var $995 = ("+" + Nat$show$($992));
                    var $993 = $995;
                };
                var $990 = $993;
                break;
        };
        return $990;
    };
    const Int$show = x0 => Int$show$(x0);

    function Word$abs$(_a$2) {
        var _neg$3 = Word$is_neg$(_a$2);
        var self = _neg$3;
        if (self) {
            var $997 = Word$neg$(_a$2);
            var $996 = $997;
        } else {
            var $998 = _a$2;
            var $996 = $998;
        };
        return $996;
    };
    const Word$abs = x0 => Word$abs$(x0);

    function Word$to_int$(_a$2) {
        var _neg$3 = Word$is_neg$(_a$2);
        var _i$4 = (Word$to_nat$(Word$abs$(_a$2)));
        var self = _neg$3;
        if (self) {
            var $1000 = Int$neg$(_i$4);
            var $999 = $1000;
        } else {
            var $1001 = _i$4;
            var $999 = $1001;
        };
        return $999;
    };
    const Word$to_int = x0 => Word$to_int$(x0);

    function I32$to_int$(_a$1) {
        var self = _a$1;
        switch ('i32') {
            case 'i32':
                var $1003 = i32_to_word(self);
                var $1004 = Word$to_int$($1003);
                var $1002 = $1004;
                break;
        };
        return $1002;
    };
    const I32$to_int = x0 => I32$to_int$(x0);

    function List$imap$(_f$3, _xs$4) {
        var self = _xs$4;
        switch (self._) {
            case 'List.cons':
                var $1006 = self.head;
                var $1007 = self.tail;
                var $1008 = List$cons$(_f$3(0n)($1006), List$imap$((_n$7 => {
                    var $1009 = _f$3(Nat$succ$(_n$7));
                    return $1009;
                }), $1007));
                var $1005 = $1008;
                break;
            case 'List.nil':
                var $1010 = List$nil;
                var $1005 = $1010;
                break;
        };
        return $1005;
    };
    const List$imap = x0 => x1 => List$imap$(x0, x1);

    function List$indices$u32$(_xs$2) {
        var $1011 = List$imap$((_i$3 => _x$4 => {
            var $1012 = Pair$new$((Number(_i$3) >>> 0), _x$4);
            return $1012;
        }), _xs$2);
        return $1011;
    };
    const List$indices$u32 = x0 => List$indices$u32$(x0);

    function String$to_list$(_str$1) {
        var self = _str$1;
        if (self.length === 0) {
            var $1014 = List$nil;
            var $1013 = $1014;
        } else {
            var $1015 = self.charCodeAt(0);
            var $1016 = self.slice(1);
            var $1017 = List$cons$($1015, String$to_list$($1016));
            var $1013 = $1017;
        };
        return $1013;
    };
    const String$to_list = x0 => String$to_list$(x0);

    function Map$get$(_key$2, _map$3) {
        var $1018 = (bitsmap_get(String$to_bits$(_key$2), _map$3));
        return $1018;
    };
    const Map$get = x0 => x1 => Map$get$(x0, x1);

    function U16$show_hex$(_a$1) {
        var self = _a$1;
        switch ('u16') {
            case 'u16':
                var $1020 = u16_to_word(self);
                var $1021 = Nat$to_string_base$(16n, Bits$to_nat$(Word$to_bits$($1020)));
                var $1019 = $1021;
                break;
        };
        return $1019;
    };
    const U16$show_hex = x0 => U16$show_hex$(x0);

    function PixelFont$get_img$(_char$1, _map$2) {
        var self = Map$get$(U16$show_hex$(_char$1), _map$2);
        switch (self._) {
            case 'Maybe.some':
                var $1023 = self.value;
                var $1024 = Maybe$some$($1023);
                var $1022 = $1024;
                break;
            case 'Maybe.none':
                var $1025 = Maybe$none;
                var $1022 = $1025;
                break;
        };
        return $1022;
    };
    const PixelFont$get_img = x0 => x1 => PixelFont$get_img$(x0, x1);
    const Pos32$get_x = a0 => ((a0 & 0xFFF));
    const Pos32$get_y = a0 => (((a0 >>> 12) & 0xFFF));
    const Pos32$get_z = a0 => ((a0 >>> 24));

    function VoxBox$Draw$text$char$(_chr$1, _font_map$2, _chr_pos$3, _scr$4) {
        var self = PixelFont$get_img$(_chr$1, _font_map$2);
        switch (self._) {
            case 'Maybe.some':
                var $1027 = self.value;
                var _x$6 = ((_chr_pos$3 & 0xFFF));
                var _y$7 = (((_chr_pos$3 >>> 12) & 0xFFF));
                var _z$8 = ((_chr_pos$3 >>> 24));
                var $1028 = VoxBox$Draw$image$(_x$6, _y$7, _z$8, $1027, _scr$4);
                var $1026 = $1028;
                break;
            case 'Maybe.none':
                var $1029 = _scr$4;
                var $1026 = $1029;
                break;
        };
        return $1026;
    };
    const VoxBox$Draw$text$char = x0 => x1 => x2 => x3 => VoxBox$Draw$text$char$(x0, x1, x2, x3);

    function Pos32$add$(_a$1, _b$2) {
        var _x$3 = ((((_a$1 & 0xFFF)) + ((_b$2 & 0xFFF))) >>> 0);
        var _y$4 = (((((_a$1 >>> 12) & 0xFFF)) + (((_b$2 >>> 12) & 0xFFF))) >>> 0);
        var _z$5 = ((((_a$1 >>> 24)) + ((_b$2 >>> 24))) >>> 0);
        var $1030 = ((0 | _x$3 | (_y$4 << 12) | (_z$5 << 24)));
        return $1030;
    };
    const Pos32$add = x0 => x1 => Pos32$add$(x0, x1);

    function VoxBox$Draw$text$(_txt$1, _font_map$2, _pos$3, _scr$4) {
        var _scr$5 = (() => {
            var $1033 = _scr$4;
            var $1034 = List$indices$u32$(String$to_list$(_txt$1));
            let _scr$6 = $1033;
            let _pair$5;
            while ($1034._ === 'List.cons') {
                _pair$5 = $1034.head;
                var self = _pair$5;
                switch (self._) {
                    case 'Pair.new':
                        var $1035 = self.fst;
                        var $1036 = self.snd;
                        var _add_pos$9 = ((0 | (($1035 * 6) >>> 0) | (0 << 12) | (0 << 24)));
                        var $1037 = VoxBox$Draw$text$char$($1036, _font_map$2, Pos32$add$(_pos$3, _add_pos$9), _scr$6);
                        var $1033 = $1037;
                        break;
                };
                _scr$6 = $1033;
                $1034 = $1034.tail;
            }
            return _scr$6;
        })();
        var $1031 = _scr$5;
        return $1031;
    };
    const VoxBox$Draw$text = x0 => x1 => x2 => x3 => VoxBox$Draw$text$(x0, x1, x2, x3);
    const Map$new = BitsMap$new;

    function Map$set$(_key$2, _val$3, _map$4) {
        var $1038 = (bitsmap_set(String$to_bits$(_key$2), _val$3, _map$4, 'set'));
        return $1038;
    };
    const Map$set = x0 => x1 => x2 => Map$set$(x0, x1, x2);

    function PixelFont$set_img$(_char$1, _img$2, _map$3) {
        var $1039 = Map$set$(U16$show_hex$(_char$1), _img$2, _map$3);
        return $1039;
    };
    const PixelFont$set_img = x0 => x1 => x2 => PixelFont$set_img$(x0, x1, x2);

    function U16$new$(_value$1) {
        var $1040 = word_to_u16(_value$1);
        return $1040;
    };
    const U16$new = x0 => U16$new$(x0);
    const Nat$to_u16 = a0 => (Number(a0) & 0xFFFF);
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
        var $1041 = _map$96;
        return $1041;
    })();

    function Web$Kaelin$Draw$state$players_hp$(_cx$1, _cy$2, _player$3, _img$4) {
        var self = _player$3;
        switch (self._) {
            case 'Web.Kaelin.Creature.new':
                var $1043 = self.hp;
                var _cy$10 = ((_cy$2 + Web$Kaelin$Constants$hexagon_radius) >>> 0);
                var _hp$11 = Int$show$(I32$to_int$($1043));
                var $1044 = VoxBox$Draw$text$(_hp$11, PixelFont$small_black, ((0 | _cx$1 | (_cy$10 << 12) | (0 << 24))), _img$4);
                var $1042 = $1044;
                break;
        };
        return $1042;
    };
    const Web$Kaelin$Draw$state$players_hp = x0 => x1 => x2 => x3 => Web$Kaelin$Draw$state$players_hp$(x0, x1, x2, x3);

    function Web$Kaelin$Draw$state$players$(_map$1, _img$2) {
        var _player_list$3 = NatMap$to_list$(_map$1);
        var _img$4 = (() => {
            var $1047 = _img$2;
            var $1048 = _player_list$3;
            let _img$5 = $1047;
            let _pair$4;
            while ($1048._ === 'List.cons') {
                _pair$4 = $1048.head;
                var self = _pair$4;
                switch (self._) {
                    case 'Pair.new':
                        var $1049 = self.fst;
                        var $1050 = self.snd;
                        var self = $1050;
                        switch (self._) {
                            case 'Web.Kaelin.Tile.new':
                                var $1052 = self.creature;
                                var self = $1052;
                                switch (self._) {
                                    case 'Maybe.some':
                                        var $1054 = self.value;
                                        var self = $1054;
                                        switch (self._) {
                                            case 'Web.Kaelin.Creature.new':
                                                var $1056 = self.hero;
                                                var $1057 = self.hp;
                                                var _coord$16 = Web$Kaelin$Coord$Convert$nat_to_axial$($1049);
                                                var self = Web$Kaelin$Coord$to_screen_xy$(_coord$16);
                                                switch (self._) {
                                                    case 'Pair.new':
                                                        var $1059 = self.fst;
                                                        var $1060 = self.snd;
                                                        var _img$19 = Web$Kaelin$Draw$hero$($1059, $1060, 0, $1056, _img$5);
                                                        var self = (0 > $1057);
                                                        if (self) {
                                                            var $1062 = Web$Kaelin$Draw$state$players_hp$($1059, (($1060 - Web$Kaelin$Constants$hexagon_radius) >>> 0), $1054, _img$19);
                                                            var $1061 = $1062;
                                                        } else {
                                                            var $1063 = _img$19;
                                                            var $1061 = $1063;
                                                        };
                                                        var $1058 = $1061;
                                                        break;
                                                };
                                                var $1055 = $1058;
                                                break;
                                        };
                                        var $1053 = $1055;
                                        break;
                                    case 'Maybe.none':
                                        var $1064 = _img$5;
                                        var $1053 = $1064;
                                        break;
                                };
                                var $1051 = $1053;
                                break;
                        };
                        var $1047 = $1051;
                        break;
                };
                _img$5 = $1047;
                $1048 = $1048.tail;
            }
            return _img$5;
        })();
        var $1045 = _img$4;
        return $1045;
    };
    const Web$Kaelin$Draw$state$players = x0 => x1 => Web$Kaelin$Draw$state$players$(x0, x1);

    function Web$Kaelin$Draw$state$(_img$1, _state$2) {
        var self = _state$2;
        switch (self._) {
            case 'Web.Kaelin.State.game':
                var $1066 = self.cast_info;
                var $1067 = self.map;
                var $1068 = self.env_info;
                var _img$10 = Web$Kaelin$Draw$state$background$($1067, $1066, $1068, _img$1);
                var _img$11 = Web$Kaelin$Draw$state$mouse_ui$($1068, _img$10);
                var _img$12 = Web$Kaelin$Draw$state$players$($1067, _img$11);
                var $1069 = _img$12;
                var $1065 = $1069;
                break;
            case 'Web.Kaelin.State.init':
            case 'Web.Kaelin.State.void':
                var $1070 = _img$1;
                var $1065 = $1070;
                break;
        };
        return $1065;
    };
    const Web$Kaelin$Draw$state = x0 => x1 => Web$Kaelin$Draw$state$(x0, x1);

    function Web$Kaelin$App$draw$(_img$1, _state$2) {
        var self = _state$2;
        switch (self._) {
            case 'Web.Kaelin.State.init':
            case 'Web.Kaelin.State.void':
                var $1072 = DOM$text$("TODO: create the renderer for this game state mode");
                var $1071 = $1072;
                break;
            case 'Web.Kaelin.State.game':
                var $1073 = DOM$vbox$(Map$from_list$(List$nil), Map$from_list$(List$nil), Web$Kaelin$Draw$state$(_img$1, _state$2));
                var $1071 = $1073;
                break;
        };
        return $1071;
    };
    const Web$Kaelin$App$draw = x0 => x1 => Web$Kaelin$App$draw$(x0, x1);

    function IO$(_A$1) {
        var $1074 = null;
        return $1074;
    };
    const IO = x0 => IO$(x0);

    function IO$ask$(_query$2, _param$3, _then$4) {
        var $1075 = ({
            _: 'IO.ask',
            'query': _query$2,
            'param': _param$3,
            'then': _then$4
        });
        return $1075;
    };
    const IO$ask = x0 => x1 => x2 => IO$ask$(x0, x1, x2);

    function IO$bind$(_a$3, _f$4) {
        var self = _a$3;
        switch (self._) {
            case 'IO.end':
                var $1077 = self.value;
                var $1078 = _f$4($1077);
                var $1076 = $1078;
                break;
            case 'IO.ask':
                var $1079 = self.query;
                var $1080 = self.param;
                var $1081 = self.then;
                var $1082 = IO$ask$($1079, $1080, (_x$8 => {
                    var $1083 = IO$bind$($1081(_x$8), _f$4);
                    return $1083;
                }));
                var $1076 = $1082;
                break;
        };
        return $1076;
    };
    const IO$bind = x0 => x1 => IO$bind$(x0, x1);

    function IO$end$(_value$2) {
        var $1084 = ({
            _: 'IO.end',
            'value': _value$2
        });
        return $1084;
    };
    const IO$end = x0 => IO$end$(x0);

    function IO$monad$(_new$2) {
        var $1085 = _new$2(IO$bind)(IO$end);
        return $1085;
    };
    const IO$monad = x0 => IO$monad$(x0);

    function Dynamic$new$(_value$2) {
        var $1086 = ({
            _: 'Dynamic.new',
            'value': _value$2
        });
        return $1086;
    };
    const Dynamic$new = x0 => Dynamic$new$(x0);
    const App$pass = IO$monad$((_m$bind$1 => _m$pure$2 => {
        var $1087 = _m$pure$2;
        return $1087;
    }))(Dynamic$new$(Unit$new));

    function String$map$(_f$1, _as$2) {
        var self = _as$2;
        if (self.length === 0) {
            var $1089 = String$nil;
            var $1088 = $1089;
        } else {
            var $1090 = self.charCodeAt(0);
            var $1091 = self.slice(1);
            var $1092 = String$cons$(_f$1($1090), String$map$(_f$1, $1091));
            var $1088 = $1092;
        };
        return $1088;
    };
    const String$map = x0 => x1 => String$map$(x0, x1);
    const U16$gte = a0 => a1 => (a0 >= a1);
    const U16$lte = a0 => a1 => (a0 <= a1);
    const U16$add = a0 => a1 => ((a0 + a1) & 0xFFFF);

    function Char$to_lower$(_char$1) {
        var self = ((_char$1 >= 65) && (_char$1 <= 90));
        if (self) {
            var $1094 = ((_char$1 + 32) & 0xFFFF);
            var $1093 = $1094;
        } else {
            var $1095 = _char$1;
            var $1093 = $1095;
        };
        return $1093;
    };
    const Char$to_lower = x0 => Char$to_lower$(x0);

    function String$to_lower$(_str$1) {
        var $1096 = String$map$(Char$to_lower, _str$1);
        return $1096;
    };
    const String$to_lower = x0 => String$to_lower$(x0);

    function IO$do$(_call$1, _param$2) {
        var $1097 = IO$ask$(_call$1, _param$2, (_answer$3 => {
            var $1098 = IO$end$(Unit$new);
            return $1098;
        }));
        return $1097;
    };
    const IO$do = x0 => x1 => IO$do$(x0, x1);

    function App$do$(_call$1, _param$2) {
        var $1099 = IO$monad$((_m$bind$3 => _m$pure$4 => {
            var $1100 = _m$bind$3;
            return $1100;
        }))(IO$do$(_call$1, _param$2))((_$3 => {
            var $1101 = App$pass;
            return $1101;
        }));
        return $1099;
    };
    const App$do = x0 => x1 => App$do$(x0, x1);

    function App$watch$(_room$1) {
        var $1102 = App$do$("watch", _room$1);
        return $1102;
    };
    const App$watch = x0 => App$watch$(x0);

    function App$store$(_value$2) {
        var $1103 = IO$monad$((_m$bind$3 => _m$pure$4 => {
            var $1104 = _m$pure$4;
            return $1104;
        }))(Dynamic$new$(_value$2));
        return $1103;
    };
    const App$store = x0 => App$store$(x0);

    function List$take_while$go$(_f$2, _xs$3) {
        var self = _xs$3;
        switch (self._) {
            case 'List.cons':
                var $1106 = self.head;
                var $1107 = self.tail;
                var self = _f$2($1106);
                if (self) {
                    var self = List$take_while$go$(_f$2, $1107);
                    switch (self._) {
                        case 'Pair.new':
                            var $1110 = self.fst;
                            var $1111 = self.snd;
                            var $1112 = Pair$new$(List$cons$($1106, $1110), $1111);
                            var $1109 = $1112;
                            break;
                    };
                    var $1108 = $1109;
                } else {
                    var $1113 = Pair$new$(List$nil, _xs$3);
                    var $1108 = $1113;
                };
                var $1105 = $1108;
                break;
            case 'List.nil':
                var $1114 = Pair$new$(List$nil, List$nil);
                var $1105 = $1114;
                break;
        };
        return $1105;
    };
    const List$take_while$go = x0 => x1 => List$take_while$go$(x0, x1);

    function List$foldr$(_b$3, _f$4, _xs$5) {
        var $1115 = List$fold$(_xs$5, _b$3, _f$4);
        return $1115;
    };
    const List$foldr = x0 => x1 => x2 => List$foldr$(x0, x1, x2);

    function Web$Kaelin$Timer$set_timer$(_timer$1, _state$2) {
        var self = _state$2;
        switch (self._) {
            case 'Web.Kaelin.State.game':
                var $1117 = self.user;
                var $1118 = self.room;
                var $1119 = self.players;
                var $1120 = self.cast_info;
                var $1121 = self.map;
                var $1122 = self.internal;
                var $1123 = self.env_info;
                var _internal$10 = $1122;
                var self = _internal$10;
                switch (self._) {
                    case 'Web.Kaelin.Internal.new':
                        var $1125 = self.tick;
                        var $1126 = self.frame;
                        var $1127 = Web$Kaelin$State$game$($1117, $1118, $1119, $1120, $1121, Web$Kaelin$Internal$new$($1125, $1126, _timer$1), $1123);
                        var $1124 = $1127;
                        break;
                };
                var $1116 = $1124;
                break;
            case 'Web.Kaelin.State.init':
            case 'Web.Kaelin.State.void':
                var $1128 = _state$2;
                var $1116 = $1128;
                break;
        };
        return $1116;
    };
    const Web$Kaelin$Timer$set_timer = x0 => x1 => Web$Kaelin$Timer$set_timer$(x0, x1);

    function Function$comp$(_g$4, _f$5, _x$6) {
        var $1129 = _g$4(_f$5(_x$6));
        return $1129;
    };
    const Function$comp = x0 => x1 => x2 => Function$comp$(x0, x1, x2);

    function Web$Kaelin$Timer$wait$(_frame$1, _timer$2, _state$3) {
        var self = List$take_while$go$((_x$4 => {
            var self = _x$4;
            switch (self._) {
                case 'Web.Kaelin.Timer.new':
                    var $1132 = self.time;
                    var $1133 = ($1132 < _frame$1);
                    var $1131 = $1133;
                    break;
            };
            return $1131;
        }), _timer$2);
        switch (self._) {
            case 'Pair.new':
                var $1134 = self.fst;
                var $1135 = self.snd;
                var $1136 = Web$Kaelin$Timer$set_timer$($1135, List$foldr$((_x$6 => {
                    var $1137 = _x$6;
                    return $1137;
                }), (_x$6 => _f$7 => {
                    var self = _x$6;
                    switch (self._) {
                        case 'Web.Kaelin.Timer.new':
                            var $1139 = self.action;
                            var $1140 = Function$comp(_f$7)($1139);
                            var $1138 = $1140;
                            break;
                    };
                    return $1138;
                }), $1134)(_state$3));
                var $1130 = $1136;
                break;
        };
        return $1130;
    };
    const Web$Kaelin$Timer$wait = x0 => x1 => x2 => Web$Kaelin$Timer$wait$(x0, x1, x2);

    function Web$Kaelin$Action$update_interface$(_interface$1, _tick$2, _state$3) {
        var self = _state$3;
        switch (self._) {
            case 'Web.Kaelin.State.game':
                var $1142 = self.user;
                var $1143 = self.room;
                var $1144 = self.players;
                var $1145 = self.cast_info;
                var $1146 = self.map;
                var $1147 = self.internal;
                var _internal$11 = $1147;
                var self = _internal$11;
                switch (self._) {
                    case 'Web.Kaelin.Internal.new':
                        var $1149 = self.frame;
                        var $1150 = self.timer;
                        var _new_state$15 = Web$Kaelin$State$game$($1142, $1143, $1144, $1145, $1146, Web$Kaelin$Internal$new$(_tick$2, ($1149 + 1n), $1150), _interface$1);
                        var $1151 = Web$Kaelin$Timer$wait$($1149, $1150, _new_state$15);
                        var $1148 = $1151;
                        break;
                };
                var $1141 = $1148;
                break;
            case 'Web.Kaelin.State.init':
            case 'Web.Kaelin.State.void':
                var $1152 = _state$3;
                var $1141 = $1152;
                break;
        };
        return $1141;
    };
    const Web$Kaelin$Action$update_interface = x0 => x1 => x2 => Web$Kaelin$Action$update_interface$(x0, x1, x2);
    const U64$to_nat = a0 => (a0);
    const I32$eql = a0 => a1 => (a0 === a1);

    function Web$Kaelin$Coord$eql$(_a$1, _b$2) {
        var self = _a$1;
        switch (self._) {
            case 'Web.Kaelin.Coord.new':
                var $1154 = self.i;
                var $1155 = self.j;
                var self = _b$2;
                switch (self._) {
                    case 'Web.Kaelin.Coord.new':
                        var $1157 = self.i;
                        var $1158 = self.j;
                        var $1159 = (($1154 === $1157) && ($1155 === $1158));
                        var $1156 = $1159;
                        break;
                };
                var $1153 = $1156;
                break;
        };
        return $1153;
    };
    const Web$Kaelin$Coord$eql = x0 => x1 => Web$Kaelin$Coord$eql$(x0, x1);

    function Web$Kaelin$Skill$indicator$(_tick$1, _hero_pos$2, _skill$3, _mouse_coord$4, _map$5) {
        var self = _skill$3;
        switch (self._) {
            case 'Web.Kaelin.Skill.new':
                var $1161 = self.effect;
                var _result$10 = $1161(_tick$1)(_hero_pos$2)(_mouse_coord$4)(_map$5);
                var self = _result$10;
                switch (self._) {
                    case 'Web.Kaelin.Effect.Result.new':
                        var $1163 = self.indicators;
                        var $1164 = $1163;
                        var $1162 = $1164;
                        break;
                };
                var $1160 = $1162;
                break;
        };
        return $1160;
    };
    const Web$Kaelin$Skill$indicator = x0 => x1 => x2 => x3 => x4 => Web$Kaelin$Skill$indicator$(x0, x1, x2, x3, x4);

    function Web$Kaelin$CastInfo$new$(_hero_pos$1, _hex_effect$2, _skill$3, _range$4, _area$5, _mouse_pos$6) {
        var $1165 = ({
            _: 'Web.Kaelin.CastInfo.new',
            'hero_pos': _hero_pos$1,
            'hex_effect': _hex_effect$2,
            'skill': _skill$3,
            'range': _range$4,
            'area': _area$5,
            'mouse_pos': _mouse_pos$6
        });
        return $1165;
    };
    const Web$Kaelin$CastInfo$new = x0 => x1 => x2 => x3 => x4 => x5 => Web$Kaelin$CastInfo$new$(x0, x1, x2, x3, x4, x5);

    function Web$Kaelin$Action$update_area$(_state$1) {
        var self = _state$1;
        switch (self._) {
            case 'Web.Kaelin.State.game':
                var $1167 = self.user;
                var $1168 = self.room;
                var $1169 = self.players;
                var $1170 = self.cast_info;
                var $1171 = self.map;
                var $1172 = self.internal;
                var $1173 = self.env_info;
                var self = $1173;
                switch (self._) {
                    case 'App.EnvInfo.new':
                        var $1175 = self.mouse_pos;
                        var self = $1170;
                        switch (self._) {
                            case 'Maybe.some':
                                var $1177 = self.value;
                                var self = $1177;
                                switch (self._) {
                                    case 'Web.Kaelin.CastInfo.new':
                                        var $1179 = self.hero_pos;
                                        var $1180 = self.hex_effect;
                                        var $1181 = self.skill;
                                        var $1182 = self.range;
                                        var $1183 = self.mouse_pos;
                                        var _mouse_coord$18 = Web$Kaelin$Coord$to_axial$($1175);
                                        var self = Web$Kaelin$Coord$eql$(_mouse_coord$18, $1183);
                                        if (self) {
                                            var $1185 = _state$1;
                                            var $1184 = $1185;
                                        } else {
                                            var self = $1172;
                                            switch (self._) {
                                                case 'Web.Kaelin.Internal.new':
                                                    var $1187 = self.tick;
                                                    var _area$22 = Web$Kaelin$Skill$indicator$($1187, $1179, $1181, _mouse_coord$18, $1171);
                                                    var _new_cast_info$23 = Maybe$some$(Web$Kaelin$CastInfo$new$($1179, $1180, $1181, $1182, _area$22, _mouse_coord$18));
                                                    var _new_state$24 = Web$Kaelin$State$game$($1167, $1168, $1169, _new_cast_info$23, $1171, $1172, $1173);
                                                    var $1188 = _new_state$24;
                                                    var $1186 = $1188;
                                                    break;
                                            };
                                            var $1184 = $1186;
                                        };
                                        var $1178 = $1184;
                                        break;
                                };
                                var $1176 = $1178;
                                break;
                            case 'Maybe.none':
                                var $1189 = _state$1;
                                var $1176 = $1189;
                                break;
                        };
                        var $1174 = $1176;
                        break;
                };
                var $1166 = $1174;
                break;
            case 'Web.Kaelin.State.init':
            case 'Web.Kaelin.State.void':
                var $1190 = _state$1;
                var $1166 = $1190;
                break;
        };
        return $1166;
    };
    const Web$Kaelin$Action$update_area = x0 => Web$Kaelin$Action$update_area$(x0);
    const U8$to_nat = a0 => (BigInt(a0));

    function List$zip$(_as$3, _bs$4) {
        var self = _as$3;
        switch (self._) {
            case 'List.cons':
                var $1192 = self.head;
                var $1193 = self.tail;
                var self = _bs$4;
                switch (self._) {
                    case 'List.cons':
                        var $1195 = self.head;
                        var $1196 = self.tail;
                        var $1197 = List$cons$(Pair$new$($1192, $1195), List$zip$($1193, $1196));
                        var $1194 = $1197;
                        break;
                    case 'List.nil':
                        var $1198 = List$nil;
                        var $1194 = $1198;
                        break;
                };
                var $1191 = $1194;
                break;
            case 'List.nil':
                var $1199 = List$nil;
                var $1191 = $1199;
                break;
        };
        return $1191;
    };
    const List$zip = x0 => x1 => List$zip$(x0, x1);

    function U8$new$(_value$1) {
        var $1200 = word_to_u8(_value$1);
        return $1200;
    };
    const U8$new = x0 => U8$new$(x0);
    const Nat$to_u8 = a0 => (Number(a0) & 0xFF);
    const Web$Kaelin$Event$Code$action = List$cons$(2, List$nil);

    function String$length$go$(_xs$1, _n$2) {
        var String$length$go$ = (_xs$1, _n$2) => ({
            ctr: 'TCO',
            arg: [_xs$1, _n$2]
        });
        var String$length$go = _xs$1 => _n$2 => String$length$go$(_xs$1, _n$2);
        var arg = [_xs$1, _n$2];
        while (true) {
            let [_xs$1, _n$2] = arg;
            var R = (() => {
                var self = _xs$1;
                if (self.length === 0) {
                    var $1201 = _n$2;
                    return $1201;
                } else {
                    var $1202 = self.charCodeAt(0);
                    var $1203 = self.slice(1);
                    var $1204 = String$length$go$($1203, Nat$succ$(_n$2));
                    return $1204;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const String$length$go = x0 => x1 => String$length$go$(x0, x1);

    function String$length$(_xs$1) {
        var $1205 = String$length$go$(_xs$1, 0n);
        return $1205;
    };
    const String$length = x0 => String$length$(x0);

    function String$repeat$(_xs$1, _n$2) {
        var self = _n$2;
        if (self === 0n) {
            var $1207 = String$nil;
            var $1206 = $1207;
        } else {
            var $1208 = (self - 1n);
            var $1209 = (_xs$1 + String$repeat$(_xs$1, $1208));
            var $1206 = $1209;
        };
        return $1206;
    };
    const String$repeat = x0 => x1 => String$repeat$(x0, x1);

    function Hex$set_min_length$(_min$1, _hex$2) {
        var _dif$3 = (_min$1 - String$length$(_hex$2) <= 0n ? 0n : _min$1 - String$length$(_hex$2));
        var $1210 = (_hex$2 + String$repeat$("0", _dif$3));
        return $1210;
    };
    const Hex$set_min_length = x0 => x1 => Hex$set_min_length$(x0, x1);

    function Hex$format_hex$(_min$1, _hex$2) {
        var _dif$3 = (_min$1 - String$length$(_hex$2) <= 0n ? 0n : _min$1 - String$length$(_hex$2));
        var self = (String$length$(_hex$2) < _min$1);
        if (self) {
            var $1212 = (String$repeat$("0", _dif$3) + _hex$2);
            var $1211 = $1212;
        } else {
            var $1213 = _hex$2;
            var $1211 = $1213;
        };
        return $1211;
    };
    const Hex$format_hex = x0 => x1 => Hex$format_hex$(x0, x1);

    function Bits$chunks_of$go$(_len$1, _bits$2, _need$3, _chunk$4) {
        var self = _bits$2;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'o':
                var $1215 = self.slice(0, -1);
                var self = _need$3;
                if (self === 0n) {
                    var _head$6 = Bits$reverse$(_chunk$4);
                    var _tail$7 = Bits$chunks_of$go$(_len$1, _bits$2, _len$1, Bits$e);
                    var $1217 = List$cons$(_head$6, _tail$7);
                    var $1216 = $1217;
                } else {
                    var $1218 = (self - 1n);
                    var _chunk$7 = (_chunk$4 + '0');
                    var $1219 = Bits$chunks_of$go$(_len$1, $1215, $1218, _chunk$7);
                    var $1216 = $1219;
                };
                var $1214 = $1216;
                break;
            case 'i':
                var $1220 = self.slice(0, -1);
                var self = _need$3;
                if (self === 0n) {
                    var _head$6 = Bits$reverse$(_chunk$4);
                    var _tail$7 = Bits$chunks_of$go$(_len$1, _bits$2, _len$1, Bits$e);
                    var $1222 = List$cons$(_head$6, _tail$7);
                    var $1221 = $1222;
                } else {
                    var $1223 = (self - 1n);
                    var _chunk$7 = (_chunk$4 + '1');
                    var $1224 = Bits$chunks_of$go$(_len$1, $1220, $1223, _chunk$7);
                    var $1221 = $1224;
                };
                var $1214 = $1221;
                break;
            case 'e':
                var $1225 = List$cons$(Bits$reverse$(_chunk$4), List$nil);
                var $1214 = $1225;
                break;
        };
        return $1214;
    };
    const Bits$chunks_of$go = x0 => x1 => x2 => x3 => Bits$chunks_of$go$(x0, x1, x2, x3);

    function Bits$chunks_of$(_len$1, _bits$2) {
        var $1226 = Bits$chunks_of$go$(_len$1, _bits$2, _len$1, Bits$e);
        return $1226;
    };
    const Bits$chunks_of = x0 => x1 => Bits$chunks_of$(x0, x1);

    function Function$flip$(_f$4, _y$5, _x$6) {
        var $1227 = _f$4(_x$6)(_y$5);
        return $1227;
    };
    const Function$flip = x0 => x1 => x2 => Function$flip$(x0, x1, x2);
    const Nat$eql = a0 => a1 => (a0 === a1);

    function Hex$to_hex_string$(_x$1) {
        var self = (Bits$to_nat$(_x$1) === 0n);
        if (self) {
            var $1229 = "0";
            var $1228 = $1229;
        } else {
            var self = (Bits$to_nat$(_x$1) === 1n);
            if (self) {
                var $1231 = "1";
                var $1230 = $1231;
            } else {
                var self = (Bits$to_nat$(_x$1) === 2n);
                if (self) {
                    var $1233 = "2";
                    var $1232 = $1233;
                } else {
                    var self = (Bits$to_nat$(_x$1) === 3n);
                    if (self) {
                        var $1235 = "3";
                        var $1234 = $1235;
                    } else {
                        var self = (Bits$to_nat$(_x$1) === 4n);
                        if (self) {
                            var $1237 = "4";
                            var $1236 = $1237;
                        } else {
                            var self = (Bits$to_nat$(_x$1) === 5n);
                            if (self) {
                                var $1239 = "5";
                                var $1238 = $1239;
                            } else {
                                var self = (Bits$to_nat$(_x$1) === 6n);
                                if (self) {
                                    var $1241 = "6";
                                    var $1240 = $1241;
                                } else {
                                    var self = (Bits$to_nat$(_x$1) === 7n);
                                    if (self) {
                                        var $1243 = "7";
                                        var $1242 = $1243;
                                    } else {
                                        var self = (Bits$to_nat$(_x$1) === 8n);
                                        if (self) {
                                            var $1245 = "8";
                                            var $1244 = $1245;
                                        } else {
                                            var self = (Bits$to_nat$(_x$1) === 9n);
                                            if (self) {
                                                var $1247 = "9";
                                                var $1246 = $1247;
                                            } else {
                                                var self = (Bits$to_nat$(_x$1) === 10n);
                                                if (self) {
                                                    var $1249 = "a";
                                                    var $1248 = $1249;
                                                } else {
                                                    var self = (Bits$to_nat$(_x$1) === 11n);
                                                    if (self) {
                                                        var $1251 = "b";
                                                        var $1250 = $1251;
                                                    } else {
                                                        var self = (Bits$to_nat$(_x$1) === 12n);
                                                        if (self) {
                                                            var $1253 = "c";
                                                            var $1252 = $1253;
                                                        } else {
                                                            var self = (Bits$to_nat$(_x$1) === 13n);
                                                            if (self) {
                                                                var $1255 = "d";
                                                                var $1254 = $1255;
                                                            } else {
                                                                var self = (Bits$to_nat$(_x$1) === 14n);
                                                                if (self) {
                                                                    var $1257 = "e";
                                                                    var $1256 = $1257;
                                                                } else {
                                                                    var self = (Bits$to_nat$(_x$1) === 15n);
                                                                    if (self) {
                                                                        var $1259 = "f";
                                                                        var $1258 = $1259;
                                                                    } else {
                                                                        var $1260 = "?";
                                                                        var $1258 = $1260;
                                                                    };
                                                                    var $1256 = $1258;
                                                                };
                                                                var $1254 = $1256;
                                                            };
                                                            var $1252 = $1254;
                                                        };
                                                        var $1250 = $1252;
                                                    };
                                                    var $1248 = $1250;
                                                };
                                                var $1246 = $1248;
                                            };
                                            var $1244 = $1246;
                                        };
                                        var $1242 = $1244;
                                    };
                                    var $1240 = $1242;
                                };
                                var $1238 = $1240;
                            };
                            var $1236 = $1238;
                        };
                        var $1234 = $1236;
                    };
                    var $1232 = $1234;
                };
                var $1230 = $1232;
            };
            var $1228 = $1230;
        };
        return $1228;
    };
    const Hex$to_hex_string = x0 => Hex$to_hex_string$(x0);

    function Bits$to_hex_string$(_x$1) {
        var _ls$2 = Bits$chunks_of$(4n, _x$1);
        var $1261 = List$foldr$("", (_x$3 => {
            var $1262 = Function$flip(String$concat)(Hex$to_hex_string$(_x$3));
            return $1262;
        }), _ls$2);
        return $1261;
    };
    const Bits$to_hex_string = x0 => Bits$to_hex_string$(x0);

    function Hex$append$(_hex$1, _size$2, _x$3) {
        var _hex2$4 = Hex$format_hex$(_size$2, Bits$to_hex_string$(_x$3));
        var $1263 = (_hex$1 + _hex2$4);
        return $1263;
    };
    const Hex$append = x0 => x1 => x2 => Hex$append$(x0, x1, x2);

    function Web$Kaelin$Event$Code$generate_hex$(_xs$1) {
        var $1264 = List$foldr$("", (_x$2 => _y$3 => {
            var $1265 = Hex$append$(_y$3, (BigInt(Pair$fst$(_x$2))), Pair$snd$(_x$2));
            return $1265;
        }), List$reverse$(_xs$1));
        return $1264;
    };
    const Web$Kaelin$Event$Code$generate_hex = x0 => Web$Kaelin$Event$Code$generate_hex$(x0);

    function generate_hex$(_xs$1, _ys$2) {
        var _consumer$3 = List$zip$(List$concat$(Web$Kaelin$Event$Code$action, _xs$1), _ys$2);
        var $1266 = ("0x" + Hex$set_min_length$(64n, Web$Kaelin$Event$Code$generate_hex$(_consumer$3)));
        return $1266;
    };
    const generate_hex = x0 => x1 => generate_hex$(x0, x1);
    const Web$Kaelin$Event$Code$create_hero = List$cons$(2, List$nil);

    function Parser$State$new$(_err$1, _nam$2, _ini$3, _idx$4, _str$5) {
        var $1267 = ({
            _: 'Parser.State.new',
            'err': _err$1,
            'nam': _nam$2,
            'ini': _ini$3,
            'idx': _idx$4,
            'str': _str$5
        });
        return $1267;
    };
    const Parser$State$new = x0 => x1 => x2 => x3 => x4 => Parser$State$new$(x0, x1, x2, x3, x4);

    function Parser$run$(_parser$2, _code$3) {
        var self = _parser$2(Parser$State$new$(Maybe$none, "", 0n, 0n, _code$3));
        switch (self._) {
            case 'Parser.Reply.value':
                var $1269 = self.val;
                var $1270 = Maybe$some$($1269);
                var $1268 = $1270;
                break;
            case 'Parser.Reply.error':
                var $1271 = Maybe$none;
                var $1268 = $1271;
                break;
        };
        return $1268;
    };
    const Parser$run = x0 => x1 => Parser$run$(x0, x1);

    function Parser$Reply$(_V$1) {
        var $1272 = null;
        return $1272;
    };
    const Parser$Reply = x0 => Parser$Reply$(x0);

    function Parser$Reply$value$(_pst$2, _val$3) {
        var $1273 = ({
            _: 'Parser.Reply.value',
            'pst': _pst$2,
            'val': _val$3
        });
        return $1273;
    };
    const Parser$Reply$value = x0 => x1 => Parser$Reply$value$(x0, x1);

    function Parser$maybe$(_parse$2, _pst$3) {
        var self = _pst$3;
        switch (self._) {
            case 'Parser.State.new':
                var self = _parse$2(_pst$3);
                switch (self._) {
                    case 'Parser.Reply.value':
                        var $1276 = self.pst;
                        var $1277 = self.val;
                        var $1278 = Parser$Reply$value$($1276, Maybe$some$($1277));
                        var $1275 = $1278;
                        break;
                    case 'Parser.Reply.error':
                        var $1279 = Parser$Reply$value$(_pst$3, Maybe$none);
                        var $1275 = $1279;
                        break;
                };
                var $1274 = $1275;
                break;
        };
        return $1274;
    };
    const Parser$maybe = x0 => x1 => Parser$maybe$(x0, x1);

    function Parser$Reply$error$(_err$2) {
        var $1280 = ({
            _: 'Parser.Reply.error',
            'err': _err$2
        });
        return $1280;
    };
    const Parser$Reply$error = x0 => Parser$Reply$error$(x0);

    function Parser$Error$new$(_nam$1, _ini$2, _idx$3, _msg$4) {
        var $1281 = ({
            _: 'Parser.Error.new',
            'nam': _nam$1,
            'ini': _ini$2,
            'idx': _idx$3,
            'msg': _msg$4
        });
        return $1281;
    };
    const Parser$Error$new = x0 => x1 => x2 => x3 => Parser$Error$new$(x0, x1, x2, x3);

    function Parser$Reply$fail$(_nam$2, _ini$3, _idx$4, _msg$5) {
        var $1282 = Parser$Reply$error$(Parser$Error$new$(_nam$2, _ini$3, _idx$4, _msg$5));
        return $1282;
    };
    const Parser$Reply$fail = x0 => x1 => x2 => x3 => Parser$Reply$fail$(x0, x1, x2, x3);

    function Parser$text$go$(_ini_idx$1, _ini_txt$2, _text$3, _pst$4) {
        var Parser$text$go$ = (_ini_idx$1, _ini_txt$2, _text$3, _pst$4) => ({
            ctr: 'TCO',
            arg: [_ini_idx$1, _ini_txt$2, _text$3, _pst$4]
        });
        var Parser$text$go = _ini_idx$1 => _ini_txt$2 => _text$3 => _pst$4 => Parser$text$go$(_ini_idx$1, _ini_txt$2, _text$3, _pst$4);
        var arg = [_ini_idx$1, _ini_txt$2, _text$3, _pst$4];
        while (true) {
            let [_ini_idx$1, _ini_txt$2, _text$3, _pst$4] = arg;
            var R = (() => {
                var self = _pst$4;
                switch (self._) {
                    case 'Parser.State.new':
                        var $1283 = self.err;
                        var $1284 = self.nam;
                        var $1285 = self.ini;
                        var $1286 = self.idx;
                        var $1287 = self.str;
                        var self = _text$3;
                        if (self.length === 0) {
                            var $1289 = Parser$Reply$value$(_pst$4, Unit$new);
                            var $1288 = $1289;
                        } else {
                            var $1290 = self.charCodeAt(0);
                            var $1291 = self.slice(1);
                            var self = $1287;
                            if (self.length === 0) {
                                var _error_msg$12 = ("Expected \'" + (_ini_txt$2 + "\', found end of file."));
                                var $1293 = Parser$Reply$fail$($1284, $1285, _ini_idx$1, _error_msg$12);
                                var $1292 = $1293;
                            } else {
                                var $1294 = self.charCodeAt(0);
                                var $1295 = self.slice(1);
                                var self = ($1290 === $1294);
                                if (self) {
                                    var _pst$14 = Parser$State$new$($1283, $1284, $1285, Nat$succ$($1286), $1295);
                                    var $1297 = Parser$text$go$(_ini_idx$1, _ini_txt$2, $1291, _pst$14);
                                    var $1296 = $1297;
                                } else {
                                    var _chr$14 = String$cons$($1294, String$nil);
                                    var _err$15 = ("Expected \'" + (_ini_txt$2 + ("\', found \'" + (_chr$14 + "\'."))));
                                    var $1298 = Parser$Reply$fail$($1284, $1285, _ini_idx$1, _err$15);
                                    var $1296 = $1298;
                                };
                                var $1292 = $1296;
                            };
                            var $1288 = $1292;
                        };
                        return $1288;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Parser$text$go = x0 => x1 => x2 => x3 => Parser$text$go$(x0, x1, x2, x3);

    function Parser$text$(_text$1, _pst$2) {
        var self = _pst$2;
        switch (self._) {
            case 'Parser.State.new':
                var $1300 = self.idx;
                var self = Parser$text$go$($1300, _text$1, _text$1, _pst$2);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $1302 = self.err;
                        var $1303 = Parser$Reply$error$($1302);
                        var $1301 = $1303;
                        break;
                    case 'Parser.Reply.value':
                        var $1304 = self.pst;
                        var $1305 = self.val;
                        var $1306 = Parser$Reply$value$($1304, $1305);
                        var $1301 = $1306;
                        break;
                };
                var $1299 = $1301;
                break;
        };
        return $1299;
    };
    const Parser$text = x0 => x1 => Parser$text$(x0, x1);

    function Parser$Error$combine$(_a$1, _b$2) {
        var self = _a$1;
        switch (self._) {
            case 'Parser.Error.new':
                var $1308 = self.idx;
                var self = _b$2;
                switch (self._) {
                    case 'Parser.Error.new':
                        var $1310 = self.idx;
                        var self = ($1308 > $1310);
                        if (self) {
                            var $1312 = _a$1;
                            var $1311 = $1312;
                        } else {
                            var $1313 = _b$2;
                            var $1311 = $1313;
                        };
                        var $1309 = $1311;
                        break;
                };
                var $1307 = $1309;
                break;
        };
        return $1307;
    };
    const Parser$Error$combine = x0 => x1 => Parser$Error$combine$(x0, x1);

    function Parser$Error$maybe_combine$(_a$1, _b$2) {
        var self = _a$1;
        switch (self._) {
            case 'Maybe.some':
                var $1315 = self.value;
                var self = _b$2;
                switch (self._) {
                    case 'Maybe.some':
                        var $1317 = self.value;
                        var $1318 = Maybe$some$(Parser$Error$combine$($1315, $1317));
                        var $1316 = $1318;
                        break;
                    case 'Maybe.none':
                        var $1319 = _a$1;
                        var $1316 = $1319;
                        break;
                };
                var $1314 = $1316;
                break;
            case 'Maybe.none':
                var self = _b$2;
                switch (self._) {
                    case 'Maybe.none':
                        var $1321 = Maybe$none;
                        var $1320 = $1321;
                        break;
                    case 'Maybe.some':
                        var $1322 = _b$2;
                        var $1320 = $1322;
                        break;
                };
                var $1314 = $1320;
                break;
        };
        return $1314;
    };
    const Parser$Error$maybe_combine = x0 => x1 => Parser$Error$maybe_combine$(x0, x1);

    function Parser$many$go$(_parse$2, _values$3, _pst$4) {
        var Parser$many$go$ = (_parse$2, _values$3, _pst$4) => ({
            ctr: 'TCO',
            arg: [_parse$2, _values$3, _pst$4]
        });
        var Parser$many$go = _parse$2 => _values$3 => _pst$4 => Parser$many$go$(_parse$2, _values$3, _pst$4);
        var arg = [_parse$2, _values$3, _pst$4];
        while (true) {
            let [_parse$2, _values$3, _pst$4] = arg;
            var R = (() => {
                var self = _pst$4;
                switch (self._) {
                    case 'Parser.State.new':
                        var self = _parse$2(_pst$4);
                        switch (self._) {
                            case 'Parser.Reply.value':
                                var $1324 = self.pst;
                                var $1325 = self.val;
                                var $1326 = Parser$many$go$(_parse$2, (_xs$12 => {
                                    var $1327 = _values$3(List$cons$($1325, _xs$12));
                                    return $1327;
                                }), $1324);
                                var $1323 = $1326;
                                break;
                            case 'Parser.Reply.error':
                                var $1328 = Parser$Reply$value$(_pst$4, _values$3(List$nil));
                                var $1323 = $1328;
                                break;
                        };
                        return $1323;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Parser$many$go = x0 => x1 => x2 => Parser$many$go$(x0, x1, x2);

    function Parser$many$(_parser$2) {
        var $1329 = Parser$many$go(_parser$2)((_x$3 => {
            var $1330 = _x$3;
            return $1330;
        }));
        return $1329;
    };
    const Parser$many = x0 => Parser$many$(x0);

    function Parser$many1$(_parser$2, _pst$3) {
        var self = _pst$3;
        switch (self._) {
            case 'Parser.State.new':
                var $1332 = self.err;
                var _reply$9 = _parser$2(_pst$3);
                var self = _reply$9;
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $1334 = self.err;
                        var self = $1332;
                        switch (self._) {
                            case 'Maybe.some':
                                var $1336 = self.value;
                                var $1337 = Parser$Reply$error$(Parser$Error$combine$($1336, $1334));
                                var $1335 = $1337;
                                break;
                            case 'Maybe.none':
                                var $1338 = Parser$Reply$error$($1334);
                                var $1335 = $1338;
                                break;
                        };
                        var $1333 = $1335;
                        break;
                    case 'Parser.Reply.value':
                        var $1339 = self.pst;
                        var $1340 = self.val;
                        var self = $1339;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $1342 = self.err;
                                var $1343 = self.nam;
                                var $1344 = self.ini;
                                var $1345 = self.idx;
                                var $1346 = self.str;
                                var _reply$pst$17 = Parser$State$new$(Parser$Error$maybe_combine$($1332, $1342), $1343, $1344, $1345, $1346);
                                var self = _reply$pst$17;
                                switch (self._) {
                                    case 'Parser.State.new':
                                        var $1348 = self.err;
                                        var _reply$23 = Parser$many$(_parser$2)(_reply$pst$17);
                                        var self = _reply$23;
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $1350 = self.err;
                                                var self = $1348;
                                                switch (self._) {
                                                    case 'Maybe.some':
                                                        var $1352 = self.value;
                                                        var $1353 = Parser$Reply$error$(Parser$Error$combine$($1352, $1350));
                                                        var $1351 = $1353;
                                                        break;
                                                    case 'Maybe.none':
                                                        var $1354 = Parser$Reply$error$($1350);
                                                        var $1351 = $1354;
                                                        break;
                                                };
                                                var $1349 = $1351;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $1355 = self.pst;
                                                var $1356 = self.val;
                                                var self = $1355;
                                                switch (self._) {
                                                    case 'Parser.State.new':
                                                        var $1358 = self.err;
                                                        var $1359 = self.nam;
                                                        var $1360 = self.ini;
                                                        var $1361 = self.idx;
                                                        var $1362 = self.str;
                                                        var _reply$pst$31 = Parser$State$new$(Parser$Error$maybe_combine$($1348, $1358), $1359, $1360, $1361, $1362);
                                                        var $1363 = Parser$Reply$value$(_reply$pst$31, List$cons$($1340, $1356));
                                                        var $1357 = $1363;
                                                        break;
                                                };
                                                var $1349 = $1357;
                                                break;
                                        };
                                        var $1347 = $1349;
                                        break;
                                };
                                var $1341 = $1347;
                                break;
                        };
                        var $1333 = $1341;
                        break;
                };
                var $1331 = $1333;
                break;
        };
        return $1331;
    };
    const Parser$many1 = x0 => x1 => Parser$many1$(x0, x1);

    function Parser$hex_digit$(_pst$1) {
        var self = _pst$1;
        switch (self._) {
            case 'Parser.State.new':
                var $1365 = self.err;
                var $1366 = self.nam;
                var $1367 = self.ini;
                var $1368 = self.idx;
                var $1369 = self.str;
                var self = $1369;
                if (self.length === 0) {
                    var $1371 = Parser$Reply$fail$($1366, $1367, $1368, "Not a digit.");
                    var $1370 = $1371;
                } else {
                    var $1372 = self.charCodeAt(0);
                    var $1373 = self.slice(1);
                    var _pst$9 = Parser$State$new$($1365, $1366, $1367, Nat$succ$($1368), $1373);
                    var self = ($1372 === 48);
                    if (self) {
                        var $1375 = Parser$Reply$value$(_pst$9, 0n);
                        var $1374 = $1375;
                    } else {
                        var self = ($1372 === 49);
                        if (self) {
                            var $1377 = Parser$Reply$value$(_pst$9, 1n);
                            var $1376 = $1377;
                        } else {
                            var self = ($1372 === 50);
                            if (self) {
                                var $1379 = Parser$Reply$value$(_pst$9, 2n);
                                var $1378 = $1379;
                            } else {
                                var self = ($1372 === 51);
                                if (self) {
                                    var $1381 = Parser$Reply$value$(_pst$9, 3n);
                                    var $1380 = $1381;
                                } else {
                                    var self = ($1372 === 52);
                                    if (self) {
                                        var $1383 = Parser$Reply$value$(_pst$9, 4n);
                                        var $1382 = $1383;
                                    } else {
                                        var self = ($1372 === 53);
                                        if (self) {
                                            var $1385 = Parser$Reply$value$(_pst$9, 5n);
                                            var $1384 = $1385;
                                        } else {
                                            var self = ($1372 === 54);
                                            if (self) {
                                                var $1387 = Parser$Reply$value$(_pst$9, 6n);
                                                var $1386 = $1387;
                                            } else {
                                                var self = ($1372 === 55);
                                                if (self) {
                                                    var $1389 = Parser$Reply$value$(_pst$9, 7n);
                                                    var $1388 = $1389;
                                                } else {
                                                    var self = ($1372 === 56);
                                                    if (self) {
                                                        var $1391 = Parser$Reply$value$(_pst$9, 8n);
                                                        var $1390 = $1391;
                                                    } else {
                                                        var self = ($1372 === 57);
                                                        if (self) {
                                                            var $1393 = Parser$Reply$value$(_pst$9, 9n);
                                                            var $1392 = $1393;
                                                        } else {
                                                            var self = ($1372 === 97);
                                                            if (self) {
                                                                var $1395 = Parser$Reply$value$(_pst$9, 10n);
                                                                var $1394 = $1395;
                                                            } else {
                                                                var self = ($1372 === 98);
                                                                if (self) {
                                                                    var $1397 = Parser$Reply$value$(_pst$9, 11n);
                                                                    var $1396 = $1397;
                                                                } else {
                                                                    var self = ($1372 === 99);
                                                                    if (self) {
                                                                        var $1399 = Parser$Reply$value$(_pst$9, 12n);
                                                                        var $1398 = $1399;
                                                                    } else {
                                                                        var self = ($1372 === 100);
                                                                        if (self) {
                                                                            var $1401 = Parser$Reply$value$(_pst$9, 13n);
                                                                            var $1400 = $1401;
                                                                        } else {
                                                                            var self = ($1372 === 101);
                                                                            if (self) {
                                                                                var $1403 = Parser$Reply$value$(_pst$9, 14n);
                                                                                var $1402 = $1403;
                                                                            } else {
                                                                                var self = ($1372 === 102);
                                                                                if (self) {
                                                                                    var $1405 = Parser$Reply$value$(_pst$9, 15n);
                                                                                    var $1404 = $1405;
                                                                                } else {
                                                                                    var self = ($1372 === 65);
                                                                                    if (self) {
                                                                                        var $1407 = Parser$Reply$value$(_pst$9, 10n);
                                                                                        var $1406 = $1407;
                                                                                    } else {
                                                                                        var self = ($1372 === 66);
                                                                                        if (self) {
                                                                                            var $1409 = Parser$Reply$value$(_pst$9, 11n);
                                                                                            var $1408 = $1409;
                                                                                        } else {
                                                                                            var self = ($1372 === 67);
                                                                                            if (self) {
                                                                                                var $1411 = Parser$Reply$value$(_pst$9, 12n);
                                                                                                var $1410 = $1411;
                                                                                            } else {
                                                                                                var self = ($1372 === 68);
                                                                                                if (self) {
                                                                                                    var $1413 = Parser$Reply$value$(_pst$9, 13n);
                                                                                                    var $1412 = $1413;
                                                                                                } else {
                                                                                                    var self = ($1372 === 69);
                                                                                                    if (self) {
                                                                                                        var $1415 = Parser$Reply$value$(_pst$9, 14n);
                                                                                                        var $1414 = $1415;
                                                                                                    } else {
                                                                                                        var self = ($1372 === 70);
                                                                                                        if (self) {
                                                                                                            var $1417 = Parser$Reply$value$(_pst$9, 15n);
                                                                                                            var $1416 = $1417;
                                                                                                        } else {
                                                                                                            var $1418 = Parser$Reply$fail$($1366, $1367, $1368, "Not a digit.");
                                                                                                            var $1416 = $1418;
                                                                                                        };
                                                                                                        var $1414 = $1416;
                                                                                                    };
                                                                                                    var $1412 = $1414;
                                                                                                };
                                                                                                var $1410 = $1412;
                                                                                            };
                                                                                            var $1408 = $1410;
                                                                                        };
                                                                                        var $1406 = $1408;
                                                                                    };
                                                                                    var $1404 = $1406;
                                                                                };
                                                                                var $1402 = $1404;
                                                                            };
                                                                            var $1400 = $1402;
                                                                        };
                                                                        var $1398 = $1400;
                                                                    };
                                                                    var $1396 = $1398;
                                                                };
                                                                var $1394 = $1396;
                                                            };
                                                            var $1392 = $1394;
                                                        };
                                                        var $1390 = $1392;
                                                    };
                                                    var $1388 = $1390;
                                                };
                                                var $1386 = $1388;
                                            };
                                            var $1384 = $1386;
                                        };
                                        var $1382 = $1384;
                                    };
                                    var $1380 = $1382;
                                };
                                var $1378 = $1380;
                            };
                            var $1376 = $1378;
                        };
                        var $1374 = $1376;
                    };
                    var $1370 = $1374;
                };
                var $1364 = $1370;
                break;
        };
        return $1364;
    };
    const Parser$hex_digit = x0 => Parser$hex_digit$(x0);

    function Nat$from_base$go$(_b$1, _ds$2, _p$3, _res$4) {
        var Nat$from_base$go$ = (_b$1, _ds$2, _p$3, _res$4) => ({
            ctr: 'TCO',
            arg: [_b$1, _ds$2, _p$3, _res$4]
        });
        var Nat$from_base$go = _b$1 => _ds$2 => _p$3 => _res$4 => Nat$from_base$go$(_b$1, _ds$2, _p$3, _res$4);
        var arg = [_b$1, _ds$2, _p$3, _res$4];
        while (true) {
            let [_b$1, _ds$2, _p$3, _res$4] = arg;
            var R = (() => {
                var self = _ds$2;
                switch (self._) {
                    case 'List.cons':
                        var $1419 = self.head;
                        var $1420 = self.tail;
                        var $1421 = Nat$from_base$go$(_b$1, $1420, (_b$1 * _p$3), (($1419 * _p$3) + _res$4));
                        return $1421;
                    case 'List.nil':
                        var $1422 = _res$4;
                        return $1422;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Nat$from_base$go = x0 => x1 => x2 => x3 => Nat$from_base$go$(x0, x1, x2, x3);

    function Nat$from_base$(_base$1, _ds$2) {
        var $1423 = Nat$from_base$go$(_base$1, List$reverse$(_ds$2), 1n, 0n);
        return $1423;
    };
    const Nat$from_base = x0 => x1 => Nat$from_base$(x0, x1);

    function Parser$hex_nat$(_pst$1) {
        var self = _pst$1;
        switch (self._) {
            case 'Parser.State.new':
                var $1425 = self.err;
                var _reply$7 = Parser$maybe$(Parser$text("0x"), _pst$1);
                var self = _reply$7;
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $1427 = self.err;
                        var self = $1425;
                        switch (self._) {
                            case 'Maybe.some':
                                var $1429 = self.value;
                                var $1430 = Parser$Reply$error$(Parser$Error$combine$($1429, $1427));
                                var $1428 = $1430;
                                break;
                            case 'Maybe.none':
                                var $1431 = Parser$Reply$error$($1427);
                                var $1428 = $1431;
                                break;
                        };
                        var $1426 = $1428;
                        break;
                    case 'Parser.Reply.value':
                        var $1432 = self.pst;
                        var self = $1432;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $1434 = self.err;
                                var $1435 = self.nam;
                                var $1436 = self.ini;
                                var $1437 = self.idx;
                                var $1438 = self.str;
                                var _reply$pst$15 = Parser$State$new$(Parser$Error$maybe_combine$($1425, $1434), $1435, $1436, $1437, $1438);
                                var self = _reply$pst$15;
                                switch (self._) {
                                    case 'Parser.State.new':
                                        var $1440 = self.err;
                                        var _reply$21 = Parser$many1$(Parser$hex_digit, _reply$pst$15);
                                        var self = _reply$21;
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $1442 = self.err;
                                                var self = $1440;
                                                switch (self._) {
                                                    case 'Maybe.some':
                                                        var $1444 = self.value;
                                                        var $1445 = Parser$Reply$error$(Parser$Error$combine$($1444, $1442));
                                                        var $1443 = $1445;
                                                        break;
                                                    case 'Maybe.none':
                                                        var $1446 = Parser$Reply$error$($1442);
                                                        var $1443 = $1446;
                                                        break;
                                                };
                                                var $1441 = $1443;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $1447 = self.pst;
                                                var $1448 = self.val;
                                                var self = $1447;
                                                switch (self._) {
                                                    case 'Parser.State.new':
                                                        var $1450 = self.err;
                                                        var $1451 = self.nam;
                                                        var $1452 = self.ini;
                                                        var $1453 = self.idx;
                                                        var $1454 = self.str;
                                                        var _reply$pst$29 = Parser$State$new$(Parser$Error$maybe_combine$($1440, $1450), $1451, $1452, $1453, $1454);
                                                        var $1455 = Parser$Reply$value$(_reply$pst$29, Nat$from_base$(16n, $1448));
                                                        var $1449 = $1455;
                                                        break;
                                                };
                                                var $1441 = $1449;
                                                break;
                                        };
                                        var $1439 = $1441;
                                        break;
                                };
                                var $1433 = $1439;
                                break;
                        };
                        var $1426 = $1433;
                        break;
                };
                var $1424 = $1426;
                break;
        };
        return $1424;
    };
    const Parser$hex_nat = x0 => Parser$hex_nat$(x0);

    function Hex$to_nat$(_x$1) {
        var self = Parser$run$(Parser$hex_nat, _x$1);
        switch (self._) {
            case 'Maybe.some':
                var $1457 = self.value;
                var $1458 = $1457;
                var $1456 = $1458;
                break;
            case 'Maybe.none':
                var $1459 = 0n;
                var $1456 = $1459;
                break;
        };
        return $1456;
    };
    const Hex$to_nat = x0 => Hex$to_nat$(x0);

    function Web$Kaelin$Resources$Action$to_bits$(_x$1) {
        var self = _x$1;
        switch (self._) {
            case 'Web.Kaelin.Action.walk':
                var $1461 = 0n;
                var _n$2 = $1461;
                break;
            case 'Web.Kaelin.Action.ability_0':
                var $1462 = 1n;
                var _n$2 = $1462;
                break;
            case 'Web.Kaelin.Action.ability_1':
                var $1463 = 2n;
                var _n$2 = $1463;
                break;
        };
        var $1460 = (nat_to_bits(_n$2));
        return $1460;
    };
    const Web$Kaelin$Resources$Action$to_bits = x0 => Web$Kaelin$Resources$Action$to_bits$(x0);

    function Web$Kaelin$Coord$Convert$axial_to_bits$(_x$1) {
        var _unique_nat$2 = Web$Kaelin$Coord$Convert$axial_to_nat$(_x$1);
        var $1464 = (nat_to_bits(_unique_nat$2));
        return $1464;
    };
    const Web$Kaelin$Coord$Convert$axial_to_bits = x0 => Web$Kaelin$Coord$Convert$axial_to_bits$(x0);
    const Web$Kaelin$Event$Code$user_input = List$cons$(40, List$cons$(2, List$cons$(8, List$nil)));

    function Web$Kaelin$Event$serialize$(_event$1) {
        var self = _event$1;
        switch (self._) {
            case 'Web.Kaelin.Event.create_hero':
                var $1466 = self.hero_id;
                var _cod$3 = List$cons$((nat_to_bits(1n)), List$cons$((nat_to_bits((BigInt($1466)))), List$nil));
                var $1467 = generate_hex$(Web$Kaelin$Event$Code$create_hero, _cod$3);
                var $1465 = $1467;
                break;
            case 'Web.Kaelin.Event.user_input':
                var $1468 = self.player;
                var $1469 = self.coord;
                var $1470 = self.action;
                var _cod$5 = List$cons$((nat_to_bits(4n)), List$cons$((nat_to_bits(Hex$to_nat$($1468))), List$cons$(Web$Kaelin$Resources$Action$to_bits$($1470), List$cons$(Web$Kaelin$Coord$Convert$axial_to_bits$($1469), List$nil))));
                var $1471 = generate_hex$(Web$Kaelin$Event$Code$user_input, _cod$5);
                var $1465 = $1471;
                break;
            case 'Web.Kaelin.Event.start_game':
            case 'Web.Kaelin.Event.create_user':
                var $1472 = "";
                var $1465 = $1472;
                break;
        };
        return $1465;
    };
    const Web$Kaelin$Event$serialize = x0 => Web$Kaelin$Event$serialize$(x0);

    function Web$Kaelin$Event$user_input$(_player$1, _coord$2, _action$3) {
        var $1473 = ({
            _: 'Web.Kaelin.Event.user_input',
            'player': _player$1,
            'coord': _coord$2,
            'action': _action$3
        });
        return $1473;
    };
    const Web$Kaelin$Event$user_input = x0 => x1 => x2 => Web$Kaelin$Event$user_input$(x0, x1, x2);
    const Web$Kaelin$Action$walk = ({
        _: 'Web.Kaelin.Action.walk'
    });

    function App$post$(_room$1, _data$2) {
        var $1474 = App$do$("post", (_room$1 + (";" + _data$2)));
        return $1474;
    };
    const App$post = x0 => x1 => App$post$(x0, x1);
    const Debug$log = a0 => a1 => ((console.log(a0), a1()));

    function Web$Kaelin$Player$new$(_addr$1) {
        var $1475 = ({
            _: 'Web.Kaelin.Player.new',
            'addr': _addr$1
        });
        return $1475;
    };
    const Web$Kaelin$Player$new = x0 => Web$Kaelin$Player$new$(x0);

    function Web$Kaelin$Action$create_player$(_user$1, _hero$2, _state$3) {
        var _key$4 = _user$1;
        var _init_pos$5 = Web$Kaelin$Coord$new$(0, 0);
        var self = _state$3;
        switch (self._) {
            case 'Web.Kaelin.State.game':
                var $1477 = self.user;
                var $1478 = self.room;
                var $1479 = self.players;
                var $1480 = self.cast_info;
                var $1481 = self.map;
                var $1482 = self.internal;
                var $1483 = self.env_info;
                var self = Map$get$(_key$4, $1479);
                switch (self._) {
                    case 'Maybe.none':
                        var $1485 = ((console.log($1477), (_$13 => {
                            var self = _hero$2;
                            switch (self._) {
                                case 'Web.Kaelin.Hero.new':
                                    var $1487 = self.name;
                                    var _creature$18 = Web$Kaelin$Tile$creature$create;
                                    var _new_player$19 = Web$Kaelin$Player$new$(_user$1);
                                    var _new_creature$20 = _creature$18($1487)(Maybe$some$(_user$1))("blue");
                                    var _entity$21 = Web$Kaelin$Map$Entity$creature$(_new_creature$20);
                                    var _map$22 = Web$Kaelin$Map$push$(_init_pos$5, _entity$21, $1481);
                                    var _new_players$23 = Map$set$(_key$4, _new_player$19, $1479);
                                    var $1488 = Web$Kaelin$State$game$($1477, $1478, _new_players$23, $1480, _map$22, $1482, $1483);
                                    var $1486 = $1488;
                                    break;
                            };
                            return $1486;
                        })()));
                        var $1484 = $1485;
                        break;
                    case 'Maybe.some':
                        var $1489 = _state$3;
                        var $1484 = $1489;
                        break;
                };
                var $1476 = $1484;
                break;
            case 'Web.Kaelin.State.init':
            case 'Web.Kaelin.State.void':
                var $1490 = _state$3;
                var $1476 = $1490;
                break;
        };
        return $1476;
    };
    const Web$Kaelin$Action$create_player = x0 => x1 => x2 => Web$Kaelin$Action$create_player$(x0, x1, x2);

    function Maybe$bind$(_m$3, _f$4) {
        var self = _m$3;
        switch (self._) {
            case 'Maybe.some':
                var $1492 = self.value;
                var $1493 = _f$4($1492);
                var $1491 = $1493;
                break;
            case 'Maybe.none':
                var $1494 = Maybe$none;
                var $1491 = $1494;
                break;
        };
        return $1491;
    };
    const Maybe$bind = x0 => x1 => Maybe$bind$(x0, x1);

    function Maybe$monad$(_new$2) {
        var $1495 = _new$2(Maybe$bind)(Maybe$some);
        return $1495;
    };
    const Maybe$monad = x0 => Maybe$monad$(x0);

    function Web$Kaelin$Map$find_players$(_map$1) {
        var _lmap$2 = NatMap$to_list$(_map$1);
        var _players$3 = List$nil;
        var _players$4 = (() => {
            var $1498 = _players$3;
            var $1499 = _lmap$2;
            let _players$5 = $1498;
            let _pair$4;
            while ($1499._ === 'List.cons') {
                _pair$4 = $1499.head;
                var _coord$6 = Pair$fst$(_pair$4);
                var _tile$7 = Pair$snd$(_pair$4);
                var self = _tile$7;
                switch (self._) {
                    case 'Web.Kaelin.Tile.new':
                        var $1500 = self.creature;
                        var self = $1500;
                        switch (self._) {
                            case 'Maybe.some':
                                var $1502 = self.value;
                                var _axial_coord$11 = Web$Kaelin$Coord$Convert$nat_to_axial$(_coord$6);
                                var self = $1502;
                                switch (self._) {
                                    case 'Web.Kaelin.Creature.new':
                                        var $1504 = self.player;
                                        var self = $1504;
                                        switch (self._) {
                                            case 'Maybe.some':
                                                var $1506 = self.value;
                                                var $1507 = List$concat$(_players$5, List$cons$(Pair$new$($1506, _axial_coord$11), List$nil));
                                                var $1505 = $1507;
                                                break;
                                            case 'Maybe.none':
                                                var $1508 = _players$5;
                                                var $1505 = $1508;
                                                break;
                                        };
                                        var $1503 = $1505;
                                        break;
                                };
                                var $1501 = $1503;
                                break;
                            case 'Maybe.none':
                                var $1509 = _players$5;
                                var $1501 = $1509;
                                break;
                        };
                        var $1498 = $1501;
                        break;
                };
                _players$5 = $1498;
                $1499 = $1499.tail;
            }
            return _players$5;
        })();
        var $1496 = Map$from_list$(_players$4);
        return $1496;
    };
    const Web$Kaelin$Map$find_players = x0 => Web$Kaelin$Map$find_players$(x0);

    function Web$Kaelin$Map$player$to_coord$(_address$1, _map$2) {
        var _players$3 = Web$Kaelin$Map$find_players$(_map$2);
        var $1510 = Map$get$(_address$1, _players$3);
        return $1510;
    };
    const Web$Kaelin$Map$player$to_coord = x0 => x1 => Web$Kaelin$Map$player$to_coord$(x0, x1);

    function Web$Kaelin$Map$player$info$(_address$1, _map$2) {
        var $1511 = Maybe$monad$((_m$bind$3 => _m$pure$4 => {
            var $1512 = _m$bind$3;
            return $1512;
        }))(Web$Kaelin$Map$player$to_coord$(_address$1, _map$2))((_coord$3 => {
            var $1513 = Maybe$monad$((_m$bind$4 => _m$pure$5 => {
                var $1514 = _m$bind$4;
                return $1514;
            }))(Web$Kaelin$Map$get$(_coord$3, _map$2))((_tile$4 => {
                var $1515 = Maybe$monad$((_m$bind$5 => _m$pure$6 => {
                    var $1516 = _m$bind$5;
                    return $1516;
                }))((() => {
                    var self = _tile$4;
                    switch (self._) {
                        case 'Web.Kaelin.Tile.new':
                            var $1517 = self.creature;
                            var $1518 = $1517;
                            return $1518;
                    };
                })())((_creature$5 => {
                    var $1519 = Maybe$monad$((_m$bind$6 => _m$pure$7 => {
                        var $1520 = _m$pure$7;
                        return $1520;
                    }))(Pair$new$(_coord$3, _creature$5));
                    return $1519;
                }));
                return $1515;
            }));
            return $1513;
        }));
        return $1511;
    };
    const Web$Kaelin$Map$player$info = x0 => x1 => Web$Kaelin$Map$player$info$(x0, x1);

    function List$find$(_cond$2, _xs$3) {
        var List$find$ = (_cond$2, _xs$3) => ({
            ctr: 'TCO',
            arg: [_cond$2, _xs$3]
        });
        var List$find = _cond$2 => _xs$3 => List$find$(_cond$2, _xs$3);
        var arg = [_cond$2, _xs$3];
        while (true) {
            let [_cond$2, _xs$3] = arg;
            var R = (() => {
                var self = _xs$3;
                switch (self._) {
                    case 'List.cons':
                        var $1521 = self.head;
                        var $1522 = self.tail;
                        var self = _cond$2($1521);
                        if (self) {
                            var $1524 = Maybe$some$($1521);
                            var $1523 = $1524;
                        } else {
                            var $1525 = List$find$(_cond$2, $1522);
                            var $1523 = $1525;
                        };
                        return $1523;
                    case 'List.nil':
                        var $1526 = Maybe$none;
                        return $1526;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const List$find = x0 => x1 => List$find$(x0, x1);

    function Web$Kaelin$Skill$has_key$(_key$1, _skill$2) {
        var self = _skill$2;
        switch (self._) {
            case 'Web.Kaelin.Skill.new':
                var $1528 = self.key;
                var $1529 = (_key$1 === $1528);
                var $1527 = $1529;
                break;
        };
        return $1527;
    };
    const Web$Kaelin$Skill$has_key = x0 => x1 => Web$Kaelin$Skill$has_key$(x0, x1);

    function Web$Kaelin$Hero$skill$from_key$(_key$1, _hero$2) {
        var self = _hero$2;
        switch (self._) {
            case 'Web.Kaelin.Hero.new':
                var $1531 = self.skills;
                var $1532 = List$find$(Web$Kaelin$Skill$has_key(_key$1), $1531);
                var $1530 = $1532;
                break;
        };
        return $1530;
    };
    const Web$Kaelin$Hero$skill$from_key = x0 => x1 => Web$Kaelin$Hero$skill$from_key$(x0, x1);
    const NatSet$new = NatMap$new;

    function NatSet$set$(_nat$1, _set$2) {
        var $1533 = NatMap$set$(_nat$1, Unit$new, _set$2);
        return $1533;
    };
    const NatSet$set = x0 => x1 => NatSet$set$(x0, x1);

    function NatSet$from_list$(_xs$1) {
        var self = _xs$1;
        switch (self._) {
            case 'List.cons':
                var $1535 = self.head;
                var $1536 = self.tail;
                var $1537 = NatSet$set$($1535, NatSet$from_list$($1536));
                var $1534 = $1537;
                break;
            case 'List.nil':
                var $1538 = NatSet$new;
                var $1534 = $1538;
                break;
        };
        return $1534;
    };
    const NatSet$from_list = x0 => NatSet$from_list$(x0);

    function Web$Kaelin$Coord$range_natset$(_coord$1, _distance$2) {
        var _range$3 = Web$Kaelin$Coord$range$(_coord$1, _distance$2);
        var _range$4 = List$map$(Web$Kaelin$Coord$Convert$axial_to_nat, _range$3);
        var $1539 = NatSet$from_list$(_range$4);
        return $1539;
    };
    const Web$Kaelin$Coord$range_natset = x0 => x1 => Web$Kaelin$Coord$range_natset$(x0, x1);
    const Web$Kaelin$HexEffect$skill = ({
        _: 'Web.Kaelin.HexEffect.skill'
    });

    function Web$Kaelin$State$game$set_cast_info$(_cast_info$1, _state$2) {
        var self = _state$2;
        switch (self._) {
            case 'Web.Kaelin.State.game':
                var $1541 = self.user;
                var $1542 = self.room;
                var $1543 = self.players;
                var $1544 = self.map;
                var $1545 = self.internal;
                var $1546 = self.env_info;
                var $1547 = Web$Kaelin$State$game$($1541, $1542, $1543, Maybe$some$(_cast_info$1), $1544, $1545, $1546);
                var $1540 = $1547;
                break;
            case 'Web.Kaelin.State.init':
            case 'Web.Kaelin.State.void':
                var $1548 = _state$2;
                var $1540 = $1548;
                break;
        };
        return $1540;
    };
    const Web$Kaelin$State$game$set_cast_info = x0 => x1 => Web$Kaelin$State$game$set_cast_info$(x0, x1);

    function Maybe$default$(_m$2, _a$3) {
        var self = _m$2;
        switch (self._) {
            case 'Maybe.some':
                var $1550 = self.value;
                var $1551 = $1550;
                var $1549 = $1551;
                break;
            case 'Maybe.none':
                var $1552 = _a$3;
                var $1549 = $1552;
                break;
        };
        return $1549;
    };
    const Maybe$default = x0 => x1 => Maybe$default$(x0, x1);

    function Web$Kaelin$Action$start_cast$(_key_code$1, _state$2) {
        var self = _state$2;
        switch (self._) {
            case 'Web.Kaelin.State.game':
                var $1554 = self.user;
                var $1555 = self.map;
                var $1556 = self.internal;
                var $1557 = self.env_info;
                var _result$10 = Maybe$monad$((_m$bind$10 => _m$pure$11 => {
                    var $1559 = _m$bind$10;
                    return $1559;
                }))(Web$Kaelin$Map$player$info$($1554, $1555))((_player_info$10 => {
                    var self = _player_info$10;
                    switch (self._) {
                        case 'Pair.new':
                            var $1561 = self.fst;
                            var $1562 = $1561;
                            var _player_coord$11 = $1562;
                            break;
                    };
                    var self = _player_info$10;
                    switch (self._) {
                        case 'Pair.new':
                            var $1563 = self.snd;
                            var $1564 = $1563;
                            var _player_creature$12 = $1564;
                            break;
                    };
                    var $1560 = Maybe$monad$((_m$bind$13 => _m$pure$14 => {
                        var $1565 = _m$bind$13;
                        return $1565;
                    }))(Web$Kaelin$Hero$skill$from_key$(_key_code$1, (() => {
                        var self = _player_creature$12;
                        switch (self._) {
                            case 'Web.Kaelin.Creature.new':
                                var $1566 = self.hero;
                                var $1567 = $1566;
                                return $1567;
                        };
                    })()))((_skill$13 => {
                        var _range$14 = Web$Kaelin$Coord$range_natset$(_player_coord$11, (() => {
                            var self = _skill$13;
                            switch (self._) {
                                case 'Web.Kaelin.Skill.new':
                                    var $1569 = self.range;
                                    var $1570 = $1569;
                                    return $1570;
                            };
                        })());
                        var _mouse_coord$15 = Web$Kaelin$Coord$to_axial$((() => {
                            var self = $1557;
                            switch (self._) {
                                case 'App.EnvInfo.new':
                                    var $1571 = self.mouse_pos;
                                    var $1572 = $1571;
                                    return $1572;
                            };
                        })());
                        var _area$16 = Web$Kaelin$Skill$indicator$((() => {
                            var self = $1556;
                            switch (self._) {
                                case 'Web.Kaelin.Internal.new':
                                    var $1573 = self.tick;
                                    var $1574 = $1573;
                                    return $1574;
                            };
                        })(), _player_coord$11, _skill$13, _mouse_coord$15, $1555);
                        var _cast$17 = Web$Kaelin$CastInfo$new$(_player_coord$11, Web$Kaelin$HexEffect$skill, _skill$13, _range$14, _area$16, _mouse_coord$15);
                        var $1568 = Maybe$monad$((_m$bind$18 => _m$pure$19 => {
                            var $1575 = _m$pure$19;
                            return $1575;
                        }))(Web$Kaelin$State$game$set_cast_info$(_cast$17, _state$2));
                        return $1568;
                    }));
                    return $1560;
                }));
                var $1558 = Maybe$default$(_result$10, _state$2);
                var $1553 = $1558;
                break;
            case 'Web.Kaelin.State.init':
            case 'Web.Kaelin.State.void':
                var $1576 = _state$2;
                var $1553 = $1576;
                break;
        };
        return $1553;
    };
    const Web$Kaelin$Action$start_cast = x0 => x1 => Web$Kaelin$Action$start_cast$(x0, x1);

    function String$drop$(_n$1, _xs$2) {
        var String$drop$ = (_n$1, _xs$2) => ({
            ctr: 'TCO',
            arg: [_n$1, _xs$2]
        });
        var String$drop = _n$1 => _xs$2 => String$drop$(_n$1, _xs$2);
        var arg = [_n$1, _xs$2];
        while (true) {
            let [_n$1, _xs$2] = arg;
            var R = (() => {
                var self = _n$1;
                if (self === 0n) {
                    var $1577 = _xs$2;
                    return $1577;
                } else {
                    var $1578 = (self - 1n);
                    var self = _xs$2;
                    if (self.length === 0) {
                        var $1580 = String$nil;
                        var $1579 = $1580;
                    } else {
                        var $1581 = self.charCodeAt(0);
                        var $1582 = self.slice(1);
                        var $1583 = String$drop$($1578, $1582);
                        var $1579 = $1583;
                    };
                    return $1579;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const String$drop = x0 => x1 => String$drop$(x0, x1);

    function Web$Kaelin$Event$Buffer$next$(_buffer$1) {
        var self = _buffer$1;
        switch (self._) {
            case 'Pair.new':
                var $1585 = self.fst;
                var $1586 = self.snd;
                var self = $1586;
                switch (self._) {
                    case 'List.cons':
                        var $1588 = self.head;
                        var $1589 = self.tail;
                        var $1590 = Pair$new$(String$drop$((BigInt($1588)), $1585), $1589);
                        var $1587 = $1590;
                        break;
                    case 'List.nil':
                        var $1591 = _buffer$1;
                        var $1587 = $1591;
                        break;
                };
                var $1584 = $1587;
                break;
        };
        return $1584;
    };
    const Web$Kaelin$Event$Buffer$next = x0 => Web$Kaelin$Event$Buffer$next$(x0);

    function String$take$(_n$1, _xs$2) {
        var self = _xs$2;
        if (self.length === 0) {
            var $1593 = String$nil;
            var $1592 = $1593;
        } else {
            var $1594 = self.charCodeAt(0);
            var $1595 = self.slice(1);
            var self = _n$1;
            if (self === 0n) {
                var $1597 = String$nil;
                var $1596 = $1597;
            } else {
                var $1598 = (self - 1n);
                var $1599 = String$cons$($1594, String$take$($1598, $1595));
                var $1596 = $1599;
            };
            var $1592 = $1596;
        };
        return $1592;
    };
    const String$take = x0 => x1 => String$take$(x0, x1);

    function Web$Kaelin$Event$Buffer$get$(_buffer$1) {
        var self = _buffer$1;
        switch (self._) {
            case 'Pair.new':
                var $1601 = self.fst;
                var $1602 = self.snd;
                var self = $1602;
                switch (self._) {
                    case 'List.cons':
                        var $1604 = self.head;
                        var $1605 = Hex$to_nat$(String$take$((BigInt($1604)), $1601));
                        var $1603 = $1605;
                        break;
                    case 'List.nil':
                        var $1606 = 0n;
                        var $1603 = $1606;
                        break;
                };
                var $1600 = $1603;
                break;
        };
        return $1600;
    };
    const Web$Kaelin$Event$Buffer$get = x0 => Web$Kaelin$Event$Buffer$get$(x0);

    function Web$Kaelin$Event$Buffer$push$(_buffer$1, _list$2) {
        var self = _buffer$1;
        switch (self._) {
            case 'Pair.new':
                var $1608 = self.fst;
                var $1609 = self.snd;
                var $1610 = Pair$new$($1608, List$concat$(_list$2, $1609));
                var $1607 = $1610;
                break;
        };
        return $1607;
    };
    const Web$Kaelin$Event$Buffer$push = x0 => x1 => Web$Kaelin$Event$Buffer$push$(x0, x1);

    function Web$Kaelin$Event$Buffer$new$(_fst$1, _snd$2) {
        var $1611 = Pair$new$(_fst$1, _snd$2);
        return $1611;
    };
    const Web$Kaelin$Event$Buffer$new = x0 => x1 => Web$Kaelin$Event$Buffer$new$(x0, x1);

    function Web$Kaelin$Event$create_hero$(_hero_id$1) {
        var $1612 = ({
            _: 'Web.Kaelin.Event.create_hero',
            'hero_id': _hero_id$1
        });
        return $1612;
    };
    const Web$Kaelin$Event$create_hero = x0 => Web$Kaelin$Event$create_hero$(x0);
    const Web$Kaelin$Action$ability_0 = ({
        _: 'Web.Kaelin.Action.ability_0'
    });
    const Web$Kaelin$Action$ability_1 = ({
        _: 'Web.Kaelin.Action.ability_1'
    });

    function Web$Kaelin$Resources$Action$to_action$(_x$1) {
        var self = (_x$1 === 0n);
        if (self) {
            var $1614 = Maybe$some$(Web$Kaelin$Action$walk);
            var $1613 = $1614;
        } else {
            var self = (_x$1 === 1n);
            if (self) {
                var $1616 = Maybe$some$(Web$Kaelin$Action$ability_0);
                var $1615 = $1616;
            } else {
                var self = (_x$1 === 2n);
                if (self) {
                    var $1618 = Maybe$some$(Web$Kaelin$Action$ability_1);
                    var $1617 = $1618;
                } else {
                    var $1619 = Maybe$none;
                    var $1617 = $1619;
                };
                var $1615 = $1617;
            };
            var $1613 = $1615;
        };
        return $1613;
    };
    const Web$Kaelin$Resources$Action$to_action = x0 => Web$Kaelin$Resources$Action$to_action$(x0);

    function Web$Kaelin$Event$deserialize$(_code$1) {
        var _stream$2 = Web$Kaelin$Event$Buffer$new$(_code$1, Web$Kaelin$Event$Code$action);
        var self = ((_x$3 => {
            var $1621 = Web$Kaelin$Event$Buffer$get$(_x$3);
            return $1621;
        })(_stream$2) === 1n);
        if (self) {
            var _stream$3 = (_x$3 => {
                var $1623 = Web$Kaelin$Event$Buffer$next$(_x$3);
                return $1623;
            })(_stream$2);
            var _stream$4 = (_x$4 => _y$5 => {
                var $1624 = Web$Kaelin$Event$Buffer$push$(_x$4, _y$5);
                return $1624;
            })(_stream$3)(Web$Kaelin$Event$Code$create_hero);
            var $1622 = Maybe$some$(Web$Kaelin$Event$create_hero$((Number((_x$5 => {
                var $1625 = Web$Kaelin$Event$Buffer$get$(_x$5);
                return $1625;
            })(_stream$4)) & 0xFF)));
            var $1620 = $1622;
        } else {
            var self = ((_x$3 => {
                var $1627 = Web$Kaelin$Event$Buffer$get$(_x$3);
                return $1627;
            })(_stream$2) === 4n);
            if (self) {
                var _stream$3 = (_x$3 => {
                    var $1629 = Web$Kaelin$Event$Buffer$next$(_x$3);
                    return $1629;
                })(_stream$2);
                var _stream$4 = (_x$4 => _y$5 => {
                    var $1630 = Web$Kaelin$Event$Buffer$push$(_x$4, _y$5);
                    return $1630;
                })(_stream$3)(Web$Kaelin$Event$Code$user_input);
                var _player$5 = Bits$to_hex_string$((nat_to_bits((_x$5 => {
                    var $1631 = Web$Kaelin$Event$Buffer$get$(_x$5);
                    return $1631;
                })(_stream$4))));
                var _stream$6 = (_x$6 => {
                    var $1632 = Web$Kaelin$Event$Buffer$next$(_x$6);
                    return $1632;
                })(_stream$4);
                var _action$7 = Web$Kaelin$Resources$Action$to_action$((_x$7 => {
                    var $1633 = Web$Kaelin$Event$Buffer$get$(_x$7);
                    return $1633;
                })(_stream$6));
                var _stream$8 = (_x$8 => {
                    var $1634 = Web$Kaelin$Event$Buffer$next$(_x$8);
                    return $1634;
                })(_stream$6);
                var _pos$9 = Web$Kaelin$Coord$Convert$nat_to_axial$((_x$9 => {
                    var $1635 = Web$Kaelin$Event$Buffer$get$(_x$9);
                    return $1635;
                })(_stream$8));
                var $1628 = Maybe$bind$(_action$7, (_action$10 => {
                    var $1636 = Maybe$some$(Web$Kaelin$Event$user_input$(("0x" + _player$5), _pos$9, _action$10));
                    return $1636;
                }));
                var $1626 = $1628;
            } else {
                var $1637 = Maybe$none;
                var $1626 = $1637;
            };
            var $1620 = $1626;
        };
        return $1620;
    };
    const Web$Kaelin$Event$deserialize = x0 => Web$Kaelin$Event$deserialize$(x0);

    function Word$s_show$(_size$1, _a$2) {
        var _neg$3 = Word$is_neg$(_a$2);
        var _n$4 = Word$to_nat$(Word$abs$(_a$2));
        var self = _neg$3;
        if (self) {
            var $1639 = "-";
            var _sgn$5 = $1639;
        } else {
            var $1640 = "+";
            var _sgn$5 = $1640;
        };
        var $1638 = (_sgn$5 + (Nat$show$(_n$4) + ("#" + Nat$show$(_size$1))));
        return $1638;
    };
    const Word$s_show = x0 => x1 => Word$s_show$(x0, x1);

    function I32$show$(_a$1) {
        var self = _a$1;
        switch ('i32') {
            case 'i32':
                var $1642 = i32_to_word(self);
                var $1643 = Word$s_show$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$zero)))))))))))))))))))))))))))))))), $1642);
                var $1641 = $1643;
                break;
        };
        return $1641;
    };
    const I32$show = x0 => I32$show$(x0);

    function Web$Kaelin$Coord$show$(_coord$1) {
        var self = _coord$1;
        switch (self._) {
            case 'Web.Kaelin.Coord.new':
                var $1645 = self.i;
                var $1646 = self.j;
                var $1647 = (I32$show$($1645) + (":" + I32$show$($1646)));
                var $1644 = $1647;
                break;
        };
        return $1644;
    };
    const Web$Kaelin$Coord$show = x0 => Web$Kaelin$Coord$show$(x0);

    function Web$Kaelin$Skill$skill_use$(_state$1) {
        var self = _state$1;
        switch (self._) {
            case 'Web.Kaelin.State.game':
                var $1649 = self.user;
                var $1650 = self.room;
                var $1651 = self.players;
                var $1652 = self.cast_info;
                var $1653 = self.map;
                var $1654 = self.internal;
                var $1655 = self.env_info;
                var self = $1652;
                switch (self._) {
                    case 'Maybe.some':
                        var $1657 = self.value;
                        var self = $1657;
                        switch (self._) {
                            case 'Web.Kaelin.CastInfo.new':
                                var $1659 = self.hero_pos;
                                var $1660 = self.skill;
                                var $1661 = self.range;
                                var $1662 = self.mouse_pos;
                                var _skill$16 = $1660;
                                var self = _skill$16;
                                switch (self._) {
                                    case 'Web.Kaelin.Skill.new':
                                        var $1664 = self.effect;
                                        var _mouse_nat$21 = Web$Kaelin$Coord$Convert$axial_to_nat$($1662);
                                        var self = NatSet$has$(_mouse_nat$21, $1661);
                                        if (self) {
                                            var self = $1654;
                                            switch (self._) {
                                                case 'Web.Kaelin.Internal.new':
                                                    var $1667 = self.tick;
                                                    var _tick$25 = $1667;
                                                    var _result$26 = $1664(_tick$25)($1659)($1662)($1653);
                                                    var self = _result$26;
                                                    switch (self._) {
                                                        case 'Web.Kaelin.Effect.Result.new':
                                                            var $1669 = self.map;
                                                            var $1670 = Web$Kaelin$State$game$($1649, $1650, $1651, Maybe$none, $1669, $1654, $1655);
                                                            var $1668 = $1670;
                                                            break;
                                                    };
                                                    var $1666 = $1668;
                                                    break;
                                            };
                                            var $1665 = $1666;
                                        } else {
                                            var $1671 = _state$1;
                                            var $1665 = $1671;
                                        };
                                        var $1663 = $1665;
                                        break;
                                };
                                var $1658 = $1663;
                                break;
                        };
                        var $1656 = $1658;
                        break;
                    case 'Maybe.none':
                        var $1672 = _state$1;
                        var $1656 = $1672;
                        break;
                };
                var $1648 = $1656;
                break;
            case 'Web.Kaelin.State.init':
            case 'Web.Kaelin.State.void':
                var $1673 = _state$1;
                var $1648 = $1673;
                break;
        };
        return $1648;
    };
    const Web$Kaelin$Skill$skill_use = x0 => Web$Kaelin$Skill$skill_use$(x0);

    function Web$Kaelin$App$when$(_event$1, _state$2) {
        var self = _event$1;
        switch (self._) {
            case 'App.Event.init':
                var $1675 = self.user;
                var self = _state$2;
                switch (self._) {
                    case 'Web.Kaelin.State.game':
                        var $1677 = self.players;
                        var $1678 = self.cast_info;
                        var $1679 = self.map;
                        var $1680 = self.internal;
                        var $1681 = self.env_info;
                        var _user$13 = String$to_lower$($1675);
                        var $1682 = IO$monad$((_m$bind$14 => _m$pure$15 => {
                            var $1683 = _m$bind$14;
                            return $1683;
                        }))(App$watch$(Web$Kaelin$Constants$room))((_$14 => {
                            var $1684 = App$store$(Web$Kaelin$State$game$(_user$13, Web$Kaelin$Constants$room, $1677, $1678, $1679, $1680, $1681));
                            return $1684;
                        }));
                        var $1676 = $1682;
                        break;
                    case 'Web.Kaelin.State.init':
                    case 'Web.Kaelin.State.void':
                        var $1685 = App$pass;
                        var $1676 = $1685;
                        break;
                };
                var $1674 = $1676;
                break;
            case 'App.Event.tick':
                var $1686 = self.time;
                var $1687 = self.info;
                var self = _state$2;
                switch (self._) {
                    case 'Web.Kaelin.State.init':
                    case 'Web.Kaelin.State.void':
                        var $1689 = App$pass;
                        var $1688 = $1689;
                        break;
                    case 'Web.Kaelin.State.game':
                        var _info$12 = $1687;
                        var _state$13 = Web$Kaelin$Action$update_interface$(_info$12, ($1686), _state$2);
                        var $1690 = App$store$(Web$Kaelin$Action$update_area$(_state$13));
                        var $1688 = $1690;
                        break;
                };
                var $1674 = $1688;
                break;
            case 'App.Event.key_down':
                var $1691 = self.code;
                var self = _state$2;
                switch (self._) {
                    case 'Web.Kaelin.State.game':
                        var $1693 = self.user;
                        var self = ($1691 === 49);
                        if (self) {
                            var $1695 = App$store$(Web$Kaelin$Action$create_player$($1693, Web$Kaelin$Heroes$Croni$hero, _state$2));
                            var $1694 = $1695;
                        } else {
                            var $1696 = App$store$(Web$Kaelin$Action$start_cast$($1691, _state$2));
                            var $1694 = $1696;
                        };
                        var $1692 = $1694;
                        break;
                    case 'Web.Kaelin.State.init':
                    case 'Web.Kaelin.State.void':
                        var $1697 = App$pass;
                        var $1692 = $1697;
                        break;
                };
                var $1674 = $1692;
                break;
            case 'App.Event.post':
                var $1698 = self.data;
                var self = _state$2;
                switch (self._) {
                    case 'Web.Kaelin.State.init':
                    case 'Web.Kaelin.State.void':
                        var $1700 = App$pass;
                        var $1699 = $1700;
                        break;
                    case 'Web.Kaelin.State.game':
                        var self = Web$Kaelin$Event$deserialize$(String$drop$(2n, $1698));
                        switch (self._) {
                            case 'Maybe.some':
                                var $1702 = self.value;
                                var self = $1702;
                                switch (self._) {
                                    case 'Web.Kaelin.Event.user_input':
                                        var $1704 = self.coord;
                                        var $1705 = ((console.log(Web$Kaelin$Coord$show$($1704)), (_$18 => {
                                            var $1706 = App$store$(Web$Kaelin$Skill$skill_use$(_state$2));
                                            return $1706;
                                        })()));
                                        var $1703 = $1705;
                                        break;
                                    case 'Web.Kaelin.Event.start_game':
                                    case 'Web.Kaelin.Event.create_user':
                                    case 'Web.Kaelin.Event.create_hero':
                                        var $1707 = App$pass;
                                        var $1703 = $1707;
                                        break;
                                };
                                var $1701 = $1703;
                                break;
                            case 'Maybe.none':
                                var $1708 = App$pass;
                                var $1701 = $1708;
                                break;
                        };
                        var $1699 = $1701;
                        break;
                };
                var $1674 = $1699;
                break;
            case 'App.Event.mouse_down':
            case 'App.Event.key_up':
            case 'App.Event.mouse_over':
                var self = _state$2;
                switch (self._) {
                    case 'Web.Kaelin.State.init':
                    case 'Web.Kaelin.State.void':
                    case 'Web.Kaelin.State.game':
                        var $1710 = App$pass;
                        var $1709 = $1710;
                        break;
                };
                var $1674 = $1709;
                break;
            case 'App.Event.mouse_up':
                var self = _state$2;
                switch (self._) {
                    case 'Web.Kaelin.State.game':
                        var $1712 = self.user;
                        var $1713 = self.room;
                        var $1714 = self.env_info;
                        var _info$12 = $1714;
                        var self = _info$12;
                        switch (self._) {
                            case 'App.EnvInfo.new':
                                var $1716 = self.mouse_pos;
                                var self = Web$Kaelin$Coord$to_axial$($1716);
                                switch (self._) {
                                    case 'Web.Kaelin.Coord.new':
                                        var $1718 = self.i;
                                        var $1719 = self.j;
                                        var _hex$17 = Web$Kaelin$Event$serialize$(Web$Kaelin$Event$user_input$($1712, Web$Kaelin$Coord$new$($1718, $1719), Web$Kaelin$Action$walk));
                                        var $1720 = App$post$($1713, _hex$17);
                                        var $1717 = $1720;
                                        break;
                                };
                                var $1715 = $1717;
                                break;
                        };
                        var $1711 = $1715;
                        break;
                    case 'Web.Kaelin.State.init':
                    case 'Web.Kaelin.State.void':
                        var $1721 = App$pass;
                        var $1711 = $1721;
                        break;
                };
                var $1674 = $1711;
                break;
            case 'App.Event.mouse_click':
            case 'App.Event.input':
                var self = _state$2;
                switch (self._) {
                    case 'Web.Kaelin.State.init':
                    case 'Web.Kaelin.State.void':
                    case 'Web.Kaelin.State.game':
                        var $1723 = App$pass;
                        var $1722 = $1723;
                        break;
                };
                var $1674 = $1722;
                break;
        };
        return $1674;
    };
    const Web$Kaelin$App$when = x0 => x1 => Web$Kaelin$App$when$(x0, x1);

    function App$new$(_init$2, _draw$3, _when$4) {
        var $1724 = ({
            _: 'App.new',
            'init': _init$2,
            'draw': _draw$3,
            'when': _when$4
        });
        return $1724;
    };
    const App$new = x0 => x1 => x2 => App$new$(x0, x1, x2);
    const Web$Kaelin = (() => {
        var _img$1 = VoxBox$alloc_capacity$(((65536 * 8) >>> 0));
        var _init$2 = Web$Kaelin$App$init;
        var _draw$3 = Web$Kaelin$App$draw(_img$1);
        var _when$4 = Web$Kaelin$App$when;
        var $1725 = App$new$(_init$2, _draw$3, _when$4);
        return $1725;
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
        'Web.Kaelin.Constants.room': Web$Kaelin$Constants$room,
        'BitsMap': BitsMap,
        'Map': Map,
        'BitsMap.new': BitsMap$new,
        'BitsMap.tie': BitsMap$tie,
        'Maybe.some': Maybe$some,
        'Maybe.none': Maybe$none,
        'BitsMap.set': BitsMap$set,
        'Bits.e': Bits$e,
        'Bits.o': Bits$o,
        'Bits.i': Bits$i,
        'Bits.concat': Bits$concat,
        'Word.to_bits': Word$to_bits,
        'U16.to_bits': U16$to_bits,
        'String.to_bits': String$to_bits,
        'Map.from_list': Map$from_list,
        'List.nil': List$nil,
        'Pair': Pair,
        'Web.Kaelin.Coord.new': Web$Kaelin$Coord$new,
        'Bool.and': Bool$and,
        'Cmp.as_eql': Cmp$as_eql,
        'Cmp.ltn': Cmp$ltn,
        'Cmp.gtn': Cmp$gtn,
        'Word.cmp.go': Word$cmp$go,
        'Cmp.eql': Cmp$eql,
        'Word.cmp': Word$cmp,
        'Word.eql': Word$eql,
        'U16.eql': U16$eql,
        'String.eql': String$eql,
        'Web.Kaelin.Hero.new': Web$Kaelin$Hero$new,
        'Nat.ltn': Nat$ltn,
        'Nat.sub': Nat$sub,
        'Cmp.as_gte': Cmp$as_gte,
        'Word.gte': Word$gte,
        'Pair.new': Pair$new,
        'Word.or': Word$or,
        'Word.shift_right.one.go': Word$shift_right$one$go,
        'Word.shift_right.one': Word$shift_right$one,
        'Word.shift_right': Word$shift_right,
        'Word.subber': Word$subber,
        'Word.sub': Word$sub,
        'Word.div.go': Word$div$go,
        'Word.div': Word$div,
        'U32.div': U32$div,
        'U32.length': U32$length,
        'U32.eql': U32$eql,
        'U32.inc': U32$inc,
        'U32.for': U32$for,
        'Word.slice': Word$slice,
        'U32.slice': U32$slice,
        'U32.add': U32$add,
        'U32.read_base': U32$read_base,
        'VoxBox.parse_byte': VoxBox$parse_byte,
        'U32.or': U32$or,
        'Word.fold': Word$fold,
        'Nat.add': Nat$add,
        'Nat.mul': Nat$mul,
        'Word.to_nat': Word$to_nat,
        'Word.shl': Word$shl,
        'U32.shl': U32$shl,
        'Pos32.new': Pos32$new,
        'Col32.new': Col32$new,
        'Word.trim': Word$trim,
        'Unit.new': Unit$new,
        'Array.extract_tip': Array$extract_tip,
        'Array.extract_tie': Array$extract_tie,
        'Word.foldl': Word$foldl,
        'Array.mut': Array$mut,
        'Array.set': Array$set,
        'Buffer32.set': Buffer32$set,
        'VoxBox.set_pos': VoxBox$set_pos,
        'VoxBox.set_col': VoxBox$set_col,
        'VoxBox.set_length': VoxBox$set_length,
        'VoxBox.push': VoxBox$push,
        'VoxBox.parse': VoxBox$parse,
        'Web.Kaelin.Assets.hero.croni0_d_1': Web$Kaelin$Assets$hero$croni0_d_1,
        'I32.new': I32$new,
        'Word.neg.aux': Word$neg$aux,
        'Word.neg': Word$neg,
        'I32.neg': I32$neg,
        'Int.to_i32': Int$to_i32,
        'Int.new': Int$new,
        'Int.from_nat': Int$from_nat,
        'I32.from_nat': I32$from_nat,
        'List.cons': List$cons,
        'Web.Kaelin.Skill.new': Web$Kaelin$Skill$new,
        'Web.Kaelin.Effect.Result': Web$Kaelin$Effect$Result,
        'List': List,
        'List.concat': List$concat,
        'BitsMap.union': BitsMap$union,
        'NatMap.union': NatMap$union,
        'Web.Kaelin.Effect.Result.new': Web$Kaelin$Effect$Result$new,
        'Web.Kaelin.Effect.bind': Web$Kaelin$Effect$bind,
        'NatMap.new': NatMap$new,
        'Web.Kaelin.Effect.pure': Web$Kaelin$Effect$pure,
        'Web.Kaelin.Effect.monad': Web$Kaelin$Effect$monad,
        'NatMap': NatMap,
        'Web.Kaelin.Effect.map.get': Web$Kaelin$Effect$map$get,
        'Web.Kaelin.Effect.coord.get_target': Web$Kaelin$Effect$coord$get_target,
        'I32.sub': I32$sub,
        'Web.Kaelin.Coord.Cubic.new': Web$Kaelin$Coord$Cubic$new,
        'Web.Kaelin.Coord.Convert.axial_to_cubic': Web$Kaelin$Coord$Convert$axial_to_cubic,
        'List.map': List$map,
        'Web.Kaelin.Coord.Convert.cubic_to_axial': Web$Kaelin$Coord$Convert$cubic_to_axial,
        'F64.to_u32': F64$to_u32,
        'Word.s_to_f64': Word$s_to_f64,
        'I32.to_f64': I32$to_f64,
        'I32.to_u32': I32$to_u32,
        'F64.to_i32': F64$to_i32,
        'Word.to_f64': Word$to_f64,
        'U32.to_f64': U32$to_f64,
        'U32.to_i32': U32$to_i32,
        'Word.is_neg.go': Word$is_neg$go,
        'Word.is_neg': Word$is_neg,
        'Cmp.as_gtn': Cmp$as_gtn,
        'Cmp.inv': Cmp$inv,
        'Word.s_gtn': Word$s_gtn,
        'I32.gtn': I32$gtn,
        'I32.max': I32$max,
        'I32.add': I32$add,
        'Cmp.as_ltn': Cmp$as_ltn,
        'Word.s_ltn': Word$s_ltn,
        'I32.ltn': I32$ltn,
        'I32.min': I32$min,
        'Word.shr': Word$shr,
        'Word.s_shr': Word$s_shr,
        'I32.shr': I32$shr,
        'Word.xor': Word$xor,
        'I32.xor': I32$xor,
        'I32.abs': I32$abs,
        'Web.Kaelin.Coord.Cubic.add': Web$Kaelin$Coord$Cubic$add,
        'Web.Kaelin.Coord.Cubic.range': Web$Kaelin$Coord$Cubic$range,
        'Web.Kaelin.Coord.Axial.range': Web$Kaelin$Coord$Axial$range,
        'Cmp.as_lte': Cmp$as_lte,
        'Word.lte': Word$lte,
        'U32.lte': U32$lte,
        'Web.Kaelin.Coord.fit': Web$Kaelin$Coord$fit,
        'Web.Kaelin.Constants.map_size': Web$Kaelin$Constants$map_size,
        'List.filter': List$filter,
        'Web.Kaelin.Coord.range': Web$Kaelin$Coord$range,
        'List.for': List$for,
        'I32.mul': I32$mul,
        'U32.to_nat': U32$to_nat,
        'Web.Kaelin.Coord.Convert.axial_to_nat': Web$Kaelin$Coord$Convert$axial_to_nat,
        'Bits.inc': Bits$inc,
        'Nat.to_bits': Nat$to_bits,
        'NatMap.set': NatMap$set,
        'Web.Kaelin.Effect.Result.union': Web$Kaelin$Effect$Result$union,
        'Web.Kaelin.Effect.area': Web$Kaelin$Effect$area,
        'Maybe': Maybe,
        'BitsMap.get': BitsMap$get,
        'NatMap.get': NatMap$get,
        'Web.Kaelin.Tile.new': Web$Kaelin$Tile$new,
        'Web.Kaelin.Map.modify_at': Web$Kaelin$Map$modify_at,
        'Word.s_lte': Word$s_lte,
        'I32.lte': I32$lte,
        'Web.Kaelin.Creature.new': Web$Kaelin$Creature$new,
        'Web.Kaelin.Tile.creature.change_hp': Web$Kaelin$Tile$creature$change_hp,
        'Web.Kaelin.Map.change_hp_at': Web$Kaelin$Map$change_hp_at,
        'Pair.fst': Pair$fst,
        'Pair.snd': Pair$snd,
        'Web.Kaelin.Effect.map.set': Web$Kaelin$Effect$map$set,
        'Word.s_gte': Word$s_gte,
        'I32.gte': I32$gte,
        'Web.Kaelin.Effect': Web$Kaelin$Effect,
        'Web.Kaelin.Effect.indicators.add': Web$Kaelin$Effect$indicators$add,
        'Web.Kaelin.Indicator.green': Web$Kaelin$Indicator$green,
        'Web.Kaelin.Indicator.red': Web$Kaelin$Indicator$red,
        'Web.Kaelin.Effect.hp.change': Web$Kaelin$Effect$hp$change,
        'Web.Kaelin.Effect.hp.damage': Web$Kaelin$Effect$hp$damage,
        'Web.Kaelin.Effect.all.fireball': Web$Kaelin$Effect$all$fireball,
        'Web.Kaelin.Heroes.Croni.skills.quick_shot': Web$Kaelin$Heroes$Croni$skills$quick_shot,
        'Web.Kaelin.Effect.coord.get_center': Web$Kaelin$Effect$coord$get_center,
        'Web.Kaelin.Effect.hp.change_at': Web$Kaelin$Effect$hp$change_at,
        'Web.Kaelin.Effect.hp.damage_at': Web$Kaelin$Effect$hp$damage_at,
        'Web.Kaelin.Effect.hp.heal_at': Web$Kaelin$Effect$hp$heal_at,
        'Web.Kaelin.Effect.all.vampirism': Web$Kaelin$Effect$all$vampirism,
        'Web.Kaelin.Heroes.Croni.skills.vampirism': Web$Kaelin$Heroes$Croni$skills$vampirism,
        'Web.Kaelin.Map.get': Web$Kaelin$Map$get,
        'Web.Kaelin.Map.is_occupied': Web$Kaelin$Map$is_occupied,
        'Web.Kaelin.Map.set': Web$Kaelin$Map$set,
        'Web.Kaelin.Map.pop_creature': Web$Kaelin$Map$pop_creature,
        'Web.Kaelin.Map.Entity.creature': Web$Kaelin$Map$Entity$creature,
        'Web.Kaelin.Map.push': Web$Kaelin$Map$push,
        'Web.Kaelin.Map.swap': Web$Kaelin$Map$swap,
        'Web.Kaelin.Effect.all.move': Web$Kaelin$Effect$all$move,
        'Web.Kaelin.Skill.move': Web$Kaelin$Skill$move,
        'Web.Kaelin.Heroes.Croni.skills': Web$Kaelin$Heroes$Croni$skills,
        'Web.Kaelin.Heroes.Croni.hero': Web$Kaelin$Heroes$Croni$hero,
        'Web.Kaelin.Assets.hero.cyclope_d_1': Web$Kaelin$Assets$hero$cyclope_d_1,
        'Web.Kaelin.Heroes.Cyclope.hero': Web$Kaelin$Heroes$Cyclope$hero,
        'Web.Kaelin.Assets.hero.lela_d_1': Web$Kaelin$Assets$hero$lela_d_1,
        'Web.Kaelin.Heroes.Lela.hero': Web$Kaelin$Heroes$Lela$hero,
        'Web.Kaelin.Assets.hero.octoking_d_1': Web$Kaelin$Assets$hero$octoking_d_1,
        'Web.Kaelin.Heroes.Octoking.hero': Web$Kaelin$Heroes$Octoking$hero,
        'Web.Kaelin.Hero.info': Web$Kaelin$Hero$info,
        'Web.Kaelin.Tile.creature.create': Web$Kaelin$Tile$creature$create,
        'Web.Kaelin.Map.init': Web$Kaelin$Map$init,
        'Web.Kaelin.Assets.tile.green_2': Web$Kaelin$Assets$tile$green_2,
        'Web.Kaelin.Assets.tile.effect.light_blue2': Web$Kaelin$Assets$tile$effect$light_blue2,
        'Web.Kaelin.Assets.tile.effect.dark_blue2': Web$Kaelin$Assets$tile$effect$dark_blue2,
        'Web.Kaelin.Assets.tile.effect.blue_green2': Web$Kaelin$Assets$tile$effect$blue_green2,
        'Web.Kaelin.Assets.tile.effect.dark_red2': Web$Kaelin$Assets$tile$effect$dark_red2,
        'Web.Kaelin.Assets.tile.effect.light_red2': Web$Kaelin$Assets$tile$effect$light_red2,
        'Web.Kaelin.Terrain.grass': Web$Kaelin$Terrain$grass,
        'Web.Kaelin.Map.Entity.background': Web$Kaelin$Map$Entity$background,
        'Web.Kaelin.Map.arena': Web$Kaelin$Map$arena,
        'App.EnvInfo.new': App$EnvInfo$new,
        'Web.Kaelin.State.game': Web$Kaelin$State$game,
        'Web.Kaelin.Internal.new': Web$Kaelin$Internal$new,
        'Web.Kaelin.App.init': Web$Kaelin$App$init,
        'DOM.text': DOM$text,
        'DOM.vbox': DOM$vbox,
        'List.reverse.go': List$reverse$go,
        'List.reverse': List$reverse,
        'Bits.reverse.tco': Bits$reverse$tco,
        'Bits.reverse': Bits$reverse,
        'BitsMap.to_list.go': BitsMap$to_list$go,
        'List.mapped': List$mapped,
        'Bits.to_nat': Bits$to_nat,
        'NatMap.to_list': NatMap$to_list,
        'F64.div': F64$div,
        'Web.Kaelin.Constants.hexagon_radius': Web$Kaelin$Constants$hexagon_radius,
        'F64.parse': F64$parse,
        'Web.Kaelin.Constants.center_x': Web$Kaelin$Constants$center_x,
        'Web.Kaelin.Constants.center_y': Web$Kaelin$Constants$center_y,
        'F64.sub': F64$sub,
        'F64.mul': F64$mul,
        'U32.from_nat': U32$from_nat,
        'F64.add': F64$add,
        'Web.Kaelin.Coord.round.floor': Web$Kaelin$Coord$round$floor,
        'Web.Kaelin.Coord.round.round_F64': Web$Kaelin$Coord$round$round_F64,
        'Word.gtn': Word$gtn,
        'F64.gtn': F64$gtn,
        'Web.Kaelin.Coord.round.diff': Web$Kaelin$Coord$round$diff,
        'Web.Kaelin.Coord.round': Web$Kaelin$Coord$round,
        'Web.Kaelin.Coord.to_axial': Web$Kaelin$Coord$to_axial,
        'Word.mod': Word$mod,
        'U32.mod': U32$mod,
        'Web.Kaelin.Coord.Convert.nat_to_axial': Web$Kaelin$Coord$Convert$nat_to_axial,
        'Web.Kaelin.HexEffect.normal': Web$Kaelin$HexEffect$normal,
        'NatSet.has': NatSet$has,
        'Web.Kaelin.Draw.support.get_effect': Web$Kaelin$Draw$support$get_effect,
        'Web.Kaelin.Draw.support.area_of_effect': Web$Kaelin$Draw$support$area_of_effect,
        'Web.Kaelin.Terrain.Sprite.new': Web$Kaelin$Terrain$Sprite$new,
        'Web.Kaelin.Draw.support.get_sprite': Web$Kaelin$Draw$support$get_sprite,
        'Web.Kaelin.Coord.to_screen_xy': Web$Kaelin$Coord$to_screen_xy,
        'U32.sub': U32$sub,
        'Web.Kaelin.Draw.support.centralize': Web$Kaelin$Draw$support$centralize,
        'VoxBox.get_len': VoxBox$get_len,
        'Array.get': Array$get,
        'Buffer32.get': Buffer32$get,
        'VoxBox.get_pos': VoxBox$get_pos,
        'VoxBox.get_col': VoxBox$get_col,
        'Word.and': Word$and,
        'U32.and': U32$and,
        'U32.shr': U32$shr,
        'VoxBox.Draw.image': VoxBox$Draw$image,
        'Web.Kaelin.Draw.state.background': Web$Kaelin$Draw$state$background,
        'Web.Kaelin.Assets.tile.mouse_ui': Web$Kaelin$Assets$tile$mouse_ui,
        'Web.Kaelin.Draw.state.mouse_ui': Web$Kaelin$Draw$state$mouse_ui,
        'Web.Kaelin.Draw.hero': Web$Kaelin$Draw$hero,
        'Nat.gtn': Nat$gtn,
        'Int.is_neg': Int$is_neg,
        'Int.neg': Int$neg,
        'Int.abs': Int$abs,
        'Int.to_nat_signed': Int$to_nat_signed,
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
        'Nat.lte': Nat$lte,
        'List.at': List$at,
        'Nat.show_digit': Nat$show_digit,
        'Nat.to_string_base': Nat$to_string_base,
        'Nat.show': Nat$show,
        'Int.show': Int$show,
        'Word.abs': Word$abs,
        'Word.to_int': Word$to_int,
        'I32.to_int': I32$to_int,
        'List.imap': List$imap,
        'List.indices.u32': List$indices$u32,
        'String.to_list': String$to_list,
        'Map.get': Map$get,
        'U16.show_hex': U16$show_hex,
        'PixelFont.get_img': PixelFont$get_img,
        'Pos32.get_x': Pos32$get_x,
        'Pos32.get_y': Pos32$get_y,
        'Pos32.get_z': Pos32$get_z,
        'VoxBox.Draw.text.char': VoxBox$Draw$text$char,
        'Pos32.add': Pos32$add,
        'VoxBox.Draw.text': VoxBox$Draw$text,
        'Map.new': Map$new,
        'Map.set': Map$set,
        'PixelFont.set_img': PixelFont$set_img,
        'U16.new': U16$new,
        'Nat.to_u16': Nat$to_u16,
        'PixelFont.small_black.100': PixelFont$small_black$100,
        'PixelFont.small_black.101': PixelFont$small_black$101,
        'PixelFont.small_black.102': PixelFont$small_black$102,
        'PixelFont.small_black.103': PixelFont$small_black$103,
        'PixelFont.small_black.104': PixelFont$small_black$104,
        'PixelFont.small_black.105': PixelFont$small_black$105,
        'PixelFont.small_black.106': PixelFont$small_black$106,
        'PixelFont.small_black.107': PixelFont$small_black$107,
        'PixelFont.small_black.108': PixelFont$small_black$108,
        'PixelFont.small_black.109': PixelFont$small_black$109,
        'PixelFont.small_black.110': PixelFont$small_black$110,
        'PixelFont.small_black.111': PixelFont$small_black$111,
        'PixelFont.small_black.112': PixelFont$small_black$112,
        'PixelFont.small_black.113': PixelFont$small_black$113,
        'PixelFont.small_black.114': PixelFont$small_black$114,
        'PixelFont.small_black.115': PixelFont$small_black$115,
        'PixelFont.small_black.116': PixelFont$small_black$116,
        'PixelFont.small_black.117': PixelFont$small_black$117,
        'PixelFont.small_black.118': PixelFont$small_black$118,
        'PixelFont.small_black.119': PixelFont$small_black$119,
        'PixelFont.small_black.120': PixelFont$small_black$120,
        'PixelFont.small_black.121': PixelFont$small_black$121,
        'PixelFont.small_black.122': PixelFont$small_black$122,
        'PixelFont.small_black.123': PixelFont$small_black$123,
        'PixelFont.small_black.124': PixelFont$small_black$124,
        'PixelFont.small_black.125': PixelFont$small_black$125,
        'PixelFont.small_black.126': PixelFont$small_black$126,
        'PixelFont.small_black.32': PixelFont$small_black$32,
        'PixelFont.small_black.33': PixelFont$small_black$33,
        'PixelFont.small_black.34': PixelFont$small_black$34,
        'PixelFont.small_black.35': PixelFont$small_black$35,
        'PixelFont.small_black.36': PixelFont$small_black$36,
        'PixelFont.small_black.37': PixelFont$small_black$37,
        'PixelFont.small_black.38': PixelFont$small_black$38,
        'PixelFont.small_black.39': PixelFont$small_black$39,
        'PixelFont.small_black.40': PixelFont$small_black$40,
        'PixelFont.small_black.41': PixelFont$small_black$41,
        'PixelFont.small_black.42': PixelFont$small_black$42,
        'PixelFont.small_black.43': PixelFont$small_black$43,
        'PixelFont.small_black.44': PixelFont$small_black$44,
        'PixelFont.small_black.45': PixelFont$small_black$45,
        'PixelFont.small_black.46': PixelFont$small_black$46,
        'PixelFont.small_black.47': PixelFont$small_black$47,
        'PixelFont.small_black.48': PixelFont$small_black$48,
        'PixelFont.small_black.49': PixelFont$small_black$49,
        'PixelFont.small_black.50': PixelFont$small_black$50,
        'PixelFont.small_black.51': PixelFont$small_black$51,
        'PixelFont.small_black.52': PixelFont$small_black$52,
        'PixelFont.small_black.53': PixelFont$small_black$53,
        'PixelFont.small_black.54': PixelFont$small_black$54,
        'PixelFont.small_black.55': PixelFont$small_black$55,
        'PixelFont.small_black.56': PixelFont$small_black$56,
        'PixelFont.small_black.57': PixelFont$small_black$57,
        'PixelFont.small_black.58': PixelFont$small_black$58,
        'PixelFont.small_black.59': PixelFont$small_black$59,
        'PixelFont.small_black.60': PixelFont$small_black$60,
        'PixelFont.small_black.61': PixelFont$small_black$61,
        'PixelFont.small_black.62': PixelFont$small_black$62,
        'PixelFont.small_black.63': PixelFont$small_black$63,
        'PixelFont.small_black.64': PixelFont$small_black$64,
        'PixelFont.small_black.65': PixelFont$small_black$65,
        'PixelFont.small_black.66': PixelFont$small_black$66,
        'PixelFont.small_black.67': PixelFont$small_black$67,
        'PixelFont.small_black.68': PixelFont$small_black$68,
        'PixelFont.small_black.69': PixelFont$small_black$69,
        'PixelFont.small_black.70': PixelFont$small_black$70,
        'PixelFont.small_black.71': PixelFont$small_black$71,
        'PixelFont.small_black.72': PixelFont$small_black$72,
        'PixelFont.small_black.73': PixelFont$small_black$73,
        'PixelFont.small_black.74': PixelFont$small_black$74,
        'PixelFont.small_black.75': PixelFont$small_black$75,
        'PixelFont.small_black.76': PixelFont$small_black$76,
        'PixelFont.small_black.77': PixelFont$small_black$77,
        'PixelFont.small_black.78': PixelFont$small_black$78,
        'PixelFont.small_black.79': PixelFont$small_black$79,
        'PixelFont.small_black.80': PixelFont$small_black$80,
        'PixelFont.small_black.81': PixelFont$small_black$81,
        'PixelFont.small_black.82': PixelFont$small_black$82,
        'PixelFont.small_black.83': PixelFont$small_black$83,
        'PixelFont.small_black.84': PixelFont$small_black$84,
        'PixelFont.small_black.85': PixelFont$small_black$85,
        'PixelFont.small_black.86': PixelFont$small_black$86,
        'PixelFont.small_black.87': PixelFont$small_black$87,
        'PixelFont.small_black.88': PixelFont$small_black$88,
        'PixelFont.small_black.89': PixelFont$small_black$89,
        'PixelFont.small_black.90': PixelFont$small_black$90,
        'PixelFont.small_black.91': PixelFont$small_black$91,
        'PixelFont.small_black.92': PixelFont$small_black$92,
        'PixelFont.small_black.93': PixelFont$small_black$93,
        'PixelFont.small_black.94': PixelFont$small_black$94,
        'PixelFont.small_black.95': PixelFont$small_black$95,
        'PixelFont.small_black.96': PixelFont$small_black$96,
        'PixelFont.small_black.97': PixelFont$small_black$97,
        'PixelFont.small_black.98': PixelFont$small_black$98,
        'PixelFont.small_black.99': PixelFont$small_black$99,
        'PixelFont.small_black': PixelFont$small_black,
        'Web.Kaelin.Draw.state.players_hp': Web$Kaelin$Draw$state$players_hp,
        'Web.Kaelin.Draw.state.players': Web$Kaelin$Draw$state$players,
        'Web.Kaelin.Draw.state': Web$Kaelin$Draw$state,
        'Web.Kaelin.App.draw': Web$Kaelin$App$draw,
        'IO': IO,
        'IO.ask': IO$ask,
        'IO.bind': IO$bind,
        'IO.end': IO$end,
        'IO.monad': IO$monad,
        'Dynamic.new': Dynamic$new,
        'App.pass': App$pass,
        'String.map': String$map,
        'U16.gte': U16$gte,
        'U16.lte': U16$lte,
        'U16.add': U16$add,
        'Char.to_lower': Char$to_lower,
        'String.to_lower': String$to_lower,
        'IO.do': IO$do,
        'App.do': App$do,
        'App.watch': App$watch,
        'App.store': App$store,
        'List.take_while.go': List$take_while$go,
        'List.foldr': List$foldr,
        'Web.Kaelin.Timer.set_timer': Web$Kaelin$Timer$set_timer,
        'Function.comp': Function$comp,
        'Web.Kaelin.Timer.wait': Web$Kaelin$Timer$wait,
        'Web.Kaelin.Action.update_interface': Web$Kaelin$Action$update_interface,
        'U64.to_nat': U64$to_nat,
        'I32.eql': I32$eql,
        'Web.Kaelin.Coord.eql': Web$Kaelin$Coord$eql,
        'Web.Kaelin.Skill.indicator': Web$Kaelin$Skill$indicator,
        'Web.Kaelin.CastInfo.new': Web$Kaelin$CastInfo$new,
        'Web.Kaelin.Action.update_area': Web$Kaelin$Action$update_area,
        'U8.to_nat': U8$to_nat,
        'List.zip': List$zip,
        'U8.new': U8$new,
        'Nat.to_u8': Nat$to_u8,
        'Web.Kaelin.Event.Code.action': Web$Kaelin$Event$Code$action,
        'String.length.go': String$length$go,
        'String.length': String$length,
        'String.repeat': String$repeat,
        'Hex.set_min_length': Hex$set_min_length,
        'Hex.format_hex': Hex$format_hex,
        'Bits.chunks_of.go': Bits$chunks_of$go,
        'Bits.chunks_of': Bits$chunks_of,
        'Function.flip': Function$flip,
        'Nat.eql': Nat$eql,
        'Hex.to_hex_string': Hex$to_hex_string,
        'Bits.to_hex_string': Bits$to_hex_string,
        'Hex.append': Hex$append,
        'Web.Kaelin.Event.Code.generate_hex': Web$Kaelin$Event$Code$generate_hex,
        'generate_hex': generate_hex,
        'Web.Kaelin.Event.Code.create_hero': Web$Kaelin$Event$Code$create_hero,
        'Parser.State.new': Parser$State$new,
        'Parser.run': Parser$run,
        'Parser.Reply': Parser$Reply,
        'Parser.Reply.value': Parser$Reply$value,
        'Parser.maybe': Parser$maybe,
        'Parser.Reply.error': Parser$Reply$error,
        'Parser.Error.new': Parser$Error$new,
        'Parser.Reply.fail': Parser$Reply$fail,
        'Parser.text.go': Parser$text$go,
        'Parser.text': Parser$text,
        'Parser.Error.combine': Parser$Error$combine,
        'Parser.Error.maybe_combine': Parser$Error$maybe_combine,
        'Parser.many.go': Parser$many$go,
        'Parser.many': Parser$many,
        'Parser.many1': Parser$many1,
        'Parser.hex_digit': Parser$hex_digit,
        'Nat.from_base.go': Nat$from_base$go,
        'Nat.from_base': Nat$from_base,
        'Parser.hex_nat': Parser$hex_nat,
        'Hex.to_nat': Hex$to_nat,
        'Web.Kaelin.Resources.Action.to_bits': Web$Kaelin$Resources$Action$to_bits,
        'Web.Kaelin.Coord.Convert.axial_to_bits': Web$Kaelin$Coord$Convert$axial_to_bits,
        'Web.Kaelin.Event.Code.user_input': Web$Kaelin$Event$Code$user_input,
        'Web.Kaelin.Event.serialize': Web$Kaelin$Event$serialize,
        'Web.Kaelin.Event.user_input': Web$Kaelin$Event$user_input,
        'Web.Kaelin.Action.walk': Web$Kaelin$Action$walk,
        'App.post': App$post,
        'Debug.log': Debug$log,
        'Web.Kaelin.Player.new': Web$Kaelin$Player$new,
        'Web.Kaelin.Action.create_player': Web$Kaelin$Action$create_player,
        'Maybe.bind': Maybe$bind,
        'Maybe.monad': Maybe$monad,
        'Web.Kaelin.Map.find_players': Web$Kaelin$Map$find_players,
        'Web.Kaelin.Map.player.to_coord': Web$Kaelin$Map$player$to_coord,
        'Web.Kaelin.Map.player.info': Web$Kaelin$Map$player$info,
        'List.find': List$find,
        'Web.Kaelin.Skill.has_key': Web$Kaelin$Skill$has_key,
        'Web.Kaelin.Hero.skill.from_key': Web$Kaelin$Hero$skill$from_key,
        'NatSet.new': NatSet$new,
        'NatSet.set': NatSet$set,
        'NatSet.from_list': NatSet$from_list,
        'Web.Kaelin.Coord.range_natset': Web$Kaelin$Coord$range_natset,
        'Web.Kaelin.HexEffect.skill': Web$Kaelin$HexEffect$skill,
        'Web.Kaelin.State.game.set_cast_info': Web$Kaelin$State$game$set_cast_info,
        'Maybe.default': Maybe$default,
        'Web.Kaelin.Action.start_cast': Web$Kaelin$Action$start_cast,
        'String.drop': String$drop,
        'Web.Kaelin.Event.Buffer.next': Web$Kaelin$Event$Buffer$next,
        'String.take': String$take,
        'Web.Kaelin.Event.Buffer.get': Web$Kaelin$Event$Buffer$get,
        'Web.Kaelin.Event.Buffer.push': Web$Kaelin$Event$Buffer$push,
        'Web.Kaelin.Event.Buffer.new': Web$Kaelin$Event$Buffer$new,
        'Web.Kaelin.Event.create_hero': Web$Kaelin$Event$create_hero,
        'Web.Kaelin.Action.ability_0': Web$Kaelin$Action$ability_0,
        'Web.Kaelin.Action.ability_1': Web$Kaelin$Action$ability_1,
        'Web.Kaelin.Resources.Action.to_action': Web$Kaelin$Resources$Action$to_action,
        'Web.Kaelin.Event.deserialize': Web$Kaelin$Event$deserialize,
        'Word.s_show': Word$s_show,
        'I32.show': I32$show,
        'Web.Kaelin.Coord.show': Web$Kaelin$Coord$show,
        'Web.Kaelin.Skill.skill_use': Web$Kaelin$Skill$skill_use,
        'Web.Kaelin.App.when': Web$Kaelin$App$when,
        'App.new': App$new,
        'Web.Kaelin': Web$Kaelin,
    };
})();

/***/ })

}]);
//# sourceMappingURL=927.index.js.map