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
    const Web$Kaelin$Constants$room = "0x415512345292";

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

    function Web$Kaelin$Entity$creature$(_player$1, _hero$2) {
        var $174 = ({
            _: 'Web.Kaelin.Entity.creature',
            'player': _player$1,
            'hero': _hero$2
        });
        return $174;
    };
    const Web$Kaelin$Entity$creature = x0 => x1 => Web$Kaelin$Entity$creature$(x0, x1);

    function Web$Kaelin$Hero$new$(_id$1, _img$2, _health$3, _skills$4) {
        var $175 = ({
            _: 'Web.Kaelin.Hero.new',
            'id': _id$1,
            'img': _img$2,
            'health': _health$3,
            'skills': _skills$4
        });
        return $175;
    };
    const Web$Kaelin$Hero$new = x0 => x1 => x2 => x3 => Web$Kaelin$Hero$new$(x0, x1, x2, x3);

    function U8$new$(_value$1) {
        var $176 = word_to_u8(_value$1);
        return $176;
    };
    const U8$new = x0 => U8$new$(x0);
    const Nat$to_u8 = a0 => (Number(a0) & 0xFF);
    const Nat$ltn = a0 => a1 => (a0 < a1);
    const Nat$sub = a0 => a1 => (a0 - a1 <= 0n ? 0n : a0 - a1);

    function Cmp$as_gte$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
                var $178 = Bool$false;
                var $177 = $178;
                break;
            case 'Cmp.eql':
            case 'Cmp.gtn':
                var $179 = Bool$true;
                var $177 = $179;
                break;
        };
        return $177;
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
                var $181 = self.pred;
                var $182 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $184 = self.pred;
                            var $185 = (_a$pred$10 => {
                                var $186 = Word$cmp$go$(_a$pred$10, $184, _c$4);
                                return $186;
                            });
                            var $183 = $185;
                            break;
                        case 'Word.i':
                            var $187 = self.pred;
                            var $188 = (_a$pred$10 => {
                                var $189 = Word$cmp$go$(_a$pred$10, $187, Cmp$ltn);
                                return $189;
                            });
                            var $183 = $188;
                            break;
                        case 'Word.e':
                            var $190 = (_a$pred$8 => {
                                var $191 = _c$4;
                                return $191;
                            });
                            var $183 = $190;
                            break;
                    };
                    var $183 = $183($181);
                    return $183;
                });
                var $180 = $182;
                break;
            case 'Word.i':
                var $192 = self.pred;
                var $193 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $195 = self.pred;
                            var $196 = (_a$pred$10 => {
                                var $197 = Word$cmp$go$(_a$pred$10, $195, Cmp$gtn);
                                return $197;
                            });
                            var $194 = $196;
                            break;
                        case 'Word.i':
                            var $198 = self.pred;
                            var $199 = (_a$pred$10 => {
                                var $200 = Word$cmp$go$(_a$pred$10, $198, _c$4);
                                return $200;
                            });
                            var $194 = $199;
                            break;
                        case 'Word.e':
                            var $201 = (_a$pred$8 => {
                                var $202 = _c$4;
                                return $202;
                            });
                            var $194 = $201;
                            break;
                    };
                    var $194 = $194($192);
                    return $194;
                });
                var $180 = $193;
                break;
            case 'Word.e':
                var $203 = (_b$5 => {
                    var $204 = _c$4;
                    return $204;
                });
                var $180 = $203;
                break;
        };
        var $180 = $180(_b$3);
        return $180;
    };
    const Word$cmp$go = x0 => x1 => x2 => Word$cmp$go$(x0, x1, x2);
    const Cmp$eql = ({
        _: 'Cmp.eql'
    });

    function Word$cmp$(_a$2, _b$3) {
        var $205 = Word$cmp$go$(_a$2, _b$3, Cmp$eql);
        return $205;
    };
    const Word$cmp = x0 => x1 => Word$cmp$(x0, x1);

    function Word$gte$(_a$2, _b$3) {
        var $206 = Cmp$as_gte$(Word$cmp$(_a$2, _b$3));
        return $206;
    };
    const Word$gte = x0 => x1 => Word$gte$(x0, x1);

    function Pair$new$(_fst$3, _snd$4) {
        var $207 = ({
            _: 'Pair.new',
            'fst': _fst$3,
            'snd': _snd$4
        });
        return $207;
    };
    const Pair$new = x0 => x1 => Pair$new$(x0, x1);

    function Word$or$(_a$2, _b$3) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $209 = self.pred;
                var $210 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $212 = self.pred;
                            var $213 = (_a$pred$9 => {
                                var $214 = Word$o$(Word$or$(_a$pred$9, $212));
                                return $214;
                            });
                            var $211 = $213;
                            break;
                        case 'Word.i':
                            var $215 = self.pred;
                            var $216 = (_a$pred$9 => {
                                var $217 = Word$i$(Word$or$(_a$pred$9, $215));
                                return $217;
                            });
                            var $211 = $216;
                            break;
                        case 'Word.e':
                            var $218 = (_a$pred$7 => {
                                var $219 = Word$e;
                                return $219;
                            });
                            var $211 = $218;
                            break;
                    };
                    var $211 = $211($209);
                    return $211;
                });
                var $208 = $210;
                break;
            case 'Word.i':
                var $220 = self.pred;
                var $221 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $223 = self.pred;
                            var $224 = (_a$pred$9 => {
                                var $225 = Word$i$(Word$or$(_a$pred$9, $223));
                                return $225;
                            });
                            var $222 = $224;
                            break;
                        case 'Word.i':
                            var $226 = self.pred;
                            var $227 = (_a$pred$9 => {
                                var $228 = Word$i$(Word$or$(_a$pred$9, $226));
                                return $228;
                            });
                            var $222 = $227;
                            break;
                        case 'Word.e':
                            var $229 = (_a$pred$7 => {
                                var $230 = Word$e;
                                return $230;
                            });
                            var $222 = $229;
                            break;
                    };
                    var $222 = $222($220);
                    return $222;
                });
                var $208 = $221;
                break;
            case 'Word.e':
                var $231 = (_b$4 => {
                    var $232 = Word$e;
                    return $232;
                });
                var $208 = $231;
                break;
        };
        var $208 = $208(_b$3);
        return $208;
    };
    const Word$or = x0 => x1 => Word$or$(x0, x1);

    function Word$shift_right$one$go$(_word$2) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $234 = self.pred;
                var $235 = Word$o$(Word$shift_right$one$go$($234));
                var $233 = $235;
                break;
            case 'Word.i':
                var $236 = self.pred;
                var $237 = Word$i$(Word$shift_right$one$go$($236));
                var $233 = $237;
                break;
            case 'Word.e':
                var $238 = Word$o$(Word$e);
                var $233 = $238;
                break;
        };
        return $233;
    };
    const Word$shift_right$one$go = x0 => Word$shift_right$one$go$(x0);

    function Word$shift_right$one$(_word$2) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $240 = self.pred;
                var $241 = Word$shift_right$one$go$($240);
                var $239 = $241;
                break;
            case 'Word.i':
                var $242 = self.pred;
                var $243 = Word$shift_right$one$go$($242);
                var $239 = $243;
                break;
            case 'Word.e':
                var $244 = Word$e;
                var $239 = $244;
                break;
        };
        return $239;
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
                    var $245 = _value$3;
                    return $245;
                } else {
                    var $246 = (self - 1n);
                    var $247 = Word$shift_right$($246, Word$shift_right$one$(_value$3));
                    return $247;
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
                var $249 = self.pred;
                var $250 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $252 = self.pred;
                            var $253 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $255 = Word$i$(Word$subber$(_a$pred$10, $252, Bool$true));
                                    var $254 = $255;
                                } else {
                                    var $256 = Word$o$(Word$subber$(_a$pred$10, $252, Bool$false));
                                    var $254 = $256;
                                };
                                return $254;
                            });
                            var $251 = $253;
                            break;
                        case 'Word.i':
                            var $257 = self.pred;
                            var $258 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $260 = Word$o$(Word$subber$(_a$pred$10, $257, Bool$true));
                                    var $259 = $260;
                                } else {
                                    var $261 = Word$i$(Word$subber$(_a$pred$10, $257, Bool$true));
                                    var $259 = $261;
                                };
                                return $259;
                            });
                            var $251 = $258;
                            break;
                        case 'Word.e':
                            var $262 = (_a$pred$8 => {
                                var $263 = Word$e;
                                return $263;
                            });
                            var $251 = $262;
                            break;
                    };
                    var $251 = $251($249);
                    return $251;
                });
                var $248 = $250;
                break;
            case 'Word.i':
                var $264 = self.pred;
                var $265 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $267 = self.pred;
                            var $268 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $270 = Word$o$(Word$subber$(_a$pred$10, $267, Bool$false));
                                    var $269 = $270;
                                } else {
                                    var $271 = Word$i$(Word$subber$(_a$pred$10, $267, Bool$false));
                                    var $269 = $271;
                                };
                                return $269;
                            });
                            var $266 = $268;
                            break;
                        case 'Word.i':
                            var $272 = self.pred;
                            var $273 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $275 = Word$i$(Word$subber$(_a$pred$10, $272, Bool$true));
                                    var $274 = $275;
                                } else {
                                    var $276 = Word$o$(Word$subber$(_a$pred$10, $272, Bool$false));
                                    var $274 = $276;
                                };
                                return $274;
                            });
                            var $266 = $273;
                            break;
                        case 'Word.e':
                            var $277 = (_a$pred$8 => {
                                var $278 = Word$e;
                                return $278;
                            });
                            var $266 = $277;
                            break;
                    };
                    var $266 = $266($264);
                    return $266;
                });
                var $248 = $265;
                break;
            case 'Word.e':
                var $279 = (_b$5 => {
                    var $280 = Word$e;
                    return $280;
                });
                var $248 = $279;
                break;
        };
        var $248 = $248(_b$3);
        return $248;
    };
    const Word$subber = x0 => x1 => x2 => Word$subber$(x0, x1, x2);

    function Word$sub$(_a$2, _b$3) {
        var $281 = Word$subber$(_a$2, _b$3, Bool$false);
        return $281;
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
                    var $282 = Pair$new$(Bool$true, Word$or$(_value$5, _mask$6));
                    var self = $282;
                } else {
                    var $283 = Pair$new$(Bool$false, _value$5);
                    var self = $283;
                };
                switch (self._) {
                    case 'Pair.new':
                        var $284 = self.fst;
                        var $285 = self.snd;
                        var self = _shift$2;
                        if (self === 0n) {
                            var $287 = $285;
                            var $286 = $287;
                        } else {
                            var $288 = (self - 1n);
                            var _new_shift_copy$9 = Word$shift_right$(1n, _shift_copy$4);
                            var self = $284;
                            if (self) {
                                var $290 = Word$div$go$($288, Word$sub$(_sub_copy$3, _shift_copy$4), _new_shift_copy$9, $285);
                                var $289 = $290;
                            } else {
                                var $291 = Word$div$go$($288, _sub_copy$3, _new_shift_copy$9, $285);
                                var $289 = $291;
                            };
                            var $286 = $289;
                        };
                        return $286;
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
            var $293 = Word$to_zero$(_a$2);
            var $292 = $293;
        } else {
            var _shift$6 = (_a_bits$4 - _b_bits$5 <= 0n ? 0n : _a_bits$4 - _b_bits$5);
            var _shift_copy$7 = Word$shift_left$(_shift$6, _b$3);
            var $294 = Word$div$go$(_shift$6, _a$2, _shift_copy$7, Word$to_zero$(_a$2));
            var $292 = $294;
        };
        return $292;
    };
    const Word$div = x0 => x1 => Word$div$(x0, x1);
    const U32$div = a0 => a1 => ((a0 / a1) >>> 0);
    const U32$length = a0 => ((a0.length) >>> 0);

    function Cmp$as_eql$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
            case 'Cmp.gtn':
                var $296 = Bool$false;
                var $295 = $296;
                break;
            case 'Cmp.eql':
                var $297 = Bool$true;
                var $295 = $297;
                break;
        };
        return $295;
    };
    const Cmp$as_eql = x0 => Cmp$as_eql$(x0);

    function Word$eql$(_a$2, _b$3) {
        var $298 = Cmp$as_eql$(Word$cmp$(_a$2, _b$3));
        return $298;
    };
    const Word$eql = x0 => x1 => Word$eql$(x0, x1);
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
        var $299 = (parseInt(_chr$3, 16));
        return $299;
    };
    const VoxBox$parse_byte = x0 => x1 => VoxBox$parse_byte$(x0, x1);
    const U32$or = a0 => a1 => (a0 | a1);

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
    const U32$shl = a0 => a1 => ((a0 << a1) >>> 0);
    const Pos32$new = a0 => a1 => a2 => ((0 | a0 | (a1 << 12) | (a2 << 24)));
    const Col32$new = a0 => a1 => a2 => a3 => ((0 | a0 | (a1 << 8) | (a2 << 16) | (a3 << 24)));

    function Word$trim$(_new_size$2, _word$3) {
        var self = _new_size$2;
        if (self === 0n) {
            var $310 = Word$e;
            var $309 = $310;
        } else {
            var $311 = (self - 1n);
            var self = _word$3;
            switch (self._) {
                case 'Word.o':
                    var $313 = self.pred;
                    var $314 = Word$o$(Word$trim$($311, $313));
                    var $312 = $314;
                    break;
                case 'Word.i':
                    var $315 = self.pred;
                    var $316 = Word$i$(Word$trim$($311, $315));
                    var $312 = $316;
                    break;
                case 'Word.e':
                    var $317 = Word$o$(Word$trim$($311, Word$e));
                    var $312 = $317;
                    break;
            };
            var $309 = $312;
        };
        return $309;
    };
    const Word$trim = x0 => x1 => Word$trim$(x0, x1);
    const Unit$new = null;

    function Array$extract_tip$(_arr$2) {
        var self = _arr$2;
        switch (self._) {
            case 'Array.tip':
                var $319 = self.value;
                var $320 = $319;
                var $318 = $320;
                break;
            case 'Array.tie':
                var $321 = Unit$new;
                var $318 = $321;
                break;
        };
        return $318;
    };
    const Array$extract_tip = x0 => Array$extract_tip$(x0);

    function Array$extract_tie$(_arr$3) {
        var self = _arr$3;
        switch (self._) {
            case 'Array.tie':
                var $323 = self.lft;
                var $324 = self.rgt;
                var $325 = Pair$new$($323, $324);
                var $322 = $325;
                break;
            case 'Array.tip':
                var $326 = Unit$new;
                var $322 = $326;
                break;
        };
        return $322;
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
                        var $327 = self.pred;
                        var $328 = Word$foldl$(_w0$4(_nil$3), _w0$4, _w1$5, $327);
                        return $328;
                    case 'Word.i':
                        var $329 = self.pred;
                        var $330 = Word$foldl$(_w1$5(_nil$3), _w0$4, _w1$5, $329);
                        return $330;
                    case 'Word.e':
                        var $331 = _nil$3;
                        return $331;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Word$foldl = x0 => x1 => x2 => x3 => Word$foldl$(x0, x1, x2, x3);

    function Array$mut$(_idx$3, _f$4, _arr$5) {
        var $332 = Word$foldl$((_arr$6 => {
            var $333 = Array$tip$(_f$4(Array$extract_tip$(_arr$6)));
            return $333;
        }), (_rec$7 => _arr$8 => {
            var self = Array$extract_tie$(_arr$8);
            switch (self._) {
                case 'Pair.new':
                    var $335 = self.fst;
                    var $336 = self.snd;
                    var $337 = Array$tie$(_rec$7($335), $336);
                    var $334 = $337;
                    break;
            };
            return $334;
        }), (_rec$7 => _arr$8 => {
            var self = Array$extract_tie$(_arr$8);
            switch (self._) {
                case 'Pair.new':
                    var $339 = self.fst;
                    var $340 = self.snd;
                    var $341 = Array$tie$($339, _rec$7($340));
                    var $338 = $341;
                    break;
            };
            return $338;
        }), _idx$3)(_arr$5);
        return $332;
    };
    const Array$mut = x0 => x1 => x2 => Array$mut$(x0, x1, x2);

    function Array$set$(_idx$3, _val$4, _arr$5) {
        var $342 = Array$mut$(_idx$3, (_x$6 => {
            var $343 = _val$4;
            return $343;
        }), _arr$5);
        return $342;
    };
    const Array$set = x0 => x1 => x2 => Array$set$(x0, x1, x2);
    const Buffer32$set = a0 => a1 => a2 => ((a2[a0] = a1, a2));
    const VoxBox$set_pos = a0 => a1 => a2 => ((a2.buffer[a0 * 2] = a1, a2));
    const VoxBox$set_col = a0 => a1 => a2 => ((a2.buffer[a0 * 2 + 1] = a1, a2));

    function VoxBox$set_length$(_length$1, _img$2) {
        var self = _img$2;
        switch (self._) {
            case 'VoxBox.new':
                var $345 = self.capacity;
                var $346 = self.buffer;
                var $347 = VoxBox$new$(_length$1, $345, $346);
                var $344 = $347;
                break;
        };
        return $344;
    };
    const VoxBox$set_length = x0 => x1 => VoxBox$set_length$(x0, x1);
    const VoxBox$push = a0 => a1 => a2 => ((a2.buffer[a2.length * 2] = a0, a2.buffer[a2.length * 2 + 1] = a1, a2.length++, a2));

    function VoxBox$parse$(_voxdata$1) {
        var _siz$2 = ((((_voxdata$1.length) >>> 0) / 12) >>> 0);
        var _img$3 = VoxBox$alloc_capacity$(_siz$2);
        var _img$4 = (() => {
            var $349 = _img$3;
            var $350 = 0;
            var $351 = _siz$2;
            let _img$5 = $349;
            for (let _i$4 = $350; _i$4 < $351; ++_i$4) {
                var _x$6 = VoxBox$parse_byte$(((((_i$4 * 6) >>> 0) + 0) >>> 0), _voxdata$1);
                var _y$7 = VoxBox$parse_byte$(((((_i$4 * 6) >>> 0) + 1) >>> 0), _voxdata$1);
                var _z$8 = VoxBox$parse_byte$(((((_i$4 * 6) >>> 0) + 2) >>> 0), _voxdata$1);
                var _r$9 = VoxBox$parse_byte$(((((_i$4 * 6) >>> 0) + 3) >>> 0), _voxdata$1);
                var _g$10 = VoxBox$parse_byte$(((((_i$4 * 6) >>> 0) + 4) >>> 0), _voxdata$1);
                var _b$11 = VoxBox$parse_byte$(((((_i$4 * 6) >>> 0) + 5) >>> 0), _voxdata$1);
                var _pos$12 = ((0 | _x$6 | (_y$7 << 12) | (_z$8 << 24)));
                var _col$13 = ((0 | _r$9 | (_g$10 << 8) | (_b$11 << 16) | (255 << 24)));
                var $349 = ((_img$5.buffer[_img$5.length * 2] = _pos$12, _img$5.buffer[_img$5.length * 2 + 1] = _col$13, _img$5.length++, _img$5));
                _img$5 = $349;
            };
            return _img$5;
        })();
        var $348 = _img$4;
        return $348;
    };
    const VoxBox$parse = x0 => VoxBox$parse$(x0);
    const Web$Kaelin$Assets$hero$croni0_d_1 = VoxBox$parse$("0f0b16351d4d100b16351d4d0d0c15351d4d0e0c15351d4d0f0c156a3a86100c158e4a9d110c15351d4d120c15351d4d0c0d14351d4d0d0d146a3a860e0d146a3a860f0d148e4a9d100d146a3a86110d146a3a86120d146a3a86130d14351d4d0b0e13351d4d0c0e136a3a860d0e136a3a860e0e136a3a860f0e136a3a86100e136a3a86110e136a3a86120e136a3a86130e136a3a86140e13351d4d0a0f12351d4d0b0f126a3a860c0f126a3a860d0f126a3a860e0f126a3a860f0f126a3a86100f126a3a86110f126a3a86120f126a3a86130f126a3a86140f126a3a86150f12351d4d0a1011351d4d0b10116a3a860c10116a3a860d10116a3a860e10116a3a860f10116a3a861010116a3a861110116a3a861210116a3a861310116a3a861410116a3a86151011351d4d091110351d4d0a11106a3a860b11106a3a860c11106a3a860d11106a3a860e11106a3a860f11106a3a861011106a3a861111106a3a861211106a3a861311106a3a861411106a3a861511106a3a86161110351d4d09120f351d4d0a120f6a3a860b120f6a3a860c120f602d800d120f602d800e120f6a3a860f120f6a3a8610120f6a3a8611120f6a3a8612120f602d8013120f602d8014120f6a3a8615120f6a3a8616120f351d4d09130e351d4d0a130e602d800b130e602d800c130e351d4d0d130e351d4d0e130e6a3a860f130e6a3a8610130e6a3a8611130e6a3a8612130e351d4d13130e351d4d14130e602d8015130e602d8016130e351d4d09140d351d4d0a140d602d800b140d351d4d0c140d351d4d0d140d531e480e140d351d4d0f140d6a3a8610140d6a3a8611140d351d4d12140d531e4813140d351d4d14140d351d4d15140d4a358016140d351d4d09150c351d4d0a150c4a35800b150c351d4d0c150c531e480d150cdf3e460e150c531e480f150c351d4d10150c351d4d11150c531e4812150cdf3e4613150c531e4814150c351d4d15150c4a358016150c351d4d0a160b351d4d0b160b4a35800c160b351d4d0d160b531e480e160b351d4d0f160b351d4d10160b351d4d11160b351d4d12160b531e4813160b351d4d14160b4a358015160b351d4d0b170a351d4d0c170a4a35800d170a8e4a9d0e170a351d4d0f170a351d4d10170a351d4d11170a351d4d12170a8e4a9d13170a4a358014170a351d4d0d1809351d4d0e1809602d800f1809602d801018094a3580111809602d80121809351d4d0c1908351d4d0d19086a3a860e19086a3a860f19086a3a861019084a35801119086a3a861219086a3a86131908351d4d0c1a07351d4d0d1a076a3a860e1a076a3a860f1a076a3a86101a074a3580111a076a3a86121a076a3a86131a07351d4d0c1b06351d4d0d1b068e4a9d0e1b066a3a860f1b066a3a86101b064a3580111b066a3a86121b068e4a9d131b06351d4d0d1c05351d4d0e1c05351d4d0f1c05351d4d101c05351d4d111c05351d4d121c05351d4d111d04351d4d121d04351d4d");

    function I32$new$(_value$1) {
        var $352 = word_to_i32(_value$1);
        return $352;
    };
    const I32$new = x0 => I32$new$(x0);

    function Word$neg$aux$(_word$2, _inc$3) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $354 = self.pred;
                var self = _inc$3;
                if (self) {
                    var $356 = Word$o$(Word$neg$aux$($354, Bool$true));
                    var $355 = $356;
                } else {
                    var $357 = Word$i$(Word$neg$aux$($354, Bool$false));
                    var $355 = $357;
                };
                var $353 = $355;
                break;
            case 'Word.i':
                var $358 = self.pred;
                var self = _inc$3;
                if (self) {
                    var $360 = Word$i$(Word$neg$aux$($358, Bool$false));
                    var $359 = $360;
                } else {
                    var $361 = Word$o$(Word$neg$aux$($358, Bool$false));
                    var $359 = $361;
                };
                var $353 = $359;
                break;
            case 'Word.e':
                var $362 = Word$e;
                var $353 = $362;
                break;
        };
        return $353;
    };
    const Word$neg$aux = x0 => x1 => Word$neg$aux$(x0, x1);

    function Word$neg$(_word$2) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $364 = self.pred;
                var $365 = Word$o$(Word$neg$aux$($364, Bool$true));
                var $363 = $365;
                break;
            case 'Word.i':
                var $366 = self.pred;
                var $367 = Word$i$(Word$neg$aux$($366, Bool$false));
                var $363 = $367;
                break;
            case 'Word.e':
                var $368 = Word$e;
                var $363 = $368;
                break;
        };
        return $363;
    };
    const Word$neg = x0 => Word$neg$(x0);
    const I32$neg = a0 => ((-a0));
    const Int$to_i32 = a0 => (Number(a0));
    const Int$new = a0 => a1 => (a0 - a1);
    const Int$from_nat = a0 => (a0);
    const Nat$to_i32 = a0 => (Number(a0));

    function List$cons$(_head$2, _tail$3) {
        var $369 = ({
            _: 'List.cons',
            'head': _head$2,
            'tail': _tail$3
        });
        return $369;
    };
    const List$cons = x0 => x1 => List$cons$(x0, x1);

    function Web$Kaelin$Skill$new$(_id$1, _range$2, _effects$3, _key$4) {
        var $370 = ({
            _: 'Web.Kaelin.Skill.new',
            'id': _id$1,
            'range': _range$2,
            'effects': _effects$3,
            'key': _key$4
        });
        return $370;
    };
    const Web$Kaelin$Skill$new = x0 => x1 => x2 => x3 => Web$Kaelin$Skill$new$(x0, x1, x2, x3);

    function Web$Kaelin$Skill$Effect$hp$(_value$1, _modifier$2, _area$3, _indicator$4) {
        var $371 = ({
            _: 'Web.Kaelin.Skill.Effect.hp',
            'value': _value$1,
            'modifier': _modifier$2,
            'area': _area$3,
            'indicator': _indicator$4
        });
        return $371;
    };
    const Web$Kaelin$Skill$Effect$hp = x0 => x1 => x2 => x3 => Web$Kaelin$Skill$Effect$hp$(x0, x1, x2, x3);
    const Web$Kaelin$Skill$Modifier$hp$damage = ({
        _: 'Web.Kaelin.Skill.Modifier.hp.damage'
    });

    function Web$Kaelin$Skill$area$radial$(_range$1) {
        var $372 = ({
            _: 'Web.Kaelin.Skill.area.radial',
            'range': _range$1
        });
        return $372;
    };
    const Web$Kaelin$Skill$area$radial = x0 => Web$Kaelin$Skill$area$radial$(x0);
    const Web$Kaelin$Skill$area$indicator$red = ({
        _: 'Web.Kaelin.Skill.area.indicator.red'
    });
    const Web$Kaelin$Heroes$Croni$skills$quick_shot = Web$Kaelin$Skill$new$(1, 2n, List$cons$(Web$Kaelin$Skill$Effect$hp$(7, Web$Kaelin$Skill$Modifier$hp$damage, Web$Kaelin$Skill$area$radial$(1n), Maybe$some$(Web$Kaelin$Skill$area$indicator$red)), List$nil), 48);
    const Web$Kaelin$Skill$area$single = ({
        _: 'Web.Kaelin.Skill.area.single'
    });
    const Web$Kaelin$Skill$Modifier$hp$heal = ({
        _: 'Web.Kaelin.Skill.Modifier.hp.heal'
    });
    const Web$Kaelin$Skill$area$self = ({
        _: 'Web.Kaelin.Skill.area.self'
    });
    const Web$Kaelin$Skill$area$indicator$green = ({
        _: 'Web.Kaelin.Skill.area.indicator.green'
    });
    const Web$Kaelin$Heroes$Croni$skills$vampirism = Web$Kaelin$Skill$new$(4, 3n, List$cons$(Web$Kaelin$Skill$Effect$hp$(5, Web$Kaelin$Skill$Modifier$hp$damage, Web$Kaelin$Skill$area$single, Maybe$some$(Web$Kaelin$Skill$area$indicator$red)), List$cons$(Web$Kaelin$Skill$Effect$hp$(8, Web$Kaelin$Skill$Modifier$hp$heal, Web$Kaelin$Skill$area$self, Maybe$some$(Web$Kaelin$Skill$area$indicator$green)), List$nil)), 86);

    function Web$Kaelin$Skill$Effect$position$(_value$1, _modifier$2, _area$3, _indicator$4) {
        var $373 = ({
            _: 'Web.Kaelin.Skill.Effect.position',
            'value': _value$1,
            'modifier': _modifier$2,
            'area': _area$3,
            'indicator': _indicator$4
        });
        return $373;
    };
    const Web$Kaelin$Skill$Effect$position = x0 => x1 => x2 => x3 => Web$Kaelin$Skill$Effect$position$(x0, x1, x2, x3);
    const Web$Kaelin$Skill$Modifier$position$move_to = ({
        _: 'Web.Kaelin.Skill.Modifier.position.move_to'
    });
    const Web$Kaelin$Skill$area$indicator$blue = ({
        _: 'Web.Kaelin.Skill.area.indicator.blue'
    });

    function Web$Kaelin$Skill$move$(_range$1) {
        var $374 = Web$Kaelin$Skill$new$(1, _range$1, List$cons$(Web$Kaelin$Skill$Effect$position$(0, Web$Kaelin$Skill$Modifier$position$move_to, Web$Kaelin$Skill$area$single, Maybe$some$(Web$Kaelin$Skill$area$indicator$blue)), List$nil), 88);
        return $374;
    };
    const Web$Kaelin$Skill$move = x0 => Web$Kaelin$Skill$move$(x0);
    const Web$Kaelin$Heroes$Croni$skills = List$cons$(Web$Kaelin$Heroes$Croni$skills$quick_shot, List$cons$(Web$Kaelin$Heroes$Croni$skills$vampirism, List$cons$(Web$Kaelin$Skill$move$(2n), List$nil)));
    const Web$Kaelin$Heroes$Croni$croni = Web$Kaelin$Hero$new$(1, Web$Kaelin$Assets$hero$croni0_d_1, 25, Web$Kaelin$Heroes$Croni$skills);
    const Web$Kaelin$Assets$hero$cyclope_d_1 = VoxBox$parse$("0e0a212c333d0f0a212c333d100a212c333d110a212c333d0d0b202c333d0e0b20fff9e10f0b20fff9e1100b20fff9e1110b20fff9e1120b202c333d0d0c1f2c333d0e0c1ffff9e10f0c1ffff9e1100c1ffff9e1110c1ffff9e1120c1f2c333d0c0d1e2729600d0d1e2729600e0d1efff9e10f0d1eccc8b7100d1eccc8b7110d1eccc8b7120d1e272960130d1e272960140d1e2729600c0e1d2729600d0e1d2729600e0e1dfff9e10f0e1dccc8b7100e1dccc8b7110e1dccc8b7120e1d272960130e1d272960140e1d272960050f1c272960060f1c272960070f1c272960090f1c2729600a0f1c2729600b0f1c2729600c0f1c5176b80d0f1cfff9e10e0f1cdfdbc80f0f1cdfdbc8100f1cdfdbc8110f1cdfdbc8120f1cccc8b7130f1c5176b8140f1c5176b8150f1c27296005101b27296006101b799cd307101b799cd308101b27296009101b5176b80a101b5176b80b101b5176b80c101b799cd30d101b5176b80e101bdfdbc80f101bccc8b710101bccc8b711101bccc8b712101b5176b813101b799cd314101b799cd315101b5176b816101b27296017101b27296018101b27296005111a27296006111a799cd307111a799cd308111a27296009111a5176b80a111a5176b80b111a5176b80c111a799cd30d111a5176b80e111adfdbc80f111accc8b710111accc8b711111accc8b712111a5176b813111a799cd314111a799cd315111a5176b816111a27296017111a27296018111a2729600512192729600612195176b80712195176b8081219394c87091219799cd30a1219799cd30b1219799cd30c12195176b80d12194a2b710e12194a2b710f12194a2b711012194a2b711112194a2b711212194a2b711312195176b81412195176b8151219799cd31612192729601712192729601812192729600513182729600613185176b80713185176b8081318394c87091318799cd30a1318799cd30b1318799cd30c13185176b80d13184a2b710e13184a2b710f13184a2b711013184a2b711113184a2b711213184a2b711313185176b81413185176b8151318799cd3161318272960171318272960181318272960051417272960061417272960071417272960081417394c870914175176b80a14175176b80b14175176b80c14174a2b710d1417dab04d0e1417dab04d0f1417dab04d101417dab04d111417dab04d121417dab04d1314174a2b711414174a2b711514175176b8161417394c87171417394c87181417394c871914172729601a1417272960051516272960061516799cd3071516799cd3081516394c870915165176b80a15165176b80b15165176b80c15164a2b710d1516dab04d0e1516fff9e10f1516fff9e1101516fff9e1111516fff9e1121516dab04d1315164a2b711415164a2b711515165176b8161516394c87171516394c87181516394c87191516799cd31a1516272960051615272960061615799cd3071615799cd3081615394c870916155176b80a16155176b80b16155176b80c16154a2b710d1615dab04d0e1615fff9e10f1615fff9e1101615fff9e1111615fff9e1121615dab04d1316154a2b711416154a2b711516155176b8161615394c87171615394c87181615394c87191615799cd31a1615272960051714272960061714272960071714272960081714394c870917145176b80a17145176b80b17145176b80c17144a2b710d1714dab04d0e17142421260f1714242126101714242126111714242126121714dab04d1317144a2b711417144a2b711517145176b8161714394c87171714394c87181714394c871917142729601a17145176b81b17142729600518132729600618135176b80718135176b8081813394c870918135176b80a18135176b80b18135176b80c18135176b80d18134a2b710e18134a2b710f18134a2b711018134a2b711118134a2b711218134a2b711318135176b81418135176b81518135176b8161813394c87171813394c87181813394c87191813799cd31a1813799cd31b18132729600519122729600619125176b80719125176b8081912394c870919125176b80a19125176b80b19125176b80c19125176b80d19124a2b710e19124a2b710f19124a2b711019124a2b711119124a2b711219124a2b711319125176b81419125176b81519125176b8161912394c87171912394c87181912394c87191912799cd31a1912799cd31b1912272960051a11272960061a115176b8071a115176b8081a11394c87091a115176b80a1a115176b80b1a115176b80c1a115176b80d1a114a2b710e1a114a2b710f1a114a2b71101a114a2b71111a114a2b71121a114a2b71131a115176b8141a115176b8151a115176b8161a11394c87171a11394c87181a11394c87191a11799cd31a1a11799cd31b1a11272960051b10272960061b10799cd3071b10799cd3081b105176b8091b10394c870a1b10394c870b1b10394c870c1b10dfdbc80d1b105176b80e1b105176b80f1b105176b8101b105176b8111b105176b8121b105176b8131b10dfdbc8141b10dfdbc8151b10394c87161b105176b8171b105176b8181b105176b8191b105176b81a1b10799cd31b1b10272960061c0f272960071c0f272960081c0f272960091c0f394c870a1c0f394c870b1c0f394c870c1c0fdfdbc80d1c0f4662a10e1c0f4662a10f1c0f4662a1101c0f4662a1111c0f4662a1121c0f4662a1131c0fdfdbc8141c0fdfdbc8151c0f394c87161c0f394c87171c0f394c87181c0f394c87191c0f5176b81a1c0f5176b81b1c0f272960081d0e272960091d0e5176b80a1d0e5176b80b1d0e5176b80c1d0e394c870d1d0e394c870e1d0e394c870f1d0e394c87101d0e394c87111d0e394c87121d0e394c87131d0e394c87141d0e394c87151d0e5176b8161d0e394c87171d0e394c87181d0e394c87191d0e5176b81a1d0e5176b81b1d0e272960081e0d272960091e0d5176b80a1e0d5176b80b1e0d5176b80c1e0d394c870d1e0d394c870e1e0d394c870f1e0d394c87101e0d394c87111e0d394c87121e0d394c87131e0d394c87141e0d394c87151e0d5176b8161e0d394c87171e0d394c87181e0d394c87191e0d5176b81a1e0d5176b81b1e0d272960081f0c272960091f0c5176b80a1f0c5176b80b1f0c5176b80c1f0c394c870d1f0c394c870e1f0c394c870f1f0c394c87101f0c394c87111f0c394c87121f0c394c87131f0c394c87141f0c394c87151f0c5176b8161f0c394c87171f0c394c87181f0c394c87191f0c5176b81a1f0c5176b81b1f0c27296008200b27296009200b5176b80a200b5176b80b200b5176b80c200b5176b80d200b5176b80e200b5176b80f200b5176b810200b5176b811200b5176b812200b5176b813200b5176b814200b5176b815200b394c8716200b799cd317200b799cd318200b799cd319200b5176b81a200b5176b81b200b27296008210a27296009210a8e4a9d0a210a8e4a9d0b210a8e4a9d0c210a8e4a9d0d210a5176b80e210a5176b80f210a5176b810210a5176b811210a5176b812210a5176b813210a394c8714210a394c8715210a394c8716210a799cd317210a799cd318210a799cd319210a799cd31a210a5176b81b210a2729600922092729600a22092729600b22092729600c22094a2b710d22098e4a9d0e22098e4a9d0f22098e4a9d1022098e4a9d1122098e4a9d1222098e4a9d132209394c87142209394c871522095176b8162209394c87172209394c87182209394c87192209394c871a22092729600923082729600a23082729600b23082729600c23084a2b710d23088e4a9d0e23088e4a9d0f23088e4a9d1023088e4a9d1123088e4a9d1223088e4a9d132308394c87142308394c871523085176b8162308394c87172308394c87182308394c87192308394c871a23082729600924072729600a24072729600b24072729600c24074a2b710d24078e4a9d0e24078e4a9d0f24078e4a9d1024078e4a9d1124078e4a9d1224078e4a9d132407394c87142407394c871524075176b8162407394c87172407394c87182407394c87192407394c871a24072729600925062729600a25062729600b25062729600c25065176b80d25064a2b710e25068e4a9d0f25068e4a9d1025068e4a9d1125068e4a9d1225064a2b71132506394c87142506394c87152506799cd3162506799cd3172506799cd3182506799cd31925065176b81a25062729600926052729600a26052729600b26052729600c2605799cd30d2605799cd30e26054a2b710f26054a2b711026054a2b711126054a2b711226052729601326052729601426052729601526052729601626052729601726052729601826052729601926052729600927042729600a27042729600b27042729600c27042729600d27042729600e2704272960");
    const Web$Kaelin$Heroes$Cyclope$cyclope = Web$Kaelin$Hero$new$(2, Web$Kaelin$Assets$hero$cyclope_d_1, 25, List$nil);
    const Web$Kaelin$Assets$hero$lela_d_1 = VoxBox$parse$("091219fb4d4d0a1219fb4d4d0b1219fb4d4d0c1219fb4d4d131219fb4d4d141219fb4d4d151219fb4d4d161219fb4d4d081318fb4d4d0913182b496c0a13182b496c0b13182b496c0c13182b496c0d1318fb4d4d121318fb4d4d1313182b496c1413182b496c1513182b496c1613182b496c171318fb4d4d071417fb4d4d0814172b496c09141781aeff0a141781aeff0b141781aeff0c141781aeff0d14172b496c0e1417fb4d4d0f1417fb4d4d101417fb4d4d111417fb4d4d1214172b496c13141781aeff14141781aeff15141781aeff16141781aeff1714172b496c181417fb4d4d071516fb4d4d0815161f3b5b091516538ccf0a1516538ccf0b1516538ccf0c1516538ccf0d1516538ccf0e15162b496c0f15162b496c1015162b496c1115162b496c121516538ccf131516538ccf141516538ccf151516538ccf161516538ccf1715161f3b5b181516fb4d4d071615fb4d4d0816151f3b5b091615538ccf0a1615538ccf0b1615538ccf0c1615538ccf0d1615538ccf0e161581aeff0f161581aeff10161581aeff11161581aeff121615538ccf131615538ccf141615538ccf151615538ccf161615538ccf1716151f3b5b181615fb4d4d071714fb4d4d0817141f3b5b091714538ccf0a1714538ccf0b1714538ccf0c1714538ccf0d1714538ccf0e1714538ccf0f1714538ccf101714538ccf111714538ccf121714538ccf131714538ccf141714538ccf151714538ccf161714538ccf1717141f3b5b181714fb4d4d081813fb4d4d0918131f3b5b0a1813538ccf0b1813538ccf0c1813538ccf0d1813538ccf0e1813538ccf0f1813cb4646101813cb4646111813538ccf121813538ccf131813538ccf141813538ccf151813538ccf1618131f3b5b171813fb4d4d091912fb4d4d0a19121f3b5b0b1912538ccf0c1912538ccf0d1912538ccf0e1912538ccf0f1912ad1f1f101912ad1f1f111912538ccf121912538ccf131912538ccf141912538ccf1519121f3b5b161912fb4d4d091a11fb4d4d0a1a111f3b5b0b1a11538ccf0c1a11538ccf0d1a11cb46460e1a11538ccf0f1a11538ccf101a11538ccf111a11538ccf121a11cb4646131a11538ccf141a11538ccf151a111f3b5b161a11fb4d4d091b10fb4d4d0a1b101f3b5b0b1b10538ccf0c1b10538ccf0d1b10ad1f1f0e1b10538ccf0f1b103d5497101b103d5497111b10538ccf121b10ad1f1f131b10538ccf141b10538ccf151b101f3b5b161b10fb4d4d0a1c0ffb4d4d0b1c0f1f3b5b0c1c0f538ccf0d1c0f538ccf0e1c0f538ccf0f1c0f2d4382101c0f2d4382111c0f538ccf121c0f538ccf131c0f538ccf141c0f1f3b5b151c0ffb4d4d0b1d0efb4d4d0c1d0e1f3b5b0d1d0e3a67b70e1d0e538ccf0f1d0e203368101d0e203368111d0e538ccf121d0e3a67b7131d0e1f3b5b141d0efb4d4d0a1e0dfb4d4d0b1e0d1f3b5b0c1e0d538ccf0d1e0d538ccf0e1e0d3a67b70f1e0d3a67b7101e0d3a67b7111e0d3a67b7121e0d538ccf131e0d538ccf141e0d1f3b5b151e0dfb4d4d091f0cfb4d4d0a1f0c1f3b5b0b1f0c81aeff0c1f0c3a71b10d1f0c538ccf0e1f0c81aeff0f1f0c81aeff101f0c81aeff111f0c81aeff121f0c538ccf131f0c3a71b1141f0c81aeff151f0c1f3b5b161f0cfb4d4d08200bfb4d4d09200b1f3b5b0a200b538ccf0b200b538ccf0c200b3a71b10d200b538ccf0e200b538ccf0f200b538ccf10200b538ccf11200b538ccf12200b538ccf13200b3a71b114200b538ccf15200b538ccf16200b1f3b5b17200bfb4d4d08210afb4d4d09210a1f3b5b0a210a538ccf0b210a538ccf0c210a3a71b10d210a538ccf0e210a538ccf0f210a538ccf10210a538ccf11210a538ccf12210a538ccf13210a3a71b114210a538ccf15210a538ccf16210a1f3b5b17210afb4d4d082209fb4d4d0922091f3b5b0a2209538ccf0b2209538ccf0c22092753860d2209538ccf0e2209538ccf0f2209538ccf102209538ccf112209538ccf122209538ccf132209275386142209538ccf152209538ccf1622091f3b5b172209fb4d4d092308fb4d4d0a23081f3b5b0b23081f3b5b0c23081f3b5b0d23083a67b70e2308538ccf0f2308538ccf102308538ccf112308538ccf1223083a67b71323081f3b5b1423081f3b5b1523081f3b5b162308fb4d4d0a2407fb4d4d0b2407fb4d4d0c2407fb4d4d0d24071f3b5b0e24073a67b70f2407538ccf102407538ccf1124073a67b71224071f3b5b132407fb4d4d142407fb4d4d152407fb4d4d0d2506fb4d4d0e25061f3b5b0f25063a67b71025063a67b71125061f3b5b122506fb4d4d0e2605fb4d4d0f26051f3b5b1026051f3b5b112605fb4d4d0f2704fb4d4d102704fb4d4d");
    const Web$Kaelin$Heroes$Lela$lela = Web$Kaelin$Hero$new$(3, Web$Kaelin$Assets$hero$lela_d_1, 25, List$nil);
    const Web$Kaelin$Assets$hero$octoking_d_1 = VoxBox$parse$("0a0a21192a020b0a21192a020d0a21192a020e0a21192a02100a21192a02110a21192a02120a21192a02130a21192a02150a21192a02160a21192a02180a21192a02190a21192a020a0b20192a020b0b20192a020d0b20192a020e0b20192a02100b20192a02110b20192a02120b20192a02130b20192a02150b20192a02160b20192a02180b20192a02190b20192a02080c1f192a02090c1f192a020a0c1fe6d7510b0c1fe6d7510c0c1f192a020d0c1f70681e0e0c1f70681e0f0c1f192a02100c1ffff6a6110c1ffff6a6120c1ffff6a6130c1ffff6a6140c1f192a02150c1f70681e160c1f70681e170c1f192a02180c1fe6d751190c1fe6d7511a0c1f192a021b0c1f192a02080d1e192a02090d1e192a020a0d1ee6d7510b0d1ee6d7510c0d1efff6a60d0d1e192a020e0d1e192a020f0d1ee6d751100d1ee6d751110d1ee6d751120d1ee6d751130d1ee6d751140d1ee6d751150d1e192a02160d1e192a02170d1efff6a6180d1ee6d751190d1ee6d7511a0d1e192a021b0d1e192a02080e1d192a02090e1d192a020a0e1de6d7510b0e1de6d7510c0e1dfff6a60d0e1d192a020e0e1d192a020f0e1de6d751100e1de6d751110e1de6d751120e1de6d751130e1de6d751140e1de6d751150e1d192a02160e1d192a02170e1dfff6a6180e1de6d751190e1de6d7511a0e1d192a021b0e1d192a02080f1c192a02090f1c192a020a0f1cc9ae530b0f1cc9ae530c0f1ce6d7510d0f1ce6d7510e0f1ce6d7510f0f1ce6d751100f1cb8321d110f1cb8321d120f1cb8321d130f1cb8321d140f1ce6d751150f1ce6d751160f1ce6d751170f1ce6d751180f1cc9ae53190f1cc9ae531a0f1c192a021b0f1c192a0208101b192a0209101b192a020a101bc9ae530b101bc9ae530c101be6d7510d101be6d7510e101be6d7510f101be6d75110101bb8321d11101bb8321d12101bb8321d13101bb8321d14101be6d75115101be6d75116101be6d75117101be6d75118101bc9ae5319101bc9ae531a101b192a021b101b192a0205111a192a0206111a192a0207111a192a0208111a192a0209111a192a020a111a4281350b111a4281350c111a4281350d111a4281350e111a4281350f111ac9ae5310111ac9ae5311111ac9ae5312111ac9ae5313111ac9ae5314111ac9ae5315111a42813516111a42813517111a42813518111a42813519111a4281351a111a192a021b111a192a021c111a192a021d111a192a021e111a192a02041219192a020512199fd95d0612199fd95d0712199fd95d081219192a02091219192a020a12199fd95d0b12199fd95d0c12195ea6420d12195ea6420e12195ea6420f12194281351012194281351112194281351212194281351312194281351412194281351512195ea6421612195ea6421712195ea6421812199fd95d1912199fd95d1a1219192a021b1219192a021c12199fd95d1d12199fd95d1e12199fd95d1f1219192a02041318192a020513189fd95d0613189fd95d0713189fd95d081318192a02091318192a020a13189fd95d0b13189fd95d0c13185ea6420d13185ea6420e13185ea6420f13184281351013184281351113184281351213184281351313184281351413184281351513185ea6421613185ea6421713185ea6421813189fd95d1913189fd95d1a1318192a021b1318192a021c13189fd95d1d13189fd95d1e13189fd95d1f1318192a02021417192a02031417192a020414179fd95d0514175ea6420614175ea6420714175ea642081417192a02091417192a020a14175ea6420b14175ea6420c14175ea6420d14175ea6420e14175ea6420f14175ea6421014175ea6421114175ea6421214175ea6421314175ea6421414175ea6421514175ea6421614175ea6421714175ea6421814175ea6421914175ea6421a1417192a021b1417192a021c14175ea6421d14175ea6421e14175ea6421f14179fd95d201417192a02211417192a02041516192a020515165ea6420615165ea6420715165ea642081516192a02091516192a020a15164281350b15164281350c15164281350d15164281350e15164281350f15164281351015165ea6421115165ea6421215165ea6421315165ea6421415164281351515164281351615164281351715164281351815164281351915164281351a1516192a021b1516192a021c15165ea6421d15165ea6421e15165ea6421f1516192a02041615192a020516155ea6420616155ea6420716155ea642081615192a02091615192a020a16154281350b16154281350c16154281350d16154281350e16154281350f16154281351016155ea6421116155ea6421216155ea6421316155ea6421416154281351516154281351616154281351716154281351816154281351916154281351a1615192a021b1615192a021c16155ea6421d16155ea6421e16155ea6421f1615192a02051714192a02061714192a020717145ea6420817145ea6420917145ea6420a1714192a020b1714192a020c17144281350d1714e6d7510e1714e6d7510f1714e6d751101714428135111714428135121714428135131714428135141714e6d751151714e6d751161714e6d751171714428135181714192a02191714192a021a17145ea6421b17145ea6421c17145ea6421d1714192a021e1714192a02071813192a020818135ea6420918135ea6420a1813366d2a0b1813366d2a0c1813192a020d18134281350e18134281350f1813173e0f101813173e0f111813173e0f121813173e0f131813173e0f141813173e0f151813428135161813428135171813192a02181813366d2a191813366d2a1a18135ea6421b18135ea6421c1813192a02071912192a020819125ea6420919125ea6420a1912366d2a0b1912366d2a0c1912192a020d19124281350e19124281350f1912173e0f101912173e0f111912173e0f121912173e0f131912173e0f141912173e0f151912428135161912428135171912192a02181912366d2a191912366d2a1a19125ea6421b19125ea6421c1912192a02051a11192a02061a11192a02071a11192a02081a11428135091a114281350a1a115ea6420b1a115ea6420c1a114281350d1a11192a020e1a11192a020f1a119fd95d101a119fd95d111a119fd95d121a119fd95d131a119fd95d141a119fd95d151a11192a02161a11192a02171a11428135181a115ea642191a115ea6421a1a114281351b1a114281351c1a11192a021d1a11192a021e1a11192a02051b10192a02061b10192a02071b10192a02081b10428135091b104281350a1b105ea6420b1b105ea6420c1b104281350d1b10192a020e1b10192a020f1b109fd95d101b109fd95d111b109fd95d121b109fd95d131b109fd95d141b109fd95d151b10192a02161b10192a02171b10428135181b105ea642191b105ea6421a1b104281351b1b104281351c1b10192a021d1b10192a021e1b10192a02041c0f192a02051c0f366d2a061c0f366d2a071c0f192a02081c0f5ea642091c0f5ea6420a1c0f4281350b1c0f4281350c1c0f192a020d1c0f9fd95d0e1c0f9fd95d0f1c0f5ea642101c0f428135111c0f428135121c0f428135131c0f428135141c0f5ea642151c0f9fd95d161c0f9fd95d171c0f192a02181c0f428135191c0f4281351a1c0f5ea6421b1c0f5ea6421c1c0f192a021d1c0f366d2a1e1c0f366d2a1f1c0f192a02021d0e192a02031d0e192a02041d0e428135051d0e428135061d0e428135071d0e192a02081d0e428135091d0e4281350a1d0e4281350b1d0e4281350c1d0e192a020d1d0e5ea6420e1d0e5ea6420f1d0e5ea642101d0e428135111d0e428135121d0e428135131d0e428135141d0e5ea642151d0e5ea642161d0e5ea642171d0e192a02181d0e428135191d0e4281351a1d0e4281351b1d0e4281351c1d0e192a021d1d0e4281351e1d0e4281351f1d0e428135201d0e192a02211d0e192a02021e0d192a02031e0d192a02041e0d428135051e0d428135061e0d428135071e0d192a02081e0d428135091e0d4281350a1e0d4281350b1e0d4281350c1e0d192a020d1e0d5ea6420e1e0d5ea6420f1e0d5ea642101e0d428135111e0d428135121e0d428135131e0d428135141e0d5ea642151e0d5ea642161e0d5ea642171e0d192a02181e0d428135191e0d4281351a1e0d4281351b1e0d4281351c1e0d192a021d1e0d4281351e1e0d4281351f1e0d428135201e0d192a02211e0d192a02001f0c192a02011f0c192a02021f0c9fd95d031f0c9fd95d041f0c5ea642051f0c428135061f0c428135071f0c192a02081f0c5ea642091f0c5ea6420a1f0c4281350b1f0c4281350c1f0c192a020d1f0c5ea6420e1f0c5ea6420f1f0c5ea642101f0c428135111f0c428135121f0c428135131f0c428135141f0c5ea642151f0c5ea642161f0c5ea642171f0c192a02181f0c428135191f0c4281351a1f0c5ea6421b1f0c5ea6421c1f0c192a021d1f0c4281351e1f0c4281351f1f0c5ea642201f0c9fd95d211f0c9fd95d221f0c192a0202200b192a0203200b192a0204200b192a0205200b42813506200b42813507200b42813508200b192a0209200b192a020a200b366d2a0b200b366d2a0c200b192a020d200b5ea6420e200b5ea6420f200b5ea64210200b42813511200b42813512200b42813513200b42813514200b5ea64215200b5ea64216200b5ea64217200b192a0218200b366d2a19200b366d2a1a200b192a021b200b192a021c200b4281351d200b4281351e200b4281351f200b192a0220200b192a0221200b192a0202210a192a0203210a192a0204210a192a0205210a42813506210a42813507210a42813508210a192a0209210a192a020a210a366d2a0b210a366d2a0c210a192a020d210a5ea6420e210a5ea6420f210a5ea64210210a42813511210a42813512210a42813513210a42813514210a5ea64215210a5ea64216210a5ea64217210a192a0218210a366d2a19210a366d2a1a210a192a021b210a192a021c210a4281351d210a4281351e210a4281351f210a192a0220210a192a0221210a192a02052209192a02062209192a02072209192a020a2209192a020b2209192a020c2209192a020d22095ea6420e22095ea6420f22094281351022094281351122094281351222094281351322094281351422094281351522095ea6421622095ea642172209192a02182209192a02192209192a021c2209192a021d2209192a021e2209192a02052308192a02062308192a02072308192a020a2308192a020b2308192a020c2308192a020d23085ea6420e23085ea6420f23084281351023084281351123084281351223084281351323084281351423084281351523085ea6421623085ea642172308192a02182308192a02192308192a021c2308192a021d2308192a021e2308192a02082407192a02092407192a020a2407192a020b2407192a020c24075ea6420d24074281350e24074281350f2407428135102407366d2a112407366d2a122407366d2a132407366d2a1424074281351524074281351624074281351724075ea642182407192a02192407192a021a2407192a021b2407192a02072506192a020825065ea6420925065ea6420a25065ea6420b25065ea6420c25064281350d25064281350e25064281350f2506366d2a102506192a02112506192a02122506192a02132506192a02142506366d2a1525064281351625064281351725064281351825065ea6421925065ea6421a25065ea6421b25065ea6421c2506192a02072605192a020826055ea6420926055ea6420a26055ea6420b26055ea6420c26054281350d26054281350e26054281350f2605366d2a102605192a02112605192a02122605192a02132605192a02142605366d2a1526054281351626054281351726054281351826055ea6421926055ea6421a26055ea6421b26055ea6421c2605192a02082704192a02092704192a020a2704192a020b2704192a020c2704192a020d2704192a020e2704192a020f2704192a02142704192a02152704192a02162704192a02172704192a02182704192a02192704192a021a2704192a021b2704192a02");
    const Web$Kaelin$Heroes$Octoking$octoking = Web$Kaelin$Hero$new$(4, Web$Kaelin$Assets$hero$octoking_d_1, 25, List$nil);

    function Maybe$default$(_m$2, _a$3) {
        var self = _m$2;
        switch (self._) {
            case 'Maybe.some':
                var $376 = self.value;
                var $377 = $376;
                var $375 = $377;
                break;
            case 'Maybe.none':
                var $378 = _a$3;
                var $375 = $378;
                break;
        };
        return $375;
    };
    const Maybe$default = x0 => x1 => Maybe$default$(x0, x1);

    function List$(_A$1) {
        var $379 = null;
        return $379;
    };
    const List = x0 => List$(x0);
    const I32$add = a0 => a1 => ((a0 + a1) >> 0);
    const I32$mul = a0 => a1 => ((a0 * a1) >> 0);
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
        var $380 = (((_n$1) >>> 0));
        return $380;
    };
    const I32$to_u32 = x0 => I32$to_u32$(x0);
    const U32$to_nat = a0 => (BigInt(a0));

    function Web$Kaelin$Coord$Convert$axial_to_nat$(_coord$1) {
        var self = _coord$1;
        switch (self._) {
            case 'Web.Kaelin.Coord.new':
                var $382 = self.i;
                var $383 = self.j;
                var _i$4 = (($382 + 100) >> 0);
                var _i$5 = ((_i$4 * 1000) >> 0);
                var _i$6 = I32$to_u32$(_i$5);
                var _j$7 = (($383 + 100) >> 0);
                var _j$8 = I32$to_u32$(_j$7);
                var _sum$9 = ((_i$6 + _j$8) >>> 0);
                var $384 = (BigInt(_sum$9));
                var $381 = $384;
                break;
        };
        return $381;
    };
    const Web$Kaelin$Coord$Convert$axial_to_nat = x0 => Web$Kaelin$Coord$Convert$axial_to_nat$(x0);

    function Maybe$(_A$1) {
        var $385 = null;
        return $385;
    };
    const Maybe = x0 => Maybe$(x0);
    const BitsMap$get = a0 => a1 => (bitsmap_get(a0, a1));

    function Bits$inc$(_a$1) {
        var self = _a$1;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'o':
                var $387 = self.slice(0, -1);
                var $388 = ($387 + '1');
                var $386 = $388;
                break;
            case 'i':
                var $389 = self.slice(0, -1);
                var $390 = (Bits$inc$($389) + '0');
                var $386 = $390;
                break;
            case 'e':
                var $391 = (Bits$e + '1');
                var $386 = $391;
                break;
        };
        return $386;
    };
    const Bits$inc = x0 => Bits$inc$(x0);
    const Nat$to_bits = a0 => (nat_to_bits(a0));

    function NatMap$get$(_key$2, _map$3) {
        var $392 = (bitsmap_get((nat_to_bits(_key$2)), _map$3));
        return $392;
    };
    const NatMap$get = x0 => x1 => NatMap$get$(x0, x1);

    function Web$Kaelin$Map$get$(_coord$1, _map$2) {
        var _key$3 = Web$Kaelin$Coord$Convert$axial_to_nat$(_coord$1);
        var $393 = NatMap$get$(_key$3, _map$2);
        return $393;
    };
    const Web$Kaelin$Map$get = x0 => x1 => Web$Kaelin$Map$get$(x0, x1);

    function NatMap$set$(_key$2, _val$3, _map$4) {
        var $394 = (bitsmap_set((nat_to_bits(_key$2)), _val$3, _map$4, 'set'));
        return $394;
    };
    const NatMap$set = x0 => x1 => x2 => NatMap$set$(x0, x1, x2);

    function Web$Kaelin$Map$set$(_coord$1, _tile$2, _map$3) {
        var _key$4 = Web$Kaelin$Coord$Convert$axial_to_nat$(_coord$1);
        var $395 = NatMap$set$(_key$4, _tile$2, _map$3);
        return $395;
    };
    const Web$Kaelin$Map$set = x0 => x1 => x2 => Web$Kaelin$Map$set$(x0, x1, x2);

    function Web$Kaelin$Map$push$(_coord$1, _entity$2, _map$3) {
        var _tile$4 = Maybe$default$(Web$Kaelin$Map$get$(_coord$1, _map$3), List$nil);
        var _tile$5 = List$cons$(_entity$2, _tile$4);
        var $396 = Web$Kaelin$Map$set$(_coord$1, _tile$5, _map$3);
        return $396;
    };
    const Web$Kaelin$Map$push = x0 => x1 => x2 => Web$Kaelin$Map$push$(x0, x1, x2);

    function Web$Kaelin$Map$init$(_map$1) {
        var _new_coord$2 = Web$Kaelin$Coord$new;
        var _creature$3 = Web$Kaelin$Entity$creature;
        var _croni$4 = Web$Kaelin$Heroes$Croni$croni;
        var _cyclope$5 = Web$Kaelin$Heroes$Cyclope$cyclope;
        var _lela$6 = Web$Kaelin$Heroes$Lela$lela;
        var _octoking$7 = Web$Kaelin$Heroes$Octoking$octoking;
        var _foo$8 = ((-1));
        var _map$9 = Web$Kaelin$Map$push$(_new_coord$2(_foo$8)(((-2))), _creature$3(Maybe$none)(_croni$4), _map$1);
        var _map$10 = Web$Kaelin$Map$push$(_new_coord$2(0)(3), _creature$3(Maybe$none)(_cyclope$5), _map$9);
        var _map$11 = Web$Kaelin$Map$push$(_new_coord$2(((-2)))(0), _creature$3(Maybe$none)(_lela$6), _map$10);
        var _map$12 = Web$Kaelin$Map$push$(_new_coord$2(3)(((-2))), _creature$3(Maybe$none)(_octoking$7), _map$11);
        var $397 = _map$12;
        return $397;
    };
    const Web$Kaelin$Map$init = x0 => Web$Kaelin$Map$init$(x0);
    const NatMap$new = BitsMap$new;
    const Web$Kaelin$Constants$map_size = 5;
    const Web$Kaelin$Assets$tile$green_2 = VoxBox$parse$("0e00011652320f00011652321000011652320c01011652320d01011652320e0101408d640f0101408d64100101469e651101011652321201011652320a02011652320b02011652320c0201469e650d0201469e650e0201469e650f0201408d64100201469e65110201469e65120201408d641302011652321402011652320803011652320903011652320a0301469e650b0301408d640c0301469e650d0301469e650e0301469e650f0301408d64100301408d64110301408d64120301408d64130301469e65140301469e65150301165232160301165232060401165232070401165232080401469e65090401469e650a0401469e650b0401408d640c0401408d640d0401469e650e0401469e650f0401408d64100401469e65110401408d64120401408d64130401408d64140401408d64150401408d64160401408d64170401165232180401165232040501165232050501165232060501469e65070501408d64080501469e65090501469e650a0501408d640b0501408d640c0501408d640d0501347e570e0501347e570f0501469e65100501469e65110501469e65120501347e57130501408d64140501469e65150501469e65160501408d64170501469e65180501469e651905011652321a0501165232020601165232030601165232040601347e57050601469e65060601469e65070601408d64080601408d64090601347e570a0601408d640b0601408d640c0601408d640d0601408d640e0601347e570f0601469e65100601469e65110601408d64120601347e57130601347e57140601469e65150601469e65160601408d64170601408d64180601347e57190601408d641a0601408d641b06011652321c0601165232000701165232010701165232020701408d64030701408d64040701408d64050701469e65060701469e65070701469e65080701408d64090701347e570a0701347e570b0701408d640c0701469e650d0701469e650e0701408d640f0701408d64100701408d64110701408d64120701408d64130701408d64140701408d64150701408d64160701408d64170701408d64180701347e57190701347e571a0701408d641b0701469e651c0701469e651d07011652321e0701165232000801165232010801408d64020801469e65030801469e65040801408d64050801469e65060801469e65070801469e65080801408d64090801469e650a0801469e650b0801408d640c0801408d640d0801469e650e0801469e650f0801347e57100801408d64110801469e65120801469e65130801408d64140801469e65150801469e65160801469e65170801408d64180801408d64190801408d641a0801408d641b0801408d641c0801469e651d0801469e651e0801165232000901165232010901408d64020901408d64030901469e65040901408d64050901408d64060901469e65070901408d64080901408d64090901469e650a0901469e650b0901408d640c0901408d640d0901469e650e0901469e650f0901408d64100901408d64110901469e65120901469e65130901408d64140901408d64150901469e65160901469e65170901408d64180901408d64190901469e651a0901469e651b0901408d641c0901408d641d0901408d641e0901165232000a01165232010a01408d64020a01408d64030a01347e57040a01347e57050a01408d64060a01408d64070a01408d64080a01408d64090a01408d640a0a01469e650b0a01469e650c0a01408d640d0a01408d640e0a01408d640f0a01408d64100a01408d64110a01408d64120a01408d64130a01408d64140a01347e57150a01408d64160a01408d64170a01408d64180a01408d64190a01469e651a0a01469e651b0a01469e651c0a01408d641d0a01408d641e0a01165232000b01165232010b01408d64020b01469e65030b01408d64040b01408d64050b01469e65060b01469e65070b01408d64080b01408d64090b01408d640a0b01408d640b0b01408d640c0b01408d640d0b01469e650e0b01408d640f0b01408d64100b01408d64110b01469e65120b01408d64130b01408d64140b01347e57150b01469e65160b01408d64170b01408d64180b01408d64190b01408d641a0b01408d641b0b01408d641c0b01408d641d0b01408d641e0b01165232000c01165232010c01408d64020c01469e65030c01408d64040c01408d64050c01408d64060c01408d64070c01469e65080c01469e65090c01408d640a0c01347e570b0c01347e570c0c01408d640d0c01469e650e0c01408d640f0c01469e65100c01408d64110c01408d64120c01408d64130c01408d64140c01408d64150c01408d64160c01469e65170c01469e65180c01408d64190c01347e571a0c01347e571b0c01408d641c0c01408d641d0c01408d641e0c01165232000d01165232010d01408d64020d01408d64030d01469e65040d01469e65050d01408d64060d01469e65070d01469e65080d01469e65090d01408d640a0d01347e570b0d01408d640c0d01469e650d0d01469e650e0d01408d640f0d01469e65100d01408d64110d01408d64120d01469e65130d01469e65140d01408d64150d01469e65160d01469e65170d01469e65180d01408d64190d01347e571a0d01408d641b0d01469e651c0d01469e651d0d01408d641e0d01165232000e01165232010e01408d64020e01469e65030e01469e65040e01469e65050e01408d64060e01469e65070e01469e65080e01408d64090e01408d640a0e01408d640b0e01408d640c0e01469e650d0e01469e650e0e01469e650f0e01347e57100e01408d64110e01469e65120e01469e65130e01469e65140e01408d64150e01469e65160e01469e65170e01408d64180e01408d64190e01408d641a0e01408d641b0e01469e651c0e01469e651d0e01469e651e0e01165232000f01165232010f01408d64020f01469e65030f01469e65040f01408d64050f01408d64060f01408d64070f01408d64080f01408d64090f01408d640a0f01408d640b0f01408d640c0f01408d640d0f01469e650e0f01469e650f0f01347e57100f01347e57110f01469e65120f01469e65130f01408d64140f01408d64150f01408d64160f01408d64170f01408d64180f01408d64190f01408d641a0f01408d641b0f01408d641c0f01469e651d0f01469e651e0f01165232001001165232011001408d64021001469e65031001469e65041001408d64051001347e57061001408d64071001469e65081001469e65091001469e650a1001408d640b1001469e650c1001469e650d1001408d640e1001408d640f1001469e65101001408d64111001469e65121001469e65131001408d64141001347e57151001408d64161001469e65171001469e65181001469e65191001408d641a1001469e651b1001469e651c1001408d641d1001408d641e1001165232001101165232011101469e65021101469e65031101469e65041101408d64051101408d64061101408d64071101469e65081101469e65091101408d640a1101408d640b1101408d640c1101408d640d1101408d640e1101408d640f1101408d64101101469e65111101469e65121101469e65131101408d64141101408d64151101408d64161101469e65171101469e65181101408d64191101408d641a1101408d641b1101408d641c1101408d641d1101408d641e1101165232001201165232011201469e65021201469e65031201408d64041201469e65051201469e65061201408d64071201408d64081201408d64091201408d640a1201408d640b1201408d640c1201469e650d1201469e650e1201469e650f1201408d64101201469e65111201469e65121201408d64131201469e65141201469e65151201408d64161201408d64171201408d64181201408d64191201408d641a1201408d641b1201469e651c1201469e651d1201469e651e1201165232001301165232011301408d64021301408d64031301408d64041301469e65051301469e65061301408d64071301408d64081301408d64091301469e650a1301469e650b1301408d640c1301469e650d1301469e650e1301469e650f1301408d64101301408d64111301408d64121301408d64131301469e65141301469e65151301408d64161301408d64171301408d64181301469e65191301469e651a1301408d641b1301469e651c1301469e651d1301469e651e1301165232001401165232011401469e65021401408d64031401408d64041401408d64051401408d64061401408d64071401408d64081401469e65091401469e650a1401469e650b1401408d640c1401408d640d1401469e650e1401469e650f1401408d64101401469e65111401408d64121401408d64131401408d64141401408d64151401408d64161401408d64171401469e65181401469e65191401469e651a1401408d641b1401408d641c1401469e651d1401469e651e1401165232001501165232011501469e65021501469e65031501347e57041501408d64051501469e65061501469e65071501408d64081501469e65091501469e650a1501408d640b1501408d640c1501408d640d1501347e570e1501347e570f1501469e65101501469e65111501469e65121501347e57131501408d64141501469e65151501469e65161501408d64171501469e65181501469e65191501408d641a1501408d641b1501408d641c1501347e571d1501347e571e1501165232001601165232011601469e65021601408d64031601347e57041601347e57051601469e65061601469e65071601408d64081601408d64091601347e570a1601408d640b1601408d640c1601408d640d1601408d640e1601347e570f1601469e65101601469e65111601408d64121601347e57131601347e57141601469e65151601469e65161601408d64171601408d64181601347e57191601408d641a1601408d641b1601408d641c1601408d641d1601347e571e1601165232001701165232011701165232021701408d64031701408d64041701408d64051701408d64061701408d64071701408d64081701408d64091701347e570a1701347e570b1701408d640c1701469e650d1701469e650e1701408d640f1701408d64101701408d64111701408d64121701408d64131701408d64141701408d64151701408d64161701408d64171701408d64181701347e57191701347e571a1701408d641b1701469e651c1701469e651d17011652321e1701165232021801165232031801165232041801408d64051801408d64061801469e65071801469e65081801408d64091801469e650a1801469e650b1801408d640c1801469e650d1801469e650e1801469e650f1801347e57101801347e57111801469e65121801469e65131801408d64141801408d64151801469e65161801469e65171801408d64181801469e65191801469e651a1801408d641b18011652321c1801165232041901165232051901165232061901469e65071901469e65081901408d64091901469e650a1901469e650b1901408d640c1901408d640d1901469e650e1901469e650f1901347e57101901408d64111901469e65121901469e65131901408d64141901469e65151901469e65161901469e65171901408d64181901469e651919011652321a1901165232061a01165232071a01165232081a01408d64091a01408d640a1a01408d640b1a01408d640c1a01408d640d1a01408d640e1a01408d640f1a01408d64101a01408d64111a01408d64121a01408d64131a01408d64141a01469e65151a01469e65161a01408d64171a01165232181a01165232081b01165232091b011652320a1b01347e570b1b01347e570c1b01408d640d1b01408d640e1b01408d640f1b01469e65101b01408d64111b01408d64121b01408d64131b01408d64141b01408d64151b01165232161b011652320a1c011652320b1c011652320c1c01469e650d1c01469e650e1c01408d640f1c01469e65101c01408d64111c01408d64121c01469e65131c01165232141c011652320c1d011652320d1d011652320e1d01469e650f1d01408d64101d01408d64111d01165232121d011652320e1e011652320f1e01165232101e01165232");
    const Web$Kaelin$Assets$tile$effect$light_blue2 = VoxBox$parse$("0e00010b51570f00010b51571000010b51570c01010b51570d01010b51570e0101278e9f0f0101278e9f100101309da51101010b51571201010b51570a02010b51570b02010b51570c0201309da50d0201309da50e0201309da50f0201278e9f100201309da5110201309da5120201278e9f1302010b51571402010b51570803010b51570903010b51570a0301309da50b0301278e9f0c0301309da50d0301309da50e0301309da50f0301278e9f100301278e9f110301278e9f120301278e9f130301309da5140301309da51503010b51571603010b51570604010b51570704010b5157080401309da5090401309da50a0401309da50b0401278e9f0c0401278e9f0d0401309da50e0401309da50f0401278e9f100401309da5110401278e9f120401278e9f130401278e9f140401278e9f150401278e9f160401278e9f1704010b51571804010b51570405010b51570505010b5157060501309da5070501278e9f080501309da5090501309da50a0501278e9f0b0501278e9f0c0501278e9f0d05011a7f910e05011a7f910f0501309da5100501309da5110501309da51205011a7f91130501278e9f140501309da5150501309da5160501278e9f170501309da5180501309da51905010b51571a05010b51570206010b51570306010b51570406011a7f91050601309da5060601309da5070601278e9f080601278e9f0906011a7f910a0601278e9f0b0601278e9f0c0601278e9f0d0601278e9f0e06011a7f910f0601309da5100601309da5110601278e9f1206011a7f911306011a7f91140601309da5150601309da5160601278e9f170601278e9f1806011a7f91190601278e9f1a0601278e9f1b06010b51571c06010b51570007010b51570107010b5157020701278e9f030701278e9f040701278e9f050701309da5060701309da5070701309da5080701278e9f0907011a7f910a07011a7f910b0701278e9f0c0701309da50d0701309da50e0701278e9f0f0701278e9f100701278e9f110701278e9f120701278e9f130701278e9f140701278e9f150701278e9f160701278e9f170701278e9f1807011a7f911907011a7f911a0701278e9f1b0701309da51c0701309da51d07010b51571e07010b51570008010b5157010801278e9f020801309da5030801309da5040801278e9f050801309da5060801309da5070801309da5080801278e9f090801309da50a0801309da50b0801278e9f0c0801278e9f0d0801309da50e0801309da50f08011a7f91100801278e9f110801309da5120801309da5130801278e9f140801309da5150801309da5160801309da5170801278e9f180801278e9f190801278e9f1a0801278e9f1b0801278e9f1c0801309da51d0801309da51e08010b51570009010b5157010901278e9f020901278e9f030901309da5040901278e9f050901278e9f060901309da5070901278e9f080901278e9f090901309da50a0901309da50b0901278e9f0c0901278e9f0d0901309da50e0901309da50f0901278e9f100901278e9f110901309da5120901309da5130901278e9f140901278e9f150901309da5160901309da5170901278e9f180901278e9f190901309da51a0901309da51b0901278e9f1c0901278e9f1d0901278e9f1e09010b5157000a010b5157010a01278e9f020a01278e9f030a011a7f91040a011a7f91050a01278e9f060a01278e9f070a01278e9f080a01278e9f090a01278e9f0a0a01309da50b0a01309da50c0a01278e9f0d0a01278e9f0e0a01278e9f0f0a01278e9f100a01278e9f110a01278e9f120a01278e9f130a01278e9f140a011a7f91150a01278e9f160a01278e9f170a01278e9f180a01278e9f190a01309da51a0a01309da51b0a01309da51c0a01278e9f1d0a01278e9f1e0a010b5157000b010b5157010b01278e9f020b01309da5030b01278e9f040b01278e9f050b01309da5060b01309da5070b01278e9f080b01278e9f090b01278e9f0a0b01278e9f0b0b01278e9f0c0b01278e9f0d0b01309da50e0b01278e9f0f0b01278e9f100b01278e9f110b01309da5120b01278e9f130b01278e9f140b011a7f91150b01309da5160b01278e9f170b01278e9f180b01278e9f190b01278e9f1a0b01278e9f1b0b01278e9f1c0b01278e9f1d0b01278e9f1e0b010b5157000c010b5157010c01278e9f020c01309da5030c01278e9f040c01278e9f050c01278e9f060c01278e9f070c01309da5080c01309da5090c01278e9f0a0c011a7f910b0c011a7f910c0c01278e9f0d0c01309da50e0c01278e9f0f0c01309da5100c01278e9f110c01278e9f120c01278e9f130c01278e9f140c01278e9f150c01278e9f160c01309da5170c01309da5180c01278e9f190c011a7f911a0c011a7f911b0c01278e9f1c0c01278e9f1d0c01278e9f1e0c010b5157000d010b5157010d01278e9f020d01278e9f030d01309da5040d01309da5050d01278e9f060d01309da5070d01309da5080d01309da5090d01278e9f0a0d011a7f910b0d01278e9f0c0d01309da50d0d01309da50e0d01278e9f0f0d01309da5100d01278e9f110d01278e9f120d01309da5130d01309da5140d01278e9f150d01309da5160d01309da5170d01309da5180d01278e9f190d011a7f911a0d01278e9f1b0d01309da51c0d01309da51d0d01278e9f1e0d010b5157000e010b5157010e01278e9f020e01309da5030e01309da5040e01309da5050e01278e9f060e01309da5070e01309da5080e01278e9f090e01278e9f0a0e01278e9f0b0e01278e9f0c0e01309da50d0e01309da50e0e01309da50f0e011a7f91100e01278e9f110e01309da5120e01309da5130e01309da5140e01278e9f150e01309da5160e01309da5170e01278e9f180e01278e9f190e01278e9f1a0e01278e9f1b0e01309da51c0e01309da51d0e01309da51e0e010b5157000f010b5157010f01278e9f020f01309da5030f01309da5040f01278e9f050f01278e9f060f01278e9f070f01278e9f080f01278e9f090f01278e9f0a0f01278e9f0b0f01278e9f0c0f01278e9f0d0f01309da50e0f01309da50f0f011a7f91100f011a7f91110f01309da5120f01309da5130f01278e9f140f01278e9f150f01278e9f160f01278e9f170f01278e9f180f01278e9f190f01278e9f1a0f01278e9f1b0f01278e9f1c0f01309da51d0f01309da51e0f010b51570010010b5157011001278e9f021001309da5031001309da5041001278e9f0510011a7f91061001278e9f071001309da5081001309da5091001309da50a1001278e9f0b1001309da50c1001309da50d1001278e9f0e1001278e9f0f1001309da5101001278e9f111001309da5121001309da5131001278e9f1410011a7f91151001278e9f161001309da5171001309da5181001309da5191001278e9f1a1001309da51b1001309da51c1001278e9f1d1001278e9f1e10010b51570011010b5157011101309da5021101309da5031101309da5041101278e9f051101278e9f061101278e9f071101309da5081101309da5091101278e9f0a1101278e9f0b1101278e9f0c1101278e9f0d1101278e9f0e1101278e9f0f1101278e9f101101309da5111101309da5121101309da5131101278e9f141101278e9f151101278e9f161101309da5171101309da5181101278e9f191101278e9f1a1101278e9f1b1101278e9f1c1101278e9f1d1101278e9f1e11010b51570012010b5157011201309da5021201309da5031201278e9f041201309da5051201309da5061201278e9f071201278e9f081201278e9f091201278e9f0a1201278e9f0b1201278e9f0c1201309da50d1201309da50e1201309da50f1201278e9f101201309da5111201309da5121201278e9f131201309da5141201309da5151201278e9f161201278e9f171201278e9f181201278e9f191201278e9f1a1201278e9f1b1201309da51c1201309da51d1201309da51e12010b51570013010b5157011301278e9f021301278e9f031301278e9f041301309da5051301309da5061301278e9f071301278e9f081301278e9f091301309da50a1301309da50b1301278e9f0c1301309da50d1301309da50e1301309da50f1301278e9f101301278e9f111301278e9f121301278e9f131301309da5141301309da5151301278e9f161301278e9f171301278e9f181301309da5191301309da51a1301278e9f1b1301309da51c1301309da51d1301309da51e13010b51570014010b5157011401309da5021401278e9f031401278e9f041401278e9f051401278e9f061401278e9f071401278e9f081401309da5091401309da50a1401309da50b1401278e9f0c1401278e9f0d1401309da50e1401309da50f1401278e9f101401309da5111401278e9f121401278e9f131401278e9f141401278e9f151401278e9f161401278e9f171401309da5181401309da5191401309da51a1401278e9f1b1401278e9f1c1401309da51d1401309da51e14010b51570015010b5157011501309da5021501309da50315011a7f91041501278e9f051501309da5061501309da5071501278e9f081501309da5091501309da50a1501278e9f0b1501278e9f0c1501278e9f0d15011a7f910e15011a7f910f1501309da5101501309da5111501309da51215011a7f91131501278e9f141501309da5151501309da5161501278e9f171501309da5181501309da5191501278e9f1a1501278e9f1b1501278e9f1c15011a7f911d15011a7f911e15010b51570016010b5157011601309da5021601278e9f0316011a7f910416011a7f91051601309da5061601309da5071601278e9f081601278e9f0916011a7f910a1601278e9f0b1601278e9f0c1601278e9f0d1601278e9f0e16011a7f910f1601309da5101601309da5111601278e9f1216011a7f911316011a7f91141601309da5151601309da5161601278e9f171601278e9f1816011a7f91191601278e9f1a1601278e9f1b1601278e9f1c1601278e9f1d16011a7f911e16010b51570017010b51570117010b5157021701278e9f031701278e9f041701278e9f051701278e9f061701278e9f071701278e9f081701278e9f0917011a7f910a17011a7f910b1701278e9f0c1701309da50d1701309da50e1701278e9f0f1701278e9f101701278e9f111701278e9f121701278e9f131701278e9f141701278e9f151701278e9f161701278e9f171701278e9f1817011a7f911917011a7f911a1701278e9f1b1701309da51c1701309da51d17010b51571e17010b51570218010b51570318010b5157041801278e9f051801278e9f061801309da5071801309da5081801278e9f091801309da50a1801309da50b1801278e9f0c1801309da50d1801309da50e1801309da50f18011a7f911018011a7f91111801309da5121801309da5131801278e9f141801278e9f151801309da5161801309da5171801278e9f181801309da5191801309da51a1801278e9f1b18010b51571c18010b51570419010b51570519010b5157061901309da5071901309da5081901278e9f091901309da50a1901309da50b1901278e9f0c1901278e9f0d1901309da50e1901309da50f19011a7f91101901278e9f111901309da5121901309da5131901278e9f141901309da5151901309da5161901309da5171901278e9f181901309da51919010b51571a19010b5157061a010b5157071a010b5157081a01278e9f091a01278e9f0a1a01278e9f0b1a01278e9f0c1a01278e9f0d1a01278e9f0e1a01278e9f0f1a01278e9f101a01278e9f111a01278e9f121a01278e9f131a01278e9f141a01309da5151a01309da5161a01278e9f171a010b5157181a010b5157081b010b5157091b010b51570a1b011a7f910b1b011a7f910c1b01278e9f0d1b01278e9f0e1b01278e9f0f1b01309da5101b01278e9f111b01278e9f121b01278e9f131b01278e9f141b01278e9f151b010b5157161b010b51570a1c010b51570b1c010b51570c1c01309da50d1c01309da50e1c01278e9f0f1c01309da5101c01278e9f111c01278e9f121c01309da5131c010b5157141c010b51570c1d010b51570d1d010b51570e1d01309da50f1d01278e9f101d01278e9f111d010b5157121d010b51570e1e010b51570f1e010b5157101e010b5157");
    const Web$Kaelin$Assets$tile$effect$dark_blue2 = VoxBox$parse$("0e00011b3d920f00011b3d921000011b3d920c01011b3d920d01011b3d920e01014c74c50f01014c74c51001015783c51101011b3d921201011b3d920a02011b3d920b02011b3d920c02015783c50d02015783c50e02015783c50f02014c74c51002015783c51102015783c51202014c74c51302011b3d921402011b3d920803011b3d920903011b3d920a03015783c50b03014c74c50c03015783c50d03015783c50e03015783c50f03014c74c51003014c74c51103014c74c51203014c74c51303015783c51403015783c51503011b3d921603011b3d920604011b3d920704011b3d920804015783c50904015783c50a04015783c50b04014c74c50c04014c74c50d04015783c50e04015783c50f04014c74c51004015783c51104014c74c51204014c74c51304014c74c51404014c74c51504014c74c51604014c74c51704011b3d921804011b3d920405011b3d920505011b3d920605015783c50705014c74c50805015783c50905015783c50a05014c74c50b05014c74c50c05014c74c50d05013e66b80e05013e66b80f05015783c51005015783c51105015783c51205013e66b81305014c74c51405015783c51505015783c51605014c74c51705015783c51805015783c51905011b3d921a05011b3d920206011b3d920306011b3d920406013e66b80506015783c50606015783c50706014c74c50806014c74c50906013e66b80a06014c74c50b06014c74c50c06014c74c50d06014c74c50e06013e66b80f06015783c51006015783c51106014c74c51206013e66b81306013e66b81406015783c51506015783c51606014c74c51706014c74c51806013e66b81906014c74c51a06014c74c51b06011b3d921c06011b3d920007011b3d920107011b3d920207014c74c50307014c74c50407014c74c50507015783c50607015783c50707015783c50807014c74c50907013e66b80a07013e66b80b07014c74c50c07015783c50d07015783c50e07014c74c50f07014c74c51007014c74c51107014c74c51207014c74c51307014c74c51407014c74c51507014c74c51607014c74c51707014c74c51807013e66b81907013e66b81a07014c74c51b07015783c51c07015783c51d07011b3d921e07011b3d920008011b3d920108014c74c50208015783c50308015783c50408014c74c50508015783c50608015783c50708015783c50808014c74c50908015783c50a08015783c50b08014c74c50c08014c74c50d08015783c50e08015783c50f08013e66b81008014c74c51108015783c51208015783c51308014c74c51408015783c51508015783c51608015783c51708014c74c51808014c74c51908014c74c51a08014c74c51b08014c74c51c08015783c51d08015783c51e08011b3d920009011b3d920109014c74c50209014c74c50309015783c50409014c74c50509014c74c50609015783c50709014c74c50809014c74c50909015783c50a09015783c50b09014c74c50c09014c74c50d09015783c50e09015783c50f09014c74c51009014c74c51109015783c51209015783c51309014c74c51409014c74c51509015783c51609015783c51709014c74c51809014c74c51909015783c51a09015783c51b09014c74c51c09014c74c51d09014c74c51e09011b3d92000a011b3d92010a014c74c5020a014c74c5030a013e66b8040a013e66b8050a014c74c5060a014c74c5070a014c74c5080a014c74c5090a014c74c50a0a015783c50b0a015783c50c0a014c74c50d0a014c74c50e0a014c74c50f0a014c74c5100a014c74c5110a014c74c5120a014c74c5130a014c74c5140a013e66b8150a014c74c5160a014c74c5170a014c74c5180a014c74c5190a015783c51a0a015783c51b0a015783c51c0a014c74c51d0a014c74c51e0a011b3d92000b011b3d92010b014c74c5020b015783c5030b014c74c5040b014c74c5050b015783c5060b015783c5070b014c74c5080b014c74c5090b014c74c50a0b014c74c50b0b014c74c50c0b014c74c50d0b015783c50e0b014c74c50f0b014c74c5100b014c74c5110b015783c5120b014c74c5130b014c74c5140b013e66b8150b015783c5160b014c74c5170b014c74c5180b014c74c5190b014c74c51a0b014c74c51b0b014c74c51c0b014c74c51d0b014c74c51e0b011b3d92000c011b3d92010c014c74c5020c015783c5030c014c74c5040c014c74c5050c014c74c5060c014c74c5070c015783c5080c015783c5090c014c74c50a0c013e66b80b0c013e66b80c0c014c74c50d0c015783c50e0c014c74c50f0c015783c5100c014c74c5110c014c74c5120c014c74c5130c014c74c5140c014c74c5150c014c74c5160c015783c5170c015783c5180c014c74c5190c013e66b81a0c013e66b81b0c014c74c51c0c014c74c51d0c014c74c51e0c011b3d92000d011b3d92010d014c74c5020d014c74c5030d015783c5040d015783c5050d014c74c5060d015783c5070d015783c5080d015783c5090d014c74c50a0d013e66b80b0d014c74c50c0d015783c50d0d015783c50e0d014c74c50f0d015783c5100d014c74c5110d014c74c5120d015783c5130d015783c5140d014c74c5150d015783c5160d015783c5170d015783c5180d014c74c5190d013e66b81a0d014c74c51b0d015783c51c0d015783c51d0d014c74c51e0d011b3d92000e011b3d92010e014c74c5020e015783c5030e015783c5040e015783c5050e014c74c5060e015783c5070e015783c5080e014c74c5090e014c74c50a0e014c74c50b0e014c74c50c0e015783c50d0e015783c50e0e015783c50f0e013e66b8100e014c74c5110e015783c5120e015783c5130e015783c5140e014c74c5150e015783c5160e015783c5170e014c74c5180e014c74c5190e014c74c51a0e014c74c51b0e015783c51c0e015783c51d0e015783c51e0e011b3d92000f011b3d92010f014c74c5020f015783c5030f015783c5040f014c74c5050f014c74c5060f014c74c5070f014c74c5080f014c74c5090f014c74c50a0f014c74c50b0f014c74c50c0f014c74c50d0f015783c50e0f015783c50f0f013e66b8100f013e66b8110f015783c5120f015783c5130f014c74c5140f014c74c5150f014c74c5160f014c74c5170f014c74c5180f014c74c5190f014c74c51a0f014c74c51b0f014c74c51c0f015783c51d0f015783c51e0f011b3d920010011b3d920110014c74c50210015783c50310015783c50410014c74c50510013e66b80610014c74c50710015783c50810015783c50910015783c50a10014c74c50b10015783c50c10015783c50d10014c74c50e10014c74c50f10015783c51010014c74c51110015783c51210015783c51310014c74c51410013e66b81510014c74c51610015783c51710015783c51810015783c51910014c74c51a10015783c51b10015783c51c10014c74c51d10014c74c51e10011b3d920011011b3d920111015783c50211015783c50311015783c50411014c74c50511014c74c50611014c74c50711015783c50811015783c50911014c74c50a11014c74c50b11014c74c50c11014c74c50d11014c74c50e11014c74c50f11014c74c51011015783c51111015783c51211015783c51311014c74c51411014c74c51511014c74c51611015783c51711015783c51811014c74c51911014c74c51a11014c74c51b11014c74c51c11014c74c51d11014c74c51e11011b3d920012011b3d920112015783c50212015783c50312014c74c50412015783c50512015783c50612014c74c50712014c74c50812014c74c50912014c74c50a12014c74c50b12014c74c50c12015783c50d12015783c50e12015783c50f12014c74c51012015783c51112015783c51212014c74c51312015783c51412015783c51512014c74c51612014c74c51712014c74c51812014c74c51912014c74c51a12014c74c51b12015783c51c12015783c51d12015783c51e12011b3d920013011b3d920113014c74c50213014c74c50313014c74c50413015783c50513015783c50613014c74c50713014c74c50813014c74c50913015783c50a13015783c50b13014c74c50c13015783c50d13015783c50e13015783c50f13014c74c51013014c74c51113014c74c51213014c74c51313015783c51413015783c51513014c74c51613014c74c51713014c74c51813015783c51913015783c51a13014c74c51b13015783c51c13015783c51d13015783c51e13011b3d920014011b3d920114015783c50214014c74c50314014c74c50414014c74c50514014c74c50614014c74c50714014c74c50814015783c50914015783c50a14015783c50b14014c74c50c14014c74c50d14015783c50e14015783c50f14014c74c51014015783c51114014c74c51214014c74c51314014c74c51414014c74c51514014c74c51614014c74c51714015783c51814015783c51914015783c51a14014c74c51b14014c74c51c14015783c51d14015783c51e14011b3d920015011b3d920115015783c50215015783c50315013e66b80415014c74c50515015783c50615015783c50715014c74c50815015783c50915015783c50a15014c74c50b15014c74c50c15014c74c50d15013e66b80e15013e66b80f15015783c51015015783c51115015783c51215013e66b81315014c74c51415015783c51515015783c51615014c74c51715015783c51815015783c51915014c74c51a15014c74c51b15014c74c51c15013e66b81d15013e66b81e15011b3d920016011b3d920116015783c50216014c74c50316013e66b80416013e66b80516015783c50616015783c50716014c74c50816014c74c50916013e66b80a16014c74c50b16014c74c50c16014c74c50d16014c74c50e16013e66b80f16015783c51016015783c51116014c74c51216013e66b81316013e66b81416015783c51516015783c51616014c74c51716014c74c51816013e66b81916014c74c51a16014c74c51b16014c74c51c16014c74c51d16013e66b81e16011b3d920017011b3d920117011b3d920217014c74c50317014c74c50417014c74c50517014c74c50617014c74c50717014c74c50817014c74c50917013e66b80a17013e66b80b17014c74c50c17015783c50d17015783c50e17014c74c50f17014c74c51017014c74c51117014c74c51217014c74c51317014c74c51417014c74c51517014c74c51617014c74c51717014c74c51817013e66b81917013e66b81a17014c74c51b17015783c51c17015783c51d17011b3d921e17011b3d920218011b3d920318011b3d920418014c74c50518014c74c50618015783c50718015783c50818014c74c50918015783c50a18015783c50b18014c74c50c18015783c50d18015783c50e18015783c50f18013e66b81018013e66b81118015783c51218015783c51318014c74c51418014c74c51518015783c51618015783c51718014c74c51818015783c51918015783c51a18014c74c51b18011b3d921c18011b3d920419011b3d920519011b3d920619015783c50719015783c50819014c74c50919015783c50a19015783c50b19014c74c50c19014c74c50d19015783c50e19015783c50f19013e66b81019014c74c51119015783c51219015783c51319014c74c51419015783c51519015783c51619015783c51719014c74c51819015783c51919011b3d921a19011b3d92061a011b3d92071a011b3d92081a014c74c5091a014c74c50a1a014c74c50b1a014c74c50c1a014c74c50d1a014c74c50e1a014c74c50f1a014c74c5101a014c74c5111a014c74c5121a014c74c5131a014c74c5141a015783c5151a015783c5161a014c74c5171a011b3d92181a011b3d92081b011b3d92091b011b3d920a1b013e66b80b1b013e66b80c1b014c74c50d1b014c74c50e1b014c74c50f1b015783c5101b014c74c5111b014c74c5121b014c74c5131b014c74c5141b014c74c5151b011b3d92161b011b3d920a1c011b3d920b1c011b3d920c1c015783c50d1c015783c50e1c014c74c50f1c015783c5101c014c74c5111c014c74c5121c015783c5131c011b3d92141c011b3d920c1d011b3d920d1d011b3d920e1d015783c50f1d014c74c5101d014c74c5111d011b3d92121d011b3d920e1e011b3d920f1e011b3d92101e011b3d92");
    const Web$Kaelin$Assets$tile$effect$blue_green2 = VoxBox$parse$("0e00010955400f00010955401000010955400c01010955400d01010955400e01011a9c7c0f01011a9c7c1001011cad851101010955401201010955400a02010955400b02010955400c02011cad850d02011cad850e02011cad850f02011a9c7c1002011cad851102011cad851202011a9c7c1302010955401402010955400803010955400903010955400a03011cad850b03011a9c7c0c03011cad850d03011cad850e03011cad850f03011a9c7c1003011a9c7c1103011a9c7c1203011a9c7c1303011cad851403011cad851503010955401603010955400604010955400704010955400804011cad850904011cad850a04011cad850b04011a9c7c0c04011a9c7c0d04011cad850e04011cad850f04011a9c7c1004011cad851104011a9c7c1204011a9c7c1304011a9c7c1404011a9c7c1504011a9c7c1604011a9c7c1704010955401804010955400405010955400505010955400605011cad850705011a9c7c0805011cad850905011cad850a05011a9c7c0b05011a9c7c0c05011a9c7c0d050115896c0e050115896c0f05011cad851005011cad851105011cad8512050115896c1305011a9c7c1405011cad851505011cad851605011a9c7c1705011cad851805011cad851905010955401a050109554002060109554003060109554004060115896c0506011cad850606011cad850706011a9c7c0806011a9c7c09060115896c0a06011a9c7c0b06011a9c7c0c06011a9c7c0d06011a9c7c0e060115896c0f06011cad851006011cad851106011a9c7c12060115896c13060115896c1406011cad851506011cad851606011a9c7c1706011a9c7c18060115896c1906011a9c7c1a06011a9c7c1b06010955401c06010955400007010955400107010955400207011a9c7c0307011a9c7c0407011a9c7c0507011cad850607011cad850707011cad850807011a9c7c09070115896c0a070115896c0b07011a9c7c0c07011cad850d07011cad850e07011a9c7c0f07011a9c7c1007011a9c7c1107011a9c7c1207011a9c7c1307011a9c7c1407011a9c7c1507011a9c7c1607011a9c7c1707011a9c7c18070115896c19070115896c1a07011a9c7c1b07011cad851c07011cad851d07010955401e07010955400008010955400108011a9c7c0208011cad850308011cad850408011a9c7c0508011cad850608011cad850708011cad850808011a9c7c0908011cad850a08011cad850b08011a9c7c0c08011a9c7c0d08011cad850e08011cad850f080115896c1008011a9c7c1108011cad851208011cad851308011a9c7c1408011cad851508011cad851608011cad851708011a9c7c1808011a9c7c1908011a9c7c1a08011a9c7c1b08011a9c7c1c08011cad851d08011cad851e08010955400009010955400109011a9c7c0209011a9c7c0309011cad850409011a9c7c0509011a9c7c0609011cad850709011a9c7c0809011a9c7c0909011cad850a09011cad850b09011a9c7c0c09011a9c7c0d09011cad850e09011cad850f09011a9c7c1009011a9c7c1109011cad851209011cad851309011a9c7c1409011a9c7c1509011cad851609011cad851709011a9c7c1809011a9c7c1909011cad851a09011cad851b09011a9c7c1c09011a9c7c1d09011a9c7c1e0901095540000a01095540010a011a9c7c020a011a9c7c030a0115896c040a0115896c050a011a9c7c060a011a9c7c070a011a9c7c080a011a9c7c090a011a9c7c0a0a011cad850b0a011cad850c0a011a9c7c0d0a011a9c7c0e0a011a9c7c0f0a011a9c7c100a011a9c7c110a011a9c7c120a011a9c7c130a011a9c7c140a0115896c150a011a9c7c160a011a9c7c170a011a9c7c180a011a9c7c190a011cad851a0a011cad851b0a011cad851c0a011a9c7c1d0a011a9c7c1e0a01095540000b01095540010b011a9c7c020b011cad85030b011a9c7c040b011a9c7c050b011cad85060b011cad85070b011a9c7c080b011a9c7c090b011a9c7c0a0b011a9c7c0b0b011a9c7c0c0b011a9c7c0d0b011cad850e0b011a9c7c0f0b011a9c7c100b011a9c7c110b011cad85120b011a9c7c130b011a9c7c140b0115896c150b011cad85160b011a9c7c170b011a9c7c180b011a9c7c190b011a9c7c1a0b011a9c7c1b0b011a9c7c1c0b011a9c7c1d0b011a9c7c1e0b01095540000c01095540010c011a9c7c020c011cad85030c011a9c7c040c011a9c7c050c011a9c7c060c011a9c7c070c011cad85080c011cad85090c011a9c7c0a0c0115896c0b0c0115896c0c0c011a9c7c0d0c011cad850e0c011a9c7c0f0c011cad85100c011a9c7c110c011a9c7c120c011a9c7c130c011a9c7c140c011a9c7c150c011a9c7c160c011cad85170c011cad85180c011a9c7c190c0115896c1a0c0115896c1b0c011a9c7c1c0c011a9c7c1d0c011a9c7c1e0c01095540000d01095540010d011a9c7c020d011a9c7c030d011cad85040d011cad85050d011a9c7c060d011cad85070d011cad85080d011cad85090d011a9c7c0a0d0115896c0b0d011a9c7c0c0d011cad850d0d011cad850e0d011a9c7c0f0d011cad85100d011a9c7c110d011a9c7c120d011cad85130d011cad85140d011a9c7c150d011cad85160d011cad85170d011cad85180d011a9c7c190d0115896c1a0d011a9c7c1b0d011cad851c0d011cad851d0d011a9c7c1e0d01095540000e01095540010e011a9c7c020e011cad85030e011cad85040e011cad85050e011a9c7c060e011cad85070e011cad85080e011a9c7c090e011a9c7c0a0e011a9c7c0b0e011a9c7c0c0e011cad850d0e011cad850e0e011cad850f0e0115896c100e011a9c7c110e011cad85120e011cad85130e011cad85140e011a9c7c150e011cad85160e011cad85170e011a9c7c180e011a9c7c190e011a9c7c1a0e011a9c7c1b0e011cad851c0e011cad851d0e011cad851e0e01095540000f01095540010f011a9c7c020f011cad85030f011cad85040f011a9c7c050f011a9c7c060f011a9c7c070f011a9c7c080f011a9c7c090f011a9c7c0a0f011a9c7c0b0f011a9c7c0c0f011a9c7c0d0f011cad850e0f011cad850f0f0115896c100f0115896c110f011cad85120f011cad85130f011a9c7c140f011a9c7c150f011a9c7c160f011a9c7c170f011a9c7c180f011a9c7c190f011a9c7c1a0f011a9c7c1b0f011a9c7c1c0f011cad851d0f011cad851e0f010955400010010955400110011a9c7c0210011cad850310011cad850410011a9c7c05100115896c0610011a9c7c0710011cad850810011cad850910011cad850a10011a9c7c0b10011cad850c10011cad850d10011a9c7c0e10011a9c7c0f10011cad851010011a9c7c1110011cad851210011cad851310011a9c7c14100115896c1510011a9c7c1610011cad851710011cad851810011cad851910011a9c7c1a10011cad851b10011cad851c10011a9c7c1d10011a9c7c1e10010955400011010955400111011cad850211011cad850311011cad850411011a9c7c0511011a9c7c0611011a9c7c0711011cad850811011cad850911011a9c7c0a11011a9c7c0b11011a9c7c0c11011a9c7c0d11011a9c7c0e11011a9c7c0f11011a9c7c1011011cad851111011cad851211011cad851311011a9c7c1411011a9c7c1511011a9c7c1611011cad851711011cad851811011a9c7c1911011a9c7c1a11011a9c7c1b11011a9c7c1c11011a9c7c1d11011a9c7c1e11010955400012010955400112011cad850212011cad850312011a9c7c0412011cad850512011cad850612011a9c7c0712011a9c7c0812011a9c7c0912011a9c7c0a12011a9c7c0b12011a9c7c0c12011cad850d12011cad850e12011cad850f12011a9c7c1012011cad851112011cad851212011a9c7c1312011cad851412011cad851512011a9c7c1612011a9c7c1712011a9c7c1812011a9c7c1912011a9c7c1a12011a9c7c1b12011cad851c12011cad851d12011cad851e12010955400013010955400113011a9c7c0213011a9c7c0313011a9c7c0413011cad850513011cad850613011a9c7c0713011a9c7c0813011a9c7c0913011cad850a13011cad850b13011a9c7c0c13011cad850d13011cad850e13011cad850f13011a9c7c1013011a9c7c1113011a9c7c1213011a9c7c1313011cad851413011cad851513011a9c7c1613011a9c7c1713011a9c7c1813011cad851913011cad851a13011a9c7c1b13011cad851c13011cad851d13011cad851e13010955400014010955400114011cad850214011a9c7c0314011a9c7c0414011a9c7c0514011a9c7c0614011a9c7c0714011a9c7c0814011cad850914011cad850a14011cad850b14011a9c7c0c14011a9c7c0d14011cad850e14011cad850f14011a9c7c1014011cad851114011a9c7c1214011a9c7c1314011a9c7c1414011a9c7c1514011a9c7c1614011a9c7c1714011cad851814011cad851914011cad851a14011a9c7c1b14011a9c7c1c14011cad851d14011cad851e14010955400015010955400115011cad850215011cad8503150115896c0415011a9c7c0515011cad850615011cad850715011a9c7c0815011cad850915011cad850a15011a9c7c0b15011a9c7c0c15011a9c7c0d150115896c0e150115896c0f15011cad851015011cad851115011cad8512150115896c1315011a9c7c1415011cad851515011cad851615011a9c7c1715011cad851815011cad851915011a9c7c1a15011a9c7c1b15011a9c7c1c150115896c1d150115896c1e15010955400016010955400116011cad850216011a9c7c03160115896c04160115896c0516011cad850616011cad850716011a9c7c0816011a9c7c09160115896c0a16011a9c7c0b16011a9c7c0c16011a9c7c0d16011a9c7c0e160115896c0f16011cad851016011cad851116011a9c7c12160115896c13160115896c1416011cad851516011cad851616011a9c7c1716011a9c7c18160115896c1916011a9c7c1a16011a9c7c1b16011a9c7c1c16011a9c7c1d160115896c1e16010955400017010955400117010955400217011a9c7c0317011a9c7c0417011a9c7c0517011a9c7c0617011a9c7c0717011a9c7c0817011a9c7c09170115896c0a170115896c0b17011a9c7c0c17011cad850d17011cad850e17011a9c7c0f17011a9c7c1017011a9c7c1117011a9c7c1217011a9c7c1317011a9c7c1417011a9c7c1517011a9c7c1617011a9c7c1717011a9c7c18170115896c19170115896c1a17011a9c7c1b17011cad851c17011cad851d17010955401e17010955400218010955400318010955400418011a9c7c0518011a9c7c0618011cad850718011cad850818011a9c7c0918011cad850a18011cad850b18011a9c7c0c18011cad850d18011cad850e18011cad850f180115896c10180115896c1118011cad851218011cad851318011a9c7c1418011a9c7c1518011cad851618011cad851718011a9c7c1818011cad851918011cad851a18011a9c7c1b18010955401c18010955400419010955400519010955400619011cad850719011cad850819011a9c7c0919011cad850a19011cad850b19011a9c7c0c19011a9c7c0d19011cad850e19011cad850f190115896c1019011a9c7c1119011cad851219011cad851319011a9c7c1419011cad851519011cad851619011cad851719011a9c7c1819011cad851919010955401a1901095540061a01095540071a01095540081a011a9c7c091a011a9c7c0a1a011a9c7c0b1a011a9c7c0c1a011a9c7c0d1a011a9c7c0e1a011a9c7c0f1a011a9c7c101a011a9c7c111a011a9c7c121a011a9c7c131a011a9c7c141a011cad85151a011cad85161a011a9c7c171a01095540181a01095540081b01095540091b010955400a1b0115896c0b1b0115896c0c1b011a9c7c0d1b011a9c7c0e1b011a9c7c0f1b011cad85101b011a9c7c111b011a9c7c121b011a9c7c131b011a9c7c141b011a9c7c151b01095540161b010955400a1c010955400b1c010955400c1c011cad850d1c011cad850e1c011a9c7c0f1c011cad85101c011a9c7c111c011a9c7c121c011cad85131c01095540141c010955400c1d010955400d1d010955400e1d011cad850f1d011a9c7c101d011a9c7c111d01095540121d010955400e1e010955400f1e01095540101e01095540");
    const Web$Kaelin$Assets$tile$effect$dark_red2 = VoxBox$parse$("0e0001881c170f0001881c17100001881c170c0101881c170d0101881c170e0101bc524c0f0101bc524c100101c75f56110101881c17120101881c170a0201881c170b0201881c170c0201c75f560d0201c75f560e0201c75f560f0201bc524c100201c75f56110201c75f56120201bc524c130201881c17140201881c17080301881c17090301881c170a0301c75f560b0301bc524c0c0301c75f560d0301c75f560e0301c75f560f0301bc524c100301bc524c110301bc524c120301bc524c130301c75f56140301c75f56150301881c17160301881c17060401881c17070401881c17080401c75f56090401c75f560a0401c75f560b0401bc524c0c0401bc524c0d0401c75f560e0401c75f560f0401bc524c100401c75f56110401bc524c120401bc524c130401bc524c140401bc524c150401bc524c160401bc524c170401881c17180401881c17040501881c17050501881c17060501c75f56070501bc524c080501c75f56090501c75f560a0501bc524c0b0501bc524c0c0501bc524c0d0501ae443e0e0501ae443e0f0501c75f56100501c75f56110501c75f56120501ae443e130501bc524c140501c75f56150501c75f56160501bc524c170501c75f56180501c75f56190501881c171a0501881c17020601881c17030601881c17040601ae443e050601c75f56060601c75f56070601bc524c080601bc524c090601ae443e0a0601bc524c0b0601bc524c0c0601bc524c0d0601bc524c0e0601ae443e0f0601c75f56100601c75f56110601bc524c120601ae443e130601ae443e140601c75f56150601c75f56160601bc524c170601bc524c180601ae443e190601bc524c1a0601bc524c1b0601881c171c0601881c17000701881c17010701881c17020701bc524c030701bc524c040701bc524c050701c75f56060701c75f56070701c75f56080701bc524c090701ae443e0a0701ae443e0b0701bc524c0c0701c75f560d0701c75f560e0701bc524c0f0701bc524c100701bc524c110701bc524c120701bc524c130701bc524c140701bc524c150701bc524c160701bc524c170701bc524c180701ae443e190701ae443e1a0701bc524c1b0701c75f561c0701c75f561d0701881c171e0701881c17000801881c17010801bc524c020801c75f56030801c75f56040801bc524c050801c75f56060801c75f56070801c75f56080801bc524c090801c75f560a0801c75f560b0801bc524c0c0801bc524c0d0801c75f560e0801c75f560f0801ae443e100801bc524c110801c75f56120801c75f56130801bc524c140801c75f56150801c75f56160801c75f56170801bc524c180801bc524c190801bc524c1a0801bc524c1b0801bc524c1c0801c75f561d0801c75f561e0801881c17000901881c17010901bc524c020901bc524c030901c75f56040901bc524c050901bc524c060901c75f56070901bc524c080901bc524c090901c75f560a0901c75f560b0901bc524c0c0901bc524c0d0901c75f560e0901c75f560f0901bc524c100901bc524c110901c75f56120901c75f56130901bc524c140901bc524c150901c75f56160901c75f56170901bc524c180901bc524c190901c75f561a0901c75f561b0901bc524c1c0901bc524c1d0901bc524c1e0901881c17000a01881c17010a01bc524c020a01bc524c030a01ae443e040a01ae443e050a01bc524c060a01bc524c070a01bc524c080a01bc524c090a01bc524c0a0a01c75f560b0a01c75f560c0a01bc524c0d0a01bc524c0e0a01bc524c0f0a01bc524c100a01bc524c110a01bc524c120a01bc524c130a01bc524c140a01ae443e150a01bc524c160a01bc524c170a01bc524c180a01bc524c190a01c75f561a0a01c75f561b0a01c75f561c0a01bc524c1d0a01bc524c1e0a01881c17000b01881c17010b01bc524c020b01c75f56030b01bc524c040b01bc524c050b01c75f56060b01c75f56070b01bc524c080b01bc524c090b01bc524c0a0b01bc524c0b0b01bc524c0c0b01bc524c0d0b01c75f560e0b01bc524c0f0b01bc524c100b01bc524c110b01c75f56120b01bc524c130b01bc524c140b01ae443e150b01c75f56160b01bc524c170b01bc524c180b01bc524c190b01bc524c1a0b01bc524c1b0b01bc524c1c0b01bc524c1d0b01bc524c1e0b01881c17000c01881c17010c01bc524c020c01c75f56030c01bc524c040c01bc524c050c01bc524c060c01bc524c070c01c75f56080c01c75f56090c01bc524c0a0c01ae443e0b0c01ae443e0c0c01bc524c0d0c01c75f560e0c01bc524c0f0c01c75f56100c01bc524c110c01bc524c120c01bc524c130c01bc524c140c01bc524c150c01bc524c160c01c75f56170c01c75f56180c01bc524c190c01ae443e1a0c01ae443e1b0c01bc524c1c0c01bc524c1d0c01bc524c1e0c01881c17000d01881c17010d01bc524c020d01bc524c030d01c75f56040d01c75f56050d01bc524c060d01c75f56070d01c75f56080d01c75f56090d01bc524c0a0d01ae443e0b0d01bc524c0c0d01c75f560d0d01c75f560e0d01bc524c0f0d01c75f56100d01bc524c110d01bc524c120d01c75f56130d01c75f56140d01bc524c150d01c75f56160d01c75f56170d01c75f56180d01bc524c190d01ae443e1a0d01bc524c1b0d01c75f561c0d01c75f561d0d01bc524c1e0d01881c17000e01881c17010e01bc524c020e01c75f56030e01c75f56040e01c75f56050e01bc524c060e01c75f56070e01c75f56080e01bc524c090e01bc524c0a0e01bc524c0b0e01bc524c0c0e01c75f560d0e01c75f560e0e01c75f560f0e01ae443e100e01bc524c110e01c75f56120e01c75f56130e01c75f56140e01bc524c150e01c75f56160e01c75f56170e01bc524c180e01bc524c190e01bc524c1a0e01bc524c1b0e01c75f561c0e01c75f561d0e01c75f561e0e01881c17000f01881c17010f01bc524c020f01c75f56030f01c75f56040f01bc524c050f01bc524c060f01bc524c070f01bc524c080f01bc524c090f01bc524c0a0f01bc524c0b0f01bc524c0c0f01bc524c0d0f01c75f560e0f01c75f560f0f01ae443e100f01ae443e110f01c75f56120f01c75f56130f01bc524c140f01bc524c150f01bc524c160f01bc524c170f01bc524c180f01bc524c190f01bc524c1a0f01bc524c1b0f01bc524c1c0f01c75f561d0f01c75f561e0f01881c17001001881c17011001bc524c021001c75f56031001c75f56041001bc524c051001ae443e061001bc524c071001c75f56081001c75f56091001c75f560a1001bc524c0b1001c75f560c1001c75f560d1001bc524c0e1001bc524c0f1001c75f56101001bc524c111001c75f56121001c75f56131001bc524c141001ae443e151001bc524c161001c75f56171001c75f56181001c75f56191001bc524c1a1001c75f561b1001c75f561c1001bc524c1d1001bc524c1e1001881c17001101881c17011101c75f56021101c75f56031101c75f56041101bc524c051101bc524c061101bc524c071101c75f56081101c75f56091101bc524c0a1101bc524c0b1101bc524c0c1101bc524c0d1101bc524c0e1101bc524c0f1101bc524c101101c75f56111101c75f56121101c75f56131101bc524c141101bc524c151101bc524c161101c75f56171101c75f56181101bc524c191101bc524c1a1101bc524c1b1101bc524c1c1101bc524c1d1101bc524c1e1101881c17001201881c17011201c75f56021201c75f56031201bc524c041201c75f56051201c75f56061201bc524c071201bc524c081201bc524c091201bc524c0a1201bc524c0b1201bc524c0c1201c75f560d1201c75f560e1201c75f560f1201bc524c101201c75f56111201c75f56121201bc524c131201c75f56141201c75f56151201bc524c161201bc524c171201bc524c181201bc524c191201bc524c1a1201bc524c1b1201c75f561c1201c75f561d1201c75f561e1201881c17001301881c17011301bc524c021301bc524c031301bc524c041301c75f56051301c75f56061301bc524c071301bc524c081301bc524c091301c75f560a1301c75f560b1301bc524c0c1301c75f560d1301c75f560e1301c75f560f1301bc524c101301bc524c111301bc524c121301bc524c131301c75f56141301c75f56151301bc524c161301bc524c171301bc524c181301c75f56191301c75f561a1301bc524c1b1301c75f561c1301c75f561d1301c75f561e1301881c17001401881c17011401c75f56021401bc524c031401bc524c041401bc524c051401bc524c061401bc524c071401bc524c081401c75f56091401c75f560a1401c75f560b1401bc524c0c1401bc524c0d1401c75f560e1401c75f560f1401bc524c101401c75f56111401bc524c121401bc524c131401bc524c141401bc524c151401bc524c161401bc524c171401c75f56181401c75f56191401c75f561a1401bc524c1b1401bc524c1c1401c75f561d1401c75f561e1401881c17001501881c17011501c75f56021501c75f56031501ae443e041501bc524c051501c75f56061501c75f56071501bc524c081501c75f56091501c75f560a1501bc524c0b1501bc524c0c1501bc524c0d1501ae443e0e1501ae443e0f1501c75f56101501c75f56111501c75f56121501ae443e131501bc524c141501c75f56151501c75f56161501bc524c171501c75f56181501c75f56191501bc524c1a1501bc524c1b1501bc524c1c1501ae443e1d1501ae443e1e1501881c17001601881c17011601c75f56021601bc524c031601ae443e041601ae443e051601c75f56061601c75f56071601bc524c081601bc524c091601ae443e0a1601bc524c0b1601bc524c0c1601bc524c0d1601bc524c0e1601ae443e0f1601c75f56101601c75f56111601bc524c121601ae443e131601ae443e141601c75f56151601c75f56161601bc524c171601bc524c181601ae443e191601bc524c1a1601bc524c1b1601bc524c1c1601bc524c1d1601ae443e1e1601881c17001701881c17011701881c17021701bc524c031701bc524c041701bc524c051701bc524c061701bc524c071701bc524c081701bc524c091701ae443e0a1701ae443e0b1701bc524c0c1701c75f560d1701c75f560e1701bc524c0f1701bc524c101701bc524c111701bc524c121701bc524c131701bc524c141701bc524c151701bc524c161701bc524c171701bc524c181701ae443e191701ae443e1a1701bc524c1b1701c75f561c1701c75f561d1701881c171e1701881c17021801881c17031801881c17041801bc524c051801bc524c061801c75f56071801c75f56081801bc524c091801c75f560a1801c75f560b1801bc524c0c1801c75f560d1801c75f560e1801c75f560f1801ae443e101801ae443e111801c75f56121801c75f56131801bc524c141801bc524c151801c75f56161801c75f56171801bc524c181801c75f56191801c75f561a1801bc524c1b1801881c171c1801881c17041901881c17051901881c17061901c75f56071901c75f56081901bc524c091901c75f560a1901c75f560b1901bc524c0c1901bc524c0d1901c75f560e1901c75f560f1901ae443e101901bc524c111901c75f56121901c75f56131901bc524c141901c75f56151901c75f56161901c75f56171901bc524c181901c75f56191901881c171a1901881c17061a01881c17071a01881c17081a01bc524c091a01bc524c0a1a01bc524c0b1a01bc524c0c1a01bc524c0d1a01bc524c0e1a01bc524c0f1a01bc524c101a01bc524c111a01bc524c121a01bc524c131a01bc524c141a01c75f56151a01c75f56161a01bc524c171a01881c17181a01881c17081b01881c17091b01881c170a1b01ae443e0b1b01ae443e0c1b01bc524c0d1b01bc524c0e1b01bc524c0f1b01c75f56101b01bc524c111b01bc524c121b01bc524c131b01bc524c141b01bc524c151b01881c17161b01881c170a1c01881c170b1c01881c170c1c01c75f560d1c01c75f560e1c01bc524c0f1c01c75f56101c01bc524c111c01bc524c121c01c75f56131c01881c17141c01881c170c1d01881c170d1d01881c170e1d01c75f560f1d01bc524c101d01bc524c111d01881c17121d01881c170e1e01881c170f1e01881c17101e01881c17");
    const Web$Kaelin$Assets$tile$effect$light_red2 = VoxBox$parse$("0e0001652b270f0001652b27100001652b270c0101652b270d0101652b270e010199615b0f010199615b100101a46e65110101652b27120101652b270a0201652b270b0201652b270c0201a46e650d0201a46e650e0201a46e650f020199615b100201a46e65110201a46e6512020199615b130201652b27140201652b27080301652b27090301652b270a0301a46e650b030199615b0c0301a46e650d0301a46e650e0301a46e650f030199615b10030199615b11030199615b12030199615b130301a46e65140301a46e65150301652b27160301652b27060401652b27070401652b27080401a46e65090401a46e650a0401a46e650b040199615b0c040199615b0d0401a46e650e0401a46e650f040199615b100401a46e6511040199615b12040199615b13040199615b14040199615b15040199615b16040199615b170401652b27180401652b27040501652b27050501652b27060501a46e6507050199615b080501a46e65090501a46e650a050199615b0b050199615b0c050199615b0d05018b534d0e05018b534d0f0501a46e65100501a46e65110501a46e651205018b534d13050199615b140501a46e65150501a46e6516050199615b170501a46e65180501a46e65190501652b271a0501652b27020601652b27030601652b270406018b534d050601a46e65060601a46e6507060199615b08060199615b0906018b534d0a060199615b0b060199615b0c060199615b0d060199615b0e06018b534d0f0601a46e65100601a46e6511060199615b1206018b534d1306018b534d140601a46e65150601a46e6516060199615b17060199615b1806018b534d19060199615b1a060199615b1b0601652b271c0601652b27000701652b27010701652b2702070199615b03070199615b04070199615b050701a46e65060701a46e65070701a46e6508070199615b0907018b534d0a07018b534d0b070199615b0c0701a46e650d0701a46e650e070199615b0f070199615b10070199615b11070199615b12070199615b13070199615b14070199615b15070199615b16070199615b17070199615b1807018b534d1907018b534d1a070199615b1b0701a46e651c0701a46e651d0701652b271e0701652b27000801652b2701080199615b020801a46e65030801a46e6504080199615b050801a46e65060801a46e65070801a46e6508080199615b090801a46e650a0801a46e650b080199615b0c080199615b0d0801a46e650e0801a46e650f08018b534d10080199615b110801a46e65120801a46e6513080199615b140801a46e65150801a46e65160801a46e6517080199615b18080199615b19080199615b1a080199615b1b080199615b1c0801a46e651d0801a46e651e0801652b27000901652b2701090199615b02090199615b030901a46e6504090199615b05090199615b060901a46e6507090199615b08090199615b090901a46e650a0901a46e650b090199615b0c090199615b0d0901a46e650e0901a46e650f090199615b10090199615b110901a46e65120901a46e6513090199615b14090199615b150901a46e65160901a46e6517090199615b18090199615b190901a46e651a0901a46e651b090199615b1c090199615b1d090199615b1e0901652b27000a01652b27010a0199615b020a0199615b030a018b534d040a018b534d050a0199615b060a0199615b070a0199615b080a0199615b090a0199615b0a0a01a46e650b0a01a46e650c0a0199615b0d0a0199615b0e0a0199615b0f0a0199615b100a0199615b110a0199615b120a0199615b130a0199615b140a018b534d150a0199615b160a0199615b170a0199615b180a0199615b190a01a46e651a0a01a46e651b0a01a46e651c0a0199615b1d0a0199615b1e0a01652b27000b01652b27010b0199615b020b01a46e65030b0199615b040b0199615b050b01a46e65060b01a46e65070b0199615b080b0199615b090b0199615b0a0b0199615b0b0b0199615b0c0b0199615b0d0b01a46e650e0b0199615b0f0b0199615b100b0199615b110b01a46e65120b0199615b130b0199615b140b018b534d150b01a46e65160b0199615b170b0199615b180b0199615b190b0199615b1a0b0199615b1b0b0199615b1c0b0199615b1d0b0199615b1e0b01652b27000c01652b27010c0199615b020c01a46e65030c0199615b040c0199615b050c0199615b060c0199615b070c01a46e65080c01a46e65090c0199615b0a0c018b534d0b0c018b534d0c0c0199615b0d0c01a46e650e0c0199615b0f0c01a46e65100c0199615b110c0199615b120c0199615b130c0199615b140c0199615b150c0199615b160c01a46e65170c01a46e65180c0199615b190c018b534d1a0c018b534d1b0c0199615b1c0c0199615b1d0c0199615b1e0c01652b27000d01652b27010d0199615b020d0199615b030d01a46e65040d01a46e65050d0199615b060d01a46e65070d01a46e65080d01a46e65090d0199615b0a0d018b534d0b0d0199615b0c0d01a46e650d0d01a46e650e0d0199615b0f0d01a46e65100d0199615b110d0199615b120d01a46e65130d01a46e65140d0199615b150d01a46e65160d01a46e65170d01a46e65180d0199615b190d018b534d1a0d0199615b1b0d01a46e651c0d01a46e651d0d0199615b1e0d01652b27000e01652b27010e0199615b020e01a46e65030e01a46e65040e01a46e65050e0199615b060e01a46e65070e01a46e65080e0199615b090e0199615b0a0e0199615b0b0e0199615b0c0e01a46e650d0e01a46e650e0e01a46e650f0e018b534d100e0199615b110e01a46e65120e01a46e65130e01a46e65140e0199615b150e01a46e65160e01a46e65170e0199615b180e0199615b190e0199615b1a0e0199615b1b0e01a46e651c0e01a46e651d0e01a46e651e0e01652b27000f01652b27010f0199615b020f01a46e65030f01a46e65040f0199615b050f0199615b060f0199615b070f0199615b080f0199615b090f0199615b0a0f0199615b0b0f0199615b0c0f0199615b0d0f01a46e650e0f01a46e650f0f018b534d100f018b534d110f01a46e65120f01a46e65130f0199615b140f0199615b150f0199615b160f0199615b170f0199615b180f0199615b190f0199615b1a0f0199615b1b0f0199615b1c0f01a46e651d0f01a46e651e0f01652b27001001652b2701100199615b021001a46e65031001a46e6504100199615b0510018b534d06100199615b071001a46e65081001a46e65091001a46e650a100199615b0b1001a46e650c1001a46e650d100199615b0e100199615b0f1001a46e6510100199615b111001a46e65121001a46e6513100199615b1410018b534d15100199615b161001a46e65171001a46e65181001a46e6519100199615b1a1001a46e651b1001a46e651c100199615b1d100199615b1e1001652b27001101652b27011101a46e65021101a46e65031101a46e6504110199615b05110199615b06110199615b071101a46e65081101a46e6509110199615b0a110199615b0b110199615b0c110199615b0d110199615b0e110199615b0f110199615b101101a46e65111101a46e65121101a46e6513110199615b14110199615b15110199615b161101a46e65171101a46e6518110199615b19110199615b1a110199615b1b110199615b1c110199615b1d110199615b1e1101652b27001201652b27011201a46e65021201a46e6503120199615b041201a46e65051201a46e6506120199615b07120199615b08120199615b09120199615b0a120199615b0b120199615b0c1201a46e650d1201a46e650e1201a46e650f120199615b101201a46e65111201a46e6512120199615b131201a46e65141201a46e6515120199615b16120199615b17120199615b18120199615b19120199615b1a120199615b1b1201a46e651c1201a46e651d1201a46e651e1201652b27001301652b2701130199615b02130199615b03130199615b041301a46e65051301a46e6506130199615b07130199615b08130199615b091301a46e650a1301a46e650b130199615b0c1301a46e650d1301a46e650e1301a46e650f130199615b10130199615b11130199615b12130199615b131301a46e65141301a46e6515130199615b16130199615b17130199615b181301a46e65191301a46e651a130199615b1b1301a46e651c1301a46e651d1301a46e651e1301652b27001401652b27011401a46e6502140199615b03140199615b04140199615b05140199615b06140199615b07140199615b081401a46e65091401a46e650a1401a46e650b140199615b0c140199615b0d1401a46e650e1401a46e650f140199615b101401a46e6511140199615b12140199615b13140199615b14140199615b15140199615b16140199615b171401a46e65181401a46e65191401a46e651a140199615b1b140199615b1c1401a46e651d1401a46e651e1401652b27001501652b27011501a46e65021501a46e650315018b534d04150199615b051501a46e65061501a46e6507150199615b081501a46e65091501a46e650a150199615b0b150199615b0c150199615b0d15018b534d0e15018b534d0f1501a46e65101501a46e65111501a46e651215018b534d13150199615b141501a46e65151501a46e6516150199615b171501a46e65181501a46e6519150199615b1a150199615b1b150199615b1c15018b534d1d15018b534d1e1501652b27001601652b27011601a46e6502160199615b0316018b534d0416018b534d051601a46e65061601a46e6507160199615b08160199615b0916018b534d0a160199615b0b160199615b0c160199615b0d160199615b0e16018b534d0f1601a46e65101601a46e6511160199615b1216018b534d1316018b534d141601a46e65151601a46e6516160199615b17160199615b1816018b534d19160199615b1a160199615b1b160199615b1c160199615b1d16018b534d1e1601652b27001701652b27011701652b2702170199615b03170199615b04170199615b05170199615b06170199615b07170199615b08170199615b0917018b534d0a17018b534d0b170199615b0c1701a46e650d1701a46e650e170199615b0f170199615b10170199615b11170199615b12170199615b13170199615b14170199615b15170199615b16170199615b17170199615b1817018b534d1917018b534d1a170199615b1b1701a46e651c1701a46e651d1701652b271e1701652b27021801652b27031801652b2704180199615b05180199615b061801a46e65071801a46e6508180199615b091801a46e650a1801a46e650b180199615b0c1801a46e650d1801a46e650e1801a46e650f18018b534d1018018b534d111801a46e65121801a46e6513180199615b14180199615b151801a46e65161801a46e6517180199615b181801a46e65191801a46e651a180199615b1b1801652b271c1801652b27041901652b27051901652b27061901a46e65071901a46e6508190199615b091901a46e650a1901a46e650b190199615b0c190199615b0d1901a46e650e1901a46e650f19018b534d10190199615b111901a46e65121901a46e6513190199615b141901a46e65151901a46e65161901a46e6517190199615b181901a46e65191901652b271a1901652b27061a01652b27071a01652b27081a0199615b091a0199615b0a1a0199615b0b1a0199615b0c1a0199615b0d1a0199615b0e1a0199615b0f1a0199615b101a0199615b111a0199615b121a0199615b131a0199615b141a01a46e65151a01a46e65161a0199615b171a01652b27181a01652b27081b01652b27091b01652b270a1b018b534d0b1b018b534d0c1b0199615b0d1b0199615b0e1b0199615b0f1b01a46e65101b0199615b111b0199615b121b0199615b131b0199615b141b0199615b151b01652b27161b01652b270a1c01652b270b1c01652b270c1c01a46e650d1c01a46e650e1c0199615b0f1c01a46e65101c0199615b111c0199615b121c01a46e65131c01652b27141c01652b270c1d01652b270d1d01652b270e1d01a46e650f1d0199615b101d0199615b111d01652b27121d01652b270e1e01652b270f1e01652b27101e01652b27");

    function Web$Kaelin$Terrain$grass$(_draw$1) {
        var $398 = ({
            _: 'Web.Kaelin.Terrain.grass',
            'draw': _draw$1
        });
        return $398;
    };
    const Web$Kaelin$Terrain$grass = x0 => Web$Kaelin$Terrain$grass$(x0);

    function Web$Kaelin$Entity$background$(_terrain$1) {
        var $399 = ({
            _: 'Web.Kaelin.Entity.background',
            'terrain': _terrain$1
        });
        return $399;
    };
    const Web$Kaelin$Entity$background = x0 => Web$Kaelin$Entity$background$(x0);
    const NatMap = null;
    const I32$sub = a0 => a1 => ((a0 - a1) >> 0);
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
        var $400 = (((_n$1) >> 0));
        return $400;
    };
    const U32$to_i32 = x0 => U32$to_i32$(x0);

    function Web$Kaelin$Coord$Cubic$new$(_x$1, _y$2, _z$3) {
        var $401 = ({
            _: 'Web.Kaelin.Coord.Cubic.new',
            'x': _x$1,
            'y': _y$2,
            'z': _z$3
        });
        return $401;
    };
    const Web$Kaelin$Coord$Cubic$new = x0 => x1 => x2 => Web$Kaelin$Coord$Cubic$new$(x0, x1, x2);

    function Web$Kaelin$Coord$Convert$axial_to_cubic$(_coord$1) {
        var self = _coord$1;
        switch (self._) {
            case 'Web.Kaelin.Coord.new':
                var $403 = self.i;
                var $404 = self.j;
                var _x$4 = $403;
                var _z$5 = $404;
                var _y$6 = ((((-_x$4)) - _z$5) >> 0);
                var $405 = Web$Kaelin$Coord$Cubic$new$(_x$4, _y$6, _z$5);
                var $402 = $405;
                break;
        };
        return $402;
    };
    const Web$Kaelin$Coord$Convert$axial_to_cubic = x0 => Web$Kaelin$Coord$Convert$axial_to_cubic$(x0);

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
                        var $406 = self.pred;
                        var $407 = Word$is_neg$go$($406, Bool$false);
                        return $407;
                    case 'Word.i':
                        var $408 = self.pred;
                        var $409 = Word$is_neg$go$($408, Bool$true);
                        return $409;
                    case 'Word.e':
                        var $410 = _n$3;
                        return $410;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Word$is_neg$go = x0 => x1 => Word$is_neg$go$(x0, x1);

    function Word$is_neg$(_word$2) {
        var $411 = Word$is_neg$go$(_word$2, Bool$false);
        return $411;
    };
    const Word$is_neg = x0 => Word$is_neg$(x0);

    function Word$shr$(_n$2, _value$3) {
        var _n_nat$4 = Word$to_nat$(_n$2);
        var $412 = Word$shift_right$(_n_nat$4, _value$3);
        return $412;
    };
    const Word$shr = x0 => x1 => Word$shr$(x0, x1);

    function Word$s_shr$(_n$2, _value$3) {
        var _neg$4 = Word$is_neg$(_n$2);
        var self = _neg$4;
        if (self) {
            var _n$5 = Word$neg$(_n$2);
            var $414 = Word$shl$(_n$5, _value$3);
            var $413 = $414;
        } else {
            var $415 = Word$shr$(_n$2, _value$3);
            var $413 = $415;
        };
        return $413;
    };
    const Word$s_shr = x0 => x1 => Word$s_shr$(x0, x1);
    const I32$shr = a0 => a1 => (a0 >> a1);

    function Word$xor$(_a$2, _b$3) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $417 = self.pred;
                var $418 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $420 = self.pred;
                            var $421 = (_a$pred$9 => {
                                var $422 = Word$o$(Word$xor$(_a$pred$9, $420));
                                return $422;
                            });
                            var $419 = $421;
                            break;
                        case 'Word.i':
                            var $423 = self.pred;
                            var $424 = (_a$pred$9 => {
                                var $425 = Word$i$(Word$xor$(_a$pred$9, $423));
                                return $425;
                            });
                            var $419 = $424;
                            break;
                        case 'Word.e':
                            var $426 = (_a$pred$7 => {
                                var $427 = Word$e;
                                return $427;
                            });
                            var $419 = $426;
                            break;
                    };
                    var $419 = $419($417);
                    return $419;
                });
                var $416 = $418;
                break;
            case 'Word.i':
                var $428 = self.pred;
                var $429 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $431 = self.pred;
                            var $432 = (_a$pred$9 => {
                                var $433 = Word$i$(Word$xor$(_a$pred$9, $431));
                                return $433;
                            });
                            var $430 = $432;
                            break;
                        case 'Word.i':
                            var $434 = self.pred;
                            var $435 = (_a$pred$9 => {
                                var $436 = Word$o$(Word$xor$(_a$pred$9, $434));
                                return $436;
                            });
                            var $430 = $435;
                            break;
                        case 'Word.e':
                            var $437 = (_a$pred$7 => {
                                var $438 = Word$e;
                                return $438;
                            });
                            var $430 = $437;
                            break;
                    };
                    var $430 = $430($428);
                    return $430;
                });
                var $416 = $429;
                break;
            case 'Word.e':
                var $439 = (_b$4 => {
                    var $440 = Word$e;
                    return $440;
                });
                var $416 = $439;
                break;
        };
        var $416 = $416(_b$3);
        return $416;
    };
    const Word$xor = x0 => x1 => Word$xor$(x0, x1);
    const I32$xor = a0 => a1 => (a0 ^ a1);

    function I32$abs$(_a$1) {
        var _mask$2 = (_a$1 >> 31);
        var $441 = (((_mask$2 + _a$1) >> 0) ^ _mask$2);
        return $441;
    };
    const I32$abs = x0 => I32$abs$(x0);

    function Cmp$as_gtn$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
            case 'Cmp.eql':
                var $443 = Bool$false;
                var $442 = $443;
                break;
            case 'Cmp.gtn':
                var $444 = Bool$true;
                var $442 = $444;
                break;
        };
        return $442;
    };
    const Cmp$as_gtn = x0 => Cmp$as_gtn$(x0);

    function Cmp$inv$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
                var $446 = Cmp$gtn;
                var $445 = $446;
                break;
            case 'Cmp.eql':
                var $447 = Cmp$eql;
                var $445 = $447;
                break;
            case 'Cmp.gtn':
                var $448 = Cmp$ltn;
                var $445 = $448;
                break;
        };
        return $445;
    };
    const Cmp$inv = x0 => Cmp$inv$(x0);

    function Word$s_gtn$(_a$2, _b$3) {
        var _neg_a$4 = Word$is_neg$(_a$2);
        var _neg_b$5 = Word$is_neg$(_b$3);
        var self = _neg_a$4;
        if (self) {
            var self = _neg_b$5;
            if (self) {
                var $451 = Cmp$as_gtn$(Cmp$inv$(Word$cmp$(_a$2, _b$3)));
                var $450 = $451;
            } else {
                var $452 = Bool$false;
                var $450 = $452;
            };
            var $449 = $450;
        } else {
            var self = _neg_b$5;
            if (self) {
                var $454 = Bool$true;
                var $453 = $454;
            } else {
                var $455 = Cmp$as_gtn$(Word$cmp$(_a$2, _b$3));
                var $453 = $455;
            };
            var $449 = $453;
        };
        return $449;
    };
    const Word$s_gtn = x0 => x1 => Word$s_gtn$(x0, x1);
    const I32$gtn = a0 => a1 => (a0 > a1);

    function I32$max$(_a$1, _b$2) {
        var self = (_a$1 > _b$2);
        if (self) {
            var $457 = _a$1;
            var $456 = $457;
        } else {
            var $458 = _b$2;
            var $456 = $458;
        };
        return $456;
    };
    const I32$max = x0 => x1 => I32$max$(x0, x1);

    function Cmp$as_lte$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
            case 'Cmp.eql':
                var $460 = Bool$true;
                var $459 = $460;
                break;
            case 'Cmp.gtn':
                var $461 = Bool$false;
                var $459 = $461;
                break;
        };
        return $459;
    };
    const Cmp$as_lte = x0 => Cmp$as_lte$(x0);

    function Word$lte$(_a$2, _b$3) {
        var $462 = Cmp$as_lte$(Word$cmp$(_a$2, _b$3));
        return $462;
    };
    const Word$lte = x0 => x1 => Word$lte$(x0, x1);
    const U32$lte = a0 => a1 => (a0 <= a1);

    function Web$Kaelin$Coord$fit$(_coord$1, _map_size$2) {
        var _coord$3 = Web$Kaelin$Coord$Convert$axial_to_cubic$(_coord$1);
        var self = _coord$3;
        switch (self._) {
            case 'Web.Kaelin.Coord.Cubic.new':
                var $464 = self.x;
                var $465 = self.y;
                var $466 = self.z;
                var _x$7 = I32$abs$($464);
                var _y$8 = I32$abs$($465);
                var _z$9 = I32$abs$($466);
                var _greater$10 = I32$max$(_x$7, I32$max$(_y$8, _z$9));
                var _greater$11 = I32$to_u32$(_greater$10);
                var $467 = (_greater$11 <= _map_size$2);
                var $463 = $467;
                break;
        };
        return $463;
    };
    const Web$Kaelin$Coord$fit = x0 => x1 => Web$Kaelin$Coord$fit$(x0, x1);
    const Web$Kaelin$Map$arena = (() => {
        var _map$1 = NatMap$new;
        var _map_size$2 = Web$Kaelin$Constants$map_size;
        var _width$3 = ((((_map_size$2 * 2) >>> 0) + 1) >>> 0);
        var _height$4 = ((((_map_size$2 * 2) >>> 0) + 1) >>> 0);
        var _terrain_img$5 = (_sprite$5 => {
            var self = _sprite$5;
            switch (self._) {
                case 'Web.Kaelin.Terrain.Sprite.new':
                    var $470 = self.effect;
                    var $471 = self.indicator;
                    var self = $471;
                    switch (self._) {
                        case 'Maybe.some':
                            var $473 = self.value;
                            var self = $473;
                            switch (self._) {
                                case 'Web.Kaelin.Skill.area.indicator.green':
                                    var $475 = Web$Kaelin$Assets$tile$effect$blue_green2;
                                    var $474 = $475;
                                    break;
                                case 'Web.Kaelin.Skill.area.indicator.red':
                                    var $476 = Web$Kaelin$Assets$tile$effect$dark_red2;
                                    var $474 = $476;
                                    break;
                                case 'Web.Kaelin.Skill.area.indicator.yellow':
                                    var $477 = Web$Kaelin$Assets$tile$effect$light_red2;
                                    var $474 = $477;
                                    break;
                                case 'Web.Kaelin.Skill.area.indicator.blue':
                                    var $478 = Web$Kaelin$Assets$tile$effect$light_blue2;
                                    var $474 = $478;
                                    break;
                            };
                            var $472 = $474;
                            break;
                        case 'Maybe.none':
                            var self = $470;
                            switch (self._) {
                                case 'Web.Kaelin.HexEffect.normal':
                                    var $480 = Web$Kaelin$Assets$tile$green_2;
                                    var $479 = $480;
                                    break;
                                case 'Web.Kaelin.HexEffect.movement':
                                    var $481 = Web$Kaelin$Assets$tile$effect$light_blue2;
                                    var $479 = $481;
                                    break;
                                case 'Web.Kaelin.HexEffect.skill':
                                    var $482 = Web$Kaelin$Assets$tile$effect$dark_blue2;
                                    var $479 = $482;
                                    break;
                            };
                            var $472 = $479;
                            break;
                    };
                    var $469 = $472;
                    break;
            };
            return $469;
        });
        var _new_terrain$6 = Web$Kaelin$Terrain$grass$(_terrain_img$5);
        var _new_terrain$7 = Web$Kaelin$Entity$background$(_new_terrain$6);
        var _map$8 = (() => {
            var $483 = _map$1;
            var $484 = 0;
            var $485 = _height$4;
            let _map$9 = $483;
            for (let _j$8 = $484; _j$8 < $485; ++_j$8) {
                var _map$10 = (() => {
                    var $486 = _map$9;
                    var $487 = 0;
                    var $488 = _width$3;
                    let _map$11 = $486;
                    for (let _i$10 = $487; _i$10 < $488; ++_i$10) {
                        var _coord_i$12 = ((U32$to_i32$(_i$10) - U32$to_i32$(_map_size$2)) >> 0);
                        var _coord_j$13 = ((U32$to_i32$(_j$8) - U32$to_i32$(_map_size$2)) >> 0);
                        var _coord$14 = Web$Kaelin$Coord$new$(_coord_i$12, _coord_j$13);
                        var _fit$15 = Web$Kaelin$Coord$fit$(_coord$14, _map_size$2);
                        var self = _fit$15;
                        if (self) {
                            var $489 = Web$Kaelin$Map$push$(_coord$14, _new_terrain$7, _map$11);
                            var $486 = $489;
                        } else {
                            var $490 = _map$11;
                            var $486 = $490;
                        };
                        _map$11 = $486;
                    };
                    return _map$11;
                })();
                var $483 = _map$10;
                _map$9 = $483;
            };
            return _map$9;
        })();
        var $468 = _map$8;
        return $468;
    })();

    function App$EnvInfo$new$(_screen_size$1, _mouse_pos$2) {
        var $491 = ({
            _: 'App.EnvInfo.new',
            'screen_size': _screen_size$1,
            'mouse_pos': _mouse_pos$2
        });
        return $491;
    };
    const App$EnvInfo$new = x0 => x1 => App$EnvInfo$new$(x0, x1);

    function Web$Kaelin$State$game$(_user$1, _room$2, _players$3, _cast_info$4, _map$5, _internal$6, _env_info$7) {
        var $492 = ({
            _: 'Web.Kaelin.State.game',
            'user': _user$1,
            'room': _room$2,
            'players': _players$3,
            'cast_info': _cast_info$4,
            'map': _map$5,
            'internal': _internal$6,
            'env_info': _env_info$7
        });
        return $492;
    };
    const Web$Kaelin$State$game = x0 => x1 => x2 => x3 => x4 => x5 => x6 => Web$Kaelin$State$game$(x0, x1, x2, x3, x4, x5, x6);

    function Web$Kaelin$Internal$new$(_tick$1, _frame$2, _timer$3) {
        var $493 = ({
            _: 'Web.Kaelin.Internal.new',
            'tick': _tick$1,
            'frame': _frame$2,
            'timer': _timer$3
        });
        return $493;
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
        var $494 = Web$Kaelin$State$game$(_user$1, _room$2, _players$5, _cast_info$6, _map$7, Web$Kaelin$Internal$new$(_tick$3, _frame$4, List$nil), _interface$8);
        return $494;
    })();

    function DOM$text$(_value$1) {
        var $495 = ({
            _: 'DOM.text',
            'value': _value$1
        });
        return $495;
    };
    const DOM$text = x0 => DOM$text$(x0);

    function DOM$vbox$(_props$1, _style$2, _value$3) {
        var $496 = ({
            _: 'DOM.vbox',
            'props': _props$1,
            'style': _style$2,
            'value': _value$3
        });
        return $496;
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
                        var $497 = self.head;
                        var $498 = self.tail;
                        var $499 = List$reverse$go$($498, List$cons$($497, _res$3));
                        return $499;
                    case 'List.nil':
                        var $500 = _res$3;
                        return $500;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const List$reverse$go = x0 => x1 => List$reverse$go$(x0, x1);

    function List$reverse$(_xs$2) {
        var $501 = List$reverse$go$(_xs$2, List$nil);
        return $501;
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
                        var $502 = self.slice(0, -1);
                        var $503 = Bits$reverse$tco$($502, (_r$2 + '0'));
                        return $503;
                    case 'i':
                        var $504 = self.slice(0, -1);
                        var $505 = Bits$reverse$tco$($504, (_r$2 + '1'));
                        return $505;
                    case 'e':
                        var $506 = _r$2;
                        return $506;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Bits$reverse$tco = x0 => x1 => Bits$reverse$tco$(x0, x1);

    function Bits$reverse$(_a$1) {
        var $507 = Bits$reverse$tco$(_a$1, Bits$e);
        return $507;
    };
    const Bits$reverse = x0 => Bits$reverse$(x0);

    function BitsMap$to_list$go$(_xs$2, _key$3, _list$4) {
        var self = _xs$2;
        switch (self._) {
            case 'BitsMap.tie':
                var $509 = self.val;
                var $510 = self.lft;
                var $511 = self.rgt;
                var self = $509;
                switch (self._) {
                    case 'Maybe.some':
                        var $513 = self.value;
                        var $514 = List$cons$(Pair$new$(Bits$reverse$(_key$3), $513), _list$4);
                        var _list0$8 = $514;
                        break;
                    case 'Maybe.none':
                        var $515 = _list$4;
                        var _list0$8 = $515;
                        break;
                };
                var _list1$9 = BitsMap$to_list$go$($510, (_key$3 + '0'), _list0$8);
                var _list2$10 = BitsMap$to_list$go$($511, (_key$3 + '1'), _list1$9);
                var $512 = _list2$10;
                var $508 = $512;
                break;
            case 'BitsMap.new':
                var $516 = _list$4;
                var $508 = $516;
                break;
        };
        return $508;
    };
    const BitsMap$to_list$go = x0 => x1 => x2 => BitsMap$to_list$go$(x0, x1, x2);

    function List$mapped$(_as$2, _f$4) {
        var self = _as$2;
        switch (self._) {
            case 'List.cons':
                var $518 = self.head;
                var $519 = self.tail;
                var $520 = List$cons$(_f$4($518), List$mapped$($519, _f$4));
                var $517 = $520;
                break;
            case 'List.nil':
                var $521 = List$nil;
                var $517 = $521;
                break;
        };
        return $517;
    };
    const List$mapped = x0 => x1 => List$mapped$(x0, x1);

    function Bits$to_nat$(_b$1) {
        var self = _b$1;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'o':
                var $523 = self.slice(0, -1);
                var $524 = (2n * Bits$to_nat$($523));
                var $522 = $524;
                break;
            case 'i':
                var $525 = self.slice(0, -1);
                var $526 = Nat$succ$((2n * Bits$to_nat$($525)));
                var $522 = $526;
                break;
            case 'e':
                var $527 = 0n;
                var $522 = $527;
                break;
        };
        return $522;
    };
    const Bits$to_nat = x0 => Bits$to_nat$(x0);

    function NatMap$to_list$(_xs$2) {
        var _kvs$3 = List$reverse$(BitsMap$to_list$go$(_xs$2, Bits$e, List$nil));
        var $528 = List$mapped$(_kvs$3, (_kv$4 => {
            var self = _kv$4;
            switch (self._) {
                case 'Pair.new':
                    var $530 = self.fst;
                    var $531 = self.snd;
                    var $532 = Pair$new$(Bits$to_nat$($530), $531);
                    var $529 = $532;
                    break;
            };
            return $529;
        }));
        return $528;
    };
    const NatMap$to_list = x0 => NatMap$to_list$(x0);
    const F64$div = a0 => a1 => (a0 / a1);
    const Web$Kaelin$Constants$hexagon_radius = 15;
    const F64$parse = a0 => (parseFloat(a0));
    const Web$Kaelin$Constants$center_x = 128;
    const Web$Kaelin$Constants$center_y = 128;
    const F64$sub = a0 => a1 => (a0 - a1);
    const F64$mul = a0 => a1 => (a0 * a1);
    const F64$add = a0 => a1 => (a0 + a1);

    function Web$Kaelin$Coord$round$floor$(_n$1) {
        var $533 = (((_n$1 >> 0)));
        return $533;
    };
    const Web$Kaelin$Coord$round$floor = x0 => Web$Kaelin$Coord$round$floor$(x0);

    function Web$Kaelin$Coord$round$round_F64$(_n$1) {
        var _half$2 = (parseFloat("+0.5"));
        var _big_number$3 = (parseFloat("+1000.0"));
        var _n$4 = (_n$1 + _big_number$3);
        var _result$5 = Web$Kaelin$Coord$round$floor$((_n$4 + _half$2));
        var $534 = (_result$5 - _big_number$3);
        return $534;
    };
    const Web$Kaelin$Coord$round$round_F64 = x0 => Web$Kaelin$Coord$round$round_F64$(x0);

    function Word$gtn$(_a$2, _b$3) {
        var $535 = Cmp$as_gtn$(Word$cmp$(_a$2, _b$3));
        return $535;
    };
    const Word$gtn = x0 => x1 => Word$gtn$(x0, x1);

    function F64$gtn$(_a$1, _b$2) {
        var self = _a$1;
        switch ('f64') {
            case 'f64':
                var $537 = f64_to_word(self);
                var self = _b$2;
                switch ('f64') {
                    case 'f64':
                        var $539 = f64_to_word(self);
                        var $540 = Word$gtn$($537, $539);
                        var $538 = $540;
                        break;
                };
                var $536 = $538;
                break;
        };
        return $536;
    };
    const F64$gtn = x0 => x1 => F64$gtn$(x0, x1);

    function Web$Kaelin$Coord$round$diff$(_x$1, _y$2) {
        var _big_number$3 = (parseFloat("+1000.0"));
        var _x$4 = (_x$1 + _big_number$3);
        var _y$5 = (_y$2 + _big_number$3);
        var self = F64$gtn$(_x$4, _y$5);
        if (self) {
            var $542 = (_x$4 - _y$5);
            var $541 = $542;
        } else {
            var $543 = (_y$5 - _x$4);
            var $541 = $543;
        };
        return $541;
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
                var $546 = Pair$new$(_i$4(_round_x$6), _i$4(_new_y$12));
                var $545 = $546;
            } else {
                var _new_x$12 = ((_f$3(0) - _round_y$7) - _round_z$8);
                var $547 = Pair$new$(_i$4(_new_x$12), _i$4(_round_y$7));
                var $545 = $547;
            };
            var _result$12 = $545;
        } else {
            var self = F64$gtn$(_diff_y$10, _diff_z$11);
            if (self) {
                var _new_y$12 = ((_f$3(0) - _round_x$6) - _round_z$8);
                var $549 = Pair$new$(_i$4(_round_x$6), _i$4(_new_y$12));
                var $548 = $549;
            } else {
                var $550 = Pair$new$(_i$4(_round_x$6), _i$4(_round_y$7));
                var $548 = $550;
            };
            var _result$12 = $548;
        };
        var $544 = _result$12;
        return $544;
    };
    const Web$Kaelin$Coord$round = x0 => x1 => Web$Kaelin$Coord$round$(x0, x1);

    function Web$Kaelin$Coord$to_axial$(_coord$1) {
        var self = _coord$1;
        switch (self._) {
            case 'Pair.new':
                var $552 = self.fst;
                var $553 = self.snd;
                var _f$4 = U32$to_f64;
                var _i$5 = F64$to_i32;
                var _float_hex_rad$6 = (_f$4(Web$Kaelin$Constants$hexagon_radius) / (parseFloat("+2.0")));
                var _center_x$7 = Web$Kaelin$Constants$center_x;
                var _center_y$8 = Web$Kaelin$Constants$center_y;
                var _float_x$9 = ((_f$4($552) - _f$4(_center_x$7)) / _float_hex_rad$6);
                var _float_y$10 = ((_f$4($553) - _f$4(_center_y$8)) / _float_hex_rad$6);
                var _fourth$11 = (parseFloat("+0.25"));
                var _sixth$12 = ((parseFloat("+1.0")) / (parseFloat("+6.0")));
                var _third$13 = ((parseFloat("+1.0")) / (parseFloat("+3.0")));
                var _half$14 = (parseFloat("+0.5"));
                var _axial_x$15 = ((_float_x$9 * _fourth$11) - (_float_y$10 * _sixth$12));
                var _axial_y$16 = (_float_y$10 * _third$13);
                var self = Web$Kaelin$Coord$round$(_axial_x$15, _axial_y$16);
                switch (self._) {
                    case 'Pair.new':
                        var $555 = self.fst;
                        var $556 = self.snd;
                        var $557 = Web$Kaelin$Coord$new$($555, $556);
                        var $554 = $557;
                        break;
                };
                var $551 = $554;
                break;
        };
        return $551;
    };
    const Web$Kaelin$Coord$to_axial = x0 => Web$Kaelin$Coord$to_axial$(x0);
    const List$for = a0 => a1 => a2 => (list_for(a0)(a1)(a2));

    function Word$mod$(_a$2, _b$3) {
        var _q$4 = Word$div$(_a$2, _b$3);
        var $558 = Word$sub$(_a$2, Word$mul$(_b$3, _q$4));
        return $558;
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
        var $559 = Web$Kaelin$Coord$new$(_coord_i$5, _coord_j$8);
        return $559;
    };
    const Web$Kaelin$Coord$Convert$nat_to_axial = x0 => Web$Kaelin$Coord$Convert$nat_to_axial$(x0);
    const Web$Kaelin$HexEffect$normal = ({
        _: 'Web.Kaelin.HexEffect.normal'
    });

    function List$any$(_cond$2, _list$3) {
        var List$any$ = (_cond$2, _list$3) => ({
            ctr: 'TCO',
            arg: [_cond$2, _list$3]
        });
        var List$any = _cond$2 => _list$3 => List$any$(_cond$2, _list$3);
        var arg = [_cond$2, _list$3];
        while (true) {
            let [_cond$2, _list$3] = arg;
            var R = (() => {
                var self = _list$3;
                switch (self._) {
                    case 'List.cons':
                        var $560 = self.head;
                        var $561 = self.tail;
                        var self = _cond$2($560);
                        if (self) {
                            var $563 = Bool$true;
                            var $562 = $563;
                        } else {
                            var $564 = List$any$(_cond$2, $561);
                            var $562 = $564;
                        };
                        return $562;
                    case 'List.nil':
                        var $565 = Bool$false;
                        return $565;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const List$any = x0 => x1 => List$any$(x0, x1);
    const Bool$and = a0 => a1 => (a0 && a1);
    const I32$eql = a0 => a1 => (a0 === a1);

    function Web$Kaelin$Coord$eql$(_a$1, _b$2) {
        var self = _a$1;
        switch (self._) {
            case 'Web.Kaelin.Coord.new':
                var $567 = self.i;
                var $568 = self.j;
                var self = _b$2;
                switch (self._) {
                    case 'Web.Kaelin.Coord.new':
                        var $570 = self.i;
                        var $571 = self.j;
                        var $572 = (($567 === $570) && ($568 === $571));
                        var $569 = $572;
                        break;
                };
                var $566 = $569;
                break;
        };
        return $566;
    };
    const Web$Kaelin$Coord$eql = x0 => x1 => Web$Kaelin$Coord$eql$(x0, x1);

    function Web$Kaelin$Draw$support$get_effect$(_coord$1, _cast_info$2) {
        var self = _cast_info$2;
        switch (self._) {
            case 'Web.Kaelin.CastInfo.new':
                var $574 = self.hex_effect;
                var $575 = self.range;
                var _is_in_range$9 = List$any$(Web$Kaelin$Coord$eql(_coord$1), $575);
                var self = _is_in_range$9;
                if (self) {
                    var $577 = $574;
                    var $576 = $577;
                } else {
                    var $578 = Web$Kaelin$HexEffect$normal;
                    var $576 = $578;
                };
                var $573 = $576;
                break;
        };
        return $573;
    };
    const Web$Kaelin$Draw$support$get_effect = x0 => x1 => Web$Kaelin$Draw$support$get_effect$(x0, x1);

    function Web$Kaelin$Draw$support$area_of_effect$(_cast_info$1, _coord$2, _coord_nat$3, _area$4) {
        var self = _cast_info$1;
        switch (self._) {
            case 'Web.Kaelin.CastInfo.new':
                var $580 = self.hex_effect;
                var $581 = self.range;
                var $582 = self.mouse_pos;
                var self = $580;
                switch (self._) {
                    case 'Web.Kaelin.HexEffect.normal':
                    case 'Web.Kaelin.HexEffect.movement':
                        var $584 = Maybe$none;
                        var $583 = $584;
                        break;
                    case 'Web.Kaelin.HexEffect.skill':
                        var self = List$any$(Web$Kaelin$Coord$eql($582), $581);
                        if (self) {
                            var $586 = NatMap$get$(_coord_nat$3, _area$4);
                            var $585 = $586;
                        } else {
                            var $587 = Maybe$none;
                            var $585 = $587;
                        };
                        var $583 = $585;
                        break;
                };
                var $579 = $583;
                break;
        };
        return $579;
    };
    const Web$Kaelin$Draw$support$area_of_effect = x0 => x1 => x2 => x3 => Web$Kaelin$Draw$support$area_of_effect$(x0, x1, x2, x3);

    function Web$Kaelin$Terrain$Sprite$new$(_effect$1, _indicator$2) {
        var $588 = ({
            _: 'Web.Kaelin.Terrain.Sprite.new',
            'effect': _effect$1,
            'indicator': _indicator$2
        });
        return $588;
    };
    const Web$Kaelin$Terrain$Sprite$new = x0 => x1 => Web$Kaelin$Terrain$Sprite$new$(x0, x1);

    function Web$Kaelin$Draw$support$get_sprite$(_coord$1, _coord_nat$2, _cast_info$3) {
        var self = _cast_info$3;
        switch (self._) {
            case 'Maybe.some':
                var $590 = self.value;
                var $591 = Web$Kaelin$Draw$support$get_effect$(_coord$1, $590);
                var _hex_effect$4 = $591;
                break;
            case 'Maybe.none':
                var $592 = Web$Kaelin$HexEffect$normal;
                var _hex_effect$4 = $592;
                break;
        };
        var self = _cast_info$3;
        switch (self._) {
            case 'Maybe.some':
                var $593 = self.value;
                var self = $593;
                switch (self._) {
                    case 'Web.Kaelin.CastInfo.new':
                        var $595 = self.area;
                        var $596 = Web$Kaelin$Draw$support$area_of_effect$($593, _coord$1, _coord_nat$2, $595);
                        var $594 = $596;
                        break;
                };
                var _area$5 = $594;
                break;
            case 'Maybe.none':
                var $597 = Maybe$none;
                var _area$5 = $597;
                break;
        };
        var $589 = Web$Kaelin$Terrain$Sprite$new$(_hex_effect$4, _area$5);
        return $589;
    };
    const Web$Kaelin$Draw$support$get_sprite = x0 => x1 => x2 => Web$Kaelin$Draw$support$get_sprite$(x0, x1, x2);

    function Web$Kaelin$Coord$to_screen_xy$(_coord$1) {
        var self = _coord$1;
        switch (self._) {
            case 'Web.Kaelin.Coord.new':
                var $599 = self.i;
                var $600 = self.j;
                var _i$4 = $599;
                var _j$5 = $600;
                var _i$6 = (_i$4);
                var _j$7 = (_j$5);
                var _int_rad$8 = (Web$Kaelin$Constants$hexagon_radius);
                var _hlf$9 = (_int_rad$8 / (parseFloat("+2.0")));
                var _int_screen_center_x$10 = (Web$Kaelin$Constants$center_x);
                var _int_screen_center_y$11 = (Web$Kaelin$Constants$center_y);
                var _cx$12 = (_int_screen_center_x$10 + (_j$7 * _int_rad$8));
                var _cx$13 = (_cx$12 + (_i$6 * (_int_rad$8 * (parseFloat("+2.0")))));
                var _cy$14 = (_int_screen_center_y$11 + (_j$7 * (_hlf$9 * (parseFloat("+3.0")))));
                var _cx$15 = ((_cx$13 >>> 0));
                var _cy$16 = (_cy$14 + (parseFloat("+0.5")));
                var _cy$17 = ((_cy$16 >>> 0));
                var $601 = Pair$new$(_cx$15, _cy$17);
                var $598 = $601;
                break;
        };
        return $598;
    };
    const Web$Kaelin$Coord$to_screen_xy = x0 => Web$Kaelin$Coord$to_screen_xy$(x0);
    const U32$sub = a0 => a1 => ((a0 - a1) >>> 0);

    function Web$Kaelin$Draw$support$centralize$(_coord$1) {
        var self = Web$Kaelin$Coord$to_screen_xy$(_coord$1);
        switch (self._) {
            case 'Pair.new':
                var $603 = self.fst;
                var $604 = self.snd;
                var _i$4 = (($603 - Web$Kaelin$Constants$hexagon_radius) >>> 0);
                var _j$5 = (($604 - Web$Kaelin$Constants$hexagon_radius) >>> 0);
                var $605 = Pair$new$(_i$4, _j$5);
                var $602 = $605;
                break;
        };
        return $602;
    };
    const Web$Kaelin$Draw$support$centralize = x0 => Web$Kaelin$Draw$support$centralize$(x0);

    function VoxBox$get_len$(_img$1) {
        var self = _img$1;
        switch (self._) {
            case 'VoxBox.new':
                var $607 = self.length;
                var $608 = $607;
                var $606 = $608;
                break;
        };
        return $606;
    };
    const VoxBox$get_len = x0 => VoxBox$get_len$(x0);

    function Array$get$(_idx$3, _arr$4) {
        var $609 = Word$foldl$(Array$extract_tip, (_rec$6 => _arr$7 => {
            var _arr_l$8 = Array$extract_tie$(_arr$7);
            var self = _arr_l$8;
            switch (self._) {
                case 'Pair.new':
                    var $611 = self.fst;
                    var $612 = _rec$6($611);
                    var $610 = $612;
                    break;
            };
            return $610;
        }), (_rec$6 => _arr$7 => {
            var _arr_r$8 = Array$extract_tie$(_arr$7);
            var self = _arr_r$8;
            switch (self._) {
                case 'Pair.new':
                    var $614 = self.snd;
                    var $615 = _rec$6($614);
                    var $613 = $615;
                    break;
            };
            return $613;
        }), _idx$3)(_arr$4);
        return $609;
    };
    const Array$get = x0 => x1 => Array$get$(x0, x1);
    const Buffer32$get = a0 => a1 => ((a1[a0]));
    const VoxBox$get_pos = a0 => a1 => ((a1.buffer[a0 * 2]));
    const VoxBox$get_col = a0 => a1 => ((a1.buffer[a0 * 2 + 1]));

    function Word$and$(_a$2, _b$3) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $617 = self.pred;
                var $618 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $620 = self.pred;
                            var $621 = (_a$pred$9 => {
                                var $622 = Word$o$(Word$and$(_a$pred$9, $620));
                                return $622;
                            });
                            var $619 = $621;
                            break;
                        case 'Word.i':
                            var $623 = self.pred;
                            var $624 = (_a$pred$9 => {
                                var $625 = Word$o$(Word$and$(_a$pred$9, $623));
                                return $625;
                            });
                            var $619 = $624;
                            break;
                        case 'Word.e':
                            var $626 = (_a$pred$7 => {
                                var $627 = Word$e;
                                return $627;
                            });
                            var $619 = $626;
                            break;
                    };
                    var $619 = $619($617);
                    return $619;
                });
                var $616 = $618;
                break;
            case 'Word.i':
                var $628 = self.pred;
                var $629 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $631 = self.pred;
                            var $632 = (_a$pred$9 => {
                                var $633 = Word$o$(Word$and$(_a$pred$9, $631));
                                return $633;
                            });
                            var $630 = $632;
                            break;
                        case 'Word.i':
                            var $634 = self.pred;
                            var $635 = (_a$pred$9 => {
                                var $636 = Word$i$(Word$and$(_a$pred$9, $634));
                                return $636;
                            });
                            var $630 = $635;
                            break;
                        case 'Word.e':
                            var $637 = (_a$pred$7 => {
                                var $638 = Word$e;
                                return $638;
                            });
                            var $630 = $637;
                            break;
                    };
                    var $630 = $630($628);
                    return $630;
                });
                var $616 = $629;
                break;
            case 'Word.e':
                var $639 = (_b$4 => {
                    var $640 = Word$e;
                    return $640;
                });
                var $616 = $639;
                break;
        };
        var $616 = $616(_b$3);
        return $616;
    };
    const Word$and = x0 => x1 => Word$and$(x0, x1);
    const U32$and = a0 => a1 => (a0 & a1);
    const U32$shr = a0 => a1 => (a0 >>> a1);

    function VoxBox$Draw$image$(_x$1, _y$2, _z$3, _src$4, _img$5) {
        var _len$6 = VoxBox$get_len$(_src$4);
        var _img$7 = (() => {
            var $642 = _img$5;
            var $643 = 0;
            var $644 = _len$6;
            let _img$8 = $642;
            for (let _i$7 = $643; _i$7 < $644; ++_i$7) {
                var _pos$9 = ((_src$4.buffer[_i$7 * 2]));
                var _col$10 = ((_src$4.buffer[_i$7 * 2 + 1]));
                var _p_x$11 = (_pos$9 & 4095);
                var _p_y$12 = ((_pos$9 & 16773120) >>> 12);
                var _p_z$13 = ((_pos$9 & 4278190080) >>> 24);
                var _p_x$14 = ((_p_x$11 + _x$1) >>> 0);
                var _p_y$15 = ((_p_y$12 + _y$2) >>> 0);
                var _p_z$16 = ((_p_z$13 + _z$3) >>> 0);
                var _pos$17 = ((0 | _p_x$14 | (_p_y$15 << 12) | (_p_z$16 << 24)));
                var $642 = ((_img$8.buffer[_img$8.length * 2] = _pos$17, _img$8.buffer[_img$8.length * 2 + 1] = _col$10, _img$8.length++, _img$8));
                _img$8 = $642;
            };
            return _img$8;
        })();
        var $641 = _img$7;
        return $641;
    };
    const VoxBox$Draw$image = x0 => x1 => x2 => x3 => x4 => VoxBox$Draw$image$(x0, x1, x2, x3, x4);

    function Web$Kaelin$Draw$state$background$(_map$1, _cast_info$2, _env_info$3, _img$4) {
        var self = _env_info$3;
        switch (self._) {
            case 'App.EnvInfo.new':
                var $646 = self.mouse_pos;
                var _list$7 = NatMap$to_list$(_map$1);
                var _mouse_coord$8 = Web$Kaelin$Coord$to_axial$($646);
                var _img$9 = (() => {
                    var $649 = _img$4;
                    var $650 = _list$7;
                    let _img$10 = $649;
                    let _pair$9;
                    while ($650._ === 'List.cons') {
                        _pair$9 = $650.head;
                        var self = _pair$9;
                        switch (self._) {
                            case 'Pair.new':
                                var $651 = self.fst;
                                var $652 = self.snd;
                                var _coord$13 = Web$Kaelin$Coord$Convert$nat_to_axial$($651);
                                var _coord_nat$14 = $651;
                                var _sprite$15 = Web$Kaelin$Draw$support$get_sprite$(_coord$13, _coord_nat$14, _cast_info$2);
                                var _tile$16 = $652;
                                var _img$17 = (() => {
                                    var $655 = _img$10;
                                    var $656 = _tile$16;
                                    let _img$18 = $655;
                                    let _entity$17;
                                    while ($656._ === 'List.cons') {
                                        _entity$17 = $656.head;
                                        var self = _entity$17;
                                        switch (self._) {
                                            case 'Web.Kaelin.Entity.background':
                                                var $657 = self.terrain;
                                                var self = $657;
                                                switch (self._) {
                                                    case 'Web.Kaelin.Terrain.grass':
                                                        var $659 = self.draw;
                                                        var self = Web$Kaelin$Draw$support$centralize$(_coord$13);
                                                        switch (self._) {
                                                            case 'Pair.new':
                                                                var $661 = self.fst;
                                                                var $662 = self.snd;
                                                                var $663 = VoxBox$Draw$image$($661, $662, 0, $659(_sprite$15), _img$18);
                                                                var $660 = $663;
                                                                break;
                                                        };
                                                        var $658 = $660;
                                                        break;
                                                };
                                                var $655 = $658;
                                                break;
                                            case 'Web.Kaelin.Entity.creature':
                                                var $664 = _img$18;
                                                var $655 = $664;
                                                break;
                                        };
                                        _img$18 = $655;
                                        $656 = $656.tail;
                                    }
                                    return _img$18;
                                })();
                                var $653 = _img$17;
                                var $649 = $653;
                                break;
                        };
                        _img$10 = $649;
                        $650 = $650.tail;
                    }
                    return _img$10;
                })();
                var $647 = _img$9;
                var $645 = $647;
                break;
        };
        return $645;
    };
    const Web$Kaelin$Draw$state$background = x0 => x1 => x2 => x3 => Web$Kaelin$Draw$state$background$(x0, x1, x2, x3);
    const Web$Kaelin$Assets$tile$mouse_ui = VoxBox$parse$("0d0302ffffff0e0302ffffff0f0302ffffff100302ffffff110302ffffff0b0402ffffff0c0402ffffff0d0402ffffff0e0402ffffff0f0402ffffff100402ffffff110402ffffff120402ffffff130402ffffff0b0502ffffff0c0502ffffff0d0502ffffff110502ffffff120502ffffff130502ffffff040702ffffff050702ffffff060702ffffff180702ffffff190702ffffff1a0702ffffff030802ffffff040802ffffff050802ffffff060802ffffff180802ffffff190802ffffff1a0802ffffff1b0802ffffff020902ffffff030902ffffff040902ffffff1a0902ffffff1b0902ffffff1c0902ffffff020a02ffffff030a02ffffff1b0a02ffffff1c0a02ffffff020b02ffffff030b02ffffff1b0b02ffffff1c0b02ffffff021302ffffff031302ffffff1b1302ffffff1c1302ffffff021402ffffff031402ffffff1b1402ffffff1c1402ffffff021502ffffff031502ffffff041502ffffff1a1502ffffff1b1502ffffff1c1502ffffff031602ffffff041602ffffff051602ffffff061602ffffff181602ffffff191602ffffff1a1602ffffff1b1602ffffff041702ffffff051702ffffff061702ffffff181702ffffff191702ffffff1a1702ffffff0b1902ffffff0c1902ffffff0d1902ffffff111902ffffff121902ffffff131902ffffff0b1a02ffffff0c1a02ffffff0d1a02ffffff0e1a02ffffff0f1a02ffffff101a02ffffff111a02ffffff121a02ffffff131a02ffffff0d1b02ffffff0e1b02ffffff0f1b02ffffff101b02ffffff111b02ffffff");

    function Web$Kaelin$Draw$state$mouse_ui$(_info$1, _img$2) {
        var self = _info$1;
        switch (self._) {
            case 'App.EnvInfo.new':
                var $666 = self.mouse_pos;
                var _coord$5 = Web$Kaelin$Coord$to_axial$($666);
                var self = Web$Kaelin$Draw$support$centralize$(_coord$5);
                switch (self._) {
                    case 'Pair.new':
                        var $668 = self.fst;
                        var $669 = self.snd;
                        var $670 = VoxBox$Draw$image$($668, $669, 0, Web$Kaelin$Assets$tile$mouse_ui, _img$2);
                        var $667 = $670;
                        break;
                };
                var $665 = $667;
                break;
        };
        return $665;
    };
    const Web$Kaelin$Draw$state$mouse_ui = x0 => x1 => Web$Kaelin$Draw$state$mouse_ui$(x0, x1);

    function Web$Kaelin$Draw$hero$(_cx$1, _cy$2, _z$3, _hero$4, _img$5) {
        var self = _hero$4;
        switch (self._) {
            case 'Web.Kaelin.Hero.new':
                var $672 = self.img;
                var _aux_y$10 = ((Web$Kaelin$Constants$hexagon_radius * 2) >>> 0);
                var _cy$11 = ((_cy$2 - _aux_y$10) >>> 0);
                var _cx$12 = ((_cx$1 - Web$Kaelin$Constants$hexagon_radius) >>> 0);
                var $673 = VoxBox$Draw$image$(_cx$12, _cy$11, 0, $672, _img$5);
                var $671 = $673;
                break;
        };
        return $671;
    };
    const Web$Kaelin$Draw$hero = x0 => x1 => x2 => x3 => x4 => Web$Kaelin$Draw$hero$(x0, x1, x2, x3, x4);

    function Map$get$(_key$2, _map$3) {
        var $674 = (bitsmap_get(String$to_bits$(_key$2), _map$3));
        return $674;
    };
    const Map$get = x0 => x1 => Map$get$(x0, x1);
    const Nat$gtn = a0 => a1 => (a0 > a1);

    function Int$is_neg$(_a$1) {
        var self = _a$1;
        switch ("new") {
            case 'new':
                var $676 = int_pos(self);
                var $677 = int_neg(self);
                var $678 = ($677 > $676);
                var $675 = $678;
                break;
        };
        return $675;
    };
    const Int$is_neg = x0 => Int$is_neg$(x0);

    function Int$neg$(_a$1) {
        var self = _a$1;
        switch ("new") {
            case 'new':
                var $680 = int_pos(self);
                var $681 = int_neg(self);
                var $682 = ($681 - $680);
                var $679 = $682;
                break;
        };
        return $679;
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
                    var $685 = int_pos(self);
                    var $686 = $685;
                    var $684 = $686;
                    break;
            };
            var $683 = $684;
        } else {
            var self = _a$1;
            switch ("new") {
                case 'new':
                    var $688 = int_pos(self);
                    var $689 = $688;
                    var $687 = $689;
                    break;
            };
            var $683 = $687;
        };
        return $683;
    };
    const Int$abs = x0 => Int$abs$(x0);

    function Int$to_nat_signed$(_a$1) {
        var $690 = Pair$new$(Int$is_neg$(_a$1), Int$abs$(_a$1));
        return $690;
    };
    const Int$to_nat_signed = x0 => Int$to_nat_signed$(x0);

    function String$cons$(_head$1, _tail$2) {
        var $691 = (String.fromCharCode(_head$1) + _tail$2);
        return $691;
    };
    const String$cons = x0 => x1 => String$cons$(x0, x1);
    const String$concat = a0 => a1 => (a0 + a1);

    function List$fold$(_list$2, _nil$4, _cons$5) {
        var self = _list$2;
        switch (self._) {
            case 'List.cons':
                var $693 = self.head;
                var $694 = self.tail;
                var $695 = _cons$5($693)(List$fold$($694, _nil$4, _cons$5));
                var $692 = $695;
                break;
            case 'List.nil':
                var $696 = _nil$4;
                var $692 = $696;
                break;
        };
        return $692;
    };
    const List$fold = x0 => x1 => x2 => List$fold$(x0, x1, x2);

    function Either$(_A$1, _B$2) {
        var $697 = null;
        return $697;
    };
    const Either = x0 => x1 => Either$(x0, x1);

    function Either$left$(_value$3) {
        var $698 = ({
            _: 'Either.left',
            'value': _value$3
        });
        return $698;
    };
    const Either$left = x0 => Either$left$(x0);

    function Either$right$(_value$3) {
        var $699 = ({
            _: 'Either.right',
            'value': _value$3
        });
        return $699;
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
                    var $700 = Either$left$(_n$1);
                    return $700;
                } else {
                    var $701 = (self - 1n);
                    var self = _n$1;
                    if (self === 0n) {
                        var $703 = Either$right$(Nat$succ$($701));
                        var $702 = $703;
                    } else {
                        var $704 = (self - 1n);
                        var $705 = Nat$sub_rem$($704, $701);
                        var $702 = $705;
                    };
                    return $702;
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
                        var $706 = self.value;
                        var $707 = Nat$div_mod$go$($706, _m$2, Nat$succ$(_d$3));
                        return $707;
                    case 'Either.right':
                        var $708 = Pair$new$(_d$3, _n$1);
                        return $708;
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
                        var $709 = self.fst;
                        var $710 = self.snd;
                        var self = $709;
                        if (self === 0n) {
                            var $712 = List$cons$($710, _res$3);
                            var $711 = $712;
                        } else {
                            var $713 = (self - 1n);
                            var $714 = Nat$to_base$go$(_base$1, $709, List$cons$($710, _res$3));
                            var $711 = $714;
                        };
                        return $711;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Nat$to_base$go = x0 => x1 => x2 => Nat$to_base$go$(x0, x1, x2);

    function Nat$to_base$(_base$1, _nat$2) {
        var $715 = Nat$to_base$go$(_base$1, _nat$2, List$nil);
        return $715;
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
                    var $716 = Nat$mod$go$(_n$1, _r$3, _m$2);
                    return $716;
                } else {
                    var $717 = (self - 1n);
                    var self = _n$1;
                    if (self === 0n) {
                        var $719 = _r$3;
                        var $718 = $719;
                    } else {
                        var $720 = (self - 1n);
                        var $721 = Nat$mod$go$($720, $717, Nat$succ$(_r$3));
                        var $718 = $721;
                    };
                    return $718;
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
                        var $722 = self.head;
                        var $723 = self.tail;
                        var self = _index$2;
                        if (self === 0n) {
                            var $725 = Maybe$some$($722);
                            var $724 = $725;
                        } else {
                            var $726 = (self - 1n);
                            var $727 = List$at$($726, $723);
                            var $724 = $727;
                        };
                        return $724;
                    case 'List.nil':
                        var $728 = Maybe$none;
                        return $728;
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
                    var $731 = self.value;
                    var $732 = $731;
                    var $730 = $732;
                    break;
                case 'Maybe.none':
                    var $733 = 35;
                    var $730 = $733;
                    break;
            };
            var $729 = $730;
        } else {
            var $734 = 35;
            var $729 = $734;
        };
        return $729;
    };
    const Nat$show_digit = x0 => x1 => Nat$show_digit$(x0, x1);

    function Nat$to_string_base$(_base$1, _nat$2) {
        var $735 = List$fold$(Nat$to_base$(_base$1, _nat$2), String$nil, (_n$3 => _str$4 => {
            var $736 = String$cons$(Nat$show_digit$(_base$1, _n$3), _str$4);
            return $736;
        }));
        return $735;
    };
    const Nat$to_string_base = x0 => x1 => Nat$to_string_base$(x0, x1);

    function Nat$show$(_n$1) {
        var $737 = Nat$to_string_base$(10n, _n$1);
        return $737;
    };
    const Nat$show = x0 => Nat$show$(x0);

    function Int$show$(_a$1) {
        var _result$2 = Int$to_nat_signed$(_a$1);
        var self = _result$2;
        switch (self._) {
            case 'Pair.new':
                var $739 = self.fst;
                var $740 = self.snd;
                var self = $739;
                if (self) {
                    var $742 = ("-" + Nat$show$($740));
                    var $741 = $742;
                } else {
                    var $743 = ("+" + Nat$show$($740));
                    var $741 = $743;
                };
                var $738 = $741;
                break;
        };
        return $738;
    };
    const Int$show = x0 => Int$show$(x0);

    function Word$abs$(_a$2) {
        var _neg$3 = Word$is_neg$(_a$2);
        var self = _neg$3;
        if (self) {
            var $745 = Word$neg$(_a$2);
            var $744 = $745;
        } else {
            var $746 = _a$2;
            var $744 = $746;
        };
        return $744;
    };
    const Word$abs = x0 => Word$abs$(x0);

    function Word$to_int$(_a$2) {
        var _neg$3 = Word$is_neg$(_a$2);
        var _i$4 = (Word$to_nat$(Word$abs$(_a$2)));
        var self = _neg$3;
        if (self) {
            var $748 = Int$neg$(_i$4);
            var $747 = $748;
        } else {
            var $749 = _i$4;
            var $747 = $749;
        };
        return $747;
    };
    const Word$to_int = x0 => Word$to_int$(x0);

    function I32$to_int$(_a$1) {
        var self = _a$1;
        switch ('i32') {
            case 'i32':
                var $751 = i32_to_word(self);
                var $752 = Word$to_int$($751);
                var $750 = $752;
                break;
        };
        return $750;
    };
    const I32$to_int = x0 => I32$to_int$(x0);

    function List$imap$(_f$3, _xs$4) {
        var self = _xs$4;
        switch (self._) {
            case 'List.cons':
                var $754 = self.head;
                var $755 = self.tail;
                var $756 = List$cons$(_f$3(0n)($754), List$imap$((_n$7 => {
                    var $757 = _f$3(Nat$succ$(_n$7));
                    return $757;
                }), $755));
                var $753 = $756;
                break;
            case 'List.nil':
                var $758 = List$nil;
                var $753 = $758;
                break;
        };
        return $753;
    };
    const List$imap = x0 => x1 => List$imap$(x0, x1);

    function List$indices$u32$(_xs$2) {
        var $759 = List$imap$((_i$3 => _x$4 => {
            var $760 = Pair$new$((Number(_i$3) >>> 0), _x$4);
            return $760;
        }), _xs$2);
        return $759;
    };
    const List$indices$u32 = x0 => List$indices$u32$(x0);

    function String$to_list$(_str$1) {
        var self = _str$1;
        if (self.length === 0) {
            var $762 = List$nil;
            var $761 = $762;
        } else {
            var $763 = self.charCodeAt(0);
            var $764 = self.slice(1);
            var $765 = List$cons$($763, String$to_list$($764));
            var $761 = $765;
        };
        return $761;
    };
    const String$to_list = x0 => String$to_list$(x0);

    function U16$show_hex$(_a$1) {
        var self = _a$1;
        switch ('u16') {
            case 'u16':
                var $767 = u16_to_word(self);
                var $768 = Nat$to_string_base$(16n, Bits$to_nat$(Word$to_bits$($767)));
                var $766 = $768;
                break;
        };
        return $766;
    };
    const U16$show_hex = x0 => U16$show_hex$(x0);

    function PixelFont$get_img$(_char$1, _map$2) {
        var self = Map$get$(U16$show_hex$(_char$1), _map$2);
        switch (self._) {
            case 'Maybe.some':
                var $770 = self.value;
                var $771 = Maybe$some$($770);
                var $769 = $771;
                break;
            case 'Maybe.none':
                var $772 = Maybe$none;
                var $769 = $772;
                break;
        };
        return $769;
    };
    const PixelFont$get_img = x0 => x1 => PixelFont$get_img$(x0, x1);
    const Pos32$get_x = a0 => ((a0 & 0xFFF));
    const Pos32$get_y = a0 => (((a0 >>> 12) & 0xFFF));
    const Pos32$get_z = a0 => ((a0 >>> 24));

    function VoxBox$Draw$text$char$(_chr$1, _font_map$2, _chr_pos$3, _scr$4) {
        var self = PixelFont$get_img$(_chr$1, _font_map$2);
        switch (self._) {
            case 'Maybe.some':
                var $774 = self.value;
                var _x$6 = ((_chr_pos$3 & 0xFFF));
                var _y$7 = (((_chr_pos$3 >>> 12) & 0xFFF));
                var _z$8 = ((_chr_pos$3 >>> 24));
                var $775 = VoxBox$Draw$image$(_x$6, _y$7, _z$8, $774, _scr$4);
                var $773 = $775;
                break;
            case 'Maybe.none':
                var $776 = _scr$4;
                var $773 = $776;
                break;
        };
        return $773;
    };
    const VoxBox$Draw$text$char = x0 => x1 => x2 => x3 => VoxBox$Draw$text$char$(x0, x1, x2, x3);

    function Pos32$add$(_a$1, _b$2) {
        var _x$3 = ((((_a$1 & 0xFFF)) + ((_b$2 & 0xFFF))) >>> 0);
        var _y$4 = (((((_a$1 >>> 12) & 0xFFF)) + (((_b$2 >>> 12) & 0xFFF))) >>> 0);
        var _z$5 = ((((_a$1 >>> 24)) + ((_b$2 >>> 24))) >>> 0);
        var $777 = ((0 | _x$3 | (_y$4 << 12) | (_z$5 << 24)));
        return $777;
    };
    const Pos32$add = x0 => x1 => Pos32$add$(x0, x1);

    function VoxBox$Draw$text$(_txt$1, _font_map$2, _pos$3, _scr$4) {
        var _scr$5 = (() => {
            var $780 = _scr$4;
            var $781 = List$indices$u32$(String$to_list$(_txt$1));
            let _scr$6 = $780;
            let _pair$5;
            while ($781._ === 'List.cons') {
                _pair$5 = $781.head;
                var self = _pair$5;
                switch (self._) {
                    case 'Pair.new':
                        var $782 = self.fst;
                        var $783 = self.snd;
                        var _add_pos$9 = ((0 | (($782 * 6) >>> 0) | (0 << 12) | (0 << 24)));
                        var $784 = VoxBox$Draw$text$char$($783, _font_map$2, Pos32$add$(_pos$3, _add_pos$9), _scr$6);
                        var $780 = $784;
                        break;
                };
                _scr$6 = $780;
                $781 = $781.tail;
            }
            return _scr$6;
        })();
        var $778 = _scr$5;
        return $778;
    };
    const VoxBox$Draw$text = x0 => x1 => x2 => x3 => VoxBox$Draw$text$(x0, x1, x2, x3);
    const Map$new = BitsMap$new;

    function Map$set$(_key$2, _val$3, _map$4) {
        var $785 = (bitsmap_set(String$to_bits$(_key$2), _val$3, _map$4, 'set'));
        return $785;
    };
    const Map$set = x0 => x1 => x2 => Map$set$(x0, x1, x2);

    function PixelFont$set_img$(_char$1, _img$2, _map$3) {
        var $786 = Map$set$(U16$show_hex$(_char$1), _img$2, _map$3);
        return $786;
    };
    const PixelFont$set_img = x0 => x1 => x2 => PixelFont$set_img$(x0, x1, x2);

    function U16$new$(_value$1) {
        var $787 = word_to_u16(_value$1);
        return $787;
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
        var $788 = _map$96;
        return $788;
    })();

    function Web$Kaelin$Draw$state$players_hp$(_cx$1, _cy$2, _player$3, _img$4) {
        var self = _player$3;
        switch (self._) {
            case 'Maybe.some':
                var $790 = self.value;
                var self = $790;
                switch (self._) {
                    case 'Web.Kaelin.Player.new':
                        var $792 = self.current_hp;
                        var _cy$10 = ((_cy$2 + Web$Kaelin$Constants$hexagon_radius) >>> 0);
                        var _str$11 = Int$show$(I32$to_int$($792));
                        var $793 = VoxBox$Draw$text$(_str$11, PixelFont$small_black, ((0 | _cx$1 | (_cy$10 << 12) | (0 << 24))), _img$4);
                        var $791 = $793;
                        break;
                };
                var $789 = $791;
                break;
            case 'Maybe.none':
                var $794 = _img$4;
                var $789 = $794;
                break;
        };
        return $789;
    };
    const Web$Kaelin$Draw$state$players_hp = x0 => x1 => x2 => x3 => Web$Kaelin$Draw$state$players_hp$(x0, x1, x2, x3);

    function Web$Kaelin$Draw$state$players$(_map$1, _players$2, _img$3) {
        var _player_list$4 = NatMap$to_list$(_map$1);
        var _img$5 = (() => {
            var $797 = _img$3;
            var $798 = _player_list$4;
            let _img$6 = $797;
            let _prs$5;
            while ($798._ === 'List.cons') {
                _prs$5 = $798.head;
                var self = _prs$5;
                switch (self._) {
                    case 'Pair.new':
                        var $799 = self.fst;
                        var $800 = self.snd;
                        var _coord$9 = Web$Kaelin$Coord$Convert$nat_to_axial$($799);
                        var self = Web$Kaelin$Coord$to_screen_xy$(_coord$9);
                        switch (self._) {
                            case 'Pair.new':
                                var $802 = self.fst;
                                var $803 = self.snd;
                                var _img$12 = (() => {
                                    var $806 = _img$6;
                                    var $807 = $800;
                                    let _img$13 = $806;
                                    let _entity$12;
                                    while ($807._ === 'List.cons') {
                                        _entity$12 = $807.head;
                                        var self = _entity$12;
                                        switch (self._) {
                                            case 'Web.Kaelin.Entity.creature':
                                                var $808 = self.player;
                                                var $809 = self.hero;
                                                var _img$16 = Web$Kaelin$Draw$hero$($802, $803, 0, $809, _img$13);
                                                var self = $808;
                                                switch (self._) {
                                                    case 'Maybe.some':
                                                        var $811 = self.value;
                                                        var _player$18 = Map$get$($811, _players$2);
                                                        var $812 = Web$Kaelin$Draw$state$players_hp$($802, (($803 - Web$Kaelin$Constants$hexagon_radius) >>> 0), _player$18, _img$16);
                                                        var $810 = $812;
                                                        break;
                                                    case 'Maybe.none':
                                                        var $813 = _img$16;
                                                        var $810 = $813;
                                                        break;
                                                };
                                                var $806 = $810;
                                                break;
                                            case 'Web.Kaelin.Entity.background':
                                                var $814 = _img$13;
                                                var $806 = $814;
                                                break;
                                        };
                                        _img$13 = $806;
                                        $807 = $807.tail;
                                    }
                                    return _img$13;
                                })();
                                var $804 = _img$12;
                                var $801 = $804;
                                break;
                        };
                        var $797 = $801;
                        break;
                };
                _img$6 = $797;
                $798 = $798.tail;
            }
            return _img$6;
        })();
        var $795 = _img$5;
        return $795;
    };
    const Web$Kaelin$Draw$state$players = x0 => x1 => x2 => Web$Kaelin$Draw$state$players$(x0, x1, x2);

    function Web$Kaelin$Draw$state$(_img$1, _state$2) {
        var self = _state$2;
        switch (self._) {
            case 'Web.Kaelin.State.game':
                var $816 = self.players;
                var $817 = self.cast_info;
                var $818 = self.map;
                var $819 = self.env_info;
                var _img$10 = Web$Kaelin$Draw$state$background$($818, $817, $819, _img$1);
                var _img$11 = Web$Kaelin$Draw$state$mouse_ui$($819, _img$10);
                var _img$12 = Web$Kaelin$Draw$state$players$($818, $816, _img$11);
                var $820 = _img$12;
                var $815 = $820;
                break;
            case 'Web.Kaelin.State.init':
            case 'Web.Kaelin.State.void':
                var $821 = _img$1;
                var $815 = $821;
                break;
        };
        return $815;
    };
    const Web$Kaelin$Draw$state = x0 => x1 => Web$Kaelin$Draw$state$(x0, x1);

    function Web$Kaelin$App$draw$(_img$1, _state$2) {
        var self = _state$2;
        switch (self._) {
            case 'Web.Kaelin.State.init':
            case 'Web.Kaelin.State.void':
                var $823 = DOM$text$("TODO: create the renderer for this game state mode");
                var $822 = $823;
                break;
            case 'Web.Kaelin.State.game':
                var $824 = DOM$vbox$(BitsMap$new, BitsMap$new, Web$Kaelin$Draw$state$(_img$1, _state$2));
                var $822 = $824;
                break;
        };
        return $822;
    };
    const Web$Kaelin$App$draw = x0 => x1 => Web$Kaelin$App$draw$(x0, x1);

    function IO$(_A$1) {
        var $825 = null;
        return $825;
    };
    const IO = x0 => IO$(x0);

    function IO$ask$(_query$2, _param$3, _then$4) {
        var $826 = ({
            _: 'IO.ask',
            'query': _query$2,
            'param': _param$3,
            'then': _then$4
        });
        return $826;
    };
    const IO$ask = x0 => x1 => x2 => IO$ask$(x0, x1, x2);

    function IO$bind$(_a$3, _f$4) {
        var self = _a$3;
        switch (self._) {
            case 'IO.end':
                var $828 = self.value;
                var $829 = _f$4($828);
                var $827 = $829;
                break;
            case 'IO.ask':
                var $830 = self.query;
                var $831 = self.param;
                var $832 = self.then;
                var $833 = IO$ask$($830, $831, (_x$8 => {
                    var $834 = IO$bind$($832(_x$8), _f$4);
                    return $834;
                }));
                var $827 = $833;
                break;
        };
        return $827;
    };
    const IO$bind = x0 => x1 => IO$bind$(x0, x1);

    function IO$end$(_value$2) {
        var $835 = ({
            _: 'IO.end',
            'value': _value$2
        });
        return $835;
    };
    const IO$end = x0 => IO$end$(x0);

    function IO$monad$(_new$2) {
        var $836 = _new$2(IO$bind)(IO$end);
        return $836;
    };
    const IO$monad = x0 => IO$monad$(x0);

    function Dynamic$new$(_value$2) {
        var $837 = ({
            _: 'Dynamic.new',
            'value': _value$2
        });
        return $837;
    };
    const Dynamic$new = x0 => Dynamic$new$(x0);
    const App$pass = IO$monad$((_m$bind$1 => _m$pure$2 => {
        var $838 = _m$pure$2;
        return $838;
    }))(Dynamic$new$(Unit$new));

    function String$map$(_f$1, _as$2) {
        var self = _as$2;
        if (self.length === 0) {
            var $840 = String$nil;
            var $839 = $840;
        } else {
            var $841 = self.charCodeAt(0);
            var $842 = self.slice(1);
            var $843 = String$cons$(_f$1($841), String$map$(_f$1, $842));
            var $839 = $843;
        };
        return $839;
    };
    const String$map = x0 => x1 => String$map$(x0, x1);
    const U16$gte = a0 => a1 => (a0 >= a1);
    const U16$lte = a0 => a1 => (a0 <= a1);
    const U16$add = a0 => a1 => ((a0 + a1) & 0xFFFF);

    function Char$to_lower$(_char$1) {
        var self = ((_char$1 >= 65) && (_char$1 <= 90));
        if (self) {
            var $845 = ((_char$1 + 32) & 0xFFFF);
            var $844 = $845;
        } else {
            var $846 = _char$1;
            var $844 = $846;
        };
        return $844;
    };
    const Char$to_lower = x0 => Char$to_lower$(x0);

    function String$to_lower$(_str$1) {
        var $847 = String$map$(Char$to_lower, _str$1);
        return $847;
    };
    const String$to_lower = x0 => String$to_lower$(x0);

    function IO$do$(_call$1, _param$2) {
        var $848 = IO$ask$(_call$1, _param$2, (_answer$3 => {
            var $849 = IO$end$(Unit$new);
            return $849;
        }));
        return $848;
    };
    const IO$do = x0 => x1 => IO$do$(x0, x1);

    function App$do$(_call$1, _param$2) {
        var $850 = IO$monad$((_m$bind$3 => _m$pure$4 => {
            var $851 = _m$bind$3;
            return $851;
        }))(IO$do$(_call$1, _param$2))((_$3 => {
            var $852 = App$pass;
            return $852;
        }));
        return $850;
    };
    const App$do = x0 => x1 => App$do$(x0, x1);

    function App$watch$(_room$1) {
        var $853 = App$do$("watch", _room$1);
        return $853;
    };
    const App$watch = x0 => App$watch$(x0);

    function App$store$(_value$2) {
        var $854 = IO$monad$((_m$bind$3 => _m$pure$4 => {
            var $855 = _m$pure$4;
            return $855;
        }))(Dynamic$new$(_value$2));
        return $854;
    };
    const App$store = x0 => App$store$(x0);

    function List$take_while$go$(_f$2, _xs$3) {
        var self = _xs$3;
        switch (self._) {
            case 'List.cons':
                var $857 = self.head;
                var $858 = self.tail;
                var self = _f$2($857);
                if (self) {
                    var self = List$take_while$go$(_f$2, $858);
                    switch (self._) {
                        case 'Pair.new':
                            var $861 = self.fst;
                            var $862 = self.snd;
                            var $863 = Pair$new$(List$cons$($857, $861), $862);
                            var $860 = $863;
                            break;
                    };
                    var $859 = $860;
                } else {
                    var $864 = Pair$new$(List$nil, _xs$3);
                    var $859 = $864;
                };
                var $856 = $859;
                break;
            case 'List.nil':
                var $865 = Pair$new$(List$nil, List$nil);
                var $856 = $865;
                break;
        };
        return $856;
    };
    const List$take_while$go = x0 => x1 => List$take_while$go$(x0, x1);

    function List$foldr$(_b$3, _f$4, _xs$5) {
        var $866 = List$fold$(_xs$5, _b$3, _f$4);
        return $866;
    };
    const List$foldr = x0 => x1 => x2 => List$foldr$(x0, x1, x2);

    function Web$Kaelin$Timer$set_timer$(_timer$1, _state$2) {
        var self = _state$2;
        switch (self._) {
            case 'Web.Kaelin.State.game':
                var $868 = self.user;
                var $869 = self.room;
                var $870 = self.players;
                var $871 = self.cast_info;
                var $872 = self.map;
                var $873 = self.internal;
                var $874 = self.env_info;
                var _internal$10 = $873;
                var self = _internal$10;
                switch (self._) {
                    case 'Web.Kaelin.Internal.new':
                        var $876 = self.tick;
                        var $877 = self.frame;
                        var $878 = Web$Kaelin$State$game$($868, $869, $870, $871, $872, Web$Kaelin$Internal$new$($876, $877, _timer$1), $874);
                        var $875 = $878;
                        break;
                };
                var $867 = $875;
                break;
            case 'Web.Kaelin.State.init':
            case 'Web.Kaelin.State.void':
                var $879 = _state$2;
                var $867 = $879;
                break;
        };
        return $867;
    };
    const Web$Kaelin$Timer$set_timer = x0 => x1 => Web$Kaelin$Timer$set_timer$(x0, x1);

    function Function$comp$(_g$4, _f$5, _x$6) {
        var $880 = _g$4(_f$5(_x$6));
        return $880;
    };
    const Function$comp = x0 => x1 => x2 => Function$comp$(x0, x1, x2);

    function Web$Kaelin$Timer$wait$(_frame$1, _timer$2, _state$3) {
        var self = List$take_while$go$((_x$4 => {
            var self = _x$4;
            switch (self._) {
                case 'Web.Kaelin.Timer.new':
                    var $883 = self.time;
                    var $884 = ($883 < _frame$1);
                    var $882 = $884;
                    break;
            };
            return $882;
        }), _timer$2);
        switch (self._) {
            case 'Pair.new':
                var $885 = self.fst;
                var $886 = self.snd;
                var $887 = Web$Kaelin$Timer$set_timer$($886, List$foldr$((_x$6 => {
                    var $888 = _x$6;
                    return $888;
                }), (_x$6 => _f$7 => {
                    var self = _x$6;
                    switch (self._) {
                        case 'Web.Kaelin.Timer.new':
                            var $890 = self.action;
                            var $891 = Function$comp(_f$7)($890);
                            var $889 = $891;
                            break;
                    };
                    return $889;
                }), $885)(_state$3));
                var $881 = $887;
                break;
        };
        return $881;
    };
    const Web$Kaelin$Timer$wait = x0 => x1 => x2 => Web$Kaelin$Timer$wait$(x0, x1, x2);

    function Web$Kaelin$Action$update_interface$(_interface$1, _tick$2, _state$3) {
        var self = _state$3;
        switch (self._) {
            case 'Web.Kaelin.State.game':
                var $893 = self.user;
                var $894 = self.room;
                var $895 = self.players;
                var $896 = self.cast_info;
                var $897 = self.map;
                var $898 = self.internal;
                var _internal$11 = $898;
                var self = _internal$11;
                switch (self._) {
                    case 'Web.Kaelin.Internal.new':
                        var $900 = self.frame;
                        var $901 = self.timer;
                        var _new_state$15 = Web$Kaelin$State$game$($893, $894, $895, $896, $897, Web$Kaelin$Internal$new$(_tick$2, ($900 + 1n), $901), _interface$1);
                        var $902 = Web$Kaelin$Timer$wait$($900, $901, _new_state$15);
                        var $899 = $902;
                        break;
                };
                var $892 = $899;
                break;
            case 'Web.Kaelin.State.init':
            case 'Web.Kaelin.State.void':
                var $903 = _state$3;
                var $892 = $903;
                break;
        };
        return $892;
    };
    const Web$Kaelin$Action$update_interface = x0 => x1 => x2 => Web$Kaelin$Action$update_interface$(x0, x1, x2);
    const U64$to_nat = a0 => (a0);

    function List$map$(_f$3, _as$4) {
        var self = _as$4;
        switch (self._) {
            case 'List.cons':
                var $905 = self.head;
                var $906 = self.tail;
                var $907 = List$cons$(_f$3($905), List$map$(_f$3, $906));
                var $904 = $907;
                break;
            case 'List.nil':
                var $908 = List$nil;
                var $904 = $908;
                break;
        };
        return $904;
    };
    const List$map = x0 => x1 => List$map$(x0, x1);

    function Web$Kaelin$Coord$Convert$cubic_to_axial$(_coord$1) {
        var self = _coord$1;
        switch (self._) {
            case 'Web.Kaelin.Coord.Cubic.new':
                var $910 = self.x;
                var $911 = self.z;
                var _i$5 = $910;
                var _j$6 = $911;
                var $912 = Web$Kaelin$Coord$new$(_i$5, _j$6);
                var $909 = $912;
                break;
        };
        return $909;
    };
    const Web$Kaelin$Coord$Convert$cubic_to_axial = x0 => Web$Kaelin$Coord$Convert$cubic_to_axial$(x0);

    function Cmp$as_ltn$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
                var $914 = Bool$true;
                var $913 = $914;
                break;
            case 'Cmp.eql':
            case 'Cmp.gtn':
                var $915 = Bool$false;
                var $913 = $915;
                break;
        };
        return $913;
    };
    const Cmp$as_ltn = x0 => Cmp$as_ltn$(x0);

    function Word$s_ltn$(_a$2, _b$3) {
        var _neg_a$4 = Word$is_neg$(_a$2);
        var _neg_b$5 = Word$is_neg$(_b$3);
        var self = _neg_a$4;
        if (self) {
            var self = _neg_b$5;
            if (self) {
                var $918 = Cmp$as_ltn$(Cmp$inv$(Word$cmp$(_a$2, _b$3)));
                var $917 = $918;
            } else {
                var $919 = Bool$true;
                var $917 = $919;
            };
            var $916 = $917;
        } else {
            var self = _neg_b$5;
            if (self) {
                var $921 = Bool$false;
                var $920 = $921;
            } else {
                var $922 = Cmp$as_ltn$(Word$cmp$(_a$2, _b$3));
                var $920 = $922;
            };
            var $916 = $920;
        };
        return $916;
    };
    const Word$s_ltn = x0 => x1 => Word$s_ltn$(x0, x1);
    const I32$ltn = a0 => a1 => (a0 < a1);

    function I32$min$(_a$1, _b$2) {
        var self = (_a$1 < _b$2);
        if (self) {
            var $924 = _a$1;
            var $923 = $924;
        } else {
            var $925 = _b$2;
            var $923 = $925;
        };
        return $923;
    };
    const I32$min = x0 => x1 => I32$min$(x0, x1);

    function Web$Kaelin$Coord$Cubic$add$(_a$1, _b$2) {
        var self = _a$1;
        switch (self._) {
            case 'Web.Kaelin.Coord.Cubic.new':
                var $927 = self.x;
                var $928 = self.y;
                var $929 = self.z;
                var self = _b$2;
                switch (self._) {
                    case 'Web.Kaelin.Coord.Cubic.new':
                        var $931 = self.x;
                        var $932 = self.y;
                        var $933 = self.z;
                        var _x$9 = (($927 + $931) >> 0);
                        var _y$10 = (($928 + $932) >> 0);
                        var _z$11 = (($929 + $933) >> 0);
                        var $934 = Web$Kaelin$Coord$Cubic$new$(_x$9, _y$10, _z$11);
                        var $930 = $934;
                        break;
                };
                var $926 = $930;
                break;
        };
        return $926;
    };
    const Web$Kaelin$Coord$Cubic$add = x0 => x1 => Web$Kaelin$Coord$Cubic$add$(x0, x1);

    function Web$Kaelin$Coord$Cubic$range$(_coord$1, _distance$2) {
        var _distance_32$3 = (Number(_distance$2) >>> 0);
        var _distance_i32$4 = U32$to_i32$(_distance_32$3);
        var _double_distance$5 = ((((_distance_32$3 * 2) >>> 0) + 1) >>> 0);
        var _result$6 = List$nil;
        var _result$7 = (() => {
            var $936 = _result$6;
            var $937 = 0;
            var $938 = _double_distance$5;
            let _result$8 = $936;
            for (let _j$7 = $937; _j$7 < $938; ++_j$7) {
                var _negative_distance$9 = ((-_distance_i32$4));
                var _positive_distance$10 = _distance_i32$4;
                var _x$11 = ((U32$to_i32$(_j$7) - _positive_distance$10) >> 0);
                var _max$12 = I32$max$(_negative_distance$9, ((((-_x$11)) + _negative_distance$9) >> 0));
                var _min$13 = I32$min$(_positive_distance$10, ((((-_x$11)) + _positive_distance$10) >> 0));
                var _distance_between_max_min$14 = ((1 + I32$to_u32$(I32$abs$(((_max$12 - _min$13) >> 0)))) >>> 0);
                var _result$15 = (() => {
                    var $939 = _result$8;
                    var $940 = 0;
                    var $941 = _distance_between_max_min$14;
                    let _result$16 = $939;
                    for (let _i$15 = $940; _i$15 < $941; ++_i$15) {
                        var _y$17 = ((U32$to_i32$(_i$15) + _max$12) >> 0);
                        var _z$18 = ((((-_x$11)) - _y$17) >> 0);
                        var _new_coord$19 = Web$Kaelin$Coord$Cubic$add$(_coord$1, Web$Kaelin$Coord$Cubic$new$(_x$11, _y$17, _z$18));
                        var $939 = List$cons$(_new_coord$19, _result$16);
                        _result$16 = $939;
                    };
                    return _result$16;
                })();
                var $936 = _result$15;
                _result$8 = $936;
            };
            return _result$8;
        })();
        var $935 = _result$7;
        return $935;
    };
    const Web$Kaelin$Coord$Cubic$range = x0 => x1 => Web$Kaelin$Coord$Cubic$range$(x0, x1);

    function Web$Kaelin$Coord$Axial$range$(_a$1, _distance$2) {
        var _ab$3 = Web$Kaelin$Coord$Convert$axial_to_cubic$(_a$1);
        var _d$4 = _distance$2;
        var $942 = List$map$(Web$Kaelin$Coord$Convert$cubic_to_axial, Web$Kaelin$Coord$Cubic$range$(_ab$3, _d$4));
        return $942;
    };
    const Web$Kaelin$Coord$Axial$range = x0 => x1 => Web$Kaelin$Coord$Axial$range$(x0, x1);

    function List$filter$(_f$2, _xs$3) {
        var self = _xs$3;
        switch (self._) {
            case 'List.cons':
                var $944 = self.head;
                var $945 = self.tail;
                var self = _f$2($944);
                if (self) {
                    var $947 = List$cons$($944, List$filter$(_f$2, $945));
                    var $946 = $947;
                } else {
                    var $948 = List$filter$(_f$2, $945);
                    var $946 = $948;
                };
                var $943 = $946;
                break;
            case 'List.nil':
                var $949 = List$nil;
                var $943 = $949;
                break;
        };
        return $943;
    };
    const List$filter = x0 => x1 => List$filter$(x0, x1);

    function Web$Kaelin$Coord$range$(_coord$1, _distance$2) {
        var _list_coords$3 = Web$Kaelin$Coord$Axial$range$(_coord$1, _distance$2);
        var _fit$4 = (_x$4 => {
            var $951 = Web$Kaelin$Coord$fit$(_x$4, Web$Kaelin$Constants$map_size);
            return $951;
        });
        var $950 = List$filter$(_fit$4, _list_coords$3);
        return $950;
    };
    const Web$Kaelin$Coord$range = x0 => x1 => Web$Kaelin$Coord$range$(x0, x1);

    function Web$Kaelin$Skill$area$to_list$(_area$1, _origin$2, _target$3) {
        var self = _area$1;
        switch (self._) {
            case 'Web.Kaelin.Skill.area.radial':
                var $953 = self.range;
                var $954 = Web$Kaelin$Coord$range$(_target$3, $953);
                var $952 = $954;
                break;
            case 'Web.Kaelin.Skill.area.self':
            case 'Web.Kaelin.Skill.area.line':
                var $955 = List$cons$(_origin$2, List$nil);
                var $952 = $955;
                break;
            case 'Web.Kaelin.Skill.area.single':
                var $956 = List$cons$(_target$3, List$nil);
                var $952 = $956;
                break;
        };
        return $952;
    };
    const Web$Kaelin$Skill$area$to_list = x0 => x1 => x2 => Web$Kaelin$Skill$area$to_list$(x0, x1, x2);

    function List$concat$(_as$2, _bs$3) {
        var self = _as$2;
        switch (self._) {
            case 'List.cons':
                var $958 = self.head;
                var $959 = self.tail;
                var $960 = List$cons$($958, List$concat$($959, _bs$3));
                var $957 = $960;
                break;
            case 'List.nil':
                var $961 = _bs$3;
                var $957 = $961;
                break;
        };
        return $957;
    };
    const List$concat = x0 => x1 => List$concat$(x0, x1);

    function NatMap$from_list$(_xs$2) {
        var self = _xs$2;
        switch (self._) {
            case 'List.cons':
                var $963 = self.head;
                var $964 = self.tail;
                var self = $963;
                switch (self._) {
                    case 'Pair.new':
                        var $966 = self.fst;
                        var $967 = self.snd;
                        var $968 = (bitsmap_set((nat_to_bits($966)), $967, NatMap$from_list$($964), 'set'));
                        var $965 = $968;
                        break;
                };
                var $962 = $965;
                break;
            case 'List.nil':
                var $969 = BitsMap$new;
                var $962 = $969;
                break;
        };
        return $962;
    };
    const NatMap$from_list = x0 => NatMap$from_list$(x0);

    function Web$Kaelin$Skill$indicator$(_hero_pos$1, _skill$2, _mouse_coord$3) {
        var self = _skill$2;
        switch (self._) {
            case 'Web.Kaelin.Skill.new':
                var $971 = self.effects;
                var _coords$8 = List$nil;
                var _pair$9 = List$nil;
                var _coords$10 = (() => {
                    var $974 = _coords$8;
                    var $975 = $971;
                    let _coords$11 = $974;
                    let _effect$10;
                    while ($975._ === 'List.cons') {
                        _effect$10 = $975.head;
                        var self = _effect$10;
                        switch (self._) {
                            case 'Web.Kaelin.Skill.Effect.hp':
                                var $976 = self.area;
                                var $977 = self.indicator;
                                var _area$16 = Web$Kaelin$Skill$area$to_list$($976, _hero_pos$1, _mouse_coord$3);
                                var self = $977;
                                switch (self._) {
                                    case 'Maybe.some':
                                        var $979 = self.value;
                                        var _pair$18 = (() => {
                                            var $982 = _pair$9;
                                            var $983 = _area$16;
                                            let _pair$19 = $982;
                                            let _coord$18;
                                            while ($983._ === 'List.cons') {
                                                _coord$18 = $983.head;
                                                var _key$20 = Web$Kaelin$Coord$Convert$axial_to_nat$(_coord$18);
                                                var $982 = List$concat$(_pair$19, List$cons$(Pair$new$(_key$20, $979), List$nil));
                                                _pair$19 = $982;
                                                $983 = $983.tail;
                                            }
                                            return _pair$19;
                                        })();
                                        var $980 = List$concat$(_coords$11, _pair$18);
                                        var $978 = $980;
                                        break;
                                    case 'Maybe.none':
                                        var $984 = _coords$11;
                                        var $978 = $984;
                                        break;
                                };
                                var $974 = $978;
                                break;
                            case 'Web.Kaelin.Skill.Effect.position':
                                var $985 = self.area;
                                var $986 = self.indicator;
                                var _area$16 = Web$Kaelin$Skill$area$to_list$($985, _hero_pos$1, _mouse_coord$3);
                                var self = $986;
                                switch (self._) {
                                    case 'Maybe.some':
                                        var $988 = self.value;
                                        var _pair$18 = (() => {
                                            var $991 = _pair$9;
                                            var $992 = _area$16;
                                            let _pair$19 = $991;
                                            let _coord$18;
                                            while ($992._ === 'List.cons') {
                                                _coord$18 = $992.head;
                                                var _key$20 = Web$Kaelin$Coord$Convert$axial_to_nat$(_coord$18);
                                                var $991 = List$concat$(_pair$19, List$cons$(Pair$new$(_key$20, $988), List$nil));
                                                _pair$19 = $991;
                                                $992 = $992.tail;
                                            }
                                            return _pair$19;
                                        })();
                                        var $989 = List$concat$(_coords$11, _pair$18);
                                        var $987 = $989;
                                        break;
                                    case 'Maybe.none':
                                        var $993 = _coords$11;
                                        var $987 = $993;
                                        break;
                                };
                                var $974 = $987;
                                break;
                            case 'Web.Kaelin.Skill.Effect.status':
                                var $994 = self.area;
                                var $995 = self.indicator;
                                var _area$16 = Web$Kaelin$Skill$area$to_list$($994, _hero_pos$1, _mouse_coord$3);
                                var self = $995;
                                switch (self._) {
                                    case 'Maybe.some':
                                        var $997 = self.value;
                                        var _pair$18 = (() => {
                                            var $1000 = _pair$9;
                                            var $1001 = _area$16;
                                            let _pair$19 = $1000;
                                            let _coord$18;
                                            while ($1001._ === 'List.cons') {
                                                _coord$18 = $1001.head;
                                                var _key$20 = Web$Kaelin$Coord$Convert$axial_to_nat$(_coord$18);
                                                var $1000 = List$concat$(_pair$19, List$cons$(Pair$new$(_key$20, $997), List$nil));
                                                _pair$19 = $1000;
                                                $1001 = $1001.tail;
                                            }
                                            return _pair$19;
                                        })();
                                        var $998 = List$concat$(_coords$11, _pair$18);
                                        var $996 = $998;
                                        break;
                                    case 'Maybe.none':
                                        var $1002 = _coords$11;
                                        var $996 = $1002;
                                        break;
                                };
                                var $974 = $996;
                                break;
                        };
                        _coords$11 = $974;
                        $975 = $975.tail;
                    }
                    return _coords$11;
                })();
                var $972 = NatMap$from_list$(_coords$10);
                var $970 = $972;
                break;
        };
        return $970;
    };
    const Web$Kaelin$Skill$indicator = x0 => x1 => x2 => Web$Kaelin$Skill$indicator$(x0, x1, x2);

    function Web$Kaelin$CastInfo$new$(_hero_pos$1, _hex_effect$2, _skill$3, _range$4, _area$5, _mouse_pos$6) {
        var $1003 = ({
            _: 'Web.Kaelin.CastInfo.new',
            'hero_pos': _hero_pos$1,
            'hex_effect': _hex_effect$2,
            'skill': _skill$3,
            'range': _range$4,
            'area': _area$5,
            'mouse_pos': _mouse_pos$6
        });
        return $1003;
    };
    const Web$Kaelin$CastInfo$new = x0 => x1 => x2 => x3 => x4 => x5 => Web$Kaelin$CastInfo$new$(x0, x1, x2, x3, x4, x5);

    function Web$Kaelin$Action$update_area$(_state$1) {
        var self = _state$1;
        switch (self._) {
            case 'Web.Kaelin.State.game':
                var $1005 = self.user;
                var $1006 = self.room;
                var $1007 = self.players;
                var $1008 = self.cast_info;
                var $1009 = self.map;
                var $1010 = self.internal;
                var $1011 = self.env_info;
                var self = $1011;
                switch (self._) {
                    case 'App.EnvInfo.new':
                        var $1013 = self.mouse_pos;
                        var self = $1008;
                        switch (self._) {
                            case 'Maybe.some':
                                var $1015 = self.value;
                                var self = $1015;
                                switch (self._) {
                                    case 'Web.Kaelin.CastInfo.new':
                                        var $1017 = self.hero_pos;
                                        var $1018 = self.hex_effect;
                                        var $1019 = self.skill;
                                        var $1020 = self.range;
                                        var $1021 = self.mouse_pos;
                                        var _mouse_coord$18 = Web$Kaelin$Coord$to_axial$($1013);
                                        var self = Web$Kaelin$Coord$eql$(_mouse_coord$18, $1021);
                                        if (self) {
                                            var $1023 = _state$1;
                                            var $1022 = $1023;
                                        } else {
                                            var _area$19 = Web$Kaelin$Skill$indicator$($1017, $1019, _mouse_coord$18);
                                            var _new_cast_info$20 = Maybe$some$(Web$Kaelin$CastInfo$new$($1017, $1018, $1019, $1020, _area$19, _mouse_coord$18));
                                            var _new_state$21 = Web$Kaelin$State$game$($1005, $1006, $1007, _new_cast_info$20, $1009, $1010, $1011);
                                            var $1024 = _new_state$21;
                                            var $1022 = $1024;
                                        };
                                        var $1016 = $1022;
                                        break;
                                };
                                var $1014 = $1016;
                                break;
                            case 'Maybe.none':
                                var $1025 = _state$1;
                                var $1014 = $1025;
                                break;
                        };
                        var $1012 = $1014;
                        break;
                };
                var $1004 = $1012;
                break;
            case 'Web.Kaelin.State.init':
            case 'Web.Kaelin.State.void':
                var $1026 = _state$1;
                var $1004 = $1026;
                break;
        };
        return $1004;
    };
    const Web$Kaelin$Action$update_area = x0 => Web$Kaelin$Action$update_area$(x0);
    const U8$to_nat = a0 => (BigInt(a0));

    function List$zip$(_as$3, _bs$4) {
        var self = _as$3;
        switch (self._) {
            case 'List.cons':
                var $1028 = self.head;
                var $1029 = self.tail;
                var self = _bs$4;
                switch (self._) {
                    case 'List.cons':
                        var $1031 = self.head;
                        var $1032 = self.tail;
                        var $1033 = List$cons$(Pair$new$($1028, $1031), List$zip$($1029, $1032));
                        var $1030 = $1033;
                        break;
                    case 'List.nil':
                        var $1034 = List$nil;
                        var $1030 = $1034;
                        break;
                };
                var $1027 = $1030;
                break;
            case 'List.nil':
                var $1035 = List$nil;
                var $1027 = $1035;
                break;
        };
        return $1027;
    };
    const List$zip = x0 => x1 => List$zip$(x0, x1);
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
                    var $1036 = _n$2;
                    return $1036;
                } else {
                    var $1037 = self.charCodeAt(0);
                    var $1038 = self.slice(1);
                    var $1039 = String$length$go$($1038, Nat$succ$(_n$2));
                    return $1039;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const String$length$go = x0 => x1 => String$length$go$(x0, x1);

    function String$length$(_xs$1) {
        var $1040 = String$length$go$(_xs$1, 0n);
        return $1040;
    };
    const String$length = x0 => String$length$(x0);

    function String$repeat$(_xs$1, _n$2) {
        var self = _n$2;
        if (self === 0n) {
            var $1042 = String$nil;
            var $1041 = $1042;
        } else {
            var $1043 = (self - 1n);
            var $1044 = (_xs$1 + String$repeat$(_xs$1, $1043));
            var $1041 = $1044;
        };
        return $1041;
    };
    const String$repeat = x0 => x1 => String$repeat$(x0, x1);

    function Hex$set_min_length$(_min$1, _hex$2) {
        var _dif$3 = (_min$1 - String$length$(_hex$2) <= 0n ? 0n : _min$1 - String$length$(_hex$2));
        var $1045 = (_hex$2 + String$repeat$("0", _dif$3));
        return $1045;
    };
    const Hex$set_min_length = x0 => x1 => Hex$set_min_length$(x0, x1);

    function Hex$format_hex$(_min$1, _hex$2) {
        var _dif$3 = (_min$1 - String$length$(_hex$2) <= 0n ? 0n : _min$1 - String$length$(_hex$2));
        var self = (String$length$(_hex$2) < _min$1);
        if (self) {
            var $1047 = (String$repeat$("0", _dif$3) + _hex$2);
            var $1046 = $1047;
        } else {
            var $1048 = _hex$2;
            var $1046 = $1048;
        };
        return $1046;
    };
    const Hex$format_hex = x0 => x1 => Hex$format_hex$(x0, x1);

    function Bits$cmp$go$(_a$1, _b$2, _c$3) {
        var Bits$cmp$go$ = (_a$1, _b$2, _c$3) => ({
            ctr: 'TCO',
            arg: [_a$1, _b$2, _c$3]
        });
        var Bits$cmp$go = _a$1 => _b$2 => _c$3 => Bits$cmp$go$(_a$1, _b$2, _c$3);
        var arg = [_a$1, _b$2, _c$3];
        while (true) {
            let [_a$1, _b$2, _c$3] = arg;
            var R = (() => {
                var self = _a$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'o':
                        var $1049 = self.slice(0, -1);
                        var self = _b$2;
                        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                            case 'o':
                                var $1051 = self.slice(0, -1);
                                var $1052 = Bits$cmp$go$($1049, $1051, _c$3);
                                var $1050 = $1052;
                                break;
                            case 'i':
                                var $1053 = self.slice(0, -1);
                                var $1054 = Bits$cmp$go$($1049, $1053, Cmp$ltn);
                                var $1050 = $1054;
                                break;
                            case 'e':
                                var $1055 = Bits$cmp$go$($1049, Bits$e, _c$3);
                                var $1050 = $1055;
                                break;
                        };
                        return $1050;
                    case 'i':
                        var $1056 = self.slice(0, -1);
                        var self = _b$2;
                        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                            case 'o':
                                var $1058 = self.slice(0, -1);
                                var $1059 = Bits$cmp$go$($1056, $1058, Cmp$gtn);
                                var $1057 = $1059;
                                break;
                            case 'i':
                                var $1060 = self.slice(0, -1);
                                var $1061 = Bits$cmp$go$($1056, $1060, _c$3);
                                var $1057 = $1061;
                                break;
                            case 'e':
                                var $1062 = Cmp$gtn;
                                var $1057 = $1062;
                                break;
                        };
                        return $1057;
                    case 'e':
                        var self = _b$2;
                        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                            case 'o':
                                var $1064 = self.slice(0, -1);
                                var $1065 = Bits$cmp$go$(Bits$e, $1064, _c$3);
                                var $1063 = $1065;
                                break;
                            case 'e':
                                var $1066 = _c$3;
                                var $1063 = $1066;
                                break;
                            case 'i':
                                var $1067 = Cmp$ltn;
                                var $1063 = $1067;
                                break;
                        };
                        return $1063;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Bits$cmp$go = x0 => x1 => x2 => Bits$cmp$go$(x0, x1, x2);

    function Bits$cmp$(_a$1, _b$2) {
        var $1068 = Bits$cmp$go$(_a$1, _b$2, Cmp$eql);
        return $1068;
    };
    const Bits$cmp = x0 => x1 => Bits$cmp$(x0, x1);

    function Bits$gtn$(_a$1, _b$2) {
        var $1069 = Cmp$as_gtn$(Bits$cmp$(_a$1, _b$2));
        return $1069;
    };
    const Bits$gtn = x0 => x1 => Bits$gtn$(x0, x1);

    function U32$to_bits$(_a$1) {
        var self = _a$1;
        switch ('u32') {
            case 'u32':
                var $1071 = u32_to_word(self);
                var $1072 = Word$to_bits$($1071);
                var $1070 = $1072;
                break;
        };
        return $1070;
    };
    const U32$to_bits = x0 => U32$to_bits$(x0);

    function Bits$size$go$(_bits$1, _n$2, _s$3) {
        var Bits$size$go$ = (_bits$1, _n$2, _s$3) => ({
            ctr: 'TCO',
            arg: [_bits$1, _n$2, _s$3]
        });
        var Bits$size$go = _bits$1 => _n$2 => _s$3 => Bits$size$go$(_bits$1, _n$2, _s$3);
        var arg = [_bits$1, _n$2, _s$3];
        while (true) {
            let [_bits$1, _n$2, _s$3] = arg;
            var R = (() => {
                var self = _bits$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'o':
                        var $1073 = self.slice(0, -1);
                        var $1074 = Bits$size$go$($1073, Nat$succ$(_n$2), _s$3);
                        return $1074;
                    case 'i':
                        var $1075 = self.slice(0, -1);
                        var $1076 = Bits$size$go$($1075, Nat$succ$(_n$2), Nat$succ$(_n$2));
                        return $1076;
                    case 'e':
                        var $1077 = _s$3;
                        return $1077;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Bits$size$go = x0 => x1 => x2 => Bits$size$go$(x0, x1, x2);

    function Bits$size$(_bits$1) {
        var $1078 = Bits$size$go$(_bits$1, 0n, 0n);
        return $1078;
    };
    const Bits$size = x0 => Bits$size$(x0);

    function Bits$shift_left$(_n$1, _value$2) {
        var self = _n$1;
        if (self === 0n) {
            var $1080 = _value$2;
            var $1079 = $1080;
        } else {
            var $1081 = (self - 1n);
            var $1082 = (Bits$shift_left$($1081, _value$2) + '0');
            var $1079 = $1082;
        };
        return $1079;
    };
    const Bits$shift_left = x0 => x1 => Bits$shift_left$(x0, x1);

    function Bits$gte$(_a$1, _b$2) {
        var $1083 = Cmp$as_gte$(Bits$cmp$(_a$1, _b$2));
        return $1083;
    };
    const Bits$gte = x0 => x1 => Bits$gte$(x0, x1);

    function Bits$tail$(_a$1) {
        var self = _a$1;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'o':
                var $1085 = self.slice(0, -1);
                var $1086 = $1085;
                var $1084 = $1086;
                break;
            case 'i':
                var $1087 = self.slice(0, -1);
                var $1088 = $1087;
                var $1084 = $1088;
                break;
            case 'e':
                var $1089 = Bits$e;
                var $1084 = $1089;
                break;
        };
        return $1084;
    };
    const Bits$tail = x0 => Bits$tail$(x0);

    function Bits$shift_right$(_n$1, _value$2) {
        var Bits$shift_right$ = (_n$1, _value$2) => ({
            ctr: 'TCO',
            arg: [_n$1, _value$2]
        });
        var Bits$shift_right = _n$1 => _value$2 => Bits$shift_right$(_n$1, _value$2);
        var arg = [_n$1, _value$2];
        while (true) {
            let [_n$1, _value$2] = arg;
            var R = (() => {
                var self = _n$1;
                if (self === 0n) {
                    var $1090 = _value$2;
                    return $1090;
                } else {
                    var $1091 = (self - 1n);
                    var $1092 = Bits$shift_right$($1091, Bits$tail$(_value$2));
                    return $1092;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Bits$shift_right = x0 => x1 => Bits$shift_right$(x0, x1);

    function Bits$sub$go$(_a$1, _b$2, _bits$3) {
        var Bits$sub$go$ = (_a$1, _b$2, _bits$3) => ({
            ctr: 'TCO',
            arg: [_a$1, _b$2, _bits$3]
        });
        var Bits$sub$go = _a$1 => _b$2 => _bits$3 => Bits$sub$go$(_a$1, _b$2, _bits$3);
        var arg = [_a$1, _b$2, _bits$3];
        while (true) {
            let [_a$1, _b$2, _bits$3] = arg;
            var R = (() => {
                var self = _b$2;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'o':
                        var $1093 = self.slice(0, -1);
                        var self = _a$1;
                        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                            case 'o':
                                var $1095 = self.slice(0, -1);
                                var $1096 = Bits$sub$go$($1095, $1093, (_bits$3 + '0'));
                                var $1094 = $1096;
                                break;
                            case 'i':
                                var $1097 = self.slice(0, -1);
                                var $1098 = Bits$sub$go$($1097, $1093, (_bits$3 + '1'));
                                var $1094 = $1098;
                                break;
                            case 'e':
                                var $1099 = Bits$sub$go$(_a$1, $1093, (_bits$3 + '0'));
                                var $1094 = $1099;
                                break;
                        };
                        return $1094;
                    case 'i':
                        var $1100 = self.slice(0, -1);
                        var self = _a$1;
                        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                            case 'o':
                                var $1102 = self.slice(0, -1);
                                var $1103 = Bits$sub$go$($1102, Bits$inc$($1100), (_bits$3 + '1'));
                                var $1101 = $1103;
                                break;
                            case 'i':
                                var $1104 = self.slice(0, -1);
                                var $1105 = Bits$sub$go$($1104, $1100, (_bits$3 + '0'));
                                var $1101 = $1105;
                                break;
                            case 'e':
                                var $1106 = Bits$e;
                                var $1101 = $1106;
                                break;
                        };
                        return $1101;
                    case 'e':
                        var self = _a$1;
                        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                            case 'o':
                                var $1108 = self.slice(0, -1);
                                var $1109 = Bits$sub$go$($1108, _b$2, (_bits$3 + '0'));
                                var $1107 = $1109;
                                break;
                            case 'i':
                                var $1110 = self.slice(0, -1);
                                var $1111 = Bits$sub$go$($1110, _b$2, (_bits$3 + '1'));
                                var $1107 = $1111;
                                break;
                            case 'e':
                                var $1112 = _bits$3;
                                var $1107 = $1112;
                                break;
                        };
                        return $1107;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Bits$sub$go = x0 => x1 => x2 => Bits$sub$go$(x0, x1, x2);

    function Bits$sub$(_a$1, _b$2) {
        var $1113 = Bits$reverse$(Bits$sub$go$(_a$1, _b$2, Bits$e));
        return $1113;
    };
    const Bits$sub = x0 => x1 => Bits$sub$(x0, x1);

    function Bits$div$go$(_shift$1, _sub_copy$2, _shift_copy$3, _value$4) {
        var Bits$div$go$ = (_shift$1, _sub_copy$2, _shift_copy$3, _value$4) => ({
            ctr: 'TCO',
            arg: [_shift$1, _sub_copy$2, _shift_copy$3, _value$4]
        });
        var Bits$div$go = _shift$1 => _sub_copy$2 => _shift_copy$3 => _value$4 => Bits$div$go$(_shift$1, _sub_copy$2, _shift_copy$3, _value$4);
        var arg = [_shift$1, _sub_copy$2, _shift_copy$3, _value$4];
        while (true) {
            let [_shift$1, _sub_copy$2, _shift_copy$3, _value$4] = arg;
            var R = (() => {
                var self = Bits$gte$(_sub_copy$2, _shift_copy$3);
                if (self) {
                    var $1114 = Pair$new$(Bool$true, (_value$4 + '1'));
                    var self = $1114;
                } else {
                    var $1115 = Pair$new$(Bool$false, (_value$4 + '0'));
                    var self = $1115;
                };
                switch (self._) {
                    case 'Pair.new':
                        var $1116 = self.fst;
                        var $1117 = self.snd;
                        var self = _shift$1;
                        if (self === 0n) {
                            var $1119 = $1117;
                            var $1118 = $1119;
                        } else {
                            var $1120 = (self - 1n);
                            var _new_shift_copy$8 = Bits$shift_right$(1n, _shift_copy$3);
                            var self = $1116;
                            if (self) {
                                var $1122 = Bits$sub$(_sub_copy$2, _shift_copy$3);
                                var _new_sub_copy$9 = $1122;
                            } else {
                                var $1123 = _sub_copy$2;
                                var _new_sub_copy$9 = $1123;
                            };
                            var $1121 = Bits$div$go$($1120, _new_sub_copy$9, _new_shift_copy$8, $1117);
                            var $1118 = $1121;
                        };
                        return $1118;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Bits$div$go = x0 => x1 => x2 => x3 => Bits$div$go$(x0, x1, x2, x3);

    function Bits$div$(_a$1, _b$2) {
        var _a_size$3 = Bits$size$(_a$1);
        var _b_size$4 = Bits$size$(_b$2);
        var self = (_a_size$3 < _b_size$4);
        if (self) {
            var $1125 = (Bits$e + '0');
            var $1124 = $1125;
        } else {
            var _shift$5 = (_a_size$3 - _b_size$4 <= 0n ? 0n : _a_size$3 - _b_size$4);
            var _shift_copy$6 = Bits$shift_left$(_shift$5, _b$2);
            var $1126 = Bits$div$go$(_shift$5, _a$1, _shift_copy$6, Bits$e);
            var $1124 = $1126;
        };
        return $1124;
    };
    const Bits$div = x0 => x1 => Bits$div$(x0, x1);

    function Bits$add$(_a$1, _b$2) {
        var self = _b$2;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'o':
                var $1128 = self.slice(0, -1);
                var self = _a$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'o':
                        var $1130 = self.slice(0, -1);
                        var $1131 = (Bits$add$($1130, $1128) + '0');
                        var $1129 = $1131;
                        break;
                    case 'i':
                        var $1132 = self.slice(0, -1);
                        var $1133 = (Bits$add$($1132, $1128) + '1');
                        var $1129 = $1133;
                        break;
                    case 'e':
                        var $1134 = _b$2;
                        var $1129 = $1134;
                        break;
                };
                var $1127 = $1129;
                break;
            case 'i':
                var $1135 = self.slice(0, -1);
                var self = _a$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'o':
                        var $1137 = self.slice(0, -1);
                        var $1138 = (Bits$add$($1137, $1135) + '1');
                        var $1136 = $1138;
                        break;
                    case 'i':
                        var $1139 = self.slice(0, -1);
                        var $1140 = (Bits$add$(Bits$inc$($1139), $1135) + '0');
                        var $1136 = $1140;
                        break;
                    case 'e':
                        var $1141 = _b$2;
                        var $1136 = $1141;
                        break;
                };
                var $1127 = $1136;
                break;
            case 'e':
                var $1142 = _a$1;
                var $1127 = $1142;
                break;
        };
        return $1127;
    };
    const Bits$add = x0 => x1 => Bits$add$(x0, x1);

    function Bits$mul$go$(_a$1, _b$2, _bits$3) {
        var Bits$mul$go$ = (_a$1, _b$2, _bits$3) => ({
            ctr: 'TCO',
            arg: [_a$1, _b$2, _bits$3]
        });
        var Bits$mul$go = _a$1 => _b$2 => _bits$3 => Bits$mul$go$(_a$1, _b$2, _bits$3);
        var arg = [_a$1, _b$2, _bits$3];
        while (true) {
            let [_a$1, _b$2, _bits$3] = arg;
            var R = (() => {
                var self = _b$2;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'o':
                        var $1143 = self.slice(0, -1);
                        var $1144 = Bits$mul$go$((_a$1 + '0'), $1143, _bits$3);
                        return $1144;
                    case 'i':
                        var $1145 = self.slice(0, -1);
                        var $1146 = Bits$mul$go$((_a$1 + '0'), $1145, Bits$add$(_a$1, _bits$3));
                        return $1146;
                    case 'e':
                        var $1147 = _bits$3;
                        return $1147;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Bits$mul$go = x0 => x1 => x2 => Bits$mul$go$(x0, x1, x2);

    function Bits$mul$(_a$1, _b$2) {
        var $1148 = Bits$mul$go$(_a$1, _b$2, Bits$e);
        return $1148;
    };
    const Bits$mul = x0 => x1 => Bits$mul$(x0, x1);

    function Bits$mod$(_a$1, _b$2) {
        var _q$3 = Bits$div$(_a$1, _b$2);
        var $1149 = Bits$sub$(_a$1, Bits$mul$(_b$2, _q$3));
        return $1149;
    };
    const Bits$mod = x0 => x1 => Bits$mod$(x0, x1);

    function Nat$square$(_a$1) {
        var $1150 = (_a$1 * _a$1);
        return $1150;
    };
    const Nat$square = x0 => Nat$square$(x0);

    function Bits$break$(_shift$1, _a$2) {
        var self = Bits$gtn$(_a$2, U32$to_bits$(0));
        if (self) {
            var $1152 = List$cons$(Bits$mod$(_a$2, (nat_to_bits(Nat$square$(_shift$1)))), Bits$break$(_shift$1, Bits$shift_right$(_shift$1, _a$2)));
            var $1151 = $1152;
        } else {
            var $1153 = List$nil;
            var $1151 = $1153;
        };
        return $1151;
    };
    const Bits$break = x0 => x1 => Bits$break$(x0, x1);

    function Function$flip$(_f$4, _y$5, _x$6) {
        var $1154 = _f$4(_x$6)(_y$5);
        return $1154;
    };
    const Function$flip = x0 => x1 => x2 => Function$flip$(x0, x1, x2);
    const Nat$eql = a0 => a1 => (a0 === a1);

    function Hex$to_hex_string$(_x$1) {
        var self = (Bits$to_nat$(_x$1) === 0n);
        if (self) {
            var $1156 = "0";
            var $1155 = $1156;
        } else {
            var self = (Bits$to_nat$(_x$1) === 1n);
            if (self) {
                var $1158 = "1";
                var $1157 = $1158;
            } else {
                var self = (Bits$to_nat$(_x$1) === 2n);
                if (self) {
                    var $1160 = "2";
                    var $1159 = $1160;
                } else {
                    var self = (Bits$to_nat$(_x$1) === 3n);
                    if (self) {
                        var $1162 = "3";
                        var $1161 = $1162;
                    } else {
                        var self = (Bits$to_nat$(_x$1) === 4n);
                        if (self) {
                            var $1164 = "4";
                            var $1163 = $1164;
                        } else {
                            var self = (Bits$to_nat$(_x$1) === 5n);
                            if (self) {
                                var $1166 = "5";
                                var $1165 = $1166;
                            } else {
                                var self = (Bits$to_nat$(_x$1) === 6n);
                                if (self) {
                                    var $1168 = "6";
                                    var $1167 = $1168;
                                } else {
                                    var self = (Bits$to_nat$(_x$1) === 7n);
                                    if (self) {
                                        var $1170 = "7";
                                        var $1169 = $1170;
                                    } else {
                                        var self = (Bits$to_nat$(_x$1) === 8n);
                                        if (self) {
                                            var $1172 = "8";
                                            var $1171 = $1172;
                                        } else {
                                            var self = (Bits$to_nat$(_x$1) === 9n);
                                            if (self) {
                                                var $1174 = "9";
                                                var $1173 = $1174;
                                            } else {
                                                var self = (Bits$to_nat$(_x$1) === 10n);
                                                if (self) {
                                                    var $1176 = "A";
                                                    var $1175 = $1176;
                                                } else {
                                                    var self = (Bits$to_nat$(_x$1) === 11n);
                                                    if (self) {
                                                        var $1178 = "B";
                                                        var $1177 = $1178;
                                                    } else {
                                                        var self = (Bits$to_nat$(_x$1) === 12n);
                                                        if (self) {
                                                            var $1180 = "C";
                                                            var $1179 = $1180;
                                                        } else {
                                                            var self = (Bits$to_nat$(_x$1) === 13n);
                                                            if (self) {
                                                                var $1182 = "D";
                                                                var $1181 = $1182;
                                                            } else {
                                                                var self = (Bits$to_nat$(_x$1) === 14n);
                                                                if (self) {
                                                                    var $1184 = "E";
                                                                    var $1183 = $1184;
                                                                } else {
                                                                    var self = (Bits$to_nat$(_x$1) === 15n);
                                                                    if (self) {
                                                                        var $1186 = "F";
                                                                        var $1185 = $1186;
                                                                    } else {
                                                                        var $1187 = "?";
                                                                        var $1185 = $1187;
                                                                    };
                                                                    var $1183 = $1185;
                                                                };
                                                                var $1181 = $1183;
                                                            };
                                                            var $1179 = $1181;
                                                        };
                                                        var $1177 = $1179;
                                                    };
                                                    var $1175 = $1177;
                                                };
                                                var $1173 = $1175;
                                            };
                                            var $1171 = $1173;
                                        };
                                        var $1169 = $1171;
                                    };
                                    var $1167 = $1169;
                                };
                                var $1165 = $1167;
                            };
                            var $1163 = $1165;
                        };
                        var $1161 = $1163;
                    };
                    var $1159 = $1161;
                };
                var $1157 = $1159;
            };
            var $1155 = $1157;
        };
        return $1155;
    };
    const Hex$to_hex_string = x0 => Hex$to_hex_string$(x0);

    function Bits$to_hex_string$(_x$1) {
        var _ls$2 = Bits$break$(4n, _x$1);
        var $1188 = List$foldr$("", (_x$3 => {
            var $1189 = Function$flip(String$concat)(Hex$to_hex_string$(_x$3));
            return $1189;
        }), _ls$2);
        return $1188;
    };
    const Bits$to_hex_string = x0 => Bits$to_hex_string$(x0);

    function Hex$append$(_hex$1, _size$2, _x$3) {
        var _hex2$4 = Hex$format_hex$(_size$2, Bits$to_hex_string$(_x$3));
        var $1190 = (_hex$1 + _hex2$4);
        return $1190;
    };
    const Hex$append = x0 => x1 => x2 => Hex$append$(x0, x1, x2);

    function Pair$fst$(_pair$3) {
        var self = _pair$3;
        switch (self._) {
            case 'Pair.new':
                var $1192 = self.fst;
                var $1193 = $1192;
                var $1191 = $1193;
                break;
        };
        return $1191;
    };
    const Pair$fst = x0 => Pair$fst$(x0);

    function Pair$snd$(_pair$3) {
        var self = _pair$3;
        switch (self._) {
            case 'Pair.new':
                var $1195 = self.snd;
                var $1196 = $1195;
                var $1194 = $1196;
                break;
        };
        return $1194;
    };
    const Pair$snd = x0 => Pair$snd$(x0);

    function Web$Kaelin$Event$Code$generate_hex$(_xs$1) {
        var $1197 = List$foldr$("", (_x$2 => _y$3 => {
            var $1198 = Hex$append$(_y$3, (BigInt(Pair$fst$(_x$2))), Pair$snd$(_x$2));
            return $1198;
        }), List$reverse$(_xs$1));
        return $1197;
    };
    const Web$Kaelin$Event$Code$generate_hex = x0 => Web$Kaelin$Event$Code$generate_hex$(x0);

    function generate_hex$(_xs$1, _ys$2) {
        var _consumer$3 = List$zip$(List$concat$(Web$Kaelin$Event$Code$action, _xs$1), _ys$2);
        var $1199 = ("0x" + Hex$set_min_length$(64n, Web$Kaelin$Event$Code$generate_hex$(_consumer$3)));
        return $1199;
    };
    const generate_hex = x0 => x1 => generate_hex$(x0, x1);
    const Web$Kaelin$Event$Code$create_hero = List$cons$(2, List$nil);

    function Web$Kaelin$Resources$Action$to_bits$(_x$1) {
        var self = _x$1;
        switch (self._) {
            case 'Web.Kaelin.Action.walk':
                var $1201 = 0n;
                var _n$2 = $1201;
                break;
            case 'Web.Kaelin.Action.ability_0':
                var $1202 = 1n;
                var _n$2 = $1202;
                break;
            case 'Web.Kaelin.Action.ability_1':
                var $1203 = 2n;
                var _n$2 = $1203;
                break;
        };
        var $1200 = (nat_to_bits(_n$2));
        return $1200;
    };
    const Web$Kaelin$Resources$Action$to_bits = x0 => Web$Kaelin$Resources$Action$to_bits$(x0);

    function Web$Kaelin$Coord$Convert$axial_to_bits$(_x$1) {
        var _unique_nat$2 = Web$Kaelin$Coord$Convert$axial_to_nat$(_x$1);
        var $1204 = (nat_to_bits(_unique_nat$2));
        return $1204;
    };
    const Web$Kaelin$Coord$Convert$axial_to_bits = x0 => Web$Kaelin$Coord$Convert$axial_to_bits$(x0);
    const Web$Kaelin$Event$Code$user_input = List$cons$(2, List$cons$(8, List$nil));

    function Web$Kaelin$Event$serialize$(_event$1) {
        var self = _event$1;
        switch (self._) {
            case 'Web.Kaelin.Event.create_hero':
                var $1206 = self.hero_id;
                var _cod$3 = List$cons$((nat_to_bits(1n)), List$cons$((nat_to_bits((BigInt($1206)))), List$nil));
                var $1207 = generate_hex$(Web$Kaelin$Event$Code$create_hero, _cod$3);
                var $1205 = $1207;
                break;
            case 'Web.Kaelin.Event.user_input':
                var $1208 = self.coord;
                var $1209 = self.action;
                var _cod$4 = List$cons$((nat_to_bits(4n)), List$cons$(Web$Kaelin$Resources$Action$to_bits$($1209), List$cons$(Web$Kaelin$Coord$Convert$axial_to_bits$($1208), List$nil)));
                var $1210 = generate_hex$(Web$Kaelin$Event$Code$user_input, _cod$4);
                var $1205 = $1210;
                break;
            case 'Web.Kaelin.Event.start_game':
            case 'Web.Kaelin.Event.create_user':
                var $1211 = "";
                var $1205 = $1211;
                break;
        };
        return $1205;
    };
    const Web$Kaelin$Event$serialize = x0 => Web$Kaelin$Event$serialize$(x0);

    function Web$Kaelin$Event$user_input$(_coord$1, _action$2) {
        var $1212 = ({
            _: 'Web.Kaelin.Event.user_input',
            'coord': _coord$1,
            'action': _action$2
        });
        return $1212;
    };
    const Web$Kaelin$Event$user_input = x0 => x1 => Web$Kaelin$Event$user_input$(x0, x1);
    const Web$Kaelin$Action$walk = ({
        _: 'Web.Kaelin.Action.walk'
    });

    function App$post$(_room$1, _data$2) {
        var $1213 = App$do$("post", (_room$1 + (";" + _data$2)));
        return $1213;
    };
    const App$post = x0 => x1 => App$post$(x0, x1);
    const U16$eql = a0 => a1 => (a0 === a1);
    const Debug$log = a0 => a1 => ((console.log(a0), a1()));

    function Web$Kaelin$Player$new$(_addr$1, _team$2, _current_hp$3, _current_status$4) {
        var $1214 = ({
            _: 'Web.Kaelin.Player.new',
            'addr': _addr$1,
            'team': _team$2,
            'current_hp': _current_hp$3,
            'current_status': _current_status$4
        });
        return $1214;
    };
    const Web$Kaelin$Player$new = x0 => x1 => x2 => x3 => Web$Kaelin$Player$new$(x0, x1, x2, x3);

    function Web$Kaelin$Action$create_player$(_user$1, _hero$2, _state$3) {
        var _key$4 = _user$1;
        var _init_pos$5 = Web$Kaelin$Coord$new$(0, 0);
        var self = _state$3;
        switch (self._) {
            case 'Web.Kaelin.State.game':
                var $1216 = self.user;
                var $1217 = self.room;
                var $1218 = self.players;
                var $1219 = self.cast_info;
                var $1220 = self.map;
                var $1221 = self.internal;
                var $1222 = self.env_info;
                var self = Map$get$(_key$4, $1218);
                switch (self._) {
                    case 'Maybe.none':
                        var $1224 = ((console.log($1216), (_$13 => {
                            var self = _hero$2;
                            switch (self._) {
                                case 'Web.Kaelin.Hero.new':
                                    var $1226 = self.health;
                                    var _creature$18 = Web$Kaelin$Entity$creature;
                                    var _new_player$19 = Web$Kaelin$Player$new$(_user$1, "blue", $1226, List$nil);
                                    var _map$20 = Web$Kaelin$Map$push$(_init_pos$5, _creature$18(Maybe$some$(_user$1))(_hero$2), $1220);
                                    var _new_players$21 = Map$set$(_key$4, _new_player$19, $1218);
                                    var $1227 = Web$Kaelin$State$game$($1216, $1217, _new_players$21, $1219, _map$20, $1221, $1222);
                                    var $1225 = $1227;
                                    break;
                            };
                            return $1225;
                        })()));
                        var $1223 = $1224;
                        break;
                    case 'Maybe.some':
                        var $1228 = _state$3;
                        var $1223 = $1228;
                        break;
                };
                var $1215 = $1223;
                break;
            case 'Web.Kaelin.State.init':
            case 'Web.Kaelin.State.void':
                var $1229 = _state$3;
                var $1215 = $1229;
                break;
        };
        return $1215;
    };
    const Web$Kaelin$Action$create_player = x0 => x1 => x2 => Web$Kaelin$Action$create_player$(x0, x1, x2);

    function String$eql_no_sensitive$(_a$1, _b$2) {
        var String$eql_no_sensitive$ = (_a$1, _b$2) => ({
            ctr: 'TCO',
            arg: [_a$1, _b$2]
        });
        var String$eql_no_sensitive = _a$1 => _b$2 => String$eql_no_sensitive$(_a$1, _b$2);
        var arg = [_a$1, _b$2];
        while (true) {
            let [_a$1, _b$2] = arg;
            var R = (() => {
                var self = _a$1;
                if (self.length === 0) {
                    var self = _b$2;
                    if (self.length === 0) {
                        var $1231 = Bool$true;
                        var $1230 = $1231;
                    } else {
                        var $1232 = self.charCodeAt(0);
                        var $1233 = self.slice(1);
                        var $1234 = Bool$false;
                        var $1230 = $1234;
                    };
                    return $1230;
                } else {
                    var $1235 = self.charCodeAt(0);
                    var $1236 = self.slice(1);
                    var self = _b$2;
                    if (self.length === 0) {
                        var $1238 = Bool$false;
                        var $1237 = $1238;
                    } else {
                        var $1239 = self.charCodeAt(0);
                        var $1240 = self.slice(1);
                        var self = (Char$to_lower$($1235) === Char$to_lower$($1239));
                        if (self) {
                            var $1242 = String$eql_no_sensitive$($1236, $1240);
                            var $1241 = $1242;
                        } else {
                            var $1243 = Bool$false;
                            var $1241 = $1243;
                        };
                        var $1237 = $1241;
                    };
                    return $1237;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const String$eql_no_sensitive = x0 => x1 => String$eql_no_sensitive$(x0, x1);

    function Web$Kaelin$Tile$player$to_entity$(_addr$1, _tile$2) {
        var Web$Kaelin$Tile$player$to_entity$ = (_addr$1, _tile$2) => ({
            ctr: 'TCO',
            arg: [_addr$1, _tile$2]
        });
        var Web$Kaelin$Tile$player$to_entity = _addr$1 => _tile$2 => Web$Kaelin$Tile$player$to_entity$(_addr$1, _tile$2);
        var arg = [_addr$1, _tile$2];
        while (true) {
            let [_addr$1, _tile$2] = arg;
            var R = (() => {
                var self = _tile$2;
                switch (self._) {
                    case 'List.cons':
                        var $1244 = self.head;
                        var $1245 = self.tail;
                        var self = $1244;
                        switch (self._) {
                            case 'Web.Kaelin.Entity.creature':
                                var $1247 = self.player;
                                var self = $1247;
                                switch (self._) {
                                    case 'Maybe.some':
                                        var $1249 = self.value;
                                        var self = String$eql_no_sensitive$(_addr$1, $1249);
                                        if (self) {
                                            var $1251 = Maybe$some$($1244);
                                            var $1250 = $1251;
                                        } else {
                                            var $1252 = Web$Kaelin$Tile$player$to_entity$(_addr$1, $1245);
                                            var $1250 = $1252;
                                        };
                                        var $1248 = $1250;
                                        break;
                                    case 'Maybe.none':
                                        var $1253 = Web$Kaelin$Tile$player$to_entity$(_addr$1, $1245);
                                        var $1248 = $1253;
                                        break;
                                };
                                var $1246 = $1248;
                                break;
                            case 'Web.Kaelin.Entity.background':
                                var $1254 = Web$Kaelin$Tile$player$to_entity$(_addr$1, $1245);
                                var $1246 = $1254;
                                break;
                        };
                        return $1246;
                    case 'List.nil':
                        var $1255 = Maybe$none;
                        return $1255;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Web$Kaelin$Tile$player$to_entity = x0 => x1 => Web$Kaelin$Tile$player$to_entity$(x0, x1);

    function Web$Kaelin$Map$player$info$go$(_addr$1, _map$2) {
        var Web$Kaelin$Map$player$info$go$ = (_addr$1, _map$2) => ({
            ctr: 'TCO',
            arg: [_addr$1, _map$2]
        });
        var Web$Kaelin$Map$player$info$go = _addr$1 => _map$2 => Web$Kaelin$Map$player$info$go$(_addr$1, _map$2);
        var arg = [_addr$1, _map$2];
        while (true) {
            let [_addr$1, _map$2] = arg;
            var R = (() => {
                var self = _map$2;
                switch (self._) {
                    case 'List.cons':
                        var $1256 = self.head;
                        var $1257 = self.tail;
                        var self = $1256;
                        switch (self._) {
                            case 'Pair.new':
                                var $1259 = self.fst;
                                var $1260 = self.snd;
                                var _coord$7 = Web$Kaelin$Coord$Convert$nat_to_axial$($1259);
                                var _entity$8 = Web$Kaelin$Tile$player$to_entity$(_addr$1, $1260);
                                var self = _entity$8;
                                switch (self._) {
                                    case 'Maybe.some':
                                        var $1262 = self.value;
                                        var $1263 = Maybe$some$(Pair$new$(_coord$7, $1262));
                                        var $1261 = $1263;
                                        break;
                                    case 'Maybe.none':
                                        var $1264 = Web$Kaelin$Map$player$info$go$(_addr$1, $1257);
                                        var $1261 = $1264;
                                        break;
                                };
                                var $1258 = $1261;
                                break;
                        };
                        return $1258;
                    case 'List.nil':
                        var $1265 = Maybe$none;
                        return $1265;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Web$Kaelin$Map$player$info$go = x0 => x1 => Web$Kaelin$Map$player$info$go$(x0, x1);

    function Web$Kaelin$Map$player$info$(_addr$1, _map$2) {
        var _lmap$3 = NatMap$to_list$(_map$2);
        var $1266 = Web$Kaelin$Map$player$info$go$(_addr$1, _lmap$3);
        return $1266;
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
                        var $1267 = self.head;
                        var $1268 = self.tail;
                        var self = _cond$2($1267);
                        if (self) {
                            var $1270 = Maybe$some$($1267);
                            var $1269 = $1270;
                        } else {
                            var $1271 = List$find$(_cond$2, $1268);
                            var $1269 = $1271;
                        };
                        return $1269;
                    case 'List.nil':
                        var $1272 = Maybe$none;
                        return $1272;
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
                var $1274 = self.key;
                var $1275 = (_key$1 === $1274);
                var $1273 = $1275;
                break;
        };
        return $1273;
    };
    const Web$Kaelin$Skill$has_key = x0 => x1 => Web$Kaelin$Skill$has_key$(x0, x1);

    function Web$Kaelin$Hero$skill$from_key$(_key$1, _hero$2) {
        var self = _hero$2;
        switch (self._) {
            case 'Web.Kaelin.Hero.new':
                var $1277 = self.skills;
                var $1278 = List$find$(Web$Kaelin$Skill$has_key(_key$1), $1277);
                var $1276 = $1278;
                break;
        };
        return $1276;
    };
    const Web$Kaelin$Hero$skill$from_key = x0 => x1 => Web$Kaelin$Hero$skill$from_key$(x0, x1);
    const Web$Kaelin$HexEffect$skill = ({
        _: 'Web.Kaelin.HexEffect.skill'
    });

    function Web$Kaelin$State$game$set_cast_info$(_cast_info$1, _state$2) {
        var self = _state$2;
        switch (self._) {
            case 'Web.Kaelin.State.game':
                var $1280 = self.user;
                var $1281 = self.room;
                var $1282 = self.players;
                var $1283 = self.map;
                var $1284 = self.internal;
                var $1285 = self.env_info;
                var $1286 = Web$Kaelin$State$game$($1280, $1281, $1282, Maybe$some$(_cast_info$1), $1283, $1284, $1285);
                var $1279 = $1286;
                break;
            case 'Web.Kaelin.State.init':
            case 'Web.Kaelin.State.void':
                var $1287 = _state$2;
                var $1279 = $1287;
                break;
        };
        return $1279;
    };
    const Web$Kaelin$State$game$set_cast_info = x0 => x1 => Web$Kaelin$State$game$set_cast_info$(x0, x1);

    function Web$Kaelin$Action$start_cast$(_key_code$1, _state$2) {
        var self = _state$2;
        switch (self._) {
            case 'Web.Kaelin.State.game':
                var $1289 = self.user;
                var $1290 = self.map;
                var $1291 = self.env_info;
                var $1292 = ((console.log($1289), (_$10 => {
                    var _player_info$11 = Web$Kaelin$Map$player$info$($1289, $1290);
                    var self = _player_info$11;
                    switch (self._) {
                        case 'Maybe.some':
                            var $1294 = self.value;
                            var self = $1294;
                            switch (self._) {
                                case 'Pair.new':
                                    var $1296 = self.fst;
                                    var $1297 = self.snd;
                                    var self = $1297;
                                    switch (self._) {
                                        case 'Web.Kaelin.Entity.creature':
                                            var $1299 = self.hero;
                                            var self = $1297;
                                            switch (self._) {
                                                case 'Web.Kaelin.Entity.creature':
                                                    var $1301 = self.hero;
                                                    var _skill$19 = Web$Kaelin$Hero$skill$from_key$(_key_code$1, $1301);
                                                    var self = _skill$19;
                                                    switch (self._) {
                                                        case 'Maybe.some':
                                                            var $1303 = self.value;
                                                            var self = $1303;
                                                            switch (self._) {
                                                                case 'Web.Kaelin.Skill.new':
                                                                    var $1305 = self.range;
                                                                    var _range$25 = Web$Kaelin$Coord$range$($1296, $1305);
                                                                    var self = $1291;
                                                                    switch (self._) {
                                                                        case 'App.EnvInfo.new':
                                                                            var $1307 = self.mouse_pos;
                                                                            var _mouse_coord$28 = Web$Kaelin$Coord$to_axial$($1307);
                                                                            var _area$29 = Web$Kaelin$Skill$indicator$($1296, $1303, _mouse_coord$28);
                                                                            var _cast$30 = Web$Kaelin$CastInfo$new$($1296, Web$Kaelin$HexEffect$skill, $1303, _range$25, _area$29, _mouse_coord$28);
                                                                            var $1308 = Web$Kaelin$State$game$set_cast_info$(_cast$30, _state$2);
                                                                            var $1306 = $1308;
                                                                            break;
                                                                    };
                                                                    var $1304 = $1306;
                                                                    break;
                                                            };
                                                            var $1302 = $1304;
                                                            break;
                                                        case 'Maybe.none':
                                                            var $1309 = _state$2;
                                                            var $1302 = $1309;
                                                            break;
                                                    };
                                                    var $1300 = $1302;
                                                    break;
                                                case 'Web.Kaelin.Entity.background':
                                                    var _skill$18 = Web$Kaelin$Hero$skill$from_key$(_key_code$1, $1299);
                                                    var self = _skill$18;
                                                    switch (self._) {
                                                        case 'Maybe.some':
                                                            var $1311 = self.value;
                                                            var self = $1311;
                                                            switch (self._) {
                                                                case 'Web.Kaelin.Skill.new':
                                                                    var $1313 = self.range;
                                                                    var _range$24 = Web$Kaelin$Coord$range$($1296, $1313);
                                                                    var self = $1291;
                                                                    switch (self._) {
                                                                        case 'App.EnvInfo.new':
                                                                            var $1315 = self.mouse_pos;
                                                                            var _mouse_coord$27 = Web$Kaelin$Coord$to_axial$($1315);
                                                                            var _area$28 = Web$Kaelin$Skill$indicator$($1296, $1311, _mouse_coord$27);
                                                                            var _cast$29 = Web$Kaelin$CastInfo$new$($1296, Web$Kaelin$HexEffect$skill, $1311, _range$24, _area$28, _mouse_coord$27);
                                                                            var $1316 = Web$Kaelin$State$game$set_cast_info$(_cast$29, _state$2);
                                                                            var $1314 = $1316;
                                                                            break;
                                                                    };
                                                                    var $1312 = $1314;
                                                                    break;
                                                            };
                                                            var $1310 = $1312;
                                                            break;
                                                        case 'Maybe.none':
                                                            var $1317 = _state$2;
                                                            var $1310 = $1317;
                                                            break;
                                                    };
                                                    var $1300 = $1310;
                                                    break;
                                            };
                                            var $1298 = $1300;
                                            break;
                                        case 'Web.Kaelin.Entity.background':
                                            var $1318 = _state$2;
                                            var $1298 = $1318;
                                            break;
                                    };
                                    var $1295 = $1298;
                                    break;
                            };
                            var $1293 = $1295;
                            break;
                        case 'Maybe.none':
                            var $1319 = _state$2;
                            var $1293 = $1319;
                            break;
                    };
                    return $1293;
                })()));
                var $1288 = $1292;
                break;
            case 'Web.Kaelin.State.init':
            case 'Web.Kaelin.State.void':
                var $1320 = _state$2;
                var $1288 = $1320;
                break;
        };
        return $1288;
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
                    var $1321 = _xs$2;
                    return $1321;
                } else {
                    var $1322 = (self - 1n);
                    var self = _xs$2;
                    if (self.length === 0) {
                        var $1324 = String$nil;
                        var $1323 = $1324;
                    } else {
                        var $1325 = self.charCodeAt(0);
                        var $1326 = self.slice(1);
                        var $1327 = String$drop$($1322, $1326);
                        var $1323 = $1327;
                    };
                    return $1323;
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
                var $1329 = self.fst;
                var $1330 = self.snd;
                var self = $1330;
                switch (self._) {
                    case 'List.cons':
                        var $1332 = self.head;
                        var $1333 = self.tail;
                        var $1334 = Pair$new$(String$drop$((BigInt($1332)), $1329), $1333);
                        var $1331 = $1334;
                        break;
                    case 'List.nil':
                        var $1335 = _buffer$1;
                        var $1331 = $1335;
                        break;
                };
                var $1328 = $1331;
                break;
        };
        return $1328;
    };
    const Web$Kaelin$Event$Buffer$next = x0 => Web$Kaelin$Event$Buffer$next$(x0);

    function Parser$State$new$(_err$1, _nam$2, _ini$3, _idx$4, _str$5) {
        var $1336 = ({
            _: 'Parser.State.new',
            'err': _err$1,
            'nam': _nam$2,
            'ini': _ini$3,
            'idx': _idx$4,
            'str': _str$5
        });
        return $1336;
    };
    const Parser$State$new = x0 => x1 => x2 => x3 => x4 => Parser$State$new$(x0, x1, x2, x3, x4);

    function Parser$run$(_parser$2, _code$3) {
        var self = _parser$2(Parser$State$new$(Maybe$none, "", 0n, 0n, _code$3));
        switch (self._) {
            case 'Parser.Reply.value':
                var $1338 = self.val;
                var $1339 = Maybe$some$($1338);
                var $1337 = $1339;
                break;
            case 'Parser.Reply.error':
                var $1340 = Maybe$none;
                var $1337 = $1340;
                break;
        };
        return $1337;
    };
    const Parser$run = x0 => x1 => Parser$run$(x0, x1);

    function Parser$Reply$(_V$1) {
        var $1341 = null;
        return $1341;
    };
    const Parser$Reply = x0 => Parser$Reply$(x0);

    function Parser$Reply$error$(_err$2) {
        var $1342 = ({
            _: 'Parser.Reply.error',
            'err': _err$2
        });
        return $1342;
    };
    const Parser$Reply$error = x0 => Parser$Reply$error$(x0);

    function Parser$Error$combine$(_a$1, _b$2) {
        var self = _a$1;
        switch (self._) {
            case 'Parser.Error.new':
                var $1344 = self.idx;
                var self = _b$2;
                switch (self._) {
                    case 'Parser.Error.new':
                        var $1346 = self.idx;
                        var self = ($1344 > $1346);
                        if (self) {
                            var $1348 = _a$1;
                            var $1347 = $1348;
                        } else {
                            var $1349 = _b$2;
                            var $1347 = $1349;
                        };
                        var $1345 = $1347;
                        break;
                };
                var $1343 = $1345;
                break;
        };
        return $1343;
    };
    const Parser$Error$combine = x0 => x1 => Parser$Error$combine$(x0, x1);

    function Parser$Error$maybe_combine$(_a$1, _b$2) {
        var self = _a$1;
        switch (self._) {
            case 'Maybe.some':
                var $1351 = self.value;
                var self = _b$2;
                switch (self._) {
                    case 'Maybe.some':
                        var $1353 = self.value;
                        var $1354 = Maybe$some$(Parser$Error$combine$($1351, $1353));
                        var $1352 = $1354;
                        break;
                    case 'Maybe.none':
                        var $1355 = _a$1;
                        var $1352 = $1355;
                        break;
                };
                var $1350 = $1352;
                break;
            case 'Maybe.none':
                var self = _b$2;
                switch (self._) {
                    case 'Maybe.none':
                        var $1357 = Maybe$none;
                        var $1356 = $1357;
                        break;
                    case 'Maybe.some':
                        var $1358 = _b$2;
                        var $1356 = $1358;
                        break;
                };
                var $1350 = $1356;
                break;
        };
        return $1350;
    };
    const Parser$Error$maybe_combine = x0 => x1 => Parser$Error$maybe_combine$(x0, x1);

    function Parser$Reply$value$(_pst$2, _val$3) {
        var $1359 = ({
            _: 'Parser.Reply.value',
            'pst': _pst$2,
            'val': _val$3
        });
        return $1359;
    };
    const Parser$Reply$value = x0 => x1 => Parser$Reply$value$(x0, x1);

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
                                var $1361 = self.pst;
                                var $1362 = self.val;
                                var $1363 = Parser$many$go$(_parse$2, (_xs$12 => {
                                    var $1364 = _values$3(List$cons$($1362, _xs$12));
                                    return $1364;
                                }), $1361);
                                var $1360 = $1363;
                                break;
                            case 'Parser.Reply.error':
                                var $1365 = Parser$Reply$value$(_pst$4, _values$3(List$nil));
                                var $1360 = $1365;
                                break;
                        };
                        return $1360;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Parser$many$go = x0 => x1 => x2 => Parser$many$go$(x0, x1, x2);

    function Parser$many$(_parser$2) {
        var $1366 = Parser$many$go(_parser$2)((_x$3 => {
            var $1367 = _x$3;
            return $1367;
        }));
        return $1366;
    };
    const Parser$many = x0 => Parser$many$(x0);

    function Parser$many1$(_parser$2, _pst$3) {
        var self = _pst$3;
        switch (self._) {
            case 'Parser.State.new':
                var $1369 = self.err;
                var _reply$9 = _parser$2(_pst$3);
                var self = _reply$9;
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $1371 = self.err;
                        var self = $1369;
                        switch (self._) {
                            case 'Maybe.some':
                                var $1373 = self.value;
                                var $1374 = Parser$Reply$error$(Parser$Error$combine$($1373, $1371));
                                var $1372 = $1374;
                                break;
                            case 'Maybe.none':
                                var $1375 = Parser$Reply$error$($1371);
                                var $1372 = $1375;
                                break;
                        };
                        var $1370 = $1372;
                        break;
                    case 'Parser.Reply.value':
                        var $1376 = self.pst;
                        var $1377 = self.val;
                        var self = $1376;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $1379 = self.err;
                                var $1380 = self.nam;
                                var $1381 = self.ini;
                                var $1382 = self.idx;
                                var $1383 = self.str;
                                var _reply$pst$17 = Parser$State$new$(Parser$Error$maybe_combine$($1369, $1379), $1380, $1381, $1382, $1383);
                                var self = _reply$pst$17;
                                switch (self._) {
                                    case 'Parser.State.new':
                                        var $1385 = self.err;
                                        var _reply$23 = Parser$many$(_parser$2)(_reply$pst$17);
                                        var self = _reply$23;
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $1387 = self.err;
                                                var self = $1385;
                                                switch (self._) {
                                                    case 'Maybe.some':
                                                        var $1389 = self.value;
                                                        var $1390 = Parser$Reply$error$(Parser$Error$combine$($1389, $1387));
                                                        var $1388 = $1390;
                                                        break;
                                                    case 'Maybe.none':
                                                        var $1391 = Parser$Reply$error$($1387);
                                                        var $1388 = $1391;
                                                        break;
                                                };
                                                var $1386 = $1388;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $1392 = self.pst;
                                                var $1393 = self.val;
                                                var self = $1392;
                                                switch (self._) {
                                                    case 'Parser.State.new':
                                                        var $1395 = self.err;
                                                        var $1396 = self.nam;
                                                        var $1397 = self.ini;
                                                        var $1398 = self.idx;
                                                        var $1399 = self.str;
                                                        var _reply$pst$31 = Parser$State$new$(Parser$Error$maybe_combine$($1385, $1395), $1396, $1397, $1398, $1399);
                                                        var $1400 = Parser$Reply$value$(_reply$pst$31, List$cons$($1377, $1393));
                                                        var $1394 = $1400;
                                                        break;
                                                };
                                                var $1386 = $1394;
                                                break;
                                        };
                                        var $1384 = $1386;
                                        break;
                                };
                                var $1378 = $1384;
                                break;
                        };
                        var $1370 = $1378;
                        break;
                };
                var $1368 = $1370;
                break;
        };
        return $1368;
    };
    const Parser$many1 = x0 => x1 => Parser$many1$(x0, x1);

    function Parser$Error$new$(_nam$1, _ini$2, _idx$3, _msg$4) {
        var $1401 = ({
            _: 'Parser.Error.new',
            'nam': _nam$1,
            'ini': _ini$2,
            'idx': _idx$3,
            'msg': _msg$4
        });
        return $1401;
    };
    const Parser$Error$new = x0 => x1 => x2 => x3 => Parser$Error$new$(x0, x1, x2, x3);

    function Parser$Reply$fail$(_nam$2, _ini$3, _idx$4, _msg$5) {
        var $1402 = Parser$Reply$error$(Parser$Error$new$(_nam$2, _ini$3, _idx$4, _msg$5));
        return $1402;
    };
    const Parser$Reply$fail = x0 => x1 => x2 => x3 => Parser$Reply$fail$(x0, x1, x2, x3);

    function Parser$one$(_pst$1) {
        var self = _pst$1;
        switch (self._) {
            case 'Parser.State.new':
                var $1404 = self.err;
                var $1405 = self.nam;
                var $1406 = self.ini;
                var $1407 = self.idx;
                var $1408 = self.str;
                var self = $1408;
                if (self.length === 0) {
                    var $1410 = Parser$Reply$fail$($1405, $1406, $1407, "Unexpected end of file.");
                    var $1409 = $1410;
                } else {
                    var $1411 = self.charCodeAt(0);
                    var $1412 = self.slice(1);
                    var _pst$9 = Parser$State$new$($1404, $1405, $1406, Nat$succ$($1407), $1412);
                    var $1413 = Parser$Reply$value$(_pst$9, $1411);
                    var $1409 = $1413;
                };
                var $1403 = $1409;
                break;
        };
        return $1403;
    };
    const Parser$one = x0 => Parser$one$(x0);

    function Char$eql$(_a$1, _b$2) {
        var $1414 = (_a$1 === _b$2);
        return $1414;
    };
    const Char$eql = x0 => x1 => Char$eql$(x0, x1);

    function Hex$char_hex_to_nat$(_x$1) {
        var self = Char$eql$(_x$1, 48);
        if (self) {
            var $1416 = Maybe$some$(0n);
            var $1415 = $1416;
        } else {
            var self = Char$eql$(_x$1, 49);
            if (self) {
                var $1418 = Maybe$some$(1n);
                var $1417 = $1418;
            } else {
                var self = Char$eql$(_x$1, 50);
                if (self) {
                    var $1420 = Maybe$some$(2n);
                    var $1419 = $1420;
                } else {
                    var self = Char$eql$(_x$1, 51);
                    if (self) {
                        var $1422 = Maybe$some$(3n);
                        var $1421 = $1422;
                    } else {
                        var self = Char$eql$(_x$1, 52);
                        if (self) {
                            var $1424 = Maybe$some$(4n);
                            var $1423 = $1424;
                        } else {
                            var self = Char$eql$(_x$1, 53);
                            if (self) {
                                var $1426 = Maybe$some$(5n);
                                var $1425 = $1426;
                            } else {
                                var self = Char$eql$(_x$1, 54);
                                if (self) {
                                    var $1428 = Maybe$some$(6n);
                                    var $1427 = $1428;
                                } else {
                                    var self = Char$eql$(_x$1, 55);
                                    if (self) {
                                        var $1430 = Maybe$some$(7n);
                                        var $1429 = $1430;
                                    } else {
                                        var self = Char$eql$(_x$1, 56);
                                        if (self) {
                                            var $1432 = Maybe$some$(8n);
                                            var $1431 = $1432;
                                        } else {
                                            var self = Char$eql$(_x$1, 57);
                                            if (self) {
                                                var $1434 = Maybe$some$(9n);
                                                var $1433 = $1434;
                                            } else {
                                                var self = Char$eql$(_x$1, 65);
                                                if (self) {
                                                    var $1436 = Maybe$some$(10n);
                                                    var $1435 = $1436;
                                                } else {
                                                    var self = Char$eql$(_x$1, 97);
                                                    if (self) {
                                                        var $1438 = Maybe$some$(10n);
                                                        var $1437 = $1438;
                                                    } else {
                                                        var self = Char$eql$(_x$1, 66);
                                                        if (self) {
                                                            var $1440 = Maybe$some$(11n);
                                                            var $1439 = $1440;
                                                        } else {
                                                            var self = Char$eql$(_x$1, 98);
                                                            if (self) {
                                                                var $1442 = Maybe$some$(11n);
                                                                var $1441 = $1442;
                                                            } else {
                                                                var self = Char$eql$(_x$1, 67);
                                                                if (self) {
                                                                    var $1444 = Maybe$some$(12n);
                                                                    var $1443 = $1444;
                                                                } else {
                                                                    var self = Char$eql$(_x$1, 99);
                                                                    if (self) {
                                                                        var $1446 = Maybe$some$(12n);
                                                                        var $1445 = $1446;
                                                                    } else {
                                                                        var self = Char$eql$(_x$1, 68);
                                                                        if (self) {
                                                                            var $1448 = Maybe$some$(13n);
                                                                            var $1447 = $1448;
                                                                        } else {
                                                                            var self = Char$eql$(_x$1, 100);
                                                                            if (self) {
                                                                                var $1450 = Maybe$some$(13n);
                                                                                var $1449 = $1450;
                                                                            } else {
                                                                                var self = Char$eql$(_x$1, 69);
                                                                                if (self) {
                                                                                    var $1452 = Maybe$some$(14n);
                                                                                    var $1451 = $1452;
                                                                                } else {
                                                                                    var self = Char$eql$(_x$1, 101);
                                                                                    if (self) {
                                                                                        var $1454 = Maybe$some$(14n);
                                                                                        var $1453 = $1454;
                                                                                    } else {
                                                                                        var self = Char$eql$(_x$1, 70);
                                                                                        if (self) {
                                                                                            var $1456 = Maybe$some$(15n);
                                                                                            var $1455 = $1456;
                                                                                        } else {
                                                                                            var self = Char$eql$(_x$1, 102);
                                                                                            if (self) {
                                                                                                var $1458 = Maybe$some$(15n);
                                                                                                var $1457 = $1458;
                                                                                            } else {
                                                                                                var $1459 = Maybe$none;
                                                                                                var $1457 = $1459;
                                                                                            };
                                                                                            var $1455 = $1457;
                                                                                        };
                                                                                        var $1453 = $1455;
                                                                                    };
                                                                                    var $1451 = $1453;
                                                                                };
                                                                                var $1449 = $1451;
                                                                            };
                                                                            var $1447 = $1449;
                                                                        };
                                                                        var $1445 = $1447;
                                                                    };
                                                                    var $1443 = $1445;
                                                                };
                                                                var $1441 = $1443;
                                                            };
                                                            var $1439 = $1441;
                                                        };
                                                        var $1437 = $1439;
                                                    };
                                                    var $1435 = $1437;
                                                };
                                                var $1433 = $1435;
                                            };
                                            var $1431 = $1433;
                                        };
                                        var $1429 = $1431;
                                    };
                                    var $1427 = $1429;
                                };
                                var $1425 = $1427;
                            };
                            var $1423 = $1425;
                        };
                        var $1421 = $1423;
                    };
                    var $1419 = $1421;
                };
                var $1417 = $1419;
            };
            var $1415 = $1417;
        };
        return $1415;
    };
    const Hex$char_hex_to_nat = x0 => Hex$char_hex_to_nat$(x0);

    function Parser$(_V$1) {
        var $1460 = null;
        return $1460;
    };
    const Parser = x0 => Parser$(x0);

    function Parser$fail$(_error$2, _pst$3) {
        var self = _pst$3;
        switch (self._) {
            case 'Parser.State.new':
                var $1462 = self.nam;
                var $1463 = self.ini;
                var $1464 = self.idx;
                var $1465 = Parser$Reply$fail$($1462, $1463, $1464, _error$2);
                var $1461 = $1465;
                break;
        };
        return $1461;
    };
    const Parser$fail = x0 => x1 => Parser$fail$(x0, x1);
    const Hex$parser$char_hex = (() => {
        var _c$1 = Parser$one;
        var $1466 = (_pst$2 => {
            var self = _pst$2;
            switch (self._) {
                case 'Parser.State.new':
                    var $1468 = self.err;
                    var _reply$8 = _c$1(_pst$2);
                    var self = _reply$8;
                    switch (self._) {
                        case 'Parser.Reply.error':
                            var $1470 = self.err;
                            var self = $1468;
                            switch (self._) {
                                case 'Maybe.some':
                                    var $1472 = self.value;
                                    var $1473 = Parser$Reply$error$(Parser$Error$combine$($1472, $1470));
                                    var $1471 = $1473;
                                    break;
                                case 'Maybe.none':
                                    var $1474 = Parser$Reply$error$($1470);
                                    var $1471 = $1474;
                                    break;
                            };
                            var $1469 = $1471;
                            break;
                        case 'Parser.Reply.value':
                            var $1475 = self.pst;
                            var $1476 = self.val;
                            var self = $1475;
                            switch (self._) {
                                case 'Parser.State.new':
                                    var $1478 = self.err;
                                    var $1479 = self.nam;
                                    var $1480 = self.ini;
                                    var $1481 = self.idx;
                                    var $1482 = self.str;
                                    var _reply$pst$16 = Parser$State$new$(Parser$Error$maybe_combine$($1468, $1478), $1479, $1480, $1481, $1482);
                                    var _k$17 = Hex$char_hex_to_nat$($1476);
                                    var self = _k$17;
                                    switch (self._) {
                                        case 'Maybe.some':
                                            var $1484 = self.value;
                                            var $1485 = (_pst$19 => {
                                                var $1486 = Parser$Reply$value$(_pst$19, $1484);
                                                return $1486;
                                            });
                                            var $1483 = $1485;
                                            break;
                                        case 'Maybe.none':
                                            var $1487 = Parser$fail("Hex lexical error");
                                            var $1483 = $1487;
                                            break;
                                    };
                                    var $1483 = $1483(_reply$pst$16);
                                    var $1477 = $1483;
                                    break;
                            };
                            var $1469 = $1477;
                            break;
                    };
                    var $1467 = $1469;
                    break;
            };
            return $1467;
        });
        return $1466;
    })();

    function List$fold_right$(_A$1, _B$2, _b$3, _f$4, _xs$5) {
        var List$fold_right$ = (_A$1, _B$2, _b$3, _f$4, _xs$5) => ({
            ctr: 'TCO',
            arg: [_A$1, _B$2, _b$3, _f$4, _xs$5]
        });
        var List$fold_right = _A$1 => _B$2 => _b$3 => _f$4 => _xs$5 => List$fold_right$(_A$1, _B$2, _b$3, _f$4, _xs$5);
        var arg = [_A$1, _B$2, _b$3, _f$4, _xs$5];
        while (true) {
            let [_A$1, _B$2, _b$3, _f$4, _xs$5] = arg;
            var R = (() => {
                var self = _xs$5;
                switch (self._) {
                    case 'List.cons':
                        var $1488 = self.head;
                        var $1489 = self.tail;
                        var $1490 = List$fold_right$(null, null, _f$4($1488)(_b$3), _f$4, $1489);
                        return $1490;
                    case 'List.nil':
                        var $1491 = _b$3;
                        return $1491;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const List$fold_right = x0 => x1 => x2 => x3 => x4 => List$fold_right$(x0, x1, x2, x3, x4);
    const Nat$pow = a0 => a1 => (a0 ** a1);

    function append_2_go$(_x$1, _y$2, _z$3) {
        var append_2_go$ = (_x$1, _y$2, _z$3) => ({
            ctr: 'TCO',
            arg: [_x$1, _y$2, _z$3]
        });
        var append_2_go = _x$1 => _y$2 => _z$3 => append_2_go$(_x$1, _y$2, _z$3);
        var arg = [_x$1, _y$2, _z$3];
        while (true) {
            let [_x$1, _y$2, _z$3] = arg;
            var R = (() => {
                var _shift1_Nat$4 = (_x$4 => {
                    var $1493 = Bits$to_nat$(Bits$shift_right$(1n, (nat_to_bits(_x$4))));
                    return $1493;
                });
                var _n$5 = (2n * (_x$1 % 2n));
                var _z$6 = (_z$3 + 1n);
                var self = (_x$1 > 0n);
                if (self) {
                    var $1494 = append_2_go$(_shift1_Nat$4(_x$1), (_y$2 + (_n$5 ** _z$6)), _z$6);
                    var $1492 = $1494;
                } else {
                    var $1495 = _y$2;
                    var $1492 = $1495;
                };
                return $1492;
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const append_2_go = x0 => x1 => x2 => append_2_go$(x0, x1, x2);

    function Nat$append_2$(_b$1, _x$2, _y$3) {
        var $1496 = append_2_go$(_x$2, _y$3, _b$1);
        return $1496;
    };
    const Nat$append_2 = x0 => x1 => x2 => Nat$append_2$(x0, x1, x2);
    const Hex$parser = (() => {
        var _k$1 = Parser$many1(Hex$parser$char_hex);
        var $1497 = (_pst$2 => {
            var self = _pst$2;
            switch (self._) {
                case 'Parser.State.new':
                    var $1499 = self.err;
                    var _reply$8 = _k$1(_pst$2);
                    var self = _reply$8;
                    switch (self._) {
                        case 'Parser.Reply.error':
                            var $1501 = self.err;
                            var self = $1499;
                            switch (self._) {
                                case 'Maybe.some':
                                    var $1503 = self.value;
                                    var $1504 = Parser$Reply$error$(Parser$Error$combine$($1503, $1501));
                                    var $1502 = $1504;
                                    break;
                                case 'Maybe.none':
                                    var $1505 = Parser$Reply$error$($1501);
                                    var $1502 = $1505;
                                    break;
                            };
                            var $1500 = $1502;
                            break;
                        case 'Parser.Reply.value':
                            var $1506 = self.pst;
                            var $1507 = self.val;
                            var self = $1506;
                            switch (self._) {
                                case 'Parser.State.new':
                                    var $1509 = self.err;
                                    var $1510 = self.nam;
                                    var $1511 = self.ini;
                                    var $1512 = self.idx;
                                    var $1513 = self.str;
                                    var _reply$pst$16 = Parser$State$new$(Parser$Error$maybe_combine$($1499, $1509), $1510, $1511, $1512, $1513);
                                    var $1514 = Parser$Reply$value$(_reply$pst$16, (() => {
                                        var self = $1507;
                                        switch (self._) {
                                            case 'List.cons':
                                                var $1515 = self.head;
                                                var $1516 = self.tail;
                                                var $1517 = List$fold_right$(null, null, $1515, Function$flip(Nat$append_2(3n)), $1516);
                                                return $1517;
                                            case 'List.nil':
                                                var $1518 = 0n;
                                                return $1518;
                                        };
                                    })());
                                    var $1508 = $1514;
                                    break;
                            };
                            var $1500 = $1508;
                            break;
                    };
                    var $1498 = $1500;
                    break;
            };
            return $1498;
        });
        return $1497;
    })();

    function Hex$to_nat$(_x$1) {
        var self = Parser$run$(Hex$parser, _x$1);
        switch (self._) {
            case 'Maybe.some':
                var $1520 = self.value;
                var $1521 = $1520;
                var $1519 = $1521;
                break;
            case 'Maybe.none':
                var $1522 = 0n;
                var $1519 = $1522;
                break;
        };
        return $1519;
    };
    const Hex$to_nat = x0 => Hex$to_nat$(x0);

    function String$take$(_n$1, _xs$2) {
        var self = _xs$2;
        if (self.length === 0) {
            var $1524 = String$nil;
            var $1523 = $1524;
        } else {
            var $1525 = self.charCodeAt(0);
            var $1526 = self.slice(1);
            var self = _n$1;
            if (self === 0n) {
                var $1528 = String$nil;
                var $1527 = $1528;
            } else {
                var $1529 = (self - 1n);
                var $1530 = String$cons$($1525, String$take$($1529, $1526));
                var $1527 = $1530;
            };
            var $1523 = $1527;
        };
        return $1523;
    };
    const String$take = x0 => x1 => String$take$(x0, x1);

    function Web$Kaelin$Event$Buffer$get$(_buffer$1) {
        var self = _buffer$1;
        switch (self._) {
            case 'Pair.new':
                var $1532 = self.fst;
                var $1533 = self.snd;
                var self = $1533;
                switch (self._) {
                    case 'List.cons':
                        var $1535 = self.head;
                        var $1536 = Hex$to_nat$(String$take$((BigInt($1535)), $1532));
                        var $1534 = $1536;
                        break;
                    case 'List.nil':
                        var $1537 = 0n;
                        var $1534 = $1537;
                        break;
                };
                var $1531 = $1534;
                break;
        };
        return $1531;
    };
    const Web$Kaelin$Event$Buffer$get = x0 => Web$Kaelin$Event$Buffer$get$(x0);

    function Web$Kaelin$Event$Buffer$push$(_buffer$1, _list$2) {
        var self = _buffer$1;
        switch (self._) {
            case 'Pair.new':
                var $1539 = self.fst;
                var $1540 = self.snd;
                var $1541 = Pair$new$($1539, List$concat$(_list$2, $1540));
                var $1538 = $1541;
                break;
        };
        return $1538;
    };
    const Web$Kaelin$Event$Buffer$push = x0 => x1 => Web$Kaelin$Event$Buffer$push$(x0, x1);

    function Web$Kaelin$Event$Buffer$new$(_fst$1, _snd$2) {
        var $1542 = Pair$new$(_fst$1, _snd$2);
        return $1542;
    };
    const Web$Kaelin$Event$Buffer$new = x0 => x1 => Web$Kaelin$Event$Buffer$new$(x0, x1);

    function Web$Kaelin$Event$create_hero$(_hero_id$1) {
        var $1543 = ({
            _: 'Web.Kaelin.Event.create_hero',
            'hero_id': _hero_id$1
        });
        return $1543;
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
            var $1545 = Maybe$some$(Web$Kaelin$Action$walk);
            var $1544 = $1545;
        } else {
            var self = (_x$1 === 1n);
            if (self) {
                var $1547 = Maybe$some$(Web$Kaelin$Action$ability_0);
                var $1546 = $1547;
            } else {
                var self = (_x$1 === 2n);
                if (self) {
                    var $1549 = Maybe$some$(Web$Kaelin$Action$ability_1);
                    var $1548 = $1549;
                } else {
                    var $1550 = Maybe$none;
                    var $1548 = $1550;
                };
                var $1546 = $1548;
            };
            var $1544 = $1546;
        };
        return $1544;
    };
    const Web$Kaelin$Resources$Action$to_action = x0 => Web$Kaelin$Resources$Action$to_action$(x0);

    function Maybe$bind$(_m$3, _f$4) {
        var self = _m$3;
        switch (self._) {
            case 'Maybe.some':
                var $1552 = self.value;
                var $1553 = _f$4($1552);
                var $1551 = $1553;
                break;
            case 'Maybe.none':
                var $1554 = Maybe$none;
                var $1551 = $1554;
                break;
        };
        return $1551;
    };
    const Maybe$bind = x0 => x1 => Maybe$bind$(x0, x1);

    function Web$Kaelin$Event$deserialize$(_code$1) {
        var _stream$2 = Web$Kaelin$Event$Buffer$new$(_code$1, Web$Kaelin$Event$Code$action);
        var self = ((_x$3 => {
            var $1556 = Web$Kaelin$Event$Buffer$get$(_x$3);
            return $1556;
        })(_stream$2) === 1n);
        if (self) {
            var _stream$3 = (_x$3 => {
                var $1558 = Web$Kaelin$Event$Buffer$next$(_x$3);
                return $1558;
            })(_stream$2);
            var _stream$4 = (_x$4 => _y$5 => {
                var $1559 = Web$Kaelin$Event$Buffer$push$(_x$4, _y$5);
                return $1559;
            })(_stream$3)(Web$Kaelin$Event$Code$create_hero);
            var $1557 = Maybe$some$(Web$Kaelin$Event$create_hero$((Number((_x$5 => {
                var $1560 = Web$Kaelin$Event$Buffer$get$(_x$5);
                return $1560;
            })(_stream$4)) & 0xFF)));
            var $1555 = $1557;
        } else {
            var self = ((_x$3 => {
                var $1562 = Web$Kaelin$Event$Buffer$get$(_x$3);
                return $1562;
            })(_stream$2) === 4n);
            if (self) {
                var _stream$3 = (_x$3 => {
                    var $1564 = Web$Kaelin$Event$Buffer$next$(_x$3);
                    return $1564;
                })(_stream$2);
                var _stream$4 = (_x$4 => _y$5 => {
                    var $1565 = Web$Kaelin$Event$Buffer$push$(_x$4, _y$5);
                    return $1565;
                })(_stream$3)(Web$Kaelin$Event$Code$user_input);
                var _action$5 = Web$Kaelin$Resources$Action$to_action$((_x$5 => {
                    var $1566 = Web$Kaelin$Event$Buffer$get$(_x$5);
                    return $1566;
                })(_stream$4));
                var _stream$6 = (_x$6 => {
                    var $1567 = Web$Kaelin$Event$Buffer$next$(_x$6);
                    return $1567;
                })(_stream$4);
                var _pos$7 = Web$Kaelin$Coord$Convert$nat_to_axial$((_x$7 => {
                    var $1568 = Web$Kaelin$Event$Buffer$get$(_x$7);
                    return $1568;
                })(_stream$6));
                var $1563 = Maybe$bind$(_action$5, (_action$8 => {
                    var $1569 = Maybe$some$(Web$Kaelin$Event$user_input$(_pos$7, _action$8));
                    return $1569;
                }));
                var $1561 = $1563;
            } else {
                var $1570 = Maybe$none;
                var $1561 = $1570;
            };
            var $1555 = $1561;
        };
        return $1555;
    };
    const Web$Kaelin$Event$deserialize = x0 => Web$Kaelin$Event$deserialize$(x0);

    function Web$Kaelin$Map$find_players$(_map$1) {
        var _lmap$2 = NatMap$to_list$(_map$1);
        var _result$3 = List$nil;
        var _players$4 = List$nil;
        var _result$5 = (() => {
            var $1573 = _result$3;
            var $1574 = _lmap$2;
            let _result$6 = $1573;
            let _pair$5;
            while ($1574._ === 'List.cons') {
                _pair$5 = $1574.head;
                var self = _pair$5;
                switch (self._) {
                    case 'Pair.new':
                        var $1575 = self.fst;
                        var $1576 = self.snd;
                        var _coord$9 = $1575;
                        var _tile$10 = $1576;
                        var _players$11 = (() => {
                            var $1579 = _players$4;
                            var $1580 = _tile$10;
                            let _players$12 = $1579;
                            let _entity$11;
                            while ($1580._ === 'List.cons') {
                                _entity$11 = $1580.head;
                                var self = _entity$11;
                                switch (self._) {
                                    case 'Web.Kaelin.Entity.creature':
                                        var $1581 = self.player;
                                        var self = $1581;
                                        switch (self._) {
                                            case 'Maybe.some':
                                                var $1583 = self.value;
                                                var _axial_coord$16 = Web$Kaelin$Coord$Convert$nat_to_axial$(_coord$9);
                                                var $1584 = List$cons$(Pair$new$($1583, _axial_coord$16), List$nil);
                                                var $1582 = $1584;
                                                break;
                                            case 'Maybe.none':
                                                var $1585 = _players$12;
                                                var $1582 = $1585;
                                                break;
                                        };
                                        var $1579 = $1582;
                                        break;
                                    case 'Web.Kaelin.Entity.background':
                                        var $1586 = _players$12;
                                        var $1579 = $1586;
                                        break;
                                };
                                _players$12 = $1579;
                                $1580 = $1580.tail;
                            }
                            return _players$12;
                        })();
                        var $1577 = List$concat$(_result$6, _players$11);
                        var $1573 = $1577;
                        break;
                };
                _result$6 = $1573;
                $1574 = $1574.tail;
            }
            return _result$6;
        })();
        var $1571 = Map$from_list$(_result$5);
        return $1571;
    };
    const Web$Kaelin$Map$find_players = x0 => Web$Kaelin$Map$find_players$(x0);

    function Web$Kaelin$Map$player$to_coord$(_addr$1, _map$2) {
        var _list$3 = Web$Kaelin$Map$find_players$(_map$2);
        var $1587 = Map$get$(_addr$1, _list$3);
        return $1587;
    };
    const Web$Kaelin$Map$player$to_coord = x0 => x1 => Web$Kaelin$Map$player$to_coord$(x0, x1);

    function Web$Kaelin$Map$coord_to_address$(_player_coord$1, _map$2) {
        var _tiles$3 = Web$Kaelin$Map$get$(_player_coord$1, _map$2);
        var _addr$4 = Maybe$none;
        var self = _tiles$3;
        switch (self._) {
            case 'Maybe.some':
                var $1589 = self.value;
                var _addr$6 = (() => {
                    var $1592 = _addr$4;
                    var $1593 = $1589;
                    let _addr$7 = $1592;
                    let _entity$6;
                    while ($1593._ === 'List.cons') {
                        _entity$6 = $1593.head;
                        var self = _entity$6;
                        switch (self._) {
                            case 'Web.Kaelin.Entity.creature':
                                var $1594 = self.player;
                                var self = $1594;
                                switch (self._) {
                                    case 'Maybe.some':
                                        var $1596 = self.value;
                                        var $1597 = Maybe$some$($1596);
                                        var $1595 = $1597;
                                        break;
                                    case 'Maybe.none':
                                        var $1598 = _addr$7;
                                        var $1595 = $1598;
                                        break;
                                };
                                var $1592 = $1595;
                                break;
                            case 'Web.Kaelin.Entity.background':
                                var $1599 = _addr$7;
                                var $1592 = $1599;
                                break;
                        };
                        _addr$7 = $1592;
                        $1593 = $1593.tail;
                    }
                    return _addr$7;
                })();
                var $1590 = _addr$6;
                var $1588 = $1590;
                break;
            case 'Maybe.none':
                var $1600 = Maybe$none;
                var $1588 = $1600;
                break;
        };
        return $1588;
    };
    const Web$Kaelin$Map$coord_to_address = x0 => x1 => Web$Kaelin$Map$coord_to_address$(x0, x1);

    function Web$Kaelin$Skill$updated_player_hp$(_player$1, _modifier$2, _value$3) {
        var self = _player$1;
        switch (self._) {
            case 'Web.Kaelin.Player.new':
                var $1602 = self.addr;
                var $1603 = self.team;
                var $1604 = self.current_hp;
                var $1605 = self.current_status;
                var self = _modifier$2;
                switch (self._) {
                    case 'Web.Kaelin.Skill.Modifier.hp.damage':
                        var _damaged$8 = (($1604 - _value$3) >> 0);
                        var $1607 = Web$Kaelin$Player$new$($1602, $1603, _damaged$8, $1605);
                        var $1606 = $1607;
                        break;
                    case 'Web.Kaelin.Skill.Modifier.hp.heal':
                        var _healed$8 = ((_value$3 + $1604) >> 0);
                        var $1608 = Web$Kaelin$Player$new$($1602, $1603, _healed$8, $1605);
                        var $1606 = $1608;
                        break;
                };
                var $1601 = $1606;
                break;
        };
        return $1601;
    };
    const Web$Kaelin$Skill$updated_player_hp = x0 => x1 => x2 => Web$Kaelin$Skill$updated_player_hp$(x0, x1, x2);

    function List$pop_at$go$(_idx$2, _list$3, _searched_list$4) {
        var List$pop_at$go$ = (_idx$2, _list$3, _searched_list$4) => ({
            ctr: 'TCO',
            arg: [_idx$2, _list$3, _searched_list$4]
        });
        var List$pop_at$go = _idx$2 => _list$3 => _searched_list$4 => List$pop_at$go$(_idx$2, _list$3, _searched_list$4);
        var arg = [_idx$2, _list$3, _searched_list$4];
        while (true) {
            let [_idx$2, _list$3, _searched_list$4] = arg;
            var R = (() => {
                var self = _idx$2;
                if (self === 0n) {
                    var self = _list$3;
                    switch (self._) {
                        case 'List.cons':
                            var $1610 = self.head;
                            var $1611 = self.tail;
                            var $1612 = Pair$new$(Maybe$some$($1610), List$concat$(_searched_list$4, $1611));
                            var $1609 = $1612;
                            break;
                        case 'List.nil':
                            var $1613 = Pair$new$(Maybe$none, _searched_list$4);
                            var $1609 = $1613;
                            break;
                    };
                    return $1609;
                } else {
                    var $1614 = (self - 1n);
                    var self = _list$3;
                    switch (self._) {
                        case 'List.cons':
                            var $1616 = self.head;
                            var $1617 = self.tail;
                            var $1618 = List$pop_at$go$($1614, $1617, List$concat$(_searched_list$4, List$cons$($1616, List$nil)));
                            var $1615 = $1618;
                            break;
                        case 'List.nil':
                            var $1619 = Pair$new$(Maybe$none, _searched_list$4);
                            var $1615 = $1619;
                            break;
                    };
                    return $1615;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const List$pop_at$go = x0 => x1 => x2 => List$pop_at$go$(x0, x1, x2);

    function List$pop_at$(_idx$2, _list$3) {
        var $1620 = List$pop_at$go$(_idx$2, _list$3, List$nil);
        return $1620;
    };
    const List$pop_at = x0 => x1 => List$pop_at$(x0, x1);

    function Web$Kaelin$Map$pop_at$(_idx$1, _coord$2, _map$3) {
        var _tile$4 = Web$Kaelin$Map$get$(_coord$2, _map$3);
        var self = _tile$4;
        switch (self._) {
            case 'Maybe.some':
                var $1622 = self.value;
                var self = List$pop_at$(_idx$1, $1622);
                switch (self._) {
                    case 'Pair.new':
                        var $1624 = self.fst;
                        var $1625 = self.snd;
                        var _map$8 = Web$Kaelin$Map$set$(_coord$2, $1625, _map$3);
                        var $1626 = Pair$new$(_map$8, $1624);
                        var $1623 = $1626;
                        break;
                };
                var $1621 = $1623;
                break;
            case 'Maybe.none':
                var $1627 = Pair$new$(_map$3, Maybe$none);
                var $1621 = $1627;
                break;
        };
        return $1621;
    };
    const Web$Kaelin$Map$pop_at = x0 => x1 => x2 => Web$Kaelin$Map$pop_at$(x0, x1, x2);

    function Web$Kaelin$Map$swap$(_idx$1, _ca$2, _cb$3, _map$4) {
        var self = Web$Kaelin$Map$pop_at$(_idx$1, _ca$2, _map$4);
        switch (self._) {
            case 'Pair.new':
                var $1629 = self.fst;
                var $1630 = self.snd;
                var self = $1630;
                switch (self._) {
                    case 'Maybe.some':
                        var $1632 = self.value;
                        var $1633 = Web$Kaelin$Map$push$(_cb$3, $1632, $1629);
                        var $1631 = $1633;
                        break;
                    case 'Maybe.none':
                        var $1634 = _map$4;
                        var $1631 = $1634;
                        break;
                };
                var $1628 = $1631;
                break;
        };
        return $1628;
    };
    const Web$Kaelin$Map$swap = x0 => x1 => x2 => x3 => Web$Kaelin$Map$swap$(x0, x1, x2, x3);

    function Web$Kaelin$Skill$updated_player_position$(_map$1, _hero_coord$2, _target_coord$3, _mod$4, _value$5) {
        var self = _mod$4;
        switch (self._) {
            case 'Web.Kaelin.Skill.Modifier.position.move_to':
                var $1636 = Pair$new$(_hero_coord$2, _target_coord$3);
                var self = $1636;
                break;
        };
        switch (self._) {
            case 'Pair.new':
                var $1637 = self.fst;
                var $1638 = self.snd;
                var $1639 = Web$Kaelin$Map$swap$(0n, $1637, $1638, _map$1);
                var $1635 = $1639;
                break;
        };
        return $1635;
    };
    const Web$Kaelin$Skill$updated_player_position = x0 => x1 => x2 => x3 => x4 => Web$Kaelin$Skill$updated_player_position$(x0, x1, x2, x3, x4);
    const Bool$not = a0 => (!a0);
    const Bool$or = a0 => a1 => (a0 || a1);

    function Web$Kaelin$Map$is_occupied$(_coord$1, _map$2) {
        var _tile$3 = Maybe$default$(Web$Kaelin$Map$get$(_coord$1, _map$2), List$nil);
        var _is_occupied$4 = Bool$false;
        var _is_occupied$5 = (() => {
            var $1642 = _is_occupied$4;
            var $1643 = _tile$3;
            let _is_occupied$6 = $1642;
            let _ent$5;
            while ($1643._ === 'List.cons') {
                _ent$5 = $1643.head;
                var self = _ent$5;
                switch (self._) {
                    case 'Web.Kaelin.Entity.background':
                        var $1644 = (_is_occupied$6 || Bool$false);
                        var $1642 = $1644;
                        break;
                    case 'Web.Kaelin.Entity.creature':
                        var $1645 = Bool$true;
                        var $1642 = $1645;
                        break;
                };
                _is_occupied$6 = $1642;
                $1643 = $1643.tail;
            }
            return _is_occupied$6;
        })();
        var $1640 = _is_occupied$5;
        return $1640;
    };
    const Web$Kaelin$Map$is_occupied = x0 => x1 => Web$Kaelin$Map$is_occupied$(x0, x1);

    function Web$Kaelin$Skill$updated_player_status$(_player$1, _modifier$2, _value$3) {
        var self = _player$1;
        switch (self._) {
            case 'Web.Kaelin.Player.new':
                var $1647 = self.addr;
                var $1648 = self.team;
                var $1649 = self.current_hp;
                var $1650 = self.current_status;
                var self = _modifier$2;
                switch (self._) {
                    case 'Web.Kaelin.Skill.Modifier.status.burn':
                    case 'Web.Kaelin.Skill.Modifier.status.poison':
                    case 'Web.Kaelin.Skill.Modifier.status.stun':
                    case 'Web.Kaelin.Skill.Modifier.status.slow':
                    case 'Web.Kaelin.Skill.Modifier.status.haste':
                    case 'Web.Kaelin.Skill.Modifier.status.root':
                        var $1652 = Web$Kaelin$Player$new$($1647, $1648, $1649, List$cons$(_modifier$2, $1650));
                        var $1651 = $1652;
                        break;
                    case 'Web.Kaelin.Skill.Modifier.status.cleanse':
                        var $1653 = Web$Kaelin$Player$new$($1647, $1648, $1649, List$nil);
                        var $1651 = $1653;
                        break;
                };
                var $1646 = $1651;
                break;
        };
        return $1646;
    };
    const Web$Kaelin$Skill$updated_player_status = x0 => x1 => x2 => Web$Kaelin$Skill$updated_player_status$(x0, x1, x2);

    function Web$Kaelin$Skill$update_state$(_state$1, _hero_pos$2, _target$3, _effect$4) {
        var self = _state$1;
        switch (self._) {
            case 'Web.Kaelin.State.game':
                var $1655 = self.user;
                var $1656 = self.room;
                var $1657 = self.players;
                var $1658 = self.cast_info;
                var $1659 = self.map;
                var $1660 = self.internal;
                var $1661 = self.env_info;
                var _player$12 = Web$Kaelin$Map$coord_to_address$(_target$3, $1659);
                var self = _effect$4;
                switch (self._) {
                    case 'Web.Kaelin.Skill.Effect.hp':
                        var $1663 = self.value;
                        var $1664 = self.modifier;
                        var self = _player$12;
                        switch (self._) {
                            case 'Maybe.some':
                                var $1666 = self.value;
                                var _player$address$18 = Map$get$($1666, $1657);
                                var self = _player$address$18;
                                switch (self._) {
                                    case 'Maybe.some':
                                        var $1668 = self.value;
                                        var _new_hp$20 = Web$Kaelin$Skill$updated_player_hp$($1668, $1664, $1663);
                                        var _new_players_hp$21 = Map$set$($1666, _new_hp$20, $1657);
                                        var $1669 = Web$Kaelin$State$game$($1655, $1656, _new_players_hp$21, $1658, $1659, $1660, $1661);
                                        var $1667 = $1669;
                                        break;
                                    case 'Maybe.none':
                                        var $1670 = _state$1;
                                        var $1667 = $1670;
                                        break;
                                };
                                var $1665 = $1667;
                                break;
                            case 'Maybe.none':
                                var $1671 = _state$1;
                                var $1665 = $1671;
                                break;
                        };
                        var $1662 = $1665;
                        break;
                    case 'Web.Kaelin.Skill.Effect.position':
                        var $1672 = self.value;
                        var $1673 = self.modifier;
                        var _new_map$17 = Web$Kaelin$Skill$updated_player_position$($1659, _hero_pos$2, _target$3, $1673, $1672);
                        var self = (!Web$Kaelin$Map$is_occupied$(_target$3, $1659));
                        if (self) {
                            var $1675 = Web$Kaelin$State$game$($1655, $1656, $1657, $1658, _new_map$17, $1660, $1661);
                            var $1674 = $1675;
                        } else {
                            var $1676 = _state$1;
                            var $1674 = $1676;
                        };
                        var $1662 = $1674;
                        break;
                    case 'Web.Kaelin.Skill.Effect.status':
                        var $1677 = self.duration;
                        var $1678 = self.modifier;
                        var self = _player$12;
                        switch (self._) {
                            case 'Maybe.some':
                                var $1680 = self.value;
                                var _player$address$18 = Map$get$($1680, $1657);
                                var self = _player$address$18;
                                switch (self._) {
                                    case 'Maybe.some':
                                        var $1682 = self.value;
                                        var _new_effect$20 = Web$Kaelin$Skill$updated_player_status$($1682, $1678, $1677);
                                        var _new_players_effect$21 = Map$set$($1680, _new_effect$20, $1657);
                                        var $1683 = Web$Kaelin$State$game$($1655, $1656, _new_players_effect$21, $1658, $1659, $1660, $1661);
                                        var $1681 = $1683;
                                        break;
                                    case 'Maybe.none':
                                        var $1684 = _state$1;
                                        var $1681 = $1684;
                                        break;
                                };
                                var $1679 = $1681;
                                break;
                            case 'Maybe.none':
                                var $1685 = _state$1;
                                var $1679 = $1685;
                                break;
                        };
                        var $1662 = $1679;
                        break;
                };
                var $1654 = $1662;
                break;
            case 'Web.Kaelin.State.init':
            case 'Web.Kaelin.State.void':
                var $1686 = _state$1;
                var $1654 = $1686;
                break;
        };
        return $1654;
    };
    const Web$Kaelin$Skill$update_state = x0 => x1 => x2 => x3 => Web$Kaelin$Skill$update_state$(x0, x1, x2, x3);

    function Web$Kaelin$Skills$skill_use$aux$(_state$1) {
        var self = _state$1;
        switch (self._) {
            case 'Web.Kaelin.State.game':
                var $1688 = self.user;
                var $1689 = self.room;
                var $1690 = self.players;
                var $1691 = self.map;
                var $1692 = self.internal;
                var $1693 = self.env_info;
                var $1694 = Web$Kaelin$State$game$($1688, $1689, $1690, Maybe$none, $1691, $1692, $1693);
                var $1687 = $1694;
                break;
            case 'Web.Kaelin.State.init':
            case 'Web.Kaelin.State.void':
                var $1695 = _state$1;
                var $1687 = $1695;
                break;
        };
        return $1687;
    };
    const Web$Kaelin$Skills$skill_use$aux = x0 => Web$Kaelin$Skills$skill_use$aux$(x0);

    function Web$Kaelin$Skill$skill_use$(_state$1) {
        var self = _state$1;
        switch (self._) {
            case 'Web.Kaelin.State.game':
                var $1697 = self.cast_info;
                var $1698 = self.env_info;
                var self = $1697;
                switch (self._) {
                    case 'Maybe.some':
                        var $1700 = self.value;
                        var self = $1698;
                        switch (self._) {
                            case 'App.EnvInfo.new':
                                var $1702 = self.mouse_pos;
                                var self = $1700;
                                switch (self._) {
                                    case 'Web.Kaelin.CastInfo.new':
                                        var $1704 = self.hero_pos;
                                        var $1705 = self.skill;
                                        var $1706 = self.range;
                                        var $1707 = self.mouse_pos;
                                        var _skill$18 = $1705;
                                        var self = _skill$18;
                                        switch (self._) {
                                            case 'Web.Kaelin.Skill.new':
                                                var $1709 = self.effects;
                                                var _mouse_pos$23 = Web$Kaelin$Coord$to_axial$($1702);
                                                var self = List$any$(Web$Kaelin$Coord$eql(_mouse_pos$23), $1706);
                                                if (self) {
                                                    var _state$24 = (() => {
                                                        var $1713 = _state$1;
                                                        var $1714 = $1709;
                                                        let _state$25 = $1713;
                                                        let _effect$24;
                                                        while ($1714._ === 'List.cons') {
                                                            _effect$24 = $1714.head;
                                                            var self = _effect$24;
                                                            switch (self._) {
                                                                case 'Web.Kaelin.Skill.Effect.hp':
                                                                    var $1715 = self.area;
                                                                    var _area$30 = Web$Kaelin$Skill$area$to_list$($1715, $1704, $1707);
                                                                    var _state$31 = (() => {
                                                                        var $1718 = _state$25;
                                                                        var $1719 = _area$30;
                                                                        let _state$32 = $1718;
                                                                        let _coord$31;
                                                                        while ($1719._ === 'List.cons') {
                                                                            _coord$31 = $1719.head;
                                                                            var $1718 = Web$Kaelin$Skill$update_state$(_state$32, $1704, _coord$31, _effect$24);
                                                                            _state$32 = $1718;
                                                                            $1719 = $1719.tail;
                                                                        }
                                                                        return _state$32;
                                                                    })();
                                                                    var $1716 = Web$Kaelin$Skills$skill_use$aux$(_state$31);
                                                                    var $1713 = $1716;
                                                                    break;
                                                                case 'Web.Kaelin.Skill.Effect.position':
                                                                    var $1720 = self.area;
                                                                    var _area$30 = Web$Kaelin$Skill$area$to_list$($1720, $1704, $1707);
                                                                    var _state$31 = (() => {
                                                                        var $1723 = _state$25;
                                                                        var $1724 = _area$30;
                                                                        let _state$32 = $1723;
                                                                        let _coord$31;
                                                                        while ($1724._ === 'List.cons') {
                                                                            _coord$31 = $1724.head;
                                                                            var $1723 = Web$Kaelin$Skill$update_state$(_state$32, $1704, _coord$31, _effect$24);
                                                                            _state$32 = $1723;
                                                                            $1724 = $1724.tail;
                                                                        }
                                                                        return _state$32;
                                                                    })();
                                                                    var $1721 = Web$Kaelin$Skills$skill_use$aux$(_state$31);
                                                                    var $1713 = $1721;
                                                                    break;
                                                                case 'Web.Kaelin.Skill.Effect.status':
                                                                    var $1725 = self.area;
                                                                    var _area$30 = Web$Kaelin$Skill$area$to_list$($1725, $1704, $1707);
                                                                    var _state$31 = (() => {
                                                                        var $1728 = _state$25;
                                                                        var $1729 = _area$30;
                                                                        let _state$32 = $1728;
                                                                        let _coord$31;
                                                                        while ($1729._ === 'List.cons') {
                                                                            _coord$31 = $1729.head;
                                                                            var $1728 = Web$Kaelin$Skill$update_state$(_state$32, $1704, _coord$31, _effect$24);
                                                                            _state$32 = $1728;
                                                                            $1729 = $1729.tail;
                                                                        }
                                                                        return _state$32;
                                                                    })();
                                                                    var $1726 = Web$Kaelin$Skills$skill_use$aux$(_state$31);
                                                                    var $1713 = $1726;
                                                                    break;
                                                            };
                                                            _state$25 = $1713;
                                                            $1714 = $1714.tail;
                                                        }
                                                        return _state$25;
                                                    })();
                                                    var $1711 = _state$24;
                                                    var $1710 = $1711;
                                                } else {
                                                    var $1730 = _state$1;
                                                    var $1710 = $1730;
                                                };
                                                var $1708 = $1710;
                                                break;
                                        };
                                        var $1703 = $1708;
                                        break;
                                };
                                var $1701 = $1703;
                                break;
                        };
                        var $1699 = $1701;
                        break;
                    case 'Maybe.none':
                        var $1731 = _state$1;
                        var $1699 = $1731;
                        break;
                };
                var $1696 = $1699;
                break;
            case 'Web.Kaelin.State.init':
            case 'Web.Kaelin.State.void':
                var $1732 = _state$1;
                var $1696 = $1732;
                break;
        };
        return $1696;
    };
    const Web$Kaelin$Skill$skill_use = x0 => Web$Kaelin$Skill$skill_use$(x0);

    function Web$Kaelin$App$when$(_event$1, _state$2) {
        var self = _event$1;
        switch (self._) {
            case 'App.Event.init':
                var $1734 = self.user;
                var self = _state$2;
                switch (self._) {
                    case 'Web.Kaelin.State.game':
                        var $1736 = self.players;
                        var $1737 = self.cast_info;
                        var $1738 = self.map;
                        var $1739 = self.internal;
                        var $1740 = self.env_info;
                        var _user$13 = String$to_lower$($1734);
                        var $1741 = IO$monad$((_m$bind$14 => _m$pure$15 => {
                            var $1742 = _m$bind$14;
                            return $1742;
                        }))(App$watch$(Web$Kaelin$Constants$room))((_$14 => {
                            var $1743 = App$store$(Web$Kaelin$State$game$(_user$13, Web$Kaelin$Constants$room, $1736, $1737, $1738, $1739, $1740));
                            return $1743;
                        }));
                        var $1735 = $1741;
                        break;
                    case 'Web.Kaelin.State.init':
                    case 'Web.Kaelin.State.void':
                        var $1744 = App$pass;
                        var $1735 = $1744;
                        break;
                };
                var $1733 = $1735;
                break;
            case 'App.Event.tick':
                var $1745 = self.time;
                var $1746 = self.info;
                var self = _state$2;
                switch (self._) {
                    case 'Web.Kaelin.State.init':
                    case 'Web.Kaelin.State.void':
                        var $1748 = App$pass;
                        var $1747 = $1748;
                        break;
                    case 'Web.Kaelin.State.game':
                        var _info$12 = $1746;
                        var _state$13 = Web$Kaelin$Action$update_interface$(_info$12, ($1745), _state$2);
                        var $1749 = App$store$(Web$Kaelin$Action$update_area$(_state$13));
                        var $1747 = $1749;
                        break;
                };
                var $1733 = $1747;
                break;
            case 'App.Event.key_down':
                var $1750 = self.code;
                var self = _state$2;
                switch (self._) {
                    case 'Web.Kaelin.State.game':
                        var $1752 = self.user;
                        var self = ($1750 === 49);
                        if (self) {
                            var $1754 = App$store$(Web$Kaelin$Action$create_player$($1752, Web$Kaelin$Heroes$Croni$croni, _state$2));
                            var $1753 = $1754;
                        } else {
                            var $1755 = App$store$(Web$Kaelin$Action$start_cast$($1750, _state$2));
                            var $1753 = $1755;
                        };
                        var $1751 = $1753;
                        break;
                    case 'Web.Kaelin.State.init':
                    case 'Web.Kaelin.State.void':
                        var $1756 = App$pass;
                        var $1751 = $1756;
                        break;
                };
                var $1733 = $1751;
                break;
            case 'App.Event.post':
                var $1757 = self.addr;
                var $1758 = self.data;
                var self = _state$2;
                switch (self._) {
                    case 'Web.Kaelin.State.game':
                        var $1760 = self.map;
                        var self = Web$Kaelin$Event$deserialize$(String$drop$(2n, $1758));
                        switch (self._) {
                            case 'Maybe.some':
                                var $1762 = self.value;
                                var self = $1762;
                                switch (self._) {
                                    case 'Web.Kaelin.Event.user_input':
                                        var $1764 = self.coord;
                                        var _pos$17 = $1764;
                                        var self = _pos$17;
                                        switch (self._) {
                                            case 'Web.Kaelin.Coord.new':
                                                var _origin$20 = Web$Kaelin$Map$player$to_coord$($1757, $1760);
                                                var self = _origin$20;
                                                switch (self._) {
                                                    case 'Maybe.none':
                                                        var $1767 = App$pass;
                                                        var $1766 = $1767;
                                                        break;
                                                    case 'Maybe.some':
                                                        var $1768 = App$store$(Web$Kaelin$Skill$skill_use$(_state$2));
                                                        var $1766 = $1768;
                                                        break;
                                                };
                                                var $1765 = $1766;
                                                break;
                                        };
                                        var $1763 = $1765;
                                        break;
                                    case 'Web.Kaelin.Event.start_game':
                                    case 'Web.Kaelin.Event.create_user':
                                    case 'Web.Kaelin.Event.create_hero':
                                        var $1769 = App$pass;
                                        var $1763 = $1769;
                                        break;
                                };
                                var $1761 = $1763;
                                break;
                            case 'Maybe.none':
                                var $1770 = App$pass;
                                var $1761 = $1770;
                                break;
                        };
                        var $1759 = $1761;
                        break;
                    case 'Web.Kaelin.State.init':
                    case 'Web.Kaelin.State.void':
                        var $1771 = App$pass;
                        var $1759 = $1771;
                        break;
                };
                var $1733 = $1759;
                break;
            case 'App.Event.mouse_down':
            case 'App.Event.key_up':
            case 'App.Event.mouse_over':
            case 'App.Event.mouse_out':
            case 'App.Event.resize':
                var self = _state$2;
                switch (self._) {
                    case 'Web.Kaelin.State.init':
                    case 'Web.Kaelin.State.void':
                    case 'Web.Kaelin.State.game':
                        var $1773 = App$pass;
                        var $1772 = $1773;
                        break;
                };
                var $1733 = $1772;
                break;
            case 'App.Event.mouse_up':
                var self = _state$2;
                switch (self._) {
                    case 'Web.Kaelin.State.game':
                        var $1775 = self.room;
                        var $1776 = self.env_info;
                        var _info$12 = $1776;
                        var self = _info$12;
                        switch (self._) {
                            case 'App.EnvInfo.new':
                                var $1778 = self.mouse_pos;
                                var self = Web$Kaelin$Coord$to_axial$($1778);
                                switch (self._) {
                                    case 'Web.Kaelin.Coord.new':
                                        var $1780 = self.i;
                                        var $1781 = self.j;
                                        var _hex$17 = Web$Kaelin$Event$serialize$(Web$Kaelin$Event$user_input$(Web$Kaelin$Coord$new$($1780, $1781), Web$Kaelin$Action$walk));
                                        var $1782 = App$post$($1775, _hex$17);
                                        var $1779 = $1782;
                                        break;
                                };
                                var $1777 = $1779;
                                break;
                        };
                        var $1774 = $1777;
                        break;
                    case 'Web.Kaelin.State.init':
                    case 'Web.Kaelin.State.void':
                        var $1783 = App$pass;
                        var $1774 = $1783;
                        break;
                };
                var $1733 = $1774;
                break;
            case 'App.Event.mouse_click':
                var self = _state$2;
                switch (self._) {
                    case 'Web.Kaelin.State.init':
                    case 'Web.Kaelin.State.void':
                    case 'Web.Kaelin.State.game':
                        var $1785 = App$pass;
                        var $1784 = $1785;
                        break;
                };
                var $1733 = $1784;
                break;
        };
        return $1733;
    };
    const Web$Kaelin$App$when = x0 => x1 => Web$Kaelin$App$when$(x0, x1);

    function App$new$(_init$2, _draw$3, _when$4) {
        var $1786 = ({
            _: 'App.new',
            'init': _init$2,
            'draw': _draw$3,
            'when': _when$4
        });
        return $1786;
    };
    const App$new = x0 => x1 => x2 => App$new$(x0, x1, x2);
    const Web$Kaelin = (() => {
        var _img$1 = VoxBox$alloc_capacity$(((65536 * 8) >>> 0));
        var _init$2 = Web$Kaelin$App$init;
        var _draw$3 = Web$Kaelin$App$draw(_img$1);
        var _when$4 = Web$Kaelin$App$when;
        var $1787 = App$new$(_init$2, _draw$3, _when$4);
        return $1787;
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
        'Web.Kaelin.Entity.creature': Web$Kaelin$Entity$creature,
        'Web.Kaelin.Hero.new': Web$Kaelin$Hero$new,
        'U8.new': U8$new,
        'Nat.to_u8': Nat$to_u8,
        'Nat.ltn': Nat$ltn,
        'Nat.sub': Nat$sub,
        'Cmp.as_gte': Cmp$as_gte,
        'Cmp.ltn': Cmp$ltn,
        'Cmp.gtn': Cmp$gtn,
        'Word.cmp.go': Word$cmp$go,
        'Cmp.eql': Cmp$eql,
        'Word.cmp': Word$cmp,
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
        'Cmp.as_eql': Cmp$as_eql,
        'Word.eql': Word$eql,
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
        'Nat.to_i32': Nat$to_i32,
        'List.cons': List$cons,
        'Web.Kaelin.Skill.new': Web$Kaelin$Skill$new,
        'Web.Kaelin.Skill.Effect.hp': Web$Kaelin$Skill$Effect$hp,
        'Web.Kaelin.Skill.Modifier.hp.damage': Web$Kaelin$Skill$Modifier$hp$damage,
        'Web.Kaelin.Skill.area.radial': Web$Kaelin$Skill$area$radial,
        'Web.Kaelin.Skill.area.indicator.red': Web$Kaelin$Skill$area$indicator$red,
        'Web.Kaelin.Heroes.Croni.skills.quick_shot': Web$Kaelin$Heroes$Croni$skills$quick_shot,
        'Web.Kaelin.Skill.area.single': Web$Kaelin$Skill$area$single,
        'Web.Kaelin.Skill.Modifier.hp.heal': Web$Kaelin$Skill$Modifier$hp$heal,
        'Web.Kaelin.Skill.area.self': Web$Kaelin$Skill$area$self,
        'Web.Kaelin.Skill.area.indicator.green': Web$Kaelin$Skill$area$indicator$green,
        'Web.Kaelin.Heroes.Croni.skills.vampirism': Web$Kaelin$Heroes$Croni$skills$vampirism,
        'Web.Kaelin.Skill.Effect.position': Web$Kaelin$Skill$Effect$position,
        'Web.Kaelin.Skill.Modifier.position.move_to': Web$Kaelin$Skill$Modifier$position$move_to,
        'Web.Kaelin.Skill.area.indicator.blue': Web$Kaelin$Skill$area$indicator$blue,
        'Web.Kaelin.Skill.move': Web$Kaelin$Skill$move,
        'Web.Kaelin.Heroes.Croni.skills': Web$Kaelin$Heroes$Croni$skills,
        'Web.Kaelin.Heroes.Croni.croni': Web$Kaelin$Heroes$Croni$croni,
        'Web.Kaelin.Assets.hero.cyclope_d_1': Web$Kaelin$Assets$hero$cyclope_d_1,
        'Web.Kaelin.Heroes.Cyclope.cyclope': Web$Kaelin$Heroes$Cyclope$cyclope,
        'Web.Kaelin.Assets.hero.lela_d_1': Web$Kaelin$Assets$hero$lela_d_1,
        'Web.Kaelin.Heroes.Lela.lela': Web$Kaelin$Heroes$Lela$lela,
        'Web.Kaelin.Assets.hero.octoking_d_1': Web$Kaelin$Assets$hero$octoking_d_1,
        'Web.Kaelin.Heroes.Octoking.octoking': Web$Kaelin$Heroes$Octoking$octoking,
        'Maybe.default': Maybe$default,
        'List': List,
        'I32.add': I32$add,
        'I32.mul': I32$mul,
        'F64.to_u32': F64$to_u32,
        'Word.s_to_f64': Word$s_to_f64,
        'I32.to_f64': I32$to_f64,
        'I32.to_u32': I32$to_u32,
        'U32.to_nat': U32$to_nat,
        'Web.Kaelin.Coord.Convert.axial_to_nat': Web$Kaelin$Coord$Convert$axial_to_nat,
        'Maybe': Maybe,
        'BitsMap.get': BitsMap$get,
        'Bits.inc': Bits$inc,
        'Nat.to_bits': Nat$to_bits,
        'NatMap.get': NatMap$get,
        'Web.Kaelin.Map.get': Web$Kaelin$Map$get,
        'NatMap.set': NatMap$set,
        'Web.Kaelin.Map.set': Web$Kaelin$Map$set,
        'Web.Kaelin.Map.push': Web$Kaelin$Map$push,
        'Web.Kaelin.Map.init': Web$Kaelin$Map$init,
        'NatMap.new': NatMap$new,
        'Web.Kaelin.Constants.map_size': Web$Kaelin$Constants$map_size,
        'Web.Kaelin.Assets.tile.green_2': Web$Kaelin$Assets$tile$green_2,
        'Web.Kaelin.Assets.tile.effect.light_blue2': Web$Kaelin$Assets$tile$effect$light_blue2,
        'Web.Kaelin.Assets.tile.effect.dark_blue2': Web$Kaelin$Assets$tile$effect$dark_blue2,
        'Web.Kaelin.Assets.tile.effect.blue_green2': Web$Kaelin$Assets$tile$effect$blue_green2,
        'Web.Kaelin.Assets.tile.effect.dark_red2': Web$Kaelin$Assets$tile$effect$dark_red2,
        'Web.Kaelin.Assets.tile.effect.light_red2': Web$Kaelin$Assets$tile$effect$light_red2,
        'Web.Kaelin.Terrain.grass': Web$Kaelin$Terrain$grass,
        'Web.Kaelin.Entity.background': Web$Kaelin$Entity$background,
        'NatMap': NatMap,
        'I32.sub': I32$sub,
        'F64.to_i32': F64$to_i32,
        'Word.to_f64': Word$to_f64,
        'U32.to_f64': U32$to_f64,
        'U32.to_i32': U32$to_i32,
        'Web.Kaelin.Coord.Cubic.new': Web$Kaelin$Coord$Cubic$new,
        'Web.Kaelin.Coord.Convert.axial_to_cubic': Web$Kaelin$Coord$Convert$axial_to_cubic,
        'Word.is_neg.go': Word$is_neg$go,
        'Word.is_neg': Word$is_neg,
        'Word.shr': Word$shr,
        'Word.s_shr': Word$s_shr,
        'I32.shr': I32$shr,
        'Word.xor': Word$xor,
        'I32.xor': I32$xor,
        'I32.abs': I32$abs,
        'Cmp.as_gtn': Cmp$as_gtn,
        'Cmp.inv': Cmp$inv,
        'Word.s_gtn': Word$s_gtn,
        'I32.gtn': I32$gtn,
        'I32.max': I32$max,
        'Cmp.as_lte': Cmp$as_lte,
        'Word.lte': Word$lte,
        'U32.lte': U32$lte,
        'Web.Kaelin.Coord.fit': Web$Kaelin$Coord$fit,
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
        'F64.add': F64$add,
        'Web.Kaelin.Coord.round.floor': Web$Kaelin$Coord$round$floor,
        'Web.Kaelin.Coord.round.round_F64': Web$Kaelin$Coord$round$round_F64,
        'Word.gtn': Word$gtn,
        'F64.gtn': F64$gtn,
        'Web.Kaelin.Coord.round.diff': Web$Kaelin$Coord$round$diff,
        'Web.Kaelin.Coord.round': Web$Kaelin$Coord$round,
        'Web.Kaelin.Coord.to_axial': Web$Kaelin$Coord$to_axial,
        'List.for': List$for,
        'Word.mod': Word$mod,
        'U32.mod': U32$mod,
        'Web.Kaelin.Coord.Convert.nat_to_axial': Web$Kaelin$Coord$Convert$nat_to_axial,
        'Web.Kaelin.HexEffect.normal': Web$Kaelin$HexEffect$normal,
        'List.any': List$any,
        'Bool.and': Bool$and,
        'I32.eql': I32$eql,
        'Web.Kaelin.Coord.eql': Web$Kaelin$Coord$eql,
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
        'Map.get': Map$get,
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
        'List.map': List$map,
        'Web.Kaelin.Coord.Convert.cubic_to_axial': Web$Kaelin$Coord$Convert$cubic_to_axial,
        'Cmp.as_ltn': Cmp$as_ltn,
        'Word.s_ltn': Word$s_ltn,
        'I32.ltn': I32$ltn,
        'I32.min': I32$min,
        'Web.Kaelin.Coord.Cubic.add': Web$Kaelin$Coord$Cubic$add,
        'Web.Kaelin.Coord.Cubic.range': Web$Kaelin$Coord$Cubic$range,
        'Web.Kaelin.Coord.Axial.range': Web$Kaelin$Coord$Axial$range,
        'List.filter': List$filter,
        'Web.Kaelin.Coord.range': Web$Kaelin$Coord$range,
        'Web.Kaelin.Skill.area.to_list': Web$Kaelin$Skill$area$to_list,
        'List.concat': List$concat,
        'NatMap.from_list': NatMap$from_list,
        'Web.Kaelin.Skill.indicator': Web$Kaelin$Skill$indicator,
        'Web.Kaelin.CastInfo.new': Web$Kaelin$CastInfo$new,
        'Web.Kaelin.Action.update_area': Web$Kaelin$Action$update_area,
        'U8.to_nat': U8$to_nat,
        'List.zip': List$zip,
        'Web.Kaelin.Event.Code.action': Web$Kaelin$Event$Code$action,
        'String.length.go': String$length$go,
        'String.length': String$length,
        'String.repeat': String$repeat,
        'Hex.set_min_length': Hex$set_min_length,
        'Hex.format_hex': Hex$format_hex,
        'Bits.cmp.go': Bits$cmp$go,
        'Bits.cmp': Bits$cmp,
        'Bits.gtn': Bits$gtn,
        'U32.to_bits': U32$to_bits,
        'Bits.size.go': Bits$size$go,
        'Bits.size': Bits$size,
        'Bits.shift_left': Bits$shift_left,
        'Bits.gte': Bits$gte,
        'Bits.tail': Bits$tail,
        'Bits.shift_right': Bits$shift_right,
        'Bits.sub.go': Bits$sub$go,
        'Bits.sub': Bits$sub,
        'Bits.div.go': Bits$div$go,
        'Bits.div': Bits$div,
        'Bits.add': Bits$add,
        'Bits.mul.go': Bits$mul$go,
        'Bits.mul': Bits$mul,
        'Bits.mod': Bits$mod,
        'Nat.square': Nat$square,
        'Bits.break': Bits$break,
        'Function.flip': Function$flip,
        'Nat.eql': Nat$eql,
        'Hex.to_hex_string': Hex$to_hex_string,
        'Bits.to_hex_string': Bits$to_hex_string,
        'Hex.append': Hex$append,
        'Pair.fst': Pair$fst,
        'Pair.snd': Pair$snd,
        'Web.Kaelin.Event.Code.generate_hex': Web$Kaelin$Event$Code$generate_hex,
        'generate_hex': generate_hex,
        'Web.Kaelin.Event.Code.create_hero': Web$Kaelin$Event$Code$create_hero,
        'Web.Kaelin.Resources.Action.to_bits': Web$Kaelin$Resources$Action$to_bits,
        'Web.Kaelin.Coord.Convert.axial_to_bits': Web$Kaelin$Coord$Convert$axial_to_bits,
        'Web.Kaelin.Event.Code.user_input': Web$Kaelin$Event$Code$user_input,
        'Web.Kaelin.Event.serialize': Web$Kaelin$Event$serialize,
        'Web.Kaelin.Event.user_input': Web$Kaelin$Event$user_input,
        'Web.Kaelin.Action.walk': Web$Kaelin$Action$walk,
        'App.post': App$post,
        'U16.eql': U16$eql,
        'Debug.log': Debug$log,
        'Web.Kaelin.Player.new': Web$Kaelin$Player$new,
        'Web.Kaelin.Action.create_player': Web$Kaelin$Action$create_player,
        'String.eql_no_sensitive': String$eql_no_sensitive,
        'Web.Kaelin.Tile.player.to_entity': Web$Kaelin$Tile$player$to_entity,
        'Web.Kaelin.Map.player.info.go': Web$Kaelin$Map$player$info$go,
        'Web.Kaelin.Map.player.info': Web$Kaelin$Map$player$info,
        'List.find': List$find,
        'Web.Kaelin.Skill.has_key': Web$Kaelin$Skill$has_key,
        'Web.Kaelin.Hero.skill.from_key': Web$Kaelin$Hero$skill$from_key,
        'Web.Kaelin.HexEffect.skill': Web$Kaelin$HexEffect$skill,
        'Web.Kaelin.State.game.set_cast_info': Web$Kaelin$State$game$set_cast_info,
        'Web.Kaelin.Action.start_cast': Web$Kaelin$Action$start_cast,
        'String.drop': String$drop,
        'Web.Kaelin.Event.Buffer.next': Web$Kaelin$Event$Buffer$next,
        'Parser.State.new': Parser$State$new,
        'Parser.run': Parser$run,
        'Parser.Reply': Parser$Reply,
        'Parser.Reply.error': Parser$Reply$error,
        'Parser.Error.combine': Parser$Error$combine,
        'Parser.Error.maybe_combine': Parser$Error$maybe_combine,
        'Parser.Reply.value': Parser$Reply$value,
        'Parser.many.go': Parser$many$go,
        'Parser.many': Parser$many,
        'Parser.many1': Parser$many1,
        'Parser.Error.new': Parser$Error$new,
        'Parser.Reply.fail': Parser$Reply$fail,
        'Parser.one': Parser$one,
        'Char.eql': Char$eql,
        'Hex.char_hex_to_nat': Hex$char_hex_to_nat,
        'Parser': Parser,
        'Parser.fail': Parser$fail,
        'Hex.parser.char_hex': Hex$parser$char_hex,
        'List.fold_right': List$fold_right,
        'Nat.pow': Nat$pow,
        'append_2_go': append_2_go,
        'Nat.append_2': Nat$append_2,
        'Hex.parser': Hex$parser,
        'Hex.to_nat': Hex$to_nat,
        'String.take': String$take,
        'Web.Kaelin.Event.Buffer.get': Web$Kaelin$Event$Buffer$get,
        'Web.Kaelin.Event.Buffer.push': Web$Kaelin$Event$Buffer$push,
        'Web.Kaelin.Event.Buffer.new': Web$Kaelin$Event$Buffer$new,
        'Web.Kaelin.Event.create_hero': Web$Kaelin$Event$create_hero,
        'Web.Kaelin.Action.ability_0': Web$Kaelin$Action$ability_0,
        'Web.Kaelin.Action.ability_1': Web$Kaelin$Action$ability_1,
        'Web.Kaelin.Resources.Action.to_action': Web$Kaelin$Resources$Action$to_action,
        'Maybe.bind': Maybe$bind,
        'Web.Kaelin.Event.deserialize': Web$Kaelin$Event$deserialize,
        'Web.Kaelin.Map.find_players': Web$Kaelin$Map$find_players,
        'Web.Kaelin.Map.player.to_coord': Web$Kaelin$Map$player$to_coord,
        'Web.Kaelin.Map.coord_to_address': Web$Kaelin$Map$coord_to_address,
        'Web.Kaelin.Skill.updated_player_hp': Web$Kaelin$Skill$updated_player_hp,
        'List.pop_at.go': List$pop_at$go,
        'List.pop_at': List$pop_at,
        'Web.Kaelin.Map.pop_at': Web$Kaelin$Map$pop_at,
        'Web.Kaelin.Map.swap': Web$Kaelin$Map$swap,
        'Web.Kaelin.Skill.updated_player_position': Web$Kaelin$Skill$updated_player_position,
        'Bool.not': Bool$not,
        'Bool.or': Bool$or,
        'Web.Kaelin.Map.is_occupied': Web$Kaelin$Map$is_occupied,
        'Web.Kaelin.Skill.updated_player_status': Web$Kaelin$Skill$updated_player_status,
        'Web.Kaelin.Skill.update_state': Web$Kaelin$Skill$update_state,
        'Web.Kaelin.Skills.skill_use.aux': Web$Kaelin$Skills$skill_use$aux,
        'Web.Kaelin.Skill.skill_use': Web$Kaelin$Skill$skill_use,
        'Web.Kaelin.App.when': Web$Kaelin$App$when,
        'App.new': App$new,
        'Web.Kaelin': Web$Kaelin,
    };
})();

/***/ })

}]);
//# sourceMappingURL=927.index.js.map