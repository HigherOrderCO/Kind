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

    function Word$shift_left1$aux$(_word$2, _prev$3) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $73 = self.pred;
                var self = _prev$3;
                if (self) {
                    var $75 = Word$i$(Word$shift_left1$aux$($73, Bool$false));
                    var $74 = $75;
                } else {
                    var $76 = Word$o$(Word$shift_left1$aux$($73, Bool$false));
                    var $74 = $76;
                };
                var $72 = $74;
                break;
            case 'Word.i':
                var $77 = self.pred;
                var self = _prev$3;
                if (self) {
                    var $79 = Word$i$(Word$shift_left1$aux$($77, Bool$true));
                    var $78 = $79;
                } else {
                    var $80 = Word$o$(Word$shift_left1$aux$($77, Bool$true));
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
    const Word$shift_left1$aux = x0 => x1 => Word$shift_left1$aux$(x0, x1);

    function Word$shift_left1$(_word$2) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $83 = self.pred;
                var $84 = Word$o$(Word$shift_left1$aux$($83, Bool$false));
                var $82 = $84;
                break;
            case 'Word.i':
                var $85 = self.pred;
                var $86 = Word$o$(Word$shift_left1$aux$($85, Bool$true));
                var $82 = $86;
                break;
            case 'Word.e':
                var $87 = Word$e;
                var $82 = $87;
                break;
        };
        return $82;
    };
    const Word$shift_left1 = x0 => Word$shift_left1$(x0);

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
                        var $123 = Word$mul$go$($122, Word$shift_left1$(_b$4), _acc$5);
                        return $123;
                    case 'Word.i':
                        var $124 = self.pred;
                        var $125 = Word$mul$go$($124, Word$shift_left1$(_b$4), Word$add$(_b$4, _acc$5));
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
    const Web$Kaelin$Constants$room = "0x415512345292";

    function BitsMap$(_A$1) {
        var $146 = null;
        return $146;
    };
    const BitsMap = x0 => BitsMap$(x0);

    function Map$(_V$1) {
        var $147 = null;
        return $147;
    };
    const Map = x0 => Map$(x0);
    const BitsMap$new = ({
        _: 'BitsMap.new'
    });

    function BitsMap$tie$(_val$2, _lft$3, _rgt$4) {
        var $148 = ({
            _: 'BitsMap.tie',
            'val': _val$2,
            'lft': _lft$3,
            'rgt': _rgt$4
        });
        return $148;
    };
    const BitsMap$tie = x0 => x1 => x2 => BitsMap$tie$(x0, x1, x2);

    function Maybe$some$(_value$2) {
        var $149 = ({
            _: 'Maybe.some',
            'value': _value$2
        });
        return $149;
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
                var $151 = self.pred;
                var $152 = (Word$to_bits$($151) + '0');
                var $150 = $152;
                break;
            case 'Word.i':
                var $153 = self.pred;
                var $154 = (Word$to_bits$($153) + '1');
                var $150 = $154;
                break;
            case 'Word.e':
                var $155 = Bits$e;
                var $150 = $155;
                break;
        };
        return $150;
    };
    const Word$to_bits = x0 => Word$to_bits$(x0);
    const U16$to_bits = a0 => (u16_to_bits(a0));

    function String$to_bits$(_str$1) {
        var self = _str$1;
        if (self.length === 0) {
            var $157 = Bits$e;
            var $156 = $157;
        } else {
            var $158 = self.charCodeAt(0);
            var $159 = self.slice(1);
            var $160 = (String$to_bits$($159) + (u16_to_bits($158)));
            var $156 = $160;
        };
        return $156;
    };
    const String$to_bits = x0 => String$to_bits$(x0);

    function Map$from_list$(_xs$2) {
        var self = _xs$2;
        switch (self._) {
            case 'List.cons':
                var $162 = self.head;
                var $163 = self.tail;
                var self = $162;
                switch (self._) {
                    case 'Pair.new':
                        var $165 = self.fst;
                        var $166 = self.snd;
                        var $167 = (bitsmap_set(String$to_bits$($165), $166, Map$from_list$($163), 'set'));
                        var $164 = $167;
                        break;
                };
                var $161 = $164;
                break;
            case 'List.nil':
                var $168 = BitsMap$new;
                var $161 = $168;
                break;
        };
        return $161;
    };
    const Map$from_list = x0 => Map$from_list$(x0);
    const List$nil = ({
        _: 'List.nil'
    });

    function Pair$(_A$1, _B$2) {
        var $169 = null;
        return $169;
    };
    const Pair = x0 => x1 => Pair$(x0, x1);

    function Web$Kaelin$CastInfo$new$(_mouse_pos$1, _hero_pos$2, _range$3, _hex_effect$4) {
        var $170 = ({
            _: 'Web.Kaelin.CastInfo.new',
            'mouse_pos': _mouse_pos$1,
            'hero_pos': _hero_pos$2,
            'range': _range$3,
            'hex_effect': _hex_effect$4
        });
        return $170;
    };
    const Web$Kaelin$CastInfo$new = x0 => x1 => x2 => x3 => Web$Kaelin$CastInfo$new$(x0, x1, x2, x3);

    function Web$Kaelin$Coord$new$(_i$1, _j$2) {
        var $171 = ({
            _: 'Web.Kaelin.Coord.new',
            'i': _i$1,
            'j': _j$2
        });
        return $171;
    };
    const Web$Kaelin$Coord$new = x0 => x1 => Web$Kaelin$Coord$new$(x0, x1);

    function I32$new$(_value$1) {
        var $172 = word_to_i32(_value$1);
        return $172;
    };
    const I32$new = x0 => I32$new$(x0);

    function Word$neg$aux$(_word$2, _inc$3) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $174 = self.pred;
                var self = _inc$3;
                if (self) {
                    var $176 = Word$o$(Word$neg$aux$($174, Bool$true));
                    var $175 = $176;
                } else {
                    var $177 = Word$i$(Word$neg$aux$($174, Bool$false));
                    var $175 = $177;
                };
                var $173 = $175;
                break;
            case 'Word.i':
                var $178 = self.pred;
                var self = _inc$3;
                if (self) {
                    var $180 = Word$i$(Word$neg$aux$($178, Bool$false));
                    var $179 = $180;
                } else {
                    var $181 = Word$o$(Word$neg$aux$($178, Bool$false));
                    var $179 = $181;
                };
                var $173 = $179;
                break;
            case 'Word.e':
                var $182 = Word$e;
                var $173 = $182;
                break;
        };
        return $173;
    };
    const Word$neg$aux = x0 => x1 => Word$neg$aux$(x0, x1);

    function Word$neg$(_word$2) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $184 = self.pred;
                var $185 = Word$o$(Word$neg$aux$($184, Bool$true));
                var $183 = $185;
                break;
            case 'Word.i':
                var $186 = self.pred;
                var $187 = Word$i$(Word$neg$aux$($186, Bool$false));
                var $183 = $187;
                break;
            case 'Word.e':
                var $188 = Word$e;
                var $183 = $188;
                break;
        };
        return $183;
    };
    const Word$neg = x0 => Word$neg$(x0);
    const I32$neg = a0 => ((-a0));

    function Int$to_i32$(_a$1) {
        var self = _a$1;
        switch ("new") {
            case 'new':
                var $190 = int_pos(self);
                var $191 = int_neg(self);
                var self = $191;
                if (self === 0n) {
                    var $193 = I32$new$(Nat$to_word$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$zero)))))))))))))))))))))))))))))))), $190));
                    var $192 = $193;
                } else {
                    var $194 = (self - 1n);
                    var $195 = ((-I32$new$(Nat$to_word$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$zero)))))))))))))))))))))))))))))))), $191))));
                    var $192 = $195;
                };
                var $189 = $192;
                break;
        };
        return $189;
    };
    const Int$to_i32 = x0 => Int$to_i32$(x0);
    const Int$new = a0 => a1 => (a0 - a1);

    function Int$from_nat$(_n$1) {
        var $196 = (_n$1 - 0n);
        return $196;
    };
    const Int$from_nat = x0 => Int$from_nat$(x0);
    const Web$Kaelin$HexEffect$normal = ({
        _: 'Web.Kaelin.HexEffect.normal'
    });

    function Web$Kaelin$Entity$creature$(_player$1, _hero$2) {
        var $197 = ({
            _: 'Web.Kaelin.Entity.creature',
            'player': _player$1,
            'hero': _hero$2
        });
        return $197;
    };
    const Web$Kaelin$Entity$creature = x0 => x1 => Web$Kaelin$Entity$creature$(x0, x1);

    function Web$Kaelin$Hero$new$(_id$1, _img$2) {
        var $198 = ({
            _: 'Web.Kaelin.Hero.new',
            'id': _id$1,
            'img': _img$2
        });
        return $198;
    };
    const Web$Kaelin$Hero$new = x0 => x1 => Web$Kaelin$Hero$new$(x0, x1);

    function U8$new$(_value$1) {
        var $199 = word_to_u8(_value$1);
        return $199;
    };
    const U8$new = x0 => U8$new$(x0);
    const Nat$to_u8 = a0 => (Number(a0) & 0xFF);
    const Nat$ltn = a0 => a1 => (a0 < a1);
    const Nat$sub = a0 => a1 => (a0 - a1 <= 0n ? 0n : a0 - a1);

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
                    var $200 = _value$3;
                    return $200;
                } else {
                    var $201 = (self - 1n);
                    var $202 = Word$shift_left$($201, Word$shift_left1$(_value$3));
                    return $202;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Word$shift_left = x0 => x1 => Word$shift_left$(x0, x1);

    function Cmp$as_gte$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
                var $204 = Bool$false;
                var $203 = $204;
                break;
            case 'Cmp.eql':
            case 'Cmp.gtn':
                var $205 = Bool$true;
                var $203 = $205;
                break;
        };
        return $203;
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
                var $207 = self.pred;
                var $208 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $210 = self.pred;
                            var $211 = (_a$pred$10 => {
                                var $212 = Word$cmp$go$(_a$pred$10, $210, _c$4);
                                return $212;
                            });
                            var $209 = $211;
                            break;
                        case 'Word.i':
                            var $213 = self.pred;
                            var $214 = (_a$pred$10 => {
                                var $215 = Word$cmp$go$(_a$pred$10, $213, Cmp$ltn);
                                return $215;
                            });
                            var $209 = $214;
                            break;
                        case 'Word.e':
                            var $216 = (_a$pred$8 => {
                                var $217 = _c$4;
                                return $217;
                            });
                            var $209 = $216;
                            break;
                    };
                    var $209 = $209($207);
                    return $209;
                });
                var $206 = $208;
                break;
            case 'Word.i':
                var $218 = self.pred;
                var $219 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $221 = self.pred;
                            var $222 = (_a$pred$10 => {
                                var $223 = Word$cmp$go$(_a$pred$10, $221, Cmp$gtn);
                                return $223;
                            });
                            var $220 = $222;
                            break;
                        case 'Word.i':
                            var $224 = self.pred;
                            var $225 = (_a$pred$10 => {
                                var $226 = Word$cmp$go$(_a$pred$10, $224, _c$4);
                                return $226;
                            });
                            var $220 = $225;
                            break;
                        case 'Word.e':
                            var $227 = (_a$pred$8 => {
                                var $228 = _c$4;
                                return $228;
                            });
                            var $220 = $227;
                            break;
                    };
                    var $220 = $220($218);
                    return $220;
                });
                var $206 = $219;
                break;
            case 'Word.e':
                var $229 = (_b$5 => {
                    var $230 = _c$4;
                    return $230;
                });
                var $206 = $229;
                break;
        };
        var $206 = $206(_b$3);
        return $206;
    };
    const Word$cmp$go = x0 => x1 => x2 => Word$cmp$go$(x0, x1, x2);
    const Cmp$eql = ({
        _: 'Cmp.eql'
    });

    function Word$cmp$(_a$2, _b$3) {
        var $231 = Word$cmp$go$(_a$2, _b$3, Cmp$eql);
        return $231;
    };
    const Word$cmp = x0 => x1 => Word$cmp$(x0, x1);

    function Word$gte$(_a$2, _b$3) {
        var $232 = Cmp$as_gte$(Word$cmp$(_a$2, _b$3));
        return $232;
    };
    const Word$gte = x0 => x1 => Word$gte$(x0, x1);

    function Pair$new$(_fst$3, _snd$4) {
        var $233 = ({
            _: 'Pair.new',
            'fst': _fst$3,
            'snd': _snd$4
        });
        return $233;
    };
    const Pair$new = x0 => x1 => Pair$new$(x0, x1);

    function Word$or$(_a$2, _b$3) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $235 = self.pred;
                var $236 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $238 = self.pred;
                            var $239 = (_a$pred$9 => {
                                var $240 = Word$o$(Word$or$(_a$pred$9, $238));
                                return $240;
                            });
                            var $237 = $239;
                            break;
                        case 'Word.i':
                            var $241 = self.pred;
                            var $242 = (_a$pred$9 => {
                                var $243 = Word$i$(Word$or$(_a$pred$9, $241));
                                return $243;
                            });
                            var $237 = $242;
                            break;
                        case 'Word.e':
                            var $244 = (_a$pred$7 => {
                                var $245 = Word$e;
                                return $245;
                            });
                            var $237 = $244;
                            break;
                    };
                    var $237 = $237($235);
                    return $237;
                });
                var $234 = $236;
                break;
            case 'Word.i':
                var $246 = self.pred;
                var $247 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $249 = self.pred;
                            var $250 = (_a$pred$9 => {
                                var $251 = Word$i$(Word$or$(_a$pred$9, $249));
                                return $251;
                            });
                            var $248 = $250;
                            break;
                        case 'Word.i':
                            var $252 = self.pred;
                            var $253 = (_a$pred$9 => {
                                var $254 = Word$i$(Word$or$(_a$pred$9, $252));
                                return $254;
                            });
                            var $248 = $253;
                            break;
                        case 'Word.e':
                            var $255 = (_a$pred$7 => {
                                var $256 = Word$e;
                                return $256;
                            });
                            var $248 = $255;
                            break;
                    };
                    var $248 = $248($246);
                    return $248;
                });
                var $234 = $247;
                break;
            case 'Word.e':
                var $257 = (_b$4 => {
                    var $258 = Word$e;
                    return $258;
                });
                var $234 = $257;
                break;
        };
        var $234 = $234(_b$3);
        return $234;
    };
    const Word$or = x0 => x1 => Word$or$(x0, x1);

    function Word$shift_right1$aux$(_word$2) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $260 = self.pred;
                var $261 = Word$o$(Word$shift_right1$aux$($260));
                var $259 = $261;
                break;
            case 'Word.i':
                var $262 = self.pred;
                var $263 = Word$i$(Word$shift_right1$aux$($262));
                var $259 = $263;
                break;
            case 'Word.e':
                var $264 = Word$o$(Word$e);
                var $259 = $264;
                break;
        };
        return $259;
    };
    const Word$shift_right1$aux = x0 => Word$shift_right1$aux$(x0);

    function Word$shift_right1$(_word$2) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $266 = self.pred;
                var $267 = Word$shift_right1$aux$($266);
                var $265 = $267;
                break;
            case 'Word.i':
                var $268 = self.pred;
                var $269 = Word$shift_right1$aux$($268);
                var $265 = $269;
                break;
            case 'Word.e':
                var $270 = Word$e;
                var $265 = $270;
                break;
        };
        return $265;
    };
    const Word$shift_right1 = x0 => Word$shift_right1$(x0);

    function Word$subber$(_a$2, _b$3, _c$4) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $272 = self.pred;
                var $273 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $275 = self.pred;
                            var $276 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $278 = Word$i$(Word$subber$(_a$pred$10, $275, Bool$true));
                                    var $277 = $278;
                                } else {
                                    var $279 = Word$o$(Word$subber$(_a$pred$10, $275, Bool$false));
                                    var $277 = $279;
                                };
                                return $277;
                            });
                            var $274 = $276;
                            break;
                        case 'Word.i':
                            var $280 = self.pred;
                            var $281 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $283 = Word$o$(Word$subber$(_a$pred$10, $280, Bool$true));
                                    var $282 = $283;
                                } else {
                                    var $284 = Word$i$(Word$subber$(_a$pred$10, $280, Bool$true));
                                    var $282 = $284;
                                };
                                return $282;
                            });
                            var $274 = $281;
                            break;
                        case 'Word.e':
                            var $285 = (_a$pred$8 => {
                                var $286 = Word$e;
                                return $286;
                            });
                            var $274 = $285;
                            break;
                    };
                    var $274 = $274($272);
                    return $274;
                });
                var $271 = $273;
                break;
            case 'Word.i':
                var $287 = self.pred;
                var $288 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $290 = self.pred;
                            var $291 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $293 = Word$o$(Word$subber$(_a$pred$10, $290, Bool$false));
                                    var $292 = $293;
                                } else {
                                    var $294 = Word$i$(Word$subber$(_a$pred$10, $290, Bool$false));
                                    var $292 = $294;
                                };
                                return $292;
                            });
                            var $289 = $291;
                            break;
                        case 'Word.i':
                            var $295 = self.pred;
                            var $296 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $298 = Word$i$(Word$subber$(_a$pred$10, $295, Bool$true));
                                    var $297 = $298;
                                } else {
                                    var $299 = Word$o$(Word$subber$(_a$pred$10, $295, Bool$false));
                                    var $297 = $299;
                                };
                                return $297;
                            });
                            var $289 = $296;
                            break;
                        case 'Word.e':
                            var $300 = (_a$pred$8 => {
                                var $301 = Word$e;
                                return $301;
                            });
                            var $289 = $300;
                            break;
                    };
                    var $289 = $289($287);
                    return $289;
                });
                var $271 = $288;
                break;
            case 'Word.e':
                var $302 = (_b$5 => {
                    var $303 = Word$e;
                    return $303;
                });
                var $271 = $302;
                break;
        };
        var $271 = $271(_b$3);
        return $271;
    };
    const Word$subber = x0 => x1 => x2 => Word$subber$(x0, x1, x2);

    function Word$sub$(_a$2, _b$3) {
        var $304 = Word$subber$(_a$2, _b$3, Bool$false);
        return $304;
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
                    var $305 = Pair$new$(Bool$true, Word$or$(_value$5, _mask$6));
                    var self = $305;
                } else {
                    var $306 = Pair$new$(Bool$false, _value$5);
                    var self = $306;
                };
                switch (self._) {
                    case 'Pair.new':
                        var $307 = self.fst;
                        var $308 = self.snd;
                        var self = _shift$2;
                        if (self === 0n) {
                            var $310 = $308;
                            var $309 = $310;
                        } else {
                            var $311 = (self - 1n);
                            var _new_shift_copy$9 = Word$shift_right1$(_shift_copy$4);
                            var self = $307;
                            if (self) {
                                var $313 = Word$div$go$($311, Word$sub$(_sub_copy$3, _shift_copy$4), _new_shift_copy$9, $308);
                                var $312 = $313;
                            } else {
                                var $314 = Word$div$go$($311, _sub_copy$3, _new_shift_copy$9, $308);
                                var $312 = $314;
                            };
                            var $309 = $312;
                        };
                        return $309;
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
            var $316 = Word$to_zero$(_a$2);
            var $315 = $316;
        } else {
            var _shift$6 = (_a_bits$4 - _b_bits$5 <= 0n ? 0n : _a_bits$4 - _b_bits$5);
            var _shift_copy$7 = Word$shift_left$(_shift$6, _b$3);
            var $317 = Word$div$go$(_shift$6, _a$2, _shift_copy$7, Word$to_zero$(_a$2));
            var $315 = $317;
        };
        return $315;
    };
    const Word$div = x0 => x1 => Word$div$(x0, x1);
    const U32$div = a0 => a1 => ((a0 / a1) >>> 0);
    const U32$length = a0 => ((a0.length) >>> 0);

    function Cmp$as_eql$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
            case 'Cmp.gtn':
                var $319 = Bool$false;
                var $318 = $319;
                break;
            case 'Cmp.eql':
                var $320 = Bool$true;
                var $318 = $320;
                break;
        };
        return $318;
    };
    const Cmp$as_eql = x0 => Cmp$as_eql$(x0);

    function Word$eql$(_a$2, _b$3) {
        var $321 = Cmp$as_eql$(Word$cmp$(_a$2, _b$3));
        return $321;
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
        var $322 = (parseInt(_chr$3, 16));
        return $322;
    };
    const VoxBox$parse_byte = x0 => x1 => VoxBox$parse_byte$(x0, x1);
    const U32$or = a0 => a1 => (a0 | a1);
    const U32$shl = a0 => a1 => ((a0 << a1) >>> 0);
    const Pos32$new = a0 => a1 => a2 => ((0 | a0 | (a1 << 12) | (a2 << 24)));
    const Col32$new = a0 => a1 => a2 => a3 => ((0 | a0 | (a1 << 8) | (a2 << 16) | (a3 << 24)));

    function Word$trim$(_new_size$2, _word$3) {
        var self = _new_size$2;
        if (self === 0n) {
            var $324 = Word$e;
            var $323 = $324;
        } else {
            var $325 = (self - 1n);
            var self = _word$3;
            switch (self._) {
                case 'Word.o':
                    var $327 = self.pred;
                    var $328 = Word$o$(Word$trim$($325, $327));
                    var $326 = $328;
                    break;
                case 'Word.i':
                    var $329 = self.pred;
                    var $330 = Word$i$(Word$trim$($325, $329));
                    var $326 = $330;
                    break;
                case 'Word.e':
                    var $331 = Word$o$(Word$trim$($325, Word$e));
                    var $326 = $331;
                    break;
            };
            var $323 = $326;
        };
        return $323;
    };
    const Word$trim = x0 => x1 => Word$trim$(x0, x1);
    const Unit$new = null;

    function Array$extract_tip$(_arr$2) {
        var self = _arr$2;
        switch (self._) {
            case 'Array.tip':
                var $333 = self.value;
                var $334 = $333;
                var $332 = $334;
                break;
            case 'Array.tie':
                var $335 = Unit$new;
                var $332 = $335;
                break;
        };
        return $332;
    };
    const Array$extract_tip = x0 => Array$extract_tip$(x0);

    function Array$extract_tie$(_arr$3) {
        var self = _arr$3;
        switch (self._) {
            case 'Array.tie':
                var $337 = self.lft;
                var $338 = self.rgt;
                var $339 = Pair$new$($337, $338);
                var $336 = $339;
                break;
            case 'Array.tip':
                var $340 = Unit$new;
                var $336 = $340;
                break;
        };
        return $336;
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
                        var $341 = self.pred;
                        var $342 = Word$foldl$(_w0$4(_nil$3), _w0$4, _w1$5, $341);
                        return $342;
                    case 'Word.i':
                        var $343 = self.pred;
                        var $344 = Word$foldl$(_w1$5(_nil$3), _w0$4, _w1$5, $343);
                        return $344;
                    case 'Word.e':
                        var $345 = _nil$3;
                        return $345;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Word$foldl = x0 => x1 => x2 => x3 => Word$foldl$(x0, x1, x2, x3);

    function Array$mut$(_idx$3, _f$4, _arr$5) {
        var $346 = Word$foldl$((_arr$6 => {
            var $347 = Array$tip$(_f$4(Array$extract_tip$(_arr$6)));
            return $347;
        }), (_rec$7 => _arr$8 => {
            var self = Array$extract_tie$(_arr$8);
            switch (self._) {
                case 'Pair.new':
                    var $349 = self.fst;
                    var $350 = self.snd;
                    var $351 = Array$tie$(_rec$7($349), $350);
                    var $348 = $351;
                    break;
            };
            return $348;
        }), (_rec$7 => _arr$8 => {
            var self = Array$extract_tie$(_arr$8);
            switch (self._) {
                case 'Pair.new':
                    var $353 = self.fst;
                    var $354 = self.snd;
                    var $355 = Array$tie$($353, _rec$7($354));
                    var $352 = $355;
                    break;
            };
            return $352;
        }), _idx$3)(_arr$5);
        return $346;
    };
    const Array$mut = x0 => x1 => x2 => Array$mut$(x0, x1, x2);

    function Array$set$(_idx$3, _val$4, _arr$5) {
        var $356 = Array$mut$(_idx$3, (_x$6 => {
            var $357 = _val$4;
            return $357;
        }), _arr$5);
        return $356;
    };
    const Array$set = x0 => x1 => x2 => Array$set$(x0, x1, x2);
    const Buffer32$set = a0 => a1 => a2 => ((a2[a0] = a1, a2));
    const VoxBox$set_pos = a0 => a1 => a2 => ((a2.buffer[a0 * 2] = a1, a2));
    const VoxBox$set_col = a0 => a1 => a2 => ((a2.buffer[a0 * 2 + 1] = a1, a2));

    function VoxBox$set_length$(_length$1, _img$2) {
        var self = _img$2;
        switch (self._) {
            case 'VoxBox.new':
                var $359 = self.capacity;
                var $360 = self.buffer;
                var $361 = VoxBox$new$(_length$1, $359, $360);
                var $358 = $361;
                break;
        };
        return $358;
    };
    const VoxBox$set_length = x0 => x1 => VoxBox$set_length$(x0, x1);
    const VoxBox$push = a0 => a1 => a2 => ((a2.buffer[a2.length * 2] = a0, a2.buffer[a2.length * 2 + 1] = a1, a2.length++, a2));

    function VoxBox$parse$(_voxdata$1) {
        var _siz$2 = ((((_voxdata$1.length) >>> 0) / 12) >>> 0);
        var _img$3 = VoxBox$alloc_capacity$(_siz$2);
        var _img$4 = (() => {
            var $363 = _img$3;
            var $364 = 0;
            var $365 = _siz$2;
            let _img$5 = $363;
            for (let _i$4 = $364; _i$4 < $365; ++_i$4) {
                var _x$6 = VoxBox$parse_byte$(((((_i$4 * 6) >>> 0) + 0) >>> 0), _voxdata$1);
                var _y$7 = VoxBox$parse_byte$(((((_i$4 * 6) >>> 0) + 1) >>> 0), _voxdata$1);
                var _z$8 = VoxBox$parse_byte$(((((_i$4 * 6) >>> 0) + 2) >>> 0), _voxdata$1);
                var _r$9 = VoxBox$parse_byte$(((((_i$4 * 6) >>> 0) + 3) >>> 0), _voxdata$1);
                var _g$10 = VoxBox$parse_byte$(((((_i$4 * 6) >>> 0) + 4) >>> 0), _voxdata$1);
                var _b$11 = VoxBox$parse_byte$(((((_i$4 * 6) >>> 0) + 5) >>> 0), _voxdata$1);
                var _pos$12 = ((0 | _x$6 | (_y$7 << 12) | (_z$8 << 24)));
                var _col$13 = ((0 | _r$9 | (_g$10 << 8) | (_b$11 << 16) | (255 << 24)));
                var $363 = ((_img$5.buffer[_img$5.length * 2] = _pos$12, _img$5.buffer[_img$5.length * 2 + 1] = _col$13, _img$5.length++, _img$5));
                _img$5 = $363;
            };
            return _img$5;
        })();
        var $362 = _img$4;
        return $362;
    };
    const VoxBox$parse = x0 => VoxBox$parse$(x0);
    const Web$Kaelin$Assets$hero$croni0_d_1 = VoxBox$parse$("0f0b16351d4d100b16351d4d0d0c15351d4d0e0c15351d4d0f0c156a3a86100c158e4a9d110c15351d4d120c15351d4d0c0d14351d4d0d0d146a3a860e0d146a3a860f0d148e4a9d100d146a3a86110d146a3a86120d146a3a86130d14351d4d0b0e13351d4d0c0e136a3a860d0e136a3a860e0e136a3a860f0e136a3a86100e136a3a86110e136a3a86120e136a3a86130e136a3a86140e13351d4d0a0f12351d4d0b0f126a3a860c0f126a3a860d0f126a3a860e0f126a3a860f0f126a3a86100f126a3a86110f126a3a86120f126a3a86130f126a3a86140f126a3a86150f12351d4d0a1011351d4d0b10116a3a860c10116a3a860d10116a3a860e10116a3a860f10116a3a861010116a3a861110116a3a861210116a3a861310116a3a861410116a3a86151011351d4d091110351d4d0a11106a3a860b11106a3a860c11106a3a860d11106a3a860e11106a3a860f11106a3a861011106a3a861111106a3a861211106a3a861311106a3a861411106a3a861511106a3a86161110351d4d09120f351d4d0a120f6a3a860b120f6a3a860c120f602d800d120f602d800e120f6a3a860f120f6a3a8610120f6a3a8611120f6a3a8612120f602d8013120f602d8014120f6a3a8615120f6a3a8616120f351d4d09130e351d4d0a130e602d800b130e602d800c130e351d4d0d130e351d4d0e130e6a3a860f130e6a3a8610130e6a3a8611130e6a3a8612130e351d4d13130e351d4d14130e602d8015130e602d8016130e351d4d09140d351d4d0a140d602d800b140d351d4d0c140d351d4d0d140d531e480e140d351d4d0f140d6a3a8610140d6a3a8611140d351d4d12140d531e4813140d351d4d14140d351d4d15140d4a358016140d351d4d09150c351d4d0a150c4a35800b150c351d4d0c150c531e480d150cdf3e460e150c531e480f150c351d4d10150c351d4d11150c531e4812150cdf3e4613150c531e4814150c351d4d15150c4a358016150c351d4d0a160b351d4d0b160b4a35800c160b351d4d0d160b531e480e160b351d4d0f160b351d4d10160b351d4d11160b351d4d12160b531e4813160b351d4d14160b4a358015160b351d4d0b170a351d4d0c170a4a35800d170a8e4a9d0e170a351d4d0f170a351d4d10170a351d4d11170a351d4d12170a8e4a9d13170a4a358014170a351d4d0d1809351d4d0e1809602d800f1809602d801018094a3580111809602d80121809351d4d0c1908351d4d0d19086a3a860e19086a3a860f19086a3a861019084a35801119086a3a861219086a3a86131908351d4d0c1a07351d4d0d1a076a3a860e1a076a3a860f1a076a3a86101a074a3580111a076a3a86121a076a3a86131a07351d4d0c1b06351d4d0d1b068e4a9d0e1b066a3a860f1b066a3a86101b064a3580111b066a3a86121b068e4a9d131b06351d4d0d1c05351d4d0e1c05351d4d0f1c05351d4d101c05351d4d111c05351d4d121c05351d4d111d04351d4d121d04351d4d");
    const Web$Kaelin$Hero$croni = Web$Kaelin$Hero$new$(1, Web$Kaelin$Assets$hero$croni0_d_1);
    const Web$Kaelin$Assets$hero$cyclope_d_1 = VoxBox$parse$("0e0a212c333d0f0a212c333d100a212c333d110a212c333d0d0b202c333d0e0b20fff9e10f0b20fff9e1100b20fff9e1110b20fff9e1120b202c333d0d0c1f2c333d0e0c1ffff9e10f0c1ffff9e1100c1ffff9e1110c1ffff9e1120c1f2c333d0c0d1e2729600d0d1e2729600e0d1efff9e10f0d1eccc8b7100d1eccc8b7110d1eccc8b7120d1e272960130d1e272960140d1e2729600c0e1d2729600d0e1d2729600e0e1dfff9e10f0e1dccc8b7100e1dccc8b7110e1dccc8b7120e1d272960130e1d272960140e1d272960050f1c272960060f1c272960070f1c272960090f1c2729600a0f1c2729600b0f1c2729600c0f1c5176b80d0f1cfff9e10e0f1cdfdbc80f0f1cdfdbc8100f1cdfdbc8110f1cdfdbc8120f1cccc8b7130f1c5176b8140f1c5176b8150f1c27296005101b27296006101b799cd307101b799cd308101b27296009101b5176b80a101b5176b80b101b5176b80c101b799cd30d101b5176b80e101bdfdbc80f101bccc8b710101bccc8b711101bccc8b712101b5176b813101b799cd314101b799cd315101b5176b816101b27296017101b27296018101b27296005111a27296006111a799cd307111a799cd308111a27296009111a5176b80a111a5176b80b111a5176b80c111a799cd30d111a5176b80e111adfdbc80f111accc8b710111accc8b711111accc8b712111a5176b813111a799cd314111a799cd315111a5176b816111a27296017111a27296018111a2729600512192729600612195176b80712195176b8081219394c87091219799cd30a1219799cd30b1219799cd30c12195176b80d12194a2b710e12194a2b710f12194a2b711012194a2b711112194a2b711212194a2b711312195176b81412195176b8151219799cd31612192729601712192729601812192729600513182729600613185176b80713185176b8081318394c87091318799cd30a1318799cd30b1318799cd30c13185176b80d13184a2b710e13184a2b710f13184a2b711013184a2b711113184a2b711213184a2b711313185176b81413185176b8151318799cd3161318272960171318272960181318272960051417272960061417272960071417272960081417394c870914175176b80a14175176b80b14175176b80c14174a2b710d1417dab04d0e1417dab04d0f1417dab04d101417dab04d111417dab04d121417dab04d1314174a2b711414174a2b711514175176b8161417394c87171417394c87181417394c871914172729601a1417272960051516272960061516799cd3071516799cd3081516394c870915165176b80a15165176b80b15165176b80c15164a2b710d1516dab04d0e1516fff9e10f1516fff9e1101516fff9e1111516fff9e1121516dab04d1315164a2b711415164a2b711515165176b8161516394c87171516394c87181516394c87191516799cd31a1516272960051615272960061615799cd3071615799cd3081615394c870916155176b80a16155176b80b16155176b80c16154a2b710d1615dab04d0e1615fff9e10f1615fff9e1101615fff9e1111615fff9e1121615dab04d1316154a2b711416154a2b711516155176b8161615394c87171615394c87181615394c87191615799cd31a1615272960051714272960061714272960071714272960081714394c870917145176b80a17145176b80b17145176b80c17144a2b710d1714dab04d0e17142421260f1714242126101714242126111714242126121714dab04d1317144a2b711417144a2b711517145176b8161714394c87171714394c87181714394c871917142729601a17145176b81b17142729600518132729600618135176b80718135176b8081813394c870918135176b80a18135176b80b18135176b80c18135176b80d18134a2b710e18134a2b710f18134a2b711018134a2b711118134a2b711218134a2b711318135176b81418135176b81518135176b8161813394c87171813394c87181813394c87191813799cd31a1813799cd31b18132729600519122729600619125176b80719125176b8081912394c870919125176b80a19125176b80b19125176b80c19125176b80d19124a2b710e19124a2b710f19124a2b711019124a2b711119124a2b711219124a2b711319125176b81419125176b81519125176b8161912394c87171912394c87181912394c87191912799cd31a1912799cd31b1912272960051a11272960061a115176b8071a115176b8081a11394c87091a115176b80a1a115176b80b1a115176b80c1a115176b80d1a114a2b710e1a114a2b710f1a114a2b71101a114a2b71111a114a2b71121a114a2b71131a115176b8141a115176b8151a115176b8161a11394c87171a11394c87181a11394c87191a11799cd31a1a11799cd31b1a11272960051b10272960061b10799cd3071b10799cd3081b105176b8091b10394c870a1b10394c870b1b10394c870c1b10dfdbc80d1b105176b80e1b105176b80f1b105176b8101b105176b8111b105176b8121b105176b8131b10dfdbc8141b10dfdbc8151b10394c87161b105176b8171b105176b8181b105176b8191b105176b81a1b10799cd31b1b10272960061c0f272960071c0f272960081c0f272960091c0f394c870a1c0f394c870b1c0f394c870c1c0fdfdbc80d1c0f4662a10e1c0f4662a10f1c0f4662a1101c0f4662a1111c0f4662a1121c0f4662a1131c0fdfdbc8141c0fdfdbc8151c0f394c87161c0f394c87171c0f394c87181c0f394c87191c0f5176b81a1c0f5176b81b1c0f272960081d0e272960091d0e5176b80a1d0e5176b80b1d0e5176b80c1d0e394c870d1d0e394c870e1d0e394c870f1d0e394c87101d0e394c87111d0e394c87121d0e394c87131d0e394c87141d0e394c87151d0e5176b8161d0e394c87171d0e394c87181d0e394c87191d0e5176b81a1d0e5176b81b1d0e272960081e0d272960091e0d5176b80a1e0d5176b80b1e0d5176b80c1e0d394c870d1e0d394c870e1e0d394c870f1e0d394c87101e0d394c87111e0d394c87121e0d394c87131e0d394c87141e0d394c87151e0d5176b8161e0d394c87171e0d394c87181e0d394c87191e0d5176b81a1e0d5176b81b1e0d272960081f0c272960091f0c5176b80a1f0c5176b80b1f0c5176b80c1f0c394c870d1f0c394c870e1f0c394c870f1f0c394c87101f0c394c87111f0c394c87121f0c394c87131f0c394c87141f0c394c87151f0c5176b8161f0c394c87171f0c394c87181f0c394c87191f0c5176b81a1f0c5176b81b1f0c27296008200b27296009200b5176b80a200b5176b80b200b5176b80c200b5176b80d200b5176b80e200b5176b80f200b5176b810200b5176b811200b5176b812200b5176b813200b5176b814200b5176b815200b394c8716200b799cd317200b799cd318200b799cd319200b5176b81a200b5176b81b200b27296008210a27296009210a8e4a9d0a210a8e4a9d0b210a8e4a9d0c210a8e4a9d0d210a5176b80e210a5176b80f210a5176b810210a5176b811210a5176b812210a5176b813210a394c8714210a394c8715210a394c8716210a799cd317210a799cd318210a799cd319210a799cd31a210a5176b81b210a2729600922092729600a22092729600b22092729600c22094a2b710d22098e4a9d0e22098e4a9d0f22098e4a9d1022098e4a9d1122098e4a9d1222098e4a9d132209394c87142209394c871522095176b8162209394c87172209394c87182209394c87192209394c871a22092729600923082729600a23082729600b23082729600c23084a2b710d23088e4a9d0e23088e4a9d0f23088e4a9d1023088e4a9d1123088e4a9d1223088e4a9d132308394c87142308394c871523085176b8162308394c87172308394c87182308394c87192308394c871a23082729600924072729600a24072729600b24072729600c24074a2b710d24078e4a9d0e24078e4a9d0f24078e4a9d1024078e4a9d1124078e4a9d1224078e4a9d132407394c87142407394c871524075176b8162407394c87172407394c87182407394c87192407394c871a24072729600925062729600a25062729600b25062729600c25065176b80d25064a2b710e25068e4a9d0f25068e4a9d1025068e4a9d1125068e4a9d1225064a2b71132506394c87142506394c87152506799cd3162506799cd3172506799cd3182506799cd31925065176b81a25062729600926052729600a26052729600b26052729600c2605799cd30d2605799cd30e26054a2b710f26054a2b711026054a2b711126054a2b711226052729601326052729601426052729601526052729601626052729601726052729601826052729601926052729600927042729600a27042729600b27042729600c27042729600d27042729600e2704272960");
    const Web$Kaelin$Hero$cyclope = Web$Kaelin$Hero$new$(2, Web$Kaelin$Assets$hero$cyclope_d_1);
    const Web$Kaelin$Assets$hero$lela_d_1 = VoxBox$parse$("091219fb4d4d0a1219fb4d4d0b1219fb4d4d0c1219fb4d4d131219fb4d4d141219fb4d4d151219fb4d4d161219fb4d4d081318fb4d4d0913182b496c0a13182b496c0b13182b496c0c13182b496c0d1318fb4d4d121318fb4d4d1313182b496c1413182b496c1513182b496c1613182b496c171318fb4d4d071417fb4d4d0814172b496c09141781aeff0a141781aeff0b141781aeff0c141781aeff0d14172b496c0e1417fb4d4d0f1417fb4d4d101417fb4d4d111417fb4d4d1214172b496c13141781aeff14141781aeff15141781aeff16141781aeff1714172b496c181417fb4d4d071516fb4d4d0815161f3b5b091516538ccf0a1516538ccf0b1516538ccf0c1516538ccf0d1516538ccf0e15162b496c0f15162b496c1015162b496c1115162b496c121516538ccf131516538ccf141516538ccf151516538ccf161516538ccf1715161f3b5b181516fb4d4d071615fb4d4d0816151f3b5b091615538ccf0a1615538ccf0b1615538ccf0c1615538ccf0d1615538ccf0e161581aeff0f161581aeff10161581aeff11161581aeff121615538ccf131615538ccf141615538ccf151615538ccf161615538ccf1716151f3b5b181615fb4d4d071714fb4d4d0817141f3b5b091714538ccf0a1714538ccf0b1714538ccf0c1714538ccf0d1714538ccf0e1714538ccf0f1714538ccf101714538ccf111714538ccf121714538ccf131714538ccf141714538ccf151714538ccf161714538ccf1717141f3b5b181714fb4d4d081813fb4d4d0918131f3b5b0a1813538ccf0b1813538ccf0c1813538ccf0d1813538ccf0e1813538ccf0f1813cb4646101813cb4646111813538ccf121813538ccf131813538ccf141813538ccf151813538ccf1618131f3b5b171813fb4d4d091912fb4d4d0a19121f3b5b0b1912538ccf0c1912538ccf0d1912538ccf0e1912538ccf0f1912ad1f1f101912ad1f1f111912538ccf121912538ccf131912538ccf141912538ccf1519121f3b5b161912fb4d4d091a11fb4d4d0a1a111f3b5b0b1a11538ccf0c1a11538ccf0d1a11cb46460e1a11538ccf0f1a11538ccf101a11538ccf111a11538ccf121a11cb4646131a11538ccf141a11538ccf151a111f3b5b161a11fb4d4d091b10fb4d4d0a1b101f3b5b0b1b10538ccf0c1b10538ccf0d1b10ad1f1f0e1b10538ccf0f1b103d5497101b103d5497111b10538ccf121b10ad1f1f131b10538ccf141b10538ccf151b101f3b5b161b10fb4d4d0a1c0ffb4d4d0b1c0f1f3b5b0c1c0f538ccf0d1c0f538ccf0e1c0f538ccf0f1c0f2d4382101c0f2d4382111c0f538ccf121c0f538ccf131c0f538ccf141c0f1f3b5b151c0ffb4d4d0b1d0efb4d4d0c1d0e1f3b5b0d1d0e3a67b70e1d0e538ccf0f1d0e203368101d0e203368111d0e538ccf121d0e3a67b7131d0e1f3b5b141d0efb4d4d0a1e0dfb4d4d0b1e0d1f3b5b0c1e0d538ccf0d1e0d538ccf0e1e0d3a67b70f1e0d3a67b7101e0d3a67b7111e0d3a67b7121e0d538ccf131e0d538ccf141e0d1f3b5b151e0dfb4d4d091f0cfb4d4d0a1f0c1f3b5b0b1f0c81aeff0c1f0c3a71b10d1f0c538ccf0e1f0c81aeff0f1f0c81aeff101f0c81aeff111f0c81aeff121f0c538ccf131f0c3a71b1141f0c81aeff151f0c1f3b5b161f0cfb4d4d08200bfb4d4d09200b1f3b5b0a200b538ccf0b200b538ccf0c200b3a71b10d200b538ccf0e200b538ccf0f200b538ccf10200b538ccf11200b538ccf12200b538ccf13200b3a71b114200b538ccf15200b538ccf16200b1f3b5b17200bfb4d4d08210afb4d4d09210a1f3b5b0a210a538ccf0b210a538ccf0c210a3a71b10d210a538ccf0e210a538ccf0f210a538ccf10210a538ccf11210a538ccf12210a538ccf13210a3a71b114210a538ccf15210a538ccf16210a1f3b5b17210afb4d4d082209fb4d4d0922091f3b5b0a2209538ccf0b2209538ccf0c22092753860d2209538ccf0e2209538ccf0f2209538ccf102209538ccf112209538ccf122209538ccf132209275386142209538ccf152209538ccf1622091f3b5b172209fb4d4d092308fb4d4d0a23081f3b5b0b23081f3b5b0c23081f3b5b0d23083a67b70e2308538ccf0f2308538ccf102308538ccf112308538ccf1223083a67b71323081f3b5b1423081f3b5b1523081f3b5b162308fb4d4d0a2407fb4d4d0b2407fb4d4d0c2407fb4d4d0d24071f3b5b0e24073a67b70f2407538ccf102407538ccf1124073a67b71224071f3b5b132407fb4d4d142407fb4d4d152407fb4d4d0d2506fb4d4d0e25061f3b5b0f25063a67b71025063a67b71125061f3b5b122506fb4d4d0e2605fb4d4d0f26051f3b5b1026051f3b5b112605fb4d4d0f2704fb4d4d102704fb4d4d");
    const Web$Kaelin$Hero$lela = Web$Kaelin$Hero$new$(3, Web$Kaelin$Assets$hero$lela_d_1);
    const Web$Kaelin$Assets$hero$octoking_d_1 = VoxBox$parse$("0a0a21192a020b0a21192a020d0a21192a020e0a21192a02100a21192a02110a21192a02120a21192a02130a21192a02150a21192a02160a21192a02180a21192a02190a21192a020a0b20192a020b0b20192a020d0b20192a020e0b20192a02100b20192a02110b20192a02120b20192a02130b20192a02150b20192a02160b20192a02180b20192a02190b20192a02080c1f192a02090c1f192a020a0c1fe6d7510b0c1fe6d7510c0c1f192a020d0c1f70681e0e0c1f70681e0f0c1f192a02100c1ffff6a6110c1ffff6a6120c1ffff6a6130c1ffff6a6140c1f192a02150c1f70681e160c1f70681e170c1f192a02180c1fe6d751190c1fe6d7511a0c1f192a021b0c1f192a02080d1e192a02090d1e192a020a0d1ee6d7510b0d1ee6d7510c0d1efff6a60d0d1e192a020e0d1e192a020f0d1ee6d751100d1ee6d751110d1ee6d751120d1ee6d751130d1ee6d751140d1ee6d751150d1e192a02160d1e192a02170d1efff6a6180d1ee6d751190d1ee6d7511a0d1e192a021b0d1e192a02080e1d192a02090e1d192a020a0e1de6d7510b0e1de6d7510c0e1dfff6a60d0e1d192a020e0e1d192a020f0e1de6d751100e1de6d751110e1de6d751120e1de6d751130e1de6d751140e1de6d751150e1d192a02160e1d192a02170e1dfff6a6180e1de6d751190e1de6d7511a0e1d192a021b0e1d192a02080f1c192a02090f1c192a020a0f1cc9ae530b0f1cc9ae530c0f1ce6d7510d0f1ce6d7510e0f1ce6d7510f0f1ce6d751100f1cb8321d110f1cb8321d120f1cb8321d130f1cb8321d140f1ce6d751150f1ce6d751160f1ce6d751170f1ce6d751180f1cc9ae53190f1cc9ae531a0f1c192a021b0f1c192a0208101b192a0209101b192a020a101bc9ae530b101bc9ae530c101be6d7510d101be6d7510e101be6d7510f101be6d75110101bb8321d11101bb8321d12101bb8321d13101bb8321d14101be6d75115101be6d75116101be6d75117101be6d75118101bc9ae5319101bc9ae531a101b192a021b101b192a0205111a192a0206111a192a0207111a192a0208111a192a0209111a192a020a111a4281350b111a4281350c111a4281350d111a4281350e111a4281350f111ac9ae5310111ac9ae5311111ac9ae5312111ac9ae5313111ac9ae5314111ac9ae5315111a42813516111a42813517111a42813518111a42813519111a4281351a111a192a021b111a192a021c111a192a021d111a192a021e111a192a02041219192a020512199fd95d0612199fd95d0712199fd95d081219192a02091219192a020a12199fd95d0b12199fd95d0c12195ea6420d12195ea6420e12195ea6420f12194281351012194281351112194281351212194281351312194281351412194281351512195ea6421612195ea6421712195ea6421812199fd95d1912199fd95d1a1219192a021b1219192a021c12199fd95d1d12199fd95d1e12199fd95d1f1219192a02041318192a020513189fd95d0613189fd95d0713189fd95d081318192a02091318192a020a13189fd95d0b13189fd95d0c13185ea6420d13185ea6420e13185ea6420f13184281351013184281351113184281351213184281351313184281351413184281351513185ea6421613185ea6421713185ea6421813189fd95d1913189fd95d1a1318192a021b1318192a021c13189fd95d1d13189fd95d1e13189fd95d1f1318192a02021417192a02031417192a020414179fd95d0514175ea6420614175ea6420714175ea642081417192a02091417192a020a14175ea6420b14175ea6420c14175ea6420d14175ea6420e14175ea6420f14175ea6421014175ea6421114175ea6421214175ea6421314175ea6421414175ea6421514175ea6421614175ea6421714175ea6421814175ea6421914175ea6421a1417192a021b1417192a021c14175ea6421d14175ea6421e14175ea6421f14179fd95d201417192a02211417192a02041516192a020515165ea6420615165ea6420715165ea642081516192a02091516192a020a15164281350b15164281350c15164281350d15164281350e15164281350f15164281351015165ea6421115165ea6421215165ea6421315165ea6421415164281351515164281351615164281351715164281351815164281351915164281351a1516192a021b1516192a021c15165ea6421d15165ea6421e15165ea6421f1516192a02041615192a020516155ea6420616155ea6420716155ea642081615192a02091615192a020a16154281350b16154281350c16154281350d16154281350e16154281350f16154281351016155ea6421116155ea6421216155ea6421316155ea6421416154281351516154281351616154281351716154281351816154281351916154281351a1615192a021b1615192a021c16155ea6421d16155ea6421e16155ea6421f1615192a02051714192a02061714192a020717145ea6420817145ea6420917145ea6420a1714192a020b1714192a020c17144281350d1714e6d7510e1714e6d7510f1714e6d751101714428135111714428135121714428135131714428135141714e6d751151714e6d751161714e6d751171714428135181714192a02191714192a021a17145ea6421b17145ea6421c17145ea6421d1714192a021e1714192a02071813192a020818135ea6420918135ea6420a1813366d2a0b1813366d2a0c1813192a020d18134281350e18134281350f1813173e0f101813173e0f111813173e0f121813173e0f131813173e0f141813173e0f151813428135161813428135171813192a02181813366d2a191813366d2a1a18135ea6421b18135ea6421c1813192a02071912192a020819125ea6420919125ea6420a1912366d2a0b1912366d2a0c1912192a020d19124281350e19124281350f1912173e0f101912173e0f111912173e0f121912173e0f131912173e0f141912173e0f151912428135161912428135171912192a02181912366d2a191912366d2a1a19125ea6421b19125ea6421c1912192a02051a11192a02061a11192a02071a11192a02081a11428135091a114281350a1a115ea6420b1a115ea6420c1a114281350d1a11192a020e1a11192a020f1a119fd95d101a119fd95d111a119fd95d121a119fd95d131a119fd95d141a119fd95d151a11192a02161a11192a02171a11428135181a115ea642191a115ea6421a1a114281351b1a114281351c1a11192a021d1a11192a021e1a11192a02051b10192a02061b10192a02071b10192a02081b10428135091b104281350a1b105ea6420b1b105ea6420c1b104281350d1b10192a020e1b10192a020f1b109fd95d101b109fd95d111b109fd95d121b109fd95d131b109fd95d141b109fd95d151b10192a02161b10192a02171b10428135181b105ea642191b105ea6421a1b104281351b1b104281351c1b10192a021d1b10192a021e1b10192a02041c0f192a02051c0f366d2a061c0f366d2a071c0f192a02081c0f5ea642091c0f5ea6420a1c0f4281350b1c0f4281350c1c0f192a020d1c0f9fd95d0e1c0f9fd95d0f1c0f5ea642101c0f428135111c0f428135121c0f428135131c0f428135141c0f5ea642151c0f9fd95d161c0f9fd95d171c0f192a02181c0f428135191c0f4281351a1c0f5ea6421b1c0f5ea6421c1c0f192a021d1c0f366d2a1e1c0f366d2a1f1c0f192a02021d0e192a02031d0e192a02041d0e428135051d0e428135061d0e428135071d0e192a02081d0e428135091d0e4281350a1d0e4281350b1d0e4281350c1d0e192a020d1d0e5ea6420e1d0e5ea6420f1d0e5ea642101d0e428135111d0e428135121d0e428135131d0e428135141d0e5ea642151d0e5ea642161d0e5ea642171d0e192a02181d0e428135191d0e4281351a1d0e4281351b1d0e4281351c1d0e192a021d1d0e4281351e1d0e4281351f1d0e428135201d0e192a02211d0e192a02021e0d192a02031e0d192a02041e0d428135051e0d428135061e0d428135071e0d192a02081e0d428135091e0d4281350a1e0d4281350b1e0d4281350c1e0d192a020d1e0d5ea6420e1e0d5ea6420f1e0d5ea642101e0d428135111e0d428135121e0d428135131e0d428135141e0d5ea642151e0d5ea642161e0d5ea642171e0d192a02181e0d428135191e0d4281351a1e0d4281351b1e0d4281351c1e0d192a021d1e0d4281351e1e0d4281351f1e0d428135201e0d192a02211e0d192a02001f0c192a02011f0c192a02021f0c9fd95d031f0c9fd95d041f0c5ea642051f0c428135061f0c428135071f0c192a02081f0c5ea642091f0c5ea6420a1f0c4281350b1f0c4281350c1f0c192a020d1f0c5ea6420e1f0c5ea6420f1f0c5ea642101f0c428135111f0c428135121f0c428135131f0c428135141f0c5ea642151f0c5ea642161f0c5ea642171f0c192a02181f0c428135191f0c4281351a1f0c5ea6421b1f0c5ea6421c1f0c192a021d1f0c4281351e1f0c4281351f1f0c5ea642201f0c9fd95d211f0c9fd95d221f0c192a0202200b192a0203200b192a0204200b192a0205200b42813506200b42813507200b42813508200b192a0209200b192a020a200b366d2a0b200b366d2a0c200b192a020d200b5ea6420e200b5ea6420f200b5ea64210200b42813511200b42813512200b42813513200b42813514200b5ea64215200b5ea64216200b5ea64217200b192a0218200b366d2a19200b366d2a1a200b192a021b200b192a021c200b4281351d200b4281351e200b4281351f200b192a0220200b192a0221200b192a0202210a192a0203210a192a0204210a192a0205210a42813506210a42813507210a42813508210a192a0209210a192a020a210a366d2a0b210a366d2a0c210a192a020d210a5ea6420e210a5ea6420f210a5ea64210210a42813511210a42813512210a42813513210a42813514210a5ea64215210a5ea64216210a5ea64217210a192a0218210a366d2a19210a366d2a1a210a192a021b210a192a021c210a4281351d210a4281351e210a4281351f210a192a0220210a192a0221210a192a02052209192a02062209192a02072209192a020a2209192a020b2209192a020c2209192a020d22095ea6420e22095ea6420f22094281351022094281351122094281351222094281351322094281351422094281351522095ea6421622095ea642172209192a02182209192a02192209192a021c2209192a021d2209192a021e2209192a02052308192a02062308192a02072308192a020a2308192a020b2308192a020c2308192a020d23085ea6420e23085ea6420f23084281351023084281351123084281351223084281351323084281351423084281351523085ea6421623085ea642172308192a02182308192a02192308192a021c2308192a021d2308192a021e2308192a02082407192a02092407192a020a2407192a020b2407192a020c24075ea6420d24074281350e24074281350f2407428135102407366d2a112407366d2a122407366d2a132407366d2a1424074281351524074281351624074281351724075ea642182407192a02192407192a021a2407192a021b2407192a02072506192a020825065ea6420925065ea6420a25065ea6420b25065ea6420c25064281350d25064281350e25064281350f2506366d2a102506192a02112506192a02122506192a02132506192a02142506366d2a1525064281351625064281351725064281351825065ea6421925065ea6421a25065ea6421b25065ea6421c2506192a02072605192a020826055ea6420926055ea6420a26055ea6420b26055ea6420c26054281350d26054281350e26054281350f2605366d2a102605192a02112605192a02122605192a02132605192a02142605366d2a1526054281351626054281351726054281351826055ea6421926055ea6421a26055ea6421b26055ea6421c2605192a02082704192a02092704192a020a2704192a020b2704192a020c2704192a020d2704192a020e2704192a020f2704192a02142704192a02152704192a02162704192a02172704192a02182704192a02192704192a021a2704192a021b2704192a02");
    const Web$Kaelin$Hero$octoking = Web$Kaelin$Hero$new$(4, Web$Kaelin$Assets$hero$octoking_d_1);

    function Maybe$default$(_m$2, _a$3) {
        var self = _m$2;
        switch (self._) {
            case 'Maybe.some':
                var $367 = self.value;
                var $368 = $367;
                var $366 = $368;
                break;
            case 'Maybe.none':
                var $369 = _a$3;
                var $366 = $369;
                break;
        };
        return $366;
    };
    const Maybe$default = x0 => x1 => Maybe$default$(x0, x1);

    function List$(_A$1) {
        var $370 = null;
        return $370;
    };
    const List = x0 => List$(x0);

    function Cmp$as_gtn$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
            case 'Cmp.eql':
                var $372 = Bool$false;
                var $371 = $372;
                break;
            case 'Cmp.gtn':
                var $373 = Bool$true;
                var $371 = $373;
                break;
        };
        return $371;
    };
    const Cmp$as_gtn = x0 => Cmp$as_gtn$(x0);

    function Nat$cmp$(_a$1, _b$2) {
        var Nat$cmp$ = (_a$1, _b$2) => ({
            ctr: 'TCO',
            arg: [_a$1, _b$2]
        });
        var Nat$cmp = _a$1 => _b$2 => Nat$cmp$(_a$1, _b$2);
        var arg = [_a$1, _b$2];
        while (true) {
            let [_a$1, _b$2] = arg;
            var R = (() => {
                var self = _a$1;
                if (self === 0n) {
                    var self = _b$2;
                    if (self === 0n) {
                        var $375 = Cmp$eql;
                        var $374 = $375;
                    } else {
                        var $376 = (self - 1n);
                        var $377 = Cmp$ltn;
                        var $374 = $377;
                    };
                    return $374;
                } else {
                    var $378 = (self - 1n);
                    var self = _b$2;
                    if (self === 0n) {
                        var $380 = Cmp$gtn;
                        var $379 = $380;
                    } else {
                        var $381 = (self - 1n);
                        var $382 = Nat$cmp$($378, $381);
                        var $379 = $382;
                    };
                    return $379;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Nat$cmp = x0 => x1 => Nat$cmp$(x0, x1);
    const Nat$add = a0 => a1 => (a0 + a1);

    function Int$cmp$(_a$1, _b$2) {
        var self = _a$1;
        switch ("new") {
            case 'new':
                var $384 = int_pos(self);
                var $385 = int_neg(self);
                var self = _b$2;
                switch ("new") {
                    case 'new':
                        var $387 = int_pos(self);
                        var $388 = int_neg(self);
                        var $389 = Nat$cmp$(($384 + $388), ($387 + $385));
                        var $386 = $389;
                        break;
                };
                var $383 = $386;
                break;
        };
        return $383;
    };
    const Int$cmp = x0 => x1 => Int$cmp$(x0, x1);

    function Int$gtn$(_a$1, _b$2) {
        var $390 = Cmp$as_gtn$(Int$cmp$(_a$1, _b$2));
        return $390;
    };
    const Int$gtn = x0 => x1 => Int$gtn$(x0, x1);
    const Int$add = a0 => a1 => (a0 + a1);

    function Int$neg$(_a$1) {
        var self = _a$1;
        switch ("new") {
            case 'new':
                var $392 = int_pos(self);
                var $393 = int_neg(self);
                var $394 = ($393 - $392);
                var $391 = $394;
                break;
        };
        return $391;
    };
    const Int$neg = x0 => Int$neg$(x0);
    const Int$sub = a0 => a1 => (a0 - a1);
    const Nat$mul = a0 => a1 => (a0 * a1);
    const Int$mul = a0 => a1 => (a0 * a1);

    function Int$to_nat$(_a$1) {
        var self = _a$1;
        switch ("new") {
            case 'new':
                var $396 = int_pos(self);
                var $397 = $396;
                var $395 = $397;
                break;
        };
        return $395;
    };
    const Int$to_nat = x0 => Int$to_nat$(x0);

    function Arith$Z_to_N$(_n$1) {
        var self = Int$gtn$(_n$1, Int$from_nat$(0n));
        if (self) {
            var $399 = ((Int$from_nat$(2n) * _n$1) - Int$from_nat$(1n));
            var _bij$2 = $399;
        } else {
            var $400 = (Int$neg$(Int$from_nat$(2n)) * _n$1);
            var _bij$2 = $400;
        };
        var $398 = Int$to_nat$(_bij$2);
        return $398;
    };
    const Arith$Z_to_N = x0 => Arith$Z_to_N$(x0);

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

    function Word$fold$(_nil$3, _w0$4, _w1$5, _word$6) {
        var self = _word$6;
        switch (self._) {
            case 'Word.o':
                var $408 = self.pred;
                var $409 = _w0$4(Word$fold$(_nil$3, _w0$4, _w1$5, $408));
                var $407 = $409;
                break;
            case 'Word.i':
                var $410 = self.pred;
                var $411 = _w1$5(Word$fold$(_nil$3, _w0$4, _w1$5, $410));
                var $407 = $411;
                break;
            case 'Word.e':
                var $412 = _nil$3;
                var $407 = $412;
                break;
        };
        return $407;
    };
    const Word$fold = x0 => x1 => x2 => x3 => Word$fold$(x0, x1, x2, x3);

    function Word$to_nat$(_word$2) {
        var $413 = Word$fold$(0n, a1 => (2n * a1), (_x$4 => {
            var $414 = Nat$succ$((2n * _x$4));
            return $414;
        }), _word$2);
        return $413;
    };
    const Word$to_nat = x0 => Word$to_nat$(x0);

    function Word$abs$(_a$2) {
        var _neg$3 = Word$is_neg$(_a$2);
        var self = _neg$3;
        if (self) {
            var $416 = Word$neg$(_a$2);
            var $415 = $416;
        } else {
            var $417 = _a$2;
            var $415 = $417;
        };
        return $415;
    };
    const Word$abs = x0 => Word$abs$(x0);

    function Word$to_int$(_a$2) {
        var _neg$3 = Word$is_neg$(_a$2);
        var _i$4 = Int$from_nat$(Word$to_nat$(Word$abs$(_a$2)));
        var self = _neg$3;
        if (self) {
            var $419 = Int$neg$(_i$4);
            var $418 = $419;
        } else {
            var $420 = _i$4;
            var $418 = $420;
        };
        return $418;
    };
    const Word$to_int = x0 => Word$to_int$(x0);

    function I32$to_int$(_a$1) {
        var self = _a$1;
        switch ('i32') {
            case 'i32':
                var $422 = i32_to_word(self);
                var $423 = Word$to_int$($422);
                var $421 = $423;
                break;
        };
        return $421;
    };
    const I32$to_int = x0 => I32$to_int$(x0);

    function Pair$fst$(_pair$3) {
        var self = _pair$3;
        switch (self._) {
            case 'Pair.new':
                var $425 = self.fst;
                var $426 = $425;
                var $424 = $426;
                break;
        };
        return $424;
    };
    const Pair$fst = x0 => Pair$fst$(x0);

    function Either$(_A$1, _B$2) {
        var $427 = null;
        return $427;
    };
    const Either = x0 => x1 => Either$(x0, x1);

    function Either$left$(_value$3) {
        var $428 = ({
            _: 'Either.left',
            'value': _value$3
        });
        return $428;
    };
    const Either$left = x0 => Either$left$(x0);

    function Either$right$(_value$3) {
        var $429 = ({
            _: 'Either.right',
            'value': _value$3
        });
        return $429;
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
                    var $430 = Either$left$(_n$1);
                    return $430;
                } else {
                    var $431 = (self - 1n);
                    var self = _n$1;
                    if (self === 0n) {
                        var $433 = Either$right$(Nat$succ$($431));
                        var $432 = $433;
                    } else {
                        var $434 = (self - 1n);
                        var $435 = Nat$sub_rem$($434, $431);
                        var $432 = $435;
                    };
                    return $432;
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
                        var $436 = self.value;
                        var $437 = Nat$div_mod$go$($436, _m$2, Nat$succ$(_d$3));
                        return $437;
                    case 'Either.right':
                        var $438 = Pair$new$(_d$3, _n$1);
                        return $438;
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
    const Nat$div = a0 => a1 => (a0 / a1);

    function Arith$NxN_to_N$(_pair$1) {
        var self = _pair$1;
        switch (self._) {
            case 'Pair.new':
                var $440 = self.fst;
                var $441 = self.snd;
                var $442 = (((($440 + $441) * ($440 + ($441 + 1n))) / 2n) + $441);
                var $439 = $442;
                break;
        };
        return $439;
    };
    const Arith$NxN_to_N = x0 => Arith$NxN_to_N$(x0);

    function Web$Kaelin$Coord$Convert$axial_to_nat$(_coord$1) {
        var self = _coord$1;
        switch (self._) {
            case 'Web.Kaelin.Coord.new':
                var $444 = self.i;
                var $445 = self.j;
                var _pair$4 = Pair$new$(Arith$Z_to_N$(I32$to_int$($444)), Arith$Z_to_N$(I32$to_int$($445)));
                var $446 = Arith$NxN_to_N$(_pair$4);
                var $443 = $446;
                break;
        };
        return $443;
    };
    const Web$Kaelin$Coord$Convert$axial_to_nat = x0 => Web$Kaelin$Coord$Convert$axial_to_nat$(x0);

    function Maybe$(_A$1) {
        var $447 = null;
        return $447;
    };
    const Maybe = x0 => Maybe$(x0);
    const BitsMap$get = a0 => a1 => (bitsmap_get(a0, a1));

    function Bits$inc$(_a$1) {
        var self = _a$1;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'o':
                var $449 = self.slice(0, -1);
                var $450 = ($449 + '1');
                var $448 = $450;
                break;
            case 'i':
                var $451 = self.slice(0, -1);
                var $452 = (Bits$inc$($451) + '0');
                var $448 = $452;
                break;
            case 'e':
                var $453 = (Bits$e + '1');
                var $448 = $453;
                break;
        };
        return $448;
    };
    const Bits$inc = x0 => Bits$inc$(x0);
    const Nat$to_bits = a0 => (nat_to_bits(a0));

    function NatMap$get$(_key$2, _map$3) {
        var $454 = (bitsmap_get((nat_to_bits(_key$2)), _map$3));
        return $454;
    };
    const NatMap$get = x0 => x1 => NatMap$get$(x0, x1);

    function Web$Kaelin$Map$get$(_coord$1, _map$2) {
        var _key$3 = Web$Kaelin$Coord$Convert$axial_to_nat$(_coord$1);
        var $455 = NatMap$get$(_key$3, _map$2);
        return $455;
    };
    const Web$Kaelin$Map$get = x0 => x1 => Web$Kaelin$Map$get$(x0, x1);

    function List$cons$(_head$2, _tail$3) {
        var $456 = ({
            _: 'List.cons',
            'head': _head$2,
            'tail': _tail$3
        });
        return $456;
    };
    const List$cons = x0 => x1 => List$cons$(x0, x1);

    function NatMap$set$(_key$2, _val$3, _map$4) {
        var $457 = (bitsmap_set((nat_to_bits(_key$2)), _val$3, _map$4, 'set'));
        return $457;
    };
    const NatMap$set = x0 => x1 => x2 => NatMap$set$(x0, x1, x2);

    function Web$Kaelin$Map$set$(_coord$1, _tile$2, _map$3) {
        var _key$4 = Web$Kaelin$Coord$Convert$axial_to_nat$(_coord$1);
        var $458 = NatMap$set$(_key$4, _tile$2, _map$3);
        return $458;
    };
    const Web$Kaelin$Map$set = x0 => x1 => x2 => Web$Kaelin$Map$set$(x0, x1, x2);

    function Web$Kaelin$Map$push$(_coord$1, _entity$2, _map$3) {
        var _tile$4 = Maybe$default$(Web$Kaelin$Map$get$(_coord$1, _map$3), List$nil);
        var _tile$5 = List$cons$(_entity$2, _tile$4);
        var $459 = Web$Kaelin$Map$set$(_coord$1, _tile$5, _map$3);
        return $459;
    };
    const Web$Kaelin$Map$push = x0 => x1 => x2 => Web$Kaelin$Map$push$(x0, x1, x2);

    function Web$Kaelin$Map$init$(_map$1) {
        var _new_coord$2 = Web$Kaelin$Coord$new;
        var _creature$3 = Web$Kaelin$Entity$creature;
        var _croni$4 = Web$Kaelin$Hero$croni;
        var _cyclope$5 = Web$Kaelin$Hero$cyclope;
        var _lela$6 = Web$Kaelin$Hero$lela;
        var _octoking$7 = Web$Kaelin$Hero$octoking;
        var _map$8 = Web$Kaelin$Map$push$(_new_coord$2(Int$to_i32$(Int$neg$(Int$from_nat$(1n))))(Int$to_i32$(Int$neg$(Int$from_nat$(2n)))), _creature$3(Maybe$none)(_croni$4), _map$1);
        var _map$9 = Web$Kaelin$Map$push$(_new_coord$2(Int$to_i32$(Int$from_nat$(0n)))(Int$to_i32$(Int$from_nat$(3n))), _creature$3(Maybe$none)(_cyclope$5), _map$8);
        var _map$10 = Web$Kaelin$Map$push$(_new_coord$2(Int$to_i32$(Int$neg$(Int$from_nat$(2n))))(Int$to_i32$(Int$from_nat$(0n))), _creature$3(Maybe$none)(_lela$6), _map$9);
        var _map$11 = Web$Kaelin$Map$push$(_new_coord$2(Int$to_i32$(Int$from_nat$(3n)))(Int$to_i32$(Int$neg$(Int$from_nat$(2n)))), _creature$3(Maybe$none)(_octoking$7), _map$10);
        var $460 = _map$11;
        return $460;
    };
    const Web$Kaelin$Map$init = x0 => Web$Kaelin$Map$init$(x0);
    const NatMap$new = BitsMap$new;
    const Web$Kaelin$Constants$map_size = 5;
    const Web$Kaelin$Assets$tile$effect$blue_green2 = VoxBox$parse$("0e00010955400f00010955401000010955400c01010955400d01010955400e01011a9c7c0f01011a9c7c1001011cad851101010955401201010955400a02010955400b02010955400c02011cad850d02011cad850e02011cad850f02011a9c7c1002011cad851102011cad851202011a9c7c1302010955401402010955400803010955400903010955400a03011cad850b03011a9c7c0c03011cad850d03011cad850e03011cad850f03011a9c7c1003011a9c7c1103011a9c7c1203011a9c7c1303011cad851403011cad851503010955401603010955400604010955400704010955400804011cad850904011cad850a04011cad850b04011a9c7c0c04011a9c7c0d04011cad850e04011cad850f04011a9c7c1004011cad851104011a9c7c1204011a9c7c1304011a9c7c1404011a9c7c1504011a9c7c1604011a9c7c1704010955401804010955400405010955400505010955400605011cad850705011a9c7c0805011cad850905011cad850a05011a9c7c0b05011a9c7c0c05011a9c7c0d050115896c0e050115896c0f05011cad851005011cad851105011cad8512050115896c1305011a9c7c1405011cad851505011cad851605011a9c7c1705011cad851805011cad851905010955401a050109554002060109554003060109554004060115896c0506011cad850606011cad850706011a9c7c0806011a9c7c09060115896c0a06011a9c7c0b06011a9c7c0c06011a9c7c0d06011a9c7c0e060115896c0f06011cad851006011cad851106011a9c7c12060115896c13060115896c1406011cad851506011cad851606011a9c7c1706011a9c7c18060115896c1906011a9c7c1a06011a9c7c1b06010955401c06010955400007010955400107010955400207011a9c7c0307011a9c7c0407011a9c7c0507011cad850607011cad850707011cad850807011a9c7c09070115896c0a070115896c0b07011a9c7c0c07011cad850d07011cad850e07011a9c7c0f07011a9c7c1007011a9c7c1107011a9c7c1207011a9c7c1307011a9c7c1407011a9c7c1507011a9c7c1607011a9c7c1707011a9c7c18070115896c19070115896c1a07011a9c7c1b07011cad851c07011cad851d07010955401e07010955400008010955400108011a9c7c0208011cad850308011cad850408011a9c7c0508011cad850608011cad850708011cad850808011a9c7c0908011cad850a08011cad850b08011a9c7c0c08011a9c7c0d08011cad850e08011cad850f080115896c1008011a9c7c1108011cad851208011cad851308011a9c7c1408011cad851508011cad851608011cad851708011a9c7c1808011a9c7c1908011a9c7c1a08011a9c7c1b08011a9c7c1c08011cad851d08011cad851e08010955400009010955400109011a9c7c0209011a9c7c0309011cad850409011a9c7c0509011a9c7c0609011cad850709011a9c7c0809011a9c7c0909011cad850a09011cad850b09011a9c7c0c09011a9c7c0d09011cad850e09011cad850f09011a9c7c1009011a9c7c1109011cad851209011cad851309011a9c7c1409011a9c7c1509011cad851609011cad851709011a9c7c1809011a9c7c1909011cad851a09011cad851b09011a9c7c1c09011a9c7c1d09011a9c7c1e0901095540000a01095540010a011a9c7c020a011a9c7c030a0115896c040a0115896c050a011a9c7c060a011a9c7c070a011a9c7c080a011a9c7c090a011a9c7c0a0a011cad850b0a011cad850c0a011a9c7c0d0a011a9c7c0e0a011a9c7c0f0a011a9c7c100a011a9c7c110a011a9c7c120a011a9c7c130a011a9c7c140a0115896c150a011a9c7c160a011a9c7c170a011a9c7c180a011a9c7c190a011cad851a0a011cad851b0a011cad851c0a011a9c7c1d0a011a9c7c1e0a01095540000b01095540010b011a9c7c020b011cad85030b011a9c7c040b011a9c7c050b011cad85060b011cad85070b011a9c7c080b011a9c7c090b011a9c7c0a0b011a9c7c0b0b011a9c7c0c0b011a9c7c0d0b011cad850e0b011a9c7c0f0b011a9c7c100b011a9c7c110b011cad85120b011a9c7c130b011a9c7c140b0115896c150b011cad85160b011a9c7c170b011a9c7c180b011a9c7c190b011a9c7c1a0b011a9c7c1b0b011a9c7c1c0b011a9c7c1d0b011a9c7c1e0b01095540000c01095540010c011a9c7c020c011cad85030c011a9c7c040c011a9c7c050c011a9c7c060c011a9c7c070c011cad85080c011cad85090c011a9c7c0a0c0115896c0b0c0115896c0c0c011a9c7c0d0c011cad850e0c011a9c7c0f0c011cad85100c011a9c7c110c011a9c7c120c011a9c7c130c011a9c7c140c011a9c7c150c011a9c7c160c011cad85170c011cad85180c011a9c7c190c0115896c1a0c0115896c1b0c011a9c7c1c0c011a9c7c1d0c011a9c7c1e0c01095540000d01095540010d011a9c7c020d011a9c7c030d011cad85040d011cad85050d011a9c7c060d011cad85070d011cad85080d011cad85090d011a9c7c0a0d0115896c0b0d011a9c7c0c0d011cad850d0d011cad850e0d011a9c7c0f0d011cad85100d011a9c7c110d011a9c7c120d011cad85130d011cad85140d011a9c7c150d011cad85160d011cad85170d011cad85180d011a9c7c190d0115896c1a0d011a9c7c1b0d011cad851c0d011cad851d0d011a9c7c1e0d01095540000e01095540010e011a9c7c020e011cad85030e011cad85040e011cad85050e011a9c7c060e011cad85070e011cad85080e011a9c7c090e011a9c7c0a0e011a9c7c0b0e011a9c7c0c0e011cad850d0e011cad850e0e011cad850f0e0115896c100e011a9c7c110e011cad85120e011cad85130e011cad85140e011a9c7c150e011cad85160e011cad85170e011a9c7c180e011a9c7c190e011a9c7c1a0e011a9c7c1b0e011cad851c0e011cad851d0e011cad851e0e01095540000f01095540010f011a9c7c020f011cad85030f011cad85040f011a9c7c050f011a9c7c060f011a9c7c070f011a9c7c080f011a9c7c090f011a9c7c0a0f011a9c7c0b0f011a9c7c0c0f011a9c7c0d0f011cad850e0f011cad850f0f0115896c100f0115896c110f011cad85120f011cad85130f011a9c7c140f011a9c7c150f011a9c7c160f011a9c7c170f011a9c7c180f011a9c7c190f011a9c7c1a0f011a9c7c1b0f011a9c7c1c0f011cad851d0f011cad851e0f010955400010010955400110011a9c7c0210011cad850310011cad850410011a9c7c05100115896c0610011a9c7c0710011cad850810011cad850910011cad850a10011a9c7c0b10011cad850c10011cad850d10011a9c7c0e10011a9c7c0f10011cad851010011a9c7c1110011cad851210011cad851310011a9c7c14100115896c1510011a9c7c1610011cad851710011cad851810011cad851910011a9c7c1a10011cad851b10011cad851c10011a9c7c1d10011a9c7c1e10010955400011010955400111011cad850211011cad850311011cad850411011a9c7c0511011a9c7c0611011a9c7c0711011cad850811011cad850911011a9c7c0a11011a9c7c0b11011a9c7c0c11011a9c7c0d11011a9c7c0e11011a9c7c0f11011a9c7c1011011cad851111011cad851211011cad851311011a9c7c1411011a9c7c1511011a9c7c1611011cad851711011cad851811011a9c7c1911011a9c7c1a11011a9c7c1b11011a9c7c1c11011a9c7c1d11011a9c7c1e11010955400012010955400112011cad850212011cad850312011a9c7c0412011cad850512011cad850612011a9c7c0712011a9c7c0812011a9c7c0912011a9c7c0a12011a9c7c0b12011a9c7c0c12011cad850d12011cad850e12011cad850f12011a9c7c1012011cad851112011cad851212011a9c7c1312011cad851412011cad851512011a9c7c1612011a9c7c1712011a9c7c1812011a9c7c1912011a9c7c1a12011a9c7c1b12011cad851c12011cad851d12011cad851e12010955400013010955400113011a9c7c0213011a9c7c0313011a9c7c0413011cad850513011cad850613011a9c7c0713011a9c7c0813011a9c7c0913011cad850a13011cad850b13011a9c7c0c13011cad850d13011cad850e13011cad850f13011a9c7c1013011a9c7c1113011a9c7c1213011a9c7c1313011cad851413011cad851513011a9c7c1613011a9c7c1713011a9c7c1813011cad851913011cad851a13011a9c7c1b13011cad851c13011cad851d13011cad851e13010955400014010955400114011cad850214011a9c7c0314011a9c7c0414011a9c7c0514011a9c7c0614011a9c7c0714011a9c7c0814011cad850914011cad850a14011cad850b14011a9c7c0c14011a9c7c0d14011cad850e14011cad850f14011a9c7c1014011cad851114011a9c7c1214011a9c7c1314011a9c7c1414011a9c7c1514011a9c7c1614011a9c7c1714011cad851814011cad851914011cad851a14011a9c7c1b14011a9c7c1c14011cad851d14011cad851e14010955400015010955400115011cad850215011cad8503150115896c0415011a9c7c0515011cad850615011cad850715011a9c7c0815011cad850915011cad850a15011a9c7c0b15011a9c7c0c15011a9c7c0d150115896c0e150115896c0f15011cad851015011cad851115011cad8512150115896c1315011a9c7c1415011cad851515011cad851615011a9c7c1715011cad851815011cad851915011a9c7c1a15011a9c7c1b15011a9c7c1c150115896c1d150115896c1e15010955400016010955400116011cad850216011a9c7c03160115896c04160115896c0516011cad850616011cad850716011a9c7c0816011a9c7c09160115896c0a16011a9c7c0b16011a9c7c0c16011a9c7c0d16011a9c7c0e160115896c0f16011cad851016011cad851116011a9c7c12160115896c13160115896c1416011cad851516011cad851616011a9c7c1716011a9c7c18160115896c1916011a9c7c1a16011a9c7c1b16011a9c7c1c16011a9c7c1d160115896c1e16010955400017010955400117010955400217011a9c7c0317011a9c7c0417011a9c7c0517011a9c7c0617011a9c7c0717011a9c7c0817011a9c7c09170115896c0a170115896c0b17011a9c7c0c17011cad850d17011cad850e17011a9c7c0f17011a9c7c1017011a9c7c1117011a9c7c1217011a9c7c1317011a9c7c1417011a9c7c1517011a9c7c1617011a9c7c1717011a9c7c18170115896c19170115896c1a17011a9c7c1b17011cad851c17011cad851d17010955401e17010955400218010955400318010955400418011a9c7c0518011a9c7c0618011cad850718011cad850818011a9c7c0918011cad850a18011cad850b18011a9c7c0c18011cad850d18011cad850e18011cad850f180115896c10180115896c1118011cad851218011cad851318011a9c7c1418011a9c7c1518011cad851618011cad851718011a9c7c1818011cad851918011cad851a18011a9c7c1b18010955401c18010955400419010955400519010955400619011cad850719011cad850819011a9c7c0919011cad850a19011cad850b19011a9c7c0c19011a9c7c0d19011cad850e19011cad850f190115896c1019011a9c7c1119011cad851219011cad851319011a9c7c1419011cad851519011cad851619011cad851719011a9c7c1819011cad851919010955401a1901095540061a01095540071a01095540081a011a9c7c091a011a9c7c0a1a011a9c7c0b1a011a9c7c0c1a011a9c7c0d1a011a9c7c0e1a011a9c7c0f1a011a9c7c101a011a9c7c111a011a9c7c121a011a9c7c131a011a9c7c141a011cad85151a011cad85161a011a9c7c171a01095540181a01095540081b01095540091b010955400a1b0115896c0b1b0115896c0c1b011a9c7c0d1b011a9c7c0e1b011a9c7c0f1b011cad85101b011a9c7c111b011a9c7c121b011a9c7c131b011a9c7c141b011a9c7c151b01095540161b010955400a1c010955400b1c010955400c1c011cad850d1c011cad850e1c011a9c7c0f1c011cad85101c011a9c7c111c011a9c7c121c011cad85131c01095540141c010955400c1d010955400d1d010955400e1d011cad850f1d011a9c7c101d011a9c7c111d01095540121d010955400e1e010955400f1e01095540101e01095540");
    const Web$Kaelin$Assets$tile$effect$dark_blue2 = VoxBox$parse$("0e00011b3d920f00011b3d921000011b3d920c01011b3d920d01011b3d920e01014c74c50f01014c74c51001015783c51101011b3d921201011b3d920a02011b3d920b02011b3d920c02015783c50d02015783c50e02015783c50f02014c74c51002015783c51102015783c51202014c74c51302011b3d921402011b3d920803011b3d920903011b3d920a03015783c50b03014c74c50c03015783c50d03015783c50e03015783c50f03014c74c51003014c74c51103014c74c51203014c74c51303015783c51403015783c51503011b3d921603011b3d920604011b3d920704011b3d920804015783c50904015783c50a04015783c50b04014c74c50c04014c74c50d04015783c50e04015783c50f04014c74c51004015783c51104014c74c51204014c74c51304014c74c51404014c74c51504014c74c51604014c74c51704011b3d921804011b3d920405011b3d920505011b3d920605015783c50705014c74c50805015783c50905015783c50a05014c74c50b05014c74c50c05014c74c50d05013e66b80e05013e66b80f05015783c51005015783c51105015783c51205013e66b81305014c74c51405015783c51505015783c51605014c74c51705015783c51805015783c51905011b3d921a05011b3d920206011b3d920306011b3d920406013e66b80506015783c50606015783c50706014c74c50806014c74c50906013e66b80a06014c74c50b06014c74c50c06014c74c50d06014c74c50e06013e66b80f06015783c51006015783c51106014c74c51206013e66b81306013e66b81406015783c51506015783c51606014c74c51706014c74c51806013e66b81906014c74c51a06014c74c51b06011b3d921c06011b3d920007011b3d920107011b3d920207014c74c50307014c74c50407014c74c50507015783c50607015783c50707015783c50807014c74c50907013e66b80a07013e66b80b07014c74c50c07015783c50d07015783c50e07014c74c50f07014c74c51007014c74c51107014c74c51207014c74c51307014c74c51407014c74c51507014c74c51607014c74c51707014c74c51807013e66b81907013e66b81a07014c74c51b07015783c51c07015783c51d07011b3d921e07011b3d920008011b3d920108014c74c50208015783c50308015783c50408014c74c50508015783c50608015783c50708015783c50808014c74c50908015783c50a08015783c50b08014c74c50c08014c74c50d08015783c50e08015783c50f08013e66b81008014c74c51108015783c51208015783c51308014c74c51408015783c51508015783c51608015783c51708014c74c51808014c74c51908014c74c51a08014c74c51b08014c74c51c08015783c51d08015783c51e08011b3d920009011b3d920109014c74c50209014c74c50309015783c50409014c74c50509014c74c50609015783c50709014c74c50809014c74c50909015783c50a09015783c50b09014c74c50c09014c74c50d09015783c50e09015783c50f09014c74c51009014c74c51109015783c51209015783c51309014c74c51409014c74c51509015783c51609015783c51709014c74c51809014c74c51909015783c51a09015783c51b09014c74c51c09014c74c51d09014c74c51e09011b3d92000a011b3d92010a014c74c5020a014c74c5030a013e66b8040a013e66b8050a014c74c5060a014c74c5070a014c74c5080a014c74c5090a014c74c50a0a015783c50b0a015783c50c0a014c74c50d0a014c74c50e0a014c74c50f0a014c74c5100a014c74c5110a014c74c5120a014c74c5130a014c74c5140a013e66b8150a014c74c5160a014c74c5170a014c74c5180a014c74c5190a015783c51a0a015783c51b0a015783c51c0a014c74c51d0a014c74c51e0a011b3d92000b011b3d92010b014c74c5020b015783c5030b014c74c5040b014c74c5050b015783c5060b015783c5070b014c74c5080b014c74c5090b014c74c50a0b014c74c50b0b014c74c50c0b014c74c50d0b015783c50e0b014c74c50f0b014c74c5100b014c74c5110b015783c5120b014c74c5130b014c74c5140b013e66b8150b015783c5160b014c74c5170b014c74c5180b014c74c5190b014c74c51a0b014c74c51b0b014c74c51c0b014c74c51d0b014c74c51e0b011b3d92000c011b3d92010c014c74c5020c015783c5030c014c74c5040c014c74c5050c014c74c5060c014c74c5070c015783c5080c015783c5090c014c74c50a0c013e66b80b0c013e66b80c0c014c74c50d0c015783c50e0c014c74c50f0c015783c5100c014c74c5110c014c74c5120c014c74c5130c014c74c5140c014c74c5150c014c74c5160c015783c5170c015783c5180c014c74c5190c013e66b81a0c013e66b81b0c014c74c51c0c014c74c51d0c014c74c51e0c011b3d92000d011b3d92010d014c74c5020d014c74c5030d015783c5040d015783c5050d014c74c5060d015783c5070d015783c5080d015783c5090d014c74c50a0d013e66b80b0d014c74c50c0d015783c50d0d015783c50e0d014c74c50f0d015783c5100d014c74c5110d014c74c5120d015783c5130d015783c5140d014c74c5150d015783c5160d015783c5170d015783c5180d014c74c5190d013e66b81a0d014c74c51b0d015783c51c0d015783c51d0d014c74c51e0d011b3d92000e011b3d92010e014c74c5020e015783c5030e015783c5040e015783c5050e014c74c5060e015783c5070e015783c5080e014c74c5090e014c74c50a0e014c74c50b0e014c74c50c0e015783c50d0e015783c50e0e015783c50f0e013e66b8100e014c74c5110e015783c5120e015783c5130e015783c5140e014c74c5150e015783c5160e015783c5170e014c74c5180e014c74c5190e014c74c51a0e014c74c51b0e015783c51c0e015783c51d0e015783c51e0e011b3d92000f011b3d92010f014c74c5020f015783c5030f015783c5040f014c74c5050f014c74c5060f014c74c5070f014c74c5080f014c74c5090f014c74c50a0f014c74c50b0f014c74c50c0f014c74c50d0f015783c50e0f015783c50f0f013e66b8100f013e66b8110f015783c5120f015783c5130f014c74c5140f014c74c5150f014c74c5160f014c74c5170f014c74c5180f014c74c5190f014c74c51a0f014c74c51b0f014c74c51c0f015783c51d0f015783c51e0f011b3d920010011b3d920110014c74c50210015783c50310015783c50410014c74c50510013e66b80610014c74c50710015783c50810015783c50910015783c50a10014c74c50b10015783c50c10015783c50d10014c74c50e10014c74c50f10015783c51010014c74c51110015783c51210015783c51310014c74c51410013e66b81510014c74c51610015783c51710015783c51810015783c51910014c74c51a10015783c51b10015783c51c10014c74c51d10014c74c51e10011b3d920011011b3d920111015783c50211015783c50311015783c50411014c74c50511014c74c50611014c74c50711015783c50811015783c50911014c74c50a11014c74c50b11014c74c50c11014c74c50d11014c74c50e11014c74c50f11014c74c51011015783c51111015783c51211015783c51311014c74c51411014c74c51511014c74c51611015783c51711015783c51811014c74c51911014c74c51a11014c74c51b11014c74c51c11014c74c51d11014c74c51e11011b3d920012011b3d920112015783c50212015783c50312014c74c50412015783c50512015783c50612014c74c50712014c74c50812014c74c50912014c74c50a12014c74c50b12014c74c50c12015783c50d12015783c50e12015783c50f12014c74c51012015783c51112015783c51212014c74c51312015783c51412015783c51512014c74c51612014c74c51712014c74c51812014c74c51912014c74c51a12014c74c51b12015783c51c12015783c51d12015783c51e12011b3d920013011b3d920113014c74c50213014c74c50313014c74c50413015783c50513015783c50613014c74c50713014c74c50813014c74c50913015783c50a13015783c50b13014c74c50c13015783c50d13015783c50e13015783c50f13014c74c51013014c74c51113014c74c51213014c74c51313015783c51413015783c51513014c74c51613014c74c51713014c74c51813015783c51913015783c51a13014c74c51b13015783c51c13015783c51d13015783c51e13011b3d920014011b3d920114015783c50214014c74c50314014c74c50414014c74c50514014c74c50614014c74c50714014c74c50814015783c50914015783c50a14015783c50b14014c74c50c14014c74c50d14015783c50e14015783c50f14014c74c51014015783c51114014c74c51214014c74c51314014c74c51414014c74c51514014c74c51614014c74c51714015783c51814015783c51914015783c51a14014c74c51b14014c74c51c14015783c51d14015783c51e14011b3d920015011b3d920115015783c50215015783c50315013e66b80415014c74c50515015783c50615015783c50715014c74c50815015783c50915015783c50a15014c74c50b15014c74c50c15014c74c50d15013e66b80e15013e66b80f15015783c51015015783c51115015783c51215013e66b81315014c74c51415015783c51515015783c51615014c74c51715015783c51815015783c51915014c74c51a15014c74c51b15014c74c51c15013e66b81d15013e66b81e15011b3d920016011b3d920116015783c50216014c74c50316013e66b80416013e66b80516015783c50616015783c50716014c74c50816014c74c50916013e66b80a16014c74c50b16014c74c50c16014c74c50d16014c74c50e16013e66b80f16015783c51016015783c51116014c74c51216013e66b81316013e66b81416015783c51516015783c51616014c74c51716014c74c51816013e66b81916014c74c51a16014c74c51b16014c74c51c16014c74c51d16013e66b81e16011b3d920017011b3d920117011b3d920217014c74c50317014c74c50417014c74c50517014c74c50617014c74c50717014c74c50817014c74c50917013e66b80a17013e66b80b17014c74c50c17015783c50d17015783c50e17014c74c50f17014c74c51017014c74c51117014c74c51217014c74c51317014c74c51417014c74c51517014c74c51617014c74c51717014c74c51817013e66b81917013e66b81a17014c74c51b17015783c51c17015783c51d17011b3d921e17011b3d920218011b3d920318011b3d920418014c74c50518014c74c50618015783c50718015783c50818014c74c50918015783c50a18015783c50b18014c74c50c18015783c50d18015783c50e18015783c50f18013e66b81018013e66b81118015783c51218015783c51318014c74c51418014c74c51518015783c51618015783c51718014c74c51818015783c51918015783c51a18014c74c51b18011b3d921c18011b3d920419011b3d920519011b3d920619015783c50719015783c50819014c74c50919015783c50a19015783c50b19014c74c50c19014c74c50d19015783c50e19015783c50f19013e66b81019014c74c51119015783c51219015783c51319014c74c51419015783c51519015783c51619015783c51719014c74c51819015783c51919011b3d921a19011b3d92061a011b3d92071a011b3d92081a014c74c5091a014c74c50a1a014c74c50b1a014c74c50c1a014c74c50d1a014c74c50e1a014c74c50f1a014c74c5101a014c74c5111a014c74c5121a014c74c5131a014c74c5141a015783c5151a015783c5161a014c74c5171a011b3d92181a011b3d92081b011b3d92091b011b3d920a1b013e66b80b1b013e66b80c1b014c74c50d1b014c74c50e1b014c74c50f1b015783c5101b014c74c5111b014c74c5121b014c74c5131b014c74c5141b014c74c5151b011b3d92161b011b3d920a1c011b3d920b1c011b3d920c1c015783c50d1c015783c50e1c014c74c50f1c015783c5101c014c74c5111c014c74c5121c015783c5131c011b3d92141c011b3d920c1d011b3d920d1d011b3d920e1d015783c50f1d014c74c5101d014c74c5111d011b3d92121d011b3d920e1e011b3d920f1e011b3d92101e011b3d92");
    const Web$Kaelin$Assets$tile$effect$dark_red2 = VoxBox$parse$("0e0001881c170f0001881c17100001881c170c0101881c170d0101881c170e0101bc524c0f0101bc524c100101c75f56110101881c17120101881c170a0201881c170b0201881c170c0201c75f560d0201c75f560e0201c75f560f0201bc524c100201c75f56110201c75f56120201bc524c130201881c17140201881c17080301881c17090301881c170a0301c75f560b0301bc524c0c0301c75f560d0301c75f560e0301c75f560f0301bc524c100301bc524c110301bc524c120301bc524c130301c75f56140301c75f56150301881c17160301881c17060401881c17070401881c17080401c75f56090401c75f560a0401c75f560b0401bc524c0c0401bc524c0d0401c75f560e0401c75f560f0401bc524c100401c75f56110401bc524c120401bc524c130401bc524c140401bc524c150401bc524c160401bc524c170401881c17180401881c17040501881c17050501881c17060501c75f56070501bc524c080501c75f56090501c75f560a0501bc524c0b0501bc524c0c0501bc524c0d0501ae443e0e0501ae443e0f0501c75f56100501c75f56110501c75f56120501ae443e130501bc524c140501c75f56150501c75f56160501bc524c170501c75f56180501c75f56190501881c171a0501881c17020601881c17030601881c17040601ae443e050601c75f56060601c75f56070601bc524c080601bc524c090601ae443e0a0601bc524c0b0601bc524c0c0601bc524c0d0601bc524c0e0601ae443e0f0601c75f56100601c75f56110601bc524c120601ae443e130601ae443e140601c75f56150601c75f56160601bc524c170601bc524c180601ae443e190601bc524c1a0601bc524c1b0601881c171c0601881c17000701881c17010701881c17020701bc524c030701bc524c040701bc524c050701c75f56060701c75f56070701c75f56080701bc524c090701ae443e0a0701ae443e0b0701bc524c0c0701c75f560d0701c75f560e0701bc524c0f0701bc524c100701bc524c110701bc524c120701bc524c130701bc524c140701bc524c150701bc524c160701bc524c170701bc524c180701ae443e190701ae443e1a0701bc524c1b0701c75f561c0701c75f561d0701881c171e0701881c17000801881c17010801bc524c020801c75f56030801c75f56040801bc524c050801c75f56060801c75f56070801c75f56080801bc524c090801c75f560a0801c75f560b0801bc524c0c0801bc524c0d0801c75f560e0801c75f560f0801ae443e100801bc524c110801c75f56120801c75f56130801bc524c140801c75f56150801c75f56160801c75f56170801bc524c180801bc524c190801bc524c1a0801bc524c1b0801bc524c1c0801c75f561d0801c75f561e0801881c17000901881c17010901bc524c020901bc524c030901c75f56040901bc524c050901bc524c060901c75f56070901bc524c080901bc524c090901c75f560a0901c75f560b0901bc524c0c0901bc524c0d0901c75f560e0901c75f560f0901bc524c100901bc524c110901c75f56120901c75f56130901bc524c140901bc524c150901c75f56160901c75f56170901bc524c180901bc524c190901c75f561a0901c75f561b0901bc524c1c0901bc524c1d0901bc524c1e0901881c17000a01881c17010a01bc524c020a01bc524c030a01ae443e040a01ae443e050a01bc524c060a01bc524c070a01bc524c080a01bc524c090a01bc524c0a0a01c75f560b0a01c75f560c0a01bc524c0d0a01bc524c0e0a01bc524c0f0a01bc524c100a01bc524c110a01bc524c120a01bc524c130a01bc524c140a01ae443e150a01bc524c160a01bc524c170a01bc524c180a01bc524c190a01c75f561a0a01c75f561b0a01c75f561c0a01bc524c1d0a01bc524c1e0a01881c17000b01881c17010b01bc524c020b01c75f56030b01bc524c040b01bc524c050b01c75f56060b01c75f56070b01bc524c080b01bc524c090b01bc524c0a0b01bc524c0b0b01bc524c0c0b01bc524c0d0b01c75f560e0b01bc524c0f0b01bc524c100b01bc524c110b01c75f56120b01bc524c130b01bc524c140b01ae443e150b01c75f56160b01bc524c170b01bc524c180b01bc524c190b01bc524c1a0b01bc524c1b0b01bc524c1c0b01bc524c1d0b01bc524c1e0b01881c17000c01881c17010c01bc524c020c01c75f56030c01bc524c040c01bc524c050c01bc524c060c01bc524c070c01c75f56080c01c75f56090c01bc524c0a0c01ae443e0b0c01ae443e0c0c01bc524c0d0c01c75f560e0c01bc524c0f0c01c75f56100c01bc524c110c01bc524c120c01bc524c130c01bc524c140c01bc524c150c01bc524c160c01c75f56170c01c75f56180c01bc524c190c01ae443e1a0c01ae443e1b0c01bc524c1c0c01bc524c1d0c01bc524c1e0c01881c17000d01881c17010d01bc524c020d01bc524c030d01c75f56040d01c75f56050d01bc524c060d01c75f56070d01c75f56080d01c75f56090d01bc524c0a0d01ae443e0b0d01bc524c0c0d01c75f560d0d01c75f560e0d01bc524c0f0d01c75f56100d01bc524c110d01bc524c120d01c75f56130d01c75f56140d01bc524c150d01c75f56160d01c75f56170d01c75f56180d01bc524c190d01ae443e1a0d01bc524c1b0d01c75f561c0d01c75f561d0d01bc524c1e0d01881c17000e01881c17010e01bc524c020e01c75f56030e01c75f56040e01c75f56050e01bc524c060e01c75f56070e01c75f56080e01bc524c090e01bc524c0a0e01bc524c0b0e01bc524c0c0e01c75f560d0e01c75f560e0e01c75f560f0e01ae443e100e01bc524c110e01c75f56120e01c75f56130e01c75f56140e01bc524c150e01c75f56160e01c75f56170e01bc524c180e01bc524c190e01bc524c1a0e01bc524c1b0e01c75f561c0e01c75f561d0e01c75f561e0e01881c17000f01881c17010f01bc524c020f01c75f56030f01c75f56040f01bc524c050f01bc524c060f01bc524c070f01bc524c080f01bc524c090f01bc524c0a0f01bc524c0b0f01bc524c0c0f01bc524c0d0f01c75f560e0f01c75f560f0f01ae443e100f01ae443e110f01c75f56120f01c75f56130f01bc524c140f01bc524c150f01bc524c160f01bc524c170f01bc524c180f01bc524c190f01bc524c1a0f01bc524c1b0f01bc524c1c0f01c75f561d0f01c75f561e0f01881c17001001881c17011001bc524c021001c75f56031001c75f56041001bc524c051001ae443e061001bc524c071001c75f56081001c75f56091001c75f560a1001bc524c0b1001c75f560c1001c75f560d1001bc524c0e1001bc524c0f1001c75f56101001bc524c111001c75f56121001c75f56131001bc524c141001ae443e151001bc524c161001c75f56171001c75f56181001c75f56191001bc524c1a1001c75f561b1001c75f561c1001bc524c1d1001bc524c1e1001881c17001101881c17011101c75f56021101c75f56031101c75f56041101bc524c051101bc524c061101bc524c071101c75f56081101c75f56091101bc524c0a1101bc524c0b1101bc524c0c1101bc524c0d1101bc524c0e1101bc524c0f1101bc524c101101c75f56111101c75f56121101c75f56131101bc524c141101bc524c151101bc524c161101c75f56171101c75f56181101bc524c191101bc524c1a1101bc524c1b1101bc524c1c1101bc524c1d1101bc524c1e1101881c17001201881c17011201c75f56021201c75f56031201bc524c041201c75f56051201c75f56061201bc524c071201bc524c081201bc524c091201bc524c0a1201bc524c0b1201bc524c0c1201c75f560d1201c75f560e1201c75f560f1201bc524c101201c75f56111201c75f56121201bc524c131201c75f56141201c75f56151201bc524c161201bc524c171201bc524c181201bc524c191201bc524c1a1201bc524c1b1201c75f561c1201c75f561d1201c75f561e1201881c17001301881c17011301bc524c021301bc524c031301bc524c041301c75f56051301c75f56061301bc524c071301bc524c081301bc524c091301c75f560a1301c75f560b1301bc524c0c1301c75f560d1301c75f560e1301c75f560f1301bc524c101301bc524c111301bc524c121301bc524c131301c75f56141301c75f56151301bc524c161301bc524c171301bc524c181301c75f56191301c75f561a1301bc524c1b1301c75f561c1301c75f561d1301c75f561e1301881c17001401881c17011401c75f56021401bc524c031401bc524c041401bc524c051401bc524c061401bc524c071401bc524c081401c75f56091401c75f560a1401c75f560b1401bc524c0c1401bc524c0d1401c75f560e1401c75f560f1401bc524c101401c75f56111401bc524c121401bc524c131401bc524c141401bc524c151401bc524c161401bc524c171401c75f56181401c75f56191401c75f561a1401bc524c1b1401bc524c1c1401c75f561d1401c75f561e1401881c17001501881c17011501c75f56021501c75f56031501ae443e041501bc524c051501c75f56061501c75f56071501bc524c081501c75f56091501c75f560a1501bc524c0b1501bc524c0c1501bc524c0d1501ae443e0e1501ae443e0f1501c75f56101501c75f56111501c75f56121501ae443e131501bc524c141501c75f56151501c75f56161501bc524c171501c75f56181501c75f56191501bc524c1a1501bc524c1b1501bc524c1c1501ae443e1d1501ae443e1e1501881c17001601881c17011601c75f56021601bc524c031601ae443e041601ae443e051601c75f56061601c75f56071601bc524c081601bc524c091601ae443e0a1601bc524c0b1601bc524c0c1601bc524c0d1601bc524c0e1601ae443e0f1601c75f56101601c75f56111601bc524c121601ae443e131601ae443e141601c75f56151601c75f56161601bc524c171601bc524c181601ae443e191601bc524c1a1601bc524c1b1601bc524c1c1601bc524c1d1601ae443e1e1601881c17001701881c17011701881c17021701bc524c031701bc524c041701bc524c051701bc524c061701bc524c071701bc524c081701bc524c091701ae443e0a1701ae443e0b1701bc524c0c1701c75f560d1701c75f560e1701bc524c0f1701bc524c101701bc524c111701bc524c121701bc524c131701bc524c141701bc524c151701bc524c161701bc524c171701bc524c181701ae443e191701ae443e1a1701bc524c1b1701c75f561c1701c75f561d1701881c171e1701881c17021801881c17031801881c17041801bc524c051801bc524c061801c75f56071801c75f56081801bc524c091801c75f560a1801c75f560b1801bc524c0c1801c75f560d1801c75f560e1801c75f560f1801ae443e101801ae443e111801c75f56121801c75f56131801bc524c141801bc524c151801c75f56161801c75f56171801bc524c181801c75f56191801c75f561a1801bc524c1b1801881c171c1801881c17041901881c17051901881c17061901c75f56071901c75f56081901bc524c091901c75f560a1901c75f560b1901bc524c0c1901bc524c0d1901c75f560e1901c75f560f1901ae443e101901bc524c111901c75f56121901c75f56131901bc524c141901c75f56151901c75f56161901c75f56171901bc524c181901c75f56191901881c171a1901881c17061a01881c17071a01881c17081a01bc524c091a01bc524c0a1a01bc524c0b1a01bc524c0c1a01bc524c0d1a01bc524c0e1a01bc524c0f1a01bc524c101a01bc524c111a01bc524c121a01bc524c131a01bc524c141a01c75f56151a01c75f56161a01bc524c171a01881c17181a01881c17081b01881c17091b01881c170a1b01ae443e0b1b01ae443e0c1b01bc524c0d1b01bc524c0e1b01bc524c0f1b01c75f56101b01bc524c111b01bc524c121b01bc524c131b01bc524c141b01bc524c151b01881c17161b01881c170a1c01881c170b1c01881c170c1c01c75f560d1c01c75f560e1c01bc524c0f1c01c75f56101c01bc524c111c01bc524c121c01c75f56131c01881c17141c01881c170c1d01881c170d1d01881c170e1d01c75f560f1d01bc524c101d01bc524c111d01881c17121d01881c170e1e01881c170f1e01881c17101e01881c17");
    const Web$Kaelin$Assets$tile$green_2 = VoxBox$parse$("0e00011652320f00011652321000011652320c01011652320d01011652320e0101408d640f0101408d64100101469e651101011652321201011652320a02011652320b02011652320c0201469e650d0201469e650e0201469e650f0201408d64100201469e65110201469e65120201408d641302011652321402011652320803011652320903011652320a0301469e650b0301408d640c0301469e650d0301469e650e0301469e650f0301408d64100301408d64110301408d64120301408d64130301469e65140301469e65150301165232160301165232060401165232070401165232080401469e65090401469e650a0401469e650b0401408d640c0401408d640d0401469e650e0401469e650f0401408d64100401469e65110401408d64120401408d64130401408d64140401408d64150401408d64160401408d64170401165232180401165232040501165232050501165232060501469e65070501408d64080501469e65090501469e650a0501408d640b0501408d640c0501408d640d0501347e570e0501347e570f0501469e65100501469e65110501469e65120501347e57130501408d64140501469e65150501469e65160501408d64170501469e65180501469e651905011652321a0501165232020601165232030601165232040601347e57050601469e65060601469e65070601408d64080601408d64090601347e570a0601408d640b0601408d640c0601408d640d0601408d640e0601347e570f0601469e65100601469e65110601408d64120601347e57130601347e57140601469e65150601469e65160601408d64170601408d64180601347e57190601408d641a0601408d641b06011652321c0601165232000701165232010701165232020701408d64030701408d64040701408d64050701469e65060701469e65070701469e65080701408d64090701347e570a0701347e570b0701408d640c0701469e650d0701469e650e0701408d640f0701408d64100701408d64110701408d64120701408d64130701408d64140701408d64150701408d64160701408d64170701408d64180701347e57190701347e571a0701408d641b0701469e651c0701469e651d07011652321e0701165232000801165232010801408d64020801469e65030801469e65040801408d64050801469e65060801469e65070801469e65080801408d64090801469e650a0801469e650b0801408d640c0801408d640d0801469e650e0801469e650f0801347e57100801408d64110801469e65120801469e65130801408d64140801469e65150801469e65160801469e65170801408d64180801408d64190801408d641a0801408d641b0801408d641c0801469e651d0801469e651e0801165232000901165232010901408d64020901408d64030901469e65040901408d64050901408d64060901469e65070901408d64080901408d64090901469e650a0901469e650b0901408d640c0901408d640d0901469e650e0901469e650f0901408d64100901408d64110901469e65120901469e65130901408d64140901408d64150901469e65160901469e65170901408d64180901408d64190901469e651a0901469e651b0901408d641c0901408d641d0901408d641e0901165232000a01165232010a01408d64020a01408d64030a01347e57040a01347e57050a01408d64060a01408d64070a01408d64080a01408d64090a01408d640a0a01469e650b0a01469e650c0a01408d640d0a01408d640e0a01408d640f0a01408d64100a01408d64110a01408d64120a01408d64130a01408d64140a01347e57150a01408d64160a01408d64170a01408d64180a01408d64190a01469e651a0a01469e651b0a01469e651c0a01408d641d0a01408d641e0a01165232000b01165232010b01408d64020b01469e65030b01408d64040b01408d64050b01469e65060b01469e65070b01408d64080b01408d64090b01408d640a0b01408d640b0b01408d640c0b01408d640d0b01469e650e0b01408d640f0b01408d64100b01408d64110b01469e65120b01408d64130b01408d64140b01347e57150b01469e65160b01408d64170b01408d64180b01408d64190b01408d641a0b01408d641b0b01408d641c0b01408d641d0b01408d641e0b01165232000c01165232010c01408d64020c01469e65030c01408d64040c01408d64050c01408d64060c01408d64070c01469e65080c01469e65090c01408d640a0c01347e570b0c01347e570c0c01408d640d0c01469e650e0c01408d640f0c01469e65100c01408d64110c01408d64120c01408d64130c01408d64140c01408d64150c01408d64160c01469e65170c01469e65180c01408d64190c01347e571a0c01347e571b0c01408d641c0c01408d641d0c01408d641e0c01165232000d01165232010d01408d64020d01408d64030d01469e65040d01469e65050d01408d64060d01469e65070d01469e65080d01469e65090d01408d640a0d01347e570b0d01408d640c0d01469e650d0d01469e650e0d01408d640f0d01469e65100d01408d64110d01408d64120d01469e65130d01469e65140d01408d64150d01469e65160d01469e65170d01469e65180d01408d64190d01347e571a0d01408d641b0d01469e651c0d01469e651d0d01408d641e0d01165232000e01165232010e01408d64020e01469e65030e01469e65040e01469e65050e01408d64060e01469e65070e01469e65080e01408d64090e01408d640a0e01408d640b0e01408d640c0e01469e650d0e01469e650e0e01469e650f0e01347e57100e01408d64110e01469e65120e01469e65130e01469e65140e01408d64150e01469e65160e01469e65170e01408d64180e01408d64190e01408d641a0e01408d641b0e01469e651c0e01469e651d0e01469e651e0e01165232000f01165232010f01408d64020f01469e65030f01469e65040f01408d64050f01408d64060f01408d64070f01408d64080f01408d64090f01408d640a0f01408d640b0f01408d640c0f01408d640d0f01469e650e0f01469e650f0f01347e57100f01347e57110f01469e65120f01469e65130f01408d64140f01408d64150f01408d64160f01408d64170f01408d64180f01408d64190f01408d641a0f01408d641b0f01408d641c0f01469e651d0f01469e651e0f01165232001001165232011001408d64021001469e65031001469e65041001408d64051001347e57061001408d64071001469e65081001469e65091001469e650a1001408d640b1001469e650c1001469e650d1001408d640e1001408d640f1001469e65101001408d64111001469e65121001469e65131001408d64141001347e57151001408d64161001469e65171001469e65181001469e65191001408d641a1001469e651b1001469e651c1001408d641d1001408d641e1001165232001101165232011101469e65021101469e65031101469e65041101408d64051101408d64061101408d64071101469e65081101469e65091101408d640a1101408d640b1101408d640c1101408d640d1101408d640e1101408d640f1101408d64101101469e65111101469e65121101469e65131101408d64141101408d64151101408d64161101469e65171101469e65181101408d64191101408d641a1101408d641b1101408d641c1101408d641d1101408d641e1101165232001201165232011201469e65021201469e65031201408d64041201469e65051201469e65061201408d64071201408d64081201408d64091201408d640a1201408d640b1201408d640c1201469e650d1201469e650e1201469e650f1201408d64101201469e65111201469e65121201408d64131201469e65141201469e65151201408d64161201408d64171201408d64181201408d64191201408d641a1201408d641b1201469e651c1201469e651d1201469e651e1201165232001301165232011301408d64021301408d64031301408d64041301469e65051301469e65061301408d64071301408d64081301408d64091301469e650a1301469e650b1301408d640c1301469e650d1301469e650e1301469e650f1301408d64101301408d64111301408d64121301408d64131301469e65141301469e65151301408d64161301408d64171301408d64181301469e65191301469e651a1301408d641b1301469e651c1301469e651d1301469e651e1301165232001401165232011401469e65021401408d64031401408d64041401408d64051401408d64061401408d64071401408d64081401469e65091401469e650a1401469e650b1401408d640c1401408d640d1401469e650e1401469e650f1401408d64101401469e65111401408d64121401408d64131401408d64141401408d64151401408d64161401408d64171401469e65181401469e65191401469e651a1401408d641b1401408d641c1401469e651d1401469e651e1401165232001501165232011501469e65021501469e65031501347e57041501408d64051501469e65061501469e65071501408d64081501469e65091501469e650a1501408d640b1501408d640c1501408d640d1501347e570e1501347e570f1501469e65101501469e65111501469e65121501347e57131501408d64141501469e65151501469e65161501408d64171501469e65181501469e65191501408d641a1501408d641b1501408d641c1501347e571d1501347e571e1501165232001601165232011601469e65021601408d64031601347e57041601347e57051601469e65061601469e65071601408d64081601408d64091601347e570a1601408d640b1601408d640c1601408d640d1601408d640e1601347e570f1601469e65101601469e65111601408d64121601347e57131601347e57141601469e65151601469e65161601408d64171601408d64181601347e57191601408d641a1601408d641b1601408d641c1601408d641d1601347e571e1601165232001701165232011701165232021701408d64031701408d64041701408d64051701408d64061701408d64071701408d64081701408d64091701347e570a1701347e570b1701408d640c1701469e650d1701469e650e1701408d640f1701408d64101701408d64111701408d64121701408d64131701408d64141701408d64151701408d64161701408d64171701408d64181701347e57191701347e571a1701408d641b1701469e651c1701469e651d17011652321e1701165232021801165232031801165232041801408d64051801408d64061801469e65071801469e65081801408d64091801469e650a1801469e650b1801408d640c1801469e650d1801469e650e1801469e650f1801347e57101801347e57111801469e65121801469e65131801408d64141801408d64151801469e65161801469e65171801408d64181801469e65191801469e651a1801408d641b18011652321c1801165232041901165232051901165232061901469e65071901469e65081901408d64091901469e650a1901469e650b1901408d640c1901408d640d1901469e650e1901469e650f1901347e57101901408d64111901469e65121901469e65131901408d64141901469e65151901469e65161901469e65171901408d64181901469e651919011652321a1901165232061a01165232071a01165232081a01408d64091a01408d640a1a01408d640b1a01408d640c1a01408d640d1a01408d640e1a01408d640f1a01408d64101a01408d64111a01408d64121a01408d64131a01408d64141a01469e65151a01469e65161a01408d64171a01165232181a01165232081b01165232091b011652320a1b01347e570b1b01347e570c1b01408d640d1b01408d640e1b01408d640f1b01469e65101b01408d64111b01408d64121b01408d64131b01408d64141b01408d64151b01165232161b011652320a1c011652320b1c011652320c1c01469e650d1c01469e650e1c01408d640f1c01469e65101c01408d64111c01408d64121c01469e65131c01165232141c011652320c1d011652320d1d011652320e1d01469e650f1d01408d64101d01408d64111d01165232121d011652320e1e011652320f1e01165232101e01165232");
    const Web$Kaelin$Assets$tile$effect$light_blue2 = VoxBox$parse$("0e00010b51570f00010b51571000010b51570c01010b51570d01010b51570e0101278e9f0f0101278e9f100101309da51101010b51571201010b51570a02010b51570b02010b51570c0201309da50d0201309da50e0201309da50f0201278e9f100201309da5110201309da5120201278e9f1302010b51571402010b51570803010b51570903010b51570a0301309da50b0301278e9f0c0301309da50d0301309da50e0301309da50f0301278e9f100301278e9f110301278e9f120301278e9f130301309da5140301309da51503010b51571603010b51570604010b51570704010b5157080401309da5090401309da50a0401309da50b0401278e9f0c0401278e9f0d0401309da50e0401309da50f0401278e9f100401309da5110401278e9f120401278e9f130401278e9f140401278e9f150401278e9f160401278e9f1704010b51571804010b51570405010b51570505010b5157060501309da5070501278e9f080501309da5090501309da50a0501278e9f0b0501278e9f0c0501278e9f0d05011a7f910e05011a7f910f0501309da5100501309da5110501309da51205011a7f91130501278e9f140501309da5150501309da5160501278e9f170501309da5180501309da51905010b51571a05010b51570206010b51570306010b51570406011a7f91050601309da5060601309da5070601278e9f080601278e9f0906011a7f910a0601278e9f0b0601278e9f0c0601278e9f0d0601278e9f0e06011a7f910f0601309da5100601309da5110601278e9f1206011a7f911306011a7f91140601309da5150601309da5160601278e9f170601278e9f1806011a7f91190601278e9f1a0601278e9f1b06010b51571c06010b51570007010b51570107010b5157020701278e9f030701278e9f040701278e9f050701309da5060701309da5070701309da5080701278e9f0907011a7f910a07011a7f910b0701278e9f0c0701309da50d0701309da50e0701278e9f0f0701278e9f100701278e9f110701278e9f120701278e9f130701278e9f140701278e9f150701278e9f160701278e9f170701278e9f1807011a7f911907011a7f911a0701278e9f1b0701309da51c0701309da51d07010b51571e07010b51570008010b5157010801278e9f020801309da5030801309da5040801278e9f050801309da5060801309da5070801309da5080801278e9f090801309da50a0801309da50b0801278e9f0c0801278e9f0d0801309da50e0801309da50f08011a7f91100801278e9f110801309da5120801309da5130801278e9f140801309da5150801309da5160801309da5170801278e9f180801278e9f190801278e9f1a0801278e9f1b0801278e9f1c0801309da51d0801309da51e08010b51570009010b5157010901278e9f020901278e9f030901309da5040901278e9f050901278e9f060901309da5070901278e9f080901278e9f090901309da50a0901309da50b0901278e9f0c0901278e9f0d0901309da50e0901309da50f0901278e9f100901278e9f110901309da5120901309da5130901278e9f140901278e9f150901309da5160901309da5170901278e9f180901278e9f190901309da51a0901309da51b0901278e9f1c0901278e9f1d0901278e9f1e09010b5157000a010b5157010a01278e9f020a01278e9f030a011a7f91040a011a7f91050a01278e9f060a01278e9f070a01278e9f080a01278e9f090a01278e9f0a0a01309da50b0a01309da50c0a01278e9f0d0a01278e9f0e0a01278e9f0f0a01278e9f100a01278e9f110a01278e9f120a01278e9f130a01278e9f140a011a7f91150a01278e9f160a01278e9f170a01278e9f180a01278e9f190a01309da51a0a01309da51b0a01309da51c0a01278e9f1d0a01278e9f1e0a010b5157000b010b5157010b01278e9f020b01309da5030b01278e9f040b01278e9f050b01309da5060b01309da5070b01278e9f080b01278e9f090b01278e9f0a0b01278e9f0b0b01278e9f0c0b01278e9f0d0b01309da50e0b01278e9f0f0b01278e9f100b01278e9f110b01309da5120b01278e9f130b01278e9f140b011a7f91150b01309da5160b01278e9f170b01278e9f180b01278e9f190b01278e9f1a0b01278e9f1b0b01278e9f1c0b01278e9f1d0b01278e9f1e0b010b5157000c010b5157010c01278e9f020c01309da5030c01278e9f040c01278e9f050c01278e9f060c01278e9f070c01309da5080c01309da5090c01278e9f0a0c011a7f910b0c011a7f910c0c01278e9f0d0c01309da50e0c01278e9f0f0c01309da5100c01278e9f110c01278e9f120c01278e9f130c01278e9f140c01278e9f150c01278e9f160c01309da5170c01309da5180c01278e9f190c011a7f911a0c011a7f911b0c01278e9f1c0c01278e9f1d0c01278e9f1e0c010b5157000d010b5157010d01278e9f020d01278e9f030d01309da5040d01309da5050d01278e9f060d01309da5070d01309da5080d01309da5090d01278e9f0a0d011a7f910b0d01278e9f0c0d01309da50d0d01309da50e0d01278e9f0f0d01309da5100d01278e9f110d01278e9f120d01309da5130d01309da5140d01278e9f150d01309da5160d01309da5170d01309da5180d01278e9f190d011a7f911a0d01278e9f1b0d01309da51c0d01309da51d0d01278e9f1e0d010b5157000e010b5157010e01278e9f020e01309da5030e01309da5040e01309da5050e01278e9f060e01309da5070e01309da5080e01278e9f090e01278e9f0a0e01278e9f0b0e01278e9f0c0e01309da50d0e01309da50e0e01309da50f0e011a7f91100e01278e9f110e01309da5120e01309da5130e01309da5140e01278e9f150e01309da5160e01309da5170e01278e9f180e01278e9f190e01278e9f1a0e01278e9f1b0e01309da51c0e01309da51d0e01309da51e0e010b5157000f010b5157010f01278e9f020f01309da5030f01309da5040f01278e9f050f01278e9f060f01278e9f070f01278e9f080f01278e9f090f01278e9f0a0f01278e9f0b0f01278e9f0c0f01278e9f0d0f01309da50e0f01309da50f0f011a7f91100f011a7f91110f01309da5120f01309da5130f01278e9f140f01278e9f150f01278e9f160f01278e9f170f01278e9f180f01278e9f190f01278e9f1a0f01278e9f1b0f01278e9f1c0f01309da51d0f01309da51e0f010b51570010010b5157011001278e9f021001309da5031001309da5041001278e9f0510011a7f91061001278e9f071001309da5081001309da5091001309da50a1001278e9f0b1001309da50c1001309da50d1001278e9f0e1001278e9f0f1001309da5101001278e9f111001309da5121001309da5131001278e9f1410011a7f91151001278e9f161001309da5171001309da5181001309da5191001278e9f1a1001309da51b1001309da51c1001278e9f1d1001278e9f1e10010b51570011010b5157011101309da5021101309da5031101309da5041101278e9f051101278e9f061101278e9f071101309da5081101309da5091101278e9f0a1101278e9f0b1101278e9f0c1101278e9f0d1101278e9f0e1101278e9f0f1101278e9f101101309da5111101309da5121101309da5131101278e9f141101278e9f151101278e9f161101309da5171101309da5181101278e9f191101278e9f1a1101278e9f1b1101278e9f1c1101278e9f1d1101278e9f1e11010b51570012010b5157011201309da5021201309da5031201278e9f041201309da5051201309da5061201278e9f071201278e9f081201278e9f091201278e9f0a1201278e9f0b1201278e9f0c1201309da50d1201309da50e1201309da50f1201278e9f101201309da5111201309da5121201278e9f131201309da5141201309da5151201278e9f161201278e9f171201278e9f181201278e9f191201278e9f1a1201278e9f1b1201309da51c1201309da51d1201309da51e12010b51570013010b5157011301278e9f021301278e9f031301278e9f041301309da5051301309da5061301278e9f071301278e9f081301278e9f091301309da50a1301309da50b1301278e9f0c1301309da50d1301309da50e1301309da50f1301278e9f101301278e9f111301278e9f121301278e9f131301309da5141301309da5151301278e9f161301278e9f171301278e9f181301309da5191301309da51a1301278e9f1b1301309da51c1301309da51d1301309da51e13010b51570014010b5157011401309da5021401278e9f031401278e9f041401278e9f051401278e9f061401278e9f071401278e9f081401309da5091401309da50a1401309da50b1401278e9f0c1401278e9f0d1401309da50e1401309da50f1401278e9f101401309da5111401278e9f121401278e9f131401278e9f141401278e9f151401278e9f161401278e9f171401309da5181401309da5191401309da51a1401278e9f1b1401278e9f1c1401309da51d1401309da51e14010b51570015010b5157011501309da5021501309da50315011a7f91041501278e9f051501309da5061501309da5071501278e9f081501309da5091501309da50a1501278e9f0b1501278e9f0c1501278e9f0d15011a7f910e15011a7f910f1501309da5101501309da5111501309da51215011a7f91131501278e9f141501309da5151501309da5161501278e9f171501309da5181501309da5191501278e9f1a1501278e9f1b1501278e9f1c15011a7f911d15011a7f911e15010b51570016010b5157011601309da5021601278e9f0316011a7f910416011a7f91051601309da5061601309da5071601278e9f081601278e9f0916011a7f910a1601278e9f0b1601278e9f0c1601278e9f0d1601278e9f0e16011a7f910f1601309da5101601309da5111601278e9f1216011a7f911316011a7f91141601309da5151601309da5161601278e9f171601278e9f1816011a7f91191601278e9f1a1601278e9f1b1601278e9f1c1601278e9f1d16011a7f911e16010b51570017010b51570117010b5157021701278e9f031701278e9f041701278e9f051701278e9f061701278e9f071701278e9f081701278e9f0917011a7f910a17011a7f910b1701278e9f0c1701309da50d1701309da50e1701278e9f0f1701278e9f101701278e9f111701278e9f121701278e9f131701278e9f141701278e9f151701278e9f161701278e9f171701278e9f1817011a7f911917011a7f911a1701278e9f1b1701309da51c1701309da51d17010b51571e17010b51570218010b51570318010b5157041801278e9f051801278e9f061801309da5071801309da5081801278e9f091801309da50a1801309da50b1801278e9f0c1801309da50d1801309da50e1801309da50f18011a7f911018011a7f91111801309da5121801309da5131801278e9f141801278e9f151801309da5161801309da5171801278e9f181801309da5191801309da51a1801278e9f1b18010b51571c18010b51570419010b51570519010b5157061901309da5071901309da5081901278e9f091901309da50a1901309da50b1901278e9f0c1901278e9f0d1901309da50e1901309da50f19011a7f91101901278e9f111901309da5121901309da5131901278e9f141901309da5151901309da5161901309da5171901278e9f181901309da51919010b51571a19010b5157061a010b5157071a010b5157081a01278e9f091a01278e9f0a1a01278e9f0b1a01278e9f0c1a01278e9f0d1a01278e9f0e1a01278e9f0f1a01278e9f101a01278e9f111a01278e9f121a01278e9f131a01278e9f141a01309da5151a01309da5161a01278e9f171a010b5157181a010b5157081b010b5157091b010b51570a1b011a7f910b1b011a7f910c1b01278e9f0d1b01278e9f0e1b01278e9f0f1b01309da5101b01278e9f111b01278e9f121b01278e9f131b01278e9f141b01278e9f151b010b5157161b010b51570a1c010b51570b1c010b51570c1c01309da50d1c01309da50e1c01278e9f0f1c01309da5101c01278e9f111c01278e9f121c01309da5131c010b5157141c010b51570c1d010b51570d1d010b51570e1d01309da50f1d01278e9f101d01278e9f111d010b5157121d010b51570e1e010b51570f1e010b5157101e010b5157");
    const Web$Kaelin$Assets$tile$effect$light_red2 = VoxBox$parse$("0e0001652b270f0001652b27100001652b270c0101652b270d0101652b270e010199615b0f010199615b100101a46e65110101652b27120101652b270a0201652b270b0201652b270c0201a46e650d0201a46e650e0201a46e650f020199615b100201a46e65110201a46e6512020199615b130201652b27140201652b27080301652b27090301652b270a0301a46e650b030199615b0c0301a46e650d0301a46e650e0301a46e650f030199615b10030199615b11030199615b12030199615b130301a46e65140301a46e65150301652b27160301652b27060401652b27070401652b27080401a46e65090401a46e650a0401a46e650b040199615b0c040199615b0d0401a46e650e0401a46e650f040199615b100401a46e6511040199615b12040199615b13040199615b14040199615b15040199615b16040199615b170401652b27180401652b27040501652b27050501652b27060501a46e6507050199615b080501a46e65090501a46e650a050199615b0b050199615b0c050199615b0d05018b534d0e05018b534d0f0501a46e65100501a46e65110501a46e651205018b534d13050199615b140501a46e65150501a46e6516050199615b170501a46e65180501a46e65190501652b271a0501652b27020601652b27030601652b270406018b534d050601a46e65060601a46e6507060199615b08060199615b0906018b534d0a060199615b0b060199615b0c060199615b0d060199615b0e06018b534d0f0601a46e65100601a46e6511060199615b1206018b534d1306018b534d140601a46e65150601a46e6516060199615b17060199615b1806018b534d19060199615b1a060199615b1b0601652b271c0601652b27000701652b27010701652b2702070199615b03070199615b04070199615b050701a46e65060701a46e65070701a46e6508070199615b0907018b534d0a07018b534d0b070199615b0c0701a46e650d0701a46e650e070199615b0f070199615b10070199615b11070199615b12070199615b13070199615b14070199615b15070199615b16070199615b17070199615b1807018b534d1907018b534d1a070199615b1b0701a46e651c0701a46e651d0701652b271e0701652b27000801652b2701080199615b020801a46e65030801a46e6504080199615b050801a46e65060801a46e65070801a46e6508080199615b090801a46e650a0801a46e650b080199615b0c080199615b0d0801a46e650e0801a46e650f08018b534d10080199615b110801a46e65120801a46e6513080199615b140801a46e65150801a46e65160801a46e6517080199615b18080199615b19080199615b1a080199615b1b080199615b1c0801a46e651d0801a46e651e0801652b27000901652b2701090199615b02090199615b030901a46e6504090199615b05090199615b060901a46e6507090199615b08090199615b090901a46e650a0901a46e650b090199615b0c090199615b0d0901a46e650e0901a46e650f090199615b10090199615b110901a46e65120901a46e6513090199615b14090199615b150901a46e65160901a46e6517090199615b18090199615b190901a46e651a0901a46e651b090199615b1c090199615b1d090199615b1e0901652b27000a01652b27010a0199615b020a0199615b030a018b534d040a018b534d050a0199615b060a0199615b070a0199615b080a0199615b090a0199615b0a0a01a46e650b0a01a46e650c0a0199615b0d0a0199615b0e0a0199615b0f0a0199615b100a0199615b110a0199615b120a0199615b130a0199615b140a018b534d150a0199615b160a0199615b170a0199615b180a0199615b190a01a46e651a0a01a46e651b0a01a46e651c0a0199615b1d0a0199615b1e0a01652b27000b01652b27010b0199615b020b01a46e65030b0199615b040b0199615b050b01a46e65060b01a46e65070b0199615b080b0199615b090b0199615b0a0b0199615b0b0b0199615b0c0b0199615b0d0b01a46e650e0b0199615b0f0b0199615b100b0199615b110b01a46e65120b0199615b130b0199615b140b018b534d150b01a46e65160b0199615b170b0199615b180b0199615b190b0199615b1a0b0199615b1b0b0199615b1c0b0199615b1d0b0199615b1e0b01652b27000c01652b27010c0199615b020c01a46e65030c0199615b040c0199615b050c0199615b060c0199615b070c01a46e65080c01a46e65090c0199615b0a0c018b534d0b0c018b534d0c0c0199615b0d0c01a46e650e0c0199615b0f0c01a46e65100c0199615b110c0199615b120c0199615b130c0199615b140c0199615b150c0199615b160c01a46e65170c01a46e65180c0199615b190c018b534d1a0c018b534d1b0c0199615b1c0c0199615b1d0c0199615b1e0c01652b27000d01652b27010d0199615b020d0199615b030d01a46e65040d01a46e65050d0199615b060d01a46e65070d01a46e65080d01a46e65090d0199615b0a0d018b534d0b0d0199615b0c0d01a46e650d0d01a46e650e0d0199615b0f0d01a46e65100d0199615b110d0199615b120d01a46e65130d01a46e65140d0199615b150d01a46e65160d01a46e65170d01a46e65180d0199615b190d018b534d1a0d0199615b1b0d01a46e651c0d01a46e651d0d0199615b1e0d01652b27000e01652b27010e0199615b020e01a46e65030e01a46e65040e01a46e65050e0199615b060e01a46e65070e01a46e65080e0199615b090e0199615b0a0e0199615b0b0e0199615b0c0e01a46e650d0e01a46e650e0e01a46e650f0e018b534d100e0199615b110e01a46e65120e01a46e65130e01a46e65140e0199615b150e01a46e65160e01a46e65170e0199615b180e0199615b190e0199615b1a0e0199615b1b0e01a46e651c0e01a46e651d0e01a46e651e0e01652b27000f01652b27010f0199615b020f01a46e65030f01a46e65040f0199615b050f0199615b060f0199615b070f0199615b080f0199615b090f0199615b0a0f0199615b0b0f0199615b0c0f0199615b0d0f01a46e650e0f01a46e650f0f018b534d100f018b534d110f01a46e65120f01a46e65130f0199615b140f0199615b150f0199615b160f0199615b170f0199615b180f0199615b190f0199615b1a0f0199615b1b0f0199615b1c0f01a46e651d0f01a46e651e0f01652b27001001652b2701100199615b021001a46e65031001a46e6504100199615b0510018b534d06100199615b071001a46e65081001a46e65091001a46e650a100199615b0b1001a46e650c1001a46e650d100199615b0e100199615b0f1001a46e6510100199615b111001a46e65121001a46e6513100199615b1410018b534d15100199615b161001a46e65171001a46e65181001a46e6519100199615b1a1001a46e651b1001a46e651c100199615b1d100199615b1e1001652b27001101652b27011101a46e65021101a46e65031101a46e6504110199615b05110199615b06110199615b071101a46e65081101a46e6509110199615b0a110199615b0b110199615b0c110199615b0d110199615b0e110199615b0f110199615b101101a46e65111101a46e65121101a46e6513110199615b14110199615b15110199615b161101a46e65171101a46e6518110199615b19110199615b1a110199615b1b110199615b1c110199615b1d110199615b1e1101652b27001201652b27011201a46e65021201a46e6503120199615b041201a46e65051201a46e6506120199615b07120199615b08120199615b09120199615b0a120199615b0b120199615b0c1201a46e650d1201a46e650e1201a46e650f120199615b101201a46e65111201a46e6512120199615b131201a46e65141201a46e6515120199615b16120199615b17120199615b18120199615b19120199615b1a120199615b1b1201a46e651c1201a46e651d1201a46e651e1201652b27001301652b2701130199615b02130199615b03130199615b041301a46e65051301a46e6506130199615b07130199615b08130199615b091301a46e650a1301a46e650b130199615b0c1301a46e650d1301a46e650e1301a46e650f130199615b10130199615b11130199615b12130199615b131301a46e65141301a46e6515130199615b16130199615b17130199615b181301a46e65191301a46e651a130199615b1b1301a46e651c1301a46e651d1301a46e651e1301652b27001401652b27011401a46e6502140199615b03140199615b04140199615b05140199615b06140199615b07140199615b081401a46e65091401a46e650a1401a46e650b140199615b0c140199615b0d1401a46e650e1401a46e650f140199615b101401a46e6511140199615b12140199615b13140199615b14140199615b15140199615b16140199615b171401a46e65181401a46e65191401a46e651a140199615b1b140199615b1c1401a46e651d1401a46e651e1401652b27001501652b27011501a46e65021501a46e650315018b534d04150199615b051501a46e65061501a46e6507150199615b081501a46e65091501a46e650a150199615b0b150199615b0c150199615b0d15018b534d0e15018b534d0f1501a46e65101501a46e65111501a46e651215018b534d13150199615b141501a46e65151501a46e6516150199615b171501a46e65181501a46e6519150199615b1a150199615b1b150199615b1c15018b534d1d15018b534d1e1501652b27001601652b27011601a46e6502160199615b0316018b534d0416018b534d051601a46e65061601a46e6507160199615b08160199615b0916018b534d0a160199615b0b160199615b0c160199615b0d160199615b0e16018b534d0f1601a46e65101601a46e6511160199615b1216018b534d1316018b534d141601a46e65151601a46e6516160199615b17160199615b1816018b534d19160199615b1a160199615b1b160199615b1c160199615b1d16018b534d1e1601652b27001701652b27011701652b2702170199615b03170199615b04170199615b05170199615b06170199615b07170199615b08170199615b0917018b534d0a17018b534d0b170199615b0c1701a46e650d1701a46e650e170199615b0f170199615b10170199615b11170199615b12170199615b13170199615b14170199615b15170199615b16170199615b17170199615b1817018b534d1917018b534d1a170199615b1b1701a46e651c1701a46e651d1701652b271e1701652b27021801652b27031801652b2704180199615b05180199615b061801a46e65071801a46e6508180199615b091801a46e650a1801a46e650b180199615b0c1801a46e650d1801a46e650e1801a46e650f18018b534d1018018b534d111801a46e65121801a46e6513180199615b14180199615b151801a46e65161801a46e6517180199615b181801a46e65191801a46e651a180199615b1b1801652b271c1801652b27041901652b27051901652b27061901a46e65071901a46e6508190199615b091901a46e650a1901a46e650b190199615b0c190199615b0d1901a46e650e1901a46e650f19018b534d10190199615b111901a46e65121901a46e6513190199615b141901a46e65151901a46e65161901a46e6517190199615b181901a46e65191901652b271a1901652b27061a01652b27071a01652b27081a0199615b091a0199615b0a1a0199615b0b1a0199615b0c1a0199615b0d1a0199615b0e1a0199615b0f1a0199615b101a0199615b111a0199615b121a0199615b131a0199615b141a01a46e65151a01a46e65161a0199615b171a01652b27181a01652b27081b01652b27091b01652b270a1b018b534d0b1b018b534d0c1b0199615b0d1b0199615b0e1b0199615b0f1b01a46e65101b0199615b111b0199615b121b0199615b131b0199615b141b0199615b151b01652b27161b01652b270a1c01652b270b1c01652b270c1c01a46e650d1c01a46e650e1c0199615b0f1c01a46e65101c0199615b111c0199615b121c01a46e65131c01652b27141c01652b270c1d01652b270d1d01652b270e1d01a46e650f1d0199615b101d0199615b111d01652b27121d01652b270e1e01652b270f1e01652b27101e01652b27");

    function Web$Kaelin$Terrain$grass$(_draw$1) {
        var $461 = ({
            _: 'Web.Kaelin.Terrain.grass',
            'draw': _draw$1
        });
        return $461;
    };
    const Web$Kaelin$Terrain$grass = x0 => Web$Kaelin$Terrain$grass$(x0);

    function Web$Kaelin$Entity$background$(_terrain$1) {
        var $462 = ({
            _: 'Web.Kaelin.Entity.background',
            'terrain': _terrain$1
        });
        return $462;
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
        var $463 = (((_n$1) >> 0));
        return $463;
    };
    const U32$to_i32 = x0 => U32$to_i32$(x0);

    function Web$Kaelin$Coord$Cubic$new$(_x$1, _y$2, _z$3) {
        var $464 = ({
            _: 'Web.Kaelin.Coord.Cubic.new',
            'x': _x$1,
            'y': _y$2,
            'z': _z$3
        });
        return $464;
    };
    const Web$Kaelin$Coord$Cubic$new = x0 => x1 => x2 => Web$Kaelin$Coord$Cubic$new$(x0, x1, x2);

    function Web$Kaelin$Coord$Convert$axial_to_cubic$(_coord$1) {
        var self = _coord$1;
        switch (self._) {
            case 'Web.Kaelin.Coord.new':
                var $466 = self.i;
                var $467 = self.j;
                var _x$4 = $466;
                var _z$5 = $467;
                var _y$6 = ((((-_x$4)) - _z$5) >> 0);
                var $468 = Web$Kaelin$Coord$Cubic$new$(_x$4, _y$6, _z$5);
                var $465 = $468;
                break;
        };
        return $465;
    };
    const Web$Kaelin$Coord$Convert$axial_to_cubic = x0 => Web$Kaelin$Coord$Convert$axial_to_cubic$(x0);

    function I32$abs$(_a$1) {
        var self = _a$1;
        switch ('i32') {
            case 'i32':
                var $470 = i32_to_word(self);
                var $471 = I32$new$(Word$abs$($470));
                var $469 = $471;
                break;
        };
        return $469;
    };
    const I32$abs = x0 => I32$abs$(x0);

    function Cmp$inv$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
                var $473 = Cmp$gtn;
                var $472 = $473;
                break;
            case 'Cmp.eql':
                var $474 = Cmp$eql;
                var $472 = $474;
                break;
            case 'Cmp.gtn':
                var $475 = Cmp$ltn;
                var $472 = $475;
                break;
        };
        return $472;
    };
    const Cmp$inv = x0 => Cmp$inv$(x0);

    function Word$s_gtn$(_a$2, _b$3) {
        var _neg_a$4 = Word$is_neg$(_a$2);
        var _neg_b$5 = Word$is_neg$(_b$3);
        var self = _neg_a$4;
        if (self) {
            var self = _neg_b$5;
            if (self) {
                var $478 = Cmp$as_gtn$(Cmp$inv$(Word$cmp$(_a$2, _b$3)));
                var $477 = $478;
            } else {
                var $479 = Bool$false;
                var $477 = $479;
            };
            var $476 = $477;
        } else {
            var self = _neg_b$5;
            if (self) {
                var $481 = Bool$true;
                var $480 = $481;
            } else {
                var $482 = Cmp$as_gtn$(Word$cmp$(_a$2, _b$3));
                var $480 = $482;
            };
            var $476 = $480;
        };
        return $476;
    };
    const Word$s_gtn = x0 => x1 => Word$s_gtn$(x0, x1);
    const I32$gtn = a0 => a1 => (a0 > a1);

    function I32$max$(_a$1, _b$2) {
        var self = (_a$1 > _b$2);
        if (self) {
            var $484 = _a$1;
            var $483 = $484;
        } else {
            var $485 = _b$2;
            var $483 = $485;
        };
        return $483;
    };
    const I32$max = x0 => x1 => I32$max$(x0, x1);
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
        var $486 = (((_n$1) >>> 0));
        return $486;
    };
    const I32$to_u32 = x0 => I32$to_u32$(x0);

    function Cmp$as_lte$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
            case 'Cmp.eql':
                var $488 = Bool$true;
                var $487 = $488;
                break;
            case 'Cmp.gtn':
                var $489 = Bool$false;
                var $487 = $489;
                break;
        };
        return $487;
    };
    const Cmp$as_lte = x0 => Cmp$as_lte$(x0);

    function Word$lte$(_a$2, _b$3) {
        var $490 = Cmp$as_lte$(Word$cmp$(_a$2, _b$3));
        return $490;
    };
    const Word$lte = x0 => x1 => Word$lte$(x0, x1);
    const U32$lte = a0 => a1 => (a0 <= a1);

    function Web$Kaelin$Coord$fit$(_coord$1, _map_size$2) {
        var _coord$3 = Web$Kaelin$Coord$Convert$axial_to_cubic$(_coord$1);
        var self = _coord$3;
        switch (self._) {
            case 'Web.Kaelin.Coord.Cubic.new':
                var $492 = self.x;
                var $493 = self.y;
                var $494 = self.z;
                var _x$7 = I32$abs$($492);
                var _y$8 = I32$abs$($493);
                var _z$9 = I32$abs$($494);
                var _greater$10 = I32$max$(_x$7, I32$max$(_y$8, _z$9));
                var _greater$11 = I32$to_u32$(_greater$10);
                var $495 = (_greater$11 <= _map_size$2);
                var $491 = $495;
                break;
        };
        return $491;
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
                    var $498 = self.effect;
                    var $499 = self.mouse_over;
                    var self = $499;
                    if (self) {
                        var self = $498;
                        switch (self._) {
                            case 'Web.Kaelin.HexEffect.normal':
                                var $502 = Web$Kaelin$Assets$tile$effect$blue_green2;
                                var $501 = $502;
                                break;
                            case 'Web.Kaelin.HexEffect.movement':
                                var $503 = Web$Kaelin$Assets$tile$effect$dark_blue2;
                                var $501 = $503;
                                break;
                            case 'Web.Kaelin.HexEffect.ability':
                                var $504 = Web$Kaelin$Assets$tile$effect$dark_red2;
                                var $501 = $504;
                                break;
                        };
                        var $500 = $501;
                    } else {
                        var self = $498;
                        switch (self._) {
                            case 'Web.Kaelin.HexEffect.normal':
                                var $506 = Web$Kaelin$Assets$tile$green_2;
                                var $505 = $506;
                                break;
                            case 'Web.Kaelin.HexEffect.movement':
                                var $507 = Web$Kaelin$Assets$tile$effect$light_blue2;
                                var $505 = $507;
                                break;
                            case 'Web.Kaelin.HexEffect.ability':
                                var $508 = Web$Kaelin$Assets$tile$effect$light_red2;
                                var $505 = $508;
                                break;
                        };
                        var $500 = $505;
                    };
                    var $497 = $500;
                    break;
            };
            return $497;
        });
        var _new_terrain$6 = Web$Kaelin$Terrain$grass$(_terrain_img$5);
        var _new_terrain$7 = Web$Kaelin$Entity$background$(_new_terrain$6);
        var _map$8 = (() => {
            var $509 = _map$1;
            var $510 = 0;
            var $511 = _height$4;
            let _map$9 = $509;
            for (let _j$8 = $510; _j$8 < $511; ++_j$8) {
                var _map$10 = (() => {
                    var $512 = _map$9;
                    var $513 = 0;
                    var $514 = _width$3;
                    let _map$11 = $512;
                    for (let _i$10 = $513; _i$10 < $514; ++_i$10) {
                        var _coord_i$12 = ((U32$to_i32$(_i$10) - U32$to_i32$(_map_size$2)) >> 0);
                        var _coord_j$13 = ((U32$to_i32$(_j$8) - U32$to_i32$(_map_size$2)) >> 0);
                        var _coord$14 = Web$Kaelin$Coord$new$(_coord_i$12, _coord_j$13);
                        var _fit$15 = Web$Kaelin$Coord$fit$(_coord$14, _map_size$2);
                        var self = _fit$15;
                        if (self) {
                            var $515 = Web$Kaelin$Map$push$(_coord$14, _new_terrain$7, _map$11);
                            var $512 = $515;
                        } else {
                            var $516 = _map$11;
                            var $512 = $516;
                        };
                        _map$11 = $512;
                    };
                    return _map$11;
                })();
                var $509 = _map$10;
                _map$9 = $509;
            };
            return _map$9;
        })();
        var $496 = _map$8;
        return $496;
    })();

    function App$EnvInfo$new$(_screen_size$1, _mouse_pos$2) {
        var $517 = ({
            _: 'App.EnvInfo.new',
            'screen_size': _screen_size$1,
            'mouse_pos': _mouse_pos$2
        });
        return $517;
    };
    const App$EnvInfo$new = x0 => x1 => App$EnvInfo$new$(x0, x1);

    function Web$Kaelin$State$game$(_room$1, _players$2, _cast_info$3, _map$4, _internal$5, _interface$6) {
        var $518 = ({
            _: 'Web.Kaelin.State.game',
            'room': _room$1,
            'players': _players$2,
            'cast_info': _cast_info$3,
            'map': _map$4,
            'internal': _internal$5,
            'interface': _interface$6
        });
        return $518;
    };
    const Web$Kaelin$State$game = x0 => x1 => x2 => x3 => x4 => x5 => Web$Kaelin$State$game$(x0, x1, x2, x3, x4, x5);

    function Web$Kaelin$Internal$new$(_tick$1, _frame$2, _timer$3) {
        var $519 = ({
            _: 'Web.Kaelin.Internal.new',
            'tick': _tick$1,
            'frame': _frame$2,
            'timer': _timer$3
        });
        return $519;
    };
    const Web$Kaelin$Internal$new = x0 => x1 => x2 => Web$Kaelin$Internal$new$(x0, x1, x2);
    const Web$Kaelin$App$init = (() => {
        var _room$1 = Web$Kaelin$Constants$room;
        var _tick$2 = 0n;
        var _frame$3 = 0n;
        var _players$4 = Map$from_list$(List$nil);
        var _cast_info$5 = Web$Kaelin$CastInfo$new$(Web$Kaelin$Coord$new$(Int$to_i32$(Int$from_nat$(0n)), Int$to_i32$(Int$from_nat$(0n))), Web$Kaelin$Coord$new$(Int$to_i32$(Int$from_nat$(0n)), Int$to_i32$(Int$from_nat$(0n))), 0n, Web$Kaelin$HexEffect$normal);
        var _map$6 = Web$Kaelin$Map$init$(Web$Kaelin$Map$arena);
        var _interface$7 = App$EnvInfo$new$(Pair$new$(256, 256), Pair$new$(0, 0));
        var $520 = Web$Kaelin$State$game$(_room$1, _players$4, _cast_info$5, _map$6, Web$Kaelin$Internal$new$(_tick$2, _frame$3, List$nil), _interface$7);
        return $520;
    })();

    function DOM$text$(_value$1) {
        var $521 = ({
            _: 'DOM.text',
            'value': _value$1
        });
        return $521;
    };
    const DOM$text = x0 => DOM$text$(x0);

    function DOM$vbox$(_props$1, _style$2, _value$3) {
        var $522 = ({
            _: 'DOM.vbox',
            'props': _props$1,
            'style': _style$2,
            'value': _value$3
        });
        return $522;
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
                        var $523 = self.head;
                        var $524 = self.tail;
                        var $525 = List$reverse$go$($524, List$cons$($523, _res$3));
                        return $525;
                    case 'List.nil':
                        var $526 = _res$3;
                        return $526;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const List$reverse$go = x0 => x1 => List$reverse$go$(x0, x1);

    function List$reverse$(_xs$2) {
        var $527 = List$reverse$go$(_xs$2, List$nil);
        return $527;
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
                        var $528 = self.slice(0, -1);
                        var $529 = Bits$reverse$tco$($528, (_r$2 + '0'));
                        return $529;
                    case 'i':
                        var $530 = self.slice(0, -1);
                        var $531 = Bits$reverse$tco$($530, (_r$2 + '1'));
                        return $531;
                    case 'e':
                        var $532 = _r$2;
                        return $532;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Bits$reverse$tco = x0 => x1 => Bits$reverse$tco$(x0, x1);

    function Bits$reverse$(_a$1) {
        var $533 = Bits$reverse$tco$(_a$1, Bits$e);
        return $533;
    };
    const Bits$reverse = x0 => Bits$reverse$(x0);

    function BitsMap$to_list$go$(_xs$2, _key$3, _list$4) {
        var self = _xs$2;
        switch (self._) {
            case 'BitsMap.tie':
                var $535 = self.val;
                var $536 = self.lft;
                var $537 = self.rgt;
                var self = $535;
                switch (self._) {
                    case 'Maybe.some':
                        var $539 = self.value;
                        var $540 = List$cons$(Pair$new$(Bits$reverse$(_key$3), $539), _list$4);
                        var _list0$8 = $540;
                        break;
                    case 'Maybe.none':
                        var $541 = _list$4;
                        var _list0$8 = $541;
                        break;
                };
                var _list1$9 = BitsMap$to_list$go$($536, (_key$3 + '0'), _list0$8);
                var _list2$10 = BitsMap$to_list$go$($537, (_key$3 + '1'), _list1$9);
                var $538 = _list2$10;
                var $534 = $538;
                break;
            case 'BitsMap.new':
                var $542 = _list$4;
                var $534 = $542;
                break;
        };
        return $534;
    };
    const BitsMap$to_list$go = x0 => x1 => x2 => BitsMap$to_list$go$(x0, x1, x2);

    function List$mapped$(_as$2, _f$4) {
        var self = _as$2;
        switch (self._) {
            case 'List.cons':
                var $544 = self.head;
                var $545 = self.tail;
                var $546 = List$cons$(_f$4($544), List$mapped$($545, _f$4));
                var $543 = $546;
                break;
            case 'List.nil':
                var $547 = List$nil;
                var $543 = $547;
                break;
        };
        return $543;
    };
    const List$mapped = x0 => x1 => List$mapped$(x0, x1);

    function Bits$to_nat$(_b$1) {
        var self = _b$1;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'o':
                var $549 = self.slice(0, -1);
                var $550 = (2n * Bits$to_nat$($549));
                var $548 = $550;
                break;
            case 'i':
                var $551 = self.slice(0, -1);
                var $552 = Nat$succ$((2n * Bits$to_nat$($551)));
                var $548 = $552;
                break;
            case 'e':
                var $553 = 0n;
                var $548 = $553;
                break;
        };
        return $548;
    };
    const Bits$to_nat = x0 => Bits$to_nat$(x0);

    function NatMap$to_list$(_xs$2) {
        var _kvs$3 = List$reverse$(BitsMap$to_list$go$(_xs$2, Bits$e, List$nil));
        var $554 = List$mapped$(_kvs$3, (_kv$4 => {
            var self = _kv$4;
            switch (self._) {
                case 'Pair.new':
                    var $556 = self.fst;
                    var $557 = self.snd;
                    var $558 = Pair$new$(Bits$to_nat$($556), $557);
                    var $555 = $558;
                    break;
            };
            return $555;
        }));
        return $554;
    };
    const NatMap$to_list = x0 => NatMap$to_list$(x0);

    function List$map$(_f$3, _as$4) {
        var self = _as$4;
        switch (self._) {
            case 'List.cons':
                var $560 = self.head;
                var $561 = self.tail;
                var $562 = List$cons$(_f$3($560), List$map$(_f$3, $561));
                var $559 = $562;
                break;
            case 'List.nil':
                var $563 = List$nil;
                var $559 = $563;
                break;
        };
        return $559;
    };
    const List$map = x0 => x1 => List$map$(x0, x1);

    function Web$Kaelin$Coord$Convert$cubic_to_axial$(_coord$1) {
        var self = _coord$1;
        switch (self._) {
            case 'Web.Kaelin.Coord.Cubic.new':
                var $565 = self.x;
                var $566 = self.z;
                var _i$5 = $565;
                var _j$6 = $566;
                var $567 = Web$Kaelin$Coord$new$(_i$5, _j$6);
                var $564 = $567;
                break;
        };
        return $564;
    };
    const Web$Kaelin$Coord$Convert$cubic_to_axial = x0 => Web$Kaelin$Coord$Convert$cubic_to_axial$(x0);
    const I32$add = a0 => a1 => ((a0 + a1) >> 0);

    function Cmp$as_ltn$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
                var $569 = Bool$true;
                var $568 = $569;
                break;
            case 'Cmp.eql':
            case 'Cmp.gtn':
                var $570 = Bool$false;
                var $568 = $570;
                break;
        };
        return $568;
    };
    const Cmp$as_ltn = x0 => Cmp$as_ltn$(x0);

    function Word$s_ltn$(_a$2, _b$3) {
        var _neg_a$4 = Word$is_neg$(_a$2);
        var _neg_b$5 = Word$is_neg$(_b$3);
        var self = _neg_a$4;
        if (self) {
            var self = _neg_b$5;
            if (self) {
                var $573 = Cmp$as_ltn$(Cmp$inv$(Word$cmp$(_a$2, _b$3)));
                var $572 = $573;
            } else {
                var $574 = Bool$true;
                var $572 = $574;
            };
            var $571 = $572;
        } else {
            var self = _neg_b$5;
            if (self) {
                var $576 = Bool$false;
                var $575 = $576;
            } else {
                var $577 = Cmp$as_ltn$(Word$cmp$(_a$2, _b$3));
                var $575 = $577;
            };
            var $571 = $575;
        };
        return $571;
    };
    const Word$s_ltn = x0 => x1 => Word$s_ltn$(x0, x1);
    const I32$ltn = a0 => a1 => (a0 < a1);

    function I32$min$(_a$1, _b$2) {
        var self = (_a$1 < _b$2);
        if (self) {
            var $579 = _a$1;
            var $578 = $579;
        } else {
            var $580 = _b$2;
            var $578 = $580;
        };
        return $578;
    };
    const I32$min = x0 => x1 => I32$min$(x0, x1);

    function Web$Kaelin$Coord$Cubic$add$(_a$1, _b$2) {
        var self = _a$1;
        switch (self._) {
            case 'Web.Kaelin.Coord.Cubic.new':
                var $582 = self.x;
                var $583 = self.y;
                var $584 = self.z;
                var self = _b$2;
                switch (self._) {
                    case 'Web.Kaelin.Coord.Cubic.new':
                        var $586 = self.x;
                        var $587 = self.y;
                        var $588 = self.z;
                        var _x$9 = (($582 + $586) >> 0);
                        var _y$10 = (($583 + $587) >> 0);
                        var _z$11 = (($584 + $588) >> 0);
                        var $589 = Web$Kaelin$Coord$Cubic$new$(_x$9, _y$10, _z$11);
                        var $585 = $589;
                        break;
                };
                var $581 = $585;
                break;
        };
        return $581;
    };
    const Web$Kaelin$Coord$Cubic$add = x0 => x1 => Web$Kaelin$Coord$Cubic$add$(x0, x1);

    function List$concat$(_as$2, _bs$3) {
        var self = _as$2;
        switch (self._) {
            case 'List.cons':
                var $591 = self.head;
                var $592 = self.tail;
                var $593 = List$cons$($591, List$concat$($592, _bs$3));
                var $590 = $593;
                break;
            case 'List.nil':
                var $594 = _bs$3;
                var $590 = $594;
                break;
        };
        return $590;
    };
    const List$concat = x0 => x1 => List$concat$(x0, x1);

    function Web$Kaelin$Coord$Cubic$range$(_coord$1, _distance$2) {
        var _distance_32$3 = (Number(_distance$2) >>> 0);
        var _distance_i32$4 = U32$to_i32$(_distance_32$3);
        var _double_distance$5 = ((((_distance_32$3 * 2) >>> 0) + 1) >>> 0);
        var _result$6 = List$nil;
        var _result$7 = (() => {
            var $596 = _result$6;
            var $597 = 0;
            var $598 = _double_distance$5;
            let _result$8 = $596;
            for (let _j$7 = $597; _j$7 < $598; ++_j$7) {
                var _negative_distance$9 = ((-_distance_i32$4));
                var _positive_distance$10 = _distance_i32$4;
                var _x$11 = ((U32$to_i32$(_j$7) - _positive_distance$10) >> 0);
                var _max$12 = I32$max$(_negative_distance$9, ((((-_x$11)) + _negative_distance$9) >> 0));
                var _min$13 = I32$min$(_positive_distance$10, ((((-_x$11)) + _positive_distance$10) >> 0));
                var _distance_between_max_min$14 = ((1 + I32$to_u32$(I32$abs$(((_max$12 - _min$13) >> 0)))) >>> 0);
                var _result$15 = (() => {
                    var $599 = _result$8;
                    var $600 = 0;
                    var $601 = _distance_between_max_min$14;
                    let _result$16 = $599;
                    for (let _i$15 = $600; _i$15 < $601; ++_i$15) {
                        var _y$17 = ((U32$to_i32$(_i$15) + _max$12) >> 0);
                        var _z$18 = ((((-_x$11)) - _y$17) >> 0);
                        var _new_coord$19 = Web$Kaelin$Coord$Cubic$add$(_coord$1, Web$Kaelin$Coord$Cubic$new$(_x$11, _y$17, _z$18));
                        var _result$20 = List$concat$(_result$16, List$cons$(_new_coord$19, List$nil));
                        var $599 = _result$20;
                        _result$16 = $599;
                    };
                    return _result$16;
                })();
                var $596 = _result$15;
                _result$8 = $596;
            };
            return _result$8;
        })();
        var $595 = _result$7;
        return $595;
    };
    const Web$Kaelin$Coord$Cubic$range = x0 => x1 => Web$Kaelin$Coord$Cubic$range$(x0, x1);

    function Web$Kaelin$Coord$Axial$range$(_a$1, _distance$2) {
        var _ab$3 = Web$Kaelin$Coord$Convert$axial_to_cubic$(_a$1);
        var _d$4 = _distance$2;
        var $602 = List$map$(Web$Kaelin$Coord$Convert$cubic_to_axial, Web$Kaelin$Coord$Cubic$range$(_ab$3, _d$4));
        return $602;
    };
    const Web$Kaelin$Coord$Axial$range = x0 => x1 => Web$Kaelin$Coord$Axial$range$(x0, x1);

    function List$filter$(_f$2, _xs$3) {
        var self = _xs$3;
        switch (self._) {
            case 'List.cons':
                var $604 = self.head;
                var $605 = self.tail;
                var self = _f$2($604);
                if (self) {
                    var $607 = List$cons$($604, List$filter$(_f$2, $605));
                    var $606 = $607;
                } else {
                    var $608 = List$filter$(_f$2, $605);
                    var $606 = $608;
                };
                var $603 = $606;
                break;
            case 'List.nil':
                var $609 = List$nil;
                var $603 = $609;
                break;
        };
        return $603;
    };
    const List$filter = x0 => x1 => List$filter$(x0, x1);

    function Web$Kaelin$Coord$range$(_coord$1, _distance$2) {
        var _list_coords$3 = Web$Kaelin$Coord$Axial$range$(_coord$1, _distance$2);
        var _fit$4 = (_x$4 => {
            var $611 = Web$Kaelin$Coord$fit$(_x$4, Web$Kaelin$Constants$map_size);
            return $611;
        });
        var $610 = List$filter$(_fit$4, _list_coords$3);
        return $610;
    };
    const Web$Kaelin$Coord$range = x0 => x1 => Web$Kaelin$Coord$range$(x0, x1);
    const List$for = a0 => a1 => a2 => (list_for(a0)(a1)(a2));

    function Bits$tail$(_a$1) {
        var self = _a$1;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'o':
                var $613 = self.slice(0, -1);
                var $614 = $613;
                var $612 = $614;
                break;
            case 'i':
                var $615 = self.slice(0, -1);
                var $616 = $615;
                var $612 = $616;
                break;
            case 'e':
                var $617 = Bits$e;
                var $612 = $617;
                break;
        };
        return $612;
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
                    var $618 = _value$2;
                    return $618;
                } else {
                    var $619 = (self - 1n);
                    var $620 = Bits$shift_right$($619, Bits$tail$(_value$2));
                    return $620;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Bits$shift_right = x0 => x1 => Bits$shift_right$(x0, x1);

    function Bits$add$(_a$1, _b$2) {
        var self = _b$2;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'o':
                var $622 = self.slice(0, -1);
                var self = _a$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'o':
                        var $624 = self.slice(0, -1);
                        var $625 = (Bits$add$($624, $622) + '0');
                        var $623 = $625;
                        break;
                    case 'i':
                        var $626 = self.slice(0, -1);
                        var $627 = (Bits$add$($626, $622) + '1');
                        var $623 = $627;
                        break;
                    case 'e':
                        var $628 = _b$2;
                        var $623 = $628;
                        break;
                };
                var $621 = $623;
                break;
            case 'i':
                var $629 = self.slice(0, -1);
                var self = _a$1;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'o':
                        var $631 = self.slice(0, -1);
                        var $632 = (Bits$add$($631, $629) + '1');
                        var $630 = $632;
                        break;
                    case 'i':
                        var $633 = self.slice(0, -1);
                        var $634 = (Bits$add$(Bits$inc$($633), $629) + '0');
                        var $630 = $634;
                        break;
                    case 'e':
                        var $635 = _b$2;
                        var $630 = $635;
                        break;
                };
                var $621 = $630;
                break;
            case 'e':
                var $636 = _a$1;
                var $621 = $636;
                break;
        };
        return $621;
    };
    const Bits$add = x0 => x1 => Bits$add$(x0, x1);

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
                        var $637 = self.slice(0, -1);
                        var $638 = Bits$size$go$($637, Nat$succ$(_n$2), _s$3);
                        return $638;
                    case 'i':
                        var $639 = self.slice(0, -1);
                        var $640 = Bits$size$go$($639, Nat$succ$(_n$2), Nat$succ$(_n$2));
                        return $640;
                    case 'e':
                        var $641 = _s$3;
                        return $641;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Bits$size$go = x0 => x1 => x2 => Bits$size$go$(x0, x1, x2);

    function Bits$size$(_bits$1) {
        var $642 = Bits$size$go$(_bits$1, 0n, 0n);
        return $642;
    };
    const Bits$size = x0 => Bits$size$(x0);

    function Bits$shift_left$(_n$1, _value$2) {
        var self = _n$1;
        if (self === 0n) {
            var $644 = _value$2;
            var $643 = $644;
        } else {
            var $645 = (self - 1n);
            var $646 = (Bits$shift_left$($645, _value$2) + '0');
            var $643 = $646;
        };
        return $643;
    };
    const Bits$shift_left = x0 => x1 => Bits$shift_left$(x0, x1);

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
                        var $647 = self.slice(0, -1);
                        var self = _b$2;
                        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                            case 'o':
                                var $649 = self.slice(0, -1);
                                var $650 = Bits$cmp$go$($647, $649, _c$3);
                                var $648 = $650;
                                break;
                            case 'i':
                                var $651 = self.slice(0, -1);
                                var $652 = Bits$cmp$go$($647, $651, Cmp$ltn);
                                var $648 = $652;
                                break;
                            case 'e':
                                var $653 = Bits$cmp$go$($647, Bits$e, _c$3);
                                var $648 = $653;
                                break;
                        };
                        return $648;
                    case 'i':
                        var $654 = self.slice(0, -1);
                        var self = _b$2;
                        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                            case 'o':
                                var $656 = self.slice(0, -1);
                                var $657 = Bits$cmp$go$($654, $656, Cmp$gtn);
                                var $655 = $657;
                                break;
                            case 'i':
                                var $658 = self.slice(0, -1);
                                var $659 = Bits$cmp$go$($654, $658, _c$3);
                                var $655 = $659;
                                break;
                            case 'e':
                                var $660 = Cmp$gtn;
                                var $655 = $660;
                                break;
                        };
                        return $655;
                    case 'e':
                        var self = _b$2;
                        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                            case 'o':
                                var $662 = self.slice(0, -1);
                                var $663 = Bits$cmp$go$(Bits$e, $662, _c$3);
                                var $661 = $663;
                                break;
                            case 'e':
                                var $664 = _c$3;
                                var $661 = $664;
                                break;
                            case 'i':
                                var $665 = Cmp$ltn;
                                var $661 = $665;
                                break;
                        };
                        return $661;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Bits$cmp$go = x0 => x1 => x2 => Bits$cmp$go$(x0, x1, x2);

    function Bits$cmp$(_a$1, _b$2) {
        var $666 = Bits$cmp$go$(_a$1, _b$2, Cmp$eql);
        return $666;
    };
    const Bits$cmp = x0 => x1 => Bits$cmp$(x0, x1);

    function Bits$gte$(_a$1, _b$2) {
        var $667 = Cmp$as_gte$(Bits$cmp$(_a$1, _b$2));
        return $667;
    };
    const Bits$gte = x0 => x1 => Bits$gte$(x0, x1);

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
                        var $668 = self.slice(0, -1);
                        var self = _a$1;
                        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                            case 'o':
                                var $670 = self.slice(0, -1);
                                var $671 = Bits$sub$go$($670, $668, (_bits$3 + '0'));
                                var $669 = $671;
                                break;
                            case 'i':
                                var $672 = self.slice(0, -1);
                                var $673 = Bits$sub$go$($672, $668, (_bits$3 + '1'));
                                var $669 = $673;
                                break;
                            case 'e':
                                var $674 = Bits$sub$go$(_a$1, $668, (_bits$3 + '0'));
                                var $669 = $674;
                                break;
                        };
                        return $669;
                    case 'i':
                        var $675 = self.slice(0, -1);
                        var self = _a$1;
                        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                            case 'o':
                                var $677 = self.slice(0, -1);
                                var $678 = Bits$sub$go$($677, Bits$inc$($675), (_bits$3 + '1'));
                                var $676 = $678;
                                break;
                            case 'i':
                                var $679 = self.slice(0, -1);
                                var $680 = Bits$sub$go$($679, $675, (_bits$3 + '0'));
                                var $676 = $680;
                                break;
                            case 'e':
                                var $681 = Bits$e;
                                var $676 = $681;
                                break;
                        };
                        return $676;
                    case 'e':
                        var self = _a$1;
                        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                            case 'o':
                                var $683 = self.slice(0, -1);
                                var $684 = Bits$sub$go$($683, _b$2, (_bits$3 + '0'));
                                var $682 = $684;
                                break;
                            case 'i':
                                var $685 = self.slice(0, -1);
                                var $686 = Bits$sub$go$($685, _b$2, (_bits$3 + '1'));
                                var $682 = $686;
                                break;
                            case 'e':
                                var $687 = _bits$3;
                                var $682 = $687;
                                break;
                        };
                        return $682;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Bits$sub$go = x0 => x1 => x2 => Bits$sub$go$(x0, x1, x2);

    function Bits$sub$(_a$1, _b$2) {
        var $688 = Bits$reverse$(Bits$sub$go$(_a$1, _b$2, Bits$e));
        return $688;
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
                    var $689 = Pair$new$(Bool$true, (_value$4 + '1'));
                    var self = $689;
                } else {
                    var $690 = Pair$new$(Bool$false, (_value$4 + '0'));
                    var self = $690;
                };
                switch (self._) {
                    case 'Pair.new':
                        var $691 = self.fst;
                        var $692 = self.snd;
                        var self = _shift$1;
                        if (self === 0n) {
                            var $694 = $692;
                            var $693 = $694;
                        } else {
                            var $695 = (self - 1n);
                            var _new_shift_copy$8 = Bits$shift_right$(1n, _shift_copy$3);
                            var self = $691;
                            if (self) {
                                var $697 = Bits$sub$(_sub_copy$2, _shift_copy$3);
                                var _new_sub_copy$9 = $697;
                            } else {
                                var $698 = _sub_copy$2;
                                var _new_sub_copy$9 = $698;
                            };
                            var $696 = Bits$div$go$($695, _new_sub_copy$9, _new_shift_copy$8, $692);
                            var $693 = $696;
                        };
                        return $693;
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
            var $700 = (Bits$e + '0');
            var $699 = $700;
        } else {
            var _shift$5 = (_a_size$3 - _b_size$4 <= 0n ? 0n : _a_size$3 - _b_size$4);
            var _shift_copy$6 = Bits$shift_left$(_shift$5, _b$2);
            var $701 = Bits$div$go$(_shift$5, _a$1, _shift_copy$6, Bits$e);
            var $699 = $701;
        };
        return $699;
    };
    const Bits$div = x0 => x1 => Bits$div$(x0, x1);

    function Bits$ltn$(_a$1, _b$2) {
        var $702 = Cmp$as_ltn$(Bits$cmp$(_a$1, _b$2));
        return $702;
    };
    const Bits$ltn = x0 => x1 => Bits$ltn$(x0, x1);

    function Maybe$unfold$(_B$1, _f$2, _b$3) {
        var Maybe$unfold$ = (_B$1, _f$2, _b$3) => ({
            ctr: 'TCO',
            arg: [_B$1, _f$2, _b$3]
        });
        var Maybe$unfold = _B$1 => _f$2 => _b$3 => Maybe$unfold$(_B$1, _f$2, _b$3);
        var arg = [_B$1, _f$2, _b$3];
        while (true) {
            let [_B$1, _f$2, _b$3] = arg;
            var R = (() => {
                var self = _f$2(_b$3);
                switch (self._) {
                    case 'Maybe.some':
                        var $703 = self.value;
                        var $704 = Maybe$unfold$(null, _f$2, $703);
                        return $704;
                    case 'Maybe.none':
                        var $705 = _b$3;
                        return $705;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Maybe$unfold = x0 => x1 => x2 => Maybe$unfold$(x0, x1, x2);

    function Bits$sqrt$(_s$1) {
        var _aproximation$2 = (_x$2 => {
            var $707 = Bits$shift_right$(1n, Bits$add$(_x$2, Bits$div$(_s$1, _x$2)));
            return $707;
        });
        var _accumulator$3 = (_x$3 => {
            var _x1$4 = _aproximation$2(_x$3);
            var self = Bits$ltn$(_x1$4, _x$3);
            if (self) {
                var $709 = Maybe$some$(_aproximation$2(_x1$4));
                var $708 = $709;
            } else {
                var $710 = Maybe$none;
                var $708 = $710;
            };
            return $708;
        });
        var $706 = Maybe$unfold$(null, _accumulator$3, Bits$shift_right$(1n, _s$1));
        return $706;
    };
    const Bits$sqrt = x0 => Bits$sqrt$(x0);

    function Nat$sqrt$(_x$1) {
        var _n$2 = (nat_to_bits(_x$1));
        var $711 = Bits$to_nat$(Bits$sqrt$(_n$2));
        return $711;
    };
    const Nat$sqrt = x0 => Nat$sqrt$(x0);
    const Nat$pow = a0 => a1 => (a0 ** a1);

    function Arith$N_to_NxN$(_n$1) {
        var _w$2 = ((Nat$sqrt$(((8n * _n$1) + 1n)) - 1n <= 0n ? 0n : Nat$sqrt$(((8n * _n$1) + 1n)) - 1n) / 2n);
        var _t$3 = (((_w$2 ** 2n) + _w$2) / 2n);
        var _y$4 = (_n$1 - _t$3 <= 0n ? 0n : _n$1 - _t$3);
        var $712 = Pair$new$((_w$2 - _y$4 <= 0n ? 0n : _w$2 - _y$4), _y$4);
        return $712;
    };
    const Arith$N_to_NxN = x0 => Arith$N_to_NxN$(x0);
    const Nat$eql = a0 => a1 => (a0 === a1);

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
                    var $713 = Nat$mod$go$(_n$1, _r$3, _m$2);
                    return $713;
                } else {
                    var $714 = (self - 1n);
                    var self = _n$1;
                    if (self === 0n) {
                        var $716 = _r$3;
                        var $715 = $716;
                    } else {
                        var $717 = (self - 1n);
                        var $718 = Nat$mod$go$($717, $714, Nat$succ$(_r$3));
                        var $715 = $718;
                    };
                    return $715;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Nat$mod$go = x0 => x1 => x2 => Nat$mod$go$(x0, x1, x2);
    const Nat$mod = a0 => a1 => (a0 % a1);
    const Nat$gtn = a0 => a1 => (a0 > a1);

    function Int$is_neg$(_a$1) {
        var self = _a$1;
        switch ("new") {
            case 'new':
                var $720 = int_pos(self);
                var $721 = int_neg(self);
                var $722 = ($721 > $720);
                var $719 = $722;
                break;
        };
        return $719;
    };
    const Int$is_neg = x0 => Int$is_neg$(x0);

    function Int$abs$(_a$1) {
        var _neg$2 = Int$is_neg$(_a$1);
        var self = _neg$2;
        if (self) {
            var _a$3 = Int$neg$(_a$1);
            var self = _a$3;
            switch ("new") {
                case 'new':
                    var $725 = int_pos(self);
                    var $726 = $725;
                    var $724 = $726;
                    break;
            };
            var $723 = $724;
        } else {
            var self = _a$1;
            switch ("new") {
                case 'new':
                    var $728 = int_pos(self);
                    var $729 = $728;
                    var $727 = $729;
                    break;
            };
            var $723 = $727;
        };
        return $723;
    };
    const Int$abs = x0 => Int$abs$(x0);

    function Int$to_nat_signed$(_a$1) {
        var $730 = Pair$new$(Int$is_neg$(_a$1), Int$abs$(_a$1));
        return $730;
    };
    const Int$to_nat_signed = x0 => Int$to_nat_signed$(x0);

    function Int$div_nat$(_a$1, _n$2) {
        var self = _a$1;
        switch ("new") {
            case 'new':
                var $732 = int_pos(self);
                var $733 = int_neg(self);
                var $734 = (($732 / _n$2) - ($733 / _n$2));
                var $731 = $734;
                break;
        };
        return $731;
    };
    const Int$div_nat = x0 => x1 => Int$div_nat$(x0, x1);
    const Int$div = a0 => a1 => (a0 / a1);

    function Arith$N_to_Z$(_n$1) {
        var self = ((_n$1 % 2n) === 0n);
        if (self) {
            var $736 = (Int$from_nat$(_n$1) / Int$neg$(Int$from_nat$(2n)));
            var $735 = $736;
        } else {
            var $737 = ((Int$from_nat$(_n$1) / Int$from_nat$(2n)) + Int$from_nat$(1n));
            var $735 = $737;
        };
        return $735;
    };
    const Arith$N_to_Z = x0 => Arith$N_to_Z$(x0);

    function Web$Kaelin$Coord$Convert$nat_to_axial$(_a$1) {
        var self = Arith$N_to_NxN$(_a$1);
        switch (self._) {
            case 'Pair.new':
                var $739 = self.fst;
                var $740 = self.snd;
                var $741 = Web$Kaelin$Coord$new$(Int$to_i32$(Arith$N_to_Z$($739)), Int$to_i32$(Arith$N_to_Z$($740)));
                var $738 = $741;
                break;
        };
        return $738;
    };
    const Web$Kaelin$Coord$Convert$nat_to_axial = x0 => Web$Kaelin$Coord$Convert$nat_to_axial$(x0);
    const Web$Kaelin$Constants$hexagon_radius = 15;
    const F64$div = a0 => a1 => (a0 / a1);
    const F64$parse = a0 => (parseFloat(a0));
    const Web$Kaelin$Constants$center_x = 128;
    const Web$Kaelin$Constants$center_y = 128;
    const F64$add = a0 => a1 => (a0 + a1);
    const F64$mul = a0 => a1 => (a0 * a1);

    function Web$Kaelin$Coord$to_screen_xy$(_coord$1) {
        var self = _coord$1;
        switch (self._) {
            case 'Web.Kaelin.Coord.new':
                var $743 = self.i;
                var $744 = self.j;
                var _i$4 = $743;
                var _j$5 = $744;
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
                var $745 = Pair$new$(_cx$15, _cy$17);
                var $742 = $745;
                break;
        };
        return $742;
    };
    const Web$Kaelin$Coord$to_screen_xy = x0 => Web$Kaelin$Coord$to_screen_xy$(x0);
    const U32$sub = a0 => a1 => ((a0 - a1) >>> 0);

    function Web$Kaelin$Draw$support$centralize$(_coord$1) {
        var self = Web$Kaelin$Coord$to_screen_xy$(_coord$1);
        switch (self._) {
            case 'Pair.new':
                var $747 = self.fst;
                var $748 = self.snd;
                var _i$4 = (($747 - Web$Kaelin$Constants$hexagon_radius) >>> 0);
                var _j$5 = (($748 - Web$Kaelin$Constants$hexagon_radius) >>> 0);
                var $749 = Pair$new$(_i$4, _j$5);
                var $746 = $749;
                break;
        };
        return $746;
    };
    const Web$Kaelin$Draw$support$centralize = x0 => Web$Kaelin$Draw$support$centralize$(x0);

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
                        var $750 = self.head;
                        var $751 = self.tail;
                        var self = _cond$2($750);
                        if (self) {
                            var $753 = Bool$true;
                            var $752 = $753;
                        } else {
                            var $754 = List$any$(_cond$2, $751);
                            var $752 = $754;
                        };
                        return $752;
                    case 'List.nil':
                        var $755 = Bool$false;
                        return $755;
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
                var $757 = self.i;
                var $758 = self.j;
                var self = _b$2;
                switch (self._) {
                    case 'Web.Kaelin.Coord.new':
                        var $760 = self.i;
                        var $761 = self.j;
                        var $762 = (($757 === $760) && ($758 === $761));
                        var $759 = $762;
                        break;
                };
                var $756 = $759;
                break;
        };
        return $756;
    };
    const Web$Kaelin$Coord$eql = x0 => x1 => Web$Kaelin$Coord$eql$(x0, x1);

    function Web$Kaelin$Draw$support$which_effect$(_coord$1, _cast_info$2, _range_list$3) {
        var self = _cast_info$2;
        switch (self._) {
            case 'Web.Kaelin.CastInfo.new':
                var $764 = self.hex_effect;
                var _is_in_range$8 = List$any$(Web$Kaelin$Coord$eql(_coord$1), _range_list$3);
                var self = _is_in_range$8;
                if (self) {
                    var $766 = $764;
                    var $765 = $766;
                } else {
                    var $767 = Web$Kaelin$HexEffect$normal;
                    var $765 = $767;
                };
                var $763 = $765;
                break;
        };
        return $763;
    };
    const Web$Kaelin$Draw$support$which_effect = x0 => x1 => x2 => Web$Kaelin$Draw$support$which_effect$(x0, x1, x2);
    const F64$sub = a0 => a1 => (a0 - a1);

    function Web$Kaelin$Coord$round$floor$(_n$1) {
        var $768 = (((_n$1 >> 0)));
        return $768;
    };
    const Web$Kaelin$Coord$round$floor = x0 => Web$Kaelin$Coord$round$floor$(x0);

    function Web$Kaelin$Coord$round$round_F64$(_n$1) {
        var _half$2 = (parseFloat("+0.5"));
        var _big_number$3 = (parseFloat("+1000.0"));
        var _n$4 = (_n$1 + _big_number$3);
        var _result$5 = Web$Kaelin$Coord$round$floor$((_n$4 + _half$2));
        var $769 = (_result$5 - _big_number$3);
        return $769;
    };
    const Web$Kaelin$Coord$round$round_F64 = x0 => Web$Kaelin$Coord$round$round_F64$(x0);

    function Word$gtn$(_a$2, _b$3) {
        var $770 = Cmp$as_gtn$(Word$cmp$(_a$2, _b$3));
        return $770;
    };
    const Word$gtn = x0 => x1 => Word$gtn$(x0, x1);

    function F64$gtn$(_a$1, _b$2) {
        var self = _a$1;
        switch ('f64') {
            case 'f64':
                var $772 = f64_to_word(self);
                var self = _b$2;
                switch ('f64') {
                    case 'f64':
                        var $774 = f64_to_word(self);
                        var $775 = Word$gtn$($772, $774);
                        var $773 = $775;
                        break;
                };
                var $771 = $773;
                break;
        };
        return $771;
    };
    const F64$gtn = x0 => x1 => F64$gtn$(x0, x1);

    function Web$Kaelin$Coord$round$diff$(_x$1, _y$2) {
        var _big_number$3 = (parseFloat("+1000.0"));
        var _x$4 = (_x$1 + _big_number$3);
        var _y$5 = (_y$2 + _big_number$3);
        var self = F64$gtn$(_x$4, _y$5);
        if (self) {
            var $777 = (_x$4 - _y$5);
            var $776 = $777;
        } else {
            var $778 = (_y$5 - _x$4);
            var $776 = $778;
        };
        return $776;
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
                var $781 = Pair$new$(_i$4(_round_x$6), _i$4(_new_y$12));
                var $780 = $781;
            } else {
                var _new_x$12 = ((_f$3(0) - _round_y$7) - _round_z$8);
                var $782 = Pair$new$(_i$4(_new_x$12), _i$4(_round_y$7));
                var $780 = $782;
            };
            var _result$12 = $780;
        } else {
            var self = F64$gtn$(_diff_y$10, _diff_z$11);
            if (self) {
                var _new_y$12 = ((_f$3(0) - _round_x$6) - _round_z$8);
                var $784 = Pair$new$(_i$4(_round_x$6), _i$4(_new_y$12));
                var $783 = $784;
            } else {
                var $785 = Pair$new$(_i$4(_round_x$6), _i$4(_round_y$7));
                var $783 = $785;
            };
            var _result$12 = $783;
        };
        var $779 = _result$12;
        return $779;
    };
    const Web$Kaelin$Coord$round = x0 => x1 => Web$Kaelin$Coord$round$(x0, x1);

    function Web$Kaelin$Coord$to_axial$(_coord$1) {
        var self = _coord$1;
        switch (self._) {
            case 'Pair.new':
                var $787 = self.fst;
                var $788 = self.snd;
                var _f$4 = U32$to_f64;
                var _i$5 = F64$to_i32;
                var _float_hex_rad$6 = (_f$4(Web$Kaelin$Constants$hexagon_radius) / (parseFloat("+2.0")));
                var _center_x$7 = Web$Kaelin$Constants$center_x;
                var _center_y$8 = Web$Kaelin$Constants$center_y;
                var _float_x$9 = ((_f$4($787) - _f$4(_center_x$7)) / _float_hex_rad$6);
                var _float_y$10 = ((_f$4($788) - _f$4(_center_y$8)) / _float_hex_rad$6);
                var _fourth$11 = (parseFloat("+0.25"));
                var _sixth$12 = ((parseFloat("+1.0")) / (parseFloat("+6.0")));
                var _third$13 = ((parseFloat("+1.0")) / (parseFloat("+3.0")));
                var _half$14 = (parseFloat("+0.5"));
                var _axial_x$15 = ((_float_x$9 * _fourth$11) - (_float_y$10 * _sixth$12));
                var _axial_y$16 = (_float_y$10 * _third$13);
                var self = Web$Kaelin$Coord$round$(_axial_x$15, _axial_y$16);
                switch (self._) {
                    case 'Pair.new':
                        var $790 = self.fst;
                        var $791 = self.snd;
                        var $792 = Web$Kaelin$Coord$new$($790, $791);
                        var $789 = $792;
                        break;
                };
                var $786 = $789;
                break;
        };
        return $786;
    };
    const Web$Kaelin$Coord$to_axial = x0 => Web$Kaelin$Coord$to_axial$(x0);

    function Web$Kaelin$Draw$support$mouse_on_coord$(_coord$1, _env_info$2) {
        var self = _env_info$2;
        switch (self._) {
            case 'App.EnvInfo.new':
                var $794 = self.mouse_pos;
                var _mouse_pos$5 = Web$Kaelin$Coord$to_axial$($794);
                var $795 = Web$Kaelin$Coord$eql$(_coord$1, _mouse_pos$5);
                var $793 = $795;
                break;
        };
        return $793;
    };
    const Web$Kaelin$Draw$support$mouse_on_coord = x0 => x1 => Web$Kaelin$Draw$support$mouse_on_coord$(x0, x1);

    function Web$Kaelin$Terrain$Sprite$new$(_effect$1, _mouse_over$2) {
        var $796 = ({
            _: 'Web.Kaelin.Terrain.Sprite.new',
            'effect': _effect$1,
            'mouse_over': _mouse_over$2
        });
        return $796;
    };
    const Web$Kaelin$Terrain$Sprite$new = x0 => x1 => Web$Kaelin$Terrain$Sprite$new$(x0, x1);

    function VoxBox$get_len$(_img$1) {
        var self = _img$1;
        switch (self._) {
            case 'VoxBox.new':
                var $798 = self.length;
                var $799 = $798;
                var $797 = $799;
                break;
        };
        return $797;
    };
    const VoxBox$get_len = x0 => VoxBox$get_len$(x0);

    function Array$get$(_idx$3, _arr$4) {
        var $800 = Word$foldl$(Array$extract_tip, (_rec$6 => _arr$7 => {
            var _arr_l$8 = Array$extract_tie$(_arr$7);
            var self = _arr_l$8;
            switch (self._) {
                case 'Pair.new':
                    var $802 = self.fst;
                    var $803 = _rec$6($802);
                    var $801 = $803;
                    break;
            };
            return $801;
        }), (_rec$6 => _arr$7 => {
            var _arr_r$8 = Array$extract_tie$(_arr$7);
            var self = _arr_r$8;
            switch (self._) {
                case 'Pair.new':
                    var $805 = self.snd;
                    var $806 = _rec$6($805);
                    var $804 = $806;
                    break;
            };
            return $804;
        }), _idx$3)(_arr$4);
        return $800;
    };
    const Array$get = x0 => x1 => Array$get$(x0, x1);
    const Buffer32$get = a0 => a1 => ((a1[a0]));
    const VoxBox$get_pos = a0 => a1 => ((a1.buffer[a0 * 2]));
    const VoxBox$get_col = a0 => a1 => ((a1.buffer[a0 * 2 + 1]));

    function Word$and$(_a$2, _b$3) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $808 = self.pred;
                var $809 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $811 = self.pred;
                            var $812 = (_a$pred$9 => {
                                var $813 = Word$o$(Word$and$(_a$pred$9, $811));
                                return $813;
                            });
                            var $810 = $812;
                            break;
                        case 'Word.i':
                            var $814 = self.pred;
                            var $815 = (_a$pred$9 => {
                                var $816 = Word$o$(Word$and$(_a$pred$9, $814));
                                return $816;
                            });
                            var $810 = $815;
                            break;
                        case 'Word.e':
                            var $817 = (_a$pred$7 => {
                                var $818 = Word$e;
                                return $818;
                            });
                            var $810 = $817;
                            break;
                    };
                    var $810 = $810($808);
                    return $810;
                });
                var $807 = $809;
                break;
            case 'Word.i':
                var $819 = self.pred;
                var $820 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $822 = self.pred;
                            var $823 = (_a$pred$9 => {
                                var $824 = Word$o$(Word$and$(_a$pred$9, $822));
                                return $824;
                            });
                            var $821 = $823;
                            break;
                        case 'Word.i':
                            var $825 = self.pred;
                            var $826 = (_a$pred$9 => {
                                var $827 = Word$i$(Word$and$(_a$pred$9, $825));
                                return $827;
                            });
                            var $821 = $826;
                            break;
                        case 'Word.e':
                            var $828 = (_a$pred$7 => {
                                var $829 = Word$e;
                                return $829;
                            });
                            var $821 = $828;
                            break;
                    };
                    var $821 = $821($819);
                    return $821;
                });
                var $807 = $820;
                break;
            case 'Word.e':
                var $830 = (_b$4 => {
                    var $831 = Word$e;
                    return $831;
                });
                var $807 = $830;
                break;
        };
        var $807 = $807(_b$3);
        return $807;
    };
    const Word$and = x0 => x1 => Word$and$(x0, x1);
    const U32$and = a0 => a1 => (a0 & a1);
    const U32$shr = a0 => a1 => (a0 >>> a1);

    function VoxBox$Draw$image$(_x$1, _y$2, _z$3, _src$4, _img$5) {
        var _len$6 = VoxBox$get_len$(_src$4);
        var _img$7 = (() => {
            var $833 = _img$5;
            var $834 = 0;
            var $835 = _len$6;
            let _img$8 = $833;
            for (let _i$7 = $834; _i$7 < $835; ++_i$7) {
                var _pos$9 = ((_src$4.buffer[_i$7 * 2]));
                var _col$10 = ((_src$4.buffer[_i$7 * 2 + 1]));
                var _p_x$11 = (_pos$9 & 4095);
                var _p_y$12 = ((_pos$9 & 16773120) >>> 12);
                var _p_z$13 = ((_pos$9 & 4278190080) >>> 24);
                var _p_x$14 = ((_p_x$11 + _x$1) >>> 0);
                var _p_y$15 = ((_p_y$12 + _y$2) >>> 0);
                var _p_z$16 = ((_p_z$13 + _z$3) >>> 0);
                var _pos$17 = ((0 | _p_x$14 | (_p_y$15 << 12) | (_p_z$16 << 24)));
                var $833 = ((_img$8.buffer[_img$8.length * 2] = _pos$17, _img$8.buffer[_img$8.length * 2 + 1] = _col$10, _img$8.length++, _img$8));
                _img$8 = $833;
            };
            return _img$8;
        })();
        var $832 = _img$7;
        return $832;
    };
    const VoxBox$Draw$image = x0 => x1 => x2 => x3 => x4 => VoxBox$Draw$image$(x0, x1, x2, x3, x4);

    function Web$Kaelin$Draw$state$background$(_map$1, _cast_info$2, _env_info$3, _img$4) {
        var self = _cast_info$2;
        switch (self._) {
            case 'Web.Kaelin.CastInfo.new':
                var $837 = self.hero_pos;
                var $838 = self.range;
                var _list$9 = NatMap$to_list$(_map$1);
                var _range$10 = Web$Kaelin$Coord$range$($837, $838);
                var _img$11 = (() => {
                    var $841 = _img$4;
                    var $842 = _list$9;
                    let _img$12 = $841;
                    let _pair$11;
                    while ($842._ === 'List.cons') {
                        _pair$11 = $842.head;
                        var self = _pair$11;
                        switch (self._) {
                            case 'Pair.new':
                                var $843 = self.fst;
                                var _coord$15 = Web$Kaelin$Coord$Convert$nat_to_axial$($843);
                                var self = Web$Kaelin$Draw$support$centralize$(_coord$15);
                                switch (self._) {
                                    case 'Pair.new':
                                        var $845 = self.fst;
                                        var $846 = self.snd;
                                        var _hex_effect$18 = Web$Kaelin$Draw$support$which_effect$(_coord$15, _cast_info$2, _range$10);
                                        var _mouse_over$19 = Web$Kaelin$Draw$support$mouse_on_coord$(_coord$15, _env_info$3);
                                        var _sprite$20 = Web$Kaelin$Terrain$Sprite$new$(_hex_effect$18, _mouse_over$19);
                                        var _tile$21 = Maybe$default$(Web$Kaelin$Map$get$(_coord$15, _map$1), List$nil);
                                        var _img$22 = (() => {
                                            var $849 = _img$12;
                                            var $850 = _tile$21;
                                            let _img$23 = $849;
                                            let _entity$22;
                                            while ($850._ === 'List.cons') {
                                                _entity$22 = $850.head;
                                                var self = _entity$22;
                                                switch (self._) {
                                                    case 'Web.Kaelin.Entity.background':
                                                        var $851 = self.terrain;
                                                        var self = $851;
                                                        switch (self._) {
                                                            case 'Web.Kaelin.Terrain.grass':
                                                                var $853 = self.draw;
                                                                var $854 = VoxBox$Draw$image$($845, $846, 0, $853(_sprite$20), _img$23);
                                                                var $852 = $854;
                                                                break;
                                                        };
                                                        var $849 = $852;
                                                        break;
                                                    case 'Web.Kaelin.Entity.creature':
                                                        var $855 = _img$23;
                                                        var $849 = $855;
                                                        break;
                                                };
                                                _img$23 = $849;
                                                $850 = $850.tail;
                                            }
                                            return _img$23;
                                        })();
                                        var $847 = _img$22;
                                        var $844 = $847;
                                        break;
                                };
                                var $841 = $844;
                                break;
                        };
                        _img$12 = $841;
                        $842 = $842.tail;
                    }
                    return _img$12;
                })();
                var $839 = _img$11;
                var $836 = $839;
                break;
        };
        return $836;
    };
    const Web$Kaelin$Draw$state$background = x0 => x1 => x2 => x3 => Web$Kaelin$Draw$state$background$(x0, x1, x2, x3);

    function Web$Kaelin$Draw$hero$(_cx$1, _cy$2, _z$3, _hero$4, _img$5) {
        var self = _hero$4;
        switch (self._) {
            case 'Web.Kaelin.Hero.new':
                var $857 = self.img;
                var _aux_y$8 = ((Web$Kaelin$Constants$hexagon_radius * 2) >>> 0);
                var _cy$9 = ((_cy$2 - _aux_y$8) >>> 0);
                var _cx$10 = ((_cx$1 - Web$Kaelin$Constants$hexagon_radius) >>> 0);
                var $858 = VoxBox$Draw$image$(_cx$10, _cy$9, 0, $857, _img$5);
                var $856 = $858;
                break;
        };
        return $856;
    };
    const Web$Kaelin$Draw$hero = x0 => x1 => x2 => x3 => x4 => Web$Kaelin$Draw$hero$(x0, x1, x2, x3, x4);

    function Web$Kaelin$Draw$state$players$(_map$1, _img$2) {
        var _player_list$3 = NatMap$to_list$(_map$1);
        var _img$4 = (() => {
            var $861 = _img$2;
            var $862 = _player_list$3;
            let _img$5 = $861;
            let _prs$4;
            while ($862._ === 'List.cons') {
                _prs$4 = $862.head;
                var self = _prs$4;
                switch (self._) {
                    case 'Pair.new':
                        var $863 = self.fst;
                        var $864 = self.snd;
                        var _coord$8 = Web$Kaelin$Coord$Convert$nat_to_axial$($863);
                        var self = Web$Kaelin$Coord$to_screen_xy$(_coord$8);
                        switch (self._) {
                            case 'Pair.new':
                                var $866 = self.fst;
                                var $867 = self.snd;
                                var _img$11 = (() => {
                                    var $870 = _img$5;
                                    var $871 = $864;
                                    let _img$12 = $870;
                                    let _entity$11;
                                    while ($871._ === 'List.cons') {
                                        _entity$11 = $871.head;
                                        var self = _entity$11;
                                        switch (self._) {
                                            case 'Web.Kaelin.Entity.creature':
                                                var $872 = self.hero;
                                                var $873 = Web$Kaelin$Draw$hero$($866, $867, 0, $872, _img$12);
                                                var $870 = $873;
                                                break;
                                            case 'Web.Kaelin.Entity.background':
                                                var $874 = _img$12;
                                                var $870 = $874;
                                                break;
                                        };
                                        _img$12 = $870;
                                        $871 = $871.tail;
                                    }
                                    return _img$12;
                                })();
                                var $868 = _img$11;
                                var $865 = $868;
                                break;
                        };
                        var $861 = $865;
                        break;
                };
                _img$5 = $861;
                $862 = $862.tail;
            }
            return _img$5;
        })();
        var $859 = _img$4;
        return $859;
    };
    const Web$Kaelin$Draw$state$players = x0 => x1 => Web$Kaelin$Draw$state$players$(x0, x1);

    function Web$Kaelin$Draw$state$(_img$1, _state$2) {
        var self = _state$2;
        switch (self._) {
            case 'Web.Kaelin.State.game':
                var $876 = self.cast_info;
                var $877 = self.map;
                var $878 = self.interface;
                var _img$9 = Web$Kaelin$Draw$state$background$($877, $876, $878, _img$1);
                var _img$10 = Web$Kaelin$Draw$state$players$($877, _img$9);
                var $879 = _img$10;
                var $875 = $879;
                break;
            case 'Web.Kaelin.State.init':
            case 'Web.Kaelin.State.void':
                var $880 = _img$1;
                var $875 = $880;
                break;
        };
        return $875;
    };
    const Web$Kaelin$Draw$state = x0 => x1 => Web$Kaelin$Draw$state$(x0, x1);

    function Web$Kaelin$App$draw$(_img$1, _state$2) {
        var self = _state$2;
        switch (self._) {
            case 'Web.Kaelin.State.init':
            case 'Web.Kaelin.State.void':
                var $882 = DOM$text$("TODO: create the renderer for this game state mode");
                var $881 = $882;
                break;
            case 'Web.Kaelin.State.game':
                var $883 = DOM$vbox$(Map$from_list$(List$nil), Map$from_list$(List$nil), Web$Kaelin$Draw$state$(_img$1, _state$2));
                var $881 = $883;
                break;
        };
        return $881;
    };
    const Web$Kaelin$App$draw = x0 => x1 => Web$Kaelin$App$draw$(x0, x1);
    const U8$to_nat = a0 => (BigInt(a0));

    function List$zip$(_as$3, _bs$4) {
        var self = _as$3;
        switch (self._) {
            case 'List.cons':
                var $885 = self.head;
                var $886 = self.tail;
                var self = _bs$4;
                switch (self._) {
                    case 'List.cons':
                        var $888 = self.head;
                        var $889 = self.tail;
                        var $890 = List$cons$(Pair$new$($885, $888), List$zip$($886, $889));
                        var $887 = $890;
                        break;
                    case 'List.nil':
                        var $891 = List$nil;
                        var $887 = $891;
                        break;
                };
                var $884 = $887;
                break;
            case 'List.nil':
                var $892 = List$nil;
                var $884 = $892;
                break;
        };
        return $884;
    };
    const List$zip = x0 => x1 => List$zip$(x0, x1);
    const Web$Kaelin$Event$Code$action = List$cons$(2, List$nil);

    function String$cons$(_head$1, _tail$2) {
        var $893 = (String.fromCharCode(_head$1) + _tail$2);
        return $893;
    };
    const String$cons = x0 => x1 => String$cons$(x0, x1);
    const String$concat = a0 => a1 => (a0 + a1);

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
                    var $894 = _n$2;
                    return $894;
                } else {
                    var $895 = self.charCodeAt(0);
                    var $896 = self.slice(1);
                    var $897 = String$length$go$($896, Nat$succ$(_n$2));
                    return $897;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const String$length$go = x0 => x1 => String$length$go$(x0, x1);

    function String$length$(_xs$1) {
        var $898 = String$length$go$(_xs$1, 0n);
        return $898;
    };
    const String$length = x0 => String$length$(x0);
    const String$nil = '';

    function String$repeat$(_xs$1, _n$2) {
        var self = _n$2;
        if (self === 0n) {
            var $900 = String$nil;
            var $899 = $900;
        } else {
            var $901 = (self - 1n);
            var $902 = (_xs$1 + String$repeat$(_xs$1, $901));
            var $899 = $902;
        };
        return $899;
    };
    const String$repeat = x0 => x1 => String$repeat$(x0, x1);

    function Hex$set_min_length$(_min$1, _hex$2) {
        var _dif$3 = (_min$1 - String$length$(_hex$2) <= 0n ? 0n : _min$1 - String$length$(_hex$2));
        var $903 = (_hex$2 + String$repeat$("0", _dif$3));
        return $903;
    };
    const Hex$set_min_length = x0 => x1 => Hex$set_min_length$(x0, x1);

    function List$fold$(_list$2, _nil$4, _cons$5) {
        var self = _list$2;
        switch (self._) {
            case 'List.cons':
                var $905 = self.head;
                var $906 = self.tail;
                var $907 = _cons$5($905)(List$fold$($906, _nil$4, _cons$5));
                var $904 = $907;
                break;
            case 'List.nil':
                var $908 = _nil$4;
                var $904 = $908;
                break;
        };
        return $904;
    };
    const List$fold = x0 => x1 => x2 => List$fold$(x0, x1, x2);

    function List$foldr$(_b$3, _f$4, _xs$5) {
        var $909 = List$fold$(_xs$5, _b$3, _f$4);
        return $909;
    };
    const List$foldr = x0 => x1 => x2 => List$foldr$(x0, x1, x2);

    function Hex$format_hex$(_min$1, _hex$2) {
        var _dif$3 = (_min$1 - String$length$(_hex$2) <= 0n ? 0n : _min$1 - String$length$(_hex$2));
        var self = (String$length$(_hex$2) < _min$1);
        if (self) {
            var $911 = (String$repeat$("0", _dif$3) + _hex$2);
            var $910 = $911;
        } else {
            var $912 = _hex$2;
            var $910 = $912;
        };
        return $910;
    };
    const Hex$format_hex = x0 => x1 => Hex$format_hex$(x0, x1);

    function Bits$gtn$(_a$1, _b$2) {
        var $913 = Cmp$as_gtn$(Bits$cmp$(_a$1, _b$2));
        return $913;
    };
    const Bits$gtn = x0 => x1 => Bits$gtn$(x0, x1);

    function U32$to_bits$(_a$1) {
        var self = _a$1;
        switch ('u32') {
            case 'u32':
                var $915 = u32_to_word(self);
                var $916 = Word$to_bits$($915);
                var $914 = $916;
                break;
        };
        return $914;
    };
    const U32$to_bits = x0 => U32$to_bits$(x0);

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
                        var $917 = self.slice(0, -1);
                        var $918 = Bits$mul$go$((_a$1 + '0'), $917, _bits$3);
                        return $918;
                    case 'i':
                        var $919 = self.slice(0, -1);
                        var $920 = Bits$mul$go$((_a$1 + '0'), $919, Bits$add$(_a$1, _bits$3));
                        return $920;
                    case 'e':
                        var $921 = _bits$3;
                        return $921;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Bits$mul$go = x0 => x1 => x2 => Bits$mul$go$(x0, x1, x2);

    function Bits$mul$(_a$1, _b$2) {
        var $922 = Bits$mul$go$(_a$1, _b$2, Bits$e);
        return $922;
    };
    const Bits$mul = x0 => x1 => Bits$mul$(x0, x1);

    function Bits$mod$(_a$1, _b$2) {
        var _q$3 = Bits$div$(_a$1, _b$2);
        var $923 = Bits$sub$(_a$1, Bits$mul$(_b$2, _q$3));
        return $923;
    };
    const Bits$mod = x0 => x1 => Bits$mod$(x0, x1);

    function Nat$square$(_a$1) {
        var $924 = (_a$1 * _a$1);
        return $924;
    };
    const Nat$square = x0 => Nat$square$(x0);

    function Bits$break$(_shift$1, _a$2) {
        var self = Bits$gtn$(_a$2, U32$to_bits$(0));
        if (self) {
            var $926 = List$cons$(Bits$mod$(_a$2, (nat_to_bits(Nat$square$(_shift$1)))), Bits$break$(_shift$1, Bits$shift_right$(_shift$1, _a$2)));
            var $925 = $926;
        } else {
            var $927 = List$nil;
            var $925 = $927;
        };
        return $925;
    };
    const Bits$break = x0 => x1 => Bits$break$(x0, x1);

    function Function$flip$(_f$4, _y$5, _x$6) {
        var $928 = _f$4(_x$6)(_y$5);
        return $928;
    };
    const Function$flip = x0 => x1 => x2 => Function$flip$(x0, x1, x2);

    function Hex$to_hex_string$(_x$1) {
        var self = (Bits$to_nat$(_x$1) === 0n);
        if (self) {
            var $930 = "0";
            var $929 = $930;
        } else {
            var self = (Bits$to_nat$(_x$1) === 1n);
            if (self) {
                var $932 = "1";
                var $931 = $932;
            } else {
                var self = (Bits$to_nat$(_x$1) === 2n);
                if (self) {
                    var $934 = "2";
                    var $933 = $934;
                } else {
                    var self = (Bits$to_nat$(_x$1) === 3n);
                    if (self) {
                        var $936 = "3";
                        var $935 = $936;
                    } else {
                        var self = (Bits$to_nat$(_x$1) === 4n);
                        if (self) {
                            var $938 = "4";
                            var $937 = $938;
                        } else {
                            var self = (Bits$to_nat$(_x$1) === 5n);
                            if (self) {
                                var $940 = "5";
                                var $939 = $940;
                            } else {
                                var self = (Bits$to_nat$(_x$1) === 6n);
                                if (self) {
                                    var $942 = "6";
                                    var $941 = $942;
                                } else {
                                    var self = (Bits$to_nat$(_x$1) === 7n);
                                    if (self) {
                                        var $944 = "7";
                                        var $943 = $944;
                                    } else {
                                        var self = (Bits$to_nat$(_x$1) === 8n);
                                        if (self) {
                                            var $946 = "8";
                                            var $945 = $946;
                                        } else {
                                            var self = (Bits$to_nat$(_x$1) === 9n);
                                            if (self) {
                                                var $948 = "9";
                                                var $947 = $948;
                                            } else {
                                                var self = (Bits$to_nat$(_x$1) === 10n);
                                                if (self) {
                                                    var $950 = "A";
                                                    var $949 = $950;
                                                } else {
                                                    var self = (Bits$to_nat$(_x$1) === 11n);
                                                    if (self) {
                                                        var $952 = "B";
                                                        var $951 = $952;
                                                    } else {
                                                        var self = (Bits$to_nat$(_x$1) === 12n);
                                                        if (self) {
                                                            var $954 = "C";
                                                            var $953 = $954;
                                                        } else {
                                                            var self = (Bits$to_nat$(_x$1) === 13n);
                                                            if (self) {
                                                                var $956 = "D";
                                                                var $955 = $956;
                                                            } else {
                                                                var self = (Bits$to_nat$(_x$1) === 14n);
                                                                if (self) {
                                                                    var $958 = "E";
                                                                    var $957 = $958;
                                                                } else {
                                                                    var self = (Bits$to_nat$(_x$1) === 15n);
                                                                    if (self) {
                                                                        var $960 = "F";
                                                                        var $959 = $960;
                                                                    } else {
                                                                        var $961 = "?";
                                                                        var $959 = $961;
                                                                    };
                                                                    var $957 = $959;
                                                                };
                                                                var $955 = $957;
                                                            };
                                                            var $953 = $955;
                                                        };
                                                        var $951 = $953;
                                                    };
                                                    var $949 = $951;
                                                };
                                                var $947 = $949;
                                            };
                                            var $945 = $947;
                                        };
                                        var $943 = $945;
                                    };
                                    var $941 = $943;
                                };
                                var $939 = $941;
                            };
                            var $937 = $939;
                        };
                        var $935 = $937;
                    };
                    var $933 = $935;
                };
                var $931 = $933;
            };
            var $929 = $931;
        };
        return $929;
    };
    const Hex$to_hex_string = x0 => Hex$to_hex_string$(x0);

    function Bits$to_hex_string$(_x$1) {
        var _ls$2 = Bits$break$(4n, _x$1);
        var $962 = List$foldr$("", (_x$3 => {
            var $963 = Function$flip(String$concat)(Hex$to_hex_string$(_x$3));
            return $963;
        }), _ls$2);
        return $962;
    };
    const Bits$to_hex_string = x0 => Bits$to_hex_string$(x0);

    function Hex$append$(_hex$1, _size$2, _x$3) {
        var _hex2$4 = Hex$format_hex$(_size$2, Bits$to_hex_string$(_x$3));
        var $964 = (_hex$1 + _hex2$4);
        return $964;
    };
    const Hex$append = x0 => x1 => x2 => Hex$append$(x0, x1, x2);

    function Pair$snd$(_pair$3) {
        var self = _pair$3;
        switch (self._) {
            case 'Pair.new':
                var $966 = self.snd;
                var $967 = $966;
                var $965 = $967;
                break;
        };
        return $965;
    };
    const Pair$snd = x0 => Pair$snd$(x0);

    function Web$Kaelin$Event$Code$generate_hex$(_xs$1) {
        var $968 = List$foldr$("", (_x$2 => _y$3 => {
            var $969 = Hex$append$(_y$3, (BigInt(Pair$fst$(_x$2))), Pair$snd$(_x$2));
            return $969;
        }), List$reverse$(_xs$1));
        return $968;
    };
    const Web$Kaelin$Event$Code$generate_hex = x0 => Web$Kaelin$Event$Code$generate_hex$(x0);

    function generate_hex$(_xs$1, _ys$2) {
        var _consumer$3 = List$zip$(List$concat$(Web$Kaelin$Event$Code$action, _xs$1), _ys$2);
        var $970 = ("0x" + Hex$set_min_length$(64n, Web$Kaelin$Event$Code$generate_hex$(_consumer$3)));
        return $970;
    };
    const generate_hex = x0 => x1 => generate_hex$(x0, x1);
    const Web$Kaelin$Event$Code$create_hero = List$cons$(2, List$nil);

    function Web$Kaelin$Resources$Action$to_bits$(_x$1) {
        var self = _x$1;
        switch (self._) {
            case 'Web.Kaelin.Action.walk':
                var $972 = 0n;
                var _n$2 = $972;
                break;
            case 'Web.Kaelin.Action.ability_0':
                var $973 = 1n;
                var _n$2 = $973;
                break;
            case 'Web.Kaelin.Action.ability_1':
                var $974 = 2n;
                var _n$2 = $974;
                break;
        };
        var $971 = (nat_to_bits(_n$2));
        return $971;
    };
    const Web$Kaelin$Resources$Action$to_bits = x0 => Web$Kaelin$Resources$Action$to_bits$(x0);

    function Web$Kaelin$Coord$Convert$axial_to_bits$(_x$1) {
        var _unique_nat$2 = Web$Kaelin$Coord$Convert$axial_to_nat$(_x$1);
        var $975 = (nat_to_bits(_unique_nat$2));
        return $975;
    };
    const Web$Kaelin$Coord$Convert$axial_to_bits = x0 => Web$Kaelin$Coord$Convert$axial_to_bits$(x0);
    const Web$Kaelin$Event$Code$user_input = List$cons$(2, List$cons$(8, List$nil));

    function Web$Kaelin$Event$serialize$(_event$1) {
        var self = _event$1;
        switch (self._) {
            case 'Web.Kaelin.Event.create_hero':
                var $977 = self.hero_id;
                var _cod$3 = List$cons$((nat_to_bits(1n)), List$cons$((nat_to_bits((BigInt($977)))), List$nil));
                var $978 = generate_hex$(Web$Kaelin$Event$Code$create_hero, _cod$3);
                var $976 = $978;
                break;
            case 'Web.Kaelin.Event.user_input':
                var $979 = self.coord;
                var $980 = self.action;
                var _cod$4 = List$cons$((nat_to_bits(4n)), List$cons$(Web$Kaelin$Resources$Action$to_bits$($980), List$cons$(Web$Kaelin$Coord$Convert$axial_to_bits$($979), List$nil)));
                var $981 = generate_hex$(Web$Kaelin$Event$Code$user_input, _cod$4);
                var $976 = $981;
                break;
            case 'Web.Kaelin.Event.start_game':
            case 'Web.Kaelin.Event.create_user':
                var $982 = "";
                var $976 = $982;
                break;
        };
        return $976;
    };
    const Web$Kaelin$Event$serialize = x0 => Web$Kaelin$Event$serialize$(x0);

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
                    var $983 = _xs$2;
                    return $983;
                } else {
                    var $984 = (self - 1n);
                    var self = _xs$2;
                    if (self.length === 0) {
                        var $986 = String$nil;
                        var $985 = $986;
                    } else {
                        var $987 = self.charCodeAt(0);
                        var $988 = self.slice(1);
                        var $989 = String$drop$($984, $988);
                        var $985 = $989;
                    };
                    return $985;
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
                var $991 = self.fst;
                var $992 = self.snd;
                var self = $992;
                switch (self._) {
                    case 'List.cons':
                        var $994 = self.head;
                        var $995 = self.tail;
                        var $996 = Pair$new$(String$drop$((BigInt($994)), $991), $995);
                        var $993 = $996;
                        break;
                    case 'List.nil':
                        var $997 = _buffer$1;
                        var $993 = $997;
                        break;
                };
                var $990 = $993;
                break;
        };
        return $990;
    };
    const Web$Kaelin$Event$Buffer$next = x0 => Web$Kaelin$Event$Buffer$next$(x0);

    function Parser$run$(_parser$2, _code$3) {
        var self = _parser$2(0n)(_code$3);
        switch (self._) {
            case 'Parser.Reply.value':
                var $999 = self.val;
                var $1000 = Maybe$some$($999);
                var $998 = $1000;
                break;
            case 'Parser.Reply.error':
                var $1001 = Maybe$none;
                var $998 = $1001;
                break;
        };
        return $998;
    };
    const Parser$run = x0 => x1 => Parser$run$(x0, x1);

    function Parser$Reply$(_V$1) {
        var $1002 = null;
        return $1002;
    };
    const Parser$Reply = x0 => Parser$Reply$(x0);

    function Parser$Reply$error$(_idx$2, _code$3, _err$4) {
        var $1003 = ({
            _: 'Parser.Reply.error',
            'idx': _idx$2,
            'code': _code$3,
            'err': _err$4
        });
        return $1003;
    };
    const Parser$Reply$error = x0 => x1 => x2 => Parser$Reply$error$(x0, x1, x2);

    function Parser$Reply$value$(_idx$2, _code$3, _val$4) {
        var $1004 = ({
            _: 'Parser.Reply.value',
            'idx': _idx$2,
            'code': _code$3,
            'val': _val$4
        });
        return $1004;
    };
    const Parser$Reply$value = x0 => x1 => x2 => Parser$Reply$value$(x0, x1, x2);

    function Parser$many$go$(_parse$2, _values$3, _idx$4, _code$5) {
        var Parser$many$go$ = (_parse$2, _values$3, _idx$4, _code$5) => ({
            ctr: 'TCO',
            arg: [_parse$2, _values$3, _idx$4, _code$5]
        });
        var Parser$many$go = _parse$2 => _values$3 => _idx$4 => _code$5 => Parser$many$go$(_parse$2, _values$3, _idx$4, _code$5);
        var arg = [_parse$2, _values$3, _idx$4, _code$5];
        while (true) {
            let [_parse$2, _values$3, _idx$4, _code$5] = arg;
            var R = (() => {
                var self = _parse$2(_idx$4)(_code$5);
                switch (self._) {
                    case 'Parser.Reply.value':
                        var $1005 = self.idx;
                        var $1006 = self.code;
                        var $1007 = self.val;
                        var $1008 = Parser$many$go$(_parse$2, (_xs$9 => {
                            var $1009 = _values$3(List$cons$($1007, _xs$9));
                            return $1009;
                        }), $1005, $1006);
                        return $1008;
                    case 'Parser.Reply.error':
                        var $1010 = Parser$Reply$value$(_idx$4, _code$5, _values$3(List$nil));
                        return $1010;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Parser$many$go = x0 => x1 => x2 => x3 => Parser$many$go$(x0, x1, x2, x3);

    function Parser$many$(_parser$2) {
        var $1011 = Parser$many$go(_parser$2)((_x$3 => {
            var $1012 = _x$3;
            return $1012;
        }));
        return $1011;
    };
    const Parser$many = x0 => Parser$many$(x0);

    function Parser$many1$(_parser$2, _idx$3, _code$4) {
        var self = _parser$2(_idx$3)(_code$4);
        switch (self._) {
            case 'Parser.Reply.error':
                var $1014 = self.idx;
                var $1015 = self.code;
                var $1016 = self.err;
                var $1017 = Parser$Reply$error$($1014, $1015, $1016);
                var $1013 = $1017;
                break;
            case 'Parser.Reply.value':
                var $1018 = self.idx;
                var $1019 = self.code;
                var $1020 = self.val;
                var self = Parser$many$(_parser$2)($1018)($1019);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $1022 = self.idx;
                        var $1023 = self.code;
                        var $1024 = self.err;
                        var $1025 = Parser$Reply$error$($1022, $1023, $1024);
                        var $1021 = $1025;
                        break;
                    case 'Parser.Reply.value':
                        var $1026 = self.idx;
                        var $1027 = self.code;
                        var $1028 = self.val;
                        var $1029 = Parser$Reply$value$($1026, $1027, List$cons$($1020, $1028));
                        var $1021 = $1029;
                        break;
                };
                var $1013 = $1021;
                break;
        };
        return $1013;
    };
    const Parser$many1 = x0 => x1 => x2 => Parser$many1$(x0, x1, x2);

    function Parser$one$(_idx$1, _code$2) {
        var self = _code$2;
        if (self.length === 0) {
            var $1031 = Parser$Reply$error$(_idx$1, _code$2, "Unexpected end of file.");
            var $1030 = $1031;
        } else {
            var $1032 = self.charCodeAt(0);
            var $1033 = self.slice(1);
            var $1034 = Parser$Reply$value$(Nat$succ$(_idx$1), $1033, $1032);
            var $1030 = $1034;
        };
        return $1030;
    };
    const Parser$one = x0 => x1 => Parser$one$(x0, x1);
    const U16$eql = a0 => a1 => (a0 === a1);

    function Char$eql$(_a$1, _b$2) {
        var $1035 = (_a$1 === _b$2);
        return $1035;
    };
    const Char$eql = x0 => x1 => Char$eql$(x0, x1);

    function Hex$char_hex_to_nat$(_x$1) {
        var self = Char$eql$(_x$1, 48);
        if (self) {
            var $1037 = Maybe$some$(0n);
            var $1036 = $1037;
        } else {
            var self = Char$eql$(_x$1, 49);
            if (self) {
                var $1039 = Maybe$some$(1n);
                var $1038 = $1039;
            } else {
                var self = Char$eql$(_x$1, 50);
                if (self) {
                    var $1041 = Maybe$some$(2n);
                    var $1040 = $1041;
                } else {
                    var self = Char$eql$(_x$1, 51);
                    if (self) {
                        var $1043 = Maybe$some$(3n);
                        var $1042 = $1043;
                    } else {
                        var self = Char$eql$(_x$1, 52);
                        if (self) {
                            var $1045 = Maybe$some$(4n);
                            var $1044 = $1045;
                        } else {
                            var self = Char$eql$(_x$1, 53);
                            if (self) {
                                var $1047 = Maybe$some$(5n);
                                var $1046 = $1047;
                            } else {
                                var self = Char$eql$(_x$1, 54);
                                if (self) {
                                    var $1049 = Maybe$some$(6n);
                                    var $1048 = $1049;
                                } else {
                                    var self = Char$eql$(_x$1, 55);
                                    if (self) {
                                        var $1051 = Maybe$some$(7n);
                                        var $1050 = $1051;
                                    } else {
                                        var self = Char$eql$(_x$1, 56);
                                        if (self) {
                                            var $1053 = Maybe$some$(8n);
                                            var $1052 = $1053;
                                        } else {
                                            var self = Char$eql$(_x$1, 57);
                                            if (self) {
                                                var $1055 = Maybe$some$(9n);
                                                var $1054 = $1055;
                                            } else {
                                                var self = Char$eql$(_x$1, 65);
                                                if (self) {
                                                    var $1057 = Maybe$some$(10n);
                                                    var $1056 = $1057;
                                                } else {
                                                    var self = Char$eql$(_x$1, 97);
                                                    if (self) {
                                                        var $1059 = Maybe$some$(10n);
                                                        var $1058 = $1059;
                                                    } else {
                                                        var self = Char$eql$(_x$1, 66);
                                                        if (self) {
                                                            var $1061 = Maybe$some$(11n);
                                                            var $1060 = $1061;
                                                        } else {
                                                            var self = Char$eql$(_x$1, 98);
                                                            if (self) {
                                                                var $1063 = Maybe$some$(11n);
                                                                var $1062 = $1063;
                                                            } else {
                                                                var self = Char$eql$(_x$1, 67);
                                                                if (self) {
                                                                    var $1065 = Maybe$some$(12n);
                                                                    var $1064 = $1065;
                                                                } else {
                                                                    var self = Char$eql$(_x$1, 99);
                                                                    if (self) {
                                                                        var $1067 = Maybe$some$(12n);
                                                                        var $1066 = $1067;
                                                                    } else {
                                                                        var self = Char$eql$(_x$1, 68);
                                                                        if (self) {
                                                                            var $1069 = Maybe$some$(13n);
                                                                            var $1068 = $1069;
                                                                        } else {
                                                                            var self = Char$eql$(_x$1, 100);
                                                                            if (self) {
                                                                                var $1071 = Maybe$some$(13n);
                                                                                var $1070 = $1071;
                                                                            } else {
                                                                                var self = Char$eql$(_x$1, 69);
                                                                                if (self) {
                                                                                    var $1073 = Maybe$some$(14n);
                                                                                    var $1072 = $1073;
                                                                                } else {
                                                                                    var self = Char$eql$(_x$1, 101);
                                                                                    if (self) {
                                                                                        var $1075 = Maybe$some$(14n);
                                                                                        var $1074 = $1075;
                                                                                    } else {
                                                                                        var self = Char$eql$(_x$1, 70);
                                                                                        if (self) {
                                                                                            var $1077 = Maybe$some$(15n);
                                                                                            var $1076 = $1077;
                                                                                        } else {
                                                                                            var self = Char$eql$(_x$1, 102);
                                                                                            if (self) {
                                                                                                var $1079 = Maybe$some$(15n);
                                                                                                var $1078 = $1079;
                                                                                            } else {
                                                                                                var $1080 = Maybe$none;
                                                                                                var $1078 = $1080;
                                                                                            };
                                                                                            var $1076 = $1078;
                                                                                        };
                                                                                        var $1074 = $1076;
                                                                                    };
                                                                                    var $1072 = $1074;
                                                                                };
                                                                                var $1070 = $1072;
                                                                            };
                                                                            var $1068 = $1070;
                                                                        };
                                                                        var $1066 = $1068;
                                                                    };
                                                                    var $1064 = $1066;
                                                                };
                                                                var $1062 = $1064;
                                                            };
                                                            var $1060 = $1062;
                                                        };
                                                        var $1058 = $1060;
                                                    };
                                                    var $1056 = $1058;
                                                };
                                                var $1054 = $1056;
                                            };
                                            var $1052 = $1054;
                                        };
                                        var $1050 = $1052;
                                    };
                                    var $1048 = $1050;
                                };
                                var $1046 = $1048;
                            };
                            var $1044 = $1046;
                        };
                        var $1042 = $1044;
                    };
                    var $1040 = $1042;
                };
                var $1038 = $1040;
            };
            var $1036 = $1038;
        };
        return $1036;
    };
    const Hex$char_hex_to_nat = x0 => Hex$char_hex_to_nat$(x0);

    function Parser$(_V$1) {
        var $1081 = null;
        return $1081;
    };
    const Parser = x0 => Parser$(x0);

    function Parser$fail$(_error$2, _idx$3, _code$4) {
        var $1082 = Parser$Reply$error$(_idx$3, _code$4, _error$2);
        return $1082;
    };
    const Parser$fail = x0 => x1 => x2 => Parser$fail$(x0, x1, x2);
    const Hex$parser$char_hex = (() => {
        var _c$1 = Parser$one;
        var $1083 = (_idx$2 => _code$3 => {
            var self = _c$1(_idx$2)(_code$3);
            switch (self._) {
                case 'Parser.Reply.error':
                    var $1085 = self.idx;
                    var $1086 = self.code;
                    var $1087 = self.err;
                    var $1088 = Parser$Reply$error$($1085, $1086, $1087);
                    var $1084 = $1088;
                    break;
                case 'Parser.Reply.value':
                    var $1089 = self.idx;
                    var $1090 = self.code;
                    var $1091 = self.val;
                    var _k$7 = Hex$char_hex_to_nat$($1091);
                    var self = _k$7;
                    switch (self._) {
                        case 'Maybe.some':
                            var $1093 = self.value;
                            var $1094 = (_idx$9 => _code$10 => {
                                var $1095 = Parser$Reply$value$(_idx$9, _code$10, $1093);
                                return $1095;
                            });
                            var $1092 = $1094;
                            break;
                        case 'Maybe.none':
                            var $1096 = Parser$fail("Hex lexical error");
                            var $1092 = $1096;
                            break;
                    };
                    var $1092 = $1092($1089)($1090);
                    var $1084 = $1092;
                    break;
            };
            return $1084;
        });
        return $1083;
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
                        var $1097 = self.head;
                        var $1098 = self.tail;
                        var $1099 = List$fold_right$(null, null, _f$4($1097)(_b$3), _f$4, $1098);
                        return $1099;
                    case 'List.nil':
                        var $1100 = _b$3;
                        return $1100;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const List$fold_right = x0 => x1 => x2 => x3 => x4 => List$fold_right$(x0, x1, x2, x3, x4);

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
                    var $1102 = Bits$to_nat$(Bits$shift_right$(1n, (nat_to_bits(_x$4))));
                    return $1102;
                });
                var _n$5 = (2n * (_x$1 % 2n));
                var _z$6 = (_z$3 + 1n);
                var self = (_x$1 > 0n);
                if (self) {
                    var $1103 = append_2_go$(_shift1_Nat$4(_x$1), (_y$2 + (_n$5 ** _z$6)), _z$6);
                    var $1101 = $1103;
                } else {
                    var $1104 = _y$2;
                    var $1101 = $1104;
                };
                return $1101;
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const append_2_go = x0 => x1 => x2 => append_2_go$(x0, x1, x2);

    function Nat$append_2$(_b$1, _x$2, _y$3) {
        var $1105 = append_2_go$(_x$2, _y$3, _b$1);
        return $1105;
    };
    const Nat$append_2 = x0 => x1 => x2 => Nat$append_2$(x0, x1, x2);
    const Hex$parser = (() => {
        var _k$1 = Parser$many1(Hex$parser$char_hex);
        var $1106 = (_idx$2 => _code$3 => {
            var self = _k$1(_idx$2)(_code$3);
            switch (self._) {
                case 'Parser.Reply.error':
                    var $1108 = self.idx;
                    var $1109 = self.code;
                    var $1110 = self.err;
                    var $1111 = Parser$Reply$error$($1108, $1109, $1110);
                    var $1107 = $1111;
                    break;
                case 'Parser.Reply.value':
                    var $1112 = self.idx;
                    var $1113 = self.code;
                    var $1114 = self.val;
                    var $1115 = Parser$Reply$value$($1112, $1113, (() => {
                        var self = $1114;
                        switch (self._) {
                            case 'List.cons':
                                var $1116 = self.head;
                                var $1117 = self.tail;
                                var $1118 = List$fold_right$(null, null, $1116, Function$flip(Nat$append_2(3n)), $1117);
                                return $1118;
                            case 'List.nil':
                                var $1119 = 0n;
                                return $1119;
                        };
                    })());
                    var $1107 = $1115;
                    break;
            };
            return $1107;
        });
        return $1106;
    })();

    function Hex$to_nat$(_x$1) {
        var self = Parser$run$(Hex$parser, _x$1);
        switch (self._) {
            case 'Maybe.some':
                var $1121 = self.value;
                var $1122 = $1121;
                var $1120 = $1122;
                break;
            case 'Maybe.none':
                var $1123 = 0n;
                var $1120 = $1123;
                break;
        };
        return $1120;
    };
    const Hex$to_nat = x0 => Hex$to_nat$(x0);

    function String$take$(_n$1, _xs$2) {
        var self = _xs$2;
        if (self.length === 0) {
            var $1125 = String$nil;
            var $1124 = $1125;
        } else {
            var $1126 = self.charCodeAt(0);
            var $1127 = self.slice(1);
            var self = _n$1;
            if (self === 0n) {
                var $1129 = String$nil;
                var $1128 = $1129;
            } else {
                var $1130 = (self - 1n);
                var $1131 = String$cons$($1126, String$take$($1130, $1127));
                var $1128 = $1131;
            };
            var $1124 = $1128;
        };
        return $1124;
    };
    const String$take = x0 => x1 => String$take$(x0, x1);

    function Web$Kaelin$Event$Buffer$get$(_buffer$1) {
        var self = _buffer$1;
        switch (self._) {
            case 'Pair.new':
                var $1133 = self.fst;
                var $1134 = self.snd;
                var self = $1134;
                switch (self._) {
                    case 'List.cons':
                        var $1136 = self.head;
                        var $1137 = Hex$to_nat$(String$take$((BigInt($1136)), $1133));
                        var $1135 = $1137;
                        break;
                    case 'List.nil':
                        var $1138 = 0n;
                        var $1135 = $1138;
                        break;
                };
                var $1132 = $1135;
                break;
        };
        return $1132;
    };
    const Web$Kaelin$Event$Buffer$get = x0 => Web$Kaelin$Event$Buffer$get$(x0);

    function Web$Kaelin$Event$Buffer$push$(_buffer$1, _list$2) {
        var self = _buffer$1;
        switch (self._) {
            case 'Pair.new':
                var $1140 = self.fst;
                var $1141 = self.snd;
                var $1142 = Pair$new$($1140, List$concat$(_list$2, $1141));
                var $1139 = $1142;
                break;
        };
        return $1139;
    };
    const Web$Kaelin$Event$Buffer$push = x0 => x1 => Web$Kaelin$Event$Buffer$push$(x0, x1);

    function Web$Kaelin$Event$Buffer$new$(_fst$1, _snd$2) {
        var $1143 = Pair$new$(_fst$1, _snd$2);
        return $1143;
    };
    const Web$Kaelin$Event$Buffer$new = x0 => x1 => Web$Kaelin$Event$Buffer$new$(x0, x1);

    function Web$Kaelin$Event$create_hero$(_hero_id$1) {
        var $1144 = ({
            _: 'Web.Kaelin.Event.create_hero',
            'hero_id': _hero_id$1
        });
        return $1144;
    };
    const Web$Kaelin$Event$create_hero = x0 => Web$Kaelin$Event$create_hero$(x0);
    const Web$Kaelin$Action$walk = ({
        _: 'Web.Kaelin.Action.walk'
    });
    const Web$Kaelin$Action$ability_0 = ({
        _: 'Web.Kaelin.Action.ability_0'
    });
    const Web$Kaelin$Action$ability_1 = ({
        _: 'Web.Kaelin.Action.ability_1'
    });

    function Web$Kaelin$Resources$Action$to_action$(_x$1) {
        var self = (_x$1 === 0n);
        if (self) {
            var $1146 = Maybe$some$(Web$Kaelin$Action$walk);
            var $1145 = $1146;
        } else {
            var self = (_x$1 === 1n);
            if (self) {
                var $1148 = Maybe$some$(Web$Kaelin$Action$ability_0);
                var $1147 = $1148;
            } else {
                var self = (_x$1 === 2n);
                if (self) {
                    var $1150 = Maybe$some$(Web$Kaelin$Action$ability_1);
                    var $1149 = $1150;
                } else {
                    var $1151 = Maybe$none;
                    var $1149 = $1151;
                };
                var $1147 = $1149;
            };
            var $1145 = $1147;
        };
        return $1145;
    };
    const Web$Kaelin$Resources$Action$to_action = x0 => Web$Kaelin$Resources$Action$to_action$(x0);

    function Maybe$bind$(_m$3, _f$4) {
        var self = _m$3;
        switch (self._) {
            case 'Maybe.some':
                var $1153 = self.value;
                var $1154 = _f$4($1153);
                var $1152 = $1154;
                break;
            case 'Maybe.none':
                var $1155 = Maybe$none;
                var $1152 = $1155;
                break;
        };
        return $1152;
    };
    const Maybe$bind = x0 => x1 => Maybe$bind$(x0, x1);

    function Web$Kaelin$Event$user_input$(_coord$1, _action$2) {
        var $1156 = ({
            _: 'Web.Kaelin.Event.user_input',
            'coord': _coord$1,
            'action': _action$2
        });
        return $1156;
    };
    const Web$Kaelin$Event$user_input = x0 => x1 => Web$Kaelin$Event$user_input$(x0, x1);

    function Web$Kaelin$Event$deserialize$(_code$1) {
        var _stream$2 = Web$Kaelin$Event$Buffer$new$(_code$1, Web$Kaelin$Event$Code$action);
        var self = ((_x$3 => {
            var $1158 = Web$Kaelin$Event$Buffer$get$(_x$3);
            return $1158;
        })(_stream$2) === 1n);
        if (self) {
            var _stream$3 = (_x$3 => {
                var $1160 = Web$Kaelin$Event$Buffer$next$(_x$3);
                return $1160;
            })(_stream$2);
            var _stream$4 = (_x$4 => _y$5 => {
                var $1161 = Web$Kaelin$Event$Buffer$push$(_x$4, _y$5);
                return $1161;
            })(_stream$3)(Web$Kaelin$Event$Code$create_hero);
            var $1159 = Maybe$some$(Web$Kaelin$Event$create_hero$((Number((_x$5 => {
                var $1162 = Web$Kaelin$Event$Buffer$get$(_x$5);
                return $1162;
            })(_stream$4)) & 0xFF)));
            var $1157 = $1159;
        } else {
            var self = ((_x$3 => {
                var $1164 = Web$Kaelin$Event$Buffer$get$(_x$3);
                return $1164;
            })(_stream$2) === 4n);
            if (self) {
                var _stream$3 = (_x$3 => {
                    var $1166 = Web$Kaelin$Event$Buffer$next$(_x$3);
                    return $1166;
                })(_stream$2);
                var _stream$4 = (_x$4 => _y$5 => {
                    var $1167 = Web$Kaelin$Event$Buffer$push$(_x$4, _y$5);
                    return $1167;
                })(_stream$3)(Web$Kaelin$Event$Code$user_input);
                var _action$5 = Web$Kaelin$Resources$Action$to_action$((_x$5 => {
                    var $1168 = Web$Kaelin$Event$Buffer$get$(_x$5);
                    return $1168;
                })(_stream$4));
                var _stream$6 = (_x$6 => {
                    var $1169 = Web$Kaelin$Event$Buffer$next$(_x$6);
                    return $1169;
                })(_stream$4);
                var _pos$7 = Web$Kaelin$Coord$Convert$nat_to_axial$((_x$7 => {
                    var $1170 = Web$Kaelin$Event$Buffer$get$(_x$7);
                    return $1170;
                })(_stream$6));
                var $1165 = Maybe$bind$(_action$5, (_action$8 => {
                    var $1171 = Maybe$some$(Web$Kaelin$Event$user_input$(_pos$7, _action$8));
                    return $1171;
                }));
                var $1163 = $1165;
            } else {
                var $1172 = Maybe$none;
                var $1163 = $1172;
            };
            var $1157 = $1163;
        };
        return $1157;
    };
    const Web$Kaelin$Event$deserialize = x0 => Web$Kaelin$Event$deserialize$(x0);

    function IO$(_A$1) {
        var $1173 = null;
        return $1173;
    };
    const IO = x0 => IO$(x0);

    function IO$ask$(_query$2, _param$3, _then$4) {
        var $1174 = ({
            _: 'IO.ask',
            'query': _query$2,
            'param': _param$3,
            'then': _then$4
        });
        return $1174;
    };
    const IO$ask = x0 => x1 => x2 => IO$ask$(x0, x1, x2);

    function IO$bind$(_a$3, _f$4) {
        var self = _a$3;
        switch (self._) {
            case 'IO.end':
                var $1176 = self.value;
                var $1177 = _f$4($1176);
                var $1175 = $1177;
                break;
            case 'IO.ask':
                var $1178 = self.query;
                var $1179 = self.param;
                var $1180 = self.then;
                var $1181 = IO$ask$($1178, $1179, (_x$8 => {
                    var $1182 = IO$bind$($1180(_x$8), _f$4);
                    return $1182;
                }));
                var $1175 = $1181;
                break;
        };
        return $1175;
    };
    const IO$bind = x0 => x1 => IO$bind$(x0, x1);

    function IO$end$(_value$2) {
        var $1183 = ({
            _: 'IO.end',
            'value': _value$2
        });
        return $1183;
    };
    const IO$end = x0 => IO$end$(x0);

    function IO$monad$(_new$2) {
        var $1184 = _new$2(IO$bind)(IO$end);
        return $1184;
    };
    const IO$monad = x0 => IO$monad$(x0);

    function Dynamic$new$(_value$2) {
        var $1185 = ({
            _: 'Dynamic.new',
            'value': _value$2
        });
        return $1185;
    };
    const Dynamic$new = x0 => Dynamic$new$(x0);
    const App$pass = IO$monad$((_m$bind$1 => _m$pure$2 => {
        var $1186 = _m$pure$2;
        return $1186;
    }))(Dynamic$new$(Unit$new));

    function IO$do$(_call$1, _param$2) {
        var $1187 = IO$ask$(_call$1, _param$2, (_answer$3 => {
            var $1188 = IO$end$(Unit$new);
            return $1188;
        }));
        return $1187;
    };
    const IO$do = x0 => x1 => IO$do$(x0, x1);

    function App$do$(_call$1, _param$2) {
        var $1189 = IO$monad$((_m$bind$3 => _m$pure$4 => {
            var $1190 = _m$bind$3;
            return $1190;
        }))(IO$do$(_call$1, _param$2))((_$3 => {
            var $1191 = App$pass;
            return $1191;
        }));
        return $1189;
    };
    const App$do = x0 => x1 => App$do$(x0, x1);

    function App$watch$(_room$1) {
        var $1192 = App$do$("watch", _room$1);
        return $1192;
    };
    const App$watch = x0 => App$watch$(x0);

    function App$store$(_value$2) {
        var $1193 = IO$monad$((_m$bind$3 => _m$pure$4 => {
            var $1194 = _m$pure$4;
            return $1194;
        }))(Dynamic$new$(_value$2));
        return $1193;
    };
    const App$store = x0 => App$store$(x0);

    function Map$get$(_key$2, _map$3) {
        var $1195 = (bitsmap_get(String$to_bits$(_key$2), _map$3));
        return $1195;
    };
    const Map$get = x0 => x1 => Map$get$(x0, x1);

    function Web$Kaelin$Player$new$(_addr$1, _team$2) {
        var $1196 = ({
            _: 'Web.Kaelin.Player.new',
            'addr': _addr$1,
            'team': _team$2
        });
        return $1196;
    };
    const Web$Kaelin$Player$new = x0 => x1 => Web$Kaelin$Player$new$(x0, x1);

    function Map$set$(_key$2, _val$3, _map$4) {
        var $1197 = (bitsmap_set(String$to_bits$(_key$2), _val$3, _map$4, 'set'));
        return $1197;
    };
    const Map$set = x0 => x1 => x2 => Map$set$(x0, x1, x2);

    function Web$Kaelin$Action$create_player$(_user$1, _hero$2, _state$3) {
        var _key$4 = _user$1;
        var _init_pos$5 = Web$Kaelin$Coord$new$(Int$to_i32$(Int$from_nat$(0n)), Int$to_i32$(Int$from_nat$(0n)));
        var self = _state$3;
        switch (self._) {
            case 'Web.Kaelin.State.game':
                var $1199 = self.room;
                var $1200 = self.players;
                var $1201 = self.cast_info;
                var $1202 = self.map;
                var $1203 = self.internal;
                var $1204 = self.interface;
                var self = Map$get$(_key$4, $1200);
                switch (self._) {
                    case 'Maybe.none':
                        var _creature$12 = Web$Kaelin$Entity$creature;
                        var _new_player$13 = Web$Kaelin$Player$new$(_user$1, "blue");
                        var _map$14 = Web$Kaelin$Map$push$(_init_pos$5, _creature$12(Maybe$some$(_user$1))(_hero$2), $1202);
                        var _new_players$15 = Map$set$(_key$4, _new_player$13, $1200);
                        var $1206 = Web$Kaelin$State$game$($1199, _new_players$15, $1201, _map$14, $1203, $1204);
                        var $1205 = $1206;
                        break;
                    case 'Maybe.some':
                        var $1207 = _state$3;
                        var $1205 = $1207;
                        break;
                };
                var $1198 = $1205;
                break;
            case 'Web.Kaelin.State.init':
            case 'Web.Kaelin.State.void':
                var $1208 = _state$3;
                var $1198 = $1208;
                break;
        };
        return $1198;
    };
    const Web$Kaelin$Action$create_player = x0 => x1 => x2 => Web$Kaelin$Action$create_player$(x0, x1, x2);

    function List$take_while$go$(_f$2, _xs$3) {
        var self = _xs$3;
        switch (self._) {
            case 'List.cons':
                var $1210 = self.head;
                var $1211 = self.tail;
                var self = _f$2($1210);
                if (self) {
                    var self = List$take_while$go$(_f$2, $1211);
                    switch (self._) {
                        case 'Pair.new':
                            var $1214 = self.fst;
                            var $1215 = self.snd;
                            var $1216 = Pair$new$(List$cons$($1210, $1214), $1215);
                            var $1213 = $1216;
                            break;
                    };
                    var $1212 = $1213;
                } else {
                    var $1217 = Pair$new$(List$nil, _xs$3);
                    var $1212 = $1217;
                };
                var $1209 = $1212;
                break;
            case 'List.nil':
                var $1218 = Pair$new$(List$nil, List$nil);
                var $1209 = $1218;
                break;
        };
        return $1209;
    };
    const List$take_while$go = x0 => x1 => List$take_while$go$(x0, x1);

    function Web$Kaelin$Timer$set_timer$(_timer$1, _state$2) {
        var self = _state$2;
        switch (self._) {
            case 'Web.Kaelin.State.game':
                var $1220 = self.room;
                var $1221 = self.players;
                var $1222 = self.cast_info;
                var $1223 = self.map;
                var $1224 = self.internal;
                var $1225 = self.interface;
                var _internal$9 = $1224;
                var self = _internal$9;
                switch (self._) {
                    case 'Web.Kaelin.Internal.new':
                        var $1227 = self.tick;
                        var $1228 = self.frame;
                        var $1229 = Web$Kaelin$State$game$($1220, $1221, $1222, $1223, Web$Kaelin$Internal$new$($1227, $1228, _timer$1), $1225);
                        var $1226 = $1229;
                        break;
                };
                var $1219 = $1226;
                break;
            case 'Web.Kaelin.State.init':
            case 'Web.Kaelin.State.void':
                var $1230 = _state$2;
                var $1219 = $1230;
                break;
        };
        return $1219;
    };
    const Web$Kaelin$Timer$set_timer = x0 => x1 => Web$Kaelin$Timer$set_timer$(x0, x1);

    function Function$comp$(_g$4, _f$5, _x$6) {
        var $1231 = _g$4(_f$5(_x$6));
        return $1231;
    };
    const Function$comp = x0 => x1 => x2 => Function$comp$(x0, x1, x2);

    function Web$Kaelin$Timer$wait$(_frame$1, _timer$2, _state$3) {
        var self = List$take_while$go$((_x$4 => {
            var self = _x$4;
            switch (self._) {
                case 'Web.Kaelin.Timer.new':
                    var $1234 = self.time;
                    var $1235 = ($1234 < _frame$1);
                    var $1233 = $1235;
                    break;
            };
            return $1233;
        }), _timer$2);
        switch (self._) {
            case 'Pair.new':
                var $1236 = self.fst;
                var $1237 = self.snd;
                var $1238 = Web$Kaelin$Timer$set_timer$($1237, List$foldr$((_x$6 => {
                    var $1239 = _x$6;
                    return $1239;
                }), (_x$6 => _f$7 => {
                    var self = _x$6;
                    switch (self._) {
                        case 'Web.Kaelin.Timer.new':
                            var $1241 = self.action;
                            var $1242 = Function$comp(_f$7)($1241);
                            var $1240 = $1242;
                            break;
                    };
                    return $1240;
                }), $1236)(_state$3));
                var $1232 = $1238;
                break;
        };
        return $1232;
    };
    const Web$Kaelin$Timer$wait = x0 => x1 => x2 => Web$Kaelin$Timer$wait$(x0, x1, x2);

    function Web$Kaelin$Action$update_interface$(_interface$1, _tick$2, _state$3) {
        var self = _state$3;
        switch (self._) {
            case 'Web.Kaelin.State.game':
                var $1244 = self.room;
                var $1245 = self.players;
                var $1246 = self.cast_info;
                var $1247 = self.map;
                var $1248 = self.internal;
                var _internal$10 = $1248;
                var self = _internal$10;
                switch (self._) {
                    case 'Web.Kaelin.Internal.new':
                        var $1250 = self.frame;
                        var $1251 = self.timer;
                        var _new_state$14 = Web$Kaelin$State$game$($1244, $1245, $1246, $1247, Web$Kaelin$Internal$new$(_tick$2, ($1250 + 1n), $1251), _interface$1);
                        var $1252 = Web$Kaelin$Timer$wait$($1250, $1251, _new_state$14);
                        var $1249 = $1252;
                        break;
                };
                var $1243 = $1249;
                break;
            case 'Web.Kaelin.State.init':
            case 'Web.Kaelin.State.void':
                var $1253 = _state$3;
                var $1243 = $1253;
                break;
        };
        return $1243;
    };
    const Web$Kaelin$Action$update_interface = x0 => x1 => x2 => Web$Kaelin$Action$update_interface$(x0, x1, x2);
    const U64$to_nat = a0 => (a0);

    function App$post$(_room$1, _data$2) {
        var $1254 = App$do$("post", (_room$1 + (";" + _data$2)));
        return $1254;
    };
    const App$post = x0 => x1 => App$post$(x0, x1);

    function Web$Kaelin$Map$find_players$(_map$1) {
        var _lmap$2 = NatMap$to_list$(_map$1);
        var _result$3 = List$nil;
        var _players$4 = List$nil;
        var _result$5 = (() => {
            var $1257 = _result$3;
            var $1258 = _lmap$2;
            let _result$6 = $1257;
            let _pair$5;
            while ($1258._ === 'List.cons') {
                _pair$5 = $1258.head;
                var self = _pair$5;
                switch (self._) {
                    case 'Pair.new':
                        var $1259 = self.fst;
                        var $1260 = self.snd;
                        var _coord$9 = $1259;
                        var _tile$10 = $1260;
                        var _players$11 = (() => {
                            var $1263 = _players$4;
                            var $1264 = _tile$10;
                            let _players$12 = $1263;
                            let _entity$11;
                            while ($1264._ === 'List.cons') {
                                _entity$11 = $1264.head;
                                var self = _entity$11;
                                switch (self._) {
                                    case 'Web.Kaelin.Entity.creature':
                                        var $1265 = self.player;
                                        var self = $1265;
                                        switch (self._) {
                                            case 'Maybe.some':
                                                var $1267 = self.value;
                                                var _axial_coord$16 = Web$Kaelin$Coord$Convert$nat_to_axial$(_coord$9);
                                                var $1268 = List$cons$(Pair$new$($1267, _axial_coord$16), List$nil);
                                                var $1266 = $1268;
                                                break;
                                            case 'Maybe.none':
                                                var $1269 = _players$12;
                                                var $1266 = $1269;
                                                break;
                                        };
                                        var $1263 = $1266;
                                        break;
                                    case 'Web.Kaelin.Entity.background':
                                        var $1270 = _players$12;
                                        var $1263 = $1270;
                                        break;
                                };
                                _players$12 = $1263;
                                $1264 = $1264.tail;
                            }
                            return _players$12;
                        })();
                        var $1261 = List$concat$(_result$6, _players$11);
                        var $1257 = $1261;
                        break;
                };
                _result$6 = $1257;
                $1258 = $1258.tail;
            }
            return _result$6;
        })();
        var $1255 = Map$from_list$(_result$5);
        return $1255;
    };
    const Web$Kaelin$Map$find_players = x0 => Web$Kaelin$Map$find_players$(x0);

    function Web$Kaelin$Map$addr_to_coord$(_addr$1, _map$2) {
        var _list$3 = Web$Kaelin$Map$find_players$(_map$2);
        var $1271 = Map$get$(_addr$1, _list$3);
        return $1271;
    };
    const Web$Kaelin$Map$addr_to_coord = x0 => x1 => Web$Kaelin$Map$addr_to_coord$(x0, x1);
    const Bool$or = a0 => a1 => (a0 || a1);
    const U32$to_nat = a0 => (BigInt(a0));

    function Web$Kaelin$Coord$Path$moore$(_c$1) {
        var self = _c$1;
        switch (self._) {
            case 'Web.Kaelin.Coord.new':
                var $1273 = self.i;
                var $1274 = self.j;
                var _U32_i$4 = (_i$4 => {
                    var $1276 = Int$to_i32$((Int$from_nat$((BigInt(_i$4))) - Int$from_nat$(1n)));
                    return $1276;
                });
                var _r$5 = List$nil;
                var _r$6 = (() => {
                    var $1277 = _r$5;
                    var $1278 = 0;
                    var $1279 = 3;
                    let _r$7 = $1277;
                    for (let _i$6 = $1278; _i$6 < $1279; ++_i$6) {
                        var _r$8 = (() => {
                            var $1280 = _r$7;
                            var $1281 = 0;
                            var $1282 = 3;
                            let _r$9 = $1280;
                            for (let _j$8 = $1281; _j$8 < $1282; ++_j$8) {
                                var self = (_i$6 === _j$8);
                                if (self) {
                                    var $1283 = _r$9;
                                    var $1280 = $1283;
                                } else {
                                    var $1284 = List$cons$(Web$Kaelin$Coord$new$((($1273 + _U32_i$4(_i$6)) >> 0), (($1274 + _U32_i$4(_j$8)) >> 0)), _r$9);
                                    var $1280 = $1284;
                                };
                                _r$9 = $1280;
                            };
                            return _r$9;
                        })();
                        var $1277 = _r$8;
                        _r$7 = $1277;
                    };
                    return _r$7;
                })();
                var $1275 = _r$6;
                var $1272 = $1275;
                break;
        };
        return $1272;
    };
    const Web$Kaelin$Coord$Path$moore = x0 => Web$Kaelin$Coord$Path$moore$(x0);

    function List$merge_sort$merge$(_A$1, _f$2, _xs$3, _ys$4) {
        var self = _xs$3;
        switch (self._) {
            case 'List.cons':
                var $1286 = self.head;
                var $1287 = self.tail;
                var self = _ys$4;
                switch (self._) {
                    case 'List.cons':
                        var $1289 = self.head;
                        var $1290 = self.tail;
                        var self = _f$2($1286)($1289);
                        if (self) {
                            var $1292 = List$cons$($1286, List$merge_sort$merge$(null, _f$2, $1287, _ys$4));
                            var $1291 = $1292;
                        } else {
                            var $1293 = List$cons$($1289, List$merge_sort$merge$(null, _f$2, _xs$3, $1290));
                            var $1291 = $1293;
                        };
                        var $1288 = $1291;
                        break;
                    case 'List.nil':
                        var $1294 = _xs$3;
                        var $1288 = $1294;
                        break;
                };
                var $1285 = $1288;
                break;
            case 'List.nil':
                var $1295 = _ys$4;
                var $1285 = $1295;
                break;
        };
        return $1285;
    };
    const List$merge_sort$merge = x0 => x1 => x2 => x3 => List$merge_sort$merge$(x0, x1, x2, x3);

    function List$merge_sort$merge_pair$(_A$1, _f$2, _xs$3) {
        var self = _xs$3;
        switch (self._) {
            case 'List.cons':
                var $1297 = self.head;
                var $1298 = self.tail;
                var self = $1298;
                switch (self._) {
                    case 'List.cons':
                        var $1300 = self.head;
                        var $1301 = self.tail;
                        var $1302 = List$cons$(List$merge_sort$merge$(null, _f$2, $1297, $1300), List$merge_sort$merge_pair$(null, _f$2, $1301));
                        var $1299 = $1302;
                        break;
                    case 'List.nil':
                        var $1303 = _xs$3;
                        var $1299 = $1303;
                        break;
                };
                var $1296 = $1299;
                break;
            case 'List.nil':
                var $1304 = _xs$3;
                var $1296 = $1304;
                break;
        };
        return $1296;
    };
    const List$merge_sort$merge_pair = x0 => x1 => x2 => List$merge_sort$merge_pair$(x0, x1, x2);

    function List$merge_sort$unpack$(_A$1, _f$2, _xs$3) {
        var List$merge_sort$unpack$ = (_A$1, _f$2, _xs$3) => ({
            ctr: 'TCO',
            arg: [_A$1, _f$2, _xs$3]
        });
        var List$merge_sort$unpack = _A$1 => _f$2 => _xs$3 => List$merge_sort$unpack$(_A$1, _f$2, _xs$3);
        var arg = [_A$1, _f$2, _xs$3];
        while (true) {
            let [_A$1, _f$2, _xs$3] = arg;
            var R = (() => {
                var self = _xs$3;
                switch (self._) {
                    case 'List.cons':
                        var $1305 = self.head;
                        var $1306 = self.tail;
                        var self = $1306;
                        switch (self._) {
                            case 'List.nil':
                                var $1308 = $1305;
                                var $1307 = $1308;
                                break;
                            case 'List.cons':
                                var $1309 = List$merge_sort$unpack$(null, _f$2, List$merge_sort$merge_pair$(null, _f$2, _xs$3));
                                var $1307 = $1309;
                                break;
                        };
                        return $1307;
                    case 'List.nil':
                        var $1310 = List$nil;
                        return $1310;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const List$merge_sort$unpack = x0 => x1 => x2 => List$merge_sort$unpack$(x0, x1, x2);

    function List$chunks_of$go$(_len$2, _list$3, _need$4, _chunk$5) {
        var self = _list$3;
        switch (self._) {
            case 'List.cons':
                var $1312 = self.head;
                var $1313 = self.tail;
                var self = _need$4;
                if (self === 0n) {
                    var _head$8 = List$reverse$(_chunk$5);
                    var _tail$9 = List$chunks_of$go$(_len$2, _list$3, _len$2, List$nil);
                    var $1315 = List$cons$(_head$8, _tail$9);
                    var $1314 = $1315;
                } else {
                    var $1316 = (self - 1n);
                    var _chunk$9 = List$cons$($1312, _chunk$5);
                    var $1317 = List$chunks_of$go$(_len$2, $1313, $1316, _chunk$9);
                    var $1314 = $1317;
                };
                var $1311 = $1314;
                break;
            case 'List.nil':
                var $1318 = List$cons$(List$reverse$(_chunk$5), List$nil);
                var $1311 = $1318;
                break;
        };
        return $1311;
    };
    const List$chunks_of$go = x0 => x1 => x2 => x3 => List$chunks_of$go$(x0, x1, x2, x3);

    function List$chunks_of$(_len$2, _xs$3) {
        var $1319 = List$chunks_of$go$(_len$2, _xs$3, _len$2, List$nil);
        return $1319;
    };
    const List$chunks_of = x0 => x1 => List$chunks_of$(x0, x1);

    function List$merge_sort$(_A$1, _f$2, _xs$3) {
        var $1320 = List$merge_sort$unpack$(null, _f$2, List$chunks_of$(1n, _xs$3));
        return $1320;
    };
    const List$merge_sort = x0 => x1 => x2 => List$merge_sort$(x0, x1, x2);

    function Web$Kaelin$Coord$Path$minimum$(_origin$1, _goal$2) {
        var self = _goal$2;
        switch (self._) {
            case 'Web.Kaelin.Coord.new':
                var $1322 = self.i;
                var $1323 = self.j;
                var _f$5 = (_a$5 => _b$6 => {
                    var self = _a$5;
                    switch (self._) {
                        case 'Web.Kaelin.Coord.new':
                            var $1326 = self.i;
                            var $1327 = self.j;
                            var self = _b$6;
                            switch (self._) {
                                case 'Web.Kaelin.Coord.new':
                                    var $1329 = self.i;
                                    var $1330 = self.j;
                                    var _a_dis0$11 = (($1326 - $1322) >> 0);
                                    var _a_dis1$12 = (($1327 - $1323) >> 0);
                                    var _b_dis0$13 = (($1329 - $1322) >> 0);
                                    var _b_dis1$14 = (($1330 - $1323) >> 0);
                                    var $1331 = ((I32$abs$(_a_dis0$11) < I32$abs$(_b_dis0$13)) || ((I32$abs$(_a_dis0$11) === I32$abs$(_b_dis0$13)) && (I32$abs$(_a_dis1$12) < I32$abs$(_b_dis1$14))));
                                    var $1328 = $1331;
                                    break;
                            };
                            var $1325 = $1328;
                            break;
                    };
                    return $1325;
                });
                var _neighborhood$6 = Web$Kaelin$Coord$Path$moore$(_origin$1);
                var _path$7 = List$merge_sort$(null, _f$5, _neighborhood$6);
                var self = _path$7;
                switch (self._) {
                    case 'List.cons':
                        var $1332 = self.head;
                        var $1333 = Maybe$some$($1332);
                        var $1324 = $1333;
                        break;
                    case 'List.nil':
                        var $1334 = Maybe$none;
                        var $1324 = $1334;
                        break;
                };
                var $1321 = $1324;
                break;
        };
        return $1321;
    };
    const Web$Kaelin$Coord$Path$minimum = x0 => x1 => Web$Kaelin$Coord$Path$minimum$(x0, x1);

    function Maybe$extract$(_m$2, _a$4, _f$5) {
        var self = _m$2;
        switch (self._) {
            case 'Maybe.some':
                var $1336 = self.value;
                var $1337 = _f$5($1336);
                var $1335 = $1337;
                break;
            case 'Maybe.none':
                var $1338 = _a$4;
                var $1335 = $1338;
                break;
        };
        return $1335;
    };
    const Maybe$extract = x0 => x1 => x2 => Maybe$extract$(x0, x1, x2);

    function Web$Kaelin$Coord$path$(_c$1, _goal$2) {
        var _path_min$3 = Web$Kaelin$Coord$Path$minimum$(_c$1, _goal$2);
        var self = _path_min$3;
        switch (self._) {
            case 'Maybe.some':
                var $1340 = self.value;
                var self = Web$Kaelin$Coord$eql$($1340, _goal$2);
                if (self) {
                    var $1342 = Maybe$some$(List$cons$($1340, List$nil));
                    var $1341 = $1342;
                } else {
                    var _ls$5 = Web$Kaelin$Coord$path$($1340, _goal$2);
                    var $1343 = Maybe$extract$(_ls$5, Maybe$none, (_a$6 => {
                        var $1344 = Maybe$some$(List$cons$($1340, _a$6));
                        return $1344;
                    }));
                    var $1341 = $1343;
                };
                var $1339 = $1341;
                break;
            case 'Maybe.none':
                var $1345 = Maybe$none;
                var $1339 = $1345;
                break;
        };
        return $1339;
    };
    const Web$Kaelin$Coord$path = x0 => x1 => Web$Kaelin$Coord$path$(x0, x1);

    function Web$Kaelin$Map$is_occupied$(_coord$1, _map$2) {
        var _tile$3 = Maybe$default$(Web$Kaelin$Map$get$(_coord$1, _map$2), List$nil);
        var _is_occupied$4 = Bool$false;
        var _is_occupied$5 = (() => {
            var $1348 = _is_occupied$4;
            var $1349 = _tile$3;
            let _is_occupied$6 = $1348;
            let _ent$5;
            while ($1349._ === 'List.cons') {
                _ent$5 = $1349.head;
                var self = _ent$5;
                switch (self._) {
                    case 'Web.Kaelin.Entity.background':
                        var $1350 = (_is_occupied$6 || Bool$false);
                        var $1348 = $1350;
                        break;
                    case 'Web.Kaelin.Entity.creature':
                        var $1351 = Bool$true;
                        var $1348 = $1351;
                        break;
                };
                _is_occupied$6 = $1348;
                $1349 = $1349.tail;
            }
            return _is_occupied$6;
        })();
        var $1346 = _is_occupied$5;
        return $1346;
    };
    const Web$Kaelin$Map$is_occupied = x0 => x1 => Web$Kaelin$Map$is_occupied$(x0, x1);

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
                            var $1353 = self.head;
                            var $1354 = self.tail;
                            var $1355 = Pair$new$(Maybe$some$($1353), List$concat$(_searched_list$4, $1354));
                            var $1352 = $1355;
                            break;
                        case 'List.nil':
                            var $1356 = Pair$new$(Maybe$none, _searched_list$4);
                            var $1352 = $1356;
                            break;
                    };
                    return $1352;
                } else {
                    var $1357 = (self - 1n);
                    var self = _list$3;
                    switch (self._) {
                        case 'List.cons':
                            var $1359 = self.head;
                            var $1360 = self.tail;
                            var $1361 = List$pop_at$go$($1357, $1360, List$concat$(_searched_list$4, List$cons$($1359, List$nil)));
                            var $1358 = $1361;
                            break;
                        case 'List.nil':
                            var $1362 = Pair$new$(Maybe$none, _searched_list$4);
                            var $1358 = $1362;
                            break;
                    };
                    return $1358;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const List$pop_at$go = x0 => x1 => x2 => List$pop_at$go$(x0, x1, x2);

    function List$pop_at$(_idx$2, _list$3) {
        var $1363 = List$pop_at$go$(_idx$2, _list$3, List$nil);
        return $1363;
    };
    const List$pop_at = x0 => x1 => List$pop_at$(x0, x1);

    function Web$Kaelin$Map$pop_at$(_idx$1, _coord$2, _map$3) {
        var _tile$4 = Web$Kaelin$Map$get$(_coord$2, _map$3);
        var self = _tile$4;
        switch (self._) {
            case 'Maybe.some':
                var $1365 = self.value;
                var self = List$pop_at$(_idx$1, $1365);
                switch (self._) {
                    case 'Pair.new':
                        var $1367 = self.fst;
                        var $1368 = self.snd;
                        var _map$8 = Web$Kaelin$Map$set$(_coord$2, $1368, _map$3);
                        var $1369 = Pair$new$(_map$8, $1367);
                        var $1366 = $1369;
                        break;
                };
                var $1364 = $1366;
                break;
            case 'Maybe.none':
                var $1370 = Pair$new$(_map$3, Maybe$none);
                var $1364 = $1370;
                break;
        };
        return $1364;
    };
    const Web$Kaelin$Map$pop_at = x0 => x1 => x2 => Web$Kaelin$Map$pop_at$(x0, x1, x2);

    function Web$Kaelin$Map$swap$(_idx$1, _ca$2, _cb$3, _map$4) {
        var self = Web$Kaelin$Map$pop_at$(_idx$1, _ca$2, _map$4);
        switch (self._) {
            case 'Pair.new':
                var $1372 = self.fst;
                var $1373 = self.snd;
                var self = $1373;
                switch (self._) {
                    case 'Maybe.some':
                        var $1375 = self.value;
                        var $1376 = Web$Kaelin$Map$push$(_cb$3, $1375, $1372);
                        var $1374 = $1376;
                        break;
                    case 'Maybe.none':
                        var $1377 = _map$4;
                        var $1374 = $1377;
                        break;
                };
                var $1371 = $1374;
                break;
        };
        return $1371;
    };
    const Web$Kaelin$Map$swap = x0 => x1 => x2 => x3 => Web$Kaelin$Map$swap$(x0, x1, x2, x3);

    function Web$Kaelin$Player$move$(_coord_b$1, _address$2, _state$3) {
        var self = _state$3;
        switch (self._) {
            case 'Web.Kaelin.State.game':
                var $1379 = self.room;
                var $1380 = self.players;
                var $1381 = self.cast_info;
                var $1382 = self.map;
                var $1383 = self.internal;
                var $1384 = self.interface;
                var _coord_a$10 = Web$Kaelin$Map$addr_to_coord$(_address$2, $1382);
                var _is_occupied$11 = Web$Kaelin$Map$is_occupied$(_coord_b$1, $1382);
                var _tile_b$12 = Web$Kaelin$Map$get$(_coord_b$1, $1382);
                var self = _tile_b$12;
                switch (self._) {
                    case 'Maybe.none':
                        var $1386 = _state$3;
                        var $1385 = $1386;
                        break;
                    case 'Maybe.some':
                        var self = _is_occupied$11;
                        if (self) {
                            var $1388 = _state$3;
                            var $1387 = $1388;
                        } else {
                            var _new_map$14 = Web$Kaelin$Map$swap$(0n, Maybe$default$(_coord_a$10, _coord_b$1), _coord_b$1, $1382);
                            var $1389 = Web$Kaelin$State$game$($1379, $1380, $1381, _new_map$14, $1383, $1384);
                            var $1387 = $1389;
                        };
                        var $1385 = $1387;
                        break;
                };
                var $1378 = $1385;
                break;
            case 'Web.Kaelin.State.init':
            case 'Web.Kaelin.State.void':
                var $1390 = _state$3;
                var $1378 = $1390;
                break;
        };
        return $1378;
    };
    const Web$Kaelin$Player$move = x0 => x1 => x2 => Web$Kaelin$Player$move$(x0, x1, x2);
    const Nat$gte = a0 => a1 => (a0 >= a1);

    function List$split$(_A$1, _xs$2, _n$3) {
        var self = _n$3;
        if (self === 0n) {
            var $1392 = Pair$new$(List$nil, _xs$2);
            var $1391 = $1392;
        } else {
            var $1393 = (self - 1n);
            var self = _xs$2;
            switch (self._) {
                case 'List.cons':
                    var $1395 = self.head;
                    var $1396 = self.tail;
                    var self = List$split$(null, $1396, $1393);
                    switch (self._) {
                        case 'Pair.new':
                            var $1398 = self.fst;
                            var $1399 = self.snd;
                            var $1400 = Pair$new$(List$cons$($1395, $1398), $1399);
                            var $1397 = $1400;
                            break;
                    };
                    var $1394 = $1397;
                    break;
                case 'List.nil':
                    var $1401 = Pair$new$(List$nil, _xs$2);
                    var $1394 = $1401;
                    break;
            };
            var $1391 = $1394;
        };
        return $1391;
    };
    const List$split = x0 => x1 => x2 => List$split$(x0, x1, x2);

    function Nat$half$(_n$1) {
        var self = _n$1;
        if (self === 0n) {
            var $1403 = Nat$zero;
            var $1402 = $1403;
        } else {
            var $1404 = (self - 1n);
            var self = $1404;
            if (self === 0n) {
                var $1406 = Nat$zero;
                var $1405 = $1406;
            } else {
                var $1407 = (self - 1n);
                var $1408 = Nat$succ$(Nat$half$($1407));
                var $1405 = $1408;
            };
            var $1402 = $1405;
        };
        return $1402;
    };
    const Nat$half = x0 => Nat$half$(x0);
    const List$length = a0 => (list_length(a0));

    function List$insert_sort$(_f$2, _xs$3, _v$4) {
        var self = List$split$(null, _xs$3, Nat$half$((list_length(_xs$3))));
        switch (self._) {
            case 'Pair.new':
                var $1410 = self.fst;
                var $1411 = self.snd;
                var self = $1410;
                switch (self._) {
                    case 'List.nil':
                        var self = $1411;
                        switch (self._) {
                            case 'List.cons':
                                var $1414 = self.head;
                                var self = _f$2(_v$4)($1414);
                                if (self) {
                                    var $1416 = List$cons$($1414, List$cons$(_v$4, List$nil));
                                    var $1415 = $1416;
                                } else {
                                    var $1417 = List$cons$(_v$4, List$cons$($1414, List$nil));
                                    var $1415 = $1417;
                                };
                                var $1413 = $1415;
                                break;
                            case 'List.nil':
                                var $1418 = List$cons$(_v$4, List$nil);
                                var $1413 = $1418;
                                break;
                        };
                        var $1412 = $1413;
                        break;
                    case 'List.cons':
                        var self = $1411;
                        switch (self._) {
                            case 'List.cons':
                                var $1420 = self.head;
                                var self = _f$2(_v$4)($1420);
                                if (self) {
                                    var $1422 = List$concat$($1410, List$insert_sort$(_f$2, $1411, _v$4));
                                    var $1421 = $1422;
                                } else {
                                    var $1423 = List$concat$(List$insert_sort$(_f$2, $1410, _v$4), $1411);
                                    var $1421 = $1423;
                                };
                                var $1419 = $1421;
                                break;
                            case 'List.nil':
                                var $1424 = List$insert_sort$(_f$2, $1410, _v$4);
                                var $1419 = $1424;
                                break;
                        };
                        var $1412 = $1419;
                        break;
                };
                var $1409 = $1412;
                break;
        };
        return $1409;
    };
    const List$insert_sort = x0 => x1 => x2 => List$insert_sort$(x0, x1, x2);

    function Web$Kaelin$Timer$new$(_time$1, _action$2) {
        var $1425 = ({
            _: 'Web.Kaelin.Timer.new',
            'time': _time$1,
            'action': _action$2
        });
        return $1425;
    };
    const Web$Kaelin$Timer$new = x0 => x1 => Web$Kaelin$Timer$new$(x0, x1);

    function Web$Kaelin$Timer$delay$(_frame$1, _f$2, _state$3) {
        var _sort$4 = (_x$4 => _y$5 => {
            var self = _x$4;
            switch (self._) {
                case 'Web.Kaelin.Timer.new':
                    var $1428 = self.time;
                    var self = _y$5;
                    switch (self._) {
                        case 'Web.Kaelin.Timer.new':
                            var $1430 = self.time;
                            var $1431 = ($1428 >= $1430);
                            var $1429 = $1431;
                            break;
                    };
                    var $1427 = $1429;
                    break;
            };
            return $1427;
        });
        var self = _state$3;
        switch (self._) {
            case 'Web.Kaelin.State.game':
                var $1432 = self.internal;
                var _internal$11 = $1432;
                var self = _internal$11;
                switch (self._) {
                    case 'Web.Kaelin.Internal.new':
                        var $1434 = self.frame;
                        var $1435 = self.timer;
                        var _timer$15 = List$insert_sort$(_sort$4, $1435, Web$Kaelin$Timer$new$(($1434 + _frame$1), _f$2));
                        var $1436 = Web$Kaelin$Timer$set_timer$(_timer$15, _state$3);
                        var $1433 = $1436;
                        break;
                };
                var $1426 = $1433;
                break;
            case 'Web.Kaelin.State.init':
            case 'Web.Kaelin.State.void':
                var $1437 = _state$3;
                var $1426 = $1437;
                break;
        };
        return $1426;
    };
    const Web$Kaelin$Timer$delay = x0 => x1 => x2 => Web$Kaelin$Timer$delay$(x0, x1, x2);

    function Web$Kaelin$Timer$interval$(_f$1, _g$2, _state$3) {
        var _acc$4 = (_f$4 => _pair$5 => {
            var self = _pair$5;
            switch (self._) {
                case 'Pair.new':
                    var $1440 = self.fst;
                    var $1441 = self.snd;
                    var $1442 = Pair$new$(Web$Kaelin$Timer$delay$(_g$2($1441), _f$4, $1440), ($1441 + 1n));
                    var $1439 = $1442;
                    break;
            };
            return $1439;
        });
        var _fold_f$5 = List$foldr$(Pair$new$(_state$3, 0n), _acc$4, _f$1);
        var $1438 = Pair$fst$(_fold_f$5);
        return $1438;
    };
    const Web$Kaelin$Timer$interval = x0 => x1 => x2 => Web$Kaelin$Timer$interval$(x0, x1, x2);

    function Web$Kaelin$App$when$(_event$1, _state$2) {
        var self = _event$1;
        switch (self._) {
            case 'App.Event.init':
                var $1444 = self.user;
                var self = _state$2;
                switch (self._) {
                    case 'Web.Kaelin.State.init':
                    case 'Web.Kaelin.State.void':
                        var $1446 = App$pass;
                        var $1445 = $1446;
                        break;
                    case 'Web.Kaelin.State.game':
                        var self = _event$1;
                        switch (self._) {
                            case 'App.Event.init':
                                var $1448 = self.user;
                                var $1449 = IO$monad$((_m$bind$15 => _m$pure$16 => {
                                    var $1450 = _m$bind$15;
                                    return $1450;
                                }))(App$watch$(Web$Kaelin$Constants$room))((_$15 => {
                                    var $1451 = App$store$(Web$Kaelin$Action$create_player$($1448, Web$Kaelin$Hero$croni, _state$2));
                                    return $1451;
                                }));
                                var $1447 = $1449;
                                break;
                            case 'App.Event.tick':
                            case 'App.Event.mouse_down':
                            case 'App.Event.mouse_up':
                            case 'App.Event.key_down':
                            case 'App.Event.key_up':
                            case 'App.Event.mouse_over':
                            case 'App.Event.mouse_out':
                            case 'App.Event.resize':
                                var $1452 = IO$monad$((_m$bind$14 => _m$pure$15 => {
                                    var $1453 = _m$bind$14;
                                    return $1453;
                                }))(App$watch$(Web$Kaelin$Constants$room))((_$14 => {
                                    var $1454 = App$store$(Web$Kaelin$Action$create_player$($1444, Web$Kaelin$Hero$croni, _state$2));
                                    return $1454;
                                }));
                                var $1447 = $1452;
                                break;
                            case 'App.Event.post':
                                var $1455 = IO$monad$((_m$bind$16 => _m$pure$17 => {
                                    var $1456 = _m$bind$16;
                                    return $1456;
                                }))(App$watch$(Web$Kaelin$Constants$room))((_$16 => {
                                    var $1457 = App$store$(Web$Kaelin$Action$create_player$($1444, Web$Kaelin$Hero$croni, _state$2));
                                    return $1457;
                                }));
                                var $1447 = $1455;
                                break;
                            case 'App.Event.mouse_click':
                                var $1458 = IO$monad$((_m$bind$15 => _m$pure$16 => {
                                    var $1459 = _m$bind$15;
                                    return $1459;
                                }))(App$watch$(Web$Kaelin$Constants$room))((_$15 => {
                                    var $1460 = App$store$(Web$Kaelin$Action$create_player$($1444, Web$Kaelin$Hero$croni, _state$2));
                                    return $1460;
                                }));
                                var $1447 = $1458;
                                break;
                        };
                        var $1445 = $1447;
                        break;
                };
                var $1443 = $1445;
                break;
            case 'App.Event.tick':
                var $1461 = self.time;
                var $1462 = self.info;
                var self = _state$2;
                switch (self._) {
                    case 'Web.Kaelin.State.init':
                    case 'Web.Kaelin.State.void':
                        var $1464 = App$pass;
                        var $1463 = $1464;
                        break;
                    case 'Web.Kaelin.State.game':
                        var $1465 = App$store$(Web$Kaelin$Action$update_interface$($1462, ($1461), _state$2));
                        var $1463 = $1465;
                        break;
                };
                var $1443 = $1463;
                break;
            case 'App.Event.post':
                var $1466 = self.addr;
                var $1467 = self.data;
                var self = _state$2;
                switch (self._) {
                    case 'Web.Kaelin.State.game':
                        var $1469 = self.map;
                        var self = Web$Kaelin$Event$deserialize$(String$drop$(2n, $1467));
                        switch (self._) {
                            case 'Maybe.some':
                                var $1471 = self.value;
                                var self = $1471;
                                switch (self._) {
                                    case 'Web.Kaelin.Event.user_input':
                                        var $1473 = self.coord;
                                        var _pos$16 = $1473;
                                        var self = _pos$16;
                                        switch (self._) {
                                            case 'Web.Kaelin.Coord.new':
                                                var _origin$19 = Web$Kaelin$Map$addr_to_coord$($1466, $1469);
                                                var self = _origin$19;
                                                switch (self._) {
                                                    case 'Maybe.some':
                                                        var $1476 = self.value;
                                                        var _path$21 = Web$Kaelin$Coord$path$($1476, _pos$16);
                                                        var self = _path$21;
                                                        switch (self._) {
                                                            case 'Maybe.some':
                                                                var $1478 = self.value;
                                                                var _moves$23 = List$foldr$(List$nil, (_pos$23 => _xs$24 => {
                                                                    var $1480 = List$cons$(Web$Kaelin$Player$move(_pos$23)($1466), _xs$24);
                                                                    return $1480;
                                                                }), $1478);
                                                                var _interval$24 = Web$Kaelin$Timer$interval$(List$reverse$(_moves$23), (_x$24 => {
                                                                    var $1481 = (_x$24 * 7n);
                                                                    return $1481;
                                                                }), _state$2);
                                                                var $1479 = App$store$(_interval$24);
                                                                var $1477 = $1479;
                                                                break;
                                                            case 'Maybe.none':
                                                                var $1482 = App$pass;
                                                                var $1477 = $1482;
                                                                break;
                                                        };
                                                        var $1475 = $1477;
                                                        break;
                                                    case 'Maybe.none':
                                                        var $1483 = App$pass;
                                                        var $1475 = $1483;
                                                        break;
                                                };
                                                var $1474 = $1475;
                                                break;
                                        };
                                        var $1472 = $1474;
                                        break;
                                    case 'Web.Kaelin.Event.start_game':
                                    case 'Web.Kaelin.Event.create_user':
                                    case 'Web.Kaelin.Event.create_hero':
                                        var $1484 = App$pass;
                                        var $1472 = $1484;
                                        break;
                                };
                                var $1470 = $1472;
                                break;
                            case 'Maybe.none':
                                var $1485 = App$pass;
                                var $1470 = $1485;
                                break;
                        };
                        var $1468 = $1470;
                        break;
                    case 'Web.Kaelin.State.init':
                    case 'Web.Kaelin.State.void':
                        var $1486 = App$pass;
                        var $1468 = $1486;
                        break;
                };
                var $1443 = $1468;
                break;
            case 'App.Event.mouse_down':
            case 'App.Event.key_down':
            case 'App.Event.key_up':
            case 'App.Event.mouse_over':
            case 'App.Event.mouse_out':
            case 'App.Event.resize':
                var self = _state$2;
                switch (self._) {
                    case 'Web.Kaelin.State.init':
                    case 'Web.Kaelin.State.void':
                    case 'Web.Kaelin.State.game':
                        var $1488 = App$pass;
                        var $1487 = $1488;
                        break;
                };
                var $1443 = $1487;
                break;
            case 'App.Event.mouse_up':
                var self = _state$2;
                switch (self._) {
                    case 'Web.Kaelin.State.game':
                        var $1490 = self.room;
                        var $1491 = self.interface;
                        var _info$11 = $1491;
                        var self = _info$11;
                        switch (self._) {
                            case 'App.EnvInfo.new':
                                var $1493 = self.mouse_pos;
                                var self = Web$Kaelin$Coord$to_axial$($1493);
                                switch (self._) {
                                    case 'Web.Kaelin.Coord.new':
                                        var $1495 = self.i;
                                        var $1496 = self.j;
                                        var _hex$16 = Web$Kaelin$Event$serialize$(Web$Kaelin$Event$user_input$(Web$Kaelin$Coord$new$($1495, $1496), Web$Kaelin$Action$walk));
                                        var $1497 = App$post$($1490, _hex$16);
                                        var $1494 = $1497;
                                        break;
                                };
                                var $1492 = $1494;
                                break;
                        };
                        var $1489 = $1492;
                        break;
                    case 'Web.Kaelin.State.init':
                    case 'Web.Kaelin.State.void':
                        var $1498 = App$pass;
                        var $1489 = $1498;
                        break;
                };
                var $1443 = $1489;
                break;
            case 'App.Event.mouse_click':
                var self = _state$2;
                switch (self._) {
                    case 'Web.Kaelin.State.init':
                    case 'Web.Kaelin.State.void':
                    case 'Web.Kaelin.State.game':
                        var $1500 = App$pass;
                        var $1499 = $1500;
                        break;
                };
                var $1443 = $1499;
                break;
        };
        return $1443;
    };
    const Web$Kaelin$App$when = x0 => x1 => Web$Kaelin$App$when$(x0, x1);

    function App$new$(_init$2, _draw$3, _when$4) {
        var $1501 = ({
            _: 'App.new',
            'init': _init$2,
            'draw': _draw$3,
            'when': _when$4
        });
        return $1501;
    };
    const App$new = x0 => x1 => x2 => App$new$(x0, x1, x2);
    const Web$Kaelin = (() => {
        var _img$1 = VoxBox$alloc_capacity$(((65536 * 8) >>> 0));
        var _init$2 = Web$Kaelin$App$init;
        var _draw$3 = Web$Kaelin$App$draw(_img$1);
        var _when$4 = Web$Kaelin$App$when;
        var $1502 = App$new$(_init$2, _draw$3, _when$4);
        return $1502;
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
        'Word.shift_left1.aux': Word$shift_left1$aux,
        'Word.shift_left1': Word$shift_left1,
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
        'Web.Kaelin.CastInfo.new': Web$Kaelin$CastInfo$new,
        'Web.Kaelin.Coord.new': Web$Kaelin$Coord$new,
        'I32.new': I32$new,
        'Word.neg.aux': Word$neg$aux,
        'Word.neg': Word$neg,
        'I32.neg': I32$neg,
        'Int.to_i32': Int$to_i32,
        'Int.new': Int$new,
        'Int.from_nat': Int$from_nat,
        'Web.Kaelin.HexEffect.normal': Web$Kaelin$HexEffect$normal,
        'Web.Kaelin.Entity.creature': Web$Kaelin$Entity$creature,
        'Web.Kaelin.Hero.new': Web$Kaelin$Hero$new,
        'U8.new': U8$new,
        'Nat.to_u8': Nat$to_u8,
        'Nat.ltn': Nat$ltn,
        'Nat.sub': Nat$sub,
        'Word.shift_left': Word$shift_left,
        'Cmp.as_gte': Cmp$as_gte,
        'Cmp.ltn': Cmp$ltn,
        'Cmp.gtn': Cmp$gtn,
        'Word.cmp.go': Word$cmp$go,
        'Cmp.eql': Cmp$eql,
        'Word.cmp': Word$cmp,
        'Word.gte': Word$gte,
        'Pair.new': Pair$new,
        'Word.or': Word$or,
        'Word.shift_right1.aux': Word$shift_right1$aux,
        'Word.shift_right1': Word$shift_right1,
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
        'Web.Kaelin.Hero.croni': Web$Kaelin$Hero$croni,
        'Web.Kaelin.Assets.hero.cyclope_d_1': Web$Kaelin$Assets$hero$cyclope_d_1,
        'Web.Kaelin.Hero.cyclope': Web$Kaelin$Hero$cyclope,
        'Web.Kaelin.Assets.hero.lela_d_1': Web$Kaelin$Assets$hero$lela_d_1,
        'Web.Kaelin.Hero.lela': Web$Kaelin$Hero$lela,
        'Web.Kaelin.Assets.hero.octoking_d_1': Web$Kaelin$Assets$hero$octoking_d_1,
        'Web.Kaelin.Hero.octoking': Web$Kaelin$Hero$octoking,
        'Maybe.default': Maybe$default,
        'List': List,
        'Cmp.as_gtn': Cmp$as_gtn,
        'Nat.cmp': Nat$cmp,
        'Nat.add': Nat$add,
        'Int.cmp': Int$cmp,
        'Int.gtn': Int$gtn,
        'Int.add': Int$add,
        'Int.neg': Int$neg,
        'Int.sub': Int$sub,
        'Nat.mul': Nat$mul,
        'Int.mul': Int$mul,
        'Int.to_nat': Int$to_nat,
        'Arith.Z_to_N': Arith$Z_to_N,
        'Word.is_neg.go': Word$is_neg$go,
        'Word.is_neg': Word$is_neg,
        'Word.fold': Word$fold,
        'Word.to_nat': Word$to_nat,
        'Word.abs': Word$abs,
        'Word.to_int': Word$to_int,
        'I32.to_int': I32$to_int,
        'Pair.fst': Pair$fst,
        'Either': Either,
        'Either.left': Either$left,
        'Either.right': Either$right,
        'Nat.sub_rem': Nat$sub_rem,
        'Nat.div_mod.go': Nat$div_mod$go,
        'Nat.div_mod': Nat$div_mod,
        'Nat.div': Nat$div,
        'Arith.NxN_to_N': Arith$NxN_to_N,
        'Web.Kaelin.Coord.Convert.axial_to_nat': Web$Kaelin$Coord$Convert$axial_to_nat,
        'Maybe': Maybe,
        'BitsMap.get': BitsMap$get,
        'Bits.inc': Bits$inc,
        'Nat.to_bits': Nat$to_bits,
        'NatMap.get': NatMap$get,
        'Web.Kaelin.Map.get': Web$Kaelin$Map$get,
        'List.cons': List$cons,
        'NatMap.set': NatMap$set,
        'Web.Kaelin.Map.set': Web$Kaelin$Map$set,
        'Web.Kaelin.Map.push': Web$Kaelin$Map$push,
        'Web.Kaelin.Map.init': Web$Kaelin$Map$init,
        'NatMap.new': NatMap$new,
        'Web.Kaelin.Constants.map_size': Web$Kaelin$Constants$map_size,
        'Web.Kaelin.Assets.tile.effect.blue_green2': Web$Kaelin$Assets$tile$effect$blue_green2,
        'Web.Kaelin.Assets.tile.effect.dark_blue2': Web$Kaelin$Assets$tile$effect$dark_blue2,
        'Web.Kaelin.Assets.tile.effect.dark_red2': Web$Kaelin$Assets$tile$effect$dark_red2,
        'Web.Kaelin.Assets.tile.green_2': Web$Kaelin$Assets$tile$green_2,
        'Web.Kaelin.Assets.tile.effect.light_blue2': Web$Kaelin$Assets$tile$effect$light_blue2,
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
        'I32.abs': I32$abs,
        'Cmp.inv': Cmp$inv,
        'Word.s_gtn': Word$s_gtn,
        'I32.gtn': I32$gtn,
        'I32.max': I32$max,
        'F64.to_u32': F64$to_u32,
        'Word.s_to_f64': Word$s_to_f64,
        'I32.to_f64': I32$to_f64,
        'I32.to_u32': I32$to_u32,
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
        'List.map': List$map,
        'Web.Kaelin.Coord.Convert.cubic_to_axial': Web$Kaelin$Coord$Convert$cubic_to_axial,
        'I32.add': I32$add,
        'Cmp.as_ltn': Cmp$as_ltn,
        'Word.s_ltn': Word$s_ltn,
        'I32.ltn': I32$ltn,
        'I32.min': I32$min,
        'Web.Kaelin.Coord.Cubic.add': Web$Kaelin$Coord$Cubic$add,
        'List.concat': List$concat,
        'Web.Kaelin.Coord.Cubic.range': Web$Kaelin$Coord$Cubic$range,
        'Web.Kaelin.Coord.Axial.range': Web$Kaelin$Coord$Axial$range,
        'List.filter': List$filter,
        'Web.Kaelin.Coord.range': Web$Kaelin$Coord$range,
        'List.for': List$for,
        'Bits.tail': Bits$tail,
        'Bits.shift_right': Bits$shift_right,
        'Bits.add': Bits$add,
        'Bits.size.go': Bits$size$go,
        'Bits.size': Bits$size,
        'Bits.shift_left': Bits$shift_left,
        'Bits.cmp.go': Bits$cmp$go,
        'Bits.cmp': Bits$cmp,
        'Bits.gte': Bits$gte,
        'Bits.sub.go': Bits$sub$go,
        'Bits.sub': Bits$sub,
        'Bits.div.go': Bits$div$go,
        'Bits.div': Bits$div,
        'Bits.ltn': Bits$ltn,
        'Maybe.unfold': Maybe$unfold,
        'Bits.sqrt': Bits$sqrt,
        'Nat.sqrt': Nat$sqrt,
        'Nat.pow': Nat$pow,
        'Arith.N_to_NxN': Arith$N_to_NxN,
        'Nat.eql': Nat$eql,
        'Nat.mod.go': Nat$mod$go,
        'Nat.mod': Nat$mod,
        'Nat.gtn': Nat$gtn,
        'Int.is_neg': Int$is_neg,
        'Int.abs': Int$abs,
        'Int.to_nat_signed': Int$to_nat_signed,
        'Int.div_nat': Int$div_nat,
        'Int.div': Int$div,
        'Arith.N_to_Z': Arith$N_to_Z,
        'Web.Kaelin.Coord.Convert.nat_to_axial': Web$Kaelin$Coord$Convert$nat_to_axial,
        'Web.Kaelin.Constants.hexagon_radius': Web$Kaelin$Constants$hexagon_radius,
        'F64.div': F64$div,
        'F64.parse': F64$parse,
        'Web.Kaelin.Constants.center_x': Web$Kaelin$Constants$center_x,
        'Web.Kaelin.Constants.center_y': Web$Kaelin$Constants$center_y,
        'F64.add': F64$add,
        'F64.mul': F64$mul,
        'Web.Kaelin.Coord.to_screen_xy': Web$Kaelin$Coord$to_screen_xy,
        'U32.sub': U32$sub,
        'Web.Kaelin.Draw.support.centralize': Web$Kaelin$Draw$support$centralize,
        'List.any': List$any,
        'Bool.and': Bool$and,
        'I32.eql': I32$eql,
        'Web.Kaelin.Coord.eql': Web$Kaelin$Coord$eql,
        'Web.Kaelin.Draw.support.which_effect': Web$Kaelin$Draw$support$which_effect,
        'F64.sub': F64$sub,
        'Web.Kaelin.Coord.round.floor': Web$Kaelin$Coord$round$floor,
        'Web.Kaelin.Coord.round.round_F64': Web$Kaelin$Coord$round$round_F64,
        'Word.gtn': Word$gtn,
        'F64.gtn': F64$gtn,
        'Web.Kaelin.Coord.round.diff': Web$Kaelin$Coord$round$diff,
        'Web.Kaelin.Coord.round': Web$Kaelin$Coord$round,
        'Web.Kaelin.Coord.to_axial': Web$Kaelin$Coord$to_axial,
        'Web.Kaelin.Draw.support.mouse_on_coord': Web$Kaelin$Draw$support$mouse_on_coord,
        'Web.Kaelin.Terrain.Sprite.new': Web$Kaelin$Terrain$Sprite$new,
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
        'Web.Kaelin.Draw.hero': Web$Kaelin$Draw$hero,
        'Web.Kaelin.Draw.state.players': Web$Kaelin$Draw$state$players,
        'Web.Kaelin.Draw.state': Web$Kaelin$Draw$state,
        'Web.Kaelin.App.draw': Web$Kaelin$App$draw,
        'U8.to_nat': U8$to_nat,
        'List.zip': List$zip,
        'Web.Kaelin.Event.Code.action': Web$Kaelin$Event$Code$action,
        'String.cons': String$cons,
        'String.concat': String$concat,
        'String.length.go': String$length$go,
        'String.length': String$length,
        'String.nil': String$nil,
        'String.repeat': String$repeat,
        'Hex.set_min_length': Hex$set_min_length,
        'List.fold': List$fold,
        'List.foldr': List$foldr,
        'Hex.format_hex': Hex$format_hex,
        'Bits.gtn': Bits$gtn,
        'U32.to_bits': U32$to_bits,
        'Bits.mul.go': Bits$mul$go,
        'Bits.mul': Bits$mul,
        'Bits.mod': Bits$mod,
        'Nat.square': Nat$square,
        'Bits.break': Bits$break,
        'Function.flip': Function$flip,
        'Hex.to_hex_string': Hex$to_hex_string,
        'Bits.to_hex_string': Bits$to_hex_string,
        'Hex.append': Hex$append,
        'Pair.snd': Pair$snd,
        'Web.Kaelin.Event.Code.generate_hex': Web$Kaelin$Event$Code$generate_hex,
        'generate_hex': generate_hex,
        'Web.Kaelin.Event.Code.create_hero': Web$Kaelin$Event$Code$create_hero,
        'Web.Kaelin.Resources.Action.to_bits': Web$Kaelin$Resources$Action$to_bits,
        'Web.Kaelin.Coord.Convert.axial_to_bits': Web$Kaelin$Coord$Convert$axial_to_bits,
        'Web.Kaelin.Event.Code.user_input': Web$Kaelin$Event$Code$user_input,
        'Web.Kaelin.Event.serialize': Web$Kaelin$Event$serialize,
        'String.drop': String$drop,
        'Web.Kaelin.Event.Buffer.next': Web$Kaelin$Event$Buffer$next,
        'Parser.run': Parser$run,
        'Parser.Reply': Parser$Reply,
        'Parser.Reply.error': Parser$Reply$error,
        'Parser.Reply.value': Parser$Reply$value,
        'Parser.many.go': Parser$many$go,
        'Parser.many': Parser$many,
        'Parser.many1': Parser$many1,
        'Parser.one': Parser$one,
        'U16.eql': U16$eql,
        'Char.eql': Char$eql,
        'Hex.char_hex_to_nat': Hex$char_hex_to_nat,
        'Parser': Parser,
        'Parser.fail': Parser$fail,
        'Hex.parser.char_hex': Hex$parser$char_hex,
        'List.fold_right': List$fold_right,
        'append_2_go': append_2_go,
        'Nat.append_2': Nat$append_2,
        'Hex.parser': Hex$parser,
        'Hex.to_nat': Hex$to_nat,
        'String.take': String$take,
        'Web.Kaelin.Event.Buffer.get': Web$Kaelin$Event$Buffer$get,
        'Web.Kaelin.Event.Buffer.push': Web$Kaelin$Event$Buffer$push,
        'Web.Kaelin.Event.Buffer.new': Web$Kaelin$Event$Buffer$new,
        'Web.Kaelin.Event.create_hero': Web$Kaelin$Event$create_hero,
        'Web.Kaelin.Action.walk': Web$Kaelin$Action$walk,
        'Web.Kaelin.Action.ability_0': Web$Kaelin$Action$ability_0,
        'Web.Kaelin.Action.ability_1': Web$Kaelin$Action$ability_1,
        'Web.Kaelin.Resources.Action.to_action': Web$Kaelin$Resources$Action$to_action,
        'Maybe.bind': Maybe$bind,
        'Web.Kaelin.Event.user_input': Web$Kaelin$Event$user_input,
        'Web.Kaelin.Event.deserialize': Web$Kaelin$Event$deserialize,
        'IO': IO,
        'IO.ask': IO$ask,
        'IO.bind': IO$bind,
        'IO.end': IO$end,
        'IO.monad': IO$monad,
        'Dynamic.new': Dynamic$new,
        'App.pass': App$pass,
        'IO.do': IO$do,
        'App.do': App$do,
        'App.watch': App$watch,
        'App.store': App$store,
        'Map.get': Map$get,
        'Web.Kaelin.Player.new': Web$Kaelin$Player$new,
        'Map.set': Map$set,
        'Web.Kaelin.Action.create_player': Web$Kaelin$Action$create_player,
        'List.take_while.go': List$take_while$go,
        'Web.Kaelin.Timer.set_timer': Web$Kaelin$Timer$set_timer,
        'Function.comp': Function$comp,
        'Web.Kaelin.Timer.wait': Web$Kaelin$Timer$wait,
        'Web.Kaelin.Action.update_interface': Web$Kaelin$Action$update_interface,
        'U64.to_nat': U64$to_nat,
        'App.post': App$post,
        'Web.Kaelin.Map.find_players': Web$Kaelin$Map$find_players,
        'Web.Kaelin.Map.addr_to_coord': Web$Kaelin$Map$addr_to_coord,
        'Bool.or': Bool$or,
        'U32.to_nat': U32$to_nat,
        'Web.Kaelin.Coord.Path.moore': Web$Kaelin$Coord$Path$moore,
        'List.merge_sort.merge': List$merge_sort$merge,
        'List.merge_sort.merge_pair': List$merge_sort$merge_pair,
        'List.merge_sort.unpack': List$merge_sort$unpack,
        'List.chunks_of.go': List$chunks_of$go,
        'List.chunks_of': List$chunks_of,
        'List.merge_sort': List$merge_sort,
        'Web.Kaelin.Coord.Path.minimum': Web$Kaelin$Coord$Path$minimum,
        'Maybe.extract': Maybe$extract,
        'Web.Kaelin.Coord.path': Web$Kaelin$Coord$path,
        'Web.Kaelin.Map.is_occupied': Web$Kaelin$Map$is_occupied,
        'List.pop_at.go': List$pop_at$go,
        'List.pop_at': List$pop_at,
        'Web.Kaelin.Map.pop_at': Web$Kaelin$Map$pop_at,
        'Web.Kaelin.Map.swap': Web$Kaelin$Map$swap,
        'Web.Kaelin.Player.move': Web$Kaelin$Player$move,
        'Nat.gte': Nat$gte,
        'List.split': List$split,
        'Nat.half': Nat$half,
        'List.length': List$length,
        'List.insert_sort': List$insert_sort,
        'Web.Kaelin.Timer.new': Web$Kaelin$Timer$new,
        'Web.Kaelin.Timer.delay': Web$Kaelin$Timer$delay,
        'Web.Kaelin.Timer.interval': Web$Kaelin$Timer$interval,
        'Web.Kaelin.App.when': Web$Kaelin$App$when,
        'App.new': App$new,
        'Web.Kaelin': Web$Kaelin,
    };
})();