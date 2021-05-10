(self["webpackChunkkind_web"] = self["webpackChunkkind_web"] || []).push([[401],{

/***/ 401:
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
    const Nat$ltn = a0 => a1 => (a0 < a1);
    const Nat$sub = a0 => a1 => (a0 - a1 <= 0n ? 0n : a0 - a1);

    function Cmp$as_gte$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
                var $137 = Bool$false;
                var $136 = $137;
                break;
            case 'Cmp.eql':
            case 'Cmp.gtn':
                var $138 = Bool$true;
                var $136 = $138;
                break;
        };
        return $136;
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
                var $140 = self.pred;
                var $141 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $143 = self.pred;
                            var $144 = (_a$pred$10 => {
                                var $145 = Word$cmp$go$(_a$pred$10, $143, _c$4);
                                return $145;
                            });
                            var $142 = $144;
                            break;
                        case 'Word.i':
                            var $146 = self.pred;
                            var $147 = (_a$pred$10 => {
                                var $148 = Word$cmp$go$(_a$pred$10, $146, Cmp$ltn);
                                return $148;
                            });
                            var $142 = $147;
                            break;
                        case 'Word.e':
                            var $149 = (_a$pred$8 => {
                                var $150 = _c$4;
                                return $150;
                            });
                            var $142 = $149;
                            break;
                    };
                    var $142 = $142($140);
                    return $142;
                });
                var $139 = $141;
                break;
            case 'Word.i':
                var $151 = self.pred;
                var $152 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $154 = self.pred;
                            var $155 = (_a$pred$10 => {
                                var $156 = Word$cmp$go$(_a$pred$10, $154, Cmp$gtn);
                                return $156;
                            });
                            var $153 = $155;
                            break;
                        case 'Word.i':
                            var $157 = self.pred;
                            var $158 = (_a$pred$10 => {
                                var $159 = Word$cmp$go$(_a$pred$10, $157, _c$4);
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
                var $139 = $152;
                break;
            case 'Word.e':
                var $162 = (_b$5 => {
                    var $163 = _c$4;
                    return $163;
                });
                var $139 = $162;
                break;
        };
        var $139 = $139(_b$3);
        return $139;
    };
    const Word$cmp$go = x0 => x1 => x2 => Word$cmp$go$(x0, x1, x2);
    const Cmp$eql = ({
        _: 'Cmp.eql'
    });

    function Word$cmp$(_a$2, _b$3) {
        var $164 = Word$cmp$go$(_a$2, _b$3, Cmp$eql);
        return $164;
    };
    const Word$cmp = x0 => x1 => Word$cmp$(x0, x1);

    function Word$gte$(_a$2, _b$3) {
        var $165 = Cmp$as_gte$(Word$cmp$(_a$2, _b$3));
        return $165;
    };
    const Word$gte = x0 => x1 => Word$gte$(x0, x1);

    function Pair$(_A$1, _B$2) {
        var $166 = null;
        return $166;
    };
    const Pair = x0 => x1 => Pair$(x0, x1);

    function Pair$new$(_fst$3, _snd$4) {
        var $167 = ({
            _: 'Pair.new',
            'fst': _fst$3,
            'snd': _snd$4
        });
        return $167;
    };
    const Pair$new = x0 => x1 => Pair$new$(x0, x1);

    function Word$or$(_a$2, _b$3) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $169 = self.pred;
                var $170 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $172 = self.pred;
                            var $173 = (_a$pred$9 => {
                                var $174 = Word$o$(Word$or$(_a$pred$9, $172));
                                return $174;
                            });
                            var $171 = $173;
                            break;
                        case 'Word.i':
                            var $175 = self.pred;
                            var $176 = (_a$pred$9 => {
                                var $177 = Word$i$(Word$or$(_a$pred$9, $175));
                                return $177;
                            });
                            var $171 = $176;
                            break;
                        case 'Word.e':
                            var $178 = (_a$pred$7 => {
                                var $179 = Word$e;
                                return $179;
                            });
                            var $171 = $178;
                            break;
                    };
                    var $171 = $171($169);
                    return $171;
                });
                var $168 = $170;
                break;
            case 'Word.i':
                var $180 = self.pred;
                var $181 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $183 = self.pred;
                            var $184 = (_a$pred$9 => {
                                var $185 = Word$i$(Word$or$(_a$pred$9, $183));
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
                var $168 = $181;
                break;
            case 'Word.e':
                var $191 = (_b$4 => {
                    var $192 = Word$e;
                    return $192;
                });
                var $168 = $191;
                break;
        };
        var $168 = $168(_b$3);
        return $168;
    };
    const Word$or = x0 => x1 => Word$or$(x0, x1);

    function Word$shift_right$one$go$(_word$2) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $194 = self.pred;
                var $195 = Word$o$(Word$shift_right$one$go$($194));
                var $193 = $195;
                break;
            case 'Word.i':
                var $196 = self.pred;
                var $197 = Word$i$(Word$shift_right$one$go$($196));
                var $193 = $197;
                break;
            case 'Word.e':
                var $198 = Word$o$(Word$e);
                var $193 = $198;
                break;
        };
        return $193;
    };
    const Word$shift_right$one$go = x0 => Word$shift_right$one$go$(x0);

    function Word$shift_right$one$(_word$2) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $200 = self.pred;
                var $201 = Word$shift_right$one$go$($200);
                var $199 = $201;
                break;
            case 'Word.i':
                var $202 = self.pred;
                var $203 = Word$shift_right$one$go$($202);
                var $199 = $203;
                break;
            case 'Word.e':
                var $204 = Word$e;
                var $199 = $204;
                break;
        };
        return $199;
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
                    var $205 = _value$3;
                    return $205;
                } else {
                    var $206 = (self - 1n);
                    var $207 = Word$shift_right$($206, Word$shift_right$one$(_value$3));
                    return $207;
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
                var $209 = self.pred;
                var $210 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $212 = self.pred;
                            var $213 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $215 = Word$i$(Word$subber$(_a$pred$10, $212, Bool$true));
                                    var $214 = $215;
                                } else {
                                    var $216 = Word$o$(Word$subber$(_a$pred$10, $212, Bool$false));
                                    var $214 = $216;
                                };
                                return $214;
                            });
                            var $211 = $213;
                            break;
                        case 'Word.i':
                            var $217 = self.pred;
                            var $218 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $220 = Word$o$(Word$subber$(_a$pred$10, $217, Bool$true));
                                    var $219 = $220;
                                } else {
                                    var $221 = Word$i$(Word$subber$(_a$pred$10, $217, Bool$true));
                                    var $219 = $221;
                                };
                                return $219;
                            });
                            var $211 = $218;
                            break;
                        case 'Word.e':
                            var $222 = (_a$pred$8 => {
                                var $223 = Word$e;
                                return $223;
                            });
                            var $211 = $222;
                            break;
                    };
                    var $211 = $211($209);
                    return $211;
                });
                var $208 = $210;
                break;
            case 'Word.i':
                var $224 = self.pred;
                var $225 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $227 = self.pred;
                            var $228 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $230 = Word$o$(Word$subber$(_a$pred$10, $227, Bool$false));
                                    var $229 = $230;
                                } else {
                                    var $231 = Word$i$(Word$subber$(_a$pred$10, $227, Bool$false));
                                    var $229 = $231;
                                };
                                return $229;
                            });
                            var $226 = $228;
                            break;
                        case 'Word.i':
                            var $232 = self.pred;
                            var $233 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $235 = Word$i$(Word$subber$(_a$pred$10, $232, Bool$true));
                                    var $234 = $235;
                                } else {
                                    var $236 = Word$o$(Word$subber$(_a$pred$10, $232, Bool$false));
                                    var $234 = $236;
                                };
                                return $234;
                            });
                            var $226 = $233;
                            break;
                        case 'Word.e':
                            var $237 = (_a$pred$8 => {
                                var $238 = Word$e;
                                return $238;
                            });
                            var $226 = $237;
                            break;
                    };
                    var $226 = $226($224);
                    return $226;
                });
                var $208 = $225;
                break;
            case 'Word.e':
                var $239 = (_b$5 => {
                    var $240 = Word$e;
                    return $240;
                });
                var $208 = $239;
                break;
        };
        var $208 = $208(_b$3);
        return $208;
    };
    const Word$subber = x0 => x1 => x2 => Word$subber$(x0, x1, x2);

    function Word$sub$(_a$2, _b$3) {
        var $241 = Word$subber$(_a$2, _b$3, Bool$false);
        return $241;
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
                    var $242 = Pair$new$(Bool$true, Word$or$(_value$5, _mask$6));
                    var self = $242;
                } else {
                    var $243 = Pair$new$(Bool$false, _value$5);
                    var self = $243;
                };
                switch (self._) {
                    case 'Pair.new':
                        var $244 = self.fst;
                        var $245 = self.snd;
                        var self = _shift$2;
                        if (self === 0n) {
                            var $247 = $245;
                            var $246 = $247;
                        } else {
                            var $248 = (self - 1n);
                            var _new_shift_copy$9 = Word$shift_right$(1n, _shift_copy$4);
                            var self = $244;
                            if (self) {
                                var $250 = Word$div$go$($248, Word$sub$(_sub_copy$3, _shift_copy$4), _new_shift_copy$9, $245);
                                var $249 = $250;
                            } else {
                                var $251 = Word$div$go$($248, _sub_copy$3, _new_shift_copy$9, $245);
                                var $249 = $251;
                            };
                            var $246 = $249;
                        };
                        return $246;
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
            var $253 = Word$to_zero$(_a$2);
            var $252 = $253;
        } else {
            var _shift$6 = (_a_bits$4 - _b_bits$5 <= 0n ? 0n : _a_bits$4 - _b_bits$5);
            var _shift_copy$7 = Word$shift_left$(_shift$6, _b$3);
            var $254 = Word$div$go$(_shift$6, _a$2, _shift_copy$7, Word$to_zero$(_a$2));
            var $252 = $254;
        };
        return $252;
    };
    const Word$div = x0 => x1 => Word$div$(x0, x1);
    const U32$div = a0 => a1 => ((a0 / a1) >>> 0);

    function Cmp$as_eql$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
            case 'Cmp.gtn':
                var $256 = Bool$false;
                var $255 = $256;
                break;
            case 'Cmp.eql':
                var $257 = Bool$true;
                var $255 = $257;
                break;
        };
        return $255;
    };
    const Cmp$as_eql = x0 => Cmp$as_eql$(x0);

    function Word$eql$(_a$2, _b$3) {
        var $258 = Cmp$as_eql$(Word$cmp$(_a$2, _b$3));
        return $258;
    };
    const Word$eql = x0 => x1 => Word$eql$(x0, x1);
    const U32$eql = a0 => a1 => (a0 === a1);
    const U32$inc = a0 => ((a0 + 1) >>> 0);
    const U32$for = a0 => a1 => a2 => a3 => (u32_for(a0, a1, a2, a3));

    function Word$mod$(_a$2, _b$3) {
        var _q$4 = Word$div$(_a$2, _b$3);
        var $259 = Word$sub$(_a$2, Word$mul$(_b$3, _q$4));
        return $259;
    };
    const Word$mod = x0 => x1 => Word$mod$(x0, x1);
    const U32$mod = a0 => a1 => (a0 % a1);
    const U32$sub = a0 => a1 => ((a0 - a1) >>> 0);
    const U32$add = a0 => a1 => ((a0 + a1) >>> 0);
    const U32$or = a0 => a1 => (a0 | a1);

    function Word$fold$(_nil$3, _w0$4, _w1$5, _word$6) {
        var self = _word$6;
        switch (self._) {
            case 'Word.o':
                var $261 = self.pred;
                var $262 = _w0$4(Word$fold$(_nil$3, _w0$4, _w1$5, $261));
                var $260 = $262;
                break;
            case 'Word.i':
                var $263 = self.pred;
                var $264 = _w1$5(Word$fold$(_nil$3, _w0$4, _w1$5, $263));
                var $260 = $264;
                break;
            case 'Word.e':
                var $265 = _nil$3;
                var $260 = $265;
                break;
        };
        return $260;
    };
    const Word$fold = x0 => x1 => x2 => x3 => Word$fold$(x0, x1, x2, x3);
    const Nat$add = a0 => a1 => (a0 + a1);
    const Nat$mul = a0 => a1 => (a0 * a1);

    function Word$to_nat$(_word$2) {
        var $266 = Word$fold$(0n, a1 => (2n * a1), (_x$4 => {
            var $267 = Nat$succ$((2n * _x$4));
            return $267;
        }), _word$2);
        return $266;
    };
    const Word$to_nat = x0 => Word$to_nat$(x0);

    function Word$shl$(_n$2, _value$3) {
        var _n_nat$4 = Word$to_nat$(_n$2);
        var $268 = Word$shift_left$(_n_nat$4, _value$3);
        return $268;
    };
    const Word$shl = x0 => x1 => Word$shl$(x0, x1);
    const U32$shl = a0 => a1 => ((a0 << a1) >>> 0);
    const Pos32$new = a0 => a1 => a2 => ((0 | a0 | (a1 << 12) | (a2 << 24)));

    function Word$trim$(_new_size$2, _word$3) {
        var self = _new_size$2;
        if (self === 0n) {
            var $270 = Word$e;
            var $269 = $270;
        } else {
            var $271 = (self - 1n);
            var self = _word$3;
            switch (self._) {
                case 'Word.o':
                    var $273 = self.pred;
                    var $274 = Word$o$(Word$trim$($271, $273));
                    var $272 = $274;
                    break;
                case 'Word.i':
                    var $275 = self.pred;
                    var $276 = Word$i$(Word$trim$($271, $275));
                    var $272 = $276;
                    break;
                case 'Word.e':
                    var $277 = Word$o$(Word$trim$($271, Word$e));
                    var $272 = $277;
                    break;
            };
            var $269 = $272;
        };
        return $269;
    };
    const Word$trim = x0 => x1 => Word$trim$(x0, x1);
    const Unit$new = null;

    function Array$extract_tip$(_arr$2) {
        var self = _arr$2;
        switch (self._) {
            case 'Array.tip':
                var $279 = self.value;
                var $280 = $279;
                var $278 = $280;
                break;
            case 'Array.tie':
                var $281 = Unit$new;
                var $278 = $281;
                break;
        };
        return $278;
    };
    const Array$extract_tip = x0 => Array$extract_tip$(x0);

    function Array$extract_tie$(_arr$3) {
        var self = _arr$3;
        switch (self._) {
            case 'Array.tie':
                var $283 = self.lft;
                var $284 = self.rgt;
                var $285 = Pair$new$($283, $284);
                var $282 = $285;
                break;
            case 'Array.tip':
                var $286 = Unit$new;
                var $282 = $286;
                break;
        };
        return $282;
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
                        var $287 = self.pred;
                        var $288 = Word$foldl$(_w0$4(_nil$3), _w0$4, _w1$5, $287);
                        return $288;
                    case 'Word.i':
                        var $289 = self.pred;
                        var $290 = Word$foldl$(_w1$5(_nil$3), _w0$4, _w1$5, $289);
                        return $290;
                    case 'Word.e':
                        var $291 = _nil$3;
                        return $291;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Word$foldl = x0 => x1 => x2 => x3 => Word$foldl$(x0, x1, x2, x3);

    function Array$mut$(_idx$3, _f$4, _arr$5) {
        var $292 = Word$foldl$((_arr$6 => {
            var $293 = Array$tip$(_f$4(Array$extract_tip$(_arr$6)));
            return $293;
        }), (_rec$7 => _arr$8 => {
            var self = Array$extract_tie$(_arr$8);
            switch (self._) {
                case 'Pair.new':
                    var $295 = self.fst;
                    var $296 = self.snd;
                    var $297 = Array$tie$(_rec$7($295), $296);
                    var $294 = $297;
                    break;
            };
            return $294;
        }), (_rec$7 => _arr$8 => {
            var self = Array$extract_tie$(_arr$8);
            switch (self._) {
                case 'Pair.new':
                    var $299 = self.fst;
                    var $300 = self.snd;
                    var $301 = Array$tie$($299, _rec$7($300));
                    var $298 = $301;
                    break;
            };
            return $298;
        }), _idx$3)(_arr$5);
        return $292;
    };
    const Array$mut = x0 => x1 => x2 => Array$mut$(x0, x1, x2);

    function Array$set$(_idx$3, _val$4, _arr$5) {
        var $302 = Array$mut$(_idx$3, (_x$6 => {
            var $303 = _val$4;
            return $303;
        }), _arr$5);
        return $302;
    };
    const Array$set = x0 => x1 => x2 => Array$set$(x0, x1, x2);
    const Buffer32$set = a0 => a1 => a2 => ((a2[a0] = a1, a2));
    const VoxBox$set_pos = a0 => a1 => a2 => ((a2.buffer[a0 * 2] = a1, a2));
    const VoxBox$set_col = a0 => a1 => a2 => ((a2.buffer[a0 * 2 + 1] = a1, a2));

    function VoxBox$set_length$(_length$1, _img$2) {
        var self = _img$2;
        switch (self._) {
            case 'VoxBox.new':
                var $305 = self.capacity;
                var $306 = self.buffer;
                var $307 = VoxBox$new$(_length$1, $305, $306);
                var $304 = $307;
                break;
        };
        return $304;
    };
    const VoxBox$set_length = x0 => x1 => VoxBox$set_length$(x0, x1);
    const VoxBox$push = a0 => a1 => a2 => ((a2.buffer[a2.length * 2] = a0, a2.buffer[a2.length * 2 + 1] = a1, a2.length++, a2));

    function VoxBox$Draw$square$(_x$1, _y$2, _z$3, _w$4, _h$5, _col$6, _img$7) {
        var _siz$8 = ((_w$4 * _h$5) >>> 0);
        var _w_2$9 = ((_w$4 / 2) >>> 0);
        var _h_2$10 = ((_h$5 / 2) >>> 0);
        var $308 = (() => {
            var $309 = _img$7;
            var $310 = 0;
            var $311 = _siz$8;
            let _pix$12 = $309;
            for (let _idx$11 = $310; _idx$11 < $311; ++_idx$11) {
                var _v_x$13 = (_idx$11 % _w$4);
                var _v_y$14 = ((_idx$11 / _h$5) >>> 0);
                var _p_x$15 = ((((_x$1 + _v_x$13) >>> 0) - _w_2$9) >>> 0);
                var _p_y$16 = ((((_y$2 + _v_y$14) >>> 0) - _h_2$10) >>> 0);
                var _pos$17 = ((0 | _p_x$15 | (_p_y$16 << 12) | (_z$3 << 24)));
                var _col$18 = _col$6(_v_x$13)(_v_y$14);
                var _pix$19 = ((_pix$12.buffer[_pix$12.length * 2] = _pos$17, _pix$12.buffer[_pix$12.length * 2 + 1] = _col$18, _pix$12.length++, _pix$12));
                var $309 = _pix$19;
                _pix$12 = $309;
            };
            return _pix$12;
        })();
        return $308;
    };
    const VoxBox$Draw$square = x0 => x1 => x2 => x3 => x4 => x5 => x6 => VoxBox$Draw$square$(x0, x1, x2, x3, x4, x5, x6);
    const Col32$new = a0 => a1 => a2 => a3 => ((0 | a0 | (a1 << 8) | (a2 << 16) | (a3 << 24)));

    function DOM$node$(_tag$1, _props$2, _style$3, _children$4) {
        var $312 = ({
            _: 'DOM.node',
            'tag': _tag$1,
            'props': _props$2,
            'style': _style$3,
            'children': _children$4
        });
        return $312;
    };
    const DOM$node = x0 => x1 => x2 => x3 => DOM$node$(x0, x1, x2, x3);

    function BitsMap$(_A$1) {
        var $313 = null;
        return $313;
    };
    const BitsMap = x0 => BitsMap$(x0);

    function Map$(_V$1) {
        var $314 = null;
        return $314;
    };
    const Map = x0 => Map$(x0);
    const BitsMap$new = ({
        _: 'BitsMap.new'
    });

    function BitsMap$tie$(_val$2, _lft$3, _rgt$4) {
        var $315 = ({
            _: 'BitsMap.tie',
            'val': _val$2,
            'lft': _lft$3,
            'rgt': _rgt$4
        });
        return $315;
    };
    const BitsMap$tie = x0 => x1 => x2 => BitsMap$tie$(x0, x1, x2);

    function Maybe$some$(_value$2) {
        var $316 = ({
            _: 'Maybe.some',
            'value': _value$2
        });
        return $316;
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
                var $318 = self.pred;
                var $319 = (Word$to_bits$($318) + '0');
                var $317 = $319;
                break;
            case 'Word.i':
                var $320 = self.pred;
                var $321 = (Word$to_bits$($320) + '1');
                var $317 = $321;
                break;
            case 'Word.e':
                var $322 = Bits$e;
                var $317 = $322;
                break;
        };
        return $317;
    };
    const Word$to_bits = x0 => Word$to_bits$(x0);
    const U16$to_bits = a0 => (u16_to_bits(a0));

    function String$to_bits$(_str$1) {
        var self = _str$1;
        if (self.length === 0) {
            var $324 = Bits$e;
            var $323 = $324;
        } else {
            var $325 = self.charCodeAt(0);
            var $326 = self.slice(1);
            var $327 = (String$to_bits$($326) + (u16_to_bits($325)));
            var $323 = $327;
        };
        return $323;
    };
    const String$to_bits = x0 => String$to_bits$(x0);

    function Map$from_list$(_xs$2) {
        var self = _xs$2;
        switch (self._) {
            case 'List.cons':
                var $329 = self.head;
                var $330 = self.tail;
                var self = $329;
                switch (self._) {
                    case 'Pair.new':
                        var $332 = self.fst;
                        var $333 = self.snd;
                        var $334 = (bitsmap_set(String$to_bits$($332), $333, Map$from_list$($330), 'set'));
                        var $331 = $334;
                        break;
                };
                var $328 = $331;
                break;
            case 'List.nil':
                var $335 = BitsMap$new;
                var $328 = $335;
                break;
        };
        return $328;
    };
    const Map$from_list = x0 => Map$from_list$(x0);
    const List$nil = ({
        _: 'List.nil'
    });

    function List$cons$(_head$2, _tail$3) {
        var $336 = ({
            _: 'List.cons',
            'head': _head$2,
            'tail': _tail$3
        });
        return $336;
    };
    const List$cons = x0 => x1 => List$cons$(x0, x1);

    function DOM$text$(_value$1) {
        var $337 = ({
            _: 'DOM.text',
            'value': _value$1
        });
        return $337;
    };
    const DOM$text = x0 => DOM$text$(x0);

    function DOM$vbox$(_props$1, _style$2, _value$3) {
        var $338 = ({
            _: 'DOM.vbox',
            'props': _props$1,
            'style': _style$2,
            'value': _value$3
        });
        return $338;
    };
    const DOM$vbox = x0 => x1 => x2 => DOM$vbox$(x0, x1, x2);

    function IO$(_A$1) {
        var $339 = null;
        return $339;
    };
    const IO = x0 => IO$(x0);

    function IO$ask$(_query$2, _param$3, _then$4) {
        var $340 = ({
            _: 'IO.ask',
            'query': _query$2,
            'param': _param$3,
            'then': _then$4
        });
        return $340;
    };
    const IO$ask = x0 => x1 => x2 => IO$ask$(x0, x1, x2);

    function IO$bind$(_a$3, _f$4) {
        var self = _a$3;
        switch (self._) {
            case 'IO.end':
                var $342 = self.value;
                var $343 = _f$4($342);
                var $341 = $343;
                break;
            case 'IO.ask':
                var $344 = self.query;
                var $345 = self.param;
                var $346 = self.then;
                var $347 = IO$ask$($344, $345, (_x$8 => {
                    var $348 = IO$bind$($346(_x$8), _f$4);
                    return $348;
                }));
                var $341 = $347;
                break;
        };
        return $341;
    };
    const IO$bind = x0 => x1 => IO$bind$(x0, x1);

    function IO$end$(_value$2) {
        var $349 = ({
            _: 'IO.end',
            'value': _value$2
        });
        return $349;
    };
    const IO$end = x0 => IO$end$(x0);

    function IO$monad$(_new$2) {
        var $350 = _new$2(IO$bind)(IO$end);
        return $350;
    };
    const IO$monad = x0 => IO$monad$(x0);

    function Dynamic$new$(_value$2) {
        var $351 = ({
            _: 'Dynamic.new',
            'value': _value$2
        });
        return $351;
    };
    const Dynamic$new = x0 => Dynamic$new$(x0);
    const App$pass = IO$monad$((_m$bind$1 => _m$pure$2 => {
        var $352 = _m$pure$2;
        return $352;
    }))(Dynamic$new$(Unit$new));

    function App$new$(_init$2, _draw$3, _when$4) {
        var $353 = ({
            _: 'App.new',
            'init': _init$2,
            'draw': _draw$3,
            'when': _when$4
        });
        return $353;
    };
    const App$new = x0 => x1 => x2 => App$new$(x0, x1, x2);
    const Web$ColD = (() => {
        var _img$1 = VoxBox$alloc_capacity$(65536);
        var _init$2 = 0n;
        var _draw$3 = (_state$3 => {
            var _img$4 = VoxBox$Draw$square$(10, 10, 0, 5, 5, (_x$4 => _y$5 => {
                var $356 = ((0 | 255 | (0 << 8) | (0 << 16) | (255 << 24)));
                return $356;
            }), _img$1);
            var $355 = DOM$node$("div", Map$from_list$(List$nil), Map$from_list$(List$nil), List$cons$(DOM$text$("Welcome to ColD :)"), List$cons$(DOM$vbox$(Map$from_list$(List$nil), Map$from_list$(List$nil), _img$4), List$nil)));
            return $355;
        });
        var _when$4 = (_event$4 => _state$5 => {
            var $357 = App$pass;
            return $357;
        });
        var $354 = App$new$(_init$2, _draw$3, _when$4);
        return $354;
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
        'Pair.new': Pair$new,
        'Word.or': Word$or,
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
        'U32.or': U32$or,
        'Word.fold': Word$fold,
        'Nat.add': Nat$add,
        'Nat.mul': Nat$mul,
        'Word.to_nat': Word$to_nat,
        'Word.shl': Word$shl,
        'U32.shl': U32$shl,
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
        'List.cons': List$cons,
        'DOM.text': DOM$text,
        'DOM.vbox': DOM$vbox,
        'IO': IO,
        'IO.ask': IO$ask,
        'IO.bind': IO$bind,
        'IO.end': IO$end,
        'IO.monad': IO$monad,
        'Dynamic.new': Dynamic$new,
        'App.pass': App$pass,
        'App.new': App$new,
        'Web.ColD': Web$ColD,
    };
})();

/***/ })

}]);
//# sourceMappingURL=401.index.js.map