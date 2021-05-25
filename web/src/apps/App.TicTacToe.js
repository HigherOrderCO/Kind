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

    function App$TicTacToe$State$local$new$(_info$1) {
        var $148 = ({
            _: 'App.TicTacToe.State.local.new',
            'info': _info$1
        });
        return $148;
    };
    const App$TicTacToe$State$local$new = x0 => App$TicTacToe$State$local$new$(x0);

    function App$EnvInfo$new$(_screen_size$1, _mouse_pos$2) {
        var $149 = ({
            _: 'App.EnvInfo.new',
            'screen_size': _screen_size$1,
            'mouse_pos': _mouse_pos$2
        });
        return $149;
    };
    const App$EnvInfo$new = x0 => x1 => App$EnvInfo$new$(x0, x1);
    const U32$from_nat = a0 => (Number(a0) >>> 0);

    function App$TicTacToe$State$global$new$(_board$1) {
        var $150 = ({
            _: 'App.TicTacToe.State.global.new',
            'board': _board$1
        });
        return $150;
    };
    const App$TicTacToe$State$global$new = x0 => App$TicTacToe$State$global$new$(x0);

    function Vector$(_A$1, _size$2) {
        var $151 = null;
        return $151;
    };
    const Vector = x0 => x1 => Vector$(x0, x1);
    const Vector$nil = ({
        _: 'Vector.nil'
    });

    function Vector$ext$(_head$3, _tail$4) {
        var $152 = ({
            _: 'Vector.ext',
            'head': _head$3,
            'tail': _tail$4
        });
        return $152;
    };
    const Vector$ext = x0 => x1 => Vector$ext$(x0, x1);

    function Vector$fill$(_A$1, _v$2, _size$3) {
        var self = _size$3;
        if (self === 0n) {
            var $154 = Vector$nil;
            var $153 = $154;
        } else {
            var $155 = (self - 1n);
            var _rec$5 = Vector$fill$(null, _v$2, $155);
            var $156 = Vector$ext$(_v$2, _rec$5);
            var $153 = $156;
        };
        return $153;
    };
    const Vector$fill = x0 => x1 => x2 => Vector$fill$(x0, x1, x2);
    const App$TicTacToe$Entity$Empty = ({
        _: 'App.TicTacToe.Entity.Empty'
    });
    const App$TicTacToe$init = App$Store$new$(App$TicTacToe$State$local$new$(App$EnvInfo$new$(Pair$new$(0, 0), Pair$new$(0, 0))), App$TicTacToe$State$global$new$(Vector$fill$(null, App$TicTacToe$Entity$Empty, 9n)));

    function I32$new$(_value$1) {
        var $157 = word_to_i32(_value$1);
        return $157;
    };
    const I32$new = x0 => I32$new$(x0);
    const Nat$ltn = a0 => a1 => (a0 < a1);
    const Nat$sub = a0 => a1 => (a0 - a1 <= 0n ? 0n : a0 - a1);

    function Cmp$as_gte$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
                var $159 = Bool$false;
                var $158 = $159;
                break;
            case 'Cmp.eql':
            case 'Cmp.gtn':
                var $160 = Bool$true;
                var $158 = $160;
                break;
        };
        return $158;
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
                var $162 = self.pred;
                var $163 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $165 = self.pred;
                            var $166 = (_a$pred$10 => {
                                var $167 = Word$cmp$go$(_a$pred$10, $165, _c$4);
                                return $167;
                            });
                            var $164 = $166;
                            break;
                        case 'Word.i':
                            var $168 = self.pred;
                            var $169 = (_a$pred$10 => {
                                var $170 = Word$cmp$go$(_a$pred$10, $168, Cmp$ltn);
                                return $170;
                            });
                            var $164 = $169;
                            break;
                        case 'Word.e':
                            var $171 = (_a$pred$8 => {
                                var $172 = _c$4;
                                return $172;
                            });
                            var $164 = $171;
                            break;
                    };
                    var $164 = $164($162);
                    return $164;
                });
                var $161 = $163;
                break;
            case 'Word.i':
                var $173 = self.pred;
                var $174 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $176 = self.pred;
                            var $177 = (_a$pred$10 => {
                                var $178 = Word$cmp$go$(_a$pred$10, $176, Cmp$gtn);
                                return $178;
                            });
                            var $175 = $177;
                            break;
                        case 'Word.i':
                            var $179 = self.pred;
                            var $180 = (_a$pred$10 => {
                                var $181 = Word$cmp$go$(_a$pred$10, $179, _c$4);
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
                var $161 = $174;
                break;
            case 'Word.e':
                var $184 = (_b$5 => {
                    var $185 = _c$4;
                    return $185;
                });
                var $161 = $184;
                break;
        };
        var $161 = $161(_b$3);
        return $161;
    };
    const Word$cmp$go = x0 => x1 => x2 => Word$cmp$go$(x0, x1, x2);
    const Cmp$eql = ({
        _: 'Cmp.eql'
    });

    function Word$cmp$(_a$2, _b$3) {
        var $186 = Word$cmp$go$(_a$2, _b$3, Cmp$eql);
        return $186;
    };
    const Word$cmp = x0 => x1 => Word$cmp$(x0, x1);

    function Word$gte$(_a$2, _b$3) {
        var $187 = Cmp$as_gte$(Word$cmp$(_a$2, _b$3));
        return $187;
    };
    const Word$gte = x0 => x1 => Word$gte$(x0, x1);

    function Pair$(_A$1, _B$2) {
        var $188 = null;
        return $188;
    };
    const Pair = x0 => x1 => Pair$(x0, x1);

    function Word$or$(_a$2, _b$3) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $190 = self.pred;
                var $191 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $193 = self.pred;
                            var $194 = (_a$pred$9 => {
                                var $195 = Word$o$(Word$or$(_a$pred$9, $193));
                                return $195;
                            });
                            var $192 = $194;
                            break;
                        case 'Word.i':
                            var $196 = self.pred;
                            var $197 = (_a$pred$9 => {
                                var $198 = Word$i$(Word$or$(_a$pred$9, $196));
                                return $198;
                            });
                            var $192 = $197;
                            break;
                        case 'Word.e':
                            var $199 = (_a$pred$7 => {
                                var $200 = Word$e;
                                return $200;
                            });
                            var $192 = $199;
                            break;
                    };
                    var $192 = $192($190);
                    return $192;
                });
                var $189 = $191;
                break;
            case 'Word.i':
                var $201 = self.pred;
                var $202 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $204 = self.pred;
                            var $205 = (_a$pred$9 => {
                                var $206 = Word$i$(Word$or$(_a$pred$9, $204));
                                return $206;
                            });
                            var $203 = $205;
                            break;
                        case 'Word.i':
                            var $207 = self.pred;
                            var $208 = (_a$pred$9 => {
                                var $209 = Word$i$(Word$or$(_a$pred$9, $207));
                                return $209;
                            });
                            var $203 = $208;
                            break;
                        case 'Word.e':
                            var $210 = (_a$pred$7 => {
                                var $211 = Word$e;
                                return $211;
                            });
                            var $203 = $210;
                            break;
                    };
                    var $203 = $203($201);
                    return $203;
                });
                var $189 = $202;
                break;
            case 'Word.e':
                var $212 = (_b$4 => {
                    var $213 = Word$e;
                    return $213;
                });
                var $189 = $212;
                break;
        };
        var $189 = $189(_b$3);
        return $189;
    };
    const Word$or = x0 => x1 => Word$or$(x0, x1);

    function Word$shift_right$one$go$(_word$2) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $215 = self.pred;
                var $216 = Word$o$(Word$shift_right$one$go$($215));
                var $214 = $216;
                break;
            case 'Word.i':
                var $217 = self.pred;
                var $218 = Word$i$(Word$shift_right$one$go$($217));
                var $214 = $218;
                break;
            case 'Word.e':
                var $219 = Word$o$(Word$e);
                var $214 = $219;
                break;
        };
        return $214;
    };
    const Word$shift_right$one$go = x0 => Word$shift_right$one$go$(x0);

    function Word$shift_right$one$(_word$2) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $221 = self.pred;
                var $222 = Word$shift_right$one$go$($221);
                var $220 = $222;
                break;
            case 'Word.i':
                var $223 = self.pred;
                var $224 = Word$shift_right$one$go$($223);
                var $220 = $224;
                break;
            case 'Word.e':
                var $225 = Word$e;
                var $220 = $225;
                break;
        };
        return $220;
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
                    var $226 = _value$3;
                    return $226;
                } else {
                    var $227 = (self - 1n);
                    var $228 = Word$shift_right$($227, Word$shift_right$one$(_value$3));
                    return $228;
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
                var $230 = self.pred;
                var $231 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $233 = self.pred;
                            var $234 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $236 = Word$i$(Word$subber$(_a$pred$10, $233, Bool$true));
                                    var $235 = $236;
                                } else {
                                    var $237 = Word$o$(Word$subber$(_a$pred$10, $233, Bool$false));
                                    var $235 = $237;
                                };
                                return $235;
                            });
                            var $232 = $234;
                            break;
                        case 'Word.i':
                            var $238 = self.pred;
                            var $239 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $241 = Word$o$(Word$subber$(_a$pred$10, $238, Bool$true));
                                    var $240 = $241;
                                } else {
                                    var $242 = Word$i$(Word$subber$(_a$pred$10, $238, Bool$true));
                                    var $240 = $242;
                                };
                                return $240;
                            });
                            var $232 = $239;
                            break;
                        case 'Word.e':
                            var $243 = (_a$pred$8 => {
                                var $244 = Word$e;
                                return $244;
                            });
                            var $232 = $243;
                            break;
                    };
                    var $232 = $232($230);
                    return $232;
                });
                var $229 = $231;
                break;
            case 'Word.i':
                var $245 = self.pred;
                var $246 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $248 = self.pred;
                            var $249 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $251 = Word$o$(Word$subber$(_a$pred$10, $248, Bool$false));
                                    var $250 = $251;
                                } else {
                                    var $252 = Word$i$(Word$subber$(_a$pred$10, $248, Bool$false));
                                    var $250 = $252;
                                };
                                return $250;
                            });
                            var $247 = $249;
                            break;
                        case 'Word.i':
                            var $253 = self.pred;
                            var $254 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $256 = Word$i$(Word$subber$(_a$pred$10, $253, Bool$true));
                                    var $255 = $256;
                                } else {
                                    var $257 = Word$o$(Word$subber$(_a$pred$10, $253, Bool$false));
                                    var $255 = $257;
                                };
                                return $255;
                            });
                            var $247 = $254;
                            break;
                        case 'Word.e':
                            var $258 = (_a$pred$8 => {
                                var $259 = Word$e;
                                return $259;
                            });
                            var $247 = $258;
                            break;
                    };
                    var $247 = $247($245);
                    return $247;
                });
                var $229 = $246;
                break;
            case 'Word.e':
                var $260 = (_b$5 => {
                    var $261 = Word$e;
                    return $261;
                });
                var $229 = $260;
                break;
        };
        var $229 = $229(_b$3);
        return $229;
    };
    const Word$subber = x0 => x1 => x2 => Word$subber$(x0, x1, x2);

    function Word$sub$(_a$2, _b$3) {
        var $262 = Word$subber$(_a$2, _b$3, Bool$false);
        return $262;
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
                    var $263 = Pair$new$(Bool$true, Word$or$(_value$5, _mask$6));
                    var self = $263;
                } else {
                    var $264 = Pair$new$(Bool$false, _value$5);
                    var self = $264;
                };
                switch (self._) {
                    case 'Pair.new':
                        var $265 = self.fst;
                        var $266 = self.snd;
                        var self = _shift$2;
                        if (self === 0n) {
                            var $268 = $266;
                            var $267 = $268;
                        } else {
                            var $269 = (self - 1n);
                            var _new_shift_copy$9 = Word$shift_right$(1n, _shift_copy$4);
                            var self = $265;
                            if (self) {
                                var $271 = Word$div$go$($269, Word$sub$(_sub_copy$3, _shift_copy$4), _new_shift_copy$9, $266);
                                var $270 = $271;
                            } else {
                                var $272 = Word$div$go$($269, _sub_copy$3, _new_shift_copy$9, $266);
                                var $270 = $272;
                            };
                            var $267 = $270;
                        };
                        return $267;
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
            var $274 = Word$to_zero$(_a$2);
            var $273 = $274;
        } else {
            var _shift$6 = (_a_bits$4 - _b_bits$5 <= 0n ? 0n : _a_bits$4 - _b_bits$5);
            var _shift_copy$7 = Word$shift_left$(_shift$6, _b$3);
            var $275 = Word$div$go$(_shift$6, _a$2, _shift_copy$7, Word$to_zero$(_a$2));
            var $273 = $275;
        };
        return $273;
    };
    const Word$div = x0 => x1 => Word$div$(x0, x1);
    const I32$div = a0 => a1 => ((a0 / a1) >> 0);

    function Word$neg$aux$(_word$2, _inc$3) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $277 = self.pred;
                var self = _inc$3;
                if (self) {
                    var $279 = Word$o$(Word$neg$aux$($277, Bool$true));
                    var $278 = $279;
                } else {
                    var $280 = Word$i$(Word$neg$aux$($277, Bool$false));
                    var $278 = $280;
                };
                var $276 = $278;
                break;
            case 'Word.i':
                var $281 = self.pred;
                var self = _inc$3;
                if (self) {
                    var $283 = Word$i$(Word$neg$aux$($281, Bool$false));
                    var $282 = $283;
                } else {
                    var $284 = Word$o$(Word$neg$aux$($281, Bool$false));
                    var $282 = $284;
                };
                var $276 = $282;
                break;
            case 'Word.e':
                var $285 = Word$e;
                var $276 = $285;
                break;
        };
        return $276;
    };
    const Word$neg$aux = x0 => x1 => Word$neg$aux$(x0, x1);

    function Word$neg$(_word$2) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $287 = self.pred;
                var $288 = Word$o$(Word$neg$aux$($287, Bool$true));
                var $286 = $288;
                break;
            case 'Word.i':
                var $289 = self.pred;
                var $290 = Word$i$(Word$neg$aux$($289, Bool$false));
                var $286 = $290;
                break;
            case 'Word.e':
                var $291 = Word$e;
                var $286 = $291;
                break;
        };
        return $286;
    };
    const Word$neg = x0 => Word$neg$(x0);
    const I32$neg = a0 => ((-a0));
    const Int$to_i32 = a0 => (Number(a0));
    const Int$new = a0 => a1 => (a0 - a1);
    const Int$from_nat = a0 => (a0);
    const I32$from_nat = a0 => (Number(a0));
    const App$TicTacToe$constant$size = 256;
    const side_board = App$TicTacToe$constant$size;

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
                        var $292 = self.pred;
                        var $293 = Word$is_neg$go$($292, Bool$false);
                        return $293;
                    case 'Word.i':
                        var $294 = self.pred;
                        var $295 = Word$is_neg$go$($294, Bool$true);
                        return $295;
                    case 'Word.e':
                        var $296 = _n$3;
                        return $296;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Word$is_neg$go = x0 => x1 => Word$is_neg$go$(x0, x1);

    function Word$is_neg$(_word$2) {
        var $297 = Word$is_neg$go$(_word$2, Bool$false);
        return $297;
    };
    const Word$is_neg = x0 => Word$is_neg$(x0);

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

    function Word$shr$(_n$2, _value$3) {
        var _n_nat$4 = Word$to_nat$(_n$2);
        var $307 = Word$shift_right$(_n_nat$4, _value$3);
        return $307;
    };
    const Word$shr = x0 => x1 => Word$shr$(x0, x1);

    function Word$s_shr$(_n$2, _value$3) {
        var _neg$4 = Word$is_neg$(_n$2);
        var self = _neg$4;
        if (self) {
            var _n$5 = Word$neg$(_n$2);
            var $309 = Word$shl$(_n$5, _value$3);
            var $308 = $309;
        } else {
            var $310 = Word$shr$(_n$2, _value$3);
            var $308 = $310;
        };
        return $308;
    };
    const Word$s_shr = x0 => x1 => Word$s_shr$(x0, x1);
    const I32$shr = a0 => a1 => (a0 >> a1);

    function Word$xor$(_a$2, _b$3) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $312 = self.pred;
                var $313 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $315 = self.pred;
                            var $316 = (_a$pred$9 => {
                                var $317 = Word$o$(Word$xor$(_a$pred$9, $315));
                                return $317;
                            });
                            var $314 = $316;
                            break;
                        case 'Word.i':
                            var $318 = self.pred;
                            var $319 = (_a$pred$9 => {
                                var $320 = Word$i$(Word$xor$(_a$pred$9, $318));
                                return $320;
                            });
                            var $314 = $319;
                            break;
                        case 'Word.e':
                            var $321 = (_a$pred$7 => {
                                var $322 = Word$e;
                                return $322;
                            });
                            var $314 = $321;
                            break;
                    };
                    var $314 = $314($312);
                    return $314;
                });
                var $311 = $313;
                break;
            case 'Word.i':
                var $323 = self.pred;
                var $324 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $326 = self.pred;
                            var $327 = (_a$pred$9 => {
                                var $328 = Word$i$(Word$xor$(_a$pred$9, $326));
                                return $328;
                            });
                            var $325 = $327;
                            break;
                        case 'Word.i':
                            var $329 = self.pred;
                            var $330 = (_a$pred$9 => {
                                var $331 = Word$o$(Word$xor$(_a$pred$9, $329));
                                return $331;
                            });
                            var $325 = $330;
                            break;
                        case 'Word.e':
                            var $332 = (_a$pred$7 => {
                                var $333 = Word$e;
                                return $333;
                            });
                            var $325 = $332;
                            break;
                    };
                    var $325 = $325($323);
                    return $325;
                });
                var $311 = $324;
                break;
            case 'Word.e':
                var $334 = (_b$4 => {
                    var $335 = Word$e;
                    return $335;
                });
                var $311 = $334;
                break;
        };
        var $311 = $311(_b$3);
        return $311;
    };
    const Word$xor = x0 => x1 => Word$xor$(x0, x1);
    const I32$xor = a0 => a1 => (a0 ^ a1);
    const I32$add = a0 => a1 => ((a0 + a1) >> 0);

    function I32$abs$(_a$1) {
        var _mask$2 = (_a$1 >> 31);
        var $336 = (((_mask$2 + _a$1) >> 0) ^ _mask$2);
        return $336;
    };
    const I32$abs = x0 => I32$abs$(x0);
    const I32$sub = a0 => a1 => ((a0 - a1) >> 0);

    function Cmp$as_ltn$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
                var $338 = Bool$true;
                var $337 = $338;
                break;
            case 'Cmp.eql':
            case 'Cmp.gtn':
                var $339 = Bool$false;
                var $337 = $339;
                break;
        };
        return $337;
    };
    const Cmp$as_ltn = x0 => Cmp$as_ltn$(x0);

    function Cmp$inv$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
                var $341 = Cmp$gtn;
                var $340 = $341;
                break;
            case 'Cmp.eql':
                var $342 = Cmp$eql;
                var $340 = $342;
                break;
            case 'Cmp.gtn':
                var $343 = Cmp$ltn;
                var $340 = $343;
                break;
        };
        return $340;
    };
    const Cmp$inv = x0 => Cmp$inv$(x0);

    function Word$s_ltn$(_a$2, _b$3) {
        var _neg_a$4 = Word$is_neg$(_a$2);
        var _neg_b$5 = Word$is_neg$(_b$3);
        var self = _neg_a$4;
        if (self) {
            var self = _neg_b$5;
            if (self) {
                var $346 = Cmp$as_ltn$(Cmp$inv$(Word$cmp$(_a$2, _b$3)));
                var $345 = $346;
            } else {
                var $347 = Bool$true;
                var $345 = $347;
            };
            var $344 = $345;
        } else {
            var self = _neg_b$5;
            if (self) {
                var $349 = Bool$false;
                var $348 = $349;
            } else {
                var $350 = Cmp$as_ltn$(Word$cmp$(_a$2, _b$3));
                var $348 = $350;
            };
            var $344 = $348;
        };
        return $344;
    };
    const Word$s_ltn = x0 => x1 => Word$s_ltn$(x0, x1);
    const I32$ltn = a0 => a1 => (a0 < a1);

    function List$(_A$1) {
        var $351 = null;
        return $351;
    };
    const List = x0 => List$(x0);

    function Cmp$as_gtn$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
            case 'Cmp.eql':
                var $353 = Bool$false;
                var $352 = $353;
                break;
            case 'Cmp.gtn':
                var $354 = Bool$true;
                var $352 = $354;
                break;
        };
        return $352;
    };
    const Cmp$as_gtn = x0 => Cmp$as_gtn$(x0);

    function Word$s_gtn$(_a$2, _b$3) {
        var _neg_a$4 = Word$is_neg$(_a$2);
        var _neg_b$5 = Word$is_neg$(_b$3);
        var self = _neg_a$4;
        if (self) {
            var self = _neg_b$5;
            if (self) {
                var $357 = Cmp$as_gtn$(Cmp$inv$(Word$cmp$(_a$2, _b$3)));
                var $356 = $357;
            } else {
                var $358 = Bool$false;
                var $356 = $358;
            };
            var $355 = $356;
        } else {
            var self = _neg_b$5;
            if (self) {
                var $360 = Bool$true;
                var $359 = $360;
            } else {
                var $361 = Cmp$as_gtn$(Word$cmp$(_a$2, _b$3));
                var $359 = $361;
            };
            var $355 = $359;
        };
        return $355;
    };
    const Word$s_gtn = x0 => x1 => Word$s_gtn$(x0, x1);
    const I32$gtn = a0 => a1 => (a0 > a1);
    const I32$mul = a0 => a1 => ((a0 * a1) >> 0);

    function Cmp$as_eql$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
            case 'Cmp.gtn':
                var $363 = Bool$false;
                var $362 = $363;
                break;
            case 'Cmp.eql':
                var $364 = Bool$true;
                var $362 = $364;
                break;
        };
        return $362;
    };
    const Cmp$as_eql = x0 => Cmp$as_eql$(x0);

    function Word$eql$(_a$2, _b$3) {
        var $365 = Cmp$as_eql$(Word$cmp$(_a$2, _b$3));
        return $365;
    };
    const Word$eql = x0 => x1 => Word$eql$(x0, x1);
    const I32$eql = a0 => a1 => (a0 === a1);

    function List$cons$(_head$2, _tail$3) {
        var $366 = ({
            _: 'List.cons',
            'head': _head$2,
            'tail': _tail$3
        });
        return $366;
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
                    var $367 = List$cons$(Pair$new$(_x0$1, _y0$2), _coords$9);
                    return $367;
                } else {
                    var _new_x$10 = ((1 + _x0$1) >> 0);
                    var self = (_d$8 > 0);
                    if (self) {
                        var _new_y$11 = ((_yi$5 + _y0$2) >> 0);
                        var _new_d$12 = ((_d$8 + ((2 * ((_dy$7 - _dx$6) >> 0)) >> 0)) >> 0);
                        var $369 = VoxBox$Draw$line$coords$low$go$(_new_x$10, _new_y$11, _x1$3, _y1$4, _yi$5, _dx$6, _dy$7, _new_d$12, List$cons$(Pair$new$(_x0$1, _y0$2), _coords$9));
                        var $368 = $369;
                    } else {
                        var _new_d$11 = ((_d$8 + ((2 * _dy$7) >> 0)) >> 0);
                        var $370 = VoxBox$Draw$line$coords$low$go$(_new_x$10, _y0$2, _x1$3, _y1$4, _yi$5, _dx$6, _dy$7, _new_d$11, List$cons$(Pair$new$(_x0$1, _y0$2), _coords$9));
                        var $368 = $370;
                    };
                    return $368;
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
            var $372 = 1;
            var _yi$7 = $372;
        } else {
            var $373 = ((-1));
            var _yi$7 = $373;
        };
        var _d$8 = ((((2 * _dy$6) >> 0) - _dx$5) >> 0);
        var $371 = VoxBox$Draw$line$coords$low$go$(_x0$1, _y0$2, _x1$3, _y1$4, _yi$7, _dx$5, _dy$6, _d$8, List$nil);
        return $371;
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
                    var $374 = List$cons$(Pair$new$(_x0$1, _y0$2), _coords$9);
                    return $374;
                } else {
                    var _new_y$10 = ((1 + _y0$2) >> 0);
                    var self = (_d$8 > 0);
                    if (self) {
                        var _new_x$11 = ((_x0$1 + _xi$5) >> 0);
                        var _new_d$12 = ((_d$8 + ((2 * ((_dx$6 - _dy$7) >> 0)) >> 0)) >> 0);
                        var $376 = VoxBox$Draw$line$coords$high$go$(_new_x$11, _new_y$10, _x1$3, _y1$4, _xi$5, _dx$6, _dy$7, _new_d$12, List$cons$(Pair$new$(_x0$1, _y0$2), _coords$9));
                        var $375 = $376;
                    } else {
                        var _new_d$11 = ((_d$8 + ((2 * _dx$6) >> 0)) >> 0);
                        var $377 = VoxBox$Draw$line$coords$high$go$(_x0$1, _new_y$10, _x1$3, _y1$4, _xi$5, _dx$6, _dy$7, _new_d$11, List$cons$(Pair$new$(_x0$1, _y0$2), _coords$9));
                        var $375 = $377;
                    };
                    return $375;
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
            var $379 = ((-1));
            var _xi$7 = $379;
        } else {
            var $380 = 1;
            var _xi$7 = $380;
        };
        var _d$8 = ((((2 * _dx$5) >> 0) - _dy$6) >> 0);
        var $378 = VoxBox$Draw$line$coords$high$go$(_x0$1, _y0$2, _x1$3, _y1$4, _xi$7, _dx$5, _dy$6, _d$8, List$nil);
        return $378;
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
                var $383 = VoxBox$Draw$line$coords$low$(_x1$3, _y1$4, _x0$1, _y0$2);
                var $382 = $383;
            } else {
                var $384 = VoxBox$Draw$line$coords$low$(_x0$1, _y0$2, _x1$3, _y1$4);
                var $382 = $384;
            };
            var $381 = $382;
        } else {
            var self = (_y0$2 > _y1$4);
            if (self) {
                var $386 = VoxBox$Draw$line$coords$high$(_x1$3, _y1$4, _x0$1, _y0$2);
                var $385 = $386;
            } else {
                var $387 = VoxBox$Draw$line$coords$high$(_x0$1, _y0$2, _x1$3, _y1$4);
                var $385 = $387;
            };
            var $381 = $385;
        };
        return $381;
    };
    const VoxBox$Draw$line$coords = x0 => x1 => x2 => x3 => VoxBox$Draw$line$coords$(x0, x1, x2, x3);
    const List$for = a0 => a1 => a2 => (list_for(a0)(a1)(a2));

    function Word$trim$(_new_size$2, _word$3) {
        var self = _new_size$2;
        if (self === 0n) {
            var $389 = Word$e;
            var $388 = $389;
        } else {
            var $390 = (self - 1n);
            var self = _word$3;
            switch (self._) {
                case 'Word.o':
                    var $392 = self.pred;
                    var $393 = Word$o$(Word$trim$($390, $392));
                    var $391 = $393;
                    break;
                case 'Word.i':
                    var $394 = self.pred;
                    var $395 = Word$i$(Word$trim$($390, $394));
                    var $391 = $395;
                    break;
                case 'Word.e':
                    var $396 = Word$o$(Word$trim$($390, Word$e));
                    var $391 = $396;
                    break;
            };
            var $388 = $391;
        };
        return $388;
    };
    const Word$trim = x0 => x1 => Word$trim$(x0, x1);
    const Unit$new = null;

    function Array$extract_tip$(_arr$2) {
        var self = _arr$2;
        switch (self._) {
            case 'Array.tip':
                var $398 = self.value;
                var $399 = $398;
                var $397 = $399;
                break;
            case 'Array.tie':
                var $400 = Unit$new;
                var $397 = $400;
                break;
        };
        return $397;
    };
    const Array$extract_tip = x0 => Array$extract_tip$(x0);

    function Array$extract_tie$(_arr$3) {
        var self = _arr$3;
        switch (self._) {
            case 'Array.tie':
                var $402 = self.lft;
                var $403 = self.rgt;
                var $404 = Pair$new$($402, $403);
                var $401 = $404;
                break;
            case 'Array.tip':
                var $405 = Unit$new;
                var $401 = $405;
                break;
        };
        return $401;
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
                        var $406 = self.pred;
                        var $407 = Word$foldl$(_w0$4(_nil$3), _w0$4, _w1$5, $406);
                        return $407;
                    case 'Word.i':
                        var $408 = self.pred;
                        var $409 = Word$foldl$(_w1$5(_nil$3), _w0$4, _w1$5, $408);
                        return $409;
                    case 'Word.e':
                        var $410 = _nil$3;
                        return $410;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Word$foldl = x0 => x1 => x2 => x3 => Word$foldl$(x0, x1, x2, x3);

    function Array$mut$(_idx$3, _f$4, _arr$5) {
        var $411 = Word$foldl$((_arr$6 => {
            var $412 = Array$tip$(_f$4(Array$extract_tip$(_arr$6)));
            return $412;
        }), (_rec$7 => _arr$8 => {
            var self = Array$extract_tie$(_arr$8);
            switch (self._) {
                case 'Pair.new':
                    var $414 = self.fst;
                    var $415 = self.snd;
                    var $416 = Array$tie$(_rec$7($414), $415);
                    var $413 = $416;
                    break;
            };
            return $413;
        }), (_rec$7 => _arr$8 => {
            var self = Array$extract_tie$(_arr$8);
            switch (self._) {
                case 'Pair.new':
                    var $418 = self.fst;
                    var $419 = self.snd;
                    var $420 = Array$tie$($418, _rec$7($419));
                    var $417 = $420;
                    break;
            };
            return $417;
        }), _idx$3)(_arr$5);
        return $411;
    };
    const Array$mut = x0 => x1 => x2 => Array$mut$(x0, x1, x2);

    function Array$set$(_idx$3, _val$4, _arr$5) {
        var $421 = Array$mut$(_idx$3, (_x$6 => {
            var $422 = _val$4;
            return $422;
        }), _arr$5);
        return $421;
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
                var $424 = self.capacity;
                var $425 = self.buffer;
                var $426 = VoxBox$new$(_length$1, $424, $425);
                var $423 = $426;
                break;
        };
        return $423;
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
        var $427 = (((_n$1) >>> 0));
        return $427;
    };
    const I32$to_u32 = x0 => I32$to_u32$(x0);

    function VoxBox$Draw$line$(_x0$1, _y0$2, _x1$3, _y1$4, _z$5, _col$6, _img$7) {
        var _coords$8 = VoxBox$Draw$line$coords$(_x0$1, _y0$2, _x1$3, _y1$4);
        var _img$9 = (() => {
            var $430 = _img$7;
            var $431 = _coords$8;
            let _img$10 = $430;
            let _coord$9;
            while ($431._ === 'List.cons') {
                _coord$9 = $431.head;
                var self = _coord$9;
                switch (self._) {
                    case 'Pair.new':
                        var $432 = self.fst;
                        var $433 = self.snd;
                        var $434 = ((_img$10.buffer[_img$10.length * 2] = ((0 | I32$to_u32$($432) | (I32$to_u32$($433) << 12) | (I32$to_u32$(_z$5) << 24))), _img$10.buffer[_img$10.length * 2 + 1] = _col$6, _img$10.length++, _img$10));
                        var $430 = $434;
                        break;
                };
                _img$10 = $430;
                $431 = $431.tail;
            }
            return _img$10;
        })();
        var $428 = _img$9;
        return $428;
    };
    const VoxBox$Draw$line = x0 => x1 => x2 => x3 => x4 => x5 => x6 => VoxBox$Draw$line$(x0, x1, x2, x3, x4, x5, x6);
    const Col32$new = a0 => a1 => a2 => a3 => ((0 | a0 | (a1 << 8) | (a2 << 16) | (a3 << 24)));

    function App$TicTacToe$draw_vertical_lines$(_img$1) {
        var _init$2 = ((side_board / 3) >> 0);
        var _void$3 = ((side_board / 12) >> 0);
        var _img$4 = VoxBox$Draw$line$(_init$2, _void$3, _init$2, ((side_board - _void$3) >> 0), 0, ((0 | 0 | (0 << 8) | (0 << 16) | (255 << 24))), _img$1);
        var $435 = VoxBox$Draw$line$(((side_board - _init$2) >> 0), _void$3, ((side_board - _init$2) >> 0), ((side_board - _void$3) >> 0), 0, ((0 | 0 | (0 << 8) | (0 << 16) | (255 << 24))), _img$4);
        return $435;
    };
    const App$TicTacToe$draw_vertical_lines = x0 => App$TicTacToe$draw_vertical_lines$(x0);

    function App$TicTacToe$draw_horizontal_lines$(_img$1) {
        var _init$2 = ((side_board / 12) >> 0);
        var _void$3 = ((side_board / 3) >> 0);
        var _img$4 = VoxBox$Draw$line$(_init$2, _void$3, ((side_board - _init$2) >> 0), _void$3, 0, ((0 | 0 | (0 << 8) | (0 << 16) | (255 << 24))), _img$1);
        var $436 = VoxBox$Draw$line$(_init$2, ((side_board - _void$3) >> 0), ((side_board - _init$2) >> 0), ((side_board - _void$3) >> 0), 0, ((0 | 0 | (0 << 8) | (0 << 16) | (255 << 24))), _img$4);
        return $436;
    };
    const App$TicTacToe$draw_horizontal_lines = x0 => App$TicTacToe$draw_horizontal_lines$(x0);

    function DOM$vbox$(_props$1, _style$2, _value$3) {
        var $437 = ({
            _: 'DOM.vbox',
            'props': _props$1,
            'style': _style$2,
            'value': _value$3
        });
        return $437;
    };
    const DOM$vbox = x0 => x1 => x2 => DOM$vbox$(x0, x1, x2);

    function BitsMap$(_A$1) {
        var $438 = null;
        return $438;
    };
    const BitsMap = x0 => BitsMap$(x0);

    function Map$(_V$1) {
        var $439 = null;
        return $439;
    };
    const Map = x0 => Map$(x0);
    const BitsMap$new = ({
        _: 'BitsMap.new'
    });

    function BitsMap$tie$(_val$2, _lft$3, _rgt$4) {
        var $440 = ({
            _: 'BitsMap.tie',
            'val': _val$2,
            'lft': _lft$3,
            'rgt': _rgt$4
        });
        return $440;
    };
    const BitsMap$tie = x0 => x1 => x2 => BitsMap$tie$(x0, x1, x2);

    function Maybe$some$(_value$2) {
        var $441 = ({
            _: 'Maybe.some',
            'value': _value$2
        });
        return $441;
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
                var $443 = self.pred;
                var $444 = (Word$to_bits$($443) + '0');
                var $442 = $444;
                break;
            case 'Word.i':
                var $445 = self.pred;
                var $446 = (Word$to_bits$($445) + '1');
                var $442 = $446;
                break;
            case 'Word.e':
                var $447 = Bits$e;
                var $442 = $447;
                break;
        };
        return $442;
    };
    const Word$to_bits = x0 => Word$to_bits$(x0);
    const U16$to_bits = a0 => (u16_to_bits(a0));

    function String$to_bits$(_str$1) {
        var self = _str$1;
        if (self.length === 0) {
            var $449 = Bits$e;
            var $448 = $449;
        } else {
            var $450 = self.charCodeAt(0);
            var $451 = self.slice(1);
            var $452 = (String$to_bits$($451) + (u16_to_bits($450)));
            var $448 = $452;
        };
        return $448;
    };
    const String$to_bits = x0 => String$to_bits$(x0);

    function Map$from_list$(_xs$2) {
        var self = _xs$2;
        switch (self._) {
            case 'List.cons':
                var $454 = self.head;
                var $455 = self.tail;
                var self = $454;
                switch (self._) {
                    case 'Pair.new':
                        var $457 = self.fst;
                        var $458 = self.snd;
                        var $459 = (bitsmap_set(String$to_bits$($457), $458, Map$from_list$($455), 'set'));
                        var $456 = $459;
                        break;
                };
                var $453 = $456;
                break;
            case 'List.nil':
                var $460 = BitsMap$new;
                var $453 = $460;
                break;
        };
        return $453;
    };
    const Map$from_list = x0 => Map$from_list$(x0);

    function App$TicTacToe$draw$(_img$1, _state$2) {
        var _img$3 = App$TicTacToe$draw_vertical_lines$(_img$1);
        var _img$4 = App$TicTacToe$draw_horizontal_lines$(_img$3);
        var $461 = DOM$vbox$(Map$from_list$(List$nil), Map$from_list$(List$nil), _img$4);
        return $461;
    };
    const App$TicTacToe$draw = x0 => x1 => App$TicTacToe$draw$(x0, x1);

    function IO$(_A$1) {
        var $462 = null;
        return $462;
    };
    const IO = x0 => IO$(x0);

    function Maybe$(_A$1) {
        var $463 = null;
        return $463;
    };
    const Maybe = x0 => Maybe$(x0);

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

    function String$cons$(_head$1, _tail$2) {
        var $481 = (String.fromCharCode(_head$1) + _tail$2);
        return $481;
    };
    const String$cons = x0 => x1 => String$cons$(x0, x1);
    const String$concat = a0 => a1 => (a0 + a1);

    function Pair$shows$(_show_a$3, _show_b$4, _pair$5) {
        var self = _pair$5;
        switch (self._) {
            case 'Pair.new':
                var $483 = self.fst;
                var $484 = self.snd;
                var $485 = (_show_a$3($483) + (" " + _show_b$4($484)));
                var $482 = $485;
                break;
        };
        return $482;
    };
    const Pair$shows = x0 => x1 => x2 => Pair$shows$(x0, x1, x2);

    function List$fold$(_list$2, _nil$4, _cons$5) {
        var self = _list$2;
        switch (self._) {
            case 'List.cons':
                var $487 = self.head;
                var $488 = self.tail;
                var $489 = _cons$5($487)(List$fold$($488, _nil$4, _cons$5));
                var $486 = $489;
                break;
            case 'List.nil':
                var $490 = _nil$4;
                var $486 = $490;
                break;
        };
        return $486;
    };
    const List$fold = x0 => x1 => x2 => List$fold$(x0, x1, x2);

    function Either$(_A$1, _B$2) {
        var $491 = null;
        return $491;
    };
    const Either = x0 => x1 => Either$(x0, x1);

    function Either$left$(_value$3) {
        var $492 = ({
            _: 'Either.left',
            'value': _value$3
        });
        return $492;
    };
    const Either$left = x0 => Either$left$(x0);

    function Either$right$(_value$3) {
        var $493 = ({
            _: 'Either.right',
            'value': _value$3
        });
        return $493;
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
                    var $494 = Either$left$(_n$1);
                    return $494;
                } else {
                    var $495 = (self - 1n);
                    var self = _n$1;
                    if (self === 0n) {
                        var $497 = Either$right$(Nat$succ$($495));
                        var $496 = $497;
                    } else {
                        var $498 = (self - 1n);
                        var $499 = Nat$sub_rem$($498, $495);
                        var $496 = $499;
                    };
                    return $496;
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
                        var $500 = self.value;
                        var $501 = Nat$div_mod$go$($500, _m$2, Nat$succ$(_d$3));
                        return $501;
                    case 'Either.right':
                        var $502 = Pair$new$(_d$3, _n$1);
                        return $502;
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
                        var $503 = self.fst;
                        var $504 = self.snd;
                        var self = $503;
                        if (self === 0n) {
                            var $506 = List$cons$($504, _res$3);
                            var $505 = $506;
                        } else {
                            var $507 = (self - 1n);
                            var $508 = Nat$to_base$go$(_base$1, $503, List$cons$($504, _res$3));
                            var $505 = $508;
                        };
                        return $505;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Nat$to_base$go = x0 => x1 => x2 => Nat$to_base$go$(x0, x1, x2);

    function Nat$to_base$(_base$1, _nat$2) {
        var $509 = Nat$to_base$go$(_base$1, _nat$2, List$nil);
        return $509;
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
                    var $510 = Nat$mod$go$(_n$1, _r$3, _m$2);
                    return $510;
                } else {
                    var $511 = (self - 1n);
                    var self = _n$1;
                    if (self === 0n) {
                        var $513 = _r$3;
                        var $512 = $513;
                    } else {
                        var $514 = (self - 1n);
                        var $515 = Nat$mod$go$($514, $511, Nat$succ$(_r$3));
                        var $512 = $515;
                    };
                    return $512;
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
                        var $516 = self.head;
                        var $517 = self.tail;
                        var self = _index$2;
                        if (self === 0n) {
                            var $519 = Maybe$some$($516);
                            var $518 = $519;
                        } else {
                            var $520 = (self - 1n);
                            var $521 = List$at$($520, $517);
                            var $518 = $521;
                        };
                        return $518;
                    case 'List.nil':
                        var $522 = Maybe$none;
                        return $522;
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
                    var $525 = self.value;
                    var $526 = $525;
                    var $524 = $526;
                    break;
                case 'Maybe.none':
                    var $527 = 35;
                    var $524 = $527;
                    break;
            };
            var $523 = $524;
        } else {
            var $528 = 35;
            var $523 = $528;
        };
        return $523;
    };
    const Nat$show_digit = x0 => x1 => Nat$show_digit$(x0, x1);

    function Nat$to_string_base$(_base$1, _nat$2) {
        var $529 = List$fold$(Nat$to_base$(_base$1, _nat$2), String$nil, (_n$3 => _str$4 => {
            var $530 = String$cons$(Nat$show_digit$(_base$1, _n$3), _str$4);
            return $530;
        }));
        return $529;
    };
    const Nat$to_string_base = x0 => x1 => Nat$to_string_base$(x0, x1);

    function Nat$show$(_n$1) {
        var $531 = Nat$to_string_base$(10n, _n$1);
        return $531;
    };
    const Nat$show = x0 => Nat$show$(x0);

    function Word$show$(_size$1, _a$2) {
        var _n$3 = Word$to_nat$(_a$2);
        var $532 = (Nat$show$(_n$3) + ("#" + Nat$show$(_size$1)));
        return $532;
    };
    const Word$show = x0 => x1 => Word$show$(x0, x1);
    const U32$show = a0 => (a0 + "#32");
    const Debug$log = a0 => a1 => ((console.log(a0), a1()));

    function App$TicTacToe$when$(_event$1, _state$2) {
        var self = _event$1;
        switch (self._) {
            case 'App.Event.frame':
                var $534 = self.info;
                var self = _state$2;
                switch (self._) {
                    case 'App.Store.new':
                        var $536 = self.local;
                        var $537 = App$set_local$((() => {
                            var self = $536;
                            switch (self._) {
                                case 'App.TicTacToe.State.local.new':
                                    var $538 = App$TicTacToe$State$local$new$($534);
                                    return $538;
                            };
                        })());
                        var $535 = $537;
                        break;
                };
                var $533 = $535;
                break;
            case 'App.Event.init':
            case 'App.Event.mouse_down':
            case 'App.Event.key_down':
            case 'App.Event.key_up':
            case 'App.Event.mouse_over':
            case 'App.Event.mouse_click':
            case 'App.Event.input':
                var $539 = App$pass;
                var $533 = $539;
                break;
            case 'App.Event.mouse_up':
                var self = _state$2;
                switch (self._) {
                    case 'App.Store.new':
                        var $541 = self.local;
                        var self = $541;
                        switch (self._) {
                            case 'App.TicTacToe.State.local.new':
                                var $543 = self.info;
                                var $544 = $543;
                                var _info$7 = $544;
                                break;
                        };
                        var self = _info$7;
                        switch (self._) {
                            case 'App.EnvInfo.new':
                                var $545 = self.mouse_pos;
                                var _k$10 = Pair$shows$(U32$show, U32$show, $545);
                                var $546 = ((console.log(_k$10), (_$11 => {
                                    var $547 = App$pass;
                                    return $547;
                                })()));
                                var $542 = $546;
                                break;
                        };
                        var $540 = $542;
                        break;
                };
                var $533 = $540;
                break;
        };
        return $533;
    };
    const App$TicTacToe$when = x0 => x1 => App$TicTacToe$when$(x0, x1);

    function App$TicTacToe$tick$(_tick$1, _glob$2) {
        var $548 = _glob$2;
        return $548;
    };
    const App$TicTacToe$tick = x0 => x1 => App$TicTacToe$tick$(x0, x1);

    function App$TicTacToe$post$(_time$1, _room$2, _addr$3, _data$4, _glob$5) {
        var $549 = _glob$5;
        return $549;
    };
    const App$TicTacToe$post = x0 => x1 => x2 => x3 => x4 => App$TicTacToe$post$(x0, x1, x2, x3, x4);

    function App$new$(_init$2, _draw$3, _when$4, _tick$5, _post$6) {
        var $550 = ({
            _: 'App.new',
            'init': _init$2,
            'draw': _draw$3,
            'when': _when$4,
            'tick': _tick$5,
            'post': _post$6
        });
        return $550;
    };
    const App$new = x0 => x1 => x2 => x3 => x4 => App$new$(x0, x1, x2, x3, x4);
    const App$TicTacToe = (() => {
        var _img$1 = VoxBox$alloc_capacity$(((65536 * 8) >>> 0));
        var _init$2 = App$TicTacToe$init;
        var _draw$3 = App$TicTacToe$draw(_img$1);
        var _when$4 = App$TicTacToe$when;
        var _tick$5 = App$TicTacToe$tick;
        var _post$6 = App$TicTacToe$post;
        var $551 = App$new$(_init$2, _draw$3, _when$4, _tick$5, _post$6);
        return $551;
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
        'App.EnvInfo.new': App$EnvInfo$new,
        'U32.from_nat': U32$from_nat,
        'App.TicTacToe.State.global.new': App$TicTacToe$State$global$new,
        'Vector': Vector,
        'Vector.nil': Vector$nil,
        'Vector.ext': Vector$ext,
        'Vector.fill': Vector$fill,
        'App.TicTacToe.Entity.Empty': App$TicTacToe$Entity$Empty,
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
        'Word.neg.aux': Word$neg$aux,
        'Word.neg': Word$neg,
        'I32.neg': I32$neg,
        'Int.to_i32': Int$to_i32,
        'Int.new': Int$new,
        'Int.from_nat': Int$from_nat,
        'I32.from_nat': I32$from_nat,
        'App.TicTacToe.constant.size': App$TicTacToe$constant$size,
        'side_board': side_board,
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
        'App.TicTacToe.draw': App$TicTacToe$draw,
        'IO': IO,
        'Maybe': Maybe,
        'Pair.fst': Pair$fst,
        'App.State.local': App$State$local,
        'IO.ask': IO$ask,
        'IO.bind': IO$bind,
        'IO.end': IO$end,
        'IO.monad': IO$monad,
        'App.pass': App$pass,
        'App.set_local': App$set_local,
        'String.cons': String$cons,
        'String.concat': String$concat,
        'Pair.shows': Pair$shows,
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
        'Debug.log': Debug$log,
        'App.TicTacToe.when': App$TicTacToe$when,
        'App.TicTacToe.tick': App$TicTacToe$tick,
        'App.TicTacToe.post': App$TicTacToe$post,
        'App.new': App$new,
        'App.TicTacToe': App$TicTacToe,
    };
})();