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

    function Nat$to_word$(_size$1, _n$2) {
        var $130 = Nat$apply$(_n$2, Word$inc, Word$zero$(_size$1));
        return $130;
    };
    const Nat$to_word = x0 => x1 => Nat$to_word$(x0, x1);
    const Nat$to_u32 = a0 => (Number(a0) >>> 0);

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
    const U32$inc = a0 => ((a0 + 1) >>> 0);
    const U32$for = a0 => a1 => a2 => a3 => (u32_for(a0, a1, a2, a3));

    function Word$trim$(_new_size$2, _word$3) {
        var self = _new_size$2;
        if (self === 0n) {
            var $185 = Word$e;
            var $184 = $185;
        } else {
            var $186 = (self - 1n);
            var self = _word$3;
            switch (self._) {
                case 'Word.o':
                    var $188 = self.pred;
                    var $189 = Word$o$(Word$trim$($186, $188));
                    var $187 = $189;
                    break;
                case 'Word.i':
                    var $190 = self.pred;
                    var $191 = Word$i$(Word$trim$($186, $190));
                    var $187 = $191;
                    break;
                case 'Word.e':
                    var $192 = Word$o$(Word$trim$($186, Word$e));
                    var $187 = $192;
                    break;
            };
            var $184 = $187;
        };
        return $184;
    };
    const Word$trim = x0 => x1 => Word$trim$(x0, x1);
    const Unit$new = null;

    function Array$extract_tip$(_arr$2) {
        var self = _arr$2;
        switch (self._) {
            case 'Array.tip':
                var $194 = self.value;
                var $195 = $194;
                var $193 = $195;
                break;
            case 'Array.tie':
                var $196 = Unit$new;
                var $193 = $196;
                break;
        };
        return $193;
    };
    const Array$extract_tip = x0 => Array$extract_tip$(x0);

    function Pair$new$(_fst$3, _snd$4) {
        var $197 = ({
            _: 'Pair.new',
            'fst': _fst$3,
            'snd': _snd$4
        });
        return $197;
    };
    const Pair$new = x0 => x1 => Pair$new$(x0, x1);

    function Array$extract_tie$(_arr$3) {
        var self = _arr$3;
        switch (self._) {
            case 'Array.tie':
                var $199 = self.lft;
                var $200 = self.rgt;
                var $201 = Pair$new$($199, $200);
                var $198 = $201;
                break;
            case 'Array.tip':
                var $202 = Unit$new;
                var $198 = $202;
                break;
        };
        return $198;
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
                        var $203 = self.pred;
                        var $204 = Word$foldl$(_w0$4(_nil$3), _w0$4, _w1$5, $203);
                        return $204;
                    case 'Word.i':
                        var $205 = self.pred;
                        var $206 = Word$foldl$(_w1$5(_nil$3), _w0$4, _w1$5, $205);
                        return $206;
                    case 'Word.e':
                        var $207 = _nil$3;
                        return $207;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Word$foldl = x0 => x1 => x2 => x3 => Word$foldl$(x0, x1, x2, x3);

    function Array$get$(_idx$3, _arr$4) {
        var $208 = Word$foldl$(Array$extract_tip, (_rec$6 => _arr$7 => {
            var _arr_l$8 = Array$extract_tie$(_arr$7);
            var self = _arr_l$8;
            switch (self._) {
                case 'Pair.new':
                    var $210 = self.fst;
                    var $211 = _rec$6($210);
                    var $209 = $211;
                    break;
            };
            return $209;
        }), (_rec$6 => _arr$7 => {
            var _arr_r$8 = Array$extract_tie$(_arr$7);
            var self = _arr_r$8;
            switch (self._) {
                case 'Pair.new':
                    var $213 = self.snd;
                    var $214 = _rec$6($213);
                    var $212 = $214;
                    break;
            };
            return $212;
        }), _idx$3)(_arr$4);
        return $208;
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
                var $216 = self.pred;
                var $217 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $219 = self.pred;
                            var $220 = (_a$pred$9 => {
                                var $221 = Word$o$(Word$and$(_a$pred$9, $219));
                                return $221;
                            });
                            var $218 = $220;
                            break;
                        case 'Word.i':
                            var $222 = self.pred;
                            var $223 = (_a$pred$9 => {
                                var $224 = Word$o$(Word$and$(_a$pred$9, $222));
                                return $224;
                            });
                            var $218 = $223;
                            break;
                        case 'Word.e':
                            var $225 = (_a$pred$7 => {
                                var $226 = Word$e;
                                return $226;
                            });
                            var $218 = $225;
                            break;
                    };
                    var $218 = $218($216);
                    return $218;
                });
                var $215 = $217;
                break;
            case 'Word.i':
                var $227 = self.pred;
                var $228 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $230 = self.pred;
                            var $231 = (_a$pred$9 => {
                                var $232 = Word$o$(Word$and$(_a$pred$9, $230));
                                return $232;
                            });
                            var $229 = $231;
                            break;
                        case 'Word.i':
                            var $233 = self.pred;
                            var $234 = (_a$pred$9 => {
                                var $235 = Word$i$(Word$and$(_a$pred$9, $233));
                                return $235;
                            });
                            var $229 = $234;
                            break;
                        case 'Word.e':
                            var $236 = (_a$pred$7 => {
                                var $237 = Word$e;
                                return $237;
                            });
                            var $229 = $236;
                            break;
                    };
                    var $229 = $229($227);
                    return $229;
                });
                var $215 = $228;
                break;
            case 'Word.e':
                var $238 = (_b$4 => {
                    var $239 = Word$e;
                    return $239;
                });
                var $215 = $238;
                break;
        };
        var $215 = $215(_b$3);
        return $215;
    };
    const Word$and = x0 => x1 => Word$and$(x0, x1);
    const U32$and = a0 => a1 => (a0 & a1);
    const U32$shr = a0 => a1 => (a0 >>> a1);

    function Word$or$(_a$2, _b$3) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $241 = self.pred;
                var $242 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $244 = self.pred;
                            var $245 = (_a$pred$9 => {
                                var $246 = Word$o$(Word$or$(_a$pred$9, $244));
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
                var $240 = $242;
                break;
            case 'Word.i':
                var $252 = self.pred;
                var $253 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $255 = self.pred;
                            var $256 = (_a$pred$9 => {
                                var $257 = Word$i$(Word$or$(_a$pred$9, $255));
                                return $257;
                            });
                            var $254 = $256;
                            break;
                        case 'Word.i':
                            var $258 = self.pred;
                            var $259 = (_a$pred$9 => {
                                var $260 = Word$i$(Word$or$(_a$pred$9, $258));
                                return $260;
                            });
                            var $254 = $259;
                            break;
                        case 'Word.e':
                            var $261 = (_a$pred$7 => {
                                var $262 = Word$e;
                                return $262;
                            });
                            var $254 = $261;
                            break;
                    };
                    var $254 = $254($252);
                    return $254;
                });
                var $240 = $253;
                break;
            case 'Word.e':
                var $263 = (_b$4 => {
                    var $264 = Word$e;
                    return $264;
                });
                var $240 = $263;
                break;
        };
        var $240 = $240(_b$3);
        return $240;
    };
    const Word$or = x0 => x1 => Word$or$(x0, x1);
    const U32$or = a0 => a1 => (a0 | a1);
    const U32$shl = a0 => a1 => ((a0 << a1) >>> 0);
    const Pos32$new = a0 => a1 => a2 => ((0 | a0 | (a1 << 12) | (a2 << 24)));

    function Array$mut$(_idx$3, _f$4, _arr$5) {
        var $265 = Word$foldl$((_arr$6 => {
            var $266 = Array$tip$(_f$4(Array$extract_tip$(_arr$6)));
            return $266;
        }), (_rec$7 => _arr$8 => {
            var self = Array$extract_tie$(_arr$8);
            switch (self._) {
                case 'Pair.new':
                    var $268 = self.fst;
                    var $269 = self.snd;
                    var $270 = Array$tie$(_rec$7($268), $269);
                    var $267 = $270;
                    break;
            };
            return $267;
        }), (_rec$7 => _arr$8 => {
            var self = Array$extract_tie$(_arr$8);
            switch (self._) {
                case 'Pair.new':
                    var $272 = self.fst;
                    var $273 = self.snd;
                    var $274 = Array$tie$($272, _rec$7($273));
                    var $271 = $274;
                    break;
            };
            return $271;
        }), _idx$3)(_arr$5);
        return $265;
    };
    const Array$mut = x0 => x1 => x2 => Array$mut$(x0, x1, x2);

    function Array$set$(_idx$3, _val$4, _arr$5) {
        var $275 = Array$mut$(_idx$3, (_x$6 => {
            var $276 = _val$4;
            return $276;
        }), _arr$5);
        return $275;
    };
    const Array$set = x0 => x1 => x2 => Array$set$(x0, x1, x2);
    const Buffer32$set = a0 => a1 => a2 => ((a2[a0] = a1, a2));
    const VoxBox$set_pos = a0 => a1 => a2 => ((a2.buffer[a0 * 2] = a1, a2));
    const VoxBox$set_col = a0 => a1 => a2 => ((a2.buffer[a0 * 2 + 1] = a1, a2));
    const VoxBox$push = a0 => a1 => a2 => ((a2.buffer[a2.length * 2] = a0, a2.buffer[a2.length * 2 + 1] = a1, a2.length++, a2));

    function VoxBox$Draw$image$(_x$1, _y$2, _z$3, _src$4, _img$5) {
        var _len$6 = VoxBox$get_len$(_src$4);
        var _img$7 = (() => {
            var $278 = _img$5;
            var $279 = 0;
            var $280 = _len$6;
            let _img$8 = $278;
            for (let _i$7 = $279; _i$7 < $280; ++_i$7) {
                var _pos$9 = ((_src$4.buffer[_i$7 * 2]));
                var _col$10 = ((_src$4.buffer[_i$7 * 2 + 1]));
                var _p_x$11 = (_pos$9 & 4095);
                var _p_y$12 = ((_pos$9 & 16773120) >>> 12);
                var _p_z$13 = ((_pos$9 & 4278190080) >>> 24);
                var _p_x$14 = ((_p_x$11 + _x$1) >>> 0);
                var _p_y$15 = ((_p_y$12 + _y$2) >>> 0);
                var _p_z$16 = ((_p_z$13 + _z$3) >>> 0);
                var _pos$17 = ((0 | _p_x$14 | (_p_y$15 << 12) | (_p_z$16 << 24)));
                var $278 = ((_img$8.buffer[_img$8.length * 2] = _pos$17, _img$8.buffer[_img$8.length * 2 + 1] = _col$10, _img$8.length++, _img$8));
                _img$8 = $278;
            };
            return _img$8;
        })();
        var $277 = _img$7;
        return $277;
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
                    var $281 = _value$3;
                    return $281;
                } else {
                    var $282 = (self - 1n);
                    var $283 = Word$shift_left$($282, Word$shift_left1$(_value$3));
                    return $283;
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
                var $285 = Bool$false;
                var $284 = $285;
                break;
            case 'Cmp.eql':
            case 'Cmp.gtn':
                var $286 = Bool$true;
                var $284 = $286;
                break;
        };
        return $284;
    };
    const Cmp$as_gte = x0 => Cmp$as_gte$(x0);

    function Word$gte$(_a$2, _b$3) {
        var $287 = Cmp$as_gte$(Word$cmp$(_a$2, _b$3));
        return $287;
    };
    const Word$gte = x0 => x1 => Word$gte$(x0, x1);

    function Word$shift_right1$aux$(_word$2) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $289 = self.pred;
                var $290 = Word$o$(Word$shift_right1$aux$($289));
                var $288 = $290;
                break;
            case 'Word.i':
                var $291 = self.pred;
                var $292 = Word$i$(Word$shift_right1$aux$($291));
                var $288 = $292;
                break;
            case 'Word.e':
                var $293 = Word$o$(Word$e);
                var $288 = $293;
                break;
        };
        return $288;
    };
    const Word$shift_right1$aux = x0 => Word$shift_right1$aux$(x0);

    function Word$shift_right1$(_word$2) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $295 = self.pred;
                var $296 = Word$shift_right1$aux$($295);
                var $294 = $296;
                break;
            case 'Word.i':
                var $297 = self.pred;
                var $298 = Word$shift_right1$aux$($297);
                var $294 = $298;
                break;
            case 'Word.e':
                var $299 = Word$e;
                var $294 = $299;
                break;
        };
        return $294;
    };
    const Word$shift_right1 = x0 => Word$shift_right1$(x0);

    function Word$subber$(_a$2, _b$3, _c$4) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $301 = self.pred;
                var $302 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $304 = self.pred;
                            var $305 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $307 = Word$i$(Word$subber$(_a$pred$10, $304, Bool$true));
                                    var $306 = $307;
                                } else {
                                    var $308 = Word$o$(Word$subber$(_a$pred$10, $304, Bool$false));
                                    var $306 = $308;
                                };
                                return $306;
                            });
                            var $303 = $305;
                            break;
                        case 'Word.i':
                            var $309 = self.pred;
                            var $310 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $312 = Word$o$(Word$subber$(_a$pred$10, $309, Bool$true));
                                    var $311 = $312;
                                } else {
                                    var $313 = Word$i$(Word$subber$(_a$pred$10, $309, Bool$true));
                                    var $311 = $313;
                                };
                                return $311;
                            });
                            var $303 = $310;
                            break;
                        case 'Word.e':
                            var $314 = (_a$pred$8 => {
                                var $315 = Word$e;
                                return $315;
                            });
                            var $303 = $314;
                            break;
                    };
                    var $303 = $303($301);
                    return $303;
                });
                var $300 = $302;
                break;
            case 'Word.i':
                var $316 = self.pred;
                var $317 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $319 = self.pred;
                            var $320 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $322 = Word$o$(Word$subber$(_a$pred$10, $319, Bool$false));
                                    var $321 = $322;
                                } else {
                                    var $323 = Word$i$(Word$subber$(_a$pred$10, $319, Bool$false));
                                    var $321 = $323;
                                };
                                return $321;
                            });
                            var $318 = $320;
                            break;
                        case 'Word.i':
                            var $324 = self.pred;
                            var $325 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $327 = Word$i$(Word$subber$(_a$pred$10, $324, Bool$true));
                                    var $326 = $327;
                                } else {
                                    var $328 = Word$o$(Word$subber$(_a$pred$10, $324, Bool$false));
                                    var $326 = $328;
                                };
                                return $326;
                            });
                            var $318 = $325;
                            break;
                        case 'Word.e':
                            var $329 = (_a$pred$8 => {
                                var $330 = Word$e;
                                return $330;
                            });
                            var $318 = $329;
                            break;
                    };
                    var $318 = $318($316);
                    return $318;
                });
                var $300 = $317;
                break;
            case 'Word.e':
                var $331 = (_b$5 => {
                    var $332 = Word$e;
                    return $332;
                });
                var $300 = $331;
                break;
        };
        var $300 = $300(_b$3);
        return $300;
    };
    const Word$subber = x0 => x1 => x2 => Word$subber$(x0, x1, x2);

    function Word$sub$(_a$2, _b$3) {
        var $333 = Word$subber$(_a$2, _b$3, Bool$false);
        return $333;
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
                    var $334 = Pair$new$(Bool$true, Word$or$(_value$5, _mask$6));
                    var self = $334;
                } else {
                    var $335 = Pair$new$(Bool$false, _value$5);
                    var self = $335;
                };
                switch (self._) {
                    case 'Pair.new':
                        var $336 = self.fst;
                        var $337 = self.snd;
                        var self = _shift$2;
                        if (self === 0n) {
                            var $339 = $337;
                            var $338 = $339;
                        } else {
                            var $340 = (self - 1n);
                            var _new_shift_copy$9 = Word$shift_right1$(_shift_copy$4);
                            var self = $336;
                            if (self) {
                                var $342 = Word$div$go$($340, Word$sub$(_sub_copy$3, _shift_copy$4), _new_shift_copy$9, $337);
                                var $341 = $342;
                            } else {
                                var $343 = Word$div$go$($340, _sub_copy$3, _new_shift_copy$9, $337);
                                var $341 = $343;
                            };
                            var $338 = $341;
                        };
                        return $338;
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
            var $345 = Word$to_zero$(_a$2);
            var $344 = $345;
        } else {
            var _shift$6 = (_a_bits$4 - _b_bits$5 <= 0n ? 0n : _a_bits$4 - _b_bits$5);
            var _shift_copy$7 = Word$shift_left$(_shift$6, _b$3);
            var $346 = Word$div$go$(_shift$6, _a$2, _shift_copy$7, Word$to_zero$(_a$2));
            var $344 = $346;
        };
        return $344;
    };
    const Word$div = x0 => x1 => Word$div$(x0, x1);
    const U32$div = a0 => a1 => ((a0 / a1) >>> 0);
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
        var $347 = (parseInt(_chr$3, 16));
        return $347;
    };
    const VoxBox$parse_byte = x0 => x1 => VoxBox$parse_byte$(x0, x1);
    const Col32$new = a0 => a1 => a2 => a3 => ((0 | a0 | (a1 << 8) | (a2 << 16) | (a3 << 24)));

    function VoxBox$parse$(_voxdata$1) {
        var _siz$2 = ((((_voxdata$1.length) >>> 0) / 12) >>> 0);
        var _img$3 = VoxBox$alloc_capacity$(_siz$2);
        var _img$4 = (() => {
            var $349 = _img$3;
            var $350 = 0;
            var $351 = _siz$2;
            let _img$5 = $349;
            for (let _i$4 = $350; _i$4 < $351; ++_i$4) {
                var _x$6 = VoxBox$parse_byte$(((((_i$4 * 6) >>> 0) + 0) >>> 0), _voxdata$1);
                var _y$7 = VoxBox$parse_byte$(((((_i$4 * 6) >>> 0) + 1) >>> 0), _voxdata$1);
                var _z$8 = VoxBox$parse_byte$(((((_i$4 * 6) >>> 0) + 2) >>> 0), _voxdata$1);
                var _r$9 = VoxBox$parse_byte$(((((_i$4 * 6) >>> 0) + 3) >>> 0), _voxdata$1);
                var _g$10 = VoxBox$parse_byte$(((((_i$4 * 6) >>> 0) + 4) >>> 0), _voxdata$1);
                var _b$11 = VoxBox$parse_byte$(((((_i$4 * 6) >>> 0) + 5) >>> 0), _voxdata$1);
                var _pos$12 = ((0 | _x$6 | (_y$7 << 12) | (_z$8 << 24)));
                var _col$13 = ((0 | _r$9 | (_g$10 << 8) | (_b$11 << 16) | (255 << 24)));
                var $349 = ((_img$5.buffer[_img$5.length * 2] = _pos$12, _img$5.buffer[_img$5.length * 2 + 1] = _col$13, _img$5.length++, _img$5));
                _img$5 = $349;
            };
            return _img$5;
        })();
        var $348 = _img$4;
        return $348;
    };
    const VoxBox$parse = x0 => VoxBox$parse$(x0);
    const Web$Online$hero$hex = "0d00000000000e00000000000f00000000001000000000001100000000000c01000000000d01000000001101000000000b02000000000c02000000001202000000000b03000000001203000000000b04000000000c04000000001104000000000c05000000000d05000000000e05000000001005000000001105000000000e06000000000f06000000000e07000000000e08000000000f08000000000d09000000000e09000000000f09000000000c0a000000000d0a000000000e0a000000000f0a00000000100a000000000c0b000000000e0b00000000100b000000000b0c000000000c0c000000000e0c00000000100c00000000110c000000000b0d000000000e0d00000000110d000000000a0e000000000b0e000000000e0e00000000110e00000000120e000000000a0f000000000e0f00000000120f000000000910000000000a10000000000e10000000001210000000001310000000000911000000000e11000000001311000000000e12000000000d13000000000e13000000000f13000000000d14000000000f14000000000d15000000000f15000000000c16000000000d16000000000f16000000000c17000000000f17000000000c18000000000f18000000000c19000000001019000000000c1a00000000101a000000000b1b000000000c1b00000000101b000000000b1c00000000101c000000000b1d00000000101d00000000111d000000000b1e00000000111e000000000a1f000000000b1f00000000111f00000000";
    const Web$Online$hero = VoxBox$parse$(Web$Online$hero$hex);

    function DOM$vbox$(_props$1, _style$2, _value$3) {
        var $352 = ({
            _: 'DOM.vbox',
            'props': _props$1,
            'style': _style$2,
            'value': _value$3
        });
        return $352;
    };
    const DOM$vbox = x0 => x1 => x2 => DOM$vbox$(x0, x1, x2);

    function BitsMap$(_A$1) {
        var $353 = null;
        return $353;
    };
    const BitsMap = x0 => BitsMap$(x0);

    function Map$(_V$1) {
        var $354 = null;
        return $354;
    };
    const Map = x0 => Map$(x0);

    function BitsMap$tie$(_val$2, _lft$3, _rgt$4) {
        var $355 = ({
            _: 'BitsMap.tie',
            'val': _val$2,
            'lft': _lft$3,
            'rgt': _rgt$4
        });
        return $355;
    };
    const BitsMap$tie = x0 => x1 => x2 => BitsMap$tie$(x0, x1, x2);

    function Maybe$some$(_value$2) {
        var $356 = ({
            _: 'Maybe.some',
            'value': _value$2
        });
        return $356;
    };
    const Maybe$some = x0 => Maybe$some$(x0);
    const Maybe$none = ({
        _: 'Maybe.none'
    });

    function BitsMap$set$(_bits$2, _val$3, _map$4) {
        var self = _bits$2;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'o':
                var $358 = self.slice(0, -1);
                var self = _map$4;
                switch (self._) {
                    case 'BitsMap.tie':
                        var $360 = self.val;
                        var $361 = self.lft;
                        var $362 = self.rgt;
                        var $363 = BitsMap$tie$($360, BitsMap$set$($358, _val$3, $361), $362);
                        var $359 = $363;
                        break;
                    case 'BitsMap.new':
                        var $364 = BitsMap$tie$(Maybe$none, BitsMap$set$($358, _val$3, BitsMap$new), BitsMap$new);
                        var $359 = $364;
                        break;
                };
                var $357 = $359;
                break;
            case 'i':
                var $365 = self.slice(0, -1);
                var self = _map$4;
                switch (self._) {
                    case 'BitsMap.tie':
                        var $367 = self.val;
                        var $368 = self.lft;
                        var $369 = self.rgt;
                        var $370 = BitsMap$tie$($367, $368, BitsMap$set$($365, _val$3, $369));
                        var $366 = $370;
                        break;
                    case 'BitsMap.new':
                        var $371 = BitsMap$tie$(Maybe$none, BitsMap$new, BitsMap$set$($365, _val$3, BitsMap$new));
                        var $366 = $371;
                        break;
                };
                var $357 = $366;
                break;
            case 'e':
                var self = _map$4;
                switch (self._) {
                    case 'BitsMap.tie':
                        var $373 = self.lft;
                        var $374 = self.rgt;
                        var $375 = BitsMap$tie$(Maybe$some$(_val$3), $373, $374);
                        var $372 = $375;
                        break;
                    case 'BitsMap.new':
                        var $376 = BitsMap$tie$(Maybe$some$(_val$3), BitsMap$new, BitsMap$new);
                        var $372 = $376;
                        break;
                };
                var $357 = $372;
                break;
        };
        return $357;
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
                var $378 = self.pred;
                var $379 = (Word$to_bits$($378) + '0');
                var $377 = $379;
                break;
            case 'Word.i':
                var $380 = self.pred;
                var $381 = (Word$to_bits$($380) + '1');
                var $377 = $381;
                break;
            case 'Word.e':
                var $382 = Bits$e;
                var $377 = $382;
                break;
        };
        return $377;
    };
    const Word$to_bits = x0 => Word$to_bits$(x0);
    const U16$to_bits = a0 => (u16_to_bits(a0));

    function String$to_bits$(_str$1) {
        var self = _str$1;
        if (self.length === 0) {
            var $384 = Bits$e;
            var $383 = $384;
        } else {
            var $385 = self.charCodeAt(0);
            var $386 = self.slice(1);
            var $387 = (String$to_bits$($386) + (u16_to_bits($385)));
            var $383 = $387;
        };
        return $383;
    };
    const String$to_bits = x0 => String$to_bits$(x0);

    function Map$from_list$(_xs$2) {
        var self = _xs$2;
        switch (self._) {
            case 'List.cons':
                var $389 = self.head;
                var $390 = self.tail;
                var self = $389;
                switch (self._) {
                    case 'Pair.new':
                        var $392 = self.fst;
                        var $393 = self.snd;
                        var $394 = BitsMap$set$(String$to_bits$($392), $393, Map$from_list$($390));
                        var $391 = $394;
                        break;
                };
                var $388 = $391;
                break;
            case 'List.nil':
                var $395 = BitsMap$new;
                var $388 = $395;
                break;
        };
        return $388;
    };
    const Map$from_list = x0 => Map$from_list$(x0);

    function IO$(_A$1) {
        var $396 = null;
        return $396;
    };
    const IO = x0 => IO$(x0);

    function IO$ask$(_query$2, _param$3, _then$4) {
        var $397 = ({
            _: 'IO.ask',
            'query': _query$2,
            'param': _param$3,
            'then': _then$4
        });
        return $397;
    };
    const IO$ask = x0 => x1 => x2 => IO$ask$(x0, x1, x2);

    function IO$bind$(_a$3, _f$4) {
        var self = _a$3;
        switch (self._) {
            case 'IO.end':
                var $399 = self.value;
                var $400 = _f$4($399);
                var $398 = $400;
                break;
            case 'IO.ask':
                var $401 = self.query;
                var $402 = self.param;
                var $403 = self.then;
                var $404 = IO$ask$($401, $402, (_x$8 => {
                    var $405 = IO$bind$($403(_x$8), _f$4);
                    return $405;
                }));
                var $398 = $404;
                break;
        };
        return $398;
    };
    const IO$bind = x0 => x1 => IO$bind$(x0, x1);

    function IO$end$(_value$2) {
        var $406 = ({
            _: 'IO.end',
            'value': _value$2
        });
        return $406;
    };
    const IO$end = x0 => IO$end$(x0);

    function IO$monad$(_new$2) {
        var $407 = _new$2(IO$bind)(IO$end);
        return $407;
    };
    const IO$monad = x0 => IO$monad$(x0);

    function IO$do$(_call$1, _param$2) {
        var $408 = IO$ask$(_call$1, _param$2, (_answer$3 => {
            var $409 = IO$end$(Unit$new);
            return $409;
        }));
        return $408;
    };
    const IO$do = x0 => x1 => IO$do$(x0, x1);

    function Dynamic$new$(_value$2) {
        var $410 = ({
            _: 'Dynamic.new',
            'value': _value$2
        });
        return $410;
    };
    const Dynamic$new = x0 => Dynamic$new$(x0);
    const App$pass = IO$monad$((_m$bind$1 => _m$pure$2 => {
        var $411 = _m$pure$2;
        return $411;
    }))(Dynamic$new$(Unit$new));

    function App$do$(_call$1, _param$2) {
        var $412 = IO$monad$((_m$bind$3 => _m$pure$4 => {
            var $413 = _m$bind$3;
            return $413;
        }))(IO$do$(_call$1, _param$2))((_$3 => {
            var $414 = App$pass;
            return $414;
        }));
        return $412;
    };
    const App$do = x0 => x1 => App$do$(x0, x1);

    function App$watch$(_room$1) {
        var $415 = App$do$("watch", _room$1);
        return $415;
    };
    const App$watch = x0 => App$watch$(x0);
    const Web$Online$room = "0x196581625483";
    const U16$eql = a0 => a1 => (a0 === a1);

    function String$cons$(_head$1, _tail$2) {
        var $416 = (String.fromCharCode(_head$1) + _tail$2);
        return $416;
    };
    const String$cons = x0 => x1 => String$cons$(x0, x1);
    const String$concat = a0 => a1 => (a0 + a1);

    function App$post$(_room$1, _data$2) {
        var $417 = App$do$("post", (_room$1 + (";" + _data$2)));
        return $417;
    };
    const App$post = x0 => x1 => App$post$(x0, x1);
    const Web$Online$command$A = "0x0000000000000000000000000000000000000000000000000000000000000000";
    const Web$Online$command$D = "0x0000000000000000000000000000000000000000000000000000000000000001";
    const Web$Online$command$W = "0x0000000000000000000000000000000000000000000000000000000000000003";
    const Web$Online$command$S = "0x0000000000000000000000000000000000000000000000000000000000000002";

    function App$store$(_value$2) {
        var $418 = IO$monad$((_m$bind$3 => _m$pure$4 => {
            var $419 = _m$pure$4;
            return $419;
        }))(Dynamic$new$(_value$2));
        return $418;
    };
    const App$store = x0 => App$store$(x0);

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
    const Bool$and = a0 => a1 => (a0 && a1);
    const String$eql = a0 => a1 => (a0 === a1);
    const U32$sub = a0 => a1 => ((a0 - a1) >>> 0);

    function Web$Online$command$(_user$1, _cmd$2, _state$3) {
        var _key$4 = String$to_bits$(_user$1);
        var self = BitsMap$get$(_key$4, _state$3);
        switch (self._) {
            case 'Maybe.some':
                var $436 = self.value;
                var self = $436;
                switch (self._) {
                    case 'Pair.new':
                        var $438 = self.fst;
                        var $439 = self.snd;
                        var _spd$8 = 3;
                        var _p_x$9 = $438;
                        var _p_y$10 = $439;
                        var self = (_cmd$2 === Web$Online$command$A);
                        if (self) {
                            var $441 = BitsMap$set$(_key$4, Pair$new$(((_p_x$9 - _spd$8) >>> 0), _p_y$10), _state$3);
                            var $440 = $441;
                        } else {
                            var self = (_cmd$2 === Web$Online$command$D);
                            if (self) {
                                var $443 = BitsMap$set$(_key$4, Pair$new$(((_p_x$9 + _spd$8) >>> 0), _p_y$10), _state$3);
                                var $442 = $443;
                            } else {
                                var self = (_cmd$2 === Web$Online$command$W);
                                if (self) {
                                    var $445 = BitsMap$set$(_key$4, Pair$new$(_p_x$9, ((_p_y$10 - _spd$8) >>> 0)), _state$3);
                                    var $444 = $445;
                                } else {
                                    var self = (_cmd$2 === Web$Online$command$S);
                                    if (self) {
                                        var $447 = BitsMap$set$(_key$4, Pair$new$(_p_x$9, ((_p_y$10 + _spd$8) >>> 0)), _state$3);
                                        var $446 = $447;
                                    } else {
                                        var $448 = _state$3;
                                        var $446 = $448;
                                    };
                                    var $444 = $446;
                                };
                                var $442 = $444;
                            };
                            var $440 = $442;
                        };
                        var $437 = $440;
                        break;
                };
                var $435 = $437;
                break;
            case 'Maybe.none':
                var $449 = BitsMap$set$(_key$4, Pair$new$(128, 128), _state$3);
                var $435 = $449;
                break;
        };
        return $435;
    };
    const Web$Online$command = x0 => x1 => x2 => Web$Online$command$(x0, x1, x2);

    function App$new$(_init$2, _draw$3, _when$4) {
        var $450 = ({
            _: 'App.new',
            'init': _init$2,
            'draw': _draw$3,
            'when': _when$4
        });
        return $450;
    };
    const App$new = x0 => x1 => x2 => App$new$(x0, x1, x2);
    const Web$Online = (() => {
        var _vbox$1 = VoxBox$alloc_capacity$(3200);
        var _init$2 = BitsMap$new;
        var _draw$3 = (_state$3 => {
            var _vbox$4 = VoxBox$clear$(_vbox$1);
            var _vbox$5 = (() => {
                var $454 = _vbox$4;
                var $455 = BitsMap$values$(_state$3);
                let _vbox$6 = $454;
                let _pos$5;
                while ($455._ === 'List.cons') {
                    _pos$5 = $455.head;
                    var self = _pos$5;
                    switch (self._) {
                        case 'Pair.new':
                            var $456 = self.fst;
                            var $457 = self.snd;
                            var $458 = VoxBox$Draw$image$($456, $457, 0, Web$Online$hero, _vbox$6);
                            var $454 = $458;
                            break;
                    };
                    _vbox$6 = $454;
                    $455 = $455.tail;
                }
                return _vbox$6;
            })();
            var $452 = DOM$vbox$(Map$from_list$(List$nil), Map$from_list$(List$nil), _vbox$5);
            return $452;
        });
        var _when$4 = (_event$4 => _state$5 => {
            var self = _event$4;
            switch (self._) {
                case 'App.Event.key_down':
                    var $460 = self.code;
                    var self = ($460 === 65);
                    if (self) {
                        var $462 = App$post$(Web$Online$room, Web$Online$command$A);
                        var $461 = $462;
                    } else {
                        var self = ($460 === 68);
                        if (self) {
                            var $464 = App$post$(Web$Online$room, Web$Online$command$D);
                            var $463 = $464;
                        } else {
                            var self = ($460 === 87);
                            if (self) {
                                var $466 = App$post$(Web$Online$room, Web$Online$command$W);
                                var $465 = $466;
                            } else {
                                var self = ($460 === 83);
                                if (self) {
                                    var $468 = App$post$(Web$Online$room, Web$Online$command$S);
                                    var $467 = $468;
                                } else {
                                    var $469 = App$pass;
                                    var $467 = $469;
                                };
                                var $465 = $467;
                            };
                            var $463 = $465;
                        };
                        var $461 = $463;
                    };
                    var $459 = $461;
                    break;
                case 'App.Event.post':
                    var $470 = self.addr;
                    var $471 = self.data;
                    var $472 = App$store$(Web$Online$command$($470, $471, _state$5));
                    var $459 = $472;
                    break;
                case 'App.Event.init':
                    var $473 = App$watch$(Web$Online$room);
                    var $459 = $473;
                    break;
                case 'App.Event.tick':
                case 'App.Event.mouse_down':
                case 'App.Event.mouse_up':
                case 'App.Event.key_up':
                case 'App.Event.mouse_over':
                case 'App.Event.mouse_out':
                case 'App.Event.mouse_click':
                case 'App.Event.resize':
                    var $474 = App$pass;
                    var $459 = $474;
                    break;
            };
            return $459;
        });
        var $451 = App$new$(_init$2, _draw$3, _when$4);
        return $451;
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