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

    function Web$Kaelin$Entity$hero$(_img$1) {
        var $143 = ({
            _: 'Web.Kaelin.Entity.hero',
            'img': _img$1
        });
        return $143;
    };
    const Web$Kaelin$Entity$hero = x0 => Web$Kaelin$Entity$hero$(x0);
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
                    var $144 = _value$3;
                    return $144;
                } else {
                    var $145 = (self - 1n);
                    var $146 = Word$shift_left$($145, Word$shift_left1$(_value$3));
                    return $146;
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
                var $148 = Bool$false;
                var $147 = $148;
                break;
            case 'Cmp.eql':
            case 'Cmp.gtn':
                var $149 = Bool$true;
                var $147 = $149;
                break;
        };
        return $147;
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
                var $151 = self.pred;
                var $152 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $154 = self.pred;
                            var $155 = (_a$pred$10 => {
                                var $156 = Word$cmp$go$(_a$pred$10, $154, _c$4);
                                return $156;
                            });
                            var $153 = $155;
                            break;
                        case 'Word.i':
                            var $157 = self.pred;
                            var $158 = (_a$pred$10 => {
                                var $159 = Word$cmp$go$(_a$pred$10, $157, Cmp$ltn);
                                return $159;
                            });
                            var $153 = $158;
                            break;
                        case 'Word.e':
                            var $160 = (_a$pred$8 => {
                                var $161 = _c$4;
                                return $161;
                            });
                            var $153 = $160;
                            break;
                    };
                    var $153 = $153($151);
                    return $153;
                });
                var $150 = $152;
                break;
            case 'Word.i':
                var $162 = self.pred;
                var $163 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $165 = self.pred;
                            var $166 = (_a$pred$10 => {
                                var $167 = Word$cmp$go$(_a$pred$10, $165, Cmp$gtn);
                                return $167;
                            });
                            var $164 = $166;
                            break;
                        case 'Word.i':
                            var $168 = self.pred;
                            var $169 = (_a$pred$10 => {
                                var $170 = Word$cmp$go$(_a$pred$10, $168, _c$4);
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
                var $150 = $163;
                break;
            case 'Word.e':
                var $173 = (_b$5 => {
                    var $174 = _c$4;
                    return $174;
                });
                var $150 = $173;
                break;
        };
        var $150 = $150(_b$3);
        return $150;
    };
    const Word$cmp$go = x0 => x1 => x2 => Word$cmp$go$(x0, x1, x2);
    const Cmp$eql = ({
        _: 'Cmp.eql'
    });

    function Word$cmp$(_a$2, _b$3) {
        var $175 = Word$cmp$go$(_a$2, _b$3, Cmp$eql);
        return $175;
    };
    const Word$cmp = x0 => x1 => Word$cmp$(x0, x1);

    function Word$gte$(_a$2, _b$3) {
        var $176 = Cmp$as_gte$(Word$cmp$(_a$2, _b$3));
        return $176;
    };
    const Word$gte = x0 => x1 => Word$gte$(x0, x1);

    function Pair$(_A$1, _B$2) {
        var $177 = null;
        return $177;
    };
    const Pair = x0 => x1 => Pair$(x0, x1);

    function Pair$new$(_fst$3, _snd$4) {
        var $178 = ({
            _: 'Pair.new',
            'fst': _fst$3,
            'snd': _snd$4
        });
        return $178;
    };
    const Pair$new = x0 => x1 => Pair$new$(x0, x1);

    function Word$or$(_a$2, _b$3) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $180 = self.pred;
                var $181 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $183 = self.pred;
                            var $184 = (_a$pred$9 => {
                                var $185 = Word$o$(Word$or$(_a$pred$9, $183));
                                return $185;
                            });
                            var $182 = $184;
                            break;
                        case 'Word.i':
                            var $186 = self.pred;
                            var $187 = (_a$pred$9 => {
                                var $188 = Word$i$(Word$or$(_a$pred$9, $186));
                                return $188;
                            });
                            var $182 = $187;
                            break;
                        case 'Word.e':
                            var $189 = (_a$pred$7 => {
                                var $190 = Word$e;
                                return $190;
                            });
                            var $182 = $189;
                            break;
                    };
                    var $182 = $182($180);
                    return $182;
                });
                var $179 = $181;
                break;
            case 'Word.i':
                var $191 = self.pred;
                var $192 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $194 = self.pred;
                            var $195 = (_a$pred$9 => {
                                var $196 = Word$i$(Word$or$(_a$pred$9, $194));
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
                var $179 = $192;
                break;
            case 'Word.e':
                var $202 = (_b$4 => {
                    var $203 = Word$e;
                    return $203;
                });
                var $179 = $202;
                break;
        };
        var $179 = $179(_b$3);
        return $179;
    };
    const Word$or = x0 => x1 => Word$or$(x0, x1);

    function Word$shift_right1$aux$(_word$2) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $205 = self.pred;
                var $206 = Word$o$(Word$shift_right1$aux$($205));
                var $204 = $206;
                break;
            case 'Word.i':
                var $207 = self.pred;
                var $208 = Word$i$(Word$shift_right1$aux$($207));
                var $204 = $208;
                break;
            case 'Word.e':
                var $209 = Word$o$(Word$e);
                var $204 = $209;
                break;
        };
        return $204;
    };
    const Word$shift_right1$aux = x0 => Word$shift_right1$aux$(x0);

    function Word$shift_right1$(_word$2) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $211 = self.pred;
                var $212 = Word$shift_right1$aux$($211);
                var $210 = $212;
                break;
            case 'Word.i':
                var $213 = self.pred;
                var $214 = Word$shift_right1$aux$($213);
                var $210 = $214;
                break;
            case 'Word.e':
                var $215 = Word$e;
                var $210 = $215;
                break;
        };
        return $210;
    };
    const Word$shift_right1 = x0 => Word$shift_right1$(x0);

    function Word$subber$(_a$2, _b$3, _c$4) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $217 = self.pred;
                var $218 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $220 = self.pred;
                            var $221 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $223 = Word$i$(Word$subber$(_a$pred$10, $220, Bool$true));
                                    var $222 = $223;
                                } else {
                                    var $224 = Word$o$(Word$subber$(_a$pred$10, $220, Bool$false));
                                    var $222 = $224;
                                };
                                return $222;
                            });
                            var $219 = $221;
                            break;
                        case 'Word.i':
                            var $225 = self.pred;
                            var $226 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $228 = Word$o$(Word$subber$(_a$pred$10, $225, Bool$true));
                                    var $227 = $228;
                                } else {
                                    var $229 = Word$i$(Word$subber$(_a$pred$10, $225, Bool$true));
                                    var $227 = $229;
                                };
                                return $227;
                            });
                            var $219 = $226;
                            break;
                        case 'Word.e':
                            var $230 = (_a$pred$8 => {
                                var $231 = Word$e;
                                return $231;
                            });
                            var $219 = $230;
                            break;
                    };
                    var $219 = $219($217);
                    return $219;
                });
                var $216 = $218;
                break;
            case 'Word.i':
                var $232 = self.pred;
                var $233 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $235 = self.pred;
                            var $236 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $238 = Word$o$(Word$subber$(_a$pred$10, $235, Bool$false));
                                    var $237 = $238;
                                } else {
                                    var $239 = Word$i$(Word$subber$(_a$pred$10, $235, Bool$false));
                                    var $237 = $239;
                                };
                                return $237;
                            });
                            var $234 = $236;
                            break;
                        case 'Word.i':
                            var $240 = self.pred;
                            var $241 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $243 = Word$i$(Word$subber$(_a$pred$10, $240, Bool$true));
                                    var $242 = $243;
                                } else {
                                    var $244 = Word$o$(Word$subber$(_a$pred$10, $240, Bool$false));
                                    var $242 = $244;
                                };
                                return $242;
                            });
                            var $234 = $241;
                            break;
                        case 'Word.e':
                            var $245 = (_a$pred$8 => {
                                var $246 = Word$e;
                                return $246;
                            });
                            var $234 = $245;
                            break;
                    };
                    var $234 = $234($232);
                    return $234;
                });
                var $216 = $233;
                break;
            case 'Word.e':
                var $247 = (_b$5 => {
                    var $248 = Word$e;
                    return $248;
                });
                var $216 = $247;
                break;
        };
        var $216 = $216(_b$3);
        return $216;
    };
    const Word$subber = x0 => x1 => x2 => Word$subber$(x0, x1, x2);

    function Word$sub$(_a$2, _b$3) {
        var $249 = Word$subber$(_a$2, _b$3, Bool$false);
        return $249;
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
                    var $250 = Pair$new$(Bool$true, Word$or$(_value$5, _mask$6));
                    var self = $250;
                } else {
                    var $251 = Pair$new$(Bool$false, _value$5);
                    var self = $251;
                };
                switch (self._) {
                    case 'Pair.new':
                        var $252 = self.fst;
                        var $253 = self.snd;
                        var self = _shift$2;
                        if (self === 0n) {
                            var $255 = $253;
                            var $254 = $255;
                        } else {
                            var $256 = (self - 1n);
                            var _new_shift_copy$9 = Word$shift_right1$(_shift_copy$4);
                            var self = $252;
                            if (self) {
                                var $258 = Word$div$go$($256, Word$sub$(_sub_copy$3, _shift_copy$4), _new_shift_copy$9, $253);
                                var $257 = $258;
                            } else {
                                var $259 = Word$div$go$($256, _sub_copy$3, _new_shift_copy$9, $253);
                                var $257 = $259;
                            };
                            var $254 = $257;
                        };
                        return $254;
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
            var $261 = Word$to_zero$(_a$2);
            var $260 = $261;
        } else {
            var _shift$6 = (_a_bits$4 - _b_bits$5 <= 0n ? 0n : _a_bits$4 - _b_bits$5);
            var _shift_copy$7 = Word$shift_left$(_shift$6, _b$3);
            var $262 = Word$div$go$(_shift$6, _a$2, _shift_copy$7, Word$to_zero$(_a$2));
            var $260 = $262;
        };
        return $260;
    };
    const Word$div = x0 => x1 => Word$div$(x0, x1);
    const U32$div = a0 => a1 => ((a0 / a1) >>> 0);
    const U32$length = a0 => ((a0.length) >>> 0);

    function Cmp$as_eql$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
            case 'Cmp.gtn':
                var $264 = Bool$false;
                var $263 = $264;
                break;
            case 'Cmp.eql':
                var $265 = Bool$true;
                var $263 = $265;
                break;
        };
        return $263;
    };
    const Cmp$as_eql = x0 => Cmp$as_eql$(x0);

    function Word$eql$(_a$2, _b$3) {
        var $266 = Cmp$as_eql$(Word$cmp$(_a$2, _b$3));
        return $266;
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
        var $267 = (parseInt(_chr$3, 16));
        return $267;
    };
    const VoxBox$parse_byte = x0 => x1 => VoxBox$parse_byte$(x0, x1);
    const U32$or = a0 => a1 => (a0 | a1);
    const U32$shl = a0 => a1 => ((a0 << a1) >>> 0);
    const Pos32$new = a0 => a1 => a2 => ((0 | a0 | (a1 << 12) | (a2 << 24)));
    const Col32$new = a0 => a1 => a2 => a3 => ((0 | a0 | (a1 << 8) | (a2 << 16) | (a3 << 24)));

    function Word$trim$(_new_size$2, _word$3) {
        var self = _new_size$2;
        if (self === 0n) {
            var $269 = Word$e;
            var $268 = $269;
        } else {
            var $270 = (self - 1n);
            var self = _word$3;
            switch (self._) {
                case 'Word.o':
                    var $272 = self.pred;
                    var $273 = Word$o$(Word$trim$($270, $272));
                    var $271 = $273;
                    break;
                case 'Word.i':
                    var $274 = self.pred;
                    var $275 = Word$i$(Word$trim$($270, $274));
                    var $271 = $275;
                    break;
                case 'Word.e':
                    var $276 = Word$o$(Word$trim$($270, Word$e));
                    var $271 = $276;
                    break;
            };
            var $268 = $271;
        };
        return $268;
    };
    const Word$trim = x0 => x1 => Word$trim$(x0, x1);
    const Unit$new = null;

    function Array$extract_tip$(_arr$2) {
        var self = _arr$2;
        switch (self._) {
            case 'Array.tip':
                var $278 = self.value;
                var $279 = $278;
                var $277 = $279;
                break;
            case 'Array.tie':
                var $280 = Unit$new;
                var $277 = $280;
                break;
        };
        return $277;
    };
    const Array$extract_tip = x0 => Array$extract_tip$(x0);

    function Array$extract_tie$(_arr$3) {
        var self = _arr$3;
        switch (self._) {
            case 'Array.tie':
                var $282 = self.lft;
                var $283 = self.rgt;
                var $284 = Pair$new$($282, $283);
                var $281 = $284;
                break;
            case 'Array.tip':
                var $285 = Unit$new;
                var $281 = $285;
                break;
        };
        return $281;
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
                        var $286 = self.pred;
                        var $287 = Word$foldl$(_w0$4(_nil$3), _w0$4, _w1$5, $286);
                        return $287;
                    case 'Word.i':
                        var $288 = self.pred;
                        var $289 = Word$foldl$(_w1$5(_nil$3), _w0$4, _w1$5, $288);
                        return $289;
                    case 'Word.e':
                        var $290 = _nil$3;
                        return $290;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Word$foldl = x0 => x1 => x2 => x3 => Word$foldl$(x0, x1, x2, x3);

    function Array$mut$(_idx$3, _f$4, _arr$5) {
        var $291 = Word$foldl$((_arr$6 => {
            var $292 = Array$tip$(_f$4(Array$extract_tip$(_arr$6)));
            return $292;
        }), (_rec$7 => _arr$8 => {
            var self = Array$extract_tie$(_arr$8);
            switch (self._) {
                case 'Pair.new':
                    var $294 = self.fst;
                    var $295 = self.snd;
                    var $296 = Array$tie$(_rec$7($294), $295);
                    var $293 = $296;
                    break;
            };
            return $293;
        }), (_rec$7 => _arr$8 => {
            var self = Array$extract_tie$(_arr$8);
            switch (self._) {
                case 'Pair.new':
                    var $298 = self.fst;
                    var $299 = self.snd;
                    var $300 = Array$tie$($298, _rec$7($299));
                    var $297 = $300;
                    break;
            };
            return $297;
        }), _idx$3)(_arr$5);
        return $291;
    };
    const Array$mut = x0 => x1 => x2 => Array$mut$(x0, x1, x2);

    function Array$set$(_idx$3, _val$4, _arr$5) {
        var $301 = Array$mut$(_idx$3, (_x$6 => {
            var $302 = _val$4;
            return $302;
        }), _arr$5);
        return $301;
    };
    const Array$set = x0 => x1 => x2 => Array$set$(x0, x1, x2);
    const Buffer32$set = a0 => a1 => a2 => ((a2[a0] = a1, a2));
    const VoxBox$set_pos = a0 => a1 => a2 => ((a2.buffer[a0 * 2] = a1, a2));
    const VoxBox$set_col = a0 => a1 => a2 => ((a2.buffer[a0 * 2 + 1] = a1, a2));

    function VoxBox$set_length$(_length$1, _img$2) {
        var self = _img$2;
        switch (self._) {
            case 'VoxBox.new':
                var $304 = self.capacity;
                var $305 = self.buffer;
                var $306 = VoxBox$new$(_length$1, $304, $305);
                var $303 = $306;
                break;
        };
        return $303;
    };
    const VoxBox$set_length = x0 => x1 => VoxBox$set_length$(x0, x1);
    const VoxBox$push = a0 => a1 => a2 => ((a2.buffer[a2.length * 2] = a0, a2.buffer[a2.length * 2 + 1] = a1, a2.length++, a2));

    function VoxBox$parse$(_voxdata$1) {
        var _siz$2 = ((((_voxdata$1.length) >>> 0) / 12) >>> 0);
        var _img$3 = VoxBox$alloc_capacity$(_siz$2);
        var _img$4 = (() => {
            var $308 = _img$3;
            var $309 = 0;
            var $310 = _siz$2;
            let _img$5 = $308;
            for (let _i$4 = $309; _i$4 < $310; ++_i$4) {
                var _x$6 = VoxBox$parse_byte$(((((_i$4 * 6) >>> 0) + 0) >>> 0), _voxdata$1);
                var _y$7 = VoxBox$parse_byte$(((((_i$4 * 6) >>> 0) + 1) >>> 0), _voxdata$1);
                var _z$8 = VoxBox$parse_byte$(((((_i$4 * 6) >>> 0) + 2) >>> 0), _voxdata$1);
                var _r$9 = VoxBox$parse_byte$(((((_i$4 * 6) >>> 0) + 3) >>> 0), _voxdata$1);
                var _g$10 = VoxBox$parse_byte$(((((_i$4 * 6) >>> 0) + 4) >>> 0), _voxdata$1);
                var _b$11 = VoxBox$parse_byte$(((((_i$4 * 6) >>> 0) + 5) >>> 0), _voxdata$1);
                var _pos$12 = ((0 | _x$6 | (_y$7 << 12) | (_z$8 << 24)));
                var _col$13 = ((0 | _r$9 | (_g$10 << 8) | (_b$11 << 16) | (255 << 24)));
                var $308 = ((_img$5.buffer[_img$5.length * 2] = _pos$12, _img$5.buffer[_img$5.length * 2 + 1] = _col$13, _img$5.length++, _img$5));
                _img$5 = $308;
            };
            return _img$5;
        })();
        var $307 = _img$4;
        return $307;
    };
    const VoxBox$parse = x0 => VoxBox$parse$(x0);
    const Web$Kaelin$Assets$hero$croni0_d_1 = VoxBox$parse$("0f0b16351d4d100b16351d4d0d0c15351d4d0e0c15351d4d0f0c156a3a86100c158e4a9d110c15351d4d120c15351d4d0c0d14351d4d0d0d146a3a860e0d146a3a860f0d148e4a9d100d146a3a86110d146a3a86120d146a3a86130d14351d4d0b0e13351d4d0c0e136a3a860d0e136a3a860e0e136a3a860f0e136a3a86100e136a3a86110e136a3a86120e136a3a86130e136a3a86140e13351d4d0a0f12351d4d0b0f126a3a860c0f126a3a860d0f126a3a860e0f126a3a860f0f126a3a86100f126a3a86110f126a3a86120f126a3a86130f126a3a86140f126a3a86150f12351d4d0a1011351d4d0b10116a3a860c10116a3a860d10116a3a860e10116a3a860f10116a3a861010116a3a861110116a3a861210116a3a861310116a3a861410116a3a86151011351d4d091110351d4d0a11106a3a860b11106a3a860c11106a3a860d11106a3a860e11106a3a860f11106a3a861011106a3a861111106a3a861211106a3a861311106a3a861411106a3a861511106a3a86161110351d4d09120f351d4d0a120f6a3a860b120f6a3a860c120f602d800d120f602d800e120f6a3a860f120f6a3a8610120f6a3a8611120f6a3a8612120f602d8013120f602d8014120f6a3a8615120f6a3a8616120f351d4d09130e351d4d0a130e602d800b130e602d800c130e351d4d0d130e351d4d0e130e6a3a860f130e6a3a8610130e6a3a8611130e6a3a8612130e351d4d13130e351d4d14130e602d8015130e602d8016130e351d4d09140d351d4d0a140d602d800b140d351d4d0c140d351d4d0d140d531e480e140d351d4d0f140d6a3a8610140d6a3a8611140d351d4d12140d531e4813140d351d4d14140d351d4d15140d4a358016140d351d4d09150c351d4d0a150c4a35800b150c351d4d0c150c531e480d150cdf3e460e150c531e480f150c351d4d10150c351d4d11150c531e4812150cdf3e4613150c531e4814150c351d4d15150c4a358016150c351d4d0a160b351d4d0b160b4a35800c160b351d4d0d160b531e480e160b351d4d0f160b351d4d10160b351d4d11160b351d4d12160b531e4813160b351d4d14160b4a358015160b351d4d0b170a351d4d0c170a4a35800d170a8e4a9d0e170a351d4d0f170a351d4d10170a351d4d11170a351d4d12170a8e4a9d13170a4a358014170a351d4d0d1809351d4d0e1809602d800f1809602d801018094a3580111809602d80121809351d4d0c1908351d4d0d19086a3a860e19086a3a860f19086a3a861019084a35801119086a3a861219086a3a86131908351d4d0c1a07351d4d0d1a076a3a860e1a076a3a860f1a076a3a86101a074a3580111a076a3a86121a076a3a86131a07351d4d0c1b06351d4d0d1b068e4a9d0e1b066a3a860f1b066a3a86101b064a3580111b066a3a86121b068e4a9d131b06351d4d0d1c05351d4d0e1c05351d4d0f1c05351d4d101c05351d4d111c05351d4d121c05351d4d111d04351d4d121d04351d4d");
    const Web$Kaelin$Assets$hero$cyclope_d_1 = VoxBox$parse$("0e0a212c333d0f0a212c333d100a212c333d110a212c333d0d0b202c333d0e0b20fff9e10f0b20fff9e1100b20fff9e1110b20fff9e1120b202c333d0d0c1f2c333d0e0c1ffff9e10f0c1ffff9e1100c1ffff9e1110c1ffff9e1120c1f2c333d0c0d1e2729600d0d1e2729600e0d1efff9e10f0d1eccc8b7100d1eccc8b7110d1eccc8b7120d1e272960130d1e272960140d1e2729600c0e1d2729600d0e1d2729600e0e1dfff9e10f0e1dccc8b7100e1dccc8b7110e1dccc8b7120e1d272960130e1d272960140e1d272960050f1c272960060f1c272960070f1c272960090f1c2729600a0f1c2729600b0f1c2729600c0f1c5176b80d0f1cfff9e10e0f1cdfdbc80f0f1cdfdbc8100f1cdfdbc8110f1cdfdbc8120f1cccc8b7130f1c5176b8140f1c5176b8150f1c27296005101b27296006101b799cd307101b799cd308101b27296009101b5176b80a101b5176b80b101b5176b80c101b799cd30d101b5176b80e101bdfdbc80f101bccc8b710101bccc8b711101bccc8b712101b5176b813101b799cd314101b799cd315101b5176b816101b27296017101b27296018101b27296005111a27296006111a799cd307111a799cd308111a27296009111a5176b80a111a5176b80b111a5176b80c111a799cd30d111a5176b80e111adfdbc80f111accc8b710111accc8b711111accc8b712111a5176b813111a799cd314111a799cd315111a5176b816111a27296017111a27296018111a2729600512192729600612195176b80712195176b8081219394c87091219799cd30a1219799cd30b1219799cd30c12195176b80d12194a2b710e12194a2b710f12194a2b711012194a2b711112194a2b711212194a2b711312195176b81412195176b8151219799cd31612192729601712192729601812192729600513182729600613185176b80713185176b8081318394c87091318799cd30a1318799cd30b1318799cd30c13185176b80d13184a2b710e13184a2b710f13184a2b711013184a2b711113184a2b711213184a2b711313185176b81413185176b8151318799cd3161318272960171318272960181318272960051417272960061417272960071417272960081417394c870914175176b80a14175176b80b14175176b80c14174a2b710d1417dab04d0e1417dab04d0f1417dab04d101417dab04d111417dab04d121417dab04d1314174a2b711414174a2b711514175176b8161417394c87171417394c87181417394c871914172729601a1417272960051516272960061516799cd3071516799cd3081516394c870915165176b80a15165176b80b15165176b80c15164a2b710d1516dab04d0e1516fff9e10f1516fff9e1101516fff9e1111516fff9e1121516dab04d1315164a2b711415164a2b711515165176b8161516394c87171516394c87181516394c87191516799cd31a1516272960051615272960061615799cd3071615799cd3081615394c870916155176b80a16155176b80b16155176b80c16154a2b710d1615dab04d0e1615fff9e10f1615fff9e1101615fff9e1111615fff9e1121615dab04d1316154a2b711416154a2b711516155176b8161615394c87171615394c87181615394c87191615799cd31a1615272960051714272960061714272960071714272960081714394c870917145176b80a17145176b80b17145176b80c17144a2b710d1714dab04d0e17142421260f1714242126101714242126111714242126121714dab04d1317144a2b711417144a2b711517145176b8161714394c87171714394c87181714394c871917142729601a17145176b81b17142729600518132729600618135176b80718135176b8081813394c870918135176b80a18135176b80b18135176b80c18135176b80d18134a2b710e18134a2b710f18134a2b711018134a2b711118134a2b711218134a2b711318135176b81418135176b81518135176b8161813394c87171813394c87181813394c87191813799cd31a1813799cd31b18132729600519122729600619125176b80719125176b8081912394c870919125176b80a19125176b80b19125176b80c19125176b80d19124a2b710e19124a2b710f19124a2b711019124a2b711119124a2b711219124a2b711319125176b81419125176b81519125176b8161912394c87171912394c87181912394c87191912799cd31a1912799cd31b1912272960051a11272960061a115176b8071a115176b8081a11394c87091a115176b80a1a115176b80b1a115176b80c1a115176b80d1a114a2b710e1a114a2b710f1a114a2b71101a114a2b71111a114a2b71121a114a2b71131a115176b8141a115176b8151a115176b8161a11394c87171a11394c87181a11394c87191a11799cd31a1a11799cd31b1a11272960051b10272960061b10799cd3071b10799cd3081b105176b8091b10394c870a1b10394c870b1b10394c870c1b10dfdbc80d1b105176b80e1b105176b80f1b105176b8101b105176b8111b105176b8121b105176b8131b10dfdbc8141b10dfdbc8151b10394c87161b105176b8171b105176b8181b105176b8191b105176b81a1b10799cd31b1b10272960061c0f272960071c0f272960081c0f272960091c0f394c870a1c0f394c870b1c0f394c870c1c0fdfdbc80d1c0f4662a10e1c0f4662a10f1c0f4662a1101c0f4662a1111c0f4662a1121c0f4662a1131c0fdfdbc8141c0fdfdbc8151c0f394c87161c0f394c87171c0f394c87181c0f394c87191c0f5176b81a1c0f5176b81b1c0f272960081d0e272960091d0e5176b80a1d0e5176b80b1d0e5176b80c1d0e394c870d1d0e394c870e1d0e394c870f1d0e394c87101d0e394c87111d0e394c87121d0e394c87131d0e394c87141d0e394c87151d0e5176b8161d0e394c87171d0e394c87181d0e394c87191d0e5176b81a1d0e5176b81b1d0e272960081e0d272960091e0d5176b80a1e0d5176b80b1e0d5176b80c1e0d394c870d1e0d394c870e1e0d394c870f1e0d394c87101e0d394c87111e0d394c87121e0d394c87131e0d394c87141e0d394c87151e0d5176b8161e0d394c87171e0d394c87181e0d394c87191e0d5176b81a1e0d5176b81b1e0d272960081f0c272960091f0c5176b80a1f0c5176b80b1f0c5176b80c1f0c394c870d1f0c394c870e1f0c394c870f1f0c394c87101f0c394c87111f0c394c87121f0c394c87131f0c394c87141f0c394c87151f0c5176b8161f0c394c87171f0c394c87181f0c394c87191f0c5176b81a1f0c5176b81b1f0c27296008200b27296009200b5176b80a200b5176b80b200b5176b80c200b5176b80d200b5176b80e200b5176b80f200b5176b810200b5176b811200b5176b812200b5176b813200b5176b814200b5176b815200b394c8716200b799cd317200b799cd318200b799cd319200b5176b81a200b5176b81b200b27296008210a27296009210a8e4a9d0a210a8e4a9d0b210a8e4a9d0c210a8e4a9d0d210a5176b80e210a5176b80f210a5176b810210a5176b811210a5176b812210a5176b813210a394c8714210a394c8715210a394c8716210a799cd317210a799cd318210a799cd319210a799cd31a210a5176b81b210a2729600922092729600a22092729600b22092729600c22094a2b710d22098e4a9d0e22098e4a9d0f22098e4a9d1022098e4a9d1122098e4a9d1222098e4a9d132209394c87142209394c871522095176b8162209394c87172209394c87182209394c87192209394c871a22092729600923082729600a23082729600b23082729600c23084a2b710d23088e4a9d0e23088e4a9d0f23088e4a9d1023088e4a9d1123088e4a9d1223088e4a9d132308394c87142308394c871523085176b8162308394c87172308394c87182308394c87192308394c871a23082729600924072729600a24072729600b24072729600c24074a2b710d24078e4a9d0e24078e4a9d0f24078e4a9d1024078e4a9d1124078e4a9d1224078e4a9d132407394c87142407394c871524075176b8162407394c87172407394c87182407394c87192407394c871a24072729600925062729600a25062729600b25062729600c25065176b80d25064a2b710e25068e4a9d0f25068e4a9d1025068e4a9d1125068e4a9d1225064a2b71132506394c87142506394c87152506799cd3162506799cd3172506799cd3182506799cd31925065176b81a25062729600926052729600a26052729600b26052729600c2605799cd30d2605799cd30e26054a2b710f26054a2b711026054a2b711126054a2b711226052729601326052729601426052729601526052729601626052729601726052729601826052729601926052729600927042729600a27042729600b27042729600c27042729600d27042729600e2704272960");
    const Web$Kaelin$Assets$hero$lela_d_1 = VoxBox$parse$("091219fb4d4d0a1219fb4d4d0b1219fb4d4d0c1219fb4d4d131219fb4d4d141219fb4d4d151219fb4d4d161219fb4d4d081318fb4d4d0913182b496c0a13182b496c0b13182b496c0c13182b496c0d1318fb4d4d121318fb4d4d1313182b496c1413182b496c1513182b496c1613182b496c171318fb4d4d071417fb4d4d0814172b496c09141781aeff0a141781aeff0b141781aeff0c141781aeff0d14172b496c0e1417fb4d4d0f1417fb4d4d101417fb4d4d111417fb4d4d1214172b496c13141781aeff14141781aeff15141781aeff16141781aeff1714172b496c181417fb4d4d071516fb4d4d0815161f3b5b091516538ccf0a1516538ccf0b1516538ccf0c1516538ccf0d1516538ccf0e15162b496c0f15162b496c1015162b496c1115162b496c121516538ccf131516538ccf141516538ccf151516538ccf161516538ccf1715161f3b5b181516fb4d4d071615fb4d4d0816151f3b5b091615538ccf0a1615538ccf0b1615538ccf0c1615538ccf0d1615538ccf0e161581aeff0f161581aeff10161581aeff11161581aeff121615538ccf131615538ccf141615538ccf151615538ccf161615538ccf1716151f3b5b181615fb4d4d071714fb4d4d0817141f3b5b091714538ccf0a1714538ccf0b1714538ccf0c1714538ccf0d1714538ccf0e1714538ccf0f1714538ccf101714538ccf111714538ccf121714538ccf131714538ccf141714538ccf151714538ccf161714538ccf1717141f3b5b181714fb4d4d081813fb4d4d0918131f3b5b0a1813538ccf0b1813538ccf0c1813538ccf0d1813538ccf0e1813538ccf0f1813cb4646101813cb4646111813538ccf121813538ccf131813538ccf141813538ccf151813538ccf1618131f3b5b171813fb4d4d091912fb4d4d0a19121f3b5b0b1912538ccf0c1912538ccf0d1912538ccf0e1912538ccf0f1912ad1f1f101912ad1f1f111912538ccf121912538ccf131912538ccf141912538ccf1519121f3b5b161912fb4d4d091a11fb4d4d0a1a111f3b5b0b1a11538ccf0c1a11538ccf0d1a11cb46460e1a11538ccf0f1a11538ccf101a11538ccf111a11538ccf121a11cb4646131a11538ccf141a11538ccf151a111f3b5b161a11fb4d4d091b10fb4d4d0a1b101f3b5b0b1b10538ccf0c1b10538ccf0d1b10ad1f1f0e1b10538ccf0f1b103d5497101b103d5497111b10538ccf121b10ad1f1f131b10538ccf141b10538ccf151b101f3b5b161b10fb4d4d0a1c0ffb4d4d0b1c0f1f3b5b0c1c0f538ccf0d1c0f538ccf0e1c0f538ccf0f1c0f2d4382101c0f2d4382111c0f538ccf121c0f538ccf131c0f538ccf141c0f1f3b5b151c0ffb4d4d0b1d0efb4d4d0c1d0e1f3b5b0d1d0e3a67b70e1d0e538ccf0f1d0e203368101d0e203368111d0e538ccf121d0e3a67b7131d0e1f3b5b141d0efb4d4d0a1e0dfb4d4d0b1e0d1f3b5b0c1e0d538ccf0d1e0d538ccf0e1e0d3a67b70f1e0d3a67b7101e0d3a67b7111e0d3a67b7121e0d538ccf131e0d538ccf141e0d1f3b5b151e0dfb4d4d091f0cfb4d4d0a1f0c1f3b5b0b1f0c81aeff0c1f0c3a71b10d1f0c538ccf0e1f0c81aeff0f1f0c81aeff101f0c81aeff111f0c81aeff121f0c538ccf131f0c3a71b1141f0c81aeff151f0c1f3b5b161f0cfb4d4d08200bfb4d4d09200b1f3b5b0a200b538ccf0b200b538ccf0c200b3a71b10d200b538ccf0e200b538ccf0f200b538ccf10200b538ccf11200b538ccf12200b538ccf13200b3a71b114200b538ccf15200b538ccf16200b1f3b5b17200bfb4d4d08210afb4d4d09210a1f3b5b0a210a538ccf0b210a538ccf0c210a3a71b10d210a538ccf0e210a538ccf0f210a538ccf10210a538ccf11210a538ccf12210a538ccf13210a3a71b114210a538ccf15210a538ccf16210a1f3b5b17210afb4d4d082209fb4d4d0922091f3b5b0a2209538ccf0b2209538ccf0c22092753860d2209538ccf0e2209538ccf0f2209538ccf102209538ccf112209538ccf122209538ccf132209275386142209538ccf152209538ccf1622091f3b5b172209fb4d4d092308fb4d4d0a23081f3b5b0b23081f3b5b0c23081f3b5b0d23083a67b70e2308538ccf0f2308538ccf102308538ccf112308538ccf1223083a67b71323081f3b5b1423081f3b5b1523081f3b5b162308fb4d4d0a2407fb4d4d0b2407fb4d4d0c2407fb4d4d0d24071f3b5b0e24073a67b70f2407538ccf102407538ccf1124073a67b71224071f3b5b132407fb4d4d142407fb4d4d152407fb4d4d0d2506fb4d4d0e25061f3b5b0f25063a67b71025063a67b71125061f3b5b122506fb4d4d0e2605fb4d4d0f26051f3b5b1026051f3b5b112605fb4d4d0f2704fb4d4d102704fb4d4d");
    const Web$Kaelin$Assets$hero$octoking_d_1 = VoxBox$parse$("0a0a21192a020b0a21192a020d0a21192a020e0a21192a02100a21192a02110a21192a02120a21192a02130a21192a02150a21192a02160a21192a02180a21192a02190a21192a020a0b20192a020b0b20192a020d0b20192a020e0b20192a02100b20192a02110b20192a02120b20192a02130b20192a02150b20192a02160b20192a02180b20192a02190b20192a02080c1f192a02090c1f192a020a0c1fe6d7510b0c1fe6d7510c0c1f192a020d0c1f70681e0e0c1f70681e0f0c1f192a02100c1ffff6a6110c1ffff6a6120c1ffff6a6130c1ffff6a6140c1f192a02150c1f70681e160c1f70681e170c1f192a02180c1fe6d751190c1fe6d7511a0c1f192a021b0c1f192a02080d1e192a02090d1e192a020a0d1ee6d7510b0d1ee6d7510c0d1efff6a60d0d1e192a020e0d1e192a020f0d1ee6d751100d1ee6d751110d1ee6d751120d1ee6d751130d1ee6d751140d1ee6d751150d1e192a02160d1e192a02170d1efff6a6180d1ee6d751190d1ee6d7511a0d1e192a021b0d1e192a02080e1d192a02090e1d192a020a0e1de6d7510b0e1de6d7510c0e1dfff6a60d0e1d192a020e0e1d192a020f0e1de6d751100e1de6d751110e1de6d751120e1de6d751130e1de6d751140e1de6d751150e1d192a02160e1d192a02170e1dfff6a6180e1de6d751190e1de6d7511a0e1d192a021b0e1d192a02080f1c192a02090f1c192a020a0f1cc9ae530b0f1cc9ae530c0f1ce6d7510d0f1ce6d7510e0f1ce6d7510f0f1ce6d751100f1cb8321d110f1cb8321d120f1cb8321d130f1cb8321d140f1ce6d751150f1ce6d751160f1ce6d751170f1ce6d751180f1cc9ae53190f1cc9ae531a0f1c192a021b0f1c192a0208101b192a0209101b192a020a101bc9ae530b101bc9ae530c101be6d7510d101be6d7510e101be6d7510f101be6d75110101bb8321d11101bb8321d12101bb8321d13101bb8321d14101be6d75115101be6d75116101be6d75117101be6d75118101bc9ae5319101bc9ae531a101b192a021b101b192a0205111a192a0206111a192a0207111a192a0208111a192a0209111a192a020a111a4281350b111a4281350c111a4281350d111a4281350e111a4281350f111ac9ae5310111ac9ae5311111ac9ae5312111ac9ae5313111ac9ae5314111ac9ae5315111a42813516111a42813517111a42813518111a42813519111a4281351a111a192a021b111a192a021c111a192a021d111a192a021e111a192a02041219192a020512199fd95d0612199fd95d0712199fd95d081219192a02091219192a020a12199fd95d0b12199fd95d0c12195ea6420d12195ea6420e12195ea6420f12194281351012194281351112194281351212194281351312194281351412194281351512195ea6421612195ea6421712195ea6421812199fd95d1912199fd95d1a1219192a021b1219192a021c12199fd95d1d12199fd95d1e12199fd95d1f1219192a02041318192a020513189fd95d0613189fd95d0713189fd95d081318192a02091318192a020a13189fd95d0b13189fd95d0c13185ea6420d13185ea6420e13185ea6420f13184281351013184281351113184281351213184281351313184281351413184281351513185ea6421613185ea6421713185ea6421813189fd95d1913189fd95d1a1318192a021b1318192a021c13189fd95d1d13189fd95d1e13189fd95d1f1318192a02021417192a02031417192a020414179fd95d0514175ea6420614175ea6420714175ea642081417192a02091417192a020a14175ea6420b14175ea6420c14175ea6420d14175ea6420e14175ea6420f14175ea6421014175ea6421114175ea6421214175ea6421314175ea6421414175ea6421514175ea6421614175ea6421714175ea6421814175ea6421914175ea6421a1417192a021b1417192a021c14175ea6421d14175ea6421e14175ea6421f14179fd95d201417192a02211417192a02041516192a020515165ea6420615165ea6420715165ea642081516192a02091516192a020a15164281350b15164281350c15164281350d15164281350e15164281350f15164281351015165ea6421115165ea6421215165ea6421315165ea6421415164281351515164281351615164281351715164281351815164281351915164281351a1516192a021b1516192a021c15165ea6421d15165ea6421e15165ea6421f1516192a02041615192a020516155ea6420616155ea6420716155ea642081615192a02091615192a020a16154281350b16154281350c16154281350d16154281350e16154281350f16154281351016155ea6421116155ea6421216155ea6421316155ea6421416154281351516154281351616154281351716154281351816154281351916154281351a1615192a021b1615192a021c16155ea6421d16155ea6421e16155ea6421f1615192a02051714192a02061714192a020717145ea6420817145ea6420917145ea6420a1714192a020b1714192a020c17144281350d1714e6d7510e1714e6d7510f1714e6d751101714428135111714428135121714428135131714428135141714e6d751151714e6d751161714e6d751171714428135181714192a02191714192a021a17145ea6421b17145ea6421c17145ea6421d1714192a021e1714192a02071813192a020818135ea6420918135ea6420a1813366d2a0b1813366d2a0c1813192a020d18134281350e18134281350f1813173e0f101813173e0f111813173e0f121813173e0f131813173e0f141813173e0f151813428135161813428135171813192a02181813366d2a191813366d2a1a18135ea6421b18135ea6421c1813192a02071912192a020819125ea6420919125ea6420a1912366d2a0b1912366d2a0c1912192a020d19124281350e19124281350f1912173e0f101912173e0f111912173e0f121912173e0f131912173e0f141912173e0f151912428135161912428135171912192a02181912366d2a191912366d2a1a19125ea6421b19125ea6421c1912192a02051a11192a02061a11192a02071a11192a02081a11428135091a114281350a1a115ea6420b1a115ea6420c1a114281350d1a11192a020e1a11192a020f1a119fd95d101a119fd95d111a119fd95d121a119fd95d131a119fd95d141a119fd95d151a11192a02161a11192a02171a11428135181a115ea642191a115ea6421a1a114281351b1a114281351c1a11192a021d1a11192a021e1a11192a02051b10192a02061b10192a02071b10192a02081b10428135091b104281350a1b105ea6420b1b105ea6420c1b104281350d1b10192a020e1b10192a020f1b109fd95d101b109fd95d111b109fd95d121b109fd95d131b109fd95d141b109fd95d151b10192a02161b10192a02171b10428135181b105ea642191b105ea6421a1b104281351b1b104281351c1b10192a021d1b10192a021e1b10192a02041c0f192a02051c0f366d2a061c0f366d2a071c0f192a02081c0f5ea642091c0f5ea6420a1c0f4281350b1c0f4281350c1c0f192a020d1c0f9fd95d0e1c0f9fd95d0f1c0f5ea642101c0f428135111c0f428135121c0f428135131c0f428135141c0f5ea642151c0f9fd95d161c0f9fd95d171c0f192a02181c0f428135191c0f4281351a1c0f5ea6421b1c0f5ea6421c1c0f192a021d1c0f366d2a1e1c0f366d2a1f1c0f192a02021d0e192a02031d0e192a02041d0e428135051d0e428135061d0e428135071d0e192a02081d0e428135091d0e4281350a1d0e4281350b1d0e4281350c1d0e192a020d1d0e5ea6420e1d0e5ea6420f1d0e5ea642101d0e428135111d0e428135121d0e428135131d0e428135141d0e5ea642151d0e5ea642161d0e5ea642171d0e192a02181d0e428135191d0e4281351a1d0e4281351b1d0e4281351c1d0e192a021d1d0e4281351e1d0e4281351f1d0e428135201d0e192a02211d0e192a02021e0d192a02031e0d192a02041e0d428135051e0d428135061e0d428135071e0d192a02081e0d428135091e0d4281350a1e0d4281350b1e0d4281350c1e0d192a020d1e0d5ea6420e1e0d5ea6420f1e0d5ea642101e0d428135111e0d428135121e0d428135131e0d428135141e0d5ea642151e0d5ea642161e0d5ea642171e0d192a02181e0d428135191e0d4281351a1e0d4281351b1e0d4281351c1e0d192a021d1e0d4281351e1e0d4281351f1e0d428135201e0d192a02211e0d192a02001f0c192a02011f0c192a02021f0c9fd95d031f0c9fd95d041f0c5ea642051f0c428135061f0c428135071f0c192a02081f0c5ea642091f0c5ea6420a1f0c4281350b1f0c4281350c1f0c192a020d1f0c5ea6420e1f0c5ea6420f1f0c5ea642101f0c428135111f0c428135121f0c428135131f0c428135141f0c5ea642151f0c5ea642161f0c5ea642171f0c192a02181f0c428135191f0c4281351a1f0c5ea6421b1f0c5ea6421c1f0c192a021d1f0c4281351e1f0c4281351f1f0c5ea642201f0c9fd95d211f0c9fd95d221f0c192a0202200b192a0203200b192a0204200b192a0205200b42813506200b42813507200b42813508200b192a0209200b192a020a200b366d2a0b200b366d2a0c200b192a020d200b5ea6420e200b5ea6420f200b5ea64210200b42813511200b42813512200b42813513200b42813514200b5ea64215200b5ea64216200b5ea64217200b192a0218200b366d2a19200b366d2a1a200b192a021b200b192a021c200b4281351d200b4281351e200b4281351f200b192a0220200b192a0221200b192a0202210a192a0203210a192a0204210a192a0205210a42813506210a42813507210a42813508210a192a0209210a192a020a210a366d2a0b210a366d2a0c210a192a020d210a5ea6420e210a5ea6420f210a5ea64210210a42813511210a42813512210a42813513210a42813514210a5ea64215210a5ea64216210a5ea64217210a192a0218210a366d2a19210a366d2a1a210a192a021b210a192a021c210a4281351d210a4281351e210a4281351f210a192a0220210a192a0221210a192a02052209192a02062209192a02072209192a020a2209192a020b2209192a020c2209192a020d22095ea6420e22095ea6420f22094281351022094281351122094281351222094281351322094281351422094281351522095ea6421622095ea642172209192a02182209192a02192209192a021c2209192a021d2209192a021e2209192a02052308192a02062308192a02072308192a020a2308192a020b2308192a020c2308192a020d23085ea6420e23085ea6420f23084281351023084281351123084281351223084281351323084281351423084281351523085ea6421623085ea642172308192a02182308192a02192308192a021c2308192a021d2308192a021e2308192a02082407192a02092407192a020a2407192a020b2407192a020c24075ea6420d24074281350e24074281350f2407428135102407366d2a112407366d2a122407366d2a132407366d2a1424074281351524074281351624074281351724075ea642182407192a02192407192a021a2407192a021b2407192a02072506192a020825065ea6420925065ea6420a25065ea6420b25065ea6420c25064281350d25064281350e25064281350f2506366d2a102506192a02112506192a02122506192a02132506192a02142506366d2a1525064281351625064281351725064281351825065ea6421925065ea6421a25065ea6421b25065ea6421c2506192a02072605192a020826055ea6420926055ea6420a26055ea6420b26055ea6420c26054281350d26054281350e26054281350f2605366d2a102605192a02112605192a02122605192a02132605192a02142605366d2a1526054281351626054281351726054281351826055ea6421926055ea6421a26055ea6421b26055ea6421c2605192a02082704192a02092704192a020a2704192a020b2704192a020c2704192a020d2704192a020e2704192a020f2704192a02142704192a02152704192a02162704192a02172704192a02182704192a02192704192a021a2704192a021b2704192a02");

    function Web$Kaelin$Entity$background$(_img$1) {
        var $311 = ({
            _: 'Web.Kaelin.Entity.background',
            'img': _img$1
        });
        return $311;
    };
    const Web$Kaelin$Entity$background = x0 => Web$Kaelin$Entity$background$(x0);
    const Web$Kaelin$Assets$tile$dark_grass_4 = VoxBox$parse$("0e00010600000f00010600001000010600000c01010600000d01010600000e0101408d640f0101408d64100101469e651101010600001201010600000a02010600000b02010600000c0201469e650d0201469e650e0201469e650f0201408d64100201469e65110201469e65120201408d641302010600001402010600000803010600000903010600000a0301469e650b0301408d640c0301469e650d0301469e650e0301469e650f0301408d64100301408d64110301408d64120301408d64130301469e65140301469e65150301060000160301060000060401060000070401060000080401469e65090401469e650a0401469e650b0401408d640c0401408d640d0401469e650e0401469e650f0401408d64100401469e65110401408d64120401408d64130401408d64140401408d64150401408d64160401408d64170401060000180401060000040501060000050501060000060501469e65070501408d64080501469e65090501469e650a0501408d640b0501408d640c0501408d640d0501347e570e0501347e570f0501469e65100501469e65110501469e65120501347e57130501408d64140501469e65150501469e65160501408d64170501469e65180501469e651905010600001a0501060000020601060000030601060000040601347e57050601469e65060601469e65070601408d64080601408d64090601347e570a0601408d640b0601408d640c0601408d640d0601408d640e0601347e570f0601469e65100601469e65110601408d64120601347e57130601347e57140601469e65150601469e65160601408d64170601408d64180601347e57190601408d641a0601408d641b06010600001c0601060000000701060000010701060000020701408d64030701408d64040701408d64050701408d64060701408d64070701408d64080701408d64090701347e570a0701347e570b0701408d640c0701469e650d0701469e650e0701408d640f0701408d64100701408d64110701408d64120701408d64130701408d64140701408d64150701408d64160701408d64170701408d64180701347e57190701347e571a0701408d641b0701469e651c0701469e651d07010600001e0701060000000801060000010801347e57020801469e65030801469e65040801408d64050801408d64060801469e65070801469e65080801408d64090801469e650a0801469e650b0801408d640c0801469e650d0801469e650e0801469e650f0801347e57100801347e57110801469e65120801469e65130801408d64140801408d64150801469e65160801469e65170801408d64180801469e65190801469e651a0801408d641b0801469e651c0801469e651d0801469e651e0801060000000901060000010901408d64020901469e65030901469e65040901408d64050901469e65060901469e65070901469e65080901408d64090901469e650a0901469e650b0901408d640c0901408d640d0901469e650e0901469e650f0901347e57100901408d64110901469e65120901469e65130901408d64140901469e65150901469e65160901469e65170901408d64180901469e65190901469e651a0901408d641b0901408d641c0901469e651d0901469e651e0901060000000a01060000010a01408d64020a01408d64030a01408d64040a01408d64050a01469e65060a01469e65070a01408d64080a01408d64090a01408d640a0a01408d640b0a01408d640c0a01408d640d0a01408d640e0a01408d640f0a01408d64100a01408d64110a01408d64120a01408d64130a01408d64140a01469e65150a01469e65160a01408d64170a01408d64180a01408d64190a01408d641a0a01408d641b0a01408d641c0a01408d641d0a01408d641e0a01060000000b01060000010b01408d64020b01408d64030b01408d64040b01408d64050b01408d64060b01408d64070b01469e65080b01469e65090b01408d640a0b01347e570b0b01347e570c0b01408d640d0b01408d640e0b01408d640f0b01469e65100b01408d64110b01408d64120b01408d64130b01408d64140b01408d64150b01408d64160b01469e65170b01469e65180b01408d64190b01347e571a0b01347e571b0b01408d641c0b01408d641d0b01408d641e0b01060000000c01060000010c01408d64020c01408d64030c01469e65040c01469e65050c01408d64060c01469e65070c01469e65080c01469e65090c01408d640a0c01347e570b0c01408d640c0c01469e650d0c01469e650e0c01408d640f0c01469e65100c01408d64110c01408d64120c01469e65130c01469e65140c01408d64150c01469e65160c01469e65170c01469e65180c01408d64190c01347e571a0c01408d641b0c01469e651c0c01469e651d0c01408d641e0c01060000000d01060000010d01408d64020d01469e65030d01469e65040d01469e65050d01408d64060d01469e65070d01469e65080d01408d64090d01408d640a0d01408d640b0d01408d640c0d01469e650d0d01469e650e0d01469e650f0d01408d64100d01408d64110d01469e65120d01469e65130d01469e65140d01408d64150d01469e65160d01469e65170d01408d64180d01408d64190d01408d641a0d01408d641b0d01469e651c0d01469e651d0d01469e651e0d01060000000e01060000010e01408d64020e01469e65030e01469e65040e01408d64050e01408d64060e01408d64070e01408d64080e01408d64090e01408d640a0e01408d640b0e01408d640c0e01408d640d0e01469e650e0e01469e650f0e01408d64100e01408d64110e01469e65120e01469e65130e01408d64140e01408d64150e01408d64160e01408d64170e01408d64180e01408d64190e01408d641a0e01408d641b0e01408d641c0e01469e651d0e01469e651e0e01060000000f01060000010f01408d64020f01469e65030f01469e65040f01408d64050f01347e57060f01408d64070f01469e65080f01469e65090f01469e650a0f01408d640b0f01469e650c0f01469e650d0f01408d640e0f01408d640f0f01469e65100f01408d64110f01469e65120f01469e65130f01408d64140f01347e57150f01408d64160f01469e65170f01469e65180f01469e65190f01408d641a0f01469e651b0f01469e651c0f01408d641d0f01408d641e0f01060000001001060000011001469e65021001469e65031001469e65041001408d64051001408d64061001408d64071001469e65081001469e65091001408d640a1001408d640b1001408d640c1001408d640d1001408d640e1001408d640f1001408d64101001469e65111001469e65121001469e65131001408d64141001408d64151001408d64161001469e65171001469e65181001408d64191001408d641a1001408d641b1001408d641c1001408d641d1001408d641e1001060000001101060000011101469e65021101469e65031101408d64041101469e65051101469e65061101408d64071101408d64081101408d64091101408d640a1101408d640b1101408d640c1101469e650d1101469e650e1101469e650f1101408d64101101469e65111101469e65121101408d64131101469e65141101469e65151101408d64161101408d64171101408d64181101408d64191101408d641a1101408d641b1101469e651c1101469e651d1101469e651e1101060000001201060000011201408d64021201408d64031201408d64041201469e65051201469e65061201408d64071201408d64081201408d64091201469e650a1201469e650b1201408d640c1201469e650d1201469e650e1201469e650f1201408d64101201408d64111201408d64121201408d64131201469e65141201469e65151201408d64161201408d64171201408d64181201469e65191201469e651a1201408d641b1201469e651c1201469e651d1201469e651e1201060000001301060000011301469e65021301408d64031301408d64041301408d64051301408d64061301408d64071301408d64081301469e65091301469e650a1301469e650b1301408d640c1301408d640d1301469e650e1301469e650f1301408d64101301469e65111301408d64121301408d64131301408d64141301408d64151301408d64161301408d64171301469e65181301469e65191301469e651a1301408d641b1301408d641c1301469e651d1301469e651e1301060000001401060000011401469e65021401469e65031401347e57041401408d64051401469e65061401469e65071401408d64081401469e65091401469e650a1401408d640b1401408d640c1401408d640d1401347e570e1401347e570f1401469e65101401469e65111401469e65121401347e57131401408d64141401469e65151401469e65161401408d64171401469e65181401469e65191401408d641a1401408d641b1401408d641c1401347e571d1401347e571e1401060000001501060000011501469e65021501408d64031501347e57041501347e57051501469e65061501469e65071501408d64081501408d64091501347e570a1501408d640b1501408d640c1501408d640d1501408d640e1501347e570f1501469e65101501469e65111501408d64121501347e57131501347e57141501469e65151501469e65161501408d64171501408d64181501347e57191501408d641a1501408d641b1501408d641c1501408d641d1501347e571e1501060000001601060000011601060000021601408d64031601408d64041601408d64051601408d64061601408d64071601408d64081601408d64091601347e570a1601347e570b1601408d640c1601469e650d1601469e650e1601408d640f1601408d64101601408d64111601408d64121601408d64131601408d64141601408d64151601408d64161601408d64171601408d64181601347e57191601347e571a1601408d641b1601469e651c1601469e651d16010600001e1601060000021701060000031701060000041701408d64051701408d64061701469e65071701469e65081701408d64091701469e650a1701469e650b1701408d640c1701469e650d1701469e650e1701469e650f1701347e57101701347e57111701469e65121701469e65131701408d64141701408d64151701469e65161701469e65171701408d64181701469e65191701469e651a1701408d641b17010600001c1701060000041801060000051801060000061801469e65071801469e65081801408d64091801469e650a1801469e650b1801408d640c1801408d640d1801469e650e1801469e650f1801347e57101801408d64111801469e65121801469e65131801408d64141801469e65151801469e65161801469e65171801408d64181801469e651918010600001a1801060000061901060000071901060000081901408d64091901408d640a1901408d640b1901408d640c1901408d640d1901408d640e1901408d640f1901408d64101901408d64111901408d64121901408d64131901408d64141901469e65151901469e65161901408d64171901060000181901060000081a01060000091a010600000a1a01347e570b1a01347e570c1a01408d640d1a01408d640e1a01408d640f1a01469e65101a01408d64111a01408d64121a01408d64131a01408d64141a01408d64151a01060000161a010600000a1b010600000b1b010600000c1b01469e650d1b01469e650e1b01408d640f1b01469e65101b01408d64111b01408d64121b01469e65131b01060000141b010600000c1c010600000d1c010600000e1c01469e650f1c01408d64101c01408d64111c01060000121c010600000e1d010600000f1d01060000101d01060000");

    function Web$Kaelin$Coord$new$(_i$1, _j$2) {
        var $312 = ({
            _: 'Web.Kaelin.Coord.new',
            'i': _i$1,
            'j': _j$2
        });
        return $312;
    };
    const Web$Kaelin$Coord$new = x0 => x1 => Web$Kaelin$Coord$new$(x0, x1);

    function String$cons$(_head$1, _tail$2) {
        var $313 = (String.fromCharCode(_head$1) + _tail$2);
        return $313;
    };
    const String$cons = x0 => x1 => String$cons$(x0, x1);
    const String$concat = a0 => a1 => (a0 + a1);
    const Nat$gtn = a0 => a1 => (a0 > a1);

    function Int$is_neg$(_a$1) {
        var self = _a$1;
        switch ("new") {
            case 'new':
                var $315 = int_pos(self);
                var $316 = int_neg(self);
                var $317 = ($316 > $315);
                var $314 = $317;
                break;
        };
        return $314;
    };
    const Int$is_neg = x0 => Int$is_neg$(x0);
    const Int$new = a0 => a1 => (a0 - a1);

    function Int$neg$(_a$1) {
        var self = _a$1;
        switch ("new") {
            case 'new':
                var $319 = int_pos(self);
                var $320 = int_neg(self);
                var $321 = ($320 - $319);
                var $318 = $321;
                break;
        };
        return $318;
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
                    var $324 = int_pos(self);
                    var $325 = $324;
                    var $323 = $325;
                    break;
            };
            var $322 = $323;
        } else {
            var self = _a$1;
            switch ("new") {
                case 'new':
                    var $327 = int_pos(self);
                    var $328 = $327;
                    var $326 = $328;
                    break;
            };
            var $322 = $326;
        };
        return $322;
    };
    const Int$abs = x0 => Int$abs$(x0);

    function Int$to_nat_signed$(_a$1) {
        var $329 = Pair$new$(Int$is_neg$(_a$1), Int$abs$(_a$1));
        return $329;
    };
    const Int$to_nat_signed = x0 => Int$to_nat_signed$(x0);

    function List$fold$(_list$2, _nil$4, _cons$5) {
        var self = _list$2;
        switch (self._) {
            case 'List.cons':
                var $331 = self.head;
                var $332 = self.tail;
                var $333 = _cons$5($331)(List$fold$($332, _nil$4, _cons$5));
                var $330 = $333;
                break;
            case 'List.nil':
                var $334 = _nil$4;
                var $330 = $334;
                break;
        };
        return $330;
    };
    const List$fold = x0 => x1 => x2 => List$fold$(x0, x1, x2);

    function Either$(_A$1, _B$2) {
        var $335 = null;
        return $335;
    };
    const Either = x0 => x1 => Either$(x0, x1);

    function Either$left$(_value$3) {
        var $336 = ({
            _: 'Either.left',
            'value': _value$3
        });
        return $336;
    };
    const Either$left = x0 => Either$left$(x0);

    function Either$right$(_value$3) {
        var $337 = ({
            _: 'Either.right',
            'value': _value$3
        });
        return $337;
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
                    var $338 = Either$left$(_n$1);
                    return $338;
                } else {
                    var $339 = (self - 1n);
                    var self = _n$1;
                    if (self === 0n) {
                        var $341 = Either$right$(Nat$succ$($339));
                        var $340 = $341;
                    } else {
                        var $342 = (self - 1n);
                        var $343 = Nat$sub_rem$($342, $339);
                        var $340 = $343;
                    };
                    return $340;
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
                        var $344 = self.value;
                        var $345 = Nat$div_mod$go$($344, _m$2, Nat$succ$(_d$3));
                        return $345;
                    case 'Either.right':
                        var $346 = Pair$new$(_d$3, _n$1);
                        return $346;
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

    function List$(_A$1) {
        var $347 = null;
        return $347;
    };
    const List = x0 => List$(x0);

    function List$cons$(_head$2, _tail$3) {
        var $348 = ({
            _: 'List.cons',
            'head': _head$2,
            'tail': _tail$3
        });
        return $348;
    };
    const List$cons = x0 => x1 => List$cons$(x0, x1);

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
                        var $349 = self.fst;
                        var $350 = self.snd;
                        var self = $349;
                        if (self === 0n) {
                            var $352 = List$cons$($350, _res$3);
                            var $351 = $352;
                        } else {
                            var $353 = (self - 1n);
                            var $354 = Nat$to_base$go$(_base$1, $349, List$cons$($350, _res$3));
                            var $351 = $354;
                        };
                        return $351;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Nat$to_base$go = x0 => x1 => x2 => Nat$to_base$go$(x0, x1, x2);
    const List$nil = ({
        _: 'List.nil'
    });

    function Nat$to_base$(_base$1, _nat$2) {
        var $355 = Nat$to_base$go$(_base$1, _nat$2, List$nil);
        return $355;
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
                    var $356 = Nat$mod$go$(_n$1, _r$3, _m$2);
                    return $356;
                } else {
                    var $357 = (self - 1n);
                    var self = _n$1;
                    if (self === 0n) {
                        var $359 = _r$3;
                        var $358 = $359;
                    } else {
                        var $360 = (self - 1n);
                        var $361 = Nat$mod$go$($360, $357, Nat$succ$(_r$3));
                        var $358 = $361;
                    };
                    return $358;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Nat$mod$go = x0 => x1 => x2 => Nat$mod$go$(x0, x1, x2);
    const Nat$mod = a0 => a1 => (a0 % a1);
    const Bool$and = a0 => a1 => (a0 && a1);
    const Nat$lte = a0 => a1 => (a0 <= a1);

    function Maybe$(_A$1) {
        var $362 = null;
        return $362;
    };
    const Maybe = x0 => Maybe$(x0);
    const Maybe$none = ({
        _: 'Maybe.none'
    });

    function Maybe$some$(_value$2) {
        var $363 = ({
            _: 'Maybe.some',
            'value': _value$2
        });
        return $363;
    };
    const Maybe$some = x0 => Maybe$some$(x0);

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
                        var $364 = self.head;
                        var $365 = self.tail;
                        var self = _index$2;
                        if (self === 0n) {
                            var $367 = Maybe$some$($364);
                            var $366 = $367;
                        } else {
                            var $368 = (self - 1n);
                            var $369 = List$at$($368, $365);
                            var $366 = $369;
                        };
                        return $366;
                    case 'List.nil':
                        var $370 = Maybe$none;
                        return $370;
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
                    var $373 = self.value;
                    var $374 = $373;
                    var $372 = $374;
                    break;
                case 'Maybe.none':
                    var $375 = 35;
                    var $372 = $375;
                    break;
            };
            var $371 = $372;
        } else {
            var $376 = 35;
            var $371 = $376;
        };
        return $371;
    };
    const Nat$show_digit = x0 => x1 => Nat$show_digit$(x0, x1);

    function Nat$to_string_base$(_base$1, _nat$2) {
        var $377 = List$fold$(Nat$to_base$(_base$1, _nat$2), String$nil, (_n$3 => _str$4 => {
            var $378 = String$cons$(Nat$show_digit$(_base$1, _n$3), _str$4);
            return $378;
        }));
        return $377;
    };
    const Nat$to_string_base = x0 => x1 => Nat$to_string_base$(x0, x1);

    function Nat$show$(_n$1) {
        var $379 = Nat$to_string_base$(10n, _n$1);
        return $379;
    };
    const Nat$show = x0 => Nat$show$(x0);

    function Int$show$(_a$1) {
        var _result$2 = Int$to_nat_signed$(_a$1);
        var self = _result$2;
        switch (self._) {
            case 'Pair.new':
                var $381 = self.fst;
                var $382 = self.snd;
                var self = $381;
                if (self) {
                    var $384 = ("-" + Nat$show$($382));
                    var $383 = $384;
                } else {
                    var $385 = ("+" + Nat$show$($382));
                    var $383 = $385;
                };
                var $380 = $383;
                break;
        };
        return $380;
    };
    const Int$show = x0 => Int$show$(x0);

    function Web$Kaelin$Coord$show$(_coord$1) {
        var self = _coord$1;
        switch (self._) {
            case 'Web.Kaelin.Coord.new':
                var $387 = self.i;
                var $388 = self.j;
                var $389 = (Int$show$($387) + (":" + Int$show$($388)));
                var $386 = $389;
                break;
        };
        return $386;
    };
    const Web$Kaelin$Coord$show = x0 => Web$Kaelin$Coord$show$(x0);

    function BitsMap$(_A$1) {
        var $390 = null;
        return $390;
    };
    const BitsMap = x0 => BitsMap$(x0);

    function BitsMap$tie$(_val$2, _lft$3, _rgt$4) {
        var $391 = ({
            _: 'BitsMap.tie',
            'val': _val$2,
            'lft': _lft$3,
            'rgt': _rgt$4
        });
        return $391;
    };
    const BitsMap$tie = x0 => x1 => x2 => BitsMap$tie$(x0, x1, x2);
    const BitsMap$new = ({
        _: 'BitsMap.new'
    });

    function BitsMap$set$(_bits$2, _val$3, _map$4) {
        var self = _bits$2;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'o':
                var $393 = self.slice(0, -1);
                var self = _map$4;
                switch (self._) {
                    case 'BitsMap.tie':
                        var $395 = self.val;
                        var $396 = self.lft;
                        var $397 = self.rgt;
                        var $398 = BitsMap$tie$($395, BitsMap$set$($393, _val$3, $396), $397);
                        var $394 = $398;
                        break;
                    case 'BitsMap.new':
                        var $399 = BitsMap$tie$(Maybe$none, BitsMap$set$($393, _val$3, BitsMap$new), BitsMap$new);
                        var $394 = $399;
                        break;
                };
                var $392 = $394;
                break;
            case 'i':
                var $400 = self.slice(0, -1);
                var self = _map$4;
                switch (self._) {
                    case 'BitsMap.tie':
                        var $402 = self.val;
                        var $403 = self.lft;
                        var $404 = self.rgt;
                        var $405 = BitsMap$tie$($402, $403, BitsMap$set$($400, _val$3, $404));
                        var $401 = $405;
                        break;
                    case 'BitsMap.new':
                        var $406 = BitsMap$tie$(Maybe$none, BitsMap$new, BitsMap$set$($400, _val$3, BitsMap$new));
                        var $401 = $406;
                        break;
                };
                var $392 = $401;
                break;
            case 'e':
                var self = _map$4;
                switch (self._) {
                    case 'BitsMap.tie':
                        var $408 = self.lft;
                        var $409 = self.rgt;
                        var $410 = BitsMap$tie$(Maybe$some$(_val$3), $408, $409);
                        var $407 = $410;
                        break;
                    case 'BitsMap.new':
                        var $411 = BitsMap$tie$(Maybe$some$(_val$3), BitsMap$new, BitsMap$new);
                        var $407 = $411;
                        break;
                };
                var $392 = $407;
                break;
        };
        return $392;
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
                var $413 = self.pred;
                var $414 = (Word$to_bits$($413) + '0');
                var $412 = $414;
                break;
            case 'Word.i':
                var $415 = self.pred;
                var $416 = (Word$to_bits$($415) + '1');
                var $412 = $416;
                break;
            case 'Word.e':
                var $417 = Bits$e;
                var $412 = $417;
                break;
        };
        return $412;
    };
    const Word$to_bits = x0 => Word$to_bits$(x0);
    const U16$to_bits = a0 => (u16_to_bits(a0));

    function String$to_bits$(_str$1) {
        var self = _str$1;
        if (self.length === 0) {
            var $419 = Bits$e;
            var $418 = $419;
        } else {
            var $420 = self.charCodeAt(0);
            var $421 = self.slice(1);
            var $422 = (String$to_bits$($421) + (u16_to_bits($420)));
            var $418 = $422;
        };
        return $418;
    };
    const String$to_bits = x0 => String$to_bits$(x0);

    function Map$set$(_key$2, _val$3, _map$4) {
        var $423 = BitsMap$set$(String$to_bits$(_key$2), _val$3, _map$4);
        return $423;
    };
    const Map$set = x0 => x1 => x2 => Map$set$(x0, x1, x2);

    function Maybe$default$(_m$2, _a$3) {
        var self = _m$2;
        switch (self._) {
            case 'Maybe.some':
                var $425 = self.value;
                var $426 = $425;
                var $424 = $426;
                break;
            case 'Maybe.none':
                var $427 = _a$3;
                var $424 = $427;
                break;
        };
        return $424;
    };
    const Maybe$default = x0 => x1 => Maybe$default$(x0, x1);

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
                        var $428 = self.slice(0, -1);
                        var self = _map$3;
                        switch (self._) {
                            case 'BitsMap.tie':
                                var $430 = self.lft;
                                var $431 = BitsMap$get$($428, $430);
                                var $429 = $431;
                                break;
                            case 'BitsMap.new':
                                var $432 = Maybe$none;
                                var $429 = $432;
                                break;
                        };
                        return $429;
                    case 'i':
                        var $433 = self.slice(0, -1);
                        var self = _map$3;
                        switch (self._) {
                            case 'BitsMap.tie':
                                var $435 = self.rgt;
                                var $436 = BitsMap$get$($433, $435);
                                var $434 = $436;
                                break;
                            case 'BitsMap.new':
                                var $437 = Maybe$none;
                                var $434 = $437;
                                break;
                        };
                        return $434;
                    case 'e':
                        var self = _map$3;
                        switch (self._) {
                            case 'BitsMap.tie':
                                var $439 = self.val;
                                var $440 = $439;
                                var $438 = $440;
                                break;
                            case 'BitsMap.new':
                                var $441 = Maybe$none;
                                var $438 = $441;
                                break;
                        };
                        return $438;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const BitsMap$get = x0 => x1 => BitsMap$get$(x0, x1);

    function Map$get$(_key$2, _map$3) {
        var $442 = BitsMap$get$(String$to_bits$(_key$2), _map$3);
        return $442;
    };
    const Map$get = x0 => x1 => Map$get$(x0, x1);

    function Web$Kaelin$Map$push$(_coord$1, _ent$2, _map$3) {
        var _key$4 = Web$Kaelin$Coord$show$(_coord$1);
        var $443 = Map$set$(_key$4, List$cons$(_ent$2, Maybe$default$(Map$get$(_key$4, _map$3), List$nil)), _map$3);
        return $443;
    };
    const Web$Kaelin$Map$push = x0 => x1 => x2 => Web$Kaelin$Map$push$(x0, x1, x2);

    function Web$Kaelin$Draw$initial_ent$(_map$1) {
        var _ent_croni$2 = Web$Kaelin$Entity$hero$(Web$Kaelin$Assets$hero$croni0_d_1);
        var _ent_cyclope$3 = Web$Kaelin$Entity$hero$(Web$Kaelin$Assets$hero$cyclope_d_1);
        var _ent_lela$4 = Web$Kaelin$Entity$hero$(Web$Kaelin$Assets$hero$lela_d_1);
        var _ent_octoking$5 = Web$Kaelin$Entity$hero$(Web$Kaelin$Assets$hero$octoking_d_1);
        var _ent_grass$6 = Web$Kaelin$Entity$background$(Web$Kaelin$Assets$tile$dark_grass_4);
        var _new_coord$7 = Web$Kaelin$Coord$new;
        var _map$8 = Web$Kaelin$Map$push$(_new_coord$7((0n - 0n))((0n - 0n)), _ent_grass$6, _map$1);
        var _map$9 = Web$Kaelin$Map$push$(_new_coord$7((0n - 0n))((0n - 0n)), _ent_cyclope$3, _map$8);
        var _map$10 = Web$Kaelin$Map$push$(_new_coord$7((0n - 1n))((0n - 2n)), _ent_croni$2, _map$9);
        var _map$11 = Web$Kaelin$Map$push$(_new_coord$7((3n - 0n))((2n - 0n)), _ent_lela$4, _map$10);
        var _map$12 = Web$Kaelin$Map$push$(_new_coord$7((0n - 3n))((5n - 0n)), _ent_octoking$5, _map$11);
        var $444 = _map$12;
        return $444;
    };
    const Web$Kaelin$Draw$initial_ent = x0 => Web$Kaelin$Draw$initial_ent$(x0);

    function Map$(_V$1) {
        var $445 = null;
        return $445;
    };
    const Map = x0 => Map$(x0);

    function Map$from_list$(_xs$2) {
        var self = _xs$2;
        switch (self._) {
            case 'List.cons':
                var $447 = self.head;
                var $448 = self.tail;
                var self = $447;
                switch (self._) {
                    case 'Pair.new':
                        var $450 = self.fst;
                        var $451 = self.snd;
                        var $452 = BitsMap$set$(String$to_bits$($450), $451, Map$from_list$($448));
                        var $449 = $452;
                        break;
                };
                var $446 = $449;
                break;
            case 'List.nil':
                var $453 = BitsMap$new;
                var $446 = $453;
                break;
        };
        return $446;
    };
    const Map$from_list = x0 => Map$from_list$(x0);

    function Web$Kaelin$State$game$(_room$1, _tick$2, _players$3, _cast_info$4, _map$5, _interface$6) {
        var $454 = ({
            _: 'Web.Kaelin.State.game',
            'room': _room$1,
            'tick': _tick$2,
            'players': _players$3,
            'cast_info': _cast_info$4,
            'map': _map$5,
            'interface': _interface$6
        });
        return $454;
    };
    const Web$Kaelin$State$game = x0 => x1 => x2 => x3 => x4 => x5 => Web$Kaelin$State$game$(x0, x1, x2, x3, x4, x5);
    const Web$Kaelin$Constants$room = "0x196581625485";

    function App$EnvInfo$new$(_screen_size$1, _mouse_pos$2) {
        var $455 = ({
            _: 'App.EnvInfo.new',
            'screen_size': _screen_size$1,
            'mouse_pos': _mouse_pos$2
        });
        return $455;
    };
    const App$EnvInfo$new = x0 => x1 => App$EnvInfo$new$(x0, x1);

    function DOM$text$(_value$1) {
        var $456 = ({
            _: 'DOM.text',
            'value': _value$1
        });
        return $456;
    };
    const DOM$text = x0 => DOM$text$(x0);

    function VoxBox$clear$(_img$1) {
        var $457 = VoxBox$set_length$(0, _img$1);
        return $457;
    };
    const VoxBox$clear = x0 => VoxBox$clear$(x0);
    const Web$Kaelin$Constants$map_size = 5;
    const Web$Kaelin$Constants$hexagon_radius = 15;
    const Nat$add = a0 => a1 => (a0 + a1);
    const Int$add = a0 => a1 => (a0 + a1);
    const Int$sub = a0 => a1 => (a0 - a1);

    function Word$fold$(_nil$3, _w0$4, _w1$5, _word$6) {
        var self = _word$6;
        switch (self._) {
            case 'Word.o':
                var $459 = self.pred;
                var $460 = _w0$4(Word$fold$(_nil$3, _w0$4, _w1$5, $459));
                var $458 = $460;
                break;
            case 'Word.i':
                var $461 = self.pred;
                var $462 = _w1$5(Word$fold$(_nil$3, _w0$4, _w1$5, $461));
                var $458 = $462;
                break;
            case 'Word.e':
                var $463 = _nil$3;
                var $458 = $463;
                break;
        };
        return $458;
    };
    const Word$fold = x0 => x1 => x2 => x3 => Word$fold$(x0, x1, x2, x3);
    const Nat$mul = a0 => a1 => (a0 * a1);

    function Word$to_nat$(_word$2) {
        var $464 = Word$fold$(0n, a1 => (2n * a1), (_x$4 => {
            var $465 = Nat$succ$((2n * _x$4));
            return $465;
        }), _word$2);
        return $464;
    };
    const Word$to_nat = x0 => Word$to_nat$(x0);
    const U32$to_nat = a0 => (BigInt(a0));

    function Cmp$as_lte$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
            case 'Cmp.eql':
                var $467 = Bool$true;
                var $466 = $467;
                break;
            case 'Cmp.gtn':
                var $468 = Bool$false;
                var $466 = $468;
                break;
        };
        return $466;
    };
    const Cmp$as_lte = x0 => Cmp$as_lte$(x0);

    function Word$lte$(_a$2, _b$3) {
        var $469 = Cmp$as_lte$(Word$cmp$(_a$2, _b$3));
        return $469;
    };
    const Word$lte = x0 => x1 => Word$lte$(x0, x1);
    const U32$lte = a0 => a1 => (a0 <= a1);

    function Web$Kaelin$Coord$fit$(_coord$1, _map_size$2) {
        var self = _coord$1;
        switch (self._) {
            case 'Web.Kaelin.Coord.new':
                var $471 = self.i;
                var $472 = self.j;
                var _i$5 = $471;
                var _j$6 = $472;
                var _sum$7 = (_i$5 + _j$6);
                var _abs$8 = Int$abs$(_sum$7);
                var _abs$9 = (Number(_abs$8) >>> 0);
                var $473 = (_abs$9 <= _map_size$2);
                var $470 = $473;
                break;
        };
        return $470;
    };
    const Web$Kaelin$Coord$fit = x0 => x1 => Web$Kaelin$Coord$fit$(x0, x1);

    function Web$Kaelin$Map$background$(_coord$1, _map$2) {
        var _ent_grass$3 = Web$Kaelin$Entity$background$(Web$Kaelin$Assets$tile$dark_grass_4);
        var _map$4 = Web$Kaelin$Map$push$(_coord$1, _ent_grass$3, _map$2);
        var $474 = _map$4;
        return $474;
    };
    const Web$Kaelin$Map$background = x0 => x1 => Web$Kaelin$Map$background$(x0, x1);

    function Int$from_u32$(_n$1) {
        var $475 = ((BigInt(_n$1)) - 0n);
        return $475;
    };
    const Int$from_u32 = x0 => Int$from_u32$(x0);

    function Pair$fst$(_pair$3) {
        var self = _pair$3;
        switch (self._) {
            case 'Pair.new':
                var $477 = self.fst;
                var $478 = $477;
                var $476 = $478;
                break;
        };
        return $476;
    };
    const Pair$fst = x0 => Pair$fst$(x0);
    const Nat$div = a0 => a1 => (a0 / a1);

    function Int$div_nat$(_a$1, _n$2) {
        var self = _a$1;
        switch ("new") {
            case 'new':
                var $480 = int_pos(self);
                var $481 = int_neg(self);
                var $482 = (($480 / _n$2) - ($481 / _n$2));
                var $479 = $482;
                break;
        };
        return $479;
    };
    const Int$div_nat = x0 => x1 => Int$div_nat$(x0, x1);
    const Web$Kaelin$Constants$center_x = 128;
    const Web$Kaelin$Constants$center_y = 128;
    const Int$mul = a0 => a1 => (a0 * a1);

    function Int$from_nat$(_n$1) {
        var $483 = (_n$1 - 0n);
        return $483;
    };
    const Int$from_nat = x0 => Int$from_nat$(x0);

    function Int$to_u32$(_a$1) {
        var self = _a$1;
        switch ("new") {
            case 'new':
                var $485 = int_pos(self);
                var $486 = int_neg(self);
                var self = $486;
                if (self === 0n) {
                    var $488 = Pair$new$(Bool$false, (Number($485) >>> 0));
                    var $487 = $488;
                } else {
                    var $489 = (self - 1n);
                    var $490 = Pair$new$(Bool$true, (Number($486) >>> 0));
                    var $487 = $490;
                };
                var $484 = $487;
                break;
        };
        return $484;
    };
    const Int$to_u32 = x0 => Int$to_u32$(x0);

    function Web$Kaelin$Coord$to_screen_xy$(_coord$1) {
        var self = _coord$1;
        switch (self._) {
            case 'Web.Kaelin.Coord.new':
                var $492 = self.i;
                var $493 = self.j;
                var _i$4 = $492;
                var _j$5 = $493;
                var _int_rad$6 = Int$from_u32$(Web$Kaelin$Constants$hexagon_radius);
                var _hlf$7 = Int$div_nat$(_int_rad$6, 2n);
                var _int_screen_center_x$8 = Int$from_u32$(Web$Kaelin$Constants$center_x);
                var _int_screen_center_y$9 = Int$from_u32$(Web$Kaelin$Constants$center_y);
                var _cx$10 = (_int_screen_center_x$8 + (_j$5 * _int_rad$6));
                var _cx$11 = (_cx$10 + (_i$4 * (_int_rad$6 * Int$from_nat$(2n))));
                var _cy$12 = (_int_screen_center_y$9 + (_j$5 * (_hlf$7 * Int$from_nat$(3n))));
                var self = Int$to_u32$(_cx$11);
                switch (self._) {
                    case 'Pair.new':
                        var $495 = self.snd;
                        var self = Int$to_u32$(_cy$12);
                        switch (self._) {
                            case 'Pair.new':
                                var $497 = self.snd;
                                var $498 = Pair$new$($495, $497);
                                var $496 = $498;
                                break;
                        };
                        var $494 = $496;
                        break;
                };
                var $491 = $494;
                break;
        };
        return $491;
    };
    const Web$Kaelin$Coord$to_screen_xy = x0 => Web$Kaelin$Coord$to_screen_xy$(x0);
    const U32$sub = a0 => a1 => ((a0 - a1) >>> 0);

    function VoxBox$Draw$deresagon$(_cx$1, _cy$2, _cz$3, _rad$4, _col$5, _draw_a$6, _draw_b$7, _draw_c$8, _draw_d$9, _draw_e$10, _draw_f$11, _img$12) {
        var _hlf$13 = ((_rad$4 / 2) >>> 0);
        var _v0x$14 = ((_cx$1 + _rad$4) >>> 0);
        var _v0y$15 = ((_cy$2 + _hlf$13) >>> 0);
        var _v1x$16 = ((_cx$1 + _rad$4) >>> 0);
        var _v1y$17 = ((_cy$2 - _hlf$13) >>> 0);
        var _v2x$18 = _cx$1;
        var _v2y$19 = ((_cy$2 - _rad$4) >>> 0);
        var _v3x$20 = ((_cx$1 - _rad$4) >>> 0);
        var _v3y$21 = ((_cy$2 - _hlf$13) >>> 0);
        var _v4x$22 = ((_cx$1 - _rad$4) >>> 0);
        var _v4y$23 = ((_cy$2 + _hlf$13) >>> 0);
        var _v5x$24 = _cx$1;
        var _v5y$25 = ((_cy$2 + _rad$4) >>> 0);
        var self = _draw_a$6;
        if (self) {
            var _img$26 = (() => {
                var $501 = _img$12;
                var $502 = 0;
                var $503 = _rad$4;
                let _img$27 = $501;
                for (let _i$26 = $502; _i$26 < $503; ++_i$26) {
                    var _px$28 = _v1x$16;
                    var _py$29 = ((_v1y$17 + _i$26) >>> 0);
                    var $501 = ((_img$27.buffer[_img$27.length * 2] = ((0 | _px$28 | (_py$29 << 12) | (_cz$3 << 24))), _img$27.buffer[_img$27.length * 2 + 1] = _col$5, _img$27.length++, _img$27));
                    _img$27 = $501;
                };
                return _img$27;
            })();
            var $500 = _img$26;
            var _img$26 = $500;
        } else {
            var $504 = _img$12;
            var _img$26 = $504;
        };
        var self = _draw_d$9;
        if (self) {
            var _img$27 = (() => {
                var $506 = _img$26;
                var $507 = 0;
                var $508 = _rad$4;
                let _img$28 = $506;
                for (let _i$27 = $507; _i$27 < $508; ++_i$27) {
                    var _px$29 = _v3x$20;
                    var _py$30 = ((_v3y$21 + _i$27) >>> 0);
                    var $506 = ((_img$28.buffer[_img$28.length * 2] = ((0 | _px$29 | (_py$30 << 12) | (_cz$3 << 24))), _img$28.buffer[_img$28.length * 2 + 1] = _col$5, _img$28.length++, _img$28));
                    _img$28 = $506;
                };
                return _img$28;
            })();
            var $505 = _img$27;
            var _img$27 = $505;
        } else {
            var $509 = _img$26;
            var _img$27 = $509;
        };
        var self = _draw_b$7;
        if (self) {
            var _img$28 = (() => {
                var $511 = _img$27;
                var $512 = 0;
                var $513 = _rad$4;
                let _img$29 = $511;
                for (let _i$28 = $512; _i$28 < $513; ++_i$28) {
                    var _px$30 = ((_v2x$18 + _i$28) >>> 0);
                    var _py$31 = ((_v2y$19 + ((_i$28 / 2) >>> 0)) >>> 0);
                    var $511 = ((_img$29.buffer[_img$29.length * 2] = ((0 | _px$30 | (_py$31 << 12) | (_cz$3 << 24))), _img$29.buffer[_img$29.length * 2 + 1] = _col$5, _img$29.length++, _img$29));
                    _img$29 = $511;
                };
                return _img$29;
            })();
            var $510 = _img$28;
            var _img$28 = $510;
        } else {
            var $514 = _img$27;
            var _img$28 = $514;
        };
        var self = _draw_c$8;
        if (self) {
            var _img$29 = (() => {
                var $516 = _img$28;
                var $517 = 0;
                var $518 = _rad$4;
                let _img$30 = $516;
                for (let _i$29 = $517; _i$29 < $518; ++_i$29) {
                    var _px$31 = ((_v2x$18 - _i$29) >>> 0);
                    var _py$32 = ((_v2y$19 + ((_i$29 / 2) >>> 0)) >>> 0);
                    var $516 = ((_img$30.buffer[_img$30.length * 2] = ((0 | _px$31 | (_py$32 << 12) | (_cz$3 << 24))), _img$30.buffer[_img$30.length * 2 + 1] = _col$5, _img$30.length++, _img$30));
                    _img$30 = $516;
                };
                return _img$30;
            })();
            var $515 = _img$29;
            var _img$29 = $515;
        } else {
            var $519 = _img$28;
            var _img$29 = $519;
        };
        var self = _draw_f$11;
        if (self) {
            var _img$30 = (() => {
                var $521 = _img$29;
                var $522 = 0;
                var $523 = _rad$4;
                let _img$31 = $521;
                for (let _i$30 = $522; _i$30 < $523; ++_i$30) {
                    var _px$32 = ((((_v0x$14 - _i$30) >>> 0) - 1) >>> 0);
                    var _py$33 = ((_v0y$15 + ((_i$30 / 2) >>> 0)) >>> 0);
                    var $521 = ((_img$31.buffer[_img$31.length * 2] = ((0 | _px$32 | (_py$33 << 12) | (_cz$3 << 24))), _img$31.buffer[_img$31.length * 2 + 1] = _col$5, _img$31.length++, _img$31));
                    _img$31 = $521;
                };
                return _img$31;
            })();
            var $520 = _img$30;
            var _img$30 = $520;
        } else {
            var $524 = _img$29;
            var _img$30 = $524;
        };
        var self = _draw_e$10;
        if (self) {
            var _img$31 = (() => {
                var $526 = _img$30;
                var $527 = 0;
                var $528 = _rad$4;
                let _img$32 = $526;
                for (let _i$31 = $527; _i$31 < $528; ++_i$31) {
                    var _px$33 = ((((_v4x$22 + _i$31) >>> 0) + 1) >>> 0);
                    var _py$34 = ((_v4y$23 + ((_i$31 / 2) >>> 0)) >>> 0);
                    var $526 = ((_img$32.buffer[_img$32.length * 2] = ((0 | _px$33 | (_py$34 << 12) | (_cz$3 << 24))), _img$32.buffer[_img$32.length * 2 + 1] = _col$5, _img$32.length++, _img$32));
                    _img$32 = $526;
                };
                return _img$32;
            })();
            var $525 = _img$31;
            var _img$31 = $525;
        } else {
            var $529 = _img$30;
            var _img$31 = $529;
        };
        var $499 = _img$31;
        return $499;
    };
    const VoxBox$Draw$deresagon = x0 => x1 => x2 => x3 => x4 => x5 => x6 => x7 => x8 => x9 => x10 => x11 => VoxBox$Draw$deresagon$(x0, x1, x2, x3, x4, x5, x6, x7, x8, x9, x10, x11);

    function Web$Kaelin$Draw$hexagon_border$(_cx$1, _cy$2, _rad$3, _col$4, _img$5) {
        var _img$6 = VoxBox$Draw$deresagon$(_cx$1, _cy$2, 0, _rad$3, _col$4, Bool$true, Bool$true, Bool$true, Bool$true, Bool$true, Bool$true, _img$5);
        var $530 = _img$6;
        return $530;
    };
    const Web$Kaelin$Draw$hexagon_border = x0 => x1 => x2 => x3 => x4 => Web$Kaelin$Draw$hexagon_border$(x0, x1, x2, x3, x4);

    function Web$Kaelin$Draw$tile$empty$(_coord$1, _map$2, _img$3) {
        var $531 = _img$3;
        return $531;
    };
    const Web$Kaelin$Draw$tile$empty = x0 => x1 => x2 => Web$Kaelin$Draw$tile$empty$(x0, x1, x2);

    function Web$Kaelin$Map$get$(_coord$1, _map$2) {
        var $532 = Maybe$default$(Map$get$(Web$Kaelin$Coord$show$(_coord$1), _map$2), List$nil);
        return $532;
    };
    const Web$Kaelin$Map$get = x0 => x1 => Web$Kaelin$Map$get$(x0, x1);
    const List$for = a0 => a1 => a2 => (list_for(a0)(a1)(a2));

    function VoxBox$get_len$(_img$1) {
        var self = _img$1;
        switch (self._) {
            case 'VoxBox.new':
                var $534 = self.length;
                var $535 = $534;
                var $533 = $535;
                break;
        };
        return $533;
    };
    const VoxBox$get_len = x0 => VoxBox$get_len$(x0);

    function Array$get$(_idx$3, _arr$4) {
        var $536 = Word$foldl$(Array$extract_tip, (_rec$6 => _arr$7 => {
            var _arr_l$8 = Array$extract_tie$(_arr$7);
            var self = _arr_l$8;
            switch (self._) {
                case 'Pair.new':
                    var $538 = self.fst;
                    var $539 = _rec$6($538);
                    var $537 = $539;
                    break;
            };
            return $537;
        }), (_rec$6 => _arr$7 => {
            var _arr_r$8 = Array$extract_tie$(_arr$7);
            var self = _arr_r$8;
            switch (self._) {
                case 'Pair.new':
                    var $541 = self.snd;
                    var $542 = _rec$6($541);
                    var $540 = $542;
                    break;
            };
            return $540;
        }), _idx$3)(_arr$4);
        return $536;
    };
    const Array$get = x0 => x1 => Array$get$(x0, x1);
    const Buffer32$get = a0 => a1 => ((a1[a0]));
    const VoxBox$get_pos = a0 => a1 => ((a1.buffer[a0 * 2]));
    const VoxBox$get_col = a0 => a1 => ((a1.buffer[a0 * 2 + 1]));

    function Word$and$(_a$2, _b$3) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $544 = self.pred;
                var $545 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $547 = self.pred;
                            var $548 = (_a$pred$9 => {
                                var $549 = Word$o$(Word$and$(_a$pred$9, $547));
                                return $549;
                            });
                            var $546 = $548;
                            break;
                        case 'Word.i':
                            var $550 = self.pred;
                            var $551 = (_a$pred$9 => {
                                var $552 = Word$o$(Word$and$(_a$pred$9, $550));
                                return $552;
                            });
                            var $546 = $551;
                            break;
                        case 'Word.e':
                            var $553 = (_a$pred$7 => {
                                var $554 = Word$e;
                                return $554;
                            });
                            var $546 = $553;
                            break;
                    };
                    var $546 = $546($544);
                    return $546;
                });
                var $543 = $545;
                break;
            case 'Word.i':
                var $555 = self.pred;
                var $556 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $558 = self.pred;
                            var $559 = (_a$pred$9 => {
                                var $560 = Word$o$(Word$and$(_a$pred$9, $558));
                                return $560;
                            });
                            var $557 = $559;
                            break;
                        case 'Word.i':
                            var $561 = self.pred;
                            var $562 = (_a$pred$9 => {
                                var $563 = Word$i$(Word$and$(_a$pred$9, $561));
                                return $563;
                            });
                            var $557 = $562;
                            break;
                        case 'Word.e':
                            var $564 = (_a$pred$7 => {
                                var $565 = Word$e;
                                return $565;
                            });
                            var $557 = $564;
                            break;
                    };
                    var $557 = $557($555);
                    return $557;
                });
                var $543 = $556;
                break;
            case 'Word.e':
                var $566 = (_b$4 => {
                    var $567 = Word$e;
                    return $567;
                });
                var $543 = $566;
                break;
        };
        var $543 = $543(_b$3);
        return $543;
    };
    const Word$and = x0 => x1 => Word$and$(x0, x1);
    const U32$and = a0 => a1 => (a0 & a1);
    const U32$shr = a0 => a1 => (a0 >>> a1);

    function VoxBox$Draw$image$(_x$1, _y$2, _z$3, _src$4, _img$5) {
        var _len$6 = VoxBox$get_len$(_src$4);
        var _img$7 = (() => {
            var $569 = _img$5;
            var $570 = 0;
            var $571 = _len$6;
            let _img$8 = $569;
            for (let _i$7 = $570; _i$7 < $571; ++_i$7) {
                var _pos$9 = ((_src$4.buffer[_i$7 * 2]));
                var _col$10 = ((_src$4.buffer[_i$7 * 2 + 1]));
                var _p_x$11 = (_pos$9 & 4095);
                var _p_y$12 = ((_pos$9 & 16773120) >>> 12);
                var _p_z$13 = ((_pos$9 & 4278190080) >>> 24);
                var _p_x$14 = ((_p_x$11 + _x$1) >>> 0);
                var _p_y$15 = ((_p_y$12 + _y$2) >>> 0);
                var _p_z$16 = ((_p_z$13 + _z$3) >>> 0);
                var _pos$17 = ((0 | _p_x$14 | (_p_y$15 << 12) | (_p_z$16 << 24)));
                var $569 = ((_img$8.buffer[_img$8.length * 2] = _pos$17, _img$8.buffer[_img$8.length * 2 + 1] = _col$10, _img$8.length++, _img$8));
                _img$8 = $569;
            };
            return _img$8;
        })();
        var $568 = _img$7;
        return $568;
    };
    const VoxBox$Draw$image = x0 => x1 => x2 => x3 => x4 => VoxBox$Draw$image$(x0, x1, x2, x3, x4);

    function Web$Kaelin$Draw$tile$(_coord$1, _map$2, _img$3) {
        var self = _coord$1;
        switch (self._) {
            case 'Web.Kaelin.Coord.new':
                var self = Web$Kaelin$Coord$to_screen_xy$(_coord$1);
                switch (self._) {
                    case 'Pair.new':
                        var $574 = self.fst;
                        var $575 = self.snd;
                        var _tile$8 = Web$Kaelin$Map$get$(_coord$1, _map$2);
                        var _img$9 = (() => {
                            var $578 = _img$3;
                            var $579 = _tile$8;
                            let _img$10 = $578;
                            let _ent$9;
                            while ($579._ === 'List.cons') {
                                _ent$9 = $579.head;
                                var _cx$11 = (($574 - Web$Kaelin$Constants$hexagon_radius) >>> 0);
                                var self = _ent$9;
                                switch (self._) {
                                    case 'Web.Kaelin.Entity.background':
                                        var $580 = self.img;
                                        var _cy$13 = (($575 - Web$Kaelin$Constants$hexagon_radius) >>> 0);
                                        var $581 = VoxBox$Draw$image$(_cx$11, _cy$13, 0, $580, _img$10);
                                        var $578 = $581;
                                        break;
                                    case 'Web.Kaelin.Entity.hero':
                                        var $582 = self.img;
                                        var _aux_y$13 = ((Web$Kaelin$Constants$hexagon_radius * 2) >>> 0);
                                        var _cy$14 = (($575 - _aux_y$13) >>> 0);
                                        var $583 = VoxBox$Draw$image$(_cx$11, _cy$14, 0, $582, _img$10);
                                        var $578 = $583;
                                        break;
                                };
                                _img$10 = $578;
                                $579 = $579.tail;
                            }
                            return _img$10;
                        })();
                        var $576 = _img$9;
                        var $573 = $576;
                        break;
                };
                var $572 = $573;
                break;
        };
        return $572;
    };
    const Web$Kaelin$Draw$tile = x0 => x1 => x2 => Web$Kaelin$Draw$tile$(x0, x1, x2);

    function Web$Kaelin$Draw$map$(_img$1, _map$2) {
        var _img$3 = VoxBox$clear$(_img$1);
        var _col$4 = ((0 | 0 | (0 << 8) | (255 << 16) | (255 << 24)));
        var _map_size$5 = Web$Kaelin$Constants$map_size;
        var _width$6 = ((((_map_size$5 * 2) >>> 0) + 1) >>> 0);
        var _height$7 = ((((_map_size$5 * 2) >>> 0) + 1) >>> 0);
        var _hex_rad$8 = Web$Kaelin$Constants$hexagon_radius;
        var _img$9 = (() => {
            var $585 = _img$3;
            var $586 = 0;
            var $587 = _height$7;
            let _img$10 = $585;
            for (let _j$9 = $586; _j$9 < $587; ++_j$9) {
                var _img$11 = (() => {
                    var $588 = _img$10;
                    var $589 = 0;
                    var $590 = _width$6;
                    let _img$12 = $588;
                    for (let _i$11 = $589; _i$11 < $590; ++_i$11) {
                        var _coord_i$13 = ((0n - (BigInt(_i$11))) - (0n - (BigInt(_map_size$5))));
                        var _coord_j$14 = ((0n - (BigInt(_j$9))) - (0n - (BigInt(_map_size$5))));
                        var _coord$15 = Web$Kaelin$Coord$new$(_coord_i$13, _coord_j$14);
                        var _fit$16 = Web$Kaelin$Coord$fit$(_coord$15, _map_size$5);
                        var self = _fit$16;
                        if (self) {
                            var _map$17 = Web$Kaelin$Map$background$(_coord$15, _map$2);
                            var self = Web$Kaelin$Coord$to_screen_xy$(_coord$15);
                            switch (self._) {
                                case 'Pair.new':
                                    var $592 = self.fst;
                                    var $593 = self.snd;
                                    var _img$20 = Web$Kaelin$Draw$hexagon_border$($592, $593, _hex_rad$8, _col$4, _img$12);
                                    var _img$21 = Web$Kaelin$Draw$tile$empty$(_coord$15, _map$17, _img$20);
                                    var _img$22 = Web$Kaelin$Draw$tile$(_coord$15, _map$17, _img$21);
                                    var $594 = _img$22;
                                    var $591 = $594;
                                    break;
                            };
                            var $588 = $591;
                        } else {
                            var $595 = _img$12;
                            var $588 = $595;
                        };
                        _img$12 = $588;
                    };
                    return _img$12;
                })();
                var $585 = _img$11;
                _img$10 = $585;
            };
            return _img$10;
        })();
        var $584 = _img$9;
        return $584;
    };
    const Web$Kaelin$Draw$map = x0 => x1 => Web$Kaelin$Draw$map$(x0, x1);

    function BitsMap$values$go$(_xs$2, _list$3) {
        var self = _xs$2;
        switch (self._) {
            case 'BitsMap.tie':
                var $597 = self.val;
                var $598 = self.lft;
                var $599 = self.rgt;
                var self = $597;
                switch (self._) {
                    case 'Maybe.some':
                        var $601 = self.value;
                        var $602 = List$cons$($601, _list$3);
                        var _list0$7 = $602;
                        break;
                    case 'Maybe.none':
                        var $603 = _list$3;
                        var _list0$7 = $603;
                        break;
                };
                var _list1$8 = BitsMap$values$go$($598, _list0$7);
                var _list2$9 = BitsMap$values$go$($599, _list1$8);
                var $600 = _list2$9;
                var $596 = $600;
                break;
            case 'BitsMap.new':
                var $604 = _list$3;
                var $596 = $604;
                break;
        };
        return $596;
    };
    const BitsMap$values$go = x0 => x1 => BitsMap$values$go$(x0, x1);

    function Map$values$(_xs$2) {
        var $605 = BitsMap$values$go$(_xs$2, List$nil);
        return $605;
    };
    const Map$values = x0 => Map$values$(x0);

    function Web$Kaelin$Draw$hero$(_cx$1, _cy$2, _z$3, _hero$4, _img$5) {
        var self = _hero$4;
        switch (self._) {
            case 'Web.Kaelin.Hero.new':
                var $607 = self.ent;
                var self = $607;
                switch (self._) {
                    case 'Web.Kaelin.Entity.background':
                        var $609 = self.img;
                        var _aux_y$9 = ((Web$Kaelin$Constants$hexagon_radius * 2) >>> 0);
                        var _cy$10 = ((_cy$2 - _aux_y$9) >>> 0);
                        var _cx$11 = ((_cx$1 - Web$Kaelin$Constants$hexagon_radius) >>> 0);
                        var $610 = VoxBox$Draw$image$(_cx$11, _cy$10, 0, $609, _img$5);
                        var $608 = $610;
                        break;
                    case 'Web.Kaelin.Entity.hero':
                        var $611 = self.img;
                        var _aux_y$9 = ((Web$Kaelin$Constants$hexagon_radius * 2) >>> 0);
                        var _cy$10 = ((_cy$2 - _aux_y$9) >>> 0);
                        var _cx$11 = ((_cx$1 - Web$Kaelin$Constants$hexagon_radius) >>> 0);
                        var $612 = VoxBox$Draw$image$(_cx$11, _cy$10, 0, $611, _img$5);
                        var $608 = $612;
                        break;
                };
                var $606 = $608;
                break;
        };
        return $606;
    };
    const Web$Kaelin$Draw$hero = x0 => x1 => x2 => x3 => x4 => Web$Kaelin$Draw$hero$(x0, x1, x2, x3, x4);

    function Web$Kaelin$Draw$state$player$(_img$1, _player$2) {
        var self = _player$2;
        switch (self._) {
            case 'Web.Kaelin.Player.new':
                var $614 = self.coord;
                var $615 = self.hero;
                var self = Web$Kaelin$Coord$to_screen_xy$($614);
                switch (self._) {
                    case 'Pair.new':
                        var $617 = self.fst;
                        var $618 = self.snd;
                        var $619 = Web$Kaelin$Draw$hero$($617, $618, 0, $615, _img$1);
                        var $616 = $619;
                        break;
                };
                var $613 = $616;
                break;
        };
        return $613;
    };
    const Web$Kaelin$Draw$state$player = x0 => x1 => Web$Kaelin$Draw$state$player$(x0, x1);

    function Web$Kaelin$Draw$state$players$(_img$1, _players$2) {
        var _players_list$3 = Map$values$(_players$2);
        var _img$4 = (() => {
            var $622 = _img$1;
            var $623 = _players_list$3;
            let _img$5 = $622;
            let _player$4;
            while ($623._ === 'List.cons') {
                _player$4 = $623.head;
                var $622 = Web$Kaelin$Draw$state$player$(_img$5, _player$4);
                _img$5 = $622;
                $623 = $623.tail;
            }
            return _img$5;
        })();
        var $620 = _img$4;
        return $620;
    };
    const Web$Kaelin$Draw$state$players = x0 => x1 => Web$Kaelin$Draw$state$players$(x0, x1);

    function Web$Kaelin$Draw$state$(_img$1, _state$2) {
        var self = _state$2;
        switch (self._) {
            case 'Web.Kaelin.State.game':
                var $625 = self.players;
                var _new_img$9 = Web$Kaelin$Draw$state$players$(_img$1, $625);
                var $626 = _new_img$9;
                var $624 = $626;
                break;
            case 'Web.Kaelin.State.init':
            case 'Web.Kaelin.State.void':
                var $627 = _img$1;
                var $624 = $627;
                break;
        };
        return $624;
    };
    const Web$Kaelin$Draw$state = x0 => x1 => Web$Kaelin$Draw$state$(x0, x1);

    function DOM$vbox$(_props$1, _style$2, _value$3) {
        var $628 = ({
            _: 'DOM.vbox',
            'props': _props$1,
            'style': _style$2,
            'value': _value$3
        });
        return $628;
    };
    const DOM$vbox = x0 => x1 => x2 => DOM$vbox$(x0, x1, x2);

    function IO$(_A$1) {
        var $629 = null;
        return $629;
    };
    const IO = x0 => IO$(x0);

    function IO$ask$(_query$2, _param$3, _then$4) {
        var $630 = ({
            _: 'IO.ask',
            'query': _query$2,
            'param': _param$3,
            'then': _then$4
        });
        return $630;
    };
    const IO$ask = x0 => x1 => x2 => IO$ask$(x0, x1, x2);

    function IO$bind$(_a$3, _f$4) {
        var self = _a$3;
        switch (self._) {
            case 'IO.end':
                var $632 = self.value;
                var $633 = _f$4($632);
                var $631 = $633;
                break;
            case 'IO.ask':
                var $634 = self.query;
                var $635 = self.param;
                var $636 = self.then;
                var $637 = IO$ask$($634, $635, (_x$8 => {
                    var $638 = IO$bind$($636(_x$8), _f$4);
                    return $638;
                }));
                var $631 = $637;
                break;
        };
        return $631;
    };
    const IO$bind = x0 => x1 => IO$bind$(x0, x1);

    function IO$end$(_value$2) {
        var $639 = ({
            _: 'IO.end',
            'value': _value$2
        });
        return $639;
    };
    const IO$end = x0 => IO$end$(x0);

    function IO$monad$(_new$2) {
        var $640 = _new$2(IO$bind)(IO$end);
        return $640;
    };
    const IO$monad = x0 => IO$monad$(x0);

    function Dynamic$new$(_value$2) {
        var $641 = ({
            _: 'Dynamic.new',
            'value': _value$2
        });
        return $641;
    };
    const Dynamic$new = x0 => Dynamic$new$(x0);
    const App$pass = IO$monad$((_m$bind$1 => _m$pure$2 => {
        var $642 = _m$pure$2;
        return $642;
    }))(Dynamic$new$(Unit$new));

    function IO$put_string$(_text$1) {
        var $643 = IO$ask$("put_string", _text$1, (_skip$2 => {
            var $644 = IO$end$(Unit$new);
            return $644;
        }));
        return $643;
    };
    const IO$put_string = x0 => IO$put_string$(x0);

    function IO$print$(_text$1) {
        var $645 = IO$put_string$((_text$1 + "\u{a}"));
        return $645;
    };
    const IO$print = x0 => IO$print$(x0);

    function App$print$(_str$1) {
        var $646 = IO$monad$((_m$bind$2 => _m$pure$3 => {
            var $647 = _m$bind$2;
            return $647;
        }))(IO$print$(_str$1))((_$2 => {
            var $648 = App$pass;
            return $648;
        }));
        return $646;
    };
    const App$print = x0 => App$print$(x0);

    function IO$do$(_call$1, _param$2) {
        var $649 = IO$ask$(_call$1, _param$2, (_answer$3 => {
            var $650 = IO$end$(Unit$new);
            return $650;
        }));
        return $649;
    };
    const IO$do = x0 => x1 => IO$do$(x0, x1);

    function App$do$(_call$1, _param$2) {
        var $651 = IO$monad$((_m$bind$3 => _m$pure$4 => {
            var $652 = _m$bind$3;
            return $652;
        }))(IO$do$(_call$1, _param$2))((_$3 => {
            var $653 = App$pass;
            return $653;
        }));
        return $651;
    };
    const App$do = x0 => x1 => App$do$(x0, x1);

    function App$watch$(_room$1) {
        var $654 = App$do$("watch", _room$1);
        return $654;
    };
    const App$watch = x0 => App$watch$(x0);

    function App$store$(_value$2) {
        var $655 = IO$monad$((_m$bind$3 => _m$pure$4 => {
            var $656 = _m$pure$4;
            return $656;
        }))(Dynamic$new$(_value$2));
        return $655;
    };
    const App$store = x0 => App$store$(x0);

    function Web$Kaelin$Action$update_interface$(_interface$1, _state$2) {
        var self = _state$2;
        switch (self._) {
            case 'Web.Kaelin.State.game':
                var $658 = self.room;
                var $659 = self.tick;
                var $660 = self.players;
                var $661 = self.cast_info;
                var $662 = self.map;
                var $663 = Web$Kaelin$State$game$($658, $659, $660, $661, $662, _interface$1);
                var $657 = $663;
                break;
            case 'Web.Kaelin.State.init':
            case 'Web.Kaelin.State.void':
                var $664 = _state$2;
                var $657 = $664;
                break;
        };
        return $657;
    };
    const Web$Kaelin$Action$update_interface = x0 => x1 => Web$Kaelin$Action$update_interface$(x0, x1);

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
    const F64$to_i32 = a0 => ((a0 >> 0));
    const F64$div = a0 => a1 => (a0 / a1);
    const F64$parse = a0 => (parseFloat(a0));
    const F64$sub = a0 => a1 => (a0 - a1);
    const F64$mul = a0 => a1 => (a0 * a1);
    const F64$add = a0 => a1 => (a0 + a1);

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

    function Web$Kaelin$Coord$round$floor$(_n$1) {
        var $665 = (((_n$1 >> 0)));
        return $665;
    };
    const Web$Kaelin$Coord$round$floor = x0 => Web$Kaelin$Coord$round$floor$(x0);

    function Web$Kaelin$Coord$round$round_F64$(_n$1) {
        var _half$2 = (parseFloat("0.5"));
        var _big_number$3 = (parseFloat("1000.0"));
        var _n$4 = (_n$1 + _big_number$3);
        var _result$5 = Web$Kaelin$Coord$round$floor$((_n$4 + _half$2));
        var $666 = (_result$5 - _big_number$3);
        return $666;
    };
    const Web$Kaelin$Coord$round$round_F64 = x0 => Web$Kaelin$Coord$round$round_F64$(x0);

    function Cmp$as_gtn$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
            case 'Cmp.eql':
                var $668 = Bool$false;
                var $667 = $668;
                break;
            case 'Cmp.gtn':
                var $669 = Bool$true;
                var $667 = $669;
                break;
        };
        return $667;
    };
    const Cmp$as_gtn = x0 => Cmp$as_gtn$(x0);

    function Word$gtn$(_a$2, _b$3) {
        var $670 = Cmp$as_gtn$(Word$cmp$(_a$2, _b$3));
        return $670;
    };
    const Word$gtn = x0 => x1 => Word$gtn$(x0, x1);

    function F64$gtn$(_a$1, _b$2) {
        var self = _a$1;
        switch ('f64') {
            case 'f64':
                var $672 = f64_to_word(self);
                var self = _b$2;
                switch ('f64') {
                    case 'f64':
                        var $674 = f64_to_word(self);
                        var $675 = Word$gtn$($672, $674);
                        var $673 = $675;
                        break;
                };
                var $671 = $673;
                break;
        };
        return $671;
    };
    const F64$gtn = x0 => x1 => F64$gtn$(x0, x1);

    function Web$Kaelin$Coord$round$diff$(_x$1, _y$2) {
        var _big_number$3 = (parseFloat("1000.0"));
        var _x$4 = (_x$1 + _big_number$3);
        var _y$5 = (_y$2 + _big_number$3);
        var self = F64$gtn$(_x$4, _y$5);
        if (self) {
            var $677 = (_x$4 - _y$5);
            var $676 = $677;
        } else {
            var $678 = (_y$5 - _x$4);
            var $676 = $678;
        };
        return $676;
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
                var $681 = Pair$new$(_i$4(_round_x$6), _i$4(_new_y$12));
                var $680 = $681;
            } else {
                var _new_x$12 = ((_f$3(0) - _round_y$7) - _round_z$8);
                var $682 = Pair$new$(_i$4(_new_x$12), _i$4(_round_y$7));
                var $680 = $682;
            };
            var _result$12 = $680;
        } else {
            var self = F64$gtn$(_diff_y$10, _diff_z$11);
            if (self) {
                var _new_y$12 = ((_f$3(0) - _round_x$6) - _round_z$8);
                var $684 = Pair$new$(_i$4(_round_x$6), _i$4(_new_y$12));
                var $683 = $684;
            } else {
                var $685 = Pair$new$(_i$4(_round_x$6), _i$4(_round_y$7));
                var $683 = $685;
            };
            var _result$12 = $683;
        };
        var $679 = _result$12;
        return $679;
    };
    const Web$Kaelin$Coord$round = x0 => x1 => Web$Kaelin$Coord$round$(x0, x1);

    function Web$Kaelin$Coord$to_axial$(_coord$1) {
        var self = _coord$1;
        switch (self._) {
            case 'Pair.new':
                var $687 = self.fst;
                var $688 = self.snd;
                var _f$4 = U32$to_f64;
                var _i$5 = F64$to_i32;
                var _float_hex_rad$6 = (_f$4(Web$Kaelin$Constants$hexagon_radius) / (parseFloat("2.0")));
                var _center_x$7 = Web$Kaelin$Constants$center_x;
                var _center_y$8 = Web$Kaelin$Constants$center_y;
                var _float_x$9 = ((_f$4($687) - _f$4(_center_x$7)) / _float_hex_rad$6);
                var _float_y$10 = ((_f$4($688) - _f$4(_center_y$8)) / _float_hex_rad$6);
                var _fourth$11 = (parseFloat("0.25"));
                var _sixth$12 = ((parseFloat("1.0")) / (parseFloat("6.0")));
                var _third$13 = ((parseFloat("1.0")) / (parseFloat("3.0")));
                var _half$14 = (parseFloat("0.5"));
                var _axial_x$15 = ((_float_x$9 * _fourth$11) - (_float_y$10 * _sixth$12));
                var _axial_y$16 = (_float_y$10 * _third$13);
                var $689 = Web$Kaelin$Coord$round$(_axial_x$15, _axial_y$16);
                var $686 = $689;
                break;
        };
        return $686;
    };
    const Web$Kaelin$Coord$to_axial = x0 => Web$Kaelin$Coord$to_axial$(x0);

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
                        var $690 = self.pred;
                        var $691 = Word$is_neg$go$($690, Bool$false);
                        return $691;
                    case 'Word.i':
                        var $692 = self.pred;
                        var $693 = Word$is_neg$go$($692, Bool$true);
                        return $693;
                    case 'Word.e':
                        var $694 = _n$3;
                        return $694;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Word$is_neg$go = x0 => x1 => Word$is_neg$go$(x0, x1);

    function Word$is_neg$(_word$2) {
        var $695 = Word$is_neg$go$(_word$2, Bool$false);
        return $695;
    };
    const Word$is_neg = x0 => Word$is_neg$(x0);

    function Word$neg$aux$(_word$2, _inc$3) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $697 = self.pred;
                var self = _inc$3;
                if (self) {
                    var $699 = Word$o$(Word$neg$aux$($697, Bool$true));
                    var $698 = $699;
                } else {
                    var $700 = Word$i$(Word$neg$aux$($697, Bool$false));
                    var $698 = $700;
                };
                var $696 = $698;
                break;
            case 'Word.i':
                var $701 = self.pred;
                var self = _inc$3;
                if (self) {
                    var $703 = Word$i$(Word$neg$aux$($701, Bool$false));
                    var $702 = $703;
                } else {
                    var $704 = Word$o$(Word$neg$aux$($701, Bool$false));
                    var $702 = $704;
                };
                var $696 = $702;
                break;
            case 'Word.e':
                var $705 = Word$e;
                var $696 = $705;
                break;
        };
        return $696;
    };
    const Word$neg$aux = x0 => x1 => Word$neg$aux$(x0, x1);

    function Word$neg$(_word$2) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $707 = self.pred;
                var $708 = Word$o$(Word$neg$aux$($707, Bool$true));
                var $706 = $708;
                break;
            case 'Word.i':
                var $709 = self.pred;
                var $710 = Word$i$(Word$neg$aux$($709, Bool$false));
                var $706 = $710;
                break;
            case 'Word.e':
                var $711 = Word$e;
                var $706 = $711;
                break;
        };
        return $706;
    };
    const Word$neg = x0 => Word$neg$(x0);

    function Word$abs$(_a$2) {
        var _neg$3 = Word$is_neg$(_a$2);
        var self = _neg$3;
        if (self) {
            var $713 = Word$neg$(_a$2);
            var $712 = $713;
        } else {
            var $714 = _a$2;
            var $712 = $714;
        };
        return $712;
    };
    const Word$abs = x0 => Word$abs$(x0);

    function Word$to_int$(_a$2) {
        var _neg$3 = Word$is_neg$(_a$2);
        var _i$4 = Int$from_nat$(Word$to_nat$(Word$abs$(_a$2)));
        var self = _neg$3;
        if (self) {
            var $716 = Int$neg$(_i$4);
            var $715 = $716;
        } else {
            var $717 = _i$4;
            var $715 = $717;
        };
        return $715;
    };
    const Word$to_int = x0 => Word$to_int$(x0);

    function I32$to_int$(_a$1) {
        var self = _a$1;
        switch ('i32') {
            case 'i32':
                var $719 = i32_to_word(self);
                var $720 = Word$to_int$($719);
                var $718 = $720;
                break;
        };
        return $718;
    };
    const I32$to_int = x0 => I32$to_int$(x0);

    function Pair$show$(_show_a$3, _show_b$4, _pair$5) {
        var self = _pair$5;
        switch (self._) {
            case 'Pair.new':
                var $722 = self.fst;
                var $723 = self.snd;
                var _str$8 = ("(" + _show_a$3($722));
                var _str$9 = (_str$8 + ",");
                var _str$10 = (_str$9 + _show_b$4($723));
                var _str$11 = (_str$10 + ")");
                var $724 = _str$11;
                var $721 = $724;
                break;
        };
        return $721;
    };
    const Pair$show = x0 => x1 => x2 => Pair$show$(x0, x1, x2);
    const U16$eql = a0 => a1 => (a0 === a1);

    function U16$new$(_value$1) {
        var $725 = word_to_u16(_value$1);
        return $725;
    };
    const U16$new = x0 => U16$new$(x0);
    const Nat$to_u16 = a0 => (Number(a0) & 0xFFFF);

    function App$post$(_room$1, _data$2) {
        var $726 = App$do$("post", (_room$1 + (";" + _data$2)));
        return $726;
    };
    const App$post = x0 => x1 => App$post$(x0, x1);

    function String$repeat$(_xs$1, _n$2) {
        var self = _n$2;
        if (self === 0n) {
            var $728 = String$nil;
            var $727 = $728;
        } else {
            var $729 = (self - 1n);
            var $730 = (_xs$1 + String$repeat$(_xs$1, $729));
            var $727 = $730;
        };
        return $727;
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
                    var $731 = _xs$2;
                    return $731;
                } else {
                    var $732 = (self - 1n);
                    var self = _xs$2;
                    if (self.length === 0) {
                        var $734 = String$nil;
                        var $733 = $734;
                    } else {
                        var $735 = self.charCodeAt(0);
                        var $736 = self.slice(1);
                        var $737 = String$drop$($732, $736);
                        var $733 = $737;
                    };
                    return $733;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const String$drop = x0 => x1 => String$drop$(x0, x1);

    function Web$Kaelin$Command$create_player$(_hero_id$1) {
        var $738 = ("0x1" + (String$repeat$("0", 55n) + String$drop$(2n, _hero_id$1)));
        return $738;
    };
    const Web$Kaelin$Command$create_player = x0 => Web$Kaelin$Command$create_player$(x0);

    function Char$eql$(_a$1, _b$2) {
        var $739 = (_a$1 === _b$2);
        return $739;
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
                    var $740 = Bool$true;
                    return $740;
                } else {
                    var $741 = self.charCodeAt(0);
                    var $742 = self.slice(1);
                    var self = _xs$1;
                    if (self.length === 0) {
                        var $744 = Bool$false;
                        var $743 = $744;
                    } else {
                        var $745 = self.charCodeAt(0);
                        var $746 = self.slice(1);
                        var self = Char$eql$($741, $745);
                        if (self) {
                            var $748 = String$starts_with$($746, $742);
                            var $747 = $748;
                        } else {
                            var $749 = Bool$false;
                            var $747 = $749;
                        };
                        var $743 = $747;
                    };
                    return $743;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const String$starts_with = x0 => x1 => String$starts_with$(x0, x1);

    function Web$Kaelin$Hero$new$(_id$1, _ent$2) {
        var $750 = ({
            _: 'Web.Kaelin.Hero.new',
            'id': _id$1,
            'ent': _ent$2
        });
        return $750;
    };
    const Web$Kaelin$Hero$new = x0 => x1 => Web$Kaelin$Hero$new$(x0, x1);
    const Web$Kaelin$Hero$croni = Web$Kaelin$Hero$new$("0x00000001", Web$Kaelin$Entity$hero$(Web$Kaelin$Assets$hero$croni0_d_1));
    const Web$Kaelin$Hero$cyclope = Web$Kaelin$Hero$new$("0x00000002", Web$Kaelin$Entity$hero$(Web$Kaelin$Assets$hero$cyclope_d_1));
    const Web$Kaelin$Hero$lela = Web$Kaelin$Hero$new$("0x00000003", Web$Kaelin$Entity$hero$(Web$Kaelin$Assets$hero$lela_d_1));
    const Web$Kaelin$Hero$octoking = Web$Kaelin$Hero$new$("0x00000004", Web$Kaelin$Entity$hero$(Web$Kaelin$Assets$hero$octoking_d_1));
    const Web$Kaelin$Resources$heroes = (() => {
        var _heroes$1 = List$cons$(Web$Kaelin$Hero$croni, List$cons$(Web$Kaelin$Hero$cyclope, List$cons$(Web$Kaelin$Hero$lela, List$cons$(Web$Kaelin$Hero$octoking, List$nil))));
        var $751 = List$fold$(_heroes$1, Map$from_list$(List$nil), (_hero$2 => _map$3 => {
            var self = _hero$2;
            switch (self._) {
                case 'Web.Kaelin.Hero.new':
                    var $753 = self.id;
                    var $754 = Map$set$($753, _hero$2, _map$3);
                    var $752 = $754;
                    break;
            };
            return $752;
        }));
        return $751;
    })();

    function Web$Kaelin$Player$new$(_addr$1, _coord$2, _hero$3, _team$4) {
        var $755 = ({
            _: 'Web.Kaelin.Player.new',
            'addr': _addr$1,
            'coord': _coord$2,
            'hero': _hero$3,
            'team': _team$4
        });
        return $755;
    };
    const Web$Kaelin$Player$new = x0 => x1 => x2 => x3 => Web$Kaelin$Player$new$(x0, x1, x2, x3);

    function Web$Kaelin$Action$create_player$(_user$1, _hero$2, _state$3) {
        var _key$4 = _user$1;
        var _init_pos$5 = Web$Kaelin$Coord$new$((0n - 0n), (0n - 0n));
        var self = _state$3;
        switch (self._) {
            case 'Web.Kaelin.State.game':
                var $757 = self.room;
                var $758 = self.tick;
                var $759 = self.players;
                var $760 = self.cast_info;
                var $761 = self.map;
                var $762 = self.interface;
                var self = Map$get$(_key$4, $759);
                switch (self._) {
                    case 'Maybe.none':
                        var _new_player$12 = Web$Kaelin$Player$new$(_user$1, _init_pos$5, _hero$2, "blue");
                        var _new_players$13 = Map$set$(_key$4, _new_player$12, $759);
                        var $764 = Web$Kaelin$State$game$($757, $758, _new_players$13, $760, $761, $762);
                        var $763 = $764;
                        break;
                    case 'Maybe.some':
                        var $765 = _state$3;
                        var $763 = $765;
                        break;
                };
                var $756 = $763;
                break;
            case 'Web.Kaelin.State.init':
            case 'Web.Kaelin.State.void':
                var $766 = _state$3;
                var $756 = $766;
                break;
        };
        return $756;
    };
    const Web$Kaelin$Action$create_player = x0 => x1 => x2 => Web$Kaelin$Action$create_player$(x0, x1, x2);
    const String$eql = a0 => a1 => (a0 === a1);

    function String$take$(_n$1, _xs$2) {
        var self = _xs$2;
        if (self.length === 0) {
            var $768 = String$nil;
            var $767 = $768;
        } else {
            var $769 = self.charCodeAt(0);
            var $770 = self.slice(1);
            var self = _n$1;
            if (self === 0n) {
                var $772 = String$nil;
                var $771 = $772;
            } else {
                var $773 = (self - 1n);
                var $774 = String$cons$($769, String$take$($773, $770));
                var $771 = $774;
            };
            var $767 = $771;
        };
        return $767;
    };
    const String$take = x0 => x1 => String$take$(x0, x1);

    function String$slice$(_i$1, _j$2, _xs$3) {
        var $775 = String$take$((_j$2 - _i$1 <= 0n ? 0n : _j$2 - _i$1), String$drop$(_i$1, _xs$3));
        return $775;
    };
    const String$slice = x0 => x1 => x2 => String$slice$(x0, x1, x2);

    function Web$Kaelin$Player$move_by$(_i$1, _j$2, _player$3) {
        var self = _player$3;
        switch (self._) {
            case 'Web.Kaelin.Player.new':
                var $777 = self.addr;
                var $778 = self.coord;
                var $779 = self.hero;
                var $780 = self.team;
                var self = $778;
                switch (self._) {
                    case 'Web.Kaelin.Coord.new':
                        var $782 = self.i;
                        var $783 = self.j;
                        var _new_i$10 = ($782 + _i$1);
                        var _new_j$11 = ($783 + _j$2);
                        var _new_pos$12 = Web$Kaelin$Coord$new$(_new_i$10, _new_j$11);
                        var $784 = Web$Kaelin$Player$new$($777, _new_pos$12, $779, $780);
                        var $781 = $784;
                        break;
                };
                var $776 = $781;
                break;
        };
        return $776;
    };
    const Web$Kaelin$Player$move_by = x0 => x1 => x2 => Web$Kaelin$Player$move_by$(x0, x1, x2);

    function Web$Kaelin$Action$move_player$(_player_addr$1, _x$2, _y$3, _state$4) {
        var self = _state$4;
        switch (self._) {
            case 'Web.Kaelin.State.game':
                var $786 = self.room;
                var $787 = self.tick;
                var $788 = self.players;
                var $789 = self.cast_info;
                var $790 = self.map;
                var $791 = self.interface;
                var _player$11 = Map$get$(_player_addr$1, $788);
                var self = _player$11;
                switch (self._) {
                    case 'Maybe.some':
                        var $793 = self.value;
                        var _player$13 = Web$Kaelin$Player$move_by$(_x$2, _y$3, $793);
                        var _players$14 = Map$set$(_player_addr$1, _player$13, $788);
                        var $794 = Web$Kaelin$State$game$($786, $787, _players$14, $789, $790, $791);
                        var $792 = $794;
                        break;
                    case 'Maybe.none':
                        var $795 = _state$4;
                        var $792 = $795;
                        break;
                };
                var $785 = $792;
                break;
            case 'Web.Kaelin.State.init':
            case 'Web.Kaelin.State.void':
                var $796 = _state$4;
                var $785 = $796;
                break;
        };
        return $785;
    };
    const Web$Kaelin$Action$move_player = x0 => x1 => x2 => x3 => Web$Kaelin$Action$move_player$(x0, x1, x2, x3);

    function App$new$(_init$2, _draw$3, _when$4) {
        var $797 = ({
            _: 'App.new',
            'init': _init$2,
            'draw': _draw$3,
            'when': _when$4
        });
        return $797;
    };
    const App$new = x0 => x1 => x2 => App$new$(x0, x1, x2);
    const Web$Kaelin = (() => {
        var _img$1 = VoxBox$alloc_capacity$(((65536 * 8) >>> 0));
        var _map$2 = Web$Kaelin$Draw$initial_ent$(Map$from_list$(List$nil));
        var _init$3 = Web$Kaelin$State$game$(Web$Kaelin$Constants$room, 0n, Map$from_list$(List$nil), Maybe$none, _map$2, App$EnvInfo$new$(Pair$new$(256, 256), Pair$new$(0, 0)));
        var _draw$4 = (_state$4 => {
            var self = _state$4;
            switch (self._) {
                case 'Web.Kaelin.State.game':
                    var $800 = self.map;
                    var _img$11 = Web$Kaelin$Draw$map$(_img$1, $800);
                    var _img$12 = Web$Kaelin$Draw$state$(_img$11, _state$4);
                    var $801 = DOM$vbox$(Map$from_list$(List$nil), Map$from_list$(List$nil), _img$12);
                    var $799 = $801;
                    break;
                case 'Web.Kaelin.State.init':
                case 'Web.Kaelin.State.void':
                    var $802 = DOM$text$("TODO: create the renderer for this game state mode");
                    var $799 = $802;
                    break;
            };
            return $799;
        });
        var _when$5 = (_event$5 => _state$6 => {
            var self = _event$5;
            switch (self._) {
                case 'App.Event.tick':
                    var $804 = self.info;
                    var self = _state$6;
                    switch (self._) {
                        case 'Web.Kaelin.State.init':
                        case 'Web.Kaelin.State.void':
                            var $806 = App$pass;
                            var $805 = $806;
                            break;
                        case 'Web.Kaelin.State.game':
                            var _info$15 = $804;
                            var $807 = App$store$(Web$Kaelin$Action$update_interface$(_info$15, _state$6));
                            var $805 = $807;
                            break;
                    };
                    var $803 = $805;
                    break;
                case 'App.Event.key_down':
                    var $808 = self.code;
                    var self = _state$6;
                    switch (self._) {
                        case 'Web.Kaelin.State.game':
                            var $810 = self.room;
                            var self = ($808 === 49);
                            if (self) {
                                var $812 = App$post$($810, Web$Kaelin$Command$create_player$("0x00000001"));
                                var $811 = $812;
                            } else {
                                var self = ($808 === 50);
                                if (self) {
                                    var $814 = App$post$($810, Web$Kaelin$Command$create_player$("0x00000002"));
                                    var $813 = $814;
                                } else {
                                    var self = ($808 === 51);
                                    if (self) {
                                        var $816 = App$post$($810, Web$Kaelin$Command$create_player$("0x00000003"));
                                        var $815 = $816;
                                    } else {
                                        var self = ($808 === 52);
                                        if (self) {
                                            var $818 = App$post$($810, Web$Kaelin$Command$create_player$("0x00000004"));
                                            var $817 = $818;
                                        } else {
                                            var self = ($808 === 68);
                                            if (self) {
                                                var $820 = App$post$($810, "0x2100000000000000000000000000000000000000000000000000000000000001");
                                                var $819 = $820;
                                            } else {
                                                var self = ($808 === 65);
                                                if (self) {
                                                    var $822 = App$post$($810, "0x2200000000000000000000000000000000000000000000000000000000000001");
                                                    var $821 = $822;
                                                } else {
                                                    var self = ($808 === 87);
                                                    if (self) {
                                                        var $824 = App$post$($810, "0x2300000000000000000000000000000000000000000000000000000000000001");
                                                        var $823 = $824;
                                                    } else {
                                                        var self = ($808 === 83);
                                                        if (self) {
                                                            var $826 = App$post$($810, "0x2400000000000000000000000000000000000000000000000000000000000001");
                                                            var $825 = $826;
                                                        } else {
                                                            var $827 = App$pass;
                                                            var $825 = $827;
                                                        };
                                                        var $823 = $825;
                                                    };
                                                    var $821 = $823;
                                                };
                                                var $819 = $821;
                                            };
                                            var $817 = $819;
                                        };
                                        var $815 = $817;
                                    };
                                    var $813 = $815;
                                };
                                var $811 = $813;
                            };
                            var $809 = $811;
                            break;
                        case 'Web.Kaelin.State.init':
                        case 'Web.Kaelin.State.void':
                            var $828 = App$pass;
                            var $809 = $828;
                            break;
                    };
                    var $803 = $809;
                    break;
                case 'App.Event.post':
                    var $829 = self.addr;
                    var $830 = self.data;
                    var self = _state$6;
                    switch (self._) {
                        case 'Web.Kaelin.State.init':
                        case 'Web.Kaelin.State.void':
                            var $832 = App$pass;
                            var $831 = $832;
                            break;
                        case 'Web.Kaelin.State.game':
                            var self = String$starts_with$($830, "0x1");
                            if (self) {
                                var _hero_id$17 = ("0x" + String$drop$(58n, $830));
                                var _hero$18 = Map$get$(_hero_id$17, Web$Kaelin$Resources$heroes);
                                var self = _hero$18;
                                switch (self._) {
                                    case 'Maybe.some':
                                        var $835 = self.value;
                                        var $836 = App$store$(Web$Kaelin$Action$create_player$($829, $835, _state$6));
                                        var $834 = $836;
                                        break;
                                    case 'Maybe.none':
                                        var $837 = App$pass;
                                        var $834 = $837;
                                        break;
                                };
                                var $833 = $834;
                            } else {
                                var self = String$starts_with$($830, "0x2");
                                if (self) {
                                    var self = (String$slice$(3n, 4n, $830) === "1");
                                    if (self) {
                                        var $840 = Pair$new$((1n - 0n), (0n - 0n));
                                        var _coord$17 = $840;
                                    } else {
                                        var self = (String$slice$(3n, 4n, $830) === "2");
                                        if (self) {
                                            var $842 = Pair$new$((0n - 1n), (0n - 0n));
                                            var $841 = $842;
                                        } else {
                                            var self = (String$slice$(3n, 4n, $830) === "3");
                                            if (self) {
                                                var $844 = Pair$new$((0n - 0n), (0n - 1n));
                                                var $843 = $844;
                                            } else {
                                                var self = (String$slice$(3n, 4n, $830) === "4");
                                                if (self) {
                                                    var $846 = Pair$new$((0n - 0n), (1n - 0n));
                                                    var $845 = $846;
                                                } else {
                                                    var $847 = Pair$new$((0n - 0n), (0n - 0n));
                                                    var $845 = $847;
                                                };
                                                var $843 = $845;
                                            };
                                            var $841 = $843;
                                        };
                                        var _coord$17 = $841;
                                    };
                                    var self = _coord$17;
                                    switch (self._) {
                                        case 'Pair.new':
                                            var $848 = self.fst;
                                            var $849 = self.snd;
                                            var $850 = App$store$(Web$Kaelin$Action$move_player$($829, $848, $849, _state$6));
                                            var $839 = $850;
                                            break;
                                    };
                                    var $838 = $839;
                                } else {
                                    var $851 = App$pass;
                                    var $838 = $851;
                                };
                                var $833 = $838;
                            };
                            var $831 = $833;
                            break;
                    };
                    var $803 = $831;
                    break;
                case 'App.Event.init':
                    var self = _state$6;
                    switch (self._) {
                        case 'Web.Kaelin.State.init':
                        case 'Web.Kaelin.State.void':
                            var $853 = App$pass;
                            var $852 = $853;
                            break;
                        case 'Web.Kaelin.State.game':
                            var $854 = IO$monad$((_m$bind$16 => _m$pure$17 => {
                                var $855 = _m$bind$16;
                                return $855;
                            }))(App$print$("Kaelin started!!!"))((_$16 => {
                                var $856 = App$watch$(Web$Kaelin$Constants$room);
                                return $856;
                            }));
                            var $852 = $854;
                            break;
                    };
                    var $803 = $852;
                    break;
                case 'App.Event.dom':
                    var self = _state$6;
                    switch (self._) {
                        case 'Web.Kaelin.State.init':
                        case 'Web.Kaelin.State.void':
                        case 'Web.Kaelin.State.game':
                            var $858 = App$pass;
                            var $857 = $858;
                            break;
                    };
                    var $803 = $857;
                    break;
                case 'App.Event.mouse_down':
                case 'App.Event.key_up':
                    var self = _state$6;
                    switch (self._) {
                        case 'Web.Kaelin.State.init':
                        case 'Web.Kaelin.State.void':
                        case 'Web.Kaelin.State.game':
                            var $860 = App$pass;
                            var $859 = $860;
                            break;
                    };
                    var $803 = $859;
                    break;
                case 'App.Event.mouse_up':
                    var self = _state$6;
                    switch (self._) {
                        case 'Web.Kaelin.State.game':
                            var $862 = self.interface;
                            var _info$15 = $862;
                            var self = _info$15;
                            switch (self._) {
                                case 'App.EnvInfo.new':
                                    var $864 = self.mouse_pos;
                                    var _pos$18 = $864;
                                    var self = _pos$18;
                                    switch (self._) {
                                        case 'Pair.new':
                                            var self = _pos$18;
                                            switch (self._) {
                                                case 'Pair.new':
                                                    var $867 = self.fst;
                                                    var $868 = self.snd;
                                                    var self = Web$Kaelin$Coord$to_axial$(Pair$new$($867, $868));
                                                    switch (self._) {
                                                        case 'Pair.new':
                                                            var $870 = self.fst;
                                                            var $871 = self.snd;
                                                            var _axial_x$25 = I32$to_int$($870);
                                                            var _axial_y$26 = I32$to_int$($871);
                                                            var $872 = App$print$(Pair$show$(Int$show, Int$show, Pair$new$(_axial_x$25, _axial_y$26)));
                                                            var $869 = $872;
                                                            break;
                                                    };
                                                    var $866 = $869;
                                                    break;
                                            };
                                            var $865 = $866;
                                            break;
                                    };
                                    var $863 = $865;
                                    break;
                            };
                            var $861 = $863;
                            break;
                        case 'Web.Kaelin.State.init':
                        case 'Web.Kaelin.State.void':
                            var $873 = App$pass;
                            var $861 = $873;
                            break;
                    };
                    var $803 = $861;
                    break;
            };
            return $803;
        });
        var $798 = App$new$(_init$3, _draw$4, _when$5);
        return $798;
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
        'Web.Kaelin.Entity.hero': Web$Kaelin$Entity$hero,
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
        'Pair': Pair,
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
        'Web.Kaelin.Assets.hero.cyclope_d_1': Web$Kaelin$Assets$hero$cyclope_d_1,
        'Web.Kaelin.Assets.hero.lela_d_1': Web$Kaelin$Assets$hero$lela_d_1,
        'Web.Kaelin.Assets.hero.octoking_d_1': Web$Kaelin$Assets$hero$octoking_d_1,
        'Web.Kaelin.Entity.background': Web$Kaelin$Entity$background,
        'Web.Kaelin.Assets.tile.dark_grass_4': Web$Kaelin$Assets$tile$dark_grass_4,
        'Web.Kaelin.Coord.new': Web$Kaelin$Coord$new,
        'String.cons': String$cons,
        'String.concat': String$concat,
        'Nat.gtn': Nat$gtn,
        'Int.is_neg': Int$is_neg,
        'Int.new': Int$new,
        'Int.neg': Int$neg,
        'Int.abs': Int$abs,
        'Int.to_nat_signed': Int$to_nat_signed,
        'List.fold': List$fold,
        'Either': Either,
        'Either.left': Either$left,
        'Either.right': Either$right,
        'Nat.sub_rem': Nat$sub_rem,
        'Nat.div_mod.go': Nat$div_mod$go,
        'Nat.div_mod': Nat$div_mod,
        'List': List,
        'List.cons': List$cons,
        'Nat.to_base.go': Nat$to_base$go,
        'List.nil': List$nil,
        'Nat.to_base': Nat$to_base,
        'String.nil': String$nil,
        'Nat.mod.go': Nat$mod$go,
        'Nat.mod': Nat$mod,
        'Bool.and': Bool$and,
        'Nat.lte': Nat$lte,
        'Maybe': Maybe,
        'Maybe.none': Maybe$none,
        'Maybe.some': Maybe$some,
        'List.at': List$at,
        'Nat.show_digit': Nat$show_digit,
        'Nat.to_string_base': Nat$to_string_base,
        'Nat.show': Nat$show,
        'Int.show': Int$show,
        'Web.Kaelin.Coord.show': Web$Kaelin$Coord$show,
        'BitsMap': BitsMap,
        'BitsMap.tie': BitsMap$tie,
        'BitsMap.new': BitsMap$new,
        'BitsMap.set': BitsMap$set,
        'Bits.e': Bits$e,
        'Bits.o': Bits$o,
        'Bits.i': Bits$i,
        'Bits.concat': Bits$concat,
        'Word.to_bits': Word$to_bits,
        'U16.to_bits': U16$to_bits,
        'String.to_bits': String$to_bits,
        'Map.set': Map$set,
        'Maybe.default': Maybe$default,
        'BitsMap.get': BitsMap$get,
        'Map.get': Map$get,
        'Web.Kaelin.Map.push': Web$Kaelin$Map$push,
        'Web.Kaelin.Draw.initial_ent': Web$Kaelin$Draw$initial_ent,
        'Map': Map,
        'Map.from_list': Map$from_list,
        'Web.Kaelin.State.game': Web$Kaelin$State$game,
        'Web.Kaelin.Constants.room': Web$Kaelin$Constants$room,
        'App.EnvInfo.new': App$EnvInfo$new,
        'DOM.text': DOM$text,
        'VoxBox.clear': VoxBox$clear,
        'Web.Kaelin.Constants.map_size': Web$Kaelin$Constants$map_size,
        'Web.Kaelin.Constants.hexagon_radius': Web$Kaelin$Constants$hexagon_radius,
        'Nat.add': Nat$add,
        'Int.add': Int$add,
        'Int.sub': Int$sub,
        'Word.fold': Word$fold,
        'Nat.mul': Nat$mul,
        'Word.to_nat': Word$to_nat,
        'U32.to_nat': U32$to_nat,
        'Cmp.as_lte': Cmp$as_lte,
        'Word.lte': Word$lte,
        'U32.lte': U32$lte,
        'Web.Kaelin.Coord.fit': Web$Kaelin$Coord$fit,
        'Web.Kaelin.Map.background': Web$Kaelin$Map$background,
        'Int.from_u32': Int$from_u32,
        'Pair.fst': Pair$fst,
        'Nat.div': Nat$div,
        'Int.div_nat': Int$div_nat,
        'Web.Kaelin.Constants.center_x': Web$Kaelin$Constants$center_x,
        'Web.Kaelin.Constants.center_y': Web$Kaelin$Constants$center_y,
        'Int.mul': Int$mul,
        'Int.from_nat': Int$from_nat,
        'Int.to_u32': Int$to_u32,
        'Web.Kaelin.Coord.to_screen_xy': Web$Kaelin$Coord$to_screen_xy,
        'U32.sub': U32$sub,
        'VoxBox.Draw.deresagon': VoxBox$Draw$deresagon,
        'Web.Kaelin.Draw.hexagon_border': Web$Kaelin$Draw$hexagon_border,
        'Web.Kaelin.Draw.tile.empty': Web$Kaelin$Draw$tile$empty,
        'Web.Kaelin.Map.get': Web$Kaelin$Map$get,
        'List.for': List$for,
        'VoxBox.get_len': VoxBox$get_len,
        'Array.get': Array$get,
        'Buffer32.get': Buffer32$get,
        'VoxBox.get_pos': VoxBox$get_pos,
        'VoxBox.get_col': VoxBox$get_col,
        'Word.and': Word$and,
        'U32.and': U32$and,
        'U32.shr': U32$shr,
        'VoxBox.Draw.image': VoxBox$Draw$image,
        'Web.Kaelin.Draw.tile': Web$Kaelin$Draw$tile,
        'Web.Kaelin.Draw.map': Web$Kaelin$Draw$map,
        'BitsMap.values.go': BitsMap$values$go,
        'Map.values': Map$values,
        'Web.Kaelin.Draw.hero': Web$Kaelin$Draw$hero,
        'Web.Kaelin.Draw.state.player': Web$Kaelin$Draw$state$player,
        'Web.Kaelin.Draw.state.players': Web$Kaelin$Draw$state$players,
        'Web.Kaelin.Draw.state': Web$Kaelin$Draw$state,
        'DOM.vbox': DOM$vbox,
        'IO': IO,
        'IO.ask': IO$ask,
        'IO.bind': IO$bind,
        'IO.end': IO$end,
        'IO.monad': IO$monad,
        'Dynamic.new': Dynamic$new,
        'App.pass': App$pass,
        'IO.put_string': IO$put_string,
        'IO.print': IO$print,
        'App.print': App$print,
        'IO.do': IO$do,
        'App.do': App$do,
        'App.watch': App$watch,
        'App.store': App$store,
        'Web.Kaelin.Action.update_interface': Web$Kaelin$Action$update_interface,
        'Word.to_f64': Word$to_f64,
        'U32.to_f64': U32$to_f64,
        'F64.to_i32': F64$to_i32,
        'F64.div': F64$div,
        'F64.parse': F64$parse,
        'F64.sub': F64$sub,
        'F64.mul': F64$mul,
        'F64.add': F64$add,
        'Word.s_to_f64': Word$s_to_f64,
        'I32.to_f64': I32$to_f64,
        'Web.Kaelin.Coord.round.floor': Web$Kaelin$Coord$round$floor,
        'Web.Kaelin.Coord.round.round_F64': Web$Kaelin$Coord$round$round_F64,
        'Cmp.as_gtn': Cmp$as_gtn,
        'Word.gtn': Word$gtn,
        'F64.gtn': F64$gtn,
        'Web.Kaelin.Coord.round.diff': Web$Kaelin$Coord$round$diff,
        'Web.Kaelin.Coord.round': Web$Kaelin$Coord$round,
        'Web.Kaelin.Coord.to_axial': Web$Kaelin$Coord$to_axial,
        'Word.is_neg.go': Word$is_neg$go,
        'Word.is_neg': Word$is_neg,
        'Word.neg.aux': Word$neg$aux,
        'Word.neg': Word$neg,
        'Word.abs': Word$abs,
        'Word.to_int': Word$to_int,
        'I32.to_int': I32$to_int,
        'Pair.show': Pair$show,
        'U16.eql': U16$eql,
        'U16.new': U16$new,
        'Nat.to_u16': Nat$to_u16,
        'App.post': App$post,
        'String.repeat': String$repeat,
        'String.drop': String$drop,
        'Web.Kaelin.Command.create_player': Web$Kaelin$Command$create_player,
        'Char.eql': Char$eql,
        'String.starts_with': String$starts_with,
        'Web.Kaelin.Hero.new': Web$Kaelin$Hero$new,
        'Web.Kaelin.Hero.croni': Web$Kaelin$Hero$croni,
        'Web.Kaelin.Hero.cyclope': Web$Kaelin$Hero$cyclope,
        'Web.Kaelin.Hero.lela': Web$Kaelin$Hero$lela,
        'Web.Kaelin.Hero.octoking': Web$Kaelin$Hero$octoking,
        'Web.Kaelin.Resources.heroes': Web$Kaelin$Resources$heroes,
        'Web.Kaelin.Player.new': Web$Kaelin$Player$new,
        'Web.Kaelin.Action.create_player': Web$Kaelin$Action$create_player,
        'String.eql': String$eql,
        'String.take': String$take,
        'String.slice': String$slice,
        'Web.Kaelin.Player.move_by': Web$Kaelin$Player$move_by,
        'Web.Kaelin.Action.move_player': Web$Kaelin$Action$move_player,
        'App.new': App$new,
        'Web.Kaelin': Web$Kaelin,
    };
})();