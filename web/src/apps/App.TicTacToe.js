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

    function Word$shift_left$one$go$(_word$2, _prev$3) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $60 = self.pred;
                var self = _prev$3;
                if (self) {
                    var $62 = Word$i$(Word$shift_left$one$go$($60, Bool$false));
                    var $61 = $62;
                } else {
                    var $63 = Word$o$(Word$shift_left$one$go$($60, Bool$false));
                    var $61 = $63;
                };
                var $59 = $61;
                break;
            case 'Word.i':
                var $64 = self.pred;
                var self = _prev$3;
                if (self) {
                    var $66 = Word$i$(Word$shift_left$one$go$($64, Bool$true));
                    var $65 = $66;
                } else {
                    var $67 = Word$o$(Word$shift_left$one$go$($64, Bool$true));
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
    const Word$shift_left$one$go = x0 => x1 => Word$shift_left$one$go$(x0, x1);

    function Word$shift_left$one$(_word$2) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $70 = self.pred;
                var $71 = Word$o$(Word$shift_left$one$go$($70, Bool$false));
                var $69 = $71;
                break;
            case 'Word.i':
                var $72 = self.pred;
                var $73 = Word$o$(Word$shift_left$one$go$($72, Bool$true));
                var $69 = $73;
                break;
            case 'Word.e':
                var $74 = Word$e;
                var $69 = $74;
                break;
        };
        return $69;
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
                    var $75 = _value$3;
                    return $75;
                } else {
                    var $76 = (self - 1n);
                    var $77 = Word$shift_left$($76, Word$shift_left$one$(_value$3));
                    return $77;
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
                var $79 = self.pred;
                var $80 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $82 = self.pred;
                            var $83 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $85 = Word$i$(Word$adder$(_a$pred$10, $82, Bool$false));
                                    var $84 = $85;
                                } else {
                                    var $86 = Word$o$(Word$adder$(_a$pred$10, $82, Bool$false));
                                    var $84 = $86;
                                };
                                return $84;
                            });
                            var $81 = $83;
                            break;
                        case 'Word.i':
                            var $87 = self.pred;
                            var $88 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $90 = Word$o$(Word$adder$(_a$pred$10, $87, Bool$true));
                                    var $89 = $90;
                                } else {
                                    var $91 = Word$i$(Word$adder$(_a$pred$10, $87, Bool$false));
                                    var $89 = $91;
                                };
                                return $89;
                            });
                            var $81 = $88;
                            break;
                        case 'Word.e':
                            var $92 = (_a$pred$8 => {
                                var $93 = Word$e;
                                return $93;
                            });
                            var $81 = $92;
                            break;
                    };
                    var $81 = $81($79);
                    return $81;
                });
                var $78 = $80;
                break;
            case 'Word.i':
                var $94 = self.pred;
                var $95 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
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
                            var $96 = $98;
                            break;
                        case 'Word.i':
                            var $102 = self.pred;
                            var $103 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $105 = Word$i$(Word$adder$(_a$pred$10, $102, Bool$true));
                                    var $104 = $105;
                                } else {
                                    var $106 = Word$o$(Word$adder$(_a$pred$10, $102, Bool$true));
                                    var $104 = $106;
                                };
                                return $104;
                            });
                            var $96 = $103;
                            break;
                        case 'Word.e':
                            var $107 = (_a$pred$8 => {
                                var $108 = Word$e;
                                return $108;
                            });
                            var $96 = $107;
                            break;
                    };
                    var $96 = $96($94);
                    return $96;
                });
                var $78 = $95;
                break;
            case 'Word.e':
                var $109 = (_b$5 => {
                    var $110 = Word$e;
                    return $110;
                });
                var $78 = $109;
                break;
        };
        var $78 = $78(_b$3);
        return $78;
    };
    const Word$adder = x0 => x1 => x2 => Word$adder$(x0, x1, x2);

    function Word$add$(_a$2, _b$3) {
        var $111 = Word$adder$(_a$2, _b$3, Bool$false);
        return $111;
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
                        var $112 = self.pred;
                        var $113 = Word$mul$go$($112, Word$shift_left$(1n, _b$4), _acc$5);
                        return $113;
                    case 'Word.i':
                        var $114 = self.pred;
                        var $115 = Word$mul$go$($114, Word$shift_left$(1n, _b$4), Word$add$(_b$4, _acc$5));
                        return $115;
                    case 'Word.e':
                        var $116 = _acc$5;
                        return $116;
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
                var $118 = self.pred;
                var $119 = Word$o$(Word$to_zero$($118));
                var $117 = $119;
                break;
            case 'Word.i':
                var $120 = self.pred;
                var $121 = Word$o$(Word$to_zero$($120));
                var $117 = $121;
                break;
            case 'Word.e':
                var $122 = Word$e;
                var $117 = $122;
                break;
        };
        return $117;
    };
    const Word$to_zero = x0 => Word$to_zero$(x0);

    function Word$mul$(_a$2, _b$3) {
        var $123 = Word$mul$go$(_a$2, _b$3, Word$to_zero$(_a$2));
        return $123;
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
                    var $124 = _x$4;
                    return $124;
                } else {
                    var $125 = (self - 1n);
                    var $126 = Nat$apply$($125, _f$3, _f$3(_x$4));
                    return $126;
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
                var $128 = self.pred;
                var $129 = Word$i$($128);
                var $127 = $129;
                break;
            case 'Word.i':
                var $130 = self.pred;
                var $131 = Word$o$(Word$inc$($130));
                var $127 = $131;
                break;
            case 'Word.e':
                var $132 = Word$e;
                var $127 = $132;
                break;
        };
        return $127;
    };
    const Word$inc = x0 => Word$inc$(x0);

    function Nat$to_word$(_size$1, _n$2) {
        var $133 = Nat$apply$(_n$2, Word$inc, Word$zero$(_size$1));
        return $133;
    };
    const Nat$to_word = x0 => x1 => Nat$to_word$(x0, x1);
    const Nat$to_u32 = a0 => (Number(a0) >>> 0);

    function VoxBox$new$(_length$1, _capacity$2, _buffer$3) {
        var $134 = ({
            _: 'VoxBox.new',
            'length': _length$1,
            'capacity': _capacity$2,
            'buffer': _buffer$3
        });
        return $134;
    };
    const VoxBox$new = x0 => x1 => x2 => VoxBox$new$(x0, x1, x2);

    function VoxBox$alloc_capacity$(_capacity$1) {
        var _buffer$2 = (new Uint32Array(2 ** Number(U32$bit_length$(((2 * _capacity$1) >>> 0)))));
        var $135 = VoxBox$new$(0, _capacity$1, _buffer$2);
        return $135;
    };
    const VoxBox$alloc_capacity = x0 => VoxBox$alloc_capacity$(x0);

    function App$Store$new$(_local$2, _global$3) {
        var $136 = ({
            _: 'App.Store.new',
            'local': _local$2,
            'global': _global$3
        });
        return $136;
    };
    const App$Store$new = x0 => x1 => App$Store$new$(x0, x1);

    function Pair$new$(_fst$3, _snd$4) {
        var $137 = ({
            _: 'Pair.new',
            'fst': _fst$3,
            'snd': _snd$4
        });
        return $137;
    };
    const Pair$new = x0 => x1 => Pair$new$(x0, x1);
    const App$State$new = Pair$new$(null, null);
    const App$TicTacToe$State = App$State$new;
    const App$TicTacToe$State$local$new = ({
        _: 'App.TicTacToe.State.local.new'
    });

    function App$TicTacToe$State$global$new$(_board$1) {
        var $138 = ({
            _: 'App.TicTacToe.State.global.new',
            'board': _board$1
        });
        return $138;
    };
    const App$TicTacToe$State$global$new = x0 => App$TicTacToe$State$global$new$(x0);

    function Vector$(_A$1, _size$2) {
        var $139 = null;
        return $139;
    };
    const Vector = x0 => x1 => Vector$(x0, x1);
    const Vector$nil = ({
        _: 'Vector.nil'
    });

    function Vector$ext$(_head$3, _tail$4) {
        var $140 = ({
            _: 'Vector.ext',
            'head': _head$3,
            'tail': _tail$4
        });
        return $140;
    };
    const Vector$ext = x0 => x1 => Vector$ext$(x0, x1);

    function Vector$fill$(_A$1, _v$2, _size$3) {
        var self = _size$3;
        if (self === 0n) {
            var $142 = Vector$nil;
            var $141 = $142;
        } else {
            var $143 = (self - 1n);
            var _rec$5 = Vector$fill$(null, _v$2, $143);
            var $144 = Vector$ext$(_v$2, _rec$5);
            var $141 = $144;
        };
        return $141;
    };
    const Vector$fill = x0 => x1 => x2 => Vector$fill$(x0, x1, x2);
    const App$TicTacToe$Entity$Empty = ({
        _: 'App.TicTacToe.Entity.Empty'
    });
    const App$TicTacToe$init = App$Store$new$(App$TicTacToe$State$local$new, App$TicTacToe$State$global$new$(Vector$fill$(null, App$TicTacToe$Entity$Empty, 9n)));
    const Nat$ltn = a0 => a1 => (a0 < a1);
    const Nat$sub = a0 => a1 => (a0 - a1 <= 0n ? 0n : a0 - a1);

    function Cmp$as_gte$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
                var $146 = Bool$false;
                var $145 = $146;
                break;
            case 'Cmp.eql':
            case 'Cmp.gtn':
                var $147 = Bool$true;
                var $145 = $147;
                break;
        };
        return $145;
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
                var $149 = self.pred;
                var $150 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $152 = self.pred;
                            var $153 = (_a$pred$10 => {
                                var $154 = Word$cmp$go$(_a$pred$10, $152, _c$4);
                                return $154;
                            });
                            var $151 = $153;
                            break;
                        case 'Word.i':
                            var $155 = self.pred;
                            var $156 = (_a$pred$10 => {
                                var $157 = Word$cmp$go$(_a$pred$10, $155, Cmp$ltn);
                                return $157;
                            });
                            var $151 = $156;
                            break;
                        case 'Word.e':
                            var $158 = (_a$pred$8 => {
                                var $159 = _c$4;
                                return $159;
                            });
                            var $151 = $158;
                            break;
                    };
                    var $151 = $151($149);
                    return $151;
                });
                var $148 = $150;
                break;
            case 'Word.i':
                var $160 = self.pred;
                var $161 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $163 = self.pred;
                            var $164 = (_a$pred$10 => {
                                var $165 = Word$cmp$go$(_a$pred$10, $163, Cmp$gtn);
                                return $165;
                            });
                            var $162 = $164;
                            break;
                        case 'Word.i':
                            var $166 = self.pred;
                            var $167 = (_a$pred$10 => {
                                var $168 = Word$cmp$go$(_a$pred$10, $166, _c$4);
                                return $168;
                            });
                            var $162 = $167;
                            break;
                        case 'Word.e':
                            var $169 = (_a$pred$8 => {
                                var $170 = _c$4;
                                return $170;
                            });
                            var $162 = $169;
                            break;
                    };
                    var $162 = $162($160);
                    return $162;
                });
                var $148 = $161;
                break;
            case 'Word.e':
                var $171 = (_b$5 => {
                    var $172 = _c$4;
                    return $172;
                });
                var $148 = $171;
                break;
        };
        var $148 = $148(_b$3);
        return $148;
    };
    const Word$cmp$go = x0 => x1 => x2 => Word$cmp$go$(x0, x1, x2);
    const Cmp$eql = ({
        _: 'Cmp.eql'
    });

    function Word$cmp$(_a$2, _b$3) {
        var $173 = Word$cmp$go$(_a$2, _b$3, Cmp$eql);
        return $173;
    };
    const Word$cmp = x0 => x1 => Word$cmp$(x0, x1);

    function Word$gte$(_a$2, _b$3) {
        var $174 = Cmp$as_gte$(Word$cmp$(_a$2, _b$3));
        return $174;
    };
    const Word$gte = x0 => x1 => Word$gte$(x0, x1);

    function Pair$(_A$1, _B$2) {
        var $175 = null;
        return $175;
    };
    const Pair = x0 => x1 => Pair$(x0, x1);

    function Word$or$(_a$2, _b$3) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $177 = self.pred;
                var $178 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $180 = self.pred;
                            var $181 = (_a$pred$9 => {
                                var $182 = Word$o$(Word$or$(_a$pred$9, $180));
                                return $182;
                            });
                            var $179 = $181;
                            break;
                        case 'Word.i':
                            var $183 = self.pred;
                            var $184 = (_a$pred$9 => {
                                var $185 = Word$i$(Word$or$(_a$pred$9, $183));
                                return $185;
                            });
                            var $179 = $184;
                            break;
                        case 'Word.e':
                            var $186 = (_a$pred$7 => {
                                var $187 = Word$e;
                                return $187;
                            });
                            var $179 = $186;
                            break;
                    };
                    var $179 = $179($177);
                    return $179;
                });
                var $176 = $178;
                break;
            case 'Word.i':
                var $188 = self.pred;
                var $189 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $191 = self.pred;
                            var $192 = (_a$pred$9 => {
                                var $193 = Word$i$(Word$or$(_a$pred$9, $191));
                                return $193;
                            });
                            var $190 = $192;
                            break;
                        case 'Word.i':
                            var $194 = self.pred;
                            var $195 = (_a$pred$9 => {
                                var $196 = Word$i$(Word$or$(_a$pred$9, $194));
                                return $196;
                            });
                            var $190 = $195;
                            break;
                        case 'Word.e':
                            var $197 = (_a$pred$7 => {
                                var $198 = Word$e;
                                return $198;
                            });
                            var $190 = $197;
                            break;
                    };
                    var $190 = $190($188);
                    return $190;
                });
                var $176 = $189;
                break;
            case 'Word.e':
                var $199 = (_b$4 => {
                    var $200 = Word$e;
                    return $200;
                });
                var $176 = $199;
                break;
        };
        var $176 = $176(_b$3);
        return $176;
    };
    const Word$or = x0 => x1 => Word$or$(x0, x1);

    function Word$shift_right$one$go$(_word$2) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $202 = self.pred;
                var $203 = Word$o$(Word$shift_right$one$go$($202));
                var $201 = $203;
                break;
            case 'Word.i':
                var $204 = self.pred;
                var $205 = Word$i$(Word$shift_right$one$go$($204));
                var $201 = $205;
                break;
            case 'Word.e':
                var $206 = Word$o$(Word$e);
                var $201 = $206;
                break;
        };
        return $201;
    };
    const Word$shift_right$one$go = x0 => Word$shift_right$one$go$(x0);

    function Word$shift_right$one$(_word$2) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $208 = self.pred;
                var $209 = Word$shift_right$one$go$($208);
                var $207 = $209;
                break;
            case 'Word.i':
                var $210 = self.pred;
                var $211 = Word$shift_right$one$go$($210);
                var $207 = $211;
                break;
            case 'Word.e':
                var $212 = Word$e;
                var $207 = $212;
                break;
        };
        return $207;
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
                    var $213 = _value$3;
                    return $213;
                } else {
                    var $214 = (self - 1n);
                    var $215 = Word$shift_right$($214, Word$shift_right$one$(_value$3));
                    return $215;
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
                            var _new_shift_copy$9 = Word$shift_right$(1n, _shift_copy$4);
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
    const U32$add = a0 => a1 => ((a0 + a1) >>> 0);
    const U32$sub = a0 => a1 => ((a0 - a1) >>> 0);

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

    function Word$trim$(_new_size$2, _word$3) {
        var self = _new_size$2;
        if (self === 0n) {
            var $268 = Word$e;
            var $267 = $268;
        } else {
            var $269 = (self - 1n);
            var self = _word$3;
            switch (self._) {
                case 'Word.o':
                    var $271 = self.pred;
                    var $272 = Word$o$(Word$trim$($269, $271));
                    var $270 = $272;
                    break;
                case 'Word.i':
                    var $273 = self.pred;
                    var $274 = Word$i$(Word$trim$($269, $273));
                    var $270 = $274;
                    break;
                case 'Word.e':
                    var $275 = Word$o$(Word$trim$($269, Word$e));
                    var $270 = $275;
                    break;
            };
            var $267 = $270;
        };
        return $267;
    };
    const Word$trim = x0 => x1 => Word$trim$(x0, x1);
    const Unit$new = null;

    function Array$extract_tip$(_arr$2) {
        var self = _arr$2;
        switch (self._) {
            case 'Array.tip':
                var $277 = self.value;
                var $278 = $277;
                var $276 = $278;
                break;
            case 'Array.tie':
                var $279 = Unit$new;
                var $276 = $279;
                break;
        };
        return $276;
    };
    const Array$extract_tip = x0 => Array$extract_tip$(x0);

    function Array$extract_tie$(_arr$3) {
        var self = _arr$3;
        switch (self._) {
            case 'Array.tie':
                var $281 = self.lft;
                var $282 = self.rgt;
                var $283 = Pair$new$($281, $282);
                var $280 = $283;
                break;
            case 'Array.tip':
                var $284 = Unit$new;
                var $280 = $284;
                break;
        };
        return $280;
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
                        var $285 = self.pred;
                        var $286 = Word$foldl$(_w0$4(_nil$3), _w0$4, _w1$5, $285);
                        return $286;
                    case 'Word.i':
                        var $287 = self.pred;
                        var $288 = Word$foldl$(_w1$5(_nil$3), _w0$4, _w1$5, $287);
                        return $288;
                    case 'Word.e':
                        var $289 = _nil$3;
                        return $289;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Word$foldl = x0 => x1 => x2 => x3 => Word$foldl$(x0, x1, x2, x3);

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

    function VoxBox$set_length$(_length$1, _img$2) {
        var self = _img$2;
        switch (self._) {
            case 'VoxBox.new':
                var $303 = self.capacity;
                var $304 = self.buffer;
                var $305 = VoxBox$new$(_length$1, $303, $304);
                var $302 = $305;
                break;
        };
        return $302;
    };
    const VoxBox$set_length = x0 => x1 => VoxBox$set_length$(x0, x1);
    const VoxBox$push = a0 => a1 => a2 => ((a2.buffer[a2.length * 2] = a0, a2.buffer[a2.length * 2 + 1] = a1, a2.length++, a2));
    const U32$or = a0 => a1 => (a0 | a1);

    function Word$fold$(_nil$3, _w0$4, _w1$5, _word$6) {
        var self = _word$6;
        switch (self._) {
            case 'Word.o':
                var $307 = self.pred;
                var $308 = _w0$4(Word$fold$(_nil$3, _w0$4, _w1$5, $307));
                var $306 = $308;
                break;
            case 'Word.i':
                var $309 = self.pred;
                var $310 = _w1$5(Word$fold$(_nil$3, _w0$4, _w1$5, $309));
                var $306 = $310;
                break;
            case 'Word.e':
                var $311 = _nil$3;
                var $306 = $311;
                break;
        };
        return $306;
    };
    const Word$fold = x0 => x1 => x2 => x3 => Word$fold$(x0, x1, x2, x3);
    const Nat$add = a0 => a1 => (a0 + a1);
    const Nat$mul = a0 => a1 => (a0 * a1);

    function Word$to_nat$(_word$2) {
        var $312 = Word$fold$(0n, a1 => (2n * a1), (_x$4 => {
            var $313 = Nat$succ$((2n * _x$4));
            return $313;
        }), _word$2);
        return $312;
    };
    const Word$to_nat = x0 => Word$to_nat$(x0);

    function Word$shl$(_n$2, _value$3) {
        var _n_nat$4 = Word$to_nat$(_n$2);
        var $314 = Word$shift_left$(_n_nat$4, _value$3);
        return $314;
    };
    const Word$shl = x0 => x1 => Word$shl$(x0, x1);
    const U32$shl = a0 => a1 => ((a0 << a1) >>> 0);
    const Pos32$new = a0 => a1 => a2 => ((0 | a0 | (a1 << 12) | (a2 << 24)));

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
                var $317 = _img$12;
                var $318 = 0;
                var $319 = _rad$4;
                let _img$27 = $317;
                for (let _i$26 = $318; _i$26 < $319; ++_i$26) {
                    var _px$28 = _v1x$16;
                    var _py$29 = ((_v1y$17 + _i$26) >>> 0);
                    var $317 = ((_img$27.buffer[_img$27.length * 2] = ((0 | _px$28 | (_py$29 << 12) | (_cz$3 << 24))), _img$27.buffer[_img$27.length * 2 + 1] = _col$5, _img$27.length++, _img$27));
                    _img$27 = $317;
                };
                return _img$27;
            })();
            var $316 = _img$26;
            var _img$26 = $316;
        } else {
            var $320 = _img$12;
            var _img$26 = $320;
        };
        var self = _draw_d$9;
        if (self) {
            var _img$27 = (() => {
                var $322 = _img$26;
                var $323 = 0;
                var $324 = _rad$4;
                let _img$28 = $322;
                for (let _i$27 = $323; _i$27 < $324; ++_i$27) {
                    var _px$29 = _v3x$20;
                    var _py$30 = ((_v3y$21 + _i$27) >>> 0);
                    var $322 = ((_img$28.buffer[_img$28.length * 2] = ((0 | _px$29 | (_py$30 << 12) | (_cz$3 << 24))), _img$28.buffer[_img$28.length * 2 + 1] = _col$5, _img$28.length++, _img$28));
                    _img$28 = $322;
                };
                return _img$28;
            })();
            var $321 = _img$27;
            var _img$27 = $321;
        } else {
            var $325 = _img$26;
            var _img$27 = $325;
        };
        var self = _draw_b$7;
        if (self) {
            var _img$28 = (() => {
                var $327 = _img$27;
                var $328 = 0;
                var $329 = _rad$4;
                let _img$29 = $327;
                for (let _i$28 = $328; _i$28 < $329; ++_i$28) {
                    var _px$30 = ((_v2x$18 + _i$28) >>> 0);
                    var _py$31 = ((_v2y$19 + ((_i$28 / 2) >>> 0)) >>> 0);
                    var $327 = ((_img$29.buffer[_img$29.length * 2] = ((0 | _px$30 | (_py$31 << 12) | (_cz$3 << 24))), _img$29.buffer[_img$29.length * 2 + 1] = _col$5, _img$29.length++, _img$29));
                    _img$29 = $327;
                };
                return _img$29;
            })();
            var $326 = _img$28;
            var _img$28 = $326;
        } else {
            var $330 = _img$27;
            var _img$28 = $330;
        };
        var self = _draw_c$8;
        if (self) {
            var _img$29 = (() => {
                var $332 = _img$28;
                var $333 = 0;
                var $334 = _rad$4;
                let _img$30 = $332;
                for (let _i$29 = $333; _i$29 < $334; ++_i$29) {
                    var _px$31 = ((_v2x$18 - _i$29) >>> 0);
                    var _py$32 = ((_v2y$19 + ((_i$29 / 2) >>> 0)) >>> 0);
                    var $332 = ((_img$30.buffer[_img$30.length * 2] = ((0 | _px$31 | (_py$32 << 12) | (_cz$3 << 24))), _img$30.buffer[_img$30.length * 2 + 1] = _col$5, _img$30.length++, _img$30));
                    _img$30 = $332;
                };
                return _img$30;
            })();
            var $331 = _img$29;
            var _img$29 = $331;
        } else {
            var $335 = _img$28;
            var _img$29 = $335;
        };
        var self = _draw_f$11;
        if (self) {
            var _img$30 = (() => {
                var $337 = _img$29;
                var $338 = 0;
                var $339 = _rad$4;
                let _img$31 = $337;
                for (let _i$30 = $338; _i$30 < $339; ++_i$30) {
                    var _px$32 = ((((_v0x$14 - _i$30) >>> 0) - 1) >>> 0);
                    var _py$33 = ((_v0y$15 + ((_i$30 / 2) >>> 0)) >>> 0);
                    var $337 = ((_img$31.buffer[_img$31.length * 2] = ((0 | _px$32 | (_py$33 << 12) | (_cz$3 << 24))), _img$31.buffer[_img$31.length * 2 + 1] = _col$5, _img$31.length++, _img$31));
                    _img$31 = $337;
                };
                return _img$31;
            })();
            var $336 = _img$30;
            var _img$30 = $336;
        } else {
            var $340 = _img$29;
            var _img$30 = $340;
        };
        var self = _draw_e$10;
        if (self) {
            var _img$31 = (() => {
                var $342 = _img$30;
                var $343 = 0;
                var $344 = _rad$4;
                let _img$32 = $342;
                for (let _i$31 = $343; _i$31 < $344; ++_i$31) {
                    var _px$33 = ((((_v4x$22 + _i$31) >>> 0) + 1) >>> 0);
                    var _py$34 = ((_v4y$23 + ((_i$31 / 2) >>> 0)) >>> 0);
                    var $342 = ((_img$32.buffer[_img$32.length * 2] = ((0 | _px$33 | (_py$34 << 12) | (_cz$3 << 24))), _img$32.buffer[_img$32.length * 2 + 1] = _col$5, _img$32.length++, _img$32));
                    _img$32 = $342;
                };
                return _img$32;
            })();
            var $341 = _img$31;
            var _img$31 = $341;
        } else {
            var $345 = _img$30;
            var _img$31 = $345;
        };
        var $315 = _img$31;
        return $315;
    };
    const VoxBox$Draw$deresagon = x0 => x1 => x2 => x3 => x4 => x5 => x6 => x7 => x8 => x9 => x10 => x11 => VoxBox$Draw$deresagon$(x0, x1, x2, x3, x4, x5, x6, x7, x8, x9, x10, x11);
    const U32$from_nat = a0 => (Number(a0) >>> 0);
    const Col32$new = a0 => a1 => a2 => a3 => ((0 | a0 | (a1 << 8) | (a2 << 16) | (a3 << 24)));

    function DOM$vbox$(_props$1, _style$2, _value$3) {
        var $346 = ({
            _: 'DOM.vbox',
            'props': _props$1,
            'style': _style$2,
            'value': _value$3
        });
        return $346;
    };
    const DOM$vbox = x0 => x1 => x2 => DOM$vbox$(x0, x1, x2);

    function BitsMap$(_A$1) {
        var $347 = null;
        return $347;
    };
    const BitsMap = x0 => BitsMap$(x0);

    function Map$(_V$1) {
        var $348 = null;
        return $348;
    };
    const Map = x0 => Map$(x0);
    const BitsMap$new = ({
        _: 'BitsMap.new'
    });

    function BitsMap$tie$(_val$2, _lft$3, _rgt$4) {
        var $349 = ({
            _: 'BitsMap.tie',
            'val': _val$2,
            'lft': _lft$3,
            'rgt': _rgt$4
        });
        return $349;
    };
    const BitsMap$tie = x0 => x1 => x2 => BitsMap$tie$(x0, x1, x2);

    function Maybe$some$(_value$2) {
        var $350 = ({
            _: 'Maybe.some',
            'value': _value$2
        });
        return $350;
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
                var $352 = self.pred;
                var $353 = (Word$to_bits$($352) + '0');
                var $351 = $353;
                break;
            case 'Word.i':
                var $354 = self.pred;
                var $355 = (Word$to_bits$($354) + '1');
                var $351 = $355;
                break;
            case 'Word.e':
                var $356 = Bits$e;
                var $351 = $356;
                break;
        };
        return $351;
    };
    const Word$to_bits = x0 => Word$to_bits$(x0);
    const U16$to_bits = a0 => (u16_to_bits(a0));

    function String$to_bits$(_str$1) {
        var self = _str$1;
        if (self.length === 0) {
            var $358 = Bits$e;
            var $357 = $358;
        } else {
            var $359 = self.charCodeAt(0);
            var $360 = self.slice(1);
            var $361 = (String$to_bits$($360) + (u16_to_bits($359)));
            var $357 = $361;
        };
        return $357;
    };
    const String$to_bits = x0 => String$to_bits$(x0);

    function Map$from_list$(_xs$2) {
        var self = _xs$2;
        switch (self._) {
            case 'List.cons':
                var $363 = self.head;
                var $364 = self.tail;
                var self = $363;
                switch (self._) {
                    case 'Pair.new':
                        var $366 = self.fst;
                        var $367 = self.snd;
                        var $368 = (bitsmap_set(String$to_bits$($366), $367, Map$from_list$($364), 'set'));
                        var $365 = $368;
                        break;
                };
                var $362 = $365;
                break;
            case 'List.nil':
                var $369 = BitsMap$new;
                var $362 = $369;
                break;
        };
        return $362;
    };
    const Map$from_list = x0 => Map$from_list$(x0);
    const List$nil = ({
        _: 'List.nil'
    });

    function App$TicTacToe$draw$(_img$1, _state$2) {
        var _img$3 = VoxBox$Draw$deresagon$(0, 0, 0, 10, ((0 | 0 | (0 << 8) | (0 << 16) | (1 << 24))), Bool$true, Bool$true, Bool$true, Bool$true, Bool$true, Bool$true, _img$1);
        var $370 = DOM$vbox$(Map$from_list$(List$nil), Map$from_list$(List$nil), _img$3);
        return $370;
    };
    const App$TicTacToe$draw = x0 => x1 => App$TicTacToe$draw$(x0, x1);

    function IO$(_A$1) {
        var $371 = null;
        return $371;
    };
    const IO = x0 => IO$(x0);

    function IO$ask$(_query$2, _param$3, _then$4) {
        var $372 = ({
            _: 'IO.ask',
            'query': _query$2,
            'param': _param$3,
            'then': _then$4
        });
        return $372;
    };
    const IO$ask = x0 => x1 => x2 => IO$ask$(x0, x1, x2);

    function IO$bind$(_a$3, _f$4) {
        var self = _a$3;
        switch (self._) {
            case 'IO.end':
                var $374 = self.value;
                var $375 = _f$4($374);
                var $373 = $375;
                break;
            case 'IO.ask':
                var $376 = self.query;
                var $377 = self.param;
                var $378 = self.then;
                var $379 = IO$ask$($376, $377, (_x$8 => {
                    var $380 = IO$bind$($378(_x$8), _f$4);
                    return $380;
                }));
                var $373 = $379;
                break;
        };
        return $373;
    };
    const IO$bind = x0 => x1 => IO$bind$(x0, x1);

    function IO$end$(_value$2) {
        var $381 = ({
            _: 'IO.end',
            'value': _value$2
        });
        return $381;
    };
    const IO$end = x0 => IO$end$(x0);

    function IO$monad$(_new$2) {
        var $382 = _new$2(IO$bind)(IO$end);
        return $382;
    };
    const IO$monad = x0 => IO$monad$(x0);

    function Maybe$(_A$1) {
        var $383 = null;
        return $383;
    };
    const Maybe = x0 => Maybe$(x0);

    function Pair$fst$(_pair$3) {
        var self = _pair$3;
        switch (self._) {
            case 'Pair.new':
                var $385 = self.fst;
                var $386 = $385;
                var $384 = $386;
                break;
        };
        return $384;
    };
    const Pair$fst = x0 => Pair$fst$(x0);
    const App$State$local = Pair$fst;
    const App$pass = IO$monad$((_m$bind$2 => _m$pure$3 => {
        var $387 = _m$pure$3;
        return $387;
    }))(Maybe$none);

    function App$TicTacToe$when$(_event$1, _state$2) {
        var $388 = App$pass;
        return $388;
    };
    const App$TicTacToe$when = x0 => x1 => App$TicTacToe$when$(x0, x1);

    function App$TicTacToe$tick$(_tick$1, _glob$2) {
        var $389 = _glob$2;
        return $389;
    };
    const App$TicTacToe$tick = x0 => x1 => App$TicTacToe$tick$(x0, x1);

    function App$TicTacToe$post$(_time$1, _room$2, _addr$3, _data$4, _glob$5) {
        var $390 = _glob$5;
        return $390;
    };
    const App$TicTacToe$post = x0 => x1 => x2 => x3 => x4 => App$TicTacToe$post$(x0, x1, x2, x3, x4);

    function App$new$(_init$2, _draw$3, _when$4, _tick$5, _post$6) {
        var $391 = ({
            _: 'App.new',
            'init': _init$2,
            'draw': _draw$3,
            'when': _when$4,
            'tick': _tick$5,
            'post': _post$6
        });
        return $391;
    };
    const App$new = x0 => x1 => x2 => x3 => x4 => App$new$(x0, x1, x2, x3, x4);
    const App$TicTacToe = (() => {
        var _img$1 = VoxBox$alloc_capacity$(((65536 * 8) >>> 0));
        var _init$2 = App$TicTacToe$init;
        var _draw$3 = App$TicTacToe$draw(_img$1);
        var _when$4 = App$TicTacToe$when;
        var _tick$5 = App$TicTacToe$tick;
        var _post$6 = App$TicTacToe$post;
        var $392 = App$new$(_init$2, _draw$3, _when$4, _tick$5, _post$6);
        return $392;
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
        'App.TicTacToe.State.global.new': App$TicTacToe$State$global$new,
        'Vector': Vector,
        'Vector.nil': Vector$nil,
        'Vector.ext': Vector$ext,
        'Vector.fill': Vector$fill,
        'App.TicTacToe.Entity.Empty': App$TicTacToe$Entity$Empty,
        'App.TicTacToe.init': App$TicTacToe$init,
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
        'U32.div': U32$div,
        'U32.add': U32$add,
        'U32.sub': U32$sub,
        'Cmp.as_eql': Cmp$as_eql,
        'Word.eql': Word$eql,
        'U32.eql': U32$eql,
        'U32.inc': U32$inc,
        'U32.for': U32$for,
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
        'U32.or': U32$or,
        'Word.fold': Word$fold,
        'Nat.add': Nat$add,
        'Nat.mul': Nat$mul,
        'Word.to_nat': Word$to_nat,
        'Word.shl': Word$shl,
        'U32.shl': U32$shl,
        'Pos32.new': Pos32$new,
        'VoxBox.Draw.deresagon': VoxBox$Draw$deresagon,
        'U32.from_nat': U32$from_nat,
        'Col32.new': Col32$new,
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
        'List.nil': List$nil,
        'App.TicTacToe.draw': App$TicTacToe$draw,
        'IO': IO,
        'IO.ask': IO$ask,
        'IO.bind': IO$bind,
        'IO.end': IO$end,
        'IO.monad': IO$monad,
        'Maybe': Maybe,
        'Pair.fst': Pair$fst,
        'App.State.local': App$State$local,
        'App.pass': App$pass,
        'App.TicTacToe.when': App$TicTacToe$when,
        'App.TicTacToe.tick': App$TicTacToe$tick,
        'App.TicTacToe.post': App$TicTacToe$post,
        'App.new': App$new,
        'App.TicTacToe': App$TicTacToe,
    };
})();