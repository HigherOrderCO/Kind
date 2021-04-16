(self["webpackChunkkind_web"] = self["webpackChunkkind_web"] || []).push([[927],{

/***/ 927:
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
    const inst_bits = x => x('')(x0 => x0 + '0')(x0 => x0 + '1');
    const elim_bits = (x => {
        var $14 = (() => c0 => c1 => c2 => {
            var self = x;
            switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                case 'o':
                    var $9 = self.slice(0, -1);
                    var $10 = c1($9);
                    return $10;
                case 'i':
                    var $11 = self.slice(0, -1);
                    var $12 = c2($11);
                    return $12;
                case 'e':
                    var $13 = c0;
                    return $13;
            };
        })();
        return $14;
    });
    const inst_u16 = x => x(x0 => word_to_u16(x0));
    const elim_u16 = (x => {
        var $17 = (() => c0 => {
            var self = x;
            switch ('u16') {
                case 'u16':
                    var $15 = u16_to_word(self);
                    var $16 = c0($15);
                    return $16;
            };
        })();
        return $17;
    });
    const inst_u32 = x => x(x0 => word_to_u32(x0));
    const elim_u32 = (x => {
        var $20 = (() => c0 => {
            var self = x;
            switch ('u32') {
                case 'u32':
                    var $18 = u32_to_word(self);
                    var $19 = c0($18);
                    return $19;
            };
        })();
        return $20;
    });
    const inst_u64 = x => x(x0 => word_to_u64(x0));
    const elim_u64 = (x => {
        var $23 = (() => c0 => {
            var self = x;
            switch ('u64') {
                case 'u64':
                    var $21 = u64_to_word(self);
                    var $22 = c0($21);
                    return $22;
            };
        })();
        return $23;
    });
    const inst_string = x => x('')(x0 => x1 => (String.fromCharCode(x0) + x1));
    const elim_string = (x => {
        var $28 = (() => c0 => c1 => {
            var self = x;
            if (self.length === 0) {
                var $24 = c2;
                return $24;
            } else {
                var $25 = self.charCodeAt(0);
                var $26 = self.slice(1);
                var $27 = c2($25)($26);
                return $27;
            };
        })();
        return $28;
    });
    const inst_buffer32 = x => x(x0 => x1 => u32array_to_buffer32(x1));
    const elim_buffer32 = (x => {
        var $32 = (() => c0 => {
            var self = x;
            switch ('b32') {
                case 'b32':
                    var $29 = buffer32_to_depth(self);
                    var $30 = buffer32_to_u32array(self);
                    var $31 = c0($29)($30);
                    return $31;
            };
        })();
        return $32;
    });

    function Buffer32$new$(_depth$1, _array$2) {
        var $33 = u32array_to_buffer32(_array$2);
        return $33;
    };
    const Buffer32$new = x0 => x1 => Buffer32$new$(x0, x1);

    function Array$(_A$1, _depth$2) {
        var $34 = null;
        return $34;
    };
    const Array = x0 => x1 => Array$(x0, x1);

    function Array$tip$(_value$2) {
        var $35 = ({
            _: 'Array.tip',
            'value': _value$2
        });
        return $35;
    };
    const Array$tip = x0 => Array$tip$(x0);

    function Array$tie$(_lft$3, _rgt$4) {
        var $36 = ({
            _: 'Array.tie',
            'lft': _lft$3,
            'rgt': _rgt$4
        });
        return $36;
    };
    const Array$tie = x0 => x1 => Array$tie$(x0, x1);

    function Array$alloc$(_depth$2, _x$3) {
        var self = _depth$2;
        if (self === 0n) {
            var $38 = Array$tip$(_x$3);
            var $37 = $38;
        } else {
            var $39 = (self - 1n);
            var _half$5 = Array$alloc$($39, _x$3);
            var $40 = Array$tie$(_half$5, _half$5);
            var $37 = $40;
        };
        return $37;
    };
    const Array$alloc = x0 => x1 => Array$alloc$(x0, x1);

    function U32$new$(_value$1) {
        var $41 = word_to_u32(_value$1);
        return $41;
    };
    const U32$new = x0 => U32$new$(x0);

    function Word$(_size$1) {
        var $42 = null;
        return $42;
    };
    const Word = x0 => Word$(x0);
    const Word$e = ({
        _: 'Word.e'
    });

    function Word$o$(_pred$2) {
        var $43 = ({
            _: 'Word.o',
            'pred': _pred$2
        });
        return $43;
    };
    const Word$o = x0 => Word$o$(x0);

    function Word$zero$(_size$1) {
        var self = _size$1;
        if (self === 0n) {
            var $45 = Word$e;
            var $44 = $45;
        } else {
            var $46 = (self - 1n);
            var $47 = Word$o$(Word$zero$($46));
            var $44 = $47;
        };
        return $44;
    };
    const Word$zero = x0 => Word$zero$(x0);

    function Nat$succ$(_pred$1) {
        var $48 = 1n + _pred$1;
        return $48;
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
                        var $49 = self.pred;
                        var $50 = Word$bit_length$go$($49, Nat$succ$(_c$3), _n$4);
                        return $50;
                    case 'Word.i':
                        var $51 = self.pred;
                        var $52 = Word$bit_length$go$($51, Nat$succ$(_c$3), Nat$succ$(_c$3));
                        return $52;
                    case 'Word.e':
                        var $53 = _n$4;
                        return $53;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Word$bit_length$go = x0 => x1 => x2 => Word$bit_length$go$(x0, x1, x2);

    function Word$bit_length$(_word$2) {
        var $54 = Word$bit_length$go$(_word$2, 0n, 0n);
        return $54;
    };
    const Word$bit_length = x0 => Word$bit_length$(x0);

    function U32$bit_length$(_size$1) {
        var self = _size$1;
        switch ('u32') {
            case 'u32':
                var $56 = u32_to_word(self);
                var $57 = Word$bit_length$($56);
                var $55 = $57;
                break;
        };
        return $55;
    };
    const U32$bit_length = x0 => U32$bit_length$(x0);

    function Word$i$(_pred$2) {
        var $58 = ({
            _: 'Word.i',
            'pred': _pred$2
        });
        return $58;
    };
    const Word$i = x0 => Word$i$(x0);
    const Bool$false = false;
    const Bool$true = true;

    function Word$shift_left1$aux$(_word$2, _prev$3) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $60 = self.pred;
                var self = _prev$3;
                if (self) {
                    var $62 = Word$i$(Word$shift_left1$aux$($60, Bool$false));
                    var $61 = $62;
                } else {
                    var $63 = Word$o$(Word$shift_left1$aux$($60, Bool$false));
                    var $61 = $63;
                };
                var $59 = $61;
                break;
            case 'Word.i':
                var $64 = self.pred;
                var self = _prev$3;
                if (self) {
                    var $66 = Word$i$(Word$shift_left1$aux$($64, Bool$true));
                    var $65 = $66;
                } else {
                    var $67 = Word$o$(Word$shift_left1$aux$($64, Bool$true));
                    var $65 = $67;
                };
                var $59 = $65;
                break;
            case 'Word.e':
                var $68 = Word$e;
                var $59 = $68;
                break;
        };
        return $59;
    };
    const Word$shift_left1$aux = x0 => x1 => Word$shift_left1$aux$(x0, x1);

    function Word$shift_left1$(_word$2) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $70 = self.pred;
                var $71 = Word$o$(Word$shift_left1$aux$($70, Bool$false));
                var $69 = $71;
                break;
            case 'Word.i':
                var $72 = self.pred;
                var $73 = Word$o$(Word$shift_left1$aux$($72, Bool$true));
                var $69 = $73;
                break;
            case 'Word.e':
                var $74 = Word$e;
                var $69 = $74;
                break;
        };
        return $69;
    };
    const Word$shift_left1 = x0 => Word$shift_left1$(x0);

    function Word$adder$(_a$2, _b$3, _c$4) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $76 = self.pred;
                var $77 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $79 = self.pred;
                            var $80 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $82 = Word$i$(Word$adder$(_a$pred$10, $79, Bool$false));
                                    var $81 = $82;
                                } else {
                                    var $83 = Word$o$(Word$adder$(_a$pred$10, $79, Bool$false));
                                    var $81 = $83;
                                };
                                return $81;
                            });
                            var $78 = $80;
                            break;
                        case 'Word.i':
                            var $84 = self.pred;
                            var $85 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $87 = Word$o$(Word$adder$(_a$pred$10, $84, Bool$true));
                                    var $86 = $87;
                                } else {
                                    var $88 = Word$i$(Word$adder$(_a$pred$10, $84, Bool$false));
                                    var $86 = $88;
                                };
                                return $86;
                            });
                            var $78 = $85;
                            break;
                        case 'Word.e':
                            var $89 = (_a$pred$8 => {
                                var $90 = Word$e;
                                return $90;
                            });
                            var $78 = $89;
                            break;
                    };
                    var $78 = $78($76);
                    return $78;
                });
                var $75 = $77;
                break;
            case 'Word.i':
                var $91 = self.pred;
                var $92 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
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
                            var $93 = $95;
                            break;
                        case 'Word.i':
                            var $99 = self.pred;
                            var $100 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $102 = Word$i$(Word$adder$(_a$pred$10, $99, Bool$true));
                                    var $101 = $102;
                                } else {
                                    var $103 = Word$o$(Word$adder$(_a$pred$10, $99, Bool$true));
                                    var $101 = $103;
                                };
                                return $101;
                            });
                            var $93 = $100;
                            break;
                        case 'Word.e':
                            var $104 = (_a$pred$8 => {
                                var $105 = Word$e;
                                return $105;
                            });
                            var $93 = $104;
                            break;
                    };
                    var $93 = $93($91);
                    return $93;
                });
                var $75 = $92;
                break;
            case 'Word.e':
                var $106 = (_b$5 => {
                    var $107 = Word$e;
                    return $107;
                });
                var $75 = $106;
                break;
        };
        var $75 = $75(_b$3);
        return $75;
    };
    const Word$adder = x0 => x1 => x2 => Word$adder$(x0, x1, x2);

    function Word$add$(_a$2, _b$3) {
        var $108 = Word$adder$(_a$2, _b$3, Bool$false);
        return $108;
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
                        var $109 = self.pred;
                        var $110 = Word$mul$go$($109, Word$shift_left1$(_b$4), _acc$5);
                        return $110;
                    case 'Word.i':
                        var $111 = self.pred;
                        var $112 = Word$mul$go$($111, Word$shift_left1$(_b$4), Word$add$(_b$4, _acc$5));
                        return $112;
                    case 'Word.e':
                        var $113 = _acc$5;
                        return $113;
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
                var $115 = self.pred;
                var $116 = Word$o$(Word$to_zero$($115));
                var $114 = $116;
                break;
            case 'Word.i':
                var $117 = self.pred;
                var $118 = Word$o$(Word$to_zero$($117));
                var $114 = $118;
                break;
            case 'Word.e':
                var $119 = Word$e;
                var $114 = $119;
                break;
        };
        return $114;
    };
    const Word$to_zero = x0 => Word$to_zero$(x0);

    function Word$mul$(_a$2, _b$3) {
        var $120 = Word$mul$go$(_a$2, _b$3, Word$to_zero$(_a$2));
        return $120;
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
                    var $121 = _x$4;
                    return $121;
                } else {
                    var $122 = (self - 1n);
                    var $123 = Nat$apply$($122, _f$3, _f$3(_x$4));
                    return $123;
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
                var $125 = self.pred;
                var $126 = Word$i$($125);
                var $124 = $126;
                break;
            case 'Word.i':
                var $127 = self.pred;
                var $128 = Word$o$(Word$inc$($127));
                var $124 = $128;
                break;
            case 'Word.e':
                var $129 = Word$e;
                var $124 = $129;
                break;
        };
        return $124;
    };
    const Word$inc = x0 => Word$inc$(x0);

    function Nat$to_word$(_n$2) {
        var $130 = Nat$apply$(_n$2, Word$inc, Word$zero$(_size$1));
        return $130;
    };
    const Nat$to_word = x0 => Nat$to_word$(x0);
    const Nat$to_u32 = a0 => (Number(a0));

    function VoxBox$new$(_length$1, _capacity$2, _buffer$3) {
        var $131 = ({
            _: 'VoxBox.new',
            'length': _length$1,
            'capacity': _capacity$2,
            'buffer': _buffer$3
        });
        return $131;
    };
    const VoxBox$new = x0 => x1 => x2 => VoxBox$new$(x0, x1, x2);

    function VoxBox$alloc_capacity$(_capacity$1) {
        var _buffer$2 = (new Uint32Array(2 ** Number(U32$bit_length$(((2 * _capacity$1) >>> 0)))));
        var $132 = VoxBox$new$(0, _capacity$1, _buffer$2);
        return $132;
    };
    const VoxBox$alloc_capacity = x0 => VoxBox$alloc_capacity$(x0);

    function BitsMap$(_A$1) {
        var $133 = null;
        return $133;
    };
    const BitsMap = x0 => BitsMap$(x0);

    function Map$(_V$1) {
        var $134 = null;
        return $134;
    };
    const Map = x0 => Map$(x0);
    const BitsMap$new = ({
        _: 'BitsMap.new'
    });

    function BitsMap$tie$(_val$2, _lft$3, _rgt$4) {
        var $135 = ({
            _: 'BitsMap.tie',
            'val': _val$2,
            'lft': _lft$3,
            'rgt': _rgt$4
        });
        return $135;
    };
    const BitsMap$tie = x0 => x1 => x2 => BitsMap$tie$(x0, x1, x2);

    function Maybe$some$(_value$2) {
        var $136 = ({
            _: 'Maybe.some',
            'value': _value$2
        });
        return $136;
    };
    const Maybe$some = x0 => Maybe$some$(x0);
    const Maybe$none = ({
        _: 'Maybe.none'
    });

    function BitsMap$set$(_bits$2, _val$3, _map$4) {
        var self = _bits$2;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'o':
                var $138 = self.slice(0, -1);
                var self = _map$4;
                switch (self._) {
                    case 'BitsMap.tie':
                        var $140 = self.val;
                        var $141 = self.lft;
                        var $142 = self.rgt;
                        var $143 = BitsMap$tie$($140, BitsMap$set$($138, _val$3, $141), $142);
                        var $139 = $143;
                        break;
                    case 'BitsMap.new':
                        var $144 = BitsMap$tie$(Maybe$none, BitsMap$set$($138, _val$3, BitsMap$new), BitsMap$new);
                        var $139 = $144;
                        break;
                };
                var $137 = $139;
                break;
            case 'i':
                var $145 = self.slice(0, -1);
                var self = _map$4;
                switch (self._) {
                    case 'BitsMap.tie':
                        var $147 = self.val;
                        var $148 = self.lft;
                        var $149 = self.rgt;
                        var $150 = BitsMap$tie$($147, $148, BitsMap$set$($145, _val$3, $149));
                        var $146 = $150;
                        break;
                    case 'BitsMap.new':
                        var $151 = BitsMap$tie$(Maybe$none, BitsMap$new, BitsMap$set$($145, _val$3, BitsMap$new));
                        var $146 = $151;
                        break;
                };
                var $137 = $146;
                break;
            case 'e':
                var self = _map$4;
                switch (self._) {
                    case 'BitsMap.tie':
                        var $153 = self.lft;
                        var $154 = self.rgt;
                        var $155 = BitsMap$tie$(Maybe$some$(_val$3), $153, $154);
                        var $152 = $155;
                        break;
                    case 'BitsMap.new':
                        var $156 = BitsMap$tie$(Maybe$some$(_val$3), BitsMap$new, BitsMap$new);
                        var $152 = $156;
                        break;
                };
                var $137 = $152;
                break;
        };
        return $137;
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
                var $158 = self.pred;
                var $159 = (Word$to_bits$($158) + '0');
                var $157 = $159;
                break;
            case 'Word.i':
                var $160 = self.pred;
                var $161 = (Word$to_bits$($160) + '1');
                var $157 = $161;
                break;
            case 'Word.e':
                var $162 = Bits$e;
                var $157 = $162;
                break;
        };
        return $157;
    };
    const Word$to_bits = x0 => Word$to_bits$(x0);
    const U16$to_bits = a0 => (u16_to_bits(a0));

    function String$to_bits$(_str$1) {
        var self = _str$1;
        if (self.length === 0) {
            var $164 = Bits$e;
            var $163 = $164;
        } else {
            var $165 = self.charCodeAt(0);
            var $166 = self.slice(1);
            var $167 = (String$to_bits$($166) + (u16_to_bits($165)));
            var $163 = $167;
        };
        return $163;
    };
    const String$to_bits = x0 => String$to_bits$(x0);

    function Map$from_list$(_xs$2) {
        var self = _xs$2;
        switch (self._) {
            case 'List.cons':
                var $169 = self.head;
                var $170 = self.tail;
                var self = $169;
                switch (self._) {
                    case 'Pair.new':
                        var $172 = self.fst;
                        var $173 = self.snd;
                        var $174 = BitsMap$set$(String$to_bits$($172), $173, Map$from_list$($170));
                        var $171 = $174;
                        break;
                };
                var $168 = $171;
                break;
            case 'List.nil':
                var $175 = BitsMap$new;
                var $168 = $175;
                break;
        };
        return $168;
    };
    const Map$from_list = x0 => Map$from_list$(x0);

    function List$(_A$1) {
        var $176 = null;
        return $176;
    };
    const List = x0 => List$(x0);
    const List$nil = ({
        _: 'List.nil'
    });

    function Pair$(_A$1, _B$2) {
        var $177 = null;
        return $177;
    };
    const Pair = x0 => x1 => Pair$(x0, x1);

    function Web$Kaelin$Entity$char$(_img$1) {
        var $178 = ({
            _: 'Web.Kaelin.Entity.char',
            'img': _img$1
        });
        return $178;
    };
    const Web$Kaelin$Entity$char = x0 => Web$Kaelin$Entity$char$(x0);
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
                    var $179 = _value$3;
                    return $179;
                } else {
                    var $180 = (self - 1n);
                    var $181 = Word$shift_left$($180, Word$shift_left1$(_value$3));
                    return $181;
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
                var $183 = Bool$false;
                var $182 = $183;
                break;
            case 'Cmp.eql':
            case 'Cmp.gtn':
                var $184 = Bool$true;
                var $182 = $184;
                break;
        };
        return $182;
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
                var $186 = self.pred;
                var $187 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $189 = self.pred;
                            var $190 = (_a$pred$10 => {
                                var $191 = Word$cmp$go$(_a$pred$10, $189, _c$4);
                                return $191;
                            });
                            var $188 = $190;
                            break;
                        case 'Word.i':
                            var $192 = self.pred;
                            var $193 = (_a$pred$10 => {
                                var $194 = Word$cmp$go$(_a$pred$10, $192, Cmp$ltn);
                                return $194;
                            });
                            var $188 = $193;
                            break;
                        case 'Word.e':
                            var $195 = (_a$pred$8 => {
                                var $196 = _c$4;
                                return $196;
                            });
                            var $188 = $195;
                            break;
                    };
                    var $188 = $188($186);
                    return $188;
                });
                var $185 = $187;
                break;
            case 'Word.i':
                var $197 = self.pred;
                var $198 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $200 = self.pred;
                            var $201 = (_a$pred$10 => {
                                var $202 = Word$cmp$go$(_a$pred$10, $200, Cmp$gtn);
                                return $202;
                            });
                            var $199 = $201;
                            break;
                        case 'Word.i':
                            var $203 = self.pred;
                            var $204 = (_a$pred$10 => {
                                var $205 = Word$cmp$go$(_a$pred$10, $203, _c$4);
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
                var $185 = $198;
                break;
            case 'Word.e':
                var $208 = (_b$5 => {
                    var $209 = _c$4;
                    return $209;
                });
                var $185 = $208;
                break;
        };
        var $185 = $185(_b$3);
        return $185;
    };
    const Word$cmp$go = x0 => x1 => x2 => Word$cmp$go$(x0, x1, x2);
    const Cmp$eql = ({
        _: 'Cmp.eql'
    });

    function Word$cmp$(_a$2, _b$3) {
        var $210 = Word$cmp$go$(_a$2, _b$3, Cmp$eql);
        return $210;
    };
    const Word$cmp = x0 => x1 => Word$cmp$(x0, x1);

    function Word$gte$(_a$2, _b$3) {
        var $211 = Cmp$as_gte$(Word$cmp$(_a$2, _b$3));
        return $211;
    };
    const Word$gte = x0 => x1 => Word$gte$(x0, x1);

    function Pair$new$(_fst$3, _snd$4) {
        var $212 = ({
            _: 'Pair.new',
            'fst': _fst$3,
            'snd': _snd$4
        });
        return $212;
    };
    const Pair$new = x0 => x1 => Pair$new$(x0, x1);

    function Word$or$(_a$2, _b$3) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $214 = self.pred;
                var $215 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $217 = self.pred;
                            var $218 = (_a$pred$9 => {
                                var $219 = Word$o$(Word$or$(_a$pred$9, $217));
                                return $219;
                            });
                            var $216 = $218;
                            break;
                        case 'Word.i':
                            var $220 = self.pred;
                            var $221 = (_a$pred$9 => {
                                var $222 = Word$i$(Word$or$(_a$pred$9, $220));
                                return $222;
                            });
                            var $216 = $221;
                            break;
                        case 'Word.e':
                            var $223 = (_a$pred$7 => {
                                var $224 = Word$e;
                                return $224;
                            });
                            var $216 = $223;
                            break;
                    };
                    var $216 = $216($214);
                    return $216;
                });
                var $213 = $215;
                break;
            case 'Word.i':
                var $225 = self.pred;
                var $226 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $228 = self.pred;
                            var $229 = (_a$pred$9 => {
                                var $230 = Word$i$(Word$or$(_a$pred$9, $228));
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
                var $213 = $226;
                break;
            case 'Word.e':
                var $236 = (_b$4 => {
                    var $237 = Word$e;
                    return $237;
                });
                var $213 = $236;
                break;
        };
        var $213 = $213(_b$3);
        return $213;
    };
    const Word$or = x0 => x1 => Word$or$(x0, x1);

    function Word$shift_right1$aux$(_word$2) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $239 = self.pred;
                var $240 = Word$o$(Word$shift_right1$aux$($239));
                var $238 = $240;
                break;
            case 'Word.i':
                var $241 = self.pred;
                var $242 = Word$i$(Word$shift_right1$aux$($241));
                var $238 = $242;
                break;
            case 'Word.e':
                var $243 = Word$o$(Word$e);
                var $238 = $243;
                break;
        };
        return $238;
    };
    const Word$shift_right1$aux = x0 => Word$shift_right1$aux$(x0);

    function Word$shift_right1$(_word$2) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $245 = self.pred;
                var $246 = Word$shift_right1$aux$($245);
                var $244 = $246;
                break;
            case 'Word.i':
                var $247 = self.pred;
                var $248 = Word$shift_right1$aux$($247);
                var $244 = $248;
                break;
            case 'Word.e':
                var $249 = Word$e;
                var $244 = $249;
                break;
        };
        return $244;
    };
    const Word$shift_right1 = x0 => Word$shift_right1$(x0);

    function Word$subber$(_a$2, _b$3, _c$4) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $251 = self.pred;
                var $252 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $254 = self.pred;
                            var $255 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $257 = Word$i$(Word$subber$(_a$pred$10, $254, Bool$true));
                                    var $256 = $257;
                                } else {
                                    var $258 = Word$o$(Word$subber$(_a$pred$10, $254, Bool$false));
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
                                    var $262 = Word$o$(Word$subber$(_a$pred$10, $259, Bool$true));
                                    var $261 = $262;
                                } else {
                                    var $263 = Word$i$(Word$subber$(_a$pred$10, $259, Bool$true));
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
                var $250 = $252;
                break;
            case 'Word.i':
                var $266 = self.pred;
                var $267 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $269 = self.pred;
                            var $270 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $272 = Word$o$(Word$subber$(_a$pred$10, $269, Bool$false));
                                    var $271 = $272;
                                } else {
                                    var $273 = Word$i$(Word$subber$(_a$pred$10, $269, Bool$false));
                                    var $271 = $273;
                                };
                                return $271;
                            });
                            var $268 = $270;
                            break;
                        case 'Word.i':
                            var $274 = self.pred;
                            var $275 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $277 = Word$i$(Word$subber$(_a$pred$10, $274, Bool$true));
                                    var $276 = $277;
                                } else {
                                    var $278 = Word$o$(Word$subber$(_a$pred$10, $274, Bool$false));
                                    var $276 = $278;
                                };
                                return $276;
                            });
                            var $268 = $275;
                            break;
                        case 'Word.e':
                            var $279 = (_a$pred$8 => {
                                var $280 = Word$e;
                                return $280;
                            });
                            var $268 = $279;
                            break;
                    };
                    var $268 = $268($266);
                    return $268;
                });
                var $250 = $267;
                break;
            case 'Word.e':
                var $281 = (_b$5 => {
                    var $282 = Word$e;
                    return $282;
                });
                var $250 = $281;
                break;
        };
        var $250 = $250(_b$3);
        return $250;
    };
    const Word$subber = x0 => x1 => x2 => Word$subber$(x0, x1, x2);

    function Word$sub$(_a$2, _b$3) {
        var $283 = Word$subber$(_a$2, _b$3, Bool$false);
        return $283;
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
                    var $284 = Pair$new$(Bool$true, Word$or$(_value$5, _mask$6));
                    var self = $284;
                } else {
                    var $285 = Pair$new$(Bool$false, _value$5);
                    var self = $285;
                };
                switch (self._) {
                    case 'Pair.new':
                        var $286 = self.fst;
                        var $287 = self.snd;
                        var self = _shift$2;
                        if (self === 0n) {
                            var $289 = $287;
                            var $288 = $289;
                        } else {
                            var $290 = (self - 1n);
                            var _new_shift_copy$9 = Word$shift_right1$(_shift_copy$4);
                            var self = $286;
                            if (self) {
                                var $292 = Word$div$go$($290, Word$sub$(_sub_copy$3, _shift_copy$4), _new_shift_copy$9, $287);
                                var $291 = $292;
                            } else {
                                var $293 = Word$div$go$($290, _sub_copy$3, _new_shift_copy$9, $287);
                                var $291 = $293;
                            };
                            var $288 = $291;
                        };
                        return $288;
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
            var $295 = Word$to_zero$(_a$2);
            var $294 = $295;
        } else {
            var _shift$6 = (_a_bits$4 - _b_bits$5 <= 0n ? 0n : _a_bits$4 - _b_bits$5);
            var _shift_copy$7 = Word$shift_left$(_shift$6, _b$3);
            var $296 = Word$div$go$(_shift$6, _a$2, _shift_copy$7, Word$to_zero$(_a$2));
            var $294 = $296;
        };
        return $294;
    };
    const Word$div = x0 => x1 => Word$div$(x0, x1);
    const U32$div = a0 => a1 => ((a0 / a1) >>> 0);
    const U32$length = a0 => (a0.length);

    function Cmp$as_eql$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
            case 'Cmp.gtn':
                var $298 = Bool$false;
                var $297 = $298;
                break;
            case 'Cmp.eql':
                var $299 = Bool$true;
                var $297 = $299;
                break;
        };
        return $297;
    };
    const Cmp$as_eql = x0 => Cmp$as_eql$(x0);

    function Word$eql$(_a$2, _b$3) {
        var $300 = Cmp$as_eql$(Word$cmp$(_a$2, _b$3));
        return $300;
    };
    const Word$eql = x0 => x1 => Word$eql$(x0, x1);
    const U32$eql = a0 => a1 => (a0 === a1);

    function U32$inc$(_a$1) {
        var self = _a$1;
        switch ('u32') {
            case 'u32':
                var $302 = u32_to_word(self);
                var $303 = U32$new$(Word$inc$($302));
                var $301 = $303;
                break;
        };
        return $301;
    };
    const U32$inc = x0 => U32$inc$(x0);
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
        var $304 = (parseInt(_chr$3, 16));
        return $304;
    };
    const VoxBox$parse_byte = x0 => x1 => VoxBox$parse_byte$(x0, x1);
    const U32$or = a0 => a1 => (a0 | a1);
    const U32$shl = a0 => a1 => ((a0 << a1) >>> 0);
    const Pos32$new = a0 => a1 => a2 => ((0 | a0 | (a1 << 12) | (a2 << 24)));
    const Col32$new = a0 => a1 => a2 => a3 => ((0 | a0 | (a1 << 8) | (a2 << 16) | (a3 << 24)));

    function Word$trim$(_new_size$2, _word$3) {
        var self = _new_size$2;
        if (self === 0n) {
            var $306 = Word$e;
            var $305 = $306;
        } else {
            var $307 = (self - 1n);
            var self = _word$3;
            switch (self._) {
                case 'Word.o':
                    var $309 = self.pred;
                    var $310 = Word$o$(Word$trim$($307, $309));
                    var $308 = $310;
                    break;
                case 'Word.i':
                    var $311 = self.pred;
                    var $312 = Word$i$(Word$trim$($307, $311));
                    var $308 = $312;
                    break;
                case 'Word.e':
                    var $313 = Word$o$(Word$trim$($307, Word$e));
                    var $308 = $313;
                    break;
            };
            var $305 = $308;
        };
        return $305;
    };
    const Word$trim = x0 => x1 => Word$trim$(x0, x1);
    const Unit$new = null;

    function Array$extract_tip$(_arr$2) {
        var self = _arr$2;
        switch (self._) {
            case 'Array.tip':
                var $315 = self.value;
                var $316 = $315;
                var $314 = $316;
                break;
            case 'Array.tie':
                var $317 = Unit$new;
                var $314 = $317;
                break;
        };
        return $314;
    };
    const Array$extract_tip = x0 => Array$extract_tip$(x0);

    function Array$extract_tie$(_arr$3) {
        var self = _arr$3;
        switch (self._) {
            case 'Array.tie':
                var $319 = self.lft;
                var $320 = self.rgt;
                var $321 = Pair$new$($319, $320);
                var $318 = $321;
                break;
            case 'Array.tip':
                var $322 = Unit$new;
                var $318 = $322;
                break;
        };
        return $318;
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
                        var $323 = self.pred;
                        var $324 = Word$foldl$(_w0$4(_nil$3), _w0$4, _w1$5, $323);
                        return $324;
                    case 'Word.i':
                        var $325 = self.pred;
                        var $326 = Word$foldl$(_w1$5(_nil$3), _w0$4, _w1$5, $325);
                        return $326;
                    case 'Word.e':
                        var $327 = _nil$3;
                        return $327;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Word$foldl = x0 => x1 => x2 => x3 => Word$foldl$(x0, x1, x2, x3);

    function Array$mut$(_idx$3, _f$4, _arr$5) {
        var $328 = Word$foldl$((_arr$6 => {
            var $329 = Array$tip$(_f$4(Array$extract_tip$(_arr$6)));
            return $329;
        }), (_rec$7 => _arr$8 => {
            var self = Array$extract_tie$(_arr$8);
            switch (self._) {
                case 'Pair.new':
                    var $331 = self.fst;
                    var $332 = self.snd;
                    var $333 = Array$tie$(_rec$7($331), $332);
                    var $330 = $333;
                    break;
            };
            return $330;
        }), (_rec$7 => _arr$8 => {
            var self = Array$extract_tie$(_arr$8);
            switch (self._) {
                case 'Pair.new':
                    var $335 = self.fst;
                    var $336 = self.snd;
                    var $337 = Array$tie$($335, _rec$7($336));
                    var $334 = $337;
                    break;
            };
            return $334;
        }), _idx$3)(_arr$5);
        return $328;
    };
    const Array$mut = x0 => x1 => x2 => Array$mut$(x0, x1, x2);

    function Array$set$(_idx$3, _val$4, _arr$5) {
        var $338 = Array$mut$(_idx$3, (_x$6 => {
            var $339 = _val$4;
            return $339;
        }), _arr$5);
        return $338;
    };
    const Array$set = x0 => x1 => x2 => Array$set$(x0, x1, x2);
    const Buffer32$set = a0 => a1 => a2 => ((a2[a0] = a1, a2));
    const VoxBox$set_pos = a0 => a1 => a2 => ((a2.buffer[a0 * 2] = a1, a2));
    const VoxBox$set_col = a0 => a1 => a2 => ((a2.buffer[a0 * 2 + 1] = a1, a2));

    function VoxBox$set_length$(_length$1, _img$2) {
        var self = _img$2;
        switch (self._) {
            case 'VoxBox.new':
                var $341 = self.capacity;
                var $342 = self.buffer;
                var $343 = VoxBox$new$(_length$1, $341, $342);
                var $340 = $343;
                break;
        };
        return $340;
    };
    const VoxBox$set_length = x0 => x1 => VoxBox$set_length$(x0, x1);
    const VoxBox$push = a0 => a1 => a2 => ((a2.buffer[a2.length * 2] = a0, a2.buffer[a2.length * 2 + 1] = a1, a2.length++, a2));

    function VoxBox$parse$(_voxdata$1) {
        var _siz$2 = (((_voxdata$1.length) / 12) >>> 0);
        var _img$3 = VoxBox$alloc_capacity$(_siz$2);
        var _img$4 = (() => {
            var $345 = _img$3;
            var $346 = 0;
            var $347 = _siz$2;
            let _img$5 = $345;
            for (let _i$4 = $346; _i$4 < $347; ++_i$4) {
                var _x$6 = VoxBox$parse_byte$(((((_i$4 * 6) >>> 0) + 0) >>> 0), _voxdata$1);
                var _y$7 = VoxBox$parse_byte$(((((_i$4 * 6) >>> 0) + 1) >>> 0), _voxdata$1);
                var _z$8 = VoxBox$parse_byte$(((((_i$4 * 6) >>> 0) + 2) >>> 0), _voxdata$1);
                var _r$9 = VoxBox$parse_byte$(((((_i$4 * 6) >>> 0) + 3) >>> 0), _voxdata$1);
                var _g$10 = VoxBox$parse_byte$(((((_i$4 * 6) >>> 0) + 4) >>> 0), _voxdata$1);
                var _b$11 = VoxBox$parse_byte$(((((_i$4 * 6) >>> 0) + 5) >>> 0), _voxdata$1);
                var _pos$12 = ((0 | _x$6 | (_y$7 << 12) | (_z$8 << 24)));
                var _col$13 = ((0 | _r$9 | (_g$10 << 8) | (_b$11 << 16) | (255 << 24)));
                var $345 = ((_img$5.buffer[_img$5.length * 2] = _pos$12, _img$5.buffer[_img$5.length * 2 + 1] = _col$13, _img$5.length++, _img$5));
                _img$5 = $345;
            };
            return _img$5;
        })();
        var $344 = _img$4;
        return $344;
    };
    const VoxBox$parse = x0 => VoxBox$parse$(x0);
    const Kaelin$Assets$chars$croni0_d_1 = VoxBox$parse$("0f0b16351d4d100b16351d4d0d0c15351d4d0e0c15351d4d0f0c156a3a86100c158e4a9d110c15351d4d120c15351d4d0c0d14351d4d0d0d146a3a860e0d146a3a860f0d148e4a9d100d146a3a86110d146a3a86120d146a3a86130d14351d4d0b0e13351d4d0c0e136a3a860d0e136a3a860e0e136a3a860f0e136a3a86100e136a3a86110e136a3a86120e136a3a86130e136a3a86140e13351d4d0a0f12351d4d0b0f126a3a860c0f126a3a860d0f126a3a860e0f126a3a860f0f126a3a86100f126a3a86110f126a3a86120f126a3a86130f126a3a86140f126a3a86150f12351d4d0a1011351d4d0b10116a3a860c10116a3a860d10116a3a860e10116a3a860f10116a3a861010116a3a861110116a3a861210116a3a861310116a3a861410116a3a86151011351d4d091110351d4d0a11106a3a860b11106a3a860c11106a3a860d11106a3a860e11106a3a860f11106a3a861011106a3a861111106a3a861211106a3a861311106a3a861411106a3a861511106a3a86161110351d4d09120f351d4d0a120f6a3a860b120f6a3a860c120f602d800d120f602d800e120f6a3a860f120f6a3a8610120f6a3a8611120f6a3a8612120f602d8013120f602d8014120f6a3a8615120f6a3a8616120f351d4d09130e351d4d0a130e602d800b130e602d800c130e351d4d0d130e351d4d0e130e6a3a860f130e6a3a8610130e6a3a8611130e6a3a8612130e351d4d13130e351d4d14130e602d8015130e602d8016130e351d4d09140d351d4d0a140d602d800b140d351d4d0c140d351d4d0d140d531e480e140d351d4d0f140d6a3a8610140d6a3a8611140d351d4d12140d531e4813140d351d4d14140d351d4d15140d4a358016140d351d4d09150c351d4d0a150c4a35800b150c351d4d0c150c531e480d150cdf3e460e150c531e480f150c351d4d10150c351d4d11150c531e4812150cdf3e4613150c531e4814150c351d4d15150c4a358016150c351d4d0a160b351d4d0b160b4a35800c160b351d4d0d160b531e480e160b351d4d0f160b351d4d10160b351d4d11160b351d4d12160b531e4813160b351d4d14160b4a358015160b351d4d0b170a351d4d0c170a4a35800d170a8e4a9d0e170a351d4d0f170a351d4d10170a351d4d11170a351d4d12170a8e4a9d13170a4a358014170a351d4d0d1809351d4d0e1809602d800f1809602d801018094a3580111809602d80121809351d4d0c1908351d4d0d19086a3a860e19086a3a860f19086a3a861019084a35801119086a3a861219086a3a86131908351d4d0c1a07351d4d0d1a076a3a860e1a076a3a860f1a076a3a86101a074a3580111a076a3a86121a076a3a86131a07351d4d0c1b06351d4d0d1b068e4a9d0e1b066a3a860f1b066a3a86101b064a3580111b066a3a86121b068e4a9d131b06351d4d0d1c05351d4d0e1c05351d4d0f1c05351d4d101c05351d4d111c05351d4d121c05351d4d111d04351d4d121d04351d4d");
    const Kaelin$Assets$chars$cyclope_d_1 = VoxBox$parse$("0e0a212c333d0f0a212c333d100a212c333d110a212c333d0d0b202c333d0e0b20fff9e10f0b20fff9e1100b20fff9e1110b20fff9e1120b202c333d0d0c1f2c333d0e0c1ffff9e10f0c1ffff9e1100c1ffff9e1110c1ffff9e1120c1f2c333d0c0d1e2729600d0d1e2729600e0d1efff9e10f0d1eccc8b7100d1eccc8b7110d1eccc8b7120d1e272960130d1e272960140d1e2729600c0e1d2729600d0e1d2729600e0e1dfff9e10f0e1dccc8b7100e1dccc8b7110e1dccc8b7120e1d272960130e1d272960140e1d272960050f1c272960060f1c272960070f1c272960090f1c2729600a0f1c2729600b0f1c2729600c0f1c5176b80d0f1cfff9e10e0f1cdfdbc80f0f1cdfdbc8100f1cdfdbc8110f1cdfdbc8120f1cccc8b7130f1c5176b8140f1c5176b8150f1c27296005101b27296006101b799cd307101b799cd308101b27296009101b5176b80a101b5176b80b101b5176b80c101b799cd30d101b5176b80e101bdfdbc80f101bccc8b710101bccc8b711101bccc8b712101b5176b813101b799cd314101b799cd315101b5176b816101b27296017101b27296018101b27296005111a27296006111a799cd307111a799cd308111a27296009111a5176b80a111a5176b80b111a5176b80c111a799cd30d111a5176b80e111adfdbc80f111accc8b710111accc8b711111accc8b712111a5176b813111a799cd314111a799cd315111a5176b816111a27296017111a27296018111a2729600512192729600612195176b80712195176b8081219394c87091219799cd30a1219799cd30b1219799cd30c12195176b80d12194a2b710e12194a2b710f12194a2b711012194a2b711112194a2b711212194a2b711312195176b81412195176b8151219799cd31612192729601712192729601812192729600513182729600613185176b80713185176b8081318394c87091318799cd30a1318799cd30b1318799cd30c13185176b80d13184a2b710e13184a2b710f13184a2b711013184a2b711113184a2b711213184a2b711313185176b81413185176b8151318799cd3161318272960171318272960181318272960051417272960061417272960071417272960081417394c870914175176b80a14175176b80b14175176b80c14174a2b710d1417dab04d0e1417dab04d0f1417dab04d101417dab04d111417dab04d121417dab04d1314174a2b711414174a2b711514175176b8161417394c87171417394c87181417394c871914172729601a1417272960051516272960061516799cd3071516799cd3081516394c870915165176b80a15165176b80b15165176b80c15164a2b710d1516dab04d0e1516fff9e10f1516fff9e1101516fff9e1111516fff9e1121516dab04d1315164a2b711415164a2b711515165176b8161516394c87171516394c87181516394c87191516799cd31a1516272960051615272960061615799cd3071615799cd3081615394c870916155176b80a16155176b80b16155176b80c16154a2b710d1615dab04d0e1615fff9e10f1615fff9e1101615fff9e1111615fff9e1121615dab04d1316154a2b711416154a2b711516155176b8161615394c87171615394c87181615394c87191615799cd31a1615272960051714272960061714272960071714272960081714394c870917145176b80a17145176b80b17145176b80c17144a2b710d1714dab04d0e17142421260f1714242126101714242126111714242126121714dab04d1317144a2b711417144a2b711517145176b8161714394c87171714394c87181714394c871917142729601a17145176b81b17142729600518132729600618135176b80718135176b8081813394c870918135176b80a18135176b80b18135176b80c18135176b80d18134a2b710e18134a2b710f18134a2b711018134a2b711118134a2b711218134a2b711318135176b81418135176b81518135176b8161813394c87171813394c87181813394c87191813799cd31a1813799cd31b18132729600519122729600619125176b80719125176b8081912394c870919125176b80a19125176b80b19125176b80c19125176b80d19124a2b710e19124a2b710f19124a2b711019124a2b711119124a2b711219124a2b711319125176b81419125176b81519125176b8161912394c87171912394c87181912394c87191912799cd31a1912799cd31b1912272960051a11272960061a115176b8071a115176b8081a11394c87091a115176b80a1a115176b80b1a115176b80c1a115176b80d1a114a2b710e1a114a2b710f1a114a2b71101a114a2b71111a114a2b71121a114a2b71131a115176b8141a115176b8151a115176b8161a11394c87171a11394c87181a11394c87191a11799cd31a1a11799cd31b1a11272960051b10272960061b10799cd3071b10799cd3081b105176b8091b10394c870a1b10394c870b1b10394c870c1b10dfdbc80d1b105176b80e1b105176b80f1b105176b8101b105176b8111b105176b8121b105176b8131b10dfdbc8141b10dfdbc8151b10394c87161b105176b8171b105176b8181b105176b8191b105176b81a1b10799cd31b1b10272960061c0f272960071c0f272960081c0f272960091c0f394c870a1c0f394c870b1c0f394c870c1c0fdfdbc80d1c0f4662a10e1c0f4662a10f1c0f4662a1101c0f4662a1111c0f4662a1121c0f4662a1131c0fdfdbc8141c0fdfdbc8151c0f394c87161c0f394c87171c0f394c87181c0f394c87191c0f5176b81a1c0f5176b81b1c0f272960081d0e272960091d0e5176b80a1d0e5176b80b1d0e5176b80c1d0e394c870d1d0e394c870e1d0e394c870f1d0e394c87101d0e394c87111d0e394c87121d0e394c87131d0e394c87141d0e394c87151d0e5176b8161d0e394c87171d0e394c87181d0e394c87191d0e5176b81a1d0e5176b81b1d0e272960081e0d272960091e0d5176b80a1e0d5176b80b1e0d5176b80c1e0d394c870d1e0d394c870e1e0d394c870f1e0d394c87101e0d394c87111e0d394c87121e0d394c87131e0d394c87141e0d394c87151e0d5176b8161e0d394c87171e0d394c87181e0d394c87191e0d5176b81a1e0d5176b81b1e0d272960081f0c272960091f0c5176b80a1f0c5176b80b1f0c5176b80c1f0c394c870d1f0c394c870e1f0c394c870f1f0c394c87101f0c394c87111f0c394c87121f0c394c87131f0c394c87141f0c394c87151f0c5176b8161f0c394c87171f0c394c87181f0c394c87191f0c5176b81a1f0c5176b81b1f0c27296008200b27296009200b5176b80a200b5176b80b200b5176b80c200b5176b80d200b5176b80e200b5176b80f200b5176b810200b5176b811200b5176b812200b5176b813200b5176b814200b5176b815200b394c8716200b799cd317200b799cd318200b799cd319200b5176b81a200b5176b81b200b27296008210a27296009210a8e4a9d0a210a8e4a9d0b210a8e4a9d0c210a8e4a9d0d210a5176b80e210a5176b80f210a5176b810210a5176b811210a5176b812210a5176b813210a394c8714210a394c8715210a394c8716210a799cd317210a799cd318210a799cd319210a799cd31a210a5176b81b210a2729600922092729600a22092729600b22092729600c22094a2b710d22098e4a9d0e22098e4a9d0f22098e4a9d1022098e4a9d1122098e4a9d1222098e4a9d132209394c87142209394c871522095176b8162209394c87172209394c87182209394c87192209394c871a22092729600923082729600a23082729600b23082729600c23084a2b710d23088e4a9d0e23088e4a9d0f23088e4a9d1023088e4a9d1123088e4a9d1223088e4a9d132308394c87142308394c871523085176b8162308394c87172308394c87182308394c87192308394c871a23082729600924072729600a24072729600b24072729600c24074a2b710d24078e4a9d0e24078e4a9d0f24078e4a9d1024078e4a9d1124078e4a9d1224078e4a9d132407394c87142407394c871524075176b8162407394c87172407394c87182407394c87192407394c871a24072729600925062729600a25062729600b25062729600c25065176b80d25064a2b710e25068e4a9d0f25068e4a9d1025068e4a9d1125068e4a9d1225064a2b71132506394c87142506394c87152506799cd3162506799cd3172506799cd3182506799cd31925065176b81a25062729600926052729600a26052729600b26052729600c2605799cd30d2605799cd30e26054a2b710f26054a2b711026054a2b711126054a2b711226052729601326052729601426052729601526052729601626052729601726052729601826052729601926052729600927042729600a27042729600b27042729600c27042729600d27042729600e2704272960");
    const Kaelin$Assets$chars$lela_d_1 = VoxBox$parse$("091219fb4d4d0a1219fb4d4d0b1219fb4d4d0c1219fb4d4d131219fb4d4d141219fb4d4d151219fb4d4d161219fb4d4d081318fb4d4d0913182b496c0a13182b496c0b13182b496c0c13182b496c0d1318fb4d4d121318fb4d4d1313182b496c1413182b496c1513182b496c1613182b496c171318fb4d4d071417fb4d4d0814172b496c09141781aeff0a141781aeff0b141781aeff0c141781aeff0d14172b496c0e1417fb4d4d0f1417fb4d4d101417fb4d4d111417fb4d4d1214172b496c13141781aeff14141781aeff15141781aeff16141781aeff1714172b496c181417fb4d4d071516fb4d4d0815161f3b5b091516538ccf0a1516538ccf0b1516538ccf0c1516538ccf0d1516538ccf0e15162b496c0f15162b496c1015162b496c1115162b496c121516538ccf131516538ccf141516538ccf151516538ccf161516538ccf1715161f3b5b181516fb4d4d071615fb4d4d0816151f3b5b091615538ccf0a1615538ccf0b1615538ccf0c1615538ccf0d1615538ccf0e161581aeff0f161581aeff10161581aeff11161581aeff121615538ccf131615538ccf141615538ccf151615538ccf161615538ccf1716151f3b5b181615fb4d4d071714fb4d4d0817141f3b5b091714538ccf0a1714538ccf0b1714538ccf0c1714538ccf0d1714538ccf0e1714538ccf0f1714538ccf101714538ccf111714538ccf121714538ccf131714538ccf141714538ccf151714538ccf161714538ccf1717141f3b5b181714fb4d4d081813fb4d4d0918131f3b5b0a1813538ccf0b1813538ccf0c1813538ccf0d1813538ccf0e1813538ccf0f1813cb4646101813cb4646111813538ccf121813538ccf131813538ccf141813538ccf151813538ccf1618131f3b5b171813fb4d4d091912fb4d4d0a19121f3b5b0b1912538ccf0c1912538ccf0d1912538ccf0e1912538ccf0f1912ad1f1f101912ad1f1f111912538ccf121912538ccf131912538ccf141912538ccf1519121f3b5b161912fb4d4d091a11fb4d4d0a1a111f3b5b0b1a11538ccf0c1a11538ccf0d1a11cb46460e1a11538ccf0f1a11538ccf101a11538ccf111a11538ccf121a11cb4646131a11538ccf141a11538ccf151a111f3b5b161a11fb4d4d091b10fb4d4d0a1b101f3b5b0b1b10538ccf0c1b10538ccf0d1b10ad1f1f0e1b10538ccf0f1b103d5497101b103d5497111b10538ccf121b10ad1f1f131b10538ccf141b10538ccf151b101f3b5b161b10fb4d4d0a1c0ffb4d4d0b1c0f1f3b5b0c1c0f538ccf0d1c0f538ccf0e1c0f538ccf0f1c0f2d4382101c0f2d4382111c0f538ccf121c0f538ccf131c0f538ccf141c0f1f3b5b151c0ffb4d4d0b1d0efb4d4d0c1d0e1f3b5b0d1d0e3a67b70e1d0e538ccf0f1d0e203368101d0e203368111d0e538ccf121d0e3a67b7131d0e1f3b5b141d0efb4d4d0a1e0dfb4d4d0b1e0d1f3b5b0c1e0d538ccf0d1e0d538ccf0e1e0d3a67b70f1e0d3a67b7101e0d3a67b7111e0d3a67b7121e0d538ccf131e0d538ccf141e0d1f3b5b151e0dfb4d4d091f0cfb4d4d0a1f0c1f3b5b0b1f0c81aeff0c1f0c3a71b10d1f0c538ccf0e1f0c81aeff0f1f0c81aeff101f0c81aeff111f0c81aeff121f0c538ccf131f0c3a71b1141f0c81aeff151f0c1f3b5b161f0cfb4d4d08200bfb4d4d09200b1f3b5b0a200b538ccf0b200b538ccf0c200b3a71b10d200b538ccf0e200b538ccf0f200b538ccf10200b538ccf11200b538ccf12200b538ccf13200b3a71b114200b538ccf15200b538ccf16200b1f3b5b17200bfb4d4d08210afb4d4d09210a1f3b5b0a210a538ccf0b210a538ccf0c210a3a71b10d210a538ccf0e210a538ccf0f210a538ccf10210a538ccf11210a538ccf12210a538ccf13210a3a71b114210a538ccf15210a538ccf16210a1f3b5b17210afb4d4d082209fb4d4d0922091f3b5b0a2209538ccf0b2209538ccf0c22092753860d2209538ccf0e2209538ccf0f2209538ccf102209538ccf112209538ccf122209538ccf132209275386142209538ccf152209538ccf1622091f3b5b172209fb4d4d092308fb4d4d0a23081f3b5b0b23081f3b5b0c23081f3b5b0d23083a67b70e2308538ccf0f2308538ccf102308538ccf112308538ccf1223083a67b71323081f3b5b1423081f3b5b1523081f3b5b162308fb4d4d0a2407fb4d4d0b2407fb4d4d0c2407fb4d4d0d24071f3b5b0e24073a67b70f2407538ccf102407538ccf1124073a67b71224071f3b5b132407fb4d4d142407fb4d4d152407fb4d4d0d2506fb4d4d0e25061f3b5b0f25063a67b71025063a67b71125061f3b5b122506fb4d4d0e2605fb4d4d0f26051f3b5b1026051f3b5b112605fb4d4d0f2704fb4d4d102704fb4d4d");
    const Kaelin$Assets$chars$octoking_d_1 = VoxBox$parse$("0a0a21192a020b0a21192a020d0a21192a020e0a21192a02100a21192a02110a21192a02120a21192a02130a21192a02150a21192a02160a21192a02180a21192a02190a21192a020a0b20192a020b0b20192a020d0b20192a020e0b20192a02100b20192a02110b20192a02120b20192a02130b20192a02150b20192a02160b20192a02180b20192a02190b20192a02080c1f192a02090c1f192a020a0c1fe6d7510b0c1fe6d7510c0c1f192a020d0c1f70681e0e0c1f70681e0f0c1f192a02100c1ffff6a6110c1ffff6a6120c1ffff6a6130c1ffff6a6140c1f192a02150c1f70681e160c1f70681e170c1f192a02180c1fe6d751190c1fe6d7511a0c1f192a021b0c1f192a02080d1e192a02090d1e192a020a0d1ee6d7510b0d1ee6d7510c0d1efff6a60d0d1e192a020e0d1e192a020f0d1ee6d751100d1ee6d751110d1ee6d751120d1ee6d751130d1ee6d751140d1ee6d751150d1e192a02160d1e192a02170d1efff6a6180d1ee6d751190d1ee6d7511a0d1e192a021b0d1e192a02080e1d192a02090e1d192a020a0e1de6d7510b0e1de6d7510c0e1dfff6a60d0e1d192a020e0e1d192a020f0e1de6d751100e1de6d751110e1de6d751120e1de6d751130e1de6d751140e1de6d751150e1d192a02160e1d192a02170e1dfff6a6180e1de6d751190e1de6d7511a0e1d192a021b0e1d192a02080f1c192a02090f1c192a020a0f1cc9ae530b0f1cc9ae530c0f1ce6d7510d0f1ce6d7510e0f1ce6d7510f0f1ce6d751100f1cb8321d110f1cb8321d120f1cb8321d130f1cb8321d140f1ce6d751150f1ce6d751160f1ce6d751170f1ce6d751180f1cc9ae53190f1cc9ae531a0f1c192a021b0f1c192a0208101b192a0209101b192a020a101bc9ae530b101bc9ae530c101be6d7510d101be6d7510e101be6d7510f101be6d75110101bb8321d11101bb8321d12101bb8321d13101bb8321d14101be6d75115101be6d75116101be6d75117101be6d75118101bc9ae5319101bc9ae531a101b192a021b101b192a0205111a192a0206111a192a0207111a192a0208111a192a0209111a192a020a111a4281350b111a4281350c111a4281350d111a4281350e111a4281350f111ac9ae5310111ac9ae5311111ac9ae5312111ac9ae5313111ac9ae5314111ac9ae5315111a42813516111a42813517111a42813518111a42813519111a4281351a111a192a021b111a192a021c111a192a021d111a192a021e111a192a02041219192a020512199fd95d0612199fd95d0712199fd95d081219192a02091219192a020a12199fd95d0b12199fd95d0c12195ea6420d12195ea6420e12195ea6420f12194281351012194281351112194281351212194281351312194281351412194281351512195ea6421612195ea6421712195ea6421812199fd95d1912199fd95d1a1219192a021b1219192a021c12199fd95d1d12199fd95d1e12199fd95d1f1219192a02041318192a020513189fd95d0613189fd95d0713189fd95d081318192a02091318192a020a13189fd95d0b13189fd95d0c13185ea6420d13185ea6420e13185ea6420f13184281351013184281351113184281351213184281351313184281351413184281351513185ea6421613185ea6421713185ea6421813189fd95d1913189fd95d1a1318192a021b1318192a021c13189fd95d1d13189fd95d1e13189fd95d1f1318192a02021417192a02031417192a020414179fd95d0514175ea6420614175ea6420714175ea642081417192a02091417192a020a14175ea6420b14175ea6420c14175ea6420d14175ea6420e14175ea6420f14175ea6421014175ea6421114175ea6421214175ea6421314175ea6421414175ea6421514175ea6421614175ea6421714175ea6421814175ea6421914175ea6421a1417192a021b1417192a021c14175ea6421d14175ea6421e14175ea6421f14179fd95d201417192a02211417192a02041516192a020515165ea6420615165ea6420715165ea642081516192a02091516192a020a15164281350b15164281350c15164281350d15164281350e15164281350f15164281351015165ea6421115165ea6421215165ea6421315165ea6421415164281351515164281351615164281351715164281351815164281351915164281351a1516192a021b1516192a021c15165ea6421d15165ea6421e15165ea6421f1516192a02041615192a020516155ea6420616155ea6420716155ea642081615192a02091615192a020a16154281350b16154281350c16154281350d16154281350e16154281350f16154281351016155ea6421116155ea6421216155ea6421316155ea6421416154281351516154281351616154281351716154281351816154281351916154281351a1615192a021b1615192a021c16155ea6421d16155ea6421e16155ea6421f1615192a02051714192a02061714192a020717145ea6420817145ea6420917145ea6420a1714192a020b1714192a020c17144281350d1714e6d7510e1714e6d7510f1714e6d751101714428135111714428135121714428135131714428135141714e6d751151714e6d751161714e6d751171714428135181714192a02191714192a021a17145ea6421b17145ea6421c17145ea6421d1714192a021e1714192a02071813192a020818135ea6420918135ea6420a1813366d2a0b1813366d2a0c1813192a020d18134281350e18134281350f1813173e0f101813173e0f111813173e0f121813173e0f131813173e0f141813173e0f151813428135161813428135171813192a02181813366d2a191813366d2a1a18135ea6421b18135ea6421c1813192a02071912192a020819125ea6420919125ea6420a1912366d2a0b1912366d2a0c1912192a020d19124281350e19124281350f1912173e0f101912173e0f111912173e0f121912173e0f131912173e0f141912173e0f151912428135161912428135171912192a02181912366d2a191912366d2a1a19125ea6421b19125ea6421c1912192a02051a11192a02061a11192a02071a11192a02081a11428135091a114281350a1a115ea6420b1a115ea6420c1a114281350d1a11192a020e1a11192a020f1a119fd95d101a119fd95d111a119fd95d121a119fd95d131a119fd95d141a119fd95d151a11192a02161a11192a02171a11428135181a115ea642191a115ea6421a1a114281351b1a114281351c1a11192a021d1a11192a021e1a11192a02051b10192a02061b10192a02071b10192a02081b10428135091b104281350a1b105ea6420b1b105ea6420c1b104281350d1b10192a020e1b10192a020f1b109fd95d101b109fd95d111b109fd95d121b109fd95d131b109fd95d141b109fd95d151b10192a02161b10192a02171b10428135181b105ea642191b105ea6421a1b104281351b1b104281351c1b10192a021d1b10192a021e1b10192a02041c0f192a02051c0f366d2a061c0f366d2a071c0f192a02081c0f5ea642091c0f5ea6420a1c0f4281350b1c0f4281350c1c0f192a020d1c0f9fd95d0e1c0f9fd95d0f1c0f5ea642101c0f428135111c0f428135121c0f428135131c0f428135141c0f5ea642151c0f9fd95d161c0f9fd95d171c0f192a02181c0f428135191c0f4281351a1c0f5ea6421b1c0f5ea6421c1c0f192a021d1c0f366d2a1e1c0f366d2a1f1c0f192a02021d0e192a02031d0e192a02041d0e428135051d0e428135061d0e428135071d0e192a02081d0e428135091d0e4281350a1d0e4281350b1d0e4281350c1d0e192a020d1d0e5ea6420e1d0e5ea6420f1d0e5ea642101d0e428135111d0e428135121d0e428135131d0e428135141d0e5ea642151d0e5ea642161d0e5ea642171d0e192a02181d0e428135191d0e4281351a1d0e4281351b1d0e4281351c1d0e192a021d1d0e4281351e1d0e4281351f1d0e428135201d0e192a02211d0e192a02021e0d192a02031e0d192a02041e0d428135051e0d428135061e0d428135071e0d192a02081e0d428135091e0d4281350a1e0d4281350b1e0d4281350c1e0d192a020d1e0d5ea6420e1e0d5ea6420f1e0d5ea642101e0d428135111e0d428135121e0d428135131e0d428135141e0d5ea642151e0d5ea642161e0d5ea642171e0d192a02181e0d428135191e0d4281351a1e0d4281351b1e0d4281351c1e0d192a021d1e0d4281351e1e0d4281351f1e0d428135201e0d192a02211e0d192a02001f0c192a02011f0c192a02021f0c9fd95d031f0c9fd95d041f0c5ea642051f0c428135061f0c428135071f0c192a02081f0c5ea642091f0c5ea6420a1f0c4281350b1f0c4281350c1f0c192a020d1f0c5ea6420e1f0c5ea6420f1f0c5ea642101f0c428135111f0c428135121f0c428135131f0c428135141f0c5ea642151f0c5ea642161f0c5ea642171f0c192a02181f0c428135191f0c4281351a1f0c5ea6421b1f0c5ea6421c1f0c192a021d1f0c4281351e1f0c4281351f1f0c5ea642201f0c9fd95d211f0c9fd95d221f0c192a0202200b192a0203200b192a0204200b192a0205200b42813506200b42813507200b42813508200b192a0209200b192a020a200b366d2a0b200b366d2a0c200b192a020d200b5ea6420e200b5ea6420f200b5ea64210200b42813511200b42813512200b42813513200b42813514200b5ea64215200b5ea64216200b5ea64217200b192a0218200b366d2a19200b366d2a1a200b192a021b200b192a021c200b4281351d200b4281351e200b4281351f200b192a0220200b192a0221200b192a0202210a192a0203210a192a0204210a192a0205210a42813506210a42813507210a42813508210a192a0209210a192a020a210a366d2a0b210a366d2a0c210a192a020d210a5ea6420e210a5ea6420f210a5ea64210210a42813511210a42813512210a42813513210a42813514210a5ea64215210a5ea64216210a5ea64217210a192a0218210a366d2a19210a366d2a1a210a192a021b210a192a021c210a4281351d210a4281351e210a4281351f210a192a0220210a192a0221210a192a02052209192a02062209192a02072209192a020a2209192a020b2209192a020c2209192a020d22095ea6420e22095ea6420f22094281351022094281351122094281351222094281351322094281351422094281351522095ea6421622095ea642172209192a02182209192a02192209192a021c2209192a021d2209192a021e2209192a02052308192a02062308192a02072308192a020a2308192a020b2308192a020c2308192a020d23085ea6420e23085ea6420f23084281351023084281351123084281351223084281351323084281351423084281351523085ea6421623085ea642172308192a02182308192a02192308192a021c2308192a021d2308192a021e2308192a02082407192a02092407192a020a2407192a020b2407192a020c24075ea6420d24074281350e24074281350f2407428135102407366d2a112407366d2a122407366d2a132407366d2a1424074281351524074281351624074281351724075ea642182407192a02192407192a021a2407192a021b2407192a02072506192a020825065ea6420925065ea6420a25065ea6420b25065ea6420c25064281350d25064281350e25064281350f2506366d2a102506192a02112506192a02122506192a02132506192a02142506366d2a1525064281351625064281351725064281351825065ea6421925065ea6421a25065ea6421b25065ea6421c2506192a02072605192a020826055ea6420926055ea6420a26055ea6420b26055ea6420c26054281350d26054281350e26054281350f2605366d2a102605192a02112605192a02122605192a02132605192a02142605366d2a1526054281351626054281351726054281351826055ea6421926055ea6421a26055ea6421b26055ea6421c2605192a02082704192a02092704192a020a2704192a020b2704192a020c2704192a020d2704192a020e2704192a020f2704192a02142704192a02152704192a02162704192a02172704192a02182704192a02192704192a021a2704192a021b2704192a02");

    function Web$Kaelin$Entity$background$(_img$1) {
        var $348 = ({
            _: 'Web.Kaelin.Entity.background',
            'img': _img$1
        });
        return $348;
    };
    const Web$Kaelin$Entity$background = x0 => Web$Kaelin$Entity$background$(x0);
    const Kaelin$Assets$dark_grass_4 = VoxBox$parse$("0e00010600000f00010600001000010600000c01010600000d01010600000e0101408d640f0101408d64100101469e651101010600001201010600000a02010600000b02010600000c0201469e650d0201469e650e0201469e650f0201408d64100201469e65110201469e65120201408d641302010600001402010600000803010600000903010600000a0301469e650b0301408d640c0301469e650d0301469e650e0301469e650f0301408d64100301408d64110301408d64120301408d64130301469e65140301469e65150301060000160301060000060401060000070401060000080401469e65090401469e650a0401469e650b0401408d640c0401408d640d0401469e650e0401469e650f0401408d64100401469e65110401408d64120401408d64130401408d64140401408d64150401408d64160401408d64170401060000180401060000040501060000050501060000060501469e65070501408d64080501469e65090501469e650a0501408d640b0501408d640c0501408d640d0501347e570e0501347e570f0501469e65100501469e65110501469e65120501347e57130501408d64140501469e65150501469e65160501408d64170501469e65180501469e651905010600001a0501060000020601060000030601060000040601347e57050601469e65060601469e65070601408d64080601408d64090601347e570a0601408d640b0601408d640c0601408d640d0601408d640e0601347e570f0601469e65100601469e65110601408d64120601347e57130601347e57140601469e65150601469e65160601408d64170601408d64180601347e57190601408d641a0601408d641b06010600001c0601060000000701060000010701060000020701408d64030701408d64040701408d64050701408d64060701408d64070701408d64080701408d64090701347e570a0701347e570b0701408d640c0701469e650d0701469e650e0701408d640f0701408d64100701408d64110701408d64120701408d64130701408d64140701408d64150701408d64160701408d64170701408d64180701347e57190701347e571a0701408d641b0701469e651c0701469e651d07010600001e0701060000000801060000010801347e57020801469e65030801469e65040801408d64050801408d64060801469e65070801469e65080801408d64090801469e650a0801469e650b0801408d640c0801469e650d0801469e650e0801469e650f0801347e57100801347e57110801469e65120801469e65130801408d64140801408d64150801469e65160801469e65170801408d64180801469e65190801469e651a0801408d641b0801469e651c0801469e651d0801469e651e0801060000000901060000010901408d64020901469e65030901469e65040901408d64050901469e65060901469e65070901469e65080901408d64090901469e650a0901469e650b0901408d640c0901408d640d0901469e650e0901469e650f0901347e57100901408d64110901469e65120901469e65130901408d64140901469e65150901469e65160901469e65170901408d64180901469e65190901469e651a0901408d641b0901408d641c0901469e651d0901469e651e0901060000000a01060000010a01408d64020a01408d64030a01408d64040a01408d64050a01469e65060a01469e65070a01408d64080a01408d64090a01408d640a0a01408d640b0a01408d640c0a01408d640d0a01408d640e0a01408d640f0a01408d64100a01408d64110a01408d64120a01408d64130a01408d64140a01469e65150a01469e65160a01408d64170a01408d64180a01408d64190a01408d641a0a01408d641b0a01408d641c0a01408d641d0a01408d641e0a01060000000b01060000010b01408d64020b01408d64030b01408d64040b01408d64050b01408d64060b01408d64070b01469e65080b01469e65090b01408d640a0b01347e570b0b01347e570c0b01408d640d0b01408d640e0b01408d640f0b01469e65100b01408d64110b01408d64120b01408d64130b01408d64140b01408d64150b01408d64160b01469e65170b01469e65180b01408d64190b01347e571a0b01347e571b0b01408d641c0b01408d641d0b01408d641e0b01060000000c01060000010c01408d64020c01408d64030c01469e65040c01469e65050c01408d64060c01469e65070c01469e65080c01469e65090c01408d640a0c01347e570b0c01408d640c0c01469e650d0c01469e650e0c01408d640f0c01469e65100c01408d64110c01408d64120c01469e65130c01469e65140c01408d64150c01469e65160c01469e65170c01469e65180c01408d64190c01347e571a0c01408d641b0c01469e651c0c01469e651d0c01408d641e0c01060000000d01060000010d01408d64020d01469e65030d01469e65040d01469e65050d01408d64060d01469e65070d01469e65080d01408d64090d01408d640a0d01408d640b0d01408d640c0d01469e650d0d01469e650e0d01469e650f0d01408d64100d01408d64110d01469e65120d01469e65130d01469e65140d01408d64150d01469e65160d01469e65170d01408d64180d01408d64190d01408d641a0d01408d641b0d01469e651c0d01469e651d0d01469e651e0d01060000000e01060000010e01408d64020e01469e65030e01469e65040e01408d64050e01408d64060e01408d64070e01408d64080e01408d64090e01408d640a0e01408d640b0e01408d640c0e01408d640d0e01469e650e0e01469e650f0e01408d64100e01408d64110e01469e65120e01469e65130e01408d64140e01408d64150e01408d64160e01408d64170e01408d64180e01408d64190e01408d641a0e01408d641b0e01408d641c0e01469e651d0e01469e651e0e01060000000f01060000010f01408d64020f01469e65030f01469e65040f01408d64050f01347e57060f01408d64070f01469e65080f01469e65090f01469e650a0f01408d640b0f01469e650c0f01469e650d0f01408d640e0f01408d640f0f01469e65100f01408d64110f01469e65120f01469e65130f01408d64140f01347e57150f01408d64160f01469e65170f01469e65180f01469e65190f01408d641a0f01469e651b0f01469e651c0f01408d641d0f01408d641e0f01060000001001060000011001469e65021001469e65031001469e65041001408d64051001408d64061001408d64071001469e65081001469e65091001408d640a1001408d640b1001408d640c1001408d640d1001408d640e1001408d640f1001408d64101001469e65111001469e65121001469e65131001408d64141001408d64151001408d64161001469e65171001469e65181001408d64191001408d641a1001408d641b1001408d641c1001408d641d1001408d641e1001060000001101060000011101469e65021101469e65031101408d64041101469e65051101469e65061101408d64071101408d64081101408d64091101408d640a1101408d640b1101408d640c1101469e650d1101469e650e1101469e650f1101408d64101101469e65111101469e65121101408d64131101469e65141101469e65151101408d64161101408d64171101408d64181101408d64191101408d641a1101408d641b1101469e651c1101469e651d1101469e651e1101060000001201060000011201408d64021201408d64031201408d64041201469e65051201469e65061201408d64071201408d64081201408d64091201469e650a1201469e650b1201408d640c1201469e650d1201469e650e1201469e650f1201408d64101201408d64111201408d64121201408d64131201469e65141201469e65151201408d64161201408d64171201408d64181201469e65191201469e651a1201408d641b1201469e651c1201469e651d1201469e651e1201060000001301060000011301469e65021301408d64031301408d64041301408d64051301408d64061301408d64071301408d64081301469e65091301469e650a1301469e650b1301408d640c1301408d640d1301469e650e1301469e650f1301408d64101301469e65111301408d64121301408d64131301408d64141301408d64151301408d64161301408d64171301469e65181301469e65191301469e651a1301408d641b1301408d641c1301469e651d1301469e651e1301060000001401060000011401469e65021401469e65031401347e57041401408d64051401469e65061401469e65071401408d64081401469e65091401469e650a1401408d640b1401408d640c1401408d640d1401347e570e1401347e570f1401469e65101401469e65111401469e65121401347e57131401408d64141401469e65151401469e65161401408d64171401469e65181401469e65191401408d641a1401408d641b1401408d641c1401347e571d1401347e571e1401060000001501060000011501469e65021501408d64031501347e57041501347e57051501469e65061501469e65071501408d64081501408d64091501347e570a1501408d640b1501408d640c1501408d640d1501408d640e1501347e570f1501469e65101501469e65111501408d64121501347e57131501347e57141501469e65151501469e65161501408d64171501408d64181501347e57191501408d641a1501408d641b1501408d641c1501408d641d1501347e571e1501060000001601060000011601060000021601408d64031601408d64041601408d64051601408d64061601408d64071601408d64081601408d64091601347e570a1601347e570b1601408d640c1601469e650d1601469e650e1601408d640f1601408d64101601408d64111601408d64121601408d64131601408d64141601408d64151601408d64161601408d64171601408d64181601347e57191601347e571a1601408d641b1601469e651c1601469e651d16010600001e1601060000021701060000031701060000041701408d64051701408d64061701469e65071701469e65081701408d64091701469e650a1701469e650b1701408d640c1701469e650d1701469e650e1701469e650f1701347e57101701347e57111701469e65121701469e65131701408d64141701408d64151701469e65161701469e65171701408d64181701469e65191701469e651a1701408d641b17010600001c1701060000041801060000051801060000061801469e65071801469e65081801408d64091801469e650a1801469e650b1801408d640c1801408d640d1801469e650e1801469e650f1801347e57101801408d64111801469e65121801469e65131801408d64141801469e65151801469e65161801469e65171801408d64181801469e651918010600001a1801060000061901060000071901060000081901408d64091901408d640a1901408d640b1901408d640c1901408d640d1901408d640e1901408d640f1901408d64101901408d64111901408d64121901408d64131901408d64141901469e65151901469e65161901408d64171901060000181901060000081a01060000091a010600000a1a01347e570b1a01347e570c1a01408d640d1a01408d640e1a01408d640f1a01469e65101a01408d64111a01408d64121a01408d64131a01408d64141a01408d64151a01060000161a010600000a1b010600000b1b010600000c1b01469e650d1b01469e650e1b01408d640f1b01469e65101b01408d64111b01408d64121b01469e65131b01060000141b010600000c1c010600000d1c010600000e1c01469e650f1c01408d64101c01408d64111c01060000121c010600000e1d010600000f1d01060000101d01060000");

    function Web$Kaelin$Coord$new$(_i$1, _j$2) {
        var $349 = ({
            _: 'Web.Kaelin.Coord.new',
            'i': _i$1,
            'j': _j$2
        });
        return $349;
    };
    const Web$Kaelin$Coord$new = x0 => x1 => Web$Kaelin$Coord$new$(x0, x1);

    function String$cons$(_head$1, _tail$2) {
        var $350 = (String.fromCharCode(_head$1) + _tail$2);
        return $350;
    };
    const String$cons = x0 => x1 => String$cons$(x0, x1);
    const String$concat = a0 => a1 => (a0 + a1);
    const Nat$gtn = a0 => a1 => (a0 > a1);

    function Int$is_neg$(_a$1) {
        var $351 = _a$1((_a$pos$2 => _a$neg$3 => {
            var $352 = (_a$neg$3 > _a$pos$2);
            return $352;
        }));
        return $351;
    };
    const Int$is_neg = x0 => Int$is_neg$(x0);

    function Int$new$(_pos$1, _neg$2, _new$4) {
        var Int$new$ = (_pos$1, _neg$2, _new$4) => ({
            ctr: 'TCO',
            arg: [_pos$1, _neg$2, _new$4]
        });
        var Int$new = _pos$1 => _neg$2 => _new$4 => Int$new$(_pos$1, _neg$2, _new$4);
        var arg = [_pos$1, _neg$2, _new$4];
        while (true) {
            let [_pos$1, _neg$2, _new$4] = arg;
            var R = (() => {
                var self = _pos$1;
                if (self === 0n) {
                    var $353 = _new$4(Nat$zero)(_neg$2);
                    return $353;
                } else {
                    var $354 = (self - 1n);
                    var self = _neg$2;
                    if (self === 0n) {
                        var $356 = _new$4(Nat$succ$($354))(Nat$zero);
                        var $355 = $356;
                    } else {
                        var $357 = (self - 1n);
                        var $358 = Int$new$($354, $357, _new$4);
                        var $355 = $358;
                    };
                    return $355;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Int$new = x0 => x1 => x2 => Int$new$(x0, x1, x2);

    function Int$neg$(_a$1) {
        var $359 = _a$1((_a$pos$2 => _a$neg$3 => {
            var $360 = Int$new(_a$neg$3)(_a$pos$2);
            return $360;
        }));
        return $359;
    };
    const Int$neg = x0 => Int$neg$(x0);

    function Int$abs$(_a$1) {
        var _neg$2 = Int$is_neg$(_a$1);
        var self = _neg$2;
        if (self) {
            var _a$3 = Int$neg$(_a$1);
            var $362 = _a$3((_a$pos$4 => _a$neg$5 => {
                var $363 = _a$pos$4;
                return $363;
            }));
            var $361 = $362;
        } else {
            var $364 = _a$1((_a$pos$3 => _a$neg$4 => {
                var $365 = _a$pos$3;
                return $365;
            }));
            var $361 = $364;
        };
        return $361;
    };
    const Int$abs = x0 => Int$abs$(x0);

    function Int$to_nat$(_a$1) {
        var $366 = Pair$new$(Int$is_neg$(_a$1), Int$abs$(_a$1));
        return $366;
    };
    const Int$to_nat = x0 => Int$to_nat$(x0);

    function List$fold$(_list$2, _nil$4, _cons$5) {
        var self = _list$2;
        switch (self._) {
            case 'List.cons':
                var $368 = self.head;
                var $369 = self.tail;
                var $370 = _cons$5($368)(List$fold$($369, _nil$4, _cons$5));
                var $367 = $370;
                break;
            case 'List.nil':
                var $371 = _nil$4;
                var $367 = $371;
                break;
        };
        return $367;
    };
    const List$fold = x0 => x1 => x2 => List$fold$(x0, x1, x2);

    function Either$(_A$1, _B$2) {
        var $372 = null;
        return $372;
    };
    const Either = x0 => x1 => Either$(x0, x1);

    function Either$left$(_value$3) {
        var $373 = ({
            _: 'Either.left',
            'value': _value$3
        });
        return $373;
    };
    const Either$left = x0 => Either$left$(x0);

    function Either$right$(_value$3) {
        var $374 = ({
            _: 'Either.right',
            'value': _value$3
        });
        return $374;
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
                    var $375 = Either$left$(_n$1);
                    return $375;
                } else {
                    var $376 = (self - 1n);
                    var self = _n$1;
                    if (self === 0n) {
                        var $378 = Either$right$(Nat$succ$($376));
                        var $377 = $378;
                    } else {
                        var $379 = (self - 1n);
                        var $380 = Nat$sub_rem$($379, $376);
                        var $377 = $380;
                    };
                    return $377;
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
                        var $381 = self.value;
                        var $382 = Nat$div_mod$go$($381, _m$2, Nat$succ$(_d$3));
                        return $382;
                    case 'Either.right':
                        var $383 = Pair$new$(_d$3, _n$1);
                        return $383;
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

    function List$cons$(_head$2, _tail$3) {
        var $384 = ({
            _: 'List.cons',
            'head': _head$2,
            'tail': _tail$3
        });
        return $384;
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
                        var $385 = self.fst;
                        var $386 = self.snd;
                        var self = $385;
                        if (self === 0n) {
                            var $388 = List$cons$($386, _res$3);
                            var $387 = $388;
                        } else {
                            var $389 = (self - 1n);
                            var $390 = Nat$to_base$go$(_base$1, $385, List$cons$($386, _res$3));
                            var $387 = $390;
                        };
                        return $387;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Nat$to_base$go = x0 => x1 => x2 => Nat$to_base$go$(x0, x1, x2);

    function Nat$to_base$(_base$1, _nat$2) {
        var $391 = Nat$to_base$go$(_base$1, _nat$2, List$nil);
        return $391;
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
                    var $392 = Nat$mod$go$(_n$1, _r$3, _m$2);
                    return $392;
                } else {
                    var $393 = (self - 1n);
                    var self = _n$1;
                    if (self === 0n) {
                        var $395 = _r$3;
                        var $394 = $395;
                    } else {
                        var $396 = (self - 1n);
                        var $397 = Nat$mod$go$($396, $393, Nat$succ$(_r$3));
                        var $394 = $397;
                    };
                    return $394;
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
        var $398 = null;
        return $398;
    };
    const Maybe = x0 => Maybe$(x0);

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
                        var $399 = self.head;
                        var $400 = self.tail;
                        var self = _index$2;
                        if (self === 0n) {
                            var $402 = Maybe$some$($399);
                            var $401 = $402;
                        } else {
                            var $403 = (self - 1n);
                            var $404 = List$at$($403, $400);
                            var $401 = $404;
                        };
                        return $401;
                    case 'List.nil':
                        var $405 = Maybe$none;
                        return $405;
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
                    var $408 = self.value;
                    var $409 = $408;
                    var $407 = $409;
                    break;
                case 'Maybe.none':
                    var $410 = 35;
                    var $407 = $410;
                    break;
            };
            var $406 = $407;
        } else {
            var $411 = 35;
            var $406 = $411;
        };
        return $406;
    };
    const Nat$show_digit = x0 => x1 => Nat$show_digit$(x0, x1);

    function Nat$to_string_base$(_base$1, _nat$2) {
        var $412 = List$fold$(Nat$to_base$(_base$1, _nat$2), String$nil, (_n$3 => _str$4 => {
            var $413 = String$cons$(Nat$show_digit$(_base$1, _n$3), _str$4);
            return $413;
        }));
        return $412;
    };
    const Nat$to_string_base = x0 => x1 => Nat$to_string_base$(x0, x1);

    function Nat$show$(_n$1) {
        var $414 = Nat$to_string_base$(10n, _n$1);
        return $414;
    };
    const Nat$show = x0 => Nat$show$(x0);

    function Int$show$(_a$1) {
        var _result$2 = Int$to_nat$(_a$1);
        var self = _result$2;
        switch (self._) {
            case 'Pair.new':
                var $416 = self.fst;
                var $417 = self.snd;
                var self = $416;
                if (self) {
                    var $419 = ("-" + Nat$show$($417));
                    var $418 = $419;
                } else {
                    var $420 = ("+" + Nat$show$($417));
                    var $418 = $420;
                };
                var $415 = $418;
                break;
        };
        return $415;
    };
    const Int$show = x0 => Int$show$(x0);

    function Web$Kaelin$Coord$show$(_coord$1) {
        var self = _coord$1;
        switch (self._) {
            case 'Web.Kaelin.Coord.new':
                var $422 = self.i;
                var $423 = self.j;
                var $424 = (Int$show$($422) + (":" + Int$show$($423)));
                var $421 = $424;
                break;
        };
        return $421;
    };
    const Web$Kaelin$Coord$show = x0 => Web$Kaelin$Coord$show$(x0);

    function Map$set$(_key$2, _val$3, _map$4) {
        var $425 = BitsMap$set$(String$to_bits$(_key$2), _val$3, _map$4);
        return $425;
    };
    const Map$set = x0 => x1 => x2 => Map$set$(x0, x1, x2);

    function Maybe$default$(_m$2, _a$3) {
        var self = _m$2;
        switch (self._) {
            case 'Maybe.some':
                var $427 = self.value;
                var $428 = $427;
                var $426 = $428;
                break;
            case 'Maybe.none':
                var $429 = _a$3;
                var $426 = $429;
                break;
        };
        return $426;
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
                        var $430 = self.slice(0, -1);
                        var self = _map$3;
                        switch (self._) {
                            case 'BitsMap.tie':
                                var $432 = self.lft;
                                var $433 = BitsMap$get$($430, $432);
                                var $431 = $433;
                                break;
                            case 'BitsMap.new':
                                var $434 = Maybe$none;
                                var $431 = $434;
                                break;
                        };
                        return $431;
                    case 'i':
                        var $435 = self.slice(0, -1);
                        var self = _map$3;
                        switch (self._) {
                            case 'BitsMap.tie':
                                var $437 = self.rgt;
                                var $438 = BitsMap$get$($435, $437);
                                var $436 = $438;
                                break;
                            case 'BitsMap.new':
                                var $439 = Maybe$none;
                                var $436 = $439;
                                break;
                        };
                        return $436;
                    case 'e':
                        var self = _map$3;
                        switch (self._) {
                            case 'BitsMap.tie':
                                var $441 = self.val;
                                var $442 = $441;
                                var $440 = $442;
                                break;
                            case 'BitsMap.new':
                                var $443 = Maybe$none;
                                var $440 = $443;
                                break;
                        };
                        return $440;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const BitsMap$get = x0 => x1 => BitsMap$get$(x0, x1);

    function Map$get$(_key$2, _map$3) {
        var $444 = BitsMap$get$(String$to_bits$(_key$2), _map$3);
        return $444;
    };
    const Map$get = x0 => x1 => Map$get$(x0, x1);

    function Web$Kaelin$Map$push$(_coord$1, _ent$2, _map$3) {
        var _key$4 = Web$Kaelin$Coord$show$(_coord$1);
        var $445 = Map$set$(_key$4, List$cons$(_ent$2, Maybe$default$(Map$get$(_key$4, _map$3), List$nil)), _map$3);
        return $445;
    };
    const Web$Kaelin$Map$push = x0 => x1 => x2 => Web$Kaelin$Map$push$(x0, x1, x2);

    function Web$Kaelin$Draw$initial_ent$(_map$1) {
        var _ent_croni$2 = Web$Kaelin$Entity$char$(Kaelin$Assets$chars$croni0_d_1);
        var _ent_cyclope$3 = Web$Kaelin$Entity$char$(Kaelin$Assets$chars$cyclope_d_1);
        var _ent_lela$4 = Web$Kaelin$Entity$char$(Kaelin$Assets$chars$lela_d_1);
        var _ent_octoking$5 = Web$Kaelin$Entity$char$(Kaelin$Assets$chars$octoking_d_1);
        var _ent_grass$6 = Web$Kaelin$Entity$background$(Kaelin$Assets$dark_grass_4);
        var _new_coord$7 = Web$Kaelin$Coord$new;
        var _map$8 = Web$Kaelin$Map$push$(_new_coord$7(Int$new(0n)(0n))(Int$new(0n)(0n)), _ent_grass$6, _map$1);
        var _map$9 = Web$Kaelin$Map$push$(_new_coord$7(Int$new(0n)(0n))(Int$new(0n)(0n)), _ent_cyclope$3, _map$8);
        var _map$10 = Web$Kaelin$Map$push$(_new_coord$7(Int$new(0n)(1n))(Int$new(0n)(2n)), _ent_croni$2, _map$9);
        var _map$11 = Web$Kaelin$Map$push$(_new_coord$7(Int$new(3n)(0n))(Int$new(2n)(0n)), _ent_lela$4, _map$10);
        var _map$12 = Web$Kaelin$Map$push$(_new_coord$7(Int$new(0n)(3n))(Int$new(5n)(0n)), _ent_octoking$5, _map$11);
        var $446 = _map$12;
        return $446;
    };
    const Web$Kaelin$Draw$initial_ent = x0 => Web$Kaelin$Draw$initial_ent$(x0);

    function Web$Kaelin$State$game$(_room$1, _tick$2, _players$3, _map$4, _interface$5) {
        var $447 = ({
            _: 'Web.Kaelin.State.game',
            'room': _room$1,
            'tick': _tick$2,
            'players': _players$3,
            'map': _map$4,
            'interface': _interface$5
        });
        return $447;
    };
    const Web$Kaelin$State$game = x0 => x1 => x2 => x3 => x4 => Web$Kaelin$State$game$(x0, x1, x2, x3, x4);
    const Web$Kaelin$Resources$room = "0x196581625483";

    function App$EnvInfo$new$(_screen_size$1, _mouse_pos$2) {
        var $448 = ({
            _: 'App.EnvInfo.new',
            'screen_size': _screen_size$1,
            'mouse_pos': _mouse_pos$2
        });
        return $448;
    };
    const App$EnvInfo$new = x0 => x1 => App$EnvInfo$new$(x0, x1);

    function DOM$text$(_value$1) {
        var $449 = ({
            _: 'DOM.text',
            'value': _value$1
        });
        return $449;
    };
    const DOM$text = x0 => DOM$text$(x0);

    function VoxBox$clear$(_img$1) {
        var $450 = VoxBox$set_length$(0, _img$1);
        return $450;
    };
    const VoxBox$clear = x0 => VoxBox$clear$(x0);
    const Web$Kaelin$Resources$map_size = 5;
    const Web$Kaelin$Resources$hexagon_radius = 15;
    const Nat$add = a0 => a1 => (a0 + a1);

    function Int$add$(_a$1, _b$2) {
        var $451 = _a$1((_a$pos$3 => _a$neg$4 => {
            var $452 = _b$2((_b$pos$5 => _b$neg$6 => {
                var $453 = Int$new((_a$pos$3 + _b$pos$5))((_a$neg$4 + _b$neg$6));
                return $453;
            }));
            return $452;
        }));
        return $451;
    };
    const Int$add = x0 => x1 => Int$add$(x0, x1);

    function Int$sub$(_a$1, _b$2) {
        var $454 = Int$add$(_a$1, Int$neg$(_b$2));
        return $454;
    };
    const Int$sub = x0 => x1 => Int$sub$(x0, x1);

    function Word$fold$(_nil$3, _w0$4, _w1$5, _word$6) {
        var self = _word$6;
        switch (self._) {
            case 'Word.o':
                var $456 = self.pred;
                var $457 = _w0$4(Word$fold$(_nil$3, _w0$4, _w1$5, $456));
                var $455 = $457;
                break;
            case 'Word.i':
                var $458 = self.pred;
                var $459 = _w1$5(Word$fold$(_nil$3, _w0$4, _w1$5, $458));
                var $455 = $459;
                break;
            case 'Word.e':
                var $460 = _nil$3;
                var $455 = $460;
                break;
        };
        return $455;
    };
    const Word$fold = x0 => x1 => x2 => x3 => Word$fold$(x0, x1, x2, x3);
    const Nat$mul = a0 => a1 => (a0 * a1);

    function Word$to_nat$(_word$2) {
        var $461 = Word$fold$(0n, a1 => (2n * a1), (_x$4 => {
            var $462 = Nat$succ$((2n * _x$4));
            return $462;
        }), _word$2);
        return $461;
    };
    const Word$to_nat = x0 => Word$to_nat$(x0);

    function U32$to_nat$(_a$1) {
        var self = _a$1;
        switch ('u32') {
            case 'u32':
                var $464 = u32_to_word(self);
                var $465 = Word$to_nat$($464);
                var $463 = $465;
                break;
        };
        return $463;
    };
    const U32$to_nat = x0 => U32$to_nat$(x0);

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
    const U32$sub = a0 => a1 => (Math.max(a0 - a1, 0));

    function Web$Kaelin$Coord$fit$(_coord$1, _map_size$2) {
        var self = _coord$1;
        switch (self._) {
            case 'Web.Kaelin.Coord.new':
                var $471 = self.i;
                var $472 = self.j;
                var _i$5 = $471;
                var _j$6 = $472;
                var _sum$7 = Int$add$(_i$5, _j$6);
                var _abs$8 = Int$abs$(_sum$7);
                var _abs$9 = (Number(_abs$8));
                var $473 = (_abs$9 <= (Math.max(_map_size$2 - 1, 0)));
                var $470 = $473;
                break;
        };
        return $470;
    };
    const Web$Kaelin$Coord$fit = x0 => x1 => Web$Kaelin$Coord$fit$(x0, x1);

    function Web$Kaelin$Draw$background$(_coord$1, _map$2) {
        var _ent_grass$3 = Web$Kaelin$Entity$background$(Kaelin$Assets$dark_grass_4);
        var _map$4 = Web$Kaelin$Map$push$(_coord$1, _ent_grass$3, _map$2);
        var $474 = _map$4;
        return $474;
    };
    const Web$Kaelin$Draw$background = x0 => x1 => Web$Kaelin$Draw$background$(x0, x1);

    function Int$from_u32$(_n$1) {
        var $475 = Int$new(U32$to_nat$(_n$1))(0n);
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
        var $479 = _a$1((_a$pos$3 => _a$neg$4 => {
            var $480 = Int$new((_a$pos$3 / _n$2))((_a$neg$4 / _n$2));
            return $480;
        }));
        return $479;
    };
    const Int$div_nat = x0 => x1 => Int$div_nat$(x0, x1);
    const Web$Kaelin$Resources$center_x = 128;
    const Web$Kaelin$Resources$center_y = 128;

    function Int$mul$(_a$1, _b$2) {
        var $481 = _a$1((_a$pos$3 => _a$neg$4 => {
            var $482 = _b$2((_b$pos$5 => _b$neg$6 => {
                var $483 = Int$new(((_a$pos$3 * _b$pos$5) + (_a$neg$4 * _b$neg$6)))(((_a$pos$3 * _b$neg$6) + (_a$pos$3 * _b$neg$6)));
                return $483;
            }));
            return $482;
        }));
        return $481;
    };
    const Int$mul = x0 => x1 => Int$mul$(x0, x1);

    function Int$from_nat$(_n$1) {
        var $484 = Int$new(_n$1)(0n);
        return $484;
    };
    const Int$from_nat = x0 => Int$from_nat$(x0);

    function Int$to_u32$(_a$1) {
        var $485 = _a$1((_a$pos$2 => _a$neg$3 => {
            var self = _a$neg$3;
            if (self === 0n) {
                var $487 = Pair$new$(Bool$false, (Number(_a$pos$2)));
                var $486 = $487;
            } else {
                var $488 = (self - 1n);
                var $489 = Pair$new$(Bool$true, (Number(_a$neg$3)));
                var $486 = $489;
            };
            return $486;
        }));
        return $485;
    };
    const Int$to_u32 = x0 => Int$to_u32$(x0);

    function Web$Kaelin$Coord$to_screen_xy$(_coord$1) {
        var self = _coord$1;
        switch (self._) {
            case 'Web.Kaelin.Coord.new':
                var $491 = self.i;
                var $492 = self.j;
                var _i$4 = $491;
                var _j$5 = $492;
                var _int_rad$6 = Int$from_u32$(Web$Kaelin$Resources$hexagon_radius);
                var _hlf$7 = Int$div_nat$(_int_rad$6, 2n);
                var _int_screen_center_x$8 = Int$from_u32$(Web$Kaelin$Resources$center_x);
                var _int_screen_center_y$9 = Int$from_u32$(Web$Kaelin$Resources$center_y);
                var _cx$10 = Int$add$(_int_screen_center_x$8, Int$mul$(_j$5, _int_rad$6));
                var _cx$11 = Int$add$(_cx$10, Int$mul$(_i$4, Int$mul$(_int_rad$6, Int$from_nat$(2n))));
                var _cy$12 = Int$add$(_int_screen_center_y$9, Int$mul$(_j$5, Int$mul$(_hlf$7, Int$from_nat$(3n))));
                var self = Int$to_u32$(_cx$11);
                switch (self._) {
                    case 'Pair.new':
                        var $494 = self.snd;
                        var self = Int$to_u32$(_cy$12);
                        switch (self._) {
                            case 'Pair.new':
                                var $496 = self.snd;
                                var $497 = Pair$new$($494, $496);
                                var $495 = $497;
                                break;
                        };
                        var $493 = $495;
                        break;
                };
                var $490 = $493;
                break;
        };
        return $490;
    };
    const Web$Kaelin$Coord$to_screen_xy = x0 => Web$Kaelin$Coord$to_screen_xy$(x0);

    function VoxBox$Draw$deresagon$(_cx$1, _cy$2, _cz$3, _rad$4, _col$5, _draw_a$6, _draw_b$7, _draw_c$8, _draw_d$9, _draw_e$10, _draw_f$11, _img$12) {
        var _hlf$13 = ((_rad$4 / 2) >>> 0);
        var _v0x$14 = ((_cx$1 + _rad$4) >>> 0);
        var _v0y$15 = ((_cy$2 + _hlf$13) >>> 0);
        var _v1x$16 = ((_cx$1 + _rad$4) >>> 0);
        var _v1y$17 = (Math.max(_cy$2 - _hlf$13, 0));
        var _v2x$18 = _cx$1;
        var _v2y$19 = (Math.max(_cy$2 - _rad$4, 0));
        var _v3x$20 = (Math.max(_cx$1 - _rad$4, 0));
        var _v3y$21 = (Math.max(_cy$2 - _hlf$13, 0));
        var _v4x$22 = (Math.max(_cx$1 - _rad$4, 0));
        var _v4y$23 = ((_cy$2 + _hlf$13) >>> 0);
        var _v5x$24 = _cx$1;
        var _v5y$25 = ((_cy$2 + _rad$4) >>> 0);
        var self = _draw_a$6;
        if (self) {
            var _img$26 = (() => {
                var $500 = _img$12;
                var $501 = 0;
                var $502 = _rad$4;
                let _img$27 = $500;
                for (let _i$26 = $501; _i$26 < $502; ++_i$26) {
                    var _px$28 = _v1x$16;
                    var _py$29 = ((_v1y$17 + _i$26) >>> 0);
                    var $500 = ((_img$27.buffer[_img$27.length * 2] = ((0 | _px$28 | (_py$29 << 12) | (_cz$3 << 24))), _img$27.buffer[_img$27.length * 2 + 1] = _col$5, _img$27.length++, _img$27));
                    _img$27 = $500;
                };
                return _img$27;
            })();
            var $499 = _img$26;
            var _img$26 = $499;
        } else {
            var $503 = _img$12;
            var _img$26 = $503;
        };
        var self = _draw_d$9;
        if (self) {
            var _img$27 = (() => {
                var $505 = _img$26;
                var $506 = 0;
                var $507 = _rad$4;
                let _img$28 = $505;
                for (let _i$27 = $506; _i$27 < $507; ++_i$27) {
                    var _px$29 = _v3x$20;
                    var _py$30 = ((_v3y$21 + _i$27) >>> 0);
                    var $505 = ((_img$28.buffer[_img$28.length * 2] = ((0 | _px$29 | (_py$30 << 12) | (_cz$3 << 24))), _img$28.buffer[_img$28.length * 2 + 1] = _col$5, _img$28.length++, _img$28));
                    _img$28 = $505;
                };
                return _img$28;
            })();
            var $504 = _img$27;
            var _img$27 = $504;
        } else {
            var $508 = _img$26;
            var _img$27 = $508;
        };
        var self = _draw_b$7;
        if (self) {
            var _img$28 = (() => {
                var $510 = _img$27;
                var $511 = 0;
                var $512 = _rad$4;
                let _img$29 = $510;
                for (let _i$28 = $511; _i$28 < $512; ++_i$28) {
                    var _px$30 = ((_v2x$18 + _i$28) >>> 0);
                    var _py$31 = ((_v2y$19 + ((_i$28 / 2) >>> 0)) >>> 0);
                    var $510 = ((_img$29.buffer[_img$29.length * 2] = ((0 | _px$30 | (_py$31 << 12) | (_cz$3 << 24))), _img$29.buffer[_img$29.length * 2 + 1] = _col$5, _img$29.length++, _img$29));
                    _img$29 = $510;
                };
                return _img$29;
            })();
            var $509 = _img$28;
            var _img$28 = $509;
        } else {
            var $513 = _img$27;
            var _img$28 = $513;
        };
        var self = _draw_c$8;
        if (self) {
            var _img$29 = (() => {
                var $515 = _img$28;
                var $516 = 0;
                var $517 = _rad$4;
                let _img$30 = $515;
                for (let _i$29 = $516; _i$29 < $517; ++_i$29) {
                    var _px$31 = (Math.max(_v2x$18 - _i$29, 0));
                    var _py$32 = ((_v2y$19 + ((_i$29 / 2) >>> 0)) >>> 0);
                    var $515 = ((_img$30.buffer[_img$30.length * 2] = ((0 | _px$31 | (_py$32 << 12) | (_cz$3 << 24))), _img$30.buffer[_img$30.length * 2 + 1] = _col$5, _img$30.length++, _img$30));
                    _img$30 = $515;
                };
                return _img$30;
            })();
            var $514 = _img$29;
            var _img$29 = $514;
        } else {
            var $518 = _img$28;
            var _img$29 = $518;
        };
        var self = _draw_f$11;
        if (self) {
            var _img$30 = (() => {
                var $520 = _img$29;
                var $521 = 0;
                var $522 = _rad$4;
                let _img$31 = $520;
                for (let _i$30 = $521; _i$30 < $522; ++_i$30) {
                    var _px$32 = (Math.max((Math.max(_v0x$14 - _i$30, 0)) - 1, 0));
                    var _py$33 = ((_v0y$15 + ((_i$30 / 2) >>> 0)) >>> 0);
                    var $520 = ((_img$31.buffer[_img$31.length * 2] = ((0 | _px$32 | (_py$33 << 12) | (_cz$3 << 24))), _img$31.buffer[_img$31.length * 2 + 1] = _col$5, _img$31.length++, _img$31));
                    _img$31 = $520;
                };
                return _img$31;
            })();
            var $519 = _img$30;
            var _img$30 = $519;
        } else {
            var $523 = _img$29;
            var _img$30 = $523;
        };
        var self = _draw_e$10;
        if (self) {
            var _img$31 = (() => {
                var $525 = _img$30;
                var $526 = 0;
                var $527 = _rad$4;
                let _img$32 = $525;
                for (let _i$31 = $526; _i$31 < $527; ++_i$31) {
                    var _px$33 = ((((_v4x$22 + _i$31) >>> 0) + 1) >>> 0);
                    var _py$34 = ((_v4y$23 + ((_i$31 / 2) >>> 0)) >>> 0);
                    var $525 = ((_img$32.buffer[_img$32.length * 2] = ((0 | _px$33 | (_py$34 << 12) | (_cz$3 << 24))), _img$32.buffer[_img$32.length * 2 + 1] = _col$5, _img$32.length++, _img$32));
                    _img$32 = $525;
                };
                return _img$32;
            })();
            var $524 = _img$31;
            var _img$31 = $524;
        } else {
            var $528 = _img$30;
            var _img$31 = $528;
        };
        var $498 = _img$31;
        return $498;
    };
    const VoxBox$Draw$deresagon = x0 => x1 => x2 => x3 => x4 => x5 => x6 => x7 => x8 => x9 => x10 => x11 => VoxBox$Draw$deresagon$(x0, x1, x2, x3, x4, x5, x6, x7, x8, x9, x10, x11);

    function Web$Kaelin$Draw$hexagon_border$(_cx$1, _cy$2, _rad$3, _col$4, _img$5) {
        var _img$6 = VoxBox$Draw$deresagon$(_cx$1, _cy$2, 0, _rad$3, _col$4, Bool$true, Bool$true, Bool$true, Bool$true, Bool$true, Bool$true, _img$5);
        var $529 = _img$6;
        return $529;
    };
    const Web$Kaelin$Draw$hexagon_border = x0 => x1 => x2 => x3 => x4 => Web$Kaelin$Draw$hexagon_border$(x0, x1, x2, x3, x4);
    const List$for = a0 => a1 => a2 => (list_for(a0)(a1)(a2));

    function List$imap$(_f$3, _xs$4) {
        var self = _xs$4;
        switch (self._) {
            case 'List.cons':
                var $531 = self.head;
                var $532 = self.tail;
                var $533 = List$cons$(_f$3(0n)($531), List$imap$((_n$7 => {
                    var $534 = _f$3(Nat$succ$(_n$7));
                    return $534;
                }), $532));
                var $530 = $533;
                break;
            case 'List.nil':
                var $535 = List$nil;
                var $530 = $535;
                break;
        };
        return $530;
    };
    const List$imap = x0 => x1 => List$imap$(x0, x1);

    function List$indices$u32$(_xs$2) {
        var $536 = List$imap$((_i$3 => _x$4 => {
            var $537 = Pair$new$((Number(_i$3)), _x$4);
            return $537;
        }), _xs$2);
        return $536;
    };
    const List$indices$u32 = x0 => List$indices$u32$(x0);

    function String$to_list$(_str$1) {
        var self = _str$1;
        if (self.length === 0) {
            var $539 = List$nil;
            var $538 = $539;
        } else {
            var $540 = self.charCodeAt(0);
            var $541 = self.slice(1);
            var $542 = List$cons$($540, String$to_list$($541));
            var $538 = $542;
        };
        return $538;
    };
    const String$to_list = x0 => String$to_list$(x0);

    function Bits$to_nat$(_b$1) {
        var self = _b$1;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'o':
                var $544 = self.slice(0, -1);
                var $545 = (2n * Bits$to_nat$($544));
                var $543 = $545;
                break;
            case 'i':
                var $546 = self.slice(0, -1);
                var $547 = Nat$succ$((2n * Bits$to_nat$($546)));
                var $543 = $547;
                break;
            case 'e':
                var $548 = 0n;
                var $543 = $548;
                break;
        };
        return $543;
    };
    const Bits$to_nat = x0 => Bits$to_nat$(x0);

    function U16$show_hex$(_a$1) {
        var self = _a$1;
        switch ('u16') {
            case 'u16':
                var $550 = u16_to_word(self);
                var $551 = Nat$to_string_base$(16n, Bits$to_nat$(Word$to_bits$($550)));
                var $549 = $551;
                break;
        };
        return $549;
    };
    const U16$show_hex = x0 => U16$show_hex$(x0);

    function PixelFont$get_img$(_char$1, _map$2) {
        var self = Map$get$(U16$show_hex$(_char$1), _map$2);
        switch (self._) {
            case 'Maybe.some':
                var $553 = self.value;
                var $554 = Maybe$some$($553);
                var $552 = $554;
                break;
            case 'Maybe.none':
                var $555 = Maybe$none;
                var $552 = $555;
                break;
        };
        return $552;
    };
    const PixelFont$get_img = x0 => x1 => PixelFont$get_img$(x0, x1);

    function Word$and$(_a$2, _b$3) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $557 = self.pred;
                var $558 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $560 = self.pred;
                            var $561 = (_a$pred$9 => {
                                var $562 = Word$o$(Word$and$(_a$pred$9, $560));
                                return $562;
                            });
                            var $559 = $561;
                            break;
                        case 'Word.i':
                            var $563 = self.pred;
                            var $564 = (_a$pred$9 => {
                                var $565 = Word$o$(Word$and$(_a$pred$9, $563));
                                return $565;
                            });
                            var $559 = $564;
                            break;
                        case 'Word.e':
                            var $566 = (_a$pred$7 => {
                                var $567 = Word$e;
                                return $567;
                            });
                            var $559 = $566;
                            break;
                    };
                    var $559 = $559($557);
                    return $559;
                });
                var $556 = $558;
                break;
            case 'Word.i':
                var $568 = self.pred;
                var $569 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $571 = self.pred;
                            var $572 = (_a$pred$9 => {
                                var $573 = Word$o$(Word$and$(_a$pred$9, $571));
                                return $573;
                            });
                            var $570 = $572;
                            break;
                        case 'Word.i':
                            var $574 = self.pred;
                            var $575 = (_a$pred$9 => {
                                var $576 = Word$i$(Word$and$(_a$pred$9, $574));
                                return $576;
                            });
                            var $570 = $575;
                            break;
                        case 'Word.e':
                            var $577 = (_a$pred$7 => {
                                var $578 = Word$e;
                                return $578;
                            });
                            var $570 = $577;
                            break;
                    };
                    var $570 = $570($568);
                    return $570;
                });
                var $556 = $569;
                break;
            case 'Word.e':
                var $579 = (_b$4 => {
                    var $580 = Word$e;
                    return $580;
                });
                var $556 = $579;
                break;
        };
        var $556 = $556(_b$3);
        return $556;
    };
    const Word$and = x0 => x1 => Word$and$(x0, x1);
    const U32$and = a0 => a1 => (a0 & a1);
    const Pos32$get_x = a0 => ((a0 & 0xFFF));
    const U32$shr = a0 => a1 => (a0 >>> a1);
    const Pos32$get_y = a0 => (((a0 >>> 12) & 0xFFF));
    const Pos32$get_z = a0 => ((a0 >>> 24));

    function VoxBox$get_len$(_img$1) {
        var self = _img$1;
        switch (self._) {
            case 'VoxBox.new':
                var $582 = self.length;
                var $583 = $582;
                var $581 = $583;
                break;
        };
        return $581;
    };
    const VoxBox$get_len = x0 => VoxBox$get_len$(x0);

    function Array$get$(_idx$3, _arr$4) {
        var $584 = Word$foldl$(Array$extract_tip, (_rec$6 => _arr$7 => {
            var _arr_l$8 = Array$extract_tie$(_arr$7);
            var self = _arr_l$8;
            switch (self._) {
                case 'Pair.new':
                    var $586 = self.fst;
                    var $587 = _rec$6($586);
                    var $585 = $587;
                    break;
            };
            return $585;
        }), (_rec$6 => _arr$7 => {
            var _arr_r$8 = Array$extract_tie$(_arr$7);
            var self = _arr_r$8;
            switch (self._) {
                case 'Pair.new':
                    var $589 = self.snd;
                    var $590 = _rec$6($589);
                    var $588 = $590;
                    break;
            };
            return $588;
        }), _idx$3)(_arr$4);
        return $584;
    };
    const Array$get = x0 => x1 => Array$get$(x0, x1);
    const Buffer32$get = a0 => a1 => ((a1[a0]));
    const VoxBox$get_pos = a0 => a1 => ((a1.buffer[a0 * 2]));
    const VoxBox$get_col = a0 => a1 => ((a1.buffer[a0 * 2 + 1]));

    function VoxBox$Draw$image$(_x$1, _y$2, _z$3, _src$4, _img$5) {
        var _len$6 = VoxBox$get_len$(_src$4);
        var _img$7 = (() => {
            var $592 = _img$5;
            var $593 = 0;
            var $594 = _len$6;
            let _img$8 = $592;
            for (let _i$7 = $593; _i$7 < $594; ++_i$7) {
                var _pos$9 = ((_src$4.buffer[_i$7 * 2]));
                var _col$10 = ((_src$4.buffer[_i$7 * 2 + 1]));
                var _p_x$11 = (_pos$9 & 4095);
                var _p_y$12 = ((_pos$9 & 16773120) >>> 12);
                var _p_z$13 = ((_pos$9 & 4278190080) >>> 24);
                var _p_x$14 = ((_p_x$11 + _x$1) >>> 0);
                var _p_y$15 = ((_p_y$12 + _y$2) >>> 0);
                var _p_z$16 = ((_p_z$13 + _z$3) >>> 0);
                var _pos$17 = ((0 | _p_x$14 | (_p_y$15 << 12) | (_p_z$16 << 24)));
                var $592 = ((_img$8.buffer[_img$8.length * 2] = _pos$17, _img$8.buffer[_img$8.length * 2 + 1] = _col$10, _img$8.length++, _img$8));
                _img$8 = $592;
            };
            return _img$8;
        })();
        var $591 = _img$7;
        return $591;
    };
    const VoxBox$Draw$image = x0 => x1 => x2 => x3 => x4 => VoxBox$Draw$image$(x0, x1, x2, x3, x4);

    function VoxBox$Draw$text$char$(_chr$1, _font_map$2, _chr_pos$3, _scr$4) {
        var self = PixelFont$get_img$(_chr$1, _font_map$2);
        switch (self._) {
            case 'Maybe.some':
                var $596 = self.value;
                var _x$6 = ((_chr_pos$3 & 0xFFF));
                var _y$7 = (((_chr_pos$3 >>> 12) & 0xFFF));
                var _z$8 = ((_chr_pos$3 >>> 24));
                var $597 = VoxBox$Draw$image$(_x$6, _y$7, _z$8, $596, _scr$4);
                var $595 = $597;
                break;
            case 'Maybe.none':
                var $598 = _scr$4;
                var $595 = $598;
                break;
        };
        return $595;
    };
    const VoxBox$Draw$text$char = x0 => x1 => x2 => x3 => VoxBox$Draw$text$char$(x0, x1, x2, x3);

    function Pos32$add$(_a$1, _b$2) {
        var _x$3 = ((((_a$1 & 0xFFF)) + ((_b$2 & 0xFFF))) >>> 0);
        var _y$4 = (((((_a$1 >>> 12) & 0xFFF)) + (((_b$2 >>> 12) & 0xFFF))) >>> 0);
        var _z$5 = ((((_a$1 >>> 24)) + ((_b$2 >>> 24))) >>> 0);
        var $599 = ((0 | _x$3 | (_y$4 << 12) | (_z$5 << 24)));
        return $599;
    };
    const Pos32$add = x0 => x1 => Pos32$add$(x0, x1);

    function VoxBox$Draw$text$(_txt$1, _font_map$2, _pos$3, _scr$4) {
        var _scr$5 = (() => {
            var $602 = _scr$4;
            var $603 = List$indices$u32$(String$to_list$(_txt$1));
            let _scr$6 = $602;
            let _pair$5;
            while ($603._ === 'List.cons') {
                _pair$5 = $603.head;
                var self = _pair$5;
                switch (self._) {
                    case 'Pair.new':
                        var $604 = self.fst;
                        var $605 = self.snd;
                        var _add_pos$9 = ((0 | (($604 * 6) >>> 0) | (0 << 12) | (0 << 24)));
                        var $606 = VoxBox$Draw$text$char$($605, _font_map$2, Pos32$add$(_pos$3, _add_pos$9), _scr$6);
                        var $602 = $606;
                        break;
                };
                _scr$6 = $602;
                $603 = $603.tail;
            }
            return _scr$6;
        })();
        var $600 = _scr$5;
        return $600;
    };
    const VoxBox$Draw$text = x0 => x1 => x2 => x3 => VoxBox$Draw$text$(x0, x1, x2, x3);
    const Map$new = BitsMap$new;

    function PixelFont$set_img$(_char$1, _img$2, _map$3) {
        var $607 = Map$set$(U16$show_hex$(_char$1), _img$2, _map$3);
        return $607;
    };
    const PixelFont$set_img = x0 => x1 => x2 => PixelFont$set_img$(x0, x1, x2);

    function U16$new$(_value$1) {
        var $608 = word_to_u16(_value$1);
        return $608;
    };
    const U16$new = x0 => U16$new$(x0);
    const Nat$to_u16 = a0 => (Number(a0));
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
        var $609 = _map$96;
        return $609;
    })();

    function Web$Kaelin$Draw$tile$empty$(_coord$1, _map$2, _img$3) {
        var self = _coord$1;
        switch (self._) {
            case 'Web.Kaelin.Coord.new':
                var $611 = self.i;
                var $612 = self.j;
                var self = Web$Kaelin$Coord$to_screen_xy$(_coord$1);
                switch (self._) {
                    case 'Pair.new':
                        var $614 = self.fst;
                        var $615 = self.snd;
                        var _cx$8 = (((Math.max($614 - Web$Kaelin$Resources$hexagon_radius, 0)) + 3) >>> 0);
                        var _str$9 = (Int$show$($611) + Int$show$($612));
                        var $616 = VoxBox$Draw$text$(_str$9, PixelFont$small_black, ((0 | _cx$8 | ($615 << 12) | (0 << 24))), _img$3);
                        var $613 = $616;
                        break;
                };
                var $610 = $613;
                break;
        };
        return $610;
    };
    const Web$Kaelin$Draw$tile$empty = x0 => x1 => x2 => Web$Kaelin$Draw$tile$empty$(x0, x1, x2);

    function Web$Kaelin$Map$get$(_coord$1, _map$2) {
        var $617 = Maybe$default$(Map$get$(Web$Kaelin$Coord$show$(_coord$1), _map$2), List$nil);
        return $617;
    };
    const Web$Kaelin$Map$get = x0 => x1 => Web$Kaelin$Map$get$(x0, x1);

    function Web$Kaelin$Draw$tile$(_coord$1, _map$2, _img$3) {
        var self = _coord$1;
        switch (self._) {
            case 'Web.Kaelin.Coord.new':
                var self = Web$Kaelin$Coord$to_screen_xy$(_coord$1);
                switch (self._) {
                    case 'Pair.new':
                        var $620 = self.fst;
                        var $621 = self.snd;
                        var _tile$8 = Web$Kaelin$Map$get$(_coord$1, _map$2);
                        var _img$9 = (() => {
                            var $624 = _img$3;
                            var $625 = _tile$8;
                            let _img$10 = $624;
                            let _ent$9;
                            while ($625._ === 'List.cons') {
                                _ent$9 = $625.head;
                                var _cx$11 = (Math.max($620 - Web$Kaelin$Resources$hexagon_radius, 0));
                                var self = _ent$9;
                                switch (self._) {
                                    case 'Web.Kaelin.Entity.background':
                                        var $626 = self.img;
                                        var _cy$13 = (Math.max($621 - Web$Kaelin$Resources$hexagon_radius, 0));
                                        var $627 = VoxBox$Draw$image$(_cx$11, _cy$13, 0, $626, _img$10);
                                        var $624 = $627;
                                        break;
                                    case 'Web.Kaelin.Entity.char':
                                        var $628 = self.img;
                                        var _aux_y$13 = ((Web$Kaelin$Resources$hexagon_radius * 2) >>> 0);
                                        var _cy$14 = (Math.max($621 - _aux_y$13, 0));
                                        var $629 = VoxBox$Draw$image$(_cx$11, _cy$14, 0, $628, _img$10);
                                        var $624 = $629;
                                        break;
                                };
                                _img$10 = $624;
                                $625 = $625.tail;
                            }
                            return _img$10;
                        })();
                        var $622 = _img$9;
                        var $619 = $622;
                        break;
                };
                var $618 = $619;
                break;
        };
        return $618;
    };
    const Web$Kaelin$Draw$tile = x0 => x1 => x2 => Web$Kaelin$Draw$tile$(x0, x1, x2);

    function Web$Kaelin$Draw$map$(_img$1, _map$2) {
        var _img$3 = VoxBox$clear$(_img$1);
        var _col$4 = ((0 | 0 | (0 << 8) | (255 << 16) | (255 << 24)));
        var _map_size$5 = Web$Kaelin$Resources$map_size;
        var _width$6 = ((((_map_size$5 * 2) >>> 0) + 1) >>> 0);
        var _height$7 = ((((_map_size$5 * 2) >>> 0) + 1) >>> 0);
        var _hex_rad$8 = Web$Kaelin$Resources$hexagon_radius;
        var _img$9 = (() => {
            var $631 = _img$3;
            var $632 = 0;
            var $633 = _height$7;
            let _img$10 = $631;
            for (let _j$9 = $632; _j$9 < $633; ++_j$9) {
                var _img$11 = (() => {
                    var $634 = _img$10;
                    var $635 = 0;
                    var $636 = _width$6;
                    let _img$12 = $634;
                    for (let _i$11 = $635; _i$11 < $636; ++_i$11) {
                        var _coord_i$13 = Int$sub$(Int$new(0n)(U32$to_nat$(_i$11)), Int$new(0n)(U32$to_nat$(_map_size$5)));
                        var _coord_j$14 = Int$sub$(Int$new(0n)(U32$to_nat$(_j$9)), Int$new(0n)(U32$to_nat$(_map_size$5)));
                        var _coord$15 = Web$Kaelin$Coord$new$(_coord_i$13, _coord_j$14);
                        var _fit$16 = Web$Kaelin$Coord$fit$(_coord$15, _map_size$5);
                        var self = _fit$16;
                        if (self) {
                            var _map$17 = Web$Kaelin$Draw$background$(_coord$15, _map$2);
                            var self = Web$Kaelin$Coord$to_screen_xy$(_coord$15);
                            switch (self._) {
                                case 'Pair.new':
                                    var $638 = self.fst;
                                    var $639 = self.snd;
                                    var _img$20 = Web$Kaelin$Draw$hexagon_border$($638, $639, _hex_rad$8, _col$4, _img$12);
                                    var _img$21 = Web$Kaelin$Draw$tile$empty$(_coord$15, _map$17, _img$20);
                                    var _img$22 = Web$Kaelin$Draw$tile$(_coord$15, _map$17, _img$21);
                                    var $640 = _img$22;
                                    var $637 = $640;
                                    break;
                            };
                            var $634 = $637;
                        } else {
                            var $641 = _img$12;
                            var $634 = $641;
                        };
                        _img$12 = $634;
                    };
                    return _img$12;
                })();
                var $631 = _img$11;
                _img$10 = $631;
            };
            return _img$10;
        })();
        var $630 = _img$9;
        return $630;
    };
    const Web$Kaelin$Draw$map = x0 => x1 => Web$Kaelin$Draw$map$(x0, x1);

    function BitsMap$values$go$(_xs$2, _list$3) {
        var self = _xs$2;
        switch (self._) {
            case 'BitsMap.tie':
                var $643 = self.val;
                var $644 = self.lft;
                var $645 = self.rgt;
                var self = $643;
                switch (self._) {
                    case 'Maybe.some':
                        var $647 = self.value;
                        var $648 = List$cons$($647, _list$3);
                        var _list0$7 = $648;
                        break;
                    case 'Maybe.none':
                        var $649 = _list$3;
                        var _list0$7 = $649;
                        break;
                };
                var _list1$8 = BitsMap$values$go$($644, _list0$7);
                var _list2$9 = BitsMap$values$go$($645, _list1$8);
                var $646 = _list2$9;
                var $642 = $646;
                break;
            case 'BitsMap.new':
                var $650 = _list$3;
                var $642 = $650;
                break;
        };
        return $642;
    };
    const BitsMap$values$go = x0 => x1 => BitsMap$values$go$(x0, x1);

    function Map$values$(_xs$2) {
        var $651 = BitsMap$values$go$(_xs$2, List$nil);
        return $651;
    };
    const Map$values = x0 => Map$values$(x0);
    const U16$eql = a0 => a1 => (a0 === a1);
    const String$eql = a0 => a1 => (a0 === a1);

    function Web$Kaelin$Draw$state$player$(_img$1, _player$2) {
        var self = _player$2;
        switch (self._) {
            case 'Web.Kaelin.Player.new':
                var $653 = self.coord;
                var $654 = self.hero;
                var self = Web$Kaelin$Coord$to_screen_xy$($653);
                switch (self._) {
                    case 'Pair.new':
                        var $656 = self.fst;
                        var $657 = self.snd;
                        var self = ($654 === "croni");
                        if (self) {
                            var $659 = Web$Kaelin$Entity$char$(Kaelin$Assets$chars$croni0_d_1);
                            var _ent$7 = $659;
                        } else {
                            var $660 = Web$Kaelin$Entity$char$(Kaelin$Assets$chars$cyclope_d_1);
                            var _ent$7 = $660;
                        };
                        var self = _ent$7;
                        switch (self._) {
                            case 'Web.Kaelin.Entity.background':
                                var $661 = self.img;
                                var $662 = VoxBox$Draw$image$($656, $657, 0, $661, _img$1);
                                var $658 = $662;
                                break;
                            case 'Web.Kaelin.Entity.char':
                                var $663 = self.img;
                                var $664 = VoxBox$Draw$image$($656, $657, 0, $663, _img$1);
                                var $658 = $664;
                                break;
                        };
                        var $655 = $658;
                        break;
                };
                var $652 = $655;
                break;
        };
        return $652;
    };
    const Web$Kaelin$Draw$state$player = x0 => x1 => Web$Kaelin$Draw$state$player$(x0, x1);

    function Web$Kaelin$Draw$state$players$(_img$1, _players$2) {
        var _players_list$3 = Map$values$(_players$2);
        var _img$4 = (() => {
            var $667 = _img$1;
            var $668 = _players_list$3;
            let _img$5 = $667;
            let _player$4;
            while ($668._ === 'List.cons') {
                _player$4 = $668.head;
                var $667 = Web$Kaelin$Draw$state$player$(_img$5, _player$4);
                _img$5 = $667;
                $668 = $668.tail;
            }
            return _img$5;
        })();
        var $665 = _img$4;
        return $665;
    };
    const Web$Kaelin$Draw$state$players = x0 => x1 => Web$Kaelin$Draw$state$players$(x0, x1);

    function Web$Kaelin$Draw$state$(_img$1, _state$2) {
        var self = _state$2;
        switch (self._) {
            case 'Web.Kaelin.State.game':
                var $670 = self.players;
                var _new_img$8 = Web$Kaelin$Draw$state$players$(_img$1, $670);
                var $671 = _new_img$8;
                var $669 = $671;
                break;
            case 'Web.Kaelin.State.init':
            case 'Web.Kaelin.State.void':
                var $672 = _img$1;
                var $669 = $672;
                break;
        };
        return $669;
    };
    const Web$Kaelin$Draw$state = x0 => x1 => Web$Kaelin$Draw$state$(x0, x1);

    function DOM$vbox$(_props$1, _style$2, _value$3) {
        var $673 = ({
            _: 'DOM.vbox',
            'props': _props$1,
            'style': _style$2,
            'value': _value$3
        });
        return $673;
    };
    const DOM$vbox = x0 => x1 => x2 => DOM$vbox$(x0, x1, x2);

    function IO$(_A$1) {
        var $674 = null;
        return $674;
    };
    const IO = x0 => IO$(x0);

    function IO$ask$(_query$2, _param$3, _then$4) {
        var $675 = ({
            _: 'IO.ask',
            'query': _query$2,
            'param': _param$3,
            'then': _then$4
        });
        return $675;
    };
    const IO$ask = x0 => x1 => x2 => IO$ask$(x0, x1, x2);

    function IO$bind$(_a$3, _f$4) {
        var self = _a$3;
        switch (self._) {
            case 'IO.end':
                var $677 = self.value;
                var $678 = _f$4($677);
                var $676 = $678;
                break;
            case 'IO.ask':
                var $679 = self.query;
                var $680 = self.param;
                var $681 = self.then;
                var $682 = IO$ask$($679, $680, (_x$8 => {
                    var $683 = IO$bind$($681(_x$8), _f$4);
                    return $683;
                }));
                var $676 = $682;
                break;
        };
        return $676;
    };
    const IO$bind = x0 => x1 => IO$bind$(x0, x1);

    function IO$end$(_value$2) {
        var $684 = ({
            _: 'IO.end',
            'value': _value$2
        });
        return $684;
    };
    const IO$end = x0 => IO$end$(x0);

    function IO$monad$(_new$2) {
        var $685 = _new$2(IO$bind)(IO$end);
        return $685;
    };
    const IO$monad = x0 => IO$monad$(x0);

    function Dynamic$new$(_value$2) {
        var $686 = ({
            _: 'Dynamic.new',
            'value': _value$2
        });
        return $686;
    };
    const Dynamic$new = x0 => Dynamic$new$(x0);
    const App$pass = IO$monad$((_m$bind$1 => _m$pure$2 => {
        var $687 = _m$pure$2;
        return $687;
    }))(Dynamic$new$(Unit$new));

    function IO$put_string$(_text$1) {
        var $688 = IO$ask$("put_string", _text$1, (_skip$2 => {
            var $689 = IO$end$(Unit$new);
            return $689;
        }));
        return $688;
    };
    const IO$put_string = x0 => IO$put_string$(x0);

    function IO$print$(_text$1) {
        var $690 = IO$put_string$((_text$1 + "\u{a}"));
        return $690;
    };
    const IO$print = x0 => IO$print$(x0);

    function App$print$(_str$1) {
        var $691 = IO$monad$((_m$bind$2 => _m$pure$3 => {
            var $692 = _m$bind$2;
            return $692;
        }))(IO$print$(_str$1))((_$2 => {
            var $693 = App$pass;
            return $693;
        }));
        return $691;
    };
    const App$print = x0 => App$print$(x0);

    function IO$do$(_call$1, _param$2) {
        var $694 = IO$ask$(_call$1, _param$2, (_answer$3 => {
            var $695 = IO$end$(Unit$new);
            return $695;
        }));
        return $694;
    };
    const IO$do = x0 => x1 => IO$do$(x0, x1);

    function App$do$(_call$1, _param$2) {
        var $696 = IO$monad$((_m$bind$3 => _m$pure$4 => {
            var $697 = _m$bind$3;
            return $697;
        }))(IO$do$(_call$1, _param$2))((_$3 => {
            var $698 = App$pass;
            return $698;
        }));
        return $696;
    };
    const App$do = x0 => x1 => App$do$(x0, x1);

    function App$watch$(_room$1) {
        var $699 = App$do$("watch", _room$1);
        return $699;
    };
    const App$watch = x0 => App$watch$(x0);

    function App$store$(_value$2) {
        var $700 = IO$monad$((_m$bind$3 => _m$pure$4 => {
            var $701 = _m$pure$4;
            return $701;
        }))(Dynamic$new$(_value$2));
        return $700;
    };
    const App$store = x0 => App$store$(x0);

    function Web$Kaelin$Action$update_interface$(_interface$1, _state$2) {
        var self = _state$2;
        switch (self._) {
            case 'Web.Kaelin.State.game':
                var $703 = self.room;
                var $704 = self.tick;
                var $705 = self.players;
                var $706 = self.map;
                var $707 = Web$Kaelin$State$game$($703, $704, $705, $706, _interface$1);
                var $702 = $707;
                break;
            case 'Web.Kaelin.State.init':
            case 'Web.Kaelin.State.void':
                var $708 = _state$2;
                var $702 = $708;
                break;
        };
        return $702;
    };
    const Web$Kaelin$Action$update_interface = x0 => x1 => Web$Kaelin$Action$update_interface$(x0, x1);

    function Pair$show$(_show_a$3, _show_b$4, _pair$5) {
        var self = _pair$5;
        switch (self._) {
            case 'Pair.new':
                var $710 = self.fst;
                var $711 = self.snd;
                var _str$8 = ("(" + _show_a$3($710));
                var _str$9 = (_str$8 + ",");
                var _str$10 = (_str$9 + _show_b$4($711));
                var _str$11 = (_str$10 + ")");
                var $712 = _str$11;
                var $709 = $712;
                break;
        };
        return $709;
    };
    const Pair$show = x0 => x1 => x2 => Pair$show$(x0, x1, x2);

    function Word$show$(_a$2) {
        var _n$3 = Word$to_nat$(_a$2);
        var $713 = (Nat$show$(_n$3) + ("#" + Nat$show$(_size$1)));
        return $713;
    };
    const Word$show = x0 => Word$show$(x0);

    function U32$show$(_a$1) {
        var self = _a$1;
        switch ('u32') {
            case 'u32':
                var $715 = u32_to_word(self);
                var $716 = Word$show$($715);
                var $714 = $716;
                break;
        };
        return $714;
    };
    const U32$show = x0 => U32$show$(x0);

    function App$post$(_room$1, _data$2) {
        var $717 = App$do$("post", (_room$1 + (";" + _data$2)));
        return $717;
    };
    const App$post = x0 => x1 => App$post$(x0, x1);

    function Web$Kaelin$Command$create_hero$(_hero_name$1) {
        var self = (_hero_name$1 === "croni");
        if (self) {
            var $719 = "0x1000000000000000000000000000000000000000000000000000000000000001";
            var $718 = $719;
        } else {
            var $720 = "0x0000000000000000000000000000000000000000000000000000000000000000";
            var $718 = $720;
        };
        return $718;
    };
    const Web$Kaelin$Command$create_hero = x0 => Web$Kaelin$Command$create_hero$(x0);
    const Debug$log = a0 => a1 => ((console.log(a0), a1()));

    function Char$eql$(_a$1, _b$2) {
        var $721 = (_a$1 === _b$2);
        return $721;
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
                    var $722 = Bool$true;
                    return $722;
                } else {
                    var $723 = self.charCodeAt(0);
                    var $724 = self.slice(1);
                    var self = _xs$1;
                    if (self.length === 0) {
                        var $726 = Bool$false;
                        var $725 = $726;
                    } else {
                        var $727 = self.charCodeAt(0);
                        var $728 = self.slice(1);
                        var self = Char$eql$($723, $727);
                        if (self) {
                            var $730 = String$starts_with$($728, $724);
                            var $729 = $730;
                        } else {
                            var $731 = Bool$false;
                            var $729 = $731;
                        };
                        var $725 = $729;
                    };
                    return $725;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const String$starts_with = x0 => x1 => String$starts_with$(x0, x1);

    function Web$Kaelin$Player$new$(_coord$1, _hero$2) {
        var $732 = ({
            _: 'Web.Kaelin.Player.new',
            'coord': _coord$1,
            'hero': _hero$2
        });
        return $732;
    };
    const Web$Kaelin$Player$new = x0 => x1 => Web$Kaelin$Player$new$(x0, x1);

    function Web$Kaelin$Action$create_player$(_user$1, _hero_name$2, _state$3) {
        var _key$4 = _user$1;
        var _init_pos$5 = Web$Kaelin$Coord$new$(Int$new(0n)(0n), Int$new(1n)(0n));
        var self = _state$3;
        switch (self._) {
            case 'Web.Kaelin.State.game':
                var $734 = self.room;
                var $735 = self.tick;
                var $736 = self.players;
                var $737 = self.map;
                var $738 = self.interface;
                var self = Map$get$(_key$4, $736);
                switch (self._) {
                    case 'Maybe.none':
                        var _new_player$11 = Web$Kaelin$Player$new$(_init_pos$5, _hero_name$2);
                        var _new_players$12 = Map$set$(_key$4, _new_player$11, $736);
                        var $740 = Web$Kaelin$State$game$($734, $735, _new_players$12, $737, $738);
                        var $739 = $740;
                        break;
                    case 'Maybe.some':
                        var $741 = _state$3;
                        var $739 = $741;
                        break;
                };
                var $733 = $739;
                break;
            case 'Web.Kaelin.State.init':
            case 'Web.Kaelin.State.void':
                var $742 = _state$3;
                var $733 = $742;
                break;
        };
        return $733;
    };
    const Web$Kaelin$Action$create_player = x0 => x1 => x2 => Web$Kaelin$Action$create_player$(x0, x1, x2);

    function App$new$(_init$2, _draw$3, _when$4) {
        var $743 = ({
            _: 'App.new',
            'init': _init$2,
            'draw': _draw$3,
            'when': _when$4
        });
        return $743;
    };
    const App$new = x0 => x1 => x2 => App$new$(x0, x1, x2);
    const Web$Kaelin = (() => {
        var _img$1 = VoxBox$alloc_capacity$(65536);
        var _map$2 = Map$from_list$(List$nil);
        var _map$3 = Web$Kaelin$Draw$initial_ent$(_map$2);
        var _init$2 = Web$Kaelin$State$game$(Web$Kaelin$Resources$room, 0n, Map$from_list$(List$nil), _map$3, App$EnvInfo$new$(Pair$new$(0, 0), Pair$new$(0, 0)));
        var _draw$3 = (_state$3 => {
            var self = _state$3;
            switch (self._) {
                case 'Web.Kaelin.State.game':
                    var $746 = self.map;
                    var _img$9 = Web$Kaelin$Draw$map$(_img$1, $746);
                    var _img$10 = Web$Kaelin$Draw$state$(_img$9, _state$3);
                    var $747 = DOM$vbox$(Map$from_list$(List$nil), Map$from_list$(List$nil), _img$10);
                    var $745 = $747;
                    break;
                case 'Web.Kaelin.State.init':
                case 'Web.Kaelin.State.void':
                    var $748 = DOM$text$("TODO: create the renderer for this game state mode");
                    var $745 = $748;
                    break;
            };
            return $745;
        });
        var _when$4 = (_event$4 => _state$5 => {
            var self = _event$4;
            switch (self._) {
                case 'App.Event.tick':
                    var $750 = self.info;
                    var self = _state$5;
                    switch (self._) {
                        case 'Web.Kaelin.State.init':
                        case 'Web.Kaelin.State.void':
                            var $752 = App$pass;
                            var $751 = $752;
                            break;
                        case 'Web.Kaelin.State.game':
                            var _info$13 = $750;
                            var $753 = App$store$(Web$Kaelin$Action$update_interface$(_info$13, _state$5));
                            var $751 = $753;
                            break;
                    };
                    var $749 = $751;
                    break;
                case 'App.Event.key_down':
                    var $754 = self.code;
                    var self = _state$5;
                    switch (self._) {
                        case 'Web.Kaelin.State.game':
                            var $756 = self.room;
                            var self = ($754 === 48);
                            if (self) {
                                var $758 = App$post$($756, Web$Kaelin$Command$create_hero$("croni"));
                                var $757 = $758;
                            } else {
                                var $759 = App$pass;
                                var $757 = $759;
                            };
                            var $755 = $757;
                            break;
                        case 'Web.Kaelin.State.init':
                        case 'Web.Kaelin.State.void':
                            var $760 = App$pass;
                            var $755 = $760;
                            break;
                    };
                    var $749 = $755;
                    break;
                case 'App.Event.post':
                    var $761 = self.addr;
                    var $762 = self.data;
                    var self = _state$5;
                    switch (self._) {
                        case 'Web.Kaelin.State.init':
                        case 'Web.Kaelin.State.void':
                            var $764 = App$pass;
                            var $763 = $764;
                            break;
                        case 'Web.Kaelin.State.game':
                            var $765 = ((console.log(($762 + String$nil)), (_x$15 => {
                                var self = String$starts_with$($762, "0x1");
                                if (self) {
                                    var $767 = App$store$(Web$Kaelin$Action$create_player$($761, "croni", _state$5));
                                    var $766 = $767;
                                } else {
                                    var $768 = App$pass;
                                    var $766 = $768;
                                };
                                return $766;
                            })()));
                            var $763 = $765;
                            break;
                    };
                    var $749 = $763;
                    break;
                case 'App.Event.init':
                    var self = _state$5;
                    switch (self._) {
                        case 'Web.Kaelin.State.init':
                        case 'Web.Kaelin.State.void':
                            var $770 = App$pass;
                            var $769 = $770;
                            break;
                        case 'Web.Kaelin.State.game':
                            var $771 = IO$monad$((_m$bind$14 => _m$pure$15 => {
                                var $772 = _m$bind$14;
                                return $772;
                            }))(App$print$("Kaelin started!!!"))((_$14 => {
                                var $773 = App$watch$(Web$Kaelin$Resources$room);
                                return $773;
                            }));
                            var $769 = $771;
                            break;
                    };
                    var $749 = $769;
                    break;
                case 'App.Event.dom':
                    var self = _state$5;
                    switch (self._) {
                        case 'Web.Kaelin.State.init':
                        case 'Web.Kaelin.State.void':
                        case 'Web.Kaelin.State.game':
                            var $775 = App$pass;
                            var $774 = $775;
                            break;
                    };
                    var $749 = $774;
                    break;
                case 'App.Event.mouse_down':
                case 'App.Event.key_up':
                    var self = _state$5;
                    switch (self._) {
                        case 'Web.Kaelin.State.init':
                        case 'Web.Kaelin.State.void':
                        case 'Web.Kaelin.State.game':
                            var $777 = App$pass;
                            var $776 = $777;
                            break;
                    };
                    var $749 = $776;
                    break;
                case 'App.Event.mouse_up':
                    var self = _state$5;
                    switch (self._) {
                        case 'Web.Kaelin.State.game':
                            var $779 = self.interface;
                            var _info$13 = $779;
                            var self = _info$13;
                            switch (self._) {
                                case 'App.EnvInfo.new':
                                    var $781 = self.mouse_pos;
                                    var _pos$16 = $781;
                                    var self = _pos$16;
                                    switch (self._) {
                                        case 'Pair.new':
                                            var $783 = self.fst;
                                            var $784 = self.snd;
                                            var self = Pair$new$((($783 / 2) >>> 0), (($784 / 2) >>> 0));
                                            switch (self._) {
                                                case 'Pair.new':
                                                    var $786 = self.fst;
                                                    var $787 = self.snd;
                                                    var $788 = App$print$(Pair$show$(U32$show, U32$show, Pair$new$($786, $787)));
                                                    var $785 = $788;
                                                    break;
                                            };
                                            var $782 = $785;
                                            break;
                                    };
                                    var $780 = $782;
                                    break;
                            };
                            var $778 = $780;
                            break;
                        case 'Web.Kaelin.State.init':
                        case 'Web.Kaelin.State.void':
                            var $789 = App$pass;
                            var $778 = $789;
                            break;
                    };
                    var $749 = $778;
                    break;
            };
            return $749;
        });
        var $744 = App$new$(_init$2, _draw$3, _when$4);
        return $744;
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
        'List': List,
        'List.nil': List$nil,
        'Pair': Pair,
        'Web.Kaelin.Entity.char': Web$Kaelin$Entity$char,
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
        'Kaelin.Assets.chars.croni0_d_1': Kaelin$Assets$chars$croni0_d_1,
        'Kaelin.Assets.chars.cyclope_d_1': Kaelin$Assets$chars$cyclope_d_1,
        'Kaelin.Assets.chars.lela_d_1': Kaelin$Assets$chars$lela_d_1,
        'Kaelin.Assets.chars.octoking_d_1': Kaelin$Assets$chars$octoking_d_1,
        'Web.Kaelin.Entity.background': Web$Kaelin$Entity$background,
        'Kaelin.Assets.dark_grass_4': Kaelin$Assets$dark_grass_4,
        'Web.Kaelin.Coord.new': Web$Kaelin$Coord$new,
        'String.cons': String$cons,
        'String.concat': String$concat,
        'Nat.gtn': Nat$gtn,
        'Int.is_neg': Int$is_neg,
        'Int.new': Int$new,
        'Int.neg': Int$neg,
        'Int.abs': Int$abs,
        'Int.to_nat': Int$to_nat,
        'List.fold': List$fold,
        'Either': Either,
        'Either.left': Either$left,
        'Either.right': Either$right,
        'Nat.sub_rem': Nat$sub_rem,
        'Nat.div_mod.go': Nat$div_mod$go,
        'Nat.div_mod': Nat$div_mod,
        'List.cons': List$cons,
        'Nat.to_base.go': Nat$to_base$go,
        'Nat.to_base': Nat$to_base,
        'String.nil': String$nil,
        'Nat.mod.go': Nat$mod$go,
        'Nat.mod': Nat$mod,
        'Bool.and': Bool$and,
        'Nat.lte': Nat$lte,
        'Maybe': Maybe,
        'List.at': List$at,
        'Nat.show_digit': Nat$show_digit,
        'Nat.to_string_base': Nat$to_string_base,
        'Nat.show': Nat$show,
        'Int.show': Int$show,
        'Web.Kaelin.Coord.show': Web$Kaelin$Coord$show,
        'Map.set': Map$set,
        'Maybe.default': Maybe$default,
        'BitsMap.get': BitsMap$get,
        'Map.get': Map$get,
        'Web.Kaelin.Map.push': Web$Kaelin$Map$push,
        'Web.Kaelin.Draw.initial_ent': Web$Kaelin$Draw$initial_ent,
        'Web.Kaelin.State.game': Web$Kaelin$State$game,
        'Web.Kaelin.Resources.room': Web$Kaelin$Resources$room,
        'App.EnvInfo.new': App$EnvInfo$new,
        'DOM.text': DOM$text,
        'VoxBox.clear': VoxBox$clear,
        'Web.Kaelin.Resources.map_size': Web$Kaelin$Resources$map_size,
        'Web.Kaelin.Resources.hexagon_radius': Web$Kaelin$Resources$hexagon_radius,
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
        'U32.sub': U32$sub,
        'Web.Kaelin.Coord.fit': Web$Kaelin$Coord$fit,
        'Web.Kaelin.Draw.background': Web$Kaelin$Draw$background,
        'Int.from_u32': Int$from_u32,
        'Pair.fst': Pair$fst,
        'Nat.div': Nat$div,
        'Int.div_nat': Int$div_nat,
        'Web.Kaelin.Resources.center_x': Web$Kaelin$Resources$center_x,
        'Web.Kaelin.Resources.center_y': Web$Kaelin$Resources$center_y,
        'Int.mul': Int$mul,
        'Int.from_nat': Int$from_nat,
        'Int.to_u32': Int$to_u32,
        'Web.Kaelin.Coord.to_screen_xy': Web$Kaelin$Coord$to_screen_xy,
        'VoxBox.Draw.deresagon': VoxBox$Draw$deresagon,
        'Web.Kaelin.Draw.hexagon_border': Web$Kaelin$Draw$hexagon_border,
        'List.for': List$for,
        'List.imap': List$imap,
        'List.indices.u32': List$indices$u32,
        'String.to_list': String$to_list,
        'Bits.to_nat': Bits$to_nat,
        'U16.show_hex': U16$show_hex,
        'PixelFont.get_img': PixelFont$get_img,
        'Word.and': Word$and,
        'U32.and': U32$and,
        'Pos32.get_x': Pos32$get_x,
        'U32.shr': U32$shr,
        'Pos32.get_y': Pos32$get_y,
        'Pos32.get_z': Pos32$get_z,
        'VoxBox.get_len': VoxBox$get_len,
        'Array.get': Array$get,
        'Buffer32.get': Buffer32$get,
        'VoxBox.get_pos': VoxBox$get_pos,
        'VoxBox.get_col': VoxBox$get_col,
        'VoxBox.Draw.image': VoxBox$Draw$image,
        'VoxBox.Draw.text.char': VoxBox$Draw$text$char,
        'Pos32.add': Pos32$add,
        'VoxBox.Draw.text': VoxBox$Draw$text,
        'Map.new': Map$new,
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
        'Web.Kaelin.Draw.tile.empty': Web$Kaelin$Draw$tile$empty,
        'Web.Kaelin.Map.get': Web$Kaelin$Map$get,
        'Web.Kaelin.Draw.tile': Web$Kaelin$Draw$tile,
        'Web.Kaelin.Draw.map': Web$Kaelin$Draw$map,
        'BitsMap.values.go': BitsMap$values$go,
        'Map.values': Map$values,
        'U16.eql': U16$eql,
        'String.eql': String$eql,
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
        'Pair.show': Pair$show,
        'Word.show': Word$show,
        'U32.show': U32$show,
        'App.post': App$post,
        'Web.Kaelin.Command.create_hero': Web$Kaelin$Command$create_hero,
        'Debug.log': Debug$log,
        'Char.eql': Char$eql,
        'String.starts_with': String$starts_with,
        'Web.Kaelin.Player.new': Web$Kaelin$Player$new,
        'Web.Kaelin.Action.create_player': Web$Kaelin$Action$create_player,
        'App.new': App$new,
        'Web.Kaelin': Web$Kaelin,
    };
})();

/***/ })

}]);
//# sourceMappingURL=927.index.js.map