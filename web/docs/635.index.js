(self["webpackChunkkind_web"] = self["webpackChunkkind_web"] || []).push([[635],{

/***/ 635:
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
    const App$Kaelin$Constants$room = "0x78414442332238";
    const Maybe$none = ({
        _: 'Maybe.none'
    });

    function App$Kaelin$Coord$new$(_i$1, _j$2) {
        var $149 = ({
            _: 'App.Kaelin.Coord.new',
            'i': _i$1,
            'j': _j$2
        });
        return $149;
    };
    const App$Kaelin$Coord$new = x0 => x1 => App$Kaelin$Coord$new$(x0, x1);

    function Maybe$default$(_m$2, _a$3) {
        var self = _m$2;
        switch (self._) {
            case 'Maybe.some':
                var $151 = self.value;
                var $152 = $151;
                var $150 = $152;
                break;
            case 'Maybe.none':
                var $153 = _a$3;
                var $150 = $153;
                break;
        };
        return $150;
    };
    const Maybe$default = x0 => x1 => Maybe$default$(x0, x1);

    function Cmp$as_eql$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
            case 'Cmp.gtn':
                var $155 = Bool$false;
                var $154 = $155;
                break;
            case 'Cmp.eql':
                var $156 = Bool$true;
                var $154 = $156;
                break;
        };
        return $154;
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
                var $158 = self.pred;
                var $159 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $161 = self.pred;
                            var $162 = (_a$pred$10 => {
                                var $163 = Word$cmp$go$(_a$pred$10, $161, _c$4);
                                return $163;
                            });
                            var $160 = $162;
                            break;
                        case 'Word.i':
                            var $164 = self.pred;
                            var $165 = (_a$pred$10 => {
                                var $166 = Word$cmp$go$(_a$pred$10, $164, Cmp$ltn);
                                return $166;
                            });
                            var $160 = $165;
                            break;
                        case 'Word.e':
                            var $167 = (_a$pred$8 => {
                                var $168 = _c$4;
                                return $168;
                            });
                            var $160 = $167;
                            break;
                    };
                    var $160 = $160($158);
                    return $160;
                });
                var $157 = $159;
                break;
            case 'Word.i':
                var $169 = self.pred;
                var $170 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $172 = self.pred;
                            var $173 = (_a$pred$10 => {
                                var $174 = Word$cmp$go$(_a$pred$10, $172, Cmp$gtn);
                                return $174;
                            });
                            var $171 = $173;
                            break;
                        case 'Word.i':
                            var $175 = self.pred;
                            var $176 = (_a$pred$10 => {
                                var $177 = Word$cmp$go$(_a$pred$10, $175, _c$4);
                                return $177;
                            });
                            var $171 = $176;
                            break;
                        case 'Word.e':
                            var $178 = (_a$pred$8 => {
                                var $179 = _c$4;
                                return $179;
                            });
                            var $171 = $178;
                            break;
                    };
                    var $171 = $171($169);
                    return $171;
                });
                var $157 = $170;
                break;
            case 'Word.e':
                var $180 = (_b$5 => {
                    var $181 = _c$4;
                    return $181;
                });
                var $157 = $180;
                break;
        };
        var $157 = $157(_b$3);
        return $157;
    };
    const Word$cmp$go = x0 => x1 => x2 => Word$cmp$go$(x0, x1, x2);
    const Cmp$eql = ({
        _: 'Cmp.eql'
    });

    function Word$cmp$(_a$2, _b$3) {
        var $182 = Word$cmp$go$(_a$2, _b$3, Cmp$eql);
        return $182;
    };
    const Word$cmp = x0 => x1 => Word$cmp$(x0, x1);

    function Word$eql$(_a$2, _b$3) {
        var $183 = Cmp$as_eql$(Word$cmp$(_a$2, _b$3));
        return $183;
    };
    const Word$eql = x0 => x1 => Word$eql$(x0, x1);
    const U8$eql = a0 => a1 => (a0 === a1);

    function U8$new$(_value$1) {
        var $184 = word_to_u8(_value$1);
        return $184;
    };
    const U8$new = x0 => U8$new$(x0);
    const U8$from_nat = a0 => (Number(a0) & 0xFF);

    function Maybe$(_A$1) {
        var $185 = null;
        return $185;
    };
    const Maybe = x0 => Maybe$(x0);

    function Maybe$some$(_value$2) {
        var $186 = ({
            _: 'Maybe.some',
            'value': _value$2
        });
        return $186;
    };
    const Maybe$some = x0 => Maybe$some$(x0);

    function App$Kaelin$Hero$new$(_name$1, _assets$2, _max_hp$3, _max_ap$4, _skills$5) {
        var $187 = ({
            _: 'App.Kaelin.Hero.new',
            'name': _name$1,
            'assets': _assets$2,
            'max_hp': _max_hp$3,
            'max_ap': _max_ap$4,
            'skills': _skills$5
        });
        return $187;
    };
    const App$Kaelin$Hero$new = x0 => x1 => x2 => x3 => x4 => App$Kaelin$Hero$new$(x0, x1, x2, x3, x4);

    function App$Kaelin$HeroAssets$new$(_vbox$1, _base64$2) {
        var $188 = ({
            _: 'App.Kaelin.HeroAssets.new',
            'vbox': _vbox$1,
            'base64': _base64$2
        });
        return $188;
    };
    const App$Kaelin$HeroAssets$new = x0 => x1 => App$Kaelin$HeroAssets$new$(x0, x1);
    const Nat$ltn = a0 => a1 => (a0 < a1);
    const Nat$sub = a0 => a1 => (a0 - a1 <= 0n ? 0n : a0 - a1);

    function Cmp$as_gte$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
                var $190 = Bool$false;
                var $189 = $190;
                break;
            case 'Cmp.eql':
            case 'Cmp.gtn':
                var $191 = Bool$true;
                var $189 = $191;
                break;
        };
        return $189;
    };
    const Cmp$as_gte = x0 => Cmp$as_gte$(x0);

    function Word$gte$(_a$2, _b$3) {
        var $192 = Cmp$as_gte$(Word$cmp$(_a$2, _b$3));
        return $192;
    };
    const Word$gte = x0 => x1 => Word$gte$(x0, x1);

    function Pair$(_A$1, _B$2) {
        var $193 = null;
        return $193;
    };
    const Pair = x0 => x1 => Pair$(x0, x1);

    function Pair$new$(_fst$3, _snd$4) {
        var $194 = ({
            _: 'Pair.new',
            'fst': _fst$3,
            'snd': _snd$4
        });
        return $194;
    };
    const Pair$new = x0 => x1 => Pair$new$(x0, x1);

    function Word$or$(_a$2, _b$3) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $196 = self.pred;
                var $197 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $199 = self.pred;
                            var $200 = (_a$pred$9 => {
                                var $201 = Word$o$(Word$or$(_a$pred$9, $199));
                                return $201;
                            });
                            var $198 = $200;
                            break;
                        case 'Word.i':
                            var $202 = self.pred;
                            var $203 = (_a$pred$9 => {
                                var $204 = Word$i$(Word$or$(_a$pred$9, $202));
                                return $204;
                            });
                            var $198 = $203;
                            break;
                        case 'Word.e':
                            var $205 = (_a$pred$7 => {
                                var $206 = Word$e;
                                return $206;
                            });
                            var $198 = $205;
                            break;
                    };
                    var $198 = $198($196);
                    return $198;
                });
                var $195 = $197;
                break;
            case 'Word.i':
                var $207 = self.pred;
                var $208 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $210 = self.pred;
                            var $211 = (_a$pred$9 => {
                                var $212 = Word$i$(Word$or$(_a$pred$9, $210));
                                return $212;
                            });
                            var $209 = $211;
                            break;
                        case 'Word.i':
                            var $213 = self.pred;
                            var $214 = (_a$pred$9 => {
                                var $215 = Word$i$(Word$or$(_a$pred$9, $213));
                                return $215;
                            });
                            var $209 = $214;
                            break;
                        case 'Word.e':
                            var $216 = (_a$pred$7 => {
                                var $217 = Word$e;
                                return $217;
                            });
                            var $209 = $216;
                            break;
                    };
                    var $209 = $209($207);
                    return $209;
                });
                var $195 = $208;
                break;
            case 'Word.e':
                var $218 = (_b$4 => {
                    var $219 = Word$e;
                    return $219;
                });
                var $195 = $218;
                break;
        };
        var $195 = $195(_b$3);
        return $195;
    };
    const Word$or = x0 => x1 => Word$or$(x0, x1);

    function Word$shift_right$one$go$(_word$2) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $221 = self.pred;
                var $222 = Word$o$(Word$shift_right$one$go$($221));
                var $220 = $222;
                break;
            case 'Word.i':
                var $223 = self.pred;
                var $224 = Word$i$(Word$shift_right$one$go$($223));
                var $220 = $224;
                break;
            case 'Word.e':
                var $225 = Word$o$(Word$e);
                var $220 = $225;
                break;
        };
        return $220;
    };
    const Word$shift_right$one$go = x0 => Word$shift_right$one$go$(x0);

    function Word$shift_right$one$(_word$2) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $227 = self.pred;
                var $228 = Word$shift_right$one$go$($227);
                var $226 = $228;
                break;
            case 'Word.i':
                var $229 = self.pred;
                var $230 = Word$shift_right$one$go$($229);
                var $226 = $230;
                break;
            case 'Word.e':
                var $231 = Word$e;
                var $226 = $231;
                break;
        };
        return $226;
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
                    var $232 = _value$3;
                    return $232;
                } else {
                    var $233 = (self - 1n);
                    var $234 = Word$shift_right$($233, Word$shift_right$one$(_value$3));
                    return $234;
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
                var $236 = self.pred;
                var $237 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $239 = self.pred;
                            var $240 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $242 = Word$i$(Word$subber$(_a$pred$10, $239, Bool$true));
                                    var $241 = $242;
                                } else {
                                    var $243 = Word$o$(Word$subber$(_a$pred$10, $239, Bool$false));
                                    var $241 = $243;
                                };
                                return $241;
                            });
                            var $238 = $240;
                            break;
                        case 'Word.i':
                            var $244 = self.pred;
                            var $245 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $247 = Word$o$(Word$subber$(_a$pred$10, $244, Bool$true));
                                    var $246 = $247;
                                } else {
                                    var $248 = Word$i$(Word$subber$(_a$pred$10, $244, Bool$true));
                                    var $246 = $248;
                                };
                                return $246;
                            });
                            var $238 = $245;
                            break;
                        case 'Word.e':
                            var $249 = (_a$pred$8 => {
                                var $250 = Word$e;
                                return $250;
                            });
                            var $238 = $249;
                            break;
                    };
                    var $238 = $238($236);
                    return $238;
                });
                var $235 = $237;
                break;
            case 'Word.i':
                var $251 = self.pred;
                var $252 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $254 = self.pred;
                            var $255 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $257 = Word$o$(Word$subber$(_a$pred$10, $254, Bool$false));
                                    var $256 = $257;
                                } else {
                                    var $258 = Word$i$(Word$subber$(_a$pred$10, $254, Bool$false));
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
                                    var $262 = Word$i$(Word$subber$(_a$pred$10, $259, Bool$true));
                                    var $261 = $262;
                                } else {
                                    var $263 = Word$o$(Word$subber$(_a$pred$10, $259, Bool$false));
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
                var $235 = $252;
                break;
            case 'Word.e':
                var $266 = (_b$5 => {
                    var $267 = Word$e;
                    return $267;
                });
                var $235 = $266;
                break;
        };
        var $235 = $235(_b$3);
        return $235;
    };
    const Word$subber = x0 => x1 => x2 => Word$subber$(x0, x1, x2);

    function Word$sub$(_a$2, _b$3) {
        var $268 = Word$subber$(_a$2, _b$3, Bool$false);
        return $268;
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
                    var $269 = Pair$new$(Bool$true, Word$or$(_value$5, _mask$6));
                    var self = $269;
                } else {
                    var $270 = Pair$new$(Bool$false, _value$5);
                    var self = $270;
                };
                switch (self._) {
                    case 'Pair.new':
                        var $271 = self.fst;
                        var $272 = self.snd;
                        var self = _shift$2;
                        if (self === 0n) {
                            var $274 = $272;
                            var $273 = $274;
                        } else {
                            var $275 = (self - 1n);
                            var _new_shift_copy$9 = Word$shift_right$(1n, _shift_copy$4);
                            var self = $271;
                            if (self) {
                                var $277 = Word$div$go$($275, Word$sub$(_sub_copy$3, _shift_copy$4), _new_shift_copy$9, $272);
                                var $276 = $277;
                            } else {
                                var $278 = Word$div$go$($275, _sub_copy$3, _new_shift_copy$9, $272);
                                var $276 = $278;
                            };
                            var $273 = $276;
                        };
                        return $273;
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
            var $280 = Word$to_zero$(_a$2);
            var $279 = $280;
        } else {
            var _shift$6 = (_a_bits$4 - _b_bits$5 <= 0n ? 0n : _a_bits$4 - _b_bits$5);
            var _shift_copy$7 = Word$shift_left$(_shift$6, _b$3);
            var $281 = Word$div$go$(_shift$6, _a$2, _shift_copy$7, Word$to_zero$(_a$2));
            var $279 = $281;
        };
        return $279;
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
        var $282 = (parseInt(_chr$3, 16));
        return $282;
    };
    const VoxBox$parse_byte = x0 => x1 => VoxBox$parse_byte$(x0, x1);
    const U32$or = a0 => a1 => (a0 | a1);

    function Word$fold$(_nil$3, _w0$4, _w1$5, _word$6) {
        var self = _word$6;
        switch (self._) {
            case 'Word.o':
                var $284 = self.pred;
                var $285 = _w0$4(Word$fold$(_nil$3, _w0$4, _w1$5, $284));
                var $283 = $285;
                break;
            case 'Word.i':
                var $286 = self.pred;
                var $287 = _w1$5(Word$fold$(_nil$3, _w0$4, _w1$5, $286));
                var $283 = $287;
                break;
            case 'Word.e':
                var $288 = _nil$3;
                var $283 = $288;
                break;
        };
        return $283;
    };
    const Word$fold = x0 => x1 => x2 => x3 => Word$fold$(x0, x1, x2, x3);
    const Nat$add = a0 => a1 => (a0 + a1);
    const Nat$mul = a0 => a1 => (a0 * a1);

    function Word$to_nat$(_word$2) {
        var $289 = Word$fold$(0n, a1 => (2n * a1), (_x$4 => {
            var $290 = Nat$succ$((2n * _x$4));
            return $290;
        }), _word$2);
        return $289;
    };
    const Word$to_nat = x0 => Word$to_nat$(x0);

    function Word$shl$(_n$2, _value$3) {
        var _n_nat$4 = Word$to_nat$(_n$2);
        var $291 = Word$shift_left$(_n_nat$4, _value$3);
        return $291;
    };
    const Word$shl = x0 => x1 => Word$shl$(x0, x1);
    const U32$shl = a0 => a1 => ((a0 << a1) >>> 0);
    const Pos32$new = a0 => a1 => a2 => ((0 | a0 | (a1 << 12) | (a2 << 24)));
    const Col32$new = a0 => a1 => a2 => a3 => ((0 | a0 | (a1 << 8) | (a2 << 16) | (a3 << 24)));

    function Word$trim$(_new_size$2, _word$3) {
        var self = _new_size$2;
        if (self === 0n) {
            var $293 = Word$e;
            var $292 = $293;
        } else {
            var $294 = (self - 1n);
            var self = _word$3;
            switch (self._) {
                case 'Word.o':
                    var $296 = self.pred;
                    var $297 = Word$o$(Word$trim$($294, $296));
                    var $295 = $297;
                    break;
                case 'Word.i':
                    var $298 = self.pred;
                    var $299 = Word$i$(Word$trim$($294, $298));
                    var $295 = $299;
                    break;
                case 'Word.e':
                    var $300 = Word$o$(Word$trim$($294, Word$e));
                    var $295 = $300;
                    break;
            };
            var $292 = $295;
        };
        return $292;
    };
    const Word$trim = x0 => x1 => Word$trim$(x0, x1);
    const Unit$new = null;

    function Array$extract_tip$(_arr$2) {
        var self = _arr$2;
        switch (self._) {
            case 'Array.tip':
                var $302 = self.value;
                var $303 = $302;
                var $301 = $303;
                break;
            case 'Array.tie':
                var $304 = Unit$new;
                var $301 = $304;
                break;
        };
        return $301;
    };
    const Array$extract_tip = x0 => Array$extract_tip$(x0);

    function Array$extract_tie$(_arr$3) {
        var self = _arr$3;
        switch (self._) {
            case 'Array.tie':
                var $306 = self.lft;
                var $307 = self.rgt;
                var $308 = Pair$new$($306, $307);
                var $305 = $308;
                break;
            case 'Array.tip':
                var $309 = Unit$new;
                var $305 = $309;
                break;
        };
        return $305;
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
                        var $310 = self.pred;
                        var $311 = Word$foldl$(_w0$4(_nil$3), _w0$4, _w1$5, $310);
                        return $311;
                    case 'Word.i':
                        var $312 = self.pred;
                        var $313 = Word$foldl$(_w1$5(_nil$3), _w0$4, _w1$5, $312);
                        return $313;
                    case 'Word.e':
                        var $314 = _nil$3;
                        return $314;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Word$foldl = x0 => x1 => x2 => x3 => Word$foldl$(x0, x1, x2, x3);

    function Array$mut$(_idx$3, _f$4, _arr$5) {
        var $315 = Word$foldl$((_arr$6 => {
            var $316 = Array$tip$(_f$4(Array$extract_tip$(_arr$6)));
            return $316;
        }), (_rec$7 => _arr$8 => {
            var self = Array$extract_tie$(_arr$8);
            switch (self._) {
                case 'Pair.new':
                    var $318 = self.fst;
                    var $319 = self.snd;
                    var $320 = Array$tie$(_rec$7($318), $319);
                    var $317 = $320;
                    break;
            };
            return $317;
        }), (_rec$7 => _arr$8 => {
            var self = Array$extract_tie$(_arr$8);
            switch (self._) {
                case 'Pair.new':
                    var $322 = self.fst;
                    var $323 = self.snd;
                    var $324 = Array$tie$($322, _rec$7($323));
                    var $321 = $324;
                    break;
            };
            return $321;
        }), _idx$3)(_arr$5);
        return $315;
    };
    const Array$mut = x0 => x1 => x2 => Array$mut$(x0, x1, x2);

    function Array$set$(_idx$3, _val$4, _arr$5) {
        var $325 = Array$mut$(_idx$3, (_x$6 => {
            var $326 = _val$4;
            return $326;
        }), _arr$5);
        return $325;
    };
    const Array$set = x0 => x1 => x2 => Array$set$(x0, x1, x2);
    const Buffer32$set = a0 => a1 => a2 => ((a2[a0] = a1, a2));
    const VoxBox$set_pos = a0 => a1 => a2 => ((a2.buffer[a0 * 2] = a1, a2));
    const VoxBox$set_col = a0 => a1 => a2 => ((a2.buffer[a0 * 2 + 1] = a1, a2));

    function VoxBox$set_length$(_length$1, _img$2) {
        var self = _img$2;
        switch (self._) {
            case 'VoxBox.new':
                var $328 = self.capacity;
                var $329 = self.buffer;
                var $330 = VoxBox$new$(_length$1, $328, $329);
                var $327 = $330;
                break;
        };
        return $327;
    };
    const VoxBox$set_length = x0 => x1 => VoxBox$set_length$(x0, x1);
    const VoxBox$push = a0 => a1 => a2 => ((a2.buffer[a2.length * 2] = a0, a2.buffer[a2.length * 2 + 1] = a1, a2.length++, a2));

    function VoxBox$parse$(_voxdata$1) {
        var _siz$2 = ((((_voxdata$1.length) >>> 0) / 12) >>> 0);
        var _img$3 = VoxBox$alloc_capacity$(_siz$2);
        var _img$4 = (() => {
            var $332 = _img$3;
            var $333 = 0;
            var $334 = _siz$2;
            let _img$5 = $332;
            for (let _i$4 = $333; _i$4 < $334; ++_i$4) {
                var _x$6 = VoxBox$parse_byte$(((((_i$4 * 6) >>> 0) + 0) >>> 0), _voxdata$1);
                var _y$7 = VoxBox$parse_byte$(((((_i$4 * 6) >>> 0) + 1) >>> 0), _voxdata$1);
                var _z$8 = VoxBox$parse_byte$(((((_i$4 * 6) >>> 0) + 2) >>> 0), _voxdata$1);
                var _r$9 = VoxBox$parse_byte$(((((_i$4 * 6) >>> 0) + 3) >>> 0), _voxdata$1);
                var _g$10 = VoxBox$parse_byte$(((((_i$4 * 6) >>> 0) + 4) >>> 0), _voxdata$1);
                var _b$11 = VoxBox$parse_byte$(((((_i$4 * 6) >>> 0) + 5) >>> 0), _voxdata$1);
                var _pos$12 = ((0 | _x$6 | (_y$7 << 12) | (_z$8 << 24)));
                var _col$13 = ((0 | _r$9 | (_g$10 << 8) | (_b$11 << 16) | (255 << 24)));
                var $332 = ((_img$5.buffer[_img$5.length * 2] = _pos$12, _img$5.buffer[_img$5.length * 2 + 1] = _col$13, _img$5.length++, _img$5));
                _img$5 = $332;
            };
            return _img$5;
        })();
        var $331 = _img$4;
        return $331;
    };
    const VoxBox$parse = x0 => VoxBox$parse$(x0);
    const App$Kaelin$Assets$hero$croni$vbox_idle = VoxBox$parse$("0f0b16351d4d100b16351d4d0d0c15351d4d0e0c15351d4d0f0c156a3a86100c158e4a9d110c15351d4d120c15351d4d0c0d14351d4d0d0d146a3a860e0d146a3a860f0d148e4a9d100d146a3a86110d146a3a86120d146a3a86130d14351d4d0b0e13351d4d0c0e136a3a860d0e136a3a860e0e136a3a860f0e136a3a86100e136a3a86110e136a3a86120e136a3a86130e136a3a86140e13351d4d0a0f12351d4d0b0f126a3a860c0f126a3a860d0f126a3a860e0f126a3a860f0f126a3a86100f126a3a86110f126a3a86120f126a3a86130f126a3a86140f126a3a86150f12351d4d0a1011351d4d0b10116a3a860c10116a3a860d10116a3a860e10116a3a860f10116a3a861010116a3a861110116a3a861210116a3a861310116a3a861410116a3a86151011351d4d091110351d4d0a11106a3a860b11106a3a860c11106a3a860d11106a3a860e11106a3a860f11106a3a861011106a3a861111106a3a861211106a3a861311106a3a861411106a3a861511106a3a86161110351d4d09120f351d4d0a120f6a3a860b120f6a3a860c120f602d800d120f602d800e120f6a3a860f120f6a3a8610120f6a3a8611120f6a3a8612120f602d8013120f602d8014120f6a3a8615120f6a3a8616120f351d4d09130e351d4d0a130e602d800b130e602d800c130e351d4d0d130e351d4d0e130e6a3a860f130e6a3a8610130e6a3a8611130e6a3a8612130e351d4d13130e351d4d14130e602d8015130e602d8016130e351d4d09140d351d4d0a140d602d800b140d351d4d0c140d351d4d0d140d531e480e140d351d4d0f140d6a3a8610140d6a3a8611140d351d4d12140d531e4813140d351d4d14140d351d4d15140d4a358016140d351d4d09150c351d4d0a150c4a35800b150c351d4d0c150c531e480d150cdf3e460e150c531e480f150c351d4d10150c351d4d11150c531e4812150cdf3e4613150c531e4814150c351d4d15150c4a358016150c351d4d0a160b351d4d0b160b4a35800c160b351d4d0d160b531e480e160b351d4d0f160b351d4d10160b351d4d11160b351d4d12160b531e4813160b351d4d14160b4a358015160b351d4d0b170a351d4d0c170a4a35800d170a8e4a9d0e170a351d4d0f170a351d4d10170a351d4d11170a351d4d12170a8e4a9d13170a4a358014170a351d4d0d1809351d4d0e1809602d800f1809602d801018094a3580111809602d80121809351d4d0c1908351d4d0d19086a3a860e19086a3a860f19086a3a861019084a35801119086a3a861219086a3a86131908351d4d0c1a07351d4d0d1a076a3a860e1a076a3a860f1a076a3a86101a074a3580111a076a3a86121a076a3a86131a07351d4d0c1b06351d4d0d1b068e4a9d0e1b066a3a860f1b066a3a86101b064a3580111b066a3a86121b068e4a9d131b06351d4d0d1c05351d4d0e1c05351d4d0f1c05351d4d101c05351d4d111c05351d4d121c05351d4d111d04351d4d121d04351d4d");
    const App$Kaelin$Assets$hero$croni$base64_idle = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB8AAAAeCAYAAADU8sWcAAAAAXNSR0IArs4c6QAAATtJREFUSIntlr1qwzAURo9KW0Ih4MVNFpsO2dLNeAh5hox9qz5MIQ/hwWQq3TpFS5ssgUBaLKg6uDI1/YmuSGgHf4vhk6xzr66vZOjUqVOnTv9NeTKzeTKzoe+fhkLr54RRNACwAKWeK8k6oskOnCcTAEbRgMfNczNW6kIUgAj+GfyTJAF4w33A0gBOfOHHkFfmkqydfLIXZ77bVuy2lbf/m7xbzS38sFkAkPfbO+H8MZk3XJS5A6TKUOqi8UtdkCrTzFn1Dgx3C6bKcHv11gTgwM6TSNRq8TBj/bQgVYalPWuNO8/N8Wk175qXeq5ysPEwYxonLO/vWuPT6xte1tobDAHHK9S7MI7qD2vVg8vXutbSs118sXzpeVNx0T93X7+VBPCnJ1wQ/OMa3evtU3DNv/OlNT+IQv9o3gF/BY+h0RNEhAAAAABJRU5ErkJggg==";
    const App$Kaelin$Assets$hero$croni = App$Kaelin$HeroAssets$new$(App$Kaelin$Assets$hero$croni$vbox_idle, App$Kaelin$Assets$hero$croni$base64_idle);

    function I32$new$(_value$1) {
        var $335 = word_to_i32(_value$1);
        return $335;
    };
    const I32$new = x0 => I32$new$(x0);

    function Word$neg$aux$(_word$2, _inc$3) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $337 = self.pred;
                var self = _inc$3;
                if (self) {
                    var $339 = Word$o$(Word$neg$aux$($337, Bool$true));
                    var $338 = $339;
                } else {
                    var $340 = Word$i$(Word$neg$aux$($337, Bool$false));
                    var $338 = $340;
                };
                var $336 = $338;
                break;
            case 'Word.i':
                var $341 = self.pred;
                var self = _inc$3;
                if (self) {
                    var $343 = Word$i$(Word$neg$aux$($341, Bool$false));
                    var $342 = $343;
                } else {
                    var $344 = Word$o$(Word$neg$aux$($341, Bool$false));
                    var $342 = $344;
                };
                var $336 = $342;
                break;
            case 'Word.e':
                var $345 = Word$e;
                var $336 = $345;
                break;
        };
        return $336;
    };
    const Word$neg$aux = x0 => x1 => Word$neg$aux$(x0, x1);

    function Word$neg$(_word$2) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $347 = self.pred;
                var $348 = Word$o$(Word$neg$aux$($347, Bool$true));
                var $346 = $348;
                break;
            case 'Word.i':
                var $349 = self.pred;
                var $350 = Word$i$(Word$neg$aux$($349, Bool$false));
                var $346 = $350;
                break;
            case 'Word.e':
                var $351 = Word$e;
                var $346 = $351;
                break;
        };
        return $346;
    };
    const Word$neg = x0 => Word$neg$(x0);
    const I32$neg = a0 => ((-a0));
    const Int$to_i32 = a0 => (Number(a0));
    const Int$new = a0 => a1 => (a0 - a1);
    const Int$from_nat = a0 => (a0);
    const I32$from_nat = a0 => (Number(a0));

    function List$cons$(_head$2, _tail$3) {
        var $352 = ({
            _: 'List.cons',
            'head': _head$2,
            'tail': _tail$3
        });
        return $352;
    };
    const List$cons = x0 => x1 => List$cons$(x0, x1);

    function App$Kaelin$Skill$new$(_name$1, _range$2, _ap_cost$3, _effect$4, _key$5) {
        var $353 = ({
            _: 'App.Kaelin.Skill.new',
            'name': _name$1,
            'range': _range$2,
            'ap_cost': _ap_cost$3,
            'effect': _effect$4,
            'key': _key$5
        });
        return $353;
    };
    const App$Kaelin$Skill$new = x0 => x1 => x2 => x3 => x4 => App$Kaelin$Skill$new$(x0, x1, x2, x3, x4);

    function App$Kaelin$Effect$Result$(_A$1) {
        var $354 = null;
        return $354;
    };
    const App$Kaelin$Effect$Result = x0 => App$Kaelin$Effect$Result$(x0);

    function List$(_A$1) {
        var $355 = null;
        return $355;
    };
    const List = x0 => List$(x0);

    function List$concat$(_as$2, _bs$3) {
        var self = _as$2;
        switch (self._) {
            case 'List.cons':
                var $357 = self.head;
                var $358 = self.tail;
                var $359 = List$cons$($357, List$concat$($358, _bs$3));
                var $356 = $359;
                break;
            case 'List.nil':
                var $360 = _bs$3;
                var $356 = $360;
                break;
        };
        return $356;
    };
    const List$concat = x0 => x1 => List$concat$(x0, x1);

    function BitsMap$(_A$1) {
        var $361 = null;
        return $361;
    };
    const BitsMap = x0 => BitsMap$(x0);

    function BitsMap$tie$(_val$2, _lft$3, _rgt$4) {
        var $362 = ({
            _: 'BitsMap.tie',
            'val': _val$2,
            'lft': _lft$3,
            'rgt': _rgt$4
        });
        return $362;
    };
    const BitsMap$tie = x0 => x1 => x2 => BitsMap$tie$(x0, x1, x2);

    function BitsMap$union$(_a$2, _b$3) {
        var self = _a$2;
        switch (self._) {
            case 'BitsMap.tie':
                var $364 = self.val;
                var $365 = self.lft;
                var $366 = self.rgt;
                var self = _b$3;
                switch (self._) {
                    case 'BitsMap.tie':
                        var $368 = self.val;
                        var $369 = self.lft;
                        var $370 = self.rgt;
                        var self = $364;
                        switch (self._) {
                            case 'Maybe.none':
                                var $372 = BitsMap$tie$($368, BitsMap$union$($365, $369), BitsMap$union$($366, $370));
                                var $371 = $372;
                                break;
                            case 'Maybe.some':
                                var $373 = BitsMap$tie$($364, BitsMap$union$($365, $369), BitsMap$union$($366, $370));
                                var $371 = $373;
                                break;
                        };
                        var $367 = $371;
                        break;
                    case 'BitsMap.new':
                        var $374 = _a$2;
                        var $367 = $374;
                        break;
                };
                var $363 = $367;
                break;
            case 'BitsMap.new':
                var $375 = _b$3;
                var $363 = $375;
                break;
        };
        return $363;
    };
    const BitsMap$union = x0 => x1 => BitsMap$union$(x0, x1);

    function NatMap$union$(_a$2, _b$3) {
        var $376 = BitsMap$union$(_a$2, _b$3);
        return $376;
    };
    const NatMap$union = x0 => x1 => NatMap$union$(x0, x1);

    function App$Kaelin$Effect$Result$new$(_value$2, _map$3, _futures$4, _indicators$5) {
        var $377 = ({
            _: 'App.Kaelin.Effect.Result.new',
            'value': _value$2,
            'map': _map$3,
            'futures': _futures$4,
            'indicators': _indicators$5
        });
        return $377;
    };
    const App$Kaelin$Effect$Result$new = x0 => x1 => x2 => x3 => App$Kaelin$Effect$Result$new$(x0, x1, x2, x3);

    function App$Kaelin$Effect$bind$(_effect$3, _next$4, _center$5, _target$6, _map$7) {
        var self = _effect$3(_center$5)(_target$6)(_map$7);
        switch (self._) {
            case 'App.Kaelin.Effect.Result.new':
                var $379 = self.value;
                var $380 = self.map;
                var $381 = self.futures;
                var $382 = self.indicators;
                var self = _next$4($379)(_center$5)(_target$6)($380);
                switch (self._) {
                    case 'App.Kaelin.Effect.Result.new':
                        var $384 = self.value;
                        var $385 = self.map;
                        var $386 = self.futures;
                        var $387 = self.indicators;
                        var _value$16 = $384;
                        var _map$17 = $385;
                        var _futures$18 = List$concat$($381, $386);
                        var _indicators$19 = NatMap$union$($382, $387);
                        var $388 = App$Kaelin$Effect$Result$new$(_value$16, _map$17, _futures$18, _indicators$19);
                        var $383 = $388;
                        break;
                };
                var $378 = $383;
                break;
        };
        return $378;
    };
    const App$Kaelin$Effect$bind = x0 => x1 => x2 => x3 => x4 => App$Kaelin$Effect$bind$(x0, x1, x2, x3, x4);
    const List$nil = ({
        _: 'List.nil'
    });
    const BitsMap$new = ({
        _: 'BitsMap.new'
    });
    const NatMap$new = BitsMap$new;

    function App$Kaelin$Effect$pure$(_value$2, _center$3, _target$4, _map$5) {
        var $389 = App$Kaelin$Effect$Result$new$(_value$2, _map$5, List$nil, NatMap$new);
        return $389;
    };
    const App$Kaelin$Effect$pure = x0 => x1 => x2 => x3 => App$Kaelin$Effect$pure$(x0, x1, x2, x3);

    function App$Kaelin$Effect$monad$(_new$2) {
        var $390 = _new$2(App$Kaelin$Effect$bind)(App$Kaelin$Effect$pure);
        return $390;
    };
    const App$Kaelin$Effect$monad = x0 => App$Kaelin$Effect$monad$(x0);

    function App$Kaelin$Effect$coord$get_center$(_center$1, _target$2, _map$3) {
        var $391 = App$Kaelin$Effect$Result$new$(_center$1, _map$3, List$nil, NatMap$new);
        return $391;
    };
    const App$Kaelin$Effect$coord$get_center = x0 => x1 => x2 => App$Kaelin$Effect$coord$get_center$(x0, x1, x2);

    function App$Kaelin$Effect$coord$get_target$(_center$1, _target$2, _map$3) {
        var $392 = App$Kaelin$Effect$Result$new$(_target$2, _map$3, List$nil, NatMap$new);
        return $392;
    };
    const App$Kaelin$Effect$coord$get_target = x0 => x1 => x2 => App$Kaelin$Effect$coord$get_target$(x0, x1, x2);
    const NatMap = null;

    function App$Kaelin$Effect$map$get$(_center$1, _target$2, _map$3) {
        var $393 = App$Kaelin$Effect$Result$new$(_map$3, _map$3, List$nil, NatMap$new);
        return $393;
    };
    const App$Kaelin$Effect$map$get = x0 => x1 => x2 => App$Kaelin$Effect$map$get$(x0, x1, x2);
    const Bool$and = a0 => a1 => (a0 && a1);
    const I32$eql = a0 => a1 => (a0 === a1);

    function App$Kaelin$Coord$eql$(_a$1, _b$2) {
        var self = _a$1;
        switch (self._) {
            case 'App.Kaelin.Coord.new':
                var $395 = self.i;
                var $396 = self.j;
                var self = _b$2;
                switch (self._) {
                    case 'App.Kaelin.Coord.new':
                        var $398 = self.i;
                        var $399 = self.j;
                        var $400 = (($395 === $398) && ($396 === $399));
                        var $397 = $400;
                        break;
                };
                var $394 = $397;
                break;
        };
        return $394;
    };
    const App$Kaelin$Coord$eql = x0 => x1 => App$Kaelin$Coord$eql$(x0, x1);
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
        var $401 = (((_n$1) >>> 0));
        return $401;
    };
    const I32$to_u32 = x0 => I32$to_u32$(x0);
    const U32$to_nat = a0 => (BigInt(a0));

    function App$Kaelin$Coord$Convert$axial_to_nat$(_coord$1) {
        var self = _coord$1;
        switch (self._) {
            case 'App.Kaelin.Coord.new':
                var $403 = self.i;
                var $404 = self.j;
                var _i$4 = (($403 + 100) >> 0);
                var _i$5 = ((_i$4 * 1000) >> 0);
                var _i$6 = I32$to_u32$(_i$5);
                var _j$7 = (($404 + 100) >> 0);
                var _j$8 = I32$to_u32$(_j$7);
                var _sum$9 = ((_i$6 + _j$8) >>> 0);
                var $405 = (BigInt(_sum$9));
                var $402 = $405;
                break;
        };
        return $402;
    };
    const App$Kaelin$Coord$Convert$axial_to_nat = x0 => App$Kaelin$Coord$Convert$axial_to_nat$(x0);
    const BitsMap$get = a0 => a1 => (bitsmap_get(a0, a1));
    const Bits$o = a0 => (a0 + '0');
    const Bits$e = '';
    const Bits$i = a0 => (a0 + '1');

    function Bits$inc$(_a$1) {
        var self = _a$1;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'o':
                var $407 = self.slice(0, -1);
                var $408 = ($407 + '1');
                var $406 = $408;
                break;
            case 'i':
                var $409 = self.slice(0, -1);
                var $410 = (Bits$inc$($409) + '0');
                var $406 = $410;
                break;
            case 'e':
                var $411 = (Bits$e + '1');
                var $406 = $411;
                break;
        };
        return $406;
    };
    const Bits$inc = x0 => Bits$inc$(x0);
    const Nat$to_bits = a0 => (nat_to_bits(a0));

    function NatMap$get$(_key$2, _map$3) {
        var $412 = (bitsmap_get((nat_to_bits(_key$2)), _map$3));
        return $412;
    };
    const NatMap$get = x0 => x1 => NatMap$get$(x0, x1);

    function App$Kaelin$Map$get$(_coord$1, _map$2) {
        var _key$3 = App$Kaelin$Coord$Convert$axial_to_nat$(_coord$1);
        var $413 = NatMap$get$(_key$3, _map$2);
        return $413;
    };
    const App$Kaelin$Map$get = x0 => x1 => App$Kaelin$Map$get$(x0, x1);

    function App$Kaelin$Map$is_occupied$(_coord$1, _map$2) {
        var _maybe_tile$3 = App$Kaelin$Map$get$(_coord$1, _map$2);
        var self = _maybe_tile$3;
        switch (self._) {
            case 'Maybe.some':
                var $415 = self.value;
                var self = $415;
                switch (self._) {
                    case 'App.Kaelin.Tile.new':
                        var $417 = self.creature;
                        var self = $417;
                        switch (self._) {
                            case 'Maybe.none':
                                var $419 = Bool$false;
                                var $418 = $419;
                                break;
                            case 'Maybe.some':
                                var $420 = Bool$true;
                                var $418 = $420;
                                break;
                        };
                        var $416 = $418;
                        break;
                };
                var $414 = $416;
                break;
            case 'Maybe.none':
                var $421 = Bool$false;
                var $414 = $421;
                break;
        };
        return $414;
    };
    const App$Kaelin$Map$is_occupied = x0 => x1 => App$Kaelin$Map$is_occupied$(x0, x1);

    function App$Kaelin$Effect$(_A$1) {
        var $422 = null;
        return $422;
    };
    const App$Kaelin$Effect = x0 => App$Kaelin$Effect$(x0);

    function App$Kaelin$Map$creature$get$(_coord$1, _map$2) {
        var _key$3 = App$Kaelin$Coord$Convert$axial_to_nat$(_coord$1);
        var _tile$4 = NatMap$get$(_key$3, _map$2);
        var self = _tile$4;
        switch (self._) {
            case 'Maybe.some':
                var $424 = self.value;
                var self = $424;
                switch (self._) {
                    case 'App.Kaelin.Tile.new':
                        var $426 = self.creature;
                        var $427 = $426;
                        var $425 = $427;
                        break;
                };
                var $423 = $425;
                break;
            case 'Maybe.none':
                var $428 = Maybe$none;
                var $423 = $428;
                break;
        };
        return $423;
    };
    const App$Kaelin$Map$creature$get = x0 => x1 => App$Kaelin$Map$creature$get$(x0, x1);

    function Maybe$bind$(_m$3, _f$4) {
        var self = _m$3;
        switch (self._) {
            case 'Maybe.some':
                var $430 = self.value;
                var $431 = _f$4($430);
                var $429 = $431;
                break;
            case 'Maybe.none':
                var $432 = Maybe$none;
                var $429 = $432;
                break;
        };
        return $429;
    };
    const Maybe$bind = x0 => x1 => Maybe$bind$(x0, x1);

    function Maybe$monad$(_new$2) {
        var $433 = _new$2(Maybe$bind)(Maybe$some);
        return $433;
    };
    const Maybe$monad = x0 => Maybe$monad$(x0);

    function App$Kaelin$Tile$new$(_background$1, _creature$2, _animation$3) {
        var $434 = ({
            _: 'App.Kaelin.Tile.new',
            'background': _background$1,
            'creature': _creature$2,
            'animation': _animation$3
        });
        return $434;
    };
    const App$Kaelin$Tile$new = x0 => x1 => x2 => App$Kaelin$Tile$new$(x0, x1, x2);
    const BitsMap$set = a0 => a1 => a2 => (bitsmap_set(a0, a1, a2, 'set'));

    function NatMap$set$(_key$2, _val$3, _map$4) {
        var $435 = (bitsmap_set((nat_to_bits(_key$2)), _val$3, _map$4, 'set'));
        return $435;
    };
    const NatMap$set = x0 => x1 => x2 => NatMap$set$(x0, x1, x2);

    function App$Kaelin$Map$creature$modify_at$(_mod$1, _pos$2, _map$3) {
        var _key$4 = App$Kaelin$Coord$Convert$axial_to_nat$(_pos$2);
        var _result$4 = Maybe$monad$((_m$bind$5 => _m$pure$6 => {
            var $437 = _m$bind$5;
            return $437;
        }))(NatMap$get$(_key$4, _map$3))((_tile$5 => {
            var $438 = Maybe$monad$((_m$bind$6 => _m$pure$7 => {
                var $439 = _m$bind$6;
                return $439;
            }))((() => {
                var self = _tile$5;
                switch (self._) {
                    case 'App.Kaelin.Tile.new':
                        var $440 = self.creature;
                        var $441 = $440;
                        return $441;
                };
            })())((_creature$6 => {
                var _new_creature$7 = _mod$1(_creature$6);
                var _new_tile$8 = App$Kaelin$Tile$new$((() => {
                    var self = _tile$5;
                    switch (self._) {
                        case 'App.Kaelin.Tile.new':
                            var $443 = self.background;
                            var $444 = $443;
                            return $444;
                    };
                })(), Maybe$some$(_new_creature$7), (() => {
                    var self = _tile$5;
                    switch (self._) {
                        case 'App.Kaelin.Tile.new':
                            var $445 = self.animation;
                            var $446 = $445;
                            return $446;
                    };
                })());
                var _new_map$9 = NatMap$set$(_key$4, _new_tile$8, _map$3);
                var $442 = Maybe$monad$((_m$bind$10 => _m$pure$11 => {
                    var $447 = _m$pure$11;
                    return $447;
                }))(_new_map$9);
                return $442;
            }));
            return $438;
        }));
        var $436 = Maybe$default$(_result$4, _map$3);
        return $436;
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
                        var $448 = self.pred;
                        var $449 = Word$is_neg$go$($448, Bool$false);
                        return $449;
                    case 'Word.i':
                        var $450 = self.pred;
                        var $451 = Word$is_neg$go$($450, Bool$true);
                        return $451;
                    case 'Word.e':
                        var $452 = _n$3;
                        return $452;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Word$is_neg$go = x0 => x1 => Word$is_neg$go$(x0, x1);

    function Word$is_neg$(_word$2) {
        var $453 = Word$is_neg$go$(_word$2, Bool$false);
        return $453;
    };
    const Word$is_neg = x0 => Word$is_neg$(x0);

    function Cmp$as_lte$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
            case 'Cmp.eql':
                var $455 = Bool$true;
                var $454 = $455;
                break;
            case 'Cmp.gtn':
                var $456 = Bool$false;
                var $454 = $456;
                break;
        };
        return $454;
    };
    const Cmp$as_lte = x0 => Cmp$as_lte$(x0);

    function Cmp$inv$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
                var $458 = Cmp$gtn;
                var $457 = $458;
                break;
            case 'Cmp.eql':
                var $459 = Cmp$eql;
                var $457 = $459;
                break;
            case 'Cmp.gtn':
                var $460 = Cmp$ltn;
                var $457 = $460;
                break;
        };
        return $457;
    };
    const Cmp$inv = x0 => Cmp$inv$(x0);

    function Word$s_lte$(_a$2, _b$3) {
        var _neg_a$4 = Word$is_neg$(_a$2);
        var _neg_b$5 = Word$is_neg$(_b$3);
        var self = _neg_a$4;
        if (self) {
            var self = _neg_b$5;
            if (self) {
                var $463 = Cmp$as_lte$(Cmp$inv$(Word$cmp$(_a$2, _b$3)));
                var $462 = $463;
            } else {
                var $464 = Bool$true;
                var $462 = $464;
            };
            var $461 = $462;
        } else {
            var self = _neg_b$5;
            if (self) {
                var $466 = Bool$false;
                var $465 = $466;
            } else {
                var $467 = Cmp$as_lte$(Word$cmp$(_a$2, _b$3));
                var $465 = $467;
            };
            var $461 = $465;
        };
        return $461;
    };
    const Word$s_lte = x0 => x1 => Word$s_lte$(x0, x1);
    const I32$lte = a0 => a1 => (a0 <= a1);

    function Cmp$as_ltn$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
                var $469 = Bool$true;
                var $468 = $469;
                break;
            case 'Cmp.eql':
            case 'Cmp.gtn':
                var $470 = Bool$false;
                var $468 = $470;
                break;
        };
        return $468;
    };
    const Cmp$as_ltn = x0 => Cmp$as_ltn$(x0);

    function Word$s_ltn$(_a$2, _b$3) {
        var _neg_a$4 = Word$is_neg$(_a$2);
        var _neg_b$5 = Word$is_neg$(_b$3);
        var self = _neg_a$4;
        if (self) {
            var self = _neg_b$5;
            if (self) {
                var $473 = Cmp$as_ltn$(Cmp$inv$(Word$cmp$(_a$2, _b$3)));
                var $472 = $473;
            } else {
                var $474 = Bool$true;
                var $472 = $474;
            };
            var $471 = $472;
        } else {
            var self = _neg_b$5;
            if (self) {
                var $476 = Bool$false;
                var $475 = $476;
            } else {
                var $477 = Cmp$as_ltn$(Word$cmp$(_a$2, _b$3));
                var $475 = $477;
            };
            var $471 = $475;
        };
        return $471;
    };
    const Word$s_ltn = x0 => x1 => Word$s_ltn$(x0, x1);
    const I32$ltn = a0 => a1 => (a0 < a1);

    function I32$min$(_a$1, _b$2) {
        var self = (_a$1 < _b$2);
        if (self) {
            var $479 = _a$1;
            var $478 = $479;
        } else {
            var $480 = _b$2;
            var $478 = $480;
        };
        return $478;
    };
    const I32$min = x0 => x1 => I32$min$(x0, x1);

    function App$Kaelin$Creature$new$(_player$1, _hero$2, _team$3, _hp$4, _ap$5, _status$6) {
        var $481 = ({
            _: 'App.Kaelin.Creature.new',
            'player': _player$1,
            'hero': _hero$2,
            'team': _team$3,
            'hp': _hp$4,
            'ap': _ap$5,
            'status': _status$6
        });
        return $481;
    };
    const App$Kaelin$Creature$new = x0 => x1 => x2 => x3 => x4 => x5 => App$Kaelin$Creature$new$(x0, x1, x2, x3, x4, x5);

    function App$Kaelin$Tile$creature$change_hp$(_change$1, _creature$2) {
        var self = _creature$2;
        switch (self._) {
            case 'App.Kaelin.Creature.new':
                var $483 = self.hero;
                var $484 = self.hp;
                var self = $483;
                switch (self._) {
                    case 'App.Kaelin.Hero.new':
                        var $486 = self.max_hp;
                        var self = ($484 <= 0);
                        if (self) {
                            var $488 = _creature$2;
                            var $487 = $488;
                        } else {
                            var self = _creature$2;
                            switch (self._) {
                                case 'App.Kaelin.Creature.new':
                                    var $490 = self.player;
                                    var $491 = self.hero;
                                    var $492 = self.team;
                                    var $493 = self.ap;
                                    var $494 = self.status;
                                    var $495 = App$Kaelin$Creature$new$($490, $491, $492, I32$min$((($484 + _change$1) >> 0), $486), $493, $494);
                                    var $489 = $495;
                                    break;
                            };
                            var $487 = $489;
                        };
                        var $485 = $487;
                        break;
                };
                var $482 = $485;
                break;
        };
        return $482;
    };
    const App$Kaelin$Tile$creature$change_hp = x0 => x1 => App$Kaelin$Tile$creature$change_hp$(x0, x1);

    function App$Kaelin$Map$creature$remove$(_coord$1, _map$2) {
        var _key$3 = App$Kaelin$Coord$Convert$axial_to_nat$(_coord$1);
        var _tile$4 = NatMap$get$(_key$3, _map$2);
        var self = _tile$4;
        switch (self._) {
            case 'Maybe.some':
                var $497 = self.value;
                var self = $497;
                switch (self._) {
                    case 'App.Kaelin.Tile.new':
                        var $499 = self.background;
                        var $500 = self.animation;
                        var $501 = App$Kaelin$Tile$new$($499, Maybe$none, $500);
                        var _new_tile$6 = $501;
                        break;
                };
                var $498 = NatMap$set$(_key$3, _new_tile$6, _map$2);
                var $496 = $498;
                break;
            case 'Maybe.none':
                var $502 = _map$2;
                var $496 = $502;
                break;
        };
        return $496;
    };
    const App$Kaelin$Map$creature$remove = x0 => x1 => App$Kaelin$Map$creature$remove$(x0, x1);

    function Cmp$as_gtn$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
            case 'Cmp.eql':
                var $504 = Bool$false;
                var $503 = $504;
                break;
            case 'Cmp.gtn':
                var $505 = Bool$true;
                var $503 = $505;
                break;
        };
        return $503;
    };
    const Cmp$as_gtn = x0 => Cmp$as_gtn$(x0);

    function Word$s_gtn$(_a$2, _b$3) {
        var _neg_a$4 = Word$is_neg$(_a$2);
        var _neg_b$5 = Word$is_neg$(_b$3);
        var self = _neg_a$4;
        if (self) {
            var self = _neg_b$5;
            if (self) {
                var $508 = Cmp$as_gtn$(Cmp$inv$(Word$cmp$(_a$2, _b$3)));
                var $507 = $508;
            } else {
                var $509 = Bool$false;
                var $507 = $509;
            };
            var $506 = $507;
        } else {
            var self = _neg_b$5;
            if (self) {
                var $511 = Bool$true;
                var $510 = $511;
            } else {
                var $512 = Cmp$as_gtn$(Word$cmp$(_a$2, _b$3));
                var $510 = $512;
            };
            var $506 = $510;
        };
        return $506;
    };
    const Word$s_gtn = x0 => x1 => Word$s_gtn$(x0, x1);
    const I32$gtn = a0 => a1 => (a0 > a1);

    function I32$max$(_a$1, _b$2) {
        var self = (_a$1 > _b$2);
        if (self) {
            var $514 = _a$1;
            var $513 = $514;
        } else {
            var $515 = _b$2;
            var $513 = $515;
        };
        return $513;
    };
    const I32$max = x0 => x1 => I32$max$(x0, x1);
    const I32$sub = a0 => a1 => ((a0 - a1) >> 0);

    function App$Kaelin$Map$creature$change_hp_at$(_value$1, _pos$2, _map$3) {
        var _creature$4 = App$Kaelin$Map$creature$get$(_pos$2, _map$3);
        var self = _creature$4;
        switch (self._) {
            case 'Maybe.some':
                var $517 = self.value;
                var self = $517;
                switch (self._) {
                    case 'App.Kaelin.Creature.new':
                        var $519 = self.hero;
                        var self = $519;
                        switch (self._) {
                            case 'App.Kaelin.Hero.new':
                                var $521 = self.max_hp;
                                var self = (0 === (() => {
                                    var self = $517;
                                    switch (self._) {
                                        case 'App.Kaelin.Creature.new':
                                            var $523 = self.hp;
                                            var $524 = $523;
                                            return $524;
                                    };
                                })());
                                if (self) {
                                    var $525 = Pair$new$(0, App$Kaelin$Map$creature$remove$(_pos$2, _map$3));
                                    var $522 = $525;
                                } else {
                                    var _new_hp$17 = I32$max$((((() => {
                                        var self = $517;
                                        switch (self._) {
                                            case 'App.Kaelin.Creature.new':
                                                var $527 = self.hp;
                                                var $528 = $527;
                                                return $528;
                                        };
                                    })() + _value$1) >> 0), 0);
                                    var _new_hp$18 = I32$min$(_new_hp$17, $521);
                                    var _hp_diff$19 = ((_new_hp$18 - (() => {
                                        var self = $517;
                                        switch (self._) {
                                            case 'App.Kaelin.Creature.new':
                                                var $529 = self.hp;
                                                var $530 = $529;
                                                return $530;
                                        };
                                    })()) >> 0);
                                    var _map$20 = App$Kaelin$Map$creature$modify_at$(App$Kaelin$Tile$creature$change_hp(_hp_diff$19), _pos$2, _map$3);
                                    var $526 = Pair$new$(_hp_diff$19, _map$20);
                                    var $522 = $526;
                                };
                                var $520 = $522;
                                break;
                        };
                        var $518 = $520;
                        break;
                };
                var $516 = $518;
                break;
            case 'Maybe.none':
                var _map$5 = App$Kaelin$Map$creature$modify_at$(App$Kaelin$Tile$creature$change_hp(_value$1), _pos$2, _map$3);
                var $531 = Pair$new$(_value$1, _map$5);
                var $516 = $531;
                break;
        };
        return $516;
    };
    const App$Kaelin$Map$creature$change_hp_at = x0 => x1 => x2 => App$Kaelin$Map$creature$change_hp_at$(x0, x1, x2);

    function App$Kaelin$Effect$map$set$(_new_map$1, _center$2, _target$3, _map$4) {
        var $532 = App$Kaelin$Effect$Result$new$(Unit$new, _new_map$1, List$nil, NatMap$new);
        return $532;
    };
    const App$Kaelin$Effect$map$set = x0 => x1 => x2 => x3 => App$Kaelin$Effect$map$set$(x0, x1, x2, x3);

    function App$Kaelin$Effect$indicators$add$(_indicators$1, _center$2, _target$3, _map$4) {
        var $533 = App$Kaelin$Effect$Result$new$(Unit$new, _map$4, List$nil, _indicators$1);
        return $533;
    };
    const App$Kaelin$Effect$indicators$add = x0 => x1 => x2 => x3 => App$Kaelin$Effect$indicators$add$(x0, x1, x2, x3);
    const App$Kaelin$Indicator$green = ({
        _: 'App.Kaelin.Indicator.green'
    });
    const App$Kaelin$Indicator$red = ({
        _: 'App.Kaelin.Indicator.red'
    });

    function App$Kaelin$Effect$hp$change_at$(_change$1, _pos$2) {
        var $534 = App$Kaelin$Effect$monad$((_m$bind$3 => _m$pure$4 => {
            var $535 = _m$bind$3;
            return $535;
        }))(App$Kaelin$Effect$map$get)((_map$3 => {
            var $536 = App$Kaelin$Effect$monad$((_m$bind$4 => _m$pure$5 => {
                var $537 = _m$bind$4;
                return $537;
            }))(App$Kaelin$Effect$coord$get_center)((_center_pos$4 => {
                var _key$5 = App$Kaelin$Coord$Convert$axial_to_nat$(_pos$2);
                var _res$6 = App$Kaelin$Map$creature$change_hp_at$(_change$1, _pos$2, _map$3);
                var self = _res$6;
                switch (self._) {
                    case 'Pair.new':
                        var $539 = self.fst;
                        var $540 = $539;
                        var _dhp$7 = $540;
                        break;
                };
                var self = _res$6;
                switch (self._) {
                    case 'Pair.new':
                        var $541 = self.snd;
                        var $542 = $541;
                        var _map$8 = $542;
                        break;
                };
                var _indicators$9 = NatMap$new;
                var $538 = App$Kaelin$Effect$monad$((_m$bind$10 => _m$pure$11 => {
                    var $543 = _m$bind$10;
                    return $543;
                }))(App$Kaelin$Effect$map$set(_map$8))((_$10 => {
                    var $544 = App$Kaelin$Effect$monad$((_m$bind$11 => _m$pure$12 => {
                        var $545 = _m$bind$11;
                        return $545;
                    }))((() => {
                        var self = (_dhp$7 > 0);
                        if (self) {
                            var $546 = App$Kaelin$Effect$indicators$add(NatMap$set$(_key$5, App$Kaelin$Indicator$green, _indicators$9));
                            return $546;
                        } else {
                            var self = (_dhp$7 < 0);
                            if (self) {
                                var $548 = App$Kaelin$Effect$indicators$add(NatMap$set$(_key$5, App$Kaelin$Indicator$red, _indicators$9));
                                var $547 = $548;
                            } else {
                                var $549 = App$Kaelin$Effect$monad$((_m$bind$11 => _m$pure$12 => {
                                    var $550 = _m$pure$12;
                                    return $550;
                                }))(Unit$new);
                                var $547 = $549;
                            };
                            return $547;
                        };
                    })())((_$11 => {
                        var $551 = App$Kaelin$Effect$monad$((_m$bind$12 => _m$pure$13 => {
                            var $552 = _m$pure$13;
                            return $552;
                        }))(_dhp$7);
                        return $551;
                    }));
                    return $544;
                }));
                return $538;
            }));
            return $536;
        }));
        return $534;
    };
    const App$Kaelin$Effect$hp$change_at = x0 => x1 => App$Kaelin$Effect$hp$change_at$(x0, x1);

    function App$Kaelin$Effect$hp$damage_at$(_dmg$1, _pos$2) {
        var $553 = App$Kaelin$Effect$hp$change_at$(((-_dmg$1)), _pos$2);
        return $553;
    };
    const App$Kaelin$Effect$hp$damage_at = x0 => x1 => App$Kaelin$Effect$hp$damage_at$(x0, x1);

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
                        var $554 = self.head;
                        var $555 = self.tail;
                        var self = _cond$2($554);
                        if (self) {
                            var $557 = Maybe$some$($554);
                            var $556 = $557;
                        } else {
                            var $558 = List$find$(_cond$2, $555);
                            var $556 = $558;
                        };
                        return $556;
                    case 'List.nil':
                        var $559 = Maybe$none;
                        return $559;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const List$find = x0 => x1 => List$find$(x0, x1);
    const U16$eql = a0 => a1 => (a0 === a1);

    function App$Kaelin$Skill$get$(_key$1, _creature$2) {
        var self = _creature$2;
        switch (self._) {
            case 'App.Kaelin.Creature.new':
                var $561 = self.hero;
                var $562 = List$find$((_x$9 => {
                    var $563 = ((() => {
                        var self = _x$9;
                        switch (self._) {
                            case 'App.Kaelin.Skill.new':
                                var $564 = self.key;
                                var $565 = $564;
                                return $565;
                        };
                    })() === _key$1);
                    return $563;
                }), (() => {
                    var self = $561;
                    switch (self._) {
                        case 'App.Kaelin.Hero.new':
                            var $566 = self.skills;
                            var $567 = $566;
                            return $567;
                    };
                })());
                var $560 = $562;
                break;
        };
        return $560;
    };
    const App$Kaelin$Skill$get = x0 => x1 => App$Kaelin$Skill$get$(x0, x1);

    function App$Kaelin$Tile$creature$change_ap$(_key$1, _creature$2) {
        var self = _creature$2;
        switch (self._) {
            case 'App.Kaelin.Creature.new':
                var $569 = self.hero;
                var $570 = self.hp;
                var $571 = self.ap;
                var self = $569;
                switch (self._) {
                    case 'App.Kaelin.Hero.new':
                        var $573 = self.max_ap;
                        var self = ($570 <= 0);
                        if (self) {
                            var $575 = _creature$2;
                            var $574 = $575;
                        } else {
                            var _skill$14 = App$Kaelin$Skill$get$(_key$1, _creature$2);
                            var self = _skill$14;
                            switch (self._) {
                                case 'Maybe.some':
                                    var $577 = self.value;
                                    var self = $577;
                                    switch (self._) {
                                        case 'App.Kaelin.Skill.new':
                                            var $579 = self.ap_cost;
                                            var _new_ap$21 = I32$max$((($571 - $579) >> 0), 0);
                                            var _new_ap$22 = I32$min$(_new_ap$21, $573);
                                            var _ap_diff$23 = ((_new_ap$22 - $571) >> 0);
                                            var _new_ap$24 = I32$min$((($571 + _ap_diff$23) >> 0), $573);
                                            var self = _creature$2;
                                            switch (self._) {
                                                case 'App.Kaelin.Creature.new':
                                                    var $581 = self.player;
                                                    var $582 = self.hero;
                                                    var $583 = self.team;
                                                    var $584 = self.hp;
                                                    var $585 = self.status;
                                                    var $586 = App$Kaelin$Creature$new$($581, $582, $583, $584, _new_ap$24, $585);
                                                    var $580 = $586;
                                                    break;
                                            };
                                            var $578 = $580;
                                            break;
                                    };
                                    var $576 = $578;
                                    break;
                                case 'Maybe.none':
                                    var $587 = _creature$2;
                                    var $576 = $587;
                                    break;
                            };
                            var $574 = $576;
                        };
                        var $572 = $574;
                        break;
                };
                var $568 = $572;
                break;
        };
        return $568;
    };
    const App$Kaelin$Tile$creature$change_ap = x0 => x1 => App$Kaelin$Tile$creature$change_ap$(x0, x1);

    function App$Kaelin$Map$creature$change_ap_at$(_key$1, _pos$2, _map$3) {
        var _creature$4 = App$Kaelin$Map$creature$get$(_pos$2, _map$3);
        var self = _creature$4;
        switch (self._) {
            case 'Maybe.some':
                var $589 = self.value;
                var _skill$6 = App$Kaelin$Skill$get$(_key$1, $589);
                var self = _skill$6;
                switch (self._) {
                    case 'Maybe.some':
                        var $591 = self.value;
                        var self = $591;
                        switch (self._) {
                            case 'App.Kaelin.Skill.new':
                                var $593 = self.ap_cost;
                                var _map$13 = App$Kaelin$Map$creature$modify_at$(App$Kaelin$Tile$creature$change_ap(_key$1), _pos$2, _map$3);
                                var $594 = Pair$new$($593, _map$13);
                                var $592 = $594;
                                break;
                        };
                        var $590 = $592;
                        break;
                    case 'Maybe.none':
                        var $595 = Pair$new$(0, _map$3);
                        var $590 = $595;
                        break;
                };
                var $588 = $590;
                break;
            case 'Maybe.none':
                var $596 = Pair$new$(0, _map$3);
                var $588 = $596;
                break;
        };
        return $588;
    };
    const App$Kaelin$Map$creature$change_ap_at = x0 => x1 => x2 => App$Kaelin$Map$creature$change_ap_at$(x0, x1, x2);

    function App$Kaelin$Effect$ap$change_at$(_skill_key$1, _pos$2) {
        var $597 = App$Kaelin$Effect$monad$((_m$bind$3 => _m$pure$4 => {
            var $598 = _m$bind$3;
            return $598;
        }))(App$Kaelin$Effect$map$get)((_map$3 => {
            var _key$4 = App$Kaelin$Coord$Convert$axial_to_nat$(_pos$2);
            var _res$5 = App$Kaelin$Map$creature$change_ap_at$(_skill_key$1, _pos$2, _map$3);
            var self = _res$5;
            switch (self._) {
                case 'Pair.new':
                    var $600 = self.fst;
                    var $601 = $600;
                    var _apc$6 = $601;
                    break;
            };
            var self = _res$5;
            switch (self._) {
                case 'Pair.new':
                    var $602 = self.snd;
                    var $603 = $602;
                    var _map$7 = $603;
                    break;
            };
            var _indicators$8 = NatMap$new;
            var $599 = App$Kaelin$Effect$monad$((_m$bind$9 => _m$pure$10 => {
                var $604 = _m$bind$9;
                return $604;
            }))(App$Kaelin$Effect$map$set(_map$7))((_$9 => {
                var $605 = App$Kaelin$Effect$monad$((_m$bind$10 => _m$pure$11 => {
                    var $606 = _m$bind$10;
                    return $606;
                }))((() => {
                    var self = (_apc$6 < 0);
                    if (self) {
                        var $607 = App$Kaelin$Effect$indicators$add(NatMap$set$(_key$4, App$Kaelin$Indicator$green, _indicators$8));
                        return $607;
                    } else {
                        var $608 = App$Kaelin$Effect$monad$((_m$bind$10 => _m$pure$11 => {
                            var $609 = _m$pure$11;
                            return $609;
                        }))(Unit$new);
                        return $608;
                    };
                })())((_$10 => {
                    var $610 = App$Kaelin$Effect$monad$((_m$bind$11 => _m$pure$12 => {
                        var $611 = _m$pure$12;
                        return $611;
                    }))(_apc$6);
                    return $610;
                }));
                return $605;
            }));
            return $599;
        }));
        return $597;
    };
    const App$Kaelin$Effect$ap$change_at = x0 => x1 => App$Kaelin$Effect$ap$change_at$(x0, x1);

    function App$Kaelin$Effect$ap$cost$(_key$1, _target$2) {
        var $612 = App$Kaelin$Effect$ap$change_at$(_key$1, _target$2);
        return $612;
    };
    const App$Kaelin$Effect$ap$cost = x0 => x1 => App$Kaelin$Effect$ap$cost$(x0, x1);

    function App$Kaelin$Effect$hp$heal_at$(_dmg$1, _pos$2) {
        var $613 = App$Kaelin$Effect$hp$change_at$(((-_dmg$1)), _pos$2);
        return $613;
    };
    const App$Kaelin$Effect$hp$heal_at = x0 => x1 => App$Kaelin$Effect$hp$heal_at$(x0, x1);

    function App$Kaelin$Skill$vampirism$(_key$1, _dmg$2) {
        var $614 = App$Kaelin$Effect$monad$((_m$bind$3 => _m$pure$4 => {
            var $615 = _m$bind$3;
            return $615;
        }))(App$Kaelin$Effect$coord$get_center)((_center_pos$3 => {
            var $616 = App$Kaelin$Effect$monad$((_m$bind$4 => _m$pure$5 => {
                var $617 = _m$bind$4;
                return $617;
            }))(App$Kaelin$Effect$coord$get_target)((_target_pos$4 => {
                var $618 = App$Kaelin$Effect$monad$((_m$bind$5 => _m$pure$6 => {
                    var $619 = _m$bind$5;
                    return $619;
                }))(App$Kaelin$Effect$map$get)((_map$5 => {
                    var _block$6 = App$Kaelin$Coord$eql$(_target_pos$4, _center_pos$3);
                    var _occupied$7 = App$Kaelin$Map$is_occupied$(_target_pos$4, _map$5);
                    var self = _block$6;
                    if (self) {
                        var $621 = App$Kaelin$Effect$monad$((_m$bind$8 => _m$pure$9 => {
                            var $622 = _m$pure$9;
                            return $622;
                        }))(Unit$new);
                        var $620 = $621;
                    } else {
                        var self = _occupied$7;
                        if (self) {
                            var $624 = App$Kaelin$Effect$monad$((_m$bind$8 => _m$pure$9 => {
                                var $625 = _m$bind$8;
                                return $625;
                            }))(App$Kaelin$Effect$hp$damage_at$(_dmg$2, _target_pos$4))((_dd$8 => {
                                var $626 = App$Kaelin$Effect$monad$((_m$bind$9 => _m$pure$10 => {
                                    var $627 = _m$bind$9;
                                    return $627;
                                }))(App$Kaelin$Effect$ap$cost$(_key$1, _center_pos$3))((_$9 => {
                                    var $628 = App$Kaelin$Effect$monad$((_m$bind$10 => _m$pure$11 => {
                                        var $629 = _m$bind$10;
                                        return $629;
                                    }))(App$Kaelin$Effect$hp$damage_at$(_dmg$2, _target_pos$4))((_$10 => {
                                        var $630 = App$Kaelin$Effect$monad$((_m$bind$11 => _m$pure$12 => {
                                            var $631 = _m$bind$11;
                                            return $631;
                                        }))(App$Kaelin$Effect$hp$heal_at$(_dd$8, _center_pos$3))((_$11 => {
                                            var $632 = App$Kaelin$Effect$monad$((_m$bind$12 => _m$pure$13 => {
                                                var $633 = _m$pure$13;
                                                return $633;
                                            }))(Unit$new);
                                            return $632;
                                        }));
                                        return $630;
                                    }));
                                    return $628;
                                }));
                                return $626;
                            }));
                            var $623 = $624;
                        } else {
                            var $634 = App$Kaelin$Effect$monad$((_m$bind$8 => _m$pure$9 => {
                                var $635 = _m$pure$9;
                                return $635;
                            }))(Unit$new);
                            var $623 = $634;
                        };
                        var $620 = $623;
                    };
                    return $620;
                }));
                return $618;
            }));
            return $616;
        }));
        return $614;
    };
    const App$Kaelin$Skill$vampirism = x0 => x1 => App$Kaelin$Skill$vampirism$(x0, x1);
    const App$Kaelin$Heroes$Croni$skills$vampirism = App$Kaelin$Skill$new$("Vampirism", 3, 3, App$Kaelin$Skill$vampirism$(81, 3), 81);

    function App$Kaelin$Coord$Cubic$new$(_x$1, _y$2, _z$3) {
        var $636 = ({
            _: 'App.Kaelin.Coord.Cubic.new',
            'x': _x$1,
            'y': _y$2,
            'z': _z$3
        });
        return $636;
    };
    const App$Kaelin$Coord$Cubic$new = x0 => x1 => x2 => App$Kaelin$Coord$Cubic$new$(x0, x1, x2);

    function App$Kaelin$Coord$Convert$axial_to_cubic$(_coord$1) {
        var self = _coord$1;
        switch (self._) {
            case 'App.Kaelin.Coord.new':
                var $638 = self.i;
                var $639 = self.j;
                var _x$4 = $638;
                var _z$5 = $639;
                var _y$6 = ((((-_x$4)) - _z$5) >> 0);
                var $640 = App$Kaelin$Coord$Cubic$new$(_x$4, _y$6, _z$5);
                var $637 = $640;
                break;
        };
        return $637;
    };
    const App$Kaelin$Coord$Convert$axial_to_cubic = x0 => App$Kaelin$Coord$Convert$axial_to_cubic$(x0);

    function List$map$(_f$3, _as$4) {
        var self = _as$4;
        switch (self._) {
            case 'List.cons':
                var $642 = self.head;
                var $643 = self.tail;
                var $644 = List$cons$(_f$3($642), List$map$(_f$3, $643));
                var $641 = $644;
                break;
            case 'List.nil':
                var $645 = List$nil;
                var $641 = $645;
                break;
        };
        return $641;
    };
    const List$map = x0 => x1 => List$map$(x0, x1);

    function App$Kaelin$Coord$Convert$cubic_to_axial$(_coord$1) {
        var self = _coord$1;
        switch (self._) {
            case 'App.Kaelin.Coord.Cubic.new':
                var $647 = self.x;
                var $648 = self.z;
                var _i$5 = $647;
                var _j$6 = $648;
                var $649 = App$Kaelin$Coord$new$(_i$5, _j$6);
                var $646 = $649;
                break;
        };
        return $646;
    };
    const App$Kaelin$Coord$Convert$cubic_to_axial = x0 => App$Kaelin$Coord$Convert$cubic_to_axial$(x0);
    const U32$from_nat = a0 => (Number(a0) >>> 0);
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
        var $650 = (((_n$1) >> 0));
        return $650;
    };
    const U32$to_i32 = x0 => U32$to_i32$(x0);

    function Word$shr$(_n$2, _value$3) {
        var _n_nat$4 = Word$to_nat$(_n$2);
        var $651 = Word$shift_right$(_n_nat$4, _value$3);
        return $651;
    };
    const Word$shr = x0 => x1 => Word$shr$(x0, x1);

    function Word$s_shr$(_n$2, _value$3) {
        var _neg$4 = Word$is_neg$(_n$2);
        var self = _neg$4;
        if (self) {
            var _n$5 = Word$neg$(_n$2);
            var $653 = Word$shl$(_n$5, _value$3);
            var $652 = $653;
        } else {
            var $654 = Word$shr$(_n$2, _value$3);
            var $652 = $654;
        };
        return $652;
    };
    const Word$s_shr = x0 => x1 => Word$s_shr$(x0, x1);
    const I32$shr = a0 => a1 => (a0 >> a1);

    function Word$xor$(_a$2, _b$3) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $656 = self.pred;
                var $657 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $659 = self.pred;
                            var $660 = (_a$pred$9 => {
                                var $661 = Word$o$(Word$xor$(_a$pred$9, $659));
                                return $661;
                            });
                            var $658 = $660;
                            break;
                        case 'Word.i':
                            var $662 = self.pred;
                            var $663 = (_a$pred$9 => {
                                var $664 = Word$i$(Word$xor$(_a$pred$9, $662));
                                return $664;
                            });
                            var $658 = $663;
                            break;
                        case 'Word.e':
                            var $665 = (_a$pred$7 => {
                                var $666 = Word$e;
                                return $666;
                            });
                            var $658 = $665;
                            break;
                    };
                    var $658 = $658($656);
                    return $658;
                });
                var $655 = $657;
                break;
            case 'Word.i':
                var $667 = self.pred;
                var $668 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $670 = self.pred;
                            var $671 = (_a$pred$9 => {
                                var $672 = Word$i$(Word$xor$(_a$pred$9, $670));
                                return $672;
                            });
                            var $669 = $671;
                            break;
                        case 'Word.i':
                            var $673 = self.pred;
                            var $674 = (_a$pred$9 => {
                                var $675 = Word$o$(Word$xor$(_a$pred$9, $673));
                                return $675;
                            });
                            var $669 = $674;
                            break;
                        case 'Word.e':
                            var $676 = (_a$pred$7 => {
                                var $677 = Word$e;
                                return $677;
                            });
                            var $669 = $676;
                            break;
                    };
                    var $669 = $669($667);
                    return $669;
                });
                var $655 = $668;
                break;
            case 'Word.e':
                var $678 = (_b$4 => {
                    var $679 = Word$e;
                    return $679;
                });
                var $655 = $678;
                break;
        };
        var $655 = $655(_b$3);
        return $655;
    };
    const Word$xor = x0 => x1 => Word$xor$(x0, x1);
    const I32$xor = a0 => a1 => (a0 ^ a1);

    function I32$abs$(_a$1) {
        var _mask$2 = (_a$1 >> 31);
        var $680 = (((_mask$2 + _a$1) >> 0) ^ _mask$2);
        return $680;
    };
    const I32$abs = x0 => I32$abs$(x0);

    function App$Kaelin$Coord$Cubic$add$(_coord_a$1, _coord_b$2) {
        var self = _coord_a$1;
        switch (self._) {
            case 'App.Kaelin.Coord.Cubic.new':
                var $682 = self.x;
                var $683 = self.y;
                var $684 = self.z;
                var self = _coord_b$2;
                switch (self._) {
                    case 'App.Kaelin.Coord.Cubic.new':
                        var $686 = self.x;
                        var $687 = self.y;
                        var $688 = self.z;
                        var _x$9 = (($682 + $686) >> 0);
                        var _y$10 = (($683 + $687) >> 0);
                        var _z$11 = (($684 + $688) >> 0);
                        var $689 = App$Kaelin$Coord$Cubic$new$(_x$9, _y$10, _z$11);
                        var $685 = $689;
                        break;
                };
                var $681 = $685;
                break;
        };
        return $681;
    };
    const App$Kaelin$Coord$Cubic$add = x0 => x1 => App$Kaelin$Coord$Cubic$add$(x0, x1);

    function App$Kaelin$Coord$Cubic$range$(_coord$1, _distance$2) {
        var _distance_32$3 = I32$to_u32$(_distance$2);
        var _double_distance$4 = ((((_distance_32$3 * 2) >>> 0) + 1) >>> 0);
        var _result$5 = List$nil;
        var _result$6 = (() => {
            var $691 = _result$5;
            var $692 = 0;
            var $693 = _double_distance$4;
            let _result$7 = $691;
            for (let _actual_distance$6 = $692; _actual_distance$6 < $693; ++_actual_distance$6) {
                var _negative_distance$8 = ((-_distance$2));
                var _positive_distance$9 = _distance$2;
                var _actual_distance$10 = U32$to_i32$(_actual_distance$6);
                var _x$11 = ((_actual_distance$10 - _positive_distance$9) >> 0);
                var _max$12 = I32$max$(_negative_distance$8, ((((-_x$11)) + _negative_distance$8) >> 0));
                var _min$13 = I32$min$(_positive_distance$9, ((((-_x$11)) + _positive_distance$9) >> 0));
                var _distance_between_max_min$14 = ((1 + I32$to_u32$(I32$abs$(((_max$12 - _min$13) >> 0)))) >>> 0);
                var _result$15 = (() => {
                    var $694 = _result$7;
                    var $695 = 0;
                    var $696 = _distance_between_max_min$14;
                    let _result$16 = $694;
                    for (let _range$15 = $695; _range$15 < $696; ++_range$15) {
                        var _y$17 = ((U32$to_i32$(_range$15) + _max$12) >> 0);
                        var _z$18 = ((((-_x$11)) - _y$17) >> 0);
                        var _new_coord$19 = App$Kaelin$Coord$Cubic$add$(_coord$1, App$Kaelin$Coord$Cubic$new$(_x$11, _y$17, _z$18));
                        var $694 = List$cons$(_new_coord$19, _result$16);
                        _result$16 = $694;
                    };
                    return _result$16;
                })();
                var $691 = _result$15;
                _result$7 = $691;
            };
            return _result$7;
        })();
        var $690 = _result$6;
        return $690;
    };
    const App$Kaelin$Coord$Cubic$range = x0 => x1 => App$Kaelin$Coord$Cubic$range$(x0, x1);

    function Word$lte$(_a$2, _b$3) {
        var $697 = Cmp$as_lte$(Word$cmp$(_a$2, _b$3));
        return $697;
    };
    const Word$lte = x0 => x1 => Word$lte$(x0, x1);
    const U32$lte = a0 => a1 => (a0 <= a1);

    function App$Kaelin$Coord$fit$(_coord$1, _map_size$2) {
        var _coord$3 = App$Kaelin$Coord$Convert$axial_to_cubic$(_coord$1);
        var self = _coord$3;
        switch (self._) {
            case 'App.Kaelin.Coord.Cubic.new':
                var $699 = self.x;
                var $700 = self.y;
                var $701 = self.z;
                var _x$7 = I32$abs$($699);
                var _y$8 = I32$abs$($700);
                var _z$9 = I32$abs$($701);
                var _greater$10 = I32$max$(_x$7, I32$max$(_y$8, _z$9));
                var _greater$11 = I32$to_u32$(_greater$10);
                var $702 = (_greater$11 <= _map_size$2);
                var $698 = $702;
                break;
        };
        return $698;
    };
    const App$Kaelin$Coord$fit = x0 => x1 => App$Kaelin$Coord$fit$(x0, x1);
    const App$Kaelin$Constants$map_size = 4;

    function List$filter$(_f$2, _xs$3) {
        var self = _xs$3;
        switch (self._) {
            case 'List.cons':
                var $704 = self.head;
                var $705 = self.tail;
                var self = _f$2($704);
                if (self) {
                    var $707 = List$cons$($704, List$filter$(_f$2, $705));
                    var $706 = $707;
                } else {
                    var $708 = List$filter$(_f$2, $705);
                    var $706 = $708;
                };
                var $703 = $706;
                break;
            case 'List.nil':
                var $709 = List$nil;
                var $703 = $709;
                break;
        };
        return $703;
    };
    const List$filter = x0 => x1 => List$filter$(x0, x1);

    function App$Kaelin$Coord$range$(_coord$1, _distance$2) {
        var _center$3 = App$Kaelin$Coord$Convert$axial_to_cubic$(_coord$1);
        var _list_coords$4 = List$map$(App$Kaelin$Coord$Convert$cubic_to_axial, App$Kaelin$Coord$Cubic$range$(_center$3, _distance$2));
        var _fit$5 = (_x$5 => {
            var $711 = App$Kaelin$Coord$fit$(_x$5, App$Kaelin$Constants$map_size);
            return $711;
        });
        var $710 = List$filter$(_fit$5, _list_coords$4);
        return $710;
    };
    const App$Kaelin$Coord$range = x0 => x1 => App$Kaelin$Coord$range$(x0, x1);

    function List$fold$(_list$2, _nil$4, _cons$5) {
        var self = _list$2;
        switch (self._) {
            case 'List.cons':
                var $713 = self.head;
                var $714 = self.tail;
                var $715 = _cons$5($713)(List$fold$($714, _nil$4, _cons$5));
                var $712 = $715;
                break;
            case 'List.nil':
                var $716 = _nil$4;
                var $712 = $716;
                break;
        };
        return $712;
    };
    const List$fold = x0 => x1 => x2 => List$fold$(x0, x1, x2);

    function List$foldr$(_b$3, _f$4, _xs$5) {
        var $717 = List$fold$(_xs$5, _b$3, _f$4);
        return $717;
    };
    const List$foldr = x0 => x1 => x2 => List$foldr$(x0, x1, x2);

    function App$Kaelin$Map$set$(_coord$1, _tile$2, _map$3) {
        var _key$4 = App$Kaelin$Coord$Convert$axial_to_nat$(_coord$1);
        var $718 = NatMap$set$(_key$4, _tile$2, _map$3);
        return $718;
    };
    const App$Kaelin$Map$set = x0 => x1 => x2 => App$Kaelin$Map$set$(x0, x1, x2);

    function App$Kaelin$Map$push$(_coord$1, _entity$2, _map$3) {
        var _tile$4 = App$Kaelin$Map$get$(_coord$1, _map$3);
        var self = _tile$4;
        switch (self._) {
            case 'Maybe.some':
                var $720 = self.value;
                var self = $720;
                switch (self._) {
                    case 'App.Kaelin.Tile.new':
                        var self = _entity$2;
                        switch (self._) {
                            case 'App.Kaelin.Map.Entity.animation':
                                var $723 = self.value;
                                var self = $720;
                                switch (self._) {
                                    case 'App.Kaelin.Tile.new':
                                        var $725 = self.background;
                                        var $726 = self.creature;
                                        var $727 = App$Kaelin$Tile$new$($725, $726, Maybe$some$($723));
                                        var _animation_tile$10 = $727;
                                        break;
                                };
                                var $724 = App$Kaelin$Map$set$(_coord$1, _animation_tile$10, _map$3);
                                var $722 = $724;
                                break;
                            case 'App.Kaelin.Map.Entity.background':
                                var $728 = self.value;
                                var self = $720;
                                switch (self._) {
                                    case 'App.Kaelin.Tile.new':
                                        var $730 = self.creature;
                                        var $731 = self.animation;
                                        var $732 = App$Kaelin$Tile$new$($728, $730, $731);
                                        var _background_tile$10 = $732;
                                        break;
                                };
                                var $729 = App$Kaelin$Map$set$(_coord$1, _background_tile$10, _map$3);
                                var $722 = $729;
                                break;
                            case 'App.Kaelin.Map.Entity.creature':
                                var $733 = self.value;
                                var self = $720;
                                switch (self._) {
                                    case 'App.Kaelin.Tile.new':
                                        var $735 = self.background;
                                        var $736 = self.animation;
                                        var $737 = App$Kaelin$Tile$new$($735, Maybe$some$($733), $736);
                                        var _creature_tile$10 = $737;
                                        break;
                                };
                                var $734 = App$Kaelin$Map$set$(_coord$1, _creature_tile$10, _map$3);
                                var $722 = $734;
                                break;
                        };
                        var $721 = $722;
                        break;
                };
                var $719 = $721;
                break;
            case 'Maybe.none':
                var self = _entity$2;
                switch (self._) {
                    case 'App.Kaelin.Map.Entity.background':
                        var $739 = self.value;
                        var _new_tile$6 = App$Kaelin$Tile$new$($739, Maybe$none, Maybe$none);
                        var $740 = App$Kaelin$Map$set$(_coord$1, _new_tile$6, _map$3);
                        var $738 = $740;
                        break;
                    case 'App.Kaelin.Map.Entity.animation':
                    case 'App.Kaelin.Map.Entity.creature':
                        var $741 = _map$3;
                        var $738 = $741;
                        break;
                };
                var $719 = $738;
                break;
        };
        return $719;
    };
    const App$Kaelin$Map$push = x0 => x1 => x2 => App$Kaelin$Map$push$(x0, x1, x2);

    function App$Kaelin$Map$Entity$animation$(_value$1) {
        var $742 = ({
            _: 'App.Kaelin.Map.Entity.animation',
            'value': _value$1
        });
        return $742;
    };
    const App$Kaelin$Map$Entity$animation = x0 => App$Kaelin$Map$Entity$animation$(x0);

    function App$Kaelin$Animation$new$(_duration$1, _sprite$2) {
        var $743 = ({
            _: 'App.Kaelin.Animation.new',
            'duration': _duration$1,
            'sprite': _sprite$2
        });
        return $743;
    };
    const App$Kaelin$Animation$new = x0 => x1 => App$Kaelin$Animation$new$(x0, x1);

    function App$Kaelin$Sprite$new$(_frame_info$1, _voxboxes$2) {
        var $744 = ({
            _: 'App.Kaelin.Sprite.new',
            'frame_info': _frame_info$1,
            'voxboxes': _voxboxes$2
        });
        return $744;
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
            var $746 = App$Kaelin$Map$push$(_coord$5, App$Kaelin$Map$Entity$animation$(App$Kaelin$Animation$new$(Maybe$some$(45n), App$Kaelin$Sprite$fire)), _map$6);
            return $746;
        }), _coords$1);
        var $745 = App$Kaelin$Effect$Result$new$(Unit$new, _map$5, List$nil, NatMap$new);
        return $745;
    };
    const App$Kaelin$Effect$animation$push = x0 => x1 => x2 => x3 => App$Kaelin$Effect$animation$push$(x0, x1, x2, x3);
    const List$for = a0 => a1 => a2 => (list_for(a0)(a1)(a2));

    function App$Kaelin$Effect$result$union$(_a$2, _b$3, _value_union$4) {
        var $747 = App$Kaelin$Effect$Result$new$(_value_union$4((() => {
            var self = _a$2;
            switch (self._) {
                case 'App.Kaelin.Effect.Result.new':
                    var $748 = self.value;
                    var $749 = $748;
                    return $749;
            };
        })())((() => {
            var self = _b$3;
            switch (self._) {
                case 'App.Kaelin.Effect.Result.new':
                    var $750 = self.value;
                    var $751 = $750;
                    return $751;
            };
        })()), (() => {
            var self = _b$3;
            switch (self._) {
                case 'App.Kaelin.Effect.Result.new':
                    var $752 = self.map;
                    var $753 = $752;
                    return $753;
            };
        })(), List$concat$((() => {
            var self = _a$2;
            switch (self._) {
                case 'App.Kaelin.Effect.Result.new':
                    var $754 = self.futures;
                    var $755 = $754;
                    return $755;
            };
        })(), (() => {
            var self = _b$3;
            switch (self._) {
                case 'App.Kaelin.Effect.Result.new':
                    var $756 = self.futures;
                    var $757 = $756;
                    return $757;
            };
        })()), NatMap$union$((() => {
            var self = _a$2;
            switch (self._) {
                case 'App.Kaelin.Effect.Result.new':
                    var $758 = self.indicators;
                    var $759 = $758;
                    return $759;
            };
        })(), (() => {
            var self = _b$3;
            switch (self._) {
                case 'App.Kaelin.Effect.Result.new':
                    var $760 = self.indicators;
                    var $761 = $760;
                    return $761;
            };
        })()));
        return $747;
    };
    const App$Kaelin$Effect$result$union = x0 => x1 => x2 => App$Kaelin$Effect$result$union$(x0, x1, x2);

    function App$Kaelin$Effect$area$(_eff$2, _coords$3, _center$4, _target$5, _map$6) {
        var _map_result$7 = NatMap$new;
        var _eff_result$8 = App$Kaelin$Effect$pure(_map_result$7);
        var _result$9 = App$Kaelin$Effect$Result$new$(_map_result$7, _map$6, List$nil, NatMap$new);
        var _result$10 = (() => {
            var $764 = _result$9;
            var $765 = _coords$3;
            let _result$11 = $764;
            let _coord$10;
            while ($765._ === 'List.cons') {
                _coord$10 = $765.head;
                var _result_of_effect$12 = _eff$2(_center$4)(_coord$10)((() => {
                    var self = _result$11;
                    switch (self._) {
                        case 'App.Kaelin.Effect.Result.new':
                            var $766 = self.map;
                            var $767 = $766;
                            return $767;
                    };
                })());
                var _key$13 = App$Kaelin$Coord$Convert$axial_to_nat$(_coord$10);
                var _new_form$14 = App$Kaelin$Effect$Result$new$(NatMap$set$(_key$13, (() => {
                    var self = _result_of_effect$12;
                    switch (self._) {
                        case 'App.Kaelin.Effect.Result.new':
                            var $768 = self.value;
                            var $769 = $768;
                            return $769;
                    };
                })(), NatMap$new), (() => {
                    var self = _result_of_effect$12;
                    switch (self._) {
                        case 'App.Kaelin.Effect.Result.new':
                            var $770 = self.map;
                            var $771 = $770;
                            return $771;
                    };
                })(), (() => {
                    var self = _result_of_effect$12;
                    switch (self._) {
                        case 'App.Kaelin.Effect.Result.new':
                            var $772 = self.futures;
                            var $773 = $772;
                            return $773;
                    };
                })(), (() => {
                    var self = _result_of_effect$12;
                    switch (self._) {
                        case 'App.Kaelin.Effect.Result.new':
                            var $774 = self.indicators;
                            var $775 = $774;
                            return $775;
                    };
                })());
                var $764 = App$Kaelin$Effect$result$union$(_result$11, _new_form$14, NatMap$union);
                _result$11 = $764;
                $765 = $765.tail;
            }
            return _result$11;
        })();
        var $762 = _result$10;
        return $762;
    };
    const App$Kaelin$Effect$area = x0 => x1 => x2 => x3 => x4 => App$Kaelin$Effect$area$(x0, x1, x2, x3, x4);

    function App$Kaelin$Map$creature$change_hp$(_value$1, _pos$2, _map$3) {
        var _creature$4 = App$Kaelin$Map$creature$get$(_pos$2, _map$3);
        var self = _creature$4;
        switch (self._) {
            case 'Maybe.some':
                var $777 = self.value;
                var self = $777;
                switch (self._) {
                    case 'App.Kaelin.Creature.new':
                        var $779 = self.hero;
                        var self = $779;
                        switch (self._) {
                            case 'App.Kaelin.Hero.new':
                                var $781 = self.max_hp;
                                var self = (0 === (() => {
                                    var self = $777;
                                    switch (self._) {
                                        case 'App.Kaelin.Creature.new':
                                            var $783 = self.hp;
                                            var $784 = $783;
                                            return $784;
                                    };
                                })());
                                if (self) {
                                    var $785 = Pair$new$(0, App$Kaelin$Map$creature$remove$(_pos$2, _map$3));
                                    var $782 = $785;
                                } else {
                                    var _new_hp$17 = I32$max$((((() => {
                                        var self = $777;
                                        switch (self._) {
                                            case 'App.Kaelin.Creature.new':
                                                var $787 = self.hp;
                                                var $788 = $787;
                                                return $788;
                                        };
                                    })() + _value$1) >> 0), 0);
                                    var _new_hp$18 = I32$min$(_new_hp$17, $781);
                                    var _hp_diff$19 = ((_new_hp$18 - (() => {
                                        var self = $777;
                                        switch (self._) {
                                            case 'App.Kaelin.Creature.new':
                                                var $789 = self.hp;
                                                var $790 = $789;
                                                return $790;
                                        };
                                    })()) >> 0);
                                    var _map$20 = App$Kaelin$Map$creature$modify_at$(App$Kaelin$Tile$creature$change_hp(_hp_diff$19), _pos$2, _map$3);
                                    var $786 = Pair$new$(_hp_diff$19, _map$20);
                                    var $782 = $786;
                                };
                                var $780 = $782;
                                break;
                        };
                        var $778 = $780;
                        break;
                };
                var $776 = $778;
                break;
            case 'Maybe.none':
                var _map$5 = App$Kaelin$Map$creature$modify_at$(App$Kaelin$Tile$creature$change_hp(_value$1), _pos$2, _map$3);
                var $791 = Pair$new$(_value$1, _map$5);
                var $776 = $791;
                break;
        };
        return $776;
    };
    const App$Kaelin$Map$creature$change_hp = x0 => x1 => x2 => App$Kaelin$Map$creature$change_hp$(x0, x1, x2);

    function App$Kaelin$Effect$hp$change$(_change$1) {
        var $792 = App$Kaelin$Effect$monad$((_m$bind$2 => _m$pure$3 => {
            var $793 = _m$bind$2;
            return $793;
        }))(App$Kaelin$Effect$map$get)((_map$2 => {
            var $794 = App$Kaelin$Effect$monad$((_m$bind$3 => _m$pure$4 => {
                var $795 = _m$bind$3;
                return $795;
            }))(App$Kaelin$Effect$coord$get_target)((_target$3 => {
                var _res$4 = App$Kaelin$Map$creature$change_hp$(_change$1, _target$3, _map$2);
                var self = _res$4;
                switch (self._) {
                    case 'Pair.new':
                        var $797 = self.fst;
                        var $798 = $797;
                        var _dhp$5 = $798;
                        break;
                };
                var self = _res$4;
                switch (self._) {
                    case 'Pair.new':
                        var $799 = self.snd;
                        var $800 = $799;
                        var _map$6 = $800;
                        break;
                };
                var _key$7 = App$Kaelin$Coord$Convert$axial_to_nat$(_target$3);
                var _indicators$8 = NatMap$new;
                var $796 = App$Kaelin$Effect$monad$((_m$bind$9 => _m$pure$10 => {
                    var $801 = _m$bind$9;
                    return $801;
                }))(App$Kaelin$Effect$map$set(_map$6))((_$9 => {
                    var $802 = App$Kaelin$Effect$monad$((_m$bind$10 => _m$pure$11 => {
                        var $803 = _m$bind$10;
                        return $803;
                    }))((() => {
                        var self = (_dhp$5 > 0);
                        if (self) {
                            var $804 = App$Kaelin$Effect$indicators$add(NatMap$set$(_key$7, App$Kaelin$Indicator$green, _indicators$8));
                            return $804;
                        } else {
                            var self = (_dhp$5 < 0);
                            if (self) {
                                var $806 = App$Kaelin$Effect$indicators$add(NatMap$set$(_key$7, App$Kaelin$Indicator$red, _indicators$8));
                                var $805 = $806;
                            } else {
                                var $807 = App$Kaelin$Effect$monad$((_m$bind$10 => _m$pure$11 => {
                                    var $808 = _m$pure$11;
                                    return $808;
                                }))(Unit$new);
                                var $805 = $807;
                            };
                            return $805;
                        };
                    })())((_$10 => {
                        var $809 = App$Kaelin$Effect$monad$((_m$bind$11 => _m$pure$12 => {
                            var $810 = _m$pure$12;
                            return $810;
                        }))(_dhp$5);
                        return $809;
                    }));
                    return $802;
                }));
                return $796;
            }));
            return $794;
        }));
        return $792;
    };
    const App$Kaelin$Effect$hp$change = x0 => App$Kaelin$Effect$hp$change$(x0);

    function App$Kaelin$Effect$hp$damage$(_dmg$1) {
        var $811 = App$Kaelin$Effect$hp$change$(((-_dmg$1)));
        return $811;
    };
    const App$Kaelin$Effect$hp$damage = x0 => App$Kaelin$Effect$hp$damage$(x0);

    function App$Kaelin$Skill$fireball$(_key$1, _dmg$2, _range$3) {
        var $812 = App$Kaelin$Effect$monad$((_m$bind$4 => _m$pure$5 => {
            var $813 = _m$bind$4;
            return $813;
        }))(App$Kaelin$Effect$coord$get_target)((_target_pos$4 => {
            var $814 = App$Kaelin$Effect$monad$((_m$bind$5 => _m$pure$6 => {
                var $815 = _m$bind$5;
                return $815;
            }))(App$Kaelin$Effect$coord$get_center)((_center_pos$5 => {
                var _coords$6 = App$Kaelin$Coord$range$(_target_pos$4, _range$3);
                var $816 = App$Kaelin$Effect$monad$((_m$bind$7 => _m$pure$8 => {
                    var $817 = _m$bind$7;
                    return $817;
                }))(App$Kaelin$Effect$animation$push(_coords$6))((_$7 => {
                    var $818 = App$Kaelin$Effect$monad$((_m$bind$8 => _m$pure$9 => {
                        var $819 = _m$bind$8;
                        return $819;
                    }))(App$Kaelin$Effect$area(App$Kaelin$Effect$hp$damage$(_dmg$2))(_coords$6))((_$8 => {
                        var $820 = App$Kaelin$Effect$monad$((_m$bind$9 => _m$pure$10 => {
                            var $821 = _m$bind$9;
                            return $821;
                        }))(App$Kaelin$Effect$ap$cost$(_key$1, _center_pos$5))((_$9 => {
                            var $822 = App$Kaelin$Effect$monad$((_m$bind$10 => _m$pure$11 => {
                                var $823 = _m$pure$11;
                                return $823;
                            }))(Unit$new);
                            return $822;
                        }));
                        return $820;
                    }));
                    return $818;
                }));
                return $816;
            }));
            return $814;
        }));
        return $812;
    };
    const App$Kaelin$Skill$fireball = x0 => x1 => x2 => App$Kaelin$Skill$fireball$(x0, x1, x2);
    const App$Kaelin$Heroes$Croni$skills$fireball = App$Kaelin$Skill$new$("Fireball", 2, 5, App$Kaelin$Skill$fireball$(87, 3, 1), 87);

    function App$Kaelin$Effect$ap$burn$(_key$1, _pos$2) {
        var $824 = App$Kaelin$Effect$ap$change_at$(_key$1, _pos$2);
        return $824;
    };
    const App$Kaelin$Effect$ap$burn = x0 => x1 => App$Kaelin$Effect$ap$burn$(x0, x1);

    function App$Kaelin$Map$creature$change_ap$(_value$1, _pos$2, _map$3) {
        var _change_ap$4 = (_val$4 => _crea$5 => {
            var self = _crea$5;
            switch (self._) {
                case 'App.Kaelin.Creature.new':
                    var $827 = self.hero;
                    var $828 = self.ap;
                    var self = $827;
                    switch (self._) {
                        case 'App.Kaelin.Hero.new':
                            var $830 = self.max_ap;
                            var _new_ap$17 = I32$min$((($828 + _value$1) >> 0), $830);
                            var self = _crea$5;
                            switch (self._) {
                                case 'App.Kaelin.Creature.new':
                                    var $832 = self.player;
                                    var $833 = self.hero;
                                    var $834 = self.team;
                                    var $835 = self.hp;
                                    var $836 = self.status;
                                    var $837 = App$Kaelin$Creature$new$($832, $833, $834, $835, _new_ap$17, $836);
                                    var $831 = $837;
                                    break;
                            };
                            var $829 = $831;
                            break;
                    };
                    var $826 = $829;
                    break;
            };
            return $826;
        });
        var _map$5 = App$Kaelin$Map$creature$modify_at$(_change_ap$4(_value$1), _pos$2, _map$3);
        var $825 = Pair$new$(_value$1, _map$5);
        return $825;
    };
    const App$Kaelin$Map$creature$change_ap = x0 => x1 => x2 => App$Kaelin$Map$creature$change_ap$(x0, x1, x2);

    function App$Kaelin$Effect$ap$change$(_change$1, _pos$2) {
        var $838 = App$Kaelin$Effect$monad$((_m$bind$3 => _m$pure$4 => {
            var $839 = _m$bind$3;
            return $839;
        }))(App$Kaelin$Effect$map$get)((_map$3 => {
            var _res$4 = App$Kaelin$Map$creature$change_ap$(_change$1, _pos$2, _map$3);
            var self = _res$4;
            switch (self._) {
                case 'Pair.new':
                    var $841 = self.fst;
                    var $842 = $841;
                    var _apc$5 = $842;
                    break;
            };
            var self = _res$4;
            switch (self._) {
                case 'Pair.new':
                    var $843 = self.snd;
                    var $844 = $843;
                    var _map$6 = $844;
                    break;
            };
            var _key$7 = App$Kaelin$Coord$Convert$axial_to_nat$(_pos$2);
            var $840 = App$Kaelin$Effect$monad$((_m$bind$8 => _m$pure$9 => {
                var $845 = _m$bind$8;
                return $845;
            }))(App$Kaelin$Effect$map$set(_map$6))((_$8 => {
                var $846 = App$Kaelin$Effect$monad$((_m$bind$9 => _m$pure$10 => {
                    var $847 = _m$pure$10;
                    return $847;
                }))(_apc$5);
                return $846;
            }));
            return $840;
        }));
        return $838;
    };
    const App$Kaelin$Effect$ap$change = x0 => x1 => App$Kaelin$Effect$ap$change$(x0, x1);

    function App$Kaelin$Effect$ap$restore$(_value$1, _pos$2) {
        var $848 = App$Kaelin$Effect$ap$change$(((-_value$1)), _pos$2);
        return $848;
    };
    const App$Kaelin$Effect$ap$restore = x0 => x1 => App$Kaelin$Effect$ap$restore$(x0, x1);

    function App$Kaelin$Skill$ap_drain$(_key$1) {
        var $849 = App$Kaelin$Effect$monad$((_m$bind$2 => _m$pure$3 => {
            var $850 = _m$bind$2;
            return $850;
        }))(App$Kaelin$Effect$map$get)((_map$2 => {
            var $851 = App$Kaelin$Effect$monad$((_m$bind$3 => _m$pure$4 => {
                var $852 = _m$bind$3;
                return $852;
            }))(App$Kaelin$Effect$coord$get_center)((_center_pos$3 => {
                var $853 = App$Kaelin$Effect$monad$((_m$bind$4 => _m$pure$5 => {
                    var $854 = _m$bind$4;
                    return $854;
                }))(App$Kaelin$Effect$coord$get_target)((_target_pos$4 => {
                    var _block$5 = App$Kaelin$Coord$eql$(_target_pos$4, _center_pos$3);
                    var self = _block$5;
                    if (self) {
                        var $856 = App$Kaelin$Effect$monad$((_m$bind$6 => _m$pure$7 => {
                            var $857 = _m$pure$7;
                            return $857;
                        }))(Unit$new);
                        var $855 = $856;
                    } else {
                        var $858 = App$Kaelin$Effect$monad$((_m$bind$6 => _m$pure$7 => {
                            var $859 = _m$bind$6;
                            return $859;
                        }))(App$Kaelin$Effect$ap$burn$(_key$1, _target_pos$4))((_burn$6 => {
                            var $860 = App$Kaelin$Effect$monad$((_m$bind$7 => _m$pure$8 => {
                                var $861 = _m$bind$7;
                                return $861;
                            }))(App$Kaelin$Effect$ap$restore$(1, _target_pos$4))((_$7 => {
                                var $862 = App$Kaelin$Effect$monad$((_m$bind$8 => _m$pure$9 => {
                                    var $863 = _m$bind$8;
                                    return $863;
                                }))(App$Kaelin$Effect$ap$restore$(((-((_burn$6 + 3) >> 0))), _center_pos$3))((_$8 => {
                                    var $864 = App$Kaelin$Effect$monad$((_m$bind$9 => _m$pure$10 => {
                                        var $865 = _m$pure$10;
                                        return $865;
                                    }))(Unit$new);
                                    return $864;
                                }));
                                return $862;
                            }));
                            return $860;
                        }));
                        var $855 = $858;
                    };
                    return $855;
                }));
                return $853;
            }));
            return $851;
        }));
        return $849;
    };
    const App$Kaelin$Skill$ap_drain = x0 => App$Kaelin$Skill$ap_drain$(x0);
    const App$Kaelin$Heroes$Croni$skills$ap_drain = App$Kaelin$Skill$new$("Action Points Drain", 3, 1, App$Kaelin$Skill$ap_drain$(69), 69);

    function App$Kaelin$Skill$ap_recover$(_restoration$1) {
        var $866 = App$Kaelin$Effect$monad$((_m$bind$2 => _m$pure$3 => {
            var $867 = _m$bind$2;
            return $867;
        }))(App$Kaelin$Effect$coord$get_center)((_self$2 => {
            var $868 = App$Kaelin$Effect$monad$((_m$bind$3 => _m$pure$4 => {
                var $869 = _m$bind$3;
                return $869;
            }))(App$Kaelin$Effect$ap$restore$(((-_restoration$1)), _self$2))((_$3 => {
                var $870 = App$Kaelin$Effect$monad$((_m$bind$4 => _m$pure$5 => {
                    var $871 = _m$pure$5;
                    return $871;
                }))(Unit$new);
                return $870;
            }));
            return $868;
        }));
        return $866;
    };
    const App$Kaelin$Skill$ap_recover = x0 => App$Kaelin$Skill$ap_recover$(x0);
    const App$Kaelin$Heroes$Croni$skills$ap_recover = App$Kaelin$Skill$new$("Action Points Reovery", 0, 0, App$Kaelin$Skill$ap_recover$(10), 82);

    function App$Kaelin$Coord$Cubic$distance$(_coord_a$1, _coord_b$2) {
        var self = _coord_a$1;
        switch (self._) {
            case 'App.Kaelin.Coord.Cubic.new':
                var $873 = self.x;
                var $874 = self.y;
                var $875 = self.z;
                var self = _coord_b$2;
                switch (self._) {
                    case 'App.Kaelin.Coord.Cubic.new':
                        var $877 = self.x;
                        var $878 = self.y;
                        var $879 = self.z;
                        var _subx$9 = (($873 - $877) >> 0);
                        var _suby$10 = (($874 - $878) >> 0);
                        var _subz$11 = (($875 - $879) >> 0);
                        var $880 = I32$max$(I32$max$(I32$abs$(_subx$9), I32$abs$(_suby$10)), I32$abs$(_subz$11));
                        var $876 = $880;
                        break;
                };
                var $872 = $876;
                break;
        };
        return $872;
    };
    const App$Kaelin$Coord$Cubic$distance = x0 => x1 => App$Kaelin$Coord$Cubic$distance$(x0, x1);

    function App$Kaelin$Coord$distance$(_fst_coord$1, _snd_coord$2) {
        var _convert_fst$3 = App$Kaelin$Coord$Convert$axial_to_cubic$(_fst_coord$1);
        var _convert_snd$4 = App$Kaelin$Coord$Convert$axial_to_cubic$(_snd_coord$2);
        var $881 = App$Kaelin$Coord$Cubic$distance$(_convert_fst$3, _convert_snd$4);
        return $881;
    };
    const App$Kaelin$Coord$distance = x0 => x1 => App$Kaelin$Coord$distance$(x0, x1);

    function App$Kaelin$Effect$movement$move_sup$(_value$1, _creature$2) {
        var self = _creature$2;
        switch (self._) {
            case 'App.Kaelin.Creature.new':
                var $883 = self.hero;
                var $884 = self.ap;
                var self = $883;
                switch (self._) {
                    case 'App.Kaelin.Hero.new':
                        var $886 = self.max_ap;
                        var _new_ap$14 = I32$max$((($884 - _value$1) >> 0), 0);
                        var _new_ap$15 = I32$min$(_new_ap$14, $886);
                        var _ap_diff$16 = ((_new_ap$15 - $884) >> 0);
                        var _new_ap$17 = I32$min$((($884 + _ap_diff$16) >> 0), $886);
                        var self = _creature$2;
                        switch (self._) {
                            case 'App.Kaelin.Creature.new':
                                var $888 = self.player;
                                var $889 = self.hero;
                                var $890 = self.team;
                                var $891 = self.hp;
                                var $892 = self.status;
                                var $893 = App$Kaelin$Creature$new$($888, $889, $890, $891, _new_ap$17, $892);
                                var $887 = $893;
                                break;
                        };
                        var $885 = $887;
                        break;
                };
                var $882 = $885;
                break;
        };
        return $882;
    };
    const App$Kaelin$Effect$movement$move_sup = x0 => x1 => App$Kaelin$Effect$movement$move_sup$(x0, x1);

    function App$Kaelin$Map$Entity$creature$(_value$1) {
        var $894 = ({
            _: 'App.Kaelin.Map.Entity.creature',
            'value': _value$1
        });
        return $894;
    };
    const App$Kaelin$Map$Entity$creature = x0 => App$Kaelin$Map$Entity$creature$(x0);

    function App$Kaelin$Map$creature$pop$(_coord$1, _map$2) {
        var _tile$3 = App$Kaelin$Map$get$(_coord$1, _map$2);
        var self = _tile$3;
        switch (self._) {
            case 'Maybe.some':
                var $896 = self.value;
                var self = $896;
                switch (self._) {
                    case 'App.Kaelin.Tile.new':
                        var $898 = self.background;
                        var $899 = self.creature;
                        var $900 = self.animation;
                        var _creature$8 = $899;
                        var _remaining_tile$9 = App$Kaelin$Tile$new$($898, Maybe$none, $900);
                        var _new_map$10 = App$Kaelin$Map$set$(_coord$1, _remaining_tile$9, _map$2);
                        var $901 = Pair$new$(_new_map$10, _creature$8);
                        var $897 = $901;
                        break;
                };
                var $895 = $897;
                break;
            case 'Maybe.none':
                var $902 = Pair$new$(_map$2, Maybe$none);
                var $895 = $902;
                break;
        };
        return $895;
    };
    const App$Kaelin$Map$creature$pop = x0 => x1 => App$Kaelin$Map$creature$pop$(x0, x1);

    function App$Kaelin$Map$creature$swap$(_ca$1, _cb$2, _map$3) {
        var self = App$Kaelin$Map$creature$pop$(_ca$1, _map$3);
        switch (self._) {
            case 'Pair.new':
                var $904 = self.fst;
                var $905 = self.snd;
                var self = $905;
                switch (self._) {
                    case 'Maybe.some':
                        var $907 = self.value;
                        var _entity$7 = App$Kaelin$Map$Entity$creature$($907);
                        var $908 = App$Kaelin$Map$push$(_cb$2, _entity$7, $904);
                        var $906 = $908;
                        break;
                    case 'Maybe.none':
                        var $909 = _map$3;
                        var $906 = $909;
                        break;
                };
                var $903 = $906;
                break;
        };
        return $903;
    };
    const App$Kaelin$Map$creature$swap = x0 => x1 => x2 => App$Kaelin$Map$creature$swap$(x0, x1, x2);
    const App$Kaelin$Effect$movement$move = App$Kaelin$Effect$monad$((_m$bind$1 => _m$pure$2 => {
        var $910 = _m$bind$1;
        return $910;
    }))(App$Kaelin$Effect$map$get)((_map$1 => {
        var $911 = App$Kaelin$Effect$monad$((_m$bind$2 => _m$pure$3 => {
            var $912 = _m$bind$2;
            return $912;
        }))(App$Kaelin$Effect$coord$get_center)((_center$2 => {
            var $913 = App$Kaelin$Effect$monad$((_m$bind$3 => _m$pure$4 => {
                var $914 = _m$bind$3;
                return $914;
            }))(App$Kaelin$Effect$coord$get_target)((_target$3 => {
                var _distance$4 = I32$abs$(App$Kaelin$Coord$distance$(_center$2, _target$3));
                var _creature$5 = App$Kaelin$Map$creature$get$(_center$2, _map$1);
                var self = _creature$5;
                switch (self._) {
                    case 'Maybe.some':
                        var $916 = self.value;
                        var _key$7 = App$Kaelin$Coord$Convert$axial_to_nat$(_center$2);
                        var _tile$8 = NatMap$get$(_key$7, _map$1);
                        var self = _tile$8;
                        switch (self._) {
                            case 'Maybe.none':
                                var $918 = App$Kaelin$Effect$monad$((_m$bind$9 => _m$pure$10 => {
                                    var $919 = _m$pure$10;
                                    return $919;
                                }))(Unit$new);
                                var $917 = $918;
                                break;
                            case 'Maybe.some':
                                var self = App$Kaelin$Map$is_occupied$(_target$3, _map$1);
                                if (self) {
                                    var $921 = App$Kaelin$Effect$monad$((_m$bind$10 => _m$pure$11 => {
                                        var $922 = _m$pure$11;
                                        return $922;
                                    }))(Unit$new);
                                    var $920 = $921;
                                } else {
                                    var self = (_distance$4 > (() => {
                                        var self = $916;
                                        switch (self._) {
                                            case 'App.Kaelin.Creature.new':
                                                var $924 = self.ap;
                                                var $925 = $924;
                                                return $925;
                                        };
                                    })());
                                    if (self) {
                                        var $926 = App$Kaelin$Effect$monad$((_m$bind$10 => _m$pure$11 => {
                                            var $927 = _m$pure$11;
                                            return $927;
                                        }))(Unit$new);
                                        var $923 = $926;
                                    } else {
                                        var _new_creature$10 = App$Kaelin$Effect$movement$move_sup$(_distance$4, $916);
                                        var _mod_map$11 = App$Kaelin$Map$push$(_center$2, App$Kaelin$Map$Entity$creature$(_new_creature$10), _map$1);
                                        var _new_map$12 = App$Kaelin$Map$creature$swap$(_center$2, _target$3, _mod_map$11);
                                        var $928 = App$Kaelin$Effect$map$set(_new_map$12);
                                        var $923 = $928;
                                    };
                                    var $920 = $923;
                                };
                                var $917 = $920;
                                break;
                        };
                        var $915 = $917;
                        break;
                    case 'Maybe.none':
                        var $929 = App$Kaelin$Effect$monad$((_m$bind$6 => _m$pure$7 => {
                            var $930 = _m$pure$7;
                            return $930;
                        }))(Unit$new);
                        var $915 = $929;
                        break;
                };
                return $915;
            }));
            return $913;
        }));
        return $911;
    }));

    function App$Kaelin$Skill$move$(_max_range$1) {
        var $931 = App$Kaelin$Skill$new$("Move", _max_range$1, 0, App$Kaelin$Effect$movement$move, 88);
        return $931;
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
        var $932 = App$Kaelin$Effect$monad$((_m$bind$3 => _m$pure$4 => {
            var $933 = _m$bind$3;
            return $933;
        }))(App$Kaelin$Effect$coord$get_target)((_target$3 => {
            var $934 = App$Kaelin$Effect$monad$((_m$bind$4 => _m$pure$5 => {
                var $935 = _m$bind$4;
                return $935;
            }))(App$Kaelin$Effect$coord$get_center)((_self$4 => {
                var $936 = App$Kaelin$Effect$monad$((_m$bind$5 => _m$pure$6 => {
                    var $937 = _m$bind$5;
                    return $937;
                }))(App$Kaelin$Effect$hp$heal_at$(_value$2, _target$3))((_$5 => {
                    var $938 = App$Kaelin$Effect$monad$((_m$bind$6 => _m$pure$7 => {
                        var $939 = _m$bind$6;
                        return $939;
                    }))(App$Kaelin$Effect$ap$cost$(_key$1, _self$4))((_$6 => {
                        var $940 = App$Kaelin$Effect$monad$((_m$bind$7 => _m$pure$8 => {
                            var $941 = _m$pure$8;
                            return $941;
                        }))(Unit$new);
                        return $940;
                    }));
                    return $938;
                }));
                return $936;
            }));
            return $934;
        }));
        return $932;
    };
    const App$Kaelin$Skill$restore = x0 => x1 => App$Kaelin$Skill$restore$(x0, x1);
    const App$Kaelin$Heroes$Lela$skills$restore = App$Kaelin$Skill$new$("Restore", 4, 3, App$Kaelin$Skill$restore$(81, 4), 81);

    function App$Kaelin$Skill$escort$(_key$1, _value$2) {
        var $942 = App$Kaelin$Effect$monad$((_m$bind$3 => _m$pure$4 => {
            var $943 = _m$bind$3;
            return $943;
        }))(App$Kaelin$Effect$coord$get_target)((_target$3 => {
            var $944 = App$Kaelin$Effect$monad$((_m$bind$4 => _m$pure$5 => {
                var $945 = _m$bind$4;
                return $945;
            }))(App$Kaelin$Effect$hp$heal_at$(_value$2, _target$3))((_$4 => {
                var $946 = App$Kaelin$Effect$monad$((_m$bind$5 => _m$pure$6 => {
                    var $947 = _m$bind$5;
                    return $947;
                }))(App$Kaelin$Effect$ap$restore$(_value$2, _target$3))((_$5 => {
                    var $948 = App$Kaelin$Effect$monad$((_m$bind$6 => _m$pure$7 => {
                        var $949 = _m$pure$7;
                        return $949;
                    }))(Unit$new);
                    return $948;
                }));
                return $946;
            }));
            return $944;
        }));
        return $942;
    };
    const App$Kaelin$Skill$escort = x0 => x1 => App$Kaelin$Skill$escort$(x0, x1);
    const App$Kaelin$Heroes$Lela$skills$escort = App$Kaelin$Skill$new$("Escort", 2, 2, App$Kaelin$Skill$escort$(87, 4), 87);

    function U16$new$(_value$1) {
        var $950 = word_to_u16(_value$1);
        return $950;
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
        var $951 = App$Kaelin$Effect$hp$change$(_heal$1);
        return $951;
    };
    const App$Kaelin$Effect$hp$heal = x0 => App$Kaelin$Effect$hp$heal$(x0);

    function App$Kaelin$Skill$empathy$(_key$1, _dmg$2, _range$3) {
        var $952 = App$Kaelin$Effect$monad$((_m$bind$4 => _m$pure$5 => {
            var $953 = _m$bind$4;
            return $953;
        }))(App$Kaelin$Effect$map$get)((_map$4 => {
            var $954 = App$Kaelin$Effect$monad$((_m$bind$5 => _m$pure$6 => {
                var $955 = _m$bind$5;
                return $955;
            }))(App$Kaelin$Effect$coord$get_target)((_target$5 => {
                var $956 = App$Kaelin$Effect$monad$((_m$bind$6 => _m$pure$7 => {
                    var $957 = _m$bind$6;
                    return $957;
                }))(App$Kaelin$Effect$coord$get_center)((_center$6 => {
                    var _area$7 = App$Kaelin$Coord$range$(_target$5, _range$3);
                    var $958 = App$Kaelin$Effect$monad$((_m$bind$8 => _m$pure$9 => {
                        var $959 = _m$bind$8;
                        return $959;
                    }))(App$Kaelin$Effect$ap$cost$(_key$1, _center$6))((_$8 => {
                        var $960 = App$Kaelin$Effect$monad$((_m$bind$9 => _m$pure$10 => {
                            var $961 = _m$bind$9;
                            return $961;
                        }))(App$Kaelin$Effect$hp$damage_at$(_dmg$2, _center$6))((_$9 => {
                            var $962 = App$Kaelin$Effect$monad$((_m$bind$10 => _m$pure$11 => {
                                var $963 = _m$bind$10;
                                return $963;
                            }))(App$Kaelin$Effect$area(App$Kaelin$Effect$hp$heal$(((_dmg$2 * 2) >> 0)))(_area$7))((_$10 => {
                                var $964 = App$Kaelin$Effect$monad$((_m$bind$11 => _m$pure$12 => {
                                    var $965 = _m$pure$12;
                                    return $965;
                                }))(Unit$new);
                                return $964;
                            }));
                            return $962;
                        }));
                        return $960;
                    }));
                    return $958;
                }));
                return $956;
            }));
            return $954;
        }));
        return $952;
    };
    const App$Kaelin$Skill$empathy = x0 => x1 => x2 => App$Kaelin$Skill$empathy$(x0, x1, x2);
    const App$Kaelin$Heroes$Octoking$skills$Empathy = App$Kaelin$Skill$new$("Empathy", 1, 0, App$Kaelin$Skill$empathy$(81, 2, 1), 81);
    const I32$div = a0 => a1 => ((a0 / a1) >> 0);

    function App$Kaelin$Skill$revenge$(_key$1) {
        var $966 = App$Kaelin$Effect$monad$((_m$bind$2 => _m$pure$3 => {
            var $967 = _m$bind$2;
            return $967;
        }))(App$Kaelin$Effect$map$get)((_map$2 => {
            var $968 = App$Kaelin$Effect$monad$((_m$bind$3 => _m$pure$4 => {
                var $969 = _m$bind$3;
                return $969;
            }))(App$Kaelin$Effect$coord$get_center)((_center$3 => {
                var $970 = App$Kaelin$Effect$monad$((_m$bind$4 => _m$pure$5 => {
                    var $971 = _m$bind$4;
                    return $971;
                }))(App$Kaelin$Effect$coord$get_target)((_target$4 => {
                    var _creature$5 = App$Kaelin$Map$creature$get$(_center$3, _map$2);
                    var self = _creature$5;
                    switch (self._) {
                        case 'Maybe.some':
                            var $973 = self.value;
                            var self = $973;
                            switch (self._) {
                                case 'App.Kaelin.Creature.new':
                                    var $975 = self.hero;
                                    var $976 = self.hp;
                                    var self = $975;
                                    switch (self._) {
                                        case 'App.Kaelin.Hero.new':
                                            var $978 = self.max_hp;
                                            var _missing_hp$18 = (($978 - $976) >> 0);
                                            var _true_dmg$19 = ((_missing_hp$18 / 4) >> 0);
                                            var $979 = _true_dmg$19;
                                            var $977 = $979;
                                            break;
                                    };
                                    var $974 = $977;
                                    break;
                            };
                            var _true_dmg$6 = $974;
                            break;
                        case 'Maybe.none':
                            var $980 = 0;
                            var _true_dmg$6 = $980;
                            break;
                    };
                    var $972 = App$Kaelin$Effect$monad$((_m$bind$7 => _m$pure$8 => {
                        var $981 = _m$bind$7;
                        return $981;
                    }))(App$Kaelin$Effect$ap$cost$(_key$1, _center$3))((_$7 => {
                        var $982 = App$Kaelin$Effect$monad$((_m$bind$8 => _m$pure$9 => {
                            var $983 = _m$bind$8;
                            return $983;
                        }))(App$Kaelin$Effect$hp$damage_at$(_true_dmg$6, _target$4))((_$8 => {
                            var $984 = App$Kaelin$Effect$monad$((_m$bind$9 => _m$pure$10 => {
                                var $985 = _m$pure$10;
                                return $985;
                            }))(Unit$new);
                            return $984;
                        }));
                        return $982;
                    }));
                    return $972;
                }));
                return $970;
            }));
            return $968;
        }));
        return $966;
    };
    const App$Kaelin$Skill$revenge = x0 => App$Kaelin$Skill$revenge$(x0);
    const App$Kaelin$Heroes$Octoking$skills$revenge = App$Kaelin$Skill$new$("Revenge", 1, 4, App$Kaelin$Skill$revenge$(87), 87);

    function App$Kaelin$Skill$ground_slam$(_key$1, _dmg$2) {
        var $986 = App$Kaelin$Effect$monad$((_m$bind$3 => _m$pure$4 => {
            var $987 = _m$bind$3;
            return $987;
        }))(App$Kaelin$Effect$coord$get_center)((_center$3 => {
            var _area$4 = App$Kaelin$Coord$range$(_center$3, 2);
            var $988 = App$Kaelin$Effect$monad$((_m$bind$5 => _m$pure$6 => {
                var $989 = _m$bind$5;
                return $989;
            }))(App$Kaelin$Effect$ap$cost$(_key$1, _center$3))((_$5 => {
                var $990 = App$Kaelin$Effect$monad$((_m$bind$6 => _m$pure$7 => {
                    var $991 = _m$bind$6;
                    return $991;
                }))(App$Kaelin$Effect$area(App$Kaelin$Effect$hp$damage$(_dmg$2))(_area$4))((_$6 => {
                    var $992 = App$Kaelin$Effect$monad$((_m$bind$7 => _m$pure$8 => {
                        var $993 = _m$pure$8;
                        return $993;
                    }))(Unit$new);
                    return $992;
                }));
                return $990;
            }));
            return $988;
        }));
        return $986;
    };
    const App$Kaelin$Skill$ground_slam = x0 => x1 => App$Kaelin$Skill$ground_slam$(x0, x1);
    const App$Kaelin$Heroes$Octoking$skills$ground_slam = App$Kaelin$Skill$new$("Ground Slam", 0, 3, App$Kaelin$Skill$ground_slam$(69, 2), 69);
    const App$Kaelin$Heroes$Octoking$skills$ap_recover = App$Kaelin$Skill$new$("Action Points Reovery", 0, 0, App$Kaelin$Skill$ap_recover$(10), 82);
    const App$Kaelin$Heroes$Octoking$skills = List$cons$(App$Kaelin$Heroes$Octoking$skills$Empathy, List$cons$(App$Kaelin$Heroes$Octoking$skills$revenge, List$cons$(App$Kaelin$Heroes$Octoking$skills$ground_slam, List$cons$(App$Kaelin$Heroes$Octoking$skills$ap_recover, List$cons$(App$Kaelin$Skill$move$(2), List$nil)))));
    const App$Kaelin$Heroes$Octoking$hero = App$Kaelin$Hero$new$("Octoking", App$Kaelin$Assets$hero$octoking, 40, 10, App$Kaelin$Heroes$Octoking$skills);

    function App$Kaelin$Hero$info$(_id$1) {
        var self = (_id$1 === 0);
        if (self) {
            var $995 = Maybe$some$(App$Kaelin$Heroes$Croni$hero);
            var $994 = $995;
        } else {
            var self = (_id$1 === 1);
            if (self) {
                var $997 = Maybe$some$(App$Kaelin$Heroes$Cyclope$hero);
                var $996 = $997;
            } else {
                var self = (_id$1 === 2);
                if (self) {
                    var $999 = Maybe$some$(App$Kaelin$Heroes$Lela$hero);
                    var $998 = $999;
                } else {
                    var self = (_id$1 === 3);
                    if (self) {
                        var $1001 = Maybe$some$(App$Kaelin$Heroes$Octoking$hero);
                        var $1000 = $1001;
                    } else {
                        var $1002 = Maybe$none;
                        var $1000 = $1002;
                    };
                    var $998 = $1000;
                };
                var $996 = $998;
            };
            var $994 = $996;
        };
        return $994;
    };
    const App$Kaelin$Hero$info = x0 => App$Kaelin$Hero$info$(x0);

    function App$Kaelin$Tile$creature$create$(_hero_id$1, _player_addr$2, _team$3) {
        var _hero$4 = Maybe$default$(App$Kaelin$Hero$info$(_hero_id$1), App$Kaelin$Heroes$Croni$hero);
        var $1003 = App$Kaelin$Creature$new$(_player_addr$2, _hero$4, _team$3, (() => {
            var self = _hero$4;
            switch (self._) {
                case 'App.Kaelin.Hero.new':
                    var $1004 = self.max_hp;
                    var $1005 = $1004;
                    return $1005;
            };
        })(), (() => {
            var self = _hero$4;
            switch (self._) {
                case 'App.Kaelin.Hero.new':
                    var $1006 = self.max_ap;
                    var $1007 = $1006;
                    return $1007;
            };
        })(), List$nil);
        return $1003;
    };
    const App$Kaelin$Tile$creature$create = x0 => x1 => x2 => App$Kaelin$Tile$creature$create$(x0, x1, x2);
    const App$Kaelin$Team$neutral = ({
        _: 'App.Kaelin.Team.neutral'
    });

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
        var _map$12 = App$Kaelin$Map$push$(_new_coord$2(((-1)))(((-2))), _entity_croni$8, _map$1);
        var _map$13 = App$Kaelin$Map$push$(_new_coord$2(0)(3), _entity_cyclope$9, _map$12);
        var _map$14 = App$Kaelin$Map$push$(_new_coord$2(((-2)))(0), _entity_lela$10, _map$13);
        var _map$15 = App$Kaelin$Map$push$(_new_coord$2(3)(((-2))), _entity_octoking$11, _map$14);
        var $1008 = _map$15;
        return $1008;
    };
    const App$Kaelin$Map$init = x0 => App$Kaelin$Map$init$(x0);
    const App$Kaelin$Assets$tile$effect$blue_green2 = VoxBox$parse$("0e00010955400f00010955401000010955400c01010955400d01010955400e01011a9c7c0f01011a9c7c1001011cad851101010955401201010955400a02010955400b02010955400c02011cad850d02011cad850e02011cad850f02011a9c7c1002011cad851102011cad851202011a9c7c1302010955401402010955400803010955400903010955400a03011cad850b03011a9c7c0c03011cad850d03011cad850e03011cad850f03011a9c7c1003011a9c7c1103011a9c7c1203011a9c7c1303011cad851403011cad851503010955401603010955400604010955400704010955400804011cad850904011cad850a04011cad850b04011a9c7c0c04011a9c7c0d04011cad850e04011cad850f04011a9c7c1004011cad851104011a9c7c1204011a9c7c1304011a9c7c1404011a9c7c1504011a9c7c1604011a9c7c1704010955401804010955400405010955400505010955400605011cad850705011a9c7c0805011cad850905011cad850a05011a9c7c0b05011a9c7c0c05011a9c7c0d050115896c0e050115896c0f05011cad851005011cad851105011cad8512050115896c1305011a9c7c1405011cad851505011cad851605011a9c7c1705011cad851805011cad851905010955401a050109554002060109554003060109554004060115896c0506011cad850606011cad850706011a9c7c0806011a9c7c09060115896c0a06011a9c7c0b06011a9c7c0c06011a9c7c0d06011a9c7c0e060115896c0f06011cad851006011cad851106011a9c7c12060115896c13060115896c1406011cad851506011cad851606011a9c7c1706011a9c7c18060115896c1906011a9c7c1a06011a9c7c1b06010955401c06010955400007010955400107010955400207011a9c7c0307011a9c7c0407011a9c7c0507011cad850607011cad850707011cad850807011a9c7c09070115896c0a070115896c0b07011a9c7c0c07011cad850d07011cad850e07011a9c7c0f07011a9c7c1007011a9c7c1107011a9c7c1207011a9c7c1307011a9c7c1407011a9c7c1507011a9c7c1607011a9c7c1707011a9c7c18070115896c19070115896c1a07011a9c7c1b07011cad851c07011cad851d07010955401e07010955400008010955400108011a9c7c0208011cad850308011cad850408011a9c7c0508011cad850608011cad850708011cad850808011a9c7c0908011cad850a08011cad850b08011a9c7c0c08011a9c7c0d08011cad850e08011cad850f080115896c1008011a9c7c1108011cad851208011cad851308011a9c7c1408011cad851508011cad851608011cad851708011a9c7c1808011a9c7c1908011a9c7c1a08011a9c7c1b08011a9c7c1c08011cad851d08011cad851e08010955400009010955400109011a9c7c0209011a9c7c0309011cad850409011a9c7c0509011a9c7c0609011cad850709011a9c7c0809011a9c7c0909011cad850a09011cad850b09011a9c7c0c09011a9c7c0d09011cad850e09011cad850f09011a9c7c1009011a9c7c1109011cad851209011cad851309011a9c7c1409011a9c7c1509011cad851609011cad851709011a9c7c1809011a9c7c1909011cad851a09011cad851b09011a9c7c1c09011a9c7c1d09011a9c7c1e0901095540000a01095540010a011a9c7c020a011a9c7c030a0115896c040a0115896c050a011a9c7c060a011a9c7c070a011a9c7c080a011a9c7c090a011a9c7c0a0a011cad850b0a011cad850c0a011a9c7c0d0a011a9c7c0e0a011a9c7c0f0a011a9c7c100a011a9c7c110a011a9c7c120a011a9c7c130a011a9c7c140a0115896c150a011a9c7c160a011a9c7c170a011a9c7c180a011a9c7c190a011cad851a0a011cad851b0a011cad851c0a011a9c7c1d0a011a9c7c1e0a01095540000b01095540010b011a9c7c020b011cad85030b011a9c7c040b011a9c7c050b011cad85060b011cad85070b011a9c7c080b011a9c7c090b011a9c7c0a0b011a9c7c0b0b011a9c7c0c0b011a9c7c0d0b011cad850e0b011a9c7c0f0b011a9c7c100b011a9c7c110b011cad85120b011a9c7c130b011a9c7c140b0115896c150b011cad85160b011a9c7c170b011a9c7c180b011a9c7c190b011a9c7c1a0b011a9c7c1b0b011a9c7c1c0b011a9c7c1d0b011a9c7c1e0b01095540000c01095540010c011a9c7c020c011cad85030c011a9c7c040c011a9c7c050c011a9c7c060c011a9c7c070c011cad85080c011cad85090c011a9c7c0a0c0115896c0b0c0115896c0c0c011a9c7c0d0c011cad850e0c011a9c7c0f0c011cad85100c011a9c7c110c011a9c7c120c011a9c7c130c011a9c7c140c011a9c7c150c011a9c7c160c011cad85170c011cad85180c011a9c7c190c0115896c1a0c0115896c1b0c011a9c7c1c0c011a9c7c1d0c011a9c7c1e0c01095540000d01095540010d011a9c7c020d011a9c7c030d011cad85040d011cad85050d011a9c7c060d011cad85070d011cad85080d011cad85090d011a9c7c0a0d0115896c0b0d011a9c7c0c0d011cad850d0d011cad850e0d011a9c7c0f0d011cad85100d011a9c7c110d011a9c7c120d011cad85130d011cad85140d011a9c7c150d011cad85160d011cad85170d011cad85180d011a9c7c190d0115896c1a0d011a9c7c1b0d011cad851c0d011cad851d0d011a9c7c1e0d01095540000e01095540010e011a9c7c020e011cad85030e011cad85040e011cad85050e011a9c7c060e011cad85070e011cad85080e011a9c7c090e011a9c7c0a0e011a9c7c0b0e011a9c7c0c0e011cad850d0e011cad850e0e011cad850f0e0115896c100e011a9c7c110e011cad85120e011cad85130e011cad85140e011a9c7c150e011cad85160e011cad85170e011a9c7c180e011a9c7c190e011a9c7c1a0e011a9c7c1b0e011cad851c0e011cad851d0e011cad851e0e01095540000f01095540010f011a9c7c020f011cad85030f011cad85040f011a9c7c050f011a9c7c060f011a9c7c070f011a9c7c080f011a9c7c090f011a9c7c0a0f011a9c7c0b0f011a9c7c0c0f011a9c7c0d0f011cad850e0f011cad850f0f0115896c100f0115896c110f011cad85120f011cad85130f011a9c7c140f011a9c7c150f011a9c7c160f011a9c7c170f011a9c7c180f011a9c7c190f011a9c7c1a0f011a9c7c1b0f011a9c7c1c0f011cad851d0f011cad851e0f010955400010010955400110011a9c7c0210011cad850310011cad850410011a9c7c05100115896c0610011a9c7c0710011cad850810011cad850910011cad850a10011a9c7c0b10011cad850c10011cad850d10011a9c7c0e10011a9c7c0f10011cad851010011a9c7c1110011cad851210011cad851310011a9c7c14100115896c1510011a9c7c1610011cad851710011cad851810011cad851910011a9c7c1a10011cad851b10011cad851c10011a9c7c1d10011a9c7c1e10010955400011010955400111011cad850211011cad850311011cad850411011a9c7c0511011a9c7c0611011a9c7c0711011cad850811011cad850911011a9c7c0a11011a9c7c0b11011a9c7c0c11011a9c7c0d11011a9c7c0e11011a9c7c0f11011a9c7c1011011cad851111011cad851211011cad851311011a9c7c1411011a9c7c1511011a9c7c1611011cad851711011cad851811011a9c7c1911011a9c7c1a11011a9c7c1b11011a9c7c1c11011a9c7c1d11011a9c7c1e11010955400012010955400112011cad850212011cad850312011a9c7c0412011cad850512011cad850612011a9c7c0712011a9c7c0812011a9c7c0912011a9c7c0a12011a9c7c0b12011a9c7c0c12011cad850d12011cad850e12011cad850f12011a9c7c1012011cad851112011cad851212011a9c7c1312011cad851412011cad851512011a9c7c1612011a9c7c1712011a9c7c1812011a9c7c1912011a9c7c1a12011a9c7c1b12011cad851c12011cad851d12011cad851e12010955400013010955400113011a9c7c0213011a9c7c0313011a9c7c0413011cad850513011cad850613011a9c7c0713011a9c7c0813011a9c7c0913011cad850a13011cad850b13011a9c7c0c13011cad850d13011cad850e13011cad850f13011a9c7c1013011a9c7c1113011a9c7c1213011a9c7c1313011cad851413011cad851513011a9c7c1613011a9c7c1713011a9c7c1813011cad851913011cad851a13011a9c7c1b13011cad851c13011cad851d13011cad851e13010955400014010955400114011cad850214011a9c7c0314011a9c7c0414011a9c7c0514011a9c7c0614011a9c7c0714011a9c7c0814011cad850914011cad850a14011cad850b14011a9c7c0c14011a9c7c0d14011cad850e14011cad850f14011a9c7c1014011cad851114011a9c7c1214011a9c7c1314011a9c7c1414011a9c7c1514011a9c7c1614011a9c7c1714011cad851814011cad851914011cad851a14011a9c7c1b14011a9c7c1c14011cad851d14011cad851e14010955400015010955400115011cad850215011cad8503150115896c0415011a9c7c0515011cad850615011cad850715011a9c7c0815011cad850915011cad850a15011a9c7c0b15011a9c7c0c15011a9c7c0d150115896c0e150115896c0f15011cad851015011cad851115011cad8512150115896c1315011a9c7c1415011cad851515011cad851615011a9c7c1715011cad851815011cad851915011a9c7c1a15011a9c7c1b15011a9c7c1c150115896c1d150115896c1e15010955400016010955400116011cad850216011a9c7c03160115896c04160115896c0516011cad850616011cad850716011a9c7c0816011a9c7c09160115896c0a16011a9c7c0b16011a9c7c0c16011a9c7c0d16011a9c7c0e160115896c0f16011cad851016011cad851116011a9c7c12160115896c13160115896c1416011cad851516011cad851616011a9c7c1716011a9c7c18160115896c1916011a9c7c1a16011a9c7c1b16011a9c7c1c16011a9c7c1d160115896c1e16010955400017010955400117010955400217011a9c7c0317011a9c7c0417011a9c7c0517011a9c7c0617011a9c7c0717011a9c7c0817011a9c7c09170115896c0a170115896c0b17011a9c7c0c17011cad850d17011cad850e17011a9c7c0f17011a9c7c1017011a9c7c1117011a9c7c1217011a9c7c1317011a9c7c1417011a9c7c1517011a9c7c1617011a9c7c1717011a9c7c18170115896c19170115896c1a17011a9c7c1b17011cad851c17011cad851d17010955401e17010955400218010955400318010955400418011a9c7c0518011a9c7c0618011cad850718011cad850818011a9c7c0918011cad850a18011cad850b18011a9c7c0c18011cad850d18011cad850e18011cad850f180115896c10180115896c1118011cad851218011cad851318011a9c7c1418011a9c7c1518011cad851618011cad851718011a9c7c1818011cad851918011cad851a18011a9c7c1b18010955401c18010955400419010955400519010955400619011cad850719011cad850819011a9c7c0919011cad850a19011cad850b19011a9c7c0c19011a9c7c0d19011cad850e19011cad850f190115896c1019011a9c7c1119011cad851219011cad851319011a9c7c1419011cad851519011cad851619011cad851719011a9c7c1819011cad851919010955401a1901095540061a01095540071a01095540081a011a9c7c091a011a9c7c0a1a011a9c7c0b1a011a9c7c0c1a011a9c7c0d1a011a9c7c0e1a011a9c7c0f1a011a9c7c101a011a9c7c111a011a9c7c121a011a9c7c131a011a9c7c141a011cad85151a011cad85161a011a9c7c171a01095540181a01095540081b01095540091b010955400a1b0115896c0b1b0115896c0c1b011a9c7c0d1b011a9c7c0e1b011a9c7c0f1b011cad85101b011a9c7c111b011a9c7c121b011a9c7c131b011a9c7c141b011a9c7c151b01095540161b010955400a1c010955400b1c010955400c1c011cad850d1c011cad850e1c011a9c7c0f1c011cad85101c011a9c7c111c011a9c7c121c011cad85131c01095540141c010955400c1d010955400d1d010955400e1d011cad850f1d011a9c7c101d011a9c7c111d01095540121d010955400e1e010955400f1e01095540101e01095540");
    const App$Kaelin$Assets$tile$effect$dark_red2 = VoxBox$parse$("0e0001881c170f0001881c17100001881c170c0101881c170d0101881c170e0101bc524c0f0101bc524c100101c75f56110101881c17120101881c170a0201881c170b0201881c170c0201c75f560d0201c75f560e0201c75f560f0201bc524c100201c75f56110201c75f56120201bc524c130201881c17140201881c17080301881c17090301881c170a0301c75f560b0301bc524c0c0301c75f560d0301c75f560e0301c75f560f0301bc524c100301bc524c110301bc524c120301bc524c130301c75f56140301c75f56150301881c17160301881c17060401881c17070401881c17080401c75f56090401c75f560a0401c75f560b0401bc524c0c0401bc524c0d0401c75f560e0401c75f560f0401bc524c100401c75f56110401bc524c120401bc524c130401bc524c140401bc524c150401bc524c160401bc524c170401881c17180401881c17040501881c17050501881c17060501c75f56070501bc524c080501c75f56090501c75f560a0501bc524c0b0501bc524c0c0501bc524c0d0501ae443e0e0501ae443e0f0501c75f56100501c75f56110501c75f56120501ae443e130501bc524c140501c75f56150501c75f56160501bc524c170501c75f56180501c75f56190501881c171a0501881c17020601881c17030601881c17040601ae443e050601c75f56060601c75f56070601bc524c080601bc524c090601ae443e0a0601bc524c0b0601bc524c0c0601bc524c0d0601bc524c0e0601ae443e0f0601c75f56100601c75f56110601bc524c120601ae443e130601ae443e140601c75f56150601c75f56160601bc524c170601bc524c180601ae443e190601bc524c1a0601bc524c1b0601881c171c0601881c17000701881c17010701881c17020701bc524c030701bc524c040701bc524c050701c75f56060701c75f56070701c75f56080701bc524c090701ae443e0a0701ae443e0b0701bc524c0c0701c75f560d0701c75f560e0701bc524c0f0701bc524c100701bc524c110701bc524c120701bc524c130701bc524c140701bc524c150701bc524c160701bc524c170701bc524c180701ae443e190701ae443e1a0701bc524c1b0701c75f561c0701c75f561d0701881c171e0701881c17000801881c17010801bc524c020801c75f56030801c75f56040801bc524c050801c75f56060801c75f56070801c75f56080801bc524c090801c75f560a0801c75f560b0801bc524c0c0801bc524c0d0801c75f560e0801c75f560f0801ae443e100801bc524c110801c75f56120801c75f56130801bc524c140801c75f56150801c75f56160801c75f56170801bc524c180801bc524c190801bc524c1a0801bc524c1b0801bc524c1c0801c75f561d0801c75f561e0801881c17000901881c17010901bc524c020901bc524c030901c75f56040901bc524c050901bc524c060901c75f56070901bc524c080901bc524c090901c75f560a0901c75f560b0901bc524c0c0901bc524c0d0901c75f560e0901c75f560f0901bc524c100901bc524c110901c75f56120901c75f56130901bc524c140901bc524c150901c75f56160901c75f56170901bc524c180901bc524c190901c75f561a0901c75f561b0901bc524c1c0901bc524c1d0901bc524c1e0901881c17000a01881c17010a01bc524c020a01bc524c030a01ae443e040a01ae443e050a01bc524c060a01bc524c070a01bc524c080a01bc524c090a01bc524c0a0a01c75f560b0a01c75f560c0a01bc524c0d0a01bc524c0e0a01bc524c0f0a01bc524c100a01bc524c110a01bc524c120a01bc524c130a01bc524c140a01ae443e150a01bc524c160a01bc524c170a01bc524c180a01bc524c190a01c75f561a0a01c75f561b0a01c75f561c0a01bc524c1d0a01bc524c1e0a01881c17000b01881c17010b01bc524c020b01c75f56030b01bc524c040b01bc524c050b01c75f56060b01c75f56070b01bc524c080b01bc524c090b01bc524c0a0b01bc524c0b0b01bc524c0c0b01bc524c0d0b01c75f560e0b01bc524c0f0b01bc524c100b01bc524c110b01c75f56120b01bc524c130b01bc524c140b01ae443e150b01c75f56160b01bc524c170b01bc524c180b01bc524c190b01bc524c1a0b01bc524c1b0b01bc524c1c0b01bc524c1d0b01bc524c1e0b01881c17000c01881c17010c01bc524c020c01c75f56030c01bc524c040c01bc524c050c01bc524c060c01bc524c070c01c75f56080c01c75f56090c01bc524c0a0c01ae443e0b0c01ae443e0c0c01bc524c0d0c01c75f560e0c01bc524c0f0c01c75f56100c01bc524c110c01bc524c120c01bc524c130c01bc524c140c01bc524c150c01bc524c160c01c75f56170c01c75f56180c01bc524c190c01ae443e1a0c01ae443e1b0c01bc524c1c0c01bc524c1d0c01bc524c1e0c01881c17000d01881c17010d01bc524c020d01bc524c030d01c75f56040d01c75f56050d01bc524c060d01c75f56070d01c75f56080d01c75f56090d01bc524c0a0d01ae443e0b0d01bc524c0c0d01c75f560d0d01c75f560e0d01bc524c0f0d01c75f56100d01bc524c110d01bc524c120d01c75f56130d01c75f56140d01bc524c150d01c75f56160d01c75f56170d01c75f56180d01bc524c190d01ae443e1a0d01bc524c1b0d01c75f561c0d01c75f561d0d01bc524c1e0d01881c17000e01881c17010e01bc524c020e01c75f56030e01c75f56040e01c75f56050e01bc524c060e01c75f56070e01c75f56080e01bc524c090e01bc524c0a0e01bc524c0b0e01bc524c0c0e01c75f560d0e01c75f560e0e01c75f560f0e01ae443e100e01bc524c110e01c75f56120e01c75f56130e01c75f56140e01bc524c150e01c75f56160e01c75f56170e01bc524c180e01bc524c190e01bc524c1a0e01bc524c1b0e01c75f561c0e01c75f561d0e01c75f561e0e01881c17000f01881c17010f01bc524c020f01c75f56030f01c75f56040f01bc524c050f01bc524c060f01bc524c070f01bc524c080f01bc524c090f01bc524c0a0f01bc524c0b0f01bc524c0c0f01bc524c0d0f01c75f560e0f01c75f560f0f01ae443e100f01ae443e110f01c75f56120f01c75f56130f01bc524c140f01bc524c150f01bc524c160f01bc524c170f01bc524c180f01bc524c190f01bc524c1a0f01bc524c1b0f01bc524c1c0f01c75f561d0f01c75f561e0f01881c17001001881c17011001bc524c021001c75f56031001c75f56041001bc524c051001ae443e061001bc524c071001c75f56081001c75f56091001c75f560a1001bc524c0b1001c75f560c1001c75f560d1001bc524c0e1001bc524c0f1001c75f56101001bc524c111001c75f56121001c75f56131001bc524c141001ae443e151001bc524c161001c75f56171001c75f56181001c75f56191001bc524c1a1001c75f561b1001c75f561c1001bc524c1d1001bc524c1e1001881c17001101881c17011101c75f56021101c75f56031101c75f56041101bc524c051101bc524c061101bc524c071101c75f56081101c75f56091101bc524c0a1101bc524c0b1101bc524c0c1101bc524c0d1101bc524c0e1101bc524c0f1101bc524c101101c75f56111101c75f56121101c75f56131101bc524c141101bc524c151101bc524c161101c75f56171101c75f56181101bc524c191101bc524c1a1101bc524c1b1101bc524c1c1101bc524c1d1101bc524c1e1101881c17001201881c17011201c75f56021201c75f56031201bc524c041201c75f56051201c75f56061201bc524c071201bc524c081201bc524c091201bc524c0a1201bc524c0b1201bc524c0c1201c75f560d1201c75f560e1201c75f560f1201bc524c101201c75f56111201c75f56121201bc524c131201c75f56141201c75f56151201bc524c161201bc524c171201bc524c181201bc524c191201bc524c1a1201bc524c1b1201c75f561c1201c75f561d1201c75f561e1201881c17001301881c17011301bc524c021301bc524c031301bc524c041301c75f56051301c75f56061301bc524c071301bc524c081301bc524c091301c75f560a1301c75f560b1301bc524c0c1301c75f560d1301c75f560e1301c75f560f1301bc524c101301bc524c111301bc524c121301bc524c131301c75f56141301c75f56151301bc524c161301bc524c171301bc524c181301c75f56191301c75f561a1301bc524c1b1301c75f561c1301c75f561d1301c75f561e1301881c17001401881c17011401c75f56021401bc524c031401bc524c041401bc524c051401bc524c061401bc524c071401bc524c081401c75f56091401c75f560a1401c75f560b1401bc524c0c1401bc524c0d1401c75f560e1401c75f560f1401bc524c101401c75f56111401bc524c121401bc524c131401bc524c141401bc524c151401bc524c161401bc524c171401c75f56181401c75f56191401c75f561a1401bc524c1b1401bc524c1c1401c75f561d1401c75f561e1401881c17001501881c17011501c75f56021501c75f56031501ae443e041501bc524c051501c75f56061501c75f56071501bc524c081501c75f56091501c75f560a1501bc524c0b1501bc524c0c1501bc524c0d1501ae443e0e1501ae443e0f1501c75f56101501c75f56111501c75f56121501ae443e131501bc524c141501c75f56151501c75f56161501bc524c171501c75f56181501c75f56191501bc524c1a1501bc524c1b1501bc524c1c1501ae443e1d1501ae443e1e1501881c17001601881c17011601c75f56021601bc524c031601ae443e041601ae443e051601c75f56061601c75f56071601bc524c081601bc524c091601ae443e0a1601bc524c0b1601bc524c0c1601bc524c0d1601bc524c0e1601ae443e0f1601c75f56101601c75f56111601bc524c121601ae443e131601ae443e141601c75f56151601c75f56161601bc524c171601bc524c181601ae443e191601bc524c1a1601bc524c1b1601bc524c1c1601bc524c1d1601ae443e1e1601881c17001701881c17011701881c17021701bc524c031701bc524c041701bc524c051701bc524c061701bc524c071701bc524c081701bc524c091701ae443e0a1701ae443e0b1701bc524c0c1701c75f560d1701c75f560e1701bc524c0f1701bc524c101701bc524c111701bc524c121701bc524c131701bc524c141701bc524c151701bc524c161701bc524c171701bc524c181701ae443e191701ae443e1a1701bc524c1b1701c75f561c1701c75f561d1701881c171e1701881c17021801881c17031801881c17041801bc524c051801bc524c061801c75f56071801c75f56081801bc524c091801c75f560a1801c75f560b1801bc524c0c1801c75f560d1801c75f560e1801c75f560f1801ae443e101801ae443e111801c75f56121801c75f56131801bc524c141801bc524c151801c75f56161801c75f56171801bc524c181801c75f56191801c75f561a1801bc524c1b1801881c171c1801881c17041901881c17051901881c17061901c75f56071901c75f56081901bc524c091901c75f560a1901c75f560b1901bc524c0c1901bc524c0d1901c75f560e1901c75f560f1901ae443e101901bc524c111901c75f56121901c75f56131901bc524c141901c75f56151901c75f56161901c75f56171901bc524c181901c75f56191901881c171a1901881c17061a01881c17071a01881c17081a01bc524c091a01bc524c0a1a01bc524c0b1a01bc524c0c1a01bc524c0d1a01bc524c0e1a01bc524c0f1a01bc524c101a01bc524c111a01bc524c121a01bc524c131a01bc524c141a01c75f56151a01c75f56161a01bc524c171a01881c17181a01881c17081b01881c17091b01881c170a1b01ae443e0b1b01ae443e0c1b01bc524c0d1b01bc524c0e1b01bc524c0f1b01c75f56101b01bc524c111b01bc524c121b01bc524c131b01bc524c141b01bc524c151b01881c17161b01881c170a1c01881c170b1c01881c170c1c01c75f560d1c01c75f560e1c01bc524c0f1c01c75f56101c01bc524c111c01bc524c121c01c75f56131c01881c17141c01881c170c1d01881c170d1d01881c170e1d01c75f560f1d01bc524c101d01bc524c111d01881c17121d01881c170e1e01881c170f1e01881c17101e01881c17");
    const App$Kaelin$Assets$tile$effect$light_red2 = VoxBox$parse$("0e0001652b270f0001652b27100001652b270c0101652b270d0101652b270e010199615b0f010199615b100101a46e65110101652b27120101652b270a0201652b270b0201652b270c0201a46e650d0201a46e650e0201a46e650f020199615b100201a46e65110201a46e6512020199615b130201652b27140201652b27080301652b27090301652b270a0301a46e650b030199615b0c0301a46e650d0301a46e650e0301a46e650f030199615b10030199615b11030199615b12030199615b130301a46e65140301a46e65150301652b27160301652b27060401652b27070401652b27080401a46e65090401a46e650a0401a46e650b040199615b0c040199615b0d0401a46e650e0401a46e650f040199615b100401a46e6511040199615b12040199615b13040199615b14040199615b15040199615b16040199615b170401652b27180401652b27040501652b27050501652b27060501a46e6507050199615b080501a46e65090501a46e650a050199615b0b050199615b0c050199615b0d05018b534d0e05018b534d0f0501a46e65100501a46e65110501a46e651205018b534d13050199615b140501a46e65150501a46e6516050199615b170501a46e65180501a46e65190501652b271a0501652b27020601652b27030601652b270406018b534d050601a46e65060601a46e6507060199615b08060199615b0906018b534d0a060199615b0b060199615b0c060199615b0d060199615b0e06018b534d0f0601a46e65100601a46e6511060199615b1206018b534d1306018b534d140601a46e65150601a46e6516060199615b17060199615b1806018b534d19060199615b1a060199615b1b0601652b271c0601652b27000701652b27010701652b2702070199615b03070199615b04070199615b050701a46e65060701a46e65070701a46e6508070199615b0907018b534d0a07018b534d0b070199615b0c0701a46e650d0701a46e650e070199615b0f070199615b10070199615b11070199615b12070199615b13070199615b14070199615b15070199615b16070199615b17070199615b1807018b534d1907018b534d1a070199615b1b0701a46e651c0701a46e651d0701652b271e0701652b27000801652b2701080199615b020801a46e65030801a46e6504080199615b050801a46e65060801a46e65070801a46e6508080199615b090801a46e650a0801a46e650b080199615b0c080199615b0d0801a46e650e0801a46e650f08018b534d10080199615b110801a46e65120801a46e6513080199615b140801a46e65150801a46e65160801a46e6517080199615b18080199615b19080199615b1a080199615b1b080199615b1c0801a46e651d0801a46e651e0801652b27000901652b2701090199615b02090199615b030901a46e6504090199615b05090199615b060901a46e6507090199615b08090199615b090901a46e650a0901a46e650b090199615b0c090199615b0d0901a46e650e0901a46e650f090199615b10090199615b110901a46e65120901a46e6513090199615b14090199615b150901a46e65160901a46e6517090199615b18090199615b190901a46e651a0901a46e651b090199615b1c090199615b1d090199615b1e0901652b27000a01652b27010a0199615b020a0199615b030a018b534d040a018b534d050a0199615b060a0199615b070a0199615b080a0199615b090a0199615b0a0a01a46e650b0a01a46e650c0a0199615b0d0a0199615b0e0a0199615b0f0a0199615b100a0199615b110a0199615b120a0199615b130a0199615b140a018b534d150a0199615b160a0199615b170a0199615b180a0199615b190a01a46e651a0a01a46e651b0a01a46e651c0a0199615b1d0a0199615b1e0a01652b27000b01652b27010b0199615b020b01a46e65030b0199615b040b0199615b050b01a46e65060b01a46e65070b0199615b080b0199615b090b0199615b0a0b0199615b0b0b0199615b0c0b0199615b0d0b01a46e650e0b0199615b0f0b0199615b100b0199615b110b01a46e65120b0199615b130b0199615b140b018b534d150b01a46e65160b0199615b170b0199615b180b0199615b190b0199615b1a0b0199615b1b0b0199615b1c0b0199615b1d0b0199615b1e0b01652b27000c01652b27010c0199615b020c01a46e65030c0199615b040c0199615b050c0199615b060c0199615b070c01a46e65080c01a46e65090c0199615b0a0c018b534d0b0c018b534d0c0c0199615b0d0c01a46e650e0c0199615b0f0c01a46e65100c0199615b110c0199615b120c0199615b130c0199615b140c0199615b150c0199615b160c01a46e65170c01a46e65180c0199615b190c018b534d1a0c018b534d1b0c0199615b1c0c0199615b1d0c0199615b1e0c01652b27000d01652b27010d0199615b020d0199615b030d01a46e65040d01a46e65050d0199615b060d01a46e65070d01a46e65080d01a46e65090d0199615b0a0d018b534d0b0d0199615b0c0d01a46e650d0d01a46e650e0d0199615b0f0d01a46e65100d0199615b110d0199615b120d01a46e65130d01a46e65140d0199615b150d01a46e65160d01a46e65170d01a46e65180d0199615b190d018b534d1a0d0199615b1b0d01a46e651c0d01a46e651d0d0199615b1e0d01652b27000e01652b27010e0199615b020e01a46e65030e01a46e65040e01a46e65050e0199615b060e01a46e65070e01a46e65080e0199615b090e0199615b0a0e0199615b0b0e0199615b0c0e01a46e650d0e01a46e650e0e01a46e650f0e018b534d100e0199615b110e01a46e65120e01a46e65130e01a46e65140e0199615b150e01a46e65160e01a46e65170e0199615b180e0199615b190e0199615b1a0e0199615b1b0e01a46e651c0e01a46e651d0e01a46e651e0e01652b27000f01652b27010f0199615b020f01a46e65030f01a46e65040f0199615b050f0199615b060f0199615b070f0199615b080f0199615b090f0199615b0a0f0199615b0b0f0199615b0c0f0199615b0d0f01a46e650e0f01a46e650f0f018b534d100f018b534d110f01a46e65120f01a46e65130f0199615b140f0199615b150f0199615b160f0199615b170f0199615b180f0199615b190f0199615b1a0f0199615b1b0f0199615b1c0f01a46e651d0f01a46e651e0f01652b27001001652b2701100199615b021001a46e65031001a46e6504100199615b0510018b534d06100199615b071001a46e65081001a46e65091001a46e650a100199615b0b1001a46e650c1001a46e650d100199615b0e100199615b0f1001a46e6510100199615b111001a46e65121001a46e6513100199615b1410018b534d15100199615b161001a46e65171001a46e65181001a46e6519100199615b1a1001a46e651b1001a46e651c100199615b1d100199615b1e1001652b27001101652b27011101a46e65021101a46e65031101a46e6504110199615b05110199615b06110199615b071101a46e65081101a46e6509110199615b0a110199615b0b110199615b0c110199615b0d110199615b0e110199615b0f110199615b101101a46e65111101a46e65121101a46e6513110199615b14110199615b15110199615b161101a46e65171101a46e6518110199615b19110199615b1a110199615b1b110199615b1c110199615b1d110199615b1e1101652b27001201652b27011201a46e65021201a46e6503120199615b041201a46e65051201a46e6506120199615b07120199615b08120199615b09120199615b0a120199615b0b120199615b0c1201a46e650d1201a46e650e1201a46e650f120199615b101201a46e65111201a46e6512120199615b131201a46e65141201a46e6515120199615b16120199615b17120199615b18120199615b19120199615b1a120199615b1b1201a46e651c1201a46e651d1201a46e651e1201652b27001301652b2701130199615b02130199615b03130199615b041301a46e65051301a46e6506130199615b07130199615b08130199615b091301a46e650a1301a46e650b130199615b0c1301a46e650d1301a46e650e1301a46e650f130199615b10130199615b11130199615b12130199615b131301a46e65141301a46e6515130199615b16130199615b17130199615b181301a46e65191301a46e651a130199615b1b1301a46e651c1301a46e651d1301a46e651e1301652b27001401652b27011401a46e6502140199615b03140199615b04140199615b05140199615b06140199615b07140199615b081401a46e65091401a46e650a1401a46e650b140199615b0c140199615b0d1401a46e650e1401a46e650f140199615b101401a46e6511140199615b12140199615b13140199615b14140199615b15140199615b16140199615b171401a46e65181401a46e65191401a46e651a140199615b1b140199615b1c1401a46e651d1401a46e651e1401652b27001501652b27011501a46e65021501a46e650315018b534d04150199615b051501a46e65061501a46e6507150199615b081501a46e65091501a46e650a150199615b0b150199615b0c150199615b0d15018b534d0e15018b534d0f1501a46e65101501a46e65111501a46e651215018b534d13150199615b141501a46e65151501a46e6516150199615b171501a46e65181501a46e6519150199615b1a150199615b1b150199615b1c15018b534d1d15018b534d1e1501652b27001601652b27011601a46e6502160199615b0316018b534d0416018b534d051601a46e65061601a46e6507160199615b08160199615b0916018b534d0a160199615b0b160199615b0c160199615b0d160199615b0e16018b534d0f1601a46e65101601a46e6511160199615b1216018b534d1316018b534d141601a46e65151601a46e6516160199615b17160199615b1816018b534d19160199615b1a160199615b1b160199615b1c160199615b1d16018b534d1e1601652b27001701652b27011701652b2702170199615b03170199615b04170199615b05170199615b06170199615b07170199615b08170199615b0917018b534d0a17018b534d0b170199615b0c1701a46e650d1701a46e650e170199615b0f170199615b10170199615b11170199615b12170199615b13170199615b14170199615b15170199615b16170199615b17170199615b1817018b534d1917018b534d1a170199615b1b1701a46e651c1701a46e651d1701652b271e1701652b27021801652b27031801652b2704180199615b05180199615b061801a46e65071801a46e6508180199615b091801a46e650a1801a46e650b180199615b0c1801a46e650d1801a46e650e1801a46e650f18018b534d1018018b534d111801a46e65121801a46e6513180199615b14180199615b151801a46e65161801a46e6517180199615b181801a46e65191801a46e651a180199615b1b1801652b271c1801652b27041901652b27051901652b27061901a46e65071901a46e6508190199615b091901a46e650a1901a46e650b190199615b0c190199615b0d1901a46e650e1901a46e650f19018b534d10190199615b111901a46e65121901a46e6513190199615b141901a46e65151901a46e65161901a46e6517190199615b181901a46e65191901652b271a1901652b27061a01652b27071a01652b27081a0199615b091a0199615b0a1a0199615b0b1a0199615b0c1a0199615b0d1a0199615b0e1a0199615b0f1a0199615b101a0199615b111a0199615b121a0199615b131a0199615b141a01a46e65151a01a46e65161a0199615b171a01652b27181a01652b27081b01652b27091b01652b270a1b018b534d0b1b018b534d0c1b0199615b0d1b0199615b0e1b0199615b0f1b01a46e65101b0199615b111b0199615b121b0199615b131b0199615b141b0199615b151b01652b27161b01652b270a1c01652b270b1c01652b270c1c01a46e650d1c01a46e650e1c0199615b0f1c01a46e65101c0199615b111c0199615b121c01a46e65131c01652b27141c01652b270c1d01652b270d1d01652b270e1d01a46e650f1d0199615b101d0199615b111d01652b27121d01652b270e1e01652b270f1e01652b27101e01652b27");
    const App$Kaelin$Assets$tile$effect$dark_blue2 = VoxBox$parse$("0e00011b3d920f00011b3d921000011b3d920c01011b3d920d01011b3d920e01014c74c50f01014c74c51001015783c51101011b3d921201011b3d920a02011b3d920b02011b3d920c02015783c50d02015783c50e02015783c50f02014c74c51002015783c51102015783c51202014c74c51302011b3d921402011b3d920803011b3d920903011b3d920a03015783c50b03014c74c50c03015783c50d03015783c50e03015783c50f03014c74c51003014c74c51103014c74c51203014c74c51303015783c51403015783c51503011b3d921603011b3d920604011b3d920704011b3d920804015783c50904015783c50a04015783c50b04014c74c50c04014c74c50d04015783c50e04015783c50f04014c74c51004015783c51104014c74c51204014c74c51304014c74c51404014c74c51504014c74c51604014c74c51704011b3d921804011b3d920405011b3d920505011b3d920605015783c50705014c74c50805015783c50905015783c50a05014c74c50b05014c74c50c05014c74c50d05013e66b80e05013e66b80f05015783c51005015783c51105015783c51205013e66b81305014c74c51405015783c51505015783c51605014c74c51705015783c51805015783c51905011b3d921a05011b3d920206011b3d920306011b3d920406013e66b80506015783c50606015783c50706014c74c50806014c74c50906013e66b80a06014c74c50b06014c74c50c06014c74c50d06014c74c50e06013e66b80f06015783c51006015783c51106014c74c51206013e66b81306013e66b81406015783c51506015783c51606014c74c51706014c74c51806013e66b81906014c74c51a06014c74c51b06011b3d921c06011b3d920007011b3d920107011b3d920207014c74c50307014c74c50407014c74c50507015783c50607015783c50707015783c50807014c74c50907013e66b80a07013e66b80b07014c74c50c07015783c50d07015783c50e07014c74c50f07014c74c51007014c74c51107014c74c51207014c74c51307014c74c51407014c74c51507014c74c51607014c74c51707014c74c51807013e66b81907013e66b81a07014c74c51b07015783c51c07015783c51d07011b3d921e07011b3d920008011b3d920108014c74c50208015783c50308015783c50408014c74c50508015783c50608015783c50708015783c50808014c74c50908015783c50a08015783c50b08014c74c50c08014c74c50d08015783c50e08015783c50f08013e66b81008014c74c51108015783c51208015783c51308014c74c51408015783c51508015783c51608015783c51708014c74c51808014c74c51908014c74c51a08014c74c51b08014c74c51c08015783c51d08015783c51e08011b3d920009011b3d920109014c74c50209014c74c50309015783c50409014c74c50509014c74c50609015783c50709014c74c50809014c74c50909015783c50a09015783c50b09014c74c50c09014c74c50d09015783c50e09015783c50f09014c74c51009014c74c51109015783c51209015783c51309014c74c51409014c74c51509015783c51609015783c51709014c74c51809014c74c51909015783c51a09015783c51b09014c74c51c09014c74c51d09014c74c51e09011b3d92000a011b3d92010a014c74c5020a014c74c5030a013e66b8040a013e66b8050a014c74c5060a014c74c5070a014c74c5080a014c74c5090a014c74c50a0a015783c50b0a015783c50c0a014c74c50d0a014c74c50e0a014c74c50f0a014c74c5100a014c74c5110a014c74c5120a014c74c5130a014c74c5140a013e66b8150a014c74c5160a014c74c5170a014c74c5180a014c74c5190a015783c51a0a015783c51b0a015783c51c0a014c74c51d0a014c74c51e0a011b3d92000b011b3d92010b014c74c5020b015783c5030b014c74c5040b014c74c5050b015783c5060b015783c5070b014c74c5080b014c74c5090b014c74c50a0b014c74c50b0b014c74c50c0b014c74c50d0b015783c50e0b014c74c50f0b014c74c5100b014c74c5110b015783c5120b014c74c5130b014c74c5140b013e66b8150b015783c5160b014c74c5170b014c74c5180b014c74c5190b014c74c51a0b014c74c51b0b014c74c51c0b014c74c51d0b014c74c51e0b011b3d92000c011b3d92010c014c74c5020c015783c5030c014c74c5040c014c74c5050c014c74c5060c014c74c5070c015783c5080c015783c5090c014c74c50a0c013e66b80b0c013e66b80c0c014c74c50d0c015783c50e0c014c74c50f0c015783c5100c014c74c5110c014c74c5120c014c74c5130c014c74c5140c014c74c5150c014c74c5160c015783c5170c015783c5180c014c74c5190c013e66b81a0c013e66b81b0c014c74c51c0c014c74c51d0c014c74c51e0c011b3d92000d011b3d92010d014c74c5020d014c74c5030d015783c5040d015783c5050d014c74c5060d015783c5070d015783c5080d015783c5090d014c74c50a0d013e66b80b0d014c74c50c0d015783c50d0d015783c50e0d014c74c50f0d015783c5100d014c74c5110d014c74c5120d015783c5130d015783c5140d014c74c5150d015783c5160d015783c5170d015783c5180d014c74c5190d013e66b81a0d014c74c51b0d015783c51c0d015783c51d0d014c74c51e0d011b3d92000e011b3d92010e014c74c5020e015783c5030e015783c5040e015783c5050e014c74c5060e015783c5070e015783c5080e014c74c5090e014c74c50a0e014c74c50b0e014c74c50c0e015783c50d0e015783c50e0e015783c50f0e013e66b8100e014c74c5110e015783c5120e015783c5130e015783c5140e014c74c5150e015783c5160e015783c5170e014c74c5180e014c74c5190e014c74c51a0e014c74c51b0e015783c51c0e015783c51d0e015783c51e0e011b3d92000f011b3d92010f014c74c5020f015783c5030f015783c5040f014c74c5050f014c74c5060f014c74c5070f014c74c5080f014c74c5090f014c74c50a0f014c74c50b0f014c74c50c0f014c74c50d0f015783c50e0f015783c50f0f013e66b8100f013e66b8110f015783c5120f015783c5130f014c74c5140f014c74c5150f014c74c5160f014c74c5170f014c74c5180f014c74c5190f014c74c51a0f014c74c51b0f014c74c51c0f015783c51d0f015783c51e0f011b3d920010011b3d920110014c74c50210015783c50310015783c50410014c74c50510013e66b80610014c74c50710015783c50810015783c50910015783c50a10014c74c50b10015783c50c10015783c50d10014c74c50e10014c74c50f10015783c51010014c74c51110015783c51210015783c51310014c74c51410013e66b81510014c74c51610015783c51710015783c51810015783c51910014c74c51a10015783c51b10015783c51c10014c74c51d10014c74c51e10011b3d920011011b3d920111015783c50211015783c50311015783c50411014c74c50511014c74c50611014c74c50711015783c50811015783c50911014c74c50a11014c74c50b11014c74c50c11014c74c50d11014c74c50e11014c74c50f11014c74c51011015783c51111015783c51211015783c51311014c74c51411014c74c51511014c74c51611015783c51711015783c51811014c74c51911014c74c51a11014c74c51b11014c74c51c11014c74c51d11014c74c51e11011b3d920012011b3d920112015783c50212015783c50312014c74c50412015783c50512015783c50612014c74c50712014c74c50812014c74c50912014c74c50a12014c74c50b12014c74c50c12015783c50d12015783c50e12015783c50f12014c74c51012015783c51112015783c51212014c74c51312015783c51412015783c51512014c74c51612014c74c51712014c74c51812014c74c51912014c74c51a12014c74c51b12015783c51c12015783c51d12015783c51e12011b3d920013011b3d920113014c74c50213014c74c50313014c74c50413015783c50513015783c50613014c74c50713014c74c50813014c74c50913015783c50a13015783c50b13014c74c50c13015783c50d13015783c50e13015783c50f13014c74c51013014c74c51113014c74c51213014c74c51313015783c51413015783c51513014c74c51613014c74c51713014c74c51813015783c51913015783c51a13014c74c51b13015783c51c13015783c51d13015783c51e13011b3d920014011b3d920114015783c50214014c74c50314014c74c50414014c74c50514014c74c50614014c74c50714014c74c50814015783c50914015783c50a14015783c50b14014c74c50c14014c74c50d14015783c50e14015783c50f14014c74c51014015783c51114014c74c51214014c74c51314014c74c51414014c74c51514014c74c51614014c74c51714015783c51814015783c51914015783c51a14014c74c51b14014c74c51c14015783c51d14015783c51e14011b3d920015011b3d920115015783c50215015783c50315013e66b80415014c74c50515015783c50615015783c50715014c74c50815015783c50915015783c50a15014c74c50b15014c74c50c15014c74c50d15013e66b80e15013e66b80f15015783c51015015783c51115015783c51215013e66b81315014c74c51415015783c51515015783c51615014c74c51715015783c51815015783c51915014c74c51a15014c74c51b15014c74c51c15013e66b81d15013e66b81e15011b3d920016011b3d920116015783c50216014c74c50316013e66b80416013e66b80516015783c50616015783c50716014c74c50816014c74c50916013e66b80a16014c74c50b16014c74c50c16014c74c50d16014c74c50e16013e66b80f16015783c51016015783c51116014c74c51216013e66b81316013e66b81416015783c51516015783c51616014c74c51716014c74c51816013e66b81916014c74c51a16014c74c51b16014c74c51c16014c74c51d16013e66b81e16011b3d920017011b3d920117011b3d920217014c74c50317014c74c50417014c74c50517014c74c50617014c74c50717014c74c50817014c74c50917013e66b80a17013e66b80b17014c74c50c17015783c50d17015783c50e17014c74c50f17014c74c51017014c74c51117014c74c51217014c74c51317014c74c51417014c74c51517014c74c51617014c74c51717014c74c51817013e66b81917013e66b81a17014c74c51b17015783c51c17015783c51d17011b3d921e17011b3d920218011b3d920318011b3d920418014c74c50518014c74c50618015783c50718015783c50818014c74c50918015783c50a18015783c50b18014c74c50c18015783c50d18015783c50e18015783c50f18013e66b81018013e66b81118015783c51218015783c51318014c74c51418014c74c51518015783c51618015783c51718014c74c51818015783c51918015783c51a18014c74c51b18011b3d921c18011b3d920419011b3d920519011b3d920619015783c50719015783c50819014c74c50919015783c50a19015783c50b19014c74c50c19014c74c50d19015783c50e19015783c50f19013e66b81019014c74c51119015783c51219015783c51319014c74c51419015783c51519015783c51619015783c51719014c74c51819015783c51919011b3d921a19011b3d92061a011b3d92071a011b3d92081a014c74c5091a014c74c50a1a014c74c50b1a014c74c50c1a014c74c50d1a014c74c50e1a014c74c50f1a014c74c5101a014c74c5111a014c74c5121a014c74c5131a014c74c5141a015783c5151a015783c5161a014c74c5171a011b3d92181a011b3d92081b011b3d92091b011b3d920a1b013e66b80b1b013e66b80c1b014c74c50d1b014c74c50e1b014c74c50f1b015783c5101b014c74c5111b014c74c5121b014c74c5131b014c74c5141b014c74c5151b011b3d92161b011b3d920a1c011b3d920b1c011b3d920c1c015783c50d1c015783c50e1c014c74c50f1c015783c5101c014c74c5111c014c74c5121c015783c5131c011b3d92141c011b3d920c1d011b3d920d1d011b3d920e1d015783c50f1d014c74c5101d014c74c5111d011b3d92121d011b3d920e1e011b3d920f1e011b3d92101e011b3d92");
    const App$Kaelin$Assets$tile$green_2 = VoxBox$parse$("0e00011652320f00011652321000011652320c01011652320d01011652320e0101408d640f0101408d64100101469e651101011652321201011652320a02011652320b02011652320c0201469e650d0201469e650e0201469e650f0201408d64100201469e65110201469e65120201408d641302011652321402011652320803011652320903011652320a0301469e650b0301408d640c0301469e650d0301469e650e0301469e650f0301408d64100301408d64110301408d64120301408d64130301469e65140301469e65150301165232160301165232060401165232070401165232080401469e65090401469e650a0401469e650b0401408d640c0401408d640d0401469e650e0401469e650f0401408d64100401469e65110401408d64120401408d64130401408d64140401408d64150401408d64160401408d64170401165232180401165232040501165232050501165232060501469e65070501408d64080501469e65090501469e650a0501408d640b0501408d640c0501408d640d0501347e570e0501347e570f0501469e65100501469e65110501469e65120501347e57130501408d64140501469e65150501469e65160501408d64170501469e65180501469e651905011652321a0501165232020601165232030601165232040601347e57050601469e65060601469e65070601408d64080601408d64090601347e570a0601408d640b0601408d640c0601408d640d0601408d640e0601347e570f0601469e65100601469e65110601408d64120601347e57130601347e57140601469e65150601469e65160601408d64170601408d64180601347e57190601408d641a0601408d641b06011652321c0601165232000701165232010701165232020701408d64030701408d64040701408d64050701469e65060701469e65070701469e65080701408d64090701347e570a0701347e570b0701408d640c0701469e650d0701469e650e0701408d640f0701408d64100701408d64110701408d64120701408d64130701408d64140701408d64150701408d64160701408d64170701408d64180701347e57190701347e571a0701408d641b0701469e651c0701469e651d07011652321e0701165232000801165232010801408d64020801469e65030801469e65040801408d64050801469e65060801469e65070801469e65080801408d64090801469e650a0801469e650b0801408d640c0801408d640d0801469e650e0801469e650f0801347e57100801408d64110801469e65120801469e65130801408d64140801469e65150801469e65160801469e65170801408d64180801408d64190801408d641a0801408d641b0801408d641c0801469e651d0801469e651e0801165232000901165232010901408d64020901408d64030901469e65040901408d64050901408d64060901469e65070901408d64080901408d64090901469e650a0901469e650b0901408d640c0901408d640d0901469e650e0901469e650f0901408d64100901408d64110901469e65120901469e65130901408d64140901408d64150901469e65160901469e65170901408d64180901408d64190901469e651a0901469e651b0901408d641c0901408d641d0901408d641e0901165232000a01165232010a01408d64020a01408d64030a01347e57040a01347e57050a01408d64060a01408d64070a01408d64080a01408d64090a01408d640a0a01469e650b0a01469e650c0a01408d640d0a01408d640e0a01408d640f0a01408d64100a01408d64110a01408d64120a01408d64130a01408d64140a01347e57150a01408d64160a01408d64170a01408d64180a01408d64190a01469e651a0a01469e651b0a01469e651c0a01408d641d0a01408d641e0a01165232000b01165232010b01408d64020b01469e65030b01408d64040b01408d64050b01469e65060b01469e65070b01408d64080b01408d64090b01408d640a0b01408d640b0b01408d640c0b01408d640d0b01469e650e0b01408d640f0b01408d64100b01408d64110b01469e65120b01408d64130b01408d64140b01347e57150b01469e65160b01408d64170b01408d64180b01408d64190b01408d641a0b01408d641b0b01408d641c0b01408d641d0b01408d641e0b01165232000c01165232010c01408d64020c01469e65030c01408d64040c01408d64050c01408d64060c01408d64070c01469e65080c01469e65090c01408d640a0c01347e570b0c01347e570c0c01408d640d0c01469e650e0c01408d640f0c01469e65100c01408d64110c01408d64120c01408d64130c01408d64140c01408d64150c01408d64160c01469e65170c01469e65180c01408d64190c01347e571a0c01347e571b0c01408d641c0c01408d641d0c01408d641e0c01165232000d01165232010d01408d64020d01408d64030d01469e65040d01469e65050d01408d64060d01469e65070d01469e65080d01469e65090d01408d640a0d01347e570b0d01408d640c0d01469e650d0d01469e650e0d01408d640f0d01469e65100d01408d64110d01408d64120d01469e65130d01469e65140d01408d64150d01469e65160d01469e65170d01469e65180d01408d64190d01347e571a0d01408d641b0d01469e651c0d01469e651d0d01408d641e0d01165232000e01165232010e01408d64020e01469e65030e01469e65040e01469e65050e01408d64060e01469e65070e01469e65080e01408d64090e01408d640a0e01408d640b0e01408d640c0e01469e650d0e01469e650e0e01469e650f0e01347e57100e01408d64110e01469e65120e01469e65130e01469e65140e01408d64150e01469e65160e01469e65170e01408d64180e01408d64190e01408d641a0e01408d641b0e01469e651c0e01469e651d0e01469e651e0e01165232000f01165232010f01408d64020f01469e65030f01469e65040f01408d64050f01408d64060f01408d64070f01408d64080f01408d64090f01408d640a0f01408d640b0f01408d640c0f01408d640d0f01469e650e0f01469e650f0f01347e57100f01347e57110f01469e65120f01469e65130f01408d64140f01408d64150f01408d64160f01408d64170f01408d64180f01408d64190f01408d641a0f01408d641b0f01408d641c0f01469e651d0f01469e651e0f01165232001001165232011001408d64021001469e65031001469e65041001408d64051001347e57061001408d64071001469e65081001469e65091001469e650a1001408d640b1001469e650c1001469e650d1001408d640e1001408d640f1001469e65101001408d64111001469e65121001469e65131001408d64141001347e57151001408d64161001469e65171001469e65181001469e65191001408d641a1001469e651b1001469e651c1001408d641d1001408d641e1001165232001101165232011101469e65021101469e65031101469e65041101408d64051101408d64061101408d64071101469e65081101469e65091101408d640a1101408d640b1101408d640c1101408d640d1101408d640e1101408d640f1101408d64101101469e65111101469e65121101469e65131101408d64141101408d64151101408d64161101469e65171101469e65181101408d64191101408d641a1101408d641b1101408d641c1101408d641d1101408d641e1101165232001201165232011201469e65021201469e65031201408d64041201469e65051201469e65061201408d64071201408d64081201408d64091201408d640a1201408d640b1201408d640c1201469e650d1201469e650e1201469e650f1201408d64101201469e65111201469e65121201408d64131201469e65141201469e65151201408d64161201408d64171201408d64181201408d64191201408d641a1201408d641b1201469e651c1201469e651d1201469e651e1201165232001301165232011301408d64021301408d64031301408d64041301469e65051301469e65061301408d64071301408d64081301408d64091301469e650a1301469e650b1301408d640c1301469e650d1301469e650e1301469e650f1301408d64101301408d64111301408d64121301408d64131301469e65141301469e65151301408d64161301408d64171301408d64181301469e65191301469e651a1301408d641b1301469e651c1301469e651d1301469e651e1301165232001401165232011401469e65021401408d64031401408d64041401408d64051401408d64061401408d64071401408d64081401469e65091401469e650a1401469e650b1401408d640c1401408d640d1401469e650e1401469e650f1401408d64101401469e65111401408d64121401408d64131401408d64141401408d64151401408d64161401408d64171401469e65181401469e65191401469e651a1401408d641b1401408d641c1401469e651d1401469e651e1401165232001501165232011501469e65021501469e65031501347e57041501408d64051501469e65061501469e65071501408d64081501469e65091501469e650a1501408d640b1501408d640c1501408d640d1501347e570e1501347e570f1501469e65101501469e65111501469e65121501347e57131501408d64141501469e65151501469e65161501408d64171501469e65181501469e65191501408d641a1501408d641b1501408d641c1501347e571d1501347e571e1501165232001601165232011601469e65021601408d64031601347e57041601347e57051601469e65061601469e65071601408d64081601408d64091601347e570a1601408d640b1601408d640c1601408d640d1601408d640e1601347e570f1601469e65101601469e65111601408d64121601347e57131601347e57141601469e65151601469e65161601408d64171601408d64181601347e57191601408d641a1601408d641b1601408d641c1601408d641d1601347e571e1601165232001701165232011701165232021701408d64031701408d64041701408d64051701408d64061701408d64071701408d64081701408d64091701347e570a1701347e570b1701408d640c1701469e650d1701469e650e1701408d640f1701408d64101701408d64111701408d64121701408d64131701408d64141701408d64151701408d64161701408d64171701408d64181701347e57191701347e571a1701408d641b1701469e651c1701469e651d17011652321e1701165232021801165232031801165232041801408d64051801408d64061801469e65071801469e65081801408d64091801469e650a1801469e650b1801408d640c1801469e650d1801469e650e1801469e650f1801347e57101801347e57111801469e65121801469e65131801408d64141801408d64151801469e65161801469e65171801408d64181801469e65191801469e651a1801408d641b18011652321c1801165232041901165232051901165232061901469e65071901469e65081901408d64091901469e650a1901469e650b1901408d640c1901408d640d1901469e650e1901469e650f1901347e57101901408d64111901469e65121901469e65131901408d64141901469e65151901469e65161901469e65171901408d64181901469e651919011652321a1901165232061a01165232071a01165232081a01408d64091a01408d640a1a01408d640b1a01408d640c1a01408d640d1a01408d640e1a01408d640f1a01408d64101a01408d64111a01408d64121a01408d64131a01408d64141a01469e65151a01469e65161a01408d64171a01165232181a01165232081b01165232091b011652320a1b01347e570b1b01347e570c1b01408d640d1b01408d640e1b01408d640f1b01469e65101b01408d64111b01408d64121b01408d64131b01408d64141b01408d64151b01165232161b011652320a1c011652320b1c011652320c1c01469e650d1c01469e650e1c01408d640f1c01469e65101c01408d64111c01408d64121c01469e65131c01165232141c011652320c1d011652320d1d011652320e1d01469e650f1d01408d64101d01408d64111d01165232121d011652320e1e011652320f1e01165232101e01165232");

    function App$Kaelin$Resources$terrains$(_indicator$1) {
        var self = _indicator$1;
        switch (self._) {
            case 'App.Kaelin.Indicator.green':
                var $1010 = App$Kaelin$Assets$tile$effect$blue_green2;
                var $1009 = $1010;
                break;
            case 'App.Kaelin.Indicator.red':
                var $1011 = App$Kaelin$Assets$tile$effect$dark_red2;
                var $1009 = $1011;
                break;
            case 'App.Kaelin.Indicator.yellow':
                var $1012 = App$Kaelin$Assets$tile$effect$light_red2;
                var $1009 = $1012;
                break;
            case 'App.Kaelin.Indicator.blue':
                var $1013 = App$Kaelin$Assets$tile$effect$dark_blue2;
                var $1009 = $1013;
                break;
            case 'App.Kaelin.Indicator.background':
                var $1014 = App$Kaelin$Assets$tile$green_2;
                var $1009 = $1014;
                break;
        };
        return $1009;
    };
    const App$Kaelin$Resources$terrains = x0 => App$Kaelin$Resources$terrains$(x0);

    function App$Kaelin$Terrain$new$(_draw$1) {
        var $1015 = ({
            _: 'App.Kaelin.Terrain.new',
            'draw': _draw$1
        });
        return $1015;
    };
    const App$Kaelin$Terrain$new = x0 => App$Kaelin$Terrain$new$(x0);

    function App$Kaelin$Map$Entity$background$(_value$1) {
        var $1016 = ({
            _: 'App.Kaelin.Map.Entity.background',
            'value': _value$1
        });
        return $1016;
    };
    const App$Kaelin$Map$Entity$background = x0 => App$Kaelin$Map$Entity$background$(x0);
    const App$Kaelin$Map$arena = (() => {
        var _map$1 = NatMap$new;
        var _map_size$2 = App$Kaelin$Constants$map_size;
        var _width$3 = ((((_map_size$2 * 2) >>> 0) + 1) >>> 0);
        var _height$4 = ((((_map_size$2 * 2) >>> 0) + 1) >>> 0);
        var _terrain_img$5 = App$Kaelin$Resources$terrains;
        var _new_terrain$6 = App$Kaelin$Terrain$new$(_terrain_img$5);
        var _new_terrain$7 = App$Kaelin$Map$Entity$background$(_new_terrain$6);
        var _map$8 = (() => {
            var $1018 = _map$1;
            var $1019 = 0;
            var $1020 = _height$4;
            let _map$9 = $1018;
            for (let _j$8 = $1019; _j$8 < $1020; ++_j$8) {
                var _map$10 = (() => {
                    var $1021 = _map$9;
                    var $1022 = 0;
                    var $1023 = _width$3;
                    let _map$11 = $1021;
                    for (let _i$10 = $1022; _i$10 < $1023; ++_i$10) {
                        var _coord_i$12 = ((U32$to_i32$(_i$10) - U32$to_i32$(_map_size$2)) >> 0);
                        var _coord_j$13 = ((U32$to_i32$(_j$8) - U32$to_i32$(_map_size$2)) >> 0);
                        var _coord$14 = App$Kaelin$Coord$new$(_coord_i$12, _coord_j$13);
                        var _fit$15 = App$Kaelin$Coord$fit$(_coord$14, _map_size$2);
                        var self = _fit$15;
                        if (self) {
                            var $1024 = App$Kaelin$Map$push$(_coord$14, _new_terrain$7, _map$11);
                            var $1021 = $1024;
                        } else {
                            var $1025 = _map$11;
                            var $1021 = $1025;
                        };
                        _map$11 = $1021;
                    };
                    return _map$11;
                })();
                var $1018 = _map$10;
                _map$9 = $1018;
            };
            return _map$9;
        })();
        var $1017 = _map$8;
        return $1017;
    })();

    function App$EnvInfo$new$(_screen_size$1, _mouse_pos$2) {
        var $1026 = ({
            _: 'App.EnvInfo.new',
            'screen_size': _screen_size$1,
            'mouse_pos': _mouse_pos$2
        });
        return $1026;
    };
    const App$EnvInfo$new = x0 => x1 => App$EnvInfo$new$(x0, x1);

    function App$Kaelin$Internal$new$(_tick$1, _frame$2, _timer$3) {
        var $1027 = ({
            _: 'App.Kaelin.Internal.new',
            'tick': _tick$1,
            'frame': _frame$2,
            'timer': _timer$3
        });
        return $1027;
    };
    const App$Kaelin$Internal$new = x0 => x1 => x2 => App$Kaelin$Internal$new$(x0, x1, x2);
    const Map$new = BitsMap$new;

    function Parser$State$new$(_err$1, _nam$2, _ini$3, _idx$4, _str$5) {
        var $1028 = ({
            _: 'Parser.State.new',
            'err': _err$1,
            'nam': _nam$2,
            'ini': _ini$3,
            'idx': _idx$4,
            'str': _str$5
        });
        return $1028;
    };
    const Parser$State$new = x0 => x1 => x2 => x3 => x4 => Parser$State$new$(x0, x1, x2, x3, x4);

    function Parser$run$(_parser$2, _code$3) {
        var self = _parser$2(Parser$State$new$(Maybe$none, "", 0n, 0n, _code$3));
        switch (self._) {
            case 'Parser.Reply.value':
                var $1030 = self.val;
                var $1031 = Maybe$some$($1030);
                var $1029 = $1031;
                break;
            case 'Parser.Reply.error':
                var $1032 = Maybe$none;
                var $1029 = $1032;
                break;
        };
        return $1029;
    };
    const Parser$run = x0 => x1 => Parser$run$(x0, x1);

    function Parser$Reply$(_V$1) {
        var $1033 = null;
        return $1033;
    };
    const Parser$Reply = x0 => Parser$Reply$(x0);

    function Parser$Reply$error$(_err$2) {
        var $1034 = ({
            _: 'Parser.Reply.error',
            'err': _err$2
        });
        return $1034;
    };
    const Parser$Reply$error = x0 => Parser$Reply$error$(x0);

    function Parser$Error$new$(_nam$1, _ini$2, _idx$3, _msg$4) {
        var $1035 = ({
            _: 'Parser.Error.new',
            'nam': _nam$1,
            'ini': _ini$2,
            'idx': _idx$3,
            'msg': _msg$4
        });
        return $1035;
    };
    const Parser$Error$new = x0 => x1 => x2 => x3 => Parser$Error$new$(x0, x1, x2, x3);

    function Parser$Reply$fail$(_nam$2, _ini$3, _idx$4, _msg$5) {
        var $1036 = Parser$Reply$error$(Parser$Error$new$(_nam$2, _ini$3, _idx$4, _msg$5));
        return $1036;
    };
    const Parser$Reply$fail = x0 => x1 => x2 => x3 => Parser$Reply$fail$(x0, x1, x2, x3);
    const Nat$gtn = a0 => a1 => (a0 > a1);

    function Parser$Error$combine$(_a$1, _b$2) {
        var self = _a$1;
        switch (self._) {
            case 'Parser.Error.new':
                var $1038 = self.idx;
                var self = _b$2;
                switch (self._) {
                    case 'Parser.Error.new':
                        var $1040 = self.idx;
                        var self = ($1038 > $1040);
                        if (self) {
                            var $1042 = _a$1;
                            var $1041 = $1042;
                        } else {
                            var $1043 = _b$2;
                            var $1041 = $1043;
                        };
                        var $1039 = $1041;
                        break;
                };
                var $1037 = $1039;
                break;
        };
        return $1037;
    };
    const Parser$Error$combine = x0 => x1 => Parser$Error$combine$(x0, x1);

    function Parser$Error$maybe_combine$(_a$1, _b$2) {
        var self = _a$1;
        switch (self._) {
            case 'Maybe.some':
                var $1045 = self.value;
                var self = _b$2;
                switch (self._) {
                    case 'Maybe.some':
                        var $1047 = self.value;
                        var $1048 = Maybe$some$(Parser$Error$combine$($1045, $1047));
                        var $1046 = $1048;
                        break;
                    case 'Maybe.none':
                        var $1049 = _a$1;
                        var $1046 = $1049;
                        break;
                };
                var $1044 = $1046;
                break;
            case 'Maybe.none':
                var self = _b$2;
                switch (self._) {
                    case 'Maybe.none':
                        var $1051 = Maybe$none;
                        var $1050 = $1051;
                        break;
                    case 'Maybe.some':
                        var $1052 = _b$2;
                        var $1050 = $1052;
                        break;
                };
                var $1044 = $1050;
                break;
        };
        return $1044;
    };
    const Parser$Error$maybe_combine = x0 => x1 => Parser$Error$maybe_combine$(x0, x1);

    function Parser$Reply$value$(_pst$2, _val$3) {
        var $1053 = ({
            _: 'Parser.Reply.value',
            'pst': _pst$2,
            'val': _val$3
        });
        return $1053;
    };
    const Parser$Reply$value = x0 => x1 => Parser$Reply$value$(x0, x1);

    function Parser$first_of$go$(_pars$2, _pst$3) {
        var Parser$first_of$go$ = (_pars$2, _pst$3) => ({
            ctr: 'TCO',
            arg: [_pars$2, _pst$3]
        });
        var Parser$first_of$go = _pars$2 => _pst$3 => Parser$first_of$go$(_pars$2, _pst$3);
        var arg = [_pars$2, _pst$3];
        while (true) {
            let [_pars$2, _pst$3] = arg;
            var R = (() => {
                var self = _pst$3;
                switch (self._) {
                    case 'Parser.State.new':
                        var $1054 = self.err;
                        var $1055 = self.nam;
                        var $1056 = self.ini;
                        var $1057 = self.idx;
                        var $1058 = self.str;
                        var self = _pars$2;
                        switch (self._) {
                            case 'List.cons':
                                var $1060 = self.head;
                                var $1061 = self.tail;
                                var _parsed$11 = $1060(_pst$3);
                                var self = _parsed$11;
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $1063 = self.err;
                                        var _cur_err$13 = Maybe$some$($1063);
                                        var _far_err$14 = Parser$Error$maybe_combine$($1054, _cur_err$13);
                                        var _new_pst$15 = Parser$State$new$(_far_err$14, $1055, $1056, $1057, $1058);
                                        var $1064 = Parser$first_of$go$($1061, _new_pst$15);
                                        var $1062 = $1064;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $1065 = self.pst;
                                        var $1066 = self.val;
                                        var $1067 = Parser$Reply$value$($1065, $1066);
                                        var $1062 = $1067;
                                        break;
                                };
                                var $1059 = $1062;
                                break;
                            case 'List.nil':
                                var self = $1054;
                                switch (self._) {
                                    case 'Maybe.some':
                                        var $1069 = self.value;
                                        var $1070 = Parser$Reply$error$($1069);
                                        var $1068 = $1070;
                                        break;
                                    case 'Maybe.none':
                                        var $1071 = Parser$Reply$fail$($1055, $1056, $1057, "No parse.");
                                        var $1068 = $1071;
                                        break;
                                };
                                var $1059 = $1068;
                                break;
                        };
                        return $1059;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Parser$first_of$go = x0 => x1 => Parser$first_of$go$(x0, x1);

    function Parser$first_of$(_pars$2) {
        var $1072 = Parser$first_of$go(_pars$2);
        return $1072;
    };
    const Parser$first_of = x0 => Parser$first_of$(x0);

    function Parser$(_V$1) {
        var $1073 = null;
        return $1073;
    };
    const Parser = x0 => Parser$(x0);

    function String$cons$(_head$1, _tail$2) {
        var $1074 = (String.fromCharCode(_head$1) + _tail$2);
        return $1074;
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
                        var $1075 = self.err;
                        var $1076 = self.nam;
                        var $1077 = self.ini;
                        var $1078 = self.idx;
                        var $1079 = self.str;
                        var self = _text$3;
                        if (self.length === 0) {
                            var $1081 = Parser$Reply$value$(_pst$4, Unit$new);
                            var $1080 = $1081;
                        } else {
                            var $1082 = self.charCodeAt(0);
                            var $1083 = self.slice(1);
                            var self = $1079;
                            if (self.length === 0) {
                                var _error_msg$12 = ("Expected \'" + (_ini_txt$2 + "\', found end of file."));
                                var $1085 = Parser$Reply$fail$($1076, $1077, _ini_idx$1, _error_msg$12);
                                var $1084 = $1085;
                            } else {
                                var $1086 = self.charCodeAt(0);
                                var $1087 = self.slice(1);
                                var self = ($1082 === $1086);
                                if (self) {
                                    var _pst$14 = Parser$State$new$($1075, $1076, $1077, Nat$succ$($1078), $1087);
                                    var $1089 = Parser$text$go$(_ini_idx$1, _ini_txt$2, $1083, _pst$14);
                                    var $1088 = $1089;
                                } else {
                                    var _chr$14 = String$cons$($1086, String$nil);
                                    var _err$15 = ("Expected \'" + (_ini_txt$2 + ("\', found \'" + (_chr$14 + "\'."))));
                                    var $1090 = Parser$Reply$fail$($1076, $1077, _ini_idx$1, _err$15);
                                    var $1088 = $1090;
                                };
                                var $1084 = $1088;
                            };
                            var $1080 = $1084;
                        };
                        return $1080;
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
                var $1092 = self.idx;
                var self = Parser$text$go$($1092, _text$1, _text$1, _pst$2);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $1094 = self.err;
                        var $1095 = Parser$Reply$error$($1094);
                        var $1093 = $1095;
                        break;
                    case 'Parser.Reply.value':
                        var $1096 = self.pst;
                        var $1097 = self.val;
                        var $1098 = Parser$Reply$value$($1096, $1097);
                        var $1093 = $1098;
                        break;
                };
                var $1091 = $1093;
                break;
        };
        return $1091;
    };
    const Parser$text = x0 => x1 => Parser$text$(x0, x1);

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
                                var $1100 = self.pst;
                                var $1101 = self.val;
                                var $1102 = Parser$many$go$(_parse$2, (_xs$12 => {
                                    var $1103 = _values$3(List$cons$($1101, _xs$12));
                                    return $1103;
                                }), $1100);
                                var $1099 = $1102;
                                break;
                            case 'Parser.Reply.error':
                                var $1104 = Parser$Reply$value$(_pst$4, _values$3(List$nil));
                                var $1099 = $1104;
                                break;
                        };
                        return $1099;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Parser$many$go = x0 => x1 => x2 => Parser$many$go$(x0, x1, x2);

    function Parser$many$(_parser$2) {
        var $1105 = Parser$many$go(_parser$2)((_x$3 => {
            var $1106 = _x$3;
            return $1106;
        }));
        return $1105;
    };
    const Parser$many = x0 => Parser$many$(x0);

    function Parser$many1$(_parser$2, _pst$3) {
        var self = _pst$3;
        switch (self._) {
            case 'Parser.State.new':
                var $1108 = self.err;
                var _reply$9 = _parser$2(_pst$3);
                var self = _reply$9;
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $1110 = self.err;
                        var self = $1108;
                        switch (self._) {
                            case 'Maybe.some':
                                var $1112 = self.value;
                                var $1113 = Parser$Reply$error$(Parser$Error$combine$($1112, $1110));
                                var $1111 = $1113;
                                break;
                            case 'Maybe.none':
                                var $1114 = Parser$Reply$error$($1110);
                                var $1111 = $1114;
                                break;
                        };
                        var $1109 = $1111;
                        break;
                    case 'Parser.Reply.value':
                        var $1115 = self.pst;
                        var $1116 = self.val;
                        var self = $1115;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $1118 = self.err;
                                var $1119 = self.nam;
                                var $1120 = self.ini;
                                var $1121 = self.idx;
                                var $1122 = self.str;
                                var _reply$pst$17 = Parser$State$new$(Parser$Error$maybe_combine$($1108, $1118), $1119, $1120, $1121, $1122);
                                var self = _reply$pst$17;
                                switch (self._) {
                                    case 'Parser.State.new':
                                        var $1124 = self.err;
                                        var _reply$23 = Parser$many$(_parser$2)(_reply$pst$17);
                                        var self = _reply$23;
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $1126 = self.err;
                                                var self = $1124;
                                                switch (self._) {
                                                    case 'Maybe.some':
                                                        var $1128 = self.value;
                                                        var $1129 = Parser$Reply$error$(Parser$Error$combine$($1128, $1126));
                                                        var $1127 = $1129;
                                                        break;
                                                    case 'Maybe.none':
                                                        var $1130 = Parser$Reply$error$($1126);
                                                        var $1127 = $1130;
                                                        break;
                                                };
                                                var $1125 = $1127;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $1131 = self.pst;
                                                var $1132 = self.val;
                                                var self = $1131;
                                                switch (self._) {
                                                    case 'Parser.State.new':
                                                        var $1134 = self.err;
                                                        var $1135 = self.nam;
                                                        var $1136 = self.ini;
                                                        var $1137 = self.idx;
                                                        var $1138 = self.str;
                                                        var _reply$pst$31 = Parser$State$new$(Parser$Error$maybe_combine$($1124, $1134), $1135, $1136, $1137, $1138);
                                                        var $1139 = Parser$Reply$value$(_reply$pst$31, List$cons$($1116, $1132));
                                                        var $1133 = $1139;
                                                        break;
                                                };
                                                var $1125 = $1133;
                                                break;
                                        };
                                        var $1123 = $1125;
                                        break;
                                };
                                var $1117 = $1123;
                                break;
                        };
                        var $1109 = $1117;
                        break;
                };
                var $1107 = $1109;
                break;
        };
        return $1107;
    };
    const Parser$many1 = x0 => x1 => Parser$many1$(x0, x1);

    function Parser$hex_digit$(_pst$1) {
        var self = _pst$1;
        switch (self._) {
            case 'Parser.State.new':
                var $1141 = self.err;
                var $1142 = self.nam;
                var $1143 = self.ini;
                var $1144 = self.idx;
                var $1145 = self.str;
                var self = $1145;
                if (self.length === 0) {
                    var $1147 = Parser$Reply$fail$($1142, $1143, $1144, "Not a digit.");
                    var $1146 = $1147;
                } else {
                    var $1148 = self.charCodeAt(0);
                    var $1149 = self.slice(1);
                    var _pst$9 = Parser$State$new$($1141, $1142, $1143, Nat$succ$($1144), $1149);
                    var self = ($1148 === 48);
                    if (self) {
                        var $1151 = Parser$Reply$value$(_pst$9, 0n);
                        var $1150 = $1151;
                    } else {
                        var self = ($1148 === 49);
                        if (self) {
                            var $1153 = Parser$Reply$value$(_pst$9, 1n);
                            var $1152 = $1153;
                        } else {
                            var self = ($1148 === 50);
                            if (self) {
                                var $1155 = Parser$Reply$value$(_pst$9, 2n);
                                var $1154 = $1155;
                            } else {
                                var self = ($1148 === 51);
                                if (self) {
                                    var $1157 = Parser$Reply$value$(_pst$9, 3n);
                                    var $1156 = $1157;
                                } else {
                                    var self = ($1148 === 52);
                                    if (self) {
                                        var $1159 = Parser$Reply$value$(_pst$9, 4n);
                                        var $1158 = $1159;
                                    } else {
                                        var self = ($1148 === 53);
                                        if (self) {
                                            var $1161 = Parser$Reply$value$(_pst$9, 5n);
                                            var $1160 = $1161;
                                        } else {
                                            var self = ($1148 === 54);
                                            if (self) {
                                                var $1163 = Parser$Reply$value$(_pst$9, 6n);
                                                var $1162 = $1163;
                                            } else {
                                                var self = ($1148 === 55);
                                                if (self) {
                                                    var $1165 = Parser$Reply$value$(_pst$9, 7n);
                                                    var $1164 = $1165;
                                                } else {
                                                    var self = ($1148 === 56);
                                                    if (self) {
                                                        var $1167 = Parser$Reply$value$(_pst$9, 8n);
                                                        var $1166 = $1167;
                                                    } else {
                                                        var self = ($1148 === 57);
                                                        if (self) {
                                                            var $1169 = Parser$Reply$value$(_pst$9, 9n);
                                                            var $1168 = $1169;
                                                        } else {
                                                            var self = ($1148 === 97);
                                                            if (self) {
                                                                var $1171 = Parser$Reply$value$(_pst$9, 10n);
                                                                var $1170 = $1171;
                                                            } else {
                                                                var self = ($1148 === 98);
                                                                if (self) {
                                                                    var $1173 = Parser$Reply$value$(_pst$9, 11n);
                                                                    var $1172 = $1173;
                                                                } else {
                                                                    var self = ($1148 === 99);
                                                                    if (self) {
                                                                        var $1175 = Parser$Reply$value$(_pst$9, 12n);
                                                                        var $1174 = $1175;
                                                                    } else {
                                                                        var self = ($1148 === 100);
                                                                        if (self) {
                                                                            var $1177 = Parser$Reply$value$(_pst$9, 13n);
                                                                            var $1176 = $1177;
                                                                        } else {
                                                                            var self = ($1148 === 101);
                                                                            if (self) {
                                                                                var $1179 = Parser$Reply$value$(_pst$9, 14n);
                                                                                var $1178 = $1179;
                                                                            } else {
                                                                                var self = ($1148 === 102);
                                                                                if (self) {
                                                                                    var $1181 = Parser$Reply$value$(_pst$9, 15n);
                                                                                    var $1180 = $1181;
                                                                                } else {
                                                                                    var self = ($1148 === 65);
                                                                                    if (self) {
                                                                                        var $1183 = Parser$Reply$value$(_pst$9, 10n);
                                                                                        var $1182 = $1183;
                                                                                    } else {
                                                                                        var self = ($1148 === 66);
                                                                                        if (self) {
                                                                                            var $1185 = Parser$Reply$value$(_pst$9, 11n);
                                                                                            var $1184 = $1185;
                                                                                        } else {
                                                                                            var self = ($1148 === 67);
                                                                                            if (self) {
                                                                                                var $1187 = Parser$Reply$value$(_pst$9, 12n);
                                                                                                var $1186 = $1187;
                                                                                            } else {
                                                                                                var self = ($1148 === 68);
                                                                                                if (self) {
                                                                                                    var $1189 = Parser$Reply$value$(_pst$9, 13n);
                                                                                                    var $1188 = $1189;
                                                                                                } else {
                                                                                                    var self = ($1148 === 69);
                                                                                                    if (self) {
                                                                                                        var $1191 = Parser$Reply$value$(_pst$9, 14n);
                                                                                                        var $1190 = $1191;
                                                                                                    } else {
                                                                                                        var self = ($1148 === 70);
                                                                                                        if (self) {
                                                                                                            var $1193 = Parser$Reply$value$(_pst$9, 15n);
                                                                                                            var $1192 = $1193;
                                                                                                        } else {
                                                                                                            var $1194 = Parser$Reply$fail$($1142, $1143, $1144, "Not a digit.");
                                                                                                            var $1192 = $1194;
                                                                                                        };
                                                                                                        var $1190 = $1192;
                                                                                                    };
                                                                                                    var $1188 = $1190;
                                                                                                };
                                                                                                var $1186 = $1188;
                                                                                            };
                                                                                            var $1184 = $1186;
                                                                                        };
                                                                                        var $1182 = $1184;
                                                                                    };
                                                                                    var $1180 = $1182;
                                                                                };
                                                                                var $1178 = $1180;
                                                                            };
                                                                            var $1176 = $1178;
                                                                        };
                                                                        var $1174 = $1176;
                                                                    };
                                                                    var $1172 = $1174;
                                                                };
                                                                var $1170 = $1172;
                                                            };
                                                            var $1168 = $1170;
                                                        };
                                                        var $1166 = $1168;
                                                    };
                                                    var $1164 = $1166;
                                                };
                                                var $1162 = $1164;
                                            };
                                            var $1160 = $1162;
                                        };
                                        var $1158 = $1160;
                                    };
                                    var $1156 = $1158;
                                };
                                var $1154 = $1156;
                            };
                            var $1152 = $1154;
                        };
                        var $1150 = $1152;
                    };
                    var $1146 = $1150;
                };
                var $1140 = $1146;
                break;
        };
        return $1140;
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
                        var $1195 = self.head;
                        var $1196 = self.tail;
                        var $1197 = Nat$from_base$go$(_b$1, $1196, (_b$1 * _p$3), (($1195 * _p$3) + _res$4));
                        return $1197;
                    case 'List.nil':
                        var $1198 = _res$4;
                        return $1198;
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
                        var $1199 = self.head;
                        var $1200 = self.tail;
                        var $1201 = List$reverse$go$($1200, List$cons$($1199, _res$3));
                        return $1201;
                    case 'List.nil':
                        var $1202 = _res$3;
                        return $1202;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const List$reverse$go = x0 => x1 => List$reverse$go$(x0, x1);

    function List$reverse$(_xs$2) {
        var $1203 = List$reverse$go$(_xs$2, List$nil);
        return $1203;
    };
    const List$reverse = x0 => List$reverse$(x0);

    function Nat$from_base$(_base$1, _ds$2) {
        var $1204 = Nat$from_base$go$(_base$1, List$reverse$(_ds$2), 1n, 0n);
        return $1204;
    };
    const Nat$from_base = x0 => x1 => Nat$from_base$(x0, x1);

    function Parser$hex_nat$(_pst$1) {
        var self = _pst$1;
        switch (self._) {
            case 'Parser.State.new':
                var $1206 = self.err;
                var _reply$7 = Parser$text$("0x", _pst$1);
                var self = _reply$7;
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $1208 = self.err;
                        var self = $1206;
                        switch (self._) {
                            case 'Maybe.some':
                                var $1210 = self.value;
                                var $1211 = Parser$Reply$error$(Parser$Error$combine$($1210, $1208));
                                var $1209 = $1211;
                                break;
                            case 'Maybe.none':
                                var $1212 = Parser$Reply$error$($1208);
                                var $1209 = $1212;
                                break;
                        };
                        var $1207 = $1209;
                        break;
                    case 'Parser.Reply.value':
                        var $1213 = self.pst;
                        var self = $1213;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $1215 = self.err;
                                var $1216 = self.nam;
                                var $1217 = self.ini;
                                var $1218 = self.idx;
                                var $1219 = self.str;
                                var _reply$pst$15 = Parser$State$new$(Parser$Error$maybe_combine$($1206, $1215), $1216, $1217, $1218, $1219);
                                var self = _reply$pst$15;
                                switch (self._) {
                                    case 'Parser.State.new':
                                        var $1221 = self.err;
                                        var _reply$21 = Parser$many1$(Parser$hex_digit, _reply$pst$15);
                                        var self = _reply$21;
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $1223 = self.err;
                                                var self = $1221;
                                                switch (self._) {
                                                    case 'Maybe.some':
                                                        var $1225 = self.value;
                                                        var $1226 = Parser$Reply$error$(Parser$Error$combine$($1225, $1223));
                                                        var $1224 = $1226;
                                                        break;
                                                    case 'Maybe.none':
                                                        var $1227 = Parser$Reply$error$($1223);
                                                        var $1224 = $1227;
                                                        break;
                                                };
                                                var $1222 = $1224;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $1228 = self.pst;
                                                var $1229 = self.val;
                                                var self = $1228;
                                                switch (self._) {
                                                    case 'Parser.State.new':
                                                        var $1231 = self.err;
                                                        var $1232 = self.nam;
                                                        var $1233 = self.ini;
                                                        var $1234 = self.idx;
                                                        var $1235 = self.str;
                                                        var _reply$pst$29 = Parser$State$new$(Parser$Error$maybe_combine$($1221, $1231), $1232, $1233, $1234, $1235);
                                                        var $1236 = Parser$Reply$value$(_reply$pst$29, Nat$from_base$(16n, $1229));
                                                        var $1230 = $1236;
                                                        break;
                                                };
                                                var $1222 = $1230;
                                                break;
                                        };
                                        var $1220 = $1222;
                                        break;
                                };
                                var $1214 = $1220;
                                break;
                        };
                        var $1207 = $1214;
                        break;
                };
                var $1205 = $1207;
                break;
        };
        return $1205;
    };
    const Parser$hex_nat = x0 => Parser$hex_nat$(x0);

    function Parser$digit$(_pst$1) {
        var self = _pst$1;
        switch (self._) {
            case 'Parser.State.new':
                var $1238 = self.err;
                var $1239 = self.nam;
                var $1240 = self.ini;
                var $1241 = self.idx;
                var $1242 = self.str;
                var self = $1242;
                if (self.length === 0) {
                    var $1244 = Parser$Reply$fail$($1239, $1240, $1241, "Not a digit.");
                    var $1243 = $1244;
                } else {
                    var $1245 = self.charCodeAt(0);
                    var $1246 = self.slice(1);
                    var _pst$9 = Parser$State$new$($1238, $1239, $1240, Nat$succ$($1241), $1246);
                    var self = ($1245 === 48);
                    if (self) {
                        var $1248 = Parser$Reply$value$(_pst$9, 0n);
                        var $1247 = $1248;
                    } else {
                        var self = ($1245 === 49);
                        if (self) {
                            var $1250 = Parser$Reply$value$(_pst$9, 1n);
                            var $1249 = $1250;
                        } else {
                            var self = ($1245 === 50);
                            if (self) {
                                var $1252 = Parser$Reply$value$(_pst$9, 2n);
                                var $1251 = $1252;
                            } else {
                                var self = ($1245 === 51);
                                if (self) {
                                    var $1254 = Parser$Reply$value$(_pst$9, 3n);
                                    var $1253 = $1254;
                                } else {
                                    var self = ($1245 === 52);
                                    if (self) {
                                        var $1256 = Parser$Reply$value$(_pst$9, 4n);
                                        var $1255 = $1256;
                                    } else {
                                        var self = ($1245 === 53);
                                        if (self) {
                                            var $1258 = Parser$Reply$value$(_pst$9, 5n);
                                            var $1257 = $1258;
                                        } else {
                                            var self = ($1245 === 54);
                                            if (self) {
                                                var $1260 = Parser$Reply$value$(_pst$9, 6n);
                                                var $1259 = $1260;
                                            } else {
                                                var self = ($1245 === 55);
                                                if (self) {
                                                    var $1262 = Parser$Reply$value$(_pst$9, 7n);
                                                    var $1261 = $1262;
                                                } else {
                                                    var self = ($1245 === 56);
                                                    if (self) {
                                                        var $1264 = Parser$Reply$value$(_pst$9, 8n);
                                                        var $1263 = $1264;
                                                    } else {
                                                        var self = ($1245 === 57);
                                                        if (self) {
                                                            var $1266 = Parser$Reply$value$(_pst$9, 9n);
                                                            var $1265 = $1266;
                                                        } else {
                                                            var $1267 = Parser$Reply$fail$($1239, $1240, $1241, "Not a digit.");
                                                            var $1265 = $1267;
                                                        };
                                                        var $1263 = $1265;
                                                    };
                                                    var $1261 = $1263;
                                                };
                                                var $1259 = $1261;
                                            };
                                            var $1257 = $1259;
                                        };
                                        var $1255 = $1257;
                                    };
                                    var $1253 = $1255;
                                };
                                var $1251 = $1253;
                            };
                            var $1249 = $1251;
                        };
                        var $1247 = $1249;
                    };
                    var $1243 = $1247;
                };
                var $1237 = $1243;
                break;
        };
        return $1237;
    };
    const Parser$digit = x0 => Parser$digit$(x0);

    function Parser$nat$(_pst$1) {
        var self = _pst$1;
        switch (self._) {
            case 'Parser.State.new':
                var $1269 = self.err;
                var _reply$7 = Parser$many1$(Parser$digit, _pst$1);
                var self = _reply$7;
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $1271 = self.err;
                        var self = $1269;
                        switch (self._) {
                            case 'Maybe.some':
                                var $1273 = self.value;
                                var $1274 = Parser$Reply$error$(Parser$Error$combine$($1273, $1271));
                                var $1272 = $1274;
                                break;
                            case 'Maybe.none':
                                var $1275 = Parser$Reply$error$($1271);
                                var $1272 = $1275;
                                break;
                        };
                        var $1270 = $1272;
                        break;
                    case 'Parser.Reply.value':
                        var $1276 = self.pst;
                        var $1277 = self.val;
                        var self = $1276;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $1279 = self.err;
                                var $1280 = self.nam;
                                var $1281 = self.ini;
                                var $1282 = self.idx;
                                var $1283 = self.str;
                                var _reply$pst$15 = Parser$State$new$(Parser$Error$maybe_combine$($1269, $1279), $1280, $1281, $1282, $1283);
                                var $1284 = Parser$Reply$value$(_reply$pst$15, Nat$from_base$(10n, $1277));
                                var $1278 = $1284;
                                break;
                        };
                        var $1270 = $1278;
                        break;
                };
                var $1268 = $1270;
                break;
        };
        return $1268;
    };
    const Parser$nat = x0 => Parser$nat$(x0);

    function Parser$maybe$(_parse$2, _pst$3) {
        var self = _pst$3;
        switch (self._) {
            case 'Parser.State.new':
                var self = _parse$2(_pst$3);
                switch (self._) {
                    case 'Parser.Reply.value':
                        var $1287 = self.pst;
                        var $1288 = self.val;
                        var $1289 = Parser$Reply$value$($1287, Maybe$some$($1288));
                        var $1286 = $1289;
                        break;
                    case 'Parser.Reply.error':
                        var $1290 = Parser$Reply$value$(_pst$3, Maybe$none);
                        var $1286 = $1290;
                        break;
                };
                var $1285 = $1286;
                break;
        };
        return $1285;
    };
    const Parser$maybe = x0 => x1 => Parser$maybe$(x0, x1);

    function Parser$Number$new$(_sign$1, _numb$2, _frac$3) {
        var $1291 = ({
            _: 'Parser.Number.new',
            'sign': _sign$1,
            'numb': _numb$2,
            'frac': _frac$3
        });
        return $1291;
    };
    const Parser$Number$new = x0 => x1 => x2 => Parser$Number$new$(x0, x1, x2);

    function Parser$num$(_pst$1) {
        var self = _pst$1;
        switch (self._) {
            case 'Parser.State.new':
                var $1293 = self.err;
                var _reply$7 = Parser$first_of$(List$cons$((_pst$7 => {
                    var self = _pst$7;
                    switch (self._) {
                        case 'Parser.State.new':
                            var $1296 = self.err;
                            var _reply$13 = Parser$text$("+", _pst$7);
                            var self = _reply$13;
                            switch (self._) {
                                case 'Parser.Reply.error':
                                    var $1298 = self.err;
                                    var self = $1296;
                                    switch (self._) {
                                        case 'Maybe.some':
                                            var $1300 = self.value;
                                            var $1301 = Parser$Reply$error$(Parser$Error$combine$($1300, $1298));
                                            var $1299 = $1301;
                                            break;
                                        case 'Maybe.none':
                                            var $1302 = Parser$Reply$error$($1298);
                                            var $1299 = $1302;
                                            break;
                                    };
                                    var $1297 = $1299;
                                    break;
                                case 'Parser.Reply.value':
                                    var $1303 = self.pst;
                                    var self = $1303;
                                    switch (self._) {
                                        case 'Parser.State.new':
                                            var $1305 = self.err;
                                            var $1306 = self.nam;
                                            var $1307 = self.ini;
                                            var $1308 = self.idx;
                                            var $1309 = self.str;
                                            var _reply$pst$21 = Parser$State$new$(Parser$Error$maybe_combine$($1296, $1305), $1306, $1307, $1308, $1309);
                                            var $1310 = Parser$Reply$value$(_reply$pst$21, Maybe$some$(Bool$true));
                                            var $1304 = $1310;
                                            break;
                                    };
                                    var $1297 = $1304;
                                    break;
                            };
                            var $1295 = $1297;
                            break;
                    };
                    return $1295;
                }), List$cons$((_pst$7 => {
                    var self = _pst$7;
                    switch (self._) {
                        case 'Parser.State.new':
                            var $1312 = self.err;
                            var _reply$13 = Parser$text$("-", _pst$7);
                            var self = _reply$13;
                            switch (self._) {
                                case 'Parser.Reply.error':
                                    var $1314 = self.err;
                                    var self = $1312;
                                    switch (self._) {
                                        case 'Maybe.some':
                                            var $1316 = self.value;
                                            var $1317 = Parser$Reply$error$(Parser$Error$combine$($1316, $1314));
                                            var $1315 = $1317;
                                            break;
                                        case 'Maybe.none':
                                            var $1318 = Parser$Reply$error$($1314);
                                            var $1315 = $1318;
                                            break;
                                    };
                                    var $1313 = $1315;
                                    break;
                                case 'Parser.Reply.value':
                                    var $1319 = self.pst;
                                    var self = $1319;
                                    switch (self._) {
                                        case 'Parser.State.new':
                                            var $1321 = self.err;
                                            var $1322 = self.nam;
                                            var $1323 = self.ini;
                                            var $1324 = self.idx;
                                            var $1325 = self.str;
                                            var _reply$pst$21 = Parser$State$new$(Parser$Error$maybe_combine$($1312, $1321), $1322, $1323, $1324, $1325);
                                            var $1326 = Parser$Reply$value$(_reply$pst$21, Maybe$some$(Bool$false));
                                            var $1320 = $1326;
                                            break;
                                    };
                                    var $1313 = $1320;
                                    break;
                            };
                            var $1311 = $1313;
                            break;
                    };
                    return $1311;
                }), List$cons$((_pst$7 => {
                    var $1327 = Parser$Reply$value$(_pst$7, Maybe$none);
                    return $1327;
                }), List$nil))))(_pst$1);
                var self = _reply$7;
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $1328 = self.err;
                        var self = $1293;
                        switch (self._) {
                            case 'Maybe.some':
                                var $1330 = self.value;
                                var $1331 = Parser$Reply$error$(Parser$Error$combine$($1330, $1328));
                                var $1329 = $1331;
                                break;
                            case 'Maybe.none':
                                var $1332 = Parser$Reply$error$($1328);
                                var $1329 = $1332;
                                break;
                        };
                        var $1294 = $1329;
                        break;
                    case 'Parser.Reply.value':
                        var $1333 = self.pst;
                        var $1334 = self.val;
                        var self = $1333;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $1336 = self.err;
                                var $1337 = self.nam;
                                var $1338 = self.ini;
                                var $1339 = self.idx;
                                var $1340 = self.str;
                                var _reply$pst$15 = Parser$State$new$(Parser$Error$maybe_combine$($1293, $1336), $1337, $1338, $1339, $1340);
                                var self = _reply$pst$15;
                                switch (self._) {
                                    case 'Parser.State.new':
                                        var $1342 = self.err;
                                        var _reply$21 = Parser$first_of$(List$cons$(Parser$hex_nat, List$cons$(Parser$nat, List$nil)))(_reply$pst$15);
                                        var self = _reply$21;
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $1344 = self.err;
                                                var self = $1342;
                                                switch (self._) {
                                                    case 'Maybe.some':
                                                        var $1346 = self.value;
                                                        var $1347 = Parser$Reply$error$(Parser$Error$combine$($1346, $1344));
                                                        var $1345 = $1347;
                                                        break;
                                                    case 'Maybe.none':
                                                        var $1348 = Parser$Reply$error$($1344);
                                                        var $1345 = $1348;
                                                        break;
                                                };
                                                var $1343 = $1345;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $1349 = self.pst;
                                                var $1350 = self.val;
                                                var self = $1349;
                                                switch (self._) {
                                                    case 'Parser.State.new':
                                                        var $1352 = self.err;
                                                        var $1353 = self.nam;
                                                        var $1354 = self.ini;
                                                        var $1355 = self.idx;
                                                        var $1356 = self.str;
                                                        var _reply$pst$29 = Parser$State$new$(Parser$Error$maybe_combine$($1342, $1352), $1353, $1354, $1355, $1356);
                                                        var self = _reply$pst$29;
                                                        switch (self._) {
                                                            case 'Parser.State.new':
                                                                var $1358 = self.err;
                                                                var self = _reply$pst$29;
                                                                switch (self._) {
                                                                    case 'Parser.State.new':
                                                                        var $1360 = self.err;
                                                                        var _reply$40 = Parser$maybe$(Parser$text("."), _reply$pst$29);
                                                                        var self = _reply$40;
                                                                        switch (self._) {
                                                                            case 'Parser.Reply.error':
                                                                                var $1362 = self.err;
                                                                                var self = $1360;
                                                                                switch (self._) {
                                                                                    case 'Maybe.some':
                                                                                        var $1364 = self.value;
                                                                                        var $1365 = Parser$Reply$error$(Parser$Error$combine$($1364, $1362));
                                                                                        var $1363 = $1365;
                                                                                        break;
                                                                                    case 'Maybe.none':
                                                                                        var $1366 = Parser$Reply$error$($1362);
                                                                                        var $1363 = $1366;
                                                                                        break;
                                                                                };
                                                                                var $1361 = $1363;
                                                                                break;
                                                                            case 'Parser.Reply.value':
                                                                                var $1367 = self.pst;
                                                                                var self = $1367;
                                                                                switch (self._) {
                                                                                    case 'Parser.State.new':
                                                                                        var $1369 = self.err;
                                                                                        var $1370 = self.nam;
                                                                                        var $1371 = self.ini;
                                                                                        var $1372 = self.idx;
                                                                                        var $1373 = self.str;
                                                                                        var _reply$pst$48 = Parser$State$new$(Parser$Error$maybe_combine$($1360, $1369), $1370, $1371, $1372, $1373);
                                                                                        var self = _reply$pst$48;
                                                                                        switch (self._) {
                                                                                            case 'Parser.State.new':
                                                                                                var $1375 = self.err;
                                                                                                var _reply$54 = Parser$maybe$(Parser$nat, _reply$pst$48);
                                                                                                var self = _reply$54;
                                                                                                switch (self._) {
                                                                                                    case 'Parser.Reply.error':
                                                                                                        var $1377 = self.err;
                                                                                                        var self = $1375;
                                                                                                        switch (self._) {
                                                                                                            case 'Maybe.some':
                                                                                                                var $1379 = self.value;
                                                                                                                var $1380 = Parser$Reply$error$(Parser$Error$combine$($1379, $1377));
                                                                                                                var $1378 = $1380;
                                                                                                                break;
                                                                                                            case 'Maybe.none':
                                                                                                                var $1381 = Parser$Reply$error$($1377);
                                                                                                                var $1378 = $1381;
                                                                                                                break;
                                                                                                        };
                                                                                                        var $1376 = $1378;
                                                                                                        break;
                                                                                                    case 'Parser.Reply.value':
                                                                                                        var $1382 = self.pst;
                                                                                                        var $1383 = self.val;
                                                                                                        var self = $1382;
                                                                                                        switch (self._) {
                                                                                                            case 'Parser.State.new':
                                                                                                                var $1385 = self.err;
                                                                                                                var $1386 = self.nam;
                                                                                                                var $1387 = self.ini;
                                                                                                                var $1388 = self.idx;
                                                                                                                var $1389 = self.str;
                                                                                                                var _reply$pst$62 = Parser$State$new$(Parser$Error$maybe_combine$($1375, $1385), $1386, $1387, $1388, $1389);
                                                                                                                var $1390 = Parser$Reply$value$(_reply$pst$62, $1383);
                                                                                                                var $1384 = $1390;
                                                                                                                break;
                                                                                                        };
                                                                                                        var $1376 = $1384;
                                                                                                        break;
                                                                                                };
                                                                                                var $1374 = $1376;
                                                                                                break;
                                                                                        };
                                                                                        var $1368 = $1374;
                                                                                        break;
                                                                                };
                                                                                var $1361 = $1368;
                                                                                break;
                                                                        };
                                                                        var _reply$35 = $1361;
                                                                        break;
                                                                };
                                                                var self = _reply$35;
                                                                switch (self._) {
                                                                    case 'Parser.Reply.error':
                                                                        var $1391 = self.err;
                                                                        var self = $1358;
                                                                        switch (self._) {
                                                                            case 'Maybe.some':
                                                                                var $1393 = self.value;
                                                                                var $1394 = Parser$Reply$error$(Parser$Error$combine$($1393, $1391));
                                                                                var $1392 = $1394;
                                                                                break;
                                                                            case 'Maybe.none':
                                                                                var $1395 = Parser$Reply$error$($1391);
                                                                                var $1392 = $1395;
                                                                                break;
                                                                        };
                                                                        var $1359 = $1392;
                                                                        break;
                                                                    case 'Parser.Reply.value':
                                                                        var $1396 = self.pst;
                                                                        var $1397 = self.val;
                                                                        var self = $1396;
                                                                        switch (self._) {
                                                                            case 'Parser.State.new':
                                                                                var $1399 = self.err;
                                                                                var $1400 = self.nam;
                                                                                var $1401 = self.ini;
                                                                                var $1402 = self.idx;
                                                                                var $1403 = self.str;
                                                                                var _reply$pst$43 = Parser$State$new$(Parser$Error$maybe_combine$($1358, $1399), $1400, $1401, $1402, $1403);
                                                                                var $1404 = Parser$Reply$value$(_reply$pst$43, Parser$Number$new$($1334, $1350, $1397));
                                                                                var $1398 = $1404;
                                                                                break;
                                                                        };
                                                                        var $1359 = $1398;
                                                                        break;
                                                                };
                                                                var $1357 = $1359;
                                                                break;
                                                        };
                                                        var $1351 = $1357;
                                                        break;
                                                };
                                                var $1343 = $1351;
                                                break;
                                        };
                                        var $1341 = $1343;
                                        break;
                                };
                                var $1335 = $1341;
                                break;
                        };
                        var $1294 = $1335;
                        break;
                };
                var $1292 = $1294;
                break;
        };
        return $1292;
    };
    const Parser$num = x0 => Parser$num$(x0);
    const Nat$to_i32 = a0 => (Number(a0));
    const I32$read = a0 => (parseInt(a0));
    const U32$sub = a0 => a1 => ((a0 - a1) >>> 0);
    const String$eql = a0 => a1 => (a0 === a1);

    function App$Kaelin$Coord$draft$arena_go$(_team$1, _coord$2) {
        var self = _coord$2;
        switch (self._) {
            case 'App.Kaelin.Coord.new':
                var $1406 = self.i;
                var $1407 = self.j;
                var _map_size$5 = U32$to_i32$(((App$Kaelin$Constants$map_size - 1) >>> 0));
                var self = (_team$1 === "blue");
                if (self) {
                    var $1409 = App$Kaelin$Coord$new$((($1406 - _map_size$5) >> 0), $1407);
                    var $1408 = $1409;
                } else {
                    var self = (_team$1 === "red");
                    if (self) {
                        var $1411 = App$Kaelin$Coord$new$((($1406 + _map_size$5) >> 0), $1407);
                        var $1410 = $1411;
                    } else {
                        var $1412 = _coord$2;
                        var $1410 = $1412;
                    };
                    var $1408 = $1410;
                };
                var $1405 = $1408;
                break;
        };
        return $1405;
    };
    const App$Kaelin$Coord$draft$arena_go = x0 => x1 => App$Kaelin$Coord$draft$arena_go$(x0, x1);
    const App$Kaelin$Coord$draft$arena = (() => {
        var _a$1 = App$Kaelin$Coord$new$(1, (-2));
        var _b$2 = App$Kaelin$Coord$new$(0, (-1));
        var _c$3 = App$Kaelin$Coord$new$(1, (-1));
        var _d$4 = App$Kaelin$Coord$new$(0, 0);
        var _e$5 = App$Kaelin$Coord$new$((-1), 1);
        var _f$6 = App$Kaelin$Coord$new$(0, 1);
        var _g$7 = App$Kaelin$Coord$new$((-1), 2);
        var _one$8 = App$Kaelin$Coord$new$((-1), 0);
        var _two$9 = App$Kaelin$Coord$new$(1, 0);
        var _blue$10 = List$map$(App$Kaelin$Coord$draft$arena_go("blue"), List$cons$(_a$1, List$cons$(_b$2, List$cons$(_c$3, List$cons$(_d$4, List$cons$(_e$5, List$cons$(_f$6, List$cons$(_g$7, List$cons$(_one$8, List$nil)))))))));
        var _red$11 = List$map$(App$Kaelin$Coord$draft$arena_go("red"), List$cons$(_a$1, List$cons$(_b$2, List$cons$(_c$3, List$cons$(_d$4, List$cons$(_e$5, List$cons$(_f$6, List$cons$(_g$7, List$cons$(_two$9, List$nil)))))))));
        var _blue_map$12 = NatMap$new;
        var _red_map$13 = NatMap$new;
        var _blue_map$14 = (() => {
            var $1415 = _blue_map$12;
            var $1416 = _blue$10;
            let _blue_map$15 = $1415;
            let _coord$14;
            while ($1416._ === 'List.cons') {
                _coord$14 = $1416.head;
                var _key$16 = App$Kaelin$Coord$Convert$axial_to_nat$(_coord$14);
                var $1415 = NatMap$set$(_key$16, "empty", _blue_map$15);
                _blue_map$15 = $1415;
                $1416 = $1416.tail;
            }
            return _blue_map$15;
        })();
        var _red_map$15 = (() => {
            var $1418 = _red_map$13;
            var $1419 = _red$11;
            let _red_map$16 = $1418;
            let _coord$15;
            while ($1419._ === 'List.cons') {
                _coord$15 = $1419.head;
                var _key$17 = App$Kaelin$Coord$Convert$axial_to_nat$(_coord$15);
                var $1418 = NatMap$set$(_key$17, "empty", _red_map$16);
                _red_map$16 = $1418;
                $1419 = $1419.tail;
            }
            return _red_map$16;
        })();
        var $1413 = Pair$new$(_blue_map$14, _red_map$15);
        return $1413;
    })();

    function App$Kaelin$Stage$draft$(_players$1, _coords$2) {
        var $1420 = ({
            _: 'App.Kaelin.Stage.draft',
            'players': _players$1,
            'coords': _coords$2
        });
        return $1420;
    };
    const App$Kaelin$Stage$draft = x0 => x1 => App$Kaelin$Stage$draft$(x0, x1);
    const App$Kaelin$Stage$init = ({
        _: 'App.Kaelin.Stage.init'
    });

    function App$Store$new$(_local$2, _global$3) {
        var $1421 = ({
            _: 'App.Store.new',
            'local': _local$2,
            'global': _global$3
        });
        return $1421;
    };
    const App$Store$new = x0 => x1 => App$Store$new$(x0, x1);
    const App$State$new = Pair$new$(null, null);
    const App$Kaelin$State = App$State$new;

    function App$Kaelin$State$local$new$(_input$1, _user$2, _team$3, _local_map$4, _control_map$5, _cast_info$6, _env_info$7, _internal$8) {
        var $1422 = ({
            _: 'App.Kaelin.State.local.new',
            'input': _input$1,
            'user': _user$2,
            'team': _team$3,
            'local_map': _local_map$4,
            'control_map': _control_map$5,
            'cast_info': _cast_info$6,
            'env_info': _env_info$7,
            'internal': _internal$8
        });
        return $1422;
    };
    const App$Kaelin$State$local$new = x0 => x1 => x2 => x3 => x4 => x5 => x6 => x7 => App$Kaelin$State$local$new$(x0, x1, x2, x3, x4, x5, x6, x7);

    function App$Kaelin$State$global$new$(_round$1, _tick$2, _room$3, _map$4, _stage$5, _skills_list$6) {
        var $1423 = ({
            _: 'App.Kaelin.State.global.new',
            'round': _round$1,
            'tick': _tick$2,
            'room': _room$3,
            'map': _map$4,
            'stage': _stage$5,
            'skills_list': _skills_list$6
        });
        return $1423;
    };
    const App$Kaelin$State$global$new = x0 => x1 => x2 => x3 => x4 => x5 => App$Kaelin$State$global$new$(x0, x1, x2, x3, x4, x5);

    function U64$new$(_value$1) {
        var $1424 = word_to_u64(_value$1);
        return $1424;
    };
    const U64$new = x0 => U64$new$(x0);
    const U64$from_nat = a0 => (a0 & 0xFFFFFFFFFFFFFFFFn);
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
        var $1425 = App$Store$new$(App$Kaelin$State$local$new$(_input$1, _user$2, _team$14, _map$7, 0, _cast_info$6, _interface$8, _internal$9), App$Kaelin$State$global$new$(1, 1n, _room$3, _map$7, _stage_init$13, List$nil));
        return $1425;
    })();

    function DOM$node$(_tag$1, _props$2, _style$3, _children$4) {
        var $1426 = ({
            _: 'DOM.node',
            'tag': _tag$1,
            'props': _props$2,
            'style': _style$3,
            'children': _children$4
        });
        return $1426;
    };
    const DOM$node = x0 => x1 => x2 => x3 => DOM$node$(x0, x1, x2, x3);

    function Map$(_V$1) {
        var $1427 = null;
        return $1427;
    };
    const Map = x0 => Map$(x0);
    const Bits$concat = a0 => a1 => (a1 + a0);

    function Word$to_bits$(_a$2) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $1429 = self.pred;
                var $1430 = (Word$to_bits$($1429) + '0');
                var $1428 = $1430;
                break;
            case 'Word.i':
                var $1431 = self.pred;
                var $1432 = (Word$to_bits$($1431) + '1');
                var $1428 = $1432;
                break;
            case 'Word.e':
                var $1433 = Bits$e;
                var $1428 = $1433;
                break;
        };
        return $1428;
    };
    const Word$to_bits = x0 => Word$to_bits$(x0);
    const U16$to_bits = a0 => (u16_to_bits(a0));

    function String$to_bits$(_str$1) {
        var self = _str$1;
        if (self.length === 0) {
            var $1435 = Bits$e;
            var $1434 = $1435;
        } else {
            var $1436 = self.charCodeAt(0);
            var $1437 = self.slice(1);
            var $1438 = (String$to_bits$($1437) + (u16_to_bits($1436)));
            var $1434 = $1438;
        };
        return $1434;
    };
    const String$to_bits = x0 => String$to_bits$(x0);

    function Map$from_list$(_xs$2) {
        var self = _xs$2;
        switch (self._) {
            case 'List.cons':
                var $1440 = self.head;
                var $1441 = self.tail;
                var self = $1440;
                switch (self._) {
                    case 'Pair.new':
                        var $1443 = self.fst;
                        var $1444 = self.snd;
                        var $1445 = (bitsmap_set(String$to_bits$($1443), $1444, Map$from_list$($1441), 'set'));
                        var $1442 = $1445;
                        break;
                };
                var $1439 = $1442;
                break;
            case 'List.nil':
                var $1446 = BitsMap$new;
                var $1439 = $1446;
                break;
        };
        return $1439;
    };
    const Map$from_list = x0 => Map$from_list$(x0);

    function DOM$text$(_value$1) {
        var $1447 = ({
            _: 'DOM.text',
            'value': _value$1
        });
        return $1447;
    };
    const DOM$text = x0 => DOM$text$(x0);

    function App$Kaelin$Draw$init$(_room$1) {
        var $1448 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("width", "100vw"), List$cons$(Pair$new$("height", "100vh"), List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("flex-direction", "column"), List$cons$(Pair$new$("justify-content", "center"), List$cons$(Pair$new$("align-items", "center"), List$cons$(Pair$new$("font-size", "2rem"), List$nil)))))))), List$cons$(DOM$node$("h1", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("margin-bottom", "10px"), List$nil)), List$cons$(DOM$text$("Welcome to Kaelin"), List$nil)), List$cons$(DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$nil), List$cons$(DOM$text$("Enter a room number: "), List$cons$(DOM$node$("input", Map$from_list$(List$cons$(Pair$new$("id", "text"), List$cons$(Pair$new$("value", _room$1), List$nil))), Map$from_list$(List$cons$(Pair$new$("font-size", "2rem"), List$cons$(Pair$new$("font-family", "monospace"), List$cons$(Pair$new$("outline", "transparent"), List$nil)))), List$nil), List$cons$(DOM$node$("button", Map$from_list$(List$cons$(Pair$new$("id", "ready"), List$nil)), Map$from_list$(List$cons$(Pair$new$("font-size", "2rem"), List$cons$(Pair$new$("font-family", "monospace"), List$cons$(Pair$new$("margin-left", "10px"), List$cons$(Pair$new$("padding", "2px"), List$nil))))), List$cons$(DOM$text$("Enter"), List$nil)), List$cons$(DOM$node$("button", Map$from_list$(List$cons$(Pair$new$("id", "random"), List$nil)), Map$from_list$(List$cons$(Pair$new$("font-size", "2rem"), List$cons$(Pair$new$("font-family", "monospace"), List$cons$(Pair$new$("margin-left", "10px"), List$cons$(Pair$new$("padding", "2px"), List$nil))))), List$cons$(DOM$text$("Random"), List$nil)), List$nil))))), List$nil)));
        return $1448;
    };
    const App$Kaelin$Draw$init = x0 => App$Kaelin$Draw$init$(x0);

    function Pair$snd$(_pair$3) {
        var self = _pair$3;
        switch (self._) {
            case 'Pair.new':
                var $1450 = self.snd;
                var $1451 = $1450;
                var $1449 = $1451;
                break;
        };
        return $1449;
    };
    const Pair$snd = x0 => Pair$snd$(x0);

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
                        var $1452 = self.slice(0, -1);
                        var $1453 = Bits$reverse$tco$($1452, (_r$2 + '0'));
                        return $1453;
                    case 'i':
                        var $1454 = self.slice(0, -1);
                        var $1455 = Bits$reverse$tco$($1454, (_r$2 + '1'));
                        return $1455;
                    case 'e':
                        var $1456 = _r$2;
                        return $1456;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Bits$reverse$tco = x0 => x1 => Bits$reverse$tco$(x0, x1);

    function Bits$reverse$(_a$1) {
        var $1457 = Bits$reverse$tco$(_a$1, Bits$e);
        return $1457;
    };
    const Bits$reverse = x0 => Bits$reverse$(x0);

    function BitsMap$to_list$go$(_xs$2, _key$3, _list$4) {
        var self = _xs$2;
        switch (self._) {
            case 'BitsMap.tie':
                var $1459 = self.val;
                var $1460 = self.lft;
                var $1461 = self.rgt;
                var self = $1459;
                switch (self._) {
                    case 'Maybe.some':
                        var $1463 = self.value;
                        var $1464 = List$cons$(Pair$new$(Bits$reverse$(_key$3), $1463), _list$4);
                        var _list0$8 = $1464;
                        break;
                    case 'Maybe.none':
                        var $1465 = _list$4;
                        var _list0$8 = $1465;
                        break;
                };
                var _list1$9 = BitsMap$to_list$go$($1460, (_key$3 + '0'), _list0$8);
                var _list2$10 = BitsMap$to_list$go$($1461, (_key$3 + '1'), _list1$9);
                var $1462 = _list2$10;
                var $1458 = $1462;
                break;
            case 'BitsMap.new':
                var $1466 = _list$4;
                var $1458 = $1466;
                break;
        };
        return $1458;
    };
    const BitsMap$to_list$go = x0 => x1 => x2 => BitsMap$to_list$go$(x0, x1, x2);

    function List$mapped$(_as$2, _f$4) {
        var self = _as$2;
        switch (self._) {
            case 'List.cons':
                var $1468 = self.head;
                var $1469 = self.tail;
                var $1470 = List$cons$(_f$4($1468), List$mapped$($1469, _f$4));
                var $1467 = $1470;
                break;
            case 'List.nil':
                var $1471 = List$nil;
                var $1467 = $1471;
                break;
        };
        return $1467;
    };
    const List$mapped = x0 => x1 => List$mapped$(x0, x1);

    function Bits$show$(_a$1) {
        var self = _a$1;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'o':
                var $1473 = self.slice(0, -1);
                var $1474 = String$cons$(48, Bits$show$($1473));
                var $1472 = $1474;
                break;
            case 'i':
                var $1475 = self.slice(0, -1);
                var $1476 = String$cons$(49, Bits$show$($1475));
                var $1472 = $1476;
                break;
            case 'e':
                var $1477 = "";
                var $1472 = $1477;
                break;
        };
        return $1472;
    };
    const Bits$show = x0 => Bits$show$(x0);

    function Map$to_list$(_xs$2) {
        var _kvs$3 = List$reverse$(BitsMap$to_list$go$(_xs$2, Bits$e, List$nil));
        var $1478 = List$mapped$(_kvs$3, (_kv$4 => {
            var self = _kv$4;
            switch (self._) {
                case 'Pair.new':
                    var $1480 = self.fst;
                    var $1481 = self.snd;
                    var $1482 = Pair$new$(Bits$show$($1480), $1481);
                    var $1479 = $1482;
                    break;
            };
            return $1479;
        }));
        return $1478;
    };
    const Map$to_list = x0 => Map$to_list$(x0);

    function Map$set$(_key$2, _val$3, _map$4) {
        var $1483 = (bitsmap_set(String$to_bits$(_key$2), _val$3, _map$4, 'set'));
        return $1483;
    };
    const Map$set = x0 => x1 => x2 => Map$set$(x0, x1, x2);
    const App$Kaelin$Resources$heroes = (() => {
        var _heroes$1 = List$cons$(App$Kaelin$Heroes$Croni$hero, List$cons$(App$Kaelin$Heroes$Cyclope$hero, List$cons$(App$Kaelin$Heroes$Lela$hero, List$cons$(App$Kaelin$Heroes$Octoking$hero, List$nil))));
        var $1484 = List$fold$(_heroes$1, Map$from_list$(List$nil), (_hero$2 => _map$3 => {
            var self = _hero$2;
            switch (self._) {
                case 'App.Kaelin.Hero.new':
                    var $1486 = self.name;
                    var $1487 = Map$set$($1486, _hero$2, _map$3);
                    var $1485 = $1487;
                    break;
            };
            return $1485;
        }));
        return $1484;
    })();

    function Map$get$(_key$2, _map$3) {
        var $1488 = (bitsmap_get(String$to_bits$(_key$2), _map$3));
        return $1488;
    };
    const Map$get = x0 => x1 => Map$get$(x0, x1);

    function App$Kaelin$Coord$draft$to_team$(_user$1, _players$2) {
        var _player$3 = Map$get$(_user$1, _players$2);
        var self = _player$3;
        switch (self._) {
            case 'Maybe.some':
                var $1490 = self.value;
                var $1491 = Maybe$some$((() => {
                    var self = $1490;
                    switch (self._) {
                        case 'App.Kaelin.DraftInfo.new':
                            var $1492 = self.team;
                            var $1493 = $1492;
                            return $1493;
                    };
                })());
                var $1489 = $1491;
                break;
            case 'Maybe.none':
                var $1494 = Maybe$none;
                var $1489 = $1494;
                break;
        };
        return $1489;
    };
    const App$Kaelin$Coord$draft$to_team = x0 => x1 => App$Kaelin$Coord$draft$to_team$(x0, x1);

    function App$Kaelin$Team$show$(_team$1) {
        var self = _team$1;
        switch (self._) {
            case 'App.Kaelin.Team.red':
                var $1496 = "red";
                var $1495 = $1496;
                break;
            case 'App.Kaelin.Team.blue':
                var $1497 = "blue";
                var $1495 = $1497;
                break;
            case 'App.Kaelin.Team.neutral':
                var $1498 = "neutral";
                var $1495 = $1498;
                break;
        };
        return $1495;
    };
    const App$Kaelin$Team$show = x0 => App$Kaelin$Team$show$(x0);

    function App$Kaelin$Coord$draft$to_map$(_team$1, _coords$2) {
        var self = (App$Kaelin$Team$show$(_team$1) === "blue");
        if (self) {
            var self = _coords$2;
            switch (self._) {
                case 'Pair.new':
                    var $1501 = self.fst;
                    var $1502 = $1501;
                    var $1500 = $1502;
                    break;
            };
            var $1499 = $1500;
        } else {
            var self = (App$Kaelin$Team$show$(_team$1) === "red");
            if (self) {
                var self = _coords$2;
                switch (self._) {
                    case 'Pair.new':
                        var $1505 = self.snd;
                        var $1506 = $1505;
                        var $1504 = $1506;
                        break;
                };
                var $1503 = $1504;
            } else {
                var $1507 = NatMap$new;
                var $1503 = $1507;
            };
            var $1499 = $1503;
        };
        return $1499;
    };
    const App$Kaelin$Coord$draft$to_map = x0 => x1 => App$Kaelin$Coord$draft$to_map$(x0, x1);

    function Bits$to_nat$(_b$1) {
        var self = _b$1;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'o':
                var $1509 = self.slice(0, -1);
                var $1510 = (2n * Bits$to_nat$($1509));
                var $1508 = $1510;
                break;
            case 'i':
                var $1511 = self.slice(0, -1);
                var $1512 = Nat$succ$((2n * Bits$to_nat$($1511)));
                var $1508 = $1512;
                break;
            case 'e':
                var $1513 = 0n;
                var $1508 = $1513;
                break;
        };
        return $1508;
    };
    const Bits$to_nat = x0 => Bits$to_nat$(x0);

    function NatMap$to_list$(_xs$2) {
        var _kvs$3 = List$reverse$(BitsMap$to_list$go$(_xs$2, Bits$e, List$nil));
        var $1514 = List$mapped$(_kvs$3, (_kv$4 => {
            var self = _kv$4;
            switch (self._) {
                case 'Pair.new':
                    var $1516 = self.fst;
                    var $1517 = self.snd;
                    var $1518 = Pair$new$(Bits$to_nat$($1516), $1517);
                    var $1515 = $1518;
                    break;
            };
            return $1515;
        }));
        return $1514;
    };
    const NatMap$to_list = x0 => NatMap$to_list$(x0);

    function Word$mod$(_a$2, _b$3) {
        var _q$4 = Word$div$(_a$2, _b$3);
        var $1519 = Word$sub$(_a$2, Word$mul$(_b$3, _q$4));
        return $1519;
    };
    const Word$mod = x0 => x1 => Word$mod$(x0, x1);
    const U32$mod = a0 => a1 => (a0 % a1);

    function App$Kaelin$Coord$Convert$nat_to_axial$(_key$1) {
        var _key_converted$2 = (Number(_key$1) >>> 0);
        var _coord_i$3 = ((_key_converted$2 / 1000) >>> 0);
        var _coord_i$4 = U32$to_i32$(_coord_i$3);
        var _coord_i$5 = ((_coord_i$4 - 100) >> 0);
        var _coord_j$6 = (_key_converted$2 % 1000);
        var _coord_j$7 = U32$to_i32$(_coord_j$6);
        var _coord_j$8 = ((_coord_j$7 - 100) >> 0);
        var $1520 = App$Kaelin$Coord$new$(_coord_i$5, _coord_j$8);
        return $1520;
    };
    const App$Kaelin$Coord$Convert$nat_to_axial = x0 => App$Kaelin$Coord$Convert$nat_to_axial$(x0);
    const App$Kaelin$Constants$draft_hexagon_radius = 8;
    const F64$div = a0 => a1 => (a0 / a1);
    const F64$parse = a0 => (parseFloat(a0));
    const F64$read = a0 => (parseFloat(a0));
    const F64$add = a0 => a1 => (a0 + a1);
    const F64$mul = a0 => a1 => (a0 * a1);
    const F64$make = a0 => a1 => a2 => (f64_make(a0, a1, a2));
    const F64$from_nat = a0 => (Number(a0));

    function App$Kaelin$Coord$draft$to_xy$(_coord$1, _team$2) {
        var self = (App$Kaelin$Team$show$(_team$2) === "blue");
        if (self) {
            var $1522 = U32$to_i32$(((App$Kaelin$Constants$map_size - 1) >>> 0));
            var _centralizer$3 = $1522;
        } else {
            var self = (App$Kaelin$Team$show$(_team$2) === "red");
            if (self) {
                var $1524 = ((-U32$to_i32$(((App$Kaelin$Constants$map_size - 1) >>> 0))));
                var $1523 = $1524;
            } else {
                var $1525 = 0;
                var $1523 = $1525;
            };
            var _centralizer$3 = $1523;
        };
        var self = _coord$1;
        switch (self._) {
            case 'App.Kaelin.Coord.new':
                var $1526 = self.i;
                var $1527 = self.j;
                var _i$6 = (($1526 + _centralizer$3) >> 0);
                var _j$7 = $1527;
                var _i$8 = (_i$6);
                var _j$9 = (_j$7);
                var _int_rad$10 = (App$Kaelin$Constants$draft_hexagon_radius);
                var _hlf$11 = (_int_rad$10 / (+2.0));
                var _int_screen_center_x$12 = (50.0);
                var _int_screen_center_y$13 = (50.0);
                var _cx$14 = (_int_screen_center_x$12 + (_j$9 * _int_rad$10));
                var _cx$15 = (_cx$14 + (_i$8 * (_int_rad$10 * (Number(2n)))));
                var _cy$16 = (_int_screen_center_y$13 + (_j$9 * (_hlf$11 * (Number(3n)))));
                var _cx$17 = ((_cx$15 >>> 0));
                var _y$18 = (_cy$16 + (0.5));
                var _cy$19 = ((_cy$16 >>> 0));
                var $1528 = Pair$new$(_cx$17, _cy$19);
                var $1521 = $1528;
                break;
        };
        return $1521;
    };
    const App$Kaelin$Coord$draft$to_xy = x0 => x1 => App$Kaelin$Coord$draft$to_xy$(x0, x1);

    function Either$(_A$1, _B$2) {
        var $1529 = null;
        return $1529;
    };
    const Either = x0 => x1 => Either$(x0, x1);

    function Either$left$(_value$3) {
        var $1530 = ({
            _: 'Either.left',
            'value': _value$3
        });
        return $1530;
    };
    const Either$left = x0 => Either$left$(x0);

    function Either$right$(_value$3) {
        var $1531 = ({
            _: 'Either.right',
            'value': _value$3
        });
        return $1531;
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
                    var $1532 = Either$left$(_n$1);
                    return $1532;
                } else {
                    var $1533 = (self - 1n);
                    var self = _n$1;
                    if (self === 0n) {
                        var $1535 = Either$right$(Nat$succ$($1533));
                        var $1534 = $1535;
                    } else {
                        var $1536 = (self - 1n);
                        var $1537 = Nat$sub_rem$($1536, $1533);
                        var $1534 = $1537;
                    };
                    return $1534;
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
                        var $1538 = self.value;
                        var $1539 = Nat$div_mod$go$($1538, _m$2, Nat$succ$(_d$3));
                        return $1539;
                    case 'Either.right':
                        var $1540 = Pair$new$(_d$3, _n$1);
                        return $1540;
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
                        var $1541 = self.fst;
                        var $1542 = self.snd;
                        var self = $1541;
                        if (self === 0n) {
                            var $1544 = List$cons$($1542, _res$3);
                            var $1543 = $1544;
                        } else {
                            var $1545 = (self - 1n);
                            var $1546 = Nat$to_base$go$(_base$1, $1541, List$cons$($1542, _res$3));
                            var $1543 = $1546;
                        };
                        return $1543;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Nat$to_base$go = x0 => x1 => x2 => Nat$to_base$go$(x0, x1, x2);

    function Nat$to_base$(_base$1, _nat$2) {
        var $1547 = Nat$to_base$go$(_base$1, _nat$2, List$nil);
        return $1547;
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
                    var $1548 = Nat$mod$go$(_n$1, _r$3, _m$2);
                    return $1548;
                } else {
                    var $1549 = (self - 1n);
                    var self = _n$1;
                    if (self === 0n) {
                        var $1551 = _r$3;
                        var $1550 = $1551;
                    } else {
                        var $1552 = (self - 1n);
                        var $1553 = Nat$mod$go$($1552, $1549, Nat$succ$(_r$3));
                        var $1550 = $1553;
                    };
                    return $1550;
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
                        var $1554 = self.head;
                        var $1555 = self.tail;
                        var self = _index$2;
                        if (self === 0n) {
                            var $1557 = Maybe$some$($1554);
                            var $1556 = $1557;
                        } else {
                            var $1558 = (self - 1n);
                            var $1559 = List$at$($1558, $1555);
                            var $1556 = $1559;
                        };
                        return $1556;
                    case 'List.nil':
                        var $1560 = Maybe$none;
                        return $1560;
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
                    var $1563 = self.value;
                    var $1564 = $1563;
                    var $1562 = $1564;
                    break;
                case 'Maybe.none':
                    var $1565 = 35;
                    var $1562 = $1565;
                    break;
            };
            var $1561 = $1562;
        } else {
            var $1566 = 35;
            var $1561 = $1566;
        };
        return $1561;
    };
    const Nat$show_digit = x0 => x1 => Nat$show_digit$(x0, x1);

    function Nat$to_string_base$(_base$1, _nat$2) {
        var $1567 = List$fold$(Nat$to_base$(_base$1, _nat$2), String$nil, (_n$3 => _str$4 => {
            var $1568 = String$cons$(Nat$show_digit$(_base$1, _n$3), _str$4);
            return $1568;
        }));
        return $1567;
    };
    const Nat$to_string_base = x0 => x1 => Nat$to_string_base$(x0, x1);

    function Nat$show$(_n$1) {
        var $1569 = Nat$to_string_base$(10n, _n$1);
        return $1569;
    };
    const Nat$show = x0 => Nat$show$(x0);

    function App$Kaelin$Draw$draft$positions_go$(_players$1, _coord$2, _nat$3, _id$4, _user$5) {
        var _team$6 = Maybe$default$(App$Kaelin$Coord$draft$to_team$(_user$5, _players$1), App$Kaelin$Team$neutral);
        var self = App$Kaelin$Coord$draft$to_xy$(_coord$2, _team$6);
        switch (self._) {
            case 'Pair.new':
                var $1571 = self.fst;
                var $1572 = self.snd;
                var _top$9 = (Nat$show$((BigInt($1572))) + "%");
                var _left$10 = (Nat$show$((BigInt($1571))) + "%");
                var _size$11 = (Nat$show$((BigInt(((((App$Kaelin$Constants$draft_hexagon_radius * 2) >>> 0) - 1) >>> 0)))) + "%");
                var _margin$12 = Nat$show$((BigInt(App$Kaelin$Constants$draft_hexagon_radius)));
                var self = (_user$5 === _id$4);
                if (self) {
                    var $1574 = "#0FB735";
                    var _color$13 = $1574;
                } else {
                    var _x$13 = Map$get$(_id$4, _players$1);
                    var self = _x$13;
                    switch (self._) {
                        case 'Maybe.none':
                            var $1576 = "#B97A57";
                            var $1575 = $1576;
                            break;
                        case 'Maybe.some':
                            var $1577 = "#4B97E2";
                            var $1575 = $1577;
                            break;
                    };
                    var _color$13 = $1575;
                };
                var $1573 = DOM$node$("div", Map$from_list$(List$cons$(Pair$new$("id", ("C" + Nat$show$(_nat$3))), List$nil)), Map$from_list$(List$cons$(Pair$new$("width", _size$11), List$cons$(Pair$new$("height", _size$11), List$cons$(Pair$new$("margin", ("-" + (_margin$12 + ("% 0px 0px -" + (_margin$12 + "%"))))), List$cons$(Pair$new$("position", "absolute"), List$cons$(Pair$new$("top", _top$9), List$cons$(Pair$new$("left", _left$10), List$cons$(Pair$new$("clip-path", "polygon(0% 25%, 0% 75%, 50% 100%, 100% 75%, 100% 25%, 50% 0%)"), List$cons$(Pair$new$("background", _color$13), List$nil))))))))), List$nil);
                var $1570 = $1573;
                break;
        };
        return $1570;
    };
    const App$Kaelin$Draw$draft$positions_go = x0 => x1 => x2 => x3 => x4 => App$Kaelin$Draw$draft$positions_go$(x0, x1, x2, x3, x4);

    function App$Kaelin$Draw$draft$positions$(_players$1, _coords$2, _user$3) {
        var self = _coords$2;
        switch (self._) {
            case 'Pair.new':
                var _team$6 = Maybe$default$(App$Kaelin$Coord$draft$to_team$(_user$3, _players$1), App$Kaelin$Team$neutral);
                var _map$7 = App$Kaelin$Coord$draft$to_map$(_team$6, _coords$2);
                var _map$8 = NatMap$to_list$(_map$7);
                var _list$9 = List$nil;
                var _list$10 = (() => {
                    var $1581 = _list$9;
                    var $1582 = _map$8;
                    let _list$11 = $1581;
                    let _pair$10;
                    while ($1582._ === 'List.cons') {
                        _pair$10 = $1582.head;
                        var self = _pair$10;
                        switch (self._) {
                            case 'Pair.new':
                                var $1583 = self.fst;
                                var $1584 = self.snd;
                                var _coord$14 = App$Kaelin$Coord$Convert$nat_to_axial$($1583);
                                var $1585 = List$cons$(App$Kaelin$Draw$draft$positions_go$(_players$1, _coord$14, $1583, $1584, _user$3), _list$11);
                                var $1581 = $1585;
                                break;
                        };
                        _list$11 = $1581;
                        $1582 = $1582.tail;
                    }
                    return _list$11;
                })();
                var $1579 = _list$10;
                var $1578 = $1579;
                break;
        };
        return $1578;
    };
    const App$Kaelin$Draw$draft$positions = x0 => x1 => x2 => App$Kaelin$Draw$draft$positions$(x0, x1, x2);

    function App$Kaelin$Draw$draft$map_space$(_players$1, _coords$2, _user$3) {
        var $1586 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("width", "100%"), List$cons$(Pair$new$("height", "0"), List$cons$(Pair$new$("border", "5px solid #d6dadc"), List$cons$(Pair$new$("border-radius", "15px"), List$cons$(Pair$new$("background-color", "#d6dadc"), List$cons$(Pair$new$("position", "relative"), List$cons$(Pair$new$("padding-top", "100%"), List$nil)))))))), App$Kaelin$Draw$draft$positions$(_players$1, _coords$2, _user$3));
        return $1586;
    };
    const App$Kaelin$Draw$draft$map_space = x0 => x1 => x2 => App$Kaelin$Draw$draft$map_space$(x0, x1, x2);

    function App$Kaelin$Draw$draft$map$(_players$1, _coords$2, _user$3) {
        var $1587 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("width", "30%"), List$cons$(Pair$new$("height", "100%"), List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("align-items", "center"), List$cons$(Pair$new$("padding", "10% 0px 10% 2%"), List$nil)))))), List$cons$(App$Kaelin$Draw$draft$map_space$(_players$1, _coords$2, _user$3), List$nil));
        return $1587;
    };
    const App$Kaelin$Draw$draft$map = x0 => x1 => x2 => App$Kaelin$Draw$draft$map$(x0, x1, x2);

    function BitsMap$delete$(_key$2, _map$3) {
        var self = _map$3;
        switch (self._) {
            case 'BitsMap.tie':
                var $1589 = self.val;
                var $1590 = self.lft;
                var $1591 = self.rgt;
                var self = _key$2;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'o':
                        var $1593 = self.slice(0, -1);
                        var $1594 = BitsMap$tie$($1589, BitsMap$delete$($1593, $1590), $1591);
                        var $1592 = $1594;
                        break;
                    case 'i':
                        var $1595 = self.slice(0, -1);
                        var $1596 = BitsMap$tie$($1589, $1590, BitsMap$delete$($1595, $1591));
                        var $1592 = $1596;
                        break;
                    case 'e':
                        var $1597 = BitsMap$tie$(Maybe$none, $1590, $1591);
                        var $1592 = $1597;
                        break;
                };
                var $1588 = $1592;
                break;
            case 'BitsMap.new':
                var $1598 = BitsMap$new;
                var $1588 = $1598;
                break;
        };
        return $1588;
    };
    const BitsMap$delete = x0 => x1 => BitsMap$delete$(x0, x1);

    function Map$delete$(_key$2, _map$3) {
        var $1599 = BitsMap$delete$(String$to_bits$(_key$2), _map$3);
        return $1599;
    };
    const Map$delete = x0 => x1 => Map$delete$(x0, x1);
    const App$Kaelin$Draw$draft$interrogation = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAn0lEQVQ4T8WUURKAIAhE44x1zO5og2mDKwiONflZ8tx1EdpeXuTwkvHfrBsBM+wsxD3dbKKnRK21gA1MqmTwCGoCq7IDPPN3Ae3qo8C6L30CZNFFeVwhOOXC5l5ngdgtXUgrQAuWuwhP9hqb9+cg6hKpT/WhPPgBejBVsvLUEDh0FbKsJG6OgAhwah5FgDhx1i17z01aCCmEQbGu8NdQLmHYLhXjuqBcAAAAAElFTkSuQmCC";

    function App$Kaelin$Draw$draft$player$(_hero$1) {
        var self = Maybe$default$(Maybe$monad$((_m$bind$2 => _m$pure$3 => {
            var $1601 = _m$bind$2;
            return $1601;
        }))(_hero$1)((_hero_id$2 => {
            var $1602 = Maybe$monad$((_m$bind$3 => _m$pure$4 => {
                var $1603 = _m$bind$3;
                return $1603;
            }))(App$Kaelin$Hero$info$(_hero_id$2))((_hero$3 => {
                var self = _hero$3;
                switch (self._) {
                    case 'App.Kaelin.Hero.new':
                        var $1605 = self.assets;
                        var $1606 = $1605;
                        var _assets$4 = $1606;
                        break;
                };
                var $1604 = Maybe$monad$((_m$bind$5 => _m$pure$6 => {
                    var $1607 = _m$pure$6;
                    return $1607;
                }))(Pair$new$((() => {
                    var self = _hero$3;
                    switch (self._) {
                        case 'App.Kaelin.Hero.new':
                            var $1608 = self.name;
                            var $1609 = $1608;
                            return $1609;
                    };
                })(), (() => {
                    var self = _assets$4;
                    switch (self._) {
                        case 'App.Kaelin.HeroAssets.new':
                            var $1610 = self.base64;
                            var $1611 = $1610;
                            return $1611;
                    };
                })()));
                return $1604;
            }));
            return $1602;
        })), Pair$new$("Choosing", App$Kaelin$Draw$draft$interrogation));
        switch (self._) {
            case 'Pair.new':
                var $1612 = self.fst;
                var $1613 = self.snd;
                var $1614 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("width", "100%"), List$cons$(Pair$new$("height", "100%"), List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("border", "5px solid #d6dadc"), List$cons$(Pair$new$("background-color", "#bac1c4"), List$cons$(Pair$new$("margin", "3%"), List$cons$(Pair$new$("border-radius", "5px"), List$cons$(Pair$new$("flex-direction", "column"), List$cons$(Pair$new$("justify-content", "space-between"), List$cons$(Pair$new$("align-items", "center"), List$cons$(Pair$new$("box-sizing", "border-box"), List$nil)))))))))))), List$cons$(DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("height", "10%"), List$cons$(Pair$new$("margin-top", "5%"), List$nil))), List$cons$(DOM$text$($1612), List$nil)), List$cons$(DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("width", "50%"), List$cons$(Pair$new$("height", "auto"), List$nil))), List$cons$(DOM$node$("img", Map$from_list$(List$cons$(Pair$new$("src", $1613), List$nil)), Map$from_list$(List$cons$(Pair$new$("width", "100%"), List$cons$(Pair$new$("height", "auto"), List$cons$(Pair$new$("image-rendering", "pixelated"), List$nil)))), List$nil), List$nil)), List$cons$(DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("width", "100%"), List$cons$(Pair$new$("height", "40%"), List$cons$(Pair$new$("background-color", "#d6dadc"), List$nil)))), List$nil), List$nil))));
                var $1600 = $1614;
                break;
        };
        return $1600;
    };
    const App$Kaelin$Draw$draft$player = x0 => App$Kaelin$Draw$draft$player$(x0);

    function App$Kaelin$Draw$draft$picks_left$(_hero$1) {
        var $1615 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("width", "40%"), List$cons$(Pair$new$("height", "100%"), List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("padding", "5%"), List$cons$(Pair$new$("box-sizing", "border-box"), List$nil)))))), List$cons$(App$Kaelin$Draw$draft$player$(_hero$1), List$nil));
        return $1615;
    };
    const App$Kaelin$Draw$draft$picks_left = x0 => App$Kaelin$Draw$draft$picks_left$(x0);

    function App$Kaelin$Team$eql$(_a$1, _b$2) {
        var self = _a$1;
        switch (self._) {
            case 'App.Kaelin.Team.red':
                var self = _b$2;
                switch (self._) {
                    case 'App.Kaelin.Team.red':
                        var $1618 = Bool$true;
                        var $1617 = $1618;
                        break;
                    case 'App.Kaelin.Team.blue':
                    case 'App.Kaelin.Team.neutral':
                        var $1619 = Bool$false;
                        var $1617 = $1619;
                        break;
                };
                var $1616 = $1617;
                break;
            case 'App.Kaelin.Team.blue':
                var self = _b$2;
                switch (self._) {
                    case 'App.Kaelin.Team.red':
                    case 'App.Kaelin.Team.neutral':
                        var $1621 = Bool$false;
                        var $1620 = $1621;
                        break;
                    case 'App.Kaelin.Team.blue':
                        var $1622 = Bool$true;
                        var $1620 = $1622;
                        break;
                };
                var $1616 = $1620;
                break;
            case 'App.Kaelin.Team.neutral':
                var self = _b$2;
                switch (self._) {
                    case 'App.Kaelin.Team.red':
                    case 'App.Kaelin.Team.blue':
                        var $1624 = Bool$false;
                        var $1623 = $1624;
                        break;
                    case 'App.Kaelin.Team.neutral':
                        var $1625 = Bool$true;
                        var $1623 = $1625;
                        break;
                };
                var $1616 = $1623;
                break;
        };
        return $1616;
    };
    const App$Kaelin$Team$eql = x0 => x1 => App$Kaelin$Team$eql$(x0, x1);
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
                    var $1626 = _state$2;
                    return $1626;
                } else {
                    var $1627 = Nat$for$(_func$5(_from$3)(_state$2), Nat$succ$(_from$3), _til$4, _func$5);
                    return $1627;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Nat$for = x0 => x1 => x2 => x3 => Nat$for$(x0, x1, x2, x3);

    function App$Kaelin$Draw$draft$ally$(_user$1, _info$2) {
        var self = _info$2;
        switch (self._) {
            case 'Maybe.some':
                var $1629 = self.value;
                var $1630 = Maybe$default$(Maybe$monad$((_m$bind$4 => _m$pure$5 => {
                    var $1631 = _m$bind$4;
                    return $1631;
                }))((() => {
                    var self = $1629;
                    switch (self._) {
                        case 'App.Kaelin.DraftInfo.new':
                            var $1632 = self.hero;
                            var $1633 = $1632;
                            return $1633;
                    };
                })())((_info$4 => {
                    var $1634 = Maybe$monad$((_m$bind$5 => _m$pure$6 => {
                        var $1635 = _m$bind$5;
                        return $1635;
                    }))(App$Kaelin$Hero$info$(_info$4))((_hero$5 => {
                        var self = _hero$5;
                        switch (self._) {
                            case 'App.Kaelin.Hero.new':
                                var $1637 = self.assets;
                                var $1638 = $1637;
                                var _assets$6 = $1638;
                                break;
                        };
                        var $1636 = Maybe$monad$((_m$bind$7 => _m$pure$8 => {
                            var $1639 = _m$pure$8;
                            return $1639;
                        }))(Pair$new$((() => {
                            var self = _hero$5;
                            switch (self._) {
                                case 'App.Kaelin.Hero.new':
                                    var $1640 = self.name;
                                    var $1641 = $1640;
                                    return $1641;
                            };
                        })(), (() => {
                            var self = _assets$6;
                            switch (self._) {
                                case 'App.Kaelin.HeroAssets.new':
                                    var $1642 = self.base64;
                                    var $1643 = $1642;
                                    return $1643;
                            };
                        })()));
                        return $1636;
                    }));
                    return $1634;
                })), Pair$new$("Choosing", App$Kaelin$Draw$draft$interrogation));
                var self = $1630;
                break;
            case 'Maybe.none':
                var $1644 = Pair$new$("Connecting", App$Kaelin$Draw$draft$interrogation);
                var self = $1644;
                break;
        };
        switch (self._) {
            case 'Pair.new':
                var $1645 = self.fst;
                var $1646 = self.snd;
                var $1647 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("width", "100%"), List$cons$(Pair$new$("height", "80%"), List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("border", "5px solid #d6dadc"), List$cons$(Pair$new$("background-color", "#bac1c4"), List$cons$(Pair$new$("margin", "3%"), List$cons$(Pair$new$("border-radius", "5px"), List$cons$(Pair$new$("flex-direction", "column"), List$cons$(Pair$new$("justify-content", "space-between"), List$cons$(Pair$new$("align-items", "center"), List$cons$(Pair$new$("box-sizing", "border-box"), List$nil)))))))))))), List$cons$(DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("height", "10%"), List$cons$(Pair$new$("margin-top", "5%"), List$nil))), List$cons$(DOM$text$($1645), List$nil)), List$cons$(DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("width", "50%"), List$cons$(Pair$new$("height", "auto"), List$nil))), List$cons$(DOM$node$("img", Map$from_list$(List$cons$(Pair$new$("src", $1646), List$nil)), Map$from_list$(List$cons$(Pair$new$("width", "100%"), List$cons$(Pair$new$("height", "auto"), List$cons$(Pair$new$("image-rendering", "pixelated"), List$nil)))), List$nil), List$nil)), List$cons$(DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("width", "100%"), List$cons$(Pair$new$("height", "40%"), List$cons$(Pair$new$("background-color", "#d6dadc"), List$nil)))), List$nil), List$nil))));
                var $1628 = $1647;
                break;
        };
        return $1628;
    };
    const App$Kaelin$Draw$draft$ally = x0 => x1 => App$Kaelin$Draw$draft$ally$(x0, x1);

    function App$Kaelin$Draw$draft$allies$(_map$1, _team$2) {
        var _lst$3 = Map$to_list$(_map$1);
        var _teammates$4 = List$nil;
        var _teammates$5 = (() => {
            var $1650 = _teammates$4;
            var $1651 = _lst$3;
            let _teammates$6 = $1650;
            let _info$5;
            while ($1651._ === 'List.cons') {
                _info$5 = $1651.head;
                var self = _info$5;
                switch (self._) {
                    case 'Pair.new':
                        var $1652 = self.snd;
                        var self = App$Kaelin$Team$eql$(_team$2, (() => {
                            var self = $1652;
                            switch (self._) {
                                case 'App.Kaelin.DraftInfo.new':
                                    var $1654 = self.team;
                                    var $1655 = $1654;
                                    return $1655;
                            };
                        })());
                        if (self) {
                            var $1656 = List$cons$(_info$5, _teammates$6);
                            var $1653 = $1656;
                        } else {
                            var $1657 = _teammates$6;
                            var $1653 = $1657;
                        };
                        var $1650 = $1653;
                        break;
                };
                _teammates$6 = $1650;
                $1651 = $1651.tail;
            }
            return _teammates$6;
        })();
        var _count$6 = (2n - (list_length(_teammates$5)) <= 0n ? 0n : 2n - (list_length(_teammates$5)));
        var _dom$7 = List$nil;
        var _dom$8 = Nat$for$(_dom$7, 0n, _count$6, (_i$8 => _dom$9 => {
            var $1658 = List$cons$(App$Kaelin$Draw$draft$ally$("none", Maybe$none), _dom$9);
            return $1658;
        }));
        var _dom$9 = (() => {
            var $1660 = _dom$8;
            var $1661 = _teammates$5;
            let _dom$10 = $1660;
            let _pair$9;
            while ($1661._ === 'List.cons') {
                _pair$9 = $1661.head;
                var $1660 = List$cons$(App$Kaelin$Draw$draft$ally$((() => {
                    var self = _pair$9;
                    switch (self._) {
                        case 'Pair.new':
                            var $1662 = self.fst;
                            var $1663 = $1662;
                            return $1663;
                    };
                })(), Maybe$some$((() => {
                    var self = _pair$9;
                    switch (self._) {
                        case 'Pair.new':
                            var $1664 = self.snd;
                            var $1665 = $1664;
                            return $1665;
                    };
                })())), _dom$10);
                _dom$10 = $1660;
                $1661 = $1661.tail;
            }
            return _dom$10;
        })();
        var $1648 = _dom$9;
        return $1648;
    };
    const App$Kaelin$Draw$draft$allies = x0 => x1 => App$Kaelin$Draw$draft$allies$(x0, x1);

    function App$Kaelin$Draw$draft$picks_right$(_map$1, _team$2) {
        var $1666 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("width", "60%"), List$cons$(Pair$new$("height", "100%"), List$cons$(Pair$new$("padding", "3%"), List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("flex-direction", "row"), List$cons$(Pair$new$("align-items", "center"), List$cons$(Pair$new$("box-sizing", "border-box"), List$nil)))))))), App$Kaelin$Draw$draft$allies$(_map$1, _team$2));
        return $1666;
    };
    const App$Kaelin$Draw$draft$picks_right = x0 => x1 => App$Kaelin$Draw$draft$picks_right$(x0, x1);

    function App$Kaelin$Draw$draft$picks$(_players$1, _user$2) {
        var _team$3 = Maybe$default$(App$Kaelin$Coord$draft$to_team$(_user$2, _players$1), App$Kaelin$Team$neutral);
        var _player$4 = Map$get$(_user$2, _players$1);
        var _allies$5 = Map$delete$(_user$2, _players$1);
        var self = _player$4;
        switch (self._) {
            case 'Maybe.some':
                var $1668 = self.value;
                var _player$7 = $1668;
                var self = _player$7;
                switch (self._) {
                    case 'App.Kaelin.DraftInfo.new':
                        var $1670 = self.hero;
                        var $1671 = $1670;
                        var $1669 = $1671;
                        break;
                };
                var _hero$6 = $1669;
                break;
            case 'Maybe.none':
                var $1672 = Maybe$none;
                var _hero$6 = $1672;
                break;
        };
        var $1667 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("width", "70%"), List$cons$(Pair$new$("height", "100%"), List$cons$(Pair$new$("display", "flex"), List$nil)))), List$cons$(App$Kaelin$Draw$draft$picks_left$(_hero$6), List$cons$(App$Kaelin$Draw$draft$picks_right$(_allies$5, _team$3), List$nil)));
        return $1667;
    };
    const App$Kaelin$Draw$draft$picks = x0 => x1 => App$Kaelin$Draw$draft$picks$(x0, x1);

    function App$Kaelin$Draw$draft$top$(_players$1, _coords$2, _user$3) {
        var _team$4 = Maybe$default$(App$Kaelin$Coord$draft$to_team$(_user$3, _players$1), App$Kaelin$Team$neutral);
        var self = (App$Kaelin$Team$show$(_team$4) === "blue");
        if (self) {
            var $1674 = "linear-gradient(#3fbcf2, #3791d4)";
            var _color$5 = $1674;
        } else {
            var self = (App$Kaelin$Team$show$(_team$4) === "red");
            if (self) {
                var $1676 = "linear-gradient(#ff6666, #ff4d4d)";
                var $1675 = $1676;
            } else {
                var $1677 = "linear-gradient(#94b8b8, #75a3a3)";
                var $1675 = $1677;
            };
            var _color$5 = $1675;
        };
        var $1673 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("width", "100%"), List$cons$(Pair$new$("height", "60%"), List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("background-image", _color$5), List$cons$(Pair$new$("align-items", "center"), List$cons$(Pair$new$("justify-content", "center"), List$nil))))))), List$cons$(DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("width", "100%"), List$cons$(Pair$new$("max-width", "1440px"), List$cons$(Pair$new$("height", "100%"), List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("background-image", _color$5), List$cons$(Pair$new$("align-items", "center"), List$cons$(Pair$new$("justify-content", "center"), List$nil)))))))), List$cons$(App$Kaelin$Draw$draft$map$(_players$1, _coords$2, _user$3), List$cons$(App$Kaelin$Draw$draft$picks$(_players$1, _user$3), List$nil))), List$nil));
        return $1673;
    };
    const App$Kaelin$Draw$draft$top = x0 => x1 => x2 => App$Kaelin$Draw$draft$top$(x0, x1, x2);

    function App$Kaelin$Draw$draft$selection$(_hero$1) {
        var self = _hero$1;
        switch (self._) {
            case 'App.Kaelin.Hero.new':
                var $1679 = self.assets;
                var $1680 = $1679;
                var _assets$2 = $1680;
                break;
        };
        var self = _assets$2;
        switch (self._) {
            case 'App.Kaelin.HeroAssets.new':
                var $1681 = self.base64;
                var $1682 = $1681;
                var _image$3 = $1682;
                break;
        };
        var $1678 = DOM$node$("div", Map$from_list$(List$cons$(Pair$new$("id", ("H" + (() => {
            var self = _hero$1;
            switch (self._) {
                case 'App.Kaelin.Hero.new':
                    var $1683 = self.name;
                    var $1684 = $1683;
                    return $1684;
            };
        })())), List$cons$(Pair$new$("action", (() => {
            var self = _hero$1;
            switch (self._) {
                case 'App.Kaelin.Hero.new':
                    var $1685 = self.name;
                    var $1686 = $1685;
                    return $1686;
            };
        })()), List$nil))), Map$from_list$(List$cons$(Pair$new$("margin", "4px"), List$cons$(Pair$new$("border", "5px solid #d6dadc"), List$cons$(Pair$new$("background-color", "#bac1c4"), List$cons$(Pair$new$("height", "auto"), List$cons$(Pair$new$("width", "15%"), List$cons$(Pair$new$("border-radius", "5px"), List$nil))))))), List$cons$(DOM$node$("div", Map$from_list$(List$cons$(Pair$new$("id", ("H" + (() => {
            var self = _hero$1;
            switch (self._) {
                case 'App.Kaelin.Hero.new':
                    var $1687 = self.name;
                    var $1688 = $1687;
                    return $1688;
            };
        })())), List$cons$(Pair$new$("action", (() => {
            var self = _hero$1;
            switch (self._) {
                case 'App.Kaelin.Hero.new':
                    var $1689 = self.name;
                    var $1690 = $1689;
                    return $1690;
            };
        })()), List$nil))), Map$from_list$(List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("justify-content", "center"), List$cons$(Pair$new$("font-size", "1.2vw"), List$nil)))), List$cons$(DOM$text$((() => {
            var self = _hero$1;
            switch (self._) {
                case 'App.Kaelin.Hero.new':
                    var $1691 = self.name;
                    var $1692 = $1691;
                    return $1692;
            };
        })()), List$nil)), List$cons$(DOM$node$("div", Map$from_list$(List$cons$(Pair$new$("id", ("H" + (() => {
            var self = _hero$1;
            switch (self._) {
                case 'App.Kaelin.Hero.new':
                    var $1693 = self.name;
                    var $1694 = $1693;
                    return $1694;
            };
        })())), List$cons$(Pair$new$("action", (() => {
            var self = _hero$1;
            switch (self._) {
                case 'App.Kaelin.Hero.new':
                    var $1695 = self.name;
                    var $1696 = $1695;
                    return $1696;
            };
        })()), List$nil))), Map$from_list$(List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("justify-content", "center"), List$cons$(Pair$new$("height", "100%"), List$cons$(Pair$new$("width", "100%"), List$nil))))), List$cons$(DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("padding", "2px"), List$cons$(Pair$new$("height", "100%"), List$cons$(Pair$new$("width", "100%"), List$nil)))), List$cons$(DOM$node$("img", Map$from_list$(List$cons$(Pair$new$("src", _image$3), List$cons$(Pair$new$("id", ("H" + (() => {
            var self = _hero$1;
            switch (self._) {
                case 'App.Kaelin.Hero.new':
                    var $1697 = self.name;
                    var $1698 = $1697;
                    return $1698;
            };
        })())), List$cons$(Pair$new$("action", (() => {
            var self = _hero$1;
            switch (self._) {
                case 'App.Kaelin.Hero.new':
                    var $1699 = self.name;
                    var $1700 = $1699;
                    return $1700;
            };
        })()), List$nil)))), Map$from_list$(List$cons$(Pair$new$("width", "75%"), List$cons$(Pair$new$("margin-left", "12.5%"), List$cons$(Pair$new$("height", "auto"), List$cons$(Pair$new$("image-rendering", "pixelated"), List$nil))))), List$nil), List$nil)), List$nil)), List$nil)));
        return $1678;
    };
    const App$Kaelin$Draw$draft$selection = x0 => App$Kaelin$Draw$draft$selection$(x0);

    function App$Kaelin$Draw$draft$bottom_left$(_players$1) {
        var _heroes$2 = List$map$(Pair$snd, Map$to_list$(App$Kaelin$Resources$heroes));
        var $1701 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("width", "70%"), List$cons$(Pair$new$("height", "100%"), List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("justify-content", "center"), List$cons$(Pair$new$("align-items", "center"), List$nil)))))), List$cons$(DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("flex-wrap", "wrap"), List$cons$(Pair$new$("justify-content", "center"), List$cons$(Pair$new$("width", "100%"), List$nil))))), List$map$(App$Kaelin$Draw$draft$selection, _heroes$2)), List$nil));
        return $1701;
    };
    const App$Kaelin$Draw$draft$bottom_left = x0 => App$Kaelin$Draw$draft$bottom_left$(x0);

    function App$Kaelin$Draw$draft$bottom_right$(_players$1, _room$2, _user$3) {
        var _info$4 = Map$get$(_user$3, _players$1);
        var self = _info$4;
        switch (self._) {
            case 'Maybe.some':
                var $1703 = self.value;
                var _player$6 = $1703;
                var self = _player$6;
                switch (self._) {
                    case 'App.Kaelin.DraftInfo.new':
                        var $1705 = self.ready;
                        var $1706 = $1705;
                        var self = $1706;
                        break;
                };
                if (self) {
                    var $1707 = Pair$new$("gray", "Cancel");
                    var $1704 = $1707;
                } else {
                    var $1708 = Pair$new$("#4CAF50", "Ready");
                    var $1704 = $1708;
                };
                var self = $1704;
                break;
            case 'Maybe.none':
                var $1709 = Pair$new$("#4CAF50", "Ready");
                var self = $1709;
                break;
        };
        switch (self._) {
            case 'Pair.new':
                var $1710 = self.fst;
                var $1711 = self.snd;
                var $1712 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("width", "30%"), List$cons$(Pair$new$("height", "auto"), List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("justify-content", "center"), List$cons$(Pair$new$("align-items", "center"), List$cons$(Pair$new$("flex-direction", "column"), List$nil))))))), List$cons$(DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("background-color", "#d6dadc"), List$cons$(Pair$new$("color", "black"), List$cons$(Pair$new$("padding", "8px"), List$cons$(Pair$new$("text-align", "center"), List$cons$(Pair$new$("border-radius", "5px"), List$cons$(Pair$new$("margin-bottom", "10px"), List$cons$(Pair$new$("font-size", "32px"), List$nil)))))))), List$cons$(DOM$text$(_room$2), List$nil)), List$cons$(DOM$node$("button", Map$from_list$(List$cons$(Pair$new$("id", "Ready"), List$nil)), Map$from_list$(List$cons$(Pair$new$("background-color", $1710), List$cons$(Pair$new$("border", "none"), List$cons$(Pair$new$("color", "white"), List$cons$(Pair$new$("padding", "32px"), List$cons$(Pair$new$("text-align", "center"), List$cons$(Pair$new$("text-decoration", "none"), List$cons$(Pair$new$("display", "inline-block"), List$cons$(Pair$new$("font-size", "32px"), List$cons$(Pair$new$("margin", "4px 2px"), List$cons$(Pair$new$("cursor", "pointer"), List$nil))))))))))), List$cons$(DOM$text$($1711), List$nil)), List$nil)));
                var $1702 = $1712;
                break;
        };
        return $1702;
    };
    const App$Kaelin$Draw$draft$bottom_right = x0 => x1 => x2 => App$Kaelin$Draw$draft$bottom_right$(x0, x1, x2);

    function App$Kaelin$Draw$draft$bottom$(_players$1, _room$2, _user$3) {
        var _heroes$4 = List$map$(Pair$snd, Map$to_list$(App$Kaelin$Resources$heroes));
        var $1713 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("width", "100%"), List$cons$(Pair$new$("height", "40%"), List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("background-image", "linear-gradient(#0e0c0e, #242324)"), List$cons$(Pair$new$("justify-content", "center"), List$cons$(Pair$new$("align-items", "center"), List$nil))))))), List$cons$(DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("width", "100%"), List$cons$(Pair$new$("max-width", "1440px"), List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("justify-content", "center"), List$cons$(Pair$new$("align-items", "center"), List$nil)))))), List$cons$(App$Kaelin$Draw$draft$bottom_left$(_players$1), List$cons$(App$Kaelin$Draw$draft$bottom_right$(_players$1, _room$2, _user$3), List$nil))), List$nil));
        return $1713;
    };
    const App$Kaelin$Draw$draft$bottom = x0 => x1 => x2 => App$Kaelin$Draw$draft$bottom$(x0, x1, x2);

    function App$Kaelin$Draw$draft$blue$(_players$1, _list$2) {
        var _length$3 = Nat$show$((list_length(_list$2)));
        var _text$4 = (_length$3 + "/3 Players");
        var $1714 = DOM$node$("button", Map$from_list$(List$cons$(Pair$new$("id", ("T" + (_length$3 + "blue"))), List$nil)), Map$from_list$(List$cons$(Pair$new$("width", "40%"), List$cons$(Pair$new$("height", "100%"), List$cons$(Pair$new$("background-image", "linear-gradient(#38a5fa, #2081e0)"), List$cons$(Pair$new$("box-shadow", "2px -2px 2px black"), List$cons$(Pair$new$("font-size", "8rem"), List$nil)))))), List$cons$(DOM$text$(_text$4), List$nil));
        return $1714;
    };
    const App$Kaelin$Draw$draft$blue = x0 => x1 => App$Kaelin$Draw$draft$blue$(x0, x1);

    function App$Kaelin$Draw$draft$red$(_players$1, _list$2) {
        var _length$3 = Nat$show$((list_length(_list$2)));
        var _text$4 = (_length$3 + "/3 Players");
        var $1715 = DOM$node$("button", Map$from_list$(List$cons$(Pair$new$("id", ("T" + (_length$3 + "red"))), List$nil)), Map$from_list$(List$cons$(Pair$new$("width", "40%"), List$cons$(Pair$new$("height", "100%"), List$cons$(Pair$new$("background-image", "linear-gradient(#ff3537, #d60f10)"), List$cons$(Pair$new$("box-shadow", "2px -2px 2px black"), List$cons$(Pair$new$("font-size", "8rem"), List$nil)))))), List$cons$(DOM$text$(_text$4), List$nil));
        return $1715;
    };
    const App$Kaelin$Draw$draft$red = x0 => x1 => App$Kaelin$Draw$draft$red$(x0, x1);

    function App$Kaelin$Draw$draft$choose_team$(_players$1) {
        var _list$2 = Map$to_list$(_players$1);
        var _pair$3 = Pair$new$(List$nil, List$nil);
        var _pair$4 = (() => {
            var $1718 = _pair$3;
            var $1719 = _list$2;
            let _pair$5 = $1718;
            let _player$4;
            while ($1719._ === 'List.cons') {
                _player$4 = $1719.head;
                var self = _player$4;
                switch (self._) {
                    case 'Pair.new':
                        var $1720 = self.fst;
                        var $1721 = self.snd;
                        var self = $1721;
                        switch (self._) {
                            case 'App.Kaelin.DraftInfo.new':
                                var $1723 = self.team;
                                var self = (App$Kaelin$Team$show$($1723) === "blue");
                                if (self) {
                                    var $1725 = Pair$new$(List$cons$($1720, (() => {
                                        var self = _pair$5;
                                        switch (self._) {
                                            case 'Pair.new':
                                                var $1726 = self.fst;
                                                var $1727 = $1726;
                                                return $1727;
                                        };
                                    })()), (() => {
                                        var self = _pair$5;
                                        switch (self._) {
                                            case 'Pair.new':
                                                var $1728 = self.snd;
                                                var $1729 = $1728;
                                                return $1729;
                                        };
                                    })());
                                    var $1724 = $1725;
                                } else {
                                    var self = (App$Kaelin$Team$show$($1723) === "red");
                                    if (self) {
                                        var $1731 = Pair$new$((() => {
                                            var self = _pair$5;
                                            switch (self._) {
                                                case 'Pair.new':
                                                    var $1732 = self.fst;
                                                    var $1733 = $1732;
                                                    return $1733;
                                            };
                                        })(), List$cons$($1720, (() => {
                                            var self = _pair$5;
                                            switch (self._) {
                                                case 'Pair.new':
                                                    var $1734 = self.snd;
                                                    var $1735 = $1734;
                                                    return $1735;
                                            };
                                        })()));
                                        var $1730 = $1731;
                                    } else {
                                        var $1736 = _pair$5;
                                        var $1730 = $1736;
                                    };
                                    var $1724 = $1730;
                                };
                                var $1722 = $1724;
                                break;
                        };
                        var $1718 = $1722;
                        break;
                };
                _pair$5 = $1718;
                $1719 = $1719.tail;
            }
            return _pair$5;
        })();
        var self = _pair$4;
        switch (self._) {
            case 'Pair.new':
                var $1737 = self.fst;
                var $1738 = $1737;
                var _blue$5 = $1738;
                break;
        };
        var self = _pair$4;
        switch (self._) {
            case 'Pair.new':
                var $1739 = self.snd;
                var $1740 = $1739;
                var _red$6 = $1740;
                break;
        };
        var $1716 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("width", "60%"), List$cons$(Pair$new$("height", "30%"), List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("flex-direction", "row"), List$cons$(Pair$new$("justify-content", "space-between"), List$nil)))))), List$cons$(App$Kaelin$Draw$draft$blue$(_players$1, _blue$5), List$cons$(App$Kaelin$Draw$draft$red$(_players$1, _red$6), List$nil)));
        return $1716;
    };
    const App$Kaelin$Draw$draft$choose_team = x0 => App$Kaelin$Draw$draft$choose_team$(x0);

    function App$Kaelin$Draw$draft$main$(_players$1, _coords$2, _room$3, _user$4) {
        var _player$5 = Map$get$(_user$4, _players$1);
        var _normal$6 = List$cons$(App$Kaelin$Draw$draft$top$(_players$1, _coords$2, _user$4), List$cons$(App$Kaelin$Draw$draft$bottom$(_players$1, _room$3, _user$4), List$nil));
        var self = _player$5;
        switch (self._) {
            case 'Maybe.some':
                var $1742 = self.value;
                var self = (App$Kaelin$Team$show$((() => {
                    var self = $1742;
                    switch (self._) {
                        case 'App.Kaelin.DraftInfo.new':
                            var $1744 = self.team;
                            var $1745 = $1744;
                            return $1745;
                    };
                })()) === "blue");
                if (self) {
                    var $1746 = _normal$6;
                    var $1743 = $1746;
                } else {
                    var self = (App$Kaelin$Team$show$((() => {
                        var self = $1742;
                        switch (self._) {
                            case 'App.Kaelin.DraftInfo.new':
                                var $1748 = self.team;
                                var $1749 = $1748;
                                return $1749;
                        };
                    })()) === "red");
                    if (self) {
                        var $1750 = _normal$6;
                        var $1747 = $1750;
                    } else {
                        var $1751 = List$cons$(App$Kaelin$Draw$draft$choose_team$(_players$1), List$nil);
                        var $1747 = $1751;
                    };
                    var $1743 = $1747;
                };
                var _draw$7 = $1743;
                break;
            case 'Maybe.none':
                var $1752 = List$cons$(App$Kaelin$Draw$draft$choose_team$(_players$1), List$nil);
                var _draw$7 = $1752;
                break;
        };
        var $1741 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("width", "100vw"), List$cons$(Pair$new$("height", "100vh"), List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("flex-direction", "column"), List$cons$(Pair$new$("justify-content", "center"), List$cons$(Pair$new$("align-items", "center"), List$cons$(Pair$new$("font-size", "2rem"), List$nil)))))))), _draw$7);
        return $1741;
    };
    const App$Kaelin$Draw$draft$main = x0 => x1 => x2 => x3 => App$Kaelin$Draw$draft$main$(x0, x1, x2, x3);

    function App$Kaelin$Draw$draft$(_state$1) {
        var self = _state$1;
        switch (self._) {
            case 'App.Store.new':
                var $1754 = self.local;
                var $1755 = self.global;
                var self = $1755;
                switch (self._) {
                    case 'App.Kaelin.State.global.new':
                        var $1757 = self.room;
                        var self = $1754;
                        switch (self._) {
                            case 'App.Kaelin.State.local.new':
                                var $1759 = self.user;
                                var self = $1755;
                                switch (self._) {
                                    case 'App.Kaelin.State.global.new':
                                        var $1761 = self.stage;
                                        var $1762 = $1761;
                                        var _stage$18 = $1762;
                                        break;
                                };
                                var self = _stage$18;
                                switch (self._) {
                                    case 'App.Kaelin.Stage.draft':
                                        var $1763 = self.players;
                                        var $1764 = self.coords;
                                        var _heroes$21 = List$map$(Pair$snd, Map$to_list$(App$Kaelin$Resources$heroes));
                                        var $1765 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("width", "100vw"), List$cons$(Pair$new$("height", "100vh"), List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("justify-content", "center"), List$cons$(Pair$new$("align-items", "center"), List$nil)))))), List$cons$(App$Kaelin$Draw$draft$main$($1763, $1764, $1757, $1759), List$nil));
                                        var $1760 = $1765;
                                        break;
                                    case 'App.Kaelin.Stage.init':
                                    case 'App.Kaelin.Stage.planning':
                                    case 'App.Kaelin.Stage.action':
                                        var $1766 = DOM$text$("");
                                        var $1760 = $1766;
                                        break;
                                };
                                var $1758 = $1760;
                                break;
                        };
                        var $1756 = $1758;
                        break;
                };
                var $1753 = $1756;
                break;
        };
        return $1753;
    };
    const App$Kaelin$Draw$draft = x0 => App$Kaelin$Draw$draft$(x0);
    const App$State$global = Pair$snd;

    function Pair$fst$(_pair$3) {
        var self = _pair$3;
        switch (self._) {
            case 'Pair.new':
                var $1768 = self.fst;
                var $1769 = $1768;
                var $1767 = $1769;
                break;
        };
        return $1767;
    };
    const Pair$fst = x0 => Pair$fst$(x0);
    const App$State$local = Pair$fst;

    function App$Kaelin$Stage$get_map$(_state$1) {
        var self = _state$1;
        switch (self._) {
            case 'App.Store.new':
                var $1771 = self.global;
                var $1772 = $1771;
                var self = $1772;
                break;
        };
        switch (self._) {
            case 'App.Kaelin.State.global.new':
                var $1773 = self.stage;
                var $1774 = $1773;
                var _stage$2 = $1774;
                break;
        };
        var self = _stage$2;
        switch (self._) {
            case 'App.Kaelin.Stage.init':
            case 'App.Kaelin.Stage.action':
                var self = _state$1;
                switch (self._) {
                    case 'App.Store.new':
                        var $1776 = self.global;
                        var $1777 = $1776;
                        var self = $1777;
                        break;
                };
                switch (self._) {
                    case 'App.Kaelin.State.global.new':
                        var $1778 = self.map;
                        var $1779 = $1778;
                        var $1775 = $1779;
                        break;
                };
                var $1770 = $1775;
                break;
            case 'App.Kaelin.Stage.draft':
                var self = _state$1;
                switch (self._) {
                    case 'App.Store.new':
                        var $1781 = self.global;
                        var $1782 = $1781;
                        var self = $1782;
                        break;
                };
                switch (self._) {
                    case 'App.Kaelin.State.global.new':
                        var $1783 = self.map;
                        var $1784 = $1783;
                        var $1780 = $1784;
                        break;
                };
                var $1770 = $1780;
                break;
            case 'App.Kaelin.Stage.planning':
                var self = _state$1;
                switch (self._) {
                    case 'App.Store.new':
                        var $1786 = self.local;
                        var $1787 = $1786;
                        var self = $1787;
                        break;
                };
                switch (self._) {
                    case 'App.Kaelin.State.local.new':
                        var $1788 = self.local_map;
                        var $1789 = $1788;
                        var $1785 = $1789;
                        break;
                };
                var $1770 = $1785;
                break;
        };
        return $1770;
    };
    const App$Kaelin$Stage$get_map = x0 => App$Kaelin$Stage$get_map$(x0);

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
                    var $1790 = _xs$2;
                    return $1790;
                } else {
                    var $1791 = (self - 1n);
                    var self = _xs$2;
                    if (self.length === 0) {
                        var $1793 = String$nil;
                        var $1792 = $1793;
                    } else {
                        var $1794 = self.charCodeAt(0);
                        var $1795 = self.slice(1);
                        var $1796 = String$drop$($1791, $1795);
                        var $1792 = $1796;
                    };
                    return $1792;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const String$drop = x0 => x1 => String$drop$(x0, x1);

    function List$head$(_xs$2) {
        var self = _xs$2;
        switch (self._) {
            case 'List.cons':
                var $1798 = self.head;
                var $1799 = Maybe$some$($1798);
                var $1797 = $1799;
                break;
            case 'List.nil':
                var $1800 = Maybe$none;
                var $1797 = $1800;
                break;
        };
        return $1797;
    };
    const List$head = x0 => List$head$(x0);

    function Char$eql$(_a$1, _b$2) {
        var $1801 = (_a$1 === _b$2);
        return $1801;
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
                    var $1802 = Bool$true;
                    return $1802;
                } else {
                    var $1803 = self.charCodeAt(0);
                    var $1804 = self.slice(1);
                    var self = _xs$1;
                    if (self.length === 0) {
                        var $1806 = Bool$false;
                        var $1805 = $1806;
                    } else {
                        var $1807 = self.charCodeAt(0);
                        var $1808 = self.slice(1);
                        var self = Char$eql$($1803, $1807);
                        if (self) {
                            var $1810 = String$starts_with$($1808, $1804);
                            var $1809 = $1810;
                        } else {
                            var $1811 = Bool$false;
                            var $1809 = $1811;
                        };
                        var $1805 = $1809;
                    };
                    return $1805;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const String$starts_with = x0 => x1 => String$starts_with$(x0, x1);

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
                    var $1812 = _n$2;
                    return $1812;
                } else {
                    var $1813 = self.charCodeAt(0);
                    var $1814 = self.slice(1);
                    var $1815 = String$length$go$($1814, Nat$succ$(_n$2));
                    return $1815;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const String$length$go = x0 => x1 => String$length$go$(x0, x1);

    function String$length$(_xs$1) {
        var $1816 = String$length$go$(_xs$1, 0n);
        return $1816;
    };
    const String$length = x0 => String$length$(x0);

    function String$split$go$(_xs$1, _match$2, _last$3) {
        var self = _xs$1;
        if (self.length === 0) {
            var $1818 = List$cons$(_last$3, List$nil);
            var $1817 = $1818;
        } else {
            var $1819 = self.charCodeAt(0);
            var $1820 = self.slice(1);
            var self = String$starts_with$(_xs$1, _match$2);
            if (self) {
                var _rest$6 = String$drop$(String$length$(_match$2), _xs$1);
                var $1822 = List$cons$(_last$3, String$split$go$(_rest$6, _match$2, ""));
                var $1821 = $1822;
            } else {
                var _next$6 = String$cons$($1819, String$nil);
                var $1823 = String$split$go$($1820, _match$2, (_last$3 + _next$6));
                var $1821 = $1823;
            };
            var $1817 = $1821;
        };
        return $1817;
    };
    const String$split$go = x0 => x1 => x2 => String$split$go$(x0, x1, x2);

    function String$split$(_xs$1, _match$2) {
        var $1824 = String$split$go$(_xs$1, _match$2, "");
        return $1824;
    };
    const String$split = x0 => x1 => String$split$(x0, x1);

    function Word$abs$(_a$2) {
        var _neg$3 = Word$is_neg$(_a$2);
        var self = _neg$3;
        if (self) {
            var $1826 = Word$neg$(_a$2);
            var $1825 = $1826;
        } else {
            var $1827 = _a$2;
            var $1825 = $1827;
        };
        return $1825;
    };
    const Word$abs = x0 => Word$abs$(x0);

    function Word$s_show$(_size$1, _a$2) {
        var _neg$3 = Word$is_neg$(_a$2);
        var _n$4 = Word$to_nat$(Word$abs$(_a$2));
        var self = _neg$3;
        if (self) {
            var $1829 = "-";
            var _sgn$5 = $1829;
        } else {
            var $1830 = "+";
            var _sgn$5 = $1830;
        };
        var $1828 = (_sgn$5 + (Nat$show$(_n$4) + ("#" + Nat$show$(_size$1))));
        return $1828;
    };
    const Word$s_show = x0 => x1 => Word$s_show$(x0, x1);

    function I32$show$(_a$1) {
        var self = _a$1;
        switch ('i32') {
            case 'i32':
                var $1832 = i32_to_word(self);
                var $1833 = Word$s_show$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$zero)))))))))))))))))))))))))))))))), $1832);
                var $1831 = $1833;
                break;
        };
        return $1831;
    };
    const I32$show = x0 => I32$show$(x0);

    function Word$show$(_size$1, _a$2) {
        var _n$3 = Word$to_nat$(_a$2);
        var $1834 = (Nat$show$(_n$3) + ("#" + Nat$show$(_size$1)));
        return $1834;
    };
    const Word$show = x0 => x1 => Word$show$(x0, x1);
    const U64$show = a0 => (a0 + "#64");

    function App$Kaelin$Draw$game$round$(_seconds$1, _round$2) {
        var _round$3 = String$drop$(1n, Maybe$default$(List$head$(String$split$(I32$show$(_round$2), "#")), ""));
        var self = _seconds$1;
        switch (self._) {
            case 'Maybe.some':
                var $1836 = self.value;
                var _seconds$5 = Maybe$default$(List$head$(String$split$(($1836 + "#64"), "#")), "");
                var $1837 = List$cons$(DOM$node$("p", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("margin-bottom", "5px"), List$nil)), List$cons$(DOM$text$(("Round: " + _round$3)), List$nil)), List$cons$(DOM$node$("p", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("text-align", "center"), List$nil)), List$cons$(DOM$text$(_seconds$5), List$nil)), List$nil));
                var $1835 = $1837;
                break;
            case 'Maybe.none':
                var $1838 = List$cons$(DOM$node$("p", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("margin-bottom", "5px"), List$nil)), List$cons$(DOM$text$(("Round: " + _round$3)), List$nil)), List$nil);
                var $1835 = $1838;
                break;
        };
        return $1835;
    };
    const App$Kaelin$Draw$game$round = x0 => x1 => App$Kaelin$Draw$game$round$(x0, x1);

    function DOM$vbox$(_props$1, _style$2, _value$3) {
        var $1839 = ({
            _: 'DOM.vbox',
            'props': _props$1,
            'style': _style$2,
            'value': _value$3
        });
        return $1839;
    };
    const DOM$vbox = x0 => x1 => x2 => DOM$vbox$(x0, x1, x2);
    const App$Kaelin$Constants$hexagon_radius = 15;
    const App$Kaelin$Constants$center_x = 256;
    const App$Kaelin$Constants$center_y = 128;
    const F64$sub = a0 => a1 => (a0 - a1);

    function App$Kaelin$Coord$round$floor$(_n$1) {
        var $1840 = (((_n$1 >> 0)));
        return $1840;
    };
    const App$Kaelin$Coord$round$floor = x0 => App$Kaelin$Coord$round$floor$(x0);

    function App$Kaelin$Coord$round$round_F64$(_n$1) {
        var _half$2 = (0.5);
        var _big_number$3 = (1000.0);
        var _n$4 = (_n$1 + _big_number$3);
        var _result$5 = App$Kaelin$Coord$round$floor$((_n$4 + _half$2));
        var $1841 = (_result$5 - _big_number$3);
        return $1841;
    };
    const App$Kaelin$Coord$round$round_F64 = x0 => App$Kaelin$Coord$round$round_F64$(x0);

    function Word$gtn$(_a$2, _b$3) {
        var $1842 = Cmp$as_gtn$(Word$cmp$(_a$2, _b$3));
        return $1842;
    };
    const Word$gtn = x0 => x1 => Word$gtn$(x0, x1);

    function F64$gtn$(_a$1, _b$2) {
        var self = _a$1;
        switch ('f64') {
            case 'f64':
                var $1844 = f64_to_word(self);
                var self = _b$2;
                switch ('f64') {
                    case 'f64':
                        var $1846 = f64_to_word(self);
                        var $1847 = Word$gtn$($1844, $1846);
                        var $1845 = $1847;
                        break;
                };
                var $1843 = $1845;
                break;
        };
        return $1843;
    };
    const F64$gtn = x0 => x1 => F64$gtn$(x0, x1);

    function App$Kaelin$Coord$round$diff$(_x$1, _y$2) {
        var _big_number$3 = (1000.0);
        var _x$4 = (_x$1 + _big_number$3);
        var _y$5 = (_y$2 + _big_number$3);
        var self = F64$gtn$(_x$4, _y$5);
        if (self) {
            var $1849 = (_x$4 - _y$5);
            var $1848 = $1849;
        } else {
            var $1850 = (_y$5 - _x$4);
            var $1848 = $1850;
        };
        return $1848;
    };
    const App$Kaelin$Coord$round$diff = x0 => x1 => App$Kaelin$Coord$round$diff$(x0, x1);

    function App$Kaelin$Coord$round$(_axial_x$1, _axial_y$2) {
        var _f$3 = U32$to_f64;
        var _i$4 = F64$to_i32;
        var _axial_z$5 = ((_f$3(0) - _axial_x$1) - _axial_y$2);
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
                var _new_y$12 = ((_f$3(0) - _round_x$6) - _round_z$8);
                var $1853 = Pair$new$(_i$4(_round_x$6), _i$4(_new_y$12));
                var $1852 = $1853;
            } else {
                var _new_x$12 = ((_f$3(0) - _round_y$7) - _round_z$8);
                var $1854 = Pair$new$(_i$4(_new_x$12), _i$4(_round_y$7));
                var $1852 = $1854;
            };
            var _result$12 = $1852;
        } else {
            var self = F64$gtn$(_diff_y$10, _diff_z$11);
            if (self) {
                var _new_y$12 = ((_f$3(0) - _round_x$6) - _round_z$8);
                var $1856 = Pair$new$(_i$4(_round_x$6), _i$4(_new_y$12));
                var $1855 = $1856;
            } else {
                var $1857 = Pair$new$(_i$4(_round_x$6), _i$4(_round_y$7));
                var $1855 = $1857;
            };
            var _result$12 = $1855;
        };
        var $1851 = _result$12;
        return $1851;
    };
    const App$Kaelin$Coord$round = x0 => x1 => App$Kaelin$Coord$round$(x0, x1);

    function App$Kaelin$Coord$to_axial$(_coord$1) {
        var self = _coord$1;
        switch (self._) {
            case 'Pair.new':
                var $1859 = self.fst;
                var $1860 = self.snd;
                var _f$4 = U32$to_f64;
                var _i$5 = F64$to_i32;
                var _float_hex_rad$6 = (_f$4(App$Kaelin$Constants$hexagon_radius) / (Number(2n)));
                var _center_x$7 = App$Kaelin$Constants$center_x;
                var _center_y$8 = App$Kaelin$Constants$center_y;
                var _float_x$9 = ((_f$4($1859) - _f$4(_center_x$7)) / _float_hex_rad$6);
                var _float_y$10 = ((_f$4($1860) - _f$4(_center_y$8)) / _float_hex_rad$6);
                var _fourth$11 = (0.25);
                var _sixth$12 = ((Number(1n)) / (Number(6n)));
                var _third$13 = ((Number(1n)) / (Number(3n)));
                var _half$14 = (0.5);
                var _axial_x$15 = ((_float_x$9 * _fourth$11) - (_float_y$10 * _sixth$12));
                var _axial_y$16 = (_float_y$10 * _third$13);
                var self = App$Kaelin$Coord$round$(_axial_x$15, _axial_y$16);
                switch (self._) {
                    case 'Pair.new':
                        var $1862 = self.fst;
                        var $1863 = self.snd;
                        var $1864 = App$Kaelin$Coord$new$($1862, $1863);
                        var $1861 = $1864;
                        break;
                };
                var $1858 = $1861;
                break;
        };
        return $1858;
    };
    const App$Kaelin$Coord$to_axial = x0 => App$Kaelin$Coord$to_axial$(x0);
    const App$Kaelin$Indicator$background = ({
        _: 'App.Kaelin.Indicator.background'
    });

    function NatSet$has$(_nat$1, _set$2) {
        var self = NatMap$get$(_nat$1, _set$2);
        switch (self._) {
            case 'Maybe.none':
                var $1866 = Bool$false;
                var $1865 = $1866;
                break;
            case 'Maybe.some':
                var $1867 = Bool$true;
                var $1865 = $1867;
                break;
        };
        return $1865;
    };
    const NatSet$has = x0 => x1 => NatSet$has$(x0, x1);
    const App$Kaelin$Indicator$blue = ({
        _: 'App.Kaelin.Indicator.blue'
    });

    function App$Kaelin$Draw$support$get_effect$(_coord_nat$1, _cast_info$2) {
        var self = _cast_info$2;
        switch (self._) {
            case 'Maybe.some':
                var $1869 = self.value;
                var self = $1869;
                switch (self._) {
                    case 'App.Kaelin.CastInfo.local.new':
                        var $1871 = self.range;
                        var _is_in_range$9 = NatSet$has$(_coord_nat$1, $1871);
                        var self = _is_in_range$9;
                        if (self) {
                            var $1873 = Maybe$some$(App$Kaelin$Indicator$blue);
                            var $1872 = $1873;
                        } else {
                            var $1874 = Maybe$none;
                            var $1872 = $1874;
                        };
                        var $1870 = $1872;
                        break;
                };
                var $1868 = $1870;
                break;
            case 'Maybe.none':
                var $1875 = Maybe$none;
                var $1868 = $1875;
                break;
        };
        return $1868;
    };
    const App$Kaelin$Draw$support$get_effect = x0 => x1 => App$Kaelin$Draw$support$get_effect$(x0, x1);

    function App$Kaelin$Draw$support$area_of_effect$(_mouse_coord$1, _coord_nat$2, _cast_info$3) {
        var $1876 = Maybe$monad$((_m$bind$4 => _m$pure$5 => {
            var $1877 = _m$bind$4;
            return $1877;
        }))(_cast_info$3)((_cast$4 => {
            var self = _cast$4;
            switch (self._) {
                case 'App.Kaelin.CastInfo.local.new':
                    var $1879 = self.range;
                    var $1880 = $1879;
                    var _cast_range$5 = $1880;
                    break;
            };
            var self = _cast$4;
            switch (self._) {
                case 'App.Kaelin.CastInfo.local.new':
                    var $1881 = self.area;
                    var $1882 = $1881;
                    var _cast_area$6 = $1882;
                    break;
            };
            var _mouse_pos$7 = App$Kaelin$Coord$Convert$axial_to_nat$(_mouse_coord$1);
            var $1878 = Maybe$monad$((_m$bind$8 => _m$pure$9 => {
                var $1883 = _m$bind$8;
                return $1883;
            }))((() => {
                var self = NatSet$has$(_mouse_pos$7, _cast_range$5);
                if (self) {
                    var $1884 = NatMap$get$(_coord_nat$2, _cast_area$6);
                    return $1884;
                } else {
                    var $1885 = Maybe$none;
                    return $1885;
                };
            })())((_result$8 => {
                var $1886 = Maybe$monad$((_m$bind$9 => _m$pure$10 => {
                    var $1887 = _m$pure$10;
                    return $1887;
                }))(_result$8);
                return $1886;
            }));
            return $1878;
        }));
        return $1876;
    };
    const App$Kaelin$Draw$support$area_of_effect = x0 => x1 => x2 => App$Kaelin$Draw$support$area_of_effect$(x0, x1, x2);

    function App$Kaelin$Draw$support$get_indicator$(_coord$1, _mouse_coord$2, _cast_info$3) {
        var self = _cast_info$3;
        switch (self._) {
            case 'Maybe.none':
                var $1889 = App$Kaelin$Indicator$background;
                var $1888 = $1889;
                break;
            case 'Maybe.some':
                var _coord_nat$5 = App$Kaelin$Coord$Convert$axial_to_nat$(_coord$1);
                var _range$6 = App$Kaelin$Draw$support$get_effect$(_coord_nat$5, _cast_info$3);
                var _area$7 = App$Kaelin$Draw$support$area_of_effect$(_mouse_coord$2, _coord_nat$5, _cast_info$3);
                var self = _area$7;
                switch (self._) {
                    case 'Maybe.some':
                        var $1891 = self.value;
                        var $1892 = $1891;
                        var $1890 = $1892;
                        break;
                    case 'Maybe.none':
                        var self = _range$6;
                        switch (self._) {
                            case 'Maybe.some':
                                var $1894 = self.value;
                                var $1895 = $1894;
                                var $1893 = $1895;
                                break;
                            case 'Maybe.none':
                                var $1896 = App$Kaelin$Indicator$background;
                                var $1893 = $1896;
                                break;
                        };
                        var $1890 = $1893;
                        break;
                };
                var $1888 = $1890;
                break;
        };
        return $1888;
    };
    const App$Kaelin$Draw$support$get_indicator = x0 => x1 => x2 => App$Kaelin$Draw$support$get_indicator$(x0, x1, x2);

    function App$Kaelin$Coord$to_screen_xy$(_coord$1) {
        var self = _coord$1;
        switch (self._) {
            case 'App.Kaelin.Coord.new':
                var $1898 = self.i;
                var $1899 = self.j;
                var _i$4 = $1898;
                var _j$5 = $1899;
                var _i$6 = (_i$4);
                var _j$7 = (_j$5);
                var _int_rad$8 = (App$Kaelin$Constants$hexagon_radius);
                var _hlf$9 = (_int_rad$8 / (+2.0));
                var _int_screen_center_x$10 = (App$Kaelin$Constants$center_x);
                var _int_screen_center_y$11 = (App$Kaelin$Constants$center_y);
                var _cx$12 = (_int_screen_center_x$10 + (_j$7 * _int_rad$8));
                var _cx$13 = (_cx$12 + (_i$6 * (_int_rad$8 * (Number(2n)))));
                var _cy$14 = (_int_screen_center_y$11 + (_j$7 * (_hlf$9 * (Number(3n)))));
                var _cx$15 = ((_cx$13 >>> 0));
                var _y$16 = (_cy$14 + (0.5));
                var _cy$17 = ((_cy$14 >>> 0));
                var $1900 = Pair$new$(_cx$15, _cy$17);
                var $1897 = $1900;
                break;
        };
        return $1897;
    };
    const App$Kaelin$Coord$to_screen_xy = x0 => App$Kaelin$Coord$to_screen_xy$(x0);

    function App$Kaelin$Draw$support$centralize$(_coord$1) {
        var self = App$Kaelin$Coord$to_screen_xy$(_coord$1);
        switch (self._) {
            case 'Pair.new':
                var $1902 = self.fst;
                var $1903 = self.snd;
                var _i$4 = (($1902 - App$Kaelin$Constants$hexagon_radius) >>> 0);
                var _j$5 = (($1903 - App$Kaelin$Constants$hexagon_radius) >>> 0);
                var $1904 = Pair$new$(_i$4, _j$5);
                var $1901 = $1904;
                break;
        };
        return $1901;
    };
    const App$Kaelin$Draw$support$centralize = x0 => App$Kaelin$Draw$support$centralize$(x0);

    function VoxBox$get_len$(_img$1) {
        var self = _img$1;
        switch (self._) {
            case 'VoxBox.new':
                var $1906 = self.length;
                var $1907 = $1906;
                var $1905 = $1907;
                break;
        };
        return $1905;
    };
    const VoxBox$get_len = x0 => VoxBox$get_len$(x0);

    function Array$get$(_idx$3, _arr$4) {
        var $1908 = Word$foldl$(Array$extract_tip, (_rec$6 => _arr$7 => {
            var _arr_l$8 = Array$extract_tie$(_arr$7);
            var self = _arr_l$8;
            switch (self._) {
                case 'Pair.new':
                    var $1910 = self.fst;
                    var $1911 = _rec$6($1910);
                    var $1909 = $1911;
                    break;
            };
            return $1909;
        }), (_rec$6 => _arr$7 => {
            var _arr_r$8 = Array$extract_tie$(_arr$7);
            var self = _arr_r$8;
            switch (self._) {
                case 'Pair.new':
                    var $1913 = self.snd;
                    var $1914 = _rec$6($1913);
                    var $1912 = $1914;
                    break;
            };
            return $1912;
        }), _idx$3)(_arr$4);
        return $1908;
    };
    const Array$get = x0 => x1 => Array$get$(x0, x1);
    const Buffer32$get = a0 => a1 => ((a1[a0]));
    const VoxBox$get_pos = a0 => a1 => ((a1.buffer[a0 * 2]));
    const VoxBox$get_col = a0 => a1 => ((a1.buffer[a0 * 2 + 1]));

    function Word$and$(_a$2, _b$3) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $1916 = self.pred;
                var $1917 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $1919 = self.pred;
                            var $1920 = (_a$pred$9 => {
                                var $1921 = Word$o$(Word$and$(_a$pred$9, $1919));
                                return $1921;
                            });
                            var $1918 = $1920;
                            break;
                        case 'Word.i':
                            var $1922 = self.pred;
                            var $1923 = (_a$pred$9 => {
                                var $1924 = Word$o$(Word$and$(_a$pred$9, $1922));
                                return $1924;
                            });
                            var $1918 = $1923;
                            break;
                        case 'Word.e':
                            var $1925 = (_a$pred$7 => {
                                var $1926 = Word$e;
                                return $1926;
                            });
                            var $1918 = $1925;
                            break;
                    };
                    var $1918 = $1918($1916);
                    return $1918;
                });
                var $1915 = $1917;
                break;
            case 'Word.i':
                var $1927 = self.pred;
                var $1928 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $1930 = self.pred;
                            var $1931 = (_a$pred$9 => {
                                var $1932 = Word$o$(Word$and$(_a$pred$9, $1930));
                                return $1932;
                            });
                            var $1929 = $1931;
                            break;
                        case 'Word.i':
                            var $1933 = self.pred;
                            var $1934 = (_a$pred$9 => {
                                var $1935 = Word$i$(Word$and$(_a$pred$9, $1933));
                                return $1935;
                            });
                            var $1929 = $1934;
                            break;
                        case 'Word.e':
                            var $1936 = (_a$pred$7 => {
                                var $1937 = Word$e;
                                return $1937;
                            });
                            var $1929 = $1936;
                            break;
                    };
                    var $1929 = $1929($1927);
                    return $1929;
                });
                var $1915 = $1928;
                break;
            case 'Word.e':
                var $1938 = (_b$4 => {
                    var $1939 = Word$e;
                    return $1939;
                });
                var $1915 = $1938;
                break;
        };
        var $1915 = $1915(_b$3);
        return $1915;
    };
    const Word$and = x0 => x1 => Word$and$(x0, x1);
    const U32$and = a0 => a1 => (a0 & a1);
    const U32$shr = a0 => a1 => (a0 >>> a1);

    function VoxBox$Draw$image$(_x$1, _y$2, _z$3, _src$4, _img$5) {
        var _len$6 = VoxBox$get_len$(_src$4);
        var _img$7 = (() => {
            var $1941 = _img$5;
            var $1942 = 0;
            var $1943 = _len$6;
            let _img$8 = $1941;
            for (let _i$7 = $1942; _i$7 < $1943; ++_i$7) {
                var _pos$9 = ((_src$4.buffer[_i$7 * 2]));
                var _col$10 = ((_src$4.buffer[_i$7 * 2 + 1]));
                var _p_x$11 = (_pos$9 & 4095);
                var _p_y$12 = ((_pos$9 & 16773120) >>> 12);
                var _p_z$13 = ((_pos$9 & 4278190080) >>> 24);
                var _p_x$14 = ((_p_x$11 + _x$1) >>> 0);
                var _p_y$15 = ((_p_y$12 + _y$2) >>> 0);
                var _p_z$16 = ((_p_z$13 + _z$3) >>> 0);
                var _pos$17 = ((0 | _p_x$14 | (_p_y$15 << 12) | (_p_z$16 << 24)));
                var $1941 = ((_img$8.buffer[_img$8.length * 2] = _pos$17, _img$8.buffer[_img$8.length * 2 + 1] = _col$10, _img$8.length++, _img$8));
                _img$8 = $1941;
            };
            return _img$8;
        })();
        var $1940 = _img$7;
        return $1940;
    };
    const VoxBox$Draw$image = x0 => x1 => x2 => x3 => x4 => VoxBox$Draw$image$(x0, x1, x2, x3, x4);

    function App$Kaelin$Draw$tile$background$(_terrain$1, _cast_info$2, _coord$3, _mouse_coord$4, _img$5) {
        var _coord_nat$6 = App$Kaelin$Coord$Convert$axial_to_nat$(_coord$3);
        var _sprite$7 = App$Kaelin$Draw$support$get_indicator$(_coord$3, _mouse_coord$4, _cast_info$2);
        var self = App$Kaelin$Draw$support$centralize$(_coord$3);
        switch (self._) {
            case 'Pair.new':
                var $1945 = self.fst;
                var $1946 = self.snd;
                var $1947 = VoxBox$Draw$image$($1945, $1946, 0, (() => {
                    var self = _terrain$1;
                    switch (self._) {
                        case 'App.Kaelin.Terrain.new':
                            var $1948 = self.draw;
                            var $1949 = $1948;
                            return $1949;
                    };
                })()(_sprite$7), _img$5);
                var $1944 = $1947;
                break;
        };
        return $1944;
    };
    const App$Kaelin$Draw$tile$background = x0 => x1 => x2 => x3 => x4 => App$Kaelin$Draw$tile$background$(x0, x1, x2, x3, x4);

    function App$Kaelin$Draw$hero$(_cx$1, _cy$2, _z$3, _hero$4, _img$5) {
        var self = _hero$4;
        switch (self._) {
            case 'App.Kaelin.Hero.new':
                var $1951 = self.assets;
                var _aux_y$11 = ((App$Kaelin$Constants$hexagon_radius * 2) >>> 0);
                var _cy$12 = ((_cy$2 - _aux_y$11) >>> 0);
                var _cx$13 = ((_cx$1 - App$Kaelin$Constants$hexagon_radius) >>> 0);
                var $1952 = VoxBox$Draw$image$(_cx$13, _cy$12, 0, (() => {
                    var self = $1951;
                    switch (self._) {
                        case 'App.Kaelin.HeroAssets.new':
                            var $1953 = self.vbox;
                            var $1954 = $1953;
                            return $1954;
                    };
                })(), _img$5);
                var $1950 = $1952;
                break;
        };
        return $1950;
    };
    const App$Kaelin$Draw$hero = x0 => x1 => x2 => x3 => x4 => App$Kaelin$Draw$hero$(x0, x1, x2, x3, x4);

    function Int$neg$(_a$1) {
        var self = _a$1;
        switch ("new") {
            case 'new':
                var $1956 = int_pos(self);
                var $1957 = int_neg(self);
                var $1958 = ($1957 - $1956);
                var $1955 = $1958;
                break;
        };
        return $1955;
    };
    const Int$neg = x0 => Int$neg$(x0);

    function Word$to_int$(_a$2) {
        var _neg$3 = Word$is_neg$(_a$2);
        var _i$4 = (Word$to_nat$(Word$abs$(_a$2)));
        var self = _neg$3;
        if (self) {
            var $1960 = Int$neg$(_i$4);
            var $1959 = $1960;
        } else {
            var $1961 = _i$4;
            var $1959 = $1961;
        };
        return $1959;
    };
    const Word$to_int = x0 => Word$to_int$(x0);

    function I32$to_int$(_a$1) {
        var self = _a$1;
        switch ('i32') {
            case 'i32':
                var $1963 = i32_to_word(self);
                var $1964 = Word$to_int$($1963);
                var $1962 = $1964;
                break;
        };
        return $1962;
    };
    const I32$to_int = x0 => I32$to_int$(x0);

    function Int$to_nat$(_a$1) {
        var self = _a$1;
        switch ("new") {
            case 'new':
                var $1966 = int_pos(self);
                var $1967 = $1966;
                var $1965 = $1967;
                break;
        };
        return $1965;
    };
    const Int$to_nat = x0 => Int$to_nat$(x0);

    function List$imap$(_f$3, _xs$4) {
        var self = _xs$4;
        switch (self._) {
            case 'List.cons':
                var $1969 = self.head;
                var $1970 = self.tail;
                var $1971 = List$cons$(_f$3(0n)($1969), List$imap$((_n$7 => {
                    var $1972 = _f$3(Nat$succ$(_n$7));
                    return $1972;
                }), $1970));
                var $1968 = $1971;
                break;
            case 'List.nil':
                var $1973 = List$nil;
                var $1968 = $1973;
                break;
        };
        return $1968;
    };
    const List$imap = x0 => x1 => List$imap$(x0, x1);

    function List$indices$u32$(_xs$2) {
        var $1974 = List$imap$((_i$3 => _x$4 => {
            var $1975 = Pair$new$((Number(_i$3) >>> 0), _x$4);
            return $1975;
        }), _xs$2);
        return $1974;
    };
    const List$indices$u32 = x0 => List$indices$u32$(x0);

    function String$to_list$(_str$1) {
        var self = _str$1;
        if (self.length === 0) {
            var $1977 = List$nil;
            var $1976 = $1977;
        } else {
            var $1978 = self.charCodeAt(0);
            var $1979 = self.slice(1);
            var $1980 = List$cons$($1978, String$to_list$($1979));
            var $1976 = $1980;
        };
        return $1976;
    };
    const String$to_list = x0 => String$to_list$(x0);

    function U16$show_hex$(_a$1) {
        var self = _a$1;
        switch ('u16') {
            case 'u16':
                var $1982 = u16_to_word(self);
                var $1983 = Nat$to_string_base$(16n, Bits$to_nat$(Word$to_bits$($1982)));
                var $1981 = $1983;
                break;
        };
        return $1981;
    };
    const U16$show_hex = x0 => U16$show_hex$(x0);

    function PixelFont$get_img$(_char$1, _map$2) {
        var self = Map$get$(U16$show_hex$(_char$1), _map$2);
        switch (self._) {
            case 'Maybe.some':
                var $1985 = self.value;
                var $1986 = Maybe$some$($1985);
                var $1984 = $1986;
                break;
            case 'Maybe.none':
                var $1987 = Maybe$none;
                var $1984 = $1987;
                break;
        };
        return $1984;
    };
    const PixelFont$get_img = x0 => x1 => PixelFont$get_img$(x0, x1);
    const Pos32$get_x = a0 => ((a0 & 0xFFF));
    const Pos32$get_y = a0 => (((a0 >>> 12) & 0xFFF));
    const Pos32$get_z = a0 => ((a0 >>> 24));

    function VoxBox$Draw$text$char$(_chr$1, _font_map$2, _chr_pos$3, _scr$4) {
        var self = PixelFont$get_img$(_chr$1, _font_map$2);
        switch (self._) {
            case 'Maybe.some':
                var $1989 = self.value;
                var _x$6 = ((_chr_pos$3 & 0xFFF));
                var _y$7 = (((_chr_pos$3 >>> 12) & 0xFFF));
                var _z$8 = ((_chr_pos$3 >>> 24));
                var $1990 = VoxBox$Draw$image$(_x$6, _y$7, _z$8, $1989, _scr$4);
                var $1988 = $1990;
                break;
            case 'Maybe.none':
                var $1991 = _scr$4;
                var $1988 = $1991;
                break;
        };
        return $1988;
    };
    const VoxBox$Draw$text$char = x0 => x1 => x2 => x3 => VoxBox$Draw$text$char$(x0, x1, x2, x3);

    function Pos32$add$(_a$1, _b$2) {
        var _x$3 = ((((_a$1 & 0xFFF)) + ((_b$2 & 0xFFF))) >>> 0);
        var _y$4 = (((((_a$1 >>> 12) & 0xFFF)) + (((_b$2 >>> 12) & 0xFFF))) >>> 0);
        var _z$5 = ((((_a$1 >>> 24)) + ((_b$2 >>> 24))) >>> 0);
        var $1992 = ((0 | _x$3 | (_y$4 << 12) | (_z$5 << 24)));
        return $1992;
    };
    const Pos32$add = x0 => x1 => Pos32$add$(x0, x1);

    function VoxBox$Draw$text$(_txt$1, _font_map$2, _pos$3, _scr$4) {
        var _scr$5 = (() => {
            var $1995 = _scr$4;
            var $1996 = List$indices$u32$(String$to_list$(_txt$1));
            let _scr$6 = $1995;
            let _pair$5;
            while ($1996._ === 'List.cons') {
                _pair$5 = $1996.head;
                var self = _pair$5;
                switch (self._) {
                    case 'Pair.new':
                        var $1997 = self.fst;
                        var $1998 = self.snd;
                        var _add_pos$9 = ((0 | (($1997 * 6) >>> 0) | (0 << 12) | (0 << 24)));
                        var $1999 = VoxBox$Draw$text$char$($1998, _font_map$2, Pos32$add$(_pos$3, _add_pos$9), _scr$6);
                        var $1995 = $1999;
                        break;
                };
                _scr$6 = $1995;
                $1996 = $1996.tail;
            }
            return _scr$6;
        })();
        var $1993 = _scr$5;
        return $1993;
    };
    const VoxBox$Draw$text = x0 => x1 => x2 => x3 => VoxBox$Draw$text$(x0, x1, x2, x3);

    function PixelFont$set_img$(_char$1, _img$2, _map$3) {
        var $2000 = Map$set$(U16$show_hex$(_char$1), _img$2, _map$3);
        return $2000;
    };
    const PixelFont$set_img = x0 => x1 => x2 => PixelFont$set_img$(x0, x1, x2);
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
        var $2001 = _map$96;
        return $2001;
    })();

    function App$Kaelin$Draw$creature$hp$(_cx$1, _cy$2, _creature$3, _img$4) {
        var _hp$5 = I32$to_int$((() => {
            var self = _creature$3;
            switch (self._) {
                case 'App.Kaelin.Creature.new':
                    var $2003 = self.hp;
                    var $2004 = $2003;
                    return $2004;
            };
        })());
        var _hp$6 = Nat$show$(Int$to_nat$(_hp$5));
        var $2002 = VoxBox$Draw$text$(_hp$6, PixelFont$small_black, ((0 | _cx$1 | (_cy$2 << 12) | (0 << 24))), _img$4);
        return $2002;
    };
    const App$Kaelin$Draw$creature$hp = x0 => x1 => x2 => x3 => App$Kaelin$Draw$creature$hp$(x0, x1, x2, x3);

    function App$Kaelin$Draw$creature$ap$(_cx$1, _cy$2, _creature$3, _img$4) {
        var _ap$5 = I32$to_int$((() => {
            var self = _creature$3;
            switch (self._) {
                case 'App.Kaelin.Creature.new':
                    var $2006 = self.ap;
                    var $2007 = $2006;
                    return $2007;
            };
        })());
        var _ap$6 = Nat$show$(Int$to_nat$(_ap$5));
        var $2005 = VoxBox$Draw$text$(_ap$6, PixelFont$small_black, ((0 | _cx$1 | (_cy$2 << 12) | (0 << 24))), _img$4);
        return $2005;
    };
    const App$Kaelin$Draw$creature$ap = x0 => x1 => x2 => x3 => App$Kaelin$Draw$creature$ap$(x0, x1, x2, x3);

    function App$Kaelin$Draw$tile$creature$(_creature$1, _coord$2, _img$3) {
        var self = _creature$1;
        switch (self._) {
            case 'Maybe.some':
                var $2009 = self.value;
                var _key$5 = App$Kaelin$Coord$Convert$axial_to_nat$(_coord$2);
                var self = App$Kaelin$Coord$to_screen_xy$(_coord$2);
                switch (self._) {
                    case 'Pair.new':
                        var $2011 = self.fst;
                        var $2012 = self.snd;
                        var _img$8 = App$Kaelin$Draw$hero$($2011, $2012, 0, (() => {
                            var self = $2009;
                            switch (self._) {
                                case 'App.Kaelin.Creature.new':
                                    var $2014 = self.hero;
                                    var $2015 = $2014;
                                    return $2015;
                            };
                        })(), _img$3);
                        var self = ((() => {
                            var self = $2009;
                            switch (self._) {
                                case 'App.Kaelin.Creature.new':
                                    var $2016 = self.hp;
                                    var $2017 = $2016;
                                    return $2017;
                            };
                        })() > 0);
                        if (self) {
                            var _hp$9 = App$Kaelin$Draw$creature$hp$((($2011 - 5) >>> 0), (($2012 - 31) >>> 0), $2009, _img$8);
                            var _ap$10 = App$Kaelin$Draw$creature$ap$((($2011 - 5) >>> 0), (($2012 - 25) >>> 0), $2009, _img$8);
                            var $2018 = _ap$10;
                            var $2013 = $2018;
                        } else {
                            var $2019 = _img$8;
                            var $2013 = $2019;
                        };
                        var $2010 = $2013;
                        break;
                };
                var $2008 = $2010;
                break;
            case 'Maybe.none':
                var $2020 = _img$3;
                var $2008 = $2020;
                break;
        };
        return $2008;
    };
    const App$Kaelin$Draw$tile$creature = x0 => x1 => x2 => App$Kaelin$Draw$tile$creature$(x0, x1, x2);
    const Nat$div = a0 => a1 => (a0 / a1);

    function List$get$(_index$2, _list$3) {
        var List$get$ = (_index$2, _list$3) => ({
            ctr: 'TCO',
            arg: [_index$2, _list$3]
        });
        var List$get = _index$2 => _list$3 => List$get$(_index$2, _list$3);
        var arg = [_index$2, _list$3];
        while (true) {
            let [_index$2, _list$3] = arg;
            var R = (() => {
                var self = _list$3;
                switch (self._) {
                    case 'List.cons':
                        var $2021 = self.head;
                        var $2022 = self.tail;
                        var self = _index$2;
                        if (self === 0n) {
                            var $2024 = Maybe$some$($2021);
                            var $2023 = $2024;
                        } else {
                            var $2025 = (self - 1n);
                            var $2026 = List$get$($2025, $2022);
                            var $2023 = $2026;
                        };
                        return $2023;
                    case 'List.nil':
                        var $2027 = Maybe$none;
                        return $2027;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const List$get = x0 => x1 => List$get$(x0, x1);

    function App$Kaelin$Draw$support$animation_frame$(_pos$1, _z$2, _effect$3, _img$4) {
        var self = App$Kaelin$Draw$support$centralize$(_pos$1);
        switch (self._) {
            case 'Pair.new':
                var $2029 = self.fst;
                var $2030 = self.snd;
                var $2031 = VoxBox$Draw$image$($2029, (($2030 - ((App$Kaelin$Constants$hexagon_radius / 2) >>> 0)) >>> 0), _z$2, _effect$3, _img$4);
                var $2028 = $2031;
                break;
        };
        return $2028;
    };
    const App$Kaelin$Draw$support$animation_frame = x0 => x1 => x2 => x3 => App$Kaelin$Draw$support$animation_frame$(x0, x1, x2, x3);

    function App$Kaelin$Draw$tile$animation$(_animation$1, _coord$2, _internal$3, _img$4) {
        var self = _animation$1;
        switch (self._) {
            case 'Maybe.some':
                var $2033 = self.value;
                var self = $2033;
                switch (self._) {
                    case 'App.Kaelin.Animation.new':
                        var $2035 = self.sprite;
                        var self = $2035;
                        switch (self._) {
                            case 'App.Kaelin.Sprite.new':
                                var $2037 = self.frame_info;
                                var $2038 = self.voxboxes;
                                var self = _internal$3;
                                switch (self._) {
                                    case 'App.Kaelin.Internal.new':
                                        var $2040 = self.frame;
                                        var _indx$13 = (($2040 / $2037) % (list_length($2038)));
                                        var self = List$get$(_indx$13, $2038);
                                        switch (self._) {
                                            case 'Maybe.some':
                                                var $2042 = self.value;
                                                var $2043 = App$Kaelin$Draw$support$animation_frame$(_coord$2, 6, $2042, _img$4);
                                                var $2041 = $2043;
                                                break;
                                            case 'Maybe.none':
                                                var $2044 = _img$4;
                                                var $2041 = $2044;
                                                break;
                                        };
                                        var $2039 = $2041;
                                        break;
                                };
                                var $2036 = $2039;
                                break;
                        };
                        var $2034 = $2036;
                        break;
                };
                var $2032 = $2034;
                break;
            case 'Maybe.none':
                var $2045 = _img$4;
                var $2032 = $2045;
                break;
        };
        return $2032;
    };
    const App$Kaelin$Draw$tile$animation = x0 => x1 => x2 => x3 => App$Kaelin$Draw$tile$animation$(x0, x1, x2, x3);

    function App$Kaelin$Draw$state$map$(_map$1, _cast_info$2, _env_info$3, _internal$4, _img$5) {
        var _map$6 = NatMap$to_list$(_map$1);
        var _mouse_coord$7 = App$Kaelin$Coord$to_axial$((() => {
            var self = _env_info$3;
            switch (self._) {
                case 'App.EnvInfo.new':
                    var $2047 = self.mouse_pos;
                    var $2048 = $2047;
                    return $2048;
            };
        })());
        var _img$8 = (() => {
            var $2050 = _img$5;
            var $2051 = _map$6;
            let _img$9 = $2050;
            let _pos$8;
            while ($2051._ === 'List.cons') {
                _pos$8 = $2051.head;
                var self = _pos$8;
                switch (self._) {
                    case 'Pair.new':
                        var $2052 = self.fst;
                        var $2053 = self.snd;
                        var _coord$12 = App$Kaelin$Coord$Convert$nat_to_axial$($2052);
                        var _img$13 = App$Kaelin$Draw$tile$background$((() => {
                            var self = $2053;
                            switch (self._) {
                                case 'App.Kaelin.Tile.new':
                                    var $2055 = self.background;
                                    var $2056 = $2055;
                                    return $2056;
                            };
                        })(), _cast_info$2, _coord$12, _mouse_coord$7, _img$9);
                        var _img$14 = App$Kaelin$Draw$tile$creature$((() => {
                            var self = $2053;
                            switch (self._) {
                                case 'App.Kaelin.Tile.new':
                                    var $2057 = self.creature;
                                    var $2058 = $2057;
                                    return $2058;
                            };
                        })(), _coord$12, _img$13);
                        var _img$15 = App$Kaelin$Draw$tile$animation$((() => {
                            var self = $2053;
                            switch (self._) {
                                case 'App.Kaelin.Tile.new':
                                    var $2059 = self.animation;
                                    var $2060 = $2059;
                                    return $2060;
                            };
                        })(), _coord$12, _internal$4, _img$14);
                        var $2054 = _img$15;
                        var $2050 = $2054;
                        break;
                };
                _img$9 = $2050;
                $2051 = $2051.tail;
            }
            return _img$9;
        })();
        var $2046 = _img$8;
        return $2046;
    };
    const App$Kaelin$Draw$state$map = x0 => x1 => x2 => x3 => x4 => App$Kaelin$Draw$state$map$(x0, x1, x2, x3, x4);
    const App$Kaelin$Assets$tile$mouse_ui = VoxBox$parse$("0d0302ffffff0e0302ffffff0f0302ffffff100302ffffff110302ffffff0b0402ffffff0c0402ffffff0d0402ffffff0e0402ffffff0f0402ffffff100402ffffff110402ffffff120402ffffff130402ffffff0b0502ffffff0c0502ffffff0d0502ffffff110502ffffff120502ffffff130502ffffff040702ffffff050702ffffff060702ffffff180702ffffff190702ffffff1a0702ffffff030802ffffff040802ffffff050802ffffff060802ffffff180802ffffff190802ffffff1a0802ffffff1b0802ffffff020902ffffff030902ffffff040902ffffff1a0902ffffff1b0902ffffff1c0902ffffff020a02ffffff030a02ffffff1b0a02ffffff1c0a02ffffff020b02ffffff030b02ffffff1b0b02ffffff1c0b02ffffff021302ffffff031302ffffff1b1302ffffff1c1302ffffff021402ffffff031402ffffff1b1402ffffff1c1402ffffff021502ffffff031502ffffff041502ffffff1a1502ffffff1b1502ffffff1c1502ffffff031602ffffff041602ffffff051602ffffff061602ffffff181602ffffff191602ffffff1a1602ffffff1b1602ffffff041702ffffff051702ffffff061702ffffff181702ffffff191702ffffff1a1702ffffff0b1902ffffff0c1902ffffff0d1902ffffff111902ffffff121902ffffff131902ffffff0b1a02ffffff0c1a02ffffff0d1a02ffffff0e1a02ffffff0f1a02ffffff101a02ffffff111a02ffffff121a02ffffff131a02ffffff0d1b02ffffff0e1b02ffffff0f1b02ffffff101b02ffffff111b02ffffff");

    function App$Kaelin$Draw$state$mouse_ui$(_info$1, _img$2) {
        var self = _info$1;
        switch (self._) {
            case 'App.EnvInfo.new':
                var $2062 = self.mouse_pos;
                var _coord$5 = App$Kaelin$Coord$to_axial$($2062);
                var self = App$Kaelin$Draw$support$centralize$(_coord$5);
                switch (self._) {
                    case 'Pair.new':
                        var $2064 = self.fst;
                        var $2065 = self.snd;
                        var $2066 = VoxBox$Draw$image$($2064, $2065, 0, App$Kaelin$Assets$tile$mouse_ui, _img$2);
                        var $2063 = $2066;
                        break;
                };
                var $2061 = $2063;
                break;
        };
        return $2061;
    };
    const App$Kaelin$Draw$state$mouse_ui = x0 => x1 => App$Kaelin$Draw$state$mouse_ui$(x0, x1);

    function App$Kaelin$Draw$map$(_img$1, _map_to_draw$2, _state$3) {
        var self = _state$3;
        switch (self._) {
            case 'App.Store.new':
                var $2068 = self.local;
                var $2069 = self.global;
                var self = $2068;
                switch (self._) {
                    case 'App.Kaelin.State.local.new':
                        var $2071 = self.cast_info;
                        var $2072 = self.env_info;
                        var $2073 = self.internal;
                        var self = $2069;
                        switch (self._) {
                            case 'App.Kaelin.State.global.new':
                                var _img$20 = App$Kaelin$Draw$state$map$(_map_to_draw$2, $2071, $2072, $2073, _img$1);
                                var _img$21 = App$Kaelin$Draw$state$mouse_ui$($2072, _img$20);
                                var $2075 = _img$21;
                                var $2074 = $2075;
                                break;
                        };
                        var $2070 = $2074;
                        break;
                };
                var $2067 = $2070;
                break;
        };
        return $2067;
    };
    const App$Kaelin$Draw$map = x0 => x1 => x2 => App$Kaelin$Draw$map$(x0, x1, x2);

    function App$Kaelin$Map$find_players$(_map$1) {
        var _lmap$2 = NatMap$to_list$(_map$1);
        var _players$3 = List$nil;
        var _players$4 = (() => {
            var $2078 = _players$3;
            var $2079 = _lmap$2;
            let _players$5 = $2078;
            let _pair$4;
            while ($2079._ === 'List.cons') {
                _pair$4 = $2079.head;
                var self = _pair$4;
                switch (self._) {
                    case 'Pair.new':
                        var $2080 = self.fst;
                        var $2081 = $2080;
                        var _coord$6 = $2081;
                        break;
                };
                var self = _pair$4;
                switch (self._) {
                    case 'Pair.new':
                        var $2082 = self.snd;
                        var $2083 = $2082;
                        var _tile$7 = $2083;
                        break;
                };
                var _axial_coord$8 = App$Kaelin$Coord$Convert$nat_to_axial$(_coord$6);
                var _result$6 = Maybe$monad$((_m$bind$9 => _m$pure$10 => {
                    var $2084 = _m$bind$9;
                    return $2084;
                }))((() => {
                    var self = _tile$7;
                    switch (self._) {
                        case 'App.Kaelin.Tile.new':
                            var $2085 = self.creature;
                            var $2086 = $2085;
                            return $2086;
                    };
                })())((_creature$9 => {
                    var $2087 = Maybe$monad$((_m$bind$10 => _m$pure$11 => {
                        var $2088 = _m$bind$10;
                        return $2088;
                    }))((() => {
                        var self = _creature$9;
                        switch (self._) {
                            case 'App.Kaelin.Creature.new':
                                var $2089 = self.player;
                                var $2090 = $2089;
                                return $2090;
                        };
                    })())((_player$10 => {
                        var $2091 = Maybe$monad$((_m$bind$11 => _m$pure$12 => {
                            var $2092 = _m$pure$12;
                            return $2092;
                        }))(List$cons$(Pair$new$(_player$10, _axial_coord$8), List$nil));
                        return $2091;
                    }));
                    return $2087;
                }));
                var $2078 = List$concat$(_players$5, Maybe$default$(_result$6, List$nil));
                _players$5 = $2078;
                $2079 = $2079.tail;
            }
            return _players$5;
        })();
        var $2076 = Map$from_list$(_players$4);
        return $2076;
    };
    const App$Kaelin$Map$find_players = x0 => App$Kaelin$Map$find_players$(x0);

    function App$Kaelin$Map$player$to_coord$(_address$1, _map$2) {
        var _players$3 = App$Kaelin$Map$find_players$(_map$2);
        var $2093 = Map$get$(_address$1, _players$3);
        return $2093;
    };
    const App$Kaelin$Map$player$to_coord = x0 => x1 => App$Kaelin$Map$player$to_coord$(x0, x1);

    function App$Kaelin$Map$player$info$(_address$1, _map$2) {
        var $2094 = Maybe$monad$((_m$bind$3 => _m$pure$4 => {
            var $2095 = _m$bind$3;
            return $2095;
        }))(App$Kaelin$Map$player$to_coord$(_address$1, _map$2))((_coord$3 => {
            var $2096 = Maybe$monad$((_m$bind$4 => _m$pure$5 => {
                var $2097 = _m$bind$4;
                return $2097;
            }))(App$Kaelin$Map$get$(_coord$3, _map$2))((_tile$4 => {
                var $2098 = Maybe$monad$((_m$bind$5 => _m$pure$6 => {
                    var $2099 = _m$bind$5;
                    return $2099;
                }))((() => {
                    var self = _tile$4;
                    switch (self._) {
                        case 'App.Kaelin.Tile.new':
                            var $2100 = self.creature;
                            var $2101 = $2100;
                            return $2101;
                    };
                })())((_creature$5 => {
                    var $2102 = Maybe$monad$((_m$bind$6 => _m$pure$7 => {
                        var $2103 = _m$pure$7;
                        return $2103;
                    }))(Pair$new$(_coord$3, _creature$5));
                    return $2102;
                }));
                return $2098;
            }));
            return $2096;
        }));
        return $2094;
    };
    const App$Kaelin$Map$player$info = x0 => x1 => App$Kaelin$Map$player$info$(x0, x1);

    function App$Kaelin$Skill$has_key$(_key$1, _skill$2) {
        var self = _skill$2;
        switch (self._) {
            case 'App.Kaelin.Skill.new':
                var $2105 = self.key;
                var $2106 = (_key$1 === $2105);
                var $2104 = $2106;
                break;
        };
        return $2104;
    };
    const App$Kaelin$Skill$has_key = x0 => x1 => App$Kaelin$Skill$has_key$(x0, x1);

    function App$Kaelin$Hero$skill$from_key$(_key$1, _hero$2) {
        var self = _hero$2;
        switch (self._) {
            case 'App.Kaelin.Hero.new':
                var $2108 = self.skills;
                var $2109 = List$find$(App$Kaelin$Skill$has_key(_key$1), $2108);
                var $2107 = $2109;
                break;
        };
        return $2107;
    };
    const App$Kaelin$Hero$skill$from_key = x0 => x1 => App$Kaelin$Hero$skill$from_key$(x0, x1);

    function App$Kaelin$Coord$show$(_coord$1) {
        var self = _coord$1;
        switch (self._) {
            case 'App.Kaelin.Coord.new':
                var $2111 = self.i;
                var $2112 = self.j;
                var $2113 = (I32$show$($2111) + (":" + I32$show$($2112)));
                var $2110 = $2113;
                break;
        };
        return $2110;
    };
    const App$Kaelin$Coord$show = x0 => App$Kaelin$Coord$show$(x0);

    function U8$to_bits$(_a$1) {
        var self = _a$1;
        switch ('u8') {
            case 'u8':
                var $2115 = u8_to_word(self);
                var $2116 = Word$to_bits$($2115);
                var $2114 = $2116;
                break;
        };
        return $2114;
    };
    const U8$to_bits = x0 => U8$to_bits$(x0);

    function List$zip$(_as$3, _bs$4) {
        var self = _as$3;
        switch (self._) {
            case 'List.cons':
                var $2118 = self.head;
                var $2119 = self.tail;
                var self = _bs$4;
                switch (self._) {
                    case 'List.cons':
                        var $2121 = self.head;
                        var $2122 = self.tail;
                        var $2123 = List$cons$(Pair$new$($2118, $2121), List$zip$($2119, $2122));
                        var $2120 = $2123;
                        break;
                    case 'List.nil':
                        var $2124 = List$nil;
                        var $2120 = $2124;
                        break;
                };
                var $2117 = $2120;
                break;
            case 'List.nil':
                var $2125 = List$nil;
                var $2117 = $2125;
                break;
        };
        return $2117;
    };
    const List$zip = x0 => x1 => List$zip$(x0, x1);
    const Nat$to_u8 = a0 => (Number(a0) & 0xFF);
    const App$Kaelin$Event$Code$action = List$cons$(2, List$nil);

    function String$repeat$(_xs$1, _n$2) {
        var self = _n$2;
        if (self === 0n) {
            var $2127 = String$nil;
            var $2126 = $2127;
        } else {
            var $2128 = (self - 1n);
            var $2129 = (_xs$1 + String$repeat$(_xs$1, $2128));
            var $2126 = $2129;
        };
        return $2126;
    };
    const String$repeat = x0 => x1 => String$repeat$(x0, x1);

    function App$Kaelin$Event$Code$Hex$set_min_length$(_min$1, _hex$2) {
        var _dif$3 = (_min$1 - String$length$(_hex$2) <= 0n ? 0n : _min$1 - String$length$(_hex$2));
        var $2130 = (_hex$2 + String$repeat$("0", _dif$3));
        return $2130;
    };
    const App$Kaelin$Event$Code$Hex$set_min_length = x0 => x1 => App$Kaelin$Event$Code$Hex$set_min_length$(x0, x1);

    function App$Kaelin$Event$Code$Hex$format_hex$(_min$1, _hex$2) {
        var _dif$3 = (_min$1 - String$length$(_hex$2) <= 0n ? 0n : _min$1 - String$length$(_hex$2));
        var self = (String$length$(_hex$2) < _min$1);
        if (self) {
            var $2132 = (String$repeat$("0", _dif$3) + _hex$2);
            var $2131 = $2132;
        } else {
            var $2133 = _hex$2;
            var $2131 = $2133;
        };
        return $2131;
    };
    const App$Kaelin$Event$Code$Hex$format_hex = x0 => x1 => App$Kaelin$Event$Code$Hex$format_hex$(x0, x1);

    function Bits$chunks_of$go$(_len$1, _bits$2, _need$3, _chunk$4) {
        var self = _bits$2;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'o':
                var $2135 = self.slice(0, -1);
                var self = _need$3;
                if (self === 0n) {
                    var _head$6 = Bits$reverse$(_chunk$4);
                    var _tail$7 = Bits$chunks_of$go$(_len$1, _bits$2, _len$1, Bits$e);
                    var $2137 = List$cons$(_head$6, _tail$7);
                    var $2136 = $2137;
                } else {
                    var $2138 = (self - 1n);
                    var _chunk$7 = (_chunk$4 + '0');
                    var $2139 = Bits$chunks_of$go$(_len$1, $2135, $2138, _chunk$7);
                    var $2136 = $2139;
                };
                var $2134 = $2136;
                break;
            case 'i':
                var $2140 = self.slice(0, -1);
                var self = _need$3;
                if (self === 0n) {
                    var _head$6 = Bits$reverse$(_chunk$4);
                    var _tail$7 = Bits$chunks_of$go$(_len$1, _bits$2, _len$1, Bits$e);
                    var $2142 = List$cons$(_head$6, _tail$7);
                    var $2141 = $2142;
                } else {
                    var $2143 = (self - 1n);
                    var _chunk$7 = (_chunk$4 + '1');
                    var $2144 = Bits$chunks_of$go$(_len$1, $2140, $2143, _chunk$7);
                    var $2141 = $2144;
                };
                var $2134 = $2141;
                break;
            case 'e':
                var $2145 = List$cons$(Bits$reverse$(_chunk$4), List$nil);
                var $2134 = $2145;
                break;
        };
        return $2134;
    };
    const Bits$chunks_of$go = x0 => x1 => x2 => x3 => Bits$chunks_of$go$(x0, x1, x2, x3);

    function Bits$chunks_of$(_len$1, _bits$2) {
        var $2146 = Bits$chunks_of$go$(_len$1, _bits$2, _len$1, Bits$e);
        return $2146;
    };
    const Bits$chunks_of = x0 => x1 => Bits$chunks_of$(x0, x1);

    function Function$flip$(_f$4, _y$5, _x$6) {
        var $2147 = _f$4(_x$6)(_y$5);
        return $2147;
    };
    const Function$flip = x0 => x1 => x2 => Function$flip$(x0, x1, x2);

    function Bits$to_hex_string$(_x$1) {
        var _hex_to_string$2 = (_x$2 => {
            var self = (Bits$to_nat$(_x$2) === 0n);
            if (self) {
                var $2150 = "0";
                var $2149 = $2150;
            } else {
                var self = (Bits$to_nat$(_x$2) === 1n);
                if (self) {
                    var $2152 = "1";
                    var $2151 = $2152;
                } else {
                    var self = (Bits$to_nat$(_x$2) === 2n);
                    if (self) {
                        var $2154 = "2";
                        var $2153 = $2154;
                    } else {
                        var self = (Bits$to_nat$(_x$2) === 3n);
                        if (self) {
                            var $2156 = "3";
                            var $2155 = $2156;
                        } else {
                            var self = (Bits$to_nat$(_x$2) === 4n);
                            if (self) {
                                var $2158 = "4";
                                var $2157 = $2158;
                            } else {
                                var self = (Bits$to_nat$(_x$2) === 5n);
                                if (self) {
                                    var $2160 = "5";
                                    var $2159 = $2160;
                                } else {
                                    var self = (Bits$to_nat$(_x$2) === 6n);
                                    if (self) {
                                        var $2162 = "6";
                                        var $2161 = $2162;
                                    } else {
                                        var self = (Bits$to_nat$(_x$2) === 7n);
                                        if (self) {
                                            var $2164 = "7";
                                            var $2163 = $2164;
                                        } else {
                                            var self = (Bits$to_nat$(_x$2) === 8n);
                                            if (self) {
                                                var $2166 = "8";
                                                var $2165 = $2166;
                                            } else {
                                                var self = (Bits$to_nat$(_x$2) === 9n);
                                                if (self) {
                                                    var $2168 = "9";
                                                    var $2167 = $2168;
                                                } else {
                                                    var self = (Bits$to_nat$(_x$2) === 10n);
                                                    if (self) {
                                                        var $2170 = "a";
                                                        var $2169 = $2170;
                                                    } else {
                                                        var self = (Bits$to_nat$(_x$2) === 11n);
                                                        if (self) {
                                                            var $2172 = "b";
                                                            var $2171 = $2172;
                                                        } else {
                                                            var self = (Bits$to_nat$(_x$2) === 12n);
                                                            if (self) {
                                                                var $2174 = "c";
                                                                var $2173 = $2174;
                                                            } else {
                                                                var self = (Bits$to_nat$(_x$2) === 13n);
                                                                if (self) {
                                                                    var $2176 = "d";
                                                                    var $2175 = $2176;
                                                                } else {
                                                                    var self = (Bits$to_nat$(_x$2) === 14n);
                                                                    if (self) {
                                                                        var $2178 = "e";
                                                                        var $2177 = $2178;
                                                                    } else {
                                                                        var self = (Bits$to_nat$(_x$2) === 15n);
                                                                        if (self) {
                                                                            var $2180 = "f";
                                                                            var $2179 = $2180;
                                                                        } else {
                                                                            var $2181 = "?";
                                                                            var $2179 = $2181;
                                                                        };
                                                                        var $2177 = $2179;
                                                                    };
                                                                    var $2175 = $2177;
                                                                };
                                                                var $2173 = $2175;
                                                            };
                                                            var $2171 = $2173;
                                                        };
                                                        var $2169 = $2171;
                                                    };
                                                    var $2167 = $2169;
                                                };
                                                var $2165 = $2167;
                                            };
                                            var $2163 = $2165;
                                        };
                                        var $2161 = $2163;
                                    };
                                    var $2159 = $2161;
                                };
                                var $2157 = $2159;
                            };
                            var $2155 = $2157;
                        };
                        var $2153 = $2155;
                    };
                    var $2151 = $2153;
                };
                var $2149 = $2151;
            };
            return $2149;
        });
        var _ls$3 = Bits$chunks_of$(4n, _x$1);
        var $2148 = List$foldr$("", (_x$4 => {
            var $2182 = Function$flip(String$concat)(_hex_to_string$2(_x$4));
            return $2182;
        }), _ls$3);
        return $2148;
    };
    const Bits$to_hex_string = x0 => Bits$to_hex_string$(x0);

    function App$Kaelin$Event$Code$Hex$append$(_hex$1, _size$2, _x$3) {
        var _hex2$4 = App$Kaelin$Event$Code$Hex$format_hex$(_size$2, Bits$to_hex_string$(_x$3));
        var $2183 = (_hex$1 + _hex2$4);
        return $2183;
    };
    const App$Kaelin$Event$Code$Hex$append = x0 => x1 => x2 => App$Kaelin$Event$Code$Hex$append$(x0, x1, x2);
    const U8$to_nat = a0 => (BigInt(a0));

    function App$Kaelin$Event$Code$generate_hex$(_xs$1) {
        var $2184 = List$foldr$("", (_x$2 => _y$3 => {
            var $2185 = App$Kaelin$Event$Code$Hex$append$(_y$3, (BigInt(Pair$fst$(_x$2))), Pair$snd$(_x$2));
            return $2185;
        }), List$reverse$(_xs$1));
        return $2184;
    };
    const App$Kaelin$Event$Code$generate_hex = x0 => App$Kaelin$Event$Code$generate_hex$(x0);

    function generate_hex$(_xs$1, _ys$2) {
        var _consumer$3 = List$zip$(List$concat$(App$Kaelin$Event$Code$action, _xs$1), _ys$2);
        var $2186 = ("0x" + App$Kaelin$Event$Code$Hex$set_min_length$(64n, App$Kaelin$Event$Code$generate_hex$(_consumer$3)));
        return $2186;
    };
    const generate_hex = x0 => x1 => generate_hex$(x0, x1);
    const App$Kaelin$Event$Code$create_hero = List$cons$(2, List$nil);

    function Hex_to_nat$parser$(_pst$1) {
        var self = _pst$1;
        switch (self._) {
            case 'Parser.State.new':
                var $2188 = self.err;
                var _reply$7 = Parser$maybe$(Parser$text("0x"), _pst$1);
                var self = _reply$7;
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $2190 = self.err;
                        var self = $2188;
                        switch (self._) {
                            case 'Maybe.some':
                                var $2192 = self.value;
                                var $2193 = Parser$Reply$error$(Parser$Error$combine$($2192, $2190));
                                var $2191 = $2193;
                                break;
                            case 'Maybe.none':
                                var $2194 = Parser$Reply$error$($2190);
                                var $2191 = $2194;
                                break;
                        };
                        var $2189 = $2191;
                        break;
                    case 'Parser.Reply.value':
                        var $2195 = self.pst;
                        var self = $2195;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $2197 = self.err;
                                var $2198 = self.nam;
                                var $2199 = self.ini;
                                var $2200 = self.idx;
                                var $2201 = self.str;
                                var _reply$pst$15 = Parser$State$new$(Parser$Error$maybe_combine$($2188, $2197), $2198, $2199, $2200, $2201);
                                var self = _reply$pst$15;
                                switch (self._) {
                                    case 'Parser.State.new':
                                        var $2203 = self.err;
                                        var _reply$21 = Parser$many1$(Parser$hex_digit, _reply$pst$15);
                                        var self = _reply$21;
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $2205 = self.err;
                                                var self = $2203;
                                                switch (self._) {
                                                    case 'Maybe.some':
                                                        var $2207 = self.value;
                                                        var $2208 = Parser$Reply$error$(Parser$Error$combine$($2207, $2205));
                                                        var $2206 = $2208;
                                                        break;
                                                    case 'Maybe.none':
                                                        var $2209 = Parser$Reply$error$($2205);
                                                        var $2206 = $2209;
                                                        break;
                                                };
                                                var $2204 = $2206;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $2210 = self.pst;
                                                var $2211 = self.val;
                                                var self = $2210;
                                                switch (self._) {
                                                    case 'Parser.State.new':
                                                        var $2213 = self.err;
                                                        var $2214 = self.nam;
                                                        var $2215 = self.ini;
                                                        var $2216 = self.idx;
                                                        var $2217 = self.str;
                                                        var _reply$pst$29 = Parser$State$new$(Parser$Error$maybe_combine$($2203, $2213), $2214, $2215, $2216, $2217);
                                                        var $2218 = Parser$Reply$value$(_reply$pst$29, Nat$from_base$(16n, $2211));
                                                        var $2212 = $2218;
                                                        break;
                                                };
                                                var $2204 = $2212;
                                                break;
                                        };
                                        var $2202 = $2204;
                                        break;
                                };
                                var $2196 = $2202;
                                break;
                        };
                        var $2189 = $2196;
                        break;
                };
                var $2187 = $2189;
                break;
        };
        return $2187;
    };
    const Hex_to_nat$parser = x0 => Hex_to_nat$parser$(x0);

    function App$Kaelin$Event$Code$Hex$to_nat$(_x$1) {
        var self = Parser$run$(Hex_to_nat$parser, _x$1);
        switch (self._) {
            case 'Maybe.some':
                var $2220 = self.value;
                var $2221 = $2220;
                var $2219 = $2221;
                break;
            case 'Maybe.none':
                var $2222 = 0n;
                var $2219 = $2222;
                break;
        };
        return $2219;
    };
    const App$Kaelin$Event$Code$Hex$to_nat = x0 => App$Kaelin$Event$Code$Hex$to_nat$(x0);

    function App$Kaelin$Resources$Action$to_bits$(_x$1) {
        var self = _x$1;
        switch (self._) {
            case 'App.Kaelin.Action.walk':
                var $2224 = 0n;
                var _n$2 = $2224;
                break;
            case 'App.Kaelin.Action.ability_0':
                var $2225 = 1n;
                var _n$2 = $2225;
                break;
            case 'App.Kaelin.Action.ability_1':
                var $2226 = 2n;
                var _n$2 = $2226;
                break;
        };
        var $2223 = (nat_to_bits(_n$2));
        return $2223;
    };
    const App$Kaelin$Resources$Action$to_bits = x0 => App$Kaelin$Resources$Action$to_bits$(x0);

    function App$Kaelin$Coord$Convert$axial_to_bits$(_x$1) {
        var _unique_nat$2 = App$Kaelin$Coord$Convert$axial_to_nat$(_x$1);
        var $2227 = (nat_to_bits(_unique_nat$2));
        return $2227;
    };
    const App$Kaelin$Coord$Convert$axial_to_bits = x0 => App$Kaelin$Coord$Convert$axial_to_bits$(x0);
    const App$Kaelin$Event$Code$user_input = List$cons$(40, List$cons$(2, List$cons$(8, List$nil)));
    const App$Kaelin$Event$Code$exe_skill = List$cons$(40, List$cons$(8, List$cons$(4, List$nil)));

    function App$Kaelin$Team$code$(_team$1) {
        var self = _team$1;
        switch (self._) {
            case 'App.Kaelin.Team.red':
                var $2229 = 1;
                var $2228 = $2229;
                break;
            case 'App.Kaelin.Team.blue':
                var $2230 = 2;
                var $2228 = $2230;
                break;
            case 'App.Kaelin.Team.neutral':
                var $2231 = 0;
                var $2228 = $2231;
                break;
        };
        return $2228;
    };
    const App$Kaelin$Team$code = x0 => App$Kaelin$Team$code$(x0);
    const App$Kaelin$Event$Code$save_skill = List$cons$(40, List$cons$(8, List$cons$(4, List$cons$(2, List$nil))));
    const App$Kaelin$Event$Code$remove_skill = List$cons$(40, List$cons$(8, List$cons$(4, List$nil)));
    const App$Kaelin$Event$Code$draft_hero = List$cons$(2, List$nil);
    const App$Kaelin$Event$Code$draft_coord = List$cons$(8, List$nil);
    const App$Kaelin$Event$Code$draft_team = List$cons$(2, List$nil);
    const Debug$log = a0 => a1 => ((console.log(a0), a1()));
    const App$Kaelin$Event$Code$draft_ready = List$cons$(2, List$nil);

    function App$Kaelin$Event$serialize$(_event$1) {
        var self = _event$1;
        switch (self._) {
            case 'App.Kaelin.Event.create_hero':
                var $2233 = self.hero_id;
                var _cod$3 = List$cons$((nat_to_bits(1n)), List$cons$(U8$to_bits$($2233), List$nil));
                var $2234 = generate_hex$(App$Kaelin$Event$Code$create_hero, _cod$3);
                var $2232 = $2234;
                break;
            case 'App.Kaelin.Event.user_input':
                var $2235 = self.player;
                var $2236 = self.coord;
                var $2237 = self.action;
                var _cod$5 = List$cons$((nat_to_bits(4n)), List$cons$((nat_to_bits(App$Kaelin$Event$Code$Hex$to_nat$($2235))), List$cons$(App$Kaelin$Resources$Action$to_bits$($2237), List$cons$(App$Kaelin$Coord$Convert$axial_to_bits$($2236), List$nil))));
                var $2238 = generate_hex$(App$Kaelin$Event$Code$user_input, _cod$5);
                var $2232 = $2238;
                break;
            case 'App.Kaelin.Event.exe_skill':
                var $2239 = self.player;
                var $2240 = self.target_pos;
                var $2241 = self.key;
                var _cod$5 = List$cons$((nat_to_bits(5n)), List$cons$((nat_to_bits(App$Kaelin$Event$Code$Hex$to_nat$($2239))), List$cons$(App$Kaelin$Coord$Convert$axial_to_bits$($2240), List$cons$((u16_to_bits($2241)), List$nil))));
                var $2242 = generate_hex$(App$Kaelin$Event$Code$exe_skill, _cod$5);
                var $2232 = $2242;
                break;
            case 'App.Kaelin.Event.save_skill':
                var $2243 = self.player;
                var $2244 = self.target_pos;
                var $2245 = self.key;
                var $2246 = self.team;
                var _cod$6 = List$cons$((nat_to_bits(11n)), List$cons$((nat_to_bits(App$Kaelin$Event$Code$Hex$to_nat$($2243))), List$cons$(App$Kaelin$Coord$Convert$axial_to_bits$($2244), List$cons$((u16_to_bits($2245)), List$cons$(U8$to_bits$(App$Kaelin$Team$code$($2246)), List$nil)))));
                var $2247 = generate_hex$(App$Kaelin$Event$Code$save_skill, _cod$6);
                var $2232 = $2247;
                break;
            case 'App.Kaelin.Event.remove_skill':
                var $2248 = self.player;
                var $2249 = self.target_pos;
                var $2250 = self.key;
                var $2251 = self.team;
                var _cod$6 = List$cons$((nat_to_bits(12n)), List$cons$((nat_to_bits(App$Kaelin$Event$Code$Hex$to_nat$($2248))), List$cons$(App$Kaelin$Coord$Convert$axial_to_bits$($2249), List$cons$((u16_to_bits($2250)), List$cons$(U8$to_bits$(App$Kaelin$Team$code$($2251)), List$nil)))));
                var $2252 = generate_hex$(App$Kaelin$Event$Code$remove_skill, _cod$6);
                var $2232 = $2252;
                break;
            case 'App.Kaelin.Event.draft_hero':
                var $2253 = self.hero;
                var _cod$3 = List$cons$((nat_to_bits(6n)), List$cons$(U8$to_bits$($2253), List$nil));
                var $2254 = generate_hex$(App$Kaelin$Event$Code$draft_hero, _cod$3);
                var $2232 = $2254;
                break;
            case 'App.Kaelin.Event.draft_coord':
                var $2255 = self.coord;
                var _cod$3 = List$cons$((nat_to_bits(7n)), List$cons$(App$Kaelin$Coord$Convert$axial_to_bits$($2255), List$nil));
                var $2256 = generate_hex$(App$Kaelin$Event$Code$draft_coord, _cod$3);
                var $2232 = $2256;
                break;
            case 'App.Kaelin.Event.draft_team':
                var $2257 = self.team;
                var _cod$3 = List$cons$((nat_to_bits(10n)), List$cons$(U8$to_bits$($2257), List$nil));
                var $2258 = generate_hex$(App$Kaelin$Event$Code$draft_team, _cod$3);
                var $2232 = $2258;
                break;
            case 'App.Kaelin.Event.draft_ready':
                var $2259 = self.ready;
                var $2260 = ((console.log("serialize ready"), (_$3 => {
                    var _cod$4 = List$cons$((nat_to_bits(14n)), List$cons$(U8$to_bits$($2259), List$nil));
                    var $2261 = generate_hex$(App$Kaelin$Event$Code$draft_ready, _cod$4);
                    return $2261;
                })()));
                var $2232 = $2260;
                break;
            case 'App.Kaelin.Event.start_game':
            case 'App.Kaelin.Event.create_user':
                var $2262 = "";
                var $2232 = $2262;
                break;
            case 'App.Kaelin.Event.end_action':
                var _cod$2 = List$cons$((nat_to_bits(13n)), List$nil);
                var $2263 = generate_hex$(List$nil, _cod$2);
                var $2232 = $2263;
                break;
            case 'App.Kaelin.Event.to_draft':
                var _cod$2 = List$cons$((nat_to_bits(9n)), List$nil);
                var $2264 = generate_hex$(List$nil, _cod$2);
                var $2232 = $2264;
                break;
            case 'App.Kaelin.Event.control_map':
                var _cod$2 = List$cons$((nat_to_bits(15n)), List$nil);
                var $2265 = generate_hex$(List$nil, _cod$2);
                var $2232 = $2265;
                break;
        };
        return $2232;
    };
    const App$Kaelin$Event$serialize = x0 => App$Kaelin$Event$serialize$(x0);

    function App$Kaelin$Event$remove_skill$(_player$1, _target_pos$2, _key$3, _team$4) {
        var $2266 = ({
            _: 'App.Kaelin.Event.remove_skill',
            'player': _player$1,
            'target_pos': _target_pos$2,
            'key': _key$3,
            'team': _team$4
        });
        return $2266;
    };
    const App$Kaelin$Event$remove_skill = x0 => x1 => x2 => x3 => App$Kaelin$Event$remove_skill$(x0, x1, x2, x3);

    function remove_button$(_cast$1) {
        var $2267 = DOM$node$("button", Map$from_list$(List$cons$(Pair$new$("id", App$Kaelin$Event$serialize$(App$Kaelin$Event$remove_skill$((() => {
            var self = _cast$1;
            switch (self._) {
                case 'App.Kaelin.CastInfo.global.new':
                    var $2268 = self.player;
                    var $2269 = $2268;
                    return $2269;
            };
        })(), (() => {
            var self = _cast$1;
            switch (self._) {
                case 'App.Kaelin.CastInfo.global.new':
                    var $2270 = self.target_pos;
                    var $2271 = $2270;
                    return $2271;
            };
        })(), (() => {
            var self = _cast$1;
            switch (self._) {
                case 'App.Kaelin.CastInfo.global.new':
                    var $2272 = self.key;
                    var $2273 = $2272;
                    return $2273;
            };
        })(), (() => {
            var self = _cast$1;
            switch (self._) {
                case 'App.Kaelin.CastInfo.global.new':
                    var $2274 = self.team;
                    var $2275 = $2274;
                    return $2275;
            };
        })()))), List$nil)), Map$from_list$(List$cons$(Pair$new$("padding", "5px 10px"), List$cons$(Pair$new$("background-color", "red"), List$cons$(Pair$new$("font-weight", "bold"), List$cons$(Pair$new$("color", "white"), List$cons$(Pair$new$("border", "none"), List$cons$(Pair$new$("border-radius", "5px"), List$cons$(Pair$new$("box-shadow", "0 0 3px black"), List$cons$(Pair$new$("cursor", "pointer"), List$nil))))))))), List$cons$(DOM$text$("X"), List$nil));
        return $2267;
    };
    const remove_button = x0 => remove_button$(x0);

    function App$Kaelin$Draw$game$skill_list$(_local_player$1, _local_team$2, _map$3, _is_planning$4, _cast$5) {
        var _result$6 = Maybe$monad$((_m$bind$6 => _m$pure$7 => {
            var $2277 = _m$bind$6;
            return $2277;
        }))(App$Kaelin$Map$player$info$((() => {
            var self = _cast$5;
            switch (self._) {
                case 'App.Kaelin.CastInfo.global.new':
                    var $2278 = self.player;
                    var $2279 = $2278;
                    return $2279;
            };
        })(), _map$3))((_info$6 => {
            var self = _info$6;
            switch (self._) {
                case 'Pair.new':
                    var $2281 = self.snd;
                    var $2282 = $2281;
                    var _creature$7 = $2282;
                    break;
            };
            var $2280 = Maybe$monad$((_m$bind$8 => _m$pure$9 => {
                var $2283 = _m$bind$8;
                return $2283;
            }))(App$Kaelin$Hero$skill$from_key$((() => {
                var self = _cast$5;
                switch (self._) {
                    case 'App.Kaelin.CastInfo.global.new':
                        var $2284 = self.key;
                        var $2285 = $2284;
                        return $2285;
                };
            })(), (() => {
                var self = _creature$7;
                switch (self._) {
                    case 'App.Kaelin.Creature.new':
                        var $2286 = self.hero;
                        var $2287 = $2286;
                        return $2287;
                };
            })()))((_skill$8 => {
                var _coord$9 = App$Kaelin$Coord$show$((() => {
                    var self = _cast$5;
                    switch (self._) {
                        case 'App.Kaelin.CastInfo.global.new':
                            var $2289 = self.target_pos;
                            var $2290 = $2289;
                            return $2290;
                    };
                })());
                var _is_local_player$10 = (_local_player$1 === (() => {
                    var self = _cast$5;
                    switch (self._) {
                        case 'App.Kaelin.CastInfo.global.new':
                            var $2291 = self.player;
                            var $2292 = $2291;
                            return $2292;
                    };
                })());
                var self = (_is_planning$4 && _is_local_player$10);
                if (self) {
                    var $2293 = remove_button$(_cast$5);
                    var _button$11 = $2293;
                } else {
                    var $2294 = DOM$text$("");
                    var _button$11 = $2294;
                };
                var self = _is_local_player$10;
                if (self) {
                    var $2295 = "You";
                    var _who_casted$12 = $2295;
                } else {
                    var $2296 = "Ally";
                    var _who_casted$12 = $2296;
                };
                var $2288 = Maybe$monad$((_m$bind$13 => _m$pure$14 => {
                    var $2297 = _m$pure$14;
                    return $2297;
                }))(DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("align-items", "center"), List$cons$(Pair$new$("margin-bottom", "5px"), List$nil)))), List$cons$(DOM$node$("p", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("margin-right", "5px"), List$nil)), List$cons$(DOM$text$((_who_casted$12 + (" casted " + ((() => {
                    var self = _skill$8;
                    switch (self._) {
                        case 'App.Kaelin.Skill.new':
                            var $2298 = self.name;
                            var $2299 = $2298;
                            return $2299;
                    };
                })() + (" in " + _coord$9))))), List$nil)), List$cons$(_button$11, List$nil))));
                return $2288;
            }));
            return $2280;
        }));
        var _result$7 = Maybe$default$(_result$6, DOM$text$(""));
        var self = _is_planning$4;
        if (self) {
            var self = App$Kaelin$Team$eql$((() => {
                var self = _cast$5;
                switch (self._) {
                    case 'App.Kaelin.CastInfo.global.new':
                        var $2301 = self.team;
                        var $2302 = $2301;
                        return $2302;
                };
            })(), _local_team$2);
            if (self) {
                var $2303 = _result$7;
                var $2300 = $2303;
            } else {
                var $2304 = DOM$text$("");
                var $2300 = $2304;
            };
            var $2276 = $2300;
        } else {
            var $2305 = _result$7;
            var $2276 = $2305;
        };
        return $2276;
    };
    const App$Kaelin$Draw$game$skill_list = x0 => x1 => x2 => x3 => x4 => App$Kaelin$Draw$game$skill_list$(x0, x1, x2, x3, x4);

    function App$Kaelin$Draw$game$(_img$1, _state$2) {
        var self = _state$2;
        switch (self._) {
            case 'App.Store.new':
                var $2307 = self.local;
                var $2308 = self.global;
                var self = $2308;
                switch (self._) {
                    case 'App.Kaelin.State.global.new':
                        var $2310 = self.round;
                        var $2311 = self.map;
                        var $2312 = self.stage;
                        var $2313 = self.skills_list;
                        var self = $2307;
                        switch (self._) {
                            case 'App.Kaelin.State.local.new':
                                var $2315 = self.user;
                                var $2316 = self.team;
                                var self = $2312;
                                switch (self._) {
                                    case 'App.Kaelin.Stage.planning':
                                        var $2318 = self.seconds;
                                        var $2319 = Maybe$some$($2318);
                                        var _seconds$19 = $2319;
                                        break;
                                    case 'App.Kaelin.Stage.init':
                                    case 'App.Kaelin.Stage.draft':
                                    case 'App.Kaelin.Stage.action':
                                        var $2320 = Maybe$none;
                                        var _seconds$19 = $2320;
                                        break;
                                };
                                var self = $2312;
                                switch (self._) {
                                    case 'App.Kaelin.Stage.init':
                                    case 'App.Kaelin.Stage.draft':
                                    case 'App.Kaelin.Stage.action':
                                        var $2321 = Bool$false;
                                        var _is_planning$20 = $2321;
                                        break;
                                    case 'App.Kaelin.Stage.planning':
                                        var $2322 = Bool$true;
                                        var _is_planning$20 = $2322;
                                        break;
                                };
                                var _map_to_draw$21 = App$Kaelin$Stage$get_map$(_state$2);
                                var $2317 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("width", "100vw"), List$cons$(Pair$new$("height", "100vh"), List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("flex-direction", "column"), List$cons$(Pair$new$("justify-content", "center"), List$cons$(Pair$new$("align-items", "center"), List$cons$(Pair$new$("position", "relative"), List$nil)))))))), List$cons$(DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("margin-bottom", "10px"), List$nil)), App$Kaelin$Draw$game$round$(_seconds$19, $2310)), List$cons$(DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$nil), List$cons$(DOM$vbox$(Map$from_list$(List$cons$(Pair$new$("width", "512"), List$nil)), Map$from_list$(List$cons$(Pair$new$("border", "none"), List$cons$(Pair$new$("image-rendering", "pixelated"), List$nil))), App$Kaelin$Draw$map$(_img$1, _map_to_draw$21, _state$2)), List$nil)), List$cons$(DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$cons$(Pair$new$("position", "absolute"), List$cons$(Pair$new$("bottom", "0px"), List$cons$(Pair$new$("right", "0px"), List$cons$(Pair$new$("margin", "15px"), List$cons$(Pair$new$("display", "flex"), List$cons$(Pair$new$("flex-direction", "column-reverse"), List$nil))))))), List$map$(App$Kaelin$Draw$game$skill_list($2315)($2316)($2311)(_is_planning$20), $2313)), List$nil))));
                                var $2314 = $2317;
                                break;
                        };
                        var $2309 = $2314;
                        break;
                };
                var $2306 = $2309;
                break;
        };
        return $2306;
    };
    const App$Kaelin$Draw$game = x0 => x1 => App$Kaelin$Draw$game$(x0, x1);

    function App$Kaelin$App$draw$(_img$1, _state$2) {
        var self = _state$2;
        switch (self._) {
            case 'App.Store.new':
                var $2324 = self.local;
                var $2325 = self.global;
                var self = $2325;
                switch (self._) {
                    case 'App.Kaelin.State.global.new':
                        var $2327 = self.stage;
                        var $2328 = $2327;
                        var _stage$5 = $2328;
                        break;
                };
                var self = _stage$5;
                switch (self._) {
                    case 'App.Kaelin.Stage.init':
                        var $2329 = App$Kaelin$Draw$init$((() => {
                            var self = $2324;
                            switch (self._) {
                                case 'App.Kaelin.State.local.new':
                                    var $2330 = self.input;
                                    var $2331 = $2330;
                                    return $2331;
                            };
                        })());
                        var $2326 = $2329;
                        break;
                    case 'App.Kaelin.Stage.draft':
                        var $2332 = App$Kaelin$Draw$draft$(_state$2);
                        var $2326 = $2332;
                        break;
                    case 'App.Kaelin.Stage.planning':
                    case 'App.Kaelin.Stage.action':
                        var $2333 = App$Kaelin$Draw$game$(_img$1, _state$2);
                        var $2326 = $2333;
                        break;
                };
                var $2323 = $2326;
                break;
        };
        return $2323;
    };
    const App$Kaelin$App$draw = x0 => x1 => App$Kaelin$App$draw$(x0, x1);

    function IO$(_A$1) {
        var $2334 = null;
        return $2334;
    };
    const IO = x0 => IO$(x0);

    function String$map$(_f$1, _as$2) {
        var self = _as$2;
        if (self.length === 0) {
            var $2336 = String$nil;
            var $2335 = $2336;
        } else {
            var $2337 = self.charCodeAt(0);
            var $2338 = self.slice(1);
            var $2339 = String$cons$(_f$1($2337), String$map$(_f$1, $2338));
            var $2335 = $2339;
        };
        return $2335;
    };
    const String$map = x0 => x1 => String$map$(x0, x1);
    const U16$gte = a0 => a1 => (a0 >= a1);
    const U16$lte = a0 => a1 => (a0 <= a1);
    const U16$add = a0 => a1 => ((a0 + a1) & 0xFFFF);

    function Char$to_lower$(_char$1) {
        var self = ((_char$1 >= 65) && (_char$1 <= 90));
        if (self) {
            var $2341 = ((_char$1 + 32) & 0xFFFF);
            var $2340 = $2341;
        } else {
            var $2342 = _char$1;
            var $2340 = $2342;
        };
        return $2340;
    };
    const Char$to_lower = x0 => Char$to_lower$(x0);

    function String$to_lower$(_str$1) {
        var $2343 = String$map$(Char$to_lower, _str$1);
        return $2343;
    };
    const String$to_lower = x0 => String$to_lower$(x0);

    function IO$ask$(_query$2, _param$3, _then$4) {
        var $2344 = ({
            _: 'IO.ask',
            'query': _query$2,
            'param': _param$3,
            'then': _then$4
        });
        return $2344;
    };
    const IO$ask = x0 => x1 => x2 => IO$ask$(x0, x1, x2);

    function IO$bind$(_a$3, _f$4) {
        var self = _a$3;
        switch (self._) {
            case 'IO.end':
                var $2346 = self.value;
                var $2347 = _f$4($2346);
                var $2345 = $2347;
                break;
            case 'IO.ask':
                var $2348 = self.query;
                var $2349 = self.param;
                var $2350 = self.then;
                var $2351 = IO$ask$($2348, $2349, (_x$8 => {
                    var $2352 = IO$bind$($2350(_x$8), _f$4);
                    return $2352;
                }));
                var $2345 = $2351;
                break;
        };
        return $2345;
    };
    const IO$bind = x0 => x1 => IO$bind$(x0, x1);

    function IO$end$(_value$2) {
        var $2353 = ({
            _: 'IO.end',
            'value': _value$2
        });
        return $2353;
    };
    const IO$end = x0 => IO$end$(x0);

    function IO$monad$(_new$2) {
        var $2354 = _new$2(IO$bind)(IO$end);
        return $2354;
    };
    const IO$monad = x0 => IO$monad$(x0);

    function App$set_local$(_value$2) {
        var $2355 = IO$monad$((_m$bind$3 => _m$pure$4 => {
            var $2356 = _m$pure$4;
            return $2356;
        }))(Maybe$some$(_value$2));
        return $2355;
    };
    const App$set_local = x0 => App$set_local$(x0);
    const App$pass = IO$monad$((_m$bind$2 => _m$pure$3 => {
        var $2357 = _m$pure$3;
        return $2357;
    }))(Maybe$none);
    const Nat$read = a0 => (BigInt(a0));
    const IO$get_time = IO$ask$("get_time", "", (_time$1 => {
        var $2358 = IO$end$((BigInt(_time$1)));
        return $2358;
    }));

    function Nat$random$(_seed$1) {
        var _m$2 = 1664525n;
        var _i$3 = 1013904223n;
        var _q$4 = 4294967296n;
        var $2359 = (((_seed$1 * _m$2) + _i$3) % _q$4);
        return $2359;
    };
    const Nat$random = x0 => Nat$random$(x0);

    function IO$random$(_a$1) {
        var $2360 = IO$monad$((_m$bind$2 => _m$pure$3 => {
            var $2361 = _m$bind$2;
            return $2361;
        }))(IO$get_time)((_seed$2 => {
            var _seed$3 = Nat$random$(_seed$2);
            var $2362 = IO$monad$((_m$bind$4 => _m$pure$5 => {
                var $2363 = _m$pure$5;
                return $2363;
            }))((_seed$3 % _a$1));
            return $2362;
        }));
        return $2360;
    };
    const IO$random = x0 => IO$random$(x0);

    function IO$do$(_call$1, _param$2) {
        var $2364 = IO$ask$(_call$1, _param$2, (_answer$3 => {
            var $2365 = IO$end$(Unit$new);
            return $2365;
        }));
        return $2364;
    };
    const IO$do = x0 => x1 => IO$do$(x0, x1);

    function App$do$(_call$2, _param$3) {
        var $2366 = IO$monad$((_m$bind$4 => _m$pure$5 => {
            var $2367 = _m$bind$4;
            return $2367;
        }))(IO$do$(_call$2, _param$3))((_$4 => {
            var $2368 = App$pass;
            return $2368;
        }));
        return $2366;
    };
    const App$do = x0 => x1 => App$do$(x0, x1);

    function App$watch$(_room$2) {
        var $2369 = App$do$("watch", _room$2);
        return $2369;
    };
    const App$watch = x0 => App$watch$(x0);

    function App$new_post$(_room$2, _data$3) {
        var $2370 = IO$monad$((_m$bind$4 => _m$pure$5 => {
            var $2371 = _m$bind$4;
            return $2371;
        }))(App$do$("post", (_room$2 + (";" + _data$3))))((_$4 => {
            var $2372 = App$pass;
            return $2372;
        }));
        return $2370;
    };
    const App$new_post = x0 => x1 => App$new_post$(x0, x1);
    const App$Kaelin$Event$to_draft = ({
        _: 'App.Kaelin.Event.to_draft'
    });

    function App$Kaelin$App$when$init$(_event$1, _state$2) {
        var self = _state$2;
        switch (self._) {
            case 'App.Store.new':
                var $2374 = self.local;
                var self = _event$1;
                switch (self._) {
                    case 'App.Event.init':
                        var $2376 = self.user;
                        var self = $2374;
                        switch (self._) {
                            case 'App.Kaelin.State.local.new':
                                var $2378 = self.input;
                                var $2379 = self.team;
                                var $2380 = self.local_map;
                                var $2381 = self.control_map;
                                var $2382 = self.cast_info;
                                var $2383 = self.env_info;
                                var $2384 = self.internal;
                                var $2385 = App$Kaelin$State$local$new$($2378, String$to_lower$($2376), $2379, $2380, $2381, $2382, $2383, $2384);
                                var _new_local$8 = $2385;
                                break;
                        };
                        var $2377 = App$set_local$(_new_local$8);
                        var $2375 = $2377;
                        break;
                    case 'App.Event.mouse_click':
                        var $2386 = self.id;
                        var self = ($2386 === "random");
                        if (self) {
                            var $2388 = IO$monad$((_m$bind$8 => _m$pure$9 => {
                                var $2389 = _m$bind$8;
                                return $2389;
                            }))(IO$random$(10000000000n))((_rnd$8 => {
                                var _str$9 = Nat$show$(_rnd$8);
                                var _room$10 = ("0x72214422" + String$drop$((String$length$(_str$9) - 6n <= 0n ? 0n : String$length$(_str$9) - 6n), _str$9));
                                var self = $2374;
                                switch (self._) {
                                    case 'App.Kaelin.State.local.new':
                                        var $2391 = self.user;
                                        var $2392 = self.team;
                                        var $2393 = self.local_map;
                                        var $2394 = self.control_map;
                                        var $2395 = self.cast_info;
                                        var $2396 = self.env_info;
                                        var $2397 = self.internal;
                                        var $2398 = App$Kaelin$State$local$new$(_room$10, $2391, $2392, $2393, $2394, $2395, $2396, $2397);
                                        var _new_local$11 = $2398;
                                        break;
                                };
                                var $2390 = App$set_local$(_new_local$11);
                                return $2390;
                            }));
                            var $2387 = $2388;
                        } else {
                            var self = ($2386 === "ready");
                            if (self) {
                                var $2400 = IO$monad$((_m$bind$8 => _m$pure$9 => {
                                    var $2401 = _m$bind$8;
                                    return $2401;
                                }))(App$watch$((() => {
                                    var self = $2374;
                                    switch (self._) {
                                        case 'App.Kaelin.State.local.new':
                                            var $2402 = self.input;
                                            var $2403 = $2402;
                                            return $2403;
                                    };
                                })()))((_$8 => {
                                    var $2404 = App$new_post$((() => {
                                        var self = $2374;
                                        switch (self._) {
                                            case 'App.Kaelin.State.local.new':
                                                var $2405 = self.input;
                                                var $2406 = $2405;
                                                return $2406;
                                        };
                                    })(), App$Kaelin$Event$serialize$(App$Kaelin$Event$to_draft));
                                    return $2404;
                                }));
                                var $2399 = $2400;
                            } else {
                                var $2407 = App$pass;
                                var $2399 = $2407;
                            };
                            var $2387 = $2399;
                        };
                        var $2375 = $2387;
                        break;
                    case 'App.Event.input':
                        var $2408 = self.text;
                        var self = $2374;
                        switch (self._) {
                            case 'App.Kaelin.State.local.new':
                                var $2410 = self.user;
                                var $2411 = self.team;
                                var $2412 = self.local_map;
                                var $2413 = self.control_map;
                                var $2414 = self.cast_info;
                                var $2415 = self.env_info;
                                var $2416 = self.internal;
                                var $2417 = App$Kaelin$State$local$new$($2408, $2410, $2411, $2412, $2413, $2414, $2415, $2416);
                                var _new_local$8 = $2417;
                                break;
                        };
                        var $2409 = App$set_local$(_new_local$8);
                        var $2375 = $2409;
                        break;
                    case 'App.Event.frame':
                    case 'App.Event.mouse_down':
                    case 'App.Event.mouse_up':
                    case 'App.Event.key_down':
                    case 'App.Event.key_up':
                    case 'App.Event.mouse_over':
                        var $2418 = App$pass;
                        var $2375 = $2418;
                        break;
                };
                var $2373 = $2375;
                break;
        };
        return $2373;
    };
    const App$Kaelin$App$when$init = x0 => x1 => App$Kaelin$App$when$init$(x0, x1);

    function App$Kaelin$Event$draft_coord$(_coord$1) {
        var $2419 = ({
            _: 'App.Kaelin.Event.draft_coord',
            'coord': _coord$1
        });
        return $2419;
    };
    const App$Kaelin$Event$draft_coord = x0 => App$Kaelin$Event$draft_coord$(x0);
    const U8$add = a0 => a1 => ((a0 + a1) & 0xFF);

    function App$Kaelin$Hero$info$map_go$(_id$1, _map$2) {
        var App$Kaelin$Hero$info$map_go$ = (_id$1, _map$2) => ({
            ctr: 'TCO',
            arg: [_id$1, _map$2]
        });
        var App$Kaelin$Hero$info$map_go = _id$1 => _map$2 => App$Kaelin$Hero$info$map_go$(_id$1, _map$2);
        var arg = [_id$1, _map$2];
        while (true) {
            let [_id$1, _map$2] = arg;
            var R = (() => {
                var _hero$3 = App$Kaelin$Hero$info$(_id$1);
                var self = _hero$3;
                switch (self._) {
                    case 'Maybe.some':
                        var $2421 = self.value;
                        var $2422 = App$Kaelin$Hero$info$map_go$(((_id$1 + 1) & 0xFF), Map$set$((() => {
                            var self = $2421;
                            switch (self._) {
                                case 'App.Kaelin.Hero.new':
                                    var $2423 = self.name;
                                    var $2424 = $2423;
                                    return $2424;
                            };
                        })(), _id$1, _map$2));
                        var $2420 = $2422;
                        break;
                    case 'Maybe.none':
                        var $2425 = _map$2;
                        var $2420 = $2425;
                        break;
                };
                return $2420;
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const App$Kaelin$Hero$info$map_go = x0 => x1 => App$Kaelin$Hero$info$map_go$(x0, x1);
    const App$Kaelin$Hero$info$map = App$Kaelin$Hero$info$map_go$(0, Map$new);

    function App$Kaelin$Event$draft_hero$(_hero$1) {
        var $2426 = ({
            _: 'App.Kaelin.Event.draft_hero',
            'hero': _hero$1
        });
        return $2426;
    };
    const App$Kaelin$Event$draft_hero = x0 => App$Kaelin$Event$draft_hero$(x0);

    function App$Kaelin$Event$draft_ready$(_ready$1) {
        var $2427 = ({
            _: 'App.Kaelin.Event.draft_ready',
            'ready': _ready$1
        });
        return $2427;
    };
    const App$Kaelin$Event$draft_ready = x0 => App$Kaelin$Event$draft_ready$(x0);

    function App$Kaelin$Event$draft_team$(_team$1) {
        var $2428 = ({
            _: 'App.Kaelin.Event.draft_team',
            'team': _team$1
        });
        return $2428;
    };
    const App$Kaelin$Event$draft_team = x0 => App$Kaelin$Event$draft_team$(x0);

    function App$Kaelin$App$when$draft$(_players$1, _event$2, _state$3) {
        var self = _state$3;
        switch (self._) {
            case 'App.Store.new':
                var $2430 = self.local;
                var $2431 = self.global;
                var self = $2431;
                switch (self._) {
                    case 'App.Kaelin.State.global.new':
                        var $2433 = self.room;
                        var self = $2430;
                        switch (self._) {
                            case 'App.Kaelin.State.local.new':
                                var $2435 = self.user;
                                var self = _event$2;
                                switch (self._) {
                                    case 'App.Event.mouse_click':
                                        var $2437 = self.id;
                                        var self = String$starts_with$($2437, "C");
                                        if (self) {
                                            var _coord_nat$23 = String$drop$(1n, $2437);
                                            var _coord$24 = App$Kaelin$Coord$Convert$nat_to_axial$((BigInt(_coord_nat$23)));
                                            var $2439 = App$new_post$((() => {
                                                var self = $2431;
                                                switch (self._) {
                                                    case 'App.Kaelin.State.global.new':
                                                        var $2440 = self.room;
                                                        var $2441 = $2440;
                                                        return $2441;
                                                };
                                            })(), App$Kaelin$Event$serialize$(App$Kaelin$Event$draft_coord$(_coord$24)));
                                            var $2438 = $2439;
                                        } else {
                                            var self = String$starts_with$($2437, "H");
                                            if (self) {
                                                var _heroes_list$23 = List$map$(Pair$snd, Map$to_list$(_players$1));
                                                var _team$24 = Maybe$default$(App$Kaelin$Coord$draft$to_team$((() => {
                                                    var self = $2430;
                                                    switch (self._) {
                                                        case 'App.Kaelin.State.local.new':
                                                            var $2444 = self.user;
                                                            var $2445 = $2444;
                                                            return $2445;
                                                    };
                                                })(), _players$1), App$Kaelin$Team$neutral);
                                                var _heroes_map$25 = App$Kaelin$Hero$info$map;
                                                var _hero_name$26 = String$drop$(1n, $2437);
                                                var _hero_id$27 = Map$get$(_hero_name$26, _heroes_map$25);
                                                var _taken$28 = Bool$false;
                                                var _taken$29 = (() => {
                                                    var $2447 = _taken$28;
                                                    var $2448 = _heroes_list$23;
                                                    let _taken$30 = $2447;
                                                    let _player$29;
                                                    while ($2448._ === 'List.cons') {
                                                        _player$29 = $2448.head;
                                                        var self = _player$29;
                                                        switch (self._) {
                                                            case 'App.Kaelin.DraftInfo.new':
                                                                var $2449 = self.hero;
                                                                var $2450 = self.team;
                                                                var self = App$Kaelin$Team$eql$(_team$24, $2450);
                                                                if (self) {
                                                                    var self = (Maybe$default$($2449, 99) === Maybe$default$(_hero_id$27, 0));
                                                                    if (self) {
                                                                        var $2453 = Bool$true;
                                                                        var $2452 = $2453;
                                                                    } else {
                                                                        var $2454 = _taken$30;
                                                                        var $2452 = $2454;
                                                                    };
                                                                    var $2451 = $2452;
                                                                } else {
                                                                    var $2455 = _taken$30;
                                                                    var $2451 = $2455;
                                                                };
                                                                var $2447 = $2451;
                                                                break;
                                                        };
                                                        _taken$30 = $2447;
                                                        $2448 = $2448.tail;
                                                    }
                                                    return _taken$30;
                                                })();
                                                var self = _hero_id$27;
                                                switch (self._) {
                                                    case 'Maybe.some':
                                                        var $2456 = self.value;
                                                        var self = _taken$29;
                                                        if (self) {
                                                            var $2458 = App$pass;
                                                            var $2457 = $2458;
                                                        } else {
                                                            var $2459 = App$new_post$((() => {
                                                                var self = $2431;
                                                                switch (self._) {
                                                                    case 'App.Kaelin.State.global.new':
                                                                        var $2460 = self.room;
                                                                        var $2461 = $2460;
                                                                        return $2461;
                                                                };
                                                            })(), App$Kaelin$Event$serialize$(App$Kaelin$Event$draft_hero$($2456)));
                                                            var $2457 = $2459;
                                                        };
                                                        var $2443 = $2457;
                                                        break;
                                                    case 'Maybe.none':
                                                        var $2462 = App$pass;
                                                        var $2443 = $2462;
                                                        break;
                                                };
                                                var $2442 = $2443;
                                            } else {
                                                var self = String$starts_with$($2437, "R");
                                                if (self) {
                                                    var _info$23 = Map$get$($2435, _players$1);
                                                    var self = _info$23;
                                                    switch (self._) {
                                                        case 'Maybe.some':
                                                            var $2465 = self.value;
                                                            var self = $2465;
                                                            switch (self._) {
                                                                case 'App.Kaelin.DraftInfo.new':
                                                                    var $2467 = self.ready;
                                                                    var $2468 = $2467;
                                                                    var self = $2468;
                                                                    break;
                                                            };
                                                            if (self) {
                                                                var $2469 = 0;
                                                                var _ready_u8$25 = $2469;
                                                            } else {
                                                                var $2470 = 1;
                                                                var _ready_u8$25 = $2470;
                                                            };
                                                            var $2466 = App$new_post$($2433, App$Kaelin$Event$serialize$(App$Kaelin$Event$draft_ready$(_ready_u8$25)));
                                                            var $2464 = $2466;
                                                            break;
                                                        case 'Maybe.none':
                                                            var $2471 = App$pass;
                                                            var $2464 = $2471;
                                                            break;
                                                    };
                                                    var $2463 = $2464;
                                                } else {
                                                    var self = String$starts_with$($2437, "T");
                                                    if (self) {
                                                        var _player_count$23 = String$drop$(1n, $2437);
                                                        var self = String$starts_with$(_player_count$23, "3");
                                                        if (self) {
                                                            var $2474 = App$pass;
                                                            var $2473 = $2474;
                                                        } else {
                                                            var _team$24 = String$drop$(1n, _player_count$23);
                                                            var self = (_team$24 === "blue");
                                                            if (self) {
                                                                var $2476 = App$new_post$($2433, App$Kaelin$Event$serialize$(App$Kaelin$Event$draft_team$(0)));
                                                                var $2475 = $2476;
                                                            } else {
                                                                var self = (_team$24 === "red");
                                                                if (self) {
                                                                    var $2478 = App$new_post$($2433, App$Kaelin$Event$serialize$(App$Kaelin$Event$draft_team$(1)));
                                                                    var $2477 = $2478;
                                                                } else {
                                                                    var $2479 = App$pass;
                                                                    var $2477 = $2479;
                                                                };
                                                                var $2475 = $2477;
                                                            };
                                                            var $2473 = $2475;
                                                        };
                                                        var $2472 = $2473;
                                                    } else {
                                                        var $2480 = App$pass;
                                                        var $2472 = $2480;
                                                    };
                                                    var $2463 = $2472;
                                                };
                                                var $2442 = $2463;
                                            };
                                            var $2438 = $2442;
                                        };
                                        var $2436 = $2438;
                                        break;
                                    case 'App.Event.init':
                                    case 'App.Event.frame':
                                    case 'App.Event.mouse_down':
                                    case 'App.Event.mouse_up':
                                    case 'App.Event.key_down':
                                    case 'App.Event.key_up':
                                    case 'App.Event.mouse_over':
                                    case 'App.Event.input':
                                        var $2481 = App$pass;
                                        var $2436 = $2481;
                                        break;
                                };
                                var $2434 = $2436;
                                break;
                        };
                        var $2432 = $2434;
                        break;
                };
                var $2429 = $2432;
                break;
        };
        return $2429;
    };
    const App$Kaelin$App$when$draft = x0 => x1 => x2 => App$Kaelin$App$when$draft$(x0, x1, x2);
    const Bool$not = a0 => (!a0);
    const U64$to_nat = a0 => (a0);

    function App$Kaelin$Action$local$set_internal$(_time$1, _local$2) {
        var self = _local$2;
        switch (self._) {
            case 'App.Kaelin.State.local.new':
                var $2483 = self.internal;
                var self = $2483;
                switch (self._) {
                    case 'App.Kaelin.Internal.new':
                        var $2485 = self.frame;
                        var $2486 = self.timer;
                        var self = _local$2;
                        switch (self._) {
                            case 'App.Kaelin.State.local.new':
                                var $2488 = self.input;
                                var $2489 = self.user;
                                var $2490 = self.team;
                                var $2491 = self.local_map;
                                var $2492 = self.control_map;
                                var $2493 = self.cast_info;
                                var $2494 = self.env_info;
                                var $2495 = App$Kaelin$State$local$new$($2488, $2489, $2490, $2491, $2492, $2493, $2494, App$Kaelin$Internal$new$((_time$1), ($2485 + 1n), $2486));
                                var $2487 = $2495;
                                break;
                        };
                        var $2484 = $2487;
                        break;
                };
                var $2482 = $2484;
                break;
        };
        return $2482;
    };
    const App$Kaelin$Action$local$set_internal = x0 => x1 => App$Kaelin$Action$local$set_internal$(x0, x1);

    function App$Kaelin$Action$local$env_info$(_time$1, _env_info$2, _local$3) {
        var _local$4 = App$Kaelin$Action$local$set_internal$(_time$1, _local$3);
        var self = _local$4;
        switch (self._) {
            case 'App.Kaelin.State.local.new':
                var $2497 = self.input;
                var $2498 = self.user;
                var $2499 = self.team;
                var $2500 = self.local_map;
                var $2501 = self.control_map;
                var $2502 = self.cast_info;
                var $2503 = self.internal;
                var $2504 = App$Kaelin$State$local$new$($2497, $2498, $2499, $2500, $2501, $2502, _env_info$2, $2503);
                var $2496 = $2504;
                break;
        };
        return $2496;
    };
    const App$Kaelin$Action$local$env_info = x0 => x1 => x2 => App$Kaelin$Action$local$env_info$(x0, x1, x2);

    function App$Kaelin$Effect$indicators$get_indicators$(_hero_pos$1, _skill$2, _mouse_coord$3, _map$4) {
        var self = _skill$2;
        switch (self._) {
            case 'App.Kaelin.Skill.new':
                var $2506 = self.effect;
                var _result$10 = $2506(_hero_pos$1)(_mouse_coord$3)(_map$4);
                var self = _result$10;
                switch (self._) {
                    case 'App.Kaelin.Effect.Result.new':
                        var $2508 = self.indicators;
                        var $2509 = $2508;
                        var $2507 = $2509;
                        break;
                };
                var $2505 = $2507;
                break;
        };
        return $2505;
    };
    const App$Kaelin$Effect$indicators$get_indicators = x0 => x1 => x2 => x3 => App$Kaelin$Effect$indicators$get_indicators$(x0, x1, x2, x3);

    function App$Kaelin$CastInfo$local$new$(_hero_pos$1, _skill$2, _range$3, _area$4, _mouse_pos$5) {
        var $2510 = ({
            _: 'App.Kaelin.CastInfo.local.new',
            'hero_pos': _hero_pos$1,
            'skill': _skill$2,
            'range': _range$3,
            'area': _area$4,
            'mouse_pos': _mouse_pos$5
        });
        return $2510;
    };
    const App$Kaelin$CastInfo$local$new = x0 => x1 => x2 => x3 => x4 => App$Kaelin$CastInfo$local$new$(x0, x1, x2, x3, x4);

    function App$Kaelin$Action$local$area$(_time$1, _global$2, _local$3) {
        var self = _local$3;
        switch (self._) {
            case 'App.Kaelin.State.local.new':
                var $2512 = self.cast_info;
                var $2513 = self.env_info;
                var self = $2513;
                switch (self._) {
                    case 'App.EnvInfo.new':
                        var $2515 = self.mouse_pos;
                        var self = $2512;
                        switch (self._) {
                            case 'Maybe.some':
                                var $2517 = self.value;
                                var _cast$15 = $2517;
                                var self = _cast$15;
                                switch (self._) {
                                    case 'App.Kaelin.CastInfo.local.new':
                                        var $2519 = self.hero_pos;
                                        var $2520 = self.skill;
                                        var $2521 = self.mouse_pos;
                                        var _mouse_coord$21 = App$Kaelin$Coord$to_axial$($2515);
                                        var self = App$Kaelin$Coord$eql$(_mouse_coord$21, $2521);
                                        if (self) {
                                            var $2523 = _local$3;
                                            var $2522 = $2523;
                                        } else {
                                            var _area$22 = App$Kaelin$Effect$indicators$get_indicators$($2519, $2520, _mouse_coord$21, (() => {
                                                var self = _global$2;
                                                switch (self._) {
                                                    case 'App.Kaelin.State.global.new':
                                                        var $2525 = self.map;
                                                        var $2526 = $2525;
                                                        return $2526;
                                                };
                                            })());
                                            var _new_cast_info$23 = Maybe$some$((() => {
                                                var self = _cast$15;
                                                switch (self._) {
                                                    case 'App.Kaelin.CastInfo.local.new':
                                                        var $2527 = self.hero_pos;
                                                        var $2528 = self.skill;
                                                        var $2529 = self.range;
                                                        var $2530 = self.mouse_pos;
                                                        var $2531 = App$Kaelin$CastInfo$local$new$($2527, $2528, $2529, _area$22, $2530);
                                                        return $2531;
                                                };
                                            })());
                                            var self = _local$3;
                                            switch (self._) {
                                                case 'App.Kaelin.State.local.new':
                                                    var $2532 = self.input;
                                                    var $2533 = self.user;
                                                    var $2534 = self.team;
                                                    var $2535 = self.local_map;
                                                    var $2536 = self.control_map;
                                                    var $2537 = self.env_info;
                                                    var $2538 = self.internal;
                                                    var $2539 = App$Kaelin$State$local$new$($2532, $2533, $2534, $2535, $2536, _new_cast_info$23, $2537, $2538);
                                                    var _new_local$24 = $2539;
                                                    break;
                                            };
                                            var $2524 = _new_local$24;
                                            var $2522 = $2524;
                                        };
                                        var $2518 = $2522;
                                        break;
                                };
                                var $2516 = $2518;
                                break;
                            case 'Maybe.none':
                                var $2540 = _local$3;
                                var $2516 = $2540;
                                break;
                        };
                        var $2514 = $2516;
                        break;
                };
                var $2511 = $2514;
                break;
        };
        return $2511;
    };
    const App$Kaelin$Action$local$area = x0 => x1 => x2 => App$Kaelin$Action$local$area$(x0, x1, x2);

    function App$Kaelin$Event$save_skill$(_player$1, _target_pos$2, _key$3, _team$4) {
        var $2541 = ({
            _: 'App.Kaelin.Event.save_skill',
            'player': _player$1,
            'target_pos': _target_pos$2,
            'key': _key$3,
            'team': _team$4
        });
        return $2541;
    };
    const App$Kaelin$Event$save_skill = x0 => x1 => x2 => x3 => App$Kaelin$Event$save_skill$(x0, x1, x2, x3);
    const NatSet$new = NatMap$new;

    function NatSet$set$(_nat$1, _set$2) {
        var $2542 = NatMap$set$(_nat$1, Unit$new, _set$2);
        return $2542;
    };
    const NatSet$set = x0 => x1 => NatSet$set$(x0, x1);

    function NatSet$from_list$(_xs$1) {
        var self = _xs$1;
        switch (self._) {
            case 'List.cons':
                var $2544 = self.head;
                var $2545 = self.tail;
                var $2546 = NatSet$set$($2544, NatSet$from_list$($2545));
                var $2543 = $2546;
                break;
            case 'List.nil':
                var $2547 = NatSet$new;
                var $2543 = $2547;
                break;
        };
        return $2543;
    };
    const NatSet$from_list = x0 => NatSet$from_list$(x0);

    function App$Kaelin$Coord$range_natset$(_coord$1, _distance$2) {
        var _range$3 = App$Kaelin$Coord$range$(_coord$1, _distance$2);
        var _range$4 = List$map$(App$Kaelin$Coord$Convert$axial_to_nat, _range$3);
        var $2548 = NatSet$from_list$(_range$4);
        return $2548;
    };
    const App$Kaelin$Coord$range_natset = x0 => x1 => App$Kaelin$Coord$range_natset$(x0, x1);

    function App$Kaelin$Map$exe_skill$(_player$1, _mouse_pos$2, _key$3, _map$4) {
        var _result$5 = Maybe$monad$((_m$bind$5 => _m$pure$6 => {
            var $2550 = _m$bind$5;
            return $2550;
        }))(App$Kaelin$Map$player$info$(_player$1, _map$4))((_info$5 => {
            var self = _info$5;
            switch (self._) {
                case 'Pair.new':
                    var $2552 = self.snd;
                    var $2553 = $2552;
                    var _creature$6 = $2553;
                    break;
            };
            var self = _info$5;
            switch (self._) {
                case 'Pair.new':
                    var $2554 = self.fst;
                    var $2555 = $2554;
                    var _hero_pos$7 = $2555;
                    break;
            };
            var self = _creature$6;
            switch (self._) {
                case 'App.Kaelin.Creature.new':
                    var $2556 = self.hero;
                    var $2557 = $2556;
                    var _hero$8 = $2557;
                    break;
            };
            var $2551 = Maybe$monad$((_m$bind$9 => _m$pure$10 => {
                var $2558 = _m$bind$9;
                return $2558;
            }))(List$find$((_x$9 => {
                var $2559 = ((() => {
                    var self = _x$9;
                    switch (self._) {
                        case 'App.Kaelin.Skill.new':
                            var $2560 = self.key;
                            var $2561 = $2560;
                            return $2561;
                    };
                })() === _key$3);
                return $2559;
            }), (() => {
                var self = _hero$8;
                switch (self._) {
                    case 'App.Kaelin.Hero.new':
                        var $2562 = self.skills;
                        var $2563 = $2562;
                        return $2563;
                };
            })()))((_skill$9 => {
                var self = _skill$9;
                switch (self._) {
                    case 'App.Kaelin.Skill.new':
                        var $2565 = self.effect;
                        var $2566 = $2565;
                        var _effect$10 = $2566;
                        break;
                };
                var _effect$10 = _effect$10(_hero_pos$7)(_mouse_pos$2)(_map$4);
                var _mouse_nat$11 = App$Kaelin$Coord$Convert$axial_to_nat$(_mouse_pos$2);
                var _skill_range$12 = App$Kaelin$Coord$range_natset$(_hero_pos$7, (() => {
                    var self = _skill$9;
                    switch (self._) {
                        case 'App.Kaelin.Skill.new':
                            var $2567 = self.range;
                            var $2568 = $2567;
                            return $2568;
                    };
                })());
                var self = _skill$9;
                switch (self._) {
                    case 'App.Kaelin.Skill.new':
                        var $2569 = self.ap_cost;
                        var self = ($2569 > (() => {
                            var self = _creature$6;
                            switch (self._) {
                                case 'App.Kaelin.Creature.new':
                                    var $2571 = self.ap;
                                    var $2572 = $2571;
                                    return $2572;
                            };
                        })());
                        if (self) {
                            var $2573 = _map$4;
                            var $2570 = $2573;
                        } else {
                            var self = ((() => {
                                var self = _creature$6;
                                switch (self._) {
                                    case 'App.Kaelin.Creature.new':
                                        var $2575 = self.ap;
                                        var $2576 = $2575;
                                        return $2576;
                                };
                            })() === 0);
                            if (self) {
                                var $2577 = _map$4;
                                var $2574 = $2577;
                            } else {
                                var self = (!NatSet$has$(_mouse_nat$11, _skill_range$12));
                                if (self) {
                                    var $2579 = _map$4;
                                    var $2578 = $2579;
                                } else {
                                    var self = _effect$10;
                                    switch (self._) {
                                        case 'App.Kaelin.Effect.Result.new':
                                            var $2581 = self.map;
                                            var $2582 = $2581;
                                            var $2580 = $2582;
                                            break;
                                    };
                                    var $2578 = $2580;
                                };
                                var $2574 = $2578;
                            };
                            var $2570 = $2574;
                        };
                        var _new_map$13 = $2570;
                        break;
                };
                var $2564 = Maybe$monad$((_m$bind$14 => _m$pure$15 => {
                    var $2583 = _m$pure$15;
                    return $2583;
                }))(_new_map$13);
                return $2564;
            }));
            return $2551;
        }));
        var $2549 = Maybe$default$(_result$5, _map$4);
        return $2549;
    };
    const App$Kaelin$Map$exe_skill = x0 => x1 => x2 => x3 => App$Kaelin$Map$exe_skill$(x0, x1, x2, x3);

    function App$Kaelin$CastInfo$start$(_player$1, _key_code$2, _target_pos$3, _state$4) {
        var self = _state$4;
        switch (self._) {
            case 'App.Store.new':
                var $2585 = self.global;
                var $2586 = $2585;
                var _global$5 = $2586;
                break;
        };
        var self = _global$5;
        switch (self._) {
            case 'App.Kaelin.State.global.new':
                var _map$12 = App$Kaelin$Stage$get_map$(_state$4);
                var _result$12 = Maybe$monad$((_m$bind$13 => _m$pure$14 => {
                    var $2588 = _m$bind$13;
                    return $2588;
                }))(App$Kaelin$Map$player$info$(_player$1, _map$12))((_player_info$13 => {
                    var self = _player_info$13;
                    switch (self._) {
                        case 'Pair.new':
                            var $2590 = self.fst;
                            var $2591 = $2590;
                            var _player_coord$14 = $2591;
                            break;
                    };
                    var self = _player_info$13;
                    switch (self._) {
                        case 'Pair.new':
                            var $2592 = self.snd;
                            var $2593 = $2592;
                            var _player_creature$15 = $2593;
                            break;
                    };
                    var $2589 = Maybe$monad$((_m$bind$16 => _m$pure$17 => {
                        var $2594 = _m$bind$16;
                        return $2594;
                    }))(App$Kaelin$Hero$skill$from_key$(_key_code$2, (() => {
                        var self = _player_creature$15;
                        switch (self._) {
                            case 'App.Kaelin.Creature.new':
                                var $2595 = self.hero;
                                var $2596 = $2595;
                                return $2596;
                        };
                    })()))((_skill$16 => {
                        var _range$17 = App$Kaelin$Coord$range_natset$(_player_coord$14, (() => {
                            var self = _skill$16;
                            switch (self._) {
                                case 'App.Kaelin.Skill.new':
                                    var $2598 = self.range;
                                    var $2599 = $2598;
                                    return $2599;
                            };
                        })());
                        var _area$18 = App$Kaelin$Effect$indicators$get_indicators$(_player_coord$14, _skill$16, _target_pos$3, _map$12);
                        var _cast$19 = App$Kaelin$CastInfo$local$new$(_player_coord$14, _skill$16, _range$17, _area$18, _target_pos$3);
                        var $2597 = Maybe$monad$((_m$bind$20 => _m$pure$21 => {
                            var $2600 = _m$pure$21;
                            return $2600;
                        }))(_cast$19);
                        return $2597;
                    }));
                    return $2589;
                }));
                var $2587 = _result$12;
                var $2584 = $2587;
                break;
        };
        return $2584;
    };
    const App$Kaelin$CastInfo$start = x0 => x1 => x2 => x3 => App$Kaelin$CastInfo$start$(x0, x1, x2, x3);

    function App$Kaelin$Action$local$set_cast$(_key_code$1, _state$2) {
        var self = _state$2;
        switch (self._) {
            case 'App.Store.new':
                var $2602 = self.local;
                var $2603 = $2602;
                var _local$3 = $2603;
                break;
        };
        var self = _local$3;
        switch (self._) {
            case 'App.Kaelin.State.local.new':
                var $2604 = self.user;
                var $2605 = self.env_info;
                var _target_pos$12 = App$Kaelin$Coord$to_axial$((() => {
                    var self = $2605;
                    switch (self._) {
                        case 'App.EnvInfo.new':
                            var $2607 = self.mouse_pos;
                            var $2608 = $2607;
                            return $2608;
                    };
                })());
                var _cast$13 = App$Kaelin$CastInfo$start$($2604, _key_code$1, _target_pos$12, _state$2);
                var self = _local$3;
                switch (self._) {
                    case 'App.Kaelin.State.local.new':
                        var $2609 = self.input;
                        var $2610 = self.user;
                        var $2611 = self.team;
                        var $2612 = self.local_map;
                        var $2613 = self.control_map;
                        var $2614 = self.env_info;
                        var $2615 = self.internal;
                        var $2616 = App$Kaelin$State$local$new$($2609, $2610, $2611, $2612, $2613, _cast$13, $2614, $2615);
                        var $2606 = $2616;
                        break;
                };
                var $2601 = $2606;
                break;
        };
        return $2601;
    };
    const App$Kaelin$Action$local$set_cast = x0 => x1 => App$Kaelin$Action$local$set_cast$(x0, x1);

    function App$Kaelin$App$when$planning$(_event$1, _state$2) {
        var self = _state$2;
        switch (self._) {
            case 'App.Store.new':
                var $2618 = self.local;
                var $2619 = self.global;
                var self = _event$1;
                switch (self._) {
                    case 'App.Event.frame':
                        var $2621 = self.time;
                        var $2622 = self.info;
                        var _update$7 = (!((() => {
                            var self = _state$2;
                            switch (self._) {
                                case 'App.Store.new':
                                    var $2624 = self.local;
                                    var $2625 = $2624;
                                    var self = $2625;
                                    break;
                            };
                            switch (self._) {
                                case 'App.Kaelin.State.local.new':
                                    var $2626 = self.control_map;
                                    var $2627 = $2626;
                                    return $2627;
                            };
                        })() === (() => {
                            var self = _state$2;
                            switch (self._) {
                                case 'App.Store.new':
                                    var $2628 = self.global;
                                    var $2629 = $2628;
                                    var self = $2629;
                                    break;
                            };
                            switch (self._) {
                                case 'App.Kaelin.State.global.new':
                                    var $2630 = self.round;
                                    var $2631 = $2630;
                                    return $2631;
                            };
                        })()));
                        var _new_local$8 = App$Kaelin$Action$local$env_info$($2621, $2622, (() => {
                            var self = _state$2;
                            switch (self._) {
                                case 'App.Store.new':
                                    var $2632 = self.local;
                                    var $2633 = $2632;
                                    return $2633;
                            };
                        })());
                        var _new_local$9 = App$Kaelin$Action$local$area$($2621, (() => {
                            var self = _state$2;
                            switch (self._) {
                                case 'App.Store.new':
                                    var $2634 = self.global;
                                    var $2635 = $2634;
                                    return $2635;
                            };
                        })(), _new_local$8);
                        var self = _new_local$9;
                        switch (self._) {
                            case 'App.Kaelin.State.local.new':
                                var $2636 = self.input;
                                var $2637 = self.user;
                                var $2638 = self.team;
                                var $2639 = self.control_map;
                                var $2640 = self.cast_info;
                                var $2641 = self.env_info;
                                var $2642 = self.internal;
                                var $2643 = App$Kaelin$State$local$new$($2636, $2637, $2638, (() => {
                                    var self = _update$7;
                                    if (self) {
                                        var self = _state$2;
                                        switch (self._) {
                                            case 'App.Store.new':
                                                var $2645 = self.global;
                                                var $2646 = $2645;
                                                var self = $2646;
                                                break;
                                        };
                                        switch (self._) {
                                            case 'App.Kaelin.State.global.new':
                                                var $2647 = self.map;
                                                var $2648 = $2647;
                                                var $2644 = $2648;
                                                break;
                                        };
                                        return $2644;
                                    } else {
                                        var self = _new_local$9;
                                        switch (self._) {
                                            case 'App.Kaelin.State.local.new':
                                                var $2650 = self.local_map;
                                                var $2651 = $2650;
                                                var $2649 = $2651;
                                                break;
                                        };
                                        return $2649;
                                    };
                                })(), $2639, $2640, $2641, $2642);
                                var _new_local$10 = $2643;
                                break;
                        };
                        var self = _new_local$10;
                        switch (self._) {
                            case 'App.Kaelin.State.local.new':
                                var $2652 = self.input;
                                var $2653 = self.user;
                                var $2654 = self.team;
                                var $2655 = self.local_map;
                                var $2656 = self.cast_info;
                                var $2657 = self.env_info;
                                var $2658 = self.internal;
                                var $2659 = App$Kaelin$State$local$new$($2652, $2653, $2654, $2655, (() => {
                                    var self = _update$7;
                                    if (self) {
                                        var $2660 = (((() => {
                                            var self = _state$2;
                                            switch (self._) {
                                                case 'App.Store.new':
                                                    var $2661 = self.local;
                                                    var $2662 = $2661;
                                                    var self = $2662;
                                                    break;
                                            };
                                            switch (self._) {
                                                case 'App.Kaelin.State.local.new':
                                                    var $2663 = self.control_map;
                                                    var $2664 = $2663;
                                                    return $2664;
                                            };
                                        })() + 1) >> 0);
                                        return $2660;
                                    } else {
                                        var self = _state$2;
                                        switch (self._) {
                                            case 'App.Store.new':
                                                var $2666 = self.local;
                                                var $2667 = $2666;
                                                var self = $2667;
                                                break;
                                        };
                                        switch (self._) {
                                            case 'App.Kaelin.State.local.new':
                                                var $2668 = self.control_map;
                                                var $2669 = $2668;
                                                var $2665 = $2669;
                                                break;
                                        };
                                        return $2665;
                                    };
                                })(), $2656, $2657, $2658);
                                var _new_local$11 = $2659;
                                break;
                        };
                        var $2623 = App$set_local$(_new_local$11);
                        var $2620 = $2623;
                        break;
                    case 'App.Event.key_down':
                        var $2670 = self.code;
                        var $2671 = App$set_local$(App$Kaelin$Action$local$set_cast$($2670, _state$2));
                        var $2620 = $2671;
                        break;
                    case 'App.Event.mouse_click':
                        var $2672 = self.id;
                        var $2673 = App$new_post$((() => {
                            var self = $2619;
                            switch (self._) {
                                case 'App.Kaelin.State.global.new':
                                    var $2674 = self.room;
                                    var $2675 = $2674;
                                    return $2675;
                            };
                        })(), $2672);
                        var $2620 = $2673;
                        break;
                    case 'App.Event.init':
                    case 'App.Event.mouse_down':
                    case 'App.Event.key_up':
                    case 'App.Event.mouse_over':
                    case 'App.Event.input':
                        var $2676 = App$pass;
                        var $2620 = $2676;
                        break;
                    case 'App.Event.mouse_up':
                        var self = $2618;
                        switch (self._) {
                            case 'App.Kaelin.State.local.new':
                                var $2678 = self.cast_info;
                                var $2679 = $2678;
                                var _cast$7 = $2679;
                                break;
                        };
                        var self = _cast$7;
                        switch (self._) {
                            case 'Maybe.some':
                                var $2680 = self.value;
                                var self = $2680;
                                switch (self._) {
                                    case 'App.Kaelin.CastInfo.local.new':
                                        var self = $2618;
                                        switch (self._) {
                                            case 'App.Kaelin.State.local.new':
                                                var $2683 = self.env_info;
                                                var $2684 = $2683;
                                                var _info$14 = $2684;
                                                break;
                                        };
                                        var _target_pos$15 = App$Kaelin$Coord$to_axial$((() => {
                                            var self = _info$14;
                                            switch (self._) {
                                                case 'App.EnvInfo.new':
                                                    var $2685 = self.mouse_pos;
                                                    var $2686 = $2685;
                                                    return $2686;
                                            };
                                        })());
                                        var self = $2680;
                                        switch (self._) {
                                            case 'App.Kaelin.CastInfo.local.new':
                                                var $2687 = self.skill;
                                                var $2688 = $2687;
                                                var self = $2688;
                                                break;
                                        };
                                        switch (self._) {
                                            case 'App.Kaelin.Skill.new':
                                                var $2689 = self.key;
                                                var $2690 = $2689;
                                                var _key$16 = $2690;
                                                break;
                                        };
                                        var _hex$17 = App$Kaelin$Event$serialize$(App$Kaelin$Event$save_skill$((() => {
                                            var self = _state$2;
                                            switch (self._) {
                                                case 'App.Store.new':
                                                    var $2691 = self.local;
                                                    var $2692 = $2691;
                                                    var self = $2692;
                                                    break;
                                            };
                                            switch (self._) {
                                                case 'App.Kaelin.State.local.new':
                                                    var $2693 = self.user;
                                                    var $2694 = $2693;
                                                    return $2694;
                                            };
                                        })(), _target_pos$15, _key$16, (() => {
                                            var self = _state$2;
                                            switch (self._) {
                                                case 'App.Store.new':
                                                    var $2695 = self.local;
                                                    var $2696 = $2695;
                                                    var self = $2696;
                                                    break;
                                            };
                                            switch (self._) {
                                                case 'App.Kaelin.State.local.new':
                                                    var $2697 = self.team;
                                                    var $2698 = $2697;
                                                    return $2698;
                                            };
                                        })()));
                                        var self = _state$2;
                                        switch (self._) {
                                            case 'App.Store.new':
                                                var $2699 = self.local;
                                                var $2700 = $2699;
                                                var self = $2700;
                                                break;
                                        };
                                        switch (self._) {
                                            case 'App.Kaelin.State.local.new':
                                                var $2701 = self.input;
                                                var $2702 = self.user;
                                                var $2703 = self.team;
                                                var $2704 = self.local_map;
                                                var $2705 = self.control_map;
                                                var $2706 = self.env_info;
                                                var $2707 = self.internal;
                                                var $2708 = App$Kaelin$State$local$new$($2701, $2702, $2703, $2704, $2705, Maybe$none, $2706, $2707);
                                                var _new_local$18 = $2708;
                                                break;
                                        };
                                        var self = _new_local$18;
                                        switch (self._) {
                                            case 'App.Kaelin.State.local.new':
                                                var $2709 = self.input;
                                                var $2710 = self.user;
                                                var $2711 = self.team;
                                                var $2712 = self.local_map;
                                                var $2713 = self.control_map;
                                                var $2714 = self.cast_info;
                                                var $2715 = self.env_info;
                                                var $2716 = self.internal;
                                                var $2717 = App$Kaelin$State$local$new$($2709, $2710, $2711, App$Kaelin$Map$exe_skill$((() => {
                                                    var self = _new_local$18;
                                                    switch (self._) {
                                                        case 'App.Kaelin.State.local.new':
                                                            var $2718 = self.user;
                                                            var $2719 = $2718;
                                                            return $2719;
                                                    };
                                                })(), _target_pos$15, _key$16, $2712), $2713, $2714, $2715, $2716);
                                                var _new_local$19 = $2717;
                                                break;
                                        };
                                        var $2682 = IO$monad$((_m$bind$20 => _m$pure$21 => {
                                            var $2720 = _m$bind$20;
                                            return $2720;
                                        }))(App$new_post$((() => {
                                            var self = _state$2;
                                            switch (self._) {
                                                case 'App.Store.new':
                                                    var $2721 = self.global;
                                                    var $2722 = $2721;
                                                    var self = $2722;
                                                    break;
                                            };
                                            switch (self._) {
                                                case 'App.Kaelin.State.global.new':
                                                    var $2723 = self.room;
                                                    var $2724 = $2723;
                                                    return $2724;
                                            };
                                        })(), _hex$17))((_$20 => {
                                            var $2725 = App$set_local$(_new_local$19);
                                            return $2725;
                                        }));
                                        var $2681 = $2682;
                                        break;
                                };
                                var $2677 = $2681;
                                break;
                            case 'Maybe.none':
                                var $2726 = App$pass;
                                var $2677 = $2726;
                                break;
                        };
                        var $2620 = $2677;
                        break;
                };
                var $2617 = $2620;
                break;
        };
        return $2617;
    };
    const App$Kaelin$App$when$planning = x0 => x1 => App$Kaelin$App$when$planning$(x0, x1);

    function App$Kaelin$App$when$(_event$1, _state$2) {
        var self = _state$2;
        switch (self._) {
            case 'App.Store.new':
                var $2728 = self.global;
                var self = $2728;
                switch (self._) {
                    case 'App.Kaelin.State.global.new':
                        var $2730 = self.stage;
                        var $2731 = $2730;
                        var _stage$5 = $2731;
                        break;
                };
                var self = _stage$5;
                switch (self._) {
                    case 'App.Kaelin.Stage.draft':
                        var $2732 = self.players;
                        var $2733 = App$Kaelin$App$when$draft$($2732, _event$1, _state$2);
                        var $2729 = $2733;
                        break;
                    case 'App.Kaelin.Stage.init':
                        var $2734 = App$Kaelin$App$when$init$(_event$1, _state$2);
                        var $2729 = $2734;
                        break;
                    case 'App.Kaelin.Stage.planning':
                        var $2735 = App$Kaelin$App$when$planning$(_event$1, _state$2);
                        var $2729 = $2735;
                        break;
                    case 'App.Kaelin.Stage.action':
                        var $2736 = App$pass;
                        var $2729 = $2736;
                        break;
                };
                var $2727 = $2729;
                break;
        };
        return $2727;
    };
    const App$Kaelin$App$when = x0 => x1 => App$Kaelin$App$when$(x0, x1);
    const U64$add = a0 => a1 => ((a0 + a1) & 0xFFFFFFFFFFFFFFFFn);

    function App$Kaelin$Stage$planning$(_control_map$1, _local_tick$2, _seconds$3) {
        var $2737 = ({
            _: 'App.Kaelin.Stage.planning',
            'control_map': _control_map$1,
            'local_tick': _local_tick$2,
            'seconds': _seconds$3
        });
        return $2737;
    };
    const App$Kaelin$Stage$planning = x0 => x1 => x2 => App$Kaelin$Stage$planning$(x0, x1, x2);

    function App$Kaelin$Coord$draft$start_game$(_map$1, _draft_map$2, _players$3) {
        var _draft_map$4 = NatMap$union$((() => {
            var self = _draft_map$2;
            switch (self._) {
                case 'Pair.new':
                    var $2739 = self.fst;
                    var $2740 = $2739;
                    return $2740;
            };
        })(), (() => {
            var self = _draft_map$2;
            switch (self._) {
                case 'Pair.new':
                    var $2741 = self.snd;
                    var $2742 = $2741;
                    return $2742;
            };
        })());
        var _coords$5 = NatMap$to_list$(_draft_map$4);
        var _map$6 = (() => {
            var $2744 = _map$1;
            var $2745 = _coords$5;
            let _map$7 = $2744;
            let _coord$6;
            while ($2745._ === 'List.cons') {
                _coord$6 = $2745.head;
                var self = _coord$6;
                switch (self._) {
                    case 'Pair.new':
                        var $2746 = self.snd;
                        var $2747 = $2746;
                        var _user$8 = $2747;
                        break;
                };
                var _result$9 = Maybe$monad$((_m$bind$9 => _m$pure$10 => {
                    var $2748 = _m$bind$9;
                    return $2748;
                }))(Map$get$(_user$8, _players$3))((_player$9 => {
                    var $2749 = Maybe$monad$((_m$bind$10 => _m$pure$11 => {
                        var $2750 = _m$bind$10;
                        return $2750;
                    }))((() => {
                        var self = _player$9;
                        switch (self._) {
                            case 'App.Kaelin.DraftInfo.new':
                                var $2751 = self.hero;
                                var $2752 = $2751;
                                return $2752;
                        };
                    })())((_hero$10 => {
                        var $2753 = Maybe$monad$((_m$bind$11 => _m$pure$12 => {
                            var $2754 = _m$bind$11;
                            return $2754;
                        }))(App$Kaelin$Coord$draft$to_team$(_user$8, _players$3))((_team$11 => {
                            var _new_creature$12 = App$Kaelin$Tile$creature$create$(_hero$10, Maybe$some$(_user$8), _team$11);
                            var _coord$13 = App$Kaelin$Coord$Convert$nat_to_axial$((() => {
                                var self = _coord$6;
                                switch (self._) {
                                    case 'Pair.new':
                                        var $2756 = self.fst;
                                        var $2757 = $2756;
                                        return $2757;
                                };
                            })());
                            var _entity$14 = App$Kaelin$Map$Entity$creature$(_new_creature$12);
                            var $2755 = Maybe$monad$((_m$bind$15 => _m$pure$16 => {
                                var $2758 = _m$pure$16;
                                return $2758;
                            }))(App$Kaelin$Map$push$(_coord$13, _entity$14, _map$7));
                            return $2755;
                        }));
                        return $2753;
                    }));
                    return $2749;
                }));
                var $2744 = Maybe$default$(_result$9, _map$7);
                _map$7 = $2744;
                $2745 = $2745.tail;
            }
            return _map$7;
        })();
        var $2738 = _map$6;
        return $2738;
    };
    const App$Kaelin$Coord$draft$start_game = x0 => x1 => x2 => App$Kaelin$Coord$draft$start_game$(x0, x1, x2);

    function App$Kaelin$Stage$draft$end$(_glob$1) {
        var self = _glob$1;
        switch (self._) {
            case 'App.Kaelin.State.global.new':
                var $2760 = self.round;
                var $2761 = self.tick;
                var $2762 = self.room;
                var $2763 = self.map;
                var $2764 = self.stage;
                var $2765 = self.skills_list;
                var self = $2764;
                switch (self._) {
                    case 'App.Kaelin.Stage.draft':
                        var $2767 = self.players;
                        var $2768 = self.coords;
                        var _player_list$10 = Map$to_list$($2767);
                        var _ready$11 = Bool$true;
                        var _ready$12 = (() => {
                            var $2771 = _ready$11;
                            var $2772 = _player_list$10;
                            let _ready$13 = $2771;
                            let _player$12;
                            while ($2772._ === 'List.cons') {
                                _player$12 = $2772.head;
                                var self = _player$12;
                                switch (self._) {
                                    case 'Pair.new':
                                        var $2773 = self.snd;
                                        var $2774 = $2773;
                                        var _info$14 = $2774;
                                        break;
                                };
                                var $2771 = (_ready$13 && (() => {
                                    var self = _info$14;
                                    switch (self._) {
                                        case 'App.Kaelin.DraftInfo.new':
                                            var $2775 = self.ready;
                                            var $2776 = $2775;
                                            return $2776;
                                    };
                                })());
                                _ready$13 = $2771;
                                $2772 = $2772.tail;
                            }
                            return _ready$13;
                        })();
                        var self = _player_list$10;
                        switch (self._) {
                            case 'List.nil':
                                var $2777 = _glob$1;
                                var $2769 = $2777;
                                break;
                            case 'List.cons':
                                var self = _ready$12;
                                if (self) {
                                    var _new_stage$15 = App$Kaelin$Stage$planning$(0, 0n, 0n);
                                    var _new_map$16 = App$Kaelin$Coord$draft$start_game$($2763, $2768, $2767);
                                    var $2779 = App$Kaelin$State$global$new$($2760, $2761, $2762, _new_map$16, _new_stage$15, $2765);
                                    var $2778 = $2779;
                                } else {
                                    var $2780 = _glob$1;
                                    var $2778 = $2780;
                                };
                                var $2769 = $2778;
                                break;
                        };
                        var $2766 = $2769;
                        break;
                    case 'App.Kaelin.Stage.init':
                    case 'App.Kaelin.Stage.planning':
                    case 'App.Kaelin.Stage.action':
                        var $2781 = _glob$1;
                        var $2766 = $2781;
                        break;
                };
                var $2759 = $2766;
                break;
        };
        return $2759;
    };
    const App$Kaelin$Stage$draft$end = x0 => App$Kaelin$Stage$draft$end$(x0);
    const U64$sub = a0 => a1 => ((a0 - a1) & 0xFFFFFFFFFFFFFFFFn);
    const Nat$to_u64 = a0 => (a0 & 0xFFFFFFFFFFFFFFFFn);
    const U64$div = a0 => a1 => ((a0 / a1) & 0xFFFFFFFFFFFFFFFFn);
    const U64$mul = a0 => a1 => ((a0 * a1) & 0xFFFFFFFFFFFFFFFFn);
    const U64$gte = a0 => a1 => (a0 >= a1);
    const App$Kaelin$Stage$action = ({
        _: 'App.Kaelin.Stage.action'
    });

    function App$Kaelin$Action$global$exe_skill$(_player$1, _mouse_pos$2, _key$3, _global$4) {
        var self = _global$4;
        switch (self._) {
            case 'App.Kaelin.State.global.new':
                var $2783 = self.round;
                var $2784 = self.tick;
                var $2785 = self.room;
                var $2786 = self.stage;
                var $2787 = self.skills_list;
                var $2788 = App$Kaelin$State$global$new$($2783, $2784, $2785, App$Kaelin$Map$exe_skill$(_player$1, _mouse_pos$2, _key$3, (() => {
                    var self = _global$4;
                    switch (self._) {
                        case 'App.Kaelin.State.global.new':
                            var $2789 = self.map;
                            var $2790 = $2789;
                            return $2790;
                    };
                })()), $2786, $2787);
                var $2782 = $2788;
                break;
        };
        return $2782;
    };
    const App$Kaelin$Action$global$exe_skill = x0 => x1 => x2 => x3 => App$Kaelin$Action$global$exe_skill$(x0, x1, x2, x3);

    function App$Kaelin$Action$global$exe_skills_list$(_skills$2, _glob$3) {
        var App$Kaelin$Action$global$exe_skills_list$ = (_skills$2, _glob$3) => ({
            ctr: 'TCO',
            arg: [_skills$2, _glob$3]
        });
        var App$Kaelin$Action$global$exe_skills_list = _skills$2 => _glob$3 => App$Kaelin$Action$global$exe_skills_list$(_skills$2, _glob$3);
        var arg = [_skills$2, _glob$3];
        while (true) {
            let [_skills$2, _glob$3] = arg;
            var R = (() => {
                var self = _skills$2;
                switch (self._) {
                    case 'List.cons':
                        var $2791 = self.head;
                        var $2792 = self.tail;
                        var _new_glob$6 = App$Kaelin$Action$global$exe_skill$((() => {
                            var self = $2791;
                            switch (self._) {
                                case 'App.Kaelin.CastInfo.global.new':
                                    var $2794 = self.player;
                                    var $2795 = $2794;
                                    return $2795;
                            };
                        })(), (() => {
                            var self = $2791;
                            switch (self._) {
                                case 'App.Kaelin.CastInfo.global.new':
                                    var $2796 = self.target_pos;
                                    var $2797 = $2796;
                                    return $2797;
                            };
                        })(), (() => {
                            var self = $2791;
                            switch (self._) {
                                case 'App.Kaelin.CastInfo.global.new':
                                    var $2798 = self.key;
                                    var $2799 = $2798;
                                    return $2799;
                            };
                        })(), _glob$3);
                        var $2793 = App$Kaelin$Action$global$exe_skills_list$($2792, _new_glob$6);
                        return $2793;
                    case 'List.nil':
                        var $2800 = _glob$3;
                        return $2800;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const App$Kaelin$Action$global$exe_skills_list = x0 => x1 => App$Kaelin$Action$global$exe_skills_list$(x0, x1);

    function App$Kaelin$Tile$creature$restore_ap$(_creature$1) {
        var self = _creature$1;
        switch (self._) {
            case 'App.Kaelin.Creature.new':
                var $2802 = self.hp;
                var $2803 = self.ap;
                var self = _creature$1;
                switch (self._) {
                    case 'App.Kaelin.Creature.new':
                        var $2805 = self.hero;
                        var $2806 = $2805;
                        var _hero$8 = $2806;
                        break;
                };
                var self = ($2802 <= 0);
                if (self) {
                    var $2807 = _creature$1;
                    var $2804 = $2807;
                } else {
                    var _new_ap$9 = (((() => {
                        var self = _hero$8;
                        switch (self._) {
                            case 'App.Kaelin.Hero.new':
                                var $2809 = self.max_ap;
                                var $2810 = $2809;
                                return $2810;
                        };
                    })() / 2) >> 0);
                    var _max_ap$10 = I32$min$((($2803 + _new_ap$9) >> 0), (() => {
                        var self = _hero$8;
                        switch (self._) {
                            case 'App.Kaelin.Hero.new':
                                var $2811 = self.max_ap;
                                var $2812 = $2811;
                                return $2812;
                        };
                    })());
                    var self = _creature$1;
                    switch (self._) {
                        case 'App.Kaelin.Creature.new':
                            var $2813 = self.player;
                            var $2814 = self.hero;
                            var $2815 = self.team;
                            var $2816 = self.hp;
                            var $2817 = self.status;
                            var $2818 = App$Kaelin$Creature$new$($2813, $2814, $2815, $2816, _max_ap$10, $2817);
                            var $2808 = $2818;
                            break;
                    };
                    var $2804 = $2808;
                };
                var $2801 = $2804;
                break;
        };
        return $2801;
    };
    const App$Kaelin$Tile$creature$restore_ap = x0 => App$Kaelin$Tile$creature$restore_ap$(x0);

    function App$Kaelin$Map$creature$restore_all_ap$(_map$1) {
        var _map$2 = NatMap$to_list$(_map$1);
        var _new_map$3 = Map$from_list$(List$nil);
        var _new_map$4 = (() => {
            var $2821 = _new_map$3;
            var $2822 = _map$2;
            let _new_map$5 = $2821;
            let _pos$4;
            while ($2822._ === 'List.cons') {
                _pos$4 = $2822.head;
                var self = _pos$4;
                switch (self._) {
                    case 'Pair.new':
                        var $2823 = self.snd;
                        var $2824 = $2823;
                        var _tile$6 = $2824;
                        break;
                };
                var self = _pos$4;
                switch (self._) {
                    case 'Pair.new':
                        var $2825 = self.fst;
                        var $2826 = $2825;
                        var _coord$7 = $2826;
                        break;
                };
                var self = _tile$6;
                switch (self._) {
                    case 'App.Kaelin.Tile.new':
                        var $2827 = self.creature;
                        var $2828 = $2827;
                        var _creature$8 = $2828;
                        break;
                };
                var self = _creature$8;
                switch (self._) {
                    case 'Maybe.some':
                        var $2829 = self.value;
                        var self = _tile$6;
                        switch (self._) {
                            case 'App.Kaelin.Tile.new':
                                var $2831 = self.background;
                                var $2832 = self.animation;
                                var $2833 = App$Kaelin$Tile$new$($2831, Maybe$some$(App$Kaelin$Tile$creature$restore_ap$($2829)), $2832);
                                var $2830 = $2833;
                                break;
                        };
                        var _new_tile$9 = $2830;
                        break;
                    case 'Maybe.none':
                        var $2834 = _tile$6;
                        var _new_tile$9 = $2834;
                        break;
                };
                var $2821 = NatMap$set$(_coord$7, _new_tile$9, _new_map$5);
                _new_map$5 = $2821;
                $2822 = $2822.tail;
            }
            return _new_map$5;
        })();
        var $2819 = _new_map$4;
        return $2819;
    };
    const App$Kaelin$Map$creature$restore_all_ap = x0 => App$Kaelin$Map$creature$restore_all_ap$(x0);

    function App$Kaelin$Action$end_action_turn$(_glob$1) {
        var self = _glob$1;
        switch (self._) {
            case 'App.Kaelin.State.global.new':
                var $2836 = self.stage;
                var self = $2836;
                switch (self._) {
                    case 'App.Kaelin.Stage.init':
                    case 'App.Kaelin.Stage.draft':
                    case 'App.Kaelin.Stage.planning':
                        var $2838 = _glob$1;
                        var $2837 = $2838;
                        break;
                    case 'App.Kaelin.Stage.action':
                        var self = _glob$1;
                        switch (self._) {
                            case 'App.Kaelin.State.global.new':
                                var $2840 = self.round;
                                var $2841 = self.tick;
                                var $2842 = self.room;
                                var $2843 = self.map;
                                var $2844 = self.skills_list;
                                var $2845 = App$Kaelin$State$global$new$($2840, $2841, $2842, $2843, App$Kaelin$Stage$planning$((((() => {
                                    var self = _glob$1;
                                    switch (self._) {
                                        case 'App.Kaelin.State.global.new':
                                            var $2846 = self.round;
                                            var $2847 = $2846;
                                            return $2847;
                                    };
                                })() - 1) >> 0), 0n, 0n), $2844);
                                var _new_glob$8 = $2845;
                                break;
                        };
                        var self = _new_glob$8;
                        switch (self._) {
                            case 'App.Kaelin.State.global.new':
                                var $2848 = self.tick;
                                var $2849 = self.room;
                                var $2850 = self.map;
                                var $2851 = self.stage;
                                var $2852 = self.skills_list;
                                var $2853 = App$Kaelin$State$global$new$((((() => {
                                    var self = _new_glob$8;
                                    switch (self._) {
                                        case 'App.Kaelin.State.global.new':
                                            var $2854 = self.round;
                                            var $2855 = $2854;
                                            return $2855;
                                    };
                                })() + 1) >> 0), $2848, $2849, $2850, $2851, $2852);
                                var _new_glob$9 = $2853;
                                break;
                        };
                        var self = _new_glob$9;
                        switch (self._) {
                            case 'App.Kaelin.State.global.new':
                                var $2856 = self.round;
                                var $2857 = self.tick;
                                var $2858 = self.room;
                                var $2859 = self.map;
                                var $2860 = self.stage;
                                var $2861 = App$Kaelin$State$global$new$($2856, $2857, $2858, $2859, $2860, List$nil);
                                var _new_glob$10 = $2861;
                                break;
                        };
                        var self = _new_glob$10;
                        switch (self._) {
                            case 'App.Kaelin.State.global.new':
                                var $2862 = self.round;
                                var $2863 = self.tick;
                                var $2864 = self.room;
                                var $2865 = self.stage;
                                var $2866 = self.skills_list;
                                var $2867 = App$Kaelin$State$global$new$($2862, $2863, $2864, App$Kaelin$Map$creature$restore_all_ap$((() => {
                                    var self = _new_glob$10;
                                    switch (self._) {
                                        case 'App.Kaelin.State.global.new':
                                            var $2868 = self.map;
                                            var $2869 = $2868;
                                            return $2869;
                                    };
                                })()), $2865, $2866);
                                var _new_glob$11 = $2867;
                                break;
                        };
                        var $2839 = _new_glob$11;
                        var $2837 = $2839;
                        break;
                };
                var $2835 = $2837;
                break;
        };
        return $2835;
    };
    const App$Kaelin$Action$end_action_turn = x0 => App$Kaelin$Action$end_action_turn$(x0);

    function App$Kaelin$App$tick$(_tick$1, _glob$2) {
        var self = _glob$2;
        switch (self._) {
            case 'App.Kaelin.State.global.new':
                var $2871 = self.round;
                var $2872 = self.room;
                var $2873 = self.map;
                var $2874 = self.stage;
                var $2875 = self.skills_list;
                var $2876 = App$Kaelin$State$global$new$($2871, (((() => {
                    var self = _glob$2;
                    switch (self._) {
                        case 'App.Kaelin.State.global.new':
                            var $2877 = self.tick;
                            var $2878 = $2877;
                            return $2878;
                    };
                })() + 1n) & 0xFFFFFFFFFFFFFFFFn), $2872, $2873, $2874, $2875);
                var _glob$3 = $2876;
                break;
        };
        var self = _glob$3;
        switch (self._) {
            case 'App.Kaelin.State.global.new':
                var $2879 = self.stage;
                var $2880 = $2879;
                var _stage$4 = $2880;
                break;
        };
        var self = _stage$4;
        switch (self._) {
            case 'App.Kaelin.Stage.planning':
                var $2881 = self.control_map;
                var $2882 = self.local_tick;
                var _stage_seconds$8 = ((((10n - (($2882 / 16n) & 0xFFFFFFFFFFFFFFFFn)) & 0xFFFFFFFFFFFFFFFFn) - 1n) & 0xFFFFFFFFFFFFFFFFn);
                var _ticks_per_round$9 = ((10n * 16n) & 0xFFFFFFFFFFFFFFFFn);
                var self = ($2882 >= _ticks_per_round$9);
                if (self) {
                    var self = _glob$3;
                    switch (self._) {
                        case 'App.Kaelin.State.global.new':
                            var $2885 = self.round;
                            var $2886 = self.tick;
                            var $2887 = self.room;
                            var $2888 = self.map;
                            var $2889 = self.stage;
                            var $2890 = App$Kaelin$State$global$new$($2885, $2886, $2887, $2888, $2889, List$reverse$((() => {
                                var self = _glob$3;
                                switch (self._) {
                                    case 'App.Kaelin.State.global.new':
                                        var $2891 = self.skills_list;
                                        var $2892 = $2891;
                                        return $2892;
                                };
                            })()));
                            var _new_glob$10 = $2890;
                            break;
                    };
                    var self = _new_glob$10;
                    switch (self._) {
                        case 'App.Kaelin.State.global.new':
                            var $2893 = self.round;
                            var $2894 = self.tick;
                            var $2895 = self.room;
                            var $2896 = self.map;
                            var $2897 = self.skills_list;
                            var $2898 = App$Kaelin$State$global$new$($2893, $2894, $2895, $2896, App$Kaelin$Stage$action, $2897);
                            var _new_glob$11 = $2898;
                            break;
                    };
                    var $2884 = _new_glob$11;
                    var $2883 = $2884;
                } else {
                    var self = _glob$3;
                    switch (self._) {
                        case 'App.Kaelin.State.global.new':
                            var $2900 = self.round;
                            var $2901 = self.tick;
                            var $2902 = self.room;
                            var $2903 = self.map;
                            var $2904 = self.skills_list;
                            var $2905 = App$Kaelin$State$global$new$($2900, $2901, $2902, $2903, App$Kaelin$Stage$planning$($2881, (($2882 + 1n) & 0xFFFFFFFFFFFFFFFFn), _stage_seconds$8), $2904);
                            var $2899 = $2905;
                            break;
                    };
                    var $2883 = $2899;
                };
                var $2870 = $2883;
                break;
            case 'App.Kaelin.Stage.init':
                var $2906 = _glob$3;
                var $2870 = $2906;
                break;
            case 'App.Kaelin.Stage.draft':
                var $2907 = App$Kaelin$Stage$draft$end$(_glob$3);
                var $2870 = $2907;
                break;
            case 'App.Kaelin.Stage.action':
                var _glob$5 = App$Kaelin$Action$global$exe_skills_list$((() => {
                    var self = _glob$3;
                    switch (self._) {
                        case 'App.Kaelin.State.global.new':
                            var $2909 = self.skills_list;
                            var $2910 = $2909;
                            return $2910;
                    };
                })(), _glob$3);
                var $2908 = App$Kaelin$Action$end_action_turn$(_glob$5);
                var $2870 = $2908;
                break;
        };
        return $2870;
    };
    const App$Kaelin$App$tick = x0 => x1 => App$Kaelin$App$tick$(x0, x1);

    function App$Kaelin$Event$Buffer$monad$run$(_A$1, _buffer$2, _str$3) {
        var $2911 = Parser$run$((_pst$4 => {
            var self = _pst$4;
            switch (self._) {
                case 'Parser.State.new':
                    var $2913 = self.err;
                    var _reply$10 = _buffer$2(List$nil)(_pst$4);
                    var self = _reply$10;
                    switch (self._) {
                        case 'Parser.Reply.error':
                            var $2915 = self.err;
                            var self = $2913;
                            switch (self._) {
                                case 'Maybe.some':
                                    var $2917 = self.value;
                                    var $2918 = Parser$Reply$error$(Parser$Error$combine$($2917, $2915));
                                    var $2916 = $2918;
                                    break;
                                case 'Maybe.none':
                                    var $2919 = Parser$Reply$error$($2915);
                                    var $2916 = $2919;
                                    break;
                            };
                            var $2914 = $2916;
                            break;
                        case 'Parser.Reply.value':
                            var $2920 = self.pst;
                            var $2921 = self.val;
                            var self = $2920;
                            switch (self._) {
                                case 'Parser.State.new':
                                    var $2923 = self.err;
                                    var $2924 = self.nam;
                                    var $2925 = self.ini;
                                    var $2926 = self.idx;
                                    var $2927 = self.str;
                                    var _reply$pst$18 = Parser$State$new$(Parser$Error$maybe_combine$($2913, $2923), $2924, $2925, $2926, $2927);
                                    var $2928 = Parser$Reply$value$(_reply$pst$18, Pair$snd$($2921));
                                    var $2922 = $2928;
                                    break;
                            };
                            var $2914 = $2922;
                            break;
                    };
                    var $2912 = $2914;
                    break;
            };
            return $2912;
        }), _str$3);
        return $2911;
    };
    const App$Kaelin$Event$Buffer$monad$run = x0 => x1 => x2 => App$Kaelin$Event$Buffer$monad$run$(x0, x1, x2);

    function Parser$fail$(_error$2, _pst$3) {
        var self = _pst$3;
        switch (self._) {
            case 'Parser.State.new':
                var $2930 = self.nam;
                var $2931 = self.ini;
                var $2932 = self.idx;
                var $2933 = Parser$Reply$fail$($2930, $2931, $2932, _error$2);
                var $2929 = $2933;
                break;
        };
        return $2929;
    };
    const Parser$fail = x0 => x1 => Parser$fail$(x0, x1);

    function Parser$one$(_pst$1) {
        var self = _pst$1;
        switch (self._) {
            case 'Parser.State.new':
                var $2935 = self.err;
                var $2936 = self.nam;
                var $2937 = self.ini;
                var $2938 = self.idx;
                var $2939 = self.str;
                var self = $2939;
                if (self.length === 0) {
                    var $2941 = Parser$Reply$fail$($2936, $2937, $2938, "Unexpected end of file.");
                    var $2940 = $2941;
                } else {
                    var $2942 = self.charCodeAt(0);
                    var $2943 = self.slice(1);
                    var _pst$9 = Parser$State$new$($2935, $2936, $2937, Nat$succ$($2938), $2943);
                    var $2944 = Parser$Reply$value$(_pst$9, $2942);
                    var $2940 = $2944;
                };
                var $2934 = $2940;
                break;
        };
        return $2934;
    };
    const Parser$one = x0 => Parser$one$(x0);

    function Char$to_string$(_chr$1) {
        var $2945 = String$cons$(_chr$1, String$nil);
        return $2945;
    };
    const Char$to_string = x0 => Char$to_string$(x0);

    function Parser$drop$go$(_x$1, _p$2) {
        var Parser$drop$go$ = (_x$1, _p$2) => ({
            ctr: 'TCO',
            arg: [_x$1, _p$2]
        });
        var Parser$drop$go = _x$1 => _p$2 => Parser$drop$go$(_x$1, _p$2);
        var arg = [_x$1, _p$2];
        while (true) {
            let [_x$1, _p$2] = arg;
            var R = (() => {
                var self = _x$1;
                if (self === 0n) {
                    var $2946 = _p$2;
                    return $2946;
                } else {
                    var $2947 = (self - 1n);
                    var $2948 = Parser$drop$go$($2947, (_pst$4 => {
                        var self = _pst$4;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $2950 = self.err;
                                var _reply$10 = Parser$one$(_pst$4);
                                var self = _reply$10;
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $2952 = self.err;
                                        var self = $2950;
                                        switch (self._) {
                                            case 'Maybe.some':
                                                var $2954 = self.value;
                                                var $2955 = Parser$Reply$error$(Parser$Error$combine$($2954, $2952));
                                                var $2953 = $2955;
                                                break;
                                            case 'Maybe.none':
                                                var $2956 = Parser$Reply$error$($2952);
                                                var $2953 = $2956;
                                                break;
                                        };
                                        var $2951 = $2953;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $2957 = self.pst;
                                        var $2958 = self.val;
                                        var self = $2957;
                                        switch (self._) {
                                            case 'Parser.State.new':
                                                var $2960 = self.err;
                                                var $2961 = self.nam;
                                                var $2962 = self.ini;
                                                var $2963 = self.idx;
                                                var $2964 = self.str;
                                                var _reply$pst$18 = Parser$State$new$(Parser$Error$maybe_combine$($2950, $2960), $2961, $2962, $2963, $2964);
                                                var self = _reply$pst$18;
                                                switch (self._) {
                                                    case 'Parser.State.new':
                                                        var $2966 = self.err;
                                                        var _reply$24 = _p$2(_reply$pst$18);
                                                        var self = _reply$24;
                                                        switch (self._) {
                                                            case 'Parser.Reply.error':
                                                                var $2968 = self.err;
                                                                var self = $2966;
                                                                switch (self._) {
                                                                    case 'Maybe.some':
                                                                        var $2970 = self.value;
                                                                        var $2971 = Parser$Reply$error$(Parser$Error$combine$($2970, $2968));
                                                                        var $2969 = $2971;
                                                                        break;
                                                                    case 'Maybe.none':
                                                                        var $2972 = Parser$Reply$error$($2968);
                                                                        var $2969 = $2972;
                                                                        break;
                                                                };
                                                                var $2967 = $2969;
                                                                break;
                                                            case 'Parser.Reply.value':
                                                                var $2973 = self.pst;
                                                                var $2974 = self.val;
                                                                var self = $2973;
                                                                switch (self._) {
                                                                    case 'Parser.State.new':
                                                                        var $2976 = self.err;
                                                                        var $2977 = self.nam;
                                                                        var $2978 = self.ini;
                                                                        var $2979 = self.idx;
                                                                        var $2980 = self.str;
                                                                        var _reply$pst$32 = Parser$State$new$(Parser$Error$maybe_combine$($2966, $2976), $2977, $2978, $2979, $2980);
                                                                        var $2981 = Parser$Reply$value$(_reply$pst$32, (Char$to_string$($2958) + $2974));
                                                                        var $2975 = $2981;
                                                                        break;
                                                                };
                                                                var $2967 = $2975;
                                                                break;
                                                        };
                                                        var $2965 = $2967;
                                                        break;
                                                };
                                                var $2959 = $2965;
                                                break;
                                        };
                                        var $2951 = $2959;
                                        break;
                                };
                                var $2949 = $2951;
                                break;
                        };
                        return $2949;
                    }));
                    return $2948;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Parser$drop$go = x0 => x1 => Parser$drop$go$(x0, x1);

    function Parser$ignore$(_x$1) {
        var $2982 = Parser$drop$go$(_x$1, (_pst$2 => {
            var $2983 = Parser$Reply$value$(_pst$2, "");
            return $2983;
        }));
        return $2982;
    };
    const Parser$ignore = x0 => Parser$ignore$(x0);

    function App$Kaelin$Event$Buffer$monad$pure$(_x$2, _ls$3, _pst$4) {
        var $2984 = Parser$Reply$value$(_pst$4, Pair$new$(_ls$3, _x$2));
        return $2984;
    };
    const App$Kaelin$Event$Buffer$monad$pure = x0 => x1 => x2 => App$Kaelin$Event$Buffer$monad$pure$(x0, x1, x2);

    function App$Kaelin$Event$Buffer$hex$(_A$1, _f$2, _ls$3) {
        var self = _ls$3;
        switch (self._) {
            case 'List.cons':
                var $2986 = self.head;
                var $2987 = self.tail;
                var $2988 = (_pst$6 => {
                    var self = _pst$6;
                    switch (self._) {
                        case 'Parser.State.new':
                            var $2990 = self.err;
                            var _reply$12 = Parser$ignore$((BigInt($2986)))(_pst$6);
                            var self = _reply$12;
                            switch (self._) {
                                case 'Parser.Reply.error':
                                    var $2992 = self.err;
                                    var self = $2990;
                                    switch (self._) {
                                        case 'Maybe.some':
                                            var $2994 = self.value;
                                            var $2995 = Parser$Reply$error$(Parser$Error$combine$($2994, $2992));
                                            var $2993 = $2995;
                                            break;
                                        case 'Maybe.none':
                                            var $2996 = Parser$Reply$error$($2992);
                                            var $2993 = $2996;
                                            break;
                                    };
                                    var $2991 = $2993;
                                    break;
                                case 'Parser.Reply.value':
                                    var $2997 = self.pst;
                                    var $2998 = self.val;
                                    var self = $2997;
                                    switch (self._) {
                                        case 'Parser.State.new':
                                            var $3000 = self.err;
                                            var $3001 = self.nam;
                                            var $3002 = self.ini;
                                            var $3003 = self.idx;
                                            var $3004 = self.str;
                                            var _reply$pst$20 = Parser$State$new$(Parser$Error$maybe_combine$($2990, $3000), $3001, $3002, $3003, $3004);
                                            var $3005 = App$Kaelin$Event$Buffer$monad$pure$(_f$2($2998), $2987, _reply$pst$20);
                                            var $2999 = $3005;
                                            break;
                                    };
                                    var $2991 = $2999;
                                    break;
                            };
                            var $2989 = $2991;
                            break;
                    };
                    return $2989;
                });
                var $2985 = $2988;
                break;
            case 'List.nil':
                var $3006 = Parser$fail("The buffer is empty");
                var $2985 = $3006;
                break;
        };
        return $2985;
    };
    const App$Kaelin$Event$Buffer$hex = x0 => x1 => x2 => App$Kaelin$Event$Buffer$hex$(x0, x1, x2);
    const App$Kaelin$Event$Buffer$next = App$Kaelin$Event$Buffer$hex(null)(App$Kaelin$Event$Code$Hex$to_nat);

    function App$Kaelin$Event$Buffer$push$(_list$1, _ls$2, _pst$3) {
        var $3007 = Parser$Reply$value$(_pst$3, Pair$new$(List$concat$(_ls$2, _list$1), Unit$new));
        return $3007;
    };
    const App$Kaelin$Event$Buffer$push = x0 => x1 => x2 => App$Kaelin$Event$Buffer$push$(x0, x1, x2);

    function App$Kaelin$Event$Buffer$fail$(_ls$2) {
        var $3008 = Parser$fail("Falhou");
        return $3008;
    };
    const App$Kaelin$Event$Buffer$fail = x0 => App$Kaelin$Event$Buffer$fail$(x0);

    function App$Kaelin$Event$Buffer$monad$bind$(_x$3, _f$4, _ls$5, _pst$6) {
        var self = _pst$6;
        switch (self._) {
            case 'Parser.State.new':
                var $3010 = self.err;
                var _reply$12 = _x$3(_ls$5)(_pst$6);
                var self = _reply$12;
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $3012 = self.err;
                        var self = $3010;
                        switch (self._) {
                            case 'Maybe.some':
                                var $3014 = self.value;
                                var $3015 = Parser$Reply$error$(Parser$Error$combine$($3014, $3012));
                                var $3013 = $3015;
                                break;
                            case 'Maybe.none':
                                var $3016 = Parser$Reply$error$($3012);
                                var $3013 = $3016;
                                break;
                        };
                        var $3011 = $3013;
                        break;
                    case 'Parser.Reply.value':
                        var $3017 = self.pst;
                        var $3018 = self.val;
                        var self = $3017;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $3020 = self.err;
                                var $3021 = self.nam;
                                var $3022 = self.ini;
                                var $3023 = self.idx;
                                var $3024 = self.str;
                                var _reply$pst$20 = Parser$State$new$(Parser$Error$maybe_combine$($3010, $3020), $3021, $3022, $3023, $3024);
                                var self = _reply$pst$20;
                                switch (self._) {
                                    case 'Parser.State.new':
                                        var $3026 = self.err;
                                        var _reply$26 = _f$4(Pair$snd$($3018))(Pair$fst$($3018))(_reply$pst$20);
                                        var self = _reply$26;
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $3028 = self.err;
                                                var self = $3026;
                                                switch (self._) {
                                                    case 'Maybe.some':
                                                        var $3030 = self.value;
                                                        var $3031 = Parser$Reply$error$(Parser$Error$combine$($3030, $3028));
                                                        var $3029 = $3031;
                                                        break;
                                                    case 'Maybe.none':
                                                        var $3032 = Parser$Reply$error$($3028);
                                                        var $3029 = $3032;
                                                        break;
                                                };
                                                var $3027 = $3029;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $3033 = self.pst;
                                                var $3034 = self.val;
                                                var self = $3033;
                                                switch (self._) {
                                                    case 'Parser.State.new':
                                                        var $3036 = self.err;
                                                        var $3037 = self.nam;
                                                        var $3038 = self.ini;
                                                        var $3039 = self.idx;
                                                        var $3040 = self.str;
                                                        var _reply$pst$34 = Parser$State$new$(Parser$Error$maybe_combine$($3026, $3036), $3037, $3038, $3039, $3040);
                                                        var $3041 = Parser$Reply$value$(_reply$pst$34, Pair$new$(List$concat$(_ls$5, Pair$fst$($3034)), Pair$snd$($3034)));
                                                        var $3035 = $3041;
                                                        break;
                                                };
                                                var $3027 = $3035;
                                                break;
                                        };
                                        var $3025 = $3027;
                                        break;
                                };
                                var $3019 = $3025;
                                break;
                        };
                        var $3011 = $3019;
                        break;
                };
                var $3009 = $3011;
                break;
        };
        return $3009;
    };
    const App$Kaelin$Event$Buffer$monad$bind = x0 => x1 => x2 => x3 => App$Kaelin$Event$Buffer$monad$bind$(x0, x1, x2, x3);

    function App$Kaelin$Event$Buffer$monad$(_new$2) {
        var $3042 = _new$2(App$Kaelin$Event$Buffer$monad$bind)(App$Kaelin$Event$Buffer$monad$pure);
        return $3042;
    };
    const App$Kaelin$Event$Buffer$monad = x0 => App$Kaelin$Event$Buffer$monad$(x0);

    function App$Kaelin$Event$Buffer$(_A$1) {
        var $3043 = null;
        return $3043;
    };
    const App$Kaelin$Event$Buffer = x0 => App$Kaelin$Event$Buffer$(x0);

    function App$Kaelin$Event$create_hero$(_hero_id$1) {
        var $3044 = ({
            _: 'App.Kaelin.Event.create_hero',
            'hero_id': _hero_id$1
        });
        return $3044;
    };
    const App$Kaelin$Event$create_hero = x0 => App$Kaelin$Event$create_hero$(x0);
    const App$Kaelin$Action$walk = ({
        _: 'App.Kaelin.Action.walk'
    });
    const App$Kaelin$Action$ability_0 = ({
        _: 'App.Kaelin.Action.ability_0'
    });
    const App$Kaelin$Action$ability_1 = ({
        _: 'App.Kaelin.Action.ability_1'
    });
    const App$Kaelin$Resources$Action$to_action = App$Kaelin$Event$Buffer$monad$((_m$bind$1 => _m$pure$2 => {
        var $3045 = _m$bind$1;
        return $3045;
    }))(App$Kaelin$Event$Buffer$next)((_id$1 => {
        var self = (_id$1 === 0n);
        if (self) {
            var $3047 = App$Kaelin$Event$Buffer$monad$pure(App$Kaelin$Action$walk);
            var $3046 = $3047;
        } else {
            var self = (_id$1 === 1n);
            if (self) {
                var $3049 = App$Kaelin$Event$Buffer$monad$pure(App$Kaelin$Action$ability_0);
                var $3048 = $3049;
            } else {
                var self = (_id$1 === 2n);
                if (self) {
                    var $3051 = App$Kaelin$Event$Buffer$monad$pure(App$Kaelin$Action$ability_1);
                    var $3050 = $3051;
                } else {
                    var $3052 = App$Kaelin$Event$Buffer$fail;
                    var $3050 = $3052;
                };
                var $3048 = $3050;
            };
            var $3046 = $3048;
        };
        return $3046;
    }));

    function App$Kaelin$Event$user_input$(_player$1, _coord$2, _action$3) {
        var $3053 = ({
            _: 'App.Kaelin.Event.user_input',
            'player': _player$1,
            'coord': _coord$2,
            'action': _action$3
        });
        return $3053;
    };
    const App$Kaelin$Event$user_input = x0 => x1 => x2 => App$Kaelin$Event$user_input$(x0, x1, x2);

    function App$Kaelin$Event$exe_skill$(_player$1, _target_pos$2, _key$3) {
        var $3054 = ({
            _: 'App.Kaelin.Event.exe_skill',
            'player': _player$1,
            'target_pos': _target_pos$2,
            'key': _key$3
        });
        return $3054;
    };
    const App$Kaelin$Event$exe_skill = x0 => x1 => x2 => App$Kaelin$Event$exe_skill$(x0, x1, x2);
    const App$Kaelin$Team$red = ({
        _: 'App.Kaelin.Team.red'
    });
    const App$Kaelin$Team$blue = ({
        _: 'App.Kaelin.Team.blue'
    });

    function App$Kaelin$Team$decode$(_n$1) {
        var self = (_n$1 === 1);
        if (self) {
            var $3056 = App$Kaelin$Team$red;
            var $3055 = $3056;
        } else {
            var self = (_n$1 === 2);
            if (self) {
                var $3058 = App$Kaelin$Team$blue;
                var $3057 = $3058;
            } else {
                var $3059 = App$Kaelin$Team$neutral;
                var $3057 = $3059;
            };
            var $3055 = $3057;
        };
        return $3055;
    };
    const App$Kaelin$Team$decode = x0 => App$Kaelin$Team$decode$(x0);
    const App$Kaelin$Event$end_action = ({
        _: 'App.Kaelin.Event.end_action'
    });
    const App$Kaelin$Event$control_map = ({
        _: 'App.Kaelin.Event.control_map'
    });
    const App$Kaelin$Event$deserialize_scheme = App$Kaelin$Event$Buffer$monad$((_m$bind$1 => _m$pure$2 => {
        var $3060 = _m$bind$1;
        return $3060;
    }))(App$Kaelin$Event$Buffer$push(App$Kaelin$Event$Code$action))((_$1 => {
        var $3061 = App$Kaelin$Event$Buffer$monad$((_m$bind$2 => _m$pure$3 => {
            var $3062 = _m$bind$2;
            return $3062;
        }))(App$Kaelin$Event$Buffer$next)((_id_event$2 => {
            var self = (_id_event$2 === 1n);
            if (self) {
                var $3064 = App$Kaelin$Event$Buffer$monad$((_m$bind$3 => _m$pure$4 => {
                    var $3065 = _m$bind$3;
                    return $3065;
                }))(App$Kaelin$Event$Buffer$push(App$Kaelin$Event$Code$create_hero))((_$3 => {
                    var $3066 = App$Kaelin$Event$Buffer$monad$((_m$bind$4 => _m$pure$5 => {
                        var $3067 = _m$bind$4;
                        return $3067;
                    }))(App$Kaelin$Event$Buffer$next)((_id_hero$4 => {
                        var $3068 = App$Kaelin$Event$Buffer$monad$((_m$bind$5 => _m$pure$6 => {
                            var $3069 = _m$pure$6;
                            return $3069;
                        }))(App$Kaelin$Event$create_hero$((Number(_id_hero$4) & 0xFF)));
                        return $3068;
                    }));
                    return $3066;
                }));
                var $3063 = $3064;
            } else {
                var self = (_id_event$2 === 4n);
                if (self) {
                    var $3071 = App$Kaelin$Event$Buffer$monad$((_m$bind$3 => _m$pure$4 => {
                        var $3072 = _m$bind$3;
                        return $3072;
                    }))(App$Kaelin$Event$Buffer$push(App$Kaelin$Event$Code$user_input))((_$3 => {
                        var $3073 = App$Kaelin$Event$Buffer$monad$((_m$bind$4 => _m$pure$5 => {
                            var $3074 = _m$bind$4;
                            return $3074;
                        }))(App$Kaelin$Event$Buffer$hex(null)((_x$4 => {
                            var $3075 = _x$4;
                            return $3075;
                        })))((_player$4 => {
                            var $3076 = App$Kaelin$Event$Buffer$monad$((_m$bind$5 => _m$pure$6 => {
                                var $3077 = _m$bind$5;
                                return $3077;
                            }))(App$Kaelin$Resources$Action$to_action)((_action$5 => {
                                var $3078 = App$Kaelin$Event$Buffer$monad$((_m$bind$6 => _m$pure$7 => {
                                    var $3079 = _m$bind$6;
                                    return $3079;
                                }))(App$Kaelin$Event$Buffer$next)((_pos$6 => {
                                    var $3080 = App$Kaelin$Event$Buffer$monad$((_m$bind$7 => _m$pure$8 => {
                                        var $3081 = _m$pure$8;
                                        return $3081;
                                    }))(App$Kaelin$Event$user_input$(("0x" + _player$4), App$Kaelin$Coord$Convert$nat_to_axial$(_pos$6), _action$5));
                                    return $3080;
                                }));
                                return $3078;
                            }));
                            return $3076;
                        }));
                        return $3073;
                    }));
                    var $3070 = $3071;
                } else {
                    var self = (_id_event$2 === 5n);
                    if (self) {
                        var $3083 = App$Kaelin$Event$Buffer$monad$((_m$bind$3 => _m$pure$4 => {
                            var $3084 = _m$bind$3;
                            return $3084;
                        }))(App$Kaelin$Event$Buffer$push(App$Kaelin$Event$Code$exe_skill))((_$3 => {
                            var $3085 = App$Kaelin$Event$Buffer$monad$((_m$bind$4 => _m$pure$5 => {
                                var $3086 = _m$bind$4;
                                return $3086;
                            }))(App$Kaelin$Event$Buffer$hex(null)((_x$4 => {
                                var $3087 = _x$4;
                                return $3087;
                            })))((_player$4 => {
                                var $3088 = App$Kaelin$Event$Buffer$monad$((_m$bind$5 => _m$pure$6 => {
                                    var $3089 = _m$bind$5;
                                    return $3089;
                                }))(App$Kaelin$Event$Buffer$next)((_mouse_pos$5 => {
                                    var $3090 = App$Kaelin$Event$Buffer$monad$((_m$bind$6 => _m$pure$7 => {
                                        var $3091 = _m$bind$6;
                                        return $3091;
                                    }))(App$Kaelin$Event$Buffer$next)((_key$6 => {
                                        var $3092 = App$Kaelin$Event$Buffer$monad$((_m$bind$7 => _m$pure$8 => {
                                            var $3093 = _m$pure$8;
                                            return $3093;
                                        }))(App$Kaelin$Event$exe_skill$(("0x" + _player$4), App$Kaelin$Coord$Convert$nat_to_axial$(_mouse_pos$5), (Number(_key$6) & 0xFFFF)));
                                        return $3092;
                                    }));
                                    return $3090;
                                }));
                                return $3088;
                            }));
                            return $3085;
                        }));
                        var $3082 = $3083;
                    } else {
                        var self = (_id_event$2 === 11n);
                        if (self) {
                            var $3095 = App$Kaelin$Event$Buffer$monad$((_m$bind$3 => _m$pure$4 => {
                                var $3096 = _m$bind$3;
                                return $3096;
                            }))(App$Kaelin$Event$Buffer$push(App$Kaelin$Event$Code$save_skill))((_$3 => {
                                var $3097 = App$Kaelin$Event$Buffer$monad$((_m$bind$4 => _m$pure$5 => {
                                    var $3098 = _m$bind$4;
                                    return $3098;
                                }))(App$Kaelin$Event$Buffer$hex(null)((_x$4 => {
                                    var $3099 = _x$4;
                                    return $3099;
                                })))((_player$4 => {
                                    var $3100 = App$Kaelin$Event$Buffer$monad$((_m$bind$5 => _m$pure$6 => {
                                        var $3101 = _m$bind$5;
                                        return $3101;
                                    }))(App$Kaelin$Event$Buffer$next)((_mouse_pos$5 => {
                                        var $3102 = App$Kaelin$Event$Buffer$monad$((_m$bind$6 => _m$pure$7 => {
                                            var $3103 = _m$bind$6;
                                            return $3103;
                                        }))(App$Kaelin$Event$Buffer$next)((_key$6 => {
                                            var $3104 = App$Kaelin$Event$Buffer$monad$((_m$bind$7 => _m$pure$8 => {
                                                var $3105 = _m$bind$7;
                                                return $3105;
                                            }))(App$Kaelin$Event$Buffer$next)((_team$7 => {
                                                var $3106 = App$Kaelin$Event$Buffer$monad$((_m$bind$8 => _m$pure$9 => {
                                                    var $3107 = _m$pure$9;
                                                    return $3107;
                                                }))(App$Kaelin$Event$save_skill$(("0x" + _player$4), App$Kaelin$Coord$Convert$nat_to_axial$(_mouse_pos$5), (Number(_key$6) & 0xFFFF), App$Kaelin$Team$decode$((Number(_team$7) & 0xFF))));
                                                return $3106;
                                            }));
                                            return $3104;
                                        }));
                                        return $3102;
                                    }));
                                    return $3100;
                                }));
                                return $3097;
                            }));
                            var $3094 = $3095;
                        } else {
                            var self = (_id_event$2 === 13n);
                            if (self) {
                                var $3109 = App$Kaelin$Event$Buffer$monad$((_m$bind$3 => _m$pure$4 => {
                                    var $3110 = _m$pure$4;
                                    return $3110;
                                }))(App$Kaelin$Event$end_action);
                                var $3108 = $3109;
                            } else {
                                var self = (_id_event$2 === 12n);
                                if (self) {
                                    var $3112 = App$Kaelin$Event$Buffer$monad$((_m$bind$3 => _m$pure$4 => {
                                        var $3113 = _m$bind$3;
                                        return $3113;
                                    }))(App$Kaelin$Event$Buffer$push(App$Kaelin$Event$Code$remove_skill))((_$3 => {
                                        var $3114 = App$Kaelin$Event$Buffer$monad$((_m$bind$4 => _m$pure$5 => {
                                            var $3115 = _m$bind$4;
                                            return $3115;
                                        }))(App$Kaelin$Event$Buffer$hex(null)((_x$4 => {
                                            var $3116 = _x$4;
                                            return $3116;
                                        })))((_player$4 => {
                                            var $3117 = App$Kaelin$Event$Buffer$monad$((_m$bind$5 => _m$pure$6 => {
                                                var $3118 = _m$bind$5;
                                                return $3118;
                                            }))(App$Kaelin$Event$Buffer$next)((_mouse_pos$5 => {
                                                var $3119 = App$Kaelin$Event$Buffer$monad$((_m$bind$6 => _m$pure$7 => {
                                                    var $3120 = _m$bind$6;
                                                    return $3120;
                                                }))(App$Kaelin$Event$Buffer$next)((_key$6 => {
                                                    var $3121 = App$Kaelin$Event$Buffer$monad$((_m$bind$7 => _m$pure$8 => {
                                                        var $3122 = _m$bind$7;
                                                        return $3122;
                                                    }))(App$Kaelin$Event$Buffer$next)((_team$7 => {
                                                        var $3123 = App$Kaelin$Event$Buffer$monad$((_m$bind$8 => _m$pure$9 => {
                                                            var $3124 = _m$pure$9;
                                                            return $3124;
                                                        }))(App$Kaelin$Event$remove_skill$(("0x" + _player$4), App$Kaelin$Coord$Convert$nat_to_axial$(_mouse_pos$5), (Number(_key$6) & 0xFFFF), App$Kaelin$Team$decode$((Number(_team$7) & 0xFF))));
                                                        return $3123;
                                                    }));
                                                    return $3121;
                                                }));
                                                return $3119;
                                            }));
                                            return $3117;
                                        }));
                                        return $3114;
                                    }));
                                    var $3111 = $3112;
                                } else {
                                    var self = (_id_event$2 === 6n);
                                    if (self) {
                                        var $3126 = App$Kaelin$Event$Buffer$monad$((_m$bind$3 => _m$pure$4 => {
                                            var $3127 = _m$bind$3;
                                            return $3127;
                                        }))(App$Kaelin$Event$Buffer$push(App$Kaelin$Event$Code$draft_hero))((_$3 => {
                                            var $3128 = App$Kaelin$Event$Buffer$monad$((_m$bind$4 => _m$pure$5 => {
                                                var $3129 = _m$bind$4;
                                                return $3129;
                                            }))(App$Kaelin$Event$Buffer$next)((_id_hero$4 => {
                                                var $3130 = App$Kaelin$Event$Buffer$monad$((_m$bind$5 => _m$pure$6 => {
                                                    var $3131 = _m$pure$6;
                                                    return $3131;
                                                }))(App$Kaelin$Event$draft_hero$((Number(_id_hero$4) & 0xFF)));
                                                return $3130;
                                            }));
                                            return $3128;
                                        }));
                                        var $3125 = $3126;
                                    } else {
                                        var self = (_id_event$2 === 7n);
                                        if (self) {
                                            var $3133 = App$Kaelin$Event$Buffer$monad$((_m$bind$3 => _m$pure$4 => {
                                                var $3134 = _m$bind$3;
                                                return $3134;
                                            }))(App$Kaelin$Event$Buffer$push(App$Kaelin$Event$Code$draft_coord))((_$3 => {
                                                var $3135 = App$Kaelin$Event$Buffer$monad$((_m$bind$4 => _m$pure$5 => {
                                                    var $3136 = _m$bind$4;
                                                    return $3136;
                                                }))(App$Kaelin$Event$Buffer$next)((_coord$4 => {
                                                    var $3137 = App$Kaelin$Event$Buffer$monad$((_m$bind$5 => _m$pure$6 => {
                                                        var $3138 = _m$pure$6;
                                                        return $3138;
                                                    }))(App$Kaelin$Event$draft_coord$(App$Kaelin$Coord$Convert$nat_to_axial$(_coord$4)));
                                                    return $3137;
                                                }));
                                                return $3135;
                                            }));
                                            var $3132 = $3133;
                                        } else {
                                            var self = (_id_event$2 === 9n);
                                            if (self) {
                                                var $3140 = App$Kaelin$Event$Buffer$monad$((_m$bind$3 => _m$pure$4 => {
                                                    var $3141 = _m$pure$4;
                                                    return $3141;
                                                }))(App$Kaelin$Event$to_draft);
                                                var $3139 = $3140;
                                            } else {
                                                var self = (_id_event$2 === 10n);
                                                if (self) {
                                                    var $3143 = App$Kaelin$Event$Buffer$monad$((_m$bind$3 => _m$pure$4 => {
                                                        var $3144 = _m$bind$3;
                                                        return $3144;
                                                    }))(App$Kaelin$Event$Buffer$push(App$Kaelin$Event$Code$draft_team))((_$3 => {
                                                        var $3145 = App$Kaelin$Event$Buffer$monad$((_m$bind$4 => _m$pure$5 => {
                                                            var $3146 = _m$bind$4;
                                                            return $3146;
                                                        }))(App$Kaelin$Event$Buffer$next)((_team$4 => {
                                                            var $3147 = App$Kaelin$Event$Buffer$monad$((_m$bind$5 => _m$pure$6 => {
                                                                var $3148 = _m$pure$6;
                                                                return $3148;
                                                            }))(App$Kaelin$Event$draft_team$((Number(_team$4) & 0xFF)));
                                                            return $3147;
                                                        }));
                                                        return $3145;
                                                    }));
                                                    var $3142 = $3143;
                                                } else {
                                                    var self = (_id_event$2 === 14n);
                                                    if (self) {
                                                        var $3150 = App$Kaelin$Event$Buffer$monad$((_m$bind$3 => _m$pure$4 => {
                                                            var $3151 = _m$bind$3;
                                                            return $3151;
                                                        }))(App$Kaelin$Event$Buffer$push(App$Kaelin$Event$Code$draft_ready))((_$3 => {
                                                            var $3152 = App$Kaelin$Event$Buffer$monad$((_m$bind$4 => _m$pure$5 => {
                                                                var $3153 = _m$bind$4;
                                                                return $3153;
                                                            }))(App$Kaelin$Event$Buffer$next)((_ready$4 => {
                                                                var $3154 = App$Kaelin$Event$Buffer$monad$((_m$bind$5 => _m$pure$6 => {
                                                                    var $3155 = _m$pure$6;
                                                                    return $3155;
                                                                }))(App$Kaelin$Event$draft_ready$((Number(_ready$4) & 0xFF)));
                                                                return $3154;
                                                            }));
                                                            return $3152;
                                                        }));
                                                        var $3149 = $3150;
                                                    } else {
                                                        var self = (_id_event$2 === 15n);
                                                        if (self) {
                                                            var $3157 = App$Kaelin$Event$Buffer$monad$((_m$bind$3 => _m$pure$4 => {
                                                                var $3158 = _m$pure$4;
                                                                return $3158;
                                                            }))(App$Kaelin$Event$control_map);
                                                            var $3156 = $3157;
                                                        } else {
                                                            var $3159 = App$Kaelin$Event$Buffer$fail;
                                                            var $3156 = $3159;
                                                        };
                                                        var $3149 = $3156;
                                                    };
                                                    var $3142 = $3149;
                                                };
                                                var $3139 = $3142;
                                            };
                                            var $3132 = $3139;
                                        };
                                        var $3125 = $3132;
                                    };
                                    var $3111 = $3125;
                                };
                                var $3108 = $3111;
                            };
                            var $3094 = $3108;
                        };
                        var $3082 = $3094;
                    };
                    var $3070 = $3082;
                };
                var $3063 = $3070;
            };
            return $3063;
        }));
        return $3061;
    }));

    function App$Kaelin$Event$deserialize$(_code$1) {
        var $3160 = App$Kaelin$Event$Buffer$monad$run$(null, App$Kaelin$Event$deserialize_scheme, _code$1);
        return $3160;
    };
    const App$Kaelin$Event$deserialize = x0 => App$Kaelin$Event$deserialize$(x0);

    function App$Kaelin$Action$create_player$(_user$1, _hero$2, _glob$3) {
        var _key$4 = _user$1;
        var _init_pos$5 = App$Kaelin$Coord$new$(0, 0);
        var self = App$Kaelin$Map$player$info$(_user$1, (() => {
            var self = _glob$3;
            switch (self._) {
                case 'App.Kaelin.State.global.new':
                    var $3162 = self.map;
                    var $3163 = $3162;
                    return $3163;
            };
        })());
        switch (self._) {
            case 'Maybe.none':
                var _new_creature$6 = App$Kaelin$Tile$creature$create$(_hero$2, Maybe$some$(_user$1), App$Kaelin$Team$blue);
                var _entity$7 = App$Kaelin$Map$Entity$creature$(_new_creature$6);
                var _map$8 = App$Kaelin$Map$push$(_init_pos$5, _entity$7, (() => {
                    var self = _glob$3;
                    switch (self._) {
                        case 'App.Kaelin.State.global.new':
                            var $3165 = self.map;
                            var $3166 = $3165;
                            return $3166;
                    };
                })());
                var self = _glob$3;
                switch (self._) {
                    case 'App.Kaelin.State.global.new':
                        var $3167 = self.round;
                        var $3168 = self.tick;
                        var $3169 = self.room;
                        var $3170 = self.stage;
                        var $3171 = self.skills_list;
                        var $3172 = App$Kaelin$State$global$new$($3167, $3168, $3169, _map$8, $3170, $3171);
                        var $3164 = $3172;
                        break;
                };
                var $3161 = $3164;
                break;
            case 'Maybe.some':
                var $3173 = _glob$3;
                var $3161 = $3173;
                break;
        };
        return $3161;
    };
    const App$Kaelin$Action$create_player = x0 => x1 => x2 => App$Kaelin$Action$create_player$(x0, x1, x2);

    function App$Kaelin$CastInfo$global$new$(_player$1, _target_pos$2, _key$3, _team$4) {
        var $3174 = ({
            _: 'App.Kaelin.CastInfo.global.new',
            'player': _player$1,
            'target_pos': _target_pos$2,
            'key': _key$3,
            'team': _team$4
        });
        return $3174;
    };
    const App$Kaelin$CastInfo$global$new = x0 => x1 => x2 => x3 => App$Kaelin$CastInfo$global$new$(x0, x1, x2, x3);

    function App$Kaelin$Action$global$save_skill$(_user$1, _target_pos$2, _key$3, _team$4, _global$5) {
        var self = _global$5;
        switch (self._) {
            case 'App.Kaelin.State.global.new':
                var $3176 = self.round;
                var $3177 = self.tick;
                var $3178 = self.room;
                var $3179 = self.map;
                var $3180 = self.stage;
                var $3181 = App$Kaelin$State$global$new$($3176, $3177, $3178, $3179, $3180, List$cons$(App$Kaelin$CastInfo$global$new$(_user$1, _target_pos$2, _key$3, _team$4), (() => {
                    var self = _global$5;
                    switch (self._) {
                        case 'App.Kaelin.State.global.new':
                            var $3182 = self.skills_list;
                            var $3183 = $3182;
                            return $3183;
                    };
                })()));
                var $3175 = $3181;
                break;
        };
        return $3175;
    };
    const App$Kaelin$Action$global$save_skill = x0 => x1 => x2 => x3 => x4 => App$Kaelin$Action$global$save_skill$(x0, x1, x2, x3, x4);

    function List$delete_by$(_p$2, _a$3, _as$4) {
        var self = _as$4;
        switch (self._) {
            case 'List.cons':
                var $3185 = self.head;
                var $3186 = self.tail;
                var self = _p$2(_a$3)($3185);
                if (self) {
                    var $3188 = List$delete_by$(_p$2, _a$3, $3186);
                    var $3187 = $3188;
                } else {
                    var $3189 = List$cons$($3185, List$delete_by$(_p$2, _a$3, $3186));
                    var $3187 = $3189;
                };
                var $3184 = $3187;
                break;
            case 'List.nil':
                var $3190 = List$nil;
                var $3184 = $3190;
                break;
        };
        return $3184;
    };
    const List$delete_by = x0 => x1 => x2 => List$delete_by$(x0, x1, x2);

    function List$all$(_cond$2, _list$3) {
        var List$all$ = (_cond$2, _list$3) => ({
            ctr: 'TCO',
            arg: [_cond$2, _list$3]
        });
        var List$all = _cond$2 => _list$3 => List$all$(_cond$2, _list$3);
        var arg = [_cond$2, _list$3];
        while (true) {
            let [_cond$2, _list$3] = arg;
            var R = (() => {
                var self = _list$3;
                switch (self._) {
                    case 'List.cons':
                        var $3191 = self.head;
                        var $3192 = self.tail;
                        var self = _cond$2($3191);
                        if (self) {
                            var $3194 = List$all$(_cond$2, $3192);
                            var $3193 = $3194;
                        } else {
                            var $3195 = Bool$false;
                            var $3193 = $3195;
                        };
                        return $3193;
                    case 'List.nil':
                        var $3196 = Bool$true;
                        return $3196;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const List$all = x0 => x1 => List$all$(x0, x1);

    function Function$id$(_x$2) {
        var $3197 = _x$2;
        return $3197;
    };
    const Function$id = x0 => Function$id$(x0);

    function App$Kaelin$CastInfo$global$eql$(_a$1, _b$2) {
        var $3198 = List$all$(Function$id, List$cons$(App$Kaelin$Coord$eql$((() => {
            var self = _a$1;
            switch (self._) {
                case 'App.Kaelin.CastInfo.global.new':
                    var $3199 = self.target_pos;
                    var $3200 = $3199;
                    return $3200;
            };
        })(), (() => {
            var self = _b$2;
            switch (self._) {
                case 'App.Kaelin.CastInfo.global.new':
                    var $3201 = self.target_pos;
                    var $3202 = $3201;
                    return $3202;
            };
        })()), List$cons$(((() => {
            var self = _a$1;
            switch (self._) {
                case 'App.Kaelin.CastInfo.global.new':
                    var $3203 = self.player;
                    var $3204 = $3203;
                    return $3204;
            };
        })() === (() => {
            var self = _b$2;
            switch (self._) {
                case 'App.Kaelin.CastInfo.global.new':
                    var $3205 = self.player;
                    var $3206 = $3205;
                    return $3206;
            };
        })()), List$cons$(((() => {
            var self = _a$1;
            switch (self._) {
                case 'App.Kaelin.CastInfo.global.new':
                    var $3207 = self.key;
                    var $3208 = $3207;
                    return $3208;
            };
        })() === (() => {
            var self = _b$2;
            switch (self._) {
                case 'App.Kaelin.CastInfo.global.new':
                    var $3209 = self.key;
                    var $3210 = $3209;
                    return $3210;
            };
        })()), List$nil))));
        return $3198;
    };
    const App$Kaelin$CastInfo$global$eql = x0 => x1 => App$Kaelin$CastInfo$global$eql$(x0, x1);

    function App$Kaelin$Action$global$remove_skill$(_user$1, _target_pos$2, _key$3, _team$4, _global$5) {
        var _this_cast$6 = App$Kaelin$CastInfo$global$new$(_user$1, _target_pos$2, _key$3, _team$4);
        var self = _global$5;
        switch (self._) {
            case 'App.Kaelin.State.global.new':
                var $3212 = self.round;
                var $3213 = self.tick;
                var $3214 = self.room;
                var $3215 = self.map;
                var $3216 = self.stage;
                var $3217 = App$Kaelin$State$global$new$($3212, $3213, $3214, $3215, $3216, List$delete_by$(App$Kaelin$CastInfo$global$eql, _this_cast$6, (() => {
                    var self = _global$5;
                    switch (self._) {
                        case 'App.Kaelin.State.global.new':
                            var $3218 = self.skills_list;
                            var $3219 = $3218;
                            return $3219;
                    };
                })()));
                var $3211 = $3217;
                break;
        };
        return $3211;
    };
    const App$Kaelin$Action$global$remove_skill = x0 => x1 => x2 => x3 => x4 => App$Kaelin$Action$global$remove_skill$(x0, x1, x2, x3, x4);

    function App$Kaelin$DraftInfo$new$(_hero$1, _team$2, _ready$3) {
        var $3220 = ({
            _: 'App.Kaelin.DraftInfo.new',
            'hero': _hero$1,
            'team': _team$2,
            'ready': _ready$3
        });
        return $3220;
    };
    const App$Kaelin$DraftInfo$new = x0 => x1 => x2 => App$Kaelin$DraftInfo$new$(x0, x1, x2);

    function App$Kaelin$Action$draft_hero$(_user$1, _hero$2, _glob$3) {
        var _key$4 = _user$1;
        var self = _glob$3;
        switch (self._) {
            case 'App.Kaelin.State.global.new':
                var $3222 = self.stage;
                var self = $3222;
                switch (self._) {
                    case 'App.Kaelin.Stage.draft':
                        var $3224 = self.players;
                        var $3225 = self.coords;
                        var _map$13 = $3224;
                        var _player$14 = Map$get$(_user$1, _map$13);
                        var self = _player$14;
                        switch (self._) {
                            case 'Maybe.some':
                                var $3227 = self.value;
                                var self = $3227;
                                switch (self._) {
                                    case 'App.Kaelin.DraftInfo.new':
                                        var $3229 = self.team;
                                        var _new_player$19 = App$Kaelin$DraftInfo$new$(Maybe$some$(_hero$2), $3229, Bool$false);
                                        var _new_map$20 = Map$set$(_user$1, _new_player$19, _map$13);
                                        var _new_stage$21 = App$Kaelin$Stage$draft$(_new_map$20, $3225);
                                        var self = _glob$3;
                                        switch (self._) {
                                            case 'App.Kaelin.State.global.new':
                                                var $3231 = self.round;
                                                var $3232 = self.tick;
                                                var $3233 = self.room;
                                                var $3234 = self.map;
                                                var $3235 = self.skills_list;
                                                var $3236 = App$Kaelin$State$global$new$($3231, $3232, $3233, $3234, _new_stage$21, $3235);
                                                var $3230 = $3236;
                                                break;
                                        };
                                        var $3228 = $3230;
                                        break;
                                };
                                var $3226 = $3228;
                                break;
                            case 'Maybe.none':
                                var $3237 = _glob$3;
                                var $3226 = $3237;
                                break;
                        };
                        var $3223 = $3226;
                        break;
                    case 'App.Kaelin.Stage.init':
                    case 'App.Kaelin.Stage.planning':
                    case 'App.Kaelin.Stage.action':
                        var $3238 = _glob$3;
                        var $3223 = $3238;
                        break;
                };
                var $3221 = $3223;
                break;
        };
        return $3221;
    };
    const App$Kaelin$Action$draft_hero = x0 => x1 => x2 => App$Kaelin$Action$draft_hero$(x0, x1, x2);

    function App$Kaelin$Action$draft_coord$(_user$1, _coord$2, _glob$3) {
        var _key$4 = _user$1;
        var self = _glob$3;
        switch (self._) {
            case 'App.Kaelin.State.global.new':
                var $3240 = self.stage;
                var self = $3240;
                switch (self._) {
                    case 'App.Kaelin.Stage.draft':
                        var $3242 = self.players;
                        var $3243 = self.coords;
                        var _key$13 = App$Kaelin$Coord$Convert$axial_to_nat$(_coord$2);
                        var _team$14 = Maybe$default$(App$Kaelin$Coord$draft$to_team$(_user$1, $3242), App$Kaelin$Team$neutral);
                        var _map$15 = App$Kaelin$Coord$draft$to_map$(_team$14, $3243);
                        var _coord_id$16 = Maybe$default$(NatMap$get$(_key$13, _map$15), "empty");
                        var self = (_coord_id$16 === "empty");
                        if (self) {
                            var _coords$17 = NatMap$to_list$(_map$15);
                            var _map$18 = (() => {
                                var $3247 = _map$15;
                                var $3248 = _coords$17;
                                let _map$19 = $3247;
                                let _pair$18;
                                while ($3248._ === 'List.cons') {
                                    _pair$18 = $3248.head;
                                    var self = _pair$18;
                                    switch (self._) {
                                        case 'Pair.new':
                                            var $3249 = self.fst;
                                            var $3250 = self.snd;
                                            var self = ($3250 === _user$1);
                                            if (self) {
                                                var $3252 = NatMap$set$($3249, "empty", _map$19);
                                                var $3251 = $3252;
                                            } else {
                                                var $3253 = _map$19;
                                                var $3251 = $3253;
                                            };
                                            var $3247 = $3251;
                                            break;
                                    };
                                    _map$19 = $3247;
                                    $3248 = $3248.tail;
                                }
                                return _map$19;
                            })();
                            var _new_map$19 = NatMap$set$(_key$13, _user$1, _map$18);
                            var self = (App$Kaelin$Team$show$(_team$14) === "blue");
                            if (self) {
                                var $3254 = Pair$new$(_new_map$19, Pair$snd$($3243));
                                var _new_map$20 = $3254;
                            } else {
                                var self = (App$Kaelin$Team$show$(_team$14) === "red");
                                if (self) {
                                    var $3256 = Pair$new$(Pair$fst$($3243), _new_map$19);
                                    var $3255 = $3256;
                                } else {
                                    var $3257 = $3243;
                                    var $3255 = $3257;
                                };
                                var _new_map$20 = $3255;
                            };
                            var _stage$21 = App$Kaelin$Stage$draft$($3242, _new_map$20);
                            var self = _glob$3;
                            switch (self._) {
                                case 'App.Kaelin.State.global.new':
                                    var $3258 = self.round;
                                    var $3259 = self.tick;
                                    var $3260 = self.room;
                                    var $3261 = self.map;
                                    var $3262 = self.skills_list;
                                    var $3263 = App$Kaelin$State$global$new$($3258, $3259, $3260, $3261, _stage$21, $3262);
                                    var $3245 = $3263;
                                    break;
                            };
                            var $3244 = $3245;
                        } else {
                            var $3264 = _glob$3;
                            var $3244 = $3264;
                        };
                        var $3241 = $3244;
                        break;
                    case 'App.Kaelin.Stage.init':
                    case 'App.Kaelin.Stage.planning':
                    case 'App.Kaelin.Stage.action':
                        var $3265 = _glob$3;
                        var $3241 = $3265;
                        break;
                };
                var $3239 = $3241;
                break;
        };
        return $3239;
    };
    const App$Kaelin$Action$draft_coord = x0 => x1 => x2 => App$Kaelin$Action$draft_coord$(x0, x1, x2);

    function App$Kaelin$Action$to_draft$(_user$1, _room$2, _glob$3) {
        var self = _glob$3;
        switch (self._) {
            case 'App.Kaelin.State.global.new':
                var $3267 = self.round;
                var $3268 = self.tick;
                var $3269 = self.map;
                var $3270 = self.stage;
                var $3271 = self.skills_list;
                var _info$10 = App$Kaelin$DraftInfo$new$(Maybe$none, App$Kaelin$Team$neutral, Bool$false);
                var $3272 = ((console.log(("user:" + _user$1)), (_$11 => {
                    var $3273 = ((console.log(("room:" + _room$2)), (_$12 => {
                        var self = $3270;
                        switch (self._) {
                            case 'App.Kaelin.Stage.draft':
                                var $3275 = self.players;
                                var $3276 = self.coords;
                                var _players$15 = Map$set$(_user$1, _info$10, $3275);
                                var _new_stage$16 = App$Kaelin$Stage$draft$(_players$15, $3276);
                                var $3277 = App$Kaelin$State$global$new$($3267, $3268, _room$2, $3269, _new_stage$16, $3271);
                                var $3274 = $3277;
                                break;
                            case 'App.Kaelin.Stage.init':
                                var _map$13 = Map$new;
                                var _coords$14 = App$Kaelin$Coord$draft$arena;
                                var _new_stage$15 = App$Kaelin$Stage$draft$(_map$13, _coords$14);
                                var $3278 = App$Kaelin$State$global$new$($3267, $3268, _room$2, $3269, _new_stage$15, $3271);
                                var $3274 = $3278;
                                break;
                            case 'App.Kaelin.Stage.planning':
                            case 'App.Kaelin.Stage.action':
                                var $3279 = _glob$3;
                                var $3274 = $3279;
                                break;
                        };
                        return $3274;
                    })()));
                    return $3273;
                })()));
                var $3266 = $3272;
                break;
        };
        return $3266;
    };
    const App$Kaelin$Action$to_draft = x0 => x1 => x2 => App$Kaelin$Action$to_draft$(x0, x1, x2);

    function App$Kaelin$Action$draft_team$(_user$1, _team$2, _glob$3) {
        var _key$4 = _user$1;
        var self = _glob$3;
        switch (self._) {
            case 'App.Kaelin.State.global.new':
                var $3281 = self.stage;
                var self = $3281;
                switch (self._) {
                    case 'App.Kaelin.Stage.draft':
                        var $3283 = self.players;
                        var $3284 = self.coords;
                        var self = (_team$2 === 0);
                        if (self) {
                            var $3286 = App$Kaelin$Team$blue;
                            var _team$13 = $3286;
                        } else {
                            var self = (_team$2 === 1);
                            if (self) {
                                var $3288 = App$Kaelin$Team$red;
                                var $3287 = $3288;
                            } else {
                                var $3289 = App$Kaelin$Team$neutral;
                                var $3287 = $3289;
                            };
                            var _team$13 = $3287;
                        };
                        var _map$14 = $3283;
                        var _new_player$15 = App$Kaelin$DraftInfo$new$(Maybe$none, _team$13, Bool$false);
                        var _new_map$16 = Map$set$(_user$1, _new_player$15, _map$14);
                        var _new_stage$17 = App$Kaelin$Stage$draft$(_new_map$16, $3284);
                        var self = _glob$3;
                        switch (self._) {
                            case 'App.Kaelin.State.global.new':
                                var $3290 = self.round;
                                var $3291 = self.tick;
                                var $3292 = self.room;
                                var $3293 = self.map;
                                var $3294 = self.skills_list;
                                var $3295 = App$Kaelin$State$global$new$($3290, $3291, $3292, $3293, _new_stage$17, $3294);
                                var $3285 = $3295;
                                break;
                        };
                        var $3282 = $3285;
                        break;
                    case 'App.Kaelin.Stage.init':
                    case 'App.Kaelin.Stage.planning':
                    case 'App.Kaelin.Stage.action':
                        var $3296 = _glob$3;
                        var $3282 = $3296;
                        break;
                };
                var $3280 = $3282;
                break;
        };
        return $3280;
    };
    const App$Kaelin$Action$draft_team = x0 => x1 => x2 => App$Kaelin$Action$draft_team$(x0, x1, x2);

    function App$Kaelin$Action$draft_ready$(_user$1, _ready$2, _glob$3) {
        var self = _glob$3;
        switch (self._) {
            case 'App.Kaelin.State.global.new':
                var $3298 = self.stage;
                var self = $3298;
                switch (self._) {
                    case 'App.Kaelin.Stage.draft':
                        var $3300 = self.players;
                        var $3301 = self.coords;
                        var self = (_ready$2 === 0);
                        if (self) {
                            var $3303 = Bool$false;
                            var _ready_check$12 = $3303;
                        } else {
                            var self = (_ready$2 === 1);
                            if (self) {
                                var $3305 = Bool$true;
                                var $3304 = $3305;
                            } else {
                                var $3306 = Bool$false;
                                var $3304 = $3306;
                            };
                            var _ready_check$12 = $3304;
                        };
                        var _map$13 = $3300;
                        var _info$14 = Map$get$(_user$1, _map$13);
                        var self = _info$14;
                        switch (self._) {
                            case 'Maybe.some':
                                var $3307 = self.value;
                                var _info$16 = $3307;
                                var self = _info$16;
                                switch (self._) {
                                    case 'App.Kaelin.DraftInfo.new':
                                        var $3309 = self.hero;
                                        var $3310 = self.team;
                                        var $3311 = App$Kaelin$DraftInfo$new$($3309, $3310, _ready_check$12);
                                        var _player$17 = $3311;
                                        break;
                                };
                                var _map$18 = Map$set$(_user$1, _player$17, _map$13);
                                var _new_stage$19 = App$Kaelin$Stage$draft$(_map$18, $3301);
                                var self = _glob$3;
                                switch (self._) {
                                    case 'App.Kaelin.State.global.new':
                                        var $3312 = self.round;
                                        var $3313 = self.tick;
                                        var $3314 = self.room;
                                        var $3315 = self.map;
                                        var $3316 = self.skills_list;
                                        var $3317 = App$Kaelin$State$global$new$($3312, $3313, $3314, $3315, _new_stage$19, $3316);
                                        var $3308 = $3317;
                                        break;
                                };
                                var $3302 = $3308;
                                break;
                            case 'Maybe.none':
                                var $3318 = _glob$3;
                                var $3302 = $3318;
                                break;
                        };
                        var $3299 = $3302;
                        break;
                    case 'App.Kaelin.Stage.init':
                    case 'App.Kaelin.Stage.planning':
                    case 'App.Kaelin.Stage.action':
                        var $3319 = _glob$3;
                        var $3299 = $3319;
                        break;
                };
                var $3297 = $3299;
                break;
        };
        return $3297;
    };
    const App$Kaelin$Action$draft_ready = x0 => x1 => x2 => App$Kaelin$Action$draft_ready$(x0, x1, x2);

    function App$Kaelin$Action$control_map$(_glob$1) {
        var self = _glob$1;
        switch (self._) {
            case 'App.Kaelin.State.global.new':
                var $3321 = self.stage;
                var $3322 = $3321;
                var _stage$2 = $3322;
                break;
        };
        var self = _stage$2;
        switch (self._) {
            case 'App.Kaelin.Stage.planning':
                var $3323 = self.control_map;
                var $3324 = self.local_tick;
                var $3325 = self.seconds;
                var self = _glob$1;
                switch (self._) {
                    case 'App.Kaelin.State.global.new':
                        var $3327 = self.round;
                        var $3328 = self.tick;
                        var $3329 = self.room;
                        var $3330 = self.map;
                        var $3331 = self.skills_list;
                        var $3332 = App$Kaelin$State$global$new$($3327, $3328, $3329, $3330, App$Kaelin$Stage$planning$((($3323 + 1) >> 0), $3324, $3325), $3331);
                        var $3326 = $3332;
                        break;
                };
                var $3320 = $3326;
                break;
            case 'App.Kaelin.Stage.init':
            case 'App.Kaelin.Stage.draft':
            case 'App.Kaelin.Stage.action':
                var $3333 = _glob$1;
                var $3320 = $3333;
                break;
        };
        return $3320;
    };
    const App$Kaelin$Action$control_map = x0 => App$Kaelin$Action$control_map$(x0);

    function App$Kaelin$App$post$(_time$1, _room$2, _addr$3, _data$4, _glob$5) {
        var self = App$Kaelin$Event$deserialize$(String$drop$(2n, _data$4));
        switch (self._) {
            case 'Maybe.some':
                var $3335 = self.value;
                var self = $3335;
                switch (self._) {
                    case 'App.Kaelin.Event.create_hero':
                        var $3337 = self.hero_id;
                        var $3338 = App$Kaelin$Action$create_player$(_addr$3, $3337, _glob$5);
                        var $3336 = $3338;
                        break;
                    case 'App.Kaelin.Event.exe_skill':
                        var $3339 = self.player;
                        var $3340 = self.target_pos;
                        var $3341 = self.key;
                        var $3342 = App$Kaelin$Action$global$exe_skill$($3339, $3340, $3341, _glob$5);
                        var $3336 = $3342;
                        break;
                    case 'App.Kaelin.Event.save_skill':
                        var $3343 = self.player;
                        var $3344 = self.target_pos;
                        var $3345 = self.key;
                        var $3346 = self.team;
                        var $3347 = App$Kaelin$Action$global$save_skill$($3343, $3344, $3345, $3346, _glob$5);
                        var $3336 = $3347;
                        break;
                    case 'App.Kaelin.Event.remove_skill':
                        var $3348 = self.player;
                        var $3349 = self.target_pos;
                        var $3350 = self.key;
                        var $3351 = self.team;
                        var $3352 = App$Kaelin$Action$global$remove_skill$($3348, $3349, $3350, $3351, _glob$5);
                        var $3336 = $3352;
                        break;
                    case 'App.Kaelin.Event.draft_hero':
                        var $3353 = self.hero;
                        var $3354 = App$Kaelin$Action$draft_hero$(_addr$3, $3353, _glob$5);
                        var $3336 = $3354;
                        break;
                    case 'App.Kaelin.Event.draft_coord':
                        var $3355 = self.coord;
                        var $3356 = App$Kaelin$Action$draft_coord$(_addr$3, $3355, _glob$5);
                        var $3336 = $3356;
                        break;
                    case 'App.Kaelin.Event.draft_team':
                        var $3357 = self.team;
                        var $3358 = App$Kaelin$Action$draft_team$(_addr$3, $3357, _glob$5);
                        var $3336 = $3358;
                        break;
                    case 'App.Kaelin.Event.draft_ready':
                        var $3359 = self.ready;
                        var $3360 = App$Kaelin$Action$draft_ready$(_addr$3, $3359, _glob$5);
                        var $3336 = $3360;
                        break;
                    case 'App.Kaelin.Event.start_game':
                    case 'App.Kaelin.Event.create_user':
                    case 'App.Kaelin.Event.user_input':
                        var $3361 = _glob$5;
                        var $3336 = $3361;
                        break;
                    case 'App.Kaelin.Event.end_action':
                        var $3362 = App$Kaelin$Action$end_action_turn$(_glob$5);
                        var $3336 = $3362;
                        break;
                    case 'App.Kaelin.Event.to_draft':
                        var $3363 = App$Kaelin$Action$to_draft$(_addr$3, _room$2, _glob$5);
                        var $3336 = $3363;
                        break;
                    case 'App.Kaelin.Event.control_map':
                        var $3364 = App$Kaelin$Action$control_map$(_glob$5);
                        var $3336 = $3364;
                        break;
                };
                var $3334 = $3336;
                break;
            case 'Maybe.none':
                var $3365 = _glob$5;
                var $3334 = $3365;
                break;
        };
        return $3334;
    };
    const App$Kaelin$App$post = x0 => x1 => x2 => x3 => x4 => App$Kaelin$App$post$(x0, x1, x2, x3, x4);

    function App$new$(_init$2, _draw$3, _when$4, _tick$5, _post$6) {
        var $3366 = ({
            _: 'App.new',
            'init': _init$2,
            'draw': _draw$3,
            'when': _when$4,
            'tick': _tick$5,
            'post': _post$6
        });
        return $3366;
    };
    const App$new = x0 => x1 => x2 => x3 => x4 => App$new$(x0, x1, x2, x3, x4);
    const App$Kaelin = (() => {
        var _img$1 = VoxBox$alloc_capacity$(((65536 * 8) >>> 0));
        var _init$2 = App$Kaelin$App$init;
        var _draw$3 = App$Kaelin$App$draw(_img$1);
        var _when$4 = App$Kaelin$App$when;
        var _tick$5 = App$Kaelin$App$tick;
        var _post$6 = App$Kaelin$App$post;
        var $3367 = App$new$(_init$2, _draw$3, _when$4, _tick$5, _post$6);
        return $3367;
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
        'App.Kaelin.Constants.room': App$Kaelin$Constants$room,
        'Maybe.none': Maybe$none,
        'App.Kaelin.Coord.new': App$Kaelin$Coord$new,
        'Maybe.default': Maybe$default,
        'Cmp.as_eql': Cmp$as_eql,
        'Cmp.ltn': Cmp$ltn,
        'Cmp.gtn': Cmp$gtn,
        'Word.cmp.go': Word$cmp$go,
        'Cmp.eql': Cmp$eql,
        'Word.cmp': Word$cmp,
        'Word.eql': Word$eql,
        'U8.eql': U8$eql,
        'U8.new': U8$new,
        'U8.from_nat': U8$from_nat,
        'Maybe': Maybe,
        'Maybe.some': Maybe$some,
        'App.Kaelin.Hero.new': App$Kaelin$Hero$new,
        'App.Kaelin.HeroAssets.new': App$Kaelin$HeroAssets$new,
        'Nat.ltn': Nat$ltn,
        'Nat.sub': Nat$sub,
        'Cmp.as_gte': Cmp$as_gte,
        'Word.gte': Word$gte,
        'Pair': Pair,
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
        'App.Kaelin.Assets.hero.croni.vbox_idle': App$Kaelin$Assets$hero$croni$vbox_idle,
        'App.Kaelin.Assets.hero.croni.base64_idle': App$Kaelin$Assets$hero$croni$base64_idle,
        'App.Kaelin.Assets.hero.croni': App$Kaelin$Assets$hero$croni,
        'I32.new': I32$new,
        'Word.neg.aux': Word$neg$aux,
        'Word.neg': Word$neg,
        'I32.neg': I32$neg,
        'Int.to_i32': Int$to_i32,
        'Int.new': Int$new,
        'Int.from_nat': Int$from_nat,
        'I32.from_nat': I32$from_nat,
        'List.cons': List$cons,
        'App.Kaelin.Skill.new': App$Kaelin$Skill$new,
        'App.Kaelin.Effect.Result': App$Kaelin$Effect$Result,
        'List': List,
        'List.concat': List$concat,
        'BitsMap': BitsMap,
        'BitsMap.tie': BitsMap$tie,
        'BitsMap.union': BitsMap$union,
        'NatMap.union': NatMap$union,
        'App.Kaelin.Effect.Result.new': App$Kaelin$Effect$Result$new,
        'App.Kaelin.Effect.bind': App$Kaelin$Effect$bind,
        'List.nil': List$nil,
        'BitsMap.new': BitsMap$new,
        'NatMap.new': NatMap$new,
        'App.Kaelin.Effect.pure': App$Kaelin$Effect$pure,
        'App.Kaelin.Effect.monad': App$Kaelin$Effect$monad,
        'App.Kaelin.Effect.coord.get_center': App$Kaelin$Effect$coord$get_center,
        'App.Kaelin.Effect.coord.get_target': App$Kaelin$Effect$coord$get_target,
        'NatMap': NatMap,
        'App.Kaelin.Effect.map.get': App$Kaelin$Effect$map$get,
        'Bool.and': Bool$and,
        'I32.eql': I32$eql,
        'App.Kaelin.Coord.eql': App$Kaelin$Coord$eql,
        'I32.add': I32$add,
        'I32.mul': I32$mul,
        'F64.to_u32': F64$to_u32,
        'Word.s_to_f64': Word$s_to_f64,
        'I32.to_f64': I32$to_f64,
        'I32.to_u32': I32$to_u32,
        'U32.to_nat': U32$to_nat,
        'App.Kaelin.Coord.Convert.axial_to_nat': App$Kaelin$Coord$Convert$axial_to_nat,
        'BitsMap.get': BitsMap$get,
        'Bits.o': Bits$o,
        'Bits.e': Bits$e,
        'Bits.i': Bits$i,
        'Bits.inc': Bits$inc,
        'Nat.to_bits': Nat$to_bits,
        'NatMap.get': NatMap$get,
        'App.Kaelin.Map.get': App$Kaelin$Map$get,
        'App.Kaelin.Map.is_occupied': App$Kaelin$Map$is_occupied,
        'App.Kaelin.Effect': App$Kaelin$Effect,
        'App.Kaelin.Map.creature.get': App$Kaelin$Map$creature$get,
        'Maybe.bind': Maybe$bind,
        'Maybe.monad': Maybe$monad,
        'App.Kaelin.Tile.new': App$Kaelin$Tile$new,
        'BitsMap.set': BitsMap$set,
        'NatMap.set': NatMap$set,
        'App.Kaelin.Map.creature.modify_at': App$Kaelin$Map$creature$modify_at,
        'Word.is_neg.go': Word$is_neg$go,
        'Word.is_neg': Word$is_neg,
        'Cmp.as_lte': Cmp$as_lte,
        'Cmp.inv': Cmp$inv,
        'Word.s_lte': Word$s_lte,
        'I32.lte': I32$lte,
        'Cmp.as_ltn': Cmp$as_ltn,
        'Word.s_ltn': Word$s_ltn,
        'I32.ltn': I32$ltn,
        'I32.min': I32$min,
        'App.Kaelin.Creature.new': App$Kaelin$Creature$new,
        'App.Kaelin.Tile.creature.change_hp': App$Kaelin$Tile$creature$change_hp,
        'App.Kaelin.Map.creature.remove': App$Kaelin$Map$creature$remove,
        'Cmp.as_gtn': Cmp$as_gtn,
        'Word.s_gtn': Word$s_gtn,
        'I32.gtn': I32$gtn,
        'I32.max': I32$max,
        'I32.sub': I32$sub,
        'App.Kaelin.Map.creature.change_hp_at': App$Kaelin$Map$creature$change_hp_at,
        'App.Kaelin.Effect.map.set': App$Kaelin$Effect$map$set,
        'App.Kaelin.Effect.indicators.add': App$Kaelin$Effect$indicators$add,
        'App.Kaelin.Indicator.green': App$Kaelin$Indicator$green,
        'App.Kaelin.Indicator.red': App$Kaelin$Indicator$red,
        'App.Kaelin.Effect.hp.change_at': App$Kaelin$Effect$hp$change_at,
        'App.Kaelin.Effect.hp.damage_at': App$Kaelin$Effect$hp$damage_at,
        'List.find': List$find,
        'U16.eql': U16$eql,
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
        'List.map': List$map,
        'App.Kaelin.Coord.Convert.cubic_to_axial': App$Kaelin$Coord$Convert$cubic_to_axial,
        'U32.from_nat': U32$from_nat,
        'F64.to_i32': F64$to_i32,
        'Word.to_f64': Word$to_f64,
        'U32.to_f64': U32$to_f64,
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
        'List.fold': List$fold,
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
        'List.for': List$for,
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
        'App.Kaelin.Tile.creature.create': App$Kaelin$Tile$creature$create,
        'App.Kaelin.Team.neutral': App$Kaelin$Team$neutral,
        'App.Kaelin.Map.init': App$Kaelin$Map$init,
        'App.Kaelin.Assets.tile.effect.blue_green2': App$Kaelin$Assets$tile$effect$blue_green2,
        'App.Kaelin.Assets.tile.effect.dark_red2': App$Kaelin$Assets$tile$effect$dark_red2,
        'App.Kaelin.Assets.tile.effect.light_red2': App$Kaelin$Assets$tile$effect$light_red2,
        'App.Kaelin.Assets.tile.effect.dark_blue2': App$Kaelin$Assets$tile$effect$dark_blue2,
        'App.Kaelin.Assets.tile.green_2': App$Kaelin$Assets$tile$green_2,
        'App.Kaelin.Resources.terrains': App$Kaelin$Resources$terrains,
        'App.Kaelin.Terrain.new': App$Kaelin$Terrain$new,
        'App.Kaelin.Map.Entity.background': App$Kaelin$Map$Entity$background,
        'App.Kaelin.Map.arena': App$Kaelin$Map$arena,
        'App.EnvInfo.new': App$EnvInfo$new,
        'App.Kaelin.Internal.new': App$Kaelin$Internal$new,
        'Map.new': Map$new,
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
        'Parser.first_of.go': Parser$first_of$go,
        'Parser.first_of': Parser$first_of,
        'Parser': Parser,
        'String.cons': String$cons,
        'String.concat': String$concat,
        'String.nil': String$nil,
        'Parser.text.go': Parser$text$go,
        'Parser.text': Parser$text,
        'Parser.many.go': Parser$many$go,
        'Parser.many': Parser$many,
        'Parser.many1': Parser$many1,
        'Parser.hex_digit': Parser$hex_digit,
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
        'U32.sub': U32$sub,
        'String.eql': String$eql,
        'App.Kaelin.Coord.draft.arena_go': App$Kaelin$Coord$draft$arena_go,
        'App.Kaelin.Coord.draft.arena': App$Kaelin$Coord$draft$arena,
        'App.Kaelin.Stage.draft': App$Kaelin$Stage$draft,
        'App.Kaelin.Stage.init': App$Kaelin$Stage$init,
        'App.Store.new': App$Store$new,
        'App.State.new': App$State$new,
        'App.Kaelin.State': App$Kaelin$State,
        'App.Kaelin.State.local.new': App$Kaelin$State$local$new,
        'App.Kaelin.State.global.new': App$Kaelin$State$global$new,
        'U64.new': U64$new,
        'U64.from_nat': U64$from_nat,
        'App.Kaelin.App.init': App$Kaelin$App$init,
        'DOM.node': DOM$node,
        'Map': Map,
        'Bits.concat': Bits$concat,
        'Word.to_bits': Word$to_bits,
        'U16.to_bits': U16$to_bits,
        'String.to_bits': String$to_bits,
        'Map.from_list': Map$from_list,
        'DOM.text': DOM$text,
        'App.Kaelin.Draw.init': App$Kaelin$Draw$init,
        'Pair.snd': Pair$snd,
        'Bits.reverse.tco': Bits$reverse$tco,
        'Bits.reverse': Bits$reverse,
        'BitsMap.to_list.go': BitsMap$to_list$go,
        'List.mapped': List$mapped,
        'Bits.show': Bits$show,
        'Map.to_list': Map$to_list,
        'Map.set': Map$set,
        'App.Kaelin.Resources.heroes': App$Kaelin$Resources$heroes,
        'Map.get': Map$get,
        'App.Kaelin.Coord.draft.to_team': App$Kaelin$Coord$draft$to_team,
        'App.Kaelin.Team.show': App$Kaelin$Team$show,
        'App.Kaelin.Coord.draft.to_map': App$Kaelin$Coord$draft$to_map,
        'Bits.to_nat': Bits$to_nat,
        'NatMap.to_list': NatMap$to_list,
        'Word.mod': Word$mod,
        'U32.mod': U32$mod,
        'App.Kaelin.Coord.Convert.nat_to_axial': App$Kaelin$Coord$Convert$nat_to_axial,
        'App.Kaelin.Constants.draft_hexagon_radius': App$Kaelin$Constants$draft_hexagon_radius,
        'F64.div': F64$div,
        'F64.parse': F64$parse,
        'F64.read': F64$read,
        'F64.add': F64$add,
        'F64.mul': F64$mul,
        'F64.make': F64$make,
        'F64.from_nat': F64$from_nat,
        'App.Kaelin.Coord.draft.to_xy': App$Kaelin$Coord$draft$to_xy,
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
        'App.Kaelin.Draw.draft.positions_go': App$Kaelin$Draw$draft$positions_go,
        'App.Kaelin.Draw.draft.positions': App$Kaelin$Draw$draft$positions,
        'App.Kaelin.Draw.draft.map_space': App$Kaelin$Draw$draft$map_space,
        'App.Kaelin.Draw.draft.map': App$Kaelin$Draw$draft$map,
        'BitsMap.delete': BitsMap$delete,
        'Map.delete': Map$delete,
        'App.Kaelin.Draw.draft.interrogation': App$Kaelin$Draw$draft$interrogation,
        'App.Kaelin.Draw.draft.player': App$Kaelin$Draw$draft$player,
        'App.Kaelin.Draw.draft.picks_left': App$Kaelin$Draw$draft$picks_left,
        'App.Kaelin.Team.eql': App$Kaelin$Team$eql,
        'List.length': List$length,
        'Nat.eql': Nat$eql,
        'Nat.for': Nat$for,
        'App.Kaelin.Draw.draft.ally': App$Kaelin$Draw$draft$ally,
        'App.Kaelin.Draw.draft.allies': App$Kaelin$Draw$draft$allies,
        'App.Kaelin.Draw.draft.picks_right': App$Kaelin$Draw$draft$picks_right,
        'App.Kaelin.Draw.draft.picks': App$Kaelin$Draw$draft$picks,
        'App.Kaelin.Draw.draft.top': App$Kaelin$Draw$draft$top,
        'App.Kaelin.Draw.draft.selection': App$Kaelin$Draw$draft$selection,
        'App.Kaelin.Draw.draft.bottom_left': App$Kaelin$Draw$draft$bottom_left,
        'App.Kaelin.Draw.draft.bottom_right': App$Kaelin$Draw$draft$bottom_right,
        'App.Kaelin.Draw.draft.bottom': App$Kaelin$Draw$draft$bottom,
        'App.Kaelin.Draw.draft.blue': App$Kaelin$Draw$draft$blue,
        'App.Kaelin.Draw.draft.red': App$Kaelin$Draw$draft$red,
        'App.Kaelin.Draw.draft.choose_team': App$Kaelin$Draw$draft$choose_team,
        'App.Kaelin.Draw.draft.main': App$Kaelin$Draw$draft$main,
        'App.Kaelin.Draw.draft': App$Kaelin$Draw$draft,
        'App.State.global': App$State$global,
        'Pair.fst': Pair$fst,
        'App.State.local': App$State$local,
        'App.Kaelin.Stage.get_map': App$Kaelin$Stage$get_map,
        'String.drop': String$drop,
        'List.head': List$head,
        'Char.eql': Char$eql,
        'String.starts_with': String$starts_with,
        'String.length.go': String$length$go,
        'String.length': String$length,
        'String.split.go': String$split$go,
        'String.split': String$split,
        'Word.abs': Word$abs,
        'Word.s_show': Word$s_show,
        'I32.show': I32$show,
        'Word.show': Word$show,
        'U64.show': U64$show,
        'App.Kaelin.Draw.game.round': App$Kaelin$Draw$game$round,
        'DOM.vbox': DOM$vbox,
        'App.Kaelin.Constants.hexagon_radius': App$Kaelin$Constants$hexagon_radius,
        'App.Kaelin.Constants.center_x': App$Kaelin$Constants$center_x,
        'App.Kaelin.Constants.center_y': App$Kaelin$Constants$center_y,
        'F64.sub': F64$sub,
        'App.Kaelin.Coord.round.floor': App$Kaelin$Coord$round$floor,
        'App.Kaelin.Coord.round.round_F64': App$Kaelin$Coord$round$round_F64,
        'Word.gtn': Word$gtn,
        'F64.gtn': F64$gtn,
        'App.Kaelin.Coord.round.diff': App$Kaelin$Coord$round$diff,
        'App.Kaelin.Coord.round': App$Kaelin$Coord$round,
        'App.Kaelin.Coord.to_axial': App$Kaelin$Coord$to_axial,
        'App.Kaelin.Indicator.background': App$Kaelin$Indicator$background,
        'NatSet.has': NatSet$has,
        'App.Kaelin.Indicator.blue': App$Kaelin$Indicator$blue,
        'App.Kaelin.Draw.support.get_effect': App$Kaelin$Draw$support$get_effect,
        'App.Kaelin.Draw.support.area_of_effect': App$Kaelin$Draw$support$area_of_effect,
        'App.Kaelin.Draw.support.get_indicator': App$Kaelin$Draw$support$get_indicator,
        'App.Kaelin.Coord.to_screen_xy': App$Kaelin$Coord$to_screen_xy,
        'App.Kaelin.Draw.support.centralize': App$Kaelin$Draw$support$centralize,
        'VoxBox.get_len': VoxBox$get_len,
        'Array.get': Array$get,
        'Buffer32.get': Buffer32$get,
        'VoxBox.get_pos': VoxBox$get_pos,
        'VoxBox.get_col': VoxBox$get_col,
        'Word.and': Word$and,
        'U32.and': U32$and,
        'U32.shr': U32$shr,
        'VoxBox.Draw.image': VoxBox$Draw$image,
        'App.Kaelin.Draw.tile.background': App$Kaelin$Draw$tile$background,
        'App.Kaelin.Draw.hero': App$Kaelin$Draw$hero,
        'Int.neg': Int$neg,
        'Word.to_int': Word$to_int,
        'I32.to_int': I32$to_int,
        'Int.to_nat': Int$to_nat,
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
        'PixelFont.set_img': PixelFont$set_img,
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
        'App.Kaelin.Draw.creature.hp': App$Kaelin$Draw$creature$hp,
        'App.Kaelin.Draw.creature.ap': App$Kaelin$Draw$creature$ap,
        'App.Kaelin.Draw.tile.creature': App$Kaelin$Draw$tile$creature,
        'Nat.div': Nat$div,
        'List.get': List$get,
        'App.Kaelin.Draw.support.animation_frame': App$Kaelin$Draw$support$animation_frame,
        'App.Kaelin.Draw.tile.animation': App$Kaelin$Draw$tile$animation,
        'App.Kaelin.Draw.state.map': App$Kaelin$Draw$state$map,
        'App.Kaelin.Assets.tile.mouse_ui': App$Kaelin$Assets$tile$mouse_ui,
        'App.Kaelin.Draw.state.mouse_ui': App$Kaelin$Draw$state$mouse_ui,
        'App.Kaelin.Draw.map': App$Kaelin$Draw$map,
        'App.Kaelin.Map.find_players': App$Kaelin$Map$find_players,
        'App.Kaelin.Map.player.to_coord': App$Kaelin$Map$player$to_coord,
        'App.Kaelin.Map.player.info': App$Kaelin$Map$player$info,
        'App.Kaelin.Skill.has_key': App$Kaelin$Skill$has_key,
        'App.Kaelin.Hero.skill.from_key': App$Kaelin$Hero$skill$from_key,
        'App.Kaelin.Coord.show': App$Kaelin$Coord$show,
        'U8.to_bits': U8$to_bits,
        'List.zip': List$zip,
        'Nat.to_u8': Nat$to_u8,
        'App.Kaelin.Event.Code.action': App$Kaelin$Event$Code$action,
        'String.repeat': String$repeat,
        'App.Kaelin.Event.Code.Hex.set_min_length': App$Kaelin$Event$Code$Hex$set_min_length,
        'App.Kaelin.Event.Code.Hex.format_hex': App$Kaelin$Event$Code$Hex$format_hex,
        'Bits.chunks_of.go': Bits$chunks_of$go,
        'Bits.chunks_of': Bits$chunks_of,
        'Function.flip': Function$flip,
        'Bits.to_hex_string': Bits$to_hex_string,
        'App.Kaelin.Event.Code.Hex.append': App$Kaelin$Event$Code$Hex$append,
        'U8.to_nat': U8$to_nat,
        'App.Kaelin.Event.Code.generate_hex': App$Kaelin$Event$Code$generate_hex,
        'generate_hex': generate_hex,
        'App.Kaelin.Event.Code.create_hero': App$Kaelin$Event$Code$create_hero,
        'Hex_to_nat.parser': Hex_to_nat$parser,
        'App.Kaelin.Event.Code.Hex.to_nat': App$Kaelin$Event$Code$Hex$to_nat,
        'App.Kaelin.Resources.Action.to_bits': App$Kaelin$Resources$Action$to_bits,
        'App.Kaelin.Coord.Convert.axial_to_bits': App$Kaelin$Coord$Convert$axial_to_bits,
        'App.Kaelin.Event.Code.user_input': App$Kaelin$Event$Code$user_input,
        'App.Kaelin.Event.Code.exe_skill': App$Kaelin$Event$Code$exe_skill,
        'App.Kaelin.Team.code': App$Kaelin$Team$code,
        'App.Kaelin.Event.Code.save_skill': App$Kaelin$Event$Code$save_skill,
        'App.Kaelin.Event.Code.remove_skill': App$Kaelin$Event$Code$remove_skill,
        'App.Kaelin.Event.Code.draft_hero': App$Kaelin$Event$Code$draft_hero,
        'App.Kaelin.Event.Code.draft_coord': App$Kaelin$Event$Code$draft_coord,
        'App.Kaelin.Event.Code.draft_team': App$Kaelin$Event$Code$draft_team,
        'Debug.log': Debug$log,
        'App.Kaelin.Event.Code.draft_ready': App$Kaelin$Event$Code$draft_ready,
        'App.Kaelin.Event.serialize': App$Kaelin$Event$serialize,
        'App.Kaelin.Event.remove_skill': App$Kaelin$Event$remove_skill,
        'remove_button': remove_button,
        'App.Kaelin.Draw.game.skill_list': App$Kaelin$Draw$game$skill_list,
        'App.Kaelin.Draw.game': App$Kaelin$Draw$game,
        'App.Kaelin.App.draw': App$Kaelin$App$draw,
        'IO': IO,
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
        'IO.do': IO$do,
        'App.do': App$do,
        'App.watch': App$watch,
        'App.new_post': App$new_post,
        'App.Kaelin.Event.to_draft': App$Kaelin$Event$to_draft,
        'App.Kaelin.App.when.init': App$Kaelin$App$when$init,
        'App.Kaelin.Event.draft_coord': App$Kaelin$Event$draft_coord,
        'U8.add': U8$add,
        'App.Kaelin.Hero.info.map_go': App$Kaelin$Hero$info$map_go,
        'App.Kaelin.Hero.info.map': App$Kaelin$Hero$info$map,
        'App.Kaelin.Event.draft_hero': App$Kaelin$Event$draft_hero,
        'App.Kaelin.Event.draft_ready': App$Kaelin$Event$draft_ready,
        'App.Kaelin.Event.draft_team': App$Kaelin$Event$draft_team,
        'App.Kaelin.App.when.draft': App$Kaelin$App$when$draft,
        'Bool.not': Bool$not,
        'U64.to_nat': U64$to_nat,
        'App.Kaelin.Action.local.set_internal': App$Kaelin$Action$local$set_internal,
        'App.Kaelin.Action.local.env_info': App$Kaelin$Action$local$env_info,
        'App.Kaelin.Effect.indicators.get_indicators': App$Kaelin$Effect$indicators$get_indicators,
        'App.Kaelin.CastInfo.local.new': App$Kaelin$CastInfo$local$new,
        'App.Kaelin.Action.local.area': App$Kaelin$Action$local$area,
        'App.Kaelin.Event.save_skill': App$Kaelin$Event$save_skill,
        'NatSet.new': NatSet$new,
        'NatSet.set': NatSet$set,
        'NatSet.from_list': NatSet$from_list,
        'App.Kaelin.Coord.range_natset': App$Kaelin$Coord$range_natset,
        'App.Kaelin.Map.exe_skill': App$Kaelin$Map$exe_skill,
        'App.Kaelin.CastInfo.start': App$Kaelin$CastInfo$start,
        'App.Kaelin.Action.local.set_cast': App$Kaelin$Action$local$set_cast,
        'App.Kaelin.App.when.planning': App$Kaelin$App$when$planning,
        'App.Kaelin.App.when': App$Kaelin$App$when,
        'U64.add': U64$add,
        'App.Kaelin.Stage.planning': App$Kaelin$Stage$planning,
        'App.Kaelin.Coord.draft.start_game': App$Kaelin$Coord$draft$start_game,
        'App.Kaelin.Stage.draft.end': App$Kaelin$Stage$draft$end,
        'U64.sub': U64$sub,
        'Nat.to_u64': Nat$to_u64,
        'U64.div': U64$div,
        'U64.mul': U64$mul,
        'U64.gte': U64$gte,
        'App.Kaelin.Stage.action': App$Kaelin$Stage$action,
        'App.Kaelin.Action.global.exe_skill': App$Kaelin$Action$global$exe_skill,
        'App.Kaelin.Action.global.exe_skills_list': App$Kaelin$Action$global$exe_skills_list,
        'App.Kaelin.Tile.creature.restore_ap': App$Kaelin$Tile$creature$restore_ap,
        'App.Kaelin.Map.creature.restore_all_ap': App$Kaelin$Map$creature$restore_all_ap,
        'App.Kaelin.Action.end_action_turn': App$Kaelin$Action$end_action_turn,
        'App.Kaelin.App.tick': App$Kaelin$App$tick,
        'App.Kaelin.Event.Buffer.monad.run': App$Kaelin$Event$Buffer$monad$run,
        'Parser.fail': Parser$fail,
        'Parser.one': Parser$one,
        'Char.to_string': Char$to_string,
        'Parser.drop.go': Parser$drop$go,
        'Parser.ignore': Parser$ignore,
        'App.Kaelin.Event.Buffer.monad.pure': App$Kaelin$Event$Buffer$monad$pure,
        'App.Kaelin.Event.Buffer.hex': App$Kaelin$Event$Buffer$hex,
        'App.Kaelin.Event.Buffer.next': App$Kaelin$Event$Buffer$next,
        'App.Kaelin.Event.Buffer.push': App$Kaelin$Event$Buffer$push,
        'App.Kaelin.Event.Buffer.fail': App$Kaelin$Event$Buffer$fail,
        'App.Kaelin.Event.Buffer.monad.bind': App$Kaelin$Event$Buffer$monad$bind,
        'App.Kaelin.Event.Buffer.monad': App$Kaelin$Event$Buffer$monad,
        'App.Kaelin.Event.Buffer': App$Kaelin$Event$Buffer,
        'App.Kaelin.Event.create_hero': App$Kaelin$Event$create_hero,
        'App.Kaelin.Action.walk': App$Kaelin$Action$walk,
        'App.Kaelin.Action.ability_0': App$Kaelin$Action$ability_0,
        'App.Kaelin.Action.ability_1': App$Kaelin$Action$ability_1,
        'App.Kaelin.Resources.Action.to_action': App$Kaelin$Resources$Action$to_action,
        'App.Kaelin.Event.user_input': App$Kaelin$Event$user_input,
        'App.Kaelin.Event.exe_skill': App$Kaelin$Event$exe_skill,
        'App.Kaelin.Team.red': App$Kaelin$Team$red,
        'App.Kaelin.Team.blue': App$Kaelin$Team$blue,
        'App.Kaelin.Team.decode': App$Kaelin$Team$decode,
        'App.Kaelin.Event.end_action': App$Kaelin$Event$end_action,
        'App.Kaelin.Event.control_map': App$Kaelin$Event$control_map,
        'App.Kaelin.Event.deserialize_scheme': App$Kaelin$Event$deserialize_scheme,
        'App.Kaelin.Event.deserialize': App$Kaelin$Event$deserialize,
        'App.Kaelin.Action.create_player': App$Kaelin$Action$create_player,
        'App.Kaelin.CastInfo.global.new': App$Kaelin$CastInfo$global$new,
        'App.Kaelin.Action.global.save_skill': App$Kaelin$Action$global$save_skill,
        'List.delete_by': List$delete_by,
        'List.all': List$all,
        'Function.id': Function$id,
        'App.Kaelin.CastInfo.global.eql': App$Kaelin$CastInfo$global$eql,
        'App.Kaelin.Action.global.remove_skill': App$Kaelin$Action$global$remove_skill,
        'App.Kaelin.DraftInfo.new': App$Kaelin$DraftInfo$new,
        'App.Kaelin.Action.draft_hero': App$Kaelin$Action$draft_hero,
        'App.Kaelin.Action.draft_coord': App$Kaelin$Action$draft_coord,
        'App.Kaelin.Action.to_draft': App$Kaelin$Action$to_draft,
        'App.Kaelin.Action.draft_team': App$Kaelin$Action$draft_team,
        'App.Kaelin.Action.draft_ready': App$Kaelin$Action$draft_ready,
        'App.Kaelin.Action.control_map': App$Kaelin$Action$control_map,
        'App.Kaelin.App.post': App$Kaelin$App$post,
        'App.new': App$new,
        'App.Kaelin': App$Kaelin,
    };
})();

/***/ })

}]);
//# sourceMappingURL=635.index.js.map