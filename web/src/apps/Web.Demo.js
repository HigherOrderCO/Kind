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
                var $24 = c0;
                return $24;
            } else {
                var $25 = self.charCodeAt(0);
                var $26 = self.slice(1);
                var $27 = c1($25)($26);
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

    function Pair$new$(_fst$3, _snd$4) {
        var $133 = ({
            _: 'Pair.new',
            'fst': _fst$3,
            'snd': _snd$4
        });
        return $133;
    };
    const Pair$new = x0 => x1 => Pair$new$(x0, x1);

    function Pair$fst$(_pair$3) {
        var self = _pair$3;
        switch (self._) {
            case 'Pair.new':
                var $135 = self.fst;
                var $136 = $135;
                var $134 = $136;
                break;
        };
        return $134;
    };
    const Pair$fst = x0 => Pair$fst$(x0);

    function Pair$snd$(_pair$3) {
        var self = _pair$3;
        switch (self._) {
            case 'Pair.new':
                var $138 = self.snd;
                var $139 = $138;
                var $137 = $139;
                break;
        };
        return $137;
    };
    const Pair$snd = x0 => Pair$snd$(x0);

    function Word$or$(_a$2, _b$3) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $141 = self.pred;
                var $142 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $144 = self.pred;
                            var $145 = (_a$pred$9 => {
                                var $146 = Word$o$(Word$or$(_a$pred$9, $144));
                                return $146;
                            });
                            var $143 = $145;
                            break;
                        case 'Word.i':
                            var $147 = self.pred;
                            var $148 = (_a$pred$9 => {
                                var $149 = Word$i$(Word$or$(_a$pred$9, $147));
                                return $149;
                            });
                            var $143 = $148;
                            break;
                        case 'Word.e':
                            var $150 = (_a$pred$7 => {
                                var $151 = Word$e;
                                return $151;
                            });
                            var $143 = $150;
                            break;
                    };
                    var $143 = $143($141);
                    return $143;
                });
                var $140 = $142;
                break;
            case 'Word.i':
                var $152 = self.pred;
                var $153 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $155 = self.pred;
                            var $156 = (_a$pred$9 => {
                                var $157 = Word$i$(Word$or$(_a$pred$9, $155));
                                return $157;
                            });
                            var $154 = $156;
                            break;
                        case 'Word.i':
                            var $158 = self.pred;
                            var $159 = (_a$pred$9 => {
                                var $160 = Word$i$(Word$or$(_a$pred$9, $158));
                                return $160;
                            });
                            var $154 = $159;
                            break;
                        case 'Word.e':
                            var $161 = (_a$pred$7 => {
                                var $162 = Word$e;
                                return $162;
                            });
                            var $154 = $161;
                            break;
                    };
                    var $154 = $154($152);
                    return $154;
                });
                var $140 = $153;
                break;
            case 'Word.e':
                var $163 = (_b$4 => {
                    var $164 = Word$e;
                    return $164;
                });
                var $140 = $163;
                break;
        };
        var $140 = $140(_b$3);
        return $140;
    };
    const Word$or = x0 => x1 => Word$or$(x0, x1);
    const U32$or = a0 => a1 => (a0 | a1);
    const U32$shl = a0 => a1 => ((a0 << a1) >>> 0);
    const Col32$new = a0 => a1 => a2 => a3 => ((0 | a0 | (a1 << 8) | (a2 << 16) | (a3 << 24)));

    function DOM$node$(_tag$1, _props$2, _style$3, _children$4) {
        var $165 = ({
            _: 'DOM.node',
            'tag': _tag$1,
            'props': _props$2,
            'style': _style$3,
            'children': _children$4
        });
        return $165;
    };
    const DOM$node = x0 => x1 => x2 => x3 => DOM$node$(x0, x1, x2, x3);

    function BitsMap$(_A$1) {
        var $166 = null;
        return $166;
    };
    const BitsMap = x0 => BitsMap$(x0);

    function Map$(_V$1) {
        var $167 = null;
        return $167;
    };
    const Map = x0 => Map$(x0);
    const BitsMap$new = ({
        _: 'BitsMap.new'
    });

    function BitsMap$tie$(_val$2, _lft$3, _rgt$4) {
        var $168 = ({
            _: 'BitsMap.tie',
            'val': _val$2,
            'lft': _lft$3,
            'rgt': _rgt$4
        });
        return $168;
    };
    const BitsMap$tie = x0 => x1 => x2 => BitsMap$tie$(x0, x1, x2);

    function Maybe$some$(_value$2) {
        var $169 = ({
            _: 'Maybe.some',
            'value': _value$2
        });
        return $169;
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
                var $171 = self.pred;
                var $172 = (Word$to_bits$($171) + '0');
                var $170 = $172;
                break;
            case 'Word.i':
                var $173 = self.pred;
                var $174 = (Word$to_bits$($173) + '1');
                var $170 = $174;
                break;
            case 'Word.e':
                var $175 = Bits$e;
                var $170 = $175;
                break;
        };
        return $170;
    };
    const Word$to_bits = x0 => Word$to_bits$(x0);
    const U16$to_bits = a0 => (u16_to_bits(a0));

    function String$to_bits$(_str$1) {
        var self = _str$1;
        if (self.length === 0) {
            var $177 = Bits$e;
            var $176 = $177;
        } else {
            var $178 = self.charCodeAt(0);
            var $179 = self.slice(1);
            var $180 = (String$to_bits$($179) + (u16_to_bits($178)));
            var $176 = $180;
        };
        return $176;
    };
    const String$to_bits = x0 => String$to_bits$(x0);

    function Map$from_list$(_xs$2) {
        var self = _xs$2;
        switch (self._) {
            case 'List.cons':
                var $182 = self.head;
                var $183 = self.tail;
                var self = $182;
                switch (self._) {
                    case 'Pair.new':
                        var $185 = self.fst;
                        var $186 = self.snd;
                        var $187 = (bitsmap_set(String$to_bits$($185), $186, Map$from_list$($183), 'set'));
                        var $184 = $187;
                        break;
                };
                var $181 = $184;
                break;
            case 'List.nil':
                var $188 = BitsMap$new;
                var $181 = $188;
                break;
        };
        return $181;
    };
    const Map$from_list = x0 => Map$from_list$(x0);
    const List$nil = ({
        _: 'List.nil'
    });

    function Pair$(_A$1, _B$2) {
        var $189 = null;
        return $189;
    };
    const Pair = x0 => x1 => Pair$(x0, x1);

    function List$cons$(_head$2, _tail$3) {
        var $190 = ({
            _: 'List.cons',
            'head': _head$2,
            'tail': _tail$3
        });
        return $190;
    };
    const List$cons = x0 => x1 => List$cons$(x0, x1);

    function DOM$text$(_value$1) {
        var $191 = ({
            _: 'DOM.text',
            'value': _value$1
        });
        return $191;
    };
    const DOM$text = x0 => DOM$text$(x0);

    function DOM$vbox$(_props$1, _style$2, _value$3) {
        var $192 = ({
            _: 'DOM.vbox',
            'props': _props$1,
            'style': _style$2,
            'value': _value$3
        });
        return $192;
    };
    const DOM$vbox = x0 => x1 => x2 => DOM$vbox$(x0, x1, x2);
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
                    var $193 = _value$3;
                    return $193;
                } else {
                    var $194 = (self - 1n);
                    var $195 = Word$shift_left$($194, Word$shift_left1$(_value$3));
                    return $195;
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
                var $197 = Bool$false;
                var $196 = $197;
                break;
            case 'Cmp.eql':
            case 'Cmp.gtn':
                var $198 = Bool$true;
                var $196 = $198;
                break;
        };
        return $196;
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
                var $200 = self.pred;
                var $201 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $203 = self.pred;
                            var $204 = (_a$pred$10 => {
                                var $205 = Word$cmp$go$(_a$pred$10, $203, _c$4);
                                return $205;
                            });
                            var $202 = $204;
                            break;
                        case 'Word.i':
                            var $206 = self.pred;
                            var $207 = (_a$pred$10 => {
                                var $208 = Word$cmp$go$(_a$pred$10, $206, Cmp$ltn);
                                return $208;
                            });
                            var $202 = $207;
                            break;
                        case 'Word.e':
                            var $209 = (_a$pred$8 => {
                                var $210 = _c$4;
                                return $210;
                            });
                            var $202 = $209;
                            break;
                    };
                    var $202 = $202($200);
                    return $202;
                });
                var $199 = $201;
                break;
            case 'Word.i':
                var $211 = self.pred;
                var $212 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $214 = self.pred;
                            var $215 = (_a$pred$10 => {
                                var $216 = Word$cmp$go$(_a$pred$10, $214, Cmp$gtn);
                                return $216;
                            });
                            var $213 = $215;
                            break;
                        case 'Word.i':
                            var $217 = self.pred;
                            var $218 = (_a$pred$10 => {
                                var $219 = Word$cmp$go$(_a$pred$10, $217, _c$4);
                                return $219;
                            });
                            var $213 = $218;
                            break;
                        case 'Word.e':
                            var $220 = (_a$pred$8 => {
                                var $221 = _c$4;
                                return $221;
                            });
                            var $213 = $220;
                            break;
                    };
                    var $213 = $213($211);
                    return $213;
                });
                var $199 = $212;
                break;
            case 'Word.e':
                var $222 = (_b$5 => {
                    var $223 = _c$4;
                    return $223;
                });
                var $199 = $222;
                break;
        };
        var $199 = $199(_b$3);
        return $199;
    };
    const Word$cmp$go = x0 => x1 => x2 => Word$cmp$go$(x0, x1, x2);
    const Cmp$eql = ({
        _: 'Cmp.eql'
    });

    function Word$cmp$(_a$2, _b$3) {
        var $224 = Word$cmp$go$(_a$2, _b$3, Cmp$eql);
        return $224;
    };
    const Word$cmp = x0 => x1 => Word$cmp$(x0, x1);

    function Word$gte$(_a$2, _b$3) {
        var $225 = Cmp$as_gte$(Word$cmp$(_a$2, _b$3));
        return $225;
    };
    const Word$gte = x0 => x1 => Word$gte$(x0, x1);

    function Word$shift_right1$aux$(_word$2) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $227 = self.pred;
                var $228 = Word$o$(Word$shift_right1$aux$($227));
                var $226 = $228;
                break;
            case 'Word.i':
                var $229 = self.pred;
                var $230 = Word$i$(Word$shift_right1$aux$($229));
                var $226 = $230;
                break;
            case 'Word.e':
                var $231 = Word$o$(Word$e);
                var $226 = $231;
                break;
        };
        return $226;
    };
    const Word$shift_right1$aux = x0 => Word$shift_right1$aux$(x0);

    function Word$shift_right1$(_word$2) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $233 = self.pred;
                var $234 = Word$shift_right1$aux$($233);
                var $232 = $234;
                break;
            case 'Word.i':
                var $235 = self.pred;
                var $236 = Word$shift_right1$aux$($235);
                var $232 = $236;
                break;
            case 'Word.e':
                var $237 = Word$e;
                var $232 = $237;
                break;
        };
        return $232;
    };
    const Word$shift_right1 = x0 => Word$shift_right1$(x0);

    function Word$subber$(_a$2, _b$3, _c$4) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $239 = self.pred;
                var $240 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $242 = self.pred;
                            var $243 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $245 = Word$i$(Word$subber$(_a$pred$10, $242, Bool$true));
                                    var $244 = $245;
                                } else {
                                    var $246 = Word$o$(Word$subber$(_a$pred$10, $242, Bool$false));
                                    var $244 = $246;
                                };
                                return $244;
                            });
                            var $241 = $243;
                            break;
                        case 'Word.i':
                            var $247 = self.pred;
                            var $248 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $250 = Word$o$(Word$subber$(_a$pred$10, $247, Bool$true));
                                    var $249 = $250;
                                } else {
                                    var $251 = Word$i$(Word$subber$(_a$pred$10, $247, Bool$true));
                                    var $249 = $251;
                                };
                                return $249;
                            });
                            var $241 = $248;
                            break;
                        case 'Word.e':
                            var $252 = (_a$pred$8 => {
                                var $253 = Word$e;
                                return $253;
                            });
                            var $241 = $252;
                            break;
                    };
                    var $241 = $241($239);
                    return $241;
                });
                var $238 = $240;
                break;
            case 'Word.i':
                var $254 = self.pred;
                var $255 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $257 = self.pred;
                            var $258 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $260 = Word$o$(Word$subber$(_a$pred$10, $257, Bool$false));
                                    var $259 = $260;
                                } else {
                                    var $261 = Word$i$(Word$subber$(_a$pred$10, $257, Bool$false));
                                    var $259 = $261;
                                };
                                return $259;
                            });
                            var $256 = $258;
                            break;
                        case 'Word.i':
                            var $262 = self.pred;
                            var $263 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $265 = Word$i$(Word$subber$(_a$pred$10, $262, Bool$true));
                                    var $264 = $265;
                                } else {
                                    var $266 = Word$o$(Word$subber$(_a$pred$10, $262, Bool$false));
                                    var $264 = $266;
                                };
                                return $264;
                            });
                            var $256 = $263;
                            break;
                        case 'Word.e':
                            var $267 = (_a$pred$8 => {
                                var $268 = Word$e;
                                return $268;
                            });
                            var $256 = $267;
                            break;
                    };
                    var $256 = $256($254);
                    return $256;
                });
                var $238 = $255;
                break;
            case 'Word.e':
                var $269 = (_b$5 => {
                    var $270 = Word$e;
                    return $270;
                });
                var $238 = $269;
                break;
        };
        var $238 = $238(_b$3);
        return $238;
    };
    const Word$subber = x0 => x1 => x2 => Word$subber$(x0, x1, x2);

    function Word$sub$(_a$2, _b$3) {
        var $271 = Word$subber$(_a$2, _b$3, Bool$false);
        return $271;
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
                    var $272 = Pair$new$(Bool$true, Word$or$(_value$5, _mask$6));
                    var self = $272;
                } else {
                    var $273 = Pair$new$(Bool$false, _value$5);
                    var self = $273;
                };
                switch (self._) {
                    case 'Pair.new':
                        var $274 = self.fst;
                        var $275 = self.snd;
                        var self = _shift$2;
                        if (self === 0n) {
                            var $277 = $275;
                            var $276 = $277;
                        } else {
                            var $278 = (self - 1n);
                            var _new_shift_copy$9 = Word$shift_right1$(_shift_copy$4);
                            var self = $274;
                            if (self) {
                                var $280 = Word$div$go$($278, Word$sub$(_sub_copy$3, _shift_copy$4), _new_shift_copy$9, $275);
                                var $279 = $280;
                            } else {
                                var $281 = Word$div$go$($278, _sub_copy$3, _new_shift_copy$9, $275);
                                var $279 = $281;
                            };
                            var $276 = $279;
                        };
                        return $276;
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
            var $283 = Word$to_zero$(_a$2);
            var $282 = $283;
        } else {
            var _shift$6 = (_a_bits$4 - _b_bits$5 <= 0n ? 0n : _a_bits$4 - _b_bits$5);
            var _shift_copy$7 = Word$shift_left$(_shift$6, _b$3);
            var $284 = Word$div$go$(_shift$6, _a$2, _shift_copy$7, Word$to_zero$(_a$2));
            var $282 = $284;
        };
        return $282;
    };
    const Word$div = x0 => x1 => Word$div$(x0, x1);
    const U32$div = a0 => a1 => ((a0 / a1) >>> 0);

    function Cmp$as_eql$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
            case 'Cmp.gtn':
                var $286 = Bool$false;
                var $285 = $286;
                break;
            case 'Cmp.eql':
                var $287 = Bool$true;
                var $285 = $287;
                break;
        };
        return $285;
    };
    const Cmp$as_eql = x0 => Cmp$as_eql$(x0);

    function Word$eql$(_a$2, _b$3) {
        var $288 = Cmp$as_eql$(Word$cmp$(_a$2, _b$3));
        return $288;
    };
    const Word$eql = x0 => x1 => Word$eql$(x0, x1);
    const U32$eql = a0 => a1 => (a0 === a1);
    const U32$inc = a0 => ((a0 + 1) >>> 0);
    const U32$for = a0 => a1 => a2 => a3 => (u32_for(a0, a1, a2, a3));

    function Word$mod$(_a$2, _b$3) {
        var _q$4 = Word$div$(_a$2, _b$3);
        var $289 = Word$sub$(_a$2, Word$mul$(_b$3, _q$4));
        return $289;
    };
    const Word$mod = x0 => x1 => Word$mod$(x0, x1);
    const U32$mod = a0 => a1 => (a0 % a1);
    const U32$sub = a0 => a1 => ((a0 - a1) >>> 0);
    const U32$add = a0 => a1 => ((a0 + a1) >>> 0);
    const Pos32$new = a0 => a1 => a2 => ((0 | a0 | (a1 << 12) | (a2 << 24)));

    function Word$trim$(_new_size$2, _word$3) {
        var self = _new_size$2;
        if (self === 0n) {
            var $291 = Word$e;
            var $290 = $291;
        } else {
            var $292 = (self - 1n);
            var self = _word$3;
            switch (self._) {
                case 'Word.o':
                    var $294 = self.pred;
                    var $295 = Word$o$(Word$trim$($292, $294));
                    var $293 = $295;
                    break;
                case 'Word.i':
                    var $296 = self.pred;
                    var $297 = Word$i$(Word$trim$($292, $296));
                    var $293 = $297;
                    break;
                case 'Word.e':
                    var $298 = Word$o$(Word$trim$($292, Word$e));
                    var $293 = $298;
                    break;
            };
            var $290 = $293;
        };
        return $290;
    };
    const Word$trim = x0 => x1 => Word$trim$(x0, x1);
    const Unit$new = null;

    function Array$extract_tip$(_arr$2) {
        var self = _arr$2;
        switch (self._) {
            case 'Array.tip':
                var $300 = self.value;
                var $301 = $300;
                var $299 = $301;
                break;
            case 'Array.tie':
                var $302 = Unit$new;
                var $299 = $302;
                break;
        };
        return $299;
    };
    const Array$extract_tip = x0 => Array$extract_tip$(x0);

    function Array$extract_tie$(_arr$3) {
        var self = _arr$3;
        switch (self._) {
            case 'Array.tie':
                var $304 = self.lft;
                var $305 = self.rgt;
                var $306 = Pair$new$($304, $305);
                var $303 = $306;
                break;
            case 'Array.tip':
                var $307 = Unit$new;
                var $303 = $307;
                break;
        };
        return $303;
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
                        var $308 = self.pred;
                        var $309 = Word$foldl$(_w0$4(_nil$3), _w0$4, _w1$5, $308);
                        return $309;
                    case 'Word.i':
                        var $310 = self.pred;
                        var $311 = Word$foldl$(_w1$5(_nil$3), _w0$4, _w1$5, $310);
                        return $311;
                    case 'Word.e':
                        var $312 = _nil$3;
                        return $312;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Word$foldl = x0 => x1 => x2 => x3 => Word$foldl$(x0, x1, x2, x3);

    function Array$mut$(_idx$3, _f$4, _arr$5) {
        var $313 = Word$foldl$((_arr$6 => {
            var $314 = Array$tip$(_f$4(Array$extract_tip$(_arr$6)));
            return $314;
        }), (_rec$7 => _arr$8 => {
            var self = Array$extract_tie$(_arr$8);
            switch (self._) {
                case 'Pair.new':
                    var $316 = self.fst;
                    var $317 = self.snd;
                    var $318 = Array$tie$(_rec$7($316), $317);
                    var $315 = $318;
                    break;
            };
            return $315;
        }), (_rec$7 => _arr$8 => {
            var self = Array$extract_tie$(_arr$8);
            switch (self._) {
                case 'Pair.new':
                    var $320 = self.fst;
                    var $321 = self.snd;
                    var $322 = Array$tie$($320, _rec$7($321));
                    var $319 = $322;
                    break;
            };
            return $319;
        }), _idx$3)(_arr$5);
        return $313;
    };
    const Array$mut = x0 => x1 => x2 => Array$mut$(x0, x1, x2);

    function Array$set$(_idx$3, _val$4, _arr$5) {
        var $323 = Array$mut$(_idx$3, (_x$6 => {
            var $324 = _val$4;
            return $324;
        }), _arr$5);
        return $323;
    };
    const Array$set = x0 => x1 => x2 => Array$set$(x0, x1, x2);
    const Buffer32$set = a0 => a1 => a2 => ((a2[a0] = a1, a2));
    const VoxBox$set_pos = a0 => a1 => a2 => ((a2.buffer[a0 * 2] = a1, a2));
    const VoxBox$set_col = a0 => a1 => a2 => ((a2.buffer[a0 * 2 + 1] = a1, a2));

    function VoxBox$set_length$(_length$1, _img$2) {
        var self = _img$2;
        switch (self._) {
            case 'VoxBox.new':
                var $326 = self.capacity;
                var $327 = self.buffer;
                var $328 = VoxBox$new$(_length$1, $326, $327);
                var $325 = $328;
                break;
        };
        return $325;
    };
    const VoxBox$set_length = x0 => x1 => VoxBox$set_length$(x0, x1);
    const VoxBox$push = a0 => a1 => a2 => ((a2.buffer[a2.length * 2] = a0, a2.buffer[a2.length * 2 + 1] = a1, a2.length++, a2));

    function VoxBox$Draw$square$(_x$1, _y$2, _z$3, _w$4, _h$5, _col$6, _img$7) {
        var _siz$8 = ((_w$4 * _h$5) >>> 0);
        var _w_2$9 = ((_w$4 / 2) >>> 0);
        var _h_2$10 = ((_h$5 / 2) >>> 0);
        var $329 = (() => {
            var $330 = _img$7;
            var $331 = 0;
            var $332 = _siz$8;
            let _pix$12 = $330;
            for (let _idx$11 = $331; _idx$11 < $332; ++_idx$11) {
                var _v_x$13 = (_idx$11 % _w$4);
                var _v_y$14 = ((_idx$11 / _h$5) >>> 0);
                var _p_x$15 = ((((_x$1 + _v_x$13) >>> 0) - _w_2$9) >>> 0);
                var _p_y$16 = ((((_y$2 + _v_y$14) >>> 0) - _h_2$10) >>> 0);
                var _pos$17 = ((0 | _p_x$15 | (_p_y$16 << 12) | (_z$3 << 24)));
                var _col$18 = _col$6(_v_x$13)(_v_y$14);
                var _pix$19 = ((_pix$12.buffer[_pix$12.length * 2] = _pos$17, _pix$12.buffer[_pix$12.length * 2 + 1] = _col$18, _pix$12.length++, _pix$12));
                var $330 = _pix$19;
                _pix$12 = $330;
            };
            return _pix$12;
        })();
        return $329;
    };
    const VoxBox$Draw$square = x0 => x1 => x2 => x3 => x4 => x5 => x6 => VoxBox$Draw$square$(x0, x1, x2, x3, x4, x5, x6);

    function IO$(_A$1) {
        var $333 = null;
        return $333;
    };
    const IO = x0 => IO$(x0);

    function IO$ask$(_query$2, _param$3, _then$4) {
        var $334 = ({
            _: 'IO.ask',
            'query': _query$2,
            'param': _param$3,
            'then': _then$4
        });
        return $334;
    };
    const IO$ask = x0 => x1 => x2 => IO$ask$(x0, x1, x2);

    function IO$bind$(_a$3, _f$4) {
        var self = _a$3;
        switch (self._) {
            case 'IO.end':
                var $336 = self.value;
                var $337 = _f$4($336);
                var $335 = $337;
                break;
            case 'IO.ask':
                var $338 = self.query;
                var $339 = self.param;
                var $340 = self.then;
                var $341 = IO$ask$($338, $339, (_x$8 => {
                    var $342 = IO$bind$($340(_x$8), _f$4);
                    return $342;
                }));
                var $335 = $341;
                break;
        };
        return $335;
    };
    const IO$bind = x0 => x1 => IO$bind$(x0, x1);

    function IO$end$(_value$2) {
        var $343 = ({
            _: 'IO.end',
            'value': _value$2
        });
        return $343;
    };
    const IO$end = x0 => IO$end$(x0);

    function IO$monad$(_new$2) {
        var $344 = _new$2(IO$bind)(IO$end);
        return $344;
    };
    const IO$monad = x0 => IO$monad$(x0);

    function Dynamic$new$(_value$2) {
        var $345 = ({
            _: 'Dynamic.new',
            'value': _value$2
        });
        return $345;
    };
    const Dynamic$new = x0 => Dynamic$new$(x0);
    const App$pass = IO$monad$((_m$bind$1 => _m$pure$2 => {
        var $346 = _m$pure$2;
        return $346;
    }))(Dynamic$new$(Unit$new));
    const U16$eql = a0 => a1 => (a0 === a1);

    function App$store$(_value$2) {
        var $347 = IO$monad$((_m$bind$3 => _m$pure$4 => {
            var $348 = _m$pure$4;
            return $348;
        }))(Dynamic$new$(_value$2));
        return $347;
    };
    const App$store = x0 => App$store$(x0);

    function IO$prompt$(_text$1) {
        var $349 = IO$ask$("get_line", _text$1, (_line$2 => {
            var $350 = IO$end$(_line$2);
            return $350;
        }));
        return $349;
    };
    const IO$prompt = x0 => IO$prompt$(x0);

    function IO$put_string$(_text$1) {
        var $351 = IO$ask$("put_string", _text$1, (_skip$2 => {
            var $352 = IO$end$(Unit$new);
            return $352;
        }));
        return $351;
    };
    const IO$put_string = x0 => IO$put_string$(x0);

    function String$cons$(_head$1, _tail$2) {
        var $353 = (String.fromCharCode(_head$1) + _tail$2);
        return $353;
    };
    const String$cons = x0 => x1 => String$cons$(x0, x1);
    const String$concat = a0 => a1 => (a0 + a1);

    function IO$print$(_text$1) {
        var $354 = IO$put_string$((_text$1 + "\u{a}"));
        return $354;
    };
    const IO$print = x0 => IO$print$(x0);

    function App$new$(_init$2, _draw$3, _when$4) {
        var $355 = ({
            _: 'App.new',
            'init': _init$2,
            'draw': _draw$3,
            'when': _when$4
        });
        return $355;
    };
    const App$new = x0 => x1 => x2 => App$new$(x0, x1, x2);
    const Web$Demo = (() => {
        var _vbox$1 = VoxBox$alloc_capacity$(65536);
        var _init$2 = Pair$new$(128, 128);
        var _draw$3 = (_state$3 => {
            var _p_x$4 = Pair$fst$(_state$3);
            var _p_y$5 = Pair$snd$(_state$3);
            var _col$6 = (_x$6 => _y$7 => {
                var $358 = ((0 | 200 | (200 << 8) | (255 << 16) | (255 << 24)));
                return $358;
            });
            var $357 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$nil), List$cons$(DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$nil), List$cons$(DOM$text$("Kind Demo App"), List$nil)), List$cons$(DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$nil), List$cons$(DOM$text$("- Press W/A/S/D to move"), List$nil)), List$cons$(DOM$node$("div", Map$from_list$(List$cons$(Pair$new$("id", "play_game"), List$nil)), Map$from_list$(List$cons$(Pair$new$("color", "blue"), List$cons$(Pair$new$("text-decoration", "underline"), List$nil))), List$cons$(DOM$text$("- Click here to play a game"), List$nil)), List$cons$(DOM$vbox$(Map$from_list$(List$nil), Map$from_list$(List$nil), VoxBox$Draw$square$(_p_x$4, _p_y$5, 128, 16, 16, _col$6, _vbox$1)), List$nil)))));
            return $357;
        });
        var _when$4 = (_event$4 => _state$5 => {
            var self = _event$4;
            switch (self._) {
                case 'App.Event.key_down':
                    var $360 = self.code;
                    var self = _state$5;
                    switch (self._) {
                        case 'Pair.new':
                            var $362 = self.fst;
                            var $363 = self.snd;
                            var self = ($360 === 65);
                            if (self) {
                                var $365 = App$store$(Pair$new$((($362 - 16) >>> 0), $363));
                                var $364 = $365;
                            } else {
                                var self = ($360 === 68);
                                if (self) {
                                    var $367 = App$store$(Pair$new$((($362 + 16) >>> 0), $363));
                                    var $366 = $367;
                                } else {
                                    var self = ($360 === 87);
                                    if (self) {
                                        var $369 = App$store$(Pair$new$($362, (($363 - 16) >>> 0)));
                                        var $368 = $369;
                                    } else {
                                        var self = ($360 === 83);
                                        if (self) {
                                            var $371 = App$store$(Pair$new$($362, (($363 + 16) >>> 0)));
                                            var $370 = $371;
                                        } else {
                                            var $372 = App$pass;
                                            var $370 = $372;
                                        };
                                        var $368 = $370;
                                    };
                                    var $366 = $368;
                                };
                                var $364 = $366;
                            };
                            var $361 = $364;
                            break;
                    };
                    var $359 = $361;
                    break;
                case 'App.Event.init':
                case 'App.Event.tick':
                case 'App.Event.mouse_down':
                case 'App.Event.mouse_up':
                case 'App.Event.key_up':
                case 'App.Event.post':
                case 'App.Event.mouse_over':
                case 'App.Event.mouse_out':
                case 'App.Event.resize':
                    var $373 = App$pass;
                    var $359 = $373;
                    break;
                case 'App.Event.mouse_click':
                    var $374 = IO$monad$((_m$bind$9 => _m$pure$10 => {
                        var $375 = _m$bind$9;
                        return $375;
                    }))(IO$prompt$("What is your name?"))((_line$9 => {
                        var $376 = IO$monad$((_m$bind$10 => _m$pure$11 => {
                            var $377 = _m$bind$10;
                            return $377;
                        }))(IO$print$(("You\'re breath-taking, " + (_line$9 + "!"))))((_$10 => {
                            var $378 = App$pass;
                            return $378;
                        }));
                        return $376;
                    }));
                    var $359 = $374;
                    break;
            };
            return $359;
        });
        var $356 = App$new$(_init$2, _draw$3, _when$4);
        return $356;
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
        'Pair.new': Pair$new,
        'Pair.fst': Pair$fst,
        'Pair.snd': Pair$snd,
        'Word.or': Word$or,
        'U32.or': U32$or,
        'U32.shl': U32$shl,
        'Col32.new': Col32$new,
        'DOM.node': DOM$node,
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
        'List.cons': List$cons,
        'DOM.text': DOM$text,
        'DOM.vbox': DOM$vbox,
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
        'Word.shift_right1.aux': Word$shift_right1$aux,
        'Word.shift_right1': Word$shift_right1,
        'Word.subber': Word$subber,
        'Word.sub': Word$sub,
        'Word.div.go': Word$div$go,
        'Word.div': Word$div,
        'U32.div': U32$div,
        'Cmp.as_eql': Cmp$as_eql,
        'Word.eql': Word$eql,
        'U32.eql': U32$eql,
        'U32.inc': U32$inc,
        'U32.for': U32$for,
        'Word.mod': Word$mod,
        'U32.mod': U32$mod,
        'U32.sub': U32$sub,
        'U32.add': U32$add,
        'Pos32.new': Pos32$new,
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
        'VoxBox.Draw.square': VoxBox$Draw$square,
        'IO': IO,
        'IO.ask': IO$ask,
        'IO.bind': IO$bind,
        'IO.end': IO$end,
        'IO.monad': IO$monad,
        'Dynamic.new': Dynamic$new,
        'App.pass': App$pass,
        'U16.eql': U16$eql,
        'App.store': App$store,
        'IO.prompt': IO$prompt,
        'IO.put_string': IO$put_string,
        'String.cons': String$cons,
        'String.concat': String$concat,
        'IO.print': IO$print,
        'App.new': App$new,
        'Web.Demo': Web$Demo,
    };
})();