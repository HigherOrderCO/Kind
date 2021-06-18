(self["webpackChunkkind_web"] = self["webpackChunkkind_web"] || []).push([[967],{

/***/ 967:
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
    var list_length = list => {
        var len = 0;
        while (list._ === 'List.cons') {
            len += 1;
            list = list.tail;
        };
        return BigInt(len);
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

    function App$new$(_init$2, _draw$3, _when$4, _tick$5, _post$6) {
        var $149 = ({
            _: 'App.new',
            'init': _init$2,
            'draw': _draw$3,
            'when': _when$4,
            'tick': _tick$5,
            'post': _post$6
        });
        return $149;
    };
    const App$new = x0 => x1 => x2 => x3 => x4 => App$new$(x0, x1, x2, x3, x4);

    function Pair$new$(_fst$3, _snd$4) {
        var $150 = ({
            _: 'Pair.new',
            'fst': _fst$3,
            'snd': _snd$4
        });
        return $150;
    };
    const Pair$new = x0 => x1 => Pair$new$(x0, x1);
    const App$State$new = Pair$new$(null, null);
    const App$KL$State = App$State$new;

    function App$KL$State$Local$lobby$(_state$1) {
        var $151 = ({
            _: 'App.KL.State.Local.lobby',
            'state': _state$1
        });
        return $151;
    };
    const App$KL$State$Local$lobby = x0 => App$KL$State$Local$lobby$(x0);

    function App$KL$Lobby$State$Local$new$(_user$1, _room_input$2) {
        var $152 = ({
            _: 'App.KL.Lobby.State.Local.new',
            'user': _user$1,
            'room_input': _room_input$2
        });
        return $152;
    };
    const App$KL$Lobby$State$Local$new = x0 => x1 => App$KL$Lobby$State$Local$new$(x0, x1);

    function App$KL$Global$State$new$(_game$1) {
        var $153 = ({
            _: 'App.KL.Global.State.new',
            'game': _game$1
        });
        return $153;
    };
    const App$KL$Global$State$new = x0 => App$KL$Global$State$new$(x0);
    const Maybe$none = ({
        _: 'Maybe.none'
    });

    function App$Store$new$(_local$2, _global$3) {
        var $154 = ({
            _: 'App.Store.new',
            'local': _local$2,
            'global': _global$3
        });
        return $154;
    };
    const App$Store$new = x0 => x1 => App$Store$new$(x0, x1);
    const App$KL$init = (() => {
        var _local$1 = App$KL$State$Local$lobby$(App$KL$Lobby$State$Local$new$("", ""));
        var _global$2 = App$KL$Global$State$new$(Maybe$none);
        var $155 = App$Store$new$(_local$1, _global$2);
        return $155;
    })();

    function BBL$(_K$1, _V$2) {
        var $156 = null;
        return $156;
    };
    const BBL = x0 => x1 => BBL$(x0, x1);

    function Pair$fst$(_pair$3) {
        var self = _pair$3;
        switch (self._) {
            case 'Pair.new':
                var $158 = self.fst;
                var $159 = $158;
                var $157 = $159;
                break;
        };
        return $157;
    };
    const Pair$fst = x0 => Pair$fst$(x0);

    function Pair$snd$(_pair$3) {
        var self = _pair$3;
        switch (self._) {
            case 'Pair.new':
                var $161 = self.snd;
                var $162 = $161;
                var $160 = $162;
                break;
        };
        return $160;
    };
    const Pair$snd = x0 => Pair$snd$(x0);

    function BBL$bin$(_size$3, _key$4, _val$5, _left$6, _right$7) {
        var $163 = ({
            _: 'BBL.bin',
            'size': _size$3,
            'key': _key$4,
            'val': _val$5,
            'left': _left$6,
            'right': _right$7
        });
        return $163;
    };
    const BBL$bin = x0 => x1 => x2 => x3 => x4 => BBL$bin$(x0, x1, x2, x3, x4);
    const BBL$tip = ({
        _: 'BBL.tip'
    });

    function BBL$singleton$(_key$3, _val$4) {
        var $164 = BBL$bin$(1, _key$3, _val$4, BBL$tip, BBL$tip);
        return $164;
    };
    const BBL$singleton = x0 => x1 => BBL$singleton$(x0, x1);

    function BBL$size$(_map$3) {
        var self = _map$3;
        switch (self._) {
            case 'BBL.bin':
                var $166 = self.size;
                var $167 = $166;
                var $165 = $167;
                break;
            case 'BBL.tip':
                var $168 = 0;
                var $165 = $168;
                break;
        };
        return $165;
    };
    const BBL$size = x0 => BBL$size$(x0);
    const U32$add = a0 => a1 => ((a0 + a1) >>> 0);
    const BBL$w = 3;

    function Cmp$as_ltn$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
                var $170 = Bool$true;
                var $169 = $170;
                break;
            case 'Cmp.eql':
            case 'Cmp.gtn':
                var $171 = Bool$false;
                var $169 = $171;
                break;
        };
        return $169;
    };
    const Cmp$as_ltn = x0 => Cmp$as_ltn$(x0);
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
                var $173 = self.pred;
                var $174 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $176 = self.pred;
                            var $177 = (_a$pred$10 => {
                                var $178 = Word$cmp$go$(_a$pred$10, $176, _c$4);
                                return $178;
                            });
                            var $175 = $177;
                            break;
                        case 'Word.i':
                            var $179 = self.pred;
                            var $180 = (_a$pred$10 => {
                                var $181 = Word$cmp$go$(_a$pred$10, $179, Cmp$ltn);
                                return $181;
                            });
                            var $175 = $180;
                            break;
                        case 'Word.e':
                            var $182 = (_a$pred$8 => {
                                var $183 = _c$4;
                                return $183;
                            });
                            var $175 = $182;
                            break;
                    };
                    var $175 = $175($173);
                    return $175;
                });
                var $172 = $174;
                break;
            case 'Word.i':
                var $184 = self.pred;
                var $185 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $187 = self.pred;
                            var $188 = (_a$pred$10 => {
                                var $189 = Word$cmp$go$(_a$pred$10, $187, Cmp$gtn);
                                return $189;
                            });
                            var $186 = $188;
                            break;
                        case 'Word.i':
                            var $190 = self.pred;
                            var $191 = (_a$pred$10 => {
                                var $192 = Word$cmp$go$(_a$pred$10, $190, _c$4);
                                return $192;
                            });
                            var $186 = $191;
                            break;
                        case 'Word.e':
                            var $193 = (_a$pred$8 => {
                                var $194 = _c$4;
                                return $194;
                            });
                            var $186 = $193;
                            break;
                    };
                    var $186 = $186($184);
                    return $186;
                });
                var $172 = $185;
                break;
            case 'Word.e':
                var $195 = (_b$5 => {
                    var $196 = _c$4;
                    return $196;
                });
                var $172 = $195;
                break;
        };
        var $172 = $172(_b$3);
        return $172;
    };
    const Word$cmp$go = x0 => x1 => x2 => Word$cmp$go$(x0, x1, x2);
    const Cmp$eql = ({
        _: 'Cmp.eql'
    });

    function Word$cmp$(_a$2, _b$3) {
        var $197 = Word$cmp$go$(_a$2, _b$3, Cmp$eql);
        return $197;
    };
    const Word$cmp = x0 => x1 => Word$cmp$(x0, x1);

    function Word$ltn$(_a$2, _b$3) {
        var $198 = Cmp$as_ltn$(Word$cmp$(_a$2, _b$3));
        return $198;
    };
    const Word$ltn = x0 => x1 => Word$ltn$(x0, x1);
    const U32$ltn = a0 => a1 => (a0 < a1);
    const U32$from_nat = a0 => (Number(a0) >>> 0);

    function BBL$node$(_key$3, _val$4, _left$5, _right$6) {
        var _size_left$7 = BBL$size$(_left$5);
        var _size_right$8 = BBL$size$(_right$6);
        var _new_size$9 = ((1 + ((_size_left$7 + _size_right$8) >>> 0)) >>> 0);
        var $199 = BBL$bin$(_new_size$9, _key$3, _val$4, _left$5, _right$6);
        return $199;
    };
    const BBL$node = x0 => x1 => x2 => x3 => BBL$node$(x0, x1, x2, x3);

    function Cmp$as_gtn$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
            case 'Cmp.eql':
                var $201 = Bool$false;
                var $200 = $201;
                break;
            case 'Cmp.gtn':
                var $202 = Bool$true;
                var $200 = $202;
                break;
        };
        return $200;
    };
    const Cmp$as_gtn = x0 => Cmp$as_gtn$(x0);

    function Word$gtn$(_a$2, _b$3) {
        var $203 = Cmp$as_gtn$(Word$cmp$(_a$2, _b$3));
        return $203;
    };
    const Word$gtn = x0 => x1 => Word$gtn$(x0, x1);
    const U32$gtn = a0 => a1 => (a0 > a1);

    function BBL$balance$(_k$3, _v$4, _l$5, _r$6) {
        var _size_l$7 = BBL$size$(_l$5);
        var _size_r$8 = BBL$size$(_r$6);
        var _size_l_plus_size_r$9 = ((_size_l$7 + _size_r$8) >>> 0);
        var _w_x_size_l$10 = ((BBL$w * _size_l$7) >>> 0);
        var _w_x_size_r$11 = ((BBL$w * _size_r$8) >>> 0);
        var self = (_size_l_plus_size_r$9 < 2);
        if (self) {
            var $205 = BBL$node$(_k$3, _v$4, _l$5, _r$6);
            var $204 = $205;
        } else {
            var self = (_size_r$8 > _w_x_size_l$10);
            if (self) {
                var self = _r$6;
                switch (self._) {
                    case 'BBL.bin':
                        var $208 = self.key;
                        var $209 = self.val;
                        var $210 = self.left;
                        var $211 = self.right;
                        var _size_rl$17 = BBL$size$($210);
                        var _size_rr$18 = BBL$size$($211);
                        var self = (_size_rl$17 < _size_rr$18);
                        if (self) {
                            var _new_key$19 = $208;
                            var _new_val$20 = $209;
                            var _new_left$21 = BBL$node$(_k$3, _v$4, _l$5, $210);
                            var _new_right$22 = $211;
                            var $213 = BBL$node$(_new_key$19, _new_val$20, _new_left$21, _new_right$22);
                            var $212 = $213;
                        } else {
                            var self = $210;
                            switch (self._) {
                                case 'BBL.bin':
                                    var $215 = self.key;
                                    var $216 = self.val;
                                    var $217 = self.left;
                                    var $218 = self.right;
                                    var _new_key$24 = $215;
                                    var _new_val$25 = $216;
                                    var _new_left$26 = BBL$node$(_k$3, _v$4, _l$5, $217);
                                    var _new_right$27 = BBL$node$($208, $209, $218, $211);
                                    var $219 = BBL$node$(_new_key$24, _new_val$25, _new_left$26, _new_right$27);
                                    var $214 = $219;
                                    break;
                                case 'BBL.tip':
                                    var $220 = BBL$node$(_k$3, _v$4, _l$5, _r$6);
                                    var $214 = $220;
                                    break;
                            };
                            var $212 = $214;
                        };
                        var $207 = $212;
                        break;
                    case 'BBL.tip':
                        var $221 = BBL$node$(_k$3, _v$4, _l$5, _r$6);
                        var $207 = $221;
                        break;
                };
                var $206 = $207;
            } else {
                var self = (_size_l$7 > _w_x_size_r$11);
                if (self) {
                    var self = _l$5;
                    switch (self._) {
                        case 'BBL.bin':
                            var $224 = self.key;
                            var $225 = self.val;
                            var $226 = self.left;
                            var $227 = self.right;
                            var _size_ll$17 = BBL$size$($226);
                            var _size_lr$18 = BBL$size$($227);
                            var self = (_size_lr$18 < _size_ll$17);
                            if (self) {
                                var _new_key$19 = $224;
                                var _new_val$20 = $225;
                                var _new_left$21 = $226;
                                var _new_right$22 = BBL$node$(_k$3, _v$4, $227, _r$6);
                                var $229 = BBL$node$(_new_key$19, _new_val$20, _new_left$21, _new_right$22);
                                var $228 = $229;
                            } else {
                                var self = $227;
                                switch (self._) {
                                    case 'BBL.bin':
                                        var $231 = self.key;
                                        var $232 = self.val;
                                        var $233 = self.left;
                                        var $234 = self.right;
                                        var _new_key$24 = $231;
                                        var _new_val$25 = $232;
                                        var _new_left$26 = BBL$node$($224, $225, $226, $233);
                                        var _new_right$27 = BBL$node$(_k$3, _v$4, $234, _r$6);
                                        var $235 = BBL$node$(_new_key$24, _new_val$25, _new_left$26, _new_right$27);
                                        var $230 = $235;
                                        break;
                                    case 'BBL.tip':
                                        var $236 = BBL$node$(_k$3, _v$4, _l$5, _r$6);
                                        var $230 = $236;
                                        break;
                                };
                                var $228 = $230;
                            };
                            var $223 = $228;
                            break;
                        case 'BBL.tip':
                            var $237 = BBL$node$(_k$3, _v$4, _l$5, _r$6);
                            var $223 = $237;
                            break;
                    };
                    var $222 = $223;
                } else {
                    var $238 = BBL$node$(_k$3, _v$4, _l$5, _r$6);
                    var $222 = $238;
                };
                var $206 = $222;
            };
            var $204 = $206;
        };
        return $204;
    };
    const BBL$balance = x0 => x1 => x2 => x3 => BBL$balance$(x0, x1, x2, x3);

    function BBL$insert$(_cmp$3, _key$4, _val$5, _map$6) {
        var self = _map$6;
        switch (self._) {
            case 'BBL.bin':
                var $240 = self.key;
                var $241 = self.val;
                var $242 = self.left;
                var $243 = self.right;
                var self = _cmp$3(_key$4)($240);
                switch (self._) {
                    case 'Cmp.ltn':
                        var _new_key$12 = $240;
                        var _new_val$13 = $241;
                        var _new_left$14 = BBL$insert$(_cmp$3, _key$4, _val$5, $242);
                        var _new_right$15 = $243;
                        var $245 = BBL$balance$(_new_key$12, _new_val$13, _new_left$14, _new_right$15);
                        var $244 = $245;
                        break;
                    case 'Cmp.eql':
                        var $246 = BBL$node$(_key$4, _val$5, $242, $243);
                        var $244 = $246;
                        break;
                    case 'Cmp.gtn':
                        var _new_key$12 = $240;
                        var _new_val$13 = $241;
                        var _new_left$14 = $242;
                        var _new_right$15 = BBL$insert$(_cmp$3, _key$4, _val$5, $243);
                        var $247 = BBL$balance$(_new_key$12, _new_val$13, _new_left$14, _new_right$15);
                        var $244 = $247;
                        break;
                };
                var $239 = $244;
                break;
            case 'BBL.tip':
                var $248 = BBL$singleton$(_key$4, _val$5);
                var $239 = $248;
                break;
        };
        return $239;
    };
    const BBL$insert = x0 => x1 => x2 => x3 => BBL$insert$(x0, x1, x2, x3);

    function BBL$from_list$go$(_cmp$3, _acc$4, _xs$5) {
        var BBL$from_list$go$ = (_cmp$3, _acc$4, _xs$5) => ({
            ctr: 'TCO',
            arg: [_cmp$3, _acc$4, _xs$5]
        });
        var BBL$from_list$go = _cmp$3 => _acc$4 => _xs$5 => BBL$from_list$go$(_cmp$3, _acc$4, _xs$5);
        var arg = [_cmp$3, _acc$4, _xs$5];
        while (true) {
            let [_cmp$3, _acc$4, _xs$5] = arg;
            var R = (() => {
                var self = _xs$5;
                switch (self._) {
                    case 'List.cons':
                        var $249 = self.head;
                        var $250 = self.tail;
                        var _key$8 = Pair$fst$($249);
                        var _val$9 = Pair$snd$($249);
                        var _new_acc$10 = BBL$insert$(_cmp$3, _key$8, _val$9, _acc$4);
                        var $251 = BBL$from_list$go$(_cmp$3, _new_acc$10, $250);
                        return $251;
                    case 'List.nil':
                        var $252 = _acc$4;
                        return $252;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const BBL$from_list$go = x0 => x1 => x2 => BBL$from_list$go$(x0, x1, x2);

    function BBL$from_list$(_cmp$3, _xs$4) {
        var $253 = BBL$from_list$go$(_cmp$3, BBL$tip, _xs$4);
        return $253;
    };
    const BBL$from_list = x0 => x1 => BBL$from_list$(x0, x1);
    const U16$ltn = a0 => a1 => (a0 < a1);

    function Cmp$as_eql$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
            case 'Cmp.gtn':
                var $255 = Bool$false;
                var $254 = $255;
                break;
            case 'Cmp.eql':
                var $256 = Bool$true;
                var $254 = $256;
                break;
        };
        return $254;
    };
    const Cmp$as_eql = x0 => Cmp$as_eql$(x0);

    function Word$eql$(_a$2, _b$3) {
        var $257 = Cmp$as_eql$(Word$cmp$(_a$2, _b$3));
        return $257;
    };
    const Word$eql = x0 => x1 => Word$eql$(x0, x1);
    const U16$eql = a0 => a1 => (a0 === a1);

    function U16$cmp$(_a$1, _b$2) {
        var self = (_a$1 < _b$2);
        if (self) {
            var $259 = Cmp$ltn;
            var $258 = $259;
        } else {
            var self = (_a$1 === _b$2);
            if (self) {
                var $261 = Cmp$eql;
                var $260 = $261;
            } else {
                var $262 = Cmp$gtn;
                var $260 = $262;
            };
            var $258 = $260;
        };
        return $258;
    };
    const U16$cmp = x0 => x1 => U16$cmp$(x0, x1);

    function String$cmp$(_a$1, _b$2) {
        var String$cmp$ = (_a$1, _b$2) => ({
            ctr: 'TCO',
            arg: [_a$1, _b$2]
        });
        var String$cmp = _a$1 => _b$2 => String$cmp$(_a$1, _b$2);
        var arg = [_a$1, _b$2];
        while (true) {
            let [_a$1, _b$2] = arg;
            var R = (() => {
                var self = _a$1;
                if (self.length === 0) {
                    var self = _b$2;
                    if (self.length === 0) {
                        var $264 = Cmp$eql;
                        var $263 = $264;
                    } else {
                        var $265 = self.charCodeAt(0);
                        var $266 = self.slice(1);
                        var $267 = Cmp$ltn;
                        var $263 = $267;
                    };
                    return $263;
                } else {
                    var $268 = self.charCodeAt(0);
                    var $269 = self.slice(1);
                    var self = _b$2;
                    if (self.length === 0) {
                        var $271 = Cmp$gtn;
                        var $270 = $271;
                    } else {
                        var $272 = self.charCodeAt(0);
                        var $273 = self.slice(1);
                        var self = U16$cmp$($268, $272);
                        switch (self._) {
                            case 'Cmp.ltn':
                                var $275 = Cmp$ltn;
                                var $274 = $275;
                                break;
                            case 'Cmp.eql':
                                var $276 = String$cmp$($269, $273);
                                var $274 = $276;
                                break;
                            case 'Cmp.gtn':
                                var $277 = Cmp$gtn;
                                var $274 = $277;
                                break;
                        };
                        var $270 = $274;
                    };
                    return $270;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const String$cmp = x0 => x1 => String$cmp$(x0, x1);

    function Map$from_list$(_xs$2) {
        var $278 = BBL$from_list$(String$cmp, _xs$2);
        return $278;
    };
    const Map$from_list = x0 => Map$from_list$(x0);

    function List$cons$(_head$2, _tail$3) {
        var $279 = ({
            _: 'List.cons',
            'head': _head$2,
            'tail': _tail$3
        });
        return $279;
    };
    const List$cons = x0 => x1 => List$cons$(x0, x1);

    function Pair$(_A$1, _B$2) {
        var $280 = null;
        return $280;
    };
    const Pair = x0 => x1 => Pair$(x0, x1);
    const List$nil = ({
        _: 'List.nil'
    });

    function DOM$node$(_tag$1, _props$2, _style$3, _children$4) {
        var $281 = ({
            _: 'DOM.node',
            'tag': _tag$1,
            'props': _props$2,
            'style': _style$3,
            'children': _children$4
        });
        return $281;
    };
    const DOM$node = x0 => x1 => x2 => x3 => DOM$node$(x0, x1, x2, x3);

    function DOM$text$(_value$1) {
        var $282 = ({
            _: 'DOM.text',
            'value': _value$1
        });
        return $282;
    };
    const DOM$text = x0 => DOM$text$(x0);
    const Map$new = BBL$tip;

    function App$KL$Lobby$draw$input$(_id$1, _value$2) {
        var _style$3 = Map$from_list$(List$cons$(Pair$new$("font-size", "2rem"), List$cons$(Pair$new$("font-family", "monospace"), List$cons$(Pair$new$("outline", "transparent"), List$nil))));
        var $283 = DOM$node$("input", Map$from_list$(List$cons$(Pair$new$("value", _value$2), List$cons$(Pair$new$("id", _id$1), List$nil))), _style$3, List$nil);
        return $283;
    };
    const App$KL$Lobby$draw$input = x0 => x1 => App$KL$Lobby$draw$input$(x0, x1);

    function App$KL$Lobby$draw$button$(_id$1, _content$2) {
        var _style$3 = Map$from_list$(List$cons$(Pair$new$("font-size", "2rem"), List$cons$(Pair$new$("font-family", "monospace"), List$cons$(Pair$new$("margin-left", "10px"), List$cons$(Pair$new$("padding", "2px"), List$nil)))));
        var $284 = DOM$node$("button", Map$from_list$(List$cons$(Pair$new$("id", _id$1), List$nil)), _style$3, List$cons$(DOM$text$(_content$2), List$nil));
        return $284;
    };
    const App$KL$Lobby$draw$button = x0 => x1 => App$KL$Lobby$draw$button$(x0, x1);

    function App$KL$Lobby$draw$(_local$1, _global$2) {
        var self = _local$1;
        switch (self._) {
            case 'App.KL.Lobby.State.Local.new':
                var $286 = self.room_input;
                var _style$5 = Map$from_list$(List$cons$(Pair$new$("width", "100vw"), List$cons$(Pair$new$("height", "100vh"), List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("flex-direction", "column"), List$cons$(Pair$new$("justify-content", "center"), List$cons$(Pair$new$("align-items", "center"), List$cons$(Pair$new$("font-size", "2rem"), List$nil))))))));
                var $287 = DOM$node$("div", Map$from_list$(List$nil), _style$5, List$cons$(DOM$node$("h1", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("margin-bottom", "10px"), List$nil)), List$cons$(DOM$text$("Welcome to Kaelin"), List$nil)), List$cons$(DOM$node$("div", Map$from_list$(List$nil), Map$new, List$cons$(DOM$text$("Enter a room number: "), List$cons$(App$KL$Lobby$draw$input$("text", $286), List$cons$(App$KL$Lobby$draw$button$("ready", "Enter"), List$cons$(App$KL$Lobby$draw$button$("random", "Random"), List$nil))))), List$nil)));
                var $285 = $287;
                break;
        };
        return $285;
    };
    const App$KL$Lobby$draw = x0 => x1 => App$KL$Lobby$draw$(x0, x1);

    function Maybe$(_A$1) {
        var $288 = null;
        return $288;
    };
    const Maybe = x0 => Maybe$(x0);

    function Maybe$some$(_value$2) {
        var $289 = ({
            _: 'Maybe.some',
            'value': _value$2
        });
        return $289;
    };
    const Maybe$some = x0 => Maybe$some$(x0);

    function BBL$lookup$(_cmp$3, _key$4, _map$5) {
        var BBL$lookup$ = (_cmp$3, _key$4, _map$5) => ({
            ctr: 'TCO',
            arg: [_cmp$3, _key$4, _map$5]
        });
        var BBL$lookup = _cmp$3 => _key$4 => _map$5 => BBL$lookup$(_cmp$3, _key$4, _map$5);
        var arg = [_cmp$3, _key$4, _map$5];
        while (true) {
            let [_cmp$3, _key$4, _map$5] = arg;
            var R = (() => {
                var self = _map$5;
                switch (self._) {
                    case 'BBL.bin':
                        var $290 = self.key;
                        var $291 = self.val;
                        var $292 = self.left;
                        var $293 = self.right;
                        var self = _cmp$3(_key$4)($290);
                        switch (self._) {
                            case 'Cmp.ltn':
                                var $295 = BBL$lookup$(_cmp$3, _key$4, $292);
                                var $294 = $295;
                                break;
                            case 'Cmp.eql':
                                var $296 = Maybe$some$($291);
                                var $294 = $296;
                                break;
                            case 'Cmp.gtn':
                                var $297 = BBL$lookup$(_cmp$3, _key$4, $293);
                                var $294 = $297;
                                break;
                        };
                        return $294;
                    case 'BBL.tip':
                        var $298 = Maybe$none;
                        return $298;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const BBL$lookup = x0 => x1 => x2 => BBL$lookup$(x0, x1, x2);

    function Map$get$(_key$2, _map$3) {
        var $299 = BBL$lookup$(String$cmp, _key$2, _map$3);
        return $299;
    };
    const Map$get = x0 => x1 => Map$get$(x0, x1);

    function Maybe$default$(_m$2, _a$3) {
        var self = _m$2;
        switch (self._) {
            case 'Maybe.some':
                var $301 = self.value;
                var $302 = $301;
                var $300 = $302;
                break;
            case 'Maybe.none':
                var $303 = _a$3;
                var $300 = $303;
                break;
        };
        return $300;
    };
    const Maybe$default = x0 => x1 => Maybe$default$(x0, x1);

    function App$KL$Game$Stage$Draft$to_team$(_players$1, _user$2) {
        var _player$3 = Map$get$(_user$2, _players$1);
        var self = _player$3;
        switch (self._) {
            case 'Maybe.some':
                var $305 = self.value;
                var $306 = Maybe$some$((() => {
                    var self = $305;
                    switch (self._) {
                        case 'App.KL.Game.Player.new':
                            var $307 = self.team;
                            var $308 = $307;
                            return $308;
                    };
                })());
                var $304 = $306;
                break;
            case 'Maybe.none':
                var $309 = Maybe$none;
                var $304 = $309;
                break;
        };
        return $304;
    };
    const App$KL$Game$Stage$Draft$to_team = x0 => x1 => App$KL$Game$Stage$Draft$to_team$(x0, x1);
    const App$KL$Game$Team$neutral = ({
        _: 'App.KL.Game.Team.neutral'
    });

    function Map$set$(_key$2, _val$3, _map$4) {
        var $310 = BBL$insert$(String$cmp, _key$2, _val$3, _map$4);
        return $310;
    };
    const Map$set = x0 => x1 => x2 => Map$set$(x0, x1, x2);

    function List$fold$(_list$2, _nil$4, _cons$5) {
        var self = _list$2;
        switch (self._) {
            case 'List.cons':
                var $312 = self.head;
                var $313 = self.tail;
                var $314 = _cons$5($312)(List$fold$($313, _nil$4, _cons$5));
                var $311 = $314;
                break;
            case 'List.nil':
                var $315 = _nil$4;
                var $311 = $315;
                break;
        };
        return $311;
    };
    const List$fold = x0 => x1 => x2 => List$fold$(x0, x1, x2);

    function Hexagonal$Axial$new$(_i$1, _j$2) {
        var $316 = ({
            _: 'Hexagonal.Axial.new',
            'i': _i$1,
            'j': _j$2
        });
        return $316;
    };
    const Hexagonal$Axial$new = x0 => x1 => Hexagonal$Axial$new$(x0, x1);

    function I32$new$(_value$1) {
        var $317 = word_to_i32(_value$1);
        return $317;
    };
    const I32$new = x0 => I32$new$(x0);

    function Word$neg$aux$(_word$2, _inc$3) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $319 = self.pred;
                var self = _inc$3;
                if (self) {
                    var $321 = Word$o$(Word$neg$aux$($319, Bool$true));
                    var $320 = $321;
                } else {
                    var $322 = Word$i$(Word$neg$aux$($319, Bool$false));
                    var $320 = $322;
                };
                var $318 = $320;
                break;
            case 'Word.i':
                var $323 = self.pred;
                var self = _inc$3;
                if (self) {
                    var $325 = Word$i$(Word$neg$aux$($323, Bool$false));
                    var $324 = $325;
                } else {
                    var $326 = Word$o$(Word$neg$aux$($323, Bool$false));
                    var $324 = $326;
                };
                var $318 = $324;
                break;
            case 'Word.e':
                var $327 = Word$e;
                var $318 = $327;
                break;
        };
        return $318;
    };
    const Word$neg$aux = x0 => x1 => Word$neg$aux$(x0, x1);

    function Word$neg$(_word$2) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $329 = self.pred;
                var $330 = Word$o$(Word$neg$aux$($329, Bool$true));
                var $328 = $330;
                break;
            case 'Word.i':
                var $331 = self.pred;
                var $332 = Word$i$(Word$neg$aux$($331, Bool$false));
                var $328 = $332;
                break;
            case 'Word.e':
                var $333 = Word$e;
                var $328 = $333;
                break;
        };
        return $328;
    };
    const Word$neg = x0 => Word$neg$(x0);
    const I32$neg = a0 => ((-a0));
    const Int$to_i32 = a0 => (Number(a0));
    const Int$new = a0 => a1 => (a0 - a1);
    const Int$from_nat = a0 => (a0);
    const I32$from_nat = a0 => (Number(a0));

    function Parser$State$new$(_err$1, _nam$2, _ini$3, _idx$4, _str$5) {
        var $334 = ({
            _: 'Parser.State.new',
            'err': _err$1,
            'nam': _nam$2,
            'ini': _ini$3,
            'idx': _idx$4,
            'str': _str$5
        });
        return $334;
    };
    const Parser$State$new = x0 => x1 => x2 => x3 => x4 => Parser$State$new$(x0, x1, x2, x3, x4);

    function Parser$run$(_parser$2, _code$3) {
        var self = _parser$2(Parser$State$new$(Maybe$none, "", 0n, 0n, _code$3));
        switch (self._) {
            case 'Parser.Reply.value':
                var $336 = self.val;
                var $337 = Maybe$some$($336);
                var $335 = $337;
                break;
            case 'Parser.Reply.error':
                var $338 = Maybe$none;
                var $335 = $338;
                break;
        };
        return $335;
    };
    const Parser$run = x0 => x1 => Parser$run$(x0, x1);

    function Parser$Reply$(_V$1) {
        var $339 = null;
        return $339;
    };
    const Parser$Reply = x0 => Parser$Reply$(x0);

    function Parser$Reply$error$(_err$2) {
        var $340 = ({
            _: 'Parser.Reply.error',
            'err': _err$2
        });
        return $340;
    };
    const Parser$Reply$error = x0 => Parser$Reply$error$(x0);

    function Parser$Error$new$(_nam$1, _ini$2, _idx$3, _msg$4) {
        var $341 = ({
            _: 'Parser.Error.new',
            'nam': _nam$1,
            'ini': _ini$2,
            'idx': _idx$3,
            'msg': _msg$4
        });
        return $341;
    };
    const Parser$Error$new = x0 => x1 => x2 => x3 => Parser$Error$new$(x0, x1, x2, x3);

    function Parser$Reply$fail$(_nam$2, _ini$3, _idx$4, _msg$5) {
        var $342 = Parser$Reply$error$(Parser$Error$new$(_nam$2, _ini$3, _idx$4, _msg$5));
        return $342;
    };
    const Parser$Reply$fail = x0 => x1 => x2 => x3 => Parser$Reply$fail$(x0, x1, x2, x3);
    const Nat$gtn = a0 => a1 => (a0 > a1);

    function Parser$Error$combine$(_a$1, _b$2) {
        var self = _a$1;
        switch (self._) {
            case 'Parser.Error.new':
                var $344 = self.idx;
                var self = _b$2;
                switch (self._) {
                    case 'Parser.Error.new':
                        var $346 = self.idx;
                        var self = ($344 > $346);
                        if (self) {
                            var $348 = _a$1;
                            var $347 = $348;
                        } else {
                            var $349 = _b$2;
                            var $347 = $349;
                        };
                        var $345 = $347;
                        break;
                };
                var $343 = $345;
                break;
        };
        return $343;
    };
    const Parser$Error$combine = x0 => x1 => Parser$Error$combine$(x0, x1);

    function Parser$Error$maybe_combine$(_a$1, _b$2) {
        var self = _a$1;
        switch (self._) {
            case 'Maybe.some':
                var $351 = self.value;
                var self = _b$2;
                switch (self._) {
                    case 'Maybe.some':
                        var $353 = self.value;
                        var $354 = Maybe$some$(Parser$Error$combine$($351, $353));
                        var $352 = $354;
                        break;
                    case 'Maybe.none':
                        var $355 = _a$1;
                        var $352 = $355;
                        break;
                };
                var $350 = $352;
                break;
            case 'Maybe.none':
                var self = _b$2;
                switch (self._) {
                    case 'Maybe.none':
                        var $357 = Maybe$none;
                        var $356 = $357;
                        break;
                    case 'Maybe.some':
                        var $358 = _b$2;
                        var $356 = $358;
                        break;
                };
                var $350 = $356;
                break;
        };
        return $350;
    };
    const Parser$Error$maybe_combine = x0 => x1 => Parser$Error$maybe_combine$(x0, x1);

    function Parser$Reply$value$(_pst$2, _val$3) {
        var $359 = ({
            _: 'Parser.Reply.value',
            'pst': _pst$2,
            'val': _val$3
        });
        return $359;
    };
    const Parser$Reply$value = x0 => x1 => Parser$Reply$value$(x0, x1);

    function Parser$choice$(_pars$2, _pst$3) {
        var Parser$choice$ = (_pars$2, _pst$3) => ({
            ctr: 'TCO',
            arg: [_pars$2, _pst$3]
        });
        var Parser$choice = _pars$2 => _pst$3 => Parser$choice$(_pars$2, _pst$3);
        var arg = [_pars$2, _pst$3];
        while (true) {
            let [_pars$2, _pst$3] = arg;
            var R = (() => {
                var self = _pst$3;
                switch (self._) {
                    case 'Parser.State.new':
                        var $360 = self.err;
                        var $361 = self.nam;
                        var $362 = self.ini;
                        var $363 = self.idx;
                        var $364 = self.str;
                        var self = _pars$2;
                        switch (self._) {
                            case 'List.cons':
                                var $366 = self.head;
                                var $367 = self.tail;
                                var _parsed$11 = $366(_pst$3);
                                var self = _parsed$11;
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $369 = self.err;
                                        var _cur_err$13 = Maybe$some$($369);
                                        var _far_err$14 = Parser$Error$maybe_combine$($360, _cur_err$13);
                                        var _new_pst$15 = Parser$State$new$(_far_err$14, $361, $362, $363, $364);
                                        var $370 = Parser$choice$($367, _new_pst$15);
                                        var $368 = $370;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $371 = self.pst;
                                        var $372 = self.val;
                                        var $373 = Parser$Reply$value$($371, $372);
                                        var $368 = $373;
                                        break;
                                };
                                var $365 = $368;
                                break;
                            case 'List.nil':
                                var self = $360;
                                switch (self._) {
                                    case 'Maybe.some':
                                        var $375 = self.value;
                                        var $376 = Parser$Reply$error$($375);
                                        var $374 = $376;
                                        break;
                                    case 'Maybe.none':
                                        var $377 = Parser$Reply$fail$($361, $362, $363, "No parse.");
                                        var $374 = $377;
                                        break;
                                };
                                var $365 = $374;
                                break;
                        };
                        return $365;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Parser$choice = x0 => x1 => Parser$choice$(x0, x1);

    function Parser$(_V$1) {
        var $378 = null;
        return $378;
    };
    const Parser = x0 => Parser$(x0);
    const Unit$new = null;

    function String$cons$(_head$1, _tail$2) {
        var $379 = (String.fromCharCode(_head$1) + _tail$2);
        return $379;
    };
    const String$cons = x0 => x1 => String$cons$(x0, x1);
    const String$concat = a0 => a1 => (a0 + a1);
    const String$nil = '';

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
                        var $380 = self.err;
                        var $381 = self.nam;
                        var $382 = self.ini;
                        var $383 = self.idx;
                        var $384 = self.str;
                        var self = _text$3;
                        if (self.length === 0) {
                            var $386 = Parser$Reply$value$(_pst$4, Unit$new);
                            var $385 = $386;
                        } else {
                            var $387 = self.charCodeAt(0);
                            var $388 = self.slice(1);
                            var self = $384;
                            if (self.length === 0) {
                                var _error_msg$12 = ("Expected \'" + (_ini_txt$2 + "\', found end of file."));
                                var $390 = Parser$Reply$fail$($381, $382, _ini_idx$1, _error_msg$12);
                                var $389 = $390;
                            } else {
                                var $391 = self.charCodeAt(0);
                                var $392 = self.slice(1);
                                var self = ($387 === $391);
                                if (self) {
                                    var _pst$14 = Parser$State$new$($380, $381, $382, Nat$succ$($383), $392);
                                    var $394 = Parser$text$go$(_ini_idx$1, _ini_txt$2, $388, _pst$14);
                                    var $393 = $394;
                                } else {
                                    var _chr$14 = String$cons$($391, String$nil);
                                    var _err$15 = ("Expected \'" + (_ini_txt$2 + ("\', found \'" + (_chr$14 + "\'."))));
                                    var $395 = Parser$Reply$fail$($381, $382, _ini_idx$1, _err$15);
                                    var $393 = $395;
                                };
                                var $389 = $393;
                            };
                            var $385 = $389;
                        };
                        return $385;
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
                var $397 = self.idx;
                var self = Parser$text$go$($397, _text$1, _text$1, _pst$2);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $399 = self.err;
                        var $400 = Parser$Reply$error$($399);
                        var $398 = $400;
                        break;
                    case 'Parser.Reply.value':
                        var $401 = self.pst;
                        var $402 = self.val;
                        var $403 = Parser$Reply$value$($401, $402);
                        var $398 = $403;
                        break;
                };
                var $396 = $398;
                break;
        };
        return $396;
    };
    const Parser$text = x0 => x1 => Parser$text$(x0, x1);

    function List$(_A$1) {
        var $404 = null;
        return $404;
    };
    const List = x0 => List$(x0);

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
                                var $406 = self.pst;
                                var $407 = self.val;
                                var $408 = Parser$many$go$(_parse$2, (_xs$12 => {
                                    var $409 = _values$3(List$cons$($407, _xs$12));
                                    return $409;
                                }), $406);
                                var $405 = $408;
                                break;
                            case 'Parser.Reply.error':
                                var $410 = Parser$Reply$value$(_pst$4, _values$3(List$nil));
                                var $405 = $410;
                                break;
                        };
                        return $405;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Parser$many$go = x0 => x1 => x2 => Parser$many$go$(x0, x1, x2);

    function Parser$many$(_parser$2) {
        var $411 = Parser$many$go(_parser$2)((_x$3 => {
            var $412 = _x$3;
            return $412;
        }));
        return $411;
    };
    const Parser$many = x0 => Parser$many$(x0);

    function Parser$many1$(_parser$2, _pst$3) {
        var self = _pst$3;
        switch (self._) {
            case 'Parser.State.new':
                var $414 = self.err;
                var _reply$9 = _parser$2(_pst$3);
                var self = _reply$9;
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $416 = self.err;
                        var self = $414;
                        switch (self._) {
                            case 'Maybe.some':
                                var $418 = self.value;
                                var $419 = Parser$Reply$error$(Parser$Error$combine$($418, $416));
                                var $417 = $419;
                                break;
                            case 'Maybe.none':
                                var $420 = Parser$Reply$error$($416);
                                var $417 = $420;
                                break;
                        };
                        var $415 = $417;
                        break;
                    case 'Parser.Reply.value':
                        var $421 = self.pst;
                        var $422 = self.val;
                        var self = $421;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $424 = self.err;
                                var $425 = self.nam;
                                var $426 = self.ini;
                                var $427 = self.idx;
                                var $428 = self.str;
                                var _reply$pst$17 = Parser$State$new$(Parser$Error$maybe_combine$($414, $424), $425, $426, $427, $428);
                                var self = _reply$pst$17;
                                switch (self._) {
                                    case 'Parser.State.new':
                                        var $430 = self.err;
                                        var _reply$23 = Parser$many$(_parser$2)(_reply$pst$17);
                                        var self = _reply$23;
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $432 = self.err;
                                                var self = $430;
                                                switch (self._) {
                                                    case 'Maybe.some':
                                                        var $434 = self.value;
                                                        var $435 = Parser$Reply$error$(Parser$Error$combine$($434, $432));
                                                        var $433 = $435;
                                                        break;
                                                    case 'Maybe.none':
                                                        var $436 = Parser$Reply$error$($432);
                                                        var $433 = $436;
                                                        break;
                                                };
                                                var $431 = $433;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $437 = self.pst;
                                                var $438 = self.val;
                                                var self = $437;
                                                switch (self._) {
                                                    case 'Parser.State.new':
                                                        var $440 = self.err;
                                                        var $441 = self.nam;
                                                        var $442 = self.ini;
                                                        var $443 = self.idx;
                                                        var $444 = self.str;
                                                        var _reply$pst$31 = Parser$State$new$(Parser$Error$maybe_combine$($430, $440), $441, $442, $443, $444);
                                                        var $445 = Parser$Reply$value$(_reply$pst$31, List$cons$($422, $438));
                                                        var $439 = $445;
                                                        break;
                                                };
                                                var $431 = $439;
                                                break;
                                        };
                                        var $429 = $431;
                                        break;
                                };
                                var $423 = $429;
                                break;
                        };
                        var $415 = $423;
                        break;
                };
                var $413 = $415;
                break;
        };
        return $413;
    };
    const Parser$many1 = x0 => x1 => Parser$many1$(x0, x1);

    function Parser$hex_digit$(_pst$1) {
        var self = _pst$1;
        switch (self._) {
            case 'Parser.State.new':
                var $447 = self.err;
                var $448 = self.nam;
                var $449 = self.ini;
                var $450 = self.idx;
                var $451 = self.str;
                var self = $451;
                if (self.length === 0) {
                    var $453 = Parser$Reply$fail$($448, $449, $450, "Not a digit.");
                    var $452 = $453;
                } else {
                    var $454 = self.charCodeAt(0);
                    var $455 = self.slice(1);
                    var _pst$9 = Parser$State$new$($447, $448, $449, Nat$succ$($450), $455);
                    var self = ($454 === 48);
                    if (self) {
                        var $457 = Parser$Reply$value$(_pst$9, 0n);
                        var $456 = $457;
                    } else {
                        var self = ($454 === 49);
                        if (self) {
                            var $459 = Parser$Reply$value$(_pst$9, 1n);
                            var $458 = $459;
                        } else {
                            var self = ($454 === 50);
                            if (self) {
                                var $461 = Parser$Reply$value$(_pst$9, 2n);
                                var $460 = $461;
                            } else {
                                var self = ($454 === 51);
                                if (self) {
                                    var $463 = Parser$Reply$value$(_pst$9, 3n);
                                    var $462 = $463;
                                } else {
                                    var self = ($454 === 52);
                                    if (self) {
                                        var $465 = Parser$Reply$value$(_pst$9, 4n);
                                        var $464 = $465;
                                    } else {
                                        var self = ($454 === 53);
                                        if (self) {
                                            var $467 = Parser$Reply$value$(_pst$9, 5n);
                                            var $466 = $467;
                                        } else {
                                            var self = ($454 === 54);
                                            if (self) {
                                                var $469 = Parser$Reply$value$(_pst$9, 6n);
                                                var $468 = $469;
                                            } else {
                                                var self = ($454 === 55);
                                                if (self) {
                                                    var $471 = Parser$Reply$value$(_pst$9, 7n);
                                                    var $470 = $471;
                                                } else {
                                                    var self = ($454 === 56);
                                                    if (self) {
                                                        var $473 = Parser$Reply$value$(_pst$9, 8n);
                                                        var $472 = $473;
                                                    } else {
                                                        var self = ($454 === 57);
                                                        if (self) {
                                                            var $475 = Parser$Reply$value$(_pst$9, 9n);
                                                            var $474 = $475;
                                                        } else {
                                                            var self = ($454 === 97);
                                                            if (self) {
                                                                var $477 = Parser$Reply$value$(_pst$9, 10n);
                                                                var $476 = $477;
                                                            } else {
                                                                var self = ($454 === 98);
                                                                if (self) {
                                                                    var $479 = Parser$Reply$value$(_pst$9, 11n);
                                                                    var $478 = $479;
                                                                } else {
                                                                    var self = ($454 === 99);
                                                                    if (self) {
                                                                        var $481 = Parser$Reply$value$(_pst$9, 12n);
                                                                        var $480 = $481;
                                                                    } else {
                                                                        var self = ($454 === 100);
                                                                        if (self) {
                                                                            var $483 = Parser$Reply$value$(_pst$9, 13n);
                                                                            var $482 = $483;
                                                                        } else {
                                                                            var self = ($454 === 101);
                                                                            if (self) {
                                                                                var $485 = Parser$Reply$value$(_pst$9, 14n);
                                                                                var $484 = $485;
                                                                            } else {
                                                                                var self = ($454 === 102);
                                                                                if (self) {
                                                                                    var $487 = Parser$Reply$value$(_pst$9, 15n);
                                                                                    var $486 = $487;
                                                                                } else {
                                                                                    var self = ($454 === 65);
                                                                                    if (self) {
                                                                                        var $489 = Parser$Reply$value$(_pst$9, 10n);
                                                                                        var $488 = $489;
                                                                                    } else {
                                                                                        var self = ($454 === 66);
                                                                                        if (self) {
                                                                                            var $491 = Parser$Reply$value$(_pst$9, 11n);
                                                                                            var $490 = $491;
                                                                                        } else {
                                                                                            var self = ($454 === 67);
                                                                                            if (self) {
                                                                                                var $493 = Parser$Reply$value$(_pst$9, 12n);
                                                                                                var $492 = $493;
                                                                                            } else {
                                                                                                var self = ($454 === 68);
                                                                                                if (self) {
                                                                                                    var $495 = Parser$Reply$value$(_pst$9, 13n);
                                                                                                    var $494 = $495;
                                                                                                } else {
                                                                                                    var self = ($454 === 69);
                                                                                                    if (self) {
                                                                                                        var $497 = Parser$Reply$value$(_pst$9, 14n);
                                                                                                        var $496 = $497;
                                                                                                    } else {
                                                                                                        var self = ($454 === 70);
                                                                                                        if (self) {
                                                                                                            var $499 = Parser$Reply$value$(_pst$9, 15n);
                                                                                                            var $498 = $499;
                                                                                                        } else {
                                                                                                            var $500 = Parser$Reply$fail$($448, $449, $450, "Not a digit.");
                                                                                                            var $498 = $500;
                                                                                                        };
                                                                                                        var $496 = $498;
                                                                                                    };
                                                                                                    var $494 = $496;
                                                                                                };
                                                                                                var $492 = $494;
                                                                                            };
                                                                                            var $490 = $492;
                                                                                        };
                                                                                        var $488 = $490;
                                                                                    };
                                                                                    var $486 = $488;
                                                                                };
                                                                                var $484 = $486;
                                                                            };
                                                                            var $482 = $484;
                                                                        };
                                                                        var $480 = $482;
                                                                    };
                                                                    var $478 = $480;
                                                                };
                                                                var $476 = $478;
                                                            };
                                                            var $474 = $476;
                                                        };
                                                        var $472 = $474;
                                                    };
                                                    var $470 = $472;
                                                };
                                                var $468 = $470;
                                            };
                                            var $466 = $468;
                                        };
                                        var $464 = $466;
                                    };
                                    var $462 = $464;
                                };
                                var $460 = $462;
                            };
                            var $458 = $460;
                        };
                        var $456 = $458;
                    };
                    var $452 = $456;
                };
                var $446 = $452;
                break;
        };
        return $446;
    };
    const Parser$hex_digit = x0 => Parser$hex_digit$(x0);
    const Nat$add = a0 => a1 => (a0 + a1);
    const Nat$mul = a0 => a1 => (a0 * a1);

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
                        var $501 = self.head;
                        var $502 = self.tail;
                        var $503 = Nat$from_base$go$(_b$1, $502, (_b$1 * _p$3), (($501 * _p$3) + _res$4));
                        return $503;
                    case 'List.nil':
                        var $504 = _res$4;
                        return $504;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Nat$from_base$go = x0 => x1 => x2 => x3 => Nat$from_base$go$(x0, x1, x2, x3);

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
                        var $505 = self.head;
                        var $506 = self.tail;
                        var $507 = List$reverse$go$($506, List$cons$($505, _res$3));
                        return $507;
                    case 'List.nil':
                        var $508 = _res$3;
                        return $508;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const List$reverse$go = x0 => x1 => List$reverse$go$(x0, x1);

    function List$reverse$(_xs$2) {
        var $509 = List$reverse$go$(_xs$2, List$nil);
        return $509;
    };
    const List$reverse = x0 => List$reverse$(x0);

    function Nat$from_base$(_base$1, _ds$2) {
        var $510 = Nat$from_base$go$(_base$1, List$reverse$(_ds$2), 1n, 0n);
        return $510;
    };
    const Nat$from_base = x0 => x1 => Nat$from_base$(x0, x1);

    function Parser$hex_nat$(_pst$1) {
        var self = _pst$1;
        switch (self._) {
            case 'Parser.State.new':
                var $512 = self.err;
                var _reply$7 = Parser$text$("0x", _pst$1);
                var self = _reply$7;
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $514 = self.err;
                        var self = $512;
                        switch (self._) {
                            case 'Maybe.some':
                                var $516 = self.value;
                                var $517 = Parser$Reply$error$(Parser$Error$combine$($516, $514));
                                var $515 = $517;
                                break;
                            case 'Maybe.none':
                                var $518 = Parser$Reply$error$($514);
                                var $515 = $518;
                                break;
                        };
                        var $513 = $515;
                        break;
                    case 'Parser.Reply.value':
                        var $519 = self.pst;
                        var self = $519;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $521 = self.err;
                                var $522 = self.nam;
                                var $523 = self.ini;
                                var $524 = self.idx;
                                var $525 = self.str;
                                var _reply$pst$15 = Parser$State$new$(Parser$Error$maybe_combine$($512, $521), $522, $523, $524, $525);
                                var self = _reply$pst$15;
                                switch (self._) {
                                    case 'Parser.State.new':
                                        var $527 = self.err;
                                        var _reply$21 = Parser$many1$(Parser$hex_digit, _reply$pst$15);
                                        var self = _reply$21;
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $529 = self.err;
                                                var self = $527;
                                                switch (self._) {
                                                    case 'Maybe.some':
                                                        var $531 = self.value;
                                                        var $532 = Parser$Reply$error$(Parser$Error$combine$($531, $529));
                                                        var $530 = $532;
                                                        break;
                                                    case 'Maybe.none':
                                                        var $533 = Parser$Reply$error$($529);
                                                        var $530 = $533;
                                                        break;
                                                };
                                                var $528 = $530;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $534 = self.pst;
                                                var $535 = self.val;
                                                var self = $534;
                                                switch (self._) {
                                                    case 'Parser.State.new':
                                                        var $537 = self.err;
                                                        var $538 = self.nam;
                                                        var $539 = self.ini;
                                                        var $540 = self.idx;
                                                        var $541 = self.str;
                                                        var _reply$pst$29 = Parser$State$new$(Parser$Error$maybe_combine$($527, $537), $538, $539, $540, $541);
                                                        var $542 = Parser$Reply$value$(_reply$pst$29, Nat$from_base$(16n, $535));
                                                        var $536 = $542;
                                                        break;
                                                };
                                                var $528 = $536;
                                                break;
                                        };
                                        var $526 = $528;
                                        break;
                                };
                                var $520 = $526;
                                break;
                        };
                        var $513 = $520;
                        break;
                };
                var $511 = $513;
                break;
        };
        return $511;
    };
    const Parser$hex_nat = x0 => Parser$hex_nat$(x0);

    function Parser$digit$(_pst$1) {
        var self = _pst$1;
        switch (self._) {
            case 'Parser.State.new':
                var $544 = self.err;
                var $545 = self.nam;
                var $546 = self.ini;
                var $547 = self.idx;
                var $548 = self.str;
                var self = $548;
                if (self.length === 0) {
                    var $550 = Parser$Reply$fail$($545, $546, $547, "Not a digit.");
                    var $549 = $550;
                } else {
                    var $551 = self.charCodeAt(0);
                    var $552 = self.slice(1);
                    var _pst$9 = Parser$State$new$($544, $545, $546, Nat$succ$($547), $552);
                    var self = ($551 === 48);
                    if (self) {
                        var $554 = Parser$Reply$value$(_pst$9, 0n);
                        var $553 = $554;
                    } else {
                        var self = ($551 === 49);
                        if (self) {
                            var $556 = Parser$Reply$value$(_pst$9, 1n);
                            var $555 = $556;
                        } else {
                            var self = ($551 === 50);
                            if (self) {
                                var $558 = Parser$Reply$value$(_pst$9, 2n);
                                var $557 = $558;
                            } else {
                                var self = ($551 === 51);
                                if (self) {
                                    var $560 = Parser$Reply$value$(_pst$9, 3n);
                                    var $559 = $560;
                                } else {
                                    var self = ($551 === 52);
                                    if (self) {
                                        var $562 = Parser$Reply$value$(_pst$9, 4n);
                                        var $561 = $562;
                                    } else {
                                        var self = ($551 === 53);
                                        if (self) {
                                            var $564 = Parser$Reply$value$(_pst$9, 5n);
                                            var $563 = $564;
                                        } else {
                                            var self = ($551 === 54);
                                            if (self) {
                                                var $566 = Parser$Reply$value$(_pst$9, 6n);
                                                var $565 = $566;
                                            } else {
                                                var self = ($551 === 55);
                                                if (self) {
                                                    var $568 = Parser$Reply$value$(_pst$9, 7n);
                                                    var $567 = $568;
                                                } else {
                                                    var self = ($551 === 56);
                                                    if (self) {
                                                        var $570 = Parser$Reply$value$(_pst$9, 8n);
                                                        var $569 = $570;
                                                    } else {
                                                        var self = ($551 === 57);
                                                        if (self) {
                                                            var $572 = Parser$Reply$value$(_pst$9, 9n);
                                                            var $571 = $572;
                                                        } else {
                                                            var $573 = Parser$Reply$fail$($545, $546, $547, "Not a digit.");
                                                            var $571 = $573;
                                                        };
                                                        var $569 = $571;
                                                    };
                                                    var $567 = $569;
                                                };
                                                var $565 = $567;
                                            };
                                            var $563 = $565;
                                        };
                                        var $561 = $563;
                                    };
                                    var $559 = $561;
                                };
                                var $557 = $559;
                            };
                            var $555 = $557;
                        };
                        var $553 = $555;
                    };
                    var $549 = $553;
                };
                var $543 = $549;
                break;
        };
        return $543;
    };
    const Parser$digit = x0 => Parser$digit$(x0);

    function Parser$nat$(_pst$1) {
        var self = _pst$1;
        switch (self._) {
            case 'Parser.State.new':
                var $575 = self.err;
                var _reply$7 = Parser$many1$(Parser$digit, _pst$1);
                var self = _reply$7;
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $577 = self.err;
                        var self = $575;
                        switch (self._) {
                            case 'Maybe.some':
                                var $579 = self.value;
                                var $580 = Parser$Reply$error$(Parser$Error$combine$($579, $577));
                                var $578 = $580;
                                break;
                            case 'Maybe.none':
                                var $581 = Parser$Reply$error$($577);
                                var $578 = $581;
                                break;
                        };
                        var $576 = $578;
                        break;
                    case 'Parser.Reply.value':
                        var $582 = self.pst;
                        var $583 = self.val;
                        var self = $582;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $585 = self.err;
                                var $586 = self.nam;
                                var $587 = self.ini;
                                var $588 = self.idx;
                                var $589 = self.str;
                                var _reply$pst$15 = Parser$State$new$(Parser$Error$maybe_combine$($575, $585), $586, $587, $588, $589);
                                var $590 = Parser$Reply$value$(_reply$pst$15, Nat$from_base$(10n, $583));
                                var $584 = $590;
                                break;
                        };
                        var $576 = $584;
                        break;
                };
                var $574 = $576;
                break;
        };
        return $574;
    };
    const Parser$nat = x0 => Parser$nat$(x0);

    function Parser$maybe$(_parse$2, _pst$3) {
        var self = _pst$3;
        switch (self._) {
            case 'Parser.State.new':
                var self = _parse$2(_pst$3);
                switch (self._) {
                    case 'Parser.Reply.value':
                        var $593 = self.pst;
                        var $594 = self.val;
                        var $595 = Parser$Reply$value$($593, Maybe$some$($594));
                        var $592 = $595;
                        break;
                    case 'Parser.Reply.error':
                        var $596 = Parser$Reply$value$(_pst$3, Maybe$none);
                        var $592 = $596;
                        break;
                };
                var $591 = $592;
                break;
        };
        return $591;
    };
    const Parser$maybe = x0 => x1 => Parser$maybe$(x0, x1);

    function Parser$Number$new$(_sign$1, _numb$2, _frac$3) {
        var $597 = ({
            _: 'Parser.Number.new',
            'sign': _sign$1,
            'numb': _numb$2,
            'frac': _frac$3
        });
        return $597;
    };
    const Parser$Number$new = x0 => x1 => x2 => Parser$Number$new$(x0, x1, x2);

    function Parser$num$(_pst$1) {
        var self = _pst$1;
        switch (self._) {
            case 'Parser.State.new':
                var $599 = self.err;
                var _reply$7 = Parser$choice$(List$cons$((_pst$7 => {
                    var self = _pst$7;
                    switch (self._) {
                        case 'Parser.State.new':
                            var $602 = self.err;
                            var _reply$13 = Parser$text$("+", _pst$7);
                            var self = _reply$13;
                            switch (self._) {
                                case 'Parser.Reply.error':
                                    var $604 = self.err;
                                    var self = $602;
                                    switch (self._) {
                                        case 'Maybe.some':
                                            var $606 = self.value;
                                            var $607 = Parser$Reply$error$(Parser$Error$combine$($606, $604));
                                            var $605 = $607;
                                            break;
                                        case 'Maybe.none':
                                            var $608 = Parser$Reply$error$($604);
                                            var $605 = $608;
                                            break;
                                    };
                                    var $603 = $605;
                                    break;
                                case 'Parser.Reply.value':
                                    var $609 = self.pst;
                                    var self = $609;
                                    switch (self._) {
                                        case 'Parser.State.new':
                                            var $611 = self.err;
                                            var $612 = self.nam;
                                            var $613 = self.ini;
                                            var $614 = self.idx;
                                            var $615 = self.str;
                                            var _reply$pst$21 = Parser$State$new$(Parser$Error$maybe_combine$($602, $611), $612, $613, $614, $615);
                                            var $616 = Parser$Reply$value$(_reply$pst$21, Maybe$some$(Bool$true));
                                            var $610 = $616;
                                            break;
                                    };
                                    var $603 = $610;
                                    break;
                            };
                            var $601 = $603;
                            break;
                    };
                    return $601;
                }), List$cons$((_pst$7 => {
                    var self = _pst$7;
                    switch (self._) {
                        case 'Parser.State.new':
                            var $618 = self.err;
                            var _reply$13 = Parser$text$("-", _pst$7);
                            var self = _reply$13;
                            switch (self._) {
                                case 'Parser.Reply.error':
                                    var $620 = self.err;
                                    var self = $618;
                                    switch (self._) {
                                        case 'Maybe.some':
                                            var $622 = self.value;
                                            var $623 = Parser$Reply$error$(Parser$Error$combine$($622, $620));
                                            var $621 = $623;
                                            break;
                                        case 'Maybe.none':
                                            var $624 = Parser$Reply$error$($620);
                                            var $621 = $624;
                                            break;
                                    };
                                    var $619 = $621;
                                    break;
                                case 'Parser.Reply.value':
                                    var $625 = self.pst;
                                    var self = $625;
                                    switch (self._) {
                                        case 'Parser.State.new':
                                            var $627 = self.err;
                                            var $628 = self.nam;
                                            var $629 = self.ini;
                                            var $630 = self.idx;
                                            var $631 = self.str;
                                            var _reply$pst$21 = Parser$State$new$(Parser$Error$maybe_combine$($618, $627), $628, $629, $630, $631);
                                            var $632 = Parser$Reply$value$(_reply$pst$21, Maybe$some$(Bool$false));
                                            var $626 = $632;
                                            break;
                                    };
                                    var $619 = $626;
                                    break;
                            };
                            var $617 = $619;
                            break;
                    };
                    return $617;
                }), List$cons$((_pst$7 => {
                    var $633 = Parser$Reply$value$(_pst$7, Maybe$none);
                    return $633;
                }), List$nil))), _pst$1);
                var self = _reply$7;
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $634 = self.err;
                        var self = $599;
                        switch (self._) {
                            case 'Maybe.some':
                                var $636 = self.value;
                                var $637 = Parser$Reply$error$(Parser$Error$combine$($636, $634));
                                var $635 = $637;
                                break;
                            case 'Maybe.none':
                                var $638 = Parser$Reply$error$($634);
                                var $635 = $638;
                                break;
                        };
                        var $600 = $635;
                        break;
                    case 'Parser.Reply.value':
                        var $639 = self.pst;
                        var $640 = self.val;
                        var self = $639;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $642 = self.err;
                                var $643 = self.nam;
                                var $644 = self.ini;
                                var $645 = self.idx;
                                var $646 = self.str;
                                var _reply$pst$15 = Parser$State$new$(Parser$Error$maybe_combine$($599, $642), $643, $644, $645, $646);
                                var self = _reply$pst$15;
                                switch (self._) {
                                    case 'Parser.State.new':
                                        var $648 = self.err;
                                        var _reply$21 = Parser$choice$(List$cons$(Parser$hex_nat, List$cons$(Parser$nat, List$nil)), _reply$pst$15);
                                        var self = _reply$21;
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $650 = self.err;
                                                var self = $648;
                                                switch (self._) {
                                                    case 'Maybe.some':
                                                        var $652 = self.value;
                                                        var $653 = Parser$Reply$error$(Parser$Error$combine$($652, $650));
                                                        var $651 = $653;
                                                        break;
                                                    case 'Maybe.none':
                                                        var $654 = Parser$Reply$error$($650);
                                                        var $651 = $654;
                                                        break;
                                                };
                                                var $649 = $651;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $655 = self.pst;
                                                var $656 = self.val;
                                                var self = $655;
                                                switch (self._) {
                                                    case 'Parser.State.new':
                                                        var $658 = self.err;
                                                        var $659 = self.nam;
                                                        var $660 = self.ini;
                                                        var $661 = self.idx;
                                                        var $662 = self.str;
                                                        var _reply$pst$29 = Parser$State$new$(Parser$Error$maybe_combine$($648, $658), $659, $660, $661, $662);
                                                        var self = _reply$pst$29;
                                                        switch (self._) {
                                                            case 'Parser.State.new':
                                                                var $664 = self.err;
                                                                var self = _reply$pst$29;
                                                                switch (self._) {
                                                                    case 'Parser.State.new':
                                                                        var $666 = self.err;
                                                                        var _reply$40 = Parser$maybe$(Parser$text("."), _reply$pst$29);
                                                                        var self = _reply$40;
                                                                        switch (self._) {
                                                                            case 'Parser.Reply.error':
                                                                                var $668 = self.err;
                                                                                var self = $666;
                                                                                switch (self._) {
                                                                                    case 'Maybe.some':
                                                                                        var $670 = self.value;
                                                                                        var $671 = Parser$Reply$error$(Parser$Error$combine$($670, $668));
                                                                                        var $669 = $671;
                                                                                        break;
                                                                                    case 'Maybe.none':
                                                                                        var $672 = Parser$Reply$error$($668);
                                                                                        var $669 = $672;
                                                                                        break;
                                                                                };
                                                                                var $667 = $669;
                                                                                break;
                                                                            case 'Parser.Reply.value':
                                                                                var $673 = self.pst;
                                                                                var self = $673;
                                                                                switch (self._) {
                                                                                    case 'Parser.State.new':
                                                                                        var $675 = self.err;
                                                                                        var $676 = self.nam;
                                                                                        var $677 = self.ini;
                                                                                        var $678 = self.idx;
                                                                                        var $679 = self.str;
                                                                                        var _reply$pst$48 = Parser$State$new$(Parser$Error$maybe_combine$($666, $675), $676, $677, $678, $679);
                                                                                        var self = _reply$pst$48;
                                                                                        switch (self._) {
                                                                                            case 'Parser.State.new':
                                                                                                var $681 = self.err;
                                                                                                var _reply$54 = Parser$maybe$(Parser$nat, _reply$pst$48);
                                                                                                var self = _reply$54;
                                                                                                switch (self._) {
                                                                                                    case 'Parser.Reply.error':
                                                                                                        var $683 = self.err;
                                                                                                        var self = $681;
                                                                                                        switch (self._) {
                                                                                                            case 'Maybe.some':
                                                                                                                var $685 = self.value;
                                                                                                                var $686 = Parser$Reply$error$(Parser$Error$combine$($685, $683));
                                                                                                                var $684 = $686;
                                                                                                                break;
                                                                                                            case 'Maybe.none':
                                                                                                                var $687 = Parser$Reply$error$($683);
                                                                                                                var $684 = $687;
                                                                                                                break;
                                                                                                        };
                                                                                                        var $682 = $684;
                                                                                                        break;
                                                                                                    case 'Parser.Reply.value':
                                                                                                        var $688 = self.pst;
                                                                                                        var $689 = self.val;
                                                                                                        var self = $688;
                                                                                                        switch (self._) {
                                                                                                            case 'Parser.State.new':
                                                                                                                var $691 = self.err;
                                                                                                                var $692 = self.nam;
                                                                                                                var $693 = self.ini;
                                                                                                                var $694 = self.idx;
                                                                                                                var $695 = self.str;
                                                                                                                var _reply$pst$62 = Parser$State$new$(Parser$Error$maybe_combine$($681, $691), $692, $693, $694, $695);
                                                                                                                var $696 = Parser$Reply$value$(_reply$pst$62, $689);
                                                                                                                var $690 = $696;
                                                                                                                break;
                                                                                                        };
                                                                                                        var $682 = $690;
                                                                                                        break;
                                                                                                };
                                                                                                var $680 = $682;
                                                                                                break;
                                                                                        };
                                                                                        var $674 = $680;
                                                                                        break;
                                                                                };
                                                                                var $667 = $674;
                                                                                break;
                                                                        };
                                                                        var _reply$35 = $667;
                                                                        break;
                                                                };
                                                                var self = _reply$35;
                                                                switch (self._) {
                                                                    case 'Parser.Reply.error':
                                                                        var $697 = self.err;
                                                                        var self = $664;
                                                                        switch (self._) {
                                                                            case 'Maybe.some':
                                                                                var $699 = self.value;
                                                                                var $700 = Parser$Reply$error$(Parser$Error$combine$($699, $697));
                                                                                var $698 = $700;
                                                                                break;
                                                                            case 'Maybe.none':
                                                                                var $701 = Parser$Reply$error$($697);
                                                                                var $698 = $701;
                                                                                break;
                                                                        };
                                                                        var $665 = $698;
                                                                        break;
                                                                    case 'Parser.Reply.value':
                                                                        var $702 = self.pst;
                                                                        var $703 = self.val;
                                                                        var self = $702;
                                                                        switch (self._) {
                                                                            case 'Parser.State.new':
                                                                                var $705 = self.err;
                                                                                var $706 = self.nam;
                                                                                var $707 = self.ini;
                                                                                var $708 = self.idx;
                                                                                var $709 = self.str;
                                                                                var _reply$pst$43 = Parser$State$new$(Parser$Error$maybe_combine$($664, $705), $706, $707, $708, $709);
                                                                                var $710 = Parser$Reply$value$(_reply$pst$43, Parser$Number$new$($640, $656, $703));
                                                                                var $704 = $710;
                                                                                break;
                                                                        };
                                                                        var $665 = $704;
                                                                        break;
                                                                };
                                                                var $663 = $665;
                                                                break;
                                                        };
                                                        var $657 = $663;
                                                        break;
                                                };
                                                var $649 = $657;
                                                break;
                                        };
                                        var $647 = $649;
                                        break;
                                };
                                var $641 = $647;
                                break;
                        };
                        var $600 = $641;
                        break;
                };
                var $598 = $600;
                break;
        };
        return $598;
    };
    const Parser$num = x0 => Parser$num$(x0);
    const Nat$to_i32 = a0 => (Number(a0));
    const I32$read = a0 => (parseInt(a0));

    function List$map$(_f$3, _as$4) {
        var self = _as$4;
        switch (self._) {
            case 'List.cons':
                var $712 = self.head;
                var $713 = self.tail;
                var $714 = List$cons$(_f$3($712), List$map$(_f$3, $713));
                var $711 = $714;
                break;
            case 'List.nil':
                var $715 = List$nil;
                var $711 = $715;
                break;
        };
        return $711;
    };
    const List$map = x0 => x1 => List$map$(x0, x1);

    function Word$subber$(_a$2, _b$3, _c$4) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $717 = self.pred;
                var $718 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $720 = self.pred;
                            var $721 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $723 = Word$i$(Word$subber$(_a$pred$10, $720, Bool$true));
                                    var $722 = $723;
                                } else {
                                    var $724 = Word$o$(Word$subber$(_a$pred$10, $720, Bool$false));
                                    var $722 = $724;
                                };
                                return $722;
                            });
                            var $719 = $721;
                            break;
                        case 'Word.i':
                            var $725 = self.pred;
                            var $726 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $728 = Word$o$(Word$subber$(_a$pred$10, $725, Bool$true));
                                    var $727 = $728;
                                } else {
                                    var $729 = Word$i$(Word$subber$(_a$pred$10, $725, Bool$true));
                                    var $727 = $729;
                                };
                                return $727;
                            });
                            var $719 = $726;
                            break;
                        case 'Word.e':
                            var $730 = (_a$pred$8 => {
                                var $731 = Word$e;
                                return $731;
                            });
                            var $719 = $730;
                            break;
                    };
                    var $719 = $719($717);
                    return $719;
                });
                var $716 = $718;
                break;
            case 'Word.i':
                var $732 = self.pred;
                var $733 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $735 = self.pred;
                            var $736 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $738 = Word$o$(Word$subber$(_a$pred$10, $735, Bool$false));
                                    var $737 = $738;
                                } else {
                                    var $739 = Word$i$(Word$subber$(_a$pred$10, $735, Bool$false));
                                    var $737 = $739;
                                };
                                return $737;
                            });
                            var $734 = $736;
                            break;
                        case 'Word.i':
                            var $740 = self.pred;
                            var $741 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $743 = Word$i$(Word$subber$(_a$pred$10, $740, Bool$true));
                                    var $742 = $743;
                                } else {
                                    var $744 = Word$o$(Word$subber$(_a$pred$10, $740, Bool$false));
                                    var $742 = $744;
                                };
                                return $742;
                            });
                            var $734 = $741;
                            break;
                        case 'Word.e':
                            var $745 = (_a$pred$8 => {
                                var $746 = Word$e;
                                return $746;
                            });
                            var $734 = $745;
                            break;
                    };
                    var $734 = $734($732);
                    return $734;
                });
                var $716 = $733;
                break;
            case 'Word.e':
                var $747 = (_b$5 => {
                    var $748 = Word$e;
                    return $748;
                });
                var $716 = $747;
                break;
        };
        var $716 = $716(_b$3);
        return $716;
    };
    const Word$subber = x0 => x1 => x2 => Word$subber$(x0, x1, x2);

    function Word$sub$(_a$2, _b$3) {
        var $749 = Word$subber$(_a$2, _b$3, Bool$false);
        return $749;
    };
    const Word$sub = x0 => x1 => Word$sub$(x0, x1);
    const I32$sub = a0 => a1 => ((a0 - a1) >> 0);
    const App$KL$Constants$board_size = 7;
    const I32$add = a0 => a1 => ((a0 + a1) >> 0);

    function App$KL$Game$Stage$Draft$draw$tiles$get_pos$offset$(_team$1, _coord$2) {
        var self = _coord$2;
        switch (self._) {
            case 'Hexagonal.Axial.new':
                var $751 = self.i;
                var $752 = self.j;
                var _map_size$5 = ((App$KL$Constants$board_size - 1) >> 0);
                var self = _team$1;
                switch (self._) {
                    case 'App.KL.Game.Team.blue':
                        var $754 = Hexagonal$Axial$new$((($751 - _map_size$5) >> 0), $752);
                        var $753 = $754;
                        break;
                    case 'App.KL.Game.Team.red':
                        var $755 = Hexagonal$Axial$new$((($751 + _map_size$5) >> 0), $752);
                        var $753 = $755;
                        break;
                    case 'App.KL.Game.Team.neutral':
                        var $756 = _coord$2;
                        var $753 = $756;
                        break;
                };
                var $750 = $753;
                break;
        };
        return $750;
    };
    const App$KL$Game$Stage$Draft$draw$tiles$get_pos$offset = x0 => x1 => App$KL$Game$Stage$Draft$draw$tiles$get_pos$offset$(x0, x1);
    const App$KL$Game$Team$blue = ({
        _: 'App.KL.Game.Team.blue'
    });
    const App$KL$Game$Team$red = ({
        _: 'App.KL.Game.Team.red'
    });

    function App$KL$Game$Stage$Draft$draw$tiles$get_pos$(_team$1) {
        var _a$2 = Hexagonal$Axial$new$(1, (-2));
        var _b$3 = Hexagonal$Axial$new$(0, (-1));
        var _c$4 = Hexagonal$Axial$new$(1, (-1));
        var _d$5 = Hexagonal$Axial$new$(0, 0);
        var _e$6 = Hexagonal$Axial$new$((-1), 1);
        var _f$7 = Hexagonal$Axial$new$(0, 1);
        var _g$8 = Hexagonal$Axial$new$((-1), 2);
        var _one$9 = Hexagonal$Axial$new$((-1), 0);
        var _two$10 = Hexagonal$Axial$new$(1, 0);
        var self = _team$1;
        switch (self._) {
            case 'App.KL.Game.Team.blue':
                var $758 = List$map$(App$KL$Game$Stage$Draft$draw$tiles$get_pos$offset(App$KL$Game$Team$blue), List$cons$(_a$2, List$cons$(_b$3, List$cons$(_c$4, List$cons$(_d$5, List$cons$(_e$6, List$cons$(_f$7, List$cons$(_g$8, List$cons$(_one$9, List$nil)))))))));
                var $757 = $758;
                break;
            case 'App.KL.Game.Team.red':
                var $759 = List$map$(App$KL$Game$Stage$Draft$draw$tiles$get_pos$offset(App$KL$Game$Team$red), List$cons$(_a$2, List$cons$(_b$3, List$cons$(_c$4, List$cons$(_d$5, List$cons$(_e$6, List$cons$(_f$7, List$cons$(_g$8, List$cons$(_two$10, List$nil)))))))));
                var $757 = $759;
                break;
            case 'App.KL.Game.Team.neutral':
                var $760 = List$nil;
                var $757 = $760;
                break;
        };
        return $757;
    };
    const App$KL$Game$Stage$Draft$draw$tiles$get_pos = x0 => App$KL$Game$Stage$Draft$draw$tiles$get_pos$(x0);
    const List$for = a0 => a1 => a2 => (list_for(a0)(a1)(a2));
    const Bool$and = a0 => a1 => (a0 && a1);
    const I32$eql = a0 => a1 => (a0 === a1);

    function Hexagonal$Axial$eql$(_a$1, _b$2) {
        var self = _a$1;
        switch (self._) {
            case 'Hexagonal.Axial.new':
                var $762 = self.i;
                var $763 = self.j;
                var self = _b$2;
                switch (self._) {
                    case 'Hexagonal.Axial.new':
                        var $765 = self.i;
                        var $766 = self.j;
                        var $767 = (($762 === $765) && ($763 === $766));
                        var $764 = $767;
                        break;
                };
                var $761 = $764;
                break;
        };
        return $761;
    };
    const Hexagonal$Axial$eql = x0 => x1 => Hexagonal$Axial$eql$(x0, x1);

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
                        var $768 = self.head;
                        var $769 = self.tail;
                        var self = _cond$2($768);
                        if (self) {
                            var $771 = Maybe$some$($768);
                            var $770 = $771;
                        } else {
                            var $772 = List$find$(_cond$2, $769);
                            var $770 = $772;
                        };
                        return $770;
                    case 'List.nil':
                        var $773 = Maybe$none;
                        return $773;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const List$find = x0 => x1 => List$find$(x0, x1);

    function BBL$foldr_with_key$go$(_f$4, _z$5, _map$6) {
        var self = _map$6;
        switch (self._) {
            case 'BBL.bin':
                var $775 = self.key;
                var $776 = self.val;
                var $777 = self.left;
                var $778 = self.right;
                var _right_folded$12 = BBL$foldr_with_key$go$(_f$4, _z$5, $778);
                var _new_z$13 = _f$4($775)($776)(_right_folded$12);
                var $779 = BBL$foldr_with_key$go$(_f$4, _new_z$13, $777);
                var $774 = $779;
                break;
            case 'BBL.tip':
                var $780 = _z$5;
                var $774 = $780;
                break;
        };
        return $774;
    };
    const BBL$foldr_with_key$go = x0 => x1 => x2 => BBL$foldr_with_key$go$(x0, x1, x2);

    function BBL$foldr_with_key$(_f$4, _z$5, _map$6) {
        var $781 = BBL$foldr_with_key$go$(_f$4, _z$5, _map$6);
        return $781;
    };
    const BBL$foldr_with_key = x0 => x1 => x2 => BBL$foldr_with_key$(x0, x1, x2);

    function BBL$to_list$(_map$3) {
        var $782 = BBL$foldr_with_key$((_k$4 => _v$5 => _kvs$6 => {
            var $783 = List$cons$(Pair$new$(_k$4, _v$5), _kvs$6);
            return $783;
        }), List$nil, _map$3);
        return $782;
    };
    const BBL$to_list = x0 => BBL$to_list$(x0);

    function Map$to_list$(_xs$2) {
        var $784 = BBL$to_list$(_xs$2);
        return $784;
    };
    const Map$to_list = x0 => Map$to_list$(x0);

    function App$KL$Game$Stage$Draft$draw$get_player_at$(_players$1, _coord$2) {
        var _fun$3 = (_x$3 => {
            var self = _x$3;
            switch (self._) {
                case 'Pair.new':
                    var $787 = self.snd;
                    var self = $787;
                    switch (self._) {
                        case 'App.KL.Game.Player.new':
                            var $789 = self.init_pos;
                            var $790 = $789;
                            var _pos$6 = $790;
                            break;
                    };
                    var self = _pos$6;
                    switch (self._) {
                        case 'Maybe.some':
                            var $791 = self.value;
                            var $792 = Hexagonal$Axial$eql$($791, _coord$2);
                            var $788 = $792;
                            break;
                        case 'Maybe.none':
                            var $793 = Bool$false;
                            var $788 = $793;
                            break;
                    };
                    var $786 = $788;
                    break;
            };
            return $786;
        });
        var $785 = List$find$(_fun$3, Map$to_list$(_players$1));
        return $785;
    };
    const App$KL$Game$Stage$Draft$draw$get_player_at = x0 => x1 => App$KL$Game$Stage$Draft$draw$get_player_at$(x0, x1);
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
        var $794 = (((_n$1) >>> 0));
        return $794;
    };
    const I32$to_u32 = x0 => I32$to_u32$(x0);

    function Word$fold$(_nil$3, _w0$4, _w1$5, _word$6) {
        var self = _word$6;
        switch (self._) {
            case 'Word.o':
                var $796 = self.pred;
                var $797 = _w0$4(Word$fold$(_nil$3, _w0$4, _w1$5, $796));
                var $795 = $797;
                break;
            case 'Word.i':
                var $798 = self.pred;
                var $799 = _w1$5(Word$fold$(_nil$3, _w0$4, _w1$5, $798));
                var $795 = $799;
                break;
            case 'Word.e':
                var $800 = _nil$3;
                var $795 = $800;
                break;
        };
        return $795;
    };
    const Word$fold = x0 => x1 => x2 => x3 => Word$fold$(x0, x1, x2, x3);

    function Word$to_nat$(_word$2) {
        var $801 = Word$fold$(0n, a1 => (2n * a1), (_x$4 => {
            var $802 = Nat$succ$((2n * _x$4));
            return $802;
        }), _word$2);
        return $801;
    };
    const Word$to_nat = x0 => Word$to_nat$(x0);
    const U32$to_nat = a0 => (BigInt(a0));

    function Hexagonal$Axial$to_nat$(_coord$1) {
        var self = _coord$1;
        switch (self._) {
            case 'Hexagonal.Axial.new':
                var $804 = self.i;
                var $805 = self.j;
                var _i$4 = (($804 + 100) >> 0);
                var _i$5 = ((_i$4 * 1000) >> 0);
                var _i$6 = I32$to_u32$(_i$5);
                var _j$7 = (($805 + 100) >> 0);
                var _j$8 = I32$to_u32$(_j$7);
                var _sum$9 = ((_i$6 + _j$8) >>> 0);
                var $806 = (BigInt(_sum$9));
                var $803 = $806;
                break;
        };
        return $803;
    };
    const Hexagonal$Axial$to_nat = x0 => Hexagonal$Axial$to_nat$(x0);

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
    const App$KL$Constants$draft_hexagon_radius = 8;
    const F64$div = a0 => a1 => (a0 / a1);
    const F64$parse = a0 => (parseFloat(a0));
    const F64$read = a0 => (parseFloat(a0));
    const F64$add = a0 => a1 => (a0 + a1);
    const F64$mul = a0 => a1 => (a0 * a1);
    const F64$make = a0 => a1 => a2 => (f64_make(a0, a1, a2));
    const F64$from_nat = a0 => (Number(a0));

    function App$KL$Game$Stage$Draft$draw$tiles$to_xy$(_coord$1, _team$2) {
        var self = _team$2;
        switch (self._) {
            case 'App.KL.Game.Team.blue':
                var $808 = ((App$KL$Constants$board_size - 1) >> 0);
                var _i_offset$3 = $808;
                break;
            case 'App.KL.Game.Team.red':
                var $809 = ((-((App$KL$Constants$board_size - 1) >> 0)));
                var _i_offset$3 = $809;
                break;
            case 'App.KL.Game.Team.neutral':
                var $810 = 0;
                var _i_offset$3 = $810;
                break;
        };
        var self = _coord$1;
        switch (self._) {
            case 'Hexagonal.Axial.new':
                var $811 = self.i;
                var $812 = self.j;
                var _i$6 = (($811 + _i_offset$3) >> 0);
                var _j$7 = $812;
                var _i$8 = (_i$6);
                var _j$9 = (_j$7);
                var _int_rad$10 = (App$KL$Constants$draft_hexagon_radius);
                var _hlf$11 = (_int_rad$10 / (+2.0));
                var _int_screen_center_x$12 = (50.0);
                var _int_screen_center_y$13 = (50.0);
                var _cx$14 = (_int_screen_center_x$12 + (_j$9 * _int_rad$10));
                var _cx$15 = (_cx$14 + (_i$8 * (_int_rad$10 * (Number(2n)))));
                var _cy$16 = (_int_screen_center_y$13 + (_j$9 * (_hlf$11 * (Number(3n)))));
                var _cx$17 = ((_cx$15 >>> 0));
                var _y$18 = (_cy$16 + (0.5));
                var _cy$19 = ((_cy$16 >>> 0));
                var $813 = Pair$new$(_cx$17, _cy$19);
                var $807 = $813;
                break;
        };
        return $807;
    };
    const App$KL$Game$Stage$Draft$draw$tiles$to_xy = x0 => x1 => App$KL$Game$Stage$Draft$draw$tiles$to_xy$(x0, x1);

    function Either$(_A$1, _B$2) {
        var $814 = null;
        return $814;
    };
    const Either = x0 => x1 => Either$(x0, x1);

    function Either$left$(_value$3) {
        var $815 = ({
            _: 'Either.left',
            'value': _value$3
        });
        return $815;
    };
    const Either$left = x0 => Either$left$(x0);

    function Either$right$(_value$3) {
        var $816 = ({
            _: 'Either.right',
            'value': _value$3
        });
        return $816;
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
                    var $817 = Either$left$(_n$1);
                    return $817;
                } else {
                    var $818 = (self - 1n);
                    var self = _n$1;
                    if (self === 0n) {
                        var $820 = Either$right$(Nat$succ$($818));
                        var $819 = $820;
                    } else {
                        var $821 = (self - 1n);
                        var $822 = Nat$sub_rem$($821, $818);
                        var $819 = $822;
                    };
                    return $819;
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
                        var $823 = self.value;
                        var $824 = Nat$div_mod$go$($823, _m$2, Nat$succ$(_d$3));
                        return $824;
                    case 'Either.right':
                        var $825 = Pair$new$(_d$3, _n$1);
                        return $825;
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
                        var $826 = self.fst;
                        var $827 = self.snd;
                        var self = $826;
                        if (self === 0n) {
                            var $829 = List$cons$($827, _res$3);
                            var $828 = $829;
                        } else {
                            var $830 = (self - 1n);
                            var $831 = Nat$to_base$go$(_base$1, $826, List$cons$($827, _res$3));
                            var $828 = $831;
                        };
                        return $828;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Nat$to_base$go = x0 => x1 => x2 => Nat$to_base$go$(x0, x1, x2);

    function Nat$to_base$(_base$1, _nat$2) {
        var $832 = Nat$to_base$go$(_base$1, _nat$2, List$nil);
        return $832;
    };
    const Nat$to_base = x0 => x1 => Nat$to_base$(x0, x1);

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
                    var $833 = Nat$mod$go$(_n$1, _r$3, _m$2);
                    return $833;
                } else {
                    var $834 = (self - 1n);
                    var self = _n$1;
                    if (self === 0n) {
                        var $836 = _r$3;
                        var $835 = $836;
                    } else {
                        var $837 = (self - 1n);
                        var $838 = Nat$mod$go$($837, $834, Nat$succ$(_r$3));
                        var $835 = $838;
                    };
                    return $835;
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
                        var $839 = self.head;
                        var $840 = self.tail;
                        var self = _index$2;
                        if (self === 0n) {
                            var $842 = Maybe$some$($839);
                            var $841 = $842;
                        } else {
                            var $843 = (self - 1n);
                            var $844 = List$at$($843, $840);
                            var $841 = $844;
                        };
                        return $841;
                    case 'List.nil':
                        var $845 = Maybe$none;
                        return $845;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const List$at = x0 => x1 => List$at$(x0, x1);

    function Nat$show_digit$(_base$1, _n$2) {
        var _m$3 = (_n$2 % _base$1);
        var _base64$4 = List$cons$(48, List$cons$(49, List$cons$(50, List$cons$(51, List$cons$(52, List$cons$(53, List$cons$(54, List$cons$(55, List$cons$(56, List$cons$(57, List$cons$(97, List$cons$(98, List$cons$(99, List$cons$(100, List$cons$(101, List$cons$(102, List$cons$(103, List$cons$(104, List$cons$(105, List$cons$(106, List$cons$(107, List$cons$(108, List$cons$(109, List$cons$(110, List$cons$(111, List$cons$(112, List$cons$(113, List$cons$(114, List$cons$(115, List$cons$(116, List$cons$(117, List$cons$(118, List$cons$(119, List$cons$(120, List$cons$(121, List$cons$(122, List$cons$(65, List$cons$(66, List$cons$(67, List$cons$(68, List$cons$(69, List$cons$(70, List$cons$(71, List$cons$(72, List$cons$(73, List$cons$(74, List$cons$(75, List$cons$(76, List$cons$(77, List$cons$(78, List$cons$(79, List$cons$(80, List$cons$(81, List$cons$(82, List$cons$(83, List$cons$(84, List$cons$(85, List$cons$(86, List$cons$(87, List$cons$(88, List$cons$(89, List$cons$(90, List$cons$(43, List$cons$(47, List$nil))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))));
        var self = ((_base$1 > 0n) && (_base$1 <= 64n));
        if (self) {
            var self = List$at$(_m$3, _base64$4);
            switch (self._) {
                case 'Maybe.some':
                    var $848 = self.value;
                    var $849 = $848;
                    var $847 = $849;
                    break;
                case 'Maybe.none':
                    var $850 = 35;
                    var $847 = $850;
                    break;
            };
            var $846 = $847;
        } else {
            var $851 = 35;
            var $846 = $851;
        };
        return $846;
    };
    const Nat$show_digit = x0 => x1 => Nat$show_digit$(x0, x1);

    function Nat$to_string_base$(_base$1, _nat$2) {
        var $852 = List$fold$(Nat$to_base$(_base$1, _nat$2), String$nil, (_n$3 => _str$4 => {
            var $853 = String$cons$(Nat$show_digit$(_base$1, _n$3), _str$4);
            return $853;
        }));
        return $852;
    };
    const Nat$to_string_base = x0 => x1 => Nat$to_string_base$(x0, x1);

    function Nat$show$(_n$1) {
        var $854 = Nat$to_string_base$(10n, _n$1);
        return $854;
    };
    const Nat$show = x0 => Nat$show$(x0);
    const U32$sub = a0 => a1 => ((a0 - a1) >>> 0);
    const String$eql = a0 => a1 => (a0 === a1);

    function App$KL$Game$Stage$Draft$draw$tiles$go$(_team$1, _coord$2, _id$3, _user$4) {
        var _nat$5 = Hexagonal$Axial$to_nat$(_coord$2);
        var self = App$KL$Game$Stage$Draft$draw$tiles$to_xy$(_coord$2, _team$1);
        switch (self._) {
            case 'Pair.new':
                var $856 = self.fst;
                var $857 = self.snd;
                var _top$8 = (Nat$show$((BigInt($857))) + "%");
                var _left$9 = (Nat$show$((BigInt($856))) + "%");
                var _size$10 = (Nat$show$((BigInt(((((App$KL$Constants$draft_hexagon_radius * 2) >>> 0) - 1) >>> 0)))) + "%");
                var _margin$11 = Nat$show$((BigInt(App$KL$Constants$draft_hexagon_radius)));
                var self = _id$3;
                switch (self._) {
                    case 'Maybe.some':
                        var $859 = self.value;
                        var self = (_user$4 === $859);
                        if (self) {
                            var $861 = "#0FB735";
                            var $860 = $861;
                        } else {
                            var $862 = "#4B97E2";
                            var $860 = $862;
                        };
                        var _color$12 = $860;
                        break;
                    case 'Maybe.none':
                        var $863 = "#B97A57";
                        var _color$12 = $863;
                        break;
                };
                var $858 = DOM$node$("div", Map$from_list$(List$cons$(Pair$new$("id", ("C" + Nat$show$(_nat$5))), List$nil)), Map$from_list$(List$cons$(Pair$new$("width", _size$10), List$cons$(Pair$new$("height", _size$10), List$cons$(Pair$new$("margin", ("-" + (_margin$11 + ("% 0px 0px -" + (_margin$11 + "%"))))), List$cons$(Pair$new$("position", "absolute"), List$cons$(Pair$new$("top", _top$8), List$cons$(Pair$new$("left", _left$9), List$cons$(Pair$new$("clip-path", "polygon(0% 25%, 0% 75%, 50% 100%, 100% 75%, 100% 25%, 50% 0%)"), List$cons$(Pair$new$("background", _color$12), List$nil))))))))), List$nil);
                var $855 = $858;
                break;
        };
        return $855;
    };
    const App$KL$Game$Stage$Draft$draw$tiles$go = x0 => x1 => x2 => x3 => App$KL$Game$Stage$Draft$draw$tiles$go$(x0, x1, x2, x3);

    function App$KL$Game$Stage$Draft$draw$tiles$(_players$1, _user$2) {
        var _team$3 = Maybe$default$(App$KL$Game$Stage$Draft$to_team$(_players$1, _user$2), App$KL$Game$Team$neutral);
        var _coords$4 = App$KL$Game$Stage$Draft$draw$tiles$get_pos$(_team$3);
        var _player_list$5 = List$nil;
        var _tiles_list$6 = List$nil;
        var _player_list$7 = (() => {
            var $866 = _player_list$5;
            var $867 = _coords$4;
            let _player_list$8 = $866;
            let _coord$7;
            while ($867._ === 'List.cons') {
                _coord$7 = $867.head;
                var _player$9 = App$KL$Game$Stage$Draft$draw$get_player_at$(_players$1, _coord$7);
                var self = _player$9;
                switch (self._) {
                    case 'Maybe.some':
                        var $868 = self.value;
                        var $869 = List$cons$(Pair$new$(_coord$7, Maybe$some$((() => {
                            var self = $868;
                            switch (self._) {
                                case 'Pair.new':
                                    var $870 = self.fst;
                                    var $871 = $870;
                                    return $871;
                            };
                        })())), _player_list$8);
                        var $866 = $869;
                        break;
                    case 'Maybe.none':
                        var $872 = List$cons$(Pair$new$(_coord$7, Maybe$none), _player_list$8);
                        var $866 = $872;
                        break;
                };
                _player_list$8 = $866;
                $867 = $867.tail;
            }
            return _player_list$8;
        })();
        var _tiles_list$8 = (() => {
            var $874 = _tiles_list$6;
            var $875 = _player_list$7;
            let _tiles_list$9 = $874;
            let _pair$8;
            while ($875._ === 'List.cons') {
                _pair$8 = $875.head;
                var $874 = List$cons$(App$KL$Game$Stage$Draft$draw$tiles$go$(_team$3, (() => {
                    var self = _pair$8;
                    switch (self._) {
                        case 'Pair.new':
                            var $876 = self.fst;
                            var $877 = $876;
                            return $877;
                    };
                })(), (() => {
                    var self = _pair$8;
                    switch (self._) {
                        case 'Pair.new':
                            var $878 = self.snd;
                            var $879 = $878;
                            return $879;
                    };
                })(), _user$2), _tiles_list$9);
                _tiles_list$9 = $874;
                $875 = $875.tail;
            }
            return _tiles_list$9;
        })();
        var $864 = _tiles_list$8;
        return $864;
    };
    const App$KL$Game$Stage$Draft$draw$tiles = x0 => x1 => App$KL$Game$Stage$Draft$draw$tiles$(x0, x1);

    function App$KL$Game$Stage$Draft$draw$map_space$(_players$1, _user$2) {
        var $880 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("width", "100%"), List$cons$(Pair$new$("height", "0"), List$cons$(Pair$new$("border", "5px solid #d6dadc"), List$cons$(Pair$new$("border-radius", "15px"), List$cons$(Pair$new$("background-color", "#d6dadc"), List$cons$(Pair$new$("position", "relative"), List$cons$(Pair$new$("padding-top", "100%"), List$nil)))))))), List$cons$(DOM$node$("div", Map$new, Map$set$("display", "contents", Map$new), List$fold$(App$KL$Game$Stage$Draft$draw$tiles$(_players$1, _user$2), List$nil, (_div$3 => _placeholder$4 => {
            var $881 = List$cons$(_div$3, _placeholder$4);
            return $881;
        }))), List$nil));
        return $880;
    };
    const App$KL$Game$Stage$Draft$draw$map_space = x0 => x1 => App$KL$Game$Stage$Draft$draw$map_space$(x0, x1);

    function App$KL$Game$Stage$Draft$draw$coordinates$(_players$1, _user$2) {
        var $882 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("width", "30%"), List$cons$(Pair$new$("height", "100%"), List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("align-items", "center"), List$cons$(Pair$new$("padding", "10% 0px 10% 2%"), List$nil)))))), List$cons$(App$KL$Game$Stage$Draft$draw$map_space$(_players$1, _user$2), List$nil));
        return $882;
    };
    const App$KL$Game$Stage$Draft$draw$coordinates = x0 => x1 => App$KL$Game$Stage$Draft$draw$coordinates$(x0, x1);

    function BBL$min$(_map$3) {
        var BBL$min$ = (_map$3) => ({
            ctr: 'TCO',
            arg: [_map$3]
        });
        var BBL$min = _map$3 => BBL$min$(_map$3);
        var arg = [_map$3];
        while (true) {
            let [_map$3] = arg;
            var R = (() => {
                var self = _map$3;
                switch (self._) {
                    case 'BBL.bin':
                        var $883 = self.key;
                        var $884 = self.val;
                        var $885 = self.left;
                        var self = $885;
                        switch (self._) {
                            case 'BBL.tip':
                                var $887 = Maybe$some$(Pair$new$($883, $884));
                                var $886 = $887;
                                break;
                            case 'BBL.bin':
                                var $888 = BBL$min$($885);
                                var $886 = $888;
                                break;
                        };
                        return $886;
                    case 'BBL.tip':
                        var $889 = Maybe$none;
                        return $889;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const BBL$min = x0 => BBL$min$(x0);

    function BBL$delete_min$(_map$3) {
        var self = _map$3;
        switch (self._) {
            case 'BBL.bin':
                var $891 = self.key;
                var $892 = self.val;
                var $893 = self.left;
                var $894 = self.right;
                var self = $893;
                switch (self._) {
                    case 'BBL.tip':
                        var $896 = $894;
                        var $895 = $896;
                        break;
                    case 'BBL.bin':
                        var _new_left$14 = BBL$delete_min$($893);
                        var $897 = BBL$balance$($891, $892, _new_left$14, $894);
                        var $895 = $897;
                        break;
                };
                var $890 = $895;
                break;
            case 'BBL.tip':
                var $898 = _map$3;
                var $890 = $898;
                break;
        };
        return $890;
    };
    const BBL$delete_min = x0 => BBL$delete_min$(x0);

    function BBL$delete$(_cmp$3, _key$4, _map$5) {
        var self = _map$5;
        switch (self._) {
            case 'BBL.bin':
                var $900 = self.key;
                var $901 = self.val;
                var $902 = self.left;
                var $903 = self.right;
                var self = _cmp$3(_key$4)($900);
                switch (self._) {
                    case 'Cmp.ltn':
                        var $905 = BBL$balance$($900, $901, BBL$delete$(_cmp$3, _key$4, $902), $903);
                        var $904 = $905;
                        break;
                    case 'Cmp.eql':
                        var _min$11 = BBL$min$($903);
                        var self = _min$11;
                        switch (self._) {
                            case 'Maybe.some':
                                var $907 = self.value;
                                var self = $907;
                                switch (self._) {
                                    case 'Pair.new':
                                        var $909 = self.fst;
                                        var $910 = self.snd;
                                        var _right_without_min$15 = BBL$delete_min$($903);
                                        var $911 = BBL$balance$($909, $910, $902, _right_without_min$15);
                                        var $908 = $911;
                                        break;
                                };
                                var $906 = $908;
                                break;
                            case 'Maybe.none':
                                var $912 = $902;
                                var $906 = $912;
                                break;
                        };
                        var $904 = $906;
                        break;
                    case 'Cmp.gtn':
                        var $913 = BBL$balance$($900, $901, $902, BBL$delete$(_cmp$3, _key$4, $903));
                        var $904 = $913;
                        break;
                };
                var $899 = $904;
                break;
            case 'BBL.tip':
                var $914 = BBL$tip;
                var $899 = $914;
                break;
        };
        return $899;
    };
    const BBL$delete = x0 => x1 => x2 => BBL$delete$(x0, x1, x2);

    function Map$delete$(_key$2, _map$3) {
        var $915 = BBL$delete$(String$cmp, _key$2, _map$3);
        return $915;
    };
    const Map$delete = x0 => x1 => Map$delete$(x0, x1);

    function Maybe$map$(_f$3, _m$4) {
        var self = _m$4;
        switch (self._) {
            case 'Maybe.some':
                var $917 = self.value;
                var $918 = Maybe$some$(_f$3($917));
                var $916 = $918;
                break;
            case 'Maybe.none':
                var $919 = Maybe$none;
                var $916 = $919;
                break;
        };
        return $916;
    };
    const Maybe$map = x0 => x1 => Maybe$map$(x0, x1);

    function U8$new$(_value$1) {
        var $920 = word_to_u8(_value$1);
        return $920;
    };
    const U8$new = x0 => U8$new$(x0);
    const Nat$to_u8 = a0 => (Number(a0) & 0xFF);

    function Maybe$bind$(_m$3, _f$4) {
        var self = _m$3;
        switch (self._) {
            case 'Maybe.some':
                var $922 = self.value;
                var $923 = _f$4($922);
                var $921 = $923;
                break;
            case 'Maybe.none':
                var $924 = Maybe$none;
                var $921 = $924;
                break;
        };
        return $921;
    };
    const Maybe$bind = x0 => x1 => Maybe$bind$(x0, x1);

    function Maybe$monad$(_new$2) {
        var $925 = _new$2(Maybe$bind)(Maybe$some);
        return $925;
    };
    const Maybe$monad = x0 => Maybe$monad$(x0);
    const BitsMap$get = a0 => a1 => (bitsmap_get(a0, a1));
    const Bits$o = a0 => (a0 + '0');
    const Bits$e = '';
    const Bits$i = a0 => (a0 + '1');

    function Bits$inc$(_a$1) {
        var self = _a$1;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'o':
                var $927 = self.slice(0, -1);
                var $928 = ($927 + '1');
                var $926 = $928;
                break;
            case 'i':
                var $929 = self.slice(0, -1);
                var $930 = (Bits$inc$($929) + '0');
                var $926 = $930;
                break;
            case 'e':
                var $931 = (Bits$e + '1');
                var $926 = $931;
                break;
        };
        return $926;
    };
    const Bits$inc = x0 => Bits$inc$(x0);
    const Nat$to_bits = a0 => (nat_to_bits(a0));

    function NatMap$get$(_key$2, _map$3) {
        var $932 = (bitsmap_get((nat_to_bits(_key$2)), _map$3));
        return $932;
    };
    const NatMap$get = x0 => x1 => NatMap$get$(x0, x1);

    function BitsMap$(_A$1) {
        var $933 = null;
        return $933;
    };
    const BitsMap = x0 => BitsMap$(x0);
    const NatMap = null;
    const BitsMap$new = ({
        _: 'BitsMap.new'
    });

    function BitsMap$tie$(_val$2, _lft$3, _rgt$4) {
        var $934 = ({
            _: 'BitsMap.tie',
            'val': _val$2,
            'lft': _lft$3,
            'rgt': _rgt$4
        });
        return $934;
    };
    const BitsMap$tie = x0 => x1 => x2 => BitsMap$tie$(x0, x1, x2);
    const BitsMap$set = a0 => a1 => a2 => (bitsmap_set(a0, a1, a2, 'set'));

    function NatMap$from_list$(_xs$2) {
        var self = _xs$2;
        switch (self._) {
            case 'List.cons':
                var $936 = self.head;
                var $937 = self.tail;
                var self = $936;
                switch (self._) {
                    case 'Pair.new':
                        var $939 = self.fst;
                        var $940 = self.snd;
                        var $941 = (bitsmap_set((nat_to_bits($939)), $940, NatMap$from_list$($937), 'set'));
                        var $938 = $941;
                        break;
                };
                var $935 = $938;
                break;
            case 'List.nil':
                var $942 = BitsMap$new;
                var $935 = $942;
                break;
        };
        return $935;
    };
    const NatMap$from_list = x0 => NatMap$from_list$(x0);

    function List$imap$(_f$3, _xs$4) {
        var self = _xs$4;
        switch (self._) {
            case 'List.cons':
                var $944 = self.head;
                var $945 = self.tail;
                var $946 = List$cons$(_f$3(0n)($944), List$imap$((_n$7 => {
                    var $947 = _f$3(Nat$succ$(_n$7));
                    return $947;
                }), $945));
                var $943 = $946;
                break;
            case 'List.nil':
                var $948 = List$nil;
                var $943 = $948;
                break;
        };
        return $943;
    };
    const List$imap = x0 => x1 => List$imap$(x0, x1);

    function App$KL$Game$Hero$new$(_name$1, _draw$2, _picture$3, _max_hp$4, _max_ap$5, _skills$6) {
        var $949 = ({
            _: 'App.KL.Game.Hero.new',
            'name': _name$1,
            'draw': _draw$2,
            'picture': _picture$3,
            'max_hp': _max_hp$4,
            'max_ap': _max_ap$5,
            'skills': _skills$6
        });
        return $949;
    };
    const App$KL$Game$Hero$new = x0 => x1 => x2 => x3 => x4 => x5 => App$KL$Game$Hero$new$(x0, x1, x2, x3, x4, x5);
    const Nat$ltn = a0 => a1 => (a0 < a1);
    const Nat$sub = a0 => a1 => (a0 - a1 <= 0n ? 0n : a0 - a1);

    function Cmp$as_gte$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
                var $951 = Bool$false;
                var $950 = $951;
                break;
            case 'Cmp.eql':
            case 'Cmp.gtn':
                var $952 = Bool$true;
                var $950 = $952;
                break;
        };
        return $950;
    };
    const Cmp$as_gte = x0 => Cmp$as_gte$(x0);

    function Word$gte$(_a$2, _b$3) {
        var $953 = Cmp$as_gte$(Word$cmp$(_a$2, _b$3));
        return $953;
    };
    const Word$gte = x0 => x1 => Word$gte$(x0, x1);

    function Word$or$(_a$2, _b$3) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $955 = self.pred;
                var $956 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $958 = self.pred;
                            var $959 = (_a$pred$9 => {
                                var $960 = Word$o$(Word$or$(_a$pred$9, $958));
                                return $960;
                            });
                            var $957 = $959;
                            break;
                        case 'Word.i':
                            var $961 = self.pred;
                            var $962 = (_a$pred$9 => {
                                var $963 = Word$i$(Word$or$(_a$pred$9, $961));
                                return $963;
                            });
                            var $957 = $962;
                            break;
                        case 'Word.e':
                            var $964 = (_a$pred$7 => {
                                var $965 = Word$e;
                                return $965;
                            });
                            var $957 = $964;
                            break;
                    };
                    var $957 = $957($955);
                    return $957;
                });
                var $954 = $956;
                break;
            case 'Word.i':
                var $966 = self.pred;
                var $967 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $969 = self.pred;
                            var $970 = (_a$pred$9 => {
                                var $971 = Word$i$(Word$or$(_a$pred$9, $969));
                                return $971;
                            });
                            var $968 = $970;
                            break;
                        case 'Word.i':
                            var $972 = self.pred;
                            var $973 = (_a$pred$9 => {
                                var $974 = Word$i$(Word$or$(_a$pred$9, $972));
                                return $974;
                            });
                            var $968 = $973;
                            break;
                        case 'Word.e':
                            var $975 = (_a$pred$7 => {
                                var $976 = Word$e;
                                return $976;
                            });
                            var $968 = $975;
                            break;
                    };
                    var $968 = $968($966);
                    return $968;
                });
                var $954 = $967;
                break;
            case 'Word.e':
                var $977 = (_b$4 => {
                    var $978 = Word$e;
                    return $978;
                });
                var $954 = $977;
                break;
        };
        var $954 = $954(_b$3);
        return $954;
    };
    const Word$or = x0 => x1 => Word$or$(x0, x1);

    function Word$shift_right$one$go$(_word$2) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $980 = self.pred;
                var $981 = Word$o$(Word$shift_right$one$go$($980));
                var $979 = $981;
                break;
            case 'Word.i':
                var $982 = self.pred;
                var $983 = Word$i$(Word$shift_right$one$go$($982));
                var $979 = $983;
                break;
            case 'Word.e':
                var $984 = Word$o$(Word$e);
                var $979 = $984;
                break;
        };
        return $979;
    };
    const Word$shift_right$one$go = x0 => Word$shift_right$one$go$(x0);

    function Word$shift_right$one$(_word$2) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $986 = self.pred;
                var $987 = Word$shift_right$one$go$($986);
                var $985 = $987;
                break;
            case 'Word.i':
                var $988 = self.pred;
                var $989 = Word$shift_right$one$go$($988);
                var $985 = $989;
                break;
            case 'Word.e':
                var $990 = Word$e;
                var $985 = $990;
                break;
        };
        return $985;
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
                    var $991 = _value$3;
                    return $991;
                } else {
                    var $992 = (self - 1n);
                    var $993 = Word$shift_right$($992, Word$shift_right$one$(_value$3));
                    return $993;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Word$shift_right = x0 => x1 => Word$shift_right$(x0, x1);

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
                    var $994 = Pair$new$(Bool$true, Word$or$(_value$5, _mask$6));
                    var self = $994;
                } else {
                    var $995 = Pair$new$(Bool$false, _value$5);
                    var self = $995;
                };
                switch (self._) {
                    case 'Pair.new':
                        var $996 = self.fst;
                        var $997 = self.snd;
                        var self = _shift$2;
                        if (self === 0n) {
                            var $999 = $997;
                            var $998 = $999;
                        } else {
                            var $1000 = (self - 1n);
                            var _new_shift_copy$9 = Word$shift_right$(1n, _shift_copy$4);
                            var self = $996;
                            if (self) {
                                var $1002 = Word$div$go$($1000, Word$sub$(_sub_copy$3, _shift_copy$4), _new_shift_copy$9, $997);
                                var $1001 = $1002;
                            } else {
                                var $1003 = Word$div$go$($1000, _sub_copy$3, _new_shift_copy$9, $997);
                                var $1001 = $1003;
                            };
                            var $998 = $1001;
                        };
                        return $998;
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
            var $1005 = Word$to_zero$(_a$2);
            var $1004 = $1005;
        } else {
            var _shift$6 = (_a_bits$4 - _b_bits$5 <= 0n ? 0n : _a_bits$4 - _b_bits$5);
            var _shift_copy$7 = Word$shift_left$(_shift$6, _b$3);
            var $1006 = Word$div$go$(_shift$6, _a$2, _shift_copy$7, Word$to_zero$(_a$2));
            var $1004 = $1006;
        };
        return $1004;
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
    const U32$read_base = a0 => a1 => (parseInt(a1, a0));

    function VoxBox$parse_byte$(_idx$1, _voxdata$2) {
        var _chr$3 = (_voxdata$2.slice(((_idx$1 * 2) >>> 0), ((((_idx$1 * 2) >>> 0) + 2) >>> 0)));
        var $1007 = (parseInt(_chr$3, 16));
        return $1007;
    };
    const VoxBox$parse_byte = x0 => x1 => VoxBox$parse_byte$(x0, x1);
    const U32$or = a0 => a1 => (a0 | a1);

    function Word$shl$(_n$2, _value$3) {
        var _n_nat$4 = Word$to_nat$(_n$2);
        var $1008 = Word$shift_left$(_n_nat$4, _value$3);
        return $1008;
    };
    const Word$shl = x0 => x1 => Word$shl$(x0, x1);
    const U32$shl = a0 => a1 => ((a0 << a1) >>> 0);
    const Pos32$new = a0 => a1 => a2 => ((0 | a0 | (a1 << 12) | (a2 << 24)));
    const Col32$new = a0 => a1 => a2 => a3 => ((0 | a0 | (a1 << 8) | (a2 << 16) | (a3 << 24)));

    function Word$trim$(_new_size$2, _word$3) {
        var self = _new_size$2;
        if (self === 0n) {
            var $1010 = Word$e;
            var $1009 = $1010;
        } else {
            var $1011 = (self - 1n);
            var self = _word$3;
            switch (self._) {
                case 'Word.o':
                    var $1013 = self.pred;
                    var $1014 = Word$o$(Word$trim$($1011, $1013));
                    var $1012 = $1014;
                    break;
                case 'Word.i':
                    var $1015 = self.pred;
                    var $1016 = Word$i$(Word$trim$($1011, $1015));
                    var $1012 = $1016;
                    break;
                case 'Word.e':
                    var $1017 = Word$o$(Word$trim$($1011, Word$e));
                    var $1012 = $1017;
                    break;
            };
            var $1009 = $1012;
        };
        return $1009;
    };
    const Word$trim = x0 => x1 => Word$trim$(x0, x1);

    function Array$extract_tip$(_arr$2) {
        var self = _arr$2;
        switch (self._) {
            case 'Array.tip':
                var $1019 = self.value;
                var $1020 = $1019;
                var $1018 = $1020;
                break;
            case 'Array.tie':
                var $1021 = Unit$new;
                var $1018 = $1021;
                break;
        };
        return $1018;
    };
    const Array$extract_tip = x0 => Array$extract_tip$(x0);

    function Array$extract_tie$(_arr$3) {
        var self = _arr$3;
        switch (self._) {
            case 'Array.tie':
                var $1023 = self.lft;
                var $1024 = self.rgt;
                var $1025 = Pair$new$($1023, $1024);
                var $1022 = $1025;
                break;
            case 'Array.tip':
                var $1026 = Unit$new;
                var $1022 = $1026;
                break;
        };
        return $1022;
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
                        var $1027 = self.pred;
                        var $1028 = Word$foldl$(_w0$4(_nil$3), _w0$4, _w1$5, $1027);
                        return $1028;
                    case 'Word.i':
                        var $1029 = self.pred;
                        var $1030 = Word$foldl$(_w1$5(_nil$3), _w0$4, _w1$5, $1029);
                        return $1030;
                    case 'Word.e':
                        var $1031 = _nil$3;
                        return $1031;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Word$foldl = x0 => x1 => x2 => x3 => Word$foldl$(x0, x1, x2, x3);

    function Array$mut$(_idx$3, _f$4, _arr$5) {
        var $1032 = Word$foldl$((_arr$6 => {
            var $1033 = Array$tip$(_f$4(Array$extract_tip$(_arr$6)));
            return $1033;
        }), (_rec$7 => _arr$8 => {
            var self = Array$extract_tie$(_arr$8);
            switch (self._) {
                case 'Pair.new':
                    var $1035 = self.fst;
                    var $1036 = self.snd;
                    var $1037 = Array$tie$(_rec$7($1035), $1036);
                    var $1034 = $1037;
                    break;
            };
            return $1034;
        }), (_rec$7 => _arr$8 => {
            var self = Array$extract_tie$(_arr$8);
            switch (self._) {
                case 'Pair.new':
                    var $1039 = self.fst;
                    var $1040 = self.snd;
                    var $1041 = Array$tie$($1039, _rec$7($1040));
                    var $1038 = $1041;
                    break;
            };
            return $1038;
        }), _idx$3)(_arr$5);
        return $1032;
    };
    const Array$mut = x0 => x1 => x2 => Array$mut$(x0, x1, x2);

    function Array$set$(_idx$3, _val$4, _arr$5) {
        var $1042 = Array$mut$(_idx$3, (_x$6 => {
            var $1043 = _val$4;
            return $1043;
        }), _arr$5);
        return $1042;
    };
    const Array$set = x0 => x1 => x2 => Array$set$(x0, x1, x2);
    const Buffer32$set = a0 => a1 => a2 => ((a2[a0] = a1, a2));
    const VoxBox$set_pos = a0 => a1 => a2 => ((a2.buffer[a0 * 2] = a1, a2));
    const VoxBox$set_col = a0 => a1 => a2 => ((a2.buffer[a0 * 2 + 1] = a1, a2));

    function VoxBox$set_length$(_length$1, _img$2) {
        var self = _img$2;
        switch (self._) {
            case 'VoxBox.new':
                var $1045 = self.capacity;
                var $1046 = self.buffer;
                var $1047 = VoxBox$new$(_length$1, $1045, $1046);
                var $1044 = $1047;
                break;
        };
        return $1044;
    };
    const VoxBox$set_length = x0 => x1 => VoxBox$set_length$(x0, x1);
    const VoxBox$push = a0 => a1 => a2 => ((a2.buffer[a2.length * 2] = a0, a2.buffer[a2.length * 2 + 1] = a1, a2.length++, a2));

    function VoxBox$parse$(_voxdata$1) {
        var _siz$2 = ((((_voxdata$1.length) >>> 0) / 12) >>> 0);
        var _img$3 = VoxBox$alloc_capacity$(_siz$2);
        var _img$4 = (() => {
            var $1049 = _img$3;
            var $1050 = 0;
            var $1051 = _siz$2;
            let _img$5 = $1049;
            for (let _i$4 = $1050; _i$4 < $1051; ++_i$4) {
                var _x$6 = VoxBox$parse_byte$(((((_i$4 * 6) >>> 0) + 0) >>> 0), _voxdata$1);
                var _y$7 = VoxBox$parse_byte$(((((_i$4 * 6) >>> 0) + 1) >>> 0), _voxdata$1);
                var _z$8 = VoxBox$parse_byte$(((((_i$4 * 6) >>> 0) + 2) >>> 0), _voxdata$1);
                var _r$9 = VoxBox$parse_byte$(((((_i$4 * 6) >>> 0) + 3) >>> 0), _voxdata$1);
                var _g$10 = VoxBox$parse_byte$(((((_i$4 * 6) >>> 0) + 4) >>> 0), _voxdata$1);
                var _b$11 = VoxBox$parse_byte$(((((_i$4 * 6) >>> 0) + 5) >>> 0), _voxdata$1);
                var _pos$12 = ((0 | _x$6 | (_y$7 << 12) | (_z$8 << 24)));
                var _col$13 = ((0 | _r$9 | (_g$10 << 8) | (_b$11 << 16) | (255 << 24)));
                var $1049 = ((_img$5.buffer[_img$5.length * 2] = _pos$12, _img$5.buffer[_img$5.length * 2 + 1] = _col$13, _img$5.length++, _img$5));
                _img$5 = $1049;
            };
            return _img$5;
        })();
        var $1048 = _img$4;
        return $1048;
    };
    const VoxBox$parse = x0 => VoxBox$parse$(x0);
    const App$KL$Game$Hero$Croni$Assets$vbox_idle = VoxBox$parse$("0f0b16351d4d100b16351d4d0d0c15351d4d0e0c15351d4d0f0c156a3a86100c158e4a9d110c15351d4d120c15351d4d0c0d14351d4d0d0d146a3a860e0d146a3a860f0d148e4a9d100d146a3a86110d146a3a86120d146a3a86130d14351d4d0b0e13351d4d0c0e136a3a860d0e136a3a860e0e136a3a860f0e136a3a86100e136a3a86110e136a3a86120e136a3a86130e136a3a86140e13351d4d0a0f12351d4d0b0f126a3a860c0f126a3a860d0f126a3a860e0f126a3a860f0f126a3a86100f126a3a86110f126a3a86120f126a3a86130f126a3a86140f126a3a86150f12351d4d0a1011351d4d0b10116a3a860c10116a3a860d10116a3a860e10116a3a860f10116a3a861010116a3a861110116a3a861210116a3a861310116a3a861410116a3a86151011351d4d091110351d4d0a11106a3a860b11106a3a860c11106a3a860d11106a3a860e11106a3a860f11106a3a861011106a3a861111106a3a861211106a3a861311106a3a861411106a3a861511106a3a86161110351d4d09120f351d4d0a120f6a3a860b120f6a3a860c120f602d800d120f602d800e120f6a3a860f120f6a3a8610120f6a3a8611120f6a3a8612120f602d8013120f602d8014120f6a3a8615120f6a3a8616120f351d4d09130e351d4d0a130e602d800b130e602d800c130e351d4d0d130e351d4d0e130e6a3a860f130e6a3a8610130e6a3a8611130e6a3a8612130e351d4d13130e351d4d14130e602d8015130e602d8016130e351d4d09140d351d4d0a140d602d800b140d351d4d0c140d351d4d0d140d531e480e140d351d4d0f140d6a3a8610140d6a3a8611140d351d4d12140d531e4813140d351d4d14140d351d4d15140d4a358016140d351d4d09150c351d4d0a150c4a35800b150c351d4d0c150c531e480d150cdf3e460e150c531e480f150c351d4d10150c351d4d11150c531e4812150cdf3e4613150c531e4814150c351d4d15150c4a358016150c351d4d0a160b351d4d0b160b4a35800c160b351d4d0d160b531e480e160b351d4d0f160b351d4d10160b351d4d11160b351d4d12160b531e4813160b351d4d14160b4a358015160b351d4d0b170a351d4d0c170a4a35800d170a8e4a9d0e170a351d4d0f170a351d4d10170a351d4d11170a351d4d12170a8e4a9d13170a4a358014170a351d4d0d1809351d4d0e1809602d800f1809602d801018094a3580111809602d80121809351d4d0c1908351d4d0d19086a3a860e19086a3a860f19086a3a861019084a35801119086a3a861219086a3a86131908351d4d0c1a07351d4d0d1a076a3a860e1a076a3a860f1a076a3a86101a074a3580111a076a3a86121a076a3a86131a07351d4d0c1b06351d4d0d1b068e4a9d0e1b066a3a860f1b066a3a86101b064a3580111b066a3a86121b068e4a9d131b06351d4d0d1c05351d4d0e1c05351d4d0f1c05351d4d101c05351d4d111c05351d4d121c05351d4d111d04351d4d121d04351d4d");
    const App$KL$Game$Hero$Croni$Assets$base64_idle = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB8AAAAeCAYAAADU8sWcAAAAAXNSR0IArs4c6QAAATtJREFUSIntlr1qwzAURo9KW0Ih4MVNFpsO2dLNeAh5hox9qz5MIQ/hwWQq3TpFS5ssgUBaLKg6uDI1/YmuSGgHf4vhk6xzr66vZOjUqVOnTv9NeTKzeTKzoe+fhkLr54RRNACwAKWeK8k6oskOnCcTAEbRgMfNczNW6kIUgAj+GfyTJAF4w33A0gBOfOHHkFfmkqydfLIXZ77bVuy2lbf/m7xbzS38sFkAkPfbO+H8MZk3XJS5A6TKUOqi8UtdkCrTzFn1Dgx3C6bKcHv11gTgwM6TSNRq8TBj/bQgVYalPWuNO8/N8Wk175qXeq5ysPEwYxonLO/vWuPT6xte1tobDAHHK9S7MI7qD2vVg8vXutbSs118sXzpeVNx0T93X7+VBPCnJ1wQ/OMa3evtU3DNv/OlNT+IQv9o3gF/BY+h0RNEhAAAAABJRU5ErkJggg==";
    const App$KL$Game$Hero$Croni$hero = App$KL$Game$Hero$new$("Croni", (_player$1 => {
        var $1052 = App$KL$Game$Hero$Croni$Assets$vbox_idle;
        return $1052;
    }), (_bool$1 => _time$2 => {
        var $1053 = App$KL$Game$Hero$Croni$Assets$base64_idle;
        return $1053;
    }), 25, 10, List$nil);
    const App$KL$Game$Hero$Cyclope$Assets$vbox_idle = VoxBox$parse$("0e0a212c333d0f0a212c333d100a212c333d110a212c333d0d0b202c333d0e0b20fff9e10f0b20fff9e1100b20fff9e1110b20fff9e1120b202c333d0d0c1f2c333d0e0c1ffff9e10f0c1ffff9e1100c1ffff9e1110c1ffff9e1120c1f2c333d0c0d1e2729600d0d1e2729600e0d1efff9e10f0d1eccc8b7100d1eccc8b7110d1eccc8b7120d1e272960130d1e272960140d1e2729600c0e1d2729600d0e1d2729600e0e1dfff9e10f0e1dccc8b7100e1dccc8b7110e1dccc8b7120e1d272960130e1d272960140e1d272960050f1c272960060f1c272960070f1c272960090f1c2729600a0f1c2729600b0f1c2729600c0f1c5176b80d0f1cfff9e10e0f1cdfdbc80f0f1cdfdbc8100f1cdfdbc8110f1cdfdbc8120f1cccc8b7130f1c5176b8140f1c5176b8150f1c27296005101b27296006101b799cd307101b799cd308101b27296009101b5176b80a101b5176b80b101b5176b80c101b799cd30d101b5176b80e101bdfdbc80f101bccc8b710101bccc8b711101bccc8b712101b5176b813101b799cd314101b799cd315101b5176b816101b27296017101b27296018101b27296005111a27296006111a799cd307111a799cd308111a27296009111a5176b80a111a5176b80b111a5176b80c111a799cd30d111a5176b80e111adfdbc80f111accc8b710111accc8b711111accc8b712111a5176b813111a799cd314111a799cd315111a5176b816111a27296017111a27296018111a2729600512192729600612195176b80712195176b8081219394c87091219799cd30a1219799cd30b1219799cd30c12195176b80d12194a2b710e12194a2b710f12194a2b711012194a2b711112194a2b711212194a2b711312195176b81412195176b8151219799cd31612192729601712192729601812192729600513182729600613185176b80713185176b8081318394c87091318799cd30a1318799cd30b1318799cd30c13185176b80d13184a2b710e13184a2b710f13184a2b711013184a2b711113184a2b711213184a2b711313185176b81413185176b8151318799cd3161318272960171318272960181318272960051417272960061417272960071417272960081417394c870914175176b80a14175176b80b14175176b80c14174a2b710d1417dab04d0e1417dab04d0f1417dab04d101417dab04d111417dab04d121417dab04d1314174a2b711414174a2b711514175176b8161417394c87171417394c87181417394c871914172729601a1417272960051516272960061516799cd3071516799cd3081516394c870915165176b80a15165176b80b15165176b80c15164a2b710d1516dab04d0e1516fff9e10f1516fff9e1101516fff9e1111516fff9e1121516dab04d1315164a2b711415164a2b711515165176b8161516394c87171516394c87181516394c87191516799cd31a1516272960051615272960061615799cd3071615799cd3081615394c870916155176b80a16155176b80b16155176b80c16154a2b710d1615dab04d0e1615fff9e10f1615fff9e1101615fff9e1111615fff9e1121615dab04d1316154a2b711416154a2b711516155176b8161615394c87171615394c87181615394c87191615799cd31a1615272960051714272960061714272960071714272960081714394c870917145176b80a17145176b80b17145176b80c17144a2b710d1714dab04d0e17142421260f1714242126101714242126111714242126121714dab04d1317144a2b711417144a2b711517145176b8161714394c87171714394c87181714394c871917142729601a17145176b81b17142729600518132729600618135176b80718135176b8081813394c870918135176b80a18135176b80b18135176b80c18135176b80d18134a2b710e18134a2b710f18134a2b711018134a2b711118134a2b711218134a2b711318135176b81418135176b81518135176b8161813394c87171813394c87181813394c87191813799cd31a1813799cd31b18132729600519122729600619125176b80719125176b8081912394c870919125176b80a19125176b80b19125176b80c19125176b80d19124a2b710e19124a2b710f19124a2b711019124a2b711119124a2b711219124a2b711319125176b81419125176b81519125176b8161912394c87171912394c87181912394c87191912799cd31a1912799cd31b1912272960051a11272960061a115176b8071a115176b8081a11394c87091a115176b80a1a115176b80b1a115176b80c1a115176b80d1a114a2b710e1a114a2b710f1a114a2b71101a114a2b71111a114a2b71121a114a2b71131a115176b8141a115176b8151a115176b8161a11394c87171a11394c87181a11394c87191a11799cd31a1a11799cd31b1a11272960051b10272960061b10799cd3071b10799cd3081b105176b8091b10394c870a1b10394c870b1b10394c870c1b10dfdbc80d1b105176b80e1b105176b80f1b105176b8101b105176b8111b105176b8121b105176b8131b10dfdbc8141b10dfdbc8151b10394c87161b105176b8171b105176b8181b105176b8191b105176b81a1b10799cd31b1b10272960061c0f272960071c0f272960081c0f272960091c0f394c870a1c0f394c870b1c0f394c870c1c0fdfdbc80d1c0f4662a10e1c0f4662a10f1c0f4662a1101c0f4662a1111c0f4662a1121c0f4662a1131c0fdfdbc8141c0fdfdbc8151c0f394c87161c0f394c87171c0f394c87181c0f394c87191c0f5176b81a1c0f5176b81b1c0f272960081d0e272960091d0e5176b80a1d0e5176b80b1d0e5176b80c1d0e394c870d1d0e394c870e1d0e394c870f1d0e394c87101d0e394c87111d0e394c87121d0e394c87131d0e394c87141d0e394c87151d0e5176b8161d0e394c87171d0e394c87181d0e394c87191d0e5176b81a1d0e5176b81b1d0e272960081e0d272960091e0d5176b80a1e0d5176b80b1e0d5176b80c1e0d394c870d1e0d394c870e1e0d394c870f1e0d394c87101e0d394c87111e0d394c87121e0d394c87131e0d394c87141e0d394c87151e0d5176b8161e0d394c87171e0d394c87181e0d394c87191e0d5176b81a1e0d5176b81b1e0d272960081f0c272960091f0c5176b80a1f0c5176b80b1f0c5176b80c1f0c394c870d1f0c394c870e1f0c394c870f1f0c394c87101f0c394c87111f0c394c87121f0c394c87131f0c394c87141f0c394c87151f0c5176b8161f0c394c87171f0c394c87181f0c394c87191f0c5176b81a1f0c5176b81b1f0c27296008200b27296009200b5176b80a200b5176b80b200b5176b80c200b5176b80d200b5176b80e200b5176b80f200b5176b810200b5176b811200b5176b812200b5176b813200b5176b814200b5176b815200b394c8716200b799cd317200b799cd318200b799cd319200b5176b81a200b5176b81b200b27296008210a27296009210a8e4a9d0a210a8e4a9d0b210a8e4a9d0c210a8e4a9d0d210a5176b80e210a5176b80f210a5176b810210a5176b811210a5176b812210a5176b813210a394c8714210a394c8715210a394c8716210a799cd317210a799cd318210a799cd319210a799cd31a210a5176b81b210a2729600922092729600a22092729600b22092729600c22094a2b710d22098e4a9d0e22098e4a9d0f22098e4a9d1022098e4a9d1122098e4a9d1222098e4a9d132209394c87142209394c871522095176b8162209394c87172209394c87182209394c87192209394c871a22092729600923082729600a23082729600b23082729600c23084a2b710d23088e4a9d0e23088e4a9d0f23088e4a9d1023088e4a9d1123088e4a9d1223088e4a9d132308394c87142308394c871523085176b8162308394c87172308394c87182308394c87192308394c871a23082729600924072729600a24072729600b24072729600c24074a2b710d24078e4a9d0e24078e4a9d0f24078e4a9d1024078e4a9d1124078e4a9d1224078e4a9d132407394c87142407394c871524075176b8162407394c87172407394c87182407394c87192407394c871a24072729600925062729600a25062729600b25062729600c25065176b80d25064a2b710e25068e4a9d0f25068e4a9d1025068e4a9d1125068e4a9d1225064a2b71132506394c87142506394c87152506799cd3162506799cd3172506799cd3182506799cd31925065176b81a25062729600926052729600a26052729600b26052729600c2605799cd30d2605799cd30e26054a2b710f26054a2b711026054a2b711126054a2b711226052729601326052729601426052729601526052729601626052729601726052729601826052729601926052729600927042729600a27042729600b27042729600c27042729600d27042729600e2704272960");
    const App$KL$Game$Hero$Cyclope$Assets$base64_idle = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB8AAAAoCAYAAAAG0SEsAAAAAXNSR0IArs4c6QAAAvxJREFUWIXtl01IVFEUx39PhZFh8BNsbJCIyTfjYAsJXARCiTmECeFKpIUErmqhuZRW4fJpizZtwkWEEAyBTaGIBkILQVwk48zU0IfYaDRKYpKZvRbje/PezH3OC7Ik5r953HPPPeeec/733vOggAIKKOB/hfS7CxrPtdDe2szUzLxqlLe3NktTM/MALC3M/TnnvobezILibUoc6+qrlw9NOmfPX+PH7gkJQN13EVsey2u3yNYWjwglIqExUoCy2jq2kisAqPsudW/HBcDCYkTX2dvxAmilkIw2rLJgK/Kt5Aql5ZWUllfaUcdZXWNLT1hzX0OvTia37JfW4lF9HOjsJnSngXcfkqY1qdQmw6G0ucjEOM7qGmkn9UmfF0UvTDtA1+AgACFFUQOd3brcL3vour3MSF8FqdSmLh8OSfhlT3rQ2U1kYtx4GoRBHj/CAUTjqwBUeX2ZiA7ku+FJboQFawgC6exEsuY0AhrT/1ciL3Y4hHLLyCMT40A6ci0LALvhSe4OvxGu6R9Kf6MEqfL6dPlGIqYfQVvONcK9ePJUOF9/+Z5p/Pr5TStTdA0OElKUnCN4PAkXUhQAU/qMqPdfMo2fjYr1NFuBzPHTU2/pXDvba5FFk9zREaR/CGTnGZO8fyg9J4JWwuwT8E/TfjxrbrxYjKl/NHqRW4jTO9JXAUDPwCzuQJMuj8ZXTfYOde6RZSmkKPrdnE26r5/XLbZcIdywO9BkuisOdb4aj0OGlaoxip6BWQvH0DPwUXeWTVQRCoQzIbY8ltNKaTCWwAprkUUuXL2ij0X1tnSejZYl8+K5xlzmak5F8Mse+4Qzora0XLr/dk5nvreokjYL3ccHRXQHmnIepI1EDGd1jelVy1vz5Lcv+VRsw9jT2XJ+lLBMu9buZBPP0RFkOjxJ26lGk3z6/RKcTr/XftmT03ptJGL2nVvBL3tAvs706AOTPPFzExLpbjak5Doqq62TtB8PDXn/1Q4iV0VzJyWXBLCPyrb6na/sHWoru3f/BfiK9iwJlXjfAAAAAElFTkSuQmCC";
    const App$KL$Game$Hero$Cyclope$hero = App$KL$Game$Hero$new$("Cyclope", (_player$1 => {
        var $1054 = App$KL$Game$Hero$Cyclope$Assets$vbox_idle;
        return $1054;
    }), (_bool$1 => _time$2 => {
        var $1055 = App$KL$Game$Hero$Cyclope$Assets$base64_idle;
        return $1055;
    }), 15, 10, List$nil);
    const App$KL$Game$Hero$Lela$Assets$vbox_idle = VoxBox$parse$("091219fb4d4d0a1219fb4d4d0b1219fb4d4d0c1219fb4d4d131219fb4d4d141219fb4d4d151219fb4d4d161219fb4d4d081318fb4d4d0913182b496c0a13182b496c0b13182b496c0c13182b496c0d1318fb4d4d121318fb4d4d1313182b496c1413182b496c1513182b496c1613182b496c171318fb4d4d071417fb4d4d0814172b496c09141781aeff0a141781aeff0b141781aeff0c141781aeff0d14172b496c0e1417fb4d4d0f1417fb4d4d101417fb4d4d111417fb4d4d1214172b496c13141781aeff14141781aeff15141781aeff16141781aeff1714172b496c181417fb4d4d071516fb4d4d0815161f3b5b091516538ccf0a1516538ccf0b1516538ccf0c1516538ccf0d1516538ccf0e15162b496c0f15162b496c1015162b496c1115162b496c121516538ccf131516538ccf141516538ccf151516538ccf161516538ccf1715161f3b5b181516fb4d4d071615fb4d4d0816151f3b5b091615538ccf0a1615538ccf0b1615538ccf0c1615538ccf0d1615538ccf0e161581aeff0f161581aeff10161581aeff11161581aeff121615538ccf131615538ccf141615538ccf151615538ccf161615538ccf1716151f3b5b181615fb4d4d071714fb4d4d0817141f3b5b091714538ccf0a1714538ccf0b1714538ccf0c1714538ccf0d1714538ccf0e1714538ccf0f1714538ccf101714538ccf111714538ccf121714538ccf131714538ccf141714538ccf151714538ccf161714538ccf1717141f3b5b181714fb4d4d081813fb4d4d0918131f3b5b0a1813538ccf0b1813538ccf0c1813538ccf0d1813538ccf0e1813538ccf0f1813cb4646101813cb4646111813538ccf121813538ccf131813538ccf141813538ccf151813538ccf1618131f3b5b171813fb4d4d091912fb4d4d0a19121f3b5b0b1912538ccf0c1912538ccf0d1912538ccf0e1912538ccf0f1912ad1f1f101912ad1f1f111912538ccf121912538ccf131912538ccf141912538ccf1519121f3b5b161912fb4d4d091a11fb4d4d0a1a111f3b5b0b1a11538ccf0c1a11538ccf0d1a11cb46460e1a11538ccf0f1a11538ccf101a11538ccf111a11538ccf121a11cb4646131a11538ccf141a11538ccf151a111f3b5b161a11fb4d4d091b10fb4d4d0a1b101f3b5b0b1b10538ccf0c1b10538ccf0d1b10ad1f1f0e1b10538ccf0f1b103d5497101b103d5497111b10538ccf121b10ad1f1f131b10538ccf141b10538ccf151b101f3b5b161b10fb4d4d0a1c0ffb4d4d0b1c0f1f3b5b0c1c0f538ccf0d1c0f538ccf0e1c0f538ccf0f1c0f2d4382101c0f2d4382111c0f538ccf121c0f538ccf131c0f538ccf141c0f1f3b5b151c0ffb4d4d0b1d0efb4d4d0c1d0e1f3b5b0d1d0e3a67b70e1d0e538ccf0f1d0e203368101d0e203368111d0e538ccf121d0e3a67b7131d0e1f3b5b141d0efb4d4d0a1e0dfb4d4d0b1e0d1f3b5b0c1e0d538ccf0d1e0d538ccf0e1e0d3a67b70f1e0d3a67b7101e0d3a67b7111e0d3a67b7121e0d538ccf131e0d538ccf141e0d1f3b5b151e0dfb4d4d091f0cfb4d4d0a1f0c1f3b5b0b1f0c81aeff0c1f0c3a71b10d1f0c538ccf0e1f0c81aeff0f1f0c81aeff101f0c81aeff111f0c81aeff121f0c538ccf131f0c3a71b1141f0c81aeff151f0c1f3b5b161f0cfb4d4d08200bfb4d4d09200b1f3b5b0a200b538ccf0b200b538ccf0c200b3a71b10d200b538ccf0e200b538ccf0f200b538ccf10200b538ccf11200b538ccf12200b538ccf13200b3a71b114200b538ccf15200b538ccf16200b1f3b5b17200bfb4d4d08210afb4d4d09210a1f3b5b0a210a538ccf0b210a538ccf0c210a3a71b10d210a538ccf0e210a538ccf0f210a538ccf10210a538ccf11210a538ccf12210a538ccf13210a3a71b114210a538ccf15210a538ccf16210a1f3b5b17210afb4d4d082209fb4d4d0922091f3b5b0a2209538ccf0b2209538ccf0c22092753860d2209538ccf0e2209538ccf0f2209538ccf102209538ccf112209538ccf122209538ccf132209275386142209538ccf152209538ccf1622091f3b5b172209fb4d4d092308fb4d4d0a23081f3b5b0b23081f3b5b0c23081f3b5b0d23083a67b70e2308538ccf0f2308538ccf102308538ccf112308538ccf1223083a67b71323081f3b5b1423081f3b5b1523081f3b5b162308fb4d4d0a2407fb4d4d0b2407fb4d4d0c2407fb4d4d0d24071f3b5b0e24073a67b70f2407538ccf102407538ccf1124073a67b71224071f3b5b132407fb4d4d142407fb4d4d152407fb4d4d0d2506fb4d4d0e25061f3b5b0f25063a67b71025063a67b71125061f3b5b122506fb4d4d0e2605fb4d4d0f26051f3b5b1026051f3b5b112605fb4d4d0f2704fb4d4d102704fb4d4d");
    const App$KL$Game$Hero$Lela$Assets$base64_idle = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB8AAAAoCAYAAAAG0SEsAAAAAXNSR0IArs4c6QAAAbtJREFUWIXtlrFLw0AUxr9Ku3bIZClUkCoOIh1cnQTFIYKLk5Pi2ElB/wSFOjmKTqWDS4sZRMHJJUOHUHSILYUG2pSCbUm7VajThVyStndpHIT7Tcl7L/e9d+9dEkAgEAgEAoHgvxJhCRrJ8th5H1MU3+dY45jFR7I8zvwsUTYt2vAszBrHLE4WPDy9peyPd1lo0QZlmxY3KYHoNHEAGFo9VOoaZVvbPkHm7d5jc8cNrR4gTV57pvgk3FW6hVkILB5EzA3TwKW7cWwenHt8l68XAICrnWuPr1zMoSZZUwduYZZ4TFEiNclCuZjz+Axdh6HrgYSZxP0gFReyJRSyJcrGQyBxUm1HVdFRVcrGA9MbDvDv/dezAgBY3ZNtG+uWAxyVO3tvVtsAgEG/hUG/BQAwq20uYWCOykkChMTKIgC+ypk/LOluHMdneby8PyGRTGFjOUPFVOoazKaB3a19PNwcMSXAfc7NpoFEMuUb6/SFcs7/Em7xb+MzkM8Prp4TkutH9oARzGobzY+8fR9Kz50JkOt0N04lQIRrkmXHhzbtfomQBADYwqzney5xZwIA2xaHzkiWx+6fRh5+AUGh8BOt6NHQAAAAAElFTkSuQmCC";
    const App$KL$Game$Hero$Lela$hero = App$KL$Game$Hero$new$("Lela", (_player$1 => {
        var $1056 = App$KL$Game$Hero$Lela$Assets$vbox_idle;
        return $1056;
    }), (_bool$1 => _time$2 => {
        var $1057 = App$KL$Game$Hero$Lela$Assets$base64_idle;
        return $1057;
    }), 15, 10, List$nil);
    const App$KL$Game$Hero$Octoking$Assets$vbox_idle = VoxBox$parse$("0a0a21192a020b0a21192a020d0a21192a020e0a21192a02100a21192a02110a21192a02120a21192a02130a21192a02150a21192a02160a21192a02180a21192a02190a21192a020a0b20192a020b0b20192a020d0b20192a020e0b20192a02100b20192a02110b20192a02120b20192a02130b20192a02150b20192a02160b20192a02180b20192a02190b20192a02080c1f192a02090c1f192a020a0c1fe6d7510b0c1fe6d7510c0c1f192a020d0c1f70681e0e0c1f70681e0f0c1f192a02100c1ffff6a6110c1ffff6a6120c1ffff6a6130c1ffff6a6140c1f192a02150c1f70681e160c1f70681e170c1f192a02180c1fe6d751190c1fe6d7511a0c1f192a021b0c1f192a02080d1e192a02090d1e192a020a0d1ee6d7510b0d1ee6d7510c0d1efff6a60d0d1e192a020e0d1e192a020f0d1ee6d751100d1ee6d751110d1ee6d751120d1ee6d751130d1ee6d751140d1ee6d751150d1e192a02160d1e192a02170d1efff6a6180d1ee6d751190d1ee6d7511a0d1e192a021b0d1e192a02080e1d192a02090e1d192a020a0e1de6d7510b0e1de6d7510c0e1dfff6a60d0e1d192a020e0e1d192a020f0e1de6d751100e1de6d751110e1de6d751120e1de6d751130e1de6d751140e1de6d751150e1d192a02160e1d192a02170e1dfff6a6180e1de6d751190e1de6d7511a0e1d192a021b0e1d192a02080f1c192a02090f1c192a020a0f1cc9ae530b0f1cc9ae530c0f1ce6d7510d0f1ce6d7510e0f1ce6d7510f0f1ce6d751100f1cb8321d110f1cb8321d120f1cb8321d130f1cb8321d140f1ce6d751150f1ce6d751160f1ce6d751170f1ce6d751180f1cc9ae53190f1cc9ae531a0f1c192a021b0f1c192a0208101b192a0209101b192a020a101bc9ae530b101bc9ae530c101be6d7510d101be6d7510e101be6d7510f101be6d75110101bb8321d11101bb8321d12101bb8321d13101bb8321d14101be6d75115101be6d75116101be6d75117101be6d75118101bc9ae5319101bc9ae531a101b192a021b101b192a0205111a192a0206111a192a0207111a192a0208111a192a0209111a192a020a111a4281350b111a4281350c111a4281350d111a4281350e111a4281350f111ac9ae5310111ac9ae5311111ac9ae5312111ac9ae5313111ac9ae5314111ac9ae5315111a42813516111a42813517111a42813518111a42813519111a4281351a111a192a021b111a192a021c111a192a021d111a192a021e111a192a02041219192a020512199fd95d0612199fd95d0712199fd95d081219192a02091219192a020a12199fd95d0b12199fd95d0c12195ea6420d12195ea6420e12195ea6420f12194281351012194281351112194281351212194281351312194281351412194281351512195ea6421612195ea6421712195ea6421812199fd95d1912199fd95d1a1219192a021b1219192a021c12199fd95d1d12199fd95d1e12199fd95d1f1219192a02041318192a020513189fd95d0613189fd95d0713189fd95d081318192a02091318192a020a13189fd95d0b13189fd95d0c13185ea6420d13185ea6420e13185ea6420f13184281351013184281351113184281351213184281351313184281351413184281351513185ea6421613185ea6421713185ea6421813189fd95d1913189fd95d1a1318192a021b1318192a021c13189fd95d1d13189fd95d1e13189fd95d1f1318192a02021417192a02031417192a020414179fd95d0514175ea6420614175ea6420714175ea642081417192a02091417192a020a14175ea6420b14175ea6420c14175ea6420d14175ea6420e14175ea6420f14175ea6421014175ea6421114175ea6421214175ea6421314175ea6421414175ea6421514175ea6421614175ea6421714175ea6421814175ea6421914175ea6421a1417192a021b1417192a021c14175ea6421d14175ea6421e14175ea6421f14179fd95d201417192a02211417192a02041516192a020515165ea6420615165ea6420715165ea642081516192a02091516192a020a15164281350b15164281350c15164281350d15164281350e15164281350f15164281351015165ea6421115165ea6421215165ea6421315165ea6421415164281351515164281351615164281351715164281351815164281351915164281351a1516192a021b1516192a021c15165ea6421d15165ea6421e15165ea6421f1516192a02041615192a020516155ea6420616155ea6420716155ea642081615192a02091615192a020a16154281350b16154281350c16154281350d16154281350e16154281350f16154281351016155ea6421116155ea6421216155ea6421316155ea6421416154281351516154281351616154281351716154281351816154281351916154281351a1615192a021b1615192a021c16155ea6421d16155ea6421e16155ea6421f1615192a02051714192a02061714192a020717145ea6420817145ea6420917145ea6420a1714192a020b1714192a020c17144281350d1714e6d7510e1714e6d7510f1714e6d751101714428135111714428135121714428135131714428135141714e6d751151714e6d751161714e6d751171714428135181714192a02191714192a021a17145ea6421b17145ea6421c17145ea6421d1714192a021e1714192a02071813192a020818135ea6420918135ea6420a1813366d2a0b1813366d2a0c1813192a020d18134281350e18134281350f1813173e0f101813173e0f111813173e0f121813173e0f131813173e0f141813173e0f151813428135161813428135171813192a02181813366d2a191813366d2a1a18135ea6421b18135ea6421c1813192a02071912192a020819125ea6420919125ea6420a1912366d2a0b1912366d2a0c1912192a020d19124281350e19124281350f1912173e0f101912173e0f111912173e0f121912173e0f131912173e0f141912173e0f151912428135161912428135171912192a02181912366d2a191912366d2a1a19125ea6421b19125ea6421c1912192a02051a11192a02061a11192a02071a11192a02081a11428135091a114281350a1a115ea6420b1a115ea6420c1a114281350d1a11192a020e1a11192a020f1a119fd95d101a119fd95d111a119fd95d121a119fd95d131a119fd95d141a119fd95d151a11192a02161a11192a02171a11428135181a115ea642191a115ea6421a1a114281351b1a114281351c1a11192a021d1a11192a021e1a11192a02051b10192a02061b10192a02071b10192a02081b10428135091b104281350a1b105ea6420b1b105ea6420c1b104281350d1b10192a020e1b10192a020f1b109fd95d101b109fd95d111b109fd95d121b109fd95d131b109fd95d141b109fd95d151b10192a02161b10192a02171b10428135181b105ea642191b105ea6421a1b104281351b1b104281351c1b10192a021d1b10192a021e1b10192a02041c0f192a02051c0f366d2a061c0f366d2a071c0f192a02081c0f5ea642091c0f5ea6420a1c0f4281350b1c0f4281350c1c0f192a020d1c0f9fd95d0e1c0f9fd95d0f1c0f5ea642101c0f428135111c0f428135121c0f428135131c0f428135141c0f5ea642151c0f9fd95d161c0f9fd95d171c0f192a02181c0f428135191c0f4281351a1c0f5ea6421b1c0f5ea6421c1c0f192a021d1c0f366d2a1e1c0f366d2a1f1c0f192a02021d0e192a02031d0e192a02041d0e428135051d0e428135061d0e428135071d0e192a02081d0e428135091d0e4281350a1d0e4281350b1d0e4281350c1d0e192a020d1d0e5ea6420e1d0e5ea6420f1d0e5ea642101d0e428135111d0e428135121d0e428135131d0e428135141d0e5ea642151d0e5ea642161d0e5ea642171d0e192a02181d0e428135191d0e4281351a1d0e4281351b1d0e4281351c1d0e192a021d1d0e4281351e1d0e4281351f1d0e428135201d0e192a02211d0e192a02021e0d192a02031e0d192a02041e0d428135051e0d428135061e0d428135071e0d192a02081e0d428135091e0d4281350a1e0d4281350b1e0d4281350c1e0d192a020d1e0d5ea6420e1e0d5ea6420f1e0d5ea642101e0d428135111e0d428135121e0d428135131e0d428135141e0d5ea642151e0d5ea642161e0d5ea642171e0d192a02181e0d428135191e0d4281351a1e0d4281351b1e0d4281351c1e0d192a021d1e0d4281351e1e0d4281351f1e0d428135201e0d192a02211e0d192a02001f0c192a02011f0c192a02021f0c9fd95d031f0c9fd95d041f0c5ea642051f0c428135061f0c428135071f0c192a02081f0c5ea642091f0c5ea6420a1f0c4281350b1f0c4281350c1f0c192a020d1f0c5ea6420e1f0c5ea6420f1f0c5ea642101f0c428135111f0c428135121f0c428135131f0c428135141f0c5ea642151f0c5ea642161f0c5ea642171f0c192a02181f0c428135191f0c4281351a1f0c5ea6421b1f0c5ea6421c1f0c192a021d1f0c4281351e1f0c4281351f1f0c5ea642201f0c9fd95d211f0c9fd95d221f0c192a0202200b192a0203200b192a0204200b192a0205200b42813506200b42813507200b42813508200b192a0209200b192a020a200b366d2a0b200b366d2a0c200b192a020d200b5ea6420e200b5ea6420f200b5ea64210200b42813511200b42813512200b42813513200b42813514200b5ea64215200b5ea64216200b5ea64217200b192a0218200b366d2a19200b366d2a1a200b192a021b200b192a021c200b4281351d200b4281351e200b4281351f200b192a0220200b192a0221200b192a0202210a192a0203210a192a0204210a192a0205210a42813506210a42813507210a42813508210a192a0209210a192a020a210a366d2a0b210a366d2a0c210a192a020d210a5ea6420e210a5ea6420f210a5ea64210210a42813511210a42813512210a42813513210a42813514210a5ea64215210a5ea64216210a5ea64217210a192a0218210a366d2a19210a366d2a1a210a192a021b210a192a021c210a4281351d210a4281351e210a4281351f210a192a0220210a192a0221210a192a02052209192a02062209192a02072209192a020a2209192a020b2209192a020c2209192a020d22095ea6420e22095ea6420f22094281351022094281351122094281351222094281351322094281351422094281351522095ea6421622095ea642172209192a02182209192a02192209192a021c2209192a021d2209192a021e2209192a02052308192a02062308192a02072308192a020a2308192a020b2308192a020c2308192a020d23085ea6420e23085ea6420f23084281351023084281351123084281351223084281351323084281351423084281351523085ea6421623085ea642172308192a02182308192a02192308192a021c2308192a021d2308192a021e2308192a02082407192a02092407192a020a2407192a020b2407192a020c24075ea6420d24074281350e24074281350f2407428135102407366d2a112407366d2a122407366d2a132407366d2a1424074281351524074281351624074281351724075ea642182407192a02192407192a021a2407192a021b2407192a02072506192a020825065ea6420925065ea6420a25065ea6420b25065ea6420c25064281350d25064281350e25064281350f2506366d2a102506192a02112506192a02122506192a02132506192a02142506366d2a1525064281351625064281351725064281351825065ea6421925065ea6421a25065ea6421b25065ea6421c2506192a02072605192a020826055ea6420926055ea6420a26055ea6420b26055ea6420c26054281350d26054281350e26054281350f2605366d2a102605192a02112605192a02122605192a02132605192a02142605366d2a1526054281351626054281351726054281351826055ea6421926055ea6421a26055ea6421b26055ea6421c2605192a02082704192a02092704192a020a2704192a020b2704192a020c2704192a020d2704192a020e2704192a020f2704192a02142704192a02152704192a02162704192a02172704192a02182704192a02192704192a021a2704192a021b2704192a02");
    const App$KL$Game$Hero$Octoking$Assets$base64_idle = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACMAAAAoCAYAAAB0HkOaAAAAAXNSR0IArs4c6QAAAmpJREFUWIXtV79P21AQ/ojYgI2BQOhGlQSVxVm6VFQRM4qQmiHhD2nEiEL/kHhIIxQxRxFsLPHSqsQqE01KOnQDVtwhuePej9gJUoWR/E3P7+6d7913P2wgQYIECRK8DBZmVUznUwEAjK4eF2xrwjT56Oox8l2peTz/31iMUqCbeaf7AADn4Cwof8gAAJoYBre9hqK/XqgqcnkOCI9QpDM6bnsNrBeqIAdHNy1F7p3uwzk4Y11dHobXRRNh0Ce/W0wZAHyr9BS9HbfA8tFNS5yLRqwiY00mvVwBIFd2DL2Td2+sRj9//2Xs9Zuesacns+FMOp8K6u0KP9dKLgCA9s693ywbXt9ZnclsrfD6o7NhtUN70qFY0cQJTNTU2xXl9gTbnozANOjn5HO9XUGt5HL/YWcoXLWSG+wd7RpGZ6EkTM+GWNMUWk0yQp3jCwDjqmp8yvB+9etQOavLqIpstiKrSXeKjPiXfwAAg67PZf6j+9N6brv4FsC4nDeLWQBA9v0aOzJtPsWKJus4kE2PEpJutry6xKH/InqGBPWUXNnhBJeJPe0bJ96RSedTAfE86PrGzfpNT+nGeilntlZYXiu5wCS/yE4f4DwC/EBGx2h6+gyy9Q1bA4ySSzvLq0vgdzU9pixeNMkxAJihtyXgcyBpknuHT5QGi3IMkBJRlSs73KCeeJ4P938fAACdSQXKNOgcX6AzWcePJlooNT9JKnXfNz64bNQNr++U4Tno+qodq+0xYhWZyL88/RN072hXiQjlBIHKFhgnKOUcIey/aeZBSdAdIRoIm8Ws4ZDEqxmUc9OkQ7/lvPoS/wCkW09PqnYt4QAAAABJRU5ErkJggg==";
    const App$KL$Game$Hero$Octoking$hero = App$KL$Game$Hero$new$("Octoking", (_player$1 => {
        var $1058 = App$KL$Game$Hero$Octoking$Assets$vbox_idle;
        return $1058;
    }), (_bool$1 => _time$2 => {
        var $1059 = App$KL$Game$Hero$Octoking$Assets$base64_idle;
        return $1059;
    }), 15, 10, List$nil);
    const App$KL$Game$Hero$list = List$cons$(App$KL$Game$Hero$Croni$hero, List$cons$(App$KL$Game$Hero$Cyclope$hero, List$cons$(App$KL$Game$Hero$Lela$hero, List$cons$(App$KL$Game$Hero$Octoking$hero, List$nil))));
    const App$KL$Game$Hero$get_by_id$map = NatMap$from_list$(List$imap$((_i$1 => _x$2 => {
        var $1060 = Pair$new$(_i$1, _x$2);
        return $1060;
    }), App$KL$Game$Hero$list));

    function App$KL$Game$Hero$get_by_id$(_id$1) {
        var $1061 = NatMap$get$(_id$1, App$KL$Game$Hero$get_by_id$map);
        return $1061;
    };
    const App$KL$Game$Hero$get_by_id = x0 => App$KL$Game$Hero$get_by_id$(x0);
    const U8$to_nat = a0 => (BigInt(a0));

    function U64$new$(_value$1) {
        var $1062 = word_to_u64(_value$1);
        return $1062;
    };
    const U64$new = x0 => U64$new$(x0);
    const U64$from_nat = a0 => (a0 & 0xFFFFFFFFFFFFFFFFn);
    const App$KL$Game$Stage$Draft$draw$cards$interrogation = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAn0lEQVQ4T8WUURKAIAhE44x1zO5og2mDKwiONflZ8tx1EdpeXuTwkvHfrBsBM+wsxD3dbKKnRK21gA1MqmTwCGoCq7IDPPN3Ae3qo8C6L30CZNFFeVwhOOXC5l5ngdgtXUgrQAuWuwhP9hqb9+cg6hKpT/WhPPgBejBVsvLUEDh0FbKsJG6OgAhwah5FgDhx1i17z01aCCmEQbGu8NdQLmHYLhXjuqBcAAAAAElFTkSuQmCC";

    function App$KL$Game$Stage$Draft$draw$cards$card$(_name$1, _image$2, _height$3) {
        var $1063 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("width", "100%"), List$cons$(Pair$new$("height", _height$3), List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("border", "5px solid #d6dadc"), List$cons$(Pair$new$("background-color", "#bac1c4"), List$cons$(Pair$new$("margin", "3%"), List$cons$(Pair$new$("border-radius", "5px"), List$cons$(Pair$new$("flex-direction", "column"), List$cons$(Pair$new$("justify-content", "space-between"), List$cons$(Pair$new$("align-items", "center"), List$cons$(Pair$new$("box-sizing", "border-box"), List$nil)))))))))))), List$cons$(DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("height", "10%"), List$cons$(Pair$new$("margin-top", "5%"), List$nil))), List$cons$(DOM$text$(_name$1), List$nil)), List$cons$(DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("width", "50%"), List$cons$(Pair$new$("height", "auto"), List$nil))), List$cons$(DOM$node$("img", Map$from_list$(List$cons$(Pair$new$("src", _image$2), List$nil)), Map$from_list$(List$cons$(Pair$new$("width", "100%"), List$cons$(Pair$new$("height", "auto"), List$cons$(Pair$new$("image-rendering", "pixelated"), List$nil)))), List$nil), List$nil)), List$cons$(DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("width", "100%"), List$cons$(Pair$new$("height", "40%"), List$cons$(Pair$new$("background-color", "#d6dadc"), List$nil)))), List$nil), List$nil))));
        return $1063;
    };
    const App$KL$Game$Stage$Draft$draw$cards$card = x0 => x1 => x2 => App$KL$Game$Stage$Draft$draw$cards$card$(x0, x1, x2);

    function App$KL$Game$Stage$Draft$draw$cards$player$(_hero$1) {
        var self = Maybe$default$(Maybe$monad$((_m$bind$2 => _m$pure$3 => {
            var $1065 = _m$bind$2;
            return $1065;
        }))(_hero$1)((_hero_id$2 => {
            var $1066 = Maybe$monad$((_m$bind$3 => _m$pure$4 => {
                var $1067 = _m$bind$3;
                return $1067;
            }))(App$KL$Game$Hero$get_by_id$((BigInt(_hero_id$2))))((_hero$3 => {
                var self = _hero$3;
                switch (self._) {
                    case 'App.KL.Game.Hero.new':
                        var $1069 = self.picture;
                        var $1070 = $1069;
                        var _picture$4 = $1070;
                        break;
                };
                var _picture$4 = _picture$4(Bool$false)(0n);
                var $1068 = Maybe$monad$((_m$bind$5 => _m$pure$6 => {
                    var $1071 = _m$pure$6;
                    return $1071;
                }))(Pair$new$((() => {
                    var self = _hero$3;
                    switch (self._) {
                        case 'App.KL.Game.Hero.new':
                            var $1072 = self.name;
                            var $1073 = $1072;
                            return $1073;
                    };
                })(), _picture$4));
                return $1068;
            }));
            return $1066;
        })), Pair$new$("Choosing", App$KL$Game$Stage$Draft$draw$cards$interrogation));
        switch (self._) {
            case 'Pair.new':
                var $1074 = self.fst;
                var $1075 = self.snd;
                var $1076 = App$KL$Game$Stage$Draft$draw$cards$card$($1074, $1075, "100%");
                var $1064 = $1076;
                break;
        };
        return $1064;
    };
    const App$KL$Game$Stage$Draft$draw$cards$player = x0 => App$KL$Game$Stage$Draft$draw$cards$player$(x0);

    function App$KL$Game$Stage$Draft$draw$cards$picks_left$(_hero$1) {
        var $1077 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("width", "40%"), List$cons$(Pair$new$("height", "100%"), List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("padding", "5%"), List$cons$(Pair$new$("box-sizing", "border-box"), List$nil)))))), List$cons$(App$KL$Game$Stage$Draft$draw$cards$player$(_hero$1), List$nil));
        return $1077;
    };
    const App$KL$Game$Stage$Draft$draw$cards$picks_left = x0 => App$KL$Game$Stage$Draft$draw$cards$picks_left$(x0);

    function App$KL$Game$Team$eql$(_a$1, _b$2) {
        var self = _a$1;
        switch (self._) {
            case 'App.KL.Game.Team.blue':
                var self = _b$2;
                switch (self._) {
                    case 'App.KL.Game.Team.blue':
                        var $1080 = Bool$true;
                        var $1079 = $1080;
                        break;
                    case 'App.KL.Game.Team.red':
                    case 'App.KL.Game.Team.neutral':
                        var $1081 = Bool$false;
                        var $1079 = $1081;
                        break;
                };
                var $1078 = $1079;
                break;
            case 'App.KL.Game.Team.red':
                var self = _b$2;
                switch (self._) {
                    case 'App.KL.Game.Team.blue':
                    case 'App.KL.Game.Team.neutral':
                        var $1083 = Bool$false;
                        var $1082 = $1083;
                        break;
                    case 'App.KL.Game.Team.red':
                        var $1084 = Bool$true;
                        var $1082 = $1084;
                        break;
                };
                var $1078 = $1082;
                break;
            case 'App.KL.Game.Team.neutral':
                var self = _b$2;
                switch (self._) {
                    case 'App.KL.Game.Team.blue':
                    case 'App.KL.Game.Team.red':
                        var $1086 = Bool$false;
                        var $1085 = $1086;
                        break;
                    case 'App.KL.Game.Team.neutral':
                        var $1087 = Bool$true;
                        var $1085 = $1087;
                        break;
                };
                var $1078 = $1085;
                break;
        };
        return $1078;
    };
    const App$KL$Game$Team$eql = x0 => x1 => App$KL$Game$Team$eql$(x0, x1);
    const List$length = a0 => (list_length(a0));
    const Nat$eql = a0 => a1 => (a0 === a1);

    function Nat$for$(_state$2, _from$3, _til$4, _func$5) {
        var Nat$for$ = (_state$2, _from$3, _til$4, _func$5) => ({
            ctr: 'TCO',
            arg: [_state$2, _from$3, _til$4, _func$5]
        });
        var Nat$for = _state$2 => _from$3 => _til$4 => _func$5 => Nat$for$(_state$2, _from$3, _til$4, _func$5);
        var arg = [_state$2, _from$3, _til$4, _func$5];
        while (true) {
            let [_state$2, _from$3, _til$4, _func$5] = arg;
            var R = (() => {
                var self = (_from$3 === _til$4);
                if (self) {
                    var $1088 = _state$2;
                    return $1088;
                } else {
                    var $1089 = Nat$for$(_func$5(_from$3)(_state$2), Nat$succ$(_from$3), _til$4, _func$5);
                    return $1089;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Nat$for = x0 => x1 => x2 => x3 => Nat$for$(x0, x1, x2, x3);
    const U8$eql = a0 => a1 => (a0 === a1);
    const U8$from_nat = a0 => (Number(a0) & 0xFF);

    function App$Kaelin$Hero$new$(_name$1, _assets$2, _max_hp$3, _max_ap$4, _skills$5) {
        var $1090 = ({
            _: 'App.Kaelin.Hero.new',
            'name': _name$1,
            'assets': _assets$2,
            'max_hp': _max_hp$3,
            'max_ap': _max_ap$4,
            'skills': _skills$5
        });
        return $1090;
    };
    const App$Kaelin$Hero$new = x0 => x1 => x2 => x3 => x4 => App$Kaelin$Hero$new$(x0, x1, x2, x3, x4);

    function App$Kaelin$HeroAssets$new$(_vbox$1, _base64$2) {
        var $1091 = ({
            _: 'App.Kaelin.HeroAssets.new',
            'vbox': _vbox$1,
            'base64': _base64$2
        });
        return $1091;
    };
    const App$Kaelin$HeroAssets$new = x0 => x1 => App$Kaelin$HeroAssets$new$(x0, x1);
    const App$Kaelin$Assets$hero$croni$vbox_idle = VoxBox$parse$("0f0b16351d4d100b16351d4d0d0c15351d4d0e0c15351d4d0f0c156a3a86100c158e4a9d110c15351d4d120c15351d4d0c0d14351d4d0d0d146a3a860e0d146a3a860f0d148e4a9d100d146a3a86110d146a3a86120d146a3a86130d14351d4d0b0e13351d4d0c0e136a3a860d0e136a3a860e0e136a3a860f0e136a3a86100e136a3a86110e136a3a86120e136a3a86130e136a3a86140e13351d4d0a0f12351d4d0b0f126a3a860c0f126a3a860d0f126a3a860e0f126a3a860f0f126a3a86100f126a3a86110f126a3a86120f126a3a86130f126a3a86140f126a3a86150f12351d4d0a1011351d4d0b10116a3a860c10116a3a860d10116a3a860e10116a3a860f10116a3a861010116a3a861110116a3a861210116a3a861310116a3a861410116a3a86151011351d4d091110351d4d0a11106a3a860b11106a3a860c11106a3a860d11106a3a860e11106a3a860f11106a3a861011106a3a861111106a3a861211106a3a861311106a3a861411106a3a861511106a3a86161110351d4d09120f351d4d0a120f6a3a860b120f6a3a860c120f602d800d120f602d800e120f6a3a860f120f6a3a8610120f6a3a8611120f6a3a8612120f602d8013120f602d8014120f6a3a8615120f6a3a8616120f351d4d09130e351d4d0a130e602d800b130e602d800c130e351d4d0d130e351d4d0e130e6a3a860f130e6a3a8610130e6a3a8611130e6a3a8612130e351d4d13130e351d4d14130e602d8015130e602d8016130e351d4d09140d351d4d0a140d602d800b140d351d4d0c140d351d4d0d140d531e480e140d351d4d0f140d6a3a8610140d6a3a8611140d351d4d12140d531e4813140d351d4d14140d351d4d15140d4a358016140d351d4d09150c351d4d0a150c4a35800b150c351d4d0c150c531e480d150cdf3e460e150c531e480f150c351d4d10150c351d4d11150c531e4812150cdf3e4613150c531e4814150c351d4d15150c4a358016150c351d4d0a160b351d4d0b160b4a35800c160b351d4d0d160b531e480e160b351d4d0f160b351d4d10160b351d4d11160b351d4d12160b531e4813160b351d4d14160b4a358015160b351d4d0b170a351d4d0c170a4a35800d170a8e4a9d0e170a351d4d0f170a351d4d10170a351d4d11170a351d4d12170a8e4a9d13170a4a358014170a351d4d0d1809351d4d0e1809602d800f1809602d801018094a3580111809602d80121809351d4d0c1908351d4d0d19086a3a860e19086a3a860f19086a3a861019084a35801119086a3a861219086a3a86131908351d4d0c1a07351d4d0d1a076a3a860e1a076a3a860f1a076a3a86101a074a3580111a076a3a86121a076a3a86131a07351d4d0c1b06351d4d0d1b068e4a9d0e1b066a3a860f1b066a3a86101b064a3580111b066a3a86121b068e4a9d131b06351d4d0d1c05351d4d0e1c05351d4d0f1c05351d4d101c05351d4d111c05351d4d121c05351d4d111d04351d4d121d04351d4d");
    const App$Kaelin$Assets$hero$croni$base64_idle = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB8AAAAeCAYAAADU8sWcAAAAAXNSR0IArs4c6QAAATtJREFUSIntlr1qwzAURo9KW0Ih4MVNFpsO2dLNeAh5hox9qz5MIQ/hwWQq3TpFS5ssgUBaLKg6uDI1/YmuSGgHf4vhk6xzr66vZOjUqVOnTv9NeTKzeTKzoe+fhkLr54RRNACwAKWeK8k6oskOnCcTAEbRgMfNczNW6kIUgAj+GfyTJAF4w33A0gBOfOHHkFfmkqydfLIXZ77bVuy2lbf/m7xbzS38sFkAkPfbO+H8MZk3XJS5A6TKUOqi8UtdkCrTzFn1Dgx3C6bKcHv11gTgwM6TSNRq8TBj/bQgVYalPWuNO8/N8Wk175qXeq5ysPEwYxonLO/vWuPT6xte1tobDAHHK9S7MI7qD2vVg8vXutbSs118sXzpeVNx0T93X7+VBPCnJ1wQ/OMa3evtU3DNv/OlNT+IQv9o3gF/BY+h0RNEhAAAAABJRU5ErkJggg==";
    const App$Kaelin$Assets$hero$croni = App$Kaelin$HeroAssets$new$(App$Kaelin$Assets$hero$croni$vbox_idle, App$Kaelin$Assets$hero$croni$base64_idle);

    function App$Kaelin$Skill$new$(_name$1, _range$2, _ap_cost$3, _effect$4, _key$5) {
        var $1092 = ({
            _: 'App.Kaelin.Skill.new',
            'name': _name$1,
            'range': _range$2,
            'ap_cost': _ap_cost$3,
            'effect': _effect$4,
            'key': _key$5
        });
        return $1092;
    };
    const App$Kaelin$Skill$new = x0 => x1 => x2 => x3 => x4 => App$Kaelin$Skill$new$(x0, x1, x2, x3, x4);

    function App$Kaelin$Effect$Result$(_A$1) {
        var $1093 = null;
        return $1093;
    };
    const App$Kaelin$Effect$Result = x0 => App$Kaelin$Effect$Result$(x0);

    function List$concat$(_as$2, _bs$3) {
        var self = _as$2;
        switch (self._) {
            case 'List.cons':
                var $1095 = self.head;
                var $1096 = self.tail;
                var $1097 = List$cons$($1095, List$concat$($1096, _bs$3));
                var $1094 = $1097;
                break;
            case 'List.nil':
                var $1098 = _bs$3;
                var $1094 = $1098;
                break;
        };
        return $1094;
    };
    const List$concat = x0 => x1 => List$concat$(x0, x1);

    function BitsMap$union$(_a$2, _b$3) {
        var self = _a$2;
        switch (self._) {
            case 'BitsMap.tie':
                var $1100 = self.val;
                var $1101 = self.lft;
                var $1102 = self.rgt;
                var self = _b$3;
                switch (self._) {
                    case 'BitsMap.tie':
                        var $1104 = self.val;
                        var $1105 = self.lft;
                        var $1106 = self.rgt;
                        var self = $1100;
                        switch (self._) {
                            case 'Maybe.none':
                                var $1108 = BitsMap$tie$($1104, BitsMap$union$($1101, $1105), BitsMap$union$($1102, $1106));
                                var $1107 = $1108;
                                break;
                            case 'Maybe.some':
                                var $1109 = BitsMap$tie$($1100, BitsMap$union$($1101, $1105), BitsMap$union$($1102, $1106));
                                var $1107 = $1109;
                                break;
                        };
                        var $1103 = $1107;
                        break;
                    case 'BitsMap.new':
                        var $1110 = _a$2;
                        var $1103 = $1110;
                        break;
                };
                var $1099 = $1103;
                break;
            case 'BitsMap.new':
                var $1111 = _b$3;
                var $1099 = $1111;
                break;
        };
        return $1099;
    };
    const BitsMap$union = x0 => x1 => BitsMap$union$(x0, x1);

    function NatMap$union$(_a$2, _b$3) {
        var $1112 = BitsMap$union$(_a$2, _b$3);
        return $1112;
    };
    const NatMap$union = x0 => x1 => NatMap$union$(x0, x1);

    function App$Kaelin$Effect$Result$new$(_value$2, _map$3, _futures$4, _indicators$5) {
        var $1113 = ({
            _: 'App.Kaelin.Effect.Result.new',
            'value': _value$2,
            'map': _map$3,
            'futures': _futures$4,
            'indicators': _indicators$5
        });
        return $1113;
    };
    const App$Kaelin$Effect$Result$new = x0 => x1 => x2 => x3 => App$Kaelin$Effect$Result$new$(x0, x1, x2, x3);

    function App$Kaelin$Effect$bind$(_effect$3, _next$4, _center$5, _target$6, _map$7) {
        var self = _effect$3(_center$5)(_target$6)(_map$7);
        switch (self._) {
            case 'App.Kaelin.Effect.Result.new':
                var $1115 = self.value;
                var $1116 = self.map;
                var $1117 = self.futures;
                var $1118 = self.indicators;
                var self = _next$4($1115)(_center$5)(_target$6)($1116);
                switch (self._) {
                    case 'App.Kaelin.Effect.Result.new':
                        var $1120 = self.value;
                        var $1121 = self.map;
                        var $1122 = self.futures;
                        var $1123 = self.indicators;
                        var _value$16 = $1120;
                        var _map$17 = $1121;
                        var _futures$18 = List$concat$($1117, $1122);
                        var _indicators$19 = NatMap$union$($1118, $1123);
                        var $1124 = App$Kaelin$Effect$Result$new$(_value$16, _map$17, _futures$18, _indicators$19);
                        var $1119 = $1124;
                        break;
                };
                var $1114 = $1119;
                break;
        };
        return $1114;
    };
    const App$Kaelin$Effect$bind = x0 => x1 => x2 => x3 => x4 => App$Kaelin$Effect$bind$(x0, x1, x2, x3, x4);
    const NatMap$new = BitsMap$new;

    function App$Kaelin$Effect$pure$(_value$2, _center$3, _target$4, _map$5) {
        var $1125 = App$Kaelin$Effect$Result$new$(_value$2, _map$5, List$nil, NatMap$new);
        return $1125;
    };
    const App$Kaelin$Effect$pure = x0 => x1 => x2 => x3 => App$Kaelin$Effect$pure$(x0, x1, x2, x3);

    function App$Kaelin$Effect$monad$(_new$2) {
        var $1126 = _new$2(App$Kaelin$Effect$bind)(App$Kaelin$Effect$pure);
        return $1126;
    };
    const App$Kaelin$Effect$monad = x0 => App$Kaelin$Effect$monad$(x0);

    function App$Kaelin$Effect$coord$get_center$(_center$1, _target$2, _map$3) {
        var $1127 = App$Kaelin$Effect$Result$new$(_center$1, _map$3, List$nil, NatMap$new);
        return $1127;
    };
    const App$Kaelin$Effect$coord$get_center = x0 => x1 => x2 => App$Kaelin$Effect$coord$get_center$(x0, x1, x2);

    function App$Kaelin$Effect$coord$get_target$(_center$1, _target$2, _map$3) {
        var $1128 = App$Kaelin$Effect$Result$new$(_target$2, _map$3, List$nil, NatMap$new);
        return $1128;
    };
    const App$Kaelin$Effect$coord$get_target = x0 => x1 => x2 => App$Kaelin$Effect$coord$get_target$(x0, x1, x2);

    function App$Kaelin$Effect$map$get$(_center$1, _target$2, _map$3) {
        var $1129 = App$Kaelin$Effect$Result$new$(_map$3, _map$3, List$nil, NatMap$new);
        return $1129;
    };
    const App$Kaelin$Effect$map$get = x0 => x1 => x2 => App$Kaelin$Effect$map$get$(x0, x1, x2);

    function App$Kaelin$Coord$eql$(_a$1, _b$2) {
        var self = _a$1;
        switch (self._) {
            case 'App.Kaelin.Coord.new':
                var $1131 = self.i;
                var $1132 = self.j;
                var self = _b$2;
                switch (self._) {
                    case 'App.Kaelin.Coord.new':
                        var $1134 = self.i;
                        var $1135 = self.j;
                        var $1136 = (($1131 === $1134) && ($1132 === $1135));
                        var $1133 = $1136;
                        break;
                };
                var $1130 = $1133;
                break;
        };
        return $1130;
    };
    const App$Kaelin$Coord$eql = x0 => x1 => App$Kaelin$Coord$eql$(x0, x1);

    function App$Kaelin$Coord$Convert$axial_to_nat$(_coord$1) {
        var self = _coord$1;
        switch (self._) {
            case 'App.Kaelin.Coord.new':
                var $1138 = self.i;
                var $1139 = self.j;
                var _i$4 = (($1138 + 100) >> 0);
                var _i$5 = ((_i$4 * 1000) >> 0);
                var _i$6 = I32$to_u32$(_i$5);
                var _j$7 = (($1139 + 100) >> 0);
                var _j$8 = I32$to_u32$(_j$7);
                var _sum$9 = ((_i$6 + _j$8) >>> 0);
                var $1140 = (BigInt(_sum$9));
                var $1137 = $1140;
                break;
        };
        return $1137;
    };
    const App$Kaelin$Coord$Convert$axial_to_nat = x0 => App$Kaelin$Coord$Convert$axial_to_nat$(x0);

    function App$Kaelin$Map$get$(_coord$1, _map$2) {
        var _key$3 = App$Kaelin$Coord$Convert$axial_to_nat$(_coord$1);
        var $1141 = NatMap$get$(_key$3, _map$2);
        return $1141;
    };
    const App$Kaelin$Map$get = x0 => x1 => App$Kaelin$Map$get$(x0, x1);

    function App$Kaelin$Map$is_occupied$(_coord$1, _map$2) {
        var _maybe_tile$3 = App$Kaelin$Map$get$(_coord$1, _map$2);
        var self = _maybe_tile$3;
        switch (self._) {
            case 'Maybe.some':
                var $1143 = self.value;
                var self = $1143;
                switch (self._) {
                    case 'App.Kaelin.Tile.new':
                        var $1145 = self.creature;
                        var self = $1145;
                        switch (self._) {
                            case 'Maybe.none':
                                var $1147 = Bool$false;
                                var $1146 = $1147;
                                break;
                            case 'Maybe.some':
                                var $1148 = Bool$true;
                                var $1146 = $1148;
                                break;
                        };
                        var $1144 = $1146;
                        break;
                };
                var $1142 = $1144;
                break;
            case 'Maybe.none':
                var $1149 = Bool$false;
                var $1142 = $1149;
                break;
        };
        return $1142;
    };
    const App$Kaelin$Map$is_occupied = x0 => x1 => App$Kaelin$Map$is_occupied$(x0, x1);

    function App$Kaelin$Effect$(_A$1) {
        var $1150 = null;
        return $1150;
    };
    const App$Kaelin$Effect = x0 => App$Kaelin$Effect$(x0);

    function App$Kaelin$Map$creature$get$(_coord$1, _map$2) {
        var _key$3 = App$Kaelin$Coord$Convert$axial_to_nat$(_coord$1);
        var _tile$4 = NatMap$get$(_key$3, _map$2);
        var self = _tile$4;
        switch (self._) {
            case 'Maybe.some':
                var $1152 = self.value;
                var self = $1152;
                switch (self._) {
                    case 'App.Kaelin.Tile.new':
                        var $1154 = self.creature;
                        var $1155 = $1154;
                        var $1153 = $1155;
                        break;
                };
                var $1151 = $1153;
                break;
            case 'Maybe.none':
                var $1156 = Maybe$none;
                var $1151 = $1156;
                break;
        };
        return $1151;
    };
    const App$Kaelin$Map$creature$get = x0 => x1 => App$Kaelin$Map$creature$get$(x0, x1);

    function App$Kaelin$Tile$new$(_background$1, _creature$2, _animation$3) {
        var $1157 = ({
            _: 'App.Kaelin.Tile.new',
            'background': _background$1,
            'creature': _creature$2,
            'animation': _animation$3
        });
        return $1157;
    };
    const App$Kaelin$Tile$new = x0 => x1 => x2 => App$Kaelin$Tile$new$(x0, x1, x2);

    function NatMap$set$(_key$2, _val$3, _map$4) {
        var $1158 = (bitsmap_set((nat_to_bits(_key$2)), _val$3, _map$4, 'set'));
        return $1158;
    };
    const NatMap$set = x0 => x1 => x2 => NatMap$set$(x0, x1, x2);

    function App$Kaelin$Map$creature$modify_at$(_mod$1, _pos$2, _map$3) {
        var _key$4 = App$Kaelin$Coord$Convert$axial_to_nat$(_pos$2);
        var _result$4 = Maybe$monad$((_m$bind$5 => _m$pure$6 => {
            var $1160 = _m$bind$5;
            return $1160;
        }))(NatMap$get$(_key$4, _map$3))((_tile$5 => {
            var $1161 = Maybe$monad$((_m$bind$6 => _m$pure$7 => {
                var $1162 = _m$bind$6;
                return $1162;
            }))((() => {
                var self = _tile$5;
                switch (self._) {
                    case 'App.Kaelin.Tile.new':
                        var $1163 = self.creature;
                        var $1164 = $1163;
                        return $1164;
                };
            })())((_creature$6 => {
                var _new_creature$7 = _mod$1(_creature$6);
                var _new_tile$8 = App$Kaelin$Tile$new$((() => {
                    var self = _tile$5;
                    switch (self._) {
                        case 'App.Kaelin.Tile.new':
                            var $1166 = self.background;
                            var $1167 = $1166;
                            return $1167;
                    };
                })(), Maybe$some$(_new_creature$7), (() => {
                    var self = _tile$5;
                    switch (self._) {
                        case 'App.Kaelin.Tile.new':
                            var $1168 = self.animation;
                            var $1169 = $1168;
                            return $1169;
                    };
                })());
                var _new_map$9 = NatMap$set$(_key$4, _new_tile$8, _map$3);
                var $1165 = Maybe$monad$((_m$bind$10 => _m$pure$11 => {
                    var $1170 = _m$pure$11;
                    return $1170;
                }))(_new_map$9);
                return $1165;
            }));
            return $1161;
        }));
        var $1159 = Maybe$default$(_result$4, _map$3);
        return $1159;
    };
    const App$Kaelin$Map$creature$modify_at = x0 => x1 => x2 => App$Kaelin$Map$creature$modify_at$(x0, x1, x2);

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
                        var $1171 = self.pred;
                        var $1172 = Word$is_neg$go$($1171, Bool$false);
                        return $1172;
                    case 'Word.i':
                        var $1173 = self.pred;
                        var $1174 = Word$is_neg$go$($1173, Bool$true);
                        return $1174;
                    case 'Word.e':
                        var $1175 = _n$3;
                        return $1175;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Word$is_neg$go = x0 => x1 => Word$is_neg$go$(x0, x1);

    function Word$is_neg$(_word$2) {
        var $1176 = Word$is_neg$go$(_word$2, Bool$false);
        return $1176;
    };
    const Word$is_neg = x0 => Word$is_neg$(x0);

    function Cmp$as_lte$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
            case 'Cmp.eql':
                var $1178 = Bool$true;
                var $1177 = $1178;
                break;
            case 'Cmp.gtn':
                var $1179 = Bool$false;
                var $1177 = $1179;
                break;
        };
        return $1177;
    };
    const Cmp$as_lte = x0 => Cmp$as_lte$(x0);

    function Cmp$inv$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
                var $1181 = Cmp$gtn;
                var $1180 = $1181;
                break;
            case 'Cmp.eql':
                var $1182 = Cmp$eql;
                var $1180 = $1182;
                break;
            case 'Cmp.gtn':
                var $1183 = Cmp$ltn;
                var $1180 = $1183;
                break;
        };
        return $1180;
    };
    const Cmp$inv = x0 => Cmp$inv$(x0);

    function Word$s_lte$(_a$2, _b$3) {
        var _neg_a$4 = Word$is_neg$(_a$2);
        var _neg_b$5 = Word$is_neg$(_b$3);
        var self = _neg_a$4;
        if (self) {
            var self = _neg_b$5;
            if (self) {
                var $1186 = Cmp$as_lte$(Cmp$inv$(Word$cmp$(_a$2, _b$3)));
                var $1185 = $1186;
            } else {
                var $1187 = Bool$true;
                var $1185 = $1187;
            };
            var $1184 = $1185;
        } else {
            var self = _neg_b$5;
            if (self) {
                var $1189 = Bool$false;
                var $1188 = $1189;
            } else {
                var $1190 = Cmp$as_lte$(Word$cmp$(_a$2, _b$3));
                var $1188 = $1190;
            };
            var $1184 = $1188;
        };
        return $1184;
    };
    const Word$s_lte = x0 => x1 => Word$s_lte$(x0, x1);
    const I32$lte = a0 => a1 => (a0 <= a1);

    function Word$s_ltn$(_a$2, _b$3) {
        var _neg_a$4 = Word$is_neg$(_a$2);
        var _neg_b$5 = Word$is_neg$(_b$3);
        var self = _neg_a$4;
        if (self) {
            var self = _neg_b$5;
            if (self) {
                var $1193 = Cmp$as_ltn$(Cmp$inv$(Word$cmp$(_a$2, _b$3)));
                var $1192 = $1193;
            } else {
                var $1194 = Bool$true;
                var $1192 = $1194;
            };
            var $1191 = $1192;
        } else {
            var self = _neg_b$5;
            if (self) {
                var $1196 = Bool$false;
                var $1195 = $1196;
            } else {
                var $1197 = Cmp$as_ltn$(Word$cmp$(_a$2, _b$3));
                var $1195 = $1197;
            };
            var $1191 = $1195;
        };
        return $1191;
    };
    const Word$s_ltn = x0 => x1 => Word$s_ltn$(x0, x1);
    const I32$ltn = a0 => a1 => (a0 < a1);

    function I32$min$(_a$1, _b$2) {
        var self = (_a$1 < _b$2);
        if (self) {
            var $1199 = _a$1;
            var $1198 = $1199;
        } else {
            var $1200 = _b$2;
            var $1198 = $1200;
        };
        return $1198;
    };
    const I32$min = x0 => x1 => I32$min$(x0, x1);

    function App$Kaelin$Creature$new$(_player$1, _hero$2, _team$3, _hp$4, _ap$5, _status$6) {
        var $1201 = ({
            _: 'App.Kaelin.Creature.new',
            'player': _player$1,
            'hero': _hero$2,
            'team': _team$3,
            'hp': _hp$4,
            'ap': _ap$5,
            'status': _status$6
        });
        return $1201;
    };
    const App$Kaelin$Creature$new = x0 => x1 => x2 => x3 => x4 => x5 => App$Kaelin$Creature$new$(x0, x1, x2, x3, x4, x5);

    function App$Kaelin$Tile$creature$change_hp$(_change$1, _creature$2) {
        var self = _creature$2;
        switch (self._) {
            case 'App.Kaelin.Creature.new':
                var $1203 = self.hero;
                var $1204 = self.hp;
                var self = $1203;
                switch (self._) {
                    case 'App.Kaelin.Hero.new':
                        var $1206 = self.max_hp;
                        var self = ($1204 <= 0);
                        if (self) {
                            var $1208 = _creature$2;
                            var $1207 = $1208;
                        } else {
                            var self = _creature$2;
                            switch (self._) {
                                case 'App.Kaelin.Creature.new':
                                    var $1210 = self.player;
                                    var $1211 = self.hero;
                                    var $1212 = self.team;
                                    var $1213 = self.ap;
                                    var $1214 = self.status;
                                    var $1215 = App$Kaelin$Creature$new$($1210, $1211, $1212, I32$min$((($1204 + _change$1) >> 0), $1206), $1213, $1214);
                                    var $1209 = $1215;
                                    break;
                            };
                            var $1207 = $1209;
                        };
                        var $1205 = $1207;
                        break;
                };
                var $1202 = $1205;
                break;
        };
        return $1202;
    };
    const App$Kaelin$Tile$creature$change_hp = x0 => x1 => App$Kaelin$Tile$creature$change_hp$(x0, x1);

    function App$Kaelin$Map$creature$remove$(_coord$1, _map$2) {
        var _key$3 = App$Kaelin$Coord$Convert$axial_to_nat$(_coord$1);
        var _tile$4 = NatMap$get$(_key$3, _map$2);
        var self = _tile$4;
        switch (self._) {
            case 'Maybe.some':
                var $1217 = self.value;
                var self = $1217;
                switch (self._) {
                    case 'App.Kaelin.Tile.new':
                        var $1219 = self.background;
                        var $1220 = self.animation;
                        var $1221 = App$Kaelin$Tile$new$($1219, Maybe$none, $1220);
                        var _new_tile$6 = $1221;
                        break;
                };
                var $1218 = NatMap$set$(_key$3, _new_tile$6, _map$2);
                var $1216 = $1218;
                break;
            case 'Maybe.none':
                var $1222 = _map$2;
                var $1216 = $1222;
                break;
        };
        return $1216;
    };
    const App$Kaelin$Map$creature$remove = x0 => x1 => App$Kaelin$Map$creature$remove$(x0, x1);

    function Word$s_gtn$(_a$2, _b$3) {
        var _neg_a$4 = Word$is_neg$(_a$2);
        var _neg_b$5 = Word$is_neg$(_b$3);
        var self = _neg_a$4;
        if (self) {
            var self = _neg_b$5;
            if (self) {
                var $1225 = Cmp$as_gtn$(Cmp$inv$(Word$cmp$(_a$2, _b$3)));
                var $1224 = $1225;
            } else {
                var $1226 = Bool$false;
                var $1224 = $1226;
            };
            var $1223 = $1224;
        } else {
            var self = _neg_b$5;
            if (self) {
                var $1228 = Bool$true;
                var $1227 = $1228;
            } else {
                var $1229 = Cmp$as_gtn$(Word$cmp$(_a$2, _b$3));
                var $1227 = $1229;
            };
            var $1223 = $1227;
        };
        return $1223;
    };
    const Word$s_gtn = x0 => x1 => Word$s_gtn$(x0, x1);
    const I32$gtn = a0 => a1 => (a0 > a1);

    function I32$max$(_a$1, _b$2) {
        var self = (_a$1 > _b$2);
        if (self) {
            var $1231 = _a$1;
            var $1230 = $1231;
        } else {
            var $1232 = _b$2;
            var $1230 = $1232;
        };
        return $1230;
    };
    const I32$max = x0 => x1 => I32$max$(x0, x1);

    function App$Kaelin$Map$creature$change_hp_at$(_value$1, _pos$2, _map$3) {
        var _creature$4 = App$Kaelin$Map$creature$get$(_pos$2, _map$3);
        var self = _creature$4;
        switch (self._) {
            case 'Maybe.some':
                var $1234 = self.value;
                var self = $1234;
                switch (self._) {
                    case 'App.Kaelin.Creature.new':
                        var $1236 = self.hero;
                        var self = $1236;
                        switch (self._) {
                            case 'App.Kaelin.Hero.new':
                                var $1238 = self.max_hp;
                                var self = (0 === (() => {
                                    var self = $1234;
                                    switch (self._) {
                                        case 'App.Kaelin.Creature.new':
                                            var $1240 = self.hp;
                                            var $1241 = $1240;
                                            return $1241;
                                    };
                                })());
                                if (self) {
                                    var $1242 = Pair$new$(0, App$Kaelin$Map$creature$remove$(_pos$2, _map$3));
                                    var $1239 = $1242;
                                } else {
                                    var _new_hp$17 = I32$max$((((() => {
                                        var self = $1234;
                                        switch (self._) {
                                            case 'App.Kaelin.Creature.new':
                                                var $1244 = self.hp;
                                                var $1245 = $1244;
                                                return $1245;
                                        };
                                    })() + _value$1) >> 0), 0);
                                    var _new_hp$18 = I32$min$(_new_hp$17, $1238);
                                    var _hp_diff$19 = ((_new_hp$18 - (() => {
                                        var self = $1234;
                                        switch (self._) {
                                            case 'App.Kaelin.Creature.new':
                                                var $1246 = self.hp;
                                                var $1247 = $1246;
                                                return $1247;
                                        };
                                    })()) >> 0);
                                    var _map$20 = App$Kaelin$Map$creature$modify_at$(App$Kaelin$Tile$creature$change_hp(_hp_diff$19), _pos$2, _map$3);
                                    var $1243 = Pair$new$(_hp_diff$19, _map$20);
                                    var $1239 = $1243;
                                };
                                var $1237 = $1239;
                                break;
                        };
                        var $1235 = $1237;
                        break;
                };
                var $1233 = $1235;
                break;
            case 'Maybe.none':
                var _map$5 = App$Kaelin$Map$creature$modify_at$(App$Kaelin$Tile$creature$change_hp(_value$1), _pos$2, _map$3);
                var $1248 = Pair$new$(_value$1, _map$5);
                var $1233 = $1248;
                break;
        };
        return $1233;
    };
    const App$Kaelin$Map$creature$change_hp_at = x0 => x1 => x2 => App$Kaelin$Map$creature$change_hp_at$(x0, x1, x2);

    function App$Kaelin$Effect$map$set$(_new_map$1, _center$2, _target$3, _map$4) {
        var $1249 = App$Kaelin$Effect$Result$new$(Unit$new, _new_map$1, List$nil, NatMap$new);
        return $1249;
    };
    const App$Kaelin$Effect$map$set = x0 => x1 => x2 => x3 => App$Kaelin$Effect$map$set$(x0, x1, x2, x3);

    function App$Kaelin$Effect$indicators$add$(_indicators$1, _center$2, _target$3, _map$4) {
        var $1250 = App$Kaelin$Effect$Result$new$(Unit$new, _map$4, List$nil, _indicators$1);
        return $1250;
    };
    const App$Kaelin$Effect$indicators$add = x0 => x1 => x2 => x3 => App$Kaelin$Effect$indicators$add$(x0, x1, x2, x3);
    const App$Kaelin$Indicator$green = ({
        _: 'App.Kaelin.Indicator.green'
    });
    const App$Kaelin$Indicator$red = ({
        _: 'App.Kaelin.Indicator.red'
    });

    function App$Kaelin$Effect$hp$change_at$(_change$1, _pos$2) {
        var $1251 = App$Kaelin$Effect$monad$((_m$bind$3 => _m$pure$4 => {
            var $1252 = _m$bind$3;
            return $1252;
        }))(App$Kaelin$Effect$map$get)((_map$3 => {
            var $1253 = App$Kaelin$Effect$monad$((_m$bind$4 => _m$pure$5 => {
                var $1254 = _m$bind$4;
                return $1254;
            }))(App$Kaelin$Effect$coord$get_center)((_center_pos$4 => {
                var _key$5 = App$Kaelin$Coord$Convert$axial_to_nat$(_pos$2);
                var _res$6 = App$Kaelin$Map$creature$change_hp_at$(_change$1, _pos$2, _map$3);
                var self = _res$6;
                switch (self._) {
                    case 'Pair.new':
                        var $1256 = self.fst;
                        var $1257 = $1256;
                        var _dhp$7 = $1257;
                        break;
                };
                var self = _res$6;
                switch (self._) {
                    case 'Pair.new':
                        var $1258 = self.snd;
                        var $1259 = $1258;
                        var _map$8 = $1259;
                        break;
                };
                var _indicators$9 = NatMap$new;
                var $1255 = App$Kaelin$Effect$monad$((_m$bind$10 => _m$pure$11 => {
                    var $1260 = _m$bind$10;
                    return $1260;
                }))(App$Kaelin$Effect$map$set(_map$8))((_$10 => {
                    var $1261 = App$Kaelin$Effect$monad$((_m$bind$11 => _m$pure$12 => {
                        var $1262 = _m$bind$11;
                        return $1262;
                    }))((() => {
                        var self = (_dhp$7 > 0);
                        if (self) {
                            var $1263 = App$Kaelin$Effect$indicators$add(NatMap$set$(_key$5, App$Kaelin$Indicator$green, _indicators$9));
                            return $1263;
                        } else {
                            var self = (_dhp$7 < 0);
                            if (self) {
                                var $1265 = App$Kaelin$Effect$indicators$add(NatMap$set$(_key$5, App$Kaelin$Indicator$red, _indicators$9));
                                var $1264 = $1265;
                            } else {
                                var $1266 = App$Kaelin$Effect$monad$((_m$bind$11 => _m$pure$12 => {
                                    var $1267 = _m$pure$12;
                                    return $1267;
                                }))(Unit$new);
                                var $1264 = $1266;
                            };
                            return $1264;
                        };
                    })())((_$11 => {
                        var $1268 = App$Kaelin$Effect$monad$((_m$bind$12 => _m$pure$13 => {
                            var $1269 = _m$pure$13;
                            return $1269;
                        }))(_dhp$7);
                        return $1268;
                    }));
                    return $1261;
                }));
                return $1255;
            }));
            return $1253;
        }));
        return $1251;
    };
    const App$Kaelin$Effect$hp$change_at = x0 => x1 => App$Kaelin$Effect$hp$change_at$(x0, x1);

    function App$Kaelin$Effect$hp$damage_at$(_dmg$1, _pos$2) {
        var $1270 = App$Kaelin$Effect$hp$change_at$(((-_dmg$1)), _pos$2);
        return $1270;
    };
    const App$Kaelin$Effect$hp$damage_at = x0 => x1 => App$Kaelin$Effect$hp$damage_at$(x0, x1);

    function App$Kaelin$Skill$get$(_key$1, _creature$2) {
        var self = _creature$2;
        switch (self._) {
            case 'App.Kaelin.Creature.new':
                var $1272 = self.hero;
                var $1273 = List$find$((_x$9 => {
                    var $1274 = ((() => {
                        var self = _x$9;
                        switch (self._) {
                            case 'App.Kaelin.Skill.new':
                                var $1275 = self.key;
                                var $1276 = $1275;
                                return $1276;
                        };
                    })() === _key$1);
                    return $1274;
                }), (() => {
                    var self = $1272;
                    switch (self._) {
                        case 'App.Kaelin.Hero.new':
                            var $1277 = self.skills;
                            var $1278 = $1277;
                            return $1278;
                    };
                })());
                var $1271 = $1273;
                break;
        };
        return $1271;
    };
    const App$Kaelin$Skill$get = x0 => x1 => App$Kaelin$Skill$get$(x0, x1);

    function App$Kaelin$Tile$creature$change_ap$(_key$1, _creature$2) {
        var self = _creature$2;
        switch (self._) {
            case 'App.Kaelin.Creature.new':
                var $1280 = self.hero;
                var $1281 = self.hp;
                var $1282 = self.ap;
                var self = $1280;
                switch (self._) {
                    case 'App.Kaelin.Hero.new':
                        var $1284 = self.max_ap;
                        var self = ($1281 <= 0);
                        if (self) {
                            var $1286 = _creature$2;
                            var $1285 = $1286;
                        } else {
                            var _skill$14 = App$Kaelin$Skill$get$(_key$1, _creature$2);
                            var self = _skill$14;
                            switch (self._) {
                                case 'Maybe.some':
                                    var $1288 = self.value;
                                    var self = $1288;
                                    switch (self._) {
                                        case 'App.Kaelin.Skill.new':
                                            var $1290 = self.ap_cost;
                                            var _new_ap$21 = I32$max$((($1282 - $1290) >> 0), 0);
                                            var _new_ap$22 = I32$min$(_new_ap$21, $1284);
                                            var _ap_diff$23 = ((_new_ap$22 - $1282) >> 0);
                                            var _new_ap$24 = I32$min$((($1282 + _ap_diff$23) >> 0), $1284);
                                            var self = _creature$2;
                                            switch (self._) {
                                                case 'App.Kaelin.Creature.new':
                                                    var $1292 = self.player;
                                                    var $1293 = self.hero;
                                                    var $1294 = self.team;
                                                    var $1295 = self.hp;
                                                    var $1296 = self.status;
                                                    var $1297 = App$Kaelin$Creature$new$($1292, $1293, $1294, $1295, _new_ap$24, $1296);
                                                    var $1291 = $1297;
                                                    break;
                                            };
                                            var $1289 = $1291;
                                            break;
                                    };
                                    var $1287 = $1289;
                                    break;
                                case 'Maybe.none':
                                    var $1298 = _creature$2;
                                    var $1287 = $1298;
                                    break;
                            };
                            var $1285 = $1287;
                        };
                        var $1283 = $1285;
                        break;
                };
                var $1279 = $1283;
                break;
        };
        return $1279;
    };
    const App$Kaelin$Tile$creature$change_ap = x0 => x1 => App$Kaelin$Tile$creature$change_ap$(x0, x1);

    function App$Kaelin$Map$creature$change_ap_at$(_key$1, _pos$2, _map$3) {
        var _creature$4 = App$Kaelin$Map$creature$get$(_pos$2, _map$3);
        var self = _creature$4;
        switch (self._) {
            case 'Maybe.some':
                var $1300 = self.value;
                var _skill$6 = App$Kaelin$Skill$get$(_key$1, $1300);
                var self = _skill$6;
                switch (self._) {
                    case 'Maybe.some':
                        var $1302 = self.value;
                        var self = $1302;
                        switch (self._) {
                            case 'App.Kaelin.Skill.new':
                                var $1304 = self.ap_cost;
                                var _map$13 = App$Kaelin$Map$creature$modify_at$(App$Kaelin$Tile$creature$change_ap(_key$1), _pos$2, _map$3);
                                var $1305 = Pair$new$($1304, _map$13);
                                var $1303 = $1305;
                                break;
                        };
                        var $1301 = $1303;
                        break;
                    case 'Maybe.none':
                        var $1306 = Pair$new$(0, _map$3);
                        var $1301 = $1306;
                        break;
                };
                var $1299 = $1301;
                break;
            case 'Maybe.none':
                var $1307 = Pair$new$(0, _map$3);
                var $1299 = $1307;
                break;
        };
        return $1299;
    };
    const App$Kaelin$Map$creature$change_ap_at = x0 => x1 => x2 => App$Kaelin$Map$creature$change_ap_at$(x0, x1, x2);

    function App$Kaelin$Effect$ap$change_at$(_skill_key$1, _pos$2) {
        var $1308 = App$Kaelin$Effect$monad$((_m$bind$3 => _m$pure$4 => {
            var $1309 = _m$bind$3;
            return $1309;
        }))(App$Kaelin$Effect$map$get)((_map$3 => {
            var _key$4 = App$Kaelin$Coord$Convert$axial_to_nat$(_pos$2);
            var _res$5 = App$Kaelin$Map$creature$change_ap_at$(_skill_key$1, _pos$2, _map$3);
            var self = _res$5;
            switch (self._) {
                case 'Pair.new':
                    var $1311 = self.fst;
                    var $1312 = $1311;
                    var _apc$6 = $1312;
                    break;
            };
            var self = _res$5;
            switch (self._) {
                case 'Pair.new':
                    var $1313 = self.snd;
                    var $1314 = $1313;
                    var _map$7 = $1314;
                    break;
            };
            var _indicators$8 = NatMap$new;
            var $1310 = App$Kaelin$Effect$monad$((_m$bind$9 => _m$pure$10 => {
                var $1315 = _m$bind$9;
                return $1315;
            }))(App$Kaelin$Effect$map$set(_map$7))((_$9 => {
                var $1316 = App$Kaelin$Effect$monad$((_m$bind$10 => _m$pure$11 => {
                    var $1317 = _m$bind$10;
                    return $1317;
                }))((() => {
                    var self = (_apc$6 < 0);
                    if (self) {
                        var $1318 = App$Kaelin$Effect$indicators$add(NatMap$set$(_key$4, App$Kaelin$Indicator$green, _indicators$8));
                        return $1318;
                    } else {
                        var $1319 = App$Kaelin$Effect$monad$((_m$bind$10 => _m$pure$11 => {
                            var $1320 = _m$pure$11;
                            return $1320;
                        }))(Unit$new);
                        return $1319;
                    };
                })())((_$10 => {
                    var $1321 = App$Kaelin$Effect$monad$((_m$bind$11 => _m$pure$12 => {
                        var $1322 = _m$pure$12;
                        return $1322;
                    }))(_apc$6);
                    return $1321;
                }));
                return $1316;
            }));
            return $1310;
        }));
        return $1308;
    };
    const App$Kaelin$Effect$ap$change_at = x0 => x1 => App$Kaelin$Effect$ap$change_at$(x0, x1);

    function App$Kaelin$Effect$ap$cost$(_key$1, _target$2) {
        var $1323 = App$Kaelin$Effect$ap$change_at$(_key$1, _target$2);
        return $1323;
    };
    const App$Kaelin$Effect$ap$cost = x0 => x1 => App$Kaelin$Effect$ap$cost$(x0, x1);

    function App$Kaelin$Effect$hp$heal_at$(_dmg$1, _pos$2) {
        var $1324 = App$Kaelin$Effect$hp$change_at$(((-_dmg$1)), _pos$2);
        return $1324;
    };
    const App$Kaelin$Effect$hp$heal_at = x0 => x1 => App$Kaelin$Effect$hp$heal_at$(x0, x1);

    function App$Kaelin$Skill$vampirism$(_key$1, _dmg$2) {
        var $1325 = App$Kaelin$Effect$monad$((_m$bind$3 => _m$pure$4 => {
            var $1326 = _m$bind$3;
            return $1326;
        }))(App$Kaelin$Effect$coord$get_center)((_center_pos$3 => {
            var $1327 = App$Kaelin$Effect$monad$((_m$bind$4 => _m$pure$5 => {
                var $1328 = _m$bind$4;
                return $1328;
            }))(App$Kaelin$Effect$coord$get_target)((_target_pos$4 => {
                var $1329 = App$Kaelin$Effect$monad$((_m$bind$5 => _m$pure$6 => {
                    var $1330 = _m$bind$5;
                    return $1330;
                }))(App$Kaelin$Effect$map$get)((_map$5 => {
                    var _block$6 = App$Kaelin$Coord$eql$(_target_pos$4, _center_pos$3);
                    var _occupied$7 = App$Kaelin$Map$is_occupied$(_target_pos$4, _map$5);
                    var self = _block$6;
                    if (self) {
                        var $1332 = App$Kaelin$Effect$monad$((_m$bind$8 => _m$pure$9 => {
                            var $1333 = _m$pure$9;
                            return $1333;
                        }))(Unit$new);
                        var $1331 = $1332;
                    } else {
                        var self = _occupied$7;
                        if (self) {
                            var $1335 = App$Kaelin$Effect$monad$((_m$bind$8 => _m$pure$9 => {
                                var $1336 = _m$bind$8;
                                return $1336;
                            }))(App$Kaelin$Effect$hp$damage_at$(_dmg$2, _target_pos$4))((_dd$8 => {
                                var $1337 = App$Kaelin$Effect$monad$((_m$bind$9 => _m$pure$10 => {
                                    var $1338 = _m$bind$9;
                                    return $1338;
                                }))(App$Kaelin$Effect$ap$cost$(_key$1, _center_pos$3))((_$9 => {
                                    var $1339 = App$Kaelin$Effect$monad$((_m$bind$10 => _m$pure$11 => {
                                        var $1340 = _m$bind$10;
                                        return $1340;
                                    }))(App$Kaelin$Effect$hp$damage_at$(_dmg$2, _target_pos$4))((_$10 => {
                                        var $1341 = App$Kaelin$Effect$monad$((_m$bind$11 => _m$pure$12 => {
                                            var $1342 = _m$bind$11;
                                            return $1342;
                                        }))(App$Kaelin$Effect$hp$heal_at$(_dd$8, _center_pos$3))((_$11 => {
                                            var $1343 = App$Kaelin$Effect$monad$((_m$bind$12 => _m$pure$13 => {
                                                var $1344 = _m$pure$13;
                                                return $1344;
                                            }))(Unit$new);
                                            return $1343;
                                        }));
                                        return $1341;
                                    }));
                                    return $1339;
                                }));
                                return $1337;
                            }));
                            var $1334 = $1335;
                        } else {
                            var $1345 = App$Kaelin$Effect$monad$((_m$bind$8 => _m$pure$9 => {
                                var $1346 = _m$pure$9;
                                return $1346;
                            }))(Unit$new);
                            var $1334 = $1345;
                        };
                        var $1331 = $1334;
                    };
                    return $1331;
                }));
                return $1329;
            }));
            return $1327;
        }));
        return $1325;
    };
    const App$Kaelin$Skill$vampirism = x0 => x1 => App$Kaelin$Skill$vampirism$(x0, x1);
    const App$Kaelin$Heroes$Croni$skills$vampirism = App$Kaelin$Skill$new$("Vampirism", 3, 3, App$Kaelin$Skill$vampirism$(81, 3), 81);

    function App$Kaelin$Coord$Cubic$new$(_x$1, _y$2, _z$3) {
        var $1347 = ({
            _: 'App.Kaelin.Coord.Cubic.new',
            'x': _x$1,
            'y': _y$2,
            'z': _z$3
        });
        return $1347;
    };
    const App$Kaelin$Coord$Cubic$new = x0 => x1 => x2 => App$Kaelin$Coord$Cubic$new$(x0, x1, x2);

    function App$Kaelin$Coord$Convert$axial_to_cubic$(_coord$1) {
        var self = _coord$1;
        switch (self._) {
            case 'App.Kaelin.Coord.new':
                var $1349 = self.i;
                var $1350 = self.j;
                var _x$4 = $1349;
                var _z$5 = $1350;
                var _y$6 = ((((-_x$4)) - _z$5) >> 0);
                var $1351 = App$Kaelin$Coord$Cubic$new$(_x$4, _y$6, _z$5);
                var $1348 = $1351;
                break;
        };
        return $1348;
    };
    const App$Kaelin$Coord$Convert$axial_to_cubic = x0 => App$Kaelin$Coord$Convert$axial_to_cubic$(x0);

    function App$Kaelin$Coord$new$(_i$1, _j$2) {
        var $1352 = ({
            _: 'App.Kaelin.Coord.new',
            'i': _i$1,
            'j': _j$2
        });
        return $1352;
    };
    const App$Kaelin$Coord$new = x0 => x1 => App$Kaelin$Coord$new$(x0, x1);

    function App$Kaelin$Coord$Convert$cubic_to_axial$(_coord$1) {
        var self = _coord$1;
        switch (self._) {
            case 'App.Kaelin.Coord.Cubic.new':
                var $1354 = self.x;
                var $1355 = self.z;
                var _i$5 = $1354;
                var _j$6 = $1355;
                var $1356 = App$Kaelin$Coord$new$(_i$5, _j$6);
                var $1353 = $1356;
                break;
        };
        return $1353;
    };
    const App$Kaelin$Coord$Convert$cubic_to_axial = x0 => App$Kaelin$Coord$Convert$cubic_to_axial$(x0);
    const F64$to_i32 = a0 => ((a0 >> 0));
    const U32$to_i32 = a0 => (a0);

    function Word$shr$(_n$2, _value$3) {
        var _n_nat$4 = Word$to_nat$(_n$2);
        var $1357 = Word$shift_right$(_n_nat$4, _value$3);
        return $1357;
    };
    const Word$shr = x0 => x1 => Word$shr$(x0, x1);

    function Word$s_shr$(_n$2, _value$3) {
        var _neg$4 = Word$is_neg$(_n$2);
        var self = _neg$4;
        if (self) {
            var _n$5 = Word$neg$(_n$2);
            var $1359 = Word$shl$(_n$5, _value$3);
            var $1358 = $1359;
        } else {
            var $1360 = Word$shr$(_n$2, _value$3);
            var $1358 = $1360;
        };
        return $1358;
    };
    const Word$s_shr = x0 => x1 => Word$s_shr$(x0, x1);
    const I32$shr = a0 => a1 => (a0 >> a1);

    function Word$xor$(_a$2, _b$3) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $1362 = self.pred;
                var $1363 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $1365 = self.pred;
                            var $1366 = (_a$pred$9 => {
                                var $1367 = Word$o$(Word$xor$(_a$pred$9, $1365));
                                return $1367;
                            });
                            var $1364 = $1366;
                            break;
                        case 'Word.i':
                            var $1368 = self.pred;
                            var $1369 = (_a$pred$9 => {
                                var $1370 = Word$i$(Word$xor$(_a$pred$9, $1368));
                                return $1370;
                            });
                            var $1364 = $1369;
                            break;
                        case 'Word.e':
                            var $1371 = (_a$pred$7 => {
                                var $1372 = Word$e;
                                return $1372;
                            });
                            var $1364 = $1371;
                            break;
                    };
                    var $1364 = $1364($1362);
                    return $1364;
                });
                var $1361 = $1363;
                break;
            case 'Word.i':
                var $1373 = self.pred;
                var $1374 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $1376 = self.pred;
                            var $1377 = (_a$pred$9 => {
                                var $1378 = Word$i$(Word$xor$(_a$pred$9, $1376));
                                return $1378;
                            });
                            var $1375 = $1377;
                            break;
                        case 'Word.i':
                            var $1379 = self.pred;
                            var $1380 = (_a$pred$9 => {
                                var $1381 = Word$o$(Word$xor$(_a$pred$9, $1379));
                                return $1381;
                            });
                            var $1375 = $1380;
                            break;
                        case 'Word.e':
                            var $1382 = (_a$pred$7 => {
                                var $1383 = Word$e;
                                return $1383;
                            });
                            var $1375 = $1382;
                            break;
                    };
                    var $1375 = $1375($1373);
                    return $1375;
                });
                var $1361 = $1374;
                break;
            case 'Word.e':
                var $1384 = (_b$4 => {
                    var $1385 = Word$e;
                    return $1385;
                });
                var $1361 = $1384;
                break;
        };
        var $1361 = $1361(_b$3);
        return $1361;
    };
    const Word$xor = x0 => x1 => Word$xor$(x0, x1);
    const I32$xor = a0 => a1 => (a0 ^ a1);

    function I32$abs$(_a$1) {
        var _mask$2 = (_a$1 >> 31);
        var $1386 = (((_mask$2 + _a$1) >> 0) ^ _mask$2);
        return $1386;
    };
    const I32$abs = x0 => I32$abs$(x0);

    function App$Kaelin$Coord$Cubic$add$(_coord_a$1, _coord_b$2) {
        var self = _coord_a$1;
        switch (self._) {
            case 'App.Kaelin.Coord.Cubic.new':
                var $1388 = self.x;
                var $1389 = self.y;
                var $1390 = self.z;
                var self = _coord_b$2;
                switch (self._) {
                    case 'App.Kaelin.Coord.Cubic.new':
                        var $1392 = self.x;
                        var $1393 = self.y;
                        var $1394 = self.z;
                        var _x$9 = (($1388 + $1392) >> 0);
                        var _y$10 = (($1389 + $1393) >> 0);
                        var _z$11 = (($1390 + $1394) >> 0);
                        var $1395 = App$Kaelin$Coord$Cubic$new$(_x$9, _y$10, _z$11);
                        var $1391 = $1395;
                        break;
                };
                var $1387 = $1391;
                break;
        };
        return $1387;
    };
    const App$Kaelin$Coord$Cubic$add = x0 => x1 => App$Kaelin$Coord$Cubic$add$(x0, x1);

    function App$Kaelin$Coord$Cubic$range$(_coord$1, _distance$2) {
        var _distance_32$3 = I32$to_u32$(_distance$2);
        var _double_distance$4 = ((((_distance_32$3 * 2) >>> 0) + 1) >>> 0);
        var _result$5 = List$nil;
        var _result$6 = (() => {
            var $1397 = _result$5;
            var $1398 = 0;
            var $1399 = _double_distance$4;
            let _result$7 = $1397;
            for (let _actual_distance$6 = $1398; _actual_distance$6 < $1399; ++_actual_distance$6) {
                var _negative_distance$8 = ((-_distance$2));
                var _positive_distance$9 = _distance$2;
                var _actual_distance$10 = (_actual_distance$6);
                var _x$11 = ((_actual_distance$10 - _positive_distance$9) >> 0);
                var _max$12 = I32$max$(_negative_distance$8, ((((-_x$11)) + _negative_distance$8) >> 0));
                var _min$13 = I32$min$(_positive_distance$9, ((((-_x$11)) + _positive_distance$9) >> 0));
                var _distance_between_max_min$14 = ((1 + I32$to_u32$(I32$abs$(((_max$12 - _min$13) >> 0)))) >>> 0);
                var _result$15 = (() => {
                    var $1400 = _result$7;
                    var $1401 = 0;
                    var $1402 = _distance_between_max_min$14;
                    let _result$16 = $1400;
                    for (let _range$15 = $1401; _range$15 < $1402; ++_range$15) {
                        var _y$17 = (((_range$15) + _max$12) >> 0);
                        var _z$18 = ((((-_x$11)) - _y$17) >> 0);
                        var _new_coord$19 = App$Kaelin$Coord$Cubic$add$(_coord$1, App$Kaelin$Coord$Cubic$new$(_x$11, _y$17, _z$18));
                        var $1400 = List$cons$(_new_coord$19, _result$16);
                        _result$16 = $1400;
                    };
                    return _result$16;
                })();
                var $1397 = _result$15;
                _result$7 = $1397;
            };
            return _result$7;
        })();
        var $1396 = _result$6;
        return $1396;
    };
    const App$Kaelin$Coord$Cubic$range = x0 => x1 => App$Kaelin$Coord$Cubic$range$(x0, x1);

    function Word$lte$(_a$2, _b$3) {
        var $1403 = Cmp$as_lte$(Word$cmp$(_a$2, _b$3));
        return $1403;
    };
    const Word$lte = x0 => x1 => Word$lte$(x0, x1);
    const U32$lte = a0 => a1 => (a0 <= a1);

    function App$Kaelin$Coord$fit$(_coord$1, _map_size$2) {
        var _coord$3 = App$Kaelin$Coord$Convert$axial_to_cubic$(_coord$1);
        var self = _coord$3;
        switch (self._) {
            case 'App.Kaelin.Coord.Cubic.new':
                var $1405 = self.x;
                var $1406 = self.y;
                var $1407 = self.z;
                var _x$7 = I32$abs$($1405);
                var _y$8 = I32$abs$($1406);
                var _z$9 = I32$abs$($1407);
                var _greater$10 = I32$max$(_x$7, I32$max$(_y$8, _z$9));
                var _greater$11 = I32$to_u32$(_greater$10);
                var $1408 = (_greater$11 <= _map_size$2);
                var $1404 = $1408;
                break;
        };
        return $1404;
    };
    const App$Kaelin$Coord$fit = x0 => x1 => App$Kaelin$Coord$fit$(x0, x1);
    const App$Kaelin$Constants$map_size = 4;

    function List$filter$(_f$2, _xs$3) {
        var self = _xs$3;
        switch (self._) {
            case 'List.cons':
                var $1410 = self.head;
                var $1411 = self.tail;
                var self = _f$2($1410);
                if (self) {
                    var $1413 = List$cons$($1410, List$filter$(_f$2, $1411));
                    var $1412 = $1413;
                } else {
                    var $1414 = List$filter$(_f$2, $1411);
                    var $1412 = $1414;
                };
                var $1409 = $1412;
                break;
            case 'List.nil':
                var $1415 = List$nil;
                var $1409 = $1415;
                break;
        };
        return $1409;
    };
    const List$filter = x0 => x1 => List$filter$(x0, x1);

    function App$Kaelin$Coord$range$(_coord$1, _distance$2) {
        var _center$3 = App$Kaelin$Coord$Convert$axial_to_cubic$(_coord$1);
        var _list_coords$4 = List$map$(App$Kaelin$Coord$Convert$cubic_to_axial, App$Kaelin$Coord$Cubic$range$(_center$3, _distance$2));
        var _fit$5 = (_x$5 => {
            var $1417 = App$Kaelin$Coord$fit$(_x$5, App$Kaelin$Constants$map_size);
            return $1417;
        });
        var $1416 = List$filter$(_fit$5, _list_coords$4);
        return $1416;
    };
    const App$Kaelin$Coord$range = x0 => x1 => App$Kaelin$Coord$range$(x0, x1);

    function List$foldr$(_nil$3, _cons$4, _xs$5) {
        var self = _xs$5;
        switch (self._) {
            case 'List.cons':
                var $1419 = self.head;
                var $1420 = self.tail;
                var $1421 = _cons$4($1419)(List$foldr$(_nil$3, _cons$4, $1420));
                var $1418 = $1421;
                break;
            case 'List.nil':
                var $1422 = _nil$3;
                var $1418 = $1422;
                break;
        };
        return $1418;
    };
    const List$foldr = x0 => x1 => x2 => List$foldr$(x0, x1, x2);

    function App$Kaelin$Map$set$(_coord$1, _tile$2, _map$3) {
        var _key$4 = App$Kaelin$Coord$Convert$axial_to_nat$(_coord$1);
        var $1423 = NatMap$set$(_key$4, _tile$2, _map$3);
        return $1423;
    };
    const App$Kaelin$Map$set = x0 => x1 => x2 => App$Kaelin$Map$set$(x0, x1, x2);

    function App$Kaelin$Map$push$(_coord$1, _entity$2, _map$3) {
        var _tile$4 = App$Kaelin$Map$get$(_coord$1, _map$3);
        var self = _tile$4;
        switch (self._) {
            case 'Maybe.some':
                var $1425 = self.value;
                var self = $1425;
                switch (self._) {
                    case 'App.Kaelin.Tile.new':
                        var self = _entity$2;
                        switch (self._) {
                            case 'App.Kaelin.Map.Entity.animation':
                                var $1428 = self.value;
                                var self = $1425;
                                switch (self._) {
                                    case 'App.Kaelin.Tile.new':
                                        var $1430 = self.background;
                                        var $1431 = self.creature;
                                        var $1432 = App$Kaelin$Tile$new$($1430, $1431, Maybe$some$($1428));
                                        var _animation_tile$10 = $1432;
                                        break;
                                };
                                var $1429 = App$Kaelin$Map$set$(_coord$1, _animation_tile$10, _map$3);
                                var $1427 = $1429;
                                break;
                            case 'App.Kaelin.Map.Entity.background':
                                var $1433 = self.value;
                                var self = $1425;
                                switch (self._) {
                                    case 'App.Kaelin.Tile.new':
                                        var $1435 = self.creature;
                                        var $1436 = self.animation;
                                        var $1437 = App$Kaelin$Tile$new$($1433, $1435, $1436);
                                        var _background_tile$10 = $1437;
                                        break;
                                };
                                var $1434 = App$Kaelin$Map$set$(_coord$1, _background_tile$10, _map$3);
                                var $1427 = $1434;
                                break;
                            case 'App.Kaelin.Map.Entity.creature':
                                var $1438 = self.value;
                                var self = $1425;
                                switch (self._) {
                                    case 'App.Kaelin.Tile.new':
                                        var $1440 = self.background;
                                        var $1441 = self.animation;
                                        var $1442 = App$Kaelin$Tile$new$($1440, Maybe$some$($1438), $1441);
                                        var _creature_tile$10 = $1442;
                                        break;
                                };
                                var $1439 = App$Kaelin$Map$set$(_coord$1, _creature_tile$10, _map$3);
                                var $1427 = $1439;
                                break;
                        };
                        var $1426 = $1427;
                        break;
                };
                var $1424 = $1426;
                break;
            case 'Maybe.none':
                var self = _entity$2;
                switch (self._) {
                    case 'App.Kaelin.Map.Entity.background':
                        var $1444 = self.value;
                        var _new_tile$6 = App$Kaelin$Tile$new$($1444, Maybe$none, Maybe$none);
                        var $1445 = App$Kaelin$Map$set$(_coord$1, _new_tile$6, _map$3);
                        var $1443 = $1445;
                        break;
                    case 'App.Kaelin.Map.Entity.animation':
                    case 'App.Kaelin.Map.Entity.creature':
                        var $1446 = _map$3;
                        var $1443 = $1446;
                        break;
                };
                var $1424 = $1443;
                break;
        };
        return $1424;
    };
    const App$Kaelin$Map$push = x0 => x1 => x2 => App$Kaelin$Map$push$(x0, x1, x2);

    function App$Kaelin$Map$Entity$animation$(_value$1) {
        var $1447 = ({
            _: 'App.Kaelin.Map.Entity.animation',
            'value': _value$1
        });
        return $1447;
    };
    const App$Kaelin$Map$Entity$animation = x0 => App$Kaelin$Map$Entity$animation$(x0);

    function App$Kaelin$Animation$new$(_duration$1, _sprite$2) {
        var $1448 = ({
            _: 'App.Kaelin.Animation.new',
            'duration': _duration$1,
            'sprite': _sprite$2
        });
        return $1448;
    };
    const App$Kaelin$Animation$new = x0 => x1 => App$Kaelin$Animation$new$(x0, x1);

    function App$Kaelin$Sprite$new$(_frame_info$1, _voxboxes$2) {
        var $1449 = ({
            _: 'App.Kaelin.Sprite.new',
            'frame_info': _frame_info$1,
            'voxboxes': _voxboxes$2
        });
        return $1449;
    };
    const App$Kaelin$Sprite$new = x0 => x1 => App$Kaelin$Sprite$new$(x0, x1);
    const App$Kaelin$Assets$effects$fire_1 = VoxBox$parse$("100002b35229100102b95425110102b55328120102be5b2a0f0202b35229100202b55328110202c65b24120202d76c2b0f0302b35229100302c15923110302d66328120302bd64361303029b7256140302b1552f0f0402b15931100402c6632e110402bd6335130402a96342140402b85629150402ba55250e05029d74640f05029e7361100502b45d32110502bc5725120502b36036130502c25a22140502e071290d06029f73620e06029e6f5b0f0602af6243100602b45228110602cf6023120602d96829130602c8642d0d0702b862350e0702d165250f0702bc582a110702b55329120702d1612a130702ca642c160702997c6b0c0802c8642c0d0802d566290e0802ce5f2a0f0802a86f66100802a5736d120802bf5b2a130802b4572f1408029a7b611508029b7968160802997c6b0c0902be5c2b0d0902cd602a0e0902ba5528110902ab6640120902a17458130902aa846c140902a36d50150902b8572c160902ba55250c0a02b352290d0a02b452280e0a02c5581a0f0a02c74e14110a02aa6a3d120a02b16742130a02a47256140a02c35c29150a02e2722a160a02b452280d0b02c5571f0e0b02e58d220f0b02db6718100b02c54c13110b02c7531a120b02cd6227130b02aa6946140b02c65b27150b02d76327160b02b654290c0c02b9633d0d0c02db6d1f0e0c02f7a8280f0c02d2671d100c02cf4f16110c02cd5417120c02ee8b26130c02a76544140c02b55229150c02ce6024160c02b754280a0d02a4746c0b0d029f776c0c0d02bb6a420d0d02f7a9280e0d02eb811a0f0d02c5561f100d02de5717110d02e5661a120d02d98235130d029f7763150d02b35229160d02b35229090e029980600a0e02a079670b0e029c7d5f0c0e02de63200d0e02f9ae2d0e0e02e15e190f0e02de5417100e02e7721a110e02ed771c120e02f39a28130e02e26118090f029980600a0f02a178640b0f02a968500c0f02d9622b0d0f02f2a0210e0f02f391230f0f02ea721d100f02f6ad2d110f02e07921120f02f0911a130f02f29f20140f02e05e170910029f7a670a10029d7c5d0b1002b25c350c1002c6844b0d1002dd631f0e1002f8af270f1002fbad31101002f09624111002df5e1a121002ed781c131002f8b128141002e1621b1510029d7d5d161002998060091102a5736d0a1102a671690b1102d6712a0c1102e17e250d1102b963440e1102f3a8320f1102fccd40101102edb247111102e58432121102f5ad3b131102f6af2c141102cd6938151102c45721161102c54f1b0a1202a76f670b1202cd5e2b0c1202f9ad320d1202e495360e1202fac13f0f1202fcc74a101202f8ac4a111202f7c34b121202f6a13a131202f08a21141202e16d1f151202ef9321161202c950140a13029b63460b1302ba5a310c1302e9a1370d1302f3a13e0e1302efae500f1302f7a853101302fbd37b111302fbca5e121302f6aa48131302ed751b141302f8941e151302f9a329161302ce58150714029d75650814029d75650a1402aa63500b1402c371340c1402d47c370d1402f9b85a0e1402e99f680f1402ea9f65101402fcd68f111402fccb7e121402fda342131402f4862d141402f5a220151402e57319161402a6682b171402ae68290715029d75650a1502b5672a0b1502c570270c1502ec7f250d1502f2a03f0e1502eca6780f1502f9d8aa101502fbe2c1111502fceaba121502fcd185131502fbae4f141502fba22d151502f47f1f161502c16f20171502b56727081602a175450916029a70450a1602a666360b1602c166200c1602f6972c0d1602f9ad520e1602f5b1840f1602fae1c5101602fcf3e5111602fbf1d6121602fde2b3131602fda764141602f8ab4a151602f6982c161602c1651f171602a85f26081702a1764e0917029f72530a1702a467540b1702c85f320c1702f68e3d0d1702f8c7610e1702f9c48f0f1702f9e8d4101702fdf8f2111702fcf3df121702fde5bf131702f8b076141702f8c661151702f68e3d161702d1581d171702b66323181702a0692c0818029b7256091802a374530a1802a46b4d0b1802ad6b510c1802dc6b340d1802eea1530e1802f3b7850f1802f5ddb9101802fbe9d3111802fbeecc121802fbdab1131802ecb069141802eda74f151802df6b2c161802b45f1e171802ad66261818029b73140919028055260a19028656320b19027e5a370c19029774450d19029f755c0e1902bc927a0f1902c39f7f101902dbb598111902f7ca89121902d2a876131902daa861141902ae874b151902874929161902a95920171902ae6f161819029b7410091a027952230a1a028e642b0b1a025a4d360c1a02785d350d1a025e59400e1a028a71540f1a02927451101a02ad9671111a02a28263121a029e8858131a026b5444141a0286744a151a02886434161a028c6217171a02a672110a1b027c51290b1b0267462e0c1b02623f1f0d1b02794f280e1b025b56310f1b027e6a4a101b027a6f52111b02746240121b0281724c131b026b5533141b02895b2c151b02784d21161b02694e130a1c028350300b1c0264442e0c1c028d491a0d1c027340200e1c028357290f1c02706144101c028f5f2a111c026a4a27121c02926d36131c026f4d28141c0284551b151c028a571b161c026f4f190d1d02824c1c0e1d02895a1d0f1d02916f35101d028b5521111d02523823121d029b6f2d");
    const App$Kaelin$Assets$effects$fire_2 = VoxBox$parse$("0f0002b352290e0102b352290f0102c05823100102d15d1e0f0202ba5626100202be5f2d110202ae60390d0302b65e350e0302db541b0f0302ae5f38100302ae5f380c0402de53170d0402de55190e0402d7561b110402a16f51120402b3552e0c0502e25d180d0502f0851a0e0502c85a1a1005029b7256110502bc6f44120502c45e271405029a7b6b1505029a7b6b0b0602e059180c0602f391230d0602f296210e0602cc54141006029b7256110602ab6443120602b55429140602a4746d150602c46650160602de54180b0702e05e170c0702f7a8210d0702ea731a0e0702dc5217150702d56021160702de621a170702bf57210b0802e05c170c0802f398210d0802e375190e0802dd53170f0802c54c13100802c54c13150802e76c29160802ca5e25170802b452290b0902de53170c0902e9791c0d0902ec8e2a0e0902df55170f0902d65116100902d35115110902c94e14140902dc6627150902d96529160902b553290c0a02de53170d0a02de53170e0a02de53170f0a02de5317100a02e86b1a110a02db6317120a02c54c13140a02bf5827150a02b56045160a02b8562a0a0b029980600e0b02e35e220f0b02e2601d100b02f49b28110b02e2741b120b02c54c13130b02de5317140b02cf5624150b029e7565160b029d75650a0c029a7f610b0c02a4746c0e0c02e05e170f0c02f19e20100c02f1921a110c02cf5915120c02de5517130c02e86b19140c02e05918090d02a5736d0a0d02ab6e650b0d02da56250d0d02df56170e0d02ea731b0f0d02f8b026100d02ec751a110d02e25c18120d02ec821a130d02f7a320140d02e05e17150d02de5317160d02de5317090e02c7501e0a0e02d55e250b0e02e66d1f0c0e02b067400d0e02e15d180e0e02f49e220f0e02f79c20100e02e86a1a110e02f28b1c120e02f9b226130e02f38c1c140e02df631a150e02d25920160e02d55d23080f02c54c13090f02d256190a0f02f9811e0b0f02fabb3c0c0f02f490210d0f02ed831d0e0f02fabf3c0f0f02ed7c20100f02f7a11a110f02f8b327120f02faae28130f02ec741b140f02d3591b150f02e16d1f160f02be5c29081002c54c13091002c84e150a1002ea962b0b1002f4a2300c1002d563210d1002ee8f240e1002f9b63a0f1002ec8c19101002fab72b111002ed8619121002f8aa2a131002dc7423141002d55d1a151002eb9a2b161002ba5f2a091102ab56390a1102d98e330b1102f09c250c1102bc6c3d0d1102ed96290e1102faa8280f1102f89e21101102f39921111102ee8025121102f6b236131102bd6128141102e97a1f151102f8aa29161102d17625171102b35229091202e0601e0a1202ea94350b1202f7ba380c1202f797260d1202dc7a2f0e1202ef9d400f1202fbce59101202ec8331111202e67d29121202f69d2b131202c35a26141202f18321151202f18f1f161202c75924171202b35229091302cd5f280a1302d9772e0b1302f4af370c1302fbb6330d1302f496290e1302ea85250f1302f4aa4b101302f8a442111302ed902b121302df6f1f131302e17621141302e98323151302ce5921161302b452290614029d75650714029d7565091402ba5b1e0a1402c561250b1402e98e260c1402ef9d400d1402fbbe5b0e1402fc9f3a0f1402f49642101402fcd9b8111402f99440121402f18426131402f69335141402f1811e151402dd5819161402a966290715029d7565091502bf601e0a1502df62180b1502f4881c0c1502ee97310d1502f4ab560e1502fdbd6e0f1502fbd09d101502fbcc9d111502fbbf78121502feb45b131502fca440141502f58723151502eb7217161502ce5b1b171502bc611e0816029b7145091602bd6a210a1602e37f200b1602fda5410c1602fba64f0d1602f4ab720e1602f7c6a40f1602fcebd4101602fce7d0111602fce5bd121602fec48a131602f99c45141602f78f2b151602faa43c161602c6631d171602bd6c1f071702a1764e081702a1754e091702b365400a1702d95d200b1702f599360c1702f9c9660d1702fbb2760e1702f6d2b50f1702fcf0e2101702fcf6ea111702fcf1d8121702fac692131702fabc6b141702fabb55151702e97724161702c75a1b171702a5682a0818029d7255091802a772510a1802ae66410b1802de77320c1802eca8500d1802ebaf6a0e1802f9cfa00f1802f6e3ca101802fbedd4111802fae9c6121802f6c085131802e7af5f141802ee9641151802c86221161802ad6022171802a66a210819027d5425091902895a2b0a19027c54370b190283613b0c1902a67c490d1902a881720e1902c69b820f1902c8ac8c101902f0c490111902e3b982121902dda467131902c39e5a1419028d663c1519029c4f26161902b76a18171902a070111819029a7510081a02795122091a027e56280a1a027f5e310b1a02755d350c1a02594d370d1a028773480e1a026c5c550f1a02bc9e68101a029d7865111a02ab9464121a026f6045131a0276604f141a02927739151a02835f29161a029e6911171a029c7510091b027d542c0a1b02764f270b1b025f3d2c0c1b026947220d1b0274522b0e1b0255533a0f1b02937e52101b0265614a111b027e6844121b02786c45131b0276512f141b02895b24151b026f4b1b161b02684f110a1c02774d2a0b1c027341290c1c0285431d0d1c027245220e1c02805e310f1c027e6142101c02855c26111c027e5a2a121c027e6139131c0282541d141c028a5219151c02815d1c0d1d0284511c0e1d028e65290f1d028b693c101d02754720111d02684823121d02b58435");
    const App$Kaelin$Assets$effects$fire_3 = VoxBox$parse$("0c0002c54c130b0102c64c130c0102c74c130d0102c64c13100102c54c130b0202dd53170c0202e362190d0202d556160e0202c54c130f0202c74d13100202c64c13140202c54c13150202c54c130b0302de53170c0302ee7a1d0d0302e382200e0302cb4f140f0302e06218100302de5617140302bc4f20150302c64f160b0402dd53170c0402ec83220d0402d3681e0e0402c953150f0402f28d23100402e2641a140402b85529150402dc6424160402c84f150b0502c157200c0502ca571e0d0502c2561f0e0502c0521f0f0502ed8c23100502f28a1c110502e26517140502b65429150502d26923160502c0531f0b0602c057200c0602c057200e0602ba54240f0602cb5820100602f38f23110602ec8f21120602de5317130602de5317140602cb5321150602bf5721160602b452280e0702de53170f0702d25a18100702f29025110702ec932c120702de5317130702dc5418140702c75623150702b55228180702c057200a0802c54c130d0802bd58270e0802e566190f0802d95a1b100802ee9a29110802f1911a120802e05818130802c75e1f140802ed8d1b150802bd5b27180802c5581a190802c74e140a0902c64c130b0902c74d130d0902bb5e270e0902f5a4200f0902ec7617100902ec7e19110902e6701b120902de5317130902c25f25140902f7a828150902e5691a160902dd5317170902c5571f180902e58d22190902db67181a0902c54c130a0a02df59180b0a02e066190c0a02d878290d0a02dc6b210e0a02f8b82f0f0a02ef8e2a100a02f68e1c110a02e05918120a02de5317130a02e77e19140a02ec8f20150a02de5417160a02ca571e170a02db6d1f180a02f7a828190a02d2671d1a0a02bd4f1f090b02dc53180a0b02ec761e0b0b02fab4390c0b02ea721d0d0b02e05a190e0b02f3871d0f0b02f7b132100b02f9a12b110b02e15918120b02de5317130b02ed8d20140b02f17e1c150b02de5317160b02c76121170b02f7a928180b02eb811a190b02c4561f080c02de5317090c02db53190a0c02d05b220b0c02ef9b330c0c02f9b4390d0c02e15e190e0c02e25d180f0c02f39124100c02fbb02f110c02e96e1b120c02de5317130c02e86a19140c02e15d18160c02e0621b170c02f9ae2d180c02e15e19190c02de5317080d02de5317090d02df55170a0d02f19a2b0b0d02cf77250c0d02ed991c0d0d02e05f170e0d02cf4f150f0d02d95f13100d02faaf2a110d02f2951f120d02e05d17130d02cb5815140d02d05115150d02d35015160d02e05e17170d02f2a021180d02f39123190d02e05918090e02cb4f150a0e02e3701b0b0e02f3a4240c0e02f2a4270d0e02e05d170e0e02df57180f0e02f39e2c100e02fcc93d110e02f8a324120e02d95e17130e02e68d21140e02ec751b150e02de5317160e02de5317170e02e16217180e02f09c20190e02e0611a090f02df5c210a0f02e86d1b0b0f02fab5360c0f02ee932a0d0f02de53170e0f02e6752e0f0f02fac13f100f02f49826110f02faa328120f02f39822130f02f7a421140f02e96e19150f02df5517160f02df5517170f02dc5419180f02c05c26091002c84e150a1002d5601b0b1002fab9380c1002e987200d1002d8581b0e1002ed78190f1002fbb435101002e86c18111002ee8123121002f59f23131002f8921d141002e05918151002e96f1a161002eb7b19171002de53170a1102e46a130b1102f9a6250c1102eea32b0d1102d66c1b0e1102df59180f1102f58522101102ef852d111102f48c2f121102f49a2c131102ee781d141102f39024151102f9aa28161102ed761b171102de53170a1202e465100b1202ef9d330c1202f7ba380d1202f897240e1202d86c2b0f1202f38321101202ef7b32111202fab58d121202ef8832131202fbb12f141202f9b227151202f38c1c161202e05d180a1302c866350b1302c962300c1302eca4330d1302fbb6330e1302f999290f1302faa536101302f0a678111302fac194121302ef9a44131302f8a827141302e66c1a151302c75c1e161302d250150714029d75650814029d75650a1402c0673e0b1402ca5c350c1402e05f190d1402f49d3b0e1402fbbe5b0f1402fcb05b101402fccab1111402fbd9a5121402f0842b131402f8a624141402eb7c23151402e05c18161402de5519171402c2683d0815029d7565091502bc611e0a1502c8621f0b1502ea791f0c1502f98e240d1502f290300e1502f4ab560f1502fdba6b101502fbbf9a111502fcecdc121502fbc27e131502fdb755141502f59739151502f98e24161502eb791d171502c8621f181502bc611e0916029c6f430a1602b15e250b1602df73200c1602fbbb4e0d1602fa973b0e1602f4a9740f1602f7c5a2101602fce1c0111602fceddf121602fce6bd131602fec48a141602fa983d151602fbbb4e161602df7320171602b25d24181602a75f26081702a1764e091702a1754e0a1702b45f400b1702db5f230c1702faa5400d1702fbb4520e1702fabc840f1702f6d3b6101702fcf0e2111702fcf6ea121702fcf1d8131702fbc590141702fbad4e151702faa540161702de6122171702c6591b181702a5682a0918029d72550a1802a772510b1802b565460c1802db78320d1802f8bb580e1802f4b7740f1802f9cfa1101802f6e3ca111802fbedd4121802fae9c6131802fbbf7f141802e7a349151802e88339161802c86121171802ad6022181802a66a210919027d54250a1902895a2b0b19027c54370c190284603a0d1902b879420e1902a880720f1902c59a82101902c8ac8c111902f0c490121902e3b982131902dda467141902c39e5a1519028d663c1619029c4f26171902b76a18181902a070111919029a7510091a027951220a1a027e56280b1a027f5e310c1a02755d350d1a02594d370e1a028773480f1a026c5c55101a02bc9e68111a029d7865121a02ab9464131a026f6045141a0276604f151a02927739161a02835f29171a029e6911181a029c75100a1b027d542c0b1b02764f270c1b025f3d2c0d1b026947220e1b0274522b0f1b0255533a101b02937e52111b0265614a121b027e6844131b02786c45141b0276512f151b02895b24161b026f4b1b171b02684f110b1c02774d2a0c1c027341290d1c0285431d0e1c027245220f1c02805e31101c027e6142111c02855c26121c027e5a2a131c027e6139141c0282541d151c028a5219161c02815d1c0e1d0284511c0f1d028e6529101d028b693c111d02754720121d02684823131d02b58435");
    const App$Kaelin$Assets$effects$fire_4 = VoxBox$parse$("0b0102c54c130c0102c54c13100102b55228110102b55228120102b35229140102c74d13150102c74d130a0202c74d130b0202c54c130c0202c74d130d0202c54c130f0202b75228100202c85a25110202db651f120202ca5321130202c74d13140202df6218150202de5617090302d250150a0302df62180b0302e96b1a0c0302d2531e0d0302b552280f0302dc5318100302ec8f29110302ed9129120302df5617130302c85014140302e66819150302df5617160302c54c13170302d35315180302df55170a0402e25d180b0402eb6f1a0c0402e3621a0d0402c856230e0402b552280f0402cb5321100402dd681e110402f6971c120402e36817130402c54c13140402d14f15160402c54c13170402e06919180402ed8b22190402e260180b0502de53170c0502e15e180d0502ef861c0e0502c857230f0502ba5227100502bd5326110502de6f20120502ef8d19130502e05d17170502df5a17180502f59e27190502ec801a1a0502de53170a0602de53170b0602df59170c0602e8821b0d0602f8be330e0602ec761d0f0602dd5318100602de5317110602b95528120602dd6b1f130602df5617160602de5317170602d95716180602f49a22190602e9781a1a0602de53170a0702de53170b0702e9731c0c0702f8ba350d0702f6a2280e0702e96c1a0f0702cf4f15100702d75116110702de5317120702dd5317130702dc5217160702de5317170702e5671b180702ed952a190702e05c180a0802e05c170b0802f7af2b0c0802fab9350d0802ea711c0e0802df56170f0802c95014100802e36219110802dd5317120802c74d13130802c64c13160802de5317170802de5317180802de53170a0902e05d170b0902f8b52f0c0902f08b1b0d0902cf51130e0902de53170f0902cf4f15100902dd5717110902c74d13120902df6218130902de56170a0a02df58170b0a02ea7b1b0c0a02f8b02f0d0a02e5691b0e0a02de53170f0a02db5216110a02ca5314120a02f28c23130a02e2641a0b0b02df58170c0b02e1621b0d0b02df57180e0b02dd53170f0b02c54c13110b02c0521f120b02ed8d22130b02f1921a140b02e265170e0c02cc4e140f0c02c54c13110c02ba5424120c02cb5c20130c02f7a621140c02ec9021150c02dd5317160c02c057200d0d02b352290e0d02bf4e1d0f0d02c54c13100d02c54c13120d02bc5828130d02f7a025140d02ec942b150d02c5561e160d02c057200c0e02cb53210d0e02c656230e0e02ca53210f0e02c54c13100e02c54c13120e02de5918130e02f89f22140e02eb8919150e02c84d14160e02c74d130b0f02cc58210c0f02e3701b0d0f02ef9a200e0f02e05e170f0f02d35015100f02cf4f15110f02df5817120f02e26a1a130f02f89d22140f02e16d19150f02de5617160f02e06218170f02cf51150b1002cf5c200c1002f8b2350d1002ef992a0e1002e25c160f1002e66414101002e46218111002f3821e121002f9aa27131002eb8a1e141002b85528151002e6681a161002f28d23171002ca58160b1102e15f190c1102fab9390d1102eb8b260e1102f8830b0f1102f28e12101102e4681e111102f8b127121102f7a31a131102ee7a20141102b9541f151102e05e19161102ec8a22171102c0531f0b1202e368180c1202faae2a0d1202e98f240e1202ee7b120f1202f9a41d101202ee7819111202fab632121202f89d1e131202f38b20141202c2541a151202c3571f161202cb571d171202ba54240a1302a163430b1302e467120c1302f9a6240d1302f2b5330e1302e36d180f1302f9b468101302f8a837111302f5a738121302fab145131302f8911c141302df5918151302c5561f161302c3571f0714029d75650a1402a85f450b1402e466190c1402eb821e0d1402f8b8380e1402ec90270f1402f7992e101402f9ca93111402f48f2f121402fcb043131402f8a726141402e96c1a151402e76615161402d25a1d0715029d75650815029d7565091502a76f2d0a1502c764240b1502fa9f230c1502e96f160d1502f2a3360e1502fab1510f1502ee7a17101502f8c793111502fbbe81121502f6963b131502fdaa4b141502eb731e151502fa9f23161502c86523171502ab6d2c0916029f67330a1602cf5a160b1602faac680c1602f6923a0d1602f091460e1602f4af760f1602fabc8e101602fcd4a5111602fcf0da121602fec77b131602fca95c141602f6933b151602faad68161602c86e1c171602ac6328081702a578460917029b70470a1702b960390b1702f4a03b0c1702fbca7e0d1702ef85460e1702f6bd8e0f1702fae6cd101702fbe9d8111702fcf4e6121702fde2ba131702fda262141702fbca7e151702f49236161702c2561c171702bc5b1b0818029c7355091802a1765a0a1802a96b540b1802f186260c1802fac05c0d1802f9bf5f0e1802facfa40f1802fae8d2101802fdf4e8111802fbf1d6121802fde4bb131802f99f50141802fabd5a151802f38320161802ca5d1e171802b26628181802a0692c091902a36d410a19029d65400b1902b26b480c1902bd82460d1902d5a2600e1902e9be900f1902e0c59e101902f2d5b9111902fae2ac121902eec497131902dea75c141902c98745151902c45b29161902b95d1e171902af6a1d1819029b7410091a027a52230a1a027553290b1a025c4c2e0c1a028770460d1a027f67500e1a02a585610f1a02ac8464101a02c39f7f111a02dda871121a02b39261131a02b68f5b141a02a69154151a025f4a33161a02865b1e171a02a77111181a029a7410091b027b552a0a1b029365290b1b026349330c1b027854240d1b027b5c380e1b0258593c0f1b027e6d4c101b02928565111b026c6357121b02968258131b025c4f36141b027f5d34151b02936326161b028b61120a1c0281502f0b1c0265442e0c1c02703f1e0d1c02623b220e1c02694c2b0f1c02796647101c02816436111c02816331121c027b663e131c026f4c2c141c02805026151c027b4e1f161c025c3e150c1d02934c190d1d027f4a1d0e1d028f5e240f1d027e673f101d028c5722111d02563b23121d029a6f2e131d0289622c141d02855618151d028d591a0e1e0286591b0f1e02967131");
    const App$Kaelin$Assets$effects$fire_5 = VoxBox$parse$("0c0002c465500d0002a6736d100002b35229110002b955270b0102d2571c0c0102df5c1c0d0102ce6544100102b75427110102d0601a120102b560350b0202c058240c0202e56b1d0d0202d46123110202b35a31120202af5f38140202db541b150202b65e350b0302b452290c0302d161290d0302e36926110302c85a2c140302dc5418150302de5519160302de53170b0402b352290c0402bb55270d0402cd602c0e0402c05720100402ca4d14110402dd5317140402c95a1a150402f0851a160402e25d180c0502b365500d0502b4654f0e0502c057200f0502c54c13100502d96017110502df5617140502cc5414150502f29621160502f39123170502e059180f0602c54c13100602cf5115110602df5617140602dc5217150602ea731a160602f7a821170602e05e17100702c54c13140702dd5317150702e37519160702f39821170702e05c170e0802c54c13130802de5317140802df5517150802ec8e2a160802e9791c170802de53170d0902c850140e0902c84f140f0902c64c13130902de5317140902de5317150902de5317160902de53170c0a02c54c130d0a02da68170e0a02e363190f0a02dd5317140a02c54c13150a02c54c130c0b02c54c130d0b02e17b170e0b02d97b1a0f0b02c3571f130b02c54c13140b02c54c13160b02c54c13170b02c54c130c0c02c54c130d0c02e2731a0e0c02f196220f0c02ce5a1d100c02c05720130c02c64d15140c02c64c13160c02c54c13170c02c54c130c0d02dc52170d0d02cf59150e0d02f297210f0d02ed9125100d02c55d20120d02dc5919130d02dc731c140d02de5917160d02d25015170d02d35115180d02c94e140b0e02de53170c0e02dd53170d0e02cb561d0e0e02e0811c0f0e02f7b127100e02d4631e110e02c05b26120e02ef9625130e02f2a327140e02e05e17160e02d75116170e02e16519180e02db6317190e02c54c130b0f02dc571a0c0f02d55f1e0d0f02ca551b0e0f02d5631d0f0f02f7a928100f02e26119110f02df5d18120f02f9b93f130f02ee9026140f02d75116150f02d35015160f02df5917170f02f39927180f02e1731b190f02c44c140b1002bd5a270c1002ed8d1a0d1002cf5c1e0e1002e66c1b0f1002f8ae31101002ef8b1e111002ea731c121002fbc841131002f19a1f141002d25515151002d55615161002f09d1f171002f0911a181002c3561f191002b552280a1102b352290b1102d66d260c1102f9a9270d1102d574350e1102e67b1f0f1102f9a82f101102f5ab3c111102faa22c121102fbc73f131102fcca3e141102ec7b1d151102ec811d161102f8b227171102dc6e20181102b65228191102b352290a1202b352290b1202d66e260c1202f9a9250d1202f8a0230e1202f28a1b0f1202ef9524101202fbcc5b111202fac245121202fbe270131202f8aa2a141202e98a21151202faab35161202f8c036171202dd741c181202c35624191202b352290813029d75650a1302aa5e2b0b1302b756280c1302e8701c0d1302f7a5210e1302f7a1190f1302f48421101302fcc05f111302fbcc79121302f8cd71131302e58a35141302f4ab4d151302fba729161302f9b02b171302f79a30181302e0811f0814029d75650914029d75650a1402a76f2d0b1402b767280c1402e25b160d1402f07d1c0e1402faa02f0f1402fda646101402fdd086111402fdd89a121402fabd5e131402f3b67b141402fbb559151402faa634161402fbb04a171402f59834181402dd7b230a1502a2652f0b1502c65c1b0c1502f5942e0d1502f484210e1502f99e410f1502febe75101502fcdca5111502fbecd7121502fce2bf131502f6c296141502f4a463151502fdac51161502faa944171502c66321181502ac6328091602a578460a1602a070430b1602be64300c1602f496330d1602fbb04b0e1602faa9580f1602fec591101602fcefd4111602fcf3e9121602fbecd7131602f8cfb0141602f8af74151602fab556161602f59939171602c36023181602bb5e1d0917029c73550a1702a1724f0b1702b664440c1702da66210d1702f9ae460e1702fac16f0f1702f6c58e101702fbefd0111702fcf3e3121702fcf0e0131702f8d0ad141702f8b375151702f9c25e161702ee882d171702c95d22181702b16628191702a0692c0a1802a36d410b1802a062360c1802ab63350d1802be76410e1802bd8c550f1802e7af8a101802e5cba8111802f2d8b9121802f5d8a8131802edc48d141802dea85f151802c98845161802bd5e2d171802b66135181802af6a1d1918029b74100a19027a52230b19027553290c19025c4c2e0d19028770460e19027f67500f1902a58561101902ac8464111902c39f7f121902dda871131902b39261141902b68f5b151902a691541619025f4a33171902865b1e181902a771111919029a74100a1a027b552a0b1a029365290c1a026349330d1a027854240e1a027b5c380f1a0258593c101a027e6d4c111a02928565121a026c6357131a02968258141a025c4f36151a027f5d34161a02936326171a028b61120b1b0281502f0c1b0265442e0d1b02703f1e0e1b02623b220f1b02694c2b101b02796647111b02816436121b02816331131b027b663e141b026f4c2c151b02805026161b027b4e1f171b025c3e150d1c02934c190e1c027f4a1d0f1c028f5e24101c027e673f111c028c5722121c02563b23131c029a6f2e141c0289622c151c02855618161c028d591a0f1d0286591b101d02967131");
    const App$Kaelin$Sprite$fire = App$Kaelin$Sprite$new$(9n, List$cons$(App$Kaelin$Assets$effects$fire_1, List$cons$(App$Kaelin$Assets$effects$fire_2, List$cons$(App$Kaelin$Assets$effects$fire_3, List$cons$(App$Kaelin$Assets$effects$fire_4, List$cons$(App$Kaelin$Assets$effects$fire_5, List$nil))))));

    function App$Kaelin$Effect$animation$push$(_coords$1, _center$2, _target$3, _map$4) {
        var _map$5 = List$foldr$(_map$4, (_coord$5 => _map$6 => {
            var $1451 = App$Kaelin$Map$push$(_coord$5, App$Kaelin$Map$Entity$animation$(App$Kaelin$Animation$new$(Maybe$some$(45n), App$Kaelin$Sprite$fire)), _map$6);
            return $1451;
        }), _coords$1);
        var $1450 = App$Kaelin$Effect$Result$new$(Unit$new, _map$5, List$nil, NatMap$new);
        return $1450;
    };
    const App$Kaelin$Effect$animation$push = x0 => x1 => x2 => x3 => App$Kaelin$Effect$animation$push$(x0, x1, x2, x3);

    function App$Kaelin$Effect$result$union$(_a$2, _b$3, _value_union$4) {
        var $1452 = App$Kaelin$Effect$Result$new$(_value_union$4((() => {
            var self = _a$2;
            switch (self._) {
                case 'App.Kaelin.Effect.Result.new':
                    var $1453 = self.value;
                    var $1454 = $1453;
                    return $1454;
            };
        })())((() => {
            var self = _b$3;
            switch (self._) {
                case 'App.Kaelin.Effect.Result.new':
                    var $1455 = self.value;
                    var $1456 = $1455;
                    return $1456;
            };
        })()), (() => {
            var self = _b$3;
            switch (self._) {
                case 'App.Kaelin.Effect.Result.new':
                    var $1457 = self.map;
                    var $1458 = $1457;
                    return $1458;
            };
        })(), List$concat$((() => {
            var self = _a$2;
            switch (self._) {
                case 'App.Kaelin.Effect.Result.new':
                    var $1459 = self.futures;
                    var $1460 = $1459;
                    return $1460;
            };
        })(), (() => {
            var self = _b$3;
            switch (self._) {
                case 'App.Kaelin.Effect.Result.new':
                    var $1461 = self.futures;
                    var $1462 = $1461;
                    return $1462;
            };
        })()), NatMap$union$((() => {
            var self = _a$2;
            switch (self._) {
                case 'App.Kaelin.Effect.Result.new':
                    var $1463 = self.indicators;
                    var $1464 = $1463;
                    return $1464;
            };
        })(), (() => {
            var self = _b$3;
            switch (self._) {
                case 'App.Kaelin.Effect.Result.new':
                    var $1465 = self.indicators;
                    var $1466 = $1465;
                    return $1466;
            };
        })()));
        return $1452;
    };
    const App$Kaelin$Effect$result$union = x0 => x1 => x2 => App$Kaelin$Effect$result$union$(x0, x1, x2);

    function App$Kaelin$Effect$area$(_eff$2, _coords$3, _center$4, _target$5, _map$6) {
        var _map_result$7 = NatMap$new;
        var _eff_result$8 = App$Kaelin$Effect$pure(_map_result$7);
        var _result$9 = App$Kaelin$Effect$Result$new$(_map_result$7, _map$6, List$nil, NatMap$new);
        var _result$10 = (() => {
            var $1469 = _result$9;
            var $1470 = _coords$3;
            let _result$11 = $1469;
            let _coord$10;
            while ($1470._ === 'List.cons') {
                _coord$10 = $1470.head;
                var _result_of_effect$12 = _eff$2(_center$4)(_coord$10)((() => {
                    var self = _result$11;
                    switch (self._) {
                        case 'App.Kaelin.Effect.Result.new':
                            var $1471 = self.map;
                            var $1472 = $1471;
                            return $1472;
                    };
                })());
                var _key$13 = App$Kaelin$Coord$Convert$axial_to_nat$(_coord$10);
                var _new_form$14 = App$Kaelin$Effect$Result$new$(NatMap$set$(_key$13, (() => {
                    var self = _result_of_effect$12;
                    switch (self._) {
                        case 'App.Kaelin.Effect.Result.new':
                            var $1473 = self.value;
                            var $1474 = $1473;
                            return $1474;
                    };
                })(), NatMap$new), (() => {
                    var self = _result_of_effect$12;
                    switch (self._) {
                        case 'App.Kaelin.Effect.Result.new':
                            var $1475 = self.map;
                            var $1476 = $1475;
                            return $1476;
                    };
                })(), (() => {
                    var self = _result_of_effect$12;
                    switch (self._) {
                        case 'App.Kaelin.Effect.Result.new':
                            var $1477 = self.futures;
                            var $1478 = $1477;
                            return $1478;
                    };
                })(), (() => {
                    var self = _result_of_effect$12;
                    switch (self._) {
                        case 'App.Kaelin.Effect.Result.new':
                            var $1479 = self.indicators;
                            var $1480 = $1479;
                            return $1480;
                    };
                })());
                var $1469 = App$Kaelin$Effect$result$union$(_result$11, _new_form$14, NatMap$union);
                _result$11 = $1469;
                $1470 = $1470.tail;
            }
            return _result$11;
        })();
        var $1467 = _result$10;
        return $1467;
    };
    const App$Kaelin$Effect$area = x0 => x1 => x2 => x3 => x4 => App$Kaelin$Effect$area$(x0, x1, x2, x3, x4);

    function App$Kaelin$Map$creature$change_hp$(_value$1, _pos$2, _map$3) {
        var _creature$4 = App$Kaelin$Map$creature$get$(_pos$2, _map$3);
        var self = _creature$4;
        switch (self._) {
            case 'Maybe.some':
                var $1482 = self.value;
                var self = $1482;
                switch (self._) {
                    case 'App.Kaelin.Creature.new':
                        var $1484 = self.hero;
                        var self = $1484;
                        switch (self._) {
                            case 'App.Kaelin.Hero.new':
                                var $1486 = self.max_hp;
                                var self = (0 === (() => {
                                    var self = $1482;
                                    switch (self._) {
                                        case 'App.Kaelin.Creature.new':
                                            var $1488 = self.hp;
                                            var $1489 = $1488;
                                            return $1489;
                                    };
                                })());
                                if (self) {
                                    var $1490 = Pair$new$(0, App$Kaelin$Map$creature$remove$(_pos$2, _map$3));
                                    var $1487 = $1490;
                                } else {
                                    var _new_hp$17 = I32$max$((((() => {
                                        var self = $1482;
                                        switch (self._) {
                                            case 'App.Kaelin.Creature.new':
                                                var $1492 = self.hp;
                                                var $1493 = $1492;
                                                return $1493;
                                        };
                                    })() + _value$1) >> 0), 0);
                                    var _new_hp$18 = I32$min$(_new_hp$17, $1486);
                                    var _hp_diff$19 = ((_new_hp$18 - (() => {
                                        var self = $1482;
                                        switch (self._) {
                                            case 'App.Kaelin.Creature.new':
                                                var $1494 = self.hp;
                                                var $1495 = $1494;
                                                return $1495;
                                        };
                                    })()) >> 0);
                                    var _map$20 = App$Kaelin$Map$creature$modify_at$(App$Kaelin$Tile$creature$change_hp(_hp_diff$19), _pos$2, _map$3);
                                    var $1491 = Pair$new$(_hp_diff$19, _map$20);
                                    var $1487 = $1491;
                                };
                                var $1485 = $1487;
                                break;
                        };
                        var $1483 = $1485;
                        break;
                };
                var $1481 = $1483;
                break;
            case 'Maybe.none':
                var _map$5 = App$Kaelin$Map$creature$modify_at$(App$Kaelin$Tile$creature$change_hp(_value$1), _pos$2, _map$3);
                var $1496 = Pair$new$(_value$1, _map$5);
                var $1481 = $1496;
                break;
        };
        return $1481;
    };
    const App$Kaelin$Map$creature$change_hp = x0 => x1 => x2 => App$Kaelin$Map$creature$change_hp$(x0, x1, x2);

    function App$Kaelin$Effect$hp$change$(_change$1) {
        var $1497 = App$Kaelin$Effect$monad$((_m$bind$2 => _m$pure$3 => {
            var $1498 = _m$bind$2;
            return $1498;
        }))(App$Kaelin$Effect$map$get)((_map$2 => {
            var $1499 = App$Kaelin$Effect$monad$((_m$bind$3 => _m$pure$4 => {
                var $1500 = _m$bind$3;
                return $1500;
            }))(App$Kaelin$Effect$coord$get_target)((_target$3 => {
                var _res$4 = App$Kaelin$Map$creature$change_hp$(_change$1, _target$3, _map$2);
                var self = _res$4;
                switch (self._) {
                    case 'Pair.new':
                        var $1502 = self.fst;
                        var $1503 = $1502;
                        var _dhp$5 = $1503;
                        break;
                };
                var self = _res$4;
                switch (self._) {
                    case 'Pair.new':
                        var $1504 = self.snd;
                        var $1505 = $1504;
                        var _map$6 = $1505;
                        break;
                };
                var _key$7 = App$Kaelin$Coord$Convert$axial_to_nat$(_target$3);
                var _indicators$8 = NatMap$new;
                var $1501 = App$Kaelin$Effect$monad$((_m$bind$9 => _m$pure$10 => {
                    var $1506 = _m$bind$9;
                    return $1506;
                }))(App$Kaelin$Effect$map$set(_map$6))((_$9 => {
                    var $1507 = App$Kaelin$Effect$monad$((_m$bind$10 => _m$pure$11 => {
                        var $1508 = _m$bind$10;
                        return $1508;
                    }))((() => {
                        var self = (_dhp$5 > 0);
                        if (self) {
                            var $1509 = App$Kaelin$Effect$indicators$add(NatMap$set$(_key$7, App$Kaelin$Indicator$green, _indicators$8));
                            return $1509;
                        } else {
                            var self = (_dhp$5 < 0);
                            if (self) {
                                var $1511 = App$Kaelin$Effect$indicators$add(NatMap$set$(_key$7, App$Kaelin$Indicator$red, _indicators$8));
                                var $1510 = $1511;
                            } else {
                                var $1512 = App$Kaelin$Effect$monad$((_m$bind$10 => _m$pure$11 => {
                                    var $1513 = _m$pure$11;
                                    return $1513;
                                }))(Unit$new);
                                var $1510 = $1512;
                            };
                            return $1510;
                        };
                    })())((_$10 => {
                        var $1514 = App$Kaelin$Effect$monad$((_m$bind$11 => _m$pure$12 => {
                            var $1515 = _m$pure$12;
                            return $1515;
                        }))(_dhp$5);
                        return $1514;
                    }));
                    return $1507;
                }));
                return $1501;
            }));
            return $1499;
        }));
        return $1497;
    };
    const App$Kaelin$Effect$hp$change = x0 => App$Kaelin$Effect$hp$change$(x0);

    function App$Kaelin$Effect$hp$damage$(_dmg$1) {
        var $1516 = App$Kaelin$Effect$hp$change$(((-_dmg$1)));
        return $1516;
    };
    const App$Kaelin$Effect$hp$damage = x0 => App$Kaelin$Effect$hp$damage$(x0);

    function App$Kaelin$Skill$fireball$(_key$1, _dmg$2, _range$3) {
        var $1517 = App$Kaelin$Effect$monad$((_m$bind$4 => _m$pure$5 => {
            var $1518 = _m$bind$4;
            return $1518;
        }))(App$Kaelin$Effect$coord$get_target)((_target_pos$4 => {
            var $1519 = App$Kaelin$Effect$monad$((_m$bind$5 => _m$pure$6 => {
                var $1520 = _m$bind$5;
                return $1520;
            }))(App$Kaelin$Effect$coord$get_center)((_center_pos$5 => {
                var _coords$6 = App$Kaelin$Coord$range$(_target_pos$4, _range$3);
                var $1521 = App$Kaelin$Effect$monad$((_m$bind$7 => _m$pure$8 => {
                    var $1522 = _m$bind$7;
                    return $1522;
                }))(App$Kaelin$Effect$animation$push(_coords$6))((_$7 => {
                    var $1523 = App$Kaelin$Effect$monad$((_m$bind$8 => _m$pure$9 => {
                        var $1524 = _m$bind$8;
                        return $1524;
                    }))(App$Kaelin$Effect$area(App$Kaelin$Effect$hp$damage$(_dmg$2))(_coords$6))((_$8 => {
                        var $1525 = App$Kaelin$Effect$monad$((_m$bind$9 => _m$pure$10 => {
                            var $1526 = _m$bind$9;
                            return $1526;
                        }))(App$Kaelin$Effect$ap$cost$(_key$1, _center_pos$5))((_$9 => {
                            var $1527 = App$Kaelin$Effect$monad$((_m$bind$10 => _m$pure$11 => {
                                var $1528 = _m$pure$11;
                                return $1528;
                            }))(Unit$new);
                            return $1527;
                        }));
                        return $1525;
                    }));
                    return $1523;
                }));
                return $1521;
            }));
            return $1519;
        }));
        return $1517;
    };
    const App$Kaelin$Skill$fireball = x0 => x1 => x2 => App$Kaelin$Skill$fireball$(x0, x1, x2);
    const App$Kaelin$Heroes$Croni$skills$fireball = App$Kaelin$Skill$new$("Fireball", 2, 5, App$Kaelin$Skill$fireball$(87, 3, 1), 87);

    function App$Kaelin$Effect$ap$burn$(_key$1, _pos$2) {
        var $1529 = App$Kaelin$Effect$ap$change_at$(_key$1, _pos$2);
        return $1529;
    };
    const App$Kaelin$Effect$ap$burn = x0 => x1 => App$Kaelin$Effect$ap$burn$(x0, x1);

    function App$Kaelin$Map$creature$change_ap$(_value$1, _pos$2, _map$3) {
        var _change_ap$4 = (_val$4 => _crea$5 => {
            var self = _crea$5;
            switch (self._) {
                case 'App.Kaelin.Creature.new':
                    var $1532 = self.hero;
                    var $1533 = self.ap;
                    var self = $1532;
                    switch (self._) {
                        case 'App.Kaelin.Hero.new':
                            var $1535 = self.max_ap;
                            var _new_ap$17 = I32$min$((($1533 + _value$1) >> 0), $1535);
                            var self = _crea$5;
                            switch (self._) {
                                case 'App.Kaelin.Creature.new':
                                    var $1537 = self.player;
                                    var $1538 = self.hero;
                                    var $1539 = self.team;
                                    var $1540 = self.hp;
                                    var $1541 = self.status;
                                    var $1542 = App$Kaelin$Creature$new$($1537, $1538, $1539, $1540, _new_ap$17, $1541);
                                    var $1536 = $1542;
                                    break;
                            };
                            var $1534 = $1536;
                            break;
                    };
                    var $1531 = $1534;
                    break;
            };
            return $1531;
        });
        var _map$5 = App$Kaelin$Map$creature$modify_at$(_change_ap$4(_value$1), _pos$2, _map$3);
        var $1530 = Pair$new$(_value$1, _map$5);
        return $1530;
    };
    const App$Kaelin$Map$creature$change_ap = x0 => x1 => x2 => App$Kaelin$Map$creature$change_ap$(x0, x1, x2);

    function App$Kaelin$Effect$ap$change$(_change$1, _pos$2) {
        var $1543 = App$Kaelin$Effect$monad$((_m$bind$3 => _m$pure$4 => {
            var $1544 = _m$bind$3;
            return $1544;
        }))(App$Kaelin$Effect$map$get)((_map$3 => {
            var _res$4 = App$Kaelin$Map$creature$change_ap$(_change$1, _pos$2, _map$3);
            var self = _res$4;
            switch (self._) {
                case 'Pair.new':
                    var $1546 = self.fst;
                    var $1547 = $1546;
                    var _apc$5 = $1547;
                    break;
            };
            var self = _res$4;
            switch (self._) {
                case 'Pair.new':
                    var $1548 = self.snd;
                    var $1549 = $1548;
                    var _map$6 = $1549;
                    break;
            };
            var _key$7 = App$Kaelin$Coord$Convert$axial_to_nat$(_pos$2);
            var $1545 = App$Kaelin$Effect$monad$((_m$bind$8 => _m$pure$9 => {
                var $1550 = _m$bind$8;
                return $1550;
            }))(App$Kaelin$Effect$map$set(_map$6))((_$8 => {
                var $1551 = App$Kaelin$Effect$monad$((_m$bind$9 => _m$pure$10 => {
                    var $1552 = _m$pure$10;
                    return $1552;
                }))(_apc$5);
                return $1551;
            }));
            return $1545;
        }));
        return $1543;
    };
    const App$Kaelin$Effect$ap$change = x0 => x1 => App$Kaelin$Effect$ap$change$(x0, x1);

    function App$Kaelin$Effect$ap$restore$(_value$1, _pos$2) {
        var $1553 = App$Kaelin$Effect$ap$change$(((-_value$1)), _pos$2);
        return $1553;
    };
    const App$Kaelin$Effect$ap$restore = x0 => x1 => App$Kaelin$Effect$ap$restore$(x0, x1);

    function App$Kaelin$Skill$ap_drain$(_key$1) {
        var $1554 = App$Kaelin$Effect$monad$((_m$bind$2 => _m$pure$3 => {
            var $1555 = _m$bind$2;
            return $1555;
        }))(App$Kaelin$Effect$map$get)((_map$2 => {
            var $1556 = App$Kaelin$Effect$monad$((_m$bind$3 => _m$pure$4 => {
                var $1557 = _m$bind$3;
                return $1557;
            }))(App$Kaelin$Effect$coord$get_center)((_center_pos$3 => {
                var $1558 = App$Kaelin$Effect$monad$((_m$bind$4 => _m$pure$5 => {
                    var $1559 = _m$bind$4;
                    return $1559;
                }))(App$Kaelin$Effect$coord$get_target)((_target_pos$4 => {
                    var _block$5 = App$Kaelin$Coord$eql$(_target_pos$4, _center_pos$3);
                    var self = _block$5;
                    if (self) {
                        var $1561 = App$Kaelin$Effect$monad$((_m$bind$6 => _m$pure$7 => {
                            var $1562 = _m$pure$7;
                            return $1562;
                        }))(Unit$new);
                        var $1560 = $1561;
                    } else {
                        var $1563 = App$Kaelin$Effect$monad$((_m$bind$6 => _m$pure$7 => {
                            var $1564 = _m$bind$6;
                            return $1564;
                        }))(App$Kaelin$Effect$ap$burn$(_key$1, _target_pos$4))((_burn$6 => {
                            var $1565 = App$Kaelin$Effect$monad$((_m$bind$7 => _m$pure$8 => {
                                var $1566 = _m$bind$7;
                                return $1566;
                            }))(App$Kaelin$Effect$ap$restore$(1, _target_pos$4))((_$7 => {
                                var $1567 = App$Kaelin$Effect$monad$((_m$bind$8 => _m$pure$9 => {
                                    var $1568 = _m$bind$8;
                                    return $1568;
                                }))(App$Kaelin$Effect$ap$restore$(((-((_burn$6 + 3) >> 0))), _center_pos$3))((_$8 => {
                                    var $1569 = App$Kaelin$Effect$monad$((_m$bind$9 => _m$pure$10 => {
                                        var $1570 = _m$pure$10;
                                        return $1570;
                                    }))(Unit$new);
                                    return $1569;
                                }));
                                return $1567;
                            }));
                            return $1565;
                        }));
                        var $1560 = $1563;
                    };
                    return $1560;
                }));
                return $1558;
            }));
            return $1556;
        }));
        return $1554;
    };
    const App$Kaelin$Skill$ap_drain = x0 => App$Kaelin$Skill$ap_drain$(x0);
    const App$Kaelin$Heroes$Croni$skills$ap_drain = App$Kaelin$Skill$new$("Action Points Drain", 3, 1, App$Kaelin$Skill$ap_drain$(69), 69);

    function App$Kaelin$Skill$ap_recover$(_restoration$1) {
        var $1571 = App$Kaelin$Effect$monad$((_m$bind$2 => _m$pure$3 => {
            var $1572 = _m$bind$2;
            return $1572;
        }))(App$Kaelin$Effect$coord$get_center)((_self$2 => {
            var $1573 = App$Kaelin$Effect$monad$((_m$bind$3 => _m$pure$4 => {
                var $1574 = _m$bind$3;
                return $1574;
            }))(App$Kaelin$Effect$ap$restore$(((-_restoration$1)), _self$2))((_$3 => {
                var $1575 = App$Kaelin$Effect$monad$((_m$bind$4 => _m$pure$5 => {
                    var $1576 = _m$pure$5;
                    return $1576;
                }))(Unit$new);
                return $1575;
            }));
            return $1573;
        }));
        return $1571;
    };
    const App$Kaelin$Skill$ap_recover = x0 => App$Kaelin$Skill$ap_recover$(x0);
    const App$Kaelin$Heroes$Croni$skills$ap_recover = App$Kaelin$Skill$new$("Action Points Reovery", 0, 0, App$Kaelin$Skill$ap_recover$(10), 82);

    function App$Kaelin$Coord$Cubic$distance$(_coord_a$1, _coord_b$2) {
        var self = _coord_a$1;
        switch (self._) {
            case 'App.Kaelin.Coord.Cubic.new':
                var $1578 = self.x;
                var $1579 = self.y;
                var $1580 = self.z;
                var self = _coord_b$2;
                switch (self._) {
                    case 'App.Kaelin.Coord.Cubic.new':
                        var $1582 = self.x;
                        var $1583 = self.y;
                        var $1584 = self.z;
                        var _subx$9 = (($1578 - $1582) >> 0);
                        var _suby$10 = (($1579 - $1583) >> 0);
                        var _subz$11 = (($1580 - $1584) >> 0);
                        var $1585 = I32$max$(I32$max$(I32$abs$(_subx$9), I32$abs$(_suby$10)), I32$abs$(_subz$11));
                        var $1581 = $1585;
                        break;
                };
                var $1577 = $1581;
                break;
        };
        return $1577;
    };
    const App$Kaelin$Coord$Cubic$distance = x0 => x1 => App$Kaelin$Coord$Cubic$distance$(x0, x1);

    function App$Kaelin$Coord$distance$(_fst_coord$1, _snd_coord$2) {
        var _convert_fst$3 = App$Kaelin$Coord$Convert$axial_to_cubic$(_fst_coord$1);
        var _convert_snd$4 = App$Kaelin$Coord$Convert$axial_to_cubic$(_snd_coord$2);
        var $1586 = App$Kaelin$Coord$Cubic$distance$(_convert_fst$3, _convert_snd$4);
        return $1586;
    };
    const App$Kaelin$Coord$distance = x0 => x1 => App$Kaelin$Coord$distance$(x0, x1);

    function App$Kaelin$Effect$movement$move_sup$(_value$1, _creature$2) {
        var self = _creature$2;
        switch (self._) {
            case 'App.Kaelin.Creature.new':
                var $1588 = self.hero;
                var $1589 = self.ap;
                var self = $1588;
                switch (self._) {
                    case 'App.Kaelin.Hero.new':
                        var $1591 = self.max_ap;
                        var _new_ap$14 = I32$max$((($1589 - _value$1) >> 0), 0);
                        var _new_ap$15 = I32$min$(_new_ap$14, $1591);
                        var _ap_diff$16 = ((_new_ap$15 - $1589) >> 0);
                        var _new_ap$17 = I32$min$((($1589 + _ap_diff$16) >> 0), $1591);
                        var self = _creature$2;
                        switch (self._) {
                            case 'App.Kaelin.Creature.new':
                                var $1593 = self.player;
                                var $1594 = self.hero;
                                var $1595 = self.team;
                                var $1596 = self.hp;
                                var $1597 = self.status;
                                var $1598 = App$Kaelin$Creature$new$($1593, $1594, $1595, $1596, _new_ap$17, $1597);
                                var $1592 = $1598;
                                break;
                        };
                        var $1590 = $1592;
                        break;
                };
                var $1587 = $1590;
                break;
        };
        return $1587;
    };
    const App$Kaelin$Effect$movement$move_sup = x0 => x1 => App$Kaelin$Effect$movement$move_sup$(x0, x1);

    function App$Kaelin$Map$Entity$creature$(_value$1) {
        var $1599 = ({
            _: 'App.Kaelin.Map.Entity.creature',
            'value': _value$1
        });
        return $1599;
    };
    const App$Kaelin$Map$Entity$creature = x0 => App$Kaelin$Map$Entity$creature$(x0);

    function App$Kaelin$Map$creature$pop$(_coord$1, _map$2) {
        var _tile$3 = App$Kaelin$Map$get$(_coord$1, _map$2);
        var self = _tile$3;
        switch (self._) {
            case 'Maybe.some':
                var $1601 = self.value;
                var self = $1601;
                switch (self._) {
                    case 'App.Kaelin.Tile.new':
                        var $1603 = self.background;
                        var $1604 = self.creature;
                        var $1605 = self.animation;
                        var _creature$8 = $1604;
                        var _remaining_tile$9 = App$Kaelin$Tile$new$($1603, Maybe$none, $1605);
                        var _new_map$10 = App$Kaelin$Map$set$(_coord$1, _remaining_tile$9, _map$2);
                        var $1606 = Pair$new$(_new_map$10, _creature$8);
                        var $1602 = $1606;
                        break;
                };
                var $1600 = $1602;
                break;
            case 'Maybe.none':
                var $1607 = Pair$new$(_map$2, Maybe$none);
                var $1600 = $1607;
                break;
        };
        return $1600;
    };
    const App$Kaelin$Map$creature$pop = x0 => x1 => App$Kaelin$Map$creature$pop$(x0, x1);

    function App$Kaelin$Map$creature$swap$(_ca$1, _cb$2, _map$3) {
        var self = App$Kaelin$Map$creature$pop$(_ca$1, _map$3);
        switch (self._) {
            case 'Pair.new':
                var $1609 = self.fst;
                var $1610 = self.snd;
                var self = $1610;
                switch (self._) {
                    case 'Maybe.some':
                        var $1612 = self.value;
                        var _entity$7 = App$Kaelin$Map$Entity$creature$($1612);
                        var $1613 = App$Kaelin$Map$push$(_cb$2, _entity$7, $1609);
                        var $1611 = $1613;
                        break;
                    case 'Maybe.none':
                        var $1614 = _map$3;
                        var $1611 = $1614;
                        break;
                };
                var $1608 = $1611;
                break;
        };
        return $1608;
    };
    const App$Kaelin$Map$creature$swap = x0 => x1 => x2 => App$Kaelin$Map$creature$swap$(x0, x1, x2);
    const App$Kaelin$Effect$movement$move = App$Kaelin$Effect$monad$((_m$bind$1 => _m$pure$2 => {
        var $1615 = _m$bind$1;
        return $1615;
    }))(App$Kaelin$Effect$map$get)((_map$1 => {
        var $1616 = App$Kaelin$Effect$monad$((_m$bind$2 => _m$pure$3 => {
            var $1617 = _m$bind$2;
            return $1617;
        }))(App$Kaelin$Effect$coord$get_center)((_center$2 => {
            var $1618 = App$Kaelin$Effect$monad$((_m$bind$3 => _m$pure$4 => {
                var $1619 = _m$bind$3;
                return $1619;
            }))(App$Kaelin$Effect$coord$get_target)((_target$3 => {
                var _distance$4 = I32$abs$(App$Kaelin$Coord$distance$(_center$2, _target$3));
                var _creature$5 = App$Kaelin$Map$creature$get$(_center$2, _map$1);
                var self = _creature$5;
                switch (self._) {
                    case 'Maybe.some':
                        var $1621 = self.value;
                        var _key$7 = App$Kaelin$Coord$Convert$axial_to_nat$(_center$2);
                        var _tile$8 = NatMap$get$(_key$7, _map$1);
                        var self = _tile$8;
                        switch (self._) {
                            case 'Maybe.none':
                                var $1623 = App$Kaelin$Effect$monad$((_m$bind$9 => _m$pure$10 => {
                                    var $1624 = _m$pure$10;
                                    return $1624;
                                }))(Unit$new);
                                var $1622 = $1623;
                                break;
                            case 'Maybe.some':
                                var self = App$Kaelin$Map$is_occupied$(_target$3, _map$1);
                                if (self) {
                                    var $1626 = App$Kaelin$Effect$monad$((_m$bind$10 => _m$pure$11 => {
                                        var $1627 = _m$pure$11;
                                        return $1627;
                                    }))(Unit$new);
                                    var $1625 = $1626;
                                } else {
                                    var self = (_distance$4 > (() => {
                                        var self = $1621;
                                        switch (self._) {
                                            case 'App.Kaelin.Creature.new':
                                                var $1629 = self.ap;
                                                var $1630 = $1629;
                                                return $1630;
                                        };
                                    })());
                                    if (self) {
                                        var $1631 = App$Kaelin$Effect$monad$((_m$bind$10 => _m$pure$11 => {
                                            var $1632 = _m$pure$11;
                                            return $1632;
                                        }))(Unit$new);
                                        var $1628 = $1631;
                                    } else {
                                        var _new_creature$10 = App$Kaelin$Effect$movement$move_sup$(_distance$4, $1621);
                                        var _mod_map$11 = App$Kaelin$Map$push$(_center$2, App$Kaelin$Map$Entity$creature$(_new_creature$10), _map$1);
                                        var _new_map$12 = App$Kaelin$Map$creature$swap$(_center$2, _target$3, _mod_map$11);
                                        var $1633 = App$Kaelin$Effect$map$set(_new_map$12);
                                        var $1628 = $1633;
                                    };
                                    var $1625 = $1628;
                                };
                                var $1622 = $1625;
                                break;
                        };
                        var $1620 = $1622;
                        break;
                    case 'Maybe.none':
                        var $1634 = App$Kaelin$Effect$monad$((_m$bind$6 => _m$pure$7 => {
                            var $1635 = _m$pure$7;
                            return $1635;
                        }))(Unit$new);
                        var $1620 = $1634;
                        break;
                };
                return $1620;
            }));
            return $1618;
        }));
        return $1616;
    }));

    function App$Kaelin$Skill$move$(_max_range$1) {
        var $1636 = App$Kaelin$Skill$new$("Move", _max_range$1, 0, App$Kaelin$Effect$movement$move, 88);
        return $1636;
    };
    const App$Kaelin$Skill$move = x0 => App$Kaelin$Skill$move$(x0);
    const App$Kaelin$Heroes$Croni$skills = List$cons$(App$Kaelin$Heroes$Croni$skills$vampirism, List$cons$(App$Kaelin$Heroes$Croni$skills$fireball, List$cons$(App$Kaelin$Heroes$Croni$skills$ap_drain, List$cons$(App$Kaelin$Heroes$Croni$skills$ap_recover, List$cons$(App$Kaelin$Skill$move$(2), List$nil)))));
    const App$Kaelin$Heroes$Croni$hero = App$Kaelin$Hero$new$("Croni", App$Kaelin$Assets$hero$croni, 25, 10, App$Kaelin$Heroes$Croni$skills);
    const App$Kaelin$Assets$hero$cyclope$vbox_idle = VoxBox$parse$("0e0a212c333d0f0a212c333d100a212c333d110a212c333d0d0b202c333d0e0b20fff9e10f0b20fff9e1100b20fff9e1110b20fff9e1120b202c333d0d0c1f2c333d0e0c1ffff9e10f0c1ffff9e1100c1ffff9e1110c1ffff9e1120c1f2c333d0c0d1e2729600d0d1e2729600e0d1efff9e10f0d1eccc8b7100d1eccc8b7110d1eccc8b7120d1e272960130d1e272960140d1e2729600c0e1d2729600d0e1d2729600e0e1dfff9e10f0e1dccc8b7100e1dccc8b7110e1dccc8b7120e1d272960130e1d272960140e1d272960050f1c272960060f1c272960070f1c272960090f1c2729600a0f1c2729600b0f1c2729600c0f1c5176b80d0f1cfff9e10e0f1cdfdbc80f0f1cdfdbc8100f1cdfdbc8110f1cdfdbc8120f1cccc8b7130f1c5176b8140f1c5176b8150f1c27296005101b27296006101b799cd307101b799cd308101b27296009101b5176b80a101b5176b80b101b5176b80c101b799cd30d101b5176b80e101bdfdbc80f101bccc8b710101bccc8b711101bccc8b712101b5176b813101b799cd314101b799cd315101b5176b816101b27296017101b27296018101b27296005111a27296006111a799cd307111a799cd308111a27296009111a5176b80a111a5176b80b111a5176b80c111a799cd30d111a5176b80e111adfdbc80f111accc8b710111accc8b711111accc8b712111a5176b813111a799cd314111a799cd315111a5176b816111a27296017111a27296018111a2729600512192729600612195176b80712195176b8081219394c87091219799cd30a1219799cd30b1219799cd30c12195176b80d12194a2b710e12194a2b710f12194a2b711012194a2b711112194a2b711212194a2b711312195176b81412195176b8151219799cd31612192729601712192729601812192729600513182729600613185176b80713185176b8081318394c87091318799cd30a1318799cd30b1318799cd30c13185176b80d13184a2b710e13184a2b710f13184a2b711013184a2b711113184a2b711213184a2b711313185176b81413185176b8151318799cd3161318272960171318272960181318272960051417272960061417272960071417272960081417394c870914175176b80a14175176b80b14175176b80c14174a2b710d1417dab04d0e1417dab04d0f1417dab04d101417dab04d111417dab04d121417dab04d1314174a2b711414174a2b711514175176b8161417394c87171417394c87181417394c871914172729601a1417272960051516272960061516799cd3071516799cd3081516394c870915165176b80a15165176b80b15165176b80c15164a2b710d1516dab04d0e1516fff9e10f1516fff9e1101516fff9e1111516fff9e1121516dab04d1315164a2b711415164a2b711515165176b8161516394c87171516394c87181516394c87191516799cd31a1516272960051615272960061615799cd3071615799cd3081615394c870916155176b80a16155176b80b16155176b80c16154a2b710d1615dab04d0e1615fff9e10f1615fff9e1101615fff9e1111615fff9e1121615dab04d1316154a2b711416154a2b711516155176b8161615394c87171615394c87181615394c87191615799cd31a1615272960051714272960061714272960071714272960081714394c870917145176b80a17145176b80b17145176b80c17144a2b710d1714dab04d0e17142421260f1714242126101714242126111714242126121714dab04d1317144a2b711417144a2b711517145176b8161714394c87171714394c87181714394c871917142729601a17145176b81b17142729600518132729600618135176b80718135176b8081813394c870918135176b80a18135176b80b18135176b80c18135176b80d18134a2b710e18134a2b710f18134a2b711018134a2b711118134a2b711218134a2b711318135176b81418135176b81518135176b8161813394c87171813394c87181813394c87191813799cd31a1813799cd31b18132729600519122729600619125176b80719125176b8081912394c870919125176b80a19125176b80b19125176b80c19125176b80d19124a2b710e19124a2b710f19124a2b711019124a2b711119124a2b711219124a2b711319125176b81419125176b81519125176b8161912394c87171912394c87181912394c87191912799cd31a1912799cd31b1912272960051a11272960061a115176b8071a115176b8081a11394c87091a115176b80a1a115176b80b1a115176b80c1a115176b80d1a114a2b710e1a114a2b710f1a114a2b71101a114a2b71111a114a2b71121a114a2b71131a115176b8141a115176b8151a115176b8161a11394c87171a11394c87181a11394c87191a11799cd31a1a11799cd31b1a11272960051b10272960061b10799cd3071b10799cd3081b105176b8091b10394c870a1b10394c870b1b10394c870c1b10dfdbc80d1b105176b80e1b105176b80f1b105176b8101b105176b8111b105176b8121b105176b8131b10dfdbc8141b10dfdbc8151b10394c87161b105176b8171b105176b8181b105176b8191b105176b81a1b10799cd31b1b10272960061c0f272960071c0f272960081c0f272960091c0f394c870a1c0f394c870b1c0f394c870c1c0fdfdbc80d1c0f4662a10e1c0f4662a10f1c0f4662a1101c0f4662a1111c0f4662a1121c0f4662a1131c0fdfdbc8141c0fdfdbc8151c0f394c87161c0f394c87171c0f394c87181c0f394c87191c0f5176b81a1c0f5176b81b1c0f272960081d0e272960091d0e5176b80a1d0e5176b80b1d0e5176b80c1d0e394c870d1d0e394c870e1d0e394c870f1d0e394c87101d0e394c87111d0e394c87121d0e394c87131d0e394c87141d0e394c87151d0e5176b8161d0e394c87171d0e394c87181d0e394c87191d0e5176b81a1d0e5176b81b1d0e272960081e0d272960091e0d5176b80a1e0d5176b80b1e0d5176b80c1e0d394c870d1e0d394c870e1e0d394c870f1e0d394c87101e0d394c87111e0d394c87121e0d394c87131e0d394c87141e0d394c87151e0d5176b8161e0d394c87171e0d394c87181e0d394c87191e0d5176b81a1e0d5176b81b1e0d272960081f0c272960091f0c5176b80a1f0c5176b80b1f0c5176b80c1f0c394c870d1f0c394c870e1f0c394c870f1f0c394c87101f0c394c87111f0c394c87121f0c394c87131f0c394c87141f0c394c87151f0c5176b8161f0c394c87171f0c394c87181f0c394c87191f0c5176b81a1f0c5176b81b1f0c27296008200b27296009200b5176b80a200b5176b80b200b5176b80c200b5176b80d200b5176b80e200b5176b80f200b5176b810200b5176b811200b5176b812200b5176b813200b5176b814200b5176b815200b394c8716200b799cd317200b799cd318200b799cd319200b5176b81a200b5176b81b200b27296008210a27296009210a8e4a9d0a210a8e4a9d0b210a8e4a9d0c210a8e4a9d0d210a5176b80e210a5176b80f210a5176b810210a5176b811210a5176b812210a5176b813210a394c8714210a394c8715210a394c8716210a799cd317210a799cd318210a799cd319210a799cd31a210a5176b81b210a2729600922092729600a22092729600b22092729600c22094a2b710d22098e4a9d0e22098e4a9d0f22098e4a9d1022098e4a9d1122098e4a9d1222098e4a9d132209394c87142209394c871522095176b8162209394c87172209394c87182209394c87192209394c871a22092729600923082729600a23082729600b23082729600c23084a2b710d23088e4a9d0e23088e4a9d0f23088e4a9d1023088e4a9d1123088e4a9d1223088e4a9d132308394c87142308394c871523085176b8162308394c87172308394c87182308394c87192308394c871a23082729600924072729600a24072729600b24072729600c24074a2b710d24078e4a9d0e24078e4a9d0f24078e4a9d1024078e4a9d1124078e4a9d1224078e4a9d132407394c87142407394c871524075176b8162407394c87172407394c87182407394c87192407394c871a24072729600925062729600a25062729600b25062729600c25065176b80d25064a2b710e25068e4a9d0f25068e4a9d1025068e4a9d1125068e4a9d1225064a2b71132506394c87142506394c87152506799cd3162506799cd3172506799cd3182506799cd31925065176b81a25062729600926052729600a26052729600b26052729600c2605799cd30d2605799cd30e26054a2b710f26054a2b711026054a2b711126054a2b711226052729601326052729601426052729601526052729601626052729601726052729601826052729601926052729600927042729600a27042729600b27042729600c27042729600d27042729600e2704272960");
    const App$Kaelin$Assets$hero$cyclope$base64_idle = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB8AAAAoCAYAAAAG0SEsAAAAAXNSR0IArs4c6QAAAvxJREFUWIXtl01IVFEUx39PhZFh8BNsbJCIyTfjYAsJXARCiTmECeFKpIUErmqhuZRW4fJpizZtwkWEEAyBTaGIBkILQVwk48zU0IfYaDRKYpKZvRbje/PezH3OC7Ik5r953HPPPeeec/733vOggAIKKOB/hfS7CxrPtdDe2szUzLxqlLe3NktTM/MALC3M/TnnvobezILibUoc6+qrlw9NOmfPX+PH7gkJQN13EVsey2u3yNYWjwglIqExUoCy2jq2kisAqPsudW/HBcDCYkTX2dvxAmilkIw2rLJgK/Kt5Aql5ZWUllfaUcdZXWNLT1hzX0OvTia37JfW4lF9HOjsJnSngXcfkqY1qdQmw6G0ucjEOM7qGmkn9UmfF0UvTDtA1+AgACFFUQOd3brcL3vour3MSF8FqdSmLh8OSfhlT3rQ2U1kYtx4GoRBHj/CAUTjqwBUeX2ZiA7ku+FJboQFawgC6exEsuY0AhrT/1ciL3Y4hHLLyCMT40A6ci0LALvhSe4OvxGu6R9Kf6MEqfL6dPlGIqYfQVvONcK9ePJUOF9/+Z5p/Pr5TStTdA0OElKUnCN4PAkXUhQAU/qMqPdfMo2fjYr1NFuBzPHTU2/pXDvba5FFk9zREaR/CGTnGZO8fyg9J4JWwuwT8E/TfjxrbrxYjKl/NHqRW4jTO9JXAUDPwCzuQJMuj8ZXTfYOde6RZSmkKPrdnE26r5/XLbZcIdywO9BkuisOdb4aj0OGlaoxip6BWQvH0DPwUXeWTVQRCoQzIbY8ltNKaTCWwAprkUUuXL2ij0X1tnSejZYl8+K5xlzmak5F8Mse+4Qzora0XLr/dk5nvreokjYL3ccHRXQHmnIepI1EDGd1jelVy1vz5Lcv+VRsw9jT2XJ+lLBMu9buZBPP0RFkOjxJ26lGk3z6/RKcTr/XftmT03ptJGL2nVvBL3tAvs706AOTPPFzExLpbjak5Doqq62TtB8PDXn/1Q4iV0VzJyWXBLCPyrb6na/sHWoru3f/BfiK9iwJlXjfAAAAAElFTkSuQmCC";
    const App$Kaelin$Assets$hero$cyclope = App$Kaelin$HeroAssets$new$(App$Kaelin$Assets$hero$cyclope$vbox_idle, App$Kaelin$Assets$hero$cyclope$base64_idle);
    const App$Kaelin$Heroes$Cyclope$skills$vampirism = App$Kaelin$Skill$new$("Vampirism", 2, 1, App$Kaelin$Skill$vampirism$(81, 2), 81);
    const App$Kaelin$Heroes$Cyclope$skills$ap_recover = App$Kaelin$Skill$new$("Action Points Reovery", 0, 0, App$Kaelin$Skill$ap_recover$(10), 82);
    const App$Kaelin$Heroes$Cyclope$skills = List$cons$(App$Kaelin$Heroes$Cyclope$skills$vampirism, List$cons$(App$Kaelin$Heroes$Cyclope$skills$ap_recover, List$cons$(App$Kaelin$Skill$move$(3), List$nil)));
    const App$Kaelin$Heroes$Cyclope$hero = App$Kaelin$Hero$new$("Cyclope", App$Kaelin$Assets$hero$cyclope, 15, 10, App$Kaelin$Heroes$Cyclope$skills);
    const App$Kaelin$Assets$hero$lela$vbox_idle = VoxBox$parse$("091219fb4d4d0a1219fb4d4d0b1219fb4d4d0c1219fb4d4d131219fb4d4d141219fb4d4d151219fb4d4d161219fb4d4d081318fb4d4d0913182b496c0a13182b496c0b13182b496c0c13182b496c0d1318fb4d4d121318fb4d4d1313182b496c1413182b496c1513182b496c1613182b496c171318fb4d4d071417fb4d4d0814172b496c09141781aeff0a141781aeff0b141781aeff0c141781aeff0d14172b496c0e1417fb4d4d0f1417fb4d4d101417fb4d4d111417fb4d4d1214172b496c13141781aeff14141781aeff15141781aeff16141781aeff1714172b496c181417fb4d4d071516fb4d4d0815161f3b5b091516538ccf0a1516538ccf0b1516538ccf0c1516538ccf0d1516538ccf0e15162b496c0f15162b496c1015162b496c1115162b496c121516538ccf131516538ccf141516538ccf151516538ccf161516538ccf1715161f3b5b181516fb4d4d071615fb4d4d0816151f3b5b091615538ccf0a1615538ccf0b1615538ccf0c1615538ccf0d1615538ccf0e161581aeff0f161581aeff10161581aeff11161581aeff121615538ccf131615538ccf141615538ccf151615538ccf161615538ccf1716151f3b5b181615fb4d4d071714fb4d4d0817141f3b5b091714538ccf0a1714538ccf0b1714538ccf0c1714538ccf0d1714538ccf0e1714538ccf0f1714538ccf101714538ccf111714538ccf121714538ccf131714538ccf141714538ccf151714538ccf161714538ccf1717141f3b5b181714fb4d4d081813fb4d4d0918131f3b5b0a1813538ccf0b1813538ccf0c1813538ccf0d1813538ccf0e1813538ccf0f1813cb4646101813cb4646111813538ccf121813538ccf131813538ccf141813538ccf151813538ccf1618131f3b5b171813fb4d4d091912fb4d4d0a19121f3b5b0b1912538ccf0c1912538ccf0d1912538ccf0e1912538ccf0f1912ad1f1f101912ad1f1f111912538ccf121912538ccf131912538ccf141912538ccf1519121f3b5b161912fb4d4d091a11fb4d4d0a1a111f3b5b0b1a11538ccf0c1a11538ccf0d1a11cb46460e1a11538ccf0f1a11538ccf101a11538ccf111a11538ccf121a11cb4646131a11538ccf141a11538ccf151a111f3b5b161a11fb4d4d091b10fb4d4d0a1b101f3b5b0b1b10538ccf0c1b10538ccf0d1b10ad1f1f0e1b10538ccf0f1b103d5497101b103d5497111b10538ccf121b10ad1f1f131b10538ccf141b10538ccf151b101f3b5b161b10fb4d4d0a1c0ffb4d4d0b1c0f1f3b5b0c1c0f538ccf0d1c0f538ccf0e1c0f538ccf0f1c0f2d4382101c0f2d4382111c0f538ccf121c0f538ccf131c0f538ccf141c0f1f3b5b151c0ffb4d4d0b1d0efb4d4d0c1d0e1f3b5b0d1d0e3a67b70e1d0e538ccf0f1d0e203368101d0e203368111d0e538ccf121d0e3a67b7131d0e1f3b5b141d0efb4d4d0a1e0dfb4d4d0b1e0d1f3b5b0c1e0d538ccf0d1e0d538ccf0e1e0d3a67b70f1e0d3a67b7101e0d3a67b7111e0d3a67b7121e0d538ccf131e0d538ccf141e0d1f3b5b151e0dfb4d4d091f0cfb4d4d0a1f0c1f3b5b0b1f0c81aeff0c1f0c3a71b10d1f0c538ccf0e1f0c81aeff0f1f0c81aeff101f0c81aeff111f0c81aeff121f0c538ccf131f0c3a71b1141f0c81aeff151f0c1f3b5b161f0cfb4d4d08200bfb4d4d09200b1f3b5b0a200b538ccf0b200b538ccf0c200b3a71b10d200b538ccf0e200b538ccf0f200b538ccf10200b538ccf11200b538ccf12200b538ccf13200b3a71b114200b538ccf15200b538ccf16200b1f3b5b17200bfb4d4d08210afb4d4d09210a1f3b5b0a210a538ccf0b210a538ccf0c210a3a71b10d210a538ccf0e210a538ccf0f210a538ccf10210a538ccf11210a538ccf12210a538ccf13210a3a71b114210a538ccf15210a538ccf16210a1f3b5b17210afb4d4d082209fb4d4d0922091f3b5b0a2209538ccf0b2209538ccf0c22092753860d2209538ccf0e2209538ccf0f2209538ccf102209538ccf112209538ccf122209538ccf132209275386142209538ccf152209538ccf1622091f3b5b172209fb4d4d092308fb4d4d0a23081f3b5b0b23081f3b5b0c23081f3b5b0d23083a67b70e2308538ccf0f2308538ccf102308538ccf112308538ccf1223083a67b71323081f3b5b1423081f3b5b1523081f3b5b162308fb4d4d0a2407fb4d4d0b2407fb4d4d0c2407fb4d4d0d24071f3b5b0e24073a67b70f2407538ccf102407538ccf1124073a67b71224071f3b5b132407fb4d4d142407fb4d4d152407fb4d4d0d2506fb4d4d0e25061f3b5b0f25063a67b71025063a67b71125061f3b5b122506fb4d4d0e2605fb4d4d0f26051f3b5b1026051f3b5b112605fb4d4d0f2704fb4d4d102704fb4d4d");
    const App$Kaelin$Assets$hero$lela$base64_idle = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB8AAAAoCAYAAAAG0SEsAAAAAXNSR0IArs4c6QAAAbtJREFUWIXtlrFLw0AUxr9Ku3bIZClUkCoOIh1cnQTFIYKLk5Pi2ElB/wSFOjmKTqWDS4sZRMHJJUOHUHSILYUG2pSCbUm7VajThVyStndpHIT7Tcl7L/e9d+9dEkAgEAgEAoHgvxJhCRrJ8th5H1MU3+dY45jFR7I8zvwsUTYt2vAszBrHLE4WPDy9peyPd1lo0QZlmxY3KYHoNHEAGFo9VOoaZVvbPkHm7d5jc8cNrR4gTV57pvgk3FW6hVkILB5EzA3TwKW7cWwenHt8l68XAICrnWuPr1zMoSZZUwduYZZ4TFEiNclCuZjz+Axdh6HrgYSZxP0gFReyJRSyJcrGQyBxUm1HVdFRVcrGA9MbDvDv/dezAgBY3ZNtG+uWAxyVO3tvVtsAgEG/hUG/BQAwq20uYWCOykkChMTKIgC+ypk/LOluHMdneby8PyGRTGFjOUPFVOoazKaB3a19PNwcMSXAfc7NpoFEMuUb6/SFcs7/Em7xb+MzkM8Prp4TkutH9oARzGobzY+8fR9Kz50JkOt0N04lQIRrkmXHhzbtfomQBADYwqzney5xZwIA2xaHzkiWx+6fRh5+AUGh8BOt6NHQAAAAAElFTkSuQmCC";
    const App$Kaelin$Assets$hero$lela = App$Kaelin$HeroAssets$new$(App$Kaelin$Assets$hero$lela$vbox_idle, App$Kaelin$Assets$hero$lela$base64_idle);

    function App$Kaelin$Skill$restore$(_key$1, _value$2) {
        var $1637 = App$Kaelin$Effect$monad$((_m$bind$3 => _m$pure$4 => {
            var $1638 = _m$bind$3;
            return $1638;
        }))(App$Kaelin$Effect$coord$get_target)((_target$3 => {
            var $1639 = App$Kaelin$Effect$monad$((_m$bind$4 => _m$pure$5 => {
                var $1640 = _m$bind$4;
                return $1640;
            }))(App$Kaelin$Effect$coord$get_center)((_self$4 => {
                var $1641 = App$Kaelin$Effect$monad$((_m$bind$5 => _m$pure$6 => {
                    var $1642 = _m$bind$5;
                    return $1642;
                }))(App$Kaelin$Effect$hp$heal_at$(_value$2, _target$3))((_$5 => {
                    var $1643 = App$Kaelin$Effect$monad$((_m$bind$6 => _m$pure$7 => {
                        var $1644 = _m$bind$6;
                        return $1644;
                    }))(App$Kaelin$Effect$ap$cost$(_key$1, _self$4))((_$6 => {
                        var $1645 = App$Kaelin$Effect$monad$((_m$bind$7 => _m$pure$8 => {
                            var $1646 = _m$pure$8;
                            return $1646;
                        }))(Unit$new);
                        return $1645;
                    }));
                    return $1643;
                }));
                return $1641;
            }));
            return $1639;
        }));
        return $1637;
    };
    const App$Kaelin$Skill$restore = x0 => x1 => App$Kaelin$Skill$restore$(x0, x1);
    const App$Kaelin$Heroes$Lela$skills$restore = App$Kaelin$Skill$new$("Restore", 4, 3, App$Kaelin$Skill$restore$(81, 4), 81);

    function App$Kaelin$Skill$escort$(_key$1, _value$2) {
        var $1647 = App$Kaelin$Effect$monad$((_m$bind$3 => _m$pure$4 => {
            var $1648 = _m$bind$3;
            return $1648;
        }))(App$Kaelin$Effect$coord$get_target)((_target$3 => {
            var $1649 = App$Kaelin$Effect$monad$((_m$bind$4 => _m$pure$5 => {
                var $1650 = _m$bind$4;
                return $1650;
            }))(App$Kaelin$Effect$hp$heal_at$(_value$2, _target$3))((_$4 => {
                var $1651 = App$Kaelin$Effect$monad$((_m$bind$5 => _m$pure$6 => {
                    var $1652 = _m$bind$5;
                    return $1652;
                }))(App$Kaelin$Effect$ap$restore$(_value$2, _target$3))((_$5 => {
                    var $1653 = App$Kaelin$Effect$monad$((_m$bind$6 => _m$pure$7 => {
                        var $1654 = _m$pure$7;
                        return $1654;
                    }))(Unit$new);
                    return $1653;
                }));
                return $1651;
            }));
            return $1649;
        }));
        return $1647;
    };
    const App$Kaelin$Skill$escort = x0 => x1 => App$Kaelin$Skill$escort$(x0, x1);
    const App$Kaelin$Heroes$Lela$skills$escort = App$Kaelin$Skill$new$("Escort", 2, 2, App$Kaelin$Skill$escort$(87, 4), 87);

    function U16$new$(_value$1) {
        var $1655 = word_to_u16(_value$1);
        return $1655;
    };
    const U16$new = x0 => U16$new$(x0);
    const U16$from_nat = a0 => (Number(a0) & 0xFFFF);
    const App$Kaelin$Heroes$Lela$skills$ap_drain = App$Kaelin$Skill$new$("Action Point Drain", 2, 2, App$Kaelin$Skill$ap_drain$(2), 69);
    const App$Kaelin$Heroes$Lela$skills$ap_recover = App$Kaelin$Skill$new$("Action Points Reovery", 0, 0, App$Kaelin$Skill$ap_recover$(10), 82);
    const App$Kaelin$Heroes$Lela$skills = List$cons$(App$Kaelin$Heroes$Lela$skills$restore, List$cons$(App$Kaelin$Heroes$Lela$skills$escort, List$cons$(App$Kaelin$Heroes$Lela$skills$ap_drain, List$cons$(App$Kaelin$Heroes$Lela$skills$ap_recover, List$cons$(App$Kaelin$Skill$move$(2), List$nil)))));
    const App$Kaelin$Heroes$Lela$hero = App$Kaelin$Hero$new$("Lela", App$Kaelin$Assets$hero$lela, 20, 10, App$Kaelin$Heroes$Lela$skills);
    const App$Kaelin$Assets$hero$octoking$vbox_idle = VoxBox$parse$("0a0a21192a020b0a21192a020d0a21192a020e0a21192a02100a21192a02110a21192a02120a21192a02130a21192a02150a21192a02160a21192a02180a21192a02190a21192a020a0b20192a020b0b20192a020d0b20192a020e0b20192a02100b20192a02110b20192a02120b20192a02130b20192a02150b20192a02160b20192a02180b20192a02190b20192a02080c1f192a02090c1f192a020a0c1fe6d7510b0c1fe6d7510c0c1f192a020d0c1f70681e0e0c1f70681e0f0c1f192a02100c1ffff6a6110c1ffff6a6120c1ffff6a6130c1ffff6a6140c1f192a02150c1f70681e160c1f70681e170c1f192a02180c1fe6d751190c1fe6d7511a0c1f192a021b0c1f192a02080d1e192a02090d1e192a020a0d1ee6d7510b0d1ee6d7510c0d1efff6a60d0d1e192a020e0d1e192a020f0d1ee6d751100d1ee6d751110d1ee6d751120d1ee6d751130d1ee6d751140d1ee6d751150d1e192a02160d1e192a02170d1efff6a6180d1ee6d751190d1ee6d7511a0d1e192a021b0d1e192a02080e1d192a02090e1d192a020a0e1de6d7510b0e1de6d7510c0e1dfff6a60d0e1d192a020e0e1d192a020f0e1de6d751100e1de6d751110e1de6d751120e1de6d751130e1de6d751140e1de6d751150e1d192a02160e1d192a02170e1dfff6a6180e1de6d751190e1de6d7511a0e1d192a021b0e1d192a02080f1c192a02090f1c192a020a0f1cc9ae530b0f1cc9ae530c0f1ce6d7510d0f1ce6d7510e0f1ce6d7510f0f1ce6d751100f1cb8321d110f1cb8321d120f1cb8321d130f1cb8321d140f1ce6d751150f1ce6d751160f1ce6d751170f1ce6d751180f1cc9ae53190f1cc9ae531a0f1c192a021b0f1c192a0208101b192a0209101b192a020a101bc9ae530b101bc9ae530c101be6d7510d101be6d7510e101be6d7510f101be6d75110101bb8321d11101bb8321d12101bb8321d13101bb8321d14101be6d75115101be6d75116101be6d75117101be6d75118101bc9ae5319101bc9ae531a101b192a021b101b192a0205111a192a0206111a192a0207111a192a0208111a192a0209111a192a020a111a4281350b111a4281350c111a4281350d111a4281350e111a4281350f111ac9ae5310111ac9ae5311111ac9ae5312111ac9ae5313111ac9ae5314111ac9ae5315111a42813516111a42813517111a42813518111a42813519111a4281351a111a192a021b111a192a021c111a192a021d111a192a021e111a192a02041219192a020512199fd95d0612199fd95d0712199fd95d081219192a02091219192a020a12199fd95d0b12199fd95d0c12195ea6420d12195ea6420e12195ea6420f12194281351012194281351112194281351212194281351312194281351412194281351512195ea6421612195ea6421712195ea6421812199fd95d1912199fd95d1a1219192a021b1219192a021c12199fd95d1d12199fd95d1e12199fd95d1f1219192a02041318192a020513189fd95d0613189fd95d0713189fd95d081318192a02091318192a020a13189fd95d0b13189fd95d0c13185ea6420d13185ea6420e13185ea6420f13184281351013184281351113184281351213184281351313184281351413184281351513185ea6421613185ea6421713185ea6421813189fd95d1913189fd95d1a1318192a021b1318192a021c13189fd95d1d13189fd95d1e13189fd95d1f1318192a02021417192a02031417192a020414179fd95d0514175ea6420614175ea6420714175ea642081417192a02091417192a020a14175ea6420b14175ea6420c14175ea6420d14175ea6420e14175ea6420f14175ea6421014175ea6421114175ea6421214175ea6421314175ea6421414175ea6421514175ea6421614175ea6421714175ea6421814175ea6421914175ea6421a1417192a021b1417192a021c14175ea6421d14175ea6421e14175ea6421f14179fd95d201417192a02211417192a02041516192a020515165ea6420615165ea6420715165ea642081516192a02091516192a020a15164281350b15164281350c15164281350d15164281350e15164281350f15164281351015165ea6421115165ea6421215165ea6421315165ea6421415164281351515164281351615164281351715164281351815164281351915164281351a1516192a021b1516192a021c15165ea6421d15165ea6421e15165ea6421f1516192a02041615192a020516155ea6420616155ea6420716155ea642081615192a02091615192a020a16154281350b16154281350c16154281350d16154281350e16154281350f16154281351016155ea6421116155ea6421216155ea6421316155ea6421416154281351516154281351616154281351716154281351816154281351916154281351a1615192a021b1615192a021c16155ea6421d16155ea6421e16155ea6421f1615192a02051714192a02061714192a020717145ea6420817145ea6420917145ea6420a1714192a020b1714192a020c17144281350d1714e6d7510e1714e6d7510f1714e6d751101714428135111714428135121714428135131714428135141714e6d751151714e6d751161714e6d751171714428135181714192a02191714192a021a17145ea6421b17145ea6421c17145ea6421d1714192a021e1714192a02071813192a020818135ea6420918135ea6420a1813366d2a0b1813366d2a0c1813192a020d18134281350e18134281350f1813173e0f101813173e0f111813173e0f121813173e0f131813173e0f141813173e0f151813428135161813428135171813192a02181813366d2a191813366d2a1a18135ea6421b18135ea6421c1813192a02071912192a020819125ea6420919125ea6420a1912366d2a0b1912366d2a0c1912192a020d19124281350e19124281350f1912173e0f101912173e0f111912173e0f121912173e0f131912173e0f141912173e0f151912428135161912428135171912192a02181912366d2a191912366d2a1a19125ea6421b19125ea6421c1912192a02051a11192a02061a11192a02071a11192a02081a11428135091a114281350a1a115ea6420b1a115ea6420c1a114281350d1a11192a020e1a11192a020f1a119fd95d101a119fd95d111a119fd95d121a119fd95d131a119fd95d141a119fd95d151a11192a02161a11192a02171a11428135181a115ea642191a115ea6421a1a114281351b1a114281351c1a11192a021d1a11192a021e1a11192a02051b10192a02061b10192a02071b10192a02081b10428135091b104281350a1b105ea6420b1b105ea6420c1b104281350d1b10192a020e1b10192a020f1b109fd95d101b109fd95d111b109fd95d121b109fd95d131b109fd95d141b109fd95d151b10192a02161b10192a02171b10428135181b105ea642191b105ea6421a1b104281351b1b104281351c1b10192a021d1b10192a021e1b10192a02041c0f192a02051c0f366d2a061c0f366d2a071c0f192a02081c0f5ea642091c0f5ea6420a1c0f4281350b1c0f4281350c1c0f192a020d1c0f9fd95d0e1c0f9fd95d0f1c0f5ea642101c0f428135111c0f428135121c0f428135131c0f428135141c0f5ea642151c0f9fd95d161c0f9fd95d171c0f192a02181c0f428135191c0f4281351a1c0f5ea6421b1c0f5ea6421c1c0f192a021d1c0f366d2a1e1c0f366d2a1f1c0f192a02021d0e192a02031d0e192a02041d0e428135051d0e428135061d0e428135071d0e192a02081d0e428135091d0e4281350a1d0e4281350b1d0e4281350c1d0e192a020d1d0e5ea6420e1d0e5ea6420f1d0e5ea642101d0e428135111d0e428135121d0e428135131d0e428135141d0e5ea642151d0e5ea642161d0e5ea642171d0e192a02181d0e428135191d0e4281351a1d0e4281351b1d0e4281351c1d0e192a021d1d0e4281351e1d0e4281351f1d0e428135201d0e192a02211d0e192a02021e0d192a02031e0d192a02041e0d428135051e0d428135061e0d428135071e0d192a02081e0d428135091e0d4281350a1e0d4281350b1e0d4281350c1e0d192a020d1e0d5ea6420e1e0d5ea6420f1e0d5ea642101e0d428135111e0d428135121e0d428135131e0d428135141e0d5ea642151e0d5ea642161e0d5ea642171e0d192a02181e0d428135191e0d4281351a1e0d4281351b1e0d4281351c1e0d192a021d1e0d4281351e1e0d4281351f1e0d428135201e0d192a02211e0d192a02001f0c192a02011f0c192a02021f0c9fd95d031f0c9fd95d041f0c5ea642051f0c428135061f0c428135071f0c192a02081f0c5ea642091f0c5ea6420a1f0c4281350b1f0c4281350c1f0c192a020d1f0c5ea6420e1f0c5ea6420f1f0c5ea642101f0c428135111f0c428135121f0c428135131f0c428135141f0c5ea642151f0c5ea642161f0c5ea642171f0c192a02181f0c428135191f0c4281351a1f0c5ea6421b1f0c5ea6421c1f0c192a021d1f0c4281351e1f0c4281351f1f0c5ea642201f0c9fd95d211f0c9fd95d221f0c192a0202200b192a0203200b192a0204200b192a0205200b42813506200b42813507200b42813508200b192a0209200b192a020a200b366d2a0b200b366d2a0c200b192a020d200b5ea6420e200b5ea6420f200b5ea64210200b42813511200b42813512200b42813513200b42813514200b5ea64215200b5ea64216200b5ea64217200b192a0218200b366d2a19200b366d2a1a200b192a021b200b192a021c200b4281351d200b4281351e200b4281351f200b192a0220200b192a0221200b192a0202210a192a0203210a192a0204210a192a0205210a42813506210a42813507210a42813508210a192a0209210a192a020a210a366d2a0b210a366d2a0c210a192a020d210a5ea6420e210a5ea6420f210a5ea64210210a42813511210a42813512210a42813513210a42813514210a5ea64215210a5ea64216210a5ea64217210a192a0218210a366d2a19210a366d2a1a210a192a021b210a192a021c210a4281351d210a4281351e210a4281351f210a192a0220210a192a0221210a192a02052209192a02062209192a02072209192a020a2209192a020b2209192a020c2209192a020d22095ea6420e22095ea6420f22094281351022094281351122094281351222094281351322094281351422094281351522095ea6421622095ea642172209192a02182209192a02192209192a021c2209192a021d2209192a021e2209192a02052308192a02062308192a02072308192a020a2308192a020b2308192a020c2308192a020d23085ea6420e23085ea6420f23084281351023084281351123084281351223084281351323084281351423084281351523085ea6421623085ea642172308192a02182308192a02192308192a021c2308192a021d2308192a021e2308192a02082407192a02092407192a020a2407192a020b2407192a020c24075ea6420d24074281350e24074281350f2407428135102407366d2a112407366d2a122407366d2a132407366d2a1424074281351524074281351624074281351724075ea642182407192a02192407192a021a2407192a021b2407192a02072506192a020825065ea6420925065ea6420a25065ea6420b25065ea6420c25064281350d25064281350e25064281350f2506366d2a102506192a02112506192a02122506192a02132506192a02142506366d2a1525064281351625064281351725064281351825065ea6421925065ea6421a25065ea6421b25065ea6421c2506192a02072605192a020826055ea6420926055ea6420a26055ea6420b26055ea6420c26054281350d26054281350e26054281350f2605366d2a102605192a02112605192a02122605192a02132605192a02142605366d2a1526054281351626054281351726054281351826055ea6421926055ea6421a26055ea6421b26055ea6421c2605192a02082704192a02092704192a020a2704192a020b2704192a020c2704192a020d2704192a020e2704192a020f2704192a02142704192a02152704192a02162704192a02172704192a02182704192a02192704192a021a2704192a021b2704192a02");
    const App$Kaelin$Assets$hero$octoking$base64_idle = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACMAAAAoCAYAAAB0HkOaAAAAAXNSR0IArs4c6QAAAmpJREFUWIXtV79P21AQ/ojYgI2BQOhGlQSVxVm6VFQRM4qQmiHhD2nEiEL/kHhIIxQxRxFsLPHSqsQqE01KOnQDVtwhuePej9gJUoWR/E3P7+6d7913P2wgQYIECRK8DBZmVUznUwEAjK4eF2xrwjT56Oox8l2peTz/31iMUqCbeaf7AADn4Cwof8gAAJoYBre9hqK/XqgqcnkOCI9QpDM6bnsNrBeqIAdHNy1F7p3uwzk4Y11dHobXRRNh0Ce/W0wZAHyr9BS9HbfA8tFNS5yLRqwiY00mvVwBIFd2DL2Td2+sRj9//2Xs9Zuesacns+FMOp8K6u0KP9dKLgCA9s693ywbXt9ZnclsrfD6o7NhtUN70qFY0cQJTNTU2xXl9gTbnozANOjn5HO9XUGt5HL/YWcoXLWSG+wd7RpGZ6EkTM+GWNMUWk0yQp3jCwDjqmp8yvB+9etQOavLqIpstiKrSXeKjPiXfwAAg67PZf6j+9N6brv4FsC4nDeLWQBA9v0aOzJtPsWKJus4kE2PEpJutry6xKH/InqGBPWUXNnhBJeJPe0bJ96RSedTAfE86PrGzfpNT+nGeilntlZYXiu5wCS/yE4f4DwC/EBGx2h6+gyy9Q1bA4ySSzvLq0vgdzU9pixeNMkxAJihtyXgcyBpknuHT5QGi3IMkBJRlSs73KCeeJ4P938fAACdSQXKNOgcX6AzWcePJlooNT9JKnXfNz64bNQNr++U4Tno+qodq+0xYhWZyL88/RN072hXiQjlBIHKFhgnKOUcIey/aeZBSdAdIRoIm8Ws4ZDEqxmUc9OkQ7/lvPoS/wCkW09PqnYt4QAAAABJRU5ErkJggg==";
    const App$Kaelin$Assets$hero$octoking = App$Kaelin$HeroAssets$new$(App$Kaelin$Assets$hero$octoking$vbox_idle, App$Kaelin$Assets$hero$octoking$base64_idle);

    function App$Kaelin$Effect$hp$heal$(_heal$1) {
        var $1656 = App$Kaelin$Effect$hp$change$(_heal$1);
        return $1656;
    };
    const App$Kaelin$Effect$hp$heal = x0 => App$Kaelin$Effect$hp$heal$(x0);

    function App$Kaelin$Skill$empathy$(_key$1, _dmg$2, _range$3) {
        var $1657 = App$Kaelin$Effect$monad$((_m$bind$4 => _m$pure$5 => {
            var $1658 = _m$bind$4;
            return $1658;
        }))(App$Kaelin$Effect$map$get)((_map$4 => {
            var $1659 = App$Kaelin$Effect$monad$((_m$bind$5 => _m$pure$6 => {
                var $1660 = _m$bind$5;
                return $1660;
            }))(App$Kaelin$Effect$coord$get_target)((_target$5 => {
                var $1661 = App$Kaelin$Effect$monad$((_m$bind$6 => _m$pure$7 => {
                    var $1662 = _m$bind$6;
                    return $1662;
                }))(App$Kaelin$Effect$coord$get_center)((_center$6 => {
                    var _area$7 = App$Kaelin$Coord$range$(_target$5, _range$3);
                    var $1663 = App$Kaelin$Effect$monad$((_m$bind$8 => _m$pure$9 => {
                        var $1664 = _m$bind$8;
                        return $1664;
                    }))(App$Kaelin$Effect$ap$cost$(_key$1, _center$6))((_$8 => {
                        var $1665 = App$Kaelin$Effect$monad$((_m$bind$9 => _m$pure$10 => {
                            var $1666 = _m$bind$9;
                            return $1666;
                        }))(App$Kaelin$Effect$hp$damage_at$(_dmg$2, _center$6))((_$9 => {
                            var $1667 = App$Kaelin$Effect$monad$((_m$bind$10 => _m$pure$11 => {
                                var $1668 = _m$bind$10;
                                return $1668;
                            }))(App$Kaelin$Effect$area(App$Kaelin$Effect$hp$heal$(((_dmg$2 * 2) >> 0)))(_area$7))((_$10 => {
                                var $1669 = App$Kaelin$Effect$monad$((_m$bind$11 => _m$pure$12 => {
                                    var $1670 = _m$pure$12;
                                    return $1670;
                                }))(Unit$new);
                                return $1669;
                            }));
                            return $1667;
                        }));
                        return $1665;
                    }));
                    return $1663;
                }));
                return $1661;
            }));
            return $1659;
        }));
        return $1657;
    };
    const App$Kaelin$Skill$empathy = x0 => x1 => x2 => App$Kaelin$Skill$empathy$(x0, x1, x2);
    const App$Kaelin$Heroes$Octoking$skills$Empathy = App$Kaelin$Skill$new$("Empathy", 1, 0, App$Kaelin$Skill$empathy$(81, 2, 1), 81);
    const I32$div = a0 => a1 => ((a0 / a1) >> 0);

    function App$Kaelin$Skill$revenge$(_key$1) {
        var $1671 = App$Kaelin$Effect$monad$((_m$bind$2 => _m$pure$3 => {
            var $1672 = _m$bind$2;
            return $1672;
        }))(App$Kaelin$Effect$map$get)((_map$2 => {
            var $1673 = App$Kaelin$Effect$monad$((_m$bind$3 => _m$pure$4 => {
                var $1674 = _m$bind$3;
                return $1674;
            }))(App$Kaelin$Effect$coord$get_center)((_center$3 => {
                var $1675 = App$Kaelin$Effect$monad$((_m$bind$4 => _m$pure$5 => {
                    var $1676 = _m$bind$4;
                    return $1676;
                }))(App$Kaelin$Effect$coord$get_target)((_target$4 => {
                    var _creature$5 = App$Kaelin$Map$creature$get$(_center$3, _map$2);
                    var self = _creature$5;
                    switch (self._) {
                        case 'Maybe.some':
                            var $1678 = self.value;
                            var self = $1678;
                            switch (self._) {
                                case 'App.Kaelin.Creature.new':
                                    var $1680 = self.hero;
                                    var $1681 = self.hp;
                                    var self = $1680;
                                    switch (self._) {
                                        case 'App.Kaelin.Hero.new':
                                            var $1683 = self.max_hp;
                                            var _missing_hp$18 = (($1683 - $1681) >> 0);
                                            var _true_dmg$19 = ((_missing_hp$18 / 4) >> 0);
                                            var $1684 = _true_dmg$19;
                                            var $1682 = $1684;
                                            break;
                                    };
                                    var $1679 = $1682;
                                    break;
                            };
                            var _true_dmg$6 = $1679;
                            break;
                        case 'Maybe.none':
                            var $1685 = 0;
                            var _true_dmg$6 = $1685;
                            break;
                    };
                    var $1677 = App$Kaelin$Effect$monad$((_m$bind$7 => _m$pure$8 => {
                        var $1686 = _m$bind$7;
                        return $1686;
                    }))(App$Kaelin$Effect$ap$cost$(_key$1, _center$3))((_$7 => {
                        var $1687 = App$Kaelin$Effect$monad$((_m$bind$8 => _m$pure$9 => {
                            var $1688 = _m$bind$8;
                            return $1688;
                        }))(App$Kaelin$Effect$hp$damage_at$(_true_dmg$6, _target$4))((_$8 => {
                            var $1689 = App$Kaelin$Effect$monad$((_m$bind$9 => _m$pure$10 => {
                                var $1690 = _m$pure$10;
                                return $1690;
                            }))(Unit$new);
                            return $1689;
                        }));
                        return $1687;
                    }));
                    return $1677;
                }));
                return $1675;
            }));
            return $1673;
        }));
        return $1671;
    };
    const App$Kaelin$Skill$revenge = x0 => App$Kaelin$Skill$revenge$(x0);
    const App$Kaelin$Heroes$Octoking$skills$revenge = App$Kaelin$Skill$new$("Revenge", 1, 4, App$Kaelin$Skill$revenge$(87), 87);

    function App$Kaelin$Skill$ground_slam$(_key$1, _dmg$2) {
        var $1691 = App$Kaelin$Effect$monad$((_m$bind$3 => _m$pure$4 => {
            var $1692 = _m$bind$3;
            return $1692;
        }))(App$Kaelin$Effect$coord$get_center)((_center$3 => {
            var _area$4 = App$Kaelin$Coord$range$(_center$3, 2);
            var $1693 = App$Kaelin$Effect$monad$((_m$bind$5 => _m$pure$6 => {
                var $1694 = _m$bind$5;
                return $1694;
            }))(App$Kaelin$Effect$ap$cost$(_key$1, _center$3))((_$5 => {
                var $1695 = App$Kaelin$Effect$monad$((_m$bind$6 => _m$pure$7 => {
                    var $1696 = _m$bind$6;
                    return $1696;
                }))(App$Kaelin$Effect$area(App$Kaelin$Effect$hp$damage$(_dmg$2))(_area$4))((_$6 => {
                    var $1697 = App$Kaelin$Effect$monad$((_m$bind$7 => _m$pure$8 => {
                        var $1698 = _m$pure$8;
                        return $1698;
                    }))(Unit$new);
                    return $1697;
                }));
                return $1695;
            }));
            return $1693;
        }));
        return $1691;
    };
    const App$Kaelin$Skill$ground_slam = x0 => x1 => App$Kaelin$Skill$ground_slam$(x0, x1);
    const App$Kaelin$Heroes$Octoking$skills$ground_slam = App$Kaelin$Skill$new$("Ground Slam", 0, 3, App$Kaelin$Skill$ground_slam$(69, 2), 69);
    const App$Kaelin$Heroes$Octoking$skills$ap_recover = App$Kaelin$Skill$new$("Action Points Reovery", 0, 0, App$Kaelin$Skill$ap_recover$(10), 82);
    const App$Kaelin$Heroes$Octoking$skills = List$cons$(App$Kaelin$Heroes$Octoking$skills$Empathy, List$cons$(App$Kaelin$Heroes$Octoking$skills$revenge, List$cons$(App$Kaelin$Heroes$Octoking$skills$ground_slam, List$cons$(App$Kaelin$Heroes$Octoking$skills$ap_recover, List$cons$(App$Kaelin$Skill$move$(2), List$nil)))));
    const App$Kaelin$Heroes$Octoking$hero = App$Kaelin$Hero$new$("Octoking", App$Kaelin$Assets$hero$octoking, 40, 10, App$Kaelin$Heroes$Octoking$skills);

    function App$Kaelin$Hero$info$(_id$1) {
        var self = (_id$1 === 0);
        if (self) {
            var $1700 = Maybe$some$(App$Kaelin$Heroes$Croni$hero);
            var $1699 = $1700;
        } else {
            var self = (_id$1 === 1);
            if (self) {
                var $1702 = Maybe$some$(App$Kaelin$Heroes$Cyclope$hero);
                var $1701 = $1702;
            } else {
                var self = (_id$1 === 2);
                if (self) {
                    var $1704 = Maybe$some$(App$Kaelin$Heroes$Lela$hero);
                    var $1703 = $1704;
                } else {
                    var self = (_id$1 === 3);
                    if (self) {
                        var $1706 = Maybe$some$(App$Kaelin$Heroes$Octoking$hero);
                        var $1705 = $1706;
                    } else {
                        var $1707 = Maybe$none;
                        var $1705 = $1707;
                    };
                    var $1703 = $1705;
                };
                var $1701 = $1703;
            };
            var $1699 = $1701;
        };
        return $1699;
    };
    const App$Kaelin$Hero$info = x0 => App$Kaelin$Hero$info$(x0);

    function App$KL$Game$Stage$Draft$draw$cards$ally$(_user$1, _info$2) {
        var self = _info$2;
        switch (self._) {
            case 'Maybe.some':
                var $1709 = self.value;
                var $1710 = Maybe$default$(Maybe$monad$((_m$bind$4 => _m$pure$5 => {
                    var $1711 = _m$bind$4;
                    return $1711;
                }))(Maybe$map$(Nat$to_u8, (() => {
                    var self = $1709;
                    switch (self._) {
                        case 'App.KL.Game.Player.new':
                            var $1712 = self.hero_id;
                            var $1713 = $1712;
                            return $1713;
                    };
                })()))((_info$4 => {
                    var $1714 = Maybe$monad$((_m$bind$5 => _m$pure$6 => {
                        var $1715 = _m$bind$5;
                        return $1715;
                    }))(App$Kaelin$Hero$info$(_info$4))((_hero$5 => {
                        var self = _hero$5;
                        switch (self._) {
                            case 'App.Kaelin.Hero.new':
                                var $1717 = self.assets;
                                var $1718 = $1717;
                                var _assets$6 = $1718;
                                break;
                        };
                        var $1716 = Maybe$monad$((_m$bind$7 => _m$pure$8 => {
                            var $1719 = _m$pure$8;
                            return $1719;
                        }))(Pair$new$((() => {
                            var self = _hero$5;
                            switch (self._) {
                                case 'App.Kaelin.Hero.new':
                                    var $1720 = self.name;
                                    var $1721 = $1720;
                                    return $1721;
                            };
                        })(), (() => {
                            var self = _assets$6;
                            switch (self._) {
                                case 'App.Kaelin.HeroAssets.new':
                                    var $1722 = self.base64;
                                    var $1723 = $1722;
                                    return $1723;
                            };
                        })()));
                        return $1716;
                    }));
                    return $1714;
                })), Pair$new$("Choosing", App$KL$Game$Stage$Draft$draw$cards$interrogation));
                var self = $1710;
                break;
            case 'Maybe.none':
                var $1724 = Pair$new$("Connecting", App$KL$Game$Stage$Draft$draw$cards$interrogation);
                var self = $1724;
                break;
        };
        switch (self._) {
            case 'Pair.new':
                var $1725 = self.fst;
                var $1726 = self.snd;
                var $1727 = App$KL$Game$Stage$Draft$draw$cards$card$($1725, $1726, "80%");
                var $1708 = $1727;
                break;
        };
        return $1708;
    };
    const App$KL$Game$Stage$Draft$draw$cards$ally = x0 => x1 => App$KL$Game$Stage$Draft$draw$cards$ally$(x0, x1);

    function App$KL$Game$Stage$Draft$draw$cards$allies$(_map$1, _team$2) {
        var _lst$3 = Map$to_list$(_map$1);
        var _teammates$4 = List$nil;
        var _teammates$5 = (() => {
            var $1730 = _teammates$4;
            var $1731 = _lst$3;
            let _teammates$6 = $1730;
            let _info$5;
            while ($1731._ === 'List.cons') {
                _info$5 = $1731.head;
                var self = _info$5;
                switch (self._) {
                    case 'Pair.new':
                        var $1732 = self.snd;
                        var self = App$KL$Game$Team$eql$(_team$2, (() => {
                            var self = $1732;
                            switch (self._) {
                                case 'App.KL.Game.Player.new':
                                    var $1734 = self.team;
                                    var $1735 = $1734;
                                    return $1735;
                            };
                        })());
                        if (self) {
                            var $1736 = List$cons$(_info$5, _teammates$6);
                            var $1733 = $1736;
                        } else {
                            var $1737 = _teammates$6;
                            var $1733 = $1737;
                        };
                        var $1730 = $1733;
                        break;
                };
                _teammates$6 = $1730;
                $1731 = $1731.tail;
            }
            return _teammates$6;
        })();
        var _count$6 = (2n - (list_length(_teammates$5)) <= 0n ? 0n : 2n - (list_length(_teammates$5)));
        var _dom$7 = List$nil;
        var _dom$8 = Nat$for$(_dom$7, 0n, _count$6, (_i$8 => _dom$9 => {
            var $1738 = List$cons$(App$KL$Game$Stage$Draft$draw$cards$ally$("none", Maybe$none), _dom$9);
            return $1738;
        }));
        var _dom$9 = (() => {
            var $1740 = _dom$8;
            var $1741 = _teammates$5;
            let _dom$10 = $1740;
            let _pair$9;
            while ($1741._ === 'List.cons') {
                _pair$9 = $1741.head;
                var $1740 = List$cons$(App$KL$Game$Stage$Draft$draw$cards$ally$((() => {
                    var self = _pair$9;
                    switch (self._) {
                        case 'Pair.new':
                            var $1742 = self.fst;
                            var $1743 = $1742;
                            return $1743;
                    };
                })(), Maybe$some$((() => {
                    var self = _pair$9;
                    switch (self._) {
                        case 'Pair.new':
                            var $1744 = self.snd;
                            var $1745 = $1744;
                            return $1745;
                    };
                })())), _dom$10);
                _dom$10 = $1740;
                $1741 = $1741.tail;
            }
            return _dom$10;
        })();
        var $1728 = _dom$9;
        return $1728;
    };
    const App$KL$Game$Stage$Draft$draw$cards$allies = x0 => x1 => App$KL$Game$Stage$Draft$draw$cards$allies$(x0, x1);

    function App$KL$Game$Stage$Draft$draw$cards$picks_right$(_map$1, _team$2) {
        var $1746 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("width", "60%"), List$cons$(Pair$new$("height", "100%"), List$cons$(Pair$new$("padding", "3%"), List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("flex-direction", "row"), List$cons$(Pair$new$("align-items", "center"), List$cons$(Pair$new$("box-sizing", "border-box"), List$nil)))))))), List$cons$(DOM$node$("div", Map$new, Map$set$("display", "contents", Map$new), List$fold$(App$KL$Game$Stage$Draft$draw$cards$allies$(_map$1, _team$2), List$nil, (_div$3 => _placeholder$4 => {
            var $1747 = List$cons$(_div$3, _placeholder$4);
            return $1747;
        }))), List$nil));
        return $1746;
    };
    const App$KL$Game$Stage$Draft$draw$cards$picks_right = x0 => x1 => App$KL$Game$Stage$Draft$draw$cards$picks_right$(x0, x1);

    function App$KL$Game$Stage$Draft$draw$cards$(_players$1, _user$2) {
        var _team$3 = Maybe$default$(App$KL$Game$Stage$Draft$to_team$(_players$1, _user$2), App$KL$Game$Team$neutral);
        var _player$4 = Map$get$(_user$2, _players$1);
        var _allies$5 = Map$delete$(_user$2, _players$1);
        var self = _player$4;
        switch (self._) {
            case 'Maybe.some':
                var $1749 = self.value;
                var _player$7 = $1749;
                var $1750 = Maybe$map$(Nat$to_u8, (() => {
                    var self = _player$7;
                    switch (self._) {
                        case 'App.KL.Game.Player.new':
                            var $1751 = self.hero_id;
                            var $1752 = $1751;
                            return $1752;
                    };
                })());
                var _hero$6 = $1750;
                break;
            case 'Maybe.none':
                var $1753 = Maybe$none;
                var _hero$6 = $1753;
                break;
        };
        var $1748 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("width", "70%"), List$cons$(Pair$new$("height", "100%"), List$cons$(Pair$new$("display", "flex"), List$nil)))), List$cons$(App$KL$Game$Stage$Draft$draw$cards$picks_left$(_hero$6), List$cons$(App$KL$Game$Stage$Draft$draw$cards$picks_right$(_allies$5, _team$3), List$nil)));
        return $1748;
    };
    const App$KL$Game$Stage$Draft$draw$cards = x0 => x1 => App$KL$Game$Stage$Draft$draw$cards$(x0, x1);

    function App$KL$Game$Stage$Draft$draw$top$(_players$1, _user$2) {
        var _team$3 = Maybe$default$(App$KL$Game$Stage$Draft$to_team$(_players$1, _user$2), App$KL$Game$Team$neutral);
        var self = _team$3;
        switch (self._) {
            case 'App.KL.Game.Team.blue':
                var $1755 = "linear-gradient(#3fbcf2, #3791d4)";
                var _color$4 = $1755;
                break;
            case 'App.KL.Game.Team.red':
                var $1756 = "linear-gradient(#ff6666, #ff4d4d)";
                var _color$4 = $1756;
                break;
            case 'App.KL.Game.Team.neutral':
                var $1757 = "linear-gradient(#94b8b8, #75a3a3)";
                var _color$4 = $1757;
                break;
        };
        var $1754 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("width", "100%"), List$cons$(Pair$new$("height", "60%"), List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("background-image", _color$4), List$cons$(Pair$new$("align-items", "center"), List$cons$(Pair$new$("justify-content", "center"), List$nil))))))), List$cons$(DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("width", "100%"), List$cons$(Pair$new$("max-width", "1440px"), List$cons$(Pair$new$("height", "100%"), List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("background-image", _color$4), List$cons$(Pair$new$("align-items", "center"), List$cons$(Pair$new$("justify-content", "center"), List$nil)))))))), List$cons$(App$KL$Game$Stage$Draft$draw$coordinates$(_players$1, _user$2), List$cons$(App$KL$Game$Stage$Draft$draw$cards$(_players$1, _user$2), List$nil))), List$nil));
        return $1754;
    };
    const App$KL$Game$Stage$Draft$draw$top = x0 => x1 => App$KL$Game$Stage$Draft$draw$top$(x0, x1);

    function App$KL$Game$Stage$Draft$draw$selection$(_hero$1) {
        var self = _hero$1;
        switch (self._) {
            case 'App.KL.Game.Hero.new':
                var $1759 = self.picture;
                var $1760 = $1759;
                var _image$2 = $1760;
                break;
        };
        var _image$2 = _image$2(Bool$true)(0n);
        var _box_style$3 = Map$from_list$(List$cons$(Pair$new$("margin", "4px"), List$cons$(Pair$new$("border", "5px solid #d6dadc"), List$cons$(Pair$new$("background-color", "#bac1c4"), List$cons$(Pair$new$("height", "auto"), List$cons$(Pair$new$("width", "15%"), List$cons$(Pair$new$("border-radius", "5px"), List$nil)))))));
        var _name_style$4 = Map$from_list$(List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("justify-content", "center"), List$cons$(Pair$new$("font-size", "1.2vw"), List$nil))));
        var _img_box_style$5 = Map$from_list$(List$cons$(Pair$new$("padding", "2px"), List$cons$(Pair$new$("height", "100%"), List$cons$(Pair$new$("width", "100%"), List$nil))));
        var _corner_style$6 = Map$from_list$(List$cons$(Pair$new$("width", "75%"), List$cons$(Pair$new$("margin-left", "12.5%"), List$cons$(Pair$new$("height", "auto"), List$cons$(Pair$new$("image-rendering", "pixelated"), List$nil)))));
        var _square_style$7 = Map$from_list$(List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("justify-content", "center"), List$cons$(Pair$new$("height", "100%"), List$cons$(Pair$new$("width", "100%"), List$nil)))));
        var $1758 = DOM$node$("div", Map$from_list$(List$cons$(Pair$new$("id", ("H" + (() => {
            var self = _hero$1;
            switch (self._) {
                case 'App.KL.Game.Hero.new':
                    var $1761 = self.name;
                    var $1762 = $1761;
                    return $1762;
            };
        })())), List$nil)), _box_style$3, List$cons$(DOM$node$("div", Map$from_list$(List$cons$(Pair$new$("id", ("H" + (() => {
            var self = _hero$1;
            switch (self._) {
                case 'App.KL.Game.Hero.new':
                    var $1763 = self.name;
                    var $1764 = $1763;
                    return $1764;
            };
        })())), List$nil)), _name_style$4, List$cons$(DOM$text$((() => {
            var self = _hero$1;
            switch (self._) {
                case 'App.KL.Game.Hero.new':
                    var $1765 = self.name;
                    var $1766 = $1765;
                    return $1766;
            };
        })()), List$nil)), List$cons$(DOM$node$("div", Map$from_list$(List$nil), _img_box_style$5, List$cons$(DOM$node$("img", Map$from_list$(List$cons$(Pair$new$("id", ("H" + (() => {
            var self = _hero$1;
            switch (self._) {
                case 'App.KL.Game.Hero.new':
                    var $1767 = self.name;
                    var $1768 = $1767;
                    return $1768;
            };
        })())), List$cons$(Pair$new$("src", _image$2), List$nil))), _corner_style$6, List$nil), List$nil)), List$nil)));
        return $1758;
    };
    const App$KL$Game$Stage$Draft$draw$selection = x0 => App$KL$Game$Stage$Draft$draw$selection$(x0);

    function App$KL$Game$Stage$Draft$draw$menu$(_players$1) {
        var _heroes$2 = App$KL$Game$Hero$list;
        var _main_style$3 = Map$from_list$(List$cons$(Pair$new$("width", "70%"), List$cons$(Pair$new$("height", "100%"), List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("justify-content", "center"), List$cons$(Pair$new$("align-items", "center"), List$nil))))));
        var _display_style$4 = Map$from_list$(List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("flex-wrap", "wrap"), List$cons$(Pair$new$("justify-content", "center"), List$cons$(Pair$new$("width", "100%"), List$nil)))));
        var _hero_list$5 = List$map$(App$KL$Game$Stage$Draft$draw$selection, _heroes$2);
        var $1769 = DOM$node$("div", Map$from_list$(List$nil), _main_style$3, List$cons$(DOM$node$("div", Map$from_list$(List$nil), _display_style$4, List$cons$(DOM$node$("div", Map$new, Map$set$("display", "contents", Map$new), List$fold$(_hero_list$5, List$nil, (_div$6 => _placeholder$7 => {
            var $1770 = List$cons$(_div$6, _placeholder$7);
            return $1770;
        }))), List$nil)), List$nil));
        return $1769;
    };
    const App$KL$Game$Stage$Draft$draw$menu = x0 => App$KL$Game$Stage$Draft$draw$menu$(x0);

    function App$KL$Game$Stage$Draft$draw$ready_button$(_players$1, _room$2, _user$3) {
        var _info$4 = Map$get$(_user$3, _players$1);
        var self = _info$4;
        switch (self._) {
            case 'Maybe.some':
                var $1772 = self.value;
                var _player$6 = $1772;
                var self = _player$6;
                switch (self._) {
                    case 'App.KL.Game.Player.new':
                        var $1774 = self.ready;
                        var $1775 = $1774;
                        var self = $1775;
                        break;
                };
                if (self) {
                    var $1776 = Pair$new$("gray", "Cancel");
                    var $1773 = $1776;
                } else {
                    var $1777 = Pair$new$("#4CAF50", "Ready");
                    var $1773 = $1777;
                };
                var self = $1773;
                break;
            case 'Maybe.none':
                var $1778 = Pair$new$("#4CAF50", "Ready");
                var self = $1778;
                break;
        };
        switch (self._) {
            case 'Pair.new':
                var $1779 = self.fst;
                var $1780 = self.snd;
                var $1781 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("width", "30%"), List$cons$(Pair$new$("height", "auto"), List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("justify-content", "center"), List$cons$(Pair$new$("align-items", "center"), List$cons$(Pair$new$("flex-direction", "column"), List$nil))))))), List$cons$(DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("background-color", "#d6dadc"), List$cons$(Pair$new$("color", "black"), List$cons$(Pair$new$("padding", "8px"), List$cons$(Pair$new$("text-align", "center"), List$cons$(Pair$new$("border-radius", "5px"), List$cons$(Pair$new$("margin-bottom", "10px"), List$cons$(Pair$new$("font-size", "32px"), List$nil)))))))), List$cons$(DOM$text$(_room$2), List$nil)), List$cons$(DOM$node$("button", Map$from_list$(List$cons$(Pair$new$("id", "Ready"), List$nil)), Map$from_list$(List$cons$(Pair$new$("background-color", $1779), List$cons$(Pair$new$("border", "none"), List$cons$(Pair$new$("color", "white"), List$cons$(Pair$new$("padding", "32px"), List$cons$(Pair$new$("text-align", "center"), List$cons$(Pair$new$("text-decoration", "none"), List$cons$(Pair$new$("display", "inline-block"), List$cons$(Pair$new$("font-size", "32px"), List$cons$(Pair$new$("margin", "4px 2px"), List$cons$(Pair$new$("cursor", "pointer"), List$nil))))))))))), List$cons$(DOM$text$($1780), List$nil)), List$nil)));
                var $1771 = $1781;
                break;
        };
        return $1771;
    };
    const App$KL$Game$Stage$Draft$draw$ready_button = x0 => x1 => x2 => App$KL$Game$Stage$Draft$draw$ready_button$(x0, x1, x2);

    function App$KL$Game$Stage$draft$draw$bottom$(_players$1, _room$2, _user$3) {
        var $1782 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("width", "100%"), List$cons$(Pair$new$("height", "40%"), List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("background-image", "linear-gradient(#0e0c0e, #242324)"), List$cons$(Pair$new$("justify-content", "center"), List$cons$(Pair$new$("align-items", "center"), List$nil))))))), List$cons$(DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("width", "100%"), List$cons$(Pair$new$("max-width", "1440px"), List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("justify-content", "center"), List$cons$(Pair$new$("align-items", "center"), List$nil)))))), List$cons$(App$KL$Game$Stage$Draft$draw$menu$(_players$1), List$cons$(App$KL$Game$Stage$Draft$draw$ready_button$(_players$1, _room$2, _user$3), List$nil))), List$nil));
        return $1782;
    };
    const App$KL$Game$Stage$draft$draw$bottom = x0 => x1 => x2 => App$KL$Game$Stage$draft$draw$bottom$(x0, x1, x2);

    function List$count$(_cond$2, _list$3) {
        var self = _list$3;
        switch (self._) {
            case 'List.cons':
                var $1784 = self.head;
                var $1785 = self.tail;
                var _tail_count$6 = List$count$(_cond$2, $1785);
                var self = _cond$2($1784);
                if (self) {
                    var $1787 = Nat$succ$(_tail_count$6);
                    var $1786 = $1787;
                } else {
                    var $1788 = _tail_count$6;
                    var $1786 = $1788;
                };
                var $1783 = $1786;
                break;
            case 'List.nil':
                var $1789 = 0n;
                var $1783 = $1789;
                break;
        };
        return $1783;
    };
    const List$count = x0 => x1 => List$count$(x0, x1);

    function App$KL$Game$Stage$Draft$Team$show$(_team$1) {
        var self = _team$1;
        switch (self._) {
            case 'App.KL.Game.Team.blue':
                var $1791 = "blue";
                var $1790 = $1791;
                break;
            case 'App.KL.Game.Team.red':
                var $1792 = "red";
                var $1790 = $1792;
                break;
            case 'App.KL.Game.Team.neutral':
                var $1793 = "neutral";
                var $1790 = $1793;
                break;
        };
        return $1790;
    };
    const App$KL$Game$Stage$Draft$Team$show = x0 => App$KL$Game$Stage$Draft$Team$show$(x0);

    function App$KL$Game$Stage$Draft$draw$choose_team$button$(_players$1, _team$2) {
        var _player_list$3 = Map$to_list$(_players$1);
        var _fun$4 = (_x$4 => {
            var self = _x$4;
            switch (self._) {
                case 'Pair.new':
                    var $1796 = self.snd;
                    var $1797 = $1796;
                    var self = $1797;
                    break;
            };
            switch (self._) {
                case 'App.KL.Game.Player.new':
                    var $1798 = self.team;
                    var $1799 = $1798;
                    var _y$5 = $1799;
                    break;
            };
            var $1795 = App$KL$Game$Team$eql$(_y$5, _team$2);
            return $1795;
        });
        var _player_count$5 = List$count$(_fun$4, _player_list$3);
        var _team_txt$6 = App$KL$Game$Stage$Draft$Team$show$(_team$2);
        var self = _team$2;
        switch (self._) {
            case 'App.KL.Game.Team.blue':
                var $1800 = "linear-gradient(#38a5fa, #2081e0)";
                var _gradient$7 = $1800;
                break;
            case 'App.KL.Game.Team.red':
                var $1801 = "linear-gradient(#ff3537, #d60f10)";
                var _gradient$7 = $1801;
                break;
            case 'App.KL.Game.Team.neutral':
                var $1802 = "linear-gradient(#f2f2f2, #e6e6e6)";
                var _gradient$7 = $1802;
                break;
        };
        var $1794 = DOM$node$("button", Map$from_list$(List$cons$(Pair$new$("id", ("T" + (Nat$show$(_player_count$5) + _team_txt$6))), List$nil)), Map$from_list$(List$cons$(Pair$new$("width", "40%"), List$cons$(Pair$new$("height", "100%"), List$cons$(Pair$new$("background-image", _gradient$7), List$cons$(Pair$new$("box-shadow", "2px -2px 2px black"), List$cons$(Pair$new$("font-size", "2rem"), List$nil)))))), List$cons$(DOM$text$((Nat$show$(_player_count$5) + "/3 Players")), List$nil));
        return $1794;
    };
    const App$KL$Game$Stage$Draft$draw$choose_team$button = x0 => x1 => App$KL$Game$Stage$Draft$draw$choose_team$button$(x0, x1);

    function App$KL$Game$Stage$Draft$draw$choose_team$(_players$1) {
        var $1803 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("width", "60%"), List$cons$(Pair$new$("height", "30%"), List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("flex-direction", "row"), List$cons$(Pair$new$("justify-content", "space-between"), List$nil)))))), List$cons$(App$KL$Game$Stage$Draft$draw$choose_team$button$(_players$1, App$KL$Game$Team$blue), List$cons$(App$KL$Game$Stage$Draft$draw$choose_team$button$(_players$1, App$KL$Game$Team$red), List$nil)));
        return $1803;
    };
    const App$KL$Game$Stage$Draft$draw$choose_team = x0 => App$KL$Game$Stage$Draft$draw$choose_team$(x0);

    function App$KL$Game$Stage$Draft$draw$main$(_players$1, _room$2, _user$3) {
        var _player$4 = Map$get$(_user$3, _players$1);
        var _normal$5 = List$cons$(App$KL$Game$Stage$Draft$draw$top$(_players$1, _user$3), List$cons$(App$KL$Game$Stage$draft$draw$bottom$(_players$1, _room$2, _user$3), List$nil));
        var _select$6 = List$cons$(App$KL$Game$Stage$Draft$draw$choose_team$(_players$1), List$nil);
        var self = _player$4;
        switch (self._) {
            case 'Maybe.some':
                var $1805 = self.value;
                var self = $1805;
                switch (self._) {
                    case 'App.KL.Game.Player.new':
                        var $1807 = self.team;
                        var $1808 = $1807;
                        var _team$8 = $1808;
                        break;
                };
                var self = _team$8;
                switch (self._) {
                    case 'App.KL.Game.Team.blue':
                    case 'App.KL.Game.Team.red':
                        var $1809 = _normal$5;
                        var $1806 = $1809;
                        break;
                    case 'App.KL.Game.Team.neutral':
                        var $1810 = _select$6;
                        var $1806 = $1810;
                        break;
                };
                var _draw$7 = $1806;
                break;
            case 'Maybe.none':
                var $1811 = List$cons$(DOM$node$("div", Map$from_list$(List$nil), Map$new, List$cons$(DOM$text$("no player"), List$nil)), List$nil);
                var _draw$7 = $1811;
                break;
        };
        var $1804 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("width", "100vw"), List$cons$(Pair$new$("height", "100vh"), List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("flex-direction", "column"), List$cons$(Pair$new$("justify-content", "center"), List$cons$(Pair$new$("align-items", "center"), List$cons$(Pair$new$("font-size", "2rem"), List$nil)))))))), List$cons$(DOM$node$("div", Map$new, Map$set$("display", "contents", Map$new), List$fold$(_draw$7, List$nil, (_div$8 => _placeholder$9 => {
            var $1812 = List$cons$(_div$8, _placeholder$9);
            return $1812;
        }))), List$nil));
        return $1804;
    };
    const App$KL$Game$Stage$Draft$draw$main = x0 => x1 => x2 => App$KL$Game$Stage$Draft$draw$main$(x0, x1, x2);

    function Map$(_V$1) {
        var $1813 = null;
        return $1813;
    };
    const Map = x0 => Map$(x0);

    function App$KL$Game$Stage$Draft$draw$(_local$1, _global$2) {
        var self = _global$2;
        switch (self._) {
            case 'App.KL.Global.State.new':
                var $1815 = self.game;
                var self = $1815;
                switch (self._) {
                    case 'Maybe.some':
                        var $1817 = self.value;
                        var $1818 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("width", "100vw"), List$cons$(Pair$new$("height", "100vh"), List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("justify-content", "center"), List$cons$(Pair$new$("align-items", "center"), List$nil)))))), List$cons$(App$KL$Game$Stage$Draft$draw$main$((() => {
                            var self = $1817;
                            switch (self._) {
                                case 'App.KL.Game.new':
                                    var $1819 = self.players;
                                    var $1820 = $1819;
                                    return $1820;
                            };
                        })(), (() => {
                            var self = _local$1;
                            switch (self._) {
                                case 'App.KL.Game.State.Local.new':
                                    var $1821 = self.room;
                                    var $1822 = $1821;
                                    return $1822;
                            };
                        })(), (() => {
                            var self = _local$1;
                            switch (self._) {
                                case 'App.KL.Game.State.Local.new':
                                    var $1823 = self.user;
                                    var $1824 = $1823;
                                    return $1824;
                            };
                        })()), List$nil));
                        var $1816 = $1818;
                        break;
                    case 'Maybe.none':
                        var $1825 = DOM$node$("div", Map$from_list$(List$nil), Map$new, List$cons$(DOM$text$("no game"), List$nil));
                        var $1816 = $1825;
                        break;
                };
                var $1814 = $1816;
                break;
        };
        return $1814;
    };
    const App$KL$Game$Stage$Draft$draw = x0 => x1 => App$KL$Game$Stage$Draft$draw$(x0, x1);

    function I32$to_U32$(_n$1) {
        var $1826 = (((_n$1) >>> 0));
        return $1826;
    };
    const I32$to_U32 = x0 => I32$to_U32$(x0);

    function I32$to_nat$(_a$1) {
        var $1827 = (BigInt(I32$to_U32$(_a$1)));
        return $1827;
    };
    const I32$to_nat = x0 => I32$to_nat$(x0);
    const App$KL$Constants$center_x = 228;
    const App$KL$Constants$center_y = 176;

    function DOM$vbox$(_props$1, _style$2, _value$3) {
        var $1828 = ({
            _: 'DOM.vbox',
            'props': _props$1,
            'style': _style$2,
            'value': _value$3
        });
        return $1828;
    };
    const DOM$vbox = x0 => x1 => x2 => DOM$vbox$(x0, x1, x2);

    function Hexagonal$Axial$BBL$to_list$(_map$2) {
        var $1829 = BBL$to_list$(_map$2);
        return $1829;
    };
    const Hexagonal$Axial$BBL$to_list = x0 => Hexagonal$Axial$BBL$to_list$(x0);
    const F64$sub = a0 => a1 => (a0 - a1);

    function Hexagonal$Axial$aux$floor$(_n$1) {
        var $1830 = (((_n$1 >> 0)));
        return $1830;
    };
    const Hexagonal$Axial$aux$floor = x0 => Hexagonal$Axial$aux$floor$(x0);

    function Hexagonal$Axial$aux$round_F64$(_n$1) {
        var _half$2 = (0.5);
        var _big_number$3 = (1000.0);
        var _n$4 = (_n$1 + _big_number$3);
        var _result$5 = Hexagonal$Axial$aux$floor$((_n$4 + _half$2));
        var $1831 = (_result$5 - _big_number$3);
        return $1831;
    };
    const Hexagonal$Axial$aux$round_F64 = x0 => Hexagonal$Axial$aux$round_F64$(x0);

    function F64$gtn$(_a$1, _b$2) {
        var self = _a$1;
        switch ('f64') {
            case 'f64':
                var $1833 = f64_to_word(self);
                var self = _b$2;
                switch ('f64') {
                    case 'f64':
                        var $1835 = f64_to_word(self);
                        var $1836 = Word$s_gtn$($1833, $1835);
                        var $1834 = $1836;
                        break;
                };
                var $1832 = $1834;
                break;
        };
        return $1832;
    };
    const F64$gtn = x0 => x1 => F64$gtn$(x0, x1);

    function Hexagonal$Axial$aux$abs_diff$(_x$1, _y$2) {
        var self = F64$gtn$(_x$1, _y$2);
        if (self) {
            var $1838 = (_x$1 - _y$2);
            var $1837 = $1838;
        } else {
            var $1839 = (_y$2 - _x$1);
            var $1837 = $1839;
        };
        return $1837;
    };
    const Hexagonal$Axial$aux$abs_diff = x0 => x1 => Hexagonal$Axial$aux$abs_diff$(x0, x1);

    function Hexagonal$Axial$round$(_axial_x$1, _axial_y$2) {
        var _i$3 = F64$to_i32;
        var _axial_z$4 = (((0.0) - _axial_x$1) - _axial_y$2);
        var _round_x$5 = Hexagonal$Axial$aux$round_F64$(_axial_x$1);
        var _round_y$6 = Hexagonal$Axial$aux$round_F64$(_axial_y$2);
        var _round_z$7 = Hexagonal$Axial$aux$round_F64$(_axial_z$4);
        var _diff_x$8 = Hexagonal$Axial$aux$abs_diff$(_axial_x$1, _round_x$5);
        var _diff_y$9 = Hexagonal$Axial$aux$abs_diff$(_axial_y$2, _round_y$6);
        var _diff_z$10 = Hexagonal$Axial$aux$abs_diff$(_axial_z$4, _round_z$7);
        var self = F64$gtn$(_diff_x$8, _diff_z$10);
        if (self) {
            var self = F64$gtn$(_diff_y$9, _diff_x$8);
            if (self) {
                var _new_y$11 = (((0.0) - _round_x$5) - _round_z$7);
                var $1842 = Hexagonal$Axial$new$(_i$3(_round_x$5), _i$3(_new_y$11));
                var $1841 = $1842;
            } else {
                var _new_x$11 = (((0.0) - _round_y$6) - _round_z$7);
                var $1843 = Hexagonal$Axial$new$(_i$3(_new_x$11), _i$3(_round_y$6));
                var $1841 = $1843;
            };
            var $1840 = $1841;
        } else {
            var self = F64$gtn$(_diff_y$9, _diff_z$10);
            if (self) {
                var _new_y$11 = (((0.0) - _round_x$5) - _round_z$7);
                var $1845 = Hexagonal$Axial$new$(_i$3(_round_x$5), _i$3(_new_y$11));
                var $1844 = $1845;
            } else {
                var $1846 = Hexagonal$Axial$new$(_i$3(_round_x$5), _i$3(_round_y$6));
                var $1844 = $1846;
            };
            var $1840 = $1844;
        };
        return $1840;
    };
    const Hexagonal$Axial$round = x0 => x1 => Hexagonal$Axial$round$(x0, x1);

    function Hexagonal$Axial$from_screen_xy$(_coord$1, _radius$2, _center_x$3, _center_y$4) {
        var self = _coord$1;
        switch (self._) {
            case 'Pair.new':
                var $1848 = self.fst;
                var $1849 = self.snd;
                var _f$7 = I32$to_f64;
                var _i$8 = U32$to_f64;
                var _float_hex_rad$9 = (_f$7(_radius$2) / (Number(2n)));
                var _float_x$10 = ((_i$8($1848) - _f$7(_center_x$3)) / _float_hex_rad$9);
                var _float_y$11 = ((_i$8($1849) - _f$7(_center_y$4)) / _float_hex_rad$9);
                var _fourth$12 = (0.25);
                var _sixth$13 = ((Number(1n)) / (Number(6n)));
                var _third$14 = ((Number(1n)) / (Number(3n)));
                var _half$15 = (0.5);
                var _axial_x$16 = ((_float_x$10 * _fourth$12) - (_float_y$11 * _sixth$13));
                var _axial_y$17 = (_float_y$11 * _third$14);
                var $1850 = Hexagonal$Axial$round$(_axial_x$16, _axial_y$17);
                var $1847 = $1850;
                break;
        };
        return $1847;
    };
    const Hexagonal$Axial$from_screen_xy = x0 => x1 => x2 => x3 => Hexagonal$Axial$from_screen_xy$(x0, x1, x2, x3);
    const App$KL$Constants$hexagon_radius = 15;
    const App$KL$Game$Indicator$background = ({
        _: 'App.KL.Game.Indicator.background'
    });

    function I32$cmp$(_a$1, _b$2) {
        var self = (_a$1 < _b$2);
        if (self) {
            var $1852 = Cmp$ltn;
            var $1851 = $1852;
        } else {
            var self = (_a$1 === _b$2);
            if (self) {
                var $1854 = Cmp$eql;
                var $1853 = $1854;
            } else {
                var $1855 = Cmp$gtn;
                var $1853 = $1855;
            };
            var $1851 = $1853;
        };
        return $1851;
    };
    const I32$cmp = x0 => x1 => I32$cmp$(x0, x1);

    function Hexagonal$Axial$cmp$(_x$1, _y$2) {
        var _c$3 = I32$cmp$((() => {
            var self = _x$1;
            switch (self._) {
                case 'Hexagonal.Axial.new':
                    var $1857 = self.i;
                    var $1858 = $1857;
                    return $1858;
            };
        })(), (() => {
            var self = _y$2;
            switch (self._) {
                case 'Hexagonal.Axial.new':
                    var $1859 = self.i;
                    var $1860 = $1859;
                    return $1860;
            };
        })());
        var self = _c$3;
        switch (self._) {
            case 'Cmp.ltn':
            case 'Cmp.gtn':
                var $1861 = _c$3;
                var $1856 = $1861;
                break;
            case 'Cmp.eql':
                var $1862 = I32$cmp$((() => {
                    var self = _x$1;
                    switch (self._) {
                        case 'Hexagonal.Axial.new':
                            var $1863 = self.j;
                            var $1864 = $1863;
                            return $1864;
                    };
                })(), (() => {
                    var self = _y$2;
                    switch (self._) {
                        case 'Hexagonal.Axial.new':
                            var $1865 = self.j;
                            var $1866 = $1865;
                            return $1866;
                    };
                })());
                var $1856 = $1862;
                break;
        };
        return $1856;
    };
    const Hexagonal$Axial$cmp = x0 => x1 => Hexagonal$Axial$cmp$(x0, x1);

    function Hexagonal$Axial$BBL$get$(_key$2, _map$3) {
        var $1867 = BBL$lookup$(Hexagonal$Axial$cmp, _key$2, _map$3);
        return $1867;
    };
    const Hexagonal$Axial$BBL$get = x0 => x1 => Hexagonal$Axial$BBL$get$(x0, x1);

    function App$KL$Game$Stage$Board$draw$get_indicator$(_tile_coord$1, _mouse_coord$2, _casts$3) {
        var _indicator$4 = App$KL$Game$Indicator$background;
        var self = _casts$3;
        switch (self._) {
            case 'Maybe.some':
                var $1869 = self.value;
                var self = $1869;
                switch (self._) {
                    case 'App.KL.Game.Casts.new':
                        var $1871 = self.areas;
                        var self = $1871;
                        switch (self._) {
                            case 'Maybe.some':
                                var $1873 = self.value;
                                var self = Hexagonal$Axial$BBL$get$(_tile_coord$1, $1873);
                                switch (self._) {
                                    case 'Maybe.some':
                                        var $1875 = self.value;
                                        var $1876 = $1875;
                                        var $1874 = $1876;
                                        break;
                                    case 'Maybe.none':
                                        var $1877 = _indicator$4;
                                        var $1874 = $1877;
                                        break;
                                };
                                var $1872 = $1874;
                                break;
                            case 'Maybe.none':
                                var $1878 = _indicator$4;
                                var $1872 = $1878;
                                break;
                        };
                        var $1870 = $1872;
                        break;
                };
                var $1868 = $1870;
                break;
            case 'Maybe.none':
                var $1879 = _indicator$4;
                var $1868 = $1879;
                break;
        };
        return $1868;
    };
    const App$KL$Game$Stage$Board$draw$get_indicator = x0 => x1 => x2 => App$KL$Game$Stage$Board$draw$get_indicator$(x0, x1, x2);

    function Hexagonal$Axial$to_screen_xy$(_coord$1, _radius$2, _center_x$3, _center_y$4) {
        var self = _coord$1;
        switch (self._) {
            case 'Hexagonal.Axial.new':
                var $1881 = self.i;
                var $1882 = self.j;
                var _i$7 = $1881;
                var _j$8 = $1882;
                var _i$9 = (_i$7);
                var _j$10 = (_j$8);
                var _int_rad$11 = (_radius$2);
                var _hlf$12 = (_int_rad$11 / (+2.0));
                var _int_screen_center_x$13 = (_center_x$3);
                var _int_screen_center_y$14 = (_center_y$4);
                var _cx$15 = (_int_screen_center_x$13 + (_j$10 * _int_rad$11));
                var _cx$16 = (_cx$15 + (_i$9 * (_int_rad$11 * (Number(2n)))));
                var _cy$17 = (_int_screen_center_y$14 + (_j$10 * (_hlf$12 * (Number(3n)))));
                var _cx$18 = ((_cx$16 >>> 0));
                var _y$19 = (_cy$17 + (0.5));
                var _cy$20 = ((_cy$17 >>> 0));
                var $1883 = Pair$new$(_cx$18, _cy$20);
                var $1880 = $1883;
                break;
        };
        return $1880;
    };
    const Hexagonal$Axial$to_screen_xy = x0 => x1 => x2 => x3 => Hexagonal$Axial$to_screen_xy$(x0, x1, x2, x3);

    function App$KL$Game$Stage$Board$draw$centralize$(_coord$1) {
        var self = Hexagonal$Axial$to_screen_xy$(_coord$1, App$KL$Constants$hexagon_radius, App$KL$Constants$center_x, App$KL$Constants$center_y);
        switch (self._) {
            case 'Pair.new':
                var $1885 = self.fst;
                var $1886 = self.snd;
                var _aux$4 = I32$to_u32$(App$KL$Constants$hexagon_radius);
                var _i$5 = (($1885 - _aux$4) >>> 0);
                var _j$6 = (($1886 - _aux$4) >>> 0);
                var $1887 = Pair$new$(_i$5, _j$6);
                var $1884 = $1887;
                break;
        };
        return $1884;
    };
    const App$KL$Game$Stage$Board$draw$centralize = x0 => App$KL$Game$Stage$Board$draw$centralize$(x0);
    const App$Kaelin$Assets$tile$green_1 = VoxBox$parse$("0e0101408d640f0101408d64100101469e650c0201469e650d0201469e650e0201469e650f0201408d64100201469e65110201469e65120201408d640a0301469e650b0301408d640c0301469e650d0301469e650e0301469e650f0301408d64100301408d64110301408d64120301408d64130301469e65140301469e65080401469e65090401469e650a0401469e650b0401408d640c0401408d640d0401469e650e0401469e650f0401408d64100401469e65110401408d64120401408d64130401408d64140401408d64150401408d64160401408d64060501469e65070501408d64080501469e65090501469e650a0501408d640b0501408d640c0501408d640d0501347e570e0501347e570f0501469e65100501469e65110501469e65120501347e57130501408d64140501469e65150501469e65160501408d64170501469e65180501469e65040601347e57050601469e65060601469e65070601408d64080601408d64090601347e570a0601408d640b0601408d640c0601408d640d0601408d640e0601347e570f0601469e65100601469e65110601408d64120601347e57130601347e57140601469e65150601469e65160601408d64170601408d64180601347e57190601408d641a0601408d64020701408d64030701408d64040701408d64050701408d64060701408d64070701408d64080701408d64090701347e570a0701347e570b0701408d640c0701469e650d0701469e650e0701408d640f0701408d64100701408d64110701408d64120701408d64130701408d64140701408d64150701408d64160701408d64170701408d64180701347e57190701347e571a0701408d641b0701469e651c0701469e65010801408d64020801469e65030801469e65040801408d64050801469e65060801469e65070801469e65080801408d64090801469e650a0801469e650b0801408d640c0801408d640d0801469e650e0801469e650f0801347e57100801408d64110801469e65120801469e65130801408d64140801469e65150801469e65160801469e65170801408d64180801469e65190801469e651a0801408d641b0801408d641c0801469e651d0801469e65010901408d64020901408d64030901408d64040901408d64050901469e65060901469e65070901408d64080901408d64090901408d640a0901408d640b0901408d640c0901408d640d0901408d640e0901408d640f0901408d64100901408d64110901408d64120901408d64130901408d64140901469e65150901469e65160901408d64170901408d64180901408d64190901408d641a0901408d641b0901408d641c0901408d641d0901408d64010a01408d64020a01408d64030a01408d64040a01408d64050a01408d64060a01408d64070a01469e65080a01469e65090a01408d640a0a01347e570b0a01347e570c0a01408d640d0a01408d640e0a01408d640f0a01469e65100a01408d64110a01408d64120a01408d64130a01408d64140a01408d64150a01408d64160a01469e65170a01469e65180a01408d64190a01347e571a0a01347e571b0a01408d641c0a01408d641d0a01408d64010b01408d64020b01408d64030b01469e65040b01469e65050b01408d64060b01469e65070b01469e65080b01469e65090b01408d640a0b01347e570b0b01408d640c0b01469e650d0b01469e650e0b01408d640f0b01469e65100b01408d64110b01408d64120b01469e65130b01469e65140b01408d64150b01469e65160b01469e65170b01469e65180b01408d64190b01347e571a0b01408d641b0b01469e651c0b01469e651d0b01408d64010c01408d64020c01469e65030c01469e65040c01469e65050c01408d64060c01469e65070c01469e65080c01408d64090c01408d640a0c01408d640b0c01408d640c0c01469e650d0c01469e650e0c01469e650f0c01408d64100c01408d64110c01469e65120c01469e65130c01469e65140c01408d64150c01469e65160c01469e65170c01408d64180c01408d64190c01408d641a0c01408d641b0c01469e651c0c01469e651d0c01469e65010d01408d64020d01469e65030d01469e65040d01408d64050d01408d64060d01408d64070d01408d64080d01408d64090d01408d640a0d01408d640b0d01408d640c0d01408d640d0d01469e650e0d01469e650f0d01408d64100d01408d64110d01469e65120d01469e65130d01408d64140d01408d64150d01408d64160d01408d64170d01408d64180d01408d64190d01408d641a0d01408d641b0d01408d641c0d01469e651d0d01469e65010e01408d64020e01469e65030e01469e65040e01408d64050e01347e57060e01408d64070e01469e65080e01469e65090e01469e650a0e01408d640b0e01469e650c0e01469e650d0e01408d640e0e01408d640f0e01469e65100e01408d64110e01469e65120e01469e65130e01408d64140e01347e57150e01408d64160e01469e65170e01469e65180e01469e65190e01408d641a0e01469e651b0e01469e651c0e01408d641d0e01408d64010f01469e65020f01469e65030f01469e65040f01408d64050f01408d64060f01408d64070f01469e65080f01469e65090f01408d640a0f01408d640b0f01408d640c0f01408d640d0f01408d640e0f01408d640f0f01408d64100f01469e65110f01469e65120f01469e65130f01408d64140f01408d64150f01408d64160f01469e65170f01469e65180f01408d64190f01408d641a0f01408d641b0f01408d641c0f01408d641d0f01408d64011001469e65021001469e65031001408d64041001469e65051001469e65061001408d64071001408d64081001408d64091001408d640a1001408d640b1001408d640c1001469e650d1001469e650e1001469e650f1001408d64101001469e65111001469e65121001408d64131001469e65141001469e65151001408d64161001408d64171001408d64181001408d64191001408d641a1001408d641b1001469e651c1001469e651d1001469e65011101408d64021101408d64031101408d64041101469e65051101469e65061101408d64071101408d64081101408d64091101469e650a1101469e650b1101408d640c1101469e650d1101469e650e1101469e650f1101408d64101101408d64111101408d64121101408d64131101469e65141101469e65151101408d64161101408d64171101408d64181101469e65191101469e651a1101408d641b1101469e651c1101469e651d1101469e65011201469e65021201408d64031201408d64041201408d64051201408d64061201408d64071201408d64081201469e65091201469e650a1201469e650b1201408d640c1201408d640d1201469e650e1201469e650f1201408d64101201469e65111201408d64121201408d64131201408d64141201408d64151201408d64161201408d64171201469e65181201469e65191201469e651a1201408d641b1201408d641c1201469e651d1201469e65011301469e65021301469e65031301347e57041301408d64051301469e65061301469e65071301408d64081301469e65091301469e650a1301408d640b1301408d640c1301408d640d1301347e570e1301347e570f1301469e65101301469e65111301469e65121301347e57131301408d64141301469e65151301469e65161301408d64171301469e65181301469e65191301408d641a1301408d641b1301408d641c1301347e571d1301347e57011401469e65021401408d64031401347e57041401347e57051401469e65061401469e65071401408d64081401408d64091401347e570a1401408d640b1401408d640c1401408d640d1401408d640e1401347e570f1401469e65101401469e65111401408d64121401347e57131401347e57141401469e65151401469e65161401408d64171401408d64181401347e57191401408d641a1401408d641b1401408d641c1401408d641d1401347e57021501408d64031501408d64041501408d64051501408d64061501408d64071501408d64081501408d64091501347e570a1501347e570b1501408d640c1501469e650d1501469e650e1501408d640f1501408d64101501408d64111501408d64121501408d64131501408d64141501408d64151501408d64161501408d64171501408d64181501347e57191501347e571a1501408d641b1501469e651c1501469e65041601408d64051601408d64061601469e65071601469e65081601408d64091601469e650a1601469e650b1601408d640c1601469e650d1601469e650e1601469e650f1601347e57101601347e57111601469e65121601469e65131601408d64141601408d64151601469e65161601469e65171601408d64181601469e65191601469e651a1601408d64061701469e65071701469e65081701408d64091701469e650a1701469e650b1701408d640c1701408d640d1701469e650e1701469e650f1701347e57101701408d64111701469e65121701469e65131701408d64141701469e65151701469e65161701469e65171701408d64181701469e65081801408d64091801408d640a1801408d640b1801408d640c1801408d640d1801408d640e1801408d640f1801408d64101801408d64111801408d64121801408d64131801408d64141801469e65151801469e65161801408d640a1901347e570b1901347e570c1901408d640d1901408d640e1901408d640f1901469e65101901408d64111901408d64121901408d64131901408d64141901408d640c1a01469e650d1a01469e650e1a01408d640f1a01469e65101a01408d64111a01408d64121a01469e650e1b01469e650f1b01408d64101b01408d64");
    const App$Kaelin$Assets$tile$effect$light_red2 = VoxBox$parse$("0e0001652b270f0001652b27100001652b270c0101652b270d0101652b270e010199615b0f010199615b100101a46e65110101652b27120101652b270a0201652b270b0201652b270c0201a46e650d0201a46e650e0201a46e650f020199615b100201a46e65110201a46e6512020199615b130201652b27140201652b27080301652b27090301652b270a0301a46e650b030199615b0c0301a46e650d0301a46e650e0301a46e650f030199615b10030199615b11030199615b12030199615b130301a46e65140301a46e65150301652b27160301652b27060401652b27070401652b27080401a46e65090401a46e650a0401a46e650b040199615b0c040199615b0d0401a46e650e0401a46e650f040199615b100401a46e6511040199615b12040199615b13040199615b14040199615b15040199615b16040199615b170401652b27180401652b27040501652b27050501652b27060501a46e6507050199615b080501a46e65090501a46e650a050199615b0b050199615b0c050199615b0d05018b534d0e05018b534d0f0501a46e65100501a46e65110501a46e651205018b534d13050199615b140501a46e65150501a46e6516050199615b170501a46e65180501a46e65190501652b271a0501652b27020601652b27030601652b270406018b534d050601a46e65060601a46e6507060199615b08060199615b0906018b534d0a060199615b0b060199615b0c060199615b0d060199615b0e06018b534d0f0601a46e65100601a46e6511060199615b1206018b534d1306018b534d140601a46e65150601a46e6516060199615b17060199615b1806018b534d19060199615b1a060199615b1b0601652b271c0601652b27000701652b27010701652b2702070199615b03070199615b04070199615b050701a46e65060701a46e65070701a46e6508070199615b0907018b534d0a07018b534d0b070199615b0c0701a46e650d0701a46e650e070199615b0f070199615b10070199615b11070199615b12070199615b13070199615b14070199615b15070199615b16070199615b17070199615b1807018b534d1907018b534d1a070199615b1b0701a46e651c0701a46e651d0701652b271e0701652b27000801652b2701080199615b020801a46e65030801a46e6504080199615b050801a46e65060801a46e65070801a46e6508080199615b090801a46e650a0801a46e650b080199615b0c080199615b0d0801a46e650e0801a46e650f08018b534d10080199615b110801a46e65120801a46e6513080199615b140801a46e65150801a46e65160801a46e6517080199615b18080199615b19080199615b1a080199615b1b080199615b1c0801a46e651d0801a46e651e0801652b27000901652b2701090199615b02090199615b030901a46e6504090199615b05090199615b060901a46e6507090199615b08090199615b090901a46e650a0901a46e650b090199615b0c090199615b0d0901a46e650e0901a46e650f090199615b10090199615b110901a46e65120901a46e6513090199615b14090199615b150901a46e65160901a46e6517090199615b18090199615b190901a46e651a0901a46e651b090199615b1c090199615b1d090199615b1e0901652b27000a01652b27010a0199615b020a0199615b030a018b534d040a018b534d050a0199615b060a0199615b070a0199615b080a0199615b090a0199615b0a0a01a46e650b0a01a46e650c0a0199615b0d0a0199615b0e0a0199615b0f0a0199615b100a0199615b110a0199615b120a0199615b130a0199615b140a018b534d150a0199615b160a0199615b170a0199615b180a0199615b190a01a46e651a0a01a46e651b0a01a46e651c0a0199615b1d0a0199615b1e0a01652b27000b01652b27010b0199615b020b01a46e65030b0199615b040b0199615b050b01a46e65060b01a46e65070b0199615b080b0199615b090b0199615b0a0b0199615b0b0b0199615b0c0b0199615b0d0b01a46e650e0b0199615b0f0b0199615b100b0199615b110b01a46e65120b0199615b130b0199615b140b018b534d150b01a46e65160b0199615b170b0199615b180b0199615b190b0199615b1a0b0199615b1b0b0199615b1c0b0199615b1d0b0199615b1e0b01652b27000c01652b27010c0199615b020c01a46e65030c0199615b040c0199615b050c0199615b060c0199615b070c01a46e65080c01a46e65090c0199615b0a0c018b534d0b0c018b534d0c0c0199615b0d0c01a46e650e0c0199615b0f0c01a46e65100c0199615b110c0199615b120c0199615b130c0199615b140c0199615b150c0199615b160c01a46e65170c01a46e65180c0199615b190c018b534d1a0c018b534d1b0c0199615b1c0c0199615b1d0c0199615b1e0c01652b27000d01652b27010d0199615b020d0199615b030d01a46e65040d01a46e65050d0199615b060d01a46e65070d01a46e65080d01a46e65090d0199615b0a0d018b534d0b0d0199615b0c0d01a46e650d0d01a46e650e0d0199615b0f0d01a46e65100d0199615b110d0199615b120d01a46e65130d01a46e65140d0199615b150d01a46e65160d01a46e65170d01a46e65180d0199615b190d018b534d1a0d0199615b1b0d01a46e651c0d01a46e651d0d0199615b1e0d01652b27000e01652b27010e0199615b020e01a46e65030e01a46e65040e01a46e65050e0199615b060e01a46e65070e01a46e65080e0199615b090e0199615b0a0e0199615b0b0e0199615b0c0e01a46e650d0e01a46e650e0e01a46e650f0e018b534d100e0199615b110e01a46e65120e01a46e65130e01a46e65140e0199615b150e01a46e65160e01a46e65170e0199615b180e0199615b190e0199615b1a0e0199615b1b0e01a46e651c0e01a46e651d0e01a46e651e0e01652b27000f01652b27010f0199615b020f01a46e65030f01a46e65040f0199615b050f0199615b060f0199615b070f0199615b080f0199615b090f0199615b0a0f0199615b0b0f0199615b0c0f0199615b0d0f01a46e650e0f01a46e650f0f018b534d100f018b534d110f01a46e65120f01a46e65130f0199615b140f0199615b150f0199615b160f0199615b170f0199615b180f0199615b190f0199615b1a0f0199615b1b0f0199615b1c0f01a46e651d0f01a46e651e0f01652b27001001652b2701100199615b021001a46e65031001a46e6504100199615b0510018b534d06100199615b071001a46e65081001a46e65091001a46e650a100199615b0b1001a46e650c1001a46e650d100199615b0e100199615b0f1001a46e6510100199615b111001a46e65121001a46e6513100199615b1410018b534d15100199615b161001a46e65171001a46e65181001a46e6519100199615b1a1001a46e651b1001a46e651c100199615b1d100199615b1e1001652b27001101652b27011101a46e65021101a46e65031101a46e6504110199615b05110199615b06110199615b071101a46e65081101a46e6509110199615b0a110199615b0b110199615b0c110199615b0d110199615b0e110199615b0f110199615b101101a46e65111101a46e65121101a46e6513110199615b14110199615b15110199615b161101a46e65171101a46e6518110199615b19110199615b1a110199615b1b110199615b1c110199615b1d110199615b1e1101652b27001201652b27011201a46e65021201a46e6503120199615b041201a46e65051201a46e6506120199615b07120199615b08120199615b09120199615b0a120199615b0b120199615b0c1201a46e650d1201a46e650e1201a46e650f120199615b101201a46e65111201a46e6512120199615b131201a46e65141201a46e6515120199615b16120199615b17120199615b18120199615b19120199615b1a120199615b1b1201a46e651c1201a46e651d1201a46e651e1201652b27001301652b2701130199615b02130199615b03130199615b041301a46e65051301a46e6506130199615b07130199615b08130199615b091301a46e650a1301a46e650b130199615b0c1301a46e650d1301a46e650e1301a46e650f130199615b10130199615b11130199615b12130199615b131301a46e65141301a46e6515130199615b16130199615b17130199615b181301a46e65191301a46e651a130199615b1b1301a46e651c1301a46e651d1301a46e651e1301652b27001401652b27011401a46e6502140199615b03140199615b04140199615b05140199615b06140199615b07140199615b081401a46e65091401a46e650a1401a46e650b140199615b0c140199615b0d1401a46e650e1401a46e650f140199615b101401a46e6511140199615b12140199615b13140199615b14140199615b15140199615b16140199615b171401a46e65181401a46e65191401a46e651a140199615b1b140199615b1c1401a46e651d1401a46e651e1401652b27001501652b27011501a46e65021501a46e650315018b534d04150199615b051501a46e65061501a46e6507150199615b081501a46e65091501a46e650a150199615b0b150199615b0c150199615b0d15018b534d0e15018b534d0f1501a46e65101501a46e65111501a46e651215018b534d13150199615b141501a46e65151501a46e6516150199615b171501a46e65181501a46e6519150199615b1a150199615b1b150199615b1c15018b534d1d15018b534d1e1501652b27001601652b27011601a46e6502160199615b0316018b534d0416018b534d051601a46e65061601a46e6507160199615b08160199615b0916018b534d0a160199615b0b160199615b0c160199615b0d160199615b0e16018b534d0f1601a46e65101601a46e6511160199615b1216018b534d1316018b534d141601a46e65151601a46e6516160199615b17160199615b1816018b534d19160199615b1a160199615b1b160199615b1c160199615b1d16018b534d1e1601652b27001701652b27011701652b2702170199615b03170199615b04170199615b05170199615b06170199615b07170199615b08170199615b0917018b534d0a17018b534d0b170199615b0c1701a46e650d1701a46e650e170199615b0f170199615b10170199615b11170199615b12170199615b13170199615b14170199615b15170199615b16170199615b17170199615b1817018b534d1917018b534d1a170199615b1b1701a46e651c1701a46e651d1701652b271e1701652b27021801652b27031801652b2704180199615b05180199615b061801a46e65071801a46e6508180199615b091801a46e650a1801a46e650b180199615b0c1801a46e650d1801a46e650e1801a46e650f18018b534d1018018b534d111801a46e65121801a46e6513180199615b14180199615b151801a46e65161801a46e6517180199615b181801a46e65191801a46e651a180199615b1b1801652b271c1801652b27041901652b27051901652b27061901a46e65071901a46e6508190199615b091901a46e650a1901a46e650b190199615b0c190199615b0d1901a46e650e1901a46e650f19018b534d10190199615b111901a46e65121901a46e6513190199615b141901a46e65151901a46e65161901a46e6517190199615b181901a46e65191901652b271a1901652b27061a01652b27071a01652b27081a0199615b091a0199615b0a1a0199615b0b1a0199615b0c1a0199615b0d1a0199615b0e1a0199615b0f1a0199615b101a0199615b111a0199615b121a0199615b131a0199615b141a01a46e65151a01a46e65161a0199615b171a01652b27181a01652b27081b01652b27091b01652b270a1b018b534d0b1b018b534d0c1b0199615b0d1b0199615b0e1b0199615b0f1b01a46e65101b0199615b111b0199615b121b0199615b131b0199615b141b0199615b151b01652b27161b01652b270a1c01652b270b1c01652b270c1c01a46e650d1c01a46e650e1c0199615b0f1c01a46e65101c0199615b111c0199615b121c01a46e65131c01652b27141c01652b270c1d01652b270d1d01652b270e1d01a46e650f1d0199615b101d0199615b111d01652b27121d01652b270e1e01652b270f1e01652b27101e01652b27");
    const App$Kaelin$Assets$tile$effect$dark_blue2 = VoxBox$parse$("0e00011b3d920f00011b3d921000011b3d920c01011b3d920d01011b3d920e01014c74c50f01014c74c51001015783c51101011b3d921201011b3d920a02011b3d920b02011b3d920c02015783c50d02015783c50e02015783c50f02014c74c51002015783c51102015783c51202014c74c51302011b3d921402011b3d920803011b3d920903011b3d920a03015783c50b03014c74c50c03015783c50d03015783c50e03015783c50f03014c74c51003014c74c51103014c74c51203014c74c51303015783c51403015783c51503011b3d921603011b3d920604011b3d920704011b3d920804015783c50904015783c50a04015783c50b04014c74c50c04014c74c50d04015783c50e04015783c50f04014c74c51004015783c51104014c74c51204014c74c51304014c74c51404014c74c51504014c74c51604014c74c51704011b3d921804011b3d920405011b3d920505011b3d920605015783c50705014c74c50805015783c50905015783c50a05014c74c50b05014c74c50c05014c74c50d05013e66b80e05013e66b80f05015783c51005015783c51105015783c51205013e66b81305014c74c51405015783c51505015783c51605014c74c51705015783c51805015783c51905011b3d921a05011b3d920206011b3d920306011b3d920406013e66b80506015783c50606015783c50706014c74c50806014c74c50906013e66b80a06014c74c50b06014c74c50c06014c74c50d06014c74c50e06013e66b80f06015783c51006015783c51106014c74c51206013e66b81306013e66b81406015783c51506015783c51606014c74c51706014c74c51806013e66b81906014c74c51a06014c74c51b06011b3d921c06011b3d920007011b3d920107011b3d920207014c74c50307014c74c50407014c74c50507015783c50607015783c50707015783c50807014c74c50907013e66b80a07013e66b80b07014c74c50c07015783c50d07015783c50e07014c74c50f07014c74c51007014c74c51107014c74c51207014c74c51307014c74c51407014c74c51507014c74c51607014c74c51707014c74c51807013e66b81907013e66b81a07014c74c51b07015783c51c07015783c51d07011b3d921e07011b3d920008011b3d920108014c74c50208015783c50308015783c50408014c74c50508015783c50608015783c50708015783c50808014c74c50908015783c50a08015783c50b08014c74c50c08014c74c50d08015783c50e08015783c50f08013e66b81008014c74c51108015783c51208015783c51308014c74c51408015783c51508015783c51608015783c51708014c74c51808014c74c51908014c74c51a08014c74c51b08014c74c51c08015783c51d08015783c51e08011b3d920009011b3d920109014c74c50209014c74c50309015783c50409014c74c50509014c74c50609015783c50709014c74c50809014c74c50909015783c50a09015783c50b09014c74c50c09014c74c50d09015783c50e09015783c50f09014c74c51009014c74c51109015783c51209015783c51309014c74c51409014c74c51509015783c51609015783c51709014c74c51809014c74c51909015783c51a09015783c51b09014c74c51c09014c74c51d09014c74c51e09011b3d92000a011b3d92010a014c74c5020a014c74c5030a013e66b8040a013e66b8050a014c74c5060a014c74c5070a014c74c5080a014c74c5090a014c74c50a0a015783c50b0a015783c50c0a014c74c50d0a014c74c50e0a014c74c50f0a014c74c5100a014c74c5110a014c74c5120a014c74c5130a014c74c5140a013e66b8150a014c74c5160a014c74c5170a014c74c5180a014c74c5190a015783c51a0a015783c51b0a015783c51c0a014c74c51d0a014c74c51e0a011b3d92000b011b3d92010b014c74c5020b015783c5030b014c74c5040b014c74c5050b015783c5060b015783c5070b014c74c5080b014c74c5090b014c74c50a0b014c74c50b0b014c74c50c0b014c74c50d0b015783c50e0b014c74c50f0b014c74c5100b014c74c5110b015783c5120b014c74c5130b014c74c5140b013e66b8150b015783c5160b014c74c5170b014c74c5180b014c74c5190b014c74c51a0b014c74c51b0b014c74c51c0b014c74c51d0b014c74c51e0b011b3d92000c011b3d92010c014c74c5020c015783c5030c014c74c5040c014c74c5050c014c74c5060c014c74c5070c015783c5080c015783c5090c014c74c50a0c013e66b80b0c013e66b80c0c014c74c50d0c015783c50e0c014c74c50f0c015783c5100c014c74c5110c014c74c5120c014c74c5130c014c74c5140c014c74c5150c014c74c5160c015783c5170c015783c5180c014c74c5190c013e66b81a0c013e66b81b0c014c74c51c0c014c74c51d0c014c74c51e0c011b3d92000d011b3d92010d014c74c5020d014c74c5030d015783c5040d015783c5050d014c74c5060d015783c5070d015783c5080d015783c5090d014c74c50a0d013e66b80b0d014c74c50c0d015783c50d0d015783c50e0d014c74c50f0d015783c5100d014c74c5110d014c74c5120d015783c5130d015783c5140d014c74c5150d015783c5160d015783c5170d015783c5180d014c74c5190d013e66b81a0d014c74c51b0d015783c51c0d015783c51d0d014c74c51e0d011b3d92000e011b3d92010e014c74c5020e015783c5030e015783c5040e015783c5050e014c74c5060e015783c5070e015783c5080e014c74c5090e014c74c50a0e014c74c50b0e014c74c50c0e015783c50d0e015783c50e0e015783c50f0e013e66b8100e014c74c5110e015783c5120e015783c5130e015783c5140e014c74c5150e015783c5160e015783c5170e014c74c5180e014c74c5190e014c74c51a0e014c74c51b0e015783c51c0e015783c51d0e015783c51e0e011b3d92000f011b3d92010f014c74c5020f015783c5030f015783c5040f014c74c5050f014c74c5060f014c74c5070f014c74c5080f014c74c5090f014c74c50a0f014c74c50b0f014c74c50c0f014c74c50d0f015783c50e0f015783c50f0f013e66b8100f013e66b8110f015783c5120f015783c5130f014c74c5140f014c74c5150f014c74c5160f014c74c5170f014c74c5180f014c74c5190f014c74c51a0f014c74c51b0f014c74c51c0f015783c51d0f015783c51e0f011b3d920010011b3d920110014c74c50210015783c50310015783c50410014c74c50510013e66b80610014c74c50710015783c50810015783c50910015783c50a10014c74c50b10015783c50c10015783c50d10014c74c50e10014c74c50f10015783c51010014c74c51110015783c51210015783c51310014c74c51410013e66b81510014c74c51610015783c51710015783c51810015783c51910014c74c51a10015783c51b10015783c51c10014c74c51d10014c74c51e10011b3d920011011b3d920111015783c50211015783c50311015783c50411014c74c50511014c74c50611014c74c50711015783c50811015783c50911014c74c50a11014c74c50b11014c74c50c11014c74c50d11014c74c50e11014c74c50f11014c74c51011015783c51111015783c51211015783c51311014c74c51411014c74c51511014c74c51611015783c51711015783c51811014c74c51911014c74c51a11014c74c51b11014c74c51c11014c74c51d11014c74c51e11011b3d920012011b3d920112015783c50212015783c50312014c74c50412015783c50512015783c50612014c74c50712014c74c50812014c74c50912014c74c50a12014c74c50b12014c74c50c12015783c50d12015783c50e12015783c50f12014c74c51012015783c51112015783c51212014c74c51312015783c51412015783c51512014c74c51612014c74c51712014c74c51812014c74c51912014c74c51a12014c74c51b12015783c51c12015783c51d12015783c51e12011b3d920013011b3d920113014c74c50213014c74c50313014c74c50413015783c50513015783c50613014c74c50713014c74c50813014c74c50913015783c50a13015783c50b13014c74c50c13015783c50d13015783c50e13015783c50f13014c74c51013014c74c51113014c74c51213014c74c51313015783c51413015783c51513014c74c51613014c74c51713014c74c51813015783c51913015783c51a13014c74c51b13015783c51c13015783c51d13015783c51e13011b3d920014011b3d920114015783c50214014c74c50314014c74c50414014c74c50514014c74c50614014c74c50714014c74c50814015783c50914015783c50a14015783c50b14014c74c50c14014c74c50d14015783c50e14015783c50f14014c74c51014015783c51114014c74c51214014c74c51314014c74c51414014c74c51514014c74c51614014c74c51714015783c51814015783c51914015783c51a14014c74c51b14014c74c51c14015783c51d14015783c51e14011b3d920015011b3d920115015783c50215015783c50315013e66b80415014c74c50515015783c50615015783c50715014c74c50815015783c50915015783c50a15014c74c50b15014c74c50c15014c74c50d15013e66b80e15013e66b80f15015783c51015015783c51115015783c51215013e66b81315014c74c51415015783c51515015783c51615014c74c51715015783c51815015783c51915014c74c51a15014c74c51b15014c74c51c15013e66b81d15013e66b81e15011b3d920016011b3d920116015783c50216014c74c50316013e66b80416013e66b80516015783c50616015783c50716014c74c50816014c74c50916013e66b80a16014c74c50b16014c74c50c16014c74c50d16014c74c50e16013e66b80f16015783c51016015783c51116014c74c51216013e66b81316013e66b81416015783c51516015783c51616014c74c51716014c74c51816013e66b81916014c74c51a16014c74c51b16014c74c51c16014c74c51d16013e66b81e16011b3d920017011b3d920117011b3d920217014c74c50317014c74c50417014c74c50517014c74c50617014c74c50717014c74c50817014c74c50917013e66b80a17013e66b80b17014c74c50c17015783c50d17015783c50e17014c74c50f17014c74c51017014c74c51117014c74c51217014c74c51317014c74c51417014c74c51517014c74c51617014c74c51717014c74c51817013e66b81917013e66b81a17014c74c51b17015783c51c17015783c51d17011b3d921e17011b3d920218011b3d920318011b3d920418014c74c50518014c74c50618015783c50718015783c50818014c74c50918015783c50a18015783c50b18014c74c50c18015783c50d18015783c50e18015783c50f18013e66b81018013e66b81118015783c51218015783c51318014c74c51418014c74c51518015783c51618015783c51718014c74c51818015783c51918015783c51a18014c74c51b18011b3d921c18011b3d920419011b3d920519011b3d920619015783c50719015783c50819014c74c50919015783c50a19015783c50b19014c74c50c19014c74c50d19015783c50e19015783c50f19013e66b81019014c74c51119015783c51219015783c51319014c74c51419015783c51519015783c51619015783c51719014c74c51819015783c51919011b3d921a19011b3d92061a011b3d92071a011b3d92081a014c74c5091a014c74c50a1a014c74c50b1a014c74c50c1a014c74c50d1a014c74c50e1a014c74c50f1a014c74c5101a014c74c5111a014c74c5121a014c74c5131a014c74c5141a015783c5151a015783c5161a014c74c5171a011b3d92181a011b3d92081b011b3d92091b011b3d920a1b013e66b80b1b013e66b80c1b014c74c50d1b014c74c50e1b014c74c50f1b015783c5101b014c74c5111b014c74c5121b014c74c5131b014c74c5141b014c74c5151b011b3d92161b011b3d920a1c011b3d920b1c011b3d920c1c015783c50d1c015783c50e1c014c74c50f1c015783c5101c014c74c5111c014c74c5121c015783c5131c011b3d92141c011b3d920c1d011b3d920d1d011b3d920e1d015783c50f1d014c74c5101d014c74c5111d011b3d92121d011b3d920e1e011b3d920f1e011b3d92101e011b3d92");
    const App$Kaelin$Assets$tile$green_2 = VoxBox$parse$("0e00011652320f00011652321000011652320c01011652320d01011652320e0101408d640f0101408d64100101469e651101011652321201011652320a02011652320b02011652320c0201469e650d0201469e650e0201469e650f0201408d64100201469e65110201469e65120201408d641302011652321402011652320803011652320903011652320a0301469e650b0301408d640c0301469e650d0301469e650e0301469e650f0301408d64100301408d64110301408d64120301408d64130301469e65140301469e65150301165232160301165232060401165232070401165232080401469e65090401469e650a0401469e650b0401408d640c0401408d640d0401469e650e0401469e650f0401408d64100401469e65110401408d64120401408d64130401408d64140401408d64150401408d64160401408d64170401165232180401165232040501165232050501165232060501469e65070501408d64080501469e65090501469e650a0501408d640b0501408d640c0501408d640d0501347e570e0501347e570f0501469e65100501469e65110501469e65120501347e57130501408d64140501469e65150501469e65160501408d64170501469e65180501469e651905011652321a0501165232020601165232030601165232040601347e57050601469e65060601469e65070601408d64080601408d64090601347e570a0601408d640b0601408d640c0601408d640d0601408d640e0601347e570f0601469e65100601469e65110601408d64120601347e57130601347e57140601469e65150601469e65160601408d64170601408d64180601347e57190601408d641a0601408d641b06011652321c0601165232000701165232010701165232020701408d64030701408d64040701408d64050701469e65060701469e65070701469e65080701408d64090701347e570a0701347e570b0701408d640c0701469e650d0701469e650e0701408d640f0701408d64100701408d64110701408d64120701408d64130701408d64140701408d64150701408d64160701408d64170701408d64180701347e57190701347e571a0701408d641b0701469e651c0701469e651d07011652321e0701165232000801165232010801408d64020801469e65030801469e65040801408d64050801469e65060801469e65070801469e65080801408d64090801469e650a0801469e650b0801408d640c0801408d640d0801469e650e0801469e650f0801347e57100801408d64110801469e65120801469e65130801408d64140801469e65150801469e65160801469e65170801408d64180801408d64190801408d641a0801408d641b0801408d641c0801469e651d0801469e651e0801165232000901165232010901408d64020901408d64030901469e65040901408d64050901408d64060901469e65070901408d64080901408d64090901469e650a0901469e650b0901408d640c0901408d640d0901469e650e0901469e650f0901408d64100901408d64110901469e65120901469e65130901408d64140901408d64150901469e65160901469e65170901408d64180901408d64190901469e651a0901469e651b0901408d641c0901408d641d0901408d641e0901165232000a01165232010a01408d64020a01408d64030a01347e57040a01347e57050a01408d64060a01408d64070a01408d64080a01408d64090a01408d640a0a01469e650b0a01469e650c0a01408d640d0a01408d640e0a01408d640f0a01408d64100a01408d64110a01408d64120a01408d64130a01408d64140a01347e57150a01408d64160a01408d64170a01408d64180a01408d64190a01469e651a0a01469e651b0a01469e651c0a01408d641d0a01408d641e0a01165232000b01165232010b01408d64020b01469e65030b01408d64040b01408d64050b01469e65060b01469e65070b01408d64080b01408d64090b01408d640a0b01408d640b0b01408d640c0b01408d640d0b01469e650e0b01408d640f0b01408d64100b01408d64110b01469e65120b01408d64130b01408d64140b01347e57150b01469e65160b01408d64170b01408d64180b01408d64190b01408d641a0b01408d641b0b01408d641c0b01408d641d0b01408d641e0b01165232000c01165232010c01408d64020c01469e65030c01408d64040c01408d64050c01408d64060c01408d64070c01469e65080c01469e65090c01408d640a0c01347e570b0c01347e570c0c01408d640d0c01469e650e0c01408d640f0c01469e65100c01408d64110c01408d64120c01408d64130c01408d64140c01408d64150c01408d64160c01469e65170c01469e65180c01408d64190c01347e571a0c01347e571b0c01408d641c0c01408d641d0c01408d641e0c01165232000d01165232010d01408d64020d01408d64030d01469e65040d01469e65050d01408d64060d01469e65070d01469e65080d01469e65090d01408d640a0d01347e570b0d01408d640c0d01469e650d0d01469e650e0d01408d640f0d01469e65100d01408d64110d01408d64120d01469e65130d01469e65140d01408d64150d01469e65160d01469e65170d01469e65180d01408d64190d01347e571a0d01408d641b0d01469e651c0d01469e651d0d01408d641e0d01165232000e01165232010e01408d64020e01469e65030e01469e65040e01469e65050e01408d64060e01469e65070e01469e65080e01408d64090e01408d640a0e01408d640b0e01408d640c0e01469e650d0e01469e650e0e01469e650f0e01347e57100e01408d64110e01469e65120e01469e65130e01469e65140e01408d64150e01469e65160e01469e65170e01408d64180e01408d64190e01408d641a0e01408d641b0e01469e651c0e01469e651d0e01469e651e0e01165232000f01165232010f01408d64020f01469e65030f01469e65040f01408d64050f01408d64060f01408d64070f01408d64080f01408d64090f01408d640a0f01408d640b0f01408d640c0f01408d640d0f01469e650e0f01469e650f0f01347e57100f01347e57110f01469e65120f01469e65130f01408d64140f01408d64150f01408d64160f01408d64170f01408d64180f01408d64190f01408d641a0f01408d641b0f01408d641c0f01469e651d0f01469e651e0f01165232001001165232011001408d64021001469e65031001469e65041001408d64051001347e57061001408d64071001469e65081001469e65091001469e650a1001408d640b1001469e650c1001469e650d1001408d640e1001408d640f1001469e65101001408d64111001469e65121001469e65131001408d64141001347e57151001408d64161001469e65171001469e65181001469e65191001408d641a1001469e651b1001469e651c1001408d641d1001408d641e1001165232001101165232011101469e65021101469e65031101469e65041101408d64051101408d64061101408d64071101469e65081101469e65091101408d640a1101408d640b1101408d640c1101408d640d1101408d640e1101408d640f1101408d64101101469e65111101469e65121101469e65131101408d64141101408d64151101408d64161101469e65171101469e65181101408d64191101408d641a1101408d641b1101408d641c1101408d641d1101408d641e1101165232001201165232011201469e65021201469e65031201408d64041201469e65051201469e65061201408d64071201408d64081201408d64091201408d640a1201408d640b1201408d640c1201469e650d1201469e650e1201469e650f1201408d64101201469e65111201469e65121201408d64131201469e65141201469e65151201408d64161201408d64171201408d64181201408d64191201408d641a1201408d641b1201469e651c1201469e651d1201469e651e1201165232001301165232011301408d64021301408d64031301408d64041301469e65051301469e65061301408d64071301408d64081301408d64091301469e650a1301469e650b1301408d640c1301469e650d1301469e650e1301469e650f1301408d64101301408d64111301408d64121301408d64131301469e65141301469e65151301408d64161301408d64171301408d64181301469e65191301469e651a1301408d641b1301469e651c1301469e651d1301469e651e1301165232001401165232011401469e65021401408d64031401408d64041401408d64051401408d64061401408d64071401408d64081401469e65091401469e650a1401469e650b1401408d640c1401408d640d1401469e650e1401469e650f1401408d64101401469e65111401408d64121401408d64131401408d64141401408d64151401408d64161401408d64171401469e65181401469e65191401469e651a1401408d641b1401408d641c1401469e651d1401469e651e1401165232001501165232011501469e65021501469e65031501347e57041501408d64051501469e65061501469e65071501408d64081501469e65091501469e650a1501408d640b1501408d640c1501408d640d1501347e570e1501347e570f1501469e65101501469e65111501469e65121501347e57131501408d64141501469e65151501469e65161501408d64171501469e65181501469e65191501408d641a1501408d641b1501408d641c1501347e571d1501347e571e1501165232001601165232011601469e65021601408d64031601347e57041601347e57051601469e65061601469e65071601408d64081601408d64091601347e570a1601408d640b1601408d640c1601408d640d1601408d640e1601347e570f1601469e65101601469e65111601408d64121601347e57131601347e57141601469e65151601469e65161601408d64171601408d64181601347e57191601408d641a1601408d641b1601408d641c1601408d641d1601347e571e1601165232001701165232011701165232021701408d64031701408d64041701408d64051701408d64061701408d64071701408d64081701408d64091701347e570a1701347e570b1701408d640c1701469e650d1701469e650e1701408d640f1701408d64101701408d64111701408d64121701408d64131701408d64141701408d64151701408d64161701408d64171701408d64181701347e57191701347e571a1701408d641b1701469e651c1701469e651d17011652321e1701165232021801165232031801165232041801408d64051801408d64061801469e65071801469e65081801408d64091801469e650a1801469e650b1801408d640c1801469e650d1801469e650e1801469e650f1801347e57101801347e57111801469e65121801469e65131801408d64141801408d64151801469e65161801469e65171801408d64181801469e65191801469e651a1801408d641b18011652321c1801165232041901165232051901165232061901469e65071901469e65081901408d64091901469e650a1901469e650b1901408d640c1901408d640d1901469e650e1901469e650f1901347e57101901408d64111901469e65121901469e65131901408d64141901469e65151901469e65161901469e65171901408d64181901469e651919011652321a1901165232061a01165232071a01165232081a01408d64091a01408d640a1a01408d640b1a01408d640c1a01408d640d1a01408d640e1a01408d640f1a01408d64101a01408d64111a01408d64121a01408d64131a01408d64141a01469e65151a01469e65161a01408d64171a01165232181a01165232081b01165232091b011652320a1b01347e570b1b01347e570c1b01408d640d1b01408d640e1b01408d640f1b01469e65101b01408d64111b01408d64121b01408d64131b01408d64141b01408d64151b01165232161b011652320a1c011652320b1c011652320c1c01469e650d1c01469e650e1c01408d640f1c01469e65101c01408d64111c01408d64121c01469e65131c01165232141c011652320c1d011652320d1d011652320e1d01469e650f1d01408d64101d01408d64111d01165232121d011652320e1e011652320f1e01165232101e01165232");

    function App$KL$Game$Field$new$(_name$1, _draw$2) {
        var $1888 = ({
            _: 'App.KL.Game.Field.new',
            'name': _name$1,
            'draw': _draw$2
        });
        return $1888;
    };
    const App$KL$Game$Field$new = x0 => x1 => App$KL$Game$Field$new$(x0, x1);
    const App$KL$Game$Field$Grass$field = (() => {
        var _name$1 = "Grass";
        var _draw$2 = (_terrain$2 => _indicator$3 => {
            var self = _indicator$3;
            switch (self._) {
                case 'App.KL.Game.Indicator.green':
                    var $1891 = App$Kaelin$Assets$tile$green_1;
                    var $1890 = $1891;
                    break;
                case 'App.KL.Game.Indicator.red':
                case 'App.KL.Game.Indicator.yellow':
                    var $1892 = App$Kaelin$Assets$tile$effect$light_red2;
                    var $1890 = $1892;
                    break;
                case 'App.KL.Game.Indicator.blue':
                    var $1893 = App$Kaelin$Assets$tile$effect$dark_blue2;
                    var $1890 = $1893;
                    break;
                case 'App.KL.Game.Indicator.background':
                    var $1894 = App$Kaelin$Assets$tile$green_2;
                    var $1890 = $1894;
                    break;
            };
            return $1890;
        });
        var $1889 = App$KL$Game$Field$new$(_name$1, _draw$2);
        return $1889;
    })();
    const App$KL$Game$Field$list = List$cons$(App$KL$Game$Field$Grass$field, List$nil);
    const App$KL$Game$Field$get_by_id$map = NatMap$from_list$(List$imap$((_i$1 => _x$2 => {
        var $1895 = Pair$new$(_i$1, _x$2);
        return $1895;
    }), App$KL$Game$Field$list));

    function App$KL$Game$Field$get_by_id$(_id$1) {
        var $1896 = NatMap$get$(_id$1, App$KL$Game$Field$get_by_id$map);
        return $1896;
    };
    const App$KL$Game$Field$get_by_id = x0 => App$KL$Game$Field$get_by_id$(x0);

    function App$KL$Game$Field$get_by_id$default$(_id$1) {
        var $1897 = Maybe$default$(App$KL$Game$Field$get_by_id$(_id$1), App$KL$Game$Field$Grass$field);
        return $1897;
    };
    const App$KL$Game$Field$get_by_id$default = x0 => App$KL$Game$Field$get_by_id$default$(x0);

    function VoxBox$get_len$(_img$1) {
        var self = _img$1;
        switch (self._) {
            case 'VoxBox.new':
                var $1899 = self.length;
                var $1900 = $1899;
                var $1898 = $1900;
                break;
        };
        return $1898;
    };
    const VoxBox$get_len = x0 => VoxBox$get_len$(x0);

    function Array$get$(_idx$3, _arr$4) {
        var $1901 = Word$foldl$(Array$extract_tip, (_rec$6 => _arr$7 => {
            var _arr_l$8 = Array$extract_tie$(_arr$7);
            var self = _arr_l$8;
            switch (self._) {
                case 'Pair.new':
                    var $1903 = self.fst;
                    var $1904 = _rec$6($1903);
                    var $1902 = $1904;
                    break;
            };
            return $1902;
        }), (_rec$6 => _arr$7 => {
            var _arr_r$8 = Array$extract_tie$(_arr$7);
            var self = _arr_r$8;
            switch (self._) {
                case 'Pair.new':
                    var $1906 = self.snd;
                    var $1907 = _rec$6($1906);
                    var $1905 = $1907;
                    break;
            };
            return $1905;
        }), _idx$3)(_arr$4);
        return $1901;
    };
    const Array$get = x0 => x1 => Array$get$(x0, x1);
    const Buffer32$get = a0 => a1 => ((a1[a0]));
    const VoxBox$get_pos = a0 => a1 => ((a1.buffer[a0 * 2]));
    const VoxBox$get_col = a0 => a1 => ((a1.buffer[a0 * 2 + 1]));

    function Word$and$(_a$2, _b$3) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $1909 = self.pred;
                var $1910 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $1912 = self.pred;
                            var $1913 = (_a$pred$9 => {
                                var $1914 = Word$o$(Word$and$(_a$pred$9, $1912));
                                return $1914;
                            });
                            var $1911 = $1913;
                            break;
                        case 'Word.i':
                            var $1915 = self.pred;
                            var $1916 = (_a$pred$9 => {
                                var $1917 = Word$o$(Word$and$(_a$pred$9, $1915));
                                return $1917;
                            });
                            var $1911 = $1916;
                            break;
                        case 'Word.e':
                            var $1918 = (_a$pred$7 => {
                                var $1919 = Word$e;
                                return $1919;
                            });
                            var $1911 = $1918;
                            break;
                    };
                    var $1911 = $1911($1909);
                    return $1911;
                });
                var $1908 = $1910;
                break;
            case 'Word.i':
                var $1920 = self.pred;
                var $1921 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $1923 = self.pred;
                            var $1924 = (_a$pred$9 => {
                                var $1925 = Word$o$(Word$and$(_a$pred$9, $1923));
                                return $1925;
                            });
                            var $1922 = $1924;
                            break;
                        case 'Word.i':
                            var $1926 = self.pred;
                            var $1927 = (_a$pred$9 => {
                                var $1928 = Word$i$(Word$and$(_a$pred$9, $1926));
                                return $1928;
                            });
                            var $1922 = $1927;
                            break;
                        case 'Word.e':
                            var $1929 = (_a$pred$7 => {
                                var $1930 = Word$e;
                                return $1930;
                            });
                            var $1922 = $1929;
                            break;
                    };
                    var $1922 = $1922($1920);
                    return $1922;
                });
                var $1908 = $1921;
                break;
            case 'Word.e':
                var $1931 = (_b$4 => {
                    var $1932 = Word$e;
                    return $1932;
                });
                var $1908 = $1931;
                break;
        };
        var $1908 = $1908(_b$3);
        return $1908;
    };
    const Word$and = x0 => x1 => Word$and$(x0, x1);
    const U32$and = a0 => a1 => (a0 & a1);
    const U32$shr = a0 => a1 => (a0 >>> a1);

    function VoxBox$Draw$image$(_x$1, _y$2, _z$3, _src$4, _img$5) {
        var _len$6 = VoxBox$get_len$(_src$4);
        var _img$7 = (() => {
            var $1934 = _img$5;
            var $1935 = 0;
            var $1936 = _len$6;
            let _img$8 = $1934;
            for (let _i$7 = $1935; _i$7 < $1936; ++_i$7) {
                var _pos$9 = ((_src$4.buffer[_i$7 * 2]));
                var _col$10 = ((_src$4.buffer[_i$7 * 2 + 1]));
                var _p_x$11 = (_pos$9 & 4095);
                var _p_y$12 = ((_pos$9 & 16773120) >>> 12);
                var _p_z$13 = ((_pos$9 & 4278190080) >>> 24);
                var _p_x$14 = ((_p_x$11 + _x$1) >>> 0);
                var _p_y$15 = ((_p_y$12 + _y$2) >>> 0);
                var _p_z$16 = ((_p_z$13 + _z$3) >>> 0);
                var _pos$17 = ((0 | _p_x$14 | (_p_y$15 << 12) | (_p_z$16 << 24)));
                var $1934 = ((_img$8.buffer[_img$8.length * 2] = _pos$17, _img$8.buffer[_img$8.length * 2 + 1] = _col$10, _img$8.length++, _img$8));
                _img$8 = $1934;
            };
            return _img$8;
        })();
        var $1933 = _img$7;
        return $1933;
    };
    const VoxBox$Draw$image = x0 => x1 => x2 => x3 => x4 => VoxBox$Draw$image$(x0, x1, x2, x3, x4);

    function App$KL$Game$Stage$Board$draw$centralize_letter$(_screen_coord$1) {
        var $1937 = Pair$new$((((() => {
            var self = _screen_coord$1;
            switch (self._) {
                case 'Pair.new':
                    var $1938 = self.fst;
                    var $1939 = $1938;
                    return $1939;
            };
        })() - 2) >>> 0), (((() => {
            var self = _screen_coord$1;
            switch (self._) {
                case 'Pair.new':
                    var $1940 = self.snd;
                    var $1941 = $1940;
                    return $1941;
            };
        })() - 6) >>> 0));
        return $1937;
    };
    const App$KL$Game$Stage$Board$draw$centralize_letter = x0 => App$KL$Game$Stage$Board$draw$centralize_letter$(x0);

    function List$indices$u32$(_xs$2) {
        var $1942 = List$imap$((_i$3 => _x$4 => {
            var $1943 = Pair$new$((Number(_i$3) >>> 0), _x$4);
            return $1943;
        }), _xs$2);
        return $1942;
    };
    const List$indices$u32 = x0 => List$indices$u32$(x0);

    function String$to_list$(_str$1) {
        var self = _str$1;
        if (self.length === 0) {
            var $1945 = List$nil;
            var $1944 = $1945;
        } else {
            var $1946 = self.charCodeAt(0);
            var $1947 = self.slice(1);
            var $1948 = List$cons$($1946, String$to_list$($1947));
            var $1944 = $1948;
        };
        return $1944;
    };
    const String$to_list = x0 => String$to_list$(x0);

    function Bits$to_nat$(_b$1) {
        var self = _b$1;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'o':
                var $1950 = self.slice(0, -1);
                var $1951 = (2n * Bits$to_nat$($1950));
                var $1949 = $1951;
                break;
            case 'i':
                var $1952 = self.slice(0, -1);
                var $1953 = Nat$succ$((2n * Bits$to_nat$($1952)));
                var $1949 = $1953;
                break;
            case 'e':
                var $1954 = 0n;
                var $1949 = $1954;
                break;
        };
        return $1949;
    };
    const Bits$to_nat = x0 => Bits$to_nat$(x0);

    function Word$to_bits$(_a$2) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $1956 = self.pred;
                var $1957 = (Word$to_bits$($1956) + '0');
                var $1955 = $1957;
                break;
            case 'Word.i':
                var $1958 = self.pred;
                var $1959 = (Word$to_bits$($1958) + '1');
                var $1955 = $1959;
                break;
            case 'Word.e':
                var $1960 = Bits$e;
                var $1955 = $1960;
                break;
        };
        return $1955;
    };
    const Word$to_bits = x0 => Word$to_bits$(x0);

    function U16$show_hex$(_a$1) {
        var self = _a$1;
        switch ('u16') {
            case 'u16':
                var $1962 = u16_to_word(self);
                var $1963 = Nat$to_string_base$(16n, Bits$to_nat$(Word$to_bits$($1962)));
                var $1961 = $1963;
                break;
        };
        return $1961;
    };
    const U16$show_hex = x0 => U16$show_hex$(x0);

    function PixelFont$get_img$(_char$1, _map$2) {
        var self = Map$get$(U16$show_hex$(_char$1), _map$2);
        switch (self._) {
            case 'Maybe.some':
                var $1965 = self.value;
                var $1966 = Maybe$some$($1965);
                var $1964 = $1966;
                break;
            case 'Maybe.none':
                var $1967 = Maybe$none;
                var $1964 = $1967;
                break;
        };
        return $1964;
    };
    const PixelFont$get_img = x0 => x1 => PixelFont$get_img$(x0, x1);
    const Pos32$get_x = a0 => ((a0 & 0xFFF));
    const Pos32$get_y = a0 => (((a0 >>> 12) & 0xFFF));
    const Pos32$get_z = a0 => ((a0 >>> 24));

    function VoxBox$Draw$text$char$(_chr$1, _font_map$2, _chr_pos$3, _scr$4) {
        var self = PixelFont$get_img$(_chr$1, _font_map$2);
        switch (self._) {
            case 'Maybe.some':
                var $1969 = self.value;
                var _x$6 = ((_chr_pos$3 & 0xFFF));
                var _y$7 = (((_chr_pos$3 >>> 12) & 0xFFF));
                var _z$8 = ((_chr_pos$3 >>> 24));
                var $1970 = VoxBox$Draw$image$(_x$6, _y$7, _z$8, $1969, _scr$4);
                var $1968 = $1970;
                break;
            case 'Maybe.none':
                var $1971 = _scr$4;
                var $1968 = $1971;
                break;
        };
        return $1968;
    };
    const VoxBox$Draw$text$char = x0 => x1 => x2 => x3 => VoxBox$Draw$text$char$(x0, x1, x2, x3);

    function Pos32$add$(_a$1, _b$2) {
        var _x$3 = ((((_a$1 & 0xFFF)) + ((_b$2 & 0xFFF))) >>> 0);
        var _y$4 = (((((_a$1 >>> 12) & 0xFFF)) + (((_b$2 >>> 12) & 0xFFF))) >>> 0);
        var _z$5 = ((((_a$1 >>> 24)) + ((_b$2 >>> 24))) >>> 0);
        var $1972 = ((0 | _x$3 | (_y$4 << 12) | (_z$5 << 24)));
        return $1972;
    };
    const Pos32$add = x0 => x1 => Pos32$add$(x0, x1);

    function VoxBox$Draw$text$(_txt$1, _font_map$2, _pos$3, _scr$4) {
        var _scr$5 = (() => {
            var $1975 = _scr$4;
            var $1976 = List$indices$u32$(String$to_list$(_txt$1));
            let _scr$6 = $1975;
            let _pair$5;
            while ($1976._ === 'List.cons') {
                _pair$5 = $1976.head;
                var self = _pair$5;
                switch (self._) {
                    case 'Pair.new':
                        var $1977 = self.fst;
                        var $1978 = self.snd;
                        var _add_pos$9 = ((0 | (($1977 * 6) >>> 0) | (0 << 12) | (0 << 24)));
                        var $1979 = VoxBox$Draw$text$char$($1978, _font_map$2, Pos32$add$(_pos$3, _add_pos$9), _scr$6);
                        var $1975 = $1979;
                        break;
                };
                _scr$6 = $1975;
                $1976 = $1976.tail;
            }
            return _scr$6;
        })();
        var $1973 = _scr$5;
        return $1973;
    };
    const VoxBox$Draw$text = x0 => x1 => x2 => x3 => VoxBox$Draw$text$(x0, x1, x2, x3);

    function PixelFont$set_img$(_char$1, _img$2, _map$3) {
        var $1980 = Map$set$(U16$show_hex$(_char$1), _img$2, _map$3);
        return $1980;
    };
    const PixelFont$set_img = x0 => x1 => x2 => PixelFont$set_img$(x0, x1, x2);
    const Nat$to_u16 = a0 => (Number(a0) & 0xFFFF);
    const PixelFont$black$100 = VoxBox$parse$("04021e00000004031e00000001041e00000002041e00000003041e00000004041e00000000051e00000004051e00000000061e00000004061e00000000071e00000004071e00000000081e00000004081e00000001091e00000002091e00000003091e00000004091e000000");
    const PixelFont$black$101 = VoxBox$parse$("01041e00000002041e00000003041e00000000051e00000004051e00000000061e00000001061e00000002061e00000003061e00000004061e00000000071e00000000081e00000004081e00000001091e00000002091e00000003091e000000");
    const PixelFont$black$102 = VoxBox$parse$("02021e00000003021e00000004021e00000001031e00000001041e00000000051e00000001051e00000002051e00000003051e00000004051e00000001061e00000001071e00000001081e00000001091e000000");
    const PixelFont$black$103 = VoxBox$parse$("01041e00000002041e00000003041e00000004041e00000000051e00000004051e00000000061e00000004061e00000000071e00000004071e00000000081e00000004081e00000001091e00000002091e00000003091e00000004091e000000040a1e000000010b1e000000020b1e000000030b1e000000");
    const PixelFont$black$104 = VoxBox$parse$("00021e00000000031e00000000041e00000001041e00000002041e00000003041e00000000051e00000004051e00000000061e00000004061e00000000071e00000004071e00000000081e00000004081e00000000091e00000004091e000000");
    const PixelFont$black$105 = VoxBox$parse$("02031e00000001051e00000002051e00000002061e00000002071e00000002081e00000001091e00000002091e00000003091e000000");
    const PixelFont$black$106 = VoxBox$parse$("04031e00000002051e00000003051e00000004051e00000004061e00000004071e00000004081e00000004091e000000040a1e000000010b1e000000020b1e000000030b1e000000");
    const PixelFont$black$107 = VoxBox$parse$("00021e00000000031e00000004031e00000000041e00000004041e00000000051e00000003051e00000000061e00000001061e00000002061e00000000071e00000003071e00000000081e00000004081e00000000091e00000004091e000000");
    const PixelFont$black$108 = VoxBox$parse$("01021e00000002021e00000002031e00000002041e00000002051e00000002061e00000002071e00000002081e00000001091e00000002091e00000003091e000000");
    const PixelFont$black$109 = VoxBox$parse$("00041e00000001041e00000002041e00000003041e00000000051e00000002051e00000004051e00000000061e00000002061e00000004061e00000000071e00000002071e00000004071e00000000081e00000002081e00000004081e00000000091e00000002091e00000004091e000000");
    const PixelFont$black$110 = VoxBox$parse$("00041e00000001041e00000002041e00000003041e00000000051e00000004051e00000000061e00000004061e00000000071e00000004071e00000000081e00000004081e00000000091e00000004091e000000");
    const PixelFont$black$111 = VoxBox$parse$("01041e00000002041e00000003041e00000000051e00000004051e00000000061e00000004061e00000000071e00000004071e00000000081e00000004081e00000001091e00000002091e00000003091e000000");
    const PixelFont$black$112 = VoxBox$parse$("00041e00000001041e00000002041e00000003041e00000000051e00000004051e00000000061e00000004061e00000000071e00000004071e00000000081e00000004081e00000000091e00000001091e00000002091e00000003091e000000000a1e000000000b1e000000");
    const PixelFont$black$113 = VoxBox$parse$("01041e00000002041e00000003041e00000004041e00000000051e00000004051e00000000061e00000004061e00000000071e00000004071e00000000081e00000004081e00000001091e00000002091e00000003091e00000004091e000000040a1e000000040b1e000000");
    const PixelFont$black$114 = VoxBox$parse$("00041e00000003041e00000004041e00000000051e00000002051e00000000061e00000001061e00000000071e00000000081e00000000091e000000");
    const PixelFont$black$115 = VoxBox$parse$("01041e00000002041e00000003041e00000004041e00000000051e00000001061e00000002061e00000003061e00000004071e00000000081e00000004081e00000001091e00000002091e00000003091e000000");
    const PixelFont$black$116 = VoxBox$parse$("01021e00000001031e00000000041e00000001041e00000002041e00000003041e00000001051e00000001061e00000001071e00000001081e00000002091e00000003091e000000");
    const PixelFont$black$117 = VoxBox$parse$("00041e00000004041e00000000051e00000004051e00000000061e00000004061e00000000071e00000004071e00000000081e00000004081e00000001091e00000002091e00000003091e00000004091e000000");
    const PixelFont$black$118 = VoxBox$parse$("00041e00000004041e00000000051e00000004051e00000000061e00000004061e00000000071e00000004071e00000001081e00000003081e00000002091e000000");
    const PixelFont$black$119 = VoxBox$parse$("00041e00000004041e00000000051e00000004051e00000000061e00000004061e00000000071e00000002071e00000004071e00000000081e00000002081e00000004081e00000001091e00000003091e000000");
    const PixelFont$black$120 = VoxBox$parse$("00041e00000004041e00000001051e00000003051e00000002061e00000002071e00000001081e00000003081e00000000091e00000004091e000000");
    const PixelFont$black$121 = VoxBox$parse$("00041e00000004041e00000000051e00000004051e00000000061e00000004061e00000000071e00000004071e00000000081e00000004081e00000001091e00000002091e00000003091e000000030a1e000000000b1e000000010b1e000000020b1e000000");
    const PixelFont$black$122 = VoxBox$parse$("00041e00000001041e00000002041e00000003041e00000004041e00000004051e00000002061e00000003061e00000001071e00000000081e00000000091e00000001091e00000002091e00000003091e00000004091e000000");
    const PixelFont$black$123 = VoxBox$parse$("03021e00000002031e00000002041e00000002051e00000001061e00000002071e00000002081e00000003091e000000");
    const PixelFont$black$124 = VoxBox$parse$("02021e00000002031e00000002041e00000002051e00000002061e00000002071e00000002081e00000002091e000000");
    const PixelFont$black$125 = VoxBox$parse$("01021e00000002031e00000002041e00000002051e00000003061e00000002071e00000002081e00000001091e000000");
    const PixelFont$black$126 = VoxBox$parse$("01011e00000004011e00000000021e00000002021e00000004021e00000000031e00000003031e000000");
    const PixelFont$black$32 = VoxBox$parse$("");
    const PixelFont$black$33 = VoxBox$parse$("02021e00000002031e00000002041e00000002051e00000002061e00000002071e00000002091e000000");
    const PixelFont$black$34 = VoxBox$parse$("01021e00000003021e00000001031e00000003031e000000");
    const PixelFont$black$35 = VoxBox$parse$("01021e00000003021e00000001031e00000003031e00000000041e00000001041e00000002041e00000003041e00000004041e00000001051e00000003051e00000001061e00000003061e00000000071e00000001071e00000002071e00000003071e00000004071e00000001081e00000003081e00000001091e00000003091e000000");
    const PixelFont$black$36 = VoxBox$parse$("02011e00000001021e00000002021e00000003021e00000000031e00000004031e00000000041e00000001051e00000002061e00000003061e00000004071e00000000081e00000004081e00000001091e00000002091e00000003091e000000020a1e000000");
    const PixelFont$black$37 = VoxBox$parse$("01011e00000000021e00000002021e00000001031e00000004031e00000003041e00000002051e00000001061e00000000071e00000003071e00000002081e00000004081e00000003091e000000");
    const PixelFont$black$38 = VoxBox$parse$("01021e00000002021e00000000031e00000003031e00000000041e00000003041e00000001051e00000002051e00000000061e00000000071e00000002071e00000003071e00000004071e00000000081e00000003081e00000001091e00000002091e00000004091e000000");
    const PixelFont$black$39 = VoxBox$parse$("02021e00000002031e000000");
    const PixelFont$black$40 = VoxBox$parse$("03021e00000002031e00000001041e00000001051e00000001061e00000001071e00000002081e00000003091e000000");
    const PixelFont$black$41 = VoxBox$parse$("01021e00000002031e00000003041e00000003051e00000003061e00000003071e00000002081e00000001091e000000");
    const PixelFont$black$42 = VoxBox$parse$("01031e00000003031e00000002041e00000001051e00000002051e00000003051e00000002061e00000001071e00000003071e000000");
    const PixelFont$black$43 = VoxBox$parse$("02031e00000002041e00000000051e00000001051e00000002051e00000003051e00000004051e00000002061e00000002071e000000");
    const PixelFont$black$44 = VoxBox$parse$("02081e00000003081e00000002091e00000003091e000000030a1e000000020b1e000000");
    const PixelFont$black$45 = VoxBox$parse$("00051e00000001051e00000002051e00000003051e00000004051e000000");
    const PixelFont$black$46 = VoxBox$parse$("03091e00000004091e000000");
    const PixelFont$black$47 = VoxBox$parse$("03011e21212802021e21212801031e21212800041e212128");
    const PixelFont$black$48 = VoxBox$parse$("01001e21212802001e21212800011e21212803011e21212800021e21212803021e21212800031e21212803031e21212801041e21212802041e212128");
    const PixelFont$black$49 = VoxBox$parse$("02001e21212801011e21212802011e21212802021e21212802031e21212801041e21212802041e21212803041e212128");
    const PixelFont$black$50 = VoxBox$parse$("01001e21212802001e21212800011e21212803011e21212802021e21212801031e21212800041e21212801041e21212802041e21212803041e212128");
    const PixelFont$black$51 = VoxBox$parse$("00001e21212801001e21212802001e21212803011e21212801021e21212802021e21212803021e21212803031e21212800041e21212801041e21212802041e212128");
    const PixelFont$black$52 = VoxBox$parse$("00001e21212803001e21212800011e21212803011e21212800021e21212801021e21212802021e21212803021e21212803031e21212803041e212128");
    const PixelFont$black$53 = VoxBox$parse$("00001e21212801001e21212802001e21212803001e21212800011e21212800021e21212801021e21212802021e21212803021e21212803031e21212800041e21212801041e21212802041e212128");
    const PixelFont$black$54 = VoxBox$parse$("01001e21212802001e21212803001e21212800011e21212800021e21212801021e21212802021e21212803021e21212800031e21212803031e21212801041e21212802041e212128");
    const PixelFont$black$55 = VoxBox$parse$("00001e21212801001e21212802001e21212803001e21212803011e21212802021e21212801031e21212800041e212128");
    const PixelFont$black$56 = VoxBox$parse$("01001e21212802001e21212800011e21212803011e21212801021e21212802021e21212800031e21212803031e21212801041e21212802041e212128");
    const PixelFont$black$57 = VoxBox$parse$("01001e21212802001e21212800011e21212803011e21212801021e21212802021e21212803021e21212803031e21212800041e21212801041e21212802041e212128");
    const PixelFont$black$58 = VoxBox$parse$("02051e00000003051e00000002081e00000003081e000000");
    const PixelFont$black$59 = VoxBox$parse$("02051e00000003051e00000002081e00000003081e00000002091e00000003091e000000030a1e000000020b1e000000");
    const PixelFont$black$60 = VoxBox$parse$("03021e00000002031e00000001041e00000000051e00000000061e00000001071e00000002081e00000003091e000000");
    const PixelFont$black$61 = VoxBox$parse$("00051e00000001051e00000002051e00000003051e00000004051e00000000071e00000001071e00000002071e00000003071e00000004071e000000");
    const PixelFont$black$62 = VoxBox$parse$("01021e00000002031e00000003041e00000004051e00000004061e00000003071e00000002081e00000001091e000000");
    const PixelFont$black$63 = VoxBox$parse$("01021e00000002021e00000003021e00000000031e00000004031e00000000041e00000004041e00000003051e00000002061e00000002071e00000002091e000000");
    const PixelFont$black$64 = VoxBox$parse$("01021e00000002021e00000003021e00000000031e00000004031e00000000041e00000003041e00000004041e00000000051e00000002051e00000004051e00000000061e00000002061e00000004061e00000000071e00000003071e00000004071e00000000081e00000001091e00000002091e00000003091e00000004091e000000");
    const PixelFont$black$65 = VoxBox$parse$("01021e00000002021e00000003021e00000000031e00000004031e00000000041e00000004041e00000000051e00000004051e00000000061e00000004061e00000000071e00000001071e00000002071e00000003071e00000004071e00000000081e00000004081e00000000091e00000004091e000000");
    const PixelFont$black$66 = VoxBox$parse$("00021e00000001021e00000002021e00000003021e00000000031e00000004031e00000000041e00000004041e00000000051e00000001051e00000002051e00000003051e00000000061e00000004061e00000000071e00000004071e00000000081e00000004081e00000000091e00000001091e00000002091e00000003091e000000");
    const PixelFont$black$67 = VoxBox$parse$("01021e00000002021e00000003021e00000000031e00000004031e00000000041e00000000051e00000000061e00000000071e00000000081e00000004081e00000001091e00000002091e00000003091e000000");
    const PixelFont$black$68 = VoxBox$parse$("00021e00000001021e00000002021e00000003021e00000000031e00000004031e00000000041e00000004041e00000000051e00000004051e00000000061e00000004061e00000000071e00000004071e00000000081e00000004081e00000000091e00000001091e00000002091e00000003091e000000");
    const PixelFont$black$69 = VoxBox$parse$("00021e00000001021e00000002021e00000003021e00000004021e00000000031e00000000041e00000000051e00000001051e00000002051e00000003051e00000004051e00000000061e00000000071e00000000081e00000000091e00000001091e00000002091e00000003091e00000004091e000000");
    const PixelFont$black$70 = VoxBox$parse$("00021e00000001021e00000002021e00000003021e00000004021e00000000031e00000000041e00000000051e00000001051e00000002051e00000003051e00000000061e00000000071e00000000081e00000000091e000000");
    const PixelFont$black$71 = VoxBox$parse$("01021e00000002021e00000003021e00000000031e00000004031e00000000041e00000000051e00000000061e00000000071e00000003071e00000004071e00000000081e00000004081e00000001091e00000002091e00000003091e000000");
    const PixelFont$black$72 = VoxBox$parse$("00021e00000004021e00000000031e00000004031e00000000041e00000004041e00000000051e00000001051e00000002051e00000003051e00000004051e00000000061e00000004061e00000000071e00000004071e00000000081e00000004081e00000000091e00000004091e000000");
    const PixelFont$black$73 = VoxBox$parse$("01021e00000002021e00000003021e00000002031e00000002041e00000002051e00000002061e00000002071e00000002081e00000001091e00000002091e00000003091e000000");
    const PixelFont$black$74 = VoxBox$parse$("04021e00000004031e00000004041e00000004051e00000004061e00000004071e00000000081e00000004081e00000001091e00000002091e00000003091e000000");
    const PixelFont$black$75 = VoxBox$parse$("00021e00000004021e00000000031e00000003031e00000000041e00000002041e00000000051e00000001051e00000000061e00000002061e00000000071e00000003071e00000000081e00000004081e00000000091e00000004091e000000");
    const PixelFont$black$76 = VoxBox$parse$("00021e00000000031e00000000041e00000000051e00000000061e00000000071e00000000081e00000000091e00000001091e00000002091e00000003091e00000004091e000000");
    const PixelFont$black$77 = VoxBox$parse$("00021e00000004021e00000000031e00000001031e00000003031e00000004031e00000000041e00000002041e00000004041e00000000051e00000004051e00000000061e00000004061e00000000071e00000004071e00000000081e00000004081e00000000091e00000004091e000000");
    const PixelFont$black$78 = VoxBox$parse$("00021e00000004021e00000000031e00000001031e00000004031e00000000041e00000002041e00000004041e00000000051e00000003051e00000004051e00000000061e00000004061e00000000071e00000004071e00000000081e00000004081e00000000091e00000004091e000000");
    const PixelFont$black$79 = VoxBox$parse$("01021e00000002021e00000003021e00000000031e00000004031e00000000041e00000004041e00000000051e00000004051e00000000061e00000004061e00000000071e00000004071e00000000081e00000004081e00000001091e00000002091e00000003091e000000");
    const PixelFont$black$80 = VoxBox$parse$("00021e00000001021e00000002021e00000003021e00000000031e00000004031e00000000041e00000004041e00000000051e00000004051e00000000061e00000001061e00000002061e00000003061e00000000071e00000000081e00000000091e000000");
    const PixelFont$black$81 = VoxBox$parse$("01021e00000002021e00000003021e00000000031e00000004031e00000000041e00000004041e00000000051e00000004051e00000000061e00000004061e00000000071e00000004071e00000000081e00000004081e00000001091e00000002091e00000003091e000000030a1e000000040a1e000000");
    const PixelFont$black$82 = VoxBox$parse$("00021e00000001021e00000002021e00000003021e00000000031e00000004031e00000000041e00000004041e00000000051e00000004051e00000000061e00000001061e00000002061e00000003061e00000000071e00000004071e00000000081e00000004081e00000000091e00000004091e000000");
    const PixelFont$black$83 = VoxBox$parse$("01021e00000002021e00000003021e00000000031e00000004031e00000000041e00000001051e00000002051e00000003061e00000004071e00000000081e00000004081e00000001091e00000002091e00000003091e000000");
    const PixelFont$black$84 = VoxBox$parse$("00021e00000001021e00000002021e00000003021e00000004021e00000002031e00000002041e00000002051e00000002061e00000002071e00000002081e00000002091e000000");
    const PixelFont$black$85 = VoxBox$parse$("00021e00000004021e00000000031e00000004031e00000000041e00000004041e00000000051e00000004051e00000000061e00000004061e00000000071e00000004071e00000000081e00000004081e00000001091e00000002091e00000003091e000000");
    const PixelFont$black$86 = VoxBox$parse$("00021e00000004021e00000000031e00000004031e00000000041e00000004041e00000000051e00000004051e00000000061e00000004061e00000000071e00000004071e00000001081e00000003081e00000002091e000000");
    const PixelFont$black$87 = VoxBox$parse$("00021e00000004021e00000000031e00000004031e00000000041e00000004041e00000000051e00000004051e00000000061e00000004061e00000000071e00000002071e00000004071e00000000081e00000001081e00000003081e00000004081e00000000091e00000004091e000000");
    const PixelFont$black$88 = VoxBox$parse$("00021e00000004021e00000000031e00000004031e00000001041e00000003041e00000002051e00000002061e00000001071e00000003071e00000000081e00000004081e00000000091e00000004091e000000");
    const PixelFont$black$89 = VoxBox$parse$("00021e00000004021e00000000031e00000004031e00000000041e00000004041e00000001051e00000003051e00000002061e00000002071e00000002081e00000002091e000000");
    const PixelFont$black$90 = VoxBox$parse$("00021e00000001021e00000002021e00000003021e00000004021e00000004031e00000003041e00000002051e00000001061e00000001071e00000000081e00000000091e00000001091e00000002091e00000003091e00000004091e000000");
    const PixelFont$black$91 = VoxBox$parse$("01021e00000002021e00000003021e00000001031e00000001041e00000001051e00000001061e00000001071e00000001081e00000001091e00000002091e00000003091e000000");
    const PixelFont$black$92 = VoxBox$parse$("00021e00000001031e00000001041e00000002051e00000002061e00000003071e00000003081e00000004091e000000");
    const PixelFont$black$93 = VoxBox$parse$("01021e00000002021e00000003021e00000003031e00000003041e00000003051e00000003061e00000003071e00000003081e00000001091e00000002091e00000003091e000000");
    const PixelFont$black$94 = VoxBox$parse$("02011e00000001021e00000003021e00000000031e00000004031e000000");
    const PixelFont$black$95 = VoxBox$parse$("00091e00000001091e00000002091e00000003091e00000004091e000000");
    const PixelFont$black$96 = VoxBox$parse$("01011e00000002021e00000003031e000000");
    const PixelFont$black$97 = VoxBox$parse$("01041e00000002041e00000003041e00000004051e00000001061e00000002061e00000003061e00000004061e00000000071e00000004071e00000000081e00000004081e00000001091e00000002091e00000003091e00000004091e000000");
    const PixelFont$black$98 = VoxBox$parse$("00021e00000000031e00000000041e00000001041e00000002041e00000003041e00000000051e00000004051e00000000061e00000004061e00000000071e00000004071e00000000081e00000004081e00000000091e00000001091e00000002091e00000003091e000000");
    const PixelFont$black$99 = VoxBox$parse$("01041e00000002041e00000003041e00000000051e00000004051e00000000061e00000000071e00000000081e00000004081e00000001091e00000002091e00000003091e000000");
    const PixelFont$black$darkness = VoxBox$parse$("01041e4a2b7102041e2c333d03041e4a2b7100051e4a2b7101051e6a3a8602051e353b4803051e6a3a8604051e4a2b7100061e2c333d01061e353b4802061e2c333d03061e353b4804061e2c333d00071e4a2b7101071e6a3a8602071e353b4803071e6a3a8604071e4a2b7101081e4a2b7102081e2c333d03081e4a2b71");
    const PixelFont$black$earth = VoxBox$parse$("00041e5f353801041e5f353802041e5f353803041e5f353804041e5f353800051e5f353801051e9f5b4402051e9f5b4403051e9f5b4404051e5f353800061e4b2a3501061e884e3f02061e884e3f03061e884e3f04061e4b2a3501071e4b2a3502071e6f403b03071e4b2a3501081e4b2a3502081e4b2a3503081e4b2a35");
    const PixelFont$black = (() => {
        var _map$1 = Map$new;
        var _map$2 = PixelFont$set_img$(100, PixelFont$black$100, _map$1);
        var _map$3 = PixelFont$set_img$(101, PixelFont$black$101, _map$2);
        var _map$4 = PixelFont$set_img$(102, PixelFont$black$102, _map$3);
        var _map$5 = PixelFont$set_img$(103, PixelFont$black$103, _map$4);
        var _map$6 = PixelFont$set_img$(104, PixelFont$black$104, _map$5);
        var _map$7 = PixelFont$set_img$(105, PixelFont$black$105, _map$6);
        var _map$8 = PixelFont$set_img$(106, PixelFont$black$106, _map$7);
        var _map$9 = PixelFont$set_img$(107, PixelFont$black$107, _map$8);
        var _map$10 = PixelFont$set_img$(108, PixelFont$black$108, _map$9);
        var _map$11 = PixelFont$set_img$(109, PixelFont$black$109, _map$10);
        var _map$12 = PixelFont$set_img$(110, PixelFont$black$110, _map$11);
        var _map$13 = PixelFont$set_img$(111, PixelFont$black$111, _map$12);
        var _map$14 = PixelFont$set_img$(112, PixelFont$black$112, _map$13);
        var _map$15 = PixelFont$set_img$(113, PixelFont$black$113, _map$14);
        var _map$16 = PixelFont$set_img$(114, PixelFont$black$114, _map$15);
        var _map$17 = PixelFont$set_img$(115, PixelFont$black$115, _map$16);
        var _map$18 = PixelFont$set_img$(116, PixelFont$black$116, _map$17);
        var _map$19 = PixelFont$set_img$(117, PixelFont$black$117, _map$18);
        var _map$20 = PixelFont$set_img$(118, PixelFont$black$118, _map$19);
        var _map$21 = PixelFont$set_img$(119, PixelFont$black$119, _map$20);
        var _map$22 = PixelFont$set_img$(120, PixelFont$black$120, _map$21);
        var _map$23 = PixelFont$set_img$(121, PixelFont$black$121, _map$22);
        var _map$24 = PixelFont$set_img$(122, PixelFont$black$122, _map$23);
        var _map$25 = PixelFont$set_img$(123, PixelFont$black$123, _map$24);
        var _map$26 = PixelFont$set_img$(124, PixelFont$black$124, _map$25);
        var _map$27 = PixelFont$set_img$(125, PixelFont$black$125, _map$26);
        var _map$28 = PixelFont$set_img$(126, PixelFont$black$126, _map$27);
        var _map$29 = PixelFont$set_img$(32, PixelFont$black$32, _map$28);
        var _map$30 = PixelFont$set_img$(33, PixelFont$black$33, _map$29);
        var _map$31 = PixelFont$set_img$(34, PixelFont$black$34, _map$30);
        var _map$32 = PixelFont$set_img$(35, PixelFont$black$35, _map$31);
        var _map$33 = PixelFont$set_img$(36, PixelFont$black$36, _map$32);
        var _map$34 = PixelFont$set_img$(37, PixelFont$black$37, _map$33);
        var _map$35 = PixelFont$set_img$(38, PixelFont$black$38, _map$34);
        var _map$36 = PixelFont$set_img$(39, PixelFont$black$39, _map$35);
        var _map$37 = PixelFont$set_img$(40, PixelFont$black$40, _map$36);
        var _map$38 = PixelFont$set_img$(41, PixelFont$black$41, _map$37);
        var _map$39 = PixelFont$set_img$(42, PixelFont$black$42, _map$38);
        var _map$40 = PixelFont$set_img$(43, PixelFont$black$43, _map$39);
        var _map$41 = PixelFont$set_img$(44, PixelFont$black$44, _map$40);
        var _map$42 = PixelFont$set_img$(45, PixelFont$black$45, _map$41);
        var _map$43 = PixelFont$set_img$(46, PixelFont$black$46, _map$42);
        var _map$44 = PixelFont$set_img$(47, PixelFont$black$47, _map$43);
        var _map$45 = PixelFont$set_img$(48, PixelFont$black$48, _map$44);
        var _map$46 = PixelFont$set_img$(49, PixelFont$black$49, _map$45);
        var _map$47 = PixelFont$set_img$(50, PixelFont$black$50, _map$46);
        var _map$48 = PixelFont$set_img$(51, PixelFont$black$51, _map$47);
        var _map$49 = PixelFont$set_img$(52, PixelFont$black$52, _map$48);
        var _map$50 = PixelFont$set_img$(53, PixelFont$black$53, _map$49);
        var _map$51 = PixelFont$set_img$(54, PixelFont$black$54, _map$50);
        var _map$52 = PixelFont$set_img$(55, PixelFont$black$55, _map$51);
        var _map$53 = PixelFont$set_img$(56, PixelFont$black$56, _map$52);
        var _map$54 = PixelFont$set_img$(57, PixelFont$black$57, _map$53);
        var _map$55 = PixelFont$set_img$(58, PixelFont$black$58, _map$54);
        var _map$56 = PixelFont$set_img$(59, PixelFont$black$59, _map$55);
        var _map$57 = PixelFont$set_img$(60, PixelFont$black$60, _map$56);
        var _map$58 = PixelFont$set_img$(61, PixelFont$black$61, _map$57);
        var _map$59 = PixelFont$set_img$(62, PixelFont$black$62, _map$58);
        var _map$60 = PixelFont$set_img$(63, PixelFont$black$63, _map$59);
        var _map$61 = PixelFont$set_img$(64, PixelFont$black$64, _map$60);
        var _map$62 = PixelFont$set_img$(65, PixelFont$black$65, _map$61);
        var _map$63 = PixelFont$set_img$(66, PixelFont$black$66, _map$62);
        var _map$64 = PixelFont$set_img$(67, PixelFont$black$67, _map$63);
        var _map$65 = PixelFont$set_img$(68, PixelFont$black$68, _map$64);
        var _map$66 = PixelFont$set_img$(69, PixelFont$black$69, _map$65);
        var _map$67 = PixelFont$set_img$(70, PixelFont$black$70, _map$66);
        var _map$68 = PixelFont$set_img$(71, PixelFont$black$71, _map$67);
        var _map$69 = PixelFont$set_img$(72, PixelFont$black$72, _map$68);
        var _map$70 = PixelFont$set_img$(73, PixelFont$black$73, _map$69);
        var _map$71 = PixelFont$set_img$(74, PixelFont$black$74, _map$70);
        var _map$72 = PixelFont$set_img$(75, PixelFont$black$75, _map$71);
        var _map$73 = PixelFont$set_img$(76, PixelFont$black$76, _map$72);
        var _map$74 = PixelFont$set_img$(77, PixelFont$black$77, _map$73);
        var _map$75 = PixelFont$set_img$(78, PixelFont$black$78, _map$74);
        var _map$76 = PixelFont$set_img$(79, PixelFont$black$79, _map$75);
        var _map$77 = PixelFont$set_img$(80, PixelFont$black$80, _map$76);
        var _map$78 = PixelFont$set_img$(81, PixelFont$black$81, _map$77);
        var _map$79 = PixelFont$set_img$(82, PixelFont$black$82, _map$78);
        var _map$80 = PixelFont$set_img$(83, PixelFont$black$83, _map$79);
        var _map$81 = PixelFont$set_img$(84, PixelFont$black$84, _map$80);
        var _map$82 = PixelFont$set_img$(85, PixelFont$black$85, _map$81);
        var _map$83 = PixelFont$set_img$(86, PixelFont$black$86, _map$82);
        var _map$84 = PixelFont$set_img$(87, PixelFont$black$87, _map$83);
        var _map$85 = PixelFont$set_img$(88, PixelFont$black$88, _map$84);
        var _map$86 = PixelFont$set_img$(89, PixelFont$black$89, _map$85);
        var _map$87 = PixelFont$set_img$(90, PixelFont$black$90, _map$86);
        var _map$88 = PixelFont$set_img$(91, PixelFont$black$91, _map$87);
        var _map$89 = PixelFont$set_img$(92, PixelFont$black$92, _map$88);
        var _map$90 = PixelFont$set_img$(93, PixelFont$black$93, _map$89);
        var _map$91 = PixelFont$set_img$(94, PixelFont$black$94, _map$90);
        var _map$92 = PixelFont$set_img$(95, PixelFont$black$95, _map$91);
        var _map$93 = PixelFont$set_img$(96, PixelFont$black$96, _map$92);
        var _map$94 = PixelFont$set_img$(97, PixelFont$black$97, _map$93);
        var _map$95 = PixelFont$set_img$(98, PixelFont$black$98, _map$94);
        var _map$96 = PixelFont$set_img$(99, PixelFont$black$99, _map$95);
        var _map$97 = PixelFont$set_img$(405, PixelFont$black$darkness, _map$96);
        var _map$98 = PixelFont$set_img$(421, PixelFont$black$earth, _map$97);
        var $1981 = _map$98;
        return $1981;
    })();

    function App$KL$Game$Stage$Board$draw$pick_letter$(_tile_coord$1, _casts$2, _img$3) {
        var self = _casts$2;
        switch (self._) {
            case 'Maybe.some':
                var $1983 = self.value;
                var self = $1983;
                switch (self._) {
                    case 'App.KL.Game.Casts.new':
                        var $1985 = self.picks;
                        var self = Hexagonal$Axial$BBL$get$(_tile_coord$1, $1985);
                        switch (self._) {
                            case 'Maybe.some':
                                var $1987 = self.value;
                                var _screen_coord$8 = Hexagonal$Axial$to_screen_xy$(_tile_coord$1, App$KL$Constants$hexagon_radius, App$KL$Constants$center_x, App$KL$Constants$center_y);
                                var self = App$KL$Game$Stage$Board$draw$centralize_letter$(_screen_coord$8);
                                switch (self._) {
                                    case 'Pair.new':
                                        var $1989 = self.fst;
                                        var $1990 = self.snd;
                                        var $1991 = VoxBox$Draw$text$($1987, PixelFont$black, ((0 | $1989 | ($1990 << 12) | (0 << 24))), _img$3);
                                        var $1988 = $1991;
                                        break;
                                };
                                var $1986 = $1988;
                                break;
                            case 'Maybe.none':
                                var $1992 = _img$3;
                                var $1986 = $1992;
                                break;
                        };
                        var $1984 = $1986;
                        break;
                };
                var $1982 = $1984;
                break;
            case 'Maybe.none':
                var $1993 = _img$3;
                var $1982 = $1993;
                break;
        };
        return $1982;
    };
    const App$KL$Game$Stage$Board$draw$pick_letter = x0 => x1 => x2 => App$KL$Game$Stage$Board$draw$pick_letter$(x0, x1, x2);

    function App$KL$Game$Stage$Board$draw$tile$terrain$(_terrain$1, _casts$2, _tile_coord$3, _mouse_coord$4, _img$5) {
        var _indicator$6 = App$KL$Game$Stage$Board$draw$get_indicator$(_tile_coord$3, _mouse_coord$4, _casts$2);
        var self = App$KL$Game$Stage$Board$draw$centralize$(_tile_coord$3);
        switch (self._) {
            case 'Pair.new':
                var $1995 = self.fst;
                var $1996 = self.snd;
                var _field$9 = App$KL$Game$Field$get_by_id$default$((() => {
                    var self = _terrain$1;
                    switch (self._) {
                        case 'App.KL.Game.Terrain.new':
                            var $1998 = self.field_id;
                            var $1999 = $1998;
                            return $1999;
                    };
                })());
                var self = _field$9;
                switch (self._) {
                    case 'App.KL.Game.Field.new':
                        var $2000 = self.draw;
                        var $2001 = $2000;
                        var _field_drawing$10 = $2001;
                        break;
                };
                var _field_drawing$10 = _field_drawing$10(_terrain$1)(_indicator$6);
                var _tile_drawing$11 = VoxBox$Draw$image$($1995, $1996, 0, _field_drawing$10, _img$5);
                var _tile_drawing$12 = App$KL$Game$Stage$Board$draw$pick_letter$(_tile_coord$3, _casts$2, _tile_drawing$11);
                var $1997 = _tile_drawing$12;
                var $1994 = $1997;
                break;
        };
        return $1994;
    };
    const App$KL$Game$Stage$Board$draw$tile$terrain = x0 => x1 => x2 => x3 => x4 => App$KL$Game$Stage$Board$draw$tile$terrain$(x0, x1, x2, x3, x4);

    function App$KL$Game$Stage$Board$draw$hero$(_cx$1, _cy$2, _z$3, _creature$4, _img$5) {
        var self = _creature$4;
        switch (self._) {
            case 'App.KL.Game.Creature.new':
                var $2003 = self.hero;
                var $2004 = $2003;
                var _hero$6 = $2004;
                break;
        };
        var self = _hero$6;
        switch (self._) {
            case 'App.KL.Game.Hero.new':
                var $2005 = self.draw;
                var $2006 = $2005;
                var _drawing$7 = $2006;
                break;
        };
        var _drawing$7 = _drawing$7(_creature$4);
        var _aux$8 = I32$to_u32$(App$KL$Constants$hexagon_radius);
        var _cy$9 = ((_cy$2 - ((_aux$8 * 2) >>> 0)) >>> 0);
        var _cx$10 = ((_cx$1 - _aux$8) >>> 0);
        var $2002 = VoxBox$Draw$image$(_cx$10, _cy$9, 0, _drawing$7, _img$5);
        return $2002;
    };
    const App$KL$Game$Stage$Board$draw$hero = x0 => x1 => x2 => x3 => x4 => App$KL$Game$Stage$Board$draw$hero$(x0, x1, x2, x3, x4);

    function App$KL$Game$Stage$Board$draw$tile$creature$(_creature$1, _coord$2, _img$3) {
        var self = _creature$1;
        switch (self._) {
            case 'Maybe.some':
                var $2008 = self.value;
                var self = Hexagonal$Axial$to_screen_xy$(_coord$2, App$KL$Constants$hexagon_radius, App$KL$Constants$center_x, App$KL$Constants$center_y);
                switch (self._) {
                    case 'Pair.new':
                        var $2010 = self.fst;
                        var $2011 = self.snd;
                        var _img$7 = App$KL$Game$Stage$Board$draw$hero$($2010, $2011, 0, $2008, _img$3);
                        var $2012 = _img$7;
                        var $2009 = $2012;
                        break;
                };
                var $2007 = $2009;
                break;
            case 'Maybe.none':
                var $2013 = _img$3;
                var $2007 = $2013;
                break;
        };
        return $2007;
    };
    const App$KL$Game$Stage$Board$draw$tile$creature = x0 => x1 => x2 => App$KL$Game$Stage$Board$draw$tile$creature$(x0, x1, x2);

    function App$KL$Game$Stage$Board$draw$board$(_map$1, _casts$2, _mouse$3, _img$4) {
        var _map$5 = Hexagonal$Axial$BBL$to_list$(_map$1);
        var _mouse_coord$6 = Hexagonal$Axial$from_screen_xy$(_mouse$3, App$KL$Constants$hexagon_radius, App$KL$Constants$center_x, App$KL$Constants$center_y);
        var _img$7 = (() => {
            var $2016 = _img$4;
            var $2017 = _map$5;
            let _img$8 = $2016;
            let _pos$7;
            while ($2017._ === 'List.cons') {
                _pos$7 = $2017.head;
                var self = _pos$7;
                switch (self._) {
                    case 'Pair.new':
                        var $2018 = self.fst;
                        var $2019 = self.snd;
                        var _img$11 = App$KL$Game$Stage$Board$draw$tile$terrain$((() => {
                            var self = $2019;
                            switch (self._) {
                                case 'App.KL.Game.Tile.new':
                                    var $2021 = self.terrain;
                                    var $2022 = $2021;
                                    return $2022;
                            };
                        })(), _casts$2, $2018, _mouse_coord$6, _img$8);
                        var _img$12 = App$KL$Game$Stage$Board$draw$tile$creature$((() => {
                            var self = $2019;
                            switch (self._) {
                                case 'App.KL.Game.Tile.new':
                                    var $2023 = self.creature;
                                    var $2024 = $2023;
                                    return $2024;
                            };
                        })(), $2018, _img$11);
                        var $2020 = _img$12;
                        var $2016 = $2020;
                        break;
                };
                _img$8 = $2016;
                $2017 = $2017.tail;
            }
            return _img$8;
        })();
        var $2014 = _img$7;
        return $2014;
    };
    const App$KL$Game$Stage$Board$draw$board = x0 => x1 => x2 => x3 => App$KL$Game$Stage$Board$draw$board$(x0, x1, x2, x3);
    const Hexagonal$Axial$BBL = null;
    const Debug$log = a0 => a1 => ((console.log(a0), a1()));

    function Word$show$(_size$1, _a$2) {
        var _n$3 = Word$to_nat$(_a$2);
        var $2025 = (Nat$show$(_n$3) + ("#" + Nat$show$(_size$1)));
        return $2025;
    };
    const Word$show = x0 => x1 => Word$show$(x0, x1);
    const U32$show = a0 => (a0 + "#32");
    const App$Kaelin$Assets$tile$mouse_ui = VoxBox$parse$("0d0302ffffff0e0302ffffff0f0302ffffff100302ffffff110302ffffff0b0402ffffff0c0402ffffff0d0402ffffff0e0402ffffff0f0402ffffff100402ffffff110402ffffff120402ffffff130402ffffff0b0502ffffff0c0502ffffff0d0502ffffff110502ffffff120502ffffff130502ffffff040702ffffff050702ffffff060702ffffff180702ffffff190702ffffff1a0702ffffff030802ffffff040802ffffff050802ffffff060802ffffff180802ffffff190802ffffff1a0802ffffff1b0802ffffff020902ffffff030902ffffff040902ffffff1a0902ffffff1b0902ffffff1c0902ffffff020a02ffffff030a02ffffff1b0a02ffffff1c0a02ffffff020b02ffffff030b02ffffff1b0b02ffffff1c0b02ffffff021302ffffff031302ffffff1b1302ffffff1c1302ffffff021402ffffff031402ffffff1b1402ffffff1c1402ffffff021502ffffff031502ffffff041502ffffff1a1502ffffff1b1502ffffff1c1502ffffff031602ffffff041602ffffff051602ffffff061602ffffff181602ffffff191602ffffff1a1602ffffff1b1602ffffff041702ffffff051702ffffff061702ffffff181702ffffff191702ffffff1a1702ffffff0b1902ffffff0c1902ffffff0d1902ffffff111902ffffff121902ffffff131902ffffff0b1a02ffffff0c1a02ffffff0d1a02ffffff0e1a02ffffff0f1a02ffffff101a02ffffff111a02ffffff121a02ffffff131a02ffffff0d1b02ffffff0e1b02ffffff0f1b02ffffff101b02ffffff111b02ffffff");

    function App$KL$Game$Stage$Board$draw$mouse_ui$(_mouse$1, _img$2) {
        var _coord$3 = Hexagonal$Axial$from_screen_xy$(_mouse$1, App$KL$Constants$hexagon_radius, App$KL$Constants$center_x, App$KL$Constants$center_y);
        var self = App$KL$Game$Stage$Board$draw$centralize$(_coord$3);
        switch (self._) {
            case 'Pair.new':
                var $2027 = self.fst;
                var $2028 = self.snd;
                var $2029 = ((console.log((($2027 + "#32") + (" - " + ($2027 + "#32")))), (_$6 => {
                    var $2030 = VoxBox$Draw$image$($2027, $2028, 0, App$Kaelin$Assets$tile$mouse_ui, _img$2);
                    return $2030;
                })()));
                var $2026 = $2029;
                break;
        };
        return $2026;
    };
    const App$KL$Game$Stage$Board$draw$mouse_ui = x0 => x1 => App$KL$Game$Stage$Board$draw$mouse_ui$(x0, x1);

    function App$KL$Game$Stage$Board$draw$canvas$(_img$1, _local$2, _game$3) {
        var _img$4 = App$KL$Game$Stage$Board$draw$board$((() => {
            var self = _game$3;
            switch (self._) {
                case 'App.KL.Game.new':
                    var $2032 = self.board;
                    var $2033 = $2032;
                    return $2033;
            };
        })(), (() => {
            var self = _local$2;
            switch (self._) {
                case 'App.KL.Game.State.Local.new':
                    var $2034 = self.casts;
                    var $2035 = $2034;
                    return $2035;
            };
        })(), (() => {
            var self = _local$2;
            switch (self._) {
                case 'App.KL.Game.State.Local.new':
                    var $2036 = self.mouse;
                    var $2037 = $2036;
                    return $2037;
            };
        })(), _img$1);
        var _img$5 = App$KL$Game$Stage$Board$draw$mouse_ui$((() => {
            var self = _local$2;
            switch (self._) {
                case 'App.KL.Game.State.Local.new':
                    var $2038 = self.mouse;
                    var $2039 = $2038;
                    return $2039;
            };
        })(), _img$4);
        var $2031 = _img$5;
        return $2031;
    };
    const App$KL$Game$Stage$Board$draw$canvas = x0 => x1 => x2 => App$KL$Game$Stage$Board$draw$canvas$(x0, x1, x2);

    function App$KL$Game$Stage$Board$draw$(_img$1, _local$2, _game$3) {
        var $2040 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("width", "100vw"), List$cons$(Pair$new$("height", "100vh"), List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("flex-direction", "column"), List$cons$(Pair$new$("justify-content", "center"), List$cons$(Pair$new$("align-items", "center"), List$cons$(Pair$new$("position", "relative"), List$nil)))))))), List$cons$(DOM$node$("div", Map$from_list$(List$nil), Map$new, List$cons$((() => {
            var _width$4 = Nat$show$(I32$to_nat$(((App$KL$Constants$center_x * 2) >> 0)));
            var _height$5 = Nat$show$(I32$to_nat$(((App$KL$Constants$center_y * 2) >> 0)));
            var $2041 = DOM$vbox$(Map$from_list$(List$cons$(Pair$new$("width", _width$4), List$cons$(Pair$new$("height", _height$5), List$cons$(Pair$new$("scale", "2"), List$nil)))), Map$from_list$(List$nil), App$KL$Game$Stage$Board$draw$canvas$(_img$1, _local$2, _game$3));
            return $2041;
        })(), List$nil)), List$nil));
        return $2040;
    };
    const App$KL$Game$Stage$Board$draw = x0 => x1 => x2 => App$KL$Game$Stage$Board$draw$(x0, x1, x2);

    function App$KL$Game$draw$(_img$1, _local$2, _global$3) {
        var $2042 = DOM$node$("div", Map$from_list$(List$nil), Map$new, List$cons$((() => {
            var self = _global$3;
            switch (self._) {
                case 'App.KL.Global.State.new':
                    var $2044 = self.game;
                    var $2045 = $2044;
                    var _game$4 = $2045;
                    break;
            };
            var self = _game$4;
            switch (self._) {
                case 'Maybe.some':
                    var $2046 = self.value;
                    var $2047 = DOM$node$("div", Map$from_list$(List$nil), Map$new, List$cons$((() => {
                        var self = $2046;
                        switch (self._) {
                            case 'App.KL.Game.new':
                                var $2049 = self.stage;
                                var $2050 = $2049;
                                var _stage$6 = $2050;
                                break;
                        };
                        var self = _stage$6;
                        switch (self._) {
                            case 'App.KL.Game.Stage.draft':
                                var $2051 = App$KL$Game$Stage$Draft$draw$(_local$2, _global$3);
                                var $2048 = $2051;
                                break;
                            case 'App.KL.Game.Stage.board':
                                var $2052 = App$KL$Game$Stage$Board$draw$(_img$1, _local$2, $2046);
                                var $2048 = $2052;
                                break;
                        };
                        return $2048;
                    })(), List$nil));
                    var $2043 = $2047;
                    break;
                case 'Maybe.none':
                    var $2053 = DOM$node$("div", Map$from_list$(List$nil), Map$new, List$cons$(DOM$text$("Not ingame."), List$nil));
                    var $2043 = $2053;
                    break;
            };
            return $2043;
        })(), List$nil));
        return $2042;
    };
    const App$KL$Game$draw = x0 => x1 => x2 => App$KL$Game$draw$(x0, x1, x2);

    function App$KL$draw$(_img$1, _state$2) {
        var self = _state$2;
        switch (self._) {
            case 'App.Store.new':
                var $2055 = self.local;
                var $2056 = self.global;
                var self = $2055;
                switch (self._) {
                    case 'App.KL.State.Local.lobby':
                        var $2058 = self.state;
                        var $2059 = App$KL$Lobby$draw$($2058, $2056);
                        var $2057 = $2059;
                        break;
                    case 'App.KL.State.Local.game':
                        var $2060 = self.state;
                        var $2061 = App$KL$Game$draw$(_img$1, $2060, $2056);
                        var $2057 = $2061;
                        break;
                };
                var $2054 = $2057;
                break;
        };
        return $2054;
    };
    const App$KL$draw = x0 => x1 => App$KL$draw$(x0, x1);

    function IO$(_A$1) {
        var $2062 = null;
        return $2062;
    };
    const IO = x0 => IO$(x0);
    const App$State$local = Pair$fst;

    function String$map$(_f$1, _as$2) {
        var self = _as$2;
        if (self.length === 0) {
            var $2064 = String$nil;
            var $2063 = $2064;
        } else {
            var $2065 = self.charCodeAt(0);
            var $2066 = self.slice(1);
            var $2067 = String$cons$(_f$1($2065), String$map$(_f$1, $2066));
            var $2063 = $2067;
        };
        return $2063;
    };
    const String$map = x0 => x1 => String$map$(x0, x1);
    const U16$gte = a0 => a1 => (a0 >= a1);
    const U16$lte = a0 => a1 => (a0 <= a1);
    const U16$add = a0 => a1 => ((a0 + a1) & 0xFFFF);

    function Char$to_lower$(_char$1) {
        var self = ((_char$1 >= 65) && (_char$1 <= 90));
        if (self) {
            var $2069 = ((_char$1 + 32) & 0xFFFF);
            var $2068 = $2069;
        } else {
            var $2070 = _char$1;
            var $2068 = $2070;
        };
        return $2068;
    };
    const Char$to_lower = x0 => Char$to_lower$(x0);

    function String$to_lower$(_str$1) {
        var $2071 = String$map$(Char$to_lower, _str$1);
        return $2071;
    };
    const String$to_lower = x0 => String$to_lower$(x0);

    function IO$ask$(_query$2, _param$3, _then$4) {
        var $2072 = ({
            _: 'IO.ask',
            'query': _query$2,
            'param': _param$3,
            'then': _then$4
        });
        return $2072;
    };
    const IO$ask = x0 => x1 => x2 => IO$ask$(x0, x1, x2);

    function IO$bind$(_a$3, _f$4) {
        var self = _a$3;
        switch (self._) {
            case 'IO.end':
                var $2074 = self.value;
                var $2075 = _f$4($2074);
                var $2073 = $2075;
                break;
            case 'IO.ask':
                var $2076 = self.query;
                var $2077 = self.param;
                var $2078 = self.then;
                var $2079 = IO$ask$($2076, $2077, (_x$8 => {
                    var $2080 = IO$bind$($2078(_x$8), _f$4);
                    return $2080;
                }));
                var $2073 = $2079;
                break;
        };
        return $2073;
    };
    const IO$bind = x0 => x1 => IO$bind$(x0, x1);

    function IO$end$(_value$2) {
        var $2081 = ({
            _: 'IO.end',
            'value': _value$2
        });
        return $2081;
    };
    const IO$end = x0 => IO$end$(x0);

    function IO$monad$(_new$2) {
        var $2082 = _new$2(IO$bind)(IO$end);
        return $2082;
    };
    const IO$monad = x0 => IO$monad$(x0);

    function App$set_local$(_value$2) {
        var $2083 = IO$monad$((_m$bind$3 => _m$pure$4 => {
            var $2084 = _m$pure$4;
            return $2084;
        }))(Maybe$some$(_value$2));
        return $2083;
    };
    const App$set_local = x0 => App$set_local$(x0);
    const App$pass = IO$monad$((_m$bind$2 => _m$pure$3 => {
        var $2085 = _m$pure$3;
        return $2085;
    }))(Maybe$none);
    const Nat$read = a0 => (BigInt(a0));
    const IO$get_time = IO$ask$("get_time", "", (_time$1 => {
        var $2086 = IO$end$((BigInt(_time$1)));
        return $2086;
    }));

    function Nat$random$(_seed$1) {
        var _m$2 = 1664525n;
        var _i$3 = 1013904223n;
        var _q$4 = 4294967296n;
        var $2087 = (((_seed$1 * _m$2) + _i$3) % _q$4);
        return $2087;
    };
    const Nat$random = x0 => Nat$random$(x0);

    function IO$random$(_a$1) {
        var $2088 = IO$monad$((_m$bind$2 => _m$pure$3 => {
            var $2089 = _m$bind$2;
            return $2089;
        }))(IO$get_time)((_seed$2 => {
            var _seed$3 = Nat$random$(_seed$2);
            var $2090 = IO$monad$((_m$bind$4 => _m$pure$5 => {
                var $2091 = _m$pure$5;
                return $2091;
            }))((_seed$3 % _a$1));
            return $2090;
        }));
        return $2088;
    };
    const IO$random = x0 => IO$random$(x0);

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
                    var $2092 = _xs$2;
                    return $2092;
                } else {
                    var $2093 = (self - 1n);
                    var self = _xs$2;
                    if (self.length === 0) {
                        var $2095 = String$nil;
                        var $2094 = $2095;
                    } else {
                        var $2096 = self.charCodeAt(0);
                        var $2097 = self.slice(1);
                        var $2098 = String$drop$($2093, $2097);
                        var $2094 = $2098;
                    };
                    return $2094;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const String$drop = x0 => x1 => String$drop$(x0, x1);

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
                    var $2099 = _n$2;
                    return $2099;
                } else {
                    var $2100 = self.charCodeAt(0);
                    var $2101 = self.slice(1);
                    var $2102 = String$length$go$($2101, Nat$succ$(_n$2));
                    return $2102;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const String$length$go = x0 => x1 => String$length$go$(x0, x1);

    function String$length$(_xs$1) {
        var $2103 = String$length$go$(_xs$1, 0n);
        return $2103;
    };
    const String$length = x0 => String$length$(x0);

    function IO$do$(_call$1, _param$2) {
        var $2104 = IO$ask$(_call$1, _param$2, (_answer$3 => {
            var $2105 = IO$end$(Unit$new);
            return $2105;
        }));
        return $2104;
    };
    const IO$do = x0 => x1 => IO$do$(x0, x1);

    function App$do$(_call$2, _param$3) {
        var $2106 = IO$monad$((_m$bind$4 => _m$pure$5 => {
            var $2107 = _m$bind$4;
            return $2107;
        }))(IO$do$(_call$2, _param$3))((_$4 => {
            var $2108 = App$pass;
            return $2108;
        }));
        return $2106;
    };
    const App$do = x0 => x1 => App$do$(x0, x1);

    function App$watch$(_room$2) {
        var $2109 = App$do$("watch", _room$2);
        return $2109;
    };
    const App$watch = x0 => App$watch$(x0);

    function App$new_post$(_room$2, _data$3) {
        var $2110 = IO$monad$((_m$bind$4 => _m$pure$5 => {
            var $2111 = _m$bind$4;
            return $2111;
        }))(App$do$("post", (_room$2 + (";" + _data$3))))((_$4 => {
            var $2112 = App$pass;
            return $2112;
        }));
        return $2110;
    };
    const App$new_post = x0 => x1 => App$new_post$(x0, x1);

    function String$take$(_n$1, _xs$2) {
        var self = _xs$2;
        if (self.length === 0) {
            var $2114 = String$nil;
            var $2113 = $2114;
        } else {
            var $2115 = self.charCodeAt(0);
            var $2116 = self.slice(1);
            var self = _n$1;
            if (self === 0n) {
                var $2118 = String$nil;
                var $2117 = $2118;
            } else {
                var $2119 = (self - 1n);
                var $2120 = String$cons$($2115, String$take$($2119, $2116));
                var $2117 = $2120;
            };
            var $2113 = $2117;
        };
        return $2113;
    };
    const String$take = x0 => x1 => String$take$(x0, x1);

    function String$pad_right$(_size$1, _chr$2, _str$3) {
        var self = _size$1;
        if (self === 0n) {
            var $2122 = _str$3;
            var $2121 = $2122;
        } else {
            var $2123 = (self - 1n);
            var self = _str$3;
            if (self.length === 0) {
                var $2125 = String$cons$(_chr$2, String$pad_right$($2123, _chr$2, ""));
                var $2124 = $2125;
            } else {
                var $2126 = self.charCodeAt(0);
                var $2127 = self.slice(1);
                var $2128 = String$cons$($2126, String$pad_right$($2123, _chr$2, $2127));
                var $2124 = $2128;
            };
            var $2121 = $2124;
        };
        return $2121;
    };
    const String$pad_right = x0 => x1 => x2 => String$pad_right$(x0, x1, x2);

    function String$pad_right_exact$(_size$1, _chr$2, _str$3) {
        var $2129 = String$take$(_size$1, String$pad_right$(_size$1, _chr$2, _str$3));
        return $2129;
    };
    const String$pad_right_exact = x0 => x1 => x2 => String$pad_right_exact$(x0, x1, x2);

    function Bits$hex$encode$(_x$1) {
        var self = _x$1;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'o':
                var $2131 = self.slice(0, -1);
                var self = $2131;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'o':
                        var $2133 = self.slice(0, -1);
                        var self = $2133;
                        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                            case 'o':
                                var $2135 = self.slice(0, -1);
                                var self = $2135;
                                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                                    case 'o':
                                        var $2137 = self.slice(0, -1);
                                        var $2138 = ("0" + Bits$hex$encode$($2137));
                                        var $2136 = $2138;
                                        break;
                                    case 'i':
                                        var $2139 = self.slice(0, -1);
                                        var $2140 = ("8" + Bits$hex$encode$($2139));
                                        var $2136 = $2140;
                                        break;
                                    case 'e':
                                        var $2141 = "0";
                                        var $2136 = $2141;
                                        break;
                                };
                                var $2134 = $2136;
                                break;
                            case 'i':
                                var $2142 = self.slice(0, -1);
                                var self = $2142;
                                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                                    case 'o':
                                        var $2144 = self.slice(0, -1);
                                        var $2145 = ("4" + Bits$hex$encode$($2144));
                                        var $2143 = $2145;
                                        break;
                                    case 'i':
                                        var $2146 = self.slice(0, -1);
                                        var $2147 = ("c" + Bits$hex$encode$($2146));
                                        var $2143 = $2147;
                                        break;
                                    case 'e':
                                        var $2148 = "4";
                                        var $2143 = $2148;
                                        break;
                                };
                                var $2134 = $2143;
                                break;
                            case 'e':
                                var $2149 = "0";
                                var $2134 = $2149;
                                break;
                        };
                        var $2132 = $2134;
                        break;
                    case 'i':
                        var $2150 = self.slice(0, -1);
                        var self = $2150;
                        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                            case 'o':
                                var $2152 = self.slice(0, -1);
                                var self = $2152;
                                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                                    case 'o':
                                        var $2154 = self.slice(0, -1);
                                        var $2155 = ("2" + Bits$hex$encode$($2154));
                                        var $2153 = $2155;
                                        break;
                                    case 'i':
                                        var $2156 = self.slice(0, -1);
                                        var $2157 = ("a" + Bits$hex$encode$($2156));
                                        var $2153 = $2157;
                                        break;
                                    case 'e':
                                        var $2158 = "2";
                                        var $2153 = $2158;
                                        break;
                                };
                                var $2151 = $2153;
                                break;
                            case 'i':
                                var $2159 = self.slice(0, -1);
                                var self = $2159;
                                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                                    case 'o':
                                        var $2161 = self.slice(0, -1);
                                        var $2162 = ("6" + Bits$hex$encode$($2161));
                                        var $2160 = $2162;
                                        break;
                                    case 'i':
                                        var $2163 = self.slice(0, -1);
                                        var $2164 = ("e" + Bits$hex$encode$($2163));
                                        var $2160 = $2164;
                                        break;
                                    case 'e':
                                        var $2165 = "6";
                                        var $2160 = $2165;
                                        break;
                                };
                                var $2151 = $2160;
                                break;
                            case 'e':
                                var $2166 = "2";
                                var $2151 = $2166;
                                break;
                        };
                        var $2132 = $2151;
                        break;
                    case 'e':
                        var $2167 = "0";
                        var $2132 = $2167;
                        break;
                };
                var $2130 = $2132;
                break;
            case 'i':
                var $2168 = self.slice(0, -1);
                var self = $2168;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'o':
                        var $2170 = self.slice(0, -1);
                        var self = $2170;
                        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                            case 'o':
                                var $2172 = self.slice(0, -1);
                                var self = $2172;
                                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                                    case 'o':
                                        var $2174 = self.slice(0, -1);
                                        var $2175 = ("1" + Bits$hex$encode$($2174));
                                        var $2173 = $2175;
                                        break;
                                    case 'i':
                                        var $2176 = self.slice(0, -1);
                                        var $2177 = ("9" + Bits$hex$encode$($2176));
                                        var $2173 = $2177;
                                        break;
                                    case 'e':
                                        var $2178 = "1";
                                        var $2173 = $2178;
                                        break;
                                };
                                var $2171 = $2173;
                                break;
                            case 'i':
                                var $2179 = self.slice(0, -1);
                                var self = $2179;
                                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                                    case 'o':
                                        var $2181 = self.slice(0, -1);
                                        var $2182 = ("5" + Bits$hex$encode$($2181));
                                        var $2180 = $2182;
                                        break;
                                    case 'i':
                                        var $2183 = self.slice(0, -1);
                                        var $2184 = ("d" + Bits$hex$encode$($2183));
                                        var $2180 = $2184;
                                        break;
                                    case 'e':
                                        var $2185 = "5";
                                        var $2180 = $2185;
                                        break;
                                };
                                var $2171 = $2180;
                                break;
                            case 'e':
                                var $2186 = "1";
                                var $2171 = $2186;
                                break;
                        };
                        var $2169 = $2171;
                        break;
                    case 'i':
                        var $2187 = self.slice(0, -1);
                        var self = $2187;
                        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                            case 'o':
                                var $2189 = self.slice(0, -1);
                                var self = $2189;
                                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                                    case 'o':
                                        var $2191 = self.slice(0, -1);
                                        var $2192 = ("3" + Bits$hex$encode$($2191));
                                        var $2190 = $2192;
                                        break;
                                    case 'i':
                                        var $2193 = self.slice(0, -1);
                                        var $2194 = ("b" + Bits$hex$encode$($2193));
                                        var $2190 = $2194;
                                        break;
                                    case 'e':
                                        var $2195 = "3";
                                        var $2190 = $2195;
                                        break;
                                };
                                var $2188 = $2190;
                                break;
                            case 'i':
                                var $2196 = self.slice(0, -1);
                                var self = $2196;
                                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                                    case 'o':
                                        var $2198 = self.slice(0, -1);
                                        var $2199 = ("7" + Bits$hex$encode$($2198));
                                        var $2197 = $2199;
                                        break;
                                    case 'i':
                                        var $2200 = self.slice(0, -1);
                                        var $2201 = ("f" + Bits$hex$encode$($2200));
                                        var $2197 = $2201;
                                        break;
                                    case 'e':
                                        var $2202 = "7";
                                        var $2197 = $2202;
                                        break;
                                };
                                var $2188 = $2197;
                                break;
                            case 'e':
                                var $2203 = "3";
                                var $2188 = $2203;
                                break;
                        };
                        var $2169 = $2188;
                        break;
                    case 'e':
                        var $2204 = "1";
                        var $2169 = $2204;
                        break;
                };
                var $2130 = $2169;
                break;
            case 'e':
                var $2205 = "";
                var $2130 = $2205;
                break;
        };
        return $2130;
    };
    const Bits$hex$encode = x0 => Bits$hex$encode$(x0);

    function Serializer$run$(_serializer$2, _x$3) {
        var $2206 = _serializer$2(_x$3)(Bits$e);
        return $2206;
    };
    const Serializer$run = x0 => x1 => Serializer$run$(x0, x1);

    function App$KL$Game$Team$serializer$(_x$1, _bs$2) {
        var self = _x$1;
        switch (self._) {
            case 'App.KL.Game.Team.blue':
                var $2208 = ((_bs$2 + '0') + '0');
                var $2207 = $2208;
                break;
            case 'App.KL.Game.Team.red':
                var $2209 = ((_bs$2 + '0') + '1');
                var $2207 = $2209;
                break;
            case 'App.KL.Game.Team.neutral':
                var $2210 = ((_bs$2 + '1') + '0');
                var $2207 = $2210;
                break;
        };
        return $2207;
    };
    const App$KL$Game$Team$serializer = x0 => x1 => App$KL$Game$Team$serializer$(x0, x1);

    function Word$serializer$(_w$2, _bs$3) {
        var self = _w$2;
        switch (self._) {
            case 'Word.o':
                var $2212 = self.pred;
                var $2213 = (Word$serializer$($2212, _bs$3) + '0');
                var $2211 = $2213;
                break;
            case 'Word.i':
                var $2214 = self.pred;
                var $2215 = (Word$serializer$($2214, _bs$3) + '1');
                var $2211 = $2215;
                break;
            case 'Word.e':
                var $2216 = _bs$3;
                var $2211 = $2216;
                break;
        };
        return $2211;
    };
    const Word$serializer = x0 => x1 => Word$serializer$(x0, x1);

    function U8$serializer$(_x$1, _bs$2) {
        var self = _x$1;
        switch ('u8') {
            case 'u8':
                var $2218 = u8_to_word(self);
                var $2219 = Word$serializer$($2218, _bs$2);
                var $2217 = $2219;
                break;
        };
        return $2217;
    };
    const U8$serializer = x0 => x1 => U8$serializer$(x0, x1);

    function I32$serializer$(_x$1, _bs$2) {
        var self = _x$1;
        switch ('i32') {
            case 'i32':
                var $2221 = i32_to_word(self);
                var $2222 = Word$serializer$($2221, _bs$2);
                var $2220 = $2222;
                break;
        };
        return $2220;
    };
    const I32$serializer = x0 => x1 => I32$serializer$(x0, x1);

    function Hexagonal$Axial$serializer$(_x$1, _bs$2) {
        var self = _x$1;
        switch (self._) {
            case 'Hexagonal.Axial.new':
                var $2224 = self.i;
                var $2225 = self.j;
                var $2226 = I32$serializer$($2224, I32$serializer$($2225, _bs$2));
                var $2223 = $2226;
                break;
        };
        return $2223;
    };
    const Hexagonal$Axial$serializer = x0 => x1 => Hexagonal$Axial$serializer$(x0, x1);

    function App$KL$Global$Event$serializer$(_x$1, _bs$2) {
        var self = _x$1;
        switch (self._) {
            case 'App.KL.Global.Event.set_team':
                var $2228 = self.team;
                var $2229 = (((App$KL$Game$Team$serializer$($2228, _bs$2) + '0') + '1') + '0');
                var $2227 = $2229;
                break;
            case 'App.KL.Global.Event.set_hero':
                var $2230 = self.hero;
                var $2231 = (((U8$serializer$($2230, _bs$2) + '0') + '1') + '1');
                var $2227 = $2231;
                break;
            case 'App.KL.Global.Event.set_init_pos':
                var $2232 = self.coord;
                var $2233 = (((Hexagonal$Axial$serializer$($2232, _bs$2) + '1') + '0') + '0');
                var $2227 = $2233;
                break;
            case 'App.KL.Global.Event.set_ready':
                var $2234 = self.ready;
                var $2235 = (((U8$serializer$($2234, _bs$2) + '1') + '0') + '1');
                var $2227 = $2235;
                break;
            case 'App.KL.Global.Event.void':
                var $2236 = (((_bs$2 + '0') + '0') + '0');
                var $2227 = $2236;
                break;
            case 'App.KL.Global.Event.join_room':
                var $2237 = (((_bs$2 + '0') + '0') + '1');
                var $2227 = $2237;
                break;
        };
        return $2227;
    };
    const App$KL$Global$Event$serializer = x0 => x1 => App$KL$Global$Event$serializer$(x0, x1);

    function App$KL$Global$Event$serialize_post$(_ev$1) {
        var $2238 = ("0x" + String$pad_right_exact$(64n, 48, Bits$hex$encode$(Serializer$run$(App$KL$Global$Event$serializer, _ev$1))));
        return $2238;
    };
    const App$KL$Global$Event$serialize_post = x0 => App$KL$Global$Event$serialize_post$(x0);
    const App$KL$Global$Event$join_room = ({
        _: 'App.KL.Global.Event.join_room'
    });

    function App$KL$State$Local$game$(_state$1) {
        var $2239 = ({
            _: 'App.KL.State.Local.game',
            'state': _state$1
        });
        return $2239;
    };
    const App$KL$State$Local$game = x0 => App$KL$State$Local$game$(x0);

    function App$KL$Game$State$Local$new$(_user$1, _room$2, _casts$3, _mouse$4) {
        var $2240 = ({
            _: 'App.KL.Game.State.Local.new',
            'user': _user$1,
            'room': _room$2,
            'casts': _casts$3,
            'mouse': _mouse$4
        });
        return $2240;
    };
    const App$KL$Game$State$Local$new = x0 => x1 => x2 => x3 => App$KL$Game$State$Local$new$(x0, x1, x2, x3);

    function App$KL$Lobby$when$(_local$1, _global$2, _event$3) {
        var self = _event$3;
        switch (self._) {
            case 'App.Event.init':
                var $2242 = self.user;
                var self = _local$1;
                switch (self._) {
                    case 'App.KL.Lobby.State.Local.new':
                        var $2244 = self.room_input;
                        var $2245 = App$KL$Lobby$State$Local$new$(String$to_lower$($2242), $2244);
                        var _new_local$7 = $2245;
                        break;
                };
                var $2243 = App$set_local$(App$KL$State$Local$lobby$(_new_local$7));
                var $2241 = $2243;
                break;
            case 'App.Event.mouse_click':
                var $2246 = self.id;
                var self = ($2246 === "random");
                if (self) {
                    var $2248 = IO$monad$((_m$bind$7 => _m$pure$8 => {
                        var $2249 = _m$bind$7;
                        return $2249;
                    }))(IO$random$(10000000000n))((_rnd$7 => {
                        var _str$8 = Nat$show$(_rnd$7);
                        var _room$9 = ("0x72214422" + String$drop$((String$length$(_str$8) - 6n <= 0n ? 0n : String$length$(_str$8) - 6n), _str$8));
                        var self = _local$1;
                        switch (self._) {
                            case 'App.KL.Lobby.State.Local.new':
                                var $2251 = self.user;
                                var $2252 = App$KL$Lobby$State$Local$new$($2251, _room$9);
                                var _new_local$10 = $2252;
                                break;
                        };
                        var $2250 = App$set_local$(App$KL$State$Local$lobby$(_new_local$10));
                        return $2250;
                    }));
                    var $2247 = $2248;
                } else {
                    var self = ($2246 === "ready");
                    if (self) {
                        var $2254 = IO$monad$((_m$bind$7 => _m$pure$8 => {
                            var $2255 = _m$bind$7;
                            return $2255;
                        }))(App$watch$((() => {
                            var self = _local$1;
                            switch (self._) {
                                case 'App.KL.Lobby.State.Local.new':
                                    var $2256 = self.room_input;
                                    var $2257 = $2256;
                                    return $2257;
                            };
                        })()))((_$7 => {
                            var $2258 = IO$monad$((_m$bind$8 => _m$pure$9 => {
                                var $2259 = _m$bind$8;
                                return $2259;
                            }))(App$new_post$((() => {
                                var self = _local$1;
                                switch (self._) {
                                    case 'App.KL.Lobby.State.Local.new':
                                        var $2260 = self.room_input;
                                        var $2261 = $2260;
                                        return $2261;
                                };
                            })(), App$KL$Global$Event$serialize_post$(App$KL$Global$Event$join_room)))((_$8 => {
                                var $2262 = App$set_local$(App$KL$State$Local$game$(App$KL$Game$State$Local$new$((() => {
                                    var self = _local$1;
                                    switch (self._) {
                                        case 'App.KL.Lobby.State.Local.new':
                                            var $2263 = self.user;
                                            var $2264 = $2263;
                                            return $2264;
                                    };
                                })(), (() => {
                                    var self = _local$1;
                                    switch (self._) {
                                        case 'App.KL.Lobby.State.Local.new':
                                            var $2265 = self.room_input;
                                            var $2266 = $2265;
                                            return $2266;
                                    };
                                })(), Maybe$none, Pair$new$(0, 0))));
                                return $2262;
                            }));
                            return $2258;
                        }));
                        var $2253 = $2254;
                    } else {
                        var $2267 = App$pass;
                        var $2253 = $2267;
                    };
                    var $2247 = $2253;
                };
                var $2241 = $2247;
                break;
            case 'App.Event.input':
                var $2268 = self.text;
                var self = _local$1;
                switch (self._) {
                    case 'App.KL.Lobby.State.Local.new':
                        var $2270 = self.user;
                        var $2271 = App$KL$Lobby$State$Local$new$($2270, $2268);
                        var _new_local$7 = $2271;
                        break;
                };
                var $2269 = App$set_local$(App$KL$State$Local$lobby$(_new_local$7));
                var $2241 = $2269;
                break;
            case 'App.Event.frame':
            case 'App.Event.mouse_down':
            case 'App.Event.mouse_up':
            case 'App.Event.key_down':
            case 'App.Event.key_up':
            case 'App.Event.mouse_over':
                var $2272 = App$pass;
                var $2241 = $2272;
                break;
        };
        return $2241;
    };
    const App$KL$Lobby$when = x0 => x1 => x2 => App$KL$Lobby$when$(x0, x1, x2);

    function Char$eql$(_a$1, _b$2) {
        var $2273 = (_a$1 === _b$2);
        return $2273;
    };
    const Char$eql = x0 => x1 => Char$eql$(x0, x1);

    function String$starts_with$(_xs$1, _match$2) {
        var String$starts_with$ = (_xs$1, _match$2) => ({
            ctr: 'TCO',
            arg: [_xs$1, _match$2]
        });
        var String$starts_with = _xs$1 => _match$2 => String$starts_with$(_xs$1, _match$2);
        var arg = [_xs$1, _match$2];
        while (true) {
            let [_xs$1, _match$2] = arg;
            var R = (() => {
                var self = _match$2;
                if (self.length === 0) {
                    var $2274 = Bool$true;
                    return $2274;
                } else {
                    var $2275 = self.charCodeAt(0);
                    var $2276 = self.slice(1);
                    var self = _xs$1;
                    if (self.length === 0) {
                        var $2278 = Bool$false;
                        var $2277 = $2278;
                    } else {
                        var $2279 = self.charCodeAt(0);
                        var $2280 = self.slice(1);
                        var self = Char$eql$($2275, $2279);
                        if (self) {
                            var $2282 = String$starts_with$($2280, $2276);
                            var $2281 = $2282;
                        } else {
                            var $2283 = Bool$false;
                            var $2281 = $2283;
                        };
                        var $2277 = $2281;
                    };
                    return $2277;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const String$starts_with = x0 => x1 => String$starts_with$(x0, x1);

    function Word$mod$(_a$2, _b$3) {
        var _q$4 = Word$div$(_a$2, _b$3);
        var $2284 = Word$sub$(_a$2, Word$mul$(_b$3, _q$4));
        return $2284;
    };
    const Word$mod = x0 => x1 => Word$mod$(x0, x1);
    const U32$mod = a0 => a1 => (a0 % a1);

    function Hexagonal$Axial$from_nat$(_n$1) {
        var _n_converted$2 = (Number(_n$1) >>> 0);
        var _coord_i$3 = ((_n_converted$2 / 1000) >>> 0);
        var _coord_i$4 = (_coord_i$3);
        var _coord_i$5 = ((_coord_i$4 - 100) >> 0);
        var _coord_j$6 = (_n_converted$2 % 1000);
        var _coord_j$7 = (_coord_j$6);
        var _coord_j$8 = ((_coord_j$7 - 100) >> 0);
        var $2285 = Hexagonal$Axial$new$(_coord_i$5, _coord_j$8);
        return $2285;
    };
    const Hexagonal$Axial$from_nat = x0 => Hexagonal$Axial$from_nat$(x0);

    function App$KL$Global$Event$set_init_pos$(_coord$1) {
        var $2286 = ({
            _: 'App.KL.Global.Event.set_init_pos',
            'coord': _coord$1
        });
        return $2286;
    };
    const App$KL$Global$Event$set_init_pos = x0 => App$KL$Global$Event$set_init_pos$(x0);
    const App$KL$Game$Hero$name_to_id$map = Map$from_list$(List$imap$((_i$1 => _x$2 => {
        var $2287 = Pair$new$((() => {
            var self = _x$2;
            switch (self._) {
                case 'App.KL.Game.Hero.new':
                    var $2288 = self.name;
                    var $2289 = $2288;
                    return $2289;
            };
        })(), _i$1);
        return $2287;
    }), App$KL$Game$Hero$list));

    function App$KL$Game$Hero$name_to_id$(_name$1) {
        var $2290 = Map$get$(_name$1, App$KL$Game$Hero$name_to_id$map);
        return $2290;
    };
    const App$KL$Game$Hero$name_to_id = x0 => App$KL$Game$Hero$name_to_id$(x0);

    function App$KL$Global$Event$set_hero$(_hero$1) {
        var $2291 = ({
            _: 'App.KL.Global.Event.set_hero',
            'hero': _hero$1
        });
        return $2291;
    };
    const App$KL$Global$Event$set_hero = x0 => App$KL$Global$Event$set_hero$(x0);

    function App$KL$Global$Event$set_ready$(_ready$1) {
        var $2292 = ({
            _: 'App.KL.Global.Event.set_ready',
            'ready': _ready$1
        });
        return $2292;
    };
    const App$KL$Global$Event$set_ready = x0 => App$KL$Global$Event$set_ready$(x0);

    function App$KL$Global$Event$set_team$(_team$1) {
        var $2293 = ({
            _: 'App.KL.Global.Event.set_team',
            'team': _team$1
        });
        return $2293;
    };
    const App$KL$Global$Event$set_team = x0 => App$KL$Global$Event$set_team$(x0);

    function App$KL$Game$Stage$Draft$when$(_local$1, _global$2, _event$3) {
        var self = _global$2;
        switch (self._) {
            case 'App.KL.Game.new':
                var $2295 = self.players;
                var $2296 = $2295;
                var _players$4 = $2296;
                break;
        };
        var self = _event$3;
        switch (self._) {
            case 'App.Event.mouse_click':
                var $2297 = self.id;
                var self = String$starts_with$($2297, "C");
                if (self) {
                    var _coord_nat$8 = String$drop$(1n, $2297);
                    var _coord$9 = Hexagonal$Axial$from_nat$((BigInt(_coord_nat$8)));
                    var $2299 = App$new_post$((() => {
                        var self = _local$1;
                        switch (self._) {
                            case 'App.KL.Game.State.Local.new':
                                var $2300 = self.room;
                                var $2301 = $2300;
                                return $2301;
                        };
                    })(), App$KL$Global$Event$serialize_post$(App$KL$Global$Event$set_init_pos$(_coord$9)));
                    var $2298 = $2299;
                } else {
                    var self = String$starts_with$($2297, "H");
                    if (self) {
                        var _hero_name$8 = String$drop$(1n, $2297);
                        var _hero_id$9 = Maybe$map$(Nat$to_u8, App$KL$Game$Hero$name_to_id$(_hero_name$8));
                        var self = _hero_id$9;
                        switch (self._) {
                            case 'Maybe.some':
                                var $2304 = self.value;
                                var $2305 = App$new_post$((() => {
                                    var self = _local$1;
                                    switch (self._) {
                                        case 'App.KL.Game.State.Local.new':
                                            var $2306 = self.room;
                                            var $2307 = $2306;
                                            return $2307;
                                    };
                                })(), App$KL$Global$Event$serialize_post$(App$KL$Global$Event$set_hero$($2304)));
                                var $2303 = $2305;
                                break;
                            case 'Maybe.none':
                                var $2308 = App$pass;
                                var $2303 = $2308;
                                break;
                        };
                        var $2302 = $2303;
                    } else {
                        var self = String$starts_with$($2297, "R");
                        if (self) {
                            var _player$8 = Map$get$((() => {
                                var self = _local$1;
                                switch (self._) {
                                    case 'App.KL.Game.State.Local.new':
                                        var $2311 = self.user;
                                        var $2312 = $2311;
                                        return $2312;
                                };
                            })(), _players$4);
                            var self = _player$8;
                            switch (self._) {
                                case 'Maybe.some':
                                    var $2313 = self.value;
                                    var self = $2313;
                                    switch (self._) {
                                        case 'App.KL.Game.Player.new':
                                            var $2315 = self.ready;
                                            var $2316 = $2315;
                                            var self = $2316;
                                            break;
                                    };
                                    if (self) {
                                        var $2317 = 0;
                                        var _ready_u8$10 = $2317;
                                    } else {
                                        var $2318 = 1;
                                        var _ready_u8$10 = $2318;
                                    };
                                    var $2314 = App$new_post$((() => {
                                        var self = _local$1;
                                        switch (self._) {
                                            case 'App.KL.Game.State.Local.new':
                                                var $2319 = self.room;
                                                var $2320 = $2319;
                                                return $2320;
                                        };
                                    })(), App$KL$Global$Event$serialize_post$(App$KL$Global$Event$set_ready$(_ready_u8$10)));
                                    var $2310 = $2314;
                                    break;
                                case 'Maybe.none':
                                    var $2321 = App$pass;
                                    var $2310 = $2321;
                                    break;
                            };
                            var $2309 = $2310;
                        } else {
                            var self = String$starts_with$($2297, "T");
                            if (self) {
                                var _player_count$8 = String$drop$(1n, $2297);
                                var self = String$starts_with$(_player_count$8, "3");
                                if (self) {
                                    var $2324 = App$pass;
                                    var $2323 = $2324;
                                } else {
                                    var _team$9 = String$drop$(1n, _player_count$8);
                                    var self = (_team$9 === "blue");
                                    if (self) {
                                        var $2326 = App$KL$Game$Team$blue;
                                        var _team$10 = $2326;
                                    } else {
                                        var self = (_team$9 === "red");
                                        if (self) {
                                            var $2328 = App$KL$Game$Team$red;
                                            var $2327 = $2328;
                                        } else {
                                            var $2329 = App$KL$Game$Team$neutral;
                                            var $2327 = $2329;
                                        };
                                        var _team$10 = $2327;
                                    };
                                    var $2325 = App$new_post$((() => {
                                        var self = _local$1;
                                        switch (self._) {
                                            case 'App.KL.Game.State.Local.new':
                                                var $2330 = self.room;
                                                var $2331 = $2330;
                                                return $2331;
                                        };
                                    })(), App$KL$Global$Event$serialize_post$(App$KL$Global$Event$set_team$(_team$10)));
                                    var $2323 = $2325;
                                };
                                var $2322 = $2323;
                            } else {
                                var $2332 = App$pass;
                                var $2322 = $2332;
                            };
                            var $2309 = $2322;
                        };
                        var $2302 = $2309;
                    };
                    var $2298 = $2302;
                };
                var $2294 = $2298;
                break;
            case 'App.Event.init':
            case 'App.Event.frame':
            case 'App.Event.mouse_down':
            case 'App.Event.mouse_up':
            case 'App.Event.key_down':
            case 'App.Event.key_up':
            case 'App.Event.mouse_over':
            case 'App.Event.input':
                var $2333 = App$pass;
                var $2294 = $2333;
                break;
        };
        return $2294;
    };
    const App$KL$Game$Stage$Draft$when = x0 => x1 => x2 => App$KL$Game$Stage$Draft$when$(x0, x1, x2);

    function Char$to_string$(_chr$1) {
        var $2334 = String$cons$(_chr$1, String$nil);
        return $2334;
    };
    const Char$to_string = x0 => Char$to_string$(x0);

    function App$KL$Game$Casts$new$(_areas$1, _picks$2) {
        var $2335 = ({
            _: 'App.KL.Game.Casts.new',
            'areas': _areas$1,
            'picks': _picks$2
        });
        return $2335;
    };
    const App$KL$Game$Casts$new = x0 => x1 => App$KL$Game$Casts$new$(x0, x1);
    const Hexagonal$Axial$BBL$new = BBL$tip;

    function Hexagonal$Axial$BBL$from_list$(_list$2) {
        var $2336 = BBL$from_list$(Hexagonal$Axial$cmp, _list$2);
        return $2336;
    };
    const Hexagonal$Axial$BBL$from_list = x0 => Hexagonal$Axial$BBL$from_list$(x0);
    const App$KL$Game$Indicator$blue = ({
        _: 'App.KL.Game.Indicator.blue'
    });

    function Hexagonal$Axial$BBL$insert$(_key$2, _val$3, _map$4) {
        var $2337 = BBL$insert$(Hexagonal$Axial$cmp, _key$2, _val$3, _map$4);
        return $2337;
    };
    const Hexagonal$Axial$BBL$insert = x0 => x1 => x2 => Hexagonal$Axial$BBL$insert$(x0, x1, x2);

    function App$KL$Game$Stage$Board$when$(_local$1, _global$2, _event$3) {
        var self = _event$3;
        switch (self._) {
            case 'App.Event.frame':
                var $2339 = self.info;
                var self = $2339;
                switch (self._) {
                    case 'App.EnvInfo.new':
                        var $2341 = self.mouse_pos;
                        var $2342 = $2341;
                        var self = $2342;
                        break;
                };
                switch (self._) {
                    case 'Pair.new':
                        var $2343 = self.fst;
                        var $2344 = self.snd;
                        var $2345 = App$set_local$(App$KL$State$Local$game$((() => {
                            var self = _local$1;
                            switch (self._) {
                                case 'App.KL.Game.State.Local.new':
                                    var $2346 = self.user;
                                    var $2347 = self.room;
                                    var $2348 = self.casts;
                                    var $2349 = App$KL$Game$State$Local$new$($2346, $2347, $2348, Pair$new$((($2343 / 2) >>> 0), (($2344 / 2) >>> 0)));
                                    return $2349;
                            };
                        })()));
                        var $2340 = $2345;
                        break;
                };
                var $2338 = $2340;
                break;
            case 'App.Event.key_down':
                var $2350 = self.code;
                var $2351 = ((console.log(("Key down " + Char$to_string$($2350))), (_$6 => {
                    var $2352 = ((console.log("Setting casts."), (_$7 => {
                        var _coord$8 = Hexagonal$Axial$from_screen_xy$((() => {
                            var self = _local$1;
                            switch (self._) {
                                case 'App.KL.Game.State.Local.new':
                                    var $2354 = self.mouse;
                                    var $2355 = $2354;
                                    return $2355;
                            };
                        })(), App$KL$Constants$hexagon_radius, App$KL$Constants$center_x, App$KL$Constants$center_y);
                        var _casts$9 = Maybe$default$((() => {
                            var self = _local$1;
                            switch (self._) {
                                case 'App.KL.Game.State.Local.new':
                                    var $2356 = self.casts;
                                    var $2357 = $2356;
                                    return $2357;
                            };
                        })(), App$KL$Game$Casts$new$(Maybe$some$(Hexagonal$Axial$BBL$new), Hexagonal$Axial$BBL$new));
                        var self = _casts$9;
                        switch (self._) {
                            case 'App.KL.Game.Casts.new':
                                var $2358 = self.picks;
                                var $2359 = App$KL$Game$Casts$new$(Maybe$some$(Hexagonal$Axial$BBL$from_list$(List$cons$(Pair$new$(_coord$8, App$KL$Game$Indicator$blue), List$nil))), $2358);
                                var _casts$10 = $2359;
                                break;
                        };
                        var $2353 = App$set_local$(App$KL$State$Local$game$((() => {
                            var self = _local$1;
                            switch (self._) {
                                case 'App.KL.Game.State.Local.new':
                                    var $2360 = self.user;
                                    var $2361 = self.room;
                                    var $2362 = self.mouse;
                                    var $2363 = App$KL$Game$State$Local$new$($2360, $2361, Maybe$some$(_casts$10), $2362);
                                    return $2363;
                            };
                        })()));
                        return $2353;
                    })()));
                    return $2352;
                })()));
                var $2338 = $2351;
                break;
            case 'App.Event.key_up':
                var $2364 = self.code;
                var $2365 = ((console.log(("Key up " + Char$to_string$($2364))), (_$6 => {
                    var _coord$7 = Hexagonal$Axial$from_screen_xy$((() => {
                        var self = _local$1;
                        switch (self._) {
                            case 'App.KL.Game.State.Local.new':
                                var $2367 = self.mouse;
                                var $2368 = $2367;
                                return $2368;
                        };
                    })(), App$KL$Constants$hexagon_radius, App$KL$Constants$center_x, App$KL$Constants$center_y);
                    var _casts$8 = Maybe$default$((() => {
                        var self = _local$1;
                        switch (self._) {
                            case 'App.KL.Game.State.Local.new':
                                var $2369 = self.casts;
                                var $2370 = $2369;
                                return $2370;
                        };
                    })(), App$KL$Game$Casts$new$(Maybe$some$(Hexagonal$Axial$BBL$new), Hexagonal$Axial$BBL$new));
                    var self = _casts$8;
                    switch (self._) {
                        case 'App.KL.Game.Casts.new':
                            var $2371 = self.areas;
                            var $2372 = App$KL$Game$Casts$new$($2371, Hexagonal$Axial$BBL$insert$(_coord$7, Char$to_string$($2364), (() => {
                                var self = _casts$8;
                                switch (self._) {
                                    case 'App.KL.Game.Casts.new':
                                        var $2373 = self.picks;
                                        var $2374 = $2373;
                                        return $2374;
                                };
                            })()));
                            var _casts$9 = $2372;
                            break;
                    };
                    var self = _casts$9;
                    switch (self._) {
                        case 'App.KL.Game.Casts.new':
                            var $2375 = self.picks;
                            var $2376 = App$KL$Game$Casts$new$(Maybe$none, $2375);
                            var _casts$10 = $2376;
                            break;
                    };
                    var $2366 = App$set_local$(App$KL$State$Local$game$((() => {
                        var self = _local$1;
                        switch (self._) {
                            case 'App.KL.Game.State.Local.new':
                                var $2377 = self.user;
                                var $2378 = self.room;
                                var $2379 = self.mouse;
                                var $2380 = App$KL$Game$State$Local$new$($2377, $2378, Maybe$some$(_casts$10), $2379);
                                return $2380;
                        };
                    })()));
                    return $2366;
                })()));
                var $2338 = $2365;
                break;
            case 'App.Event.init':
            case 'App.Event.mouse_down':
            case 'App.Event.mouse_up':
            case 'App.Event.mouse_over':
            case 'App.Event.mouse_click':
            case 'App.Event.input':
                var $2381 = App$pass;
                var $2338 = $2381;
                break;
        };
        return $2338;
    };
    const App$KL$Game$Stage$Board$when = x0 => x1 => x2 => App$KL$Game$Stage$Board$when$(x0, x1, x2);

    function App$KL$Game$when$(_local$1, _global$2, _event$3) {
        var self = _global$2;
        switch (self._) {
            case 'App.KL.Global.State.new':
                var $2383 = self.game;
                var self = $2383;
                switch (self._) {
                    case 'Maybe.some':
                        var $2385 = self.value;
                        var self = $2385;
                        switch (self._) {
                            case 'App.KL.Game.new':
                                var $2387 = self.stage;
                                var self = $2387;
                                switch (self._) {
                                    case 'App.KL.Game.Stage.draft':
                                        var $2389 = App$KL$Game$Stage$Draft$when$(_local$1, $2385, _event$3);
                                        var $2388 = $2389;
                                        break;
                                    case 'App.KL.Game.Stage.board':
                                        var $2390 = App$KL$Game$Stage$Board$when$(_local$1, $2385, _event$3);
                                        var $2388 = $2390;
                                        break;
                                };
                                var $2386 = $2388;
                                break;
                        };
                        var $2384 = $2386;
                        break;
                    case 'Maybe.none':
                        var $2391 = App$pass;
                        var $2384 = $2391;
                        break;
                };
                var $2382 = $2384;
                break;
        };
        return $2382;
    };
    const App$KL$Game$when = x0 => x1 => x2 => App$KL$Game$when$(x0, x1, x2);

    function App$KL$when$(_event$1, _state$2) {
        var self = _state$2;
        switch (self._) {
            case 'App.Store.new':
                var $2393 = self.local;
                var $2394 = self.global;
                var self = $2393;
                switch (self._) {
                    case 'App.KL.State.Local.lobby':
                        var $2396 = self.state;
                        var $2397 = App$KL$Lobby$when$($2396, $2394, _event$1);
                        var $2395 = $2397;
                        break;
                    case 'App.KL.State.Local.game':
                        var $2398 = self.state;
                        var $2399 = App$KL$Game$when$($2398, $2394, _event$1);
                        var $2395 = $2399;
                        break;
                };
                var $2392 = $2395;
                break;
        };
        return $2392;
    };
    const App$KL$when = x0 => x1 => App$KL$when$(x0, x1);
    const App$State$global = Pair$snd;

    function App$KL$Game$new$(_stage$1, _players$2, _board$3, _tick$4) {
        var $2400 = ({
            _: 'App.KL.Game.new',
            'stage': _stage$1,
            'players': _players$2,
            'board': _board$3,
            'tick': _tick$4
        });
        return $2400;
    };
    const App$KL$Game$new = x0 => x1 => x2 => x3 => App$KL$Game$new$(x0, x1, x2, x3);
    const U64$add = a0 => a1 => ((a0 + a1) & 0xFFFFFFFFFFFFFFFFn);
    const App$KL$Game$Stage$board = ({
        _: 'App.KL.Game.Stage.board'
    });

    function App$KL$Game$Terrain$new$(_field_id$1) {
        var $2401 = ({
            _: 'App.KL.Game.Terrain.new',
            'field_id': _field_id$1
        });
        return $2401;
    };
    const App$KL$Game$Terrain$new = x0 => App$KL$Game$Terrain$new$(x0);

    function App$KL$Game$Entity$terrain$(_value$1) {
        var $2402 = ({
            _: 'App.KL.Game.Entity.terrain',
            'value': _value$1
        });
        return $2402;
    };
    const App$KL$Game$Entity$terrain = x0 => App$KL$Game$Entity$terrain$(x0);

    function Hexagonal$Cubic$new$(_x$1, _y$2, _z$3) {
        var $2403 = ({
            _: 'Hexagonal.Cubic.new',
            'x': _x$1,
            'y': _y$2,
            'z': _z$3
        });
        return $2403;
    };
    const Hexagonal$Cubic$new = x0 => x1 => x2 => Hexagonal$Cubic$new$(x0, x1, x2);

    function Hexagonal$Axial$to_cubic$(_coord$1) {
        var self = _coord$1;
        switch (self._) {
            case 'Hexagonal.Axial.new':
                var $2405 = self.i;
                var $2406 = self.j;
                var _x$4 = $2405;
                var _z$5 = $2406;
                var _y$6 = ((((-_x$4)) - _z$5) >> 0);
                var $2407 = Hexagonal$Cubic$new$(_x$4, _y$6, _z$5);
                var $2404 = $2407;
                break;
        };
        return $2404;
    };
    const Hexagonal$Axial$to_cubic = x0 => Hexagonal$Axial$to_cubic$(x0);

    function Hexagonal$Axial$inside$(_coord$1, _region_size$2) {
        var _coord$3 = Hexagonal$Axial$to_cubic$(_coord$1);
        var self = _coord$3;
        switch (self._) {
            case 'Hexagonal.Cubic.new':
                var $2409 = self.x;
                var $2410 = self.y;
                var $2411 = self.z;
                var _x$7 = I32$abs$($2409);
                var _y$8 = I32$abs$($2410);
                var _z$9 = I32$abs$($2411);
                var _greater$10 = I32$max$(_x$7, I32$max$(_y$8, _z$9));
                var $2412 = (_greater$10 <= _region_size$2);
                var $2408 = $2412;
                break;
        };
        return $2408;
    };
    const Hexagonal$Axial$inside = x0 => x1 => Hexagonal$Axial$inside$(x0, x1);

    function App$KL$Game$Board$get$(_coord$1, _board$2) {
        var $2413 = Hexagonal$Axial$BBL$get$(_coord$1, _board$2);
        return $2413;
    };
    const App$KL$Game$Board$get = x0 => x1 => App$KL$Game$Board$get$(x0, x1);

    function App$KL$Game$Tile$new$(_terrain$1, _creature$2) {
        var $2414 = ({
            _: 'App.KL.Game.Tile.new',
            'terrain': _terrain$1,
            'creature': _creature$2
        });
        return $2414;
    };
    const App$KL$Game$Tile$new = x0 => x1 => App$KL$Game$Tile$new$(x0, x1);

    function App$KL$Game$Board$set$(_coord$1, _tile$2, _board$3) {
        var $2415 = Hexagonal$Axial$BBL$insert$(_coord$1, _tile$2, _board$3);
        return $2415;
    };
    const App$KL$Game$Board$set = x0 => x1 => x2 => App$KL$Game$Board$set$(x0, x1, x2);

    function App$KL$Game$Board$push$(_coord$1, _entity$2, _board$3) {
        var _tile$4 = App$KL$Game$Board$get$(_coord$1, _board$3);
        var self = _tile$4;
        switch (self._) {
            case 'Maybe.some':
                var $2417 = self.value;
                var self = $2417;
                switch (self._) {
                    case 'App.KL.Game.Tile.new':
                        var self = _entity$2;
                        switch (self._) {
                            case 'App.KL.Game.Entity.creature':
                                var $2420 = self.value;
                                var self = $2417;
                                switch (self._) {
                                    case 'App.KL.Game.Tile.new':
                                        var $2422 = self.terrain;
                                        var $2423 = App$KL$Game$Tile$new$($2422, Maybe$some$($2420));
                                        var _creature_tile$9 = $2423;
                                        break;
                                };
                                var $2421 = App$KL$Game$Board$set$(_coord$1, _creature_tile$9, _board$3);
                                var $2419 = $2421;
                                break;
                            case 'App.KL.Game.Entity.terrain':
                                var self = $2417;
                                switch (self._) {
                                    case 'App.KL.Game.Tile.new':
                                        var $2425 = self.terrain;
                                        var $2426 = self.creature;
                                        var $2427 = App$KL$Game$Tile$new$($2425, $2426);
                                        var _background_tile$9 = $2427;
                                        break;
                                };
                                var $2424 = App$KL$Game$Board$set$(_coord$1, _background_tile$9, _board$3);
                                var $2419 = $2424;
                                break;
                        };
                        var $2418 = $2419;
                        break;
                };
                var $2416 = $2418;
                break;
            case 'Maybe.none':
                var self = _entity$2;
                switch (self._) {
                    case 'App.KL.Game.Entity.terrain':
                        var $2429 = self.value;
                        var _new_tile$6 = App$KL$Game$Tile$new$($2429, Maybe$none);
                        var $2430 = App$KL$Game$Board$set$(_coord$1, _new_tile$6, _board$3);
                        var $2428 = $2430;
                        break;
                    case 'App.KL.Game.Entity.creature':
                        var $2431 = _board$3;
                        var $2428 = $2431;
                        break;
                };
                var $2416 = $2428;
                break;
        };
        return $2416;
    };
    const App$KL$Game$Board$push = x0 => x1 => x2 => App$KL$Game$Board$push$(x0, x1, x2);
    const App$KL$Game$Board$arena = (() => {
        var _board_size$1 = App$KL$Constants$board_size;
        var _board$2 = Hexagonal$Axial$BBL$new;
        var _width$3 = ((((_board_size$1 * 2) >> 0) + 1) >> 0);
        var _width$4 = I32$to_u32$(_width$3);
        var _height$5 = ((((_board_size$1 * 2) >> 0) + 1) >> 0);
        var _height$6 = I32$to_u32$(_height$5);
        var _new_terrain$7 = App$KL$Game$Terrain$new$(0n);
        var _new_terrain$8 = App$KL$Game$Entity$terrain$(_new_terrain$7);
        var _board$9 = (() => {
            var $2433 = _board$2;
            var $2434 = 0;
            var $2435 = _height$6;
            let _board$10 = $2433;
            for (let _j$9 = $2434; _j$9 < $2435; ++_j$9) {
                var _board$11 = (() => {
                    var $2436 = _board$10;
                    var $2437 = 0;
                    var $2438 = _width$4;
                    let _board$12 = $2436;
                    for (let _i$11 = $2437; _i$11 < $2438; ++_i$11) {
                        var _coord_i$13 = (((_i$11) - _board_size$1) >> 0);
                        var _coord_j$14 = (((_j$9) - _board_size$1) >> 0);
                        var _coord$15 = Hexagonal$Axial$new$(_coord_i$13, _coord_j$14);
                        var _inside$16 = Hexagonal$Axial$inside$(_coord$15, App$KL$Constants$board_size);
                        var self = _inside$16;
                        if (self) {
                            var $2439 = App$KL$Game$Board$push$(_coord$15, _new_terrain$8, _board$12);
                            var $2436 = $2439;
                        } else {
                            var $2440 = _board$12;
                            var $2436 = $2440;
                        };
                        _board$12 = $2436;
                    };
                    return _board$12;
                })();
                var $2433 = _board$11;
                _board$10 = $2433;
            };
            return _board$10;
        })();
        var $2432 = _board$9;
        return $2432;
    })();

    function App$KL$Game$Stage$Draft$Hero$info$(_id$1) {
        var $2441 = App$KL$Game$Hero$get_by_id$((BigInt(_id$1)));
        return $2441;
    };
    const App$KL$Game$Stage$Draft$Hero$info = x0 => App$KL$Game$Stage$Draft$Hero$info$(x0);

    function App$KL$Game$Creature$new$(_player$1, _hero$2, _team$3, _hp$4, _ap$5) {
        var $2442 = ({
            _: 'App.KL.Game.Creature.new',
            'player': _player$1,
            'hero': _hero$2,
            'team': _team$3,
            'hp': _hp$4,
            'ap': _ap$5
        });
        return $2442;
    };
    const App$KL$Game$Creature$new = x0 => x1 => x2 => x3 => x4 => App$KL$Game$Creature$new$(x0, x1, x2, x3, x4);

    function App$KL$Game$Stage$Draft$Tile$create_creature$(_hero_id$1, _player_addr$2, _team$3) {
        var _hero$4 = App$KL$Game$Stage$Draft$Hero$info$(_hero_id$1);
        var self = _hero$4;
        switch (self._) {
            case 'Maybe.some':
                var $2444 = self.value;
                var $2445 = Maybe$some$(App$KL$Game$Creature$new$(_player_addr$2, $2444, _team$3, (() => {
                    var self = $2444;
                    switch (self._) {
                        case 'App.KL.Game.Hero.new':
                            var $2446 = self.max_hp;
                            var $2447 = $2446;
                            return $2447;
                    };
                })(), (() => {
                    var self = $2444;
                    switch (self._) {
                        case 'App.KL.Game.Hero.new':
                            var $2448 = self.max_ap;
                            var $2449 = $2448;
                            return $2449;
                    };
                })()));
                var $2443 = $2445;
                break;
            case 'Maybe.none':
                var $2450 = Maybe$none;
                var $2443 = $2450;
                break;
        };
        return $2443;
    };
    const App$KL$Game$Stage$Draft$Tile$create_creature = x0 => x1 => x2 => App$KL$Game$Stage$Draft$Tile$create_creature$(x0, x1, x2);

    function App$KL$Game$Entity$creature$(_value$1) {
        var $2451 = ({
            _: 'App.KL.Game.Entity.creature',
            'value': _value$1
        });
        return $2451;
    };
    const App$KL$Game$Entity$creature = x0 => App$KL$Game$Entity$creature$(x0);

    function App$KL$Game$Stage$Draft$create_board$(_players$1) {
        var $2452 = ((console.log(" - criando mapa"), (_$2 => {
            var _map$3 = App$KL$Game$Board$arena;
            var _players$4 = Map$to_list$(_players$1);
            var _map$5 = (() => {
                var $2455 = _map$3;
                var $2456 = _players$4;
                let _map$6 = $2455;
                let _pair$5;
                while ($2456._ === 'List.cons') {
                    _pair$5 = $2456.head;
                    var self = _pair$5;
                    switch (self._) {
                        case 'Pair.new':
                            var $2457 = self.fst;
                            var $2458 = $2457;
                            var _user$7 = $2458;
                            break;
                    };
                    var self = _pair$5;
                    switch (self._) {
                        case 'Pair.new':
                            var $2459 = self.snd;
                            var $2460 = $2459;
                            var _player$8 = $2460;
                            break;
                    };
                    var self = _player$8;
                    switch (self._) {
                        case 'App.KL.Game.Player.new':
                            var $2461 = self.init_pos;
                            var $2462 = $2461;
                            var _pos$9 = $2462;
                            break;
                    };
                    var $2455 = Maybe$default$(Maybe$monad$((_m$bind$10 => _m$pure$11 => {
                        var $2463 = _m$bind$10;
                        return $2463;
                    }))(_pos$9)((_coord$10 => {
                        var $2464 = Maybe$monad$((_m$bind$11 => _m$pure$12 => {
                            var $2465 = _m$bind$11;
                            return $2465;
                        }))(Maybe$map$(Nat$to_u8, (() => {
                            var self = _player$8;
                            switch (self._) {
                                case 'App.KL.Game.Player.new':
                                    var $2466 = self.hero_id;
                                    var $2467 = $2466;
                                    return $2467;
                            };
                        })()))((_hero_id$11 => {
                            var self = _player$8;
                            switch (self._) {
                                case 'App.KL.Game.Player.new':
                                    var $2469 = self.team;
                                    var $2470 = $2469;
                                    var _team$12 = $2470;
                                    break;
                            };
                            var $2468 = Maybe$monad$((_m$bind$13 => _m$pure$14 => {
                                var $2471 = _m$bind$13;
                                return $2471;
                            }))(App$KL$Game$Stage$Draft$Tile$create_creature$(_hero_id$11, Maybe$some$(_user$7), _team$12))((_creature$13 => {
                                var _entity$14 = App$KL$Game$Entity$creature$(_creature$13);
                                var $2472 = Maybe$monad$((_m$bind$15 => _m$pure$16 => {
                                    var $2473 = _m$pure$16;
                                    return $2473;
                                }))(App$KL$Game$Board$push$(_coord$10, _entity$14, _map$6));
                                return $2472;
                            }));
                            return $2468;
                        }));
                        return $2464;
                    })), _map$6);
                    _map$6 = $2455;
                    $2456 = $2456.tail;
                }
                return _map$6;
            })();
            var $2453 = _map$5;
            return $2453;
        })()));
        return $2452;
    };
    const App$KL$Game$Stage$Draft$create_board = x0 => App$KL$Game$Stage$Draft$create_board$(x0);

    function App$KL$Global$tick$(_tick$1, _glob$2) {
        var self = _glob$2;
        switch (self._) {
            case 'App.KL.Global.State.new':
                var $2475 = self.game;
                var $2476 = $2475;
                var _game$3 = $2476;
                break;
        };
        var self = _game$3;
        switch (self._) {
            case 'Maybe.some':
                var $2477 = self.value;
                var self = $2477;
                switch (self._) {
                    case 'App.KL.Game.new':
                        var $2479 = self.stage;
                        var $2480 = $2479;
                        var _stage$5 = $2480;
                        break;
                };
                var self = _stage$5;
                switch (self._) {
                    case 'App.KL.Game.Stage.draft':
                        var $2481 = Maybe$default$(Maybe$monad$((_m$bind$6 => _m$pure$7 => {
                            var $2482 = _m$bind$6;
                            return $2482;
                        }))((() => {
                            var self = _glob$2;
                            switch (self._) {
                                case 'App.KL.Global.State.new':
                                    var $2483 = self.game;
                                    var $2484 = $2483;
                                    return $2484;
                            };
                        })())((_game$6 => {
                            var self = _game$6;
                            switch (self._) {
                                case 'App.KL.Game.new':
                                    var $2486 = self.stage;
                                    var $2487 = self.players;
                                    var $2488 = self.board;
                                    var $2489 = App$KL$Game$new$($2486, $2487, $2488, (((() => {
                                        var self = _game$6;
                                        switch (self._) {
                                            case 'App.KL.Game.new':
                                                var $2490 = self.tick;
                                                var $2491 = $2490;
                                                return $2491;
                                        };
                                    })() + 1n) & 0xFFFFFFFFFFFFFFFFn));
                                    var _game$7 = $2489;
                                    break;
                            };
                            var self = _game$7;
                            switch (self._) {
                                case 'App.KL.Game.new':
                                    var $2492 = self.players;
                                    var $2493 = $2492;
                                    var _players$8 = $2493;
                                    break;
                            };
                            var _player_list$9 = Map$to_list$(_players$8);
                            var _ready$10 = List$fold$(_player_list$9, Bool$true, (_x$10 => {
                                var $2494 = a1 => ((() => {
                                    var self = _x$10;
                                    switch (self._) {
                                        case 'Pair.new':
                                            var $2495 = self.snd;
                                            var $2496 = $2495;
                                            var self = $2496;
                                            break;
                                    };
                                    switch (self._) {
                                        case 'App.KL.Game.Player.new':
                                            var $2497 = self.ready;
                                            var $2498 = $2497;
                                            return $2498;
                                    };
                                })() && a1);
                                return $2494;
                            }));
                            var self = _player_list$9;
                            switch (self._) {
                                case 'List.nil':
                                    var $2499 = _glob$2;
                                    var _global$11 = $2499;
                                    break;
                                case 'List.cons':
                                    var self = _ready$10;
                                    if (self) {
                                        var $2501 = ((console.log("- to_board"), (_$13 => {
                                            var self = _game$7;
                                            switch (self._) {
                                                case 'App.KL.Game.new':
                                                    var $2503 = self.players;
                                                    var $2504 = self.board;
                                                    var $2505 = self.tick;
                                                    var $2506 = App$KL$Game$new$(App$KL$Game$Stage$board, $2503, $2504, $2505);
                                                    var _game$14 = $2506;
                                                    break;
                                            };
                                            var self = _game$14;
                                            switch (self._) {
                                                case 'App.KL.Game.new':
                                                    var $2507 = self.stage;
                                                    var $2508 = self.players;
                                                    var $2509 = self.tick;
                                                    var $2510 = App$KL$Game$new$($2507, $2508, App$KL$Game$Stage$Draft$create_board$(_players$8), $2509);
                                                    var _game$15 = $2510;
                                                    break;
                                            };
                                            var self = _glob$2;
                                            switch (self._) {
                                                case 'App.KL.Global.State.new':
                                                    var $2511 = App$KL$Global$State$new$(Maybe$some$(_game$15));
                                                    var $2502 = $2511;
                                                    break;
                                            };
                                            return $2502;
                                        })()));
                                        var $2500 = $2501;
                                    } else {
                                        var $2512 = _glob$2;
                                        var $2500 = $2512;
                                    };
                                    var _global$11 = $2500;
                                    break;
                            };
                            var $2485 = Maybe$monad$((_m$bind$12 => _m$pure$13 => {
                                var $2513 = _m$pure$13;
                                return $2513;
                            }))(_global$11);
                            return $2485;
                        })), _glob$2);
                        var $2478 = $2481;
                        break;
                    case 'App.KL.Game.Stage.board':
                        var $2514 = _glob$2;
                        var $2478 = $2514;
                        break;
                };
                var $2474 = $2478;
                break;
            case 'Maybe.none':
                var $2515 = _glob$2;
                var $2474 = $2515;
                break;
        };
        return $2474;
    };
    const App$KL$Global$tick = x0 => x1 => App$KL$Global$tick$(x0, x1);

    function Deserializer$run$(_deserializer$2, _bs$3) {
        var self = _deserializer$2(_bs$3);
        switch (self._) {
            case 'Maybe.some':
                var $2517 = self.value;
                var $2518 = Maybe$some$((() => {
                    var self = $2517;
                    switch (self._) {
                        case 'Pair.new':
                            var $2519 = self.snd;
                            var $2520 = $2519;
                            return $2520;
                    };
                })());
                var $2516 = $2518;
                break;
            case 'Maybe.none':
                var $2521 = Maybe$none;
                var $2516 = $2521;
                break;
        };
        return $2516;
    };
    const Deserializer$run = x0 => x1 => Deserializer$run$(x0, x1);

    function Deserializer$Reply$(_A$1) {
        var $2522 = null;
        return $2522;
    };
    const Deserializer$Reply = x0 => Deserializer$Reply$(x0);

    function Deserializer$choice$go$(_pars$2, _bs$3) {
        var Deserializer$choice$go$ = (_pars$2, _bs$3) => ({
            ctr: 'TCO',
            arg: [_pars$2, _bs$3]
        });
        var Deserializer$choice$go = _pars$2 => _bs$3 => Deserializer$choice$go$(_pars$2, _bs$3);
        var arg = [_pars$2, _bs$3];
        while (true) {
            let [_pars$2, _bs$3] = arg;
            var R = (() => {
                var self = _pars$2;
                switch (self._) {
                    case 'List.cons':
                        var $2523 = self.head;
                        var $2524 = self.tail;
                        var self = $2523(_bs$3);
                        switch (self._) {
                            case 'Maybe.some':
                                var $2526 = self.value;
                                var self = $2526;
                                switch (self._) {
                                    case 'Pair.new':
                                        var $2528 = self.fst;
                                        var $2529 = self.snd;
                                        var $2530 = Maybe$some$(Pair$new$($2528, $2529));
                                        var $2527 = $2530;
                                        break;
                                };
                                var $2525 = $2527;
                                break;
                            case 'Maybe.none':
                                var $2531 = Deserializer$choice$go$($2524, _bs$3);
                                var $2525 = $2531;
                                break;
                        };
                        return $2525;
                    case 'List.nil':
                        var $2532 = Maybe$none;
                        return $2532;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Deserializer$choice$go = x0 => x1 => Deserializer$choice$go$(x0, x1);

    function Deserializer$choice$(_pars$2) {
        var $2533 = Deserializer$choice$go(_pars$2);
        return $2533;
    };
    const Deserializer$choice = x0 => Deserializer$choice$(x0);

    function Deserializer$(_A$1) {
        var $2534 = null;
        return $2534;
    };
    const Deserializer = x0 => Deserializer$(x0);

    function Deserializer$bind$(_deserialize$3, _next$4, _bs$5) {
        var self = _deserialize$3(_bs$5);
        switch (self._) {
            case 'Maybe.some':
                var $2536 = self.value;
                var self = $2536;
                switch (self._) {
                    case 'Pair.new':
                        var $2538 = self.fst;
                        var $2539 = self.snd;
                        var $2540 = _next$4($2539)($2538);
                        var $2537 = $2540;
                        break;
                };
                var $2535 = $2537;
                break;
            case 'Maybe.none':
                var $2541 = Maybe$none;
                var $2535 = $2541;
                break;
        };
        return $2535;
    };
    const Deserializer$bind = x0 => x1 => x2 => Deserializer$bind$(x0, x1, x2);

    function Deserializer$bits$(_bits$1, _bs$2) {
        var Deserializer$bits$ = (_bits$1, _bs$2) => ({
            ctr: 'TCO',
            arg: [_bits$1, _bs$2]
        });
        var Deserializer$bits = _bits$1 => _bs$2 => Deserializer$bits$(_bits$1, _bs$2);
        var arg = [_bits$1, _bs$2];
        while (true) {
            let [_bits$1, _bs$2] = arg;
            var R = (() => {
                var self = _bits$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'o':
                        var $2542 = self.slice(0, -1);
                        var self = _bs$2;
                        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                            case 'o':
                                var $2544 = self.slice(0, -1);
                                var $2545 = Deserializer$bits$($2542, $2544);
                                var $2543 = $2545;
                                break;
                            case 'e':
                            case 'i':
                                var $2546 = Maybe$none;
                                var $2543 = $2546;
                                break;
                        };
                        return $2543;
                    case 'i':
                        var $2547 = self.slice(0, -1);
                        var self = _bs$2;
                        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                            case 'i':
                                var $2549 = self.slice(0, -1);
                                var $2550 = Deserializer$bits$($2547, $2549);
                                var $2548 = $2550;
                                break;
                            case 'e':
                            case 'o':
                                var $2551 = Maybe$none;
                                var $2548 = $2551;
                                break;
                        };
                        return $2548;
                    case 'e':
                        var $2552 = Maybe$some$(Pair$new$(_bs$2, Unit$new));
                        return $2552;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Deserializer$bits = x0 => x1 => Deserializer$bits$(x0, x1);

    function Deserializer$pure$(_value$2, _bs$3) {
        var $2553 = Maybe$some$(Pair$new$(_bs$3, _value$2));
        return $2553;
    };
    const Deserializer$pure = x0 => x1 => Deserializer$pure$(x0, x1);
    const App$KL$Global$Event$void = ({
        _: 'App.KL.Global.Event.void'
    });
    const App$KL$Game$Team$deserializer = Deserializer$choice$(List$cons$(Deserializer$bind(Deserializer$bits(((Bits$e + '0') + '0')))((_$1 => {
        var $2554 = Deserializer$pure(App$KL$Game$Team$blue);
        return $2554;
    })), List$cons$(Deserializer$bind(Deserializer$bits(((Bits$e + '0') + '1')))((_$1 => {
        var $2555 = Deserializer$pure(App$KL$Game$Team$red);
        return $2555;
    })), List$cons$(Deserializer$bind(Deserializer$bits(((Bits$e + '1') + '0')))((_$1 => {
        var $2556 = Deserializer$pure(App$KL$Game$Team$neutral);
        return $2556;
    })), List$nil))));

    function Deserializer$monad$(_new$2) {
        var $2557 = _new$2(Deserializer$bind)(Deserializer$pure);
        return $2557;
    };
    const Deserializer$monad = x0 => Deserializer$monad$(x0);

    function Word$deserializer$(_size$1) {
        var self = _size$1;
        if (self === 0n) {
            var $2559 = Deserializer$monad$((_m$bind$2 => _m$pure$3 => {
                var $2560 = _m$pure$3;
                return $2560;
            }))(Word$e);
            var $2558 = $2559;
        } else {
            var $2561 = (self - 1n);
            var $2562 = Deserializer$choice$(List$cons$(Deserializer$monad$((_m$bind$3 => _m$pure$4 => {
                var $2563 = _m$bind$3;
                return $2563;
            }))(Deserializer$bits((Bits$e + '0')))((_$3 => {
                var $2564 = Deserializer$monad$((_m$bind$4 => _m$pure$5 => {
                    var $2565 = _m$bind$4;
                    return $2565;
                }))(Word$deserializer$($2561))((_pred$4 => {
                    var $2566 = Deserializer$monad$((_m$bind$5 => _m$pure$6 => {
                        var $2567 = _m$pure$6;
                        return $2567;
                    }))(Word$o$(_pred$4));
                    return $2566;
                }));
                return $2564;
            })), List$cons$(Deserializer$monad$((_m$bind$3 => _m$pure$4 => {
                var $2568 = _m$bind$3;
                return $2568;
            }))(Deserializer$bits((Bits$e + '1')))((_$3 => {
                var $2569 = Deserializer$monad$((_m$bind$4 => _m$pure$5 => {
                    var $2570 = _m$bind$4;
                    return $2570;
                }))(Word$deserializer$($2561))((_pred$4 => {
                    var $2571 = Deserializer$monad$((_m$bind$5 => _m$pure$6 => {
                        var $2572 = _m$pure$6;
                        return $2572;
                    }))(Word$i$(_pred$4));
                    return $2571;
                }));
                return $2569;
            })), List$nil)));
            var $2558 = $2562;
        };
        return $2558;
    };
    const Word$deserializer = x0 => Word$deserializer$(x0);
    const U8$deserializer = Deserializer$monad$((_m$bind$1 => _m$pure$2 => {
        var $2573 = _m$bind$1;
        return $2573;
    }))(Word$deserializer$(8n))((_word$1 => {
        var $2574 = Deserializer$monad$((_m$bind$2 => _m$pure$3 => {
            var $2575 = _m$pure$3;
            return $2575;
        }))(U8$new$(_word$1));
        return $2574;
    }));
    const I32$deserializer = Deserializer$monad$((_m$bind$1 => _m$pure$2 => {
        var $2576 = _m$bind$1;
        return $2576;
    }))(Word$deserializer$(32n))((_word$1 => {
        var $2577 = Deserializer$monad$((_m$bind$2 => _m$pure$3 => {
            var $2578 = _m$pure$3;
            return $2578;
        }))(I32$new$(_word$1));
        return $2577;
    }));
    const Hexagonal$Axial$deserializer = Deserializer$choice$(List$cons$(Deserializer$bind(Deserializer$bits(Bits$e))((_$1 => {
        var $2579 = Deserializer$bind(I32$deserializer)((_i$2 => {
            var $2580 = Deserializer$bind(I32$deserializer)((_j$3 => {
                var $2581 = Deserializer$pure(Hexagonal$Axial$new$(_i$2, _j$3));
                return $2581;
            }));
            return $2580;
        }));
        return $2579;
    })), List$nil));
    const App$KL$Global$Event$deserializer = Deserializer$choice$(List$cons$(Deserializer$bind(Deserializer$bits((((Bits$e + '0') + '0') + '0')))((_$1 => {
        var $2582 = Deserializer$pure(App$KL$Global$Event$void);
        return $2582;
    })), List$cons$(Deserializer$bind(Deserializer$bits((((Bits$e + '0') + '0') + '1')))((_$1 => {
        var $2583 = Deserializer$pure(App$KL$Global$Event$join_room);
        return $2583;
    })), List$cons$(Deserializer$bind(Deserializer$bits((((Bits$e + '0') + '1') + '0')))((_$1 => {
        var $2584 = Deserializer$bind(App$KL$Game$Team$deserializer)((_team$2 => {
            var $2585 = Deserializer$pure(App$KL$Global$Event$set_team$(_team$2));
            return $2585;
        }));
        return $2584;
    })), List$cons$(Deserializer$bind(Deserializer$bits((((Bits$e + '0') + '1') + '1')))((_$1 => {
        var $2586 = Deserializer$bind(U8$deserializer)((_hero$2 => {
            var $2587 = Deserializer$pure(App$KL$Global$Event$set_hero$(_hero$2));
            return $2587;
        }));
        return $2586;
    })), List$cons$(Deserializer$bind(Deserializer$bits((((Bits$e + '1') + '0') + '0')))((_$1 => {
        var $2588 = Deserializer$bind(Hexagonal$Axial$deserializer)((_coord$2 => {
            var $2589 = Deserializer$pure(App$KL$Global$Event$set_init_pos$(_coord$2));
            return $2589;
        }));
        return $2588;
    })), List$cons$(Deserializer$bind(Deserializer$bits((((Bits$e + '1') + '0') + '1')))((_$1 => {
        var $2590 = Deserializer$bind(U8$deserializer)((_ready$2 => {
            var $2591 = Deserializer$pure(App$KL$Global$Event$set_ready$(_ready$2));
            return $2591;
        }));
        return $2590;
    })), List$nil)))))));

    function Bits$hex$decode$(_x$1) {
        var self = _x$1;
        if (self.length === 0) {
            var $2593 = Bits$e;
            var $2592 = $2593;
        } else {
            var $2594 = self.charCodeAt(0);
            var $2595 = self.slice(1);
            var self = ($2594 === 48);
            if (self) {
                var $2597 = ((((Bits$hex$decode$($2595) + '0') + '0') + '0') + '0');
                var $2596 = $2597;
            } else {
                var self = ($2594 === 49);
                if (self) {
                    var $2599 = ((((Bits$hex$decode$($2595) + '0') + '0') + '0') + '1');
                    var $2598 = $2599;
                } else {
                    var self = ($2594 === 50);
                    if (self) {
                        var $2601 = ((((Bits$hex$decode$($2595) + '0') + '0') + '1') + '0');
                        var $2600 = $2601;
                    } else {
                        var self = ($2594 === 51);
                        if (self) {
                            var $2603 = ((((Bits$hex$decode$($2595) + '0') + '0') + '1') + '1');
                            var $2602 = $2603;
                        } else {
                            var self = ($2594 === 52);
                            if (self) {
                                var $2605 = ((((Bits$hex$decode$($2595) + '0') + '1') + '0') + '0');
                                var $2604 = $2605;
                            } else {
                                var self = ($2594 === 53);
                                if (self) {
                                    var $2607 = ((((Bits$hex$decode$($2595) + '0') + '1') + '0') + '1');
                                    var $2606 = $2607;
                                } else {
                                    var self = ($2594 === 54);
                                    if (self) {
                                        var $2609 = ((((Bits$hex$decode$($2595) + '0') + '1') + '1') + '0');
                                        var $2608 = $2609;
                                    } else {
                                        var self = ($2594 === 55);
                                        if (self) {
                                            var $2611 = ((((Bits$hex$decode$($2595) + '0') + '1') + '1') + '1');
                                            var $2610 = $2611;
                                        } else {
                                            var self = ($2594 === 56);
                                            if (self) {
                                                var $2613 = ((((Bits$hex$decode$($2595) + '1') + '0') + '0') + '0');
                                                var $2612 = $2613;
                                            } else {
                                                var self = ($2594 === 57);
                                                if (self) {
                                                    var $2615 = ((((Bits$hex$decode$($2595) + '1') + '0') + '0') + '1');
                                                    var $2614 = $2615;
                                                } else {
                                                    var self = ($2594 === 97);
                                                    if (self) {
                                                        var $2617 = ((((Bits$hex$decode$($2595) + '1') + '0') + '1') + '0');
                                                        var $2616 = $2617;
                                                    } else {
                                                        var self = ($2594 === 98);
                                                        if (self) {
                                                            var $2619 = ((((Bits$hex$decode$($2595) + '1') + '0') + '1') + '1');
                                                            var $2618 = $2619;
                                                        } else {
                                                            var self = ($2594 === 99);
                                                            if (self) {
                                                                var $2621 = ((((Bits$hex$decode$($2595) + '1') + '1') + '0') + '0');
                                                                var $2620 = $2621;
                                                            } else {
                                                                var self = ($2594 === 100);
                                                                if (self) {
                                                                    var $2623 = ((((Bits$hex$decode$($2595) + '1') + '1') + '0') + '1');
                                                                    var $2622 = $2623;
                                                                } else {
                                                                    var self = ($2594 === 101);
                                                                    if (self) {
                                                                        var $2625 = ((((Bits$hex$decode$($2595) + '1') + '1') + '1') + '0');
                                                                        var $2624 = $2625;
                                                                    } else {
                                                                        var self = ($2594 === 102);
                                                                        if (self) {
                                                                            var $2627 = ((((Bits$hex$decode$($2595) + '1') + '1') + '1') + '1');
                                                                            var $2626 = $2627;
                                                                        } else {
                                                                            var self = ($2594 === 65);
                                                                            if (self) {
                                                                                var $2629 = ((((Bits$hex$decode$($2595) + '1') + '0') + '1') + '0');
                                                                                var $2628 = $2629;
                                                                            } else {
                                                                                var self = ($2594 === 66);
                                                                                if (self) {
                                                                                    var $2631 = ((((Bits$hex$decode$($2595) + '1') + '0') + '1') + '1');
                                                                                    var $2630 = $2631;
                                                                                } else {
                                                                                    var self = ($2594 === 67);
                                                                                    if (self) {
                                                                                        var $2633 = ((((Bits$hex$decode$($2595) + '1') + '1') + '0') + '0');
                                                                                        var $2632 = $2633;
                                                                                    } else {
                                                                                        var self = ($2594 === 68);
                                                                                        if (self) {
                                                                                            var $2635 = ((((Bits$hex$decode$($2595) + '1') + '1') + '0') + '1');
                                                                                            var $2634 = $2635;
                                                                                        } else {
                                                                                            var self = ($2594 === 69);
                                                                                            if (self) {
                                                                                                var $2637 = ((((Bits$hex$decode$($2595) + '1') + '1') + '1') + '0');
                                                                                                var $2636 = $2637;
                                                                                            } else {
                                                                                                var self = ($2594 === 70);
                                                                                                if (self) {
                                                                                                    var $2639 = ((((Bits$hex$decode$($2595) + '1') + '1') + '1') + '1');
                                                                                                    var $2638 = $2639;
                                                                                                } else {
                                                                                                    var $2640 = Bits$e;
                                                                                                    var $2638 = $2640;
                                                                                                };
                                                                                                var $2636 = $2638;
                                                                                            };
                                                                                            var $2634 = $2636;
                                                                                        };
                                                                                        var $2632 = $2634;
                                                                                    };
                                                                                    var $2630 = $2632;
                                                                                };
                                                                                var $2628 = $2630;
                                                                            };
                                                                            var $2626 = $2628;
                                                                        };
                                                                        var $2624 = $2626;
                                                                    };
                                                                    var $2622 = $2624;
                                                                };
                                                                var $2620 = $2622;
                                                            };
                                                            var $2618 = $2620;
                                                        };
                                                        var $2616 = $2618;
                                                    };
                                                    var $2614 = $2616;
                                                };
                                                var $2612 = $2614;
                                            };
                                            var $2610 = $2612;
                                        };
                                        var $2608 = $2610;
                                    };
                                    var $2606 = $2608;
                                };
                                var $2604 = $2606;
                            };
                            var $2602 = $2604;
                        };
                        var $2600 = $2602;
                    };
                    var $2598 = $2600;
                };
                var $2596 = $2598;
            };
            var $2592 = $2596;
        };
        return $2592;
    };
    const Bits$hex$decode = x0 => Bits$hex$decode$(x0);

    function App$KL$Global$Event$deserialize_post$(_hex$1) {
        var $2641 = Maybe$default$(Deserializer$run$(App$KL$Global$Event$deserializer, Bits$hex$decode$(String$drop$(2n, _hex$1))), App$KL$Global$Event$void);
        return $2641;
    };
    const App$KL$Global$Event$deserialize_post = x0 => App$KL$Global$Event$deserialize_post$(x0);
    const App$KL$Game$Stage$draft = ({
        _: 'App.KL.Game.Stage.draft'
    });
    const App$KL$Game$start = App$KL$Game$new$(App$KL$Game$Stage$draft, Map$new, Hexagonal$Axial$BBL$new, 0n);

    function App$KL$Game$Player$new$(_hero_id$1, _init_pos$2, _team$3, _ready$4) {
        var $2642 = ({
            _: 'App.KL.Game.Player.new',
            'hero_id': _hero_id$1,
            'init_pos': _init_pos$2,
            'team': _team$3,
            'ready': _ready$4
        });
        return $2642;
    };
    const App$KL$Game$Player$new = x0 => x1 => x2 => x3 => App$KL$Game$Player$new$(x0, x1, x2, x3);

    function App$KL$Game$Stage$Draft$has_hero$(_hero_id$1, _player$2) {
        var self = _player$2;
        switch (self._) {
            case 'Pair.new':
                var $2644 = self.snd;
                var $2645 = $2644;
                var self = $2645;
                break;
        };
        switch (self._) {
            case 'App.KL.Game.Player.new':
                var $2646 = self.hero_id;
                var $2647 = $2646;
                var _x$3 = $2647;
                break;
        };
        var self = _x$3;
        switch (self._) {
            case 'Maybe.some':
                var $2648 = self.value;
                var $2649 = ((Number($2648) & 0xFF) === _hero_id$1);
                var $2643 = $2649;
                break;
            case 'Maybe.none':
                var $2650 = Bool$false;
                var $2643 = $2650;
                break;
        };
        return $2643;
    };
    const App$KL$Game$Stage$Draft$has_hero = x0 => x1 => App$KL$Game$Stage$Draft$has_hero$(x0, x1);
    const Bool$or = a0 => a1 => (a0 || a1);

    function App$KL$Game$Stage$Draft$has_coord$(_coord$1, _player$2) {
        var self = _player$2;
        switch (self._) {
            case 'Pair.new':
                var $2652 = self.snd;
                var $2653 = $2652;
                var self = $2653;
                break;
        };
        switch (self._) {
            case 'App.KL.Game.Player.new':
                var $2654 = self.init_pos;
                var $2655 = $2654;
                var _x$3 = $2655;
                break;
        };
        var self = _x$3;
        switch (self._) {
            case 'Maybe.some':
                var $2656 = self.value;
                var $2657 = Hexagonal$Axial$eql$($2656, _coord$1);
                var $2651 = $2657;
                break;
            case 'Maybe.none':
                var $2658 = Bool$false;
                var $2651 = $2658;
                break;
        };
        return $2651;
    };
    const App$KL$Game$Stage$Draft$has_coord = x0 => x1 => App$KL$Game$Stage$Draft$has_coord$(x0, x1);

    function App$KL$Global$post$(_time$1, _room$2, _addr$3, _data$4, _glob$5) {
        var $2659 = ((console.log(("Event: " + (_room$2 + (" " + _data$4)))), (_$6 => {
            var self = App$KL$Global$Event$deserialize_post$(_data$4);
            switch (self._) {
                case 'App.KL.Global.Event.set_team':
                    var $2661 = self.team;
                    var $2662 = ((console.log("- set_team"), (_$8 => {
                        var self = _glob$5;
                        switch (self._) {
                            case 'App.KL.Global.State.new':
                                var $2664 = self.game;
                                var self = $2664;
                                switch (self._) {
                                    case 'Maybe.some':
                                        var $2666 = self.value;
                                        var self = $2666;
                                        switch (self._) {
                                            case 'App.KL.Game.new':
                                                var $2668 = self.stage;
                                                var $2669 = self.board;
                                                var $2670 = self.tick;
                                                var $2671 = App$KL$Game$new$($2668, Map$set$(_addr$3, App$KL$Game$Player$new$(Maybe$none, Maybe$none, $2661, Bool$false), (() => {
                                                    var self = $2666;
                                                    switch (self._) {
                                                        case 'App.KL.Game.new':
                                                            var $2672 = self.players;
                                                            var $2673 = $2672;
                                                            return $2673;
                                                    };
                                                })()), $2669, $2670);
                                                var _glob$game$11 = $2671;
                                                break;
                                        };
                                        var self = _glob$5;
                                        switch (self._) {
                                            case 'App.KL.Global.State.new':
                                                var $2674 = App$KL$Global$State$new$(Maybe$some$(_glob$game$11));
                                                var $2667 = $2674;
                                                break;
                                        };
                                        var $2665 = $2667;
                                        break;
                                    case 'Maybe.none':
                                        var $2675 = _glob$5;
                                        var $2665 = $2675;
                                        break;
                                };
                                var $2663 = $2665;
                                break;
                        };
                        return $2663;
                    })()));
                    var $2660 = $2662;
                    break;
                case 'App.KL.Global.Event.set_hero':
                    var $2676 = self.hero;
                    var $2677 = ((console.log("- set_hero"), (_$8 => {
                        var $2678 = Maybe$default$(Maybe$monad$((_m$bind$9 => _m$pure$10 => {
                            var $2679 = _m$bind$9;
                            return $2679;
                        }))((() => {
                            var self = _glob$5;
                            switch (self._) {
                                case 'App.KL.Global.State.new':
                                    var $2680 = self.game;
                                    var $2681 = $2680;
                                    return $2681;
                            };
                        })())((_game$9 => {
                            var self = _game$9;
                            switch (self._) {
                                case 'App.KL.Game.new':
                                    var $2683 = self.players;
                                    var $2684 = $2683;
                                    var _players$10 = $2684;
                                    break;
                            };
                            var $2682 = Maybe$monad$((_m$bind$11 => _m$pure$12 => {
                                var $2685 = _m$bind$11;
                                return $2685;
                            }))(Map$get$(_addr$3, _players$10))((_player$11 => {
                                var _player_list$12 = Map$to_list$(_players$10);
                                var _is_picked$13 = List$fold$(List$map$(App$KL$Game$Stage$Draft$has_hero($2676), _player_list$12), Bool$false, Bool$or);
                                var self = _game$9;
                                switch (self._) {
                                    case 'App.KL.Game.new':
                                        var $2687 = self.stage;
                                        var $2688 = self.board;
                                        var $2689 = self.tick;
                                        var $2690 = App$KL$Game$new$($2687, Map$set$(_addr$3, (() => {
                                            var self = _player$11;
                                            switch (self._) {
                                                case 'App.KL.Game.Player.new':
                                                    var $2691 = self.init_pos;
                                                    var $2692 = self.team;
                                                    var $2693 = self.ready;
                                                    var $2694 = App$KL$Game$Player$new$(Maybe$some$((BigInt($2676))), $2691, $2692, $2693);
                                                    return $2694;
                                            };
                                        })(), _players$10), $2688, $2689);
                                        var _game$14 = $2690;
                                        break;
                                };
                                var self = _is_picked$13;
                                if (self) {
                                    var $2695 = _glob$5;
                                    var _global$15 = $2695;
                                } else {
                                    var self = _glob$5;
                                    switch (self._) {
                                        case 'App.KL.Global.State.new':
                                            var $2697 = App$KL$Global$State$new$(Maybe$some$(_game$14));
                                            var $2696 = $2697;
                                            break;
                                    };
                                    var _global$15 = $2696;
                                };
                                var $2686 = Maybe$monad$((_m$bind$16 => _m$pure$17 => {
                                    var $2698 = _m$pure$17;
                                    return $2698;
                                }))(_global$15);
                                return $2686;
                            }));
                            return $2682;
                        })), _glob$5);
                        return $2678;
                    })()));
                    var $2660 = $2677;
                    break;
                case 'App.KL.Global.Event.set_init_pos':
                    var $2699 = self.coord;
                    var $2700 = ((console.log("- set_init_pos"), (_$8 => {
                        var $2701 = Maybe$default$(Maybe$monad$((_m$bind$9 => _m$pure$10 => {
                            var $2702 = _m$bind$9;
                            return $2702;
                        }))((() => {
                            var self = _glob$5;
                            switch (self._) {
                                case 'App.KL.Global.State.new':
                                    var $2703 = self.game;
                                    var $2704 = $2703;
                                    return $2704;
                            };
                        })())((_game$9 => {
                            var self = _game$9;
                            switch (self._) {
                                case 'App.KL.Game.new':
                                    var $2706 = self.players;
                                    var $2707 = $2706;
                                    var _players$10 = $2707;
                                    break;
                            };
                            var $2705 = Maybe$monad$((_m$bind$11 => _m$pure$12 => {
                                var $2708 = _m$bind$11;
                                return $2708;
                            }))(Map$get$(_addr$3, _players$10))((_player$11 => {
                                var _player_list$12 = Map$to_list$(_players$10);
                                var _is_occupied$13 = List$fold$(List$map$(App$KL$Game$Stage$Draft$has_coord($2699), _player_list$12), Bool$false, Bool$or);
                                var self = _game$9;
                                switch (self._) {
                                    case 'App.KL.Game.new':
                                        var $2710 = self.stage;
                                        var $2711 = self.board;
                                        var $2712 = self.tick;
                                        var $2713 = App$KL$Game$new$($2710, Map$set$(_addr$3, (() => {
                                            var self = _player$11;
                                            switch (self._) {
                                                case 'App.KL.Game.Player.new':
                                                    var $2714 = self.hero_id;
                                                    var $2715 = self.team;
                                                    var $2716 = self.ready;
                                                    var $2717 = App$KL$Game$Player$new$($2714, Maybe$some$($2699), $2715, $2716);
                                                    return $2717;
                                            };
                                        })(), _players$10), $2711, $2712);
                                        var _game$14 = $2713;
                                        break;
                                };
                                var self = _is_occupied$13;
                                if (self) {
                                    var $2718 = _glob$5;
                                    var _global$15 = $2718;
                                } else {
                                    var self = _glob$5;
                                    switch (self._) {
                                        case 'App.KL.Global.State.new':
                                            var $2720 = App$KL$Global$State$new$(Maybe$some$(_game$14));
                                            var $2719 = $2720;
                                            break;
                                    };
                                    var _global$15 = $2719;
                                };
                                var $2709 = Maybe$monad$((_m$bind$16 => _m$pure$17 => {
                                    var $2721 = _m$pure$17;
                                    return $2721;
                                }))(_global$15);
                                return $2709;
                            }));
                            return $2705;
                        })), _glob$5);
                        return $2701;
                    })()));
                    var $2660 = $2700;
                    break;
                case 'App.KL.Global.Event.set_ready':
                    var $2722 = self.ready;
                    var $2723 = ((console.log("- set_ready"), (_$8 => {
                        var $2724 = Maybe$default$(Maybe$monad$((_m$bind$9 => _m$pure$10 => {
                            var $2725 = _m$bind$9;
                            return $2725;
                        }))((() => {
                            var self = _glob$5;
                            switch (self._) {
                                case 'App.KL.Global.State.new':
                                    var $2726 = self.game;
                                    var $2727 = $2726;
                                    return $2727;
                            };
                        })())((_game$9 => {
                            var self = _game$9;
                            switch (self._) {
                                case 'App.KL.Game.new':
                                    var $2729 = self.players;
                                    var $2730 = $2729;
                                    var _players$10 = $2730;
                                    break;
                            };
                            var $2728 = Maybe$monad$((_m$bind$11 => _m$pure$12 => {
                                var $2731 = _m$bind$11;
                                return $2731;
                            }))(Map$get$(_addr$3, _players$10))((_player$11 => {
                                var _ready$12 = ($2722 === 1);
                                var self = _game$9;
                                switch (self._) {
                                    case 'App.KL.Game.new':
                                        var $2733 = self.stage;
                                        var $2734 = self.board;
                                        var $2735 = self.tick;
                                        var $2736 = App$KL$Game$new$($2733, Map$set$(_addr$3, (() => {
                                            var self = _player$11;
                                            switch (self._) {
                                                case 'App.KL.Game.Player.new':
                                                    var $2737 = self.hero_id;
                                                    var $2738 = self.init_pos;
                                                    var $2739 = self.team;
                                                    var $2740 = App$KL$Game$Player$new$($2737, $2738, $2739, _ready$12);
                                                    return $2740;
                                            };
                                        })(), _players$10), $2734, $2735);
                                        var _game$13 = $2736;
                                        break;
                                };
                                var self = _glob$5;
                                switch (self._) {
                                    case 'App.KL.Global.State.new':
                                        var $2741 = App$KL$Global$State$new$(Maybe$some$(_game$13));
                                        var _global$14 = $2741;
                                        break;
                                };
                                var $2732 = Maybe$monad$((_m$bind$15 => _m$pure$16 => {
                                    var $2742 = _m$pure$16;
                                    return $2742;
                                }))(_global$14);
                                return $2732;
                            }));
                            return $2728;
                        })), _glob$5);
                        return $2724;
                    })()));
                    var $2660 = $2723;
                    break;
                case 'App.KL.Global.Event.void':
                    var $2743 = _glob$5;
                    var $2660 = $2743;
                    break;
                case 'App.KL.Global.Event.join_room':
                    var $2744 = ((console.log("- join_room"), (_$7 => {
                        var self = _glob$5;
                        switch (self._) {
                            case 'App.KL.Global.State.new':
                                var $2746 = self.game;
                                var _glob$game$9 = Maybe$default$($2746, App$KL$Game$start);
                                var _player$10 = Map$get$(_addr$3, (() => {
                                    var self = _glob$game$9;
                                    switch (self._) {
                                        case 'App.KL.Game.new':
                                            var $2748 = self.players;
                                            var $2749 = $2748;
                                            return $2749;
                                    };
                                })());
                                var self = _player$10;
                                switch (self._) {
                                    case 'Maybe.some':
                                        var $2750 = self.value;
                                        var self = _glob$game$9;
                                        switch (self._) {
                                            case 'App.KL.Game.new':
                                                var $2752 = self.stage;
                                                var $2753 = self.board;
                                                var $2754 = self.tick;
                                                var $2755 = App$KL$Game$new$($2752, Map$set$(_addr$3, $2750, (() => {
                                                    var self = _glob$game$9;
                                                    switch (self._) {
                                                        case 'App.KL.Game.new':
                                                            var $2756 = self.players;
                                                            var $2757 = $2756;
                                                            return $2757;
                                                    };
                                                })()), $2753, $2754);
                                                var $2751 = $2755;
                                                break;
                                        };
                                        var _glob$game$11 = $2751;
                                        break;
                                    case 'Maybe.none':
                                        var self = _glob$game$9;
                                        switch (self._) {
                                            case 'App.KL.Game.new':
                                                var $2759 = self.stage;
                                                var $2760 = self.board;
                                                var $2761 = self.tick;
                                                var $2762 = App$KL$Game$new$($2759, Map$set$(_addr$3, App$KL$Game$Player$new$(Maybe$none, Maybe$none, App$KL$Game$Team$neutral, Bool$false), (() => {
                                                    var self = _glob$game$9;
                                                    switch (self._) {
                                                        case 'App.KL.Game.new':
                                                            var $2763 = self.players;
                                                            var $2764 = $2763;
                                                            return $2764;
                                                    };
                                                })()), $2760, $2761);
                                                var $2758 = $2762;
                                                break;
                                        };
                                        var _glob$game$11 = $2758;
                                        break;
                                };
                                var self = _glob$5;
                                switch (self._) {
                                    case 'App.KL.Global.State.new':
                                        var $2765 = App$KL$Global$State$new$(Maybe$some$(_glob$game$11));
                                        var $2747 = $2765;
                                        break;
                                };
                                var $2745 = $2747;
                                break;
                        };
                        return $2745;
                    })()));
                    var $2660 = $2744;
                    break;
            };
            return $2660;
        })()));
        return $2659;
    };
    const App$KL$Global$post = x0 => x1 => x2 => x3 => x4 => App$KL$Global$post$(x0, x1, x2, x3, x4);
    const App$KL = (() => {
        var _img$1 = VoxBox$alloc_capacity$(((65536 * 8) >>> 0));
        var $2766 = App$new$(App$KL$init, App$KL$draw(_img$1), App$KL$when, App$KL$Global$tick, App$KL$Global$post);
        return $2766;
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
        'App.new': App$new,
        'Pair.new': Pair$new,
        'App.State.new': App$State$new,
        'App.KL.State': App$KL$State,
        'App.KL.State.Local.lobby': App$KL$State$Local$lobby,
        'App.KL.Lobby.State.Local.new': App$KL$Lobby$State$Local$new,
        'App.KL.Global.State.new': App$KL$Global$State$new,
        'Maybe.none': Maybe$none,
        'App.Store.new': App$Store$new,
        'App.KL.init': App$KL$init,
        'BBL': BBL,
        'Pair.fst': Pair$fst,
        'Pair.snd': Pair$snd,
        'BBL.bin': BBL$bin,
        'BBL.tip': BBL$tip,
        'BBL.singleton': BBL$singleton,
        'BBL.size': BBL$size,
        'U32.add': U32$add,
        'BBL.w': BBL$w,
        'Cmp.as_ltn': Cmp$as_ltn,
        'Cmp.ltn': Cmp$ltn,
        'Cmp.gtn': Cmp$gtn,
        'Word.cmp.go': Word$cmp$go,
        'Cmp.eql': Cmp$eql,
        'Word.cmp': Word$cmp,
        'Word.ltn': Word$ltn,
        'U32.ltn': U32$ltn,
        'U32.from_nat': U32$from_nat,
        'BBL.node': BBL$node,
        'Cmp.as_gtn': Cmp$as_gtn,
        'Word.gtn': Word$gtn,
        'U32.gtn': U32$gtn,
        'BBL.balance': BBL$balance,
        'BBL.insert': BBL$insert,
        'BBL.from_list.go': BBL$from_list$go,
        'BBL.from_list': BBL$from_list,
        'U16.ltn': U16$ltn,
        'Cmp.as_eql': Cmp$as_eql,
        'Word.eql': Word$eql,
        'U16.eql': U16$eql,
        'U16.cmp': U16$cmp,
        'String.cmp': String$cmp,
        'Map.from_list': Map$from_list,
        'List.cons': List$cons,
        'Pair': Pair,
        'List.nil': List$nil,
        'DOM.node': DOM$node,
        'DOM.text': DOM$text,
        'Map.new': Map$new,
        'App.KL.Lobby.draw.input': App$KL$Lobby$draw$input,
        'App.KL.Lobby.draw.button': App$KL$Lobby$draw$button,
        'App.KL.Lobby.draw': App$KL$Lobby$draw,
        'Maybe': Maybe,
        'Maybe.some': Maybe$some,
        'BBL.lookup': BBL$lookup,
        'Map.get': Map$get,
        'Maybe.default': Maybe$default,
        'App.KL.Game.Stage.Draft.to_team': App$KL$Game$Stage$Draft$to_team,
        'App.KL.Game.Team.neutral': App$KL$Game$Team$neutral,
        'Map.set': Map$set,
        'List.fold': List$fold,
        'Hexagonal.Axial.new': Hexagonal$Axial$new,
        'I32.new': I32$new,
        'Word.neg.aux': Word$neg$aux,
        'Word.neg': Word$neg,
        'I32.neg': I32$neg,
        'Int.to_i32': Int$to_i32,
        'Int.new': Int$new,
        'Int.from_nat': Int$from_nat,
        'I32.from_nat': I32$from_nat,
        'Parser.State.new': Parser$State$new,
        'Parser.run': Parser$run,
        'Parser.Reply': Parser$Reply,
        'Parser.Reply.error': Parser$Reply$error,
        'Parser.Error.new': Parser$Error$new,
        'Parser.Reply.fail': Parser$Reply$fail,
        'Nat.gtn': Nat$gtn,
        'Parser.Error.combine': Parser$Error$combine,
        'Parser.Error.maybe_combine': Parser$Error$maybe_combine,
        'Parser.Reply.value': Parser$Reply$value,
        'Parser.choice': Parser$choice,
        'Parser': Parser,
        'Unit.new': Unit$new,
        'String.cons': String$cons,
        'String.concat': String$concat,
        'String.nil': String$nil,
        'Parser.text.go': Parser$text$go,
        'Parser.text': Parser$text,
        'List': List,
        'Parser.many.go': Parser$many$go,
        'Parser.many': Parser$many,
        'Parser.many1': Parser$many1,
        'Parser.hex_digit': Parser$hex_digit,
        'Nat.add': Nat$add,
        'Nat.mul': Nat$mul,
        'Nat.from_base.go': Nat$from_base$go,
        'List.reverse.go': List$reverse$go,
        'List.reverse': List$reverse,
        'Nat.from_base': Nat$from_base,
        'Parser.hex_nat': Parser$hex_nat,
        'Parser.digit': Parser$digit,
        'Parser.nat': Parser$nat,
        'Parser.maybe': Parser$maybe,
        'Parser.Number.new': Parser$Number$new,
        'Parser.num': Parser$num,
        'Nat.to_i32': Nat$to_i32,
        'I32.read': I32$read,
        'List.map': List$map,
        'Word.subber': Word$subber,
        'Word.sub': Word$sub,
        'I32.sub': I32$sub,
        'App.KL.Constants.board_size': App$KL$Constants$board_size,
        'I32.add': I32$add,
        'App.KL.Game.Stage.Draft.draw.tiles.get_pos.offset': App$KL$Game$Stage$Draft$draw$tiles$get_pos$offset,
        'App.KL.Game.Team.blue': App$KL$Game$Team$blue,
        'App.KL.Game.Team.red': App$KL$Game$Team$red,
        'App.KL.Game.Stage.Draft.draw.tiles.get_pos': App$KL$Game$Stage$Draft$draw$tiles$get_pos,
        'List.for': List$for,
        'Bool.and': Bool$and,
        'I32.eql': I32$eql,
        'Hexagonal.Axial.eql': Hexagonal$Axial$eql,
        'List.find': List$find,
        'BBL.foldr_with_key.go': BBL$foldr_with_key$go,
        'BBL.foldr_with_key': BBL$foldr_with_key,
        'BBL.to_list': BBL$to_list,
        'Map.to_list': Map$to_list,
        'App.KL.Game.Stage.Draft.draw.get_player_at': App$KL$Game$Stage$Draft$draw$get_player_at,
        'I32.mul': I32$mul,
        'F64.to_u32': F64$to_u32,
        'Word.s_to_f64': Word$s_to_f64,
        'I32.to_f64': I32$to_f64,
        'I32.to_u32': I32$to_u32,
        'Word.fold': Word$fold,
        'Word.to_nat': Word$to_nat,
        'U32.to_nat': U32$to_nat,
        'Hexagonal.Axial.to_nat': Hexagonal$Axial$to_nat,
        'Word.to_f64': Word$to_f64,
        'U32.to_f64': U32$to_f64,
        'App.KL.Constants.draft_hexagon_radius': App$KL$Constants$draft_hexagon_radius,
        'F64.div': F64$div,
        'F64.parse': F64$parse,
        'F64.read': F64$read,
        'F64.add': F64$add,
        'F64.mul': F64$mul,
        'F64.make': F64$make,
        'F64.from_nat': F64$from_nat,
        'App.KL.Game.Stage.Draft.draw.tiles.to_xy': App$KL$Game$Stage$Draft$draw$tiles$to_xy,
        'Either': Either,
        'Either.left': Either$left,
        'Either.right': Either$right,
        'Nat.sub_rem': Nat$sub_rem,
        'Nat.div_mod.go': Nat$div_mod$go,
        'Nat.div_mod': Nat$div_mod,
        'Nat.to_base.go': Nat$to_base$go,
        'Nat.to_base': Nat$to_base,
        'Nat.mod.go': Nat$mod$go,
        'Nat.mod': Nat$mod,
        'Nat.lte': Nat$lte,
        'List.at': List$at,
        'Nat.show_digit': Nat$show_digit,
        'Nat.to_string_base': Nat$to_string_base,
        'Nat.show': Nat$show,
        'U32.sub': U32$sub,
        'String.eql': String$eql,
        'App.KL.Game.Stage.Draft.draw.tiles.go': App$KL$Game$Stage$Draft$draw$tiles$go,
        'App.KL.Game.Stage.Draft.draw.tiles': App$KL$Game$Stage$Draft$draw$tiles,
        'App.KL.Game.Stage.Draft.draw.map_space': App$KL$Game$Stage$Draft$draw$map_space,
        'App.KL.Game.Stage.Draft.draw.coordinates': App$KL$Game$Stage$Draft$draw$coordinates,
        'BBL.min': BBL$min,
        'BBL.delete_min': BBL$delete_min,
        'BBL.delete': BBL$delete,
        'Map.delete': Map$delete,
        'Maybe.map': Maybe$map,
        'U8.new': U8$new,
        'Nat.to_u8': Nat$to_u8,
        'Maybe.bind': Maybe$bind,
        'Maybe.monad': Maybe$monad,
        'BitsMap.get': BitsMap$get,
        'Bits.o': Bits$o,
        'Bits.e': Bits$e,
        'Bits.i': Bits$i,
        'Bits.inc': Bits$inc,
        'Nat.to_bits': Nat$to_bits,
        'NatMap.get': NatMap$get,
        'BitsMap': BitsMap,
        'NatMap': NatMap,
        'BitsMap.new': BitsMap$new,
        'BitsMap.tie': BitsMap$tie,
        'BitsMap.set': BitsMap$set,
        'NatMap.from_list': NatMap$from_list,
        'List.imap': List$imap,
        'App.KL.Game.Hero.new': App$KL$Game$Hero$new,
        'Nat.ltn': Nat$ltn,
        'Nat.sub': Nat$sub,
        'Cmp.as_gte': Cmp$as_gte,
        'Word.gte': Word$gte,
        'Word.or': Word$or,
        'Word.shift_right.one.go': Word$shift_right$one$go,
        'Word.shift_right.one': Word$shift_right$one,
        'Word.shift_right': Word$shift_right,
        'Word.div.go': Word$div$go,
        'Word.div': Word$div,
        'U32.div': U32$div,
        'U32.length': U32$length,
        'U32.eql': U32$eql,
        'U32.inc': U32$inc,
        'U32.for': U32$for,
        'Word.slice': Word$slice,
        'U32.slice': U32$slice,
        'U32.read_base': U32$read_base,
        'VoxBox.parse_byte': VoxBox$parse_byte,
        'U32.or': U32$or,
        'Word.shl': Word$shl,
        'U32.shl': U32$shl,
        'Pos32.new': Pos32$new,
        'Col32.new': Col32$new,
        'Word.trim': Word$trim,
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
        'App.KL.Game.Hero.Croni.Assets.vbox_idle': App$KL$Game$Hero$Croni$Assets$vbox_idle,
        'App.KL.Game.Hero.Croni.Assets.base64_idle': App$KL$Game$Hero$Croni$Assets$base64_idle,
        'App.KL.Game.Hero.Croni.hero': App$KL$Game$Hero$Croni$hero,
        'App.KL.Game.Hero.Cyclope.Assets.vbox_idle': App$KL$Game$Hero$Cyclope$Assets$vbox_idle,
        'App.KL.Game.Hero.Cyclope.Assets.base64_idle': App$KL$Game$Hero$Cyclope$Assets$base64_idle,
        'App.KL.Game.Hero.Cyclope.hero': App$KL$Game$Hero$Cyclope$hero,
        'App.KL.Game.Hero.Lela.Assets.vbox_idle': App$KL$Game$Hero$Lela$Assets$vbox_idle,
        'App.KL.Game.Hero.Lela.Assets.base64_idle': App$KL$Game$Hero$Lela$Assets$base64_idle,
        'App.KL.Game.Hero.Lela.hero': App$KL$Game$Hero$Lela$hero,
        'App.KL.Game.Hero.Octoking.Assets.vbox_idle': App$KL$Game$Hero$Octoking$Assets$vbox_idle,
        'App.KL.Game.Hero.Octoking.Assets.base64_idle': App$KL$Game$Hero$Octoking$Assets$base64_idle,
        'App.KL.Game.Hero.Octoking.hero': App$KL$Game$Hero$Octoking$hero,
        'App.KL.Game.Hero.list': App$KL$Game$Hero$list,
        'App.KL.Game.Hero.get_by_id.map': App$KL$Game$Hero$get_by_id$map,
        'App.KL.Game.Hero.get_by_id': App$KL$Game$Hero$get_by_id,
        'U8.to_nat': U8$to_nat,
        'U64.new': U64$new,
        'U64.from_nat': U64$from_nat,
        'App.KL.Game.Stage.Draft.draw.cards.interrogation': App$KL$Game$Stage$Draft$draw$cards$interrogation,
        'App.KL.Game.Stage.Draft.draw.cards.card': App$KL$Game$Stage$Draft$draw$cards$card,
        'App.KL.Game.Stage.Draft.draw.cards.player': App$KL$Game$Stage$Draft$draw$cards$player,
        'App.KL.Game.Stage.Draft.draw.cards.picks_left': App$KL$Game$Stage$Draft$draw$cards$picks_left,
        'App.KL.Game.Team.eql': App$KL$Game$Team$eql,
        'List.length': List$length,
        'Nat.eql': Nat$eql,
        'Nat.for': Nat$for,
        'U8.eql': U8$eql,
        'U8.from_nat': U8$from_nat,
        'App.Kaelin.Hero.new': App$Kaelin$Hero$new,
        'App.Kaelin.HeroAssets.new': App$Kaelin$HeroAssets$new,
        'App.Kaelin.Assets.hero.croni.vbox_idle': App$Kaelin$Assets$hero$croni$vbox_idle,
        'App.Kaelin.Assets.hero.croni.base64_idle': App$Kaelin$Assets$hero$croni$base64_idle,
        'App.Kaelin.Assets.hero.croni': App$Kaelin$Assets$hero$croni,
        'App.Kaelin.Skill.new': App$Kaelin$Skill$new,
        'App.Kaelin.Effect.Result': App$Kaelin$Effect$Result,
        'List.concat': List$concat,
        'BitsMap.union': BitsMap$union,
        'NatMap.union': NatMap$union,
        'App.Kaelin.Effect.Result.new': App$Kaelin$Effect$Result$new,
        'App.Kaelin.Effect.bind': App$Kaelin$Effect$bind,
        'NatMap.new': NatMap$new,
        'App.Kaelin.Effect.pure': App$Kaelin$Effect$pure,
        'App.Kaelin.Effect.monad': App$Kaelin$Effect$monad,
        'App.Kaelin.Effect.coord.get_center': App$Kaelin$Effect$coord$get_center,
        'App.Kaelin.Effect.coord.get_target': App$Kaelin$Effect$coord$get_target,
        'App.Kaelin.Effect.map.get': App$Kaelin$Effect$map$get,
        'App.Kaelin.Coord.eql': App$Kaelin$Coord$eql,
        'App.Kaelin.Coord.Convert.axial_to_nat': App$Kaelin$Coord$Convert$axial_to_nat,
        'App.Kaelin.Map.get': App$Kaelin$Map$get,
        'App.Kaelin.Map.is_occupied': App$Kaelin$Map$is_occupied,
        'App.Kaelin.Effect': App$Kaelin$Effect,
        'App.Kaelin.Map.creature.get': App$Kaelin$Map$creature$get,
        'App.Kaelin.Tile.new': App$Kaelin$Tile$new,
        'NatMap.set': NatMap$set,
        'App.Kaelin.Map.creature.modify_at': App$Kaelin$Map$creature$modify_at,
        'Word.is_neg.go': Word$is_neg$go,
        'Word.is_neg': Word$is_neg,
        'Cmp.as_lte': Cmp$as_lte,
        'Cmp.inv': Cmp$inv,
        'Word.s_lte': Word$s_lte,
        'I32.lte': I32$lte,
        'Word.s_ltn': Word$s_ltn,
        'I32.ltn': I32$ltn,
        'I32.min': I32$min,
        'App.Kaelin.Creature.new': App$Kaelin$Creature$new,
        'App.Kaelin.Tile.creature.change_hp': App$Kaelin$Tile$creature$change_hp,
        'App.Kaelin.Map.creature.remove': App$Kaelin$Map$creature$remove,
        'Word.s_gtn': Word$s_gtn,
        'I32.gtn': I32$gtn,
        'I32.max': I32$max,
        'App.Kaelin.Map.creature.change_hp_at': App$Kaelin$Map$creature$change_hp_at,
        'App.Kaelin.Effect.map.set': App$Kaelin$Effect$map$set,
        'App.Kaelin.Effect.indicators.add': App$Kaelin$Effect$indicators$add,
        'App.Kaelin.Indicator.green': App$Kaelin$Indicator$green,
        'App.Kaelin.Indicator.red': App$Kaelin$Indicator$red,
        'App.Kaelin.Effect.hp.change_at': App$Kaelin$Effect$hp$change_at,
        'App.Kaelin.Effect.hp.damage_at': App$Kaelin$Effect$hp$damage_at,
        'App.Kaelin.Skill.get': App$Kaelin$Skill$get,
        'App.Kaelin.Tile.creature.change_ap': App$Kaelin$Tile$creature$change_ap,
        'App.Kaelin.Map.creature.change_ap_at': App$Kaelin$Map$creature$change_ap_at,
        'App.Kaelin.Effect.ap.change_at': App$Kaelin$Effect$ap$change_at,
        'App.Kaelin.Effect.ap.cost': App$Kaelin$Effect$ap$cost,
        'App.Kaelin.Effect.hp.heal_at': App$Kaelin$Effect$hp$heal_at,
        'App.Kaelin.Skill.vampirism': App$Kaelin$Skill$vampirism,
        'App.Kaelin.Heroes.Croni.skills.vampirism': App$Kaelin$Heroes$Croni$skills$vampirism,
        'App.Kaelin.Coord.Cubic.new': App$Kaelin$Coord$Cubic$new,
        'App.Kaelin.Coord.Convert.axial_to_cubic': App$Kaelin$Coord$Convert$axial_to_cubic,
        'App.Kaelin.Coord.new': App$Kaelin$Coord$new,
        'App.Kaelin.Coord.Convert.cubic_to_axial': App$Kaelin$Coord$Convert$cubic_to_axial,
        'F64.to_i32': F64$to_i32,
        'U32.to_i32': U32$to_i32,
        'Word.shr': Word$shr,
        'Word.s_shr': Word$s_shr,
        'I32.shr': I32$shr,
        'Word.xor': Word$xor,
        'I32.xor': I32$xor,
        'I32.abs': I32$abs,
        'App.Kaelin.Coord.Cubic.add': App$Kaelin$Coord$Cubic$add,
        'App.Kaelin.Coord.Cubic.range': App$Kaelin$Coord$Cubic$range,
        'Word.lte': Word$lte,
        'U32.lte': U32$lte,
        'App.Kaelin.Coord.fit': App$Kaelin$Coord$fit,
        'App.Kaelin.Constants.map_size': App$Kaelin$Constants$map_size,
        'List.filter': List$filter,
        'App.Kaelin.Coord.range': App$Kaelin$Coord$range,
        'List.foldr': List$foldr,
        'App.Kaelin.Map.set': App$Kaelin$Map$set,
        'App.Kaelin.Map.push': App$Kaelin$Map$push,
        'App.Kaelin.Map.Entity.animation': App$Kaelin$Map$Entity$animation,
        'App.Kaelin.Animation.new': App$Kaelin$Animation$new,
        'App.Kaelin.Sprite.new': App$Kaelin$Sprite$new,
        'App.Kaelin.Assets.effects.fire_1': App$Kaelin$Assets$effects$fire_1,
        'App.Kaelin.Assets.effects.fire_2': App$Kaelin$Assets$effects$fire_2,
        'App.Kaelin.Assets.effects.fire_3': App$Kaelin$Assets$effects$fire_3,
        'App.Kaelin.Assets.effects.fire_4': App$Kaelin$Assets$effects$fire_4,
        'App.Kaelin.Assets.effects.fire_5': App$Kaelin$Assets$effects$fire_5,
        'App.Kaelin.Sprite.fire': App$Kaelin$Sprite$fire,
        'App.Kaelin.Effect.animation.push': App$Kaelin$Effect$animation$push,
        'App.Kaelin.Effect.result.union': App$Kaelin$Effect$result$union,
        'App.Kaelin.Effect.area': App$Kaelin$Effect$area,
        'App.Kaelin.Map.creature.change_hp': App$Kaelin$Map$creature$change_hp,
        'App.Kaelin.Effect.hp.change': App$Kaelin$Effect$hp$change,
        'App.Kaelin.Effect.hp.damage': App$Kaelin$Effect$hp$damage,
        'App.Kaelin.Skill.fireball': App$Kaelin$Skill$fireball,
        'App.Kaelin.Heroes.Croni.skills.fireball': App$Kaelin$Heroes$Croni$skills$fireball,
        'App.Kaelin.Effect.ap.burn': App$Kaelin$Effect$ap$burn,
        'App.Kaelin.Map.creature.change_ap': App$Kaelin$Map$creature$change_ap,
        'App.Kaelin.Effect.ap.change': App$Kaelin$Effect$ap$change,
        'App.Kaelin.Effect.ap.restore': App$Kaelin$Effect$ap$restore,
        'App.Kaelin.Skill.ap_drain': App$Kaelin$Skill$ap_drain,
        'App.Kaelin.Heroes.Croni.skills.ap_drain': App$Kaelin$Heroes$Croni$skills$ap_drain,
        'App.Kaelin.Skill.ap_recover': App$Kaelin$Skill$ap_recover,
        'App.Kaelin.Heroes.Croni.skills.ap_recover': App$Kaelin$Heroes$Croni$skills$ap_recover,
        'App.Kaelin.Coord.Cubic.distance': App$Kaelin$Coord$Cubic$distance,
        'App.Kaelin.Coord.distance': App$Kaelin$Coord$distance,
        'App.Kaelin.Effect.movement.move_sup': App$Kaelin$Effect$movement$move_sup,
        'App.Kaelin.Map.Entity.creature': App$Kaelin$Map$Entity$creature,
        'App.Kaelin.Map.creature.pop': App$Kaelin$Map$creature$pop,
        'App.Kaelin.Map.creature.swap': App$Kaelin$Map$creature$swap,
        'App.Kaelin.Effect.movement.move': App$Kaelin$Effect$movement$move,
        'App.Kaelin.Skill.move': App$Kaelin$Skill$move,
        'App.Kaelin.Heroes.Croni.skills': App$Kaelin$Heroes$Croni$skills,
        'App.Kaelin.Heroes.Croni.hero': App$Kaelin$Heroes$Croni$hero,
        'App.Kaelin.Assets.hero.cyclope.vbox_idle': App$Kaelin$Assets$hero$cyclope$vbox_idle,
        'App.Kaelin.Assets.hero.cyclope.base64_idle': App$Kaelin$Assets$hero$cyclope$base64_idle,
        'App.Kaelin.Assets.hero.cyclope': App$Kaelin$Assets$hero$cyclope,
        'App.Kaelin.Heroes.Cyclope.skills.vampirism': App$Kaelin$Heroes$Cyclope$skills$vampirism,
        'App.Kaelin.Heroes.Cyclope.skills.ap_recover': App$Kaelin$Heroes$Cyclope$skills$ap_recover,
        'App.Kaelin.Heroes.Cyclope.skills': App$Kaelin$Heroes$Cyclope$skills,
        'App.Kaelin.Heroes.Cyclope.hero': App$Kaelin$Heroes$Cyclope$hero,
        'App.Kaelin.Assets.hero.lela.vbox_idle': App$Kaelin$Assets$hero$lela$vbox_idle,
        'App.Kaelin.Assets.hero.lela.base64_idle': App$Kaelin$Assets$hero$lela$base64_idle,
        'App.Kaelin.Assets.hero.lela': App$Kaelin$Assets$hero$lela,
        'App.Kaelin.Skill.restore': App$Kaelin$Skill$restore,
        'App.Kaelin.Heroes.Lela.skills.restore': App$Kaelin$Heroes$Lela$skills$restore,
        'App.Kaelin.Skill.escort': App$Kaelin$Skill$escort,
        'App.Kaelin.Heroes.Lela.skills.escort': App$Kaelin$Heroes$Lela$skills$escort,
        'U16.new': U16$new,
        'U16.from_nat': U16$from_nat,
        'App.Kaelin.Heroes.Lela.skills.ap_drain': App$Kaelin$Heroes$Lela$skills$ap_drain,
        'App.Kaelin.Heroes.Lela.skills.ap_recover': App$Kaelin$Heroes$Lela$skills$ap_recover,
        'App.Kaelin.Heroes.Lela.skills': App$Kaelin$Heroes$Lela$skills,
        'App.Kaelin.Heroes.Lela.hero': App$Kaelin$Heroes$Lela$hero,
        'App.Kaelin.Assets.hero.octoking.vbox_idle': App$Kaelin$Assets$hero$octoking$vbox_idle,
        'App.Kaelin.Assets.hero.octoking.base64_idle': App$Kaelin$Assets$hero$octoking$base64_idle,
        'App.Kaelin.Assets.hero.octoking': App$Kaelin$Assets$hero$octoking,
        'App.Kaelin.Effect.hp.heal': App$Kaelin$Effect$hp$heal,
        'App.Kaelin.Skill.empathy': App$Kaelin$Skill$empathy,
        'App.Kaelin.Heroes.Octoking.skills.Empathy': App$Kaelin$Heroes$Octoking$skills$Empathy,
        'I32.div': I32$div,
        'App.Kaelin.Skill.revenge': App$Kaelin$Skill$revenge,
        'App.Kaelin.Heroes.Octoking.skills.revenge': App$Kaelin$Heroes$Octoking$skills$revenge,
        'App.Kaelin.Skill.ground_slam': App$Kaelin$Skill$ground_slam,
        'App.Kaelin.Heroes.Octoking.skills.ground_slam': App$Kaelin$Heroes$Octoking$skills$ground_slam,
        'App.Kaelin.Heroes.Octoking.skills.ap_recover': App$Kaelin$Heroes$Octoking$skills$ap_recover,
        'App.Kaelin.Heroes.Octoking.skills': App$Kaelin$Heroes$Octoking$skills,
        'App.Kaelin.Heroes.Octoking.hero': App$Kaelin$Heroes$Octoking$hero,
        'App.Kaelin.Hero.info': App$Kaelin$Hero$info,
        'App.KL.Game.Stage.Draft.draw.cards.ally': App$KL$Game$Stage$Draft$draw$cards$ally,
        'App.KL.Game.Stage.Draft.draw.cards.allies': App$KL$Game$Stage$Draft$draw$cards$allies,
        'App.KL.Game.Stage.Draft.draw.cards.picks_right': App$KL$Game$Stage$Draft$draw$cards$picks_right,
        'App.KL.Game.Stage.Draft.draw.cards': App$KL$Game$Stage$Draft$draw$cards,
        'App.KL.Game.Stage.Draft.draw.top': App$KL$Game$Stage$Draft$draw$top,
        'App.KL.Game.Stage.Draft.draw.selection': App$KL$Game$Stage$Draft$draw$selection,
        'App.KL.Game.Stage.Draft.draw.menu': App$KL$Game$Stage$Draft$draw$menu,
        'App.KL.Game.Stage.Draft.draw.ready_button': App$KL$Game$Stage$Draft$draw$ready_button,
        'App.KL.Game.Stage.draft.draw.bottom': App$KL$Game$Stage$draft$draw$bottom,
        'List.count': List$count,
        'App.KL.Game.Stage.Draft.Team.show': App$KL$Game$Stage$Draft$Team$show,
        'App.KL.Game.Stage.Draft.draw.choose_team.button': App$KL$Game$Stage$Draft$draw$choose_team$button,
        'App.KL.Game.Stage.Draft.draw.choose_team': App$KL$Game$Stage$Draft$draw$choose_team,
        'App.KL.Game.Stage.Draft.draw.main': App$KL$Game$Stage$Draft$draw$main,
        'Map': Map,
        'App.KL.Game.Stage.Draft.draw': App$KL$Game$Stage$Draft$draw,
        'I32.to_U32': I32$to_U32,
        'I32.to_nat': I32$to_nat,
        'App.KL.Constants.center_x': App$KL$Constants$center_x,
        'App.KL.Constants.center_y': App$KL$Constants$center_y,
        'DOM.vbox': DOM$vbox,
        'Hexagonal.Axial.BBL.to_list': Hexagonal$Axial$BBL$to_list,
        'F64.sub': F64$sub,
        'Hexagonal.Axial.aux.floor': Hexagonal$Axial$aux$floor,
        'Hexagonal.Axial.aux.round_F64': Hexagonal$Axial$aux$round_F64,
        'F64.gtn': F64$gtn,
        'Hexagonal.Axial.aux.abs_diff': Hexagonal$Axial$aux$abs_diff,
        'Hexagonal.Axial.round': Hexagonal$Axial$round,
        'Hexagonal.Axial.from_screen_xy': Hexagonal$Axial$from_screen_xy,
        'App.KL.Constants.hexagon_radius': App$KL$Constants$hexagon_radius,
        'App.KL.Game.Indicator.background': App$KL$Game$Indicator$background,
        'I32.cmp': I32$cmp,
        'Hexagonal.Axial.cmp': Hexagonal$Axial$cmp,
        'Hexagonal.Axial.BBL.get': Hexagonal$Axial$BBL$get,
        'App.KL.Game.Stage.Board.draw.get_indicator': App$KL$Game$Stage$Board$draw$get_indicator,
        'Hexagonal.Axial.to_screen_xy': Hexagonal$Axial$to_screen_xy,
        'App.KL.Game.Stage.Board.draw.centralize': App$KL$Game$Stage$Board$draw$centralize,
        'App.Kaelin.Assets.tile.green_1': App$Kaelin$Assets$tile$green_1,
        'App.Kaelin.Assets.tile.effect.light_red2': App$Kaelin$Assets$tile$effect$light_red2,
        'App.Kaelin.Assets.tile.effect.dark_blue2': App$Kaelin$Assets$tile$effect$dark_blue2,
        'App.Kaelin.Assets.tile.green_2': App$Kaelin$Assets$tile$green_2,
        'App.KL.Game.Field.new': App$KL$Game$Field$new,
        'App.KL.Game.Field.Grass.field': App$KL$Game$Field$Grass$field,
        'App.KL.Game.Field.list': App$KL$Game$Field$list,
        'App.KL.Game.Field.get_by_id.map': App$KL$Game$Field$get_by_id$map,
        'App.KL.Game.Field.get_by_id': App$KL$Game$Field$get_by_id,
        'App.KL.Game.Field.get_by_id.default': App$KL$Game$Field$get_by_id$default,
        'VoxBox.get_len': VoxBox$get_len,
        'Array.get': Array$get,
        'Buffer32.get': Buffer32$get,
        'VoxBox.get_pos': VoxBox$get_pos,
        'VoxBox.get_col': VoxBox$get_col,
        'Word.and': Word$and,
        'U32.and': U32$and,
        'U32.shr': U32$shr,
        'VoxBox.Draw.image': VoxBox$Draw$image,
        'App.KL.Game.Stage.Board.draw.centralize_letter': App$KL$Game$Stage$Board$draw$centralize_letter,
        'List.indices.u32': List$indices$u32,
        'String.to_list': String$to_list,
        'Bits.to_nat': Bits$to_nat,
        'Word.to_bits': Word$to_bits,
        'U16.show_hex': U16$show_hex,
        'PixelFont.get_img': PixelFont$get_img,
        'Pos32.get_x': Pos32$get_x,
        'Pos32.get_y': Pos32$get_y,
        'Pos32.get_z': Pos32$get_z,
        'VoxBox.Draw.text.char': VoxBox$Draw$text$char,
        'Pos32.add': Pos32$add,
        'VoxBox.Draw.text': VoxBox$Draw$text,
        'PixelFont.set_img': PixelFont$set_img,
        'Nat.to_u16': Nat$to_u16,
        'PixelFont.black.100': PixelFont$black$100,
        'PixelFont.black.101': PixelFont$black$101,
        'PixelFont.black.102': PixelFont$black$102,
        'PixelFont.black.103': PixelFont$black$103,
        'PixelFont.black.104': PixelFont$black$104,
        'PixelFont.black.105': PixelFont$black$105,
        'PixelFont.black.106': PixelFont$black$106,
        'PixelFont.black.107': PixelFont$black$107,
        'PixelFont.black.108': PixelFont$black$108,
        'PixelFont.black.109': PixelFont$black$109,
        'PixelFont.black.110': PixelFont$black$110,
        'PixelFont.black.111': PixelFont$black$111,
        'PixelFont.black.112': PixelFont$black$112,
        'PixelFont.black.113': PixelFont$black$113,
        'PixelFont.black.114': PixelFont$black$114,
        'PixelFont.black.115': PixelFont$black$115,
        'PixelFont.black.116': PixelFont$black$116,
        'PixelFont.black.117': PixelFont$black$117,
        'PixelFont.black.118': PixelFont$black$118,
        'PixelFont.black.119': PixelFont$black$119,
        'PixelFont.black.120': PixelFont$black$120,
        'PixelFont.black.121': PixelFont$black$121,
        'PixelFont.black.122': PixelFont$black$122,
        'PixelFont.black.123': PixelFont$black$123,
        'PixelFont.black.124': PixelFont$black$124,
        'PixelFont.black.125': PixelFont$black$125,
        'PixelFont.black.126': PixelFont$black$126,
        'PixelFont.black.32': PixelFont$black$32,
        'PixelFont.black.33': PixelFont$black$33,
        'PixelFont.black.34': PixelFont$black$34,
        'PixelFont.black.35': PixelFont$black$35,
        'PixelFont.black.36': PixelFont$black$36,
        'PixelFont.black.37': PixelFont$black$37,
        'PixelFont.black.38': PixelFont$black$38,
        'PixelFont.black.39': PixelFont$black$39,
        'PixelFont.black.40': PixelFont$black$40,
        'PixelFont.black.41': PixelFont$black$41,
        'PixelFont.black.42': PixelFont$black$42,
        'PixelFont.black.43': PixelFont$black$43,
        'PixelFont.black.44': PixelFont$black$44,
        'PixelFont.black.45': PixelFont$black$45,
        'PixelFont.black.46': PixelFont$black$46,
        'PixelFont.black.47': PixelFont$black$47,
        'PixelFont.black.48': PixelFont$black$48,
        'PixelFont.black.49': PixelFont$black$49,
        'PixelFont.black.50': PixelFont$black$50,
        'PixelFont.black.51': PixelFont$black$51,
        'PixelFont.black.52': PixelFont$black$52,
        'PixelFont.black.53': PixelFont$black$53,
        'PixelFont.black.54': PixelFont$black$54,
        'PixelFont.black.55': PixelFont$black$55,
        'PixelFont.black.56': PixelFont$black$56,
        'PixelFont.black.57': PixelFont$black$57,
        'PixelFont.black.58': PixelFont$black$58,
        'PixelFont.black.59': PixelFont$black$59,
        'PixelFont.black.60': PixelFont$black$60,
        'PixelFont.black.61': PixelFont$black$61,
        'PixelFont.black.62': PixelFont$black$62,
        'PixelFont.black.63': PixelFont$black$63,
        'PixelFont.black.64': PixelFont$black$64,
        'PixelFont.black.65': PixelFont$black$65,
        'PixelFont.black.66': PixelFont$black$66,
        'PixelFont.black.67': PixelFont$black$67,
        'PixelFont.black.68': PixelFont$black$68,
        'PixelFont.black.69': PixelFont$black$69,
        'PixelFont.black.70': PixelFont$black$70,
        'PixelFont.black.71': PixelFont$black$71,
        'PixelFont.black.72': PixelFont$black$72,
        'PixelFont.black.73': PixelFont$black$73,
        'PixelFont.black.74': PixelFont$black$74,
        'PixelFont.black.75': PixelFont$black$75,
        'PixelFont.black.76': PixelFont$black$76,
        'PixelFont.black.77': PixelFont$black$77,
        'PixelFont.black.78': PixelFont$black$78,
        'PixelFont.black.79': PixelFont$black$79,
        'PixelFont.black.80': PixelFont$black$80,
        'PixelFont.black.81': PixelFont$black$81,
        'PixelFont.black.82': PixelFont$black$82,
        'PixelFont.black.83': PixelFont$black$83,
        'PixelFont.black.84': PixelFont$black$84,
        'PixelFont.black.85': PixelFont$black$85,
        'PixelFont.black.86': PixelFont$black$86,
        'PixelFont.black.87': PixelFont$black$87,
        'PixelFont.black.88': PixelFont$black$88,
        'PixelFont.black.89': PixelFont$black$89,
        'PixelFont.black.90': PixelFont$black$90,
        'PixelFont.black.91': PixelFont$black$91,
        'PixelFont.black.92': PixelFont$black$92,
        'PixelFont.black.93': PixelFont$black$93,
        'PixelFont.black.94': PixelFont$black$94,
        'PixelFont.black.95': PixelFont$black$95,
        'PixelFont.black.96': PixelFont$black$96,
        'PixelFont.black.97': PixelFont$black$97,
        'PixelFont.black.98': PixelFont$black$98,
        'PixelFont.black.99': PixelFont$black$99,
        'PixelFont.black.darkness': PixelFont$black$darkness,
        'PixelFont.black.earth': PixelFont$black$earth,
        'PixelFont.black': PixelFont$black,
        'App.KL.Game.Stage.Board.draw.pick_letter': App$KL$Game$Stage$Board$draw$pick_letter,
        'App.KL.Game.Stage.Board.draw.tile.terrain': App$KL$Game$Stage$Board$draw$tile$terrain,
        'App.KL.Game.Stage.Board.draw.hero': App$KL$Game$Stage$Board$draw$hero,
        'App.KL.Game.Stage.Board.draw.tile.creature': App$KL$Game$Stage$Board$draw$tile$creature,
        'App.KL.Game.Stage.Board.draw.board': App$KL$Game$Stage$Board$draw$board,
        'Hexagonal.Axial.BBL': Hexagonal$Axial$BBL,
        'Debug.log': Debug$log,
        'Word.show': Word$show,
        'U32.show': U32$show,
        'App.Kaelin.Assets.tile.mouse_ui': App$Kaelin$Assets$tile$mouse_ui,
        'App.KL.Game.Stage.Board.draw.mouse_ui': App$KL$Game$Stage$Board$draw$mouse_ui,
        'App.KL.Game.Stage.Board.draw.canvas': App$KL$Game$Stage$Board$draw$canvas,
        'App.KL.Game.Stage.Board.draw': App$KL$Game$Stage$Board$draw,
        'App.KL.Game.draw': App$KL$Game$draw,
        'App.KL.draw': App$KL$draw,
        'IO': IO,
        'App.State.local': App$State$local,
        'String.map': String$map,
        'U16.gte': U16$gte,
        'U16.lte': U16$lte,
        'U16.add': U16$add,
        'Char.to_lower': Char$to_lower,
        'String.to_lower': String$to_lower,
        'IO.ask': IO$ask,
        'IO.bind': IO$bind,
        'IO.end': IO$end,
        'IO.monad': IO$monad,
        'App.set_local': App$set_local,
        'App.pass': App$pass,
        'Nat.read': Nat$read,
        'IO.get_time': IO$get_time,
        'Nat.random': Nat$random,
        'IO.random': IO$random,
        'String.drop': String$drop,
        'String.length.go': String$length$go,
        'String.length': String$length,
        'IO.do': IO$do,
        'App.do': App$do,
        'App.watch': App$watch,
        'App.new_post': App$new_post,
        'String.take': String$take,
        'String.pad_right': String$pad_right,
        'String.pad_right_exact': String$pad_right_exact,
        'Bits.hex.encode': Bits$hex$encode,
        'Serializer.run': Serializer$run,
        'App.KL.Game.Team.serializer': App$KL$Game$Team$serializer,
        'Word.serializer': Word$serializer,
        'U8.serializer': U8$serializer,
        'I32.serializer': I32$serializer,
        'Hexagonal.Axial.serializer': Hexagonal$Axial$serializer,
        'App.KL.Global.Event.serializer': App$KL$Global$Event$serializer,
        'App.KL.Global.Event.serialize_post': App$KL$Global$Event$serialize_post,
        'App.KL.Global.Event.join_room': App$KL$Global$Event$join_room,
        'App.KL.State.Local.game': App$KL$State$Local$game,
        'App.KL.Game.State.Local.new': App$KL$Game$State$Local$new,
        'App.KL.Lobby.when': App$KL$Lobby$when,
        'Char.eql': Char$eql,
        'String.starts_with': String$starts_with,
        'Word.mod': Word$mod,
        'U32.mod': U32$mod,
        'Hexagonal.Axial.from_nat': Hexagonal$Axial$from_nat,
        'App.KL.Global.Event.set_init_pos': App$KL$Global$Event$set_init_pos,
        'App.KL.Game.Hero.name_to_id.map': App$KL$Game$Hero$name_to_id$map,
        'App.KL.Game.Hero.name_to_id': App$KL$Game$Hero$name_to_id,
        'App.KL.Global.Event.set_hero': App$KL$Global$Event$set_hero,
        'App.KL.Global.Event.set_ready': App$KL$Global$Event$set_ready,
        'App.KL.Global.Event.set_team': App$KL$Global$Event$set_team,
        'App.KL.Game.Stage.Draft.when': App$KL$Game$Stage$Draft$when,
        'Char.to_string': Char$to_string,
        'App.KL.Game.Casts.new': App$KL$Game$Casts$new,
        'Hexagonal.Axial.BBL.new': Hexagonal$Axial$BBL$new,
        'Hexagonal.Axial.BBL.from_list': Hexagonal$Axial$BBL$from_list,
        'App.KL.Game.Indicator.blue': App$KL$Game$Indicator$blue,
        'Hexagonal.Axial.BBL.insert': Hexagonal$Axial$BBL$insert,
        'App.KL.Game.Stage.Board.when': App$KL$Game$Stage$Board$when,
        'App.KL.Game.when': App$KL$Game$when,
        'App.KL.when': App$KL$when,
        'App.State.global': App$State$global,
        'App.KL.Game.new': App$KL$Game$new,
        'U64.add': U64$add,
        'App.KL.Game.Stage.board': App$KL$Game$Stage$board,
        'App.KL.Game.Terrain.new': App$KL$Game$Terrain$new,
        'App.KL.Game.Entity.terrain': App$KL$Game$Entity$terrain,
        'Hexagonal.Cubic.new': Hexagonal$Cubic$new,
        'Hexagonal.Axial.to_cubic': Hexagonal$Axial$to_cubic,
        'Hexagonal.Axial.inside': Hexagonal$Axial$inside,
        'App.KL.Game.Board.get': App$KL$Game$Board$get,
        'App.KL.Game.Tile.new': App$KL$Game$Tile$new,
        'App.KL.Game.Board.set': App$KL$Game$Board$set,
        'App.KL.Game.Board.push': App$KL$Game$Board$push,
        'App.KL.Game.Board.arena': App$KL$Game$Board$arena,
        'App.KL.Game.Stage.Draft.Hero.info': App$KL$Game$Stage$Draft$Hero$info,
        'App.KL.Game.Creature.new': App$KL$Game$Creature$new,
        'App.KL.Game.Stage.Draft.Tile.create_creature': App$KL$Game$Stage$Draft$Tile$create_creature,
        'App.KL.Game.Entity.creature': App$KL$Game$Entity$creature,
        'App.KL.Game.Stage.Draft.create_board': App$KL$Game$Stage$Draft$create_board,
        'App.KL.Global.tick': App$KL$Global$tick,
        'Deserializer.run': Deserializer$run,
        'Deserializer.Reply': Deserializer$Reply,
        'Deserializer.choice.go': Deserializer$choice$go,
        'Deserializer.choice': Deserializer$choice,
        'Deserializer': Deserializer,
        'Deserializer.bind': Deserializer$bind,
        'Deserializer.bits': Deserializer$bits,
        'Deserializer.pure': Deserializer$pure,
        'App.KL.Global.Event.void': App$KL$Global$Event$void,
        'App.KL.Game.Team.deserializer': App$KL$Game$Team$deserializer,
        'Deserializer.monad': Deserializer$monad,
        'Word.deserializer': Word$deserializer,
        'U8.deserializer': U8$deserializer,
        'I32.deserializer': I32$deserializer,
        'Hexagonal.Axial.deserializer': Hexagonal$Axial$deserializer,
        'App.KL.Global.Event.deserializer': App$KL$Global$Event$deserializer,
        'Bits.hex.decode': Bits$hex$decode,
        'App.KL.Global.Event.deserialize_post': App$KL$Global$Event$deserialize_post,
        'App.KL.Game.Stage.draft': App$KL$Game$Stage$draft,
        'App.KL.Game.start': App$KL$Game$start,
        'App.KL.Game.Player.new': App$KL$Game$Player$new,
        'App.KL.Game.Stage.Draft.has_hero': App$KL$Game$Stage$Draft$has_hero,
        'Bool.or': Bool$or,
        'App.KL.Game.Stage.Draft.has_coord': App$KL$Game$Stage$Draft$has_coord,
        'App.KL.Global.post': App$KL$Global$post,
        'App.KL': App$KL,
    };
})();

/***/ })

}]);
//# sourceMappingURL=967.index.js.map