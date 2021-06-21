(self["webpackChunkkind_web"] = self["webpackChunkkind_web"] || []).push([[373],{

/***/ 373:
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
    var list_length = list => {
        var len = 0;
        while (list._ === 'List.cons') {
            len += 1;
            list = list.tail;
        };
        return BigInt(len);
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

    function App$Store$new$(_local$2, _global$3) {
        var $140 = ({
            _: 'App.Store.new',
            'local': _local$2,
            'global': _global$3
        });
        return $140;
    };
    const App$Store$new = x0 => x1 => App$Store$new$(x0, x1);

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
    const App$TicTacToe$State = App$State$new;

    function App$TicTacToe$State$local$new$(_board$1, _player$2, _line$3, _info$4) {
        var $142 = ({
            _: 'App.TicTacToe.State.local.new',
            'board': _board$1,
            'player': _player$2,
            'line': _line$3,
            'info': _info$4
        });
        return $142;
    };
    const App$TicTacToe$State$local$new = x0 => x1 => x2 => x3 => App$TicTacToe$State$local$new$(x0, x1, x2, x3);

    function Vector$(_A$1, _len$2) {
        var $143 = null;
        return $143;
    };
    const Vector = x0 => x1 => Vector$(x0, x1);

    function Vector$nil$(_A$1, _self$2, _nil$3) {
        var $144 = _nil$3;
        return $144;
    };
    const Vector$nil = x0 => x1 => x2 => Vector$nil$(x0, x1, x2);

    function Vector$cons$(_A$1, _len$2, _head$3, _tail$4, _self$5, _cons$6) {
        var $145 = _cons$6(_head$3)(_tail$4);
        return $145;
    };
    const Vector$cons = x0 => x1 => x2 => x3 => x4 => x5 => Vector$cons$(x0, x1, x2, x3, x4, x5);

    function Vector$fill$(_A$1, _size$2, _x$3) {
        var self = _size$2;
        if (self === 0n) {
            var $147 = Vector$nil(null);
            var $146 = $147;
        } else {
            var $148 = (self - 1n);
            var _pred$5 = Vector$fill$(null, $148, _x$3);
            var $149 = Vector$cons(null)($148)(_x$3)(_pred$5);
            var $146 = $149;
        };
        return $146;
    };
    const Vector$fill = x0 => x1 => x2 => Vector$fill$(x0, x1, x2);

    function Maybe$(_A$1) {
        var $150 = null;
        return $150;
    };
    const Maybe = x0 => Maybe$(x0);
    const Maybe$none = ({
        _: 'Maybe.none'
    });
    const App$TicTacToe$Entity$x = ({
        _: 'App.TicTacToe.Entity.x'
    });

    function Pair$(_A$1, _B$2) {
        var $151 = null;
        return $151;
    };
    const Pair = x0 => x1 => Pair$(x0, x1);

    function App$EnvInfo$new$(_screen_size$1, _mouse_pos$2) {
        var $152 = ({
            _: 'App.EnvInfo.new',
            'screen_size': _screen_size$1,
            'mouse_pos': _mouse_pos$2
        });
        return $152;
    };
    const App$EnvInfo$new = x0 => x1 => App$EnvInfo$new$(x0, x1);
    const U32$from_nat = a0 => (Number(a0) >>> 0);
    const App$TicTacToe$State$global$new = ({
        _: 'App.TicTacToe.State.global.new'
    });
    const App$TicTacToe$init = App$Store$new$(App$TicTacToe$State$local$new$(Vector$fill$(null, 9n, Maybe$none), App$TicTacToe$Entity$x, Maybe$none, App$EnvInfo$new$(Pair$new$(0, 0), Pair$new$(0, 0))), App$TicTacToe$State$global$new);

    function I32$new$(_value$1) {
        var $153 = word_to_i32(_value$1);
        return $153;
    };
    const I32$new = x0 => I32$new$(x0);
    const Nat$ltn = a0 => a1 => (a0 < a1);
    const Nat$sub = a0 => a1 => (a0 - a1 <= 0n ? 0n : a0 - a1);

    function Cmp$as_gte$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
                var $155 = Bool$false;
                var $154 = $155;
                break;
            case 'Cmp.eql':
            case 'Cmp.gtn':
                var $156 = Bool$true;
                var $154 = $156;
                break;
        };
        return $154;
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

    function Word$gte$(_a$2, _b$3) {
        var $183 = Cmp$as_gte$(Word$cmp$(_a$2, _b$3));
        return $183;
    };
    const Word$gte = x0 => x1 => Word$gte$(x0, x1);

    function Word$or$(_a$2, _b$3) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $185 = self.pred;
                var $186 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $188 = self.pred;
                            var $189 = (_a$pred$9 => {
                                var $190 = Word$o$(Word$or$(_a$pred$9, $188));
                                return $190;
                            });
                            var $187 = $189;
                            break;
                        case 'Word.i':
                            var $191 = self.pred;
                            var $192 = (_a$pred$9 => {
                                var $193 = Word$i$(Word$or$(_a$pred$9, $191));
                                return $193;
                            });
                            var $187 = $192;
                            break;
                        case 'Word.e':
                            var $194 = (_a$pred$7 => {
                                var $195 = Word$e;
                                return $195;
                            });
                            var $187 = $194;
                            break;
                    };
                    var $187 = $187($185);
                    return $187;
                });
                var $184 = $186;
                break;
            case 'Word.i':
                var $196 = self.pred;
                var $197 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $199 = self.pred;
                            var $200 = (_a$pred$9 => {
                                var $201 = Word$i$(Word$or$(_a$pred$9, $199));
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
                var $184 = $197;
                break;
            case 'Word.e':
                var $207 = (_b$4 => {
                    var $208 = Word$e;
                    return $208;
                });
                var $184 = $207;
                break;
        };
        var $184 = $184(_b$3);
        return $184;
    };
    const Word$or = x0 => x1 => Word$or$(x0, x1);

    function Word$shift_right$one$go$(_word$2) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $210 = self.pred;
                var $211 = Word$o$(Word$shift_right$one$go$($210));
                var $209 = $211;
                break;
            case 'Word.i':
                var $212 = self.pred;
                var $213 = Word$i$(Word$shift_right$one$go$($212));
                var $209 = $213;
                break;
            case 'Word.e':
                var $214 = Word$o$(Word$e);
                var $209 = $214;
                break;
        };
        return $209;
    };
    const Word$shift_right$one$go = x0 => Word$shift_right$one$go$(x0);

    function Word$shift_right$one$(_word$2) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $216 = self.pred;
                var $217 = Word$shift_right$one$go$($216);
                var $215 = $217;
                break;
            case 'Word.i':
                var $218 = self.pred;
                var $219 = Word$shift_right$one$go$($218);
                var $215 = $219;
                break;
            case 'Word.e':
                var $220 = Word$e;
                var $215 = $220;
                break;
        };
        return $215;
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
                    var $221 = _value$3;
                    return $221;
                } else {
                    var $222 = (self - 1n);
                    var $223 = Word$shift_right$($222, Word$shift_right$one$(_value$3));
                    return $223;
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
                var $225 = self.pred;
                var $226 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $228 = self.pred;
                            var $229 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $231 = Word$i$(Word$subber$(_a$pred$10, $228, Bool$true));
                                    var $230 = $231;
                                } else {
                                    var $232 = Word$o$(Word$subber$(_a$pred$10, $228, Bool$false));
                                    var $230 = $232;
                                };
                                return $230;
                            });
                            var $227 = $229;
                            break;
                        case 'Word.i':
                            var $233 = self.pred;
                            var $234 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $236 = Word$o$(Word$subber$(_a$pred$10, $233, Bool$true));
                                    var $235 = $236;
                                } else {
                                    var $237 = Word$i$(Word$subber$(_a$pred$10, $233, Bool$true));
                                    var $235 = $237;
                                };
                                return $235;
                            });
                            var $227 = $234;
                            break;
                        case 'Word.e':
                            var $238 = (_a$pred$8 => {
                                var $239 = Word$e;
                                return $239;
                            });
                            var $227 = $238;
                            break;
                    };
                    var $227 = $227($225);
                    return $227;
                });
                var $224 = $226;
                break;
            case 'Word.i':
                var $240 = self.pred;
                var $241 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $243 = self.pred;
                            var $244 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $246 = Word$o$(Word$subber$(_a$pred$10, $243, Bool$false));
                                    var $245 = $246;
                                } else {
                                    var $247 = Word$i$(Word$subber$(_a$pred$10, $243, Bool$false));
                                    var $245 = $247;
                                };
                                return $245;
                            });
                            var $242 = $244;
                            break;
                        case 'Word.i':
                            var $248 = self.pred;
                            var $249 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $251 = Word$i$(Word$subber$(_a$pred$10, $248, Bool$true));
                                    var $250 = $251;
                                } else {
                                    var $252 = Word$o$(Word$subber$(_a$pred$10, $248, Bool$false));
                                    var $250 = $252;
                                };
                                return $250;
                            });
                            var $242 = $249;
                            break;
                        case 'Word.e':
                            var $253 = (_a$pred$8 => {
                                var $254 = Word$e;
                                return $254;
                            });
                            var $242 = $253;
                            break;
                    };
                    var $242 = $242($240);
                    return $242;
                });
                var $224 = $241;
                break;
            case 'Word.e':
                var $255 = (_b$5 => {
                    var $256 = Word$e;
                    return $256;
                });
                var $224 = $255;
                break;
        };
        var $224 = $224(_b$3);
        return $224;
    };
    const Word$subber = x0 => x1 => x2 => Word$subber$(x0, x1, x2);

    function Word$sub$(_a$2, _b$3) {
        var $257 = Word$subber$(_a$2, _b$3, Bool$false);
        return $257;
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
                    var $258 = Pair$new$(Bool$true, Word$or$(_value$5, _mask$6));
                    var self = $258;
                } else {
                    var $259 = Pair$new$(Bool$false, _value$5);
                    var self = $259;
                };
                switch (self._) {
                    case 'Pair.new':
                        var $260 = self.fst;
                        var $261 = self.snd;
                        var self = _shift$2;
                        if (self === 0n) {
                            var $263 = $261;
                            var $262 = $263;
                        } else {
                            var $264 = (self - 1n);
                            var _new_shift_copy$9 = Word$shift_right$(1n, _shift_copy$4);
                            var self = $260;
                            if (self) {
                                var $266 = Word$div$go$($264, Word$sub$(_sub_copy$3, _shift_copy$4), _new_shift_copy$9, $261);
                                var $265 = $266;
                            } else {
                                var $267 = Word$div$go$($264, _sub_copy$3, _new_shift_copy$9, $261);
                                var $265 = $267;
                            };
                            var $262 = $265;
                        };
                        return $262;
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
            var $269 = Word$to_zero$(_a$2);
            var $268 = $269;
        } else {
            var _shift$6 = (_a_bits$4 - _b_bits$5 <= 0n ? 0n : _a_bits$4 - _b_bits$5);
            var _shift_copy$7 = Word$shift_left$(_shift$6, _b$3);
            var $270 = Word$div$go$(_shift$6, _a$2, _shift_copy$7, Word$to_zero$(_a$2));
            var $268 = $270;
        };
        return $268;
    };
    const Word$div = x0 => x1 => Word$div$(x0, x1);
    const I32$div = a0 => a1 => ((a0 / a1) >> 0);
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
    const U32$to_i32 = a0 => (a0);
    const App$TicTacToe$constant$size = 256;
    const side_board = (App$TicTacToe$constant$size);

    function Word$neg$aux$(_word$2, _inc$3) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $272 = self.pred;
                var self = _inc$3;
                if (self) {
                    var $274 = Word$o$(Word$neg$aux$($272, Bool$true));
                    var $273 = $274;
                } else {
                    var $275 = Word$i$(Word$neg$aux$($272, Bool$false));
                    var $273 = $275;
                };
                var $271 = $273;
                break;
            case 'Word.i':
                var $276 = self.pred;
                var self = _inc$3;
                if (self) {
                    var $278 = Word$i$(Word$neg$aux$($276, Bool$false));
                    var $277 = $278;
                } else {
                    var $279 = Word$o$(Word$neg$aux$($276, Bool$false));
                    var $277 = $279;
                };
                var $271 = $277;
                break;
            case 'Word.e':
                var $280 = Word$e;
                var $271 = $280;
                break;
        };
        return $271;
    };
    const Word$neg$aux = x0 => x1 => Word$neg$aux$(x0, x1);

    function Word$neg$(_word$2) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $282 = self.pred;
                var $283 = Word$o$(Word$neg$aux$($282, Bool$true));
                var $281 = $283;
                break;
            case 'Word.i':
                var $284 = self.pred;
                var $285 = Word$i$(Word$neg$aux$($284, Bool$false));
                var $281 = $285;
                break;
            case 'Word.e':
                var $286 = Word$e;
                var $281 = $286;
                break;
        };
        return $281;
    };
    const Word$neg = x0 => Word$neg$(x0);
    const I32$neg = a0 => ((-a0));
    const Int$to_i32 = a0 => (Number(a0));
    const Int$new = a0 => a1 => (a0 - a1);
    const Int$from_nat = a0 => (a0);
    const I32$from_nat = a0 => (Number(a0));

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
                        var $287 = self.pred;
                        var $288 = Word$is_neg$go$($287, Bool$false);
                        return $288;
                    case 'Word.i':
                        var $289 = self.pred;
                        var $290 = Word$is_neg$go$($289, Bool$true);
                        return $290;
                    case 'Word.e':
                        var $291 = _n$3;
                        return $291;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Word$is_neg$go = x0 => x1 => Word$is_neg$go$(x0, x1);

    function Word$is_neg$(_word$2) {
        var $292 = Word$is_neg$go$(_word$2, Bool$false);
        return $292;
    };
    const Word$is_neg = x0 => Word$is_neg$(x0);

    function Word$fold$(_nil$3, _w0$4, _w1$5, _word$6) {
        var self = _word$6;
        switch (self._) {
            case 'Word.o':
                var $294 = self.pred;
                var $295 = _w0$4(Word$fold$(_nil$3, _w0$4, _w1$5, $294));
                var $293 = $295;
                break;
            case 'Word.i':
                var $296 = self.pred;
                var $297 = _w1$5(Word$fold$(_nil$3, _w0$4, _w1$5, $296));
                var $293 = $297;
                break;
            case 'Word.e':
                var $298 = _nil$3;
                var $293 = $298;
                break;
        };
        return $293;
    };
    const Word$fold = x0 => x1 => x2 => x3 => Word$fold$(x0, x1, x2, x3);
    const Nat$add = a0 => a1 => (a0 + a1);
    const Nat$mul = a0 => a1 => (a0 * a1);

    function Word$to_nat$(_word$2) {
        var $299 = Word$fold$(0n, a1 => (2n * a1), (_x$4 => {
            var $300 = Nat$succ$((2n * _x$4));
            return $300;
        }), _word$2);
        return $299;
    };
    const Word$to_nat = x0 => Word$to_nat$(x0);

    function Word$shl$(_n$2, _value$3) {
        var _n_nat$4 = Word$to_nat$(_n$2);
        var $301 = Word$shift_left$(_n_nat$4, _value$3);
        return $301;
    };
    const Word$shl = x0 => x1 => Word$shl$(x0, x1);

    function Word$shr$(_n$2, _value$3) {
        var _n_nat$4 = Word$to_nat$(_n$2);
        var $302 = Word$shift_right$(_n_nat$4, _value$3);
        return $302;
    };
    const Word$shr = x0 => x1 => Word$shr$(x0, x1);

    function Word$s_shr$(_n$2, _value$3) {
        var _neg$4 = Word$is_neg$(_n$2);
        var self = _neg$4;
        if (self) {
            var _n$5 = Word$neg$(_n$2);
            var $304 = Word$shl$(_n$5, _value$3);
            var $303 = $304;
        } else {
            var $305 = Word$shr$(_n$2, _value$3);
            var $303 = $305;
        };
        return $303;
    };
    const Word$s_shr = x0 => x1 => Word$s_shr$(x0, x1);
    const I32$shr = a0 => a1 => (a0 >> a1);

    function Word$xor$(_a$2, _b$3) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $307 = self.pred;
                var $308 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $310 = self.pred;
                            var $311 = (_a$pred$9 => {
                                var $312 = Word$o$(Word$xor$(_a$pred$9, $310));
                                return $312;
                            });
                            var $309 = $311;
                            break;
                        case 'Word.i':
                            var $313 = self.pred;
                            var $314 = (_a$pred$9 => {
                                var $315 = Word$i$(Word$xor$(_a$pred$9, $313));
                                return $315;
                            });
                            var $309 = $314;
                            break;
                        case 'Word.e':
                            var $316 = (_a$pred$7 => {
                                var $317 = Word$e;
                                return $317;
                            });
                            var $309 = $316;
                            break;
                    };
                    var $309 = $309($307);
                    return $309;
                });
                var $306 = $308;
                break;
            case 'Word.i':
                var $318 = self.pred;
                var $319 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $321 = self.pred;
                            var $322 = (_a$pred$9 => {
                                var $323 = Word$i$(Word$xor$(_a$pred$9, $321));
                                return $323;
                            });
                            var $320 = $322;
                            break;
                        case 'Word.i':
                            var $324 = self.pred;
                            var $325 = (_a$pred$9 => {
                                var $326 = Word$o$(Word$xor$(_a$pred$9, $324));
                                return $326;
                            });
                            var $320 = $325;
                            break;
                        case 'Word.e':
                            var $327 = (_a$pred$7 => {
                                var $328 = Word$e;
                                return $328;
                            });
                            var $320 = $327;
                            break;
                    };
                    var $320 = $320($318);
                    return $320;
                });
                var $306 = $319;
                break;
            case 'Word.e':
                var $329 = (_b$4 => {
                    var $330 = Word$e;
                    return $330;
                });
                var $306 = $329;
                break;
        };
        var $306 = $306(_b$3);
        return $306;
    };
    const Word$xor = x0 => x1 => Word$xor$(x0, x1);
    const I32$xor = a0 => a1 => (a0 ^ a1);
    const I32$add = a0 => a1 => ((a0 + a1) >> 0);

    function I32$abs$(_a$1) {
        var _mask$2 = (_a$1 >> 31);
        var $331 = (((_mask$2 + _a$1) >> 0) ^ _mask$2);
        return $331;
    };
    const I32$abs = x0 => I32$abs$(x0);
    const I32$sub = a0 => a1 => ((a0 - a1) >> 0);

    function Cmp$as_ltn$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
                var $333 = Bool$true;
                var $332 = $333;
                break;
            case 'Cmp.eql':
            case 'Cmp.gtn':
                var $334 = Bool$false;
                var $332 = $334;
                break;
        };
        return $332;
    };
    const Cmp$as_ltn = x0 => Cmp$as_ltn$(x0);

    function Cmp$inv$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
                var $336 = Cmp$gtn;
                var $335 = $336;
                break;
            case 'Cmp.eql':
                var $337 = Cmp$eql;
                var $335 = $337;
                break;
            case 'Cmp.gtn':
                var $338 = Cmp$ltn;
                var $335 = $338;
                break;
        };
        return $335;
    };
    const Cmp$inv = x0 => Cmp$inv$(x0);

    function Word$s_ltn$(_a$2, _b$3) {
        var _neg_a$4 = Word$is_neg$(_a$2);
        var _neg_b$5 = Word$is_neg$(_b$3);
        var self = _neg_a$4;
        if (self) {
            var self = _neg_b$5;
            if (self) {
                var $341 = Cmp$as_ltn$(Cmp$inv$(Word$cmp$(_a$2, _b$3)));
                var $340 = $341;
            } else {
                var $342 = Bool$true;
                var $340 = $342;
            };
            var $339 = $340;
        } else {
            var self = _neg_b$5;
            if (self) {
                var $344 = Bool$false;
                var $343 = $344;
            } else {
                var $345 = Cmp$as_ltn$(Word$cmp$(_a$2, _b$3));
                var $343 = $345;
            };
            var $339 = $343;
        };
        return $339;
    };
    const Word$s_ltn = x0 => x1 => Word$s_ltn$(x0, x1);
    const I32$ltn = a0 => a1 => (a0 < a1);

    function List$(_A$1) {
        var $346 = null;
        return $346;
    };
    const List = x0 => List$(x0);

    function Cmp$as_gtn$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
            case 'Cmp.eql':
                var $348 = Bool$false;
                var $347 = $348;
                break;
            case 'Cmp.gtn':
                var $349 = Bool$true;
                var $347 = $349;
                break;
        };
        return $347;
    };
    const Cmp$as_gtn = x0 => Cmp$as_gtn$(x0);

    function Word$s_gtn$(_a$2, _b$3) {
        var _neg_a$4 = Word$is_neg$(_a$2);
        var _neg_b$5 = Word$is_neg$(_b$3);
        var self = _neg_a$4;
        if (self) {
            var self = _neg_b$5;
            if (self) {
                var $352 = Cmp$as_gtn$(Cmp$inv$(Word$cmp$(_a$2, _b$3)));
                var $351 = $352;
            } else {
                var $353 = Bool$false;
                var $351 = $353;
            };
            var $350 = $351;
        } else {
            var self = _neg_b$5;
            if (self) {
                var $355 = Bool$true;
                var $354 = $355;
            } else {
                var $356 = Cmp$as_gtn$(Word$cmp$(_a$2, _b$3));
                var $354 = $356;
            };
            var $350 = $354;
        };
        return $350;
    };
    const Word$s_gtn = x0 => x1 => Word$s_gtn$(x0, x1);
    const I32$gtn = a0 => a1 => (a0 > a1);
    const I32$mul = a0 => a1 => ((a0 * a1) >> 0);

    function Cmp$as_eql$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
            case 'Cmp.gtn':
                var $358 = Bool$false;
                var $357 = $358;
                break;
            case 'Cmp.eql':
                var $359 = Bool$true;
                var $357 = $359;
                break;
        };
        return $357;
    };
    const Cmp$as_eql = x0 => Cmp$as_eql$(x0);

    function Word$eql$(_a$2, _b$3) {
        var $360 = Cmp$as_eql$(Word$cmp$(_a$2, _b$3));
        return $360;
    };
    const Word$eql = x0 => x1 => Word$eql$(x0, x1);
    const I32$eql = a0 => a1 => (a0 === a1);

    function List$cons$(_head$2, _tail$3) {
        var $361 = ({
            _: 'List.cons',
            'head': _head$2,
            'tail': _tail$3
        });
        return $361;
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
                    var $362 = List$cons$(Pair$new$(_x0$1, _y0$2), _coords$9);
                    return $362;
                } else {
                    var _new_x$10 = ((1 + _x0$1) >> 0);
                    var self = (_d$8 > 0);
                    if (self) {
                        var _new_y$11 = ((_yi$5 + _y0$2) >> 0);
                        var _new_d$12 = ((_d$8 + ((2 * ((_dy$7 - _dx$6) >> 0)) >> 0)) >> 0);
                        var $364 = VoxBox$Draw$line$coords$low$go$(_new_x$10, _new_y$11, _x1$3, _y1$4, _yi$5, _dx$6, _dy$7, _new_d$12, List$cons$(Pair$new$(_x0$1, _y0$2), _coords$9));
                        var $363 = $364;
                    } else {
                        var _new_d$11 = ((_d$8 + ((2 * _dy$7) >> 0)) >> 0);
                        var $365 = VoxBox$Draw$line$coords$low$go$(_new_x$10, _y0$2, _x1$3, _y1$4, _yi$5, _dx$6, _dy$7, _new_d$11, List$cons$(Pair$new$(_x0$1, _y0$2), _coords$9));
                        var $363 = $365;
                    };
                    return $363;
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
            var $367 = 1;
            var _yi$7 = $367;
        } else {
            var $368 = ((-1));
            var _yi$7 = $368;
        };
        var _d$8 = ((((2 * _dy$6) >> 0) - _dx$5) >> 0);
        var $366 = VoxBox$Draw$line$coords$low$go$(_x0$1, _y0$2, _x1$3, _y1$4, _yi$7, _dx$5, _dy$6, _d$8, List$nil);
        return $366;
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
                    var $369 = List$cons$(Pair$new$(_x0$1, _y0$2), _coords$9);
                    return $369;
                } else {
                    var _new_y$10 = ((1 + _y0$2) >> 0);
                    var self = (_d$8 > 0);
                    if (self) {
                        var _new_x$11 = ((_x0$1 + _xi$5) >> 0);
                        var _new_d$12 = ((_d$8 + ((2 * ((_dx$6 - _dy$7) >> 0)) >> 0)) >> 0);
                        var $371 = VoxBox$Draw$line$coords$high$go$(_new_x$11, _new_y$10, _x1$3, _y1$4, _xi$5, _dx$6, _dy$7, _new_d$12, List$cons$(Pair$new$(_x0$1, _y0$2), _coords$9));
                        var $370 = $371;
                    } else {
                        var _new_d$11 = ((_d$8 + ((2 * _dx$6) >> 0)) >> 0);
                        var $372 = VoxBox$Draw$line$coords$high$go$(_x0$1, _new_y$10, _x1$3, _y1$4, _xi$5, _dx$6, _dy$7, _new_d$11, List$cons$(Pair$new$(_x0$1, _y0$2), _coords$9));
                        var $370 = $372;
                    };
                    return $370;
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
            var $374 = ((-1));
            var _xi$7 = $374;
        } else {
            var $375 = 1;
            var _xi$7 = $375;
        };
        var _d$8 = ((((2 * _dx$5) >> 0) - _dy$6) >> 0);
        var $373 = VoxBox$Draw$line$coords$high$go$(_x0$1, _y0$2, _x1$3, _y1$4, _xi$7, _dx$5, _dy$6, _d$8, List$nil);
        return $373;
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
                var $378 = VoxBox$Draw$line$coords$low$(_x1$3, _y1$4, _x0$1, _y0$2);
                var $377 = $378;
            } else {
                var $379 = VoxBox$Draw$line$coords$low$(_x0$1, _y0$2, _x1$3, _y1$4);
                var $377 = $379;
            };
            var $376 = $377;
        } else {
            var self = (_y0$2 > _y1$4);
            if (self) {
                var $381 = VoxBox$Draw$line$coords$high$(_x1$3, _y1$4, _x0$1, _y0$2);
                var $380 = $381;
            } else {
                var $382 = VoxBox$Draw$line$coords$high$(_x0$1, _y0$2, _x1$3, _y1$4);
                var $380 = $382;
            };
            var $376 = $380;
        };
        return $376;
    };
    const VoxBox$Draw$line$coords = x0 => x1 => x2 => x3 => VoxBox$Draw$line$coords$(x0, x1, x2, x3);
    const List$for = a0 => a1 => a2 => (list_for(a0)(a1)(a2));

    function Word$trim$(_new_size$2, _word$3) {
        var self = _new_size$2;
        if (self === 0n) {
            var $384 = Word$e;
            var $383 = $384;
        } else {
            var $385 = (self - 1n);
            var self = _word$3;
            switch (self._) {
                case 'Word.o':
                    var $387 = self.pred;
                    var $388 = Word$o$(Word$trim$($385, $387));
                    var $386 = $388;
                    break;
                case 'Word.i':
                    var $389 = self.pred;
                    var $390 = Word$i$(Word$trim$($385, $389));
                    var $386 = $390;
                    break;
                case 'Word.e':
                    var $391 = Word$o$(Word$trim$($385, Word$e));
                    var $386 = $391;
                    break;
            };
            var $383 = $386;
        };
        return $383;
    };
    const Word$trim = x0 => x1 => Word$trim$(x0, x1);
    const Unit$new = null;

    function Array$extract_tip$(_arr$2) {
        var self = _arr$2;
        switch (self._) {
            case 'Array.tip':
                var $393 = self.value;
                var $394 = $393;
                var $392 = $394;
                break;
            case 'Array.tie':
                var $395 = Unit$new;
                var $392 = $395;
                break;
        };
        return $392;
    };
    const Array$extract_tip = x0 => Array$extract_tip$(x0);

    function Array$extract_tie$(_arr$3) {
        var self = _arr$3;
        switch (self._) {
            case 'Array.tie':
                var $397 = self.lft;
                var $398 = self.rgt;
                var $399 = Pair$new$($397, $398);
                var $396 = $399;
                break;
            case 'Array.tip':
                var $400 = Unit$new;
                var $396 = $400;
                break;
        };
        return $396;
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
                        var $401 = self.pred;
                        var $402 = Word$foldl$(_w0$4(_nil$3), _w0$4, _w1$5, $401);
                        return $402;
                    case 'Word.i':
                        var $403 = self.pred;
                        var $404 = Word$foldl$(_w1$5(_nil$3), _w0$4, _w1$5, $403);
                        return $404;
                    case 'Word.e':
                        var $405 = _nil$3;
                        return $405;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Word$foldl = x0 => x1 => x2 => x3 => Word$foldl$(x0, x1, x2, x3);

    function Array$mut$(_idx$3, _f$4, _arr$5) {
        var $406 = Word$foldl$((_arr$6 => {
            var $407 = Array$tip$(_f$4(Array$extract_tip$(_arr$6)));
            return $407;
        }), (_rec$7 => _arr$8 => {
            var self = Array$extract_tie$(_arr$8);
            switch (self._) {
                case 'Pair.new':
                    var $409 = self.fst;
                    var $410 = self.snd;
                    var $411 = Array$tie$(_rec$7($409), $410);
                    var $408 = $411;
                    break;
            };
            return $408;
        }), (_rec$7 => _arr$8 => {
            var self = Array$extract_tie$(_arr$8);
            switch (self._) {
                case 'Pair.new':
                    var $413 = self.fst;
                    var $414 = self.snd;
                    var $415 = Array$tie$($413, _rec$7($414));
                    var $412 = $415;
                    break;
            };
            return $412;
        }), _idx$3)(_arr$5);
        return $406;
    };
    const Array$mut = x0 => x1 => x2 => Array$mut$(x0, x1, x2);

    function Array$set$(_idx$3, _val$4, _arr$5) {
        var $416 = Array$mut$(_idx$3, (_x$6 => {
            var $417 = _val$4;
            return $417;
        }), _arr$5);
        return $416;
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
                var $419 = self.capacity;
                var $420 = self.buffer;
                var $421 = VoxBox$new$(_length$1, $419, $420);
                var $418 = $421;
                break;
        };
        return $418;
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
        var $422 = (((_n$1) >>> 0));
        return $422;
    };
    const I32$to_u32 = x0 => I32$to_u32$(x0);

    function VoxBox$Draw$line$(_x0$1, _y0$2, _x1$3, _y1$4, _z$5, _col$6, _img$7) {
        var _coords$8 = VoxBox$Draw$line$coords$(_x0$1, _y0$2, _x1$3, _y1$4);
        var _img$9 = (() => {
            var $425 = _img$7;
            var $426 = _coords$8;
            let _img$10 = $425;
            let _coord$9;
            while ($426._ === 'List.cons') {
                _coord$9 = $426.head;
                var self = _coord$9;
                switch (self._) {
                    case 'Pair.new':
                        var $427 = self.fst;
                        var $428 = self.snd;
                        var $429 = ((_img$10.buffer[_img$10.length * 2] = ((0 | I32$to_u32$($427) | (I32$to_u32$($428) << 12) | (I32$to_u32$(_z$5) << 24))), _img$10.buffer[_img$10.length * 2 + 1] = _col$6, _img$10.length++, _img$10));
                        var $425 = $429;
                        break;
                };
                _img$10 = $425;
                $426 = $426.tail;
            }
            return _img$10;
        })();
        var $423 = _img$9;
        return $423;
    };
    const VoxBox$Draw$line = x0 => x1 => x2 => x3 => x4 => x5 => x6 => VoxBox$Draw$line$(x0, x1, x2, x3, x4, x5, x6);
    const Col32$new = a0 => a1 => a2 => a3 => ((0 | a0 | (a1 << 8) | (a2 << 16) | (a3 << 24)));

    function App$TicTacToe$draw_vertical_lines$(_img$1) {
        var _side_tale$2 = ((side_board / 3) >> 0);
        var _edge$3 = ((side_board / 12) >> 0);
        var _img$4 = VoxBox$Draw$line$(_side_tale$2, _edge$3, _side_tale$2, ((side_board - _edge$3) >> 0), 0, ((0 | 0 | (0 << 8) | (0 << 16) | (255 << 24))), _img$1);
        var $430 = VoxBox$Draw$line$(((side_board - _side_tale$2) >> 0), _edge$3, ((side_board - _side_tale$2) >> 0), ((side_board - _edge$3) >> 0), 0, ((0 | 0 | (0 << 8) | (0 << 16) | (255 << 24))), _img$4);
        return $430;
    };
    const App$TicTacToe$draw_vertical_lines = x0 => App$TicTacToe$draw_vertical_lines$(x0);

    function App$TicTacToe$draw_horizontal_lines$(_img$1) {
        var _side_tale$2 = ((side_board / 3) >> 0);
        var _edge$3 = ((side_board / 12) >> 0);
        var _img$4 = VoxBox$Draw$line$(_edge$3, _side_tale$2, ((side_board - _edge$3) >> 0), _side_tale$2, 0, ((0 | 0 | (0 << 8) | (0 << 16) | (255 << 24))), _img$1);
        var $431 = VoxBox$Draw$line$(_edge$3, ((side_board - _side_tale$2) >> 0), ((side_board - _edge$3) >> 0), ((side_board - _side_tale$2) >> 0), 0, ((0 | 0 | (0 << 8) | (0 << 16) | (255 << 24))), _img$4);
        return $431;
    };
    const App$TicTacToe$draw_horizontal_lines = x0 => App$TicTacToe$draw_horizontal_lines$(x0);

    function Vector$fold$(_A$1, _B$2, _size$3, _b$4, _f$5, _vec$6) {
        var self = _size$3;
        if (self === 0n) {
            var $433 = (_vec$7 => {
                var $434 = _b$4;
                return $434;
            });
            var $432 = $433;
        } else {
            var $435 = (self - 1n);
            var $436 = (_vec$8 => {
                var $437 = _vec$8((_vec$self$9 => {
                    var $438 = null;
                    return $438;
                }))((_vec$head$9 => _vec$tail$10 => {
                    var _pred$11 = Vector$fold$(null, null, $435, _b$4, _f$5, _vec$tail$10);
                    var $439 = _f$5(_vec$head$9)(_pred$11);
                    return $439;
                }));
                return $437;
            });
            var $432 = $436;
        };
        var $432 = $432(_vec$6);
        return $432;
    };
    const Vector$fold = x0 => x1 => x2 => x3 => x4 => x5 => Vector$fold$(x0, x1, x2, x3, x4, x5);
    const U32$sub = a0 => a1 => ((a0 - a1) >>> 0);
    const U32$div = a0 => a1 => ((a0 / a1) >>> 0);

    function Word$mod$(_a$2, _b$3) {
        var _q$4 = Word$div$(_a$2, _b$3);
        var $440 = Word$sub$(_a$2, Word$mul$(_b$3, _q$4));
        return $440;
    };
    const Word$mod = x0 => x1 => Word$mod$(x0, x1);
    const U32$mod = a0 => a1 => (a0 % a1);

    function App$TicTacToe$pos$posvector_to_minipair$(_posvector$1) {
        var $441 = Pair$new$(((_posvector$1 / 3) >>> 0), (_posvector$1 % 3));
        return $441;
    };
    const App$TicTacToe$pos$posvector_to_minipair = x0 => App$TicTacToe$pos$posvector_to_minipair$(x0);
    const App$TicTacToe$constant$side_tale = ((App$TicTacToe$constant$size / 3) >>> 0);
    const side_tale = App$TicTacToe$constant$side_tale;
    const App$TicTacToe$constant$side_entity = 34;
    const side_entity = App$TicTacToe$constant$side_entity;

    function App$TicTacToe$pos$posvector_to_pair$(_pos$1) {
        var _trans$2 = App$TicTacToe$pos$posvector_to_minipair$(_pos$1);
        var self = _trans$2;
        switch (self._) {
            case 'Pair.new':
                var $443 = self.fst;
                var $444 = self.snd;
                var $445 = Pair$new$((((((($443 * side_tale) >>> 0) + ((side_tale / 2) >>> 0)) >>> 0) - ((side_entity / 2) >>> 0)) >>> 0), (((((($444 * side_tale) >>> 0) + ((side_tale / 2) >>> 0)) >>> 0) - ((side_entity / 2) >>> 0)) >>> 0));
                var $442 = $445;
                break;
        };
        return $442;
    };
    const App$TicTacToe$pos$posvector_to_pair = x0 => App$TicTacToe$pos$posvector_to_pair$(x0);

    function VoxBox$get_len$(_img$1) {
        var self = _img$1;
        switch (self._) {
            case 'VoxBox.new':
                var $447 = self.length;
                var $448 = $447;
                var $446 = $448;
                break;
        };
        return $446;
    };
    const VoxBox$get_len = x0 => VoxBox$get_len$(x0);
    const U32$eql = a0 => a1 => (a0 === a1);
    const U32$inc = a0 => ((a0 + 1) >>> 0);
    const U32$for = a0 => a1 => a2 => a3 => (u32_for(a0, a1, a2, a3));

    function Array$get$(_idx$3, _arr$4) {
        var $449 = Word$foldl$(Array$extract_tip, (_rec$6 => _arr$7 => {
            var _arr_l$8 = Array$extract_tie$(_arr$7);
            var self = _arr_l$8;
            switch (self._) {
                case 'Pair.new':
                    var $451 = self.fst;
                    var $452 = _rec$6($451);
                    var $450 = $452;
                    break;
            };
            return $450;
        }), (_rec$6 => _arr$7 => {
            var _arr_r$8 = Array$extract_tie$(_arr$7);
            var self = _arr_r$8;
            switch (self._) {
                case 'Pair.new':
                    var $454 = self.snd;
                    var $455 = _rec$6($454);
                    var $453 = $455;
                    break;
            };
            return $453;
        }), _idx$3)(_arr$4);
        return $449;
    };
    const Array$get = x0 => x1 => Array$get$(x0, x1);
    const Buffer32$get = a0 => a1 => ((a1[a0]));
    const VoxBox$get_pos = a0 => a1 => ((a1.buffer[a0 * 2]));
    const VoxBox$get_col = a0 => a1 => ((a1.buffer[a0 * 2 + 1]));

    function Word$and$(_a$2, _b$3) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $457 = self.pred;
                var $458 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $460 = self.pred;
                            var $461 = (_a$pred$9 => {
                                var $462 = Word$o$(Word$and$(_a$pred$9, $460));
                                return $462;
                            });
                            var $459 = $461;
                            break;
                        case 'Word.i':
                            var $463 = self.pred;
                            var $464 = (_a$pred$9 => {
                                var $465 = Word$o$(Word$and$(_a$pred$9, $463));
                                return $465;
                            });
                            var $459 = $464;
                            break;
                        case 'Word.e':
                            var $466 = (_a$pred$7 => {
                                var $467 = Word$e;
                                return $467;
                            });
                            var $459 = $466;
                            break;
                    };
                    var $459 = $459($457);
                    return $459;
                });
                var $456 = $458;
                break;
            case 'Word.i':
                var $468 = self.pred;
                var $469 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $471 = self.pred;
                            var $472 = (_a$pred$9 => {
                                var $473 = Word$o$(Word$and$(_a$pred$9, $471));
                                return $473;
                            });
                            var $470 = $472;
                            break;
                        case 'Word.i':
                            var $474 = self.pred;
                            var $475 = (_a$pred$9 => {
                                var $476 = Word$i$(Word$and$(_a$pred$9, $474));
                                return $476;
                            });
                            var $470 = $475;
                            break;
                        case 'Word.e':
                            var $477 = (_a$pred$7 => {
                                var $478 = Word$e;
                                return $478;
                            });
                            var $470 = $477;
                            break;
                    };
                    var $470 = $470($468);
                    return $470;
                });
                var $456 = $469;
                break;
            case 'Word.e':
                var $479 = (_b$4 => {
                    var $480 = Word$e;
                    return $480;
                });
                var $456 = $479;
                break;
        };
        var $456 = $456(_b$3);
        return $456;
    };
    const Word$and = x0 => x1 => Word$and$(x0, x1);
    const U32$and = a0 => a1 => (a0 & a1);
    const U32$shr = a0 => a1 => (a0 >>> a1);

    function VoxBox$Draw$image$(_x$1, _y$2, _z$3, _src$4, _img$5) {
        var _len$6 = VoxBox$get_len$(_src$4);
        var _img$7 = (() => {
            var $482 = _img$5;
            var $483 = 0;
            var $484 = _len$6;
            let _img$8 = $482;
            for (let _i$7 = $483; _i$7 < $484; ++_i$7) {
                var _pos$9 = ((_src$4.buffer[_i$7 * 2]));
                var _col$10 = ((_src$4.buffer[_i$7 * 2 + 1]));
                var _p_x$11 = (_pos$9 & 4095);
                var _p_y$12 = ((_pos$9 & 16773120) >>> 12);
                var _p_z$13 = ((_pos$9 & 4278190080) >>> 24);
                var _p_x$14 = ((_p_x$11 + _x$1) >>> 0);
                var _p_y$15 = ((_p_y$12 + _y$2) >>> 0);
                var _p_z$16 = ((_p_z$13 + _z$3) >>> 0);
                var _pos$17 = ((0 | _p_x$14 | (_p_y$15 << 12) | (_p_z$16 << 24)));
                var $482 = ((_img$8.buffer[_img$8.length * 2] = _pos$17, _img$8.buffer[_img$8.length * 2 + 1] = _col$10, _img$8.length++, _img$8));
                _img$8 = $482;
            };
            return _img$8;
        })();
        var $481 = _img$7;
        return $481;
    };
    const VoxBox$Draw$image = x0 => x1 => x2 => x3 => x4 => VoxBox$Draw$image$(x0, x1, x2, x3, x4);
    const U32$length = a0 => ((a0.length) >>> 0);

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
        var $485 = (parseInt(_chr$3, 16));
        return $485;
    };
    const VoxBox$parse_byte = x0 => x1 => VoxBox$parse_byte$(x0, x1);

    function VoxBox$parse$(_voxdata$1) {
        var _siz$2 = ((((_voxdata$1.length) >>> 0) / 12) >>> 0);
        var _img$3 = VoxBox$alloc_capacity$(_siz$2);
        var _img$4 = (() => {
            var $487 = _img$3;
            var $488 = 0;
            var $489 = _siz$2;
            let _img$5 = $487;
            for (let _i$4 = $488; _i$4 < $489; ++_i$4) {
                var _x$6 = VoxBox$parse_byte$(((((_i$4 * 6) >>> 0) + 0) >>> 0), _voxdata$1);
                var _y$7 = VoxBox$parse_byte$(((((_i$4 * 6) >>> 0) + 1) >>> 0), _voxdata$1);
                var _z$8 = VoxBox$parse_byte$(((((_i$4 * 6) >>> 0) + 2) >>> 0), _voxdata$1);
                var _r$9 = VoxBox$parse_byte$(((((_i$4 * 6) >>> 0) + 3) >>> 0), _voxdata$1);
                var _g$10 = VoxBox$parse_byte$(((((_i$4 * 6) >>> 0) + 4) >>> 0), _voxdata$1);
                var _b$11 = VoxBox$parse_byte$(((((_i$4 * 6) >>> 0) + 5) >>> 0), _voxdata$1);
                var _pos$12 = ((0 | _x$6 | (_y$7 << 12) | (_z$8 << 24)));
                var _col$13 = ((0 | _r$9 | (_g$10 << 8) | (_b$11 << 16) | (255 << 24)));
                var $487 = ((_img$5.buffer[_img$5.length * 2] = _pos$12, _img$5.buffer[_img$5.length * 2 + 1] = _col$13, _img$5.length++, _img$5));
                _img$5 = $487;
            };
            return _img$5;
        })();
        var $486 = _img$4;
        return $486;
    };
    const VoxBox$parse = x0 => VoxBox$parse$(x0);
    const App$TicTacToe$Assets$circle = VoxBox$parse$("0d00020000000e00020000000f00020000001000020000001100020000001200020000001300020000001400020000001500020000001600020000000a01020000000b01020000000c01020000000d01020000000e01020000000f01020000001001020000001101020000001201020000001301020000001401020000001501020000001601020000001701020000001801020000000802020000000902020000000a02020000000b02020000000c02020000000d02020000000e02020000000f02020000001002020000001102020000001202020000001302020000001402020000001502020000001602020000001702020000001802020000001902020000000603020000000703020000000803020000000903020000000a03020000000b03020000000c03020000000d03020000000e03020000000f03020000001003020000001103020000001203020000001303020000001403020000001503020000001603020000001703020000001803020000001903020000001a03020000000504020000000604020000000704020000000804020000000904020000000a04020000000b04020000000c04020000000d04020000000e04020000000f04020000001004020000001104020000001204020000001304020000001404020000001504020000001604020000001704020000001804020000001904020000001a04020000001b04020000000405020000000505020000000605020000000705020000000805020000000905020000000a05020000000b05020000000c05020000000d05020000000e05020000001205020000001305020000001405020000001505020000001605020000001705020000001805020000001905020000001a05020000001b05020000001c05020000000306020000000406020000000506020000000606020000000706020000000806020000000906020000000a06020000001306020000001406020000001506020000001606020000001706020000001806020000001906020000001a06020000001b06020000001c06020000000207020000000307020000000407020000000507020000000607020000000707020000000807020000001407020000001507020000001607020000001707020000001807020000001907020000001a07020000001b07020000001c07020000001d07020000000208020000000308020000000408020000000508020000000608020000000708020000000808020000001608020000001708020000001808020000001908020000001a08020000001b08020000001c08020000001d08020000001e08020000000109020000000209020000000309020000000409020000000509020000000609020000000709020000001709020000001809020000001909020000001a09020000001b09020000001c09020000001d09020000001e0902000000010a02000000020a02000000030a02000000040a02000000050a02000000060a02000000170a02000000180a02000000190a020000001a0a020000001b0a020000001c0a020000001d0a020000001e0a020000001f0a02000000000b02000000010b02000000020b02000000030b02000000040b02000000050b02000000060b02000000180b02000000190b020000001a0b020000001b0b020000001c0b020000001d0b020000001e0b020000001f0b02000000000c02000000010c02000000020c02000000030c02000000040c02000000050c02000000060c02000000180c02000000190c020000001a0c020000001b0c020000001c0c020000001d0c020000001e0c020000001f0c02000000000d02000000010d02000000020d02000000030d02000000040d02000000050d02000000190d020000001a0d020000001b0d020000001c0d020000001d0d020000001e0d020000001f0d02000000000e02000000010e02000000020e02000000030e02000000040e02000000050e02000000190e020000001a0e020000001b0e020000001c0e020000001d0e020000001e0e020000001f0e02000000000f02000000010f02000000020f02000000030f02000000040f02000000050f02000000190f020000001a0f020000001b0f020000001c0f020000001d0f020000001e0f020000001f0f020000000010020000000110020000000210020000000310020000000410020000000510020000001a10020000001b10020000001c10020000001d10020000001e10020000001f10020000000011020000000111020000000211020000000311020000000411020000000511020000000611020000001a11020000001b11020000001c11020000001d11020000001e11020000001f11020000000012020000000112020000000212020000000312020000000412020000000512020000000612020000001a12020000001b12020000001c12020000001d12020000001e12020000001f12020000000013020000000113020000000213020000000313020000000413020000000513020000000613020000001a13020000001b13020000001c13020000001d13020000001e13020000001f13020000000014020000000114020000000214020000000314020000000414020000000514020000000614020000000714020000001a14020000001b14020000001c14020000001d14020000001e14020000001f14020000000015020000000115020000000215020000000315020000000415020000000515020000000615020000000715020000001a15020000001b15020000001c15020000001d15020000001e15020000001f15020000000016020000000116020000000216020000000316020000000416020000000516020000000616020000000716020000000816020000001a16020000001b16020000001c16020000001d16020000001e16020000001f16020000000117020000000217020000000317020000000417020000000517020000000617020000000717020000000817020000000917020000001a17020000001b17020000001c17020000001d17020000001e17020000001f17020000000118020000000218020000000318020000000418020000000518020000000618020000000718020000000818020000000918020000000a18020000001a18020000001b18020000001c18020000001d18020000001e18020000001f18020000000219020000000319020000000419020000000519020000000619020000000719020000000819020000000919020000000a19020000000b19020000001a19020000001b19020000001c19020000001d19020000001e19020000001f1902000000031a02000000041a02000000051a02000000061a02000000071a02000000081a02000000091a020000000a1a020000000b1a020000000c1a020000000d1a02000000191a020000001a1a020000001b1a020000001c1a020000001d1a020000001e1a020000001f1a02000000031b02000000041b02000000051b02000000061b02000000071b02000000081b02000000091b020000000a1b020000000b1b020000000c1b020000000d1b020000000e1b020000000f1b02000000191b020000001a1b020000001b1b020000001c1b020000001d1b020000001e1b020000001f1b02000000041c02000000051c02000000061c02000000071c02000000081c02000000091c020000000a1c020000000b1c020000000c1c020000000d1c020000000e1c020000000f1c02000000101c02000000111c02000000121c02000000181c02000000191c020000001a1c020000001b1c020000001c1c020000001d1c020000001e1c02000000051d02000000061d02000000071d02000000081d02000000091d020000000a1d020000000b1d020000000c1d020000000d1d020000000e1d020000000f1d02000000101d02000000111d02000000121d02000000131d02000000141d02000000151d02000000161d02000000171d02000000181d02000000191d020000001a1d020000001b1d020000001c1d020000001d1d020000001e1d02000000071e02000000081e02000000091e020000000a1e020000000b1e020000000c1e020000000d1e020000000e1e020000000f1e02000000101e02000000111e02000000121e02000000131e02000000141e02000000151e02000000161e02000000171e02000000181e02000000191e020000001a1e020000001b1e020000001c1e020000001d1e02000000091f020000000a1f020000000b1f020000000c1f020000000d1f020000000e1f020000000f1f02000000101f02000000111f02000000121f02000000131f02000000141f02000000151f02000000161f02000000171f02000000181f02000000191f020000001a1f020000001b1f020000001c1f020000000b20020000000c20020000000d20020000000e20020000000f20020000001020020000001120020000001220020000001320020000001420020000001520020000001620020000001720020000001820020000001920020000001a20020000000c21020000000d21020000000e21020000000f2102000000102102000000112102000000122102000000132102000000142102000000152102000000162102000000172102000000182102000000");
    const App$TicTacToe$Assets$x = VoxBox$parse$("0200020000000300020000000400020000000500020000001900020000001a00020000001b00020000001c00020000001d00020000000101020000000201020000000301020000000401020000000501020000000601020000001801020000001901020000001a01020000001b01020000001c01020000001d01020000000002020000000102020000000202020000000302020000000402020000000502020000000602020000000702020000000802020000001702020000001802020000001902020000001a02020000001b02020000001c02020000000003020000000103020000000203020000000303020000000403020000000503020000000603020000000703020000000803020000000903020000001703020000001803020000001903020000001a03020000001b03020000000104020000000204020000000304020000000404020000000504020000000604020000000704020000000804020000000904020000000a04020000000b04020000001604020000001704020000001804020000001904020000001a04020000001b04020000000305020000000405020000000505020000000605020000000705020000000805020000000905020000000a05020000000b05020000000c05020000001505020000001605020000001705020000001805020000001905020000001a05020000000506020000000606020000000706020000000806020000000906020000000a06020000000b06020000000c06020000000d06020000001406020000001506020000001606020000001706020000001806020000001906020000000607020000000707020000000807020000000907020000000a07020000000b07020000000c07020000000d07020000000e07020000001307020000001407020000001507020000001607020000001707020000001807020000000708020000000808020000000908020000000a08020000000b08020000000c08020000000d08020000000e08020000000f08020000001208020000001308020000001408020000001508020000001608020000001708020000000909020000000a09020000000b09020000000c09020000000d09020000000e09020000000f09020000001009020000001109020000001209020000001309020000001409020000001509020000001609020000001709020000000a0a020000000b0a020000000c0a020000000d0a020000000e0a020000000f0a02000000100a02000000110a02000000120a02000000130a02000000140a02000000150a02000000160a020000000b0b020000000c0b020000000d0b020000000e0b020000000f0b02000000100b02000000110b02000000120b02000000130b02000000140b02000000150b020000000c0c020000000d0c020000000e0c020000000f0c02000000100c02000000110c02000000120c02000000130c02000000140c020000000d0d020000000e0d020000000f0d02000000100d02000000110d02000000120d02000000130d02000000140d020000000d0e020000000e0e020000000f0e02000000100e02000000110e02000000120e02000000130e02000000140e02000000150e020000000c0f020000000d0f020000000e0f020000000f0f02000000100f02000000110f02000000120f02000000130f02000000140f02000000150f02000000160f020000000b10020000000c10020000000d10020000000e10020000000f10020000001010020000001110020000001210020000001310020000001410020000001510020000001610020000001710020000000a11020000000b11020000000c11020000000d11020000000e11020000000f11020000001111020000001211020000001311020000001411020000001511020000001611020000001711020000001811020000000912020000000a12020000000b12020000000c12020000000d12020000000e12020000001212020000001312020000001412020000001512020000001612020000001712020000001812020000001912020000000813020000000913020000000a13020000000b13020000000c13020000000d13020000001313020000001413020000001513020000001613020000001713020000001813020000001913020000001a13020000000714020000000814020000000914020000000a14020000000b14020000000c14020000001414020000001514020000001614020000001714020000001814020000001914020000001a14020000001b14020000000615020000000715020000000815020000000915020000000a15020000000b15020000001515020000001615020000001715020000001815020000001915020000001a15020000001b15020000001c15020000000516020000000616020000000716020000000816020000000916020000000a16020000001616020000001716020000001816020000001916020000001a16020000001b16020000001c16020000001d16020000000417020000000517020000000617020000000717020000000817020000000917020000001717020000001817020000001917020000001a17020000001b17020000001c17020000001d17020000001e17020000000318020000000418020000000518020000000618020000000718020000000818020000001718020000001818020000001918020000001a18020000001b18020000001c18020000001d18020000001e18020000001f18020000000219020000000319020000000419020000000519020000000619020000000719020000000819020000001819020000001919020000001a19020000001b19020000001c19020000001d19020000001e19020000001f1902000000021a02000000031a02000000041a02000000051a02000000061a02000000071a02000000191a020000001a1a020000001b1a020000001c1a020000001d1a020000001e1a020000001f1a02000000011b02000000021b02000000031b02000000041b02000000051b020000001b1b020000001c1b020000001d1b020000001e1b02000000011c02000000021c02000000031c02000000041c02000000");

    function App$TicTacToe$entity$to_assets$(_e$1) {
        var self = _e$1;
        switch (self._) {
            case 'App.TicTacToe.Entity.circle':
                var $491 = App$TicTacToe$Assets$circle;
                var $490 = $491;
                break;
            case 'App.TicTacToe.Entity.x':
                var $492 = App$TicTacToe$Assets$x;
                var $490 = $492;
                break;
        };
        return $490;
    };
    const App$TicTacToe$entity$to_assets = x0 => App$TicTacToe$entity$to_assets$(x0);

    function DOM$vbox$(_props$1, _style$2, _value$3) {
        var $493 = ({
            _: 'DOM.vbox',
            'props': _props$1,
            'style': _style$2,
            'value': _value$3
        });
        return $493;
    };
    const DOM$vbox = x0 => x1 => x2 => DOM$vbox$(x0, x1, x2);

    function BBL$(_K$1, _V$2) {
        var $494 = null;
        return $494;
    };
    const BBL = x0 => x1 => BBL$(x0, x1);

    function Pair$fst$(_pair$3) {
        var self = _pair$3;
        switch (self._) {
            case 'Pair.new':
                var $496 = self.fst;
                var $497 = $496;
                var $495 = $497;
                break;
        };
        return $495;
    };
    const Pair$fst = x0 => Pair$fst$(x0);

    function Pair$snd$(_pair$3) {
        var self = _pair$3;
        switch (self._) {
            case 'Pair.new':
                var $499 = self.snd;
                var $500 = $499;
                var $498 = $500;
                break;
        };
        return $498;
    };
    const Pair$snd = x0 => Pair$snd$(x0);

    function BBL$bin$(_size$3, _key$4, _val$5, _left$6, _right$7) {
        var $501 = ({
            _: 'BBL.bin',
            'size': _size$3,
            'key': _key$4,
            'val': _val$5,
            'left': _left$6,
            'right': _right$7
        });
        return $501;
    };
    const BBL$bin = x0 => x1 => x2 => x3 => x4 => BBL$bin$(x0, x1, x2, x3, x4);
    const BBL$tip = ({
        _: 'BBL.tip'
    });

    function BBL$singleton$(_key$3, _val$4) {
        var $502 = BBL$bin$(1, _key$3, _val$4, BBL$tip, BBL$tip);
        return $502;
    };
    const BBL$singleton = x0 => x1 => BBL$singleton$(x0, x1);

    function BBL$size$(_map$3) {
        var self = _map$3;
        switch (self._) {
            case 'BBL.bin':
                var $504 = self.size;
                var $505 = $504;
                var $503 = $505;
                break;
            case 'BBL.tip':
                var $506 = 0;
                var $503 = $506;
                break;
        };
        return $503;
    };
    const BBL$size = x0 => BBL$size$(x0);
    const BBL$w = 3;

    function Word$ltn$(_a$2, _b$3) {
        var $507 = Cmp$as_ltn$(Word$cmp$(_a$2, _b$3));
        return $507;
    };
    const Word$ltn = x0 => x1 => Word$ltn$(x0, x1);
    const U32$ltn = a0 => a1 => (a0 < a1);

    function BBL$node$(_key$3, _val$4, _left$5, _right$6) {
        var _size_left$7 = BBL$size$(_left$5);
        var _size_right$8 = BBL$size$(_right$6);
        var _new_size$9 = ((1 + ((_size_left$7 + _size_right$8) >>> 0)) >>> 0);
        var $508 = BBL$bin$(_new_size$9, _key$3, _val$4, _left$5, _right$6);
        return $508;
    };
    const BBL$node = x0 => x1 => x2 => x3 => BBL$node$(x0, x1, x2, x3);

    function Word$gtn$(_a$2, _b$3) {
        var $509 = Cmp$as_gtn$(Word$cmp$(_a$2, _b$3));
        return $509;
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
            var $511 = BBL$node$(_k$3, _v$4, _l$5, _r$6);
            var $510 = $511;
        } else {
            var self = (_size_r$8 > _w_x_size_l$10);
            if (self) {
                var self = _r$6;
                switch (self._) {
                    case 'BBL.bin':
                        var $514 = self.key;
                        var $515 = self.val;
                        var $516 = self.left;
                        var $517 = self.right;
                        var _size_rl$17 = BBL$size$($516);
                        var _size_rr$18 = BBL$size$($517);
                        var self = (_size_rl$17 < _size_rr$18);
                        if (self) {
                            var _new_key$19 = $514;
                            var _new_val$20 = $515;
                            var _new_left$21 = BBL$node$(_k$3, _v$4, _l$5, $516);
                            var _new_right$22 = $517;
                            var $519 = BBL$node$(_new_key$19, _new_val$20, _new_left$21, _new_right$22);
                            var $518 = $519;
                        } else {
                            var self = $516;
                            switch (self._) {
                                case 'BBL.bin':
                                    var $521 = self.key;
                                    var $522 = self.val;
                                    var $523 = self.left;
                                    var $524 = self.right;
                                    var _new_key$24 = $521;
                                    var _new_val$25 = $522;
                                    var _new_left$26 = BBL$node$(_k$3, _v$4, _l$5, $523);
                                    var _new_right$27 = BBL$node$($514, $515, $524, $517);
                                    var $525 = BBL$node$(_new_key$24, _new_val$25, _new_left$26, _new_right$27);
                                    var $520 = $525;
                                    break;
                                case 'BBL.tip':
                                    var $526 = BBL$node$(_k$3, _v$4, _l$5, _r$6);
                                    var $520 = $526;
                                    break;
                            };
                            var $518 = $520;
                        };
                        var $513 = $518;
                        break;
                    case 'BBL.tip':
                        var $527 = BBL$node$(_k$3, _v$4, _l$5, _r$6);
                        var $513 = $527;
                        break;
                };
                var $512 = $513;
            } else {
                var self = (_size_l$7 > _w_x_size_r$11);
                if (self) {
                    var self = _l$5;
                    switch (self._) {
                        case 'BBL.bin':
                            var $530 = self.key;
                            var $531 = self.val;
                            var $532 = self.left;
                            var $533 = self.right;
                            var _size_ll$17 = BBL$size$($532);
                            var _size_lr$18 = BBL$size$($533);
                            var self = (_size_lr$18 < _size_ll$17);
                            if (self) {
                                var _new_key$19 = $530;
                                var _new_val$20 = $531;
                                var _new_left$21 = $532;
                                var _new_right$22 = BBL$node$(_k$3, _v$4, $533, _r$6);
                                var $535 = BBL$node$(_new_key$19, _new_val$20, _new_left$21, _new_right$22);
                                var $534 = $535;
                            } else {
                                var self = $533;
                                switch (self._) {
                                    case 'BBL.bin':
                                        var $537 = self.key;
                                        var $538 = self.val;
                                        var $539 = self.left;
                                        var $540 = self.right;
                                        var _new_key$24 = $537;
                                        var _new_val$25 = $538;
                                        var _new_left$26 = BBL$node$($530, $531, $532, $539);
                                        var _new_right$27 = BBL$node$(_k$3, _v$4, $540, _r$6);
                                        var $541 = BBL$node$(_new_key$24, _new_val$25, _new_left$26, _new_right$27);
                                        var $536 = $541;
                                        break;
                                    case 'BBL.tip':
                                        var $542 = BBL$node$(_k$3, _v$4, _l$5, _r$6);
                                        var $536 = $542;
                                        break;
                                };
                                var $534 = $536;
                            };
                            var $529 = $534;
                            break;
                        case 'BBL.tip':
                            var $543 = BBL$node$(_k$3, _v$4, _l$5, _r$6);
                            var $529 = $543;
                            break;
                    };
                    var $528 = $529;
                } else {
                    var $544 = BBL$node$(_k$3, _v$4, _l$5, _r$6);
                    var $528 = $544;
                };
                var $512 = $528;
            };
            var $510 = $512;
        };
        return $510;
    };
    const BBL$balance = x0 => x1 => x2 => x3 => BBL$balance$(x0, x1, x2, x3);

    function BBL$insert$(_cmp$3, _key$4, _val$5, _map$6) {
        var self = _map$6;
        switch (self._) {
            case 'BBL.bin':
                var $546 = self.key;
                var $547 = self.val;
                var $548 = self.left;
                var $549 = self.right;
                var self = _cmp$3(_key$4)($546);
                switch (self._) {
                    case 'Cmp.ltn':
                        var _new_key$12 = $546;
                        var _new_val$13 = $547;
                        var _new_left$14 = BBL$insert$(_cmp$3, _key$4, _val$5, $548);
                        var _new_right$15 = $549;
                        var $551 = BBL$balance$(_new_key$12, _new_val$13, _new_left$14, _new_right$15);
                        var $550 = $551;
                        break;
                    case 'Cmp.eql':
                        var $552 = BBL$node$(_key$4, _val$5, $548, $549);
                        var $550 = $552;
                        break;
                    case 'Cmp.gtn':
                        var _new_key$12 = $546;
                        var _new_val$13 = $547;
                        var _new_left$14 = $548;
                        var _new_right$15 = BBL$insert$(_cmp$3, _key$4, _val$5, $549);
                        var $553 = BBL$balance$(_new_key$12, _new_val$13, _new_left$14, _new_right$15);
                        var $550 = $553;
                        break;
                };
                var $545 = $550;
                break;
            case 'BBL.tip':
                var $554 = BBL$singleton$(_key$4, _val$5);
                var $545 = $554;
                break;
        };
        return $545;
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
                        var $555 = self.head;
                        var $556 = self.tail;
                        var _key$8 = Pair$fst$($555);
                        var _val$9 = Pair$snd$($555);
                        var _new_acc$10 = BBL$insert$(_cmp$3, _key$8, _val$9, _acc$4);
                        var $557 = BBL$from_list$go$(_cmp$3, _new_acc$10, $556);
                        return $557;
                    case 'List.nil':
                        var $558 = _acc$4;
                        return $558;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const BBL$from_list$go = x0 => x1 => x2 => BBL$from_list$go$(x0, x1, x2);

    function BBL$from_list$(_cmp$3, _xs$4) {
        var $559 = BBL$from_list$go$(_cmp$3, BBL$tip, _xs$4);
        return $559;
    };
    const BBL$from_list = x0 => x1 => BBL$from_list$(x0, x1);
    const U16$ltn = a0 => a1 => (a0 < a1);
    const U16$eql = a0 => a1 => (a0 === a1);

    function U16$cmp$(_a$1, _b$2) {
        var self = (_a$1 < _b$2);
        if (self) {
            var $561 = Cmp$ltn;
            var $560 = $561;
        } else {
            var self = (_a$1 === _b$2);
            if (self) {
                var $563 = Cmp$eql;
                var $562 = $563;
            } else {
                var $564 = Cmp$gtn;
                var $562 = $564;
            };
            var $560 = $562;
        };
        return $560;
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
                        var $566 = Cmp$eql;
                        var $565 = $566;
                    } else {
                        var $567 = self.charCodeAt(0);
                        var $568 = self.slice(1);
                        var $569 = Cmp$ltn;
                        var $565 = $569;
                    };
                    return $565;
                } else {
                    var $570 = self.charCodeAt(0);
                    var $571 = self.slice(1);
                    var self = _b$2;
                    if (self.length === 0) {
                        var $573 = Cmp$gtn;
                        var $572 = $573;
                    } else {
                        var $574 = self.charCodeAt(0);
                        var $575 = self.slice(1);
                        var self = U16$cmp$($570, $574);
                        switch (self._) {
                            case 'Cmp.ltn':
                                var $577 = Cmp$ltn;
                                var $576 = $577;
                                break;
                            case 'Cmp.eql':
                                var $578 = String$cmp$($571, $575);
                                var $576 = $578;
                                break;
                            case 'Cmp.gtn':
                                var $579 = Cmp$gtn;
                                var $576 = $579;
                                break;
                        };
                        var $572 = $576;
                    };
                    return $572;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const String$cmp = x0 => x1 => String$cmp$(x0, x1);

    function Map$from_list$(_xs$2) {
        var $580 = BBL$from_list$(String$cmp, _xs$2);
        return $580;
    };
    const Map$from_list = x0 => Map$from_list$(x0);

    function App$TicTacToe$draw$(_img$1, _state$2) {
        var _img$3 = App$TicTacToe$draw_vertical_lines$(_img$1);
        var _img$4 = App$TicTacToe$draw_horizontal_lines$(_img$3);
        var self = _state$2;
        switch (self._) {
            case 'App.Store.new':
                var $582 = self.local;
                var self = Vector$fold$(null, null, 9n, Pair$new$(_img$4, 8), (_entity$7 => _pair$8 => {
                    var self = _pair$8;
                    switch (self._) {
                        case 'Pair.new':
                            var $585 = self.fst;
                            var $586 = self.snd;
                            var self = _entity$7;
                            switch (self._) {
                                case 'Maybe.some':
                                    var $588 = self.value;
                                    var self = App$TicTacToe$pos$posvector_to_pair$($586);
                                    switch (self._) {
                                        case 'Pair.new':
                                            var $590 = self.fst;
                                            var $591 = self.snd;
                                            var _img$14 = VoxBox$Draw$image$($590, $591, 1, App$TicTacToe$entity$to_assets$($588), $585);
                                            var $592 = Pair$new$(_img$14, (($586 - 1) >>> 0));
                                            var $589 = $592;
                                            break;
                                    };
                                    var $587 = $589;
                                    break;
                                case 'Maybe.none':
                                    var $593 = Pair$new$($585, (($586 - 1) >>> 0));
                                    var $587 = $593;
                                    break;
                            };
                            var $584 = $587;
                            break;
                    };
                    return $584;
                }), (() => {
                    var self = $582;
                    switch (self._) {
                        case 'App.TicTacToe.State.local.new':
                            var $594 = self.board;
                            var $595 = $594;
                            return $595;
                    };
                })());
                switch (self._) {
                    case 'Pair.new':
                        var $596 = self.fst;
                        var self = $582;
                        switch (self._) {
                            case 'App.TicTacToe.State.local.new':
                                var $598 = self.line;
                                var self = $598;
                                switch (self._) {
                                    case 'Maybe.some':
                                        var $600 = self.value;
                                        var _lines$14 = $600;
                                        var self = _lines$14;
                                        switch (self._) {
                                            case 'Pair.new':
                                                var $602 = self.fst;
                                                var $603 = self.snd;
                                                var self = App$TicTacToe$pos$posvector_to_pair$($602);
                                                switch (self._) {
                                                    case 'Pair.new':
                                                        var self = App$TicTacToe$pos$posvector_to_pair$($603);
                                                        switch (self._) {
                                                            case 'Pair.new':
                                                                var $606 = $596;
                                                                var $605 = $606;
                                                                break;
                                                        };
                                                        var $604 = $605;
                                                        break;
                                                };
                                                var $601 = $604;
                                                break;
                                        };
                                        var _img$13 = $601;
                                        break;
                                    case 'Maybe.none':
                                        var $607 = $596;
                                        var _img$13 = $607;
                                        break;
                                };
                                var $599 = DOM$vbox$(Map$from_list$(List$nil), Map$from_list$(List$nil), _img$13);
                                var $597 = $599;
                                break;
                        };
                        var $583 = $597;
                        break;
                };
                var $581 = $583;
                break;
        };
        return $581;
    };
    const App$TicTacToe$draw = x0 => x1 => App$TicTacToe$draw$(x0, x1);

    function IO$(_A$1) {
        var $608 = null;
        return $608;
    };
    const IO = x0 => IO$(x0);
    const App$State$local = Pair$fst;

    function IO$ask$(_query$2, _param$3, _then$4) {
        var $609 = ({
            _: 'IO.ask',
            'query': _query$2,
            'param': _param$3,
            'then': _then$4
        });
        return $609;
    };
    const IO$ask = x0 => x1 => x2 => IO$ask$(x0, x1, x2);

    function IO$bind$(_a$3, _f$4) {
        var self = _a$3;
        switch (self._) {
            case 'IO.end':
                var $611 = self.value;
                var $612 = _f$4($611);
                var $610 = $612;
                break;
            case 'IO.ask':
                var $613 = self.query;
                var $614 = self.param;
                var $615 = self.then;
                var $616 = IO$ask$($613, $614, (_x$8 => {
                    var $617 = IO$bind$($615(_x$8), _f$4);
                    return $617;
                }));
                var $610 = $616;
                break;
        };
        return $610;
    };
    const IO$bind = x0 => x1 => IO$bind$(x0, x1);

    function IO$end$(_value$2) {
        var $618 = ({
            _: 'IO.end',
            'value': _value$2
        });
        return $618;
    };
    const IO$end = x0 => IO$end$(x0);

    function IO$monad$(_new$2) {
        var $619 = _new$2(IO$bind)(IO$end);
        return $619;
    };
    const IO$monad = x0 => IO$monad$(x0);
    const App$pass = IO$monad$((_m$bind$2 => _m$pure$3 => {
        var $620 = _m$pure$3;
        return $620;
    }))(Maybe$none);

    function Maybe$some$(_value$2) {
        var $621 = ({
            _: 'Maybe.some',
            'value': _value$2
        });
        return $621;
    };
    const Maybe$some = x0 => Maybe$some$(x0);

    function App$set_local$(_value$2) {
        var $622 = IO$monad$((_m$bind$3 => _m$pure$4 => {
            var $623 = _m$pure$4;
            return $623;
        }))(Maybe$some$(_value$2));
        return $622;
    };
    const App$set_local = x0 => App$set_local$(x0);

    function App$TicTacToe$pos$mini_pair_to_vector$(_pair$1) {
        var self = _pair$1;
        switch (self._) {
            case 'Pair.new':
                var $625 = self.fst;
                var $626 = self.snd;
                var $627 = (($626 + (($625 * 3) >>> 0)) >>> 0);
                var $624 = $627;
                break;
        };
        return $624;
    };
    const App$TicTacToe$pos$mini_pair_to_vector = x0 => App$TicTacToe$pos$mini_pair_to_vector$(x0);
    const App$TicTacToe$constant$edge = ((App$TicTacToe$constant$size / 12) >>> 0);
    const edge = App$TicTacToe$constant$edge;

    function App$TicTacToe$pos$mouse_to_tile$(_pos$1) {
        var self = (_pos$1 > edge);
        if (self) {
            var self = (_pos$1 < ((App$TicTacToe$constant$size - edge) >>> 0));
            if (self) {
                var $630 = ((_pos$1 / side_tale) >>> 0);
                var $629 = $630;
            } else {
                var $631 = 10;
                var $629 = $631;
            };
            var $628 = $629;
        } else {
            var $632 = 10;
            var $628 = $632;
        };
        return $628;
    };
    const App$TicTacToe$pos$mouse_to_tile = x0 => App$TicTacToe$pos$mouse_to_tile$(x0);

    function App$TicTacToe$pos$pair_to_minipair$(_pair$1) {
        var self = _pair$1;
        switch (self._) {
            case 'Pair.new':
                var $634 = self.fst;
                var $635 = self.snd;
                var $636 = Pair$new$(App$TicTacToe$pos$mouse_to_tile$($634), App$TicTacToe$pos$mouse_to_tile$($635));
                var $633 = $636;
                break;
        };
        return $633;
    };
    const App$TicTacToe$pos$pair_to_minipair = x0 => App$TicTacToe$pos$pair_to_minipair$(x0);

    function App$TicTacToe$pos$pair_to_posvector$(_pair$1) {
        var $637 = App$TicTacToe$pos$mini_pair_to_vector$(App$TicTacToe$pos$pair_to_minipair$(_pair$1));
        return $637;
    };
    const App$TicTacToe$pos$pair_to_posvector = x0 => App$TicTacToe$pos$pair_to_posvector$(x0);

    function Maybe$join$(_m$2) {
        var self = _m$2;
        switch (self._) {
            case 'Maybe.some':
                var $639 = self.value;
                var $640 = $639;
                var $638 = $640;
                break;
            case 'Maybe.none':
                var $641 = Maybe$none;
                var $638 = $641;
                break;
        };
        return $638;
    };
    const Maybe$join = x0 => Maybe$join$(x0);

    function Vector$get_maybe$(_A$1, _size$2, _n$3, _vec$4) {
        var self = _size$2;
        if (self === 0n) {
            var $643 = (_vec$5 => {
                var $644 = Maybe$none;
                return $644;
            });
            var $642 = $643;
        } else {
            var $645 = (self - 1n);
            var $646 = (_vec$6 => {
                var self = _n$3;
                if (self === 0n) {
                    var $648 = _vec$6((_vec$self$7 => {
                        var $649 = null;
                        return $649;
                    }))((_vec$head$7 => _vec$tail$8 => {
                        var $650 = Maybe$some$(_vec$head$7);
                        return $650;
                    }));
                    var $647 = $648;
                } else {
                    var $651 = (self - 1n);
                    var $652 = _vec$6((_vec$self$8 => {
                        var $653 = null;
                        return $653;
                    }))((_vec$head$8 => _vec$tail$9 => {
                        var $654 = Vector$get_maybe$(null, $645, $651, _vec$tail$9);
                        return $654;
                    }));
                    var $647 = $652;
                };
                return $647;
            });
            var $642 = $646;
        };
        var $642 = $642(_vec$4);
        return $642;
    };
    const Vector$get_maybe = x0 => x1 => x2 => x3 => Vector$get_maybe$(x0, x1, x2, x3);
    const U32$to_nat = a0 => (BigInt(a0));
    const Bool$and = a0 => a1 => (a0 && a1);

    function Maybe$is_none$(_m$2) {
        var self = _m$2;
        switch (self._) {
            case 'Maybe.none':
                var $656 = Bool$true;
                var $655 = $656;
                break;
            case 'Maybe.some':
                var $657 = Bool$false;
                var $655 = $657;
                break;
        };
        return $655;
    };
    const Maybe$is_none = x0 => Maybe$is_none$(x0);

    function List$map$(_f$3, _as$4) {
        var self = _as$4;
        switch (self._) {
            case 'List.cons':
                var $659 = self.head;
                var $660 = self.tail;
                var $661 = List$cons$(_f$3($659), List$map$(_f$3, $660));
                var $658 = $661;
                break;
            case 'List.nil':
                var $662 = List$nil;
                var $658 = $662;
                break;
        };
        return $658;
    };
    const List$map = x0 => x1 => List$map$(x0, x1);

    function List$foldr$(_nil$3, _cons$4, _xs$5) {
        var self = _xs$5;
        switch (self._) {
            case 'List.cons':
                var $664 = self.head;
                var $665 = self.tail;
                var $666 = _cons$4($664)(List$foldr$(_nil$3, _cons$4, $665));
                var $663 = $666;
                break;
            case 'List.nil':
                var $667 = _nil$3;
                var $663 = $667;
                break;
        };
        return $663;
    };
    const List$foldr = x0 => x1 => x2 => List$foldr$(x0, x1, x2);

    function Maybe$bind$(_m$3, _f$4) {
        var self = _m$3;
        switch (self._) {
            case 'Maybe.some':
                var $669 = self.value;
                var $670 = _f$4($669);
                var $668 = $670;
                break;
            case 'Maybe.none':
                var $671 = Maybe$none;
                var $668 = $671;
                break;
        };
        return $668;
    };
    const Maybe$bind = x0 => x1 => Maybe$bind$(x0, x1);

    function Maybe$monad$(_new$2) {
        var $672 = _new$2(Maybe$bind)(Maybe$some);
        return $672;
    };
    const Maybe$monad = x0 => Maybe$monad$(x0);

    function App$TicTacToe$entity$equal$(_x$1, _y$2) {
        var self = _x$1;
        switch (self._) {
            case 'App.TicTacToe.Entity.circle':
                var self = _y$2;
                switch (self._) {
                    case 'App.TicTacToe.Entity.circle':
                        var $675 = Bool$true;
                        var $674 = $675;
                        break;
                    case 'App.TicTacToe.Entity.x':
                        var $676 = Bool$false;
                        var $674 = $676;
                        break;
                };
                var $673 = $674;
                break;
            case 'App.TicTacToe.Entity.x':
                var self = _y$2;
                switch (self._) {
                    case 'App.TicTacToe.Entity.circle':
                        var $678 = Bool$false;
                        var $677 = $678;
                        break;
                    case 'App.TicTacToe.Entity.x':
                        var $679 = Bool$true;
                        var $677 = $679;
                        break;
                };
                var $673 = $677;
                break;
        };
        return $673;
    };
    const App$TicTacToe$entity$equal = x0 => x1 => App$TicTacToe$entity$equal$(x0, x1);

    function App$TicTacToe$board$pairs$check_pair$(_pair$1, _vec$2, _e$3) {
        var _n$4 = App$TicTacToe$pos$mini_pair_to_vector$(_pair$1);
        var $680 = Maybe$monad$((_m$bind$5 => _m$pure$6 => {
            var $681 = _m$bind$5;
            return $681;
        }))(Maybe$join$(Vector$get_maybe$(null, 9n, (BigInt(_n$4)), _vec$2)))((_b$5 => {
            var self = App$TicTacToe$entity$equal$(_b$5, _e$3);
            if (self) {
                var $683 = Maybe$some$(_b$5);
                var $682 = $683;
            } else {
                var $684 = Maybe$none;
                var $682 = $684;
            };
            return $682;
        }));
        return $680;
    };
    const App$TicTacToe$board$pairs$check_pair = x0 => x1 => x2 => App$TicTacToe$board$pairs$check_pair$(x0, x1, x2);
    const App$TicTacToe$Entity$circle = ({
        _: 'App.TicTacToe.Entity.circle'
    });

    function Maybe$or$(_a$2, _b$3) {
        var self = _a$2;
        switch (self._) {
            case 'Maybe.some':
                var $686 = self.value;
                var $687 = Maybe$some$($686);
                var $685 = $687;
                break;
            case 'Maybe.none':
                var $688 = _b$3;
                var $685 = $688;
                break;
        };
        return $685;
    };
    const Maybe$or = x0 => x1 => Maybe$or$(x0, x1);

    function App$TicTacToe$board$check_pairs_of_board$(_board$1, _xs$2) {
        var _maybe_entity_x$3 = List$foldr$(Maybe$some$(App$TicTacToe$Entity$x), (_x$3 => _b$4 => {
            var $690 = Maybe$monad$((_m$bind$5 => _m$pure$6 => {
                var $691 = _m$bind$5;
                return $691;
            }))(App$TicTacToe$board$pairs$check_pair$(_x$3, _board$1, App$TicTacToe$Entity$x))((_$5 => {
                var $692 = _b$4;
                return $692;
            }));
            return $690;
        }), _xs$2);
        var _maybe_entity_circle$4 = List$foldr$(Maybe$some$(App$TicTacToe$Entity$circle), (_x$4 => _b$5 => {
            var $693 = Maybe$monad$((_m$bind$6 => _m$pure$7 => {
                var $694 = _m$bind$6;
                return $694;
            }))(App$TicTacToe$board$pairs$check_pair$(_x$4, _board$1, App$TicTacToe$Entity$circle))((_$6 => {
                var $695 = _b$5;
                return $695;
            }));
            return $693;
        }), _xs$2);
        var $689 = Maybe$or$(_maybe_entity_x$3, _maybe_entity_circle$4);
        return $689;
    };
    const App$TicTacToe$board$check_pairs_of_board = x0 => x1 => App$TicTacToe$board$check_pairs_of_board$(x0, x1);

    function List$concat$(_as$2, _bs$3) {
        var self = _as$2;
        switch (self._) {
            case 'List.cons':
                var $697 = self.head;
                var $698 = self.tail;
                var $699 = List$cons$($697, List$concat$($698, _bs$3));
                var $696 = $699;
                break;
            case 'List.nil':
                var $700 = _bs$3;
                var $696 = $700;
                break;
        };
        return $696;
    };
    const List$concat = x0 => x1 => List$concat$(x0, x1);

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
                        var $701 = self.head;
                        var $702 = self.tail;
                        var $703 = List$reverse$go$($702, List$cons$($701, _res$3));
                        return $703;
                    case 'List.nil':
                        var $704 = _res$3;
                        return $704;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const List$reverse$go = x0 => x1 => List$reverse$go$(x0, x1);

    function List$reverse$(_xs$2) {
        var $705 = List$reverse$go$(_xs$2, List$nil);
        return $705;
    };
    const List$reverse = x0 => List$reverse$(x0);

    function List$chunks_of$go$(_len$2, _list$3, _need$4, _chunk$5) {
        var self = _list$3;
        switch (self._) {
            case 'List.cons':
                var $707 = self.head;
                var $708 = self.tail;
                var self = _need$4;
                if (self === 0n) {
                    var _head$8 = List$reverse$(_chunk$5);
                    var _tail$9 = List$chunks_of$go$(_len$2, _list$3, _len$2, List$nil);
                    var $710 = List$cons$(_head$8, _tail$9);
                    var $709 = $710;
                } else {
                    var $711 = (self - 1n);
                    var _chunk$9 = List$cons$($707, _chunk$5);
                    var $712 = List$chunks_of$go$(_len$2, $708, $711, _chunk$9);
                    var $709 = $712;
                };
                var $706 = $709;
                break;
            case 'List.nil':
                var $713 = List$cons$(List$reverse$(_chunk$5), List$nil);
                var $706 = $713;
                break;
        };
        return $706;
    };
    const List$chunks_of$go = x0 => x1 => x2 => x3 => List$chunks_of$go$(x0, x1, x2, x3);

    function List$chunks_of$(_len$2, _xs$3) {
        var $714 = List$chunks_of$go$(_len$2, _xs$3, _len$2, List$nil);
        return $714;
    };
    const List$chunks_of = x0 => x1 => List$chunks_of$(x0, x1);

    function Function$flip$(_f$4, _y$5, _x$6) {
        var $715 = _f$4(_x$6)(_y$5);
        return $715;
    };
    const Function$flip = x0 => x1 => x2 => Function$flip$(x0, x1, x2);

    function List$sequenceA$disjoin$(_A$1) {
        var $716 = List$foldr(List$nil)((_y$2 => _ys$3 => {
            var $717 = List$concat$(List$map$(Function$flip(List$cons)(List$nil), _y$2), _ys$3);
            return $717;
        }));
        return $716;
    };
    const List$sequenceA$disjoin = x0 => List$sequenceA$disjoin$(x0);

    function List$sequenceA$move$(_A$1, _xs$2, _ys$3) {
        var $718 = List$foldr$(List$nil, (_a$4 => _s$5 => {
            var $719 = List$concat$(List$map$(List$cons(_a$4), _ys$3), _s$5);
            return $719;
        }), _xs$2);
        return $718;
    };
    const List$sequenceA$move = x0 => x1 => x2 => List$sequenceA$move$(x0, x1, x2);

    function List$sequenceA$(_A$1, _xs$2) {
        var self = _xs$2;
        switch (self._) {
            case 'List.cons':
                var $721 = self.head;
                var $722 = self.tail;
                var self = $722;
                switch (self._) {
                    case 'List.cons':
                        var $724 = self.head;
                        var $725 = self.tail;
                        var $726 = List$sequenceA$move$(null, $721, List$sequenceA$move$(null, $724, List$sequenceA$(null, $725)));
                        var $723 = $726;
                        break;
                    case 'List.nil':
                        var $727 = List$sequenceA$disjoin$(null)(_xs$2);
                        var $723 = $727;
                        break;
                };
                var $720 = $723;
                break;
            case 'List.nil':
                var $728 = List$nil;
                var $720 = $728;
                break;
        };
        return $720;
    };
    const List$sequenceA = x0 => x1 => List$sequenceA$(x0, x1);

    function App$TicTacToe$board$expand$(_xs$1, _ys$2) {
        var _list$3 = List$foldr$(List$nil, (_y$3 => {
            var $730 = List$concat(List$foldr$(List$nil, (_x$4 => {
                var $731 = List$cons(Pair$new$(_y$3, _x$4));
                return $731;
            }), _ys$2));
            return $730;
        }), _xs$1);
        var _list$4 = List$chunks_of$(3n, _list$3);
        var $729 = List$sequenceA$(null, _list$4);
        return $729;
    };
    const App$TicTacToe$board$expand = x0 => x1 => App$TicTacToe$board$expand$(x0, x1);

    function Pair$swap$(_pair$3) {
        var self = _pair$3;
        switch (self._) {
            case 'Pair.new':
                var $733 = self.fst;
                var $734 = self.snd;
                var $735 = Pair$new$($734, $733);
                var $732 = $735;
                break;
        };
        return $732;
    };
    const Pair$swap = x0 => Pair$swap$(x0);

    function App$TicTacToe$board$transpose$(_xs$1) {
        var $736 = List$map$(Pair$swap, _xs$1);
        return $736;
    };
    const App$TicTacToe$board$transpose = x0 => App$TicTacToe$board$transpose$(x0);

    function List$filter$(_f$2, _xs$3) {
        var self = _xs$3;
        switch (self._) {
            case 'List.cons':
                var $738 = self.head;
                var $739 = self.tail;
                var self = _f$2($738);
                if (self) {
                    var $741 = List$cons$($738, List$filter$(_f$2, $739));
                    var $740 = $741;
                } else {
                    var $742 = List$filter$(_f$2, $739);
                    var $740 = $742;
                };
                var $737 = $740;
                break;
            case 'List.nil':
                var $743 = List$nil;
                var $737 = $743;
                break;
        };
        return $737;
    };
    const List$filter = x0 => x1 => List$filter$(x0, x1);
    const Bool$or = a0 => a1 => (a0 || a1);

    function App$TicTacToe$board$same_line_limitation$(_xs$1) {
        var self = _xs$1;
        switch (self._) {
            case 'List.cons':
                var $745 = self.head;
                var $746 = self.tail;
                var self = $745;
                switch (self._) {
                    case 'Pair.new':
                        var $748 = self.fst;
                        var $749 = self.snd;
                        var $750 = (List$foldr$(Bool$true, (_x$6 => _b$7 => {
                            var $751 = (_b$7 && (Pair$fst$(_x$6) === $748));
                            return $751;
                        }), $746) || List$foldr$(Bool$true, (_x$6 => _b$7 => {
                            var $752 = (_b$7 && (Pair$snd$(_x$6) === $749));
                            return $752;
                        }), $746));
                        var $747 = $750;
                        break;
                };
                var $744 = $747;
                break;
            case 'List.nil':
                var $753 = Bool$false;
                var $744 = $753;
                break;
        };
        return $744;
    };
    const App$TicTacToe$board$same_line_limitation = x0 => App$TicTacToe$board$same_line_limitation$(x0);
    const List$length = a0 => (list_length(a0));

    function App$TicTacToe$board$diagonal_limitation$(_ord$1, _xs$2) {
        var $754 = (List$foldr$(Bool$true, (_x$3 => _b$4 => {
            var $755 = (_b$4 && (Pair$fst$(_x$3) === Pair$snd$(_x$3)));
            return $755;
        }), _xs$2) || List$foldr$(Bool$true, (_x$3 => _b$4 => {
            var $756 = (_b$4 && (((Pair$fst$(_x$3) + Pair$snd$(_x$3)) >>> 0) === (Number(((list_length(_ord$1)) - 1n <= 0n ? 0n : (list_length(_ord$1)) - 1n)) >>> 0)));
            return $756;
        }), _xs$2));
        return $754;
    };
    const App$TicTacToe$board$diagonal_limitation = x0 => x1 => App$TicTacToe$board$diagonal_limitation$(x0, x1);
    const App$TicTacToe$board$expand_nodes = (() => {
        var _ord$1 = List$cons$(0, List$cons$(1, List$cons$(2, List$nil)));
        var _ls$2 = App$TicTacToe$board$expand$(_ord$1, _ord$1);
        var _ls_transpose$3 = List$map$(App$TicTacToe$board$transpose, _ls$2);
        var $757 = List$filter$((_x$4 => {
            var $758 = (App$TicTacToe$board$same_line_limitation$(_x$4) || App$TicTacToe$board$diagonal_limitation$(_ord$1, _x$4));
            return $758;
        }), List$concat$(_ls$2, _ls_transpose$3));
        return $757;
    })();

    function App$TicTacToe$state$check_winner$(_st$1) {
        var self = _st$1;
        switch (self._) {
            case 'App.TicTacToe.State.local.new':
                var $760 = self.board;
                var _plays$6 = List$map$((_x$6 => {
                    var self = App$TicTacToe$board$check_pairs_of_board$($760, _x$6);
                    switch (self._) {
                        case 'Maybe.some':
                            var $763 = self.value;
                            var $764 = Maybe$some$(Pair$new$($763, _x$6));
                            var $762 = $764;
                            break;
                        case 'Maybe.none':
                            var $765 = Maybe$none;
                            var $762 = $765;
                            break;
                    };
                    return $762;
                }), App$TicTacToe$board$expand_nodes);
                var $761 = List$foldr$(Maybe$none, Maybe$or, _plays$6);
                var $759 = $761;
                break;
        };
        return $759;
    };
    const App$TicTacToe$state$check_winner = x0 => App$TicTacToe$state$check_winner$(x0);

    function Vector$simply_insert$(_A$1, _size$2, _n$3, _v$4, _vec$5) {
        var self = _size$2;
        if (self === 0n) {
            var $767 = (_vec$6 => {
                var $768 = Vector$nil(null);
                return $768;
            });
            var $766 = $767;
        } else {
            var $769 = (self - 1n);
            var $770 = (_vec$7 => {
                var self = _n$3;
                if (self === 0n) {
                    var $772 = _vec$7((_vec$self$8 => {
                        var $773 = null;
                        return $773;
                    }))((_vec$head$8 => _vec$tail$9 => {
                        var $774 = Vector$cons(null)($769)(_v$4)(_vec$tail$9);
                        return $774;
                    }));
                    var $771 = $772;
                } else {
                    var $775 = (self - 1n);
                    var $776 = _vec$7((_vec$self$9 => {
                        var $777 = null;
                        return $777;
                    }))((_vec$head$9 => _vec$tail$10 => {
                        var $778 = Vector$cons(null)($769)(_vec$head$9)(Vector$simply_insert$(null, $769, $775, _v$4, _vec$tail$10));
                        return $778;
                    }));
                    var $771 = $776;
                };
                return $771;
            });
            var $766 = $770;
        };
        var $766 = $766(_vec$5);
        return $766;
    };
    const Vector$simply_insert = x0 => x1 => x2 => x3 => x4 => Vector$simply_insert$(x0, x1, x2, x3, x4);

    function App$TicTacToe$board$insert_entity$(_n$1, _e$2, _state$3) {
        var self = _e$2;
        switch (self._) {
            case 'App.TicTacToe.Entity.circle':
            case 'App.TicTacToe.Entity.x':
                var self = _state$3;
                switch (self._) {
                    case 'App.TicTacToe.State.local.new':
                        var $781 = self.player;
                        var $782 = self.line;
                        var $783 = self.info;
                        var $784 = App$TicTacToe$State$local$new$(Vector$simply_insert$(null, 9n, (BigInt(_n$1)), Maybe$some$(_e$2), (() => {
                            var self = _state$3;
                            switch (self._) {
                                case 'App.TicTacToe.State.local.new':
                                    var $785 = self.board;
                                    var $786 = $785;
                                    return $786;
                            };
                        })()), $781, $782, $783);
                        var $780 = $784;
                        break;
                };
                var $779 = $780;
                break;
        };
        return $779;
    };
    const App$TicTacToe$board$insert_entity = x0 => x1 => x2 => App$TicTacToe$board$insert_entity$(x0, x1, x2);

    function List$take$(_n$2, _xs$3) {
        var self = _xs$3;
        switch (self._) {
            case 'List.cons':
                var $788 = self.head;
                var $789 = self.tail;
                var self = _n$2;
                if (self === 0n) {
                    var $791 = List$nil;
                    var $790 = $791;
                } else {
                    var $792 = (self - 1n);
                    var $793 = List$cons$($788, List$take$($792, $789));
                    var $790 = $793;
                };
                var $787 = $790;
                break;
            case 'List.nil':
                var $794 = List$nil;
                var $787 = $794;
                break;
        };
        return $787;
    };
    const List$take = x0 => x1 => List$take$(x0, x1);
    const Debug$log = a0 => a1 => ((console.log(a0), a1()));

    function String$cons$(_head$1, _tail$2) {
        var $795 = (String.fromCharCode(_head$1) + _tail$2);
        return $795;
    };
    const String$cons = x0 => x1 => String$cons$(x0, x1);
    const String$concat = a0 => a1 => (a0 + a1);

    function Maybe$show$(_A$1, _f$2, _m$3) {
        var self = _m$3;
        switch (self._) {
            case 'Maybe.some':
                var $797 = self.value;
                var $798 = ("some" + ("(" + (_f$2($797) + ")")));
                var $796 = $798;
                break;
            case 'Maybe.none':
                var $799 = "none()";
                var $796 = $799;
                break;
        };
        return $796;
    };
    const Maybe$show = x0 => x1 => x2 => Maybe$show$(x0, x1, x2);

    function Pair$show$(_show_a$3, _show_b$4, _pair$5) {
        var self = _pair$5;
        switch (self._) {
            case 'Pair.new':
                var $801 = self.fst;
                var $802 = self.snd;
                var _str$8 = ("(" + _show_a$3($801));
                var _str$9 = (_str$8 + ",");
                var _str$10 = (_str$9 + _show_b$4($802));
                var _str$11 = (_str$10 + ")");
                var $803 = _str$11;
                var $800 = $803;
                break;
        };
        return $800;
    };
    const Pair$show = x0 => x1 => x2 => Pair$show$(x0, x1, x2);

    function List$fold$(_list$2, _nil$4, _cons$5) {
        var self = _list$2;
        switch (self._) {
            case 'List.cons':
                var $805 = self.head;
                var $806 = self.tail;
                var $807 = _cons$5($805)(List$fold$($806, _nil$4, _cons$5));
                var $804 = $807;
                break;
            case 'List.nil':
                var $808 = _nil$4;
                var $804 = $808;
                break;
        };
        return $804;
    };
    const List$fold = x0 => x1 => x2 => List$fold$(x0, x1, x2);

    function Either$(_A$1, _B$2) {
        var $809 = null;
        return $809;
    };
    const Either = x0 => x1 => Either$(x0, x1);

    function Either$left$(_value$3) {
        var $810 = ({
            _: 'Either.left',
            'value': _value$3
        });
        return $810;
    };
    const Either$left = x0 => Either$left$(x0);

    function Either$right$(_value$3) {
        var $811 = ({
            _: 'Either.right',
            'value': _value$3
        });
        return $811;
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
                    var $812 = Either$left$(_n$1);
                    return $812;
                } else {
                    var $813 = (self - 1n);
                    var self = _n$1;
                    if (self === 0n) {
                        var $815 = Either$right$(Nat$succ$($813));
                        var $814 = $815;
                    } else {
                        var $816 = (self - 1n);
                        var $817 = Nat$sub_rem$($816, $813);
                        var $814 = $817;
                    };
                    return $814;
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
                        var $818 = self.value;
                        var $819 = Nat$div_mod$go$($818, _m$2, Nat$succ$(_d$3));
                        return $819;
                    case 'Either.right':
                        var $820 = Pair$new$(_d$3, _n$1);
                        return $820;
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
                        var $821 = self.fst;
                        var $822 = self.snd;
                        var self = $821;
                        if (self === 0n) {
                            var $824 = List$cons$($822, _res$3);
                            var $823 = $824;
                        } else {
                            var $825 = (self - 1n);
                            var $826 = Nat$to_base$go$(_base$1, $821, List$cons$($822, _res$3));
                            var $823 = $826;
                        };
                        return $823;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Nat$to_base$go = x0 => x1 => x2 => Nat$to_base$go$(x0, x1, x2);

    function Nat$to_base$(_base$1, _nat$2) {
        var $827 = Nat$to_base$go$(_base$1, _nat$2, List$nil);
        return $827;
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
                    var $828 = Nat$mod$go$(_n$1, _r$3, _m$2);
                    return $828;
                } else {
                    var $829 = (self - 1n);
                    var self = _n$1;
                    if (self === 0n) {
                        var $831 = _r$3;
                        var $830 = $831;
                    } else {
                        var $832 = (self - 1n);
                        var $833 = Nat$mod$go$($832, $829, Nat$succ$(_r$3));
                        var $830 = $833;
                    };
                    return $830;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Nat$mod$go = x0 => x1 => x2 => Nat$mod$go$(x0, x1, x2);
    const Nat$mod = a0 => a1 => (a0 % a1);
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
                        var $834 = self.head;
                        var $835 = self.tail;
                        var self = _index$2;
                        if (self === 0n) {
                            var $837 = Maybe$some$($834);
                            var $836 = $837;
                        } else {
                            var $838 = (self - 1n);
                            var $839 = List$at$($838, $835);
                            var $836 = $839;
                        };
                        return $836;
                    case 'List.nil':
                        var $840 = Maybe$none;
                        return $840;
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
                    var $843 = self.value;
                    var $844 = $843;
                    var $842 = $844;
                    break;
                case 'Maybe.none':
                    var $845 = 35;
                    var $842 = $845;
                    break;
            };
            var $841 = $842;
        } else {
            var $846 = 35;
            var $841 = $846;
        };
        return $841;
    };
    const Nat$show_digit = x0 => x1 => Nat$show_digit$(x0, x1);

    function Nat$to_string_base$(_base$1, _nat$2) {
        var $847 = List$fold$(Nat$to_base$(_base$1, _nat$2), String$nil, (_n$3 => _str$4 => {
            var $848 = String$cons$(Nat$show_digit$(_base$1, _n$3), _str$4);
            return $848;
        }));
        return $847;
    };
    const Nat$to_string_base = x0 => x1 => Nat$to_string_base$(x0, x1);

    function Nat$show$(_n$1) {
        var $849 = Nat$to_string_base$(10n, _n$1);
        return $849;
    };
    const Nat$show = x0 => Nat$show$(x0);

    function Word$show$(_size$1, _a$2) {
        var _n$3 = Word$to_nat$(_a$2);
        var $850 = (Nat$show$(_n$3) + ("#" + Nat$show$(_size$1)));
        return $850;
    };
    const Word$show = x0 => x1 => Word$show$(x0, x1);
    const U32$show = a0 => (a0 + "#32");

    function App$TicTacToe$board$pairs$choose_free$(_vec$1, _xs$2) {
        var $851 = List$foldr$(Maybe$none, (_x$3 => _y$4 => {
            var _n$5 = App$TicTacToe$pos$mini_pair_to_vector$(_x$3);
            var self = Maybe$join$(Vector$get_maybe$(null, 9n, (BigInt(_n$5)), _vec$1));
            switch (self._) {
                case 'Maybe.none':
                    var $853 = Maybe$some$(_x$3);
                    var $852 = $853;
                    break;
                case 'Maybe.some':
                    var $854 = _y$4;
                    var $852 = $854;
                    break;
            };
            return $852;
        }), _xs$2);
        return $851;
    };
    const App$TicTacToe$board$pairs$choose_free = x0 => x1 => App$TicTacToe$board$pairs$choose_free$(x0, x1);

    function App$TicTacToe$ia$prevent_winner$(_st$1) {
        var self = _st$1;
        switch (self._) {
            case 'App.TicTacToe.State.local.new':
                var $856 = self.board;
                var _pos$6 = List$foldr$(Maybe$none, (_ys$6 => _xs$7 => {
                    var self = App$TicTacToe$board$check_pairs_of_board$((() => {
                        var self = _st$1;
                        switch (self._) {
                            case 'App.TicTacToe.State.local.new':
                                var $859 = self.board;
                                var $860 = $859;
                                return $860;
                        };
                    })(), List$take$(2n, _ys$6));
                    switch (self._) {
                        case 'Maybe.none':
                            var $861 = _xs$7;
                            var $858 = $861;
                            break;
                        case 'Maybe.some':
                            var $862 = Maybe$some$(_ys$6);
                            var $858 = $862;
                            break;
                    };
                    return $858;
                }), App$TicTacToe$board$expand_nodes);
                var $857 = Maybe$monad$((_m$bind$7 => _m$pure$8 => {
                    var $863 = _m$bind$7;
                    return $863;
                }))(_pos$6)((_a$7 => {
                    var $864 = ((console.log(Maybe$show$(null, Pair$show(U32$show)(U32$show), App$TicTacToe$board$pairs$choose_free$($856, _a$7))), (_$8 => {
                        var $865 = App$TicTacToe$board$pairs$choose_free$($856, _a$7);
                        return $865;
                    })()));
                    return $864;
                }));
                var $855 = $857;
                break;
        };
        return $855;
    };
    const App$TicTacToe$ia$prevent_winner = x0 => App$TicTacToe$ia$prevent_winner$(x0);

    function Maybe$is_some$(_m$2) {
        var self = _m$2;
        switch (self._) {
            case 'Maybe.none':
                var $867 = Bool$false;
                var $866 = $867;
                break;
            case 'Maybe.some':
                var $868 = Bool$true;
                var $866 = $868;
                break;
        };
        return $866;
    };
    const Maybe$is_some = x0 => Maybe$is_some$(x0);

    function App$TicTacToe$entity$inverse$(_x$1) {
        var self = _x$1;
        switch (self._) {
            case 'App.TicTacToe.Entity.circle':
                var $870 = App$TicTacToe$Entity$x;
                var $869 = $870;
                break;
            case 'App.TicTacToe.Entity.x':
                var $871 = App$TicTacToe$Entity$circle;
                var $869 = $871;
                break;
        };
        return $869;
    };
    const App$TicTacToe$entity$inverse = x0 => App$TicTacToe$entity$inverse$(x0);

    function App$TicTacToe$ia$weight$(_vec$1, _e$2, _v$3) {
        var $872 = List$foldr$(0, (_x$4 => _y$5 => {
            var _check_entity$6 = (_e$6 => {
                var $874 = Maybe$is_some$(App$TicTacToe$board$pairs$check_pair$(_x$4, _vec$1, _e$6));
                return $874;
            });
            var $873 = ((_y$5 + (() => {
                var self = _check_entity$6(_e$2);
                if (self) {
                    var $875 = 2;
                    return $875;
                } else {
                    var self = _check_entity$6(App$TicTacToe$entity$inverse$(_e$2));
                    if (self) {
                        var $877 = 1;
                        var $876 = $877;
                    } else {
                        var $878 = 0;
                        var $876 = $878;
                    };
                    return $876;
                };
            })()) >>> 0);
            return $873;
        }), _v$3);
        return $872;
    };
    const App$TicTacToe$ia$weight = x0 => x1 => x2 => App$TicTacToe$ia$weight$(x0, x1, x2);

    function List$merge_sort$merge$(_A$1, _f$2, _xs$3, _ys$4) {
        var self = _xs$3;
        switch (self._) {
            case 'List.cons':
                var $880 = self.head;
                var $881 = self.tail;
                var self = _ys$4;
                switch (self._) {
                    case 'List.cons':
                        var $883 = self.head;
                        var $884 = self.tail;
                        var self = _f$2($880)($883);
                        if (self) {
                            var $886 = List$cons$($880, List$merge_sort$merge$(null, _f$2, $881, _ys$4));
                            var $885 = $886;
                        } else {
                            var $887 = List$cons$($883, List$merge_sort$merge$(null, _f$2, _xs$3, $884));
                            var $885 = $887;
                        };
                        var $882 = $885;
                        break;
                    case 'List.nil':
                        var $888 = _xs$3;
                        var $882 = $888;
                        break;
                };
                var $879 = $882;
                break;
            case 'List.nil':
                var $889 = _ys$4;
                var $879 = $889;
                break;
        };
        return $879;
    };
    const List$merge_sort$merge = x0 => x1 => x2 => x3 => List$merge_sort$merge$(x0, x1, x2, x3);

    function List$merge_sort$merge_pair$(_A$1, _f$2, _xs$3) {
        var self = _xs$3;
        switch (self._) {
            case 'List.cons':
                var $891 = self.head;
                var $892 = self.tail;
                var self = $892;
                switch (self._) {
                    case 'List.cons':
                        var $894 = self.head;
                        var $895 = self.tail;
                        var $896 = List$cons$(List$merge_sort$merge$(null, _f$2, $891, $894), List$merge_sort$merge_pair$(null, _f$2, $895));
                        var $893 = $896;
                        break;
                    case 'List.nil':
                        var $897 = _xs$3;
                        var $893 = $897;
                        break;
                };
                var $890 = $893;
                break;
            case 'List.nil':
                var $898 = _xs$3;
                var $890 = $898;
                break;
        };
        return $890;
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
                        var $899 = self.head;
                        var $900 = self.tail;
                        var self = $900;
                        switch (self._) {
                            case 'List.nil':
                                var $902 = $899;
                                var $901 = $902;
                                break;
                            case 'List.cons':
                                var $903 = List$merge_sort$unpack$(null, _f$2, List$merge_sort$merge_pair$(null, _f$2, _xs$3));
                                var $901 = $903;
                                break;
                        };
                        return $901;
                    case 'List.nil':
                        var $904 = List$nil;
                        return $904;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const List$merge_sort$unpack = x0 => x1 => x2 => List$merge_sort$unpack$(x0, x1, x2);

    function List$merge_sort$(_A$1, _f$2, _xs$3) {
        var $905 = List$merge_sort$unpack$(null, _f$2, List$chunks_of$(1n, _xs$3));
        return $905;
    };
    const List$merge_sort = x0 => x1 => x2 => List$merge_sort$(x0, x1, x2);
    const U32$gte = a0 => a1 => (a0 >= a1);

    function App$TicTacToe$board$pairs$get_free_spaces$(_vec$1, _xs$2) {
        var $906 = List$foldr$(0n, (_x$3 => _y$4 => {
            var _n$5 = App$TicTacToe$pos$mini_pair_to_vector$(_x$3);
            var self = Maybe$join$(Vector$get_maybe$(null, 9n, (BigInt(_n$5)), _vec$1));
            switch (self._) {
                case 'Maybe.none':
                    var $908 = _y$4;
                    var $907 = $908;
                    break;
                case 'Maybe.some':
                    var $909 = (_y$4 + 1n);
                    var $907 = $909;
                    break;
            };
            return $907;
        }), _xs$2);
        return $906;
    };
    const App$TicTacToe$board$pairs$get_free_spaces = x0 => x1 => App$TicTacToe$board$pairs$get_free_spaces$(x0, x1);

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
                        var $910 = self.head;
                        var $911 = self.tail;
                        var self = _index$2;
                        if (self === 0n) {
                            var $913 = Maybe$some$($910);
                            var $912 = $913;
                        } else {
                            var $914 = (self - 1n);
                            var $915 = List$get$($914, $911);
                            var $912 = $915;
                        };
                        return $912;
                    case 'List.nil':
                        var $916 = Maybe$none;
                        return $916;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const List$get = x0 => x1 => List$get$(x0, x1);

    function App$TicTacToe$ia$heuristic$(_st$1) {
        var self = _st$1;
        switch (self._) {
            case 'App.TicTacToe.State.local.new':
                var $918 = self.board;
                var $919 = self.player;
                var _fsort$6 = App$TicTacToe$ia$weight($918)(App$TicTacToe$entity$inverse$($919));
                var _sort$7 = List$merge_sort$(null, (_x$7 => _y$8 => {
                    var $921 = (_fsort$6(_x$7) >= _fsort$6(_y$8));
                    return $921;
                }), App$TicTacToe$board$expand_nodes);
                var _msort$8 = List$filter$((_x$8 => {
                    var $922 = (App$TicTacToe$board$pairs$get_free_spaces$($918, _x$8) < 3n);
                    return $922;
                }), _sort$7);
                var $920 = Maybe$monad$((_m$bind$9 => _m$pure$10 => {
                    var $923 = _m$bind$9;
                    return $923;
                }))(List$get$(0n, _msort$8))((_a$9 => {
                    var $924 = App$TicTacToe$board$pairs$choose_free$($918, _a$9);
                    return $924;
                }));
                var $917 = $920;
                break;
        };
        return $917;
    };
    const App$TicTacToe$ia$heuristic = x0 => App$TicTacToe$ia$heuristic$(x0);

    function App$TicTacToe$ia$play$(_st$1) {
        var $925 = Maybe$or$(App$TicTacToe$ia$prevent_winner$(_st$1), App$TicTacToe$ia$heuristic$(_st$1));
        return $925;
    };
    const App$TicTacToe$ia$play = x0 => App$TicTacToe$ia$play$(x0);

    function App$TicTacToe$state$play$(_st$1) {
        var self = _st$1;
        switch (self._) {
            case 'App.TicTacToe.State.local.new':
                var $927 = self.board;
                var $928 = self.player;
                var $929 = self.info;
                var _pos$6 = $929;
                var self = _pos$6;
                switch (self._) {
                    case 'App.EnvInfo.new':
                        var $931 = self.mouse_pos;
                        var _n$9 = App$TicTacToe$pos$pair_to_posvector$($931);
                        var self = Maybe$join$(Vector$get_maybe$(null, 9n, (BigInt(_n$9)), $927));
                        switch (self._) {
                            case 'Maybe.none':
                                var self = ((_n$9 < 10) && Maybe$is_none$(App$TicTacToe$state$check_winner$(_st$1)));
                                if (self) {
                                    var _n$10 = App$TicTacToe$pos$pair_to_posvector$($931);
                                    var _st$11 = App$TicTacToe$board$insert_entity$(_n$10, $928, _st$1);
                                    var self = App$TicTacToe$ia$play$(_st$11);
                                    switch (self._) {
                                        case 'Maybe.some':
                                            var $935 = self.value;
                                            var _n$13 = App$TicTacToe$pos$mini_pair_to_vector$($935);
                                            var $936 = Maybe$some$(App$TicTacToe$board$insert_entity$(_n$13, App$TicTacToe$entity$inverse$($928), _st$11));
                                            var $934 = $936;
                                            break;
                                        case 'Maybe.none':
                                            var $937 = Maybe$some$(_st$11);
                                            var $934 = $937;
                                            break;
                                    };
                                    var $933 = $934;
                                } else {
                                    var $938 = Maybe$some$(_st$1);
                                    var $933 = $938;
                                };
                                var $932 = $933;
                                break;
                            case 'Maybe.some':
                                var $939 = Maybe$none;
                                var $932 = $939;
                                break;
                        };
                        var $930 = $932;
                        break;
                };
                var $926 = $930;
                break;
        };
        return $926;
    };
    const App$TicTacToe$state$play = x0 => App$TicTacToe$state$play$(x0);

    function App$TicTacToe$state$new_turn$(_st$1) {
        var _m$2 = Maybe$monad$((_m$bind$2 => _m$pure$3 => {
            var $941 = _m$bind$2;
            return $941;
        }))(App$TicTacToe$state$check_winner$(_st$1))((_x$2 => {
            var $942 = Maybe$monad$((_m$bind$3 => _m$pure$4 => {
                var $943 = _m$bind$3;
                return $943;
            }))(List$get$(0n, Pair$snd$(_x$2)))((_a$3 => {
                var $944 = Maybe$monad$((_m$bind$4 => _m$pure$5 => {
                    var $945 = _m$bind$4;
                    return $945;
                }))(List$get$(2n, Pair$snd$(_x$2)))((_b$4 => {
                    var $946 = Maybe$monad$((_m$bind$5 => _m$pure$6 => {
                        var $947 = _m$pure$6;
                        return $947;
                    }))(Pair$new$(App$TicTacToe$pos$mini_pair_to_vector$(_a$3), App$TicTacToe$pos$mini_pair_to_vector$(_b$4)));
                    return $946;
                }));
                return $944;
            }));
            return $942;
        }));
        var $940 = Pair$new$((() => {
            var self = _st$1;
            switch (self._) {
                case 'App.TicTacToe.State.local.new':
                    var $948 = self.board;
                    var $949 = self.player;
                    var $950 = self.info;
                    var $951 = App$TicTacToe$State$local$new$($948, $949, _m$2, $950);
                    return $951;
            };
        })(), App$TicTacToe$state$check_winner$(_st$1));
        return $940;
    };
    const App$TicTacToe$state$new_turn = x0 => App$TicTacToe$state$new_turn$(x0);

    function IO$put_string$(_text$1) {
        var $952 = IO$ask$("put_string", _text$1, (_skip$2 => {
            var $953 = IO$end$(Unit$new);
            return $953;
        }));
        return $952;
    };
    const IO$put_string = x0 => IO$put_string$(x0);

    function IO$print$(_text$1) {
        var $954 = IO$put_string$((_text$1 + "\u{a}"));
        return $954;
    };
    const IO$print = x0 => IO$print$(x0);

    function App$print$(_str$2) {
        var $955 = IO$monad$((_m$bind$3 => _m$pure$4 => {
            var $956 = _m$bind$3;
            return $956;
        }))(IO$print$(_str$2))((_$3 => {
            var $957 = App$pass;
            return $957;
        }));
        return $955;
    };
    const App$print = x0 => App$print$(x0);

    function App$TicTacToe$entity$show$(_e$1) {
        var self = _e$1;
        switch (self._) {
            case 'App.TicTacToe.Entity.circle':
                var $959 = "\u{25cb}";
                var $958 = $959;
                break;
            case 'App.TicTacToe.Entity.x':
                var $960 = "x";
                var $958 = $960;
                break;
        };
        return $958;
    };
    const App$TicTacToe$entity$show = x0 => App$TicTacToe$entity$show$(x0);

    function App$TicTacToe$when$(_event$1, _state$2) {
        var self = _event$1;
        switch (self._) {
            case 'App.Event.frame':
                var $962 = self.info;
                var self = _state$2;
                switch (self._) {
                    case 'App.Store.new':
                        var $964 = self.local;
                        var $965 = App$set_local$((() => {
                            var self = $964;
                            switch (self._) {
                                case 'App.TicTacToe.State.local.new':
                                    var $966 = self.board;
                                    var $967 = self.player;
                                    var $968 = self.line;
                                    var $969 = App$TicTacToe$State$local$new$($966, $967, $968, $962);
                                    return $969;
                            };
                        })());
                        var $963 = $965;
                        break;
                };
                var $961 = $963;
                break;
            case 'App.Event.init':
            case 'App.Event.mouse_down':
            case 'App.Event.key_down':
            case 'App.Event.key_up':
            case 'App.Event.mouse_move':
            case 'App.Event.mouse_over':
            case 'App.Event.mouse_click':
            case 'App.Event.input':
                var $970 = App$pass;
                var $961 = $970;
                break;
            case 'App.Event.mouse_up':
                var self = _state$2;
                switch (self._) {
                    case 'App.Store.new':
                        var $972 = self.local;
                        var self = App$TicTacToe$state$play$($972);
                        switch (self._) {
                            case 'Maybe.some':
                                var $974 = self.value;
                                var self = App$TicTacToe$state$new_turn$($974);
                                switch (self._) {
                                    case 'Pair.new':
                                        var $976 = self.fst;
                                        var $977 = self.snd;
                                        var self = $977;
                                        switch (self._) {
                                            case 'Maybe.some':
                                                var $979 = self.value;
                                                var _v$11 = $979;
                                                var self = _v$11;
                                                switch (self._) {
                                                    case 'Pair.new':
                                                        var $981 = self.fst;
                                                        var $982 = IO$monad$((_m$bind$14 => _m$pure$15 => {
                                                            var $983 = _m$bind$14;
                                                            return $983;
                                                        }))(App$print$(("O jogador " + (App$TicTacToe$entity$show$($981) + " ganhou"))))((_$14 => {
                                                            var $984 = App$set_local$($976);
                                                            return $984;
                                                        }));
                                                        var $980 = $982;
                                                        break;
                                                };
                                                var $978 = $980;
                                                break;
                                            case 'Maybe.none':
                                                var $985 = App$set_local$($976);
                                                var $978 = $985;
                                                break;
                                        };
                                        var $975 = $978;
                                        break;
                                };
                                var $973 = $975;
                                break;
                            case 'Maybe.none':
                                var $986 = App$pass;
                                var $973 = $986;
                                break;
                        };
                        var $971 = $973;
                        break;
                };
                var $961 = $971;
                break;
        };
        return $961;
    };
    const App$TicTacToe$when = x0 => x1 => App$TicTacToe$when$(x0, x1);

    function App$TicTacToe$tick$(_tick$1, _glob$2) {
        var $987 = _glob$2;
        return $987;
    };
    const App$TicTacToe$tick = x0 => x1 => App$TicTacToe$tick$(x0, x1);

    function App$TicTacToe$post$(_time$1, _room$2, _addr$3, _data$4, _glob$5) {
        var $988 = _glob$5;
        return $988;
    };
    const App$TicTacToe$post = x0 => x1 => x2 => x3 => x4 => App$TicTacToe$post$(x0, x1, x2, x3, x4);

    function App$new$(_init$2, _draw$3, _when$4, _tick$5, _post$6) {
        var $989 = ({
            _: 'App.new',
            'init': _init$2,
            'draw': _draw$3,
            'when': _when$4,
            'tick': _tick$5,
            'post': _post$6
        });
        return $989;
    };
    const App$new = x0 => x1 => x2 => x3 => x4 => App$new$(x0, x1, x2, x3, x4);
    const App$TicTacToe = (() => {
        var _img$1 = VoxBox$alloc_capacity$(((65536 * 8) >>> 0));
        var _init$2 = App$TicTacToe$init;
        var _draw$3 = App$TicTacToe$draw(_img$1);
        var _when$4 = App$TicTacToe$when;
        var _tick$5 = App$TicTacToe$tick;
        var _post$6 = App$TicTacToe$post;
        var $990 = App$new$(_init$2, _draw$3, _when$4, _tick$5, _post$6);
        return $990;
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
        'Vector': Vector,
        'Vector.nil': Vector$nil,
        'Vector.cons': Vector$cons,
        'Vector.fill': Vector$fill,
        'Maybe': Maybe,
        'Maybe.none': Maybe$none,
        'App.TicTacToe.Entity.x': App$TicTacToe$Entity$x,
        'Pair': Pair,
        'App.EnvInfo.new': App$EnvInfo$new,
        'U32.from_nat': U32$from_nat,
        'App.TicTacToe.State.global.new': App$TicTacToe$State$global$new,
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
        'Word.or': Word$or,
        'Word.shift_right.one.go': Word$shift_right$one$go,
        'Word.shift_right.one': Word$shift_right$one,
        'Word.shift_right': Word$shift_right,
        'Word.subber': Word$subber,
        'Word.sub': Word$sub,
        'Word.div.go': Word$div$go,
        'Word.div': Word$div,
        'I32.div': I32$div,
        'F64.to_i32': F64$to_i32,
        'Word.to_f64': Word$to_f64,
        'U32.to_f64': U32$to_f64,
        'U32.to_i32': U32$to_i32,
        'App.TicTacToe.constant.size': App$TicTacToe$constant$size,
        'side_board': side_board,
        'Word.neg.aux': Word$neg$aux,
        'Word.neg': Word$neg,
        'I32.neg': I32$neg,
        'Int.to_i32': Int$to_i32,
        'Int.new': Int$new,
        'Int.from_nat': Int$from_nat,
        'I32.from_nat': I32$from_nat,
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
        'Vector.fold': Vector$fold,
        'U32.sub': U32$sub,
        'U32.div': U32$div,
        'Word.mod': Word$mod,
        'U32.mod': U32$mod,
        'App.TicTacToe.pos.posvector_to_minipair': App$TicTacToe$pos$posvector_to_minipair,
        'App.TicTacToe.constant.side_tale': App$TicTacToe$constant$side_tale,
        'side_tale': side_tale,
        'App.TicTacToe.constant.side_entity': App$TicTacToe$constant$side_entity,
        'side_entity': side_entity,
        'App.TicTacToe.pos.posvector_to_pair': App$TicTacToe$pos$posvector_to_pair,
        'VoxBox.get_len': VoxBox$get_len,
        'U32.eql': U32$eql,
        'U32.inc': U32$inc,
        'U32.for': U32$for,
        'Array.get': Array$get,
        'Buffer32.get': Buffer32$get,
        'VoxBox.get_pos': VoxBox$get_pos,
        'VoxBox.get_col': VoxBox$get_col,
        'Word.and': Word$and,
        'U32.and': U32$and,
        'U32.shr': U32$shr,
        'VoxBox.Draw.image': VoxBox$Draw$image,
        'U32.length': U32$length,
        'Word.slice': Word$slice,
        'U32.slice': U32$slice,
        'U32.read_base': U32$read_base,
        'VoxBox.parse_byte': VoxBox$parse_byte,
        'VoxBox.parse': VoxBox$parse,
        'App.TicTacToe.Assets.circle': App$TicTacToe$Assets$circle,
        'App.TicTacToe.Assets.x': App$TicTacToe$Assets$x,
        'App.TicTacToe.entity.to_assets': App$TicTacToe$entity$to_assets,
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
        'App.TicTacToe.draw': App$TicTacToe$draw,
        'IO': IO,
        'App.State.local': App$State$local,
        'IO.ask': IO$ask,
        'IO.bind': IO$bind,
        'IO.end': IO$end,
        'IO.monad': IO$monad,
        'App.pass': App$pass,
        'Maybe.some': Maybe$some,
        'App.set_local': App$set_local,
        'App.TicTacToe.pos.mini_pair_to_vector': App$TicTacToe$pos$mini_pair_to_vector,
        'App.TicTacToe.constant.edge': App$TicTacToe$constant$edge,
        'edge': edge,
        'App.TicTacToe.pos.mouse_to_tile': App$TicTacToe$pos$mouse_to_tile,
        'App.TicTacToe.pos.pair_to_minipair': App$TicTacToe$pos$pair_to_minipair,
        'App.TicTacToe.pos.pair_to_posvector': App$TicTacToe$pos$pair_to_posvector,
        'Maybe.join': Maybe$join,
        'Vector.get_maybe': Vector$get_maybe,
        'U32.to_nat': U32$to_nat,
        'Bool.and': Bool$and,
        'Maybe.is_none': Maybe$is_none,
        'List.map': List$map,
        'List.foldr': List$foldr,
        'Maybe.bind': Maybe$bind,
        'Maybe.monad': Maybe$monad,
        'App.TicTacToe.entity.equal': App$TicTacToe$entity$equal,
        'App.TicTacToe.board.pairs.check_pair': App$TicTacToe$board$pairs$check_pair,
        'App.TicTacToe.Entity.circle': App$TicTacToe$Entity$circle,
        'Maybe.or': Maybe$or,
        'App.TicTacToe.board.check_pairs_of_board': App$TicTacToe$board$check_pairs_of_board,
        'List.concat': List$concat,
        'List.reverse.go': List$reverse$go,
        'List.reverse': List$reverse,
        'List.chunks_of.go': List$chunks_of$go,
        'List.chunks_of': List$chunks_of,
        'Function.flip': Function$flip,
        'List.sequenceA.disjoin': List$sequenceA$disjoin,
        'List.sequenceA.move': List$sequenceA$move,
        'List.sequenceA': List$sequenceA,
        'App.TicTacToe.board.expand': App$TicTacToe$board$expand,
        'Pair.swap': Pair$swap,
        'App.TicTacToe.board.transpose': App$TicTacToe$board$transpose,
        'List.filter': List$filter,
        'Bool.or': Bool$or,
        'App.TicTacToe.board.same_line_limitation': App$TicTacToe$board$same_line_limitation,
        'List.length': List$length,
        'App.TicTacToe.board.diagonal_limitation': App$TicTacToe$board$diagonal_limitation,
        'App.TicTacToe.board.expand_nodes': App$TicTacToe$board$expand_nodes,
        'App.TicTacToe.state.check_winner': App$TicTacToe$state$check_winner,
        'Vector.simply_insert': Vector$simply_insert,
        'App.TicTacToe.board.insert_entity': App$TicTacToe$board$insert_entity,
        'List.take': List$take,
        'Debug.log': Debug$log,
        'String.cons': String$cons,
        'String.concat': String$concat,
        'Maybe.show': Maybe$show,
        'Pair.show': Pair$show,
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
        'Nat.gtn': Nat$gtn,
        'Nat.lte': Nat$lte,
        'List.at': List$at,
        'Nat.show_digit': Nat$show_digit,
        'Nat.to_string_base': Nat$to_string_base,
        'Nat.show': Nat$show,
        'Word.show': Word$show,
        'U32.show': U32$show,
        'App.TicTacToe.board.pairs.choose_free': App$TicTacToe$board$pairs$choose_free,
        'App.TicTacToe.ia.prevent_winner': App$TicTacToe$ia$prevent_winner,
        'Maybe.is_some': Maybe$is_some,
        'App.TicTacToe.entity.inverse': App$TicTacToe$entity$inverse,
        'App.TicTacToe.ia.weight': App$TicTacToe$ia$weight,
        'List.merge_sort.merge': List$merge_sort$merge,
        'List.merge_sort.merge_pair': List$merge_sort$merge_pair,
        'List.merge_sort.unpack': List$merge_sort$unpack,
        'List.merge_sort': List$merge_sort,
        'U32.gte': U32$gte,
        'App.TicTacToe.board.pairs.get_free_spaces': App$TicTacToe$board$pairs$get_free_spaces,
        'List.get': List$get,
        'App.TicTacToe.ia.heuristic': App$TicTacToe$ia$heuristic,
        'App.TicTacToe.ia.play': App$TicTacToe$ia$play,
        'App.TicTacToe.state.play': App$TicTacToe$state$play,
        'App.TicTacToe.state.new_turn': App$TicTacToe$state$new_turn,
        'IO.put_string': IO$put_string,
        'IO.print': IO$print,
        'App.print': App$print,
        'App.TicTacToe.entity.show': App$TicTacToe$entity$show,
        'App.TicTacToe.when': App$TicTacToe$when,
        'App.TicTacToe.tick': App$TicTacToe$tick,
        'App.TicTacToe.post': App$TicTacToe$post,
        'App.new': App$new,
        'App.TicTacToe': App$TicTacToe,
    };
})();

/***/ })

}]);
//# sourceMappingURL=373.index.js.map