(self["webpackChunkkind_web"] = self["webpackChunkkind_web"] || []).push([[22],{

/***/ 22:
/***/ ((module) => {

module.exports = (function() {
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
    const inst_u16 = x => x(x0 => word_to_u16(x0));
    const elim_u16 = (x => {
        var $11 = (() => c0 => {
            var self = x;
            switch ('u16') {
                case 'u16':
                    var $9 = u16_to_word(self);
                    var $10 = c0($9);
                    return $10;
            };
        })();
        return $11;
    });
    const inst_u32 = x => x(x0 => word_to_u32(x0));
    const elim_u32 = (x => {
        var $14 = (() => c0 => {
            var self = x;
            switch ('u32') {
                case 'u32':
                    var $12 = u32_to_word(self);
                    var $13 = c0($12);
                    return $13;
            };
        })();
        return $14;
    });
    const inst_u64 = x => x(x0 => word_to_u64(x0));
    const elim_u64 = (x => {
        var $17 = (() => c0 => {
            var self = x;
            switch ('u64') {
                case 'u64':
                    var $15 = u64_to_word(self);
                    var $16 = c0($15);
                    return $16;
            };
        })();
        return $17;
    });
    const inst_string = x => x('')(x0 => x1 => (String.fromCharCode(x0) + x1));
    const elim_string = (x => {
        var $22 = (() => c0 => c1 => {
            var self = x;
            if (self.length === 0) {
                var $18 = c0;
                return $18;
            } else {
                var $19 = self.charCodeAt(0);
                var $20 = self.slice(1);
                var $21 = c1($19)($20);
                return $21;
            };
        })();
        return $22;
    });
    const inst_buffer32 = x => x(x0 => x1 => u32array_to_buffer32(x1));
    const elim_buffer32 = (x => {
        var $26 = (() => c0 => {
            var self = x;
            switch ('b32') {
                case 'b32':
                    var $23 = buffer32_to_depth(self);
                    var $24 = buffer32_to_u32array(self);
                    var $25 = c0($23)($24);
                    return $25;
            };
        })();
        return $26;
    });

    function Buffer32$new$(_depth$1, _array$2) {
        var $27 = u32array_to_buffer32(_array$2);
        return $27;
    };
    const Buffer32$new = x0 => x1 => Buffer32$new$(x0, x1);

    function Array$(_A$1, _depth$2) {
        var $28 = null;
        return $28;
    };
    const Array = x0 => x1 => Array$(x0, x1);

    function Array$tip$(_value$2) {
        var $29 = ({
            _: 'Array.tip',
            'value': _value$2
        });
        return $29;
    };
    const Array$tip = x0 => Array$tip$(x0);

    function Array$tie$(_lft$3, _rgt$4) {
        var $30 = ({
            _: 'Array.tie',
            'lft': _lft$3,
            'rgt': _rgt$4
        });
        return $30;
    };
    const Array$tie = x0 => x1 => Array$tie$(x0, x1);

    function Array$alloc$(_depth$2, _x$3) {
        var self = _depth$2;
        if (self === 0n) {
            var $32 = Array$tip$(_x$3);
            var $31 = $32;
        } else {
            var $33 = (self - 1n);
            var _half$5 = Array$alloc$($33, _x$3);
            var $34 = Array$tie$(_half$5, _half$5);
            var $31 = $34;
        };
        return $31;
    };
    const Array$alloc = x0 => x1 => Array$alloc$(x0, x1);

    function U32$new$(_value$1) {
        var $35 = word_to_u32(_value$1);
        return $35;
    };
    const U32$new = x0 => U32$new$(x0);

    function Word$(_size$1) {
        var $36 = null;
        return $36;
    };
    const Word = x0 => Word$(x0);
    const Word$e = ({
        _: 'Word.e'
    });

    function Word$o$(_pred$2) {
        var $37 = ({
            _: 'Word.o',
            'pred': _pred$2
        });
        return $37;
    };
    const Word$o = x0 => Word$o$(x0);

    function Word$zero$(_size$1) {
        var self = _size$1;
        if (self === 0n) {
            var $39 = Word$e;
            var $38 = $39;
        } else {
            var $40 = (self - 1n);
            var $41 = Word$o$(Word$zero$($40));
            var $38 = $41;
        };
        return $38;
    };
    const Word$zero = x0 => Word$zero$(x0);

    function Nat$succ$(_pred$1) {
        var $42 = 1n + _pred$1;
        return $42;
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
                        var $43 = self.pred;
                        var $44 = Word$bit_length$go$($43, Nat$succ$(_c$3), _n$4);
                        return $44;
                    case 'Word.i':
                        var $45 = self.pred;
                        var $46 = Word$bit_length$go$($45, Nat$succ$(_c$3), Nat$succ$(_c$3));
                        return $46;
                    case 'Word.e':
                        var $47 = _n$4;
                        return $47;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Word$bit_length$go = x0 => x1 => x2 => Word$bit_length$go$(x0, x1, x2);

    function Word$bit_length$(_word$2) {
        var $48 = Word$bit_length$go$(_word$2, 0n, 0n);
        return $48;
    };
    const Word$bit_length = x0 => Word$bit_length$(x0);

    function U32$bit_length$(_size$1) {
        var self = _size$1;
        switch ('u32') {
            case 'u32':
                var $50 = u32_to_word(self);
                var $51 = Word$bit_length$($50);
                var $49 = $51;
                break;
        };
        return $49;
    };
    const U32$bit_length = x0 => U32$bit_length$(x0);

    function Word$i$(_pred$2) {
        var $52 = ({
            _: 'Word.i',
            'pred': _pred$2
        });
        return $52;
    };
    const Word$i = x0 => Word$i$(x0);
    const Bool$false = false;
    const Bool$true = true;

    function Word$shift_left$one$go$(_word$2, _prev$3) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $54 = self.pred;
                var self = _prev$3;
                if (self) {
                    var $56 = Word$i$(Word$shift_left$one$go$($54, Bool$false));
                    var $55 = $56;
                } else {
                    var $57 = Word$o$(Word$shift_left$one$go$($54, Bool$false));
                    var $55 = $57;
                };
                var $53 = $55;
                break;
            case 'Word.i':
                var $58 = self.pred;
                var self = _prev$3;
                if (self) {
                    var $60 = Word$i$(Word$shift_left$one$go$($58, Bool$true));
                    var $59 = $60;
                } else {
                    var $61 = Word$o$(Word$shift_left$one$go$($58, Bool$true));
                    var $59 = $61;
                };
                var $53 = $59;
                break;
            case 'Word.e':
                var $62 = Word$e;
                var $53 = $62;
                break;
        };
        return $53;
    };
    const Word$shift_left$one$go = x0 => x1 => Word$shift_left$one$go$(x0, x1);

    function Word$shift_left$one$(_word$2) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $64 = self.pred;
                var $65 = Word$o$(Word$shift_left$one$go$($64, Bool$false));
                var $63 = $65;
                break;
            case 'Word.i':
                var $66 = self.pred;
                var $67 = Word$o$(Word$shift_left$one$go$($66, Bool$true));
                var $63 = $67;
                break;
            case 'Word.e':
                var $68 = Word$e;
                var $63 = $68;
                break;
        };
        return $63;
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
                    var $69 = _value$3;
                    return $69;
                } else {
                    var $70 = (self - 1n);
                    var $71 = Word$shift_left$($70, Word$shift_left$one$(_value$3));
                    return $71;
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
                var $73 = self.pred;
                var $74 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $76 = self.pred;
                            var $77 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $79 = Word$i$(Word$adder$(_a$pred$10, $76, Bool$false));
                                    var $78 = $79;
                                } else {
                                    var $80 = Word$o$(Word$adder$(_a$pred$10, $76, Bool$false));
                                    var $78 = $80;
                                };
                                return $78;
                            });
                            var $75 = $77;
                            break;
                        case 'Word.i':
                            var $81 = self.pred;
                            var $82 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $84 = Word$o$(Word$adder$(_a$pred$10, $81, Bool$true));
                                    var $83 = $84;
                                } else {
                                    var $85 = Word$i$(Word$adder$(_a$pred$10, $81, Bool$false));
                                    var $83 = $85;
                                };
                                return $83;
                            });
                            var $75 = $82;
                            break;
                        case 'Word.e':
                            var $86 = (_a$pred$8 => {
                                var $87 = Word$e;
                                return $87;
                            });
                            var $75 = $86;
                            break;
                    };
                    var $75 = $75($73);
                    return $75;
                });
                var $72 = $74;
                break;
            case 'Word.i':
                var $88 = self.pred;
                var $89 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
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
                            var $90 = $92;
                            break;
                        case 'Word.i':
                            var $96 = self.pred;
                            var $97 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $99 = Word$i$(Word$adder$(_a$pred$10, $96, Bool$true));
                                    var $98 = $99;
                                } else {
                                    var $100 = Word$o$(Word$adder$(_a$pred$10, $96, Bool$true));
                                    var $98 = $100;
                                };
                                return $98;
                            });
                            var $90 = $97;
                            break;
                        case 'Word.e':
                            var $101 = (_a$pred$8 => {
                                var $102 = Word$e;
                                return $102;
                            });
                            var $90 = $101;
                            break;
                    };
                    var $90 = $90($88);
                    return $90;
                });
                var $72 = $89;
                break;
            case 'Word.e':
                var $103 = (_b$5 => {
                    var $104 = Word$e;
                    return $104;
                });
                var $72 = $103;
                break;
        };
        var $72 = $72(_b$3);
        return $72;
    };
    const Word$adder = x0 => x1 => x2 => Word$adder$(x0, x1, x2);

    function Word$add$(_a$2, _b$3) {
        var $105 = Word$adder$(_a$2, _b$3, Bool$false);
        return $105;
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
                        var $106 = self.pred;
                        var $107 = Word$mul$go$($106, Word$shift_left$(1n, _b$4), _acc$5);
                        return $107;
                    case 'Word.i':
                        var $108 = self.pred;
                        var $109 = Word$mul$go$($108, Word$shift_left$(1n, _b$4), Word$add$(_b$4, _acc$5));
                        return $109;
                    case 'Word.e':
                        var $110 = _acc$5;
                        return $110;
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
                var $112 = self.pred;
                var $113 = Word$o$(Word$to_zero$($112));
                var $111 = $113;
                break;
            case 'Word.i':
                var $114 = self.pred;
                var $115 = Word$o$(Word$to_zero$($114));
                var $111 = $115;
                break;
            case 'Word.e':
                var $116 = Word$e;
                var $111 = $116;
                break;
        };
        return $111;
    };
    const Word$to_zero = x0 => Word$to_zero$(x0);

    function Word$mul$(_a$2, _b$3) {
        var $117 = Word$mul$go$(_a$2, _b$3, Word$to_zero$(_a$2));
        return $117;
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
                    var $118 = _x$4;
                    return $118;
                } else {
                    var $119 = (self - 1n);
                    var $120 = Nat$apply$($119, _f$3, _f$3(_x$4));
                    return $120;
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
                var $122 = self.pred;
                var $123 = Word$i$($122);
                var $121 = $123;
                break;
            case 'Word.i':
                var $124 = self.pred;
                var $125 = Word$o$(Word$inc$($124));
                var $121 = $125;
                break;
            case 'Word.e':
                var $126 = Word$e;
                var $121 = $126;
                break;
        };
        return $121;
    };
    const Word$inc = x0 => Word$inc$(x0);

    function Nat$to_word$(_size$1, _n$2) {
        var $127 = Nat$apply$(_n$2, Word$inc, Word$zero$(_size$1));
        return $127;
    };
    const Nat$to_word = x0 => x1 => Nat$to_word$(x0, x1);
    const Nat$to_u32 = a0 => (Number(a0) >>> 0);

    function VoxBox$new$(_length$1, _capacity$2, _buffer$3) {
        var $128 = ({
            _: 'VoxBox.new',
            'length': _length$1,
            'capacity': _capacity$2,
            'buffer': _buffer$3
        });
        return $128;
    };
    const VoxBox$new = x0 => x1 => x2 => VoxBox$new$(x0, x1, x2);

    function VoxBox$alloc_capacity$(_capacity$1) {
        var _buffer$2 = (new Uint32Array(2 ** Number(U32$bit_length$(((2 * _capacity$1) >>> 0)))));
        var $129 = VoxBox$new$(0, _capacity$1, _buffer$2);
        return $129;
    };
    const VoxBox$alloc_capacity = x0 => VoxBox$alloc_capacity$(x0);
    const App$Drawing$Constants$room = "0x10000000000999";
    const BBL$tip = ({
        _: 'BBL.tip'
    });
    const Map$new = BBL$tip;

    function App$Drawing$Phase$active$(_turn$1) {
        var $130 = ({
            _: 'App.Drawing.Phase.active',
            'turn': _turn$1
        });
        return $130;
    };
    const App$Drawing$Phase$active = x0 => App$Drawing$Phase$active$(x0);
    const List$nil = ({
        _: 'List.nil'
    });

    function BBL$(_K$1, _V$2) {
        var $131 = null;
        return $131;
    };
    const BBL = x0 => x1 => BBL$(x0, x1);

    function Map$(_V$1) {
        var $132 = null;
        return $132;
    };
    const Map = x0 => Map$(x0);

    function App$Drawing$Stage$boards$(_phase$1, _arts$2) {
        var $133 = ({
            _: 'App.Drawing.Stage.boards',
            'phase': _phase$1,
            'arts': _arts$2
        });
        return $133;
    };
    const App$Drawing$Stage$boards = x0 => x1 => App$Drawing$Stage$boards$(x0, x1);

    function App$EnvInfo$new$(_screen_size$1, _mouse_pos$2) {
        var $134 = ({
            _: 'App.EnvInfo.new',
            'screen_size': _screen_size$1,
            'mouse_pos': _mouse_pos$2
        });
        return $134;
    };
    const App$EnvInfo$new = x0 => x1 => App$EnvInfo$new$(x0, x1);

    function Pair$new$(_fst$3, _snd$4) {
        var $135 = ({
            _: 'Pair.new',
            'fst': _fst$3,
            'snd': _snd$4
        });
        return $135;
    };
    const Pair$new = x0 => x1 => Pair$new$(x0, x1);
    const U32$from_nat = a0 => (Number(a0) >>> 0);
    const App$Drawing$Tool$pencil = ({
        _: 'App.Drawing.Tool.pencil'
    });

    function Word$or$(_a$2, _b$3) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $137 = self.pred;
                var $138 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $140 = self.pred;
                            var $141 = (_a$pred$9 => {
                                var $142 = Word$o$(Word$or$(_a$pred$9, $140));
                                return $142;
                            });
                            var $139 = $141;
                            break;
                        case 'Word.i':
                            var $143 = self.pred;
                            var $144 = (_a$pred$9 => {
                                var $145 = Word$i$(Word$or$(_a$pred$9, $143));
                                return $145;
                            });
                            var $139 = $144;
                            break;
                        case 'Word.e':
                            var $146 = (_a$pred$7 => {
                                var $147 = Word$e;
                                return $147;
                            });
                            var $139 = $146;
                            break;
                    };
                    var $139 = $139($137);
                    return $139;
                });
                var $136 = $138;
                break;
            case 'Word.i':
                var $148 = self.pred;
                var $149 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $151 = self.pred;
                            var $152 = (_a$pred$9 => {
                                var $153 = Word$i$(Word$or$(_a$pred$9, $151));
                                return $153;
                            });
                            var $150 = $152;
                            break;
                        case 'Word.i':
                            var $154 = self.pred;
                            var $155 = (_a$pred$9 => {
                                var $156 = Word$i$(Word$or$(_a$pred$9, $154));
                                return $156;
                            });
                            var $150 = $155;
                            break;
                        case 'Word.e':
                            var $157 = (_a$pred$7 => {
                                var $158 = Word$e;
                                return $158;
                            });
                            var $150 = $157;
                            break;
                    };
                    var $150 = $150($148);
                    return $150;
                });
                var $136 = $149;
                break;
            case 'Word.e':
                var $159 = (_b$4 => {
                    var $160 = Word$e;
                    return $160;
                });
                var $136 = $159;
                break;
        };
        var $136 = $136(_b$3);
        return $136;
    };
    const Word$or = x0 => x1 => Word$or$(x0, x1);
    const U32$or = a0 => a1 => (a0 | a1);

    function Word$fold$(_nil$3, _w0$4, _w1$5, _word$6) {
        var self = _word$6;
        switch (self._) {
            case 'Word.o':
                var $162 = self.pred;
                var $163 = _w0$4(Word$fold$(_nil$3, _w0$4, _w1$5, $162));
                var $161 = $163;
                break;
            case 'Word.i':
                var $164 = self.pred;
                var $165 = _w1$5(Word$fold$(_nil$3, _w0$4, _w1$5, $164));
                var $161 = $165;
                break;
            case 'Word.e':
                var $166 = _nil$3;
                var $161 = $166;
                break;
        };
        return $161;
    };
    const Word$fold = x0 => x1 => x2 => x3 => Word$fold$(x0, x1, x2, x3);
    const Nat$add = a0 => a1 => (a0 + a1);
    const Nat$mul = a0 => a1 => (a0 * a1);

    function Word$to_nat$(_word$2) {
        var $167 = Word$fold$(0n, a1 => (2n * a1), (_x$4 => {
            var $168 = Nat$succ$((2n * _x$4));
            return $168;
        }), _word$2);
        return $167;
    };
    const Word$to_nat = x0 => Word$to_nat$(x0);

    function Word$shl$(_n$2, _value$3) {
        var _n_nat$4 = Word$to_nat$(_n$2);
        var $169 = Word$shift_left$(_n_nat$4, _value$3);
        return $169;
    };
    const Word$shl = x0 => x1 => Word$shl$(x0, x1);
    const U32$shl = a0 => a1 => ((a0 << a1) >>> 0);
    const Col32$new = a0 => a1 => a2 => a3 => ((0 | a0 | (a1 << 8) | (a2 << 16) | (a3 << 24)));

    function App$Drawing$Whiteboard$new$(_past$1, _live$2, _future$3) {
        var $170 = ({
            _: 'App.Drawing.Whiteboard.new',
            'past': _past$1,
            'live': _live$2,
            'future': _future$3
        });
        return $170;
    };
    const App$Drawing$Whiteboard$new = x0 => x1 => x2 => App$Drawing$Whiteboard$new$(x0, x1, x2);

    function List$cons$(_head$2, _tail$3) {
        var $171 = ({
            _: 'List.cons',
            'head': _head$2,
            'tail': _tail$3
        });
        return $171;
    };
    const List$cons = x0 => x1 => List$cons$(x0, x1);

    function App$Drawing$Style$new$(_tool$1, _size$2, _color$3) {
        var $172 = ({
            _: 'App.Drawing.Style.new',
            'tool': _tool$1,
            'size': _size$2,
            'color': _color$3
        });
        return $172;
    };
    const App$Drawing$Style$new = x0 => x1 => x2 => App$Drawing$Style$new$(x0, x1, x2);

    function App$Store$new$(_local$2, _global$3) {
        var $173 = ({
            _: 'App.Store.new',
            'local': _local$2,
            'global': _global$3
        });
        return $173;
    };
    const App$Store$new = x0 => x1 => App$Store$new$(x0, x1);
    const App$State$new = Pair$new$(null, null);
    const App$Drawing$State = App$State$new;

    function App$Drawing$State$local$new$(_input$1, _user$2, _drawing$3, _style$4, _whiteboard$5, _env_info$6) {
        var $174 = ({
            _: 'App.Drawing.State.local.new',
            'input': _input$1,
            'user': _user$2,
            'drawing': _drawing$3,
            'style': _style$4,
            'whiteboard': _whiteboard$5,
            'env_info': _env_info$6
        });
        return $174;
    };
    const App$Drawing$State$local$new = x0 => x1 => x2 => x3 => x4 => x5 => App$Drawing$State$local$new$(x0, x1, x2, x3, x4, x5);

    function App$Drawing$State$global$new$(_room$1, _players$2, _stage$3) {
        var $175 = ({
            _: 'App.Drawing.State.global.new',
            'room': _room$1,
            'players': _players$2,
            'stage': _stage$3
        });
        return $175;
    };
    const App$Drawing$State$global$new = x0 => x1 => x2 => App$Drawing$State$global$new$(x0, x1, x2);

    function App$Drawing$App$init$(_img$1) {
        var _room$2 = App$Drawing$Constants$room;
        var _players$3 = Map$new;
        var _phase$4 = App$Drawing$Phase$active$(0n);
        var _arts$5 = List$nil;
        var _stage$6 = App$Drawing$Stage$boards$(_phase$4, List$nil);
        var _input$7 = "";
        var _user$8 = "";
        var _env_info$9 = App$EnvInfo$new$(Pair$new$(256, 256), Pair$new$(0, 0));
        var _tool$10 = App$Drawing$Tool$pencil;
        var _size$11 = 3;
        var _color$12 = ((0 | 255 | (0 << 8) | (0 << 16) | (125 << 24)));
        var _whiteboard$13 = App$Drawing$Whiteboard$new$(List$cons$(_img$1, List$nil), _img$1, List$nil);
        var _style$14 = App$Drawing$Style$new$(_tool$10, _size$11, _color$12);
        var $176 = App$Store$new$(App$Drawing$State$local$new$(_input$7, _user$8, Bool$false, _style$14, _whiteboard$13, _env_info$9), App$Drawing$State$global$new$(_room$2, _players$3, _stage$6));
        return $176;
    };
    const App$Drawing$App$init = x0 => App$Drawing$App$init$(x0);

    function Pair$fst$(_pair$3) {
        var self = _pair$3;
        switch (self._) {
            case 'Pair.new':
                var $178 = self.fst;
                var $179 = $178;
                var $177 = $179;
                break;
        };
        return $177;
    };
    const Pair$fst = x0 => Pair$fst$(x0);
    const App$State$local = Pair$fst;

    function VoxBox$set_length$(_length$1, _img$2) {
        var self = _img$2;
        switch (self._) {
            case 'VoxBox.new':
                var $181 = self.capacity;
                var $182 = self.buffer;
                var $183 = VoxBox$new$(_length$1, $181, $182);
                var $180 = $183;
                break;
        };
        return $180;
    };
    const VoxBox$set_length = x0 => x1 => VoxBox$set_length$(x0, x1);

    function VoxBox$clear$(_img$1) {
        var $184 = VoxBox$set_length$(0, _img$1);
        return $184;
    };
    const VoxBox$clear = x0 => VoxBox$clear$(x0);

    function VoxBox$get_len$(_img$1) {
        var self = _img$1;
        switch (self._) {
            case 'VoxBox.new':
                var $186 = self.length;
                var $187 = $186;
                var $185 = $187;
                break;
        };
        return $185;
    };
    const VoxBox$get_len = x0 => VoxBox$get_len$(x0);

    function Cmp$as_eql$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
            case 'Cmp.gtn':
                var $189 = Bool$false;
                var $188 = $189;
                break;
            case 'Cmp.eql':
                var $190 = Bool$true;
                var $188 = $190;
                break;
        };
        return $188;
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
                var $192 = self.pred;
                var $193 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $195 = self.pred;
                            var $196 = (_a$pred$10 => {
                                var $197 = Word$cmp$go$(_a$pred$10, $195, _c$4);
                                return $197;
                            });
                            var $194 = $196;
                            break;
                        case 'Word.i':
                            var $198 = self.pred;
                            var $199 = (_a$pred$10 => {
                                var $200 = Word$cmp$go$(_a$pred$10, $198, Cmp$ltn);
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
                var $191 = $193;
                break;
            case 'Word.i':
                var $203 = self.pred;
                var $204 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $206 = self.pred;
                            var $207 = (_a$pred$10 => {
                                var $208 = Word$cmp$go$(_a$pred$10, $206, Cmp$gtn);
                                return $208;
                            });
                            var $205 = $207;
                            break;
                        case 'Word.i':
                            var $209 = self.pred;
                            var $210 = (_a$pred$10 => {
                                var $211 = Word$cmp$go$(_a$pred$10, $209, _c$4);
                                return $211;
                            });
                            var $205 = $210;
                            break;
                        case 'Word.e':
                            var $212 = (_a$pred$8 => {
                                var $213 = _c$4;
                                return $213;
                            });
                            var $205 = $212;
                            break;
                    };
                    var $205 = $205($203);
                    return $205;
                });
                var $191 = $204;
                break;
            case 'Word.e':
                var $214 = (_b$5 => {
                    var $215 = _c$4;
                    return $215;
                });
                var $191 = $214;
                break;
        };
        var $191 = $191(_b$3);
        return $191;
    };
    const Word$cmp$go = x0 => x1 => x2 => Word$cmp$go$(x0, x1, x2);
    const Cmp$eql = ({
        _: 'Cmp.eql'
    });

    function Word$cmp$(_a$2, _b$3) {
        var $216 = Word$cmp$go$(_a$2, _b$3, Cmp$eql);
        return $216;
    };
    const Word$cmp = x0 => x1 => Word$cmp$(x0, x1);

    function Word$eql$(_a$2, _b$3) {
        var $217 = Cmp$as_eql$(Word$cmp$(_a$2, _b$3));
        return $217;
    };
    const Word$eql = x0 => x1 => Word$eql$(x0, x1);
    const U32$eql = a0 => a1 => (a0 === a1);
    const U32$inc = a0 => ((a0 + 1) >>> 0);
    const U32$for = a0 => a1 => a2 => a3 => (u32_for(a0, a1, a2, a3));

    function Word$trim$(_new_size$2, _word$3) {
        var self = _new_size$2;
        if (self === 0n) {
            var $219 = Word$e;
            var $218 = $219;
        } else {
            var $220 = (self - 1n);
            var self = _word$3;
            switch (self._) {
                case 'Word.o':
                    var $222 = self.pred;
                    var $223 = Word$o$(Word$trim$($220, $222));
                    var $221 = $223;
                    break;
                case 'Word.i':
                    var $224 = self.pred;
                    var $225 = Word$i$(Word$trim$($220, $224));
                    var $221 = $225;
                    break;
                case 'Word.e':
                    var $226 = Word$o$(Word$trim$($220, Word$e));
                    var $221 = $226;
                    break;
            };
            var $218 = $221;
        };
        return $218;
    };
    const Word$trim = x0 => x1 => Word$trim$(x0, x1);
    const Unit$new = null;

    function Array$extract_tip$(_arr$2) {
        var self = _arr$2;
        switch (self._) {
            case 'Array.tip':
                var $228 = self.value;
                var $229 = $228;
                var $227 = $229;
                break;
            case 'Array.tie':
                var $230 = Unit$new;
                var $227 = $230;
                break;
        };
        return $227;
    };
    const Array$extract_tip = x0 => Array$extract_tip$(x0);

    function Pair$(_A$1, _B$2) {
        var $231 = null;
        return $231;
    };
    const Pair = x0 => x1 => Pair$(x0, x1);

    function Array$extract_tie$(_arr$3) {
        var self = _arr$3;
        switch (self._) {
            case 'Array.tie':
                var $233 = self.lft;
                var $234 = self.rgt;
                var $235 = Pair$new$($233, $234);
                var $232 = $235;
                break;
            case 'Array.tip':
                var $236 = Unit$new;
                var $232 = $236;
                break;
        };
        return $232;
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
                        var $237 = self.pred;
                        var $238 = Word$foldl$(_w0$4(_nil$3), _w0$4, _w1$5, $237);
                        return $238;
                    case 'Word.i':
                        var $239 = self.pred;
                        var $240 = Word$foldl$(_w1$5(_nil$3), _w0$4, _w1$5, $239);
                        return $240;
                    case 'Word.e':
                        var $241 = _nil$3;
                        return $241;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Word$foldl = x0 => x1 => x2 => x3 => Word$foldl$(x0, x1, x2, x3);

    function Array$get$(_idx$3, _arr$4) {
        var $242 = Word$foldl$(Array$extract_tip, (_rec$6 => _arr$7 => {
            var _arr_l$8 = Array$extract_tie$(_arr$7);
            var self = _arr_l$8;
            switch (self._) {
                case 'Pair.new':
                    var $244 = self.fst;
                    var $245 = _rec$6($244);
                    var $243 = $245;
                    break;
            };
            return $243;
        }), (_rec$6 => _arr$7 => {
            var _arr_r$8 = Array$extract_tie$(_arr$7);
            var self = _arr_r$8;
            switch (self._) {
                case 'Pair.new':
                    var $247 = self.snd;
                    var $248 = _rec$6($247);
                    var $246 = $248;
                    break;
            };
            return $246;
        }), _idx$3)(_arr$4);
        return $242;
    };
    const Array$get = x0 => x1 => Array$get$(x0, x1);
    const Buffer32$get = a0 => a1 => ((a1[a0]));
    const VoxBox$get_pos = a0 => a1 => ((a1.buffer[a0 * 2]));
    const U32$add = a0 => a1 => ((a0 + a1) >>> 0);
    const VoxBox$get_col = a0 => a1 => ((a1.buffer[a0 * 2 + 1]));

    function Word$and$(_a$2, _b$3) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $250 = self.pred;
                var $251 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $253 = self.pred;
                            var $254 = (_a$pred$9 => {
                                var $255 = Word$o$(Word$and$(_a$pred$9, $253));
                                return $255;
                            });
                            var $252 = $254;
                            break;
                        case 'Word.i':
                            var $256 = self.pred;
                            var $257 = (_a$pred$9 => {
                                var $258 = Word$o$(Word$and$(_a$pred$9, $256));
                                return $258;
                            });
                            var $252 = $257;
                            break;
                        case 'Word.e':
                            var $259 = (_a$pred$7 => {
                                var $260 = Word$e;
                                return $260;
                            });
                            var $252 = $259;
                            break;
                    };
                    var $252 = $252($250);
                    return $252;
                });
                var $249 = $251;
                break;
            case 'Word.i':
                var $261 = self.pred;
                var $262 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $264 = self.pred;
                            var $265 = (_a$pred$9 => {
                                var $266 = Word$o$(Word$and$(_a$pred$9, $264));
                                return $266;
                            });
                            var $263 = $265;
                            break;
                        case 'Word.i':
                            var $267 = self.pred;
                            var $268 = (_a$pred$9 => {
                                var $269 = Word$i$(Word$and$(_a$pred$9, $267));
                                return $269;
                            });
                            var $263 = $268;
                            break;
                        case 'Word.e':
                            var $270 = (_a$pred$7 => {
                                var $271 = Word$e;
                                return $271;
                            });
                            var $263 = $270;
                            break;
                    };
                    var $263 = $263($261);
                    return $263;
                });
                var $249 = $262;
                break;
            case 'Word.e':
                var $272 = (_b$4 => {
                    var $273 = Word$e;
                    return $273;
                });
                var $249 = $272;
                break;
        };
        var $249 = $249(_b$3);
        return $249;
    };
    const Word$and = x0 => x1 => Word$and$(x0, x1);
    const U32$and = a0 => a1 => (a0 & a1);

    function Word$shift_right$one$go$(_word$2) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $275 = self.pred;
                var $276 = Word$o$(Word$shift_right$one$go$($275));
                var $274 = $276;
                break;
            case 'Word.i':
                var $277 = self.pred;
                var $278 = Word$i$(Word$shift_right$one$go$($277));
                var $274 = $278;
                break;
            case 'Word.e':
                var $279 = Word$o$(Word$e);
                var $274 = $279;
                break;
        };
        return $274;
    };
    const Word$shift_right$one$go = x0 => Word$shift_right$one$go$(x0);

    function Word$shift_right$one$(_word$2) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $281 = self.pred;
                var $282 = Word$shift_right$one$go$($281);
                var $280 = $282;
                break;
            case 'Word.i':
                var $283 = self.pred;
                var $284 = Word$shift_right$one$go$($283);
                var $280 = $284;
                break;
            case 'Word.e':
                var $285 = Word$e;
                var $280 = $285;
                break;
        };
        return $280;
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
                    var $286 = _value$3;
                    return $286;
                } else {
                    var $287 = (self - 1n);
                    var $288 = Word$shift_right$($287, Word$shift_right$one$(_value$3));
                    return $288;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Word$shift_right = x0 => x1 => Word$shift_right$(x0, x1);

    function Word$shr$(_n$2, _value$3) {
        var _n_nat$4 = Word$to_nat$(_n$2);
        var $289 = Word$shift_right$(_n_nat$4, _value$3);
        return $289;
    };
    const Word$shr = x0 => x1 => Word$shr$(x0, x1);
    const U32$shr = a0 => a1 => (a0 >>> a1);
    const Pos32$new = a0 => a1 => a2 => ((0 | a0 | (a1 << 12) | (a2 << 24)));

    function Array$mut$(_idx$3, _f$4, _arr$5) {
        var $290 = Word$foldl$((_arr$6 => {
            var $291 = Array$tip$(_f$4(Array$extract_tip$(_arr$6)));
            return $291;
        }), (_rec$7 => _arr$8 => {
            var self = Array$extract_tie$(_arr$8);
            switch (self._) {
                case 'Pair.new':
                    var $293 = self.fst;
                    var $294 = self.snd;
                    var $295 = Array$tie$(_rec$7($293), $294);
                    var $292 = $295;
                    break;
            };
            return $292;
        }), (_rec$7 => _arr$8 => {
            var self = Array$extract_tie$(_arr$8);
            switch (self._) {
                case 'Pair.new':
                    var $297 = self.fst;
                    var $298 = self.snd;
                    var $299 = Array$tie$($297, _rec$7($298));
                    var $296 = $299;
                    break;
            };
            return $296;
        }), _idx$3)(_arr$5);
        return $290;
    };
    const Array$mut = x0 => x1 => x2 => Array$mut$(x0, x1, x2);

    function Array$set$(_idx$3, _val$4, _arr$5) {
        var $300 = Array$mut$(_idx$3, (_x$6 => {
            var $301 = _val$4;
            return $301;
        }), _arr$5);
        return $300;
    };
    const Array$set = x0 => x1 => x2 => Array$set$(x0, x1, x2);
    const Buffer32$set = a0 => a1 => a2 => ((a2[a0] = a1, a2));
    const VoxBox$set_pos = a0 => a1 => a2 => ((a2.buffer[a0 * 2] = a1, a2));
    const VoxBox$set_col = a0 => a1 => a2 => ((a2.buffer[a0 * 2 + 1] = a1, a2));
    const VoxBox$push = a0 => a1 => a2 => ((a2.buffer[a2.length * 2] = a0, a2.buffer[a2.length * 2 + 1] = a1, a2.length++, a2));

    function VoxBox$Draw$image$(_x$1, _y$2, _z$3, _src$4, _img$5) {
        var _len$6 = VoxBox$get_len$(_src$4);
        var _img$7 = (() => {
            var $303 = _img$5;
            var $304 = 0;
            var $305 = _len$6;
            let _img$8 = $303;
            for (let _i$7 = $304; _i$7 < $305; ++_i$7) {
                var _pos$9 = ((_src$4.buffer[_i$7 * 2]));
                var _col$10 = ((_src$4.buffer[_i$7 * 2 + 1]));
                var _p_x$11 = (_pos$9 & 4095);
                var _p_y$12 = ((_pos$9 & 16773120) >>> 12);
                var _p_z$13 = ((_pos$9 & 4278190080) >>> 24);
                var _p_x$14 = ((_p_x$11 + _x$1) >>> 0);
                var _p_y$15 = ((_p_y$12 + _y$2) >>> 0);
                var _p_z$16 = ((_p_z$13 + _z$3) >>> 0);
                var _pos$17 = ((0 | _p_x$14 | (_p_y$15 << 12) | (_p_z$16 << 24)));
                var $303 = ((_img$8.buffer[_img$8.length * 2] = _pos$17, _img$8.buffer[_img$8.length * 2 + 1] = _col$10, _img$8.length++, _img$8));
                _img$8 = $303;
            };
            return _img$8;
        })();
        var $302 = _img$7;
        return $302;
    };
    const VoxBox$Draw$image = x0 => x1 => x2 => x3 => x4 => VoxBox$Draw$image$(x0, x1, x2, x3, x4);

    function App$Drawing$draw$boards$(_img$1, _state$2) {
        var self = _state$2;
        switch (self._) {
            case 'App.Store.new':
                var $307 = self.local;
                var $308 = $307;
                var _local$3 = $308;
                break;
        };
        var self = _local$3;
        switch (self._) {
            case 'App.Drawing.State.local.new':
                var $309 = self.whiteboard;
                var $310 = $309;
                var _whiteboard$4 = $310;
                break;
        };
        var _img$5 = VoxBox$clear$(_img$1);
        var $306 = VoxBox$Draw$image$(0, 0, 0, (() => {
            var self = _whiteboard$4;
            switch (self._) {
                case 'App.Drawing.Whiteboard.new':
                    var $311 = self.live;
                    var $312 = $311;
                    return $312;
            };
        })(), _img$5);
        return $306;
    };
    const App$Drawing$draw$boards = x0 => x1 => App$Drawing$draw$boards$(x0, x1);

    function DOM$vbox$(_props$1, _style$2, _value$3) {
        var $313 = ({
            _: 'DOM.vbox',
            'props': _props$1,
            'style': _style$2,
            'value': _value$3
        });
        return $313;
    };
    const DOM$vbox = x0 => x1 => x2 => DOM$vbox$(x0, x1, x2);

    function Pair$snd$(_pair$3) {
        var self = _pair$3;
        switch (self._) {
            case 'Pair.new':
                var $315 = self.snd;
                var $316 = $315;
                var $314 = $316;
                break;
        };
        return $314;
    };
    const Pair$snd = x0 => Pair$snd$(x0);

    function BBL$bin$(_size$3, _key$4, _val$5, _left$6, _right$7) {
        var $317 = ({
            _: 'BBL.bin',
            'size': _size$3,
            'key': _key$4,
            'val': _val$5,
            'left': _left$6,
            'right': _right$7
        });
        return $317;
    };
    const BBL$bin = x0 => x1 => x2 => x3 => x4 => BBL$bin$(x0, x1, x2, x3, x4);

    function BBL$singleton$(_key$3, _val$4) {
        var $318 = BBL$bin$(1, _key$3, _val$4, BBL$tip, BBL$tip);
        return $318;
    };
    const BBL$singleton = x0 => x1 => BBL$singleton$(x0, x1);

    function BBL$size$(_map$3) {
        var self = _map$3;
        switch (self._) {
            case 'BBL.bin':
                var $320 = self.size;
                var $321 = $320;
                var $319 = $321;
                break;
            case 'BBL.tip':
                var $322 = 0;
                var $319 = $322;
                break;
        };
        return $319;
    };
    const BBL$size = x0 => BBL$size$(x0);
    const BBL$w = 3;

    function Cmp$as_ltn$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
                var $324 = Bool$true;
                var $323 = $324;
                break;
            case 'Cmp.eql':
            case 'Cmp.gtn':
                var $325 = Bool$false;
                var $323 = $325;
                break;
        };
        return $323;
    };
    const Cmp$as_ltn = x0 => Cmp$as_ltn$(x0);

    function Word$ltn$(_a$2, _b$3) {
        var $326 = Cmp$as_ltn$(Word$cmp$(_a$2, _b$3));
        return $326;
    };
    const Word$ltn = x0 => x1 => Word$ltn$(x0, x1);
    const U32$ltn = a0 => a1 => (a0 < a1);

    function BBL$node$(_key$3, _val$4, _left$5, _right$6) {
        var _size_left$7 = BBL$size$(_left$5);
        var _size_right$8 = BBL$size$(_right$6);
        var _new_size$9 = ((1 + ((_size_left$7 + _size_right$8) >>> 0)) >>> 0);
        var $327 = BBL$bin$(_new_size$9, _key$3, _val$4, _left$5, _right$6);
        return $327;
    };
    const BBL$node = x0 => x1 => x2 => x3 => BBL$node$(x0, x1, x2, x3);

    function Cmp$as_gtn$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
            case 'Cmp.eql':
                var $329 = Bool$false;
                var $328 = $329;
                break;
            case 'Cmp.gtn':
                var $330 = Bool$true;
                var $328 = $330;
                break;
        };
        return $328;
    };
    const Cmp$as_gtn = x0 => Cmp$as_gtn$(x0);

    function Word$gtn$(_a$2, _b$3) {
        var $331 = Cmp$as_gtn$(Word$cmp$(_a$2, _b$3));
        return $331;
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
            var $333 = BBL$node$(_k$3, _v$4, _l$5, _r$6);
            var $332 = $333;
        } else {
            var self = (_size_r$8 > _w_x_size_l$10);
            if (self) {
                var self = _r$6;
                switch (self._) {
                    case 'BBL.bin':
                        var $336 = self.key;
                        var $337 = self.val;
                        var $338 = self.left;
                        var $339 = self.right;
                        var _size_rl$17 = BBL$size$($338);
                        var _size_rr$18 = BBL$size$($339);
                        var self = (_size_rl$17 < _size_rr$18);
                        if (self) {
                            var _new_key$19 = $336;
                            var _new_val$20 = $337;
                            var _new_left$21 = BBL$node$(_k$3, _v$4, _l$5, $338);
                            var _new_right$22 = $339;
                            var $341 = BBL$node$(_new_key$19, _new_val$20, _new_left$21, _new_right$22);
                            var $340 = $341;
                        } else {
                            var self = $338;
                            switch (self._) {
                                case 'BBL.bin':
                                    var $343 = self.key;
                                    var $344 = self.val;
                                    var $345 = self.left;
                                    var $346 = self.right;
                                    var _new_key$24 = $343;
                                    var _new_val$25 = $344;
                                    var _new_left$26 = BBL$node$(_k$3, _v$4, _l$5, $345);
                                    var _new_right$27 = BBL$node$($336, $337, $346, $339);
                                    var $347 = BBL$node$(_new_key$24, _new_val$25, _new_left$26, _new_right$27);
                                    var $342 = $347;
                                    break;
                                case 'BBL.tip':
                                    var $348 = BBL$node$(_k$3, _v$4, _l$5, _r$6);
                                    var $342 = $348;
                                    break;
                            };
                            var $340 = $342;
                        };
                        var $335 = $340;
                        break;
                    case 'BBL.tip':
                        var $349 = BBL$node$(_k$3, _v$4, _l$5, _r$6);
                        var $335 = $349;
                        break;
                };
                var $334 = $335;
            } else {
                var self = (_size_l$7 > _w_x_size_r$11);
                if (self) {
                    var self = _l$5;
                    switch (self._) {
                        case 'BBL.bin':
                            var $352 = self.key;
                            var $353 = self.val;
                            var $354 = self.left;
                            var $355 = self.right;
                            var _size_ll$17 = BBL$size$($354);
                            var _size_lr$18 = BBL$size$($355);
                            var self = (_size_lr$18 < _size_ll$17);
                            if (self) {
                                var _new_key$19 = $352;
                                var _new_val$20 = $353;
                                var _new_left$21 = $354;
                                var _new_right$22 = BBL$node$(_k$3, _v$4, $355, _r$6);
                                var $357 = BBL$node$(_new_key$19, _new_val$20, _new_left$21, _new_right$22);
                                var $356 = $357;
                            } else {
                                var self = $355;
                                switch (self._) {
                                    case 'BBL.bin':
                                        var $359 = self.key;
                                        var $360 = self.val;
                                        var $361 = self.left;
                                        var $362 = self.right;
                                        var _new_key$24 = $359;
                                        var _new_val$25 = $360;
                                        var _new_left$26 = BBL$node$($352, $353, $354, $361);
                                        var _new_right$27 = BBL$node$(_k$3, _v$4, $362, _r$6);
                                        var $363 = BBL$node$(_new_key$24, _new_val$25, _new_left$26, _new_right$27);
                                        var $358 = $363;
                                        break;
                                    case 'BBL.tip':
                                        var $364 = BBL$node$(_k$3, _v$4, _l$5, _r$6);
                                        var $358 = $364;
                                        break;
                                };
                                var $356 = $358;
                            };
                            var $351 = $356;
                            break;
                        case 'BBL.tip':
                            var $365 = BBL$node$(_k$3, _v$4, _l$5, _r$6);
                            var $351 = $365;
                            break;
                    };
                    var $350 = $351;
                } else {
                    var $366 = BBL$node$(_k$3, _v$4, _l$5, _r$6);
                    var $350 = $366;
                };
                var $334 = $350;
            };
            var $332 = $334;
        };
        return $332;
    };
    const BBL$balance = x0 => x1 => x2 => x3 => BBL$balance$(x0, x1, x2, x3);

    function BBL$insert$(_cmp$3, _key$4, _val$5, _map$6) {
        var self = _map$6;
        switch (self._) {
            case 'BBL.bin':
                var $368 = self.key;
                var $369 = self.val;
                var $370 = self.left;
                var $371 = self.right;
                var self = _cmp$3(_key$4)($368);
                switch (self._) {
                    case 'Cmp.ltn':
                        var _new_key$12 = $368;
                        var _new_val$13 = $369;
                        var _new_left$14 = BBL$insert$(_cmp$3, _key$4, _val$5, $370);
                        var _new_right$15 = $371;
                        var $373 = BBL$balance$(_new_key$12, _new_val$13, _new_left$14, _new_right$15);
                        var $372 = $373;
                        break;
                    case 'Cmp.eql':
                        var $374 = BBL$node$(_key$4, _val$5, $370, $371);
                        var $372 = $374;
                        break;
                    case 'Cmp.gtn':
                        var _new_key$12 = $368;
                        var _new_val$13 = $369;
                        var _new_left$14 = $370;
                        var _new_right$15 = BBL$insert$(_cmp$3, _key$4, _val$5, $371);
                        var $375 = BBL$balance$(_new_key$12, _new_val$13, _new_left$14, _new_right$15);
                        var $372 = $375;
                        break;
                };
                var $367 = $372;
                break;
            case 'BBL.tip':
                var $376 = BBL$singleton$(_key$4, _val$5);
                var $367 = $376;
                break;
        };
        return $367;
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
                        var $377 = self.head;
                        var $378 = self.tail;
                        var _key$8 = Pair$fst$($377);
                        var _val$9 = Pair$snd$($377);
                        var _new_acc$10 = BBL$insert$(_cmp$3, _key$8, _val$9, _acc$4);
                        var $379 = BBL$from_list$go$(_cmp$3, _new_acc$10, $378);
                        return $379;
                    case 'List.nil':
                        var $380 = _acc$4;
                        return $380;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const BBL$from_list$go = x0 => x1 => x2 => BBL$from_list$go$(x0, x1, x2);

    function BBL$from_list$(_cmp$3, _xs$4) {
        var $381 = BBL$from_list$go$(_cmp$3, BBL$tip, _xs$4);
        return $381;
    };
    const BBL$from_list = x0 => x1 => BBL$from_list$(x0, x1);
    const U16$ltn = a0 => a1 => (a0 < a1);
    const U16$eql = a0 => a1 => (a0 === a1);

    function U16$cmp$(_a$1, _b$2) {
        var self = (_a$1 < _b$2);
        if (self) {
            var $383 = Cmp$ltn;
            var $382 = $383;
        } else {
            var self = (_a$1 === _b$2);
            if (self) {
                var $385 = Cmp$eql;
                var $384 = $385;
            } else {
                var $386 = Cmp$gtn;
                var $384 = $386;
            };
            var $382 = $384;
        };
        return $382;
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
                        var $388 = Cmp$eql;
                        var $387 = $388;
                    } else {
                        var $389 = self.charCodeAt(0);
                        var $390 = self.slice(1);
                        var $391 = Cmp$ltn;
                        var $387 = $391;
                    };
                    return $387;
                } else {
                    var $392 = self.charCodeAt(0);
                    var $393 = self.slice(1);
                    var self = _b$2;
                    if (self.length === 0) {
                        var $395 = Cmp$gtn;
                        var $394 = $395;
                    } else {
                        var $396 = self.charCodeAt(0);
                        var $397 = self.slice(1);
                        var self = U16$cmp$($392, $396);
                        switch (self._) {
                            case 'Cmp.ltn':
                                var $399 = Cmp$ltn;
                                var $398 = $399;
                                break;
                            case 'Cmp.eql':
                                var $400 = String$cmp$($393, $397);
                                var $398 = $400;
                                break;
                            case 'Cmp.gtn':
                                var $401 = Cmp$gtn;
                                var $398 = $401;
                                break;
                        };
                        var $394 = $398;
                    };
                    return $394;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const String$cmp = x0 => x1 => String$cmp$(x0, x1);

    function Map$from_list$(_xs$2) {
        var $402 = BBL$from_list$(String$cmp, _xs$2);
        return $402;
    };
    const Map$from_list = x0 => Map$from_list$(x0);

    function App$Drawing$App$draw$(_img$1, _state$2) {
        var self = _state$2;
        switch (self._) {
            case 'App.Store.new':
                var _img$5 = App$Drawing$draw$boards$(_img$1, _state$2);
                var $404 = DOM$vbox$(Map$from_list$(List$cons$(Pair$new$("width", "256"), List$nil)), Map$from_list$(List$nil), _img$5);
                var $403 = $404;
                break;
        };
        return $403;
    };
    const App$Drawing$App$draw = x0 => x1 => App$Drawing$App$draw$(x0, x1);
    const App$State$global = Pair$snd;

    function IO$(_A$1) {
        var $405 = null;
        return $405;
    };
    const IO = x0 => IO$(x0);

    function Maybe$(_A$1) {
        var $406 = null;
        return $406;
    };
    const Maybe = x0 => Maybe$(x0);

    function IO$ask$(_query$2, _param$3, _then$4) {
        var $407 = ({
            _: 'IO.ask',
            'query': _query$2,
            'param': _param$3,
            'then': _then$4
        });
        return $407;
    };
    const IO$ask = x0 => x1 => x2 => IO$ask$(x0, x1, x2);

    function IO$bind$(_a$3, _f$4) {
        var self = _a$3;
        switch (self._) {
            case 'IO.end':
                var $409 = self.value;
                var $410 = _f$4($409);
                var $408 = $410;
                break;
            case 'IO.ask':
                var $411 = self.query;
                var $412 = self.param;
                var $413 = self.then;
                var $414 = IO$ask$($411, $412, (_x$8 => {
                    var $415 = IO$bind$($413(_x$8), _f$4);
                    return $415;
                }));
                var $408 = $414;
                break;
        };
        return $408;
    };
    const IO$bind = x0 => x1 => IO$bind$(x0, x1);

    function IO$end$(_value$2) {
        var $416 = ({
            _: 'IO.end',
            'value': _value$2
        });
        return $416;
    };
    const IO$end = x0 => IO$end$(x0);

    function IO$monad$(_new$2) {
        var $417 = _new$2(IO$bind)(IO$end);
        return $417;
    };
    const IO$monad = x0 => IO$monad$(x0);
    const Maybe$none = ({
        _: 'Maybe.none'
    });
    const App$pass = IO$monad$((_m$bind$2 => _m$pure$3 => {
        var $418 = _m$pure$3;
        return $418;
    }))(Maybe$none);
    const Debug$log = a0 => a1 => ((console.log(a0), a1()));
    const Nat$ltn = a0 => a1 => (a0 < a1);
    const Nat$sub = a0 => a1 => (a0 - a1 <= 0n ? 0n : a0 - a1);

    function Cmp$as_gte$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
                var $420 = Bool$false;
                var $419 = $420;
                break;
            case 'Cmp.eql':
            case 'Cmp.gtn':
                var $421 = Bool$true;
                var $419 = $421;
                break;
        };
        return $419;
    };
    const Cmp$as_gte = x0 => Cmp$as_gte$(x0);

    function Word$gte$(_a$2, _b$3) {
        var $422 = Cmp$as_gte$(Word$cmp$(_a$2, _b$3));
        return $422;
    };
    const Word$gte = x0 => x1 => Word$gte$(x0, x1);

    function Word$subber$(_a$2, _b$3, _c$4) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $424 = self.pred;
                var $425 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $427 = self.pred;
                            var $428 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $430 = Word$i$(Word$subber$(_a$pred$10, $427, Bool$true));
                                    var $429 = $430;
                                } else {
                                    var $431 = Word$o$(Word$subber$(_a$pred$10, $427, Bool$false));
                                    var $429 = $431;
                                };
                                return $429;
                            });
                            var $426 = $428;
                            break;
                        case 'Word.i':
                            var $432 = self.pred;
                            var $433 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $435 = Word$o$(Word$subber$(_a$pred$10, $432, Bool$true));
                                    var $434 = $435;
                                } else {
                                    var $436 = Word$i$(Word$subber$(_a$pred$10, $432, Bool$true));
                                    var $434 = $436;
                                };
                                return $434;
                            });
                            var $426 = $433;
                            break;
                        case 'Word.e':
                            var $437 = (_a$pred$8 => {
                                var $438 = Word$e;
                                return $438;
                            });
                            var $426 = $437;
                            break;
                    };
                    var $426 = $426($424);
                    return $426;
                });
                var $423 = $425;
                break;
            case 'Word.i':
                var $439 = self.pred;
                var $440 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $442 = self.pred;
                            var $443 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $445 = Word$o$(Word$subber$(_a$pred$10, $442, Bool$false));
                                    var $444 = $445;
                                } else {
                                    var $446 = Word$i$(Word$subber$(_a$pred$10, $442, Bool$false));
                                    var $444 = $446;
                                };
                                return $444;
                            });
                            var $441 = $443;
                            break;
                        case 'Word.i':
                            var $447 = self.pred;
                            var $448 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $450 = Word$i$(Word$subber$(_a$pred$10, $447, Bool$true));
                                    var $449 = $450;
                                } else {
                                    var $451 = Word$o$(Word$subber$(_a$pred$10, $447, Bool$false));
                                    var $449 = $451;
                                };
                                return $449;
                            });
                            var $441 = $448;
                            break;
                        case 'Word.e':
                            var $452 = (_a$pred$8 => {
                                var $453 = Word$e;
                                return $453;
                            });
                            var $441 = $452;
                            break;
                    };
                    var $441 = $441($439);
                    return $441;
                });
                var $423 = $440;
                break;
            case 'Word.e':
                var $454 = (_b$5 => {
                    var $455 = Word$e;
                    return $455;
                });
                var $423 = $454;
                break;
        };
        var $423 = $423(_b$3);
        return $423;
    };
    const Word$subber = x0 => x1 => x2 => Word$subber$(x0, x1, x2);

    function Word$sub$(_a$2, _b$3) {
        var $456 = Word$subber$(_a$2, _b$3, Bool$false);
        return $456;
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
                    var $457 = Pair$new$(Bool$true, Word$or$(_value$5, _mask$6));
                    var self = $457;
                } else {
                    var $458 = Pair$new$(Bool$false, _value$5);
                    var self = $458;
                };
                switch (self._) {
                    case 'Pair.new':
                        var $459 = self.fst;
                        var $460 = self.snd;
                        var self = _shift$2;
                        if (self === 0n) {
                            var $462 = $460;
                            var $461 = $462;
                        } else {
                            var $463 = (self - 1n);
                            var _new_shift_copy$9 = Word$shift_right$(1n, _shift_copy$4);
                            var self = $459;
                            if (self) {
                                var $465 = Word$div$go$($463, Word$sub$(_sub_copy$3, _shift_copy$4), _new_shift_copy$9, $460);
                                var $464 = $465;
                            } else {
                                var $466 = Word$div$go$($463, _sub_copy$3, _new_shift_copy$9, $460);
                                var $464 = $466;
                            };
                            var $461 = $464;
                        };
                        return $461;
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
            var $468 = Word$to_zero$(_a$2);
            var $467 = $468;
        } else {
            var _shift$6 = (_a_bits$4 - _b_bits$5 <= 0n ? 0n : _a_bits$4 - _b_bits$5);
            var _shift_copy$7 = Word$shift_left$(_shift$6, _b$3);
            var $469 = Word$div$go$(_shift$6, _a$2, _shift_copy$7, Word$to_zero$(_a$2));
            var $467 = $469;
        };
        return $467;
    };
    const Word$div = x0 => x1 => Word$div$(x0, x1);
    const U32$div = a0 => a1 => ((a0 / a1) >>> 0);

    function Word$mod$(_a$2, _b$3) {
        var _q$4 = Word$div$(_a$2, _b$3);
        var $470 = Word$sub$(_a$2, Word$mul$(_b$3, _q$4));
        return $470;
    };
    const Word$mod = x0 => x1 => Word$mod$(x0, x1);
    const U32$mod = a0 => a1 => (a0 % a1);
    const U32$sub = a0 => a1 => ((a0 - a1) >>> 0);

    function VoxBox$Draw$square$(_x$1, _y$2, _z$3, _w$4, _h$5, _col$6, _img$7) {
        var _siz$8 = ((_w$4 * _h$5) >>> 0);
        var _w_2$9 = ((_w$4 / 2) >>> 0);
        var _h_2$10 = ((_h$5 / 2) >>> 0);
        var $471 = (() => {
            var $472 = _img$7;
            var $473 = 0;
            var $474 = _siz$8;
            let _pix$12 = $472;
            for (let _idx$11 = $473; _idx$11 < $474; ++_idx$11) {
                var _v_x$13 = (_idx$11 % _w$4);
                var _v_y$14 = ((_idx$11 / _h$5) >>> 0);
                var _p_x$15 = ((((_x$1 + _v_x$13) >>> 0) - _w_2$9) >>> 0);
                var _p_y$16 = ((((_y$2 + _v_y$14) >>> 0) - _h_2$10) >>> 0);
                var _pos$17 = ((0 | _p_x$15 | (_p_y$16 << 12) | (_z$3 << 24)));
                var _pix$18 = ((_pix$12.buffer[_pix$12.length * 2] = _pos$17, _pix$12.buffer[_pix$12.length * 2 + 1] = _col$6, _pix$12.length++, _pix$12));
                var $472 = _pix$18;
                _pix$12 = $472;
            };
            return _pix$12;
        })();
        return $471;
    };
    const VoxBox$Draw$square = x0 => x1 => x2 => x3 => x4 => x5 => x6 => VoxBox$Draw$square$(x0, x1, x2, x3, x4, x5, x6);

    function App$Drawing$draw$pencil$(_local$1) {
        var $475 = ((console.log("push"), (_$2 => {
            var self = _local$1;
            switch (self._) {
                case 'App.Drawing.State.local.new':
                    var $477 = self.style;
                    var $478 = $477;
                    var _style$3 = $478;
                    break;
            };
            var self = _style$3;
            switch (self._) {
                case 'App.Drawing.Style.new':
                    var $479 = self.size;
                    var $480 = $479;
                    var _size$4 = $480;
                    break;
            };
            var self = _local$1;
            switch (self._) {
                case 'App.Drawing.State.local.new':
                    var $481 = self.whiteboard;
                    var $482 = $481;
                    var _wb$5 = $482;
                    break;
            };
            var self = _local$1;
            switch (self._) {
                case 'App.Drawing.State.local.new':
                    var $483 = self.env_info;
                    var $484 = $483;
                    var self = $484;
                    break;
            };
            switch (self._) {
                case 'App.EnvInfo.new':
                    var $485 = self.mouse_pos;
                    var $486 = $485;
                    var _info$6 = $486;
                    break;
            };
            var self = _style$3;
            switch (self._) {
                case 'App.Drawing.Style.new':
                    var $487 = self.color;
                    var $488 = $487;
                    var _color$7 = $488;
                    break;
            };
            var _new_board$8 = VoxBox$Draw$square$((() => {
                var self = _info$6;
                switch (self._) {
                    case 'Pair.new':
                        var $489 = self.fst;
                        var $490 = $489;
                        return $490;
                };
            })(), (() => {
                var self = _info$6;
                switch (self._) {
                    case 'Pair.new':
                        var $491 = self.snd;
                        var $492 = $491;
                        return $492;
                };
            })(), 0, _size$4, _size$4, _color$7, (() => {
                var self = _wb$5;
                switch (self._) {
                    case 'App.Drawing.Whiteboard.new':
                        var $493 = self.live;
                        var $494 = $493;
                        return $494;
                };
            })());
            var self = _wb$5;
            switch (self._) {
                case 'App.Drawing.Whiteboard.new':
                    var $495 = self.past;
                    var $496 = self.future;
                    var $497 = App$Drawing$Whiteboard$new$($495, _new_board$8, $496);
                    var _new_wb$9 = $497;
                    break;
            };
            var self = _local$1;
            switch (self._) {
                case 'App.Drawing.State.local.new':
                    var $498 = self.input;
                    var $499 = self.user;
                    var $500 = self.drawing;
                    var $501 = self.style;
                    var $502 = self.env_info;
                    var $503 = App$Drawing$State$local$new$($498, $499, $500, $501, _new_wb$9, $502);
                    var $476 = $503;
                    break;
            };
            return $476;
        })()));
        return $475;
    };
    const App$Drawing$draw$pencil = x0 => App$Drawing$draw$pencil$(x0);

    function Maybe$some$(_value$2) {
        var $504 = ({
            _: 'Maybe.some',
            'value': _value$2
        });
        return $504;
    };
    const Maybe$some = x0 => Maybe$some$(x0);

    function App$set_local$(_value$2) {
        var $505 = IO$monad$((_m$bind$3 => _m$pure$4 => {
            var $506 = _m$pure$4;
            return $506;
        }))(Maybe$some$(_value$2));
        return $505;
    };
    const App$set_local = x0 => App$set_local$(x0);

    function List$fold$(_list$2, _nil$4, _cons$5) {
        var self = _list$2;
        switch (self._) {
            case 'List.cons':
                var $508 = self.head;
                var $509 = self.tail;
                var $510 = _cons$5($508)(List$fold$($509, _nil$4, _cons$5));
                var $507 = $510;
                break;
            case 'List.nil':
                var $511 = _nil$4;
                var $507 = $511;
                break;
        };
        return $507;
    };
    const List$fold = x0 => x1 => x2 => List$fold$(x0, x1, x2);

    function Either$(_A$1, _B$2) {
        var $512 = null;
        return $512;
    };
    const Either = x0 => x1 => Either$(x0, x1);

    function Either$left$(_value$3) {
        var $513 = ({
            _: 'Either.left',
            'value': _value$3
        });
        return $513;
    };
    const Either$left = x0 => Either$left$(x0);

    function Either$right$(_value$3) {
        var $514 = ({
            _: 'Either.right',
            'value': _value$3
        });
        return $514;
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
                    var $515 = Either$left$(_n$1);
                    return $515;
                } else {
                    var $516 = (self - 1n);
                    var self = _n$1;
                    if (self === 0n) {
                        var $518 = Either$right$(Nat$succ$($516));
                        var $517 = $518;
                    } else {
                        var $519 = (self - 1n);
                        var $520 = Nat$sub_rem$($519, $516);
                        var $517 = $520;
                    };
                    return $517;
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
                        var $521 = self.value;
                        var $522 = Nat$div_mod$go$($521, _m$2, Nat$succ$(_d$3));
                        return $522;
                    case 'Either.right':
                        var $523 = Pair$new$(_d$3, _n$1);
                        return $523;
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
        var $524 = null;
        return $524;
    };
    const List = x0 => List$(x0);

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
                        var $525 = self.fst;
                        var $526 = self.snd;
                        var self = $525;
                        if (self === 0n) {
                            var $528 = List$cons$($526, _res$3);
                            var $527 = $528;
                        } else {
                            var $529 = (self - 1n);
                            var $530 = Nat$to_base$go$(_base$1, $525, List$cons$($526, _res$3));
                            var $527 = $530;
                        };
                        return $527;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Nat$to_base$go = x0 => x1 => x2 => Nat$to_base$go$(x0, x1, x2);

    function Nat$to_base$(_base$1, _nat$2) {
        var $531 = Nat$to_base$go$(_base$1, _nat$2, List$nil);
        return $531;
    };
    const Nat$to_base = x0 => x1 => Nat$to_base$(x0, x1);
    const String$nil = '';

    function String$cons$(_head$1, _tail$2) {
        var $532 = (String.fromCharCode(_head$1) + _tail$2);
        return $532;
    };
    const String$cons = x0 => x1 => String$cons$(x0, x1);

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
                    var $533 = Nat$mod$go$(_n$1, _r$3, _m$2);
                    return $533;
                } else {
                    var $534 = (self - 1n);
                    var self = _n$1;
                    if (self === 0n) {
                        var $536 = _r$3;
                        var $535 = $536;
                    } else {
                        var $537 = (self - 1n);
                        var $538 = Nat$mod$go$($537, $534, Nat$succ$(_r$3));
                        var $535 = $538;
                    };
                    return $535;
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
                        var $539 = self.head;
                        var $540 = self.tail;
                        var self = _index$2;
                        if (self === 0n) {
                            var $542 = Maybe$some$($539);
                            var $541 = $542;
                        } else {
                            var $543 = (self - 1n);
                            var $544 = List$at$($543, $540);
                            var $541 = $544;
                        };
                        return $541;
                    case 'List.nil':
                        var $545 = Maybe$none;
                        return $545;
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
                    var $548 = self.value;
                    var $549 = $548;
                    var $547 = $549;
                    break;
                case 'Maybe.none':
                    var $550 = 35;
                    var $547 = $550;
                    break;
            };
            var $546 = $547;
        } else {
            var $551 = 35;
            var $546 = $551;
        };
        return $546;
    };
    const Nat$show_digit = x0 => x1 => Nat$show_digit$(x0, x1);

    function Nat$to_string_base$(_base$1, _nat$2) {
        var $552 = List$fold$(Nat$to_base$(_base$1, _nat$2), String$nil, (_n$3 => _str$4 => {
            var $553 = String$cons$(Nat$show_digit$(_base$1, _n$3), _str$4);
            return $553;
        }));
        return $552;
    };
    const Nat$to_string_base = x0 => x1 => Nat$to_string_base$(x0, x1);

    function Nat$show$(_n$1) {
        var $554 = Nat$to_string_base$(10n, _n$1);
        return $554;
    };
    const Nat$show = x0 => Nat$show$(x0);
    const List$length = a0 => (list_length(a0));

    function App$Drawing$Action$local$save$(_local$1) {
        var self = _local$1;
        switch (self._) {
            case 'App.Drawing.State.local.new':
                var $556 = self.whiteboard;
                var self = $556;
                switch (self._) {
                    case 'App.Drawing.Whiteboard.new':
                        var $558 = self.past;
                        var $559 = self.live;
                        var _past$11 = List$cons$($559, $558);
                        var _live$12 = $559;
                        var _future$13 = List$nil;
                        var $560 = ((console.log(Nat$show$((list_length(_past$11)))), (_$14 => {
                            var _whiteboard$15 = App$Drawing$Whiteboard$new$(_past$11, _live$12, _future$13);
                            var self = _local$1;
                            switch (self._) {
                                case 'App.Drawing.State.local.new':
                                    var $562 = self.input;
                                    var $563 = self.user;
                                    var $564 = self.drawing;
                                    var $565 = self.style;
                                    var $566 = self.env_info;
                                    var $567 = App$Drawing$State$local$new$($562, $563, $564, $565, _whiteboard$15, $566);
                                    var $561 = $567;
                                    break;
                            };
                            return $561;
                        })()));
                        var $557 = $560;
                        break;
                };
                var $555 = $557;
                break;
        };
        return $555;
    };
    const App$Drawing$Action$local$save = x0 => App$Drawing$Action$local$save$(x0);

    function List$tail$(_xs$2) {
        var self = _xs$2;
        switch (self._) {
            case 'List.cons':
                var $569 = self.tail;
                var $570 = $569;
                var $568 = $570;
                break;
            case 'List.nil':
                var $571 = List$nil;
                var $568 = $571;
                break;
        };
        return $568;
    };
    const List$tail = x0 => List$tail$(x0);
    const String$concat = a0 => a1 => (a0 + a1);

    function Maybe$default$(_m$2, _a$3) {
        var self = _m$2;
        switch (self._) {
            case 'Maybe.some':
                var $573 = self.value;
                var $574 = $573;
                var $572 = $574;
                break;
            case 'Maybe.none':
                var $575 = _a$3;
                var $572 = $575;
                break;
        };
        return $572;
    };
    const Maybe$default = x0 => x1 => Maybe$default$(x0, x1);

    function List$head$(_xs$2) {
        var self = _xs$2;
        switch (self._) {
            case 'List.cons':
                var $577 = self.head;
                var $578 = Maybe$some$($577);
                var $576 = $578;
                break;
            case 'List.nil':
                var $579 = Maybe$none;
                var $576 = $579;
                break;
        };
        return $576;
    };
    const List$head = x0 => List$head$(x0);

    function App$Drawing$Action$local$ctrl_z$(_local$1) {
        var self = _local$1;
        switch (self._) {
            case 'App.Drawing.State.local.new':
                var $581 = self.whiteboard;
                var self = $581;
                switch (self._) {
                    case 'App.Drawing.Whiteboard.new':
                        var $583 = self.past;
                        var $584 = self.live;
                        var $585 = self.future;
                        var _past$11 = List$tail$($583);
                        var self = _past$11;
                        switch (self._) {
                            case 'List.nil':
                                var $587 = ((console.log("nil"), (_$12 => {
                                    var $588 = _local$1;
                                    return $588;
                                })()));
                                var $586 = $587;
                                break;
                            case 'List.cons':
                                var $589 = ((console.log("cons"), (_$14 => {
                                    var _square$15 = VoxBox$Draw$square$(126, 126, 0, 20, 20, ((0 | 0 | (255 << 8) | (0 << 16) | (125 << 24))), $584);
                                    var $590 = ((console.log(("past_length: " + Nat$show$((list_length(_past$11))))), (_$16 => {
                                        var _live$17 = Maybe$default$(List$head$(_past$11), _square$15);
                                        var _cleared$18 = VoxBox$clear$(_live$17);
                                        var _live$19 = VoxBox$Draw$image$(0, 0, 0, _live$17, _cleared$18);
                                        var _future$20 = List$cons$($584, $585);
                                        var _wb$21 = App$Drawing$Whiteboard$new$(_past$11, _live$19, _future$20);
                                        var self = _local$1;
                                        switch (self._) {
                                            case 'App.Drawing.State.local.new':
                                                var $592 = self.input;
                                                var $593 = self.user;
                                                var $594 = self.drawing;
                                                var $595 = self.style;
                                                var $596 = self.env_info;
                                                var $597 = App$Drawing$State$local$new$($592, $593, $594, $595, _wb$21, $596);
                                                var _new_local$22 = $597;
                                                break;
                                        };
                                        var $591 = _new_local$22;
                                        return $591;
                                    })()));
                                    return $590;
                                })()));
                                var $586 = $589;
                                break;
                        };
                        var $582 = $586;
                        break;
                };
                var $580 = $582;
                break;
        };
        return $580;
    };
    const App$Drawing$Action$local$ctrl_z = x0 => App$Drawing$Action$local$ctrl_z$(x0);

    function App$Drawing$when$boards$(_event$1, _state$2) {
        var self = _state$2;
        switch (self._) {
            case 'App.Store.new':
                var $599 = self.local;
                var $600 = $599;
                var _local$3 = $600;
                break;
        };
        var self = _event$1;
        switch (self._) {
            case 'App.Event.frame':
                var $601 = self.info;
                var self = _local$3;
                switch (self._) {
                    case 'App.Drawing.State.local.new':
                        var $603 = self.drawing;
                        var $604 = $603;
                        var self = $604;
                        break;
                };
                if (self) {
                    var $605 = App$Drawing$draw$pencil$(_local$3);
                    var _new_local$6 = $605;
                } else {
                    var $606 = _local$3;
                    var _new_local$6 = $606;
                };
                var self = _local$3;
                switch (self._) {
                    case 'App.Drawing.State.local.new':
                        var $607 = self.input;
                        var $608 = self.user;
                        var $609 = self.drawing;
                        var $610 = self.style;
                        var $611 = self.whiteboard;
                        var $612 = App$Drawing$State$local$new$($607, $608, $609, $610, $611, $601);
                        var _new_local$7 = $612;
                        break;
                };
                var $602 = App$set_local$(_new_local$7);
                var $598 = $602;
                break;
            case 'App.Event.key_down':
                var $613 = self.code;
                var self = ($613 === 65);
                if (self) {
                    var self = _local$3;
                    switch (self._) {
                        case 'App.Drawing.State.local.new':
                            var $616 = self.style;
                            var $617 = $616;
                            var _style$6 = $617;
                            break;
                    };
                    var self = _style$6;
                    switch (self._) {
                        case 'App.Drawing.Style.new':
                            var $618 = self.tool;
                            var $619 = self.size;
                            var $620 = App$Drawing$Style$new$($618, $619, ((0 | 0 | (0 << 8) | (255 << 16) | (255 << 24))));
                            var _style$7 = $620;
                            break;
                    };
                    var self = _local$3;
                    switch (self._) {
                        case 'App.Drawing.State.local.new':
                            var $621 = self.input;
                            var $622 = self.user;
                            var $623 = self.drawing;
                            var $624 = self.whiteboard;
                            var $625 = self.env_info;
                            var $626 = App$Drawing$State$local$new$($621, $622, $623, _style$7, $624, $625);
                            var _new_local$8 = $626;
                            break;
                    };
                    var $615 = App$set_local$(_new_local$8);
                    var $614 = $615;
                } else {
                    var self = ($613 === 83);
                    if (self) {
                        var self = _local$3;
                        switch (self._) {
                            case 'App.Drawing.State.local.new':
                                var $629 = self.style;
                                var $630 = $629;
                                var _style$6 = $630;
                                break;
                        };
                        var self = _style$6;
                        switch (self._) {
                            case 'App.Drawing.Style.new':
                                var $631 = self.tool;
                                var $632 = self.size;
                                var $633 = App$Drawing$Style$new$($631, $632, ((0 | 255 | (0 << 8) | (0 << 16) | (255 << 24))));
                                var _style$7 = $633;
                                break;
                        };
                        var self = _local$3;
                        switch (self._) {
                            case 'App.Drawing.State.local.new':
                                var $634 = self.input;
                                var $635 = self.user;
                                var $636 = self.drawing;
                                var $637 = self.whiteboard;
                                var $638 = self.env_info;
                                var $639 = App$Drawing$State$local$new$($634, $635, $636, _style$7, $637, $638);
                                var _new_local$8 = $639;
                                break;
                        };
                        var $628 = App$set_local$(_new_local$8);
                        var $627 = $628;
                    } else {
                        var self = ($613 === 90);
                        if (self) {
                            var $641 = App$set_local$(App$Drawing$Action$local$ctrl_z$(_local$3));
                            var $640 = $641;
                        } else {
                            var $642 = App$pass;
                            var $640 = $642;
                        };
                        var $627 = $640;
                    };
                    var $614 = $627;
                };
                var $598 = $614;
                break;
            case 'App.Event.init':
            case 'App.Event.key_up':
            case 'App.Event.mouse_move':
            case 'App.Event.mouse_over':
            case 'App.Event.mouse_click':
            case 'App.Event.input':
                var $643 = App$pass;
                var $598 = $643;
                break;
            case 'App.Event.mouse_down':
                var self = _local$3;
                switch (self._) {
                    case 'App.Drawing.State.local.new':
                        var $645 = self.input;
                        var $646 = self.user;
                        var $647 = self.style;
                        var $648 = self.whiteboard;
                        var $649 = self.env_info;
                        var $650 = App$Drawing$State$local$new$($645, $646, Bool$true, $647, $648, $649);
                        var _new_local$6 = $650;
                        break;
                };
                var $644 = App$set_local$(_new_local$6);
                var $598 = $644;
                break;
            case 'App.Event.mouse_up':
                var self = _local$3;
                switch (self._) {
                    case 'App.Drawing.State.local.new':
                        var $652 = self.input;
                        var $653 = self.user;
                        var $654 = self.style;
                        var $655 = self.whiteboard;
                        var $656 = self.env_info;
                        var $657 = App$Drawing$State$local$new$($652, $653, Bool$false, $654, $655, $656);
                        var _new_local$6 = $657;
                        break;
                };
                var _new_local$7 = App$Drawing$Action$local$save$(_new_local$6);
                var $651 = App$set_local$(_new_local$7);
                var $598 = $651;
                break;
        };
        return $598;
    };
    const App$Drawing$when$boards = x0 => x1 => App$Drawing$when$boards$(x0, x1);

    function App$Drawing$App$when$(_event$1, _state$2) {
        var self = _state$2;
        switch (self._) {
            case 'App.Store.new':
                var $659 = self.global;
                var $660 = $659;
                var self = $660;
                break;
        };
        switch (self._) {
            case 'App.Drawing.State.global.new':
                var $661 = self.stage;
                var $662 = $661;
                var _stage$3 = $662;
                break;
        };
        var self = _stage$3;
        switch (self._) {
            case 'App.Drawing.Stage.start':
            case 'App.Drawing.Stage.menu':
                var $663 = App$pass;
                var $658 = $663;
                break;
            case 'App.Drawing.Stage.boards':
                var $664 = App$Drawing$when$boards$(_event$1, _state$2);
                var $658 = $664;
                break;
        };
        return $658;
    };
    const App$Drawing$App$when = x0 => x1 => App$Drawing$App$when$(x0, x1);

    function App$Drawing$App$tick$(_tick$1, _glob$2) {
        var $665 = _glob$2;
        return $665;
    };
    const App$Drawing$App$tick = x0 => x1 => App$Drawing$App$tick$(x0, x1);

    function App$Drawing$App$post$(_time$1, _room$2, _addr$3, _data$4, _glob$5) {
        var $666 = _glob$5;
        return $666;
    };
    const App$Drawing$App$post = x0 => x1 => x2 => x3 => x4 => App$Drawing$App$post$(x0, x1, x2, x3, x4);

    function App$new$(_init$2, _draw$3, _when$4, _tick$5, _post$6) {
        var $667 = ({
            _: 'App.new',
            'init': _init$2,
            'draw': _draw$3,
            'when': _when$4,
            'tick': _tick$5,
            'post': _post$6
        });
        return $667;
    };
    const App$new = x0 => x1 => x2 => x3 => x4 => App$new$(x0, x1, x2, x3, x4);
    const App$Drawing = (() => {
        var _img$1 = VoxBox$alloc_capacity$(((65536 * 8) >>> 0));
        var _init$2 = App$Drawing$App$init$(_img$1);
        var _draw$3 = App$Drawing$App$draw(_img$1);
        var _when$4 = App$Drawing$App$when;
        var _tick$5 = App$Drawing$App$tick;
        var _post$6 = App$Drawing$App$post;
        var $668 = App$new$(_init$2, _draw$3, _when$4, _tick$5, _post$6);
        return $668;
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
        'App.Drawing.Constants.room': App$Drawing$Constants$room,
        'BBL.tip': BBL$tip,
        'Map.new': Map$new,
        'App.Drawing.Phase.active': App$Drawing$Phase$active,
        'List.nil': List$nil,
        'BBL': BBL,
        'Map': Map,
        'App.Drawing.Stage.boards': App$Drawing$Stage$boards,
        'App.EnvInfo.new': App$EnvInfo$new,
        'Pair.new': Pair$new,
        'U32.from_nat': U32$from_nat,
        'App.Drawing.Tool.pencil': App$Drawing$Tool$pencil,
        'Word.or': Word$or,
        'U32.or': U32$or,
        'Word.fold': Word$fold,
        'Nat.add': Nat$add,
        'Nat.mul': Nat$mul,
        'Word.to_nat': Word$to_nat,
        'Word.shl': Word$shl,
        'U32.shl': U32$shl,
        'Col32.new': Col32$new,
        'App.Drawing.Whiteboard.new': App$Drawing$Whiteboard$new,
        'List.cons': List$cons,
        'App.Drawing.Style.new': App$Drawing$Style$new,
        'App.Store.new': App$Store$new,
        'App.State.new': App$State$new,
        'App.Drawing.State': App$Drawing$State,
        'App.Drawing.State.local.new': App$Drawing$State$local$new,
        'App.Drawing.State.global.new': App$Drawing$State$global$new,
        'App.Drawing.App.init': App$Drawing$App$init,
        'Pair.fst': Pair$fst,
        'App.State.local': App$State$local,
        'VoxBox.set_length': VoxBox$set_length,
        'VoxBox.clear': VoxBox$clear,
        'VoxBox.get_len': VoxBox$get_len,
        'Cmp.as_eql': Cmp$as_eql,
        'Cmp.ltn': Cmp$ltn,
        'Cmp.gtn': Cmp$gtn,
        'Word.cmp.go': Word$cmp$go,
        'Cmp.eql': Cmp$eql,
        'Word.cmp': Word$cmp,
        'Word.eql': Word$eql,
        'U32.eql': U32$eql,
        'U32.inc': U32$inc,
        'U32.for': U32$for,
        'Word.trim': Word$trim,
        'Unit.new': Unit$new,
        'Array.extract_tip': Array$extract_tip,
        'Pair': Pair,
        'Array.extract_tie': Array$extract_tie,
        'Word.foldl': Word$foldl,
        'Array.get': Array$get,
        'Buffer32.get': Buffer32$get,
        'VoxBox.get_pos': VoxBox$get_pos,
        'U32.add': U32$add,
        'VoxBox.get_col': VoxBox$get_col,
        'Word.and': Word$and,
        'U32.and': U32$and,
        'Word.shift_right.one.go': Word$shift_right$one$go,
        'Word.shift_right.one': Word$shift_right$one,
        'Word.shift_right': Word$shift_right,
        'Word.shr': Word$shr,
        'U32.shr': U32$shr,
        'Pos32.new': Pos32$new,
        'Array.mut': Array$mut,
        'Array.set': Array$set,
        'Buffer32.set': Buffer32$set,
        'VoxBox.set_pos': VoxBox$set_pos,
        'VoxBox.set_col': VoxBox$set_col,
        'VoxBox.push': VoxBox$push,
        'VoxBox.Draw.image': VoxBox$Draw$image,
        'App.Drawing.draw.boards': App$Drawing$draw$boards,
        'DOM.vbox': DOM$vbox,
        'Pair.snd': Pair$snd,
        'BBL.bin': BBL$bin,
        'BBL.singleton': BBL$singleton,
        'BBL.size': BBL$size,
        'BBL.w': BBL$w,
        'Cmp.as_ltn': Cmp$as_ltn,
        'Word.ltn': Word$ltn,
        'U32.ltn': U32$ltn,
        'BBL.node': BBL$node,
        'Cmp.as_gtn': Cmp$as_gtn,
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
        'App.Drawing.App.draw': App$Drawing$App$draw,
        'App.State.global': App$State$global,
        'IO': IO,
        'Maybe': Maybe,
        'IO.ask': IO$ask,
        'IO.bind': IO$bind,
        'IO.end': IO$end,
        'IO.monad': IO$monad,
        'Maybe.none': Maybe$none,
        'App.pass': App$pass,
        'Debug.log': Debug$log,
        'Nat.ltn': Nat$ltn,
        'Nat.sub': Nat$sub,
        'Cmp.as_gte': Cmp$as_gte,
        'Word.gte': Word$gte,
        'Word.subber': Word$subber,
        'Word.sub': Word$sub,
        'Word.div.go': Word$div$go,
        'Word.div': Word$div,
        'U32.div': U32$div,
        'Word.mod': Word$mod,
        'U32.mod': U32$mod,
        'U32.sub': U32$sub,
        'VoxBox.Draw.square': VoxBox$Draw$square,
        'App.Drawing.draw.pencil': App$Drawing$draw$pencil,
        'Maybe.some': Maybe$some,
        'App.set_local': App$set_local,
        'List.fold': List$fold,
        'Either': Either,
        'Either.left': Either$left,
        'Either.right': Either$right,
        'Nat.sub_rem': Nat$sub_rem,
        'Nat.div_mod.go': Nat$div_mod$go,
        'Nat.div_mod': Nat$div_mod,
        'List': List,
        'Nat.to_base.go': Nat$to_base$go,
        'Nat.to_base': Nat$to_base,
        'String.nil': String$nil,
        'String.cons': String$cons,
        'Nat.mod.go': Nat$mod$go,
        'Nat.mod': Nat$mod,
        'Bool.and': Bool$and,
        'Nat.gtn': Nat$gtn,
        'Nat.lte': Nat$lte,
        'List.at': List$at,
        'Nat.show_digit': Nat$show_digit,
        'Nat.to_string_base': Nat$to_string_base,
        'Nat.show': Nat$show,
        'List.length': List$length,
        'App.Drawing.Action.local.save': App$Drawing$Action$local$save,
        'List.tail': List$tail,
        'String.concat': String$concat,
        'Maybe.default': Maybe$default,
        'List.head': List$head,
        'App.Drawing.Action.local.ctrl_z': App$Drawing$Action$local$ctrl_z,
        'App.Drawing.when.boards': App$Drawing$when$boards,
        'App.Drawing.App.when': App$Drawing$App$when,
        'App.Drawing.App.tick': App$Drawing$App$tick,
        'App.Drawing.App.post': App$Drawing$App$post,
        'App.new': App$new,
        'App.Drawing': App$Drawing,
    };
})();

/***/ })

}]);
//# sourceMappingURL=22.index.js.map