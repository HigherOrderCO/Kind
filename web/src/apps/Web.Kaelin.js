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
    const Web$Kaelin$Constants$room = "0x414542342291";
    const Maybe$none = ({
        _: 'Maybe.none'
    });

    function Web$Kaelin$Coord$new$(_i$1, _j$2) {
        var $149 = ({
            _: 'Web.Kaelin.Coord.new',
            'i': _i$1,
            'j': _j$2
        });
        return $149;
    };
    const Web$Kaelin$Coord$new = x0 => x1 => Web$Kaelin$Coord$new$(x0, x1);
    const Bool$and = a0 => a1 => (a0 && a1);

    function Cmp$as_eql$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
            case 'Cmp.gtn':
                var $151 = Bool$false;
                var $150 = $151;
                break;
            case 'Cmp.eql':
                var $152 = Bool$true;
                var $150 = $152;
                break;
        };
        return $150;
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
                var $154 = self.pred;
                var $155 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $157 = self.pred;
                            var $158 = (_a$pred$10 => {
                                var $159 = Word$cmp$go$(_a$pred$10, $157, _c$4);
                                return $159;
                            });
                            var $156 = $158;
                            break;
                        case 'Word.i':
                            var $160 = self.pred;
                            var $161 = (_a$pred$10 => {
                                var $162 = Word$cmp$go$(_a$pred$10, $160, Cmp$ltn);
                                return $162;
                            });
                            var $156 = $161;
                            break;
                        case 'Word.e':
                            var $163 = (_a$pred$8 => {
                                var $164 = _c$4;
                                return $164;
                            });
                            var $156 = $163;
                            break;
                    };
                    var $156 = $156($154);
                    return $156;
                });
                var $153 = $155;
                break;
            case 'Word.i':
                var $165 = self.pred;
                var $166 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $168 = self.pred;
                            var $169 = (_a$pred$10 => {
                                var $170 = Word$cmp$go$(_a$pred$10, $168, Cmp$gtn);
                                return $170;
                            });
                            var $167 = $169;
                            break;
                        case 'Word.i':
                            var $171 = self.pred;
                            var $172 = (_a$pred$10 => {
                                var $173 = Word$cmp$go$(_a$pred$10, $171, _c$4);
                                return $173;
                            });
                            var $167 = $172;
                            break;
                        case 'Word.e':
                            var $174 = (_a$pred$8 => {
                                var $175 = _c$4;
                                return $175;
                            });
                            var $167 = $174;
                            break;
                    };
                    var $167 = $167($165);
                    return $167;
                });
                var $153 = $166;
                break;
            case 'Word.e':
                var $176 = (_b$5 => {
                    var $177 = _c$4;
                    return $177;
                });
                var $153 = $176;
                break;
        };
        var $153 = $153(_b$3);
        return $153;
    };
    const Word$cmp$go = x0 => x1 => x2 => Word$cmp$go$(x0, x1, x2);
    const Cmp$eql = ({
        _: 'Cmp.eql'
    });

    function Word$cmp$(_a$2, _b$3) {
        var $178 = Word$cmp$go$(_a$2, _b$3, Cmp$eql);
        return $178;
    };
    const Word$cmp = x0 => x1 => Word$cmp$(x0, x1);

    function Word$eql$(_a$2, _b$3) {
        var $179 = Cmp$as_eql$(Word$cmp$(_a$2, _b$3));
        return $179;
    };
    const Word$eql = x0 => x1 => Word$eql$(x0, x1);
    const U16$eql = a0 => a1 => (a0 === a1);
    const String$eql = a0 => a1 => (a0 === a1);

    function Web$Kaelin$Hero$new$(_name$1, _img$2, _max_hp$3, _skills$4) {
        var $180 = ({
            _: 'Web.Kaelin.Hero.new',
            'name': _name$1,
            'img': _img$2,
            'max_hp': _max_hp$3,
            'skills': _skills$4
        });
        return $180;
    };
    const Web$Kaelin$Hero$new = x0 => x1 => x2 => x3 => Web$Kaelin$Hero$new$(x0, x1, x2, x3);
    const Nat$ltn = a0 => a1 => (a0 < a1);
    const Nat$sub = a0 => a1 => (a0 - a1 <= 0n ? 0n : a0 - a1);

    function Cmp$as_gte$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
                var $182 = Bool$false;
                var $181 = $182;
                break;
            case 'Cmp.eql':
            case 'Cmp.gtn':
                var $183 = Bool$true;
                var $181 = $183;
                break;
        };
        return $181;
    };
    const Cmp$as_gte = x0 => Cmp$as_gte$(x0);

    function Word$gte$(_a$2, _b$3) {
        var $184 = Cmp$as_gte$(Word$cmp$(_a$2, _b$3));
        return $184;
    };
    const Word$gte = x0 => x1 => Word$gte$(x0, x1);

    function Pair$(_A$1, _B$2) {
        var $185 = null;
        return $185;
    };
    const Pair = x0 => x1 => Pair$(x0, x1);

    function Pair$new$(_fst$3, _snd$4) {
        var $186 = ({
            _: 'Pair.new',
            'fst': _fst$3,
            'snd': _snd$4
        });
        return $186;
    };
    const Pair$new = x0 => x1 => Pair$new$(x0, x1);

    function Word$or$(_a$2, _b$3) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $188 = self.pred;
                var $189 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $191 = self.pred;
                            var $192 = (_a$pred$9 => {
                                var $193 = Word$o$(Word$or$(_a$pred$9, $191));
                                return $193;
                            });
                            var $190 = $192;
                            break;
                        case 'Word.i':
                            var $194 = self.pred;
                            var $195 = (_a$pred$9 => {
                                var $196 = Word$i$(Word$or$(_a$pred$9, $194));
                                return $196;
                            });
                            var $190 = $195;
                            break;
                        case 'Word.e':
                            var $197 = (_a$pred$7 => {
                                var $198 = Word$e;
                                return $198;
                            });
                            var $190 = $197;
                            break;
                    };
                    var $190 = $190($188);
                    return $190;
                });
                var $187 = $189;
                break;
            case 'Word.i':
                var $199 = self.pred;
                var $200 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $202 = self.pred;
                            var $203 = (_a$pred$9 => {
                                var $204 = Word$i$(Word$or$(_a$pred$9, $202));
                                return $204;
                            });
                            var $201 = $203;
                            break;
                        case 'Word.i':
                            var $205 = self.pred;
                            var $206 = (_a$pred$9 => {
                                var $207 = Word$i$(Word$or$(_a$pred$9, $205));
                                return $207;
                            });
                            var $201 = $206;
                            break;
                        case 'Word.e':
                            var $208 = (_a$pred$7 => {
                                var $209 = Word$e;
                                return $209;
                            });
                            var $201 = $208;
                            break;
                    };
                    var $201 = $201($199);
                    return $201;
                });
                var $187 = $200;
                break;
            case 'Word.e':
                var $210 = (_b$4 => {
                    var $211 = Word$e;
                    return $211;
                });
                var $187 = $210;
                break;
        };
        var $187 = $187(_b$3);
        return $187;
    };
    const Word$or = x0 => x1 => Word$or$(x0, x1);

    function Word$shift_right$one$go$(_word$2) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $213 = self.pred;
                var $214 = Word$o$(Word$shift_right$one$go$($213));
                var $212 = $214;
                break;
            case 'Word.i':
                var $215 = self.pred;
                var $216 = Word$i$(Word$shift_right$one$go$($215));
                var $212 = $216;
                break;
            case 'Word.e':
                var $217 = Word$o$(Word$e);
                var $212 = $217;
                break;
        };
        return $212;
    };
    const Word$shift_right$one$go = x0 => Word$shift_right$one$go$(x0);

    function Word$shift_right$one$(_word$2) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $219 = self.pred;
                var $220 = Word$shift_right$one$go$($219);
                var $218 = $220;
                break;
            case 'Word.i':
                var $221 = self.pred;
                var $222 = Word$shift_right$one$go$($221);
                var $218 = $222;
                break;
            case 'Word.e':
                var $223 = Word$e;
                var $218 = $223;
                break;
        };
        return $218;
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
                    var $224 = _value$3;
                    return $224;
                } else {
                    var $225 = (self - 1n);
                    var $226 = Word$shift_right$($225, Word$shift_right$one$(_value$3));
                    return $226;
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
                var $228 = self.pred;
                var $229 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $231 = self.pred;
                            var $232 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $234 = Word$i$(Word$subber$(_a$pred$10, $231, Bool$true));
                                    var $233 = $234;
                                } else {
                                    var $235 = Word$o$(Word$subber$(_a$pred$10, $231, Bool$false));
                                    var $233 = $235;
                                };
                                return $233;
                            });
                            var $230 = $232;
                            break;
                        case 'Word.i':
                            var $236 = self.pred;
                            var $237 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $239 = Word$o$(Word$subber$(_a$pred$10, $236, Bool$true));
                                    var $238 = $239;
                                } else {
                                    var $240 = Word$i$(Word$subber$(_a$pred$10, $236, Bool$true));
                                    var $238 = $240;
                                };
                                return $238;
                            });
                            var $230 = $237;
                            break;
                        case 'Word.e':
                            var $241 = (_a$pred$8 => {
                                var $242 = Word$e;
                                return $242;
                            });
                            var $230 = $241;
                            break;
                    };
                    var $230 = $230($228);
                    return $230;
                });
                var $227 = $229;
                break;
            case 'Word.i':
                var $243 = self.pred;
                var $244 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $246 = self.pred;
                            var $247 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $249 = Word$o$(Word$subber$(_a$pred$10, $246, Bool$false));
                                    var $248 = $249;
                                } else {
                                    var $250 = Word$i$(Word$subber$(_a$pred$10, $246, Bool$false));
                                    var $248 = $250;
                                };
                                return $248;
                            });
                            var $245 = $247;
                            break;
                        case 'Word.i':
                            var $251 = self.pred;
                            var $252 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $254 = Word$i$(Word$subber$(_a$pred$10, $251, Bool$true));
                                    var $253 = $254;
                                } else {
                                    var $255 = Word$o$(Word$subber$(_a$pred$10, $251, Bool$false));
                                    var $253 = $255;
                                };
                                return $253;
                            });
                            var $245 = $252;
                            break;
                        case 'Word.e':
                            var $256 = (_a$pred$8 => {
                                var $257 = Word$e;
                                return $257;
                            });
                            var $245 = $256;
                            break;
                    };
                    var $245 = $245($243);
                    return $245;
                });
                var $227 = $244;
                break;
            case 'Word.e':
                var $258 = (_b$5 => {
                    var $259 = Word$e;
                    return $259;
                });
                var $227 = $258;
                break;
        };
        var $227 = $227(_b$3);
        return $227;
    };
    const Word$subber = x0 => x1 => x2 => Word$subber$(x0, x1, x2);

    function Word$sub$(_a$2, _b$3) {
        var $260 = Word$subber$(_a$2, _b$3, Bool$false);
        return $260;
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
                    var $261 = Pair$new$(Bool$true, Word$or$(_value$5, _mask$6));
                    var self = $261;
                } else {
                    var $262 = Pair$new$(Bool$false, _value$5);
                    var self = $262;
                };
                switch (self._) {
                    case 'Pair.new':
                        var $263 = self.fst;
                        var $264 = self.snd;
                        var self = _shift$2;
                        if (self === 0n) {
                            var $266 = $264;
                            var $265 = $266;
                        } else {
                            var $267 = (self - 1n);
                            var _new_shift_copy$9 = Word$shift_right$(1n, _shift_copy$4);
                            var self = $263;
                            if (self) {
                                var $269 = Word$div$go$($267, Word$sub$(_sub_copy$3, _shift_copy$4), _new_shift_copy$9, $264);
                                var $268 = $269;
                            } else {
                                var $270 = Word$div$go$($267, _sub_copy$3, _new_shift_copy$9, $264);
                                var $268 = $270;
                            };
                            var $265 = $268;
                        };
                        return $265;
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
            var $272 = Word$to_zero$(_a$2);
            var $271 = $272;
        } else {
            var _shift$6 = (_a_bits$4 - _b_bits$5 <= 0n ? 0n : _a_bits$4 - _b_bits$5);
            var _shift_copy$7 = Word$shift_left$(_shift$6, _b$3);
            var $273 = Word$div$go$(_shift$6, _a$2, _shift_copy$7, Word$to_zero$(_a$2));
            var $271 = $273;
        };
        return $271;
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
        var $274 = (parseInt(_chr$3, 16));
        return $274;
    };
    const VoxBox$parse_byte = x0 => x1 => VoxBox$parse_byte$(x0, x1);
    const U32$or = a0 => a1 => (a0 | a1);

    function Word$fold$(_nil$3, _w0$4, _w1$5, _word$6) {
        var self = _word$6;
        switch (self._) {
            case 'Word.o':
                var $276 = self.pred;
                var $277 = _w0$4(Word$fold$(_nil$3, _w0$4, _w1$5, $276));
                var $275 = $277;
                break;
            case 'Word.i':
                var $278 = self.pred;
                var $279 = _w1$5(Word$fold$(_nil$3, _w0$4, _w1$5, $278));
                var $275 = $279;
                break;
            case 'Word.e':
                var $280 = _nil$3;
                var $275 = $280;
                break;
        };
        return $275;
    };
    const Word$fold = x0 => x1 => x2 => x3 => Word$fold$(x0, x1, x2, x3);
    const Nat$add = a0 => a1 => (a0 + a1);
    const Nat$mul = a0 => a1 => (a0 * a1);

    function Word$to_nat$(_word$2) {
        var $281 = Word$fold$(0n, a1 => (2n * a1), (_x$4 => {
            var $282 = Nat$succ$((2n * _x$4));
            return $282;
        }), _word$2);
        return $281;
    };
    const Word$to_nat = x0 => Word$to_nat$(x0);

    function Word$shl$(_n$2, _value$3) {
        var _n_nat$4 = Word$to_nat$(_n$2);
        var $283 = Word$shift_left$(_n_nat$4, _value$3);
        return $283;
    };
    const Word$shl = x0 => x1 => Word$shl$(x0, x1);
    const U32$shl = a0 => a1 => ((a0 << a1) >>> 0);
    const Pos32$new = a0 => a1 => a2 => ((0 | a0 | (a1 << 12) | (a2 << 24)));
    const Col32$new = a0 => a1 => a2 => a3 => ((0 | a0 | (a1 << 8) | (a2 << 16) | (a3 << 24)));

    function Word$trim$(_new_size$2, _word$3) {
        var self = _new_size$2;
        if (self === 0n) {
            var $285 = Word$e;
            var $284 = $285;
        } else {
            var $286 = (self - 1n);
            var self = _word$3;
            switch (self._) {
                case 'Word.o':
                    var $288 = self.pred;
                    var $289 = Word$o$(Word$trim$($286, $288));
                    var $287 = $289;
                    break;
                case 'Word.i':
                    var $290 = self.pred;
                    var $291 = Word$i$(Word$trim$($286, $290));
                    var $287 = $291;
                    break;
                case 'Word.e':
                    var $292 = Word$o$(Word$trim$($286, Word$e));
                    var $287 = $292;
                    break;
            };
            var $284 = $287;
        };
        return $284;
    };
    const Word$trim = x0 => x1 => Word$trim$(x0, x1);
    const Unit$new = null;

    function Array$extract_tip$(_arr$2) {
        var self = _arr$2;
        switch (self._) {
            case 'Array.tip':
                var $294 = self.value;
                var $295 = $294;
                var $293 = $295;
                break;
            case 'Array.tie':
                var $296 = Unit$new;
                var $293 = $296;
                break;
        };
        return $293;
    };
    const Array$extract_tip = x0 => Array$extract_tip$(x0);

    function Array$extract_tie$(_arr$3) {
        var self = _arr$3;
        switch (self._) {
            case 'Array.tie':
                var $298 = self.lft;
                var $299 = self.rgt;
                var $300 = Pair$new$($298, $299);
                var $297 = $300;
                break;
            case 'Array.tip':
                var $301 = Unit$new;
                var $297 = $301;
                break;
        };
        return $297;
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
                        var $302 = self.pred;
                        var $303 = Word$foldl$(_w0$4(_nil$3), _w0$4, _w1$5, $302);
                        return $303;
                    case 'Word.i':
                        var $304 = self.pred;
                        var $305 = Word$foldl$(_w1$5(_nil$3), _w0$4, _w1$5, $304);
                        return $305;
                    case 'Word.e':
                        var $306 = _nil$3;
                        return $306;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Word$foldl = x0 => x1 => x2 => x3 => Word$foldl$(x0, x1, x2, x3);

    function Array$mut$(_idx$3, _f$4, _arr$5) {
        var $307 = Word$foldl$((_arr$6 => {
            var $308 = Array$tip$(_f$4(Array$extract_tip$(_arr$6)));
            return $308;
        }), (_rec$7 => _arr$8 => {
            var self = Array$extract_tie$(_arr$8);
            switch (self._) {
                case 'Pair.new':
                    var $310 = self.fst;
                    var $311 = self.snd;
                    var $312 = Array$tie$(_rec$7($310), $311);
                    var $309 = $312;
                    break;
            };
            return $309;
        }), (_rec$7 => _arr$8 => {
            var self = Array$extract_tie$(_arr$8);
            switch (self._) {
                case 'Pair.new':
                    var $314 = self.fst;
                    var $315 = self.snd;
                    var $316 = Array$tie$($314, _rec$7($315));
                    var $313 = $316;
                    break;
            };
            return $313;
        }), _idx$3)(_arr$5);
        return $307;
    };
    const Array$mut = x0 => x1 => x2 => Array$mut$(x0, x1, x2);

    function Array$set$(_idx$3, _val$4, _arr$5) {
        var $317 = Array$mut$(_idx$3, (_x$6 => {
            var $318 = _val$4;
            return $318;
        }), _arr$5);
        return $317;
    };
    const Array$set = x0 => x1 => x2 => Array$set$(x0, x1, x2);
    const Buffer32$set = a0 => a1 => a2 => ((a2[a0] = a1, a2));
    const VoxBox$set_pos = a0 => a1 => a2 => ((a2.buffer[a0 * 2] = a1, a2));
    const VoxBox$set_col = a0 => a1 => a2 => ((a2.buffer[a0 * 2 + 1] = a1, a2));

    function VoxBox$set_length$(_length$1, _img$2) {
        var self = _img$2;
        switch (self._) {
            case 'VoxBox.new':
                var $320 = self.capacity;
                var $321 = self.buffer;
                var $322 = VoxBox$new$(_length$1, $320, $321);
                var $319 = $322;
                break;
        };
        return $319;
    };
    const VoxBox$set_length = x0 => x1 => VoxBox$set_length$(x0, x1);
    const VoxBox$push = a0 => a1 => a2 => ((a2.buffer[a2.length * 2] = a0, a2.buffer[a2.length * 2 + 1] = a1, a2.length++, a2));

    function VoxBox$parse$(_voxdata$1) {
        var _siz$2 = ((((_voxdata$1.length) >>> 0) / 12) >>> 0);
        var _img$3 = VoxBox$alloc_capacity$(_siz$2);
        var _img$4 = (() => {
            var $324 = _img$3;
            var $325 = 0;
            var $326 = _siz$2;
            let _img$5 = $324;
            for (let _i$4 = $325; _i$4 < $326; ++_i$4) {
                var _x$6 = VoxBox$parse_byte$(((((_i$4 * 6) >>> 0) + 0) >>> 0), _voxdata$1);
                var _y$7 = VoxBox$parse_byte$(((((_i$4 * 6) >>> 0) + 1) >>> 0), _voxdata$1);
                var _z$8 = VoxBox$parse_byte$(((((_i$4 * 6) >>> 0) + 2) >>> 0), _voxdata$1);
                var _r$9 = VoxBox$parse_byte$(((((_i$4 * 6) >>> 0) + 3) >>> 0), _voxdata$1);
                var _g$10 = VoxBox$parse_byte$(((((_i$4 * 6) >>> 0) + 4) >>> 0), _voxdata$1);
                var _b$11 = VoxBox$parse_byte$(((((_i$4 * 6) >>> 0) + 5) >>> 0), _voxdata$1);
                var _pos$12 = ((0 | _x$6 | (_y$7 << 12) | (_z$8 << 24)));
                var _col$13 = ((0 | _r$9 | (_g$10 << 8) | (_b$11 << 16) | (255 << 24)));
                var $324 = ((_img$5.buffer[_img$5.length * 2] = _pos$12, _img$5.buffer[_img$5.length * 2 + 1] = _col$13, _img$5.length++, _img$5));
                _img$5 = $324;
            };
            return _img$5;
        })();
        var $323 = _img$4;
        return $323;
    };
    const VoxBox$parse = x0 => VoxBox$parse$(x0);
    const Web$Kaelin$Assets$hero$croni0_d_1 = VoxBox$parse$("0f0b16351d4d100b16351d4d0d0c15351d4d0e0c15351d4d0f0c156a3a86100c158e4a9d110c15351d4d120c15351d4d0c0d14351d4d0d0d146a3a860e0d146a3a860f0d148e4a9d100d146a3a86110d146a3a86120d146a3a86130d14351d4d0b0e13351d4d0c0e136a3a860d0e136a3a860e0e136a3a860f0e136a3a86100e136a3a86110e136a3a86120e136a3a86130e136a3a86140e13351d4d0a0f12351d4d0b0f126a3a860c0f126a3a860d0f126a3a860e0f126a3a860f0f126a3a86100f126a3a86110f126a3a86120f126a3a86130f126a3a86140f126a3a86150f12351d4d0a1011351d4d0b10116a3a860c10116a3a860d10116a3a860e10116a3a860f10116a3a861010116a3a861110116a3a861210116a3a861310116a3a861410116a3a86151011351d4d091110351d4d0a11106a3a860b11106a3a860c11106a3a860d11106a3a860e11106a3a860f11106a3a861011106a3a861111106a3a861211106a3a861311106a3a861411106a3a861511106a3a86161110351d4d09120f351d4d0a120f6a3a860b120f6a3a860c120f602d800d120f602d800e120f6a3a860f120f6a3a8610120f6a3a8611120f6a3a8612120f602d8013120f602d8014120f6a3a8615120f6a3a8616120f351d4d09130e351d4d0a130e602d800b130e602d800c130e351d4d0d130e351d4d0e130e6a3a860f130e6a3a8610130e6a3a8611130e6a3a8612130e351d4d13130e351d4d14130e602d8015130e602d8016130e351d4d09140d351d4d0a140d602d800b140d351d4d0c140d351d4d0d140d531e480e140d351d4d0f140d6a3a8610140d6a3a8611140d351d4d12140d531e4813140d351d4d14140d351d4d15140d4a358016140d351d4d09150c351d4d0a150c4a35800b150c351d4d0c150c531e480d150cdf3e460e150c531e480f150c351d4d10150c351d4d11150c531e4812150cdf3e4613150c531e4814150c351d4d15150c4a358016150c351d4d0a160b351d4d0b160b4a35800c160b351d4d0d160b531e480e160b351d4d0f160b351d4d10160b351d4d11160b351d4d12160b531e4813160b351d4d14160b4a358015160b351d4d0b170a351d4d0c170a4a35800d170a8e4a9d0e170a351d4d0f170a351d4d10170a351d4d11170a351d4d12170a8e4a9d13170a4a358014170a351d4d0d1809351d4d0e1809602d800f1809602d801018094a3580111809602d80121809351d4d0c1908351d4d0d19086a3a860e19086a3a860f19086a3a861019084a35801119086a3a861219086a3a86131908351d4d0c1a07351d4d0d1a076a3a860e1a076a3a860f1a076a3a86101a074a3580111a076a3a86121a076a3a86131a07351d4d0c1b06351d4d0d1b068e4a9d0e1b066a3a860f1b066a3a86101b064a3580111b066a3a86121b068e4a9d131b06351d4d0d1c05351d4d0e1c05351d4d0f1c05351d4d101c05351d4d111c05351d4d121c05351d4d111d04351d4d121d04351d4d");

    function I32$new$(_value$1) {
        var $327 = word_to_i32(_value$1);
        return $327;
    };
    const I32$new = x0 => I32$new$(x0);

    function Word$neg$aux$(_word$2, _inc$3) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $329 = self.pred;
                var self = _inc$3;
                if (self) {
                    var $331 = Word$o$(Word$neg$aux$($329, Bool$true));
                    var $330 = $331;
                } else {
                    var $332 = Word$i$(Word$neg$aux$($329, Bool$false));
                    var $330 = $332;
                };
                var $328 = $330;
                break;
            case 'Word.i':
                var $333 = self.pred;
                var self = _inc$3;
                if (self) {
                    var $335 = Word$i$(Word$neg$aux$($333, Bool$false));
                    var $334 = $335;
                } else {
                    var $336 = Word$o$(Word$neg$aux$($333, Bool$false));
                    var $334 = $336;
                };
                var $328 = $334;
                break;
            case 'Word.e':
                var $337 = Word$e;
                var $328 = $337;
                break;
        };
        return $328;
    };
    const Word$neg$aux = x0 => x1 => Word$neg$aux$(x0, x1);

    function Word$neg$(_word$2) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $339 = self.pred;
                var $340 = Word$o$(Word$neg$aux$($339, Bool$true));
                var $338 = $340;
                break;
            case 'Word.i':
                var $341 = self.pred;
                var $342 = Word$i$(Word$neg$aux$($341, Bool$false));
                var $338 = $342;
                break;
            case 'Word.e':
                var $343 = Word$e;
                var $338 = $343;
                break;
        };
        return $338;
    };
    const Word$neg = x0 => Word$neg$(x0);
    const I32$neg = a0 => ((-a0));
    const Int$to_i32 = a0 => (Number(a0));
    const Int$new = a0 => a1 => (a0 - a1);
    const Int$from_nat = a0 => (a0);
    const I32$from_nat = a0 => (Number(a0));

    function List$cons$(_head$2, _tail$3) {
        var $344 = ({
            _: 'List.cons',
            'head': _head$2,
            'tail': _tail$3
        });
        return $344;
    };
    const List$cons = x0 => x1 => List$cons$(x0, x1);

    function Web$Kaelin$Skill$new$(_name$1, _range$2, _effect$3, _key$4) {
        var $345 = ({
            _: 'Web.Kaelin.Skill.new',
            'name': _name$1,
            'range': _range$2,
            'effect': _effect$3,
            'key': _key$4
        });
        return $345;
    };
    const Web$Kaelin$Skill$new = x0 => x1 => x2 => x3 => Web$Kaelin$Skill$new$(x0, x1, x2, x3);

    function Web$Kaelin$Effect$Result$(_A$1) {
        var $346 = null;
        return $346;
    };
    const Web$Kaelin$Effect$Result = x0 => Web$Kaelin$Effect$Result$(x0);

    function List$(_A$1) {
        var $347 = null;
        return $347;
    };
    const List = x0 => List$(x0);

    function List$concat$(_as$2, _bs$3) {
        var self = _as$2;
        switch (self._) {
            case 'List.cons':
                var $349 = self.head;
                var $350 = self.tail;
                var $351 = List$cons$($349, List$concat$($350, _bs$3));
                var $348 = $351;
                break;
            case 'List.nil':
                var $352 = _bs$3;
                var $348 = $352;
                break;
        };
        return $348;
    };
    const List$concat = x0 => x1 => List$concat$(x0, x1);

    function BitsMap$(_A$1) {
        var $353 = null;
        return $353;
    };
    const BitsMap = x0 => BitsMap$(x0);

    function BitsMap$tie$(_val$2, _lft$3, _rgt$4) {
        var $354 = ({
            _: 'BitsMap.tie',
            'val': _val$2,
            'lft': _lft$3,
            'rgt': _rgt$4
        });
        return $354;
    };
    const BitsMap$tie = x0 => x1 => x2 => BitsMap$tie$(x0, x1, x2);

    function BitsMap$union$(_a$2, _b$3) {
        var self = _a$2;
        switch (self._) {
            case 'BitsMap.tie':
                var $356 = self.val;
                var $357 = self.lft;
                var $358 = self.rgt;
                var self = _b$3;
                switch (self._) {
                    case 'BitsMap.tie':
                        var $360 = self.val;
                        var $361 = self.lft;
                        var $362 = self.rgt;
                        var self = $356;
                        switch (self._) {
                            case 'Maybe.none':
                                var $364 = BitsMap$tie$($360, BitsMap$union$($357, $361), BitsMap$union$($358, $362));
                                var $363 = $364;
                                break;
                            case 'Maybe.some':
                                var $365 = BitsMap$tie$($356, BitsMap$union$($357, $361), BitsMap$union$($358, $362));
                                var $363 = $365;
                                break;
                        };
                        var $359 = $363;
                        break;
                    case 'BitsMap.new':
                        var $366 = _a$2;
                        var $359 = $366;
                        break;
                };
                var $355 = $359;
                break;
            case 'BitsMap.new':
                var $367 = _b$3;
                var $355 = $367;
                break;
        };
        return $355;
    };
    const BitsMap$union = x0 => x1 => BitsMap$union$(x0, x1);

    function NatMap$union$(_a$2, _b$3) {
        var $368 = BitsMap$union$(_a$2, _b$3);
        return $368;
    };
    const NatMap$union = x0 => x1 => NatMap$union$(x0, x1);

    function Web$Kaelin$Effect$Result$new$(_value$2, _map$3, _futures$4, _indicators$5) {
        var $369 = ({
            _: 'Web.Kaelin.Effect.Result.new',
            'value': _value$2,
            'map': _map$3,
            'futures': _futures$4,
            'indicators': _indicators$5
        });
        return $369;
    };
    const Web$Kaelin$Effect$Result$new = x0 => x1 => x2 => x3 => Web$Kaelin$Effect$Result$new$(x0, x1, x2, x3);

    function Web$Kaelin$Effect$bind$(_effect$3, _next$4, _tick$5, _center$6, _target$7, _map$8) {
        var self = _effect$3(_tick$5)(_center$6)(_target$7)(_map$8);
        switch (self._) {
            case 'Web.Kaelin.Effect.Result.new':
                var $371 = self.value;
                var $372 = self.map;
                var $373 = self.futures;
                var $374 = self.indicators;
                var self = _next$4($371)(_tick$5)(_center$6)(_target$7)($372);
                switch (self._) {
                    case 'Web.Kaelin.Effect.Result.new':
                        var $376 = self.value;
                        var $377 = self.map;
                        var $378 = self.futures;
                        var $379 = self.indicators;
                        var _value$17 = $376;
                        var _map$18 = $377;
                        var _futures$19 = List$concat$($373, $378);
                        var _indicators$20 = NatMap$union$($374, $379);
                        var $380 = Web$Kaelin$Effect$Result$new$(_value$17, _map$18, _futures$19, _indicators$20);
                        var $375 = $380;
                        break;
                };
                var $370 = $375;
                break;
        };
        return $370;
    };
    const Web$Kaelin$Effect$bind = x0 => x1 => x2 => x3 => x4 => x5 => Web$Kaelin$Effect$bind$(x0, x1, x2, x3, x4, x5);
    const List$nil = ({
        _: 'List.nil'
    });
    const BitsMap$new = ({
        _: 'BitsMap.new'
    });
    const NatMap$new = BitsMap$new;

    function Web$Kaelin$Effect$pure$(_value$2, _tick$3, _center$4, _target$5, _map$6) {
        var $381 = Web$Kaelin$Effect$Result$new$(_value$2, _map$6, List$nil, NatMap$new);
        return $381;
    };
    const Web$Kaelin$Effect$pure = x0 => x1 => x2 => x3 => x4 => Web$Kaelin$Effect$pure$(x0, x1, x2, x3, x4);

    function Web$Kaelin$Effect$monad$(_new$2) {
        var $382 = _new$2(Web$Kaelin$Effect$bind)(Web$Kaelin$Effect$pure);
        return $382;
    };
    const Web$Kaelin$Effect$monad = x0 => Web$Kaelin$Effect$monad$(x0);
    const NatMap = null;

    function Web$Kaelin$Effect$map$get$(_tick$1, _center$2, _target$3, _map$4) {
        var $383 = Web$Kaelin$Effect$Result$new$(_map$4, _map$4, List$nil, NatMap$new);
        return $383;
    };
    const Web$Kaelin$Effect$map$get = x0 => x1 => x2 => x3 => Web$Kaelin$Effect$map$get$(x0, x1, x2, x3);

    function Web$Kaelin$Effect$coord$get_target$(_tick$1, _center$2, _target$3, _map$4) {
        var $384 = Web$Kaelin$Effect$Result$new$(_target$3, _map$4, List$nil, NatMap$new);
        return $384;
    };
    const Web$Kaelin$Effect$coord$get_target = x0 => x1 => x2 => x3 => Web$Kaelin$Effect$coord$get_target$(x0, x1, x2, x3);
    const I32$sub = a0 => a1 => ((a0 - a1) >> 0);

    function Web$Kaelin$Coord$Cubic$new$(_x$1, _y$2, _z$3) {
        var $385 = ({
            _: 'Web.Kaelin.Coord.Cubic.new',
            'x': _x$1,
            'y': _y$2,
            'z': _z$3
        });
        return $385;
    };
    const Web$Kaelin$Coord$Cubic$new = x0 => x1 => x2 => Web$Kaelin$Coord$Cubic$new$(x0, x1, x2);

    function Web$Kaelin$Coord$Convert$axial_to_cubic$(_coord$1) {
        var self = _coord$1;
        switch (self._) {
            case 'Web.Kaelin.Coord.new':
                var $387 = self.i;
                var $388 = self.j;
                var _x$4 = $387;
                var _z$5 = $388;
                var _y$6 = ((((-_x$4)) - _z$5) >> 0);
                var $389 = Web$Kaelin$Coord$Cubic$new$(_x$4, _y$6, _z$5);
                var $386 = $389;
                break;
        };
        return $386;
    };
    const Web$Kaelin$Coord$Convert$axial_to_cubic = x0 => Web$Kaelin$Coord$Convert$axial_to_cubic$(x0);

    function List$map$(_f$3, _as$4) {
        var self = _as$4;
        switch (self._) {
            case 'List.cons':
                var $391 = self.head;
                var $392 = self.tail;
                var $393 = List$cons$(_f$3($391), List$map$(_f$3, $392));
                var $390 = $393;
                break;
            case 'List.nil':
                var $394 = List$nil;
                var $390 = $394;
                break;
        };
        return $390;
    };
    const List$map = x0 => x1 => List$map$(x0, x1);

    function Web$Kaelin$Coord$Convert$cubic_to_axial$(_coord$1) {
        var self = _coord$1;
        switch (self._) {
            case 'Web.Kaelin.Coord.Cubic.new':
                var $396 = self.x;
                var $397 = self.z;
                var _i$5 = $396;
                var _j$6 = $397;
                var $398 = Web$Kaelin$Coord$new$(_i$5, _j$6);
                var $395 = $398;
                break;
        };
        return $395;
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
        var $399 = (((_n$1) >>> 0));
        return $399;
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
        var $400 = (((_n$1) >> 0));
        return $400;
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
                        var $401 = self.pred;
                        var $402 = Word$is_neg$go$($401, Bool$false);
                        return $402;
                    case 'Word.i':
                        var $403 = self.pred;
                        var $404 = Word$is_neg$go$($403, Bool$true);
                        return $404;
                    case 'Word.e':
                        var $405 = _n$3;
                        return $405;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Word$is_neg$go = x0 => x1 => Word$is_neg$go$(x0, x1);

    function Word$is_neg$(_word$2) {
        var $406 = Word$is_neg$go$(_word$2, Bool$false);
        return $406;
    };
    const Word$is_neg = x0 => Word$is_neg$(x0);

    function Cmp$as_gtn$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
            case 'Cmp.eql':
                var $408 = Bool$false;
                var $407 = $408;
                break;
            case 'Cmp.gtn':
                var $409 = Bool$true;
                var $407 = $409;
                break;
        };
        return $407;
    };
    const Cmp$as_gtn = x0 => Cmp$as_gtn$(x0);

    function Cmp$inv$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
                var $411 = Cmp$gtn;
                var $410 = $411;
                break;
            case 'Cmp.eql':
                var $412 = Cmp$eql;
                var $410 = $412;
                break;
            case 'Cmp.gtn':
                var $413 = Cmp$ltn;
                var $410 = $413;
                break;
        };
        return $410;
    };
    const Cmp$inv = x0 => Cmp$inv$(x0);

    function Word$s_gtn$(_a$2, _b$3) {
        var _neg_a$4 = Word$is_neg$(_a$2);
        var _neg_b$5 = Word$is_neg$(_b$3);
        var self = _neg_a$4;
        if (self) {
            var self = _neg_b$5;
            if (self) {
                var $416 = Cmp$as_gtn$(Cmp$inv$(Word$cmp$(_a$2, _b$3)));
                var $415 = $416;
            } else {
                var $417 = Bool$false;
                var $415 = $417;
            };
            var $414 = $415;
        } else {
            var self = _neg_b$5;
            if (self) {
                var $419 = Bool$true;
                var $418 = $419;
            } else {
                var $420 = Cmp$as_gtn$(Word$cmp$(_a$2, _b$3));
                var $418 = $420;
            };
            var $414 = $418;
        };
        return $414;
    };
    const Word$s_gtn = x0 => x1 => Word$s_gtn$(x0, x1);
    const I32$gtn = a0 => a1 => (a0 > a1);

    function I32$max$(_a$1, _b$2) {
        var self = (_a$1 > _b$2);
        if (self) {
            var $422 = _a$1;
            var $421 = $422;
        } else {
            var $423 = _b$2;
            var $421 = $423;
        };
        return $421;
    };
    const I32$max = x0 => x1 => I32$max$(x0, x1);
    const I32$add = a0 => a1 => ((a0 + a1) >> 0);

    function Cmp$as_ltn$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
                var $425 = Bool$true;
                var $424 = $425;
                break;
            case 'Cmp.eql':
            case 'Cmp.gtn':
                var $426 = Bool$false;
                var $424 = $426;
                break;
        };
        return $424;
    };
    const Cmp$as_ltn = x0 => Cmp$as_ltn$(x0);

    function Word$s_ltn$(_a$2, _b$3) {
        var _neg_a$4 = Word$is_neg$(_a$2);
        var _neg_b$5 = Word$is_neg$(_b$3);
        var self = _neg_a$4;
        if (self) {
            var self = _neg_b$5;
            if (self) {
                var $429 = Cmp$as_ltn$(Cmp$inv$(Word$cmp$(_a$2, _b$3)));
                var $428 = $429;
            } else {
                var $430 = Bool$true;
                var $428 = $430;
            };
            var $427 = $428;
        } else {
            var self = _neg_b$5;
            if (self) {
                var $432 = Bool$false;
                var $431 = $432;
            } else {
                var $433 = Cmp$as_ltn$(Word$cmp$(_a$2, _b$3));
                var $431 = $433;
            };
            var $427 = $431;
        };
        return $427;
    };
    const Word$s_ltn = x0 => x1 => Word$s_ltn$(x0, x1);
    const I32$ltn = a0 => a1 => (a0 < a1);

    function I32$min$(_a$1, _b$2) {
        var self = (_a$1 < _b$2);
        if (self) {
            var $435 = _a$1;
            var $434 = $435;
        } else {
            var $436 = _b$2;
            var $434 = $436;
        };
        return $434;
    };
    const I32$min = x0 => x1 => I32$min$(x0, x1);

    function Word$shr$(_n$2, _value$3) {
        var _n_nat$4 = Word$to_nat$(_n$2);
        var $437 = Word$shift_right$(_n_nat$4, _value$3);
        return $437;
    };
    const Word$shr = x0 => x1 => Word$shr$(x0, x1);

    function Word$s_shr$(_n$2, _value$3) {
        var _neg$4 = Word$is_neg$(_n$2);
        var self = _neg$4;
        if (self) {
            var _n$5 = Word$neg$(_n$2);
            var $439 = Word$shl$(_n$5, _value$3);
            var $438 = $439;
        } else {
            var $440 = Word$shr$(_n$2, _value$3);
            var $438 = $440;
        };
        return $438;
    };
    const Word$s_shr = x0 => x1 => Word$s_shr$(x0, x1);
    const I32$shr = a0 => a1 => (a0 >> a1);

    function Word$xor$(_a$2, _b$3) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $442 = self.pred;
                var $443 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $445 = self.pred;
                            var $446 = (_a$pred$9 => {
                                var $447 = Word$o$(Word$xor$(_a$pred$9, $445));
                                return $447;
                            });
                            var $444 = $446;
                            break;
                        case 'Word.i':
                            var $448 = self.pred;
                            var $449 = (_a$pred$9 => {
                                var $450 = Word$i$(Word$xor$(_a$pred$9, $448));
                                return $450;
                            });
                            var $444 = $449;
                            break;
                        case 'Word.e':
                            var $451 = (_a$pred$7 => {
                                var $452 = Word$e;
                                return $452;
                            });
                            var $444 = $451;
                            break;
                    };
                    var $444 = $444($442);
                    return $444;
                });
                var $441 = $443;
                break;
            case 'Word.i':
                var $453 = self.pred;
                var $454 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $456 = self.pred;
                            var $457 = (_a$pred$9 => {
                                var $458 = Word$i$(Word$xor$(_a$pred$9, $456));
                                return $458;
                            });
                            var $455 = $457;
                            break;
                        case 'Word.i':
                            var $459 = self.pred;
                            var $460 = (_a$pred$9 => {
                                var $461 = Word$o$(Word$xor$(_a$pred$9, $459));
                                return $461;
                            });
                            var $455 = $460;
                            break;
                        case 'Word.e':
                            var $462 = (_a$pred$7 => {
                                var $463 = Word$e;
                                return $463;
                            });
                            var $455 = $462;
                            break;
                    };
                    var $455 = $455($453);
                    return $455;
                });
                var $441 = $454;
                break;
            case 'Word.e':
                var $464 = (_b$4 => {
                    var $465 = Word$e;
                    return $465;
                });
                var $441 = $464;
                break;
        };
        var $441 = $441(_b$3);
        return $441;
    };
    const Word$xor = x0 => x1 => Word$xor$(x0, x1);
    const I32$xor = a0 => a1 => (a0 ^ a1);

    function I32$abs$(_a$1) {
        var _mask$2 = (_a$1 >> 31);
        var $466 = (((_mask$2 + _a$1) >> 0) ^ _mask$2);
        return $466;
    };
    const I32$abs = x0 => I32$abs$(x0);

    function Web$Kaelin$Coord$Cubic$add$(_a$1, _b$2) {
        var self = _a$1;
        switch (self._) {
            case 'Web.Kaelin.Coord.Cubic.new':
                var $468 = self.x;
                var $469 = self.y;
                var $470 = self.z;
                var self = _b$2;
                switch (self._) {
                    case 'Web.Kaelin.Coord.Cubic.new':
                        var $472 = self.x;
                        var $473 = self.y;
                        var $474 = self.z;
                        var _x$9 = (($468 + $472) >> 0);
                        var _y$10 = (($469 + $473) >> 0);
                        var _z$11 = (($470 + $474) >> 0);
                        var $475 = Web$Kaelin$Coord$Cubic$new$(_x$9, _y$10, _z$11);
                        var $471 = $475;
                        break;
                };
                var $467 = $471;
                break;
        };
        return $467;
    };
    const Web$Kaelin$Coord$Cubic$add = x0 => x1 => Web$Kaelin$Coord$Cubic$add$(x0, x1);

    function Web$Kaelin$Coord$Cubic$range$(_coord$1, _distance$2) {
        var _distance_32$3 = I32$to_u32$(_distance$2);
        var _double_distance$4 = ((((_distance_32$3 * 2) >>> 0) + 1) >>> 0);
        var _result$5 = List$nil;
        var _result$6 = (() => {
            var $477 = _result$5;
            var $478 = 0;
            var $479 = _double_distance$4;
            let _result$7 = $477;
            for (let _j$6 = $478; _j$6 < $479; ++_j$6) {
                var _negative_distance$8 = ((-_distance$2));
                var _positive_distance$9 = _distance$2;
                var _x$10 = ((U32$to_i32$(_j$6) - _positive_distance$9) >> 0);
                var _max$11 = I32$max$(_negative_distance$8, ((((-_x$10)) + _negative_distance$8) >> 0));
                var _min$12 = I32$min$(_positive_distance$9, ((((-_x$10)) + _positive_distance$9) >> 0));
                var _distance_between_max_min$13 = ((1 + I32$to_u32$(I32$abs$(((_max$11 - _min$12) >> 0)))) >>> 0);
                var _result$14 = (() => {
                    var $480 = _result$7;
                    var $481 = 0;
                    var $482 = _distance_between_max_min$13;
                    let _result$15 = $480;
                    for (let _i$14 = $481; _i$14 < $482; ++_i$14) {
                        var _y$16 = ((U32$to_i32$(_i$14) + _max$11) >> 0);
                        var _z$17 = ((((-_x$10)) - _y$16) >> 0);
                        var _new_coord$18 = Web$Kaelin$Coord$Cubic$add$(_coord$1, Web$Kaelin$Coord$Cubic$new$(_x$10, _y$16, _z$17));
                        var $480 = List$cons$(_new_coord$18, _result$15);
                        _result$15 = $480;
                    };
                    return _result$15;
                })();
                var $477 = _result$14;
                _result$7 = $477;
            };
            return _result$7;
        })();
        var $476 = _result$6;
        return $476;
    };
    const Web$Kaelin$Coord$Cubic$range = x0 => x1 => Web$Kaelin$Coord$Cubic$range$(x0, x1);

    function Web$Kaelin$Coord$Axial$range$(_a$1, _distance$2) {
        var _ab$3 = Web$Kaelin$Coord$Convert$axial_to_cubic$(_a$1);
        var _d$4 = _distance$2;
        var $483 = List$map$(Web$Kaelin$Coord$Convert$cubic_to_axial, Web$Kaelin$Coord$Cubic$range$(_ab$3, _d$4));
        return $483;
    };
    const Web$Kaelin$Coord$Axial$range = x0 => x1 => Web$Kaelin$Coord$Axial$range$(x0, x1);

    function Cmp$as_lte$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
            case 'Cmp.eql':
                var $485 = Bool$true;
                var $484 = $485;
                break;
            case 'Cmp.gtn':
                var $486 = Bool$false;
                var $484 = $486;
                break;
        };
        return $484;
    };
    const Cmp$as_lte = x0 => Cmp$as_lte$(x0);

    function Word$lte$(_a$2, _b$3) {
        var $487 = Cmp$as_lte$(Word$cmp$(_a$2, _b$3));
        return $487;
    };
    const Word$lte = x0 => x1 => Word$lte$(x0, x1);
    const U32$lte = a0 => a1 => (a0 <= a1);

    function Web$Kaelin$Coord$fit$(_coord$1, _map_size$2) {
        var _coord$3 = Web$Kaelin$Coord$Convert$axial_to_cubic$(_coord$1);
        var self = _coord$3;
        switch (self._) {
            case 'Web.Kaelin.Coord.Cubic.new':
                var $489 = self.x;
                var $490 = self.y;
                var $491 = self.z;
                var _x$7 = I32$abs$($489);
                var _y$8 = I32$abs$($490);
                var _z$9 = I32$abs$($491);
                var _greater$10 = I32$max$(_x$7, I32$max$(_y$8, _z$9));
                var _greater$11 = I32$to_u32$(_greater$10);
                var $492 = (_greater$11 <= _map_size$2);
                var $488 = $492;
                break;
        };
        return $488;
    };
    const Web$Kaelin$Coord$fit = x0 => x1 => Web$Kaelin$Coord$fit$(x0, x1);
    const Web$Kaelin$Constants$map_size = 5;

    function List$filter$(_f$2, _xs$3) {
        var self = _xs$3;
        switch (self._) {
            case 'List.cons':
                var $494 = self.head;
                var $495 = self.tail;
                var self = _f$2($494);
                if (self) {
                    var $497 = List$cons$($494, List$filter$(_f$2, $495));
                    var $496 = $497;
                } else {
                    var $498 = List$filter$(_f$2, $495);
                    var $496 = $498;
                };
                var $493 = $496;
                break;
            case 'List.nil':
                var $499 = List$nil;
                var $493 = $499;
                break;
        };
        return $493;
    };
    const List$filter = x0 => x1 => List$filter$(x0, x1);

    function Web$Kaelin$Coord$range$(_coord$1, _distance$2) {
        var _list_coords$3 = Web$Kaelin$Coord$Axial$range$(_coord$1, _distance$2);
        var _fit$4 = (_x$4 => {
            var $501 = Web$Kaelin$Coord$fit$(_x$4, Web$Kaelin$Constants$map_size);
            return $501;
        });
        var $500 = List$filter$(_fit$4, _list_coords$3);
        return $500;
    };
    const Web$Kaelin$Coord$range = x0 => x1 => Web$Kaelin$Coord$range$(x0, x1);
    const List$for = a0 => a1 => a2 => (list_for(a0)(a1)(a2));
    const I32$mul = a0 => a1 => ((a0 * a1) >> 0);
    const U32$to_nat = a0 => (BigInt(a0));

    function Web$Kaelin$Coord$Convert$axial_to_nat$(_coord$1) {
        var self = _coord$1;
        switch (self._) {
            case 'Web.Kaelin.Coord.new':
                var $503 = self.i;
                var $504 = self.j;
                var _i$4 = (($503 + 100) >> 0);
                var _i$5 = ((_i$4 * 1000) >> 0);
                var _i$6 = I32$to_u32$(_i$5);
                var _j$7 = (($504 + 100) >> 0);
                var _j$8 = I32$to_u32$(_j$7);
                var _sum$9 = ((_i$6 + _j$8) >>> 0);
                var $505 = (BigInt(_sum$9));
                var $502 = $505;
                break;
        };
        return $502;
    };
    const Web$Kaelin$Coord$Convert$axial_to_nat = x0 => Web$Kaelin$Coord$Convert$axial_to_nat$(x0);

    function Maybe$some$(_value$2) {
        var $506 = ({
            _: 'Maybe.some',
            'value': _value$2
        });
        return $506;
    };
    const Maybe$some = x0 => Maybe$some$(x0);
    const BitsMap$set = a0 => a1 => a2 => (bitsmap_set(a0, a1, a2, 'set'));
    const Bits$o = a0 => (a0 + '0');
    const Bits$e = '';
    const Bits$i = a0 => (a0 + '1');

    function Bits$inc$(_a$1) {
        var self = _a$1;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'o':
                var $508 = self.slice(0, -1);
                var $509 = ($508 + '1');
                var $507 = $509;
                break;
            case 'i':
                var $510 = self.slice(0, -1);
                var $511 = (Bits$inc$($510) + '0');
                var $507 = $511;
                break;
            case 'e':
                var $512 = (Bits$e + '1');
                var $507 = $512;
                break;
        };
        return $507;
    };
    const Bits$inc = x0 => Bits$inc$(x0);
    const Nat$to_bits = a0 => (nat_to_bits(a0));

    function NatMap$set$(_key$2, _val$3, _map$4) {
        var $513 = (bitsmap_set((nat_to_bits(_key$2)), _val$3, _map$4, 'set'));
        return $513;
    };
    const NatMap$set = x0 => x1 => x2 => NatMap$set$(x0, x1, x2);

    function Web$Kaelin$Effect$result$union$(_a$2, _b$3, _value_union$4) {
        var $514 = Web$Kaelin$Effect$Result$new$(_value_union$4((() => {
            var self = _a$2;
            switch (self._) {
                case 'Web.Kaelin.Effect.Result.new':
                    var $515 = self.value;
                    var $516 = $515;
                    return $516;
            };
        })())((() => {
            var self = _b$3;
            switch (self._) {
                case 'Web.Kaelin.Effect.Result.new':
                    var $517 = self.value;
                    var $518 = $517;
                    return $518;
            };
        })()), (() => {
            var self = _b$3;
            switch (self._) {
                case 'Web.Kaelin.Effect.Result.new':
                    var $519 = self.map;
                    var $520 = $519;
                    return $520;
            };
        })(), List$concat$((() => {
            var self = _a$2;
            switch (self._) {
                case 'Web.Kaelin.Effect.Result.new':
                    var $521 = self.futures;
                    var $522 = $521;
                    return $522;
            };
        })(), (() => {
            var self = _b$3;
            switch (self._) {
                case 'Web.Kaelin.Effect.Result.new':
                    var $523 = self.futures;
                    var $524 = $523;
                    return $524;
            };
        })()), NatMap$union$((() => {
            var self = _a$2;
            switch (self._) {
                case 'Web.Kaelin.Effect.Result.new':
                    var $525 = self.indicators;
                    var $526 = $525;
                    return $526;
            };
        })(), (() => {
            var self = _b$3;
            switch (self._) {
                case 'Web.Kaelin.Effect.Result.new':
                    var $527 = self.indicators;
                    var $528 = $527;
                    return $528;
            };
        })()));
        return $514;
    };
    const Web$Kaelin$Effect$result$union = x0 => x1 => x2 => Web$Kaelin$Effect$result$union$(x0, x1, x2);

    function Web$Kaelin$Effect$area$(_eff$2, _coords$3, _tick$4, _center$5, _target$6, _map$7) {
        var _map_result$8 = NatMap$new;
        var _eff_result$9 = Web$Kaelin$Effect$pure(_map_result$8);
        var _result$10 = Web$Kaelin$Effect$Result$new$(_map_result$8, _map$7, List$nil, NatMap$new);
        var _result$11 = (() => {
            var $531 = _result$10;
            var $532 = _coords$3;
            let _result$12 = $531;
            let _coord$11;
            while ($532._ === 'List.cons') {
                _coord$11 = $532.head;
                var _result_of_effect$13 = _eff$2(_tick$4)(_center$5)(_coord$11)((() => {
                    var self = _result$12;
                    switch (self._) {
                        case 'Web.Kaelin.Effect.Result.new':
                            var $533 = self.map;
                            var $534 = $533;
                            return $534;
                    };
                })());
                var _key$14 = Web$Kaelin$Coord$Convert$axial_to_nat$(_coord$11);
                var _new_form$15 = Web$Kaelin$Effect$Result$new$(NatMap$set$(_key$14, (() => {
                    var self = _result_of_effect$13;
                    switch (self._) {
                        case 'Web.Kaelin.Effect.Result.new':
                            var $535 = self.value;
                            var $536 = $535;
                            return $536;
                    };
                })(), NatMap$new), (() => {
                    var self = _result_of_effect$13;
                    switch (self._) {
                        case 'Web.Kaelin.Effect.Result.new':
                            var $537 = self.map;
                            var $538 = $537;
                            return $538;
                    };
                })(), (() => {
                    var self = _result_of_effect$13;
                    switch (self._) {
                        case 'Web.Kaelin.Effect.Result.new':
                            var $539 = self.futures;
                            var $540 = $539;
                            return $540;
                    };
                })(), (() => {
                    var self = _result_of_effect$13;
                    switch (self._) {
                        case 'Web.Kaelin.Effect.Result.new':
                            var $541 = self.indicators;
                            var $542 = $541;
                            return $542;
                    };
                })());
                var $531 = Web$Kaelin$Effect$result$union$(_result$12, _new_form$15, NatMap$union);
                _result$12 = $531;
                $532 = $532.tail;
            }
            return _result$12;
        })();
        var $529 = _result$11;
        return $529;
    };
    const Web$Kaelin$Effect$area = x0 => x1 => x2 => x3 => x4 => x5 => Web$Kaelin$Effect$area$(x0, x1, x2, x3, x4, x5);

    function Maybe$(_A$1) {
        var $543 = null;
        return $543;
    };
    const Maybe = x0 => Maybe$(x0);
    const BitsMap$get = a0 => a1 => (bitsmap_get(a0, a1));

    function NatMap$get$(_key$2, _map$3) {
        var $544 = (bitsmap_get((nat_to_bits(_key$2)), _map$3));
        return $544;
    };
    const NatMap$get = x0 => x1 => NatMap$get$(x0, x1);

    function Web$Kaelin$Tile$new$(_background$1, _creature$2, _animation$3) {
        var $545 = ({
            _: 'Web.Kaelin.Tile.new',
            'background': _background$1,
            'creature': _creature$2,
            'animation': _animation$3
        });
        return $545;
    };
    const Web$Kaelin$Tile$new = x0 => x1 => x2 => Web$Kaelin$Tile$new$(x0, x1, x2);

    function Web$Kaelin$Map$modify_at$(_mod$1, _pos$2, _map$3) {
        var _key$4 = Web$Kaelin$Coord$Convert$axial_to_nat$(_pos$2);
        var _tile$5 = NatMap$get$(_key$4, _map$3);
        var self = _tile$5;
        switch (self._) {
            case 'Maybe.some':
                var $547 = self.value;
                var self = $547;
                switch (self._) {
                    case 'Web.Kaelin.Tile.new':
                        var $549 = self.background;
                        var $550 = self.creature;
                        var $551 = self.animation;
                        var self = $550;
                        switch (self._) {
                            case 'Maybe.some':
                                var $553 = self.value;
                                var _new_creature$11 = _mod$1($553);
                                var _new_tile$12 = Web$Kaelin$Tile$new$($549, Maybe$some$(_new_creature$11), $551);
                                var $554 = NatMap$set$(_key$4, _new_tile$12, _map$3);
                                var $552 = $554;
                                break;
                            case 'Maybe.none':
                                var $555 = _map$3;
                                var $552 = $555;
                                break;
                        };
                        var $548 = $552;
                        break;
                };
                var $546 = $548;
                break;
            case 'Maybe.none':
                var $556 = _map$3;
                var $546 = $556;
                break;
        };
        return $546;
    };
    const Web$Kaelin$Map$modify_at = x0 => x1 => x2 => Web$Kaelin$Map$modify_at$(x0, x1, x2);

    function Word$s_lte$(_a$2, _b$3) {
        var _neg_a$4 = Word$is_neg$(_a$2);
        var _neg_b$5 = Word$is_neg$(_b$3);
        var self = _neg_a$4;
        if (self) {
            var self = _neg_b$5;
            if (self) {
                var $559 = Cmp$as_lte$(Cmp$inv$(Word$cmp$(_a$2, _b$3)));
                var $558 = $559;
            } else {
                var $560 = Bool$true;
                var $558 = $560;
            };
            var $557 = $558;
        } else {
            var self = _neg_b$5;
            if (self) {
                var $562 = Bool$false;
                var $561 = $562;
            } else {
                var $563 = Cmp$as_lte$(Word$cmp$(_a$2, _b$3));
                var $561 = $563;
            };
            var $557 = $561;
        };
        return $557;
    };
    const Word$s_lte = x0 => x1 => Word$s_lte$(x0, x1);
    const I32$lte = a0 => a1 => (a0 <= a1);

    function Web$Kaelin$Creature$new$(_player$1, _hero$2, _team$3, _hp$4, _status$5) {
        var $564 = ({
            _: 'Web.Kaelin.Creature.new',
            'player': _player$1,
            'hero': _hero$2,
            'team': _team$3,
            'hp': _hp$4,
            'status': _status$5
        });
        return $564;
    };
    const Web$Kaelin$Creature$new = x0 => x1 => x2 => x3 => x4 => Web$Kaelin$Creature$new$(x0, x1, x2, x3, x4);

    function Web$Kaelin$Tile$creature$change_hp$(_change$1, _creature$2) {
        var self = _creature$2;
        switch (self._) {
            case 'Web.Kaelin.Creature.new':
                var $566 = self.hero;
                var $567 = self.hp;
                var self = $566;
                switch (self._) {
                    case 'Web.Kaelin.Hero.new':
                        var $569 = self.max_hp;
                        var self = ($567 <= 0);
                        if (self) {
                            var $571 = _creature$2;
                            var $570 = $571;
                        } else {
                            var self = _creature$2;
                            switch (self._) {
                                case 'Web.Kaelin.Creature.new':
                                    var $573 = self.player;
                                    var $574 = self.hero;
                                    var $575 = self.team;
                                    var $576 = self.status;
                                    var $577 = Web$Kaelin$Creature$new$($573, $574, $575, I32$min$((($567 + _change$1) >> 0), $569), $576);
                                    var $572 = $577;
                                    break;
                            };
                            var $570 = $572;
                        };
                        var $568 = $570;
                        break;
                };
                var $565 = $568;
                break;
        };
        return $565;
    };
    const Web$Kaelin$Tile$creature$change_hp = x0 => x1 => Web$Kaelin$Tile$creature$change_hp$(x0, x1);

    function Web$Kaelin$Map$change_hp_at$(_value$1, _pos$2, _map$3) {
        var _map$4 = Web$Kaelin$Map$modify_at$(Web$Kaelin$Tile$creature$change_hp(_value$1), _pos$2, _map$3);
        var $578 = Pair$new$(_value$1, _map$4);
        return $578;
    };
    const Web$Kaelin$Map$change_hp_at = x0 => x1 => x2 => Web$Kaelin$Map$change_hp_at$(x0, x1, x2);

    function Pair$fst$(_pair$3) {
        var self = _pair$3;
        switch (self._) {
            case 'Pair.new':
                var $580 = self.fst;
                var $581 = $580;
                var $579 = $581;
                break;
        };
        return $579;
    };
    const Pair$fst = x0 => Pair$fst$(x0);

    function Pair$snd$(_pair$3) {
        var self = _pair$3;
        switch (self._) {
            case 'Pair.new':
                var $583 = self.snd;
                var $584 = $583;
                var $582 = $584;
                break;
        };
        return $582;
    };
    const Pair$snd = x0 => Pair$snd$(x0);

    function Web$Kaelin$Effect$map$set$(_new_map$1, _tick$2, _center$3, _target$4, _map$5) {
        var $585 = Web$Kaelin$Effect$Result$new$(Unit$new, _new_map$1, List$nil, NatMap$new);
        return $585;
    };
    const Web$Kaelin$Effect$map$set = x0 => x1 => x2 => x3 => x4 => Web$Kaelin$Effect$map$set$(x0, x1, x2, x3, x4);

    function Word$s_gte$(_a$2, _b$3) {
        var _neg_a$4 = Word$is_neg$(_a$2);
        var _neg_b$5 = Word$is_neg$(_b$3);
        var self = _neg_a$4;
        if (self) {
            var self = _neg_b$5;
            if (self) {
                var $588 = Cmp$as_gte$(Cmp$inv$(Word$cmp$(_a$2, _b$3)));
                var $587 = $588;
            } else {
                var $589 = Bool$false;
                var $587 = $589;
            };
            var $586 = $587;
        } else {
            var self = _neg_b$5;
            if (self) {
                var $591 = Bool$true;
                var $590 = $591;
            } else {
                var $592 = Cmp$as_gte$(Word$cmp$(_a$2, _b$3));
                var $590 = $592;
            };
            var $586 = $590;
        };
        return $586;
    };
    const Word$s_gte = x0 => x1 => Word$s_gte$(x0, x1);
    const I32$gte = a0 => a1 => (a0 >= a1);

    function Web$Kaelin$Effect$(_A$1) {
        var $593 = null;
        return $593;
    };
    const Web$Kaelin$Effect = x0 => Web$Kaelin$Effect$(x0);

    function Web$Kaelin$Effect$indicators$add$(_indicators$1, _tick$2, _center$3, _target$4, _map$5) {
        var $594 = Web$Kaelin$Effect$Result$new$(Unit$new, _map$5, List$nil, _indicators$1);
        return $594;
    };
    const Web$Kaelin$Effect$indicators$add = x0 => x1 => x2 => x3 => x4 => Web$Kaelin$Effect$indicators$add$(x0, x1, x2, x3, x4);
    const Web$Kaelin$Indicator$green = ({
        _: 'Web.Kaelin.Indicator.green'
    });
    const Web$Kaelin$Indicator$red = ({
        _: 'Web.Kaelin.Indicator.red'
    });

    function Web$Kaelin$Effect$hp$change$(_change$1) {
        var $595 = Web$Kaelin$Effect$monad$((_m$bind$2 => _m$pure$3 => {
            var $596 = _m$bind$2;
            return $596;
        }))(Web$Kaelin$Effect$map$get)((_map$2 => {
            var $597 = Web$Kaelin$Effect$monad$((_m$bind$3 => _m$pure$4 => {
                var $598 = _m$bind$3;
                return $598;
            }))(Web$Kaelin$Effect$coord$get_target)((_target$3 => {
                var _res$4 = Web$Kaelin$Map$change_hp_at$(_change$1, _target$3, _map$2);
                var _dhp$5 = Pair$fst$(_res$4);
                var _map$6 = Pair$snd$(_res$4);
                var _key$7 = Web$Kaelin$Coord$Convert$axial_to_nat$(_target$3);
                var _indicators$8 = NatMap$new;
                var $599 = Web$Kaelin$Effect$monad$((_m$bind$9 => _m$pure$10 => {
                    var $600 = _m$bind$9;
                    return $600;
                }))(Web$Kaelin$Effect$map$set(_map$6))((_$9 => {
                    var $601 = Web$Kaelin$Effect$monad$((_m$bind$10 => _m$pure$11 => {
                        var $602 = _m$bind$10;
                        return $602;
                    }))((() => {
                        var self = (_dhp$5 >= 0);
                        if (self) {
                            var $603 = Web$Kaelin$Effect$indicators$add(NatMap$set$(_key$7, Web$Kaelin$Indicator$green, _indicators$8));
                            return $603;
                        } else {
                            var self = (_dhp$5 < 0);
                            if (self) {
                                var $605 = Web$Kaelin$Effect$indicators$add(NatMap$set$(_key$7, Web$Kaelin$Indicator$red, _indicators$8));
                                var $604 = $605;
                            } else {
                                var $606 = Web$Kaelin$Effect$monad$((_m$bind$10 => _m$pure$11 => {
                                    var $607 = _m$pure$11;
                                    return $607;
                                }))(Unit$new);
                                var $604 = $606;
                            };
                            return $604;
                        };
                    })())((_$10 => {
                        var $608 = Web$Kaelin$Effect$monad$((_m$bind$11 => _m$pure$12 => {
                            var $609 = _m$pure$12;
                            return $609;
                        }))(_dhp$5);
                        return $608;
                    }));
                    return $601;
                }));
                return $599;
            }));
            return $597;
        }));
        return $595;
    };
    const Web$Kaelin$Effect$hp$change = x0 => Web$Kaelin$Effect$hp$change$(x0);

    function Web$Kaelin$Effect$hp$damage$(_dmg$1) {
        var $610 = Web$Kaelin$Effect$hp$change$(((-_dmg$1)));
        return $610;
    };
    const Web$Kaelin$Effect$hp$damage = x0 => Web$Kaelin$Effect$hp$damage$(x0);

    function Web$Kaelin$Effect$all$fireball$(_dmg$1, _range$2) {
        var $611 = Web$Kaelin$Effect$monad$((_m$bind$3 => _m$pure$4 => {
            var $612 = _m$bind$3;
            return $612;
        }))(Web$Kaelin$Effect$map$get)((_map$3 => {
            var $613 = Web$Kaelin$Effect$monad$((_m$bind$4 => _m$pure$5 => {
                var $614 = _m$bind$4;
                return $614;
            }))(Web$Kaelin$Effect$coord$get_target)((_target_pos$4 => {
                var _coords$5 = Web$Kaelin$Coord$range$(_target_pos$4, _range$2);
                var $615 = Web$Kaelin$Effect$monad$((_m$bind$6 => _m$pure$7 => {
                    var $616 = _m$bind$6;
                    return $616;
                }))(Web$Kaelin$Effect$area(Web$Kaelin$Effect$hp$damage$(_dmg$1))(_coords$5))((_$6 => {
                    var $617 = Web$Kaelin$Effect$monad$((_m$bind$7 => _m$pure$8 => {
                        var $618 = _m$pure$8;
                        return $618;
                    }))(Unit$new);
                    return $617;
                }));
                return $615;
            }));
            return $613;
        }));
        return $611;
    };
    const Web$Kaelin$Effect$all$fireball = x0 => x1 => Web$Kaelin$Effect$all$fireball$(x0, x1);
    const Web$Kaelin$Heroes$Croni$skills$quick_shot = Web$Kaelin$Skill$new$("Quick Shot", 2, Web$Kaelin$Effect$all$fireball$(3, 1), 48);

    function Web$Kaelin$Effect$coord$get_center$(_tick$1, _center$2, _target$3, _map$4) {
        var $619 = Web$Kaelin$Effect$Result$new$(_center$2, _map$4, List$nil, NatMap$new);
        return $619;
    };
    const Web$Kaelin$Effect$coord$get_center = x0 => x1 => x2 => x3 => Web$Kaelin$Effect$coord$get_center$(x0, x1, x2, x3);

    function Web$Kaelin$Effect$hp$change_at$(_change$1, _pos$2) {
        var $620 = Web$Kaelin$Effect$monad$((_m$bind$3 => _m$pure$4 => {
            var $621 = _m$bind$3;
            return $621;
        }))(Web$Kaelin$Effect$map$get)((_map$3 => {
            var _res$4 = Web$Kaelin$Map$change_hp_at$(_change$1, _pos$2, _map$3);
            var _dhp$5 = Pair$fst$(_res$4);
            var _map$6 = Pair$snd$(_res$4);
            var _key$7 = Web$Kaelin$Coord$Convert$axial_to_nat$(_pos$2);
            var _indicators$8 = NatMap$new;
            var $622 = Web$Kaelin$Effect$monad$((_m$bind$9 => _m$pure$10 => {
                var $623 = _m$bind$9;
                return $623;
            }))(Web$Kaelin$Effect$map$set(_map$6))((_$9 => {
                var $624 = Web$Kaelin$Effect$monad$((_m$bind$10 => _m$pure$11 => {
                    var $625 = _m$bind$10;
                    return $625;
                }))((() => {
                    var self = (_dhp$5 >= 0);
                    if (self) {
                        var $626 = Web$Kaelin$Effect$indicators$add(NatMap$set$(_key$7, Web$Kaelin$Indicator$green, _indicators$8));
                        return $626;
                    } else {
                        var self = (_dhp$5 < 0);
                        if (self) {
                            var $628 = Web$Kaelin$Effect$indicators$add(NatMap$set$(_key$7, Web$Kaelin$Indicator$red, _indicators$8));
                            var $627 = $628;
                        } else {
                            var $629 = Web$Kaelin$Effect$monad$((_m$bind$10 => _m$pure$11 => {
                                var $630 = _m$pure$11;
                                return $630;
                            }))(Unit$new);
                            var $627 = $629;
                        };
                        return $627;
                    };
                })())((_$10 => {
                    var $631 = Web$Kaelin$Effect$monad$((_m$bind$11 => _m$pure$12 => {
                        var $632 = _m$pure$12;
                        return $632;
                    }))(_dhp$5);
                    return $631;
                }));
                return $624;
            }));
            return $622;
        }));
        return $620;
    };
    const Web$Kaelin$Effect$hp$change_at = x0 => x1 => Web$Kaelin$Effect$hp$change_at$(x0, x1);

    function Web$Kaelin$Effect$hp$damage_at$(_dmg$1, _pos$2) {
        var $633 = Web$Kaelin$Effect$hp$change_at$(((-_dmg$1)), _pos$2);
        return $633;
    };
    const Web$Kaelin$Effect$hp$damage_at = x0 => x1 => Web$Kaelin$Effect$hp$damage_at$(x0, x1);

    function Web$Kaelin$Effect$hp$heal_at$(_dmg$1, _pos$2) {
        var $634 = Web$Kaelin$Effect$hp$change_at$(((-_dmg$1)), _pos$2);
        return $634;
    };
    const Web$Kaelin$Effect$hp$heal_at = x0 => x1 => Web$Kaelin$Effect$hp$heal_at$(x0, x1);

    function Web$Kaelin$Effect$all$vampirism$(_dmg$1) {
        var $635 = Web$Kaelin$Effect$monad$((_m$bind$2 => _m$pure$3 => {
            var $636 = _m$bind$2;
            return $636;
        }))(Web$Kaelin$Effect$coord$get_center)((_center_pos$2 => {
            var $637 = Web$Kaelin$Effect$monad$((_m$bind$3 => _m$pure$4 => {
                var $638 = _m$bind$3;
                return $638;
            }))(Web$Kaelin$Effect$coord$get_target)((_target_pos$3 => {
                var $639 = Web$Kaelin$Effect$monad$((_m$bind$4 => _m$pure$5 => {
                    var $640 = _m$bind$4;
                    return $640;
                }))(Web$Kaelin$Effect$hp$damage_at$(_dmg$1, _target_pos$3))((_actual_dmg$4 => {
                    var $641 = Web$Kaelin$Effect$monad$((_m$bind$5 => _m$pure$6 => {
                        var $642 = _m$bind$5;
                        return $642;
                    }))(Web$Kaelin$Effect$hp$heal_at$(_actual_dmg$4, _center_pos$2))((_$5 => {
                        var $643 = Web$Kaelin$Effect$monad$((_m$bind$6 => _m$pure$7 => {
                            var $644 = _m$pure$7;
                            return $644;
                        }))(Unit$new);
                        return $643;
                    }));
                    return $641;
                }));
                return $639;
            }));
            return $637;
        }));
        return $635;
    };
    const Web$Kaelin$Effect$all$vampirism = x0 => Web$Kaelin$Effect$all$vampirism$(x0);
    const Web$Kaelin$Heroes$Croni$skills$vampirism = Web$Kaelin$Skill$new$("Vampirism", 3, Web$Kaelin$Effect$all$vampirism$(3), 86);

    function Web$Kaelin$Map$get$(_coord$1, _map$2) {
        var _key$3 = Web$Kaelin$Coord$Convert$axial_to_nat$(_coord$1);
        var $645 = NatMap$get$(_key$3, _map$2);
        return $645;
    };
    const Web$Kaelin$Map$get = x0 => x1 => Web$Kaelin$Map$get$(x0, x1);

    function Web$Kaelin$Map$is_occupied$(_coord$1, _map$2) {
        var _maybe_tile$3 = Web$Kaelin$Map$get$(_coord$1, _map$2);
        var self = _maybe_tile$3;
        switch (self._) {
            case 'Maybe.some':
                var $647 = self.value;
                var self = $647;
                switch (self._) {
                    case 'Web.Kaelin.Tile.new':
                        var $649 = self.creature;
                        var self = $649;
                        switch (self._) {
                            case 'Maybe.none':
                                var $651 = Bool$false;
                                var $650 = $651;
                                break;
                            case 'Maybe.some':
                                var $652 = Bool$true;
                                var $650 = $652;
                                break;
                        };
                        var $648 = $650;
                        break;
                };
                var $646 = $648;
                break;
            case 'Maybe.none':
                var $653 = Bool$false;
                var $646 = $653;
                break;
        };
        return $646;
    };
    const Web$Kaelin$Map$is_occupied = x0 => x1 => Web$Kaelin$Map$is_occupied$(x0, x1);

    function Web$Kaelin$Map$set$(_coord$1, _tile$2, _map$3) {
        var _key$4 = Web$Kaelin$Coord$Convert$axial_to_nat$(_coord$1);
        var $654 = NatMap$set$(_key$4, _tile$2, _map$3);
        return $654;
    };
    const Web$Kaelin$Map$set = x0 => x1 => x2 => Web$Kaelin$Map$set$(x0, x1, x2);

    function Web$Kaelin$Map$pop_creature$(_coord$1, _map$2) {
        var _tile$3 = Web$Kaelin$Map$get$(_coord$1, _map$2);
        var self = _tile$3;
        switch (self._) {
            case 'Maybe.some':
                var $656 = self.value;
                var self = $656;
                switch (self._) {
                    case 'Web.Kaelin.Tile.new':
                        var $658 = self.background;
                        var $659 = self.creature;
                        var $660 = self.animation;
                        var _creature$8 = $659;
                        var _remaining_tile$9 = Web$Kaelin$Tile$new$($658, Maybe$none, $660);
                        var _new_map$10 = Web$Kaelin$Map$set$(_coord$1, _remaining_tile$9, _map$2);
                        var $661 = Pair$new$(_new_map$10, _creature$8);
                        var $657 = $661;
                        break;
                };
                var $655 = $657;
                break;
            case 'Maybe.none':
                var $662 = Pair$new$(_map$2, Maybe$none);
                var $655 = $662;
                break;
        };
        return $655;
    };
    const Web$Kaelin$Map$pop_creature = x0 => x1 => Web$Kaelin$Map$pop_creature$(x0, x1);

    function Web$Kaelin$Map$Entity$creature$(_value$1) {
        var $663 = ({
            _: 'Web.Kaelin.Map.Entity.creature',
            'value': _value$1
        });
        return $663;
    };
    const Web$Kaelin$Map$Entity$creature = x0 => Web$Kaelin$Map$Entity$creature$(x0);

    function Web$Kaelin$Map$push$(_coord$1, _entity$2, _map$3) {
        var _tile$4 = Web$Kaelin$Map$get$(_coord$1, _map$3);
        var self = _tile$4;
        switch (self._) {
            case 'Maybe.some':
                var $665 = self.value;
                var self = $665;
                switch (self._) {
                    case 'Web.Kaelin.Tile.new':
                        var self = _entity$2;
                        switch (self._) {
                            case 'Web.Kaelin.Map.Entity.animation':
                                var $668 = self.value;
                                var self = $665;
                                switch (self._) {
                                    case 'Web.Kaelin.Tile.new':
                                        var $670 = self.background;
                                        var $671 = self.creature;
                                        var $672 = Web$Kaelin$Tile$new$($670, $671, Maybe$some$($668));
                                        var _animation_tile$10 = $672;
                                        break;
                                };
                                var $669 = Web$Kaelin$Map$set$(_coord$1, _animation_tile$10, _map$3);
                                var $667 = $669;
                                break;
                            case 'Web.Kaelin.Map.Entity.background':
                                var $673 = self.value;
                                var self = $665;
                                switch (self._) {
                                    case 'Web.Kaelin.Tile.new':
                                        var $675 = self.creature;
                                        var $676 = self.animation;
                                        var $677 = Web$Kaelin$Tile$new$($673, $675, $676);
                                        var _background_tile$10 = $677;
                                        break;
                                };
                                var $674 = Web$Kaelin$Map$set$(_coord$1, _background_tile$10, _map$3);
                                var $667 = $674;
                                break;
                            case 'Web.Kaelin.Map.Entity.creature':
                                var $678 = self.value;
                                var self = $665;
                                switch (self._) {
                                    case 'Web.Kaelin.Tile.new':
                                        var $680 = self.background;
                                        var $681 = self.animation;
                                        var $682 = Web$Kaelin$Tile$new$($680, Maybe$some$($678), $681);
                                        var _creature_tile$10 = $682;
                                        break;
                                };
                                var $679 = Web$Kaelin$Map$set$(_coord$1, _creature_tile$10, _map$3);
                                var $667 = $679;
                                break;
                        };
                        var $666 = $667;
                        break;
                };
                var $664 = $666;
                break;
            case 'Maybe.none':
                var self = _entity$2;
                switch (self._) {
                    case 'Web.Kaelin.Map.Entity.background':
                        var $684 = self.value;
                        var _new_tile$6 = Web$Kaelin$Tile$new$($684, Maybe$none, Maybe$none);
                        var $685 = Web$Kaelin$Map$set$(_coord$1, _new_tile$6, _map$3);
                        var $683 = $685;
                        break;
                    case 'Web.Kaelin.Map.Entity.animation':
                    case 'Web.Kaelin.Map.Entity.creature':
                        var $686 = _map$3;
                        var $683 = $686;
                        break;
                };
                var $664 = $683;
                break;
        };
        return $664;
    };
    const Web$Kaelin$Map$push = x0 => x1 => x2 => Web$Kaelin$Map$push$(x0, x1, x2);

    function Web$Kaelin$Map$swap$(_ca$1, _cb$2, _map$3) {
        var self = Web$Kaelin$Map$pop_creature$(_ca$1, _map$3);
        switch (self._) {
            case 'Pair.new':
                var $688 = self.fst;
                var $689 = self.snd;
                var self = $689;
                switch (self._) {
                    case 'Maybe.some':
                        var $691 = self.value;
                        var _entity$7 = Web$Kaelin$Map$Entity$creature$($691);
                        var $692 = Web$Kaelin$Map$push$(_cb$2, _entity$7, $688);
                        var $690 = $692;
                        break;
                    case 'Maybe.none':
                        var $693 = _map$3;
                        var $690 = $693;
                        break;
                };
                var $687 = $690;
                break;
        };
        return $687;
    };
    const Web$Kaelin$Map$swap = x0 => x1 => x2 => Web$Kaelin$Map$swap$(x0, x1, x2);
    const Web$Kaelin$Effect$all$move = Web$Kaelin$Effect$monad$((_m$bind$1 => _m$pure$2 => {
        var $694 = _m$bind$1;
        return $694;
    }))(Web$Kaelin$Effect$map$get)((_map$1 => {
        var $695 = Web$Kaelin$Effect$monad$((_m$bind$2 => _m$pure$3 => {
            var $696 = _m$bind$2;
            return $696;
        }))(Web$Kaelin$Effect$coord$get_center)((_center$2 => {
            var $697 = Web$Kaelin$Effect$monad$((_m$bind$3 => _m$pure$4 => {
                var $698 = _m$bind$3;
                return $698;
            }))(Web$Kaelin$Effect$coord$get_target)((_target$3 => {
                var _key$4 = Web$Kaelin$Coord$Convert$axial_to_nat$(_center$2);
                var _tile$5 = NatMap$get$(_key$4, _map$1);
                var self = _tile$5;
                switch (self._) {
                    case 'Maybe.some':
                        var $700 = self.value;
                        var self = $700;
                        switch (self._) {
                            case 'Web.Kaelin.Tile.new':
                                var self = Web$Kaelin$Map$is_occupied$(_target$3, _map$1);
                                if (self) {
                                    var $703 = Web$Kaelin$Effect$monad$((_m$bind$10 => _m$pure$11 => {
                                        var $704 = _m$pure$11;
                                        return $704;
                                    }))(Unit$new);
                                    var $702 = $703;
                                } else {
                                    var _new_map$10 = Web$Kaelin$Map$swap$(_center$2, _target$3, _map$1);
                                    var $705 = Web$Kaelin$Effect$map$set(_new_map$10);
                                    var $702 = $705;
                                };
                                var $701 = $702;
                                break;
                        };
                        var $699 = $701;
                        break;
                    case 'Maybe.none':
                        var $706 = Web$Kaelin$Effect$monad$((_m$bind$6 => _m$pure$7 => {
                            var $707 = _m$pure$7;
                            return $707;
                        }))(Unit$new);
                        var $699 = $706;
                        break;
                };
                return $699;
            }));
            return $697;
        }));
        return $695;
    }));

    function Web$Kaelin$Skill$move$(_range$1) {
        var $708 = Web$Kaelin$Skill$new$("Move", _range$1, Web$Kaelin$Effect$all$move, 88);
        return $708;
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
            var $710 = Web$Kaelin$Heroes$Croni$hero;
            var $709 = $710;
        } else {
            var self = (_name$1 === "Cyclope");
            if (self) {
                var $712 = Web$Kaelin$Heroes$Cyclope$hero;
                var $711 = $712;
            } else {
                var self = (_name$1 === "Lela");
                if (self) {
                    var $714 = Web$Kaelin$Heroes$Lela$hero;
                    var $713 = $714;
                } else {
                    var self = (_name$1 === "Octoking");
                    if (self) {
                        var $716 = Web$Kaelin$Heroes$Octoking$hero;
                        var $715 = $716;
                    } else {
                        var $717 = Web$Kaelin$Heroes$Croni$hero;
                        var $715 = $717;
                    };
                    var $713 = $715;
                };
                var $711 = $713;
            };
            var $709 = $711;
        };
        return $709;
    };
    const Web$Kaelin$Hero$info = x0 => Web$Kaelin$Hero$info$(x0);

    function Web$Kaelin$Tile$creature$create$(_hero_name$1, _player_addr$2, _team$3) {
        var _hero$4 = Web$Kaelin$Hero$info$(_hero_name$1);
        var self = _hero$4;
        switch (self._) {
            case 'Web.Kaelin.Hero.new':
                var $719 = self.max_hp;
                var $720 = Web$Kaelin$Creature$new$(_player_addr$2, _hero$4, _team$3, $719, List$nil);
                var $718 = $720;
                break;
        };
        return $718;
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
        var $721 = _map$15;
        return $721;
    };
    const Web$Kaelin$Map$init = x0 => Web$Kaelin$Map$init$(x0);
    const Web$Kaelin$Assets$tile$green_2 = VoxBox$parse$("0e00011652320f00011652321000011652320c01011652320d01011652320e0101408d640f0101408d64100101469e651101011652321201011652320a02011652320b02011652320c0201469e650d0201469e650e0201469e650f0201408d64100201469e65110201469e65120201408d641302011652321402011652320803011652320903011652320a0301469e650b0301408d640c0301469e650d0301469e650e0301469e650f0301408d64100301408d64110301408d64120301408d64130301469e65140301469e65150301165232160301165232060401165232070401165232080401469e65090401469e650a0401469e650b0401408d640c0401408d640d0401469e650e0401469e650f0401408d64100401469e65110401408d64120401408d64130401408d64140401408d64150401408d64160401408d64170401165232180401165232040501165232050501165232060501469e65070501408d64080501469e65090501469e650a0501408d640b0501408d640c0501408d640d0501347e570e0501347e570f0501469e65100501469e65110501469e65120501347e57130501408d64140501469e65150501469e65160501408d64170501469e65180501469e651905011652321a0501165232020601165232030601165232040601347e57050601469e65060601469e65070601408d64080601408d64090601347e570a0601408d640b0601408d640c0601408d640d0601408d640e0601347e570f0601469e65100601469e65110601408d64120601347e57130601347e57140601469e65150601469e65160601408d64170601408d64180601347e57190601408d641a0601408d641b06011652321c0601165232000701165232010701165232020701408d64030701408d64040701408d64050701469e65060701469e65070701469e65080701408d64090701347e570a0701347e570b0701408d640c0701469e650d0701469e650e0701408d640f0701408d64100701408d64110701408d64120701408d64130701408d64140701408d64150701408d64160701408d64170701408d64180701347e57190701347e571a0701408d641b0701469e651c0701469e651d07011652321e0701165232000801165232010801408d64020801469e65030801469e65040801408d64050801469e65060801469e65070801469e65080801408d64090801469e650a0801469e650b0801408d640c0801408d640d0801469e650e0801469e650f0801347e57100801408d64110801469e65120801469e65130801408d64140801469e65150801469e65160801469e65170801408d64180801408d64190801408d641a0801408d641b0801408d641c0801469e651d0801469e651e0801165232000901165232010901408d64020901408d64030901469e65040901408d64050901408d64060901469e65070901408d64080901408d64090901469e650a0901469e650b0901408d640c0901408d640d0901469e650e0901469e650f0901408d64100901408d64110901469e65120901469e65130901408d64140901408d64150901469e65160901469e65170901408d64180901408d64190901469e651a0901469e651b0901408d641c0901408d641d0901408d641e0901165232000a01165232010a01408d64020a01408d64030a01347e57040a01347e57050a01408d64060a01408d64070a01408d64080a01408d64090a01408d640a0a01469e650b0a01469e650c0a01408d640d0a01408d640e0a01408d640f0a01408d64100a01408d64110a01408d64120a01408d64130a01408d64140a01347e57150a01408d64160a01408d64170a01408d64180a01408d64190a01469e651a0a01469e651b0a01469e651c0a01408d641d0a01408d641e0a01165232000b01165232010b01408d64020b01469e65030b01408d64040b01408d64050b01469e65060b01469e65070b01408d64080b01408d64090b01408d640a0b01408d640b0b01408d640c0b01408d640d0b01469e650e0b01408d640f0b01408d64100b01408d64110b01469e65120b01408d64130b01408d64140b01347e57150b01469e65160b01408d64170b01408d64180b01408d64190b01408d641a0b01408d641b0b01408d641c0b01408d641d0b01408d641e0b01165232000c01165232010c01408d64020c01469e65030c01408d64040c01408d64050c01408d64060c01408d64070c01469e65080c01469e65090c01408d640a0c01347e570b0c01347e570c0c01408d640d0c01469e650e0c01408d640f0c01469e65100c01408d64110c01408d64120c01408d64130c01408d64140c01408d64150c01408d64160c01469e65170c01469e65180c01408d64190c01347e571a0c01347e571b0c01408d641c0c01408d641d0c01408d641e0c01165232000d01165232010d01408d64020d01408d64030d01469e65040d01469e65050d01408d64060d01469e65070d01469e65080d01469e65090d01408d640a0d01347e570b0d01408d640c0d01469e650d0d01469e650e0d01408d640f0d01469e65100d01408d64110d01408d64120d01469e65130d01469e65140d01408d64150d01469e65160d01469e65170d01469e65180d01408d64190d01347e571a0d01408d641b0d01469e651c0d01469e651d0d01408d641e0d01165232000e01165232010e01408d64020e01469e65030e01469e65040e01469e65050e01408d64060e01469e65070e01469e65080e01408d64090e01408d640a0e01408d640b0e01408d640c0e01469e650d0e01469e650e0e01469e650f0e01347e57100e01408d64110e01469e65120e01469e65130e01469e65140e01408d64150e01469e65160e01469e65170e01408d64180e01408d64190e01408d641a0e01408d641b0e01469e651c0e01469e651d0e01469e651e0e01165232000f01165232010f01408d64020f01469e65030f01469e65040f01408d64050f01408d64060f01408d64070f01408d64080f01408d64090f01408d640a0f01408d640b0f01408d640c0f01408d640d0f01469e650e0f01469e650f0f01347e57100f01347e57110f01469e65120f01469e65130f01408d64140f01408d64150f01408d64160f01408d64170f01408d64180f01408d64190f01408d641a0f01408d641b0f01408d641c0f01469e651d0f01469e651e0f01165232001001165232011001408d64021001469e65031001469e65041001408d64051001347e57061001408d64071001469e65081001469e65091001469e650a1001408d640b1001469e650c1001469e650d1001408d640e1001408d640f1001469e65101001408d64111001469e65121001469e65131001408d64141001347e57151001408d64161001469e65171001469e65181001469e65191001408d641a1001469e651b1001469e651c1001408d641d1001408d641e1001165232001101165232011101469e65021101469e65031101469e65041101408d64051101408d64061101408d64071101469e65081101469e65091101408d640a1101408d640b1101408d640c1101408d640d1101408d640e1101408d640f1101408d64101101469e65111101469e65121101469e65131101408d64141101408d64151101408d64161101469e65171101469e65181101408d64191101408d641a1101408d641b1101408d641c1101408d641d1101408d641e1101165232001201165232011201469e65021201469e65031201408d64041201469e65051201469e65061201408d64071201408d64081201408d64091201408d640a1201408d640b1201408d640c1201469e650d1201469e650e1201469e650f1201408d64101201469e65111201469e65121201408d64131201469e65141201469e65151201408d64161201408d64171201408d64181201408d64191201408d641a1201408d641b1201469e651c1201469e651d1201469e651e1201165232001301165232011301408d64021301408d64031301408d64041301469e65051301469e65061301408d64071301408d64081301408d64091301469e650a1301469e650b1301408d640c1301469e650d1301469e650e1301469e650f1301408d64101301408d64111301408d64121301408d64131301469e65141301469e65151301408d64161301408d64171301408d64181301469e65191301469e651a1301408d641b1301469e651c1301469e651d1301469e651e1301165232001401165232011401469e65021401408d64031401408d64041401408d64051401408d64061401408d64071401408d64081401469e65091401469e650a1401469e650b1401408d640c1401408d640d1401469e650e1401469e650f1401408d64101401469e65111401408d64121401408d64131401408d64141401408d64151401408d64161401408d64171401469e65181401469e65191401469e651a1401408d641b1401408d641c1401469e651d1401469e651e1401165232001501165232011501469e65021501469e65031501347e57041501408d64051501469e65061501469e65071501408d64081501469e65091501469e650a1501408d640b1501408d640c1501408d640d1501347e570e1501347e570f1501469e65101501469e65111501469e65121501347e57131501408d64141501469e65151501469e65161501408d64171501469e65181501469e65191501408d641a1501408d641b1501408d641c1501347e571d1501347e571e1501165232001601165232011601469e65021601408d64031601347e57041601347e57051601469e65061601469e65071601408d64081601408d64091601347e570a1601408d640b1601408d640c1601408d640d1601408d640e1601347e570f1601469e65101601469e65111601408d64121601347e57131601347e57141601469e65151601469e65161601408d64171601408d64181601347e57191601408d641a1601408d641b1601408d641c1601408d641d1601347e571e1601165232001701165232011701165232021701408d64031701408d64041701408d64051701408d64061701408d64071701408d64081701408d64091701347e570a1701347e570b1701408d640c1701469e650d1701469e650e1701408d640f1701408d64101701408d64111701408d64121701408d64131701408d64141701408d64151701408d64161701408d64171701408d64181701347e57191701347e571a1701408d641b1701469e651c1701469e651d17011652321e1701165232021801165232031801165232041801408d64051801408d64061801469e65071801469e65081801408d64091801469e650a1801469e650b1801408d640c1801469e650d1801469e650e1801469e650f1801347e57101801347e57111801469e65121801469e65131801408d64141801408d64151801469e65161801469e65171801408d64181801469e65191801469e651a1801408d641b18011652321c1801165232041901165232051901165232061901469e65071901469e65081901408d64091901469e650a1901469e650b1901408d640c1901408d640d1901469e650e1901469e650f1901347e57101901408d64111901469e65121901469e65131901408d64141901469e65151901469e65161901469e65171901408d64181901469e651919011652321a1901165232061a01165232071a01165232081a01408d64091a01408d640a1a01408d640b1a01408d640c1a01408d640d1a01408d640e1a01408d640f1a01408d64101a01408d64111a01408d64121a01408d64131a01408d64141a01469e65151a01469e65161a01408d64171a01165232181a01165232081b01165232091b011652320a1b01347e570b1b01347e570c1b01408d640d1b01408d640e1b01408d640f1b01469e65101b01408d64111b01408d64121b01408d64131b01408d64141b01408d64151b01165232161b011652320a1c011652320b1c011652320c1c01469e650d1c01469e650e1c01408d640f1c01469e65101c01408d64111c01408d64121c01469e65131c01165232141c011652320c1d011652320d1d011652320e1d01469e650f1d01408d64101d01408d64111d01165232121d011652320e1e011652320f1e01165232101e01165232");
    const Web$Kaelin$Assets$tile$effect$dark_red2 = VoxBox$parse$("0e0001881c170f0001881c17100001881c170c0101881c170d0101881c170e0101bc524c0f0101bc524c100101c75f56110101881c17120101881c170a0201881c170b0201881c170c0201c75f560d0201c75f560e0201c75f560f0201bc524c100201c75f56110201c75f56120201bc524c130201881c17140201881c17080301881c17090301881c170a0301c75f560b0301bc524c0c0301c75f560d0301c75f560e0301c75f560f0301bc524c100301bc524c110301bc524c120301bc524c130301c75f56140301c75f56150301881c17160301881c17060401881c17070401881c17080401c75f56090401c75f560a0401c75f560b0401bc524c0c0401bc524c0d0401c75f560e0401c75f560f0401bc524c100401c75f56110401bc524c120401bc524c130401bc524c140401bc524c150401bc524c160401bc524c170401881c17180401881c17040501881c17050501881c17060501c75f56070501bc524c080501c75f56090501c75f560a0501bc524c0b0501bc524c0c0501bc524c0d0501ae443e0e0501ae443e0f0501c75f56100501c75f56110501c75f56120501ae443e130501bc524c140501c75f56150501c75f56160501bc524c170501c75f56180501c75f56190501881c171a0501881c17020601881c17030601881c17040601ae443e050601c75f56060601c75f56070601bc524c080601bc524c090601ae443e0a0601bc524c0b0601bc524c0c0601bc524c0d0601bc524c0e0601ae443e0f0601c75f56100601c75f56110601bc524c120601ae443e130601ae443e140601c75f56150601c75f56160601bc524c170601bc524c180601ae443e190601bc524c1a0601bc524c1b0601881c171c0601881c17000701881c17010701881c17020701bc524c030701bc524c040701bc524c050701c75f56060701c75f56070701c75f56080701bc524c090701ae443e0a0701ae443e0b0701bc524c0c0701c75f560d0701c75f560e0701bc524c0f0701bc524c100701bc524c110701bc524c120701bc524c130701bc524c140701bc524c150701bc524c160701bc524c170701bc524c180701ae443e190701ae443e1a0701bc524c1b0701c75f561c0701c75f561d0701881c171e0701881c17000801881c17010801bc524c020801c75f56030801c75f56040801bc524c050801c75f56060801c75f56070801c75f56080801bc524c090801c75f560a0801c75f560b0801bc524c0c0801bc524c0d0801c75f560e0801c75f560f0801ae443e100801bc524c110801c75f56120801c75f56130801bc524c140801c75f56150801c75f56160801c75f56170801bc524c180801bc524c190801bc524c1a0801bc524c1b0801bc524c1c0801c75f561d0801c75f561e0801881c17000901881c17010901bc524c020901bc524c030901c75f56040901bc524c050901bc524c060901c75f56070901bc524c080901bc524c090901c75f560a0901c75f560b0901bc524c0c0901bc524c0d0901c75f560e0901c75f560f0901bc524c100901bc524c110901c75f56120901c75f56130901bc524c140901bc524c150901c75f56160901c75f56170901bc524c180901bc524c190901c75f561a0901c75f561b0901bc524c1c0901bc524c1d0901bc524c1e0901881c17000a01881c17010a01bc524c020a01bc524c030a01ae443e040a01ae443e050a01bc524c060a01bc524c070a01bc524c080a01bc524c090a01bc524c0a0a01c75f560b0a01c75f560c0a01bc524c0d0a01bc524c0e0a01bc524c0f0a01bc524c100a01bc524c110a01bc524c120a01bc524c130a01bc524c140a01ae443e150a01bc524c160a01bc524c170a01bc524c180a01bc524c190a01c75f561a0a01c75f561b0a01c75f561c0a01bc524c1d0a01bc524c1e0a01881c17000b01881c17010b01bc524c020b01c75f56030b01bc524c040b01bc524c050b01c75f56060b01c75f56070b01bc524c080b01bc524c090b01bc524c0a0b01bc524c0b0b01bc524c0c0b01bc524c0d0b01c75f560e0b01bc524c0f0b01bc524c100b01bc524c110b01c75f56120b01bc524c130b01bc524c140b01ae443e150b01c75f56160b01bc524c170b01bc524c180b01bc524c190b01bc524c1a0b01bc524c1b0b01bc524c1c0b01bc524c1d0b01bc524c1e0b01881c17000c01881c17010c01bc524c020c01c75f56030c01bc524c040c01bc524c050c01bc524c060c01bc524c070c01c75f56080c01c75f56090c01bc524c0a0c01ae443e0b0c01ae443e0c0c01bc524c0d0c01c75f560e0c01bc524c0f0c01c75f56100c01bc524c110c01bc524c120c01bc524c130c01bc524c140c01bc524c150c01bc524c160c01c75f56170c01c75f56180c01bc524c190c01ae443e1a0c01ae443e1b0c01bc524c1c0c01bc524c1d0c01bc524c1e0c01881c17000d01881c17010d01bc524c020d01bc524c030d01c75f56040d01c75f56050d01bc524c060d01c75f56070d01c75f56080d01c75f56090d01bc524c0a0d01ae443e0b0d01bc524c0c0d01c75f560d0d01c75f560e0d01bc524c0f0d01c75f56100d01bc524c110d01bc524c120d01c75f56130d01c75f56140d01bc524c150d01c75f56160d01c75f56170d01c75f56180d01bc524c190d01ae443e1a0d01bc524c1b0d01c75f561c0d01c75f561d0d01bc524c1e0d01881c17000e01881c17010e01bc524c020e01c75f56030e01c75f56040e01c75f56050e01bc524c060e01c75f56070e01c75f56080e01bc524c090e01bc524c0a0e01bc524c0b0e01bc524c0c0e01c75f560d0e01c75f560e0e01c75f560f0e01ae443e100e01bc524c110e01c75f56120e01c75f56130e01c75f56140e01bc524c150e01c75f56160e01c75f56170e01bc524c180e01bc524c190e01bc524c1a0e01bc524c1b0e01c75f561c0e01c75f561d0e01c75f561e0e01881c17000f01881c17010f01bc524c020f01c75f56030f01c75f56040f01bc524c050f01bc524c060f01bc524c070f01bc524c080f01bc524c090f01bc524c0a0f01bc524c0b0f01bc524c0c0f01bc524c0d0f01c75f560e0f01c75f560f0f01ae443e100f01ae443e110f01c75f56120f01c75f56130f01bc524c140f01bc524c150f01bc524c160f01bc524c170f01bc524c180f01bc524c190f01bc524c1a0f01bc524c1b0f01bc524c1c0f01c75f561d0f01c75f561e0f01881c17001001881c17011001bc524c021001c75f56031001c75f56041001bc524c051001ae443e061001bc524c071001c75f56081001c75f56091001c75f560a1001bc524c0b1001c75f560c1001c75f560d1001bc524c0e1001bc524c0f1001c75f56101001bc524c111001c75f56121001c75f56131001bc524c141001ae443e151001bc524c161001c75f56171001c75f56181001c75f56191001bc524c1a1001c75f561b1001c75f561c1001bc524c1d1001bc524c1e1001881c17001101881c17011101c75f56021101c75f56031101c75f56041101bc524c051101bc524c061101bc524c071101c75f56081101c75f56091101bc524c0a1101bc524c0b1101bc524c0c1101bc524c0d1101bc524c0e1101bc524c0f1101bc524c101101c75f56111101c75f56121101c75f56131101bc524c141101bc524c151101bc524c161101c75f56171101c75f56181101bc524c191101bc524c1a1101bc524c1b1101bc524c1c1101bc524c1d1101bc524c1e1101881c17001201881c17011201c75f56021201c75f56031201bc524c041201c75f56051201c75f56061201bc524c071201bc524c081201bc524c091201bc524c0a1201bc524c0b1201bc524c0c1201c75f560d1201c75f560e1201c75f560f1201bc524c101201c75f56111201c75f56121201bc524c131201c75f56141201c75f56151201bc524c161201bc524c171201bc524c181201bc524c191201bc524c1a1201bc524c1b1201c75f561c1201c75f561d1201c75f561e1201881c17001301881c17011301bc524c021301bc524c031301bc524c041301c75f56051301c75f56061301bc524c071301bc524c081301bc524c091301c75f560a1301c75f560b1301bc524c0c1301c75f560d1301c75f560e1301c75f560f1301bc524c101301bc524c111301bc524c121301bc524c131301c75f56141301c75f56151301bc524c161301bc524c171301bc524c181301c75f56191301c75f561a1301bc524c1b1301c75f561c1301c75f561d1301c75f561e1301881c17001401881c17011401c75f56021401bc524c031401bc524c041401bc524c051401bc524c061401bc524c071401bc524c081401c75f56091401c75f560a1401c75f560b1401bc524c0c1401bc524c0d1401c75f560e1401c75f560f1401bc524c101401c75f56111401bc524c121401bc524c131401bc524c141401bc524c151401bc524c161401bc524c171401c75f56181401c75f56191401c75f561a1401bc524c1b1401bc524c1c1401c75f561d1401c75f561e1401881c17001501881c17011501c75f56021501c75f56031501ae443e041501bc524c051501c75f56061501c75f56071501bc524c081501c75f56091501c75f560a1501bc524c0b1501bc524c0c1501bc524c0d1501ae443e0e1501ae443e0f1501c75f56101501c75f56111501c75f56121501ae443e131501bc524c141501c75f56151501c75f56161501bc524c171501c75f56181501c75f56191501bc524c1a1501bc524c1b1501bc524c1c1501ae443e1d1501ae443e1e1501881c17001601881c17011601c75f56021601bc524c031601ae443e041601ae443e051601c75f56061601c75f56071601bc524c081601bc524c091601ae443e0a1601bc524c0b1601bc524c0c1601bc524c0d1601bc524c0e1601ae443e0f1601c75f56101601c75f56111601bc524c121601ae443e131601ae443e141601c75f56151601c75f56161601bc524c171601bc524c181601ae443e191601bc524c1a1601bc524c1b1601bc524c1c1601bc524c1d1601ae443e1e1601881c17001701881c17011701881c17021701bc524c031701bc524c041701bc524c051701bc524c061701bc524c071701bc524c081701bc524c091701ae443e0a1701ae443e0b1701bc524c0c1701c75f560d1701c75f560e1701bc524c0f1701bc524c101701bc524c111701bc524c121701bc524c131701bc524c141701bc524c151701bc524c161701bc524c171701bc524c181701ae443e191701ae443e1a1701bc524c1b1701c75f561c1701c75f561d1701881c171e1701881c17021801881c17031801881c17041801bc524c051801bc524c061801c75f56071801c75f56081801bc524c091801c75f560a1801c75f560b1801bc524c0c1801c75f560d1801c75f560e1801c75f560f1801ae443e101801ae443e111801c75f56121801c75f56131801bc524c141801bc524c151801c75f56161801c75f56171801bc524c181801c75f56191801c75f561a1801bc524c1b1801881c171c1801881c17041901881c17051901881c17061901c75f56071901c75f56081901bc524c091901c75f560a1901c75f560b1901bc524c0c1901bc524c0d1901c75f560e1901c75f560f1901ae443e101901bc524c111901c75f56121901c75f56131901bc524c141901c75f56151901c75f56161901c75f56171901bc524c181901c75f56191901881c171a1901881c17061a01881c17071a01881c17081a01bc524c091a01bc524c0a1a01bc524c0b1a01bc524c0c1a01bc524c0d1a01bc524c0e1a01bc524c0f1a01bc524c101a01bc524c111a01bc524c121a01bc524c131a01bc524c141a01c75f56151a01c75f56161a01bc524c171a01881c17181a01881c17081b01881c17091b01881c170a1b01ae443e0b1b01ae443e0c1b01bc524c0d1b01bc524c0e1b01bc524c0f1b01c75f56101b01bc524c111b01bc524c121b01bc524c131b01bc524c141b01bc524c151b01881c17161b01881c170a1c01881c170b1c01881c170c1c01c75f560d1c01c75f560e1c01bc524c0f1c01c75f56101c01bc524c111c01bc524c121c01c75f56131c01881c17141c01881c170c1d01881c170d1d01881c170e1d01c75f560f1d01bc524c101d01bc524c111d01881c17121d01881c170e1e01881c170f1e01881c17101e01881c17");
    const Web$Kaelin$Assets$tile$effect$light_red2 = VoxBox$parse$("0e0001652b270f0001652b27100001652b270c0101652b270d0101652b270e010199615b0f010199615b100101a46e65110101652b27120101652b270a0201652b270b0201652b270c0201a46e650d0201a46e650e0201a46e650f020199615b100201a46e65110201a46e6512020199615b130201652b27140201652b27080301652b27090301652b270a0301a46e650b030199615b0c0301a46e650d0301a46e650e0301a46e650f030199615b10030199615b11030199615b12030199615b130301a46e65140301a46e65150301652b27160301652b27060401652b27070401652b27080401a46e65090401a46e650a0401a46e650b040199615b0c040199615b0d0401a46e650e0401a46e650f040199615b100401a46e6511040199615b12040199615b13040199615b14040199615b15040199615b16040199615b170401652b27180401652b27040501652b27050501652b27060501a46e6507050199615b080501a46e65090501a46e650a050199615b0b050199615b0c050199615b0d05018b534d0e05018b534d0f0501a46e65100501a46e65110501a46e651205018b534d13050199615b140501a46e65150501a46e6516050199615b170501a46e65180501a46e65190501652b271a0501652b27020601652b27030601652b270406018b534d050601a46e65060601a46e6507060199615b08060199615b0906018b534d0a060199615b0b060199615b0c060199615b0d060199615b0e06018b534d0f0601a46e65100601a46e6511060199615b1206018b534d1306018b534d140601a46e65150601a46e6516060199615b17060199615b1806018b534d19060199615b1a060199615b1b0601652b271c0601652b27000701652b27010701652b2702070199615b03070199615b04070199615b050701a46e65060701a46e65070701a46e6508070199615b0907018b534d0a07018b534d0b070199615b0c0701a46e650d0701a46e650e070199615b0f070199615b10070199615b11070199615b12070199615b13070199615b14070199615b15070199615b16070199615b17070199615b1807018b534d1907018b534d1a070199615b1b0701a46e651c0701a46e651d0701652b271e0701652b27000801652b2701080199615b020801a46e65030801a46e6504080199615b050801a46e65060801a46e65070801a46e6508080199615b090801a46e650a0801a46e650b080199615b0c080199615b0d0801a46e650e0801a46e650f08018b534d10080199615b110801a46e65120801a46e6513080199615b140801a46e65150801a46e65160801a46e6517080199615b18080199615b19080199615b1a080199615b1b080199615b1c0801a46e651d0801a46e651e0801652b27000901652b2701090199615b02090199615b030901a46e6504090199615b05090199615b060901a46e6507090199615b08090199615b090901a46e650a0901a46e650b090199615b0c090199615b0d0901a46e650e0901a46e650f090199615b10090199615b110901a46e65120901a46e6513090199615b14090199615b150901a46e65160901a46e6517090199615b18090199615b190901a46e651a0901a46e651b090199615b1c090199615b1d090199615b1e0901652b27000a01652b27010a0199615b020a0199615b030a018b534d040a018b534d050a0199615b060a0199615b070a0199615b080a0199615b090a0199615b0a0a01a46e650b0a01a46e650c0a0199615b0d0a0199615b0e0a0199615b0f0a0199615b100a0199615b110a0199615b120a0199615b130a0199615b140a018b534d150a0199615b160a0199615b170a0199615b180a0199615b190a01a46e651a0a01a46e651b0a01a46e651c0a0199615b1d0a0199615b1e0a01652b27000b01652b27010b0199615b020b01a46e65030b0199615b040b0199615b050b01a46e65060b01a46e65070b0199615b080b0199615b090b0199615b0a0b0199615b0b0b0199615b0c0b0199615b0d0b01a46e650e0b0199615b0f0b0199615b100b0199615b110b01a46e65120b0199615b130b0199615b140b018b534d150b01a46e65160b0199615b170b0199615b180b0199615b190b0199615b1a0b0199615b1b0b0199615b1c0b0199615b1d0b0199615b1e0b01652b27000c01652b27010c0199615b020c01a46e65030c0199615b040c0199615b050c0199615b060c0199615b070c01a46e65080c01a46e65090c0199615b0a0c018b534d0b0c018b534d0c0c0199615b0d0c01a46e650e0c0199615b0f0c01a46e65100c0199615b110c0199615b120c0199615b130c0199615b140c0199615b150c0199615b160c01a46e65170c01a46e65180c0199615b190c018b534d1a0c018b534d1b0c0199615b1c0c0199615b1d0c0199615b1e0c01652b27000d01652b27010d0199615b020d0199615b030d01a46e65040d01a46e65050d0199615b060d01a46e65070d01a46e65080d01a46e65090d0199615b0a0d018b534d0b0d0199615b0c0d01a46e650d0d01a46e650e0d0199615b0f0d01a46e65100d0199615b110d0199615b120d01a46e65130d01a46e65140d0199615b150d01a46e65160d01a46e65170d01a46e65180d0199615b190d018b534d1a0d0199615b1b0d01a46e651c0d01a46e651d0d0199615b1e0d01652b27000e01652b27010e0199615b020e01a46e65030e01a46e65040e01a46e65050e0199615b060e01a46e65070e01a46e65080e0199615b090e0199615b0a0e0199615b0b0e0199615b0c0e01a46e650d0e01a46e650e0e01a46e650f0e018b534d100e0199615b110e01a46e65120e01a46e65130e01a46e65140e0199615b150e01a46e65160e01a46e65170e0199615b180e0199615b190e0199615b1a0e0199615b1b0e01a46e651c0e01a46e651d0e01a46e651e0e01652b27000f01652b27010f0199615b020f01a46e65030f01a46e65040f0199615b050f0199615b060f0199615b070f0199615b080f0199615b090f0199615b0a0f0199615b0b0f0199615b0c0f0199615b0d0f01a46e650e0f01a46e650f0f018b534d100f018b534d110f01a46e65120f01a46e65130f0199615b140f0199615b150f0199615b160f0199615b170f0199615b180f0199615b190f0199615b1a0f0199615b1b0f0199615b1c0f01a46e651d0f01a46e651e0f01652b27001001652b2701100199615b021001a46e65031001a46e6504100199615b0510018b534d06100199615b071001a46e65081001a46e65091001a46e650a100199615b0b1001a46e650c1001a46e650d100199615b0e100199615b0f1001a46e6510100199615b111001a46e65121001a46e6513100199615b1410018b534d15100199615b161001a46e65171001a46e65181001a46e6519100199615b1a1001a46e651b1001a46e651c100199615b1d100199615b1e1001652b27001101652b27011101a46e65021101a46e65031101a46e6504110199615b05110199615b06110199615b071101a46e65081101a46e6509110199615b0a110199615b0b110199615b0c110199615b0d110199615b0e110199615b0f110199615b101101a46e65111101a46e65121101a46e6513110199615b14110199615b15110199615b161101a46e65171101a46e6518110199615b19110199615b1a110199615b1b110199615b1c110199615b1d110199615b1e1101652b27001201652b27011201a46e65021201a46e6503120199615b041201a46e65051201a46e6506120199615b07120199615b08120199615b09120199615b0a120199615b0b120199615b0c1201a46e650d1201a46e650e1201a46e650f120199615b101201a46e65111201a46e6512120199615b131201a46e65141201a46e6515120199615b16120199615b17120199615b18120199615b19120199615b1a120199615b1b1201a46e651c1201a46e651d1201a46e651e1201652b27001301652b2701130199615b02130199615b03130199615b041301a46e65051301a46e6506130199615b07130199615b08130199615b091301a46e650a1301a46e650b130199615b0c1301a46e650d1301a46e650e1301a46e650f130199615b10130199615b11130199615b12130199615b131301a46e65141301a46e6515130199615b16130199615b17130199615b181301a46e65191301a46e651a130199615b1b1301a46e651c1301a46e651d1301a46e651e1301652b27001401652b27011401a46e6502140199615b03140199615b04140199615b05140199615b06140199615b07140199615b081401a46e65091401a46e650a1401a46e650b140199615b0c140199615b0d1401a46e650e1401a46e650f140199615b101401a46e6511140199615b12140199615b13140199615b14140199615b15140199615b16140199615b171401a46e65181401a46e65191401a46e651a140199615b1b140199615b1c1401a46e651d1401a46e651e1401652b27001501652b27011501a46e65021501a46e650315018b534d04150199615b051501a46e65061501a46e6507150199615b081501a46e65091501a46e650a150199615b0b150199615b0c150199615b0d15018b534d0e15018b534d0f1501a46e65101501a46e65111501a46e651215018b534d13150199615b141501a46e65151501a46e6516150199615b171501a46e65181501a46e6519150199615b1a150199615b1b150199615b1c15018b534d1d15018b534d1e1501652b27001601652b27011601a46e6502160199615b0316018b534d0416018b534d051601a46e65061601a46e6507160199615b08160199615b0916018b534d0a160199615b0b160199615b0c160199615b0d160199615b0e16018b534d0f1601a46e65101601a46e6511160199615b1216018b534d1316018b534d141601a46e65151601a46e6516160199615b17160199615b1816018b534d19160199615b1a160199615b1b160199615b1c160199615b1d16018b534d1e1601652b27001701652b27011701652b2702170199615b03170199615b04170199615b05170199615b06170199615b07170199615b08170199615b0917018b534d0a17018b534d0b170199615b0c1701a46e650d1701a46e650e170199615b0f170199615b10170199615b11170199615b12170199615b13170199615b14170199615b15170199615b16170199615b17170199615b1817018b534d1917018b534d1a170199615b1b1701a46e651c1701a46e651d1701652b271e1701652b27021801652b27031801652b2704180199615b05180199615b061801a46e65071801a46e6508180199615b091801a46e650a1801a46e650b180199615b0c1801a46e650d1801a46e650e1801a46e650f18018b534d1018018b534d111801a46e65121801a46e6513180199615b14180199615b151801a46e65161801a46e6517180199615b181801a46e65191801a46e651a180199615b1b1801652b271c1801652b27041901652b27051901652b27061901a46e65071901a46e6508190199615b091901a46e650a1901a46e650b190199615b0c190199615b0d1901a46e650e1901a46e650f19018b534d10190199615b111901a46e65121901a46e6513190199615b141901a46e65151901a46e65161901a46e6517190199615b181901a46e65191901652b271a1901652b27061a01652b27071a01652b27081a0199615b091a0199615b0a1a0199615b0b1a0199615b0c1a0199615b0d1a0199615b0e1a0199615b0f1a0199615b101a0199615b111a0199615b121a0199615b131a0199615b141a01a46e65151a01a46e65161a0199615b171a01652b27181a01652b27081b01652b27091b01652b270a1b018b534d0b1b018b534d0c1b0199615b0d1b0199615b0e1b0199615b0f1b01a46e65101b0199615b111b0199615b121b0199615b131b0199615b141b0199615b151b01652b27161b01652b270a1c01652b270b1c01652b270c1c01a46e650d1c01a46e650e1c0199615b0f1c01a46e65101c0199615b111c0199615b121c01a46e65131c01652b27141c01652b270c1d01652b270d1d01652b270e1d01a46e650f1d0199615b101d0199615b111d01652b27121d01652b270e1e01652b270f1e01652b27101e01652b27");
    const Web$Kaelin$Assets$tile$effect$dark_blue2 = VoxBox$parse$("0e00011b3d920f00011b3d921000011b3d920c01011b3d920d01011b3d920e01014c74c50f01014c74c51001015783c51101011b3d921201011b3d920a02011b3d920b02011b3d920c02015783c50d02015783c50e02015783c50f02014c74c51002015783c51102015783c51202014c74c51302011b3d921402011b3d920803011b3d920903011b3d920a03015783c50b03014c74c50c03015783c50d03015783c50e03015783c50f03014c74c51003014c74c51103014c74c51203014c74c51303015783c51403015783c51503011b3d921603011b3d920604011b3d920704011b3d920804015783c50904015783c50a04015783c50b04014c74c50c04014c74c50d04015783c50e04015783c50f04014c74c51004015783c51104014c74c51204014c74c51304014c74c51404014c74c51504014c74c51604014c74c51704011b3d921804011b3d920405011b3d920505011b3d920605015783c50705014c74c50805015783c50905015783c50a05014c74c50b05014c74c50c05014c74c50d05013e66b80e05013e66b80f05015783c51005015783c51105015783c51205013e66b81305014c74c51405015783c51505015783c51605014c74c51705015783c51805015783c51905011b3d921a05011b3d920206011b3d920306011b3d920406013e66b80506015783c50606015783c50706014c74c50806014c74c50906013e66b80a06014c74c50b06014c74c50c06014c74c50d06014c74c50e06013e66b80f06015783c51006015783c51106014c74c51206013e66b81306013e66b81406015783c51506015783c51606014c74c51706014c74c51806013e66b81906014c74c51a06014c74c51b06011b3d921c06011b3d920007011b3d920107011b3d920207014c74c50307014c74c50407014c74c50507015783c50607015783c50707015783c50807014c74c50907013e66b80a07013e66b80b07014c74c50c07015783c50d07015783c50e07014c74c50f07014c74c51007014c74c51107014c74c51207014c74c51307014c74c51407014c74c51507014c74c51607014c74c51707014c74c51807013e66b81907013e66b81a07014c74c51b07015783c51c07015783c51d07011b3d921e07011b3d920008011b3d920108014c74c50208015783c50308015783c50408014c74c50508015783c50608015783c50708015783c50808014c74c50908015783c50a08015783c50b08014c74c50c08014c74c50d08015783c50e08015783c50f08013e66b81008014c74c51108015783c51208015783c51308014c74c51408015783c51508015783c51608015783c51708014c74c51808014c74c51908014c74c51a08014c74c51b08014c74c51c08015783c51d08015783c51e08011b3d920009011b3d920109014c74c50209014c74c50309015783c50409014c74c50509014c74c50609015783c50709014c74c50809014c74c50909015783c50a09015783c50b09014c74c50c09014c74c50d09015783c50e09015783c50f09014c74c51009014c74c51109015783c51209015783c51309014c74c51409014c74c51509015783c51609015783c51709014c74c51809014c74c51909015783c51a09015783c51b09014c74c51c09014c74c51d09014c74c51e09011b3d92000a011b3d92010a014c74c5020a014c74c5030a013e66b8040a013e66b8050a014c74c5060a014c74c5070a014c74c5080a014c74c5090a014c74c50a0a015783c50b0a015783c50c0a014c74c50d0a014c74c50e0a014c74c50f0a014c74c5100a014c74c5110a014c74c5120a014c74c5130a014c74c5140a013e66b8150a014c74c5160a014c74c5170a014c74c5180a014c74c5190a015783c51a0a015783c51b0a015783c51c0a014c74c51d0a014c74c51e0a011b3d92000b011b3d92010b014c74c5020b015783c5030b014c74c5040b014c74c5050b015783c5060b015783c5070b014c74c5080b014c74c5090b014c74c50a0b014c74c50b0b014c74c50c0b014c74c50d0b015783c50e0b014c74c50f0b014c74c5100b014c74c5110b015783c5120b014c74c5130b014c74c5140b013e66b8150b015783c5160b014c74c5170b014c74c5180b014c74c5190b014c74c51a0b014c74c51b0b014c74c51c0b014c74c51d0b014c74c51e0b011b3d92000c011b3d92010c014c74c5020c015783c5030c014c74c5040c014c74c5050c014c74c5060c014c74c5070c015783c5080c015783c5090c014c74c50a0c013e66b80b0c013e66b80c0c014c74c50d0c015783c50e0c014c74c50f0c015783c5100c014c74c5110c014c74c5120c014c74c5130c014c74c5140c014c74c5150c014c74c5160c015783c5170c015783c5180c014c74c5190c013e66b81a0c013e66b81b0c014c74c51c0c014c74c51d0c014c74c51e0c011b3d92000d011b3d92010d014c74c5020d014c74c5030d015783c5040d015783c5050d014c74c5060d015783c5070d015783c5080d015783c5090d014c74c50a0d013e66b80b0d014c74c50c0d015783c50d0d015783c50e0d014c74c50f0d015783c5100d014c74c5110d014c74c5120d015783c5130d015783c5140d014c74c5150d015783c5160d015783c5170d015783c5180d014c74c5190d013e66b81a0d014c74c51b0d015783c51c0d015783c51d0d014c74c51e0d011b3d92000e011b3d92010e014c74c5020e015783c5030e015783c5040e015783c5050e014c74c5060e015783c5070e015783c5080e014c74c5090e014c74c50a0e014c74c50b0e014c74c50c0e015783c50d0e015783c50e0e015783c50f0e013e66b8100e014c74c5110e015783c5120e015783c5130e015783c5140e014c74c5150e015783c5160e015783c5170e014c74c5180e014c74c5190e014c74c51a0e014c74c51b0e015783c51c0e015783c51d0e015783c51e0e011b3d92000f011b3d92010f014c74c5020f015783c5030f015783c5040f014c74c5050f014c74c5060f014c74c5070f014c74c5080f014c74c5090f014c74c50a0f014c74c50b0f014c74c50c0f014c74c50d0f015783c50e0f015783c50f0f013e66b8100f013e66b8110f015783c5120f015783c5130f014c74c5140f014c74c5150f014c74c5160f014c74c5170f014c74c5180f014c74c5190f014c74c51a0f014c74c51b0f014c74c51c0f015783c51d0f015783c51e0f011b3d920010011b3d920110014c74c50210015783c50310015783c50410014c74c50510013e66b80610014c74c50710015783c50810015783c50910015783c50a10014c74c50b10015783c50c10015783c50d10014c74c50e10014c74c50f10015783c51010014c74c51110015783c51210015783c51310014c74c51410013e66b81510014c74c51610015783c51710015783c51810015783c51910014c74c51a10015783c51b10015783c51c10014c74c51d10014c74c51e10011b3d920011011b3d920111015783c50211015783c50311015783c50411014c74c50511014c74c50611014c74c50711015783c50811015783c50911014c74c50a11014c74c50b11014c74c50c11014c74c50d11014c74c50e11014c74c50f11014c74c51011015783c51111015783c51211015783c51311014c74c51411014c74c51511014c74c51611015783c51711015783c51811014c74c51911014c74c51a11014c74c51b11014c74c51c11014c74c51d11014c74c51e11011b3d920012011b3d920112015783c50212015783c50312014c74c50412015783c50512015783c50612014c74c50712014c74c50812014c74c50912014c74c50a12014c74c50b12014c74c50c12015783c50d12015783c50e12015783c50f12014c74c51012015783c51112015783c51212014c74c51312015783c51412015783c51512014c74c51612014c74c51712014c74c51812014c74c51912014c74c51a12014c74c51b12015783c51c12015783c51d12015783c51e12011b3d920013011b3d920113014c74c50213014c74c50313014c74c50413015783c50513015783c50613014c74c50713014c74c50813014c74c50913015783c50a13015783c50b13014c74c50c13015783c50d13015783c50e13015783c50f13014c74c51013014c74c51113014c74c51213014c74c51313015783c51413015783c51513014c74c51613014c74c51713014c74c51813015783c51913015783c51a13014c74c51b13015783c51c13015783c51d13015783c51e13011b3d920014011b3d920114015783c50214014c74c50314014c74c50414014c74c50514014c74c50614014c74c50714014c74c50814015783c50914015783c50a14015783c50b14014c74c50c14014c74c50d14015783c50e14015783c50f14014c74c51014015783c51114014c74c51214014c74c51314014c74c51414014c74c51514014c74c51614014c74c51714015783c51814015783c51914015783c51a14014c74c51b14014c74c51c14015783c51d14015783c51e14011b3d920015011b3d920115015783c50215015783c50315013e66b80415014c74c50515015783c50615015783c50715014c74c50815015783c50915015783c50a15014c74c50b15014c74c50c15014c74c50d15013e66b80e15013e66b80f15015783c51015015783c51115015783c51215013e66b81315014c74c51415015783c51515015783c51615014c74c51715015783c51815015783c51915014c74c51a15014c74c51b15014c74c51c15013e66b81d15013e66b81e15011b3d920016011b3d920116015783c50216014c74c50316013e66b80416013e66b80516015783c50616015783c50716014c74c50816014c74c50916013e66b80a16014c74c50b16014c74c50c16014c74c50d16014c74c50e16013e66b80f16015783c51016015783c51116014c74c51216013e66b81316013e66b81416015783c51516015783c51616014c74c51716014c74c51816013e66b81916014c74c51a16014c74c51b16014c74c51c16014c74c51d16013e66b81e16011b3d920017011b3d920117011b3d920217014c74c50317014c74c50417014c74c50517014c74c50617014c74c50717014c74c50817014c74c50917013e66b80a17013e66b80b17014c74c50c17015783c50d17015783c50e17014c74c50f17014c74c51017014c74c51117014c74c51217014c74c51317014c74c51417014c74c51517014c74c51617014c74c51717014c74c51817013e66b81917013e66b81a17014c74c51b17015783c51c17015783c51d17011b3d921e17011b3d920218011b3d920318011b3d920418014c74c50518014c74c50618015783c50718015783c50818014c74c50918015783c50a18015783c50b18014c74c50c18015783c50d18015783c50e18015783c50f18013e66b81018013e66b81118015783c51218015783c51318014c74c51418014c74c51518015783c51618015783c51718014c74c51818015783c51918015783c51a18014c74c51b18011b3d921c18011b3d920419011b3d920519011b3d920619015783c50719015783c50819014c74c50919015783c50a19015783c50b19014c74c50c19014c74c50d19015783c50e19015783c50f19013e66b81019014c74c51119015783c51219015783c51319014c74c51419015783c51519015783c51619015783c51719014c74c51819015783c51919011b3d921a19011b3d92061a011b3d92071a011b3d92081a014c74c5091a014c74c50a1a014c74c50b1a014c74c50c1a014c74c50d1a014c74c50e1a014c74c50f1a014c74c5101a014c74c5111a014c74c5121a014c74c5131a014c74c5141a015783c5151a015783c5161a014c74c5171a011b3d92181a011b3d92081b011b3d92091b011b3d920a1b013e66b80b1b013e66b80c1b014c74c50d1b014c74c50e1b014c74c50f1b015783c5101b014c74c5111b014c74c5121b014c74c5131b014c74c5141b014c74c5151b011b3d92161b011b3d920a1c011b3d920b1c011b3d920c1c015783c50d1c015783c50e1c014c74c50f1c015783c5101c014c74c5111c014c74c5121c015783c5131c011b3d92141c011b3d920c1d011b3d920d1d011b3d920e1d015783c50f1d014c74c5101d014c74c5111d011b3d92121d011b3d920e1e011b3d920f1e011b3d92101e011b3d92");

    function Web$Kaelin$Resources$terrains$(_indicator$1) {
        var self = _indicator$1;
        switch (self._) {
            case 'Web.Kaelin.Indicator.green':
                var $723 = Web$Kaelin$Assets$tile$green_2;
                var $722 = $723;
                break;
            case 'Web.Kaelin.Indicator.red':
                var $724 = Web$Kaelin$Assets$tile$effect$dark_red2;
                var $722 = $724;
                break;
            case 'Web.Kaelin.Indicator.yellow':
                var $725 = Web$Kaelin$Assets$tile$effect$light_red2;
                var $722 = $725;
                break;
            case 'Web.Kaelin.Indicator.blue':
                var $726 = Web$Kaelin$Assets$tile$effect$dark_blue2;
                var $722 = $726;
                break;
        };
        return $722;
    };
    const Web$Kaelin$Resources$terrains = x0 => Web$Kaelin$Resources$terrains$(x0);

    function Web$Kaelin$Terrain$new$(_draw$1) {
        var $727 = ({
            _: 'Web.Kaelin.Terrain.new',
            'draw': _draw$1
        });
        return $727;
    };
    const Web$Kaelin$Terrain$new = x0 => Web$Kaelin$Terrain$new$(x0);

    function Web$Kaelin$Map$Entity$background$(_value$1) {
        var $728 = ({
            _: 'Web.Kaelin.Map.Entity.background',
            'value': _value$1
        });
        return $728;
    };
    const Web$Kaelin$Map$Entity$background = x0 => Web$Kaelin$Map$Entity$background$(x0);
    const Web$Kaelin$Map$arena = (() => {
        var _map$1 = NatMap$new;
        var _map_size$2 = Web$Kaelin$Constants$map_size;
        var _width$3 = ((((_map_size$2 * 2) >>> 0) + 1) >>> 0);
        var _height$4 = ((((_map_size$2 * 2) >>> 0) + 1) >>> 0);
        var _terrain_img$5 = Web$Kaelin$Resources$terrains;
        var _new_terrain$6 = Web$Kaelin$Terrain$new$(_terrain_img$5);
        var _new_terrain$7 = Web$Kaelin$Map$Entity$background$(_new_terrain$6);
        var _map$8 = (() => {
            var $730 = _map$1;
            var $731 = 0;
            var $732 = _height$4;
            let _map$9 = $730;
            for (let _j$8 = $731; _j$8 < $732; ++_j$8) {
                var _map$10 = (() => {
                    var $733 = _map$9;
                    var $734 = 0;
                    var $735 = _width$3;
                    let _map$11 = $733;
                    for (let _i$10 = $734; _i$10 < $735; ++_i$10) {
                        var _coord_i$12 = ((U32$to_i32$(_i$10) - U32$to_i32$(_map_size$2)) >> 0);
                        var _coord_j$13 = ((U32$to_i32$(_j$8) - U32$to_i32$(_map_size$2)) >> 0);
                        var _coord$14 = Web$Kaelin$Coord$new$(_coord_i$12, _coord_j$13);
                        var _fit$15 = Web$Kaelin$Coord$fit$(_coord$14, _map_size$2);
                        var self = _fit$15;
                        if (self) {
                            var $736 = Web$Kaelin$Map$push$(_coord$14, _new_terrain$7, _map$11);
                            var $733 = $736;
                        } else {
                            var $737 = _map$11;
                            var $733 = $737;
                        };
                        _map$11 = $733;
                    };
                    return _map$11;
                })();
                var $730 = _map$10;
                _map$9 = $730;
            };
            return _map$9;
        })();
        var $729 = _map$8;
        return $729;
    })();

    function App$EnvInfo$new$(_screen_size$1, _mouse_pos$2) {
        var $738 = ({
            _: 'App.EnvInfo.new',
            'screen_size': _screen_size$1,
            'mouse_pos': _mouse_pos$2
        });
        return $738;
    };
    const App$EnvInfo$new = x0 => x1 => App$EnvInfo$new$(x0, x1);

    function Web$Kaelin$State$game$(_user$1, _room$2, _cast_info$3, _map$4, _internal$5, _env_info$6) {
        var $739 = ({
            _: 'Web.Kaelin.State.game',
            'user': _user$1,
            'room': _room$2,
            'cast_info': _cast_info$3,
            'map': _map$4,
            'internal': _internal$5,
            'env_info': _env_info$6
        });
        return $739;
    };
    const Web$Kaelin$State$game = x0 => x1 => x2 => x3 => x4 => x5 => Web$Kaelin$State$game$(x0, x1, x2, x3, x4, x5);

    function Web$Kaelin$Internal$new$(_tick$1, _frame$2, _timer$3) {
        var $740 = ({
            _: 'Web.Kaelin.Internal.new',
            'tick': _tick$1,
            'frame': _frame$2,
            'timer': _timer$3
        });
        return $740;
    };
    const Web$Kaelin$Internal$new = x0 => x1 => x2 => Web$Kaelin$Internal$new$(x0, x1, x2);
    const Web$Kaelin$App$init = (() => {
        var _user$1 = "";
        var _room$2 = Web$Kaelin$Constants$room;
        var _tick$3 = 0n;
        var _frame$4 = 0n;
        var _cast_info$5 = Maybe$none;
        var _map$6 = Web$Kaelin$Map$init$(Web$Kaelin$Map$arena);
        var _interface$7 = App$EnvInfo$new$(Pair$new$(256, 256), Pair$new$(0, 0));
        var $741 = Web$Kaelin$State$game$(_user$1, _room$2, _cast_info$5, _map$6, Web$Kaelin$Internal$new$(_tick$3, _frame$4, List$nil), _interface$7);
        return $741;
    })();

    function DOM$text$(_value$1) {
        var $742 = ({
            _: 'DOM.text',
            'value': _value$1
        });
        return $742;
    };
    const DOM$text = x0 => DOM$text$(x0);

    function DOM$vbox$(_props$1, _style$2, _value$3) {
        var $743 = ({
            _: 'DOM.vbox',
            'props': _props$1,
            'style': _style$2,
            'value': _value$3
        });
        return $743;
    };
    const DOM$vbox = x0 => x1 => x2 => DOM$vbox$(x0, x1, x2);

    function Map$(_V$1) {
        var $744 = null;
        return $744;
    };
    const Map = x0 => Map$(x0);
    const Bits$concat = a0 => a1 => (a1 + a0);

    function Word$to_bits$(_a$2) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $746 = self.pred;
                var $747 = (Word$to_bits$($746) + '0');
                var $745 = $747;
                break;
            case 'Word.i':
                var $748 = self.pred;
                var $749 = (Word$to_bits$($748) + '1');
                var $745 = $749;
                break;
            case 'Word.e':
                var $750 = Bits$e;
                var $745 = $750;
                break;
        };
        return $745;
    };
    const Word$to_bits = x0 => Word$to_bits$(x0);
    const U16$to_bits = a0 => (u16_to_bits(a0));

    function String$to_bits$(_str$1) {
        var self = _str$1;
        if (self.length === 0) {
            var $752 = Bits$e;
            var $751 = $752;
        } else {
            var $753 = self.charCodeAt(0);
            var $754 = self.slice(1);
            var $755 = (String$to_bits$($754) + (u16_to_bits($753)));
            var $751 = $755;
        };
        return $751;
    };
    const String$to_bits = x0 => String$to_bits$(x0);

    function Map$from_list$(_xs$2) {
        var self = _xs$2;
        switch (self._) {
            case 'List.cons':
                var $757 = self.head;
                var $758 = self.tail;
                var self = $757;
                switch (self._) {
                    case 'Pair.new':
                        var $760 = self.fst;
                        var $761 = self.snd;
                        var $762 = (bitsmap_set(String$to_bits$($760), $761, Map$from_list$($758), 'set'));
                        var $759 = $762;
                        break;
                };
                var $756 = $759;
                break;
            case 'List.nil':
                var $763 = BitsMap$new;
                var $756 = $763;
                break;
        };
        return $756;
    };
    const Map$from_list = x0 => Map$from_list$(x0);

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
                        var $764 = self.head;
                        var $765 = self.tail;
                        var $766 = List$reverse$go$($765, List$cons$($764, _res$3));
                        return $766;
                    case 'List.nil':
                        var $767 = _res$3;
                        return $767;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const List$reverse$go = x0 => x1 => List$reverse$go$(x0, x1);

    function List$reverse$(_xs$2) {
        var $768 = List$reverse$go$(_xs$2, List$nil);
        return $768;
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
                        var $769 = self.slice(0, -1);
                        var $770 = Bits$reverse$tco$($769, (_r$2 + '0'));
                        return $770;
                    case 'i':
                        var $771 = self.slice(0, -1);
                        var $772 = Bits$reverse$tco$($771, (_r$2 + '1'));
                        return $772;
                    case 'e':
                        var $773 = _r$2;
                        return $773;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Bits$reverse$tco = x0 => x1 => Bits$reverse$tco$(x0, x1);

    function Bits$reverse$(_a$1) {
        var $774 = Bits$reverse$tco$(_a$1, Bits$e);
        return $774;
    };
    const Bits$reverse = x0 => Bits$reverse$(x0);

    function BitsMap$to_list$go$(_xs$2, _key$3, _list$4) {
        var self = _xs$2;
        switch (self._) {
            case 'BitsMap.tie':
                var $776 = self.val;
                var $777 = self.lft;
                var $778 = self.rgt;
                var self = $776;
                switch (self._) {
                    case 'Maybe.some':
                        var $780 = self.value;
                        var $781 = List$cons$(Pair$new$(Bits$reverse$(_key$3), $780), _list$4);
                        var _list0$8 = $781;
                        break;
                    case 'Maybe.none':
                        var $782 = _list$4;
                        var _list0$8 = $782;
                        break;
                };
                var _list1$9 = BitsMap$to_list$go$($777, (_key$3 + '0'), _list0$8);
                var _list2$10 = BitsMap$to_list$go$($778, (_key$3 + '1'), _list1$9);
                var $779 = _list2$10;
                var $775 = $779;
                break;
            case 'BitsMap.new':
                var $783 = _list$4;
                var $775 = $783;
                break;
        };
        return $775;
    };
    const BitsMap$to_list$go = x0 => x1 => x2 => BitsMap$to_list$go$(x0, x1, x2);

    function List$mapped$(_as$2, _f$4) {
        var self = _as$2;
        switch (self._) {
            case 'List.cons':
                var $785 = self.head;
                var $786 = self.tail;
                var $787 = List$cons$(_f$4($785), List$mapped$($786, _f$4));
                var $784 = $787;
                break;
            case 'List.nil':
                var $788 = List$nil;
                var $784 = $788;
                break;
        };
        return $784;
    };
    const List$mapped = x0 => x1 => List$mapped$(x0, x1);

    function Bits$to_nat$(_b$1) {
        var self = _b$1;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'o':
                var $790 = self.slice(0, -1);
                var $791 = (2n * Bits$to_nat$($790));
                var $789 = $791;
                break;
            case 'i':
                var $792 = self.slice(0, -1);
                var $793 = Nat$succ$((2n * Bits$to_nat$($792)));
                var $789 = $793;
                break;
            case 'e':
                var $794 = 0n;
                var $789 = $794;
                break;
        };
        return $789;
    };
    const Bits$to_nat = x0 => Bits$to_nat$(x0);

    function NatMap$to_list$(_xs$2) {
        var _kvs$3 = List$reverse$(BitsMap$to_list$go$(_xs$2, Bits$e, List$nil));
        var $795 = List$mapped$(_kvs$3, (_kv$4 => {
            var self = _kv$4;
            switch (self._) {
                case 'Pair.new':
                    var $797 = self.fst;
                    var $798 = self.snd;
                    var $799 = Pair$new$(Bits$to_nat$($797), $798);
                    var $796 = $799;
                    break;
            };
            return $796;
        }));
        return $795;
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
        var $800 = (((_n$1 >> 0)));
        return $800;
    };
    const Web$Kaelin$Coord$round$floor = x0 => Web$Kaelin$Coord$round$floor$(x0);

    function Web$Kaelin$Coord$round$round_F64$(_n$1) {
        var _half$2 = (+0.5);
        var _big_number$3 = (+1000.0);
        var _n$4 = (_n$1 + _big_number$3);
        var _result$5 = Web$Kaelin$Coord$round$floor$((_n$4 + _half$2));
        var $801 = (_result$5 - _big_number$3);
        return $801;
    };
    const Web$Kaelin$Coord$round$round_F64 = x0 => Web$Kaelin$Coord$round$round_F64$(x0);

    function Word$gtn$(_a$2, _b$3) {
        var $802 = Cmp$as_gtn$(Word$cmp$(_a$2, _b$3));
        return $802;
    };
    const Word$gtn = x0 => x1 => Word$gtn$(x0, x1);

    function F64$gtn$(_a$1, _b$2) {
        var self = _a$1;
        switch ('f64') {
            case 'f64':
                var $804 = f64_to_word(self);
                var self = _b$2;
                switch ('f64') {
                    case 'f64':
                        var $806 = f64_to_word(self);
                        var $807 = Word$gtn$($804, $806);
                        var $805 = $807;
                        break;
                };
                var $803 = $805;
                break;
        };
        return $803;
    };
    const F64$gtn = x0 => x1 => F64$gtn$(x0, x1);

    function Web$Kaelin$Coord$round$diff$(_x$1, _y$2) {
        var _big_number$3 = (+1000.0);
        var _x$4 = (_x$1 + _big_number$3);
        var _y$5 = (_y$2 + _big_number$3);
        var self = F64$gtn$(_x$4, _y$5);
        if (self) {
            var $809 = (_x$4 - _y$5);
            var $808 = $809;
        } else {
            var $810 = (_y$5 - _x$4);
            var $808 = $810;
        };
        return $808;
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
                var $813 = Pair$new$(_i$4(_round_x$6), _i$4(_new_y$12));
                var $812 = $813;
            } else {
                var _new_x$12 = ((_f$3(0) - _round_y$7) - _round_z$8);
                var $814 = Pair$new$(_i$4(_new_x$12), _i$4(_round_y$7));
                var $812 = $814;
            };
            var _result$12 = $812;
        } else {
            var self = F64$gtn$(_diff_y$10, _diff_z$11);
            if (self) {
                var _new_y$12 = ((_f$3(0) - _round_x$6) - _round_z$8);
                var $816 = Pair$new$(_i$4(_round_x$6), _i$4(_new_y$12));
                var $815 = $816;
            } else {
                var $817 = Pair$new$(_i$4(_round_x$6), _i$4(_round_y$7));
                var $815 = $817;
            };
            var _result$12 = $815;
        };
        var $811 = _result$12;
        return $811;
    };
    const Web$Kaelin$Coord$round = x0 => x1 => Web$Kaelin$Coord$round$(x0, x1);

    function Web$Kaelin$Coord$to_axial$(_coord$1) {
        var self = _coord$1;
        switch (self._) {
            case 'Pair.new':
                var $819 = self.fst;
                var $820 = self.snd;
                var _f$4 = U32$to_f64;
                var _i$5 = F64$to_i32;
                var _float_hex_rad$6 = (_f$4(Web$Kaelin$Constants$hexagon_radius) / (+2.0));
                var _center_x$7 = Web$Kaelin$Constants$center_x;
                var _center_y$8 = Web$Kaelin$Constants$center_y;
                var _float_x$9 = ((_f$4($819) - _f$4(_center_x$7)) / _float_hex_rad$6);
                var _float_y$10 = ((_f$4($820) - _f$4(_center_y$8)) / _float_hex_rad$6);
                var _fourth$11 = (+0.25);
                var _sixth$12 = ((+1.0) / (+6.0));
                var _third$13 = ((+1.0) / (+3.0));
                var _half$14 = (+0.5);
                var _axial_x$15 = ((_float_x$9 * _fourth$11) - (_float_y$10 * _sixth$12));
                var _axial_y$16 = (_float_y$10 * _third$13);
                var self = Web$Kaelin$Coord$round$(_axial_x$15, _axial_y$16);
                switch (self._) {
                    case 'Pair.new':
                        var $822 = self.fst;
                        var $823 = self.snd;
                        var $824 = Web$Kaelin$Coord$new$($822, $823);
                        var $821 = $824;
                        break;
                };
                var $818 = $821;
                break;
        };
        return $818;
    };
    const Web$Kaelin$Coord$to_axial = x0 => Web$Kaelin$Coord$to_axial$(x0);

    function Word$mod$(_a$2, _b$3) {
        var _q$4 = Word$div$(_a$2, _b$3);
        var $825 = Word$sub$(_a$2, Word$mul$(_b$3, _q$4));
        return $825;
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
        var $826 = Web$Kaelin$Coord$new$(_coord_i$5, _coord_j$8);
        return $826;
    };
    const Web$Kaelin$Coord$Convert$nat_to_axial = x0 => Web$Kaelin$Coord$Convert$nat_to_axial$(x0);

    function NatSet$has$(_nat$1, _set$2) {
        var self = NatMap$get$(_nat$1, _set$2);
        switch (self._) {
            case 'Maybe.none':
                var $828 = Bool$false;
                var $827 = $828;
                break;
            case 'Maybe.some':
                var $829 = Bool$true;
                var $827 = $829;
                break;
        };
        return $827;
    };
    const NatSet$has = x0 => x1 => NatSet$has$(x0, x1);
    const Web$Kaelin$Indicator$blue = ({
        _: 'Web.Kaelin.Indicator.blue'
    });

    function Web$Kaelin$Draw$support$get_effect$(_coord$1, _coord_nat$2, _cast_info$3) {
        var self = _cast_info$3;
        switch (self._) {
            case 'Maybe.some':
                var $831 = self.value;
                var self = $831;
                switch (self._) {
                    case 'Web.Kaelin.CastInfo.new':
                        var $833 = self.range;
                        var _is_in_range$10 = NatSet$has$(_coord_nat$2, $833);
                        var self = _is_in_range$10;
                        if (self) {
                            var $835 = Maybe$some$(Web$Kaelin$Indicator$blue);
                            var $834 = $835;
                        } else {
                            var $836 = Maybe$none;
                            var $834 = $836;
                        };
                        var $832 = $834;
                        break;
                };
                var $830 = $832;
                break;
            case 'Maybe.none':
                var $837 = Maybe$none;
                var $830 = $837;
                break;
        };
        return $830;
    };
    const Web$Kaelin$Draw$support$get_effect = x0 => x1 => x2 => Web$Kaelin$Draw$support$get_effect$(x0, x1, x2);

    function Web$Kaelin$Draw$support$area_of_effect$(_coord$1, _coord_nat$2, _cast_info$3) {
        var self = _cast_info$3;
        switch (self._) {
            case 'Maybe.some':
                var $839 = self.value;
                var self = $839;
                switch (self._) {
                    case 'Web.Kaelin.CastInfo.new':
                        var $841 = self.range;
                        var $842 = self.area;
                        var $843 = self.mouse_pos;
                        var _mouse_pos$10 = Web$Kaelin$Coord$Convert$axial_to_nat$($843);
                        var self = NatSet$has$(_mouse_pos$10, $841);
                        if (self) {
                            var $845 = NatMap$get$(_coord_nat$2, $842);
                            var $844 = $845;
                        } else {
                            var $846 = Maybe$none;
                            var $844 = $846;
                        };
                        var $840 = $844;
                        break;
                };
                var $838 = $840;
                break;
            case 'Maybe.none':
                var $847 = Maybe$none;
                var $838 = $847;
                break;
        };
        return $838;
    };
    const Web$Kaelin$Draw$support$area_of_effect = x0 => x1 => x2 => Web$Kaelin$Draw$support$area_of_effect$(x0, x1, x2);

    function Web$Kaelin$Draw$support$get_indicator$(_coord$1, _cast_info$2) {
        var _coord_nat$3 = Web$Kaelin$Coord$Convert$axial_to_nat$(_coord$1);
        var self = _cast_info$2;
        switch (self._) {
            case 'Maybe.none':
                var $849 = Web$Kaelin$Indicator$green;
                var $848 = $849;
                break;
            case 'Maybe.some':
                var _range$5 = Web$Kaelin$Draw$support$get_effect$(_coord$1, _coord_nat$3, _cast_info$2);
                var _area$6 = Web$Kaelin$Draw$support$area_of_effect$(_coord$1, _coord_nat$3, _cast_info$2);
                var self = _area$6;
                switch (self._) {
                    case 'Maybe.some':
                        var $851 = self.value;
                        var $852 = $851;
                        var $850 = $852;
                        break;
                    case 'Maybe.none':
                        var self = _range$5;
                        switch (self._) {
                            case 'Maybe.some':
                                var $854 = self.value;
                                var $855 = $854;
                                var $853 = $855;
                                break;
                            case 'Maybe.none':
                                var $856 = Web$Kaelin$Indicator$green;
                                var $853 = $856;
                                break;
                        };
                        var $850 = $853;
                        break;
                };
                var $848 = $850;
                break;
        };
        return $848;
    };
    const Web$Kaelin$Draw$support$get_indicator = x0 => x1 => Web$Kaelin$Draw$support$get_indicator$(x0, x1);

    function Web$Kaelin$Coord$to_screen_xy$(_coord$1) {
        var self = _coord$1;
        switch (self._) {
            case 'Web.Kaelin.Coord.new':
                var $858 = self.i;
                var $859 = self.j;
                var _i$4 = $858;
                var _j$5 = $859;
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
                var $860 = Pair$new$(_cx$15, _cy$17);
                var $857 = $860;
                break;
        };
        return $857;
    };
    const Web$Kaelin$Coord$to_screen_xy = x0 => Web$Kaelin$Coord$to_screen_xy$(x0);
    const U32$sub = a0 => a1 => ((a0 - a1) >>> 0);

    function Web$Kaelin$Draw$support$centralize$(_coord$1) {
        var self = Web$Kaelin$Coord$to_screen_xy$(_coord$1);
        switch (self._) {
            case 'Pair.new':
                var $862 = self.fst;
                var $863 = self.snd;
                var _i$4 = (($862 - Web$Kaelin$Constants$hexagon_radius) >>> 0);
                var _j$5 = (($863 - Web$Kaelin$Constants$hexagon_radius) >>> 0);
                var $864 = Pair$new$(_i$4, _j$5);
                var $861 = $864;
                break;
        };
        return $861;
    };
    const Web$Kaelin$Draw$support$centralize = x0 => Web$Kaelin$Draw$support$centralize$(x0);

    function VoxBox$get_len$(_img$1) {
        var self = _img$1;
        switch (self._) {
            case 'VoxBox.new':
                var $866 = self.length;
                var $867 = $866;
                var $865 = $867;
                break;
        };
        return $865;
    };
    const VoxBox$get_len = x0 => VoxBox$get_len$(x0);

    function Array$get$(_idx$3, _arr$4) {
        var $868 = Word$foldl$(Array$extract_tip, (_rec$6 => _arr$7 => {
            var _arr_l$8 = Array$extract_tie$(_arr$7);
            var self = _arr_l$8;
            switch (self._) {
                case 'Pair.new':
                    var $870 = self.fst;
                    var $871 = _rec$6($870);
                    var $869 = $871;
                    break;
            };
            return $869;
        }), (_rec$6 => _arr$7 => {
            var _arr_r$8 = Array$extract_tie$(_arr$7);
            var self = _arr_r$8;
            switch (self._) {
                case 'Pair.new':
                    var $873 = self.snd;
                    var $874 = _rec$6($873);
                    var $872 = $874;
                    break;
            };
            return $872;
        }), _idx$3)(_arr$4);
        return $868;
    };
    const Array$get = x0 => x1 => Array$get$(x0, x1);
    const Buffer32$get = a0 => a1 => ((a1[a0]));
    const VoxBox$get_pos = a0 => a1 => ((a1.buffer[a0 * 2]));
    const VoxBox$get_col = a0 => a1 => ((a1.buffer[a0 * 2 + 1]));

    function Word$and$(_a$2, _b$3) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $876 = self.pred;
                var $877 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $879 = self.pred;
                            var $880 = (_a$pred$9 => {
                                var $881 = Word$o$(Word$and$(_a$pred$9, $879));
                                return $881;
                            });
                            var $878 = $880;
                            break;
                        case 'Word.i':
                            var $882 = self.pred;
                            var $883 = (_a$pred$9 => {
                                var $884 = Word$o$(Word$and$(_a$pred$9, $882));
                                return $884;
                            });
                            var $878 = $883;
                            break;
                        case 'Word.e':
                            var $885 = (_a$pred$7 => {
                                var $886 = Word$e;
                                return $886;
                            });
                            var $878 = $885;
                            break;
                    };
                    var $878 = $878($876);
                    return $878;
                });
                var $875 = $877;
                break;
            case 'Word.i':
                var $887 = self.pred;
                var $888 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $890 = self.pred;
                            var $891 = (_a$pred$9 => {
                                var $892 = Word$o$(Word$and$(_a$pred$9, $890));
                                return $892;
                            });
                            var $889 = $891;
                            break;
                        case 'Word.i':
                            var $893 = self.pred;
                            var $894 = (_a$pred$9 => {
                                var $895 = Word$i$(Word$and$(_a$pred$9, $893));
                                return $895;
                            });
                            var $889 = $894;
                            break;
                        case 'Word.e':
                            var $896 = (_a$pred$7 => {
                                var $897 = Word$e;
                                return $897;
                            });
                            var $889 = $896;
                            break;
                    };
                    var $889 = $889($887);
                    return $889;
                });
                var $875 = $888;
                break;
            case 'Word.e':
                var $898 = (_b$4 => {
                    var $899 = Word$e;
                    return $899;
                });
                var $875 = $898;
                break;
        };
        var $875 = $875(_b$3);
        return $875;
    };
    const Word$and = x0 => x1 => Word$and$(x0, x1);
    const U32$and = a0 => a1 => (a0 & a1);
    const U32$shr = a0 => a1 => (a0 >>> a1);

    function VoxBox$Draw$image$(_x$1, _y$2, _z$3, _src$4, _img$5) {
        var _len$6 = VoxBox$get_len$(_src$4);
        var _img$7 = (() => {
            var $901 = _img$5;
            var $902 = 0;
            var $903 = _len$6;
            let _img$8 = $901;
            for (let _i$7 = $902; _i$7 < $903; ++_i$7) {
                var _pos$9 = ((_src$4.buffer[_i$7 * 2]));
                var _col$10 = ((_src$4.buffer[_i$7 * 2 + 1]));
                var _p_x$11 = (_pos$9 & 4095);
                var _p_y$12 = ((_pos$9 & 16773120) >>> 12);
                var _p_z$13 = ((_pos$9 & 4278190080) >>> 24);
                var _p_x$14 = ((_p_x$11 + _x$1) >>> 0);
                var _p_y$15 = ((_p_y$12 + _y$2) >>> 0);
                var _p_z$16 = ((_p_z$13 + _z$3) >>> 0);
                var _pos$17 = ((0 | _p_x$14 | (_p_y$15 << 12) | (_p_z$16 << 24)));
                var $901 = ((_img$8.buffer[_img$8.length * 2] = _pos$17, _img$8.buffer[_img$8.length * 2 + 1] = _col$10, _img$8.length++, _img$8));
                _img$8 = $901;
            };
            return _img$8;
        })();
        var $900 = _img$7;
        return $900;
    };
    const VoxBox$Draw$image = x0 => x1 => x2 => x3 => x4 => VoxBox$Draw$image$(x0, x1, x2, x3, x4);

    function Web$Kaelin$Draw$tile$background$(_terrain$1, _cast_info$2, _coord$3, _mouse_coord$4, _img$5) {
        var _coord_nat$6 = Web$Kaelin$Coord$Convert$axial_to_nat$(_coord$3);
        var _sprite$7 = Web$Kaelin$Draw$support$get_indicator$(_coord$3, _cast_info$2);
        var self = Web$Kaelin$Draw$support$centralize$(_coord$3);
        switch (self._) {
            case 'Pair.new':
                var $905 = self.fst;
                var $906 = self.snd;
                var $907 = VoxBox$Draw$image$($905, $906, 0, (() => {
                    var self = _terrain$1;
                    switch (self._) {
                        case 'Web.Kaelin.Terrain.new':
                            var $908 = self.draw;
                            var $909 = $908;
                            return $909;
                    };
                })()(_sprite$7), _img$5);
                var $904 = $907;
                break;
        };
        return $904;
    };
    const Web$Kaelin$Draw$tile$background = x0 => x1 => x2 => x3 => x4 => Web$Kaelin$Draw$tile$background$(x0, x1, x2, x3, x4);

    function Web$Kaelin$Draw$hero$(_cx$1, _cy$2, _z$3, _hero$4, _img$5) {
        var self = _hero$4;
        switch (self._) {
            case 'Web.Kaelin.Hero.new':
                var $911 = self.img;
                var _aux_y$10 = ((Web$Kaelin$Constants$hexagon_radius * 2) >>> 0);
                var _cy$11 = ((_cy$2 - _aux_y$10) >>> 0);
                var _cx$12 = ((_cx$1 - Web$Kaelin$Constants$hexagon_radius) >>> 0);
                var $912 = VoxBox$Draw$image$(_cx$12, _cy$11, 0, $911, _img$5);
                var $910 = $912;
                break;
        };
        return $910;
    };
    const Web$Kaelin$Draw$hero = x0 => x1 => x2 => x3 => x4 => Web$Kaelin$Draw$hero$(x0, x1, x2, x3, x4);
    const Nat$gtn = a0 => a1 => (a0 > a1);

    function Int$is_neg$(_a$1) {
        var self = _a$1;
        switch ("new") {
            case 'new':
                var $914 = int_pos(self);
                var $915 = int_neg(self);
                var $916 = ($915 > $914);
                var $913 = $916;
                break;
        };
        return $913;
    };
    const Int$is_neg = x0 => Int$is_neg$(x0);

    function Int$neg$(_a$1) {
        var self = _a$1;
        switch ("new") {
            case 'new':
                var $918 = int_pos(self);
                var $919 = int_neg(self);
                var $920 = ($919 - $918);
                var $917 = $920;
                break;
        };
        return $917;
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
                    var $923 = int_pos(self);
                    var $924 = $923;
                    var $922 = $924;
                    break;
            };
            var $921 = $922;
        } else {
            var self = _a$1;
            switch ("new") {
                case 'new':
                    var $926 = int_pos(self);
                    var $927 = $926;
                    var $925 = $927;
                    break;
            };
            var $921 = $925;
        };
        return $921;
    };
    const Int$abs = x0 => Int$abs$(x0);

    function Int$to_nat_signed$(_a$1) {
        var $928 = Pair$new$(Int$is_neg$(_a$1), Int$abs$(_a$1));
        return $928;
    };
    const Int$to_nat_signed = x0 => Int$to_nat_signed$(x0);

    function String$cons$(_head$1, _tail$2) {
        var $929 = (String.fromCharCode(_head$1) + _tail$2);
        return $929;
    };
    const String$cons = x0 => x1 => String$cons$(x0, x1);
    const String$concat = a0 => a1 => (a0 + a1);

    function List$fold$(_list$2, _nil$4, _cons$5) {
        var self = _list$2;
        switch (self._) {
            case 'List.cons':
                var $931 = self.head;
                var $932 = self.tail;
                var $933 = _cons$5($931)(List$fold$($932, _nil$4, _cons$5));
                var $930 = $933;
                break;
            case 'List.nil':
                var $934 = _nil$4;
                var $930 = $934;
                break;
        };
        return $930;
    };
    const List$fold = x0 => x1 => x2 => List$fold$(x0, x1, x2);

    function Either$(_A$1, _B$2) {
        var $935 = null;
        return $935;
    };
    const Either = x0 => x1 => Either$(x0, x1);

    function Either$left$(_value$3) {
        var $936 = ({
            _: 'Either.left',
            'value': _value$3
        });
        return $936;
    };
    const Either$left = x0 => Either$left$(x0);

    function Either$right$(_value$3) {
        var $937 = ({
            _: 'Either.right',
            'value': _value$3
        });
        return $937;
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
                    var $938 = Either$left$(_n$1);
                    return $938;
                } else {
                    var $939 = (self - 1n);
                    var self = _n$1;
                    if (self === 0n) {
                        var $941 = Either$right$(Nat$succ$($939));
                        var $940 = $941;
                    } else {
                        var $942 = (self - 1n);
                        var $943 = Nat$sub_rem$($942, $939);
                        var $940 = $943;
                    };
                    return $940;
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
                        var $944 = self.value;
                        var $945 = Nat$div_mod$go$($944, _m$2, Nat$succ$(_d$3));
                        return $945;
                    case 'Either.right':
                        var $946 = Pair$new$(_d$3, _n$1);
                        return $946;
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
                        var $947 = self.fst;
                        var $948 = self.snd;
                        var self = $947;
                        if (self === 0n) {
                            var $950 = List$cons$($948, _res$3);
                            var $949 = $950;
                        } else {
                            var $951 = (self - 1n);
                            var $952 = Nat$to_base$go$(_base$1, $947, List$cons$($948, _res$3));
                            var $949 = $952;
                        };
                        return $949;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Nat$to_base$go = x0 => x1 => x2 => Nat$to_base$go$(x0, x1, x2);

    function Nat$to_base$(_base$1, _nat$2) {
        var $953 = Nat$to_base$go$(_base$1, _nat$2, List$nil);
        return $953;
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
                    var $954 = Nat$mod$go$(_n$1, _r$3, _m$2);
                    return $954;
                } else {
                    var $955 = (self - 1n);
                    var self = _n$1;
                    if (self === 0n) {
                        var $957 = _r$3;
                        var $956 = $957;
                    } else {
                        var $958 = (self - 1n);
                        var $959 = Nat$mod$go$($958, $955, Nat$succ$(_r$3));
                        var $956 = $959;
                    };
                    return $956;
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
                        var $960 = self.head;
                        var $961 = self.tail;
                        var self = _index$2;
                        if (self === 0n) {
                            var $963 = Maybe$some$($960);
                            var $962 = $963;
                        } else {
                            var $964 = (self - 1n);
                            var $965 = List$at$($964, $961);
                            var $962 = $965;
                        };
                        return $962;
                    case 'List.nil':
                        var $966 = Maybe$none;
                        return $966;
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
                    var $969 = self.value;
                    var $970 = $969;
                    var $968 = $970;
                    break;
                case 'Maybe.none':
                    var $971 = 35;
                    var $968 = $971;
                    break;
            };
            var $967 = $968;
        } else {
            var $972 = 35;
            var $967 = $972;
        };
        return $967;
    };
    const Nat$show_digit = x0 => x1 => Nat$show_digit$(x0, x1);

    function Nat$to_string_base$(_base$1, _nat$2) {
        var $973 = List$fold$(Nat$to_base$(_base$1, _nat$2), String$nil, (_n$3 => _str$4 => {
            var $974 = String$cons$(Nat$show_digit$(_base$1, _n$3), _str$4);
            return $974;
        }));
        return $973;
    };
    const Nat$to_string_base = x0 => x1 => Nat$to_string_base$(x0, x1);

    function Nat$show$(_n$1) {
        var $975 = Nat$to_string_base$(10n, _n$1);
        return $975;
    };
    const Nat$show = x0 => Nat$show$(x0);

    function Int$show$(_a$1) {
        var _result$2 = Int$to_nat_signed$(_a$1);
        var self = _result$2;
        switch (self._) {
            case 'Pair.new':
                var $977 = self.fst;
                var $978 = self.snd;
                var self = $977;
                if (self) {
                    var $980 = ("-" + Nat$show$($978));
                    var $979 = $980;
                } else {
                    var $981 = ("+" + Nat$show$($978));
                    var $979 = $981;
                };
                var $976 = $979;
                break;
        };
        return $976;
    };
    const Int$show = x0 => Int$show$(x0);

    function Word$abs$(_a$2) {
        var _neg$3 = Word$is_neg$(_a$2);
        var self = _neg$3;
        if (self) {
            var $983 = Word$neg$(_a$2);
            var $982 = $983;
        } else {
            var $984 = _a$2;
            var $982 = $984;
        };
        return $982;
    };
    const Word$abs = x0 => Word$abs$(x0);

    function Word$to_int$(_a$2) {
        var _neg$3 = Word$is_neg$(_a$2);
        var _i$4 = (Word$to_nat$(Word$abs$(_a$2)));
        var self = _neg$3;
        if (self) {
            var $986 = Int$neg$(_i$4);
            var $985 = $986;
        } else {
            var $987 = _i$4;
            var $985 = $987;
        };
        return $985;
    };
    const Word$to_int = x0 => Word$to_int$(x0);

    function I32$to_int$(_a$1) {
        var self = _a$1;
        switch ('i32') {
            case 'i32':
                var $989 = i32_to_word(self);
                var $990 = Word$to_int$($989);
                var $988 = $990;
                break;
        };
        return $988;
    };
    const I32$to_int = x0 => I32$to_int$(x0);

    function List$imap$(_f$3, _xs$4) {
        var self = _xs$4;
        switch (self._) {
            case 'List.cons':
                var $992 = self.head;
                var $993 = self.tail;
                var $994 = List$cons$(_f$3(0n)($992), List$imap$((_n$7 => {
                    var $995 = _f$3(Nat$succ$(_n$7));
                    return $995;
                }), $993));
                var $991 = $994;
                break;
            case 'List.nil':
                var $996 = List$nil;
                var $991 = $996;
                break;
        };
        return $991;
    };
    const List$imap = x0 => x1 => List$imap$(x0, x1);

    function List$indices$u32$(_xs$2) {
        var $997 = List$imap$((_i$3 => _x$4 => {
            var $998 = Pair$new$((Number(_i$3) >>> 0), _x$4);
            return $998;
        }), _xs$2);
        return $997;
    };
    const List$indices$u32 = x0 => List$indices$u32$(x0);

    function String$to_list$(_str$1) {
        var self = _str$1;
        if (self.length === 0) {
            var $1000 = List$nil;
            var $999 = $1000;
        } else {
            var $1001 = self.charCodeAt(0);
            var $1002 = self.slice(1);
            var $1003 = List$cons$($1001, String$to_list$($1002));
            var $999 = $1003;
        };
        return $999;
    };
    const String$to_list = x0 => String$to_list$(x0);

    function Map$get$(_key$2, _map$3) {
        var $1004 = (bitsmap_get(String$to_bits$(_key$2), _map$3));
        return $1004;
    };
    const Map$get = x0 => x1 => Map$get$(x0, x1);

    function U16$show_hex$(_a$1) {
        var self = _a$1;
        switch ('u16') {
            case 'u16':
                var $1006 = u16_to_word(self);
                var $1007 = Nat$to_string_base$(16n, Bits$to_nat$(Word$to_bits$($1006)));
                var $1005 = $1007;
                break;
        };
        return $1005;
    };
    const U16$show_hex = x0 => U16$show_hex$(x0);

    function PixelFont$get_img$(_char$1, _map$2) {
        var self = Map$get$(U16$show_hex$(_char$1), _map$2);
        switch (self._) {
            case 'Maybe.some':
                var $1009 = self.value;
                var $1010 = Maybe$some$($1009);
                var $1008 = $1010;
                break;
            case 'Maybe.none':
                var $1011 = Maybe$none;
                var $1008 = $1011;
                break;
        };
        return $1008;
    };
    const PixelFont$get_img = x0 => x1 => PixelFont$get_img$(x0, x1);
    const Pos32$get_x = a0 => ((a0 & 0xFFF));
    const Pos32$get_y = a0 => (((a0 >>> 12) & 0xFFF));
    const Pos32$get_z = a0 => ((a0 >>> 24));

    function VoxBox$Draw$text$char$(_chr$1, _font_map$2, _chr_pos$3, _scr$4) {
        var self = PixelFont$get_img$(_chr$1, _font_map$2);
        switch (self._) {
            case 'Maybe.some':
                var $1013 = self.value;
                var _x$6 = ((_chr_pos$3 & 0xFFF));
                var _y$7 = (((_chr_pos$3 >>> 12) & 0xFFF));
                var _z$8 = ((_chr_pos$3 >>> 24));
                var $1014 = VoxBox$Draw$image$(_x$6, _y$7, _z$8, $1013, _scr$4);
                var $1012 = $1014;
                break;
            case 'Maybe.none':
                var $1015 = _scr$4;
                var $1012 = $1015;
                break;
        };
        return $1012;
    };
    const VoxBox$Draw$text$char = x0 => x1 => x2 => x3 => VoxBox$Draw$text$char$(x0, x1, x2, x3);

    function Pos32$add$(_a$1, _b$2) {
        var _x$3 = ((((_a$1 & 0xFFF)) + ((_b$2 & 0xFFF))) >>> 0);
        var _y$4 = (((((_a$1 >>> 12) & 0xFFF)) + (((_b$2 >>> 12) & 0xFFF))) >>> 0);
        var _z$5 = ((((_a$1 >>> 24)) + ((_b$2 >>> 24))) >>> 0);
        var $1016 = ((0 | _x$3 | (_y$4 << 12) | (_z$5 << 24)));
        return $1016;
    };
    const Pos32$add = x0 => x1 => Pos32$add$(x0, x1);

    function VoxBox$Draw$text$(_txt$1, _font_map$2, _pos$3, _scr$4) {
        var _scr$5 = (() => {
            var $1019 = _scr$4;
            var $1020 = List$indices$u32$(String$to_list$(_txt$1));
            let _scr$6 = $1019;
            let _pair$5;
            while ($1020._ === 'List.cons') {
                _pair$5 = $1020.head;
                var self = _pair$5;
                switch (self._) {
                    case 'Pair.new':
                        var $1021 = self.fst;
                        var $1022 = self.snd;
                        var _add_pos$9 = ((0 | (($1021 * 6) >>> 0) | (0 << 12) | (0 << 24)));
                        var $1023 = VoxBox$Draw$text$char$($1022, _font_map$2, Pos32$add$(_pos$3, _add_pos$9), _scr$6);
                        var $1019 = $1023;
                        break;
                };
                _scr$6 = $1019;
                $1020 = $1020.tail;
            }
            return _scr$6;
        })();
        var $1017 = _scr$5;
        return $1017;
    };
    const VoxBox$Draw$text = x0 => x1 => x2 => x3 => VoxBox$Draw$text$(x0, x1, x2, x3);
    const Map$new = BitsMap$new;

    function Map$set$(_key$2, _val$3, _map$4) {
        var $1024 = (bitsmap_set(String$to_bits$(_key$2), _val$3, _map$4, 'set'));
        return $1024;
    };
    const Map$set = x0 => x1 => x2 => Map$set$(x0, x1, x2);

    function PixelFont$set_img$(_char$1, _img$2, _map$3) {
        var $1025 = Map$set$(U16$show_hex$(_char$1), _img$2, _map$3);
        return $1025;
    };
    const PixelFont$set_img = x0 => x1 => x2 => PixelFont$set_img$(x0, x1, x2);

    function U16$new$(_value$1) {
        var $1026 = word_to_u16(_value$1);
        return $1026;
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
        var $1027 = _map$96;
        return $1027;
    })();

    function Web$Kaelin$Draw$creature$hp$(_cx$1, _cy$2, _creature$3, _img$4) {
        var _hp$5 = Int$show$(I32$to_int$((() => {
            var self = _creature$3;
            switch (self._) {
                case 'Web.Kaelin.Creature.new':
                    var $1029 = self.hp;
                    var $1030 = $1029;
                    return $1030;
            };
        })()));
        var $1028 = VoxBox$Draw$text$(_hp$5, PixelFont$small_black, ((0 | _cx$1 | (_cy$2 << 12) | (0 << 24))), _img$4);
        return $1028;
    };
    const Web$Kaelin$Draw$creature$hp = x0 => x1 => x2 => x3 => Web$Kaelin$Draw$creature$hp$(x0, x1, x2, x3);

    function Web$Kaelin$Draw$tile$creature$(_creature$1, _coord$2, _img$3) {
        var self = _creature$1;
        switch (self._) {
            case 'Maybe.some':
                var $1032 = self.value;
                var _key$5 = Web$Kaelin$Coord$Convert$axial_to_nat$(_coord$2);
                var self = Web$Kaelin$Coord$to_screen_xy$(_coord$2);
                switch (self._) {
                    case 'Pair.new':
                        var $1034 = self.fst;
                        var $1035 = self.snd;
                        var _img$8 = Web$Kaelin$Draw$hero$($1034, $1035, 0, (() => {
                            var self = $1032;
                            switch (self._) {
                                case 'Web.Kaelin.Creature.new':
                                    var $1037 = self.hero;
                                    var $1038 = $1037;
                                    return $1038;
                            };
                        })(), _img$3);
                        var self = ((() => {
                            var self = $1032;
                            switch (self._) {
                                case 'Web.Kaelin.Creature.new':
                                    var $1039 = self.hp;
                                    var $1040 = $1039;
                                    return $1040;
                            };
                        })() > 0);
                        if (self) {
                            var $1041 = Web$Kaelin$Draw$creature$hp$($1034, $1035, $1032, _img$8);
                            var $1036 = $1041;
                        } else {
                            var $1042 = _img$8;
                            var $1036 = $1042;
                        };
                        var $1033 = $1036;
                        break;
                };
                var $1031 = $1033;
                break;
            case 'Maybe.none':
                var $1043 = _img$3;
                var $1031 = $1043;
                break;
        };
        return $1031;
    };
    const Web$Kaelin$Draw$tile$creature = x0 => x1 => x2 => Web$Kaelin$Draw$tile$creature$(x0, x1, x2);
    const Nat$div = a0 => a1 => (a0 / a1);
    const List$length = a0 => (list_length(a0));

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
                        var $1044 = self.head;
                        var $1045 = self.tail;
                        var self = _index$2;
                        if (self === 0n) {
                            var $1047 = Maybe$some$($1044);
                            var $1046 = $1047;
                        } else {
                            var $1048 = (self - 1n);
                            var $1049 = List$get$($1048, $1045);
                            var $1046 = $1049;
                        };
                        return $1046;
                    case 'List.nil':
                        var $1050 = Maybe$none;
                        return $1050;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const List$get = x0 => x1 => List$get$(x0, x1);

    function Web$Kaelin$Draw$support$animation_frame$(_pos$1, _z$2, _effect$3, _img$4) {
        var self = Web$Kaelin$Draw$support$centralize$(_pos$1);
        switch (self._) {
            case 'Pair.new':
                var $1052 = self.fst;
                var $1053 = self.snd;
                var $1054 = VoxBox$Draw$image$($1052, (($1053 - ((Web$Kaelin$Constants$hexagon_radius / 2) >>> 0)) >>> 0), 0, _effect$3, _img$4);
                var $1051 = $1054;
                break;
        };
        return $1051;
    };
    const Web$Kaelin$Draw$support$animation_frame = x0 => x1 => x2 => x3 => Web$Kaelin$Draw$support$animation_frame$(x0, x1, x2, x3);

    function Web$Kaelin$Draw$tile$animation$(_animation$1, _coord$2, _internal$3, _img$4) {
        var self = _animation$1;
        switch (self._) {
            case 'Maybe.some':
                var $1056 = self.value;
                var self = $1056;
                switch (self._) {
                    case 'Web.Kaelin.Animation.new':
                        var $1058 = self.fps;
                        var $1059 = self.sprite;
                        var self = $1059;
                        switch (self._) {
                            case 'Web.Kaelin.Sprite.new':
                                var $1061 = self.frame_info;
                                var $1062 = self.voxboxes;
                                var self = _internal$3;
                                switch (self._) {
                                    case 'Web.Kaelin.Internal.new':
                                        var $1064 = self.frame;
                                        var _kalein_frame$13 = (1000n / 16n);
                                        var _indx$14 = ((($1064 - $1058 <= 0n ? 0n : $1064 - $1058) % $1061) % (list_length($1062)));
                                        var self = List$get$(_indx$14, $1062);
                                        switch (self._) {
                                            case 'Maybe.some':
                                                var $1066 = self.value;
                                                var $1067 = Web$Kaelin$Draw$support$animation_frame$(_coord$2, 0, $1066, _img$4);
                                                var $1065 = $1067;
                                                break;
                                            case 'Maybe.none':
                                                var $1068 = _img$4;
                                                var $1065 = $1068;
                                                break;
                                        };
                                        var $1063 = $1065;
                                        break;
                                };
                                var $1060 = $1063;
                                break;
                        };
                        var $1057 = $1060;
                        break;
                };
                var $1055 = $1057;
                break;
            case 'Maybe.none':
                var $1069 = _img$4;
                var $1055 = $1069;
                break;
        };
        return $1055;
    };
    const Web$Kaelin$Draw$tile$animation = x0 => x1 => x2 => x3 => Web$Kaelin$Draw$tile$animation$(x0, x1, x2, x3);

    function Web$Kaelin$Draw$state$map$(_map$1, _cast_info$2, _env_info$3, _internal$4, _img$5) {
        var _map$6 = NatMap$to_list$(_map$1);
        var _mouse_coord$7 = Web$Kaelin$Coord$to_axial$((() => {
            var self = _env_info$3;
            switch (self._) {
                case 'App.EnvInfo.new':
                    var $1071 = self.mouse_pos;
                    var $1072 = $1071;
                    return $1072;
            };
        })());
        var _img$8 = (() => {
            var $1074 = _img$5;
            var $1075 = _map$6;
            let _img$9 = $1074;
            let _pos$8;
            while ($1075._ === 'List.cons') {
                _pos$8 = $1075.head;
                var self = _pos$8;
                switch (self._) {
                    case 'Pair.new':
                        var $1076 = self.fst;
                        var $1077 = self.snd;
                        var _coord$12 = Web$Kaelin$Coord$Convert$nat_to_axial$($1076);
                        var _img$13 = Web$Kaelin$Draw$tile$background$((() => {
                            var self = $1077;
                            switch (self._) {
                                case 'Web.Kaelin.Tile.new':
                                    var $1079 = self.background;
                                    var $1080 = $1079;
                                    return $1080;
                            };
                        })(), _cast_info$2, _coord$12, _mouse_coord$7, _img$9);
                        var _img$14 = Web$Kaelin$Draw$tile$creature$((() => {
                            var self = $1077;
                            switch (self._) {
                                case 'Web.Kaelin.Tile.new':
                                    var $1081 = self.creature;
                                    var $1082 = $1081;
                                    return $1082;
                            };
                        })(), _coord$12, _img$13);
                        var _img$15 = Web$Kaelin$Draw$tile$animation$((() => {
                            var self = $1077;
                            switch (self._) {
                                case 'Web.Kaelin.Tile.new':
                                    var $1083 = self.animation;
                                    var $1084 = $1083;
                                    return $1084;
                            };
                        })(), _coord$12, _internal$4, _img$14);
                        var $1078 = _img$15;
                        var $1074 = $1078;
                        break;
                };
                _img$9 = $1074;
                $1075 = $1075.tail;
            }
            return _img$9;
        })();
        var $1070 = _img$8;
        return $1070;
    };
    const Web$Kaelin$Draw$state$map = x0 => x1 => x2 => x3 => x4 => Web$Kaelin$Draw$state$map$(x0, x1, x2, x3, x4);
    const Web$Kaelin$Assets$tile$mouse_ui = VoxBox$parse$("0d0302ffffff0e0302ffffff0f0302ffffff100302ffffff110302ffffff0b0402ffffff0c0402ffffff0d0402ffffff0e0402ffffff0f0402ffffff100402ffffff110402ffffff120402ffffff130402ffffff0b0502ffffff0c0502ffffff0d0502ffffff110502ffffff120502ffffff130502ffffff040702ffffff050702ffffff060702ffffff180702ffffff190702ffffff1a0702ffffff030802ffffff040802ffffff050802ffffff060802ffffff180802ffffff190802ffffff1a0802ffffff1b0802ffffff020902ffffff030902ffffff040902ffffff1a0902ffffff1b0902ffffff1c0902ffffff020a02ffffff030a02ffffff1b0a02ffffff1c0a02ffffff020b02ffffff030b02ffffff1b0b02ffffff1c0b02ffffff021302ffffff031302ffffff1b1302ffffff1c1302ffffff021402ffffff031402ffffff1b1402ffffff1c1402ffffff021502ffffff031502ffffff041502ffffff1a1502ffffff1b1502ffffff1c1502ffffff031602ffffff041602ffffff051602ffffff061602ffffff181602ffffff191602ffffff1a1602ffffff1b1602ffffff041702ffffff051702ffffff061702ffffff181702ffffff191702ffffff1a1702ffffff0b1902ffffff0c1902ffffff0d1902ffffff111902ffffff121902ffffff131902ffffff0b1a02ffffff0c1a02ffffff0d1a02ffffff0e1a02ffffff0f1a02ffffff101a02ffffff111a02ffffff121a02ffffff131a02ffffff0d1b02ffffff0e1b02ffffff0f1b02ffffff101b02ffffff111b02ffffff");

    function Web$Kaelin$Draw$state$mouse_ui$(_info$1, _img$2) {
        var self = _info$1;
        switch (self._) {
            case 'App.EnvInfo.new':
                var $1086 = self.mouse_pos;
                var _coord$5 = Web$Kaelin$Coord$to_axial$($1086);
                var self = Web$Kaelin$Draw$support$centralize$(_coord$5);
                switch (self._) {
                    case 'Pair.new':
                        var $1088 = self.fst;
                        var $1089 = self.snd;
                        var $1090 = VoxBox$Draw$image$($1088, $1089, 0, Web$Kaelin$Assets$tile$mouse_ui, _img$2);
                        var $1087 = $1090;
                        break;
                };
                var $1085 = $1087;
                break;
        };
        return $1085;
    };
    const Web$Kaelin$Draw$state$mouse_ui = x0 => x1 => Web$Kaelin$Draw$state$mouse_ui$(x0, x1);

    function Web$Kaelin$Draw$state$(_img$1, _state$2) {
        var self = _state$2;
        switch (self._) {
            case 'Web.Kaelin.State.game':
                var $1092 = self.cast_info;
                var $1093 = self.map;
                var $1094 = self.internal;
                var $1095 = self.env_info;
                var _img$9 = Web$Kaelin$Draw$state$map$($1093, $1092, $1095, $1094, _img$1);
                var _img$10 = Web$Kaelin$Draw$state$mouse_ui$($1095, _img$9);
                var $1096 = _img$10;
                var $1091 = $1096;
                break;
            case 'Web.Kaelin.State.init':
            case 'Web.Kaelin.State.void':
                var $1097 = _img$1;
                var $1091 = $1097;
                break;
        };
        return $1091;
    };
    const Web$Kaelin$Draw$state = x0 => x1 => Web$Kaelin$Draw$state$(x0, x1);

    function Web$Kaelin$App$draw$(_img$1, _state$2) {
        var self = _state$2;
        switch (self._) {
            case 'Web.Kaelin.State.init':
            case 'Web.Kaelin.State.void':
                var $1099 = DOM$text$("TODO: create the renderer for this game state mode");
                var $1098 = $1099;
                break;
            case 'Web.Kaelin.State.game':
                var $1100 = DOM$vbox$(Map$from_list$(List$nil), Map$from_list$(List$nil), Web$Kaelin$Draw$state$(_img$1, _state$2));
                var $1098 = $1100;
                break;
        };
        return $1098;
    };
    const Web$Kaelin$App$draw = x0 => x1 => Web$Kaelin$App$draw$(x0, x1);

    function IO$(_A$1) {
        var $1101 = null;
        return $1101;
    };
    const IO = x0 => IO$(x0);

    function IO$ask$(_query$2, _param$3, _then$4) {
        var $1102 = ({
            _: 'IO.ask',
            'query': _query$2,
            'param': _param$3,
            'then': _then$4
        });
        return $1102;
    };
    const IO$ask = x0 => x1 => x2 => IO$ask$(x0, x1, x2);

    function IO$bind$(_a$3, _f$4) {
        var self = _a$3;
        switch (self._) {
            case 'IO.end':
                var $1104 = self.value;
                var $1105 = _f$4($1104);
                var $1103 = $1105;
                break;
            case 'IO.ask':
                var $1106 = self.query;
                var $1107 = self.param;
                var $1108 = self.then;
                var $1109 = IO$ask$($1106, $1107, (_x$8 => {
                    var $1110 = IO$bind$($1108(_x$8), _f$4);
                    return $1110;
                }));
                var $1103 = $1109;
                break;
        };
        return $1103;
    };
    const IO$bind = x0 => x1 => IO$bind$(x0, x1);

    function IO$end$(_value$2) {
        var $1111 = ({
            _: 'IO.end',
            'value': _value$2
        });
        return $1111;
    };
    const IO$end = x0 => IO$end$(x0);

    function IO$monad$(_new$2) {
        var $1112 = _new$2(IO$bind)(IO$end);
        return $1112;
    };
    const IO$monad = x0 => IO$monad$(x0);

    function Dynamic$new$(_value$2) {
        var $1113 = ({
            _: 'Dynamic.new',
            'value': _value$2
        });
        return $1113;
    };
    const Dynamic$new = x0 => Dynamic$new$(x0);
    const App$pass = IO$monad$((_m$bind$1 => _m$pure$2 => {
        var $1114 = _m$pure$2;
        return $1114;
    }))(Dynamic$new$(Unit$new));

    function String$map$(_f$1, _as$2) {
        var self = _as$2;
        if (self.length === 0) {
            var $1116 = String$nil;
            var $1115 = $1116;
        } else {
            var $1117 = self.charCodeAt(0);
            var $1118 = self.slice(1);
            var $1119 = String$cons$(_f$1($1117), String$map$(_f$1, $1118));
            var $1115 = $1119;
        };
        return $1115;
    };
    const String$map = x0 => x1 => String$map$(x0, x1);
    const U16$gte = a0 => a1 => (a0 >= a1);
    const U16$lte = a0 => a1 => (a0 <= a1);
    const U16$add = a0 => a1 => ((a0 + a1) & 0xFFFF);

    function Char$to_lower$(_char$1) {
        var self = ((_char$1 >= 65) && (_char$1 <= 90));
        if (self) {
            var $1121 = ((_char$1 + 32) & 0xFFFF);
            var $1120 = $1121;
        } else {
            var $1122 = _char$1;
            var $1120 = $1122;
        };
        return $1120;
    };
    const Char$to_lower = x0 => Char$to_lower$(x0);

    function String$to_lower$(_str$1) {
        var $1123 = String$map$(Char$to_lower, _str$1);
        return $1123;
    };
    const String$to_lower = x0 => String$to_lower$(x0);

    function IO$do$(_call$1, _param$2) {
        var $1124 = IO$ask$(_call$1, _param$2, (_answer$3 => {
            var $1125 = IO$end$(Unit$new);
            return $1125;
        }));
        return $1124;
    };
    const IO$do = x0 => x1 => IO$do$(x0, x1);

    function App$do$(_call$1, _param$2) {
        var $1126 = IO$monad$((_m$bind$3 => _m$pure$4 => {
            var $1127 = _m$bind$3;
            return $1127;
        }))(IO$do$(_call$1, _param$2))((_$3 => {
            var $1128 = App$pass;
            return $1128;
        }));
        return $1126;
    };
    const App$do = x0 => x1 => App$do$(x0, x1);

    function App$watch$(_room$1) {
        var $1129 = App$do$("watch", _room$1);
        return $1129;
    };
    const App$watch = x0 => App$watch$(x0);

    function App$store$(_value$2) {
        var $1130 = IO$monad$((_m$bind$3 => _m$pure$4 => {
            var $1131 = _m$pure$4;
            return $1131;
        }))(Dynamic$new$(_value$2));
        return $1130;
    };
    const App$store = x0 => App$store$(x0);

    function List$take_while$go$(_f$2, _xs$3) {
        var self = _xs$3;
        switch (self._) {
            case 'List.cons':
                var $1133 = self.head;
                var $1134 = self.tail;
                var self = _f$2($1133);
                if (self) {
                    var self = List$take_while$go$(_f$2, $1134);
                    switch (self._) {
                        case 'Pair.new':
                            var $1137 = self.fst;
                            var $1138 = self.snd;
                            var $1139 = Pair$new$(List$cons$($1133, $1137), $1138);
                            var $1136 = $1139;
                            break;
                    };
                    var $1135 = $1136;
                } else {
                    var $1140 = Pair$new$(List$nil, _xs$3);
                    var $1135 = $1140;
                };
                var $1132 = $1135;
                break;
            case 'List.nil':
                var $1141 = Pair$new$(List$nil, List$nil);
                var $1132 = $1141;
                break;
        };
        return $1132;
    };
    const List$take_while$go = x0 => x1 => List$take_while$go$(x0, x1);

    function List$foldr$(_b$3, _f$4, _xs$5) {
        var $1142 = List$fold$(_xs$5, _b$3, _f$4);
        return $1142;
    };
    const List$foldr = x0 => x1 => x2 => List$foldr$(x0, x1, x2);

    function Web$Kaelin$Timer$set_timer$(_timer$1, _state$2) {
        var self = _state$2;
        switch (self._) {
            case 'Web.Kaelin.State.game':
                var $1144 = self.user;
                var $1145 = self.room;
                var $1146 = self.cast_info;
                var $1147 = self.map;
                var $1148 = self.internal;
                var $1149 = self.env_info;
                var _internal$9 = $1148;
                var self = _internal$9;
                switch (self._) {
                    case 'Web.Kaelin.Internal.new':
                        var $1151 = self.tick;
                        var $1152 = self.frame;
                        var $1153 = Web$Kaelin$State$game$($1144, $1145, $1146, $1147, Web$Kaelin$Internal$new$($1151, $1152, _timer$1), $1149);
                        var $1150 = $1153;
                        break;
                };
                var $1143 = $1150;
                break;
            case 'Web.Kaelin.State.init':
            case 'Web.Kaelin.State.void':
                var $1154 = _state$2;
                var $1143 = $1154;
                break;
        };
        return $1143;
    };
    const Web$Kaelin$Timer$set_timer = x0 => x1 => Web$Kaelin$Timer$set_timer$(x0, x1);

    function Function$comp$(_g$4, _f$5, _x$6) {
        var $1155 = _g$4(_f$5(_x$6));
        return $1155;
    };
    const Function$comp = x0 => x1 => x2 => Function$comp$(x0, x1, x2);

    function Web$Kaelin$Timer$wait$(_frame$1, _timer$2, _state$3) {
        var self = List$take_while$go$((_x$4 => {
            var self = _x$4;
            switch (self._) {
                case 'Web.Kaelin.Timer.new':
                    var $1158 = self.time;
                    var $1159 = ($1158 < _frame$1);
                    var $1157 = $1159;
                    break;
            };
            return $1157;
        }), _timer$2);
        switch (self._) {
            case 'Pair.new':
                var $1160 = self.fst;
                var $1161 = self.snd;
                var $1162 = Web$Kaelin$Timer$set_timer$($1161, List$foldr$((_x$6 => {
                    var $1163 = _x$6;
                    return $1163;
                }), (_x$6 => _f$7 => {
                    var self = _x$6;
                    switch (self._) {
                        case 'Web.Kaelin.Timer.new':
                            var $1165 = self.action;
                            var $1166 = Function$comp(_f$7)($1165);
                            var $1164 = $1166;
                            break;
                    };
                    return $1164;
                }), $1160)(_state$3));
                var $1156 = $1162;
                break;
        };
        return $1156;
    };
    const Web$Kaelin$Timer$wait = x0 => x1 => x2 => Web$Kaelin$Timer$wait$(x0, x1, x2);

    function Web$Kaelin$Action$update_interface$(_interface$1, _tick$2, _state$3) {
        var self = _state$3;
        switch (self._) {
            case 'Web.Kaelin.State.game':
                var $1168 = self.user;
                var $1169 = self.room;
                var $1170 = self.cast_info;
                var $1171 = self.map;
                var $1172 = self.internal;
                var _internal$10 = $1172;
                var self = _internal$10;
                switch (self._) {
                    case 'Web.Kaelin.Internal.new':
                        var $1174 = self.frame;
                        var $1175 = self.timer;
                        var _new_state$14 = Web$Kaelin$State$game$($1168, $1169, $1170, $1171, Web$Kaelin$Internal$new$(_tick$2, ($1174 + 1n), $1175), _interface$1);
                        var $1176 = Web$Kaelin$Timer$wait$($1174, $1175, _new_state$14);
                        var $1173 = $1176;
                        break;
                };
                var $1167 = $1173;
                break;
            case 'Web.Kaelin.State.init':
            case 'Web.Kaelin.State.void':
                var $1177 = _state$3;
                var $1167 = $1177;
                break;
        };
        return $1167;
    };
    const Web$Kaelin$Action$update_interface = x0 => x1 => x2 => Web$Kaelin$Action$update_interface$(x0, x1, x2);
    const U64$to_nat = a0 => (a0);
    const I32$eql = a0 => a1 => (a0 === a1);

    function Web$Kaelin$Coord$eql$(_a$1, _b$2) {
        var self = _a$1;
        switch (self._) {
            case 'Web.Kaelin.Coord.new':
                var $1179 = self.i;
                var $1180 = self.j;
                var self = _b$2;
                switch (self._) {
                    case 'Web.Kaelin.Coord.new':
                        var $1182 = self.i;
                        var $1183 = self.j;
                        var $1184 = (($1179 === $1182) && ($1180 === $1183));
                        var $1181 = $1184;
                        break;
                };
                var $1178 = $1181;
                break;
        };
        return $1178;
    };
    const Web$Kaelin$Coord$eql = x0 => x1 => Web$Kaelin$Coord$eql$(x0, x1);

    function Web$Kaelin$Skill$indicator$(_tick$1, _hero_pos$2, _skill$3, _mouse_coord$4, _map$5) {
        var self = _skill$3;
        switch (self._) {
            case 'Web.Kaelin.Skill.new':
                var $1186 = self.effect;
                var _result$10 = $1186(_tick$1)(_hero_pos$2)(_mouse_coord$4)(_map$5);
                var self = _result$10;
                switch (self._) {
                    case 'Web.Kaelin.Effect.Result.new':
                        var $1188 = self.indicators;
                        var $1189 = $1188;
                        var $1187 = $1189;
                        break;
                };
                var $1185 = $1187;
                break;
        };
        return $1185;
    };
    const Web$Kaelin$Skill$indicator = x0 => x1 => x2 => x3 => x4 => Web$Kaelin$Skill$indicator$(x0, x1, x2, x3, x4);

    function Web$Kaelin$CastInfo$new$(_hero_pos$1, _skill$2, _range$3, _area$4, _mouse_pos$5) {
        var $1190 = ({
            _: 'Web.Kaelin.CastInfo.new',
            'hero_pos': _hero_pos$1,
            'skill': _skill$2,
            'range': _range$3,
            'area': _area$4,
            'mouse_pos': _mouse_pos$5
        });
        return $1190;
    };
    const Web$Kaelin$CastInfo$new = x0 => x1 => x2 => x3 => x4 => Web$Kaelin$CastInfo$new$(x0, x1, x2, x3, x4);

    function Web$Kaelin$Action$update_area$(_state$1) {
        var self = _state$1;
        switch (self._) {
            case 'Web.Kaelin.State.game':
                var $1192 = self.user;
                var $1193 = self.room;
                var $1194 = self.cast_info;
                var $1195 = self.map;
                var $1196 = self.internal;
                var $1197 = self.env_info;
                var self = $1197;
                switch (self._) {
                    case 'App.EnvInfo.new':
                        var $1199 = self.mouse_pos;
                        var self = $1194;
                        switch (self._) {
                            case 'Maybe.some':
                                var $1201 = self.value;
                                var self = $1201;
                                switch (self._) {
                                    case 'Web.Kaelin.CastInfo.new':
                                        var $1203 = self.hero_pos;
                                        var $1204 = self.skill;
                                        var $1205 = self.range;
                                        var $1206 = self.mouse_pos;
                                        var _mouse_coord$16 = Web$Kaelin$Coord$to_axial$($1199);
                                        var self = Web$Kaelin$Coord$eql$(_mouse_coord$16, $1206);
                                        if (self) {
                                            var $1208 = _state$1;
                                            var $1207 = $1208;
                                        } else {
                                            var self = $1196;
                                            switch (self._) {
                                                case 'Web.Kaelin.Internal.new':
                                                    var $1210 = self.tick;
                                                    var _area$20 = Web$Kaelin$Skill$indicator$($1210, $1203, $1204, _mouse_coord$16, $1195);
                                                    var _new_cast_info$21 = Maybe$some$(Web$Kaelin$CastInfo$new$($1203, $1204, $1205, _area$20, _mouse_coord$16));
                                                    var _new_state$22 = Web$Kaelin$State$game$($1192, $1193, _new_cast_info$21, $1195, $1196, $1197);
                                                    var $1211 = _new_state$22;
                                                    var $1209 = $1211;
                                                    break;
                                            };
                                            var $1207 = $1209;
                                        };
                                        var $1202 = $1207;
                                        break;
                                };
                                var $1200 = $1202;
                                break;
                            case 'Maybe.none':
                                var $1212 = _state$1;
                                var $1200 = $1212;
                                break;
                        };
                        var $1198 = $1200;
                        break;
                };
                var $1191 = $1198;
                break;
            case 'Web.Kaelin.State.init':
            case 'Web.Kaelin.State.void':
                var $1213 = _state$1;
                var $1191 = $1213;
                break;
        };
        return $1191;
    };
    const Web$Kaelin$Action$update_area = x0 => Web$Kaelin$Action$update_area$(x0);
    const U8$to_nat = a0 => (BigInt(a0));

    function List$zip$(_as$3, _bs$4) {
        var self = _as$3;
        switch (self._) {
            case 'List.cons':
                var $1215 = self.head;
                var $1216 = self.tail;
                var self = _bs$4;
                switch (self._) {
                    case 'List.cons':
                        var $1218 = self.head;
                        var $1219 = self.tail;
                        var $1220 = List$cons$(Pair$new$($1215, $1218), List$zip$($1216, $1219));
                        var $1217 = $1220;
                        break;
                    case 'List.nil':
                        var $1221 = List$nil;
                        var $1217 = $1221;
                        break;
                };
                var $1214 = $1217;
                break;
            case 'List.nil':
                var $1222 = List$nil;
                var $1214 = $1222;
                break;
        };
        return $1214;
    };
    const List$zip = x0 => x1 => List$zip$(x0, x1);

    function U8$new$(_value$1) {
        var $1223 = word_to_u8(_value$1);
        return $1223;
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
                    var $1224 = _n$2;
                    return $1224;
                } else {
                    var $1225 = self.charCodeAt(0);
                    var $1226 = self.slice(1);
                    var $1227 = String$length$go$($1226, Nat$succ$(_n$2));
                    return $1227;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const String$length$go = x0 => x1 => String$length$go$(x0, x1);

    function String$length$(_xs$1) {
        var $1228 = String$length$go$(_xs$1, 0n);
        return $1228;
    };
    const String$length = x0 => String$length$(x0);

    function String$repeat$(_xs$1, _n$2) {
        var self = _n$2;
        if (self === 0n) {
            var $1230 = String$nil;
            var $1229 = $1230;
        } else {
            var $1231 = (self - 1n);
            var $1232 = (_xs$1 + String$repeat$(_xs$1, $1231));
            var $1229 = $1232;
        };
        return $1229;
    };
    const String$repeat = x0 => x1 => String$repeat$(x0, x1);

    function Hex$set_min_length$(_min$1, _hex$2) {
        var _dif$3 = (_min$1 - String$length$(_hex$2) <= 0n ? 0n : _min$1 - String$length$(_hex$2));
        var $1233 = (_hex$2 + String$repeat$("0", _dif$3));
        return $1233;
    };
    const Hex$set_min_length = x0 => x1 => Hex$set_min_length$(x0, x1);

    function Hex$format_hex$(_min$1, _hex$2) {
        var _dif$3 = (_min$1 - String$length$(_hex$2) <= 0n ? 0n : _min$1 - String$length$(_hex$2));
        var self = (String$length$(_hex$2) < _min$1);
        if (self) {
            var $1235 = (String$repeat$("0", _dif$3) + _hex$2);
            var $1234 = $1235;
        } else {
            var $1236 = _hex$2;
            var $1234 = $1236;
        };
        return $1234;
    };
    const Hex$format_hex = x0 => x1 => Hex$format_hex$(x0, x1);

    function Bits$chunks_of$go$(_len$1, _bits$2, _need$3, _chunk$4) {
        var self = _bits$2;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'o':
                var $1238 = self.slice(0, -1);
                var self = _need$3;
                if (self === 0n) {
                    var _head$6 = Bits$reverse$(_chunk$4);
                    var _tail$7 = Bits$chunks_of$go$(_len$1, _bits$2, _len$1, Bits$e);
                    var $1240 = List$cons$(_head$6, _tail$7);
                    var $1239 = $1240;
                } else {
                    var $1241 = (self - 1n);
                    var _chunk$7 = (_chunk$4 + '0');
                    var $1242 = Bits$chunks_of$go$(_len$1, $1238, $1241, _chunk$7);
                    var $1239 = $1242;
                };
                var $1237 = $1239;
                break;
            case 'i':
                var $1243 = self.slice(0, -1);
                var self = _need$3;
                if (self === 0n) {
                    var _head$6 = Bits$reverse$(_chunk$4);
                    var _tail$7 = Bits$chunks_of$go$(_len$1, _bits$2, _len$1, Bits$e);
                    var $1245 = List$cons$(_head$6, _tail$7);
                    var $1244 = $1245;
                } else {
                    var $1246 = (self - 1n);
                    var _chunk$7 = (_chunk$4 + '1');
                    var $1247 = Bits$chunks_of$go$(_len$1, $1243, $1246, _chunk$7);
                    var $1244 = $1247;
                };
                var $1237 = $1244;
                break;
            case 'e':
                var $1248 = List$cons$(Bits$reverse$(_chunk$4), List$nil);
                var $1237 = $1248;
                break;
        };
        return $1237;
    };
    const Bits$chunks_of$go = x0 => x1 => x2 => x3 => Bits$chunks_of$go$(x0, x1, x2, x3);

    function Bits$chunks_of$(_len$1, _bits$2) {
        var $1249 = Bits$chunks_of$go$(_len$1, _bits$2, _len$1, Bits$e);
        return $1249;
    };
    const Bits$chunks_of = x0 => x1 => Bits$chunks_of$(x0, x1);

    function Function$flip$(_f$4, _y$5, _x$6) {
        var $1250 = _f$4(_x$6)(_y$5);
        return $1250;
    };
    const Function$flip = x0 => x1 => x2 => Function$flip$(x0, x1, x2);
    const Nat$eql = a0 => a1 => (a0 === a1);

    function Hex$to_hex_string$(_x$1) {
        var self = (Bits$to_nat$(_x$1) === 0n);
        if (self) {
            var $1252 = "0";
            var $1251 = $1252;
        } else {
            var self = (Bits$to_nat$(_x$1) === 1n);
            if (self) {
                var $1254 = "1";
                var $1253 = $1254;
            } else {
                var self = (Bits$to_nat$(_x$1) === 2n);
                if (self) {
                    var $1256 = "2";
                    var $1255 = $1256;
                } else {
                    var self = (Bits$to_nat$(_x$1) === 3n);
                    if (self) {
                        var $1258 = "3";
                        var $1257 = $1258;
                    } else {
                        var self = (Bits$to_nat$(_x$1) === 4n);
                        if (self) {
                            var $1260 = "4";
                            var $1259 = $1260;
                        } else {
                            var self = (Bits$to_nat$(_x$1) === 5n);
                            if (self) {
                                var $1262 = "5";
                                var $1261 = $1262;
                            } else {
                                var self = (Bits$to_nat$(_x$1) === 6n);
                                if (self) {
                                    var $1264 = "6";
                                    var $1263 = $1264;
                                } else {
                                    var self = (Bits$to_nat$(_x$1) === 7n);
                                    if (self) {
                                        var $1266 = "7";
                                        var $1265 = $1266;
                                    } else {
                                        var self = (Bits$to_nat$(_x$1) === 8n);
                                        if (self) {
                                            var $1268 = "8";
                                            var $1267 = $1268;
                                        } else {
                                            var self = (Bits$to_nat$(_x$1) === 9n);
                                            if (self) {
                                                var $1270 = "9";
                                                var $1269 = $1270;
                                            } else {
                                                var self = (Bits$to_nat$(_x$1) === 10n);
                                                if (self) {
                                                    var $1272 = "a";
                                                    var $1271 = $1272;
                                                } else {
                                                    var self = (Bits$to_nat$(_x$1) === 11n);
                                                    if (self) {
                                                        var $1274 = "b";
                                                        var $1273 = $1274;
                                                    } else {
                                                        var self = (Bits$to_nat$(_x$1) === 12n);
                                                        if (self) {
                                                            var $1276 = "c";
                                                            var $1275 = $1276;
                                                        } else {
                                                            var self = (Bits$to_nat$(_x$1) === 13n);
                                                            if (self) {
                                                                var $1278 = "d";
                                                                var $1277 = $1278;
                                                            } else {
                                                                var self = (Bits$to_nat$(_x$1) === 14n);
                                                                if (self) {
                                                                    var $1280 = "e";
                                                                    var $1279 = $1280;
                                                                } else {
                                                                    var self = (Bits$to_nat$(_x$1) === 15n);
                                                                    if (self) {
                                                                        var $1282 = "f";
                                                                        var $1281 = $1282;
                                                                    } else {
                                                                        var $1283 = "?";
                                                                        var $1281 = $1283;
                                                                    };
                                                                    var $1279 = $1281;
                                                                };
                                                                var $1277 = $1279;
                                                            };
                                                            var $1275 = $1277;
                                                        };
                                                        var $1273 = $1275;
                                                    };
                                                    var $1271 = $1273;
                                                };
                                                var $1269 = $1271;
                                            };
                                            var $1267 = $1269;
                                        };
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
        return $1251;
    };
    const Hex$to_hex_string = x0 => Hex$to_hex_string$(x0);

    function Bits$to_hex_string$(_x$1) {
        var _ls$2 = Bits$chunks_of$(4n, _x$1);
        var $1284 = List$foldr$("", (_x$3 => {
            var $1285 = Function$flip(String$concat)(Hex$to_hex_string$(_x$3));
            return $1285;
        }), _ls$2);
        return $1284;
    };
    const Bits$to_hex_string = x0 => Bits$to_hex_string$(x0);

    function Hex$append$(_hex$1, _size$2, _x$3) {
        var _hex2$4 = Hex$format_hex$(_size$2, Bits$to_hex_string$(_x$3));
        var $1286 = (_hex$1 + _hex2$4);
        return $1286;
    };
    const Hex$append = x0 => x1 => x2 => Hex$append$(x0, x1, x2);

    function Web$Kaelin$Event$Code$generate_hex$(_xs$1) {
        var $1287 = List$foldr$("", (_x$2 => _y$3 => {
            var $1288 = Hex$append$(_y$3, (BigInt(Pair$fst$(_x$2))), Pair$snd$(_x$2));
            return $1288;
        }), List$reverse$(_xs$1));
        return $1287;
    };
    const Web$Kaelin$Event$Code$generate_hex = x0 => Web$Kaelin$Event$Code$generate_hex$(x0);

    function generate_hex$(_xs$1, _ys$2) {
        var _consumer$3 = List$zip$(List$concat$(Web$Kaelin$Event$Code$action, _xs$1), _ys$2);
        var $1289 = ("0x" + Hex$set_min_length$(64n, Web$Kaelin$Event$Code$generate_hex$(_consumer$3)));
        return $1289;
    };
    const generate_hex = x0 => x1 => generate_hex$(x0, x1);
    const Web$Kaelin$Event$Code$create_hero = List$cons$(2, List$nil);

    function Parser$State$new$(_err$1, _nam$2, _ini$3, _idx$4, _str$5) {
        var $1290 = ({
            _: 'Parser.State.new',
            'err': _err$1,
            'nam': _nam$2,
            'ini': _ini$3,
            'idx': _idx$4,
            'str': _str$5
        });
        return $1290;
    };
    const Parser$State$new = x0 => x1 => x2 => x3 => x4 => Parser$State$new$(x0, x1, x2, x3, x4);

    function Parser$run$(_parser$2, _code$3) {
        var self = _parser$2(Parser$State$new$(Maybe$none, "", 0n, 0n, _code$3));
        switch (self._) {
            case 'Parser.Reply.value':
                var $1292 = self.val;
                var $1293 = Maybe$some$($1292);
                var $1291 = $1293;
                break;
            case 'Parser.Reply.error':
                var $1294 = Maybe$none;
                var $1291 = $1294;
                break;
        };
        return $1291;
    };
    const Parser$run = x0 => x1 => Parser$run$(x0, x1);

    function Parser$Reply$(_V$1) {
        var $1295 = null;
        return $1295;
    };
    const Parser$Reply = x0 => Parser$Reply$(x0);

    function Parser$Reply$value$(_pst$2, _val$3) {
        var $1296 = ({
            _: 'Parser.Reply.value',
            'pst': _pst$2,
            'val': _val$3
        });
        return $1296;
    };
    const Parser$Reply$value = x0 => x1 => Parser$Reply$value$(x0, x1);

    function Parser$maybe$(_parse$2, _pst$3) {
        var self = _pst$3;
        switch (self._) {
            case 'Parser.State.new':
                var self = _parse$2(_pst$3);
                switch (self._) {
                    case 'Parser.Reply.value':
                        var $1299 = self.pst;
                        var $1300 = self.val;
                        var $1301 = Parser$Reply$value$($1299, Maybe$some$($1300));
                        var $1298 = $1301;
                        break;
                    case 'Parser.Reply.error':
                        var $1302 = Parser$Reply$value$(_pst$3, Maybe$none);
                        var $1298 = $1302;
                        break;
                };
                var $1297 = $1298;
                break;
        };
        return $1297;
    };
    const Parser$maybe = x0 => x1 => Parser$maybe$(x0, x1);

    function Parser$Reply$error$(_err$2) {
        var $1303 = ({
            _: 'Parser.Reply.error',
            'err': _err$2
        });
        return $1303;
    };
    const Parser$Reply$error = x0 => Parser$Reply$error$(x0);

    function Parser$Error$new$(_nam$1, _ini$2, _idx$3, _msg$4) {
        var $1304 = ({
            _: 'Parser.Error.new',
            'nam': _nam$1,
            'ini': _ini$2,
            'idx': _idx$3,
            'msg': _msg$4
        });
        return $1304;
    };
    const Parser$Error$new = x0 => x1 => x2 => x3 => Parser$Error$new$(x0, x1, x2, x3);

    function Parser$Reply$fail$(_nam$2, _ini$3, _idx$4, _msg$5) {
        var $1305 = Parser$Reply$error$(Parser$Error$new$(_nam$2, _ini$3, _idx$4, _msg$5));
        return $1305;
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
                        var $1306 = self.err;
                        var $1307 = self.nam;
                        var $1308 = self.ini;
                        var $1309 = self.idx;
                        var $1310 = self.str;
                        var self = _text$3;
                        if (self.length === 0) {
                            var $1312 = Parser$Reply$value$(_pst$4, Unit$new);
                            var $1311 = $1312;
                        } else {
                            var $1313 = self.charCodeAt(0);
                            var $1314 = self.slice(1);
                            var self = $1310;
                            if (self.length === 0) {
                                var _error_msg$12 = ("Expected \'" + (_ini_txt$2 + "\', found end of file."));
                                var $1316 = Parser$Reply$fail$($1307, $1308, _ini_idx$1, _error_msg$12);
                                var $1315 = $1316;
                            } else {
                                var $1317 = self.charCodeAt(0);
                                var $1318 = self.slice(1);
                                var self = ($1313 === $1317);
                                if (self) {
                                    var _pst$14 = Parser$State$new$($1306, $1307, $1308, Nat$succ$($1309), $1318);
                                    var $1320 = Parser$text$go$(_ini_idx$1, _ini_txt$2, $1314, _pst$14);
                                    var $1319 = $1320;
                                } else {
                                    var _chr$14 = String$cons$($1317, String$nil);
                                    var _err$15 = ("Expected \'" + (_ini_txt$2 + ("\', found \'" + (_chr$14 + "\'."))));
                                    var $1321 = Parser$Reply$fail$($1307, $1308, _ini_idx$1, _err$15);
                                    var $1319 = $1321;
                                };
                                var $1315 = $1319;
                            };
                            var $1311 = $1315;
                        };
                        return $1311;
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
                var $1323 = self.idx;
                var self = Parser$text$go$($1323, _text$1, _text$1, _pst$2);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $1325 = self.err;
                        var $1326 = Parser$Reply$error$($1325);
                        var $1324 = $1326;
                        break;
                    case 'Parser.Reply.value':
                        var $1327 = self.pst;
                        var $1328 = self.val;
                        var $1329 = Parser$Reply$value$($1327, $1328);
                        var $1324 = $1329;
                        break;
                };
                var $1322 = $1324;
                break;
        };
        return $1322;
    };
    const Parser$text = x0 => x1 => Parser$text$(x0, x1);

    function Parser$Error$combine$(_a$1, _b$2) {
        var self = _a$1;
        switch (self._) {
            case 'Parser.Error.new':
                var $1331 = self.idx;
                var self = _b$2;
                switch (self._) {
                    case 'Parser.Error.new':
                        var $1333 = self.idx;
                        var self = ($1331 > $1333);
                        if (self) {
                            var $1335 = _a$1;
                            var $1334 = $1335;
                        } else {
                            var $1336 = _b$2;
                            var $1334 = $1336;
                        };
                        var $1332 = $1334;
                        break;
                };
                var $1330 = $1332;
                break;
        };
        return $1330;
    };
    const Parser$Error$combine = x0 => x1 => Parser$Error$combine$(x0, x1);

    function Parser$Error$maybe_combine$(_a$1, _b$2) {
        var self = _a$1;
        switch (self._) {
            case 'Maybe.some':
                var $1338 = self.value;
                var self = _b$2;
                switch (self._) {
                    case 'Maybe.some':
                        var $1340 = self.value;
                        var $1341 = Maybe$some$(Parser$Error$combine$($1338, $1340));
                        var $1339 = $1341;
                        break;
                    case 'Maybe.none':
                        var $1342 = _a$1;
                        var $1339 = $1342;
                        break;
                };
                var $1337 = $1339;
                break;
            case 'Maybe.none':
                var self = _b$2;
                switch (self._) {
                    case 'Maybe.none':
                        var $1344 = Maybe$none;
                        var $1343 = $1344;
                        break;
                    case 'Maybe.some':
                        var $1345 = _b$2;
                        var $1343 = $1345;
                        break;
                };
                var $1337 = $1343;
                break;
        };
        return $1337;
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
                                var $1347 = self.pst;
                                var $1348 = self.val;
                                var $1349 = Parser$many$go$(_parse$2, (_xs$12 => {
                                    var $1350 = _values$3(List$cons$($1348, _xs$12));
                                    return $1350;
                                }), $1347);
                                var $1346 = $1349;
                                break;
                            case 'Parser.Reply.error':
                                var $1351 = Parser$Reply$value$(_pst$4, _values$3(List$nil));
                                var $1346 = $1351;
                                break;
                        };
                        return $1346;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Parser$many$go = x0 => x1 => x2 => Parser$many$go$(x0, x1, x2);

    function Parser$many$(_parser$2) {
        var $1352 = Parser$many$go(_parser$2)((_x$3 => {
            var $1353 = _x$3;
            return $1353;
        }));
        return $1352;
    };
    const Parser$many = x0 => Parser$many$(x0);

    function Parser$many1$(_parser$2, _pst$3) {
        var self = _pst$3;
        switch (self._) {
            case 'Parser.State.new':
                var $1355 = self.err;
                var _reply$9 = _parser$2(_pst$3);
                var self = _reply$9;
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $1357 = self.err;
                        var self = $1355;
                        switch (self._) {
                            case 'Maybe.some':
                                var $1359 = self.value;
                                var $1360 = Parser$Reply$error$(Parser$Error$combine$($1359, $1357));
                                var $1358 = $1360;
                                break;
                            case 'Maybe.none':
                                var $1361 = Parser$Reply$error$($1357);
                                var $1358 = $1361;
                                break;
                        };
                        var $1356 = $1358;
                        break;
                    case 'Parser.Reply.value':
                        var $1362 = self.pst;
                        var $1363 = self.val;
                        var self = $1362;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $1365 = self.err;
                                var $1366 = self.nam;
                                var $1367 = self.ini;
                                var $1368 = self.idx;
                                var $1369 = self.str;
                                var _reply$pst$17 = Parser$State$new$(Parser$Error$maybe_combine$($1355, $1365), $1366, $1367, $1368, $1369);
                                var self = _reply$pst$17;
                                switch (self._) {
                                    case 'Parser.State.new':
                                        var $1371 = self.err;
                                        var _reply$23 = Parser$many$(_parser$2)(_reply$pst$17);
                                        var self = _reply$23;
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $1373 = self.err;
                                                var self = $1371;
                                                switch (self._) {
                                                    case 'Maybe.some':
                                                        var $1375 = self.value;
                                                        var $1376 = Parser$Reply$error$(Parser$Error$combine$($1375, $1373));
                                                        var $1374 = $1376;
                                                        break;
                                                    case 'Maybe.none':
                                                        var $1377 = Parser$Reply$error$($1373);
                                                        var $1374 = $1377;
                                                        break;
                                                };
                                                var $1372 = $1374;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $1378 = self.pst;
                                                var $1379 = self.val;
                                                var self = $1378;
                                                switch (self._) {
                                                    case 'Parser.State.new':
                                                        var $1381 = self.err;
                                                        var $1382 = self.nam;
                                                        var $1383 = self.ini;
                                                        var $1384 = self.idx;
                                                        var $1385 = self.str;
                                                        var _reply$pst$31 = Parser$State$new$(Parser$Error$maybe_combine$($1371, $1381), $1382, $1383, $1384, $1385);
                                                        var $1386 = Parser$Reply$value$(_reply$pst$31, List$cons$($1363, $1379));
                                                        var $1380 = $1386;
                                                        break;
                                                };
                                                var $1372 = $1380;
                                                break;
                                        };
                                        var $1370 = $1372;
                                        break;
                                };
                                var $1364 = $1370;
                                break;
                        };
                        var $1356 = $1364;
                        break;
                };
                var $1354 = $1356;
                break;
        };
        return $1354;
    };
    const Parser$many1 = x0 => x1 => Parser$many1$(x0, x1);

    function Parser$hex_digit$(_pst$1) {
        var self = _pst$1;
        switch (self._) {
            case 'Parser.State.new':
                var $1388 = self.err;
                var $1389 = self.nam;
                var $1390 = self.ini;
                var $1391 = self.idx;
                var $1392 = self.str;
                var self = $1392;
                if (self.length === 0) {
                    var $1394 = Parser$Reply$fail$($1389, $1390, $1391, "Not a digit.");
                    var $1393 = $1394;
                } else {
                    var $1395 = self.charCodeAt(0);
                    var $1396 = self.slice(1);
                    var _pst$9 = Parser$State$new$($1388, $1389, $1390, Nat$succ$($1391), $1396);
                    var self = ($1395 === 48);
                    if (self) {
                        var $1398 = Parser$Reply$value$(_pst$9, 0n);
                        var $1397 = $1398;
                    } else {
                        var self = ($1395 === 49);
                        if (self) {
                            var $1400 = Parser$Reply$value$(_pst$9, 1n);
                            var $1399 = $1400;
                        } else {
                            var self = ($1395 === 50);
                            if (self) {
                                var $1402 = Parser$Reply$value$(_pst$9, 2n);
                                var $1401 = $1402;
                            } else {
                                var self = ($1395 === 51);
                                if (self) {
                                    var $1404 = Parser$Reply$value$(_pst$9, 3n);
                                    var $1403 = $1404;
                                } else {
                                    var self = ($1395 === 52);
                                    if (self) {
                                        var $1406 = Parser$Reply$value$(_pst$9, 4n);
                                        var $1405 = $1406;
                                    } else {
                                        var self = ($1395 === 53);
                                        if (self) {
                                            var $1408 = Parser$Reply$value$(_pst$9, 5n);
                                            var $1407 = $1408;
                                        } else {
                                            var self = ($1395 === 54);
                                            if (self) {
                                                var $1410 = Parser$Reply$value$(_pst$9, 6n);
                                                var $1409 = $1410;
                                            } else {
                                                var self = ($1395 === 55);
                                                if (self) {
                                                    var $1412 = Parser$Reply$value$(_pst$9, 7n);
                                                    var $1411 = $1412;
                                                } else {
                                                    var self = ($1395 === 56);
                                                    if (self) {
                                                        var $1414 = Parser$Reply$value$(_pst$9, 8n);
                                                        var $1413 = $1414;
                                                    } else {
                                                        var self = ($1395 === 57);
                                                        if (self) {
                                                            var $1416 = Parser$Reply$value$(_pst$9, 9n);
                                                            var $1415 = $1416;
                                                        } else {
                                                            var self = ($1395 === 97);
                                                            if (self) {
                                                                var $1418 = Parser$Reply$value$(_pst$9, 10n);
                                                                var $1417 = $1418;
                                                            } else {
                                                                var self = ($1395 === 98);
                                                                if (self) {
                                                                    var $1420 = Parser$Reply$value$(_pst$9, 11n);
                                                                    var $1419 = $1420;
                                                                } else {
                                                                    var self = ($1395 === 99);
                                                                    if (self) {
                                                                        var $1422 = Parser$Reply$value$(_pst$9, 12n);
                                                                        var $1421 = $1422;
                                                                    } else {
                                                                        var self = ($1395 === 100);
                                                                        if (self) {
                                                                            var $1424 = Parser$Reply$value$(_pst$9, 13n);
                                                                            var $1423 = $1424;
                                                                        } else {
                                                                            var self = ($1395 === 101);
                                                                            if (self) {
                                                                                var $1426 = Parser$Reply$value$(_pst$9, 14n);
                                                                                var $1425 = $1426;
                                                                            } else {
                                                                                var self = ($1395 === 102);
                                                                                if (self) {
                                                                                    var $1428 = Parser$Reply$value$(_pst$9, 15n);
                                                                                    var $1427 = $1428;
                                                                                } else {
                                                                                    var self = ($1395 === 65);
                                                                                    if (self) {
                                                                                        var $1430 = Parser$Reply$value$(_pst$9, 10n);
                                                                                        var $1429 = $1430;
                                                                                    } else {
                                                                                        var self = ($1395 === 66);
                                                                                        if (self) {
                                                                                            var $1432 = Parser$Reply$value$(_pst$9, 11n);
                                                                                            var $1431 = $1432;
                                                                                        } else {
                                                                                            var self = ($1395 === 67);
                                                                                            if (self) {
                                                                                                var $1434 = Parser$Reply$value$(_pst$9, 12n);
                                                                                                var $1433 = $1434;
                                                                                            } else {
                                                                                                var self = ($1395 === 68);
                                                                                                if (self) {
                                                                                                    var $1436 = Parser$Reply$value$(_pst$9, 13n);
                                                                                                    var $1435 = $1436;
                                                                                                } else {
                                                                                                    var self = ($1395 === 69);
                                                                                                    if (self) {
                                                                                                        var $1438 = Parser$Reply$value$(_pst$9, 14n);
                                                                                                        var $1437 = $1438;
                                                                                                    } else {
                                                                                                        var self = ($1395 === 70);
                                                                                                        if (self) {
                                                                                                            var $1440 = Parser$Reply$value$(_pst$9, 15n);
                                                                                                            var $1439 = $1440;
                                                                                                        } else {
                                                                                                            var $1441 = Parser$Reply$fail$($1389, $1390, $1391, "Not a digit.");
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
                                                        var $1413 = $1415;
                                                    };
                                                    var $1411 = $1413;
                                                };
                                                var $1409 = $1411;
                                            };
                                            var $1407 = $1409;
                                        };
                                        var $1405 = $1407;
                                    };
                                    var $1403 = $1405;
                                };
                                var $1401 = $1403;
                            };
                            var $1399 = $1401;
                        };
                        var $1397 = $1399;
                    };
                    var $1393 = $1397;
                };
                var $1387 = $1393;
                break;
        };
        return $1387;
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
                        var $1442 = self.head;
                        var $1443 = self.tail;
                        var $1444 = Nat$from_base$go$(_b$1, $1443, (_b$1 * _p$3), (($1442 * _p$3) + _res$4));
                        return $1444;
                    case 'List.nil':
                        var $1445 = _res$4;
                        return $1445;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Nat$from_base$go = x0 => x1 => x2 => x3 => Nat$from_base$go$(x0, x1, x2, x3);

    function Nat$from_base$(_base$1, _ds$2) {
        var $1446 = Nat$from_base$go$(_base$1, List$reverse$(_ds$2), 1n, 0n);
        return $1446;
    };
    const Nat$from_base = x0 => x1 => Nat$from_base$(x0, x1);

    function Parser$hex_nat$(_pst$1) {
        var self = _pst$1;
        switch (self._) {
            case 'Parser.State.new':
                var $1448 = self.err;
                var _reply$7 = Parser$maybe$(Parser$text("0x"), _pst$1);
                var self = _reply$7;
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $1450 = self.err;
                        var self = $1448;
                        switch (self._) {
                            case 'Maybe.some':
                                var $1452 = self.value;
                                var $1453 = Parser$Reply$error$(Parser$Error$combine$($1452, $1450));
                                var $1451 = $1453;
                                break;
                            case 'Maybe.none':
                                var $1454 = Parser$Reply$error$($1450);
                                var $1451 = $1454;
                                break;
                        };
                        var $1449 = $1451;
                        break;
                    case 'Parser.Reply.value':
                        var $1455 = self.pst;
                        var self = $1455;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $1457 = self.err;
                                var $1458 = self.nam;
                                var $1459 = self.ini;
                                var $1460 = self.idx;
                                var $1461 = self.str;
                                var _reply$pst$15 = Parser$State$new$(Parser$Error$maybe_combine$($1448, $1457), $1458, $1459, $1460, $1461);
                                var self = _reply$pst$15;
                                switch (self._) {
                                    case 'Parser.State.new':
                                        var $1463 = self.err;
                                        var _reply$21 = Parser$many1$(Parser$hex_digit, _reply$pst$15);
                                        var self = _reply$21;
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $1465 = self.err;
                                                var self = $1463;
                                                switch (self._) {
                                                    case 'Maybe.some':
                                                        var $1467 = self.value;
                                                        var $1468 = Parser$Reply$error$(Parser$Error$combine$($1467, $1465));
                                                        var $1466 = $1468;
                                                        break;
                                                    case 'Maybe.none':
                                                        var $1469 = Parser$Reply$error$($1465);
                                                        var $1466 = $1469;
                                                        break;
                                                };
                                                var $1464 = $1466;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $1470 = self.pst;
                                                var $1471 = self.val;
                                                var self = $1470;
                                                switch (self._) {
                                                    case 'Parser.State.new':
                                                        var $1473 = self.err;
                                                        var $1474 = self.nam;
                                                        var $1475 = self.ini;
                                                        var $1476 = self.idx;
                                                        var $1477 = self.str;
                                                        var _reply$pst$29 = Parser$State$new$(Parser$Error$maybe_combine$($1463, $1473), $1474, $1475, $1476, $1477);
                                                        var $1478 = Parser$Reply$value$(_reply$pst$29, Nat$from_base$(16n, $1471));
                                                        var $1472 = $1478;
                                                        break;
                                                };
                                                var $1464 = $1472;
                                                break;
                                        };
                                        var $1462 = $1464;
                                        break;
                                };
                                var $1456 = $1462;
                                break;
                        };
                        var $1449 = $1456;
                        break;
                };
                var $1447 = $1449;
                break;
        };
        return $1447;
    };
    const Parser$hex_nat = x0 => Parser$hex_nat$(x0);

    function Hex$to_nat$(_x$1) {
        var self = Parser$run$(Parser$hex_nat, _x$1);
        switch (self._) {
            case 'Maybe.some':
                var $1480 = self.value;
                var $1481 = $1480;
                var $1479 = $1481;
                break;
            case 'Maybe.none':
                var $1482 = 0n;
                var $1479 = $1482;
                break;
        };
        return $1479;
    };
    const Hex$to_nat = x0 => Hex$to_nat$(x0);

    function Web$Kaelin$Resources$Action$to_bits$(_x$1) {
        var self = _x$1;
        switch (self._) {
            case 'Web.Kaelin.Action.walk':
                var $1484 = 0n;
                var _n$2 = $1484;
                break;
            case 'Web.Kaelin.Action.ability_0':
                var $1485 = 1n;
                var _n$2 = $1485;
                break;
            case 'Web.Kaelin.Action.ability_1':
                var $1486 = 2n;
                var _n$2 = $1486;
                break;
        };
        var $1483 = (nat_to_bits(_n$2));
        return $1483;
    };
    const Web$Kaelin$Resources$Action$to_bits = x0 => Web$Kaelin$Resources$Action$to_bits$(x0);

    function Web$Kaelin$Coord$Convert$axial_to_bits$(_x$1) {
        var _unique_nat$2 = Web$Kaelin$Coord$Convert$axial_to_nat$(_x$1);
        var $1487 = (nat_to_bits(_unique_nat$2));
        return $1487;
    };
    const Web$Kaelin$Coord$Convert$axial_to_bits = x0 => Web$Kaelin$Coord$Convert$axial_to_bits$(x0);
    const Web$Kaelin$Event$Code$user_input = List$cons$(40, List$cons$(2, List$cons$(8, List$nil)));

    function Web$Kaelin$Event$serialize$(_event$1) {
        var self = _event$1;
        switch (self._) {
            case 'Web.Kaelin.Event.create_hero':
                var $1489 = self.hero_id;
                var _cod$3 = List$cons$((nat_to_bits(1n)), List$cons$((nat_to_bits((BigInt($1489)))), List$nil));
                var $1490 = generate_hex$(Web$Kaelin$Event$Code$create_hero, _cod$3);
                var $1488 = $1490;
                break;
            case 'Web.Kaelin.Event.user_input':
                var $1491 = self.player;
                var $1492 = self.coord;
                var $1493 = self.action;
                var _cod$5 = List$cons$((nat_to_bits(4n)), List$cons$((nat_to_bits(Hex$to_nat$($1491))), List$cons$(Web$Kaelin$Resources$Action$to_bits$($1493), List$cons$(Web$Kaelin$Coord$Convert$axial_to_bits$($1492), List$nil))));
                var $1494 = generate_hex$(Web$Kaelin$Event$Code$user_input, _cod$5);
                var $1488 = $1494;
                break;
            case 'Web.Kaelin.Event.start_game':
            case 'Web.Kaelin.Event.create_user':
                var $1495 = "";
                var $1488 = $1495;
                break;
        };
        return $1488;
    };
    const Web$Kaelin$Event$serialize = x0 => Web$Kaelin$Event$serialize$(x0);

    function Web$Kaelin$Event$user_input$(_player$1, _coord$2, _action$3) {
        var $1496 = ({
            _: 'Web.Kaelin.Event.user_input',
            'player': _player$1,
            'coord': _coord$2,
            'action': _action$3
        });
        return $1496;
    };
    const Web$Kaelin$Event$user_input = x0 => x1 => x2 => Web$Kaelin$Event$user_input$(x0, x1, x2);
    const Web$Kaelin$Action$walk = ({
        _: 'Web.Kaelin.Action.walk'
    });

    function App$post$(_room$1, _data$2) {
        var $1497 = App$do$("post", (_room$1 + (";" + _data$2)));
        return $1497;
    };
    const App$post = x0 => x1 => App$post$(x0, x1);

    function Web$Kaelin$Map$Entity$animation$(_value$1) {
        var $1498 = ({
            _: 'Web.Kaelin.Map.Entity.animation',
            'value': _value$1
        });
        return $1498;
    };
    const Web$Kaelin$Map$Entity$animation = x0 => Web$Kaelin$Map$Entity$animation$(x0);

    function Web$Kaelin$Animation$new$(_fps$1, _sprite$2) {
        var $1499 = ({
            _: 'Web.Kaelin.Animation.new',
            'fps': _fps$1,
            'sprite': _sprite$2
        });
        return $1499;
    };
    const Web$Kaelin$Animation$new = x0 => x1 => Web$Kaelin$Animation$new$(x0, x1);

    function Web$Kaelin$Sprite$new$(_frame_info$1, _voxboxes$2) {
        var $1500 = ({
            _: 'Web.Kaelin.Sprite.new',
            'frame_info': _frame_info$1,
            'voxboxes': _voxboxes$2
        });
        return $1500;
    };
    const Web$Kaelin$Sprite$new = x0 => x1 => Web$Kaelin$Sprite$new$(x0, x1);
    const Web$Kaelin$Assets$effects$fire_1 = VoxBox$parse$("100002b35229100102b95425110102b55328120102be5b2a0f0202b35229100202b55328110202c65b24120202d76c2b0f0302b35229100302c15923110302d66328120302bd64361303029b7256140302b1552f0f0402b15931100402c6632e110402bd6335130402a96342140402b85629150402ba55250e05029d74640f05029e7361100502b45d32110502bc5725120502b36036130502c25a22140502e071290d06029f73620e06029e6f5b0f0602af6243100602b45228110602cf6023120602d96829130602c8642d0d0702b862350e0702d165250f0702bc582a110702b55329120702d1612a130702ca642c160702997c6b0c0802c8642c0d0802d566290e0802ce5f2a0f0802a86f66100802a5736d120802bf5b2a130802b4572f1408029a7b611508029b7968160802997c6b0c0902be5c2b0d0902cd602a0e0902ba5528110902ab6640120902a17458130902aa846c140902a36d50150902b8572c160902ba55250c0a02b352290d0a02b452280e0a02c5581a0f0a02c74e14110a02aa6a3d120a02b16742130a02a47256140a02c35c29150a02e2722a160a02b452280d0b02c5571f0e0b02e58d220f0b02db6718100b02c54c13110b02c7531a120b02cd6227130b02aa6946140b02c65b27150b02d76327160b02b654290c0c02b9633d0d0c02db6d1f0e0c02f7a8280f0c02d2671d100c02cf4f16110c02cd5417120c02ee8b26130c02a76544140c02b55229150c02ce6024160c02b754280a0d02a4746c0b0d029f776c0c0d02bb6a420d0d02f7a9280e0d02eb811a0f0d02c5561f100d02de5717110d02e5661a120d02d98235130d029f7763150d02b35229160d02b35229090e029980600a0e02a079670b0e029c7d5f0c0e02de63200d0e02f9ae2d0e0e02e15e190f0e02de5417100e02e7721a110e02ed771c120e02f39a28130e02e26118090f029980600a0f02a178640b0f02a968500c0f02d9622b0d0f02f2a0210e0f02f391230f0f02ea721d100f02f6ad2d110f02e07921120f02f0911a130f02f29f20140f02e05e170910029f7a670a10029d7c5d0b1002b25c350c1002c6844b0d1002dd631f0e1002f8af270f1002fbad31101002f09624111002df5e1a121002ed781c131002f8b128141002e1621b1510029d7d5d161002998060091102a5736d0a1102a671690b1102d6712a0c1102e17e250d1102b963440e1102f3a8320f1102fccd40101102edb247111102e58432121102f5ad3b131102f6af2c141102cd6938151102c45721161102c54f1b0a1202a76f670b1202cd5e2b0c1202f9ad320d1202e495360e1202fac13f0f1202fcc74a101202f8ac4a111202f7c34b121202f6a13a131202f08a21141202e16d1f151202ef9321161202c950140a13029b63460b1302ba5a310c1302e9a1370d1302f3a13e0e1302efae500f1302f7a853101302fbd37b111302fbca5e121302f6aa48131302ed751b141302f8941e151302f9a329161302ce58150714029d75650814029d75650a1402aa63500b1402c371340c1402d47c370d1402f9b85a0e1402e99f680f1402ea9f65101402fcd68f111402fccb7e121402fda342131402f4862d141402f5a220151402e57319161402a6682b171402ae68290715029d75650a1502b5672a0b1502c570270c1502ec7f250d1502f2a03f0e1502eca6780f1502f9d8aa101502fbe2c1111502fceaba121502fcd185131502fbae4f141502fba22d151502f47f1f161502c16f20171502b56727081602a175450916029a70450a1602a666360b1602c166200c1602f6972c0d1602f9ad520e1602f5b1840f1602fae1c5101602fcf3e5111602fbf1d6121602fde2b3131602fda764141602f8ab4a151602f6982c161602c1651f171602a85f26081702a1764e0917029f72530a1702a467540b1702c85f320c1702f68e3d0d1702f8c7610e1702f9c48f0f1702f9e8d4101702fdf8f2111702fcf3df121702fde5bf131702f8b076141702f8c661151702f68e3d161702d1581d171702b66323181702a0692c0818029b7256091802a374530a1802a46b4d0b1802ad6b510c1802dc6b340d1802eea1530e1802f3b7850f1802f5ddb9101802fbe9d3111802fbeecc121802fbdab1131802ecb069141802eda74f151802df6b2c161802b45f1e171802ad66261818029b73140919028055260a19028656320b19027e5a370c19029774450d19029f755c0e1902bc927a0f1902c39f7f101902dbb598111902f7ca89121902d2a876131902daa861141902ae874b151902874929161902a95920171902ae6f161819029b7410091a027952230a1a028e642b0b1a025a4d360c1a02785d350d1a025e59400e1a028a71540f1a02927451101a02ad9671111a02a28263121a029e8858131a026b5444141a0286744a151a02886434161a028c6217171a02a672110a1b027c51290b1b0267462e0c1b02623f1f0d1b02794f280e1b025b56310f1b027e6a4a101b027a6f52111b02746240121b0281724c131b026b5533141b02895b2c151b02784d21161b02694e130a1c028350300b1c0264442e0c1c028d491a0d1c027340200e1c028357290f1c02706144101c028f5f2a111c026a4a27121c02926d36131c026f4d28141c0284551b151c028a571b161c026f4f190d1d02824c1c0e1d02895a1d0f1d02916f35101d028b5521111d02523823121d029b6f2d");
    const Web$Kaelin$Assets$effects$fire_2 = VoxBox$parse$("0f0002b352290e0102b352290f0102c05823100102d15d1e0f0202ba5626100202be5f2d110202ae60390d0302b65e350e0302db541b0f0302ae5f38100302ae5f380c0402de53170d0402de55190e0402d7561b110402a16f51120402b3552e0c0502e25d180d0502f0851a0e0502c85a1a1005029b7256110502bc6f44120502c45e271405029a7b6b1505029a7b6b0b0602e059180c0602f391230d0602f296210e0602cc54141006029b7256110602ab6443120602b55429140602a4746d150602c46650160602de54180b0702e05e170c0702f7a8210d0702ea731a0e0702dc5217150702d56021160702de621a170702bf57210b0802e05c170c0802f398210d0802e375190e0802dd53170f0802c54c13100802c54c13150802e76c29160802ca5e25170802b452290b0902de53170c0902e9791c0d0902ec8e2a0e0902df55170f0902d65116100902d35115110902c94e14140902dc6627150902d96529160902b553290c0a02de53170d0a02de53170e0a02de53170f0a02de5317100a02e86b1a110a02db6317120a02c54c13140a02bf5827150a02b56045160a02b8562a0a0b029980600e0b02e35e220f0b02e2601d100b02f49b28110b02e2741b120b02c54c13130b02de5317140b02cf5624150b029e7565160b029d75650a0c029a7f610b0c02a4746c0e0c02e05e170f0c02f19e20100c02f1921a110c02cf5915120c02de5517130c02e86b19140c02e05918090d02a5736d0a0d02ab6e650b0d02da56250d0d02df56170e0d02ea731b0f0d02f8b026100d02ec751a110d02e25c18120d02ec821a130d02f7a320140d02e05e17150d02de5317160d02de5317090e02c7501e0a0e02d55e250b0e02e66d1f0c0e02b067400d0e02e15d180e0e02f49e220f0e02f79c20100e02e86a1a110e02f28b1c120e02f9b226130e02f38c1c140e02df631a150e02d25920160e02d55d23080f02c54c13090f02d256190a0f02f9811e0b0f02fabb3c0c0f02f490210d0f02ed831d0e0f02fabf3c0f0f02ed7c20100f02f7a11a110f02f8b327120f02faae28130f02ec741b140f02d3591b150f02e16d1f160f02be5c29081002c54c13091002c84e150a1002ea962b0b1002f4a2300c1002d563210d1002ee8f240e1002f9b63a0f1002ec8c19101002fab72b111002ed8619121002f8aa2a131002dc7423141002d55d1a151002eb9a2b161002ba5f2a091102ab56390a1102d98e330b1102f09c250c1102bc6c3d0d1102ed96290e1102faa8280f1102f89e21101102f39921111102ee8025121102f6b236131102bd6128141102e97a1f151102f8aa29161102d17625171102b35229091202e0601e0a1202ea94350b1202f7ba380c1202f797260d1202dc7a2f0e1202ef9d400f1202fbce59101202ec8331111202e67d29121202f69d2b131202c35a26141202f18321151202f18f1f161202c75924171202b35229091302cd5f280a1302d9772e0b1302f4af370c1302fbb6330d1302f496290e1302ea85250f1302f4aa4b101302f8a442111302ed902b121302df6f1f131302e17621141302e98323151302ce5921161302b452290614029d75650714029d7565091402ba5b1e0a1402c561250b1402e98e260c1402ef9d400d1402fbbe5b0e1402fc9f3a0f1402f49642101402fcd9b8111402f99440121402f18426131402f69335141402f1811e151402dd5819161402a966290715029d7565091502bf601e0a1502df62180b1502f4881c0c1502ee97310d1502f4ab560e1502fdbd6e0f1502fbd09d101502fbcc9d111502fbbf78121502feb45b131502fca440141502f58723151502eb7217161502ce5b1b171502bc611e0816029b7145091602bd6a210a1602e37f200b1602fda5410c1602fba64f0d1602f4ab720e1602f7c6a40f1602fcebd4101602fce7d0111602fce5bd121602fec48a131602f99c45141602f78f2b151602faa43c161602c6631d171602bd6c1f071702a1764e081702a1754e091702b365400a1702d95d200b1702f599360c1702f9c9660d1702fbb2760e1702f6d2b50f1702fcf0e2101702fcf6ea111702fcf1d8121702fac692131702fabc6b141702fabb55151702e97724161702c75a1b171702a5682a0818029d7255091802a772510a1802ae66410b1802de77320c1802eca8500d1802ebaf6a0e1802f9cfa00f1802f6e3ca101802fbedd4111802fae9c6121802f6c085131802e7af5f141802ee9641151802c86221161802ad6022171802a66a210819027d5425091902895a2b0a19027c54370b190283613b0c1902a67c490d1902a881720e1902c69b820f1902c8ac8c101902f0c490111902e3b982121902dda467131902c39e5a1419028d663c1519029c4f26161902b76a18171902a070111819029a7510081a02795122091a027e56280a1a027f5e310b1a02755d350c1a02594d370d1a028773480e1a026c5c550f1a02bc9e68101a029d7865111a02ab9464121a026f6045131a0276604f141a02927739151a02835f29161a029e6911171a029c7510091b027d542c0a1b02764f270b1b025f3d2c0c1b026947220d1b0274522b0e1b0255533a0f1b02937e52101b0265614a111b027e6844121b02786c45131b0276512f141b02895b24151b026f4b1b161b02684f110a1c02774d2a0b1c027341290c1c0285431d0d1c027245220e1c02805e310f1c027e6142101c02855c26111c027e5a2a121c027e6139131c0282541d141c028a5219151c02815d1c0d1d0284511c0e1d028e65290f1d028b693c101d02754720111d02684823121d02b58435");
    const Web$Kaelin$Assets$effects$fire_3 = VoxBox$parse$("0c0002c54c130b0102c64c130c0102c74c130d0102c64c13100102c54c130b0202dd53170c0202e362190d0202d556160e0202c54c130f0202c74d13100202c64c13140202c54c13150202c54c130b0302de53170c0302ee7a1d0d0302e382200e0302cb4f140f0302e06218100302de5617140302bc4f20150302c64f160b0402dd53170c0402ec83220d0402d3681e0e0402c953150f0402f28d23100402e2641a140402b85529150402dc6424160402c84f150b0502c157200c0502ca571e0d0502c2561f0e0502c0521f0f0502ed8c23100502f28a1c110502e26517140502b65429150502d26923160502c0531f0b0602c057200c0602c057200e0602ba54240f0602cb5820100602f38f23110602ec8f21120602de5317130602de5317140602cb5321150602bf5721160602b452280e0702de53170f0702d25a18100702f29025110702ec932c120702de5317130702dc5418140702c75623150702b55228180702c057200a0802c54c130d0802bd58270e0802e566190f0802d95a1b100802ee9a29110802f1911a120802e05818130802c75e1f140802ed8d1b150802bd5b27180802c5581a190802c74e140a0902c64c130b0902c74d130d0902bb5e270e0902f5a4200f0902ec7617100902ec7e19110902e6701b120902de5317130902c25f25140902f7a828150902e5691a160902dd5317170902c5571f180902e58d22190902db67181a0902c54c130a0a02df59180b0a02e066190c0a02d878290d0a02dc6b210e0a02f8b82f0f0a02ef8e2a100a02f68e1c110a02e05918120a02de5317130a02e77e19140a02ec8f20150a02de5417160a02ca571e170a02db6d1f180a02f7a828190a02d2671d1a0a02bd4f1f090b02dc53180a0b02ec761e0b0b02fab4390c0b02ea721d0d0b02e05a190e0b02f3871d0f0b02f7b132100b02f9a12b110b02e15918120b02de5317130b02ed8d20140b02f17e1c150b02de5317160b02c76121170b02f7a928180b02eb811a190b02c4561f080c02de5317090c02db53190a0c02d05b220b0c02ef9b330c0c02f9b4390d0c02e15e190e0c02e25d180f0c02f39124100c02fbb02f110c02e96e1b120c02de5317130c02e86a19140c02e15d18160c02e0621b170c02f9ae2d180c02e15e19190c02de5317080d02de5317090d02df55170a0d02f19a2b0b0d02cf77250c0d02ed991c0d0d02e05f170e0d02cf4f150f0d02d95f13100d02faaf2a110d02f2951f120d02e05d17130d02cb5815140d02d05115150d02d35015160d02e05e17170d02f2a021180d02f39123190d02e05918090e02cb4f150a0e02e3701b0b0e02f3a4240c0e02f2a4270d0e02e05d170e0e02df57180f0e02f39e2c100e02fcc93d110e02f8a324120e02d95e17130e02e68d21140e02ec751b150e02de5317160e02de5317170e02e16217180e02f09c20190e02e0611a090f02df5c210a0f02e86d1b0b0f02fab5360c0f02ee932a0d0f02de53170e0f02e6752e0f0f02fac13f100f02f49826110f02faa328120f02f39822130f02f7a421140f02e96e19150f02df5517160f02df5517170f02dc5419180f02c05c26091002c84e150a1002d5601b0b1002fab9380c1002e987200d1002d8581b0e1002ed78190f1002fbb435101002e86c18111002ee8123121002f59f23131002f8921d141002e05918151002e96f1a161002eb7b19171002de53170a1102e46a130b1102f9a6250c1102eea32b0d1102d66c1b0e1102df59180f1102f58522101102ef852d111102f48c2f121102f49a2c131102ee781d141102f39024151102f9aa28161102ed761b171102de53170a1202e465100b1202ef9d330c1202f7ba380d1202f897240e1202d86c2b0f1202f38321101202ef7b32111202fab58d121202ef8832131202fbb12f141202f9b227151202f38c1c161202e05d180a1302c866350b1302c962300c1302eca4330d1302fbb6330e1302f999290f1302faa536101302f0a678111302fac194121302ef9a44131302f8a827141302e66c1a151302c75c1e161302d250150714029d75650814029d75650a1402c0673e0b1402ca5c350c1402e05f190d1402f49d3b0e1402fbbe5b0f1402fcb05b101402fccab1111402fbd9a5121402f0842b131402f8a624141402eb7c23151402e05c18161402de5519171402c2683d0815029d7565091502bc611e0a1502c8621f0b1502ea791f0c1502f98e240d1502f290300e1502f4ab560f1502fdba6b101502fbbf9a111502fcecdc121502fbc27e131502fdb755141502f59739151502f98e24161502eb791d171502c8621f181502bc611e0916029c6f430a1602b15e250b1602df73200c1602fbbb4e0d1602fa973b0e1602f4a9740f1602f7c5a2101602fce1c0111602fceddf121602fce6bd131602fec48a141602fa983d151602fbbb4e161602df7320171602b25d24181602a75f26081702a1764e091702a1754e0a1702b45f400b1702db5f230c1702faa5400d1702fbb4520e1702fabc840f1702f6d3b6101702fcf0e2111702fcf6ea121702fcf1d8131702fbc590141702fbad4e151702faa540161702de6122171702c6591b181702a5682a0918029d72550a1802a772510b1802b565460c1802db78320d1802f8bb580e1802f4b7740f1802f9cfa1101802f6e3ca111802fbedd4121802fae9c6131802fbbf7f141802e7a349151802e88339161802c86121171802ad6022181802a66a210919027d54250a1902895a2b0b19027c54370c190284603a0d1902b879420e1902a880720f1902c59a82101902c8ac8c111902f0c490121902e3b982131902dda467141902c39e5a1519028d663c1619029c4f26171902b76a18181902a070111919029a7510091a027951220a1a027e56280b1a027f5e310c1a02755d350d1a02594d370e1a028773480f1a026c5c55101a02bc9e68111a029d7865121a02ab9464131a026f6045141a0276604f151a02927739161a02835f29171a029e6911181a029c75100a1b027d542c0b1b02764f270c1b025f3d2c0d1b026947220e1b0274522b0f1b0255533a101b02937e52111b0265614a121b027e6844131b02786c45141b0276512f151b02895b24161b026f4b1b171b02684f110b1c02774d2a0c1c027341290d1c0285431d0e1c027245220f1c02805e31101c027e6142111c02855c26121c027e5a2a131c027e6139141c0282541d151c028a5219161c02815d1c0e1d0284511c0f1d028e6529101d028b693c111d02754720121d02684823131d02b58435");
    const Web$Kaelin$Assets$effects$fire_4 = VoxBox$parse$("0b0102c54c130c0102c54c13100102b55228110102b55228120102b35229140102c74d13150102c74d130a0202c74d130b0202c54c130c0202c74d130d0202c54c130f0202b75228100202c85a25110202db651f120202ca5321130202c74d13140202df6218150202de5617090302d250150a0302df62180b0302e96b1a0c0302d2531e0d0302b552280f0302dc5318100302ec8f29110302ed9129120302df5617130302c85014140302e66819150302df5617160302c54c13170302d35315180302df55170a0402e25d180b0402eb6f1a0c0402e3621a0d0402c856230e0402b552280f0402cb5321100402dd681e110402f6971c120402e36817130402c54c13140402d14f15160402c54c13170402e06919180402ed8b22190402e260180b0502de53170c0502e15e180d0502ef861c0e0502c857230f0502ba5227100502bd5326110502de6f20120502ef8d19130502e05d17170502df5a17180502f59e27190502ec801a1a0502de53170a0602de53170b0602df59170c0602e8821b0d0602f8be330e0602ec761d0f0602dd5318100602de5317110602b95528120602dd6b1f130602df5617160602de5317170602d95716180602f49a22190602e9781a1a0602de53170a0702de53170b0702e9731c0c0702f8ba350d0702f6a2280e0702e96c1a0f0702cf4f15100702d75116110702de5317120702dd5317130702dc5217160702de5317170702e5671b180702ed952a190702e05c180a0802e05c170b0802f7af2b0c0802fab9350d0802ea711c0e0802df56170f0802c95014100802e36219110802dd5317120802c74d13130802c64c13160802de5317170802de5317180802de53170a0902e05d170b0902f8b52f0c0902f08b1b0d0902cf51130e0902de53170f0902cf4f15100902dd5717110902c74d13120902df6218130902de56170a0a02df58170b0a02ea7b1b0c0a02f8b02f0d0a02e5691b0e0a02de53170f0a02db5216110a02ca5314120a02f28c23130a02e2641a0b0b02df58170c0b02e1621b0d0b02df57180e0b02dd53170f0b02c54c13110b02c0521f120b02ed8d22130b02f1921a140b02e265170e0c02cc4e140f0c02c54c13110c02ba5424120c02cb5c20130c02f7a621140c02ec9021150c02dd5317160c02c057200d0d02b352290e0d02bf4e1d0f0d02c54c13100d02c54c13120d02bc5828130d02f7a025140d02ec942b150d02c5561e160d02c057200c0e02cb53210d0e02c656230e0e02ca53210f0e02c54c13100e02c54c13120e02de5918130e02f89f22140e02eb8919150e02c84d14160e02c74d130b0f02cc58210c0f02e3701b0d0f02ef9a200e0f02e05e170f0f02d35015100f02cf4f15110f02df5817120f02e26a1a130f02f89d22140f02e16d19150f02de5617160f02e06218170f02cf51150b1002cf5c200c1002f8b2350d1002ef992a0e1002e25c160f1002e66414101002e46218111002f3821e121002f9aa27131002eb8a1e141002b85528151002e6681a161002f28d23171002ca58160b1102e15f190c1102fab9390d1102eb8b260e1102f8830b0f1102f28e12101102e4681e111102f8b127121102f7a31a131102ee7a20141102b9541f151102e05e19161102ec8a22171102c0531f0b1202e368180c1202faae2a0d1202e98f240e1202ee7b120f1202f9a41d101202ee7819111202fab632121202f89d1e131202f38b20141202c2541a151202c3571f161202cb571d171202ba54240a1302a163430b1302e467120c1302f9a6240d1302f2b5330e1302e36d180f1302f9b468101302f8a837111302f5a738121302fab145131302f8911c141302df5918151302c5561f161302c3571f0714029d75650a1402a85f450b1402e466190c1402eb821e0d1402f8b8380e1402ec90270f1402f7992e101402f9ca93111402f48f2f121402fcb043131402f8a726141402e96c1a151402e76615161402d25a1d0715029d75650815029d7565091502a76f2d0a1502c764240b1502fa9f230c1502e96f160d1502f2a3360e1502fab1510f1502ee7a17101502f8c793111502fbbe81121502f6963b131502fdaa4b141502eb731e151502fa9f23161502c86523171502ab6d2c0916029f67330a1602cf5a160b1602faac680c1602f6923a0d1602f091460e1602f4af760f1602fabc8e101602fcd4a5111602fcf0da121602fec77b131602fca95c141602f6933b151602faad68161602c86e1c171602ac6328081702a578460917029b70470a1702b960390b1702f4a03b0c1702fbca7e0d1702ef85460e1702f6bd8e0f1702fae6cd101702fbe9d8111702fcf4e6121702fde2ba131702fda262141702fbca7e151702f49236161702c2561c171702bc5b1b0818029c7355091802a1765a0a1802a96b540b1802f186260c1802fac05c0d1802f9bf5f0e1802facfa40f1802fae8d2101802fdf4e8111802fbf1d6121802fde4bb131802f99f50141802fabd5a151802f38320161802ca5d1e171802b26628181802a0692c091902a36d410a19029d65400b1902b26b480c1902bd82460d1902d5a2600e1902e9be900f1902e0c59e101902f2d5b9111902fae2ac121902eec497131902dea75c141902c98745151902c45b29161902b95d1e171902af6a1d1819029b7410091a027a52230a1a027553290b1a025c4c2e0c1a028770460d1a027f67500e1a02a585610f1a02ac8464101a02c39f7f111a02dda871121a02b39261131a02b68f5b141a02a69154151a025f4a33161a02865b1e171a02a77111181a029a7410091b027b552a0a1b029365290b1b026349330c1b027854240d1b027b5c380e1b0258593c0f1b027e6d4c101b02928565111b026c6357121b02968258131b025c4f36141b027f5d34151b02936326161b028b61120a1c0281502f0b1c0265442e0c1c02703f1e0d1c02623b220e1c02694c2b0f1c02796647101c02816436111c02816331121c027b663e131c026f4c2c141c02805026151c027b4e1f161c025c3e150c1d02934c190d1d027f4a1d0e1d028f5e240f1d027e673f101d028c5722111d02563b23121d029a6f2e131d0289622c141d02855618151d028d591a0e1e0286591b0f1e02967131");
    const Web$Kaelin$Assets$effects$fire_5 = VoxBox$parse$("0c0002c465500d0002a6736d100002b35229110002b955270b0102d2571c0c0102df5c1c0d0102ce6544100102b75427110102d0601a120102b560350b0202c058240c0202e56b1d0d0202d46123110202b35a31120202af5f38140202db541b150202b65e350b0302b452290c0302d161290d0302e36926110302c85a2c140302dc5418150302de5519160302de53170b0402b352290c0402bb55270d0402cd602c0e0402c05720100402ca4d14110402dd5317140402c95a1a150402f0851a160402e25d180c0502b365500d0502b4654f0e0502c057200f0502c54c13100502d96017110502df5617140502cc5414150502f29621160502f39123170502e059180f0602c54c13100602cf5115110602df5617140602dc5217150602ea731a160602f7a821170602e05e17100702c54c13140702dd5317150702e37519160702f39821170702e05c170e0802c54c13130802de5317140802df5517150802ec8e2a160802e9791c170802de53170d0902c850140e0902c84f140f0902c64c13130902de5317140902de5317150902de5317160902de53170c0a02c54c130d0a02da68170e0a02e363190f0a02dd5317140a02c54c13150a02c54c130c0b02c54c130d0b02e17b170e0b02d97b1a0f0b02c3571f130b02c54c13140b02c54c13160b02c54c13170b02c54c130c0c02c54c130d0c02e2731a0e0c02f196220f0c02ce5a1d100c02c05720130c02c64d15140c02c64c13160c02c54c13170c02c54c130c0d02dc52170d0d02cf59150e0d02f297210f0d02ed9125100d02c55d20120d02dc5919130d02dc731c140d02de5917160d02d25015170d02d35115180d02c94e140b0e02de53170c0e02dd53170d0e02cb561d0e0e02e0811c0f0e02f7b127100e02d4631e110e02c05b26120e02ef9625130e02f2a327140e02e05e17160e02d75116170e02e16519180e02db6317190e02c54c130b0f02dc571a0c0f02d55f1e0d0f02ca551b0e0f02d5631d0f0f02f7a928100f02e26119110f02df5d18120f02f9b93f130f02ee9026140f02d75116150f02d35015160f02df5917170f02f39927180f02e1731b190f02c44c140b1002bd5a270c1002ed8d1a0d1002cf5c1e0e1002e66c1b0f1002f8ae31101002ef8b1e111002ea731c121002fbc841131002f19a1f141002d25515151002d55615161002f09d1f171002f0911a181002c3561f191002b552280a1102b352290b1102d66d260c1102f9a9270d1102d574350e1102e67b1f0f1102f9a82f101102f5ab3c111102faa22c121102fbc73f131102fcca3e141102ec7b1d151102ec811d161102f8b227171102dc6e20181102b65228191102b352290a1202b352290b1202d66e260c1202f9a9250d1202f8a0230e1202f28a1b0f1202ef9524101202fbcc5b111202fac245121202fbe270131202f8aa2a141202e98a21151202faab35161202f8c036171202dd741c181202c35624191202b352290813029d75650a1302aa5e2b0b1302b756280c1302e8701c0d1302f7a5210e1302f7a1190f1302f48421101302fcc05f111302fbcc79121302f8cd71131302e58a35141302f4ab4d151302fba729161302f9b02b171302f79a30181302e0811f0814029d75650914029d75650a1402a76f2d0b1402b767280c1402e25b160d1402f07d1c0e1402faa02f0f1402fda646101402fdd086111402fdd89a121402fabd5e131402f3b67b141402fbb559151402faa634161402fbb04a171402f59834181402dd7b230a1502a2652f0b1502c65c1b0c1502f5942e0d1502f484210e1502f99e410f1502febe75101502fcdca5111502fbecd7121502fce2bf131502f6c296141502f4a463151502fdac51161502faa944171502c66321181502ac6328091602a578460a1602a070430b1602be64300c1602f496330d1602fbb04b0e1602faa9580f1602fec591101602fcefd4111602fcf3e9121602fbecd7131602f8cfb0141602f8af74151602fab556161602f59939171602c36023181602bb5e1d0917029c73550a1702a1724f0b1702b664440c1702da66210d1702f9ae460e1702fac16f0f1702f6c58e101702fbefd0111702fcf3e3121702fcf0e0131702f8d0ad141702f8b375151702f9c25e161702ee882d171702c95d22181702b16628191702a0692c0a1802a36d410b1802a062360c1802ab63350d1802be76410e1802bd8c550f1802e7af8a101802e5cba8111802f2d8b9121802f5d8a8131802edc48d141802dea85f151802c98845161802bd5e2d171802b66135181802af6a1d1918029b74100a19027a52230b19027553290c19025c4c2e0d19028770460e19027f67500f1902a58561101902ac8464111902c39f7f121902dda871131902b39261141902b68f5b151902a691541619025f4a33171902865b1e181902a771111919029a74100a1a027b552a0b1a029365290c1a026349330d1a027854240e1a027b5c380f1a0258593c101a027e6d4c111a02928565121a026c6357131a02968258141a025c4f36151a027f5d34161a02936326171a028b61120b1b0281502f0c1b0265442e0d1b02703f1e0e1b02623b220f1b02694c2b101b02796647111b02816436121b02816331131b027b663e141b026f4c2c151b02805026161b027b4e1f171b025c3e150d1c02934c190e1c027f4a1d0f1c028f5e24101c027e673f111c028c5722121c02563b23131c029a6f2e141c0289622c151c02855618161c028d591a0f1d0286591b101d02967131");
    const Web$Kaelin$Sprite$fire = Web$Kaelin$Sprite$new$((150n / 63n), List$cons$(Web$Kaelin$Assets$effects$fire_1, List$cons$(Web$Kaelin$Assets$effects$fire_2, List$cons$(Web$Kaelin$Assets$effects$fire_3, List$cons$(Web$Kaelin$Assets$effects$fire_4, List$cons$(Web$Kaelin$Assets$effects$fire_5, List$nil))))));

    function Maybe$bind$(_m$3, _f$4) {
        var self = _m$3;
        switch (self._) {
            case 'Maybe.some':
                var $1502 = self.value;
                var $1503 = _f$4($1502);
                var $1501 = $1503;
                break;
            case 'Maybe.none':
                var $1504 = Maybe$none;
                var $1501 = $1504;
                break;
        };
        return $1501;
    };
    const Maybe$bind = x0 => x1 => Maybe$bind$(x0, x1);

    function Maybe$monad$(_new$2) {
        var $1505 = _new$2(Maybe$bind)(Maybe$some);
        return $1505;
    };
    const Maybe$monad = x0 => Maybe$monad$(x0);

    function Web$Kaelin$Map$find_players$(_map$1) {
        var _lmap$2 = NatMap$to_list$(_map$1);
        var _players$3 = List$nil;
        var _players$4 = (() => {
            var $1508 = _players$3;
            var $1509 = _lmap$2;
            let _players$5 = $1508;
            let _pair$4;
            while ($1509._ === 'List.cons') {
                _pair$4 = $1509.head;
                var _coord$6 = Pair$fst$(_pair$4);
                var _tile$7 = Pair$snd$(_pair$4);
                var self = _tile$7;
                switch (self._) {
                    case 'Web.Kaelin.Tile.new':
                        var $1510 = self.creature;
                        var self = $1510;
                        switch (self._) {
                            case 'Maybe.some':
                                var $1512 = self.value;
                                var _axial_coord$12 = Web$Kaelin$Coord$Convert$nat_to_axial$(_coord$6);
                                var self = $1512;
                                switch (self._) {
                                    case 'Web.Kaelin.Creature.new':
                                        var $1514 = self.player;
                                        var self = $1514;
                                        switch (self._) {
                                            case 'Maybe.some':
                                                var $1516 = self.value;
                                                var $1517 = List$concat$(_players$5, List$cons$(Pair$new$($1516, _axial_coord$12), List$nil));
                                                var $1515 = $1517;
                                                break;
                                            case 'Maybe.none':
                                                var $1518 = _players$5;
                                                var $1515 = $1518;
                                                break;
                                        };
                                        var $1513 = $1515;
                                        break;
                                };
                                var $1511 = $1513;
                                break;
                            case 'Maybe.none':
                                var $1519 = _players$5;
                                var $1511 = $1519;
                                break;
                        };
                        var $1508 = $1511;
                        break;
                };
                _players$5 = $1508;
                $1509 = $1509.tail;
            }
            return _players$5;
        })();
        var $1506 = Map$from_list$(_players$4);
        return $1506;
    };
    const Web$Kaelin$Map$find_players = x0 => Web$Kaelin$Map$find_players$(x0);

    function Web$Kaelin$Map$player$to_coord$(_address$1, _map$2) {
        var _players$3 = Web$Kaelin$Map$find_players$(_map$2);
        var $1520 = Map$get$(_address$1, _players$3);
        return $1520;
    };
    const Web$Kaelin$Map$player$to_coord = x0 => x1 => Web$Kaelin$Map$player$to_coord$(x0, x1);

    function Web$Kaelin$Map$player$info$(_address$1, _map$2) {
        var $1521 = Maybe$monad$((_m$bind$3 => _m$pure$4 => {
            var $1522 = _m$bind$3;
            return $1522;
        }))(Web$Kaelin$Map$player$to_coord$(_address$1, _map$2))((_coord$3 => {
            var $1523 = Maybe$monad$((_m$bind$4 => _m$pure$5 => {
                var $1524 = _m$bind$4;
                return $1524;
            }))(Web$Kaelin$Map$get$(_coord$3, _map$2))((_tile$4 => {
                var $1525 = Maybe$monad$((_m$bind$5 => _m$pure$6 => {
                    var $1526 = _m$bind$5;
                    return $1526;
                }))((() => {
                    var self = _tile$4;
                    switch (self._) {
                        case 'Web.Kaelin.Tile.new':
                            var $1527 = self.creature;
                            var $1528 = $1527;
                            return $1528;
                    };
                })())((_creature$5 => {
                    var $1529 = Maybe$monad$((_m$bind$6 => _m$pure$7 => {
                        var $1530 = _m$pure$7;
                        return $1530;
                    }))(Pair$new$(_coord$3, _creature$5));
                    return $1529;
                }));
                return $1525;
            }));
            return $1523;
        }));
        return $1521;
    };
    const Web$Kaelin$Map$player$info = x0 => x1 => Web$Kaelin$Map$player$info$(x0, x1);
    const Debug$log = a0 => a1 => ((console.log(a0), a1()));

    function Web$Kaelin$Action$create_player$(_user$1, _hero$2, _state$3) {
        var _key$4 = _user$1;
        var _init_pos$5 = Web$Kaelin$Coord$new$(0, 0);
        var self = _state$3;
        switch (self._) {
            case 'Web.Kaelin.State.game':
                var $1532 = self.user;
                var $1533 = self.room;
                var $1534 = self.cast_info;
                var $1535 = self.map;
                var $1536 = self.internal;
                var $1537 = self.env_info;
                var self = Web$Kaelin$Map$player$info$(_user$1, $1535);
                switch (self._) {
                    case 'Maybe.none':
                        var $1539 = ((console.log($1532), (_$12 => {
                            var _new_creature$13 = Web$Kaelin$Tile$creature$create$(_hero$2, Maybe$some$(_user$1), "blue");
                            var _entity$14 = Web$Kaelin$Map$Entity$creature$(_new_creature$13);
                            var _map$15 = Web$Kaelin$Map$push$(_init_pos$5, _entity$14, $1535);
                            var $1540 = Web$Kaelin$State$game$($1532, $1533, $1534, _map$15, $1536, $1537);
                            return $1540;
                        })()));
                        var $1538 = $1539;
                        break;
                    case 'Maybe.some':
                        var $1541 = _state$3;
                        var $1538 = $1541;
                        break;
                };
                var $1531 = $1538;
                break;
            case 'Web.Kaelin.State.init':
            case 'Web.Kaelin.State.void':
                var $1542 = _state$3;
                var $1531 = $1542;
                break;
        };
        return $1531;
    };
    const Web$Kaelin$Action$create_player = x0 => x1 => x2 => Web$Kaelin$Action$create_player$(x0, x1, x2);

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
                        var $1543 = self.head;
                        var $1544 = self.tail;
                        var self = _cond$2($1543);
                        if (self) {
                            var $1546 = Maybe$some$($1543);
                            var $1545 = $1546;
                        } else {
                            var $1547 = List$find$(_cond$2, $1544);
                            var $1545 = $1547;
                        };
                        return $1545;
                    case 'List.nil':
                        var $1548 = Maybe$none;
                        return $1548;
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
                var $1550 = self.key;
                var $1551 = (_key$1 === $1550);
                var $1549 = $1551;
                break;
        };
        return $1549;
    };
    const Web$Kaelin$Skill$has_key = x0 => x1 => Web$Kaelin$Skill$has_key$(x0, x1);

    function Web$Kaelin$Hero$skill$from_key$(_key$1, _hero$2) {
        var self = _hero$2;
        switch (self._) {
            case 'Web.Kaelin.Hero.new':
                var $1553 = self.skills;
                var $1554 = List$find$(Web$Kaelin$Skill$has_key(_key$1), $1553);
                var $1552 = $1554;
                break;
        };
        return $1552;
    };
    const Web$Kaelin$Hero$skill$from_key = x0 => x1 => Web$Kaelin$Hero$skill$from_key$(x0, x1);
    const NatSet$new = NatMap$new;

    function NatSet$set$(_nat$1, _set$2) {
        var $1555 = NatMap$set$(_nat$1, Unit$new, _set$2);
        return $1555;
    };
    const NatSet$set = x0 => x1 => NatSet$set$(x0, x1);

    function NatSet$from_list$(_xs$1) {
        var self = _xs$1;
        switch (self._) {
            case 'List.cons':
                var $1557 = self.head;
                var $1558 = self.tail;
                var $1559 = NatSet$set$($1557, NatSet$from_list$($1558));
                var $1556 = $1559;
                break;
            case 'List.nil':
                var $1560 = NatSet$new;
                var $1556 = $1560;
                break;
        };
        return $1556;
    };
    const NatSet$from_list = x0 => NatSet$from_list$(x0);

    function Web$Kaelin$Coord$range_natset$(_coord$1, _distance$2) {
        var _range$3 = Web$Kaelin$Coord$range$(_coord$1, _distance$2);
        var _range$4 = List$map$(Web$Kaelin$Coord$Convert$axial_to_nat, _range$3);
        var $1561 = NatSet$from_list$(_range$4);
        return $1561;
    };
    const Web$Kaelin$Coord$range_natset = x0 => x1 => Web$Kaelin$Coord$range_natset$(x0, x1);

    function Web$Kaelin$State$game$set_cast_info$(_cast_info$1, _state$2) {
        var self = _state$2;
        switch (self._) {
            case 'Web.Kaelin.State.game':
                var $1563 = self.user;
                var $1564 = self.room;
                var $1565 = self.map;
                var $1566 = self.internal;
                var $1567 = self.env_info;
                var $1568 = Web$Kaelin$State$game$($1563, $1564, Maybe$some$(_cast_info$1), $1565, $1566, $1567);
                var $1562 = $1568;
                break;
            case 'Web.Kaelin.State.init':
            case 'Web.Kaelin.State.void':
                var $1569 = _state$2;
                var $1562 = $1569;
                break;
        };
        return $1562;
    };
    const Web$Kaelin$State$game$set_cast_info = x0 => x1 => Web$Kaelin$State$game$set_cast_info$(x0, x1);

    function Maybe$default$(_m$2, _a$3) {
        var self = _m$2;
        switch (self._) {
            case 'Maybe.some':
                var $1571 = self.value;
                var $1572 = $1571;
                var $1570 = $1572;
                break;
            case 'Maybe.none':
                var $1573 = _a$3;
                var $1570 = $1573;
                break;
        };
        return $1570;
    };
    const Maybe$default = x0 => x1 => Maybe$default$(x0, x1);

    function Web$Kaelin$Action$start_cast$(_key_code$1, _state$2) {
        var self = _state$2;
        switch (self._) {
            case 'Web.Kaelin.State.game':
                var $1575 = self.user;
                var $1576 = self.map;
                var $1577 = self.internal;
                var $1578 = self.env_info;
                var _result$9 = Maybe$monad$((_m$bind$9 => _m$pure$10 => {
                    var $1580 = _m$bind$9;
                    return $1580;
                }))(Web$Kaelin$Map$player$info$($1575, $1576))((_player_info$9 => {
                    var self = _player_info$9;
                    switch (self._) {
                        case 'Pair.new':
                            var $1582 = self.fst;
                            var $1583 = $1582;
                            var _player_coord$10 = $1583;
                            break;
                    };
                    var self = _player_info$9;
                    switch (self._) {
                        case 'Pair.new':
                            var $1584 = self.snd;
                            var $1585 = $1584;
                            var _player_creature$11 = $1585;
                            break;
                    };
                    var $1581 = Maybe$monad$((_m$bind$12 => _m$pure$13 => {
                        var $1586 = _m$bind$12;
                        return $1586;
                    }))(Web$Kaelin$Hero$skill$from_key$(_key_code$1, (() => {
                        var self = _player_creature$11;
                        switch (self._) {
                            case 'Web.Kaelin.Creature.new':
                                var $1587 = self.hero;
                                var $1588 = $1587;
                                return $1588;
                        };
                    })()))((_skill$12 => {
                        var _range$13 = Web$Kaelin$Coord$range_natset$(_player_coord$10, (() => {
                            var self = _skill$12;
                            switch (self._) {
                                case 'Web.Kaelin.Skill.new':
                                    var $1590 = self.range;
                                    var $1591 = $1590;
                                    return $1591;
                            };
                        })());
                        var _mouse_coord$14 = Web$Kaelin$Coord$to_axial$((() => {
                            var self = $1578;
                            switch (self._) {
                                case 'App.EnvInfo.new':
                                    var $1592 = self.mouse_pos;
                                    var $1593 = $1592;
                                    return $1593;
                            };
                        })());
                        var _area$15 = Web$Kaelin$Skill$indicator$((() => {
                            var self = $1577;
                            switch (self._) {
                                case 'Web.Kaelin.Internal.new':
                                    var $1594 = self.tick;
                                    var $1595 = $1594;
                                    return $1595;
                            };
                        })(), _player_coord$10, _skill$12, _mouse_coord$14, $1576);
                        var _cast$16 = Web$Kaelin$CastInfo$new$(_player_coord$10, _skill$12, _range$13, _area$15, _mouse_coord$14);
                        var $1589 = Maybe$monad$((_m$bind$17 => _m$pure$18 => {
                            var $1596 = _m$pure$18;
                            return $1596;
                        }))(Web$Kaelin$State$game$set_cast_info$(_cast$16, _state$2));
                        return $1589;
                    }));
                    return $1581;
                }));
                var $1579 = Maybe$default$(_result$9, _state$2);
                var $1574 = $1579;
                break;
            case 'Web.Kaelin.State.init':
            case 'Web.Kaelin.State.void':
                var $1597 = _state$2;
                var $1574 = $1597;
                break;
        };
        return $1574;
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
                    var $1598 = _xs$2;
                    return $1598;
                } else {
                    var $1599 = (self - 1n);
                    var self = _xs$2;
                    if (self.length === 0) {
                        var $1601 = String$nil;
                        var $1600 = $1601;
                    } else {
                        var $1602 = self.charCodeAt(0);
                        var $1603 = self.slice(1);
                        var $1604 = String$drop$($1599, $1603);
                        var $1600 = $1604;
                    };
                    return $1600;
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
                var $1606 = self.fst;
                var $1607 = self.snd;
                var self = $1607;
                switch (self._) {
                    case 'List.cons':
                        var $1609 = self.head;
                        var $1610 = self.tail;
                        var $1611 = Pair$new$(String$drop$((BigInt($1609)), $1606), $1610);
                        var $1608 = $1611;
                        break;
                    case 'List.nil':
                        var $1612 = _buffer$1;
                        var $1608 = $1612;
                        break;
                };
                var $1605 = $1608;
                break;
        };
        return $1605;
    };
    const Web$Kaelin$Event$Buffer$next = x0 => Web$Kaelin$Event$Buffer$next$(x0);

    function String$take$(_n$1, _xs$2) {
        var self = _xs$2;
        if (self.length === 0) {
            var $1614 = String$nil;
            var $1613 = $1614;
        } else {
            var $1615 = self.charCodeAt(0);
            var $1616 = self.slice(1);
            var self = _n$1;
            if (self === 0n) {
                var $1618 = String$nil;
                var $1617 = $1618;
            } else {
                var $1619 = (self - 1n);
                var $1620 = String$cons$($1615, String$take$($1619, $1616));
                var $1617 = $1620;
            };
            var $1613 = $1617;
        };
        return $1613;
    };
    const String$take = x0 => x1 => String$take$(x0, x1);

    function Web$Kaelin$Event$Buffer$get$(_buffer$1) {
        var self = _buffer$1;
        switch (self._) {
            case 'Pair.new':
                var $1622 = self.fst;
                var $1623 = self.snd;
                var self = $1623;
                switch (self._) {
                    case 'List.cons':
                        var $1625 = self.head;
                        var $1626 = Hex$to_nat$(String$take$((BigInt($1625)), $1622));
                        var $1624 = $1626;
                        break;
                    case 'List.nil':
                        var $1627 = 0n;
                        var $1624 = $1627;
                        break;
                };
                var $1621 = $1624;
                break;
        };
        return $1621;
    };
    const Web$Kaelin$Event$Buffer$get = x0 => Web$Kaelin$Event$Buffer$get$(x0);

    function Web$Kaelin$Event$Buffer$push$(_buffer$1, _list$2) {
        var self = _buffer$1;
        switch (self._) {
            case 'Pair.new':
                var $1629 = self.fst;
                var $1630 = self.snd;
                var $1631 = Pair$new$($1629, List$concat$(_list$2, $1630));
                var $1628 = $1631;
                break;
        };
        return $1628;
    };
    const Web$Kaelin$Event$Buffer$push = x0 => x1 => Web$Kaelin$Event$Buffer$push$(x0, x1);

    function Web$Kaelin$Event$Buffer$new$(_fst$1, _snd$2) {
        var $1632 = Pair$new$(_fst$1, _snd$2);
        return $1632;
    };
    const Web$Kaelin$Event$Buffer$new = x0 => x1 => Web$Kaelin$Event$Buffer$new$(x0, x1);

    function Web$Kaelin$Event$create_hero$(_hero_id$1) {
        var $1633 = ({
            _: 'Web.Kaelin.Event.create_hero',
            'hero_id': _hero_id$1
        });
        return $1633;
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
            var $1635 = Maybe$some$(Web$Kaelin$Action$walk);
            var $1634 = $1635;
        } else {
            var self = (_x$1 === 1n);
            if (self) {
                var $1637 = Maybe$some$(Web$Kaelin$Action$ability_0);
                var $1636 = $1637;
            } else {
                var self = (_x$1 === 2n);
                if (self) {
                    var $1639 = Maybe$some$(Web$Kaelin$Action$ability_1);
                    var $1638 = $1639;
                } else {
                    var $1640 = Maybe$none;
                    var $1638 = $1640;
                };
                var $1636 = $1638;
            };
            var $1634 = $1636;
        };
        return $1634;
    };
    const Web$Kaelin$Resources$Action$to_action = x0 => Web$Kaelin$Resources$Action$to_action$(x0);

    function Web$Kaelin$Event$deserialize$(_code$1) {
        var _stream$2 = Web$Kaelin$Event$Buffer$new$(_code$1, Web$Kaelin$Event$Code$action);
        var self = ((_x$3 => {
            var $1642 = Web$Kaelin$Event$Buffer$get$(_x$3);
            return $1642;
        })(_stream$2) === 1n);
        if (self) {
            var _stream$3 = (_x$3 => {
                var $1644 = Web$Kaelin$Event$Buffer$next$(_x$3);
                return $1644;
            })(_stream$2);
            var _stream$4 = (_x$4 => _y$5 => {
                var $1645 = Web$Kaelin$Event$Buffer$push$(_x$4, _y$5);
                return $1645;
            })(_stream$3)(Web$Kaelin$Event$Code$create_hero);
            var $1643 = Maybe$some$(Web$Kaelin$Event$create_hero$((Number((_x$5 => {
                var $1646 = Web$Kaelin$Event$Buffer$get$(_x$5);
                return $1646;
            })(_stream$4)) & 0xFF)));
            var $1641 = $1643;
        } else {
            var self = ((_x$3 => {
                var $1648 = Web$Kaelin$Event$Buffer$get$(_x$3);
                return $1648;
            })(_stream$2) === 4n);
            if (self) {
                var _stream$3 = (_x$3 => {
                    var $1650 = Web$Kaelin$Event$Buffer$next$(_x$3);
                    return $1650;
                })(_stream$2);
                var _stream$4 = (_x$4 => _y$5 => {
                    var $1651 = Web$Kaelin$Event$Buffer$push$(_x$4, _y$5);
                    return $1651;
                })(_stream$3)(Web$Kaelin$Event$Code$user_input);
                var _player$5 = Bits$to_hex_string$((nat_to_bits((_x$5 => {
                    var $1652 = Web$Kaelin$Event$Buffer$get$(_x$5);
                    return $1652;
                })(_stream$4))));
                var _stream$6 = (_x$6 => {
                    var $1653 = Web$Kaelin$Event$Buffer$next$(_x$6);
                    return $1653;
                })(_stream$4);
                var _action$7 = Web$Kaelin$Resources$Action$to_action$((_x$7 => {
                    var $1654 = Web$Kaelin$Event$Buffer$get$(_x$7);
                    return $1654;
                })(_stream$6));
                var _stream$8 = (_x$8 => {
                    var $1655 = Web$Kaelin$Event$Buffer$next$(_x$8);
                    return $1655;
                })(_stream$6);
                var _pos$9 = Web$Kaelin$Coord$Convert$nat_to_axial$((_x$9 => {
                    var $1656 = Web$Kaelin$Event$Buffer$get$(_x$9);
                    return $1656;
                })(_stream$8));
                var $1649 = Maybe$bind$(_action$7, (_action$10 => {
                    var $1657 = Maybe$some$(Web$Kaelin$Event$user_input$(("0x" + _player$5), _pos$9, _action$10));
                    return $1657;
                }));
                var $1647 = $1649;
            } else {
                var $1658 = Maybe$none;
                var $1647 = $1658;
            };
            var $1641 = $1647;
        };
        return $1641;
    };
    const Web$Kaelin$Event$deserialize = x0 => Web$Kaelin$Event$deserialize$(x0);

    function Web$Kaelin$Skill$skill_use$(_state$1) {
        var self = _state$1;
        switch (self._) {
            case 'Web.Kaelin.State.game':
                var $1660 = self.user;
                var $1661 = self.room;
                var $1662 = self.cast_info;
                var $1663 = self.map;
                var $1664 = self.internal;
                var $1665 = self.env_info;
                var self = $1662;
                switch (self._) {
                    case 'Maybe.some':
                        var $1667 = self.value;
                        var self = $1667;
                        switch (self._) {
                            case 'Web.Kaelin.CastInfo.new':
                                var $1669 = self.hero_pos;
                                var $1670 = self.skill;
                                var $1671 = self.range;
                                var $1672 = self.mouse_pos;
                                var _skill$14 = $1670;
                                var self = _skill$14;
                                switch (self._) {
                                    case 'Web.Kaelin.Skill.new':
                                        var $1674 = self.effect;
                                        var _mouse_nat$19 = Web$Kaelin$Coord$Convert$axial_to_nat$($1672);
                                        var self = NatSet$has$(_mouse_nat$19, $1671);
                                        if (self) {
                                            var self = $1664;
                                            switch (self._) {
                                                case 'Web.Kaelin.Internal.new':
                                                    var $1677 = self.tick;
                                                    var _tick$23 = $1677;
                                                    var _result$24 = $1674(_tick$23)($1669)($1672)($1663);
                                                    var self = _result$24;
                                                    switch (self._) {
                                                        case 'Web.Kaelin.Effect.Result.new':
                                                            var $1679 = self.map;
                                                            var $1680 = Web$Kaelin$State$game$($1660, $1661, Maybe$none, $1679, $1664, $1665);
                                                            var $1678 = $1680;
                                                            break;
                                                    };
                                                    var $1676 = $1678;
                                                    break;
                                            };
                                            var $1675 = $1676;
                                        } else {
                                            var $1681 = _state$1;
                                            var $1675 = $1681;
                                        };
                                        var $1673 = $1675;
                                        break;
                                };
                                var $1668 = $1673;
                                break;
                        };
                        var $1666 = $1668;
                        break;
                    case 'Maybe.none':
                        var $1682 = _state$1;
                        var $1666 = $1682;
                        break;
                };
                var $1659 = $1666;
                break;
            case 'Web.Kaelin.State.init':
            case 'Web.Kaelin.State.void':
                var $1683 = _state$1;
                var $1659 = $1683;
                break;
        };
        return $1659;
    };
    const Web$Kaelin$Skill$skill_use = x0 => Web$Kaelin$Skill$skill_use$(x0);

    function Web$Kaelin$App$when$(_event$1, _state$2) {
        var $1763 = (() => c10 => {
            var self = _event$1;
            switch (self._) {
                case 'App.Event.init':
                    var $1764 = self.user;
                    var self = _state$2;
                    switch (self._) {
                        case 'Web.Kaelin.State.game':
                            var $1766 = self.players;
                            var $1767 = self.cast_info;
                            var $1768 = self.map;
                            var $1769 = self.internal;
                            var $1770 = self.env_info;
                            var _user$13 = String$to_lower$($1764);
                            var $1771 = IO$monad$((_m$bind$14 => _m$pure$15 => {
                                var $1772 = _m$bind$14;
                                return $1772;
                            }))(App$watch$(Web$Kaelin$Constants$room))((_$14 => {
                                var $1773 = App$store$(Web$Kaelin$State$game$(_user$13, Web$Kaelin$Constants$room, $1766, $1767, $1768, $1769, $1770));
                                return $1773;
                            }));
                            var $1765 = $1771;
                            break;
                        case 'Web.Kaelin.State.init':
                        case 'Web.Kaelin.State.void':
                            var $1774 = App$pass;
                            var $1765 = $1774;
                            break;
                    };
                    return $1765;
                case 'App.Event.tick':
                    var $1775 = self.time;
                    var $1776 = self.info;
                    var self = _state$2;
                    switch (self._) {
                        case 'Web.Kaelin.State.init':
                        case 'Web.Kaelin.State.void':
                            var $1778 = App$pass;
                            var $1777 = $1778;
                            break;
                        case 'Web.Kaelin.State.game':
                            var _info$12 = $1776;
                            var _state$13 = Web$Kaelin$Action$update_interface$(_info$12, ($1775), _state$2);
                            var $1779 = App$store$(Web$Kaelin$Action$update_area$(_state$13));
                            var $1777 = $1779;
                            break;
                    };
                    return $1777;
                case 'App.Event.mouse_up':
                    var $1780 = self.button;
                    var self = _state$2;
                    switch (self._) {
                        case 'Web.Kaelin.State.game':
                            var $1782 = self.user;
                            var self = ($1780 === 49);
                            if (self) {
                                var $1784 = App$store$(Web$Kaelin$Action$create_player$($1782, Web$Kaelin$Heroes$Croni$croni, _state$2));
                                var $1783 = $1784;
                            } else {
                                var $1785 = App$store$(Web$Kaelin$Action$start_cast$($1780, _state$2));
                                var $1783 = $1785;
                            };
                            var $1781 = $1783;
                            break;
                        case 'Web.Kaelin.State.init':
                        case 'Web.Kaelin.State.void':
                            var $1786 = App$pass;
                            var $1781 = $1786;
                            break;
                    };
                    return $1781;
                case 'App.Event.post':
                    var $1787 = self.time;
                    var $1788 = self.room;
                    var $1789 = self.addr;
                    var $1790 = self.data;
                    var self = _state$2;
                    switch (self._) {
                        case 'Web.Kaelin.State.init':
                        case 'Web.Kaelin.State.void':
                        case 'Web.Kaelin.State.game':
                            var $1792 = App$pass;
                            var $1791 = $1792;
                            break;
                    };
                    var $1791 = $1791($1789)($1790);
                    return $1791;
                case 'App.Event.input':
                    var $1793 = self.time;
                    var $1794 = self.id;
                    var $1795 = self.text;
                    var $1796 = c10($1793)($1794)($1795);
                    return $1796;
                case 'App.Event.frame':
                case 'App.Event.key_down':
                    var self = _state$2;
                    switch (self._) {
                        case 'Web.Kaelin.State.init':
                        case 'Web.Kaelin.State.void':
                        case 'Web.Kaelin.State.game':
                            var $1798 = App$pass;
                            var $1797 = $1798;
                            break;
                    };
                    return $1797;
                case 'App.Event.mouse_down':
                    var self = _state$2;
                    switch (self._) {
                        case 'Web.Kaelin.State.game':
                            var $1800 = self.user;
                            var $1801 = self.room;
                            var $1802 = self.env_info;
                            var _info$12 = $1802;
                            var self = _info$12;
                            switch (self._) {
                                case 'App.EnvInfo.new':
                                    var $1804 = self.mouse_pos;
                                    var self = Web$Kaelin$Coord$to_axial$($1804);
                                    switch (self._) {
                                        case 'Web.Kaelin.Coord.new':
                                            var $1806 = self.i;
                                            var $1807 = self.j;
                                            var _hex$17 = Web$Kaelin$Event$serialize$(Web$Kaelin$Event$user_input$($1800, Web$Kaelin$Coord$new$($1806, $1807), Web$Kaelin$Action$walk));
                                            var $1808 = App$post$($1801, _hex$17);
                                            var $1805 = $1808;
                                            break;
                                    };
                                    var $1803 = $1805;
                                    break;
                            };
                            var $1799 = $1803;
                            break;
                        case 'Web.Kaelin.State.init':
                        case 'Web.Kaelin.State.void':
                            var $1809 = App$pass;
                            var $1799 = $1809;
                            break;
                    };
                    return $1799;
                case 'App.Event.key_up':
                    var $1810 = null;
                    return $1810;
                case 'App.Event.mouse_over':
                    var $1811 = null;
                    return $1811;
                case 'App.Event.mouse_click':
                    var self = _state$2;
                    switch (self._) {
                        case 'Web.Kaelin.State.init':
                        case 'Web.Kaelin.State.void':
                        case 'Web.Kaelin.State.game':
                            var $1813 = App$pass;
                            var $1812 = $1813;
                            break;
                    };
                    return $1812;
            };
        })();
        return $1763;
    };
    const Web$Kaelin$App$when = x0 => x1 => Web$Kaelin$App$when$(x0, x1);

    function App$new$(_init$2, _draw$3, _when$4) {
        var $1814 = ({
            _: 'App.new',
            'init': _init$2,
            'draw': _draw$3,
            'when': _when$4
        });
        return $1814;
    };
    const App$new = x0 => x1 => x2 => App$new$(x0, x1, x2);
    const Web$Kaelin = (() => {
        var _img$1 = VoxBox$alloc_capacity$(((65536 * 8) >>> 0));
        var _init$2 = Web$Kaelin$App$init;
        var _draw$3 = Web$Kaelin$App$draw(_img$1);
        var _when$4 = Web$Kaelin$App$when;
        var $1815 = App$new$(_init$2, _draw$3, _when$4);
        return $1815;
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
        'Maybe.none': Maybe$none,
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
        'BitsMap': BitsMap,
        'BitsMap.tie': BitsMap$tie,
        'BitsMap.union': BitsMap$union,
        'NatMap.union': NatMap$union,
        'Web.Kaelin.Effect.Result.new': Web$Kaelin$Effect$Result$new,
        'Web.Kaelin.Effect.bind': Web$Kaelin$Effect$bind,
        'List.nil': List$nil,
        'BitsMap.new': BitsMap$new,
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
        'Maybe.some': Maybe$some,
        'BitsMap.set': BitsMap$set,
        'Bits.o': Bits$o,
        'Bits.e': Bits$e,
        'Bits.i': Bits$i,
        'Bits.inc': Bits$inc,
        'Nat.to_bits': Nat$to_bits,
        'NatMap.set': NatMap$set,
        'Web.Kaelin.Effect.result.union': Web$Kaelin$Effect$result$union,
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
        'Web.Kaelin.Assets.tile.effect.dark_red2': Web$Kaelin$Assets$tile$effect$dark_red2,
        'Web.Kaelin.Assets.tile.effect.light_red2': Web$Kaelin$Assets$tile$effect$light_red2,
        'Web.Kaelin.Assets.tile.effect.dark_blue2': Web$Kaelin$Assets$tile$effect$dark_blue2,
        'Web.Kaelin.Resources.terrains': Web$Kaelin$Resources$terrains,
        'Web.Kaelin.Terrain.new': Web$Kaelin$Terrain$new,
        'Web.Kaelin.Map.Entity.background': Web$Kaelin$Map$Entity$background,
        'Web.Kaelin.Map.arena': Web$Kaelin$Map$arena,
        'App.EnvInfo.new': App$EnvInfo$new,
        'Web.Kaelin.State.game': Web$Kaelin$State$game,
        'Web.Kaelin.Internal.new': Web$Kaelin$Internal$new,
        'Web.Kaelin.App.init': Web$Kaelin$App$init,
        'DOM.text': DOM$text,
        'DOM.vbox': DOM$vbox,
        'Map': Map,
        'Bits.concat': Bits$concat,
        'Word.to_bits': Word$to_bits,
        'U16.to_bits': U16$to_bits,
        'String.to_bits': String$to_bits,
        'Map.from_list': Map$from_list,
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
        'NatSet.has': NatSet$has,
        'Web.Kaelin.Indicator.blue': Web$Kaelin$Indicator$blue,
        'Web.Kaelin.Draw.support.get_effect': Web$Kaelin$Draw$support$get_effect,
        'Web.Kaelin.Draw.support.area_of_effect': Web$Kaelin$Draw$support$area_of_effect,
        'Web.Kaelin.Draw.support.get_indicator': Web$Kaelin$Draw$support$get_indicator,
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
        'Web.Kaelin.Draw.tile.background': Web$Kaelin$Draw$tile$background,
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
        'Web.Kaelin.Draw.creature.hp': Web$Kaelin$Draw$creature$hp,
        'Web.Kaelin.Draw.tile.creature': Web$Kaelin$Draw$tile$creature,
        'Nat.div': Nat$div,
        'List.length': List$length,
        'List.get': List$get,
        'Web.Kaelin.Draw.support.animation_frame': Web$Kaelin$Draw$support$animation_frame,
        'Web.Kaelin.Draw.tile.animation': Web$Kaelin$Draw$tile$animation,
        'Web.Kaelin.Draw.state.map': Web$Kaelin$Draw$state$map,
        'Web.Kaelin.Assets.tile.mouse_ui': Web$Kaelin$Assets$tile$mouse_ui,
        'Web.Kaelin.Draw.state.mouse_ui': Web$Kaelin$Draw$state$mouse_ui,
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
        'Web.Kaelin.Map.Entity.animation': Web$Kaelin$Map$Entity$animation,
        'Web.Kaelin.Animation.new': Web$Kaelin$Animation$new,
        'Web.Kaelin.Sprite.new': Web$Kaelin$Sprite$new,
        'Web.Kaelin.Assets.effects.fire_1': Web$Kaelin$Assets$effects$fire_1,
        'Web.Kaelin.Assets.effects.fire_2': Web$Kaelin$Assets$effects$fire_2,
        'Web.Kaelin.Assets.effects.fire_3': Web$Kaelin$Assets$effects$fire_3,
        'Web.Kaelin.Assets.effects.fire_4': Web$Kaelin$Assets$effects$fire_4,
        'Web.Kaelin.Assets.effects.fire_5': Web$Kaelin$Assets$effects$fire_5,
        'Web.Kaelin.Sprite.fire': Web$Kaelin$Sprite$fire,
        'Maybe.bind': Maybe$bind,
        'Maybe.monad': Maybe$monad,
        'Web.Kaelin.Map.find_players': Web$Kaelin$Map$find_players,
        'Web.Kaelin.Map.player.to_coord': Web$Kaelin$Map$player$to_coord,
        'Web.Kaelin.Map.player.info': Web$Kaelin$Map$player$info,
        'Debug.log': Debug$log,
        'Web.Kaelin.Action.create_player': Web$Kaelin$Action$create_player,
        'List.find': List$find,
        'Web.Kaelin.Skill.has_key': Web$Kaelin$Skill$has_key,
        'Web.Kaelin.Hero.skill.from_key': Web$Kaelin$Hero$skill$from_key,
        'NatSet.new': NatSet$new,
        'NatSet.set': NatSet$set,
        'NatSet.from_list': NatSet$from_list,
        'Web.Kaelin.Coord.range_natset': Web$Kaelin$Coord$range_natset,
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
        'Web.Kaelin.Skill.skill_use': Web$Kaelin$Skill$skill_use,
        'Web.Kaelin.App.when': Web$Kaelin$App$when,
        'App.new': App$new,
        'Web.Kaelin': Web$Kaelin,
    };
})();