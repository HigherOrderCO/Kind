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
                var $2 = c2;
                return $2;
            } else {
                var $3 = c2;
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
                var $5 = c2;
                return $5;
            } else {
                var $6 = (self - 1n);
                var $7 = c2($6);
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
                var $34 = c2;
                return $34;
            } else {
                var $35 = self.charCodeAt(0);
                var $36 = self.slice(1);
                var $37 = c2($35)($36);
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

    function Word$shift_left1$aux$(_word$2, _prev$3) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $70 = self.pred;
                var self = _prev$3;
                if (self) {
                    var $72 = Word$i$(Word$shift_left1$aux$($70, Bool$false));
                    var $71 = $72;
                } else {
                    var $73 = Word$o$(Word$shift_left1$aux$($70, Bool$false));
                    var $71 = $73;
                };
                var $69 = $71;
                break;
            case 'Word.i':
                var $74 = self.pred;
                var self = _prev$3;
                if (self) {
                    var $76 = Word$i$(Word$shift_left1$aux$($74, Bool$true));
                    var $75 = $76;
                } else {
                    var $77 = Word$o$(Word$shift_left1$aux$($74, Bool$true));
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
    const Word$shift_left1$aux = x0 => x1 => Word$shift_left1$aux$(x0, x1);

    function Word$shift_left1$(_word$2) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $80 = self.pred;
                var $81 = Word$o$(Word$shift_left1$aux$($80, Bool$false));
                var $79 = $81;
                break;
            case 'Word.i':
                var $82 = self.pred;
                var $83 = Word$o$(Word$shift_left1$aux$($82, Bool$true));
                var $79 = $83;
                break;
            case 'Word.e':
                var $84 = Word$e;
                var $79 = $84;
                break;
        };
        return $79;
    };
    const Word$shift_left1 = x0 => Word$shift_left1$(x0);

    function Word$adder$(_a$2, _b$3, _c$4) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $86 = self.pred;
                var $87 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $89 = self.pred;
                            var $90 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $92 = Word$i$(Word$adder$(_a$pred$10, $89, Bool$false));
                                    var $91 = $92;
                                } else {
                                    var $93 = Word$o$(Word$adder$(_a$pred$10, $89, Bool$false));
                                    var $91 = $93;
                                };
                                return $91;
                            });
                            var $88 = $90;
                            break;
                        case 'Word.i':
                            var $94 = self.pred;
                            var $95 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $97 = Word$o$(Word$adder$(_a$pred$10, $94, Bool$true));
                                    var $96 = $97;
                                } else {
                                    var $98 = Word$i$(Word$adder$(_a$pred$10, $94, Bool$false));
                                    var $96 = $98;
                                };
                                return $96;
                            });
                            var $88 = $95;
                            break;
                        case 'Word.e':
                            var $99 = (_a$pred$8 => {
                                var $100 = Word$e;
                                return $100;
                            });
                            var $88 = $99;
                            break;
                    };
                    var $88 = $88($86);
                    return $88;
                });
                var $85 = $87;
                break;
            case 'Word.i':
                var $101 = self.pred;
                var $102 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $104 = self.pred;
                            var $105 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $107 = Word$o$(Word$adder$(_a$pred$10, $104, Bool$true));
                                    var $106 = $107;
                                } else {
                                    var $108 = Word$i$(Word$adder$(_a$pred$10, $104, Bool$false));
                                    var $106 = $108;
                                };
                                return $106;
                            });
                            var $103 = $105;
                            break;
                        case 'Word.i':
                            var $109 = self.pred;
                            var $110 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $112 = Word$i$(Word$adder$(_a$pred$10, $109, Bool$true));
                                    var $111 = $112;
                                } else {
                                    var $113 = Word$o$(Word$adder$(_a$pred$10, $109, Bool$true));
                                    var $111 = $113;
                                };
                                return $111;
                            });
                            var $103 = $110;
                            break;
                        case 'Word.e':
                            var $114 = (_a$pred$8 => {
                                var $115 = Word$e;
                                return $115;
                            });
                            var $103 = $114;
                            break;
                    };
                    var $103 = $103($101);
                    return $103;
                });
                var $85 = $102;
                break;
            case 'Word.e':
                var $116 = (_b$5 => {
                    var $117 = Word$e;
                    return $117;
                });
                var $85 = $116;
                break;
        };
        var $85 = $85(_b$3);
        return $85;
    };
    const Word$adder = x0 => x1 => x2 => Word$adder$(x0, x1, x2);

    function Word$add$(_a$2, _b$3) {
        var $118 = Word$adder$(_a$2, _b$3, Bool$false);
        return $118;
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
                        var $119 = self.pred;
                        var $120 = Word$mul$go$($119, Word$shift_left1$(_b$4), _acc$5);
                        return $120;
                    case 'Word.i':
                        var $121 = self.pred;
                        var $122 = Word$mul$go$($121, Word$shift_left1$(_b$4), Word$add$(_b$4, _acc$5));
                        return $122;
                    case 'Word.e':
                        var $123 = _acc$5;
                        return $123;
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
                var $125 = self.pred;
                var $126 = Word$o$(Word$to_zero$($125));
                var $124 = $126;
                break;
            case 'Word.i':
                var $127 = self.pred;
                var $128 = Word$o$(Word$to_zero$($127));
                var $124 = $128;
                break;
            case 'Word.e':
                var $129 = Word$e;
                var $124 = $129;
                break;
        };
        return $124;
    };
    const Word$to_zero = x0 => Word$to_zero$(x0);

    function Word$mul$(_a$2, _b$3) {
        var $130 = Word$mul$go$(_a$2, _b$3, Word$to_zero$(_a$2));
        return $130;
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
                    var $131 = _x$4;
                    return $131;
                } else {
                    var $132 = (self - 1n);
                    var $133 = Nat$apply$($132, _f$3, _f$3(_x$4));
                    return $133;
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
                var $135 = self.pred;
                var $136 = Word$i$($135);
                var $134 = $136;
                break;
            case 'Word.i':
                var $137 = self.pred;
                var $138 = Word$o$(Word$inc$($137));
                var $134 = $138;
                break;
            case 'Word.e':
                var $139 = Word$e;
                var $134 = $139;
                break;
        };
        return $134;
    };
    const Word$inc = x0 => Word$inc$(x0);

    function Nat$to_word$(_size$1, _n$2) {
        var $140 = Nat$apply$(_n$2, Word$inc, Word$zero$(_size$1));
        return $140;
    };
    const Nat$to_word = x0 => x1 => Nat$to_word$(x0, x1);
    const Nat$to_u32 = a0 => (Number(a0) >>> 0);

    function VoxBox$new$(_length$1, _capacity$2, _buffer$3) {
        var $141 = ({
            _: 'VoxBox.new',
            'length': _length$1,
            'capacity': _capacity$2,
            'buffer': _buffer$3
        });
        return $141;
    };
    const VoxBox$new = x0 => x1 => x2 => VoxBox$new$(x0, x1, x2);

    function VoxBox$alloc_capacity$(_capacity$1) {
        var _buffer$2 = (new Uint32Array(2 ** Number(U32$bit_length$(((2 * _capacity$1) >>> 0)))));
        var $142 = VoxBox$new$(0, _capacity$1, _buffer$2);
        return $142;
    };
    const VoxBox$alloc_capacity = x0 => VoxBox$alloc_capacity$(x0);
    const Web$Kaelin$Constants$room = "0x210000000069";

    function BitsMap$(_A$1) {
        var $143 = null;
        return $143;
    };
    const BitsMap = x0 => BitsMap$(x0);

    function Map$(_V$1) {
        var $144 = null;
        return $144;
    };
    const Map = x0 => Map$(x0);
    const BitsMap$new = ({
        _: 'BitsMap.new'
    });

    function BitsMap$tie$(_val$2, _lft$3, _rgt$4) {
        var $145 = ({
            _: 'BitsMap.tie',
            'val': _val$2,
            'lft': _lft$3,
            'rgt': _rgt$4
        });
        return $145;
    };
    const BitsMap$tie = x0 => x1 => x2 => BitsMap$tie$(x0, x1, x2);

    function Maybe$some$(_value$2) {
        var $146 = ({
            _: 'Maybe.some',
            'value': _value$2
        });
        return $146;
    };
    const Maybe$some = x0 => Maybe$some$(x0);
    const Maybe$none = ({
        _: 'Maybe.none'
    });

    function BitsMap$set$(_bits$2, _val$3, _map$4) {
        var self = _bits$2;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'o':
                var $148 = self.slice(0, -1);
                var self = _map$4;
                switch (self._) {
                    case 'BitsMap.tie':
                        var $150 = self.val;
                        var $151 = self.lft;
                        var $152 = self.rgt;
                        var $153 = BitsMap$tie$($150, BitsMap$set$($148, _val$3, $151), $152);
                        var $149 = $153;
                        break;
                    case 'BitsMap.new':
                        var $154 = BitsMap$tie$(Maybe$none, BitsMap$set$($148, _val$3, BitsMap$new), BitsMap$new);
                        var $149 = $154;
                        break;
                };
                var $147 = $149;
                break;
            case 'i':
                var $155 = self.slice(0, -1);
                var self = _map$4;
                switch (self._) {
                    case 'BitsMap.tie':
                        var $157 = self.val;
                        var $158 = self.lft;
                        var $159 = self.rgt;
                        var $160 = BitsMap$tie$($157, $158, BitsMap$set$($155, _val$3, $159));
                        var $156 = $160;
                        break;
                    case 'BitsMap.new':
                        var $161 = BitsMap$tie$(Maybe$none, BitsMap$new, BitsMap$set$($155, _val$3, BitsMap$new));
                        var $156 = $161;
                        break;
                };
                var $147 = $156;
                break;
            case 'e':
                var self = _map$4;
                switch (self._) {
                    case 'BitsMap.tie':
                        var $163 = self.lft;
                        var $164 = self.rgt;
                        var $165 = BitsMap$tie$(Maybe$some$(_val$3), $163, $164);
                        var $162 = $165;
                        break;
                    case 'BitsMap.new':
                        var $166 = BitsMap$tie$(Maybe$some$(_val$3), BitsMap$new, BitsMap$new);
                        var $162 = $166;
                        break;
                };
                var $147 = $162;
                break;
        };
        return $147;
    };
    const BitsMap$set = x0 => x1 => x2 => BitsMap$set$(x0, x1, x2);
    const Bits$e = '';
    const Bits$o = a0 => (a0 + '0');
    const Bits$i = a0 => (a0 + '1');
    const Bits$concat = a0 => a1 => (a1 + a0);

    function Word$to_bits$(_a$2) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $168 = self.pred;
                var $169 = (Word$to_bits$($168) + '0');
                var $167 = $169;
                break;
            case 'Word.i':
                var $170 = self.pred;
                var $171 = (Word$to_bits$($170) + '1');
                var $167 = $171;
                break;
            case 'Word.e':
                var $172 = Bits$e;
                var $167 = $172;
                break;
        };
        return $167;
    };
    const Word$to_bits = x0 => Word$to_bits$(x0);
    const U16$to_bits = a0 => (u16_to_bits(a0));

    function String$to_bits$(_str$1) {
        var self = _str$1;
        if (self.length === 0) {
            var $174 = Bits$e;
            var $173 = $174;
        } else {
            var $175 = self.charCodeAt(0);
            var $176 = self.slice(1);
            var $177 = (String$to_bits$($176) + (u16_to_bits($175)));
            var $173 = $177;
        };
        return $173;
    };
    const String$to_bits = x0 => String$to_bits$(x0);

    function Map$from_list$(_xs$2) {
        var self = _xs$2;
        switch (self._) {
            case 'List.cons':
                var $179 = self.head;
                var $180 = self.tail;
                var self = $179;
                switch (self._) {
                    case 'Pair.new':
                        var $182 = self.fst;
                        var $183 = self.snd;
                        var $184 = BitsMap$set$(String$to_bits$($182), $183, Map$from_list$($180));
                        var $181 = $184;
                        break;
                };
                var $178 = $181;
                break;
            case 'List.nil':
                var $185 = BitsMap$new;
                var $178 = $185;
                break;
        };
        return $178;
    };
    const Map$from_list = x0 => Map$from_list$(x0);
    const List$nil = ({
        _: 'List.nil'
    });

    function Pair$(_A$1, _B$2) {
        var $186 = null;
        return $186;
    };
    const Pair = x0 => x1 => Pair$(x0, x1);

    function Web$Kaelin$Coord$new$(_i$1, _j$2) {
        var $187 = ({
            _: 'Web.Kaelin.Coord.new',
            'i': _i$1,
            'j': _j$2
        });
        return $187;
    };
    const Web$Kaelin$Coord$new = x0 => x1 => Web$Kaelin$Coord$new$(x0, x1);

    function Web$Kaelin$Entity$creature$(_player$1, _hero$2) {
        var $188 = ({
            _: 'Web.Kaelin.Entity.creature',
            'player': _player$1,
            'hero': _hero$2
        });
        return $188;
    };
    const Web$Kaelin$Entity$creature = x0 => x1 => Web$Kaelin$Entity$creature$(x0, x1);

    function Web$Kaelin$Hero$new$(_id$1, _img$2) {
        var $189 = ({
            _: 'Web.Kaelin.Hero.new',
            'id': _id$1,
            'img': _img$2
        });
        return $189;
    };
    const Web$Kaelin$Hero$new = x0 => x1 => Web$Kaelin$Hero$new$(x0, x1);
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
                    var $190 = _value$3;
                    return $190;
                } else {
                    var $191 = (self - 1n);
                    var $192 = Word$shift_left$($191, Word$shift_left1$(_value$3));
                    return $192;
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
                var $194 = Bool$false;
                var $193 = $194;
                break;
            case 'Cmp.eql':
            case 'Cmp.gtn':
                var $195 = Bool$true;
                var $193 = $195;
                break;
        };
        return $193;
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
                var $197 = self.pred;
                var $198 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $200 = self.pred;
                            var $201 = (_a$pred$10 => {
                                var $202 = Word$cmp$go$(_a$pred$10, $200, _c$4);
                                return $202;
                            });
                            var $199 = $201;
                            break;
                        case 'Word.i':
                            var $203 = self.pred;
                            var $204 = (_a$pred$10 => {
                                var $205 = Word$cmp$go$(_a$pred$10, $203, Cmp$ltn);
                                return $205;
                            });
                            var $199 = $204;
                            break;
                        case 'Word.e':
                            var $206 = (_a$pred$8 => {
                                var $207 = _c$4;
                                return $207;
                            });
                            var $199 = $206;
                            break;
                    };
                    var $199 = $199($197);
                    return $199;
                });
                var $196 = $198;
                break;
            case 'Word.i':
                var $208 = self.pred;
                var $209 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $211 = self.pred;
                            var $212 = (_a$pred$10 => {
                                var $213 = Word$cmp$go$(_a$pred$10, $211, Cmp$gtn);
                                return $213;
                            });
                            var $210 = $212;
                            break;
                        case 'Word.i':
                            var $214 = self.pred;
                            var $215 = (_a$pred$10 => {
                                var $216 = Word$cmp$go$(_a$pred$10, $214, _c$4);
                                return $216;
                            });
                            var $210 = $215;
                            break;
                        case 'Word.e':
                            var $217 = (_a$pred$8 => {
                                var $218 = _c$4;
                                return $218;
                            });
                            var $210 = $217;
                            break;
                    };
                    var $210 = $210($208);
                    return $210;
                });
                var $196 = $209;
                break;
            case 'Word.e':
                var $219 = (_b$5 => {
                    var $220 = _c$4;
                    return $220;
                });
                var $196 = $219;
                break;
        };
        var $196 = $196(_b$3);
        return $196;
    };
    const Word$cmp$go = x0 => x1 => x2 => Word$cmp$go$(x0, x1, x2);
    const Cmp$eql = ({
        _: 'Cmp.eql'
    });

    function Word$cmp$(_a$2, _b$3) {
        var $221 = Word$cmp$go$(_a$2, _b$3, Cmp$eql);
        return $221;
    };
    const Word$cmp = x0 => x1 => Word$cmp$(x0, x1);

    function Word$gte$(_a$2, _b$3) {
        var $222 = Cmp$as_gte$(Word$cmp$(_a$2, _b$3));
        return $222;
    };
    const Word$gte = x0 => x1 => Word$gte$(x0, x1);

    function Pair$new$(_fst$3, _snd$4) {
        var $223 = ({
            _: 'Pair.new',
            'fst': _fst$3,
            'snd': _snd$4
        });
        return $223;
    };
    const Pair$new = x0 => x1 => Pair$new$(x0, x1);

    function Word$or$(_a$2, _b$3) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $225 = self.pred;
                var $226 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $228 = self.pred;
                            var $229 = (_a$pred$9 => {
                                var $230 = Word$o$(Word$or$(_a$pred$9, $228));
                                return $230;
                            });
                            var $227 = $229;
                            break;
                        case 'Word.i':
                            var $231 = self.pred;
                            var $232 = (_a$pred$9 => {
                                var $233 = Word$i$(Word$or$(_a$pred$9, $231));
                                return $233;
                            });
                            var $227 = $232;
                            break;
                        case 'Word.e':
                            var $234 = (_a$pred$7 => {
                                var $235 = Word$e;
                                return $235;
                            });
                            var $227 = $234;
                            break;
                    };
                    var $227 = $227($225);
                    return $227;
                });
                var $224 = $226;
                break;
            case 'Word.i':
                var $236 = self.pred;
                var $237 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $239 = self.pred;
                            var $240 = (_a$pred$9 => {
                                var $241 = Word$i$(Word$or$(_a$pred$9, $239));
                                return $241;
                            });
                            var $238 = $240;
                            break;
                        case 'Word.i':
                            var $242 = self.pred;
                            var $243 = (_a$pred$9 => {
                                var $244 = Word$i$(Word$or$(_a$pred$9, $242));
                                return $244;
                            });
                            var $238 = $243;
                            break;
                        case 'Word.e':
                            var $245 = (_a$pred$7 => {
                                var $246 = Word$e;
                                return $246;
                            });
                            var $238 = $245;
                            break;
                    };
                    var $238 = $238($236);
                    return $238;
                });
                var $224 = $237;
                break;
            case 'Word.e':
                var $247 = (_b$4 => {
                    var $248 = Word$e;
                    return $248;
                });
                var $224 = $247;
                break;
        };
        var $224 = $224(_b$3);
        return $224;
    };
    const Word$or = x0 => x1 => Word$or$(x0, x1);

    function Word$shift_right1$aux$(_word$2) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $250 = self.pred;
                var $251 = Word$o$(Word$shift_right1$aux$($250));
                var $249 = $251;
                break;
            case 'Word.i':
                var $252 = self.pred;
                var $253 = Word$i$(Word$shift_right1$aux$($252));
                var $249 = $253;
                break;
            case 'Word.e':
                var $254 = Word$o$(Word$e);
                var $249 = $254;
                break;
        };
        return $249;
    };
    const Word$shift_right1$aux = x0 => Word$shift_right1$aux$(x0);

    function Word$shift_right1$(_word$2) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $256 = self.pred;
                var $257 = Word$shift_right1$aux$($256);
                var $255 = $257;
                break;
            case 'Word.i':
                var $258 = self.pred;
                var $259 = Word$shift_right1$aux$($258);
                var $255 = $259;
                break;
            case 'Word.e':
                var $260 = Word$e;
                var $255 = $260;
                break;
        };
        return $255;
    };
    const Word$shift_right1 = x0 => Word$shift_right1$(x0);

    function Word$subber$(_a$2, _b$3, _c$4) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $262 = self.pred;
                var $263 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $265 = self.pred;
                            var $266 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $268 = Word$i$(Word$subber$(_a$pred$10, $265, Bool$true));
                                    var $267 = $268;
                                } else {
                                    var $269 = Word$o$(Word$subber$(_a$pred$10, $265, Bool$false));
                                    var $267 = $269;
                                };
                                return $267;
                            });
                            var $264 = $266;
                            break;
                        case 'Word.i':
                            var $270 = self.pred;
                            var $271 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $273 = Word$o$(Word$subber$(_a$pred$10, $270, Bool$true));
                                    var $272 = $273;
                                } else {
                                    var $274 = Word$i$(Word$subber$(_a$pred$10, $270, Bool$true));
                                    var $272 = $274;
                                };
                                return $272;
                            });
                            var $264 = $271;
                            break;
                        case 'Word.e':
                            var $275 = (_a$pred$8 => {
                                var $276 = Word$e;
                                return $276;
                            });
                            var $264 = $275;
                            break;
                    };
                    var $264 = $264($262);
                    return $264;
                });
                var $261 = $263;
                break;
            case 'Word.i':
                var $277 = self.pred;
                var $278 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $280 = self.pred;
                            var $281 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $283 = Word$o$(Word$subber$(_a$pred$10, $280, Bool$false));
                                    var $282 = $283;
                                } else {
                                    var $284 = Word$i$(Word$subber$(_a$pred$10, $280, Bool$false));
                                    var $282 = $284;
                                };
                                return $282;
                            });
                            var $279 = $281;
                            break;
                        case 'Word.i':
                            var $285 = self.pred;
                            var $286 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $288 = Word$i$(Word$subber$(_a$pred$10, $285, Bool$true));
                                    var $287 = $288;
                                } else {
                                    var $289 = Word$o$(Word$subber$(_a$pred$10, $285, Bool$false));
                                    var $287 = $289;
                                };
                                return $287;
                            });
                            var $279 = $286;
                            break;
                        case 'Word.e':
                            var $290 = (_a$pred$8 => {
                                var $291 = Word$e;
                                return $291;
                            });
                            var $279 = $290;
                            break;
                    };
                    var $279 = $279($277);
                    return $279;
                });
                var $261 = $278;
                break;
            case 'Word.e':
                var $292 = (_b$5 => {
                    var $293 = Word$e;
                    return $293;
                });
                var $261 = $292;
                break;
        };
        var $261 = $261(_b$3);
        return $261;
    };
    const Word$subber = x0 => x1 => x2 => Word$subber$(x0, x1, x2);

    function Word$sub$(_a$2, _b$3) {
        var $294 = Word$subber$(_a$2, _b$3, Bool$false);
        return $294;
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
                    var $295 = Pair$new$(Bool$true, Word$or$(_value$5, _mask$6));
                    var self = $295;
                } else {
                    var $296 = Pair$new$(Bool$false, _value$5);
                    var self = $296;
                };
                switch (self._) {
                    case 'Pair.new':
                        var $297 = self.fst;
                        var $298 = self.snd;
                        var self = _shift$2;
                        if (self === 0n) {
                            var $300 = $298;
                            var $299 = $300;
                        } else {
                            var $301 = (self - 1n);
                            var _new_shift_copy$9 = Word$shift_right1$(_shift_copy$4);
                            var self = $297;
                            if (self) {
                                var $303 = Word$div$go$($301, Word$sub$(_sub_copy$3, _shift_copy$4), _new_shift_copy$9, $298);
                                var $302 = $303;
                            } else {
                                var $304 = Word$div$go$($301, _sub_copy$3, _new_shift_copy$9, $298);
                                var $302 = $304;
                            };
                            var $299 = $302;
                        };
                        return $299;
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
            var $306 = Word$to_zero$(_a$2);
            var $305 = $306;
        } else {
            var _shift$6 = (_a_bits$4 - _b_bits$5 <= 0n ? 0n : _a_bits$4 - _b_bits$5);
            var _shift_copy$7 = Word$shift_left$(_shift$6, _b$3);
            var $307 = Word$div$go$(_shift$6, _a$2, _shift_copy$7, Word$to_zero$(_a$2));
            var $305 = $307;
        };
        return $305;
    };
    const Word$div = x0 => x1 => Word$div$(x0, x1);
    const U32$div = a0 => a1 => ((a0 / a1) >>> 0);
    const U32$length = a0 => ((a0.length) >>> 0);

    function Cmp$as_eql$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
            case 'Cmp.gtn':
                var $309 = Bool$false;
                var $308 = $309;
                break;
            case 'Cmp.eql':
                var $310 = Bool$true;
                var $308 = $310;
                break;
        };
        return $308;
    };
    const Cmp$as_eql = x0 => Cmp$as_eql$(x0);

    function Word$eql$(_a$2, _b$3) {
        var $311 = Cmp$as_eql$(Word$cmp$(_a$2, _b$3));
        return $311;
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
        var $312 = (parseInt(_chr$3, 16));
        return $312;
    };
    const VoxBox$parse_byte = x0 => x1 => VoxBox$parse_byte$(x0, x1);
    const U32$or = a0 => a1 => (a0 | a1);
    const U32$shl = a0 => a1 => ((a0 << a1) >>> 0);
    const Pos32$new = a0 => a1 => a2 => ((0 | a0 | (a1 << 12) | (a2 << 24)));
    const Col32$new = a0 => a1 => a2 => a3 => ((0 | a0 | (a1 << 8) | (a2 << 16) | (a3 << 24)));

    function Word$trim$(_new_size$2, _word$3) {
        var self = _new_size$2;
        if (self === 0n) {
            var $314 = Word$e;
            var $313 = $314;
        } else {
            var $315 = (self - 1n);
            var self = _word$3;
            switch (self._) {
                case 'Word.o':
                    var $317 = self.pred;
                    var $318 = Word$o$(Word$trim$($315, $317));
                    var $316 = $318;
                    break;
                case 'Word.i':
                    var $319 = self.pred;
                    var $320 = Word$i$(Word$trim$($315, $319));
                    var $316 = $320;
                    break;
                case 'Word.e':
                    var $321 = Word$o$(Word$trim$($315, Word$e));
                    var $316 = $321;
                    break;
            };
            var $313 = $316;
        };
        return $313;
    };
    const Word$trim = x0 => x1 => Word$trim$(x0, x1);
    const Unit$new = null;

    function Array$extract_tip$(_arr$2) {
        var self = _arr$2;
        switch (self._) {
            case 'Array.tip':
                var $323 = self.value;
                var $324 = $323;
                var $322 = $324;
                break;
            case 'Array.tie':
                var $325 = Unit$new;
                var $322 = $325;
                break;
        };
        return $322;
    };
    const Array$extract_tip = x0 => Array$extract_tip$(x0);

    function Array$extract_tie$(_arr$3) {
        var self = _arr$3;
        switch (self._) {
            case 'Array.tie':
                var $327 = self.lft;
                var $328 = self.rgt;
                var $329 = Pair$new$($327, $328);
                var $326 = $329;
                break;
            case 'Array.tip':
                var $330 = Unit$new;
                var $326 = $330;
                break;
        };
        return $326;
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
                        var $331 = self.pred;
                        var $332 = Word$foldl$(_w0$4(_nil$3), _w0$4, _w1$5, $331);
                        return $332;
                    case 'Word.i':
                        var $333 = self.pred;
                        var $334 = Word$foldl$(_w1$5(_nil$3), _w0$4, _w1$5, $333);
                        return $334;
                    case 'Word.e':
                        var $335 = _nil$3;
                        return $335;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Word$foldl = x0 => x1 => x2 => x3 => Word$foldl$(x0, x1, x2, x3);

    function Array$mut$(_idx$3, _f$4, _arr$5) {
        var $336 = Word$foldl$((_arr$6 => {
            var $337 = Array$tip$(_f$4(Array$extract_tip$(_arr$6)));
            return $337;
        }), (_rec$7 => _arr$8 => {
            var self = Array$extract_tie$(_arr$8);
            switch (self._) {
                case 'Pair.new':
                    var $339 = self.fst;
                    var $340 = self.snd;
                    var $341 = Array$tie$(_rec$7($339), $340);
                    var $338 = $341;
                    break;
            };
            return $338;
        }), (_rec$7 => _arr$8 => {
            var self = Array$extract_tie$(_arr$8);
            switch (self._) {
                case 'Pair.new':
                    var $343 = self.fst;
                    var $344 = self.snd;
                    var $345 = Array$tie$($343, _rec$7($344));
                    var $342 = $345;
                    break;
            };
            return $342;
        }), _idx$3)(_arr$5);
        return $336;
    };
    const Array$mut = x0 => x1 => x2 => Array$mut$(x0, x1, x2);

    function Array$set$(_idx$3, _val$4, _arr$5) {
        var $346 = Array$mut$(_idx$3, (_x$6 => {
            var $347 = _val$4;
            return $347;
        }), _arr$5);
        return $346;
    };
    const Array$set = x0 => x1 => x2 => Array$set$(x0, x1, x2);
    const Buffer32$set = a0 => a1 => a2 => ((a2[a0] = a1, a2));
    const VoxBox$set_pos = a0 => a1 => a2 => ((a2.buffer[a0 * 2] = a1, a2));
    const VoxBox$set_col = a0 => a1 => a2 => ((a2.buffer[a0 * 2 + 1] = a1, a2));

    function VoxBox$set_length$(_length$1, _img$2) {
        var self = _img$2;
        switch (self._) {
            case 'VoxBox.new':
                var $349 = self.capacity;
                var $350 = self.buffer;
                var $351 = VoxBox$new$(_length$1, $349, $350);
                var $348 = $351;
                break;
        };
        return $348;
    };
    const VoxBox$set_length = x0 => x1 => VoxBox$set_length$(x0, x1);
    const VoxBox$push = a0 => a1 => a2 => ((a2.buffer[a2.length * 2] = a0, a2.buffer[a2.length * 2 + 1] = a1, a2.length++, a2));

    function VoxBox$parse$(_voxdata$1) {
        var _siz$2 = ((((_voxdata$1.length) >>> 0) / 12) >>> 0);
        var _img$3 = VoxBox$alloc_capacity$(_siz$2);
        var _img$4 = (() => {
            var $353 = _img$3;
            var $354 = 0;
            var $355 = _siz$2;
            let _img$5 = $353;
            for (let _i$4 = $354; _i$4 < $355; ++_i$4) {
                var _x$6 = VoxBox$parse_byte$(((((_i$4 * 6) >>> 0) + 0) >>> 0), _voxdata$1);
                var _y$7 = VoxBox$parse_byte$(((((_i$4 * 6) >>> 0) + 1) >>> 0), _voxdata$1);
                var _z$8 = VoxBox$parse_byte$(((((_i$4 * 6) >>> 0) + 2) >>> 0), _voxdata$1);
                var _r$9 = VoxBox$parse_byte$(((((_i$4 * 6) >>> 0) + 3) >>> 0), _voxdata$1);
                var _g$10 = VoxBox$parse_byte$(((((_i$4 * 6) >>> 0) + 4) >>> 0), _voxdata$1);
                var _b$11 = VoxBox$parse_byte$(((((_i$4 * 6) >>> 0) + 5) >>> 0), _voxdata$1);
                var _pos$12 = ((0 | _x$6 | (_y$7 << 12) | (_z$8 << 24)));
                var _col$13 = ((0 | _r$9 | (_g$10 << 8) | (_b$11 << 16) | (255 << 24)));
                var $353 = ((_img$5.buffer[_img$5.length * 2] = _pos$12, _img$5.buffer[_img$5.length * 2 + 1] = _col$13, _img$5.length++, _img$5));
                _img$5 = $353;
            };
            return _img$5;
        })();
        var $352 = _img$4;
        return $352;
    };
    const VoxBox$parse = x0 => VoxBox$parse$(x0);
    const Web$Kaelin$Assets$hero$croni0_d_1 = VoxBox$parse$("0f0b16351d4d100b16351d4d0d0c15351d4d0e0c15351d4d0f0c156a3a86100c158e4a9d110c15351d4d120c15351d4d0c0d14351d4d0d0d146a3a860e0d146a3a860f0d148e4a9d100d146a3a86110d146a3a86120d146a3a86130d14351d4d0b0e13351d4d0c0e136a3a860d0e136a3a860e0e136a3a860f0e136a3a86100e136a3a86110e136a3a86120e136a3a86130e136a3a86140e13351d4d0a0f12351d4d0b0f126a3a860c0f126a3a860d0f126a3a860e0f126a3a860f0f126a3a86100f126a3a86110f126a3a86120f126a3a86130f126a3a86140f126a3a86150f12351d4d0a1011351d4d0b10116a3a860c10116a3a860d10116a3a860e10116a3a860f10116a3a861010116a3a861110116a3a861210116a3a861310116a3a861410116a3a86151011351d4d091110351d4d0a11106a3a860b11106a3a860c11106a3a860d11106a3a860e11106a3a860f11106a3a861011106a3a861111106a3a861211106a3a861311106a3a861411106a3a861511106a3a86161110351d4d09120f351d4d0a120f6a3a860b120f6a3a860c120f602d800d120f602d800e120f6a3a860f120f6a3a8610120f6a3a8611120f6a3a8612120f602d8013120f602d8014120f6a3a8615120f6a3a8616120f351d4d09130e351d4d0a130e602d800b130e602d800c130e351d4d0d130e351d4d0e130e6a3a860f130e6a3a8610130e6a3a8611130e6a3a8612130e351d4d13130e351d4d14130e602d8015130e602d8016130e351d4d09140d351d4d0a140d602d800b140d351d4d0c140d351d4d0d140d531e480e140d351d4d0f140d6a3a8610140d6a3a8611140d351d4d12140d531e4813140d351d4d14140d351d4d15140d4a358016140d351d4d09150c351d4d0a150c4a35800b150c351d4d0c150c531e480d150cdf3e460e150c531e480f150c351d4d10150c351d4d11150c531e4812150cdf3e4613150c531e4814150c351d4d15150c4a358016150c351d4d0a160b351d4d0b160b4a35800c160b351d4d0d160b531e480e160b351d4d0f160b351d4d10160b351d4d11160b351d4d12160b531e4813160b351d4d14160b4a358015160b351d4d0b170a351d4d0c170a4a35800d170a8e4a9d0e170a351d4d0f170a351d4d10170a351d4d11170a351d4d12170a8e4a9d13170a4a358014170a351d4d0d1809351d4d0e1809602d800f1809602d801018094a3580111809602d80121809351d4d0c1908351d4d0d19086a3a860e19086a3a860f19086a3a861019084a35801119086a3a861219086a3a86131908351d4d0c1a07351d4d0d1a076a3a860e1a076a3a860f1a076a3a86101a074a3580111a076a3a86121a076a3a86131a07351d4d0c1b06351d4d0d1b068e4a9d0e1b066a3a860f1b066a3a86101b064a3580111b066a3a86121b068e4a9d131b06351d4d0d1c05351d4d0e1c05351d4d0f1c05351d4d101c05351d4d111c05351d4d121c05351d4d111d04351d4d121d04351d4d");
    const Web$Kaelin$Hero$croni = Web$Kaelin$Hero$new$("0x00000001", Web$Kaelin$Assets$hero$croni0_d_1);
    const Web$Kaelin$Assets$hero$cyclope_d_1 = VoxBox$parse$("0e0a212c333d0f0a212c333d100a212c333d110a212c333d0d0b202c333d0e0b20fff9e10f0b20fff9e1100b20fff9e1110b20fff9e1120b202c333d0d0c1f2c333d0e0c1ffff9e10f0c1ffff9e1100c1ffff9e1110c1ffff9e1120c1f2c333d0c0d1e2729600d0d1e2729600e0d1efff9e10f0d1eccc8b7100d1eccc8b7110d1eccc8b7120d1e272960130d1e272960140d1e2729600c0e1d2729600d0e1d2729600e0e1dfff9e10f0e1dccc8b7100e1dccc8b7110e1dccc8b7120e1d272960130e1d272960140e1d272960050f1c272960060f1c272960070f1c272960090f1c2729600a0f1c2729600b0f1c2729600c0f1c5176b80d0f1cfff9e10e0f1cdfdbc80f0f1cdfdbc8100f1cdfdbc8110f1cdfdbc8120f1cccc8b7130f1c5176b8140f1c5176b8150f1c27296005101b27296006101b799cd307101b799cd308101b27296009101b5176b80a101b5176b80b101b5176b80c101b799cd30d101b5176b80e101bdfdbc80f101bccc8b710101bccc8b711101bccc8b712101b5176b813101b799cd314101b799cd315101b5176b816101b27296017101b27296018101b27296005111a27296006111a799cd307111a799cd308111a27296009111a5176b80a111a5176b80b111a5176b80c111a799cd30d111a5176b80e111adfdbc80f111accc8b710111accc8b711111accc8b712111a5176b813111a799cd314111a799cd315111a5176b816111a27296017111a27296018111a2729600512192729600612195176b80712195176b8081219394c87091219799cd30a1219799cd30b1219799cd30c12195176b80d12194a2b710e12194a2b710f12194a2b711012194a2b711112194a2b711212194a2b711312195176b81412195176b8151219799cd31612192729601712192729601812192729600513182729600613185176b80713185176b8081318394c87091318799cd30a1318799cd30b1318799cd30c13185176b80d13184a2b710e13184a2b710f13184a2b711013184a2b711113184a2b711213184a2b711313185176b81413185176b8151318799cd3161318272960171318272960181318272960051417272960061417272960071417272960081417394c870914175176b80a14175176b80b14175176b80c14174a2b710d1417dab04d0e1417dab04d0f1417dab04d101417dab04d111417dab04d121417dab04d1314174a2b711414174a2b711514175176b8161417394c87171417394c87181417394c871914172729601a1417272960051516272960061516799cd3071516799cd3081516394c870915165176b80a15165176b80b15165176b80c15164a2b710d1516dab04d0e1516fff9e10f1516fff9e1101516fff9e1111516fff9e1121516dab04d1315164a2b711415164a2b711515165176b8161516394c87171516394c87181516394c87191516799cd31a1516272960051615272960061615799cd3071615799cd3081615394c870916155176b80a16155176b80b16155176b80c16154a2b710d1615dab04d0e1615fff9e10f1615fff9e1101615fff9e1111615fff9e1121615dab04d1316154a2b711416154a2b711516155176b8161615394c87171615394c87181615394c87191615799cd31a1615272960051714272960061714272960071714272960081714394c870917145176b80a17145176b80b17145176b80c17144a2b710d1714dab04d0e17142421260f1714242126101714242126111714242126121714dab04d1317144a2b711417144a2b711517145176b8161714394c87171714394c87181714394c871917142729601a17145176b81b17142729600518132729600618135176b80718135176b8081813394c870918135176b80a18135176b80b18135176b80c18135176b80d18134a2b710e18134a2b710f18134a2b711018134a2b711118134a2b711218134a2b711318135176b81418135176b81518135176b8161813394c87171813394c87181813394c87191813799cd31a1813799cd31b18132729600519122729600619125176b80719125176b8081912394c870919125176b80a19125176b80b19125176b80c19125176b80d19124a2b710e19124a2b710f19124a2b711019124a2b711119124a2b711219124a2b711319125176b81419125176b81519125176b8161912394c87171912394c87181912394c87191912799cd31a1912799cd31b1912272960051a11272960061a115176b8071a115176b8081a11394c87091a115176b80a1a115176b80b1a115176b80c1a115176b80d1a114a2b710e1a114a2b710f1a114a2b71101a114a2b71111a114a2b71121a114a2b71131a115176b8141a115176b8151a115176b8161a11394c87171a11394c87181a11394c87191a11799cd31a1a11799cd31b1a11272960051b10272960061b10799cd3071b10799cd3081b105176b8091b10394c870a1b10394c870b1b10394c870c1b10dfdbc80d1b105176b80e1b105176b80f1b105176b8101b105176b8111b105176b8121b105176b8131b10dfdbc8141b10dfdbc8151b10394c87161b105176b8171b105176b8181b105176b8191b105176b81a1b10799cd31b1b10272960061c0f272960071c0f272960081c0f272960091c0f394c870a1c0f394c870b1c0f394c870c1c0fdfdbc80d1c0f4662a10e1c0f4662a10f1c0f4662a1101c0f4662a1111c0f4662a1121c0f4662a1131c0fdfdbc8141c0fdfdbc8151c0f394c87161c0f394c87171c0f394c87181c0f394c87191c0f5176b81a1c0f5176b81b1c0f272960081d0e272960091d0e5176b80a1d0e5176b80b1d0e5176b80c1d0e394c870d1d0e394c870e1d0e394c870f1d0e394c87101d0e394c87111d0e394c87121d0e394c87131d0e394c87141d0e394c87151d0e5176b8161d0e394c87171d0e394c87181d0e394c87191d0e5176b81a1d0e5176b81b1d0e272960081e0d272960091e0d5176b80a1e0d5176b80b1e0d5176b80c1e0d394c870d1e0d394c870e1e0d394c870f1e0d394c87101e0d394c87111e0d394c87121e0d394c87131e0d394c87141e0d394c87151e0d5176b8161e0d394c87171e0d394c87181e0d394c87191e0d5176b81a1e0d5176b81b1e0d272960081f0c272960091f0c5176b80a1f0c5176b80b1f0c5176b80c1f0c394c870d1f0c394c870e1f0c394c870f1f0c394c87101f0c394c87111f0c394c87121f0c394c87131f0c394c87141f0c394c87151f0c5176b8161f0c394c87171f0c394c87181f0c394c87191f0c5176b81a1f0c5176b81b1f0c27296008200b27296009200b5176b80a200b5176b80b200b5176b80c200b5176b80d200b5176b80e200b5176b80f200b5176b810200b5176b811200b5176b812200b5176b813200b5176b814200b5176b815200b394c8716200b799cd317200b799cd318200b799cd319200b5176b81a200b5176b81b200b27296008210a27296009210a8e4a9d0a210a8e4a9d0b210a8e4a9d0c210a8e4a9d0d210a5176b80e210a5176b80f210a5176b810210a5176b811210a5176b812210a5176b813210a394c8714210a394c8715210a394c8716210a799cd317210a799cd318210a799cd319210a799cd31a210a5176b81b210a2729600922092729600a22092729600b22092729600c22094a2b710d22098e4a9d0e22098e4a9d0f22098e4a9d1022098e4a9d1122098e4a9d1222098e4a9d132209394c87142209394c871522095176b8162209394c87172209394c87182209394c87192209394c871a22092729600923082729600a23082729600b23082729600c23084a2b710d23088e4a9d0e23088e4a9d0f23088e4a9d1023088e4a9d1123088e4a9d1223088e4a9d132308394c87142308394c871523085176b8162308394c87172308394c87182308394c87192308394c871a23082729600924072729600a24072729600b24072729600c24074a2b710d24078e4a9d0e24078e4a9d0f24078e4a9d1024078e4a9d1124078e4a9d1224078e4a9d132407394c87142407394c871524075176b8162407394c87172407394c87182407394c87192407394c871a24072729600925062729600a25062729600b25062729600c25065176b80d25064a2b710e25068e4a9d0f25068e4a9d1025068e4a9d1125068e4a9d1225064a2b71132506394c87142506394c87152506799cd3162506799cd3172506799cd3182506799cd31925065176b81a25062729600926052729600a26052729600b26052729600c2605799cd30d2605799cd30e26054a2b710f26054a2b711026054a2b711126054a2b711226052729601326052729601426052729601526052729601626052729601726052729601826052729601926052729600927042729600a27042729600b27042729600c27042729600d27042729600e2704272960");
    const Web$Kaelin$Hero$cyclope = Web$Kaelin$Hero$new$("0x00000002", Web$Kaelin$Assets$hero$cyclope_d_1);
    const Web$Kaelin$Assets$hero$lela_d_1 = VoxBox$parse$("091219fb4d4d0a1219fb4d4d0b1219fb4d4d0c1219fb4d4d131219fb4d4d141219fb4d4d151219fb4d4d161219fb4d4d081318fb4d4d0913182b496c0a13182b496c0b13182b496c0c13182b496c0d1318fb4d4d121318fb4d4d1313182b496c1413182b496c1513182b496c1613182b496c171318fb4d4d071417fb4d4d0814172b496c09141781aeff0a141781aeff0b141781aeff0c141781aeff0d14172b496c0e1417fb4d4d0f1417fb4d4d101417fb4d4d111417fb4d4d1214172b496c13141781aeff14141781aeff15141781aeff16141781aeff1714172b496c181417fb4d4d071516fb4d4d0815161f3b5b091516538ccf0a1516538ccf0b1516538ccf0c1516538ccf0d1516538ccf0e15162b496c0f15162b496c1015162b496c1115162b496c121516538ccf131516538ccf141516538ccf151516538ccf161516538ccf1715161f3b5b181516fb4d4d071615fb4d4d0816151f3b5b091615538ccf0a1615538ccf0b1615538ccf0c1615538ccf0d1615538ccf0e161581aeff0f161581aeff10161581aeff11161581aeff121615538ccf131615538ccf141615538ccf151615538ccf161615538ccf1716151f3b5b181615fb4d4d071714fb4d4d0817141f3b5b091714538ccf0a1714538ccf0b1714538ccf0c1714538ccf0d1714538ccf0e1714538ccf0f1714538ccf101714538ccf111714538ccf121714538ccf131714538ccf141714538ccf151714538ccf161714538ccf1717141f3b5b181714fb4d4d081813fb4d4d0918131f3b5b0a1813538ccf0b1813538ccf0c1813538ccf0d1813538ccf0e1813538ccf0f1813cb4646101813cb4646111813538ccf121813538ccf131813538ccf141813538ccf151813538ccf1618131f3b5b171813fb4d4d091912fb4d4d0a19121f3b5b0b1912538ccf0c1912538ccf0d1912538ccf0e1912538ccf0f1912ad1f1f101912ad1f1f111912538ccf121912538ccf131912538ccf141912538ccf1519121f3b5b161912fb4d4d091a11fb4d4d0a1a111f3b5b0b1a11538ccf0c1a11538ccf0d1a11cb46460e1a11538ccf0f1a11538ccf101a11538ccf111a11538ccf121a11cb4646131a11538ccf141a11538ccf151a111f3b5b161a11fb4d4d091b10fb4d4d0a1b101f3b5b0b1b10538ccf0c1b10538ccf0d1b10ad1f1f0e1b10538ccf0f1b103d5497101b103d5497111b10538ccf121b10ad1f1f131b10538ccf141b10538ccf151b101f3b5b161b10fb4d4d0a1c0ffb4d4d0b1c0f1f3b5b0c1c0f538ccf0d1c0f538ccf0e1c0f538ccf0f1c0f2d4382101c0f2d4382111c0f538ccf121c0f538ccf131c0f538ccf141c0f1f3b5b151c0ffb4d4d0b1d0efb4d4d0c1d0e1f3b5b0d1d0e3a67b70e1d0e538ccf0f1d0e203368101d0e203368111d0e538ccf121d0e3a67b7131d0e1f3b5b141d0efb4d4d0a1e0dfb4d4d0b1e0d1f3b5b0c1e0d538ccf0d1e0d538ccf0e1e0d3a67b70f1e0d3a67b7101e0d3a67b7111e0d3a67b7121e0d538ccf131e0d538ccf141e0d1f3b5b151e0dfb4d4d091f0cfb4d4d0a1f0c1f3b5b0b1f0c81aeff0c1f0c3a71b10d1f0c538ccf0e1f0c81aeff0f1f0c81aeff101f0c81aeff111f0c81aeff121f0c538ccf131f0c3a71b1141f0c81aeff151f0c1f3b5b161f0cfb4d4d08200bfb4d4d09200b1f3b5b0a200b538ccf0b200b538ccf0c200b3a71b10d200b538ccf0e200b538ccf0f200b538ccf10200b538ccf11200b538ccf12200b538ccf13200b3a71b114200b538ccf15200b538ccf16200b1f3b5b17200bfb4d4d08210afb4d4d09210a1f3b5b0a210a538ccf0b210a538ccf0c210a3a71b10d210a538ccf0e210a538ccf0f210a538ccf10210a538ccf11210a538ccf12210a538ccf13210a3a71b114210a538ccf15210a538ccf16210a1f3b5b17210afb4d4d082209fb4d4d0922091f3b5b0a2209538ccf0b2209538ccf0c22092753860d2209538ccf0e2209538ccf0f2209538ccf102209538ccf112209538ccf122209538ccf132209275386142209538ccf152209538ccf1622091f3b5b172209fb4d4d092308fb4d4d0a23081f3b5b0b23081f3b5b0c23081f3b5b0d23083a67b70e2308538ccf0f2308538ccf102308538ccf112308538ccf1223083a67b71323081f3b5b1423081f3b5b1523081f3b5b162308fb4d4d0a2407fb4d4d0b2407fb4d4d0c2407fb4d4d0d24071f3b5b0e24073a67b70f2407538ccf102407538ccf1124073a67b71224071f3b5b132407fb4d4d142407fb4d4d152407fb4d4d0d2506fb4d4d0e25061f3b5b0f25063a67b71025063a67b71125061f3b5b122506fb4d4d0e2605fb4d4d0f26051f3b5b1026051f3b5b112605fb4d4d0f2704fb4d4d102704fb4d4d");
    const Web$Kaelin$Hero$lela = Web$Kaelin$Hero$new$("0x00000003", Web$Kaelin$Assets$hero$lela_d_1);
    const Web$Kaelin$Assets$hero$octoking_d_1 = VoxBox$parse$("0a0a21192a020b0a21192a020d0a21192a020e0a21192a02100a21192a02110a21192a02120a21192a02130a21192a02150a21192a02160a21192a02180a21192a02190a21192a020a0b20192a020b0b20192a020d0b20192a020e0b20192a02100b20192a02110b20192a02120b20192a02130b20192a02150b20192a02160b20192a02180b20192a02190b20192a02080c1f192a02090c1f192a020a0c1fe6d7510b0c1fe6d7510c0c1f192a020d0c1f70681e0e0c1f70681e0f0c1f192a02100c1ffff6a6110c1ffff6a6120c1ffff6a6130c1ffff6a6140c1f192a02150c1f70681e160c1f70681e170c1f192a02180c1fe6d751190c1fe6d7511a0c1f192a021b0c1f192a02080d1e192a02090d1e192a020a0d1ee6d7510b0d1ee6d7510c0d1efff6a60d0d1e192a020e0d1e192a020f0d1ee6d751100d1ee6d751110d1ee6d751120d1ee6d751130d1ee6d751140d1ee6d751150d1e192a02160d1e192a02170d1efff6a6180d1ee6d751190d1ee6d7511a0d1e192a021b0d1e192a02080e1d192a02090e1d192a020a0e1de6d7510b0e1de6d7510c0e1dfff6a60d0e1d192a020e0e1d192a020f0e1de6d751100e1de6d751110e1de6d751120e1de6d751130e1de6d751140e1de6d751150e1d192a02160e1d192a02170e1dfff6a6180e1de6d751190e1de6d7511a0e1d192a021b0e1d192a02080f1c192a02090f1c192a020a0f1cc9ae530b0f1cc9ae530c0f1ce6d7510d0f1ce6d7510e0f1ce6d7510f0f1ce6d751100f1cb8321d110f1cb8321d120f1cb8321d130f1cb8321d140f1ce6d751150f1ce6d751160f1ce6d751170f1ce6d751180f1cc9ae53190f1cc9ae531a0f1c192a021b0f1c192a0208101b192a0209101b192a020a101bc9ae530b101bc9ae530c101be6d7510d101be6d7510e101be6d7510f101be6d75110101bb8321d11101bb8321d12101bb8321d13101bb8321d14101be6d75115101be6d75116101be6d75117101be6d75118101bc9ae5319101bc9ae531a101b192a021b101b192a0205111a192a0206111a192a0207111a192a0208111a192a0209111a192a020a111a4281350b111a4281350c111a4281350d111a4281350e111a4281350f111ac9ae5310111ac9ae5311111ac9ae5312111ac9ae5313111ac9ae5314111ac9ae5315111a42813516111a42813517111a42813518111a42813519111a4281351a111a192a021b111a192a021c111a192a021d111a192a021e111a192a02041219192a020512199fd95d0612199fd95d0712199fd95d081219192a02091219192a020a12199fd95d0b12199fd95d0c12195ea6420d12195ea6420e12195ea6420f12194281351012194281351112194281351212194281351312194281351412194281351512195ea6421612195ea6421712195ea6421812199fd95d1912199fd95d1a1219192a021b1219192a021c12199fd95d1d12199fd95d1e12199fd95d1f1219192a02041318192a020513189fd95d0613189fd95d0713189fd95d081318192a02091318192a020a13189fd95d0b13189fd95d0c13185ea6420d13185ea6420e13185ea6420f13184281351013184281351113184281351213184281351313184281351413184281351513185ea6421613185ea6421713185ea6421813189fd95d1913189fd95d1a1318192a021b1318192a021c13189fd95d1d13189fd95d1e13189fd95d1f1318192a02021417192a02031417192a020414179fd95d0514175ea6420614175ea6420714175ea642081417192a02091417192a020a14175ea6420b14175ea6420c14175ea6420d14175ea6420e14175ea6420f14175ea6421014175ea6421114175ea6421214175ea6421314175ea6421414175ea6421514175ea6421614175ea6421714175ea6421814175ea6421914175ea6421a1417192a021b1417192a021c14175ea6421d14175ea6421e14175ea6421f14179fd95d201417192a02211417192a02041516192a020515165ea6420615165ea6420715165ea642081516192a02091516192a020a15164281350b15164281350c15164281350d15164281350e15164281350f15164281351015165ea6421115165ea6421215165ea6421315165ea6421415164281351515164281351615164281351715164281351815164281351915164281351a1516192a021b1516192a021c15165ea6421d15165ea6421e15165ea6421f1516192a02041615192a020516155ea6420616155ea6420716155ea642081615192a02091615192a020a16154281350b16154281350c16154281350d16154281350e16154281350f16154281351016155ea6421116155ea6421216155ea6421316155ea6421416154281351516154281351616154281351716154281351816154281351916154281351a1615192a021b1615192a021c16155ea6421d16155ea6421e16155ea6421f1615192a02051714192a02061714192a020717145ea6420817145ea6420917145ea6420a1714192a020b1714192a020c17144281350d1714e6d7510e1714e6d7510f1714e6d751101714428135111714428135121714428135131714428135141714e6d751151714e6d751161714e6d751171714428135181714192a02191714192a021a17145ea6421b17145ea6421c17145ea6421d1714192a021e1714192a02071813192a020818135ea6420918135ea6420a1813366d2a0b1813366d2a0c1813192a020d18134281350e18134281350f1813173e0f101813173e0f111813173e0f121813173e0f131813173e0f141813173e0f151813428135161813428135171813192a02181813366d2a191813366d2a1a18135ea6421b18135ea6421c1813192a02071912192a020819125ea6420919125ea6420a1912366d2a0b1912366d2a0c1912192a020d19124281350e19124281350f1912173e0f101912173e0f111912173e0f121912173e0f131912173e0f141912173e0f151912428135161912428135171912192a02181912366d2a191912366d2a1a19125ea6421b19125ea6421c1912192a02051a11192a02061a11192a02071a11192a02081a11428135091a114281350a1a115ea6420b1a115ea6420c1a114281350d1a11192a020e1a11192a020f1a119fd95d101a119fd95d111a119fd95d121a119fd95d131a119fd95d141a119fd95d151a11192a02161a11192a02171a11428135181a115ea642191a115ea6421a1a114281351b1a114281351c1a11192a021d1a11192a021e1a11192a02051b10192a02061b10192a02071b10192a02081b10428135091b104281350a1b105ea6420b1b105ea6420c1b104281350d1b10192a020e1b10192a020f1b109fd95d101b109fd95d111b109fd95d121b109fd95d131b109fd95d141b109fd95d151b10192a02161b10192a02171b10428135181b105ea642191b105ea6421a1b104281351b1b104281351c1b10192a021d1b10192a021e1b10192a02041c0f192a02051c0f366d2a061c0f366d2a071c0f192a02081c0f5ea642091c0f5ea6420a1c0f4281350b1c0f4281350c1c0f192a020d1c0f9fd95d0e1c0f9fd95d0f1c0f5ea642101c0f428135111c0f428135121c0f428135131c0f428135141c0f5ea642151c0f9fd95d161c0f9fd95d171c0f192a02181c0f428135191c0f4281351a1c0f5ea6421b1c0f5ea6421c1c0f192a021d1c0f366d2a1e1c0f366d2a1f1c0f192a02021d0e192a02031d0e192a02041d0e428135051d0e428135061d0e428135071d0e192a02081d0e428135091d0e4281350a1d0e4281350b1d0e4281350c1d0e192a020d1d0e5ea6420e1d0e5ea6420f1d0e5ea642101d0e428135111d0e428135121d0e428135131d0e428135141d0e5ea642151d0e5ea642161d0e5ea642171d0e192a02181d0e428135191d0e4281351a1d0e4281351b1d0e4281351c1d0e192a021d1d0e4281351e1d0e4281351f1d0e428135201d0e192a02211d0e192a02021e0d192a02031e0d192a02041e0d428135051e0d428135061e0d428135071e0d192a02081e0d428135091e0d4281350a1e0d4281350b1e0d4281350c1e0d192a020d1e0d5ea6420e1e0d5ea6420f1e0d5ea642101e0d428135111e0d428135121e0d428135131e0d428135141e0d5ea642151e0d5ea642161e0d5ea642171e0d192a02181e0d428135191e0d4281351a1e0d4281351b1e0d4281351c1e0d192a021d1e0d4281351e1e0d4281351f1e0d428135201e0d192a02211e0d192a02001f0c192a02011f0c192a02021f0c9fd95d031f0c9fd95d041f0c5ea642051f0c428135061f0c428135071f0c192a02081f0c5ea642091f0c5ea6420a1f0c4281350b1f0c4281350c1f0c192a020d1f0c5ea6420e1f0c5ea6420f1f0c5ea642101f0c428135111f0c428135121f0c428135131f0c428135141f0c5ea642151f0c5ea642161f0c5ea642171f0c192a02181f0c428135191f0c4281351a1f0c5ea6421b1f0c5ea6421c1f0c192a021d1f0c4281351e1f0c4281351f1f0c5ea642201f0c9fd95d211f0c9fd95d221f0c192a0202200b192a0203200b192a0204200b192a0205200b42813506200b42813507200b42813508200b192a0209200b192a020a200b366d2a0b200b366d2a0c200b192a020d200b5ea6420e200b5ea6420f200b5ea64210200b42813511200b42813512200b42813513200b42813514200b5ea64215200b5ea64216200b5ea64217200b192a0218200b366d2a19200b366d2a1a200b192a021b200b192a021c200b4281351d200b4281351e200b4281351f200b192a0220200b192a0221200b192a0202210a192a0203210a192a0204210a192a0205210a42813506210a42813507210a42813508210a192a0209210a192a020a210a366d2a0b210a366d2a0c210a192a020d210a5ea6420e210a5ea6420f210a5ea64210210a42813511210a42813512210a42813513210a42813514210a5ea64215210a5ea64216210a5ea64217210a192a0218210a366d2a19210a366d2a1a210a192a021b210a192a021c210a4281351d210a4281351e210a4281351f210a192a0220210a192a0221210a192a02052209192a02062209192a02072209192a020a2209192a020b2209192a020c2209192a020d22095ea6420e22095ea6420f22094281351022094281351122094281351222094281351322094281351422094281351522095ea6421622095ea642172209192a02182209192a02192209192a021c2209192a021d2209192a021e2209192a02052308192a02062308192a02072308192a020a2308192a020b2308192a020c2308192a020d23085ea6420e23085ea6420f23084281351023084281351123084281351223084281351323084281351423084281351523085ea6421623085ea642172308192a02182308192a02192308192a021c2308192a021d2308192a021e2308192a02082407192a02092407192a020a2407192a020b2407192a020c24075ea6420d24074281350e24074281350f2407428135102407366d2a112407366d2a122407366d2a132407366d2a1424074281351524074281351624074281351724075ea642182407192a02192407192a021a2407192a021b2407192a02072506192a020825065ea6420925065ea6420a25065ea6420b25065ea6420c25064281350d25064281350e25064281350f2506366d2a102506192a02112506192a02122506192a02132506192a02142506366d2a1525064281351625064281351725064281351825065ea6421925065ea6421a25065ea6421b25065ea6421c2506192a02072605192a020826055ea6420926055ea6420a26055ea6420b26055ea6420c26054281350d26054281350e26054281350f2605366d2a102605192a02112605192a02122605192a02132605192a02142605366d2a1526054281351626054281351726054281351826055ea6421926055ea6421a26055ea6421b26055ea6421c2605192a02082704192a02092704192a020a2704192a020b2704192a020c2704192a020d2704192a020e2704192a020f2704192a02142704192a02152704192a02162704192a02172704192a02182704192a02192704192a021a2704192a021b2704192a02");
    const Web$Kaelin$Hero$octoking = Web$Kaelin$Hero$new$("0x00000004", Web$Kaelin$Assets$hero$octoking_d_1);

    function Maybe$default$(_m$2, _a$3) {
        var self = _m$2;
        switch (self._) {
            case 'Maybe.some':
                var $357 = self.value;
                var $358 = $357;
                var $356 = $358;
                break;
            case 'Maybe.none':
                var $359 = _a$3;
                var $356 = $359;
                break;
        };
        return $356;
    };
    const Maybe$default = x0 => x1 => Maybe$default$(x0, x1);

    function List$(_A$1) {
        var $360 = null;
        return $360;
    };
    const List = x0 => List$(x0);

    function I32$new$(_value$1) {
        var $361 = word_to_i32(_value$1);
        return $361;
    };
    const I32$new = x0 => I32$new$(x0);
    const I32$add = a0 => a1 => ((a0 + a1) >> 0);

    function Word$neg$aux$(_word$2, _inc$3) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $363 = self.pred;
                var self = _inc$3;
                if (self) {
                    var $365 = Word$o$(Word$neg$aux$($363, Bool$true));
                    var $364 = $365;
                } else {
                    var $366 = Word$i$(Word$neg$aux$($363, Bool$false));
                    var $364 = $366;
                };
                var $362 = $364;
                break;
            case 'Word.i':
                var $367 = self.pred;
                var self = _inc$3;
                if (self) {
                    var $369 = Word$i$(Word$neg$aux$($367, Bool$false));
                    var $368 = $369;
                } else {
                    var $370 = Word$o$(Word$neg$aux$($367, Bool$false));
                    var $368 = $370;
                };
                var $362 = $368;
                break;
            case 'Word.e':
                var $371 = Word$e;
                var $362 = $371;
                break;
        };
        return $362;
    };
    const Word$neg$aux = x0 => x1 => Word$neg$aux$(x0, x1);

    function Word$neg$(_word$2) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $373 = self.pred;
                var $374 = Word$o$(Word$neg$aux$($373, Bool$true));
                var $372 = $374;
                break;
            case 'Word.i':
                var $375 = self.pred;
                var $376 = Word$i$(Word$neg$aux$($375, Bool$false));
                var $372 = $376;
                break;
            case 'Word.e':
                var $377 = Word$e;
                var $372 = $377;
                break;
        };
        return $372;
    };
    const Word$neg = x0 => Word$neg$(x0);
    const I32$neg = a0 => ((-a0));

    function Int$to_i32$(_a$1) {
        var self = _a$1;
        switch ("new") {
            case 'new':
                var $379 = int_pos(self);
                var $380 = int_neg(self);
                var self = $380;
                if (self === 0n) {
                    var $382 = I32$new$(Nat$to_word$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$zero)))))))))))))))))))))))))))))))), $379));
                    var $381 = $382;
                } else {
                    var $383 = (self - 1n);
                    var $384 = ((-I32$new$(Nat$to_word$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$succ$(Nat$zero)))))))))))))))))))))))))))))))), $380))));
                    var $381 = $384;
                };
                var $378 = $381;
                break;
        };
        return $378;
    };
    const Int$to_i32 = x0 => Int$to_i32$(x0);
    const Int$new = a0 => a1 => (a0 - a1);

    function Int$from_nat$(_n$1) {
        var $385 = (_n$1 - 0n);
        return $385;
    };
    const Int$from_nat = x0 => Int$from_nat$(x0);
    const I32$mul = a0 => a1 => ((a0 * a1) >> 0);

    function Int$to_nat$(_a$1) {
        var self = _a$1;
        switch ("new") {
            case 'new':
                var $387 = int_pos(self);
                var $388 = $387;
                var $386 = $388;
                break;
        };
        return $386;
    };
    const Int$to_nat = x0 => Int$to_nat$(x0);

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
                        var $389 = self.pred;
                        var $390 = Word$is_neg$go$($389, Bool$false);
                        return $390;
                    case 'Word.i':
                        var $391 = self.pred;
                        var $392 = Word$is_neg$go$($391, Bool$true);
                        return $392;
                    case 'Word.e':
                        var $393 = _n$3;
                        return $393;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Word$is_neg$go = x0 => x1 => Word$is_neg$go$(x0, x1);

    function Word$is_neg$(_word$2) {
        var $394 = Word$is_neg$go$(_word$2, Bool$false);
        return $394;
    };
    const Word$is_neg = x0 => Word$is_neg$(x0);

    function Word$fold$(_nil$3, _w0$4, _w1$5, _word$6) {
        var self = _word$6;
        switch (self._) {
            case 'Word.o':
                var $396 = self.pred;
                var $397 = _w0$4(Word$fold$(_nil$3, _w0$4, _w1$5, $396));
                var $395 = $397;
                break;
            case 'Word.i':
                var $398 = self.pred;
                var $399 = _w1$5(Word$fold$(_nil$3, _w0$4, _w1$5, $398));
                var $395 = $399;
                break;
            case 'Word.e':
                var $400 = _nil$3;
                var $395 = $400;
                break;
        };
        return $395;
    };
    const Word$fold = x0 => x1 => x2 => x3 => Word$fold$(x0, x1, x2, x3);
    const Nat$add = a0 => a1 => (a0 + a1);
    const Nat$mul = a0 => a1 => (a0 * a1);

    function Word$to_nat$(_word$2) {
        var $401 = Word$fold$(0n, a1 => (2n * a1), (_x$4 => {
            var $402 = Nat$succ$((2n * _x$4));
            return $402;
        }), _word$2);
        return $401;
    };
    const Word$to_nat = x0 => Word$to_nat$(x0);

    function Word$abs$(_a$2) {
        var _neg$3 = Word$is_neg$(_a$2);
        var self = _neg$3;
        if (self) {
            var $404 = Word$neg$(_a$2);
            var $403 = $404;
        } else {
            var $405 = _a$2;
            var $403 = $405;
        };
        return $403;
    };
    const Word$abs = x0 => Word$abs$(x0);

    function Int$neg$(_a$1) {
        var self = _a$1;
        switch ("new") {
            case 'new':
                var $407 = int_pos(self);
                var $408 = int_neg(self);
                var $409 = ($408 - $407);
                var $406 = $409;
                break;
        };
        return $406;
    };
    const Int$neg = x0 => Int$neg$(x0);

    function Word$to_int$(_a$2) {
        var _neg$3 = Word$is_neg$(_a$2);
        var _i$4 = Int$from_nat$(Word$to_nat$(Word$abs$(_a$2)));
        var self = _neg$3;
        if (self) {
            var $411 = Int$neg$(_i$4);
            var $410 = $411;
        } else {
            var $412 = _i$4;
            var $410 = $412;
        };
        return $410;
    };
    const Word$to_int = x0 => Word$to_int$(x0);

    function I32$to_int$(_a$1) {
        var self = _a$1;
        switch ('i32') {
            case 'i32':
                var $414 = i32_to_word(self);
                var $415 = Word$to_int$($414);
                var $413 = $415;
                break;
        };
        return $413;
    };
    const I32$to_int = x0 => I32$to_int$(x0);

    function Web$Kaelin$Coord$Convert$axial_to_nat$(_coord$1) {
        var self = _coord$1;
        switch (self._) {
            case 'Web.Kaelin.Coord.new':
                var $417 = self.i;
                var $418 = self.j;
                var _i$4 = (($417 + Int$to_i32$(Int$from_nat$(1000n))) >> 0);
                var _i$5 = ((_i$4 * Int$to_i32$(Int$from_nat$(10000n))) >> 0);
                var _i$6 = Int$to_nat$(I32$to_int$(_i$5));
                var _j$7 = (($418 + Int$to_i32$(Int$from_nat$(1000n))) >> 0);
                var _j$8 = Int$to_nat$(I32$to_int$(_j$7));
                var $419 = (_i$6 + _j$8);
                var $416 = $419;
                break;
        };
        return $416;
    };
    const Web$Kaelin$Coord$Convert$axial_to_nat = x0 => Web$Kaelin$Coord$Convert$axial_to_nat$(x0);

    function Maybe$(_A$1) {
        var $420 = null;
        return $420;
    };
    const Maybe = x0 => Maybe$(x0);

    function BitsMap$get$(_bits$2, _map$3) {
        var BitsMap$get$ = (_bits$2, _map$3) => ({
            ctr: 'TCO',
            arg: [_bits$2, _map$3]
        });
        var BitsMap$get = _bits$2 => _map$3 => BitsMap$get$(_bits$2, _map$3);
        var arg = [_bits$2, _map$3];
        while (true) {
            let [_bits$2, _map$3] = arg;
            var R = (() => {
                var self = _bits$2;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'o':
                        var $421 = self.slice(0, -1);
                        var self = _map$3;
                        switch (self._) {
                            case 'BitsMap.tie':
                                var $423 = self.lft;
                                var $424 = BitsMap$get$($421, $423);
                                var $422 = $424;
                                break;
                            case 'BitsMap.new':
                                var $425 = Maybe$none;
                                var $422 = $425;
                                break;
                        };
                        return $422;
                    case 'i':
                        var $426 = self.slice(0, -1);
                        var self = _map$3;
                        switch (self._) {
                            case 'BitsMap.tie':
                                var $428 = self.rgt;
                                var $429 = BitsMap$get$($426, $428);
                                var $427 = $429;
                                break;
                            case 'BitsMap.new':
                                var $430 = Maybe$none;
                                var $427 = $430;
                                break;
                        };
                        return $427;
                    case 'e':
                        var self = _map$3;
                        switch (self._) {
                            case 'BitsMap.tie':
                                var $432 = self.val;
                                var $433 = $432;
                                var $431 = $433;
                                break;
                            case 'BitsMap.new':
                                var $434 = Maybe$none;
                                var $431 = $434;
                                break;
                        };
                        return $431;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const BitsMap$get = x0 => x1 => BitsMap$get$(x0, x1);

    function Bits$inc$(_a$1) {
        var self = _a$1;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'o':
                var $436 = self.slice(0, -1);
                var $437 = ($436 + '1');
                var $435 = $437;
                break;
            case 'i':
                var $438 = self.slice(0, -1);
                var $439 = (Bits$inc$($438) + '0');
                var $435 = $439;
                break;
            case 'e':
                var $440 = (Bits$e + '1');
                var $435 = $440;
                break;
        };
        return $435;
    };
    const Bits$inc = x0 => Bits$inc$(x0);
    const Nat$to_bits = a0 => (nat_to_bits(a0));

    function NatMap$get$(_key$2, _map$3) {
        var $441 = BitsMap$get$((nat_to_bits(_key$2)), _map$3);
        return $441;
    };
    const NatMap$get = x0 => x1 => NatMap$get$(x0, x1);

    function Web$Kaelin$Map$get$(_coord$1, _map$2) {
        var _key$3 = Web$Kaelin$Coord$Convert$axial_to_nat$(_coord$1);
        var $442 = NatMap$get$(_key$3, _map$2);
        return $442;
    };
    const Web$Kaelin$Map$get = x0 => x1 => Web$Kaelin$Map$get$(x0, x1);

    function List$cons$(_head$2, _tail$3) {
        var $443 = ({
            _: 'List.cons',
            'head': _head$2,
            'tail': _tail$3
        });
        return $443;
    };
    const List$cons = x0 => x1 => List$cons$(x0, x1);

    function NatMap$set$(_key$2, _val$3, _map$4) {
        var $444 = BitsMap$set$((nat_to_bits(_key$2)), _val$3, _map$4);
        return $444;
    };
    const NatMap$set = x0 => x1 => x2 => NatMap$set$(x0, x1, x2);

    function Web$Kaelin$Map$set$(_coord$1, _tile$2, _map$3) {
        var _key$4 = Web$Kaelin$Coord$Convert$axial_to_nat$(_coord$1);
        var $445 = NatMap$set$(_key$4, _tile$2, _map$3);
        return $445;
    };
    const Web$Kaelin$Map$set = x0 => x1 => x2 => Web$Kaelin$Map$set$(x0, x1, x2);

    function Web$Kaelin$Map$push$(_coord$1, _entity$2, _map$3) {
        var _tile$4 = Maybe$default$(Web$Kaelin$Map$get$(_coord$1, _map$3), List$nil);
        var _tile$5 = List$cons$(_entity$2, _tile$4);
        var $446 = Web$Kaelin$Map$set$(_coord$1, _tile$5, _map$3);
        return $446;
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
        var $447 = _map$11;
        return $447;
    };
    const Web$Kaelin$Map$init = x0 => Web$Kaelin$Map$init$(x0);
    const NatMap$new = BitsMap$new;
    const Web$Kaelin$Constants$map_size = 5;
    const Web$Kaelin$Assets$tile$green_2 = VoxBox$parse$("0e00010600000f00010600001000010600000c01010600000d01010600000e0101408d640f0101408d64100101469e651101010600001201010600000a02010600000b02010600000c0201469e650d0201469e650e0201469e650f0201408d64100201469e65110201469e65120201408d641302010600001402010600000803010600000903010600000a0301469e650b0301408d640c0301469e650d0301469e650e0301469e650f0301408d64100301408d64110301408d64120301408d64130301469e65140301469e65150301060000160301060000060401060000070401060000080401469e65090401469e650a0401469e650b0401408d640c0401408d640d0401469e650e0401469e650f0401408d64100401469e65110401408d64120401408d64130401408d64140401408d64150401408d64160401408d64170401060000180401060000040501060000050501060000060501469e65070501408d64080501469e65090501469e650a0501408d640b0501408d640c0501408d640d0501347e570e0501347e570f0501469e65100501469e65110501469e65120501347e57130501408d64140501469e65150501469e65160501408d64170501469e65180501469e651905010600001a0501060000020601060000030601060000040601347e57050601469e65060601469e65070601408d64080601408d64090601347e570a0601408d640b0601408d640c0601408d640d0601408d640e0601347e570f0601469e65100601469e65110601408d64120601347e57130601347e57140601469e65150601469e65160601408d64170601408d64180601347e57190601408d641a0601408d641b06010600001c0601060000000701060000010701060000020701408d64030701408d64040701408d64050701408d64060701408d64070701408d64080701408d64090701347e570a0701347e570b0701408d640c0701469e650d0701469e650e0701408d640f0701408d64100701408d64110701408d64120701408d64130701408d64140701408d64150701408d64160701408d64170701408d64180701347e57190701347e571a0701408d641b0701469e651c0701469e651d07010600001e0701060000000801060000010801408d64020801469e65030801469e65040801408d64050801469e65060801469e65070801469e65080801408d64090801469e650a0801469e650b0801408d640c0801408d640d0801469e650e0801469e650f0801347e57100801408d64110801469e65120801469e65130801408d64140801469e65150801469e65160801469e65170801408d64180801469e65190801469e651a0801408d641b0801408d641c0801469e651d0801469e651e0801060000000901060000010901408d64020901408d64030901408d64040901408d64050901469e65060901469e65070901408d64080901408d64090901408d640a0901408d640b0901408d640c0901408d640d0901408d640e0901408d640f0901408d64100901408d64110901408d64120901408d64130901408d64140901469e65150901469e65160901408d64170901408d64180901408d64190901408d641a0901408d641b0901408d641c0901408d641d0901408d641e0901060000000a01060000010a01408d64020a01408d64030a01408d64040a01408d64050a01408d64060a01408d64070a01469e65080a01469e65090a01408d640a0a01347e570b0a01347e570c0a01408d640d0a01408d640e0a01408d640f0a01469e65100a01408d64110a01408d64120a01408d64130a01408d64140a01408d64150a01408d64160a01469e65170a01469e65180a01408d64190a01347e571a0a01347e571b0a01408d641c0a01408d641d0a01408d641e0a01060000000b01060000010b01408d64020b01408d64030b01469e65040b01469e65050b01408d64060b01469e65070b01469e65080b01469e65090b01408d640a0b01347e570b0b01408d640c0b01469e650d0b01469e650e0b01408d640f0b01469e65100b01408d64110b01408d64120b01469e65130b01469e65140b01408d64150b01469e65160b01469e65170b01469e65180b01408d64190b01347e571a0b01408d641b0b01469e651c0b01469e651d0b01408d641e0b01060000000c01060000010c01408d64020c01469e65030c01469e65040c01469e65050c01408d64060c01469e65070c01469e65080c01408d64090c01408d640a0c01408d640b0c01408d640c0c01469e650d0c01469e650e0c01469e650f0c01408d64100c01408d64110c01469e65120c01469e65130c01469e65140c01408d64150c01469e65160c01469e65170c01408d64180c01408d64190c01408d641a0c01408d641b0c01469e651c0c01469e651d0c01469e651e0c01060000000d01060000010d01408d64020d01469e65030d01469e65040d01408d64050d01408d64060d01408d64070d01408d64080d01408d64090d01408d640a0d01408d640b0d01408d640c0d01408d640d0d01469e650e0d01469e650f0d01408d64100d01408d64110d01469e65120d01469e65130d01408d64140d01408d64150d01408d64160d01408d64170d01408d64180d01408d64190d01408d641a0d01408d641b0d01408d641c0d01469e651d0d01469e651e0d01060000000e01060000010e01408d64020e01469e65030e01469e65040e01408d64050e01347e57060e01408d64070e01469e65080e01469e65090e01469e650a0e01408d640b0e01469e650c0e01469e650d0e01408d640e0e01408d640f0e01469e65100e01408d64110e01469e65120e01469e65130e01408d64140e01347e57150e01408d64160e01469e65170e01469e65180e01469e65190e01408d641a0e01469e651b0e01469e651c0e01408d641d0e01408d641e0e01060000000f01060000010f01469e65020f01469e65030f01469e65040f01408d64050f01408d64060f01408d64070f01469e65080f01469e65090f01408d640a0f01408d640b0f01408d640c0f01408d640d0f01408d640e0f01408d640f0f01408d64100f01469e65110f01469e65120f01469e65130f01408d64140f01408d64150f01408d64160f01469e65170f01469e65180f01408d64190f01408d641a0f01408d641b0f01408d641c0f01408d641d0f01408d641e0f01060000001001060000011001469e65021001469e65031001408d64041001469e65051001469e65061001408d64071001408d64081001408d64091001408d640a1001408d640b1001408d640c1001469e650d1001469e650e1001469e650f1001408d64101001469e65111001469e65121001408d64131001469e65141001469e65151001408d64161001408d64171001408d64181001408d64191001408d641a1001408d641b1001469e651c1001469e651d1001469e651e1001060000001101060000011101408d64021101408d64031101408d64041101469e65051101469e65061101408d64071101408d64081101408d64091101469e650a1101469e650b1101408d640c1101469e650d1101469e650e1101469e650f1101408d64101101408d64111101408d64121101408d64131101469e65141101469e65151101408d64161101408d64171101408d64181101469e65191101469e651a1101408d641b1101469e651c1101469e651d1101469e651e1101060000001201060000011201469e65021201408d64031201408d64041201408d64051201408d64061201408d64071201408d64081201469e65091201469e650a1201469e650b1201408d640c1201408d640d1201469e650e1201469e650f1201408d64101201469e65111201408d64121201408d64131201408d64141201408d64151201408d64161201408d64171201469e65181201469e65191201469e651a1201408d641b1201408d641c1201469e651d1201469e651e1201060000001301060000011301469e65021301469e65031301347e57041301408d64051301469e65061301469e65071301408d64081301469e65091301469e650a1301408d640b1301408d640c1301408d640d1301347e570e1301347e570f1301469e65101301469e65111301469e65121301347e57131301408d64141301469e65151301469e65161301408d64171301469e65181301469e65191301408d641a1301408d641b1301408d641c1301347e571d1301347e571e1301060000001401060000011401469e65021401408d64031401347e57041401347e57051401469e65061401469e65071401408d64081401408d64091401347e570a1401408d640b1401408d640c1401408d640d1401408d640e1401347e570f1401469e65101401469e65111401408d64121401347e57131401347e57141401469e65151401469e65161401408d64171401408d64181401347e57191401408d641a1401408d641b1401408d641c1401408d641d1401347e571e1401060000001501060000011501060000021501408d64031501408d64041501408d64051501408d64061501408d64071501408d64081501408d64091501347e570a1501347e570b1501408d640c1501469e650d1501469e650e1501408d640f1501408d64101501408d64111501408d64121501408d64131501408d64141501408d64151501408d64161501408d64171501408d64181501347e57191501347e571a1501408d641b1501469e651c1501469e651d15010600001e1501060000021601060000031601060000041601408d64051601408d64061601469e65071601469e65081601408d64091601469e650a1601469e650b1601408d640c1601469e650d1601469e650e1601469e650f1601347e57101601347e57111601469e65121601469e65131601408d64141601408d64151601469e65161601469e65171601408d64181601469e65191601469e651a1601408d641b16010600001c1601060000041701060000051701060000061701469e65071701469e65081701408d64091701469e650a1701469e650b1701408d640c1701408d640d1701469e650e1701469e650f1701347e57101701408d64111701469e65121701469e65131701408d64141701469e65151701469e65161701469e65171701408d64181701469e651917010600001a1701060000061801060000071801060000081801408d64091801408d640a1801408d640b1801408d640c1801408d640d1801408d640e1801408d640f1801408d64101801408d64111801408d64121801408d64131801408d64141801469e65151801469e65161801408d641718010600001818010600000819010600000919010600000a1901347e570b1901347e570c1901408d640d1901408d640e1901408d640f1901469e65101901408d64111901408d64121901408d64131901408d64141901408d641519010600001619010600000a1a010600000b1a010600000c1a01469e650d1a01469e650e1a01408d640f1a01469e65101a01408d64111a01408d64121a01469e65131a01060000141a010600000c1b010600000d1b010600000e1b01469e650f1b01408d64101b01408d64111b01060000121b010600000e1c010600000f1c01060000101c01060000");
    const Web$Kaelin$Assets$tile$effect$light_red1 = VoxBox$parse$("0e01028e67560f01028e675610010298765d0c020298765d0d020298765d0e020298765d0f02028e675610020298765d11020298765d1202028e67560a030298765d0b03028e67560c030298765d0d030298765d0e030298765d0f03028e67561003028e67561103028e67561203028e675613030298765d14030298765d08040298765d09040298765d0a040298765d0b04028e67560c04028e67560d040298765d0e040298765d0f04028e675610040298765d1104028e67561204028e67561304028e67561404028e67561504028e67561604028e675606050298765d0705028e675608050298765d09050298765d0a05028e67560b05028e67560c05028e67560d05028159490e05028159490f050298765d10050298765d11050298765d1205028159491305028e675614050298765d15050298765d1605028e675617050298765d18050298765d04060281594905060298765d06060298765d0706028e67560806028e67560906028159490a06028e67560b06028e67560c06028e67560d06028e67560e06028159490f060298765d10060298765d1106028e675612060281594913060281594914060298765d15060298765d1606028e67561706028e67561806028159491906028e67561a06028e67560207028e67560307028e67560407028e67560507028e67560607028e67560707028e67560807028e67560907028159490a07028159490b07028e67560c070298765d0d070298765d0e07028e67560f07028e67561007028e67561107028e67561207028e67561307028e67561407028e67561507028e67561607028e67561707028e67561807028159491907028159491a07028e67561b070298765d1c070298765d0108028e675602080298765d03080298765d0408028e675605080298765d06080298765d07080298765d0808028e675609080298765d0a080298765d0b08028e67560c08028e67560d080298765d0e080298765d0f08028159491008028e675611080298765d12080298765d1308028e675614080298765d15080298765d16080298765d1708028e675618080298765d19080298765d1a08028e67561b08028e67561c080298765d1d080298765d0109028e67560209028e67560309028e67560409028e675605090298765d06090298765d0709028e67560809028e67560909028e67560a09028e67560b09028e67560c09028e67560d09028e67560e09028e67560f09028e67561009028e67561109028e67561209028e67561309028e675614090298765d15090298765d1609028e67561709028e67561809028e67561909028e67561a09028e67561b09028e67561c09028e67561d09028e6756010a028e6756020a028e6756030a028e6756040a028e6756050a028e6756060a028e6756070a0298765d080a0298765d090a028e67560a0a028159490b0a028159490c0a028e67560d0a028e67560e0a028e67560f0a0298765d100a028e6756110a028e6756120a028e6756130a028e6756140a028e6756150a028e6756160a0298765d170a0298765d180a028e6756190a028159491a0a028159491b0a028e67561c0a028e67561d0a028e6756010b028e6756020b028e6756030b0298765d040b0298765d050b028e6756060b0298765d070b0298765d080b0298765d090b028e67560a0b028159490b0b028e67560c0b0298765d0d0b0298765d0e0b028e67560f0b0298765d100b028e6756110b028e6756120b0298765d130b0298765d140b028e6756150b0298765d160b0298765d170b0298765d180b028e6756190b028159491a0b028e67561b0b0298765d1c0b0298765d1d0b028e6756010c028e6756020c0298765d030c0298765d040c0298765d050c028e6756060c0298765d070c0298765d080c028e6756090c028e67560a0c028e67560b0c028e67560c0c0298765d0d0c0298765d0e0c0298765d0f0c028e6756100c028e6756110c0298765d120c0298765d130c0298765d140c028e6756150c0298765d160c0298765d170c028e6756180c028e6756190c028e67561a0c028e67561b0c0298765d1c0c0298765d1d0c0298765d010d028e6756020d0298765d030d0298765d040d028e6756050d028e6756060d028e6756070d028e6756080d028e6756090d028e67560a0d028e67560b0d028e67560c0d028e67560d0d0298765d0e0d0298765d0f0d028e6756100d028e6756110d0298765d120d0298765d130d028e6756140d028e6756150d028e6756160d028e6756170d028e6756180d028e6756190d028e67561a0d028e67561b0d028e67561c0d0298765d1d0d0298765d010e028e6756020e0298765d030e0298765d040e028e6756050e02815949060e028e6756070e0298765d080e0298765d090e0298765d0a0e028e67560b0e0298765d0c0e0298765d0d0e028e67560e0e028e67560f0e0298765d100e028e6756110e0298765d120e0298765d130e028e6756140e02815949150e028e6756160e0298765d170e0298765d180e0298765d190e028e67561a0e0298765d1b0e0298765d1c0e028e67561d0e028e6756010f0298765d020f0298765d030f0298765d040f028e6756050f028e6756060f028e6756070f0298765d080f0298765d090f028e67560a0f028e67560b0f028e67560c0f028e67560d0f028e67560e0f028e67560f0f028e6756100f0298765d110f0298765d120f0298765d130f028e6756140f028e6756150f028e6756160f0298765d170f0298765d180f028e6756190f028e67561a0f028e67561b0f028e67561c0f028e67561d0f028e675601100298765d02100298765d0310028e675604100298765d05100298765d0610028e67560710028e67560810028e67560910028e67560a10028e67560b10028e67560c100298765d0d100298765d0e100298765d0f10028e675610100298765d11100298765d1210028e675613100298765d14100298765d1510028e67561610028e67561710028e67561810028e67561910028e67561a10028e67561b100298765d1c100298765d1d100298765d0111028e67560211028e67560311028e675604110298765d05110298765d0611028e67560711028e67560811028e675609110298765d0a110298765d0b11028e67560c110298765d0d110298765d0e110298765d0f11028e67561011028e67561111028e67561211028e675613110298765d14110298765d1511028e67561611028e67561711028e675618110298765d19110298765d1a11028e67561b110298765d1c110298765d1d110298765d01120298765d0212028e67560312028e67560412028e67560512028e67560612028e67560712028e675608120298765d09120298765d0a120298765d0b12028e67560c12028e67560d120298765d0e120298765d0f12028e675610120298765d1112028e67561212028e67561312028e67561412028e67561512028e67561612028e675617120298765d18120298765d19120298765d1a12028e67561b12028e67561c120298765d1d120298765d01130298765d02130298765d0313028159490413028e675605130298765d06130298765d0713028e675608130298765d09130298765d0a13028e67560b13028e67560c13028e67560d13028159490e13028159490f130298765d10130298765d11130298765d1213028159491313028e675614130298765d15130298765d1613028e675617130298765d18130298765d1913028e67561a13028e67561b13028e67561c13028159491d130281594901140298765d0214028e675603140281594904140281594905140298765d06140298765d0714028e67560814028e67560914028159490a14028e67560b14028e67560c14028e67560d14028e67560e14028159490f140298765d10140298765d1114028e675612140281594913140281594914140298765d15140298765d1614028e67561714028e67561814028159491914028e67561a14028e67561b14028e67561c14028e67561d14028159490215028e67560315028e67560415028e67560515028e67560615028e67560715028e67560815028e67560915028159490a15028159490b15028e67560c150298765d0d150298765d0e15028e67560f15028e67561015028e67561115028e67561215028e67561315028e67561415028e67561515028e67561615028e67561715028e67561815028159491915028159491a15028e67561b150298765d1c150298765d0416028e67560516028e675606160298765d07160298765d0816028e675609160298765d0a160298765d0b16028e67560c160298765d0d160298765d0e160298765d0f160281594910160281594911160298765d12160298765d1316028e67561416028e675615160298765d16160298765d1716028e675618160298765d19160298765d1a16028e675606170298765d07170298765d0817028e675609170298765d0a170298765d0b17028e67560c17028e67560d170298765d0e170298765d0f17028159491017028e675611170298765d12170298765d1317028e675614170298765d15170298765d16170298765d1717028e675618170298765d0818028e67560918028e67560a18028e67560b18028e67560c18028e67560d18028e67560e18028e67560f18028e67561018028e67561118028e67561218028e67561318028e675614180298765d15180298765d1618028e67560a19028159490b19028159490c19028e67560d19028e67560e19028e67560f190298765d1019028e67561119028e67561219028e67561319028e67561419028e67560c1a0298765d0d1a0298765d0e1a028e67560f1a0298765d101a028e6756111a028e6756121a0298765d0e1b0298765d0f1b028e6756101b028e6756");
    const Web$Kaelin$Assets$tile$effect$blue_green1 = VoxBox$parse$("0e01022b91880f01022b918810010230a18f0c020230a18f0d020230a18f0e020230a18f0f02022b918810020230a18f11020230a18f1202022b91880a030230a18f0b03022b91880c030230a18f0d030230a18f0e030230a18f0f03022b91881003022b91881103022b91881203022b918813030230a18f14030230a18f08040230a18f09040230a18f0a040230a18f0b04022b91880c04022b91880d040230a18f0e040230a18f0f04022b918810040230a18f1104022b91881204022b91881304022b91881404022b91881504022b91881604022b918806050230a18f0705022b918808050230a18f09050230a18f0a05022b91880b05022b91880c05022b91880d05022380760e05022380760f050230a18f10050230a18f11050230a18f1205022380761305022b918814050230a18f15050230a18f1605022b918817050230a18f18050230a18f04060223807605060230a18f06060230a18f0706022b91880806022b91880906022380760a06022b91880b06022b91880c06022b91880d06022b91880e06022380760f060230a18f10060230a18f1106022b918812060223807613060223807614060230a18f15060230a18f1606022b91881706022b91881806022380761906022b91881a06022b91880207022b91880307022b91880407022b91880507022b91880607022b91880707022b91880807022b91880907022380760a07022380760b07022b91880c070230a18f0d070230a18f0e07022b91880f07022b91881007022b91881107022b91881207022b91881307022b91881407022b91881507022b91881607022b91881707022b91881807022380761907022380761a07022b91881b070230a18f1c070230a18f0108022b918802080230a18f03080230a18f0408022b918805080230a18f06080230a18f07080230a18f0808022b918809080230a18f0a080230a18f0b08022b91880c08022b91880d080230a18f0e080230a18f0f08022380761008022b918811080230a18f12080230a18f1308022b918814080230a18f15080230a18f16080230a18f1708022b918818080230a18f19080230a18f1a08022b91881b08022b91881c080230a18f1d080230a18f0109022b91880209022b91880309022b91880409022b918805090230a18f06090230a18f0709022b91880809022b91880909022b91880a09022b91880b09022b91880c09022b91880d09022b91880e09022b91880f09022b91881009022b91881109022b91881209022b91881309022b918814090230a18f15090230a18f1609022b91881709022b91881809022b91881909022b91881a09022b91881b09022b91881c09022b91881d09022b9188010a022b9188020a022b9188030a022b9188040a022b9188050a022b9188060a022b9188070a0230a18f080a0230a18f090a022b91880a0a022380760b0a022380760c0a022b91880d0a022b91880e0a022b91880f0a0230a18f100a022b9188110a022b9188120a022b9188130a022b9188140a022b9188150a022b9188160a0230a18f170a0230a18f180a022b9188190a022380761a0a022380761b0a022b91881c0a022b91881d0a022b9188010b022b9188020b022b9188030b0230a18f040b0230a18f050b022b9188060b0230a18f070b0230a18f080b0230a18f090b022b91880a0b022380760b0b022b91880c0b0230a18f0d0b0230a18f0e0b022b91880f0b0230a18f100b022b9188110b022b9188120b0230a18f130b0230a18f140b022b9188150b0230a18f160b0230a18f170b0230a18f180b022b9188190b022380761a0b022b91881b0b0230a18f1c0b0230a18f1d0b022b9188010c022b9188020c0230a18f030c0230a18f040c0230a18f050c022b9188060c0230a18f070c0230a18f080c022b9188090c022b91880a0c022b91880b0c022b91880c0c0230a18f0d0c0230a18f0e0c0230a18f0f0c022b9188100c022b9188110c0230a18f120c0230a18f130c0230a18f140c022b9188150c0230a18f160c0230a18f170c022b9188180c022b9188190c022b91881a0c022b91881b0c0230a18f1c0c0230a18f1d0c0230a18f010d022b9188020d0230a18f030d0230a18f040d022b9188050d022b9188060d022b9188070d022b9188080d022b9188090d022b91880a0d022b91880b0d022b91880c0d022b91880d0d0230a18f0e0d0230a18f0f0d022b9188100d022b9188110d0230a18f120d0230a18f130d022b9188140d022b9188150d022b9188160d022b9188170d022b9188180d022b9188190d022b91881a0d022b91881b0d022b91881c0d0230a18f1d0d0230a18f010e022b9188020e0230a18f030e0230a18f040e022b9188050e02238076060e022b9188070e0230a18f080e0230a18f090e0230a18f0a0e022b91880b0e0230a18f0c0e0230a18f0d0e022b91880e0e022b91880f0e0230a18f100e022b9188110e0230a18f120e0230a18f130e022b9188140e02238076150e022b9188160e0230a18f170e0230a18f180e0230a18f190e022b91881a0e0230a18f1b0e0230a18f1c0e022b91881d0e022b9188010f0230a18f020f0230a18f030f0230a18f040f022b9188050f022b9188060f022b9188070f0230a18f080f0230a18f090f022b91880a0f022b91880b0f022b91880c0f022b91880d0f022b91880e0f022b91880f0f022b9188100f0230a18f110f0230a18f120f0230a18f130f022b9188140f022b9188150f022b9188160f0230a18f170f0230a18f180f022b9188190f022b91881a0f022b91881b0f022b91881c0f022b91881d0f022b918801100230a18f02100230a18f0310022b918804100230a18f05100230a18f0610022b91880710022b91880810022b91880910022b91880a10022b91880b10022b91880c100230a18f0d100230a18f0e100230a18f0f10022b918810100230a18f11100230a18f1210022b918813100230a18f14100230a18f1510022b91881610022b91881710022b91881810022b91881910022b91881a10022b91881b100230a18f1c100230a18f1d100230a18f0111022b91880211022b91880311022b918804110230a18f05110230a18f0611022b91880711022b91880811022b918809110230a18f0a110230a18f0b11022b91880c110230a18f0d110230a18f0e110230a18f0f11022b91881011022b91881111022b91881211022b918813110230a18f14110230a18f1511022b91881611022b91881711022b918818110230a18f19110230a18f1a11022b91881b110230a18f1c110230a18f1d110230a18f01120230a18f0212022b91880312022b91880412022b91880512022b91880612022b91880712022b918808120230a18f09120230a18f0a120230a18f0b12022b91880c12022b91880d120230a18f0e120230a18f0f12022b918810120230a18f1112022b91881212022b91881312022b91881412022b91881512022b91881612022b918817120230a18f18120230a18f19120230a18f1a12022b91881b12022b91881c120230a18f1d120230a18f01130230a18f02130230a18f0313022380760413022b918805130230a18f06130230a18f0713022b918808130230a18f09130230a18f0a13022b91880b13022b91880c13022b91880d13022380760e13022380760f130230a18f10130230a18f11130230a18f1213022380761313022b918814130230a18f15130230a18f1613022b918817130230a18f18130230a18f1913022b91881a13022b91881b13022b91881c13022380761d130223807601140230a18f0214022b918803140223807604140223807605140230a18f06140230a18f0714022b91880814022b91880914022380760a14022b91880b14022b91880c14022b91880d14022b91880e14022380760f140230a18f10140230a18f1114022b918812140223807613140223807614140230a18f15140230a18f1614022b91881714022b91881814022380761914022b91881a14022b91881b14022b91881c14022b91881d14022380760215022b91880315022b91880415022b91880515022b91880615022b91880715022b91880815022b91880915022380760a15022380760b15022b91880c150230a18f0d150230a18f0e15022b91880f15022b91881015022b91881115022b91881215022b91881315022b91881415022b91881515022b91881615022b91881715022b91881815022380761915022380761a15022b91881b150230a18f1c150230a18f0416022b91880516022b918806160230a18f07160230a18f0816022b918809160230a18f0a160230a18f0b16022b91880c160230a18f0d160230a18f0e160230a18f0f160223807610160223807611160230a18f12160230a18f1316022b91881416022b918815160230a18f16160230a18f1716022b918818160230a18f19160230a18f1a16022b918806170230a18f07170230a18f0817022b918809170230a18f0a170230a18f0b17022b91880c17022b91880d170230a18f0e170230a18f0f17022380761017022b918811170230a18f12170230a18f1317022b918814170230a18f15170230a18f16170230a18f1717022b918818170230a18f0818022b91880918022b91880a18022b91880b18022b91880c18022b91880d18022b91880e18022b91880f18022b91881018022b91881118022b91881218022b91881318022b918814180230a18f15180230a18f1618022b91880a19022380760b19022380760c19022b91880d19022b91880e19022b91880f190230a18f1019022b91881119022b91881219022b91881319022b91881419022b91880c1a0230a18f0d1a0230a18f0e1a022b91880f1a0230a18f101a022b9188111a022b9188121a0230a18f0e1b0230a18f0f1b022b9188101b022b9188");

    function Web$Kaelin$Terrain$grass$(_normal$1, _ability$2, _movement$3) {
        var $448 = ({
            _: 'Web.Kaelin.Terrain.grass',
            'normal': _normal$1,
            'ability': _ability$2,
            'movement': _movement$3
        });
        return $448;
    };
    const Web$Kaelin$Terrain$grass = x0 => x1 => x2 => Web$Kaelin$Terrain$grass$(x0, x1, x2);

    function Web$Kaelin$Entity$background$(_terrain$1) {
        var $449 = ({
            _: 'Web.Kaelin.Entity.background',
            'terrain': _terrain$1
        });
        return $449;
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
        var $450 = (((_n$1) >> 0));
        return $450;
    };
    const U32$to_i32 = x0 => U32$to_i32$(x0);

    function Web$Kaelin$Coord$Cubic$new$(_x$1, _y$2, _z$3) {
        var $451 = ({
            _: 'Web.Kaelin.Coord.Cubic.new',
            'x': _x$1,
            'y': _y$2,
            'z': _z$3
        });
        return $451;
    };
    const Web$Kaelin$Coord$Cubic$new = x0 => x1 => x2 => Web$Kaelin$Coord$Cubic$new$(x0, x1, x2);

    function Web$Kaelin$Coord$Convert$axial_to_cubic$(_coord$1) {
        var self = _coord$1;
        switch (self._) {
            case 'Web.Kaelin.Coord.new':
                var $453 = self.i;
                var $454 = self.j;
                var _x$4 = $453;
                var _z$5 = $454;
                var _y$6 = ((((-_x$4)) - _z$5) >> 0);
                var $455 = Web$Kaelin$Coord$Cubic$new$(_x$4, _y$6, _z$5);
                var $452 = $455;
                break;
        };
        return $452;
    };
    const Web$Kaelin$Coord$Convert$axial_to_cubic = x0 => Web$Kaelin$Coord$Convert$axial_to_cubic$(x0);

    function I32$abs$(_a$1) {
        var self = _a$1;
        switch ('i32') {
            case 'i32':
                var $457 = i32_to_word(self);
                var $458 = I32$new$(Word$abs$($457));
                var $456 = $458;
                break;
        };
        return $456;
    };
    const I32$abs = x0 => I32$abs$(x0);

    function Cmp$as_gtn$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
            case 'Cmp.eql':
                var $460 = Bool$false;
                var $459 = $460;
                break;
            case 'Cmp.gtn':
                var $461 = Bool$true;
                var $459 = $461;
                break;
        };
        return $459;
    };
    const Cmp$as_gtn = x0 => Cmp$as_gtn$(x0);

    function Cmp$inv$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
                var $463 = Cmp$gtn;
                var $462 = $463;
                break;
            case 'Cmp.eql':
                var $464 = Cmp$eql;
                var $462 = $464;
                break;
            case 'Cmp.gtn':
                var $465 = Cmp$ltn;
                var $462 = $465;
                break;
        };
        return $462;
    };
    const Cmp$inv = x0 => Cmp$inv$(x0);

    function Word$s_gtn$(_a$2, _b$3) {
        var _neg_a$4 = Word$is_neg$(_a$2);
        var _neg_b$5 = Word$is_neg$(_b$3);
        var self = _neg_a$4;
        if (self) {
            var self = _neg_b$5;
            if (self) {
                var $468 = Cmp$as_gtn$(Cmp$inv$(Word$cmp$(_a$2, _b$3)));
                var $467 = $468;
            } else {
                var $469 = Bool$false;
                var $467 = $469;
            };
            var $466 = $467;
        } else {
            var self = _neg_b$5;
            if (self) {
                var $471 = Bool$true;
                var $470 = $471;
            } else {
                var $472 = Cmp$as_gtn$(Word$cmp$(_a$2, _b$3));
                var $470 = $472;
            };
            var $466 = $470;
        };
        return $466;
    };
    const Word$s_gtn = x0 => x1 => Word$s_gtn$(x0, x1);
    const I32$gtn = a0 => a1 => (a0 > a1);

    function I32$max$(_a$1, _b$2) {
        var self = (_a$1 > _b$2);
        if (self) {
            var $474 = _a$1;
            var $473 = $474;
        } else {
            var $475 = _b$2;
            var $473 = $475;
        };
        return $473;
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
        var $476 = (((_n$1) >>> 0));
        return $476;
    };
    const I32$to_u32 = x0 => I32$to_u32$(x0);

    function Cmp$as_lte$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
            case 'Cmp.eql':
                var $478 = Bool$true;
                var $477 = $478;
                break;
            case 'Cmp.gtn':
                var $479 = Bool$false;
                var $477 = $479;
                break;
        };
        return $477;
    };
    const Cmp$as_lte = x0 => Cmp$as_lte$(x0);

    function Word$lte$(_a$2, _b$3) {
        var $480 = Cmp$as_lte$(Word$cmp$(_a$2, _b$3));
        return $480;
    };
    const Word$lte = x0 => x1 => Word$lte$(x0, x1);
    const U32$lte = a0 => a1 => (a0 <= a1);

    function Web$Kaelin$Coord$fit$(_coord$1, _map_size$2) {
        var _coord$3 = Web$Kaelin$Coord$Convert$axial_to_cubic$(_coord$1);
        var self = _coord$3;
        switch (self._) {
            case 'Web.Kaelin.Coord.Cubic.new':
                var $482 = self.x;
                var $483 = self.y;
                var $484 = self.z;
                var _x$7 = I32$abs$($482);
                var _y$8 = I32$abs$($483);
                var _z$9 = I32$abs$($484);
                var _greater$10 = I32$max$(_x$7, I32$max$(_y$8, _z$9));
                var _greater$11 = I32$to_u32$(_greater$10);
                var $485 = (_greater$11 <= _map_size$2);
                var $481 = $485;
                break;
        };
        return $481;
    };
    const Web$Kaelin$Coord$fit = x0 => x1 => Web$Kaelin$Coord$fit$(x0, x1);
    const Web$Kaelin$Map$arena = (() => {
        var _map$1 = NatMap$new;
        var _map_size$2 = Web$Kaelin$Constants$map_size;
        var _width$3 = ((((_map_size$2 * 2) >>> 0) + 1) >>> 0);
        var _height$4 = ((((_map_size$2 * 2) >>> 0) + 1) >>> 0);
        var _Normal$5 = Web$Kaelin$Assets$tile$green_2;
        var _Casting$6 = Web$Kaelin$Assets$tile$effect$light_red1;
        var _Moving$7 = Web$Kaelin$Assets$tile$effect$blue_green1;
        var _new_terrain$8 = Web$Kaelin$Terrain$grass$(_Normal$5, _Casting$6, _Moving$7);
        var _new_terrain$9 = Web$Kaelin$Entity$background$(_new_terrain$8);
        var _map$10 = (() => {
            var $487 = _map$1;
            var $488 = 0;
            var $489 = _height$4;
            let _map$11 = $487;
            for (let _j$10 = $488; _j$10 < $489; ++_j$10) {
                var _map$12 = (() => {
                    var $490 = _map$11;
                    var $491 = 0;
                    var $492 = _width$3;
                    let _map$13 = $490;
                    for (let _i$12 = $491; _i$12 < $492; ++_i$12) {
                        var _coord_i$14 = ((U32$to_i32$(_i$12) - U32$to_i32$(_map_size$2)) >> 0);
                        var _coord_j$15 = ((U32$to_i32$(_j$10) - U32$to_i32$(_map_size$2)) >> 0);
                        var _coord$16 = Web$Kaelin$Coord$new$(_coord_i$14, _coord_j$15);
                        var _fit$17 = Web$Kaelin$Coord$fit$(_coord$16, _map_size$2);
                        var self = _fit$17;
                        if (self) {
                            var $493 = Web$Kaelin$Map$push$(_coord$16, _new_terrain$9, _map$13);
                            var $490 = $493;
                        } else {
                            var $494 = _map$13;
                            var $490 = $494;
                        };
                        _map$13 = $490;
                    };
                    return _map$13;
                })();
                var $487 = _map$12;
                _map$11 = $487;
            };
            return _map$11;
        })();
        var $486 = _map$10;
        return $486;
    })();

    function App$EnvInfo$new$(_screen_size$1, _mouse_pos$2) {
        var $495 = ({
            _: 'App.EnvInfo.new',
            'screen_size': _screen_size$1,
            'mouse_pos': _mouse_pos$2
        });
        return $495;
    };
    const App$EnvInfo$new = x0 => x1 => App$EnvInfo$new$(x0, x1);

    function Web$Kaelin$State$game$(_room$1, _tick$2, _players$3, _cast_info$4, _map$5, _interface$6) {
        var $496 = ({
            _: 'Web.Kaelin.State.game',
            'room': _room$1,
            'tick': _tick$2,
            'players': _players$3,
            'cast_info': _cast_info$4,
            'map': _map$5,
            'interface': _interface$6
        });
        return $496;
    };
    const Web$Kaelin$State$game = x0 => x1 => x2 => x3 => x4 => x5 => Web$Kaelin$State$game$(x0, x1, x2, x3, x4, x5);
    const Web$Kaelin$App$init = (() => {
        var _room$1 = Web$Kaelin$Constants$room;
        var _tick$2 = 0n;
        var _players$3 = Map$from_list$(List$nil);
        var _cast_info$4 = Maybe$none;
        var _map$5 = Web$Kaelin$Map$init$(Web$Kaelin$Map$arena);
        var _interface$6 = App$EnvInfo$new$(Pair$new$(256, 256), Pair$new$(0, 0));
        var $497 = Web$Kaelin$State$game$(_room$1, _tick$2, _players$3, _cast_info$4, _map$5, _interface$6);
        return $497;
    })();

    function DOM$text$(_value$1) {
        var $498 = ({
            _: 'DOM.text',
            'value': _value$1
        });
        return $498;
    };
    const DOM$text = x0 => DOM$text$(x0);

    function DOM$vbox$(_props$1, _style$2, _value$3) {
        var $499 = ({
            _: 'DOM.vbox',
            'props': _props$1,
            'style': _style$2,
            'value': _value$3
        });
        return $499;
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
                        var $500 = self.head;
                        var $501 = self.tail;
                        var $502 = List$reverse$go$($501, List$cons$($500, _res$3));
                        return $502;
                    case 'List.nil':
                        var $503 = _res$3;
                        return $503;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const List$reverse$go = x0 => x1 => List$reverse$go$(x0, x1);

    function List$reverse$(_xs$2) {
        var $504 = List$reverse$go$(_xs$2, List$nil);
        return $504;
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
                        var $505 = self.slice(0, -1);
                        var $506 = Bits$reverse$tco$($505, (_r$2 + '0'));
                        return $506;
                    case 'i':
                        var $507 = self.slice(0, -1);
                        var $508 = Bits$reverse$tco$($507, (_r$2 + '1'));
                        return $508;
                    case 'e':
                        var $509 = _r$2;
                        return $509;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Bits$reverse$tco = x0 => x1 => Bits$reverse$tco$(x0, x1);

    function Bits$reverse$(_a$1) {
        var $510 = Bits$reverse$tco$(_a$1, Bits$e);
        return $510;
    };
    const Bits$reverse = x0 => Bits$reverse$(x0);

    function BitsMap$to_list$go$(_xs$2, _key$3, _list$4) {
        var self = _xs$2;
        switch (self._) {
            case 'BitsMap.tie':
                var $512 = self.val;
                var $513 = self.lft;
                var $514 = self.rgt;
                var self = $512;
                switch (self._) {
                    case 'Maybe.some':
                        var $516 = self.value;
                        var $517 = List$cons$(Pair$new$(Bits$reverse$(_key$3), $516), _list$4);
                        var _list0$8 = $517;
                        break;
                    case 'Maybe.none':
                        var $518 = _list$4;
                        var _list0$8 = $518;
                        break;
                };
                var _list1$9 = BitsMap$to_list$go$($513, (_key$3 + '0'), _list0$8);
                var _list2$10 = BitsMap$to_list$go$($514, (_key$3 + '1'), _list1$9);
                var $515 = _list2$10;
                var $511 = $515;
                break;
            case 'BitsMap.new':
                var $519 = _list$4;
                var $511 = $519;
                break;
        };
        return $511;
    };
    const BitsMap$to_list$go = x0 => x1 => x2 => BitsMap$to_list$go$(x0, x1, x2);

    function List$mapped$(_as$2, _f$4) {
        var self = _as$2;
        switch (self._) {
            case 'List.cons':
                var $521 = self.head;
                var $522 = self.tail;
                var $523 = List$cons$(_f$4($521), List$mapped$($522, _f$4));
                var $520 = $523;
                break;
            case 'List.nil':
                var $524 = List$nil;
                var $520 = $524;
                break;
        };
        return $520;
    };
    const List$mapped = x0 => x1 => List$mapped$(x0, x1);

    function Bits$to_nat$(_b$1) {
        var self = _b$1;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'o':
                var $526 = self.slice(0, -1);
                var $527 = (2n * Bits$to_nat$($526));
                var $525 = $527;
                break;
            case 'i':
                var $528 = self.slice(0, -1);
                var $529 = Nat$succ$((2n * Bits$to_nat$($528)));
                var $525 = $529;
                break;
            case 'e':
                var $530 = 0n;
                var $525 = $530;
                break;
        };
        return $525;
    };
    const Bits$to_nat = x0 => Bits$to_nat$(x0);

    function NatMap$to_list$(_xs$2) {
        var _kvs$3 = List$reverse$(BitsMap$to_list$go$(_xs$2, Bits$e, List$nil));
        var $531 = List$mapped$(_kvs$3, (_kv$4 => {
            var self = _kv$4;
            switch (self._) {
                case 'Pair.new':
                    var $533 = self.fst;
                    var $534 = self.snd;
                    var $535 = Pair$new$(Bits$to_nat$($533), $534);
                    var $532 = $535;
                    break;
            };
            return $532;
        }));
        return $531;
    };
    const NatMap$to_list = x0 => NatMap$to_list$(x0);
    const List$for = a0 => a1 => a2 => (list_for(a0)(a1)(a2));

    function Pair$fst$(_pair$3) {
        var self = _pair$3;
        switch (self._) {
            case 'Pair.new':
                var $537 = self.fst;
                var $538 = $537;
                var $536 = $538;
                break;
        };
        return $536;
    };
    const Pair$fst = x0 => Pair$fst$(x0);

    function Either$(_A$1, _B$2) {
        var $539 = null;
        return $539;
    };
    const Either = x0 => x1 => Either$(x0, x1);

    function Either$left$(_value$3) {
        var $540 = ({
            _: 'Either.left',
            'value': _value$3
        });
        return $540;
    };
    const Either$left = x0 => Either$left$(x0);

    function Either$right$(_value$3) {
        var $541 = ({
            _: 'Either.right',
            'value': _value$3
        });
        return $541;
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
                    var $542 = Either$left$(_n$1);
                    return $542;
                } else {
                    var $543 = (self - 1n);
                    var self = _n$1;
                    if (self === 0n) {
                        var $545 = Either$right$(Nat$succ$($543));
                        var $544 = $545;
                    } else {
                        var $546 = (self - 1n);
                        var $547 = Nat$sub_rem$($546, $543);
                        var $544 = $547;
                    };
                    return $544;
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
                        var $548 = self.value;
                        var $549 = Nat$div_mod$go$($548, _m$2, Nat$succ$(_d$3));
                        return $549;
                    case 'Either.right':
                        var $550 = Pair$new$(_d$3, _n$1);
                        return $550;
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
    const Int$add = a0 => a1 => (a0 + a1);
    const Int$sub = a0 => a1 => (a0 - a1);

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
                    var $551 = Nat$mod$go$(_n$1, _r$3, _m$2);
                    return $551;
                } else {
                    var $552 = (self - 1n);
                    var self = _n$1;
                    if (self === 0n) {
                        var $554 = _r$3;
                        var $553 = $554;
                    } else {
                        var $555 = (self - 1n);
                        var $556 = Nat$mod$go$($555, $552, Nat$succ$(_r$3));
                        var $553 = $556;
                    };
                    return $553;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Nat$mod$go = x0 => x1 => x2 => Nat$mod$go$(x0, x1, x2);
    const Nat$mod = a0 => a1 => (a0 % a1);

    function Web$Kaelin$Coord$Convert$nat_to_axial$(_a$1) {
        var _coord_i$2 = (_a$1 / 10000n);
        var _coord_i$3 = Int$from_nat$(_coord_i$2);
        var _coord_i$4 = (_coord_i$3 - Int$from_nat$(1000n));
        var _coord_j$5 = (_a$1 % 10000n);
        var _coord_j$6 = Int$from_nat$(_coord_j$5);
        var _coord_j$7 = (_coord_j$6 - Int$from_nat$(1000n));
        var _coord_i$8 = Int$to_i32$(_coord_i$4);
        var _coord_j$9 = Int$to_i32$(_coord_j$7);
        var $557 = Web$Kaelin$Coord$new$(_coord_i$8, _coord_j$9);
        return $557;
    };
    const Web$Kaelin$Coord$Convert$nat_to_axial = x0 => Web$Kaelin$Coord$Convert$nat_to_axial$(x0);
    const Web$Kaelin$Constants$hexagon_radius = 15;
    const I32$div = a0 => a1 => ((a0 / a1) >> 0);
    const Web$Kaelin$Constants$center_x = 128;
    const Web$Kaelin$Constants$center_y = 128;

    function Web$Kaelin$Coord$to_screen_xy$(_coord$1) {
        var self = _coord$1;
        switch (self._) {
            case 'Web.Kaelin.Coord.new':
                var $559 = self.i;
                var $560 = self.j;
                var _i$4 = $559;
                var _j$5 = $560;
                var _int_rad$6 = U32$to_i32$(Web$Kaelin$Constants$hexagon_radius);
                var _hlf$7 = ((_int_rad$6 / Int$to_i32$(Int$from_nat$(2n))) >> 0);
                var _int_screen_center_x$8 = U32$to_i32$(Web$Kaelin$Constants$center_x);
                var _int_screen_center_y$9 = U32$to_i32$(Web$Kaelin$Constants$center_y);
                var _cx$10 = ((_int_screen_center_x$8 + ((_j$5 * _int_rad$6) >> 0)) >> 0);
                var _cx$11 = ((_cx$10 + ((_i$4 * ((_int_rad$6 * Int$to_i32$(Int$from_nat$(2n))) >> 0)) >> 0)) >> 0);
                var _cy$12 = ((_int_screen_center_y$9 + ((_j$5 * ((_hlf$7 * Int$to_i32$(Int$from_nat$(3n))) >> 0)) >> 0)) >> 0);
                var _cx$13 = I32$to_u32$(_cx$11);
                var _cy$14 = I32$to_u32$(_cy$12);
                var $561 = Pair$new$(_cx$13, _cy$14);
                var $558 = $561;
                break;
        };
        return $558;
    };
    const Web$Kaelin$Coord$to_screen_xy = x0 => Web$Kaelin$Coord$to_screen_xy$(x0);
    const U32$sub = a0 => a1 => ((a0 - a1) >>> 0);

    function VoxBox$get_len$(_img$1) {
        var self = _img$1;
        switch (self._) {
            case 'VoxBox.new':
                var $563 = self.length;
                var $564 = $563;
                var $562 = $564;
                break;
        };
        return $562;
    };
    const VoxBox$get_len = x0 => VoxBox$get_len$(x0);

    function Array$get$(_idx$3, _arr$4) {
        var $565 = Word$foldl$(Array$extract_tip, (_rec$6 => _arr$7 => {
            var _arr_l$8 = Array$extract_tie$(_arr$7);
            var self = _arr_l$8;
            switch (self._) {
                case 'Pair.new':
                    var $567 = self.fst;
                    var $568 = _rec$6($567);
                    var $566 = $568;
                    break;
            };
            return $566;
        }), (_rec$6 => _arr$7 => {
            var _arr_r$8 = Array$extract_tie$(_arr$7);
            var self = _arr_r$8;
            switch (self._) {
                case 'Pair.new':
                    var $570 = self.snd;
                    var $571 = _rec$6($570);
                    var $569 = $571;
                    break;
            };
            return $569;
        }), _idx$3)(_arr$4);
        return $565;
    };
    const Array$get = x0 => x1 => Array$get$(x0, x1);
    const Buffer32$get = a0 => a1 => ((a1[a0]));
    const VoxBox$get_pos = a0 => a1 => ((a1.buffer[a0 * 2]));
    const VoxBox$get_col = a0 => a1 => ((a1.buffer[a0 * 2 + 1]));

    function Word$and$(_a$2, _b$3) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $573 = self.pred;
                var $574 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $576 = self.pred;
                            var $577 = (_a$pred$9 => {
                                var $578 = Word$o$(Word$and$(_a$pred$9, $576));
                                return $578;
                            });
                            var $575 = $577;
                            break;
                        case 'Word.i':
                            var $579 = self.pred;
                            var $580 = (_a$pred$9 => {
                                var $581 = Word$o$(Word$and$(_a$pred$9, $579));
                                return $581;
                            });
                            var $575 = $580;
                            break;
                        case 'Word.e':
                            var $582 = (_a$pred$7 => {
                                var $583 = Word$e;
                                return $583;
                            });
                            var $575 = $582;
                            break;
                    };
                    var $575 = $575($573);
                    return $575;
                });
                var $572 = $574;
                break;
            case 'Word.i':
                var $584 = self.pred;
                var $585 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $587 = self.pred;
                            var $588 = (_a$pred$9 => {
                                var $589 = Word$o$(Word$and$(_a$pred$9, $587));
                                return $589;
                            });
                            var $586 = $588;
                            break;
                        case 'Word.i':
                            var $590 = self.pred;
                            var $591 = (_a$pred$9 => {
                                var $592 = Word$i$(Word$and$(_a$pred$9, $590));
                                return $592;
                            });
                            var $586 = $591;
                            break;
                        case 'Word.e':
                            var $593 = (_a$pred$7 => {
                                var $594 = Word$e;
                                return $594;
                            });
                            var $586 = $593;
                            break;
                    };
                    var $586 = $586($584);
                    return $586;
                });
                var $572 = $585;
                break;
            case 'Word.e':
                var $595 = (_b$4 => {
                    var $596 = Word$e;
                    return $596;
                });
                var $572 = $595;
                break;
        };
        var $572 = $572(_b$3);
        return $572;
    };
    const Word$and = x0 => x1 => Word$and$(x0, x1);
    const U32$and = a0 => a1 => (a0 & a1);
    const U32$shr = a0 => a1 => (a0 >>> a1);

    function VoxBox$Draw$image$(_x$1, _y$2, _z$3, _src$4, _img$5) {
        var _len$6 = VoxBox$get_len$(_src$4);
        var _img$7 = (() => {
            var $598 = _img$5;
            var $599 = 0;
            var $600 = _len$6;
            let _img$8 = $598;
            for (let _i$7 = $599; _i$7 < $600; ++_i$7) {
                var _pos$9 = ((_src$4.buffer[_i$7 * 2]));
                var _col$10 = ((_src$4.buffer[_i$7 * 2 + 1]));
                var _p_x$11 = (_pos$9 & 4095);
                var _p_y$12 = ((_pos$9 & 16773120) >>> 12);
                var _p_z$13 = ((_pos$9 & 4278190080) >>> 24);
                var _p_x$14 = ((_p_x$11 + _x$1) >>> 0);
                var _p_y$15 = ((_p_y$12 + _y$2) >>> 0);
                var _p_z$16 = ((_p_z$13 + _z$3) >>> 0);
                var _pos$17 = ((0 | _p_x$14 | (_p_y$15 << 12) | (_p_z$16 << 24)));
                var $598 = ((_img$8.buffer[_img$8.length * 2] = _pos$17, _img$8.buffer[_img$8.length * 2 + 1] = _col$10, _img$8.length++, _img$8));
                _img$8 = $598;
            };
            return _img$8;
        })();
        var $597 = _img$7;
        return $597;
    };
    const VoxBox$Draw$image = x0 => x1 => x2 => x3 => x4 => VoxBox$Draw$image$(x0, x1, x2, x3, x4);

    function Web$Kaelin$Draw$state$background$(_map$1, _img$2) {
        var _list$3 = NatMap$to_list$(_map$1);
        var _img$4 = (() => {
            var $603 = _img$2;
            var $604 = _list$3;
            let _img$5 = $603;
            let _pair$4;
            while ($604._ === 'List.cons') {
                _pair$4 = $604.head;
                var self = _pair$4;
                switch (self._) {
                    case 'Pair.new':
                        var $605 = self.fst;
                        var $606 = self.snd;
                        var _coord$8 = Web$Kaelin$Coord$Convert$nat_to_axial$($605);
                        var self = Web$Kaelin$Coord$to_screen_xy$(_coord$8);
                        switch (self._) {
                            case 'Pair.new':
                                var $608 = self.fst;
                                var $609 = self.snd;
                                var _i$11 = (($608 - Web$Kaelin$Constants$hexagon_radius) >>> 0);
                                var _j$12 = (($609 - Web$Kaelin$Constants$hexagon_radius) >>> 0);
                                var _img$13 = (() => {
                                    var $612 = _img$5;
                                    var $613 = $606;
                                    let _img$14 = $612;
                                    let _entity$13;
                                    while ($613._ === 'List.cons') {
                                        _entity$13 = $613.head;
                                        var self = _entity$13;
                                        switch (self._) {
                                            case 'Web.Kaelin.Entity.background':
                                                var $614 = self.terrain;
                                                var self = $614;
                                                switch (self._) {
                                                    case 'Web.Kaelin.Terrain.grass':
                                                        var $616 = self.normal;
                                                        var $617 = VoxBox$Draw$image$(_i$11, _j$12, 0, $616, _img$14);
                                                        var $615 = $617;
                                                        break;
                                                };
                                                var $612 = $615;
                                                break;
                                            case 'Web.Kaelin.Entity.creature':
                                                var $618 = _img$14;
                                                var $612 = $618;
                                                break;
                                        };
                                        _img$14 = $612;
                                        $613 = $613.tail;
                                    }
                                    return _img$14;
                                })();
                                var $610 = _img$13;
                                var $607 = $610;
                                break;
                        };
                        var $603 = $607;
                        break;
                };
                _img$5 = $603;
                $604 = $604.tail;
            }
            return _img$5;
        })();
        var $601 = _img$4;
        return $601;
    };
    const Web$Kaelin$Draw$state$background = x0 => x1 => Web$Kaelin$Draw$state$background$(x0, x1);

    function List$map$(_f$3, _as$4) {
        var self = _as$4;
        switch (self._) {
            case 'List.cons':
                var $620 = self.head;
                var $621 = self.tail;
                var $622 = List$cons$(_f$3($620), List$map$(_f$3, $621));
                var $619 = $622;
                break;
            case 'List.nil':
                var $623 = List$nil;
                var $619 = $623;
                break;
        };
        return $619;
    };
    const List$map = x0 => x1 => List$map$(x0, x1);

    function Web$Kaelin$Coord$Convert$cubic_to_axial$(_coord$1) {
        var self = _coord$1;
        switch (self._) {
            case 'Web.Kaelin.Coord.Cubic.new':
                var $625 = self.x;
                var $626 = self.z;
                var _i$5 = $625;
                var _j$6 = $626;
                var $627 = Web$Kaelin$Coord$new$(_i$5, _j$6);
                var $624 = $627;
                break;
        };
        return $624;
    };
    const Web$Kaelin$Coord$Convert$cubic_to_axial = x0 => Web$Kaelin$Coord$Convert$cubic_to_axial$(x0);

    function Cmp$as_ltn$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
                var $629 = Bool$true;
                var $628 = $629;
                break;
            case 'Cmp.eql':
            case 'Cmp.gtn':
                var $630 = Bool$false;
                var $628 = $630;
                break;
        };
        return $628;
    };
    const Cmp$as_ltn = x0 => Cmp$as_ltn$(x0);

    function Word$s_ltn$(_a$2, _b$3) {
        var _neg_a$4 = Word$is_neg$(_a$2);
        var _neg_b$5 = Word$is_neg$(_b$3);
        var self = _neg_a$4;
        if (self) {
            var self = _neg_b$5;
            if (self) {
                var $633 = Cmp$as_ltn$(Cmp$inv$(Word$cmp$(_a$2, _b$3)));
                var $632 = $633;
            } else {
                var $634 = Bool$true;
                var $632 = $634;
            };
            var $631 = $632;
        } else {
            var self = _neg_b$5;
            if (self) {
                var $636 = Bool$false;
                var $635 = $636;
            } else {
                var $637 = Cmp$as_ltn$(Word$cmp$(_a$2, _b$3));
                var $635 = $637;
            };
            var $631 = $635;
        };
        return $631;
    };
    const Word$s_ltn = x0 => x1 => Word$s_ltn$(x0, x1);
    const I32$ltn = a0 => a1 => (a0 < a1);

    function I32$min$(_a$1, _b$2) {
        var self = (_a$1 < _b$2);
        if (self) {
            var $639 = _a$1;
            var $638 = $639;
        } else {
            var $640 = _b$2;
            var $638 = $640;
        };
        return $638;
    };
    const I32$min = x0 => x1 => I32$min$(x0, x1);

    function Web$Kaelin$Coord$Cubic$add$(_a$1, _b$2) {
        var self = _a$1;
        switch (self._) {
            case 'Web.Kaelin.Coord.Cubic.new':
                var $642 = self.x;
                var $643 = self.y;
                var $644 = self.z;
                var self = _b$2;
                switch (self._) {
                    case 'Web.Kaelin.Coord.Cubic.new':
                        var $646 = self.x;
                        var $647 = self.y;
                        var $648 = self.z;
                        var _x$9 = (($642 + $646) >> 0);
                        var _y$10 = (($643 + $647) >> 0);
                        var _z$11 = (($644 + $648) >> 0);
                        var $649 = Web$Kaelin$Coord$Cubic$new$(_x$9, _y$10, _z$11);
                        var $645 = $649;
                        break;
                };
                var $641 = $645;
                break;
        };
        return $641;
    };
    const Web$Kaelin$Coord$Cubic$add = x0 => x1 => Web$Kaelin$Coord$Cubic$add$(x0, x1);

    function List$concat$(_as$2, _bs$3) {
        var self = _as$2;
        switch (self._) {
            case 'List.cons':
                var $651 = self.head;
                var $652 = self.tail;
                var $653 = List$cons$($651, List$concat$($652, _bs$3));
                var $650 = $653;
                break;
            case 'List.nil':
                var $654 = _bs$3;
                var $650 = $654;
                break;
        };
        return $650;
    };
    const List$concat = x0 => x1 => List$concat$(x0, x1);

    function Web$Kaelin$Coord$Cubic$range$(_coord$1, _distance$2) {
        var _distance_32$3 = (Number(_distance$2) >>> 0);
        var _distance_i32$4 = U32$to_i32$(_distance_32$3);
        var _double_distance$5 = ((((_distance_32$3 * 2) >>> 0) + 1) >>> 0);
        var _result$6 = List$nil;
        var _result$7 = (() => {
            var $656 = _result$6;
            var $657 = 0;
            var $658 = _double_distance$5;
            let _result$8 = $656;
            for (let _j$7 = $657; _j$7 < $658; ++_j$7) {
                var _negative_distance$9 = ((-_distance_i32$4));
                var _positive_distance$10 = _distance_i32$4;
                var _x$11 = ((U32$to_i32$(_j$7) - _positive_distance$10) >> 0);
                var _max$12 = I32$max$(_negative_distance$9, ((((-_x$11)) + _negative_distance$9) >> 0));
                var _min$13 = I32$min$(_positive_distance$10, ((((-_x$11)) + _positive_distance$10) >> 0));
                var _distance_between_max_min$14 = ((1 + I32$to_u32$(I32$abs$(((_max$12 - _min$13) >> 0)))) >>> 0);
                var _result$15 = (() => {
                    var $659 = _result$8;
                    var $660 = 0;
                    var $661 = _distance_between_max_min$14;
                    let _result$16 = $659;
                    for (let _i$15 = $660; _i$15 < $661; ++_i$15) {
                        var _y$17 = ((U32$to_i32$(_i$15) + _max$12) >> 0);
                        var _z$18 = ((((-_x$11)) - _y$17) >> 0);
                        var _new_coord$19 = Web$Kaelin$Coord$Cubic$add$(_coord$1, Web$Kaelin$Coord$Cubic$new$(_x$11, _y$17, _z$18));
                        var _result$20 = List$concat$(_result$16, List$cons$(_new_coord$19, List$nil));
                        var $659 = _result$20;
                        _result$16 = $659;
                    };
                    return _result$16;
                })();
                var $656 = _result$15;
                _result$8 = $656;
            };
            return _result$8;
        })();
        var $655 = _result$7;
        return $655;
    };
    const Web$Kaelin$Coord$Cubic$range = x0 => x1 => Web$Kaelin$Coord$Cubic$range$(x0, x1);

    function Web$Kaelin$Coord$Axial$range$(_a$1, _distance$2) {
        var _ab$3 = Web$Kaelin$Coord$Convert$axial_to_cubic$(_a$1);
        var _d$4 = _distance$2;
        var $662 = List$map$(Web$Kaelin$Coord$Convert$cubic_to_axial, Web$Kaelin$Coord$Cubic$range$(_ab$3, _d$4));
        return $662;
    };
    const Web$Kaelin$Coord$Axial$range = x0 => x1 => Web$Kaelin$Coord$Axial$range$(x0, x1);

    function List$filter$(_f$2, _xs$3) {
        var self = _xs$3;
        switch (self._) {
            case 'List.cons':
                var $664 = self.head;
                var $665 = self.tail;
                var self = _f$2($664);
                if (self) {
                    var $667 = List$cons$($664, List$filter$(_f$2, $665));
                    var $666 = $667;
                } else {
                    var $668 = List$filter$(_f$2, $665);
                    var $666 = $668;
                };
                var $663 = $666;
                break;
            case 'List.nil':
                var $669 = List$nil;
                var $663 = $669;
                break;
        };
        return $663;
    };
    const List$filter = x0 => x1 => List$filter$(x0, x1);

    function Web$Kaelin$Coord$range$(_coord$1, _distance$2) {
        var _list_coords$3 = Web$Kaelin$Coord$Axial$range$(_coord$1, _distance$2);
        var _fit$4 = (_x$4 => {
            var $671 = Web$Kaelin$Coord$fit$(_x$4, Web$Kaelin$Constants$map_size);
            return $671;
        });
        var $670 = List$filter$(_fit$4, _list_coords$3);
        return $670;
    };
    const Web$Kaelin$Coord$range = x0 => x1 => Web$Kaelin$Coord$range$(x0, x1);

    function Web$Kaelin$Draw$terrain$(_coord$1, _tile$2, _img$3, _cast_info$4) {
        var _img$5 = (() => {
            var $674 = _img$3;
            var $675 = _tile$2;
            let _img$6 = $674;
            let _entity$5;
            while ($675._ === 'List.cons') {
                _entity$5 = $675.head;
                var self = _entity$5;
                switch (self._) {
                    case 'Web.Kaelin.Entity.background':
                        var $676 = self.terrain;
                        var self = $676;
                        switch (self._) {
                            case 'Web.Kaelin.Terrain.grass':
                                var $678 = self.ability;
                                var $679 = self.movement;
                                var self = _cast_info$4;
                                switch (self._) {
                                    case 'Web.Kaelin.CastInfo.new':
                                        var $681 = self.hex_effect;
                                        var self = $681;
                                        switch (self._) {
                                            case 'Web.Kaelin.HexEffect.movement':
                                                var $683 = $679;
                                                var $682 = $683;
                                                break;
                                            case 'Web.Kaelin.HexEffect.ability':
                                                var $684 = $678;
                                                var $682 = $684;
                                                break;
                                        };
                                        var $680 = $682;
                                        break;
                                };
                                var $677 = $680;
                                break;
                        };
                        var $674 = $677;
                        break;
                    case 'Web.Kaelin.Entity.creature':
                        var $685 = _img$6;
                        var $674 = $685;
                        break;
                };
                _img$6 = $674;
                $675 = $675.tail;
            }
            return _img$6;
        })();
        var $672 = _img$5;
        return $672;
    };
    const Web$Kaelin$Draw$terrain = x0 => x1 => x2 => x3 => Web$Kaelin$Draw$terrain$(x0, x1, x2, x3);

    function Web$Kaelin$Draw$state$range_cast$(_map$1, _cast_info$2, _img$3) {
        var self = _cast_info$2;
        switch (self._) {
            case 'Maybe.some':
                var $687 = self.value;
                var self = $687;
                switch (self._) {
                    case 'Web.Kaelin.CastInfo.new':
                        var $689 = self.hero_pos;
                        var $690 = self.range;
                        var _range$9 = Web$Kaelin$Coord$range$($689, $690);
                        var _img$10 = (() => {
                            var $693 = _img$3;
                            var $694 = _range$9;
                            let _img$11 = $693;
                            let _coord_range$10;
                            while ($694._ === 'List.cons') {
                                _coord_range$10 = $694.head;
                                var _tile$12 = Web$Kaelin$Map$get$(_coord_range$10, _map$1);
                                var _terrain$13 = Web$Kaelin$Draw$terrain$(_coord_range$10, Maybe$default$(_tile$12, List$nil), _img$11, $687);
                                var self = Web$Kaelin$Coord$to_screen_xy$(_coord_range$10);
                                switch (self._) {
                                    case 'Pair.new':
                                        var $695 = self.fst;
                                        var $696 = self.snd;
                                        var _i$16 = (($695 - Web$Kaelin$Constants$hexagon_radius) >>> 0);
                                        var _j$17 = (($696 - Web$Kaelin$Constants$hexagon_radius) >>> 0);
                                        var $697 = VoxBox$Draw$image$(_i$16, _j$17, 0, _terrain$13, _img$11);
                                        var $693 = $697;
                                        break;
                                };
                                _img$11 = $693;
                                $694 = $694.tail;
                            }
                            return _img$11;
                        })();
                        var $691 = _img$10;
                        var $688 = $691;
                        break;
                };
                var $686 = $688;
                break;
            case 'Maybe.none':
                var $698 = _img$3;
                var $686 = $698;
                break;
        };
        return $686;
    };
    const Web$Kaelin$Draw$state$range_cast = x0 => x1 => x2 => Web$Kaelin$Draw$state$range_cast$(x0, x1, x2);
    const F64$div = a0 => a1 => (a0 / a1);
    const F64$parse = a0 => (parseFloat(a0));
    const F64$sub = a0 => a1 => (a0 - a1);
    const F64$mul = a0 => a1 => (a0 * a1);
    const F64$add = a0 => a1 => (a0 + a1);

    function Web$Kaelin$Coord$round$floor$(_n$1) {
        var $699 = (((_n$1 >> 0)));
        return $699;
    };
    const Web$Kaelin$Coord$round$floor = x0 => Web$Kaelin$Coord$round$floor$(x0);

    function Web$Kaelin$Coord$round$round_F64$(_n$1) {
        var _half$2 = (parseFloat("0.5"));
        var _big_number$3 = (parseFloat("1000.0"));
        var _n$4 = (_n$1 + _big_number$3);
        var _result$5 = Web$Kaelin$Coord$round$floor$((_n$4 + _half$2));
        var $700 = (_result$5 - _big_number$3);
        return $700;
    };
    const Web$Kaelin$Coord$round$round_F64 = x0 => Web$Kaelin$Coord$round$round_F64$(x0);

    function Word$gtn$(_a$2, _b$3) {
        var $701 = Cmp$as_gtn$(Word$cmp$(_a$2, _b$3));
        return $701;
    };
    const Word$gtn = x0 => x1 => Word$gtn$(x0, x1);

    function F64$gtn$(_a$1, _b$2) {
        var self = _a$1;
        switch ('f64') {
            case 'f64':
                var $703 = f64_to_word(self);
                var self = _b$2;
                switch ('f64') {
                    case 'f64':
                        var $705 = f64_to_word(self);
                        var $706 = Word$gtn$($703, $705);
                        var $704 = $706;
                        break;
                };
                var $702 = $704;
                break;
        };
        return $702;
    };
    const F64$gtn = x0 => x1 => F64$gtn$(x0, x1);

    function Web$Kaelin$Coord$round$diff$(_x$1, _y$2) {
        var _big_number$3 = (parseFloat("1000.0"));
        var _x$4 = (_x$1 + _big_number$3);
        var _y$5 = (_y$2 + _big_number$3);
        var self = F64$gtn$(_x$4, _y$5);
        if (self) {
            var $708 = (_x$4 - _y$5);
            var $707 = $708;
        } else {
            var $709 = (_y$5 - _x$4);
            var $707 = $709;
        };
        return $707;
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
                var $712 = Pair$new$(_i$4(_round_x$6), _i$4(_new_y$12));
                var $711 = $712;
            } else {
                var _new_x$12 = ((_f$3(0) - _round_y$7) - _round_z$8);
                var $713 = Pair$new$(_i$4(_new_x$12), _i$4(_round_y$7));
                var $711 = $713;
            };
            var _result$12 = $711;
        } else {
            var self = F64$gtn$(_diff_y$10, _diff_z$11);
            if (self) {
                var _new_y$12 = ((_f$3(0) - _round_x$6) - _round_z$8);
                var $715 = Pair$new$(_i$4(_round_x$6), _i$4(_new_y$12));
                var $714 = $715;
            } else {
                var $716 = Pair$new$(_i$4(_round_x$6), _i$4(_round_y$7));
                var $714 = $716;
            };
            var _result$12 = $714;
        };
        var $710 = _result$12;
        return $710;
    };
    const Web$Kaelin$Coord$round = x0 => x1 => Web$Kaelin$Coord$round$(x0, x1);

    function Web$Kaelin$Coord$to_axial$(_coord$1) {
        var self = _coord$1;
        switch (self._) {
            case 'Pair.new':
                var $718 = self.fst;
                var $719 = self.snd;
                var _f$4 = U32$to_f64;
                var _i$5 = F64$to_i32;
                var _float_hex_rad$6 = (_f$4(Web$Kaelin$Constants$hexagon_radius) / (parseFloat("2.0")));
                var _center_x$7 = Web$Kaelin$Constants$center_x;
                var _center_y$8 = Web$Kaelin$Constants$center_y;
                var _float_x$9 = ((_f$4($718) - _f$4(_center_x$7)) / _float_hex_rad$6);
                var _float_y$10 = ((_f$4($719) - _f$4(_center_y$8)) / _float_hex_rad$6);
                var _fourth$11 = (parseFloat("0.25"));
                var _sixth$12 = ((parseFloat("1.0")) / (parseFloat("6.0")));
                var _third$13 = ((parseFloat("1.0")) / (parseFloat("3.0")));
                var _half$14 = (parseFloat("0.5"));
                var _axial_x$15 = ((_float_x$9 * _fourth$11) - (_float_y$10 * _sixth$12));
                var _axial_y$16 = (_float_y$10 * _third$13);
                var self = Web$Kaelin$Coord$round$(_axial_x$15, _axial_y$16);
                switch (self._) {
                    case 'Pair.new':
                        var $721 = self.fst;
                        var $722 = self.snd;
                        var $723 = Web$Kaelin$Coord$new$($721, $722);
                        var $720 = $723;
                        break;
                };
                var $717 = $720;
                break;
        };
        return $717;
    };
    const Web$Kaelin$Coord$to_axial = x0 => Web$Kaelin$Coord$to_axial$(x0);

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
                        var $724 = self.head;
                        var $725 = self.tail;
                        var self = _cond$2($724);
                        if (self) {
                            var $727 = Bool$true;
                            var $726 = $727;
                        } else {
                            var $728 = List$any$(_cond$2, $725);
                            var $726 = $728;
                        };
                        return $726;
                    case 'List.nil':
                        var $729 = Bool$false;
                        return $729;
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
                var $731 = self.i;
                var $732 = self.j;
                var self = _b$2;
                switch (self._) {
                    case 'Web.Kaelin.Coord.new':
                        var $734 = self.i;
                        var $735 = self.j;
                        var $736 = (($731 === $734) && ($732 === $735));
                        var $733 = $736;
                        break;
                };
                var $730 = $733;
                break;
        };
        return $730;
    };
    const Web$Kaelin$Coord$eql = x0 => x1 => Web$Kaelin$Coord$eql$(x0, x1);
    const Web$Kaelin$Assets$tile$effect$dark_blue1 = VoxBox$parse$("0e0103496df70f0103496df71001035679ff0c02035679ff0d02035679ff0e02035679ff0f0203496df71002035679ff1102035679ff120203496df70a03035679ff0b0303496df70c03035679ff0d03035679ff0e03035679ff0f0303496df7100303496df7110303496df7120303496df71303035679ff1403035679ff0804035679ff0904035679ff0a04035679ff0b0403496df70c0403496df70d04035679ff0e04035679ff0f0403496df71004035679ff110403496df7120403496df7130403496df7140403496df7150403496df7160403496df70605035679ff070503496df70805035679ff0905035679ff0a0503496df70b0503496df70c0503496df70d05033b5fe90e05033b5fe90f05035679ff1005035679ff1105035679ff1205033b5fe9130503496df71405035679ff1505035679ff160503496df71705035679ff1805035679ff0406033b5fe90506035679ff0606035679ff070603496df7080603496df70906033b5fe90a0603496df70b0603496df70c0603496df70d0603496df70e06033b5fe90f06035679ff1006035679ff110603496df71206033b5fe91306033b5fe91406035679ff1506035679ff160603496df7170603496df71806033b5fe9190603496df71a0603496df7020703496df7030703496df7040703496df7050703496df7060703496df7070703496df7080703496df70907033b5fe90a07033b5fe90b0703496df70c07035679ff0d07035679ff0e0703496df70f0703496df7100703496df7110703496df7120703496df7130703496df7140703496df7150703496df7160703496df7170703496df71807033b5fe91907033b5fe91a0703496df71b07035679ff1c07035679ff010803496df70208035679ff0308035679ff040803496df70508035679ff0608035679ff0708035679ff080803496df70908035679ff0a08035679ff0b0803496df70c0803496df70d08035679ff0e08035679ff0f08033b5fe9100803496df71108035679ff1208035679ff130803496df71408035679ff1508035679ff1608035679ff170803496df71808035679ff1908035679ff1a0803496df71b0803496df71c08035679ff1d08035679ff010903496df7020903496df7030903496df7040903496df70509035679ff0609035679ff070903496df7080903496df7090903496df70a0903496df70b0903496df70c0903496df70d0903496df70e0903496df70f0903496df7100903496df7110903496df7120903496df7130903496df71409035679ff1509035679ff160903496df7170903496df7180903496df7190903496df71a0903496df71b0903496df71c0903496df71d0903496df7010a03496df7020a03496df7030a03496df7040a03496df7050a03496df7060a03496df7070a035679ff080a035679ff090a03496df70a0a033b5fe90b0a033b5fe90c0a03496df70d0a03496df70e0a03496df70f0a035679ff100a03496df7110a03496df7120a03496df7130a03496df7140a03496df7150a03496df7160a035679ff170a035679ff180a03496df7190a033b5fe91a0a033b5fe91b0a03496df71c0a03496df71d0a03496df7010b03496df7020b03496df7030b035679ff040b035679ff050b03496df7060b035679ff070b035679ff080b035679ff090b03496df70a0b033b5fe90b0b03496df70c0b035679ff0d0b035679ff0e0b03496df70f0b035679ff100b03496df7110b03496df7120b035679ff130b035679ff140b03496df7150b035679ff160b035679ff170b035679ff180b03496df7190b033b5fe91a0b03496df71b0b035679ff1c0b035679ff1d0b03496df7010c03496df7020c035679ff030c035679ff040c035679ff050c03496df7060c035679ff070c035679ff080c03496df7090c03496df70a0c03496df70b0c03496df70c0c035679ff0d0c035679ff0e0c035679ff0f0c03496df7100c03496df7110c035679ff120c035679ff130c035679ff140c03496df7150c035679ff160c035679ff170c03496df7180c03496df7190c03496df71a0c03496df71b0c035679ff1c0c035679ff1d0c035679ff010d03496df7020d035679ff030d035679ff040d03496df7050d03496df7060d03496df7070d03496df7080d03496df7090d03496df70a0d03496df70b0d03496df70c0d03496df70d0d035679ff0e0d035679ff0f0d03496df7100d03496df7110d035679ff120d035679ff130d03496df7140d03496df7150d03496df7160d03496df7170d03496df7180d03496df7190d03496df71a0d03496df71b0d03496df71c0d035679ff1d0d035679ff010e03496df7020e035679ff030e035679ff040e03496df7050e033b5fe9060e03496df7070e035679ff080e035679ff090e035679ff0a0e03496df70b0e035679ff0c0e035679ff0d0e03496df70e0e03496df70f0e035679ff100e03496df7110e035679ff120e035679ff130e03496df7140e033b5fe9150e03496df7160e035679ff170e035679ff180e035679ff190e03496df71a0e035679ff1b0e035679ff1c0e03496df71d0e03496df7010f035679ff020f035679ff030f035679ff040f03496df7050f03496df7060f03496df7070f035679ff080f035679ff090f03496df70a0f03496df70b0f03496df70c0f03496df70d0f03496df70e0f03496df70f0f03496df7100f035679ff110f035679ff120f035679ff130f03496df7140f03496df7150f03496df7160f035679ff170f035679ff180f03496df7190f03496df71a0f03496df71b0f03496df71c0f03496df71d0f03496df70110035679ff0210035679ff031003496df70410035679ff0510035679ff061003496df7071003496df7081003496df7091003496df70a1003496df70b1003496df70c10035679ff0d10035679ff0e10035679ff0f1003496df71010035679ff1110035679ff121003496df71310035679ff1410035679ff151003496df7161003496df7171003496df7181003496df7191003496df71a1003496df71b10035679ff1c10035679ff1d10035679ff011103496df7021103496df7031103496df70411035679ff0511035679ff061103496df7071103496df7081103496df70911035679ff0a11035679ff0b1103496df70c11035679ff0d11035679ff0e11035679ff0f1103496df7101103496df7111103496df7121103496df71311035679ff1411035679ff151103496df7161103496df7171103496df71811035679ff1911035679ff1a1103496df71b11035679ff1c11035679ff1d11035679ff0112035679ff021203496df7031203496df7041203496df7051203496df7061203496df7071203496df70812035679ff0912035679ff0a12035679ff0b1203496df70c1203496df70d12035679ff0e12035679ff0f1203496df71012035679ff111203496df7121203496df7131203496df7141203496df7151203496df7161203496df71712035679ff1812035679ff1912035679ff1a1203496df71b1203496df71c12035679ff1d12035679ff0113035679ff0213035679ff0313033b5fe9041303496df70513035679ff0613035679ff071303496df70813035679ff0913035679ff0a1303496df70b1303496df70c1303496df70d13033b5fe90e13033b5fe90f13035679ff1013035679ff1113035679ff1213033b5fe9131303496df71413035679ff1513035679ff161303496df71713035679ff1813035679ff191303496df71a1303496df71b1303496df71c13033b5fe91d13033b5fe90114035679ff021403496df70314033b5fe90414033b5fe90514035679ff0614035679ff071403496df7081403496df70914033b5fe90a1403496df70b1403496df70c1403496df70d1403496df70e14033b5fe90f14035679ff1014035679ff111403496df71214033b5fe91314033b5fe91414035679ff1514035679ff161403496df7171403496df71814033b5fe9191403496df71a1403496df71b1403496df71c1403496df71d14033b5fe9021503496df7031503496df7041503496df7051503496df7061503496df7071503496df7081503496df70915033b5fe90a15033b5fe90b1503496df70c15035679ff0d15035679ff0e1503496df70f1503496df7101503496df7111503496df7121503496df7131503496df7141503496df7151503496df7161503496df7171503496df71815033b5fe91915033b5fe91a1503496df71b15035679ff1c15035679ff041603496df7051603496df70616035679ff0716035679ff081603496df70916035679ff0a16035679ff0b1603496df70c16035679ff0d16035679ff0e16035679ff0f16033b5fe91016033b5fe91116035679ff1216035679ff131603496df7141603496df71516035679ff1616035679ff171603496df71816035679ff1916035679ff1a1603496df70617035679ff0717035679ff081703496df70917035679ff0a17035679ff0b1703496df70c1703496df70d17035679ff0e17035679ff0f17033b5fe9101703496df71117035679ff1217035679ff131703496df71417035679ff1517035679ff1617035679ff171703496df71817035679ff081803496df7091803496df70a1803496df70b1803496df70c1803496df70d1803496df70e1803496df70f1803496df7101803496df7111803496df7121803496df7131803496df71418035679ff1518035679ff161803496df70a19033b5fe90b19033b5fe90c1903496df70d1903496df70e1903496df70f19035679ff101903496df7111903496df7121903496df7131903496df7141903496df70c1a035679ff0d1a035679ff0e1a03496df70f1a035679ff101a03496df7111a03496df7121a035679ff0e1b035679ff0f1b03496df7101b03496df7");
    const Web$Kaelin$Assets$tile$effect$dark_red1 = VoxBox$parse$("0e0103af58500f0103af5850100103ba655a0c0203ba655a0d0203ba655a0e0203ba655a0f0203af5850100203ba655a110203ba655a120203af58500a0303ba655a0b0303af58500c0303ba655a0d0303ba655a0e0303ba655a0f0303af5850100303af5850110303af5850120303af5850130303ba655a140303ba655a080403ba655a090403ba655a0a0403ba655a0b0403af58500c0403af58500d0403ba655a0e0403ba655a0f0403af5850100403ba655a110403af5850120403af5850130403af5850140403af5850150403af5850160403af5850060503ba655a070503af5850080503ba655a090503ba655a0a0503af58500b0503af58500c0503af58500d0503a249420e0503a249420f0503ba655a100503ba655a110503ba655a120503a24942130503af5850140503ba655a150503ba655a160503af5850170503ba655a180503ba655a040603a24942050603ba655a060603ba655a070603af5850080603af5850090603a249420a0603af58500b0603af58500c0603af58500d0603af58500e0603a249420f0603ba655a100603ba655a110603af5850120603a24942130603a24942140603ba655a150603ba655a160603af5850170603af5850180603a24942190603af58501a0603af5850020703af5850030703af5850040703af5850050703af5850060703af5850070703af5850080703af5850090703a249420a0703a249420b0703af58500c0703ba655a0d0703ba655a0e0703af58500f0703af5850100703af5850110703af5850120703af5850130703af5850140703af5850150703af5850160703af5850170703af5850180703a24942190703a249421a0703af58501b0703ba655a1c0703ba655a010803af5850020803ba655a030803ba655a040803af5850050803ba655a060803ba655a070803ba655a080803af5850090803ba655a0a0803ba655a0b0803af58500c0803af58500d0803ba655a0e0803ba655a0f0803a24942100803af5850110803ba655a120803ba655a130803af5850140803ba655a150803ba655a160803ba655a170803af5850180803ba655a190803ba655a1a0803af58501b0803af58501c0803ba655a1d0803ba655a010903af5850020903af5850030903af5850040903af5850050903ba655a060903ba655a070903af5850080903af5850090903af58500a0903af58500b0903af58500c0903af58500d0903af58500e0903af58500f0903af5850100903af5850110903af5850120903af5850130903af5850140903ba655a150903ba655a160903af5850170903af5850180903af5850190903af58501a0903af58501b0903af58501c0903af58501d0903af5850010a03af5850020a03af5850030a03af5850040a03af5850050a03af5850060a03af5850070a03ba655a080a03ba655a090a03af58500a0a03a249420b0a03a249420c0a03af58500d0a03af58500e0a03af58500f0a03ba655a100a03af5850110a03af5850120a03af5850130a03af5850140a03af5850150a03af5850160a03ba655a170a03ba655a180a03af5850190a03a249421a0a03a249421b0a03af58501c0a03af58501d0a03af5850010b03af5850020b03af5850030b03ba655a040b03ba655a050b03af5850060b03ba655a070b03ba655a080b03ba655a090b03af58500a0b03a249420b0b03af58500c0b03ba655a0d0b03ba655a0e0b03af58500f0b03ba655a100b03af5850110b03af5850120b03ba655a130b03ba655a140b03af5850150b03ba655a160b03ba655a170b03ba655a180b03af5850190b03a249421a0b03af58501b0b03ba655a1c0b03ba655a1d0b03af5850010c03af5850020c03ba655a030c03ba655a040c03ba655a050c03af5850060c03ba655a070c03ba655a080c03af5850090c03af58500a0c03af58500b0c03af58500c0c03ba655a0d0c03ba655a0e0c03ba655a0f0c03af5850100c03af5850110c03ba655a120c03ba655a130c03ba655a140c03af5850150c03ba655a160c03ba655a170c03af5850180c03af5850190c03af58501a0c03af58501b0c03ba655a1c0c03ba655a1d0c03ba655a010d03af5850020d03ba655a030d03ba655a040d03af5850050d03af5850060d03af5850070d03af5850080d03af5850090d03af58500a0d03af58500b0d03af58500c0d03af58500d0d03ba655a0e0d03ba655a0f0d03af5850100d03af5850110d03ba655a120d03ba655a130d03af5850140d03af5850150d03af5850160d03af5850170d03af5850180d03af5850190d03af58501a0d03af58501b0d03af58501c0d03ba655a1d0d03ba655a010e03af5850020e03ba655a030e03ba655a040e03af5850050e03a24942060e03af5850070e03ba655a080e03ba655a090e03ba655a0a0e03af58500b0e03ba655a0c0e03ba655a0d0e03af58500e0e03af58500f0e03ba655a100e03af5850110e03ba655a120e03ba655a130e03af5850140e03a24942150e03af5850160e03ba655a170e03ba655a180e03ba655a190e03af58501a0e03ba655a1b0e03ba655a1c0e03af58501d0e03af5850010f03ba655a020f03ba655a030f03ba655a040f03af5850050f03af5850060f03af5850070f03ba655a080f03ba655a090f03af58500a0f03af58500b0f03af58500c0f03af58500d0f03af58500e0f03af58500f0f03af5850100f03ba655a110f03ba655a120f03ba655a130f03af5850140f03af5850150f03af5850160f03ba655a170f03ba655a180f03af5850190f03af58501a0f03af58501b0f03af58501c0f03af58501d0f03af5850011003ba655a021003ba655a031003af5850041003ba655a051003ba655a061003af5850071003af5850081003af5850091003af58500a1003af58500b1003af58500c1003ba655a0d1003ba655a0e1003ba655a0f1003af5850101003ba655a111003ba655a121003af5850131003ba655a141003ba655a151003af5850161003af5850171003af5850181003af5850191003af58501a1003af58501b1003ba655a1c1003ba655a1d1003ba655a011103af5850021103af5850031103af5850041103ba655a051103ba655a061103af5850071103af5850081103af5850091103ba655a0a1103ba655a0b1103af58500c1103ba655a0d1103ba655a0e1103ba655a0f1103af5850101103af5850111103af5850121103af5850131103ba655a141103ba655a151103af5850161103af5850171103af5850181103ba655a191103ba655a1a1103af58501b1103ba655a1c1103ba655a1d1103ba655a011203ba655a021203af5850031203af5850041203af5850051203af5850061203af5850071203af5850081203ba655a091203ba655a0a1203ba655a0b1203af58500c1203af58500d1203ba655a0e1203ba655a0f1203af5850101203ba655a111203af5850121203af5850131203af5850141203af5850151203af5850161203af5850171203ba655a181203ba655a191203ba655a1a1203af58501b1203af58501c1203ba655a1d1203ba655a011303ba655a021303ba655a031303a24942041303af5850051303ba655a061303ba655a071303af5850081303ba655a091303ba655a0a1303af58500b1303af58500c1303af58500d1303a249420e1303a249420f1303ba655a101303ba655a111303ba655a121303a24942131303af5850141303ba655a151303ba655a161303af5850171303ba655a181303ba655a191303af58501a1303af58501b1303af58501c1303a249421d1303a24942011403ba655a021403af5850031403a24942041403a24942051403ba655a061403ba655a071403af5850081403af5850091403a249420a1403af58500b1403af58500c1403af58500d1403af58500e1403a249420f1403ba655a101403ba655a111403af5850121403a24942131403a24942141403ba655a151403ba655a161403af5850171403af5850181403a24942191403af58501a1403af58501b1403af58501c1403af58501d1403a24942021503af5850031503af5850041503af5850051503af5850061503af5850071503af5850081503af5850091503a249420a1503a249420b1503af58500c1503ba655a0d1503ba655a0e1503af58500f1503af5850101503af5850111503af5850121503af5850131503af5850141503af5850151503af5850161503af5850171503af5850181503a24942191503a249421a1503af58501b1503ba655a1c1503ba655a041603af5850051603af5850061603ba655a071603ba655a081603af5850091603ba655a0a1603ba655a0b1603af58500c1603ba655a0d1603ba655a0e1603ba655a0f1603a24942101603a24942111603ba655a121603ba655a131603af5850141603af5850151603ba655a161603ba655a171603af5850181603ba655a191603ba655a1a1603af5850061703ba655a071703ba655a081703af5850091703ba655a0a1703ba655a0b1703af58500c1703af58500d1703ba655a0e1703ba655a0f1703a24942101703af5850111703ba655a121703ba655a131703af5850141703ba655a151703ba655a161703ba655a171703af5850181703ba655a081803af5850091803af58500a1803af58500b1803af58500c1803af58500d1803af58500e1803af58500f1803af5850101803af5850111803af5850121803af5850131803af5850141803ba655a151803ba655a161803af58500a1903a249420b1903a249420c1903af58500d1903af58500e1903af58500f1903ba655a101903af5850111903af5850121903af5850131903af5850141903af58500c1a03ba655a0d1a03ba655a0e1a03af58500f1a03ba655a101a03af5850111a03af5850121a03ba655a0e1b03ba655a0f1b03af5850101b03af5850");

    function Web$Kaelin$Draw$state$highlight$(_map$1, _cast_info$2, _env_info$3, _img$4) {
        var self = _env_info$3;
        switch (self._) {
            case 'App.EnvInfo.new':
                var $738 = self.mouse_pos;
                var _coord$7 = Web$Kaelin$Coord$to_axial$($738);
                var self = Web$Kaelin$Coord$fit$(_coord$7, Web$Kaelin$Constants$map_size);
                if (self) {
                    var self = Web$Kaelin$Coord$to_screen_xy$(_coord$7);
                    switch (self._) {
                        case 'Pair.new':
                            var $741 = self.fst;
                            var $742 = self.snd;
                            var _i$10 = (($741 - Web$Kaelin$Constants$hexagon_radius) >>> 0);
                            var _j$11 = (($742 - Web$Kaelin$Constants$hexagon_radius) >>> 0);
                            var self = _cast_info$2;
                            switch (self._) {
                                case 'Maybe.some':
                                    var $744 = self.value;
                                    var self = $744;
                                    switch (self._) {
                                        case 'Web.Kaelin.CastInfo.new':
                                            var $746 = self.hero_pos;
                                            var $747 = self.range;
                                            var $748 = self.hex_effect;
                                            var _range$17 = Web$Kaelin$Coord$range$($746, $747);
                                            var self = List$any$(Web$Kaelin$Coord$eql(_coord$7), _range$17);
                                            if (self) {
                                                var self = $748;
                                                switch (self._) {
                                                    case 'Web.Kaelin.HexEffect.movement':
                                                        var $751 = Web$Kaelin$Assets$tile$effect$dark_blue1;
                                                        var $750 = $751;
                                                        break;
                                                    case 'Web.Kaelin.HexEffect.ability':
                                                        var $752 = Web$Kaelin$Assets$tile$effect$dark_red1;
                                                        var $750 = $752;
                                                        break;
                                                };
                                                var $749 = $750;
                                            } else {
                                                var $753 = Web$Kaelin$Assets$tile$effect$blue_green1;
                                                var $749 = $753;
                                            };
                                            var $745 = $749;
                                            break;
                                    };
                                    var _hex_img$12 = $745;
                                    break;
                                case 'Maybe.none':
                                    var $754 = Web$Kaelin$Assets$tile$effect$blue_green1;
                                    var _hex_img$12 = $754;
                                    break;
                            };
                            var $743 = VoxBox$Draw$image$(_i$10, _j$11, 0, _hex_img$12, _img$4);
                            var $740 = $743;
                            break;
                    };
                    var $739 = $740;
                } else {
                    var $755 = _img$4;
                    var $739 = $755;
                };
                var $737 = $739;
                break;
        };
        return $737;
    };
    const Web$Kaelin$Draw$state$highlight = x0 => x1 => x2 => x3 => Web$Kaelin$Draw$state$highlight$(x0, x1, x2, x3);

    function Web$Kaelin$Draw$hero$(_cx$1, _cy$2, _z$3, _hero$4, _img$5) {
        var self = _hero$4;
        switch (self._) {
            case 'Web.Kaelin.Hero.new':
                var $757 = self.img;
                var _aux_y$8 = ((Web$Kaelin$Constants$hexagon_radius * 2) >>> 0);
                var _cy$9 = ((_cy$2 - _aux_y$8) >>> 0);
                var _cx$10 = ((_cx$1 - Web$Kaelin$Constants$hexagon_radius) >>> 0);
                var $758 = VoxBox$Draw$image$(_cx$10, _cy$9, 0, $757, _img$5);
                var $756 = $758;
                break;
        };
        return $756;
    };
    const Web$Kaelin$Draw$hero = x0 => x1 => x2 => x3 => x4 => Web$Kaelin$Draw$hero$(x0, x1, x2, x3, x4);

    function Web$Kaelin$Draw$state$players$(_map$1, _img$2) {
        var _player_list$3 = NatMap$to_list$(_map$1);
        var _img$4 = (() => {
            var $761 = _img$2;
            var $762 = _player_list$3;
            let _img$5 = $761;
            let _prs$4;
            while ($762._ === 'List.cons') {
                _prs$4 = $762.head;
                var self = _prs$4;
                switch (self._) {
                    case 'Pair.new':
                        var $763 = self.fst;
                        var $764 = self.snd;
                        var _coord$8 = Web$Kaelin$Coord$Convert$nat_to_axial$($763);
                        var self = Web$Kaelin$Coord$to_screen_xy$(_coord$8);
                        switch (self._) {
                            case 'Pair.new':
                                var $766 = self.fst;
                                var $767 = self.snd;
                                var _img$11 = (() => {
                                    var $770 = _img$5;
                                    var $771 = $764;
                                    let _img$12 = $770;
                                    let _entity$11;
                                    while ($771._ === 'List.cons') {
                                        _entity$11 = $771.head;
                                        var self = _entity$11;
                                        switch (self._) {
                                            case 'Web.Kaelin.Entity.creature':
                                                var $772 = self.hero;
                                                var $773 = Web$Kaelin$Draw$hero$($766, $767, 0, $772, _img$12);
                                                var $770 = $773;
                                                break;
                                            case 'Web.Kaelin.Entity.background':
                                                var $774 = _img$12;
                                                var $770 = $774;
                                                break;
                                        };
                                        _img$12 = $770;
                                        $771 = $771.tail;
                                    }
                                    return _img$12;
                                })();
                                var $768 = _img$11;
                                var $765 = $768;
                                break;
                        };
                        var $761 = $765;
                        break;
                };
                _img$5 = $761;
                $762 = $762.tail;
            }
            return _img$5;
        })();
        var $759 = _img$4;
        return $759;
    };
    const Web$Kaelin$Draw$state$players = x0 => x1 => Web$Kaelin$Draw$state$players$(x0, x1);

    function Web$Kaelin$Draw$state$(_img$1, _state$2) {
        var self = _state$2;
        switch (self._) {
            case 'Web.Kaelin.State.game':
                var $776 = self.cast_info;
                var $777 = self.map;
                var $778 = self.interface;
                var _img$9 = Web$Kaelin$Draw$state$background$($777, _img$1);
                var _img$10 = Web$Kaelin$Draw$state$range_cast$($777, $776, _img$9);
                var _img$11 = Web$Kaelin$Draw$state$highlight$($777, $776, $778, _img$10);
                var _img$12 = Web$Kaelin$Draw$state$players$($777, _img$11);
                var $779 = _img$12;
                var $775 = $779;
                break;
            case 'Web.Kaelin.State.init':
            case 'Web.Kaelin.State.void':
                var $780 = _img$1;
                var $775 = $780;
                break;
        };
        return $775;
    };
    const Web$Kaelin$Draw$state = x0 => x1 => Web$Kaelin$Draw$state$(x0, x1);

    function Web$Kaelin$App$draw$(_img$1, _state$2) {
        var self = _state$2;
        switch (self._) {
            case 'Web.Kaelin.State.init':
            case 'Web.Kaelin.State.void':
                var $782 = DOM$text$("TODO: create the renderer for this game state mode");
                var $781 = $782;
                break;
            case 'Web.Kaelin.State.game':
                var $783 = DOM$vbox$(Map$from_list$(List$nil), Map$from_list$(List$nil), Web$Kaelin$Draw$state$(_img$1, _state$2));
                var $781 = $783;
                break;
        };
        return $781;
    };
    const Web$Kaelin$App$draw = x0 => x1 => Web$Kaelin$App$draw$(x0, x1);

    function IO$(_A$1) {
        var $784 = null;
        return $784;
    };
    const IO = x0 => IO$(x0);

    function IO$ask$(_query$2, _param$3, _then$4) {
        var $785 = ({
            _: 'IO.ask',
            'query': _query$2,
            'param': _param$3,
            'then': _then$4
        });
        return $785;
    };
    const IO$ask = x0 => x1 => x2 => IO$ask$(x0, x1, x2);

    function IO$bind$(_a$3, _f$4) {
        var self = _a$3;
        switch (self._) {
            case 'IO.end':
                var $787 = self.value;
                var $788 = _f$4($787);
                var $786 = $788;
                break;
            case 'IO.ask':
                var $789 = self.query;
                var $790 = self.param;
                var $791 = self.then;
                var $792 = IO$ask$($789, $790, (_x$8 => {
                    var $793 = IO$bind$($791(_x$8), _f$4);
                    return $793;
                }));
                var $786 = $792;
                break;
        };
        return $786;
    };
    const IO$bind = x0 => x1 => IO$bind$(x0, x1);

    function IO$end$(_value$2) {
        var $794 = ({
            _: 'IO.end',
            'value': _value$2
        });
        return $794;
    };
    const IO$end = x0 => IO$end$(x0);

    function IO$monad$(_new$2) {
        var $795 = _new$2(IO$bind)(IO$end);
        return $795;
    };
    const IO$monad = x0 => IO$monad$(x0);

    function Dynamic$new$(_value$2) {
        var $796 = ({
            _: 'Dynamic.new',
            'value': _value$2
        });
        return $796;
    };
    const Dynamic$new = x0 => Dynamic$new$(x0);
    const App$pass = IO$monad$((_m$bind$1 => _m$pure$2 => {
        var $797 = _m$pure$2;
        return $797;
    }))(Dynamic$new$(Unit$new));

    function IO$do$(_call$1, _param$2) {
        var $798 = IO$ask$(_call$1, _param$2, (_answer$3 => {
            var $799 = IO$end$(Unit$new);
            return $799;
        }));
        return $798;
    };
    const IO$do = x0 => x1 => IO$do$(x0, x1);

    function App$do$(_call$1, _param$2) {
        var $800 = IO$monad$((_m$bind$3 => _m$pure$4 => {
            var $801 = _m$bind$3;
            return $801;
        }))(IO$do$(_call$1, _param$2))((_$3 => {
            var $802 = App$pass;
            return $802;
        }));
        return $800;
    };
    const App$do = x0 => x1 => App$do$(x0, x1);

    function App$watch$(_room$1) {
        var $803 = App$do$("watch", _room$1);
        return $803;
    };
    const App$watch = x0 => App$watch$(x0);

    function App$store$(_value$2) {
        var $804 = IO$monad$((_m$bind$3 => _m$pure$4 => {
            var $805 = _m$pure$4;
            return $805;
        }))(Dynamic$new$(_value$2));
        return $804;
    };
    const App$store = x0 => App$store$(x0);

    function Web$Kaelin$Action$update_interface$(_interface$1, _state$2) {
        var self = _state$2;
        switch (self._) {
            case 'Web.Kaelin.State.game':
                var $807 = self.room;
                var $808 = self.tick;
                var $809 = self.players;
                var $810 = self.cast_info;
                var $811 = self.map;
                var $812 = Web$Kaelin$State$game$($807, $808, $809, $810, $811, _interface$1);
                var $806 = $812;
                break;
            case 'Web.Kaelin.State.init':
            case 'Web.Kaelin.State.void':
                var $813 = _state$2;
                var $806 = $813;
                break;
        };
        return $806;
    };
    const Web$Kaelin$Action$update_interface = x0 => x1 => Web$Kaelin$Action$update_interface$(x0, x1);
    const U16$eql = a0 => a1 => (a0 === a1);

    function U16$new$(_value$1) {
        var $814 = word_to_u16(_value$1);
        return $814;
    };
    const U16$new = x0 => U16$new$(x0);
    const Nat$to_u16 = a0 => (Number(a0) & 0xFFFF);

    function String$cons$(_head$1, _tail$2) {
        var $815 = (String.fromCharCode(_head$1) + _tail$2);
        return $815;
    };
    const String$cons = x0 => x1 => String$cons$(x0, x1);
    const String$concat = a0 => a1 => (a0 + a1);

    function App$post$(_room$1, _data$2) {
        var $816 = App$do$("post", (_room$1 + (";" + _data$2)));
        return $816;
    };
    const App$post = x0 => x1 => App$post$(x0, x1);
    const String$nil = '';

    function String$repeat$(_xs$1, _n$2) {
        var self = _n$2;
        if (self === 0n) {
            var $818 = String$nil;
            var $817 = $818;
        } else {
            var $819 = (self - 1n);
            var $820 = (_xs$1 + String$repeat$(_xs$1, $819));
            var $817 = $820;
        };
        return $817;
    };
    const String$repeat = x0 => x1 => String$repeat$(x0, x1);

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
                    var $821 = _xs$2;
                    return $821;
                } else {
                    var $822 = (self - 1n);
                    var self = _xs$2;
                    if (self.length === 0) {
                        var $824 = String$nil;
                        var $823 = $824;
                    } else {
                        var $825 = self.charCodeAt(0);
                        var $826 = self.slice(1);
                        var $827 = String$drop$($822, $826);
                        var $823 = $827;
                    };
                    return $823;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const String$drop = x0 => x1 => String$drop$(x0, x1);

    function Web$Kaelin$Command$create_player$(_hero_id$1) {
        var $828 = ("0x1" + (String$repeat$("0", 55n) + String$drop$(2n, _hero_id$1)));
        return $828;
    };
    const Web$Kaelin$Command$create_player = x0 => Web$Kaelin$Command$create_player$(x0);

    function Char$eql$(_a$1, _b$2) {
        var $829 = (_a$1 === _b$2);
        return $829;
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
                    var $830 = Bool$true;
                    return $830;
                } else {
                    var $831 = self.charCodeAt(0);
                    var $832 = self.slice(1);
                    var self = _xs$1;
                    if (self.length === 0) {
                        var $834 = Bool$false;
                        var $833 = $834;
                    } else {
                        var $835 = self.charCodeAt(0);
                        var $836 = self.slice(1);
                        var self = Char$eql$($831, $835);
                        if (self) {
                            var $838 = String$starts_with$($836, $832);
                            var $837 = $838;
                        } else {
                            var $839 = Bool$false;
                            var $837 = $839;
                        };
                        var $833 = $837;
                    };
                    return $833;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const String$starts_with = x0 => x1 => String$starts_with$(x0, x1);

    function Map$get$(_key$2, _map$3) {
        var $840 = BitsMap$get$(String$to_bits$(_key$2), _map$3);
        return $840;
    };
    const Map$get = x0 => x1 => Map$get$(x0, x1);

    function List$fold$(_list$2, _nil$4, _cons$5) {
        var self = _list$2;
        switch (self._) {
            case 'List.cons':
                var $842 = self.head;
                var $843 = self.tail;
                var $844 = _cons$5($842)(List$fold$($843, _nil$4, _cons$5));
                var $841 = $844;
                break;
            case 'List.nil':
                var $845 = _nil$4;
                var $841 = $845;
                break;
        };
        return $841;
    };
    const List$fold = x0 => x1 => x2 => List$fold$(x0, x1, x2);

    function Map$set$(_key$2, _val$3, _map$4) {
        var $846 = BitsMap$set$(String$to_bits$(_key$2), _val$3, _map$4);
        return $846;
    };
    const Map$set = x0 => x1 => x2 => Map$set$(x0, x1, x2);
    const Web$Kaelin$Resources$heroes = (() => {
        var _heroes$1 = List$cons$(Web$Kaelin$Hero$croni, List$cons$(Web$Kaelin$Hero$cyclope, List$cons$(Web$Kaelin$Hero$lela, List$cons$(Web$Kaelin$Hero$octoking, List$nil))));
        var $847 = List$fold$(_heroes$1, Map$from_list$(List$nil), (_hero$2 => _map$3 => {
            var self = _hero$2;
            switch (self._) {
                case 'Web.Kaelin.Hero.new':
                    var $849 = self.id;
                    var $850 = Map$set$($849, _hero$2, _map$3);
                    var $848 = $850;
                    break;
            };
            return $848;
        }));
        return $847;
    })();

    function Web$Kaelin$Player$new$(_addr$1, _team$2) {
        var $851 = ({
            _: 'Web.Kaelin.Player.new',
            'addr': _addr$1,
            'team': _team$2
        });
        return $851;
    };
    const Web$Kaelin$Player$new = x0 => x1 => Web$Kaelin$Player$new$(x0, x1);

    function Web$Kaelin$Action$create_player$(_user$1, _hero$2, _state$3) {
        var _key$4 = _user$1;
        var _init_pos$5 = Web$Kaelin$Coord$new$(Int$to_i32$(Int$from_nat$(0n)), Int$to_i32$(Int$from_nat$(0n)));
        var self = _state$3;
        switch (self._) {
            case 'Web.Kaelin.State.game':
                var $853 = self.room;
                var $854 = self.tick;
                var $855 = self.players;
                var $856 = self.cast_info;
                var $857 = self.map;
                var $858 = self.interface;
                var self = Map$get$(_key$4, $855);
                switch (self._) {
                    case 'Maybe.none':
                        var _creature$12 = Web$Kaelin$Entity$creature;
                        var _new_player$13 = Web$Kaelin$Player$new$(_user$1, "blue");
                        var _map$14 = Web$Kaelin$Map$push$(_init_pos$5, _creature$12(Maybe$some$(_user$1))(_hero$2), $857);
                        var _new_players$15 = Map$set$(_key$4, _new_player$13, $855);
                        var $860 = Web$Kaelin$State$game$($853, $854, _new_players$15, $856, _map$14, $858);
                        var $859 = $860;
                        break;
                    case 'Maybe.some':
                        var $861 = _state$3;
                        var $859 = $861;
                        break;
                };
                var $852 = $859;
                break;
            case 'Web.Kaelin.State.init':
            case 'Web.Kaelin.State.void':
                var $862 = _state$3;
                var $852 = $862;
                break;
        };
        return $852;
    };
    const Web$Kaelin$Action$create_player = x0 => x1 => x2 => Web$Kaelin$Action$create_player$(x0, x1, x2);
    const String$eql = a0 => a1 => (a0 === a1);

    function String$take$(_n$1, _xs$2) {
        var self = _xs$2;
        if (self.length === 0) {
            var $864 = String$nil;
            var $863 = $864;
        } else {
            var $865 = self.charCodeAt(0);
            var $866 = self.slice(1);
            var self = _n$1;
            if (self === 0n) {
                var $868 = String$nil;
                var $867 = $868;
            } else {
                var $869 = (self - 1n);
                var $870 = String$cons$($865, String$take$($869, $866));
                var $867 = $870;
            };
            var $863 = $867;
        };
        return $863;
    };
    const String$take = x0 => x1 => String$take$(x0, x1);

    function String$slice$(_i$1, _j$2, _xs$3) {
        var $871 = String$take$((_j$2 - _i$1 <= 0n ? 0n : _j$2 - _i$1), String$drop$(_i$1, _xs$3));
        return $871;
    };
    const String$slice = x0 => x1 => x2 => String$slice$(x0, x1, x2);

    function Web$Kaelin$Map$find_players$(_map$1) {
        var _lmap$2 = NatMap$to_list$(_map$1);
        var _result$3 = List$nil;
        var _players$4 = List$nil;
        var _result$5 = (() => {
            var $874 = _result$3;
            var $875 = _lmap$2;
            let _result$6 = $874;
            let _pair$5;
            while ($875._ === 'List.cons') {
                _pair$5 = $875.head;
                var self = _pair$5;
                switch (self._) {
                    case 'Pair.new':
                        var $876 = self.fst;
                        var $877 = self.snd;
                        var _coord$9 = $876;
                        var _tile$10 = $877;
                        var _players$11 = (() => {
                            var $880 = _players$4;
                            var $881 = _tile$10;
                            let _players$12 = $880;
                            let _entity$11;
                            while ($881._ === 'List.cons') {
                                _entity$11 = $881.head;
                                var self = _entity$11;
                                switch (self._) {
                                    case 'Web.Kaelin.Entity.creature':
                                        var $882 = self.player;
                                        var self = $882;
                                        switch (self._) {
                                            case 'Maybe.some':
                                                var $884 = self.value;
                                                var _axial_coord$16 = Web$Kaelin$Coord$Convert$nat_to_axial$(_coord$9);
                                                var $885 = List$cons$(Pair$new$($884, _axial_coord$16), List$nil);
                                                var $883 = $885;
                                                break;
                                            case 'Maybe.none':
                                                var $886 = _players$12;
                                                var $883 = $886;
                                                break;
                                        };
                                        var $880 = $883;
                                        break;
                                    case 'Web.Kaelin.Entity.background':
                                        var $887 = _players$12;
                                        var $880 = $887;
                                        break;
                                };
                                _players$12 = $880;
                                $881 = $881.tail;
                            }
                            return _players$12;
                        })();
                        var $878 = List$concat$(_result$6, _players$11);
                        var $874 = $878;
                        break;
                };
                _result$6 = $874;
                $875 = $875.tail;
            }
            return _result$6;
        })();
        var $872 = Map$from_list$(_result$5);
        return $872;
    };
    const Web$Kaelin$Map$find_players = x0 => Web$Kaelin$Map$find_players$(x0);

    function Web$Kaelin$Map$id_coord$(_addr$1, _map$2) {
        var _list$3 = Web$Kaelin$Map$find_players$(_map$2);
        var $888 = Map$get$(_addr$1, _list$3);
        return $888;
    };
    const Web$Kaelin$Map$id_coord = x0 => x1 => Web$Kaelin$Map$id_coord$(x0, x1);
    const Bool$or = a0 => a1 => (a0 || a1);

    function Web$Kaelin$Map$is_occupied$(_coord$1, _map$2) {
        var _tile$3 = Maybe$default$(Web$Kaelin$Map$get$(_coord$1, _map$2), List$nil);
        var _is_occupied$4 = Bool$false;
        var _is_occupied$5 = (() => {
            var $891 = _is_occupied$4;
            var $892 = _tile$3;
            let _is_occupied$6 = $891;
            let _ent$5;
            while ($892._ === 'List.cons') {
                _ent$5 = $892.head;
                var self = _ent$5;
                switch (self._) {
                    case 'Web.Kaelin.Entity.background':
                        var $893 = (_is_occupied$6 || Bool$false);
                        var $891 = $893;
                        break;
                    case 'Web.Kaelin.Entity.creature':
                        var $894 = Bool$true;
                        var $891 = $894;
                        break;
                };
                _is_occupied$6 = $891;
                $892 = $892.tail;
            }
            return _is_occupied$6;
        })();
        var $889 = _is_occupied$5;
        return $889;
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
                            var $896 = self.head;
                            var $897 = self.tail;
                            var $898 = Pair$new$(Maybe$some$($896), List$concat$(_searched_list$4, $897));
                            var $895 = $898;
                            break;
                        case 'List.nil':
                            var $899 = Pair$new$(Maybe$none, _searched_list$4);
                            var $895 = $899;
                            break;
                    };
                    return $895;
                } else {
                    var $900 = (self - 1n);
                    var self = _list$3;
                    switch (self._) {
                        case 'List.cons':
                            var $902 = self.head;
                            var $903 = self.tail;
                            var $904 = List$pop_at$go$($900, $903, List$concat$(_searched_list$4, List$cons$($902, List$nil)));
                            var $901 = $904;
                            break;
                        case 'List.nil':
                            var $905 = Pair$new$(Maybe$none, _searched_list$4);
                            var $901 = $905;
                            break;
                    };
                    return $901;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const List$pop_at$go = x0 => x1 => x2 => List$pop_at$go$(x0, x1, x2);

    function List$pop_at$(_idx$2, _list$3) {
        var $906 = List$pop_at$go$(_idx$2, _list$3, List$nil);
        return $906;
    };
    const List$pop_at = x0 => x1 => List$pop_at$(x0, x1);

    function Web$Kaelin$Map$pop_at$(_idx$1, _coord$2, _map$3) {
        var _tile$4 = Web$Kaelin$Map$get$(_coord$2, _map$3);
        var self = _tile$4;
        switch (self._) {
            case 'Maybe.some':
                var $908 = self.value;
                var self = List$pop_at$(_idx$1, $908);
                switch (self._) {
                    case 'Pair.new':
                        var $910 = self.fst;
                        var $911 = self.snd;
                        var _map$8 = Web$Kaelin$Map$set$(_coord$2, $911, _map$3);
                        var $912 = Pair$new$(_map$8, $910);
                        var $909 = $912;
                        break;
                };
                var $907 = $909;
                break;
            case 'Maybe.none':
                var $913 = Pair$new$(_map$3, Maybe$none);
                var $907 = $913;
                break;
        };
        return $907;
    };
    const Web$Kaelin$Map$pop_at = x0 => x1 => x2 => Web$Kaelin$Map$pop_at$(x0, x1, x2);

    function Web$Kaelin$Map$swap$(_idx$1, _ca$2, _cb$3, _map$4) {
        var self = Web$Kaelin$Map$pop_at$(_idx$1, _ca$2, _map$4);
        switch (self._) {
            case 'Pair.new':
                var $915 = self.fst;
                var $916 = self.snd;
                var self = $916;
                switch (self._) {
                    case 'Maybe.some':
                        var $918 = self.value;
                        var $919 = Web$Kaelin$Map$push$(_cb$3, $918, $915);
                        var $917 = $919;
                        break;
                    case 'Maybe.none':
                        var $920 = _map$4;
                        var $917 = $920;
                        break;
                };
                var $914 = $917;
                break;
        };
        return $914;
    };
    const Web$Kaelin$Map$swap = x0 => x1 => x2 => x3 => Web$Kaelin$Map$swap$(x0, x1, x2, x3);

    function Web$Kaelin$Player$move$(_coord_b$1, _state$2, _address$3) {
        var self = _state$2;
        switch (self._) {
            case 'Web.Kaelin.State.game':
                var $922 = self.room;
                var $923 = self.tick;
                var $924 = self.players;
                var $925 = self.cast_info;
                var $926 = self.map;
                var $927 = self.interface;
                var _coord_a$10 = Web$Kaelin$Map$id_coord$(_address$3, $926);
                var _is_occupied$11 = Web$Kaelin$Map$is_occupied$(_coord_b$1, $926);
                var _tile_b$12 = Web$Kaelin$Map$get$(_coord_b$1, $926);
                var self = _tile_b$12;
                switch (self._) {
                    case 'Maybe.none':
                        var $929 = _state$2;
                        var $928 = $929;
                        break;
                    case 'Maybe.some':
                        var self = _is_occupied$11;
                        if (self) {
                            var $931 = _state$2;
                            var $930 = $931;
                        } else {
                            var _new_map$14 = Web$Kaelin$Map$swap$(0n, Maybe$default$(_coord_a$10, _coord_b$1), _coord_b$1, $926);
                            var $932 = Web$Kaelin$State$game$($922, $923, $924, $925, _new_map$14, $927);
                            var $930 = $932;
                        };
                        var $928 = $930;
                        break;
                };
                var $921 = $928;
                break;
            case 'Web.Kaelin.State.init':
            case 'Web.Kaelin.State.void':
                var $933 = _state$2;
                var $921 = $933;
                break;
        };
        return $921;
    };
    const Web$Kaelin$Player$move = x0 => x1 => x2 => Web$Kaelin$Player$move$(x0, x1, x2);

    function Web$Kaelin$Player$move_by$(_i$1, _j$2, _state$3, _addr$4) {
        var self = _state$3;
        switch (self._) {
            case 'Web.Kaelin.State.game':
                var $935 = self.map;
                var _coord_a$11 = Web$Kaelin$Map$id_coord$(_addr$4, $935);
                var self = _coord_a$11;
                switch (self._) {
                    case 'Maybe.some':
                        var $937 = self.value;
                        var _coord$13 = $937;
                        var self = _coord$13;
                        switch (self._) {
                            case 'Web.Kaelin.Coord.new':
                                var $939 = self.i;
                                var $940 = self.j;
                                var _coord_b$16 = Web$Kaelin$Coord$new$((($939 + _i$1) >> 0), (($940 + _j$2) >> 0));
                                var $941 = Web$Kaelin$Player$move$(_coord_b$16, _state$3, _addr$4);
                                var $938 = $941;
                                break;
                        };
                        var $936 = $938;
                        break;
                    case 'Maybe.none':
                        var $942 = _state$3;
                        var $936 = $942;
                        break;
                };
                var $934 = $936;
                break;
            case 'Web.Kaelin.State.init':
            case 'Web.Kaelin.State.void':
                var $943 = _state$3;
                var $934 = $943;
                break;
        };
        return $934;
    };
    const Web$Kaelin$Player$move_by = x0 => x1 => x2 => x3 => Web$Kaelin$Player$move_by$(x0, x1, x2, x3);
    const Web$Kaelin$HexEffect$ability = ({
        _: 'Web.Kaelin.HexEffect.ability'
    });
    const Web$Kaelin$HexEffect$movement = ({
        _: 'Web.Kaelin.HexEffect.movement'
    });

    function Web$Kaelin$CastInfo$new$(_mouse_pos$1, _hero_pos$2, _range$3, _hex_effect$4) {
        var $944 = ({
            _: 'Web.Kaelin.CastInfo.new',
            'mouse_pos': _mouse_pos$1,
            'hero_pos': _hero_pos$2,
            'range': _range$3,
            'hex_effect': _hex_effect$4
        });
        return $944;
    };
    const Web$Kaelin$CastInfo$new = x0 => x1 => x2 => x3 => Web$Kaelin$CastInfo$new$(x0, x1, x2, x3);

    function Web$Kaelin$Action$cast$(_range$1, _hex_effect$2, _state$3, _addr$4) {
        var self = _state$3;
        switch (self._) {
            case 'Web.Kaelin.State.game':
                var $946 = self.room;
                var $947 = self.tick;
                var $948 = self.players;
                var $949 = self.map;
                var $950 = self.interface;
                var self = $950;
                switch (self._) {
                    case 'App.EnvInfo.new':
                        var $952 = self.mouse_pos;
                        var _hero_coord$13 = Web$Kaelin$Map$id_coord$(_addr$4, $949);
                        var self = _hero_coord$13;
                        switch (self._) {
                            case 'Maybe.some':
                                var $954 = self.value;
                                var _mouse_coord$15 = Web$Kaelin$Coord$to_axial$($952);
                                var _cast_info$16 = Web$Kaelin$CastInfo$new$(_mouse_coord$15, $954, _range$1, _hex_effect$2);
                                var $955 = Web$Kaelin$State$game$($946, $947, $948, Maybe$some$(_cast_info$16), $949, $950);
                                var $953 = $955;
                                break;
                            case 'Maybe.none':
                                var $956 = _state$3;
                                var $953 = $956;
                                break;
                        };
                        var $951 = $953;
                        break;
                };
                var $945 = $951;
                break;
            case 'Web.Kaelin.State.init':
            case 'Web.Kaelin.State.void':
                var $957 = _state$3;
                var $945 = $957;
                break;
        };
        return $945;
    };
    const Web$Kaelin$Action$cast = x0 => x1 => x2 => x3 => Web$Kaelin$Action$cast$(x0, x1, x2, x3);

    function Web$Kaelin$Action$select$(_state$1, _addr$2) {
        var self = _state$1;
        switch (self._) {
            case 'Web.Kaelin.State.game':
                var $959 = self.map;
                var $960 = self.interface;
                var self = $960;
                switch (self._) {
                    case 'App.EnvInfo.new':
                        var $962 = self.mouse_pos;
                        var _coord$11 = Maybe$default$(Web$Kaelin$Map$id_coord$(_addr$2, $959), Web$Kaelin$Coord$new$(Int$to_i32$(Int$from_nat$(0n)), Int$to_i32$(Int$from_nat$(0n))));
                        var _pos$12 = $962;
                        var self = _pos$12;
                        switch (self._) {
                            case 'Pair.new':
                                var self = _pos$12;
                                switch (self._) {
                                    case 'Pair.new':
                                        var $965 = self.fst;
                                        var $966 = self.snd;
                                        var _mouse$17 = Web$Kaelin$Coord$to_axial$(Pair$new$($965, $966));
                                        var self = Web$Kaelin$Coord$eql$(_coord$11, _mouse$17);
                                        if (self) {
                                            var $968 = Web$Kaelin$Action$cast$(2n, Web$Kaelin$HexEffect$movement, _state$1, _addr$2);
                                            var $967 = $968;
                                        } else {
                                            var $969 = _state$1;
                                            var $967 = $969;
                                        };
                                        var $964 = $967;
                                        break;
                                };
                                var $963 = $964;
                                break;
                        };
                        var $961 = $963;
                        break;
                };
                var $958 = $961;
                break;
            case 'Web.Kaelin.State.init':
            case 'Web.Kaelin.State.void':
                var $970 = _state$1;
                var $958 = $970;
                break;
        };
        return $958;
    };
    const Web$Kaelin$Action$select = x0 => x1 => Web$Kaelin$Action$select$(x0, x1);

    function Web$Kaelin$App$when$(_event$1, _state$2) {
        var self = _event$1;
        switch (self._) {
            case 'App.Event.tick':
                var $972 = self.info;
                var self = _state$2;
                switch (self._) {
                    case 'Web.Kaelin.State.init':
                    case 'Web.Kaelin.State.void':
                        var $974 = App$pass;
                        var $973 = $974;
                        break;
                    case 'Web.Kaelin.State.game':
                        var _info$11 = $972;
                        var $975 = App$store$(Web$Kaelin$Action$update_interface$(_info$11, _state$2));
                        var $973 = $975;
                        break;
                };
                var $971 = $973;
                break;
            case 'App.Event.key_down':
                var $976 = self.code;
                var self = _state$2;
                switch (self._) {
                    case 'Web.Kaelin.State.game':
                        var $978 = self.room;
                        var self = ($976 === 49);
                        if (self) {
                            var $980 = App$post$($978, Web$Kaelin$Command$create_player$("0x00000001"));
                            var $979 = $980;
                        } else {
                            var self = ($976 === 50);
                            if (self) {
                                var $982 = App$post$($978, Web$Kaelin$Command$create_player$("0x00000002"));
                                var $981 = $982;
                            } else {
                                var self = ($976 === 51);
                                if (self) {
                                    var $984 = App$post$($978, Web$Kaelin$Command$create_player$("0x00000003"));
                                    var $983 = $984;
                                } else {
                                    var self = ($976 === 52);
                                    if (self) {
                                        var $986 = App$post$($978, Web$Kaelin$Command$create_player$("0x00000004"));
                                        var $985 = $986;
                                    } else {
                                        var self = ($976 === 68);
                                        if (self) {
                                            var $988 = App$post$($978, "0x2100000000000000000000000000000000000000000000000000000000000001");
                                            var $987 = $988;
                                        } else {
                                            var self = ($976 === 65);
                                            if (self) {
                                                var $990 = App$post$($978, "0x2200000000000000000000000000000000000000000000000000000000000001");
                                                var $989 = $990;
                                            } else {
                                                var self = ($976 === 87);
                                                if (self) {
                                                    var $992 = App$post$($978, "0x2300000000000000000000000000000000000000000000000000000000000001");
                                                    var $991 = $992;
                                                } else {
                                                    var self = ($976 === 83);
                                                    if (self) {
                                                        var $994 = App$post$($978, "0x2400000000000000000000000000000000000000000000000000000000000001");
                                                        var $993 = $994;
                                                    } else {
                                                        var self = ($976 === 90);
                                                        if (self) {
                                                            var $996 = App$post$($978, "0x3100000000000000000000000000000000000000000000000000000000000001");
                                                            var $995 = $996;
                                                        } else {
                                                            var self = ($976 === 88);
                                                            if (self) {
                                                                var $998 = App$post$($978, "0x3200000000000000000000000000000000000000000000000000000000000001");
                                                                var $997 = $998;
                                                            } else {
                                                                var self = ($976 === 67);
                                                                if (self) {
                                                                    var $1000 = App$post$($978, "0x3300000000000000000000000000000000000000000000000000000000000001");
                                                                    var $999 = $1000;
                                                                } else {
                                                                    var $1001 = App$pass;
                                                                    var $999 = $1001;
                                                                };
                                                                var $997 = $999;
                                                            };
                                                            var $995 = $997;
                                                        };
                                                        var $993 = $995;
                                                    };
                                                    var $991 = $993;
                                                };
                                                var $989 = $991;
                                            };
                                            var $987 = $989;
                                        };
                                        var $985 = $987;
                                    };
                                    var $983 = $985;
                                };
                                var $981 = $983;
                            };
                            var $979 = $981;
                        };
                        var $977 = $979;
                        break;
                    case 'Web.Kaelin.State.init':
                    case 'Web.Kaelin.State.void':
                        var $1002 = App$pass;
                        var $977 = $1002;
                        break;
                };
                var $971 = $977;
                break;
            case 'App.Event.post':
                var $1003 = self.addr;
                var $1004 = self.data;
                var self = _state$2;
                switch (self._) {
                    case 'Web.Kaelin.State.init':
                    case 'Web.Kaelin.State.void':
                        var $1006 = App$pass;
                        var $1005 = $1006;
                        break;
                    case 'Web.Kaelin.State.game':
                        var self = String$starts_with$($1004, "0x1");
                        if (self) {
                            var _hero_id$13 = ("0x" + String$drop$(58n, $1004));
                            var _hero$14 = Map$get$(_hero_id$13, Web$Kaelin$Resources$heroes);
                            var self = _hero$14;
                            switch (self._) {
                                case 'Maybe.some':
                                    var $1009 = self.value;
                                    var $1010 = App$store$(Web$Kaelin$Action$create_player$($1003, $1009, _state$2));
                                    var $1008 = $1010;
                                    break;
                                case 'Maybe.none':
                                    var $1011 = App$pass;
                                    var $1008 = $1011;
                                    break;
                            };
                            var $1007 = $1008;
                        } else {
                            var self = String$starts_with$($1004, "0x2");
                            if (self) {
                                var self = (String$slice$(3n, 4n, $1004) === "1");
                                if (self) {
                                    var $1014 = Pair$new$(Int$to_i32$(Int$from_nat$(1n)), Int$to_i32$(Int$from_nat$(0n)));
                                    var self = $1014;
                                } else {
                                    var self = (String$slice$(3n, 4n, $1004) === "2");
                                    if (self) {
                                        var $1016 = Pair$new$(Int$to_i32$(Int$neg$(Int$from_nat$(1n))), Int$to_i32$(Int$from_nat$(0n)));
                                        var $1015 = $1016;
                                    } else {
                                        var self = (String$slice$(3n, 4n, $1004) === "3");
                                        if (self) {
                                            var $1018 = Pair$new$(Int$to_i32$(Int$from_nat$(0n)), Int$to_i32$(Int$neg$(Int$from_nat$(1n))));
                                            var $1017 = $1018;
                                        } else {
                                            var self = (String$slice$(3n, 4n, $1004) === "4");
                                            if (self) {
                                                var $1020 = Pair$new$(Int$to_i32$(Int$from_nat$(0n)), Int$to_i32$(Int$from_nat$(1n)));
                                                var $1019 = $1020;
                                            } else {
                                                var $1021 = Pair$new$(Int$to_i32$(Int$from_nat$(0n)), Int$to_i32$(Int$from_nat$(0n)));
                                                var $1019 = $1021;
                                            };
                                            var $1017 = $1019;
                                        };
                                        var $1015 = $1017;
                                    };
                                    var self = $1015;
                                };
                                switch (self._) {
                                    case 'Pair.new':
                                        var $1022 = self.fst;
                                        var $1023 = self.snd;
                                        var $1024 = App$store$(Web$Kaelin$Player$move_by$($1022, $1023, _state$2, $1003));
                                        var $1013 = $1024;
                                        break;
                                };
                                var $1012 = $1013;
                            } else {
                                var self = String$starts_with$($1004, "0x3");
                                if (self) {
                                    var self = (String$slice$(3n, 4n, $1004) === "1");
                                    if (self) {
                                        var $1027 = Pair$new$(1n, Web$Kaelin$HexEffect$ability);
                                        var self = $1027;
                                    } else {
                                        var self = (String$slice$(3n, 4n, $1004) === "2");
                                        if (self) {
                                            var $1029 = Pair$new$(2n, Web$Kaelin$HexEffect$ability);
                                            var $1028 = $1029;
                                        } else {
                                            var self = (String$slice$(3n, 4n, $1004) === "3");
                                            if (self) {
                                                var $1031 = Pair$new$(2n, Web$Kaelin$HexEffect$movement);
                                                var $1030 = $1031;
                                            } else {
                                                var $1032 = Pair$new$(0n, Web$Kaelin$HexEffect$ability);
                                                var $1030 = $1032;
                                            };
                                            var $1028 = $1030;
                                        };
                                        var self = $1028;
                                    };
                                    switch (self._) {
                                        case 'Pair.new':
                                            var $1033 = self.fst;
                                            var $1034 = self.snd;
                                            var $1035 = App$store$(Web$Kaelin$Action$cast$($1033, $1034, _state$2, $1003));
                                            var $1026 = $1035;
                                            break;
                                    };
                                    var $1025 = $1026;
                                } else {
                                    var self = String$starts_with$($1004, "0x4");
                                    if (self) {
                                        var $1037 = App$store$(Web$Kaelin$Action$select$(_state$2, $1003));
                                        var $1036 = $1037;
                                    } else {
                                        var $1038 = App$pass;
                                        var $1036 = $1038;
                                    };
                                    var $1025 = $1036;
                                };
                                var $1012 = $1025;
                            };
                            var $1007 = $1012;
                        };
                        var $1005 = $1007;
                        break;
                };
                var $971 = $1005;
                break;
            case 'App.Event.init':
                var self = _state$2;
                switch (self._) {
                    case 'Web.Kaelin.State.init':
                    case 'Web.Kaelin.State.void':
                        var $1040 = App$pass;
                        var $1039 = $1040;
                        break;
                    case 'Web.Kaelin.State.game':
                        var $1041 = App$watch$(Web$Kaelin$Constants$room);
                        var $1039 = $1041;
                        break;
                };
                var $971 = $1039;
                break;
            case 'App.Event.mouse_down':
            case 'App.Event.mouse_up':
            case 'App.Event.key_up':
            case 'App.Event.mouse_over':
            case 'App.Event.mouse_out':
            case 'App.Event.resize':
                var self = _state$2;
                switch (self._) {
                    case 'Web.Kaelin.State.init':
                    case 'Web.Kaelin.State.void':
                    case 'Web.Kaelin.State.game':
                        var $1043 = App$pass;
                        var $1042 = $1043;
                        break;
                };
                var $971 = $1042;
                break;
            case 'App.Event.mouse_click':
                var self = _state$2;
                switch (self._) {
                    case 'Web.Kaelin.State.init':
                    case 'Web.Kaelin.State.void':
                    case 'Web.Kaelin.State.game':
                        var $1045 = App$pass;
                        var $1044 = $1045;
                        break;
                };
                var $971 = $1044;
                break;
        };
        return $971;
    };
    const Web$Kaelin$App$when = x0 => x1 => Web$Kaelin$App$when$(x0, x1);

    function App$new$(_init$2, _draw$3, _when$4) {
        var $1046 = ({
            _: 'App.new',
            'init': _init$2,
            'draw': _draw$3,
            'when': _when$4
        });
        return $1046;
    };
    const App$new = x0 => x1 => x2 => App$new$(x0, x1, x2);
    const Web$Kaelin = (() => {
        var _img$1 = VoxBox$alloc_capacity$(((65536 * 8) >>> 0));
        var _init$2 = Web$Kaelin$App$init;
        var _draw$3 = Web$Kaelin$App$draw(_img$1);
        var _when$4 = Web$Kaelin$App$when;
        var $1047 = App$new$(_init$2, _draw$3, _when$4);
        return $1047;
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
        'Web.Kaelin.Coord.new': Web$Kaelin$Coord$new,
        'Web.Kaelin.Entity.creature': Web$Kaelin$Entity$creature,
        'Web.Kaelin.Hero.new': Web$Kaelin$Hero$new,
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
        'I32.new': I32$new,
        'I32.add': I32$add,
        'Word.neg.aux': Word$neg$aux,
        'Word.neg': Word$neg,
        'I32.neg': I32$neg,
        'Int.to_i32': Int$to_i32,
        'Int.new': Int$new,
        'Int.from_nat': Int$from_nat,
        'I32.mul': I32$mul,
        'Int.to_nat': Int$to_nat,
        'Word.is_neg.go': Word$is_neg$go,
        'Word.is_neg': Word$is_neg,
        'Word.fold': Word$fold,
        'Nat.add': Nat$add,
        'Nat.mul': Nat$mul,
        'Word.to_nat': Word$to_nat,
        'Word.abs': Word$abs,
        'Int.neg': Int$neg,
        'Word.to_int': Word$to_int,
        'I32.to_int': I32$to_int,
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
        'Web.Kaelin.Assets.tile.green_2': Web$Kaelin$Assets$tile$green_2,
        'Web.Kaelin.Assets.tile.effect.light_red1': Web$Kaelin$Assets$tile$effect$light_red1,
        'Web.Kaelin.Assets.tile.effect.blue_green1': Web$Kaelin$Assets$tile$effect$blue_green1,
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
        'Cmp.as_gtn': Cmp$as_gtn,
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
        'List.for': List$for,
        'Pair.fst': Pair$fst,
        'Either': Either,
        'Either.left': Either$left,
        'Either.right': Either$right,
        'Nat.sub_rem': Nat$sub_rem,
        'Nat.div_mod.go': Nat$div_mod$go,
        'Nat.div_mod': Nat$div_mod,
        'Nat.div': Nat$div,
        'Int.add': Int$add,
        'Int.sub': Int$sub,
        'Nat.mod.go': Nat$mod$go,
        'Nat.mod': Nat$mod,
        'Web.Kaelin.Coord.Convert.nat_to_axial': Web$Kaelin$Coord$Convert$nat_to_axial,
        'Web.Kaelin.Constants.hexagon_radius': Web$Kaelin$Constants$hexagon_radius,
        'I32.div': I32$div,
        'Web.Kaelin.Constants.center_x': Web$Kaelin$Constants$center_x,
        'Web.Kaelin.Constants.center_y': Web$Kaelin$Constants$center_y,
        'Web.Kaelin.Coord.to_screen_xy': Web$Kaelin$Coord$to_screen_xy,
        'U32.sub': U32$sub,
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
        'List.map': List$map,
        'Web.Kaelin.Coord.Convert.cubic_to_axial': Web$Kaelin$Coord$Convert$cubic_to_axial,
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
        'Web.Kaelin.Draw.terrain': Web$Kaelin$Draw$terrain,
        'Web.Kaelin.Draw.state.range_cast': Web$Kaelin$Draw$state$range_cast,
        'F64.div': F64$div,
        'F64.parse': F64$parse,
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
        'List.any': List$any,
        'Bool.and': Bool$and,
        'I32.eql': I32$eql,
        'Web.Kaelin.Coord.eql': Web$Kaelin$Coord$eql,
        'Web.Kaelin.Assets.tile.effect.dark_blue1': Web$Kaelin$Assets$tile$effect$dark_blue1,
        'Web.Kaelin.Assets.tile.effect.dark_red1': Web$Kaelin$Assets$tile$effect$dark_red1,
        'Web.Kaelin.Draw.state.highlight': Web$Kaelin$Draw$state$highlight,
        'Web.Kaelin.Draw.hero': Web$Kaelin$Draw$hero,
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
        'IO.do': IO$do,
        'App.do': App$do,
        'App.watch': App$watch,
        'App.store': App$store,
        'Web.Kaelin.Action.update_interface': Web$Kaelin$Action$update_interface,
        'U16.eql': U16$eql,
        'U16.new': U16$new,
        'Nat.to_u16': Nat$to_u16,
        'String.cons': String$cons,
        'String.concat': String$concat,
        'App.post': App$post,
        'String.nil': String$nil,
        'String.repeat': String$repeat,
        'String.drop': String$drop,
        'Web.Kaelin.Command.create_player': Web$Kaelin$Command$create_player,
        'Char.eql': Char$eql,
        'String.starts_with': String$starts_with,
        'Map.get': Map$get,
        'List.fold': List$fold,
        'Map.set': Map$set,
        'Web.Kaelin.Resources.heroes': Web$Kaelin$Resources$heroes,
        'Web.Kaelin.Player.new': Web$Kaelin$Player$new,
        'Web.Kaelin.Action.create_player': Web$Kaelin$Action$create_player,
        'String.eql': String$eql,
        'String.take': String$take,
        'String.slice': String$slice,
        'Web.Kaelin.Map.find_players': Web$Kaelin$Map$find_players,
        'Web.Kaelin.Map.id_coord': Web$Kaelin$Map$id_coord,
        'Bool.or': Bool$or,
        'Web.Kaelin.Map.is_occupied': Web$Kaelin$Map$is_occupied,
        'List.pop_at.go': List$pop_at$go,
        'List.pop_at': List$pop_at,
        'Web.Kaelin.Map.pop_at': Web$Kaelin$Map$pop_at,
        'Web.Kaelin.Map.swap': Web$Kaelin$Map$swap,
        'Web.Kaelin.Player.move': Web$Kaelin$Player$move,
        'Web.Kaelin.Player.move_by': Web$Kaelin$Player$move_by,
        'Web.Kaelin.HexEffect.ability': Web$Kaelin$HexEffect$ability,
        'Web.Kaelin.HexEffect.movement': Web$Kaelin$HexEffect$movement,
        'Web.Kaelin.CastInfo.new': Web$Kaelin$CastInfo$new,
        'Web.Kaelin.Action.cast': Web$Kaelin$Action$cast,
        'Web.Kaelin.Action.select': Web$Kaelin$Action$select,
        'Web.Kaelin.App.when': Web$Kaelin$App$when,
        'App.new': App$new,
        'Web.Kaelin': Web$Kaelin,
    };
})();

/***/ })

}]);
//# sourceMappingURL=927.index.js.map