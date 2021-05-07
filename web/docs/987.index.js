(self["webpackChunkkind_web"] = self["webpackChunkkind_web"] || []).push([[987],{

/***/ 987:
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

    function Pair$new$(_fst$3, _snd$4) {
        var $136 = ({
            _: 'Pair.new',
            'fst': _fst$3,
            'snd': _snd$4
        });
        return $136;
    };
    const Pair$new = x0 => x1 => Pair$new$(x0, x1);

    function Pair$fst$(_pair$3) {
        var self = _pair$3;
        switch (self._) {
            case 'Pair.new':
                var $138 = self.fst;
                var $139 = $138;
                var $137 = $139;
                break;
        };
        return $137;
    };
    const Pair$fst = x0 => Pair$fst$(x0);

    function Pair$snd$(_pair$3) {
        var self = _pair$3;
        switch (self._) {
            case 'Pair.new':
                var $141 = self.snd;
                var $142 = $141;
                var $140 = $142;
                break;
        };
        return $140;
    };
    const Pair$snd = x0 => Pair$snd$(x0);

    function Word$or$(_a$2, _b$3) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $144 = self.pred;
                var $145 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $147 = self.pred;
                            var $148 = (_a$pred$9 => {
                                var $149 = Word$o$(Word$or$(_a$pred$9, $147));
                                return $149;
                            });
                            var $146 = $148;
                            break;
                        case 'Word.i':
                            var $150 = self.pred;
                            var $151 = (_a$pred$9 => {
                                var $152 = Word$i$(Word$or$(_a$pred$9, $150));
                                return $152;
                            });
                            var $146 = $151;
                            break;
                        case 'Word.e':
                            var $153 = (_a$pred$7 => {
                                var $154 = Word$e;
                                return $154;
                            });
                            var $146 = $153;
                            break;
                    };
                    var $146 = $146($144);
                    return $146;
                });
                var $143 = $145;
                break;
            case 'Word.i':
                var $155 = self.pred;
                var $156 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $158 = self.pred;
                            var $159 = (_a$pred$9 => {
                                var $160 = Word$i$(Word$or$(_a$pred$9, $158));
                                return $160;
                            });
                            var $157 = $159;
                            break;
                        case 'Word.i':
                            var $161 = self.pred;
                            var $162 = (_a$pred$9 => {
                                var $163 = Word$i$(Word$or$(_a$pred$9, $161));
                                return $163;
                            });
                            var $157 = $162;
                            break;
                        case 'Word.e':
                            var $164 = (_a$pred$7 => {
                                var $165 = Word$e;
                                return $165;
                            });
                            var $157 = $164;
                            break;
                    };
                    var $157 = $157($155);
                    return $157;
                });
                var $143 = $156;
                break;
            case 'Word.e':
                var $166 = (_b$4 => {
                    var $167 = Word$e;
                    return $167;
                });
                var $143 = $166;
                break;
        };
        var $143 = $143(_b$3);
        return $143;
    };
    const Word$or = x0 => x1 => Word$or$(x0, x1);
    const U32$or = a0 => a1 => (a0 | a1);

    function Word$fold$(_nil$3, _w0$4, _w1$5, _word$6) {
        var self = _word$6;
        switch (self._) {
            case 'Word.o':
                var $169 = self.pred;
                var $170 = _w0$4(Word$fold$(_nil$3, _w0$4, _w1$5, $169));
                var $168 = $170;
                break;
            case 'Word.i':
                var $171 = self.pred;
                var $172 = _w1$5(Word$fold$(_nil$3, _w0$4, _w1$5, $171));
                var $168 = $172;
                break;
            case 'Word.e':
                var $173 = _nil$3;
                var $168 = $173;
                break;
        };
        return $168;
    };
    const Word$fold = x0 => x1 => x2 => x3 => Word$fold$(x0, x1, x2, x3);
    const Nat$add = a0 => a1 => (a0 + a1);
    const Nat$mul = a0 => a1 => (a0 * a1);

    function Word$to_nat$(_word$2) {
        var $174 = Word$fold$(0n, a1 => (2n * a1), (_x$4 => {
            var $175 = Nat$succ$((2n * _x$4));
            return $175;
        }), _word$2);
        return $174;
    };
    const Word$to_nat = x0 => Word$to_nat$(x0);

    function Word$shl$(_n$2, _value$3) {
        var _n_nat$4 = Word$to_nat$(_n$2);
        var $176 = Word$shift_left$(_n_nat$4, _value$3);
        return $176;
    };
    const Word$shl = x0 => x1 => Word$shl$(x0, x1);
    const U32$shl = a0 => a1 => ((a0 << a1) >>> 0);
    const Col32$new = a0 => a1 => a2 => a3 => ((0 | a0 | (a1 << 8) | (a2 << 16) | (a3 << 24)));

    function DOM$node$(_tag$1, _props$2, _style$3, _children$4) {
        var $177 = ({
            _: 'DOM.node',
            'tag': _tag$1,
            'props': _props$2,
            'style': _style$3,
            'children': _children$4
        });
        return $177;
    };
    const DOM$node = x0 => x1 => x2 => x3 => DOM$node$(x0, x1, x2, x3);

    function BitsMap$(_A$1) {
        var $178 = null;
        return $178;
    };
    const BitsMap = x0 => BitsMap$(x0);

    function Map$(_V$1) {
        var $179 = null;
        return $179;
    };
    const Map = x0 => Map$(x0);
    const BitsMap$new = ({
        _: 'BitsMap.new'
    });

    function BitsMap$tie$(_val$2, _lft$3, _rgt$4) {
        var $180 = ({
            _: 'BitsMap.tie',
            'val': _val$2,
            'lft': _lft$3,
            'rgt': _rgt$4
        });
        return $180;
    };
    const BitsMap$tie = x0 => x1 => x2 => BitsMap$tie$(x0, x1, x2);

    function Maybe$some$(_value$2) {
        var $181 = ({
            _: 'Maybe.some',
            'value': _value$2
        });
        return $181;
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
                var $183 = self.pred;
                var $184 = (Word$to_bits$($183) + '0');
                var $182 = $184;
                break;
            case 'Word.i':
                var $185 = self.pred;
                var $186 = (Word$to_bits$($185) + '1');
                var $182 = $186;
                break;
            case 'Word.e':
                var $187 = Bits$e;
                var $182 = $187;
                break;
        };
        return $182;
    };
    const Word$to_bits = x0 => Word$to_bits$(x0);
    const U16$to_bits = a0 => (u16_to_bits(a0));

    function String$to_bits$(_str$1) {
        var self = _str$1;
        if (self.length === 0) {
            var $189 = Bits$e;
            var $188 = $189;
        } else {
            var $190 = self.charCodeAt(0);
            var $191 = self.slice(1);
            var $192 = (String$to_bits$($191) + (u16_to_bits($190)));
            var $188 = $192;
        };
        return $188;
    };
    const String$to_bits = x0 => String$to_bits$(x0);

    function Map$from_list$(_xs$2) {
        var self = _xs$2;
        switch (self._) {
            case 'List.cons':
                var $194 = self.head;
                var $195 = self.tail;
                var self = $194;
                switch (self._) {
                    case 'Pair.new':
                        var $197 = self.fst;
                        var $198 = self.snd;
                        var $199 = (bitsmap_set(String$to_bits$($197), $198, Map$from_list$($195), 'set'));
                        var $196 = $199;
                        break;
                };
                var $193 = $196;
                break;
            case 'List.nil':
                var $200 = BitsMap$new;
                var $193 = $200;
                break;
        };
        return $193;
    };
    const Map$from_list = x0 => Map$from_list$(x0);
    const List$nil = ({
        _: 'List.nil'
    });

    function Pair$(_A$1, _B$2) {
        var $201 = null;
        return $201;
    };
    const Pair = x0 => x1 => Pair$(x0, x1);

    function List$cons$(_head$2, _tail$3) {
        var $202 = ({
            _: 'List.cons',
            'head': _head$2,
            'tail': _tail$3
        });
        return $202;
    };
    const List$cons = x0 => x1 => List$cons$(x0, x1);

    function DOM$text$(_value$1) {
        var $203 = ({
            _: 'DOM.text',
            'value': _value$1
        });
        return $203;
    };
    const DOM$text = x0 => DOM$text$(x0);

    function DOM$vbox$(_props$1, _style$2, _value$3) {
        var $204 = ({
            _: 'DOM.vbox',
            'props': _props$1,
            'style': _style$2,
            'value': _value$3
        });
        return $204;
    };
    const DOM$vbox = x0 => x1 => x2 => DOM$vbox$(x0, x1, x2);
    const Nat$ltn = a0 => a1 => (a0 < a1);
    const Nat$sub = a0 => a1 => (a0 - a1 <= 0n ? 0n : a0 - a1);

    function Cmp$as_gte$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
                var $206 = Bool$false;
                var $205 = $206;
                break;
            case 'Cmp.eql':
            case 'Cmp.gtn':
                var $207 = Bool$true;
                var $205 = $207;
                break;
        };
        return $205;
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
                var $209 = self.pred;
                var $210 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $212 = self.pred;
                            var $213 = (_a$pred$10 => {
                                var $214 = Word$cmp$go$(_a$pred$10, $212, _c$4);
                                return $214;
                            });
                            var $211 = $213;
                            break;
                        case 'Word.i':
                            var $215 = self.pred;
                            var $216 = (_a$pred$10 => {
                                var $217 = Word$cmp$go$(_a$pred$10, $215, Cmp$ltn);
                                return $217;
                            });
                            var $211 = $216;
                            break;
                        case 'Word.e':
                            var $218 = (_a$pred$8 => {
                                var $219 = _c$4;
                                return $219;
                            });
                            var $211 = $218;
                            break;
                    };
                    var $211 = $211($209);
                    return $211;
                });
                var $208 = $210;
                break;
            case 'Word.i':
                var $220 = self.pred;
                var $221 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $223 = self.pred;
                            var $224 = (_a$pred$10 => {
                                var $225 = Word$cmp$go$(_a$pred$10, $223, Cmp$gtn);
                                return $225;
                            });
                            var $222 = $224;
                            break;
                        case 'Word.i':
                            var $226 = self.pred;
                            var $227 = (_a$pred$10 => {
                                var $228 = Word$cmp$go$(_a$pred$10, $226, _c$4);
                                return $228;
                            });
                            var $222 = $227;
                            break;
                        case 'Word.e':
                            var $229 = (_a$pred$8 => {
                                var $230 = _c$4;
                                return $230;
                            });
                            var $222 = $229;
                            break;
                    };
                    var $222 = $222($220);
                    return $222;
                });
                var $208 = $221;
                break;
            case 'Word.e':
                var $231 = (_b$5 => {
                    var $232 = _c$4;
                    return $232;
                });
                var $208 = $231;
                break;
        };
        var $208 = $208(_b$3);
        return $208;
    };
    const Word$cmp$go = x0 => x1 => x2 => Word$cmp$go$(x0, x1, x2);
    const Cmp$eql = ({
        _: 'Cmp.eql'
    });

    function Word$cmp$(_a$2, _b$3) {
        var $233 = Word$cmp$go$(_a$2, _b$3, Cmp$eql);
        return $233;
    };
    const Word$cmp = x0 => x1 => Word$cmp$(x0, x1);

    function Word$gte$(_a$2, _b$3) {
        var $234 = Cmp$as_gte$(Word$cmp$(_a$2, _b$3));
        return $234;
    };
    const Word$gte = x0 => x1 => Word$gte$(x0, x1);

    function Word$shift_right$one$go$(_word$2) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $236 = self.pred;
                var $237 = Word$o$(Word$shift_right$one$go$($236));
                var $235 = $237;
                break;
            case 'Word.i':
                var $238 = self.pred;
                var $239 = Word$i$(Word$shift_right$one$go$($238));
                var $235 = $239;
                break;
            case 'Word.e':
                var $240 = Word$o$(Word$e);
                var $235 = $240;
                break;
        };
        return $235;
    };
    const Word$shift_right$one$go = x0 => Word$shift_right$one$go$(x0);

    function Word$shift_right$one$(_word$2) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $242 = self.pred;
                var $243 = Word$shift_right$one$go$($242);
                var $241 = $243;
                break;
            case 'Word.i':
                var $244 = self.pred;
                var $245 = Word$shift_right$one$go$($244);
                var $241 = $245;
                break;
            case 'Word.e':
                var $246 = Word$e;
                var $241 = $246;
                break;
        };
        return $241;
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
                    var $247 = _value$3;
                    return $247;
                } else {
                    var $248 = (self - 1n);
                    var $249 = Word$shift_right$($248, Word$shift_right$one$(_value$3));
                    return $249;
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
                            var _new_shift_copy$9 = Word$shift_right$(1n, _shift_copy$4);
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
    const U32$inc = a0 => ((a0 + 1) >>> 0);
    const U32$for = a0 => a1 => a2 => a3 => (u32_for(a0, a1, a2, a3));

    function Word$mod$(_a$2, _b$3) {
        var _q$4 = Word$div$(_a$2, _b$3);
        var $301 = Word$sub$(_a$2, Word$mul$(_b$3, _q$4));
        return $301;
    };
    const Word$mod = x0 => x1 => Word$mod$(x0, x1);
    const U32$mod = a0 => a1 => (a0 % a1);
    const U32$sub = a0 => a1 => ((a0 - a1) >>> 0);
    const U32$add = a0 => a1 => ((a0 + a1) >>> 0);
    const Pos32$new = a0 => a1 => a2 => ((0 | a0 | (a1 << 12) | (a2 << 24)));

    function Word$trim$(_new_size$2, _word$3) {
        var self = _new_size$2;
        if (self === 0n) {
            var $303 = Word$e;
            var $302 = $303;
        } else {
            var $304 = (self - 1n);
            var self = _word$3;
            switch (self._) {
                case 'Word.o':
                    var $306 = self.pred;
                    var $307 = Word$o$(Word$trim$($304, $306));
                    var $305 = $307;
                    break;
                case 'Word.i':
                    var $308 = self.pred;
                    var $309 = Word$i$(Word$trim$($304, $308));
                    var $305 = $309;
                    break;
                case 'Word.e':
                    var $310 = Word$o$(Word$trim$($304, Word$e));
                    var $305 = $310;
                    break;
            };
            var $302 = $305;
        };
        return $302;
    };
    const Word$trim = x0 => x1 => Word$trim$(x0, x1);
    const Unit$new = null;

    function Array$extract_tip$(_arr$2) {
        var self = _arr$2;
        switch (self._) {
            case 'Array.tip':
                var $312 = self.value;
                var $313 = $312;
                var $311 = $313;
                break;
            case 'Array.tie':
                var $314 = Unit$new;
                var $311 = $314;
                break;
        };
        return $311;
    };
    const Array$extract_tip = x0 => Array$extract_tip$(x0);

    function Array$extract_tie$(_arr$3) {
        var self = _arr$3;
        switch (self._) {
            case 'Array.tie':
                var $316 = self.lft;
                var $317 = self.rgt;
                var $318 = Pair$new$($316, $317);
                var $315 = $318;
                break;
            case 'Array.tip':
                var $319 = Unit$new;
                var $315 = $319;
                break;
        };
        return $315;
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
                        var $320 = self.pred;
                        var $321 = Word$foldl$(_w0$4(_nil$3), _w0$4, _w1$5, $320);
                        return $321;
                    case 'Word.i':
                        var $322 = self.pred;
                        var $323 = Word$foldl$(_w1$5(_nil$3), _w0$4, _w1$5, $322);
                        return $323;
                    case 'Word.e':
                        var $324 = _nil$3;
                        return $324;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Word$foldl = x0 => x1 => x2 => x3 => Word$foldl$(x0, x1, x2, x3);

    function Array$mut$(_idx$3, _f$4, _arr$5) {
        var $325 = Word$foldl$((_arr$6 => {
            var $326 = Array$tip$(_f$4(Array$extract_tip$(_arr$6)));
            return $326;
        }), (_rec$7 => _arr$8 => {
            var self = Array$extract_tie$(_arr$8);
            switch (self._) {
                case 'Pair.new':
                    var $328 = self.fst;
                    var $329 = self.snd;
                    var $330 = Array$tie$(_rec$7($328), $329);
                    var $327 = $330;
                    break;
            };
            return $327;
        }), (_rec$7 => _arr$8 => {
            var self = Array$extract_tie$(_arr$8);
            switch (self._) {
                case 'Pair.new':
                    var $332 = self.fst;
                    var $333 = self.snd;
                    var $334 = Array$tie$($332, _rec$7($333));
                    var $331 = $334;
                    break;
            };
            return $331;
        }), _idx$3)(_arr$5);
        return $325;
    };
    const Array$mut = x0 => x1 => x2 => Array$mut$(x0, x1, x2);

    function Array$set$(_idx$3, _val$4, _arr$5) {
        var $335 = Array$mut$(_idx$3, (_x$6 => {
            var $336 = _val$4;
            return $336;
        }), _arr$5);
        return $335;
    };
    const Array$set = x0 => x1 => x2 => Array$set$(x0, x1, x2);
    const Buffer32$set = a0 => a1 => a2 => ((a2[a0] = a1, a2));
    const VoxBox$set_pos = a0 => a1 => a2 => ((a2.buffer[a0 * 2] = a1, a2));
    const VoxBox$set_col = a0 => a1 => a2 => ((a2.buffer[a0 * 2 + 1] = a1, a2));

    function VoxBox$set_length$(_length$1, _img$2) {
        var self = _img$2;
        switch (self._) {
            case 'VoxBox.new':
                var $338 = self.capacity;
                var $339 = self.buffer;
                var $340 = VoxBox$new$(_length$1, $338, $339);
                var $337 = $340;
                break;
        };
        return $337;
    };
    const VoxBox$set_length = x0 => x1 => VoxBox$set_length$(x0, x1);
    const VoxBox$push = a0 => a1 => a2 => ((a2.buffer[a2.length * 2] = a0, a2.buffer[a2.length * 2 + 1] = a1, a2.length++, a2));

    function VoxBox$Draw$square$(_x$1, _y$2, _z$3, _w$4, _h$5, _col$6, _img$7) {
        var _siz$8 = ((_w$4 * _h$5) >>> 0);
        var _w_2$9 = ((_w$4 / 2) >>> 0);
        var _h_2$10 = ((_h$5 / 2) >>> 0);
        var $341 = (() => {
            var $342 = _img$7;
            var $343 = 0;
            var $344 = _siz$8;
            let _pix$12 = $342;
            for (let _idx$11 = $343; _idx$11 < $344; ++_idx$11) {
                var _v_x$13 = (_idx$11 % _w$4);
                var _v_y$14 = ((_idx$11 / _h$5) >>> 0);
                var _p_x$15 = ((((_x$1 + _v_x$13) >>> 0) - _w_2$9) >>> 0);
                var _p_y$16 = ((((_y$2 + _v_y$14) >>> 0) - _h_2$10) >>> 0);
                var _pos$17 = ((0 | _p_x$15 | (_p_y$16 << 12) | (_z$3 << 24)));
                var _col$18 = _col$6(_v_x$13)(_v_y$14);
                var _pix$19 = ((_pix$12.buffer[_pix$12.length * 2] = _pos$17, _pix$12.buffer[_pix$12.length * 2 + 1] = _col$18, _pix$12.length++, _pix$12));
                var $342 = _pix$19;
                _pix$12 = $342;
            };
            return _pix$12;
        })();
        return $341;
    };
    const VoxBox$Draw$square = x0 => x1 => x2 => x3 => x4 => x5 => x6 => VoxBox$Draw$square$(x0, x1, x2, x3, x4, x5, x6);

    function IO$(_A$1) {
        var $345 = null;
        return $345;
    };
    const IO = x0 => IO$(x0);

    function IO$ask$(_query$2, _param$3, _then$4) {
        var $346 = ({
            _: 'IO.ask',
            'query': _query$2,
            'param': _param$3,
            'then': _then$4
        });
        return $346;
    };
    const IO$ask = x0 => x1 => x2 => IO$ask$(x0, x1, x2);

    function IO$bind$(_a$3, _f$4) {
        var self = _a$3;
        switch (self._) {
            case 'IO.end':
                var $348 = self.value;
                var $349 = _f$4($348);
                var $347 = $349;
                break;
            case 'IO.ask':
                var $350 = self.query;
                var $351 = self.param;
                var $352 = self.then;
                var $353 = IO$ask$($350, $351, (_x$8 => {
                    var $354 = IO$bind$($352(_x$8), _f$4);
                    return $354;
                }));
                var $347 = $353;
                break;
        };
        return $347;
    };
    const IO$bind = x0 => x1 => IO$bind$(x0, x1);

    function IO$end$(_value$2) {
        var $355 = ({
            _: 'IO.end',
            'value': _value$2
        });
        return $355;
    };
    const IO$end = x0 => IO$end$(x0);

    function IO$monad$(_new$2) {
        var $356 = _new$2(IO$bind)(IO$end);
        return $356;
    };
    const IO$monad = x0 => IO$monad$(x0);

    function Dynamic$new$(_value$2) {
        var $357 = ({
            _: 'Dynamic.new',
            'value': _value$2
        });
        return $357;
    };
    const Dynamic$new = x0 => Dynamic$new$(x0);
    const App$pass = IO$monad$((_m$bind$1 => _m$pure$2 => {
        var $358 = _m$pure$2;
        return $358;
    }))(Dynamic$new$(Unit$new));
    const U16$eql = a0 => a1 => (a0 === a1);

    function App$store$(_value$2) {
        var $359 = IO$monad$((_m$bind$3 => _m$pure$4 => {
            var $360 = _m$pure$4;
            return $360;
        }))(Dynamic$new$(_value$2));
        return $359;
    };
    const App$store = x0 => App$store$(x0);

    function IO$prompt$(_text$1) {
        var $361 = IO$ask$("get_line", _text$1, (_line$2 => {
            var $362 = IO$end$(_line$2);
            return $362;
        }));
        return $361;
    };
    const IO$prompt = x0 => IO$prompt$(x0);

    function IO$put_string$(_text$1) {
        var $363 = IO$ask$("put_string", _text$1, (_skip$2 => {
            var $364 = IO$end$(Unit$new);
            return $364;
        }));
        return $363;
    };
    const IO$put_string = x0 => IO$put_string$(x0);

    function String$cons$(_head$1, _tail$2) {
        var $365 = (String.fromCharCode(_head$1) + _tail$2);
        return $365;
    };
    const String$cons = x0 => x1 => String$cons$(x0, x1);
    const String$concat = a0 => a1 => (a0 + a1);

    function IO$print$(_text$1) {
        var $366 = IO$put_string$((_text$1 + "\u{a}"));
        return $366;
    };
    const IO$print = x0 => IO$print$(x0);

    function App$new$(_init$2, _draw$3, _when$4) {
        var $367 = ({
            _: 'App.new',
            'init': _init$2,
            'draw': _draw$3,
            'when': _when$4
        });
        return $367;
    };
    const App$new = x0 => x1 => x2 => App$new$(x0, x1, x2);
    const Web$Demo = (() => {
        var _vbox$1 = VoxBox$alloc_capacity$(65536);
        var _init$2 = Pair$new$(128, 128);
        var _draw$3 = (_state$3 => {
            var _p_x$4 = Pair$fst$(_state$3);
            var _p_y$5 = Pair$snd$(_state$3);
            var _col$6 = (_x$6 => _y$7 => {
                var $370 = ((0 | 200 | (200 << 8) | (255 << 16) | (255 << 24)));
                return $370;
            });
            var $369 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$nil), List$cons$(DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$nil), List$cons$(DOM$text$("Kind Demo App"), List$nil)), List$cons$(DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$nil), List$cons$(DOM$text$("- Press W/A/S/D to move"), List$nil)), List$cons$(DOM$node$("div", Map$from_list$(List$cons$(Pair$new$("id", "play_game"), List$nil)), Map$from_list$(List$cons$(Pair$new$("color", "blue"), List$cons$(Pair$new$("text-decoration", "underline"), List$nil))), List$cons$(DOM$text$("- Click here to play a game"), List$nil)), List$cons$(DOM$vbox$(Map$from_list$(List$nil), Map$from_list$(List$nil), VoxBox$Draw$square$(_p_x$4, _p_y$5, 128, 16, 16, _col$6, _vbox$1)), List$nil)))));
            return $369;
        });
        var _when$4 = (_event$4 => _state$5 => {
            var self = _event$4;
            switch (self._) {
                case 'App.Event.key_down':
                    var $372 = self.code;
                    var self = _state$5;
                    switch (self._) {
                        case 'Pair.new':
                            var $374 = self.fst;
                            var $375 = self.snd;
                            var self = ($372 === 65);
                            if (self) {
                                var $377 = App$store$(Pair$new$((($374 - 16) >>> 0), $375));
                                var $376 = $377;
                            } else {
                                var self = ($372 === 68);
                                if (self) {
                                    var $379 = App$store$(Pair$new$((($374 + 16) >>> 0), $375));
                                    var $378 = $379;
                                } else {
                                    var self = ($372 === 87);
                                    if (self) {
                                        var $381 = App$store$(Pair$new$($374, (($375 - 16) >>> 0)));
                                        var $380 = $381;
                                    } else {
                                        var self = ($372 === 83);
                                        if (self) {
                                            var $383 = App$store$(Pair$new$($374, (($375 + 16) >>> 0)));
                                            var $382 = $383;
                                        } else {
                                            var $384 = App$pass;
                                            var $382 = $384;
                                        };
                                        var $380 = $382;
                                    };
                                    var $378 = $380;
                                };
                                var $376 = $378;
                            };
                            var $373 = $376;
                            break;
                    };
                    var $371 = $373;
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
                    var $385 = App$pass;
                    var $371 = $385;
                    break;
                case 'App.Event.mouse_click':
                    var $386 = IO$monad$((_m$bind$9 => _m$pure$10 => {
                        var $387 = _m$bind$9;
                        return $387;
                    }))(IO$prompt$("What is your name?"))((_line$9 => {
                        var $388 = IO$monad$((_m$bind$10 => _m$pure$11 => {
                            var $389 = _m$bind$10;
                            return $389;
                        }))(IO$print$(("You\'re breath-taking, " + (_line$9 + "!"))))((_$10 => {
                            var $390 = App$pass;
                            return $390;
                        }));
                        return $388;
                    }));
                    var $371 = $386;
                    break;
            };
            return $371;
        });
        var $368 = App$new$(_init$2, _draw$3, _when$4);
        return $368;
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
        'Pair.new': Pair$new,
        'Pair.fst': Pair$fst,
        'Pair.snd': Pair$snd,
        'Word.or': Word$or,
        'U32.or': U32$or,
        'Word.fold': Word$fold,
        'Nat.add': Nat$add,
        'Nat.mul': Nat$mul,
        'Word.to_nat': Word$to_nat,
        'Word.shl': Word$shl,
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
        'Cmp.as_gte': Cmp$as_gte,
        'Cmp.ltn': Cmp$ltn,
        'Cmp.gtn': Cmp$gtn,
        'Word.cmp.go': Word$cmp$go,
        'Cmp.eql': Cmp$eql,
        'Word.cmp': Word$cmp,
        'Word.gte': Word$gte,
        'Word.shift_right.one.go': Word$shift_right$one$go,
        'Word.shift_right.one': Word$shift_right$one,
        'Word.shift_right': Word$shift_right,
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

/***/ })

}]);
//# sourceMappingURL=987.index.js.map