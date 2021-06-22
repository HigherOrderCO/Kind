(self["webpackChunkkind_web"] = self["webpackChunkkind_web"] || []).push([[415],{

/***/ 415:
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
    const inst_u16 = x => x(x0 => word_to_u16(x0));
    const elim_u16 = (x => {
        var $15 = (() => c0 => {
            var self = x;
            switch ('u16') {
                case 'u16':
                    var $13 = u16_to_word(self);
                    var $14 = c0($13);
                    return $14;
            };
        })();
        return $15;
    });
    const inst_u32 = x => x(x0 => word_to_u32(x0));
    const elim_u32 = (x => {
        var $18 = (() => c0 => {
            var self = x;
            switch ('u32') {
                case 'u32':
                    var $16 = u32_to_word(self);
                    var $17 = c0($16);
                    return $17;
            };
        })();
        return $18;
    });
    const inst_i32 = x => x(x0 => word_to_i32(x0));
    const elim_i32 = (x => {
        var $21 = (() => c0 => {
            var self = x;
            switch ('i32') {
                case 'i32':
                    var $19 = i32_to_word(self);
                    var $20 = c0($19);
                    return $20;
            };
        })();
        return $21;
    });
    const inst_u64 = x => x(x0 => word_to_u64(x0));
    const elim_u64 = (x => {
        var $24 = (() => c0 => {
            var self = x;
            switch ('u64') {
                case 'u64':
                    var $22 = u64_to_word(self);
                    var $23 = c0($22);
                    return $23;
            };
        })();
        return $24;
    });
    const inst_f64 = x => x(x0 => word_to_f64(x0));
    const elim_f64 = (x => {
        var $27 = (() => c0 => {
            var self = x;
            switch ('f64') {
                case 'f64':
                    var $25 = f64_to_word(self);
                    var $26 = c0($25);
                    return $26;
            };
        })();
        return $27;
    });
    const inst_string = x => x('')(x0 => x1 => (String.fromCharCode(x0) + x1));
    const elim_string = (x => {
        var $32 = (() => c0 => c1 => {
            var self = x;
            if (self.length === 0) {
                var $28 = c0;
                return $28;
            } else {
                var $29 = self.charCodeAt(0);
                var $30 = self.slice(1);
                var $31 = c1($29)($30);
                return $31;
            };
        })();
        return $32;
    });
    const inst_buffer32 = x => x(x0 => x1 => u32array_to_buffer32(x1));
    const elim_buffer32 = (x => {
        var $36 = (() => c0 => {
            var self = x;
            switch ('b32') {
                case 'b32':
                    var $33 = buffer32_to_depth(self);
                    var $34 = buffer32_to_u32array(self);
                    var $35 = c0($33)($34);
                    return $35;
            };
        })();
        return $36;
    });

    function Buffer32$new$(_depth$1, _array$2) {
        var $37 = u32array_to_buffer32(_array$2);
        return $37;
    };
    const Buffer32$new = x0 => x1 => Buffer32$new$(x0, x1);

    function Array$(_A$1, _depth$2) {
        var $38 = null;
        return $38;
    };
    const Array = x0 => x1 => Array$(x0, x1);

    function Array$tip$(_value$2) {
        var $39 = ({
            _: 'Array.tip',
            'value': _value$2
        });
        return $39;
    };
    const Array$tip = x0 => Array$tip$(x0);

    function Array$tie$(_lft$3, _rgt$4) {
        var $40 = ({
            _: 'Array.tie',
            'lft': _lft$3,
            'rgt': _rgt$4
        });
        return $40;
    };
    const Array$tie = x0 => x1 => Array$tie$(x0, x1);

    function Array$alloc$(_depth$2, _x$3) {
        var self = _depth$2;
        if (self === 0n) {
            var $42 = Array$tip$(_x$3);
            var $41 = $42;
        } else {
            var $43 = (self - 1n);
            var _half$5 = Array$alloc$($43, _x$3);
            var $44 = Array$tie$(_half$5, _half$5);
            var $41 = $44;
        };
        return $41;
    };
    const Array$alloc = x0 => x1 => Array$alloc$(x0, x1);

    function U32$new$(_value$1) {
        var $45 = word_to_u32(_value$1);
        return $45;
    };
    const U32$new = x0 => U32$new$(x0);

    function Word$(_size$1) {
        var $46 = null;
        return $46;
    };
    const Word = x0 => Word$(x0);
    const Word$e = ({
        _: 'Word.e'
    });

    function Word$o$(_pred$2) {
        var $47 = ({
            _: 'Word.o',
            'pred': _pred$2
        });
        return $47;
    };
    const Word$o = x0 => Word$o$(x0);

    function Word$zero$(_size$1) {
        var self = _size$1;
        if (self === 0n) {
            var $49 = Word$e;
            var $48 = $49;
        } else {
            var $50 = (self - 1n);
            var $51 = Word$o$(Word$zero$($50));
            var $48 = $51;
        };
        return $48;
    };
    const Word$zero = x0 => Word$zero$(x0);

    function Nat$succ$(_pred$1) {
        var $52 = 1n + _pred$1;
        return $52;
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
                        var $53 = self.pred;
                        var $54 = Word$bit_length$go$($53, Nat$succ$(_c$3), _n$4);
                        return $54;
                    case 'Word.i':
                        var $55 = self.pred;
                        var $56 = Word$bit_length$go$($55, Nat$succ$(_c$3), Nat$succ$(_c$3));
                        return $56;
                    case 'Word.e':
                        var $57 = _n$4;
                        return $57;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Word$bit_length$go = x0 => x1 => x2 => Word$bit_length$go$(x0, x1, x2);

    function Word$bit_length$(_word$2) {
        var $58 = Word$bit_length$go$(_word$2, 0n, 0n);
        return $58;
    };
    const Word$bit_length = x0 => Word$bit_length$(x0);

    function U32$bit_length$(_size$1) {
        var self = _size$1;
        switch ('u32') {
            case 'u32':
                var $60 = u32_to_word(self);
                var $61 = Word$bit_length$($60);
                var $59 = $61;
                break;
        };
        return $59;
    };
    const U32$bit_length = x0 => U32$bit_length$(x0);

    function Word$i$(_pred$2) {
        var $62 = ({
            _: 'Word.i',
            'pred': _pred$2
        });
        return $62;
    };
    const Word$i = x0 => Word$i$(x0);
    const Bool$false = false;
    const Bool$true = true;

    function Word$shift_left$one$go$(_word$2, _prev$3) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $64 = self.pred;
                var self = _prev$3;
                if (self) {
                    var $66 = Word$i$(Word$shift_left$one$go$($64, Bool$false));
                    var $65 = $66;
                } else {
                    var $67 = Word$o$(Word$shift_left$one$go$($64, Bool$false));
                    var $65 = $67;
                };
                var $63 = $65;
                break;
            case 'Word.i':
                var $68 = self.pred;
                var self = _prev$3;
                if (self) {
                    var $70 = Word$i$(Word$shift_left$one$go$($68, Bool$true));
                    var $69 = $70;
                } else {
                    var $71 = Word$o$(Word$shift_left$one$go$($68, Bool$true));
                    var $69 = $71;
                };
                var $63 = $69;
                break;
            case 'Word.e':
                var $72 = Word$e;
                var $63 = $72;
                break;
        };
        return $63;
    };
    const Word$shift_left$one$go = x0 => x1 => Word$shift_left$one$go$(x0, x1);

    function Word$shift_left$one$(_word$2) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $74 = self.pred;
                var $75 = Word$o$(Word$shift_left$one$go$($74, Bool$false));
                var $73 = $75;
                break;
            case 'Word.i':
                var $76 = self.pred;
                var $77 = Word$o$(Word$shift_left$one$go$($76, Bool$true));
                var $73 = $77;
                break;
            case 'Word.e':
                var $78 = Word$e;
                var $73 = $78;
                break;
        };
        return $73;
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
                    var $79 = _value$3;
                    return $79;
                } else {
                    var $80 = (self - 1n);
                    var $81 = Word$shift_left$($80, Word$shift_left$one$(_value$3));
                    return $81;
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
                var $83 = self.pred;
                var $84 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $86 = self.pred;
                            var $87 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $89 = Word$i$(Word$adder$(_a$pred$10, $86, Bool$false));
                                    var $88 = $89;
                                } else {
                                    var $90 = Word$o$(Word$adder$(_a$pred$10, $86, Bool$false));
                                    var $88 = $90;
                                };
                                return $88;
                            });
                            var $85 = $87;
                            break;
                        case 'Word.i':
                            var $91 = self.pred;
                            var $92 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $94 = Word$o$(Word$adder$(_a$pred$10, $91, Bool$true));
                                    var $93 = $94;
                                } else {
                                    var $95 = Word$i$(Word$adder$(_a$pred$10, $91, Bool$false));
                                    var $93 = $95;
                                };
                                return $93;
                            });
                            var $85 = $92;
                            break;
                        case 'Word.e':
                            var $96 = (_a$pred$8 => {
                                var $97 = Word$e;
                                return $97;
                            });
                            var $85 = $96;
                            break;
                    };
                    var $85 = $85($83);
                    return $85;
                });
                var $82 = $84;
                break;
            case 'Word.i':
                var $98 = self.pred;
                var $99 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $101 = self.pred;
                            var $102 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $104 = Word$o$(Word$adder$(_a$pred$10, $101, Bool$true));
                                    var $103 = $104;
                                } else {
                                    var $105 = Word$i$(Word$adder$(_a$pred$10, $101, Bool$false));
                                    var $103 = $105;
                                };
                                return $103;
                            });
                            var $100 = $102;
                            break;
                        case 'Word.i':
                            var $106 = self.pred;
                            var $107 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $109 = Word$i$(Word$adder$(_a$pred$10, $106, Bool$true));
                                    var $108 = $109;
                                } else {
                                    var $110 = Word$o$(Word$adder$(_a$pred$10, $106, Bool$true));
                                    var $108 = $110;
                                };
                                return $108;
                            });
                            var $100 = $107;
                            break;
                        case 'Word.e':
                            var $111 = (_a$pred$8 => {
                                var $112 = Word$e;
                                return $112;
                            });
                            var $100 = $111;
                            break;
                    };
                    var $100 = $100($98);
                    return $100;
                });
                var $82 = $99;
                break;
            case 'Word.e':
                var $113 = (_b$5 => {
                    var $114 = Word$e;
                    return $114;
                });
                var $82 = $113;
                break;
        };
        var $82 = $82(_b$3);
        return $82;
    };
    const Word$adder = x0 => x1 => x2 => Word$adder$(x0, x1, x2);

    function Word$add$(_a$2, _b$3) {
        var $115 = Word$adder$(_a$2, _b$3, Bool$false);
        return $115;
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
                        var $116 = self.pred;
                        var $117 = Word$mul$go$($116, Word$shift_left$(1n, _b$4), _acc$5);
                        return $117;
                    case 'Word.i':
                        var $118 = self.pred;
                        var $119 = Word$mul$go$($118, Word$shift_left$(1n, _b$4), Word$add$(_b$4, _acc$5));
                        return $119;
                    case 'Word.e':
                        var $120 = _acc$5;
                        return $120;
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
                var $122 = self.pred;
                var $123 = Word$o$(Word$to_zero$($122));
                var $121 = $123;
                break;
            case 'Word.i':
                var $124 = self.pred;
                var $125 = Word$o$(Word$to_zero$($124));
                var $121 = $125;
                break;
            case 'Word.e':
                var $126 = Word$e;
                var $121 = $126;
                break;
        };
        return $121;
    };
    const Word$to_zero = x0 => Word$to_zero$(x0);

    function Word$mul$(_a$2, _b$3) {
        var $127 = Word$mul$go$(_a$2, _b$3, Word$to_zero$(_a$2));
        return $127;
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
                    var $128 = _x$4;
                    return $128;
                } else {
                    var $129 = (self - 1n);
                    var $130 = Nat$apply$($129, _f$3, _f$3(_x$4));
                    return $130;
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
                var $132 = self.pred;
                var $133 = Word$i$($132);
                var $131 = $133;
                break;
            case 'Word.i':
                var $134 = self.pred;
                var $135 = Word$o$(Word$inc$($134));
                var $131 = $135;
                break;
            case 'Word.e':
                var $136 = Word$e;
                var $131 = $136;
                break;
        };
        return $131;
    };
    const Word$inc = x0 => Word$inc$(x0);

    function Nat$to_word$(_size$1, _n$2) {
        var $137 = Nat$apply$(_n$2, Word$inc, Word$zero$(_size$1));
        return $137;
    };
    const Nat$to_word = x0 => x1 => Nat$to_word$(x0, x1);
    const Nat$to_u32 = a0 => (Number(a0) >>> 0);

    function VoxBox$new$(_length$1, _capacity$2, _buffer$3) {
        var $138 = ({
            _: 'VoxBox.new',
            'length': _length$1,
            'capacity': _capacity$2,
            'buffer': _buffer$3
        });
        return $138;
    };
    const VoxBox$new = x0 => x1 => x2 => VoxBox$new$(x0, x1, x2);

    function VoxBox$alloc_capacity$(_capacity$1) {
        var _buffer$2 = (new Uint32Array(2 ** Number(U32$bit_length$(((2 * _capacity$1) >>> 0)))));
        var $139 = VoxBox$new$(0, _capacity$1, _buffer$2);
        return $139;
    };
    const VoxBox$alloc_capacity = x0 => VoxBox$alloc_capacity$(x0);

    function App$new$(_init$2, _draw$3, _when$4, _tick$5, _post$6) {
        var $140 = ({
            _: 'App.new',
            'init': _init$2,
            'draw': _draw$3,
            'when': _when$4,
            'tick': _tick$5,
            'post': _post$6
        });
        return $140;
    };
    const App$new = x0 => x1 => x2 => x3 => x4 => App$new$(x0, x1, x2, x3, x4);

    function Pair$new$(_fst$3, _snd$4) {
        var $141 = ({
            _: 'Pair.new',
            'fst': _fst$3,
            'snd': _snd$4
        });
        return $141;
    };
    const Pair$new = x0 => x1 => Pair$new$(x0, x1);
    const App$State$new = Pair$new$(null, null);
    const App$Seta$State = App$State$new;

    function App$Store$new$(_local$2, _global$3) {
        var $142 = ({
            _: 'App.Store.new',
            'local': _local$2,
            'global': _global$3
        });
        return $142;
    };
    const App$Store$new = x0 => x1 => App$Store$new$(x0, x1);
    const App$Seta$init = App$Store$new$(0n, 0n);

    function I32$new$(_value$1) {
        var $143 = word_to_i32(_value$1);
        return $143;
    };
    const I32$new = x0 => I32$new$(x0);

    function Word$neg$aux$(_word$2, _inc$3) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $145 = self.pred;
                var self = _inc$3;
                if (self) {
                    var $147 = Word$o$(Word$neg$aux$($145, Bool$true));
                    var $146 = $147;
                } else {
                    var $148 = Word$i$(Word$neg$aux$($145, Bool$false));
                    var $146 = $148;
                };
                var $144 = $146;
                break;
            case 'Word.i':
                var $149 = self.pred;
                var self = _inc$3;
                if (self) {
                    var $151 = Word$i$(Word$neg$aux$($149, Bool$false));
                    var $150 = $151;
                } else {
                    var $152 = Word$o$(Word$neg$aux$($149, Bool$false));
                    var $150 = $152;
                };
                var $144 = $150;
                break;
            case 'Word.e':
                var $153 = Word$e;
                var $144 = $153;
                break;
        };
        return $144;
    };
    const Word$neg$aux = x0 => x1 => Word$neg$aux$(x0, x1);

    function Word$neg$(_word$2) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $155 = self.pred;
                var $156 = Word$o$(Word$neg$aux$($155, Bool$true));
                var $154 = $156;
                break;
            case 'Word.i':
                var $157 = self.pred;
                var $158 = Word$i$(Word$neg$aux$($157, Bool$false));
                var $154 = $158;
                break;
            case 'Word.e':
                var $159 = Word$e;
                var $154 = $159;
                break;
        };
        return $154;
    };
    const Word$neg = x0 => Word$neg$(x0);
    const I32$neg = a0 => ((-a0));
    const Int$to_i32 = a0 => (Number(a0));
    const Int$new = a0 => a1 => (a0 - a1);
    const Int$from_nat = a0 => (a0);
    const I32$from_nat = a0 => (Number(a0));

    function Cmp$as_eql$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
            case 'Cmp.gtn':
                var $161 = Bool$false;
                var $160 = $161;
                break;
            case 'Cmp.eql':
                var $162 = Bool$true;
                var $160 = $162;
                break;
        };
        return $160;
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
                var $164 = self.pred;
                var $165 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $167 = self.pred;
                            var $168 = (_a$pred$10 => {
                                var $169 = Word$cmp$go$(_a$pred$10, $167, _c$4);
                                return $169;
                            });
                            var $166 = $168;
                            break;
                        case 'Word.i':
                            var $170 = self.pred;
                            var $171 = (_a$pred$10 => {
                                var $172 = Word$cmp$go$(_a$pred$10, $170, Cmp$ltn);
                                return $172;
                            });
                            var $166 = $171;
                            break;
                        case 'Word.e':
                            var $173 = (_a$pred$8 => {
                                var $174 = _c$4;
                                return $174;
                            });
                            var $166 = $173;
                            break;
                    };
                    var $166 = $166($164);
                    return $166;
                });
                var $163 = $165;
                break;
            case 'Word.i':
                var $175 = self.pred;
                var $176 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $178 = self.pred;
                            var $179 = (_a$pred$10 => {
                                var $180 = Word$cmp$go$(_a$pred$10, $178, Cmp$gtn);
                                return $180;
                            });
                            var $177 = $179;
                            break;
                        case 'Word.i':
                            var $181 = self.pred;
                            var $182 = (_a$pred$10 => {
                                var $183 = Word$cmp$go$(_a$pred$10, $181, _c$4);
                                return $183;
                            });
                            var $177 = $182;
                            break;
                        case 'Word.e':
                            var $184 = (_a$pred$8 => {
                                var $185 = _c$4;
                                return $185;
                            });
                            var $177 = $184;
                            break;
                    };
                    var $177 = $177($175);
                    return $177;
                });
                var $163 = $176;
                break;
            case 'Word.e':
                var $186 = (_b$5 => {
                    var $187 = _c$4;
                    return $187;
                });
                var $163 = $186;
                break;
        };
        var $163 = $163(_b$3);
        return $163;
    };
    const Word$cmp$go = x0 => x1 => x2 => Word$cmp$go$(x0, x1, x2);
    const Cmp$eql = ({
        _: 'Cmp.eql'
    });

    function Word$cmp$(_a$2, _b$3) {
        var $188 = Word$cmp$go$(_a$2, _b$3, Cmp$eql);
        return $188;
    };
    const Word$cmp = x0 => x1 => Word$cmp$(x0, x1);

    function Word$eql$(_a$2, _b$3) {
        var $189 = Cmp$as_eql$(Word$cmp$(_a$2, _b$3));
        return $189;
    };
    const Word$eql = x0 => x1 => Word$eql$(x0, x1);
    const I32$eql = a0 => a1 => (a0 === a1);

    function Word$subber$(_a$2, _b$3, _c$4) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $191 = self.pred;
                var $192 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $194 = self.pred;
                            var $195 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $197 = Word$i$(Word$subber$(_a$pred$10, $194, Bool$true));
                                    var $196 = $197;
                                } else {
                                    var $198 = Word$o$(Word$subber$(_a$pred$10, $194, Bool$false));
                                    var $196 = $198;
                                };
                                return $196;
                            });
                            var $193 = $195;
                            break;
                        case 'Word.i':
                            var $199 = self.pred;
                            var $200 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $202 = Word$o$(Word$subber$(_a$pred$10, $199, Bool$true));
                                    var $201 = $202;
                                } else {
                                    var $203 = Word$i$(Word$subber$(_a$pred$10, $199, Bool$true));
                                    var $201 = $203;
                                };
                                return $201;
                            });
                            var $193 = $200;
                            break;
                        case 'Word.e':
                            var $204 = (_a$pred$8 => {
                                var $205 = Word$e;
                                return $205;
                            });
                            var $193 = $204;
                            break;
                    };
                    var $193 = $193($191);
                    return $193;
                });
                var $190 = $192;
                break;
            case 'Word.i':
                var $206 = self.pred;
                var $207 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $209 = self.pred;
                            var $210 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $212 = Word$o$(Word$subber$(_a$pred$10, $209, Bool$false));
                                    var $211 = $212;
                                } else {
                                    var $213 = Word$i$(Word$subber$(_a$pred$10, $209, Bool$false));
                                    var $211 = $213;
                                };
                                return $211;
                            });
                            var $208 = $210;
                            break;
                        case 'Word.i':
                            var $214 = self.pred;
                            var $215 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $217 = Word$i$(Word$subber$(_a$pred$10, $214, Bool$true));
                                    var $216 = $217;
                                } else {
                                    var $218 = Word$o$(Word$subber$(_a$pred$10, $214, Bool$false));
                                    var $216 = $218;
                                };
                                return $216;
                            });
                            var $208 = $215;
                            break;
                        case 'Word.e':
                            var $219 = (_a$pred$8 => {
                                var $220 = Word$e;
                                return $220;
                            });
                            var $208 = $219;
                            break;
                    };
                    var $208 = $208($206);
                    return $208;
                });
                var $190 = $207;
                break;
            case 'Word.e':
                var $221 = (_b$5 => {
                    var $222 = Word$e;
                    return $222;
                });
                var $190 = $221;
                break;
        };
        var $190 = $190(_b$3);
        return $190;
    };
    const Word$subber = x0 => x1 => x2 => Word$subber$(x0, x1, x2);

    function Word$sub$(_a$2, _b$3) {
        var $223 = Word$subber$(_a$2, _b$3, Bool$false);
        return $223;
    };
    const Word$sub = x0 => x1 => Word$sub$(x0, x1);
    const I32$sub = a0 => a1 => ((a0 - a1) >> 0);
    const Nat$ltn = a0 => a1 => (a0 < a1);
    const Nat$sub = a0 => a1 => (a0 - a1 <= 0n ? 0n : a0 - a1);

    function Cmp$as_gte$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
                var $225 = Bool$false;
                var $224 = $225;
                break;
            case 'Cmp.eql':
            case 'Cmp.gtn':
                var $226 = Bool$true;
                var $224 = $226;
                break;
        };
        return $224;
    };
    const Cmp$as_gte = x0 => Cmp$as_gte$(x0);

    function Word$gte$(_a$2, _b$3) {
        var $227 = Cmp$as_gte$(Word$cmp$(_a$2, _b$3));
        return $227;
    };
    const Word$gte = x0 => x1 => Word$gte$(x0, x1);

    function Pair$(_A$1, _B$2) {
        var $228 = null;
        return $228;
    };
    const Pair = x0 => x1 => Pair$(x0, x1);

    function Word$or$(_a$2, _b$3) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $230 = self.pred;
                var $231 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $233 = self.pred;
                            var $234 = (_a$pred$9 => {
                                var $235 = Word$o$(Word$or$(_a$pred$9, $233));
                                return $235;
                            });
                            var $232 = $234;
                            break;
                        case 'Word.i':
                            var $236 = self.pred;
                            var $237 = (_a$pred$9 => {
                                var $238 = Word$i$(Word$or$(_a$pred$9, $236));
                                return $238;
                            });
                            var $232 = $237;
                            break;
                        case 'Word.e':
                            var $239 = (_a$pred$7 => {
                                var $240 = Word$e;
                                return $240;
                            });
                            var $232 = $239;
                            break;
                    };
                    var $232 = $232($230);
                    return $232;
                });
                var $229 = $231;
                break;
            case 'Word.i':
                var $241 = self.pred;
                var $242 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $244 = self.pred;
                            var $245 = (_a$pred$9 => {
                                var $246 = Word$i$(Word$or$(_a$pred$9, $244));
                                return $246;
                            });
                            var $243 = $245;
                            break;
                        case 'Word.i':
                            var $247 = self.pred;
                            var $248 = (_a$pred$9 => {
                                var $249 = Word$i$(Word$or$(_a$pred$9, $247));
                                return $249;
                            });
                            var $243 = $248;
                            break;
                        case 'Word.e':
                            var $250 = (_a$pred$7 => {
                                var $251 = Word$e;
                                return $251;
                            });
                            var $243 = $250;
                            break;
                    };
                    var $243 = $243($241);
                    return $243;
                });
                var $229 = $242;
                break;
            case 'Word.e':
                var $252 = (_b$4 => {
                    var $253 = Word$e;
                    return $253;
                });
                var $229 = $252;
                break;
        };
        var $229 = $229(_b$3);
        return $229;
    };
    const Word$or = x0 => x1 => Word$or$(x0, x1);

    function Word$shift_right$one$go$(_word$2) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $255 = self.pred;
                var $256 = Word$o$(Word$shift_right$one$go$($255));
                var $254 = $256;
                break;
            case 'Word.i':
                var $257 = self.pred;
                var $258 = Word$i$(Word$shift_right$one$go$($257));
                var $254 = $258;
                break;
            case 'Word.e':
                var $259 = Word$o$(Word$e);
                var $254 = $259;
                break;
        };
        return $254;
    };
    const Word$shift_right$one$go = x0 => Word$shift_right$one$go$(x0);

    function Word$shift_right$one$(_word$2) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $261 = self.pred;
                var $262 = Word$shift_right$one$go$($261);
                var $260 = $262;
                break;
            case 'Word.i':
                var $263 = self.pred;
                var $264 = Word$shift_right$one$go$($263);
                var $260 = $264;
                break;
            case 'Word.e':
                var $265 = Word$e;
                var $260 = $265;
                break;
        };
        return $260;
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
                    var $266 = _value$3;
                    return $266;
                } else {
                    var $267 = (self - 1n);
                    var $268 = Word$shift_right$($267, Word$shift_right$one$(_value$3));
                    return $268;
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
    const I32$div = a0 => a1 => ((a0 / a1) >> 0);
    const F64$atan = a0 => (Math.atan(a0));

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
    const F64$read = a0 => (parseFloat(a0));

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
                        var $282 = self.pred;
                        var $283 = Word$is_neg$go$($282, Bool$false);
                        return $283;
                    case 'Word.i':
                        var $284 = self.pred;
                        var $285 = Word$is_neg$go$($284, Bool$true);
                        return $285;
                    case 'Word.e':
                        var $286 = _n$3;
                        return $286;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Word$is_neg$go = x0 => x1 => Word$is_neg$go$(x0, x1);

    function Word$is_neg$(_word$2) {
        var $287 = Word$is_neg$go$(_word$2, Bool$false);
        return $287;
    };
    const Word$is_neg = x0 => Word$is_neg$(x0);

    function Cmp$as_gtn$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
            case 'Cmp.eql':
                var $289 = Bool$false;
                var $288 = $289;
                break;
            case 'Cmp.gtn':
                var $290 = Bool$true;
                var $288 = $290;
                break;
        };
        return $288;
    };
    const Cmp$as_gtn = x0 => Cmp$as_gtn$(x0);

    function Cmp$inv$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
                var $292 = Cmp$gtn;
                var $291 = $292;
                break;
            case 'Cmp.eql':
                var $293 = Cmp$eql;
                var $291 = $293;
                break;
            case 'Cmp.gtn':
                var $294 = Cmp$ltn;
                var $291 = $294;
                break;
        };
        return $291;
    };
    const Cmp$inv = x0 => Cmp$inv$(x0);

    function Word$s_gtn$(_a$2, _b$3) {
        var _neg_a$4 = Word$is_neg$(_a$2);
        var _neg_b$5 = Word$is_neg$(_b$3);
        var self = _neg_a$4;
        if (self) {
            var self = _neg_b$5;
            if (self) {
                var $297 = Cmp$as_gtn$(Cmp$inv$(Word$cmp$(_a$2, _b$3)));
                var $296 = $297;
            } else {
                var $298 = Bool$false;
                var $296 = $298;
            };
            var $295 = $296;
        } else {
            var self = _neg_b$5;
            if (self) {
                var $300 = Bool$true;
                var $299 = $300;
            } else {
                var $301 = Cmp$as_gtn$(Word$cmp$(_a$2, _b$3));
                var $299 = $301;
            };
            var $295 = $299;
        };
        return $295;
    };
    const Word$s_gtn = x0 => x1 => Word$s_gtn$(x0, x1);
    const I32$gtn = a0 => a1 => (a0 > a1);
    const F64$make = a0 => a1 => a2 => (f64_make(a0, a1, a2));
    const F64$from_nat = a0 => (Number(a0));
    const F64$add = a0 => a1 => (a0 + a1);
    const F64$mul = a0 => a1 => (a0 * a1);
    const F64$div = a0 => a1 => (a0 / a1);
    const F64$cos = a0 => (Math.cos(a0));
    const F64$sin = a0 => (Math.sin(a0));

    function Word$fold$(_nil$3, _w0$4, _w1$5, _word$6) {
        var self = _word$6;
        switch (self._) {
            case 'Word.o':
                var $303 = self.pred;
                var $304 = _w0$4(Word$fold$(_nil$3, _w0$4, _w1$5, $303));
                var $302 = $304;
                break;
            case 'Word.i':
                var $305 = self.pred;
                var $306 = _w1$5(Word$fold$(_nil$3, _w0$4, _w1$5, $305));
                var $302 = $306;
                break;
            case 'Word.e':
                var $307 = _nil$3;
                var $302 = $307;
                break;
        };
        return $302;
    };
    const Word$fold = x0 => x1 => x2 => x3 => Word$fold$(x0, x1, x2, x3);
    const Nat$add = a0 => a1 => (a0 + a1);
    const Nat$mul = a0 => a1 => (a0 * a1);

    function Word$to_nat$(_word$2) {
        var $308 = Word$fold$(0n, a1 => (2n * a1), (_x$4 => {
            var $309 = Nat$succ$((2n * _x$4));
            return $309;
        }), _word$2);
        return $308;
    };
    const Word$to_nat = x0 => Word$to_nat$(x0);

    function Word$shl$(_n$2, _value$3) {
        var _n_nat$4 = Word$to_nat$(_n$2);
        var $310 = Word$shift_left$(_n_nat$4, _value$3);
        return $310;
    };
    const Word$shl = x0 => x1 => Word$shl$(x0, x1);

    function Word$shr$(_n$2, _value$3) {
        var _n_nat$4 = Word$to_nat$(_n$2);
        var $311 = Word$shift_right$(_n_nat$4, _value$3);
        return $311;
    };
    const Word$shr = x0 => x1 => Word$shr$(x0, x1);

    function Word$s_shr$(_n$2, _value$3) {
        var _neg$4 = Word$is_neg$(_n$2);
        var self = _neg$4;
        if (self) {
            var _n$5 = Word$neg$(_n$2);
            var $313 = Word$shl$(_n$5, _value$3);
            var $312 = $313;
        } else {
            var $314 = Word$shr$(_n$2, _value$3);
            var $312 = $314;
        };
        return $312;
    };
    const Word$s_shr = x0 => x1 => Word$s_shr$(x0, x1);
    const I32$shr = a0 => a1 => (a0 >> a1);

    function Word$xor$(_a$2, _b$3) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $316 = self.pred;
                var $317 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $319 = self.pred;
                            var $320 = (_a$pred$9 => {
                                var $321 = Word$o$(Word$xor$(_a$pred$9, $319));
                                return $321;
                            });
                            var $318 = $320;
                            break;
                        case 'Word.i':
                            var $322 = self.pred;
                            var $323 = (_a$pred$9 => {
                                var $324 = Word$i$(Word$xor$(_a$pred$9, $322));
                                return $324;
                            });
                            var $318 = $323;
                            break;
                        case 'Word.e':
                            var $325 = (_a$pred$7 => {
                                var $326 = Word$e;
                                return $326;
                            });
                            var $318 = $325;
                            break;
                    };
                    var $318 = $318($316);
                    return $318;
                });
                var $315 = $317;
                break;
            case 'Word.i':
                var $327 = self.pred;
                var $328 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $330 = self.pred;
                            var $331 = (_a$pred$9 => {
                                var $332 = Word$i$(Word$xor$(_a$pred$9, $330));
                                return $332;
                            });
                            var $329 = $331;
                            break;
                        case 'Word.i':
                            var $333 = self.pred;
                            var $334 = (_a$pred$9 => {
                                var $335 = Word$o$(Word$xor$(_a$pred$9, $333));
                                return $335;
                            });
                            var $329 = $334;
                            break;
                        case 'Word.e':
                            var $336 = (_a$pred$7 => {
                                var $337 = Word$e;
                                return $337;
                            });
                            var $329 = $336;
                            break;
                    };
                    var $329 = $329($327);
                    return $329;
                });
                var $315 = $328;
                break;
            case 'Word.e':
                var $338 = (_b$4 => {
                    var $339 = Word$e;
                    return $339;
                });
                var $315 = $338;
                break;
        };
        var $315 = $315(_b$3);
        return $315;
    };
    const Word$xor = x0 => x1 => Word$xor$(x0, x1);
    const I32$xor = a0 => a1 => (a0 ^ a1);
    const I32$add = a0 => a1 => ((a0 + a1) >> 0);

    function I32$abs$(_a$1) {
        var _mask$2 = (_a$1 >> 31);
        var $340 = (((_mask$2 + _a$1) >> 0) ^ _mask$2);
        return $340;
    };
    const I32$abs = x0 => I32$abs$(x0);

    function Cmp$as_ltn$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
                var $342 = Bool$true;
                var $341 = $342;
                break;
            case 'Cmp.eql':
            case 'Cmp.gtn':
                var $343 = Bool$false;
                var $341 = $343;
                break;
        };
        return $341;
    };
    const Cmp$as_ltn = x0 => Cmp$as_ltn$(x0);

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
    const I32$mul = a0 => a1 => ((a0 * a1) >> 0);

    function List$cons$(_head$2, _tail$3) {
        var $352 = ({
            _: 'List.cons',
            'head': _head$2,
            'tail': _tail$3
        });
        return $352;
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
                    var $353 = List$cons$(Pair$new$(_x0$1, _y0$2), _coords$9);
                    return $353;
                } else {
                    var _new_x$10 = ((1 + _x0$1) >> 0);
                    var self = (_d$8 > 0);
                    if (self) {
                        var _new_y$11 = ((_yi$5 + _y0$2) >> 0);
                        var _new_d$12 = ((_d$8 + ((2 * ((_dy$7 - _dx$6) >> 0)) >> 0)) >> 0);
                        var $355 = VoxBox$Draw$line$coords$low$go$(_new_x$10, _new_y$11, _x1$3, _y1$4, _yi$5, _dx$6, _dy$7, _new_d$12, List$cons$(Pair$new$(_x0$1, _y0$2), _coords$9));
                        var $354 = $355;
                    } else {
                        var _new_d$11 = ((_d$8 + ((2 * _dy$7) >> 0)) >> 0);
                        var $356 = VoxBox$Draw$line$coords$low$go$(_new_x$10, _y0$2, _x1$3, _y1$4, _yi$5, _dx$6, _dy$7, _new_d$11, List$cons$(Pair$new$(_x0$1, _y0$2), _coords$9));
                        var $354 = $356;
                    };
                    return $354;
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
            var $358 = 1;
            var _yi$7 = $358;
        } else {
            var $359 = ((-1));
            var _yi$7 = $359;
        };
        var _d$8 = ((((2 * _dy$6) >> 0) - _dx$5) >> 0);
        var $357 = VoxBox$Draw$line$coords$low$go$(_x0$1, _y0$2, _x1$3, _y1$4, _yi$7, _dx$5, _dy$6, _d$8, List$nil);
        return $357;
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
                    var $360 = List$cons$(Pair$new$(_x0$1, _y0$2), _coords$9);
                    return $360;
                } else {
                    var _new_y$10 = ((1 + _y0$2) >> 0);
                    var self = (_d$8 > 0);
                    if (self) {
                        var _new_x$11 = ((_x0$1 + _xi$5) >> 0);
                        var _new_d$12 = ((_d$8 + ((2 * ((_dx$6 - _dy$7) >> 0)) >> 0)) >> 0);
                        var $362 = VoxBox$Draw$line$coords$high$go$(_new_x$11, _new_y$10, _x1$3, _y1$4, _xi$5, _dx$6, _dy$7, _new_d$12, List$cons$(Pair$new$(_x0$1, _y0$2), _coords$9));
                        var $361 = $362;
                    } else {
                        var _new_d$11 = ((_d$8 + ((2 * _dx$6) >> 0)) >> 0);
                        var $363 = VoxBox$Draw$line$coords$high$go$(_x0$1, _new_y$10, _x1$3, _y1$4, _xi$5, _dx$6, _dy$7, _new_d$11, List$cons$(Pair$new$(_x0$1, _y0$2), _coords$9));
                        var $361 = $363;
                    };
                    return $361;
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
            var $365 = ((-1));
            var _xi$7 = $365;
        } else {
            var $366 = 1;
            var _xi$7 = $366;
        };
        var _d$8 = ((((2 * _dx$5) >> 0) - _dy$6) >> 0);
        var $364 = VoxBox$Draw$line$coords$high$go$(_x0$1, _y0$2, _x1$3, _y1$4, _xi$7, _dx$5, _dy$6, _d$8, List$nil);
        return $364;
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
                var $369 = VoxBox$Draw$line$coords$low$(_x1$3, _y1$4, _x0$1, _y0$2);
                var $368 = $369;
            } else {
                var $370 = VoxBox$Draw$line$coords$low$(_x0$1, _y0$2, _x1$3, _y1$4);
                var $368 = $370;
            };
            var $367 = $368;
        } else {
            var self = (_y0$2 > _y1$4);
            if (self) {
                var $372 = VoxBox$Draw$line$coords$high$(_x1$3, _y1$4, _x0$1, _y0$2);
                var $371 = $372;
            } else {
                var $373 = VoxBox$Draw$line$coords$high$(_x0$1, _y0$2, _x1$3, _y1$4);
                var $371 = $373;
            };
            var $367 = $371;
        };
        return $367;
    };
    const VoxBox$Draw$line$coords = x0 => x1 => x2 => x3 => VoxBox$Draw$line$coords$(x0, x1, x2, x3);
    const List$for = a0 => a1 => a2 => (list_for(a0)(a1)(a2));

    function Word$trim$(_new_size$2, _word$3) {
        var self = _new_size$2;
        if (self === 0n) {
            var $375 = Word$e;
            var $374 = $375;
        } else {
            var $376 = (self - 1n);
            var self = _word$3;
            switch (self._) {
                case 'Word.o':
                    var $378 = self.pred;
                    var $379 = Word$o$(Word$trim$($376, $378));
                    var $377 = $379;
                    break;
                case 'Word.i':
                    var $380 = self.pred;
                    var $381 = Word$i$(Word$trim$($376, $380));
                    var $377 = $381;
                    break;
                case 'Word.e':
                    var $382 = Word$o$(Word$trim$($376, Word$e));
                    var $377 = $382;
                    break;
            };
            var $374 = $377;
        };
        return $374;
    };
    const Word$trim = x0 => x1 => Word$trim$(x0, x1);
    const Unit$new = null;

    function Array$extract_tip$(_arr$2) {
        var self = _arr$2;
        switch (self._) {
            case 'Array.tip':
                var $384 = self.value;
                var $385 = $384;
                var $383 = $385;
                break;
            case 'Array.tie':
                var $386 = Unit$new;
                var $383 = $386;
                break;
        };
        return $383;
    };
    const Array$extract_tip = x0 => Array$extract_tip$(x0);

    function Array$extract_tie$(_arr$3) {
        var self = _arr$3;
        switch (self._) {
            case 'Array.tie':
                var $388 = self.lft;
                var $389 = self.rgt;
                var $390 = Pair$new$($388, $389);
                var $387 = $390;
                break;
            case 'Array.tip':
                var $391 = Unit$new;
                var $387 = $391;
                break;
        };
        return $387;
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
                        var $392 = self.pred;
                        var $393 = Word$foldl$(_w0$4(_nil$3), _w0$4, _w1$5, $392);
                        return $393;
                    case 'Word.i':
                        var $394 = self.pred;
                        var $395 = Word$foldl$(_w1$5(_nil$3), _w0$4, _w1$5, $394);
                        return $395;
                    case 'Word.e':
                        var $396 = _nil$3;
                        return $396;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Word$foldl = x0 => x1 => x2 => x3 => Word$foldl$(x0, x1, x2, x3);

    function Array$mut$(_idx$3, _f$4, _arr$5) {
        var $397 = Word$foldl$((_arr$6 => {
            var $398 = Array$tip$(_f$4(Array$extract_tip$(_arr$6)));
            return $398;
        }), (_rec$7 => _arr$8 => {
            var self = Array$extract_tie$(_arr$8);
            switch (self._) {
                case 'Pair.new':
                    var $400 = self.fst;
                    var $401 = self.snd;
                    var $402 = Array$tie$(_rec$7($400), $401);
                    var $399 = $402;
                    break;
            };
            return $399;
        }), (_rec$7 => _arr$8 => {
            var self = Array$extract_tie$(_arr$8);
            switch (self._) {
                case 'Pair.new':
                    var $404 = self.fst;
                    var $405 = self.snd;
                    var $406 = Array$tie$($404, _rec$7($405));
                    var $403 = $406;
                    break;
            };
            return $403;
        }), _idx$3)(_arr$5);
        return $397;
    };
    const Array$mut = x0 => x1 => x2 => Array$mut$(x0, x1, x2);

    function Array$set$(_idx$3, _val$4, _arr$5) {
        var $407 = Array$mut$(_idx$3, (_x$6 => {
            var $408 = _val$4;
            return $408;
        }), _arr$5);
        return $407;
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
                var $410 = self.capacity;
                var $411 = self.buffer;
                var $412 = VoxBox$new$(_length$1, $410, $411);
                var $409 = $412;
                break;
        };
        return $409;
    };
    const VoxBox$set_length = x0 => x1 => VoxBox$set_length$(x0, x1);
    const VoxBox$push = a0 => a1 => a2 => ((a2.buffer[a2.length * 2] = a0, a2.buffer[a2.length * 2 + 1] = a1, a2.length++, a2));
    const U32$or = a0 => a1 => (a0 | a1);
    const U32$shl = a0 => a1 => ((a0 << a1) >>> 0);
    const Pos32$new = a0 => a1 => a2 => ((0 | a0 | (a1 << 12) | (a2 << 24)));
    const F64$to_u32 = a0 => ((a0 >>> 0));

    function I32$to_u32$(_n$1) {
        var $413 = (((_n$1) >>> 0));
        return $413;
    };
    const I32$to_u32 = x0 => I32$to_u32$(x0);

    function VoxBox$Draw$line$(_x0$1, _y0$2, _x1$3, _y1$4, _z$5, _col$6, _img$7) {
        var _coords$8 = VoxBox$Draw$line$coords$(_x0$1, _y0$2, _x1$3, _y1$4);
        var _img$9 = (() => {
            var $416 = _img$7;
            var $417 = _coords$8;
            let _img$10 = $416;
            let _coord$9;
            while ($417._ === 'List.cons') {
                _coord$9 = $417.head;
                var self = _coord$9;
                switch (self._) {
                    case 'Pair.new':
                        var $418 = self.fst;
                        var $419 = self.snd;
                        var $420 = ((_img$10.buffer[_img$10.length * 2] = ((0 | I32$to_u32$($418) | (I32$to_u32$($419) << 12) | (I32$to_u32$(_z$5) << 24))), _img$10.buffer[_img$10.length * 2 + 1] = _col$6, _img$10.length++, _img$10));
                        var $416 = $420;
                        break;
                };
                _img$10 = $416;
                $417 = $417.tail;
            }
            return _img$10;
        })();
        var $414 = _img$9;
        return $414;
    };
    const VoxBox$Draw$line = x0 => x1 => x2 => x3 => x4 => x5 => x6 => VoxBox$Draw$line$(x0, x1, x2, x3, x4, x5, x6);
    const Col32$new = a0 => a1 => a2 => a3 => ((0 | a0 | (a1 << 8) | (a2 << 16) | (a3 << 24)));
    const U32$from_nat = a0 => (Number(a0) >>> 0);
    const F64$to_i32 = a0 => ((a0 >> 0));

    function transform$(_img$1) {
        var _x1$2 = 20;
        var _y1$3 = 70;
        var _x2$4 = 100;
        var _y2$5 = 100;
        var self = (((_x2$4 - _x1$2) >> 0) === 0);
        if (self) {
            var $422 = 0;
            var _m$6 = $422;
        } else {
            var $423 = ((((_y2$5 - _y1$3) >> 0) / ((_x2$4 - _x1$2) >> 0)) >> 0);
            var _m$6 = $423;
        };
        var _deg$7 = (Math.atan((_m$6)));
        var _pi$8 = (3.1415);
        var self = (_x2$4 > _x1$2);
        if (self) {
            var $424 = (Number(0n));
            var _toLeft$9 = $424;
        } else {
            var $425 = _pi$8;
            var _toLeft$9 = $425;
        };
        var _degree1$10 = (_toLeft$9 + (_deg$7 + ((Number(5n)) * (_pi$8 / (Number(6n))))));
        var _degree2$11 = (_toLeft$9 + (_deg$7 + ((Number(7n)) * (_pi$8 / (Number(6n))))));
        var _px1$12 = ((_x2$4) + ((Math.cos(_degree1$10)) * (Number(10n))));
        var _py1$13 = ((_y2$5) + ((Math.sin(_degree1$10)) * (Number(10n))));
        var _px2$14 = ((_x2$4) + ((Math.cos(_degree2$11)) * (Number(10n))));
        var _py2$15 = ((_y2$5) + ((Math.sin(_degree2$11)) * (Number(10n))));
        var _img$16 = VoxBox$Draw$line$(_x1$2, _y1$3, _x2$4, _y2$5, 0, ((0 | 0 | (0 << 8) | (0 << 16) | (255 << 24))), _img$1);
        var _img$17 = VoxBox$Draw$line$(_x2$4, _y2$5, ((_px1$12 >> 0)), ((_py1$13 >> 0)), 0, ((0 | 0 | (0 << 8) | (0 << 16) | (255 << 24))), _img$16);
        var _img$18 = VoxBox$Draw$line$(_x2$4, _y2$5, ((_px2$14 >> 0)), ((_py2$15 >> 0)), 0, ((0 | 0 | (0 << 8) | (0 << 16) | (255 << 24))), _img$17);
        var _img$19 = VoxBox$Draw$line$(((_px1$12 >> 0)), ((_py1$13 >> 0)), ((_px2$14 >> 0)), ((_py2$15 >> 0)), 0, ((0 | 0 | (0 << 8) | (0 << 16) | (255 << 24))), _img$18);
        var $421 = _img$19;
        return $421;
    };
    const transform = x0 => transform$(x0);

    function DOM$vbox$(_props$1, _style$2, _value$3) {
        var $426 = ({
            _: 'DOM.vbox',
            'props': _props$1,
            'style': _style$2,
            'value': _value$3
        });
        return $426;
    };
    const DOM$vbox = x0 => x1 => x2 => DOM$vbox$(x0, x1, x2);

    function BBL$(_K$1, _V$2) {
        var $427 = null;
        return $427;
    };
    const BBL = x0 => x1 => BBL$(x0, x1);

    function Pair$fst$(_pair$3) {
        var self = _pair$3;
        switch (self._) {
            case 'Pair.new':
                var $429 = self.fst;
                var $430 = $429;
                var $428 = $430;
                break;
        };
        return $428;
    };
    const Pair$fst = x0 => Pair$fst$(x0);

    function Pair$snd$(_pair$3) {
        var self = _pair$3;
        switch (self._) {
            case 'Pair.new':
                var $432 = self.snd;
                var $433 = $432;
                var $431 = $433;
                break;
        };
        return $431;
    };
    const Pair$snd = x0 => Pair$snd$(x0);

    function BBL$bin$(_size$3, _key$4, _val$5, _left$6, _right$7) {
        var $434 = ({
            _: 'BBL.bin',
            'size': _size$3,
            'key': _key$4,
            'val': _val$5,
            'left': _left$6,
            'right': _right$7
        });
        return $434;
    };
    const BBL$bin = x0 => x1 => x2 => x3 => x4 => BBL$bin$(x0, x1, x2, x3, x4);
    const BBL$tip = ({
        _: 'BBL.tip'
    });

    function BBL$singleton$(_key$3, _val$4) {
        var $435 = BBL$bin$(1, _key$3, _val$4, BBL$tip, BBL$tip);
        return $435;
    };
    const BBL$singleton = x0 => x1 => BBL$singleton$(x0, x1);

    function BBL$size$(_map$3) {
        var self = _map$3;
        switch (self._) {
            case 'BBL.bin':
                var $437 = self.size;
                var $438 = $437;
                var $436 = $438;
                break;
            case 'BBL.tip':
                var $439 = 0;
                var $436 = $439;
                break;
        };
        return $436;
    };
    const BBL$size = x0 => BBL$size$(x0);
    const BBL$w = 3;

    function Word$ltn$(_a$2, _b$3) {
        var $440 = Cmp$as_ltn$(Word$cmp$(_a$2, _b$3));
        return $440;
    };
    const Word$ltn = x0 => x1 => Word$ltn$(x0, x1);
    const U32$ltn = a0 => a1 => (a0 < a1);

    function BBL$node$(_key$3, _val$4, _left$5, _right$6) {
        var _size_left$7 = BBL$size$(_left$5);
        var _size_right$8 = BBL$size$(_right$6);
        var _new_size$9 = ((1 + ((_size_left$7 + _size_right$8) >>> 0)) >>> 0);
        var $441 = BBL$bin$(_new_size$9, _key$3, _val$4, _left$5, _right$6);
        return $441;
    };
    const BBL$node = x0 => x1 => x2 => x3 => BBL$node$(x0, x1, x2, x3);

    function Word$gtn$(_a$2, _b$3) {
        var $442 = Cmp$as_gtn$(Word$cmp$(_a$2, _b$3));
        return $442;
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
            var $444 = BBL$node$(_k$3, _v$4, _l$5, _r$6);
            var $443 = $444;
        } else {
            var self = (_size_r$8 > _w_x_size_l$10);
            if (self) {
                var self = _r$6;
                switch (self._) {
                    case 'BBL.bin':
                        var $447 = self.key;
                        var $448 = self.val;
                        var $449 = self.left;
                        var $450 = self.right;
                        var _size_rl$17 = BBL$size$($449);
                        var _size_rr$18 = BBL$size$($450);
                        var self = (_size_rl$17 < _size_rr$18);
                        if (self) {
                            var _new_key$19 = $447;
                            var _new_val$20 = $448;
                            var _new_left$21 = BBL$node$(_k$3, _v$4, _l$5, $449);
                            var _new_right$22 = $450;
                            var $452 = BBL$node$(_new_key$19, _new_val$20, _new_left$21, _new_right$22);
                            var $451 = $452;
                        } else {
                            var self = $449;
                            switch (self._) {
                                case 'BBL.bin':
                                    var $454 = self.key;
                                    var $455 = self.val;
                                    var $456 = self.left;
                                    var $457 = self.right;
                                    var _new_key$24 = $454;
                                    var _new_val$25 = $455;
                                    var _new_left$26 = BBL$node$(_k$3, _v$4, _l$5, $456);
                                    var _new_right$27 = BBL$node$($447, $448, $457, $450);
                                    var $458 = BBL$node$(_new_key$24, _new_val$25, _new_left$26, _new_right$27);
                                    var $453 = $458;
                                    break;
                                case 'BBL.tip':
                                    var $459 = BBL$node$(_k$3, _v$4, _l$5, _r$6);
                                    var $453 = $459;
                                    break;
                            };
                            var $451 = $453;
                        };
                        var $446 = $451;
                        break;
                    case 'BBL.tip':
                        var $460 = BBL$node$(_k$3, _v$4, _l$5, _r$6);
                        var $446 = $460;
                        break;
                };
                var $445 = $446;
            } else {
                var self = (_size_l$7 > _w_x_size_r$11);
                if (self) {
                    var self = _l$5;
                    switch (self._) {
                        case 'BBL.bin':
                            var $463 = self.key;
                            var $464 = self.val;
                            var $465 = self.left;
                            var $466 = self.right;
                            var _size_ll$17 = BBL$size$($465);
                            var _size_lr$18 = BBL$size$($466);
                            var self = (_size_lr$18 < _size_ll$17);
                            if (self) {
                                var _new_key$19 = $463;
                                var _new_val$20 = $464;
                                var _new_left$21 = $465;
                                var _new_right$22 = BBL$node$(_k$3, _v$4, $466, _r$6);
                                var $468 = BBL$node$(_new_key$19, _new_val$20, _new_left$21, _new_right$22);
                                var $467 = $468;
                            } else {
                                var self = $466;
                                switch (self._) {
                                    case 'BBL.bin':
                                        var $470 = self.key;
                                        var $471 = self.val;
                                        var $472 = self.left;
                                        var $473 = self.right;
                                        var _new_key$24 = $470;
                                        var _new_val$25 = $471;
                                        var _new_left$26 = BBL$node$($463, $464, $465, $472);
                                        var _new_right$27 = BBL$node$(_k$3, _v$4, $473, _r$6);
                                        var $474 = BBL$node$(_new_key$24, _new_val$25, _new_left$26, _new_right$27);
                                        var $469 = $474;
                                        break;
                                    case 'BBL.tip':
                                        var $475 = BBL$node$(_k$3, _v$4, _l$5, _r$6);
                                        var $469 = $475;
                                        break;
                                };
                                var $467 = $469;
                            };
                            var $462 = $467;
                            break;
                        case 'BBL.tip':
                            var $476 = BBL$node$(_k$3, _v$4, _l$5, _r$6);
                            var $462 = $476;
                            break;
                    };
                    var $461 = $462;
                } else {
                    var $477 = BBL$node$(_k$3, _v$4, _l$5, _r$6);
                    var $461 = $477;
                };
                var $445 = $461;
            };
            var $443 = $445;
        };
        return $443;
    };
    const BBL$balance = x0 => x1 => x2 => x3 => BBL$balance$(x0, x1, x2, x3);

    function BBL$insert$(_cmp$3, _key$4, _val$5, _map$6) {
        var self = _map$6;
        switch (self._) {
            case 'BBL.bin':
                var $479 = self.key;
                var $480 = self.val;
                var $481 = self.left;
                var $482 = self.right;
                var self = _cmp$3(_key$4)($479);
                switch (self._) {
                    case 'Cmp.ltn':
                        var _new_key$12 = $479;
                        var _new_val$13 = $480;
                        var _new_left$14 = BBL$insert$(_cmp$3, _key$4, _val$5, $481);
                        var _new_right$15 = $482;
                        var $484 = BBL$balance$(_new_key$12, _new_val$13, _new_left$14, _new_right$15);
                        var $483 = $484;
                        break;
                    case 'Cmp.eql':
                        var $485 = BBL$node$(_key$4, _val$5, $481, $482);
                        var $483 = $485;
                        break;
                    case 'Cmp.gtn':
                        var _new_key$12 = $479;
                        var _new_val$13 = $480;
                        var _new_left$14 = $481;
                        var _new_right$15 = BBL$insert$(_cmp$3, _key$4, _val$5, $482);
                        var $486 = BBL$balance$(_new_key$12, _new_val$13, _new_left$14, _new_right$15);
                        var $483 = $486;
                        break;
                };
                var $478 = $483;
                break;
            case 'BBL.tip':
                var $487 = BBL$singleton$(_key$4, _val$5);
                var $478 = $487;
                break;
        };
        return $478;
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
                        var $488 = self.head;
                        var $489 = self.tail;
                        var _key$8 = Pair$fst$($488);
                        var _val$9 = Pair$snd$($488);
                        var _new_acc$10 = BBL$insert$(_cmp$3, _key$8, _val$9, _acc$4);
                        var $490 = BBL$from_list$go$(_cmp$3, _new_acc$10, $489);
                        return $490;
                    case 'List.nil':
                        var $491 = _acc$4;
                        return $491;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const BBL$from_list$go = x0 => x1 => x2 => BBL$from_list$go$(x0, x1, x2);

    function BBL$from_list$(_cmp$3, _xs$4) {
        var $492 = BBL$from_list$go$(_cmp$3, BBL$tip, _xs$4);
        return $492;
    };
    const BBL$from_list = x0 => x1 => BBL$from_list$(x0, x1);
    const U16$ltn = a0 => a1 => (a0 < a1);
    const U16$eql = a0 => a1 => (a0 === a1);

    function U16$cmp$(_a$1, _b$2) {
        var self = (_a$1 < _b$2);
        if (self) {
            var $494 = Cmp$ltn;
            var $493 = $494;
        } else {
            var self = (_a$1 === _b$2);
            if (self) {
                var $496 = Cmp$eql;
                var $495 = $496;
            } else {
                var $497 = Cmp$gtn;
                var $495 = $497;
            };
            var $493 = $495;
        };
        return $493;
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
                        var $499 = Cmp$eql;
                        var $498 = $499;
                    } else {
                        var $500 = self.charCodeAt(0);
                        var $501 = self.slice(1);
                        var $502 = Cmp$ltn;
                        var $498 = $502;
                    };
                    return $498;
                } else {
                    var $503 = self.charCodeAt(0);
                    var $504 = self.slice(1);
                    var self = _b$2;
                    if (self.length === 0) {
                        var $506 = Cmp$gtn;
                        var $505 = $506;
                    } else {
                        var $507 = self.charCodeAt(0);
                        var $508 = self.slice(1);
                        var self = U16$cmp$($503, $507);
                        switch (self._) {
                            case 'Cmp.ltn':
                                var $510 = Cmp$ltn;
                                var $509 = $510;
                                break;
                            case 'Cmp.eql':
                                var $511 = String$cmp$($504, $508);
                                var $509 = $511;
                                break;
                            case 'Cmp.gtn':
                                var $512 = Cmp$gtn;
                                var $509 = $512;
                                break;
                        };
                        var $505 = $509;
                    };
                    return $505;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const String$cmp = x0 => x1 => String$cmp$(x0, x1);

    function Map$from_list$(_xs$2) {
        var $513 = BBL$from_list$(String$cmp, _xs$2);
        return $513;
    };
    const Map$from_list = x0 => Map$from_list$(x0);

    function App$Seta$draw$(_img$1, _state$2) {
        var _img$3 = transform$(_img$1);
        var $514 = DOM$vbox$(Map$from_list$(List$cons$(Pair$new$("id", "game_screen"), List$cons$(Pair$new$("width", "500px"), List$cons$(Pair$new$("height", "500px"), List$cons$(Pair$new$("scale", "2"), List$nil))))), Map$from_list$(List$nil), _img$3);
        return $514;
    };
    const App$Seta$draw = x0 => x1 => App$Seta$draw$(x0, x1);

    function IO$(_A$1) {
        var $515 = null;
        return $515;
    };
    const IO = x0 => IO$(x0);

    function Maybe$(_A$1) {
        var $516 = null;
        return $516;
    };
    const Maybe = x0 => Maybe$(x0);
    const App$State$local = Pair$fst;

    function IO$ask$(_query$2, _param$3, _then$4) {
        var $517 = ({
            _: 'IO.ask',
            'query': _query$2,
            'param': _param$3,
            'then': _then$4
        });
        return $517;
    };
    const IO$ask = x0 => x1 => x2 => IO$ask$(x0, x1, x2);

    function IO$bind$(_a$3, _f$4) {
        var self = _a$3;
        switch (self._) {
            case 'IO.end':
                var $519 = self.value;
                var $520 = _f$4($519);
                var $518 = $520;
                break;
            case 'IO.ask':
                var $521 = self.query;
                var $522 = self.param;
                var $523 = self.then;
                var $524 = IO$ask$($521, $522, (_x$8 => {
                    var $525 = IO$bind$($523(_x$8), _f$4);
                    return $525;
                }));
                var $518 = $524;
                break;
        };
        return $518;
    };
    const IO$bind = x0 => x1 => IO$bind$(x0, x1);

    function IO$end$(_value$2) {
        var $526 = ({
            _: 'IO.end',
            'value': _value$2
        });
        return $526;
    };
    const IO$end = x0 => IO$end$(x0);

    function IO$monad$(_new$2) {
        var $527 = _new$2(IO$bind)(IO$end);
        return $527;
    };
    const IO$monad = x0 => IO$monad$(x0);

    function IO$do$(_call$1, _param$2) {
        var $528 = IO$ask$(_call$1, _param$2, (_answer$3 => {
            var $529 = IO$end$(Unit$new);
            return $529;
        }));
        return $528;
    };
    const IO$do = x0 => x1 => IO$do$(x0, x1);
    const Maybe$none = ({
        _: 'Maybe.none'
    });
    const App$pass = IO$monad$((_m$bind$2 => _m$pure$3 => {
        var $530 = _m$pure$3;
        return $530;
    }))(Maybe$none);

    function App$do$(_call$2, _param$3) {
        var $531 = IO$monad$((_m$bind$4 => _m$pure$5 => {
            var $532 = _m$bind$4;
            return $532;
        }))(IO$do$(_call$2, _param$3))((_$4 => {
            var $533 = App$pass;
            return $533;
        }));
        return $531;
    };
    const App$do = x0 => x1 => App$do$(x0, x1);

    function App$watch$(_room$2) {
        var $534 = App$do$("watch", _room$2);
        return $534;
    };
    const App$watch = x0 => App$watch$(x0);
    const App$room_zero = "0x00000000000000";

    function String$cons$(_head$1, _tail$2) {
        var $535 = (String.fromCharCode(_head$1) + _tail$2);
        return $535;
    };
    const String$cons = x0 => x1 => String$cons$(x0, x1);
    const String$concat = a0 => a1 => (a0 + a1);

    function App$new_post$(_room$2, _data$3) {
        var $536 = IO$monad$((_m$bind$4 => _m$pure$5 => {
            var $537 = _m$bind$4;
            return $537;
        }))(App$do$("post", (_room$2 + (";" + _data$3))))((_$4 => {
            var $538 = App$pass;
            return $538;
        }));
        return $536;
    };
    const App$new_post = x0 => x1 => App$new_post$(x0, x1);
    const App$empty_post = "0x0000000000000000000000000000000000000000000000000000000000000000";

    function Maybe$some$(_value$2) {
        var $539 = ({
            _: 'Maybe.some',
            'value': _value$2
        });
        return $539;
    };
    const Maybe$some = x0 => Maybe$some$(x0);

    function App$set_local$(_value$2) {
        var $540 = IO$monad$((_m$bind$3 => _m$pure$4 => {
            var $541 = _m$pure$4;
            return $541;
        }))(Maybe$some$(_value$2));
        return $540;
    };
    const App$set_local = x0 => App$set_local$(x0);

    function App$Seta$when$(_event$1, _state$2) {
        var self = _event$1;
        switch (self._) {
            case 'App.Event.init':
                var $543 = IO$monad$((_m$bind$6 => _m$pure$7 => {
                    var $544 = _m$bind$6;
                    return $544;
                }))(App$watch$(App$room_zero))((_$6 => {
                    var $545 = App$new_post$(App$room_zero, App$empty_post);
                    return $545;
                }));
                var $542 = $543;
                break;
            case 'App.Event.frame':
            case 'App.Event.mouse_up':
            case 'App.Event.key_down':
            case 'App.Event.key_up':
            case 'App.Event.mouse_move':
            case 'App.Event.mouse_over':
            case 'App.Event.mouse_click':
            case 'App.Event.input':
                var $546 = App$pass;
                var $542 = $546;
                break;
            case 'App.Event.mouse_down':
                var $547 = App$set_local$(((() => {
                    var self = _state$2;
                    switch (self._) {
                        case 'App.Store.new':
                            var $548 = self.local;
                            var $549 = $548;
                            return $549;
                    };
                })() + 1n));
                var $542 = $547;
                break;
        };
        return $542;
    };
    const App$Seta$when = x0 => x1 => App$Seta$when$(x0, x1);

    function App$no_tick$(_tick$2, _glob$3) {
        var $550 = _glob$3;
        return $550;
    };
    const App$no_tick = x0 => x1 => App$no_tick$(x0, x1);
    const App$Seta$tick = App$no_tick;

    function App$Seta$post$(_time$1, _room$2, _addr$3, _data$4, _global_state$5) {
        var $551 = (_global_state$5 + 1n);
        return $551;
    };
    const App$Seta$post = x0 => x1 => x2 => x3 => x4 => App$Seta$post$(x0, x1, x2, x3, x4);
    const App$Seta = (() => {
        var _img$1 = VoxBox$alloc_capacity$(((65536 * 8) >>> 0));
        var $552 = App$new$(App$Seta$init, App$Seta$draw(_img$1), App$Seta$when, App$Seta$tick, App$Seta$post);
        return $552;
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
        'App.Seta.State': App$Seta$State,
        'App.Store.new': App$Store$new,
        'App.Seta.init': App$Seta$init,
        'I32.new': I32$new,
        'Word.neg.aux': Word$neg$aux,
        'Word.neg': Word$neg,
        'I32.neg': I32$neg,
        'Int.to_i32': Int$to_i32,
        'Int.new': Int$new,
        'Int.from_nat': Int$from_nat,
        'I32.from_nat': I32$from_nat,
        'Cmp.as_eql': Cmp$as_eql,
        'Cmp.ltn': Cmp$ltn,
        'Cmp.gtn': Cmp$gtn,
        'Word.cmp.go': Word$cmp$go,
        'Cmp.eql': Cmp$eql,
        'Word.cmp': Word$cmp,
        'Word.eql': Word$eql,
        'I32.eql': I32$eql,
        'Word.subber': Word$subber,
        'Word.sub': Word$sub,
        'I32.sub': I32$sub,
        'Nat.ltn': Nat$ltn,
        'Nat.sub': Nat$sub,
        'Cmp.as_gte': Cmp$as_gte,
        'Word.gte': Word$gte,
        'Pair': Pair,
        'Word.or': Word$or,
        'Word.shift_right.one.go': Word$shift_right$one$go,
        'Word.shift_right.one': Word$shift_right$one,
        'Word.shift_right': Word$shift_right,
        'Word.div.go': Word$div$go,
        'Word.div': Word$div,
        'I32.div': I32$div,
        'F64.atan': F64$atan,
        'Word.s_to_f64': Word$s_to_f64,
        'I32.to_f64': I32$to_f64,
        'F64.read': F64$read,
        'Word.is_neg.go': Word$is_neg$go,
        'Word.is_neg': Word$is_neg,
        'Cmp.as_gtn': Cmp$as_gtn,
        'Cmp.inv': Cmp$inv,
        'Word.s_gtn': Word$s_gtn,
        'I32.gtn': I32$gtn,
        'F64.make': F64$make,
        'F64.from_nat': F64$from_nat,
        'F64.add': F64$add,
        'F64.mul': F64$mul,
        'F64.div': F64$div,
        'F64.cos': F64$cos,
        'F64.sin': F64$sin,
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
        'Cmp.as_ltn': Cmp$as_ltn,
        'Word.s_ltn': Word$s_ltn,
        'I32.ltn': I32$ltn,
        'List': List,
        'I32.mul': I32$mul,
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
        'I32.to_u32': I32$to_u32,
        'VoxBox.Draw.line': VoxBox$Draw$line,
        'Col32.new': Col32$new,
        'U32.from_nat': U32$from_nat,
        'F64.to_i32': F64$to_i32,
        'transform': transform,
        'DOM.vbox': DOM$vbox,
        'BBL': BBL,
        'Pair.fst': Pair$fst,
        'Pair.snd': Pair$snd,
        'BBL.bin': BBL$bin,
        'BBL.tip': BBL$tip,
        'BBL.singleton': BBL$singleton,
        'BBL.size': BBL$size,
        'BBL.w': BBL$w,
        'Word.ltn': Word$ltn,
        'U32.ltn': U32$ltn,
        'BBL.node': BBL$node,
        'Word.gtn': Word$gtn,
        'U32.gtn': U32$gtn,
        'BBL.balance': BBL$balance,
        'BBL.insert': BBL$insert,
        'BBL.from_list.go': BBL$from_list$go,
        'BBL.from_list': BBL$from_list,
        'U16.ltn': U16$ltn,
        'U16.eql': U16$eql,
        'U16.cmp': U16$cmp,
        'String.cmp': String$cmp,
        'Map.from_list': Map$from_list,
        'App.Seta.draw': App$Seta$draw,
        'IO': IO,
        'Maybe': Maybe,
        'App.State.local': App$State$local,
        'IO.ask': IO$ask,
        'IO.bind': IO$bind,
        'IO.end': IO$end,
        'IO.monad': IO$monad,
        'IO.do': IO$do,
        'Maybe.none': Maybe$none,
        'App.pass': App$pass,
        'App.do': App$do,
        'App.watch': App$watch,
        'App.room_zero': App$room_zero,
        'String.cons': String$cons,
        'String.concat': String$concat,
        'App.new_post': App$new_post,
        'App.empty_post': App$empty_post,
        'Maybe.some': Maybe$some,
        'App.set_local': App$set_local,
        'App.Seta.when': App$Seta$when,
        'App.no_tick': App$no_tick,
        'App.Seta.tick': App$Seta$tick,
        'App.Seta.post': App$Seta$post,
        'App.Seta': App$Seta,
    };
})();

/***/ })

}]);
//# sourceMappingURL=415.index.js.map