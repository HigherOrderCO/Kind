(self["webpackChunkkind_web"] = self["webpackChunkkind_web"] || []).push([[523],{

/***/ 523:
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
    const BitsMap$new = ({
        _: 'BitsMap.new'
    });

    function Pair$(_A$1, _B$2) {
        var $133 = null;
        return $133;
    };
    const Pair = x0 => x1 => Pair$(x0, x1);

    function VoxBox$set_length$(_length$1, _img$2) {
        var self = _img$2;
        switch (self._) {
            case 'VoxBox.new':
                var $135 = self.capacity;
                var $136 = self.buffer;
                var $137 = VoxBox$new$(_length$1, $135, $136);
                var $134 = $137;
                break;
        };
        return $134;
    };
    const VoxBox$set_length = x0 => x1 => VoxBox$set_length$(x0, x1);

    function VoxBox$clear$(_img$1) {
        var $138 = VoxBox$set_length$(0, _img$1);
        return $138;
    };
    const VoxBox$clear = x0 => VoxBox$clear$(x0);
    const List$for = a0 => a1 => a2 => (list_for(a0)(a1)(a2));

    function List$(_A$1) {
        var $139 = null;
        return $139;
    };
    const List = x0 => List$(x0);

    function List$cons$(_head$2, _tail$3) {
        var $140 = ({
            _: 'List.cons',
            'head': _head$2,
            'tail': _tail$3
        });
        return $140;
    };
    const List$cons = x0 => x1 => List$cons$(x0, x1);

    function BitsMap$values$go$(_xs$2, _list$3) {
        var self = _xs$2;
        switch (self._) {
            case 'BitsMap.tie':
                var $142 = self.val;
                var $143 = self.lft;
                var $144 = self.rgt;
                var self = $142;
                switch (self._) {
                    case 'Maybe.some':
                        var $146 = self.value;
                        var $147 = List$cons$($146, _list$3);
                        var _list0$7 = $147;
                        break;
                    case 'Maybe.none':
                        var $148 = _list$3;
                        var _list0$7 = $148;
                        break;
                };
                var _list1$8 = BitsMap$values$go$($143, _list0$7);
                var _list2$9 = BitsMap$values$go$($144, _list1$8);
                var $145 = _list2$9;
                var $141 = $145;
                break;
            case 'BitsMap.new':
                var $149 = _list$3;
                var $141 = $149;
                break;
        };
        return $141;
    };
    const BitsMap$values$go = x0 => x1 => BitsMap$values$go$(x0, x1);
    const List$nil = ({
        _: 'List.nil'
    });

    function BitsMap$values$(_xs$2) {
        var $150 = BitsMap$values$go$(_xs$2, List$nil);
        return $150;
    };
    const BitsMap$values = x0 => BitsMap$values$(x0);

    function VoxBox$get_len$(_img$1) {
        var self = _img$1;
        switch (self._) {
            case 'VoxBox.new':
                var $152 = self.length;
                var $153 = $152;
                var $151 = $153;
                break;
        };
        return $151;
    };
    const VoxBox$get_len = x0 => VoxBox$get_len$(x0);

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
    const U32$eql = a0 => a1 => (a0 === a1);

    function U32$inc$(_a$1) {
        var self = _a$1;
        switch ('u32') {
            case 'u32':
                var $185 = u32_to_word(self);
                var $186 = U32$new$(Word$inc$($185));
                var $184 = $186;
                break;
        };
        return $184;
    };
    const U32$inc = x0 => U32$inc$(x0);
    const U32$for = a0 => a1 => a2 => a3 => (u32_for(a0, a1, a2, a3));

    function Word$trim$(_new_size$2, _word$3) {
        var self = _new_size$2;
        if (self === 0n) {
            var $188 = Word$e;
            var $187 = $188;
        } else {
            var $189 = (self - 1n);
            var self = _word$3;
            switch (self._) {
                case 'Word.o':
                    var $191 = self.pred;
                    var $192 = Word$o$(Word$trim$($189, $191));
                    var $190 = $192;
                    break;
                case 'Word.i':
                    var $193 = self.pred;
                    var $194 = Word$i$(Word$trim$($189, $193));
                    var $190 = $194;
                    break;
                case 'Word.e':
                    var $195 = Word$o$(Word$trim$($189, Word$e));
                    var $190 = $195;
                    break;
            };
            var $187 = $190;
        };
        return $187;
    };
    const Word$trim = x0 => x1 => Word$trim$(x0, x1);
    const Unit$new = null;

    function Array$extract_tip$(_arr$2) {
        var self = _arr$2;
        switch (self._) {
            case 'Array.tip':
                var $197 = self.value;
                var $198 = $197;
                var $196 = $198;
                break;
            case 'Array.tie':
                var $199 = Unit$new;
                var $196 = $199;
                break;
        };
        return $196;
    };
    const Array$extract_tip = x0 => Array$extract_tip$(x0);

    function Pair$new$(_fst$3, _snd$4) {
        var $200 = ({
            _: 'Pair.new',
            'fst': _fst$3,
            'snd': _snd$4
        });
        return $200;
    };
    const Pair$new = x0 => x1 => Pair$new$(x0, x1);

    function Array$extract_tie$(_arr$3) {
        var self = _arr$3;
        switch (self._) {
            case 'Array.tie':
                var $202 = self.lft;
                var $203 = self.rgt;
                var $204 = Pair$new$($202, $203);
                var $201 = $204;
                break;
            case 'Array.tip':
                var $205 = Unit$new;
                var $201 = $205;
                break;
        };
        return $201;
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
                        var $206 = self.pred;
                        var $207 = Word$foldl$(_w0$4(_nil$3), _w0$4, _w1$5, $206);
                        return $207;
                    case 'Word.i':
                        var $208 = self.pred;
                        var $209 = Word$foldl$(_w1$5(_nil$3), _w0$4, _w1$5, $208);
                        return $209;
                    case 'Word.e':
                        var $210 = _nil$3;
                        return $210;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Word$foldl = x0 => x1 => x2 => x3 => Word$foldl$(x0, x1, x2, x3);

    function Array$get$(_idx$3, _arr$4) {
        var $211 = Word$foldl$(Array$extract_tip, (_rec$6 => _arr$7 => {
            var _arr_l$8 = Array$extract_tie$(_arr$7);
            var self = _arr_l$8;
            switch (self._) {
                case 'Pair.new':
                    var $213 = self.fst;
                    var $214 = _rec$6($213);
                    var $212 = $214;
                    break;
            };
            return $212;
        }), (_rec$6 => _arr$7 => {
            var _arr_r$8 = Array$extract_tie$(_arr$7);
            var self = _arr_r$8;
            switch (self._) {
                case 'Pair.new':
                    var $216 = self.snd;
                    var $217 = _rec$6($216);
                    var $215 = $217;
                    break;
            };
            return $215;
        }), _idx$3)(_arr$4);
        return $211;
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
                var $219 = self.pred;
                var $220 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $222 = self.pred;
                            var $223 = (_a$pred$9 => {
                                var $224 = Word$o$(Word$and$(_a$pred$9, $222));
                                return $224;
                            });
                            var $221 = $223;
                            break;
                        case 'Word.i':
                            var $225 = self.pred;
                            var $226 = (_a$pred$9 => {
                                var $227 = Word$o$(Word$and$(_a$pred$9, $225));
                                return $227;
                            });
                            var $221 = $226;
                            break;
                        case 'Word.e':
                            var $228 = (_a$pred$7 => {
                                var $229 = Word$e;
                                return $229;
                            });
                            var $221 = $228;
                            break;
                    };
                    var $221 = $221($219);
                    return $221;
                });
                var $218 = $220;
                break;
            case 'Word.i':
                var $230 = self.pred;
                var $231 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $233 = self.pred;
                            var $234 = (_a$pred$9 => {
                                var $235 = Word$o$(Word$and$(_a$pred$9, $233));
                                return $235;
                            });
                            var $232 = $234;
                            break;
                        case 'Word.i':
                            var $236 = self.pred;
                            var $237 = (_a$pred$9 => {
                                var $238 = Word$i$(Word$and$(_a$pred$9, $236));
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
                var $218 = $231;
                break;
            case 'Word.e':
                var $241 = (_b$4 => {
                    var $242 = Word$e;
                    return $242;
                });
                var $218 = $241;
                break;
        };
        var $218 = $218(_b$3);
        return $218;
    };
    const Word$and = x0 => x1 => Word$and$(x0, x1);
    const U32$and = a0 => a1 => (a0 & a1);
    const U32$shr = a0 => a1 => (a0 >>> a1);

    function Word$or$(_a$2, _b$3) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $244 = self.pred;
                var $245 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $247 = self.pred;
                            var $248 = (_a$pred$9 => {
                                var $249 = Word$o$(Word$or$(_a$pred$9, $247));
                                return $249;
                            });
                            var $246 = $248;
                            break;
                        case 'Word.i':
                            var $250 = self.pred;
                            var $251 = (_a$pred$9 => {
                                var $252 = Word$i$(Word$or$(_a$pred$9, $250));
                                return $252;
                            });
                            var $246 = $251;
                            break;
                        case 'Word.e':
                            var $253 = (_a$pred$7 => {
                                var $254 = Word$e;
                                return $254;
                            });
                            var $246 = $253;
                            break;
                    };
                    var $246 = $246($244);
                    return $246;
                });
                var $243 = $245;
                break;
            case 'Word.i':
                var $255 = self.pred;
                var $256 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $258 = self.pred;
                            var $259 = (_a$pred$9 => {
                                var $260 = Word$i$(Word$or$(_a$pred$9, $258));
                                return $260;
                            });
                            var $257 = $259;
                            break;
                        case 'Word.i':
                            var $261 = self.pred;
                            var $262 = (_a$pred$9 => {
                                var $263 = Word$i$(Word$or$(_a$pred$9, $261));
                                return $263;
                            });
                            var $257 = $262;
                            break;
                        case 'Word.e':
                            var $264 = (_a$pred$7 => {
                                var $265 = Word$e;
                                return $265;
                            });
                            var $257 = $264;
                            break;
                    };
                    var $257 = $257($255);
                    return $257;
                });
                var $243 = $256;
                break;
            case 'Word.e':
                var $266 = (_b$4 => {
                    var $267 = Word$e;
                    return $267;
                });
                var $243 = $266;
                break;
        };
        var $243 = $243(_b$3);
        return $243;
    };
    const Word$or = x0 => x1 => Word$or$(x0, x1);
    const U32$or = a0 => a1 => (a0 | a1);
    const U32$shl = a0 => a1 => ((a0 << a1) >>> 0);
    const Pos32$new = a0 => a1 => a2 => ((0 | a0 | (a1 << 12) | (a2 << 24)));

    function Array$mut$(_idx$3, _f$4, _arr$5) {
        var $268 = Word$foldl$((_arr$6 => {
            var $269 = Array$tip$(_f$4(Array$extract_tip$(_arr$6)));
            return $269;
        }), (_rec$7 => _arr$8 => {
            var self = Array$extract_tie$(_arr$8);
            switch (self._) {
                case 'Pair.new':
                    var $271 = self.fst;
                    var $272 = self.snd;
                    var $273 = Array$tie$(_rec$7($271), $272);
                    var $270 = $273;
                    break;
            };
            return $270;
        }), (_rec$7 => _arr$8 => {
            var self = Array$extract_tie$(_arr$8);
            switch (self._) {
                case 'Pair.new':
                    var $275 = self.fst;
                    var $276 = self.snd;
                    var $277 = Array$tie$($275, _rec$7($276));
                    var $274 = $277;
                    break;
            };
            return $274;
        }), _idx$3)(_arr$5);
        return $268;
    };
    const Array$mut = x0 => x1 => x2 => Array$mut$(x0, x1, x2);

    function Array$set$(_idx$3, _val$4, _arr$5) {
        var $278 = Array$mut$(_idx$3, (_x$6 => {
            var $279 = _val$4;
            return $279;
        }), _arr$5);
        return $278;
    };
    const Array$set = x0 => x1 => x2 => Array$set$(x0, x1, x2);
    const Buffer32$set = a0 => a1 => a2 => ((a2[a0] = a1, a2));
    const VoxBox$set_pos = a0 => a1 => a2 => ((a2.buffer[a0 * 2] = a1, a2));
    const VoxBox$set_col = a0 => a1 => a2 => ((a2.buffer[a0 * 2 + 1] = a1, a2));
    const VoxBox$push = a0 => a1 => a2 => ((a2.buffer[a2.length * 2] = a0, a2.buffer[a2.length * 2 + 1] = a1, a2.length++, a2));

    function VoxBox$Draw$image$(_x$1, _y$2, _z$3, _src$4, _img$5) {
        var _len$6 = VoxBox$get_len$(_src$4);
        var _img$7 = (() => {
            var $281 = _img$5;
            var $282 = 0;
            var $283 = _len$6;
            let _img$8 = $281;
            for (let _i$7 = $282; _i$7 < $283; ++_i$7) {
                var _pos$9 = ((_src$4.buffer[_i$7 * 2]));
                var _col$10 = ((_src$4.buffer[_i$7 * 2 + 1]));
                var _p_x$11 = (_pos$9 & 4095);
                var _p_y$12 = ((_pos$9 & 16773120) >>> 12);
                var _p_z$13 = ((_pos$9 & 4278190080) >>> 24);
                var _p_x$14 = ((_p_x$11 + _x$1) >>> 0);
                var _p_y$15 = ((_p_y$12 + _y$2) >>> 0);
                var _p_z$16 = ((_p_z$13 + _z$3) >>> 0);
                var _pos$17 = ((0 | _p_x$14 | (_p_y$15 << 12) | (_p_z$16 << 24)));
                var $281 = ((_img$8.buffer[_img$8.length * 2] = _pos$17, _img$8.buffer[_img$8.length * 2 + 1] = _col$10, _img$8.length++, _img$8));
                _img$8 = $281;
            };
            return _img$8;
        })();
        var $280 = _img$7;
        return $280;
    };
    const VoxBox$Draw$image = x0 => x1 => x2 => x3 => x4 => VoxBox$Draw$image$(x0, x1, x2, x3, x4);
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
                    var $284 = _value$3;
                    return $284;
                } else {
                    var $285 = (self - 1n);
                    var $286 = Word$shift_left$($285, Word$shift_left1$(_value$3));
                    return $286;
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
                var $288 = Bool$false;
                var $287 = $288;
                break;
            case 'Cmp.eql':
            case 'Cmp.gtn':
                var $289 = Bool$true;
                var $287 = $289;
                break;
        };
        return $287;
    };
    const Cmp$as_gte = x0 => Cmp$as_gte$(x0);

    function Word$gte$(_a$2, _b$3) {
        var $290 = Cmp$as_gte$(Word$cmp$(_a$2, _b$3));
        return $290;
    };
    const Word$gte = x0 => x1 => Word$gte$(x0, x1);

    function Word$shift_right1$aux$(_word$2) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $292 = self.pred;
                var $293 = Word$o$(Word$shift_right1$aux$($292));
                var $291 = $293;
                break;
            case 'Word.i':
                var $294 = self.pred;
                var $295 = Word$i$(Word$shift_right1$aux$($294));
                var $291 = $295;
                break;
            case 'Word.e':
                var $296 = Word$o$(Word$e);
                var $291 = $296;
                break;
        };
        return $291;
    };
    const Word$shift_right1$aux = x0 => Word$shift_right1$aux$(x0);

    function Word$shift_right1$(_word$2) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $298 = self.pred;
                var $299 = Word$shift_right1$aux$($298);
                var $297 = $299;
                break;
            case 'Word.i':
                var $300 = self.pred;
                var $301 = Word$shift_right1$aux$($300);
                var $297 = $301;
                break;
            case 'Word.e':
                var $302 = Word$e;
                var $297 = $302;
                break;
        };
        return $297;
    };
    const Word$shift_right1 = x0 => Word$shift_right1$(x0);

    function Word$subber$(_a$2, _b$3, _c$4) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $304 = self.pred;
                var $305 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $307 = self.pred;
                            var $308 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $310 = Word$i$(Word$subber$(_a$pred$10, $307, Bool$true));
                                    var $309 = $310;
                                } else {
                                    var $311 = Word$o$(Word$subber$(_a$pred$10, $307, Bool$false));
                                    var $309 = $311;
                                };
                                return $309;
                            });
                            var $306 = $308;
                            break;
                        case 'Word.i':
                            var $312 = self.pred;
                            var $313 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $315 = Word$o$(Word$subber$(_a$pred$10, $312, Bool$true));
                                    var $314 = $315;
                                } else {
                                    var $316 = Word$i$(Word$subber$(_a$pred$10, $312, Bool$true));
                                    var $314 = $316;
                                };
                                return $314;
                            });
                            var $306 = $313;
                            break;
                        case 'Word.e':
                            var $317 = (_a$pred$8 => {
                                var $318 = Word$e;
                                return $318;
                            });
                            var $306 = $317;
                            break;
                    };
                    var $306 = $306($304);
                    return $306;
                });
                var $303 = $305;
                break;
            case 'Word.i':
                var $319 = self.pred;
                var $320 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $322 = self.pred;
                            var $323 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $325 = Word$o$(Word$subber$(_a$pred$10, $322, Bool$false));
                                    var $324 = $325;
                                } else {
                                    var $326 = Word$i$(Word$subber$(_a$pred$10, $322, Bool$false));
                                    var $324 = $326;
                                };
                                return $324;
                            });
                            var $321 = $323;
                            break;
                        case 'Word.i':
                            var $327 = self.pred;
                            var $328 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $330 = Word$i$(Word$subber$(_a$pred$10, $327, Bool$true));
                                    var $329 = $330;
                                } else {
                                    var $331 = Word$o$(Word$subber$(_a$pred$10, $327, Bool$false));
                                    var $329 = $331;
                                };
                                return $329;
                            });
                            var $321 = $328;
                            break;
                        case 'Word.e':
                            var $332 = (_a$pred$8 => {
                                var $333 = Word$e;
                                return $333;
                            });
                            var $321 = $332;
                            break;
                    };
                    var $321 = $321($319);
                    return $321;
                });
                var $303 = $320;
                break;
            case 'Word.e':
                var $334 = (_b$5 => {
                    var $335 = Word$e;
                    return $335;
                });
                var $303 = $334;
                break;
        };
        var $303 = $303(_b$3);
        return $303;
    };
    const Word$subber = x0 => x1 => x2 => Word$subber$(x0, x1, x2);

    function Word$sub$(_a$2, _b$3) {
        var $336 = Word$subber$(_a$2, _b$3, Bool$false);
        return $336;
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
                    var $337 = Pair$new$(Bool$true, Word$or$(_value$5, _mask$6));
                    var self = $337;
                } else {
                    var $338 = Pair$new$(Bool$false, _value$5);
                    var self = $338;
                };
                switch (self._) {
                    case 'Pair.new':
                        var $339 = self.fst;
                        var $340 = self.snd;
                        var self = _shift$2;
                        if (self === 0n) {
                            var $342 = $340;
                            var $341 = $342;
                        } else {
                            var $343 = (self - 1n);
                            var _new_shift_copy$9 = Word$shift_right1$(_shift_copy$4);
                            var self = $339;
                            if (self) {
                                var $345 = Word$div$go$($343, Word$sub$(_sub_copy$3, _shift_copy$4), _new_shift_copy$9, $340);
                                var $344 = $345;
                            } else {
                                var $346 = Word$div$go$($343, _sub_copy$3, _new_shift_copy$9, $340);
                                var $344 = $346;
                            };
                            var $341 = $344;
                        };
                        return $341;
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
            var $348 = Word$to_zero$(_a$2);
            var $347 = $348;
        } else {
            var _shift$6 = (_a_bits$4 - _b_bits$5 <= 0n ? 0n : _a_bits$4 - _b_bits$5);
            var _shift_copy$7 = Word$shift_left$(_shift$6, _b$3);
            var $349 = Word$div$go$(_shift$6, _a$2, _shift_copy$7, Word$to_zero$(_a$2));
            var $347 = $349;
        };
        return $347;
    };
    const Word$div = x0 => x1 => Word$div$(x0, x1);
    const U32$div = a0 => a1 => ((a0 / a1) >>> 0);
    const U32$length = a0 => (a0.length);

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
        var $350 = (parseInt(_chr$3, 16));
        return $350;
    };
    const VoxBox$parse_byte = x0 => x1 => VoxBox$parse_byte$(x0, x1);
    const Col32$new = a0 => a1 => a2 => a3 => ((0 | a0 | (a1 << 8) | (a2 << 16) | (a3 << 24)));

    function VoxBox$parse$(_voxdata$1) {
        var _siz$2 = (((_voxdata$1.length) / 12) >>> 0);
        var _img$3 = VoxBox$alloc_capacity$(_siz$2);
        var _img$4 = (() => {
            var $352 = _img$3;
            var $353 = 0;
            var $354 = _siz$2;
            let _img$5 = $352;
            for (let _i$4 = $353; _i$4 < $354; ++_i$4) {
                var _x$6 = VoxBox$parse_byte$(((((_i$4 * 6) >>> 0) + 0) >>> 0), _voxdata$1);
                var _y$7 = VoxBox$parse_byte$(((((_i$4 * 6) >>> 0) + 1) >>> 0), _voxdata$1);
                var _z$8 = VoxBox$parse_byte$(((((_i$4 * 6) >>> 0) + 2) >>> 0), _voxdata$1);
                var _r$9 = VoxBox$parse_byte$(((((_i$4 * 6) >>> 0) + 3) >>> 0), _voxdata$1);
                var _g$10 = VoxBox$parse_byte$(((((_i$4 * 6) >>> 0) + 4) >>> 0), _voxdata$1);
                var _b$11 = VoxBox$parse_byte$(((((_i$4 * 6) >>> 0) + 5) >>> 0), _voxdata$1);
                var _pos$12 = ((0 | _x$6 | (_y$7 << 12) | (_z$8 << 24)));
                var _col$13 = ((0 | _r$9 | (_g$10 << 8) | (_b$11 << 16) | (255 << 24)));
                var $352 = ((_img$5.buffer[_img$5.length * 2] = _pos$12, _img$5.buffer[_img$5.length * 2 + 1] = _col$13, _img$5.length++, _img$5));
                _img$5 = $352;
            };
            return _img$5;
        })();
        var $351 = _img$4;
        return $351;
    };
    const VoxBox$parse = x0 => VoxBox$parse$(x0);
    const Web$Online$hero$hex = "0d00000000000e00000000000f00000000001000000000001100000000000c01000000000d01000000001101000000000b02000000000c02000000001202000000000b03000000001203000000000b04000000000c04000000001104000000000c05000000000d05000000000e05000000001005000000001105000000000e06000000000f06000000000e07000000000e08000000000f08000000000d09000000000e09000000000f09000000000c0a000000000d0a000000000e0a000000000f0a00000000100a000000000c0b000000000e0b00000000100b000000000b0c000000000c0c000000000e0c00000000100c00000000110c000000000b0d000000000e0d00000000110d000000000a0e000000000b0e000000000e0e00000000110e00000000120e000000000a0f000000000e0f00000000120f000000000910000000000a10000000000e10000000001210000000001310000000000911000000000e11000000001311000000000e12000000000d13000000000e13000000000f13000000000d14000000000f14000000000d15000000000f15000000000c16000000000d16000000000f16000000000c17000000000f17000000000c18000000000f18000000000c19000000001019000000000c1a00000000101a000000000b1b000000000c1b00000000101b000000000b1c00000000101c000000000b1d00000000101d00000000111d000000000b1e00000000111e000000000a1f000000000b1f00000000111f00000000";
    const Web$Online$hero = VoxBox$parse$(Web$Online$hero$hex);

    function DOM$vbox$(_props$1, _style$2, _value$3) {
        var $355 = ({
            _: 'DOM.vbox',
            'props': _props$1,
            'style': _style$2,
            'value': _value$3
        });
        return $355;
    };
    const DOM$vbox = x0 => x1 => x2 => DOM$vbox$(x0, x1, x2);

    function BitsMap$(_A$1) {
        var $356 = null;
        return $356;
    };
    const BitsMap = x0 => BitsMap$(x0);

    function Map$(_V$1) {
        var $357 = null;
        return $357;
    };
    const Map = x0 => Map$(x0);

    function BitsMap$tie$(_val$2, _lft$3, _rgt$4) {
        var $358 = ({
            _: 'BitsMap.tie',
            'val': _val$2,
            'lft': _lft$3,
            'rgt': _rgt$4
        });
        return $358;
    };
    const BitsMap$tie = x0 => x1 => x2 => BitsMap$tie$(x0, x1, x2);

    function Maybe$some$(_value$2) {
        var $359 = ({
            _: 'Maybe.some',
            'value': _value$2
        });
        return $359;
    };
    const Maybe$some = x0 => Maybe$some$(x0);
    const Maybe$none = ({
        _: 'Maybe.none'
    });

    function BitsMap$set$(_bits$2, _val$3, _map$4) {
        var self = _bits$2;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'o':
                var $361 = self.slice(0, -1);
                var self = _map$4;
                switch (self._) {
                    case 'BitsMap.tie':
                        var $363 = self.val;
                        var $364 = self.lft;
                        var $365 = self.rgt;
                        var $366 = BitsMap$tie$($363, BitsMap$set$($361, _val$3, $364), $365);
                        var $362 = $366;
                        break;
                    case 'BitsMap.new':
                        var $367 = BitsMap$tie$(Maybe$none, BitsMap$set$($361, _val$3, BitsMap$new), BitsMap$new);
                        var $362 = $367;
                        break;
                };
                var $360 = $362;
                break;
            case 'i':
                var $368 = self.slice(0, -1);
                var self = _map$4;
                switch (self._) {
                    case 'BitsMap.tie':
                        var $370 = self.val;
                        var $371 = self.lft;
                        var $372 = self.rgt;
                        var $373 = BitsMap$tie$($370, $371, BitsMap$set$($368, _val$3, $372));
                        var $369 = $373;
                        break;
                    case 'BitsMap.new':
                        var $374 = BitsMap$tie$(Maybe$none, BitsMap$new, BitsMap$set$($368, _val$3, BitsMap$new));
                        var $369 = $374;
                        break;
                };
                var $360 = $369;
                break;
            case 'e':
                var self = _map$4;
                switch (self._) {
                    case 'BitsMap.tie':
                        var $376 = self.lft;
                        var $377 = self.rgt;
                        var $378 = BitsMap$tie$(Maybe$some$(_val$3), $376, $377);
                        var $375 = $378;
                        break;
                    case 'BitsMap.new':
                        var $379 = BitsMap$tie$(Maybe$some$(_val$3), BitsMap$new, BitsMap$new);
                        var $375 = $379;
                        break;
                };
                var $360 = $375;
                break;
        };
        return $360;
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
                var $381 = self.pred;
                var $382 = (Word$to_bits$($381) + '0');
                var $380 = $382;
                break;
            case 'Word.i':
                var $383 = self.pred;
                var $384 = (Word$to_bits$($383) + '1');
                var $380 = $384;
                break;
            case 'Word.e':
                var $385 = Bits$e;
                var $380 = $385;
                break;
        };
        return $380;
    };
    const Word$to_bits = x0 => Word$to_bits$(x0);
    const U16$to_bits = a0 => (u16_to_bits(a0));

    function String$to_bits$(_str$1) {
        var self = _str$1;
        if (self.length === 0) {
            var $387 = Bits$e;
            var $386 = $387;
        } else {
            var $388 = self.charCodeAt(0);
            var $389 = self.slice(1);
            var $390 = (String$to_bits$($389) + (u16_to_bits($388)));
            var $386 = $390;
        };
        return $386;
    };
    const String$to_bits = x0 => String$to_bits$(x0);

    function Map$from_list$(_xs$2) {
        var self = _xs$2;
        switch (self._) {
            case 'List.cons':
                var $392 = self.head;
                var $393 = self.tail;
                var self = $392;
                switch (self._) {
                    case 'Pair.new':
                        var $395 = self.fst;
                        var $396 = self.snd;
                        var $397 = BitsMap$set$(String$to_bits$($395), $396, Map$from_list$($393));
                        var $394 = $397;
                        break;
                };
                var $391 = $394;
                break;
            case 'List.nil':
                var $398 = BitsMap$new;
                var $391 = $398;
                break;
        };
        return $391;
    };
    const Map$from_list = x0 => Map$from_list$(x0);

    function IO$(_A$1) {
        var $399 = null;
        return $399;
    };
    const IO = x0 => IO$(x0);

    function IO$ask$(_query$2, _param$3, _then$4) {
        var $400 = ({
            _: 'IO.ask',
            'query': _query$2,
            'param': _param$3,
            'then': _then$4
        });
        return $400;
    };
    const IO$ask = x0 => x1 => x2 => IO$ask$(x0, x1, x2);

    function IO$bind$(_a$3, _f$4) {
        var self = _a$3;
        switch (self._) {
            case 'IO.end':
                var $402 = self.value;
                var $403 = _f$4($402);
                var $401 = $403;
                break;
            case 'IO.ask':
                var $404 = self.query;
                var $405 = self.param;
                var $406 = self.then;
                var $407 = IO$ask$($404, $405, (_x$8 => {
                    var $408 = IO$bind$($406(_x$8), _f$4);
                    return $408;
                }));
                var $401 = $407;
                break;
        };
        return $401;
    };
    const IO$bind = x0 => x1 => IO$bind$(x0, x1);

    function IO$end$(_value$2) {
        var $409 = ({
            _: 'IO.end',
            'value': _value$2
        });
        return $409;
    };
    const IO$end = x0 => IO$end$(x0);

    function IO$monad$(_new$2) {
        var $410 = _new$2(IO$bind)(IO$end);
        return $410;
    };
    const IO$monad = x0 => IO$monad$(x0);

    function IO$do$(_call$1, _param$2) {
        var $411 = IO$ask$(_call$1, _param$2, (_answer$3 => {
            var $412 = IO$end$(Unit$new);
            return $412;
        }));
        return $411;
    };
    const IO$do = x0 => x1 => IO$do$(x0, x1);

    function Dynamic$new$(_value$2) {
        var $413 = ({
            _: 'Dynamic.new',
            'value': _value$2
        });
        return $413;
    };
    const Dynamic$new = x0 => Dynamic$new$(x0);
    const App$pass = IO$monad$((_m$bind$1 => _m$pure$2 => {
        var $414 = _m$pure$2;
        return $414;
    }))(Dynamic$new$(Unit$new));

    function App$do$(_call$1, _param$2) {
        var $415 = IO$monad$((_m$bind$3 => _m$pure$4 => {
            var $416 = _m$bind$3;
            return $416;
        }))(IO$do$(_call$1, _param$2))((_$3 => {
            var $417 = App$pass;
            return $417;
        }));
        return $415;
    };
    const App$do = x0 => x1 => App$do$(x0, x1);

    function App$watch$(_room$1) {
        var $418 = App$do$("watch", _room$1);
        return $418;
    };
    const App$watch = x0 => App$watch$(x0);
    const Web$Online$room = "0x196581625482";
    const U16$eql = a0 => a1 => (a0 === a1);

    function String$cons$(_head$1, _tail$2) {
        var $419 = (String.fromCharCode(_head$1) + _tail$2);
        return $419;
    };
    const String$cons = x0 => x1 => String$cons$(x0, x1);
    const String$concat = a0 => a1 => (a0 + a1);

    function App$post$(_room$1, _data$2) {
        var $420 = App$do$("post", (_room$1 + (";" + _data$2)));
        return $420;
    };
    const App$post = x0 => x1 => App$post$(x0, x1);
    const Web$Online$command$A = "0x0000000000000000000000000000000000000000000000000000000000000000";
    const Web$Online$command$D = "0x0000000000000000000000000000000000000000000000000000000000000001";
    const Web$Online$command$W = "0x0000000000000000000000000000000000000000000000000000000000000003";
    const Web$Online$command$S = "0x0000000000000000000000000000000000000000000000000000000000000002";

    function App$store$(_value$2) {
        var $421 = IO$monad$((_m$bind$3 => _m$pure$4 => {
            var $422 = _m$pure$4;
            return $422;
        }))(Dynamic$new$(_value$2));
        return $421;
    };
    const App$store = x0 => App$store$(x0);

    function Maybe$(_A$1) {
        var $423 = null;
        return $423;
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
                        var $424 = self.slice(0, -1);
                        var self = _map$3;
                        switch (self._) {
                            case 'BitsMap.tie':
                                var $426 = self.lft;
                                var $427 = BitsMap$get$($424, $426);
                                var $425 = $427;
                                break;
                            case 'BitsMap.new':
                                var $428 = Maybe$none;
                                var $425 = $428;
                                break;
                        };
                        return $425;
                    case 'i':
                        var $429 = self.slice(0, -1);
                        var self = _map$3;
                        switch (self._) {
                            case 'BitsMap.tie':
                                var $431 = self.rgt;
                                var $432 = BitsMap$get$($429, $431);
                                var $430 = $432;
                                break;
                            case 'BitsMap.new':
                                var $433 = Maybe$none;
                                var $430 = $433;
                                break;
                        };
                        return $430;
                    case 'e':
                        var self = _map$3;
                        switch (self._) {
                            case 'BitsMap.tie':
                                var $435 = self.val;
                                var $436 = $435;
                                var $434 = $436;
                                break;
                            case 'BitsMap.new':
                                var $437 = Maybe$none;
                                var $434 = $437;
                                break;
                        };
                        return $434;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const BitsMap$get = x0 => x1 => BitsMap$get$(x0, x1);
    const Bool$and = a0 => a1 => (a0 && a1);
    const String$eql = a0 => a1 => (a0 === a1);
    const U32$sub = a0 => a1 => (Math.max(a0 - a1, 0));

    function Web$Online$command$(_user$1, _cmd$2, _state$3) {
        var _key$4 = String$to_bits$(_user$1);
        var self = BitsMap$get$(_key$4, _state$3);
        switch (self._) {
            case 'Maybe.some':
                var $439 = self.value;
                var self = $439;
                switch (self._) {
                    case 'Pair.new':
                        var $441 = self.fst;
                        var $442 = self.snd;
                        var _spd$8 = 3;
                        var _p_x$9 = $441;
                        var _p_y$10 = $442;
                        var self = (_cmd$2 === Web$Online$command$A);
                        if (self) {
                            var $444 = BitsMap$set$(_key$4, Pair$new$((Math.max(_p_x$9 - _spd$8, 0)), _p_y$10), _state$3);
                            var $443 = $444;
                        } else {
                            var self = (_cmd$2 === Web$Online$command$D);
                            if (self) {
                                var $446 = BitsMap$set$(_key$4, Pair$new$(((_p_x$9 + _spd$8) >>> 0), _p_y$10), _state$3);
                                var $445 = $446;
                            } else {
                                var self = (_cmd$2 === Web$Online$command$W);
                                if (self) {
                                    var $448 = BitsMap$set$(_key$4, Pair$new$(_p_x$9, (Math.max(_p_y$10 - _spd$8, 0))), _state$3);
                                    var $447 = $448;
                                } else {
                                    var self = (_cmd$2 === Web$Online$command$S);
                                    if (self) {
                                        var $450 = BitsMap$set$(_key$4, Pair$new$(_p_x$9, ((_p_y$10 + _spd$8) >>> 0)), _state$3);
                                        var $449 = $450;
                                    } else {
                                        var $451 = _state$3;
                                        var $449 = $451;
                                    };
                                    var $447 = $449;
                                };
                                var $445 = $447;
                            };
                            var $443 = $445;
                        };
                        var $440 = $443;
                        break;
                };
                var $438 = $440;
                break;
            case 'Maybe.none':
                var $452 = BitsMap$set$(_key$4, Pair$new$(128, 128), _state$3);
                var $438 = $452;
                break;
        };
        return $438;
    };
    const Web$Online$command = x0 => x1 => x2 => Web$Online$command$(x0, x1, x2);

    function App$new$(_init$2, _draw$3, _when$4) {
        var $453 = ({
            _: 'App.new',
            'init': _init$2,
            'draw': _draw$3,
            'when': _when$4
        });
        return $453;
    };
    const App$new = x0 => x1 => x2 => App$new$(x0, x1, x2);
    const Web$Online = (() => {
        var _vbox$1 = VoxBox$alloc_capacity$(3200);
        var _init$2 = BitsMap$new;
        var _draw$3 = (_state$3 => {
            var _vbox$4 = VoxBox$clear$(_vbox$1);
            var _vbox$5 = (() => {
                var $457 = _vbox$4;
                var $458 = BitsMap$values$(_state$3);
                let _vbox$6 = $457;
                let _pos$5;
                while ($458._ === 'List.cons') {
                    _pos$5 = $458.head;
                    var self = _pos$5;
                    switch (self._) {
                        case 'Pair.new':
                            var $459 = self.fst;
                            var $460 = self.snd;
                            var $461 = VoxBox$Draw$image$($459, $460, 0, Web$Online$hero, _vbox$6);
                            var $457 = $461;
                            break;
                    };
                    _vbox$6 = $457;
                    $458 = $458.tail;
                }
                return _vbox$6;
            })();
            var $455 = DOM$vbox$(Map$from_list$(List$nil), Map$from_list$(List$nil), _vbox$5);
            return $455;
        });
        var _when$4 = (_event$4 => _state$5 => {
            var self = _event$4;
            switch (self._) {
                case 'App.Event.key_down':
                    var $463 = self.code;
                    var self = ($463 === 65);
                    if (self) {
                        var $465 = App$post$(Web$Online$room, Web$Online$command$A);
                        var $464 = $465;
                    } else {
                        var self = ($463 === 68);
                        if (self) {
                            var $467 = App$post$(Web$Online$room, Web$Online$command$D);
                            var $466 = $467;
                        } else {
                            var self = ($463 === 87);
                            if (self) {
                                var $469 = App$post$(Web$Online$room, Web$Online$command$W);
                                var $468 = $469;
                            } else {
                                var self = ($463 === 83);
                                if (self) {
                                    var $471 = App$post$(Web$Online$room, Web$Online$command$S);
                                    var $470 = $471;
                                } else {
                                    var $472 = App$pass;
                                    var $470 = $472;
                                };
                                var $468 = $470;
                            };
                            var $466 = $468;
                        };
                        var $464 = $466;
                    };
                    var $462 = $464;
                    break;
                case 'App.Event.post':
                    var $473 = self.addr;
                    var $474 = self.data;
                    var $475 = App$store$(Web$Online$command$($473, $474, _state$5));
                    var $462 = $475;
                    break;
                case 'App.Event.init':
                    var $476 = App$watch$(Web$Online$room);
                    var $462 = $476;
                    break;
                case 'App.Event.tick':
                case 'App.Event.dom':
                case 'App.Event.mouse_down':
                case 'App.Event.mouse_up':
                case 'App.Event.key_up':
                    var $477 = App$pass;
                    var $462 = $477;
                    break;
            };
            return $462;
        });
        var $454 = App$new$(_init$2, _draw$3, _when$4);
        return $454;
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
        'BitsMap.new': BitsMap$new,
        'Pair': Pair,
        'VoxBox.set_length': VoxBox$set_length,
        'VoxBox.clear': VoxBox$clear,
        'List.for': List$for,
        'List': List,
        'List.cons': List$cons,
        'BitsMap.values.go': BitsMap$values$go,
        'List.nil': List$nil,
        'BitsMap.values': BitsMap$values,
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
        'Pair.new': Pair$new,
        'Array.extract_tie': Array$extract_tie,
        'Word.foldl': Word$foldl,
        'Array.get': Array$get,
        'Buffer32.get': Buffer32$get,
        'VoxBox.get_pos': VoxBox$get_pos,
        'U32.add': U32$add,
        'VoxBox.get_col': VoxBox$get_col,
        'Word.and': Word$and,
        'U32.and': U32$and,
        'U32.shr': U32$shr,
        'Word.or': Word$or,
        'U32.or': U32$or,
        'U32.shl': U32$shl,
        'Pos32.new': Pos32$new,
        'Array.mut': Array$mut,
        'Array.set': Array$set,
        'Buffer32.set': Buffer32$set,
        'VoxBox.set_pos': VoxBox$set_pos,
        'VoxBox.set_col': VoxBox$set_col,
        'VoxBox.push': VoxBox$push,
        'VoxBox.Draw.image': VoxBox$Draw$image,
        'Nat.ltn': Nat$ltn,
        'Nat.sub': Nat$sub,
        'Word.shift_left': Word$shift_left,
        'Cmp.as_gte': Cmp$as_gte,
        'Word.gte': Word$gte,
        'Word.shift_right1.aux': Word$shift_right1$aux,
        'Word.shift_right1': Word$shift_right1,
        'Word.subber': Word$subber,
        'Word.sub': Word$sub,
        'Word.div.go': Word$div$go,
        'Word.div': Word$div,
        'U32.div': U32$div,
        'U32.length': U32$length,
        'Word.slice': Word$slice,
        'U32.slice': U32$slice,
        'U32.read_base': U32$read_base,
        'VoxBox.parse_byte': VoxBox$parse_byte,
        'Col32.new': Col32$new,
        'VoxBox.parse': VoxBox$parse,
        'Web.Online.hero.hex': Web$Online$hero$hex,
        'Web.Online.hero': Web$Online$hero,
        'DOM.vbox': DOM$vbox,
        'BitsMap': BitsMap,
        'Map': Map,
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
        'IO': IO,
        'IO.ask': IO$ask,
        'IO.bind': IO$bind,
        'IO.end': IO$end,
        'IO.monad': IO$monad,
        'IO.do': IO$do,
        'Dynamic.new': Dynamic$new,
        'App.pass': App$pass,
        'App.do': App$do,
        'App.watch': App$watch,
        'Web.Online.room': Web$Online$room,
        'U16.eql': U16$eql,
        'String.cons': String$cons,
        'String.concat': String$concat,
        'App.post': App$post,
        'Web.Online.command.A': Web$Online$command$A,
        'Web.Online.command.D': Web$Online$command$D,
        'Web.Online.command.W': Web$Online$command$W,
        'Web.Online.command.S': Web$Online$command$S,
        'App.store': App$store,
        'Maybe': Maybe,
        'BitsMap.get': BitsMap$get,
        'Bool.and': Bool$and,
        'String.eql': String$eql,
        'U32.sub': U32$sub,
        'Web.Online.command': Web$Online$command,
        'App.new': App$new,
        'Web.Online': Web$Online,
    };
})();

/***/ })

}]);
//# sourceMappingURL=523.index.js.map